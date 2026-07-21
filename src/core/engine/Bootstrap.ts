import { 
    FreeCamera, 
    HemisphericLight, 
    Scene, 
    Vector3, 
    MeshBuilder, 
    StandardMaterial, 
    Color3, 
    SpotLight, 
    ShadowGenerator,
    Animation,
    CubicEase,
    EasingFunction,
    Color4,
    DynamicTexture
} from '@babylonjs/core';
import { Game } from './Game';
import { GameRegistry } from '../managers/GameRegistry';
import { QuizGameMode } from '../../games/quiz/QuizGameMode';
import { AdminPanelScreen } from '../../ui/screens/AdminPanelScreen';
import { FootballLeagueHome } from '../../ui/screens/FootballLeagueHome';
import { AuthManager } from '../auth/AuthManager';
import { CompetitionBrowserScreen } from '../../ui/screens/CompetitionBrowserScreen';
import { DailyChallengeScreen } from '../../ui/screens/DailyChallengeScreen';
import { LeaderboardScreen } from '../../ui/screens/LeaderboardScreen';
import { ProfileScreen } from '../../ui/screens/ProfileScreen';
import { MatchmakingScreen } from '../../ui/screens/MatchmakingScreen';
import { LiveMatchScreen } from '../../ui/screens/LiveMatchScreen';
import { QuestionBank } from '../quiz/QuestionBank';
import { BottomNav, TabId } from '../../ui/components/BottomNav';

/**
 * Bootstraps the Football Quiz League platform.
 * Initializes the ambient 3D background scene and mounts the quiz UI hub with persistent 5-tab Bottom Navigation.
 */
export async function bootstrapFootballLeague(canvasElementId: string): Promise<Game> {
    const game = new Game(canvasElementId);
    await game.initialize();

    const scene = game.sceneManager.activeScene;
    if (!scene) {
        throw new Error('[Bootstrap] Game initialized without an active scene.');
    }

    // Configure ambient 3D stadium background
    configureAmbientScene(scene, canvasElementId);

    // Initialize AuthManager & GameRegistry
    const authManager = AuthManager.getInstance(game.saveManager);
    const registry = new GameRegistry(game.uiManager);
    registry.registerGame(new QuizGameMode());

    // Expose managers for runtime debugging
    const winAny = window as any;
    winAny.ethioAudio = game.audioManager;
    winAny.ethioSave = game.saveManager;
    winAny.ethioAuth = authManager;

    const renderTab = async (tabId: TabId) => {
        BottomNav.setActiveTab(tabId);
        
        // Trigger 3D Camera Animation
        animateCameraToTab(scene, tabId);

        switch (tabId) {
            case 'home':
                renderHome();
                break;
            case 'play':
                const dcScreen = new DailyChallengeScreen(
                    game.uiManager,
                    game.audioManager,
                    async (challengeInfo) => {
                        const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                        quizMode.setCompetition(challengeInfo.questions[0]?.category || 'world-cup');
                        await registry.launchGame('football-quiz');
                    },
                    () => renderHome()
                );
                await dcScreen.render();
                break;
            case 'league':
                const browser = new CompetitionBrowserScreen(
                    game.uiManager,
                    game.audioManager,
                    async (comp) => {
                        const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                        quizMode.setCompetition(comp.id);
                        await registry.launchGame('football-quiz');
                    },
                    () => renderHome()
                );
                browser.render();
                break;
            case 'rankings':
                const lbScreen = new LeaderboardScreen(
                    game.uiManager,
                    game.audioManager,
                    game.saveManager,
                    () => renderHome()
                );
                await lbScreen.render();
                break;
            case 'profile':
                const profScreen = new ProfileScreen(
                    game.uiManager,
                    game.saveManager
                );
                profScreen.render();
                break;
        }
    };

    // Render the main hub screen
    const renderHome = () => {
        BottomNav.setActiveTab('home');
        animateCameraToTab(scene, 'home');
        
        const homeScreen = new FootballLeagueHome(
            game.saveManager,
            game.audioManager,
            game.uiManager,
            {
                onKickOff: async () => {
                    const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                    quizMode.setCompetition('walia-ibex');
                    await registry.launchGame('football-quiz');
                },
                onLiveMatch: async () => {
                    const mmScreen = new MatchmakingScreen(
                        game.uiManager,
                        game.audioManager,
                        game.saveManager,
                        async (matchInfo) => {
                            const questions = await QuestionBank.getInstance().fetchQuestions(undefined, 10);
                            const liveMatch = new LiveMatchScreen(
                                game.uiManager,
                                game.audioManager,
                                game.saveManager,
                                matchInfo.liveMatchId,
                                matchInfo.opponent,
                                questions,
                                () => renderHome()
                            );
                            liveMatch.startMatch();
                        },
                        () => renderHome()
                    );
                    await mmScreen.render();
                },
                onDailyChallenge: async () => {
                    renderTab('play');
                },
                onCompetitions: () => {
                    renderTab('league');
                },
                onLeaderboard: async () => {
                    renderTab('rankings');
                },
                onAchievements: () => {
                    renderTab('profile');
                },
                onAdminPanel: () => {
                    const admin = new AdminPanelScreen(game.uiManager, game.audioManager, () => renderHome());
                    admin.render();
                }
            }
        );
        homeScreen.render();
    };

    winAny.ethioReloadHome = renderHome;
    
    // Expose for external hooks (e.g. gameplay triggers)
    (window as any).ethioTriggerGoal = () => triggerGoalAnimation(scene);
    (window as any).ethioMoveCamera = (tabId: 'home' | 'play' | 'profile' | 'rankings') => animateCameraToTab(scene, tabId);

    // Render persistent bottom navigation bar
    BottomNav.render((tabId) => {
        renderTab(tabId);
    });

    renderHome();

    console.log('[Bootstrap] ⚽ Football Quiz League Persistent 5-Tab Navigation initialized.');

    return game;
}

