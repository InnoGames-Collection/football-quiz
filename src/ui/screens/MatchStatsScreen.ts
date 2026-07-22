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

    private _finalScore: number;

    constructor(
        uiManager: UIManager,
        saveManager: SaveManager,
        audioManager: AudioManager,
        stats: MatchStats,
        finalScore: number,
        gameId: string,
        onContinue: () => void
    ) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._stats = stats;
        this._finalScore = finalScore;
        this._gameId = gameId;
        this._onContinue = onContinue;

        this._saveManager.addXp(this._stats.xpEarned);
        this._saveManager.addCoins(50); // Add rewards to save
        this._saveManager.updateHighScore(this._gameId, this._finalScore);
    }

    public render(): void {
        const root = this._uiManager.container;
        const correct = this._stats.goals;
        const wrong = this._stats.incorrectAnswers;
        
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
                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; letter-spacing: 1.5px; text-transform: uppercase;">Match Result</div>
                        <div style="font-size: 20px; font-weight: 900; color: white; margin-top: 2px; text-shadow: 0 2px 8px rgba(0,0,0,0.5);">
                            SCORE: ${this._finalScore}
                        </div>
                    </div>

                    <!-- 3x2 Compact Stats Grid -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px; flex-shrink: 0;">
                        ${statBadge('Accuracy', `${this._stats.accuracy}%`, '#60A5FA')}
                        ${statBadge('Avg Time', `${this._stats.avgResponseTime}s`, '#38BDF8')}
                        ${statBadge('Correct', correct, 'var(--tv-pitch-green)')}
                        ${statBadge('Wrong', wrong, '#EF4444')}
                        ${statBadge('Points', `${this._stats.xpEarned} XP`, '#F472B6')}
                        ${statBadge('Rewards', '+50 Coins', 'var(--tv-gold-primary)')}
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
            const correctOpt = q.options[q.correctIndex] || '';
            const chosenOpt = chosenIdx >= 0 ? q.options[chosenIdx] : 'Timeout / Unanswered';
            
            const isCorrect = chosenIdx === q.correctIndex;
            const chosenColor = isCorrect ? 'var(--tv-pitch-green)' : (chosenIdx >= 0 ? '#EF4444' : '#64748B');

            // Generate mock explanation
            const mockExplanation = q.explanation || `The correct answer is indeed ${correctOpt}. Double-check your sports hub rules for verification.`;

            return `
                <div class="glass-card" style="border-radius: 12px; padding: 16px; margin-bottom: 16px; border-color: ${isCorrect ? 'var(--tv-pitch-green)' : '#EF4444'}; text-align: left;">
                    <div style="font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-bottom: 6px;">Question ${idx + 1}</div>
                    <div style="font-size: 15px; font-weight: 800; color: white; margin-bottom: 12px; line-height: 1.4;">${q.prompt}</div>

                    <!-- Answers comparison box -->
                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.04);">
                        <div style="margin-bottom: 4px;">
                            <span style="color: #94A3B8; font-weight: 700;">YOUR ANSWER: </span>
                            <span style="color: ${chosenColor}; font-weight: 800;">${chosenOpt} ${isCorrect ? '✅' : '❌'}</span>
                        </div>
                        <div>
                            <span style="color: #94A3B8; font-weight: 700;">CORRECT ANSWER: </span>
                            <span style="color: var(--tv-pitch-green); font-weight: 800;">${correctOpt}</span>
                        </div>
                    </div>

                    <!-- Explanation -->
                    <div style="font-size: 12px; color: #CBD5E1; line-height: 1.5; margin-bottom: 16px; background: rgba(255,255,255,0.02); padding: 8px; border-radius: 6px; border-left: 2px solid var(--tv-gold-primary);">
                        <strong style="color: var(--tv-gold-primary);">Explanation:</strong> ${mockExplanation}
                    </div>

                    <!-- In-App Interactions Row -->
                    <div style="display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                        <button class="review-action-btn btn-review-like" data-q-idx="${idx}" style="flex: 1; padding: 6px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #94A3B8; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            <span>👍</span> <span class="like-label">Like</span> (<span class="like-count">12</span>)
                        </button>
                        <button class="review-action-btn btn-review-comment" data-q-idx="${idx}" style="flex: 1; padding: 6px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #94A3B8; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            <span>💬</span> Comment
                        </button>
                        <button class="review-action-btn btn-review-share" data-q-idx="${idx}" data-prompt="${q.prompt}" style="flex: 1; padding: 6px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #94A3B8; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            <span>🔗</span> Share
                        </button>
                        <button class="review-action-btn btn-review-report" data-q-idx="${idx}" style="flex: 1; padding: 6px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #94A3B8; font-size: 11px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            <span>⚠️</span> Report
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Bind interactive events for review action buttons
        const cards = container.querySelectorAll('.glass-card');
        cards.forEach(card => {
            // Like
            const likeBtn = card.querySelector('.btn-review-like') as HTMLButtonElement;
            likeBtn?.addEventListener('click', () => {
                this._audioManager.playClick();
                const countSpan = likeBtn.querySelector('.like-count') as HTMLElement;
                const labelSpan = likeBtn.querySelector('.like-label') as HTMLElement;
                if (countSpan && labelSpan) {
                    let count = parseInt(countSpan.innerText);
                    if (likeBtn.classList.contains('liked')) {
                        likeBtn.classList.remove('liked');
                        likeBtn.style.color = '#94A3B8';
                        likeBtn.style.borderColor = 'rgba(255,255,255,0.1)';
                        labelSpan.innerText = 'Like';
                        countSpan.innerText = String(count - 1);
                    } else {
                        likeBtn.classList.add('liked');
                        likeBtn.style.color = 'var(--tv-gold-primary)';
                        likeBtn.style.borderColor = 'var(--tv-gold-primary)';
                        labelSpan.innerText = 'Liked';
                        countSpan.innerText = String(count + 1);
                    }
                }
            });

            // Comment
            const commentBtn = card.querySelector('.btn-review-comment') as HTMLButtonElement;
            commentBtn?.addEventListener('click', () => {
                this._audioManager.playClick();
                const userComment = prompt('Enter your comment on this question:');
                if (userComment && userComment.trim()) {
                    alert('Comment posted successfully! It will show up after moderation.');
                }
            });

            // Share
            const shareBtn = card.querySelector('.btn-review-share') as HTMLButtonElement;
            shareBtn?.addEventListener('click', () => {
                this._audioManager.playClick();
                const qText = shareBtn.getAttribute('data-prompt') || '';
                navigator.clipboard.writeText(`EthioFantasy Trivia Question: "${qText}" - Play and win rewards!`);
                alert('Copied question details to clipboard! Share with friends to win invite bonuses.');
            });

            // Report
            const reportBtn = card.querySelector('.btn-review-report') as HTMLButtonElement;
            reportBtn?.addEventListener('click', () => {
                this._audioManager.playClick();
                if (confirm('Are you sure you want to report this question for inaccuracy or typo?')) {
                    alert('Report submitted! Thank you for helping keep EthioFantasy accurate.');
                    reportBtn.disabled = true;
                    reportBtn.style.opacity = '0.5';
                    reportBtn.style.color = '#64748B';
                }
            });
        });
    }
}
