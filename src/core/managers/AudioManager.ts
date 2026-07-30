export class AudioManager {
    private _ctx: AudioContext | null = null;
    private _isMuted: boolean = false;
    private _crowdGain: GainNode | null = null;
    private _crowdSource: AudioBufferSourceNode | null = null;

    private _correctAnswerBuffer: AudioBuffer | null = null;
    private _activeCorrectAnswerSource: AudioBufferSourceNode | null = null;
    private _wrongAnswerBuffer: AudioBuffer | null = null;
    private _isWrongAnswerPlaying: boolean = false;
    private _answerSelectedBuffer: AudioBuffer | null = null;
    private _isAnswerSelectedPlaying: boolean = false;
    private _finalWhistleBuffer: AudioBuffer | null = null;
    private _questionArriveBuffer: AudioBuffer | null = null;

    constructor() {
        const savedMute = localStorage.getItem('ETHIO_FOOTBALL_MUTED');
        if (savedMute !== null) {
            this._isMuted = savedMute === 'true';
        }
    }

    /**
     * Lazy-load Web AudioContext on first user gesture.
     */
    private _initContext(): void {
        if (!this._ctx) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            this._ctx = new AudioCtx();
            console.log('[AudioManager] Football stadium Web AudioContext initialized.');
        }
        if (this._ctx.state === 'suspended') {
            this._ctx.resume();
        }
    }

    /**
     * Centralized Haptic Feedback Engine
     * Respects the global mute setting.
     */
    private _vibrate(pattern: number | number[]): void {
        if (this._isMuted) return;
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore if browser restricts
            }
        }
    }

    /**
     * 1. Button Click Sound (Tactile Touch Feedback)
     */
    public playClick(): void {
        if (this._isMuted) return;
        this._vibrate(10); // Light selection feedback
        this._initContext();
        if (!this._ctx) return;

        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this._ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this._ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this._ctx.destination);

        osc.start();
        osc.stop(this._ctx.currentTime + 0.05);
    }

    /**
     * 2. Referee Whistle Sound (Authentic Dual Frequency Whistle)
     */
    public playWhistle(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        const osc1 = this._ctx.createOscillator();
        const osc2 = this._ctx.createOscillator();
        const gain = this._ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(2400, this._ctx.currentTime);
        osc2.frequency.setValueAtTime(2450, this._ctx.currentTime);

        gain.gain.setValueAtTime(0.18, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.35);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this._ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(this._ctx.currentTime + 0.35);
        osc2.stop(this._ctx.currentTime + 0.35);
    }

    /**
     * Full Time Referee Whistle (2-3 short blasts for match end)
     */
    public playFullTimeWhistle(): void {
        if (this._isMuted) return;
        this._vibrate([30, 40, 30]); // Success Haptic (Match Completed)
        this._initContext();
        if (!this._ctx) return;

        if (!this._finalWhistleBuffer) {
            // Synthetic fallback
            const scheduleWhistle = (startTime: number, duration: number) => {
                if (!this._ctx) return;
                const osc1 = this._ctx.createOscillator();
                const osc2 = this._ctx.createOscillator();
                const gain = this._ctx.createGain();

                osc1.type = 'sine';
                osc2.type = 'sine';
                osc1.frequency.setValueAtTime(2400, startTime);
                osc2.frequency.setValueAtTime(2450, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.18, startTime + 0.05);
                gain.gain.setValueAtTime(0.18, startTime + duration - 0.1);
                gain.gain.linearRampToValueAtTime(0, startTime + duration);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(this._ctx.destination);

                osc1.start(startTime);
                osc2.start(startTime);
                osc1.stop(startTime + duration);
                osc2.stop(startTime + duration);
            };

            const now = this._ctx.currentTime;
            scheduleWhistle(now, 0.25);
            scheduleWhistle(now + 0.35, 0.25);
            scheduleWhistle(now + 0.7, 0.6);
            return;
        }

        const source = this._ctx.createBufferSource();
        source.buffer = this._finalWhistleBuffer;

        const gain = this._ctx.createGain();
        gain.gain.value = 0.75; // 75% volume

        source.connect(gain);
        gain.connect(this._ctx.destination);
        
        // Delay playback by 150ms after the final event so it feels natural
        source.start(this._ctx.currentTime + 0.15);
    }

    /**
     * 3. Stadium Crowd Ambience Loop
     */
    public playCrowdAmbience(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx || this._crowdSource) return;

        const bufferSize = this._ctx.sampleRate * 2;
        const buffer = this._ctx.createBuffer(1, bufferSize, this._ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            data[i] = (b0 + b1 + b2) * 0.04;
        }

        this._crowdSource = this._ctx.createBufferSource();
        this._crowdSource.buffer = buffer;
        this._crowdSource.loop = true;

        this._crowdGain = this._ctx.createGain();
        this._crowdGain.gain.setValueAtTime(0.04, this._ctx.currentTime);

        this._crowdSource.connect(this._crowdGain);
        this._crowdGain.connect(this._ctx.destination);
        this._crowdSource.start();
    }

    public stopCrowdAmbience(): void {
        if (this._crowdSource) {
            try {
                this._crowdSource.stop();
            } catch (e) {}
            this._crowdSource = null;
        }
    }

    /**
     * 4. Goal Celebration: Net Impact + Referee Whistle + Stadium Crowd Roar
     */
    public playGoalCheer(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        this.playWhistle();

        // Net Thud Impact
        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, this._ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this._ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.3, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this._ctx.destination);
        osc.start();
        osc.stop(this._ctx.currentTime + 0.12);

        // Victory Crowd Arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            if (!this._ctx) return;
            const noteOsc = this._ctx.createOscillator();
            const noteGain = this._ctx.createGain();

            noteOsc.type = 'triangle';
            noteOsc.frequency.setValueAtTime(freq, this._ctx.currentTime + idx * 0.08);

            noteGain.gain.setValueAtTime(0.2, this._ctx.currentTime + idx * 0.08);
            noteGain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + idx * 0.08 + 0.3);

            noteOsc.connect(noteGain);
            noteGain.connect(this._ctx.destination);

            noteOsc.start(this._ctx.currentTime + idx * 0.08);
            noteOsc.stop(this._ctx.currentTime + idx * 0.08 + 0.3);
        });
    }

    /**
     * 5. Missed Chance (Goalpost Hit + Disappointed Crowd Sigh)
     * Provides an immersive football "missed opportunity" sound.
     */
    public playWrongAnswer(): void {
        if (this._isMuted) return;
        this._vibrate([40, 20, 40]); // Medium Impact Haptic
        
        // If already playing, do not restart
        if (this._isWrongAnswerPlaying) return;

        // Prevent overlap with Correct Answer
        if (this._activeCorrectAnswerSource) {
            try { this._activeCorrectAnswerSource.stop(); } catch(e) {}
        }

        if (!this._wrongAnswerBuffer) {
            // Fail silently if playback is unavailable
            return;
        }

        this._initContext();
        if (!this._ctx) return;

        const source = this._ctx.createBufferSource();
        source.buffer = this._wrongAnswerBuffer;

        const gain = this._ctx.createGain();
        gain.gain.value = 0.7; // 70% volume

        source.connect(gain);
        gain.connect(this._ctx.destination);
        
        this._isWrongAnswerPlaying = true;
        source.onended = () => {
            this._isWrongAnswerPlaying = false;
        };

        source.start(0);
    }

    /**
     * Answer Selected Tone (MP3 Asset)
     * Plays immediately when an answer is tapped.
     */
    public playAnswerSelected(): void {
        if (this._isMuted) return;
        
        // Prevent rapid playback spam
        if (this._isAnswerSelectedPlaying) return;

        if (!this._answerSelectedBuffer) {
            this.playClick(); // synthetic fallback
            return;
        }

        this._initContext();
        if (!this._ctx) return;

        const source = this._ctx.createBufferSource();
        source.buffer = this._answerSelectedBuffer;

        const gain = this._ctx.createGain();
        gain.gain.value = 0.4; // 40% volume

        source.connect(gain);
        gain.connect(this._ctx.destination);
        
        this._isAnswerSelectedPlaying = true;
        (this as any)._activeAnswerSelectedSource = source;
        source.onended = () => {
            this._isAnswerSelectedPlaying = false;
        };

        source.start(0);
    }

    /**
     * Question Arrive (MP3 Asset)
     * Plays exactly when the Question begins dropping.
     */
    public playQuestionArrive(): void {
        if (this._isMuted) return;
        this._vibrate([10]); // Light vibration 10ms

        if (!this._questionArriveBuffer) return; // fail silently

        this._initContext();
        if (!this._ctx) return;

        const source = this._ctx.createBufferSource();
        source.buffer = this._questionArriveBuffer;

        const gain = this._ctx.createGain();
        gain.gain.value = 0.45; // 45% volume

        source.connect(gain);
        gain.connect(this._ctx.destination);
        
        source.start(0);
    }

    /**
     * 6. Countdown Warning: Heartbeat Pulse & Stadium Tension Ticking
     */
    public playCountdownWarning(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        // Sub-bass Heartbeat Thud
        const heartOsc = this._ctx.createOscillator();
        const heartGain = this._ctx.createGain();
        heartOsc.type = 'sine';
        heartOsc.frequency.setValueAtTime(70, this._ctx.currentTime);
        heartOsc.frequency.exponentialRampToValueAtTime(30, this._ctx.currentTime + 0.08);

        heartGain.gain.setValueAtTime(0.3, this._ctx.currentTime);
        heartGain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.08);

        heartOsc.connect(heartGain);
        heartGain.connect(this._ctx.destination);
        heartOsc.start();
        heartOsc.stop(this._ctx.currentTime + 0.08);

        // High Tension Tick
        const tickOsc = this._ctx.createOscillator();
        const tickGain = this._ctx.createGain();
        tickOsc.type = 'triangle';
        tickOsc.frequency.setValueAtTime(1200, this._ctx.currentTime);

        tickGain.gain.setValueAtTime(0.12, this._ctx.currentTime);
        tickGain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.04);

        tickOsc.connect(tickGain);
        tickGain.connect(this._ctx.destination);
        tickOsc.start();
        tickOsc.stop(this._ctx.currentTime + 0.04);
    }

    /**
     * Professional Preloading for Critical Audio Assets
     * Fetches and decodes the audio safely. Web Audio API decodeAudioData 
     * is fully supported on a suspended context (before first user gesture).
     */
    public async preloadAssets(): Promise<void> {
        if (this._isMuted) return;
        try {
            const [correctRes, wrongRes, selectRes, whistleRes, arriveRes] = await Promise.all([
                fetch('/assets/audios/Righ%20Answer%20score%20goal.m4a'),
                fetch('/assets/audios/wrong%20answer.m4a'),
                fetch('/assets/audios/Answer%20selected.m4a'),
                fetch('/assets/audios/whistle%20when%20game%20ends%20or%20timout.m4a'),
                fetch('/assets/audios/question-arrive.mp3') // Fallback since this one is missing
            ]);
            
            if (!this._ctx) {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                this._ctx = new AudioCtx();
            }

            if (correctRes.ok) {
                const arr = await correctRes.arrayBuffer();
                this._correctAnswerBuffer = await this._ctx.decodeAudioData(arr);
            }
            if (wrongRes.ok) {
                const arr = await wrongRes.arrayBuffer();
                this._wrongAnswerBuffer = await this._ctx.decodeAudioData(arr);
            }
            if (selectRes.ok) {
                const arr = await selectRes.arrayBuffer();
                this._answerSelectedBuffer = await this._ctx.decodeAudioData(arr);
            }
            if (whistleRes.ok) {
                const arr = await whistleRes.arrayBuffer();
                this._finalWhistleBuffer = await this._ctx.decodeAudioData(arr);
            }
            if (arriveRes.ok) {
                const arr = await arriveRes.arrayBuffer();
                this._questionArriveBuffer = await this._ctx.decodeAudioData(arr);
            }
            console.log('[AudioManager] Audio assets preloaded successfully.');
        } catch (err) {
            console.warn('[AudioManager] Failed to preload audio assets', err);
        }
    }

    /**
     * 7. Correct Answer Goal Sound (MP3 Asset)
     */
    public playCorrectAnswerGoal(): void {
        if (this._isMuted) return;
        this._vibrate([30, 40, 30]); // Haptic for success

        // If audio failed to load or unsupported, silently fallback
        if (!this._correctAnswerBuffer) {
            this.playGoalCheer(); // existing synthetic fallback
            return;
        }

        this._initContext();
        if (!this._ctx) return;

        // Stop any existing sounds to prevent overlapping
        if (this._activeCorrectAnswerSource) {
            try { this._activeCorrectAnswerSource.stop(); } catch(e) {}
        }
        // Also stop answer selected sound if it's still playing
        if ((this as any)._activeAnswerSelectedSource) {
            try { (this as any)._activeAnswerSelectedSource.stop(); } catch(e) {}
        }
        if ((this as any)._activeQuestionArriveSource) {
            try { (this as any)._activeQuestionArriveSource.stop(); } catch(e) {}
        }

        const source = this._ctx.createBufferSource();
        source.buffer = this._correctAnswerBuffer;
        
        const gain = this._ctx.createGain();
        gain.gain.value = 0.8; // 80% volume

        source.connect(gain);
        gain.connect(this._ctx.destination);
        
        source.start(0);
        this._activeCorrectAnswerSource = source;
    }

    /**
     * 8. Victory Fanfare
     */
    public playVictoryFanfare(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        const victoryNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        victoryNotes.forEach((freq, idx) => {
            if (!this._ctx) return;
            const osc = this._ctx.createOscillator();
            const gain = this._ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this._ctx.currentTime + idx * 0.1);

            gain.gain.setValueAtTime(0.25, this._ctx.currentTime + idx * 0.1);
            gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + idx * 0.1 + 0.35);

            osc.connect(gain);
            gain.connect(this._ctx.destination);

            osc.start(this._ctx.currentTime + idx * 0.1);
            osc.stop(this._ctx.currentTime + idx * 0.1 + 0.35);
        });
    }

    /**
     * 9. Defeat Sound (Soft Stadium Whistle + Soft Tone)
     */
    public playDefeatSound(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        this.playWhistle();
    }

    public toggleMute(): boolean {
        this._isMuted = !this._isMuted;
        localStorage.setItem('ETHIO_FOOTBALL_MUTED', String(this._isMuted));
        if (this._isMuted) {
            this.stopCrowdAmbience();
        }
        return this._isMuted;
    }

    public get isMuted(): boolean {
        return this._isMuted;
    }
}
