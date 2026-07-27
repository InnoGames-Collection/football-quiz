-- 1. Add usage_type to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS usage_type TEXT DEFAULT 'casual' CHECK (usage_type IN ('casual', 'tournament', 'both'));

-- Update existing questions to 'both' so they can be played anywhere for now, or just 'casual'
-- Let's make existing ones 'casual' to be safe, but since it's development, 'both' lets us test tournaments
UPDATE questions SET usage_type = 'both' WHERE usage_type IS NULL;

-- 2. Create the accumulated tournament leaderboards table
CREATE TABLE IF NOT EXISTS tournament_leaderboards (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period_type TEXT CHECK (period_type IN ('weekly', 'monthly', 'yearly')),
  period_start_date DATE NOT NULL,
  total_score INT DEFAULT 0,
  total_time_ms INT DEFAULT 0,
  matches_played INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, period_type, period_start_date)
);

-- RLS for tournament_leaderboards
ALTER TABLE tournament_leaderboards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view tournament leaderboards"
  ON tournament_leaderboards FOR SELECT
  USING (true);

-- 3. Create Trigger to automatically accumulate scores
CREATE OR REPLACE FUNCTION update_tournament_leaderboards()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Weekly
  INSERT INTO tournament_leaderboards (user_id, period_type, period_start_date, total_score, total_time_ms, matches_played, updated_at)
  VALUES (
    NEW.user_id, 
    'weekly', 
    date_trunc('week', NEW.challenge_date)::DATE, 
    NEW.score, 
    NEW.time_taken_ms, 
    1, 
    now()
  )
  ON CONFLICT (user_id, period_type, period_start_date) DO UPDATE
  SET total_score = tournament_leaderboards.total_score + EXCLUDED.total_score,
      total_time_ms = tournament_leaderboards.total_time_ms + EXCLUDED.total_time_ms,
      matches_played = tournament_leaderboards.matches_played + 1,
      updated_at = now();

  -- Monthly
  INSERT INTO tournament_leaderboards (user_id, period_type, period_start_date, total_score, total_time_ms, matches_played, updated_at)
  VALUES (
    NEW.user_id, 
    'monthly', 
    date_trunc('month', NEW.challenge_date)::DATE, 
    NEW.score, 
    NEW.time_taken_ms, 
    1, 
    now()
  )
  ON CONFLICT (user_id, period_type, period_start_date) DO UPDATE
  SET total_score = tournament_leaderboards.total_score + EXCLUDED.total_score,
      total_time_ms = tournament_leaderboards.total_time_ms + EXCLUDED.total_time_ms,
      matches_played = tournament_leaderboards.matches_played + 1,
      updated_at = now();

  -- Yearly
  INSERT INTO tournament_leaderboards (user_id, period_type, period_start_date, total_score, total_time_ms, matches_played, updated_at)
  VALUES (
    NEW.user_id, 
    'yearly', 
    date_trunc('year', NEW.challenge_date)::DATE, 
    NEW.score, 
    NEW.time_taken_ms, 
    1, 
    now()
  )
  ON CONFLICT (user_id, period_type, period_start_date) DO UPDATE
  SET total_score = tournament_leaderboards.total_score + EXCLUDED.total_score,
      total_time_ms = tournament_leaderboards.total_time_ms + EXCLUDED.total_time_ms,
      matches_played = tournament_leaderboards.matches_played + 1,
      updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_tournament_leaderboards ON daily_challenge_completions;
CREATE TRIGGER trigger_update_tournament_leaderboards
AFTER INSERT ON daily_challenge_completions
FOR EACH ROW
EXECUTE FUNCTION update_tournament_leaderboards();

-- 4. Create an RPC to fetch tournament leaderboards securely
CREATE OR REPLACE FUNCTION get_tournament_leaderboard(
  p_period_type TEXT,
  p_date DATE DEFAULT CURRENT_DATE,
  p_limit INT DEFAULT 100
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start_date DATE;
  v_result JSONB;
BEGIN
  -- Determine start date based on period
  IF p_period_type = 'weekly' THEN
    v_start_date := date_trunc('week', p_date)::DATE;
  ELSIF p_period_type = 'monthly' THEN
    v_start_date := date_trunc('month', p_date)::DATE;
  ELSIF p_period_type = 'yearly' THEN
    v_start_date := date_trunc('year', p_date)::DATE;
  ELSE
    RETURN jsonb_build_array();
  END IF;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'userId', t.user_id,
      'username', u.username,
      'score', t.total_score,
      'matchesPlayed', t.matches_played,
      'totalTimeMs', t.total_time_ms
    )
  ), '[]'::jsonb)
  INTO v_result
  FROM tournament_leaderboards t
  JOIN users u ON u.id = t.user_id
  WHERE t.period_type = p_period_type AND t.period_start_date = v_start_date
  -- Order by score DESC, and resolve ties with total_time_ms ASC
  ORDER BY t.total_score DESC, t.total_time_ms ASC
  LIMIT p_limit;

  RETURN v_result;
END;
$$;
