import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { UIManager } from '../../core/managers/UIManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';

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
        const levelInfo = ProgressionManager.getLevel(profile.xp);

        root.innerHTML = `
            <div class="stadium-container">
                <!-- Floodlight FX -->
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <!-- Top Bar Profile HUD -->
                <div style="
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    right: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 10;
                ">
                    <!-- Profile & Rank -->
                    <div class="glass-card" style="padding: 10px 18px; display: flex; align-items: center; gap: 14px;">
                        <div style="
                            width: 44px;
                            height: 44px;
                            border-radius: 50%;
                            background: var(--gold-gradient);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 22px;
                            font-weight: bold;
                            color: #000;
                            box-shadow: 0 0 12px var(--gold-glow);
                        ">⚽</div>
                        <div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-weight: 800; font-size: 16px;">${profile.username}</span>
                                <span class="rank-badge ${rank.badgeClass}">${rank.icon} ${rank.name}</span>
                            </div>
                            <!-- Level & XP Bar -->
                            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                                <span style="font-size: 12px; color: var(--gold-primary); font-weight: bold;">LVL ${levelInfo.level}</span>
                                <div style="width: 100px; height: 6px; background: rgba(255,255,255,0.15); border-radius: 3px; overflow: hidden;">
                                    <div style="width: ${levelInfo.progressPercent}%; height: 100%; background: var(--gold-gradient); border-radius: 3px;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Currency & Audio Mute -->
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div class="glass-card" style="padding: 10px 16px; font-weight: bold; color: var(--gold-primary); font-size: 15px;">
                            🪙 ${profile.coins} COINS
                        </div>
                        <div class="glass-card" style="padding: 10px 16px; font-weight: bold; color: #EF4444; font-size: 15px;">
                            🔥 ${profile.streakCount || 0} DAY STREAK
                        </div>
                        <button id="home-audio-btn" class="glass-card" style="
                            padding: 10px 16px;
                            color: white;
                            font-weight: bold;
                            cursor: pointer;
                            border: 1px solid var(--glass-border);
                        ">${this._audioManager.isMuted ? '🔇' : '🔊'}</button>
                    </div>
                </div>

                <!-- Center Main Broadcast Area -->
                <div style="
                    position: absolute;
                    top: 55%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 90%;
                    max-width: 520px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 10;
                ">
                    <!-- Logo Header -->
                    <div style="margin-bottom: 30px;">
                        <div style="
                            font-size: 14px;
                            font-weight: 800;
                            letter-spacing: 4px;
                            color: var(--pitch-green);
                            margin-bottom: 6px;
                            text-transform: uppercase;
                        ">ETHIO TELECOM VAS PLATFORM</div>
                        <h1 style="
                            font-size: 44px;
                            font-weight: 900;
                            margin: 0;
                            letter-spacing: 1.5px;
                            background: linear-gradient(135deg, #FFFFFF 0%, #FFD700 60%, #FF9900 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            text-shadow: 0 4px 30px var(--gold-glow);
                            line-height: 1.1;
                        ">FOOTBALL QUIZ LEAGUE</h1>
                    </div>

                    <!-- Main Actions -->
                    <div style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <button id="btn-kickoff" class="broadcast-btn broadcast-btn-gold" style="font-size: 16px; padding: 16px;">
                                ⚽ SOLO MATCH
                            </button>
                            <button id="btn-livematch" class="broadcast-btn broadcast-btn-green" style="font-size: 16px; padding: 16px;">
                                ⚡ LIVE 1v1 MATCH
                            </button>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <button id="btn-daily" class="broadcast-btn glass-card" style="color: white;">
                                📅 DAILY CHALLENGE
                            </button>
                            <button id="btn-competitions" class="broadcast-btn glass-card" style="color: white;">
                                🏆 COMPETITIONS
                            </button>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                            <button id="btn-leaderboard" class="broadcast-btn glass-card" style="color: white; font-size: 13px; padding: 12px 8px;">
                                📊 LEADERBOARD
                            </button>
                            <button id="btn-achievements" class="broadcast-btn glass-card" style="color: white; font-size: 13px; padding: 12px 8px;">
                                🎖️ BADGES
                            </button>
                            <button id="btn-admin" class="broadcast-btn glass-card" style="color: var(--gold-primary); font-size: 13px; padding: 12px 8px; border-color: rgba(255,215,0,0.4);">
                                ⚙️ ADMIN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

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
