import { Game } from './Game';
import { GameRegistry } from '../managers/GameRegistry';
import { QuizGameMode } from '../../games/quiz/QuizGameMode';
import { AdminPanelScreen } from '../../ui/screens/AdminPanelScreen';
import { FootballLeagueHome } from '../../ui/screens/FootballLeagueHome';
import { AuthManager } from '../auth/AuthManager';
import { CompetitionBrowserScreen } from '../../ui/screens/CompetitionBrowserScreen';
import { LeaderboardScreen } from '../../ui/screens/LeaderboardScreen';
import { ProfileScreen } from '../../ui/screens/ProfileScreen';
import { MatchmakingScreen } from '../../ui/screens/MatchmakingScreen';
import { LiveMatchScreen } from '../../ui/screens/LiveMatchScreen';
import { QuestionBank } from '../quiz/QuestionBank';
import { BottomNav, TabId } from '../../ui/components/BottomNav';
import { SettingsScreen } from '../../ui/screens/SettingsScreen';
import { NotificationScreen } from '../../ui/screens/NotificationScreen';
import { DailyChallengeManager } from '../competition/DailyChallengeManager';
import { GameSessionManager } from '../quiz/GameSessionManager';
import { PlayScreen } from '../../ui/screens/PlayScreen';
import { DetailedStatsScreen } from '../../ui/screens/DetailedStatsScreen';
import { MessagesScreen } from '../../ui/screens/MessagesScreen';
import { SubscriptionScreen } from '../../ui/screens/SubscriptionScreen';

