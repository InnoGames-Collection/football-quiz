import { supabase, supabaseService } from '../supabase/SupabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface LiveMatchEventData {
    event: 'ANSWER_SUBMITTED' | 'QUESTION_ADVANCE' | 'MATCH_FINISH';
    userId: string;
    questionIndex?: number;
    score?: number;
    isCorrect?: boolean;
    finalScores?: { playerA: number; playerB: number };
}

export type LiveMatchEventListener = (event: LiveMatchEventData) => void;

export class LiveMatchClient {
    private _channel: RealtimeChannel | null = null;
    private _matchId: string;
    private _listeners: Set<LiveMatchEventListener> = new Set();

    constructor(matchId: string) {
        this._matchId = matchId;
    }

    public connect(): void {
        if (!supabaseService.isOnline || !supabase) {
            console.log(`[LiveMatchClient] Offline mode — simulated channel for ${this._matchId}`);
            return;
        }

        this._channel = supabase.channel(`live_match:${this._matchId}`, {
            config: {
                broadcast: { self: true }
            }
        });

        this._channel
            .on('broadcast', { event: 'match_event' }, (payload) => {
                const data = payload.payload as LiveMatchEventData;
                this._notify(data);
            })
            .subscribe((status) => {
                console.log(`[LiveMatchClient] Subscription status: ${status}`);
            });
    }

    public sendAnswer(userId: string, questionIndex: number, isCorrect: boolean, currentScore: number): void {
        const payload: LiveMatchEventData = {
            event: 'ANSWER_SUBMITTED',
            userId,
            questionIndex,
            score: currentScore,
            isCorrect
        };

        if (this._channel) {
            this._channel.send({
                type: 'broadcast',
                event: 'match_event',
                payload
            });
        }
        this._notify(payload);
    }

    public sendFinishMatch(userId: string, finalScore: number): void {
        const payload: LiveMatchEventData = {
            event: 'MATCH_FINISH',
            userId,
            score: finalScore
        };

        if (this._channel) {
            this._channel.send({
                type: 'broadcast',
                event: 'match_event',
                payload
            });
        }
        this._notify(payload);
    }

    public onEvent(listener: LiveMatchEventListener): () => void {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    private _notify(data: LiveMatchEventData): void {
        this._listeners.forEach(l => l(data));
    }

    public disconnect(): void {
        if (this._channel && supabase) {
            supabase.removeChannel(this._channel);
            this._channel = null;
        }
        this._listeners.clear();
    }
}
