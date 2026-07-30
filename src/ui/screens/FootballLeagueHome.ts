import { DesignSystem } from "../theme/DesignSystem";
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { UIManager } from '../../core/managers/UIManager';
import { CompetitionRegistry } from '../../core/quiz/CompetitionRegistry';
import { LeaderboardService } from '../../core/leaderboard/LeaderboardService';
import { Toast } from '../components/Toast';
import { ReturningPlayerModal } from '../components/ReturningPlayerModal';
import { t } from '../../localization/i18n';
import { PullToRefresh } from '../components/PullToRefresh';
import { GameSessionManager } from '../../core/quiz/GameSessionManager';

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
    onCasualPlay?: () => void;
}

export class FootballLeagueHome {
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _uiManager: UIManager;
    private _callbacks: FootballHomeCallbacks;
    private _timerInterval: number | null = null;
    private _autoScrollInterval: any = null;
    private _previousDailyRank: string | '--' | null = null;
    private _resetHandler: (() => void) | null = null;

    constructor(saveManager: SaveManager, audioManager: AudioManager, uiManager: UIManager, callbacks: FootballHomeCallbacks) {
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._uiManager = uiManager;
        this._callbacks = callbacks;
    }

    public render(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const gamesPlayed = profile.totalMatches || 0;
        const winRate = gamesPlayed > 0 ? Math.round(((profile.totalWins || 0) / gamesPlayed) * 100) : 0;
        
        const dailyScore = localStorage.getItem('ETHIO_DAILY_SCORE') || '0';
        const rawDailyRank = localStorage.getItem('ETHIO_DAILY_RANK');
        
        let rankDiffHtml = '';
        if (this._previousDailyRank !== null && rawDailyRank && this._previousDailyRank !== '--' && rawDailyRank !== '--') {
            const diff = parseInt(this._previousDailyRank) - parseInt(rawDailyRank);
            if (diff > 0) {
                rankDiffHtml = `<span class="rank-diff-anim rank-diff-up" style="margin-left: 8px; color: #4ADE80; font-size: 11px; font-weight: 800; background: rgba(34,197,94,0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid #22C55E; vertical-align: middle;">▲ +${diff} Positions</span>`;
            } else if (diff < 0) {
                rankDiffHtml = `<span class="rank-diff-anim rank-diff-down" style="margin-left: 8px; color: #F87171; font-size: 11px; font-weight: 800; background: rgba(239,68,68,0.15); padding: 2px 6px; border-radius: 4px; border: 1px solid #EF4444; vertical-align: middle;">▼ ${diff} Positions</span>`;
            }
        }
        this._previousDailyRank = rawDailyRank || '--';
        
        const dailyRank = rawDailyRank && rawDailyRank !== '--' ? `#${rawDailyRank}` : 'Unranked';
        const dailyStreak = profile.streakCount || 0;
        
        const rawDailyScore = localStorage.getItem('ETHIO_DAILY_SCORE') || '0';

        // Always fetch daily rank silently in background to ensure real-time score display
        setTimeout(async () => {
            try {
                await LeaderboardService.getInstance().getLeaderboard(undefined, 'daily');
                const newRank = localStorage.getItem('ETHIO_DAILY_RANK');
                const newScore = localStorage.getItem('ETHIO_DAILY_SCORE');
                
                // We compare the currently rendered score/rank with the newly fetched ones
                // Since this runs after initial render, we re-render if it differs
                if ((newRank && newRank !== rawDailyRank) || (newScore && newScore !== rawDailyScore)) {
                    this.render();
                }
            } catch(e) {}
        }, 1000);

        const activeSession = GameSessionManager.getInstance().getActiveSession();
        const isDailyCompleted = localStorage.getItem('ETHIO_DAILY_COMPLETED_TODAY') === 'true';

        let contextualCardsHtml = '';

        if (activeSession && activeSession.matchType === 'daily') {
            contextualCardsHtml += `
                <div class="glass-card fade-in-up" style="padding: clamp(12px, 2vh, 16px); border-color: rgba(34,197,94,0.3); border-radius: 16px; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #4ADE80; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Continue Challenge</div>
                        <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main);">Daily Challenge</div>
                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 4px;">Round ${activeSession.currentIndex + 1} of ${activeSession.totalQuestions}</div>
                    </div>
                    ${DesignSystem.Button({ id: 'btn-continue-challenge', text: 'Resume', variant: 'primary' })}
                </div>
            `;
        }

        if (!activeSession && isDailyCompleted) {
            // Keep empty, logic moved to Hero Banner
        }

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
                            <div style="font-size: 9px; font-weight: 800; color: var(--fds-ethio-green); text-transform: uppercase; letter-spacing: 1px;">ETHIO FANTASY</div>
                            <div style="font-weight: 900; font-size: var(--fds-font-sm); color: var(--fds-text-main); font-family: var(--fds-font-mono);">${profile.phone ? this._maskPhone(profile.phone) : 'Guest'}</div>
                        </div>
                    </div>

                    <!-- Right: Notification & Settings -->
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <button id="btn-notif" style="background: none; border: none; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: var(--fds-font-lg); cursor: pointer; padding: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                            🔔
                        </button>
                        <button id="btn-settings" style="background: none; border: none; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: var(--fds-font-lg); color: var(--fds-text-main); font-weight: bold; cursor: pointer; padding: 0; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94l-0.36-2.54c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41l-0.36,2.54c-0.59,0.24-1.13,0.56-1.62,0.94l-2.39-0.96c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.04,0.64,0.09,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39-0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                           <!-- COMPACT TELEMETRY ROW -->
                <div style="max-width: 900px; margin: 0 auto; padding: 0 16px;">
                    ${ (dailyScore === '0' && dailyRank === '--') ? `
                    <div class="glass-card fade-in-up" style="padding: 16px; border-color: rgba(255,255,255,0.1); text-align: center; margin-bottom: 24px; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 12px; background: rgba(0,0,0,0.4);">
                        <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🏆</span>
                        <div style="text-align: left;">
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); margin-bottom: 2px;">No Daily Rank Yet</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 600; max-width: 200px;">Play matches to earn points and secure your rank on the leaderboard.</div>
                        </div>
                    </div>
                    ` : `
                    <div class="glass-card fade-in-up" style="padding: 14px 16px; border-color: rgba(255,255,255,0.1); display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; margin-bottom: 24px;">
                        <div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Daily Streak</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: #EF4444; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                <span>🔥</span>
                                ${dailyStreak}
                            </div>
                        </div>
                        <div style="border-left: 1px solid rgba(255,255,255,0.1); border-right: 1px solid rgba(255,255,255,0.1);">
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Daily Rank</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); display: flex; align-items: center; justify-content: center;">${dailyRank} ${rankDiffHtml}</div>
                        </div>
                        <div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Daily Score</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary);">${dailyScore}</div>
                        </div>
                    </div>
                    ` }
                </div>

                <!-- SCROLLABLE BODY CONTENT (Responsive Grid System) -->
                <div style="max-width: 960px; margin: 0 auto; padding: clamp(12px, 2vh, 16px); display: flex; flex-direction: column; gap: clamp(12px, 1.5vh, 16px);">
                    
                    <!-- PREMIUM AD BANNER CAROUSEL -->
                    <div class="fade-in-up" style="position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.4); background: rgba(15,23,42,0.6); aspect-ratio: 16/5; width: 100%;">
                        <div id="ad-carousel" style="display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; scrollbar-width: none; width: 100%; height: 100%;">
                            <img src="/assets/banners/banner1.jpg" style="min-width: 100%; height: 100%; flex-shrink: 0; scroll-snap-align: start; object-fit: fill;" alt="Ad 1">
                            <img src="/assets/banners/banner2.jpg" style="min-width: 100%; height: 100%; flex-shrink: 0; scroll-snap-align: start; object-fit: fill;" alt="Ad 2">
                        </div>
                        <!-- Page Indicators -->
                        <div style="position: absolute; bottom: 8px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; pointer-events: none;">
                            <div class="ad-dot active" style="width: 6px; height: 6px; border-radius: 50%; background: white; transition: 0.3s; opacity: 1;"></div>
                            <div class="ad-dot" style="width: 6px; height: 6px; border-radius: 50%; background: white; transition: 0.3s; opacity: 0.4;"></div>
                        </div>
                    </div>
                    <style>
                        #ad-carousel::-webkit-scrollbar { display: none; }
                    </style>

                    <!-- 1. HERO SECTION: DAILY CHAMPIONSHIP TOURNAMENT -->
                    <div class="glass-card fade-in-up" style="
                        border: 2px solid var(--fds-gold-primary);
                        background: linear-gradient(135deg, rgba(0, 154, 68, 0.75) 0%, rgba(15, 23, 42, 0.95) 70%, rgba(255, 215, 0, 0.5) 100%), url('/assets/images/hero_banner.png') center/cover no-repeat;
                        background-blend-mode: overlay;
                        padding: clamp(16px, 2.5vh, 24px) 20px;
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
                                ${t('home.liveMatch')}
                            </span>
                        </div>

                        <!-- Title & Description -->
                        <div style="text-align: center; margin-bottom: 16px;">
                            <h2 style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                                ETHIO FANTASY
                            </h2>
                        </div>

                        <!-- Hero Primary Action Button OR Countdown -->
                        ${isDailyCompleted ? `
                        <div style="display: flex; justify-content: center;">
                            <div style="background: rgba(0,0,0,0.6); border-radius: 999px; padding: 10px 24px; text-align: center; border: 1px solid rgba(255,215,0,0.4); box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1); cursor: default;">
                                <div style="font-size: 10px; font-weight: 800; color: var(--fds-gold-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">Next Challenge In</div>
                                <div id="next-daily-countdown" style="font-size: 20px; font-weight: 900; color: white; font-family: var(--fds-font-mono); letter-spacing: 1px;">
                                    --:--:--
                                </div>
                            </div>
                        </div>
                        ` : `
                        ${DesignSystem.Button({ id: 'btn-daily-match', text: 'DAILY CHALLENGE', variant: 'primary', fullWidth: true })}
                        `}
                    </div>


                    <div class="fade-in-up" id="btn-action-referral" style="padding: clamp(12px, 2vh, 16px); border-radius: 16px; background: rgba(15,23,42,0.6); border: 1px solid rgba(192,132,252,0.3); display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="font-size: var(--fds-font-xl); filter: drop-shadow(0 2px 4px rgba(192,132,252,0.4));">🎁</div>
                            <div style="text-align: left;">
                                <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); letter-spacing: 0.5px; text-transform: uppercase;">${t('home.invite')}</div>
                                <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 600; margin-top: 2px;">${t('home.inviteDesc')}</div>
                            </div>
                        </div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #C084FC; background: rgba(192,132,252,0.15); padding: 8px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${t('home.copyLink')}
                        </div>
                    </div>
                    
