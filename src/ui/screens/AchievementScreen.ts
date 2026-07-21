import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { SaveManager } from '../../core/managers/SaveManager';

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
        { id: 'ten-matches', name: 'Regular Player', description: 'Complete 10 quiz matches', icon: '⚽', category: 'quiz', unlocked: false, rewardCoins: 200, rewardXp: 100 },
        { id: 'perfect-match', name: 'Perfect Game', description: 'Score 100% accuracy in a match', icon: '💯', category: 'quiz', unlocked: false, rewardCoins: 300, rewardXp: 150 },
        { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', category: 'streak', unlocked: false, rewardCoins: 200, rewardXp: 100 },
        { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '⚡', category: 'streak', unlocked: false, rewardCoins: 1000, rewardXp: 500 },
        { id: 'first-win', name: 'First Victory', description: 'Win your first live 1v1 match', icon: '🏆', category: 'multiplayer', unlocked: false, rewardCoins: 100, rewardXp: 50 },
        { id: 'gold-rank', name: 'Gold Standard', description: 'Reach Gold rank tier', icon: '🥇', category: 'progression', unlocked: false, rewardCoins: 300, rewardXp: 150 }
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

        // Check local profile unlocks
        const unlockedSet = new Set(this._saveManager.profile.unlockedItems || []);
        this._achievements.forEach(a => {
            if (unlockedSet.has(a.id)) {
                a.unlocked = true;
            }
        });
    }

    public render(): void {
        const root = this._uiManager.container;
        const unlockedCount = this._achievements.filter(a => a.unlocked).length;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 800px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div>
                            <span style="font-size: 11px; font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">
                                TROPHY CABINET & BADGES
                            </span>
                            <h1 style="margin: 4px 0 0 0; font-size: 32px; font-weight: 900; color: white;">
                                🎖️ ACHIEVEMENTS (${unlockedCount}/${this._achievements.length})
                            </h1>
                        </div>
                        <button id="ach-close-btn" class="broadcast-btn glass-card" style="color: white; padding: 10px 20px;">
                            ✖ CLOSE
                        </button>
                    </div>

                    <!-- Achievements Grid -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
                        ${this._achievements.map(a => `
                            <div class="glass-card" style="
                                padding: 20px;
                                border-color: ${a.unlocked ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 255, 255, 0.08)'};
                                opacity: ${a.unlocked ? '1' : '0.65'};
                                background: ${a.unlocked ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.6)'};
                            ">
                                <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 10px;">
                                    <div style="
                                        font-size: 32px;
                                        filter: ${a.unlocked ? 'none' : 'grayscale(100%)'};
                                    ">${a.icon}</div>
                                    <div>
                                        <div style="font-weight: 800; font-size: 15px; color: ${a.unlocked ? '#FFD700' : 'white'};">
                                            ${a.name}
                                        </div>
                                        <div style="font-size: 11px; color: ${a.unlocked ? '#86EFAC' : '#94A3B8'}; font-weight: bold;">
                                            ${a.unlocked ? '✅ UNLOCKED' : '🔒 LOCKED'}
                                        </div>
                                    </div>
                                </div>

                                <p style="margin: 0 0 12px 0; font-size: 12px; color: #CBD5E1; line-height: 1.4;">
                                    ${a.description}
                                </p>

                                <div style="
                                    display: flex;
                                    gap: 10px;
                                    font-size: 12px;
                                    font-weight: bold;
                                    color: #FFD700;
                                    border-top: 1px solid rgba(255,255,255,0.08);
                                    padding-top: 8px;
                                ">
                                    <span>🪙 +${a.rewardCoins}</span>
                                    <span style="color: #60A5FA;">⚡ +${a.rewardXp} XP</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;
        root.querySelector('#ach-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });
    }
}
