# Tool-Reminder Integration (Claude Code 2.1.76)

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
│       ├──▶ Pre-tool hooks (y4q/LF8)                             │
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
│       └──▶ Post-tool hooks (k4q/RF8)                            │
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

## Message Array Ordering

### Precise Message Sequence from fxY

The tool execution pipeline (`fxY`) returns messages in a specific order. The order matters for how the LLM interprets the tool interaction:

```
Return array order from fxY (toolExecutionPipeline):

[tool_result message]           ← Primary result first
[...pre-hook messages]          ← Messages from y4q (PreToolUse hooks)
[...post-hook messages]         ← Messages from k4q (PostToolUse hooks)
```

**Pre-hook messages** (from `y4q`) collected before execution include:
- `hook_additional_context` attachments (from `additionalContexts`)
- `hook_blocking_error` attachments (from `blockingError`)

**Post-hook messages** (from `k4q`) appended after execution include:
- `hook_additional_context` attachments
- `hook_blocking_error` attachments
- `hook_stopped_continuation` attachment (if `preventContinuation` set)

**`updatedMCPToolOutput`:** Does not generate a new message — instead, the existing `tool_result` content is replaced in-place by `k4q`. The `yield { updatedMCPToolOutput }` event causes the caller to update the tool_result message rather than append a new one.

---

## Hook Result Types and Attachment Mapping

### What Each Hook Result Produces

| Hook result field | Produces attachment | Attachment type |
|------------------|--------------------|------------------------------------|
| `blockingError` | Yes | `hook_blocking_error` |
| `preventContinuation` | Yes | `hook_stopped_continuation` |
| `additionalContexts` | Yes | `hook_additional_context` |
| `permissionBehavior: "allow"` | Yes (if permission dialog shown) | Permission decision record |
| `updatedInput` (no permissionBehavior) | No | Silently modifies input only |
| `updatedMCPToolOutput` | No | Replaces tool_result content |
| Hook internal exception | Yes | `hook_error_during_execution` |
| Hook cancelled (abort signal) | Yes | `hook_cancelled` |

**Key distinctions:**
- `updatedInput` without `permissionBehavior`: the input change is invisible to the LLM (no attachment generated)
- `updatedMCPToolOutput`: the modified output appears as the tool result itself, not as a separate attachment
- `hook_cancelled`: generated when the abort signal fires during hook execution

---

## Tool Event to Attachment Type Matrix

Complete mapping of triggering events to their generated attachment types:

| Triggering Event | Attachment Type | Generated By |
|-----------------|-----------------|-------------|
| Any tool — progress event during execution | `progress` | Tool's `onProgress` callback (`j` param in `fxY`) |
| Bash — long-running in remote/container | `tool_progress` | `bashProgressHandler` (ZhA) — throttled per `RcY` interval |
| PreToolUse hook — provided additional context | `hook_additional_context` | `y4q` emitting hook `additionalContexts` |
| PreToolUse hook — blocking error | `hook_blocking_error` | `y4q` emitting `blockingError` |
| PreToolUse hook — tool blocked/cancelled | `hook_cancelled` | `y4q` when abort signal fires during hook |
| PreToolUse hook — permission decision (hook source) | `hook_permission_decision` | `fxY` stage 4 when `decisionReason.type === "hook"` |
| PostToolUse hook — stopped continuation | `hook_stopped_continuation` | `k4q` emitting `preventContinuation` |
| PostToolUse MCP hook — replaced output | *(no new attachment)* | `k4q` replaces `tool_result` content in-place |
| Background task — status changed | `task_status` | `getUnifiedTasksAttachment` (vIY) on next turn |
| Tool result — has `structured_output` field | `structured_output` | `fxY` stage 8 detecting `structured_output` key |

**Why `updatedMCPToolOutput` produces no separate attachment:** The PostToolUse MCP hook directly replaces the content of the already-assembled `tool_result` message rather than appending a new message. From the LLM's perspective, it sees only the modified result — the replacement is invisible.

**Why `task_status` fires on the *next* turn:** Background tasks run asynchronously. The status change happens while a different turn may be executing. The `vIY` attachment producer checks for unread status changes at the start of each turn's attachment assembly phase.

