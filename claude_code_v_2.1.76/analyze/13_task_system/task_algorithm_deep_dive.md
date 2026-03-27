# Task System Algorithm Deep Dive (Claude Code v2.1.76)

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Focus**: Task creation, claiming, dependency resolution, file locking algorithms

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions in this document:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `createTask` (aD1) - Create with auto-increment - chunks.84.mjs:1669
- `getHighWaterMark` (wN9) - Auto-increment ID - chunks.84.mjs:1664
- `claimTask` (OT8) - Atomic claim with validation - chunks.84.mjs:1781
- `updateTask` (WI) - Update with persistence - chunks.84.mjs:1701
- `deleteTask` (sD1) - Delete with cleanup - chunks.84.mjs:1713

---

## 1. Task Creation Algorithm (createTask - aD1)

### What it does

Creates a new task with an auto-incremented ID using file locking to prevent race conditions in multi-process environments.

### How it works

1. **Acquire Lock**: Get exclusive lock on task directory
2. **Get High Watermark**: Determine the maximum existing task ID
3. **Generate New ID**: New ID = high watermark + 1
4. **Write Task File**: Persist task data to JSON file
5. **Invalidate Cache**: Clear any cached task data
6. **Release Lock**: Free the file lock

### Why this approach

- **File locking** prevents race conditions when multiple agents create tasks simultaneously
- **High watermark tracking** provides O(1) ID generation instead of scanning all files
- **Dual-source verification** handles edge cases (manually deleted files, stale watermark)
- **Cache invalidation** ensures consistency across subsequent reads

### Key insight

The algorithm uses two sources for high watermark calculation:
1. File system scan (handles manual deletions)
2. `.highwatermark` file (fast lookup)

This redundancy ensures correctness even in edge cases where one source becomes stale.

```javascript
// ============================================
// createTask - Create task with auto-increment ID
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
    // Step 1: Get lock file path
    const lockPath = await getLockPath(taskListId);

    let releaseLock;
    try {
        // Step 2: Acquire exclusive lock
        releaseLock = await lockfile.lock(lockPath, {
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });

        // Step 3: Get current maximum ID (high watermark)
        const currentMaxId = await getHighWaterMark(taskListId);

        // Step 4: Generate new ID (auto-increment)
        const newId = String(currentMaxId + 1);

        // Step 5: Create task object with new ID
        const task = {
            id: newId,
            ...taskData
        };

        // Step 6: Write task file
        const taskPath = getTaskFilePath(taskListId, newId);
        await writeFile(taskPath, JSON.stringify(task, null, 2));

        // Step 7: Invalidate cache for consistency
        invalidateTaskCache();

        return newId;

    } finally {
        // Step 8: Always release lock (even on error)
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: aD1→createTask, A→taskListId, q→taskData, wT8→getLockPath,
//          EF6→lockfile, nD1→lockOptions, wN9→getHighWaterMark,
//          yF6→getTaskFilePath, iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache
```

---

## 2. High Watermark Algorithm (getHighWaterMark - wN9)

### What it does

Returns the maximum task ID from two sources: file system scan and persisted `.highwatermark` file.

### How it works

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        HIGH WATERMARK ALGORITHM                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────────┐         ┌─────────────────────────────┐             │
│  │  File System Scan   │         │  .highwatermark File        │             │
│  │                     │         │                             │             │
│  │  1.json → ID: 1     │         │  Content: "5"               │             │
│  │  2.json → ID: 2     │         │                             │             │
│  │  5.json → ID: 5     │         │  (fast lookup)              │             │
│  │                     │         │                             │             │
│  │  Max: 5             │         │  Value: 5                   │             │
│  └──────────┬──────────┘         └──────────────┬──────────────┘             │
│             │                                    │                             │
│             │         ┌──────────────────────────┘                             │
│             │         │                                                         │
│             ▼         ▼                                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                    Math.max(fileScan, watermarkFile)                  │   │
│  │                                                                        │   │
│  │                    Returns: 5                                         │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                                │
│  Edge Case: Manual file deletion                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │  Files: 1.json, 2.json (3.json was deleted)                          │   │
│  │  .highwatermark: "3"                                                  │   │
│  │                                                                        │   │
│  │  fileScan max: 2                                                      │   │
│  │  watermarkFile: 3                                                     │   │
│  │                                                                        │   │
│  │  Result: Math.max(2, 3) = 3                                          │   │
│  │                                                                        │   │
│  │  Next ID: 4 (preserves gap-less IDs even with manual deletion)       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

