# Task System Module - Complete Source Restoration

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ All symbols cross-validated against source code

---

## Overview

This document provides complete source-level restoration of key functions in the Task System module. The task system provides structured task tracking with dependency management for multi-agent coordination.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions documented here:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `createTask` (aD1) - Atomic task creation - chunks.84.mjs:1669
- `loadTask` (DB) - Load and validate - chunks.84.mjs:1687
- `updateTask` (WI) - Update with validation - chunks.84.mjs:1701
- `deleteTask` (sD1) - Delete with cleanup - chunks.84.mjs:1713
- `loadAllTasks` (DX) - Load all tasks - chunks.84.mjs:1742
- `claimTask` (OT8) - Lock-based claiming - chunks.84.mjs:1781
- `getHighWaterMark` (wN9) - Max ID tracking - chunks.84.mjs:1664

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     TASK SYSTEM ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Agent Interface                         │  │
│  │  TaskCreate │ TaskUpdate │ TaskGet │ TaskList             │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │                 Core Functions (Async)                     │  │
│  │  getTaskManager │ createTask │ loadTask │ updateTask      │  │
│  │  deleteTask │ loadAllTasks │ claimTask                    │  │
│  └────────────────────────┬─────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐  │
│  │              Storage Layer (~/.claude/tasks/)              │  │
│  │  ├── {team-name}/           # Team-isolated tasks          │  │
│  │  │   ├── 1.json            # Task file                    │  │
│  │  │   ├── 2.json                                            │  │
│  │  │   ├── .highwatermark    # Max ID tracking               │  │
│  │  │   └── .lock             # Concurrency control           │  │
│  │  └── {agent-id}/           # Solo agent tasks              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Integration Points                         │  │
│  │  • TaskCompleted Hooks - Pre-completion validation        │  │
│  │  • Team Messaging - Assignment notifications               │  │
│  │  • UI State - expandedView: "tasks"                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. getTaskManager (jf) - Resolve Task List ID

### What it does

Resolves the task list ID from the current context. This determines which task directory to use for operations.

### How it works

1. Check `CLAUDE_CODE_TASK_LIST_ID` environment variable
2. Check teammate context (for swarm/team scenarios)
3. Fall back to agent ID or default/generate

### Why this approach

- **Environment override** enables testing and debugging
- **Team isolation** via teammate context
- **Graceful fallback** ensures a valid ID always exists

```javascript
// ============================================
// getTaskManager - Resolve task list ID from context
// Location: chunks.84.mjs:1619-1624
// ============================================

// ORIGINAL (for source lookup):
function jf() {
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) return process.env.CLAUDE_CODE_TASK_LIST_ID;
    let A = iM();
    if (A) return A.teamName;
    return l5() || VF6 || R1()
}

// READABLE (for understanding):
function getTaskManager() {
    // Priority 1: Explicit environment variable
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) {
        return process.env.CLAUDE_CODE_TASK_LIST_ID;
    }

    // Priority 2: Teammate context (multi-agent scenario)
    const teammateContext = getTeammateContext();
    if (teammateContext) {
        return teammateContext.teamName;
    }

    // Priority 3: Agent ID or default
    return getAgentId() || DEFAULT_AGENT_ID || generateUUID();
}

// Mapping: jf→getTaskManager, iM→getTeammateContext, l5→getAgentId,
//          VF6→DEFAULT_AGENT_ID, R1→generateUUID
```

---

## 2. createTask (aD1) - Atomic Task Creation

### What it does

Atomically creates a new task with auto-increment ID. Uses file locking to prevent race conditions.

### How it works

1. Ensure task directory exists and get lock file path
2. Acquire file lock with retry options
3. Get current high watermark (max ID in use)
4. Increment to create new ID
5. Write task file with JSON content
6. Invalidate cache
7. Release lock in finally block

### Why this approach

- **Atomic operation** via file locking prevents ID conflicts
- **Auto-increment IDs** are simpler than UUIDs for dependency management
- **Lock retry** handles transient conflicts gracefully

### Key insight

The high watermark is derived from both file scanning and a `.highwatermark` file, providing redundancy in case either source is corrupted.

