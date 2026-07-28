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

                <div style="max-width: 960px; margin: 0 auto; padding: 24px 16px 100px 16px;">
                    
                    <h2 style="font-size: var(--fds-font-xl); font-weight: 900; margin-bottom: 24px; text-transform: uppercase; color: white;">Game Modes</h2>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        
                        <!-- World Cup -->
                        <div class="glass-card fade-in-up category-btn" data-category="world-cup" style="padding: 16px; border-radius: 16px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s, border-color 0.2s;">
                            <div style="font-size: 32px; margin-bottom: 8px;">🌍</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: white; text-transform: uppercase;">World Cup</div>
                        </div>

                        <!-- Premier League -->
                        <div class="glass-card fade-in-up category-btn" data-category="premier-league" style="padding: 16px; border-radius: 16px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s, border-color 0.2s; animation-delay: 50ms;">
                            <div style="font-size: 32px; margin-bottom: 8px;">🦁</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: white; text-transform: uppercase;">Premier League</div>
                        </div>

                        <!-- Ethio Premier League -->
                        <div class="glass-card fade-in-up category-btn" data-category="ethio-league" style="padding: 16px; border-radius: 16px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s, border-color 0.2s; animation-delay: 100ms;">
                            <div style="font-size: 32px; margin-bottom: 8px;">🇪🇹</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: white; text-transform: uppercase;">Ethio League</div>
                        </div>

                        <!-- Legends -->
                        <div class="glass-card fade-in-up category-btn" data-category="legends" style="padding: 16px; border-radius: 16px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); cursor: pointer; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s, border-color 0.2s; animation-delay: 150ms;">
                            <div style="font-size: 32px; margin-bottom: 8px;">⭐</div>
                            <div style="font-size: var(--fds-font-sm); font-weight: 800; color: white; text-transform: uppercase;">Legends</div>
                        </div>

                        <!-- Random/All Categories -->
                        <div class="glass-card fade-in-up category-btn" data-category="random" style="grid-column: 1 / -1; padding: 16px; border-radius: 16px; background: linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(15,23,42,0.9) 100%); border: 1px solid rgba(34,197,94,0.4); cursor: pointer; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.2s, border-color 0.2s; animation-delay: 200ms; display: flex; align-items: center; justify-content: center; gap: 12px;">
                            <div style="font-size: 28px;">🎲</div>
                            <div style="text-align: left;">
                                <div style="font-size: var(--fds-font-md); font-weight: 800; color: white; text-transform: uppercase;">Random Mix</div>
                                <div style="font-size: var(--fds-font-xs); color: rgba(255,255,255,0.6);">Play questions from all categories</div>
                            </div>
                        </div>

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
