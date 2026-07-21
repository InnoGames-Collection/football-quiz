import { UIManager } from '../../core/managers/UIManager';

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

export class ProfileScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;

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
        saveManager: SaveManager
    ) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;

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
        
        // Calculate Win Rate safely
        const totalMatches = profile.totalMatches || 0;
        const totalWins = profile.totalWins || 0;
        const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;
        
        const streakCount = profile.streakCount || 0;
        const unlockedCount = this._achievements.filter(a => a.unlocked).length;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">

                <div class="tv-broadcast-header" style="border-bottom: 2px solid var(--fds-gold-primary);">
                    ${DesignSystem.Flex(`
                        <span style="font-size: 18px; font-weight: 900; letter-spacing: 1px; color: white;">PLAYER PROFILE</span>
                        <div class="glass-card" style="padding: 6px 14px; font-weight: 900; color: #60A5FA; font-size: 13px;">
                            ⚡ ${profile.xp} XP
                        </div>
                    `, { justify: 'space-between', align: 'center' })}
                </div>

                <div style="max-width: 960px; margin: 0 auto; position: relative; z-index: 10; padding: var(--fds-space-16) var(--fds-space-16) 100px var(--fds-space-16);">
                    
                    <!-- HERO: Player Identity & Rank -->
                    ${DesignSystem.Card({
                        borderColor: division.color,
                        className: 'margin-bottom-20',
                        content: DesignSystem.Flex(`
                            ${DesignSystem.Flex(`
                                <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--fds-gold-gradient); display: flex; align-items: center; justify-content: center; font-size: 36px; box-shadow: 0 0 20px var(--fds-gold-glow);">👤</div>
                                <div>
                                    ${DesignSystem.Text(profile.username, { size: 'var(--fds-font-xl)', weight: '900', color: 'white', margin: '0 0 4px 0' })}
                                    ${DesignSystem.Text(`${division.badge} ${division.name}`, { size: 'var(--fds-font-md)', weight: '800', color: division.color, margin: '0 0 6px 0' })}
                                    <div class="rank-badge ${rank.badgeClass}" style="display: inline-block;">${rank.icon} ${rank.name}</div>
                                </div>
                            `, { gap: 'var(--fds-space-16)', align: 'center' })}
                            
                            <div style="text-align: right; min-width: 200px;">
                                ${DesignSystem.Text(`LEVEL ${levelInfo.level}`, { size: 'var(--fds-font-lg)', weight: '900', color: 'var(--fds-gold-primary)', family: 'var(--fds-font-mono)', margin: '0 0 var(--fds-space-4) 0' })}
                                ${DesignSystem.Text(`${levelInfo.currentXp} / ${levelInfo.nextLevelXp} XP to Next Level`, { size: 'var(--fds-font-xs)', color: '#94A3B8', margin: '0 0 var(--fds-space-8) 0' })}
                                ${DesignSystem.ProgressBar(levelInfo.progressPercent, 'var(--fds-gold-primary)')}
                            </div>
                        `, { justify: 'space-between', align: 'center', wrap: true, gap: 'var(--fds-space-16)' })
                    })}

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--fds-space-16); margin-bottom: var(--fds-space-20);">
                        
                        <!-- STATISTICS WIDGET -->
                        ${DesignSystem.Card({
                            borderColor: '#38BDF8',
                            content: `
                                ${DesignSystem.Text('📊 CAREER STATISTICS', { size: 'var(--fds-font-xs)', weight: '800', color: '#38BDF8', margin: '0 0 var(--fds-space-16) 0' })}
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--fds-space-16);">
                                    <div class="glass-card" style="padding: 12px; text-align: center; border-color: rgba(56, 189, 248, 0.3);">
                                        <div style="font-size: 24px; font-weight: 900; color: white;">${totalMatches}</div>
                                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">Matches Played</div>
                                    </div>
                                    <div class="glass-card" style="padding: 12px; text-align: center; border-color: rgba(34, 197, 94, 0.3);">
                                        <div style="font-size: 24px; font-weight: 900; color: #22C55E;">${winRate}%</div>
                                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">Win Rate</div>
                                    </div>
                                    <div class="glass-card" style="padding: 12px; text-align: center; border-color: rgba(245, 158, 11, 0.3);">
                                        <div style="font-size: 24px; font-weight: 900; color: #F59E0B;">${totalWins}</div>
                                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">Victories</div>
                                    </div>
                                    <div class="glass-card" style="padding: 12px; text-align: center; border-color: rgba(192, 132, 252, 0.3);">
                                        <div style="font-size: 24px; font-weight: 900; color: #C084FC;">${profile.eloRating || 1200}</div>
                                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">ELO Rating</div>
                                    </div>
                                </div>
                            `
                        })}

                        <!-- DAILY ENGAGEMENT WIDGET -->
                        ${DesignSystem.Card({
                            borderColor: '#EC4899',
                            content: `
                                ${DesignSystem.Text('🔥 DAILY ENGAGEMENT', { size: 'var(--fds-font-xs)', weight: '800', color: '#EC4899', margin: '0 0 var(--fds-space-16) 0' })}
                                
                                <div style="margin-bottom: var(--fds-space-16);">
                                    ${DesignSystem.Flex(`
                                        ${DesignSystem.Text('Daily Login Streak', { size: 'var(--fds-font-sm)', weight: '700', color: 'white' })}
                                        ${DesignSystem.Text(`${streakCount} Days`, { size: 'var(--fds-font-sm)', weight: '900', color: '#EC4899' })}
                                    `, { justify: 'space-between', margin: '0 0 6px 0' })}
                                    ${DesignSystem.ProgressBar(Math.min((streakCount / 7) * 100, 100), '#EC4899')}
                                    ${DesignSystem.Text('Next Reward: 7 Day Streak (+500 XP)', { size: '10px', color: '#94A3B8', margin: '4px 0 0 0' })}
                                </div>

                                <div>
                                    ${DesignSystem.Flex(`
                                        ${DesignSystem.Text('Weekly Missions', { size: 'var(--fds-font-sm)', weight: '700', color: 'white' })}
                                        ${DesignSystem.Text('3/5 Completed', { size: 'var(--fds-font-sm)', weight: '900', color: '#22C55E' })}
                                    `, { justify: 'space-between', margin: '0 0 6px 0' })}
                                    ${DesignSystem.ProgressBar(60, '#22C55E')}
                                </div>
                            `
                        })}
                    </div>

                    <!-- ACHIEVEMENTS CABINET -->
                    ${DesignSystem.Card({
                        borderColor: 'var(--fds-gold-primary)',
                        content: `
                            ${DesignSystem.Flex(`
                                ${DesignSystem.Text('🎖️ ACHIEVEMENTS CABINET', { size: 'var(--fds-font-xs)', weight: '800', color: 'var(--fds-gold-primary)' })}
                                ${DesignSystem.Text(`${unlockedCount} / ${this._achievements.length} Unlocked`, { size: 'var(--fds-font-xs)', weight: '800', color: '#94A3B8' })}
                            `, { justify: 'space-between', margin: '0 0 var(--fds-space-16) 0' })}
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--fds-space-12);">
                                ${this._achievements.map(a => this._renderAchievementBadge(a)).join('')}
                            </div>
                        `
                    })}

                </div>
            </div>
            <style>
                .margin-bottom-20 { margin-bottom: var(--fds-space-20); }
                .grayscale-filter { filter: grayscale(1) opacity(0.4); }
            </style>
        `;

        this._bindEvents();
    }

    private _renderAchievementBadge(achievement: AchievementItem): string {
        const isUnlocked = achievement.unlocked;
        return `
            <div class="glass-card ${isUnlocked ? '' : 'grayscale-filter'}" style="
                padding: var(--fds-space-12);
                text-align: center;
                border-color: ${isUnlocked ? 'var(--fds-gold-primary)' : 'rgba(255,255,255,0.1)'};
                background: ${isUnlocked ? 'rgba(255, 215, 0, 0.05)' : 'transparent'};
                transition: transform 0.2s;
            ">
                <div style="font-size: 32px; margin-bottom: 8px;">${achievement.icon}</div>
                <div style="font-weight: 900; font-size: 11px; color: ${isUnlocked ? 'white' : '#94A3B8'}; margin-bottom: 4px; text-transform: uppercase;">
                    ${achievement.name}
                </div>
                <div style="font-size: 9px; color: #64748B; line-height: 1.2;">
                    ${achievement.description}
                </div>
            </div>
        `;
    }

    private _bindEvents(): void {
        // Events if necessary
    }
}
