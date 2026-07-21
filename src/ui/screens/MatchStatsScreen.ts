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

        this._saveManager.addXp(this._stats.xpEarned);
        this._saveManager.updateHighScore(this._gameId, this._stats.goals * 100);
    }

    public render(): void {
        const root = this._uiManager.container;
        const totalQuestions = 10; // Assuming 10 for demo
        const correct = this._stats.goals;
        const wrong = totalQuestions - correct;
        
        if (this._stats.accuracy >= 50) {
            this._audioManager.playVictoryFanfare();
        } else {
            this._audioManager.playDefeatSound();
        }

        const statBox = (label: string, value: string | number, color: string) => `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; text-align: center;">
                <div style="font-size: 11px; font-weight: 800; color: #94A3B8; margin-bottom: 4px; text-transform: uppercase;">${label}</div>
                <div style="font-size: 20px; font-weight: 900; color: ${color};">${value}</div>
            </div>
        `;

        const actionBtn = (id: string, icon: string, label: string, primary: boolean = false) => `
            <button id="${id}" style="
                background: ${primary ? 'var(--tv-pitch-green)' : 'rgba(255,255,255,0.05)'};
                border: ${primary ? 'none' : '1px solid rgba(255,255,255,0.1)'};
                color: white;
                padding: 12px;
                border-radius: 8px;
                font-weight: 800;
                font-size: 13px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                transition: transform 0.1s;
            ">
                <span style="font-size: 20px;">${icon}</span>
                ${label}
            </button>
        `;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div class="glass-card" style="width: 100%; max-width: 400px; padding: 24px; border-color: ${this._stats.accuracy >= 50 ? 'var(--tv-gold-primary)' : '#EF4444'};">
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="font-size: 48px; margin-bottom: 8px;">${this._stats.accuracy >= 50 ? '🏆' : '🧤'}</div>
                        <div style="font-size: 14px; font-weight: 800; color: #94A3B8; letter-spacing: 2px;">MATCH RESULT</div>
                        <div style="font-size: 32px; font-weight: 900; color: white;">${correct} <span style="font-size: 20px; color: #94A3B8;">/ ${totalQuestions}</span></div>
                    </div>

                    <!-- Stats Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
                        ${statBox('Accuracy', this._stats.accuracy + '%', '#60A5FA')}
                        ${statBox('Earned Pts', '+' + (correct * 25), 'var(--tv-gold-primary)')}
                        ${statBox('Correct', correct, '#22C55E')}
                        ${statBox('Wrong', wrong, '#EF4444')}
                    </div>

                    <!-- Reward -->
                    <div style="background: rgba(34,197,94,0.1); border: 1px dashed #22C55E; border-radius: 8px; padding: 12px; text-align: center; margin-bottom: 24px;">
                        <div style="font-size: 11px; font-weight: 800; color: #22C55E; margin-bottom: 4px;">MATCH REWARD</div>
                        <div style="font-size: 16px; font-weight: 900; color: white;">🪙 +${this._stats.xpEarned} XP</div>
                    </div>

                    <!-- Action Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        ${actionBtn('btn-play-again', '🔄', 'Play Again')}
                        ${actionBtn('btn-leaderboard', '📈', 'Rankings')}
                        ${actionBtn('btn-home', '🏠', 'Home')}
                        ${actionBtn('btn-claim', '🎁', 'Claim', true)}
                    </div>

                </div>
            </div>
            <style>
                button:active { transform: scale(0.96); }
            </style>
        `;

        document.getElementById('btn-claim')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onContinue();
        });
        
        document.getElementById('btn-home')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onContinue();
        });
        
        document.getElementById('btn-play-again')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onContinue(); // In a full implementation, this would trigger a restart callback
        });
        
        document.getElementById('btn-leaderboard')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onContinue(); // In a full implementation, this would open leaderboard
        });
    }
}
