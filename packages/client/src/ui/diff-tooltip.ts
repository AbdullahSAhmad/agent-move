import { escapeHtml } from '../utils/formatting.js';

export interface DiffData {
  filePath: string;
  oldText: string;
  newText: string;
}

export class DiffTooltip {
  private el: HTMLElement;
  private _visible = false;

  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'diff-tooltip';
    this.el.style.cssText = `
      position: fixed; z-index: 200; display: none;
      background: rgba(15, 17, 25, 0.95); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px; padding: 10px 12px; max-width: 420px; max-height: 300px;
      overflow: auto; font-size: 11px; font-family: 'Consolas', monospace;
      pointer-events: none; box-shadow: 0 4px 20px rgba(0,0,0,0.6);
    `;
    document.body.appendChild(this.el);
  }

  show(diff: DiffData, screenX: number, screenY: number): void {
    const oldLines = diff.oldText.split('\n').map(l =>
      `<div style="color:#f87171;background:rgba(239,68,68,0.1);padding:1px 4px">- ${escapeHtml(l)}</div>`
    ).join('');
    const newLines = diff.newText.split('\n').map(l =>
      `<div style="color:#4ade80;background:rgba(74,222,128,0.1);padding:1px 4px">+ ${escapeHtml(l)}</div>`
    ).join('');

    const fileName = diff.filePath.split(/[/\\]/).pop() ?? diff.filePath;
    this.el.innerHTML = `
      <div style="color:#94a3b8;margin-bottom:6px;font-weight:600">${escapeHtml(fileName)}</div>
      ${oldLines}${newLines}
    `;

    // Position near cursor but keep on screen
    const pad = 12;
    const left = Math.min(screenX + pad, window.innerWidth - 440);
    const top = Math.min(screenY + pad, window.innerHeight - 320);
    this.el.style.left = left + 'px';
    this.el.style.top = top + 'px';
    this.el.style.display = 'block';
    this._visible = true;
  }

  hide(): void {
    this.el.style.display = 'none';
    this._visible = false;
  }

  get visible(): boolean { return this._visible; }

  dispose(): void {
    this.el.remove();
  }
}
