import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { EthioFantasyAppBar } from '../components/EthioFantasyAppBar';

export interface PlayScreenCallbacks {
    onCasualPlay: () => void;
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

                    <!-- CASUAL PRACTICE ARENA -->
                    <div class="glass-card fade-in-up" id="card-casual-play" style="padding: clamp(16px, 2.5vh, 20px); border-radius: 20px; background: linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    <span style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">🎯</span>
                                    <span style="font-size: var(--fds-font-md); font-weight: 900; color: #60A5FA; text-transform: uppercase; letter-spacing: 0.5px;">Practice Arena</span>
                                </div>
                                <div style="font-size: var(--fds-font-sm); color: var(--fds-text-dim); max-width: 85%;">
                                    Warm up with casual matches across all categories. No limits.
                                </div>
                            </div>
                            <div style="background: rgba(96,165,250,0.15); border: 1px solid rgba(96,165,250,0.3); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; color: #60A5FA; font-size: 20px; font-weight: bold; flex-shrink: 0;">
                                ▶
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
        
        root.querySelector('#card-casual-play')?.addEventListener('click', (e) => {
            // Ripple effect
            const btn = e.currentTarget as HTMLElement;
            const rect = btn.getBoundingClientRect();
            const mouseEvent = e as MouseEvent;
            const ripple = document.createElement('div');
            const diameter = Math.max(btn.clientWidth, btn.clientHeight);
            const radius = diameter / 2;
            let x = mouseEvent.clientX - rect.left - radius;
            let y = mouseEvent.clientY - rect.top - radius;
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            this._audioManager.playClick();
            this._callbacks.onCasualPlay();
        });
    }

    public destroy(): void {}
}
