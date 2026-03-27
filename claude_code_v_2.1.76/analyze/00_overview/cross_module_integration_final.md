# Cross-Module Integration Final (Claude Code 2.1.76)

> **Comprehensive cross-module integration analysis** for Tools (05), MCP (06), Plan Mode (12), and Task System (13).
> **Final Version** - All integration points documented with source code references.

---

## Overview

This document provides a comprehensive analysis of how the four key modules integrate with each other and with the System Reminder (04) system.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SYSTEM REMINDER INTEGRATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌───────────┐│
│  │   05_tools  │     │   06_mcp    │     │ 12_plan_mode│     │13_task_sys││
│  │             │     │             │     │             │     │           ││
│  │ • progress  │────▶│ • elicitation│    │ • plan_mode │────▶│ • task_   ││
│  │ • hook_ctx  │     │ • mcp_      │     │ • plan_exit │     │   status  ││
│  │ • perm_dec  │     │   progress  │     │ • turn_count│     │ • claim   ││
│  │ • task_stat │     │ • binary    │     │             │     │ • complete││
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘     └─────┬─────┘│
│         │                   │                   │                   │      │
│         └───────────────────┴───────────────────┴───────────────────┘      │
│                                      │                                      │
│                                      ▼                                      │
│                    ┌─────────────────────────────────┐                      │
│                    │     04_system_reminder          │                      │
│                    │                                 │                      │
│                    │  normalizeAttachmentForAPI()    │                      │
│                    │  wrapWithSystemReminderTags()   │                      │
│                    │  createUserMessage()            │                      │
│                    │                                 │                      │
│                    └─────────────────────────────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Tools ↔ System Reminder Integration

### Attachment Types Generated

| Attachment Type | When Generated | Source Function |
|-----------------|----------------|-----------------|
| `progress` | Tool execution progress updates | `C4q` (createProgressMessage) |
| `hook_additional_context` | Pre-tool hook context injection | `y4q` (executePreToolHooks) |
| `hook_blocking_error` | Hook denied execution | `y4q` (executePreToolHooks) |
| `hook_cancelled` | Hook execution cancelled | `y4q` |
| `hook_error_during_execution` | Hook threw error | `y4q`, `E4q` |
| `hook_stopped_continuation` | Hook stopped execution | `k4q` (executePostToolHooks) |
| `structured_output` | Tool returned structured data | `fxY` (toolExecutionPipeline) |
| `permission_decision` | Permission flow result | `z` (canUseTool) |

### Source Code: Progress Attachment

```javascript
// ============================================
// createProgressMessage - Create progress attachment
// Location: chunks.172.mjs:2943
// ============================================

// ORIGINAL (for source lookup):
function C4q({
    toolUseID: A,
    parentToolUseID: q,
    data: K
}) {
    return {
        type: "progress",
        data: K,
        toolUseID: A,
        parentToolUseID: q,
        uuid: _f(),
        timestamp: new Date().toISOString()
    }
}

// READABLE (for understanding):
function createProgressMessage({ toolUseID, parentToolUseID, data }) {
    return {
        type: "progress",
        data: data,                // Progress data (type, elapsed time, etc.)
        toolUseID: toolUseID,      // ID of the tool use being tracked
        parentToolUseID: parentToolUseID,  // Parent tool if nested
        uuid: generateUuid(),
        timestamp: new Date().toISOString()
    };
}

// Mapping: C4q→createProgressMessage, A→toolUseID, q→parentToolUseID, K→data, _f→generateUuid
```

### Hook Additional Context

```javascript
// From executePreToolHooks (y4q) in chunks.146.mjs:147-158
if (hookResult.additionalContexts && hookResult.additionalContexts.length > 0) {
    yield {
        type: "additionalContext",
        message: {
            message: createAttachmentMessage({
                type: "hook_additional_context",
                content: hookResult.additionalContexts,
                hookName: `PreToolUse:${tool.name}`,
                toolUseID: toolUseId,
                hookEvent: "PreToolUse"
            })
        }
    };
}
```

---

## 2. MCP ↔ System Reminder Integration

### Attachment Types Generated

| Attachment Type | When Generated | Source Function |
|-----------------|----------------|-----------------|
| `elicitation` | MCP server requests user input | `WT7` (setupElicitationRequestHandler) |
| `elicitation_result` | User responds to elicitation | `WT7` |
| `mcp_progress` | MCP tool execution progress | `JE` (fetchMcpTools → tool.call) |
| `mcp_resource` | MCP resource content | Resource reading |
| `mcp_server_status` | Server connection status | `nl` (connectMcpServer) |

### Elicitation Queue Structure

```javascript
// State structure for elicitation
{
    elicitation: {
        queue: [{
            serverName: "sqlite",
            requestId: "req-123",
            params: {
                message: "Please provide database credentials",
                requestedSchema: { /* JSON Schema */ }
            },
            signal: AbortSignal,
            waitingState: { actionLabel: "Skip confirmation" },
            respond: (response) => { /* resolve promise */ }
        }]
    }
}
```

