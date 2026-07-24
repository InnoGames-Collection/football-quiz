import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { i18n } from '../../localization/i18n';
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
                this._showLeaveWarning();
            }
        };
        document.addEventListener('visibilitychange', this._visibilityHandler);

        // Network Monitor Listeners
        this._networkOfflineHandler = () => {
            if (this._hasKickedOff && !this._isPaused && this._currentIndex < this._questions.length) {
                this._showLeaveWarning();
                const text = document.getElementById('match-exit-dialog')?.querySelector('div > div:nth-child(2)');
                if (text) {
                    text.innerHTML = '⚠️ Your connection was lost. Reconnect to continue playing.';
                }
            }
        };
        this._networkOnlineHandler = () => {
            if (this._hasKickedOff && this._isPaused && this._currentIndex < this._questions.length) {
                this._hideLeaveWarning();
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
        
        history.pushState({ match_active: true }, '');
        (window as any).ethioOnBackPress = () => {
            const modal = document.getElementById('match-exit-dialog');
            if (modal && modal.style.display !== 'none') {
                this._hideLeaveWarning();
            } else {
                this._showLeaveWarning();
            }
            history.pushState({ match_active: true }, '');
            return true; 
        };

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
                this._hideLeaveWarning();
            } else {
                this._showLeaveWarning();
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

                <!-- PREMIUM GAMING HEADER -->
                <div style="
                    display: flex; 
                    flex-direction: column;
                    background: rgba(15,23,42,0.95);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    position: relative;
                    z-index: 10;
                ">
                    <!-- Top Bar Info Row -->
                    <div class="top-bar-row" style="
                        display: flex; 
                        align-items: center; 
                        justify-content: space-between; 
                        gap: 8px;
                        padding: 12px 16px;
                        width: 100%;
                        box-sizing: border-box;
                    ">
                        <!-- Leave Button -->
                        <button id="match-exit-btn" class="top-bar-chip" style="
                            background: rgba(255,255,255,0.1); 
                            border: 1px solid rgba(255,255,255,0.15); 
                            color: white; 
                            font-weight: 800; 
                            font-size: clamp(12px, 3.5vw, 14px); 
                            padding: 8px 14px; 
                            border-radius: 20px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            white-space: nowrap;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                            transition: background 0.2s;
                        ">
                            <span class="top-bar-icon" style="font-size: 16px;">←</span> <span class="top-bar-text">Leave</span>
                        </button>
                        
                        <!-- Score Chip -->
                        <div class="top-bar-chip" style="
                            background: rgba(0,0,0,0.4);
                            border: 1px solid rgba(255,255,255,0.1);
                            padding: 6px 14px;
                            border-radius: 20px;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            white-space: nowrap;
                        ">
                            <span class="top-bar-icon" style="font-size: 16px;">⚽</span>
                            <span id="match-score" class="top-bar-text" style="font-size: clamp(14px, 4vw, 16px); font-weight: 900; color: var(--tv-gold-primary); text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${currentXP}</span>
                        </div>

                        <!-- Timer Chip -->
                        <div id="timer-chip" class="top-bar-chip" style="
                            background: rgba(0,0,0,0.4);
                            border: 1px solid rgba(255,255,255,0.1);
                            padding: 6px 14px;
                            border-radius: 20px;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            white-space: nowrap;
                            transition: all 0.3s ease;
                        ">
                            <span class="top-bar-icon" style="font-size: 16px;">⏱️</span>
                            <span id="timer-text" class="top-bar-text" style="font-size: clamp(14px, 4vw, 16px); font-weight: 900; color: white; font-family: var(--fds-font-mono); font-variant-numeric: tabular-nums;">
                                ${String(startTimerSec)}s
                            </span>
                        </div>

                        <!-- Progress Chip -->
                        <div class="top-bar-chip" style="
                            background: rgba(0,0,0,0.4);
                            border: 1px solid rgba(255,255,255,0.1);
                            padding: 6px 14px;
                            border-radius: 20px;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            white-space: nowrap;
                        ">
                            <span class="top-bar-icon" style="font-size: 16px;">📝</span>
                            <span class="top-bar-text" style="font-size: clamp(14px, 4vw, 16px); font-weight: 900; color: white;">
                                ${this._currentIndex + 1}/${this._questions.length}
                            </span>
                        </div>
                    </div>

                    <!-- Clean Progress Bar -->
                    <div style="position: relative; height: 4px; background: rgba(0,0,0,0.5); overflow: hidden;">
                        <div style="
                            height: 100%; 
                            width: ${((this._currentIndex + 1) / this._questions.length) * 100}%; 
                            background: linear-gradient(90deg, #009A44 0%, #22C55E 100%); 
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
                    <div id="feedback-text" style="font-size: var(--fds-font-xl); font-weight: 900; letter-spacing: 2px; margin-top: 12px; text-transform: uppercase; font-family: var(--tv-mono);"></div>
                    <div id="feedback-subtext" style="font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-top: 4px; font-weight: 700;"></div>
                </div>

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
                        <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px;">Leave Match?</div>
                        <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-bottom: 24px; line-height: 1.4;">Your current match progress will be lost.<br/><br/>Are you sure you want to leave?</div>
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <button id="btn-pause-resume" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #22c55e, #15803d); color: white; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(34,197,94,0.3);">Continue Playing</button>
                            <button id="btn-pause-leave" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white; font-weight: bold; font-size: 16px; cursor: pointer;">Leave Match</button>
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
                
                @keyframes subtle-pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0px rgba(245, 158, 11, 0); }
                    50% { transform: scale(1.05); box-shadow: 0 0 12px rgba(245, 158, 11, 0.5); border-color: rgba(245, 158, 11, 0.8); }
                    100% { transform: scale(1); box-shadow: 0 0 0px rgba(245, 158, 11, 0); }
                }
                .time-low {
                    animation: subtle-pulse 1s infinite ease-in-out;
                    color: #F59E0B !important;
                    border-color: rgba(245, 158, 11, 0.5) !important;
                }
                .time-low span {
                    color: #F59E0B !important;
                }
                
                @media (max-width: 420px) {
                    .top-bar-row {
                        padding: 8px 4px !important;
                        gap: 4px !important;
                    }
                    .top-bar-chip {
                        padding: 4px 6px !important;
                        gap: 4px !important;
                    }
                    .top-bar-icon {
                        font-size: 13px !important;
                    }
                    .top-bar-text {
                        font-size: 13px !important;
                    }
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
                timerText.innerText = `${String(this._timeLeftSec)}s`;
                const timerChip = document.getElementById('timer-chip');
                if (timerChip) {
                    if (this._timeLeftSec <= 5) {
                        timerChip.classList.add('time-low');
                        if (this._timeLeftSec > 0) {
                            this._audioManager.playCountdownWarning();
                        }
                    } else {
                        timerChip.classList.remove('time-low');
                    }
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

    private _showLeaveWarning(): void {
        const modal = document.getElementById('match-exit-dialog');
        if (modal) modal.style.display = 'flex';
    }

    private _hideLeaveWarning(): void {
        const modal = document.getElementById('match-exit-dialog');
        if (modal) modal.style.display = 'none';
    }

    private _leaveMatch(): void {
        this._stopTimer();
        if (this._session) {
            GameSessionManager.getInstance().clearSession();
        }
        (window as any).ethioOnBackPress = null;
        this._callbacks.onExitMatch();
    }

    private _bindPauseButtons(): void {
        document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._hideLeaveWarning();
        });

        document.getElementById('btn-pause-leave')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._leaveMatch();
        });
    }

    private _bindOptionButtons(): void {
        document.getElementById('match-exit-btn')?.addEventListener('click', () => {
            this._showLeaveWarning();
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
            ConfettiCanvas.burst(window.innerWidth / 2, window.innerHeight / 3, 50, ['#FFD700', '#22C55E', '#3B82F6', '#FFFFFF']);
            this._showFeedbackOverlay(true);
            
            // Rolling Scoreboard Score Counter
            const currentScore = this._quizEngine.calculateFinalStats().goals;
            const scoreEl = document.getElementById('match-score');
            if (scoreEl) {
                RollingCounter.animate(scoreEl, (currentScore - 1) * 100, currentScore * 100, 600, (v) => `${Math.round(v)}`);
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
        }, 1300);
    }

    private _showFeedbackOverlay(isGoal: boolean): void {
        const overlay = document.getElementById('feedback-overlay');
        const anim = document.getElementById('feedback-anim');
        const text = document.getElementById('feedback-text');
        const sub = document.getElementById('feedback-subtext');
        
        if (overlay && anim && text && sub) {
            overlay.style.borderColor = isGoal ? 'var(--tv-pitch-green)' : 'var(--tv-gold-primary)';
            overlay.style.background = isGoal 
                ? 'linear-gradient(135deg, rgba(34,197,94,0.25) 0%, rgba(15,23,42,0.96) 100%)' 
                : 'linear-gradient(135deg, rgba(255,215,0,0.18) 0%, rgba(15,23,42,0.96) 100%)';
            overlay.style.color = isGoal ? 'var(--tv-pitch-green)' : 'var(--tv-gold-primary)';
            
            anim.innerText = isGoal ? '⚽🥅' : '🧤⚽';
            anim.style.animation = isGoal ? 'goal-bounce 0.6s ease-in-out infinite' : 'save-shake 0.4s ease-in-out infinite';
            
            text.innerText = isGoal ? 'GOAL!' : 'SAVED!';
            sub.innerText = isGoal ? 'Brilliant strike into the net!' : 'Keeper parries the shot away!';
            
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
