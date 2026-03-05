/** V2: Skeleton — skull head, ribcage body, thin bony limbs */
import type { SpriteSet, PaletteKey } from './sprite-data';

const _ = 'transparent' as const;
const B = 'body' as const;
const O = 'outline' as const;
const H = 'highlight' as const;
const E = 'eye' as const;
const S = 'skin' as const;

// Main 16×16 — skull uses S (skin=bone white), O for outlines, B for ribs
const SK_T: PaletteKey[] = [_,_,_,_,_,O,O,O,O,O,O,_,_,_,_,_];
const SK_H: PaletteKey[] = [_,_,_,_,O,S,S,S,S,S,S,O,_,_,_,_];
const SK_F: PaletteKey[] = [_,_,_,O,S,S,S,S,S,S,S,S,O,_,_,_];
const SK_EO:PaletteKey[] = [_,_,_,O,S,O,O,S,S,O,O,S,O,_,_,_];
const SK_EC:PaletteKey[] = [_,_,_,O,S,O,_,S,S,_,O,S,O,_,_,_];
const SK_NS:PaletteKey[] = [_,_,_,O,S,S,S,O,O,S,S,S,O,_,_,_];
const SK_JW:PaletteKey[] = [_,_,_,_,O,S,O,O,O,O,S,O,_,_,_,_];
const SK_NK:PaletteKey[] = [_,_,_,_,_,_,O,S,S,O,_,_,_,_,_,_];
const SK_R1:PaletteKey[] = [_,_,_,_,O,S,B,S,S,B,S,O,_,_,_,_];
const SK_R2:PaletteKey[] = [_,_,_,_,O,B,S,B,B,S,B,O,_,_,_,_];
const SK_AR:PaletteKey[] = [_,_,S,S,O,S,B,S,S,B,S,O,S,S,_,_];
const SK_SP:PaletteKey[] = [_,_,_,_,_,O,S,S,S,S,O,_,_,_,_,_];
const SK_PV:PaletteKey[] = [_,_,_,_,_,O,S,O,O,S,O,_,_,_,_,_];
const SK_LG:PaletteKey[] = [_,_,_,_,_,O,S,_,_,S,O,_,_,_,_,_];
const SK_FT:PaletteKey[] = [_,_,_,_,O,O,S,_,_,S,O,O,_,_,_,_];

const SKW1: PaletteKey[] = [_,_,_,_,O,S,_,_,_,_,S,O,_,_,_,_];
const SKW2: PaletteKey[] = [_,_,_,O,O,S,_,_,_,S,O,O,_,_,_,_];

// Working — jaw open wider
const SK_WJ:PaletteKey[] = [_,_,_,_,O,S,O,S,S,O,S,O,_,_,_,_];
// Done — smile
const SK_SM:PaletteKey[] = [_,_,_,O,S,S,O,O,O,O,S,S,O,_,_,_];

const body = [SK_NK,SK_R1,SK_AR,SK_R2,SK_R1,SK_SP,SK_PV,SK_LG,SK_LG,SK_FT];
const bodyW = [SK_NK,SK_R1,SK_AR,SK_R2,SK_R1,SK_SP,SK_PV,SKW1,SKW1,SKW2];

