# Tool-Reminder Integration (Claude Code 2.1.38)

> Analysis of how tools interact with the system-reminder/attachment system to inject context into conversations.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `createHookMessage` (kq) - Creates attachment objects from hook results
- `createToolProgressMessage` (U1q) - Creates progress attachment for tool execution
- `bashProgressHandler` (ZhA) - Generates bash progress attachments

---

## Integration Architecture

### Overview

Tools integrate with the reminder system through **attachment production** - generating structured objects that get wrapped in `<system-reminder>` tags and injected into the LLM conversation.

```
┌──────────────────────────────────────────────────────────────────┐
│                      TOOL EXECUTION                               │
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │ Tool.call() │───▶│ Progress    │───▶│ Attachment Creation │  │
│  │             │    │ Callback    │    │ (U1q, kq)           │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│                                                    │              │
│                                                    ▼              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │ Hook        │───▶│ Hook Result │───▶│ Hook Attachment     │  │
│  │ Execution   │    │ Processing  │    │ (kq)                │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│                                                    │              │
└────────────────────────────────────────────────────┼──────────────┘
                                                     │
                                                     ▼
┌──────────────────────────────────────────────────────────────────┐
│                   ATTACHMENT NORMALIZATION                        │
│                                                                   │
│   K2z (normalizeAttachmentForAPI)                                │
│   └─→ Wraps content in <system-reminder> tags                    │
│       └─→ Injects into message array for LLM                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### 1. Tool Progress Attachments

**What it does:** During long-running tool execution (especially Bash), progress updates are generated as attachments that inform the LLM of ongoing status.

**How it works:**

```javascript
// ============================================
// createToolProgressMessage - Progress attachment factory
// Location: chunks.172.mjs:2943-2954
// ============================================

