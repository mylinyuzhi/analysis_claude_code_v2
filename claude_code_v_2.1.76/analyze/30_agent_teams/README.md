# 30 - Agent Teams (Multi-Agent Collaboration)

## Overview

Agent Teams enables multiple Claude Code agents to collaborate on complex tasks through a swarm architecture. Agents are organized into teams with a lead agent that coordinates work via a file-based mailbox system, shared task lists, and a permission synchronization protocol. The system supports three execution backends: in-process (same Node.js process), split-pane (tmux pane), and separate-window (tmux window).

**Introduced**: v2.1.32, with enhancements in v2.1.33, v2.1.34, v2.1.76

**Feature gate**: Requires BOTH `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` env var AND `tengu_amber_flint` feature flag (server-side).

## Architecture Overview

```
                         +-----------------------+
                         |     User (CLI/IDE)    |
                         +-----------+-----------+
                                     |
                              TeamCreate tool
                                     |
                         +-----------v-----------+
                         |      Team Lead        |
                         |  (primary Claude)     |
                         +---+------+-------+----+
                             |      |       |
                  +----------+  +---+---+   +-----------+
                  |             |       |                |
          +-------v------+ +---v---+ +-v--------+ +-----v------+
          | Teammate A   | | T. B  | | T. C     | | T. D       |
          | (in-process) | |(pane) | |(window)  | | (in-proc)  |
          +-+----+-------+ +--+----+ +----+-----+ +-----+------+
            |    |            |           |              |
            +----+------------+-----------+--------------+
                 |      File-based Mailbox System       |
                 |  (~/.claude/{team}/inboxes/*.json)    |
                 +--------------------------------------+
                 |         Shared Task List              |
                 |  (~/.claude/{team}/tasks.json)        |
                 +--------------------------------------+
```

### Spawn Routing Decision Tree

```
qn4 (spawnTeammate)
  |
  v
pNY (spawnTeammateDispatcher)
  |
  +-- Rb() true?  ---------> FNY (spawnInProcessTeammate)
  |                            - Same Node.js process
  |                            - Uses AbortController
  |                            - Polled via DNY loop
  |
  +-- use_splitpane != false? -> BNY (spawnSplitPaneTeammate)
  |                              - Tmux split pane
  |                              - CLI subprocess
  |                              - File-based mailbox
  |
  +-- else -----------------> gNY (spawnTmuxTeammate)
                               - Tmux separate window
                               - CLI subprocess
                               - File-based mailbox
```

### Message Polling Priority (In-Process)

```
DNY poll loop (500ms interval):
  |
  [1] pendingUserMessages  (highest priority - dequeued from AppState)
  |
  [2] shutdown_request     (scanned via M66 parser - prioritized over all mailbox)
  |
  [3] team-lead messages   (unread from "team-lead" sender)
  |
  [4] peer messages        (any other unread mailbox message)
  |
  [5] task-list            (auto-claim unclaimed tasks via Ji4)
```

## Key Components

### Tools
- **TeamCreate** - Spawn a team of agents with defined roles and capabilities
- **SendMessage** (`OxY`) - Inter-agent messaging: plain text, shutdown requests/responses, plan approval
- **Agent** - Can resume in-process teammates via task ID

### Communication
- **Mailbox System** (chunks.132.mjs) - File-based inbox per agent with proper-lockfile locking
- **Permission Sync** (chunks.134.mjs) - Workers request permission from leader via mailbox round-trip
- **Idle Notification** - Teammates notify lead when available, interrupted, or failed

### Backends
- **In-Process** (`FNY`) - Same Node.js process, uses AbortController for lifecycle
- **Split-Pane** (`BNY`) - Tmux split pane via `di4()`, CLI subprocess
- **Separate Window** (`gNY`) - Tmux window via `z8(yZ, ["new-window", ...])`, CLI subprocess

### Configuration
- Team config at `~/.claude/{sanitizedTeamName}/config.json`
- Member registry with agentId, name, color, model, backendType
- Name deduplication via `hu8()` (appends -2, -3, etc.)

### UI
- **Team Status Renderer** (`gZ1`, chunks.113.mjs:1616) - Tree layout with lead + teammates
- **Agent Tab** (`qGz`, chunks.192.mjs) - NEW in v2.1.76, Ctrl+F filter/kill
- **Message Preview** - Toggle via Ctrl+Shift+O

## Analysis Documents

