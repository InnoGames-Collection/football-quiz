import { DesignSystem } from "../theme/DesignSystem";
import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { i18n, t } from '../../localization/i18n';
import { QuizEngine, MatchStats } from '../../core/quiz/QuizEngine';
import { Competition } from '../../core/quiz/CompetitionRegistry';
import { GameSessionManager, GameSession } from '../../core/quiz/GameSessionManager';
import { ConfettiCanvas } from '../components/ConfettiCanvas';
import { RollingCounter } from '../components/RollingCounter';
import { EdgeFunctionClient } from '../../networking/supabase/EdgeFunctionClient';

export interface ScoreboardCallbacks {
    onMatchComplete: (stats: MatchStats, finalScore: number) => void;
    onExitMatch: () => void;
}

export interface QuestionData {
    id?: string;
    answerHash?: string;
    prompt: string;
    options: string[];
    correctIndex?: number;
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
    private _isDestroyed: boolean = false;
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

        // Push history state to intercept Android back button
        history.pushState({ match_active: true }, '');
        (window as any).ethioOnBackPress = () => {
            const modal = document.getElementById('match-exit-dialog');
            if (modal && modal.style.display !== 'none') {
                this._resumeMatch();
            } else {
                this._pauseMatch();
            }
            // Re-push state so next back press can be caught
            history.pushState({ match_active: true }, '');
            return true; 
        };

