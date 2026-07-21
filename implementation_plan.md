# Ethio Football: Detailed 3D Architecture Plan

This document details the exact technical approach for implementing the production-ready Babylon.js architecture. We will use a clean, modular design where core systems are completely decoupled from individual game logic (like Penalty Shootout), ensuring maximum reusability.

## User Review Required

> [!IMPORTANT]
> **Technical Deep Dive:**
> - Please review the class responsibilities and the step-by-step execution plan below.
> - Once approved, I will begin implementing the `Core Managers` and the `Shared Football` classes.

---

## 1. Core Architecture & Dependency Injection

The `src/core/` directory will act as the heartbeat of the application. We will implement a lightweight Service Locator or Dependency Injection (DI) pattern so managers can easily access each other without circular dependencies.

### Core Managers
- **`Engine.ts` / `Game.ts`**: The entry point. Initializes the Babylon `Engine`, mounts it to the Canvas, and starts the render loop.
- **`SceneManager.ts`**: Manages the active Babylon `Scene`. Handles transitions between the Main Menu, Loading Screens, and active Game Scenes.
- **`AssetLoader.ts`**: A centralized wrapper around Babylon's `SceneLoader`. Preloads `.glb` meshes, sounds, and textures, caching them so games load instantly after the first boot.
- **`PhysicsManager.ts`**: Initializes the `@babylonjs/havok` plugin. Provides helper methods to apply impulses (kicks) and set restitution (bounciness) or friction on meshes.
- **`InputManager.ts`**: Normalizes Pointer Events (touch/mouse) into swipe vectors (direction, speed, curve) that the game logic can consume.

---

## 2. Shared Gameplay Systems (`src/gameplay/football/`)

To ensure we can build *Free Kick*, *Goalkeeper*, and *Penalty* games without rewriting code, we will build shared Domain Objects:

- **`Ball.ts`**: A class that wraps a Babylon spherical mesh and its Physics Body. Exposes a `kick(velocityVector, spinVector)` method.
- **`Goal.ts`**: Wraps the goalpost meshes and invisible trigger planes (using Babylon's `ActionManager` or physics triggers) to detect when a ball crosses the line. Fires an event: `onGoalScored`.
- **`Stadium.ts`**: Loads the environment (pitch, stadium walls, lighting, skybox).
- **`Player.ts`**: The base class for the kicker or goalkeeper, handling basic animations.

---

## 3. Game Module: Penalty Shootout (`src/games/penalty/`)

The specific game logic lives here. It orchestrates the Shared Systems.

- **`PenaltyGameMode.ts`**: The main state machine. Handles states like `WAITING_FOR_KICK`, `BALL_IN_AIR`, `GOAL_SCORED`, `MISS`.
- **`TargetManager.ts`**: Spawns moving bullseyes inside the `Goal` area.
- **Scoring Pipeline**: Listens to `Goal.ts` events, calculates distance from targets, applies multipliers, and updates the UI.

---

## 4. Step-by-Step Implementation Roadmap

We will execute the build in the following sequence:

### Phase 1: Core Engine & Physics Scaffold (Days 1-2)
1. **Bootstrap**: Write `Bootstrap.ts` and `Game.ts` to initialize Babylon.
2. **Physics**: Integrate Havok into `PhysicsManager.ts`.
3. **Primitives**: Create `Ball.ts` (using a generated sphere) and `Stadium.ts` (using a generated ground plane) to verify physics gravity and bouncing.

### Phase 2: Input & Interaction (Days 3-4)
1. **Swipe Input**: Build `InputManager.ts` to track touch start, move, and end, calculating a 2D vector for speed and direction.
2. **Kicking Mechanics**: Map the 2D swipe vector to a 3D physical impulse applied to the `Ball`'s Havok body.

### Phase 3: Penalty Logic & Rules (Days 5-6)
1. **Goal Detection**: Build `Goal.ts` with invisible collision triggers.
2. **State Machine**: Implement `PenaltyGameMode.ts` to track score, lives (or shots remaining), and reset the ball after each kick.
3. **UI Integration**: Build a simple React/Vanilla HUD overlay to display the score and remaining shots.

### Phase 4: Polish & Assets (Days 7+)
1. **Asset Loading**: Swap out the primitive spheres/planes with actual `.glb` models using `AssetLoader.ts`.
2. **Audio**: Integrate crowd noise and whistle sounds via `AudioManager.ts`.
