import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { i18n } from '../../localization/i18n';
import { LoaderHelper } from '../components/LoaderHelper';
import { MessageService } from '../../networking/services/MessageService';
import { Toast } from '../components/Toast';
import { AuthManager } from '../../core/auth/AuthManager';
import type { MessageRow } from '../../networking/supabase/types';
import { PullToRefresh } from '../components/PullToRefresh';

export class MessagesScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onBack: () => void;
    private _activeTab: 'global' | 'inbox' | 'sent' = 'global';
    private _messagesCache: MessageRow[] = [];
    private _unsubscribeRealtime: (() => void) | null = null;

    constructor(uiManager: UIManager, audioManager: AudioManager, onBack: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onBack = onBack;

        // Listen for realtime messages
        this._unsubscribeRealtime = MessageService.getInstance().subscribeToNewMessages((newMsg) => {
            const currentUserId = AuthManager.getInstance().currentUser?.id;
            if (this._activeTab === 'global' && newMsg.channel === 'global') {
                this._messagesCache.unshift(newMsg);
                this.render();
            } else if (this._activeTab === 'inbox' && newMsg.recipient_id === currentUserId) {
                this._messagesCache.unshift(newMsg);
                this.render();
            }
        });

        this._loadMessages();
    }

    private async _loadMessages(): Promise<void> {
        const msgService = MessageService.getInstance();
        if (this._activeTab === 'global') {
            this._messagesCache = await msgService.getMessages('global');
        } else if (this._activeTab === 'inbox') {
            this._messagesCache = await msgService.getInbox();
        } else if (this._activeTab === 'sent') {
            this._messagesCache = await msgService.getSent();
        }
        this.render();
    }

    public render(): void {
        const root = this._uiManager.container;
        const locale = i18n.currentLocale;
        const currentUserId = AuthManager.getInstance().currentUser?.id || '';

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

        const messagesHtml = this._messagesCache.length > 0 ? this._messagesCache.map(item => {
            const isMeSender = item.sender_id === currentUserId;
            const displayName = isMeSender 
                ? (item.recipient_id ? `To: Player_${item.recipient_id.substring(0, 8).toUpperCase()}` : 'To: All') 
                : (item.sender_id ? `From: Player_${item.sender_id.substring(0, 8).toUpperCase()}` : 'From: 📢 Admin');
            
            const messageBody = locale === 'am' && item.body_am ? item.body_am : (locale === 'om' && item.body_om ? item.body_om : item.body_en);
            const timeString = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return `
                <div class="glass-card" style="padding: 16px; margin-bottom: 12px; border-color: ${item.read ? 'rgba(255,255,255,0.05)' : 'var(--tv-gold-primary)'}; background: ${item.read ? 'rgba(15,23,42,0.6)' : 'rgba(255,215,0,0.02)'}; position: relative;">
                    ${(!item.read && !isMeSender) ? `
                        <div style="position: absolute; top: 16px; right: 16px; width: 6px; height: 6px; border-radius: 50%; background: var(--tv-pitch-green);"></div>
                    ` : ''}
                    <div style="font-size: 13px; font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 4px;">${displayName}</div>
                    <div style="font-size: 14px; color: white; line-height: 1.4; margin-bottom: 8px;">${messageBody}</div>
                    <div style="font-size: 10px; color: #64748B; font-weight: 700;">⏱️ ${timeString}</div>
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
                    
                    <!-- Search Input -->
                    <input type="text" id="msg-search-input" placeholder="🔍 Search messages..." style="
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

                    <!-- Tabs Segmented Control -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                        <button class="msg-tab" data-tab-id="global" style="${tabStyle('global')}">📢 GLOBAL</button>
                        <button class="msg-tab" data-tab-id="inbox" style="${tabStyle('inbox')}">📥 INBOX</button>
                        <button class="msg-tab" data-tab-id="sent" style="${tabStyle('sent')}">📤 SENT</button>
                    </div>

                    <!-- Messages Container -->
                    <div id="messages-list-wrapper">
                        ${messagesHtml}
                    </div>

                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _filterMessages(query: string): void {
        const locale = i18n.currentLocale;
        let messagesList = this._messagesCache;

        if (query.trim()) {
            const q = query.toLowerCase();
            messagesList = messagesList.filter(item => 
                (item.body_en && item.body_en.toLowerCase().includes(q)) || 
                (item.body_am && item.body_am.toLowerCase().includes(q)) ||
                (item.body_om && item.body_om.toLowerCase().includes(q)) ||
                (item.sender_id && item.sender_id.toLowerCase().includes(q))
            );
        }

        const currentUserId = AuthManager.getInstance().currentUser?.id || '';
        const wrapper = document.getElementById('messages-list-wrapper');
        if (wrapper) {
            wrapper.innerHTML = messagesList.length > 0 ? messagesList.map(item => {
                const isMeSender = item.sender_id === currentUserId;
                const displayName = isMeSender 
                    ? (item.recipient_id ? `To: Player_${item.recipient_id.substring(0, 8).toUpperCase()}` : 'To: All') 
                    : (item.sender_id ? `From: Player_${item.sender_id.substring(0, 8).toUpperCase()}` : 'From: 📢 Admin');
                
                const messageBody = locale === 'am' && item.body_am ? item.body_am : (locale === 'om' && item.body_om ? item.body_om : item.body_en);
                const timeString = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return `
                    <div class="glass-card" style="padding: 16px; margin-bottom: 12px; border-color: ${item.read ? 'rgba(255,255,255,0.05)' : 'var(--tv-gold-primary)'}; background: ${item.read ? 'rgba(15,23,42,0.6)' : 'rgba(255,215,0,0.02)'}; position: relative;">
                        ${(!item.read && !isMeSender) ? `
                            <div style="position: absolute; top: 16px; right: 16px; width: 6px; height: 6px; border-radius: 50%; background: var(--tv-pitch-green);"></div>
                        ` : ''}
                        <div style="font-size: 13px; font-weight: 800; color: var(--tv-gold-primary); margin-bottom: 4px;">${displayName}</div>
                        <div style="font-size: 14px; color: white; line-height: 1.4; margin-bottom: 8px;">${messageBody}</div>
                        <div style="font-size: 10px; color: #64748B; font-weight: 700;">⏱️ ${timeString}</div>
                    </div>
                `;
            }).join('') : LoaderHelper.getEmptyStateHtml(
                'search',
                'No messages match your search query. Try typing something else!',
                'Clear Search',
                'btn-empty-clear-search'
            );

            // Bind clear search button
            document.getElementById('btn-empty-clear-search')?.addEventListener('click', () => {
                this._audioManager.playClick();
                const input = document.getElementById('msg-search-input') as HTMLInputElement;
                if (input) {
                    input.value = '';
                    this._filterMessages('');
                }
            });
        }
    }

    private _bindEvents(): void {
        document.getElementById('btn-msg-back')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._unsubscribeRealtime) {
                this._unsubscribeRealtime();
            }
            this._onBack();
        });

        // Search keyup monitor
        const searchInput = document.getElementById('msg-search-input') as HTMLInputElement;
        searchInput?.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value;
            this._filterMessages(query);
        });

        const tabs = this._uiManager.container.querySelectorAll('.msg-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLElement;
                const tabId = target.getAttribute('data-tab-id') as any;
                if (tabId) {
                    this._audioManager.playClick();
                    this._activeTab = tabId;
                    
                    const wrapper = document.getElementById('messages-list-wrapper');
                    if (wrapper) wrapper.innerHTML = '<div style="padding: 20px; color: #94A3B8; text-align: center;">Loading messages...</div>';
                    
                    await this._loadMessages();
                }
            });
        });

        document.getElementById('btn-empty-invite')?.addEventListener('click', () => {
            this._audioManager.playClick();
            navigator.clipboard.writeText('https://ethiofantasy.com/join?ref=251911223345');
            Toast.show('Invitation link copied! Send it to your friends to start chat lobbies.', 'info');
        });

        // Pull to refresh
        const container = this._uiManager.container.querySelector('.stadium-container') as HTMLElement;
        if (container) {
            PullToRefresh.attach(container, async () => {
                this._audioManager.playClick();
                await this._loadMessages();
            });
        }
    }
}
