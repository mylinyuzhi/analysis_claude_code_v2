# Key Algorithms Deep Dive V8 (Claude Code 2.1.76)

> Deep analysis of critical algorithms in the subagent and background agent systems including task ID generation, tool filtering, abort signal propagation, mid-run backgrounding, and mailbox communication.

---

## Related Symbols

> Symbol mappings:
> - [cross_validation_unified_v3.md](../08_subagent/cross_validation_unified_v3.md) - Unified symbol verification

---

## Algorithm 1: Task ID Generation (oV)

### What it does

Generates a unique 8-character task ID with a type prefix for collision-free identification.

### How it works

```
Step 1: Get task type prefix (e.g., "a" for agent)
Step 2: Generate 8 cryptographically random bytes
Step 3: Map each byte to a character from charset
Step 4: Concatenate prefix + suffix
```

### Source Code

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID
// Location: chunks.41.mjs:2410-2416
// ============================================

// ORIGINAL (for source lookup):
function oV(A) {
    let q = k$3(A),
        K = V$3[q] ?? "x",
        Y = VvY(8);
    return `${K}${Y.map((z) => G97[z % G97.length]).join("")}`
}

// READABLE (for understanding):
function generateTaskId(taskType) {
    // Step 1: Get type prefix
    let typeName = getTaskTypePrefix(taskType);
    let prefix = TASK_TYPE_PREFIXES[typeName] ?? "x";

    // Step 2: Generate 8 random bytes using crypto
    let randomBytes = crypto.getRandomValues(new Uint8Array(8));

    // Step 3: Convert bytes to characters
    // charset = "0123456789abcdefghijklmnopqrstuvwxyz"
    let suffix = randomBytes.map(byte =>
        TASK_ID_CHARSET[byte % TASK_ID_CHARSET.length]
    ).join("");

    // Step 4: Return prefix + suffix (9 chars total)
    return `${prefix}${suffix}`;
}
```

### Why this approach

| Design Choice | Rationale |
|---------------|-----------|
| Type prefix | Visual identification of task type |
| 8 random chars | 36^8 = ~2.8 trillion combinations, collision improbable |
| Crypto random | Unpredictable, cannot be guessed |
| Modulo mapping | Efficient charset conversion |

### Key insight

The type prefix serves as a visual debugging aid - `a7x9k2m3` is immediately recognizable as an agent task, `b8p1n4q5` as a bash task.

---

## Algorithm 2: Tool Filtering for Subagents (Xk8)

### What it does

Determines which tools a subagent can access based on agent type, execution mode, and permission context.

### How it works

```
Step 1: Allow all MCP tools (mcp__*)
Step 2: Check ExitPlanMode exception for plan mode
Step 3: Block tools in BACKGROUND_AGENT_EXCLUDED_TOOLS
Step 4: Block built-in excluded tools for non-built-in agents
Step 5: If async mode, only allow ASYNC_AGENT_ALLOWED_TOOLS
Step 6: Exception: Teammates get Agent + TEAM_DELEGATE_TOOLS
```

### Decision Tree

```
For each tool T:
├── T.name starts with "mcp__"?
│   └── YES → ALLOW
│   └── NO → Continue
├── T.name == "ExitPlanMode" AND mode == "plan"?
│   └── YES → ALLOW
│   └── NO → Continue
├── T.name in BACKGROUND_AGENT_EXCLUDED_TOOLS?
│   └── YES → DENY
│   └── NO → Continue
├── Not built-in AND T.name in BUILTIN_EXCLUDED_TOOLS?
│   └── YES → DENY
│   └── NO → Continue
├── isAsync?
│   └── NO → ALLOW
│   └── YES → Continue
    ├── T.name in ASYNC_AGENT_ALLOWED_TOOLS?
    │   └── YES → ALLOW
    │   └── NO → Continue
    ├── Is teammate (AgentTeams + InProcess)?
    │   └── NO → DENY
    │   └── YES → Continue
        ├── T.name == "Agent" OR T.name in TEAM_DELEGATE_TOOLS?
        │   └── YES → ALLOW
        │   └── NO → DENY
