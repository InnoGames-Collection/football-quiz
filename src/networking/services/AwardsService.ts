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
     * Mocks a backend endpoint equivalent to GET /api/awards
     */
    public async getAwards(type: 'daily' | 'weekly' | 'monthly'): Promise<AwardRecord[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Generate some mock data for demonstration purposes
        const mockAwards: AwardRecord[] = [];
        
        // Mocking user phone to demonstrate highlighting (using a generic one)
        // Usually we would fetch this from AuthManager, but we'll use a hardcoded one for mock
        const currentUserMsisdn = '+251911223344';

        // Monthly has less winners, Daily has more in this mock
        const count = type === 'monthly' ? 5 : type === 'weekly' ? 10 : 20;

        for (let i = 1; i <= count; i++) {
            // Occasionally make the user the winner in some events for demo
            const isUser = i === 2 && type === 'weekly'; 
            const rawPhone = isUser ? currentUserMsisdn : `+2519${Math.floor(1000000 + Math.random() * 9000000)}`;
            const maskedPhone = this.maskMsisdn(rawPhone);

            let prize = 0;
            if (i === 1) prize = type === 'monthly' ? 50000 : type === 'weekly' ? 10000 : 1000;
            else if (i === 2) prize = type === 'monthly' ? 25000 : type === 'weekly' ? 5000 : 500;
            else if (i === 3) prize = type === 'monthly' ? 10000 : type === 'weekly' ? 2500 : 250;
            else prize = type === 'monthly' ? 1000 : type === 'weekly' ? 500 : 50;

            mockAwards.push({
                awardId: `awd_${type}_${i}_${Date.now()}`,
                tournamentId: `trn_${type}_${Date.now()}`,
                tournamentType: type,
                rank: i,
                userMsisdn: rawPhone,
                maskedMsisdn: maskedPhone,
                prizeAmount: prize,
                currency: 'ETB',
                tournamentStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                tournamentEndDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                awardDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            });
        }

        return mockAwards;
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
