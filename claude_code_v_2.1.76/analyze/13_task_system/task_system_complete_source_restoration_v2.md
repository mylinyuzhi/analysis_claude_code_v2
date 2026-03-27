# Task System Module - Complete Source Restoration v2 (Claude Code 2.1.76)

> **Complete source-level restoration** of the task management system with cross-validated symbols and detailed algorithm analysis.
> **Version 2** - Enhanced with locking, dependency resolution, and high-watermark algorithms.

---

## Related Symbols

> Symbol mappings: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions documented here:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `createTask` (aD1) - Atomic creation - chunks.84.mjs:1669
- `loadTask` (DB) - Load and validate - chunks.84.mjs:1687
- `updateTask` (WI) - Update with validation - chunks.84.mjs:1701
- `deleteTask` (sD1) - Delete with cleanup - chunks.84.mjs:1713
- `loadAllTasks` (DX) - Load all tasks - chunks.84.mjs:1742
- `claimTask` (OT8) - Lock-based claiming - chunks.84.mjs:1781
- `claimTaskWithAgentBusyValidation` ($N9) - Claim with busy check - chunks.84.mjs:1831
- `unassignTeammateTasks` (ft) - Cleanup on shutdown - chunks.84.mjs:1883
- `getHighWaterMark` (wN9) - Get max ID - chunks.84.mjs:1664

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
│  │  jf=getTaskManager │ aD1=createTask │ DB=loadTask          │  │
│  │  WI=updateTask │ sD1=deleteTask │ DX=loadAllTasks          │  │
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
│  │  • TaskCompleted Hooks (Hi6) - Pre-completion validation  │  │
│  │  • Team Messaging - Assignment notifications               │  │
│  │  • UI State - expandedView: "tasks"                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. getTaskManager (jf) - Task List ID Resolution

### What it does

Resolves the task list ID from the current context, using environment variable, team context, or agent ID.

### How it works

1. Check environment variable CLAUDE_CODE_TASK_LIST_ID
2. Check teammate context for team name
3. Fall back to agent ID or generate UUID

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

Atomically creates a new task with auto-increment ID, using file locking to prevent race conditions.

### How it works

1. Ensure task directory exists
2. Acquire file lock
3. Get current high watermark (max ID)
4. Increment ID and create task object
5. Write task file
6. Invalidate cache
7. Release lock

### Why this approach

- **File locking** prevents concurrent creation from generating duplicate IDs
- **High watermark** ensures IDs are always increasing, even after deletion
- **Cache invalidation** ensures fresh data on next read

```javascript
// ============================================
// createTask - Atomic task creation with auto-increment ID
// Location: chunks.84.mjs:1669-1685
// ============================================

// ORIGINAL (for source lookup):
async function aD1(A, q) {
    let K = await wT8(A),
        Y;
    try {
        Y = await EF6.lock(K, nD1);
        let z = await wN9(A),
            _ = String(z + 1),
            w = {
                id: _,
                ...q
            },
            O = yF6(A, _);
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

Loads a task from disk and validates it against the task schema.

```javascript
// ============================================
// loadTask - Load and validate task from disk
// Location: chunks.84.mjs:1687-1698
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
        const content = await readFile(taskFilePath, "utf-8");
        const parsed = JSON.parse(content);

        // Validate against schema
        const validationResult = TaskSchema.safeParse(parsed);
        if (!validationResult.success) {
            console.warn(`[Tasks] Task ${taskId} failed schema validation: ${validationResult.error.message}`);
            return null;
        }

        return validationResult.data;

    } catch (error) {
        // File not found is expected (task may not exist)
        if (error.code === "ENOENT") return null;

        // Log other errors
        console.warn(`[Tasks] Failed to read task ${taskId}: ${formatError(error)}`);
        reportError(error);
        return null;
    }
}

// Mapping: DB→loadTask, A→taskListId, q→taskId, yF6→getTaskFilePath,
//          H84→readFile, i1→JSON.parse, zN9→TaskSchema, k→console.warn, _6→reportError
```

---

## 4. updateTask (WI) - Update Task

### What it does

Updates a task with new data, preserving the ID.

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

    // Merge updates, preserving ID
    const updatedTask = {
        ...existingTask,
        ...updates,
        id: taskId  // Ensure ID is never changed
    };

    // Write to disk
    const taskFilePath = getTaskFilePath(taskListId, taskId);
    await writeFile(taskFilePath, JSON.stringify(updatedTask, null, 2));

    // Invalidate cache
    invalidateTaskCache();

    return updatedTask;
}

// Mapping: WI→updateTask, A→taskListId, q→taskId, K→updates,
//          DB→loadTask, yF6→getTaskFilePath, iD1→writeFile, Gt→invalidateTaskCache
```

