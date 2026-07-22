-- users table (references auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'am', 'om')),
  elo_rating INT DEFAULT 0,
  coins INT DEFAULT 0,
  xp INT DEFAULT 0,
  total_matches INT DEFAULT 0,
  total_wins INT DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  streak_count INT DEFAULT 0,
  streak_last_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now()
);

-- competitions table
CREATE TABLE competitions (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_am TEXT,
  name_om TEXT,
  badge TEXT NOT NULL,
  description_en TEXT,
  description_am TEXT,
  description_om TEXT,
  color TEXT DEFAULT '#FFD700',
  question_count INT DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  min_level INT DEFAULT 0,
  subscription_required TEXT DEFAULT 'free' CHECK (subscription_required IN ('free', 'basic', 'premium')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- questions table (trilingual)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  competition_id TEXT REFERENCES competitions(id) ON DELETE SET NULL,
  prompt_en TEXT NOT NULL,
  prompt_am TEXT,
  prompt_om TEXT,
  options_en TEXT[] NOT NULL CHECK (array_length(options_en, 1) = 4),
  options_am TEXT[],
  options_om TEXT[],
  correct_index INT NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  times_answered INT DEFAULT 0,
  times_correct INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- seasons
CREATE TABLE seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id TEXT REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- matches (solo & multiplayer)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  competition_id TEXT REFERENCES competitions(id) ON DELETE SET NULL,
  season_id UUID REFERENCES seasons(id) ON DELETE SET NULL,
  match_type TEXT NOT NULL CHECK (match_type IN ('solo', 'live_1v1', 'tournament', 'challenge', 'daily')),
  opponent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  live_match_id UUID,
  goals INT DEFAULT 0,
  correct_answers INT DEFAULT 0,
  total_questions INT DEFAULT 10,
  accuracy NUMERIC(5,2),
  avg_response_time NUMERIC(5,2),
  max_combo INT DEFAULT 0,
  match_rating NUMERIC(3,1),
  coins_earned INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  elo_change INT DEFAULT 0,
  is_winner BOOLEAN,
  answers JSONB,
  played_at TIMESTAMPTZ DEFAULT now()
);

-- matchmaking_queue
CREATE TABLE matchmaking_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  elo_rating INT NOT NULL,
  competition_id TEXT REFERENCES competitions(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ DEFAULT now()
);

-- live_matches
CREATE TABLE live_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_a_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  player_b_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  competition_id TEXT REFERENCES competitions(id) ON DELETE SET NULL,
  question_ids UUID[] NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed', 'forfeited')),
  player_a_score INT DEFAULT 0,
  player_b_score INT DEFAULT 0,
  current_question INT DEFAULT 0,
  winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- live_match_answers
CREATE TABLE live_match_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_match_id UUID REFERENCES live_matches(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  question_index INT NOT NULL,
  selected_index INT NOT NULL,
  response_time_ms INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(live_match_id, user_id, question_index)
);

-- tournaments
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_am TEXT,
  name_om TEXT,
  competition_id TEXT REFERENCES competitions(id) ON DELETE SET NULL,
  max_players INT DEFAULT 64,
  bracket_size INT,
  status TEXT DEFAULT 'registration' CHECK (status IN ('registration', 'in_progress', 'completed')),
  starts_at TIMESTAMPTZ NOT NULL,
  prize_coins INT DEFAULT 5000,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- tournament_registrations
CREATE TABLE tournament_registrations (
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (tournament_id, user_id)
);

-- tournament_brackets
CREATE TABLE tournament_brackets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  round INT NOT NULL,
  match_slot INT NOT NULL,
  player_a_id UUID REFERENCES users(id) ON DELETE SET NULL,
  player_b_id UUID REFERENCES users(id) ON DELETE SET NULL,
  winner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  live_match_id UUID REFERENCES live_matches(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'bye'))
);

-- challenges (async)
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  opponent_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  question_ids UUID[] NOT NULL,
  opponent_match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'expired')),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '48 hours'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- leaderboard_entries
CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  competition_id TEXT REFERENCES competitions(id) ON DELETE CASCADE,
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  time_range TEXT NOT NULL CHECK (time_range IN ('daily', 'weekly', 'monthly', 'all_time')),
  score INT DEFAULT 0,
  matches_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, competition_id, season_id, time_range)
);

-- achievements
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_am TEXT,
  name_om TEXT,
  description_en TEXT NOT NULL,
  description_am TEXT,
  description_om TEXT,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INT NOT NULL,
  reward_coins INT DEFAULT 0,
  reward_xp INT DEFAULT 0
);

-- user_achievements
CREATE TABLE user_achievements (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- daily_challenges
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE UNIQUE NOT NULL,
  theme_en TEXT NOT NULL,
  theme_am TEXT,
  theme_om TEXT,
  question_ids UUID[] NOT NULL,
  bonus_multiplier NUMERIC(3,1) DEFAULT 1.5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- daily_challenge_completions
CREATE TABLE daily_challenge_completions (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_date DATE NOT NULL,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, challenge_date)
);

-- subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  phone TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('basic', 'premium')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_competition ON questions(competition_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_matches_user ON matches(user_id);
CREATE INDEX idx_matches_competition ON matches(competition_id, season_id);
CREATE INDEX idx_matches_type ON matches(match_type);
CREATE INDEX idx_matches_played ON matches(played_at);
CREATE INDEX idx_leaderboard_rank ON leaderboard_entries(competition_id, season_id, time_range, score DESC);
CREATE INDEX idx_live_matches_status ON live_matches(status);
CREATE INDEX idx_challenges_opponent ON challenges(opponent_id, status);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id, status);

