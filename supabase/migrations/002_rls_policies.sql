-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_match_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- USERS: Read own, update own
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can read other profiles for leaderboard" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- QUESTIONS: All authenticated can read, admin can write
CREATE POLICY "Anyone can read active questions" ON questions FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage questions" ON questions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND subscription_tier = 'premium')
);

-- COMPETITIONS: All can read, admin can write
CREATE POLICY "Anyone can read active competitions" ON competitions FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage competitions" ON competitions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND subscription_tier = 'premium')
);

-- SEASONS: All can read
CREATE POLICY "Anyone can read seasons" ON seasons FOR SELECT USING (true);

-- MATCHES: Insert own, read own + opponent's
CREATE POLICY "Users can insert own matches" ON matches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own matches" ON matches FOR SELECT USING (auth.uid() = user_id OR auth.uid() = opponent_id);

-- MATCHMAKING: Users manage own queue entry
CREATE POLICY "Users can join queue" ON matchmaking_queue FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave queue" ON matchmaking_queue FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can read queue" ON matchmaking_queue FOR SELECT USING (true);

-- LIVE MATCHES: Participants can read
CREATE POLICY "Participants can read live matches" ON live_matches FOR SELECT USING (auth.uid() = player_a_id OR auth.uid() = player_b_id);
CREATE POLICY "Participants can read answers" ON live_match_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM live_matches WHERE id = live_match_id AND (player_a_id = auth.uid() OR player_b_id = auth.uid()))
);
CREATE POLICY "Participants can insert answers" ON live_match_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- TOURNAMENTS
CREATE POLICY "Anyone can read tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Users can register" ON tournament_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read registrations" ON tournament_registrations FOR SELECT USING (true);
CREATE POLICY "Anyone can read brackets" ON tournament_brackets FOR SELECT USING (true);

-- CHALLENGES
CREATE POLICY "Users can send challenges" ON challenges FOR INSERT WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Users can read own challenges" ON challenges FOR SELECT USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);
CREATE POLICY "Opponents can update challenge" ON challenges FOR UPDATE USING (auth.uid() = opponent_id);

-- LEADERBOARD: All can read
CREATE POLICY "Anyone can read leaderboard" ON leaderboard_entries FOR SELECT USING (true);

-- ACHIEVEMENTS: All can read definitions
CREATE POLICY "Anyone can read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Users can read own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- DAILY CHALLENGES
CREATE POLICY "Anyone can read daily challenges" ON daily_challenges FOR SELECT USING (true);
CREATE POLICY "Users can read own completions" ON daily_challenge_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions" ON daily_challenge_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SUBSCRIPTIONS: Own only
CREATE POLICY "Users can read own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
