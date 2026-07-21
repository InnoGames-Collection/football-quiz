import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';

export class ReturningPlayerModal {
    public static checkAndShow(uiManager: UIManager, saveManager: SaveManager, audioManager: AudioManager): void {
        const lastLoginKey = 'ETHIO_FOOTBALL_LAST_LOGIN';
        const todayStr = new Date().toISOString().split('T')[0];
        const lastLogin = localStorage.getItem(lastLoginKey);

        if (lastLogin === todayStr) {
            // Already logged in today
            return;
        }

        localStorage.setItem(lastLoginKey, todayStr);
        const profile = saveManager.profile;
        const streak = (profile.streakCount || 0) + 1;
        saveManager.updateStreak(streak);

        const xpReward = 100 + streak * 25;
        saveManager.addXp(xpReward);

        const division = ProgressionManager.getDivision(profile.xp);
        const rank = ProgressionManager.getRank(profile.xp);

        // Render Returning Welcome Overlay Modal
        const root = uiManager.container;
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(2, 6, 23, 0.88)';
        modal.style.backdropFilter = 'blur(16px)';
        modal.style.zIndex = '99999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.padding = '20px';
        modal.style.boxSizing = 'border-box';

        modal.innerHTML = `
            <div class="glass-card" style="
                width: 100%;
                max-width: 480px;
                padding: 36px 28px;
                text-align: center;
                border-color: #FFD700;
                box-shadow: 0 20px 60px rgba(0,0,0,0.85);
                color: white;
            ">
                <div style="font-size: 54px; margin-bottom: 8px;">🔥</div>
                <span style="font-size: 11px; font-weight: 900; color: #FFD700; letter-spacing: 3px; text-transform: uppercase;">
                    DAILY RETENTION BONUS
                </span>
                <h2 style="font-size: 30px; font-weight: 900; color: white; margin: 8px 0 16px 0;">
                    WELCOME BACK, CHAMPION!
                </h2>

                <!-- Division & Rank Telemetry Badge -->
                <div style="
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 215, 0, 0.12);
                    border: 1px solid #FFD700;
                    border-radius: 30px;
                    padding: 8px 20px;
                    font-size: 14px;
                    font-weight: 800;
                    color: #FFD700;
                    margin-bottom: 24px;
                ">
                    <span>${division.badge} ${division.name}</span>
                    <span>•</span>
                    <span>${rank.icon} ${rank.name}</span>
                </div>

                <!-- 7-Day Flame Calendar -->
                <div style="margin-bottom: 24px;">
                    <div style="font-size: 12px; color: #94A3B8; font-weight: bold; margin-bottom: 12px;">
                        7-DAY STREAK PROGRESSION
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;">
                        ${[1, 2, 3, 4, 5, 6, 7].map(day => {
                            const isCurrent = day === Math.min(streak, 7);
                            const isPast = day < streak;
                            const bg = isCurrent ? '#FFD700' : isPast ? '#22C55E' : 'rgba(255,255,255,0.1)';
                            const color = isCurrent || isPast ? '#0F172A' : '#94A3B8';
                            return `
                                <div style="
                                    background: ${bg};
                                    color: ${color};
                                    border-radius: 10px;
                                    padding: 10px 4px;
                                    font-size: 11px;
                                    font-weight: 900;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    gap: 4px;
                                ">
                                    <span>DAY ${day}</span>
                                    <span>${isCurrent || isPast ? '🔥' : '🔒'}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- XP Reward Box -->
                <div class="glass-card" style="
                    padding: 16px;
                    margin-bottom: 24px;
                    background: rgba(59, 130, 246, 0.15);
                    border-color: rgba(59, 130, 246, 0.4);
                ">
                    <div style="font-size: 12px; color: #94A3B8; font-weight: bold;">DAILY STREAK BONUS CLAIMED</div>
                    <div style="font-size: 26px; font-weight: 900; color: #60A5FA; font-family: monospace;">⚡ +${xpReward} XP</div>
                </div>

                <button id="welcome-claim-btn" class="broadcast-btn broadcast-btn-gold" style="width: 100%; font-size: 18px; padding: 16px;">
                    CLAIM & ENTER MATCHDAY HUB 🏆
                </button>
            </div>
        `;

        root.appendChild(modal);
        audioManager.playGoalCheer();

        modal.querySelector('#welcome-claim-btn')?.addEventListener('click', () => {
            audioManager.playClick();
            modal.remove();
        });
    }
}
