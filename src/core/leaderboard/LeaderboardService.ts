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
        return [];
    }

    public async getUserRank(userId: string, competitionId?: string): Promise<number | null> {
        if (!userId) return null;
        try {
            const leaderboard = await this.getLeaderboard(competitionId);
            const userEntry = leaderboard.find(entry => entry.userId === userId);
            if (userEntry) return userEntry.rank;
        } catch (err) {
            console.warn('[LeaderboardService] Failed to get user rank:', err);
        }
        return null;
    }
}