```

### Key insight

The filtering prevents background agents from doing anything that would block or require user interaction, while allowing teammates special delegation capabilities.

---

## Algorithm 3: Abort Signal Propagation (x66)

### What it does

Gracefully terminates a running task with proper cleanup and partial result preservation.

### How it works

```
Step 1: Check if task is running
Step 2: Abort the AbortController (cancels LLM stream)
Step 3: Unregister cleanup handler (prevent double cleanup)
Step 4: Set status to "killed"
Step 5: Keep last message (for debugging)
Step 6: Clear sensitive references
Step 7: Flush output buffer (preserve partial results)
```

### Source Code

```javascript
// ============================================
// x66 - triggerAbortSignal
// Location: chunks.146.mjs:2012-2027
// ============================================

function triggerAbortSignal(taskId, setAppState) {
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Step 1: Abort the controller
        task.abortController?.abort();

        // Step 2: Unregister cleanup handler
        task.unregisterCleanup?.();

        // Step 3: Update task state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output buffer
    if (wasAborted) {
        flushOutputBuffer(taskId);
    }

    return wasAborted;
}
```

### Why these steps

| Step | Reason |
|------|--------|
| Check running | Only running tasks can be aborted |
| Abort controller | Cancels LLM API stream immediately |
| Unregister cleanup | Prevents double-cleanup on process exit |
| Keep last message | Useful for debugging |
| Clear references | Memory management |
| Flush buffer | Preserves partial results |

### Key insight

The abort is designed to be **idempotent** - calling it multiple times has no additional effect, and partial results are always preserved.

---

## Algorithm 4: Mid-Run Backgrounding

### What it does

Allows a foreground task to transition to background execution after a timeout, enabling the main conversation to continue.

### How it works

```
Step 1: Create task with isBackgrounded=false
Step 2: Set up auto-background timer
Step 3: Create background signal promise
Step 4: If timer fires before completion:
    a. Update task.isBackgrounded = true
    b. Resolve background signal
    c. Main conversation continues
Step 5: Task completes in background
Step 6: Results available via output file
```

### Source Code Pattern

```javascript
// Mid-run backgrounding pattern
function createForegroundAgentTask({ autoBackgroundMs, ... }) {
    // ... create task record ...

    // Set up auto-background timer
    if (autoBackgroundMs !== undefined && autoBackgroundMs > 0) {
        let timeoutId = setTimeout(() => {
            // Transition to background
            setAppState((state) => ({
                ...state,
                tasks: {
                    ...state.tasks,
                    [taskId]: {
                        ...state.tasks[taskId],
                        isBackgrounded: true
                    }
                }
            }));

            // Signal that backgrounding happened
            resolveBackgroundSignal();
        }, autoBackgroundMs);
    }

    return {
        taskId,
        backgroundSignal,  // Resolves when backgrounded
        cancelAutoBackground
    };
}

// In AgentTool.call:
let result = createForegroundAgentTask({ autoBackgroundMs: 120000, ... });

// Wait for either completion or backgrounding
await Promise.race([
    agentCompletion,
    result.backgroundSignal
]);
```

### Why this approach

| Design Choice | Rationale |
|---------------|-----------|
| Timer-based | Gives user feedback before backgrounding |
| Promise.race | Allows either outcome |
| State flag | Task continues but doesn't block UI |
| Signal resolution | Main conversation can continue |

### Key insight

This enables the "fast mode" experience where long-running tasks don't block the conversation - after 2 minutes, the task automatically transitions to background and the user can continue with other work.

---

## Algorithm 5: Progress Throttling (nl4)

### What it does

Updates task progress with telemetry, throttling updates to avoid excessive API calls.

### How it works

```
Step 1: Capture previous progress state
Step 2: Update progress atomically
Step 3: Check if telemetry is enabled
Step 4: Send telemetry event with:
    - Task ID
    - Tool use count
    - Token count
    - Duration
    - Summary
```

### Source Code

```javascript
// ============================================
// nl4 - updateTaskProgressWithTelemetry
// Location: chunks.146.mjs:2059-2098
// ============================================

function updateTaskProgressWithTelemetry(taskId, summary, setAppState) {
    let previousProgress = null;

    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;

        previousProgress = {
            tokenCount: task.progress?.tokenCount ?? 0,
            toolUseCount: task.progress?.toolUseCount ?? 0,
            startTime: task.startTime,
            toolUseId: task.toolUseId
        };

        return {
            ...task,
            progress: {
                ...task.progress,
                toolUseCount: task.progress?.toolUseCount ?? 0,
                tokenCount: task.progress?.tokenCount ?? 0,
                summary: summary
            }
        };
    });

    // Send telemetry if task was updated
    if (previousProgress && isTelemetryEnabled()) {
        sendTelemetryEvent({
            type: "system",
            subtype: "task_progress",
            task_id: taskId,
            tool_use_id: previousProgress.toolUseId,
            description: summary,
            usage: {
                total_tokens: previousProgress.tokenCount,
                tool_uses: previousProgress.toolUseCount,
                duration_ms: Date.now() - previousProgress.startTime
            },
            summary: summary
        });
    }
}
```

### Key insight

Progress updates are **telemetry-aware** - they only send events if telemetry is enabled, reducing overhead when not needed.

---

## Algorithm 6: Mailbox Communication Protocol

### What it does

Provides file-based message queue for teammate communication with proper locking.

### How it works

```
Read Mailbox:
    Step 1: Get inbox path for recipient
    Step 2: Read file contents
    Step 3: Parse JSON
    Step 4: Return message array

