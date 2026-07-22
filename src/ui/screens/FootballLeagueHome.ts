import { SaveManager } from '../../core/managers/SaveManager';
import { AuthManager } from '../../core/auth/AuthManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { UIManager } from '../../core/managers/UIManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { CompetitionRegistry } from '../../core/quiz/CompetitionRegistry';
import { LeaderboardService } from '../../core/leaderboard/LeaderboardService';
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
                            <div style="font-size: 9px; font-weight: 800; color: #009A44; text-transform: uppercase; letter-spacing: 1px;">ETHIO FANTASY</div>
                            <div style="font-weight: 900; font-size: 14px; color: white; font-family: var(--fds-font-mono);">${profile.phone ? this._maskPhone(profile.phone) : 'Guest'}</div>
                        </div>
                    </div>

                    <!-- Right: Notification & Settings -->
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <button id="btn-notif" style="background: none; border: none; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 22px; cursor: pointer; padding: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                            🔔
                        </button>
                        <button id="btn-settings" style="background: none; border: none; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; cursor: pointer; padding: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
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
                        <div id="global-rank-display" style="font-size: 13px; font-weight: 900; color: white; margin-top: 2px;">Loading...</div>
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
                            <span id="daily-players-count" class="fds-badge" style="background: rgba(34,197,94,0.2); border: 1px solid #22C55E; color: #4ADE80;">
                                🟢 LIVE MATCH
                            </span>
                            <span style="font-size: 11px; font-weight: 900; color: var(--fds-gold-primary); font-family: var(--fds-font-mono);" id="daily-countdown">
                                ⏱️ Loading...
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
                            <span id="daily-play-btn-text">⚡ KICK OFF NOW</span>
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
                                <div style="font-size: 15px; font-weight: 900; color: var(--fds-gold-primary); margin-top: 4px;">${profile.eloRating || 0}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. LIVE CHAMPIONSHIP LEADERBOARD HIGHLIGHT -->
                    <div class="glass-card fade-in-up" style="padding: 16px; border-color: rgba(255,215,0,0.2); border-radius: 16px;">
                        <div style="font-size: 11px; font-weight: 800; color: var(--fds-gold-primary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🎖️ Current Tournament Leaders</div>
                        <div id="home-leaderboard-preview" style="display: flex; flex-direction: column; gap: 10px;">
                            <div style="font-size: 12px; color: #94A3B8; text-align: center;">Loading leaderboard...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._startCountdownTimer();
        this._bindEvents();
        const userId = AuthManager.getInstance().currentUser?.id || '';
        this._fetchDynamicData(userId, division.name);

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

    private async _fetchDynamicData(userId: string, divisionName: string) {
        // Fetch User Rank
        const rank = await LeaderboardService.getInstance().getUserRank(userId);
        const rankEl = document.getElementById('global-rank-display');
        if (rankEl) {
            rankEl.innerText = rank ? `#${rank} In ${divisionName}` : 'Unranked';
        }

        // Fetch Live Matches / Top 3 Leaderboard
        const liveComps = CompetitionRegistry.getAll().filter(c => c.status === 'live');
        const dailyComp = liveComps.find(c => c.id === 'daily') || liveComps[0];
        
        const playersEl = document.getElementById('daily-players-count');
        const playBtnEl = document.getElementById('daily-play-btn-text');

        if (dailyComp) {
            if (playersEl) playersEl.innerHTML = `🟢 LIVE MATCH • ${(dailyComp.participants || 0).toLocaleString()} PLAYERS`;
            if (playBtnEl) playBtnEl.innerText = `⚡ KICK OFF NOW (+${dailyComp.prize_pool || 0} XP)`;
        } else {
            if (playersEl) playersEl.innerHTML = `⚪ NO LIVE MATCHES`;
            if (playBtnEl) playBtnEl.innerText = `⚡ PLAY CASUAL MATCH`;
        }

        // Fetch Leaderboard Preview
        try {
            const lb = await LeaderboardService.getInstance().getLeaderboard(undefined, 'all_time', 3);
            const previewEl = document.getElementById('home-leaderboard-preview');
            if (previewEl && lb.length > 0) {
                const medals = ['🥇', '🥈', '🥉'];
                const bgColors = ['rgba(255,215,0,0.05)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.03)'];
                const textColors = ['white', '#CBD5E1', '#94A3B8'];
                
                previewEl.innerHTML = lb.map((entry, idx) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: ${bgColors[idx]}; padding: 8px 12px; border-radius: 8px;">
                        <span style="font-size: 13px; font-weight: ${idx === 0 ? '800' : '700'}; color: ${textColors[idx]};">${medals[idx]} ${entry.username}</span>
                        <span style="font-size: 12px; font-weight: ${idx === 0 ? '900' : '800'}; color: ${idx === 0 ? 'var(--fds-gold-primary)' : '#94A3B8'};">${entry.score.toLocaleString()} pts</span>
                    </div>
                `).join('');
            } else if (previewEl) {
                previewEl.innerHTML = `<div style="font-size: 12px; color: #94A3B8; text-align: center;">No ranked players yet</div>`;
            }
        } catch(e) {
            console.error(e);
        }
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
        let clean: string;
        if (phone.startsWith('+')) {
            clean = phone.substring(1);
        } else {
            clean = phone;
        }
        return clean.substring(0, 4) + '****' + clean.substring(clean.length - 2);
    }
}
