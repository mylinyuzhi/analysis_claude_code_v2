# System Reminder Deep Integration — Source-Level Analysis (Claude Code 2.1.76)

> Complete source-level restoration of system reminder integration with subagents and background tasks.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `buildAgentSystemPrompt` (vvY) - Builds subagent system prompt — `chunks.133.mjs:1806`
- `cloneForkContext` (Fx8) - Clones context for subagent isolation — `chunks.133.mjs:1788`
- `readMailbox` (wl) - Read messages from mailbox — `chunks.132.mjs:3`
- `writeToMailbox` (x3) - Write message to mailbox — `chunks.132.mjs:22`
- `updateTaskProgressWithTelemetry` (nl4) - Update progress with telemetry — `chunks.146.mjs:2059`

---

## Overview

The subagent and background agent systems integrate deeply with the system reminder mechanism to provide:

1. **Context propagation** - Subagents receive relevant parent context
2. **Progress reporting** - Background tasks report progress via attachments
3. **Status notifications** - Task completion/failure notifications
4. **Teammate communication** - Mailbox-based messaging

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    System Reminder Integration Points                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────┐        ┌─────────────────────┐                   │
│   │ Parent Session      │        │ System Reminder     │                   │
│   │                     │        │ Producers           │                   │
│   │  • Message history  │───────►│  • task_status      │                   │
│   │  • Permission mode  │        │  • task_progress    │                   │
│   │  • App state        │        │  • team_context     │                   │
│   └─────────────────────┘        └──────────┬──────────┘                   │
│                                            │                                │
│                                            ▼                                │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    Subagent Context Building                         │  │
│   │                                                                      │  │
│   │  cloneForkContext(parentContext) → subagentContext                  │  │
│   │  • Clone messages                                                    │  │
│   │  • Inherit permission mode                                          │  │
│   │  • Set inhibitSystemReminders: true                                 │  │
│   │  • New agent identity                                                │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Fork Context Building

### cloneForkContext (Fx8)

**What it does:** Creates an isolated context for a subagent by cloning the parent's context.

```javascript
// ============================================
// Fx8 - cloneForkContext - Clones context for subagent isolation
// Location: chunks.133.mjs:1788-1806
// ============================================

// READABLE (for understanding):
function cloneForkContext(parentContext) {
    return {
        // Clone message history (deep copy)
        messages: parentContext.messages.map(cloneMessage),

        // Inherit permission mode
        permissionMode: parentContext.permissionMode,

        // CRITICAL: Inhibit system reminders for subagent
        inhibitSystemReminders: true,

        // New agent identity
        agentId: generateAgentId(),
        parentAgentId: parentContext.agentId,

        // Inherited settings
        cwd: parentContext.cwd,
        modelOverride: parentContext.modelOverride,

        // Telemetry span linking
        parentSpanId: parentContext.currentSpanId
    };
}
```

**Key insight:** The `inhibitSystemReminders: true` flag prevents infinite loops where a subagent could trigger reminders that spawn more subagents.

---

## Agent System Prompt Building

### buildAgentSystemPrompt (vvY)

**What it does:** Builds the system prompt for a subagent based on its type and context.

```javascript
// ============================================
// vvY - buildAgentSystemPrompt - Builds subagent system prompt
// Location: chunks.133.mjs:1806-1817
// ============================================

// READABLE (for understanding):
function buildAgentSystemPrompt(context, agentDefinition, options) {
    let systemPrompt = "";

    // 1. Add agent-type-specific instructions
    if (agentDefinition.getSystemPrompt) {
        systemPrompt += agentDefinition.getSystemPrompt();
    }

    // 2. Add critical system reminder if agent has one
    if (agentDefinition.criticalSystemReminder_EXPERIMENTAL) {
        systemPrompt += `\n\n${agentDefinition.criticalSystemReminder_EXPERIMENTAL}`;
    }

    // 3. Add tool restrictions explanation
    if (agentDefinition.disallowedTools?.length) {
        systemPrompt += `\n\nYou do NOT have access to the following tools: ${agentDefinition.disallowedTools.join(", ")}`;
    }

    // 4. Add teammate context if applicable
    if (context.teamName && context.agentName) {
        systemPrompt += `\n\nYou are part of team "${context.teamName}" as agent "${context.agentName}".`;
        systemPrompt += ` Use SendMessage to communicate with teammates.`;
    }

    // 5. Add background mode context
    if (context.isBackgrounded) {
        systemPrompt += `\n\nYou are running in the background. Your output will be captured and made available to the main conversation.`;
    }

    return systemPrompt;
}
```

