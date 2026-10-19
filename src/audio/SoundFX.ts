/**
 * DOSA HOUSE - Procedural Web Audio Sound Synthesizer
 * Provides authentic, cozy tactile sounds (wooden clicks, brass chimes, tawa sizzles)
 * without requiring external sound files.
 */

export class SoundFX {
  private static instance: SoundFX;
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.5;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private sizzleNode: AudioBufferSourceNode | null = null;
  private sizzleGain: GainNode | null = null;

  public static getInstance(): SoundFX {
    if (!SoundFX.instance) {
      SoundFX.instance = new SoundFX();
    }
    return SoundFX.instance;
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
    } else if (!muted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.musicVolume * 0.15, this.ctx.currentTime);
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  public setSFXVolume(vol: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain && this.ctx && !this.muted) {
      this.ambientGain.gain.setValueAtTime(this.musicVolume * 0.15, this.ctx.currentTime);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  /**
   * Cozy wooden tap sound for buttons
   */
  public playClick(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  /**
   * Delicate brass bell chime on hover
   */
  public playHover(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle warm pentatonic pitch
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.13);
  }

  /**
   * Traditional brass temple bell / restaurant service chime
   */
  public playBell(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const freqs = [1046, 1568, 2093]; // High sparkling harmonics
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const decay = 0.8 + idx * 0.3;
      gain.gain.setValueAtTime((0.15 / (idx + 1)) * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + decay);
    });
  }

  /**
   * Sizzling hot cast iron tawa sound
   */
  public playSizzle(duration: number = 1.2): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // White noise with soft brown variation
      data[i] = (Math.random() * 2 - 1) * (0.8 + Math.random() * 0.2);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(3200, ctx.currentTime);
    bandpass.Q.setValueAtTime(2.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.28 * this.sfxVolume, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35 * this.sfxVolume, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  }

  /**
   * Soft page turning whoosh for recipe book
   */
  public playPageTurn(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.25);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  }

  /**
   * Cozy South Indian drone / ambient warm chord
   */
  public startCozyAmbience(): void {
    if (this.ambientOsc) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(this.muted ? 0 : this.musicVolume * 0.08, ctx.currentTime);

    const rootOsc = ctx.createOscillator();
    rootOsc.type = 'triangle';
    rootOsc.frequency.setValueAtTime(146.83, ctx.currentTime); // D3 (warm tanpura key)

    const fifthOsc = ctx.createOscillator();
    fifthOsc.type = 'sine';
    fifthOsc.frequency.setValueAtTime(220.0, ctx.currentTime); // A3

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);

    rootOsc.connect(filter);
    fifthOsc.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(ctx.destination);

    rootOsc.start();
    fifthOsc.start();

    this.ambientOsc = rootOsc;
    this.ambientGain = droneGain;
  }
}
