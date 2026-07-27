-- Update submit_match_result to support live matches and time-based scoring
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
  v_correct INT := 0;
  v_total INT := 0;
  v_accuracy NUMERIC(5,2);
  v_max_combo INT := 0;
  v_current_combo INT := 0;
  v_total_time NUMERIC := 0;
  v_avg_time NUMERIC(5,2);
  v_coins INT;
  v_xp INT;
  v_rating NUMERIC(3,1);
  v_match_id UUID;
  v_answer JSONB;
  v_question RECORD;
  v_live_score INT := 0;
  v_response_time INT;
BEGIN
  -- Validate user exists
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated');
  END IF;

  -- Process each answer
  FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
  LOOP
    v_total := v_total + 1;
    
    -- Validate question exists and check answer
    SELECT * INTO v_question FROM questions 
    WHERE id = (v_answer->>'questionId')::UUID AND is_active = true;
    
    IF v_question.id IS NOT NULL THEN
      v_response_time := (v_answer->>'responseTimeMs')::INT;
      
      -- Validate response time is plausible (0 to 30s)
      IF v_response_time >= 0 AND v_response_time <= 30000 THEN
        v_total_time := v_total_time + (v_response_time::NUMERIC / 1000);
        
        IF v_question.correct_index = (v_answer->>'selectedIndex')::INT THEN
          v_correct := v_correct + 1;
          v_current_combo := v_current_combo + 1;
          IF v_current_combo > v_max_combo THEN
            v_max_combo := v_current_combo;
          END IF;
          
          -- Time-based score calculation for live matches (100 base + up to 50 speed bonus for < 10s)
          IF p_match_type = 'live' THEN
             v_live_score := v_live_score + 100 + FLOOR(GREATEST(0, (10000 - v_response_time)::NUMERIC / 10000) * 50);
          END IF;
          
          -- Update question stats
          UPDATE questions SET times_answered = times_answered + 1, times_correct = times_correct + 1 WHERE id = v_question.id;
        ELSE
          v_current_combo := 0;
          UPDATE questions SET times_answered = times_answered + 1 WHERE id = v_question.id;
        END IF;
      END IF;
    END IF;
  END LOOP;

  -- Calculate stats
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

  -- Insert general match record
  INSERT INTO matches (user_id, competition_id, match_type, goals, correct_answers, total_questions, accuracy, avg_response_time, max_combo, match_rating, coins_earned, xp_earned, answers)
  VALUES (v_user_id, p_competition_id, p_match_type, v_correct, v_correct, v_total, v_accuracy, v_avg_time, v_max_combo, v_rating, v_coins, v_xp, p_answers)
  RETURNING id INTO v_match_id;

  -- Update user stats
  UPDATE users SET 
    coins = coins + v_coins,
    xp = xp + v_xp,
    total_matches = total_matches + 1,
    last_active = now()
  WHERE id = v_user_id;

  -- Daily Challenge logic
  IF p_match_type = 'daily' THEN
    INSERT INTO daily_challenge_completions (user_id, challenge_date, score, time_taken_ms)
    VALUES (v_user_id, CURRENT_DATE, (v_correct * 100) + (v_max_combo * 50), (v_total_time * 1000)::INT)
    ON CONFLICT (user_id, challenge_date) DO NOTHING;
  END IF;

  -- Live Match Logic
  IF p_match_type = 'live' AND p_live_match_id IS NOT NULL THEN
    -- Try updating player_a
    UPDATE live_matches 
    SET player_a_score = v_live_score
    WHERE id = p_live_match_id AND player_a_id = v_user_id;
    
    -- Try updating player_b
    UPDATE live_matches 
    SET player_b_score = v_live_score
    WHERE id = p_live_match_id AND player_b_id = v_user_id;
    
    -- In a full implementation, we'd check if both have finished and declare winner_id.
    -- For now, the client decides the winner visually based on Realtime broadcasts.
  END IF;

  RETURN jsonb_build_object(
    'matchId', v_match_id,
    'correct', v_correct,
    'total', v_total,
    'accuracy', v_accuracy,
    'avgResponseTime', v_avg_time,
    'maxCombo', v_max_combo,
    'coins', v_coins,
    'xp', v_xp,
    'rating', v_rating,
    'liveScore', v_live_score
  );
END;
$$;
