import { DesignSystem } from "../theme/DesignSystem";
import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { GameSessionManager, GameSession } from '../../core/quiz/GameSessionManager';


export interface GameModeInfo {
    id: string;
    name: string;
    icon: string;
    difficulty: string;
    reward: string;
    category: string;
}

const GAME_MODES: GameModeInfo[] = [
    { id: 'quick', name: 'Quick Match', icon: '⚡', difficulty: 'Easy', reward: '+100 XP', category: 'world-cup' },
    { id: 'daily', name: 'Daily Challenge', icon: '📅', difficulty: 'Medium', reward: '+500 XP (1.5x Multiplier)', category: 'ethiopian-premier' },
    { id: 'league', name: 'League Match', icon: '🏆', difficulty: 'Hard', reward: '+300 XP + Division Points', category: 'champions-league' },
    { id: 'tournament', name: 'Tournament', icon: '👑', difficulty: 'Legend', reward: '+1000 XP + Cup Prize', category: 'afcon' },
    { id: 'guess', name: 'Guess Player', icon: '👤', difficulty: 'Medium', reward: '+200 XP', category: 'legendary-players' },
    { id: 'iq', name: 'Football IQ', icon: '🧠', difficulty: 'Hard', reward: '+250 XP', category: 'football-rules' },
    { id: 'penalty', name: 'Penalty Shootout', icon: '⚽', difficulty: 'Easy', reward: '+150 XP', category: 'transfer-market' }
];

