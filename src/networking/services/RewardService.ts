import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { RewardRow } from '../supabase/types';

export class RewardService {
    private static _instance: RewardService | null = null;

    private constructor() {}

    public static getInstance(): RewardService {
        if (!RewardService._instance) {
            RewardService._instance = new RewardService();
        }
        return RewardService._instance;
    }

    public async getRewards(): Promise<RewardRow[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return [];

            const { data, error } = await client
                .from('rewards')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('[RewardService] Error fetching rewards:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.warn('[RewardService] Failed to get rewards:', err);
            return [];
        }
    }

    public async getUnclaimedCount(): Promise<number> {
        if (!supabaseService.isOnline) return 0;
        const client = supabase;
        if (!client) return 0;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return 0;

            const { count, error } = await client
                .from('rewards')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('claimed', false);

            if (error) {
                console.warn('[RewardService] Error fetching unclaimed count:', error);
                return 0;
            }
            return count || 0;
        } catch (err) {
            console.warn('[RewardService] Failed to get unclaimed count:', err);
            return 0;
        }
    }

    public async claimReward(rewardId: string): Promise<{ coins: number; xp: number } | null> {
        if (!supabaseService.isOnline) return null;
        const client = supabase;
        if (!client) return null;
        try {
            const { data, error } = await client
                .from('rewards')
                .update({ 
                    claimed: true,
                    claimed_at: new Date().toISOString()
                } as any)
                .eq('id', rewardId)
                .select()
                .single();

            if (error) {
                console.warn('[RewardService] Error claiming reward:', error);
                return null;
            }

            if (data) {
                return {
                    coins: data.coins,
                    xp: data.xp
                };
            }
            return null;
        } catch (err) {
            console.warn('[RewardService] Failed to claim reward:', err);
            return null;
        }
    }

    public subscribeToNewRewards(callback: (reward: RewardRow) => void): () => void {
        if (!supabaseService.isOnline) return () => {};
        const client = supabase;
        if (!client) return () => {};

        let subscription: any = null;

        client.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            const innerClient = supabase;
            if (!innerClient) return;

            subscription = innerClient
                .channel(`public:rewards:user_id=eq.${user.id}`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'rewards', filter: `user_id=eq.${user.id}` },
                    (payload) => {
                        callback(payload.new as RewardRow);
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
