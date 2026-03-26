# Key Algorithms Deep Dive V4 (Claude Code 2.1.76)

> Complete source-level analysis of key algorithms in the subagent system including Task ID generation, Fork Context cloning, Tool Filtering, and Abort Signal propagation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` - Generate task ID — `chunks.41.mjs:2410`
- `Fx8` - Clone fork context — `chunks.133.mjs:1788`
- `x66` - Trigger abort signal — `chunks.146.mjs:2012`
- `U4q` - Kill all local agents — `chunks.146.mjs:2029`
- `i9` - Atomic update task — `chunks.90.mjs:3003`

---

## Algorithm 1: Task ID Generation (oV)

**What it does:** Generates unique, type-prefixed task IDs using cryptographic randomness.

**How it works:**

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
    // Step 1: Get type prefix (single character)
    let prefix = getTaskTypePrefix(taskType);  // k$3

    // Step 2: Generate 8 cryptographically random bytes
    let randomBytes = crypto.randomBytes(8);  // N$3

    // Step 3: Build ID using alphanumeric encoding
    let taskId = prefix;
    const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";  // G97

    for (let i = 0; i < 8; i++) {
        taskId += ALPHABET[randomBytes[i] % ALPHABET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes, Y→taskId,
//          k$3→getTaskTypePrefix, N$3→crypto.randomBytes, G97→ALPHABET
```

**Why this approach:**
- **Type identification**: One character prefix immediately identifies task category
- **Cryptographic randomness**: Prevents ID collision even in parallel execution
- **Alphanumeric encoding**: URL-safe, filesystem-safe IDs
- **Fixed length**: 9 characters (1 prefix + 8 random) for consistent display

**Collision Analysis:**
- Total ID space: 36^8 = 2,821,109,907,456 possible IDs per type
- With 36-character alphabet, birthday paradox suggests ~50% collision at ~1.7M IDs
- In practice, extremely unlikely to collide given typical usage patterns

### Task Type Prefixes

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task type to prefix mapping
// Location: chunks.41.mjs:2438-2444
// ============================================

// ORIGINAL (for source lookup):
V$3 = {
    local_bash: "b",
    local_agent: "a",
    remote_agent: "r",
    in_process_teammate: "t",
    local_workflow: "w"
}

// READABLE (for understanding):
const TASK_TYPE_PREFIXES = {
    local_bash: "b",              // Shell commands
    local_agent: "a",             // Local subagents
    remote_agent: "r",            // Remote session agents
    in_process_teammate: "t",     // In-process teammates
    local_workflow: "w"           // Workflow tasks
};
// Unknown types get "x" prefix

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### Example IDs

| Task Type | Generated ID | Breakdown |
|-----------|--------------|-----------|
| local_agent | `ab3k7m9p2` | a + b3k7m9p2 |
| local_bash | `bx5n8q1w4` | b + x5n8q1w4 |
| in_process_teammate | `tp9m2k5r8` | t + p9m2k5r8 |
| unknown_type | `xq3w7e5t9` | x + q3w7e5t9 |

---

## Algorithm 2: Fork Context Cloning (Fx8)

**What it does:** Filters orphaned tool_use blocks from messages when forking context to a subagent.

**How it works:**

