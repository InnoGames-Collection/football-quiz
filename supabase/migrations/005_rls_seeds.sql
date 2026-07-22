-- ============================================================
-- Migration 005: RLS policies for new tables + seed data
-- ============================================================

-- =====================
-- RLS: user_preferences
-- =====================
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================
-- RLS: notifications
-- =====================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own and broadcast notifications" ON notifications FOR SELECT USING (
  user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "Users can mark own notifications read" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can insert notifications" ON notifications FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  OR auth.uid() IS NOT NULL  -- system/trigger-created notifications
);

-- =====================
-- RLS: messages
-- =====================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own messages and global" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid() OR channel = 'global'
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can mark own messages read" ON messages FOR UPDATE USING (recipient_id = auth.uid());

-- =====================
-- RLS: game_sessions
-- =====================
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own sessions" ON game_sessions FOR ALL USING (auth.uid() = user_id);

-- =====================
-- RLS: game_session_answers
-- =====================
ALTER TABLE game_session_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access own session answers" ON game_session_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM game_sessions WHERE id = session_id AND user_id = auth.uid())
);

-- =====================
-- RLS: rewards
-- =====================
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own rewards" ON rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can claim own rewards" ON rewards FOR UPDATE USING (auth.uid() = user_id);

-- =====================
-- RLS: faq_items
-- =====================
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active FAQs" ON faq_items FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage FAQs" ON faq_items FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- =====================
-- RLS: support_tickets
-- =====================
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own tickets" ON support_tickets FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- Enable Realtime on critical tables
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE rewards;
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_entries;

-- ============================================================
-- Seed FAQ items (professional content for all 13 categories)
-- ============================================================
INSERT INTO faq_items (category, question_en, question_am, question_om, answer_en, answer_am, answer_om, sort_order) VALUES

-- Account
('account', 'How do I create an account?', 'መለያ እንዴት እፈጥራለሁ?', 'Akkaawuntii akkamitti bana?', 
 'EthioFantasy uses your Ethio Telecom phone number for registration. Enter your +251 number, receive an SMS OTP code, and verify to create your account automatically.',
 'ኢትዮፋንታሲ የኢትዮ ቴሌኮም ስልክ ቁጥርዎን ይጠቀማል። የ+251 ቁጥርዎን ያስገቡ፣ የSMS OTP ኮድ ይቀበሉ፣ እና ለማረጋገጥ ያረጋግጡ።',
 'EthioFantasy lakkoofsa bilbila Ethio Telecom keessan fayyadama. Lakkoofsa +251 keessan galchaa, koodii OTP SMS fudhaa, mirkaneessaa.', 1),

('account', 'Can I change my username?', 'የተጠቃሚ ስሜን መቀየር እችላለሁ?', 'Maqaa fayyadamaa koo jijjiiruu danda''aa?',
 'Yes. Go to Profile > Settings > Account & Profile to update your display name at any time.',
 'አዎ። ወደ ፕሮፋይል > ቅንብሮች > መለያ እና ፕሮፋይል ሄደው በማንኛውም ጊዜ ስምዎን ያዘምኑ።',
 'Eeyyee. Gara Piroofaayilii > Qindaa''ina > Akkaawuntii deemaa maqaa keessan haaressu.', 2),

-- Subscription
('subscription', 'What are the subscription plans?', 'የደንበኝነት ምዝገባ ዕቅዶች ምንድን ናቸው?', 'Karoora maallaqa maalii?',
 'EthioFantasy offers three tiers: Free (3 matches/day), Daily Pass (2 ETB/day for unlimited play), and VIP Monthly (45 ETB/month with live tournaments and VIP badge).',
 'ኢትዮፋንታሲ ሶስት ደረጃዎችን ያቀርባል፡ ነፃ (3 ጨዋታ/ቀን)፣ ዕለታዊ (2 ብር/ቀን)፣ እና VIP ወርሃዊ (45 ብር/ወር)።',
 'EthioFantasy sadarkaa sadii dhiyeessa: Bilisaa (taphi 3/guyyaa), Guyyaawaa (Birrii 2/guyyaa), fi VIP Jiaa (Birrii 45/ji''a).', 1),

