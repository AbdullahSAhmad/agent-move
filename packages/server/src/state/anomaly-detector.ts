import { EventEmitter } from 'events';
import type { AnomalyEvent, AnomalyKind, AnomalyConfig } from '@agent-move/shared';
import { DEFAULT_ANOMALY_CONFIG } from '@agent-move/shared';

interface AgentAnomalyState {
  lastTools: string[];
  tokenSamples: Array<{ ts: number; total: number }>;
  lastActivityAt: number;
  lastAlertAt: Map<AnomalyKind, number>;
}

const COOLDOWN_MS = 60_000;
const TOKEN_WINDOW_MS = 60_000;

let anomalyIdCounter = 0;

export class AnomalyDetector extends EventEmitter {
  private agents = new Map<string, AgentAnomalyState>();
  private agentNames = new Map<string, string>();
  private config: AnomalyConfig;
  private stuckInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config?: Partial<AnomalyConfig>) {
    super();
    this.config = { ...DEFAULT_ANOMALY_CONFIG, ...config };
  }

  private getState(agentId: string): AgentAnomalyState {
    let state = this.agents.get(agentId);
    if (!state) {
      state = {
        lastTools: [],
        tokenSamples: [],
        lastActivityAt: Date.now(),
        lastAlertAt: new Map(),
      };
      this.agents.set(agentId, state);
    }
    return state;
  }

  setAgentName(agentId: string, name: string): void {
    this.agentNames.set(agentId, name);
  }

  checkToolUse(agentId: string, toolName: string): void {
    const state = this.getState(agentId);
    state.lastActivityAt = Date.now();
    state.lastTools.push(toolName);
    if (state.lastTools.length > 20) state.lastTools.shift();

    // Check for retry loop: N consecutive same-tool calls
    const threshold = this.config.retryLoopThreshold;
    if (state.lastTools.length >= threshold) {
      const recent = state.lastTools.slice(-threshold);
      if (recent.every(t => t === recent[0])) {
        this.alert(agentId, 'retry-loop', `${recent[0]} called ${threshold}+ times consecutively`, 'warning', {
          tool: recent[0],
          consecutiveCount: threshold,
        });
      }
    }
  }

  checkTokenUsage(agentId: string, inputTokens: number, outputTokens: number): void {
    const state = this.getState(agentId);
    state.lastActivityAt = Date.now();
    const now = Date.now();
    const total = inputTokens + outputTokens;
    state.tokenSamples.push({ ts: now, total });

    // Trim to window
    const cutoff = now - TOKEN_WINDOW_MS;
    while (state.tokenSamples.length > 0 && state.tokenSamples[0].ts < cutoff) {
      state.tokenSamples.shift();
    }

    // Calculate velocity (tokens per minute)
    if (state.tokenSamples.length >= 2) {
      const totalTokens = state.tokenSamples.reduce((sum, s) => sum + s.total, 0);
      const elapsed = (state.tokenSamples[state.tokenSamples.length - 1].ts - state.tokenSamples[0].ts) / 60_000;
      if (elapsed > 0.1) {
        const velocity = totalTokens / elapsed;
        if (velocity >= this.config.tokenVelocityThreshold) {
          this.alert(agentId, 'token-spike', `Token velocity ${Math.round(velocity)}/min exceeds threshold`, 'critical', {
            velocity: Math.round(velocity),
            threshold: this.config.tokenVelocityThreshold,
          });
        }
      }
    }
  }

  checkStuck(agentId: string, lastActivityAt: number): void {
    const state = this.getState(agentId);
    const elapsed = (Date.now() - lastActivityAt) / 1000;
    if (elapsed >= this.config.stuckTimeoutSeconds) {
      this.alert(agentId, 'stuck-agent', `No activity for ${Math.round(elapsed)}s`, 'warning', {
        idleSeconds: Math.round(elapsed),
        threshold: this.config.stuckTimeoutSeconds,
      });
    }
    // Update last activity from external source
    state.lastActivityAt = lastActivityAt;
  }

  startStuckDetection(getActiveAgents: () => Array<{ id: string; lastActivityAt: number; isIdle: boolean }>): void {
    if (this.stuckInterval) return;
    this.stuckInterval = setInterval(() => {
      for (const agent of getActiveAgents()) {
        if (!agent.isIdle) {
          this.checkStuck(agent.id, agent.lastActivityAt);
        }
      }
    }, 30_000);
  }

  removeAgent(agentId: string): void {
    this.agents.delete(agentId);
    this.agentNames.delete(agentId);
  }

  private alert(agentId: string, kind: AnomalyKind, message: string, severity: AnomalyEvent['severity'], details?: Record<string, unknown>): void {
    const state = this.getState(agentId);
    const now = Date.now();

    // Cooldown check
    const lastAlert = state.lastAlertAt.get(kind) ?? 0;
    if (now - lastAlert < COOLDOWN_MS) return;
    state.lastAlertAt.set(kind, now);

    const anomaly: AnomalyEvent = {
      id: `anomaly-${++anomalyIdCounter}`,
      agentId,
      agentName: this.agentNames.get(agentId) ?? agentId.slice(0, 10),
      kind,
      message,
      severity,
      timestamp: now,
      details,
    };

    this.emit('anomaly', anomaly);
  }

  dispose(): void {
    if (this.stuckInterval) {
      clearInterval(this.stuckInterval);
      this.stuckInterval = null;
    }
  }
}
