import type { ToolChainData, ToolTransition } from '@agent-move/shared';

export class ToolChainTracker {
  private lastTool = new Map<string, string>();
  private transitions = new Map<string, number>();
  private toolCounts = new Map<string, number>();

  recordToolUse(agentId: string, toolName: string): void {
    this.toolCounts.set(toolName, (this.toolCounts.get(toolName) ?? 0) + 1);
    const prev = this.lastTool.get(agentId);
    this.lastTool.set(agentId, toolName);

    if (prev && prev !== toolName) {
      const key = `${prev}\u2192${toolName}`;
      this.transitions.set(key, (this.transitions.get(key) ?? 0) + 1);
    }
  }

  resetAgent(agentId: string): void {
    this.lastTool.delete(agentId);
  }

  reset(): void {
    this.lastTool.clear();
    this.transitions.clear();
    this.toolCounts.clear();
  }

  hasActiveAgents(): boolean {
    return this.lastTool.size > 0;
  }

  getSnapshot(): ToolChainData {
    const transitions: ToolTransition[] = [];
    for (const [key, count] of this.transitions) {
      const [from, to] = key.split('\u2192');
      transitions.push({ from, to, count });
    }
    transitions.sort((a, b) => b.count - a.count);

    const toolCounts: Record<string, number> = {};
    for (const [tool, count] of this.toolCounts) {
      toolCounts[tool] = count;
    }

    return {
      transitions,
      tools: Array.from(this.toolCounts.keys()).sort(),
      toolCounts,
    };
  }
}
