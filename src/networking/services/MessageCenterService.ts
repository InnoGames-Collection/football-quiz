export type MessageCategory = 
    | 'Announcement' | 'Tournament' | 'Reward' | 'Subscription' 
    | 'Promotion' | 'Reminder' | 'Maintenance' | 'Support' 
    | 'Security' | 'System' | 'Referral' | 'Leaderboard' 
    | 'Achievement' | 'General' | 'Technical Problem' | 'Payment' 
    | 'General Inquiry' | 'Bug Report' | 'Feature Request';

export type Priority = 'High' | 'Normal' | 'Low';

export interface BaseMessage {
    id: string;
    title: string;
    content: string;
    category: MessageCategory;
    priority: Priority;
    createdAt: string;
    read: boolean;
    archived: boolean;
    deleted: boolean;
}

export interface Announcement extends BaseMessage {
    type: 'announcement';
    shortDescription: string;
    publishDate: string;
    expiryDate: string;
    bannerImage?: string;
    readCount: number;
    pinned: boolean;
    active: boolean;
}

export interface PersonalMessage extends BaseMessage {
    type: 'personal';
    sender: string; // 'System', 'Admin', etc.
    readDate?: string;
    attachmentUrl?: string;
    deepLink?: string;
}

export interface SupportMessage {
    id: string;
    text: string;
    sender: 'user' | 'support';
    timestamp: number;
    read: boolean;
}

export interface SupportTicket extends BaseMessage {
    type: 'support';
    status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
    category: 'Technical Problem' | 'Subscription' | 'Reward' | 'Tournament' | 'Payment' | 'General Inquiry' | 'Bug Report' | 'Feature Request';
    unreadSupportMessagesCount: number;
    messages: SupportMessage[];
}

export type MessageCenterItem = Announcement | PersonalMessage | SupportTicket;

type Listener = (count: number) => void;

export class MessageCenterService {
    private static instance: MessageCenterService;
    private listeners: Listener[] = [];
    
    // In-memory cache synced with localStorage
    private announcements: Announcement[] = [];
    private personalMessages: PersonalMessage[] = [];
    private supportTickets: SupportTicket[] = [];

    private constructor() {
        this._loadFromCache();
        if (this.announcements.length === 0 && this.personalMessages.length === 0) {
            this._generateMockData();
            this._saveToCache();
        }
    }

    public static getInstance(): MessageCenterService {
        if (!MessageCenterService.instance) {
            MessageCenterService.instance = new MessageCenterService();
        }
        return MessageCenterService.instance;
    }

    public subscribeToBadgeUpdates(listener: Listener): () => void {
        this.listeners.push(listener);
        listener(this.getTotalUnreadCount());
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private _notifyListeners() {
        const count = this.getTotalUnreadCount();
        this.listeners.forEach(l => l(count));
    }

    public getTotalUnreadCount(): number {
        return this.announcements.filter(a => !a.read && !a.deleted).length + 
               this.personalMessages.filter(p => !p.read && !p.deleted).length +
               this.supportTickets.filter(s => s.unreadSupportMessagesCount > 0 && !s.deleted).length;
    }

    // ==========================================
    // MOCK API ENDPOINTS
    // ==========================================

    public async getAnnouncements(): Promise<Announcement[]> {
        await this._simulateNetwork();
        return this.announcements.filter(a => !a.deleted).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    public async getPersonalMessages(): Promise<PersonalMessage[]> {
        await this._simulateNetwork();
        return this.personalMessages.filter(p => !p.deleted && !p.archived).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    public async getSupportTickets(): Promise<SupportTicket[]> {
        await this._simulateNetwork();
        return this.supportTickets.filter(s => !s.deleted).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    public async markAsRead(id: string): Promise<void> {
        let found = false;
        [this.announcements, this.personalMessages].forEach(list => {
            const item = list.find(i => i.id === id);
            if (item && !item.read) {
                item.read = true;
                if (item.type === 'personal') (item as PersonalMessage).readDate = new Date().toISOString();
                found = true;
            }
        });
        
        const ticket = this.supportTickets.find(t => t.id === id);
        if (ticket && ticket.unreadSupportMessagesCount > 0) {
            ticket.unreadSupportMessagesCount = 0;
            ticket.read = true;
            found = true;
        }

        if (found) {
            this._saveToCache();
            this._notifyListeners();
        }
    }

    public async createSupportTicket(title: string, content: string, category: SupportTicket['category']): Promise<SupportTicket> {
        await this._simulateNetwork();
        const ticket: SupportTicket = {
            id: `sup_${Date.now()}`,
            type: 'support',
            title,
            content,
            category,
            priority: 'Normal',
            status: 'Open',
            unreadSupportMessagesCount: 0,
            messages: [{ id: Date.now().toString(), text: content, sender: 'user', timestamp: Date.now(), read: true }],
            createdAt: new Date().toISOString(),
            read: true,
            archived: false,
            deleted: false
        };
        this.supportTickets.unshift(ticket);
        this._saveToCache();
        this._notifyListeners();
        return ticket;
    }

    public async replyToSupportTicket(id: string, text: string): Promise<void> {
        await this._simulateNetwork();
        const ticket = this.supportTickets.find(t => t.id === id);
        if (ticket) {
            ticket.messages.push({
                id: Date.now().toString(),
                text,
                sender: 'user',
                timestamp: Date.now(),
                read: true
            });
            this._saveToCache();
        }
    }

    // ==========================================
    // CACHING & UTILS
    // ==========================================

    private async _simulateNetwork(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 600));
    }

    private _loadFromCache(): void {
        try {
            const data = localStorage.getItem('ETHIO_MESSAGE_CENTER_CACHE');
            if (data) {
                const parsed = JSON.parse(data);
                this.announcements = parsed.announcements || [];
                this.personalMessages = parsed.personalMessages || [];
                this.supportTickets = parsed.supportTickets || [];
            }
        } catch (e) {
            console.error('Failed to load message cache', e);
        }
    }

    private _saveToCache(): void {
        try {
            localStorage.setItem('ETHIO_MESSAGE_CENTER_CACHE', JSON.stringify({
                announcements: this.announcements,
                personalMessages: this.personalMessages,
                supportTickets: this.supportTickets
            }));
        } catch (e) {
            console.error('Failed to save message cache', e);
        }
    }

    private _generateMockData(): void {
        // No mock data generated in production
        this.announcements = [];
        this.personalMessages = [];
        this.supportTickets = [];
    }
}