-- Seed competitions
INSERT INTO competitions (id, name_en, name_am, name_om, badge, description_en, color, question_count) VALUES
('world-cup', 'FIFA World Cup', 'የዓለም ዋንጫ', 'Waancaa Addunyaa FIFA', '🏆', 'World Cup history, records, hosts, winners', '#FFD700', 10),
('champions-league', 'UEFA Champions League', 'ቻምፒየንስ ሊግ', 'Liigii Chaampiyoonsii UEFA', '⭐', 'European club football, finals, records', '#1A237E', 10),
('caf-champions', 'CAF Champions League', 'የCAF ሻምፒዮንስ ሊግ', 'Liigii Chaampiyoonsii CAF', '🌍', 'African club football, continental competitions', '#388E3C', 10),
('afcon', 'Africa Cup of Nations', 'የአፍሪካ ዋንጫ', 'Waancaa Afriikaa', '🦁', 'African national team tournament', '#FF6F00', 10),
('ethiopian-premier', 'Ethiopian Premier League', 'የኢትዮጵያ ፕሪሚየር ሊግ', 'Liigii Piriimeraa Itoophiyaa', '🇪🇹', 'Ethiopian club football, teams, players', '#4CAF50', 10),
('walia-ibex', 'Ethiopian National Team', 'ዋሊያ ኢቤክስ', 'Waaliyaa Ibeks', '🐐', 'National team history, players, matches', '#2E7D32', 10),
('premier-league', 'Premier League', 'ፕሪሚየር ሊግ', 'Liigii Piriimeraa', '🦁', 'English football, clubs, transfers, records', '#3D195B', 10),
('la-liga', 'La Liga', 'ላ ሊጋ', 'Laa Liigaa', '🇪🇸', 'Spanish football', '#FF4500', 10),
('serie-a', 'Serie A', 'ሰሪ ኤ', 'Seeriyee A', '🇮🇹', 'Italian football', '#008C45', 10),
('bundesliga', 'Bundesliga', 'ቡንደስሊጋ', 'Buundesliigaa', '🇩🇪', 'German football', '#D32F2F', 10),
('legendary-players', 'Legendary Players', 'አፈ ታሪክ ተጫዋቾች', 'Taphattootaa Seenaa', '👟', 'All-time greats, records, biographies', '#FF9800', 10),
('football-rules', 'Football Rules & Laws', 'የእግር ኳስ ሕግጋት', 'Seera Kubbaa Miilaa', '📏', 'Laws of the game, offside, VAR, penalties', '#607D8B', 10),
('transfer-market', 'Transfer Market', 'የዝውውር ገበያ', 'Gabaa Dabarsaa', '💰', 'Record transfers, fees, agent deals', '#FFC107', 10),
('stadiums', 'Stadiums & Venues', 'ስታዲየሞች', 'Istaadiyeemota', '🏟️', 'Famous grounds, capacities, history', '#795548', 10),
('football-history', 'Football History', 'የእግር ኳስ ታሪክ', 'Seenaa Kubbaa Miilaa', '📜', 'Origins, milestones, historic moments', '#9E9E9E', 10);

-- Seed achievements
INSERT INTO achievements (id, name_en, name_am, name_om, description_en, icon, category, requirement_type, requirement_value, reward_coins, reward_xp) VALUES
('first-match', 'First Whistle', 'የመጀመሪያ ጨዋታ', 'Taphi Jalqabaa', 'Complete your first quiz match', '🎯', 'quiz', 'matches_played', 1, 50, 25),
('ten-matches', 'Regular Player', 'ቋሚ ተጫዋች', 'Taphataa Dhaabbataa', 'Complete 10 quiz matches', '⚽', 'quiz', 'matches_played', 10, 200, 100),
('fifty-matches', 'Veteran', 'ልምድ ያለው', 'Muuxannoo Qabu', 'Complete 50 quiz matches', '🏅', 'quiz', 'matches_played', 50, 500, 250),
('perfect-match', 'Perfect Game', 'ፍጹም ጨዋታ', 'Taphi Guutuu', 'Score 100% accuracy in a match', '💯', 'quiz', 'perfect_accuracy', 1, 300, 150),
('streak-7', 'Week Warrior', 'የሳምንት ተዋጊ', 'Lolaa Torbanii', 'Maintain a 7-day streak', '🔥', 'streak', 'streak_days', 7, 200, 100),
('streak-30', 'Monthly Master', 'የወር ጌታ', 'Abbaa Jiaa', 'Maintain a 30-day streak', '⚡', 'streak', 'streak_days', 30, 1000, 500),
('first-win', 'First Victory', 'የመጀመሪያ ድል', 'Injifannoo Jalqabaa', 'Win your first live 1v1 match', '🏆', 'multiplayer', 'multiplayer_wins', 1, 100, 50),
('ten-wins', 'Champion', 'ሻምፒዮን', 'Chaampiyoonii', 'Win 10 live matches', '👑', 'multiplayer', 'multiplayer_wins', 10, 500, 250),
('gold-rank', 'Gold Standard', 'ወርቅ ደረጃ', 'Sadarkaa Warqii', 'Reach Gold rank', '🥇', 'progression', 'reach_rank', 3, 300, 150),
('legend-rank', 'Living Legend', 'ህያው አፈ ታሪክ', 'Seenaa Jiraataa', 'Reach Legend rank', '🌟', 'progression', 'reach_rank', 5, 1000, 500);