```javascript
// ============================================
// Fx8 - cloneForkContext - Clone and filter fork context messages
// Location: chunks.133.mjs:1788-1804
// ============================================

// ORIGINAL (for source lookup):
function Fx8(A) {
    let q = new Set;
    for (let K of A)
        if (K?.type === "user") {
            let z = K.message.content;
            if (Array.isArray(z)) {
                for (let _ of z)
                    if (_.type === "tool_result" && _.tool_use_id) q.add(_.tool_use_id)
            }
        }
    return A.filter((K) => {
        if (K?.type === "assistant") {
            let z = K.message.content;
            if (Array.isArray(z)) return !z.some((w) => w.type === "tool_use" && w.id && !q.has(w.id))
        }
        return !0
    })
}

// READABLE (for understanding):
function cloneForkContext(messages) {
    // PHASE 1: Collect all valid tool_use_ids
    // These are IDs that have corresponding tool_result blocks
    let validToolUseIds = new Set();

    for (let message of messages) {
        if (message?.type === "user") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                for (let block of content) {
                    if (block.type === "tool_result" && block.tool_use_id) {
                        validToolUseIds.add(block.tool_use_id);
                    }
                }
            }
        }
    }

    // PHASE 2: Filter out messages with orphaned tool_use blocks
    return messages.filter((message) => {
        if (message?.type === "assistant") {
            let content = message.message.content;
            if (Array.isArray(content)) {
                // Remove if there's any tool_use without a matching result
                return !content.some((block) =>
                    block.type === "tool_use" &&
                    block.id &&
                    !validToolUseIds.has(block.id)
                );
            }
        }
        return true;  // Keep non-assistant messages
    });
}

// Mapping: Fx8→cloneForkContext, A→messages, q→validToolUseIds, K→message, z→content, _→block, w→tool_use_block
```

**Why this approach:**
- **Two-pass algorithm**: O(n) complexity, single scan for each phase
- **Set-based lookup**: O(1) membership test for tool_use_ids
- **Preserve valid messages**: Only removes messages with orphaned tool calls

**Key insight:** When forking context to a subagent, the LLM would be confused by incomplete tool calls (tool_use without tool_result). This filtering ensures the subagent receives a consistent conversation state.

### Example

**Before filtering:**
```
Assistant: [tool_use id="call_1"]  // Has result
User: [tool_result tool_use_id="call_1"]
Assistant: [tool_use id="call_2"]  // ORPHANED - no result!
User: "What about the search?"
```

**After filtering:**
```
Assistant: [tool_use id="call_1"]  // Kept - has result
User: [tool_result tool_use_id="call_1"]
User: "What about the search?"
// Note: Assistant message with orphaned call_2 is removed
```

---

## Algorithm 3: Atomic Task Update (i9)

**What it does:** Updates a single task in the state atomically with reference equality optimization.

**How it works:**

```javascript
// ============================================
// i9 - atomicUpdateTask - Atomically update a single task
// Location: chunks.90.mjs:3003-3017
// ============================================

// ORIGINAL (for source lookup):
function i9(A, q, K) {
    q((Y) => {
        let z = Y.tasks?.[A];
        if (!z) return Y;
        let _ = K(z);
        if (_ === z) return Y;
        return {
            ...Y,
            tasks: {
                ...Y.tasks,
                [A]: _
            }
        }
    })
}

// READABLE (for understanding):
function atomicUpdateTask(taskId, setAppState, updater) {
    setAppState((state) => {
        // Step 1: Check task exists
        let task = state.tasks?.[taskId];
        if (!task) return state;  // No-op if task doesn't exist

        // Step 2: Apply updater function
        let updatedTask = updater(task);

        // Step 3: Skip update if unchanged (reference equality)
        // This is crucial for React-style state management
        if (updatedTask === task) return state;

        // Step 4: Return new state with updated task
        return {
            ...state,
            tasks: {
                ...state.tasks,
                [taskId]: updatedTask
            }
        };
    });
}

// Mapping: i9→atomicUpdateTask, A→taskId, q→setAppState, K→updater,
//          Y→state, z→task, _→updatedTask
```

**Why this approach:**
- **Concurrency safety**: Multiple updates don't conflict due to immutable state
- **Reference equality optimization**: Skip re-renders if updater returns same object
- **Transactional**: All-or-nothing updates

**Key insight:** The reference equality check (`updatedTask === task`) is critical for React performance. If the updater returns the same object reference, React will skip re-rendering because state hasn't changed.

---

## Algorithm 4: Abort Signal Propagation (x66, U4q)

**What it does:** Propagates kill signals through the task hierarchy with proper cleanup.

### Single Task Abort (x66)

