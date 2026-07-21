import { Engine as BabylonEngine, Scene, Color4 } from '@babylonjs/core';
import { SceneManager } from '../managers/SceneManager';
import { UIManager } from '../managers/UIManager';
import { SaveManager } from '../managers/SaveManager';
import { AudioManager } from '../managers/AudioManager';

/**
 * Lightweight ambient 3D background manager.
 * Initializes the Babylon.js engine and scene for visual atmosphere
 * (stadium lighting, ambient effects) while the quiz UI overlays on top.
 */
export class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BabylonEngine;
    private _sceneManager: SceneManager;
    private _uiManager: UIManager;
    private _saveManager: SaveManager;
    private _audioManager: AudioManager;

    constructor(canvasElementId: string) {
        this._canvas = document.getElementById(canvasElementId) as HTMLCanvasElement;
        this._engine = new BabylonEngine(this._canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            adaptToDeviceRatio: true
        });

        this._sceneManager = new SceneManager(this._engine);
        this._uiManager = new UIManager();
        this._saveManager = new SaveManager();
        this._audioManager = new AudioManager();
    }

    public async initialize(): Promise<void> {
        // Create the ambient scene (dark stadium atmosphere)
        const scene = new Scene(this._engine);
        scene.clearColor = new Color4(0.03, 0.06, 0.12, 1);

        this._sceneManager.setActiveScene(scene);

        // Resize listener for responsive canvas
        window.addEventListener('resize', () => {
            this._engine.resize();
        });

        // Start render loop (ambient background only)
        this._engine.runRenderLoop(() => {
            this._sceneManager.render();
        });
    }

    public get sceneManager(): SceneManager {
        return this._sceneManager;
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
