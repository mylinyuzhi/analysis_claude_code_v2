# Task ID Generation Algorithm (Claude Code 2.1.76)

> Source-level analysis of the task ID generation algorithm used for unique identifier creation across all task types.
> Cross-validated against source code on 2026-03-26.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `oV` - generateTaskId — `chunks.41.mjs:2410` ✓ Verified
- `k$3` - getTaskTypePrefix — `chunks.41.mjs:2406` ✓ Verified
- `RG` - createTaskEntry — `chunks.41.mjs:2418` ✓ Verified
- `LJ6` - isTerminalTaskStatus — `chunks.41.mjs:2402` ✓ Verified
- `V$3` - TASK_TYPE_PREFIXES — `chunks.41.mjs:2438` ✓ Verified
- `G97` - TASK_ID_CHARSET — `chunks.41.mjs:2434` ✓ Verified

---

## Overview

Every background task, agent, and teammate in Claude Code receives a unique identifier. This ID serves multiple purposes:

1. **Uniqueness** - Ensures no collision between concurrent tasks
2. **Type identification** - Single-character prefix enables visual identification
3. **File naming** - IDs serve as filename components for output files
4. **State lookup** - Keys in `appState.tasks` dictionary

---

## Algorithm Implementation

### createTaskId (oV)

**Location:** chunks.41.mjs:2410-2415

**What it does:** Generates a unique, type-prefixed identifier for any task type.

**How it works:**

```javascript
// ============================================
// createTaskId - Generates prefixed task identifier
// Location: chunks.41.mjs:2410-2415
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
function createTaskId(taskType) {
    // Step 1: Get the type-specific prefix character
    let prefix = getTypePrefix(taskType);

    // Step 2: Generate 8 cryptographically random bytes
    let randomBytes = generateRandomBytes(8);

    // Step 3: Build the ID by encoding each byte as a character
    let taskId = prefix;
    for (let i = 0; i < 8; i++) {
        // Map byte value (0-255) to character using modulo
        taskId += CHARSET[randomBytes[i] % CHARSET.length];
    }
    return taskId;  // e.g., "a3f9c2x7"
}

// Mapping: oV→createTaskId, k$3→getTypePrefix, N$3→generateRandomBytes, G97→CHARSET
```

### getTypePrefix (k$3)

**What it does:** Maps task types to single-character prefixes.

**Type Prefix Mapping (`V$3` / `TASK_TYPE_PREFIXES`):**

| taskType | prefix | Example ID | Description |
|----------|--------|------------|-------------|
| `local_agent` | `a` | `a3f9c2x7` | Local subagent task |
| `local_bash` | `b` | `b7c4e1m2` | Local shell command |
| `remote_agent` | `r` | `r2a8f0k5` | Remote session agent |
| `in_process_teammate` | `t` | `t5d3b9n4` | In-process teammate |
| `local_workflow` | `w` | `w1x2y3z4` | Workflow task |

### Charset (G97)

**What it does:** Defines the character set for encoding random bytes.

**Value:** `"0123456789abcdefghijklmnopqrstuvwxyz"` (36 characters)

**Why base-36:**
- **File-safe:** All characters are valid in filenames
- **URL-safe:** No special characters that need encoding
- **Human-readable:** Easy to communicate verbally
- **Compact:** 36 chars provides good entropy per character

---

## Collision Analysis

### Entropy Calculation

**Per-task-type entropy:**
- Characters: 36 possibilities
- Length: 8 characters (excluding prefix)
- Combinations: 36^8 = 2,821,109,907,456 ≈ 2.8 trillion

**Probability of collision:**
- Using birthday paradox approximation
- For N tasks of same type:
  - P(collision) ≈ N² / (2 × 36^8)
  - At N = 1 million: P ≈ 0.0002%
  - At N = 10 million: P ≈ 0.02%

**Why this is acceptable:**
1. Tasks are short-lived (hours, not years)
2. ID space is recycled after task completion
3. Cryptographic randomness ensures uniform distribution

### Cryptographic Randomness

The use of `generateRandomBytes` (N$3) ensures:

1. **Uniform distribution** - Each character equally likely
2. **Unpredictability** - Cannot guess next ID
3. **No patterns** - No sequential or time-based correlations

**Why not Math.random():**
- `Math.random()` is not cryptographically secure
- Patterns can emerge in PRNG sequences
- Predictable IDs could be exploited

---

## Task Record Creation

### createTaskRecord (RG)

**Location:** chunks.41.mjs:2418-2429

**What it does:** Constructs the initial task state object with all required fields.

```javascript
// ============================================
// createTaskRecord - Constructs the initial task state object
// Location: chunks.41.mjs:2418-2429
// ============================================

// ORIGINAL (for source lookup):
function RG(A, q, K, Y) {
    return {
        id: A, type: q, status: "pending", description: K,
        toolUseId: Y, startTime: Date.now(),
        outputFile: g2(A), outputOffset: 0, notified: !1
    }
}

// READABLE (for understanding):
function createTaskRecord(taskId, taskType, description, toolUseId) {
    return {
        id:           taskId,           // Unique identifier from createTaskId
        type:         taskType,         // "local_agent", "local_bash", etc.
        status:       "pending",        // Initial state
        description:  description,      // Human-readable description
        toolUseId:    toolUseId,        // Links to spawning tool call
        startTime:    Date.now(),       // Creation timestamp
        outputFile:   getOutputFilePath(taskId),  // g2(taskId)
        outputOffset: 0,                // Byte cursor for incremental reads
        notified:     false             // Guard: ensures notification fires once
    };
}

// Mapping: RG→createTaskRecord, A→taskId, q→taskType, K→description, Y→toolUseId, g2→getOutputFilePath
```

