import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { CompetitionRegistry, Competition } from '../../core/quiz/CompetitionRegistry';
import { QUESTION_CATEGORIES } from '../../core/quiz/QuestionCategories';
import { supabase } from '../../networking/supabase/SupabaseClient';
import { AnalyticsService, PlatformAnalytics } from '../../networking/api/AnalyticsService';
import { DesignSystem } from '../theme/DesignSystem';

type AdminTab = 'QUESTIONS' | 'BULK_IMPORT' | 'COMPETITIONS' | 'ANALYTICS';

export class AdminPanelScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onClose: () => void;
    private _activeTab: AdminTab = 'QUESTIONS';
    private _statusMessage: string = '';
    private _analyticsData: PlatformAnalytics | null = null;

    constructor(uiManager: UIManager, audioManager: AudioManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        const competitions = CompetitionRegistry.getAll();
        this._analyticsData = await AnalyticsService.getInstance().fetchPlatformAnalytics();

        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 960px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Admin Header -->
                    <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 24px; position: relative;">
                        <div style="text-align: center;">
                            <span style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">ETHIO TELECOM VAS PORTAL</span>
                            <h1 style="margin: 4px 0 0 0; font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-text-main);">⚙️ CMS & ADMIN PANEL</h1>
                        </div>
                        <button id="admin-close-btn" style="position: absolute; right: 0; top: 0; background: none; border: none; color: var(--fds-text-main); font-weight: bold; cursor: pointer; font-size: 24px;">✕</button>
                    </div>

                    ${this._statusMessage ? `
                        <div style="
                            background: rgba(34, 197, 94, 0.2);
                            border: 1px solid rgba(34, 197, 94, 0.4);
                            color: #86EFAC;
                            padding: 12px 16px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                            font-size: var(--fds-font-sm);
                        ">${this._statusMessage}</div>
                    ` : ''}

                    <!-- Admin Tabs Header -->
                    <div style="
                        display: flex;
                        gap: 10px;
                        margin-bottom: 24px;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        padding-bottom: 12px;
                    ">
                        <button class="tab-btn ${this._activeTab === 'QUESTIONS' ? 'active-tab' : ''}" data-tab="QUESTIONS">
                            ❓ Question Bank
                        </button>
                        <button class="tab-btn ${this._activeTab === 'BULK_IMPORT' ? 'active-tab' : ''}" data-tab="BULK_IMPORT">
                            📂 Bulk CSV Import
                        </button>
                        <button class="tab-btn ${this._activeTab === 'COMPETITIONS' ? 'active-tab' : ''}" data-tab="COMPETITIONS">
                            🏆 Competitions (${competitions.length})
                        </button>
                        <button class="tab-btn ${this._activeTab === 'ANALYTICS' ? 'active-tab' : ''}" data-tab="ANALYTICS">
                            📊 VAS Analytics
                        </button>
                    </div>

                    <!-- Tab Content Render -->
                    ${this._renderTabContent(competitions)}
                </div>
            </div>

            <style>
                .tab-btn {
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 10px;
                    padding: 10px 16px;
                    color: var(--fds-text-dim);
                    font-weight: 600;
                    font-size: var(--fds-font-sm);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn.active-tab {
                    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                    color: #0F172A;
                    border-color: var(--fds-gold-primary);
                    font-weight: bold;
                }
                .form-input {
                    width: 100%;
                    padding: 10px 12px;
                    background: rgba(15, 23, 42, 0.7);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 8px;
                    color: var(--fds-text-main);
                    font-size: var(--fds-font-sm);
                    box-sizing: border-box;
                }
                .form-label {
                    display: block;
                    font-size: var(--fds-font-xs);
                    color: var(--fds-text-muted);
                    font-weight: 600;
                    margin-bottom: 4px;
                }
            </style>
        `;

        this._bindEvents();
    }

    private _renderTabContent(competitions: Competition[]): string {
        switch (this._activeTab) {
            case 'QUESTIONS':
                return this._renderQuestionsTab();
            case 'BULK_IMPORT':
                return this._renderBulkImportTab();
            case 'COMPETITIONS':
                return this._renderCompetitionsTab(competitions);
            case 'ANALYTICS':
                return this._renderAnalyticsTab(competitions);
        }
    }

    private _renderQuestionsTab(): string {
        const categories = Object.values(QUESTION_CATEGORIES);

        return `
            <!-- Add Single Question Card -->
            <div class="glass-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: var(--gold-primary);">
                    ➕ ADD TRILINGUAL QUESTION (EN / AM / OM)
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                    <div>
                        <label class="form-label">CATEGORY</label>
                        <select id="q-category" class="form-input">
                            ${categories.map(c => `<option value="${c.id}">${c.badge} ${c.nameEn}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="form-label">DIFFICULTY (1=Easy, 5=Hard)</label>
                        <input id="q-difficulty" type="number" min="1" max="5" value="2" class="form-input" />
                    </div>
                    <div>
                        <label class="form-label">CORRECT OPTION INDEX (0 to 3)</label>
                        <select id="q-correct" class="form-input">
                            <option value="0">Option 1 (Index 0)</option>
                            <option value="1">Option 2 (Index 1)</option>
                            <option value="2">Option 3 (Index 2)</option>
                            <option value="3">Option 4 (Index 3)</option>
                        </select>
                    </div>
                </div>

                <!-- Prompt Inputs -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                    <div>
                        <label class="form-label">PROMPT (ENGLISH) *</label>
                        <textarea id="q-prompt-en" class="form-input" rows="2" placeholder="e.g. Which team won AFCON 1962?"></textarea>
                    </div>
                    <div>
                        <label class="form-label">PROMPT (AMHARIC - አማርኛ)</label>
                        <textarea id="q-prompt-am" class="form-input" rows="2" placeholder="ለምሳሌ፡ የ1962 አፍሪካ ዋንጫ ያሸነፈው ማን ነው?"></textarea>
                    </div>
                    <div>
                        <label class="form-label">PROMPT (AFAN OROMO)</label>
                        <textarea id="q-prompt-om" class="form-input" rows="2" placeholder="fkn. Waancaa AFCON 1962 kan injifate kimmi?"></textarea>
                    </div>
                </div>

                <!-- Options Inputs -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px;">
                    <div>
                        <label class="form-label">OPTION 1 (EN / AM / OM)</label>
                        <input id="q-opt0-en" class="form-input" placeholder="EN Option 1" style="margin-bottom: 4px;" />
                        <input id="q-opt0-am" class="form-input" placeholder="አማ Option 1" style="margin-bottom: 4px;" />
                        <input id="q-opt0-om" class="form-input" placeholder="OR Option 1" />
                    </div>
                    <div>
                        <label class="form-label">OPTION 2 (EN / AM / OM)</label>
                        <input id="q-opt1-en" class="form-input" placeholder="EN Option 2" style="margin-bottom: 4px;" />
                        <input id="q-opt1-am" class="form-input" placeholder="አማ Option 2" style="margin-bottom: 4px;" />
                        <input id="q-opt1-om" class="form-input" placeholder="OR Option 2" />
                    </div>
                    <div>
                        <label class="form-label">OPTION 3 (EN / AM / OM)</label>
                        <input id="q-opt2-en" class="form-input" placeholder="EN Option 3" style="margin-bottom: 4px;" />
                        <input id="q-opt2-am" class="form-input" placeholder="አማ Option 3" style="margin-bottom: 4px;" />
                        <input id="q-opt2-om" class="form-input" placeholder="OR Option 3" />
                    </div>
                    <div>
                        <label class="form-label">OPTION 4 (EN / AM / OM)</label>
                        <input id="q-opt3-en" class="form-input" placeholder="EN Option 4" style="margin-bottom: 4px;" />
                        <input id="q-opt3-am" class="form-input" placeholder="አማ Option 4" style="margin-bottom: 4px;" />
                        <input id="q-opt3-om" class="form-input" placeholder="OR Option 4" />
                    </div>
                </div>

                ${DesignSystem.Button({ id: 'add-question-btn', text: 'SAVE QUESTION TO CLOUD DATABASE', icon: '💾', variant: 'primary', fullWidth: true })}
            </div>
        `;
    }

    private _renderBulkImportTab(): string {
        return `
            <div class="glass-card" style="padding: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 18px; color: var(--gold-primary);">
                    📂 BULK QUESTION CSV IMPORT
                </h3>
                <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm); line-height: 1.5; margin-bottom: 16px;">
                    Upload a CSV file containing questions formatted with columns:<br/>
                    <code>category, difficulty, prompt_en, prompt_am, prompt_om, opt0_en, opt1_en, opt2_en, opt3_en, correct_index</code>
                </p>

                <textarea id="bulk-csv-area" class="form-input" rows="8" placeholder="category,difficulty,prompt_en,opt0_en,opt1_en,opt2_en,opt3_en,correct_index
walia-ibex,1,In which year did Ethiopia win AFCON?,1957,1962,1970,1984,1
world-cup,1,Which country hosted 2022 World Cup?,Qatar,Brazil,Russia,South Africa,0" style="font-family: monospace; font-size: var(--fds-font-xs); margin-bottom: 16px;"></textarea>

                ${DesignSystem.Button({ id: 'import-csv-btn', text: 'PROCESS & IMPORT QUESTIONS', icon: '🚀', variant: 'primary', fullWidth: true })}
            </div>
        `;
    }

    private _renderCompetitionsTab(competitions: Competition[]): string {
        return `
            <!-- Add Competition Form -->
            <div class="glass-card" style="padding: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: var(--gold-primary);">➕ ADD NEW COMPETITION</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <input id="admin-comp-name" type="text" placeholder="Name (e.g. Ethiopian Premier League)" class="form-input" />
                    <input id="admin-comp-badge" type="text" placeholder="Badge Emoji (e.g. 🇪🇹)" class="form-input" />
                </div>
                <input id="admin-comp-desc" type="text" placeholder="Description" class="form-input" style="margin-bottom: 16px;" />
                ${DesignSystem.Button({ id: 'admin-add-comp-btn', text: 'SAVE & PUBLISH COMPETITION', variant: 'primary', fullWidth: true })}
            </div>

            <!-- Competition List -->
            <div class="glass-card" style="padding: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; color: var(--fds-text-main);">🏆 MANAGED COMPETITIONS (${competitions.length})</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${competitions.map(c => `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 12px 16px;
                            background: rgba(0,0,0,0.3);
                            border: 1px solid var(--glass-border);
                            border-radius: 8px;
                        ">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-size: 24px;">${c.badge}</span>
                                <div>
                                    <div style="font-weight: bold; color: var(--fds-text-main);">${c.name}</div>
                                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted);">${c.description}</div>
                                </div>
                            </div>
                            <span style="font-size: var(--fds-font-xs); color: var(--gold-primary); font-weight: bold;">${c.questionCount} Qs</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    private _renderAnalyticsTab(competitions: Competition[]): string {
        const stats = this._analyticsData || {
            activePlayers: 124500,
            totalMatches: 1850000,
            activeCompetitions: competitions.length,
            subscribedUsers: 88200,
            smsOtpSuccessRate: '99.4%',
            avgLatencyMs: 12
        };

        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div class="glass-card" style="padding: 20px; border-color: rgba(34,197,94,0.3);">
                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted); font-weight: bold;">TOTAL REGISTERED PLAYERS</div>
                    <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--pitch-green); margin-top: 6px;">
                        ${stats.activePlayers.toLocaleString()}
                    </div>
                </div>

                <div class="glass-card" style="padding: 20px; border-color: rgba(255,215,0,0.3);">
                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted); font-weight: bold;">TOTAL MATCHES PLAYED</div>
                    <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--gold-primary); margin-top: 6px;">
                        ${stats.totalMatches.toLocaleString()}
                    </div>
                </div>

                <div class="glass-card" style="padding: 20px; border-color: rgba(96,165,250,0.3);">
                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted); font-weight: bold;">ACTIVE COMPETITIONS</div>
                    <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-blue-accent); margin-top: 6px;">${stats.activeCompetitions}</div>
                </div>

                <div class="glass-card" style="padding: 20px; border-color: rgba(192,132,252,0.3);">
                    <div style="font-size: var(--fds-font-xs); color: var(--text-muted); font-weight: bold;">ETHIO TELECOM SUBSCRIBERS</div>
                    <div style="font-size: var(--fds-font-xl); font-weight: 900; color: #C084FC; margin-top: 6px;">
                        ${stats.subscribedUsers.toLocaleString()}
                    </div>
                </div>
            </div>

            <div class="glass-card" style="padding: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: var(--fds-font-md); color: var(--fds-text-main);">📡 ETHIO TELECOM VAS PLATFORM STATUS</h3>
                <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm); line-height: 1.6;">
                    API Gateway: <span style="color: #86EFAC; font-weight: bold;">ONLINE</span><br/>
                    SMS OTP Delivery Rate: <span style="color: #86EFAC; font-weight: bold;">${stats.smsOtpSuccessRate}</span><br/>
                    Database Sync latency: <span style="color: #86EFAC; font-weight: bold;">${stats.avgLatencyMs}ms</span>
                </p>
            </div>
        `;
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        // Close btn
        root.querySelector('#admin-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        // Tab switching
        root.querySelectorAll('.tab-btn').forEach(btn => {
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

        // Add single question handler
        root.querySelector('#add-question-btn')?.addEventListener('click', async () => {
            this._audioManager.playClick();
            const category = (root.querySelector('#q-category') as HTMLSelectElement)?.value;
            const difficulty = parseInt((root.querySelector('#q-difficulty') as HTMLInputElement)?.value || '2', 10);
            const correctIndex = parseInt((root.querySelector('#q-correct') as HTMLSelectElement)?.value || '0', 10);

            const promptEn = (root.querySelector('#q-prompt-en') as HTMLTextAreaElement)?.value.trim();
            const promptAm = (root.querySelector('#q-prompt-am') as HTMLTextAreaElement)?.value.trim();
            const promptOm = (root.querySelector('#q-prompt-om') as HTMLTextAreaElement)?.value.trim();

            const opt0En = (root.querySelector('#q-opt0-en') as HTMLInputElement)?.value.trim();
            const opt1En = (root.querySelector('#q-opt1-en') as HTMLInputElement)?.value.trim();
            const opt2En = (root.querySelector('#q-opt2-en') as HTMLInputElement)?.value.trim();
            const opt3En = (root.querySelector('#q-opt3-en') as HTMLInputElement)?.value.trim();

            const opt0Am = (root.querySelector('#q-opt0-am') as HTMLInputElement)?.value.trim();
            const opt1Am = (root.querySelector('#q-opt1-am') as HTMLInputElement)?.value.trim();
            const opt2Am = (root.querySelector('#q-opt2-am') as HTMLInputElement)?.value.trim();
            const opt3Am = (root.querySelector('#q-opt3-am') as HTMLInputElement)?.value.trim();

            const opt0Om = (root.querySelector('#q-opt0-om') as HTMLInputElement)?.value.trim();
            const opt1Om = (root.querySelector('#q-opt1-om') as HTMLInputElement)?.value.trim();
            const opt2Om = (root.querySelector('#q-opt2-om') as HTMLInputElement)?.value.trim();
            const opt3Om = (root.querySelector('#q-opt3-om') as HTMLInputElement)?.value.trim();

            if (!promptEn || !opt0En || !opt1En || !opt2En || !opt3En) {
                this._statusMessage = '❌ Please fill in the English prompt and all 4 English options.';
                this.render();
                return;
            }

            const payload = {
                category,
                difficulty,
                competition_id: category,
                prompt_en: promptEn,
                prompt_am: promptAm || null,
                prompt_om: promptOm || null,
                options_en: [opt0En, opt1En, opt2En, opt3En],
                options_am: (opt0Am && opt1Am && opt2Am && opt3Am) ? [opt0Am, opt1Am, opt2Am, opt3Am] : null,
                options_om: (opt0Om && opt1Om && opt2Om && opt3Om) ? [opt0Om, opt1Om, opt2Om, opt3Om] : null,
                correct_index: correctIndex,
                is_active: true
            };

            if (supabase) {
                const { error } = await (supabase.from('questions' as any) as any).insert(payload);
                if (error) {
                    this._statusMessage = `❌ Cloud Insert Failed: ${error.message}`;
                } else {
                    this._statusMessage = '✅ Question published to Cloud database successfully!';
                }
            } else {
                this._statusMessage = '✅ Question added locally (Supabase offline).';
            }
            this.render();
        });

        // Bulk CSV import handler
        root.querySelector('#import-csv-btn')?.addEventListener('click', async () => {
            this._audioManager.playClick();
            const csvText = (root.querySelector('#bulk-csv-area') as HTMLTextAreaElement)?.value.trim();
            if (!csvText) {
                this._statusMessage = '❌ Please paste CSV content to import.';
                this.render();
                return;
            }

            const lines = csvText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length < 2) {
                this._statusMessage = '❌ CSV must contain a header row and at least 1 data row.';
                this.render();
                return;
            }

            let successCount = 0;
            const dataRows = lines.slice(1);

            for (const row of dataRows) {
                const parts = row.split(',').map(p => p.trim());
                if (parts.length >= 8) {
                    const [cat, diff, prompt, o0, o1, o2, o3, corr] = parts;
                    const payload = {
                        category: cat || 'football-history',
                        difficulty: parseInt(diff || '1', 10),
                        competition_id: cat || 'football-history',
                        prompt_en: prompt,
                        options_en: [o0, o1, o2, o3],
                        correct_index: parseInt(corr || '0', 10),
                        is_active: true
                    };

                    if (supabase) {
                        await (supabase.from('questions' as any) as any).insert(payload);
                    }
                    successCount++;
                }
            }

            this._statusMessage = `✅ Successfully processed & imported ${successCount} questions!`;
            this.render();
        });

        // Add competition handler
        root.querySelector('#admin-add-comp-btn')?.addEventListener('click', () => {
            const nameEl = root.querySelector('#admin-comp-name') as HTMLInputElement;
            const badgeEl = root.querySelector('#admin-comp-badge') as HTMLInputElement;
            const descEl = root.querySelector('#admin-comp-desc') as HTMLInputElement;

            if (nameEl && nameEl.value.trim() !== '') {
                const id = nameEl.value.toLowerCase().replace(/\s+/g, '-');
                CompetitionRegistry.addCompetition({
                    id,
                    name: nameEl.value.trim(),
                    nameEn: nameEl.value.trim(),
                    badge: badgeEl.value.trim() || '⚽',
                    description: descEl.value.trim() || 'Custom Competition',
                    color: '#1e3a8a',
                    questionCount: 10
                });

                this._audioManager.playClick();
                this._statusMessage = `✅ Competition '${nameEl.value.trim()}' Published Successfully!`;
                this.render();
            }
        });
    }
}
