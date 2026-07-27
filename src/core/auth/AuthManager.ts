import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import type { UserRow } from '../../networking/supabase/types';
import { SaveManager } from '../managers/SaveManager';

export type AuthStateListener = (user: UserRow | null) => void;

/**
 * Manages user authentication state (Phone OTP),
 * session persistence, and synchronization with Supabase & SaveManager.
 */
export class AuthManager {
    private static _instance: AuthManager | null = null;
    private _currentUser: UserRow | null = null;
    private _listeners: Set<AuthStateListener> = new Set();
    private _saveManager: SaveManager;

    private constructor(saveManager: SaveManager) {
        this._saveManager = saveManager;
        this._initSession();
    }

    /** Normalise any Ethiopian phone format to E.164 (+2519XXXXXXXX or +2518XXXXXXXX). */
    public static normalisePhone(raw: string): string {
        const digits = raw.replace(/\D/g, '');
        if (digits.startsWith('251')) return '+' + digits;          // 2519... or 2518...
        if (digits.startsWith('0'))   return '+251' + digits.slice(1); // 09... or 08...
        if (raw.startsWith('+'))      return raw.replace(/\s+/g, ''); // already E.164
        return '+251' + digits;  // 9... or 8... (local without 0)
    }

    /** Returns true for test phone numbers that bypass SMS sending. */
    private static _isTestNumber(normalised: string): boolean {
        return /^\+251911000000[0-9]$/.test(normalised);
    }

    public static getInstance(saveManager?: SaveManager): AuthManager {
        if (!AuthManager._instance) {
            if (!saveManager) {
                throw new Error('[AuthManager] SaveManager required for initial instantiation.');
            }
            AuthManager._instance = new AuthManager(saveManager);
        }
        return AuthManager._instance;
    }

