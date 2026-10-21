export type SoundEffectType = 'select' | 'move' | 'scroll' | 'spin' | 'ko' | 'win';

export class ShinobiAudioEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  public init(): void {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(effect: SoundEffectType): void {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (effect === 'select') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(1240, now + 0.06);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (effect === 'move') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(135, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (effect === 'scroll') {
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.1, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + 0.36);
        });
      } else if (effect === 'spin') {
        const clickOffsets = [
          0.00, 0.04, 0.08, 0.12, 0.16, 0.20, 0.25, 0.31, 0.38, 0.46,
          0.55, 0.65, 0.76, 0.89, 1.03, 1.19, 1.37, 1.57, 1.79, 2.02,
          2.22, 2.38,
        ];
        clickOffsets.forEach((offset, idx) => {
          if (!this.ctx) return;
          const t = now + offset;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          const freq = 440 - idx * 6;
          osc.frequency.setValueAtTime(freq, t);
          const isFinal = idx === clickOffsets.length - 1;
          gain.gain.setValueAtTime(isFinal ? 0.14 : 0.07, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + (isFinal ? 0.06 : 0.03));
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + (isFinal ? 0.07 : 0.035));
        });
      } else if (effect === 'ko') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(98, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.45);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
      } else if (effect === 'win') {
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          if (!this.ctx) return;
          const t = now + idx * 0.11;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.56);
        });
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }
}

export const soundEngine = new ShinobiAudioEngine();
