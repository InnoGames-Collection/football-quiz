import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const DEFAULT_URL = 'https://eywvrsqiqvmiktovaxmq.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_vSzKiN0dx8mgRRb3jsDonQ_BesE-gSx';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_URL;
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_ANON_KEY;

/**
 * Singleton Supabase client for the Football Quiz League platform.
 * Provides type-safe access to the database, auth, realtime, and storage.
 */
class SupabaseService {
    private static _instance: SupabaseService | null = null;
    private _client: SupabaseClient<Database> | null = null;

    private constructor() {
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
            try {
                this._client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: true
                    },
                    realtime: {
                        params: {
                            eventsPerSecond: 10
                        }
                    }
                });
                console.log('[SupabaseClient] Initialized successfully with URL:', SUPABASE_URL);
            } catch (err) {
                console.error('[SupabaseClient] Failed to initialize Supabase client:', err);
                this._client = null;
            }
        } else {
            console.warn('[SupabaseClient] Missing Supabase credentials.');
        }
    }

    public static getInstance(): SupabaseService {
        if (!SupabaseService._instance) {
            SupabaseService._instance = new SupabaseService();
        }
        return SupabaseService._instance;
    }

    /**
     * Returns the Supabase client instance.
     * Returns null if credentials are not configured (offline mode).
     */
    public get client(): SupabaseClient<Database> | null {
        return this._client;
    }

    /**
     * Returns true if the Supabase client is available and configured.
     */
    public get isOnline(): boolean {
        return this._client !== null;
    }
}

export const supabaseService = SupabaseService.getInstance();
export const supabase = supabaseService.client;
