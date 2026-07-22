import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { MatchStats } from '../../core/quiz/QuizEngine';
import { MatchSubmissionService } from '../../networking/api/MatchSubmissionService';
import { QuizEngine } from '../../core/quiz/QuizEngine';
import { Toast } from '../components/Toast';
import { RollingCounter } from '../components/RollingCounter';
import { ConfettiCanvas } from '../components/ConfettiCanvas';

export class MatchStatsScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _stats: MatchStats;
    private _gameId: string;
    private _onContinue: () => void;

    private _finalScore: number;
    private _quizEngine?: QuizEngine;

    constructor(
        uiManager: UIManager,
        saveManager: SaveManager,
        audioManager: AudioManager,
        stats: MatchStats,
        finalScore: number,
        gameId: string,
        onContinue: () => void,
        quizEngine?: QuizEngine
    ) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._stats = stats;
        this._finalScore = finalScore;
        this._gameId = gameId;
        this._onContinue = onContinue;
        this._quizEngine = quizEngine;

        this._saveManager.updateHighScore(this._gameId, this._finalScore);
    }

    public render(): void {
        const root = this._uiManager.container;
        const correct = this._stats.goals;
        const wrong = this._stats.incorrectAnswers;

        root.innerHTML = `
            <div class="stadium-container" style="display: flex; align-items: center; justify-content: center; height: 100vh;">
                <div style="color: white; font-weight: bold;">Loading Rewards...</div>
            </div>
        `;

        this._submitAndRender(root, correct, wrong);
    }

    private async _submitAndRender(root: HTMLElement, correct: number, wrong: number): Promise<void> {
        let earnedXp = this._stats.xpEarned;
        let earnedCoins = this._stats.coinsEarned;

        if (this._quizEngine) {
            try {
                const result = await MatchSubmissionService.getInstance().submitMatch({
                    matchType: 'solo',
                    competitionId: this._gameId,
                    answers: this._quizEngine.answerSubmissions
                });
                if (result.success) {
                    earnedXp = result.xp ?? earnedXp;
                    earnedCoins = result.coins ?? earnedCoins;
                    console.log('Match submitted successfully', result);
                }
            } catch (err) {
                console.warn('Failed to submit match to backend, using local stats', err);
            }
        }

        // Apply to local save to keep UI updated
        this._saveManager.addXp(earnedXp);
        this._saveManager.addCoins(earnedCoins);

        
        if (this._stats.accuracy >= 50) {
            this._audioManager.playVictoryFanfare();
        } else {
            this._audioManager.playDefeatSound();
        }

        const statBadge = (label: string, value: string | number, color: string) => `
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 8px 4px; text-align: center;">
                <div style="font-size: 8px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.3px;">${label}</div>
                <div style="font-size: 13px; font-weight: 900; color: ${color}; margin-top: 2px;">${value}</div>
            </div>
        `;

        const actionGridBtn = (id: string, icon: string, label: string, variant: 'gold' | 'default') => `
            <button id="${id}" style="
                background: ${variant === 'gold' ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.05)'};
                border: 1px solid ${variant === 'gold' ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.1)'};
                color: ${variant === 'gold' ? '#0F172A' : 'white'};
                padding: 10px;
                border-radius: 8px;
                font-weight: 800;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                transition: transform 0.1s;
                justify-content: center;
            ">
                <span style="font-size: 18px;">${icon}</span>
                <span style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3px;">${label}</span>
            </button>
        `;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; display: flex; align-items: center; justify-content: center; padding: 12px; box-sizing: border-box; height: 100vh; overflow: hidden;">
                <div class="glass-card" style="
                    width: 100%; 
                    max-width: 400px; 
                    padding: 16px; 
                    border-color: var(--tv-gold-primary); 
                    background: linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(15,23,42,0.95) 100%);
                    max-height: 98vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    box-sizing: border-box;
                    border-radius: 16px;
                ">
                    <!-- Title & Header -->
                    <div style="text-align: center; margin-bottom: 8px; flex-shrink: 0;">
                        <div style="font-size: 32px; margin-bottom: 2px;">🏆</div>
                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; letter-spacing: 1.5px; text-transform: uppercase;">Ethio Telecom Match Result</div>
                        <div style="font-size: 22px; font-weight: 900; color: white; margin-top: 2px; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
                            SCORE: <span id="final-score-rolling" style="color: var(--tv-gold-primary);">0</span>
                        </div>
                    </div>

                    <!-- Compact Telemetry -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 8px;">
                        ${statBadge('Correct', correct, '#22C55E')}
                        ${statBadge('Wrong', wrong, '#EF4444')}
                        ${statBadge('Accuracy', `${this._stats.accuracy}%`, 'var(--tv-gold-primary)')}
                        ${statBadge('Avg Time', `${this._stats.avgResponseTime}s`, 'white')}
                        ${statBadge('Possession', `${this._stats.possessionPercent}%`, '#38BDF8')}
                        ${statBadge('Max Combo', `${this._stats.maxCombo}x`, '#A855F7')}
                    </div>

                    <!-- Match Rewards (With Mobile Data Badge) -->
                    <div style="background: rgba(0,0,0,0.4); border-radius: 12px; padding: 12px; margin-bottom: 12px; border: 1px solid rgba(255,215,0,0.2);">
                        <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; text-align: center;">Match Rewards Unlocked</div>
                        <div style="display: flex; justify-content: space-around; align-items: center;">
                            <div style="text-align: center;">
                                <div style="font-size: 18px; margin-bottom: 2px;">🪙</div>
                                <div style="font-size: 13px; font-weight: 900; color: var(--tv-gold-primary);" id="reward-coins-rolling">+0 Coins</div>
                            </div>
                            <div style="text-align: center; border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1); padding: 0 16px;">
                                <div style="font-size: 18px; margin-bottom: 2px;">⚡</div>
                                <div style="font-size: 13px; font-weight: 900; color: #38BDF8;" id="reward-xp-rolling">+0 XP</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 18px; margin-bottom: 2px;">📶</div>
                                <div style="font-size: 11px; font-weight: 900; color: #4ADE80;">100MB DATA</div>
                            </div>
                        </div>
                    </div>

                    <!-- Actions Grid -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; flex-shrink: 0;">
                        ${actionGridBtn('btn-play-again', '🔄', 'Play Again', 'default')}
                        ${actionGridBtn('btn-leaderboard', '📊', 'Rankings', 'default')}
                        ${actionGridBtn('btn-home', '🏠', 'Home', 'default')}
                        ${actionGridBtn('btn-claim', '🎁', 'Claim', 'gold')}
                    </div>

                    <!-- Review Game Action -->
                    <button id="btn-review-game" style="
                        width: 100%;
                        padding: 12px;
                        background: var(--tv-blue-accent);
                        color: white;
                        font-weight: 900;
                        font-size: 13px;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        box-shadow: 0 4px 12px rgba(59,130,246,0.3);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-top: 4px;
                        flex-shrink: 0;
                    ">
                        🔍 Review Game
                    </button>
                </div>
            </div>

            <!-- Scrollable Full-Screen Review Modal -->
            <div id="review-modal" style="
                display: none; 
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100%; 
                height: 100%; 
                background: rgba(15,23,42,0.98); 
                z-index: 10000; 
                flex-direction: column;
                pointer-events: auto;
                box-sizing: border-box;
            ">
                <!-- Modal Top Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: space-between; padding: 12px 16px; flex-shrink: 0;">
                    <div style="font-weight: 900; font-size: 15px; letter-spacing: 0.5px;">REVIEW GAME</div>
                    <button id="btn-close-review" style="background: none; border: none; color: white; font-weight: bold; cursor: pointer; font-size: 14px;">⬅️ BACK</button>
                </div>

                <!-- Scrollable Container -->
                <div style="flex: 1; overflow-y: auto; padding: 16px 16px 80px 16px;" id="review-questions-container" class="hide-scrollbar"></div>
            </div>
            
            <style>
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                button:active { transform: scale(0.97); }
                .review-action-btn:active { background: rgba(255,255,255,0.1) !important; }
            </style>
        `;

        this._bindEvents();

        // Trigger Confetti Burst and Rolling Numbers
        if (this._stats.accuracy >= 50) {
            ConfettiCanvas.burst(window.innerWidth / 2, window.innerHeight / 3, 70, ['#FFD700', '#22C55E', '#3B82F6', '#FFFFFF']);
        }

        const scoreEl = document.getElementById('final-score-rolling');
        if (scoreEl) {
            RollingCounter.animate(scoreEl, 0, this._finalScore, 1000, (v) => `${Math.round(v)}`);
        }

        const coinsEl = document.getElementById('reward-coins-rolling');
        if (coinsEl) {
            RollingCounter.animate(coinsEl, 0, earnedCoins, 1000, (v) => `+${Math.round(v)} Coins`);
        }

        const xpEl = document.getElementById('reward-xp-rolling');
        if (xpEl) {
            RollingCounter.animate(xpEl, 0, earnedXp, 1000, (v) => `+${Math.round(v)} XP`);
        }
    }

    private _bindEvents(): void {
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
            this._onContinue();
        });
        
        document.getElementById('btn-leaderboard')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onContinue();
        });

        // Review Game popup triggers
        const reviewModal = document.getElementById('review-modal');
        const container = document.getElementById('review-questions-container');

        document.getElementById('btn-review-game')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (reviewModal && container) {
                this._renderReviewQuestions(container);
                reviewModal.style.display = 'flex';
            }
        });

        document.getElementById('btn-close-review')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (reviewModal) {
                reviewModal.style.display = 'none';
            }
        });
    }

    private _renderReviewQuestions(container: HTMLElement): void {
        const questions = JSON.parse(localStorage.getItem('ETHIO_REVIEW_QUESTIONS') || '[]');
        const choices = JSON.parse(localStorage.getItem('ETHIO_REVIEW_CHOICES') || '[]');

        if (questions.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 48px; color: #64748B;">
                    No questions to review.
                </div>
            `;
            return;
        }

        container.innerHTML = questions.map((q: any, idx: number) => {
            const chosenIdx = choices[idx] !== undefined ? choices[idx] : -1;
            const chosenOpt = chosenIdx >= 0 ? q.options[chosenIdx] : 'Timeout / Unanswered';
            
            const isCorrect = chosenIdx === q.correctIndex;
            const chosenColor = isCorrect ? '#22C55E' : '#EF4444';

            // REQ 13: SECURE REVIEW SCREEN (DO NOT REVEAL CORRECT ANSWER OR EXPLANATION)
            return `
                <div class="glass-card" style="border-radius: 12px; padding: 16px; margin-bottom: 16px; border-color: ${chosenColor}; text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span style="font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">Question ${idx + 1}</span>
                        <span style="font-size: 11px; font-weight: 900; color: ${chosenColor}; background: ${isCorrect ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}; padding: 2px 8px; border-radius: 4px;">
                            ${isCorrect ? '✓ Correct' : '✗ Wrong'}
                        </span>
                    </div>

                    <div style="font-size: 15px; font-weight: 800; color: white; margin-bottom: 12px; line-height: 1.4;">${q.prompt}</div>

                    <!-- Answers status box (Only user selection & status, NO correct answer revealed!) -->
                    <div style="background: rgba(0,0,0,0.3); padding: 10px 12px; border-radius: 8px; font-size: 13px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.06);">
                        <div style="color: #94A3B8; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">YOUR SELECTED ANSWER</div>
                        <div style="color: white; font-weight: 800; font-size: 14px;">${chosenOpt}</div>
                    </div>

                    <!-- In-App Interactions Row (REQ 14) -->
                    <div style="display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                        <button class="review-action-btn btn-review-like" data-q-idx="${idx}" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #94A3B8; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
                            <span class="heart-icon" style="transition: transform 0.2s;">❤️</span> <span class="like-label">Like</span> (<span class="like-count">12</span>)
                        </button>
                        <button class="review-action-btn btn-review-comment" data-q-idx="${idx}" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #94A3B8; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <span>💬</span> Comment
                        </button>
                        <button class="review-action-btn btn-review-share" data-q-idx="${idx}" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #94A3B8; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <span>⚽</span> Invite
                        </button>
                    </div>

                    <!-- Comment Container (Hidden by default, expands on comment click) -->
                    <div class="comment-box-drawer" id="comment-drawer-${idx}" style="display: none; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
                        <div class="comment-list" id="comment-list-${idx}" style="max-height: 120px; overflow-y: auto; margin-bottom: 8px; font-size: 12px; color: #CBD5E1; display: flex; flex-direction: column; gap: 6px;">
                            <div style="background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px;">
                                <strong style="color: var(--fds-gold-primary);">Abebe M.:</strong> Great question! Really challenged my knowledge. <span style="font-size: 10px; color: #64748B; float: right;">2m ago</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 6px;">
                            <input type="text" id="comment-input-${idx}" placeholder="Write a comment..." style="flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px 10px; color: white; font-size: 12px;" />
                            <button class="btn-send-comment" data-q-idx="${idx}" style="background: #009A44; border: none; color: white; padding: 6px 12px; border-radius: 6px; font-weight: 800; font-size: 12px; cursor: pointer;">Post</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind interactive events for review action buttons
        const cards = container.querySelectorAll('.glass-card');
        cards.forEach((card, idx) => {
            // REQ 14: LIKE FUNCTIONALITY
            const likeBtn = card.querySelector('.btn-review-like') as HTMLButtonElement;
            likeBtn?.addEventListener('click', () => {
                this._audioManager.playClick();
                const countSpan = likeBtn.querySelector('.like-count') as HTMLElement;
                const labelSpan = likeBtn.querySelector('.like-label') as HTMLElement;
                const heartIcon = likeBtn.querySelector('.heart-icon') as HTMLElement;

                let count = parseInt(countSpan?.innerText || '12');
                if (likeBtn.classList.contains('liked')) {
                    likeBtn.classList.remove('liked');
                    likeBtn.style.color = '#94A3B8';
                    likeBtn.style.borderColor = 'rgba(255,255,255,0.1)';
                    labelSpan.innerText = 'Like';
                    countSpan.innerText = String(count - 1);
                } else {
                    likeBtn.classList.add('liked');
                    likeBtn.style.color = '#EF4444';
                    likeBtn.style.borderColor = '#EF4444';
                    labelSpan.innerText = 'Liked';
                    countSpan.innerText = String(count + 1);
                    if (heartIcon) {
                        heartIcon.style.transform = 'scale(1.4)';
                        setTimeout(() => { heartIcon.style.transform = 'scale(1)'; }, 200);
                    }
                }
            });

            // REQ 14: COMMENT FUNCTIONALITY
            const commentBtn = card.querySelector('.btn-review-comment') as HTMLButtonElement;
            const drawer = card.querySelector(`#comment-drawer-${idx}`) as HTMLElement;
            const input = card.querySelector(`#comment-input-${idx}`) as HTMLInputElement;
            const sendBtn = card.querySelector('.btn-send-comment') as HTMLButtonElement;
            const list = card.querySelector(`#comment-list-${idx}`) as HTMLElement;

            commentBtn?.addEventListener('click', () => {
                this._audioManager.playClick();
                if (drawer) {
                    drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
                    if (drawer.style.display === 'block') input?.focus();
                }
            });

            sendBtn?.addEventListener('click', () => {
                this._audioManager.playClick();
                const text = input?.value.trim();
                if (!text) {
                    Toast.show('Comment cannot be empty.', 'info');
                    return;
                }
                const newComment = document.createElement('div');
                newComment.style.cssText = 'background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px;';
                newComment.innerHTML = `<strong style="color: #4ADE80;">You:</strong> ${text} <span style="font-size: 10px; color: #64748B; float: right;">Just now</span>`;
                list.appendChild(newComment);
                input.value = '';
                list.scrollTop = list.scrollHeight;
                Toast.show('Comment posted!', 'success');
            });

            // REQ 14: SHARE / FOOTBALL INVITATION
            const shareBtn = card.querySelector('.btn-review-share') as HTMLButtonElement;
            shareBtn?.addEventListener('click', async () => {
                this._audioManager.playClick();
                const shareText = `⚽ I'm competing in the Ethio Telecom Football Tournament!\nCan you beat my score of ${this._finalScore} PTS?\nJoin the competition and challenge me now!`;
                
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Ethio Telecom Football League',
                            text: shareText,
                            url: window.location.href
                        });
                    } catch (e) {}
                } else {
                    await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
                    Toast.show('Football invitation link copied to clipboard! Share with friends to challenge them.', 'success');
                }
            });
        });
    }
}
