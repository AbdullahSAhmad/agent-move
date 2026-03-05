export interface ToolTransition {
  from: string;
  to: string;
  count: number;
}

export interface ToolChainData {
  transitions: ToolTransition[];
  tools: string[];
  toolCounts: Record<string, number>;
}
