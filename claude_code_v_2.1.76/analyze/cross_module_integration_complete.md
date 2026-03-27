# Cross-Module Integration Matrix (Claude Code 2.1.76)

> **Complete integration analysis** for Tools (05), MCP (06), Plan Mode (12), and Task System (13) with System Reminder (04) integration.

---

## Integration Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CROSS-MODULE INTEGRATION ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    04_system_reminder (Hub)                          │    │
│  │                                                                       │    │
│  │  All modules generate attachments → System Reminder normalizes       │    │
│  │  → LLM receives contextual messages                                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│       ▲           ▲           ▲           ▲                                   │
│       │           │           │           │                                   │
│       │           │           │           │                                   │
│  ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌────┴────┐                             │
│  │ 05_tools│ │ 06_mcp  │ │12_plan  │ │13_tasks│                             │
│  │         │ │         │ │         │ │         │                             │
│  │ -progress│ │ -mcp_  │ │ -plan_  │ │ -task_  │                             │
│  │ -hooks   │ │   res   │ │   mode  │ │   status│                             │
│  │ -perms   │ │ -elicit │ │ -plan_  │ │ -claim  │                             │
│  │          │ │ -progress│ │   exit  │ │ -progress│                            │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                             │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tools (05) ↔ System Reminder (04)

### Attachment Types Generated

| Type | Trigger | Content |
|------|---------|---------|
| `progress` | Tool progress callback | Streaming updates |
| `hook_additional_context` | PreToolUse hook | Context for LLM |
| `hook_blocking_error` | Hook denial | Error message |
| `hook_permission_decision` | Hook provided permission | Decision details |
| `hook_stopped_continuation` | Hook stopped execution | Stop reason |
| `structured_output` | Tool returned structured data | Data content |
| `hook_cancelled` | Hook cancelled | Cancellation notice |
| `hook_error_during_execution` | Hook error | Error details |

### Integration Flow

```
Tool execution (fxY)
    │
    ├─→ Pre-tool hooks (y4q)
    │     │
    │     ├─→ hook_additional_context
    │     │     └─→ f4({ type: "hook_additional_context", ... })
    │     │
    │     └─→ hook_permission_result
    │           └─→ Attachment for permission bypass
    │
    ├─→ Tool call
    │     │
    │     └─→ Progress callback
    │           └─→ C4q({ type: "progress", ... })
    │
    └─→ Post-tool hooks (k4q)
          └─→ Additional attachments
```

### Key Functions

```javascript
// Create attachment message
f4({ type: "hook_additional_context", content, hookName, toolUseID, hookEvent })

// Create progress message
C4q({ toolUseID, parentToolUseID, data })

// Create user message with isMeta
p1({ content, toolUseResult, sourceToolAssistantUUID })
```

---

## MCP (06) ↔ System Reminder (04)

### Attachment Types Generated

| Type | Trigger | Content |
|------|---------|---------|
| `mcp_resource` | Resource read | Resource content |
| `elicitation` | Server requests input | Form schema or URL |
| `elicitation_result` | User response | Response data |
| `mcp_progress` | Tool execution | Status updates |
| `mcp_instructions_delta` | Server instructions changed | New instructions |

### Elicitation Integration

```
MCP Tool execution
    │
    ├─→ Server calls elicitation/create
    │     │
    │     └─→ handleElicitation(sessionContext)
    │           │
    │           ├─→ Form mode: Show dialog
    │           │     └─→ User fills form
    │           │           └─→ Return elicitation_result
    │           │
    │           └─→ URL mode: Show URL button
    │                 └─→ User visits URL
    │                       └─→ Return elicitation_result
    │
    └─→ Tool execution continues
```

### Binary Content Handling

When MCP tools return binary content (PDFs, images, audio):

```javascript
// Large binaries saved to disk, path returned
if (isBinaryContent(result)) {
    const savedPath = await saveBinaryToDisk(result);
    // Attachment references file path instead of inline content
}
```

---

## Plan Mode (12) ↔ System Reminder (04)

