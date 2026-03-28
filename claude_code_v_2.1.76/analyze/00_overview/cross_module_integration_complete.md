# Cross-Module Integration: Tools, MCP, Plan Mode, Task System ↔ System Reminder

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Complete cross-module analysis

---

## Overview

This document provides a comprehensive analysis of how the four key modules integrate with the System Reminder (04) system and with each other. System reminders are the mechanism by which context is injected into the LLM conversation.

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
│  │ • progress  │     │ • elicitation│    │ • plan_mode │     │ • task_   ││
│  │ • hook_ctx  │────▶│ • mcp_      │────▶│ • plan_exit │────▶│   status  ││
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
│                    │  Attachment Types:              │                      │
│                    │  • progress                     │                      │
│                    │  • hook_additional_context      │                      │
│                    │  • hook_blocking_error          │                      │
│                    │  • plan_mode                    │                      │
│                    │  • task_status                  │                      │
│                    │  • elicitation                  │                      │
│                    │  • mcp_progress                 │                      │
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
| `hook_cancelled` | Hook execution cancelled | `E4q` (executePostToolFailureHooks) |
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

// READABLE (for understanding):
function createProgressMessage(toolUseId, progressData) {
    return createAttachmentMessage({
        type: "progress",
        toolUseID: toolUseId,
        status: progressData.status,      // "started" | "in_progress" | "completed"
        message: progressData.message,
        percentage: progressData.percentage,
        serverName: progressData.serverName,  // For MCP tools
        toolName: progressData.toolName
    });
}

// Sent via progressCallback in toolExecutionPipeline
```

### Source Code: Hook Additional Context

```javascript
// ============================================
// From executePreToolHooks (y4q)
// Location: chunks.146.mjs:147-158
// ============================================

// ORIGINAL (for source lookup):
if (j.additionalContexts && j.additionalContexts.length > 0) {
    yield {
        type: "additionalContext",
        message: {
            message: f4({
                type: "hook_additional_context",
                content: j.additionalContexts,
                hookName: `PreToolUse:${q.name}`,
                toolUseID: Y,
                hookEvent: "PreToolUse"
            })
        }
    };
}

// READABLE (for understanding):
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

### Data Flow

```
Tool Execution (fxY)
    │
    ├─→ Pre-tool Hook (y4q)
    │       │
    │       ├─→ hook_additional_context
    │       │       └─→ System Reminder (p1)
    │       │
    │       ├─→ hookPermissionResult
    │       │       └─→ Permission Decision (canUseTool)
    │       │
    │       └─→ hook_blocking_error
    │               └─→ Tool denied, return error
    │
    ├─→ Permission Check (canUseTool)
    │       │
    │       └─→ permission_decision
    │               └─→ User dialog result
    │
    ├─→ Tool Call (tool.call)
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

## 2. MCP ↔ System Reminder Integration

### Attachment Types Generated

| Attachment Type | When Generated | Source Function |
|-----------------|----------------|-----------------|
| `elicitation` | MCP server requests user input | `WT7` (setupElicitationRequestHandler) |
| `elicitation_result` | User responds to elicitation | `WT7` |
| `mcp_progress` | MCP tool execution progress | `JE` (fetchMcpTools → tool.call) |
| `mcp_resource` | MCP resource content | Resource reading |
| `mcp_server_status` | Server connection status | `nl` (connectMcpServer) |

### Elicitation Flow

```
MCP Server                              Claude Code
    │                                        │
    │  elicitation/create                    │
    │  {message, requestedSchema/uris}       │
    │───────────────────────────────────────▶│
    │                                        │
    │                                        ├─→ Queue elicitation
    │                                        │
    │                                        ├─→ UI: Form Dialog or URL redirect
    │                                        │
    │  ◀─────────────────────────────────────│
    │  elicitation/result                    │
    │  {action: "accept", content: {...}}    │
    │                                        │
```

### Source Code: Elicitation Handler

```javascript
// ============================================
// setupElicitationRequestHandler - Handle MCP server elicitation requests
// Location: chunks.58.mjs:3
// ============================================