---

## Task Progress Attachment Generation

### Progress Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Progress Attachment Generation                             │
└─────────────────────────────────────────────────────────────────────────────┘

Subagent Agent Loop (each turn)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  updateTaskProgressWithTelemetry(taskId, summary, setAppState)              │
│                                                                              │
│  • Update progress.toolUseCount, progress.tokenCount                       │
│  • Set progress.summary                                                      │
│  • Send telemetry if enabled                                                │
│  • appendToOutputFile(taskId, output)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        │ (parent session, before next LLM turn)
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  getTaskAttachments()                                                        │
│                                                                              │
│  1. Get all tasks from appState.tasks                                       │
│  2. Filter: running tasks                                                   │
│  3. Check throttle: countTurnsSinceLastProgress() >= 3                      │
│  4. For each: readOutputFileDelta(taskId, offset)                           │
│  5. Build task_progress attachment                                          │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Attachment Injection                                                        │
│                                                                              │
│  {                                                                           │
│    type: "attachment",                                                       │
│    attachment: {                                                             │
│      type: "task_progress",                                                  │
│      taskId: "a3f8b2c1",                                                    │
│      taskType: "local_agent",                                               │
│      message: "Running Grep for 'createTaskId'..."                          │
│    }                                                                         │
│  }                                                                           │
│                                                                              │
│  Injected as system-reminder into parent conversation                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Task Status Attachment Generation

### Status Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Status Attachment Generation                               │
└─────────────────────────────────────────────────────────────────────────────┘

Task Completes/Fails/Killed
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  markTaskCompleted / markTaskFailed / triggerAbortSignal                    │
│                                                                              │
│  • Set status: "completed" / "failed" / "killed"                            │
│  • Set endTime                                                               │
│  • flushOutputFile(taskId)                                                  │
│  • notified: false (waiting for attachment)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        │ (parent session, before next LLM turn)
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  getTaskStatusAttachments()                                                 │
│                                                                              │
│  1. Find tasks with terminal status && !notified                            │
│  2. For each: readOutputFileDelta(taskId, offset)                           │
│  3. Build task_status attachment with deltaSummary                          │
│  4. Set notified: true                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Attachment Injection                                                        │
│                                                                              │
│  {                                                                           │
│    type: "attachment",                                                       │
│    attachment: {                                                             │
│      type: "task_status",                                                    │
│      taskId: "a3f8b2c1",                                                    │
│      taskType: "local_agent",                                               │
│      status: "completed",                                                    │
│      description: "Search codebase",                                         │
│      deltaSummary: "Found 15 occurrences in 8 files..."                    │
│    }                                                                         │
│  }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Teammate Mailbox Communication

### Mailbox System

Teammates communicate via file-based mailboxes:

```javascript
// ============================================
// wl - readMailbox - Read messages from mailbox
// Location: chunks.132.mjs:3-14
// ============================================

// ORIGINAL (for source lookup):
async function wl(A, q) {
    let K = FY6(A, q);
    k(`[TeammateMailbox] readMailbox: path=${K}`);
    try {
        let Y = await xd4(K, "utf-8"),
            z = i1(Y);
        return k(`[TeammateMailbox] readMailbox: read ${z.length} message(s)`), z
    } catch (Y) {
        if (Y.code === "ENOENT") return k("[TeammateMailbox] readMailbox: file does not exist"), [];
        return k(`Failed to read inbox for ${A}: ${Y}`), _6(Y), []
    }
}

// READABLE (for understanding):
async function readMailbox(agentName, teamName) {
    let inboxPath = getInboxPath(agentName, teamName);
    log(`[TeammateMailbox] readMailbox: path=${inboxPath}`);

    try {
        let content = await fs.readFile(inboxPath, "utf-8");
        let messages = JSON.parse(content);
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (error) {
        if (error.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];
        }
        log(`Failed to read inbox for ${agentName}: ${error}`);
        reportError(error);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, K→inboxPath
```

### writeToMailbox (x3)