```javascript
// ============================================
// x66 - triggerAbortSignal - Abort a specific task
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

        // Step 1: Signal abort to LLM stream and tool executions
        task.abortController?.abort();

        // Step 2: Prevent cleanup handler from running twice
        task.unregisterCleanup?.();

        // Step 3: Return killed state
        return {
            ...task,
            status: "killed",
            endTime: Date.now(),
            // Keep last message for debugging
            messages: task.messages?.length
                ? [task.messages[task.messages.length - 1]]
                : undefined,
            // Clear references
            abortController: undefined,
            unregisterCleanup: undefined,
            selectedAgent: undefined
        };
    });

    // Step 4: Flush any buffered output to preserve partial results
    if (wasAborted) {
        flushOutputBuffer(taskId);  // $O
    }

    return wasAborted;
}

// Mapping: x66→triggerAbortSignal, A→taskId, q→setAppState, K→wasAborted,
//          Y→task, i9→atomicUpdateTask, $O→flushOutputBuffer
```

### Kill All Local Agents (U4q)

```javascript
// ============================================
// U4q - killAllLocalAgents - Kill all running local agents
// Location: chunks.146.mjs:2029-2032
// ============================================

// ORIGINAL (for source lookup):
function U4q(A, q) {
    for (let [K, Y] of Object.entries(A))
        if (Y.type === "local_agent" && Y.status === "running") x66(K, q)
}

// READABLE (for understanding):
function killAllLocalAgents(tasks, setAppState) {
    // Iterate all tasks
    for (let [taskId, task] of Object.entries(tasks)) {
        // Filter: Only local_agent tasks that are running
        if (task.type === "local_agent" && task.status === "running") {
            // Delegate to single abort function
            triggerAbortSignal(taskId, setAppState);  // x66
        }
    }
}

// Mapping: U4q→killAllLocalAgents, A→tasks, q→setAppState, K→taskId, Y→task, x66→triggerAbortSignal
```

**Why this approach:**
- **Composition over duplication**: `U4q` delegates to `x66` rather than duplicating abort logic
- **Type filtering**: Only kills `local_agent` tasks, not bash or teammate tasks
- **Snapshot iteration**: `Object.entries()` creates a snapshot before mutation
- **Partial results preserved**: `flushOutputBuffer` ensures output isn't lost

### Abort Propagation Flow

```
User presses Ctrl+C → Ctrl+F
        │
        ▼
┌───────────────────────────────────────────┐
│ killAllLocalAgents (U4q)                  │
│                                           │
│ for each task:                            │
│   if local_agent && running:              │
│     triggerAbortSignal (x66)              │
└───────────────────┬───────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────┐
│ triggerAbortSignal (x66)                  │
│                                           │
│ 1. abortController.abort()                │
│    → Cancels LLM stream                   │
│    → Propagates to tool executions        │
│                                           │
│ 2. unregisterCleanup()                    │
│    → Removes process exit handler         │
│                                           │
│ 3. Update state: status = "killed"        │
│                                           │
│ 4. flushOutputBuffer()                    │
│    → Preserve partial results             │
└───────────────────────────────────────────┘
```

---

## Algorithm 5: Task State Machine

**What it does:** Manages the lifecycle of tasks through their states.

### State Transitions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TASK STATE MACHINE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │   pending    │ ← Initial state (createTaskRecord)
                         └──────┬───────┘
                                │ spawn (Qn4/Un4)
                                ▼
                         ┌──────────────┐
            ┌────────────│   running    │────────────┐
            │            └──────┬───────┘            │
            │                   │                    │
     [success: $m8]      [error: Hm8]        [user kill: x66]
            │                   │                    │
            ▼                   ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │  completed   │    │   failed     │    │   killed     │
    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
           │                   │                   │
           │         [d4q: mark notified]          │
           │                   │                   │
           └───────────────────┼───────────────────┘
                               │
                               ▼
                         ┌──────────────┐
                         │   notified   │ ← Ready for eviction
                         │   = true     │
                         └──────┬───────┘
                                │ removeTask (VR)
                                ▼
                         ┌──────────────┐
                         │   removed    │ ← No longer in state
                         └──────────────┘
