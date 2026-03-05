import type { ZoneId } from '@agent-move/shared';
import { ZONE_MAP, ZONES } from '@agent-move/shared';

interface Annotation {
  id: string;
  text: string;
  relX: number;
  relY: number;
  zoneId: ZoneId;
}

const STORAGE_KEY = 'zone-annotations';
let idCounter = 0;

export class ZoneAnnotations {
  private container: HTMLElement;
  private annotations = new Map<string, Annotation>();
  private noteEls = new Map<string, HTMLElement>();
  private visible = true;
  private rootX = 0;
  private rootY = 0;
  private scale = 1;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'zone-annotations';
    this.container.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:15;';
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
      canvasContainer.appendChild(this.container);
    }

    this.load();
    this.renderAll();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr: Annotation[] = JSON.parse(raw);
        for (const a of arr) {
          this.annotations.set(a.id, a);
          const num = parseInt(a.id.replace('ann-', ''), 10);
          if (!isNaN(num) && num >= idCounter) {
            idCounter = num + 1;
          }
        }
      }
    } catch { /* ignore */ }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(this.annotations.values())));
  }

  private renderAll(): void {
    for (const ann of this.annotations.values()) {
      this.createNoteEl(ann);
    }
  }

  private createNoteEl(ann: Annotation): void {
    const el = document.createElement('div');
    el.className = 'zone-annotation';
    el.style.pointerEvents = 'auto';
    el.innerHTML = `<span class="za-text">${this.escapeHtml(ann.text)}</span><button class="za-delete" title="Delete">&times;</button>`;

    // Delete button
    el.querySelector('.za-delete')!.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeAnnotation(ann.id);
    });

    // Drag
    this.makeDraggable(el, ann);

    this.container.appendChild(el);
    this.noteEls.set(ann.id, el);
    this.positionNote(ann, el);
  }

  private positionNote(ann: Annotation, el: HTMLElement): void {
    const zone = ZONE_MAP.get(ann.zoneId);
    if (!zone) return;
    const worldX = zone.x + ann.relX * zone.width;
    const worldY = zone.y + ann.relY * zone.height;
    const screenX = worldX * this.scale + this.rootX;
    const screenY = worldY * this.scale + this.rootY;
    el.style.transform = `translate(${screenX}px, ${screenY}px) scale(${Math.min(1, this.scale)})`;
  }

  private makeDraggable(el: HTMLElement, ann: Annotation): void {
    let startX = 0, startY = 0, startRelX = 0, startRelY = 0;
    const zone = ZONE_MAP.get(ann.zoneId);
    if (!zone) return;

    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).classList.contains('za-delete')) return;
      e.stopPropagation();
      startX = e.clientX;
      startY = e.clientY;
      startRelX = ann.relX;
      startRelY = ann.relY;
      el.setPointerCapture(e.pointerId);
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp, { once: true });
    };

    const onMove = (e: PointerEvent) => {
      const dx = (e.clientX - startX) / this.scale;
      const dy = (e.clientY - startY) / this.scale;
      ann.relX = Math.max(0.05, Math.min(0.95, startRelX + dx / zone!.width));
      ann.relY = Math.max(0.05, Math.min(0.95, startRelY + dy / zone!.height));
      this.positionNote(ann, el);
    };

    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      this.save();
    };

    el.addEventListener('pointerdown', onDown);
  }

  /** Detect zone from world coordinates and add annotation */
  addAnnotationAtWorld(worldX: number, worldY: number): void {
    for (const zone of ZONES) {
      const zc = ZONE_MAP.get(zone.id as ZoneId)!;
      if (worldX >= zc.x && worldX <= zc.x + zc.width && worldY >= zc.y && worldY <= zc.y + zc.height) {
        this.promptAndAdd(zone.id as ZoneId, (worldX - zc.x) / zc.width, (worldY - zc.y) / zc.height);
        return;
      }
    }
  }

  addAnnotationFromScreen(screenX: number, screenY: number): void {
    const worldX = (screenX - this.rootX) / this.scale;
    const worldY = (screenY - this.rootY) / this.scale;
    this.addAnnotationAtWorld(worldX, worldY);
  }

  private promptAndAdd(zoneId: ZoneId, relX: number, relY: number): void {
    // Create inline textarea
    const zone = ZONE_MAP.get(zoneId);
    if (!zone) return;

    const worldX = zone.x + relX * zone.width;
    const worldY = zone.y + relY * zone.height;
    const screenX = worldX * this.scale + this.rootX;
    const screenY = worldY * this.scale + this.rootY;

    const textarea = document.createElement('textarea');
    textarea.className = 'zone-annotation za-input';
    textarea.style.cssText = `position:absolute;pointer-events:auto;transform:translate(${screenX}px,${screenY}px);z-index:20;`;
    textarea.placeholder = 'Type a note...';
    textarea.rows = 2;
    this.container.appendChild(textarea);
    textarea.focus();

    const commit = () => {
      const text = textarea.value.trim();
      textarea.remove();
      if (text) {
        const id = `ann-${idCounter++}`;
        const ann: Annotation = { id, text, relX, relY, zoneId };
        this.annotations.set(id, ann);
        this.createNoteEl(ann);
        this.save();
      }
    };

    textarea.addEventListener('blur', commit, { once: true });
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        textarea.blur();
      }
      if (e.key === 'Escape') {
        textarea.value = '';
        textarea.blur();
      }
    });
  }

  removeAnnotation(id: string): void {
    this.annotations.delete(id);
    const el = this.noteEls.get(id);
    if (el) { el.remove(); this.noteEls.delete(id); }
    this.save();
  }

  updateTransform(rootX: number, rootY: number, scale: number): void {
    this.rootX = rootX;
    this.rootY = rootY;
    this.scale = scale;
    if (!this.visible) return;
    for (const ann of this.annotations.values()) {
      const el = this.noteEls.get(ann.id);
      if (el) this.positionNote(ann, el);
    }
  }

  toggle(): void {
    this.visible = !this.visible;
    this.container.style.display = this.visible ? '' : 'none';
  }

  get isVisible(): boolean {
    return this.visible;
  }

  private escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
