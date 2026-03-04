import type { Graphics } from 'pixi.js';
import type { ZoneId } from '@agent-move/shared';

export type ZoneDecoratorFn = (g: Graphics, x: number, y: number, w: number, h: number) => void;

export interface ThemeColors {
  background: number;
  gridLine: number;
  gridLineSub: number;
}

export interface Theme {
  id: string;
  name: string;
  icon: string;
  colors: ThemeColors;
  decorators: Record<ZoneId, ZoneDecoratorFn>;
}
