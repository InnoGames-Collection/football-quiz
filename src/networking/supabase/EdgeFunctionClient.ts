import { supabase, supabaseService } from './SupabaseClient';

/**
 * Shared helper for invoking Supabase Edge Functions with type safety,
 * automatic JWT authorization headers, and error handling.
 */
export class EdgeFunctionClient {
    public static async invoke<T = any>(
        functionName: string,
        body?: Record<string, any>
    ): Promise<{ data: T | null; error: string | null }> {
        if (!supabaseService.isOnline || !supabase) {
            return {
                data: null,
                error: `Supabase client offline. Edge function '${functionName}' unavailable.`
            };
        }

        try {
            const { data, error } = await supabase.functions.invoke(functionName, {
                body
            });

            if (error) {
                console.error(`[EdgeFunctionClient] Error calling '${functionName}':`, error);
                return { data: null, error: error.message };
            }

            return { data: data as T, error: null };
        } catch (err: any) {
            console.error(`[EdgeFunctionClient] Exception in '${functionName}':`, err);
            return { data: null, error: err.message || 'Edge function invocation failed.' };
        }
    }
}
