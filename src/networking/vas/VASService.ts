import type { SubscriptionTier } from '../supabase/types';

export interface VASSessionResult {
    success: boolean;
    msisdn?: string;
    tier?: SubscriptionTier;
    expiresAt?: string;
    message?: string;
}

export class VASService {
    private static _instance: VASService | null = null;

    public static getInstance(): VASService {
        if (!VASService._instance) {
            VASService._instance = new VASService();
        }
        return VASService._instance;
    }

    /**
     * Verify subscription status via Ethio Telecom VAS API gateway.
     */
    public async verifySubscription(msisdn: string): Promise<VASSessionResult> {
        // Mock Ethio Telecom VAS Gateway verification
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

    /**
     * Request SMS / USSD subscription prompt for Ethio Telecom users.
     */
    public async requestSubscription(msisdn: string, tier: SubscriptionTier): Promise<{ success: boolean; ussdCode?: string; message?: string }> {
        const ussdCode = tier === 'premium' ? '*822*1#' : '*822*2#';
        return {
            success: true,
            ussdCode,
            message: `SMS sent to ${msisdn}. Dial ${ussdCode} on your Ethio Telecom line to confirm subscription.`
        };
    }
}
