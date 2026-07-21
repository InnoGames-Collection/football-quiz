import { supabase, supabaseService } from '../supabase/SupabaseClient';
import { EdgeFunctionClient } from '../supabase/EdgeFunctionClient';
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
    private _cdcChannel: RealtimeChannel | null = null;
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

        // 1. Broadcast channel for instantaneous UI reactivity
        this._channel = supabase.channel(`live_match:${this._matchId}`, {
            config: { broadcast: { self: true } }
        });

        this._channel
            .on('broadcast', { event: 'match_event' }, (payload) => {
                const data = payload.payload as LiveMatchEventData;
                this._notify(data);
            })
            .subscribe();

        // 2. Postgres CDC channel on `live_match_answers` for DB persistence sync
        this._cdcChannel = supabase
            .channel(`public:live_match_answers:${this._matchId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'live_match_answers',
                    filter: `live_match_id=eq.${this._matchId}`
                },
                (payload) => {
                    const row = payload.new as any;
                    console.log('[LiveMatchClient] Postgres CDC answer insert detected:', row);
                    this._notify({
                        event: 'ANSWER_SUBMITTED',
                        userId: row.user_id,
                        questionIndex: row.question_index,
                        isCorrect: row.is_correct
                    });
                }
            )
            .subscribe();
    }

    public async sendAnswer(userId: string, questionIndex: number, isCorrect: boolean, currentScore: number): Promise<void> {
        const payload: LiveMatchEventData = {
            event: 'ANSWER_SUBMITTED',
            userId,
            questionIndex,
            score: currentScore,
            isCorrect
        };

        // Broadcast to realtime peers
        if (this._channel) {
            this._channel.send({
                type: 'broadcast',
                event: 'match_event',
                payload
            });
        }
        this._notify(payload);

        // Call live-match Edge Function for authoritative DB processing
        if (supabaseService.isOnline) {
            await EdgeFunctionClient.invoke('live-match', {
                liveMatchId: this._matchId,
                userId,
                questionIndex,
                selectedIndex: isCorrect ? 0 : 1, // sample payload index
                responseTimeMs: 1500
            });
        }
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
        if (this._cdcChannel && supabase) {
            supabase.removeChannel(this._cdcChannel);
            this._cdcChannel = null;
        }
        this._listeners.clear();
    }
}
