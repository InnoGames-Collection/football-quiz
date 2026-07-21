import { FreeCamera, HemisphericLight, Scene, Vector3 } from '@babylonjs/core';
import { Game } from './Game';
import { GameRegistry } from '../managers/GameRegistry';
import { QuizGameMode } from '../../games/quiz/QuizGameMode';
import { AdminPanelScreen } from '../../ui/screens/AdminPanelScreen';
import { FootballLeagueHome } from '../../ui/screens/FootballLeagueHome';
import { AuthManager } from '../auth/AuthManager';
import { CompetitionBrowserScreen } from '../../ui/screens/CompetitionBrowserScreen';
import { DailyChallengeScreen } from '../../ui/screens/DailyChallengeScreen';
import { LeaderboardScreen } from '../../ui/screens/LeaderboardScreen';
import { AchievementScreen } from '../../ui/screens/AchievementScreen';
import { MatchmakingScreen } from '../../ui/screens/MatchmakingScreen';
import { LiveMatchScreen } from '../../ui/screens/LiveMatchScreen';
import { QuestionBank } from '../quiz/QuestionBank';

/**
 * Bootstraps the Football Quiz League platform.
 * Initializes the ambient 3D background scene and mounts the quiz UI hub.
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

    // Render the main hub screen
    const renderHome = () => {
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
                },
                onCompetitions: () => {
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
                },
                onLeaderboard: async () => {
                    const lbScreen = new LeaderboardScreen(
                        game.uiManager,
                        game.audioManager,
                        () => renderHome()
                    );
                    await lbScreen.render();
                },
                onAchievements: () => {
                    const achScreen = new AchievementScreen(
                        game.uiManager,
                        game.audioManager,
                        game.saveManager,
                        () => renderHome()
                    );
                    achScreen.render();
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
    renderHome();

    console.log('[Bootstrap] ⚽ Football Quiz League Hub initialized successfully.');

    return game;
}

/**
 * Configures the ambient 3D scene with a camera and soft lighting.
 * This creates the dark, atmospheric stadium backdrop behind the quiz UI.
 */
function configureAmbientScene(scene: Scene, canvasElementId: string): void {
    const camera = new FreeCamera('ambientCamera', new Vector3(0, 2.5, -6), scene);
    camera.setTarget(new Vector3(0, 1.5, 15));

    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement | null;
    if (!canvas) {
        throw new Error(`[Bootstrap] Canvas '${canvasElementId}' was not found.`);
    }

    // Disable camera interaction — ambient background only
    camera.detachControl();

    // Soft ambient lighting for the dark stadium feel
    const light = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), scene);
    light.intensity = 0.4;
}