```javascript
// ============================================
// createTask - Atomic task creation with auto-increment ID
// Location: chunks.84.mjs:1669-1685
// ============================================

// ORIGINAL (for source lookup):
async function aD1(A, q) {
    let K = await wT8(A),       // Ensure directory + get lock path
        Y;
    try {
        Y = await EF6.lock(K, nD1);  // Acquire lock
        let z = await wN9(A),        // Get high watermark
            _ = String(z + 1),       // Increment ID
            w = {
                id: _,
                ...q
            },
            O = yF6(A, _);           // Task file path
        return await iD1(O, B6(w, null, 2)), Gt(), _
    } finally {
        if (Y) await Y()
    }
}

// READABLE (for understanding):
async function createTask(taskListId, taskData) {
    // Step 1: Ensure directory exists and get lock file path
    const lockFilePath = await ensureTaskDirectoryAndGetLock(taskListId);
    let releaseLock;

    try {
        // Step 2: Acquire lock with retry options
        releaseLock = await lockfile.lock(lockFilePath, LOCK_OPTIONS);

        // Step 3: Get current high watermark (max ID in use)
        const currentMaxId = await getHighWaterMark(taskListId);

        // Step 4: Create new ID (increment)
        const newId = String(currentMaxId + 1);

        // Step 5: Build task object
        const task = {
            id: newId,
            ...taskData
        };

        // Step 6: Write task file
        const taskFilePath = getTaskFilePath(taskListId, newId);
        await writeFile(taskFilePath, JSON.stringify(task, null, 2));

        // Step 7: Invalidate cache
        invalidateTaskCache();

        return newId;

    } finally {
        // Step 8: Always release lock
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: aD1→createTask, A→taskListId, q→taskData, wT8→ensureTaskDirectoryAndGetLock,
//          EF6→lockfile, nD1→LOCK_OPTIONS, wN9→getHighWaterMark, yF6→getTaskFilePath,
//          iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache
```

---

## 3. loadTask (DB) - Load and Validate Task

### What it does

Loads a task from disk and validates it against the Zod schema.

### How it works

1. Build task file path
2. Read file content
3. Parse JSON
4. Validate against schema
5. Return validated task or null

```javascript
// ============================================
// loadTask - Load and validate task from disk
// Location: chunks.84.mjs:1687-1699
// ============================================

// ORIGINAL (for source lookup):
async function DB(A, q) {
    let K = yF6(A, q);
    try {
        let Y = await H84(K, "utf-8"),
            z = i1(Y),
            _ = zN9().safeParse(z);
        if (!_.success) return k(`[Tasks] Task ${q} failed schema validation: ${_.error.message}`), null;
        return _.data
    } catch (Y) {
        if (Y.code === "ENOENT") return null;
        return k(`[Tasks] Failed to read task ${q}: ${_1(Y)}`), _6(Y), null
    }
}

// READABLE (for understanding):
async function loadTask(taskListId, taskId) {
    const taskFilePath = getTaskFilePath(taskListId, taskId);

    try {
        const fileContent = await readFile(taskFilePath, "utf-8");
        const parsed = JSON.parse(fileContent);

        // Validate against schema
        const validationResult = taskSchema().safeParse(parsed);
        if (!validationResult.success) {
            logWarning(`[Tasks] Task ${taskId} failed schema validation: ${validationResult.error.message}`);
            return null;
        }

        return validationResult.data;

    } catch (error) {
        // File not found
        if (error.code === "ENOENT") return null;

        logWarning(`[Tasks] Failed to read task ${taskId}: ${formatError(error)}`);
        reportError(error);
        return null;
    }
}

// Mapping: DB→loadTask, A→taskListId, q→taskId, yF6→getTaskFilePath,
//          H84→readFile, i1→JSON.parse, zN9→taskSchema, k→logWarning, _1→formatError, _6→reportError
```

---

## 4. updateTask (WI) - Update with Validation

### What it does

Updates an existing task with new data, preserving the ID.

### How it works

1. Load existing task
2. Merge with updates (ID preserved)
3. Write back to file
4. Invalidate cache

