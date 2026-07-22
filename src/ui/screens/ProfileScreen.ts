import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { LoaderHelper } from '../components/LoaderHelper';
import { ProfileService } from '../../networking/services/ProfileService';
import { PullToRefresh } from '../components/PullToRefresh';


export interface ProfileCallbacks {
    onStatistics: () => void;
    onLeaderboard: () => void;
    onSubscription: () => void;
    onMessages: () => void;
    onSettings: () => void;
    onHelp: () => void;
    onAbout: () => void;
}

export class ProfileScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _callbacks: ProfileCallbacks;

    constructor(
        uiManager: UIManager,
        saveManager: SaveManager,
        audioManager: AudioManager,
        callbacks: ProfileCallbacks
    ) {
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
        this._callbacks = callbacks;
    }

    public render(): void {
        const root = this._uiManager.container;
        root.innerHTML = LoaderHelper.getSkeletonHtml('profile');
        
        setTimeout(() => {
            this._renderActual();
        }, 300);
    }

    private _renderActual(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);
        const msisdn = this._maskPhone(profile.phone || '251911223345');

        const listTile = (icon: string, title: string, action: string, hasArrow: boolean = true) => `
            <div class="list-tile profile-menu-tile" data-action="${action}" style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 16px; 
                border-bottom: 1px solid rgba(255,255,255,0.05); 
                cursor: pointer;
                transition: background-color 0.2s;
            ">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <span style="font-size: 20px;">${icon}</span>
                    <span style="font-size: 15px; font-weight: 700; color: white;">${title}</span>
                </div>
                ${hasArrow ? `<span style="color: #94A3B8;">❯</span>` : ''}
            </div>
        `;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding-bottom: 120px;">
                
                <!-- TOP HEADER -->
                <div style="
                    background: linear-gradient(180deg, rgba(34,197,94,0.2) 0%, rgba(15,23,42,0) 100%);
                    padding: 32px 16px 16px 16px;
                    text-align: center;
                ">
                    <div style="
                        width: 80px; height: 80px; 
                        border-radius: 50%; 
                        background: var(--tv-gold-primary); 
                        display: flex; align-items: center; justify-content: center; 
                        font-size: 40px; 
                        margin: 0 auto 16px auto;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                        border: 3px solid white;
                    ">👤</div>
                    <div style="font-size: 22px; font-weight: 900; color: white; margin-bottom: 4px;">${profile.username}</div>
                    <div style="font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 16px; font-family: var(--tv-mono);">${msisdn}</div>
                </div>

                <!-- TELEMETRY BANNER -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    background: rgba(0,0,0,0.35);
                    border-top: 1px solid rgba(255,255,255,0.1);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding: 16px 0;
                    margin-bottom: 24px;
                    text-align: center;
                ">
                    <div>
                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">LEAGUE</div>
                        <div style="font-size: 14px; font-weight: 900; color: ${division.color};">${division.name}</div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">RANK</div>
                        <div style="font-size: 14px; font-weight: 900; color: white;">#4</div>
                    </div>
                    <div>
                        <div style="font-size: 10px; font-weight: 800; color: #94A3B8; margin-bottom: 4px;">POINTS</div>
                        <div style="font-size: 14px; font-weight: 900; color: var(--tv-gold-primary);">${profile.xp} XP</div>
                    </div>
                </div>

                <!-- GROUPED MENUS -->
                <div style="max-width: 600px; margin: 0 auto; padding: 0 16px;">
                    
                    <!-- Group 1: Stats & Achievements -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 20px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${listTile('📊', 'Statistics', 'stats')}
                        ${listTile('🏆', 'Achievements', 'achievements')}
                        ${listTile('🏅', 'My Awards', 'awards')}
                        <div style="border-bottom: none;">${listTile('📈', 'Leaderboard', 'leaderboard')}</div>
                    </div>

                    <!-- Group 2: Invite & Subs -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 20px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${listTile('👥', 'Invite Friends', 'invite')}
                        ${listTile('⭐', 'Subscription', 'subscription')}
                        <div style="border-bottom: none;">${listTile('💬', 'Messages', 'messages')}</div>
                    </div>

                    <!-- Group 3: Utility -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 20px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${listTile('⚙️', 'Settings', 'settings')}
                        ${listTile('❓', 'Help & Support', 'help')}
                        <div style="border-bottom: none;">${listTile('ℹ️', 'About', 'about')}</div>
                    </div>

                </div>
            </div>

            <!-- Profile Interactive Modals Container -->
            <div id="profile-action-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; pointer-events: auto;">
                <div class="glass-card" style="width: 100%; max-width: 400px; padding: 24px; border-color: var(--tv-gold-primary); text-align: center; background: rgba(15,23,42,0.95); position: relative;">
                    <button id="btn-close-prof-modal" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: #94A3B8; font-size: 16px; cursor: pointer;">✖</button>
                    <div id="prof-modal-content" style="max-height: 70vh; overflow-y: auto;" class="hide-scrollbar"></div>
                </div>
            </div>

            <style>
                .list-tile:active { background: rgba(255,255,255,0.08); }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            </style>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;
        const modal = document.getElementById('profile-action-modal');
        const modalContent = document.getElementById('prof-modal-content');
        const closeModal = document.getElementById('btn-close-prof-modal');

        const showModal = (html: string) => {
            if (modal && modalContent) {
                modalContent.innerHTML = html;
                modal.style.display = 'flex';
            }
        };

        closeModal?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (modal) modal.style.display = 'none';
        });

        const tiles = root.querySelectorAll('.profile-menu-tile');
        tiles.forEach(tile => {
            tile.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const action = target.getAttribute('data-action');
                if (!action) return;

                this._audioManager.playClick();

                switch (action) {
                    case 'stats':
                        this._callbacks.onStatistics();
                        break;
                    case 'leaderboard':
                        this._callbacks.onLeaderboard();
                        break;
                    case 'subscription':
                        this._callbacks.onSubscription();
                        break;
                    case 'messages':
                        this._callbacks.onMessages();
                        break;
                    case 'settings':
                        this._callbacks.onSettings();
                        break;
                    case 'help':
                        this._callbacks.onHelp();
                        break;
                    case 'about':
                        this._callbacks.onAbout();
                        break;
                    
                    case 'invite':
                        showModal(`
                            <div style="font-size: 40px; margin-bottom: 12px;">👥</div>
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 8px; text-transform: uppercase;">Invite Friends</div>
                            <div style="font-size: 13px; color: #CBD5E1; margin-bottom: 16px;">Share EthioFantasy with your friends and win 100 free coins on their first game!</div>
                            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.15); font-size: 12px; color: var(--tv-gold-primary); font-family: monospace; margin-bottom: 16px; word-break: break-all;">https://ethiofantasy.com/join?ref=251911223345</div>
                            <button id="btn-copy-invite-p" style="width: 100%; padding: 12px; background: var(--tv-pitch-green); color: white; border: none; border-radius: 8px; font-weight: 800; cursor: pointer;">COPY LINK</button>
                        `);
                        document.getElementById('btn-copy-invite-p')?.addEventListener('click', () => {
                            this._audioManager.playClick();
                            navigator.clipboard.writeText('https://ethiofantasy.com/join?ref=251911223345');
                            const btn = document.getElementById('btn-copy-invite-p');
                            if (btn) btn.innerText = 'COPIED ✅';
                        });
                        break;

                    case 'achievements':
                        showModal(`
                            <div style="font-size: 32px; margin-bottom: 12px;">🏆</div>
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 16px; text-transform: uppercase;">Achievements</div>
                            <div id="achievements-content" style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                                <div style="color: #94A3B8; text-align: center;">Loading achievements...</div>
                            </div>
                        `);
                        
                        // Fetch achievements
                        ProfileService.getInstance().getEarnedAchievements().then(achievements => {
                            const content = document.getElementById('achievements-content');
                            if (!content) return;
                            
                            if (!achievements || achievements.length === 0) {
                                content.innerHTML = `
                                    <div style="text-align: center; color: #94A3B8; padding: 20px;">
                                        <div style="font-size: 24px; margin-bottom: 8px;">🎯</div>
                                        <div>No achievements yet</div>
                                        <div style="font-size: 12px; margin-top: 4px;">Play more matches to earn achievements!</div>
                                    </div>
                                `;
                                return;
                            }

                            content.innerHTML = achievements.map(achRow => {
                                const ach = achRow.achievement || {};
                                return `
                                    <div style="display: flex; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                                        <span style="font-size: 24px;">${ach.icon || '🎯'}</span>
                                        <div>
                                            <div style="font-size: 13px; font-weight: 800; color: white;">${ach.name_en || ach.name || 'Achievement'} ✅</div>
                                            <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">${ach.description_en || ach.description || ''}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('');
                        }).catch(_ => {
                            const content = document.getElementById('achievements-content');
                            if (content) content.innerHTML = '<div style="color: #EF4444; text-align: center;">Failed to load achievements.</div>';
                        });
                        break;

                    case 'awards':
                        showModal(`
                            <div style="font-size: 32px; margin-bottom: 12px;">🏅</div>
                            <div style="font-size: 18px; font-weight: 900; color: white; margin-bottom: 16px; text-transform: uppercase;">Trophy Cabinet</div>
                            <div id="awards-content" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                <div style="grid-column: span 2; color: #94A3B8; text-align: center;">Loading awards...</div>
                            </div>
                        `);

                        ProfileService.getInstance().getRewards().then(rewards => {
                            const content = document.getElementById('awards-content');
                            if (!content) return;
                            
                            if (!rewards || rewards.length === 0) {
                                content.innerHTML = `
                                    <div style="grid-column: span 2; text-align: center; color: #94A3B8; padding: 20px;">
                                        <div style="font-size: 24px; margin-bottom: 8px;">🏅</div>
                                        <div>No awards yet</div>
                                        <div style="font-size: 12px; margin-top: 4px;">Compete in tournaments to earn awards!</div>
                                    </div>
                                `;
                                return;
                            }

                            content.innerHTML = rewards.map(reward => `
                                <div style="background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.2); padding: 16px 8px; border-radius: 8px;">
                                    <span style="font-size: 32px;">🏆</span>
                                    <div style="font-size: 12px; font-weight: 800; color: white; margin-top: 8px;">${reward.name || 'Award'}</div>
                                    <div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">${reward.source_type}</div>
                                </div>
                            `).join('');
                        }).catch(_ => {
                            const content = document.getElementById('awards-content');
                            if (content) content.innerHTML = '<div style="grid-column: span 2; color: #EF4444; text-align: center;">Failed to load awards.</div>';
                        });
                        break;
                }
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