Write Mailbox:
    Step 1: Ensure inbox directory exists
    Step 2: Acquire lock (proper-lockfile)
    Step 3: Read existing messages
    Step 4: Append new message
    Step 5: Write back to file
    Step 6: Release lock

Mark Read:
    Step 1: Acquire lock
    Step 2: Read messages
    Step 3: Update read flag
    Step 4: Write back
    Step 5: Release lock
```

### Source Code

```javascript
// ============================================
// wl - readMailbox
// Location: chunks.132.mjs:3-14
// ============================================

async function readMailbox(recipientName, teamName) {
    let inboxPath = getInboxPath(recipientName, teamName);

    try {
        let content = await fs.readFile(inboxPath, "utf-8");
        let messages = JSON.parse(content);
        return messages;
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];  // No inbox yet
        }
        logError(error);
        return [];
    }
}

// ============================================
// x3 - writeToMailbox
// Location: chunks.132.mjs:22-55
// ============================================

async function writeToMailbox(recipient, message, teamName) {
    await ensureInboxDirectoryExists(teamName);
    let inboxPath = getInboxPath(recipient, teamName);
    let lockPath = `${inboxPath}.lock`;

    // Create empty inbox if doesn't exist
    try {
        await fs.writeFile(inboxPath, "[]", { flag: "wx" });
    } catch (error) {
        if (error.code !== "EEXIST") throw error;
    }

    // Acquire lock and write
    let releaseLock;
    try {
        releaseLock = await properLockfile.lock(inboxPath, {
            lockfilePath: lockPath,
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });

        let messages = await readMailbox(recipient, teamName);
        messages.push({ ...message, read: false });
        await fs.writeFile(inboxPath, JSON.stringify(messages, null, 2), "utf-8");
    } finally {
        if (releaseLock) await releaseLock();
    }
}
```

### Lock Configuration

```javascript
// ============================================
// iv1 - lockOptions
// Location: chunks.132.mjs:463
// ============================================

const lockOptions = {
    retries: 10,      // Try up to 10 times
    minTimeout: 5,    // Wait at least 5ms between retries
    maxTimeout: 100   // Wait at most 100ms between retries
};
```

### Why this approach

| Design Choice | Rationale |
|---------------|-----------|
| File-based | Persists across process restarts |
| JSON format | Human-readable, easy to debug |
| proper-lockfile | Cross-platform file locking |
| Retries | Handles brief contention |
| Read flag | Enables message tracking |

### Key insight

The mailbox uses **optimistic locking with retries** - this handles the common case (no contention) efficiently while gracefully handling the rare case of concurrent writes.

---

## Cross-Algorithm Integration

### How These Algorithms Work Together

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SUBAGENT EXECUTION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

1. User invokes Agent tool
        │
        ▼
2. [Task ID Generation] oV
   Creates unique ID like "a7x9k2m3"
        │
        ▼
3. [Task Creation] Qn4 or Un4
   Sets up task record, AbortController, cleanup
        │
        ▼
4. [Tool Filtering] Xk8
   Determines available tools for subagent
        │
        ▼
5. [Agent Loop] qh
   Executes subagent with filtered tools
        │
        ├─── Progress updates: [Progress Throttling] nl4
        │    Sends telemetry, updates state
        │
        ├─── If timeout: [Mid-Run Backgrounding]
        │    Transitions to background, main thread continues
        │
        ├─── If user cancels: [Abort Signal] x66
        │    Graceful termination, partial results preserved
        │
        └─── If teammate: [Mailbox] wl/x3
             Communicates with team via file-based queue
        │
        ▼
6. [Task Completion] $m8, Hm8, or d4q
   Updates status, notifies UI
```

---

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
**Status**: Complete - Deep algorithm analysis with source code