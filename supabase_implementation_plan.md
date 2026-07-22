# EthioFantasy — Full Supabase Backend Integration Plan

> **Goal**: Migrate every component from localStorage / hardcoded mock data to a fully Supabase-powered enterprise-grade real-time backend. Zero mock data, zero localStorage for business state, everything server-driven.

---

## Current State Audit

### What Exists Today

| Layer | Status |
|---|---|
| Supabase Auth (Phone OTP) | ✅ Wired but guest bypass undermines it |
| `questions` table | ✅ Exists, queried by QuizEngine |
| `scores` table | ✅ Exists, used by LeaderboardService |
| Player profiles | ❌ localStorage only (`ETHIO_FOOTBALL_SAVE`) |
| Game sessions | ❌ localStorage only (`ETHIO_ACTIVE_SESSION_V3`) |
| Notifications | ❌ Hardcoded array + localStorage |
| Messages | ❌ 3 hardcoded static arrays |
| Competitions / Tournaments | ❌ Hardcoded in `CompetitionRegistry.ts` |
| Leaderboard period filtering | ❌ Period param accepted but ignored |
| Settings / Preferences | ❌ localStorage only |
| FAQ / Help content | ❌ Hardcoded in SettingsScreen |
| Subscription status | ❌ Static placeholder |
| Achievements / Awards | ❌ Not persisted |
| Admin panel | ❌ Hardcoded key, no RBAC |
| Realtime subscriptions | ❌ None |
| Server-side answer validation | ❌ None — client holds correct answers |

### localStorage Keys to Eliminate

| Key | Replacement |
|---|---|
| `ETHIO_FOOTBALL_SAVE` | `profiles` table |
| `ETHIO_FOOTBALL_AUDIO` | `user_preferences` table |
| `ETHIO_FOOTBALL_LOCALE` | `user_preferences` table |
| `ETHIO_FOOTBALL_NOTIFICATIONS` | `notifications` table + Realtime |
| `ETHIO_ACTIVE_SESSION_V3` | `game_sessions` table |
| `ETHIO_SESSION_HISTORY_V3` | `game_sessions` table (completed) |
| `ETHIO_REVIEW_QUESTIONS` | `game_session_answers` table |
| `ETHIO_REVIEW_CHOICES` | `game_session_answers` table |
| `ETHIO_REVIEW_TIMES` | `game_session_answers` table |
| `ETHIO_GAME_FINAL_SCORE` | `game_sessions.final_score` column |
| `ethio_admin_key` | `profiles.role` column + RLS |

---

## Phase 1 — Database Schema Design

> [!IMPORTANT]
> All tables use UUID primary keys and `auth.uid()` for RLS. Timestamps use `timestamptz`.

### 1.1 `profiles` table
Links to Supabase Auth. Created automatically on signup via a database trigger.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  msisdn TEXT UNIQUE NOT NULL,
  display_name TEXT DEFAULT 'Player',
  avatar_url TEXT,
  role TEXT DEFAULT 'player' CHECK (role IN ('player', 'admin', 'moderator')),
  coins INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  division TEXT DEFAULT 'Rookie',
  games_played INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  wrong_answers INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  high_score INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  average_time REAL DEFAULT 0,
  total_time_played REAL DEFAULT 0,
  tournaments_played INTEGER DEFAULT 0,
  tournaments_won INTEGER DEFAULT 0,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'expired')),
  subscription_expires_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.2 `user_preferences` table

```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'am', 'om')),
  sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  dark_mode BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.3 `questions` table (enhanced)

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  prompt JSONB NOT NULL,          -- { "en": "...", "am": "...", "om": "..." }
  options JSONB NOT NULL,          -- [{ "en": "...", "am": "...", "om": "..." }, ...]
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index <= 3),
  explanation JSONB,               -- { "en": "...", "am": "...", "om": "..." }
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  times_served INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.4 `competitions` table

```sql
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  badge TEXT DEFAULT '⚽',
  description JSONB,               -- { "en": "...", "am": "...", "om": "..." }
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  question_count INTEGER DEFAULT 10,
  time_per_question INTEGER DEFAULT 15,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'archived')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  prize_pool JSONB,                -- { "1st": 1000, "2nd": 500, "3rd": 250 }
  max_participants INTEGER,
  entry_fee INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.5 `competition_entries` table

