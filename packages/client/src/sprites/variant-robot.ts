/** V1: Robot — boxy head, antenna, mechanical segmented body, blocky feet */
import type { SpriteSet, PaletteKey } from './sprite-data';

const _ = 'transparent' as const;
const B = 'body' as const;
const O = 'outline' as const;
const H = 'highlight' as const;
const E = 'eye' as const;
const S = 'skin' as const;

// Shared rows
const R_ANT:  PaletteKey[] = [_,_,_,_,_,_,_,O,O,_,_,_,_,_,_,_];
const R_HD1:  PaletteKey[] = [_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_];
const R_HD2:  PaletteKey[] = [_,_,_,O,B,B,B,B,B,B,B,B,O,_,_,_];
const R_EYE:  PaletteKey[] = [_,_,_,O,B,E,E,B,B,E,E,B,O,_,_,_];
const R_EYEC: PaletteKey[] = [_,_,_,O,B,O,O,B,B,O,O,B,O,_,_,_];
const R_MTH:  PaletteKey[] = [_,_,_,O,B,B,O,O,O,O,B,B,O,_,_,_];
const R_JAW:  PaletteKey[] = [_,_,_,O,O,O,O,O,O,O,O,O,O,_,_,_];
const R_NCK:  PaletteKey[] = [_,_,_,_,_,O,H,H,H,H,O,_,_,_,_,_];
const R_BD1:  PaletteKey[] = [_,_,_,_,O,B,B,B,B,B,B,O,_,_,_,_];
const R_ARM:  PaletteKey[] = [_,_,O,O,O,B,B,B,B,B,B,O,O,O,_,_];
const R_BD2:  PaletteKey[] = [_,_,_,O,O,B,B,B,B,B,B,O,O,_,_,_];
const R_BLT:  PaletteKey[] = [_,_,_,_,O,O,H,H,H,H,O,O,_,_,_,_];
const R_LEG:  PaletteKey[] = [_,_,_,_,O,O,O,_,_,O,O,O,_,_,_,_];
const R_FT:   PaletteKey[] = [_,_,_,O,O,O,O,_,_,O,O,O,O,_,_,_];

// Walk legs
const RW1A: PaletteKey[] = [_,_,_,_,O,O,O,_,_,_,O,O,_,_,_,_];
const RW1B: PaletteKey[] = [_,_,_,O,O,O,_,_,_,_,O,O,O,_,_,_];
const RW2A: PaletteKey[] = [_,_,_,_,_,O,O,_,_,O,O,O,_,_,_,_];
const RW2B: PaletteKey[] = [_,_,_,O,O,O,_,_,_,O,O,O,_,_,_,_];

// Working mouth
const R_WRK: PaletteKey[] = [_,_,_,O,B,O,H,H,H,H,O,B,O,_,_,_];
// Done happy
const R_SMI: PaletteKey[] = [_,_,_,O,B,B,B,O,O,B,B,B,O,_,_,_];

const idle1 = [R_ANT,R_HD1,R_HD2,R_EYE,R_MTH,R_JAW,R_NCK,R_BD1,R_ARM,R_BD2,R_BLT,R_BD1,R_BLT,R_LEG,R_LEG,R_FT];
const idle2 = [R_ANT,R_HD1,R_HD2,R_EYEC,R_MTH,R_JAW,R_NCK,R_BD1,R_ARM,R_BD2,R_BLT,R_BD1,R_BLT,R_LEG,R_LEG,R_FT];

