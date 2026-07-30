-- Security Hardening for Daily Challenge Submissions
CREATE OR REPLACE FUNCTION submit_match_result(
  p_match_type TEXT,
  p_competition_id TEXT DEFAULT NULL,
  p_answers JSONB DEFAULT '[]'::JSONB,
  p_live_match_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_match_id UUID;
  v_correct INT := 0;
  v_total INT := jsonb_array_length(p_answers);
  v_total_time NUMERIC := 0;
  v_current_combo INT := 0;
  v_max_combo INT := 0;
  v_accuracy NUMERIC;
  v_avg_time NUMERIC;
  v_coins INT := 0;
  v_xp INT := 0;
  v_rating NUMERIC;
  
  v_answer JSONB;
  v_question RECORD;
  v_response_time INT;
  
  v_live_score INT := 0;
  
  -- Anti-cheat variables
  v_is_cheater BOOLEAN := false;
  v_fast_answers INT := 0;
  v_suspicious_patterns INT := 0;

  -- Daily Challenge specifics
  v_daily_questions UUID[];
  v_submitted_q_id UUID;
BEGIN
  -- 1. Daily Challenge Pre-validation & Concurrency Lock
  IF p_match_type = 'daily' THEN
    -- Check existence first for clean error message (optimization)
    IF EXISTS(SELECT 1 FROM daily_challenge_completions WHERE user_id = v_user_id AND challenge_date = public.eat_today()) THEN
      RETURN jsonb_build_object('error', 'Daily challenge already completed today');
    END IF;

    -- Fetch today's official questions
    SELECT question_ids INTO v_daily_questions FROM daily_challenges WHERE challenge_date = public.eat_today();
    IF v_daily_questions IS NULL THEN
      RETURN jsonb_build_object('error', 'No daily challenge available today');
    END IF;

    -- Ensure they are answering the exact number of questions
    IF v_total != array_length(v_daily_questions, 1) THEN
      RETURN jsonb_build_object('error', 'Invalid number of answers provided for daily challenge');
    END IF;

    -- Lock participation immediately (score will be updated at the end)
    BEGIN
      INSERT INTO daily_challenge_completions (user_id, challenge_date, score, time_taken_ms)
      VALUES (v_user_id, public.eat_today(), 0, 0);
    EXCEPTION WHEN unique_violation THEN
      RETURN jsonb_build_object('error', 'Daily challenge already completed today (Concurrency blocked)');
    END;
  END IF;

  FOR i IN 0..v_total-1 LOOP
    v_answer := p_answers->i;
    v_response_time := (v_answer->>'responseTimeMs')::INT;
    v_submitted_q_id := (v_answer->>'questionId')::UUID;
    
    -- 2. Validate Question Integrity for Daily Challenge
    IF p_match_type = 'daily' THEN
      IF NOT (v_submitted_q_id = ANY(v_daily_questions)) THEN
        RETURN jsonb_build_object('error', 'Invalid question ID for today''s daily challenge');
      END IF;
    END IF;

    SELECT * INTO v_question FROM questions WHERE id = v_submitted_q_id;
    
    IF FOUND THEN
      -- Basic Anti-Cheat checks
      IF v_response_time < 500 THEN
         v_fast_answers := v_fast_answers + 1;
      END IF;
      
      IF v_fast_answers > 3 THEN
         v_is_cheater := true;
      END IF;

      -- Validate response time is plausible (0 to 30s)
      IF v_response_time >= 0 AND v_response_time <= 30000 THEN
        v_total_time := v_total_time + (v_response_time::NUMERIC / 1000);
        
        IF v_question.correct_index = (v_answer->>'selectedIndex')::INT THEN
          v_correct := v_correct + 1;
          v_current_combo := v_current_combo + 1;
          IF v_current_combo > v_max_combo THEN
            v_max_combo := v_current_combo;
          END IF;
          
          IF p_match_type = 'live' THEN
             v_live_score := v_live_score + 100 + FLOOR(GREATEST(0, (10000 - v_response_time)::NUMERIC / 10000) * 50);
          END IF;
          
          UPDATE questions SET times_answered = times_answered + 1, times_correct = times_correct + 1 WHERE id = v_question.id;
        ELSE
          v_current_combo := 0;
          UPDATE questions SET times_answered = times_answered + 1 WHERE id = v_question.id;
        END IF;
      END IF;
    END IF;
  END LOOP;

  IF v_total > 0 THEN
    v_accuracy := ROUND((v_correct::NUMERIC / v_total) * 100, 2);
    v_avg_time := ROUND(v_total_time / v_total, 2);
  ELSE
    v_accuracy := 0;
    v_avg_time := 0;
  END IF;

  v_coins := (v_correct * 100) + (v_max_combo * 50);
  v_xp := (v_correct * 20) + (v_max_combo * 10);
  v_rating := LEAST(10.0, GREATEST(3.0, 5.0 + (v_accuracy / 20) + (v_max_combo * 0.4) + (CASE WHEN v_avg_time < 5 THEN 1.0 ELSE 0.0 END)));

  IF v_is_cheater THEN
    v_correct := 0;
    v_accuracy := 0;
    v_coins := 0;
    v_xp := 0;
    v_live_score := 0;
    v_rating := 0;
  END IF;

  INSERT INTO matches (user_id, competition_id, match_type, goals, correct_answers, total_questions, accuracy, avg_response_time, max_combo, match_rating, coins_earned, xp_earned, answers)
  VALUES (v_user_id, p_competition_id, p_match_type, v_correct, v_correct, v_total, v_accuracy, v_avg_time, v_max_combo, v_rating, v_coins, v_xp, p_answers)
  RETURNING id INTO v_match_id;

  UPDATE users SET 
    coins = coins + v_coins,
    xp = xp + v_xp,
    total_matches = total_matches + 1,
    last_active = now()
  WHERE id = v_user_id;

  -- 3. Finalize Daily Challenge Score
  IF p_match_type = 'daily' THEN
    UPDATE daily_challenge_completions 
    SET score = (v_correct * 100) + (v_max_combo * 50),
        time_taken_ms = (v_total_time * 1000)::INT
    WHERE user_id = v_user_id AND challenge_date = public.eat_today();
  END IF;

  -- Live Match Logic
  IF p_match_type = 'live' AND p_live_match_id IS NOT NULL THEN
    UPDATE live_matches SET player_a_score = v_live_score WHERE id = p_live_match_id AND player_a_id = v_user_id;
    UPDATE live_matches SET player_b_score = v_live_score WHERE id = p_live_match_id AND player_b_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'matchId', v_match_id,
    'correct', v_correct,
    'total', v_total,
    'accuracy', v_accuracy,
    'avgTime', v_avg_time,
    'maxCombo', v_max_combo,
    'coinsEarned', v_coins,
    'xpEarned', v_xp,
    'matchRating', v_rating
  );
END;
$$;
