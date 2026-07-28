import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';

export interface TournamentLeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    matchesPlayed: number;
    totalTimeMs: number;
}

export class TournamentService {
    private static _instance: TournamentService | null = null;

    public static getInstance(): TournamentService {
        if (!TournamentService._instance) {
            TournamentService._instance = new TournamentService();
        }
        return TournamentService._instance;
    }

    public async getLeaderboard(periodType: 'weekly' | 'monthly' | 'yearly', limit: number = 100): Promise<TournamentLeaderboardEntry[]> {
        if (!supabaseService.isOnline || !supabase) {
            return [];
        }

        try {
            const { data, error } = await supabase.rpc('get_tournament_leaderboard' as any, {
                p_period_type: periodType,
                p_limit: limit
            });

            if (error) {
                console.warn('[TournamentService] Error fetching leaderboard:', error);
                return [];
            }

            return (data as any[]) || [];
        } catch (e) {
            console.warn('[TournamentService] Exception fetching leaderboard:', e);
            return [];
        }
    }
}