```javascript
// ============================================
// updateTask - Update task with validation
// Location: chunks.84.mjs:1701-1711
// ============================================

// ORIGINAL (for source lookup):
async function WI(A, q, K) {
    let Y = await DB(A, q);
    if (!Y) return null;
    let z = {
            ...Y,
            ...K,
            id: q
        },
        _ = yF6(A, q);
    return await iD1(_, B6(z, null, 2)), Gt(), z
}

// READABLE (for understanding):
async function updateTask(taskListId, taskId, updates) {
    // Load existing task
    const existingTask = await loadTask(taskListId, taskId);
    if (!existingTask) return null;

    // Merge updates (ID always preserved)
    const updatedTask = {
        ...existingTask,
        ...updates,
        id: taskId  // Ensure ID is not overwritten
    };

    // Write back to file
    const taskFilePath = getTaskFilePath(taskListId, taskId);
    await writeFile(taskFilePath, JSON.stringify(updatedTask, null, 2));

    // Invalidate cache
    invalidateTaskCache();

    return updatedTask;
}

// Mapping: WI→updateTask, A→taskListId, q→taskId, K→updates,
//          DB→loadTask, yF6→getTaskFilePath, iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache
```

---

## 5. deleteTask (sD1) - Delete with Cleanup

### What it does

Deletes a task and cleans up all dependency references in other tasks.

### How it works

1. Update high watermark if deleted task ID is higher
2. Delete task file
3. Remove from `blocks` and `blockedBy` arrays in all other tasks

```javascript
// ============================================
// deleteTask - Delete task and clean dependency references
// Location: chunks.84.mjs:1713-1740
// ============================================

// ORIGINAL (for source lookup):
async function sD1(A, q) {
    let K = yF6(A, q);
    try {
        let Y = parseInt(q, 10);
        if (!isNaN(Y)) {
            let _ = await zT8(A);
            if (Y > _) await P84(A, Y)
        }
        try {
            await j84(K)
        } catch (_) {
            if (_.code === "ENOENT") return !1;
            throw _
        }
        let z = await DX(A);
        for (let _ of z) {
            let w = _.blocks.filter(($) => $ !== q),
                O = _.blockedBy.filter(($) => $ !== q);
            if (w.length !== _.blocks.length || O.length !== _.blockedBy.length) await WI(A, _.id, {
                blocks: w,
                blockedBy: O
            })
        }
        return Gt(), !0
    } catch {
        return !1
    }
}

// READABLE (for understanding):
async function deleteTask(taskListId, taskId) {
    const taskFilePath = getTaskFilePath(taskListId, taskId);

    try {
        // Update high watermark if needed
        const taskIdNum = parseInt(taskId, 10);
        if (!isNaN(taskIdNum)) {
            const currentWatermark = await readHighWaterMarkFile(taskListId);
            if (taskIdNum > currentWatermark) {
                await writeHighWaterMark(taskListId, taskIdNum);
            }
        }

        // Delete task file
        try {
            await deleteFile(taskFilePath);
        } catch (error) {
            if (error.code === "ENOENT") return false;
            throw error;
        }

        // Clean up dependency references in other tasks
        const allTasks = await loadAllTasks(taskListId);
        for (const task of allTasks) {
            const newBlocks = task.blocks.filter(id => id !== taskId);
            const newBlockedBy = task.blockedBy.filter(id => id !== taskId);

            if (newBlocks.length !== task.blocks.length || newBlockedBy.length !== task.blockedBy.length) {
                await updateTask(taskListId, task.id, {
                    blocks: newBlocks,
                    blockedBy: newBlockedBy
                });
            }
        }

        invalidateTaskCache();
        return true;

    } catch {
        return false;
    }
}

// Mapping: sD1→deleteTask, A→taskListId, q→taskId, yF6→getTaskFilePath,
//          zT8→readHighWaterMarkFile, P84→writeHighWaterMark, j84→deleteFile,
//          DX→loadAllTasks, WI→updateTask, Gt→invalidateTaskCache
```

---

## 6. loadAllTasks (DX) - Load All Tasks

### What it does

Loads all tasks from the task directory.

### How it works

1. List directory contents
2. Filter for .json files
3. Load each task in parallel
4. Filter out null results

