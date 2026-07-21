import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import type { ExtendedQuestionData } from '../quiz/QuestionBank';
import { QuestionBank } from '../quiz/QuestionBank';

export interface DailyChallengeInfo {
    id?: string;
    themeEn: string;
    themeAm?: string;
    themeOm?: string;
    bonusMultiplier: number;
    completed: boolean;
    questions: ExtendedQuestionData[];
}

export class DailyChallengeManager {
    private static _instance: DailyChallengeManager | null = null;

    public static getInstance(): DailyChallengeManager {
        if (!DailyChallengeManager._instance) {
            DailyChallengeManager._instance = new DailyChallengeManager();
        }
        return DailyChallengeManager._instance;
    }

    public async getTodayChallenge(): Promise<DailyChallengeInfo> {
        if (supabaseService.isOnline && supabase) {
            try {
                const { data, error } = await supabase.rpc('get_daily_challenge');

                if (!error && data) {
                    const res = data as any;
                    if (res.available) {
                        const questions = await QuestionBank.getInstance().fetchQuestions(undefined, 5);
                        return {
                            id: res.id,
                            themeEn: res.theme_en || 'Daily Football Quiz Challenge',
                            themeAm: res.theme_am || 'የዕለቱ የእግር ኳስ ጥያቄ ተግዳሮት',
                            themeOm: res.theme_om || 'Qormaata Gaaffii Kubbaa Miilaa Guyyaa',
                            bonusMultiplier: res.bonusMultiplier || 1.5,
                            completed: res.completed || false,
                            questions
                        };
                    }
                }
            } catch (err) {
                console.warn('[DailyChallengeManager] Supabase fetch failed:', err);
            }
        }

        // Offline / Default Daily Challenge
        const questions = await QuestionBank.getInstance().fetchQuestions('world-cup', 5);
        return {
            themeEn: "Daily Champions Challenge",
            themeAm: "የዕለቱ የሻምፒዮኖች ተግዳሮት",
            themeOm: "Qormaata Chaampiyoonii Guyyaa",
            bonusMultiplier: 1.5,
            completed: false,
            questions
        };
    }
}
