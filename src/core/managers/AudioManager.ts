export class AudioManager {
    private _ctx: AudioContext | null = null;
    private _isMuted: boolean = false;
    private _crowdGain: GainNode | null = null;
    private _crowdSource: AudioBufferSourceNode | null = null;

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
            console.log('[AudioManager] AudioContext lazy-initialized.');
        }
        if (this._ctx.state === 'suspended') {
            this._ctx.resume();
        }
    }

    /**
     * 1. Button Click Sound
     */
    public playClick(): void {
        if (this._isMuted) return;
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
     * 2. Referee Whistle Sound
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

        gain.gain.setValueAtTime(0.2, this._ctx.currentTime);
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
     * 3. Stadium Crowd Ambience Loop (Synthesized procedural crowd roar)
     */
    public playCrowdAmbience(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx || this._crowdSource) return;

        // Generate 2 seconds of pink/white noise for crowd ambience
        const bufferSize = this._ctx.sampleRate * 2;
        const buffer = this._ctx.createBuffer(1, bufferSize, this._ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            data[i] = (b0 + b1 + b2) * 0.05;
        }

        this._crowdSource = this._ctx.createBufferSource();
        this._crowdSource.buffer = buffer;
        this._crowdSource.loop = true;

        this._crowdGain = this._ctx.createGain();
        this._crowdGain.gain.setValueAtTime(0.05, this._ctx.currentTime);

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
     * 4. Goal Celebration Crowd Cheer & Ascending Arpeggio
     */
    public playGoalCheer(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        this.playWhistle();

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            if (!this._ctx) return;
            const osc = this._ctx.createOscillator();
            const gain = this._ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this._ctx.currentTime + idx * 0.08);

            gain.gain.setValueAtTime(0.25, this._ctx.currentTime + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + idx * 0.08 + 0.3);

            osc.connect(gain);
            gain.connect(this._ctx.destination);

            osc.start(this._ctx.currentTime + idx * 0.08);
            osc.stop(this._ctx.currentTime + idx * 0.08 + 0.3);
        });
    }

    /**
     * 5. Correct Answer Sound (Positive Double Ding)
     */
    public playCorrectAnswer(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this._ctx.currentTime); // A5
        osc.frequency.setValueAtTime(1760, this._ctx.currentTime + 0.1); // A6

        gain.gain.setValueAtTime(0.2, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this._ctx.destination);

        osc.start();
        osc.stop(this._ctx.currentTime + 0.25);
    }

    /**
     * 6. Wrong Answer Sound (Low Pitch Buzzer)
     */
    public playWrongAnswer(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, this._ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this._ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.2, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this._ctx.destination);

        osc.start();
        osc.stop(this._ctx.currentTime + 0.25);
    }

    /**
     * 7. Countdown Warning Sound (Last 5 Seconds Warning Tick)
     */
    public playCountdownWarning(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, this._ctx.currentTime);

        gain.gain.setValueAtTime(0.18, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this._ctx.destination);

        osc.start();
        osc.stop(this._ctx.currentTime + 0.08);
    }

    /**
     * 8. Victory Fanfare (Full Time Victory Theme)
     */
    public playVictoryFanfare(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        const victoryNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        victoryNotes.forEach((freq, idx) => {
            if (!this._ctx) return;
            const osc = this._ctx.createOscillator();
            const gain = this._ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this._ctx.currentTime + idx * 0.12);

            gain.gain.setValueAtTime(0.3, this._ctx.currentTime + idx * 0.12);
            gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + idx * 0.12 + 0.4);

            osc.connect(gain);
            gain.connect(this._ctx.destination);

            osc.start(this._ctx.currentTime + idx * 0.12);
            osc.stop(this._ctx.currentTime + idx * 0.12 + 0.4);
        });
    }

    /**
     * 9. Defeat Sound (Minor Descending Chord)
     */
    public playDefeatSound(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        const defeatNotes = [440.00, 415.30, 392.00, 349.23]; // A4, G#4, G4, F4
        defeatNotes.forEach((freq, idx) => {
            if (!this._ctx) return;
            const osc = this._ctx.createOscillator();
            const gain = this._ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this._ctx.currentTime + idx * 0.15);

            gain.gain.setValueAtTime(0.2, this._ctx.currentTime + idx * 0.15);
            gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + idx * 0.15 + 0.4);

            osc.connect(gain);
            gain.connect(this._ctx.destination);

            osc.start(this._ctx.currentTime + idx * 0.15);
            osc.stop(this._ctx.currentTime + idx * 0.15 + 0.4);
        });
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
