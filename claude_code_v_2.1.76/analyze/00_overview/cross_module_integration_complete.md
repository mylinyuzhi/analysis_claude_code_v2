# Cross-Module Integration Analysis (Claude Code 2.1.76)

> Complete analysis of how Tools, MCP, Plan Mode, and Task System integrate with System Reminder and each other.

---

## Overview

This document analyzes the integration points between:
- **04_system_reminder** - The central notification/attachment system
- **05_tools** - Tool execution and permission flows
- **06_mcp** - MCP tool discovery and elicitation
- **12_plan_mode** - Planning workflow and mode transitions
- **13_task_system** - Task lifecycle and dependencies

---

## 1. System Reminder Architecture

### 1.1 Attachment Types

Each module generates specific attachment types that become system reminders:

| Module | Attachment Types | When Generated |
|--------|------------------|----------------|
| **05_tools** | `progress`, `hook_permission_decision`, `hook_additional_context`, `structured_output` | During/after tool execution |
| **06_mcp** | `mcp_progress`, `elicitation`, `mcp_meta` | During MCP operations |
| **12_plan_mode** | `plan_mode`, `plan_mode_exit` | Mode transitions |
| **13_task_system** | `task_status`, `task_claimed`, `task_completed` | Task operations |

### 1.2 Attachment Processing Flow

```
Module Event
     │
     ▼
createAttachmentMessage(type, data)
     │
     ▼
normalizeAttachmentForAPI(attachment)
     │
     ▼
wrapWithSystemReminderTags(content)
     │
     ▼
Inject into next LLM context as:
<system-reminder>
{content}
</system-reminder>
```

---

## 2. Tools ↔ System Reminder Integration

### 2.1 Tool Execution Attachments

```javascript
// During tool execution (fxY - toolExecutionPipeline)

// Progress attachment
function emitProgress(progressCallback, data) {
    progressCallback({
        toolUseID: data.toolUseID,
        data: {
            type: "progress",
            status: data.status,
            message: data.message
        }
    });
}

// Hook permission decision attachment
if (hookPermissionResult?.behavior !== "ask") {
    messages.push({
        message: createAttachmentMessage({
            type: "hook_permission_decision",
            decision: hookPermissionResult.behavior,
            toolUseID,
            hookEvent: "PreToolUse"
        })
    });
}

// Hook additional context attachment
if (hookResult.type === "additionalContext") {
    messages.push(hookResult.message);
}
```

### 2.2 Permission Flow Integration

```
Tool execution requested
        │
        ▼
┌───────────────────────┐
│ executePreToolHooks   │
│ (y4q)                 │
└───────────┬───────────┘
            │
            ▼
    ┌───────────────────┐
    │ Hook provides     │
    │ permission?       │
    └───────┬───────────┘
            │
    ┌───────┴───────┐
    │               │
   Yes             No
    │               │
    ▼               ▼
┌─────────┐   ┌──────────────┐
│ Generate│   │ canUseTool   │
│ hook_   │   │ (permission  │
│ permission│  │ check)       │
│ _decision│  └──────┬───────┘
└────┬────┘          │
     │               │
     └───────┬───────┘
             │
             ▼
    ┌────────────────────┐
    │ Permission denied? │
    └────────┬───────────┘
             │
        ┌────┴────┐
        │         │
       Yes       No
        │         │
        ▼         ▼
┌──────────────┐ ┌──────────────┐
│ Generate     │ │ Execute tool │
│ error        │ │              │
│ attachment   │ └──────┬───────┘
└──────────────┘        │
                        ▼
                ┌──────────────┐
                │ Generate     │
                │ success      │
                │ attachment   │
                └──────────────┘
```

---

## 3. MCP ↔ System Reminder Integration

### 3.1 MCP Progress Tracking

```javascript
// MCP tool execution progress
const mcpProgressEvents = [
    { type: "mcp_progress", status: "started" },
    { type: "mcp_progress", status: "completed" },
    { type: "mcp_progress", status: "failed" }
];

// Progress event structure
{
    type: "mcp_progress",
    status: "started" | "completed" | "failed",
    serverName: string,
    toolName: string,
    elapsedTimeMs?: number
}
```

### 3.2 Elicitation Integration

```javascript
// Elicitation as attachment type
const elicitationAttachment = {
    type: "elicitation",
    serverName: "oauth-server",
    mode: "form" | "url",
    requestedSchema: { /* JSON Schema */ },
    uris: ["https://auth.example.com/oauth"],
    requestId: "unique-id"
};

// Elicitation result becomes system reminder
function handleElicitationResult(result) {
    return createAttachmentMessage({
        type: "elicitation_result",
        requestId: result.requestId,
        action: result.action,  // "accept" | "decline" | "cancel"
        content: result.content  // User-provided data
    });
}
```

