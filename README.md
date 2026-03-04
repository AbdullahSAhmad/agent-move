<div align="center">

# AgentMove

**Watch your AI coding agents come alive.**

A real-time pixel-art visualizer that turns AI coding sessions into a living 2D world. Agents walk between rooms, use tools, chat, and rest — all rendered at 60fps in your browser.

```
npx agent-move
```

<br>

<img src=".github/screenshot.png" alt="AgentMove screenshot showing pixel-art agents in a 2D world with 9 activity zones" width="800">

<br>
<br>

[![npm version](https://img.shields.io/npm/v/agent-move)](https://www.npmjs.com/package/agent-move)
[![license](https://img.shields.io/npm/l/agent-move)](LICENSE)

</div>

---

## What You're Looking At

AgentMove reads AI coding agent session files (`~/.claude/projects/**/*.jsonl`) and maps every tool call to one of **9 activity zones**. Each agent gets a unique pixel-art character that physically walks between zones as it works.

| Zone | What Happens There | Tools |
|------|--------------------|-------|
| **Files** | Reading, writing, editing code | Read, Write, Edit, Glob |
| **Terminal** | Running shell commands | Bash |
| **Search** | Searching code and the web | Grep, WebSearch |
| **Web** | Browsing, fetching, MCP tools | WebFetch, Playwright, MCP `*` |
| **Thinking** | Planning and asking questions | EnterPlanMode, AskUserQuestion |
| **Messaging** | Talking to other agents | SendMessage |
| **Tasks** | Managing work items | TaskCreate, TaskUpdate |
| **Spawn** | Agents arriving and departing | Agent, TeamCreate |
| **Idle** | Resting after 15s of inactivity | — |

## Getting Started

### Prerequisites

- **Node.js 18+**
- **Claude Code** installed and used at least once (so `~/.claude/` exists)

### One Command

```bash
npx agent-move
```

That's it. The server starts, your browser opens, and any active coding session is visualized immediately.

### Options

```bash
npx agent-move --port 4000    # custom port (default: 3333)
```

### From Source (for development)

```bash
git clone https://github.com/AbdullahSAhmad/agent-move.git
cd agent-move
npm install
npm run dev
```

This starts the server on `:3333` and the Vite dev server on `:5173` with hot reload.

## Features

### Visualization

- **Programmatic pixel-art sprites** — 16x16 characters rendered at 3x scale, no external image assets
- **12 color palettes** — each agent gets a distinct look
- **Animations** — idle breathing, walking between zones, working effects
- **Role badges** — MAIN, SUB, LEAD, MEMBER based on session type
- **Speech bubbles** — show the current tool or text output above each agent
- **Relationship lines** — dashed connections between parent/child and team agents
- **Zone glow** — rooms light up when agents are inside
- **Particle effects** — sparkles on tool use
- **Agent trails** — toggle fading trail dots behind moving agents (`T`)
- **Day/night cycle** — ambient lighting based on your local time (`N`)
- **4 themes** — Office, Space, Castle, Cyberpunk — selectable from the top bar

### Dashboard

- **Top bar** — navigation tabs (Monitor / Analytics / Leaderboard), live stats (active agents, idle count, total cost, token velocity), and quick actions
- **Agent list** — live sidebar with zone, current tool, token counts, and status indicators
- **Agent detail panel** — click any agent to see model, role, tokens, uptime, git branch, recent files with diff viewer, and scrolling activity feed
- **Agent customization** — rename agents and change their color palette (persisted in localStorage)
- **Minimap** — clickable overview showing zone layout, agent positions, and viewport (`\``)

### Analytics

- **Total cost tracking** — real-time cost estimation including cache read/creation token pricing
- **Cache efficiency** — cache hit rate percentage and estimated savings
- **Token velocity** — tokens/min with sparkline chart and trend indicator
- **Cost by agent** — per-agent cost breakdown with bar charts
- **Time by zone** — cumulative time distribution across zones (including idle)
- **Tool usage** — frequency breakdown of the most-used tools
- **Session duration** — per-agent uptime with active/idle status
- **Cost threshold alerts** — configurable budget alert with visual notification

### Leaderboard

- **Agent rankings** — sortable by tokens, cost, duration, or tool count
- **Medal badges** — top 3 agents highlighted
- **Visual bars** — proportional token usage comparison

### Navigation & Controls

- **Pan & zoom** — scroll wheel to zoom, click and drag to pan the world
- **Command palette** — fuzzy search for any action (`Ctrl+K`)
- **Focus mode** — follow an agent with smooth camera tracking (`F` to cycle, `Esc` to exit)
- **Timeline** — scrubber with live/replay modes, speed control (0.5x–8x), event filters, and per-agent swim lanes
- **Session export** — generate a markdown report of the session (`E`)
- **Sound effects** — synthesized audio for spawn, zone changes, tool use, idle, and shutdown (`M` to mute)
- **Toast notifications** — popup alerts for agent lifecycle events (spawn, idle, shutdown)
- **Keyboard shortcuts** — press `?` to see all available shortcuts
- **Auto-reconnect** — WebSocket reconnects with exponential backoff if the connection drops

## How It Works

```
AI agent writes JSONL session files
  → chokidar detects file changes
  → Only new bytes are read (byte-offset tracking)
  → JSONL parsed for tool_use / text / token_usage blocks
  → AgentStateManager updates state machine + emits events
  → Broadcaster pushes over WebSocket
  → Client StateStore receives + emits
  → AgentManager creates/moves/animates sprites
  → Pixi.js renders at 60fps
```

## Architecture

Three-package monorepo (npm workspaces):

```
agent-move/
├── bin/cli.js              # npx entry point
├── packages/
│   ├── shared/             # Types & constants (zero dependencies)
│   │   └── src/
│   │       ├── types/          AgentState, ZoneConfig, ServerMessage, JSONL
│   │       └── constants/      tool→zone map, zone configs, color palettes
│   ├── server/             # Fastify backend
│   │   └── src/
│   │       ├── watcher/        chokidar file watcher, JSONL parser
│   │       ├── state/          agent state machine with idle timers
│   │       ├── ws/             WebSocket broadcaster
│   │       └── routes/         REST API
│   └── client/             # Pixi.js frontend
│       └── src/
│           ├── sprites/        pixel-art data, palette resolver, textures
│           ├── world/          zone renderer, grid, camera, themes, day/night
│           ├── agents/         sprite logic, movement, relationships
│           ├── effects/        particles, zone glow, agent trails
│           ├── connection/     WebSocket client, state store
│           ├── audio/          sound effects, notifications
│           └── ui/             top bar, panels, overlays, command palette
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+K` | Command palette |
| `?` | Shortcuts help |
| `F` | Cycle focus between agents |
| `Esc` | Exit focus mode |
| `A` | Toggle analytics |
| `L` | Toggle leaderboard |
| `T` | Toggle agent trails |
| `N` | Toggle day/night cycle |
| `M` | Toggle sound |
| `E` | Export session |
| `` ` `` | Toggle minimap |
| `P` | Cycle theme |
| `H` | Toggle heatmap |

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/state` | All agent states as JSON |
| `WS /ws` | Real-time agent event stream |

The WebSocket sends a `full_state` snapshot on connect, then incremental events: `agent:spawn`, `agent:update`, `agent:idle`, `agent:shutdown`.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Renderer | [Pixi.js](https://pixijs.com/) v8 (WebGL) |
| Server | [Fastify](https://fastify.dev/) + [@fastify/websocket](https://github.com/fastify/fastify-websocket) |
| File watching | [chokidar](https://github.com/paulmillr/chokidar) v3 |
| Client build | [Vite](https://vite.dev/) |
| Language | TypeScript (strict, ES modules) |

## License

MIT
