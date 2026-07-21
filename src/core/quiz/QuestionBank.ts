import { EdgeFunctionClient } from '../../networking/supabase/EdgeFunctionClient';
import { supabaseService, supabase } from '../../networking/supabase/SupabaseClient';
import type { QuestionRow, Locale } from '../../networking/supabase/types';
import type { QuestionData } from '../../ui/screens/ScoreboardQuestionScreen';

export interface ExtendedQuestionData extends QuestionData {
    id?: string;
    category?: string;
    difficulty?: number;
    answerHash?: string;
    promptEn?: string;
    promptAm?: string;
    promptOm?: string;
    optionsEn?: string[];
    optionsAm?: string[];
    optionsOm?: string[];
}

export class QuestionBank {
    private static _instance: QuestionBank | null = null;
    private _askedQuestionIds: Set<string> = new Set();

    private _fallbackQuestions: ExtendedQuestionData[] = [
        {
            id: 'fb-1',
            category: 'walia-ibex',
            difficulty: 2,
            prompt: "Which Ethiopian club won the CAF Champions League (formerly African Cup of Champions Clubs) in 1968?",
            options: ["Saint George SC", "Omedla FC", "Cotton Factory Club", "Defense Force"],
            correctIndex: 0
        },
        {
            id: 'fb-2',
            category: 'walia-ibex',
            difficulty: 1,
            prompt: "In which year did Ethiopia win the Africa Cup of Nations (AFCON)?",
            options: ["1957", "1962", "1970", "1984"],
            correctIndex: 1
        },
        {
            id: 'fb-3',
            category: 'walia-ibex',
            difficulty: 2,
            prompt: "Who is the all-time top scorer for the Ethiopian National Football Team (Walia Ibex)?",
            options: ["Getaneh Kebede", "Saladin Said", "Luciano Vassalo", "Mengistu Worku"],
            correctIndex: 0
        },
        {
            id: 'fb-4',
            category: 'world-cup',
            difficulty: 1,
            prompt: "Which country hosted the 2022 FIFA World Cup?",
            options: ["Qatar", "Brazil", "Russia", "South Africa"],
            correctIndex: 0
        },
        {
            id: 'fb-5',
            category: 'legendary-players',
            difficulty: 1,
            prompt: "Which player has won the most Ballon d'Or awards in history?",
            options: ["Cristiano Ronaldo", "Lionel Messi", "Zinedine Zidane", "Pelé"],
            correctIndex: 1
        }
    ];

    public static getInstance(): QuestionBank {
        if (!QuestionBank._instance) {
            QuestionBank._instance = new QuestionBank();
        }
        return QuestionBank._instance;
    }

    /**
     * Fetch questions via Edge Function ('questions') with answer hash security,
     * falling back to Supabase DB query or local seed questions.
     */
    public async fetchQuestions(
        competitionId?: string,
        count: number = 10,
        locale: Locale = 'en'
    ): Promise<ExtendedQuestionData[]> {
        // 1. Try Supabase Edge Function ('questions')
        if (supabaseService.isOnline) {
            const { data, error } = await EdgeFunctionClient.invoke('questions', {
                competitionId,
                count,
                locale
            });

            if (!error && data && data.questions && data.questions.length > 0) {
                console.log('[QuestionBank] Fetched secure questions via Edge Function.');
                return data.questions as ExtendedQuestionData[];
            }
        }

        // 2. Direct Supabase DB Query
        if (supabaseService.isOnline && supabase) {
            try {
                let query = (supabase.from('questions' as any) as any)
                    .select('*')
                    .eq('is_active', true);

                if (competitionId) {
                    query = query.or(`competition_id.eq.${competitionId},category.eq.${competitionId}`);
                }

                const { data, error } = await query.limit(50);

                if (!error && data && data.length >= 5) {
                    const mapped = data.map((row: QuestionRow) => this._mapQuestionRow(row, locale));
                    return this._selectQuestions(mapped, count);
                }
            } catch (err) {
                console.warn('[QuestionBank] Supabase query fallback failed:', err);
            }
        }

        // 3. Local Seed Fallback
        return this._selectQuestions(this._fallbackQuestions, count);
    }

    private _mapQuestionRow(row: QuestionRow, locale: Locale): ExtendedQuestionData {
        let prompt = row.prompt_en;
        let options = row.options_en;

        if (locale === 'am' && row.prompt_am && row.options_am) {
            prompt = row.prompt_am;
            options = row.options_am;
        } else if (locale === 'om' && row.prompt_om && row.options_om) {
            prompt = row.prompt_om;
            options = row.options_om;
        }

        return {
            id: row.id,
            category: row.category,
            difficulty: row.difficulty,
            prompt,
            options,
            correctIndex: row.correct_index
        };
    }

    private _selectQuestions(pool: ExtendedQuestionData[], count: number): ExtendedQuestionData[] {
        const unasked = pool.filter(q => q.id && !this._askedQuestionIds.has(q.id));
        const chosenPool = unasked.length >= count ? unasked : pool;

        const shuffled = [...chosenPool];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const selected = shuffled.slice(0, count);
        selected.forEach(q => {
            if (q.id) this._askedQuestionIds.add(q.id);
        });

        return selected;
    }
}