                    <!-- NEW CONTEXTUAL UI -->
                    ${contextualCardsHtml}

                    <!-- 3. STATISTICS DASHBOARD CARD -->
                    <div class="glass-card fade-in-up" style="padding: 14px 16px; border-color: rgba(255,255,255,0.1); margin-bottom: 24px; border-radius: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: #F472B6; text-transform: uppercase; letter-spacing: 0.5px;">${t('home.performance')}</div>
                            <button id="btn-view-all-stats" style="background: none; border: none; color: #F472B6; font-size: var(--fds-font-xs); font-weight: 800; cursor: pointer; text-decoration: underline;">${t('home.details')}</button>
                        </div>
                        
                        ${gamesPlayed === 0 ? `
                        <div style="text-align: center; padding: 24px 0; background: rgba(0,0,0,0.2); border-radius: 12px;">
                            <div style="font-size: 32px; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📊</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: white; margin-bottom: 4px;">No History Yet</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 600;">Your completed matches and stats will appear here.</div>
                        </div>
                        ` : `
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 12px;">
                            <div>
                                <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${t('home.matches')}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${gamesPlayed}</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05);">
                                <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${t('match.accuracy')}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: #4ADE80; margin-top: 4px;">${winRate}%</div>
                            </div>
                            <div>
                                <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${t('home.points')}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${profile.xp}</div>
                            </div>
                            <div style="grid-column: span 3; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 12px; margin-top: 4px; display: flex; justify-content: space-around;">
                                <div>
                                    <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">${t('home.score')}</div>
                                    <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${profile.highScores && profile.highScores['football-quiz'] ? profile.highScores['football-quiz'] : 0}</div>
                                </div>
                                <div>
                                    <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 800; text-transform: uppercase;">Divisions</div>
                                    <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary); margin-top: 4px;">1st</div>
                                </div>
                            </div>
                        </div>
                        `}
                    </div>