---

## 4. Plan Mode ↔ System Reminder Integration

### 4.1 Plan Mode Entry Attachment

```javascript
// Generated when entering plan mode (EnterPlanMode)
const planModeAttachment = {
    type: "plan_mode",
    planFilePath: "~/.claude_api/plans/session-slug.md",
    isSubAgent: false,
    reminderType: "full" | "sparse",
    turnCount: 0,
    iterativeMode: false
};

// Attachment variants
function planModeReminderDispatcher(attachment) {
    if (attachment.isSubAgent) {
        return formatSubagentPlanReminder(attachment);  // Brief
    }
    if (attachment.reminderType === "sparse") {
        return formatSparsePlanReminder(attachment);    // Short reminder
    }
    if (attachment.iterativeMode) {
        return formatIterativePlanReminder(attachment); // Pair-planning
    }
    return formatFullPlanReminder(attachment);          // 5-phase workflow
}
```

### 4.2 Plan Mode Exit Attachment

```javascript
// Generated when exiting plan mode (ExitPlanMode)
const planExitAttachment = {
    type: "plan_mode_exit",
    planFilePath: "~/.claude_api/plans/session-slug.md",
    planContent: "## Plan: ...",
    isApproved: true,
    restoreMode: "default"
};

// Turn counting for sparse reminders
let turnCount = 0;
function injectPlanModeReminder() {
    if (turnCount < 3) {
        // Full reminder for first 3 turns
        return formatFullPlanReminder();
    } else {
        // Sparse reminder after 3 turns
        return formatSparsePlanReminder();
    }
}
```

---

## 5. Task System ↔ System Reminder Integration

### 5.1 Task Status Attachments

```javascript
// Task creation
function onTaskCreated(task) {
    return createAttachmentMessage({
        type: "task_status",
        action: "created",
        taskId: task.id,
        subject: task.subject,
        status: task.status
    });
}

// Task update
function onTaskUpdated(task, changes) {
    return createAttachmentMessage({
        type: "task_status",
        action: "updated",
        taskId: task.id,
        changes: {
            status: changes.status,
            owner: changes.owner
        }
    });
}

// Task completion (triggers hooks)
function onTaskCompleted(task) {
    return createAttachmentMessage({
        type: "task_completed",
        taskId: task.id,
        completedBy: task.owner,
        completedAt: new Date().toISOString()
    });
}
```

### 5.2 Task Claimed Attachment

```javascript
// When task is claimed
function onTaskClaimed(task, agentId) {
    return createAttachmentMessage({
        type: "task_claimed",
        taskId: task.id,
        claimedBy: agentId,
        previousOwner: task.owner
    });
}

// Claim failure reasons
const claimFailureReasons = {
    "task_not_found": "Task does not exist",
    "already_claimed": "Task already claimed by another agent",
    "already_resolved": "Task is already completed",
    "blocked": "Task has incomplete dependencies"
};
```

---

## 6. Cross-Module Interaction Flows

### 6.1 Plan Mode → Tools → Task System

```
User: /plan implement user authentication
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ EnterPlanMode tool called                                 │
│   └─ Generate plan_mode attachment                        │
│   └─ Set mode = "plan"                                    │
└───────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ Tool filtering active                                      │
│   └─ Only read-only tools allowed                         │
│   └─ Write/Edit restricted to plan file                   │
└───────────────────────────────────────────────────────────┘
        │
        ▼
[Agent explores codebase and writes plan]
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ ExitPlanMode tool called                                  │
│   └─ Show approval dialog                                 │
│   └─ User approves                                        │
│   └─ Generate plan_mode_exit attachment                   │
│   └─ Restore mode = "default"                             │
└───────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ TaskCreate tool called (optional)                         │
│   └─ Create tasks from plan steps                         │
│   └─ Generate task_status attachments                     │
└───────────────────────────────────────────────────────────┘
```

### 6.2 MCP Tool → Elicitation → Permission Flow

