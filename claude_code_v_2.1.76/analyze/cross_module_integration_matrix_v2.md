# Cross-Module Integration Matrix (Claude Code 2.1.76)

> **Complete analysis of integration points between Tools, MCP, Plan Mode, Task System, and System Reminder modules.**

---

## Overview

This document maps the integration points between the four key modules and the System Reminder (04) infrastructure. Understanding these connections is essential for grasping the full execution flow of Claude Code.

---

## Integration Matrix

| From → To | Tools (05) | MCP (06) | Plan Mode (12) | Task System (13) | System Reminder (04) |
|-----------|------------|----------|----------------|------------------|----------------------|
| **Tools (05)** | — | Tool execution via MCP | Tool filtering | Task tools | progress, hook_* |
| **MCP (06)** | Tool registration | — | MCP in plan mode | — | mcp_resource, elicitation |
| **Plan Mode (12)** | Tool restrictions | — | — | Plan → tasks | plan_mode_* |
| **Task System (13)** | Task tools | — | Task in plan mode | — | task_status, task_* |
| **System Reminder (04)** | Consumes attachments | Consumes attachments | Consumes attachments | Consumes attachments | — |

---

## 1. Tools ↔ MCP Integration

### Tool Discovery Flow

```
MCP Server connects
    │
    ├─→ fetchMcpTools (JE)
    │     │
    │     ├─→ tools/list JSON-RPC
    │     │
    │     └─→ For each tool:
    │           ├─→ Build prefixed name: mcp__server__tool
    │           ├─→ Map annotations to methods
    │           └─→ Create tool object
    │
    └─→ Register in session tool set
```

### Tool Execution Flow

```
toolDispatcher (Wi6) receives tool_use block
    │
    ├─→ Tool name starts with "mcp__"?
    │     └─→ Look up in MCP tools
    │
    ├─→ Execute via tool.call()
    │     │
    │     └─→ MCP tool call:
    │           ├─→ getMcpClientConnection (yT6)
    │           ├─→ executeMcpToolCall (F3z)
    │           │     ├─→ tools/call JSON-RPC
    │           │     └─→ Handle elicitation if needed
    │           └─→ Retry on McpSessionLostError
    │
    └─→ Return result through pipeline
```

### Key Integration Points

| Point | Tools Symbol | MCP Symbol | Description |
|-------|--------------|------------|-------------|
| Tool lookup | `findTool` (dK) | — | Searches MCP-prefixed tools |
| Name prefix | — | `buildMcpToolName` ($58) | Creates `mcp__server__tool` |
| Execution | `toolExecutionPipeline` (fxY) | `call` method | Standard pipeline |
| Retry | — | `qn8` | Session recovery trigger |
| Progress | Progress callback | `mcp_progress` events | Streaming updates |

---

## 2. Tools ↔ Plan Mode Integration

### Tool Filtering in Plan Mode

```
Agent enters plan mode (mode = "plan")
    │
    └─→ filterToolsForPlanMode(tools, planFilePath)
          │
          ├─→ Keep if tool.isReadOnly() === true
          │     ├─→ Read, Grep, Glob
          │     ├─→ WebFetch, WebSearch
          │     └─→ TaskList, TaskGet
          │
          ├─→ Keep ExitPlanMode
          ├─→ Keep EnterPlanMode
          ├─→ Keep AskUserQuestion
          │
          ├─→ Keep Write/Edit (path checked at execution)
          │
          └─→ Block all others
```

### Execution-Time Path Restriction

```javascript
// In Write/Edit tools
async validateInput(input, context) {
    if (context.toolPermissionContext.mode === "plan") {
        if (input.file_path !== planFilePath) {
            return {
                result: false,
                message: "In plan mode, you can only write to the plan file."
            };
        }
    }
    return { result: true };
}
```

### Key Integration Points

| Point | Tools Symbol | Plan Mode Symbol | Description |
|-------|--------------|------------------|-------------|
| Mode check | `toolPermissionContext.mode` | — | Filters tools |
| Tool filtering | `filterToolsByMode` (Xk8) | — | Mode-aware filtering |
| Path restriction | `validateInput` | `planFilePath` | Write/Edit restriction |
| Exit trigger | — | `ExitPlanModeTool` (zD) | Programmatic exit |

---

## 3. Tools ↔ Task System Integration

### Task Tool Definitions

```javascript
// TaskCreate tool
{
    name: "TaskCreate",
    inputSchema: TaskCreateInputSchema,
    async call(input, context) {
        const taskListId = getTaskManager();
        const taskId = await createTask(taskListId, input);
        return { data: { taskId } };
    }
}

// TaskUpdate tool
{
    name: "TaskUpdate",
    inputSchema: TaskUpdateInputSchema,
    async call(input, context) {
        const taskListId = getTaskManager();
        const task = await updateTask(taskListId, input.id, input.updates);
        return { data: task };
    }
}

// TaskGet, TaskList similarly defined
```

