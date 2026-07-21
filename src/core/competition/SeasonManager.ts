import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import type { SeasonRow } from '../../networking/supabase/types';

export class SeasonManager {
    private static _instance: SeasonManager | null = null;
    private _activeSeasons: Map<string, SeasonRow> = new Map();

    public static getInstance(): SeasonManager {
        if (!SeasonManager._instance) {
            SeasonManager._instance = new SeasonManager();
        }
        return SeasonManager._instance;
    }

    public async fetchActiveSeasons(): Promise<SeasonRow[]> {
        if (supabaseService.isOnline && supabase) {
            try {
                const { data, error } = await (supabase.from('seasons' as any) as any)
                    .select('*')
                    .eq('status', 'active');

                if (!error && data) {
                    data.forEach((s: SeasonRow) => this._activeSeasons.set(s.competition_id, s));
                    return data as SeasonRow[];
                }
            } catch (err) {
                console.warn('[SeasonManager] Failed to fetch active seasons:', err);
            }
        }

        return Array.from(this._activeSeasons.values());
    }

    public getActiveSeasonForCompetition(competitionId: string): SeasonRow | null {
        return this._activeSeasons.get(competitionId) || null;
    }
}