// ORIGINAL (for source lookup):
function U1q({
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
function createToolProgressMessage({
    toolUseID,
    parentToolUseID,
    data
}) {
    return {
        type: "progress",
        data: data,                // Progress data (type, elapsed time, etc.)
        toolUseID: toolUseID,      // ID of the tool use being tracked
        parentToolUseID: parentToolUseID,  // Parent tool if nested
        uuid: generateUuid(),
        timestamp: new Date().toISOString()
    };
}

// Mapping: U1q→createToolProgressMessage, A→toolUseID, q→parentToolUseID, K→data, _f→generateUuid
```

**Integration in tool execution pipeline:**

```javascript
// From VdY (toolExecutionOrchestrator) in chunks.149.mjs:474-480
// ORIGINAL:
J.enqueue({
    message: U1q({
        toolUseID: X.toolUseID,
        parentToolUseID: q,
        data: X.data
    })
})

// READABLE:
progressQueue.enqueue({
    message: createToolProgressMessage({
        toolUseID: progressData.toolUseID,
        parentToolUseID: parentToolUseID,
        data: progressData.data
    })
});
```

**Key insight:** Progress messages are queued rather than yielded directly, enabling buffered streaming to the UI and LLM.

---

### 2. Bash Tool Progress Handler

**What it does:** The Bash tool has a specialized progress handler (`ZhA`) that generates progress attachments for long-running commands.

**How it works:**

```javascript
// ============================================
// bashProgressHandler - Bash-specific progress generator
// Location: chunks.150.mjs:2332-2401
// ============================================

// ORIGINAL (for source lookup):
function* ZhA(A) {
    switch (A.type) {
        case "assistant":
            for (let q of iO([A])) {
                if (!et(q)) continue;
                yield {
                    type: "assistant",
                    message: q.message,
                    parent_tool_use_id: null,
                    session_id: U6(),
                    uuid: q.uuid,
                    error: q.error
                }
            }
            return;
        case "progress":
            if (A.data.type === "agent_progress")
                // ... handle agent progress ...
            else if (A.data.type === "bash_progress") {
                if (!J6(process.env.CLAUDE_CODE_REMOTE) && !process.env.CLAUDE_CODE_CONTAINER_ID) break;
                let q = A.parentToolUseID,
                    K = Date.now(),
                    Y = dU1.get(q) || 0;
                if (K - Y >= RcY) {
                    if (dU1.size >= LcY) {
                        let w = dU1.keys().next().value;
                        if (w !== void 0) dU1.delete(w)
                    }
                    dU1.set(q, K), yield {
                        type: "tool_progress",
                        tool_use_id: A.toolUseID,
                        tool_name: "Bash",
                        parent_tool_use_id: A.parentToolUseID,
                        elapsed_time_seconds: A.data.elapsedTimeSeconds,
                        session_id: U6(),
                        uuid: A.uuid
                    }
                }
            } break;
        case "user":
            // ... handle user messages ...
    }
}

// READABLE (for understanding):
function* bashProgressHandler(message) {
    switch (message.type) {
        case "assistant":
            // Pass through assistant messages
            for (let msg of extractMessages([message])) {
                if (!isValidMessage(msg)) continue;
                yield {
                    type: "assistant",
                    message: msg.message,
                    parent_tool_use_id: null,
                    session_id: getSessionId(),
                    uuid: msg.uuid,
                    error: msg.error
                };
            }
            return;

        case "progress":
            if (message.data.type === "bash_progress") {
                // Only emit bash progress in remote/container environments
                if (!isRemote() && !isContainer()) break;

                let toolUseId = message.parentToolUseID;
                let now = Date.now();
                let lastProgressTime = progressTimeCache.get(toolUseId) || 0;

                // Throttle: only emit if enough time has passed
                if (now - lastProgressTime >= PROGRESS_THROTTLE_INTERVAL_MS) {
                    // Cache management: evict oldest if at capacity
                    if (progressTimeCache.size >= MAX_PROGRESS_CACHE_SIZE) {
                        let oldestKey = progressTimeCache.keys().next().value;
                        if (oldestKey !== undefined) {
                            progressTimeCache.delete(oldestKey);
                        }
                    }

                    progressTimeCache.set(toolUseId, now);

                    yield {
                        type: "tool_progress",
                        tool_use_id: message.toolUseID,
                        tool_name: "Bash",
                        parent_tool_use_id: message.parentToolUseID,
                        elapsed_time_seconds: message.data.elapsedTimeSeconds,
                        session_id: getSessionId(),
                        uuid: message.uuid
                    };
                }
            }
            break;
    }
}

// Mapping: ZhA→bashProgressHandler, A→message, dU1→progressTimeCache, RcY→PROGRESS_THROTTLE_INTERVAL_MS, LcY→MAX_PROGRESS_CACHE_SIZE, U6→getSessionId, J6→parseBoolean
```

**Why this approach:**
- **Throttling**: Prevents flooding the message stream with rapid progress updates
- **Cache management**: LRU eviction prevents memory leaks from accumulated tool use IDs
- **Environment check**: Progress only emitted in remote/container environments where UI can't show local progress

**Key insight:** The throttle interval (`RcY`) and cache size limit (`LcY`) balance responsiveness with resource constraints. Progress updates are sparse enough to not overwhelm the message stream but frequent enough to show activity.

---

### 3. Hook Response Attachments

**What it does:** Hook execution results are converted to attachment objects that appear in the conversation as system reminders.

**How it works:**

```javascript
// ============================================
// createHookMessage - Hook attachment factory
// Location: chunks.142.mjs:2615-2622
// ============================================

// ORIGINAL (for source lookup):
function kq(A) {
    return {
        attachment: A,
        type: "attachment",
        uuid: FhY(),
        timestamp: new Date().toISOString()
    }
}

// READABLE (for understanding):
function createHookMessage(attachmentData) {
    return {
        attachment: attachmentData,  // The actual hook result data
        type: "attachment",           // Marks this as an attachment
        uuid: generateUuid(),
        timestamp: new Date().toISOString()
    };
}

// Mapping: kq→createHookMessage, A→attachmentData, FhY→generateUuid
```

**Hook attachment types:**

| Hook Event | Attachment Type | Content |
|------------|-----------------|---------|
| PreToolUse | `hook_permission_decision` | allow/deny decision |
| PreToolUse | `hook_additional_context` | Extra context from hook |
| PreToolUse | `hook_cancelled` | Hook was cancelled |
| PreToolUse | `hook_error_during_execution` | Hook threw error |
| PreToolUse | `hook_blocking_error` | Hook blocked execution |
| PostToolUse | `hook_stopped_continuation` | Hook stopped agent loop |
| PostToolUse | `updatedMCPToolOutput` | Modified MCP tool result |

**Integration in pre-tool hooks:**

```javascript
// From B1q (executePreToolHooksIterator) in chunks.149.mjs
// Hook results converted to attachments:

if (J.blockingError) {
    yield {
        type: "hookPermissionResult",
        hookPermissionResult: {
            behavior: "deny",
            message: formatBlockError(J.blockingError)
        }
    };
}

if (J.additionalContexts && J.additionalContexts.length > 0) {
    yield {
        type: "additionalContext",
        message: {
            message: kq({
                type: "hook_additional_context",
                content: J.additionalContexts,
                hookName: `PreToolUse:${tool.name}`,
                toolUseID: toolUseId,
                hookEvent: "PreToolUse"
            })
        }
    };
}
```

**Key insight:** Hook attachments flow through the same pipeline as tool results, getting normalized and injected into the conversation. This enables hooks to provide feedback, context, and control decisions that the LLM can see and act upon.

---

### 4. Task Status Attachments

**What it does:** Background task status changes are delivered as attachments to inform the LLM of task completion, failure, or progress.

**Integration with attachment producer:**

From `04_system_reminder/attachment_producers.md`:

```javascript
// vIY (getUnifiedTasksAttachment) in chunks.142.mjs:2719-2756
// This attachment producer checks for task status changes and generates attachments

async function getUnifiedTasksAttachment(sessionContext, messages) {
    // Get task status changes from state
    let taskStatusChanges = getPendingTaskStatusUpdates();

    if (taskStatusChanges.length === 0) {
        return [];  // No changes to report
    }

    // Create attachments for each status change
    return taskStatusChanges.map((change) => ({
        type: "task_status",
        taskId: change.taskId,
        previousStatus: change.previousStatus,
        currentStatus: change.currentStatus,
        timestamp: change.timestamp
    }));
}
```

**Task status flow:**

```
Background Task Started (Task tool with run_in_background: true)
    │
    ▼
Task registered in backgroundTasks state
    │
    ▼
Task executes asynchronously
    │
    ├─→ Progress updates → Stored in task record
    │
    ├─→ Completion → Status changed to "completed"
    │
    └─→ Failure → Status changed to "failed"
    │
    ▼
Next agent turn: vIY (getUnifiedTasksAttachment) called
    │
    ▼
Attachment generated with status change
    │
    ▼
LLM sees: "Background task xyz completed"
    │
    ▼
LLM can use TaskOutput to retrieve results
```

**Key insight:** Task status attachments enable **asynchronous notification** - the LLM is informed of background task completion without polling. This is more efficient than having the LLM repeatedly call `TaskOutput` to check status.

---

### 5. Permission Decision Attachments

**What it does:** When hooks influence permission decisions, the decision is recorded as an attachment for transparency.

**How it works:**

```javascript
// From NdY (toolExecutionPipeline) in chunks.149.mjs:626-632
// Permission decision recording

if (Z.decisionReason?.type === "hook" &&
    Z.decisionReason.hookName === "PermissionRequest" &&
    Z.behavior !== "ask") {
    j.push({
        message: kq({
            type: "hook_permission_decision",
            decision: Z.behavior,
            toolUseID: q,
            hookEvent: "PermissionRequest"
        })
    });
}
```

**Why this approach:**
- Transparency: LLM knows why a tool was allowed/denied
- Auditability: Decision trail recorded in conversation
- Hook feedback: Hook can see its decision was applied

---

## Attachment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ TOOL EXECUTION STARTS                                            │
│                                                                  │
│   toolDispatcher(toolUseBlock, ...)                             │
│       │                                                          │
│       ├──▶ Pre-tool hooks (B1q)                                 │
│       │       │                                                  │
│       │       ├──▶ Hook allows → createHookMessage("allow")    │
│       │       ├──▶ Hook denies → createHookMessage("deny")     │
│       │       └──▶ Hook adds context → createHookMessage(...)  │
│       │                                                          │
│       ├──▶ Permission check                                      │
│       │       │                                                  │
│       │       └──▶ Decision → Permission attachment             │
│       │                                                          │
│       ├──▶ Tool execution (tool.call)                           │
│       │       │                                                  │
│       │       ├──▶ Progress callback → U1q(progress)            │
│       │       │                                                  │
│       │       └──▶ Result → Tool result message                 │
│       │                                                          │
│       └──▶ Post-tool hooks (b1q)                                │
│               │                                                  │
│               ├──▶ Hook modifies MCP output                     │
│               ├──▶ Hook stops continuation                      │
│               └──▶ Hook adds context                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ MESSAGE ASSEMBLY                                                 │
│                                                                  │
│   All yielded messages collected into array:                    │
│   [                                                              │
│       { message: hook_permission_decision, ... },               │
│       { message: hook_additional_context, ... },                │
│       { message: tool_result, ... },                            │
│       { message: hook_stopped_continuation, ... }               │
│   ]                                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ ATTACHMENT NORMALIZATION                                         │
│                                                                  │
│   K2z (normalizeAttachmentForAPI)                               │
│       │                                                          │
│       └──▶ Wraps each attachment in <system-reminder> tags      │
│                                                                  │
│   Example output:                                                │
│   <system-reminder>                                              │
│   Hook 'PreToolUse:Bash' approved this tool use.                │
│   Reason: Command is in safe list.                              │
│   </system-reminder>                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Caching and Throttling

### Progress Time Cache

The `bashProgressHandler` uses a cache to throttle progress updates:

| Constant | Symbol | Value | Purpose |
|----------|--------|-------|---------|
| `PROGRESS_THROTTLE_INTERVAL_MS` | `RcY` | ~1000ms | Minimum time between progress updates |
| `MAX_PROGRESS_CACHE_SIZE` | `LcY` | ~100 | Maximum tracked tool use IDs |

```javascript
// Cache structure (dU1 = progressTimeCache)
let progressTimeCache = new Map();  // toolUseID → lastEmitTimestamp

// Throttle check
let now = Date.now();
let lastEmit = progressTimeCache.get(toolUseID) || 0;
if (now - lastEmit >= PROGRESS_THROTTLE_INTERVAL_MS) {
    // Emit progress
    progressTimeCache.set(toolUseID, now);
}
```

**Why this matters:**
- Prevents message flooding for rapidly-progressing tools
- Limits memory growth from tracking many concurrent tools
- Ensures progress updates are meaningful (not spam)

---

## Cross-Reference to System Reminder Module

This document focuses on **tool-generated attachments**. For complete attachment architecture, see:

- [../04_system_reminder/overview.md](../04_system_reminder/overview.md) - System reminder architecture
- [../04_system_reminder/attachment_producers.md](../04_system_reminder/attachment_producers.md) - All 40+ attachment producers
- [../04_system_reminder/integration_points.md](../04_system_reminder/integration_points.md) - Module integration details

**Key connection:**
- Tools produce attachments via `kq()` and `U1q()` functions
- These attachments are consumed by `phY()` (assembleAttachments)
- Normalized by `K2z()` (normalizeAttachmentForAPI)
- Injected into LLM conversation as `<system-reminder>` content

---

## Related Documents

- [tool_execution_pipeline.md](./tool_execution_pipeline.md) - Complete tool execution flow
- [tool_discovery.md](./tool_discovery.md) - How tools are discovered
- [bash_tool.md](./bash_tool.md) - Bash tool specifics including progress