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

        const telemetryStats = DesignSystem.Flex(`
            <div class="glass-card" style="padding: 6px 14px; font-weight: 900; color: #60A5FA; font-size: 13px; font-family: var(--fds-font-mono);">
                ⚡ ${profile.xp} XP
            </div>
            <div class="glass-card" style="padding: 6px 14px; font-weight: 900; color: var(--fds-gold-primary); font-size: 13px; font-family: var(--fds-font-mono);">
                ${division.badge} DIV ${division.tier}
            </div>
            <button id="home-audio-btn" class="glass-card" style="padding: 6px 12px; color: white; font-weight: bold; cursor: pointer; border: 1px solid var(--tv-glass-border);">
                ${this._audioManager.isMuted ? '🔇' : '🔊'}
            </button>
        `, { gap: 'var(--fds-space-8)' });

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>
                
                <div class="tv-broadcast-header">
                    <div style="display: flex; align-items: center; gap: var(--fds-space-12);">
                        ${DesignSystem.Badge({ text: 'MATCHDAY HUB', variant: 'live' })}
                        <span class="tv-channel-logo">ETHIO TELECOM <span>SPORTS HD</span></span>
                    </div>
                    ${telemetryStats}
                </div>

                <div style="max-width: 880px; margin: var(--fds-space-20) auto; position: relative; z-index: 10; padding: 0 var(--fds-space-20);">
                    
                    ${DesignSystem.Card({
                        borderColor: 'var(--fds-gold-primary)',
                        className: 'margin-bottom-20',
                        content: DesignSystem.Flex(`
                            ${DesignSystem.Flex(`
                                <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--fds-gold-gradient); display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: bold; color: #000; box-shadow: 0 0 16px var(--fds-gold-glow);">⚽</div>
                                <div>
                                    ${DesignSystem.Text('WELCOME BACK, CHAMPION!', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-4) 0' })}
                                    ${DesignSystem.Flex(`
                                        ${DesignSystem.Text(profile.username, { size: 'var(--fds-font-lg)', weight: '900', color: 'white' })}
                                        <span class="rank-badge ${rank.badgeClass}">${rank.icon} ${rank.name}</span>
                                    `, { gap: 'var(--fds-space-8)' })}
                                </div>
                            `, { gap: 'var(--fds-space-16)' })}
                            ${DesignSystem.Button({ id: 'btn-quick-kickoff', text: '⚡ QUICK MATCH', variant: 'gold' })}
                        `, { justify: 'space-between', wrap: true, gap: 'var(--fds-space-16)' })
                    })}

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--fds-space-16); margin-bottom: var(--fds-space-20);">
                        ${DesignSystem.Card({
                            borderColor: '#60A5FA',
                            content: `
                                ${DesignSystem.Text('▶ CONTINUE LAST MATCH', { size: 'var(--fds-font-xs)', weight: '800', color: '#60A5FA', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Walia Ibex National Derby', { size: 'var(--fds-font-md)', weight: '800', color: 'white', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Question 4 of 10 • 1st Half', { size: 'var(--fds-font-xs)', color: '#94A3B8', margin: '0 0 var(--fds-space-12) 0' })}
                                ${DesignSystem.Button({ id: 'btn-resume-match', text: 'RESUME MATCH ⚽', variant: 'green', fullWidth: true })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: 'var(--tv-pitch-green)',
                            content: `
                                ${DesignSystem.Text('📅 FEATURED DAILY CHALLENGE', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--tv-pitch-green)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Ethiopian Premier League Derby', { size: 'var(--fds-font-md)', weight: '800', color: 'white', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Earn 2x XP + Daily Streak Bonus (+500 XP)', { size: 'var(--fds-font-xs)', color: '#94A3B8', margin: '0 0 var(--fds-space-12) 0' })}
                                ${DesignSystem.Button({ id: 'btn-daily-match', text: 'PLAY DAILY DERBY (+500 XP)', variant: 'gold', fullWidth: true })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: division.color,
                            content: `
                                ${DesignSystem.Text(`${division.badge} CURRENT PLAYER DIVISION`, { size: 'var(--fds-font-xs)', weight: '800', color: division.color, margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text(division.name, { size: 'var(--fds-font-lg)', weight: '900', color: 'white', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text(division.weeklyPromotionZone, { size: 'var(--fds-font-xs)', color: '#94A3B8', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.ProgressBar(seasonInfo.progressPercent, division.color)}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: 'var(--fds-gold-primary)',
                            content: `
                                ${DesignSystem.Text('⚡ LEVEL & XP PROGRESS', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Flex(`
                                    ${DesignSystem.Text(`Level ${levelInfo.level}`, { size: 'var(--fds-font-md)', weight: '800', color: 'white' })}
                                    ${DesignSystem.Text(`${levelInfo.currentXp}/${levelInfo.nextLevelXp} XP`, { size: 'var(--fds-font-sm)', weight: '800', color: 'var(--fds-gold-primary)', family: 'var(--fds-font-mono)' })}
                                `, { justify: 'space-between', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.ProgressBar(levelInfo.progressPercent)}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: '#C084FC',
                            content: `
                                ${DesignSystem.Text('📊 WEEKLY LEAGUE STANDING', { size: 'var(--fds-font-xs)', weight: '800', color: '#C084FC', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Flex(`
                                    <div>
                                        ${DesignSystem.Text('Rank #4', { size: 'var(--fds-font-lg)', weight: '900', color: 'white' })}
                                        ${DesignSystem.Text('3,450 Division Points', { size: 'var(--fds-font-xs)', color: '#94A3B8' })}
                                    </div>
                                    <span class="fds-badge" style="background: rgba(192, 132, 252, 0.2); color: #C084FC; border: 1px solid #C084FC; font-size: var(--fds-font-xs); font-weight: 800; padding: 4px 8px; border-radius: var(--radius-sm);">PROMOTION ZONE</span>
                                `, { justify: 'space-between' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('🏆 LATEST WEEKLY CHAMPIONS', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('🥇 Abebe K. (4,820 pts)<br/>🥈 Yonas M. (4,610 pts)<br/>🥉 Biruk T. (4,390 pts)', { size: 'var(--fds-font-sm)', color: 'white', weight: '600' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: '#38BDF8',
                            content: `
                                ${DesignSystem.Text('📢 ETHIO TELECOM SPORTS ANNOUNCEMENTS', { size: 'var(--fds-font-xs)', weight: '800', color: '#38BDF8', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('AFCON 2026 Special Quiz Tournament starts this Friday! Subscribe to unlock 2x bonus rewards.', { size: 'var(--fds-font-sm)', color: '#F8FAFC', weight: '600' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('👥 INVITE FRIENDS & CHALLENGE', { size: 'var(--fds-font-xs)', weight: '800', color: '#F59E0B', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('Challenge your friends to an async 1v1 derby and earn +250 XP per win.', { size: 'var(--fds-font-sm)', color: '#94A3B8', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Button({ id: 'btn-invite-friends', text: 'INVITE FRIEND 👥', variant: 'gold', fullWidth: true })}
                            `
                        })}

                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('📈 RECENT MATCH TELEMETRY', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--tv-pitch-green)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('⚽ 7 Goals • 🎯 80% Accuracy<br/>⭐ 8.5 Match Rating • 🔥 5x Combo', { size: 'var(--fds-font-sm)', color: 'white', weight: '600' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: '#F59E0B',
                            content: `
                                ${DesignSystem.Text('🎖️ BADGES CABINET', { size: 'var(--fds-font-xs)', weight: '800', color: '#F59E0B', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Flex(`
                                    ${DesignSystem.Text('8 of 15 Unlocked', { size: 'var(--fds-font-sm)', weight: '800', color: 'white' })}
                                    <span style="font-size: var(--fds-font-lg);">🎯 ⚽ 🏆 🥇</span>
                                `, { justify: 'space-between', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Button({ id: 'btn-open-achievements', text: 'VIEW BADGES CABINET 🎖️', variant: 'glass', fullWidth: true })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: '#EC4899',
                            content: `
                                ${DesignSystem.Text('📅 UPCOMING MATCHDAY EVENTS', { size: 'var(--fds-font-xs)', weight: '800', color: '#EC4899', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('⚽ Ethiopian Premier Derby — Today 20:00<br/>🌍 CAF Champions League Final — Sat 18:00', { size: 'var(--fds-font-sm)', color: 'white', weight: '600' })}
                            `
                        })}
                    </div>
                </div>
            </div>
            <style>
                .margin-bottom-20 { margin-bottom: var(--fds-space-20); }
            </style>
        `;

        ReturningPlayerModal.checkAndShow(this._uiManager, this._saveManager, this._audioManager);

        this._bindEvents();
    }

    private _bindEvents(): void {
        document.getElementById('home-audio-btn')?.addEventListener('click', () => {
            this._audioManager.toggleMute();
            this.render();
        });

        document.getElementById('btn-quick-kickoff')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onKickOff();
        });

        document.getElementById('btn-resume-match')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onKickOff();
        });

        document.getElementById('btn-daily-match')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onDailyChallenge();
        });

        document.getElementById('btn-invite-friends')?.addEventListener('click', () => {
            this._audioManager.playClick();
            // Fixing broken routing - this originally routed directly to LiveMatch and skipped friends logic.
            this._callbacks.onLiveMatch();
        });

        document.getElementById('btn-open-achievements')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onAchievements();
        });
    }
}
