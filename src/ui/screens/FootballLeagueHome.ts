import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { UIManager } from '../../core/managers/UIManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { ReturningPlayerModal } from '../components/ReturningPlayerModal';

export interface FootballHomeCallbacks {
    onKickOff: () => void;
    onLiveMatch: () => void;
    onDailyChallenge: () => void;
    onCompetitions: () => void;
    onLeaderboard: () => void;
    onAchievements: () => void;
    onAdminPanel: () => void;
}

export class FootballLeagueHome {
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _uiManager: UIManager;
    private _callbacks: FootballHomeCallbacks;

    constructor(saveManager: SaveManager, audioManager: AudioManager, uiManager: UIManager, callbacks: FootballHomeCallbacks) {
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._uiManager = uiManager;
        this._callbacks = callbacks;
    }

    public render(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const rank = ProgressionManager.getRank(profile.xp);
        const division = ProgressionManager.getDivision(profile.xp);
        const levelInfo = ProgressionManager.getLevel(profile.xp);
        const seasonInfo = ProgressionManager.getSeasonPassInfo(profile.xp);

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto;">
                <!-- Floodlight FX -->
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <!-- Top TV Broadcast Header Banner -->
                <div class="tv-broadcast-header">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span class="tv-live-badge">
                            <span class="tv-live-dot"></span> LIVE BROADCAST
                        </span>
                        <span class="tv-channel-logo">ETHIO TELECOM <span>SPORTS HD</span></span>
                    </div>

                    <!-- Telemetry Stats (XP, Division, Mute) -->
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <div class="glass-card" style="padding: 6px 14px; font-weight: 900; color: #60A5FA; font-size: 13px; font-family: var(--tv-mono);">
                            ⚡ ${profile.xp} XP
                        </div>
                        <div class="glass-card" style="padding: 6px 14px; font-weight: 900; color: var(--tv-gold-primary); font-size: 13px; font-family: var(--tv-mono);">
                            ${division.badge} DIV ${division.tier}
                        </div>
                        <button id="home-audio-btn" class="glass-card" style="
                            padding: 6px 12px;
                            color: white;
                            font-weight: bold;
                            cursor: pointer;
                            border: 1px solid var(--tv-glass-border);
                        ">${this._audioManager.isMuted ? '🔇' : '🔊'}</button>
                    </div>
                </div>

                <!-- Main Hub Layout Container -->
                <div style="max-width: 860px; margin: 20px auto 40px auto; position: relative; z-index: 10; padding: 0 20px;">
                    
                    <!-- Player Profile & Player Division Header HUD -->
                    <div class="glass-card" style="padding: 20px; margin-bottom: 20px; background: rgba(2, 6, 23, 0.85); border-color: var(--tv-gold-primary);">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                            <!-- Profile Info -->
                            <div style="display: flex; align-items: center; gap: 16px;">
                                <div style="
                                    width: 52px;
                                    height: 52px;
                                    border-radius: 50%;
                                    background: var(--tv-gold-gradient);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 26px;
                                    font-weight: bold;
                                    color: #000;
                                    box-shadow: 0 0 16px var(--tv-gold-glow);
                                ">⚽</div>
                                <div>
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <span style="font-weight: 900; font-size: 18px; color: white;">${profile.username}</span>
                                        <span class="rank-badge ${rank.badgeClass}">${rank.icon} ${rank.name}</span>
                                    </div>
                                    <div style="font-size: 13px; color: ${division.color}; font-weight: 800; margin-top: 2px;">
                                        ${division.badge} ${division.name} • <span style="color: var(--tv-text-muted); font-size: 11px;">${division.weeklyPromotionZone}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Level & XP Telemetry Bar -->
                            <div style="text-align: right;">
                                <div style="font-size: 12px; color: var(--tv-gold-primary); font-weight: 900; font-family: var(--tv-mono); margin-bottom: 4px;">
                                    LEVEL ${levelInfo.level} (${levelInfo.currentXp}/${levelInfo.nextLevelXp} XP)
                                </div>
                                <div style="width: 180px; height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${levelInfo.progressPercent}%; height: 100%; background: var(--tv-gold-gradient); border-radius: 4px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Retention Dashboard Grid (7-Day Streak & Season Progress) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                        
                        <!-- 7-Day Streak Calendar -->
                        <div class="glass-card" style="padding: 18px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <span style="font-size: 12px; font-weight: 900; color: #EF4444; letter-spacing: 1px;">🔥 7-DAY STREAK</span>
                                <span style="font-size: 12px; font-weight: 900; color: white; font-family: var(--tv-mono);">${profile.streakCount || 1} DAYS</span>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">
                                ${[1, 2, 3, 4, 5, 6, 7].map(d => {
                                    const active = d <= (profile.streakCount || 1);
                                    return `
                                        <div style="
                                            background: ${active ? '#EF4444' : 'rgba(255,255,255,0.08)'};
                                            color: ${active ? 'white' : '#64748B'};
                                            border-radius: 6px;
                                            padding: 6px 2px;
                                            text-align: center;
                                            font-size: 10px;
                                            font-weight: 900;
                                        ">
                                            D${d}<br/>${active ? '🔥' : '🔒'}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Season Pass Progress -->
                        <div class="glass-card" style="padding: 18px; border-color: #60A5FA;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-size: 12px; font-weight: 900; color: #60A5FA; letter-spacing: 1px;">🏆 SEASON 1 PASS</span>
                                <span style="font-size: 12px; font-weight: 900; color: white; font-family: var(--tv-mono);">LVL ${seasonInfo.seasonLevel}/50</span>
                            </div>
                            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden; margin-bottom: 10px;">
                                <div style="width: ${seasonInfo.progressPercent}%; height: 100%; background: linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%);"></div>
                            </div>
                            <div style="font-size: 11px; color: var(--tv-text-muted);">
                                UNLOCKED: <strong style="color: white;">${seasonInfo.unlockedRewards.join(', ') || 'Keep playing to unlock badges!'}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Daily Match & Weekly Challenge Banner Cards -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                        
                        <!-- Daily Match Card -->
                        <div class="glass-card" style="padding: 20px; border-color: var(--tv-pitch-green);">
                            <div style="font-size: 11px; font-weight: 900; color: var(--tv-pitch-green); letter-spacing: 1px; margin-bottom: 4px;">
                                📅 FEATURED DAILY MATCH
                            </div>
                            <h3 style="margin: 0 0 8px 0; color: white; font-size: 18px;">ETHIOPIAN PREMIER DERBY</h3>
                            <p style="color: var(--tv-text-muted); font-size: 12px; margin-bottom: 14px; line-height: 1.4;">
                                Complete today's derby quiz to earn 2x XP and advance your weekly league division standing.
                            </p>
                            <button id="btn-daily" class="broadcast-btn broadcast-btn-green" style="width: 100%; font-size: 14px; padding: 12px;">
                                ⚡ PLAY DAILY MATCH (+500 XP)
                            </button>
                        </div>

                        <!-- Weekly League Challenge Card -->
                        <div class="glass-card" style="padding: 20px; border-color: var(--tv-gold-primary);">
                            <div style="font-size: 11px; font-weight: 900; color: var(--tv-gold-primary); letter-spacing: 1px; margin-bottom: 4px;">
                                ⚔️ WEEKLY LEAGUE PROMOTION
                            </div>
                            <h3 style="margin: 0 0 8px 0; color: white; font-size: 18px;">CAF CHAMPIONS LEAGUE</h3>
                            <p style="color: var(--tv-text-muted); font-size: 12px; margin-bottom: 14px; line-height: 1.4;">
                                Finish top 20% in the weekly leaderboard to earn division promotion and exclusive badges.
                            </p>
                            <button id="btn-competitions" class="broadcast-btn broadcast-btn-gold" style="width: 100%; font-size: 14px; padding: 12px;">
                                🏆 ENTER WEEKLY LEAGUE
                            </button>
                        </div>
                    </div>

                    <!-- Main Navigation Grid -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px;">
                        <button id="btn-kickoff" class="broadcast-btn broadcast-btn-gold" style="font-size: 15px; padding: 14px;">
                            ⚽ SOLO MATCH
                        </button>
                        <button id="btn-livematch" class="broadcast-btn broadcast-btn-green" style="font-size: 15px; padding: 14px;">
                            ⚡ LIVE 1v1 MATCH
                        </button>
                        <button id="btn-leaderboard" class="broadcast-btn glass-card" style="color: white; font-size: 13px; padding: 14px;">
                            📊 LEADERBOARD
                        </button>
                        <button id="btn-achievements" class="broadcast-btn glass-card" style="color: white; font-size: 13px; padding: 14px;">
                            🎖️ BADGES & BADGE CABINET
                        </button>
                        <button id="btn-admin" class="broadcast-btn glass-card" style="color: var(--tv-gold-primary); font-size: 13px; padding: 14px; border-color: rgba(255,215,0,0.4);">
                            ⚙️ CMS ADMIN
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Check & Render Returning Player Welcome Modal
        ReturningPlayerModal.checkAndShow(this._uiManager, this._saveManager, this._audioManager);

        this._bindEvents();
    }

    private _bindEvents(): void {
        document.getElementById('home-audio-btn')?.addEventListener('click', () => {
            this._audioManager.toggleMute();
            this.render();
        });

        document.getElementById('btn-kickoff')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onKickOff();
        });

        document.getElementById('btn-livematch')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onLiveMatch();
        });

        document.getElementById('btn-daily')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onDailyChallenge();
        });

        document.getElementById('btn-competitions')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onCompetitions();
        });

        document.getElementById('btn-leaderboard')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onLeaderboard();
        });

        document.getElementById('btn-achievements')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onAchievements();
        });

        document.getElementById('btn-admin')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onAdminPanel();
        });
    }
}