```javascript
// ============================================
// loadAllTasks - Load all tasks from directory
// Location: chunks.84.mjs:1742-1752
// ============================================

// ORIGINAL (for source lookup):
async function DX(A) {
    let q = wR(A),
        K;
    try {
        K = await YT8(q)
    } catch {
        return []
    }
    let Y = K.filter((_) => _.endsWith(".json")).map((_) => _.replace(".json", ""));
    return (await Promise.all(Y.map((_) => DB(A, _)))).filter((_) => _ !== null)
}

// READABLE (for understanding):
async function loadAllTasks(taskListId) {
    const taskDirectory = getTaskDirectory(taskListId);

    let files;
    try {
        files = await readDirectory(taskDirectory);
    } catch {
        return [];
    }

    // Get task IDs from .json files
    const taskIds = files
        .filter(filename => filename.endsWith(".json"))
        .map(filename => filename.replace(".json", ""));

    // Load all tasks in parallel
    const tasks = await Promise.all(
        taskIds.map(taskId => loadTask(taskListId, taskId))
    );

    // Filter out null results (failed loads)
    return tasks.filter(task => task !== null);
}

// Mapping: DX→loadAllTasks, A→taskListId, wR→getTaskDirectory,
//          YT8→readDirectory, DB→loadTask
```

---

## 7. claimTask (OT8) - Lock-based Claiming

### What it does

Atomically claims a task for an agent, validating ownership, status, and dependencies.

### How it works

1. Quick check if task exists
2. Option to delegate to agent-busy validation
3. Acquire lock on task file
4. Re-verify task state after lock
5. Check ownership conflicts
6. Check completion status
7. Check dependency completion
8. Set owner and return result

### Why this approach

- **Lock-based claiming** prevents race conditions
- **Dependency validation** ensures tasks run in correct order
- **Re-verification** handles concurrent modifications

### Key insight

The `checkAgentBusy` option enables additional validation that the claiming agent isn't already busy with another task, useful for workload management.

```javascript
// ============================================
// claimTask - Lock-based claiming with dependency validation
// Location: chunks.84.mjs:1781-1830
// ============================================

// ORIGINAL (for source lookup):
async function OT8(A, q, K, Y = {}) {
    let z = yF6(A, q);
    if (!await DB(A, q)) return {
        success: !1,
        reason: "task_not_found"
    };
    if (Y.checkAgentBusy) return $N9(A, q, K);

    let w;
    try {
        w = await EF6.lock(z, nD1);
        let O = await DB(A, q);
        if (!O) return { success: !1, reason: "task_not_found" };

        if (O.owner && O.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: O
        };

        if (O.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: O
        };

        let $ = await DX(A),
            H = new Set($.filter((M) => M.status !== "completed").map((M) => M.id)),
            j = O.blockedBy.filter((M) => H.has(M));

        if (j.length > 0) return {
            success: !1,
            reason: "blocked",
            task: O,
            blockedByTasks: j
        };

        return {
            success: !0,
            task: await WI(A, q, { owner: K })
        }
    } catch (O) {
        return k(`[Tasks] Failed to claim task ${q}: ${_1(O)}`), _6(O), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (w) await w()
    }
}

// READABLE (for understanding):
async function claimTask(taskListId, taskId, owner, options = {}) {
    // Quick check if task exists
    if (!await loadTask(taskListId, taskId)) {
        return { success: false, reason: "task_not_found" };
    }

    // Delegate to agent-busy validation if requested
    if (options.checkAgentBusy) {
        return claimTaskWithAgentBusyValidation(taskListId, taskId, owner);
    }

    const taskFilePath = getTaskFilePath(taskListId, taskId);
    let releaseLock;

    try {
        // Acquire lock on task file
        releaseLock = await lockfile.lock(taskFilePath, LOCK_OPTIONS);

        // Re-verify task after lock (could have changed)
        const task = await loadTask(taskListId, taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // Check already claimed by different owner
        if (task.owner && task.owner !== owner) {
            return { success: false, reason: "already_claimed", task };
        }

        // Check already completed
        if (task.status === "completed") {
            return { success: false, reason: "already_resolved", task };
        }

        // Check dependencies are completed
        const allTasks = await loadAllTasks(taskListId);
        const incompleteTaskIds = new Set(
            allTasks.filter(t => t.status !== "completed").map(t => t.id)
        );
        const blockedByIncomplete = task.blockedBy.filter(id => incompleteTaskIds.has(id));

        if (blockedByIncomplete.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task,
                blockedByTasks: blockedByIncomplete
            };
        }

        // Claim the task
        return {
            success: true,
            task: await updateTask(taskListId, taskId, { owner })
        };

    } catch (error) {
        logWarning(`[Tasks] Failed to claim task ${taskId}: ${formatError(error)}`);
        reportError(error);
        return { success: false, reason: "task_not_found" };

    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: OT8→claimTask, A→taskListId, q→taskId, K→owner, Y→options,
//          DB→loadTask, $N9→claimTaskWithAgentBusyValidation, yF6→getTaskFilePath,
//          EF6→lockfile, nD1→LOCK_OPTIONS, DX→loadAllTasks, WI→updateTask,
//          k→logWarning, _1→formatError, _6→reportError
```

