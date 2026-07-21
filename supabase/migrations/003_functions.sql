-- Function: Submit and validate a match result
CREATE OR REPLACE FUNCTION submit_match_result(
  p_match_type TEXT,
  p_competition_id TEXT DEFAULT NULL,
  p_answers JSONB DEFAULT '[]'::JSONB
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
      -- Validate response time is plausible (500ms to 30s)
      IF (v_answer->>'responseTimeMs')::INT BETWEEN 500 AND 30000 THEN
        v_total_time := v_total_time + (v_answer->>'responseTimeMs')::NUMERIC / 1000;
        
        IF v_question.correct_index = (v_answer->>'selectedIndex')::INT THEN
          v_correct := v_correct + 1;
          v_current_combo := v_current_combo + 1;
          IF v_current_combo > v_max_combo THEN
            v_max_combo := v_current_combo;
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

  -- Insert match record
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

  RETURN jsonb_build_object(
    'matchId', v_match_id,
    'correct', v_correct,
    'total', v_total,
    'accuracy', v_accuracy,
    'avgResponseTime', v_avg_time,
    'maxCombo', v_max_combo,
    'coins', v_coins,
    'xp', v_xp,
    'rating', v_rating
  );
END;
$$;

-- Function: Get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(
  p_competition_id TEXT DEFAULT NULL,
  p_time_range TEXT DEFAULT 'all_time',
  p_limit INT DEFAULT 50
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_agg(row_to_json(lb))
  INTO v_result
  FROM (
    SELECT 
      le.user_id,
      u.username,
      u.avatar_url,
      u.elo_rating,
      le.score,
      le.matches_played,
      le.wins,
      ROW_NUMBER() OVER (ORDER BY le.score DESC) as rank
    FROM leaderboard_entries le
    JOIN users u ON u.id = le.user_id
    WHERE (p_competition_id IS NULL OR le.competition_id = p_competition_id)
      AND le.time_range = p_time_range
    ORDER BY le.score DESC
    LIMIT p_limit
  ) lb;

  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;

-- Function: Get today's daily challenge
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
  SELECT * INTO v_challenge FROM daily_challenges 
  WHERE challenge_date = CURRENT_DATE;

  IF v_challenge IS NULL THEN
    RETURN jsonb_build_object('available', false, 'message', 'No challenge today');
  END IF;

  SELECT EXISTS(SELECT 1 FROM daily_challenge_completions WHERE user_id = v_user_id AND challenge_date = CURRENT_DATE)
  INTO v_completed;

  RETURN jsonb_build_object(
    'available', true,
    'id', v_challenge.id,
    'theme_en', v_challenge.theme_en,
    'theme_am', v_challenge.theme_am,
    'theme_om', v_challenge.theme_om,
    'questionIds', v_challenge.question_ids,
    'bonusMultiplier', v_challenge.bonus_multiplier,
    'completed', v_completed
  );
END;
$$;

-- Function: Claim daily streak
CREATE OR REPLACE FUNCTION claim_daily_streak()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_current_streak INT;
  v_last_date DATE;
  v_new_streak INT;
  v_bonus_coins INT;
BEGIN
  SELECT streak_count, streak_last_date INTO v_current_streak, v_last_date
  FROM users WHERE id = v_user_id;

  -- Already claimed today
  IF v_last_date = CURRENT_DATE THEN
    RETURN jsonb_build_object('success', false, 'message', 'Already claimed today', 'streak', v_current_streak);
  END IF;

  -- Check if streak continues or resets
  IF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    v_new_streak := v_current_streak + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  -- Bonus coins for milestones
  v_bonus_coins := CASE
    WHEN v_new_streak % 30 = 0 THEN 500
    WHEN v_new_streak % 7 = 0 THEN 100
    ELSE 10
  END;

  UPDATE users SET 
    streak_count = v_new_streak,
    streak_last_date = CURRENT_DATE,
    coins = coins + v_bonus_coins
  WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'streak', v_new_streak,
    'bonusCoins', v_bonus_coins,
    'milestone', v_new_streak % 7 = 0 OR v_new_streak % 30 = 0
  );
END;
$$;

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, username, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player_' || substr(NEW.id::TEXT, 1, 8)),
    NEW.phone
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
