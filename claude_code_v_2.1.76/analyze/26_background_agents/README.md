# Background Agents — Module Overview (Claude Code 2.1.76)

> Reverse-engineered analysis of the background agent system: asynchronous task execution,
> output capture, kill handlers, and integration with tools, hooks, and system reminders.
>
> **Cross-validated**: All symbols verified against source code on 2026-03-27.

---

## What Are Background Agents?

Background agents are one of the most architecturally sophisticated systems in Claude Code. They allow any `Task` (subagent) or `Bash` (shell command) tool call to be detached from the main conversation loop, running asynchronously while the lead agent continues other work.

**Key capabilities:**
- **Asynchronous execution** - Run long tasks without blocking the main conversation
- **Output capture** - Persistent file-based output with incremental reads
- **Progress tracking** - Automatic progress updates injected into system reminders
- **Kill handling** - Graceful termination with task-type-specific strategies
- **Tool access control** - Blocklist/allowlist to prevent blocking operations

---

## Quick Reference - Key Symbols

> Full symbol index: [cross_validation_unified.md](../08_subagent/cross_validation_unified.md) - **89+ verified symbols**

### Task Creation

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `oV` | generateTaskId | Generate unique task ID with type prefix | chunks.41.mjs:2410 |
| `Qn4` | createBackgroundAgentTask | Create background agent task | chunks.146.mjs:2133 |
| `Un4` | createForegroundAgentTask | Create foreground agent task | chunks.146.mjs:2165 |

### Task State

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `i9` | atomicUpdateTask | Generic task state updater | chunks.90.mjs:3003 |
| `Zf` | registerTask | Register task in state | chunks.90.mjs:3019 |
| `VR` | removeTask | Remove completed task | chunks.90.mjs:3037 |
| `EV8` | getRunningTasks | Get all running tasks | chunks.90.mjs:3053 |

### Task Lifecycle

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `x66` | triggerAbortSignal | Trigger abort signal for task | chunks.146.mjs:2012 |
| `U4q` | killAllLocalAgents | Kill all running local_agent tasks | chunks.146.mjs:2029 |
| `d4q` | markTaskKilled | Mark task as killed | chunks.146.mjs:2034 |
| `$m8` | markTaskCompleted | Mark task as completed | chunks.146.mjs:2100 |
| `Hm8` | markTaskFailed | Mark task as failed | chunks.146.mjs:2117 |

### Progress Tracking

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `nl4` | updateTaskProgressWithTelemetry | Update progress with telemetry | chunks.146.mjs:2059 |
| `TV1` | updateTaskProgressPreservingSummary | Update progress preserving summary | chunks.146.mjs:2045 |

### Output File System

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `Y91` | OutputBuffer | Buffered output file writer | chunks.41.mjs:2252 |
| `Z97` | readOutputFileDelta | Read incremental output | chunks.41.mjs:2325 |
| `g2` | getOutputFilePath | Get output file path | chunks.41.mjs:2248 |

---

## What's New in v2.1.76

### `background: true` Flag

In v2.1.76, the `background: true` flag is explicitly present in the task record type definition and the AgentTool schema. Previously only `run_in_background` appeared in the tool input schema; v2.1.76 also propagates a `background` field into the task state to allow downstream code to distinguish explicitly-backgrounded tasks from foreground-then-backgrounded tasks.

### Ctrl+F Kill All

v2.1.76 adds a new keyboard shortcut: **Ctrl+F kills all running background agents** at once. This is implemented via `killAllLocalAgents` (`U4q`) which is now bound to the Ctrl+F key event. Previously, users had to stop individual tasks one at a time.

### Partial Results Preserved on Kill

