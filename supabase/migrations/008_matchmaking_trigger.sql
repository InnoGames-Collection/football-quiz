-- =============================================================================
-- Matchmaking Engine: Trigger & Function
-- =============================================================================
-- This file creates a PostgreSQL trigger that fires every time a user is
-- inserted into the `matchmaking_queue`. It looks for another waiting user
-- with a similar ELO rating. If found, it instantly creates a `live_matches`
-- row and deletes both users from the queue.

CREATE OR REPLACE FUNCTION process_matchmaking_queue()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_opponent_id UUID;
  v_match_id UUID;
  v_q_ids UUID[];
BEGIN
  -- 1. Try to find a worthy opponent in the queue (ELO within +/- 200, waiting, not self)
  -- Uses FOR UPDATE SKIP LOCKED to prevent concurrent race conditions
  SELECT user_id INTO v_opponent_id
  FROM matchmaking_queue
  WHERE user_id != NEW.user_id
    AND competition_id = NEW.competition_id
    AND abs(elo_rating - NEW.elo_rating) <= 200
  ORDER BY joined_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  -- 2. If no strict match, fallback to ANY opponent in the same competition
  IF v_opponent_id IS NULL THEN
    SELECT user_id INTO v_opponent_id
    FROM matchmaking_queue
    WHERE user_id != NEW.user_id
      AND competition_id = NEW.competition_id
    ORDER BY joined_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;
  END IF;

  -- 3. If an opponent was found, create a live match
  IF v_opponent_id IS NOT NULL THEN
    -- Generate 5 random questions for the match
    SELECT array_agg(id) INTO v_q_ids
    FROM (
      SELECT id FROM questions
      WHERE competition_id = NEW.competition_id OR competition_id IS NULL
      ORDER BY random()
      LIMIT 5
    ) random_q;

    -- Insert into live_matches
    INSERT INTO live_matches (player_a_id, player_b_id, competition_id, question_ids, status, started_at)
    VALUES (NEW.user_id, v_opponent_id, NEW.competition_id, v_q_ids, 'in_progress', now())
    RETURNING id INTO v_match_id;

    -- Delete both users from the queue
    DELETE FROM matchmaking_queue WHERE user_id IN (NEW.user_id, v_opponent_id);

    -- We return NULL because we just deleted the NEW row from the queue, 
    -- but returning NEW is standard for AFTER INSERT triggers to not abort the transaction.
    -- However, since this is AFTER INSERT, returning NEW is fine, the DELETE takes effect.
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger on the matchmaking_queue table
DROP TRIGGER IF EXISTS trigger_matchmaking_queue ON matchmaking_queue;
CREATE TRIGGER trigger_matchmaking_queue
AFTER INSERT ON matchmaking_queue
FOR EACH ROW
EXECUTE FUNCTION process_matchmaking_queue();
