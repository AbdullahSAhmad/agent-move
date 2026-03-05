export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'deleted';

export interface TaskNode {
  id: string;
  subject: string;
  description?: string;
  status: TaskStatus;
  owner?: string;
  agentId: string;
  agentName?: string;
  projectName?: string;
  blocks: string[];
  blockedBy: string[];
  timestamp: number;
  /** Scoped key (rootSessionId::shortId) — used for cross-root uniqueness */
  _rootKey?: string;
}

export interface TaskGraphData {
  tasks: TaskNode[];
}
