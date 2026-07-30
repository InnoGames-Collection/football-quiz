import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { i18n } from '../../localization/i18n';
import { MessageCenterService, MessageCenterItem } from '../../networking/services/MessageCenterService';

export type MessageTab = 'announcements' | 'personal' | 'support';
export type MessageFilter = 'all' | 'unread' | 'high-priority' | 'reward' | 'tournament';

export class MessageCenterScreen {
    private _currentTab: MessageTab = 'announcements';
    private _currentFilter: MessageFilter = 'all';
    private _messages: MessageCenterItem[] = [];
    private _activeOverlay: HTMLElement | null = null;
    private _isOpeningMessage: boolean = false;
    private _isLayoutRendered: boolean = false;
    private _currentRequestId: number = 0;

    constructor(
        private _uiManager: UIManager,
        private _audioManager: AudioManager,
        private _onBack: () => void
    ) {}

    public async render(): Promise<void> {
        if (!this._isLayoutRendered) {
            this._renderLayout();
            this._bindEvents();
            this._isLayoutRendered = true;
        } else {
            this._updateTabUI();
            this._updateFilterUI();
        }

        await this._updateContent();
    }

    private _renderLayout(): void {
        const root = this._uiManager.container;
        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="display: flex; flex-direction: column;">
                <!-- Header -->
                <div style="padding: 24px 20px; display: flex; align-items: center; background: rgba(0,0,0,0.4); border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; z-index: 10;">
                    <button id="mc-back-btn" style="
                        background: rgba(255,255,255,0.1); border: none; width: 40px; height: 40px; 
                        border-radius: 20px; color: white; font-size: 20px; cursor: pointer;
                        display: flex; align-items: center; justify-content: center;
                    ">←</button>
                    <div style="flex: 1; text-align: center;">
                        <h1 style="font-size: var(--fds-font-lg); font-weight: 900; margin: 0; color: var(--tv-gold-primary); text-transform: uppercase; letter-spacing: 1px;">
                            ${i18n.currentLocale === 'am' ? 'መልዕክቶች' : 'MESSAGES'}
                        </h1>
                    </div>
                    <div style="width: 40px;"></div>
                </div>

                <!-- Tabs -->
                <div class="mc-tab-bar">
                    ${this._renderTabHtml('announcements', '📢 Announcements')}
                    ${this._renderTabHtml('personal', '📩 Inbox')}
                    ${this._renderTabHtml('support', '🎧 Support')}
                </div>

                <!-- Filter Chips -->
                <div class="filter-chip-bar" id="mc-filter-bar">
                    ${this._renderFilterChipsHtml()}
                </div>

                <!-- Message List -->
                <div id="mc-list-container" style="flex: 1; overflow-y: auto; padding-top: 8px; padding-bottom: 40px;">
                    <!-- Messages injected here -->
                </div>
            </div>
        `;
        this._updateTabUI();
    }

    private _updateTabUI(): void {
        const count = MessageCenterService.getInstance().getTotalUnreadCount();
        const tabs = this._uiManager.container.querySelectorAll('.mc-tab');
        
        tabs.forEach(tab => {
            const tabId = tab.getAttribute('data-tab');
            if (tabId === this._currentTab) {
                tab.classList.add('mc-tab-active');
            } else {
                tab.classList.remove('mc-tab-active');
            }
            
            // Update badge (only Inbox shows total unread for simplicity in mock)
            const badgeContainer = tab.querySelector('.badge-container');
            if (badgeContainer) {
                const unreadCount = tabId === 'personal' ? count : 0;
                badgeContainer.innerHTML = unreadCount > 0 ? `<div class="mc-tab-badge">${unreadCount}</div>` : '';
            }
        });
    }

    private _updateFilterUI(): void {
        const chips = this._uiManager.container.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            const filterId = chip.getAttribute('data-filter');
            if (filterId === this._currentFilter) {
                chip.classList.add('filter-chip-active');
            } else {
                chip.classList.remove('filter-chip-active');
            }
        });
    }

    private async _updateContent(): Promise<void> {
        const requestId = ++this._currentRequestId;
        
        const container = document.getElementById('mc-list-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="height: 80px; background: rgba(255,255,255,0.03); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                    <div style="height: 80px; background: rgba(255,255,255,0.03); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                    <div style="height: 80px; background: rgba(255,255,255,0.03); border-radius: 12px; animation: shimmer 1.5s infinite linear;"></div>
                </div>
            `;
        }

        try {
            await this._fetchData();
        } catch (e) {
            console.error('Failed to fetch messages', e);
            if (this._currentRequestId === requestId && container) {
                container.innerHTML = `
                    <div style="padding: 40px; text-align: center;">
                        <div style="font-size: 40px; margin-bottom: 16px;">⚠️</div>
                        <div style="color: #EF4444; font-weight: bold; margin-bottom: 12px;">Failed to load messages</div>
                        <button id="retry-btn" style="padding: 10px 24px; border-radius: 20px; background: var(--tv-gold-primary); color: #000; font-weight: bold; border: none;">Try Again</button>
                    </div>
                `;
                document.getElementById('retry-btn')?.addEventListener('click', () => {
                    this._audioManager.playClick();
                    this._updateContent();
                });
            }
            return;
        }

        if (this._currentRequestId !== requestId) return;

