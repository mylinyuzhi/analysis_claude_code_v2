# Task System Module - Complete Source Restoration v3

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Full source-level restoration with grep-verified symbols

---

## Overview

This document provides complete source-level restoration of all key functions in the Task System module. The Task System provides structured task tracking with dependency management for multi-agent coordination.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions documented here:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `createTask` (aD1) - Create with auto-increment - chunks.84.mjs:1669
- `loadTask` (DB) - Load and validate - chunks.84.mjs:1687
- `updateTask` (WI) - Update with validation - chunks.84.mjs:1701
- `deleteTask` (sD1) - Delete with cleanup - chunks.84.mjs:1713
- `loadAllTasks` (DX) - Load all tasks - chunks.84.mjs:1742
- `claimTask` (OT8) - Atomic claim with validation - chunks.84.mjs:1781
- `getHighWaterMark` (wN9) - Auto-increment ID - chunks.84.mjs:1664

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

## 1. getTaskManager (jf) - Resolve Task List ID

### What it does

Resolves the task list ID from multiple sources with priority ordering. This determines which task directory to use.

### How it works

1. Check explicit environment variable
2. Check teammate context (multi-agent scenario)
3. Fall back to agent ID or default

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

## 2. createTask (aD1) - Create with Auto-Increment

### What it does

Creates a new task with an auto-incremented ID using file locking to prevent race conditions.

### How it works

1. Ensure directory exists and get lock file path
2. Acquire exclusive lock
3. Get current high watermark (max ID)
4. Generate new ID (increment)
5. Write task file
6. Invalidate cache
7. Release lock

### Why this approach

- **File locking** prevents race conditions when multiple agents create tasks simultaneously
- **High watermark tracking** provides O(1) ID generation instead of scanning all files
- **Dual-source verification** handles edge cases (manually deleted files, stale watermark)
- **Cache invalidation** ensures consistency across subsequent reads

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
    const lockPath = await ensureTaskDirectoryAndGetLock(taskListId);

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

// Mapping: aD1→createTask, A→taskListId, q→taskData, wT8→ensureTaskDirectoryAndGetLock,
//          EF6→lockfile, nD1→LOCK_OPTIONS, wN9→getHighWaterMark, yF6→getTaskFilePath,
//          iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache
```

---

## 3. getHighWaterMark (wN9) - Auto-Increment ID

### What it does

Returns the maximum task ID from two sources: file system scan and persisted `.highwatermark` file.

### How it works

1. Run both lookups in parallel for efficiency
2. File scan: Read all .json files and extract IDs
3. Watermark file: Read persisted value
4. Return the maximum of both sources

### Why this approach

**Dual-source verification** ensures correctness even in edge cases:
- If a file is manually deleted, file scan returns lower value
- If `.highwatermark` is stale, it returns lower value
- Taking max ensures we never reuse an ID

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

// Mapping: wN9→getHighWaterMark, A→taskListId, W84→getMaxTaskIdFromFiles,
//          zT8→readHighWaterMarkFile
```

---

## 4. loadTask (DB) - Load and Validate

### What it does

Loads a task from disk and validates it against the schema.

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
    const taskPath = getTaskFilePath(taskListId, taskId);

    try {
        const content = await readFile(taskPath, "utf-8");
        const parsed = JSON.parse(content);

        // Validate against schema
        const result = TaskSchema().safeParse(parsed);
        if (!result.success) {
            debugLog(`[Tasks] Task ${taskId} failed schema validation: ${result.error.message}`);
            return null;
        }

        return result.data;

    } catch (error) {
        // File not found
        if (error.code === "ENOENT") {
            return null;
        }
        // Other errors
        debugLog(`[Tasks] Failed to read task ${taskId}: ${formatError(error)}`);
        reportError(error);
        return null;
    }
}

