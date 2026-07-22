-- Enable pg_cron extension for scheduled database tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1. Function & Schedule: Update Competition Status (Runs every hour)
CREATE OR REPLACE FUNCTION update_competition_statuses()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark upcoming competitions as active if start_at has passed
  UPDATE competitions
  SET is_active = true
  WHERE is_active = false AND created_at <= now();

  -- Mark expired seasons as completed
  UPDATE seasons
  SET status = 'completed'
  WHERE status = 'active' AND ends_at <= now();

  -- Activate upcoming seasons
  UPDATE seasons
  SET status = 'active'
  WHERE status = 'upcoming' AND starts_at <= now() AND ends_at > now();
END;
$$;

SELECT cron.schedule(
  'update-competitions-hourly',
  '0 * * * *', -- Every hour at minute 0
  'SELECT update_competition_statuses();'
);

-- 2. Function & Schedule: Generate Daily Challenge (Runs every day at Midnight UTC)
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
BEGIN
  -- Pick 10 random active question IDs
  SELECT array_agg(id) INTO v_q_ids
  FROM (
    SELECT id FROM questions
    WHERE is_active = true
    ORDER BY random()
    LIMIT 10
  ) random_q;

  IF v_q_ids IS NOT NULL AND array_length(v_q_ids, 1) > 0 THEN
    v_selected_theme := v_themes[1 + floor(random() * array_length(v_themes, 1))::INT];
    
    INSERT INTO daily_challenges (challenge_date, theme_en, theme_am, theme_om, question_ids, bonus_multiplier)
    VALUES (
      CURRENT_DATE + INTERVAL '1 day',
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

SELECT cron.schedule(
  'generate-daily-challenge-midnight',
  '0 0 * * *', -- Every day at midnight UTC
  'SELECT generate_daily_challenge();'
);

-- 3. Function & Schedule: Clean Expired Rewards & Unclaimed Subscriptions (Runs daily at 01:00 UTC)
CREATE OR REPLACE FUNCTION cleanup_expired_rewards()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark subscriptions as expired if expires_at is past
  UPDATE subscriptions
  SET status = 'expired'
  WHERE status = 'active' AND expires_at <= now();

  -- Clean old matchmaking queue entries (older than 10 minutes)
  DELETE FROM matchmaking_queue
  WHERE joined_at < (now() - INTERVAL '10 minutes');
END;
$$;

SELECT cron.schedule(
  'cleanup-expired-rewards-daily',
  '0 1 * * *', -- Every day at 01:00 UTC
  'SELECT cleanup_expired_rewards();'
);

-- 4. Function & Schedule: Aggregate Daily Leaderboard Entries (Runs daily at 23:55 UTC)
CREATE OR REPLACE FUNCTION refresh_daily_leaderboards()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Populate or update daily leaderboard entries from matches played today
  INSERT INTO leaderboard_entries (user_id, competition_id, season_id, time_range, score, matches_played, wins, updated_at)
  SELECT 
    m.user_id,
    m.competition_id,
    m.season_id,
    'daily'::TEXT,
    SUM(COALESCE(m.goals, 0) * 100 + COALESCE(m.correct_answers, 0) * 20)::INT as score,
    COUNT(m.id)::INT as matches_played,
    COUNT(CASE WHEN m.is_winner THEN 1 END)::INT as wins,
    now()
  FROM matches m
  WHERE m.played_at >= CURRENT_DATE
  GROUP BY m.user_id, m.competition_id, m.season_id
  ON CONFLICT (user_id, competition_id, season_id, time_range) 
  DO UPDATE SET 
    score = EXCLUDED.score,
    matches_played = EXCLUDED.matches_played,
    wins = EXCLUDED.wins,
    updated_at = now();
END;
$$;

SELECT cron.schedule(
  'refresh-daily-leaderboard',
  '55 23 * * *', -- Every day at 23:55 UTC
  'SELECT refresh_daily_leaderboards();'
);