---

## 8. getHighWaterMark (wN9) - Max ID Tracking

### What it does

Gets the maximum task ID from two sources: scanning task files and reading the `.highwatermark` file.

### How it works

1. Scan task files to find max ID
2. Read `.highwatermark` file
3. Return the maximum of both

### Why this approach

- **Dual-source tracking** provides redundancy
- **File scan** catches any missing watermark updates
- **Watermark file** provides fast lookup without scanning

```javascript
// ============================================
// getHighWaterMark - Get max ID from files and watermark
// Location: chunks.84.mjs:1664-1667
// ============================================

// ORIGINAL (for source lookup):
async function wN9(A) {
    let [q, K] = await Promise.all([W84(A), zT8(A)]);
    return Math.max(q, K)
}

// READABLE (for understanding):
async function getHighWaterMark(taskListId) {
    // Get both sources in parallel
    const [maxIdFromFiles, watermarkFromFile] = await Promise.all([
        getMaxTaskIdFromFiles(taskListId),    // Scan task files
        readHighWaterMarkFile(taskListId)      // Read .highwatermark file
    ]);

    // Return the maximum
    return Math.max(maxIdFromFiles, watermarkFromFile);
}

// Mapping: wN9→getHighWaterMark, A→taskListId, W84→getMaxTaskIdFromFiles, zT8→readHighWaterMarkFile
```

---

## 9. Helper Functions

### getTaskDirectory (wR)

```javascript
// ============================================
// getTaskDirectory - Get task directory path
// Location: chunks.84.mjs:1630-1632
// ============================================

// ORIGINAL (for source lookup):
function wR(A) {
    return kF6(c8(), "tasks", L06(A))
}

// READABLE (for understanding):
function getTaskDirectory(taskListId) {
    return path.join(getClaudeDir(), "tasks", sanitizeForFilename(taskListId));
}

// Mapping: wR→getTaskDirectory, A→taskListId, kF6→path.join, c8→getClaudeDir, L06→sanitizeForFilename
```

### getTaskFilePath (yF6)

```javascript
// ============================================
// getTaskFilePath - Get task file path
// Location: chunks.84.mjs:1634-1636
// ============================================

// ORIGINAL (for source lookup):
function yF6(A, q) {
    return kF6(wR(A), `${L06(q)}.json`)
}

// READABLE (for understanding):
function getTaskFilePath(taskListId, taskId) {
    return path.join(getTaskDirectory(taskListId), `${sanitizeForFilename(taskId)}.json`);
}

// Mapping: yF6→getTaskFilePath, A→taskListId, q→taskId, wR→getTaskDirectory, L06→sanitizeForFilename
```

### getLockFilePath (ON9)

```javascript
// ============================================
// getLockFilePath - Get lock file path
// Location: chunks.84.mjs:1766-1768
// ============================================

// ORIGINAL (for source lookup):
function ON9(A) {
    return kF6(wR(A), ".lock")
}

// READABLE (for understanding):
function getLockFilePath(taskListId) {
    return path.join(getTaskDirectory(taskListId), ".lock");
}

// Mapping: ON9→getLockFilePath, A→taskListId, wR→getTaskDirectory
```

### isTaskSystemEnabled (r$)

