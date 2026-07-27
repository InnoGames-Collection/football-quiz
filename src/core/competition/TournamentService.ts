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
            return this._getMockLeaderboard(periodType);
        }

        try {
            const { data, error } = await supabase.rpc('get_tournament_leaderboard' as any, {
                p_period_type: periodType,
                p_limit: limit
            });

            if (error) {
                console.warn('[TournamentService] Error fetching leaderboard:', error);
                return this._getMockLeaderboard(periodType);
            }

            return (data as any[]) || [];
        } catch (e) {
            console.warn('[TournamentService] Exception fetching leaderboard:', e);
            return this._getMockLeaderboard(periodType);
        }
    }

    private _getMockLeaderboard(periodType: string): TournamentLeaderboardEntry[] {
        const factor = periodType === 'yearly' ? 12 : (periodType === 'monthly' ? 4 : 1);
        return Array.from({ length: 15 }).map((_, i) => ({
            userId: `mock-${i}`,
            username: `Player ${i + 1}`,
            score: (15 - i) * 1000 * factor,
            matchesPlayed: (15 - i) * factor,
            totalTimeMs: 50000 * factor
        }));
    }
}