                    <!-- 4. LIVE CHAMPIONSHIP LEADERBOARD HIGHLIGHT -->
                    <div class="glass-card fade-in-up" style="padding: 20px 16px; border-color: rgba(255,215,0,0.2); border-radius: 16px;">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-gold-primary); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">${t('home.rankingsTitle')}</div>
                        <div id="home-leaderboard-preview" style="display: flex; flex-direction: column;">
                            ${DesignSystem.SkeletonList(3)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._startCountdownTimer();
        this._bindEvents();
        this._fetchDynamicData();

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

        if (!this._resetHandler) {
            this._resetHandler = () => {
                this.render();
            };
            window.addEventListener('ethio:dailyReset', this._resetHandler);
        }
    }

    private async _fetchDynamicData() {
        // Legacy Rank fetch removed since we now use Daily Rank

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
                const bgColors = ['rgba(255,215,0,0.08)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)'];
                const textColors = ['white', '#E2E8F0', '#CBD5E1'];
                
                previewEl.innerHTML = lb.map((entry, idx) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; background: ${bgColors[idx]}; padding: 12px 16px; border-radius: 12px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 18px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${medals[idx]}</span>
                            <span style="font-size: var(--fds-font-sm); font-weight: ${idx === 0 ? '800' : '700'}; color: ${textColors[idx]};">${entry.username}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: var(--fds-font-md); font-weight: 900; color: ${idx === 0 ? 'var(--fds-gold-primary)' : 'white'}; font-family: var(--fds-font-mono); line-height: 1.1;">${entry.score.toLocaleString()}</div>
                            <div style="font-size: 9px; color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">Points</div>
                        </div>
                    </div>
                `).join('');
            } else if (previewEl) {
                previewEl.innerHTML = `<div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); text-align: center;">No ranked players yet</div>`;
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
        const updateTimerAnimated = (el: HTMLElement, text: string) => {
            if (el.children.length !== text.length) {
                el.innerHTML = text.split('').map(c => `<span>${c}</span>`).join('');
                return;
            }
            for (let i = 0; i < text.length; i++) {
                const span = el.children[i] as HTMLElement;
                if (span.textContent !== text[i]) {
                    span.textContent = text[i];
                    span.classList.remove('digit-tick');
                    void span.offsetWidth; // trigger reflow
                    span.classList.add('digit-tick');
                }
            }
        };

        this._timerInterval = window.setInterval(() => {
            let secondsRemaining = Math.floor((targetTime - new Date().getTime()) / 1000);
            
            if (secondsRemaining <= 0) {
                if (this._timerInterval !== null) {
                    clearInterval(this._timerInterval);
                    this._timerInterval = null;
                }
                
                const wasCompleted = localStorage.getItem('ETHIO_DAILY_COMPLETED_TODAY') === 'true';
                localStorage.removeItem('ETHIO_DAILY_COMPLETED_TODAY');
                
                if (wasCompleted) {
                    window.dispatchEvent(new Event('ethio:dailyReset'));
                } else {
                    secondsRemaining = 0;
                    const timerEl = document.getElementById('daily-countdown');
                    if (timerEl) timerEl.innerHTML = `⏱️ 0h : 00m : 00s`;
                    const nextTimerEl = document.getElementById('next-daily-countdown');
                    if (nextTimerEl) nextTimerEl.innerHTML = `00:00:00`;
                }
                return;
            }

            const h = Math.floor(secondsRemaining / 3600);
            const m = Math.floor((secondsRemaining % 3600) / 60);
            const s = secondsRemaining % 60;

            const timerEl = document.getElementById('daily-countdown');
            if (timerEl) {
                updateTimerAnimated(timerEl, `⏱️ ${h}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`);
            }
            
            const nextTimerEl = document.getElementById('next-daily-countdown');
            if (nextTimerEl) {
                updateTimerAnimated(nextTimerEl, `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
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

        root.querySelector('#btn-daily-match-card')?.addEventListener('click', (e) => {
            this._addRipple(e);
            this._audioManager.playClick();
            this._callbacks.onDailyChallenge();
        });

        root.querySelector('#btn-continue-challenge')?.addEventListener('click', (e) => {
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

        // Ad Carousel Logic
        const carousel = root.querySelector('#ad-carousel') as HTMLElement;
        const dots = root.querySelectorAll('.ad-dot');
        if (carousel && dots.length > 0) {
            let currentIndex = 0;

            const updateDots = (index: number) => {
                dots.forEach((dot, i) => {
                    if (i === index) {
                        dot.classList.add('active');
                        (dot as HTMLElement).style.opacity = '1';
                    } else {
                        dot.classList.remove('active');
                        (dot as HTMLElement).style.opacity = '0.4';
                    }
                });
            };

            const scrollToNext = () => {
                if (!carousel.clientWidth) return;
                currentIndex = (currentIndex + 1) % dots.length;
                const targetScroll = carousel.clientWidth * currentIndex;
                
                // Custom smooth slide (fixes abrupt changes on devices lacking smooth scroll support)
                const startScroll = carousel.scrollLeft;
                const distance = targetScroll - startScroll;
                const duration = 400; // 400ms smooth slide
                let startTime: number | null = null;
                
                const animateScroll = (currentTime: number) => {
                    if (startTime === null) startTime = currentTime;
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeInOutQuad easing
                    const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                    
                    carousel.scrollLeft = startScroll + distance * ease;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    }
                };
                requestAnimationFrame(animateScroll);

                updateDots(currentIndex);
            };

            const startAutoScroll = () => {
                clearInterval(this._autoScrollInterval);
                this._autoScrollInterval = setInterval(scrollToNext, 4000);
            };

            const stopAutoScroll = () => {
                clearInterval(this._autoScrollInterval);
            };

            carousel.addEventListener('scroll', () => {
                if (!carousel.clientWidth) return;
                const newIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < dots.length) {
                    currentIndex = newIndex;
                    updateDots(currentIndex);
                }
            }, { passive: true });

            carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
            carousel.addEventListener('touchend', startAutoScroll, { passive: true });
            carousel.addEventListener('mouseenter', stopAutoScroll);
            carousel.addEventListener('mouseleave', startAutoScroll);

            startAutoScroll();
        }
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
        if (this._resetHandler) {
            window.removeEventListener('ethio:dailyReset', this._resetHandler);
            this._resetHandler = null;
        }
    }
}
