import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, supabaseService } from '../supabase/SupabaseClient';

export class RealtimeService {
    private static instance: RealtimeService;
    private channels: Map<string, RealtimeChannel> = new Map();
    private listeners: Map<string, Set<Function>> = new Map();

    private constructor() {}

    public static getInstance(): RealtimeService {
        if (!RealtimeService.instance) {
            RealtimeService.instance = new RealtimeService();
        }
        return RealtimeService.instance;
    }

    public initUserChannels(userId: string): void {
        if (!supabaseService.isOnline) {
            console.warn('[RealtimeService] Offline mode: Cannot initialize channels.');
            return;
        }
        const client = supabase;
        if (!client) return;

        this.cleanup(); // Ensure we don't have dangling subscriptions

        // 1. profile-{userId}
        const profileChannel = client.channel(`profile-${userId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
                (payload) => this.emit('profile_update', payload)
            )
            .subscribe();
        this.channels.set(`profile-${userId}`, profileChannel);

        // 2. notifications-{userId}
        // Supabase filters generally do not support `OR` conditions natively in the `filter` param.
        // We might need to listen to all inserts for this user and broadcast logic.
        const notificationsChannel = client.channel(`notifications-${userId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                (payload) => {
                    const newNotification = payload.new as any;
                    if (newNotification.user_id === userId || newNotification.user_id === null) {
                        this.emit('new_notification', payload);
                    }
                }
            )
            .subscribe();
        this.channels.set(`notifications-${userId}`, notificationsChannel);

        // 3. messages-{userId}
        const messagesChannel = client.channel(`messages-${userId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    const newMessage = payload.new as any;
                    if (newMessage.recipient_id === userId || newMessage.channel === 'global') {
                        this.emit('new_message', payload);
                    }
                }
            )
            .subscribe();
        this.channels.set(`messages-${userId}`, messagesChannel);

        // 4. rewards-{userId}
        const rewardsChannel = client.channel(`rewards-${userId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'rewards', filter: `user_id=eq.${userId}` },
                (payload) => this.emit('new_reward', payload)
            )
            .subscribe();
        this.channels.set(`rewards-${userId}`, rewardsChannel);

        // 5. session-{userId}
        const sessionChannel = client.channel(`session-${userId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `user_id=eq.${userId}` },
                (payload) => this.emit('session_update', payload)
            )
            .subscribe();
        this.channels.set(`session-${userId}`, sessionChannel);

        // 6. leaderboard
        const leaderboardChannel = client.channel('leaderboard')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'leaderboard_entries' },
                (payload) => this.emit('leaderboard_update', payload)
            )
            .subscribe();
        this.channels.set('leaderboard', leaderboardChannel);

        console.log(`[RealtimeService] Channels initialized for user ${userId}`);
    }

    public on(event: string, callback: Function): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
    }

    public off(event: string, callback?: Function): void {
        if (callback) {
            const eventListeners = this.listeners.get(event);
            if (eventListeners) {
                eventListeners.delete(callback);
                if (eventListeners.size === 0) {
                    this.listeners.delete(event);
                }
            }
        } else {
            this.listeners.delete(event);
        }
    }

    private emit(event: string, payload: any): void {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach((callback) => {
                try {
                    callback(payload);
                } catch (error) {
                    console.error(`[RealtimeService] Error executing listener for event ${event}:`, error);
                }
            });
        }
    }

    public cleanup(): void {
        const client = supabase;
        this.channels.forEach((channel) => {
            if (client) {
                client.removeChannel(channel);
            }
        });
        this.channels.clear();
        this.listeners.clear();
        console.log('[RealtimeService] Cleaned up all channels and listeners.');
    }
}
