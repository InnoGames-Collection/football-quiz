-- Create EAT time functions for Ethiopia Timezone (UTC+3)
CREATE OR REPLACE FUNCTION public.eat_today()
RETURNS date LANGUAGE sql STABLE AS $$
  SELECT (timezone('Africa/Addis_Ababa', now()))::date;
$$;

CREATE OR REPLACE FUNCTION public.eat_day_start(p date)
RETURNS timestamptz LANGUAGE sql STABLE AS $$
  SELECT (p::timestamp AT TIME ZONE 'Africa/Addis_Ababa');
$$;

CREATE OR REPLACE FUNCTION public.eat_day_end(p date)
RETURNS timestamptz LANGUAGE sql STABLE AS $$
  SELECT ((p::timestamp + time '23:59:59.999') AT TIME ZONE 'Africa/Addis_Ababa');
$$;

-- Update get_daily_challenge to use eat_today()
CREATE OR REPLACE FUNCTION get_daily_challenge()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_challenge RECORD;
  v_completed BOOLEAN;
  v_user_id UUID := auth.uid();
BEGIN
  -- Always find the challenge for eat_today()
  SELECT * INTO v_challenge FROM daily_challenges 
  WHERE challenge_date = public.eat_today();

  IF v_challenge IS NULL THEN
    RETURN jsonb_build_object('available', false, 'message', 'No challenge today');
  END IF;

  SELECT EXISTS(SELECT 1 FROM daily_challenge_completions WHERE user_id = v_user_id AND challenge_date = public.eat_today())
  INTO v_completed;

  RETURN jsonb_build_object(
    'available', true,
    'id', v_challenge.id,
    'theme_en', v_challenge.theme_en,
    'theme_am', v_challenge.theme_am,
    'theme_om', v_challenge.theme_om,
    'bonusMultiplier', v_challenge.bonus_multiplier,
    'completed', v_completed,
    'question_ids', v_challenge.question_ids
  );
END;
$$;

-- Patch submit_match_result to enforce eat_today()
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
BEGIN
  -- Strict Daily Challenge guard
  IF p_match_type = 'daily' THEN
    IF EXISTS(SELECT 1 FROM daily_challenge_completions WHERE user_id = v_user_id AND challenge_date = public.eat_today()) THEN
      RETURN jsonb_build_object('error', 'Daily challenge already completed today');
    END IF;
  END IF;

  FOR i IN 0..v_total-1 LOOP
    v_answer := p_answers->i;
    v_response_time := (v_answer->>'responseTimeMs')::INT;
    
    SELECT * INTO v_question FROM questions WHERE id = (v_answer->>'questionId')::UUID;
    
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

  -- Daily Challenge logic
  IF p_match_type = 'daily' THEN
    INSERT INTO daily_challenge_completions (user_id, challenge_date, score, time_taken_ms)
    VALUES (v_user_id, public.eat_today(), (v_correct * 100) + (v_max_combo * 50), (v_total_time * 1000)::INT)
    ON CONFLICT (user_id, challenge_date) DO NOTHING;
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

-- Update generate_daily_challenge to be idempotent and generate for eat_today()
CREATE OR REPLACE FUNCTION generate_daily_challenge()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_q_ids UUID[];
  v_themes TEXT[] := ARRAY[
    'Tactical Mastermind Day',
    'World Cup Heroics',
    'Ethiopian League Legends',
    'Champions League Drama',
    'Golden Boot Striker Challenge'
  ];
  v_selected_theme TEXT;
  v_selected_category TEXT;
  v_today DATE := public.eat_today();
BEGIN
  -- Idempotency check: don't generate if today's challenge exists
  IF EXISTS (SELECT 1 FROM daily_challenges WHERE challenge_date = v_today) THEN
    RETURN;
  END IF;

  -- Pick 1 random category that has at least 10 tournament questions
  SELECT category INTO v_selected_category
  FROM questions
  WHERE is_active = true AND usage_type = 'tournament'
  GROUP BY category
  HAVING count(*) >= 10
  ORDER BY random()
  LIMIT 1;

  IF v_selected_category IS NULL THEN
    SELECT array_agg(id) INTO v_q_ids
    FROM (
      SELECT id FROM questions
      WHERE is_active = true AND usage_type = 'tournament'
      ORDER BY random()
      LIMIT 10
    ) fallback_q;
  ELSE
    SELECT array_agg(id) INTO v_q_ids
    FROM (
      SELECT id FROM questions
      WHERE is_active = true 
        AND usage_type = 'tournament'
        AND category = v_selected_category
      ORDER BY random()
      LIMIT 10
    ) random_q;
  END IF;

  IF v_q_ids IS NOT NULL AND array_length(v_q_ids, 1) > 0 THEN
    v_selected_theme := v_themes[1 + floor(random() * array_length(v_themes, 1))::INT];
    
    INSERT INTO daily_challenges (challenge_date, theme_en, theme_am, theme_om, question_ids, bonus_multiplier)
    VALUES (
      v_today,
      v_selected_theme,
      'የቀኑ ልዩ ጥያቄዎች',
      'Gaaffilee Addaa Hardhaa',
      v_q_ids,
      1.5
    )
    ON CONFLICT (challenge_date) DO NOTHING;
  END IF;
END;
$$;

-- Setup the pg_cron to run frequently (every 10 minutes)
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  
  -- Remove previous crons
  PERFORM cron.unschedule('daily-challenge-generator-v2') 
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-challenge-generator-v2');
  PERFORM cron.unschedule('daily-challenge-generator') 
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-challenge-generator');
    
  -- Schedule the new idempotent frequent runner
  PERFORM cron.unschedule('daily-challenge-generator-frequent')
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-challenge-generator-frequent');
  
  PERFORM cron.schedule('daily-challenge-generator-frequent', '*/10 * * * *',
    $cron$ SELECT public.generate_daily_challenge(); $cron$);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'pg_cron not available.';
END $$;
