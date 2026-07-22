import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { i18n } from '../../localization/i18n';
import { LoaderHelper } from '../components/LoaderHelper';

export interface NotificationItem {
    id: string;
    title: Record<string, string>;
    description: Record<string, string>;
    time: Record<string, string>;
    category: 'daily' | 'tournament' | 'rewards' | 'announcements' | 'subscription';
    read: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'notif-1',
        title: {
            en: 'Daily Quiz Active!',
            am: 'የዕለት ጥያቄው ወጥቷል!',
            om: 'Gaaffiin Guyyaa Gadi Lakkifameera!'
        },
        description: {
            en: 'Today\'s challenge on the Ethiopian Premier League is now live. Complete it to earn a 1.5x XP multiplier!',
            am: 'የዛሬው የኢትዮጵያ ፕሪሚየር ሊግ ተግዳሮት አሁን ዝግጁ ነው። ያጠናቅቁና ባለ 1.5x XP ያግኙ!',
            om: 'Qormaanni guyyaa har\'aa tapha Liigii Itoophiyaa irratti kallattiin darba. Xumuraa XP 1.5x argadhaa!'
        },
        time: {
            en: '5 mins ago',
            am: 'ከ5 ደቂቃ በፊት',
            om: 'Daqiiqaa 5 dura'
        },
        category: 'daily',
        read: false
    },
    {
        id: 'notif-2',
        title: {
            en: 'Weekly Prize Pool Claimable',
            am: 'የሳምንታዊ ሽልማት ማግኛ!',
            om: 'Badhaasa Torbanii Fudhachuuf!'
        },
        description: {
            en: 'Congratulations! You finished in the top 10 this week. Claim your 500 bonus coins now.',
            am: 'እንኳን ደስ አሰኘዎት! በዚህ ሳምንት በምርጥ 10 ውስጥ አጠናቀዋል። የ 500 ሳንቲም ጉርሻዎን አሁን ያግኙ።',
            om: 'Baga gammaddan! Torban kana top 10 keessatti xumurtan. Badhaasa qabxii 500 keessan fudhadhaa.'
        },
        time: {
            en: '2 hours ago',
            am: 'ከ2 ሰዓት በፊት',
            om: 'Sa\'aatii 2 dura'
        },
        category: 'rewards',
        read: false
    },
    {
        id: 'notif-3',
        title: {
            en: 'Champions League Quiz Night',
            am: 'የቻምፒየንስ ሊግ የጥያቄ ምሽት',
            om: 'Halkan Gaaffii Chaampiyoonsi Liigii'
        },
        description: {
            en: 'New UEFA Champions League trivia set is live. Test your knowledge against other fans.',
            am: 'አዲስ የUEFA ቻምፒየንስ ሊግ ጥያቄዎች ወጥተዋል። እውቀትዎን ከሌሎች ደጋፊዎች ጋር ይፈትኑ።',
            om: 'Trivia UEFA Champions League haaraan kallattiin darba. Beekumsa kee taajjabi.'
        },
        time: {
            en: '1 day ago',
            am: 'ከ1 ቀን በፊት',
            om: 'Guyyaa 1 dura'
        },
        category: 'tournament',
        read: true
    },
    {
        id: 'notif-4',
        title: {
            en: 'System Upgrade Completed',
            am: 'የስርዓት ማሻሻያ ተጠናቋል',
            om: 'Fooyya\'insi Sirnaa Xumurameera'
        },
        description: {
            en: 'EthioFantasy has been upgraded to v1.1.0 with faster load times and the new Notification Center.',
            am: 'ኢትዮፋንታሲ ወደ ስሪት v1.1.0 ተሻሽሏል - ፈጣን አፈጻጸም እና አዲስ የማሳወቂያ ማዕከልን አካቷል።',
            om: 'EthioFantasy gara v1.1.0 fooyya\'eera - saffisa gaarii fi kuusaa beeksisa haaraa qaba.'
        },
        time: {
            en: '2 days ago',
            am: 'ከ2 ቀን በፊት',
            om: 'Guyyaa 2 dura'
        },
        category: 'announcements',
        read: true
    },
    {
        id: 'notif-5',
        title: {
            en: 'Premium Subscription Renewed',
            am: 'ፕሪሚየም ምዝገባ ታድሷል',
            om: 'Koodiin Premium Haarameera'
        },
        description: {
            en: 'Thank you for playing! Your Ethio Telecom premium subscription has been successfully renewed.',
            am: 'ስለተጫወቱ እናመሰግናለን! የኢትዮ ቴሌኮም ፕሪሚየም ምዝገባዎ በተሳካ ሁኔታ ታድሷል።',
            om: 'Taphachuu keessaniif galatoomaa! Koodiin premium Itiyo Telekoom keessanii milkiin haarameera.'
        },
        time: {
            en: '3 days ago',
            am: 'ከ3 ቀን በፊት',
            om: 'Guyyaa 3 dura'
        },
        category: 'subscription',
        read: true
    }
];