        this._updateTabUI(); // Update badges in case data fetched changes unread count
        this._renderMessages();
    }

    private async _fetchData(): Promise<void> {
        const svc = MessageCenterService.getInstance();
        if (this._currentTab === 'announcements') {
            this._messages = await svc.getAnnouncements();
        } else if (this._currentTab === 'personal') {
            this._messages = await svc.getPersonalMessages();
        } else if (this._currentTab === 'support') {
            this._messages = await svc.getSupportTickets();
        }
    }

    private _renderTabHtml(tab: MessageTab, label: string): string {
        return `
            <div class="mc-tab" data-tab="${tab}">
                ${label}
                <span class="badge-container"></span>
            </div>
        `;
    }

    private _renderFilterChipsHtml(): string {
        const filters: { id: MessageFilter, label: string }[] = [
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'high-priority', label: 'Urgent' },
            { id: 'tournament', label: 'Tournaments' },
            { id: 'reward', label: 'Rewards' }
        ];

        return filters.map(f => `
            <div class="filter-chip" data-filter="${f.id}">
                ${f.label}
            </div>
        `).join('');
    }

    private _renderMessages(): void {
        const container = document.getElementById('mc-list-container');
        if (!container) return;

        if (this._currentTab === 'support') {
            container.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--fds-text-dim);">Support ticketing coming soon...</div>`;
            return;
        }

        let filtered = this._messages;
        if (this._currentFilter === 'unread') {
            filtered = filtered.filter(m => !m.read);
        } else if (this._currentFilter === 'high-priority') {
            filtered = filtered.filter(m => m.priority === 'High');
        } else if (this._currentFilter !== 'all') {
            // Very loose filtering for mock
            filtered = filtered.filter(m => m.category.toLowerCase().includes(this._currentFilter.toLowerCase()));
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 48px; opacity: 0.5; margin-bottom: 16px;">📭</div>
                    <div style="font-size: var(--fds-font-md); font-weight: 700; color: var(--fds-text-dim);">
                        No messages found.
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(msg => `
            <div class="message-card ${!msg.read ? 'message-card-unread' : ''}" data-id="${msg.id}">
                <div style="display: flex; gap: 16px;">
                    <div style="font-size: 24px; padding-top: 4px;">✉️</div>
                    <div style="flex: 1; overflow: hidden;">
                        <div class="mc-title">
                            ${msg.priority === 'High' ? '<span class="mc-priority-dot"></span>' : ''}
                            ${msg.title}
                        </div>
                        <div class="mc-body-preview">${msg.content}</div>
                        <div class="mc-meta">
                            <span class="mc-category-badge">${msg.category}</span>
                            <span class="mc-time">${this._formatTime(new Date(msg.createdAt).getTime())}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Bind clicks on cards to show full message
        const cards = container.querySelectorAll('.message-card');
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                if (this._isOpeningMessage) return;

                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                if (id) {
                    this._isOpeningMessage = true;
                    this._audioManager.playClick();
                    try {
                        await MessageCenterService.getInstance().markAsRead(id);
                        this._showFullMessage(id);
                    } finally {
                        this._isOpeningMessage = false;
                    }
                }
            });
        });
    }

    private _formatTime(ts: number): string {
        const now = Date.now();
        const diff = now - ts;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        return Math.floor(diff / 86400000) + 'd ago';
    }

    private _showFullMessage(id: string): void {
        if (this._activeOverlay) return;

        const msg = this._messages.find(m => m.id === id);
        if (!msg) return;

        const overlay = document.createElement('div');
        this._activeOverlay = overlay;
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8); z-index: 1000;
            display: flex; align-items: center; justify-content: center;
            padding: 20px;
        `;

        overlay.innerHTML = `
            <div style="background: var(--fds-bg-main); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 400px; padding: 24px; position: relative;">
                <button class="close-btn" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; color: var(--fds-text-dim); font-size: 24px; cursor: pointer;">×</button>
                <div style="font-size: 32px; margin-bottom: 16px;">✉️</div>
                <h2 style="font-size: var(--fds-font-lg); font-weight: 800; color: var(--fds-text-main); margin: 0 0 8px 0;">${msg.title}</h2>
                <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); margin-bottom: 24px;">${new Date(msg.createdAt).toLocaleString()}</div>
                <p style="font-size: var(--fds-font-md); color: var(--fds-text-main); line-height: 1.5; margin: 0;">${msg.content}</p>
            </div>
        `;

        overlay.querySelector('.close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._activeOverlay === overlay) {
                this._activeOverlay = null;
            }
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            this._updateContent(); // Refresh UI cleanly to show updated read status
        });

        document.body.appendChild(overlay);
    }

    private _bindEvents(): void {
        document.getElementById('mc-back-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onBack();
        });

        const tabs = this._uiManager.container.querySelectorAll('.mc-tab');
        tabs.forEach((tab: Element) => {
            tab.addEventListener('click', (e: Event) => {
                const target = e.currentTarget as HTMLElement;
                const tabId = target.getAttribute('data-tab') as MessageTab;
                if (tabId !== this._currentTab) {
                    this._audioManager.playClick();
                    this._currentTab = tabId;
                    this._currentFilter = 'all'; // Reset filter on tab change
                    this.render(); // This now calls our safe layout update and async fetch
                }
            });
        });

        const chips = this._uiManager.container.querySelectorAll('.filter-chip');
        chips.forEach((chip: Element) => {
            chip.addEventListener('click', (e: Event) => {
                const target = e.currentTarget as HTMLElement;
                const filterId = target.getAttribute('data-filter') as MessageFilter;
                if (filterId !== this._currentFilter) {
                    this._audioManager.playClick();
                    this._currentFilter = filterId;
                    
                    this._updateFilterUI();
                    this._renderMessages();
                }
            });
        });
    }
}