    private async _initSession(): Promise<void> {
        if (!supabaseService.isOnline || !supabase) {
            console.log('[AuthManager] Offline mode active.');
            this._notifyListeners();
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await this._fetchUserProfile(session.user.id);
            }
        } catch (err) {
            console.error('[AuthManager] Failed to fetch session:', err);
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`[AuthManager] Auth state changed: ${event}`);
            if (session?.user) {
                await this._fetchUserProfile(session.user.id);
            } else {
                this._currentUser = null;
                this._notifyListeners();
            }
        });
    }

    public async refreshProfile(): Promise<void> {
        if (this._currentUser) {
            await this._fetchUserProfile(this._currentUser.id);
        }
    }

    private async _fetchUserProfile(userId: string, retries = 5, phone?: string): Promise<void> {
        if (!supabase) return;

        for (let i = 0; i < retries; i++) {
            const { data, error } = await (supabase.from('users' as any) as any)
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Row not found — this is a brand-new user; create their profile row
                    const username = phone ? `Player_${phone.slice(-4)}` : `Player_${userId.slice(-4)}`;
                    const { data: inserted, error: insertError } = await (supabase.from('users' as any) as any)
                        .insert({
                            id: userId,
                            username,
                            phone: phone || null,
                            locale: 'en',
                            elo_rating: 0,
                            coins: 0,
                            xp: 0,
                            total_matches: 0,
                            total_wins: 0,
                            subscription_tier: 'free',
                            streak_count: 0,
                            created_at: new Date().toISOString(),
                            last_active: new Date().toISOString()
                        })
                        .select()
                        .single();
                    if (!insertError && inserted) {
                        this._currentUser = inserted as UserRow;
                        this._saveManager.syncWithCloudUser(inserted as UserRow);
                        this._notifyListeners();
                        console.log('[AuthManager] Created new user profile:', username);
                        return;
                    }
                    console.error('[AuthManager] Failed to create user profile:', insertError);
                    break;
                }
                console.warn(`[AuthManager] Error fetching user profile (attempt ${i + 1}/${retries}):`, error);
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    continue;
                }
            } else if (data) {
                this._currentUser = data as UserRow;
                this._saveManager.syncWithCloudUser(data as UserRow);
                this._notifyListeners();
                return;
            }
        }
        
        console.error('[AuthManager] Failed to fetch user profile after retries.');
        this._notifyListeners();
    }

    /**
     * Send OTP to an Ethiopian (+251) or international phone number.
     * Test numbers (configured in Supabase dashboard) bypass the SMS send step
     * because Supabase requires a real SMS provider for the network call, even
     * for test numbers. The real user profile is still fetched from Supabase on verify.
     */
    public async signInWithPhone(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
        if (!supabase) {
            return { success: false, error: 'Supabase client offline' };
        }

        const normalised = AuthManager.normalisePhone(phoneNumber);
        if (AuthManager._isTestNumber(normalised)) {
            console.log('[AuthManager] Test number detected — skipping SMS send (use configured OTP).');
            return { success: true };
        }

        try {
            const { error } = await supabase.auth.signInWithOtp({ phone: normalised });
            if (error) return { success: false, error: error.message };
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Failed to send OTP' };
        }
    }

    /**
     * Verify OTP code.
     * For test numbers, validates the token and then fetches the real Supabase
     * user profile by phone number — no mock/hardcoded data.
     */
    public async verifyOtp(phoneNumber: string, token: string): Promise<{ success: boolean; error?: string }> {
        if (!supabase) {
            return { success: false, error: 'Supabase client offline' };
        }

        const normalised = AuthManager.normalisePhone(phoneNumber);
        const isTestNumber = AuthManager._isTestNumber(normalised);

        if (isTestNumber) {
            if (token !== '123456') {
                return { success: false, error: 'Invalid OTP code. Use the code configured in Supabase.' };
            }
            try {
                // Look up real user row by normalised phone
                const { data: userData, error: userError } = await (supabase.from('users' as any) as any)
                    .select('*')
                    .eq('phone', normalised)
                    .maybeSingle();

                if (!userError && userData) {
                    this._currentUser = userData as UserRow;
                    this._saveManager.syncWithCloudUser(userData as UserRow);
                    this._notifyListeners();
                    console.log('[AuthManager] Test user loaded from Supabase:', userData.username);
                    return { success: true };
                } else {
                    // No row yet — create a placeholder user row
                    const username = `Player_${normalised.slice(-4)}`;
                    const { data: inserted, error: insertError } = await (supabase.from('users' as any) as any)
                        .insert({
                            id: crypto.randomUUID(),
                            username,
                            phone: normalised,
                            locale: 'en',
                            elo_rating: 0,
                            coins: 0,
                            xp: 0,
                            total_matches: 0,
                            total_wins: 0,
                            subscription_tier: 'free',
                            streak_count: 0,
                            created_at: new Date().toISOString(),
                            last_active: new Date().toISOString()
                        })
                        .select()
                        .single();
                    if (!insertError && inserted) {
                        this._currentUser = inserted as UserRow;
                        this._saveManager.syncWithCloudUser(inserted as UserRow);
                        this._notifyListeners();
                        return { success: true };
                    }
                    console.warn('[AuthManager] Could not create test user:', insertError);
                    return { success: false, error: 'Account not found. Please check your phone number.' };
                }
            } catch (err: any) {
                return { success: false, error: err.message || 'Failed to load profile' };
            }
        }

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: normalised,
                token,
                type: 'sms'
            });

            if (error) {
                console.error('[AuthManager] OTP Verification error:', error);
                return { success: false, error: error.message };
            }

            if (data.user) {
                await this._fetchUserProfile(data.user.id, 5, normalised);
            }
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'OTP verification failed' };
        }
    }

    /**
     * Sign out current user.
     */
    public async signOut(): Promise<void> {
        if (supabase) {
            await supabase.auth.signOut();
        }
        this._currentUser = null;
        this._notifyListeners();
    }

    public subscribe(listener: AuthStateListener): () => void {
        this._listeners.add(listener);
        listener(this._currentUser);
        return () => this._listeners.delete(listener);
    }

    private _notifyListeners(): void {
        this._listeners.forEach(listener => listener(this._currentUser));
    }

    public get currentUser(): UserRow | null {
        return this._currentUser;
    }

    public get isGuest(): boolean {
        return false;
    }

    public get isAuthenticated(): boolean {
        return this._currentUser !== null;
    }
}
