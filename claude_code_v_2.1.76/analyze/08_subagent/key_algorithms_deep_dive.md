# Key Algorithms Deep Dive (Claude Code 2.1.76)

> Source-level analysis of key algorithms in the subagent and background agent systems.
> Each algorithm includes reasoning, trade-offs, and implementation details.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Algorithm 1: Task ID Generation

### Location
- `generateTaskId` (oV) — `chunks.41.mjs:2410`
- `TASK_TYPE_PREFIXES` (V$3) — `chunks.41.mjs:2438`

### What it does

Generates unique task identifiers with type prefixes for human readability and collision avoidance.

### How it works

```javascript
// ============================================
// Task ID Generation Algorithm
// Location: chunks.41.mjs:2410-2438
// ============================================

// READABLE (for understanding):
const TASK_TYPE_PREFIXES = {
    "local_agent": "a",
    "local_bash": "b",
    "in_process_teammate": "t",
    "remote_agent": "r",
    "local_workflow": "w"
};

function generateTaskId(taskType) {
    // Step 1: Get prefix for task type
    let prefix = TASK_TYPE_PREFIXES[taskType] || "x";

    // Step 2: Generate 8 random alphanumeric characters
    let randomPart = generateRandomString(8);

    // Step 3: Combine prefix + random
    return prefix + randomPart;
}

function generateRandomString(length) {
    let bytes = crypto.randomBytes(length);
    let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
}
```

### Why this approach

**Human-readable prefixes:**
- `a3f4b2` → Agent task
- `b7c4e1` → Bash task
- `t5d2a8` → Teammate task

**Collision probability:**
- 8 characters from 36-character alphabet
- 36^8 = ~2.8 trillion possible IDs
- Birthday paradox: 50% collision at ~60,000 concurrent tasks
- Collision extremely unlikely in practice

**Trade-offs:**
- ✓ Human-readable type indication
- ✓ No coordination needed (no central counter)
- ✓ Sortable by type
- ✗ Slightly longer than pure numeric IDs

---

## Algorithm 2: Tool Filtering for Subagents

### Location
- `filterToolsForSubagent` (Xk8) — `chunks.93.mjs:1568`
- `resolveToolFilter` (_c) — `chunks.93.mjs:1590`

### What it does

Filters the available tools for a subagent based on its execution mode and agent type.

### How it works

```javascript
// ============================================
// Tool Filtering Algorithm
// Location: chunks.93.mjs:1568-1620
// ============================================

// READABLE (for understanding):
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely
    "TaskStop"         // Background agents shouldn't manage other tasks
]);

const ASYNC_AGENT_ALLOWED_TOOLS = new Set([
    "Read", "WebSearch", "TodoWrite", "Grep", "WebFetch", "Glob",
    "Bash", "Edit", "Write", "NotebookEdit", "Skill",
    "StructuredOutput", "ToolSearch", "EnterWorktree", "ExitWorktree"
]);

function filterToolsForSubagent({
    allTools,
    agentDefinition,
    isBackground,
    isTeammate
}) {
    let filteredTools = [...allTools];

    // Step 1: Apply agent type restrictions
    if (agentDefinition.excludedTools) {
        filteredTools = filteredTools.filter(
            tool => !agentDefinition.excludedTools.includes(tool.name)
        );
    }

    // Step 2: Apply background mode restrictions
    if (isBackground) {
        filteredTools = filteredTools.filter(tool => {
            // MCP tools always allowed
            if (tool.name.startsWith("mcp__")) return true;

            // Check against blocked set
            if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

            // Check against allowed set
            return ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name);
        });
    }

    // Step 3: Apply teammate mode additions
    if (isTeammate) {
        // Add team communication tools
        let teamTools = ["SendMessage", "CronCreate", "CronDelete", "CronList"];
        for (let toolName of teamTools) {
            let tool = allTools.find(t => t.name === toolName);
            if (tool && !filteredTools.includes(tool)) {
                filteredTools.push(tool);
            }
        }
    }

    // Step 4: Apply mode-specific filters
    return resolveToolFilter({
        tools: filteredTools,
        mode: agentDefinition.mode,
        allowedTools: agentDefinition.allowedTools
    });
}

function resolveToolFilter({ tools, mode, allowedTools }) {
    // If allowedTools specified, filter to that list
    if (allowedTools?.length > 0) {
        let allowedSet = new Set(allowedTools);
        tools = tools.filter(tool =>
            allowedSet.has(tool.name) || tool.name.startsWith("mcp__")
        );
    }

    return { resolvedTools: tools };
}
```

### Why this approach

