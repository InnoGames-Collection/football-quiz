import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { QUESTION_CATEGORIES } from '../../core/quiz/QuestionCategories';
import { ConfigurationManager, SystemConfigItem } from '../../core/config/ConfigurationManager';
import { AdminService, AdminUserRecord, TelcoRewardItem, AuditLogItem } from '../../networking/api/AdminService';
import { AnalyticsService, PlatformAnalytics } from '../../networking/api/AnalyticsService';
import '../theme/AdminStyles.css';

type AdminTab = 'CONFIGURATIONS' | 'QUESTIONS' | 'DASHBOARD' | 'USERS' | 'TELCO_REWARDS' | 'AUDIT_LOGS';

export class AdminPanelScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onClose: () => void;
    private _activeTab: AdminTab = 'CONFIGURATIONS';
    private _statusMessage: string = '';
    private _statusType: 'success' | 'error' | 'info' = 'info';

    // Data Cache State
    private _analyticsData: PlatformAnalytics | null = null;
    private _questionsList: any[] = [];
    private _questionsTotal: number = 0;
    private _questionPage: number = 1;
    private _questionCategory: string = 'all';
    private _questionSearch: string = '';
    private _usersList: AdminUserRecord[] = [];
    private _userSearchQuery: string = '';
    private _telcoRewards: TelcoRewardItem[] = [];
    private _auditLogs: AuditLogItem[] = [];
    private _configsList: SystemConfigItem[] = [];

    // Modal State
    private _activeModal: 'NONE' | 'EDIT_QUESTION' | 'ADJUST_USER' | 'BROADCAST' = 'NONE';
    private _editingQuestion: any | null = null;
    private _selectedUser: AdminUserRecord | null = null;

    constructor(uiManager: UIManager, audioManager: AudioManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        // Load configurations and initial data
        await ConfigurationManager.getInstance().loadConfigurations();
        this._configsList = ConfigurationManager.getInstance().getAllConfigs();
        this._analyticsData = await AnalyticsService.getInstance().fetchPlatformAnalytics();

        if (this._activeTab === 'QUESTIONS') {
            await this._reloadQuestions();
        } else if (this._activeTab === 'USERS') {
            await this._reloadUsers();
        } else if (this._activeTab === 'TELCO_REWARDS') {
            this._telcoRewards = await AdminService.getInstance().fetchTelcoRewardsQueue();
        } else if (this._activeTab === 'AUDIT_LOGS') {
            this._auditLogs = await AdminService.getInstance().fetchAuditLogs();
        }

        const root = this._uiManager.container;
        root.innerHTML = `
            <div class="admin-portal-root">
                <!-- Sidebar Drawer Navigation -->
                <aside class="admin-sidebar">
                    <div class="admin-sidebar-header">
                        <span style="font-size: 24px;">⚽</span>
                        <div>
                            <div class="admin-sidebar-title">ETHIO QUIZ LEAGUE</div>
                            <div style="font-size: 11px; color: #64748b; font-weight: 700; letter-spacing: 0.5px;">STANDALONE SUPER ADMIN</div>
                        </div>
                    </div>

                    <nav class="admin-sidebar-nav">
                        <button class="admin-nav-item ${this._activeTab === 'CONFIGURATIONS' ? 'active' : ''}" data-tab="CONFIGURATIONS">
                            ⚙️ System Configs
                        </button>
                        <button class="admin-nav-item ${this._activeTab === 'QUESTIONS' ? 'active' : ''}" data-tab="QUESTIONS">
                            ❓ Trilingual Question CMS
                        </button>
                        <button class="admin-nav-item ${this._activeTab === 'DASHBOARD' ? 'active' : ''}" data-tab="DASHBOARD">
                            📊 Executive Analytics
                        </button>
                        <button class="admin-nav-item ${this._activeTab === 'USERS' ? 'active' : ''}" data-tab="USERS">
                            👥 Player Support
                        </button>
                        <button class="admin-nav-item ${this._activeTab === 'TELCO_REWARDS' ? 'active' : ''}" data-tab="TELCO_REWARDS">
                            📡 Telco Rewards Queue
                        </button>
                        <button class="admin-nav-item ${this._activeTab === 'AUDIT_LOGS' ? 'active' : ''}" data-tab="AUDIT_LOGS">
                            📜 System Audit Logs
                        </button>
                    </nav>

                    <div style="padding: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
                        <button id="admin-close-btn" class="admin-btn admin-btn-secondary" style="width: 100%;">
                            🚪 Exit Admin Portal
                        </button>
                    </div>
                </aside>

                <!-- Main Content Area -->
                <div class="admin-main-container">
                    <!-- Executive Top Bar -->
                    <header class="admin-top-bar">
                        <div style="font-weight: 800; font-size: 16px; color: #f8fafc; display: flex; align-items: center; gap: 8px;">
                            ${this._getTabTitleIcon()} ${this._getTabTitleText()}
                        </div>

                        <div class="admin-top-status">
                            ${ConfigurationManager.getInstance().isMaintenanceMode ? `
                                <span class="admin-badge admin-badge-warning">⚠️ MAINTENANCE MODE ACTIVE</span>
                            ` : `
                                <span class="admin-badge admin-badge-success">🟢 SYSTEM OPERATIONAL</span>
                            `}
                            <span class="admin-badge admin-badge-success">⚡ DB Latency: ${this._analyticsData?.avgLatencyMs || 12}ms</span>
                            <span class="admin-badge admin-badge-warning">👑 SUPER ADMIN</span>
                        </div>
                    </header>

                    <!-- Workspace Content -->
                    <main class="admin-content-area">
                        ${this._statusMessage ? `
                            <div class="admin-card" style="
                                border-color: ${this._statusType === 'success' ? 'rgba(16, 185, 129, 0.4)' : this._statusType === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)'};
                                background: ${this._statusType === 'success' ? 'rgba(16, 185, 129, 0.1)' : this._statusType === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
                                color: ${this._statusType === 'success' ? '#34d399' : this._statusType === 'error' ? '#f87171' : '#60a5fa'};
                                margin-bottom: 20px;
                                padding: 14px 20px;
                            ">
                                ${this._statusMessage}
                            </div>
                        ` : ''}

                        ${this._renderActiveTabContent()}
                    </main>
                </div>
            </div>

            ${this._renderModal()}
        `;

        this._bindEvents();
    }

    private _getTabTitleIcon(): string {
        switch (this._activeTab) {
            case 'CONFIGURATIONS': return '⚙️';
            case 'QUESTIONS': return '❓';
            case 'DASHBOARD': return '📊';
            case 'USERS': return '👥';
            case 'TELCO_REWARDS': return '📡';
            case 'AUDIT_LOGS': return '📜';
        }
    }

    private _getTabTitleText(): string {
        switch (this._activeTab) {
            case 'CONFIGURATIONS': return 'System Configurations & Dynamic Game Parameters';
            case 'QUESTIONS': return 'Trilingual Question Bank CMS';
            case 'DASHBOARD': return 'Executive Platform Analytics';
            case 'USERS': return 'Player Support & Customer Operations';
            case 'TELCO_REWARDS': return 'Ethio Telecom Rewards & Payout Queue';
            case 'AUDIT_LOGS': return 'Broadcast Notifications & System Audit Trail';
        }
    }

    private _renderActiveTabContent(): string {
        switch (this._activeTab) {
            case 'CONFIGURATIONS': return this._renderConfigurationsTab();
            case 'QUESTIONS': return this._renderQuestionsTab();
            case 'DASHBOARD': return this._renderDashboardTab();
            case 'USERS': return this._renderUsersTab();
            case 'TELCO_REWARDS': return this._renderTelcoRewardsTab();
            case 'AUDIT_LOGS': return this._renderAuditLogsTab();
        }
    }

    // --- TAB 1: SYSTEM CONFIGURATIONS ---
    private _renderConfigurationsTab(): string {
        const configsByCategory = {
            gameplay: this._configsList.filter(c => c.category === 'gameplay'),
            economy: this._configsList.filter(c => c.category === 'economy'),
            matchmaking: this._configsList.filter(c => c.category === 'matchmaking'),
            system: this._configsList.filter(c => c.category === 'system'),
            telco: this._configsList.filter(c => c.category === 'telco')
        };

        return `
            <div class="admin-card">
                <div class="admin-card-header">
                    <div class="admin-card-title">
                        ⚙️ DYNAMIC GAME & SYSTEM PARAMETERS
                    </div>
                    <span style="font-size: 13px; color: #94a3b8;">No code editing required. Direct database updates.</span>
                </div>

                <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
                    Configure gameplay rules, match timers, reward multipliers, ELO rating formulas, subscription pricing, and maintenance mode controls dynamically across the entire Football Quiz platform.
                </p>

                ${Object.entries(configsByCategory).map(([category, items]) => `
                    <div style="margin-bottom: 28px; background: rgba(0,0,0,0.2); padding: 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                        <h4 style="margin: 0 0 14px 0; text-transform: uppercase; color: #FFD54F; font-size: 13px; letter-spacing: 1px;">
                            ${category} CONFIGURATIONS (${items.length})
                        </h4>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;">
                            ${items.map(item => `
                                <div style="background: rgba(15, 23, 42, 0.8); padding: 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                                    <div style="font-weight: 700; font-size: 14px; color: #f8fafc; margin-bottom: 4px;">
                                        <code>${item.key}</code>
                                    </div>
                                    <div style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">${item.description || 'System setting'}</div>
                                    
                                    <div style="display: flex; gap: 8px;">
                                        ${typeof item.value === 'boolean' ? `
                                            <select class="admin-select config-input" data-key="${item.key}">
                                                <option value="true" ${item.value ? 'selected' : ''}>Enabled (true)</option>
                                                <option value="false" ${!item.value ? 'selected' : ''}>Disabled (false)</option>
                                            </select>
                                        ` : `
                                            <input type="${typeof item.value === 'number' ? 'number' : 'text'}" class="admin-input config-input" data-key="${item.key}" value="${item.value}" />
                                        `}
                                        <button class="admin-btn admin-btn-primary save-config-btn" data-key="${item.key}">
                                            💾 Save
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // --- TAB 2: TRILINGUAL QUESTION CMS ---
    private _renderQuestionsTab(): string {
        const categories = Object.values(QUESTION_CATEGORIES);

        return `
            <div class="admin-card">
                <div class="admin-card-header">
                    <div class="admin-card-title">
                        ❓ TRILINGUAL QUESTION CMS (${this._questionsTotal} TOTAL)
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button id="add-new-question-btn" class="admin-btn admin-btn-primary">
                            ➕ Add Question
                        </button>
                        <button id="export-csv-btn" class="admin-btn admin-btn-secondary">
                            📥 Export CSV
                        </button>
                    </div>
                </div>

                <!-- Filters & Search -->
                <div style="display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px;">
                        <input id="question-search-input" type="text" placeholder="🔍 Search prompts..." class="admin-input" value="${this._questionSearch}" />
                    </div>
                    <div style="width: 200px;">
                        <select id="question-cat-select" class="admin-select">
                            <option value="all">All Categories</option>
                            ${categories.map(c => `<option value="${c.id}" ${this._questionCategory === c.id ? 'selected' : ''}>${c.badge} ${c.nameEn}</option>`).join('')}
                        </select>
                    </div>
                    <button id="question-filter-btn" class="admin-btn admin-btn-secondary">
                        Filter
                    </button>
                </div>

                <!-- Questions Table -->
                <div class="admin-table-wrapper">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Difficulty</th>
                                <th>Prompt (English)</th>
                                <th>Amharic Prompt</th>
                                <th>Afan Oromo Prompt</th>
                                <th>Correct Index</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this._questionsList.length === 0 ? `
                                <tr>
                                    <td colspan="7" style="text-align: center; color: #94a3b8; padding: 24px;">
                                        No questions found in cloud database. Click 'Add Question' or import CSV below.
                                    </td>
                                </tr>
                            ` : this._questionsList.map(q => `
                                <tr>
                                    <td><span class="admin-badge admin-badge-warning">${q.category}</span></td>
                                    <td>Level ${q.difficulty}</td>
                                    <td style="font-weight: 600; max-width: 250px;">${q.prompt_en}</td>
                                    <td style="color: #94a3b8; max-width: 200px;">${q.prompt_am || '—'}</td>
                                    <td style="color: #94a3b8; max-width: 200px;">${q.prompt_om || '—'}</td>
                                    <td><span class="admin-badge admin-badge-success">Option ${q.correct_index + 1}</span></td>
                                    <td>
                                        <div style="display: flex; gap: 6px;">
                                            <button class="admin-btn admin-btn-secondary edit-q-btn" data-id="${q.id}" style="padding: 4px 8px; font-size: 12px;">✏️</button>
                                            <button class="admin-btn admin-btn-danger delete-q-btn" data-id="${q.id}" style="padding: 4px 8px; font-size: 12px;">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Bulk CSV Import Card -->
                <div style="margin-top: 24px; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                    <h4 style="margin: 0 0 8px 0; color: #FFD54F;">📂 BULK CSV QUESTION IMPORT</h4>
                    <p style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">
                        Paste CSV lines formatted as:<br/>
                        <code>category, difficulty, prompt_en, opt0_en, opt1_en, opt2_en, opt3_en, correct_index, prompt_am, prompt_om</code>
                    </p>
                    <textarea id="bulk-csv-text" class="admin-textarea" rows="4" placeholder="walia-ibex,1,Which country hosted 2022 World Cup?,Qatar,Brazil,Russia,Spain,0"></textarea>
                    <div style="margin-top: 10px; text-align: right;">
                        <button id="import-csv-submit-btn" class="admin-btn admin-btn-primary">
                            🚀 Process & Import Questions
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB 3: EXECUTIVE DASHBOARD ---
    private _renderDashboardTab(): string {
        const stats = this._analyticsData || {
            activePlayers: 124500,
            totalMatches: 1850000,
            activeCompetitions: 15,
            subscribedUsers: 88200,
            smsOtpSuccessRate: '99.4%',
            avgLatencyMs: 12
        };

        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div class="admin-card" style="border-color: rgba(16, 185, 129, 0.3);">
                    <div style="font-size: 12px; color: #94a3b8; font-weight: 700;">TOTAL REGISTERED PLAYERS</div>
                    <div style="font-size: 28px; font-weight: 900; color: #34d399; margin-top: 6px;">
                        ${stats.activePlayers.toLocaleString()}
                    </div>
                </div>

                <div class="admin-card" style="border-color: rgba(255, 213, 79, 0.3);">
                    <div style="font-size: 12px; color: #94a3b8; font-weight: 700;">TOTAL MATCHES PLAYED</div>
                    <div style="font-size: 28px; font-weight: 900; color: #FFD54F; margin-top: 6px;">
                        ${stats.totalMatches.toLocaleString()}
                    </div>
                </div>

                <div class="admin-card" style="border-color: rgba(59, 130, 246, 0.3);">
                    <div style="font-size: 12px; color: #94a3b8; font-weight: 700;">ACTIVE LEAGUES & COMPS</div>
                    <div style="font-size: 28px; font-weight: 900; color: #60a5fa; margin-top: 6px;">
                        ${stats.activeCompetitions}
                    </div>
                </div>

                <div class="admin-card" style="border-color: rgba(192, 132, 252, 0.3);">
                    <div style="font-size: 12px; color: #94a3b8; font-weight: 700;">ETHIO TELECOM SUBSCRIBERS</div>
                    <div style="font-size: 28px; font-weight: 900; color: #C084FC; margin-top: 6px;">
                        ${stats.subscribedUsers.toLocaleString()}
                    </div>
                </div>
            </div>

            <div class="admin-card">
                <div class="admin-card-title">📡 ETHIO TELECOM VAS PLATFORM HEALTH</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 16px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px;">
                        <div style="font-size: 12px; color: #94a3b8;">SMS OTP GATEWAY</div>
                        <div style="font-size: 20px; font-weight: 800; color: #34d399; margin-top: 4px;">${stats.smsOtpSuccessRate} Success</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px;">
                        <div style="font-size: 12px; color: #94a3b8;">DATABASE RESPONSE LATENCY</div>
                        <div style="font-size: 20px; font-weight: 800; color: #34d399; margin-top: 4px;">${stats.avgLatencyMs} ms</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px;">
                        <div style="font-size: 12px; color: #94a3b8;">DAILY VAS PRICE</div>
                        <div style="font-size: 20px; font-weight: 800; color: #FFD54F; margin-top: 4px;">${ConfigurationManager.getInstance().dailySubPriceEtb} ETB / day</div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- TAB 4: PLAYER SUPPORT & USER MANAGEMENT ---
    private _renderUsersTab(): string {
        return `
            <div class="admin-card">
                <div class="admin-card-header">
                    <div class="admin-card-title">👥 PLAYER SUPPORT & USER OPS</div>
                </div>

                <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                    <input id="user-search-input" class="admin-input" type="text" placeholder="🔍 Search player by phone / MSISDN / username..." value="${this._userSearchQuery}" />
                    <button id="user-search-btn" class="admin-btn admin-btn-primary">Search Players</button>
                </div>

                <div class="admin-table-wrapper">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Phone (MSISDN)</th>
                                <th>Role</th>
                                <th>ELO Rating</th>
                                <th>Coins</th>
                                <th>XP</th>
                                <th>Subscription</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this._usersList.length === 0 ? `
                                <tr>
                                    <td colspan="8" style="text-align: center; color: #94a3b8; padding: 24px;">
                                        Enter username or phone number above to inspect player profiles.
                                    </td>
                                </tr>
                            ` : this._usersList.map(u => `
                                <tr>
                                    <td style="font-weight: 700;">${u.username}</td>
                                    <td>${u.phone || '—'}</td>
                                    <td><span class="admin-badge ${u.role === 'super_admin' ? 'admin-badge-warning' : 'admin-badge-success'}">${u.role}</span></td>
                                    <td style="color: #FFD54F; font-weight: 700;">${u.elo_rating}</td>
                                    <td>🪙 ${u.coins}</td>
                                    <td>⭐ ${u.xp}</td>
                                    <td><span class="admin-badge admin-badge-success">${u.subscription_tier || 'free'}</span></td>
                                    <td>
                                        <button class="admin-btn admin-btn-secondary adjust-user-btn" data-id="${u.id}" style="padding: 4px 8px; font-size: 12px;">
                                            ⚙️ Adjust Balance
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // --- TAB 5: TELCO REWARDS QUEUE ---
    private _renderTelcoRewardsTab(): string {
        return `
            <div class="admin-card">
                <div class="admin-card-header">
                    <div class="admin-card-title">📡 TELCO REWARDS PAYOUT QUEUE (${this._telcoRewards.length})</div>
                </div>

                <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">
                    Monitor weekly/monthly airtime disbursements queued for top leaderboard players.
                </p>

                <div class="admin-table-wrapper">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>MSISDN (Phone)</th>
                                <th>Reward Type</th>
                                <th>Amount (ETB)</th>
                                <th>Leaderboard Rank</th>
                                <th>Status</th>
                                <th>Queued At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this._telcoRewards.length === 0 ? `
                                <tr>
                                    <td colspan="7" style="text-align: center; color: #94a3b8; padding: 24px;">
                                        No pending telco reward disbursements.
                                    </td>
                                </tr>
                            ` : this._telcoRewards.map(r => `
                                <tr>
                                    <td style="font-weight: 700;">${r.msisdn}</td>
                                    <td>${r.reward_type}</td>
                                    <td style="color: #34d399; font-weight: 800;">${r.reward_amount} ETB</td>
                                    <td>Rank #${r.rank_position}</td>
                                    <td>
                                        <span class="admin-badge ${r.status === 'completed' ? 'admin-badge-success' : r.status === 'failed' ? 'admin-badge-danger' : 'admin-badge-warning'}">
                                            ${r.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style="font-size: 12px; color: #94a3b8;">${new Date(r.created_at).toLocaleString()}</td>
                                    <td>
                                        ${r.status === 'failed' || r.status === 'pending' ? `
                                            <button class="admin-btn admin-btn-secondary retry-telco-btn" data-id="${r.id}" style="padding: 4px 8px; font-size: 12px;">
                                                🔄 Retry Payout
                                            </button>
                                        ` : '—'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // --- TAB 6: AUDIT LOGS & BROADCAST NOTIFICATIONS ---
    private _renderAuditLogsTab(): string {
        return `
            <!-- Broadcast Card -->
            <div class="admin-card">
                <div class="admin-card-header">
                    <div class="admin-card-title">📣 BROADCAST PUSH NOTIFICATION</div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <input id="bc-title-en" class="admin-input" placeholder="Title (English) *" />
                    <input id="bc-title-am" class="admin-input" placeholder="Title (Amharic - አማርኛ)" />
                    <input id="bc-title-om" class="admin-input" placeholder="Title (Afan Oromo)" />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                    <textarea id="bc-body-en" class="admin-textarea" rows="2" placeholder="Message body (English) *"></textarea>
                    <textarea id="bc-body-am" class="admin-textarea" rows="2" placeholder="Message body (Amharic)"></textarea>
                    <textarea id="bc-body-om" class="admin-textarea" rows="2" placeholder="Message body (Afan Oromo)"></textarea>
                </div>
                <button id="send-broadcast-btn" class="admin-btn admin-btn-primary" style="width: 100%;">
                    🚀 Send Broadcast to All Players
                </button>
            </div>

            <!-- Audit Trail Table -->
            <div class="admin-card">
                <div class="admin-card-header">
                    <div class="admin-card-title">📜 SUPER ADMIN AUDIT TRAIL (${this._auditLogs.length})</div>
                </div>

                <div class="admin-table-wrapper">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Action</th>
                                <th>Target Entity</th>
                                <th>Target ID</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this._auditLogs.length === 0 ? `
                                <tr>
                                    <td colspan="5" style="text-align: center; color: #94a3b8; padding: 24px;">
                                        No audit entries recorded yet.
                                    </td>
                                </tr>
                            ` : this._auditLogs.map(l => `
                                <tr>
                                    <td style="font-size: 12px; color: #94a3b8;">${new Date(l.created_at).toLocaleString()}</td>
                                    <td><span class="admin-badge admin-badge-warning">${l.action}</span></td>
                                    <td><code>${l.target_entity}</code></td>
                                    <td>${l.target_id || '—'}</td>
                                    <td style="font-family: monospace; font-size: 11px; color: #94a3b8; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                        ${JSON.stringify(l.details || {})}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // --- MODAL DIALOG RENDERER ---
    private _renderModal(): string {
        if (this._activeModal === 'NONE') return '';

        if (this._activeModal === 'EDIT_QUESTION') {
            const q = this._editingQuestion || {};
            const isNew = !q.id;
            const categories = Object.values(QUESTION_CATEGORIES);

            return `
                <div class="admin-modal-overlay">
                    <div class="admin-modal-container">
                        <h3 style="margin: 0 0 16px 0; color: #FFD54F;">
                            ${isNew ? '➕ ADD NEW TRILINGUAL QUESTION' : '✏️ EDIT TRILINGUAL QUESTION'}
                        </h3>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                            <div>
                                <label class="admin-label">Category</label>
                                <select id="modal-q-cat" class="admin-select">
                                    ${categories.map(c => `<option value="${c.id}" ${q.category === c.id ? 'selected' : ''}>${c.nameEn}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="admin-label">Difficulty (1-5)</label>
                                <input id="modal-q-diff" type="number" min="1" max="5" class="admin-input" value="${q.difficulty || 2}" />
                            </div>
                        </div>

                        <div class="admin-input-group">
                            <label class="admin-label">English Prompt *</label>
                            <input id="modal-q-prompt-en" class="admin-input" value="${q.prompt_en || ''}" placeholder="e.g. Who won AFCON 1962?" />
                        </div>
                        <div class="admin-input-group">
                            <label class="admin-label">Amharic Prompt (አማርኛ)</label>
                            <input id="modal-q-prompt-am" class="admin-input" value="${q.prompt_am || ''}" placeholder="የ1962 አፍሪካ ዋንጫ ያሸነፈው ማን ነው?" />
                        </div>
                        <div class="admin-input-group">
                            <label class="admin-label">Afan Oromo Prompt</label>
                            <input id="modal-q-prompt-om" class="admin-input" value="${q.prompt_om || ''}" placeholder="Waancaa AFCON 1962 kan injifate kimmi?" />
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
                            <div>
                                <label class="admin-label">Option 1 (Index 0)</label>
                                <input id="modal-q-opt0" class="admin-input" value="${q.options_en ? q.options_en[0] || '' : ''}" />
                            </div>
                            <div>
                                <label class="admin-label">Option 2 (Index 1)</label>
                                <input id="modal-q-opt1" class="admin-input" value="${q.options_en ? q.options_en[1] || '' : ''}" />
                            </div>
                            <div>
                                <label class="admin-label">Option 3 (Index 2)</label>
                                <input id="modal-q-opt2" class="admin-input" value="${q.options_en ? q.options_en[2] || '' : ''}" />
                            </div>
                            <div>
                                <label class="admin-label">Option 4 (Index 3)</label>
                                <input id="modal-q-opt3" class="admin-input" value="${q.options_en ? q.options_en[3] || '' : ''}" />
                            </div>
                        </div>

                        <div class="admin-input-group" style="margin-bottom: 20px;">
                            <label class="admin-label">Correct Option Index</label>
                            <select id="modal-q-correct" class="admin-select">
                                <option value="0" ${q.correct_index === 0 ? 'selected' : ''}>Option 1 (Index 0)</option>
                                <option value="1" ${q.correct_index === 1 ? 'selected' : ''}>Option 2 (Index 1)</option>
                                <option value="2" ${q.correct_index === 2 ? 'selected' : ''}>Option 3 (Index 2)</option>
                                <option value="3" ${q.correct_index === 3 ? 'selected' : ''}>Option 4 (Index 3)</option>
                            </select>
                        </div>

                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button id="modal-cancel-btn" class="admin-btn admin-btn-secondary">Cancel</button>
                            <button id="modal-save-q-btn" class="admin-btn admin-btn-primary">Save Question</button>
                        </div>
                    </div>
                </div>
            `;
        }

        if (this._activeModal === 'ADJUST_USER') {
            const u = this._selectedUser;
            if (!u) return '';

            return `
                <div class="admin-modal-overlay">
                    <div class="admin-modal-container">
                        <h3 style="margin: 0 0 16px 0; color: #FFD54F;">⚙️ ADJUST BALANCE — ${u.username}</h3>
                        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 16px;">
                            Current Balance: 🪙 ${u.coins} Coins | ⭐ ${u.xp} XP
                        </p>

                        <div class="admin-input-group">
                            <label class="admin-label">Coins Delta (e.g. +500 or -100)</label>
                            <input id="user-coins-delta" type="number" class="admin-input" value="0" />
                        </div>
                        <div class="admin-input-group">
                            <label class="admin-label">XP Delta (e.g. +200)</label>
                            <input id="user-xp-delta" type="number" class="admin-input" value="0" />
                        </div>
                        <div class="admin-input-group" style="margin-bottom: 20px;">
                            <label class="admin-label">Audit Reason *</label>
                            <input id="user-adjust-reason" class="admin-input" placeholder="e.g. Customer support compensation for network error" />
                        </div>

                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button id="modal-cancel-btn" class="admin-btn admin-btn-secondary">Cancel</button>
                            <button id="save-user-adjust-btn" class="admin-btn admin-btn-primary">Apply Adjustment</button>
                        </div>
                    </div>
                </div>
            `;
        }

        return '';
    }

    // --- DATA RELOAD HELPERS ---
    private async _reloadQuestions(): Promise<void> {
        const result = await AdminService.getInstance().fetchQuestions({
            category: this._questionCategory,
            searchQuery: this._questionSearch,
            page: this._questionPage,
            limit: 20
        });
        this._questionsList = result.questions;
        this._questionsTotal = result.totalCount;
    }

    private async _reloadUsers(): Promise<void> {
        this._usersList = await AdminService.getInstance().searchUsers(this._userSearchQuery);
    }

    // --- EVENT BINDINGS ---
    private _bindEvents(): void {
        const root = this._uiManager.container;

        // Close Admin Portal
        root.querySelector('#admin-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        // Tab Switching
        root.querySelectorAll('.admin-nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this._audioManager.playClick();
                const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as AdminTab;
                if (tab) {
                    this._activeTab = tab;
                    this._statusMessage = '';
                    this.render();
                }
            });
        });

        // Save System Configuration Parameter
        root.querySelectorAll('.save-config-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                this._audioManager.playClick();
                const key = (e.currentTarget as HTMLElement).getAttribute('data-key');
                if (!key) return;

                const inputEl = root.querySelector(`.config-input[data-key="${key}"]`) as HTMLInputElement | HTMLSelectElement;
                if (!inputEl) return;

                let val: any = inputEl.value;
                if (val === 'true') val = true;
                else if (val === 'false') val = false;
                else if (!isNaN(Number(val)) && val.trim() !== '') val = Number(val);

                const res = await ConfigurationManager.getInstance().updateConfig(key, val);
                this._statusMessage = res.message;
                this._statusType = res.success ? 'success' : 'error';
                this.render();
            });
        });

        // Question Filter & Search
        root.querySelector('#question-filter-btn')?.addEventListener('click', async () => {
            this._audioManager.playClick();
            this._questionSearch = (root.querySelector('#question-search-input') as HTMLInputElement)?.value.trim() || '';
            this._questionCategory = (root.querySelector('#question-cat-select') as HTMLSelectElement)?.value || 'all';
            this._questionPage = 1;
            await this._reloadQuestions();
            this.render();
        });

        // Add Question Modal Trigger
        root.querySelector('#add-new-question-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._editingQuestion = null;
            this._activeModal = 'EDIT_QUESTION';
            this.render();
        });

        // Edit Question Modal Trigger
        root.querySelectorAll('.edit-q-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this._audioManager.playClick();
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                const q = this._questionsList.find(item => item.id === id);
                if (q) {
                    this._editingQuestion = q;
                    this._activeModal = 'EDIT_QUESTION';
                    this.render();
                }
            });
        });

        // Delete Question Handler
        root.querySelectorAll('.delete-q-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                this._audioManager.playClick();
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                if (id && confirm('Are you sure you want to delete this question?')) {
                    const res = await AdminService.getInstance().deleteQuestion(id);
                    this._statusMessage = res.message;
                    this._statusType = res.success ? 'success' : 'error';
                    await this._reloadQuestions();
                    this.render();
                }
            });
        });

        // Modal Save Question Handler
        root.querySelector('#modal-save-q-btn')?.addEventListener('click', async () => {
            this._audioManager.playClick();
            const category = (root.querySelector('#modal-q-cat') as HTMLSelectElement)?.value;
            const difficulty = parseInt((root.querySelector('#modal-q-diff') as HTMLInputElement)?.value || '2', 10);
            const promptEn = (root.querySelector('#modal-q-prompt-en') as HTMLInputElement)?.value.trim();
            const promptAm = (root.querySelector('#modal-q-prompt-am') as HTMLInputElement)?.value.trim();
            const promptOm = (root.querySelector('#modal-q-prompt-om') as HTMLInputElement)?.value.trim();
            const opt0 = (root.querySelector('#modal-q-opt0') as HTMLInputElement)?.value.trim();
            const opt1 = (root.querySelector('#modal-q-opt1') as HTMLInputElement)?.value.trim();
            const opt2 = (root.querySelector('#modal-q-opt2') as HTMLInputElement)?.value.trim();
            const opt3 = (root.querySelector('#modal-q-opt3') as HTMLInputElement)?.value.trim();
            const correctIndex = parseInt((root.querySelector('#modal-q-correct') as HTMLSelectElement)?.value || '0', 10);

            if (!promptEn || !opt0 || !opt1 || !opt2 || !opt3) {
                alert('Please fill in English prompt and all 4 options.');
                return;
            }

            const payload: any = {
                category,
                difficulty,
                competition_id: category,
                prompt_en: promptEn,
                prompt_am: promptAm || null,
                prompt_om: promptOm || null,
                options_en: [opt0, opt1, opt2, opt3],
                correct_index: correctIndex,
                is_active: true
            };

            if (this._editingQuestion?.id) {
                payload.id = this._editingQuestion.id;
            }

            const res = await AdminService.getInstance().saveQuestion(payload);
            this._statusMessage = res.message;
            this._statusType = res.success ? 'success' : 'error';
            this._activeModal = 'NONE';
            await this._reloadQuestions();
            this.render();
        });

        // Bulk CSV Import Trigger
        root.querySelector('#import-csv-submit-btn')?.addEventListener('click', async () => {
            this._audioManager.playClick();
            const text = (root.querySelector('#bulk-csv-text') as HTMLTextAreaElement)?.value.trim();
            if (!text) {
                this._statusMessage = 'Please enter CSV data to import.';
                this._statusType = 'error';
                this.render();
                return;
            }

            const result = await AdminService.getInstance().bulkImportCsv(text);
            this._statusMessage = `Bulk import complete: ${result.successCount} questions imported successfully (${result.errorCount} failed).`;
            this._statusType = result.successCount > 0 ? 'success' : 'error';
            await this._reloadQuestions();
            this.render();
        });

        // User Search Handler
        root.querySelector('#user-search-btn')?.addEventListener('click', async () => {
            this._audioManager.playClick();
            this._userSearchQuery = (root.querySelector('#user-search-input') as HTMLInputElement)?.value.trim() || '';
            await this._reloadUsers();
            this.render();
        });

        // Adjust User Balance Trigger
        root.querySelectorAll('.adjust-user-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this._audioManager.playClick();
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                const u = this._usersList.find(item => item.id === id);
                if (u) {
                    this._selectedUser = u;
                    this._activeModal = 'ADJUST_USER';
                    this.render();
                }
            });
        });

        // Save User Adjustment Modal Handler
        root.querySelector('#save-user-adjust-btn')?.addEventListener('click', async () => {
            this._audioManager.playClick();
            if (!this._selectedUser) return;

            const coinsDelta = parseInt((root.querySelector('#user-coins-delta') as HTMLInputElement)?.value || '0', 10);
            const xpDelta = parseInt((root.querySelector('#user-xp-delta') as HTMLInputElement)?.value || '0', 10);
            const reason = (root.querySelector('#user-adjust-reason') as HTMLInputElement)?.value.trim();

            if (!reason) {
                alert('An audit reason is required for manual balance adjustments.');
                return;
            }

            const res = await AdminService.getInstance().updateUserCoinsAndXp(this._selectedUser.id, coinsDelta, xpDelta, reason);
            this._statusMessage = res.message;
            this._statusType = res.success ? 'success' : 'error';
            this._activeModal = 'NONE';
            await this._reloadUsers();
            this.render();
        });

        // Retry Telco Reward Handler
        root.querySelectorAll('.retry-telco-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                this._audioManager.playClick();
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                if (id) {
                    const res = await AdminService.getInstance().retryTelcoDisbursement(id);
                    this._statusMessage = res.message;
                    this._statusType = res.success ? 'success' : 'error';
                    this._telcoRewards = await AdminService.getInstance().fetchTelcoRewardsQueue();
                    this.render();
                }
            });
        });

        // Send Broadcast Notification
        root.querySelector('#send-broadcast-btn')?.addEventListener('click', async () => {
            this._audioManager.playClick();
            const titleEn = (root.querySelector('#bc-title-en') as HTMLInputElement)?.value.trim();
            const titleAm = (root.querySelector('#bc-title-am') as HTMLInputElement)?.value.trim();
            const titleOm = (root.querySelector('#bc-title-om') as HTMLInputElement)?.value.trim();
            const bodyEn = (root.querySelector('#bc-body-en') as HTMLTextAreaElement)?.value.trim();
            const bodyAm = (root.querySelector('#bc-body-am') as HTMLTextAreaElement)?.value.trim();
            const bodyOm = (root.querySelector('#bc-body-om') as HTMLTextAreaElement)?.value.trim();

            if (!titleEn || !bodyEn) {
                alert('Please enter English title and body for the broadcast notification.');
                return;
            }

            const res = await AdminService.getInstance().sendBroadcastNotification({
                titleEn, titleAm, titleOm, bodyEn, bodyAm, bodyOm, category: 'system'
            });
            this._statusMessage = res.message;
            this._statusType = res.success ? 'success' : 'error';
            this._auditLogs = await AdminService.getInstance().fetchAuditLogs();
            this.render();
        });

        // Modal Cancel Handler
        root.querySelector('#modal-cancel-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._activeModal = 'NONE';
            this.render();
        });
    }
}
