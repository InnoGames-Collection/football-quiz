export type FootballRank = 'Bronze' | 'Silver' | 'Gold' | 'Elite' | 'Legend' | 'Hall of Fame';

export interface RankInfo {
    name: FootballRank;
    minXp: number;
    badgeClass: string;
    icon: string;
}

export class ProgressionManager {
    public static RANKS: RankInfo[] = [
        { name: 'Bronze', minXp: 0, badgeClass: 'rank-bronze', icon: '🥉' },
        { name: 'Silver', minXp: 500, badgeClass: 'rank-silver', icon: '🥈' },
        { name: 'Gold', minXp: 1500, badgeClass: 'rank-gold', icon: '🥇' },
        { name: 'Elite', minXp: 3500, badgeClass: 'rank-elite', icon: '💎' },
        { name: 'Legend', minXp: 7500, badgeClass: 'rank-legend', icon: '🔥' },
        { name: 'Hall of Fame', minXp: 15000, badgeClass: 'rank-hall-of-fame', icon: '👑' }
    ];

    public static getRank(xp: number): RankInfo {
        for (let i = ProgressionManager.RANKS.length - 1; i >= 0; i--) {
            if (xp >= ProgressionManager.RANKS[i].minXp) {
                return ProgressionManager.RANKS[i];
            }
        }
        return ProgressionManager.RANKS[0];
    }

    public static getLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number; progressPercent: number } {
        const xpPerLevel = 250;
        const level = Math.floor(xp / xpPerLevel) + 1;
        const currentXp = xp % xpPerLevel;
        const progressPercent = Math.min(Math.floor((currentXp / xpPerLevel) * 100), 100);

        return {
            level,
            currentXp,
            nextLevelXp: xpPerLevel,
            progressPercent
        };
    }
}