/**
 * Procedurally generates the 3D stadium and pitch to avoid heavy GLB asset loading.
 */
function configureAmbientScene(scene: Scene, canvasElementId: string): void {
    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement | null;
    if (!canvas) {
        throw new Error(`[Bootstrap] Canvas '${canvasElementId}' was not found.`);
    }

    // 1. Camera
    const camera = new FreeCamera('ambientCamera', new Vector3(0, 15, -25), scene);
    camera.setTarget(new Vector3(0, 0, 0));
    camera.detachControl();

    // 2. Lighting (Hemispheric + Dramatic Spotlights)
    const hemiLight = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.3;
    hemiLight.groundColor = new Color3(0.1, 0.1, 0.2);

    const spotLight = new SpotLight("floodLight", new Vector3(0, 30, -10), new Vector3(0, -1, 0), Math.PI / 2, 2, scene);
    spotLight.intensity = 0.8;
    spotLight.diffuse = new Color3(1, 0.9, 0.8);

    const shadowGen = new ShadowGenerator(1024, spotLight);
    shadowGen.useBlurExponentialShadowMap = true;

    // 3. Procedural Pitch (Grass with Stripes)
    const pitch = MeshBuilder.CreateGround("pitch", { width: 50, height: 75 }, scene);
    const pitchMat = new StandardMaterial("pitchMat", scene);
    
    // Create mowed grass stripes using DynamicTexture
    const dt = new DynamicTexture("pitchDT", 512, scene);
    const ctx = dt.getContext();
    ctx.fillStyle = "#1b4d24"; // Darker green
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = "#225e2c"; // Lighter green
    for(let i=0; i<8; i++) {
        ctx.fillRect(0, i * 64, 512, 32); // Horizontal stripes
    }
    dt.update();
    
    pitchMat.diffuseTexture = dt;
    pitchMat.specularColor = new Color3(0.05, 0.05, 0.05);
    pitch.material = pitchMat;
    pitch.receiveShadows = true;

    // 4. Procedural Lines (Chalk)
    const centerCircle = MeshBuilder.CreateTorus("centerCircle", { diameter: 10, thickness: 0.15, tessellation: 32 }, scene);
    centerCircle.position.y = 0.01;
    const chalkMat = new StandardMaterial("chalkMat", scene);
    chalkMat.diffuseColor = new Color3(1, 1, 1);
    centerCircle.material = chalkMat;

    const halfWayLine = MeshBuilder.CreatePlane("halfWayLine", { width: 50, height: 0.15 }, scene);
    halfWayLine.rotation.x = Math.PI / 2;
    halfWayLine.position.y = 0.01;
    halfWayLine.material = chalkMat;

    // 4.5 Goalposts
    const goalLeftPost = MeshBuilder.CreateCylinder("gl", { height: 3, diameter: 0.15 }, scene);
    goalLeftPost.position = new Vector3(-4, 1.5, 30);
    goalLeftPost.material = chalkMat;
    const goalRightPost = MeshBuilder.CreateCylinder("gr", { height: 3, diameter: 0.15 }, scene);
    goalRightPost.position = new Vector3(4, 1.5, 30);
    goalRightPost.material = chalkMat;
    const goalCrossbar = MeshBuilder.CreateCylinder("gc", { height: 8, diameter: 0.15 }, scene);
    goalCrossbar.rotation.z = Math.PI / 2;
    goalCrossbar.position = new Vector3(0, 3, 30);
    goalCrossbar.material = chalkMat;

    // 5. Procedural Stadium Stands (Low Poly Blocks)
    const standsMat = new StandardMaterial("standsMat", scene);
    standsMat.diffuseColor = new Color3(0.05, 0.05, 0.1);
    
    const leftStand = MeshBuilder.CreateBox("leftStand", { width: 10, height: 15, depth: 75 }, scene);
    leftStand.position = new Vector3(-25, 5, 0); // Moved closer
    leftStand.material = standsMat;

    const rightStand = MeshBuilder.CreateBox("rightStand", { width: 10, height: 15, depth: 75 }, scene);
    rightStand.position = new Vector3(25, 5, 0); // Moved closer
    rightStand.material = standsMat;

    // 6. Hidden 3D Football (for goal animation)
    const ball = MeshBuilder.CreateSphere("matchBall", { diameter: 1.5, segments: 16 }, scene);
    const ballMat = new StandardMaterial("ballMat", scene);
    ballMat.diffuseColor = new Color3(0.9, 0.9, 0.9);
    ball.material = ballMat;
    ball.position = new Vector3(0, -10, 0); // Hide it initially
    shadowGen.addShadowCaster(ball);

    scene.clearColor = new Color4(0.02, 0.04, 0.08, 1);
}

