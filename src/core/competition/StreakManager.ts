import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import { SaveManager } from '../managers/SaveManager';

export interface StreakClaimResult {
    success: boolean;
    streak: number;
    bonusCoins: number;
    isMilestone: boolean;
    message?: string;
}

export class StreakManager {
    private static _instance: StreakManager | null = null;
    private _saveManager: SaveManager;

    private constructor(saveManager: SaveManager) {
        this._saveManager = saveManager;
    }

    public static getInstance(saveManager?: SaveManager): StreakManager {
        if (!StreakManager._instance) {
            if (!saveManager) {
                throw new Error('[StreakManager] SaveManager required for initialization.');
            }
            StreakManager._instance = new StreakManager(saveManager);
        }
        return StreakManager._instance;
    }

    public async claimDailyStreak(): Promise<StreakClaimResult> {
        if (supabaseService.isOnline && supabase) {
            try {
                const { data, error } = await supabase.rpc('claim_daily_streak');

                if (!error && data) {
                    const res = data as any;
                    if (res.success) {
                        this._saveManager.addCoins(res.bonusCoins || 0);
                        return {
                            success: true,
                            streak: res.streak,
                            bonusCoins: res.bonusCoins,
                            isMilestone: res.milestone || false
                        };
                    } else {
                        return {
                            success: false,
                            streak: res.streak || this.currentStreak,
                            bonusCoins: 0,
                            isMilestone: false,
                            message: res.message || 'Already claimed today'
                        };
                    }
                }
            } catch (err) {
                console.warn('[StreakManager] Cloud streak claim failed, fallback to local:', err);
            }
        }

        // Local fallback calculation
        const profile = this._saveManager.profile;
        const currentStreak = (profile.streakCount || 0) + 1;
        this._saveManager.profile.streakCount = currentStreak;
        this._saveManager.addCoins(10);

        return {
            success: true,
            streak: currentStreak,
            bonusCoins: 10,
            isMilestone: currentStreak % 7 === 0
        };
    }

    public get currentStreak(): number {
        return this._saveManager.profile.streakCount || 0;
    }
}
