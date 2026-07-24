import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { ProgressionManager } from '../../core/managers/ProgressionManager';
import { DesignSystem } from '../theme/DesignSystem';
import { AwardsScreen } from './AwardsScreen';
import { ProfileService } from '../../networking/services/ProfileService';
import { PullToRefresh } from '../components/PullToRefresh';
import { i18n } from '../../localization/i18n';
import { MessageCenterService } from '../../networking/services/MessageCenterService';


export interface ProfileCallbacks {
    onStatistics: () => void;
    onLeaderboard: () => void;
    onSubscription: () => void;
    onMessages: () => void;
    onSettings: () => void;
    onHelp: () => void;
    onAbout: () => void;
    onPrivacy: () => void;
    onTerms: () => void;
}

export class ProfileScreen {
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;
    private _callbacks: ProfileCallbacks;
    private _unsubscribeBadge: (() => void) | null = null;

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

        this._unsubscribeBadge = MessageCenterService.getInstance().subscribeToBadgeUpdates(() => {
            const badgeEl = document.getElementById('profile-msg-badge');
            if (badgeEl) {
                const count = MessageCenterService.getInstance().getTotalUnreadCount();
                if (count > 0) {
                    badgeEl.innerText = count > 99 ? '99+' : count.toString();
                    badgeEl.style.display = 'inline-block';
                } else {
                    badgeEl.style.display = 'none';
                }
            }
        });
    }

    public destroy(): void {
        if (this._unsubscribeBadge) this._unsubscribeBadge();
    }

    public render(): void {
        const root = this._uiManager.container;
        root.innerHTML = DesignSystem.LoadingState(`${i18n.currentLocale === 'am' ? 'መገለጫ በመጫን ላይ...' : (i18n.currentLocale === 'om' ? "Pirofaayilii fe'aa jira..." : 'Loading profile...')}`);
        
        setTimeout(() => {
            this._renderActual();
        }, 300);
    }

    private _renderActual(): void {
        const root = this._uiManager.container;
        const profile = this._saveManager.profile;
        const division = ProgressionManager.getDivision(profile.xp);
        const msisdn = profile.phone ? this._maskPhone(profile.phone) : `${i18n.currentLocale === 'am' ? 'እንግዳ ተጫዋች' : (i18n.currentLocale === 'om' ? 'Tapaataa Keessummaa' : 'Guest Player')}`;

        const listTile = (icon: string, title: string, action: string, hasArrow: boolean = true, badgeId: string = '') => `
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
                    <span style="font-size: var(--fds-font-lg);">${icon}</span>
                    <span style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-main);">${title}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${badgeId ? `
                        <span id="${badgeId}" style="
                            display: none;
                            background: var(--tv-pitch-green, #22C55E);
                            color: white; font-size: 10px; font-weight: 900;
                            border-radius: 10px; padding: 2px 6px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.5);
                        "></span>
                    ` : ''}
                    ${hasArrow ? `<span style="color: var(--fds-text-dim);">❯</span>` : ''}
                </div>
            </div>
        `;

        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding-bottom: 120px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
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
                    <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin-bottom: 4px;">${profile.username}</div>
                    <div style="font-size: var(--fds-font-sm); font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 16px; font-family: var(--tv-mono);">${msisdn}</div>
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
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${i18n.currentLocale === 'am' ? 'ሊግ' : (i18n.currentLocale === 'om' ? 'LIIGII' : 'LEAGUE')}</div>
                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: ${division.color};">${division.name}</div>
                    </div>
                    <div style="border-left: 1px solid rgba(255,255,255,0.08); border-right: 1px solid rgba(255,255,255,0.08);">
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${i18n.currentLocale === 'am' ? 'ደረጃ' : (i18n.currentLocale === 'om' ? 'SADARKAA' : 'RANK')}</div>
                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--fds-text-main);">#4</div>
                    </div>
                    <div>
                        <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 4px;">${i18n.currentLocale === 'am' ? 'ነጥቦች' : (i18n.currentLocale === 'om' ? 'QABXII' : 'POINTS')}</div>
                        <div style="font-size: var(--fds-font-sm); font-weight: 900; color: var(--tv-gold-primary);">${profile.xp} XP</div>
                    </div>
                </div>

                <!-- GROUPED MENUS -->
                <div style="max-width: 600px; margin: 0 auto; padding: 0 16px;">
                    
                    <!-- Group 1: Stats & Achievements -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 20px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${listTile('📊', i18n.currentLocale === 'am' ? 'ስታቲስቲክስ' : (i18n.currentLocale === 'om' ? 'Istaatistiiksii' : 'Statistics'), 'stats')}
                        ${listTile('🏆', i18n.currentLocale === 'am' ? 'ስኬቶች' : (i18n.currentLocale === 'om' ? 'Milkaa\'ina' : 'Achievements'), 'achievements')}
                        ${listTile('🏅', i18n.currentLocale === 'am' ? 'የእኔ ሽልማቶች' : (i18n.currentLocale === 'om' ? 'Badhaasa Koo' : 'My Awards'), 'awards')}
                        <div style="border-bottom: none;">${listTile('📈', i18n.currentLocale === 'am' ? 'የመሪዎች ሰሌዳ' : (i18n.currentLocale === 'om' ? 'Gabatee Geggeessitootaa' : 'Leaderboard'), 'leaderboard')}</div>
                    </div>

                    <!-- Group 2: Invite & Subs -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 20px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${listTile('👥', i18n.currentLocale === 'am' ? 'ጓደኞችን ይጋብዙ' : (i18n.currentLocale === 'om' ? 'Hiriyoota Affeeri' : 'Invite Friends'), 'invite')}
                        ${listTile('⭐', i18n.currentLocale === 'am' ? 'ምዝገባ' : (i18n.currentLocale === 'om' ? 'Galmee' : 'Subscription'), 'subscription')}
                        <div style="border-bottom: none;">${listTile('💬', i18n.currentLocale === 'am' ? 'መልዕክቶች' : (i18n.currentLocale === 'om' ? 'Ergaawwan' : 'Messages'), 'messages', true, 'profile-msg-badge')}</div>
                    </div>

                    <!-- Group 3: Utility -->
                    <div class="glass-card" style="border-radius: 12px; margin-bottom: 20px; padding: 0; overflow: hidden; border-color: rgba(255,255,255,0.08);">
                        ${listTile('⚙️', i18n.currentLocale === 'am' ? 'ቅንብሮች' : (i18n.currentLocale === 'om' ? 'Qindaa\'inoota' : 'Settings'), 'settings')}
                        ${listTile('❓', i18n.currentLocale === 'am' ? 'እገዛ እና ድጋፍ' : (i18n.currentLocale === 'om' ? 'Gargaarsa & Deeggarsa' : 'Help & Support'), 'help')}
                        <div style="border-bottom: none;">${listTile('ℹ️', i18n.currentLocale === 'am' ? 'ስለ እኛ' : (i18n.currentLocale === 'om' ? 'Waa\'ee' : 'About'), 'about')}</div>
                    </div>

                </div>
            </div>

            <!-- Profile Interactive Modals Container -->
            <div id="profile-action-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 10000; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box; pointer-events: auto;">
                <div class="glass-card" style="width: 100%; max-width: 400px; padding: 24px; border-color: var(--tv-gold-primary); text-align: center; background: rgba(15,23,42,0.95); position: relative;">
                    <button id="btn-close-prof-modal" style="position: absolute; top: 12px; right: 12px; background: none; border: none; color: var(--fds-text-dim); font-size: var(--fds-font-md); cursor: pointer;">✖</button>
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

        // Initial badge sync
        const count = MessageCenterService.getInstance().getTotalUnreadCount();
        const badgeEl = document.getElementById('profile-msg-badge');
        if (badgeEl) {
            if (count > 0) {
                badgeEl.innerText = count > 99 ? '99+' : count.toString();
                badgeEl.style.display = 'inline-block';
            } else {
                badgeEl.style.display = 'none';
            }
        }
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
                    case 'privacy':
                        this._callbacks.onPrivacy();
                        break;
                    case 'terms':
                        this._callbacks.onTerms();
                        break;
                    
                    case 'invite':
                        showModal(`
                            <div style="font-size: 40px; margin-bottom: 12px;">👥</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px; text-transform: uppercase;">${i18n.currentLocale === 'am' ? 'ጓደኞችን ይጋብዙ' : (i18n.currentLocale === 'om' ? 'Hiriyoota Affeeri' : 'Invite Friends')}</div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-muted); margin-bottom: 16px;">${i18n.currentLocale === 'am' ? 'ጓደኞች ሲጫወቱ ሳንቲሞችን ያግኙ።' : (i18n.currentLocale === 'om' ? 'Yoo hiriyoonni taphatan saantima argadhu.' : 'Earn coins when friends play.')}</div>
                            <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.15); font-size: var(--fds-font-xs); color: var(--tv-gold-primary); font-family: monospace; margin-bottom: 16px; word-break: break-all;">https://ethiofantasy.com/join?ref=${this._saveManager.profile.phone || 'guest'}</div>
                            ${DesignSystem.Button({ id: 'btn-copy-ref', text: i18n.currentLocale === 'am' ? 'ሊንክ ቅዳ' : (i18n.currentLocale === 'om' ? 'LIINKII WARAABBI' : 'COPY LINK'), variant: 'primary', fullWidth: true })}
                        `);

                        document.getElementById('btn-copy-ref')?.addEventListener('click', () => {
                            this._audioManager.playClick();
                            navigator.clipboard.writeText(`https://ethiofantasy.com/join?ref=${this._saveManager.profile.phone || 'guest'}`);
                            const btn = document.getElementById('btn-copy-ref');
                            if (btn) btn.innerText = i18n.currentLocale === 'am' ? 'ተቀድቷል ✅' : (i18n.currentLocale === 'om' ? 'WARAABAMEERA ✅' : 'COPIED ✅');
                        });
                        break;

                    case 'achievements':
                        showModal(`
                            <div style="font-size: 32px; margin-bottom: 12px;">🏆</div>
                            <div style="font-size: 18px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 16px; text-transform: uppercase;">${i18n.currentLocale === 'am' ? 'ስኬቶች' : (i18n.currentLocale === 'om' ? 'Milkaa\'ina' : 'Achievements')}</div>
                            <div id="achievements-content" style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                                ${DesignSystem.LoadingState(i18n.currentLocale === 'am' ? 'ስኬቶችን በመጫን ላይ...' : (i18n.currentLocale === 'om' ? 'Milkaa\'inota fe\'aa jira...' : 'Loading achievements...'))}
                            </div>
                        `);
                        
                        // Fetch achievements
                        ProfileService.getInstance().getEarnedAchievements().then(achievements => {
                            const content = document.getElementById('achievements-content');
                            if (!content) return;
                            
                            if (!achievements || achievements.length === 0) {
                                content.innerHTML = `
                                    ${DesignSystem.EmptyState('🎯', i18n.currentLocale === 'am' ? 'ምንም ስኬቶች የሉም' : (i18n.currentLocale === 'om' ? 'Milkaa\'inni Hin Jiru' : 'No Achievements'), i18n.currentLocale === 'am' ? 'ስኬቶችን ለማግኘት ተጨማሪ ጨዋታዎችን ይጫወቱ!' : (i18n.currentLocale === 'om' ? 'Milkaa\'ina argachuuf tapha dabalata taphadha!' : 'Play more matches to earn achievements!'))}
                                `;
                                return;
                            }

                            content.innerHTML = achievements.map(achRow => {
                                const ach = achRow.achievement || {};
                                return `
                                    <div style="display: flex; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                                        <span style="font-size: 24px;">${ach.icon || '🎯'}</span>
                                        <div>
                                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: var(--fds-text-main);">${ach.name_en || ach.name || (i18n.currentLocale === 'am' ? 'ስኬት' : (i18n.currentLocale === 'om' ? 'Milkaa\'ina' : 'Achievement'))} ✅</div>
                                            <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-top: 2px;">${ach.description_en || ach.description || ''}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('');
                        }).catch(_ => {
                            const content = document.getElementById('achievements-content');
                            if (content) content.innerHTML = DesignSystem.ErrorState('btn-retry-achievements');
                        });
                        break;

                    case 'awards':
                        this._audioManager.playClick();
                        this._uiManager.clear();
                        new AwardsScreen(
                            this._uiManager,
                            this._audioManager,
                            () => {
                                // Provide a callback to return to the Profile Screen
                                this._uiManager.clear();
                                this.render(); // Rebinds and renders Profile Screen
                            }
                        );
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
        if (phone.startsWith('+')) {
            clean = phone.substring(1);
        } else {
            clean = phone;
        }
        if (!clean.startsWith('251')) {
            clean = '251' + clean.replace(/^0+/, '');
        }
        return clean.substring(0, 4) + '****' + clean.substring(clean.length - 2);
    }
}