When a background agent is killed (either via Ctrl+F or TaskStop), any partial results that were written to the output file are preserved and surfaced in the `task_status` attachment. v2.1.76 ensures `readOutputFileDelta` is called before updating the task status to "killed", so results from completed tool calls within the agent are not lost.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Main Agent Loop                                  │
│  (processes user messages, runs tools synchronously)                    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
   ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
   │ AgentTool   │       │ BashTool    │       │ Other Tools │
   │ run_in_bg   │       │ timeout/Ctrl│       │             │
   │ = true      │       │ = background│       │             │
   └──────┬──────┘       └──────┬──────┘       └─────────────┘
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                      Task Creation Layer                             │
   │                                                                      │
   │  createBackgroundAgentTask(Qn4) / createForegroundAgentTask(Un4)   │
   │  - Generate unique task ID (oV)                                     │
   │  - Create AbortController for cancellation                          │
   │  - Initialize output file (.claude/tasks/<id>.output)               │
   │  - Register task in appState.tasks (Zf)                             │
   │  - Spawn detached execution context                                 │
   └────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                       Background Execution                           │
   │                                                                      │
   │  Tool Access Control:                                                │
   │  • BLOCKED (CW6): TaskOutput, ExitPlanMode, EnterPlanMode,          │
   │    Agent, AskUserQuestion, TaskStop                                  │
   │  • ALLOWED (eP1): Read, Write, Edit, Bash, Grep, Glob,              │
   │    WebFetch, WebSearch, TodoWrite, Skill, etc.                       │
   │                                                                      │
   │  Output Capture:                                                     │
   │  • OutputBuffer (Y91) - Buffered writes                              │
   │  • readOutputFileDelta (Z97) - Incremental reads                     │
   │                                                                      │
   │  Progress Tracking:                                                  │
   │  • nl4 - Update progress with telemetry                              │
   │  • TV1 - Update progress preserving summary                           │
   └────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                     Completion & Notification                        │
   │                                                                      │
   │  $m8 (completed) / Hm8 (failed) / x66 (killed)                      │
   │  → System reminder attachment via suY                               │
   │  → UI notification displayed                                         │
   └─────────────────────────────────────────────────────────────────────┘
```

---

## Document Index

### COMPLETE SOURCE RESTORATION (START HERE)

| File | Description |
|------|-------------|
| [task_lifecycle_complete_source.md](./task_lifecycle_complete_source.md) | **START HERE** - Complete task lifecycle source |
| [../08_subagent/cross_validation_unified.md](../08_subagent/cross_validation_unified.md) | **LATEST** - All 73+ symbols verified |
| [../08_subagent/key_algorithms_deep_dive.md](../08_subagent/key_algorithms_deep_dive.md) | Complete algorithm analysis |
| [../08_subagent/agent_tool_complete.md](../08_subagent/agent_tool_complete.md) | Complete AgentTool source |

### UI DOCUMENTATION

| File | Description |
|------|-------------|
| [../08_subagent/ui_interaction_complete.md](../08_subagent/ui_interaction_complete.md) | Complete UI interactions with flow diagrams |
| [ui_interaction_complete_source.md](./ui_interaction_complete_source.md) | UI interaction details |

### CROSS-FEATURE INTEGRATION

| File | Description |
|------|-------------|
| [../08_subagent/cross_feature_linkages_complete.md](../08_subagent/cross_feature_linkages_complete.md) | Complete cross-feature integration |
| [../08_subagent/system_reminder_integration_complete.md](../08_subagent/system_reminder_integration_complete.md) | System reminder integration |

---

## Task State Machine

```
                         ┌──────────────┐
                         │   pending    │
                         │  (created)   │
                         └──────┬───────┘
                                │ spawn (Qn4/Un4)
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success]           [error]              [user kill]
       $m8                  Hm8                   x66
            │                   │                    │
            ▼                   ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  completed   │    │   failed     │    │   killed     │
    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
           │                   │                   │
           │         [d4q: mark notified]          │
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                         ┌──────────────┐
                         │   notified   │
                         │   = true     │
                         └──────┬───────┘
                                │ VR (removeTask)
                                ▼
                         ┌──────────────┐
                         │   removed    │
                         │ (from state) │
                         └──────────────┘
