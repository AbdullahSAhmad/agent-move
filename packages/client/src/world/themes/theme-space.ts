import { Graphics } from 'pixi.js';
import type { Theme, ZoneDecoratorFn } from './theme-types.js';
import type { ZoneId } from '@agent-move/shared';

const PX = 4;
const P = (n: number) => n * PX;

const C = {
  hull: 0x2a2a3a, hullLight: 0x3a3a4a, hullDark: 0x1a1a2a,
  panel: 0x333350, panelLight: 0x444468, panelDark: 0x222240,
  floor: 0x1e1e30, floorAlt: 0x242438, floorLine: 0x16162a,
  led: 0x44ff88, ledBlue: 0x4488ff, ledRed: 0xff4444, ledOff: 0x222233,
  screen: 0x003344, screenGlow: 0x00aacc, screenBright: 0x00ddff,
  holo: 0x6644ff, holoGlow: 0x8866ff, holoBright: 0xaa88ff,
  metal: 0x777788, metalDark: 0x555566, metalBright: 0x9999aa,
  airlock: 0x444466, airlockEdge: 0x666688,
  star: 0xffffff,
};

function px(g: Graphics, x: number, y: number, w: number, h: number, c: number) {
  g.rect(x, y, w, h).fill(c);
}

function drawMetalFloor(g: Graphics, x: number, y: number, w: number, h: number) {
  px(g, x, y, w, h, C.floor);
  for (let py = 0; py < h; py += P(4)) px(g, x, y + py, w, 1, C.floorLine);
  for (let px2 = 0; px2 < w; px2 += P(8)) px(g, x + px2, y, 1, h, C.floorLine);
  // Rivets
  for (let py = P(2); py < h; py += P(8))
    for (let px2 = P(2); px2 < w; px2 += P(8))
      px(g, x + px2, y + py, P(1), P(1), C.floorAlt);
}

function drawControlPanel(g: Graphics, x: number, y: number, w: number) {
  px(g, x, y, w, P(10), C.panel);
  px(g, x, y, w, P(1), C.panelLight);
  px(g, x + P(2), y + P(2), w - P(4), P(4), C.screen);
  px(g, x + P(3), y + P(3), w - P(6), P(1), C.screenGlow);
  for (let i = 0; i < 3; i++) px(g, x + P(2) + i * P(3), y + P(7), P(2), P(2), C.ledBlue);
}

function drawHoloDisplay(g: Graphics, cx: number, cy: number) {
  px(g, cx - P(3), cy, P(6), P(1), C.metalDark);
  for (let i = 0; i < 5; i++) {
    const a = 0.3 - i * 0.05;
    const w = P(8) - i * P(1);
    px(g, cx - w / 2, cy - P(2) - i * P(2), w, P(1), C.holo);
  }
  px(g, cx - P(1), cy - P(4), P(2), P(2), C.holoBright);
}

const decorators: Record<ZoneId, ZoneDecoratorFn> = {
  search: (g, x, y, w, h) => { drawMetalFloor(g, x, y, w, h); drawControlPanel(g, x + P(4), y + P(7), P(20)); drawControlPanel(g, x + P(28), y + P(7), P(20)); drawHoloDisplay(g, x + w / 2, y + h / 2); },
  terminal: (g, x, y, w, h) => { drawMetalFloor(g, x, y, w, h); for (let i = 0; i < 3; i++) { px(g, x + P(2) + i * P(10), y + P(7), P(7), P(14), C.hull); for (let j = 0; j < 4; j++) { px(g, x + P(3) + i * P(10), y + P(8) + j * P(3), P(5), P(2), C.panelDark); px(g, x + P(4) + i * P(10), y + P(9) + j * P(3), P(1), P(1), j < 3 ? C.led : C.ledOff); } } },
  web: (g, x, y, w, h) => { drawMetalFloor(g, x, y, w, h); px(g, x + P(4), y + P(7), P(20), P(14), C.panelDark); px(g, x + P(5), y + P(8), P(18), P(12), C.screen); px(g, x + P(8), y + P(11), P(12), P(6), C.holo); drawHoloDisplay(g, x + P(40), y + P(30)); },
  files: (g, x, y, w, h) => { drawMetalFloor(g, x, y, w, h); for (let i = 0; i < 4; i++) { px(g, x + P(2) + i * P(7), y + P(7), P(5), P(10), C.metalDark); px(g, x + P(3) + i * P(7), y + P(8), P(3), P(3), C.metal); px(g, x + P(3) + i * P(7), y + P(12), P(3), P(3), C.metal); } drawControlPanel(g, x + P(24), y + P(25), P(14)); },
  thinking: (g, x, y, w, h) => { drawMetalFloor(g, x, y, w, h); drawHoloDisplay(g, x + w / 2, y + h / 2); px(g, x + w / 2 - P(9), y + h / 2 + P(2), P(18), P(1), C.metalDark); drawControlPanel(g, x + P(4), y + P(7), P(24)); drawControlPanel(g, x + P(32), y + P(7), P(20)); },
  messaging: (g, x, y, w, h) => { drawMetalFloor(g, x, y, w, h); px(g, x + P(4), y + P(21), P(16), P(8), C.hull); px(g, x + P(5), y + P(22), P(14), P(6), C.hullLight); drawControlPanel(g, x + P(4), y + P(7), P(14)); },
  spawn: (g, x, y, w, h) => { drawMetalFloor(g, x, y, w, h); const cx = x + w / 2, cy = y + h / 2; px(g, cx - P(6), cy - P(6), P(12), P(12), C.panelDark); px(g, cx - P(4), cy - P(4), P(8), P(8), C.holo); px(g, cx - P(2), cy - P(2), P(4), P(4), C.holoBright); px(g, cx - P(8), cy - P(1), P(16), P(2), C.airlockEdge); px(g, cx - P(1), cy - P(8), P(2), P(16), C.airlockEdge); },
  idle: (g, x, y, w, h) => { drawMetalFloor(g, x, y, w, h); px(g, x + P(2), y + P(7), P(28), P(5), C.hull); px(g, x + P(3), y + P(8), P(26), P(3), C.hullLight); px(g, x + P(4), y + P(9), P(2), P(1), C.screenGlow); px(g, x + P(32), y + P(7), P(6), P(14), C.metalDark); for (let i = 0; i < 3; i++) px(g, x + P(33), y + P(8) + i * P(4), P(4), P(3), C.screen); },
  tasks: (g, x, y, w, h) => { drawMetalFloor(g, x, y, w, h); px(g, x + P(2), y + P(7), P(30), P(18), C.panel); px(g, x + P(3), y + P(8), P(28), P(16), C.screen); const cols = [C.ledRed, C.led, C.ledBlue]; for (let i = 0; i < 3; i++) { const colW = P(8); const cx = x + P(4) + i * (colW + P(1)); px(g, cx, y + P(9), colW, P(2), cols[i]); for (let j = 0; j < 3 - i; j++) px(g, cx + 2, y + P(12) + j * P(3), colW - 4, P(2), C.holo); } },
};

export const spaceTheme: Theme = {
  id: 'space',
  name: 'Space Station',
  icon: '🚀',
  colors: { background: 0x0a0a18, gridLine: 0x151528, gridLineSub: 0x101020 },
  decorators,
};
