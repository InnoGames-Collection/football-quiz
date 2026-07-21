import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { DesignSystem } from '../theme/DesignSystem';

export interface AchievementItem {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'quiz' | 'streak' | 'multiplayer' | 'progression';
    unlocked: boolean;
    rewardCoins: number;
    rewardXp: number;
}

export class AchievementScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _saveManager: SaveManager;
    private _onClose: () => void;

    private _achievements: AchievementItem[] = [
        { id: 'first-match', name: 'First Whistle', description: 'Complete your first quiz match', icon: '🎯', category: 'quiz', unlocked: true, rewardCoins: 50, rewardXp: 25 },
        { id: 'ten-matches', name: 'Regular Player', description: 'Complete 10 quiz matches', icon: '⚽', category: 'quiz', unlocked: true, rewardCoins: 200, rewardXp: 100 },
        { id: 'perfect-match', name: 'Perfect Game', description: 'Score 100% accuracy in a match', icon: '💯', category: 'quiz', unlocked: true, rewardCoins: 300, rewardXp: 150 },
        { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', category: 'streak', unlocked: true, rewardCoins: 200, rewardXp: 100 },
        { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '⚡', category: 'streak', unlocked: false, rewardCoins: 1000, rewardXp: 500 },
        { id: 'first-win', name: 'First Victory', description: 'Win your first live 1v1 match', icon: '🏆', category: 'multiplayer', unlocked: true, rewardCoins: 100, rewardXp: 50 },
        { id: 'gold-rank', name: 'Gold Standard', description: 'Reach Gold rank tier', icon: '🥇', category: 'progression', unlocked: true, rewardCoins: 300, rewardXp: 150 }
    ];

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        saveManager: SaveManager,
        onClose: () => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._saveManager = saveManager;
        this._onClose = onClose;

        const unlockedSet = new Set(this._saveManager.profile.unlockedItems || []);
        this._achievements.forEach(a => {
            if (unlockedSet.has(a.id)) {
                a.unlocked = true;
            }
        });
    }

    public render(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const rank = ProgressionManager.getRank(profile.xp);
        const division = ProgressionManager.getDivision(profile.xp);
        const levelInfo = ProgressionManager.getLevel(profile.xp);
        const unlockedCount = this._achievements.filter(a => a.unlocked).length;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                ${DesignSystem.Header({
                    title: 'PLAYER PROFILE',
                    badgeText: 'PLAYER PROFILE',
                    rightText: ''
                })}

                <div style="position: absolute; top: 12px; right: 24px; z-index: 30;">
                    <button id="prof-close-btn" class="glass-card" style="padding: 6px 14px; color: white; font-weight: bold; cursor: pointer;">
                        ⬅️ BACK TO HUB
                    </button>
                </div>

                <div style="max-width: 880px; margin: var(--fds-space-20) auto; position: relative; z-index: 10; padding: 0 var(--fds-space-20);">
                    
                    ${DesignSystem.Card({
                        borderColor: 'var(--fds-gold-primary)',
                        className: 'margin-bottom-20',
                        content: DesignSystem.Flex(`
                            ${DesignSystem.Flex(`
                                <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--fds-gold-gradient); display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: 0 0 20px var(--fds-gold-glow);">👤</div>
                                <div>
                                    ${DesignSystem.Text(profile.username, { size: 'var(--fds-font-xl)', weight: '900', color: 'white', margin: '0 0 2px 0' })}
                                    ${DesignSystem.Text(`${division.badge} ${division.name} • <span class="rank-badge ${rank.badgeClass}">${rank.icon} ${rank.name}</span>`, { size: 'var(--fds-font-sm)', weight: '800', color: division.color })}
                                </div>
                            `, { gap: 'var(--fds-space-16)' })}
                            <div style="text-align: right; min-width: 180px;">
                                ${DesignSystem.Text(`LEVEL ${levelInfo.level} (⚡ ${profile.xp} XP)`, { size: 'var(--fds-font-sm)', weight: '900', color: 'var(--fds-gold-primary)', family: 'var(--fds-font-mono)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.ProgressBar(levelInfo.progressPercent, 'var(--fds-gold-primary)')}
                            </div>
                        `, { justify: 'space-between', wrap: true, gap: 'var(--fds-space-16)' })
                    })}

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--fds-space-16); margin-bottom: var(--fds-space-20);">
                        ${DesignSystem.Card({
                            borderColor: '#60A5FA',
                            content: `
                                ${DesignSystem.Text('⚽ MATCH HISTORY SUMMARY', { size: 'var(--fds-font-xs)', weight: '800', color: '#60A5FA', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('Total Matches: <strong style="color:var(--fds-gold-primary);">14 Matches</strong><br/>Wins / Draws / Losses: <strong style="color:#22C55E;">10W</strong> • <strong>4D</strong> • <strong>0L</strong>', { size: 'var(--fds-font-sm)', color: 'white', weight: '600' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: 'var(--tv-pitch-green)',
                            content: `
                                ${DesignSystem.Text('🎯 ACCURACY & FAVORITE CATEGORY', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--tv-pitch-green)', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('Overall Accuracy: <strong style="color:#22C55E;">85.4%</strong><br/>Favorite Category: 🐐 Walia Ibex National Team', { size: 'var(--fds-font-sm)', color: 'white', weight: '600' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('📊 PLAYER PERFORMANCE METRICS', { size: 'var(--fds-font-xs)', weight: '800', color: '#F59E0B', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('Goals Scored: <strong style="color:var(--fds-gold-primary);">48 Goals</strong><br/>Avg Response Time: <strong>3.4 seconds</strong><br/>Max Combo Streak: <strong style="color:#EF4444;">9x Combo 🔥</strong>', { size: 'var(--fds-font-sm)', color: 'white', weight: '600' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            borderColor: '#EF4444',
                            content: `
                                ${DesignSystem.Text('🔥 7-DAY FLAME STREAK', { size: 'var(--fds-font-xs)', weight: '800', color: '#EF4444', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text(`${profile.streakCount || 7} DAYS ACTIVE`, { size: 'var(--fds-font-lg)', weight: '900', color: 'white', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Flex(`
                                    ${[1, 2, 3, 4, 5, 6, 7].map(d => `
                                        <div style="background: #EF4444; color: white; border-radius: 4px; padding: 4px; font-size: 10px; font-weight: bold; flex: 1; text-align: center;">D${d} 🔥</div>
                                    `).join('')}
                                `, { gap: '4px' })}
                            `
                        })}
                    </div>

                    ${DesignSystem.Card({
                        borderColor: 'rgba(255, 215, 0, 0.3)',
                        className: 'margin-bottom-20',
                        content: `
                            ${DesignSystem.Text(`🎖️ BADGES CABINET (${unlockedCount} / ${this._achievements.length} UNLOCKED)`, { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-12) 0' })}
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--fds-space-12);">
                                ${this._achievements.map(a => `
                                    <div style="
                                        background: ${a.unlocked ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.6)'};
                                        border: 1px solid ${a.unlocked ? 'var(--fds-gold-primary)' : 'rgba(255,255,255,0.08)'};
                                        border-radius: var(--radius-md);
                                        padding: var(--fds-space-12);
                                    ">
                                        <div style="display: flex; align-items: center; gap: var(--fds-space-12);">
                                            <span style="font-size: 24px;">${a.icon}</span>
                                            <div>
                                                <div style="font-weight: 800; font-size: var(--fds-font-sm); color: ${a.unlocked ? 'var(--fds-gold-primary)' : 'white'};">${a.name}</div>
                                                <div style="font-size: 10px; color: ${a.unlocked ? '#86EFAC' : '#94A3B8'}; font-weight: bold;">
                                                    ${a.unlocked ? '✅ UNLOCKED' : '🔒 LOCKED'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `
                    })}

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--fds-space-16);">
                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('⚙️ APP SETTINGS', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Flex(`
                                    <span style="font-size: var(--fds-font-sm); color: white;">Audio Channels</span>
                                    <button id="prof-mute-btn" class="glass-card" style="padding: 4px 10px; color: white; cursor: pointer;">
                                        ${this._audioManager.isMuted ? '🔇 MUTED' : '🔊 ACTIVE'}
                                    </button>
                                `, { justify: 'space-between', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Flex(`
                                    <span style="font-size: var(--fds-font-sm); color: white;">Language</span>
                                    <span style="font-size: var(--fds-font-xs); color: var(--fds-gold-primary); font-weight: bold;">🇬🇧 EN / 🇪🇹 AM / OM</span>
                                `, { justify: 'space-between' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('❓ HELP & RULES', { size: 'var(--fds-font-xs)', weight: '800', color: '#60A5FA', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('Answer questions within 15 seconds. Score goals for correct answers and earn XP to advance in weekly divisions.', { size: 'var(--fds-font-xs)', color: '#CBD5E1' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('📞 ETHIO TELECOM SUPPORT & ABOUT', { size: 'var(--fds-font-xs)', weight: '800', color: '#22C55E', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Text('Version: <strong>v1.0.0 Enterprise</strong><br/>VAS Helpline: <strong>Shortcode 838</strong><br/>Powered by Ethio Telecom Sports VAS', { size: 'var(--fds-font-xs)', color: 'white', weight: '600' })}
                            `
                        })}

                        ${DesignSystem.Card({
                            content: `
                                ${DesignSystem.Text('⭐ PLAYER FEEDBACK', { size: 'var(--fds-font-xs)', weight: '800', color: '#C084FC', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.Button({ id: 'btn-submit-feedback', text: 'SUBMIT FEEDBACK ⭐', variant: 'glass', fullWidth: true })}
                            `
                        })}
                    </div>
                </div>
            </div>
            <style>
                .margin-bottom-20 { margin-bottom: var(--fds-space-20); }
            </style>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#prof-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        root.querySelector('#prof-mute-btn')?.addEventListener('click', () => {
            this._audioManager.toggleMute();
            this.render();
        });

        root.querySelector('#btn-submit-feedback')?.addEventListener('click', () => {
            this._audioManager.playClick();
            alert('⭐ Thank you for rating Ethio Telecom Football Quiz League! Your feedback helps us improve.');
        });
    }
}
