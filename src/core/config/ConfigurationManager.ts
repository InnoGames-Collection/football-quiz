import { supabase } from '../../networking/supabase/SupabaseClient';

export interface SystemConfigItem {
    key: string;
    value: any;
    category: 'gameplay' | 'economy' | 'matchmaking' | 'system' | 'telco';
    description?: string;
    updated_at?: string;
    updated_by?: string;
}

export class ConfigurationManager {
    private static _instance: ConfigurationManager | null = null;
    private _configs: Map<string, SystemConfigItem> = new Map();
    private _isLoaded: boolean = false;

    public get isLoaded(): boolean {
        return this._isLoaded;
    }

    // Fallback default values
    private _defaults: Record<string, SystemConfigItem> = {
        quiz_timer_sec: { key: 'quiz_timer_sec', value: 15, category: 'gameplay', description: 'Seconds allowed per quiz question' },
        questions_per_match: { key: 'questions_per_match', value: 10, category: 'gameplay', description: 'Number of questions in a standard match' },
        max_lifelines_per_match: { key: 'max_lifelines_per_match', value: 2, category: 'gameplay', description: 'Maximum lifelines usable per match' },
        daily_login_coins: { key: 'daily_login_coins', value: 100, category: 'economy', description: 'Coins awarded for daily login streak' },
        win_coin_reward: { key: 'win_coin_reward', value: 50, category: 'economy', description: 'Coins awarded for winning a match' },
        win_xp_reward: { key: 'win_xp_reward', value: 20, category: 'economy', description: 'XP awarded for winning a match' },
        elo_base_gain: { key: 'elo_base_gain', value: 25, category: 'matchmaking', description: 'Base ELO rating points gained on win' },
        elo_base_loss: { key: 'elo_base_loss', value: 15, category: 'matchmaking', description: 'Base ELO rating points lost on defeat' },
        queue_timeout_sec: { key: 'queue_timeout_sec', value: 30, category: 'matchmaking', description: 'Matchmaking queue search timeout before bot pairing' },
        bot_fallback_enabled: { key: 'bot_fallback_enabled', value: true, category: 'matchmaking', description: 'Enable simulated opponent fallback if queue times out' },
        maintenance_mode: { key: 'maintenance_mode', value: false, category: 'system', description: 'Enable global maintenance mode to restrict player logins' },
        maintenance_message: { key: 'maintenance_message', value: 'System is under scheduled maintenance. Please check back soon.', category: 'system', description: 'Custom message displayed during maintenance' },
        daily_sub_price_etb: { key: 'daily_sub_price_etb', value: 2, category: 'telco', description: 'Daily Ethio Telecom subscription price in ETB' },
        weekly_airtime_reward_1st: { key: 'weekly_airtime_reward_1st', value: 500, category: 'telco', description: '1st place weekly airtime reward in ETB' },
        weekly_airtime_reward_2nd: { key: 'weekly_airtime_reward_2nd', value: 250, category: 'telco', description: '2nd place weekly airtime reward in ETB' },
        weekly_airtime_reward_3rd: { key: 'weekly_airtime_reward_3rd', value: 100, category: 'telco', description: '3rd place weekly airtime reward in ETB' }
    };

    private constructor() {
        // Initialize map with fallback defaults
        for (const [k, item] of Object.entries(this._defaults)) {
            this._configs.set(k, item);
        }
    }

    public static getInstance(): ConfigurationManager {
        if (!ConfigurationManager._instance) {
            ConfigurationManager._instance = new ConfigurationManager();
        }
        return ConfigurationManager._instance;
    }

    public async loadConfigurations(): Promise<void> {
        if (!supabase) {
            console.warn('[ConfigurationManager] Supabase offline; using default configurations.');
            this._isLoaded = true;
            return;
        }

        try {
            const { data, error } = await (supabase.from('system_configurations' as any) as any)
                .select('*');

            if (error) {
                console.warn('[ConfigurationManager] Failed to load system configurations from Supabase:', error.message);
            } else if (data && data.length > 0) {
                for (const row of data) {
                    this._configs.set(row.key, {
                        key: row.key,
                        value: row.value,
                        category: row.category,
                        description: row.description,
                        updated_at: row.updated_at,
                        updated_by: row.updated_by
                    });
                }
            }
        } catch (err) {
            console.error('[ConfigurationManager] Exception loading system configs:', err);
        } finally {
            this._isLoaded = true;
        }
    }

    public getConfig<T = any>(key: string, defaultValue?: T): T {
        const item = this._configs.get(key);
        if (item !== undefined && item.value !== undefined) {
            return item.value as T;
        }
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        const fallback = this._defaults[key];
        return (fallback ? fallback.value : undefined) as T;
    }

    public getAllConfigs(): SystemConfigItem[] {
        return Array.from(this._configs.values());
    }

    public async updateConfig(key: string, value: any, adminId?: string): Promise<{ success: boolean; message: string }> {
        const item = this._configs.get(key) || this._defaults[key] || {
            key,
            value,
            category: 'system',
            description: 'Custom configuration'
        };

        const updatedItem: SystemConfigItem = {
            ...item,
            value,
            updated_at: new Date().toISOString(),
            updated_by: adminId
        };

        // Update local state immediately
        this._configs.set(key, updatedItem);

        if (!supabase) {
            return { success: true, message: `Updated local configuration '${key}' (Supabase offline).` };
        }

        try {
            const { error } = await (supabase.from('system_configurations' as any) as any)
                .upsert({
                    key: updatedItem.key,
                    value: updatedItem.value,
                    category: updatedItem.category,
                    description: updatedItem.description,
                    updated_at: updatedItem.updated_at,
                    updated_by: adminId || null
                });

            if (error) {
                return { success: false, message: `Failed to persist config '${key}': ${error.message}` };
            }

            // Record audit log
            await (supabase.from('admin_audit_logs' as any) as any).insert({
                admin_id: adminId || null,
                action: 'UPDATE_SYSTEM_CONFIG',
                target_entity: 'system_configurations',
                target_id: key,
                details: { key, previous_value: item.value, new_value: value }
            });

            return { success: true, message: `Configuration '${key}' updated successfully!` };
        } catch (err: any) {
            return { success: false, message: `Error updating config '${key}': ${err.message || err}` };
        }
    }

    // Typed Convenience Getters
    public get quizTimerSec(): number { return this.getConfig<number>('quiz_timer_sec', 15); }
    public get questionsPerMatch(): number { return this.getConfig<number>('questions_per_match', 10); }
    public get maxLifelinesPerMatch(): number { return this.getConfig<number>('max_lifelines_per_match', 2); }
    public get dailyLoginCoins(): number { return this.getConfig<number>('daily_login_coins', 100); }
    public get winCoinReward(): number { return this.getConfig<number>('win_coin_reward', 50); }
    public get winXpReward(): number { return this.getConfig<number>('win_xp_reward', 20); }
    public get eloBaseGain(): number { return this.getConfig<number>('elo_base_gain', 25); }
    public get eloBaseLoss(): number { return this.getConfig<number>('elo_base_loss', 15); }
    public get queueTimeoutSec(): number { return this.getConfig<number>('queue_timeout_sec', 30); }
    public get botFallbackEnabled(): boolean { return this.getConfig<boolean>('bot_fallback_enabled', true); }
    public get isMaintenanceMode(): boolean { return this.getConfig<boolean>('maintenance_mode', false); }
    public get maintenanceMessage(): string { return this.getConfig<string>('maintenance_message', 'System maintenance in progress'); }
    public get dailySubPriceEtb(): number { return this.getConfig<number>('daily_sub_price_etb', 2); }
}