('subscription', 'How do I subscribe?', 'እንዴት ነው የምመዘገበው?', 'Akkamitti galmaawu?',
 'Navigate to Profile > Subscription, choose your plan, and follow the USSD prompt on your Ethio Telecom line to confirm billing.',
 'ወደ ፕሮፋይል > ደንበኝነት ሄደው ዕቅድዎን ይምረጡ።',
 'Gara Piroofaayilii > Maallaqa deemaa karoora keessan filadhaa.', 2),

-- Unsubscription
('unsubscription', 'How do I cancel my subscription?', 'ደንበኝነቴን እንዴት እሰርዛለሁ?', 'Maallaqa koo akkamitti haqu?',
 'Go to Profile > Subscription > Cancel Plan. Your access continues until the current billing period ends. You can also dial *822*0# on your Ethio Telecom line.',
 'ወደ ፕሮፋይል > ደንበኝነት > ዕቅድ ሰርዝ ሄድ። ወቅታዊ የክፍያ ጊዜዎ እስኪያልቅ ድረስ መዳረሻዎ ይቀጥላል።',
 'Gara Piroofaayilii > Maallaqa > Karoora Haqi deemi. Yeroo kafaltii ammaa xumuramutti argachuun keessan itti fufa.', 1),

-- Daily Challenge
('daily_challenge', 'What is the Daily Challenge?', 'ዕለታዊ ፈተና ምንድን ነው?', 'Qormaata Guyyaawaa maali?',
 'A new football quiz challenge available every day at midnight EAT. Complete it for bonus XP (1.5x multiplier) and exclusive rewards. You can only attempt it once per day.',
 'በየቀኑ እኩለ ሌሊት EAT ላይ የሚገኝ አዲስ የእግር ኳስ ኩዊዝ ፈተና። ለተጨማሪ XP (1.5x) እና ልዩ ሽልማቶች ያጠናቅቁት።',
 'Qormaata kubbaa miilaa guyyaa guyyaan halkan walakkaa EAT irratti argamu. XP dabalataa (1.5x) fi badhaasa addaa argachuuf xumuraa.', 1),

-- Tournament
('tournament', 'How do tournaments work?', 'ውድድሮች እንዴት ይሰራሉ?', 'Dorgommiin akkamitti hojjetu?',
 'Tournaments are bracket-based knockout competitions. Register during the registration phase, compete in live 1v1 matches, and advance through rounds. Top finishers win coin prizes.',
 'ውድድሮች በቡድን ላይ የተመሰረቱ ኖክአውት ውድድሮች ናቸው። በምዝገባ ደረጃ ይመዝገቡ፣ በቀጥታ 1v1 ጨዋታዎች ይወዳደሩ።',
 'Dorgommiin dorgommii knockout irratti hundaa''an. Yeroo galmee keessatti galmaa''aa, taphi kallattiin 1v1 keessatti dorgomaa.', 1),

-- Rewards
('rewards', 'How do I earn rewards?', 'ሽልማቶችን እንዴት አገኛለሁ?', 'Badhaasa akkamitti argadha?',
 'Earn coins and XP by: completing matches (100 coins + 20 XP per correct answer), daily streaks (10-500 bonus coins), tournament prizes, achievements, and referrals.',
 'ጨዋታዎችን በማጠናቀቅ (100 ሳንቲም + 20 XP በትክክለኛ መልስ)፣ ዕለታዊ ስትሪክ፣ የውድድር ሽልማቶች፣ ስኬቶች እና ሪፈራሎች ሳንቲሞችን እና XP ያግኙ።',
 'Taphi xumuruu (qar. 100 + XP 20 deebii sirrii tokkoof), tartiiba guyyaawaa, badhaasa dorgommii, galma fi ergannoo irraa qar. fi XP argadhaa.', 1),

-- Gameplay
('gameplay', 'How long is each question?', 'እያንዳንዱ ጥያቄ ምን ያህል ጊዜ ይወስዳል?', 'Gaaffiin tokko tokko yeroo meeqa fudhata?',
 'Each question has a 15-second timer. If time runs out, the answer is marked as incorrect and the quiz advances to the next question automatically.',
 'እያንዳንዱ ጥያቄ 15 ሰከንድ ሰዓት ቆጣሪ አለው። ጊዜው ካለቀ መልሱ ስህተት ተብሎ ይመዘገባል።',
 'Gaaffiin tokko tokko sa''aatii sekondii 15 qaba. Yeroon yoo dhumte, deebiin dogoggora ta''ee galmaa''a.', 1),