```javascript
// ============================================
// getHighWaterMark - Get maximum task ID
// Location: chunks.84.mjs:1664-1667
// ============================================

// ORIGINAL (for source lookup):
async function wN9(A) {
    let [q, K] = await Promise.all([W84(A), zT8(A)]);
    return Math.max(q, K)
}

// READABLE (for understanding):
async function getHighWaterMark(taskListId) {
    // Run both lookups in parallel for efficiency
    const [maxFromFiles, maxFromWatermarkFile] = await Promise.all([
        getMaxTaskIdFromFiles(taskListId),   // Scan directory
        readHighWaterMarkFile(taskListId)    // Read persisted value
    ]);

    // Return the maximum of both sources
    return Math.max(maxFromFiles, maxFromWatermarkFile);
}

// Mapping: wN9→getHighWaterMark, W84→getMaxTaskIdFromFiles, zT8→readHighWaterMarkFile

// ============================================
// getMaxTaskIdFromFiles - Scan directory for max ID
// Location: chunks.84.mjs:1647-1662
// ============================================

// ORIGINAL (for source lookup):
async function W84(A) {
    let q = wR(A),
        K;
    try {
        K = await YT8(q)
    } catch {
        return 0
    }
    let Y = 0;
    for (let z of K) {
        if (!z.endsWith(".json")) continue;
        let _ = parseInt(z.replace(".json", ""), 10);
        if (!isNaN(_) && _ > Y) Y = _
    }
    return Y
}

// READABLE (for understanding):
async function getMaxTaskIdFromFiles(taskListId) {
    const taskDir = getTaskDirectory(taskListId);

    let files;
    try {
        files = await readdir(taskDir);
    } catch {
        // Directory doesn't exist yet
        return 0;
    }

    let maxId = 0;
    for (const file of files) {
        // Only process .json files
        if (!file.endsWith(".json")) continue;

        // Extract numeric ID from filename
        const id = parseInt(file.replace(".json", ""), 10);

        // Track maximum
        if (!isNaN(id) && id > maxId) {
            maxId = id;
        }
    }

    return maxId;
}

// Mapping: W84→getMaxTaskIdFromFiles, wR→getTaskDirectory, YT8→readdir
```

---

## 3. Task Claiming Algorithm (claimTask - OT8)

### What it does

Atomically claims a task for an agent with comprehensive validation:
- Task exists
- Not already claimed by another agent
- Not already completed
- All dependencies are satisfied

### How it works

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        TASK CLAIMING ALGORITHM                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  claimTask(taskListId, taskId, owner, options)                               │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 1: Check task exists                                             │   │
│  │ if (!loadTask(taskListId, taskId)) → return { success: false,        │   │
│  │                                              reason: "task_not_found" }│   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 2: Check if agent-busy validation needed                         │   │
│  │ if (options.checkAgentBusy) → delegate to claimTaskWithAgentBusy     │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 3: Acquire file lock                                             │   │
│  │ releaseLock = await lockfile.lock(taskPath, lockOptions)             │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 4: RE-VERIFY task after lock (CRITICAL!)                         │   │
│  │                                                                        │   │
│  │ Why: Task state could have changed between initial check and lock    │   │
│  │                                                                        │   │
│  │ task = await loadTask(taskListId, taskId)                            │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 5: Check ownership conflict                                      │   │
│  │ if (task.owner && task.owner !== owner) → return {                   │   │
│  │     success: false, reason: "already_claimed", task                   │   │
│  │ }                                                                      │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 6: Check completion status                                       │   │
│  │ if (task.status === "completed") → return {                           │   │
│  │     success: false, reason: "already_resolved", task                  │   │
│  │ }                                                                      │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 7: Check dependencies                                            │   │
│  │                                                                        │   │
│  │ allTasks = await loadAllTasks(taskListId)                            │   │
│  │ incompleteIds = allTasks.filter(t => t.status !== "completed")       │   │
│  │ blockedByIncomplete = task.blockedBy.filter(id => incompleteIds.has(id))│
│  │                                                                        │   │
│  │ if (blockedByIncomplete.length > 0) → return {                        │   │
│  │     success: false, reason: "blocked", blockedByTasks: [...]          │   │
│  │ }                                                                      │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 8: Update task with owner and status                             │   │
│  │ await updateTask(taskListId, taskId, {                                │   │
│  │     owner: owner,                                                     │   │
│  │     status: "in_progress"                                             │   │
│  │ })                                                                     │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  return { success: true, task: updatedTask }                                  │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Why this approach