```sql
CREATE TABLE competition_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(competition_id, user_id)
);
```

### 1.6 `game_sessions` table

```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  competition_id UUID REFERENCES competitions(id),
  match_type TEXT NOT NULL,
  state TEXT DEFAULT 'playing' CHECK (state IN ('playing', 'paused', 'completed', 'abandoned', 'expired')),
  difficulty TEXT DEFAULT 'medium',
  total_questions INTEGER NOT NULL,
  current_question INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  final_score INTEGER,
  accuracy REAL,
  avg_response_time REAL,
  time_remaining REAL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.7 `game_session_answers` table

```sql
CREATE TABLE game_session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id),
  question_index INTEGER NOT NULL,
  chosen_index INTEGER NOT NULL,      -- -1 for timeout
  correct_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_sec REAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.8 `leaderboard_snapshots` table (materialized view)

```sql
CREATE TABLE leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  score INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  rank INTEGER,
  league TEXT,
  snapshot_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, period, snapshot_date)
);
```

### 1.9 `notifications` table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,  -- NULL = broadcast
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('daily', 'tournament', 'rewards', 'announcements', 'subscription', 'system')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.10 `messages` table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,  -- NULL = global
  channel TEXT DEFAULT 'global' CHECK (channel IN ('global', 'direct', 'system')),
  body JSONB NOT NULL,              -- { "en": "...", "am": "...", "om": "..." }
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.11 `achievements` table

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL,
  description JSONB NOT NULL,
  icon TEXT DEFAULT '🏆',
  category TEXT NOT NULL,
  threshold INTEGER NOT NULL,       -- e.g. 10 games, 100 correct
  reward_coins INTEGER DEFAULT 0,
  reward_xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.12 `user_achievements` table

```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);
```

### 1.13 `rewards` table

```sql
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'tournament', 'achievement', 'referral')),
  coins INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  description TEXT,
  claimed BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.14 `faq_items` table

```sql
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question JSONB NOT NULL,
  answer JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.15 `support_tickets` table

```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);
```

### Database Trigger — Auto-create profile on signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, msisdn, referral_code)
  VALUES (NEW.id, NEW.phone, substr(md5(random()::text), 1, 8));

  INSERT INTO user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

---

## Phase 2 — Row Level Security (RLS)

> [!CAUTION]
> Every table MUST have RLS enabled. Without it, any authenticated user can read/write all data.

```sql
-- Profiles: users can read any profile, update only their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Self update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Preferences: private to owner
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner only" ON user_preferences USING (auth.uid() = user_id);

-- Questions: anyone can read active questions, admins can insert/update
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read active" ON questions FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write" ON questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Game Sessions: private to owner
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner CRUD" ON game_sessions USING (auth.uid() = user_id);

-- Game Session Answers: owner via session
ALTER TABLE game_session_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner via session" ON game_session_answers USING (
  EXISTS (SELECT 1 FROM game_sessions WHERE id = session_id AND user_id = auth.uid())
);

-- Notifications: user sees own + broadcasts
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own or broadcast" ON notifications FOR SELECT USING (
  user_id = auth.uid() OR user_id IS NULL
);
CREATE POLICY "Mark read" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Messages: participants can read, authenticated can insert
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR recipient_id = auth.uid() OR channel = 'global'
);
CREATE POLICY "Send msg" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Competitions: public read, admin write
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON competitions FOR SELECT USING (true);
CREATE POLICY "Admin write" ON competitions FOR ALL WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Competition Entries: public read (for leaderboards), self insert
ALTER TABLE competition_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON competition_entries FOR SELECT USING (true);
CREATE POLICY "Self enter" ON competition_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard Snapshots: public read
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON leaderboard_snapshots FOR SELECT USING (true);

-- Achievements: public read
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON achievements FOR SELECT USING (true);

-- User Achievements: owner read, system insert
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner read" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Rewards: owner only
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner CRUD" ON rewards USING (auth.uid() = user_id);

-- FAQ: public read, admin write
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON faq_items FOR SELECT USING (is_active = true);

-- Support Tickets: owner only
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner CRUD" ON support_tickets USING (auth.uid() = user_id);
```

