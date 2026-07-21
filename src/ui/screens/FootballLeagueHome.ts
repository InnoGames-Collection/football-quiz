import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { UIManager } from '../../core/managers/UIManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { ReturningPlayerModal } from '../components/ReturningPlayerModal';
import { DesignSystem } from '../theme/DesignSystem';

export interface FootballHomeCallbacks {
    onKickOff: () => void;
    onLiveMatch: () => void;
    onDailyChallenge: () => void;
    onCompetitions: () => void;
    onLeaderboard: () => void;
    onAchievements: () => void;
    onAdminPanel: () => void;
    onSettings: () => void;
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
        const msisdn = "+251 911 *** ***"; // Mock MSISDN

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- ETHIO FANTASY APP BAR -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: space-between; padding: 12px 16px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--tv-pitch-green); display: flex; align-items: center; justify-content: center; font-size: 16px;">
                            👤
                        </div>
                        <div style="font-weight: 900; font-size: 18px; letter-spacing: 1px;">ETHIO FANTASY</div>
                    </div>
                    <button id="btn-settings" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">
                        ⚙️
                    </button>
                </div>

                <!-- COMPACT TELEMETRY BAR -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 12px 16px; background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.05); text-align: center;">
                    <div>
                        <div style="font-size: 10px; color: #94A3B8; font-weight: 700; text-transform: uppercase;">MSISDN</div>
                        <div style="font-size: 12px; font-weight: 600; color: white; margin-top: 2px;">${msisdn}</div>
                    </div>
                    <div>
                        <div style="font-size: 10px; color: #94A3B8; font-weight: 700; text-transform: uppercase;">League</div>
                        <div style="font-size: 12px; font-weight: 600; color: ${division.color}; margin-top: 2px;">${division.name}</div>
                    </div>
                    <div>
                        <div style="font-size: 10px; color: #94A3B8; font-weight: 700; text-transform: uppercase;">Rank</div>
                        <div style="font-size: 12px; font-weight: 600; color: white; margin-top: 2px;">${rank.name}</div>
                    </div>
                    <div>
                        <div style="font-size: 10px; color: #94A3B8; font-weight: 700; text-transform: uppercase;">Points</div>
                        <div style="font-size: 12px; font-weight: 600; color: #60A5FA; margin-top: 2px;">${profile.xp} XP</div>
                    </div>
                </div>

                <div style="max-width: 960px; margin: 0 auto; padding: 16px;">
                    
                    <!-- 1. Daily Challenge (Primary) -->
                    <div class="glass-card" style="border-color: var(--tv-gold-primary); background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(15,23,42,0.8) 100%); padding: 20px; text-align: center; margin-bottom: 16px; cursor: pointer;" id="card-daily">
                        <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
                        <div style="font-size: 20px; font-weight: 900; color: var(--tv-gold-primary); margin-bottom: 12px;">DAILY CHALLENGE</div>
                        ${DesignSystem.Button({ id: 'btn-daily-match', text: 'PLAY NOW (+500 XP)', variant: 'gold', fullWidth: true })}
                    </div>

                    <!-- 2. Quick Play -->
                    <div class="glass-card" style="border-color: var(--tv-pitch-green); background: linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(15,23,42,0.8) 100%); padding: 20px; text-align: center; margin-bottom: 16px; cursor: pointer;" id="card-quickplay">
                        <div style="font-size: 32px; margin-bottom: 8px;">⚡</div>
                        <div style="font-size: 18px; font-weight: 900; color: var(--tv-pitch-green); margin-bottom: 12px;">QUICK PLAY</div>
                        ${DesignSystem.Button({ id: 'btn-quick-kickoff', text: 'START MATCH ⚽', variant: 'green', fullWidth: true })}
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 16px;">
                        <!-- 3. Current League -->
                        <div class="glass-card" style="padding: 16px; border-color: ${division.color}; cursor: pointer;" id="card-league">
                            <div style="font-size: 11px; font-weight: 800; color: ${division.color}; margin-bottom: 8px;">🏆 CURRENT LEAGUE</div>
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 8px;">${division.badge} ${division.name}</div>
                            ${DesignSystem.ProgressBar(levelInfo.progressPercent, division.color)}
                        </div>

                        <!-- 4. Daily Progress -->
                        <div class="glass-card" style="padding: 16px; border-color: #38BDF8;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <div style="font-size: 11px; font-weight: 800; color: #38BDF8;">📈 DAILY PROGRESS</div>
                                <div style="font-size: 11px; font-weight: 800; color: #38BDF8;">Level ${levelInfo.level}</div>
                            </div>
                            <div style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 8px; font-family: var(--fds-font-mono);">${levelInfo.currentXp} / ${levelInfo.nextLevelXp} XP</div>
                            ${DesignSystem.ProgressBar(levelInfo.progressPercent, '#38BDF8')}
                        </div>

                        <!-- 5. Your Statistics -->
                        <div class="glass-card" style="padding: 16px; border-color: #F472B6;">
                            <div style="font-size: 11px; font-weight: 800; color: #F472B6; margin-bottom: 12px;">📊 YOUR STATISTICS</div>
                            <div style="display: flex; justify-content: space-between;">
                                <div>
                                    <div style="font-size: 10px; color: #94A3B8; font-weight: 700;">WIN RATE</div>
                                    <div style="font-size: 16px; font-weight: 800; color: white;">${Math.round(((profile.totalWins || 0) / (profile.totalMatches || 1)) * 100)}%</div>
                                </div>
                                <div>
                                    <div style="font-size: 10px; color: #94A3B8; font-weight: 700;">MATCHES</div>
                                    <div style="font-size: 16px; font-weight: 800; color: white;">${profile.totalMatches || 0}</div>
                                </div>
                                <div>
                                    <div style="font-size: 10px; color: #94A3B8; font-weight: 700;">STREAK</div>
                                    <div style="font-size: 16px; font-weight: 800; color: white;">${profile.streakCount || 0}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 6. Latest Winners -->
                        <div class="glass-card" style="padding: 16px; cursor: pointer;" id="card-leaderboard">
                            <div style="font-size: 11px; font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 12px;">🎖️ TOURNAMENT WINNERS</div>
                            <div style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 4px;">🥇 Abebe K.</div>
                            <div style="font-size: 14px; font-weight: 700; color: #CBD5E1; margin-bottom: 4px;">🥈 Yonas M.</div>
                            <div style="font-size: 14px; font-weight: 700; color: #94A3B8;">🥉 Biruk T.</div>
                        </div>

                        <!-- 7. Upcoming Competitions -->
                        <div class="glass-card" style="padding: 16px;">
                            <div style="font-size: 11px; font-weight: 800; color: #A78BFA; margin-bottom: 12px;">📅 UPCOMING</div>
                            <div style="font-size: 14px; font-weight: 800; color: white;">⚽ Ethiopian Premier Derby</div>
                            <div style="font-size: 12px; color: #A78BFA; margin-bottom: 12px;">Today 20:00 EAT</div>
                            <div style="font-size: 14px; font-weight: 800; color: white;">🌍 CAF Champions Quiz</div>
                            <div style="font-size: 12px; color: #A78BFA;">Saturday 18:00 EAT</div>
                        </div>

                        <!-- 8. Recent Activity -->
                        <div class="glass-card" style="padding: 16px;">
                            <div style="font-size: 11px; font-weight: 800; color: #F472B6; margin-bottom: 12px;">⏱️ RECENT ACTIVITY</div>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-size: 20px;">🎯</span>
                                <div>
                                    <div style="font-size: 14px; font-weight: 800; color: white;">Match Completed</div>
                                    <div style="font-size: 12px; color: #94A3B8;">+240 XP</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;

        ReturningPlayerModal.checkAndShow(this._uiManager, this._saveManager, this._audioManager);
        this._bindEvents();
    }

    private _bindEvents(): void {
        document.getElementById('btn-settings')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._callbacks.onSettings) this._callbacks.onSettings();
        });

        document.getElementById('btn-quick-kickoff')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onKickOff();
        });
        document.getElementById('card-quickplay')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onKickOff();
        });

        document.getElementById('btn-daily-match')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onDailyChallenge();
        });
        document.getElementById('card-daily')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onDailyChallenge();
        });

        document.getElementById('card-league')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onCompetitions();
        });

        document.getElementById('card-leaderboard')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onLeaderboard();
        });
    }
}
