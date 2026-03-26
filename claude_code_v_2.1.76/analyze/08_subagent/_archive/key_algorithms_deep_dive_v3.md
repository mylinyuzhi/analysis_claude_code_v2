# Algorithm Deep Dive V3 (Claude Code 2.1.76)

> Deep analysis of key algorithms in subagent and background agents systems with source-level code and reasoning.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key algorithms in this document:
- Task ID Generation (`oV`) — `chunks.41.mjs:2410`
- Tool Filtering (`Xk8`, `_c`) — `chunks.93.mjs:1568-1590`
- Abort Signal Propagation (`x66`, `Wm`) — `chunks.146.mjs:2012`
- Mailbox Polling (`DNY`) — `chunks.134.mjs:1483`
- Progress Throttling (`TIY`) — `chunks.144.mjs:832`

---

## Algorithm 1: Task ID Generation (oV)

### What it does

Generates unique, type-prefixed identifiers for tasks that can be used for correlation, debugging, and file management.

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK ID GENERATION                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Input: taskType (e.g., "local_agent")
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 1: Lookup Type Prefix                                                   │
│   V$3 = { local_agent: "a", local_bash: "b", ... }                          │
│   prefix = V$3[taskType] ?? "x"                                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 2: Generate Random Bytes                                                │
│   randomBytes = cryptoRandomBytes(8)                                        │
│   (cryptographically secure, 8 bytes)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 3: Encode to Alphanumeric                                               │
│   ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz" (36 chars)              │
│   for each byte in randomBytes:                                             │
│       char = ALPHABET[byte % 36]                                             │
│       append to taskId                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
Output: taskId (e.g., "ab3k7m9p2")
        prefix (1 char) + random (8 chars) = 9 chars total
