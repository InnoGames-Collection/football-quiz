export interface UserProfile {
    username: string;
    coins: number;
    xp: number;
    highScores: Record<string, number>;
    unlockedItems: string[];
}

export class SaveManager {
    private static STORAGE_KEY = 'ETHIO_FOOTBALL_SAVE_V1';
    private _profile: UserProfile;

    constructor() {
        this._profile = this._loadProfile();
    }

    private _loadProfile(): UserProfile {
        try {
            const data = localStorage.getItem(SaveManager.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.warn('[SaveManager] Failed to read localStorage, initializing default profile.', e);
        }

        return {
            username: 'Walia Player',
            coins: 100,
            xp: 0,
            highScores: {
                'football-quiz': 0
            },
            unlockedItems: ['default-ball', 'default-jersey']
        };
    }

    public save(): void {
        try {
            localStorage.setItem(SaveManager.STORAGE_KEY, JSON.stringify(this._profile));
            console.log('[SaveManager] Saved user profile.');
        } catch (e) {
            console.error('[SaveManager] Failed to save profile to localStorage.', e);
        }
    }

    public get profile(): UserProfile {
        return this._profile;
    }

    public updateHighScore(gameId: string, score: number): boolean {
        const currentHigh = this._profile.highScores[gameId] || 0;
        if (score > currentHigh) {
            this._profile.highScores[gameId] = score;
            this._profile.xp += Math.floor(score * 0.5);
            this.save();
            return true; // New High Score!
        }
        return false;
    }

    public addCoins(amount: number): void {
        this._profile.coins += amount;
        this.save();
    }
}
