# Hooks System (Module 11)

## Overview

The Hooks System is Claude Code's event-driven extension framework. It intercepts **21 distinct lifecycle moments**, dispatches user-configured handlers (shell commands, HTTP endpoints, LLM prompts, sub-agents, in-process callbacks, or function hooks), and feeds the results back into the main agent loop to control behavior: blocking tool calls, modifying inputs, injecting context, or forcing the model to continue working.

This module provides comprehensive documentation of the hook architecture, event catalog, async execution patterns, and integration with other components.

## Key Characteristics

- **21 hook events**: PreToolUse, PostToolUse, PostToolUseFailure, Notification, UserPromptSubmit, SessionStart, SessionEnd, Stop, SubagentStart, SubagentStop, PreCompact, PostCompact, PermissionRequest, Setup, TeammateIdle, TaskCompleted, Elicitation, ElicitationResult, InstructionsLoaded, ConfigChange, WorktreeCreate, WorktreeRemove
- **6 hook types**: `command`, `http`, `prompt`, `agent`, `callback`, `function`
- **Blocking semantics**: Hooks can block operations via exit code 2 or `ok: false`
- **Async support**: Long-running hooks can execute in background
- **Timeout protection**: Default 600,000ms (10 minutes) for sync hooks
- **Hook source display**: Hook source (settings/plugin/skill) shown in UI when verbose mode

---

## File Index

| File | Content | Size |
|------|---------|------|
| [implementation.md](./implementation.md) | Core hook execution engine, symbol mappings, resolution flow | 57KB |
| [hook_events_catalog.md](./hook_events_catalog.md) | Detailed catalog of all hook events with payload schemas | 23KB |
| [async_hooks_deep_dive.md](./async_hooks_deep_dive.md) | Background hook execution, registry management, streaming | 9KB |
| [http_hooks.md](./http_hooks.md) | HTTP hook type (v2.1.63+): POST JSON to URL, response format, auth | **NEW** |
| [tools_integration.md](./tools_integration.md) | Hook integration with tool execution pipeline | **NEW** |
| [slash_command_integration.md](./slash_command_integration.md) | Hook triggers from slash commands | **NEW** |
| [configuration_guide.md](./configuration_guide.md) | Practical configuration examples and best practices | **NEW** |

---

## Quick Links

### Core Documentation

- [implementation.md](./implementation.md) - Start here for understanding the hook engine
- [hook_events_catalog.md](./hook_events_catalog.md) - Reference for all event types

### Integration Analysis

- [tools_integration.md](./tools_integration.md) - How hooks intercept and modify tool execution
- [slash_command_integration.md](./slash_command_integration.md) - `/clear`, `/compact` and other slash command triggers

### Configuration

- [configuration_guide.md](./configuration_guide.md) - How to configure hooks in settings.json
- [http_hooks.md](./http_hooks.md) - HTTP hook type configuration and protocol
- [async_hooks_deep_dive.md](./async_hooks_deep_dive.md) - Background hook execution patterns

---

## Cross-Module Integration

Hooks integrate with multiple Claude Code components:

| Module | Integration Document | Description |
|--------|---------------------|-------------|
| **Tools** | [tools_integration.md](./tools_integration.md) | PreToolUse, PostToolUse, PostToolUseFailure hooks |
| **Compact** | [../07_compact/hooks_system.md](../07_compact/hooks_system.md) | PreCompact, PostCompact and SessionStart hooks for compaction |
| **System Reminder** | [../04_system_reminder/types_hooks.md](../04_system_reminder/types_hooks.md) | Hook response types delivered to LLM |
| **Subagent** | [../08_subagent/hooks_integration.md](../08_subagent/hooks_integration.md) | SubagentStart, SubagentStop hooks |
| **Plan Mode** | [../12_plan_mode/hooks_integration.md](../12_plan_mode/hooks_integration.md) | Plan mode hook integration |
| **Agent Teams** | [../30_agent_teams/hooks_integration.md](../30_agent_teams/hooks_integration.md) | TeammateIdle, TaskCompleted hooks |
| **Plugin System** | [../25_plugin_system/plugin_hooks.md](../25_plugin_system/plugin_hooks.md) | Plugin-provided hooks via callbacks |

---

## Key Symbols Quick Reference

> Full symbol mappings: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks section

### Hook Dispatchers

| Function | Event | Purpose |
|----------|-------|---------|
| `executePreToolHooks` (qyA) | PreToolUse | Before tool execution |
| `executePostToolHooks` (KyA) | PostToolUse | After successful tool execution |
| `executePostToolFailureHooks` (YyA) | PostToolUseFailure | After failed tool execution |
| `executeNotificationHooks` (UTA) | Notification | System notifications |
| `executeUserPromptSubmitHooks` (HyA) | UserPromptSubmit | Before prompt sent to LLM |
| `executeSessionStartHooks` ($yA) | SessionStart | Session initialization |
| `executeSessionEndHooks` (_yA) | SessionEnd | Session cleanup |
| `executeStopHooks` (zyA) | Stop/SubagentStop | Agent stop points |
| `executeSubagentStartHooks` (AEA) | SubagentStart | Subagent begins |
| `executePreCompactHooks` (mW6) | PreCompact | Before compaction |
| `executePermissionRequestHooks` | PermissionRequest | Permission decisions |
| `executeSetupHooks` (OyA) | Setup | Initial setup |
| `executeTeammateIdleHooks` (wyA) | TeammateIdle | Teammate becomes idle |
| `executeTaskCompletedHooks` (Cg1) | TaskCompleted | Task marked complete |

