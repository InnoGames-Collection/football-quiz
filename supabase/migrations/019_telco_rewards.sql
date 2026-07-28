-- telco_rewards_queue.sql
-- Queue table for integrating with Ethiotelecom SMS gateway

CREATE TABLE IF NOT EXISTS telco_rewards_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    msisdn TEXT NOT NULL,
    reward_type TEXT NOT NULL, -- e.g., 'airtime', 'data', 'sms'
    reward_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    period_type TEXT NOT NULL, -- 'weekly', 'monthly', 'yearly'
    period_start_date DATE NOT NULL,
    rank_position INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    response_payload JSONB
);

-- Index for processing
CREATE INDEX idx_telco_rewards_queue_status ON telco_rewards_queue(status) WHERE status = 'pending';

-- Function to queue top 3 players for a given period
CREATE OR REPLACE FUNCTION process_telco_rewards(
  p_period_type TEXT,
  p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start_date DATE;
  v_entry RECORD;
  v_reward_amount NUMERIC;
BEGIN
  -- Determine start date based on period
  IF p_period_type = 'weekly' THEN
    v_start_date := date_trunc('week', p_date)::DATE;
  ELSIF p_period_type = 'monthly' THEN
    v_start_date := date_trunc('month', p_date)::DATE;
  ELSIF p_period_type = 'yearly' THEN
    v_start_date := date_trunc('year', p_date)::DATE;
  ELSE
    RETURN;
  END IF;

  -- Insert top 3 into the queue if they aren't already queued for this period
  FOR v_entry IN (
    SELECT t.user_id, u.msisdn, RANK() OVER (ORDER BY t.total_score DESC, t.total_time_ms ASC) as rnk
    FROM tournament_leaderboards t
    JOIN users u ON u.id = t.user_id
    WHERE t.period_type = p_period_type AND t.period_start_date = v_start_date
    ORDER BY t.total_score DESC, t.total_time_ms ASC
    LIMIT 3
  ) LOOP
    IF v_entry.msisdn IS NOT NULL THEN
      -- Determine reward amount (mock logic for now)
      IF v_entry.rnk = 1 THEN v_reward_amount := 500; -- e.g., 500 ETB airtime
      ELSIF v_entry.rnk = 2 THEN v_reward_amount := 250;
      ELSE v_reward_amount := 100;
      END IF;

      INSERT INTO telco_rewards_queue (
        user_id, msisdn, reward_type, reward_amount, period_type, period_start_date, rank_position
      )
      SELECT v_entry.user_id, v_entry.msisdn, 'airtime', v_reward_amount, p_period_type, v_start_date, v_entry.rnk
      WHERE NOT EXISTS (
        SELECT 1 FROM telco_rewards_queue
        WHERE user_id = v_entry.user_id 
          AND period_type = p_period_type 
          AND period_start_date = v_start_date
      );
    END IF;
  END LOOP;
END;
$$;
