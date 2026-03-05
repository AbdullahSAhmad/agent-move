import type { WebSocket } from 'ws';
import type { AgentStateManager } from '../state/agent-state-manager.js';
import type { ServerMessage, AgentEvent, AnomalyEvent, TaskGraphData, ToolChainData } from '@agent-move/shared';

export class Broadcaster {
  private clients = new Set<WebSocket>();

  constructor(private stateManager: AgentStateManager) {
    // Forward all agent events to connected clients
    for (const eventType of ['agent:spawn', 'agent:update', 'agent:idle', 'agent:shutdown'] as const) {
      stateManager.on(eventType, (event: AgentEvent) => {
        if (eventType === 'agent:shutdown') {
          this.broadcast({
            type: 'agent:shutdown',
            agentId: event.agent.id,
            timestamp: event.timestamp,
          });
        } else {
          this.broadcast({
            type: eventType,
            agent: event.agent,
            timestamp: event.timestamp,
          } as ServerMessage);
        }
      });
    }

    // Forward anomaly events
    stateManager.anomalyDetector.on('anomaly', (anomaly: AnomalyEvent) => {
      this.broadcast({
        type: 'anomaly:alert',
        anomaly,
        timestamp: Date.now(),
      });
    });

    // Forward tool chain changes
    stateManager.on('toolchain:changed', (payload: { data: ToolChainData; timestamp: number }) => {
      this.broadcast({
        type: 'toolchain:snapshot',
        data: payload.data,
        timestamp: payload.timestamp,
      });
    });

    // Forward task graph changes
    stateManager.on('taskgraph:changed', (payload: { data: TaskGraphData; timestamp: number }) => {
      this.broadcast({
        type: 'taskgraph:snapshot',
        data: payload.data,
        timestamp: payload.timestamp,
      });
    });
  }

  addClient(ws: WebSocket) {
    this.clients.add(ws);

    ws.on('close', () => {
      this.clients.delete(ws);
    });
    ws.on('error', () => {
      this.clients.delete(ws);
    });

    // Send full state snapshot on connect
    if (ws.readyState === 1) {
      try {
        const fullState: ServerMessage = {
          type: 'full_state',
          agents: this.stateManager.getAll(),
          timestamp: Date.now(),
        };
        ws.send(JSON.stringify(fullState));

        // Send timeline snapshot for replay
        const timeline: ServerMessage = {
          type: 'timeline:snapshot',
          events: this.stateManager.getTimeline(),
          timestamp: Date.now(),
        };
        ws.send(JSON.stringify(timeline));

        // Send tool chain snapshot
        const toolchain: ServerMessage = {
          type: 'toolchain:snapshot',
          data: this.stateManager.getToolChainSnapshot(),
          timestamp: Date.now(),
        };
        ws.send(JSON.stringify(toolchain));

        // Send task graph snapshot
        const taskgraph: ServerMessage = {
          type: 'taskgraph:snapshot',
          data: this.stateManager.getTaskGraphSnapshot(),
          timestamp: Date.now(),
        };
        ws.send(JSON.stringify(taskgraph));
      } catch {
        this.clients.delete(ws);
      }
    }
  }

  /** Send a message to a specific client */
  sendToClient(ws: WebSocket, message: ServerMessage): void {
    if (ws.readyState === 1) {
      try { ws.send(JSON.stringify(message)); } catch { this.clients.delete(ws); }
    }
  }

  private broadcast(message: ServerMessage) {
    const data = JSON.stringify(message);
    for (const client of this.clients) {
      if (client.readyState === 1) { // OPEN
        try {
          client.send(data);
        } catch {
          this.clients.delete(client);
        }
      }
    }
  }
}