/**
 * Animates the camera to different stadium views depending on the active tab.
 */
function animateCameraToTab(scene: Scene, tabId: TabId): void {
    const camera = scene.getCameraByName('ambientCamera') as FreeCamera;
    if (!camera) return;

    let targetPos: Vector3;
    let targetLook: Vector3;

    switch (tabId) {
        case 'home':
            targetPos = new Vector3(0, 15, -25);
            targetLook = new Vector3(0, 0, 0);
            break;
        case 'play':
            targetPos = new Vector3(0, 3, -15); // Pitch level
            targetLook = new Vector3(0, 0, 5);
            break;
        case 'league':
            targetPos = new Vector3(-15, 20, 0); // Aerial side view
            targetLook = new Vector3(0, 0, 0);
            break;
        case 'rankings':
            targetPos = new Vector3(15, 8, -10); // Low corner view
            targetLook = new Vector3(0, 0, 0);
            break;
        case 'profile':
            targetPos = new Vector3(0, 2, 0); // Center circle focus
            targetLook = new Vector3(0, -2, 10);
            break;
        default:
            targetPos = new Vector3(0, 15, -25);
            targetLook = new Vector3(0, 0, 0);
    }

    // Stop existing animations
    scene.stopAnimation(camera);

    // Create Position Animation
    const animPos = new Animation("camMove", "position", 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animPos.setEasingFunction(ease);

    animPos.setKeys([
        { frame: 0, value: camera.position.clone() },
        { frame: 60, value: targetPos }
    ]);

    // Create LookAt Animation by animating the target vector (requires wrapping the camera setTarget)
    const dummyTarget = MeshBuilder.CreateBox("dummy", { size: 0.1 }, scene);
    dummyTarget.isVisible = false;
    dummyTarget.position = camera.getTarget().clone();
    
    const animLook = new Animation("camLook", "position", 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
    animLook.setEasingFunction(ease);
    animLook.setKeys([
        { frame: 0, value: dummyTarget.position.clone() },
        { frame: 60, value: targetLook }
    ]);

    dummyTarget.animations.push(animLook);
    camera.animations.push(animPos);
    
    // Bind camera to look at the moving dummy target
    scene.onBeforeRenderObservable.add(() => {
        if (dummyTarget && !dummyTarget.isDisposed()) {
            camera.setTarget(dummyTarget.position);
        }
    });

    scene.beginAnimation(camera, 0, 60, false);
    scene.beginAnimation(dummyTarget, 0, 60, false, 1, () => {
        dummyTarget.dispose();
    });
}

/**
 * Triggers a 3D goal animation (ball flies across screen).
 */
function triggerGoalAnimation(scene: Scene): void {
    const ball = scene.getMeshByName("matchBall");
    const camera = scene.getCameraByName("ambientCamera");
    if (!ball || !camera) return;

    // Reset ball position in front of camera
    ball.position = camera.position.add(new Vector3(0, -2, 5));
    
    const animBall = new Animation("goalFly", "position", 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const ease = new CubicEase();
    ease.setEasingMode(EasingFunction.EASINGMODE_EASEIN);
    animBall.setEasingFunction(ease);

    animBall.setKeys([
        { frame: 0, value: ball.position.clone() },
        { frame: 30, value: new Vector3(0, 2, 20) }, // Flies to net
        { frame: 60, value: new Vector3(0, -10, 0) } // Disappears
    ]);

    ball.animations = [];
    ball.animations.push(animBall);
    scene.beginAnimation(ball, 0, 60, false);
}
