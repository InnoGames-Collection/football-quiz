import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import type { QuestionRow, Locale } from '../../networking/supabase/types';
import type { QuestionData } from '../../ui/screens/ScoreboardQuestionScreen';

export interface ExtendedQuestionData extends QuestionData {
    id?: string;
    category?: string;
    difficulty?: number;
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

    // Fallback seed question bank when offline or initial db seeding
    private _fallbackQuestions: ExtendedQuestionData[] = [
        {
            id: 'fb-1',
            category: 'walia-ibex',
            difficulty: 2,
            prompt: "Which Ethiopian club won the CAF Champions League (formerly African Cup of Champions Clubs) in 1968?",
            promptEn: "Which Ethiopian club won the CAF Champions League (formerly African Cup of Champions Clubs) in 1968?",
            promptAm: "በ1968 የCAF ቻምፒየንስ ሊግ (የቀድሞው የአፍሪካ ሻምፒዮኖች ክለቦች ዋንጫ) ያሸነፈው የኢትዮጵያ ክለብ የትኛው ነው?",
            promptOm: "Waancaa Chaampiyoonsii CAF bara 1968 kan injifate klabiin Itoophiyaa isa kam?",
            options: ["Saint George SC", "Omedla FC", "Cotton Factory Club", "Defense Force"],
            optionsEn: ["Saint George SC", "Omedla FC", "Cotton Factory Club", "Defense Force"],
            optionsAm: ["ቅዱስ ጊዮርጊስ", "ኦመድላ", "ኮተን ፋብሪካ", "መከላከያ"],
            optionsOm: ["Qiddus Giyoorgis", "Omedlaa", "Kooton Faabrikaa", "Makaalaakayaa"],
            correctIndex: 0
        },
        {
            id: 'fb-2',
            category: 'walia-ibex',
            difficulty: 1,
            prompt: "In which year did Ethiopia win the Africa Cup of Nations (AFCON)?",
            promptEn: "In which year did Ethiopia win the Africa Cup of Nations (AFCON)?",
            promptAm: "ኢትዮጵያ የአፍሪካ ዋንጫን (AFCON) ያሸነፈችው በየትኛው ዓመት ነው?",
            promptOm: "Itoophiyaan Waancaa Afriikaa (AFCON) bara kam injifatte?",
            options: ["1957", "1962", "1970", "1984"],
            optionsEn: ["1957", "1962", "1970", "1984"],
            optionsAm: ["1957", "1962", "1970", "1984"],
            optionsOm: ["1957", "1962", "1970", "1984"],
            correctIndex: 1
        },
        {
            id: 'fb-3',
            category: 'walia-ibex',
            difficulty: 2,
            prompt: "Who is the all-time top scorer for the Ethiopian National Football Team (Walia Ibex)?",
            promptEn: "Who is the all-time top scorer for the Ethiopian National Football Team (Walia Ibex)?",
            promptAm: "ለኢትዮጵያ ብሔራዊ ቡድን (ዋሊያ ኢቤክስ) የሁሉም ጊዜ ከፍተኛ ግብ አገባች ማን ነው?",
            promptOm: "Taphaa garee biyyaaleessaa Itoophiyaatiif (Waaliyaa Ibeks) galchii baay'ee kan galche kimmi?",
            options: ["Getaneh Kebede", "Saladin Said", "Luciano Vassalo", "Mengistu Worku"],
            optionsEn: ["Getaneh Kebede", "Saladin Said", "Luciano Vassalo", "Mengistu Worku"],
            optionsAm: ["ጌታነህ ከበደ", "ሳላዲን ሰኢድ", "ሉሲያኖ ቫሳሎ", "መንግስቱ ወርቁ"],
            optionsOm: ["Getaaneh Kebebede", "Salaadiin Sayiid", "Lusiyaanoo Vaasaaloo", "Mengistuu Warquu"],
            correctIndex: 0
        },
        {
            id: 'fb-4',
            category: 'world-cup',
            difficulty: 1,
            prompt: "Which country hosted the 2022 FIFA World Cup?",
            promptEn: "Which country hosted the 2022 FIFA World Cup?",
            promptAm: "የ2022 የዓለም ዋንጫን ያናገደችው ሀገር የትኛዋ ናት?",
            promptOm: "Waancaa Addunyaa FIFA 2022 biyyi keessummeessite isa kam?",
            options: ["Qatar", "Brazil", "Russia", "South Africa"],
            optionsEn: ["Qatar", "Brazil", "Russia", "South Africa"],
            optionsAm: ["ኳታር", "ብራዚል", "ሩሲያ", "ደቡብ አፍሪካ"],
            optionsOm: ["Qaataar", "Biraazil", "Ruusiyaa", "Afriikaa Kibbaa"],
            correctIndex: 0
        },
        {
            id: 'fb-5',
            category: 'legendary-players',
            difficulty: 1,
            prompt: "Which player has won the most Ballon d'Or awards in history?",
            promptEn: "Which player has won the most Ballon d'Or awards in history?",
            promptAm: "በታሪክ ብዙ የባሎንዶር ሽልማት ያሸነፈው ተጫዋች ማን ነው?",
            promptOm: "Seenaa keessatti badhaasa Baaloon D'Or baay'ee kan injifate taphataa isa kam?",
            options: ["Cristiano Ronaldo", "Lionel Messi", "Zinedine Zidane", "Pelé"],
            optionsEn: ["Cristiano Ronaldo", "Lionel Messi", "Zinedine Zidane", "Pelé"],
            optionsAm: ["ክርስቲያኖ ሮናልዶ", "ሊዮኔል ሜሲ", "ዚነዲን ዚዳን", "ፔሌ"],
            optionsOm: ["Kirisatiyaanoo Ronaaldoo", "Liyoonel Meessii", "Zinaddiin Zidaan", "Peele"],
            correctIndex: 1
        },
        {
            id: 'fb-6',
            category: 'stadiums',
            difficulty: 1,
            prompt: "Which stadium is known as 'The Theatre of Dreams'?",
            promptEn: "Which stadium is known as 'The Theatre of Dreams'?",
            promptAm: "'የሕልሞች ቲያትር' በመባል የሚታወቀው ስታዲየም የትኛው ነው?",
            promptOm: "'Istaadiyeemii Abjuu' jedhamee kan beekamu isa kam?",
            options: ["Santiago Bernabéu", "Old Trafford", "Camp Nou", "Anfield"],
            optionsEn: ["Santiago Bernabéu", "Old Trafford", "Camp Nou", "Anfield"],
            optionsAm: ["ሳንቲያጎ በርናቤው", "ኦልድ ትራፎርድ", "ካምፕ ኑ", "አንፊልድ"],
            optionsOm: ["Saantiyaagoo Bernaabuu", "Oold Tiraafoord", "Kaamp Nuu", "Aanfiild"],
            correctIndex: 1
        },
        {
            id: 'fb-7',
            category: 'champions-league',
            difficulty: 1,
            prompt: "Which club has won the most UEFA Champions League titles?",
            promptEn: "Which club has won the most UEFA Champions League titles?",
            promptAm: "ብዙ የUEFA ቻምፒየንስ ሊግ ዋንጫዎችን ያሸነፈው ክለብ የትኛው ነው?",
            promptOm: "Waancaa Chaampiyoonsii UEFA baay'ee kan injifate klabiin isa kam?",
            options: ["AC Milan", "Bayern Munich", "Real Madrid", "Liverpool"],
            optionsEn: ["AC Milan", "Bayern Munich", "Real Madrid", "Liverpool"],
            optionsAm: ["ኤሲ ሚላን", "ባየርን ሙኒክ", "ሪያል ማድሪድ", "ሊቨርፑል"],
            optionsOm: ["AC Miilaan", "Baayern Muunik", "Riyaal Maadrid", "Livarpuul"],
            correctIndex: 2
        },
        {
            id: 'fb-8',
            category: 'legendary-players',
            difficulty: 2,
            prompt: "Which African player won the FIFA World Player of the Year in 1995?",
            promptEn: "Which African player won the FIFA World Player of the Year in 1995?",
            promptAm: "በ1995 የዓለም ኮከብ ተጫዋች ሽልማት ያሸነፈው አፍሪካዊ ተጫዋች ማን ነው?",
            promptOm: "Bara 1995 badhaasa Taphataa Addunyaa FIFA kan injifate taphataa Afriikaa isa kam?",
            options: ["Didier Drogba", "George Weah", "Samuel Eto'o", "Jay-Jay Okocha"],
            optionsEn: ["Didier Drogba", "George Weah", "Samuel Eto'o", "Jay-Jay Okocha"],
            optionsAm: ["ዲዲዬ ድሮግባ", "ጆርጅ ዌአ", "ሳሙኤል ኢቶ", "ጄይ ጄይ ኦኮቻ"],
            optionsOm: ["Didiyeed Diroogbaa", "Joorj Weeyaa", "Saamu'eel Etoo", "Jey-Jey Okoocaa"],
            correctIndex: 1
        },
        {
            id: 'fb-9',
            category: 'football-rules',
            difficulty: 1,
            prompt: "How long is a standard professional football match excluding extra time?",
            promptEn: "How long is a standard professional football match excluding extra time?",
            promptAm: "የመደበኛ እግር ኳስ ጨዋታ ርዝመት ስንት ደቂቃ ነው?",
            promptOm: "Taphi kubbaa miilaa idilee daqiiqaa meeqa?",
            options: ["80 Minutes", "90 Minutes", "100 Minutes", "60 Minutes"],
            optionsEn: ["80 Minutes", "90 Minutes", "100 Minutes", "60 Minutes"],
            optionsAm: ["80 ደቂቃ", "90 ደቂቃ", "100 ደቂቃ", "60 ደቂቃ"],
            optionsOm: ["Daqiiqaa 80", "Daqiiqaa 90", "Daqiiqaa 100", "Daqiiqaa 60"],
            correctIndex: 1
        },
        {
            id: 'fb-10',
            category: 'champions-league',
            difficulty: 1,
            prompt: "Who won the 2023-24 UEFA Champions League title?",
            promptEn: "Who won the 2023-24 UEFA Champions League title?",
            promptAm: "የ2023-24 የUEFA ቻምፒየንስ ሊግ ዋንጫን ያሸነፈው ማን ነው?",
            promptOm: "Waancaa Chaampiyoonsii UEFA 2023-24 kan injifate isa kam?",
            options: ["Borussia Dortmund", "Real Madrid", "Manchester City", "Paris Saint-Germain"],
            optionsEn: ["Borussia Dortmund", "Real Madrid", "Manchester City", "Paris Saint-Germain"],
            optionsAm: ["ቦሩሺያዶርትሙንድ", "ሪያል ማድሪድ", "ማንቸስተር ሲቲ", "ፓሪስ ሳን ዠርሜን"],
            optionsOm: ["Boruusiyaa Doortmund", "Riyaal Maadrid", "Maanchestar Siitii", "Paaris Saan Jermaan"],
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
     * Fetch questions for a match, resolving locale (en, am, om).
     */
    public async fetchQuestions(
        competitionId?: string,
        count: number = 10,
        locale: Locale = 'en'
    ): Promise<ExtendedQuestionData[]> {
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
                    const mapped: ExtendedQuestionData[] = data.map((row: QuestionRow) => this._mapQuestionRow(row, locale));
                    return this._selectQuestions(mapped, count);
                }
            } catch (err) {
                console.warn('[QuestionBank] Supabase query failed, falling back to local questions:', err);
            }
        }

