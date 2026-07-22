import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { TournamentManager } from '../../core/competition/TournamentManager';
import type { TournamentRow } from '../../networking/supabase/types';
import { DesignSystem } from '../theme/DesignSystem';

export class TournamentLobbyScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onClose: () => void;
    private _tournaments: TournamentRow[] = [];

    constructor(uiManager: UIManager, audioManager: AudioManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onClose = onClose;
    }

    public async render(): Promise<void> {
        const root = this._uiManager.container;
        this._tournaments = await TournamentManager.getInstance().getUpcomingTournaments();

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 760px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div>
                            <span style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">
                                SCHEDULED EVENTS
                            </span>
                            <h1 style="margin: 4px 0 0 0; font-size: var(--fds-font-xl); font-weight: 900; color: var(--fds-text-main);">
                                🏟️ LIVE TOURNAMENT LOBBY
                            </h1>
                        </div>
                        ${DesignSystem.Button({ id: 't-close-btn', text: 'CLOSE', icon: '✖', variant: 'secondary' })}
                    </div>

                    <!-- Tournament Cards List -->
                    <div style="display: flex; flex-direction: column; gap: 18px;">
                        ${this._tournaments.map(t => `
                            <div class="glass-card" style="
                                padding: 24px;
                                border-color: rgba(255,215,0,0.3);
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            ">
                                <div>
                                    <div style="font-size: var(--fds-font-xs); color: #86EFAC; font-weight: 800; letter-spacing: 1px; margin-bottom: 4px;">
                                        STATUS: REGISTRATION OPEN
                                    </div>
                                    <h3 style="margin: 0 0 6px 0; font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main);">
                                        ${t.name_en}
                                    </h3>
                                    <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim);">
                                        Prize Pool: <span style="color: var(--fds-gold-primary); font-weight: bold;">🪙 ${t.prize_coins} COINS</span> | Max Players: ${t.max_players}
                                    </div>
                                </div>

                                ${DesignSystem.Button({ text: 'REGISTER NOW', icon: '📝', variant: 'primary', className: 'register-t-btn', dataAttrs: `data-id="${t.id}"` })}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#t-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        root.querySelectorAll('.register-t-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                this._audioManager.playClick();
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                if (id) {
                    await TournamentManager.getInstance().registerForTournament(id, 'local-user');
                    const btn = document.getElementById('btn-register');
                    if (btn) {
                        btn.innerHTML = '✅ REGISTERED SUCCESSFULLY';
                        btn.style.background = 'var(--tv-pitch-green)';
                        btn.setAttribute('disabled', 'true');
                    }
                }
            });
        });
    }
}
