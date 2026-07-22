import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { DailyChallengeManager, DailyChallengeInfo } from '../../core/competition/DailyChallengeManager';
import { DesignSystem } from '../theme/DesignSystem';

export class DailyChallengeScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onStartChallenge: (info: DailyChallengeInfo) => void;
    private _onClose: () => void;
    private _challengeInfo: DailyChallengeInfo | null = null;
    private _timerInterval: any = null;

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        onStartChallenge: (info: DailyChallengeInfo) => void,
        onClose: () => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onStartChallenge = onStartChallenge;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        this._challengeInfo = await DailyChallengeManager.getInstance().getTodayChallenge();
        
        const isCompleted = localStorage.getItem('ETHIO_DAILY_COMPLETED_TODAY') === 'true';
        
        // Static history of challenges
        const historyList = [
            { date: 'July 21, 2026', title: 'CAF Champions League Trivia', score: '9/10 Goals', status: 'Completed', badge: '🌍' },
            { date: 'July 20, 2026', title: 'World Cup Legends', score: '10/10 Goals', status: 'Completed', badge: '🏆' },
            { date: 'July 19, 2026', title: 'English Premier League Transfers', score: '7/10 Goals', status: 'Completed', badge: '💰' }
        ];

        const historyHtml = historyList.map(h => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 20px;">${h.badge}</span>
                    <div>
                        <div style="font-size: 13px; font-weight: 800; color: white;">${h.title}</div>
                        <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">${h.date}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 13px; font-weight: 900; color: var(--tv-pitch-green);">${h.score}</div>
                    <div style="font-size: 10px; color: #94A3B8; font-weight: 700; text-transform: uppercase; margin-top: 2px;">${h.status}</div>
                </div>
            </div>
        `).join('');

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- Top App Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: space-between; padding: 12px 16px;">
                    <div style="font-weight: 900; font-size: 16px; letter-spacing: 1px; text-transform: uppercase; display: flex; align-items: center; gap: 8px;">
                        <span>📅</span> DAILY CHALLENGE
                    </div>
                    <button id="dc-close-btn" style="background: none; border: none; color: white; font-weight: bold; cursor: pointer; padding: 4px;">⬅️ BACK</button>
                </div>

                <div style="max-width: 600px; margin: 0 auto; padding: 16px 16px 120px 16px;">
                    
                    <!-- Today's Match Card -->
                    <div class="glass-card" style="
                        border-color: ${isCompleted ? 'var(--tv-pitch-green)' : 'var(--tv-gold-primary)'}; 
                        background: linear-gradient(135deg, ${isCompleted ? 'rgba(34,197,94,0.1)' : 'rgba(255,215,0,0.1)'} 0%, rgba(15,23,42,0.92) 100%); 
                        padding: 24px; 
                        text-align: center;
                        margin-bottom: 24px;
                        position: relative;
                        border-radius: 16px;
                    ">
                        <!-- Completed Badge -->
                        <div style="
                            position: absolute;
                            top: 16px; right: 16px;
                            font-size: 11px;
                            font-weight: 900;
                            letter-spacing: 0.5px;
                            padding: 4px 10px;
                            border-radius: 12px;
                            background: ${isCompleted ? 'rgba(34,197,94,0.2)' : 'rgba(255,215,0,0.2)'};
                            color: ${isCompleted ? 'var(--tv-pitch-green)' : 'var(--tv-gold-primary)'};
                            border: 1px solid ${isCompleted ? 'var(--tv-pitch-green)' : 'var(--tv-gold-primary)'};
                        ">
                            ${isCompleted ? '🟢 COMPLETED' : '🔴 PENDING'}
                        </div>

                        <div style="font-size: 48px; margin-bottom: 12px; margin-top: 12px;">⚽</div>
                        <div style="font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Today's Match Topic</div>
                        <div style="font-size: 20px; font-weight: 900; color: white; margin-bottom: 12px; line-height: 1.4;">
                            ${this._challengeInfo?.themeEn || 'Ethiopian Premier League Derby'}
                        </div>

                        <!-- Difficulty & Reward Grid -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                            <div>
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Difficulty</div>
                                <div style="font-size: 13px; font-weight: 900; color: var(--tv-gold-primary); margin-top: 4px;">⭐⭐⭐ (Medium)</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.08);">
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Reward</div>
                                <div style="font-size: 13px; font-weight: 900; color: #38BDF8; margin-top: 4px;">+500 XP (1.5x Boost)</div>
                            </div>
                        </div>

                        <!-- Countdown Timer -->
                        <div style="margin-bottom: 24px;">
                            <div style="font-size: 11px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Time Remaining</div>
                            <div id="countdown-timer" style="font-size: 18px; font-weight: 900; color: white; font-family: var(--tv-mono); letter-spacing: 1px;">--h --m --s</div>
                        </div>

                        <!-- Play Button -->
                        ${isCompleted 
                            ? `<button disabled style="width: 100%; padding: 16px; background: rgba(255,255,255,0.05); color: #64748B; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-weight: 800; font-size: 15px; cursor: not-allowed; text-transform: uppercase; letter-spacing: 0.5px;">MATCH COMPLETED FOR TODAY</button>`
                            : `${DesignSystem.Button({ id: 'btn-start-challenge', text: 'START DAILY CHALLENGE', variant: 'gold', fullWidth: true })}`
                        }
                    </div>

                    <!-- History Section -->
                    <div style="font-size: 12px; font-weight: 800; color: #94A3B8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-left: 4px;">⏱️ Match History</div>
                    <div class="glass-card" style="border-radius: 12px; padding: 12px; border-color: rgba(255,255,255,0.08);">
                        ${historyHtml}
                    </div>

                </div>
            </div>
        `;

        this._bindEvents();
        this._startCountdownTimer();
    }

    private _startCountdownTimer(): void {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
        }

        const updateTimer = () => {
            const el = document.getElementById('countdown-timer');
            if (el) {
                const now = new Date();
                const midnight = new Date();
                midnight.setHours(24, 0, 0, 0);
                const diffMs = midnight.getTime() - now.getTime();
                
                if (diffMs <= 0) {
                    el.innerText = '00h 00m 00s';
                    clearInterval(this._timerInterval);
                    return;
                }

                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

                const hh = String(hours).padStart(2, '0');
                const mm = String(mins).padStart(2, '0');
                const ss = String(secs).padStart(2, '0');

                el.innerText = `${hh}h ${mm}m ${ss}s`;
            }
        };

        updateTimer();
        this._timerInterval = setInterval(updateTimer, 1000);
    }

    private _bindEvents(): void {
        document.getElementById('btn-start-challenge')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._challengeInfo) {
                if (this._timerInterval) {
                    clearInterval(this._timerInterval);
                }
                this._onStartChallenge(this._challengeInfo);
            }
        });

        document.getElementById('dc-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._timerInterval) {
                clearInterval(this._timerInterval);
            }
            this._onClose();
        });
    }

    public destroy(): void {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
        }
    }
}
