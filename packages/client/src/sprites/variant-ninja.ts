/** V3: Ninja — hooded head, slim wrapped body, no visible hands */
import type { SpriteSet, PaletteKey } from './sprite-data';

const _ = 'transparent' as const;
const B = 'body' as const;
const O = 'outline' as const;
const H = 'highlight' as const;
const E = 'eye' as const;
const S = 'skin' as const;

// Main 16×16 — hood=B, mask=O, eyes visible
const N_HD1:PaletteKey[] = [_,_,_,_,_,_,O,O,O,O,_,_,_,_,_,_];
const N_HD2:PaletteKey[] = [_,_,_,_,O,O,B,B,B,B,O,O,_,_,_,_];
const N_HD3:PaletteKey[] = [_,_,_,O,B,B,B,B,B,B,B,B,O,_,_,_];
const N_EYE:PaletteKey[] = [_,_,_,O,B,E,E,O,O,E,E,B,O,_,_,_];
const N_EYC:PaletteKey[] = [_,_,_,O,B,O,O,O,O,O,O,B,O,_,_,_];
const N_MSK:PaletteKey[] = [_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_];
const N_CHN:PaletteKey[] = [_,_,_,_,O,O,O,O,O,O,O,O,_,_,_,_];
const N_NK: PaletteKey[] = [_,_,_,_,_,O,B,B,B,B,O,_,_,_,_,_];
const N_BD1:PaletteKey[] = [_,_,_,_,O,B,B,B,B,B,B,O,_,_,_,_];
const N_BD2:PaletteKey[] = [_,_,_,O,O,B,B,B,B,B,B,O,O,_,_,_];
const N_ARM:PaletteKey[] = [_,_,O,O,O,B,B,B,B,B,B,O,O,O,_,_];
const N_BLT:PaletteKey[] = [_,_,_,_,O,O,H,H,H,H,O,O,_,_,_,_];
const N_LG: PaletteKey[] = [_,_,_,_,_,O,O,_,_,O,O,_,_,_,_,_];
const N_FT: PaletteKey[] = [_,_,_,_,O,O,O,_,_,O,O,O,_,_,_,_];

const NW1A: PaletteKey[] = [_,_,_,_,O,O,_,_,_,_,O,O,_,_,_,_];
const NW1B: PaletteKey[] = [_,_,_,O,O,O,_,_,_,_,O,O,O,_,_,_];
const NW2A: PaletteKey[] = [_,_,_,_,_,O,O,_,O,O,_,_,_,_,_,_];
const NW2B: PaletteKey[] = [_,_,_,_,O,O,_,_,_,O,O,_,_,_,_,_];

// Working eyes (focused slit)
const N_WE: PaletteKey[] = [_,_,_,O,B,E,O,O,O,O,E,B,O,_,_,_];
// Done (happy narrow eyes)
const N_DE: PaletteKey[] = [_,_,_,O,B,O,E,O,O,E,O,B,O,_,_,_];

const head = [N_HD1,N_HD2,N_HD3];
const headT = [
  [_,...N_HD1.slice(0,-1)],
  [_,...N_HD2.slice(0,-1)],
  [_,...N_HD3.slice(0,-1)],
];
const body = [N_NK,N_BD1,N_ARM,N_BD2,N_BD1,N_BLT,N_LG,N_LG,N_FT];

export const NINJA_MAIN: SpriteSet = {
  idle: [
    [...head,N_EYE,N_MSK,N_CHN,...body],
    [...head,N_EYC,N_MSK,N_CHN,...body],
  ],
  walk: [
    [...head,N_EYE,N_MSK,N_CHN,N_NK,N_BD1,N_ARM,N_BD2,N_BD1,N_BLT,NW1A,NW1A,NW1B],
    [...head,N_EYE,N_MSK,N_CHN,N_NK,N_BD1,N_ARM,N_BD2,N_BD1,N_BLT,NW2A,NW2B,N_FT],
  ],
  working: [...head,N_WE,N_MSK,N_CHN,N_NK,N_BD1,N_ARM,N_BD2,N_BD1,N_BLT,N_LG,N_LG,N_FT],
  sleeping: [
    [[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],...headT,[_,...N_EYC.slice(0,-1)],[_,...N_MSK.slice(0,-1)],[_,...N_CHN.slice(0,-1)],...body],
    [[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],...headT,[_,...N_EYC.slice(0,-1)],[_,...N_MSK.slice(0,-1)],[_,...N_CHN.slice(0,-1)],...body],
  ],
  done: [...head,N_DE,N_MSK,N_CHN,...body],
  size: 16,
};

// Sub 12×12
const n_h1: PaletteKey[] = [_,_,_,O,O,O,O,O,O,_,_,_];
const n_h2: PaletteKey[] = [_,_,O,B,B,B,B,B,B,O,_,_];
const n_h3: PaletteKey[] = [_,O,B,B,B,B,B,B,B,B,O,_];
const n_ey: PaletteKey[] = [_,O,B,E,E,O,O,E,E,B,O,_];
const n_ec: PaletteKey[] = [_,O,B,O,O,O,O,O,O,B,O,_];
const n_mk: PaletteKey[] = [_,O,O,O,O,O,O,O,O,O,O,_];
const n_bd: PaletteKey[] = [_,_,O,B,B,B,B,B,B,O,_,_];
const n_ar: PaletteKey[] = [_,O,O,B,B,B,B,B,B,O,O,_];
const n_bt: PaletteKey[] = [_,_,O,O,H,H,H,H,O,O,_,_];
const n_lg: PaletteKey[] = [_,_,_,O,O,_,_,O,O,_,_,_];
const n_ft: PaletteKey[] = [_,_,O,O,O,_,_,O,O,O,_,_];
const nw1:  PaletteKey[] = [_,_,O,O,_,_,_,_,O,O,_,_];
const n_de: PaletteKey[] = [_,O,B,O,E,O,O,E,O,B,O,_];

export const NINJA_SUB: SpriteSet = {
  idle: [
    [n_h1,n_h2,n_h3,n_ey,n_mk,n_bd,n_ar,n_bd,n_bt,n_lg,n_lg,n_ft],
    [n_h1,n_h2,n_h3,n_ec,n_mk,n_bd,n_ar,n_bd,n_bt,n_lg,n_lg,n_ft],
  ],
  walk: [
    [n_h1,n_h2,n_h3,n_ey,n_mk,n_bd,n_ar,n_bd,n_bt,nw1,nw1,n_ft],
    [n_h1,n_h2,n_h3,n_ey,n_mk,n_bd,n_ar,n_bd,n_bt,n_lg,nw1,n_ft],
  ],
  working: [n_h1,n_h2,n_h3,n_ey,n_mk,n_bd,n_ar,n_bd,n_bt,n_lg,n_lg,n_ft],
  sleeping: [
    [n_h1,n_h2,n_h3,n_ec,n_mk,n_bd,n_ar,n_bd,n_bt,n_lg,n_lg,n_ft],
    [n_h1,n_h2,n_h3,n_ec,n_mk,n_bd,n_ar,n_bd,n_bt,n_lg,n_lg,n_ft],
  ],
  done: [n_h1,n_h2,n_h3,n_de,n_mk,n_bd,n_ar,n_bd,n_bt,n_lg,n_lg,n_ft],
  size: 12,
};
