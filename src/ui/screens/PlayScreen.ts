import { DesignSystem } from "../theme/DesignSystem";
import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { GameModeBanner } from '../components/GameModeBanner';
import { i18n } from '../../localization/i18n';

export interface GameModeInfo {
    id: string;
    name: string;
    icon: string;
    difficulty: string;
    reward: string;
    category: string;
    banner: string;
}

export const GAME_MODES: GameModeInfo[] = [
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
    private _selectedMode: string = 'quick';

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        onStartMatch: (category: string) => void
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._onStartMatch = onStartMatch;

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
                    ${GameModeBanner.render({
                        bgId: 'play-card-bg',
                        iconId: 'play-card-icon',
                        titleId: 'play-card-title',
                        difficultyId: 'play-card-difficulty',
                        rewardId: 'play-card-reward',
                        bannerUrl: `/assets/banners/${activeMode.banner}`,
                        icon: activeMode.icon,
                        title: activeMode.name,
                        difficulty: activeMode.difficulty,
                        reward: activeMode.reward,
                        buttonId: 'btn-kickoff',
                        buttonText: i18n.currentLocale === 'am' ? 'ጀምር' : (i18n.currentLocale === 'om' ? 'EGGALI' : 'KICK OFF')
                    })}


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
                .btn-kickoff-action {
                    font-size: 20px !important;
                    font-weight: 900 !important;
                    padding: 18px 24px !important;
                    letter-spacing: 2px !important;
                    background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%) !important;
                    border: 2px solid #4ADE80 !important;
                    box-shadow: 0 8px 24px rgba(34,197,94,0.4), inset 0 2px 4px rgba(255,255,255,0.3) !important;
                    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                    border-radius: 16px !important;
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
                            bgEl.style.background = `linear-gradient(to bottom, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.2) 100%), url('/assets/banners/${nextMode.banner}') center/cover no-repeat`;
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

    }
}
