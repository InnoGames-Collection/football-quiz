import { supabase, supabaseService } from '../../networking/supabase/SupabaseClient';
import type { UserRow } from '../../networking/supabase/types';
import { SaveManager } from '../managers/SaveManager';

export type AuthStateListener = (user: UserRow | null, isGuest: boolean) => void;

/**
 * Manages user authentication state (Phone OTP, Google OAuth, Guest),
 * session persistence, and synchronization with Supabase & SaveManager.
 */
export class AuthManager {
    private static _instance: AuthManager | null = null;
    private _currentUser: UserRow | null = null;
    private _isGuest: boolean = true;
    private _listeners: Set<AuthStateListener> = new Set();
    private _saveManager: SaveManager;

    private constructor(saveManager: SaveManager) {
        this._saveManager = saveManager;
        this._initSession();
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
            console.log('[AuthManager] Offline mode active. Operating as guest.');
            this._isGuest = true;
            this._notifyListeners();
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await this._fetchUserProfile(session.user.id);
            } else {
                this._isGuest = true;
            }
        } catch (err) {
            console.error('[AuthManager] Failed to fetch session:', err);
            this._isGuest = true;
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`[AuthManager] Auth state changed: ${event}`);
            if (session?.user) {
                await this._fetchUserProfile(session.user.id);
            } else {
                this._currentUser = null;
                this._isGuest = true;
                this._notifyListeners();
            }
        });
    }

    private async _fetchUserProfile(userId: string): Promise<void> {
        if (!supabase) return;

        const { data, error } = await (supabase.from('users' as any) as any)
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('[AuthManager] Error fetching user profile:', error);
            this._isGuest = true;
        } else if (data) {
            this._currentUser = data as UserRow;
            this._isGuest = false;
            // Sync local profile to save manager
            this._saveManager.syncWithCloudUser(data as UserRow);
        }
        this._notifyListeners();
    }

    /**
     * Send OTP to an Ethiopian (+251) or international phone number.
     */
    public async signInWithPhone(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
        if (!supabase) {
            return { success: false, error: 'Supabase client offline' };
        }

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: phoneNumber
            });

            if (error) {
                return { success: false, error: error.message };
            }
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Phone sign-in failed' };
        }
    }

    /**
     * Verify OTP code sent via SMS.
     */
    public async verifyOtp(phoneNumber: string, token: string): Promise<{ success: boolean; error?: string }> {
        if (!supabase) {
            return { success: false, error: 'Supabase client offline' };
        }

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                phone: phoneNumber,
                token,
                type: 'sms'
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                await this._fetchUserProfile(data.user.id);
            }
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'OTP verification failed' };
        }
    }

    /**
     * Sign in with Google OAuth.
     */
    public async signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
        if (!supabase) {
            return { success: false, error: 'Supabase client offline' };
        }

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Google OAuth failed' };
        }
    }

    /**
     * Continue as a guest player without cloud sync.
     */
    public continueAsGuest(guestName?: string): void {
        this._isGuest = true;
        this._currentUser = null;
        if (guestName) {
            this._saveManager.updateUsername(guestName);
        }
        this._notifyListeners();
    }

    /**
     * Sign out current user.
     */
    public async signOut(): Promise<void> {
        if (supabase && !this._isGuest) {
            await supabase.auth.signOut();
        }
        this._currentUser = null;
        this._isGuest = true;
        this._notifyListeners();
    }

    public subscribe(listener: AuthStateListener): () => void {
        this._listeners.add(listener);
        listener(this._currentUser, this._isGuest);
        return () => this._listeners.delete(listener);
    }

    private _notifyListeners(): void {
        this._listeners.forEach(listener => listener(this._currentUser, this._isGuest));
    }

    public get currentUser(): UserRow | null {
        return this._currentUser;
    }

    public get isGuest(): boolean {
        return this._isGuest;
    }

    public get isAuthenticated(): boolean {
        return !this._isGuest && this._currentUser !== null;
    }
}
