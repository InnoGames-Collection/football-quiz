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

const OFFLINE_FALLBACK_QUESTIONS: ExtendedQuestionData[] = [
    {
        id: 'fb-1', category: 'walia-ibex', difficulty: 2,
        prompt: "Which country won the first ever African Cup of Nations (AFCON) in 1957?",
        options: ["Egypt", "Ethiopia", "Sudan", "South Africa"],
        correctIndex: 0
    },
    {
        id: 'fb-2', category: 'walia-ibex', difficulty: 1,
        prompt: "What is the nickname of the Ethiopian National Football Team?",
        options: ["The Lions", "Walia Ibex", "The Pharoahs", "Black Stars"],
        correctIndex: 1
    },
    {
        id: 'fb-3', category: 'ethiopian-premier-league', difficulty: 3,
        prompt: "Which club holds the record for the most Ethiopian Premier League titles?",
        options: ["Ethiopian Coffee SC", "Dedebit FC", "Fasil Kenema", "Saint George SC"],
        correctIndex: 3
    },
    {
        id: 'fb-4', category: 'ethiopian-premier-league', difficulty: 3,
        prompt: "In which year was the Ethiopian Premier League established in its current format?",
        options: ["1985", "1997", "2002", "2010"],
        correctIndex: 1
    },
    {
        id: 'fb-5', category: 'walia-ibex', difficulty: 4,
        prompt: "Who is Ethiopia's all-time top goalscorer in international football?",
        options: ["Getaneh Kebede", "Saladin Said", "Mengistu Worku", "Adane Girma"],
        correctIndex: 0
    },
    {
        id: 'fb-6', category: 'world-cup', difficulty: 1,
        prompt: "Which nation has won the most FIFA Men's World Cup titles?",
        options: ["Germany", "Brazil", "Argentina", "Italy"],
        correctIndex: 1
    },
    {
        id: 'fb-7', category: 'world-cup', difficulty: 2,
        prompt: "Who won the Golden Boot in the 2022 FIFA World Cup?",
        options: ["Lionel Messi", "Kylian Mbappé", "Julián Álvarez", "Olivier Giroud"],
        correctIndex: 1
    },
    {
        id: 'fb-8', category: 'champions-league', difficulty: 2,
        prompt: "Which player has scored the most goals in UEFA Champions League history?",
        options: ["Lionel Messi", "Robert Lewandowski", "Cristiano Ronaldo", "Karim Benzema"],
        correctIndex: 2
    },
    {
        id: 'fb-9', category: 'english-premier-league', difficulty: 3,
        prompt: "Which team holds the record for most points in a single English Premier League season?",
        options: ["Manchester United", "Liverpool", "Chelsea", "Manchester City"],
        correctIndex: 3
    },
    {
        id: 'fb-10', category: 'walia-ibex', difficulty: 4,
        prompt: "Ethiopia won its only African Cup of Nations title in which year?",
        options: ["1957", "1962", "1970", "1982"],
        correctIndex: 1
    },
    {
        id: 'fb-11', category: 'english-premier-league', difficulty: 2,
        prompt: "Who is the all-time top scorer of the English Premier League?",
        options: ["Wayne Rooney", "Alan Shearer", "Harry Kane", "Thierry Henry"],
        correctIndex: 1
    },
    {
        id: 'fb-12', category: 'ethiopian-premier-league', difficulty: 2,
        prompt: "What colors are primarily associated with Ethiopian Coffee SC?",
        options: ["Green and Yellow", "Red and White", "Brown and Gold", "Blue and White"],
        correctIndex: 2
    },
    {
        id: 'fb-13', category: 'world-cup', difficulty: 4,
        prompt: "Which African nation became the first to reach a FIFA World Cup Semi-Final?",
        options: ["Senegal", "Ghana", "Morocco", "Nigeria"],
        correctIndex: 2
    },
    {
        id: 'fb-14', category: 'champions-league', difficulty: 3,
        prompt: "Which club has won the most UEFA Champions League titles?",
        options: ["AC Milan", "Bayern Munich", "Liverpool", "Real Madrid"],
        correctIndex: 3
    },
    {
        id: 'fb-15', category: 'walia-ibex', difficulty: 5,
        prompt: "Who coached the Ethiopian National Team when they qualified for the 2013 AFCON?",
        options: ["Bishaw Sewnet", "Asrat Haile", "Yohannes Sahle", "Wubetu Abate"],
        correctIndex: 0
    }
];

export class QuestionBank {
    private static _instance: QuestionBank | null = null;
    private _askedQuestionIds: Set<string> = new Set();

    public static getInstance(): QuestionBank {
        if (!QuestionBank._instance) {
            QuestionBank._instance = new QuestionBank();
        }
        return QuestionBank._instance;
    }

    /**
     * Fetch questions from Supabase Edge Functions / Database.
     * Includes an offline local fallback so the game never breaks.
     */
    public async fetchQuestions(
        competitionId?: string,
        count: number = 10,
        locale: Locale = 'en'
    ): Promise<ExtendedQuestionData[]> {
        // 1. Try Supabase Edge Function ('questions') with SHA-256 Answer Hash Security
        if (supabaseService.isOnline) {
            try {
                const { data, error } = await EdgeFunctionClient.invoke('questions', {
                    competitionId,
                    count,
                    locale
                });

                if (!error && data && data.questions && data.questions.length > 0) {
                    console.log('[QuestionBank] Fetched server-authored questions via Edge Function.');
                    return data.questions as ExtendedQuestionData[];
                }
            } catch(e) {
                console.warn('[QuestionBank] Edge Function failed.', e);
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

                if (!error && data && data.length > 0) {
                    const mapped = data.map((row: QuestionRow) => this._mapQuestionRow(row, locale));
                    return this._selectQuestions(mapped, count);
                }
            } catch (err) {
                console.warn('[QuestionBank] Supabase DB question fetch error:', err);
            }
        }

        // 3. Robust Local Fallback Data (Production Safety Net)
        console.warn('[QuestionBank] Server connection unavailable. Serving fallback offline questions.');
        let pool = OFFLINE_FALLBACK_QUESTIONS;
        if (competitionId) {
            const filtered = pool.filter(q => q.category === competitionId);
            if (filtered.length >= Math.min(count, 5)) {
                pool = filtered;
            }
        }
        return this._selectQuestions(pool, count);
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
        let unasked = pool.filter(q => q.id && !this._askedQuestionIds.has(q.id));
        
        // If we ran out of unasked questions, reset the tracker to ensure we can keep playing
        if (unasked.length < count) {
            this._askedQuestionIds.clear();
            unasked = pool;
        }

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

        // Ensure we always return at least some questions if count > selected.length by duplicating if necessary
        while (selected.length < count && pool.length > 0) {
            selected.push(pool[Math.floor(Math.random() * pool.length)]);
        }

        return selected;
    }
}
