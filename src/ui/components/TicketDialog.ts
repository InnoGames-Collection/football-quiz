import { MessageCenterService } from '../../networking/services/MessageCenterService';
import { Toast } from './Toast';

export class TicketDialog {
    private _overlay: HTMLElement | null = null;
    private _onCreated: () => void;
    private _isSubmitting = false;

    constructor(onCreated: () => void) {
        this._onCreated = onCreated;
    }

    public show(): void {
        this._overlay = document.createElement('div');
        this._overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
            z-index: 9999; display: flex; align-items: flex-end; justify-content: center;
            opacity: 0; transition: opacity 0.2s ease;
        `;

        const sheet = document.createElement('div');
        sheet.style.cssText = `
            width: 100%; max-width: 600px; max-height: 90vh;
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 20px 20px 0 0;
            padding: 24px; overflow-y: auto; pointer-events: auto;
            transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        sheet.innerHTML = `
            <div style="width: 40px; height: 4px; background: rgba(255, 255, 255, 0.2); border-radius: 2px; margin: 0 auto 20px;"></div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
                <span style="font-size: 28px;">⚽</span>
                <div>
                    <h2 style="margin: 0; font-size: 20px; font-weight: 900; color: white;">Create Support Ticket</h2>
                    <p style="margin: 2px 0 0; font-size: 12px; color: #94A3B8;">Our team will respond within 24 hours</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 18px;">
                <div>
                    <label style="font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-bottom: 6px; display: block;">Subject *</label>
                    <input id="ticket-subject" type="text" maxlength="100" placeholder="Brief description of your issue" style="
                        width: 100%; padding: 14px 16px; background: rgba(0,0,0,0.4); min-height: 48px;
                        border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white;
                        font-size: 14px; outline: none; box-sizing: border-box;
                    " />
                    <div id="err-subject" style="font-size: 12px; color: #EF4444; margin-top: 4px; display: none;"></div>
                </div>

                <div>
                    <label style="font-size: 12px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-bottom: 6px; display: block;">Description *</label>
                    <textarea id="ticket-desc" maxlength="1000" placeholder="Please describe your issue in detail..." style="
                        width: 100%; padding: 14px 16px; background: rgba(0,0,0,0.4); min-height: 120px;
                        border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white;
                        font-size: 14px; outline: none; box-sizing: border-box; resize: vertical;
                    "></textarea>
                    <div id="err-desc" style="font-size: 12px; color: #EF4444; margin-top: 4px; display: none;"></div>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 8px;">
                    <button id="ticket-cancel" style="
                        flex: 1; min-height: 48px; background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
                        color: #94A3B8; font-weight: 700; cursor: pointer;
                    ">Cancel</button>
                    <button id="ticket-submit" style="
                        flex: 1; min-height: 48px; background: linear-gradient(135deg, #22c55e, #15803d);
                        border: none; border-radius: 12px;
                        color: white; font-weight: 900; cursor: pointer;
                        box-shadow: 0 4px 12px rgba(34,197,94,0.3);
                    ">Submit Ticket</button>
                </div>
            </div>
        `;

        this._overlay.appendChild(sheet);
        document.body.appendChild(this._overlay);

        // Trigger animations
        requestAnimationFrame(() => {
            if (this._overlay) {
                this._overlay.style.opacity = '1';
                sheet.style.transform = 'translateY(0)';
            }
        });

        this._bindEvents(sheet);
    }

    private _bindEvents(sheet: HTMLElement): void {
        this._overlay?.addEventListener('click', (e) => {
            if (e.target === this._overlay) this.close();
        });

        sheet.querySelector('#ticket-cancel')?.addEventListener('click', () => {
            (window as any).ethioAudio?.playClick();
            this.close();
        });

        sheet.querySelector('#ticket-submit')?.addEventListener('click', () => {
            this._handleSubmit(sheet);
        });
    }

    private async _handleSubmit(sheet: HTMLElement): Promise<void> {
        if (this._isSubmitting) return;

        const subjectInput = sheet.querySelector('#ticket-subject') as HTMLInputElement;
        const descInput = sheet.querySelector('#ticket-desc') as HTMLTextAreaElement;
        const errSubject = sheet.querySelector('#err-subject') as HTMLElement;
        const errDesc = sheet.querySelector('#err-desc') as HTMLElement;
        const submitBtn = sheet.querySelector('#ticket-submit') as HTMLButtonElement;

        const subject = subjectInput.value.trim();
        const desc = descInput.value.trim();

        let valid = true;
        errSubject.style.display = 'none';
        errDesc.style.display = 'none';

        if (subject.length < 3) { errSubject.textContent = 'Subject must be at least 3 characters'; errSubject.style.display = 'block'; valid = false; }
        if (desc.length < 10) { errDesc.textContent = 'Description must be at least 10 characters'; errDesc.style.display = 'block'; valid = false; }

        if (!valid) return;

        this._isSubmitting = true;
        submitBtn.textContent = 'Submitting...';
        submitBtn.style.opacity = '0.7';
        (window as any).ethioAudio?.playClick();

        try {
            await MessageCenterService.getInstance().createSupportTicket(subject, desc, 'Technical Problem');
            Toast.show("Support ticket submitted successfully.", "success");
            this.close();
            this._onCreated();
        } catch (e) {
            Toast.show("Failed to create ticket.", "error");
            submitBtn.textContent = 'Submit Ticket';
            submitBtn.style.opacity = '1';
            this._isSubmitting = false;
        }
    }

    public close(): void {
        if (this._overlay) {
            this._overlay.style.opacity = '0';
            const sheet = this._overlay.querySelector('div') as HTMLElement;
            if (sheet) sheet.style.transform = 'translateY(100%)';
            setTimeout(() => {
                this._overlay?.remove();
                this._overlay = null;
            }, 300);
        }
    }
}
