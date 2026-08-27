-- ============================================================
-- Migration 023: Admin Portal RBAC & Dynamic System Configurations
-- Football Quiz League - Ethio Telecom VAS
-- ============================================================

-- 1. Ensure user roles column exists in users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'super_admin'));

-- 2. System Configurations Table for Dynamic Game Parameters
CREATE TABLE IF NOT EXISTS system_configurations (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('gameplay', 'economy', 'matchmaking', 'system', 'telco')),
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_system_config_category ON system_configurations(category);

-- Enable RLS
ALTER TABLE system_configurations ENABLE ROW LEVEL SECURITY;

-- Read policy: Anyone authenticated or anonymous can read system configurations
CREATE POLICY system_config_select_policy ON system_configurations
    FOR SELECT USING (true);

-- Write policy: Only super_admin can update or insert configurations
CREATE POLICY system_config_write_policy ON system_configurations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

-- 3. Seed Default System & Game Configurations
INSERT INTO system_configurations (key, value, category, description)
VALUES
    ('quiz_timer_sec', '15'::jsonb, 'gameplay', 'Seconds allowed per quiz question'),
    ('questions_per_match', '10'::jsonb, 'gameplay', 'Number of questions in a standard match'),
    ('max_lifelines_per_match', '2'::jsonb, 'gameplay', 'Maximum lifelines usable per match'),
    ('daily_login_coins', '100'::jsonb, 'economy', 'Coins awarded for daily login streak'),
    ('win_coin_reward', '50'::jsonb, 'economy', 'Coins awarded for winning a match'),
    ('win_xp_reward', '20'::jsonb, 'economy', 'XP awarded for winning a match'),
    ('elo_base_gain', '25'::jsonb, 'matchmaking', 'Base ELO rating points gained on win'),
    ('elo_base_loss', '15'::jsonb, 'matchmaking', 'Base ELO rating points lost on defeat'),
    ('queue_timeout_sec', '30'::jsonb, 'matchmaking', 'Matchmaking queue search timeout before bot pairing'),
    ('bot_fallback_enabled', 'true'::jsonb, 'matchmaking', 'Enable simulated opponent fallback if queue times out'),
    ('maintenance_mode', 'false'::jsonb, 'system', 'Enable global maintenance mode to restrict player logins'),
    ('maintenance_message', '"System is under scheduled maintenance. Please check back soon."'::jsonb, 'system', 'Custom message displayed during maintenance'),
    ('daily_sub_price_etb', '2'::jsonb, 'telco', 'Daily Ethio Telecom subscription price in ETB'),
    ('weekly_airtime_reward_1st', '500'::jsonb, 'telco', '1st place weekly airtime reward in ETB'),
    ('weekly_airtime_reward_2nd', '250'::jsonb, 'telco', '2nd place weekly airtime reward in ETB'),
    ('weekly_airtime_reward_3rd', '100'::jsonb, 'telco', '3rd place weekly airtime reward in ETB')
ON CONFLICT (key) DO NOTHING;

-- 4. Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast audit queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin ON admin_audit_logs(admin_id);

-- Enable RLS
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Read/Write policies for admin audit logs (super_admin only)
CREATE POLICY admin_audit_logs_select ON admin_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

CREATE POLICY admin_audit_logs_insert ON admin_audit_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'super_admin'
        )
    );

-- 5. Helper Function to Check Super Admin Status
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = p_user_id AND role = 'super_admin'
    );
END;
$$;