---

## v2.1.76 Hook System Updates

### New Hook Events (Not Tool-Triggered)

v2.1.76 added several new hook event types. These are **not triggered during tool execution** — they fire at other lifecycle points:

| New Event | When it fires | Tool execution involvement |
|-----------|--------------|---------------------------|
| `PostCompact` | After compaction completes | None |
| `Elicitation` | When LLM requests user input | None |
| `WorktreeCreate` | When a git worktree is created | None |
| `WorktreeRemove` | When a worktree is removed | None |

These events go through the same `Ax` (executeHooksIterator) engine but with different payloads and are not processed by `y4q`/`k4q`/`E4q`.

### agent_id and agent_type in Hook Payloads

All `PreToolUse`, `PostToolUse`, and `PostToolUseFailure` hook payloads in v2.1.76 include:
- `agent_id` — the ID of the agent making the tool call
- `agent_type` — whether this is the primary agent or a subagent

This allows hooks to differentiate between tool calls from the main agent vs. tool calls from background/forked agents. This is critical for multi-agent scenarios where a hook should behave differently depending on the agent hierarchy level.

```javascript
// From LF8 (executePreToolHooks) - hook input payload
let hookInput = {
    ...$w(permissionMode, void 0, toolUseContext),  // includes agent_id, agent_type
    hook_event_name: "PreToolUse",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseId
};
// $w builds the base context with agent metadata from toolUseContext
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

---

## Additional Integration Patterns

### readFileState Integration

**What it does:** The Edit tool uses `readFileState` to track which files have been read, which is exposed as context for the LLM.

```javascript
// ============================================
// readFileState - File read tracking
// Location: chunks.149.mjs:2603 (global Map)
// ============================================

// ORIGINAL (for source lookup):
let readFileState = new Map();  // filePath → { content, timestamp, offset, limit }

// READABLE (for understanding):
// This Map tracks files that have been read in the current session
// Used by Edit tool validateInput to enforce "read before edit" rule

interface FileReadState {
    content: string;      // Full file content at time of read
    timestamp: number;    // Modification time when read
    offset?: number;      // If partial read, the starting offset
    limit?: number;       // If partial read, the number of lines
}

// Integration point:
// - Read tool updates readFileState after successful read
// - Edit tool checks readFileState in validateInput (errorCode 6)
// - Edit tool updates readFileState after successful edit

// From Edit tool validateInput (chunks.134.mjs:2167):
let fileState = sessionContext.readFileState.get(absolutePath);
if (!fileState) {
    return {
        result: false,
        behavior: "ask",
        message: "File has not been read yet. Read it first before writing to it.",
        errorCode: 6
    };
}
```

**Key insight:** The `readFileState` is passed through the tool execution context, enabling cross-tool state sharing without global variables.

---

### Tool Decision Tracking

**What it does:** Permission decisions are tracked in a map for reporting and attribution.

```javascript
// ============================================
// toolDecisions - Permission decision tracking
// Location: chunks.149.mjs (used in pipeline)
// ============================================

// ORIGINAL (for source lookup):
let decision = Y.toolDecisions?.get(q);

// READABLE (for understanding):
// Tool decisions map tracks: toolUseId → { decision, source }

interface ToolDecision {
    decision: "allow" | "deny";
    source: "user" | "rule" | "hook" | "auto";
    userModified?: boolean;  // Did user edit the input?
    timestamp: number;
}

// Integration in pipeline:
// 1. Permission check stores decision in toolDecisions
// 2. Telemetry reports decision source
// 3. Attribution tracking for file operations

// From chunks.149.mjs:636-637:
let decision = toolUseContext.toolDecisions?.get(toolUseId);
reportPermissionDecision("reject", decision?.source || "unknown");
```

**Why this matters:**
- Enables audit logging of permission decisions
- Provides data for permission UX improvements
- Supports telemetry on approval rates by source

---

### Background Task Notification Flow

**What it does:** Complete flow showing how background task status reaches the LLM.

```javascript
// ============================================
// Background Task Notification Flow
// ============================================

