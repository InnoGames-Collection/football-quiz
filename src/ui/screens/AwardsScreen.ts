import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { AwardsService, AwardRecord } from '../../networking/services/AwardsService';
import { EthioFantasyAppBar } from '../components/EthioFantasyAppBar';
import { DesignSystem } from '../theme/DesignSystem';

type AwardTab = 'daily' | 'weekly' | 'monthly';

export class AwardsScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onBack: () => void;
    private _activeTab: AwardTab = 'daily';
    private _awards: AwardRecord[] = [];
    private _loading: boolean = true;
    private _error: string | null = null;
    
    // Simulate logged-in user phone
    private readonly CURRENT_USER_MSISDN = '+251911223344';

    constructor(uiManager: UIManager, audioManager: AudioManager, onBack: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onBack = onBack;
        this._loadAwards();
    }

    private async _loadAwards(): Promise<void> {
        this._loading = true;
        this._error = null;
        this.render();

        try {
            this._awards = await AwardsService.getInstance().getAwards(this._activeTab);
        } catch (e) {
            this._error = 'Failed to load awards. Please try again.';
        } finally {
            this._loading = false;
            this.render();
        }
    }

    public render(): void {
        const root = this._uiManager.container;

        const tabStyle = (tab: AwardTab) => `
            flex: 1;
            background: ${this._activeTab === tab ? 'var(--tv-pitch-green)' : 'rgba(255,255,255,0.05)'};
            border: 1px solid ${this._activeTab === tab ? 'var(--tv-pitch-green)' : 'rgba(255,255,255,0.1)'};
            color: ${this._activeTab === tab ? 'white' : '#94A3B8'};
            font-weight: ${this._activeTab === tab ? '900' : '700'};
            padding: 12px 0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
            text-transform: uppercase;
        `;

        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; min-height: 100vh; overflow-y: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div style="max-width: 800px; margin: 0 auto; position: relative; z-index: 10; padding-bottom: 120px;">
                    <!-- App Bar -->
                    ${EthioFantasyAppBar.render('MY AWARDS')}

                    <div style="padding: 0 16px;">
                        
                        <!-- Internal Tabs -->
                        <div style="display: flex; gap: 8px; margin-bottom: 24px;">
                            <button class="award-tab" data-tab="daily" style="${tabStyle('daily')}">Daily</button>
                            <button class="award-tab" data-tab="weekly" style="${tabStyle('weekly')}">Weekly</button>
                            <button class="award-tab" data-tab="monthly" style="${tabStyle('monthly')}">Monthly</button>
                        </div>

                        <div id="awards-content-area">
                            ${this._renderContent()}
                        </div>

                    </div>
                </div>
            </div>
            <style>
                .award-tab:active { transform: scale(0.96); }
            </style>
        `;

        this._bindEvents();
    }

    private _renderContent(): string {
        if (this._loading) {
            return DesignSystem.LoadingState('Loading awards...');
        }

        if (this._error) {
            return `
                <div style="text-align: center; padding: 40px 16px;">
                    ${DesignSystem.ErrorState('btn-retry-awards')}
                    <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-top: 12px;">${this._error}</div>
                </div>
            `;
        }

        if (this._awards.length === 0) {
            return `
                <div style="text-align: center; padding: 60px 16px;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🏆</div>
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 900; color: var(--fds-text-main);">No tournament awards have been announced yet.</h2>
                    <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm);">Compete in upcoming tournaments to see winners here.</p>
                </div>
            `;
        }

        const userAwardIndex = this._awards.findIndex(a => a.userMsisdn === this.CURRENT_USER_MSISDN);
        const userHasWon = userAwardIndex !== -1;
        
        let html = '';

        if (!userHasWon) {
            html += `
                <div class="glass-card fade-in-up" style="padding: 16px; margin-bottom: 24px; text-align: center; border-color: rgba(255,255,255,0.1); background: rgba(34,197,94,0.05);">
                    <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main); margin-bottom: 4px;">You haven't won any tournament yet.</div>
                    <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">Compete in Daily, Weekly and Monthly tournaments to earn rewards.</div>
                </div>
            `;
        }

        html += `<div style="display: flex; flex-direction: column; gap: 12px;" class="fade-in-up">`;

        // If user won, show them at the top
        if (userHasWon) {
            const userAward = this._awards[userAwardIndex];
            html += this._renderAwardCard(userAward, true);
        }

        const otherAwards = this._awards.filter(a => a.userMsisdn !== this.CURRENT_USER_MSISDN);
        
        otherAwards.forEach(award => {
            html += this._renderAwardCard(award, false);
        });

        html += `</div>`;

        return html;
    }

    private _renderAwardCard(award: AwardRecord, isUser: boolean): string {
        // Rank 1: Gold, Rank 2: Silver, Rank 3: Bronze, Rank 4+: Standard
        let borderColor = 'rgba(255,255,255,0.08)';
        let badge = '';
        let rankColor = 'var(--fds-text-dim)';
        
        if (isUser) {
            borderColor = '#22C55E'; // Green accent for logged-in user
        } else if (award.rank === 1) {
            borderColor = '#FCD34D'; // Gold
            badge = '🥇';
            rankColor = '#FCD34D';
        } else if (award.rank === 2) {
            borderColor = '#E2E8F0'; // Silver
            badge = '🥈';
            rankColor = '#E2E8F0';
        } else if (award.rank === 3) {
            borderColor = '#D97706'; // Bronze
            badge = '🥉';
            rankColor = '#D97706';
        }

        return `
            <div class="glass-card" style="
                padding: 16px;
                border: 1px solid ${borderColor};
                background: ${isUser ? 'rgba(34,197,94,0.1)' : 'rgba(15,23,42,0.85)'};
                border-radius: 12px;
                position: relative;
                overflow: hidden;
            ">
                ${isUser ? `
                    <div style="position: absolute; top: 0; right: 0; background: #22C55E; color: black; font-size: 10px; font-weight: 900; padding: 4px 12px; border-bottom-left-radius: 12px; text-transform: uppercase;">
                        ⭐ Your Award
                    </div>
                ` : ''}

                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; margin-top: ${isUser ? '8px' : '0'};">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: ${rankColor}; min-width: 60px;">
                            ${badge} Rank ${award.rank}
                        </div>
                        <div>
                            <div style="font-size: 10px; color: var(--fds-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">MSISDN</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); font-family: monospace;">${award.maskedMsisdn}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 10px; color: var(--fds-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">Prize</div>
                        <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--tv-gold-primary);">${award.prizeAmount.toLocaleString()} ${award.currency}</div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px;">
                    <div>
                        <div style="font-size: 10px; color: var(--fds-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">Tournament</div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #94A3B8;">${this._capitalize(award.tournamentType)} Tournament</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 10px; color: var(--fds-text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">Ended</div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #94A3B8;">${new Date(award.tournamentEndDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                </div>
            </div>
        `;
    }

    private _capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        EthioFantasyAppBar.bind(root, () => {
            this._audioManager.playClick();
            this._onBack();
        });

        root.querySelectorAll('.award-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as AwardTab;
                if (tab && tab !== this._activeTab) {
                    this._audioManager.playClick();
                    this._activeTab = tab;
                    this._loadAwards();
                }
            });
        });

        root.querySelector('#btn-retry-awards')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._loadAwards();
        });
    }
}