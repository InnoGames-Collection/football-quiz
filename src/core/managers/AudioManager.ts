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
            console.log('[AudioManager] Football stadium Web AudioContext initialized.');
        }
        if (this._ctx.state === 'suspended') {
            this._ctx.resume();
        }
    }

    /**
     * 1. Button Click Sound (Tactile Touch Feedback)
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
     * 5. Goalkeeper Save Sound (Ball Rebound + Gloves Deflection + Disappointed Crowd Gasp)
     * Replaces harsh negative buzzer sounds!
     */
    public playWrongAnswer(): void {
        this.playKeeperSave();
    }

    public playKeeperSave(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        // Glove Deflection Thud (Low Pass Burst)
        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, this._ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this._ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.25, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this._ctx.destination);

        osc.start();
        osc.stop(this._ctx.currentTime + 0.15);

        // Disappointed Crowd Sigh / Gasp (Filtered noise ramp down)
        const bufferSize = this._ctx.sampleRate * 0.4;
        const buffer = this._ctx.createBuffer(1, bufferSize, this._ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const noise = this._ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this._ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, this._ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(150, this._ctx.currentTime + 0.35);

        const noiseGain = this._ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12, this._ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.35);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this._ctx.destination);
        noise.start();
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
     * 7. Correct Answer Tone (Short Chime)
     */
    public playCorrectAnswer(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this._ctx.currentTime);
        osc.frequency.setValueAtTime(1760, this._ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.2, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.22);

        osc.connect(gain);
        gain.connect(this._ctx.destination);

        osc.start();
        osc.stop(this._ctx.currentTime + 0.22);
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
