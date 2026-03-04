import type { Theme } from './theme-types.js';
import { officeTheme } from './theme-office.js';
import { spaceTheme } from './theme-space.js';
import { castleTheme } from './theme-castle.js';
import { cyberpunkTheme } from './theme-cyberpunk.js';
import { storageGet, storageSet } from '../../utils/storage.js';

const STORAGE_KEY = 'theme';

export const ALL_THEMES: Theme[] = [officeTheme, spaceTheme, castleTheme, cyberpunkTheme];

export class ThemeManager {
  private _current: Theme;
  private _onChange: ((theme: Theme) => void) | null = null;

  constructor() {
    const savedId = storageGet<string>(STORAGE_KEY, 'office');
    this._current = ALL_THEMES.find(t => t.id === savedId) ?? officeTheme;
  }

  get current(): Theme { return this._current; }

  setTheme(themeId: string): void {
    const theme = ALL_THEMES.find(t => t.id === themeId);
    if (!theme || theme.id === this._current.id) return;
    this._current = theme;
    storageSet(STORAGE_KEY, theme.id);
    this._onChange?.(theme);
  }

  onChange(handler: (theme: Theme) => void): void {
    this._onChange = handler;
  }

  cycleNext(): void {
    const idx = ALL_THEMES.indexOf(this._current);
    const next = ALL_THEMES[(idx + 1) % ALL_THEMES.length];
    this.setTheme(next.id);
  }
}