export class PlayScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;

    private _onStartMatch: (category: string) => void;
    private _onResumeMatch?: (session: GameSession) => void;
    private _selectedMode: string = 'quick';

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        onStartMatch: (category: string) => void,
        onResumeMatch?: (session: GameSession) => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onStartMatch = onStartMatch;
        this._onResumeMatch = onResumeMatch;
    }

    public render(): void {
        const root = this._uiManager.container;
        root.innerHTML = DesignSystem.LoadingState('Loading match modes...');
        
        setTimeout(() => {
            this._renderActual();
        }, 300);
    }

    private _renderActual(): void {
        const root = this._uiManager.container;
        const activeMode = GAME_MODES.find(m => m.id === this._selectedMode) || GAME_MODES[0];

        // Horizontal selectable modes cards HTML
        const modesHtml = GAME_MODES.map(m => {
            const isSelected = m.id === this._selectedMode;
            return `
                <div class="mode-card" data-mode-id="${m.id}" style="
                    flex: 0 0 110px;
                    padding: 12px 8px;
                    border-radius: 10px;
                    border: 1px solid ${isSelected ? 'var(--tv-gold-primary)' : 'rgba(255,255,255,0.08)'};
                    background: ${isSelected ? 'rgba(255, 215, 0, 0.12)' : 'rgba(15, 23, 42, 0.6)'};
                    color: ${isSelected ? 'var(--tv-gold-primary)' : '#94A3B8'};
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.2s;
                ">
                    <div style="font-size: 24px; margin-bottom: 6px;">${m.icon}</div>
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.name}</div>
                </div>
            `;
        }).join('');

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- TOP APP BAR -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: center; padding: 12px 16px;">
                    <div style="font-weight: 900; font-size: var(--fds-font-md); letter-spacing: 1px; text-transform: uppercase;">
                        🎮 PLAY ZONE
                    </div>
                </div>

                <div style="max-width: 600px; margin: 0 auto; padding: 16px 16px 120px 16px;">
                    
                    <!-- HORIZONTAL SELECTABLE MODES LIST -->
                    <div style="font-size: var(--fds-font-xs); font-weight: 800; color: var(--fds-text-dim); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-left: 4px;">Select Game Mode</div>
                    <div style="
                        display: flex;
                        gap: 10px;
                        overflow-x: auto;
                        padding-bottom: 12px;
                        margin-bottom: 24px;
                        -webkit-overflow-scrolling: touch;
                    " class="hide-scrollbar">
                        ${modesHtml}
                    </div>

                    <!-- ACTIVE PLAY DETAILS CARD -->
                    <div class="glass-card fade-in-up" style="
                        border: 2px solid rgba(34, 197, 94, 0.3); 
                        background: radial-gradient(circle at top, rgba(34, 197, 94, 0.15) 0%, rgba(15, 23, 42, 0.95) 80%);
                        padding: 32px 20px 24px 20px; 
                        text-align: center;
                        border-radius: 20px;
                        margin-bottom: 24px;
                        box-shadow: 0 12px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(34, 197, 94, 0.05);
                        position: relative;
                        overflow: hidden;
                    ">
                        <!-- Icon -->
                        <div style="font-size: 64px; margin-bottom: 16px; filter: drop-shadow(0 4px 16px rgba(34,197,94,0.5)); transform: scale(1.05);">⚽</div>
                        
                        <!-- Title -->
                        <div style="font-size: 24px; font-weight: 900; color: var(--fds-text-main); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">
                            ${activeMode.name}
                        </div>

                        <!-- Info Pills -->
                        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 32px;">
                            <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 8px 14px; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase;">Level</span>
                                <span style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--tv-gold-primary); text-transform: uppercase;">${activeMode.difficulty}</span>
                            </div>
                            <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 8px 14px; display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: var(--fds-font-xs); color: var(--fds-text-dim); font-weight: 700; text-transform: uppercase;">Prize</span>
                                <span style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--fds-blue-accent); text-transform: uppercase;">${activeMode.reward}</span>
                            </div>
                        </div>

                        <!-- Kick Off Button -->
                        ${DesignSystem.Button({ id: 'btn-kickoff', text: 'KICK OFF', variant: 'primary', fullWidth: true, className: 'btn-kickoff-action' })}
                    </div>

                    <!-- RESUME SUSPENDED MATCH SECTION -->
                    <div id="resume-match-container" style="display: none; margin-bottom: 24px;">
                        <div class="glass-card fade-in-up" style="
                            border: 2px solid rgba(255, 215, 0, 0.3); 
                            background: radial-gradient(circle at top, rgba(255, 215, 0, 0.15) 0%, rgba(15, 23, 42, 0.95) 80%);
                            padding: 24px 20px; 
                            text-align: center;
                            border-radius: 20px;
                            box-shadow: 0 12px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(255, 215, 0, 0.05);
                        ">
                            <div style="font-size: 48px; margin-bottom: 12px; filter: drop-shadow(0 4px 16px rgba(255,215,0,0.5));">⏱️</div>
                            <div style="font-size: var(--fds-font-lg); font-weight: 900; color: var(--fds-text-main); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">
                                SUSPENDED
                            </div>
                            <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); margin-bottom: 20px; font-weight: 600;">
                                Match in progress.
                            </div>
                            <div style="display: flex; gap: 12px;">
                                <div style="flex: 1;">
                                    ${DesignSystem.Button({ id: 'btn-resume-match', text: 'RESUME', variant: 'primary', fullWidth: true })}
                                </div>
                                <div style="flex: 1;">
                                    ${DesignSystem.Button({ id: 'btn-discard-match', text: 'DISCARD', variant: 'secondary', fullWidth: true })}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            <style>
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .btn-kickoff-action:active {
                    transform: scale(0.96) !important;
                    box-shadow: 0 4px 12px rgba(34,197,94,0.2) !important;
                }
            </style>
        `;

        this._bindEvents();
    }

    private _bindEvents(): void {
        const root = this._uiManager.container;
        
        // Mode cards selection
        const cards = root.querySelectorAll('.mode-card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const modeId = target.getAttribute('data-mode-id');
                if (modeId && modeId !== this._selectedMode) {
                    this._audioManager.playClick();
                    this._selectedMode = modeId;
                    this.render();
                }
            });
        });

        // Kick Off handler
        document.getElementById('btn-kickoff')?.addEventListener('click', () => {
            this._audioManager.playClick();
            const activeMode = GAME_MODES.find(m => m.id === this._selectedMode) || GAME_MODES[0];
            if (this._selectedMode === 'daily') {
                localStorage.setItem('ETHIO_DAILY_COMPLETED_TODAY', 'true');
            }
            this._onStartMatch(activeMode.category);
        });

        // Resume handlers
        const activeSession = GameSessionManager.getInstance().getActiveSession();
        if (activeSession) {
            const resumeContainer = document.getElementById('resume-match-container');
            if (resumeContainer) resumeContainer.style.display = 'block';

            document.getElementById('btn-resume-match')?.addEventListener('click', () => {
                this._audioManager.playClick();
                if (this._onResumeMatch) {
                    this._onResumeMatch(activeSession);
                }
            });

            document.getElementById('btn-discard-match')?.addEventListener('click', () => {
                this._audioManager.playClick();
                GameSessionManager.getInstance().clearSession();
                if (resumeContainer) resumeContainer.style.display = 'none';
                this.render(); // Re-render to clear out the active session fully
            });
        }
    }
}
