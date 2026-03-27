# Cross-Module Integration Matrix (Claude Code 2.1.76)

> Complete mapping of integration points between Tools, MCP, Plan Mode, Task System, and System Reminder modules.

---

## Overview

This document provides a comprehensive view of how the four core modules interact with each other and with the System Reminder system.

---

## Integration Matrix

| From → To | 05_tools | 06_mcp | 12_plan_mode | 13_task_system | 04_system_reminder |
|-----------|----------|--------|--------------|----------------|---------------------|
| **05_tools** | - | MCP tool delegation | Tool filtering | Task tools | Progress, hooks, permissions |
| **06_mcp** | Tool registration | - | - | - | Elicitation, resources |
| **12_plan_mode** | Tool restrictions | - | - | Task integration | Plan mode attachments |
| **13_task_system** | Task tools | - | Plan integration | - | Task status, progress |
| **04_system_reminder** | Attachment types | MCP resources | Plan reminders | Task reminders | - |

---

## Detailed Integration Points

### 1. Tools ↔ MCP

**Integration Type:** Tool Discovery and Delegation

| Aspect | Details |
|--------|---------|
| **Tool Discovery** | `fetchMcpTools` (JE) discovers MCP tools via `tools/list` |
| **Tool Naming** | MCP tools prefixed with `mcp__<server>__<tool>` |
| **Execution** | Routes through standard `toolExecutionPipeline` (fxY) |
| **Annotations** | `readOnlyHint` → `isReadOnly()`, `destructiveHint` → `isDestructive()` |
| **Error Handling** | `McpSessionLostError` (qn8) triggers retry, `McpToolExecutionError` (EV) wraps errors |
| **Progress** | `mcp_progress` events for started/completed/failed |

**Key Symbols:**
- `JE` (fetchMcpTools) - chunks.170.mjs:533
- `pC` (callMcpTool) - chunks.169.mjs:1910
- `F3z` (executeMcpToolCall) - chunks.170.mjs:607
- `yT6` (getMcpClientConnection) - chunks.170.mjs:606

---

### 2. Tools ↔ Plan Mode

**Integration Type:** Tool Filtering

| Aspect | Details |
|--------|---------|
| **Read-Only Tools** | `isReadOnly()` tools always allowed in plan mode |
| **Write/Edit** | Only allowed to plan file path |
| **Exit** | `ExitPlanMode` is the only programmatic exit |
| **Re-entry** | `EnterPlanMode` allowed for re-entry |
| **Clarification** | `AskUserQuestion` allowed for user interaction |

**Tool Filtering Algorithm:**
```javascript
function filterToolsForPlanMode(tools, planFilePath) {
    return tools.filter(tool => {
        if (tool.isReadOnly?.()) return true;
        if (tool.name === "ExitPlanMode") return true;
        if (tool.name === "EnterPlanMode") return true;
        if (tool.name === "AskUserQuestion") return true;
        if (tool.name === "Write" || tool.name === "Edit") return true;
        return false;
    });
}
```

**Key Symbols:**
- `Ki6` (EnterPlanModeTool) - chunks.144.mjs:1579
- `zD` (ExitPlanModeTool) - chunks.143.mjs:2802
- `dt` (TOOL_NAME_ENTER_PLAN_MODE) - chunks.90.mjs:3121
- `aJ` (TOOL_NAME_EXIT_PLAN_MODE) - chunks.90.mjs:507

---

### 3. Tools ↔ Task System

**Integration Type:** Tool Definitions

| Tool | Symbol | Purpose |
|------|--------|---------|
| TaskCreate | `TR` | Create new task with auto-increment ID |
| TaskUpdate | `ck` | Update task status, owner, dependencies |
| TaskGet | `lt` | Load single task by ID |
| TaskList | `it` | Load all tasks for listing |
| TodoWrite | `MB` | Simple todo list (when tasks disabled) |

**Key Symbols:**
- `jf` (getTaskManager) - chunks.84.mjs:1619
- `aD1` (createTask) - chunks.84.mjs:1669
- `DB` (loadTask) - chunks.84.mjs:1687
- `WI` (updateTask) - chunks.84.mjs:1701
- `OT8` (claimTask) - chunks.84.mjs:1781

---

### 4. Tools ↔ System Reminder

**Integration Type:** Attachment Generation

| Attachment Type | When Generated | Purpose |
|-----------------|----------------|---------|
| `progress` | During tool execution | Streaming updates (Bash output) |
| `hook_additional_context` | Pre-tool hook execution | Additional context from hooks |
| `hook_blocking_error` | Hook denial | Hook rejection message |
| `hook_stopped_continuation` | Hook stopped execution | Early termination notification |
| `permission_decision` | After canUseTool | Record of user decision |
| `structured_output` | Tool returned structured data | Non-text tool results |

**Key Functions:**
- `p1` (createUserMessage) - Creates messages with `isMeta: true`
- `f4` (createAttachmentMessage) - Wraps tool-specific attachments
- `C4q` (createProgressMessage) - Progress message factory

