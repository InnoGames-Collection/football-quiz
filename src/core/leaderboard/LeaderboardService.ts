import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import type { LeaderboardTimeRange } from '../../networking/supabase/types';

export interface LeaderboardDisplayEntry {
    rank: number;
    userId: string;
    username: string;
    avatarUrl?: string;
    eloRating: number;
    score: number;
    matchesPlayed: number;
    wins: number;
}

export class LeaderboardService {
    private static _instance: LeaderboardService | null = null;

    public static getInstance(): LeaderboardService {
        if (!LeaderboardService._instance) {
            LeaderboardService._instance = new LeaderboardService();
        }
        return LeaderboardService._instance;
    }

    public async getLeaderboard(
        competitionId?: string,
        timeRange: LeaderboardTimeRange = 'all_time',
        limit: number = 50
    ): Promise<LeaderboardDisplayEntry[]> {
        if (supabaseService.isOnline && supabase) {
            try {
                const { data, error } = await (supabase.rpc as any)('get_leaderboard', {
                    p_competition_id: competitionId || null,
                    p_time_range: timeRange,
                    p_limit: limit
                });

                if (!error && data && Array.isArray(data)) {
                    return data.map((item: any) => ({
                        rank: item.rank,
                        userId: item.user_id,
                        username: item.username || 'Anonymous Player',
                        avatarUrl: item.avatar_url,
                        eloRating: item.elo_rating || 1200,
                        score: item.score || 0,
                        matchesPlayed: item.matches_played || 0,
                        wins: item.wins || 0
                    }));
                }
            } catch (err) {
                console.warn('[LeaderboardService] RPC query failed, returning local mock data:', err);
            }
        }

        // Mock Fallback Leaderboard
        return [
            { rank: 1, userId: 'u-1', username: 'Abebe Bikila', eloRating: 1850, score: 9400, matchesPlayed: 42, wins: 38 },
            { rank: 2, userId: 'u-2', username: 'Walia Champion', eloRating: 1720, score: 8200, matchesPlayed: 38, wins: 31 },
            { rank: 3, userId: 'u-3', username: 'Getaneh Fan', eloRating: 1650, score: 7500, matchesPlayed: 35, wins: 28 },
            { rank: 4, userId: 'u-4', username: 'Saint George 1968', eloRating: 1580, score: 6900, matchesPlayed: 30, wins: 24 },
            { rank: 5, userId: 'u-5', username: 'Meskel Square FC', eloRating: 1510, score: 6200, matchesPlayed: 28, wins: 20 }
        ];
    }
}
