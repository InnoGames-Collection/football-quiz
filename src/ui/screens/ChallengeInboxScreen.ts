import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { ChallengeService } from '../../networking/multiplayer/ChallengeService';
import type { ChallengeRow } from '../../networking/supabase/types';
import { DesignSystem } from '../theme/DesignSystem';

export class ChallengeInboxScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onClose: () => void;
    private _challenges: ChallengeRow[] = [];

    constructor(uiManager: UIManager, audioManager: AudioManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        this._challenges = await ChallengeService.getInstance().getPendingChallenges('local-user');

        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 600px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 24px; position: relative;">
                        <div style="text-align: center;">
                            <span style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">
                                ASYNC MULTIPLAYER
                            </span>
                            <h1 style="margin: 4px 0 0 0; font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-text-main);">
                                📩 CHALLENGE INBOX (${this._challenges.length})
                            </h1>
                        </div>
                        <button id="ch-close-btn" style="position: absolute; right: 0; top: 0; background: none; border: none; color: var(--fds-text-main); font-weight: bold; cursor: pointer; font-size: 24px;">✕</button>
                    </div>

                    ${this._challenges.length === 0 ? `
                        <div class="glass-card" style="padding: 40px; text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 12px;">📭</div>
                            <h3 style="margin: 0 0 8px 0; color: var(--fds-text-main);">No Pending Challenges</h3>
                            <p style="color: var(--fds-text-dim); font-size: var(--fds-font-sm);">
                                Challenge your friends after playing a solo match to compare scores!
                            </p>
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 14px;">
                            ${this._challenges.map((c, idx) => `
                                <div class="glass-card" style="
                                    padding: 18px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                ">
                                    <div>
                                        <div style="font-weight: bold; color: var(--fds-text-main);">📩 Challenge #${idx + 1}</div>
                                        <div style="font-size: var(--fds-font-xs); color: var(--fds-text-dim);">Status: ${c.status} | Expires: ${c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '48h'}</div>
                                    </div>
                                    ${DesignSystem.Button({ text: 'ACCEPT & PLAY', variant: 'primary', icon: '⚡' })}
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;

        root.querySelector('#ch-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });
    }
}
