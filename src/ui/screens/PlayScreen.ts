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
    banner: string;
}

const GAME_MODES: GameModeInfo[] = [
    { id: 'quick', name: 'Quick Match', icon: '⚡', difficulty: 'Easy', reward: '+100 XP', category: 'world-cup', banner: 'QUICK MATCH.png' },
    { id: 'daily', name: 'Daily Challenge', icon: '📅', difficulty: 'Medium', reward: '+500 XP (1.5x Multiplier)', category: 'ethiopian-premier', banner: 'DAILY CHALLENGE.png' },
    { id: 'league', name: 'League Match', icon: '🏆', difficulty: 'Hard', reward: '+300 XP + Division Points', category: 'champions-league', banner: 'LEAGUE MATCH.png' },
    { id: 'tournament', name: 'Tournament', icon: '👑', difficulty: 'Legend', reward: '+1000 XP + Cup Prize', category: 'afcon', banner: 'TOURNAMENT.png' },
    { id: 'guess', name: 'Guess Player', icon: '👤', difficulty: 'Medium', reward: '+200 XP', category: 'legendary-players', banner: 'GUESS PLAYER.png' },
    { id: 'iq', name: 'Football IQ', icon: '🧠', difficulty: 'Hard', reward: '+250 XP', category: 'football-rules', banner: 'FOOTBALL IQ.png' },
    { id: 'penalty', name: 'Penalty Shootout', icon: '⚽', difficulty: 'Easy', reward: '+150 XP', category: 'transfer-market', banner: 'PENALTY SHOOTOUT.png' },
    { id: 'championship', name: 'Championship', icon: '🏅', difficulty: 'Elite', reward: '+2000 XP', category: 'world-cup', banner: 'CHAMPIONSHIP.png' }
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

        // Pre-cache banners
        GAME_MODES.forEach(mode => {
            const img = new Image();
            img.src = `/assets/banners/${mode.banner}`;
        });
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
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">

                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>

                
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
                        padding: 0;
                        text-align: center;
                        border-radius: 20px;
                        margin-bottom: 24px;
                        box-shadow: 0 12px 40px rgba(0,0,0,0.5);
                        position: relative;
                        overflow: hidden;
                    ">
                        <!-- Dynamic Background Asset -->
                        <div id="play-card-bg" style="
                            position: absolute;
                            top: 0; left: 0; right: 0; bottom: 0;
                            background: linear-gradient(to bottom, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.25) 100%), url('/assets/banners/${activeMode.banner}') center/cover no-repeat;
                            transition: opacity 120ms ease-out;
                            opacity: 1;
                            z-index: 0;
                        "></div>
                        
                        <!-- Content Container -->
                        <div style="position: relative; z-index: 1; padding: 32px 20px 24px 20px; height: 100%;">
                            <!-- Icon -->
                            <div id="play-card-icon" style="font-size: 64px; margin-bottom: 16px; filter: drop-shadow(0 4px 16px rgba(34,197,94,0.5)); transform: scale(1.05);">${activeMode.icon}</div>
                            
                            <!-- Title -->
                            <div id="play-card-title" style="font-size: 24px; font-weight: 900; color: white; text-shadow: 0 2px 8px rgba(0,0,0,0.8); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">
                                ${activeMode.name}
                            </div>

                            <!-- Info Pills -->
                            <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 32px;">
                                <div style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; padding: 8px 14px; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(4px);">
                                    <span style="font-size: var(--fds-font-xs); color: rgba(255,255,255,0.8); font-weight: 700; text-transform: uppercase;">Level</span>
                                    <span id="play-card-difficulty" style="font-size: var(--fds-font-xs); font-weight: 900; color: var(--tv-gold-primary); text-transform: uppercase;">${activeMode.difficulty}</span>
                                </div>
                                <div style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; padding: 8px 14px; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(4px);">
                                    <span style="font-size: var(--fds-font-xs); color: rgba(255,255,255,0.8); font-weight: 700; text-transform: uppercase;">Prize</span>
                                    <span id="play-card-reward" style="font-size: var(--fds-font-xs); font-weight: 900; color: #60A5FA; text-transform: uppercase;">${activeMode.reward}</span>
                                </div>
                            </div>

                            <!-- Kick Off Button -->
                            ${DesignSystem.Button({ id: 'btn-kickoff', text: 'KICK OFF', variant: 'primary', fullWidth: true, className: 'btn-kickoff-action' })}
                        </div>
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
                    
                    const nextMode = GAME_MODES.find(m => m.id === modeId) || GAME_MODES[0];
                    
                    // Update Mode Cards UI
                    cards.forEach(c => {
                        const isSelected = c.getAttribute('data-mode-id') === modeId;
                        (c as HTMLElement).style.border = isSelected ? '1px solid var(--tv-gold-primary)' : '1px solid rgba(255,255,255,0.08)';
                        (c as HTMLElement).style.background = isSelected ? 'rgba(255, 215, 0, 0.12)' : 'rgba(15, 23, 42, 0.6)';
                        (c as HTMLElement).style.color = isSelected ? 'var(--tv-gold-primary)' : '#94A3B8';
                    });
                    
                    // Dynamic Cross Fade Transition
                    const bgEl = document.getElementById('play-card-bg');
                    const iconEl = document.getElementById('play-card-icon');
                    const titleEl = document.getElementById('play-card-title');
                    const diffEl = document.getElementById('play-card-difficulty');
                    const rewardEl = document.getElementById('play-card-reward');
                    
                    if (bgEl) {
                        // 1. Fade Out (120ms)
                        bgEl.style.transition = 'opacity 120ms ease-out';
                        bgEl.style.opacity = '0.3';
                        
                        setTimeout(() => {
                            // 2. Cross Fade (Update content)
                            bgEl.style.background = `linear-gradient(to bottom, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.25) 100%), url('/assets/banners/${nextMode.banner}') center/cover no-repeat`;
                            if (iconEl) iconEl.innerText = nextMode.icon;
                            if (titleEl) titleEl.innerText = nextMode.name;
                            if (diffEl) diffEl.innerText = nextMode.difficulty;
                            if (rewardEl) rewardEl.innerText = nextMode.reward;
                            
                            // 3. Fade In (180ms)
                            bgEl.style.transition = 'opacity 180ms ease-in';
                            bgEl.style.opacity = '1';
                        }, 120);
                    }
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