---

## 5. deleteTask (sD1) - Delete with Cleanup

### What it does

Deletes a task and cleans up all dependency references from other tasks.

### How it works

1. Update high watermark if deleted ID is higher
2. Delete task file
3. Load all other tasks
4. Remove deleted task ID from blocks/blockedBy arrays
5. Update affected tasks

```javascript
// ============================================
// deleteTask - Delete task and clean dependency references
// Location: chunks.84.mjs:1713-1739
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
        // Update high watermark if this ID is the highest
        const taskIdNum = parseInt(taskId, 10);
        if (!isNaN(taskIdNum)) {
            const currentWatermark = await readHighWaterMarkFile(taskListId);
            if (taskIdNum > currentWatermark) {
                await writeHighWaterMark(taskListId, taskIdNum);
            }
        }

        // Delete the task file
        try {
            await unlink(taskFilePath);
        } catch (error) {
            if (error.code === "ENOENT") return false;  // Already deleted
            throw error;
        }

        // Clean up dependency references in all other tasks
        const allTasks = await loadAllTasks(taskListId);
        for (const task of allTasks) {
            const newBlocks = task.blocks.filter(id => id !== taskId);
            const newBlockedBy = task.blockedBy.filter(id => id !== taskId);

            // Only update if references changed
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
//          zT8→readHighWaterMarkFile, P84→writeHighWaterMark, j84→unlink,
//          DX→loadAllTasks, WI→updateTask, Gt→invalidateTaskCache
```

---

## 6. loadAllTasks (DX) - Load All Tasks

### What it does

Loads all tasks from a task list, filtering out any that fail validation.

```javascript
// ============================================
// loadAllTasks - Load all tasks for a task list
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
        files = await readdir(taskDirectory);
    } catch {
        return [];  // Directory doesn't exist
    }

    // Get all JSON file names (without extension)
    const taskIds = files
        .filter(f => f.endsWith(".json"))
        .map(f => f.replace(".json", ""));

    // Load all tasks in parallel, filter out invalid ones
    const tasks = await Promise.all(
        taskIds.map(id => loadTask(taskListId, id))
    );

    return tasks.filter(t => t !== null);
}

// Mapping: DX→loadAllTasks, A→taskListId, wR→getTaskDirectory,
//          YT8→readdir, DB→loadTask
```

---

## 7. claimTask (OT8) - Lock-Based Claiming

### What it does

Atomically claims a task for an owner, validating ownership, status, and dependencies.

### How it works

1. Verify task exists
2. Delegate to busy validation if requested
3. Acquire lock on task file
4. Re-verify after lock (could have changed)
5. Check ownership conflict
6. Check already completed
7. Check dependencies are completed
8. Set owner and return success

```javascript
// ============================================
// claimTask - Lock-based claiming with dependency validation
// Location: chunks.84.mjs:1781-1829
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
        console.warn(`[Tasks] Failed to claim task ${taskId}: ${formatError(error)}`);
        reportError(error);
        return { success: false, reason: "task_not_found" };

    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: OT8→claimTask, A→taskListId, q→taskId, K→owner, Y→options,
//          DB→loadTask, $N9→claimTaskWithAgentBusyValidation, yF6→getTaskFilePath,
//          EF6→lockfile, nD1→LOCK_OPTIONS, DX→loadAllTasks, WI→updateTask,
//          k→console.warn, _1→formatError, _6→reportError
```

---

## 8. getHighWaterMark (wN9) - ID Tracking

### What it does

Gets the maximum task ID from both file scanning and the watermark file.

### Why this approach

Dual-source tracking ensures robustness:
- If watermark file is corrupted, file scanning provides backup
- If task files are missing, watermark file remembers highest ID

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

// Mapping: wN9→getHighWaterMark, A→taskListId, W84→getMaxTaskIdFromFiles,
//          zT8→readHighWaterMarkFile
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

