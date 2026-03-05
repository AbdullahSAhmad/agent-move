/** Assembles all 6 variant sprite sets + variant selector */
import type { SpriteSet } from './sprite-data';
import { HUMAN_MAIN, HUMAN_SUB } from './variant-human';
import { ROBOT_MAIN, ROBOT_SUB } from './variant-robot';
import { SKELETON_MAIN, SKELETON_SUB } from './variant-skeleton';
import { NINJA_MAIN, NINJA_SUB } from './variant-ninja';
import { WIZARD_MAIN, WIZARD_SUB } from './variant-wizard';
import { SLIME_MAIN, SLIME_SUB } from './variant-slime';

/** 6 completely different body types × 12 color palettes = 72 unique looks */
export const MAIN_VARIANT_SETS: SpriteSet[] = [
  HUMAN_MAIN,    // V0: Human (classic)
  ROBOT_MAIN,    // V1: Robot (boxy mechanical)
  SKELETON_MAIN, // V2: Skeleton (skull + ribcage)
  NINJA_MAIN,    // V3: Ninja (hooded, slim)
  WIZARD_MAIN,   // V4: Wizard (pointed hat, robe)
  SLIME_MAIN,    // V5: Slime (blobby, no legs)
];

export const SUB_VARIANT_SETS: SpriteSet[] = [
  HUMAN_SUB,
  ROBOT_SUB,
  SKELETON_SUB,
  NINJA_SUB,
  WIZARD_SUB,
  SLIME_SUB,
];

/** Deterministic variant index from project path (same project → same variant) */
export function getVariantIndex(projectPath: string): number {
  let hash = 0;
  for (let i = 0; i < projectPath.length; i++) {
    hash = ((hash << 5) - hash + projectPath.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % MAIN_VARIANT_SETS.length;
}
