import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { i18n } from '../../localization/i18n';
import { SaveManager } from '../../core/managers/SaveManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { LeaderboardService } from '../../core/leaderboard/LeaderboardService';
import { PullToRefresh } from '../components/PullToRefresh';
import { DesignSystem } from '../theme/DesignSystem';

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
        root.innerHTML = DesignSystem.LoadingState(i18n.currentLocale === 'am' ? 'ደረጃዎችን በማስገባት ላይ...' : (i18n.currentLocale === 'om' ? "Sadarkaa fe'aa jira..." : 'Loading rankings...'));
        
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);

        // Fetch ranking data dynamically from LeaderboardService
        const apiRange: any = this._activeTab === 'tournament' ? 'all_time' : this._activeTab;
        const rawEntries = await LeaderboardService.getInstance().getLeaderboard(undefined, apiRange);

        const processedEntries = rawEntries.map((entry: any) => {
            const isMe = entry.username === profile.username;
            
            const isPhone = /^\\+?[0-9]{9,}$/.test((entry.username || '').replace(/[^0-9+]/g, ''));
            const displayName = isPhone ? this._maskPhone(entry.username) : (entry.username || (i18n.currentLocale === 'am' ? 'ያልታወቀ' : (i18n.currentLocale === 'om' ? 'Namummaa Hin Beekamne' : 'Anonymous')));
            
            const score = entry.eloRating || 0;
            const points = entry.score || 0;
            const entryDiv = ProgressionManager.getDivision(points);

            return {
                msisdn: displayName,
                score,
                points,
                league: entryDiv.name,
                isMe
            };
        });

        // Sort entries by score descending
        processedEntries.sort((a: any, b: any) => b.score - a.score);

        const firstPlace = processedEntries[0];
        const secondPlace = processedEntries[1];
        const thirdPlace = processedEntries[2];

        const remainingEntries = processedEntries.slice(3);

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
                font-size: var(--fds-font-xs);
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
                <div style="display: flex; justify-content: center; align-items: center; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(2,6,23,0.85); backdrop-filter: blur(12px); position: relative;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 24px;">🏆</span>
                        <div style="text-align: left;">
                            <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-ethio-green); text-transform: uppercase; letter-spacing: 1px;">ETHIOFANTASY</div>
                            <h1 style="margin: 0; font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main);">${i18n.currentLocale === 'am' ? 'ደረጃ' : (i18n.currentLocale === 'om' ? 'SADARKAA' : 'RANK')}</h1>
                        </div>
                    </div>
                    <button id="lb-close-btn" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--fds-text-main); font-weight: bold; cursor: pointer; font-size: 24px;">✕</button>
                </div>

                <div style="max-width: 900px; margin: 0 auto; padding: 16px;">
                    
                    <!-- PERIOD TABS -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;" class="fade-in-up">
                        <button class="lb-tab-btn" data-tab="daily" style="${tabStyle('daily')}">${i18n.currentLocale === 'am' ? 'ዕለታዊ' : (i18n.currentLocale === 'om' ? 'GUYYAA' : 'DAILY')}</button>
                        <button class="lb-tab-btn" data-tab="weekly" style="${tabStyle('weekly')}">${i18n.currentLocale === 'am' ? 'ሳምንታዊ' : (i18n.currentLocale === 'om' ? 'TORBEE' : 'WEEKLY')}</button>
                        <button class="lb-tab-btn" data-tab="monthly" style="${tabStyle('monthly')}">${i18n.currentLocale === 'am' ? 'ወርሃዊ' : (i18n.currentLocale === 'om' ? "JI'A" : 'MONTHLY')}</button>
                        <button class="lb-tab-btn" data-tab="tournament" style="${tabStyle('tournament')}">${i18n.currentLocale === 'am' ? 'የውድድር ዘመን' : (i18n.currentLocale === 'om' ? 'SEESON PAAS' : 'SEASON PASS')}</button>
                    </div>

                    <!-- 1. PODIUM CARDS (TOP 3 CHAMPIONS) -->
                    ${processedEntries.length === 0 ? DesignSystem.EmptyState('🏆', i18n.currentLocale === 'am' ? 'እስካሁን የተሰለፈ ተጫዋች የለም።' : (i18n.currentLocale === 'om' ? 'Hamma ammaatti taphataan sadarkaa qabate hin jiru.' : 'No players ranked yet.')) : `
                    <div style="display: grid; grid-template-columns: 1fr 1.1fr 1fr; gap: 12px; align-items: end; margin-bottom: 24px; text-align: center;" class="fade-in-up">
                        
                        <!-- 2ND PLACE PODIUM (SILVER) -->
                        ${secondPlace ? `
                        <div class="glass-card" style="padding: 16px 8px; border-color: #C0C0C0; background: linear-gradient(180deg, rgba(192,192,192,0.15) 0%, rgba(15,23,42,0.9) 100%); border-radius: 16px;">
                            <div style="font-size: var(--fds-font-xl); margin-bottom: 4px;">🥈</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #E2E8F0; text-transform: uppercase;">${i18n.currentLocale === 'am' ? '2ኛ' : (i18n.currentLocale === 'om' ? '2FFAA' : '2ND')}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main); margin-top: 4px;">${secondPlace.msisdn}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--fds-blue-accent); margin-top: 2px;">${secondPlace.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 2px;">${secondPlace.points} XP</div>
                        </div>
                        ` : `<div style="visibility: hidden;"></div>`}

                        <!-- 1ST PLACE PODIUM (GOLD CHAMPION) -->
                        ${firstPlace ? `
                        <div class="glass-card" style="padding: 20px 8px; border-color: var(--fds-gold-primary); background: linear-gradient(180deg, rgba(255,215,0,0.25) 0%, rgba(15,23,42,0.95) 100%); border-radius: 20px; box-shadow: 0 10px 30px var(--fds-gold-glow); transform: translateY(-8px);">
                            <div style="font-size: 36px; margin-bottom: 4px; filter: drop-shadow(0 0 10px rgba(255,215,0,0.6));">🥇</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--fds-gold-primary); text-transform: uppercase; letter-spacing: 1px;">${i18n.currentLocale === 'am' ? 'ሻምፒዮን' : (i18n.currentLocale === 'om' ? 'CHAAMPIYOONA' : 'CHAMPION')}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main); margin-top: 4px;">${firstPlace.msisdn}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary); margin-top: 2px;">${firstPlace.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: #FEF08A; margin-top: 2px;">🏆 ${firstPlace.points} XP</div>
                        </div>
                        ` : `<div style="visibility: hidden;"></div>`}

                        <!-- 3RD PLACE PODIUM (BRONZE) -->
                        ${thirdPlace ? `
                        <div class="glass-card" style="padding: 16px 8px; border-color: #CD7F32; background: linear-gradient(180deg, rgba(205,127,50,0.15) 0%, rgba(15,23,42,0.9) 100%); border-radius: 16px;">
                            <div style="font-size: var(--fds-font-xl); margin-bottom: 4px;">🥉</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #FDBA74; text-transform: uppercase;">${i18n.currentLocale === 'am' ? '3ኛ' : (i18n.currentLocale === 'om' ? '3FFAA' : '3RD')}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main); margin-top: 4px;">${thirdPlace.msisdn}</div>
                            <div style="font-size: var(--fds-font-xs); font-weight: 900; color: #CD7F32; margin-top: 2px;">${thirdPlace.score} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 2px;">${thirdPlace.points} XP</div>
                        </div>
                        ` : `<div style="visibility: hidden;"></div>`}
                    </div>
                    `}

                    <!-- 2. CURRENT USER STATS BANNER -->
                    <div class="glass-card fade-in-up" style="padding: 14px 16px; border-color: var(--fds-green-pitch); background: rgba(34,197,94,0.12); margin-bottom: 20px; border-radius: 14px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">⚽</span>
                            <div>
                                <div style="font-size: var(--fds-font-xs); color: #4ADE80; font-weight: 800; text-transform: uppercase;">${i18n.currentLocale === 'am' ? 'የእርስዎ የደረጃ ቦታ' : (i18n.currentLocale === 'om' ? 'SADARKAA KEE' : 'YOUR RANK POSITION')}</div>
                                <div style="font-size: var(--fds-font-md); font-weight: 900; color: var(--fds-text-main);">${i18n.currentLocale === 'am' ? `#4 በ ${division.name} ሊግ` : (i18n.currentLocale === 'om' ? `#4 Liigii ${division.name} Keessatti` : `#4 In ${division.name} League`)}</div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary);">${profile.eloRating || 0} PTS</div>
                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-muted);">${profile.xp} XP</div>
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
                                        <span style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-dim); min-width: 24px;">#${rank}</span>
                                        <div>
                                            <div style="font-size: var(--fds-font-sm); font-weight: 900; color: ${isMe ? '#4ADE80' : 'white'};">
                                                ${entry.msisdn} ${isMe ? `<span style="background: #22C55E; color: black; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 900; margin-left: 6px;">${i18n.currentLocale === 'am' ? 'እርስዎ' : (i18n.currentLocale === 'om' ? 'ATI' : 'YOU')}</span>` : ''}
                                            </div>
                                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">${i18n.currentLocale === 'am' ? `${entry.league} ሊግ` : (i18n.currentLocale === 'om' ? `Liigii ${entry.league}` : `${entry.league} League`)}</div>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-gold-primary);">${entry.score} PTS</div>
                                        <div style="font-size: var(--fds-font-xs); color: var(--fds-blue-accent);">${entry.points} XP</div>
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
        if (phone.startsWith('+')) {
            clean = phone.substring(1);
        } else {
            clean = phone;
        }
        if (clean.startsWith('251')) {
            clean = '251' + clean.replace(/^0+/, '');
        }
        return clean.substring(0, 4) + '****' + clean.substring(clean.length - 2);
    }
}
