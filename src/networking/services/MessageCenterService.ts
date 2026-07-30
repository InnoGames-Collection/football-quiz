import { supabase } from '../supabase/SupabaseClient';
import type { MessageRow, MessageChannel } from '../supabase/types';
import { i18n } from '../../localization/i18n';

export interface MessageCenterItem {
    id: string;
    title: string;
    content: string;
    category: string;
    priority: 'High' | 'Normal' | 'Low';
    createdAt: string;
    read: boolean;
}

type Listener = (count: number) => void;

export class MessageCenterService {
    private static instance: MessageCenterService;
    private listeners: Listener[] = [];
    private unreadCount: number = 0;
    
    private constructor() {
        this._initRealtime();
        this._fetchUnreadCount();
    }
    
    public static getInstance(): MessageCenterService {
        if (!MessageCenterService.instance) {
            MessageCenterService.instance = new MessageCenterService();
        }
        return MessageCenterService.instance;
    }

    public subscribeToBadgeUpdates(listener: Listener): () => void {
        this.listeners.push(listener);
        listener(this.unreadCount);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    private _notifyListeners() {
        this.listeners.forEach(l => l(this.unreadCount));
    }
    
    private async _fetchUnreadCount(): Promise<void> {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Count unread direct or system messages for the user, plus unread global announcements
        const { count, error } = await supabase.from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('read', false)
            .or(`recipient_id.eq.${user.id},channel.eq.global`);
            
        if (!error && count !== null) {
            this.unreadCount = count;
            this._notifyListeners();
        }
    }

    private _initRealtime() {
        if (!supabase) return;
        supabase.channel('public:messages')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
                this._fetchUnreadCount();
            })
            .subscribe();
    }
    
    public getTotalUnreadCount(): number {
        return this.unreadCount;
    }
    
    private _mapRow(row: MessageRow): MessageCenterItem {
        const locale = i18n.currentLocale;
        let content = row.body_en;
        if (locale === 'am' && row.body_am) content = row.body_am;
        if (locale === 'om' && row.body_om) content = row.body_om;
        
        let title = 'Message';
        if (row.channel === 'global') title = 'Announcement';
        else if (row.channel === 'system') title = 'System Update';
        else if (row.channel === 'direct') title = 'Direct Message';
        
        return {
            id: row.id,
            title,
            content,
            category: row.channel,
            priority: row.channel === 'global' ? 'High' : 'Normal',
            createdAt: row.created_at,
            read: row.read
        };
    }
    
    private async _fetchByChannel(channel: MessageChannel): Promise<MessageCenterItem[]> {
        if (!supabase) return [];
        const { data: { user } } = await supabase.auth.getUser();
        
        let query = supabase.from('messages').select('*').eq('channel', channel).order('created_at', { ascending: false }).limit(50);
        
        if (channel === 'direct' || channel === 'system') {
            if (!user) return [];
            query = query.eq('recipient_id', user.id);
        }
        
        const { data, error } = await query;
        if (error || !data) return [];
        return data.map(r => this._mapRow(r));
    }
    
    public async getAllMessages(): Promise<MessageCenterItem[]> {
        if (!supabase) return [];
        const { data: { user } } = await supabase.auth.getUser();
        let query = supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(100);
        
        if (user) {
            query = query.or(`recipient_id.eq.${user.id},channel.eq.global`);
        } else {
            query = query.eq('channel', 'global');
        }
        
        const { data, error } = await query;
        if (error || !data) return [];
        return data.map(r => this._mapRow(r));
    }
    
    public async getAnnouncements(): Promise<MessageCenterItem[]> {
        return this._fetchByChannel('global');
    }
    
    public async getPersonalMessages(): Promise<MessageCenterItem[]> {
        return this._fetchByChannel('direct');
    }
    
    public async getSupportTickets(): Promise<MessageCenterItem[]> {
        return this._fetchByChannel('system');
    }
    
    public async markAsRead(id: string): Promise<void> {
        if (!supabase) return;
        const { error } = await supabase.from('messages').update({ read: true }).eq('id', id);
        if (!error) {
            this._fetchUnreadCount();
        }
    }
}
