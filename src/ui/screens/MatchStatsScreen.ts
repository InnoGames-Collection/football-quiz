import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { MatchStats } from '../../core/quiz/QuizEngine';

export class MatchStatsScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _stats: MatchStats;
    private _gameId: string;
    private _onContinue: () => void;

    constructor(uiManager: UIManager, saveManager: SaveManager, audioManager: AudioManager, stats: MatchStats, gameId: string, onContinue: () => void) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._stats = stats;
        this._gameId = gameId;
        this._onContinue = onContinue;

        // Persist earnings
        this._saveManager.addCoins(this._stats.coinsEarned);
        this._saveManager.updateHighScore(this._gameId, this._stats.goals * 100);
    }

    public render(): void {
        const root = this._uiManager.container;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div class="glass-card" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 520px;
                    padding: 30px;
                    text-align: center;
                ">
                    <div style="font-size: 14px; font-weight: 800; color: var(--pitch-green); letter-spacing: 3px; margin-bottom: 6px;">MATCH RESULT</div>
                    <h1 style="font-size: 40px; font-weight: 900; color: var(--gold-primary); margin: 0 0 20px 0;">FULL TIME</h1>

                    <!-- Rating Badge -->
                    <div style="
                        display: inline-block;
                        background: rgba(255, 215, 0, 0.15);
                        border: 1px solid var(--gold-primary);
                        border-radius: 30px;
                        padding: 8px 20px;
                        font-weight: 800;
                        color: var(--gold-primary);
                        margin-bottom: 24px;
                    ">
                        MATCH RATING: ⭐ ${this._stats.matchRating} / 10.0
                    </div>

                    <!-- Match Statistics Grid -->
                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 12px;
                        text-align: left;
                        margin-bottom: 24px;
                    ">
                        <div class="glass-card" style="padding: 12px 16px;">
                            <div style="font-size: 12px; color: var(--text-muted);">GOALS SCORED</div>
                            <div style="font-size: 24px; font-weight: 900; color: var(--pitch-green);">⚽ ${this._stats.goals}</div>
                        </div>

                        <div class="glass-card" style="padding: 12px 16px;">
                            <div style="font-size: 12px; color: var(--text-muted);">ACCURACY</div>
                            <div style="font-size: 24px; font-weight: 900; color: #60A5FA;">🎯 ${this._stats.accuracy}%</div>
                        </div>

                        <div class="glass-card" style="padding: 12px 16px;">
                            <div style="font-size: 12px; color: var(--text-muted);">POSSESSION</div>
                            <div style="font-size: 24px; font-weight: 900; color: #C084FC;">📊 ${this._stats.possessionPercent}%</div>
                        </div>

                        <div class="glass-card" style="padding: 12px 16px;">
                            <div style="font-size: 12px; color: var(--text-muted);">MAX COMBO</div>
                            <div style="font-size: 24px; font-weight: 900; color: #F59E0B;">🔥 ${this._stats.maxCombo}x</div>
                        </div>
                    </div>

                    <!-- Rewards Earned -->
                    <div class="glass-card" style="padding: 16px; margin-bottom: 24px; display: flex; justify-content: space-around; align-items: center; background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3);">
                        <div>
                            <div style="font-size: 12px; color: var(--text-muted);">COINS EARNED</div>
                            <div style="font-size: 20px; font-weight: 900; color: var(--gold-primary);">🪙 +${this._stats.coinsEarned}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: var(--text-muted);">XP GAINED</div>
                            <div style="font-size: 20px; font-weight: 900; color: #60A5FA;">⚡ +${this._stats.xpEarned} XP</div>
                        </div>
                    </div>

                    <button id="claim-rewards-btn" class="broadcast-btn broadcast-btn-gold" style="width: 100%; font-size: 18px; padding: 16px;">
                        CLAIM REWARDS 🏆
                    </button>
                </div>
            </div>
        `;

        document.getElementById('claim-rewards-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onContinue();
        });
    }
}
