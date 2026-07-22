import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { QuizEngine, MatchStats } from '../../core/quiz/QuizEngine';
import { Competition } from '../../core/quiz/CompetitionRegistry';
import { GameSessionManager, GameSession } from '../../core/quiz/GameSessionManager';

export interface ScoreboardCallbacks {
    onMatchComplete: (stats: MatchStats, finalScore: number) => void;
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
    private _timeLeftSec: number = 15;
    private _startTimeMs: number = 0;
    private _hasKickedOff: boolean = false;
    
    private _session: GameSession | null = null;
    private _isPaused: boolean = false;
    private _visibilityHandler: () => void;
    private _networkOfflineHandler: () => void;
    private _networkOnlineHandler: () => void;

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

        // Visibility / Pause Listener
        this._visibilityHandler = () => {
            if (document.visibilityState === 'hidden' && this._hasKickedOff && !this._isPaused && this._currentIndex < this._questions.length) {
                this._pauseMatch();
            }
        };
        document.addEventListener('visibilitychange', this._visibilityHandler);

        // Network Monitor Listeners
        this._networkOfflineHandler = () => {
            if (this._hasKickedOff && !this._isPaused && this._currentIndex < this._questions.length) {
                this._pauseMatch();
                const text = document.getElementById('pause-modal')?.querySelector('div > div:nth-child(3)');
                if (text) {
                    text.innerHTML = '⚠️ Your connection was lost. Reconnect to resume your match.';
                }
            }
        };
        this._networkOnlineHandler = () => {
            if (this._hasKickedOff && this._isPaused && this._currentIndex < this._questions.length) {
                this._resumeMatch();
            }
        };
        window.addEventListener('ethio-network-offline', this._networkOfflineHandler);
        window.addEventListener('ethio-network-online', this._networkOnlineHandler);
    }

    public startMatch(): void {
        this._quizEngine.reset();
        this._currentIndex = 0;
        this._hasKickedOff = false;
        
        // Initialize Game Session Manager
        this._session = GameSessionManager.getInstance().createSession(
            this._competition.id,
            'Medium',
            this._questions
        );

        localStorage.setItem('ETHIO_REVIEW_CHOICES', '[]');
        this._renderKickOffScreen();
    }

    public resumeSession(session: GameSession): void {
        this._quizEngine.reset();
        this._session = session;
        this._questions = session.questions;
        this._currentIndex = session.currentIndex;
        this._hasKickedOff = true;
        this._isPaused = false;

        // Restore quiz engine stats from session progress
        for (let i = 0; i < session.choices.length; i++) {
            const chosen = session.choices[i];
            const correct = session.questions[i].correctIndex;
            const time = session.responseTimes[i];
            this._quizEngine.recordAnswer(chosen === correct, time);
        }

        // Restore reviews cache in localStorage
        localStorage.setItem('ETHIO_REVIEW_CHOICES', JSON.stringify(session.choices));
        localStorage.setItem('ETHIO_REVIEW_QUESTIONS', JSON.stringify(session.questions));

        this._renderQuestion(session.timeLeftSec);
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
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    ">KICK OFF</button>
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

    private _renderQuestion(startTimerSec: number = 15): void {
        if (!this._hasKickedOff) {
            this._renderKickOffScreen();
            return;
        }

        if (this._currentIndex >= this._questions.length) {
            this._stopTimer();
            this._completeMatch();
            return;
        }

        const q = this._questions[this._currentIndex];
        const root = this._uiManager.container;
        const currentGoals = this._quizEngine.calculateFinalStats().goals;
        const currentXP = currentGoals * 100;
        
        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; display: flex; flex-direction: column;">
                
                <!-- TOP BAR WITH QUESTION PROGRESS, CIRCULAR TIMER & SCORE -->
                <div style="
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 12px 16px; 
                    background: rgba(15,23,42,0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    position: relative;
                ">
                    <!-- Left: Question Progress -->
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button id="match-exit-btn" style="background: none; border: none; color: #94A3B8; font-size: 18px; cursor: pointer; padding: 4px;">✕</button>
                        <div style="font-size: 14px; font-weight: 800; color: #94A3B8;">
                            ${this._currentIndex + 1} / ${this._questions.length}
                        </div>
                    </div>

                    <!-- Center: Football-themed Circular Timer -->
                    <div style="display: flex; align-items: center; justify-content: center; position: relative; width: 44px; height: 44px;">
                        <svg width="44" height="44" viewBox="0 0 44 44" style="transform: rotate(-90deg);">
                            <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,0.1)" stroke-width="3" fill="none" />
                            <circle id="timer-circle" cx="22" cy="22" r="18" stroke="var(--tv-pitch-green)" stroke-width="3" fill="none" 
                                    stroke-dasharray="113.1" stroke-dashoffset="0" style="transition: stroke-dashoffset 1s linear, stroke 0.3s;" />
                        </svg>
                        <span id="timer-text" style="position: absolute; font-size: 13px; font-weight: 900; color: white; font-family: monospace;">15</span>
                    </div>

                    <!-- Right: Current Score -->
                    <div style="font-size: 13px; font-weight: 900; color: var(--tv-gold-primary); text-transform: uppercase;">
                        Score: ${currentXP}
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
                    box-sizing: border-box;
                ">
                    <!-- High-Focus Responsive Question Text -->
                    <div style="
                        font-size: clamp(16px, 4.5vw, 22px);
                        font-weight: 900;
                        color: white;
                        text-align: center;
                        line-height: 1.4;
                        margin-bottom: 24px;
                        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
                        width: 100%;
                        box-sizing: border-box;
                    ">${q.prompt}</div>

                    <!-- Responsive Answer Buttons -->
                    <div style="display: flex; flex-direction: column; gap: 12px; width: 100%; box-sizing: border-box;">
                        ${q.options.map((opt, i) => `
                            <button class="option-btn" data-index="${i}" style="
                                display: flex;
                                align-items: center;
                                width: 100%;
                                padding: 14px 16px;
                                background: rgba(255,255,255,0.03);
                                border: 2px solid rgba(255,255,255,0.1);
                                border-radius: 12px;
                                color: white;
                                font-size: clamp(13px, 3.5vw, 15px);
                                font-weight: 700;
                                text-align: left;
                                cursor: pointer;
                                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                                position: relative;
                                overflow: hidden;
                                box-sizing: border-box;
                            ">
                                <span style="
                                    width: 28px; height: 28px; 
                                    border-radius: 50%; 
                                    background: rgba(255,255,255,0.1); 
                                    display: flex; align-items: center; justify-content: center; 
                                    margin-right: 12px; 
                                    font-size: 13px; font-weight: 900;
                                    flex-shrink: 0;
                                ">${String.fromCharCode(65 + i)}</span>
                                <span style="flex: 1; word-break: break-word;">${opt}</span>
                                <span class="feedback-icon" style="font-size: 20px; opacity: 0; transform: scale(0.5); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-left: 8px;"></span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- TRANSLUCENT FEEDBACK OVERLAY -->
                <div id="feedback-overlay" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 1000;
                    padding: 24px;
                    border-radius: 16px;
                    text-align: center;
                    min-width: 260px;
                    backdrop-filter: blur(8px);
                    border: 2px solid;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                    box-sizing: border-box;
                ">
                    <div id="feedback-anim" style="font-size: 64px; display: inline-block;">⚽</div>
                    <div id="feedback-text" style="font-size: 28px; font-weight: 900; letter-spacing: 2px; margin-top: 12px; text-transform: uppercase; font-family: var(--tv-mono);"></div>
                    <div id="feedback-subtext" style="font-size: 13px; color: #CBD5E1; margin-top: 4px; font-weight: 700;"></div>
                </div>

                <!-- PAUSE MODAL OVERLAY -->
                <div id="pause-modal" style="
                    display: none; 
                    position: fixed; 
                    top: 0; left: 0; 
                    width: 100%; height: 100%; 
                    background: rgba(15,23,42,0.95); 
                    z-index: 10000; 
                    align-items: center; justify-content: center;
                    padding: 20px; box-sizing: border-box;
                ">
                    <div class="glass-card" style="width: 100%; max-width: 360px; padding: 28px 20px; text-align: center; border-color: var(--tv-gold-primary);">
                        <div style="font-size: 48px; margin-bottom: 12px;">⏸️</div>
                        <div style="font-size: 22px; font-weight: 900; color: white; margin-bottom: 6px;">GAME PAUSED</div>
                        <div style="font-size: 14px; color: #94A3B8; margin-bottom: 24px;">Your match has been paused. Progress is safely saved.</div>
                        <button id="btn-pause-resume" style="width: 100%; padding: 14px; background: var(--tv-pitch-green); color: white; border: none; border-radius: 8px; font-weight: 800; margin-bottom: 12px; cursor: pointer;">RESUME MATCH</button>
                        <button id="btn-pause-leave" style="width: 100%; padding: 14px; background: rgba(239,68,68,0.1); border: 1px solid #EF4444; color: #EF4444; border-radius: 8px; font-weight: 800; cursor: pointer;">LEAVE MATCH</button>
                    </div>
                </div>
            </div>
            
            <style>
                .option-btn:active:not(:disabled) { transform: scale(0.98); }
                .option-btn.correct { background: rgba(34,197,94,0.15) !important; border-color: #22C55E !important; }
                .option-btn.wrong { background: rgba(239,68,68,0.15) !important; border-color: #EF4444 !important; }
                .option-btn.correct .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: #22C55E; }
                .option-btn.wrong .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: #EF4444; }
                .option-btn.correct .feedback-icon::after { content: '✓'; }
                .option-btn.wrong .feedback-icon::after { content: '✕'; }

                @keyframes goal-bounce {
                    0% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.2); text-shadow: 0 10px 20px rgba(34,197,94,0.5); }
                    100% { transform: translateY(0) scale(1); }
                }
                @keyframes save-shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-12px); }
                    40%, 80% { transform: translateX(12px); }
                }
            </style>
        `;

        this._startTimer(startTimerSec);
        this._bindOptionButtons();
        this._bindPauseButtons();
    }

    private _startTimer(startVal: number = 15): void {
        this._stopTimer();
        this._timeLeftSec = startVal;
        this._startTimeMs = performance.now();

        const timerCircle = document.getElementById('timer-circle');
        const timerText = document.getElementById('timer-text');

        const drawTimer = () => {
            if (timerCircle && timerText) {
                // Circumference = 2 * PI * 18 = 113.1
                const offset = 113.1 - (this._timeLeftSec / 15) * 113.1;
                timerCircle.style.strokeDashoffset = String(offset);
                
                timerText.innerText = String(this._timeLeftSec);

                if (this._timeLeftSec <= 5) {
                    timerCircle.style.stroke = '#EF4444';
                    timerText.style.color = '#EF4444';
                    this._audioManager.playCountdownWarning();
                } else {
                    timerCircle.style.stroke = 'var(--tv-pitch-green)';
                    timerText.style.color = 'white';
                }
            }
        };

        drawTimer();

        this._timerInterval = setInterval(() => {
            if (this._isPaused) return;

            this._timeLeftSec--;
            
            drawTimer();

            // Save remaining time to active session state for resumption auto-save
            if (this._session) {
                this._session.timeLeftSec = this._timeLeftSec;
                GameSessionManager.getInstance().saveSession(this._session);
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

    private _pauseMatch(): void {
        this._isPaused = true;
        this._stopTimer();
        
        const modal = document.getElementById('pause-modal');
        if (modal) modal.style.display = 'flex';

        if (this._session) {
            this._session.state = 'Paused';
            GameSessionManager.getInstance().saveSession(this._session);
        }
    }

    private _resumeMatch(): void {
        this._isPaused = false;
        
        const modal = document.getElementById('pause-modal');
        if (modal) modal.style.display = 'none';

        if (this._session) {
            this._session.state = 'Resumed';
            GameSessionManager.getInstance().saveSession(this._session);
        }

        this._startTimer(this._timeLeftSec);
    }

    private _leaveMatch(): void {
        if (confirm('Leave Match?\nYour progress will be saved as Abandoned and this match will end.')) {
            this._stopTimer();
            if (this._session) {
                GameSessionManager.getInstance().abandonSession(this._session);
            }
            this._callbacks.onExitMatch();
        }
    }

    private _bindPauseButtons(): void {
        document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._resumeMatch();
        });

        document.getElementById('btn-pause-leave')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._leaveMatch();
        });
    }

    private _bindOptionButtons(): void {
        document.getElementById('match-exit-btn')?.addEventListener('click', () => {
            this._pauseMatch();
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
        let responseTimeSec = parseFloat(((performance.now() - this._startTimeMs) / 1000).toFixed(1));
        
        // Anti-cheat: prevent timer manipulation (> 15.5s)
        if (responseTimeSec > 15.5) {
            this._handleTimeOut();
            return;
        }

        const q = this._questions[this._currentIndex];
        const isCorrect = chosenIndex === q.correctIndex;
        
        this._quizEngine.recordAnswer(isCorrect, responseTimeSec);
        const currentGoals = this._quizEngine.calculateFinalStats().goals;

        // Auto Save progress immediately to local storage
        if (this._session) {
            GameSessionManager.getInstance().autoSaveProgress(
                this._session,
                this._currentIndex + 1,
                chosenIndex,
                responseTimeSec,
                isCorrect,
                currentGoals * 100,
                15
            );
        }

        const buttons = document.querySelectorAll('.option-btn');

        if (isCorrect) {
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
        }, 1600);
    }

    private _showFeedbackOverlay(isGoal: boolean): void {
        const overlay = document.getElementById('feedback-overlay');
        const anim = document.getElementById('feedback-anim');
        const text = document.getElementById('feedback-text');
        const sub = document.getElementById('feedback-subtext');
        
        if (overlay && anim && text && sub) {
            overlay.style.borderColor = isGoal ? 'var(--tv-pitch-green)' : '#EF4444';
            overlay.style.background = isGoal 
                ? 'linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(15,23,42,0.95) 100%)' 
                : 'linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(15,23,42,0.95) 100%)';
            overlay.style.color = isGoal ? 'var(--tv-pitch-green)' : '#EF4444';
            
            anim.innerText = isGoal ? '⚽🥅' : '🧤❌';
            anim.style.animation = isGoal ? 'goal-bounce 0.8s ease-in-out infinite' : 'save-shake 0.5s ease-in-out infinite';
            
            text.innerText = isGoal ? 'GOAL!' : 'SAVED!';
            sub.innerText = isGoal ? 'Brilliant strike!' : 'Keeper parries it away!';
            
            overlay.style.opacity = '1';
            overlay.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }

    private _hideFeedbackOverlay(): void {
        const overlay = document.getElementById('feedback-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }
    }

    private _handleTimeOut(): void {
        const responseTimeSec = 15;
        this._quizEngine.recordAnswer(false, responseTimeSec);
        this._audioManager.playWhistle();
        
        const q = this._questions[this._currentIndex];
        const buttons = document.querySelectorAll('.option-btn');
        const correctBtn = buttons[q.correctIndex] as HTMLButtonElement;
        if (correctBtn) {
            correctBtn.classList.add('correct');
        }

        // Auto Save Timeout Progress
        const currentGoals = this._quizEngine.calculateFinalStats().goals;
        if (this._session) {
            GameSessionManager.getInstance().autoSaveProgress(
                this._session,
                this._currentIndex + 1,
                -1,
                responseTimeSec,
                false,
                currentGoals * 100,
                15
            );
        }

        this._showFeedbackOverlay(false);
        const text = document.getElementById('feedback-text');
        const sub = document.getElementById('feedback-subtext');
        if (text && sub) {
            text.innerText = 'TIME OUT!';
            sub.innerText = 'Speed up next time!';
        }

        setTimeout(() => {
            this._hideFeedbackOverlay();
            this._currentIndex++;
            this._renderQuestion();
        }, 1600);
    }

    private _completeMatch(): void {
        const stats = this._quizEngine.calculateFinalStats();
        
        // Calculate Final Score using User scoring parameters:
        // Base Score + Accuracy Bonus + Speed Bonus + Perfect Match Bonus = Final Score
        const baseScore = stats.goals * 100;
        
        const accuracyPercent = stats.accuracy; // 0-100
        const accuracyBonus = accuracyPercent * 5; // e.g. 500 max

        // Speed Bonus: Average remaining time per correct answer * 15 points
        // Response time is average response time, so remaining is (15 - avgResponseTime)
        const remainingTimeSec = Math.max(0, 15 - stats.avgResponseTime);
        const speedBonus = Math.round(remainingTimeSec * stats.goals * 15);

        const perfectBonus = accuracyPercent === 100 ? 500 : 0;

        const finalScore = baseScore + accuracyBonus + speedBonus + perfectBonus;

        // Save session completion to history
        if (this._session) {
            GameSessionManager.getInstance().completeSession(this._session, finalScore);
        }

        // Save review game questions
        localStorage.setItem('ETHIO_REVIEW_QUESTIONS', JSON.stringify(this._questions));

        this._callbacks.onMatchComplete(stats, finalScore);
    }
    
    public destroy(): void {
        this._stopTimer();
        document.removeEventListener('visibilitychange', this._visibilityHandler);
        window.removeEventListener('ethio-network-offline', this._networkOfflineHandler);
        window.removeEventListener('ethio-network-online', this._networkOnlineHandler);
    }
}
