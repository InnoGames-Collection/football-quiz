import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { CompetitionRegistry, Competition } from '../../core/quiz/CompetitionRegistry';

export class CompetitionBrowserScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _onSelectCompetition: (comp: Competition) => void;
    private _onClose: () => void;

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        onSelectCompetition: (comp: Competition) => void,
        onClose: () => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onSelectCompetition = onSelectCompetition;
        this._onClose = onClose;
    }

    public render(): void {
        const root = this._uiManager.container;
        const competitions = CompetitionRegistry.getAll();

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto; overflow-y: auto; padding: 30px 20px;">
                <div class="floodlight floodlight-left"></div>
                <div class="floodlight floodlight-right"></div>

                <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 10;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                        <div>
                            <span style="font-size: 11px; font-weight: 800; color: var(--gold-primary); letter-spacing: 2px;">
                                FOOTBALL QUIZ LEAGUE
                            </span>
                            <h1 style="margin: 4px 0 0 0; font-size: 32px; font-weight: 900; color: white;">
                                🏆 SELECT COMPETITION
                            </h1>
                        </div>
                        <button id="comp-close-btn" class="broadcast-btn glass-card" style="color: white; padding: 10px 20px;">
                            ✖ BACK TO HOME
                        </button>
                    </div>

                    <!-- Category Grid -->
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                        gap: 20px;
                    ">
                        ${competitions.map(comp => `
                            <div class="glass-card comp-card" data-id="${comp.id}" style="
                                padding: 20px;
                                cursor: pointer;
                                transition: all 0.25s ease;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                border-color: rgba(255, 215, 0, 0.15);
                            ">
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                        <span style="font-size: 36px;">${comp.badge}</span>
                                        <span style="
                                            font-size: 11px;
                                            font-weight: bold;
                                            padding: 4px 10px;
                                            border-radius: 20px;
                                            background: rgba(255, 215, 0, 0.15);
                                            color: #FFD700;
                                            border: 1px solid rgba(255, 215, 0, 0.3);
                                        ">${comp.questionCount} QUESTIONS</span>
                                    </div>
                                    <h3 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: white;">
                                        ${comp.name}
                                    </h3>
                                    <p style="margin: 0; font-size: 13px; color: #94A3B8; line-height: 1.4;">
                                        ${comp.description}
                                    </p>
                                </div>

                                <button class="broadcast-btn broadcast-btn-gold" style="margin-top: 18px; width: 100%;">
                                    ⚡ KICK OFF MATCH
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <style>
                .comp-card:hover {
                    transform: translateY(-4px);
                    border-color: #FFD700 !important;
                    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.2);
                }
            </style>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;

        root.querySelector('#comp-close-btn')?.addEventListener('click', () => {
            this._audioManager.playClick();
            this._onClose();
        });

        root.querySelectorAll('.comp-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this._audioManager.playClick();
                const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
                if (id) {
                    const comp = CompetitionRegistry.getById(id);
                    if (comp) {
                        this._onSelectCompetition(comp);
                    }
                }
            });
        });
    }
}