export const ROBOT_MAIN: SpriteSet = {
  idle: [idle1, idle2],
  walk: [
    [R_ANT,R_HD1,R_HD2,R_EYE,R_MTH,R_JAW,R_NCK,R_BD1,R_ARM,R_BD2,R_BLT,R_BD1,R_BLT,RW1A,RW1A,RW1B],
    [R_ANT,R_HD1,R_HD2,R_EYE,R_MTH,R_JAW,R_NCK,R_BD1,R_ARM,R_BD2,R_BLT,R_BD1,R_BLT,RW2A,RW2A,RW2B],
  ],
  working: [R_ANT,R_HD1,R_HD2,R_EYE,R_WRK,R_JAW,R_NCK,R_BD1,R_ARM,R_BD2,R_BLT,R_BD1,R_BLT,R_LEG,R_LEG,R_FT],
  sleeping: [
    [[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],...[R_ANT,R_HD1,R_HD2,R_EYEC,R_MTH,R_JAW,R_NCK,R_BD1,R_ARM,R_BD2,R_BLT,R_BD1,R_BLT,R_LEG,R_FT].map(r => [_,...r.slice(0,-1)] as PaletteKey[])],
    [[_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],...[R_ANT,R_HD1,R_HD2,R_EYEC,R_MTH,R_JAW,R_NCK,R_BD1,R_ARM,R_BD2,R_BLT,R_BD1,R_BLT,R_LEG,R_FT].map(r => [_,...r.slice(0,-1)] as PaletteKey[])],
  ],
  done: [R_ANT,R_HD1,R_HD2,R_EYE,R_SMI,R_JAW,R_NCK,R_BD1,R_ARM,R_BD2,R_BLT,R_BD1,R_BLT,R_LEG,R_LEG,R_FT],
  size: 16,
};

// ── Sub (12×12) ─────────────────────────────────────────
const r_ant: PaletteKey[] = [_,_,_,_,_,O,O,_,_,_,_,_];
const r_hd1: PaletteKey[] = [_,_,O,O,O,O,O,O,O,O,_,_];
const r_hd2: PaletteKey[] = [_,_,O,B,B,B,B,B,B,O,_,_];
const r_eye: PaletteKey[] = [_,_,O,E,E,B,B,E,E,O,_,_];
const r_eyc: PaletteKey[] = [_,_,O,O,O,B,B,O,O,O,_,_];
const r_mth: PaletteKey[] = [_,_,O,B,O,O,O,O,B,O,_,_];
const r_jaw: PaletteKey[] = [_,_,O,O,O,O,O,O,O,O,_,_];
const r_nck: PaletteKey[] = [_,_,_,O,H,H,H,H,O,_,_,_];
const r_bd:  PaletteKey[] = [_,_,_,O,B,B,B,B,O,_,_,_];
const r_arm: PaletteKey[] = [_,O,O,O,B,B,B,B,O,O,O,_];
const r_blt: PaletteKey[] = [_,_,_,O,H,H,H,H,O,_,_,_];
const r_leg: PaletteKey[] = [_,_,_,O,O,_,_,O,O,_,_,_];
const r_ft:  PaletteKey[] = [_,_,O,O,O,_,_,O,O,O,_,_];
const rw1:   PaletteKey[] = [_,_,O,O,_,_,_,_,O,O,_,_];
const rw2:   PaletteKey[] = [_,_,_,O,O,_,_,O,O,_,_,_];
const r_wrk: PaletteKey[] = [_,_,O,B,H,H,H,H,B,O,_,_];
const r_smi: PaletteKey[] = [_,_,O,B,B,O,O,B,B,O,_,_];

export const ROBOT_SUB: SpriteSet = {
  idle: [
    [r_ant,r_hd1,r_hd2,r_eye,r_mth,r_jaw,r_bd,r_arm,r_bd,r_leg,r_leg,r_ft],
    [r_ant,r_hd1,r_hd2,r_eyc,r_mth,r_jaw,r_bd,r_arm,r_bd,r_leg,r_leg,r_ft],
  ],
  walk: [
    [r_ant,r_hd1,r_hd2,r_eye,r_mth,r_jaw,r_bd,r_arm,r_bd,rw1,rw1,r_ft],
    [r_ant,r_hd1,r_hd2,r_eye,r_mth,r_jaw,r_bd,r_arm,r_bd,rw2,rw2,r_ft],
  ],
  working: [r_ant,r_hd1,r_hd2,r_eye,r_wrk,r_jaw,r_bd,r_arm,r_bd,r_leg,r_leg,r_ft],
  sleeping: [
    [r_ant,r_hd1,r_hd2,r_eyc,r_mth,r_jaw,r_bd,r_arm,r_bd,r_leg,r_leg,r_ft],
    [r_ant,r_hd1,r_hd2,r_eyc,r_mth,r_jaw,r_bd,r_arm,r_bd,r_leg,r_leg,r_ft],
  ],
  done: [r_ant,r_hd1,r_hd2,r_eye,r_smi,r_jaw,r_bd,r_arm,r_bd,r_leg,r_leg,r_ft],
  size: 12,
};