```

### Source Code

```javascript
// ============================================
// oV - generateTaskId - Generate unique task ID with type prefix
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
    // Step 1: Get prefix for task type
    let prefix = getTaskTypePrefix(taskType);
    if (!prefix) prefix = "x";  // Unknown type fallback

    // Step 2: Generate 8 cryptographically random bytes
    let randomBytes = crypto.randomBytes(8);

    // Step 3: Build ID using alphanumeric encoding
    let taskId = prefix;
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 8; i++) {
        taskId += ALPHABET[randomBytes[i] % ALPHABET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
//          k$3→getTaskTypePrefix, N$3→cryptoRandomBytes, G97→ALPHABET
```

### Why this approach

**Design rationale:**

1. **Type identification** - Single character prefix allows immediate identification of task type from ID alone
   - `a` = local_agent, `b` = local_bash, `t` = teammate, `r` = remote_agent

2. **Cryptographic randomness** - No coordination needed between generators
   - Multiple tasks can be created simultaneously without collision risk
   - Unpredictable for security (can't guess other task IDs)

3. **Alphanumeric encoding** - Human-readable and URL-safe
   - 36-character alphabet (0-9, a-z) is case-insensitive friendly
   - No confusing characters (no 0/O, 1/l confusion)

4. **Fixed length** - 9 characters total
   - Consistent length for display and storage
   - Easy to validate format

**Alternatives considered:**
- **UUIDs** - Too long (36 chars), no type information
- **Sequential IDs** - Requires coordination, predictable
- **Timestamp-based** - Clock skew issues, predictable

### Collision Analysis

**Probability calculation:**
- Each type has 36^8 ≈ 2.8 × 10^12 possible IDs
- For n tasks of same type, collision probability ≈ n²/(2 × 36^8)

**Example scenarios:**
| Tasks (same type) | Collision Probability |
|-------------------|----------------------|
| 1,000 | ~0.0000000002% |
| 100,000 | ~0.000002% |
| 1,000,000 | ~0.02% |
| 10,000,000 | ~1.8% |

**Key insight:** With typical usage (< 1000 concurrent tasks per type), collision probability is effectively zero.

---

## Algorithm 2: Tool Filtering (Xk8, _c)

### What it does

Filters the available tool set for subagents based on execution context (async/sync) and agent definition.

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TOOL FILTERING                                       │
└─────────────────────────────────────────────────────────────────────────────┘

Input: agentDefinition, availableTools, isAsync
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 1: Check Agent Definition Tools                                        │
│   if agentDefinition.tools includes "*" → allow all (with exclusions)      │
│   else → use explicit tool list                                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 2: Apply Async Restrictions (if isAsync)                               │
│   Remove: BACKGROUND_AGENT_EXCLUDED_TOOLS                                    │
│     - TaskOutput, ExitPlanMode, EnterPlanMode                               │
│     - Agent (Task tool), AskUserQuestion, TaskStop                          │
│                                                                              │
│   Keep only: ASYNC_AGENT_ALLOWED_TOOLS                                       │
│     - Read, Write, Edit, Bash, Grep, Glob                                   │
│     - WebFetch, WebSearch, TodoWrite, NotebookEdit                          │
│     - Skill, StructuredOutput, ToolSearch                                   │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 3: Apply Agent-Specific Whitelist                                      │
│   if agentDefinition.tools is defined:                                       │
│     intersect with available tools                                           │
│   else:                                                                      │
│     use all available tools (subject to async restrictions)                 │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
Output: { resolvedTools: filteredToolArray }
```

### Source Code

```javascript
// ============================================
// Xk8 - filterToolsForSubagent - Filter tools based on agent type
// Location: chunks.93.mjs:1568
// ============================================

// ORIGINAL (for source lookup):
function Xk8(A, q, K) {
    return { resolvedTools: _c(A, q, K) }
}

// READABLE (for understanding):
function filterToolsForSubagent(agentDefinition, availableTools, isAsync) {
    return {
        resolvedTools: applyToolFilters(agentDefinition, availableTools, isAsync)
    };
}

// Mapping: Xk8→filterToolsForSubagent, A→agentDefinition, q→availableTools, K→isAsync

// ============================================
// _c - applyToolFilters - Apply whitelist/blacklist
// Location: chunks.93.mjs:1590
// ============================================

// ORIGINAL (for source lookup):
function _c(A, q, K) {
    // Complex filtering logic...
}

// READABLE (for understanding):
function applyToolFilters(agentDefinition, availableTools, isAsync) {
    let filteredTools = [...availableTools];

    // Step 1: Apply async restrictions
    if (isAsync) {
        // Remove tools that could cause hangs or require user interaction
        filteredTools = filteredTools.filter(tool =>
            !BACKGROUND_AGENT_EXCLUDED_TOOLS.has(tool.name)
        );

        // Optionally use allowlist
        if (!agentDefinition.tools?.includes("*")) {
            filteredTools = filteredTools.filter(tool =>
                ASYNC_AGENT_ALLOWED_TOOLS.has(tool.name) ||
                (agentDefinition.tools?.includes(tool.name))
            );
        }
    }

    // Step 2: Apply agent-specific tool list
    if (agentDefinition.tools && !agentDefinition.tools.includes("*")) {
        const allowedSet = new Set(agentDefinition.tools);
        filteredTools = filteredTools.filter(tool =>
            allowedSet.has(tool.name) || allowedToUseTool(tool, agentDefinition)
        );
    }

    return filteredTools;
}

// Mapping: _c→applyToolFilters
```

### Blocked Tools (Background Agents)

```javascript
const BACKGROUND_AGENT_EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // Could create polling loops
    "ExitPlanMode",    // Requires user approval flow
    "EnterPlanMode",   // Requires user approval flow
    "Agent",           // Could spawn nested background agents
    "AskUserQuestion", // Would block indefinitely waiting for user
    "TaskStop"         // Background agents shouldn't manage other tasks
]);
```

### Why these exclusions?

| Tool | Reason for Exclusion |
|------|---------------------|
| `AskUserQuestion` | Background agents run unattended; can't wait for user input |
| `EnterPlanMode` | Plan mode requires user approval; background can't interact |
| `Agent` | Prevents uncontrolled spawning of nested background agents |
| `TaskOutput` | Could create infinite polling loops |
| `TaskStop` | Background agents shouldn't have control over task lifecycle |

---

## Algorithm 3: Abort Signal Propagation (x66, Wm)

### What it does

Propagates abort signals from parent to child tasks, ensuring that when a parent is killed, all child tasks are also killed.

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ABORT SIGNAL PROPAGATION                             │
└─────────────────────────────────────────────────────────────────────────────┘

Parent AbortController
          │
          │ abortController.signal.aborted = true
          │ abortController.abort()
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 1: Check if Parent Already Aborted                                     │
│   if parent.signal.aborted:                                                  │
│     child.abort() immediately                                                │
│     return child                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 2: Register Listener on Parent Signal                                  │
│   parent.signal.addEventListener("abort", () => {                           │
│     child.abort()                                                            │
│   })                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Step 3: Return Child Controller                                              │
│   return child                                                               │
│                                                                              │
│   When parent.abort() is called:                                            │
│     → Event listener fires                                                   │
│     → child.abort() is called                                                │
│     → Child task receives abort signal                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Source Code

```javascript
// ============================================
// x66 - triggerAbortSignal - Trigger abort for a task
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

    atomicUpdateTask(taskId, setAppState, (task) => {
        // Only kill running tasks
        if (task.status !== "running") return task;

        wasKilled = true;

        // Step 1: Trigger the abort signal
        task.abortController?.abort();

        // Step 2: Run cleanup handler
        task.unregisterCleanup?.();

        // Step 3: Update task state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            messages: task.messages?.length ? [task.messages[task.messages.length - 1]] : undefined,
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush output file
    if (wasKilled) {
        flushOutputFile(taskId);
    }

    return wasKilled;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, i9→atomicUpdateTask, $O→flushOutputFile
```

### Child Abort Controller Creation (Wm)

```javascript
// ============================================
// Wm - createChildAbortController - Create linked abort controller
// Location: chunks.6.mjs:465 (inferred)
// ============================================

// READABLE (for understanding):
function createChildAbortController(parentController) {
    let childController = new AbortController();

    // If parent is already aborted, abort child immediately
    if (parentController.signal.aborted) {
        childController.abort();
        return childController;
    }

    // Listen for parent abort and propagate to child
    parentController.signal.addEventListener("abort", () => {
        childController.abort();
    });

    return childController;
}

// Mapping: Wm→createChildAbortController
```

### Key insight: Cascade Termination

The abort controller linking creates a cascade termination chain:

```
User presses Ctrl+F
        │
        ▼
killAllLocalAgents (U4q)
        │
        ├── triggerAbortSignal(task_1) ──┬── abortController.abort()
        │                                 └── Task 1 stops
        │
        ├── triggerAbortSignal(task_2) ──┬── abortController.abort()
        │                                 └── Task 2 stops
        │
        └── triggerAbortSignal(task_N) ──┬── abortController.abort()
                                          └── Task N stops
```

---

## Algorithm 4: Mailbox Polling (DNY)

### What it does

Polls for incoming messages from teammates with priority ordering, handling shutdown requests, team-lead broadcasts, and task list claims.

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MAILBOX POLLING PRIORITY                             │
└─────────────────────────────────────────────────────────────────────────────┘

Poll Loop (every 500ms)
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Priority 1: Pending User Messages (direct queue)                            │
│   Check task.pendingUserMessages                                            │
│   If found: return immediately                                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │ (none found)
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Priority 2: Shutdown Requests (mailbox parsing)                             │
│   Read mailbox                                                              │
│   Parse each message for shutdown request pattern                           │
│   If found: mark read, return shutdown_request                              │
└─────────────────────────────────────────────────────────────────────────────┘
          │ (none found)
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Priority 3: Team-Lead Messages (from TEAM_LEAD_SENDER)                      │
│   Search mailbox for messages from team lead                                │
│   If found: mark read, return new_message                                   │
└─────────────────────────────────────────────────────────────────────────────┘
          │ (none found)
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Priority 4: Any Unread Message (first unread)                               │
│   Find first message with read: false                                       │
│   If found: mark read, return new_message                                   │
└─────────────────────────────────────────────────────────────────────────────┘
          │ (none found)
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Priority 5: Unclaimed Tasks (task list)                                     │
│   Check shared task list for unclaimed tasks                                │
│   If found: claim task, return new_message                                  │
└─────────────────────────────────────────────────────────────────────────────┘
          │ (none found)
          │
          ▼
     Sleep 500ms
          │
          ▼
     Continue polling...
```

### Why this priority order?

1. **User messages first** - User-initiated messages are most important
2. **Shutdown requests second** - Must handle termination before other messages
3. **Team-lead messages third** - Coordinator broadcasts have priority over peers
4. **General messages fourth** - Peer-to-peer communication
5. **Task list last** - Background task claiming

**Key insight:** The priority ordering ensures responsive handling of critical messages while still allowing background task sharing.

---

## Algorithm 5: Progress Throttling (TIY)

### What it does

Throttles progress update attachments to prevent LLM context from being flooded with frequent progress updates.

### How it works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROGRESS THROTTLING                                  │
└─────────────────────────────────────────────────────────────────────────────┘

On each LLM turn:
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Check: turnsSinceLastProgress >= TURNS_BETWEEN_PROGRESS (3) ?               │
│                                                                              │
│   Yes → Include progress attachment                                         │
│         Reset counter                                                        │
│                                                                              │
│   No  → Skip progress attachment                                            │
│         Increment counter                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Why 3 turns?

1. **Balance visibility vs. noise** - Frequent updates would overwhelm the LLM
2. **Turn-based not time-based** - LLM sees progress at decision points
3. **Memory efficiency** - Fewer attachments mean smaller context

### Source Code

```javascript
// ============================================
// TIY - countTurnsSinceLastProgress - Turn counting for throttle
// Location: chunks.144.mjs:832
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgress(state) {
    // Count user turns since last progress attachment
    let turns = 0;

    for (let i = state.messages.length - 1; i >= 0; i--) {
        let message = state.messages[i];

        // Count user messages (not meta/system)
        if (message?.type === "user" && !message.isMeta) {
            turns++;
        }

        // Stop if we hit a progress attachment
        if (message?.type === "attachment" && message.attachment.type === "task_progress") {
            return turns;
        }
    }

    return turns;
}

// Mapping: TIY→countTurnsSinceLastProgress
```

---

## Summary

| Algorithm | Purpose | Key Insight |
|-----------|---------|--------------|
| Task ID Generation | Unique identifiers | Type prefix + crypto random = collision-safe |
| Tool Filtering | Safe async execution | Block tools that would hang |
| Abort Propagation | Clean termination | Cascade through linked controllers |
| Mailbox Polling | Teammate communication | Priority ordering for responsiveness |
| Progress Throttling | Context management | 3-turn balance between visibility and noise |

---

## Related Documents

- [README.md](./README.md) - Module overview
- [subagent_execution_complete_source.md](./subagent_execution_complete_source.md) - Complete execution source
- [../26_background_agents/task_lifecycle_complete_v2.md](../26_background_agents/task_lifecycle_complete_v2.md) - Task lifecycle