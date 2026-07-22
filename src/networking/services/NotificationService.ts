import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { NotificationRow } from '../supabase/types';

export class NotificationService {
    private static _instance: NotificationService | null = null;

    private constructor() {}

    public static getInstance(): NotificationService {
        if (!NotificationService._instance) {
            NotificationService._instance = new NotificationService();
        }
        return NotificationService._instance;
    }

    public async getNotifications(category?: string): Promise<NotificationRow[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return [];

            let query = client
                .from('notifications')
                .select('*')
                .or(`user_id.eq.${user.id},user_id.is.null`)
                .order('created_at', { ascending: false });

            if (category) {
                query = query.eq('category', category as any);
            }

            const { data, error } = await query;
            if (error) {
                console.warn('[NotificationService] Error fetching notifications:', error);
                return [];
            }

            return data || [];
        } catch (err) {
            console.warn('[NotificationService] Failed to get notifications:', err);
            return [];
        }
    }

    public async getUnreadCount(): Promise<number> {
        if (!supabaseService.isOnline) return 0;
        const client = supabase;
        if (!client) return 0;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return 0;

            const { count, error } = await client
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .or(`user_id.eq.${user.id},user_id.is.null`)
                .eq('read', false);

            if (error) {
                console.warn('[NotificationService] Error fetching unread count:', error);
                return 0;
            }

            return count || 0;
        } catch (err) {
            console.warn('[NotificationService] Failed to get unread count:', err);
            return 0;
        }
    }

    public async markAsRead(id: string): Promise<void> {
        if (!supabaseService.isOnline) return;
        const client = supabase;
        if (!client) return;
        try {
            const { error } = await client
                .from('notifications')
                .update({ read: true } as any)
                .eq('id', id);

            if (error) {
                console.warn('[NotificationService] Error marking as read:', error);
            }
        } catch (err) {
            console.warn('[NotificationService] Failed to mark as read:', err);
        }
    }

    public async markAllAsRead(): Promise<void> {
        if (!supabaseService.isOnline) return;
        const client = supabase;
        if (!client) return;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return;

            const { error } = await client
                .from('notifications')
                .update({ read: true } as any)
                .or(`user_id.eq.${user.id},user_id.is.null`)
                .eq('read', false);

            if (error) {
                console.warn('[NotificationService] Error marking all as read:', error);
            }
        } catch (err) {
            console.warn('[NotificationService] Failed to mark all as read:', err);
        }
    }

    public subscribeToNewNotifications(callback: (notif: NotificationRow) => void): () => void {
        if (!supabaseService.isOnline) return () => {};
        const client = supabase;
        if (!client) return () => {};

        let subscription: any = null;

        client.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            const innerClient = supabase;
            if (!innerClient) return;

            subscription = innerClient
                .channel(`public:notifications:user_id=eq.${user.id}`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'notifications' },
                    (payload) => {
                        const newNotif = payload.new as NotificationRow;
                        if (newNotif.user_id === user.id || newNotif.user_id === null) {
                            callback(newNotif);
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
