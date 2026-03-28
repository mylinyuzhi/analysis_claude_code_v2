# Algorithm Deep Dives - Subagent & Background Agents (Claude Code 2.1.76)

> Comprehensive analysis of key algorithms in the subagent and background agent systems,
> including task ID generation, tool filtering, abort propagation, and mailbox communication.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Algorithm 1: Task ID Generation

### Function: `generateTaskId` (oV)

**Location:** chunks.41.mjs:2410-2416

### What it does

Creates a unique, type-prefixed identifier for background tasks. The ID consists of:
- A single-character prefix indicating task type
- 8 random alphanumeric characters

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Task ID Generation                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. getTypePrefix(taskType)                                                 │
│     ┌─────────────────┐                                                     │
│     │ local_agent     │ → "a"                                               │
│     │ local_bash      │ → "b"                                               │
│     │ remote_agent    │ → "r"                                               │
│     │ in_process_team │ → "t"                                               │
│     │ local_workflow  │ → "w"                                               │
│     └─────────────────┘                                                     │
│                                                                              │
│  2. generateRandomBytes(8)                                                  │
│     ┌─────────────────────────────────────┐                                 │
│     │ crypto.randomBytes(8)               │                                 │
│     │ → [45, 127, 23, 88, 201, 12, 67, 9] │                                 │
│     └─────────────────────────────────────┘                                 │
│                                                                              │
│  3. Convert to alphanumeric                                                 │
│     ┌─────────────────────────────────────┐                                 │
│     │ CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz"                   │
│     │ for each byte: charset[byte % 36]    │                                 │
│     │ → "x", "v", "n", "k", "5", "c", "t", "9"                            │
│     └─────────────────────────────────────┘                                 │
│                                                                              │
│  4. Combine: prefix + random                                                │
│     ┌─────────────────────────────────────┐                                 │
│     │ "a" + "xvnk5ct9" = "axvnk5ct9"       │                                 │
│     └─────────────────────────────────────┘                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// generateTaskId - Create unique task identifier
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
    // Step 1: Get type prefix from lookup table
    let prefix = getTypePrefix(taskType);

    // Step 2: Generate 8 cryptographically secure random bytes
    let randomBytes = crypto.randomBytes(8);

    // Step 3: Convert each byte to a charset character
    let taskId = prefix;
    const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 8; i++) {
        taskId += CHARSET[randomBytes[i] % CHARSET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, k$3→getTypePrefix, N$3→crypto.randomBytes,
// G97→CHARSET
```

### Why This Approach

**Design Decisions:**

1. **Type Prefix**
   - Enables visual identification: "a3f4b2" is immediately recognizable as an agent task
   - Supports efficient filtering: `tasks.filter(t => t.id.startsWith('a'))`
   - File-friendly: Alphanumeric prefix works as filename component

2. **Cryptographic Randomness**
   - Uses Node.js `crypto.randomBytes()` (not `Math.random()`)
   - Unpredictable IDs prevent enumeration attacks
   - No collision risk in practice: 36^8 ≈ 2.8 trillion combinations per prefix

3. **36-Character Alphabet**
   - Lowercase alphanumeric (0-9, a-z)
   - Case-insensitive comparison works
   - No confusing characters (O/0, I/1/l)

---

## Algorithm 2: Tool Filtering for Subagents

### Function: `filterToolsForSubagent` (Xk8) + `applyToolFilters` (_c)

**Location:** chunks.93.mjs:1568-1590

### What it does

Filters the available tool set for subagents based on:
1. Agent type restrictions
2. Background mode restrictions
3. Teammate mode additions

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Tool Filtering Pipeline                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Input: allTools (complete tool set)                                        │
│                                                                              │
│  Stage 1: Agent Type Restrictions                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ agentDefinition.excludedTools                                        │   │
│  │                                                                      │   │
│  │ Example: Explore agent excludes Write, Edit                         │   │
│  │ Plan agent excludes Agent (no subagent spawning)                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Stage 2: Background Mode Restrictions (if isBackground = true)            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ BLOCKED: Task, TaskOutput, TaskStop, AskUserQuestion,              │   │
│  │          EnterPlanMode, ExitPlanMode                                │   │
│  │                                                                      │   │
│  │ ALLOWED: Read, Write, Edit, Bash, Grep, Glob, WebFetch,            │   │
│  │          WebSearch, TodoWrite, Skill, NotebookEdit, etc.            │   │
│  │                                                                      │   │
│  │ EXCEPTION: MCP tools (mcp__*) are always allowed                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Stage 3: Teammate Mode Additions (if isTeammate = true)                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ADD: SendMessage, CronCreate, CronDelete, CronList,                │   │
│  │      TaskCreate, TaskGet, TaskList, TaskUpdate                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Output: filteredTools (safe tool set for context)                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// filterToolsForSubagent - Filter tools for subagent context
// Location: chunks.93.mjs:1568-1590
// ============================================

// READABLE (for understanding):
function filterToolsForSubagent({
    allTools,
    agentDefinition,
    isBackground,
    isTeammate
}) {
    let filteredTools = [...allTools];

    // Stage 1: Apply agent type restrictions
    if (agentDefinition.excludedTools) {
        filteredTools = filteredTools.filter(
            tool => !agentDefinition.excludedTools.includes(tool.name)
        );
    }

    // Stage 2: Apply background mode restrictions
    if (isBackground) {
        filteredTools = filteredTools.filter(tool => {
            // MCP tools are always allowed
            if (tool.name.startsWith("mcp__")) return true;

            // Check against blocked set
            if (BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)) return false;

            // Check against allowed set
            return ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name);
        });
    }

    // Stage 3: Add teammate-specific tools
    if (isTeammate) {
        for (let toolName of TEAM_DELEGATE_TOOLS) {
            let tool = allTools.find(t => t.name === toolName);
            if (tool && !filteredTools.includes(tool)) {
                filteredTools.push(tool);
            }
        }
    }

    return filteredTools;
}
```

### Tool Access Matrix

| Tool | Sync Agent | Background Agent | Teammate |
|------|------------|------------------|----------|
| `Read` | ✓ | ✓ | ✓ |
| `Write` | ✓ | ✓ | ✓ |
| `Edit` | ✓ | ✓ | ✓ |
| `Bash` | ✓ | ✓ | ✓ |
| `Grep`/`Glob` | ✓ | ✓ | ✓ |
| `WebFetch`/`WebSearch` | ✓ | ✓ | ✓ |
| `TodoWrite` | ✓ | ✓ | ✓ |
| `Skill` | ✓ | ✓ | ✓ |
| `Agent` (Task) | ✓ | ✗ | ✗ |
| `TaskOutput` | ✓ | ✗ | ✓ |
| `TaskStop` | ✓ | ✗ | ✓ |
| `AskUserQuestion` | ✓ | ✗ | ✗ |
| `EnterPlanMode` | ✓ | ✗ | ✗ |
| `ExitPlanMode` | ✓ | ✗ | ✓ |
| `SendMessage` | ✗ | ✗ | ✓ |
| `CronCreate/Delete/List` | ✗ | ✗ | ✓ |

---

## Algorithm 3: Abort Signal Propagation

### Functions: `triggerAbortSignal` (x66), `killAllLocalAgents` (U4q)

**Location:** chunks.146.mjs:2012-2032

### What it does

Propagates abort signals through the task hierarchy, ensuring graceful termination of running agents and their resources.

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Abort Signal Propagation                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Action: Ctrl+C or Ctrl+F                                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  hasRunningAgents check                                              │   │
│  │  tasks.some(t => t.type === "local_agent" && t.status === "running") │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                             │                                                │
│                             ▼ true                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  U4q (killAllLocalAgents)                                            │   │
│  │                                                                      │   │
│  │  for each task where type === "local_agent" && status === "running":│   │
│  │      x66(taskId, setAppState)                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                             │                                                │
│                             ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  x66 (triggerAbortSignal)                                            │   │
│  │                                                                      │   │
│  │  1. Check task.status === "running"                                  │   │
│  │  2. Call abortController.abort()                                     │   │
│  │  3. Call unregisterCleanup()                                         │   │
│  │  4. Update state: status = "killed"                                  │   │
│  │  5. Clear: abortController = undefined                               │   │
│  │  6. Notify: $O(taskId)                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                             │                                                │
│                             ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Agent Loop Response (qh)                                            │   │
│  │                                                                      │   │
│  │  if (abortController.signal.aborted) {                               │   │
│  │      throw new AbortError();                                         │   │
│  │  }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// triggerAbortSignal - Abort a running task
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
    let wasAborted = false;

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only abort running tasks
        if (task.status !== "running") return task;

        wasAborted = true;

        // Trigger abort on the controller
        task.abortController?.abort();

        // Run cleanup handler (removes process exit listener)
        task.unregisterCleanup?.();

        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep only last message for memory efficiency
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Notify completion if we actually aborted
    if (wasAborted) {
        notifyCompletion(taskId);
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, i9→atomicUpdateTask,
// $O→notifyCompletion
```

### killAllLocalAgents (U4q)

```javascript
// ============================================
// killAllLocalAgents - Kill all running agents
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    for (let [taskId, task] of Object.entries(tasks)) {
        if (task.type === "local_agent" && task.status === "running") {
            triggerAbortSignal(taskId, setAppState);
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, x66→triggerAbortSignal
```

---

## Algorithm 4: Mailbox Communication

### Functions: `readMailbox` (wl), `writeToMailbox` (x3)

**Location:** chunks.132.mjs:3-55

### What it does

Implements a file-based message queue for inter-agent communication between teammates.

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Mailbox Architecture                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  File Location: ~/.claude/sessions/{sessionId}/agents/{agentName}/mailbox  │
│                                                                              │
│  Message Format (JSONL):                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ {"index":0,"from":"orchestrator","text":"...","read":false}         │   │
│  │ {"index":1,"from":"teammate-abc","text":"...","read":true}          │   │
│  │ {"index":2,"from":"teammate-xyz","text":"...","read":false}         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Write Flow (x3):                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Validate team context                                            │   │
│  │ 2. Create mailbox file if not exists                                │   │
│  │ 3. Acquire file lock (.lock file)                                   │   │
│  │ 4. Read existing messages                                           │   │
│  │ 5. Append new message with read=false                               │   │
│  │ 6. Write atomically                                                 │   │
│  │ 7. Release lock                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Read Flow (wl):                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Resolve mailbox path                                             │   │
│  │ 2. Read file content                                                │   │
│  │ 3. Parse JSONL                                                      │   │
│  │ 4. Return message array (or [] if no file)                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Mark Read (Vc6):                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Acquire lock                                                     │   │
│  │ 2. Read messages                                                    │   │
│  │ 3. Update message[index].read = true                                │   │
│  │ 4. Write atomically                                                 │   │
│  │ 5. Release lock                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// readMailbox - Read messages from mailbox
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
    let mailboxPath = getMailboxPath(agentName, teamName);
    log(`[TeammateMailbox] readMailbox: path=${mailboxPath}`);

    try {
        let content = await fs.readFile(mailboxPath, "utf-8");
        let messages = parseJsonl(content);
        log(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`);
        return messages;
    } catch (err) {
        if (err.code === "ENOENT") {
            log("[TeammateMailbox] readMailbox: file does not exist");
            return [];  // No mailbox = no messages
        }
        log(`Failed to read inbox for ${agentName}: ${err}`);
        reportError(err);
        return [];
    }
}

// Mapping: wl→readMailbox, A→agentName, q→teamName, FY6→getMailboxPath,
// xd4→fs.readFile, i1→parseJsonl, k→log, _6→reportError
```

```javascript
// ============================================
// writeToMailbox - Write message with locking
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
    await validateTeamContext(teamName);
    let mailboxPath = getMailboxPath(recipientName, teamName);
    let lockPath = `${mailboxPath}.lock`;

    log(`[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}`);

    // Create mailbox file if it doesn't exist
    try {
        await fs.writeFile(mailboxPath, "[]", { encoding: "utf-8", flag: "wx" });
        log("[TeammateMailbox] writeToMailbox: created new inbox file");
    } catch (err) {
        if (err.code !== "EEXIST") {
            log(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${err}`);
            reportError(err);
            return;
        }
    }

    // Acquire lock and write
    let releaseLock;
    try {
        releaseLock = await properLock(mailboxPath, { lockfilePath: lockPath });

        let messages = await readMailbox(recipientName, teamName);
        messages.push({ ...message, read: false });

        await fs.writeFile(mailboxPath, JSON.stringify(messages, null, 2), "utf-8");
        log(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);
    } catch (err) {
        log(`Failed to write to inbox for ${recipientName}: ${err}`);
        reportError(err);
    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: x3→writeToMailbox, A→recipientName, q→message, K→teamName,
// OTY→validateTeamContext, FY6→getMailboxPath, Pf6→fs.writeFile,
// Nc6.lock→properLock, wl→readMailbox, B6→JSON.stringify
```

### Key Insight: File Locking

The mailbox uses `proper-lockfile` for concurrent access protection:

1. **Prevents race conditions** - Multiple agents can't write simultaneously
2. **Ensures consistency** - Read-modify-write is atomic
3. **Handles crashes** - Locks are released on process exit

---

## Algorithm 5: Progress Throttling

### Function: Progress Turn-Counting (inline in vIY, NOT TIY)

> **CORRECTION:** `TIY` is `countUniqueUris` (counts unique URIs for LSP), NOT `countTurnsSinceLastProgress`. The progress throttling logic uses a different mechanism inlined within `getUnifiedTasksAttachment` (vIY). See `key_algorithms_deep_dive.md` Algorithm 10.

### What it does

Determines whether to show a progress update based on how many assistant turns have passed since the last progress for each task.

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Progress Throttle Algorithm                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Goal: Show progress updates every ~3 assistant turns                       │
│                                                                              │
│  Message History (simplified):                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [0] user: "Find all uses of createTaskId"                            │   │
│  │ [1] assistant: "I'll search..."           ← turn count: 1           │   │
│  │ [2] attachment: task_progress (taskId: a1)                           │   │
│  │ [3] assistant: "Found 5 files..."          ← turn count: 2           │   │
│  │ [4] assistant: "Checking each file..."     ← turn count: 3           │   │
│  │ [5] assistant: "Writing summary..."        ← turn count: 4           │   │
│  │                                                                      │   │
│  │ Progress for a1 shown at turn 2 (index 2)                           │   │
│  │ Current turn count since last progress: 4 - 2 = 2                   │   │
│  │ Throttle threshold: 3                                                │   │
│  │ Result: 2 < 3 → NO progress shown this turn                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Backwards Iteration:                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Start from most recent message                                      │   │
│  │                                                                      │   │
│  │ for (i = messages.length - 1; i >= 0; i--)                          │   │
│  │   if (assistant message) turnCount++                                │   │
│  │   if (task_progress for task) return turnCount                      │   │
│  │                                                                      │   │
│  │ // If no progress found → return Infinity (always show first)       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code (Pseudocode Restoration)

```javascript
// ============================================
// Progress turn-counting algorithm (inline in vIY, NOT TIY)
// TIY is countUniqueUris (LSP URI counting), not progress throttling.
// Location: chunks.142.mjs:2703-2717 (inlined in vIY)
// ============================================

function countTurnsSinceLastProgressInline(messages) {
    let turnsSinceProgress = new Map();  // taskId → turn count
    let seenTasks = new Set();
    let turnCount = 0;

    // Iterate BACKWARDS from most recent
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

    // New tasks (not found) get Infinity
    // This ensures first progress is always shown
    return turnsSinceProgress;
}

// Usage:
function shouldShowProgress(taskId, turnsSinceProgress) {
    const THROTTLE_THRESHOLD = 3;
    let turns = turnsSinceProgress.get(taskId);
    return turns === undefined || turns >= THROTTLE_THRESHOLD;
}
```

### Why This Approach

1. **Backwards iteration** is efficient - stop as soon as we find the last progress
2. **Infinity default** for new tasks ensures first progress always shows
3. **Per-task tracking** allows different throttle states for different tasks
4. **3-turn threshold** balances information density with noise reduction

---

## Related Documents

- [execution_flow_deep_dive.md](./08_subagent/execution_flow_deep_dive.md) - Agent loop execution
- [communication_and_coordination.md](./08_subagent/communication_and_coordination.md) - Teammate messaging
- [task_lifecycle.md](./26_background_agents/task_lifecycle.md) - Task state machine
- [kill_handlers.md](./26_background_agents/kill_handlers.md) - Kill handler implementations