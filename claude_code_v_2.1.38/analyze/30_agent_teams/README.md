# 30 - Agent Teams (Multi-Agent Collaboration)

## Overview

Agent Teams enables multiple Claude Code agents to collaborate on complex tasks. Agents can be organized into teams, communicate via inter-agent messaging, and coordinate work through shared task ownership.

**Introduced**: v2.1.32, with enhancements in v2.1.33, v2.1.34

**Feature flag**: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

## Key Components

### Tools
- **TeamCreate** - Spawn a team of agents with defined roles and capabilities
- **SendMessage** - Inter-agent messaging for coordination and task delegation

### Hooks
- **TeammateIdle** - Fires when a teammate agent becomes idle (available for new work)
- **TaskCompleted** - Fires when an agent completes its assigned task

### UI
- **Swarm View** - Terminal UI showing all active agents, their status, and message flow
- **Terminal pane management** - Each agent gets its own terminal context

### Configuration
- Team config stored at `~/.claude/teams/`
- Agent spawning restrictions (max agents, resource limits)
- Role definitions and capability constraints

## Key Source Files

> To be populated during analysis. Estimated ~40+ source files across chunks.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

## Changelog References

- **v2.1.32**: Initial agent teams support
- **v2.1.33**: TeammateIdle/TaskCompleted hooks, messaging improvements
- **v2.1.34**: Swarm view UI, terminal pane management