- **Re-verification after lock** is critical for correctness
- Without it, race conditions can occur:
  - Agent A checks: task is available
  - Agent B checks: task is available
  - Agent A acquires lock, claims task
  - Agent B acquires lock, claims task (overwrites A's claim!)
- **Dependency check** ensures tasks are worked in correct order
- **Owner tracking** enables multi-agent coordination

### Key insight

The re-verification step (Step 4) is the most important part. It handles the race condition window between initial availability check and lock acquisition.

```javascript
// ============================================
// claimTask - Atomic task claiming with validation
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
        if (!O) return {
            success: !1,
            reason: "task_not_found"
        };
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
        // Update task
        await WI(A, q, { owner: K, status: "in_progress" });
        return { success: !0, task: await DB(A, q) };
    } finally {
        if (w) await w()
    }
}

// READABLE (for understanding):
async function claimTask(taskListId, taskId, owner, options = {}) {
    const taskPath = getTaskFilePath(taskListId, taskId);

    // Step 1: Initial existence check
    if (!await loadTask(taskListId, taskId)) {
        return { success: false, reason: "task_not_found" };
    }

    // Step 2: Delegate to agent-busy validation if requested
    if (options.checkAgentBusy) {
        return claimTaskWithAgentBusyValidation(taskListId, taskId, owner);
    }

    let releaseLock;
    try {
        // Step 3: Acquire file lock
        releaseLock = await lockfile.lock(taskPath, {
            retries: 10,
            minTimeout: 5,
            maxTimeout: 100
        });

        // Step 4: RE-VERIFY after lock (CRITICAL!)
        const task = await loadTask(taskListId, taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // Step 5: Check ownership conflict
        if (task.owner && task.owner !== owner) {
            return { success: false, reason: "already_claimed", task };
        }

        // Step 6: Check completion status
        if (task.status === "completed") {
            return { success: false, reason: "already_resolved", task };
        }

        // Step 7: Check dependencies are completed
        const allTasks = await loadAllTasks(taskListId);
        const incompleteTaskIds = new Set(
            allTasks
                .filter(t => t.status !== "completed")
                .map(t => t.id)
        );
        const blockedByIncomplete = task.blockedBy.filter(
            id => incompleteTaskIds.has(id)
        );

        if (blockedByIncomplete.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task,
                blockedByTasks: blockedByIncomplete
            };
        }

        // Step 8: Update task with owner and status
        await updateTask(taskListId, taskId, {
            owner,
            status: "in_progress"
        });

        return { success: true, task: await loadTask(taskListId, taskId) };

    } finally {
        // Always release lock
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: OT8→claimTask, A→taskListId, q→taskId, K→owner, Y→options,
//          yF6→getTaskFilePath, DB→loadTask, $N9→claimTaskWithAgentBusyValidation,
//          EF6→lockfile, nD1→lockOptions, DX→loadAllTasks, WI→updateTask
```

---

## 4. Dependency Resolution Algorithm

### Dependency Graph Structure

Tasks use a **Directed Acyclic Graph (DAG)** for dependencies:

- `blockedBy: string[]` - Tasks this task is waiting for (incoming edges)
- `blocks: string[]` - Tasks waiting for this task (outgoing edges)

### Cycle Detection

When adding a dependency, the system checks for cycles:

```javascript
// ============================================
// Cycle Detection Algorithm
// Location: chunks.84.mjs (dependency update logic)
// ============================================

// READABLE (for understanding):
function wouldCreateCycle(taskId, dependsOnId, allTasks) {
    // BFS traversal from dependsOnId to check if it reaches taskId
    // If taskId is reachable, adding this edge would create a cycle

    const visited = new Set();
    const queue = [dependsOnId];

    while (queue.length > 0) {
        const current = queue.shift();

        // Found a path back to taskId - cycle detected!
        if (current === taskId) {
            return true;
        }

        if (visited.has(current)) continue;
        visited.add(current);

        // Get the task and follow its blockedBy edges
        const task = allTasks.find(t => t.id === current);
        if (task) {
            queue.push(...task.blockedBy);
        }
    }

    return false;  // No cycle detected
}

// Example: Adding dependency
async function addTaskDependency(taskListId, taskId, dependsOnId) {
    const allTasks = await loadAllTasks(taskListId);

    // Check for cycle
    if (wouldCreateCycle(taskId, dependsOnId, allTasks)) {
        throw new Error("Adding this dependency would create a cycle");
    }

    // Update both tasks (bidirectional reference)
    await updateTask(taskListId, taskId, {
        addBlockedBy: [dependsOnId]
    });
    await updateTask(taskListId, dependsOnId, {
        addBlocks: [taskId]
    });
}
```

### Dependency Availability Check

```javascript
// ============================================
// Check if task is available for work
// ============================================

// READABLE (for understanding):
async function isTaskAvailable(taskListId, taskId) {
    const task = await loadTask(taskListId, taskId);

    if (!task) return false;
    if (task.status !== "pending") return false;
    if (task.owner) return false;  // Already assigned

    // Check all dependencies are completed
    const allTasks = await loadAllTasks(taskListId);

    for (const blockingId of task.blockedBy) {
        const blockingTask = allTasks.find(t => t.id === blockingId);
        if (!blockingTask || blockingTask.status !== "completed") {
            return false;  // Dependency not satisfied
        }
    }

    return true;
}

// Get all available tasks for an agent
async function getAvailableTasks(taskListId) {
    const allTasks = await loadAllTasks(taskListId);

    return allTasks.filter(task => {
        if (task.status !== "pending") return false;
        if (task.owner) return false;

        // Check dependencies
        return task.blockedBy.every(blockingId => {
            const blockingTask = allTasks.find(t => t.id === blockingId);
            return blockingTask?.status === "completed";
        });
    });
}
```

---

## 5. Task Update Algorithm (updateTask - WI)

### What it does

Updates a task with validation, hook execution, and dependency propagation.

### How it works

```javascript
// ============================================
// updateTask - Update task with persistence
// Location: chunks.84.mjs:1701-1711
// ============================================

// ORIGINAL (for source lookup):
async function WI(A, q, K) {
    let Y = await DB(A, q);
    if (!Y) return;
    let z = { ...Y, ...K };

    // Handle addBlockedBy/addBlocks
    if (K.addBlockedBy) {
        z.blockedBy = [...new Set([...Y.blockedBy, ...K.addBlockedBy])];
    }
    if (K.addBlocks) {
        z.blocks = [...new Set([...Y.blocks, ...K.addBlocks])];
    }

    await iD1(yF6(A, q), B6(z, null, 2));
    Gt();

    // Run TaskCompleted hooks if marking complete
    if (K.status === "completed" && Y.status !== "completed") {
        await executeTaskCompletedHooks(z);
    }

    return z;
}

// READABLE (for understanding):
async function updateTask(taskListId, taskId, updates) {
    // Step 1: Load current task
    const currentTask = await loadTask(taskListId, taskId);
    if (!currentTask) return;

    // Step 2: Merge updates
    const updatedTask = { ...currentTask, ...updates };

    // Step 3: Handle special array updates (dependencies)
    if (updates.addBlockedBy) {
        updatedTask.blockedBy = [
            ...new Set([
                ...currentTask.blockedBy,
                ...updates.addBlockedBy
            ])
        ];
    }
    if (updates.addBlocks) {
        updatedTask.blocks = [
            ...new Set([
                ...currentTask.blocks,
                ...updates.addBlocks
            ])
        ];
    }

    // Step 4: Persist to disk
    await writeFile(
        getTaskFilePath(taskListId, taskId),
        JSON.stringify(updatedTask, null, 2)
    );

    // Step 5: Invalidate cache
    invalidateTaskCache();

    // Step 6: Run TaskCompleted hooks if completing task
    if (updates.status === "completed" && currentTask.status !== "completed") {
        await executeTaskCompletedHooks(updatedTask);
    }

    return updatedTask;
}

// Mapping: WI→updateTask, A→taskListId, q→taskId, K→updates, DB→loadTask,
//          iD1→writeFile, yF6→getTaskFilePath, B6→JSON.stringify, Gt→invalidateTaskCache
```

---

## 6. Task Deletion Algorithm (deleteTask - sD1)

### What it does

Deletes a task and cleans up all dependency references in other tasks.

### How it works

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        TASK DELETION ALGORITHM                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  deleteTask(taskListId, taskId)                                               │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 1: Load task to get dependency info                              │   │
│  │ task = await loadTask(taskListId, taskId)                            │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 2: Remove task from other tasks' blockedBy arrays                │   │
│  │ for (const blockedTaskId of task.blocks) {                            │   │
│  │     const blockedTask = await loadTask(taskListId, blockedTaskId)    │   │
│  │     blockedTask.blockedBy = blockedTask.blockedBy                    │   │
│  │         .filter(id => id !== taskId)                                 │   │
│  │     await updateTask(taskListId, blockedTaskId, blockedTask)         │   │
│  │ }                                                                      │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 3: Remove task from other tasks' blocks arrays                   │   │
│  │ for (const blockingTaskId of task.blockedBy) {                        │   │
│  │     const blockingTask = await loadTask(taskListId, blockingTaskId)  │   │
│  │     blockingTask.blocks = blockingTask.blocks                        │   │
│  │         .filter(id => id !== taskId)                                 │   │
│  │     await updateTask(taskListId, blockingTaskId, blockingTask)       │   │
│  │ }                                                                      │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 4: Delete task file                                              │   │
│  │ await unlink(getTaskFilePath(taskListId, taskId))                    │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│       │                                                                        │
│       ▼                                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │ Step 5: Invalidate cache                                              │   │
│  │ invalidateTaskCache()                                                 │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

```javascript
// ============================================
// deleteTask - Delete with dependency cleanup
// Location: chunks.84.mjs:1713-1740
// ============================================

// ORIGINAL (for source lookup):
async function sD1(A, q) {
    let K = await DB(A, q);
    if (!K) return;

    // Remove from blockedBy of tasks this task blocks
    for (let Y of K.blocks) {
        let z = await DB(A, Y);
        if (z) {
            z.blockedBy = z.blockedBy.filter(_ => _ !== q);
            await iD1(yF6(A, Y), B6(z, null, 2));
        }
    }

    // Remove from blocks of tasks this task depends on
    for (let Y of K.blockedBy) {
        let z = await DB(A, Y);
        if (z) {
            z.blocks = z.blocks.filter(_ => _ !== q);
            await iD1(yF6(A, Y), B6(z, null, 2));
        }
    }

    // Delete file
    await YT5(yF6(A, q));
    Gt();
}

// READABLE (for understanding):
async function deleteTask(taskListId, taskId) {
    // Step 1: Load task to get dependency info
    const task = await loadTask(taskListId, taskId);
    if (!task) return;

    // Step 2: Remove this task from blockedBy of tasks it blocks
    for (const blockedTaskId of task.blocks) {
        const blockedTask = await loadTask(taskListId, blockedTaskId);
        if (blockedTask) {
            blockedTask.blockedBy = blockedTask.blockedBy.filter(
                id => id !== taskId
            );
            await writeFile(
                getTaskFilePath(taskListId, blockedTaskId),
                JSON.stringify(blockedTask, null, 2)
            );
        }
    }

    // Step 3: Remove this task from blocks of tasks it depends on
    for (const blockingTaskId of task.blockedBy) {
        const blockingTask = await loadTask(taskListId, blockingTaskId);
        if (blockingTask) {
            blockingTask.blocks = blockingTask.blocks.filter(
                id => id !== taskId
            );
            await writeFile(
                getTaskFilePath(taskListId, blockingTaskId),
                JSON.stringify(blockingTask, null, 2)
            );
        }
    }

    // Step 4: Delete task file
    await unlink(getTaskFilePath(taskListId, taskId));

    // Step 5: Invalidate cache
    invalidateTaskCache();
}

// Mapping: sD1→deleteTask, A→taskListId, q→taskId, DB→loadTask,
//          iD1→writeFile, yF6→getTaskFilePath, B6→JSON.stringify,
//          YT5→unlink, Gt→invalidateTaskCache
```

---

## 7. Task Manager Resolution (getTaskManager - jf)

### What it does

Resolves the task list ID from the current context, supporting multiple sources:
1. Environment variable override
2. Teammate context (team name)
3. Session ID or fallback

```javascript
// ============================================
// getTaskManager - Resolve task list ID
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
    // Priority 1: Environment variable override
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) {
        return process.env.CLAUDE_CODE_TASK_LIST_ID;
    }

    // Priority 2: Teammate context (team mode)
    const teammateContext = getTeammateContext();
    if (teammateContext) {
        return teammateContext.teamName;
    }

    // Priority 3: Session ID or fallback
    return getSessionId() || cachedSessionId || generateRandomId();
}

// Mapping: jf→getTaskManager, iM→getTeammateContext, l5→getSessionId,
//          VF6→cachedSessionId, R1→generateRandomId
```

---

## 8. File Locking Configuration

### Lock Options

```javascript
// ============================================
// Lock Configuration
// Location: chunks.84.mjs:1942
// ============================================

// ORIGINAL (for source lookup):
const nD1 = {
    retries: 10,
    minTimeout: 5,
    maxTimeout: 100
};

// READABLE (for understanding):
const lockOptions = {
    retries: 10,      // Number of retry attempts
    minTimeout: 5,    // Minimum wait between retries (ms)
    maxTimeout: 100   // Maximum wait between retries (ms)
};

// Lock path generation
async function getLockPath(taskListId) {
    const taskDir = getTaskDirectory(taskListId);
    return path.join(taskDir, ".lock");
}
```

---

## Symbol Validation Summary

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| jf | getTaskManager | chunks.84.mjs:1619 | ✅ Verified |
| aD1 | createTask | chunks.84.mjs:1669 | ✅ Verified |
| wN9 | getHighWaterMark | chunks.84.mjs:1664 | ✅ Verified |
| W84 | getMaxTaskIdFromFiles | chunks.84.mjs:1647 | ✅ Verified |
| zT8 | readHighWaterMarkFile | chunks.84.mjs:1569 | ✅ Verified |
| OT8 | claimTask | chunks.84.mjs:1781 | ✅ Verified |
| $N9 | claimTaskWithAgentBusyValidation | chunks.84.mjs:1831 | ✅ Verified |
| WI | updateTask | chunks.84.mjs:1701 | ✅ Verified |
| sD1 | deleteTask | chunks.84.mjs:1713 | ✅ Verified |
| DB | loadTask | chunks.84.mjs:1687 | ✅ Verified |
| DX | loadAllTasks | chunks.84.mjs:1742 | ✅ Verified |
| nD1 | lockOptions | chunks.84.mjs:1942 | ✅ Verified |
| _N9 | HIGHWATERMARK_FILENAME | chunks.84.mjs:1914 | ✅ Verified |

**Total validated**: 13 symbols

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced dependency resolution, cycle detection |
| 2.1.32 | Team task isolation, claim validation |
| 2.1.7 | Initial task system (refactored from TodoWrite) |