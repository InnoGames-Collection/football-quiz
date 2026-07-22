import { GameRegistry } from '../../core/managers/GameRegistry';
import { UIManager } from '../../core/managers/UIManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { DesignSystem } from '../theme/DesignSystem';

export class MainMenuScreen {
    private _registry: GameRegistry;
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;

    constructor(registry: GameRegistry, uiManager: UIManager, saveManager: SaveManager, audioManager: AudioManager) {
        this._registry = registry;
        this._uiManager = uiManager;
        this._saveManager = saveManager;
        this._audioManager = audioManager;
    }

    public render(): void {
        const root = this._uiManager.container;
        const games = this._registry.getRegisteredGames();
        const profile = this._saveManager.profile;

        root.innerHTML = `
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at center, rgba(15, 23, 42, 0.85) 0%, rgba(2, 6, 23, 0.98) 100%);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--fds-text-main);
                font-family: system-ui, -apple-system, sans-serif;
                pointer-events: auto;
                padding: 20px;
                box-sizing: border-box;
            ">
                <!-- User Profile Bar -->
                <div style="
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    background: rgba(30, 41, 59, 0.6);
                    padding: 10px 18px;
                    border-radius: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                ">
                    <span style="font-weight: bold; color: #F8FAFC;">👤 ${profile.username}</span>
                    <span style="color: var(--fds-gold-primary); font-size: var(--fds-font-sm); font-weight: bold;">🪙 ${profile.coins}</span>
                    <span style="color: var(--fds-blue-accent); font-size: var(--fds-font-sm); font-weight: bold;">⚡ ${profile.xp} XP</span>
                </div>

                <!-- Mute Toggle Button -->
                <button id="audio-toggle-btn" style="
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(30, 41, 59, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    padding: 8px 16px;
                    color: var(--fds-text-main);
                    font-weight: bold;
                    cursor: pointer;
                ">${this._audioManager.isMuted ? '🔇 MUTED' : '🔊 SOUND ON'}</button>

                <!-- Header Title -->
                <div style="text-align: center; margin-bottom: 30px; margin-top: 40px;">
                    <h1 style="
                        font-size: 48px;
                        font-weight: 900;
                        margin: 0;
                        letter-spacing: 2px;
                        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        text-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
                    ">FOOTBALL QUIZ LEAGUE</h1>
                    <p style="color: var(--fds-text-dim); margin-top: 8px; font-size: var(--fds-font-md);">ETHIO TELECOM VAS PLATFORM</p>
                </div>

                <!-- Quiz Games Grid -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 24px;
                    width: 100%;
                    max-width: 700px;
                ">
                    ${games.map(game => {
                        const highScore = profile.highScores[game.metadata.id] || 0;
                        return `
                            <div style="
                                background: rgba(30, 41, 59, 0.7);
                                border: 1px solid rgba(255, 255, 255, 0.1);
                                border-radius: 16px;
                                padding: 24px;
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                backdrop-filter: blur(12px);
                            ">
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                        <span style="
                                            font-size: var(--fds-font-xs);
                                            font-weight: bold;
                                            padding: 4px 10px;
                                            border-radius: 20px;
                                            background: rgba(168, 85, 247, 0.2);
                                            color: #C084FC;
                                            border: 1px solid #A855F7;
                                        ">QUIZ</span>
                                        <span style="font-size: var(--fds-font-sm); color: var(--fds-gold-primary); font-weight: bold;">BEST: ${highScore} PTS</span>
                                    </div>
                                    <h3 style="margin: 0 0 8px 0; font-size: var(--fds-font-lg); font-weight: bold; color: #F8FAFC;">${game.metadata.name}</h3>
                                    <p style="margin: 0; font-size: var(--fds-font-sm); color: var(--fds-text-dim); line-height: 1.5;">${game.metadata.description}</p>
                                </div>

                                ${DesignSystem.Button({ text: 'PLAY', variant: 'primary', fullWidth: true, className: 'launch-btn', dataAttrs: `data-game-id="${game.metadata.id}"` })}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Sound toggle listener
        document.getElementById('audio-toggle-btn')?.addEventListener('click', () => {
            this._audioManager.toggleMute();
            this.render();
        });

        // Attach event handlers to launch buttons
        root.querySelectorAll('.launch-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                this._audioManager.playClick();
                const gameId = (e.currentTarget as HTMLButtonElement).getAttribute('data-game-id');
                if (gameId) {
                    await this._registry.launchGame(gameId);
                    this._renderHomeButton();
                }
            });
        });
    }

    private _renderHomeButton(): void {
        const homeBtn = document.createElement('button');
        homeBtn.innerText = '🏠 MENU';
        homeBtn.style.position = 'absolute';
        homeBtn.style.top = '20px';
        homeBtn.style.right = '20px';
        homeBtn.style.padding = '8px 16px';
        homeBtn.style.background = 'rgba(15, 23, 42, 0.8)';
        homeBtn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        homeBtn.style.borderRadius = '20px';
        homeBtn.style.color = 'white';
        homeBtn.style.fontWeight = 'bold';
        homeBtn.style.fontSize = '14px';
        homeBtn.style.cursor = 'pointer';
        homeBtn.style.pointerEvents = 'auto';

        homeBtn.addEventListener('click', () => {
            this._audioManager.playClick();
            if (this._registry.activeGame) {
                this._registry.activeGame.destroy();
            }
            this._uiManager.clear();
            this.render();
        });

        this._uiManager.container.appendChild(homeBtn);
    }
}
