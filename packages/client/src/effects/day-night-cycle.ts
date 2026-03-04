import { Graphics } from 'pixi.js';

const NIGHT_COLOR = 0x1a1a4a;
const NIGHT_ALPHA = 0.25;
const DAWN_START = 6;
const DAWN_END = 8;
const DUSK_START = 18;
const DUSK_END = 22;
const UPDATE_INTERVAL = 1000; // only recalculate once per second

export class DayNightCycle {
  public readonly overlay = new Graphics();
  private _enabled = false;
  private currentAlpha = 0;
  private updateTimer = 0;

  constructor(width: number, height: number) {
    // Fill with alpha: 1 — container alpha controls actual opacity
    this.overlay.rect(0, 0, width, height).fill({ color: NIGHT_COLOR, alpha: 1 });
    this.overlay.alpha = 0;
    this.overlay.eventMode = 'none';
    this.overlay.visible = false;
  }

  get enabled(): boolean { return this._enabled; }

  toggle(): void {
    this._enabled = !this._enabled;
    this.overlay.visible = this._enabled;
  }

  /** Per-frame update based on real wall-clock time (throttled to 1Hz) */
  update(dt: number): void {
    if (!this._enabled) return;

    this.updateTimer += dt;
    if (this.updateTimer < UPDATE_INTERVAL) {
      // Still smoothly interpolate toward target
      this.overlay.alpha += (this.currentAlpha - this.overlay.alpha) * 0.02;
      return;
    }
    this.updateTimer = 0;

    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;

    if (hour >= DUSK_END || hour < DAWN_START) {
      this.currentAlpha = NIGHT_ALPHA;
    } else if (hour >= DUSK_START && hour < DUSK_END) {
      this.currentAlpha = NIGHT_ALPHA * ((hour - DUSK_START) / (DUSK_END - DUSK_START));
    } else if (hour >= DAWN_START && hour < DAWN_END) {
      this.currentAlpha = NIGHT_ALPHA * (1 - (hour - DAWN_START) / (DAWN_END - DAWN_START));
    } else {
      this.currentAlpha = 0;
    }

    this.overlay.alpha += (this.currentAlpha - this.overlay.alpha) * 0.02;
  }
}
