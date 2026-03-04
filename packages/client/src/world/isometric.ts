import type { Container } from 'pixi.js';

const SKEW_X = -0.5;
const SKEW_Y = 0.25;
const Y_SCALE = 0.7;

/**
 * Isometric view toggle — applies a skew transform to the world root.
 * Stores original Y scale to avoid floating-point drift on repeated toggles.
 */
export class IsometricView {
  private _enabled = false;
  private savedScaleY = 1;

  get enabled(): boolean { return this._enabled; }

  toggle(root: Container): void {
    this._enabled = !this._enabled;
    if (this._enabled) {
      this.savedScaleY = root.scale.y;
      root.skew.set(SKEW_X, SKEW_Y);
      root.scale.y = this.savedScaleY * Y_SCALE;
    } else {
      root.skew.set(0, 0);
      root.scale.y = this.savedScaleY;
    }
  }
}
