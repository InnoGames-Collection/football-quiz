import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { UIManager } from '../../core/managers/UIManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { Toast } from '../components/Toast';
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

    constructor(saveManager: SaveManager, audioManager: AudioManager, uiManager: UIManager, callbacks: FootballHomeCallbacks) {
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._uiManager = uiManager;
        this._callbacks = callbacks;
    }

    public render(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);
        
        const gamesPlayed = profile.totalMatches || 0;
        const winRate = gamesPlayed > 0 ? Math.round(((profile.totalWins || 0) / gamesPlayed) * 100) : 0;

        root.innerHTML = `
            <div class="stadium-container stadium-bg-wrapper" style="pointer-events: auto; padding-bottom: 80px;">
                
                <!-- STADIUM LIGHT BEAMS & FLOATING GRAPHICS -->
                <div class="stadium-beam stadium-beam-left"></div>
                <div class="stadium-beam stadium-beam-right"></div>
                <div class="floating-ball-graphic" style="top: 15%; left: 5%; font-size: 40px;">⚽</div>
                <div class="floating-ball-graphic" style="top: 60%; right: 8%; font-size: 32px; animation-delay: -2s;">⚽</div>

                <!-- TOP APP BAR (Ethio Telecom Branded) -->
                <div class="tv-broadcast-header fade-in-up" style="justify-content: space-between; padding: 12px 16px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(2,6,23,0.85); backdrop-filter: blur(12px);">
                    <!-- Left: Profile & Brand -->
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #009A44, #22C55E); display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid #4ADE80;">
                            ⚽
                        </div>
                        <div>
                            <div style="font-size: 9px; font-weight: 800; color: #009A44; text-transform: uppercase; letter-spacing: 1px;">ETHIO TELECOM VAS</div>
                            <div style="font-weight: 900; font-size: 14px; color: white; font-family: var(--fds-font-mono);">${this._maskPhone(profile.phone || '251911223345')}</div>
                        </div>
                    </div>

                    <!-- Right: Notification & Settings -->
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <button id="btn-notif" class="m3-btn m3-btn-icon m3-btn-secondary" style="width: 44px; height: 44px;">
                            🔔
                        </button>
                        <button id="btn-settings" class="m3-btn m3-btn-icon m3-btn-secondary" style="width: 44px; height: 44px;">
                            ⚙️
                        </button>
                    </div>
                </div>

                <!-- COMPACT TELEMETRY ROW -->
                <div class="fade-in-up" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px 16px; background: rgba(0,0,0,0.4); border-bottom: 1px solid rgba(255,255,255,0.06); text-align: center; animation-delay: 50ms;">
                    <div>
                        <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Current League</div>
                        <div style="font-size: 13px; font-weight: 900; color: ${division.color}; margin-top: 2px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                            <span>${division.badge}</span> <span>${division.name}</span>
                        </div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Global Rank</div>
                        <div style="font-size: 13px; font-weight: 900; color: white; margin-top: 2px;">#4 In Premier</div>
                    </div>
                    <div>
                        <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Total Points</div>
                        <div style="font-size: 13px; font-weight: 900; color: var(--fds-gold-primary); margin-top: 2px;">${profile.xp} XP</div>
                    </div>
                </div>

                <!-- SCROLLABLE BODY CONTENT (8dp Grid System) -->
                <div style="max-width: 960px; margin: 0 auto; padding: 16px; display: flex; flex-direction: column; gap: 16px;">
                    
                    <!-- 1. HERO SECTION: DAILY CHAMPIONSHIP TOURNAMENT -->
                    <div class="glass-card fade-in-up" style="
                        border: 2px solid var(--fds-gold-primary);
                        background: linear-gradient(135deg, rgba(0, 154, 68, 0.25) 0%, rgba(15, 23, 42, 0.95) 70%, rgba(255, 215, 0, 0.15) 100%);
                        padding: 24px 20px;
                        border-radius: 20px;
                        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 215, 0, 0.1);
                        position: relative;
                        overflow: hidden;
                        animation-delay: 100ms;
                    " id="card-daily">
                        <!-- Background Glow Accent -->
                        <div style="position: absolute; top: -40px; right: -40px; width: 140px; height: 140px; background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%); pointer-events: none;"></div>

                        <!-- Badge Row -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span class="fds-badge" style="background: rgba(34,197,94,0.2); border: 1px solid #22C55E; color: #4ADE80;">
                                🟢 LIVE MATCH • 1,420 PLAYERS
                            </span>
                            <span style="font-size: 11px; font-weight: 900; color: var(--fds-gold-primary); font-family: var(--fds-font-mono);" id="daily-countdown">
                                ⏱️ 14h : 22m : 45s
                            </span>
                        </div>

                        <!-- Title & Description -->
                        <div style="text-align: left; margin-bottom: 16px;">
                            <h2 style="font-size: 22px; font-weight: 900; color: white; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                🏆 ETHIO TELECOM VAS CHAMPIONSHIP
                            </h2>
                            <div style="font-size: 13px; color: #CBD5E1; line-height: 1.4;">
                                Win up to <strong style="color: var(--fds-gold-primary);">10,000 ETB Prize Pool</strong> & <strong style="color: #4ADE80;">100GB Free Mobile Data Pass</strong> in today's tournament!
                            </div>
                        </div>

                        <!-- Hero Primary Action Button -->
                        <button id="btn-daily-match" class="m3-btn m3-btn-gold" style="width: 100%; min-height: 52px; font-size: 16px; font-weight: 900; color: #0F172A; border-radius: 12px; background: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%); box-shadow: 0 8px 30px rgba(255, 215, 0, 0.45); cursor: pointer;">
                            ⚡ KICK OFF NOW (+500 XP)
                        </button>
                    </div>

                    <!-- 2. QUICK GAME MODES & ACTIONS GRID -->
                    <div style="font-size: 11px; font-weight: 800; color: #38BDF8; margin-left: 4px; text-transform: uppercase; letter-spacing: 1px;" class="fade-in-up">
                        ⚽ Tournament Lobbies & Actions
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;" class="fade-in-up">
                        <button id="btn-action-kickoff" class="m3-btn m3-btn-primary" style="padding: 16px 12px; height: 90px; flex-direction: column; justify-content: center; gap: 6px; border-radius: 16px; background: linear-gradient(135deg, #22C55E 0%, #009A44 100%); color: #ffffff; box-shadow: 0 6px 20px rgba(34,197,94,0.35);">
                            <span style="font-size: 26px;">⚽</span>
                            <span style="font-size: 13px; font-weight: 900; letter-spacing: 0.5px; color: #ffffff;">SOLO MATCH</span>
                        </button>

                        <button id="btn-action-leaderboard" class="m3-btn m3-btn-gold" style="padding: 16px 12px; height: 90px; flex-direction: column; justify-content: center; gap: 6px; border-radius: 16px; background: linear-gradient(135deg, #FFD700 0%, #FF8C00 100%); color: #0F172A; box-shadow: 0 6px 20px rgba(255,215,0,0.35);">
                            <span style="font-size: 26px;">📊</span>
                            <span style="font-size: 13px; font-weight: 900; letter-spacing: 0.5px; color: #0F172A;">LEADERBOARD</span>
                        </button>

                        <button id="btn-action-messages" class="m3-btn m3-btn-secondary" style="padding: 16px 12px; height: 90px; flex-direction: column; justify-content: center; gap: 6px; border-radius: 16px; background: rgba(15,23,42,0.9); border: 1px solid rgba(56,189,248,0.4); color: #38BDF8;">
                            <span style="font-size: 26px;">💬</span>
                            <span style="font-size: 13px; font-weight: 900; letter-spacing: 0.5px; color: #38BDF8;">MESSAGES</span>
                        </button>

                        <button id="btn-action-referral" class="m3-btn m3-btn-secondary" style="padding: 16px 12px; height: 90px; flex-direction: column; justify-content: center; gap: 6px; border-radius: 16px; background: rgba(15,23,42,0.9); border: 1px solid rgba(192,132,252,0.4); color: #C084FC;">
                            <span style="font-size: 26px;">🎁</span>
                            <span style="font-size: 13px; font-weight: 900; letter-spacing: 0.5px; color: #C084FC;">INVITE & REWARDS</span>
                        </button>
                    </div>

                    <!-- 3. STATISTICS DASHBOARD CARD -->
                    <div class="glass-card fade-in-up" style="padding: 16px; border-color: rgba(255,255,255,0.12); border-radius: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-size: 11px; font-weight: 800; color: #F472B6; text-transform: uppercase; letter-spacing: 0.5px;">📊 Your Performance Telemetry</div>
                            <button id="btn-view-all-stats" style="background: none; border: none; color: #F472B6; font-size: 12px; font-weight: 800; cursor: pointer; text-decoration: underline;">VIEW DETAILED</button>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); text-align: center;">
                            <div>
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">MATCHES</div>
                                <div style="font-size: 15px; font-weight: 900; color: white; margin-top: 4px;">${gamesPlayed}</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.06);">
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">ACCURACY</div>
                                <div style="font-size: 15px; font-weight: 900; color: #4ADE80; margin-top: 4px;">${winRate}%</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.06);">
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">POINTS</div>
                                <div style="font-size: 15px; font-weight: 900; color: white; margin-top: 4px;">${profile.xp}</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.06);">
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase;">SCORE</div>
                                <div style="font-size: 15px; font-weight: 900; color: var(--fds-gold-primary); margin-top: 4px;">${profile.eloRating || 1200}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. LIVE CHAMPIONSHIP LEADERBOARD HIGHLIGHT -->
                    <div class="glass-card fade-in-up" style="padding: 16px; border-color: rgba(255,215,0,0.2); border-radius: 16px;">
                        <div style="font-size: 11px; font-weight: 800; color: var(--fds-gold-primary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🎖️ Current Tournament Leaders</div>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,215,0,0.05); padding: 8px 12px; border-radius: 8px;">
                                <span style="font-size: 13px; font-weight: 800; color: white;">🥇 Abebe K. (Addis Ababa)</span>
                                <span style="font-size: 12px; font-weight: 900; color: var(--fds-gold-primary);">5,800 pts</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px;">
                                <span style="font-size: 13px; font-weight: 700; color: #CBD5E1;">🥈 Yonas M. (Hawassa)</span>
                                <span style="font-size: 12px; font-weight: 800; color: #94A3B8;">5,100 pts</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px;">
                                <span style="font-size: 13px; font-weight: 700; color: #94A3B8;">🥉 Biruk T. (Bahir Dar)</span>
                                <span style="font-size: 12px; font-weight: 800; color: #64748B;">4,950 pts</span>
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
                Toast.show('Refreshed EthioFantasy home feed.', 'info');
            });
        }

        // Check if returning player modal should display
        ReturningPlayerModal.checkAndShow(this._uiManager, this._saveManager, this._audioManager);
    }

    private _startCountdownTimer(): void {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
        }

        let secondsRemaining = 14 * 3600 + 22 * 60 + 45;

        this._timerInterval = window.setInterval(() => {
            secondsRemaining--;
            if (secondsRemaining < 0) secondsRemaining = 86400;

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

        root.querySelector('#btn-action-messages')?.addEventListener('click', (e) => {
            this._addRipple(e);
            this._audioManager.playClick();
            if (this._callbacks.onMessages) this._callbacks.onMessages();
        });

        root.querySelector('#btn-action-referral')?.addEventListener('click', (e) => {
            this._addRipple(e);
            this._audioManager.playClick();
            Toast.show('Invitation link copied! Share with friends to earn 200 XP bonus.', 'success');
        });

        root.querySelector('#btn-view-all-stats')?.addEventListener('click', () => {
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
        let clean = phone.replace(/[^0-9]/g, '');
        if (clean.length < 10) {
            clean = '251911223345';
        }
        if (!clean.startsWith('251')) {
            clean = '251' + clean.replace(/^0+/, '');
        }
        return clean.substring(0, 4) + '****' + clean.substring(clean.length - 2);
    }
}
