# 08_subagent - Subagent System Module (Claude Code 2.1.76)

> Reverse engineering documentation for the subagent spawning, execution, and coordination system

---

## Module Overview

The subagent system is Claude Code's primary mechanism for **parallelism and task decomposition**. When the parent agent determines a task is complex enough to warrant delegation, it invokes the `Task` tool (internally `AgentTool` / `rj1`) to spawn a subagent.

### Key Capabilities

- **Three execution modes**: Synchronous (blocking), Asynchronous (background), Teammate (collaborative)
- **Isolated context**: Each subagent has its own message history, tool permissions, and model selection
- **AsyncLocalStorage identity**: Transparent context propagation without parameter threading
- **Mid-run backgrounding**: Seamless sync→async transition via `Promise.race`
- **Mailbox communication**: File-based message queues for teammate coordination
- **Worktree isolation**: Declarative `isolation: worktree` support for git worktree-based isolation (v2.1.76)
- **Per-invocation model override**: `model` parameter can be specified per AgentTool call (v2.1.76)

---

## Document Index

### Core Documentation

| File | Description | Key Topics |
|------|-------------|------------|
| [overview.md](./overview.md) | Module introduction and high-level architecture | Execution modes, lifecycle, agent definition resolution, model selection, fork context |
| [architecture_summary.md](./architecture_summary.md) | System architecture diagrams and design patterns | Component diagrams, data flow, design patterns, performance bottlenecks |

### Deep Technical Analysis

| File | Description | Key Symbols |
|------|-------------|-------------|
| [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) | Agent loop execution, task state, abort signals | `dR`, `p01`, `RjA`, `Yd7`, `c5` |
| [communication_and_coordination.md](./communication_and_coordination.md) | Mailbox system, poll loops, inter-agent messaging | `Ld`, `f9`, `JQ1`, `WVY`, `GVY` |
| [tools_integration.md](./tools_integration.md) | Tool set assembly, whitelists, context derivation | `YP6`, `vQ1`, `CW6`, `eP1`, `WY4` |

### Lifecycle & State

| File | Description | Key Topics |
|------|-------------|------------|
| [task_lifecycle_and_state.md](./task_lifecycle_and_state.md) | Task creation, backgrounding, completion | `wd7`, `zd7`, `Hd7`, `yjA`, `CjA`, `na` |
| [transcript_and_resume_system.md](./transcript_and_resume_system.md) | Conversation recording and resume | `sP1`, `wP6`, `mQ1`, `BQ1`, `ld1` |

### Integration Points

| File | Description | Integration With |
|------|-------------|------------------|
| [tools_integration.md](./tools_integration.md) | Tool set assembly, whitelists | `05_tools/`, Permission System |
| [compact_integration.md](./compact_integration.md) | Token management in subagents | `07_compact/` |
| [system_reminder_integration.md](./system_reminder_integration.md) | Context propagation, progress reporting | System Prompts |
| [hooks_integration.md](./hooks_integration.md) | Hook execution in subagent context | `17_hooks/` |
| [context_building.md](./context_building.md) | Fork context building, isolation | Message Assembly |
| [slash_command_integration.md](./slash_command_integration.md) | /loop, /compact, skills integration | Slash Commands, CronCreate, SkillTool |

### Configuration & Execution Modes

| File | Description | Key Topics |
|------|-------------|------------|
| [agent_definitions.md](./agent_definitions.md) | Built-in agents, merging logic | `ZB1`, `bv`, `PJ6`, `hh`, `KPA` |
| [agent_tool.md](./agent_tool.md) | Task tool schema and validation | `rj1`, input/output schemas |
| [execution_modes_comparison.md](./execution_modes_comparison.md) | Sync vs async vs teammate comparison | Performance metrics, decision matrix |
| [error_handling_and_recovery.md](./error_handling_and_recovery.md) | Error categories, recovery strategies | Cleanup mechanisms, error propagation |

---

## Quick Reference - Key Symbols

### Execution Engine

| Obfuscated | Readable | Description | Location |
|------------|----------|-------------|----------|
| `dR` | `agentLoopRunner` | Core async generator for agent execution | chunks.130.mjs:1961 |
| `p01` | `runWithAgentIdentity` | AsyncLocalStorage context binding | chunks.80.mjs:2353 |
| `GVY` | `inProcessAgentRunner` | Runner for in-process teammates | chunks.131.mjs:348 |
| `WVY` | `pollForNextMessage` | Poll loop for teammate messages | chunks.131.mjs:260 |

### Task Management

| Obfuscated | Readable | Description | Location |
|------------|----------|-------------|----------|
| `rj1` | `AgentTool` | The "Task" tool object | chunks.132.mjs:85 |
| `wd7` | `createForegroundTask` | Create task with backgrounding support | chunks.89.mjs:1477 |
| `zd7` | `createAsyncTask` | Create background task entry | chunks.89.mjs:1447 |
| `yjA` | `markTaskCompleted` | Mark task as completed | chunks.89.mjs:1422 |
| `CjA` | `markTaskFailed` | Mark task as failed | chunks.89.mjs:1435 |
| `na` | `killTask` | Kill a running task | chunks.89.mjs:1376 |

### Progress & State

| Obfuscated | Readable | Description | Location |
|------------|----------|-------------|----------|
| `RjA` | `reportToolProgress` | Update progress (preserves summary) | chunks.89.mjs:1393 |
| `Yd7` | `updateTaskProgress` | Update summary text | chunks.89.mjs:1407 |
| `c5` | `atomicUpdateTask` | Generic task state updater | chunks.142.mjs:1662 |