// Step 1: Task tool spawns background agent
async function createAsyncTask(prompt, context, agentId, outputFile) {
    // Register in state
    registerTaskInState({
        taskId: agentId,
        type: "local_agent",
        status: "running",
        outputFile: outputFile
    });

    // Return immediately with async status
    return {
        status: "async_launched",
        agentId: agentId,
        outputFile: outputFile
    };
}

// Step 2: Agent runs in background, writes to outputFile
// (handled by agentLoopRunner)

// Step 3: On completion, update state
function markTaskCompleted(agentId, result) {
    atomicUpdateTask(agentId, (task) => ({
        ...task,
        status: "completed",
        result: result,
        completedAt: Date.now()
    }));

    // Emit completion event
    notifyTaskCompletion(agentId);
}

// Step 4: Next agent turn - attachment producer picks up change
async function getUnifiedTasksAttachment(sessionContext, messages) {
    let tasks = sessionContext.backgroundTasks;
    let pendingNotifications = tasks.filter(t => t.hasUnreadStatusChange);

    if (pendingNotifications.length === 0) return [];

    // Create attachments
    return pendingNotifications.map(task => ({
        type: "attachment",
        attachment: {
            type: "task_status",
            taskId: task.taskId,
            status: task.status,
            message: task.status === "completed"
                ? `Background task ${task.taskId} completed successfully`
                : `Background task ${task.taskId} failed: ${task.error}`
        }
    }));
}

// Step 5: LLM sees notification and can call TaskOutput
// "Background task agent-123 completed successfully"
// → LLM calls TaskOutput({ task_id: "agent-123" })
```

---

### Structured Output from Tools

**What it does:** Some tools can return structured output (like Thinking/StructuredOutput tool) that gets special handling.

```javascript
// ============================================
// Structured Output Handling
// Location: chunks.149.mjs:763-767
// ============================================

// ORIGINAL (for source lookup):
if (typeof y === "object" && "structured_output" in y) j.push({
    message: kq({
        type: "structured_output",
        data: y.structured_output
    })
});

// READABLE (for understanding):
// Tools can optionally return structured output alongside regular result
// This gets converted to a special attachment type

if (typeof result === "object" && "structured_output" in result) {
    hookMessages.push({
        message: createHookMessage({
            type: "structured_output",
            data: result.structured_output
        })
    });
}

// This is used by the Thinking/StructuredOutput tool for structured reasoning
```

---

### File Operation Attribution

**What it does:** File operations are tracked for attribution and telemetry.

```javascript
// ============================================
// File Operation Attribution
// Location: chunks.149.mjs:606-613, 747-761
// ============================================

// ORIGINAL (for source lookup):
let f = {};
if (M && typeof M === "object") {
    if (A.name === Jq && "file_path" in M) f.file_path = String(M.file_path);
    else if ((A.name === bq || A.name === f5) && "file_path" in M) f.file_path = String(M.file_path);
    else if (A.name === h4 && "command" in M) {
        f.full_command = M.command
    }
}
si7(A.name, f);  // recordToolOperation

// READABLE (for understanding):
// Extract file-related metadata for attribution tracking
let attributionData = {};
if (input && typeof input === "object") {
    if (tool.name === "Read" && "file_path" in input) {
        attributionData.file_path = String(input.file_path);
    }
    else if ((tool.name === "Edit" || tool.name === "Write") && "file_path" in input) {
        attributionData.file_path = String(input.file_path);
    }
    else if (tool.name === "Bash" && "command" in input) {
        attributionData.full_command = input.command;
    }
}

// Record operation for attribution
recordToolOperation(tool.name, attributionData);

// After execution, record result for file tools:
if (result.data && typeof result.data === "object") {
    let outputAttribution = {};
    if (tool.name === "Read" && "content" in result.data) {
        outputAttribution.content = String(result.data.content);
    }
    if (tool.name === "Edit" && "diff" in result.data) {
        outputAttribution.diff = String(result.data.diff);
    }
    recordToolOutput("tool.output", outputAttribution);
}

// Mapping: si7→recordToolOperation, An7→recordToolOutput
```

**Why this matters:**
- Enables tracking which files the LLM has touched
- Supports undo/redo functionality
- Provides data for usage analytics