import { Scene } from '@babylonjs/core';
import { UIManager } from '../managers/UIManager';

export interface GameModeMetadata {
    id: string;
    name: string;
    description: string;
    icon?: string;
    is3D: boolean;
}

export interface IGameMode {
    readonly metadata: GameModeMetadata;
    
    /**
     * Called when the game mode is loaded and mounted to the scene.
     */
    initialize(scene: Scene, uiManager: UIManager): Promise<void>;
    
    /**
     * Called when gameplay begins or resumes.
     */
    start(): void;
    
    /**
     * Called on every frame tick (if active).
     */
    update(deltaTime: number): void;
    
    /**
     * Called when the game is paused.
     */
    pause?(): void;
    
    /**
     * Called when exiting the game mode to clean up meshes, listeners, and timers.
     */
    destroy(): void;
}
