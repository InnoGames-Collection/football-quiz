import type { UserRow } from '../../networking/supabase/types';
import { supabaseService } from '../../networking/supabase/SupabaseClient';

export interface UserProfile {
    username: string;
    coins: number;
    xp: number;
    highScores: Record<string, number>;
    unlockedItems: string[];
    phone?: string;
    eloRating?: number;
    streakCount?: number;
}

export class SaveManager {
    private static STORAGE_KEY = 'ETHIO_FOOTBALL_SAVE_V1';
    private _profile: UserProfile;
    private _cloudUserId: string | null = null;

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
            unlockedItems: ['default-ball', 'default-jersey'],
            eloRating: 1200,
            streakCount: 0
        };
    }

    public syncWithCloudUser(user: UserRow): void {
        this._cloudUserId = user.id;
        this._profile.username = user.username;
        this._profile.coins = user.coins;
        this._profile.xp = user.xp;
        this._profile.eloRating = user.elo_rating;
        this._profile.streakCount = user.streak_count;
        if (user.phone) {
            this._profile.phone = user.phone;
        }
        this.save();
    }

    public save(): void {
        try {
            localStorage.setItem(SaveManager.STORAGE_KEY, JSON.stringify(this._profile));
            console.log('[SaveManager] Saved user profile locally.');
        } catch (e) {
            console.error('[SaveManager] Failed to save profile to localStorage.', e);
        }

        // Async sync to cloud if authenticated
        const client = supabaseService.client;
        if (this._cloudUserId && client) {
            (client.from('users' as any) as any)
                .update({
                    username: this._profile.username,
                    coins: this._profile.coins,
                    xp: this._profile.xp,
                    elo_rating: this._profile.eloRating || 1200,
                    streak_count: this._profile.streakCount || 0,
                    last_active: new Date().toISOString()
                })
                .eq('id', this._cloudUserId)
                .then(({ error }: { error: any }) => {
                    if (error) console.error('[SaveManager] Error syncing profile to cloud:', error);
                });
        }
    }

    public get profile(): UserProfile {
        return this._profile;
    }

    public updateUsername(name: string): void {
        this._profile.username = name;
        this.save();
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

    public addXp(amount: number): void {
        this._profile.xp += amount;
        this.save();
    }

    public updateStreak(count: number): void {
        this._profile.streakCount = count;
        this.save();
    }
}
