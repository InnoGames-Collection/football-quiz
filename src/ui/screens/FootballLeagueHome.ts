import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { UIManager } from '../../core/managers/UIManager';
import { CompetitionRegistry } from '../../core/quiz/CompetitionRegistry';
import { ReturningPlayerModal } from '../components/ReturningPlayerModal';
import { PullToRefresh } from '../components/PullToRefresh';

export interface FootballHomeCallbacks {
    onKickOff: () => void;
    onLiveMatch: () => void;
    onDailyChallenge: () => void;
    onCompetitions: () => void;
    onLeaderboard: () => void;
    onAchievements: () => void;
    onAdminPanel: () => void;
    onSettings: () => void;
    onNotifications?: () => void;
    onViewStats?: () => void;
    onMessages?: () => void;
}

export class FootballLeagueHome {
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _uiManager: UIManager;
    private _callbacks: FootballHomeCallbacks;
    private _timerInterval: number | null = null;
    private _autoScrollInterval: any = null;

    constructor(saveManager: SaveManager, audioManager: AudioManager, uiManager: UIManager, callbacks: FootballHomeCallbacks) {
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._uiManager = uiManager;
        this._callbacks = callbacks;
    }

    public render(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        
        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="position: relative; overflow-y: auto; overflow-x: hidden; min-height: 100vh; padding-bottom: 80px;">
                
                <!-- STADIUM EFFECT LAYERS (Z-INDEX 1 to 3) -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <!-- MAIN UI CONTENT (Z-INDEX 10) -->
                <div style="position: relative; z-index: 10; max-width: 960px; margin: 0 auto; display: flex; flex-direction: column;">
                    
                    <!-- TOP APP BAR -->
                    <div class="fade-in-up" style="display: flex; justify-content: space-between; padding: 16px; align-items: center; background: linear-gradient(180deg, rgba(11,17,32,0.9) 0%, transparent 100%);">
                        <!-- Left: Profile -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #009A44, #22C55E); display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid #4ADE80; box-shadow: 0 4px 12px rgba(34,197,94,0.4);">
                                ⚽
                            </div>
                            <div>
                                <div style="font-size: 9px; font-weight: 800; color: var(--fds-ethio-green); text-transform: uppercase; letter-spacing: 1px;">ETHIO FANTASY</div>
                                <div style="font-weight: 900; font-size: var(--fds-font-sm); color: var(--fds-text-main); font-family: var(--fds-font-mono);">${profile.phone ? this._maskPhone(profile.phone) : 'Guest'}</div>
                            </div>
                        </div>

                        <!-- Right: Notification & Settings -->
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <button id="btn-notif" style="background: none; border: none; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transition: transform 0.2s;">
                                🔔
                            </button>
                            <button id="btn-settings" style="background: none; border: none; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transition: transform 0.2s;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94l-0.36-2.54c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41l-0.36,2.54c-0.59,0.24-1.13,0.56-1.62,0.94l-2.39-0.96c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.04,0.64,0.09,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- SCROLLABLE BODY CONTENT (Image Cards) -->
                    <div style="padding: 0 16px 16px 16px; display: flex; flex-direction: column; gap: 16px;">
                        
                        <!-- Hero Banner -->
                        <div class="fade-in-up" style="animation-delay: 50ms;">
                            <img src="/assets/images/hero_banner.png" id="btn-hero-banner" class="ethio-image-card" alt="Hero Banner" style="border-radius: 16px;">
                        </div>

                        <!-- Daily Challenge Card -->
                        <div class="fade-in-up" style="animation-delay: 150ms;">
                            <img src="/assets/images/daily_challenge_card.png" id="btn-daily-match" class="ethio-image-card" alt="Daily Challenge" style="border-radius: 16px;">
                        </div>

                        <!-- Tournament Card -->
                        <div class="fade-in-up" style="animation-delay: 200ms;">
                            <img src="/assets/images/tournament_card.png" id="btn-action-kickoff" class="ethio-image-card" alt="Tournament" style="border-radius: 16px;">
                        </div>

                        <!-- Winners & Leaderboard Grid -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div class="fade-in-up" style="animation-delay: 300ms;">
                                <img src="/assets/images/winner_card.png" id="btn-winner-card" class="ethio-image-card" alt="Winners" style="border-radius: 12px; height: 100%; object-fit: cover;">
                            </div>
                            <div class="fade-in-up" style="animation-delay: 350ms;">
                                <img src="/assets/images/leaderboard_card.png" id="btn-action-leaderboard" class="ethio-image-card" alt="Leaderboard" style="border-radius: 12px; height: 100%; object-fit: cover;">
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        this._startCountdownTimer();
        this._bindEvents();
        // Attach Pull to Refresh behavior (REQ 11-15 Refresh strategy)
        const container = root.querySelector('.stadium-container') as HTMLElement;
        if (container) {
            PullToRefresh.attach(container, async () => {
                this._audioManager.playClick();
                await new Promise(res => setTimeout(res, 600));
                this.render();
            });
        }

        // Check if returning player modal should display
        ReturningPlayerModal.checkAndShow(this._uiManager, this._saveManager, this._audioManager);
    }

