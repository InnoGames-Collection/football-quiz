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
    private _selectedDifficulty: number = 2;

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

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                ${DesignSystem.Header({
                    title: 'MATCHDAY PLAY HUB',
                    badgeText: 'MATCHDAY PLAY HUB',
                    rightText: ''
                })}
                
                <div style="position: absolute; top: 12px; right: 24px; z-index: 30;">
                    <button id="dc-close-btn" class="glass-card" style="padding: 6px 14px; color: white; font-weight: bold; cursor: pointer;">
                        ⬅️ BACK TO HUB
                    </button>
                </div>

                <div style="max-width: 880px; margin: var(--fds-space-20) auto; position: relative; z-index: 10; padding: 0 var(--fds-space-20);">
                    
                    ${DesignSystem.Card({
                        borderColor: 'var(--tv-pitch-green)',
                        className: 'margin-bottom-20',
                        content: `
                            ${DesignSystem.Text('⚽ SELECT MATCHDAY PLAY MODE', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--tv-pitch-green)', margin: '0 0 var(--fds-space-4) 0' })}
                            ${DesignSystem.Text('GAMEPLAY MODES & DERBIES', { size: 'var(--fds-font-xl)', weight: '900', color: 'white', margin: '0' })}
                        `
                    })}

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--fds-space-16);">

                        ${DesignSystem.Card({
                            borderColor: 'var(--fds-gold-primary)',
                            content: `
                                ${DesignSystem.Text('⚡ INSTANT KICKOFF', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Quick Solo Match', { size: 'var(--fds-font-lg)', weight: '900', color: 'white', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Instant 10-question matchday derby against the clock.', { size: 'var(--fds-font-xs)', color: '#94A3B8', margin: '0 0 var(--fds-space-16) 0' })}
                                ${DesignSystem.Button({ id: 'btn-play-quick', text: 'START QUICK MATCH ⚡', variant: 'gold', fullWidth: true })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: 'var(--tv-pitch-green)',
                            content: `
                                ${DesignSystem.Text('📅 DAILY FEATURED DERBY', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--tv-pitch-green)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text(this._challengeInfo.themeEn, { size: 'var(--fds-font-lg)', weight: '900', color: 'white', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text(`Earn ${this._challengeInfo.bonusMultiplier}x Bonus XP • Streak: 🔥 ${currentStreak} Days`, { size: 'var(--fds-font-xs)', color: '#94A3B8', margin: '0 0 var(--fds-space-16) 0' })}
                                ${DesignSystem.Button({ id: 'start-dc-btn', text: 'PLAY DAILY DERBY (5 Qs)', variant: 'green', fullWidth: true })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: '#38BDF8',
                            content: `
                                ${DesignSystem.Text('▶ RESUME IN-PROGRESS MATCH', { size: 'var(--fds-font-xs)', weight: '800', color: '#38BDF8', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Ethiopian Premier Derby', { size: 'var(--fds-font-lg)', weight: '900', color: 'white', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Resume match from Question 4 of 10 in 1st Half.', { size: 'var(--fds-font-xs)', color: '#94A3B8', margin: '0 0 var(--fds-space-16) 0' })}
                                ${DesignSystem.Button({ id: 'btn-continue-match', text: 'RESUME DERBY ▶', variant: 'gold', fullWidth: true })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: 'var(--fds-gold-primary)',
                            content: `
                                ${DesignSystem.Text('🎚️ MATCH DIFFICULTY FILTER', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Flex(`
                                    ${[1, 2, 3, 4, 5].map(lvl => `
                                        <button class="diff-btn ${lvl === this._selectedDifficulty ? 'active-diff' : ''}" data-diff="${lvl}" style="
                                            background: ${lvl === this._selectedDifficulty ? 'var(--tv-gold-gradient)' : 'rgba(15,23,42,0.8)'};
                                            color: ${lvl === this._selectedDifficulty ? '#000' : 'white'};
                                            border: 1px solid var(--fds-gold-primary);
                                            border-radius: var(--radius-sm);
                                            padding: var(--fds-space-8) var(--fds-space-12);
                                            font-size: var(--fds-font-xs);
                                            font-weight: 800;
                                            cursor: pointer;
                                            min-height: 48px;
                                        ">Lvl ${lvl}</button>
                                    `).join('')}
                                `, { wrap: true, gap: 'var(--fds-space-8)' })}
                            `
                        })}
                    </div>
                </div>
            </div>
            <style>
                .margin-bottom-20 { margin-bottom: var(--fds-space-20); }
            </style>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#dc-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        root.querySelector('#start-dc-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._challengeInfo) {
                this._onStartChallenge(this._challengeInfo);
            }
        });

        root.querySelector('#btn-play-quick')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._challengeInfo) {
                this._onStartChallenge(this._challengeInfo);
            }
        });

        root.querySelector('#btn-continue-match')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._challengeInfo) {
                this._onStartChallenge(this._challengeInfo);
            }
        });

        root.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const diff = parseInt(target.getAttribute('data-diff') || '2');
                this._selectedDifficulty = diff;
                this._audioManager.playClick();
                this.render();
            });
        });
    }
}
