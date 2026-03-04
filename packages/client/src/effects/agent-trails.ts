import { Graphics, Container } from 'pixi.js';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

const RECORD_INTERVAL = 200; // ms between position samples
const MIN_MOVE_DIST = 5; // minimum px movement to record
const MAX_POINTS = 20; // per agent
const FADE_TIME = 4000; // ms to fully fade
const DOT_RADIUS = 2;

export class AgentTrails {
  public readonly container = new Container();
  private graphics = new Graphics();
  private trails = new Map<string, TrailPoint[]>();
  private timers = new Map<string, number>();
  private _enabled = false;

  constructor() {
    this.container.addChild(this.graphics);
    this.container.visible = false;
  }

  get enabled(): boolean { return this._enabled; }

  toggle(): void {
    this._enabled = !this._enabled;
    this.container.visible = this._enabled;
    if (!this._enabled) {
      this.trails.clear();
      this.timers.clear();
      this.graphics.clear();
    }
  }

  /** Record position for an agent (call every frame) */
  recordPosition(agentId: string, x: number, y: number, dt: number, color: number): void {
    if (!this._enabled) return;

    const elapsed = (this.timers.get(agentId) ?? 0) + dt;
    this.timers.set(agentId, elapsed);

    if (elapsed < RECORD_INTERVAL) return;
    this.timers.set(agentId, 0);

    let points = this.trails.get(agentId);
    if (!points) {
      points = [];
      this.trails.set(agentId, points);
    }

    // Only record if moved enough
    const last = points[points.length - 1];
    if (last) {
      const dx = x - last.x;
      const dy = y - last.y;
      if (dx * dx + dy * dy < MIN_MOVE_DIST * MIN_MOVE_DIST) return;
    }

    points.push({ x, y, age: 0 });
    if (points.length > MAX_POINTS) points.shift();
  }

  /** Remove trail data for an agent */
  removeAgent(agentId: string): void {
    this.trails.delete(agentId);
    this.timers.delete(agentId);
  }

  /** Per-frame update — age points and redraw */
  update(dt: number, agentColors: Map<string, number>): void {
    if (!this._enabled) return;

    this.graphics.clear();

    for (const [agentId, points] of this.trails) {
      const color = agentColors.get(agentId) ?? 0x4ade80;
      let i = 0;
      while (i < points.length) {
        points[i].age += dt;
        if (points[i].age >= FADE_TIME) {
          points.splice(i, 1);
        } else {
          const alpha = 0.4 * (1 - points[i].age / FADE_TIME);
          this.graphics.circle(points[i].x, points[i].y, DOT_RADIUS)
            .fill({ color, alpha });
          i++;
        }
      }
      if (points.length === 0) this.trails.delete(agentId);
    }
  }
}
