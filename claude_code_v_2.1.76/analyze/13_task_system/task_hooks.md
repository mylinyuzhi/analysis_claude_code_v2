# Task System - Task Hooks Integration (Claude Code 2.1.76)

> Complete analysis of how task status changes trigger hooks and notifications.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Task System section
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Hooks section

Key functions in this document:
- `executeTaskCompletedHooks` (Hi6) - chunks.175.mjs:2594
- `getTaskCompletedHookMessage` ($i6) - chunks.175.mjs:1602

---

## Overview

The Task System integrates with the Hooks system to trigger notifications when tasks are completed. This enables external systems to react to task state changes.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TASK HOOKS INTEGRATION                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  TaskUpdate tool called                                             │
│     │                                                                 │
│     ├─→ status = "completed" ?                                       │
│     │     │                                                           │
│     │     └─→ executeTaskCompletedHooks (Hi6)                       │
│     │           │                                                     │
│     │           ├─→ Find hooks matching TaskCompleted event         │
│     │           │                                                     │
│     │           ├─→ Build hook message (getTaskCompletedHookMessage)│
│     │           │     ├─→ Task ID                                    │
│     │           │     ├─→ Subject                                    │
│     │           │     ├─→ Owner                                      │
│     │           │     └─→ Completion timestamp                       │
│     │           │                                                     │
│     │           ├─→ Execute each matching hook                      │
│     │           │     ├─→ Spawn hook process                        │
│     │           │     ├─→ Pass JSON message via stdin               │
│     │           │     └─→ Collect stdout response                   │
│     │           │                                                     │
│     │           └─→ Process hook results                            │
│     │                 ├─→ Notifications generated                   │
│     │                 └─→ Errors logged                              │
│     │                                                                 │
│     └─→ Task state persisted                                         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Hook Trigger Conditions

### TaskCompleted Event

Hooks are triggered when:

```javascript
// Trigger condition
if (update.status === "completed" && previousStatus !== "completed") {
  // Task just transitioned to completed
  await executeTaskCompletedHooks(task, context);
}
```

### Hook Configuration

```json
{
  "hooks": {
    "TaskCompleted": [
      {
        "matcher": {
          "owner": "*"  // Match all owners
        },
        "hooks": ["./notify-completion.sh"]
      }
    ]
  }
}
```

---

## Hook Message Format

### getTaskCompletedHookMessage ($i6)

Builds the JSON message passed to hook processes:

```javascript
// ============================================
// getTaskCompletedHookMessage - Build task completed hook message
// Location: chunks.175.mjs:1602-1650
// ============================================

function getTaskCompletedHookMessage(task, context) {
  return {
    // Event type
    event: "TaskCompleted",

    // Task identification
    taskId: task.id,
    subject: task.subject,
    description: task.description,

    // Ownership
    owner: task.owner || null,

    // Timestamps
    completedAt: new Date().toISOString(),
    createdAt: task.createdAt,

    // Context
    teamName: context.teamName,
    sessionName: context.sessionName,

    // Dependencies resolved
    blockedBy: task.blockedBy || [],
    blocks: task.blocks || [],

    // Metadata
    metadata: task.metadata || {}
  };
}
```

### Example Message

```json
{
  "event": "TaskCompleted",
  "taskId": "5",
  "subject": "Implement user authentication",
  "description": "Add OAuth2 login flow with Google and GitHub providers",
  "owner": "developer-agent",
  "completedAt": "2024-03-27T10:30:00.000Z",
  "createdAt": "2024-03-27T09:00:00.000Z",
  "teamName": "auth-team",
  "sessionName": "auth-implementation",
  "blockedBy": ["1", "2"],
  "blocks": ["10"],
  "metadata": {
    "priority": "high",
    "estimatedHours": 4
  }
}
```

---

## Hook Execution

### executeTaskCompletedHooks (Hi6)