## State Machine

```
┌──────────┐     TaskUpdate(status: "in_progress")     ┌──────────────┐
│ PENDING  │ ─────────────────────────────────────────▶│ IN_PROGRESS  │
└──────────┘                                            └──────┬───────┘
     │                                                         │
     │                    TaskUpdate(status: "completed")      │
     │                   + Hook validation passes              │
     │                                                         │
     │                    ┌──────────┐                         │
     └───────────────────▶│COMPLETED │◀────────────────────────┘
                          └──────────┘

     Any state + TaskUpdate(status: "deleted")
                          ┌──────────┐
                          │ DELETED  │ (File removed, dependencies cleaned)
                          └──────────┘
```

---

## Key Algorithms

### High Watermark Algorithm

**Why dual-source?**
- **Robustness**: If watermark file corrupted, file scan provides backup
- **Performance**: Watermark file is faster than scanning all files
- **Correctness**: Even if files are manually deleted, ID won't be reused

```
getHighWaterMark(taskListId)
    │
    ├─→ In parallel:
    │     ├─→ Scan all .json files, extract IDs, return max
    │     └─→ Read .highwatermark file
    │
    └─→ Return Math.max(fileScan, watermarkFile)
```

### Dependency Resolution Algorithm

```
claimTask validation:
    │
    ├─→ Load all tasks
    │
    ├─→ Build set of incomplete task IDs
    │     └─→ tasks.filter(t => t.status !== "completed").map(t => t.id)
    │
    ├─→ Check task.blockedBy against incomplete set
    │
    └─→ If any blockedBy IDs in incomplete set:
          └─→ Return blocked error with blocking task IDs
```

### Lock Acquisition Pattern

```
async function withLock(taskListId, operation) {
    const lockPath = getLockFilePath(taskListId);
    let release;

    try {
        release = await lock(lockPath, {
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });

        return await operation();

    } finally {
        if (release) await release();
    }
}
```

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
- `TodoWrite` tool for simple todo mode (when structured tasks disabled)
- Task operations use file locking for concurrency
- Permission checks via `canUseTool`

### Task System ↔ Hooks (11)

- `TaskCompleted` hooks run before marking complete
- Hook can prevent completion with validation
- `getTaskCompletedHookMessage` generates hook messages
- `executeTaskCompletedHooks` is an async generator

### Task System ↔ Agent Teams (30)

- Team-isolated task storage (`~/.claude/tasks/{team-name}/`)
- `claimTask` with agent busy validation
- `unassignTeammateTasks` on agent shutdown
- Teammate context determines task list ID

### Task System ↔ UI (02)

- Task list visualization in expanded view
- Status indicators (pending/in_progress/completed)
- Dependency graph display
- Owner assignment display

---

## Symbol Validation Status

**Last validated:** 2026-03-27

| Symbol | Location | Status |
|--------|----------|--------|
| jf (getTaskManager) | chunks.84.mjs:1619 | ✅ Correct |
| aD1 (createTask) | chunks.84.mjs:1669 | ✅ Correct |
| DB (loadTask) | chunks.84.mjs:1687 | ✅ Correct |
| WI (updateTask) | chunks.84.mjs:1701 | ✅ Correct |
| sD1 (deleteTask) | chunks.84.mjs:1713 | ✅ Correct |
| DX (loadAllTasks) | chunks.84.mjs:1742 | ✅ Correct |
| OT8 (claimTask) | chunks.84.mjs:1781 | ✅ Correct |
| $N9 (claimTaskWithAgentBusyValidation) | chunks.84.mjs:1831 | ✅ Correct |
| ft (unassignTeammateTasks) | chunks.84.mjs:1883 | ✅ Correct |
| wN9 (getHighWaterMark) | chunks.84.mjs:1664 | ✅ Correct |
| zT8 (readHighWaterMarkFile) | chunks.84.mjs:1569 | ✅ Correct |
| P84 (writeHighWaterMark) | chunks.84.mjs:1580 | ✅ Correct |
| W84 (getMaxTaskIdFromFiles) | chunks.84.mjs:1647 | ✅ Correct |
| _N9 (HIGHWATERMARK_FILENAME) | chunks.84.mjs:1914 | ✅ Correct |
| nD1 (lockOptions) | chunks.84.mjs:1942 | ✅ Correct |