---

## Phase 3 — Supabase Edge Functions (Server-Side Validation)

> [!WARNING]
> Quiz answer validation MUST happen server-side. The client should never receive `correct_index` before the player answers.

### 3.1 `serve-question` Edge Function
- Accepts `session_id` and `question_index`
- Returns question WITHOUT `correct_index`
- Records that this question was served to prevent replay

### 3.2 `validate-answer` Edge Function
- Accepts `session_id`, `question_id`, `chosen_index`, `response_time`
- Looks up `correct_index` server-side
- Validates response time ≤ 15.5 seconds
- Checks session state is `playing`
- Inserts into `game_session_answers`
- Updates `game_sessions` counters
- Returns `{ is_correct, correct_index, explanation, updated_score }`

### 3.3 `complete-session` Edge Function
- Accepts `session_id`
- Validates all questions answered
- Calculates final score server-side (Base + Accuracy Bonus + Speed Bonus + Perfect Match)
- Updates `profiles` stats (xp, coins, games_played, etc.)
- Inserts into `leaderboard_snapshots`
- Checks and awards `achievements`
- Creates `rewards` entries
- Returns complete match summary

### 3.4 `create-session` Edge Function
- Accepts `match_type`, `competition_id`, `difficulty`
- Validates user subscription / eligibility
- Selects questions randomly from pool (server-side)
- Creates `game_sessions` record
- Returns `session_id` + first question (without correct_index)

### 3.5 `claim-reward` Edge Function
- Accepts `reward_id`
- Validates ownership, expiry, and `claimed = false`
- Applies coins/xp to profile
- Marks reward as claimed
- Prevents duplicate claims

---

## Phase 4 — Service Layer Refactor

### 4.1 New Service Files to Create

| Service | File | Replaces |
|---|---|---|
| `ProfileService` | `src/networking/services/ProfileService.ts` | `SaveManager.ts` localStorage |
| `GameSessionService` | `src/networking/services/GameSessionService.ts` | `GameSessionManager.ts` localStorage |
| `QuizService` | `src/networking/services/QuizService.ts` | `QuizEngine.ts` direct query |
| `CompetitionService` | `src/networking/services/CompetitionService.ts` | `CompetitionRegistry.ts` hardcoded |
| `NotificationService` | `src/networking/services/NotificationService.ts` | `NotificationScreen.ts` localStorage |
| `MessageService` | `src/networking/services/MessageService.ts` | `MessagesScreen.ts` hardcoded |
| `AchievementService` | `src/networking/services/AchievementService.ts` | None (new) |
| `RewardService` | `src/networking/services/RewardService.ts` | None (new) |
| `PreferencesService` | `src/networking/services/PreferencesService.ts` | localStorage |
| `FAQService` | `src/networking/services/FAQService.ts` | `SettingsScreen.ts` hardcoded |
| `SupportService` | `src/networking/services/SupportService.ts` | Fake ticket ID |
| `RealtimeService` | `src/networking/services/RealtimeService.ts` | None (new) |
| `AdminService` | `src/networking/services/AdminService.ts` | `AdminPanelScreen.ts` |

### 4.2 Service Implementation Pattern

Each service follows this pattern:

```typescript
// Example: ProfileService.ts
import { supabase } from '../supabase/SupabaseClient';

export class ProfileService {
  private static _instance: ProfileService;
  private _cache: Profile | null = null;
  private _subscription: any = null;

  static getInstance(): ProfileService { ... }

  // Fetch profile from Supabase
  async getProfile(): Promise<Profile> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();
    this._cache = data;
    return data;
  }

  // Real-time subscription
  subscribeToChanges(callback: (profile: Profile) => void): void {
    this._subscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      }, (payload) => callback(payload.new as Profile))
      .subscribe();
  }
}
```

---

## Phase 5 — Supabase Realtime Subscriptions

### 5.1 Channels to Subscribe

