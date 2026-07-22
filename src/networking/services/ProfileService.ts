import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { UserRow, UserUpdate, UserPreferenceRow } from '../supabase/types';

export class ProfileService {
    private static _instance: ProfileService | null = null;
    
    private _profileCache: UserRow | null = null;
    private _preferencesCache: UserPreferenceRow | null = null;

    private constructor() {}

    public static getInstance(): ProfileService {
        if (!ProfileService._instance) {
            ProfileService._instance = new ProfileService();
        }
        return ProfileService._instance;
    }

    public async getProfile(): Promise<UserRow | null> {
        if (!supabaseService.isOnline) return null;
        const client = supabase;
        if (!client) return null;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return null;
            
            const { data, error } = await client
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();
                
            if (error) {
                console.warn('[ProfileService] Error fetching profile:', error);
                return null;
            }
            
            this._profileCache = data;
            return data;
        } catch (err) {
            console.warn('[ProfileService] Failed to get profile:', err);
            return null;
        }
    }
    
    public async updateProfile(updates: UserUpdate): Promise<void> {
        if (!supabaseService.isOnline) return;
        const client = supabase;
        if (!client) return;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return;
            
            const { error } = await client
                .from('users')
                .update(updates)
                .eq('id', user.id);
                
            if (error) {
                console.warn('[ProfileService] Error updating profile:', error);
            } else {
                if (this._profileCache) {
                    this._profileCache = { ...this._profileCache, ...(updates as any) };
                }
            }
        } catch (err) {
            console.warn('[ProfileService] Failed to update profile:', err);
        }
    }
    
    public async getPreferences(): Promise<UserPreferenceRow | null> {
        if (!supabaseService.isOnline) return null;
        const client = supabase;
        if (!client) return null;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return null;
            
            const { data, error } = await client
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single();
                
            if (error) {
                console.warn('[ProfileService] Error fetching preferences:', error);
                return null;
            }
            
            this._preferencesCache = data;
            return data;
        } catch (err) {
            console.warn('[ProfileService] Failed to get preferences:', err);
            return null;
        }
    }
    
    public async updatePreferences(updates: Partial<UserPreferenceRow>): Promise<void> {
        if (!supabaseService.isOnline) return;
        const client = supabase;
        if (!client) return;
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return;
            
            const { error } = await client
                .from('user_preferences')
                .update(updates as any)
                .eq('user_id', user.id);
                
            if (error) {
                console.warn('[ProfileService] Error updating preferences:', error);
            } else {
                if (this._preferencesCache) {
                    this._preferencesCache = { ...this._preferencesCache, ...updates };
                }
            }
        } catch (err) {
            console.warn('[ProfileService] Failed to update preferences:', err);
        }
    }

    public async getEarnedAchievements(): Promise<{ achievement_id: string; earned_at: string; achievement: any }[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return [];

            const { data, error } = await client
                .from('user_achievements')
                .select('achievement_id, earned_at, achievements:achievements (*)')
                .eq('user_id', user.id);

            if (error) {
                console.warn('[ProfileService] Error fetching user achievements:', error);
                return [];
            }
            return (data || []) as any;
        } catch (err) {
            console.warn('[ProfileService] Failed to get user achievements:', err);
            return [];
        }
    }

    public async getRewards(): Promise<any[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data: { user } } = await client.auth.getUser();
            if (!user) return [];

            const { data, error } = await client
                .from('rewards')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.warn('[ProfileService] Error fetching user rewards:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.warn('[ProfileService] Failed to get rewards:', err);
            return [];
        }
    }

    public subscribeToProfileChanges(callback: (profile: UserRow) => void): () => void {
        if (!supabaseService.isOnline) return () => {};
        const client = supabase;
        if (!client) return () => {};
        
        let subscription: any = null;

        client.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            const innerClient = supabase;
            if (!innerClient) return;

            subscription = innerClient
                .channel(`public:users:id=eq.${user.id}`)
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` },
                    (payload) => {
                        this._profileCache = payload.new as UserRow;
                        callback(this._profileCache);
                    }
                )
                .subscribe();
        });

        return () => {
            const currentClient = supabase;
            if (subscription && currentClient) {
                currentClient.removeChannel(subscription);
            }
        };
    }
}
