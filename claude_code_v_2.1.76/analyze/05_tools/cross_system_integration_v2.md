# Cross-System Integration: Tools, MCP, Plan Mode, Tasks (Claude Code 2.1.76)

> Complete analysis of how 05_tools, 06_mcp, 12_plan_mode, and 13_task_system integrate with 04_system_reminder and each other.

---

## Overview

This document maps the integration points between the four key modules and the system reminder infrastructure. All four modules generate attachments that are normalized and injected into the LLM conversation.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SYSTEM REMINDER INJECTION                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Attachment Producers (phY - assembleAttachments)              │  │
│  │                                                                 │  │
│  │  05_tools:                                                      │  │
│  │  ├─ progress (U1q) - Tool execution progress                   │  │
│  │  ├─ hook_additional_context (kq) - Pre-hook context            │  │
│  │  ├─ hook_blocking_error - Hook denial                          │  │
│  │  └─ task_status - Background task changes                      │  │
│  │                                                                 │  │
│  │  06_mcp:                                                        │  │
│  │  ├─ mcp_tool_result - MCP tool execution result                │  │
│  │  ├─ mcp_resource_update - Resource change notification         │  │
│  │  └─ elicitation - Server request for user input                │  │
│  │                                                                 │  │
│  │  12_plan_mode:                                                  │  │
│  │  ├─ plan_mode (DuY) - Planning instructions                    │  │
│  │  └─ plan_mode_exit (XuY) - Exit confirmation                   │  │
│  │                                                                 │  │
│  │  13_task_system:                                                │  │
│  │  ├─ task_status - Task state changes                           │  │
│  │  └─ task_assignment - Owner assignment notification            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Normalization (K2z - normalizeAttachmentForAPI)               │  │
│  │                                                                 │  │
│  │  • Convert 57 attachment types to message format               │  │
│  │  • Wrap content in <system-reminder> tags (_9)                 │  │
│  │  • Dispatch to type-specific formatters                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                           │                                          │
│                           ▼                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Message Injection (bG1 - buildContextMessages)                │  │
│  │                                                                 │  │
│  │  • Insert normalized attachments into message array            │  │
│  │  • Position before user messages in API calls                  │  │
│  │  • Integrate with system prompt building                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Module Integration Details

### 05_tools ↔ 04_system_reminder

**Attachment Types Produced:**

| Type | Producer Function | Trigger |
|------|-------------------|---------|
| `progress` | `createToolProgressMessage` (U1q) | Long-running tool execution |
| `hook_additional_context` | `createHookMessage` (kq) | PreToolUse hook provides context |
| `hook_blocking_error` | `createHookMessage` (kq) | PreToolUse hook denies execution |
| `hook_stopped_continuation` | `createHookMessage` (kq) | PostToolUse hook stops agent loop |
| `task_status` | Task management tools | Background task state change |

**Code Flow:**

```javascript
// In tool execution pipeline (fxY)
// Stage 3: Pre-tool hooks
for await (let hookEvent of executePreToolHooksIterator(...)) {
  if (hookEvent.message) {
    hookMessages.push(hookEvent.message);  // Creates attachment
  }
}

// Attachment creation
function createHookMessage(attachmentData) {
  return {
    attachment: attachmentData,
    type: "attachment",
    uuid: generateUuid(),
    timestamp: new Date().toISOString()
  };
}
```

### 06_mcp ↔ 04_system_reminder

**Attachment Types Produced:**

| Type | Trigger | Content |
|------|---------|---------|
| `elicitation` | MCP server requests input | Form schema or OAuth URL |
| `mcp_tool_result` | MCP tool execution | Tool result data |
| `mcp_resource_update` | Resource subscription fires | Updated resource content |

**Elicitation Queue Processing:**

```javascript
// Modal priority (lowest for elicitation)
function getCurrentModal(appState) {
  if (appState.sandboxPermissionQueue[0]) return "sandbox-permission";
  if (appState.pendingToolRequest) return "tool-permission";
  if (appState.workerSandboxQueue[0]) return "worker-sandbox-permission";
  if (appState.elicitation.queue[0]) return "elicitation";  // Lowest
  return null;
}
```

### 12_plan_mode ↔ 04_system_reminder

**Attachment Types Produced:**

| Type | Producer Function | Content |
|------|-------------------|---------|
| `plan_mode` | `getPlanModeAttachment` (DuY) | Planning instructions |
| `plan_mode_exit` | `getPlanModeExitAttachment` (XuY) | Exit confirmation |

**Plan Mode Attachment Variants:**

```javascript
function planModeReminderDispatcher(attachment) {
  if (attachment.isSubAgent) return formatSubagentPlanReminder(attachment);
  if (attachment.reminderType === "sparse") return formatSparsePlanReminder(attachment);
  if (attachment.iterativeMode) return formatIterativePlanReminder(attachment);
  return formatFullPlanReminder(attachment);
}
```

**Turn Counting for Sparse Reminders:**

```javascript
// Sparse reminder shown most turns (not full instructions)
let planModeTurnCount = countPreviousPlanReminders(messages);

if (planModeTurnCount === 0) {
  // First reminder - full instructions
  attachment.reminderType = "full";
} else if (planModeTurnCount % SPARSE_INTERVAL === 0) {
  // Every Nth turn - full instructions
  attachment.reminderType = "full";
} else {
  // Most turns - sparse reminder
  attachment.reminderType = "sparse";
}
```

### 13_task_system ↔ 04_system_reminder