        this._renderQuestion(session.timeLeftSec);
    }

    private _renderKickOffScreen(): void {
        const root = this._uiManager.container;
        const playerName = localStorage.getItem('ETHIO_FOOTBALL_USERNAME') || 'Player';

        root.innerHTML = `
            <div class="stadium-container ethio-bg-quiz" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; min-height: 100vh;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <!-- Content -->
                <div style="position: relative; z-index: 10; width: 100%; max-width: 400px;">
                <button id="match-exit-btn" style="position: absolute; right: 16px; top: 16px; z-index: 100; background: rgba(0,0,0,0.5); border: none; color: var(--fds-text-main); font-weight: bold; cursor: pointer; font-size: 24px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">✕</button>
                <div class="glass-card" style="
                    width: 100%;
                    padding: 32px 24px;
                    text-align: center;
                    border-color: var(--tv-pitch-green);
                    background: rgba(30, 41, 59, 0.6);
                    backdrop-filter: blur(16px);
                    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.05);
                ">
                    <div style="font-size: 64px; margin-bottom: 16px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));">${this._competition.badge}</div>
                    <div style="font-size: 28px; font-weight: 900; color: white; margin-bottom: 8px; text-shadow: 0 2px 8px rgba(0,0,0,0.6);">${this._competition.name}</div>
                    <div style="font-size: var(--fds-font-sm); font-weight: 700; color: rgba(255,255,255,0.8); margin-bottom: 40px;">${i18n.currentLocale === 'am' ? `${playerName}፣ እውቀትዎን ለመፈተሽ ዝግጁ ነዎት?` : (i18n.currentLocale === 'om' ? `${playerName}, beekumsa kee qoruuf qophaa'aa?` : `Ready to test your knowledge, ${playerName}?`)}</div>
                    
                    <button id="kick-off-btn" style="
                        width: 100%; 
                        padding: 20px; 
                        background: linear-gradient(135deg, #22c55e, #15803d);
                        color: white; 
                        font-weight: 900; 
                        font-size: 24px; 
                        border: 2px solid #4ade80; 
                        border-radius: 16px; 
                        cursor: pointer;
                        box-shadow: 0 8px 24px rgba(34,197,94,0.5), inset 0 0 12px rgba(255,255,255,0.3);
                        transition: transform 0.2s, box-shadow 0.2s;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    ">${i18n.currentLocale === 'am' ? 'ጀምር' : (i18n.currentLocale === 'om' ? 'EGGALI' : 'KICK OFF')}</button>
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
        if (this._isDestroyed) return;
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
            <div class="stadium-container ethio-bg-quiz" style="pointer-events: auto; display: flex; flex-direction: column; min-height: 100vh; position: relative;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <button id="match-exit-btn" style="position: absolute; right: 16px; top: 16px; z-index: 100; background: rgba(0,0,0,0.5); border: none; color: var(--fds-text-main); font-weight: bold; cursor: pointer; font-size: 24px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">✕</button>
                
                <!-- PREMIUM GAMING HEADER -->
                <div style="
                    display: flex; 
                    flex-direction: column;
                    gap: 16px;
                    padding: 16px 20px; 
                    background: rgba(15,23,42,0.95);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    position: relative;
                    z-index: 10;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <!-- Score -->
                        <div style="text-align: left; flex: 1;">
                            <div style="font-size: 12px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Score</div>
                            <div style="font-size: 20px; font-weight: 900; color: var(--tv-gold-primary); text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${currentXP} Points</div>
                        </div>

                        <!-- Time -->
                        <div style="text-align: center; flex: 1; position: relative;">
                            <div style="font-size: 12px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Time</div>
                            <div id="timer-text" style="font-size: 32px; font-weight: 900; color: white; font-family: var(--fds-font-mono); font-variant-numeric: tabular-nums; text-shadow: 0 0 16px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.8); transition: color 0.3s, text-shadow 0.3s, transform 0.1s;">
                                00:${String(startTimerSec).padStart(2, '0')}
                            </div>
                        </div>

                        <!-- Question -->
                        <div style="text-align: right; flex: 1; position: relative;">
                            <div style="font-size: 12px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">${i18n.currentLocale === 'am' ? 'ጥያቄ' : (i18n.currentLocale === 'om' ? 'Gaaffii' : 'Question')}</div>
                            <div style="font-size: 20px; font-weight: 900; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                                ${this._currentIndex + 1}/${this._questions.length}
                            </div>
                        </div>
                    </div>

                    <!-- Clean Progress Bar -->
                    <div style="position: relative; height: 6px; background: rgba(0,0,0,0.5); border-radius: 6px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);">
                        <div style="
                            height: 100%; 
                            width: ${((this._currentIndex + 1) / this._questions.length) * 100}%; 
                            background: linear-gradient(90deg, #009A44 0%, #22C55E 100%); 
                            border-radius: 6px; 
                            transition: width 350ms cubic-bezier(0.16, 1, 0.3, 1);
                        "></div>
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
                    z-index: 10;
                    position: relative;
                ">
                    <!-- High-Focus Responsive Question Text -->
                    <div style="
                        font-size: clamp(20px, 5.5vw, 26px);
                        font-weight: 900;
                        color: var(--fds-text-main);
                        text-align: center;
                        line-height: 1.35;
                        box-shadow: 0 12px 32px rgba(0,0,0,0.5);
                    ">
                        <h2 style="font-size: 24px; font-weight: 800; color: white; line-height: 1.5; margin: 0; text-shadow: 0 2px 6px rgba(0,0,0,0.6);">
                            ${q.prompt}
                        </h2>
                    </div>

                    <!-- ANSWERS GRID -->
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${q.options.map((opt, i) => `
                            <button class="option-btn" data-index="${i}" style="
                                width: 100%;
                                padding: 20px 24px;
                                background: rgba(30,41,59,0.95);
                                border: 2px solid rgba(255,255,255,0.15);
                                border-radius: 16px;
                                color: white;
                                font-size: 18px;
                                font-weight: 800;
                                text-align: left;
                                cursor: pointer;
                                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                                display: flex;
                                align-items: center;
                                gap: 16px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                            ">
                                <span style="
                                    width: 32px; height: 32px; 
                                    border-radius: 50%; 
                                    background: rgba(255,255,255,0.1); 
                                    display: flex; align-items: center; justify-content: center; 
                                    margin-right: 16px; 
                                    font-size: var(--fds-font-sm); font-weight: 900;
                                    flex-shrink: 0;
                                ">${String.fromCharCode(65 + i)}</span>
                                <span style="flex: 1; word-break: break-word; line-height: 1.3;">${opt}</span>
                                <span class="feedback-icon" style="font-size: 24px; opacity: 0; transform: scale(0.5); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-left: 12px;"></span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- GAMEPLAY ANIMATION LAYER -->
                <div id="animation-layer"></div>

                <!-- MATCH EXIT CONFIRMATION DIALOG -->
                <div id="match-exit-dialog" style="
                    display: none; 
                    position: fixed; 
                    top: 0; left: 0; 
                    width: 100%; height: 100%; 
                    background: rgba(0, 0, 0, 0.4); 
                    backdrop-filter: blur(4px);
                    z-index: 10000; 
                    align-items: center; justify-content: center;
                    padding: 20px; box-sizing: border-box;
                    animation: fade-in 0.2s ease-out;
                ">
                    <div class="glass-card" style="
                        width: 100%; max-width: 320px; 
                        padding: 24px; text-align: center; 
                        border-radius: 20px;
                        background: rgba(15, 23, 42, 0.95);
                        border: 1px solid rgba(255,255,255,0.1);
                        box-shadow: 0 16px 40px rgba(0,0,0,0.5);
                    ">
                        <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px;">${t('match.leaveMatch')}</div>
                        <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-bottom: 24px;">${t('match.leaveWarning')}</div>
                        <div style="display: flex; gap: 12px;">
                            <div style="flex: 1;">
                                ${DesignSystem.Button({ id: 'btn-pause-leave', text: t('match.leaveBtn'), variant: 'secondary', fullWidth: true })}
                            </div>
                            <div style="flex: 1;">
                                ${DesignSystem.Button({ id: 'btn-pause-resume', text: t('match.continueBtn'), variant: 'primary', fullWidth: true })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .option-btn:active:not(:disabled) { transform: scale(0.98); }
                .option-btn.correct { background: rgba(34,197,94,0.15) !important; border-color: var(--fds-green-pitch) !important; }
                .option-btn.wrong { background: rgba(239,68,68,0.15) !important; border-color: var(--fds-red-live) !important; }
                .option-btn.correct .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: var(--fds-green-pitch); }
                .option-btn.wrong .feedback-icon { opacity: 1 !important; transform: scale(1) !important; color: var(--fds-red-live); }
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

        const timerText = document.getElementById('timer-text');

        const drawTimer = () => {
            if (timerText) {
                timerText.innerText = `00:${String(this._timeLeftSec).padStart(2, '0')}`;

                if (this._timeLeftSec <= 5) {
                    timerText.style.color = '#EF4444';
                    timerText.style.textShadow = '0 0 12px rgba(239, 68, 68, 0.6)';
                    timerText.style.transform = 'scale(1.1)';
                    setTimeout(() => { if(timerText) timerText.style.transform = 'scale(1)'; }, 150);
                    
                    if (this._timeLeftSec > 0 && this._timeLeftSec <= 5) {
                        this._audioManager.playCountdownWarning();
                    }
                } else {
                    timerText.style.color = 'white';
                    timerText.style.textShadow = '0 0 10px rgba(255,255,255,0.2)';
                    timerText.style.transform = 'scale(1)';
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
        
        const modal = document.getElementById('match-exit-dialog');
        if (modal) modal.style.display = 'flex';

        if (this._session) {
            this._session.state = 'Paused';
            GameSessionManager.getInstance().saveSession(this._session);
        }
    }

    private _resumeMatch(): void {
        this._isPaused = false;
        
        const modal = document.getElementById('match-exit-dialog');
        if (modal) modal.style.display = 'none';

        if (this._session) {
            this._session.state = 'Resumed';
            GameSessionManager.getInstance().saveSession(this._session);
        }

        this._startTimer(this._timeLeftSec);
    }

    private _leaveMatch(): void {
        this._stopTimer();
        if (this._session) {
            this._session.state = 'Paused';
            GameSessionManager.getInstance().saveSession(this._session);
        }
        (window as any).ethioOnBackPress = null;
        this._callbacks.onExitMatch();
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

    private async _onOptionSelected(chosenIndex: number, targetBtn: HTMLButtonElement): Promise<void> {
        let responseTimeSec = parseFloat(((performance.now() - this._startTimeMs) / 1000).toFixed(1));
        
        // Anti-cheat: prevent timer manipulation (> 15.5s)
        if (responseTimeSec > 15.5) {
            await this._handleTimeOut();
            return;
        }

        const q = this._questions[this._currentIndex];
        const correctIdx = await this._findCorrectIndex(q);

        const isCorrect = chosenIndex === correctIdx;
        
        this._quizEngine.recordAnswer(isCorrect, responseTimeSec, q.id, chosenIndex);
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
            this._audioManager.playGoalCheer();
            // ConfettiCanvas.burst is kept as extra juice
            ConfettiCanvas.burst(window.innerWidth / 2, window.innerHeight / 3, 50, ['#FFD700', '#22C55E', '#3B82F6', '#FFFFFF']);
            this._showFeedbackOverlay(true, 100);
            
            // Rolling Scoreboard Goal Counter
            const currentScore = this._quizEngine.calculateFinalStats().goals;
            const goalsEl = document.getElementById('match-goals');
            if (goalsEl) {
                RollingCounter.animate(goalsEl, currentScore - 1, currentScore, 600, (v) => `${Math.round(v)}`);
            }
        } else {
            targetBtn.classList.add('wrong');
            if (correctIdx !== undefined) {
                const correctBtn = buttons[correctIdx] as HTMLButtonElement;
                if (correctBtn) {
                    correctBtn.classList.add('correct');
                }
            }
            this._audioManager.playKeeperSave();
            this._showFeedbackOverlay(false);
        }

        setTimeout(() => {
            if (this._isDestroyed) return;
            this._hideFeedbackOverlay();
            this._currentIndex++;
            this._renderQuestion();
        }, 1500);
    }

    private _showFeedbackOverlay(isGoal: boolean, scoreGained: number = 0): void {
        const animLayer = document.getElementById('animation-layer');
        if (!animLayer) return;
        
        animLayer.innerHTML = ''; // clear any existing

        if (isGoal) {
            animLayer.innerHTML = `
                <div class="anim-overlay"></div>
                <div class="anim-sprite anim-goal-ball"></div>
            `;
            setTimeout(() => {
                if (document.getElementById('animation-layer')) {
                    document.getElementById('animation-layer')!.innerHTML += `
                        <div class="anim-impact anim-goal-impact"></div>
                    `;
                }
            }, 400);
            setTimeout(() => {
                if (document.getElementById('animation-layer')) {
                    document.getElementById('animation-layer')!.innerHTML += `
                        <div class="anim-particles"></div>
                        <div class="anim-text anim-text-goal"></div>
                    `;
                }
            }, 500);
            if (scoreGained > 0) {
                setTimeout(() => {
                    if (document.getElementById('animation-layer')) {
                        document.getElementById('animation-layer')!.innerHTML += `
                            <div class="anim-score-popup">
                                <div class="anim-score-popup-bg"></div>
                                <div class="anim-score-popup-text">+${scoreGained}</div>
                            </div>
                        `;
                    }
                }, 700);
            }
        } else {
            animLayer.innerHTML = `
                <div class="anim-sprite anim-gk-save"></div>
            `;
            setTimeout(() => {
                if (document.getElementById('animation-layer')) {
                    document.getElementById('animation-layer')!.innerHTML += `
                        <div class="anim-impact anim-save-impact"></div>
                    `;
                }
            }, 400);
            setTimeout(() => {
                if (document.getElementById('animation-layer')) {
                    document.getElementById('animation-layer')!.innerHTML += `
                        <div class="anim-text anim-text-saved"></div>
                    `;
                }
            }, 500);
        }
    }

    private _hideFeedbackOverlay(): void {
        const animLayer = document.getElementById('animation-layer');
        if (animLayer) animLayer.innerHTML = '';
    }

    private async _handleTimeOut(): Promise<void> {
        const responseTimeSec = 15;
        
        const q = this._questions[this._currentIndex];
        const correctIdx = await this._findCorrectIndex(q);

        this._quizEngine.recordAnswer(false, responseTimeSec, q.id, -1);
        this._audioManager.playWhistle();
        
        const buttons = document.querySelectorAll('.option-btn');
        if (correctIdx !== undefined) {
            const correctBtn = buttons[correctIdx] as HTMLButtonElement;
            if (correctBtn) {
                correctBtn.classList.add('correct');
            }
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
            if (this._isDestroyed) return;
            this._hideFeedbackOverlay();
            this._currentIndex++;
            this._renderQuestion();
        }, 1600);
    }

    private async _completeMatch(): Promise<void> {
        // Show loading state while validating with server
        this._showFeedbackOverlay(false);
        const text = document.getElementById('feedback-text');
        const sub = document.getElementById('feedback-subtext');
        if (text && sub) {
            text.innerText = 'VALIDATING...';
            sub.innerText = '';
        }

        let stats = this._quizEngine.calculateFinalStats();
        let finalScore = (stats.goals * 100) + (stats.accuracy * 5) + Math.round(Math.max(0, 15 - stats.avgResponseTime) * stats.goals * 15);
        if (stats.accuracy === 100) finalScore += 500;

        // Strict Edge Function Anti-Cheat Validation
        if (this._session) {
            const { data, error } = await EdgeFunctionClient.invoke('validate-match', {
                matchType: this._session.matchType,
                competitionId: this._competition.id,
                answers: this._quizEngine.answerSubmissions
            });

            if (!error && data) {
                if (!data.valid || data.anomalyDetected) {
                    console.error('[Anti-Cheat] Match rejected by server!');
                    finalScore = 0;
                    stats.goals = 0;
                    stats.coinsEarned = 0;
                    stats.xpEarned = 0;
                } else {
                    console.log('[Anti-Cheat] Match validated successfully.');
                    // Overwrite local stats with server authoritative stats
                    stats.goals = data.correctCount;
                    stats.correctAnswers = data.correctCount;
                    stats.coinsEarned = data.coinsEarned;
                    stats.xpEarned = data.xpEarned;
                    stats.accuracy = data.accuracy;
                }
            }
        }

        // Save session completion to history
        if (this._session) {
            GameSessionManager.getInstance().completeSession(this._session, finalScore);
        }

        // Save review game questions and choices
        localStorage.setItem('ETHIO_REVIEW_QUESTIONS', JSON.stringify(this._questions));
        localStorage.setItem('ETHIO_REVIEW_CHOICES', JSON.stringify(this._session ? this._session.choices : []));

        // Refresh cloud profile stats asynchronously
        import('../../core/auth/AuthManager').then(m => m.AuthManager.getInstance().refreshProfile());

        (window as any).ethioOnBackPress = null;
        this._callbacks.onMatchComplete(stats, finalScore);
    }
    
    public destroy(): void {
        this._isDestroyed = true;
        this._stopTimer();
        document.removeEventListener('visibilitychange', this._visibilityHandler);
        window.removeEventListener('ethio-network-offline', this._networkOfflineHandler);
        window.removeEventListener('ethio-network-online', this._networkOnlineHandler);
    }

    private async _findCorrectIndex(q: QuestionData): Promise<number | undefined> {
        let correctIdx = q.correctIndex;
        if (correctIdx === undefined && (q as any).answerHash) {
            for (let i = 0; i < 4; i++) {
                const hash = await this._sha256(`${q.id}:${i}:ethio-secret-salt`);
                if (hash === (q as any).answerHash) {
                    return i;
                }
            }
        }
        return correctIdx;
    }
    
    private async _sha256(str: string): Promise<string> {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
}