// READABLE (for understanding):
function setupElicitationRequestHandler(mcpClient, sessionContext) {
    mcpClient.setRequestHandler(ElicitationCreateSchema, async (request) => {
        const { message, requestedSchema, uris } = request.params;

        // Determine elicitation mode
        const mode = uris && uris.length > 0 ? "url" : "form";

        // Create elicitation attachment
        const elicitationId = generateUUID();
        const elicitationAttachment = {
            type: "elicitation",
            id: elicitationId,
            serverName: mcpClient.name,
            message,
            mode,
            requestedSchema,
            uris,
            timestamp: new Date().toISOString()
        };

        // Queue for UI processing
        await queueElicitation(elicitationAttachment);

        // Wait for user response
        const response = await waitForElicitationResponse(elicitationId);

        return {
            action: response.action,
            content: response.content
        };
    });
}
```

### MCP Progress Tracking

```javascript
// ============================================
// From fetchMcpTools (JE) tool.call
// Location: chunks.170.mjs:589-629
// ============================================

// ORIGINAL (for source lookup):
if (j && J) j({
    toolUseID: J,
    data: {
        type: "mcp_progress",
        status: "started",
        serverName: A.name,
        toolName: z.name
    }
});
// ... execution ...
if (j && J) j({
    toolUseID: J,
    data: {
        type: "mcp_progress",
        status: "completed",
        serverName: A.name,
        toolName: z.name,
        duration: Date.now() - D
    }
});

// READABLE (for understanding):
// Send progress start
if (onProgress && toolUseId) {
    onProgress({
        toolUseID: toolUseId,
        data: {
            type: "mcp_progress",
            status: "started",
            serverName: connection.name,
            toolName: tool.name
        }
    });
}

// Execute tool...

// Send progress complete
if (onProgress && toolUseId) {
    onProgress({
        toolUseID: toolUseId,
        data: {
            type: "mcp_progress",
            status: "completed",
            serverName: connection.name,
            toolName: tool.name,
            duration: Date.now() - startTime
        }
    });
}
```

---

## 3. Plan Mode ↔ System Reminder Integration

### Attachment Types Generated

| Attachment Type | When Generated | Purpose |
|-----------------|----------------|---------|
| `plan_mode` | Each turn during plan mode | 5-phase workflow instructions |
| `plan_mode_reentry` | Re-entering plan mode | Brief reminder |
| `plan_mode_exit` | After exiting plan mode | Notification of mode change |
| `plan_file_reference` | After compaction | Existing plan content |

### Global State Flags

```javascript
// ============================================
// Global state managed by Dp and JS
// Location: chunks.1.mjs
// ============================================

// Global session state
v1 = {
    needsPlanModeExitAttachment: false,
    hasExitedPlanMode: false,
    // ... other state
};

// Entering plan mode: reset flag
handlePlanModeTransition(fromMode, "plan") {
    if (toMode === "plan" && fromMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = false;
    }
}

// Exiting plan mode: set flag
handlePlanModeTransition("plan", toMode) {
    if (fromMode === "plan" && toMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = true;
    }
}
```

### Plan Mode Attachment Injection

```javascript
// ============================================
// Plan mode reminder attachment generation
// ============================================

function getPlanModeAttachment(state) {
    const { mode, hasExitedPlanMode, needsPlanModeExitAttachment, turnCount } = state;

    // Not in plan mode, check for exit attachment
    if (mode !== "plan" && needsPlanModeExitAttachment) {
        return {
            type: "plan_mode_exit",
            message: "Exited plan mode. Ready to implement the plan."
        };
    }

    // In plan mode
    if (mode === "plan") {
        // First turn or every N turns
        if (turnCount % SPARSE_REMINDER_INTERVAL === 0) {
            return getFullPlanModeReminder();
        } else {
            return getSparsePlanModeReminder();
        }
    }

    return null;
}

function getFullPlanModeReminder() {
    return {
        type: "plan_mode",
        message: `You are in plan mode. Follow the 5-phase workflow:

## Phase 1: Initial Understanding
- Use Explore agents to understand the codebase
- Identify existing patterns and utilities

## Phase 2: Design
- Launch Plan agents to design implementation
- Consider multiple approaches and trade-offs

## Phase 3: Review
- Read critical files to deepen understanding
- Ensure plan aligns with user's intent

## Phase 4: Final Plan
- Write plan to ~/.claude_api/plans/<slug>.md
- Include Context, Implementation Plan, Files to Modify, Verification

## Phase 5: ExitPlanMode
- Call ExitPlanMode to request user approval
- Do NOT proceed until approved`
    };
}
```

### Turn Counting for Sparse Reminders

```javascript
// Turn counting to control reminder frequency
const SPARSE_REMINDER_INTERVAL = 5;  // Show full reminder every 5 turns

