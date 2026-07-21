import { Engine, Scene } from '@babylonjs/core';

export class SceneManager {
    private _engine: Engine;
    private _activeScene: Scene | null = null;

    constructor(engine: Engine) {
        this._engine = engine;
    }

    public get engine(): Engine {
        return this._engine;
    }

    public setActiveScene(scene: Scene): void {
        if (this._activeScene) {
            this._activeScene.dispose();
        }
        this._activeScene = scene;
    }

    public get activeScene(): Scene | null {
        return this._activeScene;
    }

    public render(): void {
        if (this._activeScene) {
            this._activeScene.render();
        }
    }
}
