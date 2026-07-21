import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { CompetitionRegistry } from '../../core/quiz/CompetitionRegistry';

export class AdminPanelScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onClose: () => void;

    constructor(uiManager: UIManager, audioManager: AudioManager, onClose: () => void) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onClose = onClose;
    }

    public render(): void {
        const root = this._uiManager.container;
        const competitions = CompetitionRegistry.getAll();

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 40px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 800px; margin: 0 auto; z-index: 10; relative;">
                    <!-- Admin Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <div>
                            <span style="font-size: 12px; font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">ETHIO TELECOM VAS PORTAL</span>
                            <h1 style="margin: 4px 0 0 0; font-size: 32px; font-weight: 900; color: white;">⚙️ ADMIN DASHBOARD</h1>
                        </div>
                        <button id="admin-close-btn" class="broadcast-btn glass-card" style="color: white; padding: 10px 20px;">
                            ✖ CLOSE
                        </button>
                    </div>

                    <!-- Platform Analytics Summary Cards -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 16px; margin-bottom: 30px;">
                        <div class="glass-card" style="padding: 16px; border-color: rgba(34,197,94,0.3);">
                            <div style="font-size: 12px; color: var(--text-muted);">ACTIVE PLAYERS</div>
                            <div style="font-size: 26px; font-weight: 900; color: var(--pitch-green); margin-top: 4px;">124,500</div>
                        </div>

                        <div class="glass-card" style="padding: 16px; border-color: rgba(255,215,0,0.3);">
                            <div style="font-size: 12px; color: var(--text-muted);">MATCHES PLAYED</div>
                            <div style="font-size: 26px; font-weight: 900; color: var(--gold-primary); margin-top: 4px;">1.85 M</div>
                        </div>

                        <div class="glass-card" style="padding: 16px; border-color: rgba(96,165,250,0.3);">
                            <div style="font-size: 12px; color: var(--text-muted);">ACTIVE COMPETITIONS</div>
                            <div style="font-size: 26px; font-weight: 900; color: #60A5FA; margin-top: 4px;">${competitions.length}</div>
                        </div>
                    </div>

                    <!-- Add Competition Form -->
                    <div class="glass-card" style="padding: 24px; margin-bottom: 30px;">
                        <h3 style="margin: 0 0 16px 0; font-size: 18px; color: var(--gold-primary);">➕ ADD NEW COMPETITION</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                            <input id="admin-comp-name" type="text" placeholder="Competition Name (e.g. La Liga)" style="
                                padding: 12px;
                                background: rgba(0,0,0,0.4);
                                border: 1px solid var(--glass-border);
                                border-radius: 8px;
                                color: white;
                            " />
                            <input id="admin-comp-badge" type="text" placeholder="Badge Emoji (e.g. 🇪🇸)" style="
                                padding: 12px;
                                background: rgba(0,0,0,0.4);
                                border: 1px solid var(--glass-border);
                                border-radius: 8px;
                                color: white;
                            " />
                        </div>
                        <input id="admin-comp-desc" type="text" placeholder="Short Description" style="
                            width: 100%;
                            padding: 12px;
                            background: rgba(0,0,0,0.4);
                            border: 1px solid var(--glass-border);
                            border-radius: 8px;
                            color: white;
                            margin-bottom: 14px;
                            box-sizing: border-box;
                        " />
                        <button id="admin-add-comp-btn" class="broadcast-btn broadcast-btn-green" style="width: 100%;">
                            SAVE & PUBLISH COMPETITION
                        </button>
                    </div>

                    <!-- Competition List -->
                    <div class="glass-card" style="padding: 24px;">
                        <h3 style="margin: 0 0 16px 0; font-size: 18px; color: white;">🏆 MANAGED COMPETITIONS (${competitions.length})</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${competitions.map(c => `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    padding: 12px 16px;
                                    background: rgba(0,0,0,0.3);
                                    border: 1px solid var(--glass-border);
                                    border-radius: 8px;
                                ">
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="font-size: 22px;">${c.badge}</span>
                                        <div>
                                            <div style="font-weight: bold; color: white;">${c.name}</div>
                                            <div style="font-size: 12px; color: var(--text-muted);">${c.description}</div>
                                        </div>
                                    </div>
                                    <span style="font-size: 12px; color: var(--gold-primary); font-weight: bold;">${c.questionCount} QUESTIONS</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        document.getElementById('admin-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        document.getElementById('admin-add-comp-btn')?.addEventListener('click', () => {
            const nameEl = document.getElementById('admin-comp-name') as HTMLInputElement;
            const badgeEl = document.getElementById('admin-comp-badge') as HTMLInputElement;
            const descEl = document.getElementById('admin-comp-desc') as HTMLInputElement;

            if (nameEl && nameEl.value.trim() !== '') {
                const id = nameEl.value.toLowerCase().replace(/\s+/g, '-');
                CompetitionRegistry.addCompetition({
                    id,
                    name: nameEl.value.trim(),
                    badge: badgeEl.value.trim() || '⚽',
                    description: descEl.value.trim() || 'Custom Competition',
                    color: '#1e3a8a',
                    questionCount: 10
                });

                this._audioManager.playClick();
                alert(`Competition '${nameEl.value.trim()}' Published Successfully!`);
                this.render();
            }
        });
    }
}
