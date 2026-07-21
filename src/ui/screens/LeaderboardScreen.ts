import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { LeaderboardService } from '../../core/leaderboard/LeaderboardService';
import { SaveManager } from '../../core/managers/SaveManager';

export class LeaderboardScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _saveManager: SaveManager;
    private _onClose: () => void;
    private _activeTab: string = 'global'; // global or local

    constructor(uiManager: UIManager, audioManager: AudioManager, saveManager: SaveManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._saveManager = saveManager;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        
        // Fetch fake data for demo
        const entries = await LeaderboardService.getInstance().getLeaderboard(undefined, 'all_time');

        // Sticky Header HTML
        const stickyHeader = `
            <div class="glass-card" style="
                position: sticky; 
                top: 0; 
                z-index: 100; 
                background: linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(15,23,42,0.95) 100%);
                backdrop-filter: blur(12px);
                border-color: var(--tv-pitch-green);
                padding: 16px;
                margin-bottom: 24px;
                border-radius: 0 0 12px 12px;
                border-top: none;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 16px; align-items: center;">
                        <div style="font-size: 32px; font-weight: 900; color: var(--tv-pitch-green); text-shadow: 0 0 10px rgba(34,197,94,0.5);">#4</div>
                        <div>
                            <div style="font-size: 11px; font-weight: 800; color: #94A3B8; margin-bottom: 2px;">YOUR RANK</div>
                            <div style="font-size: 18px; font-weight: 900; color: white;">${profile.username}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 16px; font-weight: 900; color: var(--tv-gold-primary); margin-bottom: 2px;">${profile.eloRating || 1200} PTS</div>
                        <div style="font-size: 12px; font-weight: 800; color: #22C55E;">🔼 +2 spots</div>
                    </div>
                </div>
            </div>
        `;

        // Render Leaderboard Rows
        const rowsHtml = entries.map((entry, idx) => {
            const rank = idx + 1;
            let medal = '';
            if (rank === 1) medal = '🥇';
            else if (rank === 2) medal = '🥈';
            else if (rank === 3) medal = '🥉';

            const isMe = entry.username === profile.username;
            const bg = isMe ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)';
            const border = isMe ? '1px solid var(--tv-pitch-green)' : '1px solid rgba(255,255,255,0.05)';

            // Mock movement logic for UI demo
            const movementOptions = ['🔼', '🔽', '➖'];
            const movement = rank === 1 ? '➖' : movementOptions[Math.floor(Math.random() * 3)];
            const movementColor = movement === '🔼' ? '#22C55E' : (movement === '🔽' ? '#EF4444' : '#94A3B8');

            return `
                <div style="
                    display: flex; 
                    align-items: center; 
                    padding: 12px 16px; 
                    background: ${bg}; 
                    border: ${border}; 
                    border-radius: 8px; 
                    margin-bottom: 8px;
                ">
                    <div style="width: 40px; text-align: center; font-size: 18px; font-weight: 900; color: ${medal ? 'white' : '#94A3B8'};">
                        ${medal || rank}
                    </div>
                    
                    <div style="flex: 1; display: flex; align-items: center; padding-left: 12px;">
                        ${isMe ? '<div style="width: 8px; height: 8px; border-radius: 50%; background: var(--tv-pitch-green); margin-right: 8px;"></div>' : ''}
                        <div style="font-size: 16px; font-weight: ${isMe ? '900' : '700'}; color: white;">${entry.username}</div>
                    </div>

                    <div style="width: 100px; text-align: right;">
                        <div style="font-size: 16px; font-weight: 900; color: var(--tv-gold-primary); font-family: var(--fds-font-mono);">${entry.eloRating}</div>
                    </div>

                    <div style="width: 40px; text-align: right; font-size: 14px; color: ${movementColor};">
                        ${movement}
                    </div>
                </div>
            `;
        }).join('');

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: space-between; padding: 12px 16px;">
                    <div style="font-weight: 900; font-size: 18px; letter-spacing: 1px;">RANKINGS</div>
                    <button id="lb-close-btn" style="background: none; border: none; color: white; font-weight: bold; cursor: pointer;">⬅️ BACK</button>
                </div>

                <div style="max-width: 960px; margin: 0 auto; padding: 0; position: relative;">
                    ${stickyHeader}

                    <div style="padding: 0 16px;">
                        
                        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                            <button class="rank-tab ${this._activeTab === 'global' ? 'active-rank' : ''}" data-tab="global" style="
                                flex: 1; padding: 8px; border-radius: 6px; border: 1px solid ${this._activeTab === 'global' ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.1)'};
                                background: ${this._activeTab === 'global' ? 'rgba(255,215,0,0.1)' : 'transparent'};
                                color: ${this._activeTab === 'global' ? 'var(--tv-gold-primary)' : '#94A3B8'};
                                font-weight: 800; cursor: pointer; transition: all 0.2s;
                            ">🌍 GLOBAL</button>
                            <button class="rank-tab ${this._activeTab === 'friends' ? 'active-rank' : ''}" data-tab="friends" style="
                                flex: 1; padding: 8px; border-radius: 6px; border: 1px solid ${this._activeTab === 'friends' ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.1)'};
                                background: ${this._activeTab === 'friends' ? 'rgba(255,215,0,0.1)' : 'transparent'};
                                color: ${this._activeTab === 'friends' ? 'var(--tv-gold-primary)' : '#94A3B8'};
                                font-weight: 800; cursor: pointer; transition: all 0.2s;
                            ">👥 FRIENDS</button>
                        </div>

                        <!-- Header Row -->
                        <div style="display: flex; padding: 0 16px 8px 16px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <div style="width: 40px; text-align: center; font-size: 10px; font-weight: 800; color: #94A3B8;">#</div>
                            <div style="flex: 1; padding-left: 12px; font-size: 10px; font-weight: 800; color: #94A3B8;">PLAYER</div>
                            <div style="width: 100px; text-align: right; font-size: 10px; font-weight: 800; color: #94A3B8;">POINTS</div>
                            <div style="width: 40px; text-align: right; font-size: 10px; font-weight: 800; color: #94A3B8;">MVT</div>
                        </div>

                        ${rowsHtml}
                        
                    </div>
                </div>
            </div>
            <style>
                .rank-tab:active { transform: scale(0.98); }
            </style>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        document.getElementById('lb-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        document.querySelectorAll('.rank-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const tabId = target.getAttribute('data-tab');
                if (tabId && tabId !== this._activeTab) {
                    this._audioManager.playClick();
                    this._activeTab = tabId;
                    this.render();
                }
            });
        });
    }
}