### Communication

| Obfuscated | Readable | Description | Location |
|------------|----------|-------------|----------|
| `Ld` | `readMailbox` | Read messages from mailbox | chunks.129.mjs:1089 |
| `f9` | `writeToMailbox` | Write message to mailbox | chunks.129.mjs:1107 |
| `JQ1` | `markMessageAsReadByIndex` | Mark message as read | chunks.129.mjs:1130 |

### Tool Assembly

| Obfuscated | Readable | Description | Location |
|------------|----------|-------------|----------|
| `YP6` | `assembleSessionToolSet` | Main tool set assembly | chunks.141.mjs:1476 |
| `vQ1` | `deriveToolUseContext` | Create isolated context for subagent | chunks.149.mjs:2589 |
| `CW6` | `BACKGROUND_AGENT_EXCLUDED_TOOLS` | Tools excluded from background agents | chunks.91.mjs:269 |
| `eP1` | `ASYNC_AGENT_ALLOWED_TOOLS` | Tools allowed for async agents | chunks.91.mjs:269 |
| `WY4` | `TEAM_DELEGATE_TOOLS` | Team/cron tools for delegates | chunks.91.mjs:269 |

---

## Execution Modes

### 1. Synchronous (Inline)

```
Parent calls Task tool
  → Blocks until subagent completes
  → Real-time progress updates
  → Returns { status: "completed", content, tokens }
```

**Use case:** Quick tasks requiring immediate results

### 2. Asynchronous (Background)

```
Parent calls Task tool with run_in_background: true
  → Returns immediately { status: "async_launched", agentId, outputFile }
  → Subagent runs independently
  → User polls output file for progress
```

**Use case:** Long-running tasks that shouldn't block the session

### 3. Teammate (Team Spawning)

```
Parent calls Task tool with name + team_name
  → spawnTeammateDispatcher routes to backend:
    - In-process (non-interactive sessions)
    - Split-pane (iTerm2/tmux)
    - Tmux-only (fallback)
  → Teammate runs with mailbox-based communication
```

**Use case:** Multi-agent collaboration, parallel task execution

---

## Architecture Highlights

### Generator-Based Streaming

```javascript
async function* agentLoopRunner({...}) {
    for await (let message of llmLoop({...})) {
        yield message;  // Stream to caller
    }
}
```

**Benefits:** Real-time UI, memory efficient, cancellable, composable

### AsyncLocalStorage Identity

```javascript
runWithAgentIdentity(identity, async () => {
    // Any code in this call stack can call getCurrentAgentIdentity()
    let id = db1();  // Retrieves identity without parameter passing
});
```

**Benefits:** Isolation, transparency, async-safe, no coupling

### Mid-Run Backgrounding

```javascript
let raceResult = await Promise.race([
    nextMessage(),      // Continue sync
    backgroundSignal    // Go async
]);

if (raceResult.type === "background") {
    // Seamless transition to background execution
}
```

**Benefits:** Zero-loss transition, no restart required

### Worktree Isolation (v2.1.76)

Subagents can declare `isolation: worktree` in their agent definition to run within an isolated git worktree. This prevents file conflicts between parallel agents working on the same repository.

```javascript
// Agent definition with worktree isolation
{
    agentType: "general-purpose",
    isolation: "worktree",  // New in v2.1.76
    // ...
}
```

**Benefits:** True filesystem isolation for parallel file editing agents.

---

## Tool Whitelists

### Background Agent Excluded Tools (CW6)

Tools **excluded** from background/async agents:

```javascript
BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Write to background task output
    "ExitPlanMode",    // Exit plan mode
    "EnterPlanMode",   // Enter plan mode
    "Agent",           // Spawn subagents (Task tool)
    "AskUserQuestion", // Request user input
    "TaskStop"         // Stop running task
])
```

### Async Agent Allowed Tools (eP1)

Tools **allowed** for async/background agents:

```javascript
ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
])
```

### Team/Delegate Tools (WY4)

Tools available to delegate mode agents:

```javascript
TEAM_DELEGATE_TOOLS = new Set([
    "TaskCreate", "TaskGet", "TaskList", "TaskUpdate",
    "SendMessage", "CronCreate", "CronDelete", "CronList"
])
```

---

## Related Modules

- **[05_tools/](../05_tools/)** - Tool execution pipeline
- **[07_compact/](../07_compact/)** - Token management and file read tracking
- **[13_task_system/](../13_task_system/)** - Structured task tools
- **[17_hooks/](../17_hooks/)** - Hook system
- **[26_background_agents/](../26_background_agents/)** - Background agent details
- **[30_agent_teams/](../30_agent_teams/)** - Multi-agent teams

---

## Symbol Mappings

> For complete symbol mappings, see:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra symbols
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration symbols

---

## Reading Order

For a comprehensive understanding of the subagent system:

1. **Start with:** [overview.md](./overview.md) - Understand the three execution modes
2. **Architecture:** [architecture_summary.md](./architecture_summary.md) - See the system diagrams
3. **Deep dive:** [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Understand the agent loop
4. **Communication:** [communication_and_coordination.md](./communication_and_coordination.md) - Learn mailbox system
5. **Integration:** [tools_integration.md](./tools_integration.md) - Understand tool assembly
6. **Specialize:** Based on interest - compact, hooks, context building, etc.
