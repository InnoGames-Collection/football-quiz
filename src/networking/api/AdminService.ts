import { supabase } from '../supabase/SupabaseClient';

export interface QuestionFilter {
    category?: string;
    difficulty?: number;
    searchQuery?: string;
    page?: number;
    limit?: number;
}

export interface AdminUserRecord {
    id: string;
    username: string;
    phone?: string;
    elo_rating: number;
    coins: number;
    xp: number;
    role: string;
    subscription_tier: string;
    total_matches: number;
    total_wins: number;
    created_at: string;
    last_active?: string;
    is_banned?: boolean;
}

export interface TelcoRewardItem {
    id: string;
    user_id: string;
    msisdn: string;
    reward_type: string;
    reward_amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    period_type: string;
    rank_position: number;
    created_at: string;
    processed_at?: string;
    response_payload?: any;
    username?: string;
}

export interface AuditLogItem {
    id: string;
    admin_id?: string;
    action: string;
    target_entity: string;
    target_id?: string;
    details?: any;
    created_at: string;
    admin_username?: string;
}

export class AdminService {
    private static _instance: AdminService | null = null;

    public static getInstance(): AdminService {
        if (!AdminService._instance) {
            AdminService._instance = new AdminService();
        }
        return AdminService._instance;
    }

    // --- Super Admin Authentication Check ---
    public async verifySuperAdmin(): Promise<boolean> {
        if (!supabase) return true; // Offline test mode bypass

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return false;

            const { data, error } = await (supabase.from('users' as any) as any)
                .select('role')
                .eq('id', user.id)
                .single();

            if (error || !data) return false;
            return data.role === 'super_admin';
        } catch (err) {
            console.error('[AdminService] Exception checking admin role:', err);
            return false;
        }
    }

    // --- Trilingual Question CMS ---
    public async fetchQuestions(filter: QuestionFilter = {}): Promise<{ questions: any[]; totalCount: number }> {
        if (!supabase) return { questions: [], totalCount: 0 };

        try {
            let query = (supabase.from('questions' as any) as any)
                .select('*', { count: 'exact' });

            if (filter.category && filter.category !== 'all') {
                query = query.eq('category', filter.category);
            }
            if (filter.difficulty && filter.difficulty > 0) {
                query = query.eq('difficulty', filter.difficulty);
            }
            if (filter.searchQuery && filter.searchQuery.trim() !== '') {
                query = query.ilike('prompt_en', `%${filter.searchQuery.trim()}%`);
            }

            const page = filter.page || 1;
            const limit = filter.limit || 20;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query.order('created_at', { ascending: false }).range(from, to);

            const { data, error, count } = await query;
            if (error) {
                console.error('[AdminService] Error fetching questions:', error.message);
                return { questions: [], totalCount: 0 };
            }

            return { questions: data || [], totalCount: count || 0 };
        } catch (err) {
            console.error('[AdminService] Exception fetching questions:', err);
            return { questions: [], totalCount: 0 };
        }
    }

    public async saveQuestion(questionPayload: any, adminId?: string): Promise<{ success: boolean; message: string }> {
        if (!supabase) return { success: true, message: 'Question saved locally (Supabase offline).' };

        try {
            const isUpdate = !!questionPayload.id;
            let result;

            if (isUpdate) {
                result = await (supabase.from('questions' as any) as any)
                    .update(questionPayload)
                    .eq('id', questionPayload.id);
            } else {
                result = await (supabase.from('questions' as any) as any)
                    .insert(questionPayload);
            }

            if (result.error) {
                return { success: false, message: `Database error: ${result.error.message}` };
            }

            // Log audit action
            await this.logAuditAction(adminId, isUpdate ? 'UPDATE_QUESTION' : 'CREATE_QUESTION', 'questions', questionPayload.id || 'NEW', questionPayload);

            return { success: true, message: isUpdate ? 'Question updated successfully!' : 'Question published successfully!' };
        } catch (err: any) {
            return { success: false, message: `Error saving question: ${err.message || err}` };
        }
    }

    public async deleteQuestion(questionId: string, adminId?: string): Promise<{ success: boolean; message: string }> {
        if (!supabase) return { success: true, message: 'Question deleted locally.' };

        try {
            const { error } = await (supabase.from('questions' as any) as any)
                .delete()
                .eq('id', questionId);

            if (error) {
                return { success: false, message: `Delete failed: ${error.message}` };
            }

            await this.logAuditAction(adminId, 'DELETE_QUESTION', 'questions', questionId);

            return { success: true, message: 'Question deleted successfully!' };
        } catch (err: any) {
            return { success: false, message: `Error deleting question: ${err.message || err}` };
        }
    }

    public async bulkImportCsv(csvText: string, adminId?: string): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
        const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) {
            return { successCount: 0, errorCount: 1, errors: ['CSV must contain header row and at least 1 data row.'] };
        }

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        const rows = lines.slice(1);
        for (let i = 0; i < rows.length; i++) {
            const parts = rows[i].split(',').map(p => p.trim());
            if (parts.length < 8) {
                errorCount++;
                errors.push(`Row ${i + 2}: Insufficient columns (expected >= 8).`);
                continue;
            }

            const [category, diffStr, promptEn, opt0, opt1, opt2, opt3, correctStr, promptAm, promptOm] = parts;
            const difficulty = parseInt(diffStr || '2', 10);
            const correctIndex = parseInt(correctStr || '0', 10);

            if (!promptEn || !opt0 || !opt1 || !opt2 || !opt3) {
                errorCount++;
                errors.push(`Row ${i + 2}: Missing required English prompt or options.`);
                continue;
            }

            const payload = {
                category: category || 'walia-ibex',
                difficulty: isNaN(difficulty) ? 2 : Math.min(5, Math.max(1, difficulty)),
                competition_id: category || 'walia-ibex',
                prompt_en: promptEn,
                prompt_am: promptAm || null,
                prompt_om: promptOm || null,
                options_en: [opt0, opt1, opt2, opt3],
                correct_index: isNaN(correctIndex) ? 0 : Math.min(3, Math.max(0, correctIndex)),
                is_active: true
            };

            const res = await this.saveQuestion(payload, adminId);
            if (res.success) {
                successCount++;
            } else {
                errorCount++;
                errors.push(`Row ${i + 2}: ${res.message}`);
            }
        }

        return { successCount, errorCount, errors };
    }

    // --- User & Player Support Management ---
    public async searchUsers(query: string): Promise<AdminUserRecord[]> {
        if (!supabase) return [];

        try {
            let q = (supabase.from('users' as any) as any).select('*');

            if (query && query.trim() !== '') {
                const term = `%${query.trim()}%`;
                q = q.or(`username.ilike.${term},phone.ilike.${term}`);
            }

            const { data, error } = await q.order('created_at', { ascending: false }).limit(50);
            if (error) {
                console.error('[AdminService] Error searching users:', error.message);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error('[AdminService] Exception searching users:', err);
            return [];
        }
    }

    public async updateUserCoinsAndXp(userId: string, coinsDelta: number, xpDelta: number, reason: string, adminId?: string): Promise<{ success: boolean; message: string }> {
        if (!supabase) return { success: true, message: 'Balance updated locally.' };

        try {
            // Fetch current balance
            const { data: user, error: fetchErr } = await (supabase.from('users' as any) as any)
                .select('coins, xp')
                .eq('id', userId)
                .single();

            if (fetchErr || !user) return { success: false, message: 'User not found.' };

            const newCoins = Math.max(0, (user.coins || 0) + coinsDelta);
            const newXp = Math.max(0, (user.xp || 0) + xpDelta);

            const { error: updateErr } = await (supabase.from('users' as any) as any)
                .update({ coins: newCoins, xp: newXp })
                .eq('id', userId);

            if (updateErr) return { success: false, message: `Update failed: ${updateErr.message}` };

            await this.logAuditAction(adminId, 'ADJUST_USER_BALANCE', 'users', userId, {
                coinsDelta, xpDelta, reason, newCoins, newXp
            });

            return { success: true, message: `Updated balance for user ${userId}. Coins: ${newCoins}, XP: ${newXp}` };
        } catch (err: any) {
            return { success: false, message: `Error updating balance: ${err.message || err}` };
        }
    }

    public async setUserRole(userId: string, role: 'user' | 'super_admin', adminId?: string): Promise<{ success: boolean; message: string }> {
        if (!supabase) return { success: true, message: 'Role updated.' };

        try {
            const { error } = await (supabase.from('users' as any) as any)
                .update({ role })
                .eq('id', userId);

            if (error) return { success: false, message: `Role update failed: ${error.message}` };

            await this.logAuditAction(adminId, 'SET_USER_ROLE', 'users', userId, { new_role: role });

            return { success: true, message: `User role updated to '${role}'.` };
        } catch (err: any) {
            return { success: false, message: `Error updating role: ${err.message || err}` };
        }
    }

    // --- Telco Rewards Operations ---
    public async fetchTelcoRewardsQueue(): Promise<TelcoRewardItem[]> {
        if (!supabase) return [];

        try {
            const { data, error } = await (supabase.from('telco_rewards_queue' as any) as any)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) {
                console.error('[AdminService] Error fetching telco rewards queue:', error.message);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error('[AdminService] Exception fetching telco queue:', err);
            return [];
        }
    }

    public async retryTelcoDisbursement(queueId: string, adminId?: string): Promise<{ success: boolean; message: string }> {
        if (!supabase) return { success: true, message: 'Re-triggered payout locally.' };

        try {
            const { error } = await (supabase.from('telco_rewards_queue' as any) as any)
                .update({ status: 'pending', processed_at: null })
                .eq('id', queueId);

            if (error) return { success: false, message: `Retry failed: ${error.message}` };

            await this.logAuditAction(adminId, 'RETRY_TELCO_DISBURSEMENT', 'telco_rewards_queue', queueId);

            return { success: true, message: `Queued reward ${queueId} for re-processing.` };
        } catch (err: any) {
            return { success: false, message: `Error re-triggering reward: ${err.message || err}` };
        }
    }

    // --- Broadcast Notifications & Audits ---
    public async sendBroadcastNotification(payload: { titleEn: string; titleAm?: string; titleOm?: string; bodyEn: string; bodyAm?: string; bodyOm?: string; category: string }, adminId?: string): Promise<{ success: boolean; message: string }> {
        if (!supabase) return { success: true, message: 'Broadcast queued locally.' };

        try {
            const { error } = await (supabase.from('notifications' as any) as any).insert({
                user_id: null, // Broadcast to all users
                title_en: payload.titleEn,
                title_am: payload.titleAm || null,
                title_om: payload.titleOm || null,
                body_en: payload.bodyEn,
                body_am: payload.bodyAm || null,
                body_om: payload.bodyOm || null,
                category: payload.category || 'system',
                read: false
            });

            if (error) return { success: false, message: `Broadcast failed: ${error.message}` };

            await this.logAuditAction(adminId, 'SEND_BROADCAST_NOTIFICATION', 'notifications', 'BROADCAST', payload);

            return { success: true, message: 'Broadcast notification sent successfully to all players!' };
        } catch (err: any) {
            return { success: false, message: `Error sending broadcast: ${err.message || err}` };
        }
    }

    public async fetchAuditLogs(): Promise<AuditLogItem[]> {
        if (!supabase) return [];

        try {
            const { data, error } = await (supabase.from('admin_audit_logs' as any) as any)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) {
                console.error('[AdminService] Error fetching audit logs:', error.message);
                return [];
            }
            return data || [];
        } catch (err) {
            console.error('[AdminService] Exception fetching audit logs:', err);
            return [];
        }
    }

    private async logAuditAction(adminId: string | undefined, action: string, targetEntity: string, targetId?: string, details?: any): Promise<void> {
        if (!supabase) return;
        try {
            await (supabase.from('admin_audit_logs' as any) as any).insert({
                admin_id: adminId || null,
                action,
                target_entity: targetEntity,
                target_id: targetId || null,
                details: details || null
            });
        } catch (err) {
            console.warn('[AdminService] Failed to write audit log:', err);
        }
    }
}
