import { supabase, supabaseService } from '../supabase/SupabaseClient';
import { EdgeFunctionClient } from '../supabase/EdgeFunctionClient';
import type { SubscriptionTier } from '../supabase/types';

export interface VASSessionResult {
    success: boolean;
    msisdn?: string;
    tier?: SubscriptionTier;
    expiresAt?: string;
    message?: string;
}

export type SubscriptionChangeListener = (tier: SubscriptionTier) => void;

export class VASService {
    private static _instance: VASService | null = null;
    private _listeners: Set<SubscriptionChangeListener> = new Set();

    public static getInstance(): VASService {
        if (!VASService._instance) {
            VASService._instance = new VASService();
        }
        return VASService._instance;
    }

    public subscribeToUserSubscription(userId: string, onUpdate: SubscriptionChangeListener): () => void {
        this._listeners.add(onUpdate);

        if (supabaseService.isOnline && supabase) {
            const channel = supabase
                .channel(`public:subscriptions:${userId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'subscriptions',
                        filter: `user_id=eq.${userId}`
                    },
                    (payload) => {
                        const row = payload.new as any;
                        if (row && row.tier) {
                            console.log('[VASService] Postgres CDC detected subscription tier update:', row.tier);
                            this._notifyListeners(row.tier as SubscriptionTier);
                        }
                    }
                )
                .subscribe();

            return () => {
                this._listeners.delete(onUpdate);
                if (supabase) supabase.removeChannel(channel);
            };
        }

        return () => this._listeners.delete(onUpdate);
    }

    public async verifySubscription(msisdn: string): Promise<VASSessionResult> {
        if (msisdn.startsWith('+2519') || msisdn.startsWith('09')) {
            return {
                success: true,
                msisdn,
                tier: 'basic',
                expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
                message: 'Ethio Telecom VAS Subscription Active'
            };
        }

        return {
            success: false,
            message: 'No active Ethio Telecom VAS subscription found for this number.'
        };
    }

    public async requestSubscription(msisdn: string, tier: SubscriptionTier): Promise<{ success: boolean; ussdCode?: string; message?: string }> {
        // Trigger vas-webhook Edge Function simulation
        if (supabaseService.isOnline) {
            await EdgeFunctionClient.invoke('vas-webhook', {
                msisdn,
                tier,
                event: 'SUBSCRIBE'
            });
        }

        const ussdCode = tier === 'premium' ? '*822*1#' : '*822*2#';
        return {
            success: true,
            ussdCode,
            message: `SMS sent to ${msisdn}. Dial ${ussdCode} on your Ethio Telecom line to confirm subscription.`
        };
    }

    private _notifyListeners(tier: SubscriptionTier): void {
        this._listeners.forEach(l => l(tier));
    }
}