### Complete Analysis
- [agent_teams_complete_analysis.md](./agent_teams_complete_analysis.md) - **Full source-level reverse engineering** of all subsystems with dual-version code snippets

### Phase 3 (Comprehensive Reverse Engineering Suite)
- [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - End-to-end flow: Trigger -> Init -> Spawn -> Message -> Task -> Shutdown
- [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md) - All 3 spawn modes with algorithmic detail
- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - File-based communication, race conditions, locking
- [04_polling_priorities.md](./04_polling_priorities.md) - 5-level priority system, shutdown bypass, task auto-claim
- [05_tui_integration.md](./05_tui_integration.md) - UI patterns, agent tab, tmux layouts
- [06_system_prompts_and_reminders.md](./06_system_prompts_and_reminders.md) - Teammate context injection

### Phase 1 & 2
- [hooks_integration.md](./hooks_integration.md) - Hook execution, TeammateIdle/TaskCompleted flows
- [error_recovery.md](./error_recovery.md) - Graceful shutdown protocol, error recovery
- [team_config_schema.md](./team_config_schema.md) - Config file structure, validation
- [resource_limits.md](./resource_limits.md) - Agent count, timeouts, memory quotas

### Foundation Documents
- [agent_teams_architecture.md](./agent_teams_architecture.md) - Overall architecture
- [inter_agent_communication.md](./inter_agent_communication.md) - Message delivery and mailbox
- [pane_backend_executor.md](./pane_backend_executor.md) - Backend implementations, poll loop
- [swarm_architecture.md](./swarm_architecture.md) - Swarm view and UI

## Key Source Files

| File | Content |
|------|---------|
| chunks.50.mjs | Feature gate `E7()` at line 2543 |
| chunks.135.mjs | Spawn functions: `pNY`, `BNY`, `gNY`, `FNY`, team config I/O |
| chunks.134.mjs | In-process runner: `XNY`, `DNY`, permission sync, `TmuxBackend` |
| chunks.132.mjs | Mailbox I/O: `wl`, `x3`, `Vc6`, `kc6`, message types |
| chunks.145.mjs | SendMessage tool `OxY`, shutdown/plan approval handlers |
| chunks.131.mjs | Team config read, inbox paths, backend detection |
| chunks.113.mjs | Team status UI `gZ1`, `killInProcessTeammate` |
| chunks.84.mjs | Teammate context AsyncLocalStorage, task claiming |
| chunks.174.mjs | System reminder normalization for team_context |
| chunks.198.mjs | CLI argument definitions (--agent-id, --team-name, etc.) |

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key symbols in this module:

**Feature Gate:**
- `isAgentTeamsEnabled` (E7) - Dual check: env var + feature flag

**Spawn Functions (chunks.135.mjs):**
- `spawnTeammateDispatcher` (pNY) - Mode selection entry point
- `spawnSplitPaneTeammate` (BNY) - Split-pane spawning
- `spawnTmuxTeammate` (gNY) - Separate window spawning
- `spawnInProcessTeammate` (FNY) - In-process spawning

**Mailbox (chunks.132.mjs):**
- `writeToMailbox` (x3) - Atomic message append with locking
- `readMailbox` (wl) - Read all messages
- `markMessagesAsRead` (kc6) - Bulk mark read with verification

**In-Process Agent (chunks.134.mjs):**
- `inProcessAgentRunner` (XNY) - Main agent loop builder
- `pollForNextMessage` (DNY) - 5-level priority polling
- `claimUnclaimedTask` (Ji4) - Auto-claim available tasks

**SendMessage Tool (chunks.145.mjs):**
- `SendMessageTool` (OxY) - Tool object with call dispatch

## Quick Reference

| Question | Answer |
|----------|--------|
| How is teams enabled? | `E7()`: env var `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` + `tengu_amber_flint` flag |
| How are teammates spawned? | `pNY` routes to in-process / split-pane / separate-window |
| How do agents communicate? | File-based mailbox at `{claudeDir}/{team}/inboxes/{name}.json` |
| How is locking handled? | `proper-lockfile` npm module with retries: 10, minTimeout: 5ms |
| What polling interval? | 500ms between iterations in `DNY` |
| How are tasks auto-claimed? | `Ji4` checks unclaimed tasks with resolved dependencies |
| How does shutdown work? | Teammate sends shutdown_request, lead approves/rejects via SendMessage |
