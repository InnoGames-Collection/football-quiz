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
                if (timeRange === 'daily') {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const { data, error } = await (supabase.rpc as any)('get_daily_leaderboard', {
                        p_date: todayStr
                    });
                    
                    if (!error && data && Array.isArray(data)) {
                        // The get_daily_leaderboard returns user_id, username, avatar_url, score, time_taken_ms
                        // We map it to LeaderboardDisplayEntry format
                        const mappedData = data.map((item: any, index: number) => ({
                            rank: index + 1,
                            userId: item.user_id,
                            username: item.username || 'Anonymous Player',
                            avatarUrl: item.avatar_url,
                            eloRating: 1200, // Not applicable for daily
                            score: item.score || 0,
                            matchesPlayed: 1,
                            wins: 1
                        }));
                        
                        // Cache my daily rank if I'm in the top 50
                        const myUserId = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user?.id : null;
                        if (myUserId) {
                            const myEntry = mappedData.find((e: any) => e.userId === myUserId);
                            if (myEntry) {
                                localStorage.setItem('ETHIO_DAILY_RANK', myEntry.rank.toString());
                            } else {
                                localStorage.removeItem('ETHIO_DAILY_RANK');
                            }
                        }
                        return mappedData;
                    }
                } else {
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
                }
            } catch (err) {
                console.warn('[LeaderboardService] RPC query failed, returning empty list:', err);
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
