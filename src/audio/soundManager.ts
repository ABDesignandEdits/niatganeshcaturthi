import { AudioSettings } from '../types';

class SoundManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private dholBeatStep = 0;
  private melodicStep = 0;
  private noiseBuffer: AudioBuffer | null = null;
  
  public settings: AudioSettings = {
    soundEnabled: true,
    musicEnabled: true,
    soundVolume: 0.7,
    musicVolume: 0.45,
  };

  constructor() {
    // Load persisted settings if available
    try {
      const saved = localStorage.getItem('mushak_audio_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.settings.musicEnabled ? this.settings.musicVolume : 0;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.settings.soundEnabled ? this.settings.soundVolume : 0;
      this.sfxGain.connect(this.ctx.destination);
    }

    if (!this.noiseBuffer && this.ctx) {
      try {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }
      } catch {
        // Fallback gracefully
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public userInteracted() {
    this.initContext();
    if (this.settings.musicEnabled && !this.isMusicPlaying) {
      this.startMusic();
    }
  }

  public updateSettings(newSettings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem('mushak_audio_settings', JSON.stringify(this.settings));
    } catch {
      // Ignore
    }

    if (this.musicGain) {
      this.musicGain.gain.value = this.settings.musicEnabled ? this.settings.musicVolume : 0;
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.settings.soundEnabled ? this.settings.soundVolume : 0;
    }

    if (this.settings.musicEnabled) {
      if (!this.isMusicPlaying) this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  // --- Dhol and Festive Instrument Synthesizers ---

  // Indian Dhol bass thump (Dha/Ge)
  private playDholBass(time: number, accent = false) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = accent ? 140 : 110;
    const endFreq = 50;

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.18);

    const baseVol = accent ? 0.45 : 0.28;
    gain.gain.setValueAtTime(baseVol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 0.23);
  }

  // Indian Dhol treble slap (Ta/Na/Tin)
  private playDholSlap(time: number, crisp = false) {
    if (!this.ctx || !this.musicGain) return;

    // High pitched ring
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(crisp ? 520 : 420, time);
    osc.frequency.exponentialRampToValueAtTime(260, time + 0.08);

    oscGain.gain.setValueAtTime(crisp ? 0.25 : 0.16, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(oscGain);
    oscGain.connect(this.musicGain);
    osc.start(time);
    osc.stop(time + 0.1);

    // Filtered noise snap
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2200;
      filter.Q.value = 3;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.musicGain);

      noise.start(time);
    }
  }

  // Traditional brass bell / Manjira chime
  private playManjiraChime(time: number) {
    if (!this.ctx || !this.musicGain) return;
    const freqs = [1850, 2460, 3100];
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f + idx * 12, time);

      const vol = 0.06 / (idx + 1);
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.musicGain!);
      osc.start(time);
      osc.stop(time + 0.36);
    });
  }

  // Melodic festive flute / sitar note
  private playMelodicNote(freq: number, time: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Gentle vibrato
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.value = 5.5;
    vibratoGain.gain.value = 4;
    vibrato.connect(osc.frequency);
    vibrato.start(time);
    vibrato.stop(time + duration);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(0.12, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Traditional Raag Bhupali / Bilawal scale frequencies (C4, D4, E4, G4, A4, C5, D5)
  private festiveNotes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  // Upbeat, joyous festive melody sequences
  private melodySeq = [
    0, 2, 3, 4, 5, 4, 3, 2,
    3, 4, 5, 6, 7, 5, 4, 3,
    4, 5, 7, 6, 5, 4, 3, 2,
    0, 2, 4, 3, 2, 0, 2, 0
  ];

  public startMusic() {
    if (this.isMusicPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isMusicPlaying = true;
    const tempo = 135; // Festive energetic BPM
    const stepDuration = 60 / tempo / 2; // 8th notes

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.settings.musicEnabled) return;

      const now = this.ctx.currentTime + 0.05;
      const step = this.dholBeatStep % 16;

      // Authentic Dhol festive groove:
      // Steps 0, 4, 7, 10, 12, 14 have specific drum hits
      if (step === 0) {
        this.playDholBass(now, true);
        this.playManjiraChime(now);
      } else if (step === 3) {
        this.playDholSlap(now, false);
      } else if (step === 6) {
        this.playDholBass(now, false);
      } else if (step === 8) {
        this.playDholBass(now, true);
        this.playDholSlap(now, true);
        this.playManjiraChime(now);
      } else if (step === 10) {
        this.playDholSlap(now, false);
      } else if (step === 12) {
        this.playDholBass(now, false);
      } else if (step === 14) {
        this.playDholSlap(now, true);
      }

      // Melodic accompaniment every 2 steps
      if (step % 2 === 0) {
        const noteIdx = this.melodySeq[this.melodicStep % this.melodySeq.length];
        const freq = this.festiveNotes[noteIdx];
        this.playMelodicNote(freq, now, stepDuration * 1.8);
        this.melodicStep++;
      }

      this.dholBeatStep++;
    }, stepDuration * 1000);
  }

  public stopMusic() {
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }

  // --- Sound Effects ---

  public playModakCollect() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const freqs = [659.25, 880, 1318.51]; // E5, A5, E6 sweet sparkling chime

    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.03);

      gain.gain.setValueAtTime(0.18, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.03 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.36);
    });
  }

  public playFlowerCollect() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(783.99, now); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1); // C6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  public playDurvaCollect() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  public playDiyaCollect() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Resonant warm brass bell
    [1046.50, 1567.98].forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.46);
    });
  }

  public playEcoItemCollect() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Earthy warm flute chime
    [440, 659.25, 880].forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.04);

      gain.gain.setValueAtTime(0.15, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.31);
    });
  }

  public playCombo(comboLevel: number) {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const baseFreq = 523.25; // C5
    const multiplier = Math.min(1 + comboLevel * 0.12, 2.5);
    const freq = baseFreq * multiplier;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 0.85, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.07);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.29);
  }

  public playPowerUp() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Ascending celebratory divine harp arpeggio
    const chord = [392, 523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.2, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.41);
    });
  }

  public playJump() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playSlide() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.18);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  // Gentle soft bump against obstacle (respectful, no violence)
  public playObstacleHit() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.14);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.19);
  }

  // Shankh (conch horn) resonance on Stage Clear / Victory
  public playShankhCelebration() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Sacred conch horn rise
    osc.frequency.setValueAtTime(290, now);
    osc.frequency.linearRampToValueAtTime(330, now + 0.5);
    osc.frequency.exponentialRampToValueAtTime(310, now + 1.2);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 850;
    filter.Q.value = 4;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.35);

    // Temple bells accompanying
    setTimeout(() => {
      [1046, 1318, 1567, 2093].forEach((f, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        g.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.12 + 0.6);
        o.connect(g);
        g.connect(this.sfxGain);
        o.start(this.ctx.currentTime + i * 0.12);
        o.stop(this.ctx.currentTime + i * 0.12 + 0.65);
      });
    }, 400);
  }

  public playQuizResult(isCorrect: boolean) {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    if (isCorrect) {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.18, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.36);
      });
    } else {
      [330, 311, 293].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.14, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.26);
      });
    }
  }

  // Heart Lost impact tone
  public playHeartLost() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Game Over deep gong sound
  public playGameOver() {
    if (!this.settings.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Deep resonant temple bell/gong
    [130.81, 196.0, 261.63].forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);
      osc.frequency.exponentialRampToValueAtTime(f * 0.75, now + idx * 0.08 + 0.9);

      gain.gain.setValueAtTime(0.28, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.1);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.15);
    });
  }
}

export const soundManager = new SoundManager();
