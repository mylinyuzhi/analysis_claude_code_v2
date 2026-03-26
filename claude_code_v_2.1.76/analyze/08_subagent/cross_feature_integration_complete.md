# Cross-Feature Integration Matrix - Complete (Claude Code 2.1.76)

> Complete documentation of integration points between subagent/background agent systems and other modules.
> Cross-validated against source code on 2026-03-27.

---

## Related Symbols

> Symbol mappings:
> - [key_algorithms_source_restored_complete.md](./key_algorithms_source_restored_complete.md) - Algorithm source code
> - [cross_validation_unified.md](./cross_validation_unified.md) - Unified symbol verification

---

## Integration Matrix Overview

| Integration Point | Module | Key Functions | Description |
|------------------|--------|---------------|-------------|
| System Reminders | 04_system_reminder | `suY`, `f4` | Task status attachments |
| Tool Execution | 05_tools | `Xk8`, `_c` | Tool filtering for subagents |
| Compact System | 07_compact | `Fx8`, `DI` | Message context preservation |
| Hooks | 11_hooks | `E4`, `r24` | Cleanup on abort, agent hooks |
| Task System | 13_task_system | `wY4`, `OY4` | Output polling, state updates |
| Slash Commands | 09_slash_command | `/tasks` command | Task list modal |
| Keybindings | 32_keybindings | Ctrl+C, Ctrl+F | Kill handlers |
| Loop/Cron | 36_loop_cron | `CronCreate` | Scheduled task support |
| State Management | 15_state_management | `i9`, `Zf`, `VR` | Task state operations |
| LLM API | 03_llm_core | `Yh`, `qh` | Message streaming |

---

## Integration 1: System Reminder (04_system_reminder)

### Purpose

Background agent progress is injected into LLM context via system reminders, enabling the LLM to track task status without explicit polling.

### Key Functions

```javascript
// ============================================
// suY - getUnifiedTasksAttachment - Build task status attachments
// Location: chunks.147.mjs:1033-1048
// ============================================

// ORIGINAL (for source lookup):
async function suY(A) {
    let q = A.getAppState(),
        {
            attachments: K,
            updatedTaskOffsets: Y,
            evictedTaskIds: z
        } = await wY4(q);
    return OY4(A.setAppState, Y, z), K.map((_) => ({
        type: "task_status",
        taskId: _.taskId,
        taskType: _.taskType,
        status: _.status,
        description: _.description,
        deltaSummary: _.deltaSummary
    }))
}

// READABLE (for understanding):
async function getUnifiedTasksAttachment(toolUseContext) {
    // Step 1: Get current app state
    let appState = toolUseContext.getAppState();

    // Step 2: Poll output files and collect updates
    let {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    } = await pollTaskOutputs(appState);  // wY4

    // Step 3: Apply state updates
    updateTaskState(
        toolUseContext.setAppState,
        updatedTaskOffsets,
        evictedTaskIds
    );  // OY4

    // Step 4: Transform to task_status format
    return attachments.map((a) => ({
        type: "task_status",
        taskId: a.taskId,
        taskType: a.taskType,
        status: a.status,
        description: a.description,
        deltaSummary: a.deltaSummary
    }));
}
```

### Attachment Format

```xml
<system-reminder>
<task_status>
<task taskId="a7x9k2m3" taskType="local_agent" status="running">
  <description>Search codebase for authentication patterns</description>
  <delta_summary>Found auth patterns in src/auth/</delta_summary>
</task>
</task_status>
</system-reminder>
```

### Trigger Conditions

| Condition | Trigger |
|-----------|---------|
| Task starts | `Zf` (registerTask) called |
| Task progress | `nl4` (updateTaskProgressWithTelemetry) called |
| Task completes | `$m8` (markTaskCompleted) called |
| Task fails | `Hm8` (markTaskFailed) called |
| Task killed | `x66` (triggerAbortSignal) called |

---

## Integration 2: Tool Execution (05_tools)

### Purpose

