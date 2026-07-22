import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import type { TournamentRow } from '../../networking/supabase/types';

export class TournamentManager {
    private static _instance: TournamentManager | null = null;

    public static getInstance(): TournamentManager {
        if (!TournamentManager._instance) {
            TournamentManager._instance = new TournamentManager();
        }
        return TournamentManager._instance;
    }

    public async getUpcomingTournaments(): Promise<TournamentRow[]> {
        if (supabaseService.isOnline && supabase) {
            try {
                const { data, error } = await (supabase.from('tournaments' as any) as any)
                    .select('*')
                    .order('starts_at', { ascending: true });

                if (!error && data) {
                    return data as TournamentRow[];
                }
            } catch (err) {
                console.warn('[TournamentManager] Error fetching tournaments:', err);
            }
        }

        return [];
    }

    public async registerForTournament(tournamentId: string, userId: string): Promise<{ success: boolean; error?: string }> {
        if (supabaseService.isOnline && supabase) {
            try {
                const { error } = await (supabase.from('tournament_registrations' as any) as any).insert({
                    tournament_id: tournamentId,
                    user_id: userId
                });

                if (error) return { success: false, error: error.message };
                return { success: true };
            } catch (err: any) {
                return { success: false, error: err.message };
            }
        }

        return { success: true };
    }
}
