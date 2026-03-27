# Task System Core Functions Source Restoration (Claude Code 2.1.76)

> Complete source-level restoration of task creation, claiming, dependency management, and high watermark tracking.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions in this document:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `createTask` (aD1) - Atomic task creation - chunks.84.mjs:1669
- `loadTask` (DB) - Load and validate task - chunks.84.mjs:1687
- `updateTask` (WI) - Update with validation - chunks.84.mjs:1701
- `deleteTask` (sD1) - Delete with dependency cleanup - chunks.84.mjs:1713
- `loadAllTasks` (DX) - Load all tasks - chunks.84.mjs:1742
- `claimTask` (OT8) - Lock-based claiming - chunks.84.mjs:1781
- `getHighWaterMark` (wN9) - ID tracking - chunks.84.mjs:1664

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TASK SYSTEM ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Storage Layout (~/.claude/tasks/{task-list-id}/)                   │
│  ├── 1.json              # Task file                                │
│  ├── 2.json              # Task file                                │
│  ├── .highwatermark      # Max ID tracking                          │
│  └── .lock               # Concurrency control                      │
│                                                                       │
│  Core Functions:                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ jf (getTaskManager) - Resolve task list ID from context     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│       │                                                               │
│       ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ aD1 (createTask) - Atomic creation with auto-increment ID   │   │
│  │   1. Lock directory                                          │   │
│  │   2. Get high watermark                                      │   │
│  │   3. Increment ID                                            │   │
│  │   4. Write task file                                         │   │
│  │   5. Invalidate cache                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│       │                                                               │
│       ▼                                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ OT8 (claimTask) - Lock-based claiming with validation        │   │
│  │   1. Check task exists                                       │   │
│  │   2. Check not already claimed                               │   │
│  │   3. Check not already completed                             │   │
│  │   4. Check dependencies completed                            │   │
│  │   5. Set owner                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. getTaskManager (jf) - Task List ID Resolution

**What it does:**
Resolves the task list ID from the current context. Priority: env var → teammate context → agent ID.

**How it works:**
1. Check `CLAUDE_CODE_TASK_LIST_ID` environment variable
2. If in teammate context, use team name from `iM()`
3. Fall back to agent ID from `l5()` or default

**Why this approach:**
- Environment variable allows explicit override for testing
- Teammate context enables multi-agent task coordination
- Fallback ensures single-agent scenarios work

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

**What it does:**
Creates a new task with auto-incremented ID. Uses file locking to prevent race conditions in multi-agent scenarios.

**How it works:**
1. Ensure task directory exists and acquire lock
2. Get current high watermark (max ID in use)
3. Increment to create new ID
4. Write task file with schema validation
5. Invalidate cache
6. Release lock

**Why this approach:**
- File locking (`EF6.lock`) prevents concurrent creation from multiple agents
- High watermark ensures monotonically increasing IDs
- Cache invalidation ensures fresh reads for dependency checks

**Key insight:**
The lock is acquired on a `.lock` file in the task directory, not on individual task files. This prevents any concurrent modifications within the same task list, simplifying the concurrency model.

```javascript
// ============================================
// createTask - Atomic task creation with auto-increment
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

        // Step 3: Get current high watermark
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

// Mapping: aD1→createTask, A→taskListId, q→taskData, K→lockFilePath,
//          Y→releaseLock, EF6→lockfile, nD1→LOCK_OPTIONS, wN9→getHighWaterMark,
//          yF6→getTaskFilePath, iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache
```

---

## 3. loadTask (DB) - Load and Validate Task

**What it does:**
Loads a task from disk and validates it against the task schema.

**How it works:**
1. Build task file path
2. Read file content
3. Parse JSON
4. Validate against Zod schema
5. Return validated task or null on error

**Why this approach:**
- Schema validation ensures data integrity
- Graceful error handling (returns null instead of throwing)
- ENOENT check distinguishes "not found" from "corrupted"

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
        // Read file content
        const fileContent = await readFile(taskFilePath, "utf-8");

        // Parse JSON
        const parsedData = JSON.parse(fileContent);

        // Validate against task schema
        const validationResult = taskSchema().safeParse(parsedData);

        if (!validationResult.success) {
            debugLog(`[Tasks] Task ${taskId} failed schema validation: ${validationResult.error.message}`);
            return null;
        }

        return validationResult.data;

    } catch (error) {
        // File doesn't exist
        if (error.code === "ENOENT") {
            return null;
        }

        // Log and report other errors
        debugLog(`[Tasks] Failed to read task ${taskId}: ${formatError(error)}`);
        reportError(error);
        return null;
    }
}

