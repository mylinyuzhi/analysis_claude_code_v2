# Key Algorithms Deep Dive V10 (Claude Code 2.1.76)

> Complete algorithm analysis for subagent and background agent systems with source-level documentation, decision rationale, and cross-feature integration.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v4.md](./cross_validation_unified_v4.md) - Unified symbol verification

---

## Algorithm 1: Task ID Generation

### What It Does

Generates unique, type-prefixed identifiers for tasks that are cryptographically random and collision-resistant.

### Source Code

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = N$3(8),
        Y = q;
    for (let z = 0; z < 8; z++) Y += G97[K[z] % G97.length];
    return Y
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Step 1: Get type prefix name
    let typeName = getTaskTypePrefix(taskType);

    // Step 2: Generate 8 cryptographically random bytes
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Step 3: Get single-char prefix from mapping
    let prefix = TASK_TYPE_PREFIXES[typeName] ?? "x";

    // Step 4: Map each byte to a character from charset
    // charset = "0123456789abcdefghijklmnopqrstuvwxyz"
    for (let i = 0; i < 8; i++) {
        prefix += TASK_ID_CHARSET[randomBytes[i] % TASK_ID_CHARSET.length];
    }

    // Step 5: Return 9-character ID
    return prefix;
}

// Mapping: oV→generateTaskId, A→taskType, q→typeName, K→randomBytes, Y→result, N$3→crypto.getRandomValues, G97→TASK_ID_CHARSET
```

### Algorithm Steps

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK ID GENERATION FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

Input: taskType (e.g., "local_agent")
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Get Type Name                                                             │
│    getTaskTypePrefix("local_agent") → "local_agent"                          │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Get Prefix Character                                                      │
│    TASK_TYPE_PREFIXES["local_agent"] → "a"                                   │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Generate 8 Random Bytes                                                   │
│    crypto.getRandomValues(new Uint8Array(8))                                 │
│    Example: [183, 42, 157, 88, 201, 15, 77, 230]                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Map Bytes to Characters                                                   │
│    charset = "0123456789abcdefghijklmnopqrstuvwxyz"                          │
│    183 % 36 = 3 → "3"                                                        │
│    42 % 36 = 6 → "6"                                                         │
│    ... (repeat for all 8 bytes)                                              │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. Combine Prefix + Random                                                   │
│    "a" + "3k9x2m7p" = "a3k9x2m7p"                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why This Approach

| Design Choice | Rationale |
|---------------|-----------|
| Type prefix | Quick visual identification of task type |
| 8 random chars | 36^8 ≈ 2.8 trillion combinations - collision-resistant |
| Cryptographic randomness | No predictable patterns |
| Lowercase charset | Filesystem-safe, URL-safe |

### Collision Probability

- Total combinations: 36^8 = 2,821,109,907,456
- Birthday paradox: With 1 million IDs, collision probability < 0.0001%
- Practical: Collision virtually impossible

---

## Algorithm 2: Abort Signal Propagation

### What It Does

Gracefully terminates running tasks by propagating abort signals through the task hierarchy, ensuring cleanup handlers run and partial results are preserved.

### Source Code

```javascript
// ============================================
// x66 - triggerAbortSignal - Abort running task
// Location: chunks.146.mjs:2012-2027
// ============================================

