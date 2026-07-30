import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { MessageCenterService, MessageCenterItem, SupportTicket, Announcement } from '../../networking/services/MessageCenterService';
import { EthioFantasyAppBar } from '../components/EthioFantasyAppBar';
import { PullToRefresh } from '../components/PullToRefresh';
import { TicketDialog } from '../components/TicketDialog';
import { SupportConversationModal } from '../components/SupportConversationModal';

type Tab = 'announcements' | 'personal' | 'support';
type Filter = 'All' | 'Unread' | 'Read' | 'High Priority' | 'Tournament' | 'Reward' | 'Subscription';

export class MessagesScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onBack: () => void;

    private _activeTab: Tab = 'announcements';
    private _activeFilter: Filter = 'All';
    private _searchQuery: string = '';
    
    private _loading: boolean = true;
    private _error: string | null = null;
    private _items: MessageCenterItem[] = [];
    private _unsubscribeBadge: (() => void) | null = null;
    
    private _currentRequestId: number = 0;
    private _isLayoutRendered: boolean = false;

    constructor(uiManager: UIManager, audioManager: AudioManager, onBack: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onBack = onBack;

        this._unsubscribeBadge = MessageCenterService.getInstance().subscribeToBadgeUpdates(() => {
            if (this._isLayoutRendered) this._updateContent();
        });

        this.render();
        this._loadData();
    }

    public destroy(): void {
        if (this._unsubscribeBadge) this._unsubscribeBadge();
    }

    private async _loadData(): Promise<void> {
        const requestId = ++this._currentRequestId;
        
        this._loading = true;
        this._error = null;
        if (this._isLayoutRendered) this._updateContent();

        const service = MessageCenterService.getInstance();
        try {
            if (this._activeTab === 'announcements') {
                this._items = await service.getAnnouncements();
            } else if (this._activeTab === 'personal') {
                this._items = await service.getPersonalMessages();
            } else {
                this._items = await service.getSupportTickets();
            }
        } catch (e) {
            console.error('Failed to load messages', e);
            if (this._currentRequestId === requestId) {
                this._error = 'Failed to load messages. Please check your connection.';
                this._items = [];
            }
        } finally {
            if (this._currentRequestId === requestId) {
                this._loading = false;
                this._updateContent();
            }
        }
    }

    private _getFilteredItems(): MessageCenterItem[] {
        let filtered = this._items;

        if (this._searchQuery) {
            const q = this._searchQuery.toLowerCase();
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(q) || 
                item.content.toLowerCase().includes(q)
            );
        }

        switch (this._activeFilter) {
            case 'Unread':
                filtered = filtered.filter(item => {
                    if (item.type === 'support') return (item as SupportTicket).unreadSupportMessagesCount > 0;
                    return !item.read;
                });
                break;
            case 'Read':
                filtered = filtered.filter(item => {
                    if (item.type === 'support') return (item as SupportTicket).unreadSupportMessagesCount === 0;
                    return item.read;
                });
                break;
            case 'High Priority':
                filtered = filtered.filter(item => item.priority === 'High');
                break;
            case 'Tournament':
            case 'Reward':
            case 'Subscription':
                filtered = filtered.filter(item => item.category === this._activeFilter);
                break;
            case 'All':
            default:
                break;
        }

        return filtered;
    }

    public render(): void {
        if (!this._isLayoutRendered) {
            this._renderLayout();
            this._isLayoutRendered = true;
        } else {
            this._updateLayoutState();
        }
        this._updateContent();
    }

    private _renderLayout(): void {
        const root = this._uiManager.container;
        const filters: Filter[] = ['All', 'Unread', 'Read', 'High Priority', 'Tournament', 'Reward', 'Subscription'];

        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; min-height: 100vh;">
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                ${EthioFantasyAppBar.render('MESSAGE CENTER')}

                <div style="max-width: 600px; margin: 0 auto; padding: 16px 16px 120px 16px; position: relative; z-index: 10;">
                    
                    <div style="position: relative; margin-bottom: 16px;">
                        <input type="text" id="msg-search-input" placeholder="Search messages..." value="${this._searchQuery}" style="
                            width: 100%; padding: 14px 14px 14px 40px; 
                            background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); 
                            border-radius: 12px; color: white; font-size: var(--fds-font-sm); font-weight: 700;
                            box-sizing: border-box; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); outline: none;
                        ">
                        <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px;">🔍</span>
                    </div>

                    <div id="msg-tabs-container" style="display: flex; gap: 8px; margin-bottom: 20px;">
                        <button class="msg-tab" data-tab-id="announcements">📢 Announcements</button>
                        <button class="msg-tab" data-tab-id="personal">👤 Personal</button>
                        <button class="msg-tab" data-tab-id="support">🎧 Support</button>
                    </div>

                    <div id="msg-filters-container" style="display: flex; gap: 8px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
                        ${filters.map(f => `<button class="msg-filter-chip" data-filter="${f}">${f}</button>`).join('')}
                    </div>

                    <div id="support-actions-container" style="display: none; margin-bottom: 24px;">
                        <button id="btn-create-ticket" style="
                            width: 100%; padding: 14px;
                            background: linear-gradient(135deg, var(--tv-pitch-green), #15803d);
                            border: none; border-radius: 12px;
                            color: white; font-weight: 900; font-size: 14px; text-transform: uppercase;
                            cursor: pointer; box-shadow: 0 8px 24px rgba(34,197,94,0.3);
                        ">+ Open New Ticket</button>
                    </div>

                    <div id="messages-list-wrapper" style="display: flex; flex-direction: column; gap: 12px;"></div>
                </div>
            </div>
            <style>
                .msg-tab {
                    flex: 1; padding: 12px 4px; border-radius: 12px;
                    font-size: var(--fds-font-xs); text-transform: uppercase;
                    cursor: pointer; text-align: center; transition: all 0.2s;
                }
                .msg-tab.active {
                    border: 1px solid var(--tv-pitch-green);
                    background: rgba(34, 197, 94, 0.1); color: white;
                    font-weight: 900; box-shadow: 0 4px 12px rgba(34,197,94,0.2);
                }
                .msg-tab:not(.active) {
                    border: 1px solid rgba(255,255,255,0.05);
                    background: rgba(15,23,42,0.4); color: #94A3B8; font-weight: 700;
                }
                
                .msg-filter-chip {
                    padding: 6px 16px; border-radius: 20px; white-space: nowrap;
                    flex-shrink: 0; min-height: 48px; font-size: 13px; font-weight: 800;
                    cursor: pointer; transition: all 0.2s;
                }
                .msg-filter-chip.active {
                    border: 1px solid #FFD54F; background: rgba(255, 213, 79, 0.15); color: #FFD54F;
                }
                .msg-filter-chip:not(.active) {
                    border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: var(--fds-text-dim);
                }

                .msg-tab:active, .msg-filter-chip:active { transform: scale(0.95); }
                .msg-card { cursor: pointer; transition: transform 0.2s, background 0.2s; }
                .msg-card:active { transform: scale(0.98); }
                .unread-dot {
                    width: 8px; height: 8px; border-radius: 50%;
                    background: var(--tv-pitch-green); box-shadow: 0 0 8px var(--tv-pitch-green);
                    display: inline-block;
                }
                
                @keyframes skel-pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.5; }
                }
                .skeleton-card {
                    height: 80px; border-radius: 12px;
                    background: rgba(255,255,255,0.05);
                    animation: skel-pulse 1.5s infinite;
                }
            </style>
        `;
        this._bindEvents();
        this._updateLayoutState();
    }

    private _updateLayoutState(): void {
        const root = this._uiManager.container;
        
        root.querySelectorAll('.msg-tab').forEach(tab => {
            const id = tab.getAttribute('data-tab-id');
            if (id === this._activeTab) tab.classList.add('active');
            else tab.classList.remove('active');
        });

        root.querySelectorAll('.msg-filter-chip').forEach(chip => {
            const f = chip.getAttribute('data-filter');
            if (f === this._activeFilter) chip.classList.add('active');
            else chip.classList.remove('active');
        });

        const supportActions = root.querySelector('#support-actions-container') as HTMLElement;
        if (supportActions) {
            supportActions.style.display = this._activeTab === 'support' ? 'block' : 'none';
        }
    }

    private _updateContent(): void {
        const wrapper = this._uiManager.container.querySelector('#messages-list-wrapper');
        if (!wrapper) return;

        if (this._loading) {
            wrapper.innerHTML = `
                <div class="skeleton-card"></div>
                <div class="skeleton-card" style="animation-delay: 0.1s"></div>
                <div class="skeleton-card" style="animation-delay: 0.2s"></div>
                <div class="skeleton-card" style="animation-delay: 0.3s"></div>
            `;
            return;
        }

        if (this._error) {
            wrapper.innerHTML = `
                <div style="text-align: center; padding: 40px 16px; animation: fade-in-up 0.4s ease;">
                    <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                    <h3 style="color: white; margin-bottom: 8px;">Oops!</h3>
                    <p style="color: #94A3B8; font-size: 14px; margin-bottom: 24px;">${this._error}</p>
                    <button id="btn-retry-msg" style="
                        padding: 12px 24px; border-radius: 20px; border: none;
                        background: rgba(255,255,255,0.1); color: white; font-weight: 800; cursor: pointer;
                        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2);
                    ">Try Again</button>
                </div>
            `;
            const retryBtn = wrapper.querySelector('#btn-retry-msg');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    this._audioManager.playClick();
                    this._loadData();
                });
            }
            return;
        }

        const filteredItems = this._getFilteredItems();

        if (filteredItems.length === 0) {
            let emptyMsg = "No messages available.";
            let icon = '✉️';
            let sub = "Check back later for updates.";
            
            if (this._activeTab === 'announcements') {
                emptyMsg = "No Announcements";
                icon = '📢';
                sub = "Stay tuned! The latest news and updates will appear here.";
            } else if (this._activeTab === 'personal') {
                emptyMsg = "Inbox is Empty";
                icon = '📬';
                sub = "You're all caught up. New personal messages will land here.";
            } else if (this._activeTab === 'support') {
                emptyMsg = "No Support Tickets";
                icon = '🎧';
                sub = "Need help? Open a new ticket and our team will assist you.";
            }

            if (this._searchQuery || this._activeFilter !== 'All') {
                emptyMsg = "No Results Found";
                icon = '🔍';
                sub = "Try adjusting your search or filter criteria.";
            }

            wrapper.innerHTML = `
                <div style="text-align: center; padding: 60px 16px; animation: fade-in-up 0.4s ease;">
                    <div style="font-size: 64px; margin-bottom: 20px; opacity: 0.8;">${icon}</div>
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 900; color: white;">${emptyMsg}</h2>
                    <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm); max-width: 300px; margin: 0 auto; line-height: 1.5;">${sub}</p>
                </div>
            `;
            return;
        }

        wrapper.innerHTML = filteredItems.map(item => this._renderMessageCard(item)).join('');
        this._bindCardClicks();
    }

    private _renderMessageCard(item: MessageCenterItem): string {
        const isUnread = (item.type === 'support') ? (item as SupportTicket).unreadSupportMessagesCount > 0 : !item.read;
        const timeString = new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        let icon = '✉️';
        if (item.type === 'announcement') icon = '📢';
        else if (item.type === 'support') icon = '🎧';
        else if (item.category === 'Reward') icon = '🎁';
        else if (item.category === 'Tournament') icon = '🏆';
        else if (item.category === 'Subscription') icon = '💎';

        let badgeHtml = '';
        if (item.priority === 'High') {
            badgeHtml = `<span style="background: rgba(239, 68, 68, 0.15); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 900; text-transform: uppercase;">High Priority</span>`;
        }

        return `
            <div class="glass-card msg-card fade-in-up" data-msg-id="${item.id}" style="
                padding: 16px; 
                background: ${isUnread ? 'rgba(30,41,59,0.95)' : 'rgba(15,23,42,0.6)'};
                border: 1px solid ${isUnread ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'};
                border-left: ${isUnread ? '4px solid var(--tv-pitch-green)' : '1px solid rgba(255,255,255,0.05)'};
                border-radius: 12px;
                display: flex; gap: 16px;
                opacity: ${isUnread ? '1' : '0.8'};
                min-height: 48px;
            ">
                <div style="font-size: 24px; padding-top: 4px; flex-shrink: 0;">${icon}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; gap: 8px;">
                        <div style="
                            font-size: var(--fds-font-sm); 
                            font-weight: ${isUnread ? '900' : '700'}; 
                            color: ${isUnread ? 'white' : 'var(--fds-text-main)'};
                            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                        ">${item.title}</div>
                        ${isUnread ? '<div class="unread-dot"></div>' : ''}
                    </div>
                    <div style="
                        font-size: 13px; 
                        color: var(--fds-text-dim); 
                        line-height: 1.4; 
                        margin-bottom: 12px;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    ">${item.type === 'announcement' ? (item as Announcement).shortDescription : item.content}</div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; gap: 8px; align-items: center;">
                            ${badgeHtml}
                            <span style="font-size: 11px; font-weight: 700; color: #64748B; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">${item.category}</span>
                        </div>
                        <div style="font-size: 11px; color: #64748B; font-weight: 700;">${timeString}</div>
                    </div>
                </div>
            </div>
        `;
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        EthioFantasyAppBar.bind(root, () => {
            this._audioManager.playClick();
            this.destroy();
            this._onBack();
        });

        root.querySelectorAll('.msg-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = (e.currentTarget as HTMLElement).getAttribute('data-tab-id') as Tab;
                if (tabId && tabId !== this._activeTab) {
                    this._audioManager.playClick();
                    this._activeTab = tabId;
                    this._activeFilter = 'All';
                    
                    this._searchQuery = '';
                    const searchInput = root.querySelector('#msg-search-input') as HTMLInputElement;
                    if (searchInput) searchInput.value = '';

                    this._updateLayoutState();
                    this._loadData();
                }
            });
        });

        root.querySelectorAll('.msg-filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const f = (e.currentTarget as HTMLElement).getAttribute('data-filter') as Filter;
                if (f && f !== this._activeFilter) {
                    this._audioManager.playClick();
                    this._activeFilter = f;
                    this._updateLayoutState();
                    this._updateContent();
                }
            });
        });

        const searchInput = root.querySelector('#msg-search-input') as HTMLInputElement;
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this._searchQuery = (e.target as HTMLInputElement).value;
                this._updateContent();
            });
        }

        const container = root.querySelector('.stadium-container') as HTMLElement;
        if (container) {
            PullToRefresh.attach(container, async () => {
                this._audioManager.playClick();
                await this._loadData();
            });
        }

        const createBtn = root.querySelector('#btn-create-ticket');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this._audioManager.playClick();
                const dialog = new TicketDialog(() => {
                    this._loadData();
                });
                dialog.show();
            });
        }
    }

    private _bindCardClicks(): void {
        const root = this._uiManager.container;
        root.querySelectorAll('.msg-card').forEach(card => {
            card.addEventListener('click', async (e) => {
                const id = (e.currentTarget as HTMLElement).getAttribute('data-msg-id');
                if (id) {
                    this._audioManager.playClick();
                    
                    const item = this._items.find(i => i.id === id);
                    if (item && item.type === 'support') {
                        const modal = new SupportConversationModal(item as SupportTicket, () => {
                            this.render();
                        });
                        modal.render();
                        return;
                    }
                    
                    MessageCenterService.getInstance().markAsRead(id).catch(console.error);
                    
                    this._items.forEach(i => {
                        if (i.id === id) {
                            if (i.type === 'support') (i as SupportTicket).unreadSupportMessagesCount = 0;
                            else i.read = true;
                        }
                    });
                    
                    this._updateContent();
                }
            });
        });
    }
}
