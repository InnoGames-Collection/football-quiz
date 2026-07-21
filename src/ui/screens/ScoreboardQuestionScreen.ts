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
        this._renderQuestion();
    }

    private _renderQuestion(): void {
        if (this._currentIndex >= this._questions.length) {
            this._stopTimer();
            this._callbacks.onMatchComplete();
            return;
        }

        // Half Time Check (After question 5 of 10)
        if (this._currentIndex === 5 && this._questions.length === 10) {
            this._renderHalfTimeSummary();
            return;
        }

        const q = this._questions[this._currentIndex];
        const matchMinute = Math.min(Math.round(((this._currentIndex + 1) / this._questions.length) * 90), 90);

        const root = this._uiManager.container;
        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <!-- Top Scoreboard Bar -->
                <div class="scoreboard-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px;">${this._competition.badge}</span>
                        <div>
                            <div style="font-weight: 800; font-size: 15px; text-transform: uppercase; color: var(--gold-primary);">${this._competition.name}</div>
                            <div style="font-size: 12px; color: var(--text-muted);">MATCH MINUTE: <strong style="color: white;">${matchMinute}'</strong></div>
                        </div>
                    </div>

                    <!-- Match Score & Question Counter -->
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 900; letter-spacing: 2px;">
                            GOALS: <span id="sb-goals" style="color: var(--pitch-green);">${this._quizEngine.calculateFinalStats().goals}</span>
                        </div>
                        <div style="font-size: 12px; color: var(--text-muted);">Q ${this._currentIndex + 1} OF ${this._questions.length}</div>
                    </div>

                    <!-- Countdown Timer -->
                    <div class="glass-card" style="padding: 8px 16px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 18px;">⏱️</span>
                        <span id="sb-timer" style="font-size: 20px; font-weight: 900; color: var(--gold-primary);">30s</span>
                    </div>
                </div>

                <!-- Center Question Card -->
                <div style="
                    position: absolute;
                    top: 52%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 580px;
                ">
                    <!-- Glassmorphism Card -->
                    <div class="glass-card" style="padding: 30px; text-align: center; margin-bottom: 20px;" id="question-card-container">
                        <div style="font-size: 13px; font-weight: 800; color: var(--pitch-green); letter-spacing: 2px; margin-bottom: 10px; text-transform: uppercase;">
                            CHALLENGE QUESTION
                        </div>
                        <div style="font-size: 22px; font-weight: 800; line-height: 1.4; color: #F8FAFC;">
                            ${q.prompt}
                        </div>
                    </div>

                    <!-- Answer Options -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;" id="answer-grid">
                        ${q.options.map((opt, i) => `
                            <button class="broadcast-btn glass-card option-btn" data-index="${i}" style="
                                text-align: left;
                                justify-content: flex-start;
                                padding: 16px 20px;
                                font-size: 16px;
                                color: white;
                                border: 1px solid var(--glass-border);
                            ">
                                <span style="
                                    width: 28px;
                                    height: 28px;
                                    border-radius: 50%;
                                    background: rgba(255,255,255,0.1);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 13px;
                                    font-weight: bold;
                                    color: var(--gold-primary);
                                ">${String.fromCharCode(65 + i)}</span>
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Exit Match Button -->
                <button id="match-exit-btn" class="glass-card" style="
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    padding: 8px 16px;
                    color: var(--text-muted);
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                ">🚪 EXIT MATCH</button>
            </div>
        `;

        this._startTimer();
        this._bindOptionButtons();
    }

    private _startTimer(): void {
        this._stopTimer();
        this._timeLeftSec = 30;
        this._startTimeMs = performance.now();

        const timerEl = document.getElementById('sb-timer');
        if (timerEl) timerEl.innerText = `${this._timeLeftSec}s`;

        this._timerInterval = setInterval(() => {
            this._timeLeftSec--;
            const timerEl = document.getElementById('sb-timer');
            if (timerEl) {
                timerEl.innerText = `${this._timeLeftSec}s`;
                if (this._timeLeftSec <= 5) {
                    timerEl.style.color = '#EF4444'; // Red alert countdown
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
                const chosenIdx = parseInt(target.getAttribute('data-index') || '0');
                this._onOptionSelected(chosenIdx, target);
            });
        });
    }

    private _onOptionSelected(chosenIndex: number, targetBtn: HTMLButtonElement): void {
        this._stopTimer();
        const responseTimeSec = parseFloat(((performance.now() - this._startTimeMs) / 1000).toFixed(1));
        const q = this._questions[this._currentIndex];
        const result = this._quizEngine.recordAnswer(chosenIndex === q.correctIndex, responseTimeSec);

        // Disable options
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => (b as HTMLButtonElement).disabled = true);

        if (result.isGoal) {
            targetBtn.style.background = 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)';
            targetBtn.style.borderColor = '#22C55E';
            this._audioManager.playGoalCheer();
            this._showGoalOverlay();
        } else {
            targetBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)';
            targetBtn.style.borderColor = '#EF4444';
            this._audioManager.playWhistle();

            // Highlight correct option
            const correctBtn = buttons[q.correctIndex] as HTMLButtonElement;
            if (correctBtn) {
                correctBtn.style.background = 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)';
            }
            this._showMissOverlay();
        }

        setTimeout(() => {
            this._currentIndex++;
            this._renderQuestion();
        }, 1500);
    }

    private _handleTimeOut(): void {
        this._quizEngine.recordAnswer(false, 30);
        this._audioManager.playWhistle();
        this._showMissOverlay('TIME OUT!');

        setTimeout(() => {
            this._currentIndex++;
            this._renderQuestion();
        }, 1500);
    }

    private _showGoalOverlay(): void {
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '24%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%) scale(1.1)';
        overlay.style.fontSize = '38px';
        overlay.style.fontWeight = '900';
        overlay.style.color = '#FFD700';
        overlay.style.background = 'rgba(15, 23, 42, 0.9)';
        overlay.style.border = '2px solid #FFD700';
        overlay.style.padding = '10px 30px';
        overlay.style.borderRadius = '30px';
        overlay.style.boxShadow = '0 0 30px rgba(255,215,0,0.6)';
        overlay.style.zIndex = '100';
        overlay.style.pointerEvents = 'none';
        overlay.style.whiteSpace = 'nowrap';
        overlay.innerText = '⚽ GOAL!!!!!';

        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 1200);
    }

    private _showMissOverlay(text: string = '🧤 SAVED!'): void {
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '24%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%) scale(1.1)';
        overlay.style.fontSize = '36px';
        overlay.style.fontWeight = '900';
        overlay.style.color = '#EF4444';
        overlay.style.background = 'rgba(15, 23, 42, 0.9)';
        overlay.style.border = '2px solid #EF4444';
        overlay.style.padding = '10px 30px';
        overlay.style.borderRadius = '30px';
        overlay.style.boxShadow = '0 0 30px rgba(239,68,68,0.6)';
        overlay.style.zIndex = '100';
        overlay.style.pointerEvents = 'none';
        overlay.style.whiteSpace = 'nowrap';
        overlay.innerText = text;

        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 1200);
    }

    private _renderHalfTimeSummary(): void {
        const root = this._uiManager.container;
        const stats = this._quizEngine.calculateFinalStats();

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
                    max-width: 450px;
                    padding: 30px;
                    text-align: center;
                ">
                    <h2 style="font-size: 32px; color: var(--gold-primary); margin: 0 0 10px 0;">⏸️ HALF TIME</h2>
                    <p style="color: var(--text-muted); margin-bottom: 20px;">FIRST HALF SUMMARY</p>

                    <div style="font-size: 40px; font-weight: 900; margin-bottom: 20px; color: white;">
                        GOALS: ${stats.goals}
                    </div>

                    <button id="continue-2nd-half-btn" class="broadcast-btn broadcast-btn-gold" style="width: 100%;">
                        START SECOND HALF ➡️
                    </button>
                </div>
            </div>
        `;

        document.getElementById('continue-2nd-half-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._currentIndex++;
            this._renderQuestion();
        });
    }

    public destroy(): void {
        this._stopTimer();
    }
}
