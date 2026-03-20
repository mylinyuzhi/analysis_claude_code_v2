# 30 - Agent Teams (Multi-Agent Collaboration)

## Overview

Agent Teams enables multiple Claude Code agents to collaborate on complex tasks. Agents can be organized into teams, communicate via inter-agent messaging, and coordinate work through shared task ownership.

**Introduced**: v2.1.32, with enhancements in v2.1.33, v2.1.34, v2.1.76

**Feature flag**: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

## Quick Navigation

**For understanding the complete system:**
1. Start with [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - Traces full lifecycle from trigger to cleanup
2. Deep dive into [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md) - Understand all 3 execution modes
3. Explore [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - File-based coordination details
4. Review [04_polling_priorities.md](./04_polling_priorities.md) - Priority queue system

**For specific topics:**
- **UI/UX**: See [05_tui_integration.md](./05_tui_integration.md)
- **Prompt engineering**: See [06_system_prompts_and_reminders.md](./06_system_prompts_and_reminders.md)
- **Error handling**: See [error_recovery.md](./error_recovery.md)
- **Resource management**: See [resource_limits.md](./resource_limits.md)
- **Hook integration**: See [hooks_integration.md](./hooks_integration.md)

## Key Components

### Tools
- **TeamCreate** - Spawn a team of agents with defined roles and capabilities
- **SendMessage** - Inter-agent messaging for coordination and task delegation

### Hooks
- **TeammateIdle** - Fires when a teammate agent becomes idle (available for new work)
- **TaskCompleted** - Fires when an agent completes its assigned task
- **Hook Integration** - See [hooks_integration.md](./hooks_integration.md) for verification agent pattern, 5-level priority poll loop integration, and error handling

### UI
- **Swarm View** - Terminal UI showing all active agents, their status, and message flow
- **Agent Tab Component** (v2.1.76) - New `qGz` component in `chunks.192.mjs` adds dedicated agent tab with selected/viewed/idle state visualization; supports Ctrl+F to filter/kill agents; includes CJK layout fix
- **Terminal pane management** - Each agent gets its own terminal context

### Configuration
- Team config stored at `~/.claude/teams/`
- Agent spawning restrictions (max agents, resource limits)
- Role definitions and capability constraints
- `background: true` flag support in team definitions (v2.1.76)

### Error Recovery
- **Graceful Shutdown** - Request/approval protocol for coordinated agent termination
- **Communication Errors** - Message delivery failures, orphaned messages, mailbox corruption
- **Backend Errors** - tmux/iTerm failures, in-process crashes, state recovery
- See [error_recovery.md](./error_recovery.md) for full recovery strategies matrix

## Analysis Documents

### Phase 3 (New - Comprehensive Reverse Engineering Suite)
- [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - **End-to-end flow analysis**: Trigger → Initialization → Spawning → Messaging → Task Coordination → Shutdown (~30KB)
- [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md) - **All 3 spawn modes**: In-process, split-pane, separate window with algorithmic detail (~25KB)
- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - **File-based communication**: Race conditions, file locking, message consumption (~15KB)
- [04_polling_priorities.md](./04_polling_priorities.md) - **5-level priority system**: Priority queue analysis, shutdown bypass, task auto-claim (~12KB)
- [05_tui_integration.md](./05_tui_integration.md) - **UI patterns**: In-process vs pane-based UI, agent tab (qGz), tmux layouts, visual styling (~10KB)
- [06_system_prompts_and_reminders.md](./06_system_prompts_and_reminders.md) - **Teammate context injection**: Identity, team context, plan mode reminders (~10KB)

### Phase 1 & 2 (Complete Documentation Suite)
- [hooks_integration.md](./hooks_integration.md) - Hook execution engine, verification agents, TeammateIdle/TaskCompleted flows (~17KB)
- [error_recovery.md](./error_recovery.md) - Graceful shutdown protocol, communication errors, backend failures (~16KB)
- [team_config_schema.md](./team_config_schema.md) - Config file structure, lifecycle management, validation rules (~11KB)
- [resource_limits.md](./resource_limits.md) - Agent count, timeouts, turn limits, memory quotas, monitoring (~12KB)

### Existing Analysis (Foundation Documents)
- [agent_teams_architecture.md](./agent_teams_architecture.md) - Overall team architecture **[Enhanced with Error Recovery + Resource Management + v2.1.76 improvements]**
- [inter_agent_communication.md](./inter_agent_communication.md) - Message delivery and mailbox system
- [pane_backend_executor.md](./pane_backend_executor.md) - In-process vs pane-based backends, poll loop priority system
- [delegate_mode.md](./delegate_mode.md) - Delegation patterns and trade-offs
- [swarm_architecture.md](./swarm_architecture.md) - Swarm view and UI architecture
- [swarms_implementation.md](./swarms_implementation.md) - Implementation details

## Key Source Files

- `chunks.145.mjs` - Team tools (TeamCreate, SendMessage), shutdown handling (`handleShutdownApproval` / YxY, `handleShutdownRejection` / zxY, `createShutdownApprovalResponse` / Gx8, `createShutdownRejectionResponse` / fx8)
- `chunks.135.mjs` - Spawn functions (`spawnTeammateDispatcher` / pNY @ line 1110, `spawnInProcessTeammate` / FNY @ line 985, `spawnSplitPaneTeammate` / BNY @ line 711, `spawnTmuxTeammate` / gNY @ line 838, `spawnTeammate` / qn4 @ line 1116), `ITermBackend` (Xu8 @ line 11), `isInProcessEnabled` (Rb @ line 208)
- `chunks.134.mjs` - In-process agent runner (`inProcessAgentRunner` / XNY @ line 1571, `pollForNextMessage` / DNY @ line 1483, `claimUnclaimedTask` / Ji4 @ line 1464, `registerTeammateAndRun` / xN1 @ line 1847, `findNextAvailableTask` / JNY @ line 1445, `sleep` / jNY @ line 1441), `TmuxBackend` (Ju8 @ line 2411), `InProcessBackend` (Mi4 @ line 1888)
- `chunks.132.mjs` - Mailbox I/O (`writeToMailbox` / x3 @ line 22, `readMailbox` / wl @ line 3, `markMessageAsReadByIndex` / Vc6 @ line 57, `markMessagesAsRead` / kc6 @ line 92, `readUnreadMessages` / pY6 @ line 16, `clearMailbox` / $TY @ line 128, `formatMailboxMessages` / HTY @ line 141), file locking (`properLockfile` / Nc6 @ line 437, `lockOptions` / iv1 @ line 463)
- `chunks.131.mjs` - Team configuration (`readTeamConfig` / M51 @ line 2046, `getInboxPath` / FY6 @ line 2849, `ensureInboxDirectoryExists` / OTY @ line 2858, `parseShutdownRequest` / ss @ line 1396), spawn helpers, `TEAM_LEAD_ID` (BY @ line 1981), `getBackend` (zt @ line 1493)
- `chunks.113.mjs` - Team tool schema, `killInProcessTeammate` / bZ1 @ line 1272
- `chunks.84.mjs` - Teammate context storage (`teammateContextStorage` / ef8 @ line 1425, `createTeammateContext` / dD1 @ line 1415, `getTeammateContext` / iM @ line 1403, `runWithTeammateContext` / UD1 @ line 1407), task claiming (`claimTask` / OT8 @ line 1781, `claimTaskWithAgentBusyValidation` / $N9 @ line 1831, `unassignTeammateTasks` / ft @ line 1883)
- `chunks.174.mjs` - System reminder team_context normalization (`normalizeAttachmentForAPI` / Ui8 @ lines 3-469), `isAgentTeamsEnabled` (E7 @ line 2543 via chunks.50.mjs)
- `chunks.147.mjs` - Attachment assembly (`assembleAllAttachments` / _uY @ line 3, `getTeamContextAttachment` / AmY, `getTeammateMailboxAttachment` / euY)
- `chunks.192.mjs` - Agent tab UI component (`qGz`) - NEW in v2.1.76
- `chunks.117.mjs` - Process utilities (`gracefulExit` / Vq @ line 899)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key symbols used in this module:

**Spawn Functions (chunks.135.mjs):**
- `spawnTeammateDispatcher` (pNY) - Mode selection entry point
- `isInProcessEnabled` (Rb) - In-process mode detection
- `spawnInProcessTeammate` (FNY) - In-process spawning
- `spawnSplitPaneTeammate` (BNY) - Split-pane spawning
- `spawnTmuxTeammate` (gNY) - Separate window spawning

**Mailbox Functions (chunks.132.mjs):**
- `writeToMailbox` (x3) - Atomic message append with locking
- `readMailbox` (wl) - Read all messages from mailbox
- `markMessageAsReadByIndex` (Vc6) - Update read flag

**In-Process Agent (chunks.134.mjs):**
- `inProcessAgentRunner` (XNY) - Main agent loop
- `pollForNextMessage` (DNY) - 5-level priority polling
- `claimUnclaimedTask` (Ji4) - Auto-claim tasks
- `registerTeammateAndRun` (xN1) - Register teammate and start runner
- `TmuxBackend` (Ju8) - Tmux pane management @ chunks.134.mjs:2411
- `InProcessBackend` (Mi4) - In-process teammate backend @ chunks.134.mjs:1888

**Backend Implementations:**
- `TmuxBackend` (Ju8) - Tmux terminal backend @ chunks.134.mjs:2411
- `ITermBackend` (Xu8) - iTerm2 terminal backend @ chunks.135.mjs:11
- `InProcessBackend` (Mi4) - In-process teammate backend @ chunks.134.mjs:1888

**Teammate Context (chunks.84.mjs):**
- `teammateContextStorage` (ef8) - AsyncLocalStorage for teammate identity
- `createTeammateContext` (dD1) - Create context object with isInProcess flag
- `getTeammateContext` (iM) - Get current teammate context
- `runWithTeammateContext` (UD1) - Run callback with context

**Kill/Shutdown (chunks.113.mjs):**
- `killInProcessTeammate` (bZ1) - Abort controller and cleanup in-process teammate

**System Reminder Integration (chunks.174.mjs):**
- `normalizeAttachmentForAPI` (Ui8) - Handles team_context type at lines 9-37

## CLI Flags for Teammates

When spawning a teammate agent (pane-based backend), the following CLI flags are used:

### Required Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--agent-id` | Unique identifier for the agent | `--agent-id "550e8400-e29b-41d4-a716-446655440000"` |
| `--agent-name` | Human-readable name for the agent | `--agent-name "backend-dev"` |
| `--team-name` | Name of the team the agent belongs to | `--team-name "web-app-team"` |

**Note**: These three flags must be provided together or not at all.

### Optional Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--agent-color` | Hex color for UI display | `--agent-color "#3b82f6"` |
| `--parent-session-id` | ID of the parent session (team lead) | `--parent-session-id "session-123"` |
| `--plan-mode-required` | Force teammate to plan before executing | `--plan-mode-required` |
| `--agent-type` | Type of agent | `--agent-type "teammate"` |
| `--teammate-mode` | Mode for teammate execution | `--teammate-mode "in-process"` |

### Example Spawn Command

```bash
claude \
  --agent-id "550e8400-e29b-41d4-a716-446655440000" \
  --agent-name "backend-dev" \
  --team-name "web-app-team" \
  --agent-color "#3b82f6" \
  --parent-session-id "session-abc123" \
  --plan-mode-required
```

### In-Process Flag

For in-process teammates, an additional flag is added:

```bash
--teammate-mode "in-process"
```

This signals that the agent runs in the same Node.js process as the team lead.

## Idle Notification Protocol

When a teammate completes work and has no pending messages or tasks, it sends an **idle notification** to the team-lead.

### Idle Reasons

| Reason | Meaning | When Triggered |
|--------|---------|----------------|
| `"available"` | Normal idle, ready for work | Task completed successfully, no more work |
| `"interrupted"` | User interrupted execution | User pressed Escape or sent interrupt signal |
| `"failed"` | Error occurred during execution | Exception thrown, tool error, etc. |

### Notification Structure

```json
{
  "type": "idle_notification",
  "from": "backend-dev",
  "timestamp": "2024-02-14T08:30:00.000Z",
  "idleReason": "available",
  "summary": "Completed POST /users endpoint",
  "completedTaskId": "task-123",
  "completedStatus": "completed"
}
```

### Key Functions

- `buildIdleNotification` (Ec6) - Construct notification payload
- `parseIdleNotification` (yc6) - Parse incoming notification
- TeammateIdle hook - Fires when agent transitions to idle

**See also:**
- [pane_backend_executor.md](./pane_backend_executor.md#idle-notification-system) - Full implementation details
- [hooks_integration.md](./hooks_integration.md#4-teammateidle-hook-flow) - TeammateIdle hook flow

## Changelog References

- **v2.1.32**: Initial agent teams support
- **v2.1.33**: TeammateIdle/TaskCompleted hooks, messaging improvements
- **v2.1.34**: Swarm view UI, terminal pane management
- **v2.1.76**: Agent tab component (`qGz`), Ctrl+F filter/kill, CJK layout fix, `background: true` flag, improved mailbox delivery, task dependency graph improvements