### Modal Priority Algorithm

```javascript
// Modal priority (highest → lowest)
function getCurrentModal(state) {
    if (state.sandboxPermissionQueue[0]) return "sandbox-permission";
    if (state.pendingToolRequest[0]) return "tool-permission";
    if (state.workerSandboxQueue[0]) return "worker-sandbox-permission";
    if (state.elicitation.queue[0]) return "elicitation";  // Lowest priority
    return null;
}
```

---

## 3. Plan Mode ↔ System Reminder Integration

### Attachment Types Generated

| Attachment Type | When Generated | Source Function |
|-----------------|----------------|-----------------|
| `plan_mode` | Full 5-phase workflow instructions | Plan mode entry |
| `plan_mode_reentry` | Re-entering plan mode | Turn detection |
| `plan_mode_exit` | Exited plan mode notification | `zD` (ExitPlanModeTool) |
| `plan_file_reference` | Existing plan file content | Post-compact |

### Plan Mode Reminder Variants

```javascript
function planModeReminderDispatcher(attachment) {
    if (attachment.isSubAgent) {
        return formatSubagentPlanReminder(attachment);  // Brief, no plan file editing
    }
    if (attachment.reminderType === "sparse") {
        return formatSparsePlanReminder(attachment);    // Short reminder
    }
    if (attachment.iterativeMode) {
        return formatIterativePlanReminder(attachment); // Pair-planning workflow
    }
    return formatFullPlanReminder(attachment);          // 5-phase workflow
}
```

### Turn Counting for Sparse Reminders

```javascript
// Global state for turn tracking
let turnCount = 0;
const SPARSE_REMINDER_THRESHOLD = 5;  // Show sparse reminder every 5 turns

function shouldShowSparseReminder() {
    turnCount++;
    return turnCount % SPARSE_REMINDER_THRESHOLD === 0;
}
```

---

## 4. Task System ↔ System Reminder Integration

### Attachment Types Generated

| Attachment Type | When Generated | Source Function |
|-----------------|----------------|-----------------|
| `task_status` | Task state changes | `aD1`, `WI`, `sD1` |
| `task_claimed` | Task assignment | `OT8` (claimTask) |
| `task_completed` | Completion status | `WI` (updateTask) |
| `task_progress` | Progress messages | Tool execution |

### Task Status Attachment Example

```javascript
// Task created
{
    type: "task_status",
    action: "created",
    taskId: "1",
    subject: "Implement login UI",
    status: "pending"
}

// Task claimed
{
    type: "task_claimed",
    taskId: "1",
    owner: "agent-alice",
    previousOwner: null
}

// Task completed
{
    type: "task_completed",
    taskId: "1",
    status: "completed",
    completedBy: "agent-alice"
}
```

---

## 5. Tools ↔ MCP Integration

### MCP Tool Discovery Flow

```
MCP Server Connects
       │
       ▼
fetchMcpTools (JE)
       │
       ├─▶ tools/list JSON-RPC
       │
       ├─▶ Build prefixed name: mcp__<server>__<tool>
       │
       ├─▶ Extract annotations
       │    ├─ readOnlyHint → isReadOnly()
       │    ├─ destructiveHint → isDestructive()
       │    └─ openWorldHint → isOpenWorld()
       │
       └─▶ Register in session tool set
```

### MCP Tool Execution

```javascript
// MCP tool.call() implementation
async call(args, context, canUseTool, message, progressCallback) {
    // Get connected client
    const client = await getMcpClientConnection(clientConnection);

    // Execute via JSON-RPC
    const result = await executeMcpToolCall({
        client,
        tool: mcpToolName,
        args,
        meta: { "claudecode/toolUseId": toolUseId },
        signal: context.abortController.signal,
        onProgress: progressCallback,
        handleElicitation: context.handleElicitation
    });

    return { data: result.content };
}
```

---

## 6. Tools ↔ Plan Mode Integration

### Tool Filtering Algorithm

```javascript
function filterToolsForPlanMode(tools, planFilePath) {
    return tools.filter(tool => {
        // Always allow read-only tools
        if (tool.isReadOnly?.()) return true;

        // Allow ExitPlanMode
        if (tool.name === "ExitPlanMode") return true;

        // Allow EnterPlanMode (for re-entry)
        if (tool.name === "EnterPlanMode") return true;

        // Allow AskUserQuestion
        if (tool.name === "AskUserQuestion") return true;

        // Allow Write/Edit only to plan file
        if (tool.name === "Write" || tool.name === "Edit") {
            // Path checked at execution time
            return true;
        }

        // Block all other tools
        return false;
    });
}
```

### Write/Edit Path Validation

```javascript
// During tool execution in plan mode
if (mode === "plan" && (tool.name === "Write" || tool.name === "Edit")) {
    if (!isPathWithinPlanFile(input.file_path, planFilePath)) {
        return {
            message: createUserMessage({
                content: [{
                    type: "tool_result",
                    content: `Error: In plan mode, you can only write to the plan file at ${planFilePath}`,
                    is_error: true,
                    tool_use_id: toolUseId
                }]
            })
        };
    }
}
```

