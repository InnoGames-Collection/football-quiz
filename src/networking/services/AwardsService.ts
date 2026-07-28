import { supabase, supabaseService } from '../supabase/SupabaseClient';

export interface AwardRecord {
    awardId: string;
    tournamentId: string;
    tournamentType: 'daily' | 'weekly' | 'monthly';
    rank: number;
    userMsisdn: string;
    maskedMsisdn: string;
    prizeAmount: number;
    currency: string;
    tournamentStartDate: string;
    tournamentEndDate: string;
    awardDate: string;
    createdAt: string;
}

export class AwardsService {
    private static instance: AwardsService;

    private constructor() {}

    public static getInstance(): AwardsService {
        if (!AwardsService.instance) {
            AwardsService.instance = new AwardsService();
        }
        return AwardsService.instance;
    }

    /**
     * Returns real backend rewards.
     */
    public async getAwards(type: 'daily' | 'weekly' | 'monthly'): Promise<AwardRecord[]> {
        if (!supabaseService.isOnline || !supabase) return [];
        
        try {
            const { data, error } = await (supabase.rpc as any)('get_past_tournament_winners', { p_period_type: type });
            if (!error && data && Array.isArray(data)) {
                return data.map((item: any) => ({
                    awardId: `awd_${item.user_id}_${type}`,
                    tournamentId: `trn_${type}`,
                    tournamentType: type,
                    rank: item.rank,
                    userMsisdn: item.msisdn || '',
                    maskedMsisdn: this.maskMsisdn(item.msisdn || ''),
                    prizeAmount: this.calculatePrize(item.rank, type),
                    currency: 'ETB',
                    tournamentStartDate: '',
                    tournamentEndDate: '',
                    awardDate: new Date().toISOString(),
                    createdAt: new Date().toISOString()
                }));
            }
        } catch (e) {
            console.error('[AwardsService] Failed to fetch awards', e);
        }
        return [];
    }

    private calculatePrize(rank: number, type: 'daily' | 'weekly' | 'monthly'): number {
        if (type === 'monthly') {
            if (rank === 1) return 50000;
            if (rank === 2) return 25000;
            if (rank === 3) return 10000;
        } else if (type === 'weekly') {
            if (rank === 1) return 10000;
            if (rank === 2) return 5000;
            if (rank === 3) return 2500;
        } else {
            if (rank === 1) return 1000;
            if (rank === 2) return 500;
            if (rank === 3) return 250;
        }
        return 0;
    }

    /**
     * Masks MSISDN to format like 25191*****45
     */
    public maskMsisdn(msisdn: string): string {
        const clean = msisdn.replace('+', '');
        if (clean.length < 9) return msisdn; // Too short to mask safely
        
        const first = clean.substring(0, 5); // 25191
        const last = clean.substring(clean.length - 2); // 45
        return `${first}*****${last}`;
    }
}