    private _startCountdownTimer(): void {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
        }

        // Find actual end time if a daily comp exists
        const comps = CompetitionRegistry.getAll().filter(c => c.status === 'live');
        const daily = comps.find(c => c.id === 'daily') || comps[0];
        
        let targetTime = new Date().setHours(23, 59, 59, 999);
        if (daily && daily.end_time) {
            targetTime = new Date(daily.end_time).getTime();
        }

        this._timerInterval = window.setInterval(() => {
            let secondsRemaining = Math.floor((targetTime - new Date().getTime()) / 1000);
            
            if (secondsRemaining < 0) {
                secondsRemaining = 0;
            }

            const h = Math.floor(secondsRemaining / 3600);
            const m = Math.floor((secondsRemaining % 3600) / 60);
            const s = secondsRemaining % 60;

            const timerEl = document.getElementById('daily-countdown');
            if (timerEl) {
                timerEl.textContent = `⏱️ ${h}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`;
            }
        }, 1000);
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#btn-daily-match')?.addEventListener('click', (e) => {
            this._addRipple(e);
            this._audioManager.playClick();
            this._callbacks.onDailyChallenge();
        });

        root.querySelector('#btn-action-kickoff')?.addEventListener('click', (e) => {
            this._addRipple(e);
            this._audioManager.playClick();
            this._callbacks.onKickOff();
        });

        root.querySelector('#btn-action-leaderboard')?.addEventListener('click', (e) => {
            this._addRipple(e);
            this._audioManager.playClick();
            this._callbacks.onLeaderboard();
        });

        root.querySelector('#btn-hero-banner')?.addEventListener('click', (e) => {
            this._addRipple(e);
            this._audioManager.playClick();
            this._callbacks.onCompetitions();
        });

        root.querySelector('#btn-winner-card')?.addEventListener('click', (e) => {
            this._addRipple(e);
            this._audioManager.playClick();
            if (this._callbacks.onViewStats) this._callbacks.onViewStats();
        });

        root.querySelector('#btn-notif')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._callbacks.onNotifications) this._callbacks.onNotifications();
        });

        root.querySelector('#btn-settings')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onSettings();
        });
    }

    private _addRipple(e: Event): void {
        const target = e.currentTarget as HTMLElement;
        const circle = document.createElement('span');
        circle.classList.add('m3-ripple-wave');
        
        const rect = target.getBoundingClientRect();
        const diameter = Math.max(rect.width, rect.height);
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${(e as MouseEvent).clientX - rect.left - diameter / 2}px`;
        circle.style.top = `${(e as MouseEvent).clientY - rect.top - diameter / 2}px`;
        
        target.appendChild(circle);
        setTimeout(() => circle.remove(), 400);
    }

    private _maskPhone(phone: string): string {
        let clean: string;
        if (phone.startsWith('+')) {
            clean = phone.substring(1);
        } else {
            clean = phone;
        }
        return clean.substring(0, 4) + '****' + clean.substring(clean.length - 2);
    }

    public destroy(): void {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
        if (this._autoScrollInterval) {
            clearInterval(this._autoScrollInterval);
            this._autoScrollInterval = null;
        }
    }
}
