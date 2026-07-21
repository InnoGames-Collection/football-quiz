import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { QuizEngine } from '../../core/quiz/QuizEngine';
import { Competition } from '../../core/quiz/CompetitionRegistry';

export interface ScoreboardCallbacks {
    onMatchComplete: () => void;
    onExitMatch: () => void;
}

export interface QuestionData {
    prompt: string;
    options: string[];
    correctIndex: number;
}

export class ScoreboardQuestionScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _quizEngine: QuizEngine;
    private _competition: Competition;
    private _questions: QuestionData[];
    private _callbacks: ScoreboardCallbacks;

    private _currentIndex: number = 0;
    private _timerInterval: any = null;
    private _timeLeftSec: number = 30;
    private _startTimeMs: number = 0;
    private _hasKickedOff: boolean = false;

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        quizEngine: QuizEngine,
        competition: Competition,
        questions: QuestionData[],
        callbacks: ScoreboardCallbacks
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._quizEngine = quizEngine;
        this._competition = competition;
        this._questions = questions;
        this._callbacks = callbacks;
    }

    public startMatch(): void {
        this._quizEngine.reset();
        this._currentIndex = 0;
        this._hasKickedOff = false;
        this._renderKickOffScreen();
    }

    private _renderKickOffScreen(): void {
        const root = this._uiManager.container;
        const playerName = localStorage.getItem('ETHIO_FOOTBALL_USERNAME') || 'Player';

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div class="glass-card" style="
                    width: 100%;
                    max-width: 400px;
                    padding: 32px 24px;
                    text-align: center;
                    border-color: var(--tv-pitch-green);
                ">
                    <div style="font-size: 64px; margin-bottom: 16px;">${this._competition.badge}</div>
                    <div style="font-size: 24px; font-weight: 900; color: white; margin-bottom: 8px;">${this._competition.name}</div>
                    <div style="font-size: 14px; font-weight: 700; color: #94A3B8; margin-bottom: 32px;">Ready to test your knowledge, ${playerName}?</div>
                    
                    <button id="kick-off-btn" style="
                        width: 100%; 
                        padding: 16px; 
                        background: var(--tv-pitch-green); 
                        color: white; 
                        font-weight: 900; 
                        font-size: 16px; 
                        border: none; 
                        border-radius: 12px; 
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(34,197,94,0.3);
                        transition: transform 0.2s;
                    ">START MATCH</button>
                </div>
            </div>
            <style>
                #kick-off-btn:active { transform: scale(0.96); }
            </style>
        `;

        document.getElementById('kick-off-btn')?.addEventListener('click', () => {
            this._audioManager.playWhistle();
            this._hasKickedOff = true;
            this._renderQuestion();
        });
    }

    private _renderQuestion(): void {
        if (!this._hasKickedOff) {
            this._renderKickOffScreen();
            return;
        }

        if (this._currentIndex >= this._questions.length) {
            this._stopTimer();
            this._callbacks.onMatchComplete();
            return;
        }

        const q = this._questions[this._currentIndex];
        const root = this._uiManager.container;
        
        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; display: flex; flex-direction: column;">
                
                <!-- Sleek Top Bar -->
                <div style="
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 16px 20px; 
                    background: rgba(15,23,42,0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                ">
                    <button id="match-exit-btn" style="background: none; border: none; color: #94A3B8; font-size: 20px; cursor: pointer;">✕</button>
                    <div style="font-size: 14px; font-weight: 800; color: white;">QUESTION ${this._currentIndex + 1} OF ${this._questions.length}</div>
                    <div style="font-size: 14px; font-weight: 900; color: var(--tv-gold-primary);">SCORE: ${this._quizEngine.calculateFinalStats().goals}</div>
                </div>

                <!-- Smooth Progress Timer -->
                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.1);">
                    <div id="timer-bar" style="height: 100%; width: 100%; background: var(--tv-pitch-green); transition: width 1s linear, background-color 0.3s;"></div>
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
                            <button class="option-btn" data-index="${i}" style="
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
                <div id="feedback-overlay" style="
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
                    <div id="feedback-icon" style="font-size: 32px;"></div>
                    <div id="feedback-text" style="font-size: 24px; font-weight: 900; font-family: var(--tv-mono); letter-spacing: 1px;"></div>
                </div>
            </div>
            <style>
                .option-btn:active:not(:disabled) { transform: scale(0.97); }
                .option-btn.correct { background: rgba(34,197,94,0.15) !important; border-color: #22C55E !important; }
                .option-btn.wrong { background: rgba(239,68,68,0.15) !important; border-color: #EF4444 !important; }
                .option-btn.correct .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: #22C55E; }
                .option-btn.wrong .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: #EF4444; }
                .option-btn.correct .feedback-icon::after { content: '✓'; }
                .option-btn.wrong .feedback-icon::after { content: '✕'; }
            </style>
        `;

        this._startTimer();
        this._bindOptionButtons();
    }

    private _startTimer(): void {
        this._stopTimer();
        this._timeLeftSec = 30;
        this._startTimeMs = performance.now();

        const timerBar = document.getElementById('timer-bar');

        this._timerInterval = setInterval(() => {
            this._timeLeftSec--;
            if (timerBar) {
                const pct = (this._timeLeftSec / 30) * 100;
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

    private _bindOptionButtons(): void {
        document.getElementById('match-exit-btn')?.addEventListener('click', () => {
            this._stopTimer();
            this._callbacks.onExitMatch();
        });

        const options = document.querySelectorAll('.option-btn');
        options.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                this._stopTimer();
                
                const buttons = document.querySelectorAll('.option-btn');
                buttons.forEach(b => (b as HTMLButtonElement).disabled = true);

                const chosenIdx = parseInt(target.getAttribute('data-index') || '0');
                this._onOptionSelected(chosenIdx, target);
            });
        });
    }

    private _onOptionSelected(chosenIndex: number, targetBtn: HTMLButtonElement): void {
        const responseTimeSec = parseFloat(((performance.now() - this._startTimeMs) / 1000).toFixed(1));
        const q = this._questions[this._currentIndex];
        const result = this._quizEngine.recordAnswer(chosenIndex === q.correctIndex, responseTimeSec);

        const buttons = document.querySelectorAll('.option-btn');

        if (result.isGoal) {
            targetBtn.classList.add('correct');
            this._audioManager.playCorrectAnswer();
            this._audioManager.playGoalCheer();
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

        setTimeout(() => {
            this._hideFeedbackOverlay();
            this._currentIndex++;
            this._renderQuestion();
        }, 1500); // Wait for overlay
    }

    private _showFeedbackOverlay(isGoal: boolean): void {
        const overlay = document.getElementById('feedback-overlay');
        const icon = document.getElementById('feedback-icon');
        const text = document.getElementById('feedback-text');
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
        const overlay = document.getElementById('feedback-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translateX(-50%) scale(0.9)';
        }
    }

    private _handleTimeOut(): void {
        this._quizEngine.recordAnswer(false, 30);
        this._audioManager.playWhistle();
        
        const q = this._questions[this._currentIndex];
        const buttons = document.querySelectorAll('.option-btn');
        const correctBtn = buttons[q.correctIndex] as HTMLButtonElement;
        if (correctBtn) {
            correctBtn.classList.add('correct');
        }

        setTimeout(() => {
            this._currentIndex++;
            this._renderQuestion();
        }, 1200);
    }
    
    public destroy(): void {
        this._stopTimer();
    }
}
