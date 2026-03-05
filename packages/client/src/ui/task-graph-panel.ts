import type { TaskGraphData, TaskNode } from '@agent-move/shared';
import type { StateStore } from '../connection/state-store.js';

const STATUS_COLORS: Record<string, string> = {
  pending: '#a78bfa',
  in_progress: '#38bdf8',
  completed: '#4ade80',
  deleted: '#f87171',
};

const STATUS_ICONS: Record<string, string> = {
  pending: '\u25CB',
  in_progress: '\u25D4',
  completed: '\u2713',
  deleted: '\u2715',
};

const NODE_W = 210;
const NODE_H = 56;
const LAYER_GAP = 50;
const NODE_GAP = 12;
const PAD = 16;

interface LayoutNode { task: TaskNode; x: number; y: number }

export class TaskGraphPanel {
  private container: HTMLElement;
  private data: TaskGraphData | null = null;
  private visible = false;
  private onSnapshot: (data: TaskGraphData) => void;

  constructor(private store: StateStore, parentEl: HTMLElement) {
    this.container = document.createElement('div');
    this.container.id = 'taskgraph-content';
    this.container.style.display = 'none';
    parentEl.appendChild(this.container);

    this.onSnapshot = (data: TaskGraphData) => {
      this.data = data;
      if (this.visible) this.render();
    };
    this.store.on('taskgraph:snapshot', this.onSnapshot);
  }

  destroy(): void {
    this.store.off('taskgraph:snapshot', this.onSnapshot);
    this.container.remove();
  }

  show(): void {
    this.visible = true;
    this.container.style.display = '';
    this.store.requestTaskGraph();
    this.render();
  }

  hide(): void {
    this.visible = false;
    this.container.style.display = 'none';
  }

  private render(): void {
    if (!this.data || this.data.tasks.length === 0) {
      this.container.innerHTML = '<div class="tg-empty">No tasks created yet</div>';
      return;
    }

    const tasks = this.data.tasks.filter(t => t.status !== 'deleted');
    if (tasks.length === 0) {
      this.container.innerHTML = '<div class="tg-empty">No tasks created yet</div>';
      return;
    }

    // Use _rootKey as unique key (falls back to id for legacy data)
    const uid = (t: TaskNode) => t._rootKey ?? t.id;
    const taskMap = new Map(tasks.map(t => [uid(t), t]));

    // Split standalone vs connected
    const connectedIds = new Set<string>();
    for (const t of tasks) {
      const hasDepIn = t.blockedBy.some(id => taskMap.has(id));
      const hasDepOut = t.blocks.some(id => taskMap.has(id));
      if (hasDepIn || hasDepOut) {
        connectedIds.add(uid(t));
        for (const id of t.blockedBy) if (taskMap.has(id)) connectedIds.add(id);
        for (const id of t.blocks) if (taskMap.has(id)) connectedIds.add(id);
      }
    }

    const standalone = tasks.filter(t => !connectedIds.has(uid(t)));
    const connected = tasks.filter(t => connectedIds.has(uid(t)));

    const ord: Record<string, number> = { in_progress: 0, pending: 1, completed: 2, deleted: 3 };
    standalone.sort((a, b) => {
      const so = (ord[a.status] ?? 9) - (ord[b.status] ?? 9);
      return so !== 0 ? so : parseInt(a.id) - parseInt(b.id);
    });

    // Counts
    const counts = { pending: 0, in_progress: 0, completed: 0 };
    for (const t of tasks) {
      if (t.status in counts) counts[t.status as keyof typeof counts]++;
    }

    let html = '';

    // Summary
    html += '<div class="tg-summary">';
    if (counts.in_progress > 0) html += `<span class="tg-badge tg-badge-active">${counts.in_progress} active</span>`;
    if (counts.pending > 0) html += `<span class="tg-badge tg-badge-pending">${counts.pending} pending</span>`;
    if (counts.completed > 0) html += `<span class="tg-badge tg-badge-done">${counts.completed} done</span>`;
    html += `<span class="tg-total">${tasks.length} total</span>`;
    html += '</div>';

    // Standalone rows
    if (standalone.length > 0) {
      html += '<div class="tg-standalone">';
      for (const t of standalone) {
        const color = STATUS_COLORS[t.status] ?? STATUS_COLORS.pending;
        const icon = STATUS_ICONS[t.status] ?? STATUS_ICONS.pending;
        html += `<div class="tg-row" style="--sc:${color}">`;
        html += `<span class="tg-row-icon" style="color:${color}">${icon}</span>`;
        html += `<span class="tg-row-subj">${esc(t.subject)}</span>`;
        html += this.renderRowTags(t);
        html += `<span class="tg-row-id">#${esc(t.id)}</span>`;
        html += '</div>';
      }
      html += '</div>';
    }

    // Connected clusters — each gets its own SVG
    if (connected.length > 0) {
      const clusters = this.findClusters(connected, taskMap, uid);
      for (const cluster of clusters) {
        html += this.renderCluster(cluster, taskMap, uid);
      }
    }

    this.container.innerHTML = html;
  }