// In agent loop
turnCount++;
if (mode === "plan" && turnCount % SPARSE_REMINDER_INTERVAL === 0) {
    // Inject full plan_mode reminder
} else if (mode === "plan") {
    // Inject sparse reminder
}
```

---

## 4. Task System ↔ System Reminder Integration

### Attachment Types Generated

| Attachment Type | When Generated | Purpose |
|-----------------|----------------|---------|
| `task_status` | Task create/update/delete | State change notification |
| `task_claimed` | Task claimed by agent | Assignment notification |
| `task_completed` | Task marked complete | Dependency unblocking |
| `task_progress` | Progress during task work | Status updates |

### Task Status Attachment

```javascript
// ============================================
// Task status attachment generation
// ============================================

function createTaskStatusAttachment(task, action) {
    return {
        type: "task_status",
        action,  // "created" | "updated" | "deleted"
        taskId: task.id,
        subject: task.subject,
        status: task.status,
        owner: task.owner,
        blockedBy: task.blockedBy,
        blocks: task.blocks
    };
}

// Generated in:
// - aD1 (createTask) → action: "created"
// - WI (updateTask) → action: "updated"
// - sD1 (deleteTask) → action: "deleted"
```

### Task Claim Notification

```javascript
// ============================================
// Task claim notification for team coordination
// ============================================

function createTaskClaimedAttachment(task, owner) {
    return {
        type: "task_claimed",
        taskId: task.id,
        subject: task.subject,
        owner: owner,
        previousOwner: task.owner,  // If re-assigned
        timestamp: new Date().toISOString()
    };
}

// In claimTask (OT8):
async function claimTask(taskListId, taskId, owner) {
    // ... validation and locking ...

    const updatedTask = await updateTask(taskListId, taskId, { owner });

    // Generate notification for teammates
    if (isTeamMode()) {
        await broadcastToTeam({
            type: "task_claimed",
            taskId,
            owner
        });
    }

    return { success: true, task: updatedTask };
}
```

### Task Completed Hook Integration

```javascript
// ============================================
// TaskCompleted hooks - Pre-completion validation
// Location: chunks.175.mjs:2594
// ============================================

async function* executeTaskCompletedHooks(task) {
    const hooks = getHooksForEvent("TaskCompleted");

    for (const hook of hooks) {
        try {
            const result = await hook.execute({
                task,
                event: "TaskCompleted"
            });

            if (result.block) {
                // Hook blocked completion
                yield {
                    blocked: true,
                    reason: result.reason,
                    hookName: hook.name
                };
                return;
            }

            yield { success: true, hookName: hook.name };

        } catch (error) {
            yield {
                error: true,
                message: error.message,
                hookName: hook.name
            };
        }
    }
}
```

---

## 5. Cross-Module Integration Matrix

### Tools ↔ MCP

| Integration Point | Description |
|-------------------|-------------|
| Tool Discovery | `fetchMcpTools` (JE) creates tool objects from MCP servers |
| Tool Execution | MCP tools execute through `toolExecutionPipeline` (fxY) |
| Permission Checks | `canUseTool` applies to MCP tools |
| Deferred Loading | MCP tools can be deferred until needed |
| Annotation Mapping | MCP annotations → tool interface methods |

### Tools ↔ Plan Mode

| Integration Point | Description |
|-------------------|-------------|
| Tool Filtering | `filterToolsForPlanMode` restricts tools in plan mode |
| Path Restrictions | Write/Edit only allowed to plan file path |
| Exit Mechanism | `ExitPlanMode` is the only programmatic exit |
| AskUserQuestion | Allowed for clarification during planning |

### Tools ↔ Task System

| Integration Point | Description |
|-------------------|-------------|
| Task Tools | `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate` |
| TodoWrite Fallback | When `isTaskSystemEnabled()` is false |
| File Locking | Task operations use proper locking |
| Permission Checks | Task tools require permissions |

### Plan Mode ↔ Task System

| Integration Point | Description |
|-------------------|-------------|
| TodoWrite Preservation | Todos preserved during planning |
| Plan File Management | Plan file stored in task directory |
| Approval Workflow | ExitPlanMode can trigger task creation |
| Swarm Coordination | Teammates send plan_approval_request |

### MCP ↔ Plan Mode

| Integration Point | Description |
|-------------------|-------------|
| MCP Tools in Plan | MCP tools filtered like other tools |
| Elicitation During Plan | MCP servers can request input during planning |
| Resource Access | MCP resources readable in plan mode |

---

## 6. Integration Message Flow

### Complete Request Flow with All Modules

```
User Request
    │
    ▼
