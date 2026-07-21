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
                    () => renderHome()
                );
                await lbScreen.render();
                break;
            case 'profile':
                const achScreen = new AchievementScreen(
                    game.uiManager,
                    game.audioManager,
                    game.saveManager,
                    () => renderHome()
                );
                achScreen.render();
                break;
        }
    };

    // Render the main hub screen
    const renderHome = () => {
        BottomNav.setActiveTab('home');
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

    // Render persistent bottom navigation bar
    BottomNav.render((tabId) => {
        renderTab(tabId);
    });

    renderHome();

    console.log('[Bootstrap] ⚽ Football Quiz League Persistent 5-Tab Navigation initialized.');

    return game;
}

/**
 * Configures the ambient 3D scene with a camera and soft lighting.
 */
function configureAmbientScene(scene: Scene, canvasElementId: string): void {
    const camera = new FreeCamera('ambientCamera', new Vector3(0, 2.5, -6), scene);
    camera.setTarget(new Vector3(0, 1.5, 15));

    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement | null;
    if (!canvas) {
        throw new Error(`[Bootstrap] Canvas '${canvasElementId}' was not found.`);
    }

    camera.detachControl();

    const light = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), scene);
    light.intensity = 0.4;
}