export const SKELETON_MAIN: SpriteSet = {
  idle: [
    [SK_T,SK_H,SK_F,SK_EO,SK_NS,SK_JW,...body],
    [SK_T,SK_H,SK_F,SK_EC,SK_NS,SK_JW,...body],
  ],
  walk: [
    [SK_T,SK_H,SK_F,SK_EO,SK_NS,SK_JW,SK_NK,SK_R1,SK_AR,SK_R2,SK_R1,SK_SP,SK_PV,SKW1,SKW1,SKW2],
    [SK_T,SK_H,SK_F,SK_EO,SK_NS,SK_JW,SK_NK,SK_R1,SK_AR,SK_R2,SK_R1,SK_SP,SK_PV,SK_LG,SKW1,SKW2],
  ],
  working: [SK_T,SK_H,SK_F,SK_EO,SK_WJ,SK_JW,...body],
  sleeping: [
    [[_,...SK_T.slice(0,-1)],[_,...SK_H.slice(0,-1)],[_,...SK_F.slice(0,-1)],[_,...SK_EC.slice(0,-1)],[_,...SK_NS.slice(0,-1)],[_,...SK_JW.slice(0,-1)],...body],
    [[_,...SK_T.slice(0,-1)],[_,...SK_H.slice(0,-1)],[_,...SK_F.slice(0,-1)],[_,...SK_EC.slice(0,-1)],[_,...SK_NS.slice(0,-1)],[_,...SK_JW.slice(0,-1)],...body],
  ],
  done: [SK_T,SK_H,SK_F,SK_EO,SK_SM,SK_JW,...body],
  size: 16,
};

// Sub 12×12
const sk_t: PaletteKey[] = [_,_,_,O,O,O,O,O,O,_,_,_];
const sk_h: PaletteKey[] = [_,_,O,S,S,S,S,S,S,O,_,_];
const sk_eo:PaletteKey[] = [_,O,S,O,O,S,S,O,O,S,O,_];
const sk_ec:PaletteKey[] = [_,O,S,O,_,S,S,_,O,S,O,_];
const sk_ns:PaletteKey[] = [_,O,S,S,O,O,O,O,S,S,O,_];
const sk_jw:PaletteKey[] = [_,_,O,S,O,O,O,O,S,O,_,_];
const sk_r1:PaletteKey[] = [_,_,O,S,B,S,S,B,S,O,_,_];
const sk_r2:PaletteKey[] = [_,_,O,B,S,B,B,S,B,O,_,_];
const sk_ar:PaletteKey[] = [_,S,O,S,B,S,S,B,S,O,S,_];
const sk_sp:PaletteKey[] = [_,_,_,O,S,S,S,S,O,_,_,_];
const sk_lg:PaletteKey[] = [_,_,_,O,S,_,_,S,O,_,_,_];
const sk_ft:PaletteKey[] = [_,_,O,O,S,_,_,S,O,O,_,_];
const skw1: PaletteKey[] = [_,_,O,S,_,_,_,_,S,O,_,_];
const sk_sm:PaletteKey[] = [_,O,S,S,O,O,O,O,S,S,O,_];

export const SKELETON_SUB: SpriteSet = {
  idle: [
    [sk_t,sk_h,sk_eo,sk_ns,sk_jw,sk_r1,sk_ar,sk_r2,sk_sp,sk_lg,sk_lg,sk_ft],
    [sk_t,sk_h,sk_ec,sk_ns,sk_jw,sk_r1,sk_ar,sk_r2,sk_sp,sk_lg,sk_lg,sk_ft],
  ],
  walk: [
    [sk_t,sk_h,sk_eo,sk_ns,sk_jw,sk_r1,sk_ar,sk_r2,sk_sp,skw1,skw1,sk_ft],
    [sk_t,sk_h,sk_eo,sk_ns,sk_jw,sk_r1,sk_ar,sk_r2,sk_sp,sk_lg,skw1,sk_ft],
  ],
  working: [sk_t,sk_h,sk_eo,sk_ns,sk_jw,sk_r1,sk_ar,sk_r2,sk_sp,sk_lg,sk_lg,sk_ft],
  sleeping: [
    [sk_t,sk_h,sk_ec,sk_ns,sk_jw,sk_r1,sk_ar,sk_r2,sk_sp,sk_lg,sk_lg,sk_ft],
    [sk_t,sk_h,sk_ec,sk_ns,sk_jw,sk_r1,sk_ar,sk_r2,sk_sp,sk_lg,sk_lg,sk_ft],
  ],
  done: [sk_t,sk_h,sk_eo,sk_sm,sk_jw,sk_r1,sk_ar,sk_r2,sk_sp,sk_lg,sk_lg,sk_ft],
  size: 12,
};
