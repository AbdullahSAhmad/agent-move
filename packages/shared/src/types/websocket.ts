import type { AgentState, ActivityEntry } from './agent.js';
import type { AnomalyEvent } from './anomaly.js';
import type { ToolChainData } from './tool-chain.js';
import type { TaskGraphData } from './task-graph.js';

/** Server → Client messages */
export type ServerMessage =
  | FullStateMessage
  | AgentSpawnMessage
  | AgentUpdateMessage
  | AgentIdleMessage
  | AgentShutdownMessage
  | AgentHistoryMessage
  | TimelineSnapshotMessage
  | AnomalyAlertMessage
  | ToolChainSnapshotMessage
  | TaskGraphSnapshotMessage;

export interface FullStateMessage {
  type: 'full_state';
  agents: AgentState[];
  timestamp: number;
}

export interface AgentSpawnMessage {
  type: 'agent:spawn';
  agent: AgentState;
  timestamp: number;
}

export interface AgentUpdateMessage {
  type: 'agent:update';
  agent: AgentState;
  timestamp: number;
}

export interface AgentIdleMessage {
  type: 'agent:idle';
  agent: AgentState;
  timestamp: number;
}

export interface AgentShutdownMessage {
  type: 'agent:shutdown';
  agentId: string;
  timestamp: number;
}

export interface AgentHistoryMessage {
  type: 'agent:history';
  agentId: string;
  entries: ActivityEntry[];
  timestamp: number;
}

/** Timeline event as stored in the global buffer */
export interface TimelineEvent {
  type: 'agent:spawn' | 'agent:update' | 'agent:idle' | 'agent:shutdown';
  agent: AgentState;
  timestamp: number;
}

export interface TimelineSnapshotMessage {
  type: 'timeline:snapshot';
  events: TimelineEvent[];
  timestamp: number;
}

export interface AnomalyAlertMessage {
  type: 'anomaly:alert';
  anomaly: AnomalyEvent;
  timestamp: number;
}

export interface ToolChainSnapshotMessage {
  type: 'toolchain:snapshot';
  data: ToolChainData;
  timestamp: number;
}

export interface TaskGraphSnapshotMessage {
  type: 'taskgraph:snapshot';
  data: TaskGraphData;
  timestamp: number;
}

/** Client → Server messages */
export type ClientMessage = PingMessage | RequestHistoryMessage | RequestToolChainMessage | RequestTaskGraphMessage;

export interface PingMessage {
  type: 'ping';
}

export interface RequestHistoryMessage {
  type: 'request:history';
  agentId: string;
}

export interface RequestToolChainMessage {
  type: 'request:toolchain';
}

export interface RequestTaskGraphMessage {
  type: 'request:taskgraph';
}
