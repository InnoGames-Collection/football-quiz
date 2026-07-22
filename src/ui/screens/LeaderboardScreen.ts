import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';

export class LeaderboardScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _saveManager: SaveManager;
    private _onClose: () => void;
    private _activeTab: 'daily' | 'weekly' | 'monthly' | 'tournament' = 'weekly';

    constructor(uiManager: UIManager, saveManager: SaveManager, audioManager: AudioManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);

        // Sticky Football Scoreboard Header HTML
        const weeklyRank = '#12';
        const monthlyRank = '#8';
        const movement = '🔼 +2 spots';

        const stickyHeader = `
            <div class="glass-card" style="
                position: sticky; 
                top: 0; 
                z-index: 100; 
                background: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.98) 100%);
                backdrop-filter: blur(12px);
                border-color: var(--tv-gold-primary);
                padding: 16px;
                margin-bottom: 20px;
                border-radius: 0 0 12px 12px;
                border-top: none;
            ">
                <!-- Top Row: League & Position -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">🏆</span>
                        <div>
                            <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">League</div>
                            <div style="font-size: 14px; font-weight: 900; color: ${division.color};">${division.name}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Current Position</div>
                        <div style="font-size: 14px; font-weight: 900; color: var(--tv-gold-primary);">4th Place (${movement})</div>
                    </div>
                </div>

                <!-- Stats Grid: Score, Points, Weekly Rank, Monthly Rank -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; text-align: center; background: rgba(0,0,0,0.35); padding: 10px 6px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                    <div>
                        <div style="font-size: 8px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px;">Score</div>
                        <div style="font-size: 12px; font-weight: 900; color: white; margin-top: 2px;">${profile.eloRating || 1200}</div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 8px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px;">Points</div>
                        <div style="font-size: 12px; font-weight: 900; color: var(--tv-gold-primary); margin-top: 2px;">${profile.xp} XP</div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 8px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px;">Weekly</div>
                        <div style="font-size: 12px; font-weight: 900; color: #38BDF8; margin-top: 2px;">${weeklyRank}</div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 8px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px;">Monthly</div>
                        <div style="font-size: 12px; font-weight: 900; color: #A78BFA; margin-top: 2px;">${monthlyRank}</div>
                    </div>
                </div>
            </div>
        `;

        // Mock ranking data based on selected tab
        const mockEntries: { msisdn: string; score: number; points: number; league: string; isMe?: boolean }[] = [
            { msisdn: '2519****18', score: 1850, points: 5800, league: 'Walia Ibex' },
            { msisdn: '2519****92', score: 1720, points: 5120, league: 'Walia Ibex' },
            { msisdn: '2519****46', score: 1690, points: 4980, league: 'Premier Div' },
            { msisdn: this._maskPhone(profile.phone || '251911223345'), score: profile.eloRating || 1200, points: profile.xp, league: division.name, isMe: true },
            { msisdn: '2519****27', score: 1150, points: 2800, league: 'CAF Cup' },
            { msisdn: '2519****81', score: 1080, points: 2450, league: 'CAF Cup' },
            { msisdn: '2519****53', score: 980, points: 2100, league: 'Novice Div' }
        ];

        // Sort entries by score descending
        mockEntries.sort((a, b) => b.score - a.score);

        // Render Leaderboard Rows
        const rowsHtml = mockEntries.map((entry, idx) => {
            const rank = idx + 1;
            let medal = '';
            if (rank === 1) medal = '🥇';
            else if (rank === 2) medal = '🥈';
            else if (rank === 3) medal = '🥉';

            const bg = entry.isMe ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.02)';
            const border = entry.isMe ? '1px solid var(--tv-pitch-green)' : '1px solid rgba(255,255,255,0.05)';

            return `
                <div style="
                    display: grid; 
                    grid-template-columns: 40px 1.2fr 60px 80px 80px; 
                    align-items: center; 
                    text-align: center;
                    padding: 12px 6px; 
                    background: ${bg}; 
                    border: ${border}; 
                    border-radius: 8px; 
                    margin-bottom: 8px;
                    font-size: 13px;
                ">
                    <div style="font-weight: 900; font-size: 16px; color: ${medal ? 'white' : '#94A3B8'};">
                        ${medal || rank}
                    </div>
                    
                    <div style="text-align: left; font-weight: ${entry.isMe ? '900' : '700'}; color: ${entry.isMe ? 'var(--tv-pitch-green)' : 'white'}; padding-left: 8px;">
                        ${entry.msisdn} ${entry.isMe ? '★' : ''}
                    </div>

                    <div style="font-weight: 800; color: var(--tv-gold-primary); font-family: monospace;">
                        ${entry.score}
                    </div>

                    <div style="color: #38BDF8; font-weight: 800;">
                        ${entry.points} XP
                    </div>

                    <div style="color: #A78BFA; font-weight: 800; font-size: 11px;">
                        ${entry.league}
                    </div>
                </div>
            `;
        }).join('');

        // Tab style helper
        const tabStyle = (tabId: typeof this._activeTab) => {
            const active = this._activeTab === tabId;
            return `
                flex: 1;
                padding: 10px 4px;
                border-radius: 6px;
                border: 1px solid ${active ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.1)'};
                background: ${active ? 'rgba(255,215,0,0.1)' : 'transparent'};
                color: ${active ? 'var(--tv-gold-primary)' : '#94A3B8'};
                font-weight: 800;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            `;
        };

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: space-between; padding: 12px 16px;">
                    <div style="font-weight: 900; font-size: 16px; letter-spacing: 1px;">RANKINGS</div>
                    <button id="lb-close-btn" style="background: none; border: none; color: white; font-weight: bold; cursor: pointer; font-size: 14px;">⬅️ BACK</button>
                </div>

                <div style="max-width: 960px; margin: 0 auto; padding: 0; position: relative;">
                    ${stickyHeader}

                    <div style="padding: 0 16px 120px 16px;">
                        
                        <!-- Tabs segmented control -->
                        <div style="display: flex; gap: 6px; margin-bottom: 16px;">
                            <button class="rank-tab" data-tab="daily" style="${tabStyle('daily')}">Daily</button>
                            <button class="rank-tab" data-tab="weekly" style="${tabStyle('weekly')}">Weekly</button>
                            <button class="rank-tab" data-tab="monthly" style="${tabStyle('monthly')}">Monthly</button>
                            <button class="rank-tab" data-tab="tournament" style="${tabStyle('tournament')}">Cup</button>
                        </div>

                        <!-- Header Row -->
                        <div style="display: grid; grid-template-columns: 40px 1.2fr 60px 80px 80px; text-align: center; padding: 0 6px 8px 6px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">
                            <div>Rank</div>
                            <div style="text-align: left; padding-left: 8px;">Subscriber</div>
                            <div>Score</div>
                            <div>Points</div>
                            <div>League</div>
                        </div>

                        ${rowsHtml}
                        
                    </div>
                </div>
            </div>
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
                const tabId = target.getAttribute('data-tab') as any;
                if (tabId && tabId !== this._activeTab) {
                    this._audioManager.playClick();
                    this._activeTab = tabId;
                    this.render();
                }
            });
        });
    }

    private _maskPhone(phone: string): string {
        let clean = phone.replace(/[^0-9]/g, '');
        if (clean.length < 10) {
            clean = '251911223345';
        }
        if (!clean.startsWith('251')) {
            clean = '251' + clean.replace(/^0+/, '');
        }
        return clean.substring(0, 4) + '****' + clean.substring(clean.length - 2);
    }
}