// Mapping: DB→loadTask, A→taskListId, q→taskId, yF6→getTaskFilePath,
//          H84→readFile, i1→JSON.parse, zN9→TaskSchema, k→debugLog, _1→formatError, _6→reportError
```

---

## 5. updateTask (WI) - Update with Validation

### What it does

Updates an existing task with new data, preserving the ID field.

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
        id: taskId  // Ensure ID is not overwritten
    };

    // Write updated task
    const taskPath = getTaskFilePath(taskListId, taskId);
    await writeFile(taskPath, JSON.stringify(updatedTask, null, 2));

    // Invalidate cache
    invalidateTaskCache();

    return updatedTask;
}

// Mapping: WI→updateTask, A→taskListId, q→taskId, K→updates,
//          DB→loadTask, yF6→getTaskFilePath, iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache
```

---

## 6. deleteTask (sD1) - Delete with Cleanup

### What it does

Deletes a task and removes all dependency references from other tasks.

### How it works

1. Update high watermark if this task has the highest ID
2. Delete the task file
3. Scan all other tasks and remove this task from their dependency arrays

```javascript
// ============================================
// deleteTask - Delete task with dependency cleanup
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
    const taskPath = getTaskFilePath(taskListId, taskId);

    try {
        // Update high watermark if this is the highest ID
        const taskIdNum = parseInt(taskId, 10);
        if (!isNaN(taskIdNum)) {
            const currentWatermark = await readHighWaterMarkFile(taskListId);
            if (taskIdNum > currentWatermark) {
                await writeHighWaterMark(taskListId, taskIdNum);
            }
        }

        // Delete the task file
        try {
            await deleteFile(taskPath);
        } catch (error) {
            if (error.code === "ENOENT") {
                return false;  // Task didn't exist
            }
            throw error;
        }

        // Clean up dependency references in other tasks
        const allTasks = await loadAllTasks(taskListId);
        for (const task of allTasks) {
            // Remove this task from blocks/blockedBy arrays
            const newBlocks = task.blocks.filter(id => id !== taskId);
            const newBlockedBy = task.blockedBy.filter(id => id !== taskId);

            // If arrays changed, update the task
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

// Mapping: sD1→deleteTask, A→taskListId, q→taskId, yF6→getTaskFilePath,
//          zT8→readHighWaterMarkFile, P84→writeHighWaterMark, j84→deleteFile,
//          DX→loadAllTasks, WI→updateTask, Gt→invalidateTaskCache
```

---

## 7. claimTask (OT8) - Atomic Claim with Validation

### What it does

Atomically claims a task with dependency validation. Used in multi-agent scenarios.

### How it works

1. Quick check if task exists
2. Optionally delegate to agent-busy validation
3. Acquire lock on task file
4. Re-verify task after lock (could have changed)
5. Check already claimed by different owner
6. Check already completed
7. Check dependencies are completed
8. Set owner and return success

### Validation Results

| Reason | Description |
|--------|-------------|
| `task_not_found` | Task doesn't exist |
| `already_claimed` | Task has a different owner |
| `already_resolved` | Task is completed |
| `blocked` | Dependencies not completed |
| `agent_busy` | Agent has other in-progress tasks |

```javascript
// ============================================
// claimTask - Atomic task claiming with validation
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

        return {
            success: !0,
            task: await WI(A, q, {
                owner: K
            })
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

    const taskPath = getTaskFilePath(taskListId, taskId);
    let releaseLock;

    try {
        // Acquire lock on task file
        releaseLock = await lockfile.lock(taskPath, LOCK_OPTIONS);

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
        debugLog(`[Tasks] Failed to claim task ${taskId}: ${formatError(error)}`);
        reportError(error);
        return { success: false, reason: "task_not_found" };

    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: OT8→claimTask, A→taskListId, q→taskId, K→owner, Y→options,
//          DB→loadTask, $N9→claimTaskWithAgentBusyValidation, yF6→getTaskFilePath,
//          EF6→lockfile, nD1→LOCK_OPTIONS, DX→loadAllTasks, WI→updateTask,
//          k→debugLog, _1→formatError, _6→reportError
```

---

## 8. claimTaskWithAgentBusyValidation ($N9)

### What it does

Claims a task while checking if the agent already has other in-progress tasks.