**Attachment Types Produced:**

| Type | Trigger | Content |
|------|---------|---------|
| `task_status` | Task status change | Task ID, new status, owner |
| `task_assignment` | Owner set in team mode | Task ID, assigned by, timestamp |

**Task Assignment Notification:**

```javascript
// In TaskUpdate tool
if (updates.owner && isTeamMode()) {
  await writeToMailbox(updates.owner, {
    from: getCurrentAgentName() || "team-lead",
    text: JSON.stringify({
      type: "task_assignment",
      taskId: taskId,
      subject: task.subject,
      description: task.description
    }),
    timestamp: new Date().toISOString()
  }, taskManager);
}
```

---

## Cross-Module Dependencies

### Tools ↔ MCP Integration

```javascript
// MCP tools are discovered and registered with prefix
async function fetchMcpTools(mcpClient) {
  const response = await mcpClient.client.request({ method: "tools/list" });

  return response.tools.map(tool => ({
    name: `mcp__${mcpClient.name}__${tool.name}`,
    isMcp: true,
    async call(args, context) {
      return await callMcpTool(mcpClient, tool.name, args);
    }
  }));
}
```

### Tools ↔ Plan Mode Integration

```javascript
// Tool filtering in plan mode
function filterToolsForPlanMode(tools, planFilePath) {
  return tools.filter(tool => {
    if (tool.isReadOnly?.()) return true;
    if (["ExitPlanMode", "EnterPlanMode", "AskUserQuestion"].includes(tool.name)) return true;
    if (tool.name === "Write" || tool.name === "Edit") {
      // Path checked at execution time
      return true;
    }
    return false;
  });
}
```

### Plan Mode ↔ Task System Integration

```javascript
// Plan mode clears tasks on exit
function handlePlanModeExit(approved) {
  if (approved) {
    // Preserve todo/task state during plan mode exit
    // Tasks created during planning persist for implementation
  } else {
    // Clear conversation, but tasks remain
    clearConversation();
  }
}
```

### Task System ↔ Team Integration

```javascript
// Task claiming with agent busy validation
async function claimTaskWithAgentBusyValidation(taskManager, taskId, agentName, checkBusy) {
  if (checkBusy) {
    const inProgressTasks = await getInProgressTasksForAgent(agentName);
    if (inProgressTasks.length > 0) {
      return { success: false, error: "Agent already has in-progress tasks" };
    }
  }
  // Proceed with claim
}
```

---

## State Synchronization

### Global State Fields

| Field | Module | Purpose |
|-------|--------|---------|
| `mode` | Plan Mode | Current permission mode |
| `prePlanMode` | Plan Mode | Mode to restore on exit |
| `hasExitedPlanMode` | Plan Mode | Exit flag for attachment |
| `needsPlanModeExitAttachment` | Plan Mode | Generate exit attachment |
| `planFilePath` | Plan Mode | Path to plan file |
| `elicitation.queue` | MCP | Pending elicitation requests |
| `tasks` | Task System | Current task list |
| `expandedView` | UI | Current expanded panel |

### State Change Propagation

```javascript
// Mode transition hook
function handlePlanModeTransition(fromMode, toMode) {
  if (toMode === "plan" && fromMode !== "plan") {
    globalSessionState.needsPlanModeExitAttachment = false;
  }
  if (fromMode === "plan" && toMode !== "plan") {
    globalSessionState.needsPlanModeExitAttachment = true;
  }
}
```

---

## Attachment Normalization

### Complete Normalization Flow

```javascript
// 1. Assemble all attachments
async function assembleAttachments(sessionState, messages, toolUseContext) {
  const attachments = [];

  // From tools
  attachments.push(...collectToolAttachments(messages));

  // From MCP
  attachments.push(...collectMcpAttachments(sessionState.elicitation.queue));

  // From plan mode
  if (sessionState.mode === "plan") {
    attachments.push(await getPlanModeAttachment(sessionState));
  }

  // From tasks
  attachments.push(...collectTaskAttachments(sessionState.tasks));

  return attachments;
}

// 2. Normalize each attachment
function normalizeAttachmentForAPI(attachment) {
  const content = formatAttachmentContent(attachment);

  return {
    type: "user",
    message: {
      role: "user",
      content: wrapInSystemReminderTags(content)
    },
    isMeta: true,
    uuid: generateUuid(),
    timestamp: new Date().toISOString()
  };
}

// 3. Inject into message array
function buildContextMessages(messages, attachments) {
  const normalizedAttachments = attachments.map(normalizeAttachmentForAPI);

  // Position: before the last user message
  return [...normalizedAttachments, ...messages];
}
```

---

## Telemetry Integration

### Events Emitted by Integration

| Event | Module | Data |
|-------|--------|------|
| `tengu_attachments` | System Reminder | attachment_types array |
| `tengu_tool_use_progress` | Tools | tool name, progress data |
| `tengu_tool_use_can_use_tool_allowed` | Tools/Permissions | tool name, decision source |
| `mcp_elicitation_created` | MCP | server name, type (form/url) |
| `plan_mode_enter` | Plan Mode | previous mode |
| `plan_mode_exit` | Plan Mode | approved flag |
| `task_status_change` | Task System | task ID, old/new status |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Cross-system integration matrix, unified attachment handling |
| 2.1.72 | Elicitation system integration with MCP |
| 2.1.32 | Team integration with task assignments |
| 2.1.18 | Plan mode sparse reminder optimization |