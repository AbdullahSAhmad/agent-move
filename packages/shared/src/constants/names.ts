/** Whimsical names assigned to unnamed agents for easy identification */
const FUNNY_NAMES = [
  'Pixel', 'Turbo', 'Nimbus', 'Sparky', 'Biscuit',
  'Wombat', 'Noodle', 'Zigzag', 'Pickle', 'Mango',
  'Rocket', 'Waffle', 'Pebble', 'Comet', 'Doodle',
  'Gizmo', 'Quasar', 'Tango', 'Breeze', 'Fidget',
  'Blitz', 'Marble', 'Sprout', 'Fizz', 'Cosmo',
  'Rusty', 'Tofu', 'Orbit', 'Jinx', 'Clover',
  'Bolt', 'Mochi', 'Atlas', 'Ember', 'Pippin',
  'Rumble', 'Sage', 'Twix', 'Flint', 'Bumble',
  'Nova', 'Chip', 'Pecan', 'Drift', 'Pluto',
  'Rune', 'Taffy', 'Zing', 'Vapor', 'Acorn',
  'Sonic', 'Puffin', 'Quill', 'Dash', 'Hazel',
  'Crisp', 'Fable', 'Maple', 'Glitch', 'Sable',
];

/**
 * Deterministic hash of a string to pick a funny name.
 * Stable across reconnects (same sessionId → same name).
 */
export function getFunnyName(sessionId: string): string {
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = ((hash << 5) - hash + sessionId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % FUNNY_NAMES.length;
  return FUNNY_NAMES[index];
}