**Layered filtering:**
1. Agent type restrictions (agent definition)
2. Execution mode restrictions (background safety)
3. Teammate additions (collaboration tools)
4. Mode-specific filters (plan mode, etc.)

**Each layer is independent:**
- Can add/remove layers without affecting others
- Order matters: more restrictive → less restrictive

**Trade-offs:**
- ✓ Clear separation of concerns
- ✓ Easy to understand what tools are available
- ✓ Security through explicit allowlist
- ✗ Configuration complexity

---

## Algorithm 3: Abort Signal Propagation

### Location
- `triggerAbortSignal` (x66) — `chunks.146.mjs:2012`
- `killAllLocalAgents` (U4q) — `chunks.146.mjs:2029`
- `createChildAbortController` (R61) — `chunks.6.mjs:465`

### What it does

Propagates abort signals from parent to child tasks, enabling graceful cooperative cancellation.

### How it works

```javascript
// ============================================
// Abort Signal Propagation Algorithm
// Location: chunks.146.mjs:2012-2032
// ============================================

// READABLE (for understanding):
function triggerAbortSignal(taskId, setAppState) {
    // Update task to record abort
    atomicUpdateTask(taskId, setAppState, (task) => {
        if (task.status !== "running") return task;
        return {
            ...task,
            // Signal will be aborted by abortController
        };
    });

    // Trigger the abort controller
    let task = getTask(taskId);
    if (task?.abortController) {
        task.abortController.abort("killed");
    }
}

function killAllLocalAgents(tasks, setAppState) {
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Child abort controller links to parent
function createChildAbortController(parentController) {
    let childController = new AbortController();

    // If parent aborts, child aborts too
    if (parentController) {
        parentController.signal.addEventListener("abort", () => {
            childController.abort(parentController.signal.reason);
        });
    }

    return childController;
}
```

### Cooperative Cancellation

The agent loop checks abort signal between turns:

```javascript
// In agentLoopRunner (qh)
try {
    for await (let event of llmMessageLoop(...)) {
        // Check abort signal
        if (abortController.signal.aborted) {
            throw new AbortError();
        }
        yield event;
    }
} finally {
    // Cleanup runs even on abort
    await cleanup();
}
```

### Why this approach

**Cooperative cancellation:**
- Agent checks signal between turns
- In-progress tool calls complete gracefully
- Cleanup always runs (in finally block)

**Parent-child linking:**
- Parent abort automatically triggers child abort
- No manual signal propagation needed
- Clean shutdown chain

**Trade-offs:**
- ✓ Graceful shutdown
- ✓ No resource leaks (cleanup always runs)
- ✓ Hierarchical abort propagation
- ✗ Slight delay between signal and actual stop

---

## Algorithm 4: Mailbox Lock-Based Access

### Location
- `writeToMailbox` (x3) — `chunks.132.mjs:22`
- `markMessageAsReadByIndex` (Vc6) — `chunks.132.mjs:57`

### What it does

Provides safe concurrent access to mailbox files using file-based locks.

### How it works

```javascript
// ============================================
// File-Based Lock Algorithm
// Location: chunks.132.mjs:22-55
// ============================================

// READABLE (for understanding):
const LOCK_OPTIONS = {
    stale: 10000,    // Lock considered stale after 10s
    retries: 3,      // Retry 3 times on conflict
    retryWait: 100   // Wait 100ms between retries
};

async function writeToMailbox(recipient, message, teamName) {
    let mailboxPath = getMailboxPath(recipient, teamName);
    let lockPath = `${mailboxPath}.lock`;

    // Step 1: Create file if needed (atomic)
    try {
        await fs.writeFile(mailboxPath, "[]", { flag: "wx" });
    } catch (e) {
        if (e.code !== "EEXIST") throw e;
    }

    // Step 2: Acquire lock
    let releaseLock;
    try {
        releaseLock = await fileLock.lock(mailboxPath, {
            lockfilePath: lockPath,
            ...LOCK_OPTIONS
        });

        // Step 3: Read-modify-write (atomic under lock)
        let messages = await readMailbox(recipient, teamName);
        messages.push({ ...message, read: false });
        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2));

    } finally {
        // Step 4: Always release lock
        if (releaseLock) await releaseLock();
    }
}
```

### Why this approach

**File-based locks:**
- Works across processes (not just threads)
- Survives process crashes (lock file cleanup)
- No external dependencies

**Atomic create (wx flag):**
- `wx` = write exclusive
- Fails if file exists
- First process wins

**Stale lock detection:**
- Locks older than 10s are considered dead
- Prevents permanent deadlock from crashes

