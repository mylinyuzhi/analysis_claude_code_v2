# Task ID Generation Algorithm (Claude Code 2.1.76)

> Complete source-level analysis of the task ID generation algorithm used for background agents, subagents, and teammates.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` - generateTaskId — `chunks.41.mjs:2410`
- `k$3` - getTaskPrefix — `chunks.41.mjs:2406`
- `LJ6` - isTerminalTaskStatus — `chunks.41.mjs:2402`
- `RG` - createTaskRecord — `chunks.41.mjs:2418`
- `V$3` - TASK_TYPE_PREFIXES — `chunks.41.mjs:2438`

---

## Algorithm Overview

The task ID generation algorithm creates unique identifiers for all background tasks (agents, bash commands, teammates) using a combination of type prefixes and random characters.

### Design Goals

1. **Uniqueness** - Prevent collisions between concurrent tasks
2. **Human-readable** - Easy to distinguish task types at a glance
3. **Compact** - Short enough for UI display and file names
4. **Traceable** - Type prefix enables quick identification

---

## Source Code

### Task Type Prefixes (V$3)

```javascript
// ============================================
// V$3 - TASK_TYPE_PREFIXES - Task type to prefix mapping
// Location: chunks.41.mjs:2438-2445
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
    local_agent: "a",             // Background/sync agents
    remote_agent: "r",            // Remote session agents
    in_process_teammate: "t",     // Teammates in same process
    local_workflow: "w"           // Workflow tasks
};

// Mapping: V$3→TASK_TYPE_PREFIXES
```

### Character Set (G97)

```javascript
// ============================================
// G97 - Character set for random ID generation
// Location: chunks.41.mjs:2434
// ============================================

// ORIGINAL (for source lookup):
G97 = "0123456789abcdefghijklmnopqrstuvwxyz"

// READABLE (for understanding):
const ID_CHARACTER_SET = "0123456789abcdefghijklmnopqrstuvwxyz";
// 36 characters: 0-9 and a-z (lowercase)

// Mapping: G97→ID_CHARACTER_SET
```

### getTaskPrefix (k$3)

```javascript
// ============================================
// k$3 - getTaskPrefix - Get prefix for task type
// Location: chunks.41.mjs:2406-2408
// ============================================

// ORIGINAL (for source lookup):
function k$3(A) {
    return V$3[A] ?? "x"
}

// READABLE (for understanding):
function getTaskPrefix(taskType) {
    // Return the prefix for known types, or "x" for unknown
    return TASK_TYPE_PREFIXES[taskType] ?? "x";
}

// Mapping: k$3→getTaskPrefix, A→taskType, V$3→TASK_TYPE_PREFIXES
```

### generateTaskId (oV)

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
    // Step 1: Get the type prefix
    let prefix = getTaskPrefix(taskType);

    // Step 2: Generate 8 random bytes
    let randomBytes = cryptoRandomBytes(8);

    // Step 3: Start with prefix
    let taskId = prefix;

    // Step 4: Append 8 random characters from charset
    for (let i = 0; i < 8; i++) {
        taskId += ID_CHARACTER_SET[randomBytes[i] % ID_CHARACTER_SET.length];
    }

    return taskId;
}

// Mapping: oV→generateTaskId, A→taskType, q→prefix, K→randomBytes,
//          Y→taskId, z→i, k$3→getTaskPrefix, N$3→cryptoRandomBytes,
//          G97→ID_CHARACTER_SET
```

### isTerminalTaskStatus (LJ6)

```javascript
// ============================================
// LJ6 - isTerminalTaskStatus - Check if status is terminal
// Location: chunks.41.mjs:2402-2404
// ============================================

// ORIGINAL (for source lookup):
function LJ6(A) {
    return A === "completed" || A === "failed" || A === "killed"
}

// READABLE (for understanding):
function isTerminalTaskStatus(status) {
    // Terminal states mean the task is done and won't change
    return status === "completed" ||
           status === "failed" ||
           status === "killed";
}

// Mapping: LJ6→isTerminalTaskStatus, A→status
```

### createTaskRecord (RG)

```javascript
// ============================================
// RG - createTaskRecord - Create initial task state object
// Location: chunks.41.mjs:2418-2430
// ============================================

// ORIGINAL (for source lookup):
function RG(A, q, K, Y) {
    return {
        id: A,
        type: q,
        status: "pending",
        description: K,
        toolUseId: Y,
        startTime: Date.now(),
        outputFile: g2(A),
        outputOffset: 0,
        notified: !1
    }
}

// READABLE (for understanding):
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id: taskId,                      // Unique task ID
        type: taskType,                  // Task type (local_agent, etc.)
        status: "pending",               // Initial status
        description: description,        // Human-readable description
        toolUseId: toolUseId,            // Tool call that created this task
        startTime: Date.now(),           // Creation timestamp
        outputFile: getOutputFilePath(taskId),  // Output file path
        outputOffset: 0,                 // Current read position in output
        notified: false                  // Has user been notified of completion?
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description,
//          Y→toolUseId, g2→getOutputFilePath
```

---

## Algorithm Deep Dive

### ID Format

```
{prefix}{random}

prefix:  1 character (a, b, r, t, w, or x)
random:  8 characters (0-9, a-z)

Total:   9 characters
```