Tool filtering ensures subagents have appropriate tool access based on execution mode (synchronous, background, teammate).

### Key Functions

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools based on agent type
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}
```

### Tool Access Control

#### Background Agent Excluded Tools (CW6)

| Tool | Reason |
|------|--------|
| `TaskOutput` | Could create polling loops |
| `ExitPlanMode` | Requires user approval flow |
| `EnterPlanMode` | Requires user approval flow |
| `Agent` | Could spawn nested background agents |
| `AskUserQuestion` | Would block indefinitely |
| `TaskStop` | Background agents shouldn't manage other tasks |

#### Async Agent Allowed Tools (eP1)

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

## Integration 3: Compact System (07_compact)

### Purpose

When conversation history is compacted, fork context must be preserved for subagent resume functionality.

### Key Functions

```javascript
// ============================================
// Fx8 - cloneForkContext - Filter orphaned tool results
// Location: chunks.133.mjs:1788-1804
// ============================================

// ORIGINAL (for source lookup):
function Fx8(A) {
    let q = new Set;
    for (let K of A)
        if (K?.type === "user") {
            let z = K.message.content;
            if (Array.isArray(z)) {
                for (let _ of z)
                    if (_.type === "tool_result" && _.tool_use_id) q.add(_.tool_use_id)
            }
        } return A.filter((K) => {
        if (K?.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return !z.some((w) => w.type === "tool_use" && w.id && !q.has(w.id))
        }
        return !0
    })
}

// READABLE (for understanding):
function cloneForkContext(messages) {
    // Step 1: Collect all tool_use_ids with results
    let validToolUseIds = new Set();
    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        validToolUseIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Step 2: Filter out orphaned tool_uses
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Keep only if ALL tool_uses have results
                return !content.some((block) =>
                    block.type === "tool_use" &&
                    block.id &&
                    !validToolUseIds.has(block.id)
                );
            }
        }
        return true;
    });
}
```

### Compact Integration Points

| Point | Function | Purpose |
|-------|----------|---------|
| Pre-compact | `Fx8` | Preserve valid fork context |
| Clone state | `DI` | Clone readFileState for subagent |
| Post-compact | `wY4` | Resume output polling |

---

## Integration 4: Hooks (11_hooks)

### Purpose

Hooks can be registered for subagent lifecycle events, and cleanup handlers ensure resources are released on abort.

### Key Functions

```javascript
// ============================================
// E4 - registerCleanupHandler - Register cleanup for process exit
// Location: chunks.146.mjs (referenced in Qn4)
// ============================================

// Called during task creation:
let unregisterCleanup = registerCleanupHandler(async () => {
    triggerAbortSignal(agentId, setAppState);  // x66
});

// Agent hooks registration:
if (agentDefinition.hooks) {
    registerAgentHooks(setAppState, agentId, agentDefinition.hooks, `agent '${agentDefinition.agentType}'`, true);  // r24
}
```

### Hook Events for Subagents

| Event | Trigger | Data |
|-------|---------|------|
| `SubagentStart` | Agent starts | `agentId`, `agentType`, `prompt` |
| `SubagentEnd` | Agent completes | `agentId`, `result`, `tokens` |
| `SubagentAbort` | Agent killed | `agentId`, `reason` |

### Cleanup Flow

```
Agent abort triggered
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Cleanup sequence:                                                          │
│ 1. abortController.abort()                                                 │
│ 2. unregisterCleanup()                                                     │
│ 3. cleanupMcpClients()                                                     │
│ 4. unregisterAgentHooks()                                                  │
│ 5. readFileState.clear()                                                   │
│ 6. cleanupAgentState()                                                     │
│ 7. killBashTasksForAgent()                                                 │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Integration 5: Task System (13_task_system)

### Purpose

The task system provides the polling infrastructure for background agent output and state management.

### Key Functions