```
User requests MCP tool execution
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ Tool discovery (fetchMcpTools)                            │
│   └─ Check server connected                               │
│   └─ Build tool objects with annotations                  │
└───────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ Permission check (canUseTool)                             │
│   └─ Check readOnlyHint annotation                        │
│   └─ Check permission rules                               │
│   └─ Show dialog if needed                                │
└───────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ Tool execution (executeMcpToolCall)                       │
│   └─ Emit mcp_progress (started)                          │
│   └─ Call tools/call JSON-RPC                             │
│   └─ If elicitation required:                             │
│       └─ Show elicitation dialog                          │
│       └─ Wait for user response                           │
│       └─ Continue with elicitation result                 │
│   └─ Emit mcp_progress (completed/failed)                 │
└───────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│ Result processing                                          │
│   └─ Handle binary content (PDF, images)                  │
│   └─ Generate structured_output attachment                │
│   └─ Generate mcp_meta attachment                         │
└───────────────────────────────────────────────────────────┘
```

### 6.3 Swarm Plan Approval Flow

```
Teammate Agent                    Team Lead Agent
      │                                  │
      │ EnterPlanMode                    │
      │ (plan mode active)               │
      │                                  │
      │ ExitPlanMode                     │
      │                                  │
      ├──── plan_approval_request ──────►│
      │   {type, from, planContent,      │
      │    planFilePath, requestId}      │
      │                                  │
      │                          ┌───────┴───────┐
      │                          │ Show approval │
      │                          │ dialog to     │
      │                          │ user          │
      │                          └───────┬───────┘
      │                                  │
      │◄──── plan_approval_response ────┤
      │   {approved: true/false,         │
      │    feedback: "..."}              │
      │                                  │
      │ If approved:                     │
      │   └─ Restore mode                │
      │   └─ Proceed with implementation │
      │                                  │
      │ If rejected:                     │
      │   └─ Stay in plan mode           │
      │   └─ Revise plan                 │
      │                                  │
```

---

## 7. Attachment Normalization

### 7.1 Core Functions

```javascript
// Main normalization entry point
function normalizeAttachmentForAPI(attachment) {
    return {
        type: attachment.type,
        content: serializeAttachmentContent(attachment),
        metadata: extractAttachmentMetadata(attachment)
    };
}

// Wrap with system reminder tags
function wrapWithSystemReminderTags(content) {
    return `<system-reminder>\n${content}\n</system-reminder>`;
}

// Create user message with attachments
function createUserMessage({ content, toolUseResult, mcpMeta, sourceToolAssistantUUID }) {
    return {
        type: "message",
        role: "user",
        content: Array.isArray(content) ? content : [{ type: "text", text: content }],
        toolUseResult,
        mcpMeta,
        sourceToolAssistantUUID
    };
}
```

### 7.2 Attachment Type Handlers

```javascript
const attachmentHandlers = {
    progress: (data) => formatProgressAttachment(data),
    hook_permission_decision: (data) => formatHookPermissionDecision(data),
    hook_additional_context: (data) => formatHookContext(data),
    structured_output: (data) => formatStructuredOutput(data),
    mcp_progress: (data) => formatMcpProgress(data),
    elicitation: (data) => formatElicitation(data),
    plan_mode: (data) => formatPlanModeReminder(data),
    plan_mode_exit: (data) => formatPlanExitReminder(data),
    task_status: (data) => formatTaskStatus(data),
    task_claimed: (data) => formatTaskClaimed(data),
    task_completed: (data) => formatTaskCompleted(data)
};
```

---

## 8. Configuration Integration

### 8.1 Permission Rules

```json
{
    "permissions": {
        "allow": ["Read", "Glob", "Grep"],
        "deny": ["Bash:rm -rf*"],
        "rules": [
            {
                "toolName": "mcp__sqlite__query",
                "ruleContent": "Allow read-only queries"
            }
        ]
    }
}
```

### 8.2 Mode Configuration

```javascript
const MODE_CONFIGURATION = {
    plan: {
        displayName: "Plan Mode",
        statusText: "⏸ Plan Mode on (shift+tab)",
        allowedTools: ["Read", "Glob", "Grep", "Write:planFile", "Edit:planFile", "ExitPlanMode", "AskUserQuestion"]
    },
    auto: {
        displayName: "Auto Mode",
        autoApprove: true,
        requiresGate: true
    }
};
```

---

## Cross-Reference

- [tool_reminder_integration.md](../05_tools/tool_reminder_integration.md) - Tools integration
- [mcp_reminder_integration.md](../06_mcp/mcp_reminder_integration.md) - MCP integration
- [reminder_system.md](../12_plan_mode/reminder_system.md) - Plan mode integration
- [task_reminder_integration.md](../13_task_system/task_reminder_integration.md) - Task integration
- [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Symbol mappings