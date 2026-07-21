import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { MatchType } from '../supabase/types';

export interface AnswerSubmissionItem {
    questionId: string;
    selectedIndex: number;
    responseTimeMs: number;
}

export interface MatchSubmissionPayload {
    matchType: MatchType;
    competitionId?: string;
    answers: AnswerSubmissionItem[];
}

export interface MatchSubmissionResult {
    success: boolean;
    matchId?: string;
    correct?: number;
    total?: number;
    accuracy?: number;
    coins?: number;
    xp?: number;
    rating?: number;
    error?: string;
}

export class MatchSubmissionService {
    private static _instance: MatchSubmissionService | null = null;

    public static getInstance(): MatchSubmissionService {
        if (!MatchSubmissionService._instance) {
            MatchSubmissionService._instance = new MatchSubmissionService();
        }
        return MatchSubmissionService._instance;
    }

    public async submitMatch(payload: MatchSubmissionPayload): Promise<MatchSubmissionResult> {
        if (supabaseService.isOnline && supabase) {
            try {
                const { data, error } = await (supabase.rpc as any)('submit_match_result', {
                    p_match_type: payload.matchType,
                    p_competition_id: payload.competitionId || null,
                    p_answers: payload.answers
                });

                if (!error && data) {
                    const res = data as any;
                    return {
                        success: true,
                        matchId: res.matchId,
                        correct: res.correct,
                        total: res.total,
                        accuracy: res.accuracy,
                        coins: res.coins,
                        xp: res.xp,
                        rating: res.rating
                    };
                } else if (error) {
                    return { success: false, error: error.message };
                }
            } catch (err: any) {
                console.warn('[MatchSubmissionService] RPC submission failed:', err);
                return { success: false, error: err.message };
            }
        }

        return {
            success: true,
            coins: payload.answers.length * 100,
            xp: payload.answers.length * 20,
            rating: 8.5
        };
    }
}