// Mapping: DB→loadTask, A→taskListId, q→taskId, K→taskFilePath,
//          H84→readFile, i1→JSON.parse, zN9→taskSchema, k→debugLog,
//          _1→formatError, _6→reportError
```

---

## 4. updateTask (WI) - Update Task with Validation

**What it does:**
Updates an existing task with new data, preserving the ID.

**How it works:**
1. Load existing task
2. Merge with new data (ID preserved)
3. Write updated task
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
    if (!existingTask) {
        return null;
    }

    // Merge updates, preserving ID
    const updatedTask = {
        ...existingTask,
        ...updates,
        id: taskId  // ID is immutable
    };

    // Write to disk
    const taskFilePath = getTaskFilePath(taskListId, taskId);
    await writeFile(taskFilePath, JSON.stringify(updatedTask, null, 2));

    // Invalidate cache
    invalidateTaskCache();

    return updatedTask;
}

// Mapping: WI→updateTask, A→taskListId, q→taskId, K→updates,
//          DB→loadTask, yF6→getTaskFilePath, iD1→writeFile,
//          B6→JSON.stringify, Gt→invalidateTaskCache
```

---

## 5. deleteTask (sD1) - Delete with Dependency Cleanup

**What it does:**
Deletes a task and removes it from all dependency references (blocks/blockedBy arrays of other tasks).

**How it works:**
1. Update high watermark if deleted task had higher ID
2. Delete the task file
3. Load all tasks and clean dependency references
4. Update any tasks that referenced the deleted task

**Why this approach:**
- Dependency cleanup prevents orphaned references
- High watermark update ensures ID continuity for future tasks
- Transactional approach - file deleted before dependency cleanup

```javascript
// ============================================
// deleteTask - Delete task with dependency cleanup
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
        // Update high watermark if needed
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
            if (error.code === "ENOENT") {
                return false;  // Task didn't exist
            }
            throw error;
        }

        // Clean up dependency references in other tasks
        const allTasks = await loadAllTasks(taskListId);

        for (const task of allTasks) {
            // Remove deleted task from blocks array
            const newBlocks = task.blocks.filter(id => id !== taskId);
            // Remove deleted task from blockedBy array
            const newBlockedBy = task.blockedBy.filter(id => id !== taskId);

            // Only update if arrays changed
            if (newBlocks.length !== task.blocks.length ||
                newBlockedBy.length !== task.blockedBy.length) {
                await updateTask(taskListId, task.id, {
                    blocks: newBlocks,
                    blockedBy: newBlockedBy
                });
            }
        }

        // Invalidate cache
        invalidateTaskCache();

        return true;

    } catch {
        return false;
    }
}

// Mapping: sD1→deleteTask, A→taskListId, q→taskId, K→taskFilePath,
//          yF6→getTaskFilePath, zT8→readHighWaterMarkFile, P84→writeHighWaterMark,
//          j84→unlink, DX→loadAllTasks, WI→updateTask, Gt→invalidateTaskCache
```

---

## 6. claimTask (OT8) - Lock-Based Claiming with Validation

**What it does:**
Claims a task for an agent, with validation for ownership, completion status, and dependencies.

**How it works:**
1. Check task exists
2. Check not already claimed by another agent
3. Check not already completed
4. Check all dependencies are completed
5. Set owner atomically

**Why this approach:**
- Lock-based claiming prevents race conditions
- Dependency check ensures proper execution order
- Owner assignment enables task tracking in multi-agent scenarios

```javascript
// ============================================
// claimTask - Lock-based claiming with validation
// Location: chunks.84.mjs:1781-1850
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
        // ... set owner and update task
    } finally {
        if (w) await w()
    }
}

// READABLE (for understanding):
async function claimTask(taskListId, taskId, agentId, options = {}) {
    const taskFilePath = getTaskFilePath(taskListId, taskId);

    // Quick check: task exists
    if (!await loadTask(taskListId, taskId)) {
        return {
            success: false,
            reason: "task_not_found"
        };
    }

    // Agent busy validation (delegates to specialized function)
    if (options.checkAgentBusy) {
        return claimTaskWithAgentBusyValidation(taskListId, taskId, agentId);
    }

    let releaseLock;

    try {
        // Acquire lock on task file
        releaseLock = await lockfile.lock(taskFilePath, LOCK_OPTIONS);

        // Re-check task exists (under lock)
        const task = await loadTask(taskListId, taskId);
        if (!task) {
            return {
                success: false,
                reason: "task_not_found"
            };
        }

        // Check: not already claimed by another agent
        if (task.owner && task.owner !== agentId) {
            return {
                success: false,
                reason: "already_claimed",
                task
            };
        }

        // Check: not already completed
        if (task.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task
            };
        }

        // Check: all dependencies completed
        const allTasks = await loadAllTasks(taskListId);
        const incompleteTaskIds = new Set(
            allTasks
                .filter(t => t.status !== "completed")
                .map(t => t.id)
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

        // All checks passed - claim the task
        await updateTask(taskListId, taskId, {
            owner: agentId,
            status: "in_progress"
        });

        return {
            success: true,
            task: await loadTask(taskListId, taskId)
        };

    } finally {
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: OT8→claimTask, A→taskListId, q→taskId, K→agentId, Y→options,
//          yF6→getTaskFilePath, DB→loadTask, EF6→lockfile, nD1→LOCK_OPTIONS,
//          DX→loadAllTasks, $N9→claimTaskWithAgentBusyValidation
```