### Attachment Types Generated

| Type | Trigger | Content |
|------|---------|---------|
| `plan_mode` | Enter plan mode | Full 5-phase workflow |
| `plan_mode_reentry` | Already in plan mode | Brief reminder |
| `plan_mode_exit` | Exit plan mode | Exit notification |
| `plan_file_reference` | Post-compact | Plan file content |

### Plan Mode Attachment Variants

```javascript
// Variant selection based on context:
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

### Plan Mode Reminder Content

```markdown
<system-reminder>
Plan mode is active. You should:
1. Thoroughly explore the codebase...
2. Identify similar features...
3. Consider multiple approaches...
4. Use AskUserQuestion if you need clarification...
5. Design a concrete implementation strategy...
6. When ready, use ExitPlanMode to present your plan for approval.

Remember: DO NOT write or edit any files yet.
</system-reminder>
```

### State Tracking

```javascript
// Global flags for plan mode state
hasExitedPlanMode: boolean;              // Set on exit
needsPlanModeExitAttachment: boolean;    // Set when leaving plan mode

// Mode transition hook
function handlePlanModeTransition(fromMode, toMode) {
    if (toMode === "plan" && fromMode !== "plan") {
        // Entering plan mode: reset exit attachment flag
        globalSessionState.needsPlanModeExitAttachment = false;
    }
    if (fromMode === "plan" && toMode !== "plan") {
        // Leaving plan mode: mark need for exit attachment
        globalSessionState.needsPlanModeExitAttachment = true;
    }
}
```

---

## Task System (13) ↔ System Reminder (04)

### Attachment Types Generated

| Type | Trigger | Content |
|------|---------|---------|
| `task_status` | Task create/update/delete | Task state change |
| `task_claimed` | Task assignment | Owner info |
| `task_completed` | Task completion | Completion status |
| `task_progress` | Task execution | Progress messages |
| `todo` | TodoWrite tool | Todo list state |
| `todo_reminder` | Periodic | Todo reminder |

### Task Status Attachment Format

```javascript
// Task status attachment
{
    type: "task_status",
    action: "created" | "updated" | "deleted",
    taskId: "1",
    task: {
        id: "1",
        subject: "Implement login UI",
        status: "in_progress",
        owner: "agent-1",
        blockedBy: [],
        blocks: ["2", "3"]
    }
}

// Task claimed attachment
{
    type: "task_claimed",
    taskId: "1",
    owner: "agent-1",
    previousOwner: null
}
```

### Turn-Based Reminder

```javascript
// Todo reminder shown periodically
// Throttled by turn count to avoid noise
if (turnCount % TODO_REMINDER_INTERVAL === 0) {
    // Generate todo_reminder attachment
}
```

---

## Tools ↔ MCP Integration

### MCP Tool Discovery

```javascript
// MCP tools discovered and registered
const mcpTools = await fetchMcpTools(clientConnection);

// Tool names prefixed with mcp__
// Example: mcp__sqlite__query

// MCP tools go through standard pipeline
for await (const result of toolExecutionPipeline(mcpTool, ...)) {
    // Same 8-stage pipeline as built-in tools
}
```

### Session Recovery

```javascript
// MCP tools have retry logic for session loss
for (let attempt = 0; ; attempt++) {
    try {
        const client = await getMcpClientConnection(clientConnection);
        const result = await executeMcpToolCall({ client, ... });
        return result;
    } catch (error) {
        if (error instanceof McpSessionLostError && attempt < maxRetries) {
            // Reconnect and retry
            continue;
        }
        throw error;
    }
}
```

---

## Tools ↔ Plan Mode Integration

### Tool Filtering in Plan Mode

```javascript
// Only certain tools allowed in plan mode
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
        // Path checked at execution time
        if (tool.name === "Write" || tool.name === "Edit") return true;

        // Block all other tools
        return false;
    });
}
```

### Path Restriction for Write/Edit

```javascript
// In tool execution, check path against plan file
async function validatePlanModePath(filePath, planFilePath) {
    if (mode !== "plan") return true;

    const normalizedPath = normalizePath(filePath);
    const normalizedPlanPath = normalizePath(planFilePath);

    if (normalizedPath !== normalizedPlanPath) {
        throw new Error(
            `In plan mode, you can only write to the plan file: ${planFilePath}`
        );
    }
}
```

---

## Tools ↔ Task System Integration

### Task Tools

```javascript
// Task tools defined in 05_tools
const taskTools = [
    TaskCreateTool,   // TR = "TaskCreate"
    TaskUpdateTool,   // ck = "TaskUpdate"
    TaskGetTool,      // lt = "TaskGet"
    TaskListTool,     // it = "TaskList"
    TodoWriteTool     // MB = "TodoWrite"
];
```

### Task Execution Integration

```javascript
// Task tools use the same execution pipeline
for await (const result of toolExecutionPipeline(TaskCreateTool, ...)) {
    // Same validation, hooks, permissions
}

