import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { VASService } from '../../networking/vas/VASService';
import type { SubscriptionTier } from '../../networking/supabase/types';
import { DesignSystem } from '../theme/DesignSystem';

export class SubscriptionScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onClose: () => void;
    private _statusMessage: string = '';

    constructor(uiManager: UIManager, audioManager: AudioManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onClose = onClose;
    }

    public render(): void {
        const root = this._uiManager.container;

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 840px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 24px; position: relative;">
                        <div style="text-align: center;">
                            <span style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">
                                ETHIO TELECOM VAS SUBSCRIPTION
                            </span>
                            <h1 style="margin: 4px 0 0 0; font-size: 32px; font-weight: 900; color: var(--fds-text-main);">
                                📡 LEAGUE PASS
                            </h1>
                        </div>
                        <button id="sub-close-btn" style="position: absolute; right: 0; top: 0; background: none; border: none; color: var(--fds-text-main); font-weight: bold; cursor: pointer; font-size: 24px;">✕</button>
                    </div>

                    ${this._statusMessage ? `
                        <div style="
                            background: rgba(34, 197, 94, 0.2);
                            border: 1px solid #22C55E;
                            color: #86EFAC;
                            padding: 14px;
                            border-radius: 12px;
                            margin-bottom: 24px;
                            font-weight: bold;
                        ">${this._statusMessage}</div>
                    ` : ''}

                    <!-- Subscription Tier Cards -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
                        <!-- FREE TIER -->
                        <div class="glass-card" style="padding: 24px; text-align: center;">
                            <div style="font-size: 36px; margin-bottom: 8px;">⚽</div>
                            <h3 style="margin: 0; color: var(--fds-text-main); font-size: var(--fds-font-lg);">FREE PLAN</h3>
                            <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-text-main); margin: 12px 0;">0 ETB <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">/ day</span></div>
                            
                            <ul style="text-align: left; font-size: var(--fds-font-sm); color: var(--fds-text-muted); padding-left: 18px; margin-bottom: 24px; line-height: 1.8;">
                                <li>3 matches per day</li>
                                <li>Basic competitions access</li>
                                <li>Standard leaderboards</li>
                            </ul>

                            ${DesignSystem.Button({ text: 'CURRENT PLAN', variant: 'secondary', fullWidth: true, disabled: true })}
                        </div>

                        <!-- BASIC TIER -->
                        <div class="glass-card" style="padding: 24px; text-align: center; border-color: var(--fds-blue-accent);">
                            <div style="font-size: 36px; margin-bottom: 8px;">⚡</div>
                            <h3 style="margin: 0; color: var(--fds-blue-accent); font-size: var(--fds-font-lg);">DAILY PASS</h3>
                            <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-blue-accent); margin: 12px 0;">2 ETB <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">/ day</span></div>
                            
                            <ul style="text-align: left; font-size: var(--fds-font-sm); color: var(--fds-text-muted); padding-left: 18px; margin-bottom: 24px; line-height: 1.8;">
                                <li>Unlimited solo matches</li>
                                <li>Live 1v1 multiplayer</li>
                                <li>All 15 competitions</li>
                                <li>2x Daily streak bonus</li>
                            </ul>

                            ${DesignSystem.Button({ text: 'SUBSCRIBE (2 ETB/DAY)', variant: 'primary', fullWidth: true, className: 'sub-action-btn', dataAttrs: 'data-tier="basic"' })}
                        </div>

                        <!-- PREMIUM TIER -->
                        <div class="glass-card" style="padding: 24px; text-align: center; border-color: var(--fds-gold-primary); background: rgba(30,41,59,0.85);">
                            <div style="font-size: 36px; margin-bottom: 8px;">👑</div>
                            <h3 style="margin: 0; color: var(--fds-gold-primary); font-size: var(--fds-font-lg);">VIP MONTHLY PASS</h3>
                            <div style="font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-gold-primary); margin: 12px 0;">45 ETB <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">/ month</span></div>
                            
                            <ul style="text-align: left; font-size: var(--fds-font-sm); color: var(--fds-text-muted); padding-left: 18px; margin-bottom: 24px; line-height: 1.8;">
                                <li>Everything in Daily Pass</li>
                                <li>Live Tournament entries</li>
                                <li>VIP Badge & Avatar frame</li>
                                <li>Exclusive CMS Admin preview</li>
                            </ul>

                            ${DesignSystem.Button({ text: 'SUBSCRIBE (45 ETB/MONTH)', variant: 'primary', fullWidth: true, className: 'sub-action-btn', dataAttrs: 'data-tier="premium"' })}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#sub-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        root.querySelectorAll('.sub-action-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                this._audioManager.playClick();
                const tier = (e.currentTarget as HTMLElement).getAttribute('data-tier') as SubscriptionTier;
                const res = await VASService.getInstance().requestSubscription('+251911223344', tier);
                this._statusMessage = `✅ ${res.message}`;
                this.render();
            });
        });
    }
}
