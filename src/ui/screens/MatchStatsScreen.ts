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

    constructor(
        uiManager: UIManager,
        saveManager: SaveManager,
        audioManager: AudioManager,
        stats: MatchStats,
        gameId: string,
        onContinue: () => void
    ) {
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
        const achievementsUnlocked = this._stats.accuracy >= 80 ? '🎯 Perfect Matchmaster' : '⚽ League Match Finisher';

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 40px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div class="glass-card" style="
                    position: relative;
                    z-index: 10;
                    margin: 20px auto;
                    width: 100%;
                    max-width: 560px;
                    padding: 36px 28px;
                    text-align: center;
                    border-color: var(--gold-primary);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.85);
                ">
                    <!-- Whistle & Broadcast Header -->
                    <div style="font-size: 42px; margin-bottom: 4px;">🎺</div>
                    <span style="font-size: 11px; font-weight: 900; color: var(--pitch-green); letter-spacing: 3px; text-transform: uppercase;">
                        MATCHDAY OFFICIAL REPORT
                    </span>
                    <h1 style="font-size: 42px; font-weight: 900; color: var(--gold-primary); margin: 6px 0 16px 0; letter-spacing: 2px;">
                        FULL TIME
                    </h1>

                    <!-- Match Rating Banner -->
                    <div style="
                        display: inline-block;
                        background: rgba(255, 215, 0, 0.15);
                        border: 1px solid var(--gold-primary);
                        border-radius: 30px;
                        padding: 10px 24px;
                        font-weight: 900;
                        font-size: 16px;
                        color: var(--gold-primary);
                        margin-bottom: 24px;
                        box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
                    ">
                        MATCH RATING: ⭐ ${this._stats.matchRating} / 10.0
                    </div>

                    <!-- Match Statistics Grid -->
                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 14px;
                        text-align: left;
                        margin-bottom: 24px;
                    ">
                        <div class="glass-card" style="padding: 16px; background: rgba(2,6,23,0.6);">
                            <div style="font-size: 11px; color: var(--text-muted); font-weight: bold;">GOALS SCORED</div>
                            <div style="font-size: 26px; font-weight: 900; color: var(--pitch-green);">⚽ ${this._stats.goals} Goals</div>
                        </div>

                        <div class="glass-card" style="padding: 16px; background: rgba(2,6,23,0.6);">
                            <div style="font-size: 11px; color: var(--text-muted); font-weight: bold;">ACCURACY</div>
                            <div style="font-size: 26px; font-weight: 900; color: #60A5FA;">🎯 ${this._stats.accuracy}%</div>
                        </div>

                        <div class="glass-card" style="padding: 16px; background: rgba(2,6,23,0.6);">
                            <div style="font-size: 11px; color: var(--text-muted); font-weight: bold;">AVG RESPONSE TIME</div>
                            <div style="font-size: 26px; font-weight: 900; color: #C084FC;">⏱️ ${this._stats.avgResponseTime}s</div>
                        </div>

                        <div class="glass-card" style="padding: 16px; background: rgba(2,6,23,0.6);">
                            <div style="font-size: 11px; color: var(--text-muted); font-weight: bold;">MAX COMBO</div>
                            <div style="font-size: 26px; font-weight: 900; color: #F59E0B;">🔥 ${this._stats.maxCombo}x Streak</div>
                        </div>
                    </div>

                    <!-- Earnings & Achievements -->
                    <div class="glass-card" style="
                        padding: 18px;
                        margin-bottom: 24px;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        background: rgba(34, 197, 94, 0.12);
                        border-color: rgba(34, 197, 94, 0.4);
                    ">
                        <div>
                            <div style="font-size: 11px; color: var(--text-muted); font-weight: bold;">LEAGUE POINTS / COINS</div>
                            <div style="font-size: 22px; font-weight: 900; color: var(--gold-primary);">🪙 +${this._stats.coinsEarned}</div>
                        </div>
                        <div style="border-left: 1px solid rgba(255,255,255,0.1); height: 36px;"></div>
                        <div>
                            <div style="font-size: 11px; color: var(--text-muted); font-weight: bold;">XP EARNED</div>
                            <div style="font-size: 22px; font-weight: 900; color: #60A5FA;">⚡ +${this._stats.xpEarned} XP</div>
                        </div>
                    </div>

                    <!-- Achievements Unlocked -->
                    <div style="
                        background: rgba(255, 215, 0, 0.08);
                        border: 1px dashed var(--gold-primary);
                        border-radius: 12px;
                        padding: 12px 16px;
                        margin-bottom: 28px;
                        font-size: 13px;
                        color: #F8FAFC;
                        font-weight: bold;
                    ">
                        🎖️ UNLOCKED ACHIEVEMENT: <span style="color: var(--gold-primary);">${achievementsUnlocked}</span>
                    </div>

                    <!-- Continue Button -->
                    <button id="claim-rewards-btn" class="broadcast-btn broadcast-btn-gold" style="width: 100%; font-size: 18px; padding: 18px;">
                        CLAIM REWARDS & RETURN TO HUB 🏆
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
