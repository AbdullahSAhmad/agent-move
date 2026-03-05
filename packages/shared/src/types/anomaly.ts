export type AnomalyKind = 'token-spike' | 'retry-loop' | 'stuck-agent';

export interface AnomalyEvent {
  id: string;
  agentId: string;
  agentName: string;
  kind: AnomalyKind;
  message: string;
  severity: 'warning' | 'critical';
  timestamp: number;
  details?: Record<string, unknown>;
}

export interface AnomalyConfig {
  tokenVelocityThreshold: number;
  retryLoopThreshold: number;
  stuckTimeoutSeconds: number;
}

export const DEFAULT_ANOMALY_CONFIG: AnomalyConfig = {
  tokenVelocityThreshold: 100_000,
  retryLoopThreshold: 5,
  stuckTimeoutSeconds: 120,
};
