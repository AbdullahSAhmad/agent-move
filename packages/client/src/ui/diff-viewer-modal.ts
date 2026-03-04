import { escapeAttr } from '../utils/formatting.js';

interface DiffItem {
  filePath: string;
  oldText: string;
  newText: string;
  timestamp: number;
}

/**
 * Modal for viewing diffs associated with a file.
 * Side-by-side old/new panes, one block per edit, newest first.
 */
export class DiffViewerModal {
  private el: HTMLElement;
  private isOpen = false;

  private globalKeydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isOpen) {
      e.preventDefault();
      this.close();
    }
  };

  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'diff-viewer-modal';
    this.el.innerHTML = `
      <div class="dv-backdrop"></div>
      <div class="dv-modal">
        <div class="dv-header">
          <span class="dv-title"></span>
          <button class="dv-close">&times;</button>
        </div>
        <div class="dv-body"></div>
      </div>
    `;
    document.body.appendChild(this.el);

    this.el.querySelector('.dv-backdrop')!.addEventListener('click', () => this.close());
    this.el.querySelector('.dv-close')!.addEventListener('click', () => this.close());
    document.addEventListener('keydown', this.globalKeydownHandler);
  }

  open(filePath: string, diffs: DiffItem[]): void {
    const shortPath = filePath.replace(/\\/g, '/').split('/').slice(-2).join('/');
    this.el.querySelector('.dv-title')!.textContent = shortPath;

    const sorted = [...diffs].sort((a, b) => b.timestamp - a.timestamp);

    const bodyEl = this.el.querySelector('.dv-body')!;
    bodyEl.innerHTML = sorted.map(d => {
      const time = new Date(d.timestamp).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });

      const oldLines = (d.oldText || '').split('\n');
      const newLines = (d.newText || '').split('\n');
      const maxLen = Math.max(oldLines.length, newLines.length);

      let rows = '';
      for (let i = 0; i < maxLen; i++) {
        const ol = i < oldLines.length ? oldLines[i] : '';
        const nl = i < newLines.length ? newLines[i] : '';
        rows += `<div class="dv-row">` +
          `<div class="dv-cell dv-old">${escapeAttr(ol)}</div>` +
          `<div class="dv-cell dv-new">${escapeAttr(nl)}</div>` +
          `</div>`;
      }

      return `
        <div class="dv-block">
          <div class="dv-time">${time}</div>
          <div class="dv-labels">
            <span class="dv-label dv-label-old">removed</span>
            <span class="dv-label dv-label-new">added</span>
          </div>
          <div class="dv-grid">${rows}</div>
        </div>`;
    }).join('');

    this.isOpen = true;
    this.el.classList.add('open');
  }

  close(): void {
    this.isOpen = false;
    this.el.classList.remove('open');
  }

  dispose(): void {
    document.removeEventListener('keydown', this.globalKeydownHandler);
    this.el.remove();
  }
}
