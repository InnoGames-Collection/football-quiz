import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';

export class ProfileScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;

    constructor(
        uiManager: UIManager,
        saveManager: SaveManager
    ) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
    }

    public render(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);
        
        // Setup mock MSISDN for demo
        const msisdn = profile.phone || '+251 911 *** ***';

        const listTile = (icon: string, title: string, hasArrow: boolean = true) => `
            <div class="list-tile" style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 16px; 
                border-bottom: 1px solid rgba(255,255,255,0.05); 
                cursor: pointer;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 20px;">${icon}</span>
                    <span style="font-size: 15px; font-weight: 700; color: white;">${title}</span>
                </div>
                ${hasArrow ? `<span style="color: #94A3B8;">›</span>` : ''}
            </div>
        `;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding-bottom: 100px;">
                
                <!-- TOP HEADER -->
                <div style="
                    background: linear-gradient(180deg, var(--tv-pitch-green) 0%, rgba(15,23,42,0) 100%);
                    padding: 32px 16px 16px 16px;
                    text-align: center;
                ">
                    <div style="
                        width: 80px; height: 80px; 
                        border-radius: 50%; 
                        background: var(--tv-gold-gradient); 
                        display: flex; align-items: center; justify-content: center; 
                        font-size: 40px; 
                        margin: 0 auto 16px auto;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                        border: 3px solid white;
                    ">👤</div>
                    <div style="font-size: 22px; font-weight: 900; color: white; margin-bottom: 4px;">${profile.username}</div>
                    <div style="font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 16px;">${msisdn}</div>
                    
                    <button style="
                        background: rgba(0,0,0,0.3);
                        border: 1px solid rgba(255,255,255,0.2);
                        color: white;
                        border-radius: 20px;
                        padding: 6px 16px;
                        font-size: 12px;
                        font-weight: 800;
                        cursor: pointer;
                    ">EDIT PROFILE</button>
                </div>

                <!-- TELEMETRY BANNER -->
                <div style="
                    display: flex;
                    justify-content: space-around;
                    background: rgba(0,0,0,0.4);
                    border-top: 1px solid rgba(255,255,255,0.1);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding: 16px 0;
                    margin-bottom: 24px;
                ">
                    <div style="text-align: center;">
                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">LEAGUE</div>
                        <div style="font-size: 14px; font-weight: 900; color: ${division.color};">${division.name}</div>
                    </div>
                    <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                    <div style="text-align: center;">
                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">RANK</div>
                        <div style="font-size: 14px; font-weight: 900; color: white;">#4</div>
                    </div>
                    <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
                    <div style="text-align: center;">
                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">POINTS</div>
                        <div style="font-size: 14px; font-weight: 900; color: var(--tv-gold-primary);">${profile.eloRating || 1200}</div>
                    </div>
                </div>

                <!-- GROUPED MENUS -->
                <div style="max-width: 600px; margin: 0 auto; padding: 0 16px;">
                    
                    <!-- Group 1 -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 24px; padding: 0; overflow: hidden;">
                        ${listTile('📊', 'Statistics')}
                        ${listTile('🏆', 'Achievements')}
                        ${listTile('🏅', 'My Awards')}
                        <div style="border-bottom: none;">${listTile('📈', 'Leaderboard')}</div>
                    </div>

                    <!-- Group 2 -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 24px; padding: 0; overflow: hidden;">
                        ${listTile('👥', 'Invite Friends')}
                        ${listTile('⭐', 'Subscription')}
                        <div style="border-bottom: none;">${listTile('💬', 'Messages')}</div>
                    </div>

                    <!-- Group 3 -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 24px; padding: 0; overflow: hidden;">
                        ${listTile('⚙️', 'Settings')}
                        ${listTile('❓', 'Help & Support')}
                        <div style="border-bottom: none;">${listTile('ℹ️', 'About')}</div>
                    </div>

                </div>
            </div>
            <style>
                .list-tile:active { background: rgba(255,255,255,0.05); }
                .list-tile:hover { background: rgba(255,255,255,0.02); }
            </style>
        `;
    }
}
