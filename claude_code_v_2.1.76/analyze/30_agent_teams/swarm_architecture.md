# Swarm Architecture & Terminal Management

## Overview

Agent Teams (also known as Swarms) allows multiple Claude agents to work in parallel. The system utilizes terminal multiplexers (tmux or iTerm2) to provide a "Swarm View" where users can monitor all active agents simultaneously.

## Key Components

### Terminal Backends

Claude Code supports two primary terminal backends for managing agent panes:

1. **TmuxBackend** (`fEA`): The primary backend for most Unix-like systems.
2. **ITermBackend** (`EEA`): A specialized backend for macOS users running iTerm2.

The system automatically detects the environment and selects the appropriate backend using `getBackend` (`zt`).

### Swarm View Orchestration

The Swarm View is organized to prioritize the "Team Lead" while providing visibility into teammate progress.

- **Session Name**: `claude-swarm` (`WN`)
- **Window Name**: `swarm-view` (`gP1`)

#### Pane Layout Algorithm

When a team is created or a teammate is spawned, the backend manages the layout:

1. **Leader Pane**: The first agent (Team Lead) occupies a dedicated pane.
2. **Teammate Panes**: As teammates are added, the window is split.
3. **Rebalancing**: 
   - The Leader pane is typically resized to 30% of the width (`rebalancePanesWithLeader`).
   - Teammate panes share the remaining 70% using a `tiled` or `main-vertical` layout.

### In-Process vs. External Modes

Agents can run in three modes (`--teammate-mode`):

- **tmux**: Agents run in separate tmux panes (recommended).
- **in-process**: Agents run as asynchronous tasks within the same Node.js process (used for non-interactive sessions or when tmux is unavailable).
- **auto**: The system decides based on environment availability.

## Implementation Details

### [Algorithm] Tmux Pane Creation

**What it does**: Splits the terminal to create a new space for a teammate agent.

**How it works**:
1. Checks if already running inside tmux.
2. If so, splits the current window horizontally with a 70% size for the new pane.
3. For subsequent teammates, it selects an existing teammate pane and splits it (alternating between vertical and horizontal to maintain a grid).
4. Sets the pane title (`set-option pane-border-format`) and border color based on the agent's assigned color.

**Why this approach**:
- Alternating splits ensures a balanced grid layout regardless of the number of agents.
- Reserving 30% for the leader ensures the main control flow is always visible.

**Key insight**: The use of `select-layout main-vertical` followed by a manual resize of the first pane is a reliable way to enforce the 30/70 split in tmux.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `TmuxBackend` (`fEA`) - Manages tmux panes.
- `ITermBackend` (`EEA`) - Manages iTerm2 splits.
- `getBackend` (`zt`) - Detects terminal environment.
- `createTeammatePaneInSwarmView` - Spawns a new UI pane.
- `rebalancePanesWithLeader` - Enforces the 30/70 UI split.

## Location References

- `chunks.131.mjs:1144` - `TmuxBackend` class definition.
- `chunks.131.mjs:1381` - `ITermBackend` class definition.
- `chunks.131.mjs:1493` - `getBackend` logic.
- `chunks.129.mjs` - Swarm constants.