export async function bootstrapFootballLeague(): Promise<Game> {
    const game = new Game();
    await game.initialize();

    const authManager = AuthManager.getInstance(game.saveManager);
    const registry = new GameRegistry(game.uiManager);
    registry.registerGame(new QuizGameMode());

    const winAny = window as any;
    winAny.ethioAudio = game.audioManager;
    winAny.ethioSave = game.saveManager;
    winAny.ethioAuth = authManager;

    // Navigation Stack Management
    type RouteName = 'home' | 'play' | 'league' | 'rankings' | 'profile' | 'settings' | 'matchmaking' | 'live_match' | 'admin' | 'notifications' | 'stats' | 'messages' | 'subscription';
    let navigationStack: RouteName[] = [];
    let currentTab: TabId = 'home';

    const renderRoute = async (route: RouteName, pushToStack: boolean = true) => {
        if (pushToStack) {
            navigationStack.push(route);
        }

        switch (route) {
            case 'home':
                BottomNav.setActiveTab('home');
                currentTab = 'home';
                const homeScreen = new FootballLeagueHome(
                    game.saveManager, game.audioManager, game.uiManager,
                    {
                        onKickOff: async () => {
                            const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                            quizMode.setCompetition('walia-ibex');
                            await registry.launchGame('football-quiz');
                        },
                        onLiveMatch: () => renderRoute('matchmaking'),
                        onDailyChallenge: async () => {
                            const challengeInfo = await DailyChallengeManager.getInstance().getTodayChallenge();
                            const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                            quizMode.setCompetition(challengeInfo.questions[0]?.category || 'world-cup');
                            localStorage.setItem('ETHIO_DAILY_COMPLETED_TODAY', 'true');
                            await registry.launchGame('football-quiz');
                        },
                        onCompetitions: () => navigateToTab('league'),
                        onLeaderboard: () => navigateToTab('rankings'),
                        onAchievements: () => navigateToTab('profile'),
                        onAdminPanel: () => renderRoute('admin'),
                        onSettings: () => renderRoute('settings'),
                        onNotifications: () => renderRoute('notifications'),
                        onViewStats: () => renderRoute('stats'),
                        onMessages: () => renderRoute('messages')
                    }
                );
                homeScreen.render();
                break;

            case 'play':
                BottomNav.setActiveTab('play');
                currentTab = 'play';
                const playScreen = new PlayScreen(
                    game.uiManager, game.audioManager,
                    async (category) => {
                        const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                        quizMode.setCompetition(category);
                        await registry.launchGame('football-quiz');
                    }
                );
                playScreen.render();
                break;

            case 'league':
                BottomNav.setActiveTab('league');
                currentTab = 'league';
                const browser = new CompetitionBrowserScreen(
                    game.uiManager, game.audioManager,
                    async (comp) => {
                        const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                        quizMode.setCompetition(comp.id);
                        await registry.launchGame('football-quiz');
                    },
                    handleBack
                );
                browser.render();
                break;

            case 'rankings':
                BottomNav.setActiveTab('rankings');
                currentTab = 'rankings';
                const lbScreen = new LeaderboardScreen(
                    game.uiManager, game.saveManager, game.audioManager,
                    handleBack
                );
                await lbScreen.render();
                break;

            case 'profile':
                BottomNav.setActiveTab('profile');
                currentTab = 'profile';
                const profScreen = new ProfileScreen(
                    game.uiManager, game.saveManager, game.audioManager,
                    {
                        onStatistics: () => renderRoute('stats'),
                        onLeaderboard: () => navigateToTab('rankings'),
                        onSubscription: () => renderRoute('subscription'),
                        onMessages: () => renderRoute('messages'),
                        onSettings: () => renderRoute('settings'),
                        onHelp: () => {
                            // Render settings and trigger help sub-screen
                            renderRoute('settings');
                            // Wait, settings is loaded dynamically, but since we instantiate it in route render,
                            // we can set a flag or just let it open settings. In settings, help is fully functional!
                        },
                        onAbout: () => renderRoute('settings')
                    }
                );
                profScreen.render();
                break;

            case 'settings':
                const settings = new SettingsScreen(
                    game.uiManager, game.saveManager, game.audioManager,
                    handleBack
                );
                settings.render();
                break;

            case 'notifications':
                const notifScreen = new NotificationScreen(
                    game.uiManager, game.audioManager,
                    handleBack
                );
                notifScreen.render();
                break;

            case 'admin':
                const admin = new AdminPanelScreen(game.uiManager, game.audioManager, handleBack);
                admin.render();
                break;

            case 'matchmaking':
                const mmScreen = new MatchmakingScreen(
                    game.uiManager, game.audioManager, game.saveManager,
                    async (matchInfo) => {
                        winAny.ethioLiveMatchInfo = matchInfo;
                        renderRoute('live_match');
                    },
                    handleBack
                );
                await mmScreen.render();
                break;

            case 'live_match':
                const matchInfo = winAny.ethioLiveMatchInfo;
                if (!matchInfo) {
                    handleBack();
                    return;
                }
                const questions = await QuestionBank.getInstance().fetchQuestions(undefined, 10);
                const liveMatch = new LiveMatchScreen(
                    game.uiManager, game.audioManager, game.saveManager,
                    matchInfo.liveMatchId, matchInfo.opponent, questions,
                    handleBack
                );
                liveMatch.startMatch();
                break;

            case 'stats':
                const statsScreen = new DetailedStatsScreen(
                    game.uiManager, game.saveManager, game.audioManager,
                    handleBack
                );
                statsScreen.render();
                break;

            case 'messages':
                const messagesScreen = new MessagesScreen(
                    game.uiManager, game.audioManager,
                    handleBack
                );
                messagesScreen.render();
                break;

            case 'subscription':
                const subScreen = new SubscriptionScreen(
                    game.uiManager, game.audioManager,
                    handleBack
                );
                subScreen.render();
                break;
        }
    };

    const navigateToTab = (tabId: TabId) => {
        // Clear stack and set root
        navigationStack = [];
        renderRoute(tabId as RouteName);
    };

    const handleBack = () => {
        // Pop current
        navigationStack.pop(); 
        
        // If stack has items, go to previous
        if (navigationStack.length > 0) {
            const previousRoute = navigationStack[navigationStack.length - 1];
            // We don't want to push it again, so pushToStack = false
            renderRoute(previousRoute, false);
        } else {
            // Stack is empty. If we are not on home, go home.
            if (currentTab !== 'home') {
                navigateToTab('home');
            } else {
                // We are at home root and stack is empty. Re-render home to be safe, but don't exit.
                renderRoute('home', true);
            }
        }
    };

    winAny.ethioReloadHome = () => navigateToTab('home');
    
    (window as any).ethioTriggerGoal = () => {};
    (window as any).ethioMoveCamera = () => {};

    // Bottom Navigation Interceptor
    BottomNav.render((tabId) => {
        if (currentTab === tabId) {
            // Already on this tab? Reset to root of this tab
            navigateToTab(tabId);
        } else {
            navigateToTab(tabId);
        }
    });

    // Check for session recovery
    const activeSession = GameSessionManager.getInstance().getActiveSession();
    if (activeSession) {
        // Show Resume Previous Match dialog overlay
        const recoveryOverlay = document.createElement('div');
        recoveryOverlay.id = 'session-recovery-overlay';
        recoveryOverlay.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(15,23,42,0.95);
            z-index: 20000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
            pointer-events: auto;
        `;
        recoveryOverlay.innerHTML = `
            <div class="glass-card" style="width: 100%; max-width: 360px; padding: 28px 20px; text-align: center; border-color: var(--tv-gold-primary);">
                <div style="font-size: 48px; margin-bottom: 12px;">⚽⏱️</div>
                <div style="font-size: 22px; font-weight: 900; color: white; margin-bottom: 6px;">RESUME MATCH?</div>
                <div style="font-size: 14px; color: #94A3B8; margin-bottom: 24px;">An active match session was found. Would you like to resume it or discard it?</div>
                <button id="btn-recovery-resume" style="width: 100%; padding: 14px; background: var(--tv-pitch-green); color: white; border: none; border-radius: 8px; font-weight: 800; margin-bottom: 12px; cursor: pointer; text-transform: uppercase;">Resume Match</button>
                <button id="btn-recovery-discard" style="width: 100%; padding: 14px; background: rgba(239,68,68,0.1); border: 1px solid #EF4444; color: #EF4444; border-radius: 8px; font-weight: 800; cursor: pointer; text-transform: uppercase;">Discard Match</button>
            </div>
        `;
        document.body.appendChild(recoveryOverlay);

        document.getElementById('btn-recovery-resume')?.addEventListener('click', async () => {
            game.audioManager.playClick();
            recoveryOverlay.remove();
            
            // Launch game and restore session
            const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
            await registry.launchGame('football-quiz');
            await quizMode.resume(activeSession);
        });

        document.getElementById('btn-recovery-discard')?.addEventListener('click', () => {
            game.audioManager.playClick();
            recoveryOverlay.remove();
            GameSessionManager.getInstance().clearSession();
            navigateToTab('home');
        });
    } else {
        // Initial load
        navigateToTab('home');
    }

    console.log('[Bootstrap] ⚽ Football Quiz League Stack Navigation initialized.');

    return game;
}
