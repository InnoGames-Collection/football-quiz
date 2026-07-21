import { Scene } from '@babylonjs/core';
import { IGameMode } from '../interfaces/IGameMode';
import { UIManager } from './UIManager';

export class GameRegistry {
    private _games: Map<string, IGameMode> = new Map();
    private _activeGame: IGameMode | null = null;
    private _scene: Scene;
    private _uiManager: UIManager;

    constructor(scene: Scene, uiManager: UIManager) {
        this._scene = scene;
        this._uiManager = uiManager;
    }

    public registerGame(game: IGameMode): void {
        this._games.set(game.metadata.id, game);
        console.log(`[GameRegistry] Registered game: ${game.metadata.name} (${game.metadata.id})`);
    }

    public getRegisteredGames(): IGameMode[] {
        return Array.from(this._games.values());
    }

    public async launchGame(gameId: string): Promise<void> {
        if (this._activeGame) {
            console.log(`[GameRegistry] Destroying active game: ${this._activeGame.metadata.name}`);
            this._activeGame.destroy();
            this._uiManager.clear();
        }

        const game = this._games.get(gameId);
        if (!game) {
            throw new Error(`[GameRegistry] Game with ID '${gameId}' not found.`);
        }

        console.log(`[GameRegistry] Initializing game: ${game.metadata.name}`);
        await game.initialize(this._scene, this._uiManager);
        
        this._activeGame = game;
        game.start();
    }

    public get activeGame(): IGameMode | null {
        return this._activeGame;
    }
}
