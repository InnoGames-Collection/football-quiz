import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { ChallengeRow, UserRow } from '../supabase/types';

export interface ExtendedChallengeInfo {
    id: string;
    challenger: UserRow;
    opponent: UserRow;
    questionIds: string[];
    status: string;
    expiresAt: string;
}

export class ChallengeService {
    private static _instance: ChallengeService | null = null;

    public static getInstance(): ChallengeService {
        if (!ChallengeService._instance) {
            ChallengeService._instance = new ChallengeService();
        }
        return ChallengeService._instance;
    }

    public async sendChallenge(
        challengerId: string,
        opponentId: string,
        matchId: string,
        questionIds: string[]
    ): Promise<{ success: boolean; error?: string }> {
        if (supabaseService.isOnline && supabase) {
            try {
                const { error } = await (supabase.from('challenges' as any) as any).insert({
                    challenger_id: challengerId,
                    opponent_id: opponentId,
                    match_id: matchId,
                    question_ids: questionIds,
                    status: 'pending'
                });

                if (error) return { success: false, error: error.message };
                return { success: true };
            } catch (err: any) {
                return { success: false, error: err.message };
            }
        }

        return { success: true };
    }

    public async getPendingChallenges(userId: string): Promise<ChallengeRow[]> {
        if (supabaseService.isOnline && supabase) {
            try {
                const { data, error } = await (supabase.from('challenges' as any) as any)
                    .select('*')
                    .eq('opponent_id', userId)
                    .eq('status', 'pending');

                if (!error && data) {
                    return data as ChallengeRow[];
                }
            } catch (err) {
                console.warn('[ChallengeService] Failed to fetch pending challenges:', err);
            }
        }

        return [];
    }
}
