import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';


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
    private _selectedMode: string = 'quick';

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        onStartMatch: (category: string) => void
    ) {
        this._uiManager = uiManager;

        this._audioManager = audioManager;
        this._onStartMatch = onStartMatch;
    }

    public render(): void {
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
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.name}</div>
                </div>
            `;
        }).join('');

        root.innerHTML = `
            <div class="stadium-container" style="pointer-events: auto;">
                
                <!-- TOP APP BAR -->
                <div class="tv-broadcast-header" style="border-bottom: 1px solid rgba(255,255,255,0.1); justify-content: center; padding: 12px 16px;">
                    <div style="font-weight: 900; font-size: 16px; letter-spacing: 1px; text-transform: uppercase;">
                        🎮 PLAY ZONE
                    </div>
                </div>

                <div style="max-width: 600px; margin: 0 auto; padding: 16px 16px 120px 16px;">
                    
                    <!-- HORIZONTAL SELECTABLE MODES LIST -->
                    <div style="font-size: 10px; font-weight: 800; color: #94A3B8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; margin-left: 4px;">Select Game Mode</div>
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
                    <div class="glass-card" style="
                        border-color: var(--tv-gold-primary); 
                        background: linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(15,23,42,0.92) 100%); 
                        padding: 24px; 
                        text-align: center;
                        border-radius: 16px;
                        margin-bottom: 24px;
                    ">
                        <div style="font-size: 48px; margin-bottom: 12px;">⚽</div>
                        <div style="font-size: 20px; font-weight: 900; color: white; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                            ${activeMode.name}
                        </div>

                        <!-- Info Grid -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                            <div>
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Difficulty</div>
                                <div style="font-size: 13px; font-weight: 900; color: var(--tv-gold-primary); margin-top: 4px;">${activeMode.difficulty}</div>
                            </div>
                            <div style="border-left: 1px solid rgba(255,255,255,0.08);">
                                <div style="font-size: 9px; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Reward</div>
                                <div style="font-size: 13px; font-weight: 900; color: #38BDF8; margin-top: 4px;">${activeMode.reward}</div>
                            </div>
                        </div>

                        <!-- Kick Off Button -->
                        <button id="btn-kickoff" style="
                            width: 100%; 
                            padding: 16px; 
                            background: var(--tv-pitch-green); 
                            color: white; 
                            font-weight: 900; 
                            font-size: 16px; 
                            border: none; 
                            border-radius: 12px; 
                            cursor: pointer;
                            box-shadow: 0 4px 15px rgba(34,197,94,0.4);
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        ">
                            KICK OFF
                        </button>
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
    }
}
