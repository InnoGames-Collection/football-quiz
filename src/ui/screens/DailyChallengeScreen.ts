import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { DailyChallengeManager, DailyChallengeInfo } from '../../core/competition/DailyChallengeManager';
import { StreakManager } from '../../core/competition/StreakManager';
import { DesignSystem } from '../theme/DesignSystem';

export class DailyChallengeScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onStartChallenge: (info: DailyChallengeInfo) => void;
    private _onClose: () => void;
    private _challengeInfo: DailyChallengeInfo | null = null;
    private _selectedMode: string = 'daily';

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        onStartChallenge: (info: DailyChallengeInfo) => void,
        onClose: () => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onStartChallenge = onStartChallenge;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        this._challengeInfo = await DailyChallengeManager.getInstance().getTodayChallenge();
        const currentStreak = StreakManager.getInstance().currentStreak;

        const modes = [
            { id: 'quick', icon: '⚡', title: 'Quick Match', color: 'var(--tv-pitch-green)' },
            { id: 'daily', icon: '📅', title: 'Daily Challenge', color: 'var(--tv-gold-primary)' },
            { id: 'league', icon: '🏆', title: 'League Match', color: '#38BDF8' },
            { id: 'tournament', icon: '🏅', title: 'Tournament', color: '#A78BFA' },
            { id: 'guess', icon: '👤', title: 'Guess The Player', color: '#F472B6' },
            { id: 'penalty', icon: '🥅', title: 'Penalty Shootout', color: '#F87171' },
            { id: 'iq', icon: '🧠', title: 'Football IQ', color: '#FB923C' }
        ];

        // Horizontal Slider HTML
        const modesHtml = modes.map(mode => `
            <div class="mode-card glass-card ${this._selectedMode === mode.id ? 'active-mode' : ''}" data-mode="${mode.id}" style="
                flex: 0 0 140px; 
                padding: 16px 12px; 
                text-align: center; 
                cursor: pointer; 
                border-color: ${this._selectedMode === mode.id ? mode.color : 'rgba(255,255,255,0.1)'};
                background: ${this._selectedMode === mode.id ? `linear-gradient(135deg, ${mode.color}22 0%, rgba(15,23,42,0.8) 100%)` : 'rgba(15,23,42,0.6)'};
                box-shadow: ${this._selectedMode === mode.id ? `0 0 15px ${mode.color}44` : 'none'};
                transition: all 0.2s ease;
            ">
                <div style="font-size: 28px; margin-bottom: 8px;">${mode.icon}</div>
                <div style="font-size: 13px; font-weight: 800; color: ${this._selectedMode === mode.id ? mode.color : 'white'};">${mode.title}</div>
            </div>
        `).join('');

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: space-between; padding: 12px 16px;">
                    <div style="font-weight: 900; font-size: 18px; letter-spacing: 1px;">PLAY MODES</div>
                    <button id="dc-close-btn" style="background: none; border: none; color: white; font-weight: bold; cursor: pointer;">⬅️ BACK</button>
                </div>

                <div style="max-width: 960px; margin: 0 auto; padding: 16px 0 0 0;">
                    
                    <!-- Horizontal Mode Selector -->
                    <div style="padding: 0 16px; margin-bottom: 24px;">
                        <div style="font-size: 12px; font-weight: 800; color: #94A3B8; margin-bottom: 12px; text-transform: uppercase;">Select Mode</div>
                        <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 16px; scrollbar-width: none; -ms-overflow-style: none;" id="modes-container">
                            ${modesHtml}
                        </div>
                    </div>

                    <div style="padding: 0 16px;">
                        
                        <!-- Main Action Area based on selection -->
                        <div id="active-mode-content" style="margin-bottom: 24px;">
                            ${this._renderActiveModeContent(currentStreak)}
                        </div>
                    </div>
                </div>
            </div>
            <style>
                #modes-container::-webkit-scrollbar { display: none; }
                .mode-card:active { transform: scale(0.95); }
            </style>
        `;

        this._bindEvents();
    }

    private _renderActiveModeContent(currentStreak: number): string {
        if (this._selectedMode === 'daily') {
            return `
                <div class="glass-card" style="border-color: var(--tv-gold-primary); background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(15,23,42,0.8) 100%); padding: 24px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 8px;">📅</div>
                    <div style="font-size: 24px; font-weight: 900; color: var(--tv-gold-primary); margin-bottom: 8px;">DAILY CHALLENGE</div>
                    <div style="font-size: 14px; color: white; font-weight: 700; margin-bottom: 4px;">${this._challengeInfo!.themeEn}</div>
                    <div style="font-size: 12px; color: #CBD5E1; margin-bottom: 16px;">Earn ${this._challengeInfo!.bonusMultiplier}x Bonus XP • Streak: 🔥 ${currentStreak} Days</div>
                    ${DesignSystem.Button({ id: 'btn-start-active', text: 'PLAY DAILY CHALLENGE (+500 XP)', variant: 'gold', fullWidth: true })}
                </div>
            `;
        } else if (this._selectedMode === 'quick') {
            return `
                <div class="glass-card" style="border-color: var(--tv-pitch-green); background: linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(15,23,42,0.8) 100%); padding: 24px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 8px;">⚡</div>
                    <div style="font-size: 24px; font-weight: 900; color: var(--tv-pitch-green); margin-bottom: 8px;">QUICK MATCH</div>
                    <div style="font-size: 14px; color: white; font-weight: 700; margin-bottom: 4px;">Random 10 Questions</div>
                    <div style="font-size: 12px; color: #CBD5E1; margin-bottom: 16px;">Jump straight into the action against the clock.</div>
                    ${DesignSystem.Button({ id: 'btn-start-active', text: 'START QUICK MATCH ⚽', variant: 'green', fullWidth: true })}
                </div>
            `;
        }
        // Fallback for others
        return `
            <div class="glass-card" style="border-color: #64748B; background: rgba(15,23,42,0.8); padding: 24px; text-align: center;">
                <div style="font-size: 24px; font-weight: 900; color: white; margin-bottom: 8px;">MODE LOCKED</div>
                <div style="font-size: 13px; color: #94A3B8;">This mode is currently unavailable.</div>
            </div>
        `;
    }

    private _bindEvents(): void {
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const modeId = target.getAttribute('data-mode');
                if (modeId && modeId !== this._selectedMode) {
                    this._audioManager.playClick();
                    this._selectedMode = modeId;
                    this.render();
                }
            });
        });

        document.getElementById('btn-start-active')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if ((this._selectedMode === 'daily' || this._selectedMode === 'quick') && this._challengeInfo) {
                this._onStartChallenge(this._challengeInfo);
            }
        });

        document.getElementById('dc-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });
    }
}