('gameplay', 'What happens if I leave during a match?', 'በጨዋታ ወቅት ብወጣ ምን ይሆናል?', 'Taphi keessaa yoon ba''e maaltu ta''a?',
 'Your match is automatically paused. When you return, you can resume from the exact question you left off. If you explicitly leave, the session is marked as abandoned.',
 'ጨዋታዎ በራስ-ሰር ይቆማል። ሲመለሱ ከቆሙበት ጥያቄ በትክክል መቀጠል ይችላሉ።',
 'Taphi keessan ofumaan dhaabbata. Yeroo deebitan gaaffii dhiiftan irraa itti fufuu dandeessu.', 2),

-- Leaderboard
('leaderboard', 'How is the leaderboard calculated?', 'የደረጃ ሰሌዳው እንዴት ይሰላል?', 'Gabatee sadarkaa akkamitti herregama?',
 'Leaderboards are based on total score accumulated during the selected time period (Daily, Weekly, Monthly). Score is calculated from correct answers, combo streaks, and response speed.',
 'የደረጃ ሰሌዳዎች በተመረጠው ጊዜ ውስጥ በተከማቸ አጠቃላይ ነጥብ ላይ የተመሰረቱ ናቸው።',
 'Gabatee sadarkaa qabxii waliigalaa yeroo filatame keessatti kuufame irratti hundaa''a.', 1),

-- Profile
('profile', 'What is my division?', 'ዲቪዥኔ ምንድን ነው?', 'Kutaa koo maali?',
 'Your division is determined by your total XP. Divisions range from Division 5 (Regional) to Premier Division (World Legends). Earn XP to climb divisions and unlock prestige badges.',
 'ዲቪዥንዎ በጠቅላላ XP ይወሰናል። ዲቪዥኖች ከዲቪዥን 5 (ክልላዊ) እስከ ፕሪሚየር ዲቪዥን (የዓለም አፈ ታሪኮች) ይደርሳሉ።',
 'Kutaan keessan XP waliigalaan murtaa''a. Kutaaleen Kutaa 5 (Naannoo) hanga Kutaa Piriimeraa (Seenaa Addunyaa) ni ga''u.', 1),

-- Notifications
('notifications', 'How do I manage notifications?', 'ማሳወቂያዎችን እንዴት አስተዳድራለሁ?', 'Beeksiisota akkamitti bulchu?',
 'Go to Settings > Notifications to toggle individual notification categories: Daily Challenge, Tournament Updates, Rewards, Announcements, Subscription Alerts, and System Alerts.',
 'ወደ ቅንብሮች > ማሳወቂያዎች ሄደው የማሳወቂያ ምድቦችን ያቀያይሩ።',
 'Gara Qindaa''ina > Beeksiisota deemaa gosa beeksiisotaa tokko tokkoo jijjiiraa.', 1),

-- Technical Issues
('technical', 'The app is not loading. What should I do?', 'መተግበሪያው እየጫነ አይደለም። ምን ላድርግ?', 'Appiin hin fe''u. Maal godhu?',
 'Try these steps: 1) Check your internet connection. 2) Clear your browser cache. 3) Try a different browser. 4) If the issue persists, contact support with your phone number and a description of the problem.',
 'እነዚህን ደረጃዎች ይሞክሩ: 1) የበይነመረብ ግንኙነትዎን ያረጋግጡ 2) የአሳሽ ካሼዎን ያጽዱ 3) ሌላ አሳሽ ይሞክሩ 4) ችግሩ ከቀጠለ ድጋፍን ያግኙ።',
 'Tartiiba kana yaalaa: 1) Interneetii keessan mirkaneessaa 2) Kaashii biraawzarii haqaa 3) Biraawzarii biraa yaalaa 4) Rakkoon yoo itti fufe deeggarsa quunnamaa.', 1),