```javascript
// ============================================
// claimTaskWithAgentBusyValidation - Claim with agent busy check
// Location: chunks.84.mjs:1831-1881
// ============================================

// ORIGINAL (for source lookup):
async function $N9(A, q, K) {
    let Y = await wT8(A),
        z;
    try {
        z = await EF6.lock(Y, nD1);
        let _ = await DX(A),
            w = _.find((J) => J.id === q);
        if (!w) return {
            success: !1,
            reason: "task_not_found"
        };
        if (w.owner && w.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: w
        };
        if (w.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: w
        };
        let O = new Set(_.filter((J) => J.status !== "completed").map((J) => J.id)),
            $ = w.blockedBy.filter((J) => O.has(J));
        if ($.length > 0) return {
            success: !1,
            reason: "blocked",
            task: w,
            blockedByTasks: $
        };
        let H = _.filter((J) => J.status !== "completed" && J.owner === K && J.id !== q);
        if (H.length > 0) return {
            success: !1,
            reason: "agent_busy",
            task: w,
            busyWithTasks: H.map((J) => J.id)
        };
        return {
            success: !0,
            task: await WI(A, q, {
                owner: K
            })
        }
    } catch (_) {
        return k(`[Tasks] Failed to claim task ${q} with busy check: ${_1(_)}`), _6(_), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (z) await z()
    }
}

// READABLE (for understanding):
async function claimTaskWithAgentBusyValidation(taskListId, taskId, owner) {
    const lockPath = await ensureTaskDirectoryAndGetLock(taskListId);
    let releaseLock;

    try {
        releaseLock = await lockfile.lock(lockPath, LOCK_OPTIONS);

        // Load all tasks
        const allTasks = await loadAllTasks(taskListId);
        const task = allTasks.find(t => t.id === taskId);

        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // Check already claimed
        if (task.owner && task.owner !== owner) {
            return { success: false, reason: "already_claimed", task };
        }

        // Check already completed
        if (task.status === "completed") {
            return { success: false, reason: "already_resolved", task };
        }

        // Check dependencies
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

        // Check agent busy (has other in-progress tasks)
        const busyWithOtherTasks = allTasks.filter(t =>
            t.status !== "completed" &&
            t.owner === owner &&
            t.id !== taskId
        );

        if (busyWithOtherTasks.length > 0) {
            return {
                success: false,
                reason: "agent_busy",
                task,
                busyWithTasks: busyWithOtherTasks.map(t => t.id)
            };
        }

        // Claim the task
        return {
            success: true,
            task: await updateTask(taskListId, taskId, { owner })
        };

    } catch (error) {
        debugLog(`[Tasks] Failed to claim task ${taskId} with busy check: ${formatError(error)}`);
        reportError(error);
        return { success: false, reason: "task_not_found" };

    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: $N9→claimTaskWithAgentBusyValidation, A→taskListId, q→taskId, K→owner,
//          wT8→ensureTaskDirectoryAndGetLock, EF6→lockfile, nD1→LOCK_OPTIONS,
//          DX→loadAllTasks, WI→updateTask, k→debugLog, _1→formatError, _6→reportError
```

---

## 9. unassignTeammateTasks (ft)

### What it does

Unassigns all tasks from a teammate when they shut down or are terminated.

```javascript
// ============================================
// unassignTeammateTasks - Cleanup tasks on agent shutdown
// Location: chunks.84.mjs:1883-1902
// ============================================

// ORIGINAL (for source lookup):
async function ft(A, q, K, Y) {
    let _ = (await DX(A)).filter(($) => $.status !== "completed" && ($.owner === q || $.owner === K));
    for (let $ of _) await WI(A, $.id, {
        owner: void 0,
        status: "pending"
    });
    if (_.length > 0) k(`[Tasks] Unassigned ${_.length} task(s) from ${K}`);
    let O = `${K} ${Y==="terminated"?"was terminated":"has shut down"}.`;
    if (_.length > 0) {
        let $ = _.map((H) => `#${H.id} "${H.subject}"`).join(", ");
        O += ` ${_.length} task(s) were unassigned: ${$}. Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`
    }
    return {
        unassignedTasks: _.map(($) => ({
            id: $.id,
            subject: $.subject
        })),
        notificationMessage: O
    }
}

