-- Add score and time tracking to daily_challenge_completions
ALTER TABLE daily_challenge_completions 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS time_taken_ms INTEGER DEFAULT 0;

-- Function to get the daily leaderboard for a specific date
CREATE OR REPLACE FUNCTION get_daily_leaderboard(p_date DATE)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    avatar_url TEXT,
    score INTEGER,
    time_taken_ms INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.user_id,
        u.username,
        u.avatar_url,
        c.score,
        c.time_taken_ms
    FROM daily_challenge_completions c
    JOIN users u ON u.id = c.user_id
    WHERE c.challenge_date = p_date
    ORDER BY c.score DESC, c.time_taken_ms ASC
    LIMIT 100;
END;
$$;
