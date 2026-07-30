import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import type { ExtendedQuestionData } from '../quiz/QuestionBank';
import { QuestionBank } from '../quiz/QuestionBank';
import { i18n } from '../../localization/i18n';

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
                    if (res.available && res.question_ids && res.question_ids.length > 0) {
                        const questions = await QuestionBank.getInstance().fetchQuestionsByIds(res.question_ids, i18n.currentLocale as any);
                        const isCompleted = res.completed || false;
                        if (isCompleted) {
                            localStorage.setItem('ETHIO_DAILY_COMPLETED_TODAY', 'true');
                        } else {
                            localStorage.removeItem('ETHIO_DAILY_COMPLETED_TODAY');
                        }
                        
                        return {
                            id: res.id,
                            themeEn: res.theme_en || 'Daily Football Quiz Challenge',
                            themeAm: res.theme_am || 'የዕለቱ የእግር ኳስ ጥያቄ ተግዳሮት',
                            themeOm: res.theme_om || 'Qormaata Gaaffii Kubbaa Miilaa Guyyaa',
                            bonusMultiplier: res.bonusMultiplier || 1.5,
                            completed: isCompleted,
                            questions
                        };
                    }
                }
            } catch (err) {
                console.warn('[DailyChallengeManager] Supabase fetch failed:', err);
            }
        }

        // Offline / Default Daily Challenge
        const questions = await QuestionBank.getInstance().fetchQuestions('world-cup', 10, i18n.currentLocale as any);
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
