import { AGENT_PALETTES } from '@agent-move/shared';
import { storageGet, storageSet } from '../utils/storage.js';

export interface CustomizationData {
  displayName?: string;
  colorIndex?: number;
}

type CustomizationMap = Record<string, CustomizationData>;

const STORAGE_KEY = 'agent-customizations';

export class AgentCustomizer {
  private el: HTMLElement;
  private customizations: CustomizationMap;
  /** The stable key (agent name) used for localStorage persistence */
  private currentStableKey: string | null = null;
  /** The live agentId for applying changes to the running agent */
  private currentAgentId: string | null = null;
  private onChange: ((agentId: string, stableKey: string, data: CustomizationData) => void) | null = null;

  constructor() {
    this.customizations = storageGet<CustomizationMap>(STORAGE_KEY, {});

    this.el = document.createElement('div');
    this.el.id = 'agent-customizer';
    this.el.innerHTML = `
      <div class="ac-backdrop"></div>
      <div class="ac-popover">
        <div class="ac-header">Customize Agent<button class="ac-close">&times;</button></div>
        <div class="ac-field">
          <label>Display Name</label>
          <input type="text" class="ac-name-input" maxlength="14" placeholder="Custom name..." />
        </div>
        <div class="ac-field">
          <label>Color</label>
          <div class="ac-palette"></div>
        </div>
        <div class="ac-actions">
          <button class="ac-reset">Reset</button>
          <button class="ac-save">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.el);

    // Build palette grid
    const paletteEl = this.el.querySelector('.ac-palette')!;
    AGENT_PALETTES.forEach((p, i) => {
      const swatch = document.createElement('div');
      swatch.className = 'ac-swatch';
      swatch.style.background = '#' + p.body.toString(16).padStart(6, '0');
      swatch.dataset.index = String(i);
      swatch.addEventListener('click', () => {
        paletteEl.querySelectorAll('.ac-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
      });
      paletteEl.appendChild(swatch);
    });

    this.el.querySelector('.ac-backdrop')!.addEventListener('click', () => this.close());
    this.el.querySelector('.ac-close')!.addEventListener('click', () => this.close());
    this.el.querySelector('.ac-save')!.addEventListener('click', () => this.save());
    this.el.querySelector('.ac-reset')!.addEventListener('click', () => this.reset());
  }

  setChangeHandler(handler: (agentId: string, stableKey: string, data: CustomizationData) => void): void {
    this.onChange = handler;
  }

  /** Look up saved customization by stable agent name */
  getCustomization(stableKey: string): CustomizationData | undefined {
    return this.customizations[stableKey];
  }

  /**
   * Open the customizer for an agent.
   * @param agentId - live session id (for applying changes)
   * @param stableKey - agent name used as persistent key (agentName or projectName)
   */
  open(agentId: string, stableKey: string): void {
    this.currentAgentId = agentId;
    this.currentStableKey = stableKey;
    const data = this.customizations[stableKey];
    (this.el.querySelector('.ac-name-input') as HTMLInputElement).value = data?.displayName ?? stableKey;

    const selectedIdx = data?.colorIndex ?? -1;
    this.el.querySelectorAll('.ac-swatch').forEach(s => {
      s.classList.toggle('selected', (s as HTMLElement).dataset.index === String(selectedIdx));
    });

    this.el.classList.add('open');
  }

  close(): void {
    this.el.classList.remove('open');
    this.currentAgentId = null;
    this.currentStableKey = null;
  }

  private save(): void {
    if (!this.currentAgentId || !this.currentStableKey) return;
    const name = (this.el.querySelector('.ac-name-input') as HTMLInputElement).value.trim();
    const selectedSwatch = this.el.querySelector('.ac-swatch.selected') as HTMLElement | null;
    const colorIndex = selectedSwatch ? parseInt(selectedSwatch.dataset.index!, 10) : undefined;

    const data: CustomizationData = {};
    if (name) data.displayName = name;
    if (colorIndex !== undefined) data.colorIndex = colorIndex;

    this.customizations[this.currentStableKey] = data;
    storageSet(STORAGE_KEY, this.customizations);
    this.onChange?.(this.currentAgentId, this.currentStableKey, data);
    this.close();
  }

  private reset(): void {
    if (!this.currentAgentId || !this.currentStableKey) return;
    delete this.customizations[this.currentStableKey];
    storageSet(STORAGE_KEY, this.customizations);
    this.onChange?.(this.currentAgentId, this.currentStableKey, {});
    this.close();
  }

  dispose(): void {
    this.el.remove();
  }
}