| Channel | Table | Events | Screen(s) |
|---|---|---|---|
| `profile-{uid}` | `profiles` | UPDATE | Home, Profile, all stats |
| `notifications-{uid}` | `notifications` | INSERT | NotificationScreen, Home badge |
| `messages-{uid}` | `messages` | INSERT | MessagesScreen, Home badge |
| `leaderboard-live` | `leaderboard_snapshots` | INSERT, UPDATE | LeaderboardScreen |
| `competitions` | `competitions` | INSERT, UPDATE | CompetitionBrowser, PlayScreen |
| `session-{id}` | `game_sessions` | UPDATE | ScoreboardQuestionScreen (pause/resume sync) |
| `rewards-{uid}` | `rewards` | INSERT | Home, ProfileScreen |

### 5.2 `RealtimeService.ts` — Central Hub

```typescript
export class RealtimeService {
  private _channels: Map<string, RealtimeChannel> = new Map();

  // Subscribe to all user-specific channels on login
  initUserChannels(userId: string): void { ... }

  // Cleanup all channels on logout
  cleanup(): void {
    this._channels.forEach(ch => supabase.removeChannel(ch));
    this._channels.clear();
  }
}
```

---

## Phase 6 — Screen-by-Screen Migration

### 6.1 Authentication (`AuthScreen.ts`, `AuthManager.ts`)

| Change | Detail |
|---|---|
| Remove guest bypass | Require phone OTP for all users |
| Remove Google placeholder | Remove non-functional button |
| Profile auto-creation | Database trigger creates profile on signup |
| Session persistence | Use Supabase session tokens (auto-refresh) |
| Login flow | Phone → OTP → profile fetch → navigate to home |

#### [MODIFY] [AuthManager.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/core/auth/AuthManager.ts)
- Remove guest mode logic
- Add `getProfile()` that queries `profiles` table
- Add `onAuthStateChange` listener for session recovery

#### [MODIFY] [AuthScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/AuthScreen.ts)
- Remove "Continue as Guest" button
- Remove non-functional Google button or wire to Supabase OAuth
- Add loading state during OTP verification
- Navigate to home only after profile is fetched

---

### 6.2 Home Screen (`FootballLeagueHome.ts`)

| Current | Backend |
|---|---|
| Stats from SaveManager | `ProfileService.getProfile()` |
| Static ad banner | `competitions` table (promoted competitions) |
| Referral code | `profiles.referral_code` |
| Daily challenge status | `CompetitionService.getDailyChallenge()` |

#### [MODIFY] [FootballLeagueHome.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/FootballLeagueHome.ts)
- Replace `SaveManager.profile` reads → `ProfileService.getProfile()`
- Replace "AD BANNER" → promoted competition from DB
- Wire View All stats → `ProfileService`
- Add realtime listener for live stats updates

---

### 6.3 Play Screen (`PlayScreen.ts`)

| Current | Backend |
|---|---|
| Hardcoded `GAME_MODES` array | Keep client-side (mode definitions are UI config) |
| No availability check | `CompetitionService.getAvailableModes()` |
| Static daily challenge | `CompetitionService.getDailyChallenge()` |

#### [MODIFY] [PlayScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/PlayScreen.ts)
- Check subscription status before premium modes
- Query daily challenge availability from `competitions` table
- Wire "Kick Off" to `GameSessionService.createSession()` (Edge Function)

---

### 6.4 Quiz Gameplay (`ScoreboardQuestionScreen.ts`)

> [!CAUTION]
> This is the highest-security component. Answer validation MUST move server-side.

| Current | Backend |
|---|---|
| Client receives `correct_index` | Edge Function returns question WITHOUT answer |
| Client calculates score | Edge Function calculates and returns score |
| localStorage for review data | `game_session_answers` table |
| Client-side timer | Server validates response time |

#### [MODIFY] [ScoreboardQuestionScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/ScoreboardQuestionScreen.ts)
- On question load: call `serve-question` Edge Function (no `correct_index`)
- On answer: call `validate-answer` Edge Function → receive `is_correct` + `correct_index` + `updated_score`
- On timeout: call `validate-answer` with `chosen_index: -1`
- On pause: call `GameSessionService.pauseSession()` → updates `game_sessions.state`
- On resume: call `GameSessionService.resumeSession()` → restores from DB
- On complete: call `complete-session` Edge Function → receive final results

