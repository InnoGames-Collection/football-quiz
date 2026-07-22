import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { LeaderboardService } from '../../core/leaderboard/LeaderboardService';
import { LoaderHelper } from '../components/LoaderHelper';
import { PullToRefresh } from '../components/PullToRefresh';

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
        root.innerHTML = LoaderHelper.getSkeletonHtml('leaderboard');
        
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);

        // Fetch ranking data dynamically from LeaderboardService
        const apiRange: any = this._activeTab === 'tournament' ? 'all_time' : this._activeTab;
        const rawEntries = await LeaderboardService.getInstance().getLeaderboard(undefined, apiRange);

        const mockEntries = rawEntries.map((entry: any, index: number) => {
            const isMe = entry.username === profile.username || entry.username === 'Me' || index === 3;
            
            const isPhone = entry.username.replace(/[^0-9]/g, '').length >= 9;
            const phoneSeed = isPhone ? entry.username : `2519110000${index + 1}`;
            const maskedMsisdn = this._maskPhone(phoneSeed);
            
            const score = entry.eloRating || (1800 - index * 60);
            const points = entry.score || (score * 5);
            const entryDiv = ProgressionManager.getDivision(points);

            return {
                msisdn: maskedMsisdn,
                score,
                points,
                league: entryDiv.name,
                isMe
            };
        });

        // Sort entries by score descending
        mockEntries.sort((a: any, b: any) => b.score - a.score);

        const firstPlace = mockEntries[0] || { msisdn: '25191****11', score: 2450, points: 12250, league: 'Legend' };
        const secondPlace = mockEntries[1] || { msisdn: '25191****22', score: 2200, points: 11000, league: 'Gold' };
        const thirdPlace = mockEntries[2] || { msisdn: '25191****33', score: 1980, points: 9900, league: 'Gold' };

        const remainingEntries = mockEntries.slice(3);

        // Tab style helper
        const tabStyle = (tabId: typeof this._activeTab) => {
            const active = this._activeTab === tabId;
            return `
                flex: 1;
                padding: 10px 4px;
                border-radius: 8px;
                border: 1px solid ${active ? 'var(--fds-gold-primary)' : 'rgba(255,255,255,0.1)'};
                background: ${active ? 'rgba(255,215,0,0.15)' : 'rgba(15,23,42,0.6)'};
                color: ${active ? 'var(--fds-gold-primary)' : '#94A3B8'};
                font-weight: 800;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `;
        };

        root.innerHTML = `
            <div class="stadium-container stadium-bg-wrapper" style="pointer-events: auto; padding-bottom: 60px; overflow-y: auto;">
                
                <!-- STADIUM LIGHT BEAMS -->
                <div class="stadium-beam stadium-beam-left"></div>
                <div class="stadium-beam stadium-beam-right"></div>

                <!-- TOP BAR -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(2,6,23,0.85); backdrop-filter: blur(12px);">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 24px;">🏆</span>
                        <div>
                            <div style="font-size: 10px; font-weight: 800; color: #009A44; text-transform: uppercase; letter-spacing: 1px;">ETHIO TELECOM VAS</div>
                            <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: white;">LEAGUE RANKINGS</h1>
                        </div>
                    </div>
                    <button id="lb-close-btn" class="m3-btn m3-btn-icon m3-btn-secondary" style="width: 40px; height: 40px;">✕</button>
                </div>

                <div style="max-width: 900px; margin: 0 auto; padding: 16px;">
                    
                    <!-- PERIOD TABS -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;" class="fade-in-up">
                        <button class="lb-tab-btn" data-tab="daily" style="${tabStyle('daily')}">DAILY</button>
                        <button class="lb-tab-btn" data-tab="weekly" style="${tabStyle('weekly')}">WEEKLY</button>
                        <button class="lb-tab-btn" data-tab="monthly" style="${tabStyle('monthly')}">MONTHLY</button>
                        <button class="lb-tab-btn" data-tab="tournament" style="${tabStyle('tournament')}">SEASON PASS</button>
                    </div>

                    <!-- 1. PODIUM CARDS (TOP 3 CHAMPIONS) -->
                    <div style="display: grid; grid-template-columns: 1fr 1.1fr 1fr; gap: 12px; align-items: end; margin-bottom: 24px; text-align: center;" class="fade-in-up">
                        
                        <!-- 2ND PLACE PODIUM (SILVER) -->
                        <div class="glass-card" style="padding: 16px 8px; border-color: #C0C0C0; background: linear-gradient(180deg, rgba(192,192,192,0.15) 0%, rgba(15,23,42,0.9) 100%); border-radius: 16px;">
                            <div style="font-size: 28px; margin-bottom: 4px;">🥈</div>
                            <div style="font-size: 11px; font-weight: 900; color: #E2E8F0; text-transform: uppercase;">2ND PLACE</div>
                            <div style="font-size: 13px; font-weight: 800; color: white; margin-top: 4px;">${secondPlace.msisdn}</div>
                            <div style="font-size: 12px; font-weight: 900; color: #38BDF8; margin-top: 2px;">${secondPlace.score} PTS</div>
                            <div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">${secondPlace.points} XP</div>
                        </div>

                        <!-- 1ST PLACE PODIUM (GOLD CHAMPION) -->
                        <div class="glass-card" style="padding: 20px 8px; border-color: var(--fds-gold-primary); background: linear-gradient(180deg, rgba(255,215,0,0.25) 0%, rgba(15,23,42,0.95) 100%); border-radius: 20px; box-shadow: 0 10px 30px var(--fds-gold-glow); transform: translateY(-8px);">
                            <div style="font-size: 36px; margin-bottom: 4px; filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));">🥇</div>
                            <div style="font-size: 12px; font-weight: 900; color: var(--fds-gold-primary); text-transform: uppercase; letter-spacing: 1px;">CHAMPION</div>
                            <div style="font-size: 14px; font-weight: 900; color: white; margin-top: 4px;">${firstPlace.msisdn}</div>
                            <div style="font-size: 14px; font-weight: 900; color: var(--fds-gold-primary); margin-top: 2px;">${firstPlace.score} PTS</div>
                            <div style="font-size: 10px; color: #FEF08A; margin-top: 2px;">🏆 ${firstPlace.points} XP</div>
                        </div>

                        <!-- 3RD PLACE PODIUM (BRONZE) -->
                        <div class="glass-card" style="padding: 16px 8px; border-color: #CD7F32; background: linear-gradient(180deg, rgba(205,127,50,0.15) 0%, rgba(15,23,42,0.9) 100%); border-radius: 16px;">
                            <div style="font-size: 28px; margin-bottom: 4px;">🥉</div>
                            <div style="font-size: 11px; font-weight: 900; color: #FDBA74; text-transform: uppercase;">3RD PLACE</div>
                            <div style="font-size: 13px; font-weight: 800; color: white; margin-top: 4px;">${thirdPlace.msisdn}</div>
                            <div style="font-size: 12px; font-weight: 900; color: #CD7F32; margin-top: 2px;">${thirdPlace.score} PTS</div>
                            <div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">${thirdPlace.points} XP</div>
                        </div>
                    </div>

                    <!-- 2. CURRENT USER STATS BANNER -->
                    <div class="glass-card fade-in-up" style="padding: 14px 16px; border-color: #22C55E; background: rgba(34,197,94,0.12); margin-bottom: 20px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">⚽</span>
                            <div>
                                <div style="font-size: 10px; color: #4ADE80; font-weight: 800; text-transform: uppercase;">YOUR RANK POSITION</div>
                                <div style="font-size: 15px; font-weight: 900; color: white;">#4 In ${division.name} League</div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 14px; font-weight: 900; color: var(--fds-gold-primary);">${profile.eloRating || 1200} PTS</div>
                            <div style="font-size: 11px; color: #CBD5E1;">${profile.xp} XP</div>
                        </div>
                    </div>

                    <!-- 3. REMAINING RANKINGS LIST (4TH+) -->
                    <div style="display: flex; flex-direction: column; gap: 8px;" class="fade-in-up">
                        ${remainingEntries.map((entry: any, idx: number) => {
                            const rank = idx + 4;
                            const isMe = entry.isMe;
                            return `
                                <div class="glass-card" style="
                                    display: flex; 
                                    justify-content: space-between; 
                                    align-items: center; 
                                    padding: 12px 16px; 
                                    background: ${isMe ? 'rgba(34,197,94,0.15)' : 'rgba(15,23,42,0.7)'}; 
                                    border: 1px solid ${isMe ? '#22C55E' : 'rgba(255,255,255,0.08)'}; 
                                    border-radius: 12px;
                                ">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="font-size: 14px; font-weight: 900; color: #94A3B8; min-width: 24px;">#${rank}</span>
                                        <div>
                                            <div style="font-size: 14px; font-weight: 900; color: ${isMe ? '#4ADE80' : 'white'};">
                                                ${entry.msisdn} ${isMe ? '<span style="background: #22C55E; color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 900; margin-left: 6px;">YOU</span>' : ''}
                                            </div>
                                            <div style="font-size: 11px; color: #94A3B8;">${entry.league} League</div>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: 14px; font-weight: 900; color: var(--fds-gold-primary);">${entry.score} PTS</div>
                                        <div style="font-size: 11px; color: #38BDF8;">${entry.points} XP</div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#lb-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        root.querySelectorAll('.lb-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this._audioManager.playClick();
                const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as any;
                this._activeTab = tab;
                this.render();
            });
        });

        // Pull to refresh
        const container = root.querySelector('.stadium-container') as HTMLElement;
        if (container) {
            PullToRefresh.attach(container, async () => {
                this._audioManager.playClick();
                await this.render();
            });
        }
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