```javascript
// ============================================
// isTaskSystemEnabled - Check if structured tasks are enabled
// Location: chunks.84.mjs:1585-1588
// ============================================

// ORIGINAL (for source lookup):
function r$() {
    if (t6(process.env.CLAUDE_CODE_ENABLE_TASKS)) return !0;
    return !q7()
}

// READABLE (for understanding):
function isTaskSystemEnabled() {
    // Explicit environment variable
    if (isTruthy(process.env.CLAUDE_CODE_ENABLE_TASKS)) return true;
    // Check if TodoWrite mode is disabled
    return !isTodoWriteMode();
}

// Mapping: r$→isTaskSystemEnabled, t6→isTruthy, q7→isTodoWriteMode
```

---

## Task Schema

```typescript
interface Task {
    id: string;              // Auto-increment integer as string
    subject: string;         // Brief title (required)
    description: string;     // Detailed requirements (required)
    activeForm?: string;     // Present continuous status for UI spinner
    status: "pending" | "in_progress" | "completed";
    owner?: string;          // Agent name who owns this task
    blocks: string[];        // Task IDs waiting for this task
    blockedBy: string[];     // Task IDs this task is waiting for
    metadata?: Record<string, unknown>;  // Arbitrary key-value pairs
}
```

---

## Lock Configuration

```javascript
const LOCK_OPTIONS = {
    retries: 10,
    minTimeout: 5,    // 5ms
    maxTimeout: 100   // 100ms
};
```

---

## Symbol Validation Summary

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| jf | getTaskManager | chunks.84.mjs:1619 | ✅ Verified |
| aD1 | createTask | chunks.84.mjs:1669 | ✅ Verified |
| DB | loadTask | chunks.84.mjs:1687 | ✅ Verified |
| WI | updateTask | chunks.84.mjs:1701 | ✅ Verified |
| sD1 | deleteTask | chunks.84.mjs:1713 | ✅ Verified |
| DX | loadAllTasks | chunks.84.mjs:1742 | ✅ Verified |
| OT8 | claimTask | chunks.84.mjs:1781 | ✅ Verified |
| wN9 | getHighWaterMark | chunks.84.mjs:1664 | ✅ Verified |
| P84 | writeHighWaterMark | chunks.84.mjs:1580 | ✅ Verified |
| zT8 | readHighWaterMarkFile | chunks.84.mjs:1569 | ✅ Verified |
| W84 | getMaxTaskIdFromFiles | chunks.84.mjs:1647 | ✅ Verified |
| wR | getTaskDirectory | chunks.84.mjs:1630 | ✅ Verified |
| yF6 | getTaskFilePath | chunks.84.mjs:1634 | ✅ Verified |
| ON9 | getLockFilePath | chunks.84.mjs:1766 | ✅ Verified |
| r$ | isTaskSystemEnabled | chunks.84.mjs:1585 | ✅ Verified |
| _N9 | HIGHWATERMARK_FILENAME | ".highwatermark" | ✅ Verified |
| nD1 | lockOptions | {retries:10, minTimeout:5, maxTimeout:100} | ✅ Verified |

**Total validated**: 17 symbols

---

## Cross-Module Integration

### Task System ↔ System Reminder (04)

Task operations generate the following attachment types:
- `task_status` - Task state changes (create/update/delete)
- `task_claimed` - Task assignment notifications
- `task_completed` - Completion status for dependencies
- `task_progress` - Progress messages during execution

### Task System ↔ Tools (05)

- `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate` tools
- `TodoWrite` tool for simple todo mode (when `r$()` returns false)
- Task operations use file locking for concurrency
- Permission checks via `canUseTool`

### Task System ↔ Hooks (11)

- `TaskCompleted` hooks run before marking complete
- Hook can prevent completion with validation
- `getTaskCompletedHookMessage` generates hook messages
- `executeTaskCompletedHooks` is an async generator

### Task System ↔ Agent Teams (30)

- Team-isolated task storage (`~/.claude/tasks/{team-name}/`)
- `claimTask` with agent busy validation (`$N9`)
- `unassignTeammateTasks` on agent shutdown
- Teammate context determines task list ID via `getTeammateContext()`
- `claimUnclaimedTask` for auto-task assignment