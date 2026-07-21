import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { UserRow } from '../supabase/types';

export interface OpponentMatchInfo {
    liveMatchId: string;
    opponent: UserRow;
    questionIds: string[];
}

export type MatchFoundListener = (info: OpponentMatchInfo) => void;

export class MatchmakingService {
    private static _instance: MatchmakingService | null = null;
    private _inQueue: boolean = false;
    private _listeners: Set<MatchFoundListener> = new Set();
    private _searchTimer: any = null;

    public static getInstance(): MatchmakingService {
        if (!MatchmakingService._instance) {
            MatchmakingService._instance = new MatchmakingService();
        }
        return MatchmakingService._instance;
    }

    public async joinQueue(user: UserRow, competitionId?: string): Promise<{ success: boolean; error?: string }> {
        if (this._inQueue) return { success: true };

        if (supabaseService.isOnline && supabase) {
            try {
                // Delete stale queue entries for this user
                await (supabase.from('matchmaking_queue' as any) as any)
                    .delete()
                    .eq('user_id', user.id);

                // Insert into matchmaking queue
                const { error } = await (supabase.from('matchmaking_queue' as any) as any)
                    .insert({
                        user_id: user.id,
                        elo_rating: user.elo_rating || 1200,
                        competition_id: competitionId || null
                    });

                if (error) {
                    return { success: false, error: error.message };
                }

                this._inQueue = true;
                this._startPollingForMatch(user.id);
                return { success: true };
            } catch (err: any) {
                return { success: false, error: err.message };
            }
        }

        // Mock offline opponent fallback (e.g. after 3 seconds)
        this._inQueue = true;
        setTimeout(() => {
            if (this._inQueue) {
                const mockOpponent: UserRow = {
                    id: 'bot-1',
                    username: 'Solomon_Walia',
                    phone: null,
                    avatar_url: null,
                    locale: 'en',
                    elo_rating: 1220,
                    coins: 500,
                    xp: 1200,
                    total_matches: 15,
                    total_wins: 10,
                    subscription_tier: 'free',
                    streak_count: 5,
                    streak_last_date: null,
                    created_at: new Date().toISOString(),
                    last_active: new Date().toISOString()
                };

                this._notifyMatchFound({
                    liveMatchId: 'mock-live-match-1',
                    opponent: mockOpponent,
                    questionIds: []
                });
                this.leaveQueue(user.id);
            }
        }, 3000);

        return { success: true };
    }

    private _startPollingForMatch(userId: string): void {
        let attempts = 0;
        this._searchTimer = setInterval(async () => {
            attempts++;
            if (!this._inQueue || !supabase) {
                clearInterval(this._searchTimer);
                return;
            }

            try {
                // Check if a live match has been created involving this player
                const { data, error } = await (supabase.from('live_matches' as any) as any)
                    .select('*')
                    .or(`player_a_id.eq.${userId},player_b_id.eq.${userId}`)
                    .eq('status', 'waiting')
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (!error && data && data.length > 0) {
                    const match = data[0];
                    const opponentId = match.player_a_id === userId ? match.player_b_id : match.player_a_id;

                    // Fetch opponent details
                    const { data: oppData } = await (supabase.from('users' as any) as any)
                        .select('*')
                        .eq('id', opponentId)
                        .single();

                    clearInterval(this._searchTimer);
                    this.leaveQueue(userId);

                    this._notifyMatchFound({
                        liveMatchId: match.id,
                        opponent: oppData as UserRow,
                        questionIds: match.question_ids || []
                    });
                }
            } catch (err) {
                console.warn('[MatchmakingService] Polling error:', err);
            }

            // After 30 seconds of searching, spawn AI opponent
            if (attempts >= 15 && this._inQueue) {
                clearInterval(this._searchTimer);
                this._spawnAiOpponent(userId);
            }
        }, 2000);
    }

    private _spawnAiOpponent(userId: string): void {
        const aiUser: UserRow = {
            id: 'bot-ai',
            username: 'Ethiopian_Star_AI',
            phone: null,
            avatar_url: null,
            locale: 'en',
            elo_rating: 1250,
            coins: 1000,
            xp: 2500,
            total_matches: 40,
            total_wins: 28,
            subscription_tier: 'free',
            streak_count: 12,
            streak_last_date: null,
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString()
        };

        this._notifyMatchFound({
            liveMatchId: `ai-match-${Date.now()}`,
            opponent: aiUser,
            questionIds: []
        });
        this.leaveQueue(userId);
    }

    public async leaveQueue(userId: string): Promise<void> {
        this._inQueue = false;
        if (this._searchTimer) {
            clearInterval(this._searchTimer);
            this._searchTimer = null;
        }

        if (supabaseService.isOnline && supabase) {
            try {
                await (supabase.from('matchmaking_queue' as any) as any)
                    .delete()
                    .eq('user_id', userId);
            } catch (e) {
                console.warn('[MatchmakingService] Error removing from queue:', e);
            }
        }
    }

    public onMatchFound(listener: MatchFoundListener): () => void {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    private _notifyMatchFound(info: OpponentMatchInfo): void {
        this._listeners.forEach(l => l(info));
    }

    public get isSearching(): boolean {
        return this._inQueue;
    }
}