---

## 7. Tools ↔ Task System Integration

### Task Tool Integration

| Tool | Function | Integration |
|------|----------|-------------|
| `TaskCreate` | Create new task | Uses `aD1` with locking |
| `TaskGet` | Get task by ID | Uses `DB` |
| `TaskList` | List all tasks | Uses `DX` |
| `TaskUpdate` | Update task | Uses `WI` with hooks |
| `TodoWrite` | Simple todo mode | Used when `r$()` returns false |

### Task Claiming Flow

```
claimTask (OT8) called
       │
       ├─▶ Verify task exists
       │
       ├─▶ Acquire file lock
       │
       ├─▶ Check not claimed by another
       │
       ├─▶ Check not completed
       │
       ├─▶ Check dependencies completed
       │
       ├─▶ Set owner + status: in_progress
       │
       └─▶ Release lock
```

---

## 8. Plan Mode ↔ Task System Integration

### Task Creation During Planning

In plan mode, the agent can create tasks that will be executed after plan approval:

1. Agent analyzes task and creates subtasks
2. Each subtask becomes a Task via `TaskCreate`
3. Dependencies are established via `addTaskDependency`
4. After plan approval, tasks are claimed and executed

### Task Status in Plan

```javascript
// Plan can reference task IDs
{
    "Implementation Plan": [
        {
            "step": 1,
            "task": "Create login form",
            "taskId": "1"
        },
        {
            "step": 2,
            "task": "Add validation",
            "taskId": "2",
            "dependsOn": ["1"]
        }
    ]
}
```

---

## 9. Cross-Module Attachment Flow

```
Tool Execution (fxY)
    │
    ├─→ Pre-tool Hook (y4q)
    │       │
    │       ├─→ hook_additional_context
    │       │       └─→ System Reminder (p1)
    │       │
    │       ├─→ hookPermissionResult
    │       │       └─→ Permission Decision
    │       │
    │       └─→ hook_blocking_error
    │               └─→ Tool denied
    │
    ├─→ Permission Check (canUseTool)
    │       │
    │       └─→ permission_decision
    │               └─→ User dialog result
    │
    ├─→ Tool Call (tool.call)
    │       │
    │       ├─→ MCP Tool → elicitation possible
    │       │       └─→ Elicitation dialog
    │       │
    │       └─→ progress callbacks
    │               └─→ Streaming progress updates
    │
    └─→ Post-tool Hook (k4q)
            │
            └─→ structured_output
                    └─→ Tool result formatting
```

---

## 10. Integration Matrix

| Source Module | Target Module | Integration Type | Key Functions |
|---------------|---------------|------------------|---------------|
| Tools | System Reminder | Attachment generation | `C4q`, `f4`, `p1` |
| Tools | MCP | Tool discovery/execution | `JE`, `F3z`, `pC` |
| Tools | Plan Mode | Tool filtering | `filterToolsForPlanMode` |
| Tools | Task System | Task tools | `aD1`, `WI`, `OT8` |
| MCP | System Reminder | Elicitation | `WT7`, `sx6`, `tx6` |
| MCP | Tools | Tool registration | `JE` returns tool objects |
| Plan Mode | System Reminder | Plan attachments | `plan_mode`, `plan_mode_exit` |
| Plan Mode | Tools | Write restriction | Path validation |
| Plan Mode | Task System | Task creation | `TaskCreate` in planning |
| Task System | System Reminder | Task status | `task_status`, `task_claimed` |
| Task System | Hooks | Completion hooks | `Hi6` (executeTaskCompletedHooks) |

---

## Symbol Reference

### Tools Module
- `Wi6` (toolDispatcher) - chunks.146.mjs:285
- `fxY` (toolExecutionPipeline) - chunks.146.mjs:442
- `y4q` (executePreToolHooks) - chunks.146.mjs:74
- `C4q` (createProgressMessage) - chunks.172.mjs:2943

### MCP Module
- `JE` (fetchMcpTools) - chunks.170.mjs:533
- `pC` (callMcpTool) - chunks.169.mjs:1910
- `WT7` (setupElicitationRequestHandler) - chunks.58.mjs:3
- `sx6` (runElicitationHook) - chunks.58.mjs:86

### Plan Mode Module
- `Ki6` (EnterPlanModeTool) - chunks.144.mjs:1579
- `zD` (ExitPlanModeTool) - chunks.143.mjs:2802
- `Dp` (handlePlanModeTransition) - chunks.1.mjs:2946

### Task System Module
- `aD1` (createTask) - chunks.84.mjs:1669
- `WI` (updateTask) - chunks.84.mjs:1701
- `OT8` (claimTask) - chunks.84.mjs:1781
- `wN9` (getHighWaterMark) - chunks.84.mjs:1664

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Complete cross-module integration analysis |
| 2.1.72 | MCP elicitation system |
| 2.1.32 | Task System with dependencies, team integration |
| 2.1.18 | Plan mode with tool filtering |