        // Offline / Fallback path
        const filtered = competitionId
            ? this._fallbackQuestions.filter(q => q.category === competitionId || !q.category)
            : this._fallbackQuestions;

        const candidateList = filtered.length >= count ? filtered : this._fallbackQuestions;
        const localized = candidateList.map(q => this._localizeQuestionData(q, locale));
        return this._selectQuestions(localized, count);
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
            correctIndex: row.correct_index,
            promptEn: row.prompt_en,
            promptAm: row.prompt_am || undefined,
            promptOm: row.prompt_om || undefined,
            optionsEn: row.options_en,
            optionsAm: row.options_am || undefined,
            optionsOm: row.options_om || undefined
        };
    }

    private _localizeQuestionData(q: ExtendedQuestionData, locale: Locale): ExtendedQuestionData {
        let prompt = q.promptEn || q.prompt;
        let options = q.optionsEn || q.options;

        if (locale === 'am' && q.promptAm && q.optionsAm) {
            prompt = q.promptAm;
            options = q.optionsAm;
        } else if (locale === 'om' && q.promptOm && q.optionsOm) {
            prompt = q.promptOm;
            options = q.optionsOm;
        }

        return {
            ...q,
            prompt,
            options
        };
    }

    private _selectQuestions(pool: ExtendedQuestionData[], count: number): ExtendedQuestionData[] {
        // Filter out recently asked questions if possible
        const unasked = pool.filter(q => q.id && !this._askedQuestionIds.has(q.id));
        const chosenPool = unasked.length >= count ? unasked : pool;

        // Fisher-Yates Shuffle
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

    public resetSessionHistory(): void {
        this._askedQuestionIds.clear();
    }
}