// ORIGINAL (for source lookup):
function x66(A, q) {
    let K = !1;
    if (i9(A, q, (Y) => {
            if (Y.status !== "running") return Y;
            return K = !0, Y.abortController?.abort(), Y.unregisterCleanup?.(), {
                ...Y,
                status: "killed",
                endTime: Date.now(),
                messages: Y.messages?.length ? [Y.messages[Y.messages.length - 1]] : void 0,
                abortController: void 0,
                unregisterCleanup: void 0,
                selectedAgent: void 0
            }
        }), K) $O(A);
    return K
}

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    let wasKilled = false;

    // Atomically update task state
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // Step 1: Abort the AbortController (cancels LLM stream)
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler (prevent double cleanup)
        task.unregisterCleanup?.();

        // Step 3: Return updated task with killed status
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer (preserve partial results)
    if (wasKilled) {
        flushOutputBuffer(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasKilled, Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### Algorithm Steps

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ABORT SIGNAL PROPAGATION                              │
└─────────────────────────────────────────────────────────────────────────────┘

User presses Ctrl+F (or TaskStop called)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Check Task Status                                                         │
│    if (task.status !== "running") return; // No-op if not running            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Abort AbortController                                                     │
│    task.abortController.abort()                                              │
│                                                                              │
│    This propagates to:                                                       │
│    - LLM API stream (stops token generation)                                │
│    - Tool execution (checks signal.aborted)                                 │
│    - Child agents (if any)                                                  │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Unregister Cleanup Handler                                                │
│    task.unregisterCleanup()                                                  │
│                                                                              │
│    Prevents double cleanup when:                                             │
│    - Process exit handler fires                                              │
│    - Task completion handler fires                                           │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Update Task State                                                         │
│    status: "killed"                                                          │
│    endTime: Date.now()                                                       │
│    messages: [lastMessage] // Keep only last                                 │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. Flush Output Buffer                                                       │
│    flushOutputBuffer(taskId)                                                 │
│                                                                              │
│    Preserves partial results in output file                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why This Approach

| Design Choice | Rationale |
|---------------|-----------|
| AbortController | Standard JavaScript API, works with fetch/stream |
| Atomic state update | No race conditions between abort and completion |
| Cleanup handler unregister | Prevents double cleanup (process exit vs task completion) |
| Keep last message | Preserves debugging context |
| Flush output | Partial results preserved for user |

### Abort Propagation Chain

```
Parent Agent (running)
    │
    ├─ AbortController.abort()
    │       │
    │       ▼
    │   LLM Stream (cancelled)
    │       │
    │       ▼
    │   Tool Execution
    │       │
    │       ├─ if (signal.aborted) throw AbortError
    │       │
    │       └─ Child Agent (if spawned)
    │               │
    │               └─ Inherited AbortController
    │                       │
    │                       └─ Also cancelled
```

---

## Algorithm 3: Tool Filtering for Subagents

### What It Does

Filters available tools for subagents to prevent blocking operations and ensure safe execution in background/async contexts.

### Source Code

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools by mode
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsForSubagent({
    tools,
    isBuiltIn,
    isAsync = false,
    permissionMode
}) {
    return tools.filter((tool) => {
        // Rule 1: MCP tools always allowed
        if (tool.name.startsWith("mcp__")) return true;

        // Rule 2: ExitPlanMode allowed in plan mode
        if (matchesTool(tool, "ExitPlanMode") && permissionMode === "plan") {
            return true;
        }

        // Rule 3: Exclude background-agent-blocked tools
        if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 4: Non-builtin tools can't use builtin-excluded tools
        if (!isBuiltIn && ASYNC_AGENT_EXCLUDED_TOOLS.has(tool.name)) {
            return false;
        }

        // Rule 5: Async agents only use whitelisted tools
        if (isAsync && !ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: Team delegate tools in team mode
            if (isTeamModeEnabled() && isTaskSystemEnabled()) {
                if (matchesTool(tool, "Agent")) return true;
                if (TEAM_DELEGATE_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsForSubagent, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode, z→tool, CW6→BACKGROUND_AGENT_EXCLUDED_TOOLS, eP1→ASYNC_AGENT_ALLOWED_TOOLS, WY4→TEAM_DELEGATE_TOOLS
```

### Algorithm Steps

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TOOL FILTERING PIPELINE                               │
└─────────────────────────────────────────────────────────────────────────────┘

Input: tools[], isBuiltIn, isAsync, permissionMode
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ For each tool in tools:                                                      │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ MCP Tool?     │      │ ExitPlanMode +  │      │ In CW6?         │
│ (mcp__*)      │      │ plan mode?      │      │ (excluded)      │
└───────┬───────┘      └────────┬────────┘      └────────┬────────┘
        │                       │                        │
    YES │                   YES │                    YES │
        ▼                       ▼                        ▼
┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ ALLOW         │      │ ALLOW           │      │ DENY            │
└───────────────┘      └─────────────────┘      └─────────────────┘
                                                        │
                                                        │ NO
                                                        ▼
                                        ┌─────────────────────────────┐
                                        │ !isBuiltIn && in xV8?       │
                                        │ (non-builtin excluded)      │
                                        └──────────────┬──────────────┘
                                                       │
                                                   YES │ DENY
                                                       │
                                                       │ NO
                                                       ▼
                                        ┌─────────────────────────────┐
                                        │ isAsync && !in eP1?         │
                                        │ (async whitelist check)     │
                                        └──────────────┬──────────────┘
                                                       │
                                                   YES │
                                                       │
                                        ┌──────────────┴──────────────┐
                                        │ Team mode enabled?          │
                                        └──────────────┬──────────────┘
                                                       │
                                    ┌──────────────────┼──────────────────┐
                                    │ YES              │                  │ NO
                                    ▼                  │                  ▼
                            ┌─────────────┐            │          ┌─────────────┐
                            │ Agent or    │            │          │ DENY        │
                            │ Team tools? │            │          └─────────────┘
                            └──────┬──────┘            │
                                   │                   │
                               YES │ ALLOW             │
                                   │                   │
                                   └───────────────────┘
                                             │
                                             │ NO (not async, or in whitelist)
                                             ▼
                                      ┌─────────────┐
                                      │ ALLOW       │
                                      └─────────────┘
```

### Why This Approach

| Rule | Rationale |
|------|-----------|
| MCP tools allowed | External tools, user-configured |
| ExitPlanMode in plan mode | Required for plan approval flow |
| CW6 excluded | Would block main conversation |
| xV8 for non-builtin | Prevents privilege escalation |
| eP1 whitelist for async | Only non-blocking tools allowed |
| Team delegate exception | Team communication needs Agent tool |

---

## Algorithm 4: Progress Throttling

### What It Does

Updates task progress with telemetry while preventing excessive state updates and maintaining summary consistency.

### Source Code

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
// Location: chunks.146.mjs:2059-2098
// ============================================

// READABLE (for understanding):
function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let telemetryData = null;

    // Atomically update task state
    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only update running tasks
        if (task.status !== "running") return task;

        // Capture data for telemetry (before update)
        telemetryData = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        // Return updated task with new summary
        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summary  // New summary from agent
            }
        };
    });

    // Send telemetry if enabled
    if (telemetryData && isTelemetryEnabled()) {
        let { tokenCount, toolUseCount, startTime, toolUseId } = telemetryData;
        sendTelemetry({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: toolUseId,
            description: summary,
            usage: {
                total_tokens: tokenCount,
                tool_uses: toolUseCount,
                duration_ms: Date.now() - startTime
            },
            summary: summary
        });
    }
}

// Mapping: nl4→updateTaskProgressWithTelemetry, A→taskId, q→summary, K→setAppState
```

### Progress Update Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROGRESS UPDATE FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Agent performs action (tool use, message generation)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Count tokens/tools                                                        │
│    progress.tokenCount += newTokens                                          │
│    progress.toolUseCount++                                                   │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Update summary (if significant change)                                    │
│    progress.summary = "Searching src/auth..."                                │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Atomic state update                                                       │
│    atomicUpdateTask(taskId, setAppState, updater)                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Send telemetry (if enabled)                                               │
│    sendTelemetry({ type: "task_progress", ... })                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Telemetry Throttling

Progress updates are sent to telemetry but aggregated:
- Each update includes current totals
- Duration calculated from startTime
- Summary truncated if too long

---

## Algorithm 5: Mailbox Message Queue

### What It Does

Provides file-based message queue for teammate communication with locking for concurrent access safety.

### Source Code

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
async function writeToMailbox(recipientName, message, teamName) {
    // Step 1: Ensure directory exists
    await ensureDir(getTeamDir(teamName));

    // Step 2: Get mailbox path
    let mailboxPath = getMailboxPath(recipientName, teamName);
    let lockPath = `${mailboxPath}.lock`;

    // Step 3: Create mailbox file if not exists
    try {
        await fs.writeFile(mailboxPath, "[]", {
            encoding: "utf-8",
            flag: "wx"  // Exclusive create
        });
    } catch (e) {
        if (e.code !== "EEXIST") throw e;
        // File already exists, that's fine
    }

    // Step 4: Acquire lock and write
    let releaseLock;
    try {
        // Acquire file lock
        releaseLock = await properLockfile.lock(mailboxPath, {
            lockfilePath: lockPath,
            retries: lockOptions.retries,
            stale: lockOptions.stale
        });

        // Read existing messages
        let messages = await readMailbox(recipientName, teamName);

        // Add new message with read: false
        messages.push({
            ...message,
            read: false,
            timestamp: new Date().toISOString()
        });

        // Write back atomically
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");

    } catch (e) {
        console.error(`Failed to write to inbox for ${recipientName}:`, e);
    } finally {
        // Always release lock
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, A→recipientName, q→message, K→teamName, Y→mailboxPath, z→lockPath, wl→readMailbox, Nc6→properLockfile, iv1→lockOptions
```

### Message Queue Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAILBOX WRITE FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Sender calls writeToMailbox(recipient, message, team)
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Ensure directory exists                                                   │
│    mkdir -p .claude/teams/{team}/mailboxes/                                  │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Create mailbox file (if not exists)                                       │
│    writeFile(path, "[]", { flag: "wx" })  // Exclusive create               │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Acquire file lock                                                         │
│    properLockfile.lock(path, { lockfilePath, retries, stale })              │
│                                                                              │
│    Prevents concurrent writes from:                                          │
│    - Multiple teammates writing simultaneously                              │
│    - Race between read and write                                            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 4. Read existing messages                                                    │
│    messages = JSON.parse(await readFile(path))                               │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 5. Append new message                                                        │
│    messages.push({ ...message, read: false, timestamp: now })               │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 6. Write atomically                                                          │
│    writeFile(path, JSON.stringify(messages, null, 2))                        │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 7. Release lock                                                              │
│    releaseLock()                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Message Format

```javascript
// Message object structure
{
    from: "worker-1",           // Sender teammate name
    text: "Found auth patterns in src/auth/",  // Message content
    color: "blue",              // Optional color for UI
    summary: "Auth analysis",   // Optional summary
    read: false,                // Read status
    timestamp: "2026-03-27T10:30:00.000Z"  // ISO timestamp
}
```

### Why File-Based Queue

| Design Choice | Rationale |
|---------------|-----------|
| File-based | Survives process restart, portable |
| File locking | Concurrent access safety |
| JSON format | Human-readable, easy debugging |
| Append-only | No message loss on failure |
| read flag | Track unread messages |

---

## Cross-Feature Integration

### With System Reminders

Progress updates are injected into LLM context:

```
Background Agent Progress
        │
        ▼
updateTaskProgressWithTelemetry()
        │
        ├── State update (immediate)
        │
        └── Telemetry (async)
                │
                ▼
        Next LLM turn
                │
                ▼
        getUnifiedTasksAttachment()
                │
                ▼
        Task status injected as system reminder
```

### With Hooks

Pre/Post tool hooks can modify task behavior:

```
Agent calls tool
        │
        ▼
executePreToolHooks()
        │
        ├── Allow: Proceed with tool
        ├── Ask: Prompt user for permission
        └── Deny: Cancel tool, return error
                │
                ▼
        Tool executed
                │
                ▼
executePostToolHooks()
        │
        └── Additional context injected
```

### With Compact Module

Task messages preserved during compaction:

```
Context too large
        │
        ▼
autoCompact()
        │
        ├── Keep: User messages, tool results
        ├── Summarize: Old assistant messages
        └── Preserve: Task status attachments (isMeta: true)
```

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - All key algorithms documented with source-level restoration