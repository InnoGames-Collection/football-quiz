import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { CompetitionRegistry, Competition } from '../../core/quiz/CompetitionRegistry';
import { DesignSystem } from '../theme/DesignSystem';
import { LoaderHelper } from '../components/LoaderHelper';
import { PullToRefresh } from '../components/PullToRefresh';

export class CompetitionBrowserScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onSelectCompetition: (comp: Competition) => void;
    private _onClose: () => void;
    private _activeTab: string = 'live';

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        onSelectCompetition: (comp: Competition) => void,
        onClose: () => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onSelectCompetition = onSelectCompetition;
        this._onClose = onClose;
    }

    public render(): void {
        const root = this._uiManager.container;
        root.innerHTML = LoaderHelper.getSkeletonHtml('league');
        
        setTimeout(() => {
            this._renderActual();
        }, 300);
    }

    private _renderActual(): void {
        const root = this._uiManager.container;

        const tabs = [
            { id: 'live', title: 'Live' },
            { id: 'upcoming', title: 'Upcoming' },
            { id: 'completed', title: 'Completed' },
            { id: 'history', title: 'History' }
        ];

        const tabsHtml = tabs.map(tab => `
            <button class="league-tab ${this._activeTab === tab.id ? 'active-league-tab' : ''}" data-tab="${tab.id}" style="
                flex: 1;
                background: none;
                border: none;
                border-bottom: 2px solid ${this._activeTab === tab.id ? 'var(--tv-pitch-green)' : 'transparent'};
                color: ${this._activeTab === tab.id ? 'white' : '#94A3B8'};
                font-weight: ${this._activeTab === tab.id ? '900' : '700'};
                padding: 12px 0;
                cursor: pointer;
                transition: all 0.2s;
            ">${tab.title}</button>
        `).join('');

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: space-between; padding: 12px 16px;">
                    <div style="font-weight: 900; font-size: 18px; letter-spacing: 1px;">LEAGUE</div>
                    <button id="comp-close-btn" style="background: none; border: none; color: white; font-weight: bold; cursor: pointer;">⬅️ BACK</button>
                </div>

                <div style="max-width: 960px; margin: 0 auto; padding: 16px 0 100px 0;">
                    
                    <!-- Internal Tabs -->
                    <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px; padding: 0 16px;">
                        ${tabsHtml}
                    </div>

                    <div style="padding: 0 16px;" id="league-content-area">
                        ${this._renderActiveTabContent()}
                    </div>

                </div>
            </div>
            <style>
                .league-tab:hover { color: white; }
                .active-league-tab { color: var(--tv-pitch-green); }
            </style>
        `;

        this._bindEvents();
    }

    private _renderActiveTabContent(): string {
        if (this._activeTab === 'live') {
            return `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <!-- Live League Card 1 -->
                    <div class="glass-card" style="padding: 20px; border-color: var(--tv-pitch-green);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                            <div>
                                <div style="font-size: 11px; font-weight: 800; color: var(--tv-pitch-green); margin-bottom: 4px;">LIVE NOW</div>
                                <div style="font-size: 20px; font-weight: 900; color: white;">Ethiopian Premier Derby</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 11px; font-weight: 800; color: #F472B6; margin-bottom: 4px;">ENDS IN</div>
                                <div style="font-size: 14px; font-weight: 900; color: white;">2d 14h</div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 24px; margin-bottom: 16px;">
                            <div>
                                <div style="font-size: 11px; color: #94A3B8; font-weight: 700;">PARTICIPANTS</div>
                                <div style="font-size: 16px; font-weight: 900; color: white;">12,450</div>
                            </div>
                            <div>
                                <div style="font-size: 11px; color: #94A3B8; font-weight: 700;">PRIZE POOL</div>
                                <div style="font-size: 16px; font-weight: 900; color: var(--tv-gold-primary);">5,000 XP</div>
                            </div>
                        </div>

                        <div style="margin-bottom: 24px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <div style="font-size: 11px; font-weight: 800; color: white;">YOUR PROGRESS</div>
                                <div style="font-size: 11px; font-weight: 800; color: var(--tv-pitch-green);">Level 4</div>
                            </div>
                            ${DesignSystem.ProgressBar(40, 'var(--tv-pitch-green)')}
                        </div>

                        ${DesignSystem.Button({ id: 'btn-join-league', text: 'CONTINUE LEAGUE', variant: 'green', fullWidth: true })}
                    </div>

                    <!-- Live League Card 2 -->
                    <div class="glass-card" style="padding: 20px; border-color: rgba(255,255,255,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                            <div>
                                <div style="font-size: 11px; font-weight: 800; color: var(--tv-pitch-green); margin-bottom: 4px;">LIVE NOW</div>
                                <div style="font-size: 20px; font-weight: 900; color: white;">CAF Champions Quiz</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 11px; font-weight: 800; color: #F472B6; margin-bottom: 4px;">ENDS IN</div>
                                <div style="font-size: 14px; font-weight: 900; color: white;">5d 02h</div>
                            </div>
                        </div>

                        <div style="display: flex; gap: 24px; margin-bottom: 24px;">
                            <div>
                                <div style="font-size: 11px; color: #94A3B8; font-weight: 700;">PARTICIPANTS</div>
                                <div style="font-size: 16px; font-weight: 900; color: white;">8,210</div>
                            </div>
                            <div>
                                <div style="font-size: 11px; color: #94A3B8; font-weight: 700;">PRIZE POOL</div>
                                <div style="font-size: 16px; font-weight: 900; color: var(--tv-gold-primary);">10,000 XP</div>
                            </div>
                        </div>

                        ${DesignSystem.Button({ id: 'btn-join-league-2', text: 'JOIN LEAGUE', variant: 'glass', fullWidth: true })}
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="text-align: center; padding: 48px 16px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
                    <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 8px;">No ${this._activeTab} leagues</div>
                    <div style="font-size: 14px; color: #94A3B8;">Check back later for more events.</div>
                </div>
            `;
        }
    }

    private _bindEvents(): void {
        document.getElementById('comp-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        document.querySelectorAll('.league-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const tabId = target.getAttribute('data-tab');
                if (tabId && tabId !== this._activeTab) {
                    this._audioManager.playClick();
                    this._activeTab = tabId;
                    this.render();
                }
            });
        });

        document.getElementById('btn-join-league')?.addEventListener('click', () => {
            this._audioManager.playClick();
            const comps = CompetitionRegistry.getAll();
            if (comps.length > 0) {
                this._onSelectCompetition(comps[0]);
            }
        });
        
        document.getElementById('btn-join-league-2')?.addEventListener('click', () => {
            this._audioManager.playClick();
            const comps = CompetitionRegistry.getAll();
            if (comps.length > 0) {
                this._onSelectCompetition(comps[0]);
            }
        });

        // Pull to refresh
        const container = this._uiManager.container.querySelector('.stadium-container') as HTMLElement;
        if (container) {
            PullToRefresh.attach(container, async () => {
                this._audioManager.playClick();
                await new Promise(res => setTimeout(res, 500));
                this.render();
            });
        }
    }
}