**Trade-offs:**
- ✓ Cross-process safety
- ✓ Crash recovery
- ✓ Simple implementation
- ✗ Slightly slower than in-memory
- ✗ Requires filesystem access

---

## Algorithm 5: Progress Throttling

### Location
- `countTurnsSinceLastProgress` (TIY) — `chunks.144.mjs:832`
- Part of `getUnifiedTasksAttachment` (vIY)

### What it does

Limits the frequency of progress notifications to avoid noise while keeping users informed.

### How it works

```javascript
// ============================================
// Progress Throttling Algorithm
// Location: chunks.142.mjs:2703-2717
// ============================================

// READABLE (for understanding):
const PROGRESS_THROTTLE_TURNS = 3;

function countTurnsSinceLastProgress(messages) {
    let turnsSinceProgress = new Map();  // taskId -> turn count
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate BACKWARDS from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Count assistant turns (skip whitespace-only)
        if (message?.type === "assistant" && !isWhitespaceOnly(message)) {
            turnCount++;
        }
        // Found last progress reminder for a task
        else if (message?.type === "attachment" &&
                 message.attachment.type === "task_progress") {
            let taskId = message.attachment.taskId;
            if (!seenTasks.has(taskId)) {
                turnsSinceProgress.set(taskId, turnCount);
                seenTasks.add(taskId);
            }
        }
    }

    return turnsSinceProgress;
}

function shouldShowProgress(taskId, messages) {
    let turnsMap = countTurnsSinceLastProgress(messages);
    let turnsSinceProgress = turnsMap.get(taskId);

    // If never shown before (infinity), always show
    if (turnsSinceProgress === undefined) return true;

    // Show if >= PROGRESS_THROTTLE_TURNS since last progress
    return turnsSinceProgress >= PROGRESS_THROTTLE_TURNS;
}
```

### Why this approach

**Backwards iteration:**
- Efficiently finds most recent progress
- No need to scan entire history
- O(n) where n = messages since last progress

**3-turn threshold:**
- Balances informativeness with noise
- 3 turns ≈ 15-30 seconds typical
- Prevents notification spam

**Per-task tracking:**
- Each task has independent throttle
- Fast task doesn't block slow task's updates

**Trade-offs:**
- ✓ Prevents notification spam
- ✓ Still informative
- ✓ Per-task granularity
- ✗ May miss rapid progress updates

---

## Algorithm 6: Fork Context Cloning

### Location
- `cloneForkContext` (Fx8) — `chunks.133.mjs:1788`

### What it does

Creates an isolated copy of the message context for a forked subagent, removing orphaned tool calls.

### How it works

```javascript
// ============================================
// Fork Context Cloning Algorithm
// Location: chunks.133.mjs:1788-1804
// ============================================

// READABLE (for understanding):
function cloneForkContext(messages) {
    // Step 1: Build set of tool_use IDs that have results
    let toolResultIds = new Set();

    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        toolResultIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // Step 2: Filter out orphaned tool_use blocks
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Remove if contains orphaned tool_use (no result)
                let hasOrphanedToolUse = content.some(
                    (block) => block.type === "tool_use" &&
                               block.id &&
                               !toolResultIds.has(block.id)
                );
                return !hasOrphanedToolUse;
            }
        }
        return true;
    });
}
```

### Why this approach

**Orphan removal:**
- Tool calls without results would confuse the LLM
- Could cause "waiting for result" state
- Clean context = better agent behavior

**Single pass:**
- O(n) time complexity
- Collect IDs first, then filter
- Memory efficient (uses Set for lookup)

**Trade-offs:**
- ✓ Prevents orphaned tool_use errors
- ✓ Clean context for fork
- ✓ Single pass algorithm
- ✗ May remove useful context in some cases

---

## Summary

| Algorithm | Key Insight | Time Complexity |
|-----------|-------------|-----------------|
| Task ID Generation | Human-readable prefixes + random collision avoidance | O(1) |
| Tool Filtering | Layered filtering with clear priorities | O(n) where n = tools |
| Abort Signal Propagation | Cooperative cancellation with parent-child linking | O(k) where k = tasks |
| Mailbox Lock | File-based atomic read-modify-write | O(1) + I/O |
| Progress Throttling | Backwards iteration for efficiency | O(n) where n = messages |
| Fork Context Cloning | Two-pass: collect IDs, then filter | O(n) where n = messages |

---

## Related Documents

- [task_state_machine_source_restored.md](../26_background_agents/task_state_machine_source_restored.md) - State machine
- [mailbox_communication_source_restored.md](./mailbox_communication_source_restored.md) - Mailbox details
- [execution_flow_deep_dive.md](./execution_flow_deep_dive.md) - Agent loop