import { Graphics } from 'pixi.js';
import type { Theme, ZoneDecoratorFn } from './theme-types.js';
import type { ZoneId } from '@agent-move/shared';

const PX = 4;
const P = (n: number) => n * PX;

const C = {
  stone: 0x6a6a6a, stoneDark: 0x4a4a4a, stoneLight: 0x8a8a8a,
  stoneWall: 0x5a5a5a, mortar: 0x3a3a3a,
  wood: 0x7a5030, woodDark: 0x5a3a20, woodLight: 0x9a6a40,
  torch: 0xff8800, torchGlow: 0xffaa33, torchHandle: 0x4a3020,
  banner: 0x882233, bannerEdge: 0x661122,
  scroll: 0xe8d8b0, scrollEdge: 0xc0a878,
  flag: 0x2244aa, flagEdge: 0x1a3388,
  rug: 0x883344, rugEdge: 0x662233, rugDot: 0x994455,
};

function px(g: Graphics, x: number, y: number, w: number, h: number, c: number) {
  g.rect(x, y, w, h).fill(c);
}

function drawStoneFloor(g: Graphics, x: number, y: number, w: number, h: number) {
  px(g, x, y, w, h, C.stone);
  for (let py = 0; py < h; py += P(5)) {
    px(g, x, y + py, w, 1, C.mortar);
    const offset = ((py / P(5)) % 2) * P(6);
    for (let px2 = offset; px2 < w; px2 += P(12)) px(g, x + px2, y + py, 1, P(5), C.mortar);
  }
  for (let py = P(2); py < h; py += P(10))
    for (let px2 = P(3); px2 < w; px2 += P(12))
      px(g, x + px2, y + py, P(1), P(1), C.stoneLight);
}

function drawTorch(g: Graphics, x: number, y: number) {
  px(g, x, y + P(3), P(1), P(4), C.torchHandle);
  px(g, x - 1, y + P(1), P(1) + 2, P(2), C.torch);
  px(g, x, y, P(1), P(1), C.torchGlow);
}

function drawBanner(g: Graphics, x: number, y: number, w: number, h: number) {
  px(g, x, y, w, P(1), C.woodDark);
  px(g, x + 1, y + P(1), w - 2, h, C.banner);
  px(g, x + 1, y + P(1), w - 2, P(1), C.bannerEdge);
  px(g, x + w / 2 - P(1), y + h / 2, P(2), P(2), C.torchGlow);
}

function drawWoodTable(g: Graphics, x: number, y: number, w: number, h: number) {
  px(g, x, y, w, h, C.woodDark);
  px(g, x + 1, y + 1, w - 2, h - 2, C.wood);
  px(g, x + 2, y + 2, w - 4, 1, C.woodLight);
}

const decorators: Record<ZoneId, ZoneDecoratorFn> = {
  search: (g, x, y, w, h) => { drawStoneFloor(g, x, y, w, h); for (let i = 0; i < 4; i++) { px(g, x + P(2) + i * P(16), y + P(7), P(10), P(14), C.woodDark); px(g, x + P(3) + i * P(16), y + P(8), P(8), P(12), C.wood); } drawTorch(g, x + P(14), y + P(8)); drawTorch(g, x + P(30), y + P(8)); drawWoodTable(g, x + P(18), y + P(35), P(12), P(6)); px(g, x + P(20), y + P(36), P(6), P(3), C.scroll); },
  terminal: (g, x, y, w, h) => { drawStoneFloor(g, x, y, w, h); for (let i = 0; i < 3; i++) { px(g, x + P(2) + i * P(10), y + P(7), P(7), P(14), C.stoneDark); px(g, x + P(3) + i * P(10), y + P(9), P(5), P(1), C.torch); } drawTorch(g, x + P(34), y + P(9)); drawBanner(g, x + P(4), y + P(28), P(8), P(12)); },
  web: (g, x, y, w, h) => { drawStoneFloor(g, x, y, w, h); px(g, x + P(4), y + P(7), P(20), P(14), C.stoneDark); px(g, x + P(5), y + P(8), P(18), P(12), C.stoneLight); px(g, x + P(8), y + P(11), P(12), P(6), C.torchGlow); drawTorch(g, x + P(28), y + P(10)); drawWoodTable(g, x + P(4), y + P(27), P(14), P(5)); },
  files: (g, x, y, w, h) => { drawStoneFloor(g, x, y, w, h); for (let i = 0; i < 4; i++) px(g, x + P(2) + i * P(7), y + P(7), P(5), P(10), C.woodDark); drawWoodTable(g, x + P(24), y + P(25), P(14), P(6)); px(g, x + P(26), y + P(26), P(6), P(3), C.scroll); drawTorch(g, x + P(40), y + P(9)); },
  thinking: (g, x, y, w, h) => { drawStoneFloor(g, x, y, w, h); px(g, x + P(8), y + h / 2 - P(8), P(10), P(4), C.rugEdge); drawWoodTable(g, x + w / 2 - P(9), y + h / 2 - P(4), P(18), P(8)); drawBanner(g, x + P(4), y + P(7), P(10), P(14)); drawBanner(g, x + P(34), y + P(7), P(10), P(14)); drawTorch(g, x + P(18), y + P(8)); drawTorch(g, x + P(28), y + P(8)); },
  messaging: (g, x, y, w, h) => { drawStoneFloor(g, x, y, w, h); drawBanner(g, x + P(8), y + P(7), P(14), P(10)); drawWoodTable(g, x + P(6), y + P(33), P(12), P(5)); drawTorch(g, x + P(4), y + P(10)); drawTorch(g, x + P(26), y + P(10)); },
  spawn: (g, x, y, w, h) => { drawStoneFloor(g, x, y, w, h); const cx = x + w / 2, cy = y + h / 2; px(g, cx - P(4), cy - P(4), P(8), P(8), C.mortar); px(g, cx - P(3), cy - P(3), P(6), P(6), C.torchGlow); px(g, cx - P(1), cy - P(1), P(2), P(2), C.torch); drawTorch(g, x + P(2), y + P(12)); drawTorch(g, x + w - P(4), y + P(12)); },
  idle: (g, x, y, w, h) => { drawStoneFloor(g, x, y, w, h); drawWoodTable(g, x + P(2), y + P(7), P(28), P(5)); px(g, x + P(4), y + P(8), P(4), P(3), C.woodLight); drawWoodTable(g, x + P(14), y + P(30), P(10), P(10)); drawWoodTable(g, x + P(40), y + P(30), P(10), P(10)); drawTorch(g, x + P(50), y + P(8)); },
  tasks: (g, x, y, w, h) => { drawStoneFloor(g, x, y, w, h); px(g, x + P(2), y + P(7), P(30), P(18), C.woodDark); px(g, x + P(3), y + P(8), P(28), P(16), C.wood); for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) px(g, x + P(4) + i * P(9) + 2, y + P(12) + j * P(3), P(7), P(2), C.scroll); drawTorch(g, x + P(36), y + P(9)); },
};

export const castleTheme: Theme = {
  id: 'castle',
  name: 'Medieval Castle',
  icon: '🏰',
  colors: { background: 0x1a1810, gridLine: 0x2a2820, gridLineSub: 0x201e18 },
  decorators,
};
