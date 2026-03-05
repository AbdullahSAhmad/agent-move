/** V5: Slime/Blob — round blobby shape, no legs, eyes floating in body mass */
import type { SpriteSet, PaletteKey } from './sprite-data';

const _ = 'transparent' as const;
const B = 'body' as const;
const O = 'outline' as const;
const H = 'highlight' as const;
const E = 'eye' as const;
const S = 'skin' as const;

// Main 16×16 — entirely B (body color) blob with E eyes, H highlight shine
const SL_T: PaletteKey[] = [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_];
const SL_1: PaletteKey[] = [_,_,_,_,_,_,O,O,O,O,_,_,_,_,_,_];
const SL_2: PaletteKey[] = [_,_,_,_,_,O,B,B,B,B,O,_,_,_,_,_];
const SL_3: PaletteKey[] = [_,_,_,_,O,B,B,H,B,B,B,O,_,_,_,_];
const SL_4: PaletteKey[] = [_,_,_,O,B,B,B,B,B,B,B,B,O,_,_,_];
const SL_EO:PaletteKey[] = [_,_,_,O,B,E,E,B,B,E,E,B,O,_,_,_];
const SL_EC:PaletteKey[] = [_,_,_,O,B,O,O,B,B,O,O,B,O,_,_,_];
const SL_5: PaletteKey[] = [_,_,O,B,B,B,B,B,B,B,B,B,B,O,_,_];
const SL_6: PaletteKey[] = [_,_,O,B,B,B,B,B,B,B,B,B,B,O,_,_];
const SL_7: PaletteKey[] = [_,O,B,B,B,B,B,B,B,B,B,B,B,B,O,_];
const SL_8: PaletteKey[] = [_,O,B,B,B,B,B,B,B,B,B,B,B,B,O,_];
const SL_B: PaletteKey[] = [_,_,O,O,O,O,O,O,O,O,O,O,O,O,_,_];

// Squished (walk frame 2)
const SLW7: PaletteKey[] = [O,B,B,B,B,B,B,B,B,B,B,B,B,B,B,O];
const SLW8: PaletteKey[] = [O,B,B,B,B,B,B,B,B,B,B,B,B,B,B,O];
const SLWB: PaletteKey[] = [_,O,O,O,O,O,O,O,O,O,O,O,O,O,O,_];

// Working — mouth open
const SL_WM:PaletteKey[] = [_,_,O,B,B,B,O,O,O,O,B,B,B,O,_,_];
// Done — happy
const SL_DE:PaletteKey[] = [_,_,_,O,B,O,E,B,B,E,O,B,O,_,_,_];
// Arm-like pseudopods for working
const SL_AR:PaletteKey[] = [_,O,B,B,B,B,B,B,B,B,B,B,B,B,O,_];

export const SLIME_MAIN: SpriteSet = {
  idle: [
    [SL_T,SL_T,SL_T,SL_T,SL_1,SL_2,SL_3,SL_4,SL_EO,SL_5,SL_6,SL_7,SL_8,SL_8,SL_B,SL_T],
    [SL_T,SL_T,SL_T,SL_T,SL_1,SL_2,SL_3,SL_4,SL_EC,SL_5,SL_6,SL_7,SL_8,SL_8,SL_B,SL_T],
  ],
  walk: [
    [SL_T,SL_T,SL_T,SL_1,SL_2,SL_3,SL_4,SL_EO,SL_5,SL_6,SL_7,SL_8,SL_8,SL_8,SL_B,SL_T],
    [SL_T,SL_T,SL_T,SL_T,SL_T,SL_1,SL_2,SL_3,SL_4,SL_EO,SL_5,SL_6,SLW7,SLW8,SLWB,SL_T],
  ],
  working: [SL_T,SL_T,SL_T,SL_T,SL_1,SL_2,SL_3,SL_4,SL_EO,SL_WM,SL_6,SL_AR,SL_8,SL_8,SL_B,SL_T],
  sleeping: [
    [SL_T,SL_T,SL_T,SL_T,SL_T,SL_1,SL_2,SL_3,SL_4,SL_EC,SL_5,SL_6,SLW7,SLW8,SLWB,SL_T],
    [SL_T,SL_T,SL_T,SL_T,SL_T,SL_1,SL_2,SL_3,SL_4,SL_EC,SL_5,SL_6,SLW7,SLW8,SLWB,SL_T],
  ],
  done: [SL_T,SL_T,SL_T,SL_T,SL_1,SL_2,SL_3,SL_4,SL_DE,SL_5,SL_6,SL_7,SL_8,SL_8,SL_B,SL_T],
  size: 16,
};

// Sub 12×12
const sl_t: PaletteKey[] = [_,_,_,_,_,_,_,_,_,_,_,_];
const sl_1: PaletteKey[] = [_,_,_,_,O,O,O,O,_,_,_,_];
const sl_2: PaletteKey[] = [_,_,_,O,B,B,H,B,O,_,_,_];
const sl_3: PaletteKey[] = [_,_,O,B,B,B,B,B,B,O,_,_];
const sl_eo:PaletteKey[] = [_,_,O,E,E,B,B,E,E,O,_,_];
const sl_ec:PaletteKey[] = [_,_,O,O,O,B,B,O,O,O,_,_];
const sl_4: PaletteKey[] = [_,O,B,B,B,B,B,B,B,B,O,_];
const sl_5: PaletteKey[] = [_,O,B,B,B,B,B,B,B,B,O,_];
const sl_b: PaletteKey[] = [_,_,O,O,O,O,O,O,O,O,_,_];
const slw:  PaletteKey[] = [O,B,B,B,B,B,B,B,B,B,B,O];
const slwb: PaletteKey[] = [_,O,O,O,O,O,O,O,O,O,O,_];
const sl_wm:PaletteKey[] = [_,O,B,B,O,O,O,O,B,B,O,_];
const sl_de:PaletteKey[] = [_,_,O,O,E,B,B,E,O,O,_,_];

export const SLIME_SUB: SpriteSet = {
  idle: [
    [sl_t,sl_t,sl_t,sl_1,sl_2,sl_3,sl_eo,sl_4,sl_5,sl_5,sl_b,sl_t],
    [sl_t,sl_t,sl_t,sl_1,sl_2,sl_3,sl_ec,sl_4,sl_5,sl_5,sl_b,sl_t],
  ],
  walk: [
    [sl_t,sl_t,sl_1,sl_2,sl_3,sl_eo,sl_4,sl_5,sl_5,sl_5,sl_b,sl_t],
    [sl_t,sl_t,sl_t,sl_t,sl_1,sl_2,sl_3,sl_eo,sl_4,slw,slwb,sl_t],
  ],
  working: [sl_t,sl_t,sl_t,sl_1,sl_2,sl_3,sl_eo,sl_wm,sl_4,sl_5,sl_b,sl_t],
  sleeping: [
    [sl_t,sl_t,sl_t,sl_t,sl_1,sl_2,sl_3,sl_ec,sl_4,slw,slwb,sl_t],
    [sl_t,sl_t,sl_t,sl_t,sl_1,sl_2,sl_3,sl_ec,sl_4,slw,slwb,sl_t],
  ],
  done: [sl_t,sl_t,sl_t,sl_1,sl_2,sl_3,sl_de,sl_4,sl_5,sl_5,sl_b,sl_t],
  size: 12,
};
