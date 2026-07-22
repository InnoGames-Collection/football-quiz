import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { SupportTicketRow } from '../supabase/types';

export class SupportService {
    private static instance: SupportService;

    private constructor() {}

    public static getInstance(): SupportService {
        if (!SupportService.instance) {
            SupportService.instance = new SupportService();
        }
        return SupportService.instance;
    }

    public async createTicket(category: string, message: string, subject?: string): Promise<{ ticketId: string, success: boolean }> {
        if (!supabaseService.isOnline) {
            console.warn('[SupportService] Offline mode: cannot create ticket.');
            return { ticketId: '', success: false };
        }
        const client = supabase;
        if (!client) {
            return { ticketId: '', success: false };
        }

        try {
            const { data: { user }, error: authError } = await client.auth.getUser();
            if (authError || !user) {
                console.error('[SupportService] Auth error or user not found:', authError);
                return { ticketId: '', success: false };
            }

            const { data, error } = await client
                .from('support_tickets')
                .insert({
                    user_id: user.id,
                    category,
                    message,
                    subject: subject || null,
                    status: 'open'
                })
                .select('id')
                .single();

            if (error) {
                console.error('[SupportService] Failed to create ticket:', error);
                return { ticketId: '', success: false };
            }

            return { ticketId: data.id, success: true };
        } catch (error) {
            console.error('[SupportService] Error creating ticket:', error);
            return { ticketId: '', success: false };
        }
    }

    public async getMyTickets(): Promise<SupportTicketRow[]> {
        if (!supabaseService.isOnline) {
            console.warn('[SupportService] Offline mode: returning empty tickets list.');
            return [];
        }
        const client = supabase;
        if (!client) return [];

        try {
            const { data: { user }, error: authError } = await client.auth.getUser();
            if (authError || !user) {
                console.error('[SupportService] Auth error or user not found:', authError);
                return [];
            }

            const { data, error } = await client
                .from('support_tickets')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('[SupportService] Failed to fetch tickets:', error);
                return [];
            }

            return data as SupportTicketRow[];
        } catch (error) {
            console.error('[SupportService] Error fetching tickets:', error);
            return [];
        }
    }

    public async getTicketById(ticketId: string): Promise<SupportTicketRow | null> {
        if (!supabaseService.isOnline) {
            console.warn('[SupportService] Offline mode: cannot fetch ticket.');
            return null;
        }
        const client = supabase;
        if (!client) return null;

        try {
            const { data, error } = await client
                .from('support_tickets')
                .select('*')
                .eq('id', ticketId)
                .single();

            if (error) {
                console.error(`[SupportService] Failed to fetch ticket with ID ${ticketId}:`, error);
                return null;
            }

            return data as SupportTicketRow;
        } catch (error) {
            console.error(`[SupportService] Error fetching ticket with ID ${ticketId}:`, error);
            return null;
        }
    }
}