### Hook Integration

```
TaskUpdate(status: "completed")
    │
    ├─→ executeTaskCompletedHooks (Hi6)
    │     │
    │     └─→ For each TaskCompleted hook:
    │           ├─→ Hook returns success → Continue
    │           └─→ Hook returns failure → Block completion
    │
    └─→ Update task on disk
```

### Key Integration Points

| Point | Tools Symbol | Task System Symbol | Description |
|-------|--------------|--------------------|-------------|
| TaskCreate | Tool definition | `createTask` (aD1) | Create task |
| TaskUpdate | Tool definition | `updateTask` (WI) | Update task |
| TaskGet | Tool definition | `loadTask` (DB) | Load task |
| TaskList | Tool definition | `loadAllTasks` (DX) | List tasks |
| Hook execution | — | `Hi6` | Pre-completion hooks |

---

## 4. Plan Mode ↔ Task System Integration

### Task Creation from Plans

After plan approval, tasks can be created:

```
ExitPlanMode approved
    │
    ├─→ hasTaskTool = true?
    │     │
    │     └─→ Suggest using TaskCreate to break plan into tasks
    │
    └─→ Agent can use TaskCreate with plan steps
```

### Plan Mode Task Restrictions

In plan mode, task tools are partially restricted:
- `TaskList` - Allowed (read-only)
- `TaskGet` - Allowed (read-only)
- `TaskCreate` - **Blocked** (would modify state)
- `TaskUpdate` - **Blocked** (would modify state)

### Swarm Workflow

```
Teammate in plan mode
    │
    ├─→ ExitPlanModeTool.call()
    │     │
    │     └─→ isSwarmTeammate() && isTeamFeaturesEnabled()?
    │           │
    │           ├─→ Send plan_approval_request
    │           │
    │           └─→ Team-lead reviews:
    │                 ├─→ Approved → Exit plan mode → Create tasks
    │                 └─→ Rejected → Stay in plan mode
```

---

## 5. System Reminder Integration

### Tools → System Reminder Attachments

| Attachment Type | Trigger | Content |
|-----------------|---------|---------|
| `progress` | Tool progress callback | `{ toolUseID, data }` |
| `hook_additional_context` | PreToolUse hook | `{ content, hookName, toolUseID }` |
| `hook_blocking_error` | Hook denial | `{ message, hookName }` |
| `hook_permission_decision` | Hook permission | `{ decision, toolUseID }` |
| `hook_stopped_continuation` | Hook stopped | `{ reason }` |
| `structured_output` | Tool output | `{ data }` |
| `permission_decision` | Permission flow | `{ behavior, toolName }` |

### MCP → System Reminder Attachments

| Attachment Type | Trigger | Content |
|-----------------|---------|---------|
| `mcp_resource` | Resource fetch | `{ uri, content, mimeType }` |
| `elicitation` | Server request | `{ message, schema, uris }` |
| `elicitation_result` | User response | `{ response }` |
| `mcp_progress` | Tool progress | `{ status, serverName, toolName }` |
| `mcp_instructions_delta` | Server instruction change | `{ added, removed }` |

### Plan Mode → System Reminder Attachments

| Attachment Type | Trigger | Content |
|-----------------|---------|---------|
| `plan_mode` | Enter plan mode | Full 5-phase workflow |
| `plan_mode_reentry` | Re-enter plan mode | Brief reminder |
| `plan_mode_exit` | Exit plan mode | Exit notification |
| `plan_file_reference` | Post-compact | Plan file content |

### Task System → System Reminder Attachments

| Attachment Type | Trigger | Content |
|-----------------|---------|---------|
| `task_status` | Create/update/delete | `{ action, task }` |
| `task_claimed` | Claim operation | `{ taskId, owner }` |
| `task_completed` | Completion | `{ taskId, dependencies }` |
| `task_progress` | Progress message | `{ taskId, message }` |

---

## 6. Complete Integration Flow Example

### Multi-Module Interaction: Background Agent with Tasks