---

### 5. MCP ↔ System Reminder

**Integration Type:** Elicitation and Resources

| Attachment Type | When Generated | Purpose |
|-----------------|----------------|---------|
| `mcp_resource` | Resource fetch | MCP resource content |
| `elicitation` | Server requests input | Form/URL mode dialog |
| `elicitation_result` | User responds | Response to MCP server |

**Elicitation Flow:**
```
MCP Server → elicitation/create → WT7 (handler)
    │
    ▼
Queue in appState.elicitation.queue
    │
    ▼
UI displays form/URL dialog
    │
    ▼
User response → resolve Promise
    │
    ▼
Response sent to MCP server
```

**Key Symbols:**
- `WT7` (setupElicitationRequestHandler) - chunks.58.mjs:3
- `jB3` (detectElicitationMode) - chunks.57.mjs:2919
- `sx6` (runElicitationHook) - chunks.58.mjs:86

---

### 6. Plan Mode ↔ System Reminder

**Integration Type:** Plan Mode Attachments

| Attachment Type | When Generated | Content |
|-----------------|----------------|---------|
| `plan_mode` | Each turn in plan mode | 5-phase workflow instructions |
| `plan_mode_reentry` | Re-entering plan mode | Brief reminder |
| `plan_mode_exit` | Exiting plan mode | Exit notification |
| `plan_file_reference` | Post-compact | Existing plan file content |

**Attachment Variants:**
- **Full format** - Complete 5-phase workflow (default)
- **Sparse format** - Minimal reminder for experienced users
- **Subagent format** - Brief for nested agents (no plan file editing)

**Key Symbols:**
- `Wzz` (planModeReminderDispatcher) - chunks.173.mjs:2525
- `Nzz` (fullPlanReminder) - chunks.173.mjs
- `Ezz` (sparsePlanReminder) - chunks.173.mjs

---

### 7. Task System ↔ System Reminder

**Integration Type:** Task Status Attachments

| Attachment Type | When Generated | Content |
|-----------------|----------------|---------|
| `task_status` | Task create/update/delete | Task state changes |
| `task_claimed` | Task assigned | Owner info |
| `task_completed` | Task marked complete | Dependency notification |
| `task_progress` | During task execution | Progress messages |

**Trigger Conditions:**
- Task created → `task_status` with `action: "created"`
- Task updated → `task_status` with `action: "updated"`
- Task deleted → `task_status` with `action: "deleted"`
- Task claimed → `task_claimed` with owner info
- Task completed → `task_completed` for dependent tasks

---

### 8. Plan Mode ↔ Agent Teams (Swarm)

**Integration Type:** Plan Approval Workflow

```
Teammate (in plan mode)
    │ ExitPlanMode called
    ▼
plan_approval_request → writeToMailbox (x3)
    │
    ▼
Team-lead inbox (readMailbox - wl)
    │ Show approval dialog
    ▼
handlePlanApproval (AhY)
    │
    ▼
plan_approval_response → writeToMailbox
    │
    ▼
Teammate receives response
    ├─→ approved: Exit plan mode
    └─→ rejected: Stay in plan mode
```

**Key Symbols:**
- `AhY` (handlePlanApproval) - chunks.145.mjs:2521
- `Vx4` (PlanApprovalRequestMessageSchema) - chunks.129.mjs:1546
- `Nx4` (PlanApprovalResponseMessageSchema) - chunks.129.mjs:1553
- `wl` (readMailbox) - chunks.132.mjs:3
- `x3` (writeToMailbox) - chunks.132.mjs:22

---

## Attachment Type Summary

| Type | Module | Trigger | Purpose |
|------|--------|---------|---------|
| `progress` | Tools | Tool execution | Streaming updates |
| `hook_additional_context` | Tools | Pre-hook | Context injection |
| `hook_blocking_error` | Tools | Hook denial | Rejection message |
| `hook_stopped_continuation` | Tools | Hook stop | Early termination |
| `permission_decision` | Tools | canUseTool | User decision record |
| `mcp_progress` | MCP | MCP tool execution | Server/tool status |
| `elicitation` | MCP | Server request | User input dialog |
| `plan_mode` | Plan Mode | Each turn | Workflow instructions |
| `plan_mode_exit` | Plan Mode | Exit | Exit notification |
| `task_status` | Task System | Task changes | State updates |
| `task_claimed` | Task System | Assignment | Owner info |
| `task_completed` | Task System | Completion | Dependency notification |

---

## Cross-Reference

- [05_tools/README.md](../05_tools/README.md) - Tools module overview
- [06_mcp/README.md](../06_mcp/README.md) - MCP module overview
- [12_plan_mode/README.md](../12_plan_mode/README.md) - Plan Mode module overview
- [13_task_system/README.md](../13_task_system/README.md) - Task System module overview
- [04_system_reminder/README.md](../04_system_reminder/README.md) - System Reminder module overview
