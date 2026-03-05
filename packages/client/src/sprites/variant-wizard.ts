/** V4: Wizard — tall pointed hat, long flowing robe, wide bottom */
import type { SpriteSet, PaletteKey } from './sprite-data';

const _ = 'transparent' as const;
const B = 'body' as const;
const O = 'outline' as const;
const H = 'highlight' as const;
const E = 'eye' as const;
const S = 'skin' as const;

// Main 16×16 — hat=H, robe=B, face=S
const W_HT1:PaletteKey[] = [_,_,_,_,_,_,_,O,O,_,_,_,_,_,_,_];
const W_HT2:PaletteKey[] = [_,_,_,_,_,_,O,H,H,O,_,_,_,_,_,_];
const W_HT3:PaletteKey[] = [_,_,_,_,_,O,H,H,H,H,O,_,_,_,_,_];
const W_BRM:PaletteKey[] = [_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_];
const W_EYE:PaletteKey[] = [_,_,_,O,S,E,E,S,S,E,E,S,O,_,_,_];
const W_EYC:PaletteKey[] = [_,_,_,O,S,O,O,S,S,O,O,S,O,_,_,_];
const W_BRD:PaletteKey[] = [_,_,_,_,O,S,S,S,S,S,S,O,_,_,_,_];
const W_NK: PaletteKey[] = [_,_,_,_,_,O,B,B,B,B,O,_,_,_,_,_];
const W_RB1:PaletteKey[] = [_,_,_,_,O,B,B,B,B,B,B,O,_,_,_,_];
const W_ARM:PaletteKey[] = [_,_,_,S,O,B,B,B,B,B,B,O,S,_,_,_];
const W_RB2:PaletteKey[] = [_,_,_,O,B,B,B,B,B,B,B,B,O,_,_,_];
const W_RB3:PaletteKey[] = [_,_,O,B,B,B,B,B,B,B,B,B,B,O,_,_];
const W_RB4:PaletteKey[] = [_,O,B,B,B,B,B,B,B,B,B,B,B,B,O,_];
const W_BTM:PaletteKey[] = [_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_];

// Working — staff arm extended
const W_WRK:PaletteKey[] = [_,_,S,S,O,B,B,B,B,B,B,O,S,S,_,_];
// Done — happy eyes
const W_DE: PaletteKey[] = [_,_,_,O,S,S,E,S,S,E,S,S,O,_,_,_];
const W_DM: PaletteKey[] = [_,_,_,_,O,S,S,O,O,S,S,O,_,_,_,_];

const hat = [W_HT1,W_HT2,W_HT3,W_BRM];
const hatT = hat.map(r => [_,...r.slice(0,-1)]);
const robe = [W_NK,W_RB1,W_ARM,W_RB1,W_RB2,W_RB3,W_RB4,W_BTM];

export const WIZARD_MAIN: SpriteSet = {
  idle: [
    [...hat,W_EYE,W_BRD,...robe],
    [...hat,W_EYC,W_BRD,...robe],
  ],
  walk: [
    [...hat,W_EYE,W_BRD,W_NK,W_RB1,W_ARM,W_RB1,W_RB2,W_RB3,W_RB4,W_BTM],
    [...hat,W_EYC,W_BRD,W_NK,W_RB1,W_ARM,W_RB1,W_RB2,W_RB3,W_RB4,W_BTM],
  ],
  working: [...hat,W_EYE,W_BRD,W_NK,W_RB1,W_WRK,W_RB1,W_RB2,W_RB3,W_RB4,W_BTM],
  sleeping: [
    [...hatT,[_,...W_EYC.slice(0,-1)],[_,...W_BRD.slice(0,-1)],...robe],
    [...hatT,[_,...W_EYC.slice(0,-1)],[_,...W_BRD.slice(0,-1)],...robe],
  ],
  done: [...hat,W_DE,W_DM,...robe],
  size: 16,
};

// Sub 12×12
const w_h1: PaletteKey[] = [_,_,_,_,_,O,O,_,_,_,_,_];
const w_h2: PaletteKey[] = [_,_,_,_,O,H,H,O,_,_,_,_];
const w_bm: PaletteKey[] = [_,_,O,O,O,O,O,O,O,O,_,_];
const w_ey: PaletteKey[] = [_,_,O,S,E,S,S,E,S,O,_,_];
const w_ec: PaletteKey[] = [_,_,O,S,O,S,S,O,S,O,_,_];
const w_bd: PaletteKey[] = [_,_,O,S,S,S,S,S,S,O,_,_];
const w_r1: PaletteKey[] = [_,_,O,B,B,B,B,B,B,O,_,_];
const w_ar: PaletteKey[] = [_,S,O,B,B,B,B,B,B,O,S,_];
const w_r2: PaletteKey[] = [_,O,B,B,B,B,B,B,B,B,O,_];
const w_r3: PaletteKey[] = [O,B,B,B,B,B,B,B,B,B,B,O];
const w_bt: PaletteKey[] = [O,O,O,O,O,O,O,O,O,O,O,O];
const w_de: PaletteKey[] = [_,_,O,S,S,E,E,S,S,O,_,_];
const w_dm: PaletteKey[] = [_,_,O,S,O,S,S,O,S,O,_,_];

export const WIZARD_SUB: SpriteSet = {
  idle: [
    [w_h1,w_h2,w_bm,w_ey,w_bd,w_r1,w_ar,w_r1,w_r2,w_r3,w_r3,w_bt],
    [w_h1,w_h2,w_bm,w_ec,w_bd,w_r1,w_ar,w_r1,w_r2,w_r3,w_r3,w_bt],
  ],
  walk: [
    [w_h1,w_h2,w_bm,w_ey,w_bd,w_r1,w_ar,w_r1,w_r2,w_r3,w_r3,w_bt],
    [w_h1,w_h2,w_bm,w_ec,w_bd,w_r1,w_ar,w_r1,w_r2,w_r3,w_r3,w_bt],
  ],
  working: [w_h1,w_h2,w_bm,w_ey,w_bd,w_r1,w_ar,w_r1,w_r2,w_r3,w_r3,w_bt],
  sleeping: [
    [w_h1,w_h2,w_bm,w_ec,w_bd,w_r1,w_ar,w_r1,w_r2,w_r3,w_r3,w_bt],
    [w_h1,w_h2,w_bm,w_ec,w_bd,w_r1,w_ar,w_r1,w_r2,w_r3,w_r3,w_bt],
  ],
  done: [w_h1,w_h2,w_bm,w_de,w_dm,w_r1,w_ar,w_r1,w_r2,w_r3,w_r3,w_bt],
  size: 12,
};
