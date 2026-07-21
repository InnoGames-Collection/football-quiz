import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { ChallengeService } from '../../networking/multiplayer/ChallengeService';
import type { ChallengeRow } from '../../networking/supabase/types';

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
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 600px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div>
                            <span style="font-size: 11px; font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">
                                ASYNC MULTIPLAYER
                            </span>
                            <h1 style="margin: 4px 0 0 0; font-size: 28px; font-weight: 900; color: white;">
                                📩 CHALLENGE INBOX (${this._challenges.length})
                            </h1>
                        </div>
                        <button id="ch-close-btn" class="broadcast-btn glass-card" style="color: white; padding: 10px 20px;">
                            ✖ CLOSE
                        </button>
                    </div>

                    ${this._challenges.length === 0 ? `
                        <div class="glass-card" style="padding: 40px; text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 12px;">📭</div>
                            <h3 style="margin: 0 0 8px 0; color: white;">No Pending Challenges</h3>
                            <p style="color: #94A3B8; font-size: 13px;">
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
                                        <div style="font-weight: bold; color: white;">📩 Challenge #${idx + 1}</div>
                                        <div style="font-size: 12px; color: #94A3B8;">Status: ${c.status} | Expires: ${c.expires_at ? new Date(c.expires_at).toLocaleDateString() : '48h'}</div>
                                    </div>
                                    <button class="broadcast-btn broadcast-btn-green" style="padding: 10px 18px;">
                                        ⚡ ACCEPT & PLAY
                                    </button>
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
