-- Remove the old trigger we just created (if it exists)
DROP TRIGGER IF EXISTS trigger_update_leaderboard ON game_sessions;
DROP FUNCTION IF EXISTS update_leaderboard_on_session_complete;

-- Rewrite the get_leaderboard function to calculate scores dynamically on-the-fly
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
  v_start_date TIMESTAMPTZ;
BEGIN
  -- Determine the start date for the requested time range
  IF p_time_range = 'daily' THEN
    v_start_date := date_trunc('day', now());
  ELSIF p_time_range = 'weekly' THEN
    v_start_date := date_trunc('week', now());
  ELSIF p_time_range = 'monthly' THEN
    v_start_date := date_trunc('month', now());
  ELSE
    v_start_date := '1970-01-01 00:00:00'::TIMESTAMPTZ;
  END IF;

  SELECT jsonb_agg(row_to_json(lb))
  INTO v_result
  FROM (
    SELECT 
      gs.user_id,
      u.username,
      u.avatar_url,
      u.elo_rating,
      SUM(COALESCE(gs.final_score, 0))::INT as score,
      COUNT(gs.id)::INT as matches_played,
      SUM(CASE WHEN COALESCE(gs.final_score, 0) > 500 THEN 1 ELSE 0 END)::INT as wins,
      ROW_NUMBER() OVER (ORDER BY SUM(COALESCE(gs.final_score, 0)) DESC) as rank
    FROM game_sessions gs
    JOIN users u ON u.id = gs.user_id
    WHERE gs.state = 'completed'
      AND gs.completed_at >= v_start_date
      AND (p_competition_id IS NULL OR gs.competition_id = p_competition_id)
    GROUP BY gs.user_id, u.username, u.avatar_url, u.elo_rating
    HAVING SUM(COALESCE(gs.final_score, 0)) > 0
    ORDER BY score DESC
    LIMIT p_limit
  ) lb;

  RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;
