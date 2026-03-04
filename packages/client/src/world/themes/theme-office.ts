import { COLORS } from '@agent-move/shared';
import { ZONE_DECORATORS } from '../furniture.js';
import type { Theme, ZoneDecoratorFn } from './theme-types.js';
import type { ZoneId } from '@agent-move/shared';

const fallback: ZoneDecoratorFn = (g, x, y, w, h) => {
  g.roundRect(x, y, w, h, 4).fill({ color: 0x333344, alpha: 0.15 });
};

export const officeTheme: Theme = {
  id: 'office',
  name: 'Office',
  icon: '🏢',
  colors: {
    background: COLORS.background,
    gridLine: 0x1a1e30,
    gridLineSub: 0x14172a,
  },
  decorators: {
    search: ZONE_DECORATORS.search ?? fallback,
    terminal: ZONE_DECORATORS.terminal ?? fallback,
    web: ZONE_DECORATORS.web ?? fallback,
    files: ZONE_DECORATORS.files ?? fallback,
    thinking: ZONE_DECORATORS.thinking ?? fallback,
    messaging: ZONE_DECORATORS.messaging ?? fallback,
    spawn: ZONE_DECORATORS.spawn ?? fallback,
    idle: ZONE_DECORATORS.idle ?? fallback,
    tasks: ZONE_DECORATORS.tasks ?? fallback,
  } as Record<ZoneId, ZoneDecoratorFn>,
};
