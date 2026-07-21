import { supabase, supabaseService } from '../supabase/SupabaseClient';
import { EdgeFunctionClient } from '../supabase/EdgeFunctionClient';
import type { UserRow } from '../supabase/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
    private _cdcChannel: RealtimeChannel | null = null;

    public static getInstance(): MatchmakingService {
        if (!MatchmakingService._instance) {
            MatchmakingService._instance = new MatchmakingService();
        }
        return MatchmakingService._instance;
    }

    public async joinQueue(user: UserRow, competitionId?: string): Promise<{ success: boolean; error?: string }> {
        if (this._inQueue) return { success: true };
        this._inQueue = true;

        if (supabaseService.isOnline && supabase) {
            // 1. Invoke matchmaking Edge Function
            const { data, error } = await EdgeFunctionClient.invoke('matchmaking', {
                userId: user.id,
                eloRating: user.elo_rating || 1200,
                competitionId
            });

            if (!error && data && data.matched && data.liveMatch) {
                console.log('[MatchmakingService] Matched instantly via Edge Function.');
                await this._handleMatchFound(data.liveMatch, user.id);
                return { success: true };
            }

            // 2. Subscribe to Postgres CDC on `live_matches` table
            this._subscribeToCdc(user.id);
            return { success: true };
        }

        // Offline / Simulated Matchmaking Fallback
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
        }, 2500);

        return { success: true };
    }

    private _subscribeToCdc(userId: string): void {
        if (!supabase) return;

        this._cdcChannel = supabase
            .channel('public:live_matches')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'live_matches'
                },
                async (payload) => {
                    const match = payload.new as any;
                    if (match.player_a_id === userId || match.player_b_id === userId) {
                        console.log('[MatchmakingService] Postgres CDC detected live match creation!');
                        await this._handleMatchFound(match, userId);
                    }
                }
            )
            .subscribe();
    }

    private async _handleMatchFound(match: any, userId: string): Promise<void> {
        const opponentId = match.player_a_id === userId ? match.player_b_id : match.player_a_id;
        let opponent: UserRow = {
            id: opponentId,
            username: 'Ethiopian_Rival',
            phone: null,
            avatar_url: null,
            locale: 'en',
            elo_rating: 1200,
            coins: 100,
            xp: 50,
            total_matches: 5,
            total_wins: 3,
            subscription_tier: 'free',
            streak_count: 1,
            streak_last_date: null,
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString()
        };

        if (supabase) {
            const { data } = await (supabase.from('users' as any) as any)
                .select('*')
                .eq('id', opponentId)
                .single();
            if (data) opponent = data as UserRow;
        }

        this.leaveQueue(userId);
        this._notifyMatchFound({
            liveMatchId: match.id,
            opponent,
            questionIds: match.question_ids || []
        });
    }

    public async leaveQueue(userId: string): Promise<void> {
        this._inQueue = false;

        if (this._cdcChannel && supabase) {
            supabase.removeChannel(this._cdcChannel);
            this._cdcChannel = null;
        }

        if (supabaseService.isOnline && supabase) {
            try {
                await (supabase.from('matchmaking_queue' as any) as any)
                    .delete()
                    .eq('user_id', userId);
            } catch (e) {
                console.warn('[MatchmakingService] Error leaving queue:', e);
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
