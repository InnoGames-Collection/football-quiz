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
    role?: 'admin' | 'player';
    totalMatches?: number;
    totalWins?: number;
}

export class SaveManager {
    private _profile: UserProfile;
    private _cloudUserId: string | null = null;

    constructor() {
        // Profile starts with defaults; authoritative data comes from syncWithCloudUser() after server auth.
        this._profile = this._defaultProfile();
    }

    public get cloudUserId(): string | null {
        return this._cloudUserId;
    }

    private _defaultProfile(): UserProfile {
        return {
            username: 'Player',
            coins: 0,
            xp: 0,
            highScores: { 'football-quiz': 0 },
            unlockedItems: ['default-ball', 'default-jersey'],
            eloRating: 0,
            streakCount: 0,
            totalMatches: 0,
            totalWins: 0
        };
    }

    public syncWithCloudUser(user: UserRow): void {
        this._cloudUserId = user.id;
        this._profile.username = user.username;
        this._profile.coins = user.coins;
        this._profile.xp = user.xp;
        this._profile.eloRating = user.elo_rating;
        this._profile.streakCount = user.streak_count;
        this._profile.totalMatches = user.total_matches;
        this._profile.totalWins = user.total_wins;
        if (user.phone) {
            this._profile.phone = user.phone;
        }
        this.save();
    }

    public save(): void {
        // Profile is synced to the server asynchronously. No localStorage write.
        const client = supabaseService.client;
        if (this._cloudUserId && client) {
            let totalScore = 0;
            if (this._profile.highScores) {
                for (const key in this._profile.highScores) {
                    totalScore += this._profile.highScores[key];
                }
            }
            
            (client.from('users' as any) as any)
                .update({
                    username: this._profile.username,
                    coins: this._profile.coins,
                    xp: this._profile.xp,
                    score: totalScore,
                    elo_rating: this._profile.eloRating || 0,
                    streak_count: this._profile.streakCount || 0,
                    total_matches: this._profile.totalMatches || 0,
                    total_wins: this._profile.totalWins || 0,
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

    public incrementMatchStats(won: boolean): void {
        this._profile.totalMatches = (this._profile.totalMatches || 0) + 1;
        if (won) {
            this._profile.totalWins = (this._profile.totalWins || 0) + 1;
        }
        this.save();
    }

    public updateStreak(count: number): void {
        this._profile.streakCount = count;
        this.save();
    }

    public isAdmin(): boolean {
        return this._profile.role === 'admin';
    }
}
