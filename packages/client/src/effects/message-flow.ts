import { Container, Graphics } from 'pixi.js';

/**
 * Message Flow Effect — animated glowing particles that fly
 * between agents when SendMessage is used.
 * Each message creates a small envelope/dot that arcs from sender to receiver.
 */

interface FlowParticle {
  gfx: Graphics;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: number;
  elapsed: number;
  duration: number;
}

const FLOW_DURATION = 800; // ms for particle to travel
const TRAIL_DOTS = 3;
const DOT_SIZE = 3;
const ARC_HEIGHT = 40; // curve apex height

export class MessageFlow {
  public readonly container = new Container();
  private particles: FlowParticle[] = [];

  /**
   * Send a visual message from one position to another.
   * @param fromX - sender world X
   * @param fromY - sender world Y
   * @param toX - receiver world X
   * @param toY - receiver world Y
   * @param color - hex color of the sender agent
   */
  send(fromX: number, fromY: number, toX: number, toY: number, color: number): void {
    const gfx = new Graphics();
    this.container.addChild(gfx);

    this.particles.push({
      gfx,
      fromX, fromY,
      toX, toY,
      color,
      elapsed: 0,
      duration: FLOW_DURATION,
    });
  }

  update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.elapsed += dt;

      if (p.elapsed >= p.duration) {
        this.container.removeChild(p.gfx);
        p.gfx.destroy();
        this.particles.splice(i, 1);
        continue;
      }

      const t = p.elapsed / p.duration;
      p.gfx.clear();

      // Draw main dot + trail dots
      for (let d = 0; d <= TRAIL_DOTS; d++) {
        const trailT = Math.max(0, t - d * 0.06);
        const pos = this.getArcPosition(p, trailT);
        const alpha = (1 - d / (TRAIL_DOTS + 1)) * (1 - t * 0.3);
        const size = DOT_SIZE * (1 - d * 0.2);

        p.gfx.circle(pos.x, pos.y, size).fill({ color: p.color, alpha });
      }

      // Draw glow around main dot
      const mainPos = this.getArcPosition(p, t);
      p.gfx.circle(mainPos.x, mainPos.y, DOT_SIZE * 2.5).fill({ color: p.color, alpha: 0.15 });
    }
  }

  /** Get position along a quadratic bezier arc */
  private getArcPosition(p: FlowParticle, t: number): { x: number; y: number } {
    // Control point at midpoint, offset upward
    const midX = (p.fromX + p.toX) / 2;
    const midY = (p.fromY + p.toY) / 2 - ARC_HEIGHT;

    // Quadratic bezier: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
    const mt = 1 - t;
    const x = mt * mt * p.fromX + 2 * mt * t * midX + t * t * p.toX;
    const y = mt * mt * p.fromY + 2 * mt * t * midY + t * t * p.toY;
    return { x, y };
  }

  destroy(): void {
    for (const p of this.particles) {
      p.gfx.destroy();
    }
    this.particles = [];
    this.container.destroy({ children: true });
  }
}