---

## 7. getHighWaterMark (wN9) - ID Tracking Algorithm

**What it does:**
Returns the highest task ID in use, considering both the high watermark file and actual task files.

**How it works:**
1. Scan task directory for all .json files
2. Extract numeric IDs from filenames
3. Read high watermark file
4. Return the maximum of both sources

**Why this approach:**
- Dual-source check handles edge cases:
  - Deleted tasks: high watermark may be higher than existing files
  - Manual file creation: files may have higher IDs than watermark
- Ensures no ID collisions even with manual intervention

```javascript
// ============================================
// getHighWaterMark - Get highest task ID in use
// Location: chunks.84.mjs:1664-1667
// ============================================

// ORIGINAL (for source lookup):
async function wN9(A) {
    let [q, K] = await Promise.all([W84(A), zT8(A)]);
    return Math.max(q, K)
}

// READABLE (for understanding):
async function getHighWaterMark(taskListId) {
    // Run both checks in parallel
    const [maxFromFileNames, storedWatermark] = await Promise.all([
        getMaxTaskIdFromFiles(taskListId),  // Scan actual files
        readHighWaterMarkFile(taskListId)    // Read stored watermark
    ]);

    // Return the maximum of both sources
    return Math.max(maxFromFileNames, storedWatermark);
}

// ============================================
// getMaxTaskIdFromFiles - Scan files for max ID
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
        return 0;  // Directory doesn't exist
    }

    let maxId = 0;
    for (const filename of files) {
        if (!filename.endsWith(".json")) continue;

        const id = parseInt(filename.replace(".json", ""), 10);
        if (!isNaN(id) && id > maxId) {
            maxId = id;
        }
    }

    return maxId;
}

// Mapping: wN9→getHighWaterMark, W84→getMaxTaskIdFromFiles, zT8→readHighWaterMarkFile,
//          A→taskListId, q→taskDir, K→files, wR→getTaskDirectory, YT8→readdir
```

---

## 8. Task Schema

```javascript
// ============================================
// taskSchema - Zod validation schema
// Location: chunks.84.mjs:1932
// ============================================

const taskStatusSchema = z.enum(["pending", "in_progress", "completed"]);

const taskSchema = z.object({
    id: z.string(),                              // Auto-increment as string
    subject: z.string(),                         // Brief title (required)
    description: z.string(),                     // Detailed requirements (required)
    activeForm: z.string().optional(),           // Present continuous for UI spinner
    status: taskStatusSchema,                    // Task state
    owner: z.string().optional(),                // Agent name who owns this task
    blocks: z.array(z.string()).default([]),     // Task IDs waiting for this task
    blockedBy: z.array(z.string()).default([]),  // Task IDs this task is waiting for
    metadata: z.record(z.unknown()).optional()   // Arbitrary key-value pairs
});
```

---

## Integration with System Reminder

Task operations generate the following attachment types:

| Operation | Attachment Type | Content |
|-----------|-----------------|---------|
| createTask | `task_status` | New task created |
| updateTask | `task_status` | Task updated (status change) |
| claimTask | `task_claimed` | Task assigned to agent |
| deleteTask | `task_status` | Task deleted |
| updateTask (complete) | `task_completed` | Task completed (triggers hooks) |

---

## Cross-Reference

- [task_locking_complete.md](../13_task_system/task_locking_complete.md) - Locking details
- [task_dependency_resolution_complete.md](../13_task_system/task_dependency_resolution_complete.md) - Dependency algorithms
- [task_reminder_integration.md](../13_task_system/task_reminder_integration.md) - System reminder integration
- [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md#module-task-system) - Symbol mappings