Agent Loop (Yh)
    │
    ├─▶ Check Mode (Plan Mode?)
    │       └─▶ Inject plan_mode attachment
    │
    ├─▶ Check Tasks
    │       └─▶ Inject task_status attachment
    │
    ├─▶ LLM Response (tool_use)
    │       │
    │       ▼
    │   Tool Dispatcher (Wi6)
    │       │
    │       ▼
    │   Tool Execution Pipeline (fxY)
    │       │
    │       ├─▶ Pre-tool Hooks (y4q)
    │       │       └─▶ hook_additional_context attachment
    │       │
    │       ├─▶ Permission Check (canUseTool)
    │       │       └─▶ permission_decision attachment
    │       │
    │       ├─▶ Tool Execution
    │       │       ├─▶ MCP Tool? → fetchMcpTools → executeMcpToolCall
    │       │       │       └─▶ mcp_progress attachment
    │       │       │       └─▶ elicitation attachment (if server requests)
    │       │       │
    │       │       ├─▶ Task Tool? → createTask/updateTask/claimTask
    │       │       │       └─▶ task_status attachment
    │       │       │
    │       │       └─▶ Plan Tool? → EnterPlanMode/ExitPlanMode
    │       │               └─▶ plan_mode attachment
    │       │
    │       └─▶ Post-tool Hooks (k4q)
    │               └─▶ structured_output attachment
    │
    └─▶ Return to Agent Loop
            └─▶ Continue or stop
```

---

## 7. Key Integration Functions

### normalizeAttachmentForAPI (Ui8)

```javascript
// ============================================
// normalizeAttachmentForAPI - Convert attachment to API format
// Location: chunks.174.mjs:3
// ============================================

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Ensure attachment has required fields
    return {
        type: attachment.type,
        data: attachment.data || attachment,
        isMeta: true  // Mark as non-conversational
    };
}

// Called by createUserMessage (p1) when adding attachments
```

### wrapWithSystemReminderTags (b5)

```javascript
// ============================================
// wrapWithSystemReminderTags - Wrap content in system reminder tags
// Location: chunks.173.mjs:2496
// ============================================

// READABLE (for understanding):
function wrapWithSystemReminderTags(content) {
    return `<system-reminder>
${content}
</system-reminder>`;
}
```

### createUserMessage (p1)

```javascript
// ============================================
// createUserMessage - Create message with attachments
// Location: chunks.173.mjs:1378
// ============================================

// READABLE (for understanding):
function createUserMessage(options) {
    const {
        content,
        toolUseResult,
        sourceToolAssistantUUID,
        preventContinuation,
        isMeta = false
    } = options;

    return {
        role: "user",
        content: Array.isArray(content) ? content : [{ type: "text", text: content }],
        toolUseResult,
        sourceToolAssistantUUID,
        preventContinuation,
        isMeta
    };
}
```

---

## Summary

### Key Integration Points

| Module | Primary Attachments | Integration Functions |
|--------|--------------------|-----------------------|
| 05_tools | progress, hook_additional_context, hook_blocking_error | `y4q`, `C4q`, `f4` |
| 06_mcp | elicitation, mcp_progress | `WT7`, `JE` |
| 12_plan_mode | plan_mode, plan_mode_exit | `Dp`, `JS` |
| 13_task_system | task_status, task_claimed | `aD1`, `WI`, `OT8` |

### Shared Infrastructure

| Function | Location | Purpose |
|----------|----------|---------|
| `p1` (createUserMessage) | chunks.173.mjs:1378 | Message factory with isMeta |
| `f4` (createAttachmentMessage) | chunks.*.mjs | Attachment wrapper |
| `Ui8` (normalizeAttachmentForAPI) | chunks.174.mjs:3 | API format conversion |
| `b5` (wrapWithSystemReminderTags) | chunks.173.mjs:2496 | XML wrapper for reminders |