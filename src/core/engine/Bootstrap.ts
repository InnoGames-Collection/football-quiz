import { FreeCamera, HemisphericLight, Scene, Vector3 } from '@babylonjs/core';
import { Game } from './Game';
import { GameRegistry } from '../managers/GameRegistry';
import { QuizGameMode } from '../../games/quiz/QuizGameMode';
import { AdminPanelScreen } from '../../ui/screens/AdminPanelScreen';
import { FootballLeagueHome } from '../../ui/screens/FootballLeagueHome';

export async function bootstrapFootballLeague(canvasElementId: string): Promise<Game> {
    const game = new Game(canvasElementId);
    await game.initialize();

    const scene = game.sceneManager.activeScene;
    if (!scene) {
        throw new Error('[Bootstrap] Game initialized without an active scene.');
    }

    configureDefaultScene(scene, canvasElementId);

    const registry = new GameRegistry(scene, game.uiManager);
    registry.registerGame(new QuizGameMode());

    const winAny = window as any;
    winAny.ethioAudio = game.audioManager;
    winAny.ethioSave = game.saveManager;

    const renderHome = () => {
        const homeScreen = new FootballLeagueHome(
            game.saveManager,
            game.audioManager,
            game.uiManager,
            {
                onKickOff: () => registry.launchGame('football-quiz'),
                onDailyChallenge: () => registry.launchGame('football-quiz'),
                onCompetitions: () => registry.launchGame('football-quiz'),
                onLeaderboard: () => alert('Global & Competition Leaderboards Active!'),
                onAchievements: () => alert('Trophy & Badge Cabinet Active!'),
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

    console.log('[Bootstrap] Football Quiz League Hub initialized successfully.');

    return game;
}

function configureDefaultScene(scene: Scene, canvasElementId: string): void {
    const camera = new FreeCamera('mainCamera', new Vector3(0, 2.5, -6), scene);
    camera.setTarget(new Vector3(0, 1.5, 15));

    const canvas = document.getElementById(canvasElementId) as HTMLCanvasElement | null;
    if (!canvas) {
        throw new Error(`[Bootstrap] Canvas '${canvasElementId}' was not found.`);
    }

    camera.attachControl(canvas, true);

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.8;
}