  private renderCluster(cluster: TaskNode[], taskMap: Map<string, TaskNode>, uid: (t: TaskNode) => string): string {
    const cMap = new Map(cluster.map(t => [uid(t), t]));
    const nodes = this.layoutCluster(cluster, cMap, uid);
    const nodeMap = new Map(nodes.map(n => [uid(n.task), n]));

    const svgW = Math.max(...nodes.map(n => n.x + NODE_W)) + PAD;
    const svgH = Math.max(...nodes.map(n => n.y + NODE_H)) + PAD;

    let html = `<div class="tg-cluster">`;
    html += `<svg class="tg-svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">`;
    html += '<defs><marker id="tg-arr" viewBox="0 0 10 8" refX="10" refY="4" markerWidth="7" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,4 L0,8 Z" fill="#666"/></marker></defs>';

    // Edges
    for (const node of nodes) {
      for (const depId of node.task.blockedBy) {
        const from = nodeMap.get(depId);
        if (!from) continue;
        const x1 = from.x + NODE_W / 2;
        const y1 = from.y + NODE_H;
        const x2 = node.x + NODE_W / 2;
        const y2 = node.y;
        const cp = Math.max((y2 - y1) * 0.4, 12);
        html += `<path class="tg-edge" d="M${x1},${y1} C${x1},${y1 + cp} ${x2},${y2 - cp} ${x2},${y2}" marker-end="url(#tg-arr)"/>`;
      }
    }

    // Nodes
    for (const n of nodes) {
      const t = n.task;
      const color = STATUS_COLORS[t.status] ?? STATUS_COLORS.pending;
      const icon = STATUS_ICONS[t.status] ?? STATUS_ICONS.pending;
      html += `<g class="tg-node">`;
      html += `<rect x="${n.x}" y="${n.y}" width="${NODE_W}" height="${NODE_H}" rx="5" class="tg-node-bg"/>`;
      html += `<rect x="${n.x}" y="${n.y}" width="3" height="${NODE_H}" rx="1" fill="${color}"/>`;
      html += `<text x="${n.x + 12}" y="${n.y + 18}" class="tg-node-icon" fill="${color}">${icon}</text>`;
      html += `<text x="${n.x + NODE_W - 7}" y="${n.y + 16}" class="tg-node-id" text-anchor="end">#${esc(t.id)}</text>`;
      html += `<text x="${n.x + 25}" y="${n.y + 18}" class="tg-node-subj">${esc(trunc(t.subject, 24))}</text>`;
      // Second line: agent/project info
      const info = this.nodeInfoText(t);
      if (info) {
        html += `<text x="${n.x + 12}" y="${n.y + 38}" class="tg-node-info">${esc(trunc(info, 28))}</text>`;
      }
      html += `</g>`;
    }

    html += '</svg></div>';
    return html;
  }

  private findClusters(tasks: TaskNode[], taskMap: Map<string, TaskNode>, uid: (t: TaskNode) => string): TaskNode[][] {
    const ids = new Set(tasks.map(t => uid(t)));
    const visited = new Set<string>();
    const clusters: TaskNode[][] = [];

    for (const t of tasks) {
      const tUid = uid(t);
      if (visited.has(tUid)) continue;
      const group: TaskNode[] = [];
      const queue = [tUid];
      visited.add(tUid);
      while (queue.length > 0) {
        const id = queue.shift()!;
        const node = taskMap.get(id);
        if (!node) continue;
        group.push(node);
        for (const nid of [...node.blockedBy, ...node.blocks]) {
          if (ids.has(nid) && !visited.has(nid)) {
            visited.add(nid);
            queue.push(nid);
          }
        }
      }
      clusters.push(group);
    }
    return clusters;
  }

