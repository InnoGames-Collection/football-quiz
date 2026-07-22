import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { i18n } from '../../localization/i18n';
import { LoaderHelper } from '../components/LoaderHelper';

export interface MessageItem {
    id: string;
    sender: string;
    recipient: string;
    text: Record<string, string>;
    time: string;
    read: boolean;
}

const GLOBAL_MESSAGES: MessageItem[] = [
    {
        id: 'msg-g1',
        sender: '📢 Admin',
        recipient: 'All',
        text: {
            en: 'Welcome to the EthioFantasy Football Quiz League! Compete and win rewards weekly.',
            am: 'እንኳን ወደ ኢትዮፋንታሲ እግር ኳስ ጥያቄ ሊግ በደህና መጡ! ይወዳደሩ እና ሳምንታዊ ሽልማቶችን ያግኙ።',
            om: 'Gara Liigii Gaaffii Kubbaa Miilaa EthioFantasy tti baga nagaan dhuftan! Dorgomaa badhaasa torbanii argadhaa.'
        },
        time: '2 hours ago',
        read: false
    },
    {
        id: 'msg-g2',
        sender: '🏆 Season Cup',
        recipient: 'All',
        text: {
            en: 'The weekend Walia Tournament is open for registration. Join now to enter the bracket!',
            am: 'የሳምንቱ መጨረሻ የዋሊያ ውድድር ምዝገባ ክፍት ነው። አሁኑኑ ይመዝገቡ!',
            om: 'Dorgommiin Waancaa Wal-irraa torban kanaa galmeef banaa dha. Hammaatu taphadhaa!'
        },
        time: '1 day ago',
        read: true
    }
];

const INBOX_MESSAGES: MessageItem[] = [
    {
        id: 'msg-d1',
        sender: '👤 Abebe K.',
        recipient: 'Me',
        text: {
            en: 'Hey! Ready for our 1v1 match today? Let\'s see who has the best football IQ.',
            am: 'ሰላም! ለዛሬው የ 1v1 ውድድር ተዘጋጅተሃል? የማን እግር ኳስ እውቀት እንደሚበልጥ እንይ።',
            om: 'Akkam! Tapha kallattii 1v1 har\'aatiif qophaahiitta? Eenyu beekumsa gaarii akka qabu haa ilaallu.'
        },
        time: '30 mins ago',
        read: false
    },
    {
        id: 'msg-d2',
        sender: '💳 Subscription',
        recipient: 'Me',
        text: {
            en: 'Your Premium plan is active. Daily subscription rate is 2 Birr/day.',
            am: 'የፕሪሚየም አገልግሎትዎ ንቁ ነው። ዕለታዊ የምዝገባ ክፍያ 2 ብር ነው።',
            om: 'Premium koodiin kee hojjachaa jira. Kaffaltiin guyyaa qarshii 2 dha.'
        },
        time: '2 days ago',
        read: true
    }
];

const SENT_MESSAGES: MessageItem[] = [
    {
        id: 'msg-s1',
        sender: 'Me',
        recipient: '👤 Abebe K.',
        text: {
            en: 'Challenge accepted! Preparing for kick-off now.',
            am: 'ተግዳሮቱን ተቀብያለሁ! አሁን ለመጀመር እየተዘጋጀሁ ነው።',
            om: 'Qormaata kee fudhadheera! Kick-off gochuuf qophaahuu jalqabeera.'
        },
        time: '25 mins ago',
        read: true
    }
];

export class MessagesScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onBack: () => void;
    private _activeTab: 'global' | 'inbox' | 'sent' = 'global';

    constructor(uiManager: UIManager, audioManager: AudioManager, onBack: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onBack = onBack;
    }

    public render(): void {
        const root = this._uiManager.container;
        const locale = i18n.currentLocale;

        // Tabs styling
        const tabStyle = (tabId: string) => {
            const isActive = this._activeTab === tabId;
            return `
                flex: 1;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid ${isActive ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.08)'};
                background: ${isActive ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
                color: ${isActive ? 'var(--tv-gold-primary)' : '#94A3B8'};
                font-weight: 800;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s;
            `;
        };

        let messagesList: MessageItem[] = [];
        if (this._activeTab === 'global') messagesList = GLOBAL_MESSAGES;
        else if (this._activeTab === 'inbox') messagesList = INBOX_MESSAGES;
        else if (this._activeTab === 'sent') messagesList = SENT_MESSAGES;

        const messagesHtml = messagesList.length > 0 ? messagesList.map(item => {
            const isMeSender = item.sender === 'Me';
            const displayName = isMeSender ? `To: ${item.recipient}` : `From: ${item.sender}`;
            return `
                <div class="glass-card" style="padding: 16px; margin-bottom: 12px; border-color: ${item.read ? 'rgba(255,255,255,0.05)' : 'var(--tv-gold-primary)'}; background: ${item.read ? 'rgba(15,23,42,0.6)' : 'rgba(255,215,0,0.02)'}; position: relative;">
                    ${!item.read ? `
                        <div style="position: absolute; top: 16px; right: 16px; width: 6px; height: 6px; border-radius: 50%; background: var(--tv-pitch-green);"></div>
                    ` : ''}
                    <div style="font-size: 13px; font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 4px;">${displayName}</div>
                    <div style="font-size: 14px; color: white; line-height: 1.4; margin-bottom: 8px;">${item.text[locale] || item.text['en']}</div>
                    <div style="font-size: 10px; color: #64748B; font-weight: 700;">⏱️ ${item.time}</div>
                </div>
            `;
        }).join('') : LoaderHelper.getEmptyStateHtml(
            'messages',
            'You do not have any messages in this category yet. Invite friends or participate in active tournaments to spark conversations!',
            'Invite Friends',
            'btn-empty-invite'
        );

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- App Bar -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: flex-start; padding-left: 8px;">
                    <button id="btn-msg-back" style="
                        background: none; border: none; color: white; font-size: 24px; padding: 8px 16px; cursor: pointer;
                    ">❮</button>
                    <div style="font-weight: 900; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase;">MESSAGES</div>
                </div>

                <div style="max-width: 600px; margin: 0 auto; padding: 16px 16px 120px 16px;">
                    
                    <!-- Tabs Segmented Control -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                        <button class="msg-tab" data-tab-id="global" style="${tabStyle('global')}">📢 GLOBAL</button>
                        <button class="msg-tab" data-tab-id="inbox" style="${tabStyle('inbox')}">📥 INBOX</button>
                        <button class="msg-tab" data-tab-id="sent" style="${tabStyle('sent')}">📤 SENT</button>
                    </div>

                    <!-- Messages Container -->
                    <div>
                        ${messagesHtml}
                    </div>

                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        document.getElementById('btn-msg-back')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onBack();
        });

        const tabs = this._uiManager.container.querySelectorAll('.msg-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const tabId = target.getAttribute('data-tab-id') as any;
                if (tabId) {
                    this._audioManager.playClick();
                    this._activeTab = tabId;
                    this.render();
                }
            });
        });

        document.getElementById('btn-empty-invite')?.addEventListener('click', () => {
            this._audioManager.playClick();
            navigator.clipboard.writeText('https://ethiofantasy.com/join?ref=251911223345');
            alert('Invitation link copied! Send it to your friends to start chat lobbies.');
        });
    }
}