#### [MODIFY] [QuizEngine.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/core/quiz/QuizEngine.ts)
- Remove direct Supabase question fetching
- Replace with `QuizService.getNextQuestion(sessionId)`
- Remove `QuestionBank.ts` fallback (server is authoritative)

#### [DELETE] [GameSessionManager.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/games/quiz/GameSessionManager.ts)
- Replace entirely with `GameSessionService.ts` (Supabase-backed)

---

### 6.5 Match Results (`MatchStatsScreen.ts`)

| Current | Backend |
|---|---|
| Reads localStorage review data | `GameSessionService.getSessionResults(sessionId)` |
| Client-calculated final score | Server-calculated via Edge Function |
| Like/Comment/Share buttons | Functional via `messages` + sharing API |

#### [MODIFY] [MatchStatsScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/MatchStatsScreen.ts)
- Accept `sessionId` instead of raw score data
- Fetch complete results from `game_sessions` + `game_session_answers` JOIN
- Review modal pulls questions + answers from DB
- "Play Again" creates new session via Edge Function

---

### 6.6 Leaderboard (`LeaderboardScreen.ts`)

| Current | Backend |
|---|---|
| Period param ignored in query | Proper period filtering via `leaderboard_snapshots` |
| Fallback mock data | No fallback — empty state if no data |
| No current user highlighting | Highlight row where `user_id = auth.uid()` |

#### [MODIFY] [LeaderboardScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/LeaderboardScreen.ts)
- Query `leaderboard_snapshots` with proper period filter
- JOIN with `profiles` for display name + division
- Subscribe to realtime updates on leaderboard channel
- Highlight current user row

#### [MODIFY] [LeaderboardService.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/networking/services/LeaderboardService.ts)
- Remove mock fallback data
- Implement proper period-filtered queries
- Add `getUserRank(userId, period)` method

---

### 6.7 Competitions / Tournaments (`CompetitionBrowserScreen.ts`)

| Current | Backend |
|---|---|
| 2 hardcoded league cards | `CompetitionService.getCompetitions(status)` |
| Static participant counts | Real count from `competition_entries` |
| No registration flow | `CompetitionService.enterCompetition(compId)` |

#### [MODIFY] [CompetitionBrowserScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/CompetitionBrowserScreen.ts)
- Fetch competitions from `competitions` table filtered by tab status
- Show real participant count from `competition_entries`
- Wire "Join" button to insert into `competition_entries`
- Subscribe to realtime for live status changes

#### [DELETE] [CompetitionRegistry.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/core/quiz/CompetitionRegistry.ts)
- Replace entirely with `CompetitionService.ts`

---

### 6.8 Messages (`MessagesScreen.ts`)

| Current | Backend |
|---|---|
| 3 hardcoded static arrays | `MessageService.getMessages(channel)` |
| No send functionality | `MessageService.sendMessage(recipientId, body)` |
| No realtime | Subscribe to new messages |

#### [MODIFY] [MessagesScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/MessagesScreen.ts)
- Remove all hardcoded message arrays
- Fetch from `messages` table with channel filter
- Add compose message modal
- Subscribe to realtime for new incoming messages
- Mark messages as read via `MessageService.markRead()`

---

### 6.9 Notifications (`NotificationScreen.ts`)

| Current | Backend |
|---|---|
| 5 hardcoded default notifications | `NotificationService.getNotifications(category)` |
| Stored in localStorage | `notifications` table |
| No realtime push | Subscribe to INSERT events |

#### [MODIFY] [NotificationScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/NotificationScreen.ts)
- Remove `DEFAULT_NOTIFICATIONS` array
- Remove localStorage load/save
- Fetch from `notifications` table (user_id OR broadcast)
- Mark as read via `NotificationService.markRead()`
- Subscribe to realtime for push notifications

---

### 6.10 Profile (`ProfileScreen.ts`)

| Current | Backend |
|---|---|
| SaveManager localStorage | `ProfileService.getProfile()` |
| Static awards list | `AchievementService.getUserAchievements()` |
| No subscription check | `ProfileService.getSubscriptionStatus()` |

#### [MODIFY] [ProfileScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/ProfileScreen.ts)
- Replace SaveManager reads → ProfileService
- Achievements from `user_achievements` JOIN `achievements`
- Subscription status from `profiles.subscription_status`
- Realtime subscription for profile updates

