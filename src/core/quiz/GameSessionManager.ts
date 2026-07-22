import { QuestionData } from '../../ui/screens/ScoreboardQuestionScreen';

export type SessionState = 'Ready' | 'Starting' | 'Playing' | 'Paused' | 'Resumed' | 'Completed' | 'Abandoned' | 'Expired';

export interface GameSession {
    sessionId: string;
    matchType: string;
    startTime: number;
    totalQuestions: number;
    difficulty: string;
    currentScore: number;
    currentIndex: number;
    timeLeftSec: number;
    questions: QuestionData[];
    choices: number[];
    responseTimes: number[];
    state: SessionState;
    correctCount: number;
    wrongCount: number;
    timeOutCount: number;
}

export class GameSessionManager {
    private static _instance: GameSessionManager | null = null;
    private readonly STORAGE_KEY = 'ETHIO_ACTIVE_SESSION_V3';
    private readonly HISTORY_KEY = 'ETHIO_SESSION_HISTORY_V3';

    public static getInstance(): GameSessionManager {
        if (!GameSessionManager._instance) {
            GameSessionManager._instance = new GameSessionManager();
        }
        return GameSessionManager._instance;
    }

    public createSession(matchType: string, difficulty: string, questions: QuestionData[]): GameSession {
        const session: GameSession = {
            sessionId: 'SESS-' + Math.floor(100000 + Math.random() * 900000),
            matchType,
            startTime: Date.now(),
            totalQuestions: questions.length,
            difficulty,
            currentScore: 0,
            currentIndex: 0,
            timeLeftSec: 15,
            questions,
            choices: [],
            responseTimes: [],
            state: 'Playing',
            correctCount: 0,
            wrongCount: 0,
            timeOutCount: 0
        };
        this.saveSession(session);
        return session;
    }

    public getActiveSession(): GameSession | null {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (!saved) return null;
        try {
            const session: GameSession = JSON.parse(saved);
            if (session.state === 'Completed' || session.state === 'Abandoned' || session.state === 'Expired') {
                return null;
            }
            return session;
        } catch (e) {
            return null;
        }
    }

    public saveSession(session: GameSession): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    }

    public clearSession(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    public autoSaveProgress(
        session: GameSession,
        index: number,
        chosenIdx: number,
        responseTime: number,
        isCorrect: boolean,
        score: number,
        timeLeftSec: number
    ): void {
        session.currentIndex = index;
        session.choices.push(chosenIdx);
        session.responseTimes.push(responseTime);
        session.currentScore = score;
        session.timeLeftSec = timeLeftSec;

        if (chosenIdx === -1) {
            session.timeOutCount++;
        } else if (isCorrect) {
            session.correctCount++;
        } else {
            session.wrongCount++;
        }

        this.saveSession(session);
    }

    public abandonSession(session: GameSession): void {
        session.state = 'Abandoned';
        this.saveSession(session);
        this.addToHistory(session);
        this.clearSession();
    }

    public completeSession(session: GameSession, finalScore: number): void {
        session.state = 'Completed';
        session.currentScore = finalScore;
        this.saveSession(session);
        this.addToHistory(session);
        this.clearSession();
    }

    public addToHistory(session: GameSession): void {
        const historyJson = localStorage.getItem(this.HISTORY_KEY);
        let history = [];
        if (historyJson) {
            try {
                history = JSON.parse(historyJson);
            } catch (e) {
                history = [];
            }
        }
        history.push({
            sessionId: session.sessionId,
            matchType: session.matchType,
            score: session.currentScore,
            correct: session.correctCount,
            wrong: session.wrongCount,
            timeOut: session.timeOutCount,
            accuracy: session.totalQuestions > 0 ? Math.round((session.correctCount / session.totalQuestions) * 100) : 0,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    }
}
