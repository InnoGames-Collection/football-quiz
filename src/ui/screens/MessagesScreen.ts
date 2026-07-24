import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { MessageCenterService, MessageCenterItem, SupportTicket, Announcement } from '../../networking/services/MessageCenterService';
import { DesignSystem } from '../theme/DesignSystem';
import { EthioFantasyAppBar } from '../components/EthioFantasyAppBar';
import { PullToRefresh } from '../components/PullToRefresh';
import { Toast } from '../components/Toast';

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
    private _items: MessageCenterItem[] = [];
    private _unsubscribeBadge: (() => void) | null = null;

    constructor(uiManager: UIManager, audioManager: AudioManager, onBack: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onBack = onBack;

        this._unsubscribeBadge = MessageCenterService.getInstance().subscribeToBadgeUpdates(() => {
            // Re-render if new background messages arrive
        });

        this._loadData();
    }

    public destroy(): void {
        if (this._unsubscribeBadge) this._unsubscribeBadge();
    }

    private async _loadData(): Promise<void> {
        this._loading = true;
        this.render();

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
            this._items = [];
        } finally {
            this._loading = false;
            this.render();
        }
    }

    private _getFilteredItems(): MessageCenterItem[] {
        let filtered = this._items;

        // Apply Search
        if (this._searchQuery) {
            const q = this._searchQuery.toLowerCase();
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(q) || 
                item.content.toLowerCase().includes(q)
            );
        }

        // Apply Chip Filter
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
        const root = this._uiManager.container;
        const filteredItems = this._getFilteredItems();

        const tabStyle = (tab: Tab) => `
            flex: 1;
            padding: 12px 4px;
            border-radius: 12px;
            border: 1px solid ${this._activeTab === tab ? 'var(--tv-pitch-green)' : 'rgba(255,255,255,0.05)'};
            background: ${this._activeTab === tab ? 'rgba(34, 197, 94, 0.1)' : 'rgba(15,23,42,0.4)'};
            color: ${this._activeTab === tab ? 'white' : '#94A3B8'};
            font-weight: ${this._activeTab === tab ? '900' : '700'};
            font-size: var(--fds-font-xs);
            text-transform: uppercase;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
            box-shadow: ${this._activeTab === tab ? '0 4px 12px rgba(34,197,94,0.2)' : 'none'};
        `;

        const filters: Filter[] = ['All', 'Unread', 'Read', 'High Priority', 'Tournament', 'Reward', 'Subscription'];

        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; min-height: 100vh;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                <!-- App Bar -->
                ${EthioFantasyAppBar.render('MESSAGE CENTER')}

                <div style="max-width: 600px; margin: 0 auto; padding: 16px 16px 120px 16px; position: relative; z-index: 10;">
                    
                    <!-- Search Input -->
                    <div style="position: relative; margin-bottom: 16px;">
                        <input type="text" id="msg-search-input" placeholder="Search messages..." value="${this._searchQuery}" style="
                            width: 100%; 
                            padding: 14px 14px 14px 40px; 
                            background: rgba(15,23,42,0.8); 
                            border: 1px solid rgba(255,255,255,0.1); 
                            border-radius: 12px; 
                            color: white; 
                            font-size: var(--fds-font-sm); 
                            font-weight: 700;
                            box-sizing: border-box;
                            box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
                            outline: none;
                        ">
                        <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px;">🔍</span>
                    </div>

                    <!-- Main Tabs -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                        <button class="msg-tab" data-tab-id="announcements" style="${tabStyle('announcements')}">📢 Announcements</button>
                        <button class="msg-tab" data-tab-id="personal" style="${tabStyle('personal')}">👤 Personal</button>
                        <button class="msg-tab" data-tab-id="support" style="${tabStyle('support')}">🎧 Support</button>
                    </div>

                    <!-- Filter Chips (Horizontal Scroll) -->
                    <div style="display: flex; gap: 8px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;">
                        ${filters.map(f => `
                            <button class="msg-filter-chip" data-filter="${f}" style="
                                padding: 6px 16px;
                                border-radius: 20px;
                                white-space: nowrap;
                                font-size: 12px;
                                font-weight: 800;
                                cursor: pointer;
                                border: 1px solid ${this._activeFilter === f ? '#FFD54F' : 'rgba(255,255,255,0.1)'};
                                background: ${this._activeFilter === f ? 'rgba(255, 213, 79, 0.15)' : 'rgba(255,255,255,0.05)'};
                                color: ${this._activeFilter === f ? '#FFD54F' : 'var(--fds-text-dim)'};
                                transition: all 0.2s;
                            ">${f}</button>
                        `).join('')}
                    </div>

                    <!-- Create Ticket Button for Support Tab -->
                    ${this._activeTab === 'support' ? `
                        <button id="btn-create-ticket" style="
                            width: 100%; padding: 14px; margin-bottom: 24px;
                            background: linear-gradient(135deg, var(--tv-pitch-green), #15803d);
                            border: none; border-radius: 12px;
                            color: white; font-weight: 900; font-size: 14px; text-transform: uppercase;
                            cursor: pointer; box-shadow: 0 8px 24px rgba(34,197,94,0.3);
                        ">+ Open New Ticket</button>
                    ` : ''}

                    <!-- Messages List -->
                    <div id="messages-list-wrapper" style="display: flex; flex-direction: column; gap: 12px;">
                        ${this._renderContent(filteredItems)}
                    </div>

                </div>
            </div>
            <style>
                .msg-tab:active, .msg-filter-chip:active { transform: scale(0.95); }
                .msg-card { cursor: pointer; transition: transform 0.2s, background 0.2s; }
                .msg-card:active { transform: scale(0.98); }
                .unread-dot {
                    width: 8px; height: 8px; border-radius: 50%;
                    background: var(--tv-pitch-green);
                    box-shadow: 0 0 8px var(--tv-pitch-green);
                    display: inline-block;
                }
            </style>
        `;

        this._bindEvents();
    }

    private _renderContent(items: MessageCenterItem[]): string {
        if (this._loading) {
            return DesignSystem.LoadingState('Loading messages...');
        }

        if (items.length === 0) {
            let emptyMsg = "No messages available.";
            if (this._activeTab === 'announcements') emptyMsg = "No announcements available.";
            else if (this._activeTab === 'personal') emptyMsg = "No personal messages.";
            else if (this._activeTab === 'support') emptyMsg = "No support conversations.";

            if (this._searchQuery || this._activeFilter !== 'All') {
                emptyMsg = "No messages match your filters.";
            }

            return `
                <div style="text-align: center; padding: 60px 16px;">
                    <div style="font-size: 64px; margin-bottom: 16px;">⚽</div>
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 900; color: white;">${emptyMsg}</h2>
                    <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm);">Check back later for updates.</p>
                </div>
            `;
        }

        return items.map(item => this._renderMessageCard(item)).join('');
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
            <div class="glass-card msg-card" data-msg-id="${item.id}" style="
                padding: 16px; 
                background: ${isUnread ? 'rgba(30,41,59,0.95)' : 'rgba(15,23,42,0.6)'};
                border: 1px solid ${isUnread ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'};
                border-left: ${isUnread ? '4px solid var(--tv-pitch-green)' : '1px solid rgba(255,255,255,0.05)'};
                border-radius: 12px;
                display: flex; gap: 16px;
                opacity: ${isUnread ? '1' : '0.8'};
            ">
                <div style="font-size: 24px; padding-top: 4px;">${icon}</div>
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

        // Tabs
        root.querySelectorAll('.msg-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = (e.currentTarget as HTMLElement).getAttribute('data-tab-id') as Tab;
                if (tabId && tabId !== this._activeTab) {
                    this._audioManager.playClick();
                    this._activeTab = tabId;
                    this._activeFilter = 'All'; // Reset filter on tab change
                    this._loadData();
                }
            });
        });

        // Filters
        root.querySelectorAll('.msg-filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const f = (e.currentTarget as HTMLElement).getAttribute('data-filter') as Filter;
                if (f && f !== this._activeFilter) {
                    this._audioManager.playClick();
                    this._activeFilter = f;
                    this.render(); // Just re-render cached items locally
                }
            });
        });

        // Search
        const searchInput = root.querySelector('#msg-search-input') as HTMLInputElement;
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this._searchQuery = (e.target as HTMLInputElement).value;
                const wrapper = root.querySelector('#messages-list-wrapper');
                if (wrapper) {
                    wrapper.innerHTML = this._renderContent(this._getFilteredItems());
                    this._bindCardClicks(); // rebind dynamically rendered cards
                }
            });
        }

        // Pull to refresh
        const container = root.querySelector('.stadium-container') as HTMLElement;
        if (container) {
            PullToRefresh.attach(container, async () => {
                this._audioManager.playClick();
                await this._loadData();
            });
        }

        // Open Ticket Button
        const createBtn = root.querySelector('#btn-create-ticket');
        if (createBtn) {
            createBtn.addEventListener('click', async () => {
                this._audioManager.playClick();
                const title = prompt("Enter a brief title for your support ticket:");
                if (!title) return;
                const content = prompt("Describe your issue:");
                if (!content) return;
                
                Toast.show("Submitting ticket...", "info");
                try {
                    await MessageCenterService.getInstance().createSupportTicket(title, content, 'Technical Problem');
                    Toast.show("Ticket opened successfully.", "success");
                    this._loadData();
                } catch (e) {
                    Toast.show("Failed to create ticket.", "error");
                }
            });
        }

        this._bindCardClicks();
    }

    private _bindCardClicks(): void {
        const root = this._uiManager.container;
        root.querySelectorAll('.msg-card').forEach(card => {
            card.addEventListener('click', async (e) => {
                const id = (e.currentTarget as HTMLElement).getAttribute('data-msg-id');
                if (id) {
                    this._audioManager.playClick();
                    
                    // Simulate opening a detailed view by marking as read locally
                    await MessageCenterService.getInstance().markAsRead(id);
                    
                    // Update UI immediately
                    this._items.forEach(i => {
                        if (i.id === id) {
                            if (i.type === 'support') (i as SupportTicket).unreadSupportMessagesCount = 0;
                            else i.read = true;
                        }
                    });
                    
                    Toast.show("Message marked as read.", "success");
                    this.render();
                }
            });
        });
    }
}