// Task operations generate system reminders
await createTask(taskListId, taskData);
// Generates task_status attachment
```

### Claim Validation

```javascript
// Task claiming integrates with task system
async function claimTask(taskListId, taskId, owner) {
    // 1. Verify task exists
    // 2. Check not already claimed
    // 3. Check not already completed
    // 4. Check dependencies completed
    // 5. Set owner
    // Generates task_claimed attachment
}
```

---

## Plan Mode ↔ Task System Integration

### Team Plan Approval

```javascript
// Swarm teammate plan approval
if (isSwarmTeammate() && isTeamFeaturesEnabled()) {
    // Send plan_approval_request to team-lead
    await writeToMailbox("team-lead", {
        from: agentName,
        text: JSON.stringify({
            type: "plan_approval_request",
            planContent,
            planFilePath,
            requestId
        })
    });

    // Wait for approval in inbox
    // team-lead reviews and sends plan_approval_response
}
```

### Task Assignment from Plan

```javascript
// After plan approval, tasks can be created
if (planApproved && hasTaskTool) {
    // Suggest using TaskCreate tool for parallel work
    // Plan may contain task breakdown
}
```

---

## Integration Summary Matrix

| Source Module | Target Module | Integration Type | Key Functions |
|---------------|---------------|------------------|---------------|
| 05_tools | 04_system_reminder | Attachments | `f4`, `C4q`, `p1` |
| 06_mcp | 04_system_reminder | Attachments | elicitation, progress |
| 12_plan_mode | 04_system_reminder | Attachments | plan_mode, plan_mode_exit |
| 13_task_system | 04_system_reminder | Attachments | task_status, task_claimed |
| 06_mcp | 05_tools | Tool registration | `JE` (fetchMcpTools) |
| 05_tools | 12_plan_mode | Tool filtering | `filterToolsForPlanMode` |
| 05_tools | 13_task_system | Task tools | TaskCreate, TaskUpdate |
| 12_plan_mode | 13_task_system | Plan approval | Swarm plan_approval |

---

## Attachment Type Complete Reference

### Tools Attachments
- `progress` - Tool progress streaming
- `hook_additional_context` - Hook context injection
- `hook_blocking_error` - Hook denial
- `hook_permission_decision` - Permission from hook
- `hook_stopped_continuation` - Hook stopped
- `structured_output` - Structured data
- `hook_cancelled` - Hook cancelled
- `hook_error_during_execution` - Hook error

### MCP Attachments
- `mcp_resource` - Resource content
- `elicitation` - Server input request
- `elicitation_result` - User response
- `mcp_progress` - Tool progress
- `mcp_instructions_delta` - Instruction changes

### Plan Mode Attachments
- `plan_mode` - Full workflow
- `plan_mode_reentry` - Brief reminder
- `plan_mode_exit` - Exit notification
- `plan_file_reference` - Plan content

### Task System Attachments
- `task_status` - State changes
- `task_claimed` - Assignment
- `task_completed` - Completion
- `task_progress` - Progress
- `todo` - Todo state
- `todo_reminder` - Periodic reminder