---

### 6.11 Detailed Stats (`DetailedStatsScreen.ts`)

| Current | Backend |
|---|---|
| All stats from SaveManager | `ProfileService.getProfile()` |
| No game history | `GameSessionService.getHistory(limit)` |
| No time-series data | Aggregate from `game_sessions` |

#### [MODIFY] [DetailedStatsScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/DetailedStatsScreen.ts)
- Fetch profile stats from Supabase
- Game history from `game_sessions` table (completed)
- Rankings from `leaderboard_snapshots`

---

### 6.12 Settings / Help / About (`SettingsScreen.ts`)

| Current | Backend |
|---|---|
| Preferences in localStorage | `PreferencesService` → `user_preferences` table |
| 48 hardcoded FAQ items | `FAQService.getFAQs(category)` → `faq_items` table |
| Fake support ticket | `SupportService.createTicket()` → `support_tickets` table |
| Static About page | Keep static (app metadata) |

#### [MODIFY] [SettingsScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/SettingsScreen.ts)
- Language/Sound/Vibration changes → `PreferencesService.update()`
- FAQ categories and items from `faq_items` table
- Support ticket → `SupportService.createTicket()` with real ID
- Terms/Privacy → keep static or load from `faq_items` with special category

---

### 6.13 Admin Panel (`AdminPanelScreen.ts`)

| Current | Backend |
|---|---|
| Hardcoded admin key | `profiles.role = 'admin'` RLS check |
| Direct Supabase insert | `AdminService` with proper validation |
| No CRUD for competitions | Full CRUD via `AdminService` |

#### [MODIFY] [AdminPanelScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/AdminPanelScreen.ts)
- Remove hardcoded key check → check `profiles.role`
- Question CRUD via `AdminService`
- Competition CRUD via `AdminService`
- Notification broadcast via `AdminService.broadcastNotification()`
- FAQ management via `AdminService`

---

### 6.14 Subscription (`SubscriptionScreen.ts`)

| Current | Backend |
|---|---|
| Static display | `profiles.subscription_status` + `subscription_expires_at` |
| No billing integration | Placeholder for Ethio Telecom VAS API |

#### [MODIFY] [SubscriptionScreen.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/ui/screens/SubscriptionScreen.ts)
- Fetch subscription status from profile
- Show real expiry date
- Subscribe/unsubscribe triggers webhook to Ethio Telecom API

---

### 6.15 Core Files to Modify

#### [MODIFY] [SaveManager.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/core/managers/SaveManager.ts)
- Convert to thin wrapper around `ProfileService`
- Remove all localStorage calls
- Profile getter fetches from service cache

#### [MODIFY] [Bootstrap.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/core/engine/Bootstrap.ts)
- Initialize `RealtimeService` after auth
- Fetch user preferences on startup
- Remove session recovery from localStorage
- Session recovery from `game_sessions` table (state = 'paused')

#### [MODIFY] [i18n.ts](file:///Users/yasabneh/Documents/ITG/InnoGames/football-quiz/src/localization/i18n.ts)
- Read locale from `user_preferences` table
- Persist locale changes to `PreferencesService`

---

## Phase 7 — Supabase Database Functions (Cron Jobs)

### 7.1 Leaderboard Snapshot (Daily Cron)
```sql
-- Runs daily at midnight UTC
-- Aggregates scores from game_sessions completed today
-- Inserts into leaderboard_snapshots
```

### 7.2 Competition Status Updater (Hourly Cron)
```sql
-- Updates competition status based on start_date/end_date
-- 'upcoming' → 'live' when start_date <= now()
-- 'live' → 'completed' when end_date <= now()
-- Awards prizes on completion
```

### 7.3 Reward Expiry (Daily Cron)
```sql
-- Marks expired unclaimed rewards
-- Sends notification for rewards expiring soon
```

### 7.4 Daily Challenge Generator (Daily Cron)
```sql
-- Creates a new daily competition entry each day
-- Selects random question set
-- Notifies all users
```

---

## Phase 8 — Migration Execution Order

> [!IMPORTANT]
> Execute phases in this order to avoid breaking the running application.

