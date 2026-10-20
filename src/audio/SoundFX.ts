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
  private ambientFifth: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private sizzleNode: AudioBufferSourceNode | null = null;
  private sizzleGain: GainNode | null = null;
  private melodyIntervalId: number | null = null;
  private isAmbienceRunning: boolean = false;
  private readonly SETTINGS_KEY = 'DOSA_HOUSE_SETTINGS_V1';

  private constructor() {
    this.loadSettings();
  }

  public static getInstance(): SoundFX {
    if (!SoundFX.instance) {
      SoundFX.instance = new SoundFX();
    }
    return SoundFX.instance;
  }

  private loadSettings(): void {
    try {
      const raw = localStorage.getItem(this.SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.sfxVolume === 'number') this.sfxVolume = Phaser.Math.Clamp(parsed.sfxVolume, 0, 1);
        if (typeof parsed.musicVolume === 'number') this.musicVolume = Phaser.Math.Clamp(parsed.musicVolume, 0, 1);
        if (typeof parsed.muted === 'boolean') this.muted = parsed.muted;
      }
    } catch {}
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify({
        sfxVolume: this.sfxVolume,
        musicVolume: this.musicVolume,
        muted: this.muted
      }));
    } catch {}
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
    this.saveSettings();
    if (muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx ? this.ctx.currentTime : 0);
    } else if (!muted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.musicVolume * 0.16, this.ctx.currentTime);
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
    this.saveSettings();
  }

  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
    if (this.ambientGain && this.ctx && !this.muted) {
      this.ambientGain.gain.setValueAtTime(this.musicVolume * 0.16, this.ctx.currentTime);
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
   * Batter pour sound: Liquid glug + instant sizzle
   */
  public playBatterPour(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // 1. Liquid glug drop
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 0.12);

    oscGain.gain.setValueAtTime(0.3 * this.sfxVolume, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);

    // 2. High sizzle burst
    this.playSizzle(1.5);
  }

  /**
   * Soft rhythmic glide swish as ladle circles on tawa
   */
  public playSwirlGlide(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const bufferSize = Math.floor(ctx.sampleRate * 0.14);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  }

  /**
   * Celebratory success chime for good spread
   */
  public playSuccessChime(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [659.25, 830.61, 987.77]; // E5, G#5, B5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setValueAtTime(0.18 * this.sfxVolume, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.5);
    });
  }

  /**
   * Sizzling golden ghee drizzle
   */
  public playGheeDrizzle(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Splattering high sizzle with bubbling noise
    const bufferSize = Math.floor(ctx.sampleRate * 0.45);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackle bursts
      const burst = Math.random() > 0.85 ? 1.8 : 0.6;
      data[i] = (Math.random() * 2 - 1) * burst;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3600, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(2400, ctx.currentTime + 0.45);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.24 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  }

  /**
   * Spatula sliding under crispy dosa edge
   */
  public playSpatulaScrape(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const bufferSize = Math.floor(ctx.sampleRate * 0.22);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.9;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(4200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.2);
    filter.Q.setValueAtTime(4.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  }

  /**
   * Dosa flip whoosh and hot iron contact slap
   */
  public playDosaFlip(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // 1. Whoosh sweep
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.18);

    oscGain.gain.setValueAtTime(0.25 * this.sfxVolume, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);

    // 2. Iron slap sizzle
    setTimeout(() => {
      this.playSizzle(0.7);
    }, 120);
  }

  /**
   * Crisp crunchy crackle fold
   */
  public playCrispFold(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // 3 rapid micro-snaps mimicking golden crispy wafer folding
    for (let s = 0; s < 3; s++) {
      const delay = s * 0.06;
      const bufferSize = Math.floor(ctx.sampleRate * 0.08);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2800 + s * 400, ctx.currentTime + delay);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22 * this.sfxVolume, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(ctx.currentTime + delay);
    }
  }

  /**
   * Spooning topping / spice sprinkle sound
   */
  public playToppingAdd(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Warm ceramic tap + gentle sizzle
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);

    this.playSizzle(0.4);
  }

  /**
   * Finished hot dosa landing on banana leaf platter
   */
  public playPlateThud(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Deep gentle wooden/leaf thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
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
   * Background drone sound disabled per user request
   */
  public startCozyAmbience(): void {
    this.stopCozyAmbience();
  }

  public stopCozyAmbience(): void {
    if (this.melodyIntervalId !== null) {
      clearInterval(this.melodyIntervalId);
      this.melodyIntervalId = null;
    }
    if (this.ambientOsc) {
      try { this.ambientOsc.stop(); } catch {}
      this.ambientOsc = null;
    }
    if (this.ambientFifth) {
      try { this.ambientFifth.stop(); } catch {}
      this.ambientFifth = null;
    }
    this.isAmbienceRunning = false;
  }

  /**
   * Ascending combo streak chime
   */
  public playCombo(comboCount: number): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const baseFreq = 440 * Math.pow(1.12, Math.min(6, comboCount));
    const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5]; // Major chord burst

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.24 * this.sfxVolume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.38);
    });
  }

  /**
   * Sparkling star award pop for level complete modal
   */
  public playStarPop(starIndex: number): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const pitches = [1046.5, 1318.5, 1568.0]; // C6, E6, G6
    const freq = pitches[(starIndex - 1) % pitches.length] || 1046.5;

    const osc = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    gain.gain.setValueAtTime(0.26 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    oscHarmonic.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.48);
    oscHarmonic.stop(ctx.currentTime + 0.48);
  }

  /**
   * Triumphant South Indian celebration fanfare (Day complete / Level cleared)
   */
  public playCelebrationFanfare(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // Pentatonic ascending fanfare flourish (Mohanam)
    const notes = [293.66, 369.99, 440.0, 587.33, 739.99, 880.0];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + idx * 0.11;
      const dur = idx === notes.length - 1 ? 0.9 : 0.28;

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.28 * this.sfxVolume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + dur + 0.05);
    });
  }

  /**
   * Nuanced topping sprinkle sound based on ingredient category
   */
  public playToppingSprinkle(category: 'powder' | 'paste' | 'chunk' | 'liquid' = 'chunk'): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    if (category === 'powder') {
      // Hissing fine powder shower (podi, pepper)
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(ctx.currentTime);
    } else if (category === 'paste') {
      // Wet spatula smear glide (mysore paste)
      this.playSwirlGlide();
    } else if (category === 'liquid') {
      this.playGheeDrizzle();
    } else {
      // Soft gentle drop (masala, paneer, shallots, cheese)
      this.playToppingAdd();
    }
  }

  /**
   * Brass service counter bell ding when customer arrives or order is accepted
   */
  public playOrderBell(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    // High fundamental + upper harmonic ping
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1760, ctx.currentTime); // A6
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3520, ctx.currentTime); // A7

    gain.gain.setValueAtTime(0.28 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 1.25);
    osc2.stop(ctx.currentTime + 1.25);
  }

  /**
   * Joyful sparkling chime when customer is delighted with their dosa
   */
  public playCustomerDelight(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.22 * this.sfxVolume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  /**
   * Descending gentle wobble tone when customer is disappointed or times out
   */
  public playCustomerDisappoint(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.45);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.45);

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.48);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  }

  /**
   * Rapid coin clatter shower when tips and earnings are rewarded
   */
  public playCoinShower(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const freqs = [1800, 2200, 2600, 3100];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = ctx.currentTime + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.14);
    });
  }
}

