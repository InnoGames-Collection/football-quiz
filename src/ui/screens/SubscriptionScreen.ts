import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { VASService } from '../../networking/vas/VASService';
import type { SubscriptionTier } from '../../networking/supabase/types';

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
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div>
                            <span style="font-size: 11px; font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">
                                ETHIO TELECOM VAS SUBSCRIPTION
                            </span>
                            <h1 style="margin: 4px 0 0 0; font-size: 32px; font-weight: 900; color: white;">
                                📡 LEAGUE PASS & SUBSCRIPTIONS
                            </h1>
                        </div>
                        <button id="sub-close-btn" class="broadcast-btn glass-card" style="color: white; padding: 10px 20px;">
                            ✖ CLOSE
                        </button>
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
                            <h3 style="margin: 0; color: white; font-size: 20px;">FREE PLAN</h3>
                            <div style="font-size: 28px; font-weight: 900; color: white; margin: 12px 0;">0 ETB <span style="font-size: 12px; color: #94A3B8;">/ day</span></div>
                            
                            <ul style="text-align: left; font-size: 13px; color: #CBD5E1; padding-left: 18px; margin-bottom: 24px; line-height: 1.8;">
                                <li>3 matches per day</li>
                                <li>Basic competitions access</li>
                                <li>Standard leaderboards</li>
                            </ul>

                            <button class="broadcast-btn glass-card" style="width: 100%; color: white;" disabled>CURRENT PLAN</button>
                        </div>

                        <!-- BASIC TIER -->
                        <div class="glass-card" style="padding: 24px; text-align: center; border-color: #60A5FA;">
                            <div style="font-size: 36px; margin-bottom: 8px;">⚡</div>
                            <h3 style="margin: 0; color: #60A5FA; font-size: 20px;">DAILY PASS</h3>
                            <div style="font-size: 28px; font-weight: 900; color: #60A5FA; margin: 12px 0;">2 ETB <span style="font-size: 12px; color: #94A3B8;">/ day</span></div>
                            
                            <ul style="text-align: left; font-size: 13px; color: #CBD5E1; padding-left: 18px; margin-bottom: 24px; line-height: 1.8;">
                                <li>Unlimited solo matches</li>
                                <li>Live 1v1 multiplayer</li>
                                <li>All 15 competitions</li>
                                <li>2x Daily streak bonus</li>
                            </ul>

                            <button class="broadcast-btn broadcast-btn-green sub-action-btn" data-tier="basic" style="width: 100%;">
                                SUBSCRIBE (2 ETB/DAY)
                            </button>
                        </div>

                        <!-- PREMIUM TIER -->
                        <div class="glass-card" style="padding: 24px; text-align: center; border-color: #FFD700; background: rgba(30,41,59,0.85);">
                            <div style="font-size: 36px; margin-bottom: 8px;">👑</div>
                            <h3 style="margin: 0; color: #FFD700; font-size: 20px;">VIP MONTHLY PASS</h3>
                            <div style="font-size: 28px; font-weight: 900; color: #FFD700; margin: 12px 0;">45 ETB <span style="font-size: 12px; color: #94A3B8;">/ month</span></div>
                            
                            <ul style="text-align: left; font-size: 13px; color: #CBD5E1; padding-left: 18px; margin-bottom: 24px; line-height: 1.8;">
                                <li>Everything in Daily Pass</li>
                                <li>Live Tournament entries</li>
                                <li>VIP Badge & Avatar frame</li>
                                <li>Exclusive CMS Admin preview</li>
                            </ul>

                            <button class="broadcast-btn broadcast-btn-gold sub-action-btn" data-tier="premium" style="width: 100%;">
                                SUBSCRIBE (45 ETB/MONTH)
                            </button>
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
