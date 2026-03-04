import { Graphics } from 'pixi.js';

const NIGHT_COLOR = 0x1a1a4a;
const NIGHT_ALPHA = 0.45;
const MIN_ALPHA = 0.15; // visible tint even during daytime so toggle is obvious
const DAWN_START = 6;
const DAWN_END = 8;
const DUSK_START = 18;
const DUSK_END = 22;
const UPDATE_INTERVAL = 1000; // recalculate time-of-day once per second
const LERP_SPEED = 3; // per-second lerp factor

export class DayNightCycle {
  public readonly overlay = new Graphics();
  private _enabled = false;
  private targetAlpha = 0;
  private updateTimer = 0;

  constructor(width: number, height: number) {
    this.overlay.rect(0, 0, width, height).fill({ color: NIGHT_COLOR, alpha: 1 });
    this.overlay.alpha = 0;
    this.overlay.eventMode = 'none';
    this.overlay.visible = false;
  }

  get enabled(): boolean { return this._enabled; }

  toggle(): void {
    this._enabled = !this._enabled;
    this.overlay.visible = this._enabled;
    if (this._enabled) {
      // Immediately compute and apply so the user sees feedback
      this.computeTargetAlpha();
      this.overlay.alpha = this.targetAlpha;
    }
  }

  private computeTargetAlpha(): void {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;

    let timeAlpha: number;
    if (hour >= DUSK_END || hour < DAWN_START) {
      timeAlpha = NIGHT_ALPHA;
    } else if (hour >= DUSK_START && hour < DUSK_END) {
      timeAlpha = NIGHT_ALPHA * ((hour - DUSK_START) / (DUSK_END - DUSK_START));
    } else if (hour >= DAWN_START && hour < DAWN_END) {
      timeAlpha = NIGHT_ALPHA * (1 - (hour - DAWN_START) / (DAWN_END - DAWN_START));
    } else {
      timeAlpha = 0;
    }

    this.targetAlpha = Math.max(timeAlpha, MIN_ALPHA);
  }

  /** Per-frame update based on real wall-clock time */
  update(dt: number): void {
    if (!this._enabled) return;

    this.updateTimer += dt;
    if (this.updateTimer >= UPDATE_INTERVAL) {
      this.updateTimer = 0;
      this.computeTargetAlpha();
    }

    // Frame-rate independent lerp toward target
    const t = 1 - Math.exp(-LERP_SPEED * dt / 1000);
    this.overlay.alpha += (this.targetAlpha - this.overlay.alpha) * t;
  }
}
