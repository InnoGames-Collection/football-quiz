import { Scene } from '@babylonjs/core';
import { IGameMode, GameModeMetadata } from '../../core/interfaces/IGameMode';
import { UIManager } from '../../core/managers/UIManager';
import { AudioManager } from '../../core/managers/AudioManager';
import { SaveManager } from '../../core/managers/SaveManager';
import { QuizEngine } from '../../core/quiz/QuizEngine';
import { CompetitionRegistry } from '../../core/quiz/CompetitionRegistry';
import { ScoreboardQuestionScreen, QuestionData } from '../../ui/screens/ScoreboardQuestionScreen';
import { MatchStatsScreen } from '../../ui/screens/MatchStatsScreen';

export class QuizGameMode implements IGameMode {
    public readonly metadata: GameModeMetadata = {
        id: 'football-quiz',
        name: 'Football Quiz League',
        description: 'Televised sports match quiz with match stats, goal celebrations, and rewards!',
        is3D: false
    };

    private _uiManager!: UIManager;
    private _audioManager!: AudioManager;
    private _saveManager!: SaveManager;
    private _quizEngine!: QuizEngine;
    private _activeScoreboard: ScoreboardQuestionScreen | null = null;

    private _sampleQuestions: QuestionData[] = [
        { prompt: "Which Ethiopian club won the CAF Champions League (formerly African Cup of Champions Clubs) in 1968?", options: ["Saint George SC", "Omedla FC", "Cotton Factory Club", "Defense Force"], correctIndex: 0 },
        { prompt: "In which year did Ethiopia win the Africa Cup of Nations (AFCON)?", options: ["1957", "1962", "1970", "1984"], correctIndex: 1 },
        { prompt: "Who is the all-time top scorer for the Ethiopian National Football Team (Walia Ibex)?", options: ["Getaneh Kebede", "Saladin Said", "Luciano Vassalo", "Mengistu Worku"], correctIndex: 0 },
        { prompt: "Which country hosted the 2022 FIFA World Cup?", options: ["Qatar", "Brazil", "Russia", "South Africa"], correctIndex: 0 },
        { prompt: "Which player has won the most Ballon d'Or awards in history?", options: ["Cristiano Ronaldo", "Lionel Messi", "Zinedine Zidane", "Pelé"], correctIndex: 1 },
        { prompt: "Which stadium is known as 'The Theatre of Dreams'?", options: ["Santiago Bernabéu", "Old Trafford", "Camp Nou", "Anfield"], correctIndex: 1 },
        { prompt: "Which club has won the most UEFA Champions League titles?", options: ["AC Milan", "Bayern Munich", "Real Madrid", "Liverpool"], correctIndex: 2 },
        { prompt: "Which African player won the FIFA World Player of the Year in 1995?", options: ["Didier Drogba", "George Weah", "Samuel Eto'o", "Jay-Jay Okocha"], correctIndex: 1 },
        { prompt: "How long is a standard professional football match excluding extra time?", options: ["80 Minutes", "90 Minutes", "100 Minutes", "60 Minutes"], correctIndex: 1 },
        { prompt: "Who won the 2023-24 UEFA Champions League title?", options: ["Borussia Dortmund", "Real Madrid", "Manchester City", "Paris Saint-Germain"], correctIndex: 1 }
    ];

    public async initialize(_scene: Scene, uiManager: UIManager): Promise<void> {
        this._uiManager = uiManager;
        this._quizEngine = new QuizEngine();

        // Get singletons from root if available
        const winAny = window as any;
        this._audioManager = winAny.ethioAudio || new AudioManager();
        this._saveManager = winAny.ethioSave || new SaveManager();
    }

    public start(): void {
        const comp = CompetitionRegistry.getById('ethiopian-football') || CompetitionRegistry.getAll()[0];
        
        this._activeScoreboard = new ScoreboardQuestionScreen(
            this._uiManager,
            this._audioManager,
            this._quizEngine,
            comp,
            this._sampleQuestions,
            {
                onMatchComplete: () => this._showMatchStats(comp.id),
                onExitMatch: () => this.destroy()
            }
        );

        this._activeScoreboard.startMatch();
    }

    private _showMatchStats(gameId: string): void {
        const stats = this._quizEngine.calculateFinalStats();
        const statsScreen = new MatchStatsScreen(
            this._uiManager,
            this._saveManager,
            this._audioManager,
            stats,
            gameId,
            () => {
                const winAny = window as any;
                if (winAny.ethioReloadHome) {
                    winAny.ethioReloadHome();
                }
            }
        );
        statsScreen.render();
    }

    public update(_deltaTime: number): void {}

    public destroy(): void {
        if (this._activeScoreboard) {
            this._activeScoreboard.destroy();
            this._activeScoreboard = null;
        }
        this._uiManager.clear();
        console.log('[QuizGameMode] Destroyed.');
    }
}
