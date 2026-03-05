import type { ToolChainData } from '@agent-move/shared';
import type { StateStore } from '../connection/state-store.js';

export class ToolChainPanel {
  private container: HTMLElement;
  private data: ToolChainData | null = null;
  private visible = false;
  private selectedTool: string | null = null;
  private onSnapshot: (data: ToolChainData) => void;

  constructor(private store: StateStore, parentEl: HTMLElement) {
    this.container = document.createElement('div');
    this.container.id = 'toolchain-content';
    this.container.style.display = 'none';
    parentEl.appendChild(this.container);

    this.onSnapshot = (data: ToolChainData) => {
      this.data = data;
      if (this.visible) this.render();
    };
    this.store.on('toolchain:snapshot', this.onSnapshot);
  }

  destroy(): void {
    this.store.off('toolchain:snapshot', this.onSnapshot);
    this.container.remove();
  }

  show(): void {
    this.visible = true;
    this.container.style.display = '';
    this.store.requestToolChain();
    this.render();
  }

  hide(): void {
    this.visible = false;
    this.container.style.display = 'none';
  }

  private render(): void {
    if (!this.data || this.data.transitions.length === 0) {
      this.container.innerHTML = '<div class="tc-empty">No tool transitions recorded yet</div>';
      return;
    }

    const { transitions, toolCounts } = this.data;
    const maxCount = Math.max(...transitions.map(t => t.count));

    // Sort tools by actual call count
    const sortedTools = Object.entries(toolCounts).sort((a, b) => b[1] - a[1]);
    const maxFreq = sortedTools[0]?.[1] ?? 1;
    const totalCalls = sortedTools.reduce((sum, [, c]) => sum + c, 0);

    // Filter transitions for selected tool
    const filtered = this.selectedTool
      ? transitions.filter(t => t.from === this.selectedTool || t.to === this.selectedTool)
      : transitions;
    const filteredMax = Math.max(...filtered.map(t => t.count), 1);

    let html = '';

    // ── Tool frequency summary ──
    html += `<div class="tc-section"><div class="tc-section-title">Tool Usage <span class="tc-hint">(${totalCalls} total calls)</span></div>`;
    html += '<div class="tc-tools">';
    for (const [tool, count] of sortedTools) {
      const pct = (count / maxFreq) * 100;
      const isSelected = tool === this.selectedTool;
      html += `<div class="tc-tool-row ${isSelected ? 'tc-selected' : ''}" data-tool="${this.esc(tool)}">`;
      html += `<span class="tc-tool-name">${this.esc(this.shortName(tool))}</span>`;
      html += `<div class="tc-tool-bar-wrap"><div class="tc-tool-bar" style="width:${pct}%"></div></div>`;
      html += `<span class="tc-tool-count">${count}</span>`;
      html += `</div>`;
    }
    html += '</div></div>';

    // ── Transitions table ──
    html += '<div class="tc-section"><div class="tc-section-title">';
    html += this.selectedTool
      ? `Transitions for <strong>${this.esc(this.shortName(this.selectedTool))}</strong> <button class="tc-clear-filter">Clear</button>`
      : 'Top Transitions <span class="tc-hint">(click a tool above to filter)</span>';
    html += '</div>';
    html += '<div class="tc-transitions">';

    const displayTransitions = [...filtered].sort((a, b) => b.count - a.count).slice(0, 20);
    for (const t of displayTransitions) {
      const pct = (t.count / filteredMax) * 100;
      const ratio = t.count / maxCount;
      // Color from cool blue-gray to warm orange
      const r = Math.round(100 + ratio * 155);
      const g = Math.round(130 + ratio * 40);
      const b2 = Math.round(180 - ratio * 100);
      html += `<div class="tc-transition-row">`;
      html += `<span class="tc-t-from">${this.esc(this.shortName(t.from))}</span>`;
      html += `<span class="tc-t-arrow">\u2192</span>`;
      html += `<span class="tc-t-to">${this.esc(this.shortName(t.to))}</span>`;
      html += `<div class="tc-t-bar-wrap"><div class="tc-t-bar" style="width:${pct}%;background:rgb(${r},${g},${b2})"></div></div>`;
      html += `<span class="tc-t-count">${t.count}\u00d7</span>`;
      html += `</div>`;
    }

    if (displayTransitions.length === 0) {
      html += '<div class="tc-empty" style="padding:12px">No transitions for this tool</div>';
    }
    html += '</div></div>';

    this.container.innerHTML = html;

    // Wire click handlers
    this.container.querySelectorAll('.tc-tool-row').forEach(row => {
      row.addEventListener('click', () => {
        const tool = (row as HTMLElement).dataset.tool!;
        this.selectedTool = this.selectedTool === tool ? null : tool;
        this.render();
      });
    });

    const clearBtn = this.container.querySelector('.tc-clear-filter');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedTool = null;
        this.render();
      });
    }
  }

  private shortName(name: string): string {
    if (name.startsWith('mcp__')) {
      const parts = name.split('__');
      return parts[parts.length - 1].slice(0, 18);
    }
    return name.length > 18 ? name.slice(0, 16) + '..' : name;
  }

  private esc(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