// READABLE (for understanding):
async function unassignTeammateTasks(taskListId, agentId, agentName, reason) {
    // Find all non-completed tasks owned by this agent
    const tasksToUnassign = (await loadAllTasks(taskListId))
        .filter(task =>
            task.status !== "completed" &&
            (task.owner === agentId || task.owner === agentName)
        );

    // Unassign each task
    for (const task of tasksToUnassign) {
        await updateTask(taskListId, task.id, {
            owner: undefined,
            status: "pending"
        });
    }

    if (tasksToUnassign.length > 0) {
        debugLog(`[Tasks] Unassigned ${tasksToUnassign.length} task(s) from ${agentName}`);
    }

    // Build notification message
    let message = `${agentName} ${reason === "terminated" ? "was terminated" : "has shut down"}.`;

    if (tasksToUnassign.length > 0) {
        const taskList = tasksToUnassign
            .map(t => `#${t.id} "${t.subject}"`)
            .join(", ");
        message += ` ${tasksToUnassign.length} task(s) were unassigned: ${taskList}. ` +
            `Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`;
    }

    return {
        unassignedTasks: tasksToUnassign.map(t => ({
            id: t.id,
            subject: t.subject
        })),
        notificationMessage: message
    };
}

// Mapping: ft→unassignTeammateTasks, A→taskListId, q→agentId, K→agentName, Y→reason,
//          DX→loadAllTasks, WI→updateTask, k→debugLog
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

## System Reminder Integration

### Attachment Types

| Attachment Type | Trigger | Description |
|-----------------|---------|-------------|
| `task_status` | Task create/update/delete | Task state changes |
| `task_claimed` | Task claim | Assignment notification |
| `task_completed` | Task completion | For dependency notifications |

### Integration with Tools (05)

- `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate` tools
- `TodoWrite` tool for simple todo mode (when `isTaskSystemEnabled()` returns false)
- Task operations use file locking for concurrency

### Integration with Hooks (11)

- `TaskCompleted` hooks run before marking complete
- Hook can prevent completion with validation
- `executeTaskCompletedHooks` (Hi6) is an async generator

---

## Symbol Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| jf | getTaskManager | chunks.84.mjs:1619 | ✅ Grep verified |
| aD1 | createTask | chunks.84.mjs:1669 | ✅ Grep verified |
| DB | loadTask | chunks.84.mjs:1687 | ✅ Grep verified |
| WI | updateTask | chunks.84.mjs:1701 | ✅ Grep verified |
| sD1 | deleteTask | chunks.84.mjs:1713 | ✅ Grep verified |
| DX | loadAllTasks | chunks.84.mjs:1742 | ✅ Grep verified |
| OT8 | claimTask | chunks.84.mjs:1781 | ✅ Grep verified |
| $N9 | claimTaskWithAgentBusyValidation | chunks.84.mjs:1831 | ✅ Grep verified |
| wN9 | getHighWaterMark | chunks.84.mjs:1664 | ✅ Grep verified |
| zT8 | readHighWaterMarkFile | chunks.84.mjs:1569 | ✅ Grep verified |
| P84 | writeHighWaterMark | chunks.84.mjs:1580 | ✅ Grep verified |
| W84 | getMaxTaskIdFromFiles | chunks.84.mjs:1647 | ✅ Grep verified |
| wR | getTaskDirectory | chunks.84.mjs:1630 | ✅ Grep verified |
| yF6 | getTaskFilePath | chunks.84.mjs:1634 | ✅ Grep verified |
| ft | unassignTeammateTasks | chunks.84.mjs:1883 | ✅ Grep verified |
| r$ | isTaskSystemEnabled | chunks.84.mjs:1585 | ✅ Grep verified |
| _N9 | HIGHWATERMARK_FILENAME | chunks.84.mjs:1914 | ✅ Grep verified |
| nD1 | lockOptions | chunks.84.mjs:1942 | ✅ Grep verified |