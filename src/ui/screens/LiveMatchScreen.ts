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
    private _matchId: string;
    private _opponent: UserRow;
    private _questions: ExtendedQuestionData[];
    private _onComplete: () => void;

    private _client: LiveMatchClient;
    private _currentIndex: number = 0;
    private _myScore: number = 0;
    private _opponentScore: number = 0;
    private _myAnswersCorrect: number = 0;

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
        this._matchId = matchId;
        this._opponent = opponent;
        this._questions = questions;
        this._onComplete = onComplete;

        this._client = new LiveMatchClient(matchId);
    }

    public startMatch(): void {
        console.log(`[LiveMatchScreen] Starting live match session ${this._matchId}`);
        this._client.connect();
        this._client.onEvent((evt: LiveMatchEventData) => {
            if (evt.userId === this._opponent.id && evt.event === 'ANSWER_SUBMITTED') {
                if (evt.score !== undefined) {
                    this._opponentScore = evt.score;
                }
                this.render();
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
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <!-- Top TV Broadcast Header Banner -->
                <div class="tv-broadcast-header" style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="tv-live-badge">
                            <span class="tv-live-dot"></span> LIVE 1v1 BROADCAST
                        </span>
                        <span class="tv-channel-logo">ETHIO TELECOM <span>SPORTS HD</span></span>
                    </div>

                    <div style="font-family: var(--tv-mono); font-weight: 800; font-size: 13px; color: var(--tv-gold-primary);">
                        ROUND ${this._currentIndex + 1} / ${this._questions.length}
                    </div>
                </div>

                <div style="max-width: 680px; margin: 0 auto; position: relative; z-index: 10; padding: 0 20px;">
                    <!-- Split-Screen Scoreboard Header -->
                    <div class="glass-card" style="
                        padding: 16px 20px;
                        margin-bottom: 20px;
                        border-color: #FFD700;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <!-- You -->
                        <div style="text-align: left;">
                            <div style="font-weight: 800; color: white; font-size: 15px;">👤 ${myProfile.username} (YOU)</div>
                            <div style="font-size: 12px; color: #60A5FA;">⚡ ${myProfile.eloRating || 1200} ELO</div>
                            <div style="font-size: 26px; font-weight: 900; color: #FFD700; margin-top: 4px;">${this._myScore} PTS</div>
                        </div>

                        <!-- VS Badge -->
                        <div style="
                            font-size: 18px;
                            font-weight: 900;
                            color: #EF4444;
                            background: rgba(239,68,68,0.2);
                            padding: 6px 14px;
                            border-radius: 20px;
                            border: 1px solid rgba(239,68,68,0.4);
                        ">VS</div>

                        <!-- Opponent -->
                        <div style="text-align: right;">
                            <div style="font-weight: 800; color: white; font-size: 15px;">👤 ${this._opponent.username}</div>
                            <div style="font-size: 12px; color: #60A5FA;">⚡ ${this._opponent.elo_rating} ELO</div>
                            <div style="font-size: 26px; font-weight: 900; color: #FFD700; margin-top: 4px;">${this._opponentScore} PTS</div>
                        </div>
                    </div>

                    <!-- Question Card -->
                    <div class="glass-card" style="padding: 28px; text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 12px; color: #94A3B8; font-weight: bold; margin-bottom: 10px;">
                            QUESTION ${this._currentIndex + 1} OF ${this._questions.length}
                        </div>
                        <h2 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 800; color: white; line-height: 1.4;">
                            ${q.prompt}
                        </h2>

                        <!-- Options Grid -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                            ${q.options.map((opt, idx) => `
                                <button class="live-option-btn broadcast-btn glass-card" data-index="${idx}" style="
                                    padding: 16px;
                                    font-size: 15px;
                                    color: white;
                                    text-align: left;
                                    border-color: rgba(255,255,255,0.15);
                                ">
                                    <span style="color: #FFD700; font-weight: bold; margin-right: 8px;">${['A', 'B', 'C', 'D'][idx]}.</span> ${opt}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._bindEvents(q);
    }

    private _bindEvents(q: ExtendedQuestionData): void {
        const root = this._uiManager.container;

        root.querySelectorAll('.live-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedIndex = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0', 10);
                const isCorrect = selectedIndex === q.correctIndex;

                if (isCorrect) {
                    this._audioManager.playGoalCheer();
                    this._myScore += 150;
                    this._myAnswersCorrect++;
                } else {
                    this._audioManager.playWhistle();
                }

                // Send live WebSocket broadcast
                this._client.sendAnswer('local-user', this._currentIndex, isCorrect, this._myScore);

                this._currentIndex++;
                this.render();
            });
        });
    }

    private _showFinalResults(): void {
        const root = this._uiManager.container;
        const myElo = this._saveManager.profile.eloRating || 1200;
        const isWinner = this._myScore > this._opponentScore;
        const isDraw = this._myScore === this._opponentScore;

        const eloResult = ELORatingSystem.calculateNewRatings(
            myElo,
            this._opponent.elo_rating,
            isWinner ? 1 : isDraw ? 0.5 : 0
        );

        // Update local ELO
        this._saveManager.profile.eloRating = eloResult.winnerNewElo;
        this._saveManager.addCoins(isWinner ? 300 : 100);

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 40px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 520px; margin: 0 auto; position: relative; z-index: 10; text-align: center;">
                    <div class="glass-card" style="
                        padding: 36px 28px;
                        border-color: ${isWinner ? '#FFD700' : '#EF4444'};
                        box-shadow: 0 20px 50px rgba(0,0,0,0.6);
                    ">
                        <div style="font-size: 54px; margin-bottom: 10px;">
                            ${isWinner ? '🏆' : isDraw ? '🤝' : '🧤'}
                        </div>
                        <h1 style="
                            margin: 0 0 8px 0;
                            font-size: 32px;
                            font-weight: 900;
                            color: ${isWinner ? '#FFD700' : isDraw ? '#60A5FA' : '#FCA5A5'};
                        ">
                            ${isWinner ? 'VICTORY!' : isDraw ? 'MATCH DRAW!' : 'DEFIEATED!'}
                        </h1>
                        <p style="color: #94A3B8; font-size: 14px; margin-bottom: 24px;">
                            FINAL SCORE: ${this._myScore} - ${this._opponentScore}
                        </p>

                        <!-- ELO & Rewards Summary -->
                        <div style="
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 14px;
                            margin-bottom: 24px;
                        ">
                            <div style="background: rgba(15,23,42,0.6); padding: 14px; border-radius: 12px;">
                                <div style="font-size: 11px; color: #94A3B8; font-weight: bold;">ELO RATING</div>
                                <div style="font-size: 22px; font-weight: 900; color: #60A5FA; margin-top: 4px;">
                                    ${eloResult.winnerNewElo} (${eloResult.winnerEloChange >= 0 ? '+' : ''}${eloResult.winnerEloChange})
                                </div>
                            </div>
                            <div style="background: rgba(15,23,42,0.6); padding: 14px; border-radius: 12px;">
                                <div style="font-size: 11px; color: #94A3B8; font-weight: bold;">COINS EARNED</div>
                                <div style="font-size: 22px; font-weight: 900; color: #FFD700; margin-top: 4px;">
                                    🪙 +${isWinner ? 300 : 100}
                                </div>
                            </div>
                        </div>

                        <button id="live-finish-btn" class="broadcast-btn broadcast-btn-gold" style="width: 100%; font-size: 16px;">
                            CONTINUE TO LEAGUE HUB
                        </button>
                    </div>
                </div>
            </div>
        `;

        root.querySelector('#live-finish-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._client.disconnect();
            this._onComplete();
        });
    }
}
