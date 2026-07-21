/**
 * Auto-generated TypeScript types for the Football Quiz League Supabase database.
 * These types provide compile-time safety for all database operations.
 * 
 * In production, regenerate with: npx supabase gen types typescript --project-id <id>
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Locale = 'en' | 'am' | 'om';
export type SubscriptionTier = 'free' | 'basic' | 'premium';
export type MatchType = 'solo' | 'live_1v1' | 'tournament' | 'challenge' | 'daily';
export type LiveMatchStatus = 'waiting' | 'in_progress' | 'completed' | 'forfeited';
export type SeasonStatus = 'upcoming' | 'active' | 'completed';
export type TournamentStatus = 'registration' | 'in_progress' | 'completed';
export type ChallengeStatus = 'pending' | 'accepted' | 'completed' | 'expired';
export type BracketStatus = 'pending' | 'in_progress' | 'completed' | 'bye';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';
export type LeaderboardTimeRange = 'daily' | 'weekly' | 'monthly' | 'all_time';

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    username: string;
                    phone: string | null;
                    avatar_url: string | null;
                    locale: Locale;
                    elo_rating: number;
                    coins: number;
                    xp: number;
                    total_matches: number;
                    total_wins: number;
                    subscription_tier: SubscriptionTier;
                    streak_count: number;
                    streak_last_date: string | null;
                    created_at: string;
                    last_active: string;
                };
                Insert: {
                    id: string;
                    username: string;
                    phone?: string | null;
                    avatar_url?: string | null;
                    locale?: Locale;
                    elo_rating?: number;
                    coins?: number;
                    xp?: number;
                    total_matches?: number;
                    total_wins?: number;
                    subscription_tier?: SubscriptionTier;
                    streak_count?: number;
                    streak_last_date?: string | null;
                };
                Update: {
                    username?: string;
                    phone?: string | null;
                    avatar_url?: string | null;
                    locale?: Locale;
                    elo_rating?: number;
                    coins?: number;
                    xp?: number;
                    total_matches?: number;
                    total_wins?: number;
                    subscription_tier?: SubscriptionTier;
                    streak_count?: number;
                    streak_last_date?: string | null;
                    last_active?: string;
                };
            };
            questions: {
                Row: {
                    id: string;
                    category: string;
                    difficulty: number;
                    competition_id: string | null;
                    prompt_en: string;
                    prompt_am: string | null;
                    prompt_om: string | null;
                    options_en: string[];
                    options_am: string[] | null;
                    options_om: string[] | null;
                    correct_index: number;
                    times_answered: number;
                    times_correct: number;
                    is_active: boolean;
                    created_by: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    category: string;
                    difficulty: number;
                    competition_id?: string | null;
                    prompt_en: string;
                    prompt_am?: string | null;
                    prompt_om?: string | null;
                    options_en: string[];
                    options_am?: string[] | null;
                    options_om?: string[] | null;
                    correct_index: number;
                    is_active?: boolean;
                    created_by?: string | null;
                };
                Update: {
                    category?: string;
                    difficulty?: number;
                    competition_id?: string | null;
                    prompt_en?: string;
                    prompt_am?: string | null;
                    prompt_om?: string | null;
                    options_en?: string[];
                    options_am?: string[] | null;
                    options_om?: string[] | null;
                    correct_index?: number;
                    times_answered?: number;
                    times_correct?: number;
                    is_active?: boolean;
                };
            };
            competitions: {
                Row: {
                    id: string;
                    name_en: string;
                    name_am: string | null;
                    name_om: string | null;
                    badge: string;
                    description_en: string | null;
                    description_am: string | null;
                    description_om: string | null;
                    color: string;
                    question_count: number;
                    is_active: boolean;
                    min_level: number;
                    subscription_required: SubscriptionTier;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    name_en: string;
                    name_am?: string | null;
                    name_om?: string | null;
                    badge: string;
                    description_en?: string | null;
                    description_am?: string | null;
                    description_om?: string | null;
                    color?: string;
                    question_count?: number;
                    is_active?: boolean;
                    min_level?: number;
                    subscription_required?: SubscriptionTier;
                };
                Update: {
                    name_en?: string;
                    name_am?: string | null;
                    name_om?: string | null;
                    badge?: string;
                    description_en?: string | null;
                    description_am?: string | null;
                    description_om?: string | null;
                    color?: string;
                    question_count?: number;
                    is_active?: boolean;
                    min_level?: number;
                    subscription_required?: SubscriptionTier;
                };
            };
            seasons: {
                Row: {
                    id: string;
                    competition_id: string;
                    name: string;
                    starts_at: string;
                    ends_at: string;
                    status: SeasonStatus;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    competition_id: string;
                    name: string;
                    starts_at: string;
                    ends_at: string;
                    status?: SeasonStatus;
                };
                Update: {
                    competition_id?: string;
                    name?: string;
                    starts_at?: string;
                    ends_at?: string;
                    status?: SeasonStatus;
                };
            };
            matches: {
                Row: {
                    id: string;
                    user_id: string;
                    competition_id: string | null;
                    season_id: string | null;
                    match_type: MatchType;
                    opponent_id: string | null;
                    live_match_id: string | null;
                    goals: number;
                    correct_answers: number;
                    total_questions: number;
                    accuracy: number | null;
                    avg_response_time: number | null;
                    max_combo: number;
                    match_rating: number | null;
                    coins_earned: number;
                    xp_earned: number;
                    elo_change: number;
                    is_winner: boolean | null;
                    answers: Json | null;
                    played_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    competition_id?: string | null;
                    season_id?: string | null;
                    match_type: MatchType;
                    opponent_id?: string | null;
                    live_match_id?: string | null;
                    goals?: number;
                    correct_answers?: number;
                    total_questions?: number;
                    accuracy?: number | null;
                    avg_response_time?: number | null;
                    max_combo?: number;
                    match_rating?: number | null;
                    coins_earned?: number;
                    xp_earned?: number;
                    elo_change?: number;
                    is_winner?: boolean | null;
                    answers?: Json | null;
                };
                Update: {
                    correct_answers?: number;
                    total_questions?: number;
                    accuracy?: number | null;
                    avg_response_time?: number | null;
                    max_combo?: number;
                    match_rating?: number | null;
                    coins_earned?: number;
                    xp_earned?: number;
                    elo_change?: number;
                    is_winner?: boolean | null;
                    answers?: Json | null;
                };
            };
            matchmaking_queue: {
                Row: {
                    id: string;
                    user_id: string;
                    elo_rating: number;
                    competition_id: string | null;
                    joined_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    elo_rating: number;
                    competition_id?: string | null;
                };
                Update: {
                    elo_rating?: number;
                    competition_id?: string | null;
                };
            };
            live_matches: {
                Row: {
                    id: string;
                    player_a_id: string;
                    player_b_id: string;
                    competition_id: string | null;
                    question_ids: string[];
                    status: LiveMatchStatus;
                    player_a_score: number;
                    player_b_score: number;
                    current_question: number;
                    winner_id: string | null;
                    started_at: string | null;
                    completed_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    player_a_id: string;
                    player_b_id: string;
                    competition_id?: string | null;
                    question_ids: string[];
                    status?: LiveMatchStatus;
                };
                Update: {
                    status?: LiveMatchStatus;
                    player_a_score?: number;
                    player_b_score?: number;
                    current_question?: number;
                    winner_id?: string | null;
                    started_at?: string | null;
                    completed_at?: string | null;
                };
            };
            live_match_answers: {
                Row: {
                    id: string;
                    live_match_id: string;
                    user_id: string;
                    question_index: number;
                    selected_index: number;
                    response_time_ms: number;
                    is_correct: boolean;
                    answered_at: string;
                };
                Insert: {
                    id?: string;
                    live_match_id: string;
                    user_id: string;
                    question_index: number;
                    selected_index: number;
                    response_time_ms: number;
                    is_correct: boolean;
                };
                Update: never;
            };
            tournaments: {
                Row: {
                    id: string;
                    name_en: string;
                    name_am: string | null;
                    name_om: string | null;
                    competition_id: string | null;
                    max_players: number;
                    bracket_size: number | null;
                    status: TournamentStatus;
                    starts_at: string;
                    prize_coins: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name_en: string;
                    name_am?: string | null;
                    name_om?: string | null;
                    competition_id?: string | null;
                    max_players?: number;
                    bracket_size?: number | null;
                    status?: TournamentStatus;
                    starts_at: string;
                    prize_coins?: number;
                };
                Update: {
                    name_en?: string;
                    name_am?: string | null;
                    name_om?: string | null;
                    status?: TournamentStatus;
                    bracket_size?: number | null;
                    prize_coins?: number;
                };
            };
            tournament_registrations: {
                Row: {
                    tournament_id: string;
                    user_id: string;
                    registered_at: string;
                };
                Insert: {
                    tournament_id: string;
                    user_id: string;
                };
                Update: never;
            };
            tournament_brackets: {
                Row: {
                    id: string;
                    tournament_id: string;
                    round: number;
                    match_slot: number;
                    player_a_id: string | null;
                    player_b_id: string | null;
                    winner_id: string | null;
                    live_match_id: string | null;
                    status: BracketStatus;
                };
                Insert: {
                    id?: string;
                    tournament_id: string;
                    round: number;
                    match_slot: number;
                    player_a_id?: string | null;
                    player_b_id?: string | null;
                    status?: BracketStatus;
                };
                Update: {
                    winner_id?: string | null;
                    live_match_id?: string | null;
                    status?: BracketStatus;
                };
            };
            challenges: {
                Row: {
                    id: string;
                    challenger_id: string;
                    opponent_id: string;
                    match_id: string;
                    question_ids: string[];
                    opponent_match_id: string | null;
                    status: ChallengeStatus;
                    expires_at: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    challenger_id: string;
                    opponent_id: string;
                    match_id: string;
                    question_ids: string[];
                    status?: ChallengeStatus;
                };
                Update: {
                    opponent_match_id?: string | null;
                    status?: ChallengeStatus;
                };
            };
            leaderboard_entries: {
                Row: {
                    id: string;
                    user_id: string;
                    competition_id: string | null;
                    season_id: string | null;
                    time_range: LeaderboardTimeRange;
                    score: number;
                    matches_played: number;
                    wins: number;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    competition_id?: string | null;
                    season_id?: string | null;
                    time_range: LeaderboardTimeRange;
                    score?: number;
                    matches_played?: number;
                    wins?: number;
                };
                Update: {
                    score?: number;
                    matches_played?: number;
                    wins?: number;
                    updated_at?: string;
                };
            };
            achievements: {
                Row: {
                    id: string;
                    name_en: string;
                    name_am: string | null;
                    name_om: string | null;
                    description_en: string;
                    description_am: string | null;
                    description_om: string | null;
                    icon: string;
                    category: string;
                    requirement_type: string;
                    requirement_value: number;
                    reward_coins: number;
                    reward_xp: number;
                };
                Insert: {
                    id: string;
                    name_en: string;
                    name_am?: string | null;
                    name_om?: string | null;
                    description_en: string;
                    description_am?: string | null;
                    description_om?: string | null;
                    icon: string;
                    category: string;
                    requirement_type: string;
                    requirement_value: number;
                    reward_coins?: number;
                    reward_xp?: number;
                };
                Update: {
                    name_en?: string;
                    name_am?: string | null;
                    name_om?: string | null;
                    description_en?: string;
                    description_am?: string | null;
                    description_om?: string | null;
                    icon?: string;
                    requirement_value?: number;
                    reward_coins?: number;
                    reward_xp?: number;
                };
            };
            user_achievements: {
                Row: {
                    user_id: string;
                    achievement_id: string;
                    earned_at: string;
                };
                Insert: {
                    user_id: string;
                    achievement_id: string;
                };
                Update: never;
            };
            daily_challenges: {
                Row: {
                    id: string;
                    challenge_date: string;
                    theme_en: string;
                    theme_am: string | null;
                    theme_om: string | null;
                    question_ids: string[];
                    bonus_multiplier: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    challenge_date: string;
                    theme_en: string;
                    theme_am?: string | null;
                    theme_om?: string | null;
                    question_ids: string[];
                    bonus_multiplier?: number;
                };
                Update: {
                    theme_en?: string;
                    theme_am?: string | null;
                    theme_om?: string | null;
                    question_ids?: string[];
                    bonus_multiplier?: number;
                };
            };
            daily_challenge_completions: {
                Row: {
                    user_id: string;
                    challenge_date: string;
                    match_id: string;
                    completed_at: string;
                };
                Insert: {
                    user_id: string;
                    challenge_date: string;
                    match_id: string;
                };
                Update: never;
            };
            subscriptions: {
                Row: {
                    id: string;
                    user_id: string;
                    phone: string;
                    tier: SubscriptionTier;
                    status: SubscriptionStatus;
                    started_at: string;
                    expires_at: string | null;
                    auto_renew: boolean;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    phone: string;
                    tier: SubscriptionTier;
                    status?: SubscriptionStatus;
                    expires_at?: string | null;
                    auto_renew?: boolean;
                };
                Update: {
                    tier?: SubscriptionTier;
                    status?: SubscriptionStatus;
                    expires_at?: string | null;
                    auto_renew?: boolean;
                };
            };
        };
        Functions: {
            submit_match_result: {
                Args: {
                    p_match_type: MatchType;
                    p_competition_id: string | null;
                    p_answers: Json;
                };
                Returns: Json;
            };
            get_leaderboard: {
                Args: {
                    p_competition_id: string | null;
                    p_time_range: LeaderboardTimeRange;
                    p_limit: number;
                };
                Returns: Json;
            };
            get_daily_challenge: {
                Args: Record<string, never>;
                Returns: Json;
            };
            claim_daily_streak: {
                Args: Record<string, never>;
                Returns: Json;
            };
        };
    };
}

// Convenience type aliases for common operations
export type UserRow = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type QuestionRow = Database['public']['Tables']['questions']['Row'];
export type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
export type QuestionUpdate = Database['public']['Tables']['questions']['Update'];

export type CompetitionRow = Database['public']['Tables']['competitions']['Row'];
export type CompetitionInsert = Database['public']['Tables']['competitions']['Insert'];

export type SeasonRow = Database['public']['Tables']['seasons']['Row'];

export type MatchRow = Database['public']['Tables']['matches']['Row'];
export type MatchInsert = Database['public']['Tables']['matches']['Insert'];

export type LiveMatchRow = Database['public']['Tables']['live_matches']['Row'];
export type LiveMatchAnswerRow = Database['public']['Tables']['live_match_answers']['Row'];

export type LeaderboardEntryRow = Database['public']['Tables']['leaderboard_entries']['Row'];

export type ChallengeRow = Database['public']['Tables']['challenges']['Row'];

export type TournamentRow = Database['public']['Tables']['tournaments']['Row'];
export type TournamentBracketRow = Database['public']['Tables']['tournament_brackets']['Row'];

export type AchievementRow = Database['public']['Tables']['achievements']['Row'];
export type UserAchievementRow = Database['public']['Tables']['user_achievements']['Row'];

export type DailyChallengeRow = Database['public']['Tables']['daily_challenges']['Row'];

export type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row'];