```

### State Transition Functions

| From | To | Trigger | Function | Symbol |
|------|-----|---------|----------|--------|
| - | pending | createTaskRecord | `RG` | chunks.41.mjs:2418 |
| pending | running | spawn execution | `Qn4` / `Un4` | chunks.146.mjs:2133/2165 |
| running | completed | Success | `markTaskCompleted` | `$m8` @ chunks.146.mjs:2100 |
| running | failed | Error | `markTaskFailed` | `Hm8` @ chunks.146.mjs:2117 |
| running | killed | User kill | `triggerAbortSignal` | `x66` @ chunks.146.mjs:2012 |
| terminal | notified | Notification sent | `markTaskKilled` | `d4q` @ chunks.146.mjs:2034 |
| notified+terminal | removed | After notification | `removeTask` | `VR` @ chunks.90.mjs:3037 |

---

## Algorithm 6: Progress Throttling

**What it does:** Limits the frequency of progress updates to avoid overwhelming the LLM context.

### Throttle Logic

```javascript
// ============================================
// TIY - countTurnsSinceLastProgress - Count turns since last progress
// Location: chunks.144.mjs:832 (inferred)
// ============================================

// READABLE (for understanding):
function countTurnsSinceLastProgress(messages) {
    let turnsSinceProgress = 0;

    // Count backwards from most recent message
    for (let i = messages.length - 1; i >= 0; i--) {
        let message = messages[i];

        // Progress attachment resets counter
        if (message.type === "attachment" && message.attachment?.type === "task_progress") {
            break;
        }

        // Assistant messages count as turns
        if (message.type === "assistant") {
            turnsSinceProgress++;
        }
    }

    return turnsSinceProgress;
}

// Throttle: Only send progress every 3+ turns
const PROGRESS_THROTTLE_TURNS = 3;

function shouldSendProgress(messages) {
    return countTurnsSinceLastProgress(messages) >= PROGRESS_THROTTLE_TURNS;
}
```

**Why this approach:**
- **Context efficiency**: Progress attachments can be large
- **Turn-based throttling**: Natural cadence aligned with LLM turns
- **Reset on progress**: Ensures first progress after a while is always sent

### Special Cases

| Condition | Behavior |
|-----------|----------|
| New task | Always send first progress (turnsSinceProgress = Infinity) |
| Status change | Always send task_status (terminal state) |
| After 3 turns | Send progress if task still running |

---

## Source Code Verification

| Symbol | Readable | Location | Verification |
|--------|----------|----------|--------------|
| `oV` | generateTaskId | chunks.41.mjs:2410 | ✓ Verified |
| `k$3` | getTaskTypePrefix | chunks.41.mjs:2406 | ✓ Verified |
| `V$3` | TASK_TYPE_PREFIXES | chunks.41.mjs:2438 | ✓ Verified |
| `G97` | ALPHABET | chunks.41.mjs:2434 | ✓ Verified |
| `Fx8` | cloneForkContext | chunks.133.mjs:1788 | ✓ Verified |
| `i9` | atomicUpdateTask | chunks.90.mjs:3003 | ✓ Verified |
| `x66` | triggerAbortSignal | chunks.146.mjs:2012 | ✓ Verified |
| `U4q` | killAllLocalAgents | chunks.146.mjs:2029 | ✓ Verified |
| `$m8` | markTaskCompleted | chunks.146.mjs:2100 | ✓ Verified |
| `Hm8` | markTaskFailed | chunks.146.mjs:2117 | ✓ Verified |
| `d4q` | markTaskKilled | chunks.146.mjs:2034 | ✓ Verified |

---

## Related Documents

- [ui_interaction_complete_v4.md](./ui_interaction_complete_v4.md) - UI interaction
- [system_reminder_integration_v6.md](./system_reminder_integration_v6.md) - System reminder integration
- [cross_feature_linkages_complete_v4.md](./cross_feature_linkages_complete_v4.md) - Feature integrations