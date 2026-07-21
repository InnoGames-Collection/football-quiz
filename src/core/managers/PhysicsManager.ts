import { PhysicsBody, Scene, Vector3, HavokPlugin } from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';

export class PhysicsManager {
    private _plugin: HavokPlugin | null = null;
    private _scene: Scene | null = null;

    constructor() {}

    public async initialize(scene: Scene): Promise<void> {
        if (this._plugin) {
            return;
        }

        // Initialize the Havok physics engine
        const havokInstance = await HavokPhysics();
        this._plugin = new HavokPlugin(true, havokInstance);
        this._scene = scene;
        
        // Enable physics on the scene with standard Earth gravity
        scene.enablePhysics(new Vector3(0, -9.81, 0), this._plugin);
        
        console.log('[PhysicsManager] Havok Physics initialized.');
    }

    public applyImpulse(body: PhysicsBody, impulse: Vector3, contactPoint: Vector3): void {
        body.applyImpulse(impulse, contactPoint);
    }

    public setVelocity(body: PhysicsBody, linearVelocity: Vector3, angularVelocity = Vector3.Zero()): void {
        body.setLinearVelocity(linearVelocity);
        body.setAngularVelocity(angularVelocity);
    }

    public get plugin(): HavokPlugin | null {
        return this._plugin;
    }

    public get scene(): Scene | null {
        return this._scene;
    }
}