export class NotificationScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onBack: () => void;
    private _activeTab: string = 'all';
    private _notifications: NotificationItem[] = [];

    constructor(uiManager: UIManager, audioManager: AudioManager, onBack: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onBack = onBack;
        this._loadNotifications();
    }

    private _loadNotifications(): void {
        const saved = localStorage.getItem('ETHIO_FOOTBALL_NOTIFICATIONS');
        if (saved) {
            try {
                this._notifications = JSON.parse(saved);
            } catch (e) {
                this._notifications = [...DEFAULT_NOTIFICATIONS];
            }
        } else {
            this._notifications = [...DEFAULT_NOTIFICATIONS];
            this._saveNotifications();
        }
    }

    private _saveNotifications(): void {
        localStorage.setItem('ETHIO_FOOTBALL_NOTIFICATIONS', JSON.stringify(this._notifications));
    }

    public render(): void {
        const root = this._uiManager.container;
        const locale = i18n.currentLocale;

        // Filter notifications based on active tab
        const filtered = this._notifications.filter(item => {
            if (this._activeTab === 'all') return true;
            if (this._activeTab === 'unread') return !item.read;
            return item.category === this._activeTab;
        });

        // Tabs Config
        const tabs = [
            { id: 'all', label: { en: 'All', am: 'ሁሉም', om: 'Hunda' } },
            { id: 'unread', label: { en: 'Unread', am: 'ያልተነበቡ', om: 'Kan Hin Dubbifamne' } },
            { id: 'daily', label: { en: 'Daily', am: 'የዕለት', om: 'Guyyaa' } },
            { id: 'tournament', label: { en: 'League', am: 'ሊግ', om: 'Liigii' } },
            { id: 'rewards', label: { en: 'Rewards', am: 'ሽልማቶች', om: 'Badhaasa' } },
            { id: 'announcements', label: { en: 'System', am: 'ስርዓት', om: 'Sirna' } },
            { id: 'subscription', label: { en: 'Billing', am: 'ክፍያ', om: 'Kaffaltii' } }
        ];

        const tabsHtml = tabs.map(tab => {
            const isActive = tab.id === this._activeTab;
            const count = tab.id === 'unread' 
                ? this._notifications.filter(n => !n.read).length 
                : (tab.id === 'all' ? this._notifications.length : this._notifications.filter(n => n.category === tab.id).length);

            return `
                <button class="notif-tab ${isActive ? 'active-notif-tab' : ''}" data-tab-id="${tab.id}" style="
                    flex: 0 0 auto;
                    padding: 8px 14px;
                    border-radius: 20px;
                    border: 1px solid ${isActive ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.08)'};
                    background: ${isActive ? 'rgba(255, 215, 0, 0.12)' : 'rgba(15, 23, 42, 0.6)'};
                    color: ${isActive ? 'var(--tv-gold-primary)' : '#94A3B8'};
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                ">
                    ${tab.label[locale] || tab.label['en']} (${count})
                </button>
            `;
        }).join('');

        const notificationsListHtml = filtered.length > 0 ? filtered.map(item => {
            const categoryIcons: Record<string, string> = {
                daily: '📅',
                tournament: '🏆',
                rewards: '🎁',
                announcements: '📢',
                subscription: '💳'
            };
            const icon = categoryIcons[item.category] || '🔔';

            return `
                <div class="glass-card notif-item ${item.read ? 'notif-read' : 'notif-unread'}" data-notif-id="${item.id}" style="
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-radius: 14px;
                    cursor: pointer;
                    position: relative;
                    transition: transform 0.2s, background-color 0.2s;
                    border-color: ${item.read ? 'rgba(255,255,255,0.05)' : 'rgba(255, 215, 0, 0.3)'};
                    background: ${item.read ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 215, 0, 0.03)'};
                ">
                    <!-- Status Indicator Dot -->
                    ${!item.read ? `
                        <div style="
                            position: absolute;
                            top: 16px;
                            right: 16px;
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            background-color: var(--tv-pitch-green);
                            box-shadow: 0 0 8px var(--tv-pitch-glow);
                        "></div>
                    ` : ''}

                    <!-- Category Icon -->
                    <div style="
                        width: 44px;
                        height: 44px;
                        border-radius: 10px;
                        background: rgba(255,255,255,0.05);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 22px;
                        flex-shrink: 0;
                    ">${icon}</div>

                    <!-- Texts -->
                    <div style="flex: 1; padding-right: 12px;">
                        <div style="
                            font-size: 15px; 
                            font-weight: 800; 
                            color: ${item.read ? '#CBD5E1' : '#FFFFFF'};
                            margin-bottom: 4px;
                        ">${item.title[locale] || item.title['en']}</div>
                        <div style="
                            font-size: 13px; 
                            color: #94A3B8; 
                            line-height: 1.4;
                            margin-bottom: 6px;
                        ">${item.description[locale] || item.description['en']}</div>
                        <div style="
                            font-size: 11px; 
                            color: #64748B; 
                            font-weight: 600;
                        ">⏱️ ${item.time[locale] || item.time['en']}</div>
                    </div>
                </div>
            `;
        }).join('') : LoaderHelper.getEmptyStateHtml(
            'notifications',
            locale === 'am' 
                ? 'ምንም ማሳወቂያዎች የሉም። የቅርብ ጊዜ ውድድሮችን ለመከታተል በኋላ ይመለሱ።' 
                : (locale === 'om' ? 'Beeksisi hin jiru. Ibsa haaraa dorgommiitiif booda deebi\'aa.' : 'No notifications found in this folder. Keep playing to trigger division milestones!'),
            locale === 'am' ? 'ወደ መነሻ' : (locale === 'om' ? 'Gara Manaa' : 'Back to Home'),
            'btn-empty-home'
        );

        const hasUnread = this._notifications.some(n => !n.read);

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- App Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: space-between; padding: 12px 16px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button id="btn-back" style="
                            background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 4px;
                        ">❮</button>
                        <div style="font-weight: 900; font-size: 16px; letter-spacing: 1px; text-transform: uppercase;">
                            ${locale === 'am' ? 'ማሳወቂያዎች' : (locale === 'om' ? 'BEEKSIISAA' : 'NOTIFICATIONS')}
                        </div>
                    </div>
                    ${hasUnread ? `
                        <button id="btn-mark-read" style="
                            background: rgba(255,255,255,0.08);
                            border: 1px solid rgba(255,255,255,0.15);
                            color: white;
                            font-size: 11px;
                            font-weight: 800;
                            padding: 6px 12px;
                            border-radius: 12px;
                            cursor: pointer;
                        ">
                            ${locale === 'am' ? 'ሁሉንም አንብብ' : (locale === 'om' ? 'Hunda Dubbisi' : 'MARK ALL READ')}
                        </button>
                    ` : ''}
                </div>

                <!-- Scrolling Section -->
                <div style="max-width: 600px; margin: 0 auto; padding: 16px 16px 120px 16px;">
                    
                    <!-- Search Input -->
                    <input type="text" id="notif-search-input" placeholder="🔍 Search notifications..." style="
                        width: 100%; 
                        padding: 10px 14px; 
                        background: rgba(0,0,0,0.2); 
                        border: 1px solid rgba(255,255,255,0.1); 
                        border-radius: 8px; 
                        color: white; 
                        font-size: 13px; 
                        margin-bottom: 16px; 
                        box-sizing: border-box;
                    ">
                    
                    <!-- Horizontal Category Filter Slider -->
                    <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: none; -ms-overflow-style: none;">
                        ${tabsHtml}
                    </div>

                    <!-- Notifications List -->
                    <div id="notifications-list">
                        ${notificationsListHtml}
                    </div>
                </div>
            </div>
            <style>
                .notif-tab::-webkit-scrollbar { display: none; }
                .notif-item:active { transform: scale(0.98); }
            </style>
        `;

        this._bindEvents();
    }

    private _filterNotifications(query: string): void {
        const locale = i18n.currentLocale;
        
        let filtered = this._notifications.filter(item => {
            if (this._activeTab === 'all') return true;
            if (this._activeTab === 'unread') return !item.read;
            return item.category === this._activeTab;
        });

        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = filtered.filter(item => 
                (item.title[locale] || '').toLowerCase().includes(q) || 
                (item.title['en'] || '').toLowerCase().includes(q) ||
                (item.description[locale] || '').toLowerCase().includes(q) ||
                (item.description['en'] || '').toLowerCase().includes(q)
            );
        }

        const container = document.getElementById('notifications-list');
        if (container) {
            container.innerHTML = filtered.length > 0 ? filtered.map(item => {
                const categoryIcons: Record<string, string> = {
                    daily: '📅',
                    tournament: '🏆',
                    rewards: '🎁',
                    announcements: '📢',
                    subscription: '💳'
                };
                const icon = categoryIcons[item.category] || '🔔';

                return `
                    <div class="glass-card notif-item ${item.read ? 'notif-read' : 'notif-unread'}" data-notif-id="${item.id}" style="
                        display: flex;
                        gap: 16px;
                        padding: 16px;
                        margin-bottom: 12px;
                        border-radius: 14px;
                        cursor: pointer;
                        position: relative;
                        transition: transform 0.2s, background-color 0.2s;
                        border-color: ${item.read ? 'rgba(255,255,255,0.05)' : 'rgba(255, 215, 0, 0.3)'};
                        background: ${item.read ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 215, 0, 0.03)'};
                    ">
                        <!-- Status Indicator Dot -->
                        ${!item.read ? `
                            <div style="
                                position: absolute;
                                top: 16px;
                                right: 16px;
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                background-color: var(--tv-pitch-green);
                                box-shadow: 0 0 8px var(--tv-pitch-glow);
                            "></div>
                        ` : ''}

                        <!-- Category Icon -->
                        <div style="
                            width: 44px;
                            height: 44px;
                            border-radius: 10px;
                            background: rgba(255,255,255,0.05);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 22px;
                            flex-shrink: 0;
                        ">${icon}</div>

                        <!-- Texts -->
                        <div style="flex: 1; padding-right: 12px;">
                            <div style="
                                font-size: 15px; 
                                font-weight: 800; 
                                color: ${item.read ? '#CBD5E1' : '#FFFFFF'};
                                margin-bottom: 4px;
                            ">${item.title[locale] || item.title['en']}</div>
                            <div style="
                                font-size: 13px; 
                                color: #94A3B8; 
                                line-height: 1.4;
                                margin-bottom: 6px;
                            ">${item.description[locale] || item.description['en']}</div>
                            <div style="
                                font-size: 11px; 
                                color: #64748B; 
                                font-weight: 600;
                            ">⏱️ ${item.time[locale] || item.time['en']}</div>
                        </div>
                    </div>
                `;
            }).join('') : LoaderHelper.getEmptyStateHtml(
                'search',
                locale === 'am' ? 'ምንም ማሳወቂያዎች አልተገኙም።' : (locale === 'om' ? 'Beeksisi hin argamne.' : 'No notifications match your search query.'),
                locale === 'am' ? 'ፍለጋ አጽዳ' : (locale === 'om' ? 'Qulqulleessi' : 'Clear Search'),
                'btn-empty-clear-notif'
            );

            // Re-bind click handlers
            const items = container.querySelectorAll('.notif-item');
            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    const target = e.currentTarget as HTMLElement;
                    const notifId = target.getAttribute('data-notif-id');
                    const notif = this._notifications.find(n => n.id === notifId);
                    if (notif) {
                        this._audioManager.playClick();
                        notif.read = !notif.read;
                        this._saveNotifications();
                        const input = document.getElementById('notif-search-input') as HTMLInputElement;
                        this._filterNotifications(input ? input.value : '');
                    }
                });
            });

            // Bind Clear search btn
            document.getElementById('btn-empty-clear-notif')?.addEventListener('click', () => {
                this._audioManager.playClick();
                const input = document.getElementById('notif-search-input') as HTMLInputElement;
                if (input) {
                    input.value = '';
                    this._filterNotifications('');
                }
            });
        }
    }

    private _bindEvents(): void {
        document.getElementById('btn-back')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onBack();
        });

        // Search input event
        const searchInput = document.getElementById('notif-search-input') as HTMLInputElement;
        searchInput?.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value;
            this._filterNotifications(query);
        });

        document.getElementById('btn-mark-read')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._notifications.forEach(n => n.read = true);
            this._saveNotifications();
            this.render();
        });

        // Tab Filter switching
        const tabButtons = this._uiManager.container.querySelectorAll('.notif-tab');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const tabId = target.getAttribute('data-tab-id');
                if (tabId) {
                    this._audioManager.playClick();
                    this._activeTab = tabId;
                    this.render();
                }
            });
        });

        // Click Notification to Toggle Read status
        const items = this._uiManager.container.querySelectorAll('.notif-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const notifId = target.getAttribute('data-notif-id');
                const notif = this._notifications.find(n => n.id === notifId);
                if (notif) {
                    this._audioManager.playClick();
                    notif.read = !notif.read;
                    this._saveNotifications();
                    this.render();
                }
            });
        });

        document.getElementById('btn-empty-home')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onBack();
        });
    }
}