```javascript
// ============================================
// wY4 - pollTaskOutputs - Poll output files for updates
// Location: chunks.90.mjs:3058-3085
// ============================================

// ORIGINAL (for source lookup):
async function wY4(A) {
    let q = [],
        K = {},
        Y = [],
        z = A.tasks ?? {};
    for (let _ of Object.values(z)) {
        if (_.notified) switch (_.status) {
            case "completed":
            case "failed":
            case "killed":
                Y.push(_.id);
                continue;
            case "pending":
                continue;
            case "running":
                break
        }
        if (_.status === "running") {
            let w = await Z97(_.id, _.outputOffset);
            if (w.content) K[_.id] = w.newOffset
        }
    }
    return {
        attachments: q,
        updatedTaskOffsets: K,
        evictedTaskIds: Y
    }
}

// READABLE (for understanding):
async function pollTaskOutputs(appState) {
    let attachments = [];
    let updatedTaskOffsets = {};
    let evictedTaskIds = [];

    let tasks = appState.tasks ?? {};

    for (let task of Object.values(tasks)) {
        // Skip notified terminal tasks (for eviction)
        if (task.notified) {
            switch (task.status) {
                case "completed":
                case "failed":
                case "killed":
                    evictedTaskIds.push(task.id);
                    continue;
                case "pending":
                    continue;
            }
        }

        // Poll running tasks for output
        if (task.status === "running") {
            let result = await readOutputFileDelta(task.id, task.outputOffset);  // Z97
            if (result.content) {
                updatedTaskOffsets[task.id] = result.newOffset;
            }
        }
    }

    return {
        attachments,
        updatedTaskOffsets,
        evictedTaskIds
    };
}
```

---

## Integration 6: Slash Commands (09_slash_command)

### Purpose

The `/tasks` command opens the task list modal for managing background agents.

### Command Definition

```javascript
// ============================================
// /tasks command - Task list modal trigger
// Location: chunks.146.mjs (task state management)
// ============================================

{
    name: "tasks",
    description: "List and manage background tasks",
    handler: async (args, context) => {
        // Open task list modal
        context.setToolJSX({
            jsx: <TaskListModal
                appState={context.getAppState()}
                setAppState={context.setAppState}
                onClose={() => context.setToolJSX(null)}
            />,
            shouldHidePromptInput: true
        });
    }
}
```

---

## Integration 7: Keybindings (32_keybindings)

### Purpose

Keyboard shortcuts for managing background agents.

### Key Bindings

| Shortcut | Action | Implementation |
|----------|--------|----------------|
| `Ctrl+C` (once) | Show kill confirmation | Check `EV8(appState).length > 0` |
| `Ctrl+F` (confirm) | Kill all agents | `U4q(tasks, setAppState)` |
| `Ctrl+B` | Background current Bash | Set `run_in_background: true` |

### Kill Confirmation Flow

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Kill Confirmation Flow                                                     │
└───────────────────────────────────────────────────────────────────────────┘

User presses Ctrl+C
        │
        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ Check: EV8(appState).length > 0 ?                                          │
│ (Any running local_agent tasks?)                                           │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                        ▼ No                        ▼ Yes
            ┌───────────────────┐         ┌─────────────────────────────────────────┐
            │ Normal Ctrl+C     │         │ Show confirmation in status line:       │
            │ (cancel stream)   │         │ "Press Ctrl+F to stop N agents"         │
            └───────────────────┘         └───────────────────┬─────────────────────┘
                                                            │
                                              ┌─────────────┴─────────────┐
                                              │                           │
                                              ▼ Timeout (2s)             ▼ Ctrl+F
                                      ┌───────────────────┐         ┌─────────────────────────┐
                                      │ Revert status     │         │ Execute:                │
                                      │ line to normal    │         │ U4q(tasks, setAppState) │
                                      └───────────────────┘         │ → x66 for each task     │
                                                                    └─────────────────────────┘
```

---

## Integration 8: Loop/Cron (36_loop_cron)

### Purpose

The CronCreate tool can schedule recurring tasks that interact with the background agent system.

### Integration Points

```javascript
// ============================================
// Cron job integration with task system
// ============================================

