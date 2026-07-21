import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { DailyChallengeManager, DailyChallengeInfo } from '../../core/competition/DailyChallengeManager';
import { StreakManager } from '../../core/competition/StreakManager';

export class DailyChallengeScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onStartChallenge: (info: DailyChallengeInfo) => void;
    private _onClose: () => void;
    private _challengeInfo: DailyChallengeInfo | null = null;

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
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 40px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 540px; margin: 0 auto; position: relative; z-index: 10; text-align: center;">
                    <!-- Close button -->
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
                        <button id="dc-close-btn" class="broadcast-btn glass-card" style="color: white; padding: 8px 16px;">
                            ✖ CLOSE
                        </button>
                    </div>

                    <!-- Main Challenge Card -->
                    <div class="glass-card" style="
                        padding: 36px 28px;
                        border-color: rgba(255, 215, 0, 0.4);
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    ">
                        <div style="font-size: 54px; margin-bottom: 12px;">📅</div>
                        <span style="
                            font-size: 11px;
                            font-weight: 800;
                            color: var(--gold-primary);
                            letter-spacing: 2px;
                        ">DAILY FEATURED CHALLENGE</span>
                        <h1 style="margin: 8px 0 16px 0; font-size: 28px; font-weight: 900; color: white;">
                            ${this._challengeInfo.themeEn}
                        </h1>

                        <!-- Stats Row -->
                        <div style="
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 14px;
                            margin: 24px 0;
                        ">
                            <div style="
                                background: rgba(15, 23, 42, 0.6);
                                border: 1px solid rgba(255,255,255,0.1);
                                border-radius: 14px;
                                padding: 14px;
                            ">
                                <div style="font-size: 11px; color: #94A3B8; font-weight: bold;">BONUS MULTIPLIER</div>
                                <div style="font-size: 24px; font-weight: 900; color: #FFD700; margin-top: 4px;">
                                    ⚡ ${this._challengeInfo.bonusMultiplier}x
                                </div>
                            </div>

                            <div style="
                                background: rgba(15, 23, 42, 0.6);
                                border: 1px solid rgba(255,255,255,0.1);
                                border-radius: 14px;
                                padding: 14px;
                            ">
                                <div style="font-size: 11px; color: #94A3B8; font-weight: bold;">CURRENT STREAK</div>
                                <div style="font-size: 24px; font-weight: 900; color: #EF4444; margin-top: 4px;">
                                    🔥 ${currentStreak} DAYS
                                </div>
                            </div>
                        </div>

                        ${this._challengeInfo.completed ? `
                            <div style="
                                background: rgba(34, 197, 94, 0.2);
                                border: 1px solid #22C55E;
                                color: #86EFAC;
                                padding: 14px;
                                border-radius: 14px;
                                font-weight: bold;
                                font-size: 15px;
                            ">
                                ✅ COMPLETED TODAY! Check back tomorrow for a new challenge.
                            </div>
                        ` : `
                            <button id="start-dc-btn" class="broadcast-btn broadcast-btn-green" style="
                                width: 100%;
                                padding: 16px;
                                font-size: 18px;
                            ">
                                🚀 PLAY TODAY'S CHALLENGE (5 Qs)
                            </button>
                        `}
                    </div>
                </div>
            </div>
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
    }
}
