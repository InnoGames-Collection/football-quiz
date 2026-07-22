import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { MessageRow } from '../supabase/types';

export class MessageService {
    private static _instance: MessageService | null = null;

    private constructor() {}

    public static getInstance(): MessageService {
        if (!MessageService._instance) {
            MessageService._instance = new MessageService();
        }
        return MessageService._instance;
    }

    public async getMessages(channel: 'global' | 'direct' | 'system'): Promise<MessageRow[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return [];

            let query = client
                .from('messages')
                .select('*')
                .eq('channel', channel)
                .order('created_at', { ascending: false });

            if (channel === 'direct') {
                query = query.or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
            }

            const { data, error } = await query;
            if (error) {
                console.warn('[MessageService] Error fetching messages:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.warn('[MessageService] Failed to get messages:', err);
            return [];
        }
    }

    public async getInbox(): Promise<MessageRow[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return [];

            const { data, error } = await client
                .from('messages')
                .select('*')
                .eq('recipient_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('[MessageService] Error fetching inbox:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.warn('[MessageService] Failed to get inbox:', err);
            return [];
        }
    }

    public async getSent(): Promise<MessageRow[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return [];

            const { data, error } = await client
                .from('messages')
                .select('*')
                .eq('sender_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('[MessageService] Error fetching sent messages:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.warn('[MessageService] Failed to get sent messages:', err);
            return [];
        }
    }

    public async sendMessage(
        recipientId: string | null,
        bodyEn: string,
        bodyAm?: string,
        bodyOm?: string
    ): Promise<void> {
        if (!supabaseService.isOnline) return;
        const client = supabase;
        if (!client) return;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return;

            const channel = recipientId ? 'direct' : 'global';

            const { error } = await client
                .from('messages')
                .insert({
                    sender_id: user.id,
                    recipient_id: recipientId,
                    channel,
                    body_en: bodyEn,
                    body_am: bodyAm,
                    body_om: bodyOm,
                    read: false
                });

            if (error) {
                console.warn('[MessageService] Error sending message:', error);
            }
        } catch (err) {
            console.warn('[MessageService] Failed to send message:', err);
        }
    }

    public async markAsRead(id: string): Promise<void> {
        if (!supabaseService.isOnline) return;
        const client = supabase;
        if (!client) return;
        try {
            const { error } = await client
                .from('messages')
                .update({ read: true } as any)
                .eq('id', id);

            if (error) {
                console.warn('[MessageService] Error marking as read:', error);
            }
        } catch (err) {
            console.warn('[MessageService] Failed to mark as read:', err);
        }
    }

    public subscribeToNewMessages(callback: (msg: MessageRow) => void): () => void {
        if (!supabaseService.isOnline) return () => {};
        const client = supabase;
        if (!client) return () => {};

        let subscription: any = null;

        client.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            const innerClient = supabase;
            if (!innerClient) return;

            subscription = innerClient
                .channel(`public:messages`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages' },
                    (payload) => {
                        const newMsg = payload.new as MessageRow;
                        if (newMsg.recipient_id === user.id || newMsg.channel === 'global') {
                            callback(newMsg);
                        }
                    }
                )
                .subscribe();
        });

        return () => {
            const currentClient = supabase;
            if (subscription && currentClient) {
                currentClient.removeChannel(subscription);
            }
        };
    }
}