  private layoutCluster(tasks: TaskNode[], cMap: Map<string, TaskNode>, uid: (t: TaskNode) => string): LayoutNode[] {
    // Layer assignment (using uid keys that match cMap)
    const layerOf = new Map<string, number>();
    const getLayer = (id: string, vis: Set<string>): number => {
      if (layerOf.has(id)) return layerOf.get(id)!;
      if (vis.has(id)) return 0;
      vis.add(id);
      const t = cMap.get(id);
      if (!t || t.blockedBy.filter(d => cMap.has(d)).length === 0) { layerOf.set(id, 0); return 0; }
      let mx = 0;
      for (const d of t.blockedBy) if (cMap.has(d)) mx = Math.max(mx, getLayer(d, vis));
      const l = mx + 1;
      layerOf.set(id, l);
      return l;
    };
    for (const t of tasks) getLayer(uid(t), new Set());

    // Group
    const maxL = Math.max(0, ...layerOf.values());
    const layers: TaskNode[][] = Array.from({ length: maxL + 1 }, () => []);
    for (const t of tasks) layers[layerOf.get(uid(t)) ?? 0].push(t);

    // Sort within layer
    const ord: Record<string, number> = { in_progress: 0, pending: 1, completed: 2, deleted: 3 };
    for (const layer of layers) layer.sort((a, b) => {
      const so = (ord[a.status] ?? 9) - (ord[b.status] ?? 9);
      return so !== 0 ? so : parseInt(a.id) - parseInt(b.id);
    });

    // Crossing reduction (prevPos keyed by uid to match blockedBy references)
    for (let li = 1; li < layers.length; li++) {
      const prevPos = new Map<string, number>();
      layers[li - 1].forEach((t, i) => prevPos.set(uid(t), i));
      layers[li].sort((a, b) => avgPos(a, prevPos, cMap) - avgPos(b, prevPos, cMap));
    }

    // Position
    const maxW = Math.max(...layers.map(l => l.length));
    const totalW = maxW * (NODE_W + NODE_GAP) - NODE_GAP;
    const nodes: LayoutNode[] = [];
    for (let li = 0; li < layers.length; li++) {
      const layer = layers[li];
      const lw = layer.length * (NODE_W + NODE_GAP) - NODE_GAP;
      const ox = PAD + (totalW - lw) / 2;
      const y = PAD + li * (NODE_H + LAYER_GAP);
      for (let ci = 0; ci < layer.length; ci++) {
        nodes.push({ task: layer[ci], x: ox + ci * (NODE_W + NODE_GAP), y });
      }
    }
    return nodes;
  }

  /** Build info text: "project / agent" or whichever is available */
  private nodeInfoText(t: TaskNode): string {
    const parts: string[] = [];
    if (t.projectName) parts.push(t.projectName);
    if (t.agentName && t.agentName !== t.projectName) parts.push(t.agentName);
    if (t.owner && t.owner !== t.agentName) parts.push(t.owner);
    return parts.join(' \u00B7 '); // middle dot separator
  }

  /** Render inline tags for standalone rows */
  private renderRowTags(t: TaskNode): string {
    let html = '';
    if (t.projectName) html += `<span class="tg-row-tag">${esc(t.projectName)}</span>`;
    if (t.agentName && t.agentName !== t.projectName) html += `<span class="tg-row-tag">${esc(t.agentName)}</span>`;
    if (t.owner && t.owner !== t.agentName) html += `<span class="tg-row-tag">${esc(t.owner)}</span>`;
    return html;
  }
}

function avgPos(task: TaskNode, prevPos: Map<string, number>, map: Map<string, TaskNode>): number {
  const cols: number[] = [];
  for (const d of task.blockedBy) { const p = prevPos.get(d); if (p !== undefined) cols.push(p); }
  return cols.length === 0 ? 999 : cols.reduce((a, b) => a + b, 0) / cols.length;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '\u2026' : s;
}
