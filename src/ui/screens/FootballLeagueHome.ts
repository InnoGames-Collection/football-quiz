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
        const streakCount = profile.streakCount || 0;

        // Header Stats
        const telemetryStats = DesignSystem.Flex(`
            <div class="glass-card" style="padding: 6px 14px; font-weight: 900; color: #60A5FA; font-size: 13px; font-family: var(--fds-font-mono);">
                ⚡ ${profile.xp} XP
            </div>
            <button id="home-audio-btn" class="glass-card" style="padding: 6px 12px; color: white; font-weight: bold; cursor: pointer; border: 1px solid var(--tv-glass-border);">
                ${this._audioManager.isMuted ? '🔇' : '🔊'}
            </button>
        `, { gap: 'var(--fds-space-8)' });

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; background: radial-gradient(circle at 50% 10%, #0B192C 0%, #050A13 80%);">
                
                <div class="tv-broadcast-header" style="border-bottom: 2px solid var(--tv-pitch-green);">
                    <div style="display: flex; align-items: center; gap: var(--fds-space-12);">
                        ${DesignSystem.Badge({ text: 'TELECOM SPORTS HUB', variant: 'live' })}
                    </div>
                    ${telemetryStats}
                </div>

                <div style="max-width: 960px; margin: 0 auto; position: relative; z-index: 10; padding: var(--fds-space-16) var(--fds-space-16) 100px var(--fds-space-16);">
                    
                    <!-- HERO SECTION (Welcome + Quick Info) -->
                    ${DesignSystem.Card({
                        borderColor: 'transparent',
                        className: 'margin-bottom-20',
                        content: DesignSystem.Flex(`
                            <div>
                                ${DesignSystem.Text('WELCOME BACK TO THE LEAGUE', { size: 'var(--fds-font-xs)', weight: '800', color: '#94A3B8', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Flex(`
                                    <span style="font-size: 32px; margin-right: 8px;">⚽</span>
                                    ${DesignSystem.Text(profile.username, { size: 'var(--fds-font-xl)', weight: '900', color: 'white' })}
                                `, { align: 'center' })}
                            </div>
                            <div style="text-align: right;">
                                ${DesignSystem.Text('CURRENT RANK', { size: 'var(--fds-font-xs)', weight: '800', color: '#94A3B8', margin: '0 0 var(--fds-space-4) 0' })}
                                <div class="rank-badge ${rank.badgeClass}" style="display: inline-block;">${rank.icon} ${rank.name}</div>
                            </div>
                        `, { justify: 'space-between', align: 'center', wrap: true, gap: 'var(--fds-space-16)' })
                    })}

                    <!-- PRIMARY ACTIONS (Play Modes) -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--fds-space-16); margin-bottom: var(--fds-space-24);">
                        
                        <!-- Daily Quiz CTA -->
                        <div class="glass-card" style="border-color: var(--tv-gold-primary); background: linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(30,41,59,0.95) 100%); padding: var(--fds-space-24); text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 8px;">📅</div>
                            ${DesignSystem.Text('DAILY FOOTBALL QUIZ', { size: 'var(--fds-font-lg)', weight: '900', color: 'var(--tv-gold-primary)', margin: '0 0 var(--fds-space-4) 0' })}
                            ${DesignSystem.Text(`Play today's featured quiz. Streak: 🔥 ${streakCount} Days`, { size: 'var(--fds-font-sm)', color: '#CBD5E1', margin: '0 0 var(--fds-space-16) 0' })}
                            ${DesignSystem.Button({ id: 'btn-daily-match', text: 'PLAY DAILY QUIZ (+500 XP)', variant: 'gold', fullWidth: true })}
                        </div>

                        <!-- Quick Play CTA -->
                        <div class="glass-card" style="border-color: var(--tv-pitch-green); background: linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(30,41,59,0.95) 100%); padding: var(--fds-space-24); text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 8px;">⚡</div>
                            ${DesignSystem.Text('QUICK KICK-OFF', { size: 'var(--fds-font-lg)', weight: '900', color: 'var(--tv-pitch-green)', margin: '0 0 var(--fds-space-4) 0' })}
                            ${DesignSystem.Text('Jump straight into a 10-question random match.', { size: 'var(--fds-font-sm)', color: '#CBD5E1', margin: '0 0 var(--fds-space-16) 0' })}
                            ${DesignSystem.Button({ id: 'btn-quick-kickoff', text: 'START QUICK MATCH ⚽', variant: 'green', fullWidth: true })}
                        </div>

                    </div>

                    <!-- WIDGET GRID (Stats & Info) -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--fds-space-16); margin-bottom: var(--fds-space-24);">
                        
                        <!-- Current League Progression -->
                        ${DesignSystem.Card({
                            borderColor: division.color,
                            content: `
                                ${DesignSystem.Text(`🏆 CURRENT LEAGUE`, { size: 'var(--fds-font-xs)', weight: '800', color: division.color, margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text(`${division.badge} ${division.name}`, { size: 'var(--fds-font-lg)', weight: '900', color: 'white', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.ProgressBar(levelInfo.progressPercent, division.color)}
                                ${DesignSystem.Text(division.weeklyPromotionZone, { size: 'var(--fds-font-xs)', color: '#94A3B8', margin: 'var(--fds-space-8) 0 0 0' })}
                            `
                        })}

                        <!-- Daily Progress -->
                        ${DesignSystem.Card({
                            borderColor: '#38BDF8',
                            content: `
                                ${DesignSystem.Text('📈 DAILY PROGRESS', { size: 'var(--fds-font-xs)', weight: '800', color: '#38BDF8', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Flex(`
                                    ${DesignSystem.Text(`Level ${levelInfo.level}`, { size: 'var(--fds-font-md)', weight: '900', color: 'white' })}
                                    ${DesignSystem.Text(`${levelInfo.currentXp} / ${levelInfo.nextLevelXp} XP`, { size: 'var(--fds-font-sm)', weight: '800', color: '#38BDF8', family: 'var(--fds-font-mono)' })}
                                `, { justify: 'space-between', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.ProgressBar(levelInfo.progressPercent, '#38BDF8')}
                            `
                        })}

                        <!-- Recent Activity -->
                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('⏱️ RECENT ACTIVITY', { size: 'var(--fds-font-xs)', weight: '800', color: '#F472B6', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Flex(`
                                    <span style="font-size: 24px;">🎯</span>
                                    <div>
                                        ${DesignSystem.Text('Match Completed', { size: 'var(--fds-font-sm)', weight: '800', color: 'white' })}
                                        ${DesignSystem.Text('Score: 8/10 • +240 XP', { size: 'var(--fds-font-xs)', color: '#94A3B8' })}
                                    </div>
                                `, { gap: 'var(--fds-space-12)', align: 'center' })}
                            `
                        })}

                    </div>

                    <!-- INFORMATION CARDS (News & Community) -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--fds-space-16);">
                        
                        <!-- Latest Winners -->
                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('🎖️ LATEST TOURNAMENT WINNERS', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('🥇 Abebe K. (4,820 pts)', { size: 'var(--fds-font-sm)', color: 'white', weight: '700', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('🥈 Yonas M. (4,610 pts)', { size: 'var(--fds-font-sm)', color: '#CBD5E1', weight: '600', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text('🥉 Biruk T. (4,390 pts)', { size: 'var(--fds-font-sm)', color: '#94A3B8', weight: '600' })}
                            `
                        })}

                        <!-- Upcoming Competitions -->
                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('📅 UPCOMING COMPETITIONS', { size: 'var(--fds-font-xs)', weight: '800', color: '#A78BFA', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('⚽ Ethiopian Premier Derby', { size: 'var(--fds-font-sm)', weight: '800', color: 'white' })}
                                ${DesignSystem.Text('Starts Today 20:00 EAT', { size: 'var(--fds-font-xs)', color: '#A78BFA', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('🌍 CAF Champions Quiz', { size: 'var(--fds-font-sm)', weight: '800', color: 'white' })}
                                ${DesignSystem.Text('Starts Saturday 18:00 EAT', { size: 'var(--fds-font-xs)', color: '#A78BFA' })}
                            `
                        })}

                        <!-- Announcements -->
                        ${DesignSystem.Card({
                            borderColor: '#38BDF8',
                            content: `
                                ${DesignSystem.Text('📢 ANNOUNCEMENTS', { size: 'var(--fds-font-xs)', weight: '800', color: '#38BDF8', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('AFCON 2026 Special Quiz Tournament starts this Friday! Subscribe to unlock 2x bonus rewards.', { size: 'var(--fds-font-sm)', color: '#F8FAFC', weight: '600', margin: '0 0 var(--fds-space-12) 0' })}
                                ${DesignSystem.Button({ id: 'btn-view-announcements', text: 'READ MORE', variant: 'glass' })}
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

        document.getElementById('btn-daily-match')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._callbacks.onDailyChallenge();
        });

        document.getElementById('btn-view-announcements')?.addEventListener('click', () => {
            this._audioManager.playClick();
            // Just placeholder for now
        });
    }
}