```

---

## Tool Access Control

### Blocked Tools (CW6)

| Tool | Reason |
|------|--------|
| `TaskOutput` | Could create polling loops |
| `ExitPlanMode` | Requires user approval flow |
| `EnterPlanMode` | Requires user approval flow |
| `Agent` | Could spawn nested background agents |
| `AskUserQuestion` | Would block indefinitely |
| `TaskStop` | Background agents shouldn't manage other tasks |

### Allowed Tools (eP1)

| Tool | Why Safe |
|------|----------|
| `Read` | Read-only, no side effects |
| `Write` | File creation - common for background tasks |
| `Edit` | File modification - common for background tasks |
| `Grep` | Content search - non-blocking |
| `Glob` | File search - non-blocking |
| `Bash` | Shell commands - core capability |
| `WebFetch` | Network request - async-safe |
| `WebSearch` | Network request - async-safe |
| `TodoWrite` | Task management - useful for tracking |
| `NotebookEdit` | Jupyter editing - file-like operation |
| `Skill` | Skill invocation - controlled execution |

---

## Related Modules

- **[08_subagent/](../08_subagent/)** - Subagent spawning system
- **[04_system_reminder/](../04_system_reminder/)** - System reminder attachments
- **[05_tools/](../05_tools/)** - Tool execution pipeline
- **[07_compact/](../07_compact/)** - Token management

---

## Symbol Mappings

> For complete symbol mappings, see:
> - [cross_validation_unified.md](../08_subagent/cross_validation_unified.md) - **LATEST** - Unified symbol verification (84 symbols)
> - [cross_validation_final.md](./cross_validation_final.md) - This module's verified symbols (36)
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features symbols

---

## Reading Order

For a comprehensive understanding of the background agents system:

1. **Start with:** [background_agents_complete.md](./background_agents_complete.md) - **NEW** Complete background agents docs
2. **Symbols:** [cross_validation_unified.md](../08_subagent/cross_validation_unified.md) - Verify symbols (84+ total)
3. **Algorithms:** [key_algorithms_deep_dive.md](../08_subagent/key_algorithms_deep_dive.md) - 8 key algorithms
4. **Lifecycle:** [task_lifecycle_complete_source.md](./task_lifecycle_complete_source.md) - Task lifecycle
5. **Kill:** [kill_mechanism_complete.md](./kill_mechanism_complete.md) - Kill mechanism
6. **UI:** [../08_subagent/ui_interaction_complete.md](../08_subagent/ui_interaction_complete.md) - Complete UI
7. **Integration:** [../08_subagent/cross_feature_linkages_complete.md](../08_subagent/cross_feature_linkages_complete.md) - 9 integrations
8. **System Reminders:** [../04_system_reminder/system_reminder_background_agent_integration.md](../04_system_reminder/system_reminder_background_agent_integration.md) - Reminder integration

---

**Last Updated**: 2026-03-27 (re-verified)
**Version**: Claude Code 2.1.76
**Status**: Complete - 93 symbols verified, 13 key algorithms with source restoration, complete UI documentation with keyboard shortcuts, system reminder integration

---

## Reading Order (Updated 2026-03-27)

For a comprehensive understanding of the background agents system:

1. **Symbols:** [../08_subagent/cross_validation_unified.md](../08_subagent/cross_validation_unified.md) - **START HERE** - All 93+ verified symbols
2. **Lifecycle:** [task_lifecycle_complete_source.md](./task_lifecycle_complete_source.md) - **KEY** - Complete task lifecycle source
3. **Algorithms:** [../08_subagent/key_algorithms_source_restored_complete.md](../08_subagent/key_algorithms_source_restored_complete.md) - 9 key algorithms
4. **Kill Mechanism:** [kill_mechanism_complete.md](./kill_mechanism_complete.md) - Kill handling with Ctrl+F
5. **UI Interaction:** [../08_subagent/ui_interaction_complete.md](../08_subagent/ui_interaction_complete.md) - Complete UI with keyboard shortcuts
6. **UI Design:** [../08_subagent/ui_design_complete_final.md](../08_subagent/ui_design_complete_final.md) - Component mockups
7. **Integration:** [../08_subagent/cross_feature_integration_complete.md](../08_subagent/cross_feature_integration_complete.md) - 10 integration points
8. **System Reminders:** [system_reminder_integration_complete_source.md](./system_reminder_integration_complete_source.md) - Background agent reminders
9. **Progress Tracking:** [progress_tracking_complete.md](./progress_tracking_complete.md) - Progress tracking system
10. **Task State Machine:** [task_state_machine_complete.md](./task_state_machine_complete.md) - Complete state machine

---

## Keyboard Shortcuts (v2.1.76)

| Shortcut | Action | Implementation |
|----------|--------|----------------|
| `Ctrl+F` | Kill all running background agents | `U4q` (killAllLocalAgents) |
| `x` | Stop selected task | `x66` (triggerAbortSignal) |
| `f` | Foreground teammate | Task list modal |
| `Ctrl+C` (once) | Show kill confirmation | Status line handler |

---

## Key Algorithms Verified

| Algorithm | Symbol | Location |
|-----------|--------|----------|
| Task ID Generation | `oV` | chunks.41.mjs:2410 |
| Background Task Creation | `Qn4` | chunks.146.mjs:2133 |
| Foreground Task Creation | `Un4` | chunks.146.mjs:2165 |
| Abort Signal Trigger | `x66` | chunks.146.mjs:2012 |
| Kill All Agents | `U4q` | chunks.146.mjs:2029 |
| Task Completion | `$m8` | chunks.146.mjs:2100 |
| Task Failure | `Hm8` | chunks.146.mjs:2117 |
| Progress Update | `nl4` | chunks.146.mjs:2059 |
| Output Buffer | `Y91` | chunks.41.mjs:2252 |
| Output Delta Read | `Z97` | chunks.41.mjs:2325 |

---

## New in v2.1.76

- **Ctrl+F Kill All**: New keyboard shortcut to kill all running background agents at once (`U4q`)
- **Partial Results Preserved**: Output file flushed via `$O` before marking task as killed
- **`background: true` flag**: Explicit background flag in task state for better mode detection
- **Teammate foregrounding**: Press `f` to bring in_process_teammate to foreground