### Core Execution

| Function | Purpose |
|----------|---------|
| `executeHooksIterator` (NI) | Central generator for hook execution |
| `executeHooksOutsideREPL` (AyA) | Parallel execution for non-streaming contexts |
| `resolveHooksForEvent` (oRA) | Filters and deduplicates hooks from all sources |
| `executeCommandHook` (BW6) | Shell command hook execution |
| `executeHttpHook` | HTTP POST hook execution (v2.1.63+) |
| `executeAgentHook` (Xi4) | Agent-type hook execution |
| `executePromptHook` (Pn7) | LLM prompt hook execution |

### Constants

| Constant | Value | Location |
|----------|-------|----------|
| `HOOK_EVENT_NAMES` (ax) | Array of all event names | chunks.14.mjs:3572 |
| `DEFAULT_HOOK_TIMEOUT` (MP) | 600000ms (10 min) | chunks.142.mjs:215 |

---

## Hook Event Summary

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         HOOK EVENT LIFECYCLE                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Session Lifecycle:                                                          │
│  ┌─────────┐    ┌──────────┐    ┌───────────┐    ┌────────────┐             │
│  │ Setup   │───▶│SessionStart│───▶│ UserPrompt│───▶│ SessionEnd │             │
│  │ (init)  │    │(startup)  │    │ Submit    │    │ (cleanup)  │             │
│  └─────────┘    └──────────┘    └───────────┘    └────────────┘             │
│                                                                              │
│  Tool Execution:                                                             │
│  ┌───────────┐    ┌───────────────┐    ┌───────────────┐                    │
│  │PreToolUse │───▶│ Tool Call     │───▶│PostToolUse    │                    │
│  │(block/    │    │ (execute)     │    │(modify output)│                    │
│  │ modify)   │    └───────────────┘    └───────────────┘                    │
│  └───────────┘              │                                                │
│                      ┌──────▼──────┐                                         │
│                      │PostToolUse  │                                         │
│                      │ Failure     │                                         │
│                      │(error ctx)  │                                         │
│                      └─────────────┘                                         │
│                                                                              │
│  Agent Control:                                                              │
│  ┌───────────────┐    ┌────────────┐    ┌─────────────────┐                 │
│  │ SubagentStart │───▶│ Subagent   │───▶│ SubagentStop    │                 │
│  │ (configure)   │    │ Execution  │    │ (validate)      │                 │
│  └───────────────┘    └────────────┘    └─────────────────┘                 │
│                                                                              │
│  Compaction:                                                                 │
│  ┌───────────────┐    ┌───────────────┐    ┌────────────────┐              │
│  │ PreCompact    │───▶│ Compaction    │───▶│ PostCompact    │              │
│  │ (add context) │    │ (summarize)   │    │ (post-compact) │              │
│  └───────────────┘    └───────────────┘    └────────────────┘              │
│                                                                              │
│  Team/Task:                                                                  │
│  ┌───────────────┐    ┌───────────────┐                                     │
│  │ TeammateIdle  │    │ TaskCompleted │                                     │
│  │ (assign work) │    │ (verify)      │                                     │
│  └───────────────┘    └───────────────┘                                     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Hook Type Comparison

| Type | Execution | Can Block? | Use Case |
|------|-----------|------------|----------|
| `command` | Shell command via stdin/stdout | Yes (exit 2) | External scripts, linters, CI/CD |
| `http` | HTTP POST to URL, JSON response | Yes (via response) | Remote services, webhooks (v2.1.63+) |
| `prompt` | LLM prompt evaluation | No (yes/no) | Conditional logic, decisions |
| `agent` | Full subagent loop | Yes (`ok: false`) | Complex verification tasks |
| `callback` | In-process JS function | Via JSON return | Plugin integration |
| `function` | REPL context function | Yes (false return) | Stop hooks only |

---

## Exit Code Semantics (command type)

| Exit Code | Meaning | Effect |
|-----------|---------|--------|
| 0 | Success | Hook output passed through |
| 2 | Blocking error | Operation blocked; stderr shown |
| Other | Non-blocking error | Error logged, execution continues |

---

## Getting Started

1. **Understand the architecture**: Read [implementation.md](./implementation.md)
2. **Browse available events**: See [hook_events_catalog.md](./hook_events_catalog.md)
3. **Configure your first hook**: Follow [configuration_guide.md](./configuration_guide.md)
4. **Use HTTP hooks**: See [http_hooks.md](./http_hooks.md) for remote service integration
5. **Integrate with tools**: Learn [tools_integration.md](./tools_integration.md)

---

## Related Documentation

- [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks symbol mappings
- [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols
- [../04_system_reminder/types_hooks.md](../04_system_reminder/types_hooks.md) - Hook reminder types
- [../07_compact/hooks_system.md](../07_compact/hooks_system.md) - Compaction hooks
