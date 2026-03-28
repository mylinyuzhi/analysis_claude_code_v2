# 08_subagent - Subagent System Module (Claude Code 2.1.76)

> Reverse engineering documentation for the subagent spawning, execution, and coordination system
>
> **Cross-validated**: All symbols verified against source code on 2026-03-27.

---

## Module Overview

The subagent system is Claude Code's primary mechanism for **parallelism and task decomposition**. When the parent agent determines a task is complex enough to warrant delegation, it invokes the `Task` tool (internally `AgentTool` / `QW6`) to spawn a subagent.

### Key Capabilities

- **Three execution modes**: Synchronous (blocking), Asynchronous (background), Teammate (collaborative)
- **Isolated context**: Each subagent has its own message history, tool permissions, and model selection
- **AsyncLocalStorage identity**: Transparent context propagation without parameter threading
- **Mid-run backgrounding**: Seamless sync→async transition via `Promise.race`
- **Mailbox communication**: File-based message queues for teammate coordination
- **Worktree isolation**: Declarative `isolation: worktree` support for git worktree-based isolation (v2.1.76)
- **Per-invocation model override**: `model` parameter can be specified per AgentTool call (v2.1.76)

---

## Quick Reference - Key Symbols

> Full symbol index: [cross_validation_unified.md](./cross_validation_unified.md) - **93+ verified symbols**

### Execution Engine

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `qh` | agentLoopRunner | Core async generator for agent execution | chunks.133.mjs:1565 |
| `Yh` | llmMessageLoop | LLM message processing loop | chunks.148.mjs |
| `XNY` | inProcessAgentRunner | Runner for in-process teammates | chunks.134.mjs:1571 |
| `DNY` | pollForNextMessage | Poll loop for teammate messages | chunks.134.mjs:1483 |

### Agent Tool & Schema

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `QW6` | AgentTool | The "Task"/"Agent" tool object | chunks.136.mjs:1512 |
| `aVY` | agentInputSchema | Base input schema | chunks.136.mjs:1444 |
| `sVY` | teammateInputSchema | Teammate mode schema | chunks.136.mjs:1451 |
| `eVY` | agentOutputSchema | Output schema | chunks.136.mjs:1492 |

### Task Management

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `oV` | generateTaskId | Generate unique task ID with type prefix | chunks.41.mjs:2410 |
| `i9` | atomicUpdateTask | Generic task state updater | chunks.90.mjs:3003 |
| `Zf` | registerTask | Register task in state | chunks.90.mjs:3019 |
| `x66` | triggerAbortSignal | Trigger abort signal for task | chunks.146.mjs:2012 |
| `U4q` | killAllLocalAgents | Kill all running local_agent tasks | chunks.146.mjs:2029 |

### Mailbox System

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `wl` | readMailbox | Read messages from mailbox | chunks.132.mjs:3 |
| `x3` | writeToMailbox | Write message to mailbox | chunks.132.mjs:22 |
| `Vc6` | markMessageAsReadByIndex | Mark single message as read | chunks.132.mjs:57 |
| `kc6` | markMessagesAsRead | Mark all messages as read | chunks.132.mjs:92 |

### Tool Filtering

| Symbol | Readable | Description | Location |
|--------|----------|-------------|----------|
| `Xk8` | filterToolsForSubagent | Filter tools based on agent type | chunks.93.mjs:1568 |
| `_c` | applyToolFilters | Apply whitelist/blacklist | chunks.93.mjs:1590 |
| `CW6` | BACKGROUND_AGENT_EXCLUDED_TOOLS | Tools excluded from background agents | chunks.91.mjs:269 |
| `eP1` | ASYNC_AGENT_ALLOWED_TOOLS | Tools allowed for async agents | chunks.91.mjs:269 |

---

## Execution Modes

### 1. Synchronous (Inline)

```
Parent calls Task tool
  → Blocks until subagent completes
  → Real-time progress updates
  → Returns { status: "completed", content, tokens }
```

### 2. Asynchronous (Background)

```
Parent calls Task tool with run_in_background: true
  → Returns immediately { status: "async_launched", agentId, outputFile }
  → Subagent runs independently
  → User polls output file for progress
```

### 3. Teammate (Team Spawning)

```
Parent calls Task tool with name + team_name
  → spawnTeammateDispatcher routes to backend:
    - In-process (non-interactive sessions)
    - Split-pane (iTerm2/tmux)
    - Tmux-only (fallback)
  → Teammate runs with mailbox-based communication
```

---

## Document Index

### COMPLETE SOURCE RESTORATION (START HERE)

| File | Description |
|------|-------------|
| [cross_validation_unified.md](./cross_validation_unified.md) | **START HERE** - All 89+ symbols verified against source |
| [key_algorithms_source_restored_complete.md](./key_algorithms_source_restored_complete.md) | **NEW** - 10 key algorithms with full source restoration |
| [agent_tool_complete.md](./agent_tool_complete.md) | Complete AgentTool source |
| [agent_loop_algorithm.md](./agent_loop_algorithm.md) | Agent loop algorithm analysis |
| [task_lifecycle_complete_source.md](../26_background_agents/task_lifecycle_complete_source.md) | Complete task lifecycle source |
| [mailbox_system_complete_source.md](./mailbox_system_complete_source.md) | Complete mailbox system source |
| [tool_filtering_complete_source.md](./tool_filtering_complete_source.md) | Complete tool filtering source |

### UI DOCUMENTATION

| File | Description |
|------|-------------|
| [ui_interaction_complete.md](./ui_interaction_complete.md) | **NEW** - Complete UI interactions with flow diagrams |
| [ui_design_complete_final.md](./ui_design_complete_final.md) | Complete UI design with React components |

