-- ============================================================
-- Migration 004: Additional tables for full backend integration
-- EthioFantasy Football Quiz League
-- ============================================================

-- 1. user_preferences (synced settings, replaces localStorage)
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'am', 'om')),
  sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  dark_mode BOOLEAN DEFAULT true,
  notif_daily BOOLEAN DEFAULT true,
  notif_tournament BOOLEAN DEFAULT true,
  notif_rewards BOOLEAN DEFAULT true,
  notif_announcements BOOLEAN DEFAULT true,
  notif_subscription BOOLEAN DEFAULT true,
  notif_system BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. notifications (server-side push, replaces localStorage)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- NULL = broadcast to all
  title_en TEXT NOT NULL,
  title_am TEXT,
  title_om TEXT,
  body_en TEXT NOT NULL,
  body_am TEXT,
  body_om TEXT,
  category TEXT NOT NULL CHECK (category IN ('daily', 'tournament', 'rewards', 'announcements', 'subscription', 'system')),
  read BOOLEAN DEFAULT false,
  action_type TEXT,       -- 'navigate', 'url', etc.
  action_target TEXT,     -- route name or URL
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. messages (server-side messaging, replaces hardcoded arrays)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- NULL = global
  channel TEXT DEFAULT 'global' CHECK (channel IN ('global', 'direct', 'system')),
  body_en TEXT NOT NULL,
  body_am TEXT,
  body_om TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. game_sessions (replaces localStorage ETHIO_ACTIVE_SESSION_V3)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competition_id TEXT REFERENCES competitions(id) ON DELETE SET NULL,
  match_type TEXT NOT NULL CHECK (match_type IN ('solo', 'daily', 'league', 'tournament', 'guess', 'iq', 'penalty')),
  state TEXT DEFAULT 'playing' CHECK (state IN ('playing', 'paused', 'completed', 'abandoned', 'expired')),
  difficulty INT DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 5),
  total_questions INT NOT NULL DEFAULT 10,
  current_question INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  wrong_count INT DEFAULT 0,
  timeout_count INT DEFAULT 0,
  score INT DEFAULT 0,
  final_score INT,
  accuracy NUMERIC(5,2),
  avg_response_time NUMERIC(5,2),
  max_combo INT DEFAULT 0,
  time_remaining NUMERIC(5,1) DEFAULT 15.0,
  question_ids UUID[],
  started_at TIMESTAMPTZ DEFAULT now(),
  paused_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. game_session_answers (replaces localStorage ETHIO_REVIEW_*)
CREATE TABLE IF NOT EXISTS game_session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  question_index INT NOT NULL,
  selected_index INT NOT NULL,     -- -1 for timeout
  correct_index INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_ms INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, question_index)
);

-- 6. rewards (claimable rewards with expiry)
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('match', 'daily', 'weekly', 'tournament', 'achievement', 'referral', 'streak')),
  coins INT DEFAULT 0,
  xp INT DEFAULT 0,
  description_en TEXT,
  description_am TEXT,
  description_om TEXT,
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. faq_items (dynamic FAQ, replaces hardcoded SettingsScreen data)
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question_en TEXT NOT NULL,
  question_am TEXT,
  question_om TEXT,
  answer_en TEXT NOT NULL,
  answer_am TEXT,
  answer_om TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. support_tickets (real ticket system, replaces fake EF-XXXXXX IDs)
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- ============================================================
-- Add missing columns to existing tables
-- ============================================================

-- users: add referral columns and role
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'player' CHECK (role IN ('player', 'admin', 'moderator'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES users(id);

-- ============================================================
-- Indexes for new tables
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id, state);
CREATE INDEX IF NOT EXISTS idx_game_sessions_active ON game_sessions(user_id) WHERE state IN ('playing', 'paused');
CREATE INDEX IF NOT EXISTS idx_game_session_answers_session ON game_session_answers(session_id, question_index);
CREATE INDEX IF NOT EXISTS idx_rewards_user ON rewards(user_id, claimed, expires_at);
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category, sort_order);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id, created_at DESC);

-- ============================================================
-- Update handle_new_user trigger to also create preferences + referral code
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.users (id, username, phone, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Player_' || substr(NEW.id::TEXT, 1, 8)),
    NEW.phone,
    upper(substr(md5(NEW.id::TEXT || now()::TEXT), 1, 8))
  );
  -- Create default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  -- Send welcome notification
  INSERT INTO public.notifications (user_id, title_en, title_am, title_om, body_en, body_am, body_om, category)
  VALUES (
    NEW.id,
    'Welcome to EthioFantasy! ⚽',
    'እንኳን ወደ ኢትዮፋንታሲ በደህና መጡ! ⚽',
    'Baga Gara EthioFantasy Dhuftan! ⚽',
    'Your Football Quiz League journey begins now. Start your first match and earn rewards!',
    'የእግር ኳስ ኩዊዝ ሊግ ጉዞዎ አሁን ይጀምራል። የመጀመሪያ ጨዋታዎን ጀምረው ሽልማት ያግኙ!',
    'Imalii Liigii Gaaffii Kubbaa Miilaa keessan amma eegalee jira. Taphi jalqabaa keessan jalqabaatii badhaasa argadhaa!',
    'system'
  );
  
  RETURN NEW;
END;
$$;
