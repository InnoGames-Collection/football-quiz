import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { FaqItemRow } from '../supabase/types';

export class FAQService {
    private static _instance: FAQService | null = null;

    private constructor() {}

    public static getInstance(): FAQService {
        if (!FAQService._instance) {
            FAQService._instance = new FAQService();
        }
        return FAQService._instance;
    }

    public async getCategories(): Promise<string[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data, error } = await client
                .from('faq_items')
                .select('category');

            if (error) {
                console.warn('[FAQService] Error fetching FAQ categories:', error);
                return [];
            }

            if (data) {
                const categories = Array.from(new Set(data.map(item => item.category)));
                return categories;
            }
            return [];
        } catch (err) {
            console.warn('[FAQService] Failed to get FAQ categories:', err);
            return [];
        }
    }

    public async getFAQsByCategory(category: string): Promise<FaqItemRow[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        try {
            const { data, error } = await client
                .from('faq_items')
                .select('*')
                .eq('category', category)
                .order('sort_order', { ascending: true });

            if (error) {
                console.warn('[FAQService] Error fetching FAQs by category:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.warn('[FAQService] Failed to get FAQs by category:', err);
            return [];
        }
    }

    public async searchFAQs(query: string): Promise<FaqItemRow[]> {
        if (!supabaseService.isOnline) return [];
        const client = supabase;
        if (!client) return [];
        if (!query || query.trim() === '') return [];

        try {
            // Basic case-insensitive text search using ILIKE
            const { data, error } = await client
                .from('faq_items')
                .select('*')
                .or(`question_en.ilike.%${query}%,answer_en.ilike.%${query}%`)
                .order('sort_order', { ascending: true });

            if (error) {
                console.warn('[FAQService] Error searching FAQs:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            console.warn('[FAQService] Failed to search FAQs:', err);
            return [];
        }
    }
}
