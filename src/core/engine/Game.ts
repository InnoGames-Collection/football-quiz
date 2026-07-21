import { Engine as BabylonEngine, Scene, Color4 } from '@babylonjs/core';
import { SceneManager } from '../managers/SceneManager';
import { PhysicsManager } from '../managers/PhysicsManager';
import { UIManager } from '../managers/UIManager';
import { SaveManager } from '../managers/SaveManager';
import { AudioManager } from '../managers/AudioManager';

export class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BabylonEngine;
    private _sceneManager: SceneManager;
    private _physicsManager: PhysicsManager;
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;

    constructor(canvasElementId: string) {
        this._canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
        this._engine = new BabylonEngine(this._canvas, true, { preserveDrawingBuffer: true, stencil: true });
        
        this._sceneManager = new SceneManager(this._engine);
        this._physicsManager = new PhysicsManager();
        this._uiManager = new UIManager();
        this._saveManager = new SaveManager();
        this._audioManager = new AudioManager();
    }

    public async initialize(): Promise<void> {
        // Create the main scene
        const scene = new Scene(this._engine);
        scene.clearColor = new Color4(0.05, 0.08, 0.15, 1);
        
        this._sceneManager.setActiveScene(scene);

        // Initialize Physics (Havok)
        await this._physicsManager.initialize(scene);

        // Resize listener
        window.addEventListener('resize', () => {
            this._engine.resize();
        });

        // Start render loop
        this._engine.runRenderLoop(() => {
            this._sceneManager.render();
        });
    }

    public get sceneManager(): SceneManager {
        return this._sceneManager;
    }

    public get physicsManager(): PhysicsManager {
        return this._physicsManager;
    }

    public get uiManager(): UIManager {
        return this._uiManager;
    }

    public get saveManager(): SaveManager {
        return this._saveManager;
    }

    public get audioManager(): AudioManager {
        return this._audioManager;
    }

    public get engine(): BabylonEngine {
        return this._engine;
    }
}
