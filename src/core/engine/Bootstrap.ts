import { Game } from './Game';
import { GameRegistry } from '../managers/GameRegistry';
import { QuizGameMode } from '../../games/quiz/QuizGameMode';
import { AdminPanelScreen } from '../../ui/screens/AdminPanelScreen';
import { FootballLeagueHome } from '../../ui/screens/FootballLeagueHome';
import { AuthManager } from '../auth/AuthManager';
import { AuthScreen } from '../../ui/screens/AuthScreen';
import { RealtimeService } from '../../networking/services/RealtimeService';
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
import { i18n } from '../../localization/i18n';
import { DetailedStatsScreen } from '../../ui/screens/DetailedStatsScreen';
import { MessagesScreen } from '../../ui/screens/MessagesScreen';
import { SubscriptionScreen } from '../../ui/screens/SubscriptionScreen';
import { CacheManager } from '../cache/CacheManager';
import { EventBus } from '../events/EventBus';

export async function bootstrapFootballLeague(): Promise<Game> {
    const game = new Game();
    await game.initialize();

    const authManager = AuthManager.getInstance(game.saveManager);
    const cacheManager = CacheManager.getInstance();
    const eventBus = EventBus.getInstance();
    const registry = new GameRegistry(game.uiManager);
    registry.registerGame(new QuizGameMode());

    const winAny = window as any;
    winAny.ethioAudio = game.audioManager;
    winAny.ethioSave = game.saveManager;
    winAny.ethioAuth = authManager;
    winAny.ethioCache = cacheManager;
    winAny.ethioEvents = eventBus;

    // Navigation Stack Management
    type RouteName = 'home' | 'play' | 'league' | 'rankings' | 'profile' | 'settings' | 'matchmaking' | 'live_match' | 'admin' | 'notifications' | 'stats' | 'messages' | 'subscription' | 'help' | 'about' | 'privacy' | 'terms';
    let navigationStack: RouteName[] = [];
    let currentTab: TabId = 'home';
    let activeScreen: any = null;

    const renderRoute = async (route: RouteName, pushToStack: boolean = true) => {
        if (activeScreen && typeof activeScreen.destroy === 'function') {
            activeScreen.destroy();
        }
        activeScreen = null;
        if (pushToStack) {
            navigationStack.push(route);
            try {
                window.history.pushState({ route }, '', window.location.href);
            } catch (e) {}
        }

        switch (route) {
            case 'home':
                BottomNav.setActiveTab('home');
                currentTab = 'home';
                cacheManager.setQuizActive(false);
                const homeScreen = new FootballLeagueHome(
                    game.saveManager, game.audioManager, game.uiManager,
                    {
                        onKickOff: async () => {
                            cacheManager.setQuizActive(true);
                            const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                            quizMode.setCompetition('walia-ibex');
                            await registry.launchGame('football-quiz');
                        },
                        onLiveMatch: () => renderRoute('matchmaking'),
                        onDailyChallenge: async () => {
                            cacheManager.setQuizActive(true);
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
                activeScreen = homeScreen;
                homeScreen.render();
                break;

            case 'play':
                BottomNav.setActiveTab('play');
                currentTab = 'play';
                cacheManager.setQuizActive(false);
                const playScreen = new PlayScreen(
                    game.uiManager, game.audioManager,
                    async (category) => {
                        cacheManager.setQuizActive(true);
                        const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                        quizMode.setCompetition(category);
                        await registry.launchGame('football-quiz');
                    },
                    async (session) => {
                        cacheManager.setQuizActive(true);
                        const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                        await registry.launchGame('football-quiz');
                        await quizMode.resume(session);
                    }
                );
                activeScreen = playScreen;
                playScreen.render();
                break;

            case 'league':
                BottomNav.setActiveTab('league');
                currentTab = 'league';
                cacheManager.setQuizActive(false);
                const browser = new CompetitionBrowserScreen(
                    game.uiManager, game.audioManager,
                    async (comp) => {
                        cacheManager.setQuizActive(true);
                        const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
                        quizMode.setCompetition(comp.id);
                        await registry.launchGame('football-quiz');
                    },
                    handleBack
                );
                activeScreen = browser;
                browser.render();
                break;

            case 'rankings':
                BottomNav.setActiveTab('rankings');
                currentTab = 'rankings';
                cacheManager.setQuizActive(false);
                const lbScreen = new LeaderboardScreen(
                    game.uiManager, game.saveManager, game.audioManager,
                    handleBack
                );
                activeScreen = lbScreen;
                await lbScreen.render();
                break;

            case 'profile':
                BottomNav.setActiveTab('profile');
                currentTab = 'profile';
                cacheManager.setQuizActive(false);
                const profScreen = new ProfileScreen(
                    game.uiManager, game.saveManager, game.audioManager,
                    {
                        onStatistics: () => renderRoute('stats'),
                        onLeaderboard: () => navigateToTab('rankings'),
                        onSubscription: () => renderRoute('subscription'),
                        onMessages: () => renderRoute('messages'),
                        onSettings: () => renderRoute('settings'),
                        onHelp: () => renderRoute('help'),
                        onAbout: () => renderRoute('about'),
                        onPrivacy: () => renderRoute('privacy'),
                        onTerms: () => renderRoute('terms')
                    }
                );
                activeScreen = profScreen;
                profScreen.render();
                break;

            case 'settings':
                cacheManager.setQuizActive(false);
                const settings = new SettingsScreen(
                    game.uiManager, game.saveManager, game.audioManager,
                    handleBack, 'main'
                );
                activeScreen = settings;
                settings.render();
                break;
                
            case 'help':
                cacheManager.setQuizActive(false);
                const help = new SettingsScreen(game.uiManager, game.saveManager, game.audioManager, handleBack, 'help');
                activeScreen = help;
                help.render();
                break;

            case 'about':
                cacheManager.setQuizActive(false);
                const about = new SettingsScreen(game.uiManager, game.saveManager, game.audioManager, handleBack, 'about');
                activeScreen = about;
                about.render();
                break;

            case 'privacy':
                cacheManager.setQuizActive(false);
                const privacy = new SettingsScreen(game.uiManager, game.saveManager, game.audioManager, handleBack, 'privacy');
                activeScreen = privacy;
                privacy.render();
                break;

            case 'terms':
                cacheManager.setQuizActive(false);
                const terms = new SettingsScreen(game.uiManager, game.saveManager, game.audioManager, handleBack, 'terms');
                activeScreen = terms;
                terms.render();
                break;

            case 'notifications':
                cacheManager.setQuizActive(false);
                const notifScreen = new NotificationScreen(
                    game.uiManager, game.audioManager,
                    handleBack
                );
                activeScreen = notifScreen;
                notifScreen.render();
                break;

            case 'admin':
                cacheManager.setQuizActive(false);
                const admin = new AdminPanelScreen(game.uiManager, game.audioManager, handleBack);
                activeScreen = admin;
                admin.render();
                break;

            case 'matchmaking':
                cacheManager.setQuizActive(false);
                const mmScreen = new MatchmakingScreen(
                    game.uiManager, game.audioManager, game.saveManager,
                    async (matchInfo) => {
                        winAny.ethioLiveMatchInfo = matchInfo;
                        renderRoute('live_match');
                    },
                    handleBack
                );
                activeScreen = mmScreen;
                await mmScreen.render();
                break;

            case 'live_match':
                cacheManager.setQuizActive(true);
                const matchInfo = winAny.ethioLiveMatchInfo;
                if (!matchInfo) {
                    handleBack();
                    return;
                }
                const questions = await QuestionBank.getInstance().fetchQuestions(undefined, 10, i18n.currentLocale as any);
                const liveMatch = new LiveMatchScreen(
                    game.uiManager, game.audioManager, game.saveManager,
                    matchInfo.liveMatchId, matchInfo.opponent, questions,
                    handleBack
                );
                activeScreen = liveMatch;
                liveMatch.startMatch();
                break;

            case 'stats':
                cacheManager.setQuizActive(false);
                const statsScreen = new DetailedStatsScreen(
                    game.uiManager, game.saveManager, game.audioManager,
                    handleBack
                );
                activeScreen = statsScreen;
                statsScreen.render();
                break;

            case 'messages':
                cacheManager.setQuizActive(false);
                const messagesScreen = new MessagesScreen(
                    game.uiManager, game.audioManager,
                    handleBack
                );
                activeScreen = messagesScreen;
                messagesScreen.render();
                break;

            case 'subscription':
                cacheManager.setQuizActive(false);
                const subScreen = new SubscriptionScreen(
                    game.uiManager, game.audioManager,
                    handleBack
                );
                activeScreen = subScreen;
                subScreen.render();
                break;
        }
    };

    const navigateToTab = (tabId: TabId) => {
        navigationStack = [];
        renderRoute(tabId as RouteName);
    };

    winAny.ethioReloadHome = () => navigateToTab('home');
    winAny.ethioHandleBack = () => handleBack();
    winAny.ethioCloseGame = () => {
        cacheManager.setQuizActive(false);
        const currentRoute = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : 'home';
        renderRoute(currentRoute, false);
    };

    // Listen for EventBus view reload events
    eventBus.on('RELOAD_CURRENT_VIEW', () => {
        if (!cacheManager.isQuizActive) {
            console.log('[Bootstrap] Reloading current view upon event trigger.');
            renderRoute(currentTab as RouteName, false);
        }
    });

    // 1. App Resume Refresh (visibilitychange / window focus)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !cacheManager.isQuizActive) {
            console.log('[Bootstrap] App resumed. Triggering background refresh for stale data.');
            eventBus.emit('DATA_REFRESHED');
        }
    });

    // 2. Network Reconnection Refresh
    const handleNetworkChange = () => {
        const isOnline = navigator.onLine;
        let offlineBanner = document.getElementById('ethio-offline-banner');

        if (!isOnline) {
            if (!offlineBanner) {
                offlineBanner = document.createElement('div');
                offlineBanner.id = 'ethio-offline-banner';
                offlineBanner.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100vw;
                    background: #EF4444; color: white; text-align: center;
                    font-size: 13px; font-weight: 800; padding: 8px 12px; z-index: 99999;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex;
                    align-items: center; justify-content: center; gap: 8px; font-family: sans-serif;
                `;
                offlineBanner.innerHTML = `<span>⚠️</span><span>No internet connection. Paused. Reconnecting...</span>`;
                document.body.appendChild(offlineBanner);
            }
        } else {
            if (offlineBanner) {
                offlineBanner.style.background = 'var(--fds-green-pitch)';
                offlineBanner.innerHTML = `<span>✅</span><span>Connection restored! Refreshing data...</span>`;
                setTimeout(() => { offlineBanner?.remove(); }, 2000);
            }
            if (!cacheManager.isQuizActive) {
                console.log('[Bootstrap] Network restored. Triggering reconnection data sync.');
                eventBus.emit('NETWORK_RESTORED');
                eventBus.emit('RELOAD_CURRENT_VIEW');
            }
        }
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    // Android Back Button Handler
    const handleBack = () => {
        const currentRoute = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : 'home';

        if (typeof (window as any).ethioOnBackPress === 'function') {
            if ((window as any).ethioOnBackPress()) {
                // If handled by screen (e.g. Match Screen), prevent further routing and restore history
                try { window.history.pushState({ route: currentRoute }, '', window.location.href); } catch(e){}
                return;
            }
        }

        game.audioManager.playClick();
        const activeOverlay = document.querySelector('#session-recovery-overlay, #ethio-exit-modal, #ethio-leave-modal, .glass-card-modal, [id*="modal"]');
        if (activeOverlay) {
            activeOverlay.remove();
            try { window.history.pushState({ route: currentRoute }, '', window.location.href); } catch(e){}
            return;
        }

        if (cacheManager.isQuizActive) {
            showLeaveMatchDialog();
            try { window.history.pushState({ route: currentRoute }, '', window.location.href); } catch(e){}
            return;
        }

        // Only pop if we're not currently recovering from an active quiz game.
        // Wait, if cacheManager.isQuizActive is false, how do we know we just finished a game?
        // We can just pop the stack if it's a normal navigation back. 
        // But if we just finished a game, the game screen calls ethioHandleBack, we don't want to pop the screen we were on before the game.
        // Actually, the game screens should call a different method, but for now, we'll pop.
        
        // Wait, if it's the MatchStatsScreen calling ethioHandleBack, we should pop? No!
        // To fix this globally, we will check if we are on a bottom nav tab. If we have history, we pop.
        navigationStack.pop();

        if (navigationStack.length > 0) {
            const previousRoute = navigationStack[navigationStack.length - 1];
            renderRoute(previousRoute, false);
        } else {
            if (currentTab !== 'home') {
                navigateToTab('home');
            } else {
                showMaterial3ExitDialog();
                try { window.history.pushState({ route: 'home' }, '', window.location.href); } catch(e){}
            }
        }
    };

    const showLeaveMatchDialog = () => {
        const existingExit = document.getElementById('ethio-leave-modal');
        if (existingExit) return;

        const modal = document.createElement('div');
        modal.id = 'ethio-leave-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(2, 6, 23, 0.88); backdrop-filter: blur(16px);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            padding: 20px; box-sizing: border-box; pointer-events: auto;
        `;
        modal.innerHTML = `
            <div class="glass-card fade-in-up" style="width: 100%; max-width: 360px; padding: 28px 24px; text-align: center; border-radius: 20px;">
                <h2 style="font-size: 20px; font-weight: 900; color: white; margin: 0 0 8px 0; text-transform: uppercase;">LEAVE MATCH?</h2>
                <p style="font-size: 13px; color: #CBD5E1; margin: 0 0 24px 0; line-height: 1.4;">Your progress will be suspended. You can resume later.</p>
                <div style="display: flex; gap: 10px;">
                    <button id="leave-btn-continue" class="ethio-btn ethio-btn-primary" style="flex: 1;">CONTINUE</button>
                    <button id="leave-btn-leave" class="ethio-btn ethio-btn-secondary" style="flex: 1;">LEAVE</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('leave-btn-continue')?.addEventListener('click', () => {
            game.audioManager.playClick();
            modal.remove();
        });

        document.getElementById('leave-btn-leave')?.addEventListener('click', () => {
            game.audioManager.playClick();
            modal.remove();
            cacheManager.setQuizActive(false);
            
            // Re-render the current route instead of hardcoding 'home'
            const currentRoute = navigationStack.length > 0 ? navigationStack[navigationStack.length - 1] : 'home';
            renderRoute(currentRoute, false);
        });
    };

    const showMaterial3ExitDialog = () => {
        const existingExit = document.getElementById('ethio-exit-modal');
        if (existingExit) return;

        const modal = document.createElement('div');
        modal.id = 'ethio-exit-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(2, 6, 23, 0.88); backdrop-filter: blur(16px);
            z-index: 99999; display: flex; align-items: center; justify-content: center;
            padding: 20px; box-sizing: border-box; pointer-events: auto;
        `;
        modal.innerHTML = `
            <div class="glass-card fade-in-up" style="width: 100%; max-width: 360px; padding: 28px 24px; text-align: center; border-color: var(--fds-gold-primary); border-radius: 20px;">
                <div style="font-size: 44px; margin-bottom: 8px;">⚽🏆</div>
                <h2 style="font-size: 20px; font-weight: 900; color: white; margin: 0 0 8px 0; text-transform: uppercase;">EXIT ETHIOFANTASY?</h2>
                <p style="font-size: 13px; color: #CBD5E1; margin: 0 0 24px 0; line-height: 1.4;">Are you sure you want to exit the Football Quiz League? Your streak is saved.</p>
                <div style="display: flex; gap: 10px;">
                    <button id="exit-btn-stay" class="ethio-btn ethio-btn-primary" style="flex: 1;">STAY IN GAME</button>
                    <button id="exit-btn-confirm" class="ethio-btn ethio-btn-secondary" style="flex: 1; border-color: #EF4444; color: #FCA5A5;">EXIT APP</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('exit-btn-stay')?.addEventListener('click', () => {
            game.audioManager.playClick();
            modal.remove();
        });

        document.getElementById('exit-btn-confirm')?.addEventListener('click', () => {
            game.audioManager.playClick();
            modal.remove();
            window.history.back();
        });
    };

    window.addEventListener('popstate', (e) => {
        e.preventDefault();
        handleBack();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Back') {
            handleBack();
        }
    });

    winAny.ethioReloadHome = () => navigateToTab('home');
    winAny.ethioNavigateToTab = (tabId: TabId) => navigateToTab(tabId);
    winAny.ethioPlayAgain = async (compId: string) => {
        cacheManager.setQuizActive(true);
        const quizMode = registry.activeGame as QuizGameMode || new QuizGameMode();
        quizMode.setCompetition(compId);
        await registry.launchGame('football-quiz');
    };

    BottomNav.render((tabId) => {
        navigateToTab(tabId);
    });

    // 3. Login Refresh (Auth state change listener)
    let previousUserId: string | null = null;
    authManager.subscribe((user) => {
        const isStateChange = user?.id !== previousUserId;
        previousUserId = user?.id || null;

        if (!user) {
            console.log('[Bootstrap] User signed out. Invalidating cache.');
            cacheManager.clear();
            BottomNav.hide();
            const authScreen = new AuthScreen(
                game.uiManager, game.audioManager, authManager,
                () => {}
            );
            authScreen.render();
        } else {
            console.log('[Bootstrap] User authenticated. Refreshing profile & channels:', user.username);
            BottomNav.show();
            RealtimeService.getInstance().initUserChannels(user.id);
            eventBus.emit('PROFILE_UPDATED', user);

            if (isStateChange) {
                const activeSession = GameSessionManager.getInstance().getActiveSession();
                if (activeSession) {
                    const recoveryOverlay = document.createElement('div');
                    recoveryOverlay.id = 'session-recovery-overlay';
                    recoveryOverlay.style.cssText = `
                        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                        background: rgba(15,23,42,0.95); z-index: 20000; display: flex;
                        align-items: center; justify-content: center; padding: 20px;
                        box-sizing: border-box; pointer-events: auto;
                    `;
                    recoveryOverlay.innerHTML = `
                        <div class="glass-card fade-in-up" style="width: 100%; max-width: 360px; padding: 28px 20px; text-align: center; border-color: var(--fds-gold-primary);">
                            <div style="font-size: 48px; margin-bottom: 12px;">⚽⏱️</div>
                            <div style="font-size: 22px; font-weight: 900; color: white; margin-bottom: 6px;">RESUME MATCH?</div>
                            <div style="font-size: 14px; color: #94A3B8; margin-bottom: 24px;">An active match session was found. Would you like to resume it?</div>
                            <button id="btn-recovery-resume" class="m3-btn m3-btn-primary" style="width: 100%; margin-bottom: 12px;">Resume Match</button>
                            <button id="btn-recovery-discard" class="m3-btn m3-btn-secondary" style="width: 100%; border-color: #EF4444; color: #EF4444;">Discard Match</button>
                        </div>
                    `;
                    document.body.appendChild(recoveryOverlay);

                    document.getElementById('btn-recovery-resume')?.addEventListener('click', async () => {
                        game.audioManager.playClick();
                        recoveryOverlay.remove();
                        cacheManager.setQuizActive(true);
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
                    navigateToTab('home');
                }
            }
        }
    });

    console.log('[Bootstrap] ⚽ Smart Caching & Refresh Strategy initialized.');

    return game;
}