| Step | Description | Depends On |
|---|---|---|
| **8.1** | Run all `CREATE TABLE` SQL in Supabase Dashboard | Nothing |
| **8.2** | Apply all RLS policies | 8.1 |
| **8.3** | Create database trigger for auto profile creation | 8.2 |
| **8.4** | Seed `achievements`, `faq_items` tables with initial data | 8.1 |
| **8.5** | Deploy Edge Functions (`create-session`, `serve-question`, `validate-answer`, `complete-session`, `claim-reward`) | 8.1, 8.2 |
| **8.6** | Create all 13 service files in `src/networking/services/` | 8.5 |
| **8.7** | Create `RealtimeService.ts` | 8.6 |
| **8.8** | Refactor `AuthManager.ts` — remove guest mode | 8.3 |
| **8.9** | Refactor `SaveManager.ts` → `ProfileService` wrapper | 8.6 |
| **8.10** | Refactor `Bootstrap.ts` — init Realtime + remote preferences | 8.7, 8.8 |
| **8.11** | Migrate `ScoreboardQuestionScreen.ts` to Edge Functions | 8.5 |
| **8.12** | Migrate `MatchStatsScreen.ts` to DB results | 8.11 |
| **8.13** | Migrate `LeaderboardScreen.ts` to snapshots table | 8.6 |
| **8.14** | Migrate `CompetitionBrowserScreen.ts` to DB | 8.6 |
| **8.15** | Migrate `MessagesScreen.ts` to DB + Realtime | 8.6, 8.7 |
| **8.16** | Migrate `NotificationScreen.ts` to DB + Realtime | 8.6, 8.7 |
| **8.17** | Migrate `ProfileScreen.ts` + `DetailedStatsScreen.ts` | 8.9 |
| **8.18** | Migrate `SettingsScreen.ts` (prefs, FAQ, support) | 8.6 |
| **8.19** | Migrate `AdminPanelScreen.ts` to RBAC | 8.6 |
| **8.20** | Migrate `PlayScreen.ts` + `FootballLeagueHome.ts` | 8.6 |
| **8.21** | Delete `GameSessionManager.ts`, `CompetitionRegistry.ts`, `QuestionBank.ts` | 8.11, 8.14 |
| **8.22** | Remove ALL localStorage references | 8.21 |
| **8.23** | Full E2E testing | 8.22 |
| **8.24** | Setup cron jobs (leaderboard, competitions, rewards, daily challenge) | 8.23 |

---

## Open Questions

> [!IMPORTANT]
> These decisions will impact the architecture. Please review before we proceed.

1. **Ethio Telecom VAS API**: Do you have documentation or a sandbox for the Ethio Telecom subscription/billing API? This determines how we handle premium subscription activation and daily billing (2 Birr/day).

2. **Supabase Project**: Should we use the existing Supabase project (`zrgqsmjlyfhilipuxwbk.supabase.co`) or create a fresh one for production? The existing one may have the `questions` and `scores` tables that need migration.

3. **Edge Functions Deployment**: Do you have Supabase CLI installed and configured? Edge Functions require the CLI for deployment (`supabase functions deploy`).

4. **Existing Data**: Is there real question data in the existing `questions` table that should be preserved, or should we start fresh with the enhanced schema?

5. **Guest Mode Removal**: Removing guest mode means ALL users must authenticate via phone OTP. Is this acceptable for the demo? Or should we keep a limited guest mode for first-time exploration?

6. **Realtime Tier**: Supabase Free tier limits concurrent Realtime connections to 200. The Pro tier supports 500+. Which tier is the target deployment?

---

## Verification Plan

### Automated Tests
- `npm run build` — TypeScript compilation passes with zero errors
- Edge Function unit tests via Deno test runner
- RLS policy tests via Supabase test helpers

### Manual Verification
- Complete auth flow: phone → OTP → profile created in DB
- Play a full match: session created → questions served (no correct_index) → answers validated server-side → results calculated server-side
- Leaderboard: scores appear in real-time for other users
- Notifications: admin broadcasts appear instantly for all users
- Messages: direct messages delivered in real-time
- Profile: stats update after match without page refresh
- Offline handling: paused session recovers from DB on reconnect
- Admin: role-based access works, guest users cannot access admin panel
