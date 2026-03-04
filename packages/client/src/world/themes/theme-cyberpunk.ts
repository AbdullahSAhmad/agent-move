import { Graphics } from 'pixi.js';
import type { Theme, ZoneDecoratorFn } from './theme-types.js';
import type { ZoneId } from '@agent-move/shared';

const PX = 4;
const P = (n: number) => n * PX;

const C = {
  floor: 0x0e0e1a, floorAlt: 0x121220, floorLine: 0x1a1a2e,
  neonPink: 0xff2299, neonBlue: 0x00ccff, neonGreen: 0x00ff88, neonPurple: 0xaa44ff, neonYellow: 0xffdd00,
  darkPanel: 0x1a1a28, panel: 0x222238, panelEdge: 0x333350,
  screen: 0x001a22, screenGlow: 0x004455,
  rain: 0x334466,
  wire: 0x333344,
};

function px(g: Graphics, x: number, y: number, w: number, h: number, c: number) {
  g.rect(x, y, w, h).fill(c);
}

function drawCyberFloor(g: Graphics, x: number, y: number, w: number, h: number) {
  px(g, x, y, w, h, C.floor);
  for (let py = 0; py < h; py += P(6)) {
    px(g, x, y + py, w, 1, C.floorLine);
    if ((py / P(6)) % 2 === 0) px(g, x, y + py + P(3), w, P(3), C.floorAlt);
  }
  // Neon floor strips
  px(g, x, y, w, 1, C.neonPink);
  px(g, x, y + h - 1, w, 1, C.neonBlue);
}

function drawHoloScreen(g: Graphics, x: number, y: number, w: number, h: number, accent: number) {
  px(g, x, y, w, h, C.darkPanel);
  px(g, x + 1, y + 1, w - 2, h - 2, C.screen);
  px(g, x + 2, y + 2, w - 4, P(1), accent);
  px(g, x, y, w, 1, accent);
  px(g, x, y + h - 1, w, 1, accent);
}

function drawNeonBar(g: Graphics, x: number, y: number, w: number, color: number) {
  px(g, x, y, w, P(1), color);
  px(g, x + P(1), y - 1, w - P(2), 1, color);
}

function drawRainEffect(g: Graphics, x: number, y: number, w: number, h: number) {
  for (let i = 0; i < 12; i++) {
    const rx = x + ((i * 37 + 11) % (w - P(1)));
    const ry = y + ((i * 53 + 7) % (h - P(4)));
    px(g, rx, ry, 1, P(2), C.rain);
  }
}

const decorators: Record<ZoneId, ZoneDecoratorFn> = {
  search: (g, x, y, w, h) => { drawCyberFloor(g, x, y, w, h); drawHoloScreen(g, x + P(4), y + P(7), P(20), P(12), C.neonPink); drawHoloScreen(g, x + P(28), y + P(7), P(20), P(12), C.neonBlue); drawNeonBar(g, x + P(4), y + P(26), P(44), C.neonPurple); drawRainEffect(g, x, y, w, h); },
  terminal: (g, x, y, w, h) => { drawCyberFloor(g, x, y, w, h); for (let i = 0; i < 3; i++) { px(g, x + P(2) + i * P(10), y + P(7), P(7), P(14), C.darkPanel); px(g, x + P(3) + i * P(10), y + P(9), P(5), P(1), C.neonGreen); for (let j = 0; j < 3; j++) px(g, x + P(4) + i * P(10), y + P(11) + j * P(2), P(1), P(1), C.neonGreen); } drawRainEffect(g, x, y, w, h); },
  web: (g, x, y, w, h) => { drawCyberFloor(g, x, y, w, h); drawHoloScreen(g, x + P(4), y + P(7), P(24), P(16), C.neonBlue); px(g, x + P(8), y + P(12), P(16), P(8), C.neonPurple); drawNeonBar(g, x + P(30), y + P(20), P(10), C.neonPink); drawRainEffect(g, x, y, w, h); },
  files: (g, x, y, w, h) => { drawCyberFloor(g, x, y, w, h); for (let i = 0; i < 4; i++) { px(g, x + P(2) + i * P(7), y + P(7), P(5), P(10), C.darkPanel); px(g, x + P(2) + i * P(7), y + P(7), P(5), 1, C.neonBlue); } drawHoloScreen(g, x + P(24), y + P(25), P(14), P(8), C.neonGreen); drawRainEffect(g, x, y, w, h); },
  thinking: (g, x, y, w, h) => { drawCyberFloor(g, x, y, w, h); drawHoloScreen(g, x + P(4), y + P(7), P(24), P(12), C.neonPurple); drawHoloScreen(g, x + P(32), y + P(7), P(20), P(12), C.neonBlue); px(g, x + w / 2 - P(8), y + h / 2 + P(2), P(16), P(1), C.panelEdge); drawNeonBar(g, x + P(4), y + h - P(4), P(40), C.neonPink); drawRainEffect(g, x, y, w, h); },
  messaging: (g, x, y, w, h) => { drawCyberFloor(g, x, y, w, h); px(g, x + P(4), y + P(21), P(16), P(8), C.darkPanel); px(g, x + P(5), y + P(22), P(14), P(1), C.neonPink); drawHoloScreen(g, x + P(4), y + P(7), P(14), P(8), C.neonYellow); drawNeonBar(g, x + P(22), y + P(18), P(8), C.neonGreen); drawRainEffect(g, x, y, w, h); },
  spawn: (g, x, y, w, h) => { drawCyberFloor(g, x, y, w, h); const cx = x + w / 2, cy = y + h / 2; for (let i = 0; i < 3; i++) { const s = P(3) + i * P(3); px(g, cx - s, cy - s, s * 2, 1, C.neonPurple); px(g, cx - s, cy + s, s * 2, 1, C.neonPurple); px(g, cx - s, cy - s, 1, s * 2, C.neonBlue); px(g, cx + s, cy - s, 1, s * 2, C.neonBlue); } px(g, cx - P(1), cy - P(1), P(2), P(2), C.neonGreen); drawRainEffect(g, x, y, w, h); },
  idle: (g, x, y, w, h) => { drawCyberFloor(g, x, y, w, h); px(g, x + P(2), y + P(7), P(28), P(5), C.darkPanel); px(g, x + P(2), y + P(7), P(28), 1, C.neonPink); drawNeonBar(g, x + P(34), y + P(12), P(12), C.neonBlue); px(g, x + P(34), y + P(7), P(8), P(14), C.darkPanel); px(g, x + P(35), y + P(8), P(6), P(4), C.screen); px(g, x + P(36), y + P(9), P(4), P(1), C.neonGreen); drawRainEffect(g, x, y, w, h); },
  tasks: (g, x, y, w, h) => { drawCyberFloor(g, x, y, w, h); drawHoloScreen(g, x + P(2), y + P(7), P(30), P(18), C.neonGreen); const cols = [C.neonPink, C.neonYellow, C.neonBlue]; for (let i = 0; i < 3; i++) { const colW = P(8); const cx2 = x + P(4) + i * (colW + P(1)); px(g, cx2, y + P(9), colW, P(2), cols[i]); for (let j = 0; j < 3 - i; j++) px(g, cx2 + 2, y + P(12) + j * P(3), colW - 4, P(2), C.panel); } drawRainEffect(g, x, y, w, h); },
};

export const cyberpunkTheme: Theme = {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  icon: '🌃',
  colors: { background: 0x0a0810, gridLine: 0x1a1028, gridLineSub: 0x100a1a },
  decorators,
};