### CROSS-FEATURE INTEGRATION

| File | Description |
|------|-------------|
| [cross_feature_integration_complete.md](./cross_feature_integration_complete.md) | **NEW** - Complete 10-point integration matrix |
| [system_reminder_integration_complete.md](./system_reminder_integration_complete.md) | System reminder integration |
| [feature_integration_complete.md](./feature_integration_complete.md) | Feature interconnections |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOOP ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

AgentTool.call()
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. agentLoopRunner (qh)                                                      │
│    - Initialize agent ID, model, permission context                         │
│    - Clone fork context if provided (Fx8)                                   │
│    - Build system prompt (vvY)                                              │
│    - Derive tool set (Xk8)                                                  │
│    - Register hooks (r24)                                                   │
│    - Load skills (NvY)                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. llmMessageLoop (Yh)                                                       │
│    - Stream messages from LLM API                                           │
│    - Handle tool calls                                                      │
│    - Manage conversation turns                                              │
│    - Check abort signal                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ├──────────────────────────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────────────┐           ┌───────────────────────┐
│ Yield stream events   │           │ Handle tool results   │
│ - message_start       │           │ - Execute tools       │
│ - content_block_delta │           │ - Send to LLM         │
│ - message_stop        │           │ - Update progress     │
└───────────────────────┘           └───────────────────────┘
```

---

## Tool Whitelists

### Background Agent Excluded Tools (CW6)

```javascript
BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
])
```

### Async Agent Allowed Tools (eP1)

```javascript
ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])
```

---

## Related Modules

- **[05_tools/](../05_tools/)** - Tool execution pipeline
- **[07_compact/](../07_compact/)** - Token management
- **[11_hooks/](../11_hooks/)** - Hook system
- **[26_background_agents/](../26_background_agents/)** - Background agent details
- **[30_agent_teams/](../30_agent_teams/)** - Multi-agent teams

---

## Symbol Mappings

> For complete symbol mappings, see:
> - [cross_validation_unified.md](./cross_validation_unified.md) - This module's verified symbols (84 total)
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features symbols

---

## Reading Order

For a comprehensive understanding of the subagent system:

1. **Start with:** [cross_validation_unified.md](./cross_validation_unified.md) - Verify symbols (84+)
2. **Algorithms:** [key_algorithms_deep_dive.md](./key_algorithms_deep_dive.md) - 8 key algorithms
3. **Entry point:** [agent_tool_complete.md](./agent_tool_complete.md) - AgentTool
4. **Core loop:** [agent_loop_complete_source.md](./agent_loop_complete_source.md) - Agent loop
5. **Lifecycle:** [../26_background_agents/task_lifecycle_complete_source.md](../26_background_agents/task_lifecycle_complete_source.md) - Task lifecycle
6. **Communication:** [mailbox_system_complete_source.md](./mailbox_system_complete_source.md) - Mailbox
7. **UI Design:** [ui_interaction_complete.md](./ui_interaction_complete.md) - Complete UI
8. **Integration:** [cross_feature_linkages_complete.md](./cross_feature_linkages_complete.md) - 9 integrations
9. **System Reminders:** [system_reminder_integration_complete.md](./system_reminder_integration_complete.md) - System reminders

---

**Last Updated**: 2026-03-27 (re-verified)
**Version**: Claude Code 2.1.76
**Status**: Complete - 93 symbols verified, 13 key algorithms with source restoration, complete UI documentation with keyboard shortcuts, system reminder integration

---

## Reading Order (Updated 2026-03-27)

For a comprehensive understanding of the subagent system:

1. **Symbols:** [cross_validation_unified.md](./cross_validation_unified.md) - **START HERE** - All 93+ verified symbols
2. **Algorithms:** [key_algorithms_source_restored_complete.md](./key_algorithms_source_restored_complete.md) - 9 key algorithms with source
3. **Agent Tool:** [agent_tool_complete.md](./agent_tool_complete.md) - Complete AgentTool source
4. **Agent Loop:** [agent_loop_complete_source.md](./agent_loop_complete_source.md) - Complete agent loop source
5. **Lifecycle:** [../26_background_agents/task_lifecycle_complete_source.md](../26_background_agents/task_lifecycle_complete_source.md) - Task lifecycle
6. **Mailbox:** [mailbox_system_complete_source.md](./mailbox_system_complete_source.md) - Complete mailbox system
7. **Tool Filtering:** [tool_filtering_complete_source.md](./tool_filtering_complete_source.md) - Complete tool filtering
8. **UI Design:** [ui_design_complete_final.md](./ui_design_complete_final.md) - Complete UI with React components
9. **UI Interaction:** [ui_interaction_complete.md](./ui_interaction_complete.md) - Complete UI interactions with Ctrl+F shortcut
10. **Integration:** [cross_feature_integration_complete.md](./cross_feature_integration_complete.md) - 10 integration points
11. **System Reminders:** [system_reminder_integration_complete.md](./system_reminder_integration_complete.md) - System reminder integration

---

## Keyboard Shortcuts (v2.1.76)

| Shortcut | Action | Location |
|----------|--------|----------|
| `Ctrl+F` | Kill all running background agents | chunks.162.mjs:981-983 |
| `x` | Stop selected task | Task list modal |
| `f` | Foreground teammate | Task list modal |
| `Enter` | View task output | Task list modal |
| `Esc` | Close modal | Task list modal |

---

## New in v2.1.76

- **Ctrl+F Kill All**: New keyboard shortcut to kill all running background agents at once
- **Partial Results Preserved**: Output file flushed before marking task as killed
- **`background: true` flag**: Explicit background flag in task state for better mode detection
- **Worktree isolation**: `isolation: "worktree"` parameter for git worktree-based isolation