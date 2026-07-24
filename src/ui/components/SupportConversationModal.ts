import { MessageCenterService, SupportTicket, SupportMessage } from '../../networking/services/MessageCenterService';

export class SupportConversationModal {
    private _ticket: SupportTicket;
    private _overlay: HTMLElement | null = null;
    private _onClose: () => void;

    constructor(ticket: SupportTicket, onClose: () => void) {
        this._ticket = ticket;
        this._onClose = onClose;
    }

    public render(): void {
        this._overlay = document.createElement('div');
        this._overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: #020617; z-index: 10000; display: flex; flex-direction: column;
            transform: translateX(100%); transition: transform 0.3s ease;
        `;

        this._overlay.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: rgba(15,23,42,0.9); border-bottom: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;">
                <button id="conv-back-btn" style="background: none; border: none; color: white; font-size: 18px; font-weight: bold; cursor: pointer; padding: 8px; min-width: 48px; min-height: 48px;">←</button>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 800; font-size: 14px; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this._ticket.title}</div>
                    <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">Support Ticket</div>
                </div>
            </div>

            <div id="conv-messages" style="flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px;"></div>

            <div style="display: flex; gap: 8px; padding: 12px 16px; background: rgba(15,23,42,0.9); border-top: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;">
                <input id="conv-input" type="text" placeholder="Type your message..." style="
                    flex: 1; padding: 12px 16px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px; color: white; font-size: 14px; outline: none; min-height: 48px;
                " />
                <button id="conv-send-btn" style="
                    width: 48px; height: 48px; min-width: 48px; border-radius: 50%; border: none;
                    background: linear-gradient(135deg, #22c55e, #15803d); color: white;
                    font-size: 18px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;
                ">➤</button>
            </div>
        `;

        document.body.appendChild(this._overlay);

        // Slide in
        requestAnimationFrame(() => {
            if (this._overlay) this._overlay.style.transform = 'translateX(0)';
        });

        this._renderMessages();
        this._bindEvents();

        // Mark as read immediately silently
        MessageCenterService.getInstance().markAsRead(this._ticket.id).catch(console.error);
        this._ticket.unreadSupportMessagesCount = 0;
    }

    private _renderMessages(): void {
        const container = this._overlay?.querySelector('#conv-messages');
        if (!container) return;
        container.innerHTML = '';

        this._ticket.messages.forEach(msg => {
            const isPlayer = msg.sender === 'user';
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = isPlayer ? 'flex-end' : 'flex-start';

            const timeString = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            wrapper.innerHTML = `
                <div style="
                    max-width: 80%; padding: 12px 16px; border-radius: 16px;
                    ${isPlayer ? 'background: linear-gradient(135deg, #22c55e, #15803d); color: white; border-bottom-right-radius: 4px;' : 'background: rgba(30,41,59,0.9); border: 1px solid rgba(255,255,255,0.1); color: white; border-bottom-left-radius: 4px;'}
                    font-size: 14px; line-height: 1.5; word-wrap: break-word;
                ">${msg.text}</div>
                <div style="font-size: 10px; color: #64748B; margin-top: 4px;">${timeString}</div>
            `;
            container.appendChild(wrapper);
        });

        container.scrollTop = container.scrollHeight;
    }

    private _bindEvents(): void {
        this._overlay?.querySelector('#conv-back-btn')?.addEventListener('click', () => {
            (window as any).ethioAudio?.playClick();
            this.close();
        });

        const input = this._overlay?.querySelector('#conv-input') as HTMLInputElement;
        const sendBtn = this._overlay?.querySelector('#conv-send-btn') as HTMLButtonElement;

        const send = async () => {
            const text = input.value.trim();
            if (!text) return;
            (window as any).ethioAudio?.playClick();
            
            // Add locally
            const newMsg: SupportMessage = {
                id: Date.now().toString(),
                text,
                sender: 'user',
                timestamp: Date.now(),
                read: true
            };
            this._ticket.messages.push(newMsg);
            input.value = '';
            this._renderMessages();

            try {
                await MessageCenterService.getInstance().replyToSupportTicket(this._ticket.id, text);
            } catch (e) {
                console.error('Failed to reply', e);
            }
        };

        sendBtn?.addEventListener('click', send);
        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') send();
        });
    }

    public close(): void {
        if (this._overlay) {
            this._overlay.style.transform = 'translateX(100%)';
            setTimeout(() => {
                this._overlay?.remove();
                this._overlay = null;
                this._onClose();
            }, 300);
        }
    }
}
