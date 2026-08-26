import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { EthioFantasyAppBar } from '../components/EthioFantasyAppBar';

export interface PlayScreenCallbacks {
    onCasualPlay: (category?: string) => void;
}

export class PlayScreen {
    private _uiManager: UIManager;
    private _audioManager: AudioManager;
    private _callbacks: PlayScreenCallbacks;

    constructor(
        uiManager: UIManager,
        audioManager: AudioManager,
        callbacks: PlayScreenCallbacks
    ) {
        this._uiManager = uiManager;
        this._audioManager = audioManager;
        this._callbacks = callbacks;
    }

    public render(): void {
        const root = this._uiManager.container;
        
        root.innerHTML = `
            <div class="stadium-container ethio-bg-main" style="pointer-events: auto;">
                <!-- Layers -->
                <div class="ethio-layer ethio-layer-pitch"></div>
                <div class="ethio-layer ethio-layer-overlay"></div>
                <div class="ethio-layer ethio-layer-lights"></div>
                
                ${EthioFantasyAppBar.render('PLAY', '', false)}

                <style>
                    .category-btn {
                        padding: 20px 12px;
                        border-radius: 20px;
                        background: linear-gradient(135deg, rgba(7, 27, 45, 0.9) 0%, rgba(7, 27, 45, 0.7) 100%);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        cursor: pointer;
                        text-align: center;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                        transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
                        position: relative;
                        overflow: hidden;
                    }
                    
                    /* Subtle green accent at the bottom */
                    .category-btn::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 15%;
                        right: 15%;
                        height: 3px;
                        background: #00C853;
                        border-radius: 4px 4px 0 0;
                        opacity: 0.5;
                        transition: all 0.2s;
                    }
                    
                    /* Selected/Hover State */
                    .category-btn:hover {
                        background: linear-gradient(135deg, rgba(15, 35, 55, 0.95) 0%, rgba(7, 27, 45, 0.8) 100%);
                        border-color: rgba(0, 200, 83, 0.4);
                        box-shadow: 0 12px 32px rgba(0, 200, 83, 0.15), inset 0 0 20px rgba(0, 200, 83, 0.05);
                        transform: translateY(-2px);
                    }
                    .category-btn:hover::after {
                        opacity: 1;
                        left: 0;
                        right: 0;
                        box-shadow: 0 -2px 12px rgba(0, 200, 83, 0.4);
                    }
                    
                    /* Press Interaction (Scale & Brighten) */
                    .category-btn:active {
                        transform: scale(0.97);
                        background: linear-gradient(135deg, rgba(20, 45, 70, 0.95) 0%, rgba(7, 27, 45, 0.85) 100%);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                        border-color: rgba(255, 255, 255, 0.15);
                    }
                    
                    .category-icon-wrapper {
                        font-size: 36px;
                        margin-bottom: 12px;
                        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
                        transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
                    }
                    .category-btn:hover .category-icon-wrapper {
                        transform: scale(1.1);
                    }
                </style>
                <div style="max-width: 960px; margin: 0 auto; padding: 24px 16px 100px 16px;">
                    
                    <h2 style="font-size: var(--fds-font-xl); font-weight: 900; margin-bottom: 24px; text-transform: uppercase; color: white; letter-spacing: 0.5px;">Game Modes</h2>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        
                        <!-- 15 CATEGORIES -->
                        ${[
                            { id: 'world-cup', icon: '🌍', name: 'World Cup' },
                            { id: 'champions-league', icon: '✨', name: 'Champions Lg' },
                            { id: 'caf-champions', icon: '🌍', name: 'CAF Champions' },
                            { id: 'afcon', icon: '🏆', name: 'AFCON' },
                            { id: 'ethiopian-premier', icon: '🇪🇹', name: 'Ethio League' },
                            { id: 'walia-ibex', icon: '🐐', name: 'Walia Ibex' },
                            { id: 'premier-league', icon: '🦁', name: 'Premier League' },
                            { id: 'la-liga', icon: '🇪🇸', name: 'La Liga' },
                            { id: 'serie-a', icon: '🇮🇹', name: 'Serie A' },
                            { id: 'bundesliga', icon: '🇩🇪', name: 'Bundesliga' },
                            { id: 'legendary-players', icon: '⭐', name: 'Legends' },
                            { id: 'football-rules', icon: '⚖️', name: 'Rules & Refs' },
                            { id: 'transfer-market', icon: '💷', name: 'Transfers' },
                            { id: 'stadiums', icon: '🏟️', name: 'Stadiums' },
                            { id: 'football-history', icon: '📜', name: 'History' }
                        ].map((cat, i) => `
                        <div class="glass-card fade-in-up category-btn" data-category="${cat.id}" style="animation-delay: ${i * 30}ms;">
                            <div class="category-icon-wrapper">${cat.icon}</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.5px;">${cat.name}</div>
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
        
        const categoryBtns = root.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const category = target.getAttribute('data-category') || 'random';
                
                // Ripple effect
                const rect = target.getBoundingClientRect();
                const mouseEvent = e as MouseEvent;
                const ripple = document.createElement('div');
                const diameter = Math.max(target.clientWidth, target.clientHeight);
                const radius = diameter / 2;
                let x = mouseEvent.clientX - rect.left - radius;
                let y = mouseEvent.clientY - rect.top - radius;
                ripple.style.width = ripple.style.height = `${diameter}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.classList.add('ripple');
                target.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);

                this._audioManager.playClick();
                this._callbacks.onCasualPlay(category);
            });
        });
    }

    public destroy(): void {}
}
