import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { LiveMatchClient, LiveMatchEventData } from '../../networking/multiplayer/LiveMatchClient';
import { ELORatingSystem } from '../../networking/multiplayer/ELORatingSystem';
import type { ExtendedQuestionData } from '../../core/quiz/QuestionBank';
import type { UserRow } from '../../networking/supabase/types';

export class LiveMatchScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _saveManager: SaveManager;
    private _opponent: UserRow;
    private _questions: ExtendedQuestionData[];
    private _onComplete: () => void;

    private _client: LiveMatchClient;
    private _currentIndex: number = 0;
    private _myScore: number = 0;
    private _opponentScore: number = 0;
    
    private _timerInterval: any = null;
    private _timeLeftSec: number = 20;

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        saveManager: SaveManager,
        matchId: string,
        opponent: UserRow,
        questions: ExtendedQuestionData[],
        onComplete: () => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._saveManager = saveManager;
        this._opponent = opponent;
        this._questions = questions;
        this._onComplete = onComplete;

        this._client = new LiveMatchClient(matchId);
    }

    public startMatch(): void {
        this._client.connect();
        this._client.onEvent((evt: LiveMatchEventData) => {
            if (evt.userId === this._opponent.id && evt.event === 'ANSWER_SUBMITTED') {
                if (evt.score !== undefined) {
                    this._opponentScore = evt.score;
                    const oppScoreEl = document.getElementById('opponent-score');
                    if (oppScoreEl) oppScoreEl.innerText = `${this._opponentScore}`;
                }
            }
        });

        this.render();
    }

    public render(): void {
        const root = this._uiManager.container;
        const myProfile = this._saveManager.profile;
        const q = this._questions[this._currentIndex];

        if (!q) {
            this._showFinalResults();
            return;
        }

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; display: flex; flex-direction: column;">
                
                <!-- Live Header -->
                <div style="
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 16px 20px; 
                    background: rgba(15,23,42,0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                ">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="background: #EF4444; color: white; font-size: 10px; font-weight: 900; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px;">LIVE 1v1</span>
                        <div style="font-size: 14px; font-weight: 800; color: white;">ROUND ${this._currentIndex + 1} OF ${this._questions.length}</div>
                    </div>
                </div>

                <!-- Smooth Progress Timer -->
                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1);">
                    <div id="live-timer-bar" style="height: 100%; width: 100%; background: var(--tv-pitch-green); transition: width 1s linear, background-color 0.3s;"></div>
                </div>

                <!-- Scoreboard vs Opponent -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 32px; background: rgba(0,0,0,0.4);">
                    <div style="text-align: left;">
                        <div style="font-size: 12px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">YOU</div>
                        <div style="font-size: 16px; font-weight: 900; color: white; margin-bottom: 4px;">${myProfile.username}</div>
                        <div id="my-score" style="font-size: 24px; font-weight: 900; color: var(--tv-pitch-green);">${this._myScore}</div>
                    </div>
                    <div style="font-size: 20px; font-weight: 900; color: #EF4444; background: rgba(239,68,68,0.15); padding: 8px 16px; border-radius: 20px;">VS</div>
                    <div style="text-align: right;">
                        <div style="font-size: 12px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">OPPONENT</div>
                        <div style="font-size: 16px; font-weight: 900; color: white; margin-bottom: 4px;">${this._opponent.username}</div>
                        <div id="opponent-score" style="font-size: 24px; font-weight: 900; color: #F59E0B;">${this._opponentScore}</div>
                    </div>
                </div>

                <!-- Quiz Area -->
                <div style="
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    max-width: 600px;
                    margin: 0 auto;
                    width: 100%;
                ">
                    <!-- High-Focus Question Text -->
                    <div style="
                        font-size: 28px;
                        font-weight: 900;
                        color: white;
                        text-align: center;
                        line-height: 1.4;
                        margin-bottom: 40px;
                        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                    ">${q.prompt}</div>

                    <!-- Large Answer Buttons -->
                    <div style="display: flex; flex-direction: column; gap: 16px; width: 100%;">
                        ${q.options.map((opt, i) => `
                            <button class="live-option-btn" data-index="${i}" style="
                                display: flex;
                                align-items: center;
                                width: 100%;
                                padding: 20px;
                                background: rgba(255,255,255,0.03);
                                border: 2px solid rgba(255,255,255,0.1);
                                border-radius: 16px;
                                color: white;
                                font-size: 18px;
                                font-weight: 700;
                                text-align: left;
                                cursor: pointer;
                                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                                position: relative;
                                overflow: hidden;
                            ">
                                <span style="
                                    width: 32px; height: 32px; 
                                    border-radius: 50%; 
                                    background: rgba(255,255,255,0.1); 
                                    display: flex; align-items: center; justify-content: center; 
                                    margin-right: 16px; 
                                    font-size: 14px; font-weight: 900;
                                ">${String.fromCharCode(65 + i)}</span>
                                <span style="flex: 1;">${opt}</span>
                                <span class="feedback-icon" style="font-size: 24px; opacity: 0; transform: scale(0.5); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"></span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Feedback Overlay (Fixed Bottom) -->
                <div id="live-feedback-overlay" style="
                    position: fixed;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%) scale(0.9);
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 100;
                    width: 90%;
                    max-width: 400px;
                    background: rgba(15,23,42,0.95);
                    border: 2px solid;
                    border-radius: 20px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                    backdrop-filter: blur(10px);
                ">
                    <div id="live-feedback-icon" style="font-size: 32px;"></div>
                    <div id="live-feedback-text" style="font-size: 24px; font-weight: 900; font-family: var(--tv-mono); letter-spacing: 1px;"></div>
                </div>
            </div>
            <style>
                .live-option-btn:active:not(:disabled) { transform: scale(0.97); }
                .live-option-btn.correct { background: rgba(34,197,94,0.15) !important; border-color: #22C55E !important; }
                .live-option-btn.wrong { background: rgba(239,68,68,0.15) !important; border-color: #EF4444 !important; }
                .live-option-btn.correct .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: #22C55E; }
                .live-option-btn.wrong .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: #EF4444; }
                .live-option-btn.correct .feedback-icon::after { content: '✓'; }
                .live-option-btn.wrong .feedback-icon::after { content: '✕'; }
            </style>
        `;

        this._startTimer();
        this._bindEvents(q);
    }

    private _startTimer(): void {
        this._stopTimer();
        this._timeLeftSec = 20; // 20s for live match

        const timerBar = document.getElementById('live-timer-bar');

        this._timerInterval = setInterval(() => {
            this._timeLeftSec--;
            if (timerBar) {
                const pct = (this._timeLeftSec / 20) * 100;
                timerBar.style.width = pct + '%';
                if (this._timeLeftSec <= 5) {
                    timerBar.style.backgroundColor = '#EF4444';
                    this._audioManager.playCountdownWarning();
                }
            }

            if (this._timeLeftSec <= 0) {
                this._stopTimer();
                this._handleTimeOut();
            }
        }, 1000);
    }

    private _stopTimer(): void {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
    }

    private _bindEvents(q: ExtendedQuestionData): void {
        const options = document.querySelectorAll('.live-option-btn');
        options.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                this._stopTimer();
                
                const buttons = document.querySelectorAll('.live-option-btn');
                buttons.forEach(b => (b as HTMLButtonElement).disabled = true);

                const chosenIdx = parseInt(target.getAttribute('data-index') || '0');
                this._onOptionSelected(chosenIdx, target, q);
            });
        });
    }

    private _onOptionSelected(chosenIndex: number, targetBtn: HTMLButtonElement, q: ExtendedQuestionData): void {
        const isCorrect = chosenIndex === q.correctIndex;
        const buttons = document.querySelectorAll('.live-option-btn');

        if (isCorrect) {
            targetBtn.classList.add('correct');
            this._audioManager.playCorrectAnswer();
            this._audioManager.playGoalCheer();
            this._myScore += 150; // Faster answers give more score normally, static for demo
            
            const myScoreEl = document.getElementById('my-score');
            if (myScoreEl) myScoreEl.innerText = String(this._myScore);
            this._showFeedbackOverlay(true);
        } else {
            targetBtn.classList.add('wrong');
            const correctBtn = buttons[q.correctIndex] as HTMLButtonElement;
            if (correctBtn) {
                correctBtn.classList.add('correct');
            }
            this._audioManager.playWrongAnswer();
            this._audioManager.playWhistle();
            this._showFeedbackOverlay(false);
        }

        // Send live WebSocket broadcast
        this._client.sendAnswer('local-user', this._currentIndex, isCorrect, this._myScore);

        setTimeout(() => {
            this._hideFeedbackOverlay();
            this._currentIndex++;
            this.render();
        }, 1500);
    }

    private _showFeedbackOverlay(isGoal: boolean): void {
        const overlay = document.getElementById('live-feedback-overlay');
        const icon = document.getElementById('live-feedback-icon');
        const text = document.getElementById('live-feedback-text');
        if (overlay && icon && text) {
            overlay.style.borderColor = isGoal ? 'var(--tv-pitch-green)' : '#EF4444';
            overlay.style.boxShadow = isGoal ? '0 10px 40px rgba(34,197,94,0.3)' : '0 10px 40px rgba(239,68,68,0.3)';
            overlay.style.color = isGoal ? 'var(--tv-pitch-green)' : '#EF4444';
            
            icon.innerText = isGoal ? '⚽' : '🧤';
            text.innerText = isGoal ? 'GOAL!!!!!' : 'GOAL SAVED!';
            
            overlay.style.opacity = '1';
            overlay.style.transform = 'translateX(-50%) scale(1)';
        }
    }

    private _hideFeedbackOverlay(): void {
        const overlay = document.getElementById('live-feedback-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateX(-50%) scale(0.9)';
        }
    }

    private _handleTimeOut(): void {
        const q = this._questions[this._currentIndex];
        this._client.sendAnswer('local-user', this._currentIndex, false, this._myScore);
        this._audioManager.playWhistle();
        
        const buttons = document.querySelectorAll('.live-option-btn');
        const correctBtn = buttons[q.correctIndex] as HTMLButtonElement;
        if (correctBtn) {
            correctBtn.classList.add('correct');
        }

        setTimeout(() => {
            this._currentIndex++;
            this.render();
        }, 1200);
    }

    private _showFinalResults(): void {
        const root = this._uiManager.container;
        const myElo = this._saveManager.profile.eloRating || 0;
        const isWinner = this._myScore > this._opponentScore;
        const isDraw = this._myScore === this._opponentScore;

        const eloResult = ELORatingSystem.calculateNewRatings(
            myElo,
            this._opponent.elo_rating,
            isWinner ? 1 : isDraw ? 0.5 : 0
        );

        this._saveManager.profile.eloRating = eloResult.winnerNewElo;
        this._saveManager.addCoins(isWinner ? 300 : 100);

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div class="glass-card" style="
                    width: 100%;
                    max-width: 480px;
                    padding: 40px 24px;
                    text-align: center;
                    border-color: ${isWinner ? 'var(--tv-gold-primary)' : (isDraw ? '#60A5FA' : '#EF4444')};
                ">
                    <div style="font-size: 64px; margin-bottom: 16px;">
                        ${isWinner ? '🏆' : isDraw ? '🤝' : '🧤'}
                    </div>
                    <div style="font-size: 32px; font-weight: 900; color: ${isWinner ? 'var(--tv-gold-primary)' : (isDraw ? '#60A5FA' : '#EF4444')}; margin-bottom: 8px;">
                        ${isWinner ? 'VICTORY' : isDraw ? 'DRAW' : 'DEFEAT'}
                    </div>
                    <div style="font-size: 16px; font-weight: 700; color: #94A3B8; margin-bottom: 32px;">
                        FINAL SCORE: ${this._myScore} - ${this._opponentScore}
                    </div>

                    <div style="display: flex; gap: 16px; margin-bottom: 32px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                            <div style="font-size: 11px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">RATING</div>
                            <div style="font-size: 20px; font-weight: 900; color: #60A5FA;">
                                ${eloResult.winnerNewElo} <span style="font-size: 12px;">(${eloResult.winnerEloChange >= 0 ? '+' : ''}${eloResult.winnerEloChange})</span>
                            </div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px;">
                            <div style="font-size: 11px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">COINS</div>
                            <div style="font-size: 20px; font-weight: 900; color: var(--tv-gold-primary);">
                                +${isWinner ? 300 : 100}
                            </div>
                        </div>
                    </div>

                    <button id="live-finish-btn" style="
                        width: 100%; 
                        padding: 16px; 
                        background: var(--tv-pitch-green); 
                        color: white; 
                        font-weight: 900; 
                        font-size: 16px; 
                        border: none; 
                        border-radius: 12px; 
                        cursor: pointer;
                    ">RETURN TO LEAGUE HUB</button>
                </div>
            </div>
            <style>
                #live-finish-btn:active { transform: scale(0.96); }
            </style>
        `;

        root.querySelector('#live-finish-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._client.disconnect();
            this._onComplete();
        });
    }
}