```javascript
// ============================================
// x3 - writeToMailbox - Write message to mailbox
// Location: chunks.132.mjs:22-55
// ============================================

// ORIGINAL (for source lookup):
async function x3(A, q, K) {
    await OTY(K);
    let Y = FY6(A, K),
        z = `${Y}.lock`;
    k(`[TeammateMailbox] writeToMailbox: recipient=${A}, from=${q.from}, path=${Y}`);
    try {
        await Pf6(Y, "[]", {
            encoding: "utf-8",
            flag: "wx"
        }), k("[TeammateMailbox] writeToMailbox: created new inbox file")
    } catch (w) {
        if (w.code !== "EEXIST") {
            k(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${w}`), _6(w);
            return
        }
    }
    let _;
    try {
        _ = await Nc6.lock(Y, {
            lockfilePath: z,
            ...iv1
        });
        let w = await wl(A, K),
            O = {
                ...q,
                read: !1
            };
        w.push(O), await Pf6(Y, B6(w, null, 2), "utf-8"), k(`[TeammateMailbox] Wrote message to ${A}'s inbox from ${q.from}`)
    } catch (w) {
        k(`Failed to write to inbox for ${A}: ${w}`), _6(w)
    } finally {
        if (_) await _()
    }
}

// READABLE (for understanding):
async function writeToMailbox(recipientAgentName, message, teamName) {
    // Ensure team directory exists
    await ensureTeamDirectory(teamName);

    let inboxPath = getInboxPath(recipientAgentName, teamName);
    let lockPath = `${inboxPath}.lock`;

    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientAgentName}, from=${message.from}, path=${inboxPath}`);

    // Create inbox file if it doesn't exist
    try {
        await fs.writeFile(inboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Fail if exists
        });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (error) {
        if (error.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error}`);
            reportError(error);
            return;
        }
    }

    // Acquire lock and write
    let releaseLock;
    try {
        releaseLock = await fileLock.lock(inboxPath, {
            lockfilePath: lockPath,
            ...lockOptions
        });

        // Read current messages
        let messages = await readMailbox(recipientAgentName, teamName);

        // Add new message
        let newMessage = {
            ...message,
            read: false
        };
        messages.push(newMessage);

        // Write back
        await fs.writeFile(inboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] Wrote message to ${recipientAgentName}'s inbox from ${message.from}`);

    } catch (error) {
        log(`Failed to write to inbox for ${recipientAgentName}: ${error}`);
        reportError(error);
    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, A→recipientAgentName, q→message, K→teamName
```

---

## Mailbox Message Format

### Message Structure

```typescript
interface MailboxMessage {
    from: string;        // Sender agent name
    to?: string;         // Recipient agent name (optional for broadcast)
    text: string;        // Message content
    timestamp: number;   // Unix timestamp
    read: boolean;       // Has recipient read this?
    color?: string;      // Optional display color
    summary?: string;    // Optional summary for display
}
```

### Formatted Output

```javascript
// ============================================
// HTY - formatMailboxMessages - Format messages as XML
// Location: chunks.132.mjs:141-150
// ============================================

// READABLE (for understanding):
function formatMailboxMessages(messages) {
    return messages.map((message) => {
        let colorAttr = message.color ? ` color="${message.color}"` : "";
        let summaryAttr = message.summary ? ` summary="${message.summary}"` : "";

        return `<teammate_message teammate_id="${message.from}"${colorAttr}${summaryAttr}>
${message.text}
</teammate_message>`;
    }).join("\n\n");
}
```

---

## Integration Summary

| Integration Point | Mechanism | Timing |
|-------------------|-----------|--------|
| Context propagation | cloneForkContext | Task spawn |
| Progress reporting | task_progress attachment | Every 3+ turns |
| Status notification | task_status attachment | On completion |
| Teammate messaging | Mailbox files | Real-time |
| Telemetry | updateTaskProgressWithTelemetry | Each turn |

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `Fx8` | cloneForkContext | chunks.133.mjs:1788 | ✅ Verified |
| `vvY` | buildAgentSystemPrompt | chunks.133.mjs:1806 | ✅ Verified |
| `wl` | readMailbox | chunks.132.mjs:3 | ✅ Verified |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✅ Verified |
| `Vc6` | markMessageAsReadByIndex | chunks.132.mjs:57 | ✅ Verified |
| `kc6` | markMessagesAsRead | chunks.132.mjs:92 | ✅ Verified |
| `nl4` | updateTaskProgressWithTelemetry | chunks.146.mjs:2059 | ✅ Verified |