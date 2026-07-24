import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { DesignSystem } from '../theme/DesignSystem';
import { i18n } from '../../localization/i18n';
import { EthioFantasyAppBar } from '../components/EthioFantasyAppBar';
import { Achievement, AchievementCategory } from '../../core/models/Achievement';
import { AchievementsService } from '../../networking/services/AchievementsService';

export class AchievementsScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _onBack: () => void;
    private _achievements: Achievement[] = [];
    private _activeTab: AchievementCategory | 'all' = 'all';

    constructor(
        uiManager: UIManager,
        saveManager: SaveManager,
        audioManager: AudioManager,
        onBack: () => void
    ) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._onBack = onBack;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        
        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; display: flex; flex-direction: column; height: 100vh;">
                <!-- Background Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <!-- App Bar -->
                <div id="achievements-app-bar-container" style="position: relative; z-index: 20;"></div>

                <!-- Main Scrollable Content -->
                <div style="flex: 1; overflow-y: auto; padding-bottom: 80px;" class="hide-scrollbar">
                    <div id="achievements-content" style="max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; min-height: 100%;">
                        <!-- Loading State -->
                        <div style="margin: auto; padding: 40px;">
                            ${DesignSystem.LoadingState(i18n.currentLocale === 'am' ? 'ስኬቶችን በመጫን ላይ...' : 'Loading achievements...')}
                        </div>
                    </div>
                </div>
            </div>
            <style>
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .ach-tab {
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 800;
                    color: rgba(255,255,255,0.6);
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                .ach-tab.active {
                    background: var(--tv-gold-primary);
                    color: black;
                    border-color: #FBBF24;
                    box-shadow: 0 4px 12px rgba(234, 179, 8, 0.4);
                }
                
                .ach-card {
                    background: rgba(15, 23, 42, 0.85);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px;
                    padding: 16px;
                    margin-bottom: 12px;
                    display: flex;
                    gap: 16px;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .ach-card.unlocked {
                    border-color: rgba(34, 197, 94, 0.4);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1);
                }
                .ach-card.locked {
                    opacity: 0.6;
                    filter: grayscale(80%);
                }
                .ach-card.unlocked::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 4px;
                    height: 100%;
                    background: var(--tv-pitch-green, #22C55E);
                    box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
                }
                
                .ach-icon-box {
                    width: 56px; height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    flex-shrink: 0;
                    background: rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .ach-card.unlocked .ach-icon-box {
                    background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(34, 197, 94, 0.2));
                    border-color: rgba(234, 179, 8, 0.5);
                    box-shadow: 0 0 16px rgba(234, 179, 8, 0.3);
                }
                
                .ach-progress-bg {
                    height: 6px;
                    background: rgba(0,0,0,0.5);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-top: 8px;
                }
                .ach-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #FBBF24, #F59E0B);
                    border-radius: 3px;
                    transition: width 0.5s ease-out;
                }
                .ach-card.unlocked .ach-progress-fill {
                    background: linear-gradient(90deg, #4ADE80, #22C55E);
                }
                
                .ach-reward-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    background: rgba(255,255,255,0.1);
                    padding: 4px 8px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 800;
                    color: white;
                    margin-top: 8px;
                }
                .ach-card.unlocked .ach-reward-badge {
                    background: rgba(34, 197, 94, 0.2);
                    color: #4ADE80;
                }
                
                /* Ethio Telecom Rewards specific */
                .ethio-reward-tag {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    font-size: 10px;
                    font-weight: 900;
                    padding: 2px 6px;
                    border-radius: 4px;
                    background: linear-gradient(90deg, #8B5CF6, #6D28D9);
                    color: white;
                    text-transform: uppercase;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }
            </style>
        `;

        const appBarContainer = document.getElementById('achievements-app-bar-container');
        if (appBarContainer) {
            const title = i18n.currentLocale === 'am' ? 'ስኬቶች' : (i18n.currentLocale === 'om' ? 'Milkaa\'ina' : 'Achievements');
            appBarContainer.innerHTML = EthioFantasyAppBar.render(title);
            EthioFantasyAppBar.bind(appBarContainer, () => {
                this._audioManager.playClick();
                this._onBack();
            });
        }

        // Fetch Data
        try {
            this._achievements = await AchievementsService.getInstance().getAchievements();
            this._renderContent();
        } catch (e) {
            console.error('Failed to load achievements', e);
            const content = document.getElementById('achievements-content');
            if (content) {
                content.innerHTML = DesignSystem.EmptyState('⚠️', 'Error', 'Failed to load achievements. Please try again.');
            }
        }
    }

    private _renderContent(): void {
        const content = document.getElementById('achievements-content');
        if (!content) return;

        const profile = this._saveManager.profile;
        const totalUnlocked = this._achievements.filter(a => a.isUnlocked).length;
        const total = this._achievements.length;
        const percent = total > 0 ? Math.round((totalUnlocked / total) * 100) : 0;
        
        let html = '';

        // 1. Summary Header
        html += `
            <div style="padding: 24px 16px 16px 16px;">
                <div class="glass-card" style="padding: 20px; border-radius: 20px; text-align: center; background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95)); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                    <div style="font-size: 14px; font-weight: 800; color: var(--fds-text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">OVERALL COMPLETION</div>
                    <div style="font-size: 48px; font-weight: 900; color: white; line-height: 1; margin-bottom: 16px; font-family: var(--fds-font-mono); text-shadow: 0 4px 12px rgba(0,0,0,0.5);">${percent}%</div>
                    
                    <div class="ach-progress-bg" style="height: 8px; margin-bottom: 20px; background: rgba(255,255,255,0.1);">
                        <div class="ach-progress-fill" style="width: ${percent}%; background: linear-gradient(90deg, #FBBF24, #22C55E);"></div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                        <div>
                            <div style="font-size: 12px; color: var(--fds-text-dim); font-weight: 700;">UNLOCKED</div>
                            <div style="font-size: 18px; font-weight: 900; color: white;">${totalUnlocked} <span style="color: rgba(255,255,255,0.3); font-size: 14px;">/ ${total}</span></div>
                        </div>
                        <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                        <div>
                            <div style="font-size: 12px; color: var(--fds-text-dim); font-weight: 700;">TOTAL XP</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--tv-gold-primary);">${profile.xp}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 2. Tabs
        const tabs = [
            { id: 'all', label: 'All' },
            { id: 'progress', label: 'Progress' },
            { id: 'daily_streak', label: 'Streak' },
            { id: 'quiz', label: 'Quiz' },
            { id: 'rewards', label: 'Rewards' },
            { id: 'seasonal', label: 'Seasonal' },
            { id: 'community', label: 'Community' }
        ];

        html += `
            <div style="padding: 0 16px 16px 16px; position: sticky; top: 0; z-index: 10; background: linear-gradient(180deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.8) 80%, rgba(2,6,23,0) 100%); backdrop-filter: blur(8px); margin: 0 -16px; padding-left: 16px;">
                <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px;" class="hide-scrollbar">
                    ${tabs.map(t => `
                        <button class="ach-tab ${this._activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
                            ${t.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // 3. List
        const filtered = this._activeTab === 'all' 
            ? this._achievements 
            : this._achievements.filter(a => a.categoryId === this._activeTab);

        html += `
            <div style="padding: 0 16px;">
                ${filtered.length > 0 
                    ? filtered.map(a => this._buildAchievementCard(a)).join('')
                    : DesignSystem.EmptyState('📭', 'No Achievements', 'No achievements found in this category.')
                }
            </div>
        `;

        content.innerHTML = html;
        this._bindTabs();
    }

    private _buildAchievementCard(ach: Achievement): string {
        const title = i18n.currentLocale === 'am' ? ach.titleAm : (i18n.currentLocale === 'om' ? ach.titleOm : ach.titleEn);
        const desc = i18n.currentLocale === 'am' ? ach.descriptionAm : (i18n.currentLocale === 'om' ? ach.descriptionOm : ach.descriptionEn);
        const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));
        const statusClass = ach.isUnlocked ? 'unlocked' : 'locked';

        let rewardTag = '';
        if (ach.categoryId === 'rewards' && ach.rewardEligibility) {
            rewardTag = `<div class="ethio-reward-tag">${ach.rewardEligibility.rewardType}</div>`;
        }

        return `
            <div class="ach-card ${statusClass}">
                ${rewardTag}
                <div class="ach-icon-box">${ach.icon}</div>
                <div style="flex: 1;">
                    <div style="font-size: 16px; font-weight: 800; color: white; margin-bottom: 4px; padding-right: 40px;">${title}</div>
                    <div style="font-size: 13px; color: var(--fds-text-dim); line-height: 1.4; margin-bottom: 12px;">${desc}</div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; color: white; margin-bottom: 4px;">
                        <span>${ach.progress} / ${ach.maxProgress}</span>
                        <span>${percent}%</span>
                    </div>
                    <div class="ach-progress-bg">
                        <div class="ach-progress-fill" style="width: ${percent}%;"></div>
                    </div>
                    
                    <div class="ach-reward-badge">
                        <span>⭐</span> ${ach.xpReward} XP
                    </div>
                </div>
            </div>
        `;
    }

    private _bindTabs(): void {
        const tabs = document.querySelectorAll('.ach-tab');
        tabs.forEach(t => {
            t.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const tabId = target.getAttribute('data-tab') as AchievementCategory | 'all';
                if (tabId && tabId !== this._activeTab) {
                    this._audioManager.playClick();
                    this._activeTab = tabId;
                    this._renderContent();
                }
            });
        });
    }
}
