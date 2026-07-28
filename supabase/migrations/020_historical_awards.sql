-- 020_historical_awards.sql

CREATE OR REPLACE FUNCTION get_past_tournament_winners(p_period_type TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start_date DATE;
  v_results JSONB;
BEGIN
  IF p_period_type = 'daily' THEN
    v_start_date := CURRENT_DATE - 1;
    
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'user_id', u.id,
        'username', u.username,
        'msisdn', u.msisdn,
        'score', c.score,
        'time_ms', c.time_taken_ms,
        'rank', rnk
      )
    ), '[]'::jsonb) INTO v_results
    FROM (
      SELECT user_id, score, time_taken_ms,
             RANK() OVER (ORDER BY score DESC, time_taken_ms ASC) as rnk
      FROM daily_challenge_completions
      WHERE challenge_date = v_start_date
      ORDER BY score DESC, time_taken_ms ASC
      LIMIT 3
    ) c
    JOIN users u ON u.id = c.user_id;
    
  ELSIF p_period_type = 'weekly' THEN
    v_start_date := date_trunc('week', CURRENT_DATE - INTERVAL '1 week')::DATE;
    
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'user_id', u.id,
        'username', u.username,
        'msisdn', u.msisdn,
        'score', t.total_score,
        'time_ms', t.total_time_ms,
        'rank', rnk
      )
    ), '[]'::jsonb) INTO v_results
    FROM (
      SELECT user_id, total_score, total_time_ms,
             RANK() OVER (ORDER BY total_score DESC, total_time_ms ASC) as rnk
      FROM tournament_leaderboards
      WHERE period_type = 'weekly' AND period_start_date = v_start_date
      ORDER BY total_score DESC, total_time_ms ASC
      LIMIT 3
    ) t
    JOIN users u ON u.id = t.user_id;

  ELSIF p_period_type = 'monthly' THEN
    v_start_date := date_trunc('month', CURRENT_DATE - INTERVAL '1 month')::DATE;
    
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'user_id', u.id,
        'username', u.username,
        'msisdn', u.msisdn,
        'score', t.total_score,
        'time_ms', t.total_time_ms,
        'rank', rnk
      )
    ), '[]'::jsonb) INTO v_results
    FROM (
      SELECT user_id, total_score, total_time_ms,
             RANK() OVER (ORDER BY total_score DESC, total_time_ms ASC) as rnk
      FROM tournament_leaderboards
      WHERE period_type = 'monthly' AND period_start_date = v_start_date
      ORDER BY total_score DESC, total_time_ms ASC
      LIMIT 3
    ) t
    JOIN users u ON u.id = t.user_id;
  ELSE
    RETURN '[]'::jsonb;
  END IF;

  RETURN v_results;
END;
$$;
