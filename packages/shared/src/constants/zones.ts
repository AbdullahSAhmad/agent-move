import type { ZoneConfig } from '../types/zone.js';

/**
 * Non-symmetric office floor plan.
 * Rooms have varying sizes that reflect their function.
 * All rooms tile within a unified building shell.
 *
 * Layout (approx):
 * ┌────────────────┬──────────┬───────────┐
 * │  Search/Library │ Terminal │  Web/Tech │
 * │  (440×400)      │ (280×400)│ (340×400) │
 * ├──────────┬──────┴──────────┴──┬────────┤
 * │  Files   │  Thinking/Meeting  │ Msgs   │
 * │ (320×320)│  (440×320)         │(300×320)│
 * ├────┬─────┴──────────┬─────────┴────────┤
 * │Spwn│  Idle/Break    │     Tasks        │
 * │220 │  (460×260)     │    (380×260)     │
 * └────┴────────────────┴──────────────────┘
 */

const WALL = 8;
const PAD = 12;

// Row heights
const R0H = 400;
const R1H = 320;
const R2H = 260;

// Row y positions
const R0Y = PAD;
const R1Y = PAD + R0H + WALL;
const R2Y = PAD + R0H + WALL + R1H + WALL;

// Row 0 widths (total inner = 440 + 8 + 280 + 8 + 340 = 1076)
const S0_W = 440;  // Search
const S1_W = 280;  // Terminal
const S2_W = 340;  // Web

// Row 1 widths (total inner = 320 + 8 + 440 + 8 + 300 = 1076)
const S3_W = 320;  // Files
const S4_W = 440;  // Thinking
const S5_W = 300;  // Messaging

// Row 2 widths (total inner = 220 + 8 + 460 + 8 + 380 = 1076)
const S6_W = 220;  // Spawn
const S7_W = 460;  // Idle
const S8_W = 380;  // Tasks

// Row 0 x positions
const R0X0 = PAD;
const R0X1 = PAD + S0_W + WALL;
const R0X2 = PAD + S0_W + WALL + S1_W + WALL;

// Row 1 x positions
const R1X0 = PAD;
const R1X1 = PAD + S3_W + WALL;
const R1X2 = PAD + S3_W + WALL + S4_W + WALL;

// Row 2 x positions
const R2X0 = PAD;
const R2X1 = PAD + S6_W + WALL;
const R2X2 = PAD + S6_W + WALL + S7_W + WALL;

export const ZONES: ZoneConfig[] = [
  // Row 0
  {
    id: 'search',
    label: 'Search',
    description: 'Grep, WebSearch — Research & lookup',
    icon: '📚',
    color: 0xeab308,
    x: R0X0, y: R0Y, width: S0_W, height: R0H,
  },
  {
    id: 'terminal',
    label: 'Terminal',
    description: 'Bash commands — Server room',
    icon: '💻',
    color: 0x22c55e,
    x: R0X1, y: R0Y, width: S1_W, height: R0H,
  },
  {
    id: 'web',
    label: 'Web',
    description: 'WebFetch, Browser — Network hub',
    icon: '🌐',
    color: 0x8b5cf6,
    x: R0X2, y: R0Y, width: S2_W, height: R0H,
  },
  // Row 1
  {
    id: 'files',
    label: 'Files',
    description: 'Read, Write, Edit, Glob — File storage',
    icon: '📁',
    color: 0x3b82f6,
    x: R1X0, y: R1Y, width: S3_W, height: R1H,
  },
  {
    id: 'thinking',
    label: 'Thinking',
    description: 'Planning, Questions — Conference area',
    icon: '💭',
    color: 0xf97316,
    x: R1X1, y: R1Y, width: S4_W, height: R1H,
  },
  {
    id: 'messaging',
    label: 'Messaging',
    description: 'SendMessage, Teams — Chat & relax',
    icon: '💬',
    color: 0xec4899,
    x: R1X2, y: R1Y, width: S5_W, height: R1H,
  },
  // Row 2
  {
    id: 'spawn',
    label: 'Spawn',
    description: 'Agent spawn/despawn — Entry portal',
    icon: '🌀',
    color: 0xa855f7,
    x: R2X0, y: R2Y, width: S6_W, height: R2H,
  },
  {
    id: 'idle',
    label: 'Idle',
    description: 'Idle agents rest here — Kitchen & lounge',
    icon: '☕',
    color: 0x6b7280,
    x: R2X1, y: R2Y, width: S7_W, height: R2H,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    description: 'TaskCreate, TaskUpdate — Kanban & planning',
    icon: '📋',
    color: 0x14b8a6,
    x: R2X2, y: R2Y, width: S8_W, height: R2H,
  },
];

export const ZONE_MAP = new Map(ZONES.map((z) => [z.id, z]));

export const WORLD_WIDTH = PAD * 2 + S0_W + WALL + S1_W + WALL + S2_W;
export const WORLD_HEIGHT = R2Y + R2H + PAD;
