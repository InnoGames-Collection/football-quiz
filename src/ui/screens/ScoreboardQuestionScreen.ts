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

    // Match minute mapping for 10 questions (1st Half: 12', 24', 32', 39', 45' | 2nd Half: 53', 64', 75', 84', 90'+2')
    private _matchMinutes: string[] = ["12'", "24'", "32'", "39'", "45'", "53'", "64'", "75'", "84'", "90'+2'"];

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

    /**
     * 1. Animated Kick Off Screen (Before Question 1)
     */
    private _renderKickOffScreen(): void {
        const root = this._uiManager.container;
        const playerName = localStorage.getItem('ETHIO_FOOTBALL_USERNAME') || 'Walia Striker';
        const difficultyText = '⭐⭐⭐ NATIONAL LEAGUE DIFFICULTY';

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
                    padding: 36px 28px;
                    text-align: center;
                    border-color: var(--gold-primary);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
                ">
                    <!-- Competition Badge & Name -->
                    <div style="font-size: 54px; margin-bottom: 8px;">${this._competition.badge}</div>
                    <span style="font-size: 11px; font-weight: 900; color: var(--gold-primary); letter-spacing: 3px; text-transform: uppercase;">
                        ${this._competition.name}
                    </span>
                    
                    <h1 style="font-size: 32px; font-weight: 900; color: white; margin: 10px 0 6px 0;">
                        ⚽ TODAY'S MATCHDAY
                    </h1>
                    <div style="font-size: 13px; color: var(--pitch-green); font-weight: bold; margin-bottom: 24px;">
                        ${difficultyText}
                    </div>

                    <!-- Match Info Card -->
                    <div class="glass-card" style="padding: 18px 22px; margin-bottom: 24px; background: rgba(2, 6, 23, 0.85); text-align: left; border-color: rgba(255, 215, 0, 0.3);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="color: #94A3B8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">Player Name</span>
                            <span style="color: #FFFFFF; font-size: 14px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">👤 ${playerName}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="color: #94A3B8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">Match Type</span>
                            <span style="color: #60A5FA; font-size: 14px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">⚔️ League Fixture (10 Questions)</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #94A3B8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px;">Referee Official</span>
                            <span style="color: #FFD700; font-size: 14px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                                <span class="whistle-anim">🎷</span> FIFA Certified
                            </span>
                        </div>
                    </div>

                    <!-- Kick Off Button -->
                    <button id="kick-off-btn" class="broadcast-btn broadcast-btn-gold" style="width: 100%; font-size: 18px; padding: 18px;">
                        ⚡ KICK OFF MATCH
                    </button>
                </div>
            </div>
        `;

        document.getElementById('kick-off-btn')?.addEventListener('click', () => {
            this._audioManager.playWhistle();
            this._hasKickedOff = true;
            this._renderQuestion();
        });
    }

    /**
     * 2. Question Flow with Football Match Progression
     */
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

        // Half Time Check (After question 5 of 10)
        if (this._currentIndex === 5 && this._questions.length === 10 && !this._hasSeenHalfTime) {
            this._renderHalfTimeSummary();
            return;
        }

        const q = this._questions[this._currentIndex];
        const halfName = this._currentIndex < 5 ? "FIRST HALF" : "SECOND HALF";
        const matchMinute = this._matchMinutes[this._currentIndex] || `${Math.min(Math.round(((this._currentIndex + 1) / this._questions.length) * 90), 90)}'`;

        const root = this._uiManager.container;
        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <!-- Top Scoreboard Bar -->
                <div class="scoreboard-header" id="scoreboard-bar">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="tv-live-badge">
                            <span class="tv-live-dot"></span> LIVE HD
                        </span>
                        <span style="font-size: 22px;">${this._competition.badge}</span>
                        <div>
                            <div style="font-weight: 800; font-size: 13px; text-transform: uppercase; color: var(--tv-gold-primary); letter-spacing: 0.5px;">${this._competition.name}</div>
                            <div style="font-size: 11px; color: var(--tv-text-muted); font-weight: 600;">
                                <strong style="color: #60A5FA;">${halfName}</strong> • MINUTE: <span class="tv-minute-badge">${matchMinute}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Match Score & Question Counter -->
                    <div style="text-align: center;">
                        <div style="font-size: 20px; font-weight: 900; letter-spacing: 1px; font-family: var(--tv-mono);">
                            GOALS: <span id="sb-goals" style="color: var(--tv-pitch-green); transition: all 0.3s;">${this._quizEngine.calculateFinalStats().goals}</span>
                        </div>
                        <div style="font-size: 11px; color: var(--tv-text-muted); font-weight: 700; letter-spacing: 0.5px;">
                            MATCH PROGRESSION (${this._currentIndex + 1}/${this._questions.length})
                        </div>
                    </div>

                    <!-- Countdown Timer -->
                    <div class="glass-card" style="padding: 6px 14px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 16px;">⏱️</span>
                        <span id="sb-timer" style="font-size: 20px; font-weight: 900; color: var(--tv-gold-primary); font-family: var(--tv-mono);">30s</span>
                    </div>
                </div>

                <!-- Center Question Card Wrapper Container -->
                <div class="question-transition-in" style="
                    max-width: 640px;
                    margin: 30px auto 40px auto;
                    position: relative;
                    z-index: 10;
                    padding: 0 20px;
                " id="question-card-wrapper">
                    <!-- Glassmorphism Card -->
                    <div class="glass-card" style="padding: 28px 24px; text-align: center; margin-bottom: 20px; border-color: rgba(255, 215, 0, 0.3);" id="question-card-container">
                        <div style="font-size: 11px; font-weight: 800; color: var(--tv-pitch-green); letter-spacing: 1.5px; margin-bottom: 12px; text-transform: uppercase;">
                            ⚽ MATCH ATTACK • ${halfName} (${matchMinute})
                        </div>
                        <div style="font-size: 20px; font-weight: 700; line-height: 1.5; color: #FFFFFF; text-transform: none;">
                            ${q.prompt}
                        </div>
                    </div>

                    <!-- Answer Options Grid -->
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;" id="answer-grid">
                        ${q.options.map((opt, i) => `
                            <button class="broadcast-btn glass-card option-btn" data-index="${i}" style="
                                text-align: left;
                                justify-content: flex-start;
                                padding: 14px 18px;
                                font-size: 15px;
                                font-weight: 600;
                                color: #FFFFFF;
                                text-transform: none;
                                border: 1px solid var(--tv-glass-border);
                                position: relative;
                            ">
                                <span style="
                                    width: 28px;
                                    height: 28px;
                                    border-radius: 50%;
                                    background: rgba(255, 215, 0, 0.15);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 13px;
                                    font-weight: 800;
                                    color: var(--tv-gold-primary);
                                    margin-right: 10px;
                                    flex-shrink: 0;
                                ">${String.fromCharCode(65 + i)}</span>
                                ${opt}
                            </button>
                        `).join('')}
                    </div>

                    <!-- Exit Match Button Footer -->
                    <div style="margin-top: 24px; text-align: center;">
                        <button id="match-exit-btn" class="glass-card" style="
                            padding: 10px 20px;
                            color: var(--tv-text-muted);
                            font-size: 13px;
                            font-weight: 700;
                            cursor: pointer;
                            display: inline-flex;
                            align-items: center;
                            gap: 6px;
                            border-color: rgba(255,255,255,0.12);
                        ">🚪 EXIT MATCH</button>
                    </div>
                </div>
            </div>
        `;

        this._startTimer();
        this._bindOptionButtons();
    }

    private _hasSeenHalfTime: boolean = false;

    private _renderHalfTimeSummary(): void {
        this._hasSeenHalfTime = true;
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
                    max-width: 480px;
                    padding: 36px 28px;
                    text-align: center;
                    border-color: #60A5FA;
                ">
                    <div style="font-size: 48px; margin-bottom: 8px;">⏸️</div>
                    <span style="font-size: 11px; font-weight: 900; color: #60A5FA; letter-spacing: 3px;">
                        FIRST HALF COMPLETED (QUESTIONS 1–5)
                    </span>
                    <h2 style="font-size: 36px; font-weight: 900; color: white; margin: 10px 0 20px 0;">HALF TIME</h2>

                    <!-- Summary Stats Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; text-align: left;">
                        <div class="glass-card" style="padding: 14px; background: rgba(2,6,23,0.6);">
                            <div style="font-size: 11px; color: var(--text-muted);">1ST HALF GOALS</div>
                            <div style="font-size: 24px; font-weight: 900; color: var(--pitch-green);">⚽ ${stats.goals}</div>
                        </div>
                        <div class="glass-card" style="padding: 14px; background: rgba(2,6,23,0.6);">
                            <div style="font-size: 11px; color: var(--text-muted);">ACCURACY</div>
                            <div style="font-size: 24px; font-weight: 900; color: #60A5FA;">🎯 ${stats.accuracy}%</div>
                        </div>
                    </div>

                    <button id="continue-2nd-half-btn" class="broadcast-btn broadcast-btn-green" style="width: 100%; font-size: 18px; padding: 16px;">
                        ⚡ KICK OFF SECOND HALF ➡️
                    </button>
                </div>
            </div>
        `;

        document.getElementById('continue-2nd-half-btn')?.addEventListener('click', () => {
            this._audioManager.playWhistle();
            this._currentIndex++;
            this._renderQuestion();
        });
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
                if (this._timeLeftSec <= 5 && this._timeLeftSec > 0) {
                    timerEl.style.color = '#EF4444';
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
                const chosenIdx = parseInt(target.getAttribute('data-index') || '0');
                this._onOptionSelected(chosenIdx, target);
            });
        });
    }

    /**
     * 3. Correct Answer (GOAL) and 4. Wrong Answer (GOAL SAVED) Animations
     */
    private _onOptionSelected(chosenIndex: number, targetBtn: HTMLButtonElement): void {
        this._stopTimer();
        const responseTimeSec = parseFloat(((performance.now() - this._startTimeMs) / 1000).toFixed(1));
        const q = this._questions[this._currentIndex];
        const result = this._quizEngine.recordAnswer(chosenIndex === q.correctIndex, responseTimeSec);

        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => (b as HTMLButtonElement).disabled = true);

        if (result.isGoal) {
            targetBtn.style.background = 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)';
            targetBtn.style.borderColor = '#22C55E';
            targetBtn.style.boxShadow = '0 0 25px rgba(34, 197, 94, 0.8)';

            // Scoreboard flash
            const sb = document.getElementById('scoreboard-bar');
            if (sb) sb.classList.add('scoreboard-flash');

            // Floating XP text
            this._spawnFloatingXp(targetBtn, `+${result.xp} XP`);
            this._spawnConfetti();

            this._audioManager.playCorrectAnswer();
            this._audioManager.playGoalCheer();
            this._showGoalOverlay();
        } else {
            targetBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #991B1B 100%)';
            targetBtn.classList.add('red-flash-border');
            this._audioManager.playWrongAnswer();
            this._audioManager.playWhistle();

            // Camera shake on question card
            const wrapper = document.getElementById('question-card-wrapper');
            if (wrapper) wrapper.classList.add('camera-shake');

            // Highlight correct option
            const correctBtn = buttons[q.correctIndex] as HTMLButtonElement;
            if (correctBtn) {
                correctBtn.style.background = 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)';
                correctBtn.style.borderColor = '#22C55E';
            }
            this._showMissOverlay();
        }

        setTimeout(() => {
            this._currentIndex++;
            this._renderQuestion();
        }, 1600);
    }

    private _handleTimeOut(): void {
        this._quizEngine.recordAnswer(false, 30);
        this._audioManager.playWhistle();
        this._showMissOverlay('TIME OUT!');

        setTimeout(() => {
            this._currentIndex++;
            this._renderQuestion();
        }, 1600);
    }

    private _spawnFloatingXp(anchorEl: HTMLElement, text: string): void {
        const xpEl = document.createElement('div');
        xpEl.className = 'floating-xp';
        xpEl.innerText = text;
        const rect = anchorEl.getBoundingClientRect();
        xpEl.style.left = `${rect.left + rect.width / 2 - 30}px`;
        xpEl.style.top = `${rect.top - 20}px`;
        document.body.appendChild(xpEl);
        setTimeout(() => xpEl.remove(), 1200);
    }

    private _spawnConfetti(): void {
        const colors = ['#FFD700', '#22C55E', '#60A5FA', '#F59E0B', '#FFFFFF'];
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'confetti-particle';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.left = `${Math.random() * 100}vw`;
            p.style.top = `${Math.random() * 30 + 10}vh`;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1500);
        }
    }

    private _showGoalOverlay(): void {
        const overlay = document.createElement('div');
        overlay.className = 'goal-banner-anim';
        overlay.style.position = 'absolute';
        overlay.style.top = '28%';
        overlay.style.left = '50%';
        overlay.style.fontSize = '44px';
        overlay.style.fontWeight = '900';
        overlay.style.color = '#FFD700';
        overlay.style.background = 'rgba(15, 23, 42, 0.95)';
        overlay.style.border = '3px solid #22C55E';
        overlay.style.padding = '14px 40px';
        overlay.style.borderRadius = '40px';
        overlay.style.zIndex = '100';
        overlay.style.pointerEvents = 'none';
        overlay.style.whiteSpace = 'nowrap';
        overlay.innerHTML = '⚽ GOAL!!!!!';

        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 1400);
    }

    private _showMissOverlay(text: string = '🧤 GOAL SAVED!'): void {
        const overlay = document.createElement('div');
        overlay.className = 'goal-banner-anim';
        overlay.style.position = 'absolute';
        overlay.style.top = '28%';
        overlay.style.left = '50%';
        overlay.style.fontSize = '40px';
        overlay.style.fontWeight = '900';
        overlay.style.color = '#EF4444';
        overlay.style.background = 'rgba(15, 23, 42, 0.95)';
        overlay.style.border = '3px solid #EF4444';
        overlay.style.padding = '14px 40px';
        overlay.style.borderRadius = '40px';
        overlay.style.zIndex = '100';
        overlay.style.pointerEvents = 'none';
        overlay.style.whiteSpace = 'nowrap';
        overlay.innerHTML = text;

        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 1400);
    }

    public destroy(): void {
        this._stopTimer();
    }
}