-- Privacy
('privacy', 'How is my data protected?', 'ዳታዬ እንዴት ይጠበቃል?', 'Daataan koo akkamitti eegama?',
 'EthioFantasy uses Supabase with Row Level Security (RLS) to ensure your data is only accessible to you. We do not share personal information with third parties. Your MSISDN is masked in leaderboards and messages.',
 'ኢትዮፋንታሲ ዳታዎ ለእርስዎ ብቻ ተደራሽ መሆኑን ለማረጋገጥ Supabase ከRow Level Security (RLS) ጋር ይጠቀማል።',
 'EthioFantasy daataan keessan isiniif qofa akka argamu mirkaneessuuf Supabase Row Level Security (RLS) waliin fayyadama.', 1),

-- Terms
('terms', 'What are the Terms of Service?', 'የአገልግሎት ውሎች ምንድን ናቸው?', 'Haalli tajaajilaa maali?',
 'By using EthioFantasy, you agree to fair play, no cheating or bot usage, and compliance with Ethio Telecom VAS policies. Full terms are available in Settings > Terms & Conditions.',
 'ኢትዮፋንታሲን በመጠቀም ፍትሃዊ ጨዋታ፣ ማታለል ወይም ቦት አለመጠቀም፣ እና ከኢትዮ ቴሌኮም VAS ፖሊሲዎች ጋር መስማማት ይስማሙ።',
 'EthioFantasy fayyadamuun taphi haqa qabeessa, soba hin taphatin, fi imaammata Ethio Telecom VAS waliin waliigaluu keessan itti walii galtu.', 1);

-- ============================================================
-- Seed initial notifications (system broadcast)
-- ============================================================
INSERT INTO notifications (user_id, title_en, title_am, title_om, body_en, body_am, body_om, category) VALUES
(NULL, 'Welcome to EthioFantasy Season 1! ⚽', 'ወደ ኢትዮፋንታሲ ወቅት 1 እንኳን በደህና መጡ! ⚽', 'Baga Gara EthioFantasy Waggaa 1 Dhuftan! ⚽',
 'The Football Quiz League is now live. Compete in daily challenges, climb the leaderboard, and win exciting prizes!',
 'የእግር ኳስ ኩዊዝ ሊግ አሁን ቀጥታ ነው። በዕለታዊ ፈተናዎች ይወዳደሩ፣ የደረጃ ሰሌዳውን ይውጡ፣ እና አስደሳች ሽልማቶችን ያሸንፉ!',
 'Liigiin Gaaffii Kubbaa Miilaa amma kallattiin jira. Qormaata guyyaawaa keessatti dorgomaa, gabatee sadarkaa ol ba''aa, badhaasa hawwataa mo''aa!',
 'announcements'),

(NULL, 'Daily Challenge is Live! 📅', 'ዕለታዊ ፈተና ቀጥታ ነው! 📅', 'Qormaata Guyyaawaa Kallattiin Jira! 📅',
 'Test your football knowledge with today''s Daily Challenge. Earn 1.5x bonus XP!',
 'በዛሬው ዕለታዊ ፈተና የእግር ኳስ ዕውቀትዎን ይፈትሹ። 1.5x ተጨማሪ XP ያግኙ!',
 'Beekumsa kubbaa miilaa keessan Qormaata Guyyaawaa har''aatiin yaalaa. XP dabalataa 1.5x argadhaa!',
 'daily');

-- ============================================================
-- Global system messages seed
-- ============================================================
INSERT INTO messages (sender_id, recipient_id, channel, body_en, body_am, body_om) VALUES
(NULL, NULL, 'system',
 'Welcome to EthioFantasy! Start your first match and join the Football Quiz League community. Good luck, and may the best fan win! ⚽🏆',
 'ወደ ኢትዮፋንታሲ እንኳን በደህና መጡ! የመጀመሪያ ጨዋታዎን ጀምረው ወደ የእግር ኳስ ኩዊዝ ሊግ ማህበረሰብ ይቀላቀሉ።',
 'Baga Gara EthioFantasy Dhuftan! Taphi jalqabaa keessan jalqabaatii hawaasa Liigii Gaaffii Kubbaa Miilaa keessatti dabalamaa.');
