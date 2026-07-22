import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { GameSessionRow, GameSessionAnswerRow } from '../supabase/types';

export class GameSessionService {
    private static _instance: GameSessionService | null = null;

    private constructor() {}

    public static getInstance(): GameSessionService {
        if (!GameSessionService._instance) {
            GameSessionService._instance = new GameSessionService();
        }
        return GameSessionService._instance;
    }

    public async createSession(
        matchType: string,
        competitionId: string | null,
        difficulty: string,
        questionIds: string[]
    ): Promise<GameSessionRow | null> {
        if (!supabaseService.isOnline) return null;
        const client = supabase;
        if (!client) return null;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return null;

            const { data, error } = await client
                .from('game_sessions')
                .insert({
                    user_id: user.id,
                    match_type: matchType as any,
                    competition_id: competitionId,
                    difficulty: typeof difficulty === 'string' ? parseInt(difficulty, 10) : difficulty,
                    question_ids: questionIds,
                    total_questions: questionIds.length,
                    time_remaining: 60,
                    state: 'playing'
                })
                .select()
                .single();

            if (error) {
                console.warn('[GameSessionService] Error creating session:', error);
                return null;
            }
            return data;
        } catch (err) {
            console.warn('[GameSessionService] Failed to create session:', err);
            return null;
        }
    }

    public async getActiveSession(): Promise<GameSessionRow | null> {
        if (!supabaseService.isOnline) return null;
        const client = supabase;
        if (!client) return null;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return null;

            const { data, error } = await client
                .from('game_sessions')
                .select('*')
                .eq('user_id', user.id)
                .in('state', ['playing', 'paused'])
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is no rows returned
                console.warn('[GameSessionService] Error fetching active session:', error);
                return null;
            }
            return data;
        } catch (err) {
            console.warn('[GameSessionService] Failed to get active session:', err);
            return null;
        }
    }

    public async updateSession(sessionId: string, updates: Partial<GameSessionRow>): Promise<void> {
        if (!supabaseService.isOnline) return;
        const client = supabase;
        if (!client) return;
        try {
            const { error } = await client
                .from('game_sessions')
                .update(updates as any)
                .eq('id', sessionId);

            if (error) {
                console.warn('[GameSessionService] Error updating session:', error);
            }
        } catch (err) {
            console.warn('[GameSessionService] Failed to update session:', err);
        }
    }

    public async pauseSession(sessionId: string): Promise<void> {
        return this.updateSession(sessionId, { 
            state: 'paused', 
            paused_at: new Date().toISOString() 
        });
    }

    public async resumeSession(sessionId: string): Promise<void> {
        return this.updateSession(sessionId, { 
            state: 'playing', 
            paused_at: null 
        });
    }

    public async completeSession(
        sessionId: string,
        finalScore: number,
        accuracy: number,
        avgTime: number,
        maxCombo: number
    ): Promise<void> {
        return this.updateSession(sessionId, {
            state: 'completed',
            final_score: finalScore,
            accuracy,
            avg_response_time: avgTime,
            max_combo: maxCombo,
            completed_at: new Date().toISOString()
        } as any);
    }

    public async abandonSession(sessionId: string): Promise<void> {
        return this.updateSession(sessionId, {
            state: 'abandoned',
            completed_at: new Date().toISOString()
        });
    }

    public async recordAnswer(
        sessionId: string,
        questionId: string,
        questionIndex: number,
        selectedIndex: number,
        correctIndex: number,
        isCorrect: boolean,
        responseTimeMs: number
    ): Promise<void> {
        if (!supabaseService.isOnline) return;
        const client = supabase;
        if (!client) return;
        try {
            const { error } = await client
                .from('game_session_answers')
                .insert({
                    session_id: sessionId,
                    question_id: questionId,
                    question_index: questionIndex,
                    selected_index: selectedIndex,
                    correct_index: correctIndex,
                    is_correct: isCorrect,
                    response_time_ms: responseTimeMs
                });

            if (error) {
                console.warn('[GameSessionService] Error recording answer:', error);
            }
        } catch (err) {
            console.warn('[GameSessionService] Failed to record answer:', err);
        }
    }

    public async getSessionAnswers(sessionId: string): Promise<GameSessionAnswerRow[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data, error } = await client
                .from('game_session_answers')
                .select('*')
                .eq('session_id', sessionId)
                .order('question_index', { ascending: true });

            if (error) {
                console.warn('[GameSessionService] Error fetching session answers:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.warn('[GameSessionService] Failed to get session answers:', err);
            return [];
        }
    }

    public async getHistory(limit: number = 20): Promise<GameSessionRow[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return [];

            const { data, error } = await client
                .from('game_sessions')
                .select('*')
                .eq('user_id', user.id)
                .eq('state', 'completed')
                .order('completed_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.warn('[GameSessionService] Error fetching session history:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.warn('[GameSessionService] Failed to get session history:', err);
            return [];
        }
    }
}