### Additional Fields (Added by Spawn Handlers)

When tasks are actually spawned, additional fields are added:

```javascript
// Fields added by createBackgroundAgentTask (Qn4)
{
    agentId:          string,           // Unique agent identifier
    prompt:           string,           // The task prompt
    selectedAgent:    AgentDefinition,  // Agent type configuration
    agentType:        string,           // "general-purpose", "Explore", etc.
    abortController:  AbortController,  // For cancellation
    unregisterCleanup: Function,        // Removes process-exit handler
    retrieved:        boolean,          // Whether TaskOutput retrieved this
    lastReportedToolCount: number,      // Progress tracking
    lastReportedTokenCount: number,     // Progress tracking
    isBackgrounded:   boolean,          // true for background tasks
    background:       boolean,          // true if explicitly background (v2.1.76)
    pendingMessages:  Message[],        // Queued for background agents
    progress: {
        toolUseCount: number,
        tokenCount: number,
        summary: string,
        lastActivity: number,
        recentActivities: string[]
    }
}

// Fields set on completion/failure
{
    result:           any,              // On completion
    error:            string,           // On failure
    endTime:          number            // Completion timestamp
}
```

---

## Output File Path Derivation

### getOutputFilePath (g2)

**Location:** chunks.41.mjs:2248-2250

**What it does:** Computes the deterministic path to a task's output file.

```javascript
// ============================================
// getOutputFilePath - Deterministic output file path from task ID
// Location: chunks.41.mjs:2248-2250
// ============================================

// ORIGINAL (for source lookup):
function g2(A) {
    return D97(yJ6(), `${A}.output`)
}

// READABLE (for understanding):
function getOutputFilePath(taskId) {
    return joinPath(getTasksDir(), `${taskId}.output`);
}

// Mapping: g2→getOutputFilePath, A→taskId, D97→joinPath, yJ6→getTasksDir
```

**Directory structure:**

```
~/.claude/                     (or project data dir)
└── tasks/
    ├── a3f9c2x7.output        local_agent task output
    ├── b7c4e1m2.output        local_bash task output
    ├── r2a8f0k5.output        remote_agent task output
    └── t5d3b9n4.output        in_process_teammate output
```

**Key insight:** The output file path is deterministic from the task ID. This allows:
1. Immediate return of the path to callers
2. No need for path lookups or registries
3. Simple file-based communication channel

---

## Usage Patterns

### Creating a Background Agent Task

```javascript
// In AgentTool handler (chunks.136.mjs:1775)
let task = createBackgroundAgentTask({
    agentId:        generateAgentId(),
    description:    "Search codebase for API usage",
    prompt:         "Find all usages of createTaskId...",
    selectedAgent:  EXPLORE_AGENT,
    setAppState:    context.setAppState,
    toolUseId:      context.toolUseId
});

// task.id is now something like "a3f9c2x7"
// task.outputFile is "~/.claude/tasks/a3f9c2x7.output"
```

### Looking Up a Task

```javascript
// Tasks are stored in appState.tasks by ID
let task = appState.tasks["a3f9c2x7"];

// Type prefix enables quick filtering
let allAgents = Object.values(appState.tasks)
    .filter(t => t.type === "local_agent");

// Or by prefix character
let allAgents = Object.keys(appState.tasks)
    .filter(id => id.startsWith("a"));
```

### Kill by ID

```javascript
// Using the ID to kill a task
triggerAbortSignal("a3f9c2x7", setAppState);

// Kill all agents by type
for (let [id, task] of Object.entries(appState.tasks)) {
    if (task.type === "local_agent" && task.status === "running") {
        triggerAbortSignal(id, setAppState);
    }
}
```

---

## Design Rationale

### Why Prefixes?

1. **Visual identification** - Single character indicates task type at a glance
2. **Debugging** - Log messages can quickly show task category
3. **Filtering** - String prefix matching is efficient
4. **No collision across types** - Different types have different prefix spaces

### Why 8 Random Characters?

1. **Collision resistance** - 2.8 trillion combinations per type
2. **Compactness** - 9 characters total (prefix + 8) fits in UI
3. **Readability** - Short enough to communicate verbally
4. **File compatibility** - All characters are filename-safe

### Why Base-36?

1. **Human-readable** - Uses digits and lowercase letters
2. **No special chars** - Works in URLs, filenames, shell commands
3. **Good entropy** - 36 chars × 8 positions = sufficient entropy
4. **Standard** - Base-36 is well-understood and supported

### Why Cryptographic Randomness?

1. **Security** - Prevents ID guessing attacks
2. **Uniformity** - No bias in character distribution
3. **Unpredictability** - Cannot infer patterns
4. **Future-proof** - Safe for long-running production systems

---

## Integration with Other Systems

### System Reminder Attachments

Task IDs appear in system-reminder attachments:

```xml
<task_status>
  <task_id>a3f9c2x7</task_id>
  <task_type>local_agent</task_type>
  <status>completed</status>
  <description>Search codebase...</description>
</task_status>
```

### Output File System

The ID directly maps to the output file:
- ID: `a3f9c2x7`
- File: `~/.claude/tasks/a3f9c2x7.output`

### Kill Handlers

Kill handlers receive the task ID:
- `triggerAbortSignal(taskId, setAppState)`
- `markTaskKilled(taskId, setAppState)`

### Notification System

The `notified` field prevents duplicate notifications:
- First notification sets `notified: true`
- Subsequent checks skip already-notified tasks