// Creating a scheduled task that spawns a background agent
CronCreate({
    cron: "*/5 * * * *",  // Every 5 minutes
    prompt: "Check deployment status"
});

// The cron job creates a background task when triggered
// The task is managed like any other background agent
```

### Cron Job Task Types

| Cron Type | Task Type | Behavior |
|-----------|-----------|----------|
| Background check | `local_agent` | Runs in background, notifies on completion |
| Monitoring | `local_agent` | Continuous output polling |
| Scheduled test | `local_bash` | Shell command execution |

---

## Integration 9: State Management (15_state_management)

### Purpose

Task state is stored in the global app state and managed through atomic updates.

### State Structure

```javascript
// ============================================
// Task state in appState
// Location: chunks.90.mjs:3003-3017
// ============================================

appState = {
    // ... other state ...
    tasks: {
        [taskId: string]: TaskRecord
    }
};

// Atomic update function
function i9(taskId, setAppState, updater) {
    setAppState((state) => {
        let task = state.tasks?.[taskId];
        if (!task) return state;
        let updated = updater(task);
        if (updated === task) return state;  // No change
        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updated
            }
        };
    });
}
```

### State Operations

| Function | Symbol | Operation |
|----------|--------|-----------|
| `atomicUpdateTask` | `i9` | Update single task atomically |
| `registerTask` | `Zf` | Add new task to state |
| `removeTask` | `VR` | Remove task from state |
| `getRunningTasks` | `EV8` | Get all running tasks |

---

## Integration 10: LLM API (03_llm_core)

### Purpose

The agent loop integrates with the LLM API for streaming message generation.

### Key Functions

```javascript
// ============================================
// Yh - llmMessageLoop - LLM message streaming
// Location: chunks.148.mjs
// ============================================

// Called from agentLoopRunner (qh)
for await (let event of llmMessageLoop({
    messages,
    systemPrompt,
    userContext,
    systemContext,
    canUseTool,
    toolUseContext,
    querySource,
    maxTurns
})) {
    // Yield recordable messages
    if (isMessageRecordable(event)) {
        yield event;
    }
}
```

### LLM Integration Points

| Point | Function | Purpose |
|-------|----------|---------|
| Message streaming | `Yh` | Stream LLM responses |
| Tool execution | `qh` | Execute tool calls |
| Progress update | `nl4` | Update task progress |
| Abort handling | `x66` | Cancel LLM stream |

---

## Summary

### Integration Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INTEGRATION DEPENDENCIES                             │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │         08_subagent                  │
                    │  (AgentTool, agentLoopRunner)       │
                    └─────────────────┬───────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │                            │                            │
         ▼                            ▼                            ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│ 04_system_      │        │ 05_tools        │        │ 03_llm_core     │
│ reminder        │        │ (tool filtering)│        │ (Yh, streaming) │
│ (suY, f4)       │        │ (Xk8, _c)       │        │                 │
└────────┬────────┘        └─────────────────┘        └─────────────────┘
         │
         │         ┌────────────────────────────────────────────────────┐
         │         │              26_background_agents                   │
         │         │  (Qn4, x66, U4q, $m8, Hm8, nl4, Z97)               │
         │         └──────────────────────┬─────────────────────────────┘
         │                                │
         ▼                                ▼
┌─────────────────┐              ┌─────────────────┐
│ 15_state_       │              │ 13_task_system  │
│ management      │              │ (wY4, OY4)      │
│ (i9, Zf, VR)    │              │                 │
└─────────────────┘              └─────────────────┘
         │
         │         ┌────────────────────────────────────────────────────┐
         │         │              Cross-cutting Concerns                 │
         │         └────────────────────────────────────────────────────┘
         │                                │
         ▼                                ▼
┌─────────────────┐              ┌─────────────────┐
│ 11_hooks        │              │ 32_keybindings  │
│ (E4, r24)       │              │ (Ctrl+C, Ctrl+F)│
└─────────────────┘              └─────────────────┘
```

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - 10 integration points documented with source code