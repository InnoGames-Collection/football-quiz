import { QUESTION_CATEGORIES } from './QuestionCategories';
import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import type { CompetitionRow, Locale } from '../../networking/supabase/types';

export interface Competition {
    id: string;
    name: string;
    nameEn: string;
    nameAm?: string;
    nameOm?: string;
    badge: string;
    description: string;
    color: string;
    questionCount: number;
    status?: string;
    participants?: number;
    prize_pool?: number;
    start_time?: string;
    end_time?: string;
}

export class CompetitionRegistry {
    private static _competitions: Map<string, Competition> = new Map();
    private static _isInitialized: boolean = false;

    private static _initDefaults(): void {
        if (CompetitionRegistry._isInitialized) return;

        Object.values(QUESTION_CATEGORIES).forEach(cat => {
            CompetitionRegistry._competitions.set(cat.id, {
                id: cat.id,
                name: cat.nameEn,
                nameEn: cat.nameEn,
                nameAm: cat.nameAm,
                nameOm: cat.nameOm,
                badge: cat.badge,
                description: cat.description,
                color: '#FFD700',
                questionCount: 10
            });
        });

        CompetitionRegistry._isInitialized = true;
    }

    public static getAll(locale: Locale = 'en'): Competition[] {
        CompetitionRegistry._initDefaults();
        return Array.from(CompetitionRegistry._competitions.values()).map(comp => {
            let name = comp.nameEn;
            if (locale === 'am' && comp.nameAm) name = comp.nameAm;
            if (locale === 'om' && comp.nameOm) name = comp.nameOm;

            return { ...comp, name };
        });
    }

    public static getById(id: string, locale: Locale = 'en'): Competition | undefined {
        CompetitionRegistry._initDefaults();
        const comp = CompetitionRegistry._competitions.get(id);
        if (!comp) return undefined;

        let name = comp.nameEn;
        if (locale === 'am' && comp.nameAm) name = comp.nameAm;
        if (locale === 'om' && comp.nameOm) name = comp.nameOm;

        return { ...comp, name };
    }

    public static async syncFromCloud(locale: Locale = 'en'): Promise<Competition[]> {
        CompetitionRegistry._initDefaults();

        if (supabaseService.isOnline && supabase) {
            try {
                const { data, error } = await (supabase.from('competitions' as any) as any)
                    .select('*')
                    .eq('is_active', true);

                if (!error && data && data.length > 0) {
                    data.forEach((row: CompetitionRow) => {
                        CompetitionRegistry._competitions.set(row.id, {
                            id: row.id,
                            name: row.name_en,
                            nameEn: row.name_en,
                            nameAm: row.name_am || undefined,
                            nameOm: row.name_om || undefined,
                            badge: row.badge,
                            description: row.description_en || '',
                            color: row.color || '#FFD700',
                            questionCount: row.question_count || 10
                        });
                    });
                }
            } catch (err) {
                console.warn('[CompetitionRegistry] Cloud sync failed, using defaults:', err);
            }
        }

        return CompetitionRegistry.getAll(locale);
    }

    public static addCompetition(comp: Competition): void {
        CompetitionRegistry._initDefaults();
        CompetitionRegistry._competitions.set(comp.id, comp);
        console.log(`[CompetitionRegistry] Added competition: ${comp.name}`);
    }

    public static removeCompetition(id: string): boolean {
        return CompetitionRegistry._competitions.delete(id);
    }
}
