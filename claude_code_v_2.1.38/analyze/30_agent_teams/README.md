# 30 - Agent Teams (Multi-Agent Collaboration)

## Overview

Agent Teams enables multiple Claude Code agents to collaborate on complex tasks. Agents can be organized into teams, communicate via inter-agent messaging, and coordinate work through shared task ownership.

**Introduced**: v2.1.32, with enhancements in v2.1.33, v2.1.34

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
- **Terminal pane management** - Each agent gets its own terminal context

### Configuration
- Team config stored at `~/.claude/teams/`
- Agent spawning restrictions (max agents, resource limits)
- Role definitions and capability constraints

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
- [05_tui_integration.md](./05_tui_integration.md) - **UI patterns**: In-process vs pane-based UI, tmux layouts, visual styling (~10KB)
- [06_system_prompts_and_reminders.md](./06_system_prompts_and_reminders.md) - **Teammate context injection**: Identity, team context, plan mode reminders (~10KB)

### Phase 1 & 2 (Complete Documentation Suite)
- [hooks_integration.md](./hooks_integration.md) - Hook execution engine, verification agents, TeammateIdle/TaskCompleted flows (~17KB)
- [error_recovery.md](./error_recovery.md) - Graceful shutdown protocol, communication errors, backend failures (~16KB)
- [team_config_schema.md](./team_config_schema.md) - Config file structure, lifecycle management, validation rules (~11KB)
- [resource_limits.md](./resource_limits.md) - Agent count, timeouts, turn limits, memory quotas, monitoring (~12KB)

### Existing Analysis (Foundation Documents)
- [agent_teams_architecture.md](./agent_teams_architecture.md) - Overall team architecture **[Enhanced with Error Recovery + Resource Management]**
- [inter_agent_communication.md](./inter_agent_communication.md) - Message delivery and mailbox system
- [pane_backend_executor.md](./pane_backend_executor.md) - In-process vs pane-based backends, poll loop priority system
- [delegate_mode.md](./delegate_mode.md) - Delegation patterns and trade-offs
- [swarm_architecture.md](./swarm_architecture.md) - Swarm view and UI architecture
- [swarms_implementation.md](./swarms_implementation.md) - Implementation details

## Key Source Files

- `chunks.141.mjs` - Team tools (TeamCreate, SendMessage), hook execution, shutdown handling
- `chunks.131.mjs` - Backend implementations (TmuxBackend, ITermBackend, InProcessBackend), poll loop
- `chunks.129.mjs` - Additional backend utilities and coordination logic

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

## Changelog References

- **v2.1.32**: Initial agent teams support
- **v2.1.33**: TeammateIdle/TaskCompleted hooks, messaging improvements
- **v2.1.34**: Swarm view UI, terminal pane management