### Examples

| Task Type | Generated ID | Breakdown |
|-----------|--------------|-----------|
| local_agent | `a3k7m9p2` | `a` + `3k7m9p2` |
| local_bash | `b8x2n5q1` | `b` + `8x2n5q1` |
| in_process_teammate | `t1y4h8z3` | `t` + `1y4h8z3` |
| remote_agent | `r7c2d9f4` | `r` + `7c2d9f4` |
| unknown_type | `x5m8k2p1` | `x` + `5m8k2p1` |

### Collision Analysis

**Key Insight:** The algorithm uses 8 random characters from a 36-character set.

**Collision probability calculation:**
- Character set size: 36
- Number of positions: 8
- Total combinations: 36^8 = 2,821,109,907,456 (≈2.8 trillion)

**Collision probability per type:**
- For the same task type (same prefix)
- Birthday problem: P(collision) ≈ n²/(2 × 36^8)
- For n=1,000,000 concurrent tasks of same type: P ≈ 0.0002%

**Why this is safe:**
1. Tasks are typically short-lived (minutes to hours)
2. Concurrent tasks rarely exceed 100 per session
3. Even with 10,000 concurrent tasks, collision probability is < 0.000001%

---

## Task Lifecycle States

```
                    ┌─────────────────────────────────────────────────┐
                    │                 TASK STATES                      │
                    └─────────────────────────────────────────────────┘

    ┌─────────┐          ┌─────────┐          ┌───────────┐
    │ pending │ ───────▶ │ running │ ───────▶ │ completed │
    └─────────┘          └────┬────┘          └───────────┘
                              │
                              │ abort/error
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             ┌──────────┐        ┌─────────┐
             │  killed  │        │  failed │
             └──────────┘        └─────────┘

    Terminal states (LJ6 returns true):
    - completed: Task finished successfully
    - failed: Task encountered error
    - killed: Task was manually terminated
```

---

## Usage Examples

### Creating a Background Agent Task

```javascript
// Step 1: Generate unique ID
let taskId = generateTaskId("local_agent");  // e.g., "a3k7m9p2"

// Step 2: Create task record
let taskRecord = createTaskRecord(
    taskId,
    "local_agent",
    "Search codebase for usages",
    "tooluse_abc123"
);

// Result:
// {
//     id: "a3k7m9p2",
//     type: "local_agent",
//     status: "pending",
//     description: "Search codebase for usages",
//     toolUseId: "tooluse_abc123",
//     startTime: 1711476934567,
//     outputFile: ".claude/tasks/a3k7m9p2.output",
//     outputOffset: 0,
//     notified: false
// }
```

### Creating a Teammate Task

```javascript
let teammateTaskId = generateTaskId("in_process_teammate");  // e.g., "t1y4h8z3"
```

### Creating a Bash Background Task

```javascript
let bashTaskId = generateTaskId("local_bash");  // e.g., "b8x2n5q1"
```

---

## Integration Points

### Where Task IDs Are Used

| Module | Usage |
|--------|-------|
| `08_subagent` | Agent spawn, tool use tracking |
| `26_background_agents` | Task state management, output files |
| `04_system_reminder` | Task status attachments |
| `05_tools` | TaskOutput, TaskStop tools |
| `01_cli` | `/tasks` command, task list display |

### Output File Naming

```javascript
// Output file path: .claude/tasks/{taskId}.output
function getOutputFilePath(taskId) {
    return path.join(getTasksDirectory(), `${taskId}.output`);
}

// Examples:
// a3k7m9p2.output  → Background agent output
// b8x2n5q1.output  → Background bash output
// t1y4h8z3.output  → Teammate output
```

---

## Key Insights

### Why This Design Works

1. **Type Prefixes Enable Quick Identification**
   - See first character → know task type
   - Useful for debugging and log analysis
   - Enables type-specific filtering

2. **Cryptographic Randomness Prevents Collision**
   - Uses Node.js `crypto.randomBytes` (N$3)
   - Not predictable, not sequential
   - Safe even with high concurrency

3. **Compact Format Suits UI Display**
   - 9 characters fits easily in status lines
   - Readable in logs and error messages
   - Used as file names without issues

4. **Separate Prefix Per Type**
   - Different namespaces per task type
   - Reduces collision domain
   - Enables type-specific behavior

### Design Trade-offs

| Choice | Benefit | Trade-off |
|--------|---------|-----------|
| 8-char random | Compact | Slightly higher collision than UUID |
| Type prefix | Quick identification | Extra character |
| Lowercase only | Case-insensitive file systems | Slightly fewer combinations |
| No timestamp | Shorter ID | Can't sort by creation time |

---

## Summary

The task ID generation algorithm balances uniqueness, readability, and compactness:

- **Format**: `{type_prefix}{8_random_chars}` (9 characters total)
- **Prefixes**: `a` (agent), `b` (bash), `r` (remote), `t` (teammate), `w` (workflow)
- **Character set**: `0-9a-z` (36 characters)
- **Collision probability**: Effectively zero for practical use

The algorithm is used throughout Claude Code for tracking background tasks, subagents, and teammates with human-readable, unique identifiers.