```javascript
// ============================================
// executeTaskCompletedHooks - Execute hooks on task completion
// Location: chunks.175.mjs:2594-2650
// ============================================

async function* executeTaskCompletedHooks(task, context) {
  // Find matching hooks
  const hookConfigs = findHooksForEvent("TaskCompleted");

  if (hookConfigs.length === 0) {
    return;  // No hooks configured
  }

  // Build hook message
  const message = getTaskCompletedHookMessage(task, context);

  for (const hookConfig of hookConfigs) {
    // Check matcher conditions
    if (hookConfig.matcher) {
      if (!matchesTaskCondition(task, hookConfig.matcher)) {
        continue;  // Skip this hook
      }
    }

    // Execute each hook in the chain
    for (const hookPath of hookConfig.hooks) {
      try {
        const result = await executeHook(hookPath, message);

        if (result.notification) {
          // Hook wants to send a notification
          yield {
            type: "hook_notification",
            content: result.notification
          };
        }

        if (result.preventContinuation) {
          // Hook wants to stop processing
          yield {
            type: "hook_stopped",
            reason: result.reason
          };
          return;
        }
      } catch (error) {
        // Log error but continue with other hooks
        console.error(`Hook ${hookPath} failed:`, error);
      }
    }
  }
}
```

---

## Matcher Conditions

### Task Property Matchers

```javascript
function matchesTaskCondition(task, matcher) {
  // Match by owner
  if (matcher.owner && matcher.owner !== "*") {
    if (task.owner !== matcher.owner) return false;
  }

  // Match by subject pattern
  if (matcher.subject) {
    const regex = new RegExp(matcher.subject);
    if (!regex.test(task.subject)) return false;
  }

  // Match by metadata
  if (matcher.metadata) {
    for (const [key, value] of Object.entries(matcher.metadata)) {
      if (task.metadata?.[key] !== value) return false;
    }
  }

  // Match by team
  if (matcher.teamName && matcher.teamName !== "*") {
    if (context.teamName !== matcher.teamName) return false;
  }

  return true;  // All conditions matched
}
```

### Example Matchers

```json
{
  "hooks": {
    "TaskCompleted": [
      {
        "matcher": { "owner": "developer-agent" },
        "hooks": ["./notify-dev.sh"]
      },
      {
        "matcher": { "metadata.priority": "critical" },
        "hooks": ["./alert-critical.sh"]
      },
      {
        "matcher": { "teamName": "auth-team" },
        "hooks": ["./update-jira.sh"]
      }
    ]
  }
}
```

---

## Hook Response Processing

### Hook stdout Format

Hooks return JSON on stdout:

```javascript
// Hook can return:
{
  "notification": "Task #5 completed by developer-agent",
  "metadata": {
    "jiraTicket": "PROJ-123",
    "status": "done"
  }
}

// Or to stop processing:
{
  "preventContinuation": true,
  "reason": "Critical failure detected"
}
```

### Notification Injection

Hook notifications are injected as system reminders:

```javascript
// Hook notification → System reminder attachment
{
  type: "hook_notification",
  source: "TaskCompleted",
  hookPath: "./notify-completion.sh",
  content: "Task #5 completed by developer-agent",
  metadata: {
    jiraTicket: "PROJ-123",
    status: "done"
  }
}
```

---

## Integration with Team Messaging

### Auto-Notify Owner on Assignment

When a task is assigned:

```javascript
if (update.owner && update.owner !== previousTask.owner) {
  // Send task_assignment message to owner's inbox
  const message = buildTaskAssignmentMessage(task, update.owner);
  await sendToInbox(update.owner, message);
}
```

### Auto-Notify on Completion

When task is completed:

```javascript
if (update.status === "completed") {
  // Notify team lead if assigned
  if (context.teamLead) {
    await sendToInbox(context.teamLead, {
      type: "task_completed",
      taskId: task.id,
      subject: task.subject,
      owner: task.owner
    });
  }

  // Notify any agents waiting on this task
  for (const blockedTaskId of task.blocks) {
    const blockedTask = await loadTask(taskManager, blockedTaskId);
    if (blockedTask?.owner) {
      await sendToInbox(blockedTask.owner, {
        type: "dependency_resolved",
        taskId: blockedTaskId,
        resolvedBy: task.id
      });
    }
  }
}
```

---

## Quick Reference

### Hook Event Types

| Event | Trigger |
|-------|---------|
| `TaskCompleted` | Task status → completed |
| `TaskAssigned` | Task owner changed |
| `TaskCreated` | New task created |
| `TaskDeleted` | Task marked deleted |

### Hook Message Fields

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | Event type |
| `taskId` | string | Task ID |
| `subject` | string | Task title |
| `owner` | string? | Assigned agent |
| `completedAt` | string | ISO timestamp |
| `teamName` | string? | Team name |
| `metadata` | object | Custom data |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | TaskCompleted hooks |
| 2.1.32 | Team messaging integration |
| 2.1.7 | Initial task system |