```
User: "Implement the login feature using a background agent"
    │
    ├─→ Agent Tool (QW6) called
    │     │
    │     ├─→ Validate input (subagent_type: "general-purpose")
    │     │
    │     ├─→ Check if plan mode required
    │     │     └─→ If yes: EnterPlanMode
    │     │
    │     ├─→ Spawn subagent process
    │     │     │
    │     │     └─→ Subagent loop:
    │     │           ├─→ TaskCreate for subtasks
    │     │           ├─→ TaskUpdate to claim tasks
    │     │           └─→ Execute tools (Read, Edit, Write)
    │     │
    │     ├─→ Progress tracking
    │     │     └─→ `progress` attachments to main session
    │     │
    │     └─→ TaskCompleted hooks on completion
    │
    └─→ Result returned to main session
          │
          └─→ `task_status` attachment generated
```

### MCP Tool with Elicitation

```
MCP tool: mcp__database__query
    │
    ├─→ Tool execution via fetchMcpTools.call()
    │     │
    │     ├─→ executeMcpToolCall (F3z)
    │     │
    │     ├─→ Server requests elicitation
    │     │     │
    │     │     └─→ elicitation attachment created
    │     │           │
    │     │           └─→ UI shows elicitation dialog
    │     │                 │
    │     │                 └─→ User responds
    │     │                       │
    │     │                       └─→ elicitation_result attachment
    │     │
    │     ├─→ Continue tool execution
    │     │
    │     └─→ Return result with mcp_progress completed
    │
    └─→ Result formatted and returned to LLM
```

---

## 7. Shared Constants and Types

### Tool Name Constants

```javascript
// Tool names shared across modules
const TOOL_NAMES = {
    // File operations
    READ: "Read",           // s7
    WRITE: "Write",         // _K
    EDIT: "Edit",           // R4
    NOTEBOOK_EDIT: "NotebookEdit",  // bJ

    // Search
    GREP: "Grep",           // N9
    GLOB: "Glob",           // qz

    // Execution
    BASH: "Bash",           // Q7

    // Agent
    AGENT: "Agent",         // r4

    // Tasks
    TASK_CREATE: "TaskCreate",  // TR
    TASK_UPDATE: "TaskUpdate",  // ck
    TASK_GET: "TaskGet",        // lt
    TASK_LIST: "TaskList",      // it
    TODO_WRITE: "TodoWrite",    // MB

    // Plan mode
    ENTER_PLAN_MODE: "EnterPlanMode",  // dt
    EXIT_PLAN_MODE: "ExitPlanMode",    // aJ
    ASK_USER_QUESTION: "AskUserQuestion",  // Fw

    // Skills
    SKILL: "Skill",         // oH

    // Cron
    CRON_CREATE: "CronCreate",
    CRON_DELETE: "CronDelete",
    CRON_LIST: "CronList"
};
```

### Mode Values

```javascript
const MODES = {
    DEFAULT: "default",
    PLAN: "plan",
    ACCEPT_EDITS: "acceptEdits",
    DELEGATE: "delegate",
    BYPASS_PERMISSIONS: "bypassPermissions",
    DONT_ASK: "dontAsk",
    AUTO: "auto"
};
```

### Task Status Values

```javascript
const TASK_STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed"
};
```

---

## 8. Error Propagation

### Cross-Module Error Types

| Error | Source | Propagates To |
|-------|--------|---------------|
| `McpSessionLostError` (qn8) | MCP | Tools (triggers retry) |
| `McpToolExecutionError` (EV) | MCP | Tools (formatted result) |
| `TaskNotFoundError` | Task System | Tools (error result) |
| `PermissionDeniedError` | Tools | System Reminder (attachment) |
| `HookBlockingError` | Hooks | Tools, System Reminder |

### Error Handling Flow

```
Tool execution error
    │
    ├─→ Execute PostToolUseFailure hooks (E4q)
    │
    ├─→ Format error for display
    │
    ├─→ Create error tool_result
    │
    └─→ Generate hook_error_during_execution attachment
```

---

## 9. Performance Considerations

### Concurrent Operations

| Module | Concurrency Mechanism |
|--------|----------------------|
| Tools | `AsyncQueue` (Pi6) for streaming |
| MCP | Memoization (ZP) for tool discovery |
| Task System | File locking (EF6) for atomic ops |
| Plan Mode | State synchronization via setAppState |

### Caching Strategies

| Cache | Scope | Invalidation |
|-------|-------|--------------|
| MCP tool list | Per server | Server reconnect |
| Task list | In-memory | Gt() on any write |
| Tool schema | Session | Tool reload |

---

## Summary

This integration matrix shows how the four key modules work together:

1. **Tools** is the central execution layer, routing all tool operations
2. **MCP** extends tools dynamically with external capabilities
3. **Plan Mode** restricts tools for safe planning workflows
4. **Task System** provides structured work tracking
5. **System Reminder** receives all state changes as attachments

The modular design allows each component to evolve independently while maintaining clear integration contracts.