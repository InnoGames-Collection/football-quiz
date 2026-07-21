import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[SupabaseClient] Missing Supabase credentials. Running in offline mode.');
}

/**
 * Singleton Supabase client for the Football Quiz League platform.
 * Provides type-safe access to the database, auth, realtime, and storage.
 */
class SupabaseService {
    private static _instance: SupabaseService | null = null;
    private _client: SupabaseClient<Database> | null = null;

    private constructor() {
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
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
            console.log('[SupabaseClient] Initialized successfully.');
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
