export class AudioManager {
    private _ctx: AudioContext | null = null;
    private _isMuted: boolean = false;

    constructor() {
        // AudioContext lazy-initialized on first user gesture
    }

    private _initContext(): void {
        if (!this._ctx) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            this._ctx = new AudioCtx();
        }
        if (this._ctx.state === 'suspended') {
            this._ctx.resume();
        }
    }

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

    public playKick(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this._ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this._ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.5, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this._ctx.destination);

        osc.start();
        osc.stop(this._ctx.currentTime + 0.15);
    }

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
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this._ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(this._ctx.currentTime + 0.3);
        osc2.stop(this._ctx.currentTime + 0.3);
    }

    public playGoalCheer(): void {
        if (this._isMuted) return;
        this._initContext();
        if (!this._ctx) return;

        // Play whistle followed by chime
        this.playWhistle();

        const osc = this._ctx.createOscillator();
        const gain = this._ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this._ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, this._ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, this._ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, this._ctx.currentTime + 0.3); // C6

        gain.gain.setValueAtTime(0.2, this._ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this._ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(this._ctx.destination);

        osc.start();
        osc.stop(this._ctx.currentTime + 0.6);
    }

    public toggleMute(): boolean {
        this._isMuted = !this._isMuted;
        return this._isMuted;
    }

    public get isMuted(): boolean {
        return this._isMuted;
    }
}
