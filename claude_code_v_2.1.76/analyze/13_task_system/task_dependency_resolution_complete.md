# Task Dependency Resolution Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of task creation, dependency management, high-watermark tracking, and blocking resolution.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions in this document:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `createTask` (aD1) - Atomic task creation - chunks.84.mjs:1669
- `loadTask` (DB) - Load and validate - chunks.84.mjs:1687
- `updateTask` (WI) - Update with persistence - chunks.84.mjs:1701
- `deleteTask` (sD1) - Delete with cleanup - chunks.84.mjs:1713
- `loadAllTasks` (DX) - Load all tasks - chunks.84.mjs:1742
- `addTaskDependency` (_T8) - Add dependency edge - chunks.84.mjs:1754
- `claimTask` (OT8) - Claim with validation - chunks.84.mjs:1781

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TASK SYSTEM ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │                    Tool Interface                          │      │
│  │  TaskCreate │ TaskUpdate │ TaskGet │ TaskList │ TodoWrite│      │
│  └────────────────────────┬─────────────────────────────────┘      │
│                           │                                          │
│  ┌────────────────────────▼─────────────────────────────────┐      │
│  │                 Core Functions (Async)                     │      │
│  │  jf=getTaskManager │ aD1=createTask │ DB=loadTask          │      │
│  │  WI=updateTask │ sD1=deleteTask │ DX=loadAllTasks          │      │
│  │  _T8=addTaskDependency │ OT8=claimTask                     │      │
│  └────────────────────────┬─────────────────────────────────┘      │
│                           │                                          │
│  ┌────────────────────────▼─────────────────────────────────┐      │
│  │              Storage Layer (~/.claude/tasks/)              │      │
│  │  ├── {team-name}/           # Team-isolated tasks          │      │
│  │  │   ├── 1.json            # Task file                    │      │
│  │  │   ├── 2.json                                            │      │
│  │  │   ├── .highwatermark    # Max ID tracking               │      │
│  │  │   └── .lock             # Concurrency control           │      │
│  │  └── {agent-id}/           # Solo agent tasks              │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                       │
│  Dependency Graph:                                                   │
│                                                                       │
│    Task 1 ──blocks──▶ Task 3                                        │
│       │                  ▲                                          │
│       └──blocks──▶ Task 2 ──blocks──▶ Task 4                       │
│                                                                       │
│    blocks: ["3"]      blockedBy: ["1", "2"]                         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. getTaskManager (jf) - Task List ID Resolution

**What it does:**
Resolves the task list ID from context, supporting three sources: environment variable, team context, or default session ID.

**How it works:**
1. Check `CLAUDE_CODE_TASK_LIST_ID` environment variable
2. If in team context, return team name
3. Otherwise, return session ID (current team or default)

```javascript
// ============================================
// getTaskManager - Resolve task list ID
// Location: chunks.84.mjs:1619-1624
// ============================================

// ORIGINAL (for source lookup):
function jf() {
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) return process.env.CLAUDE_CODE_TASK_LIST_ID;
    let A = iM();  // Get teammate context
    if (A) return A.teamName;
    return l5() || VF6 || R1()  // Team name or session ID
}

// READABLE (for understanding):
function getTaskManager() {
    // Priority 1: Environment variable override
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) {
        return process.env.CLAUDE_CODE_TASK_LIST_ID;
    }

    // Priority 2: Teammate context (running in swarm)
    const teammateContext = getTeammateContext();
    if (teammateContext) {
        return teammateContext.teamName;
    }

    // Priority 3: Session-based (default)
    return getTeamName() || getSessionTeamId() || getSessionId();
}

// Mapping: jf→getTaskManager, iM→getTeammateContext, l5→getTeamName, R1→getSessionId
```

**Key insight:**
The three-tier resolution enables flexible task isolation:
1. **Environment variable**: For testing or external tools
2. **Team context**: For swarm/agent teams
3. **Session ID**: For single-agent sessions

---

## 2. createTask (aD1) - Atomic Task Creation

**What it does:**
Creates a new task with auto-increment ID, using file locking to prevent race conditions.

**How it works:**
1. Acquire file lock on `.lock` file
2. Read high-watermark (max existing task ID)
3. Increment and create task with new ID
4. Write task file
5. Invalidate cache
6. Release lock

```javascript
// ============================================
// createTask - Atomic task creation with auto-increment ID
// Location: chunks.84.mjs:1669-1685
// ============================================

// ORIGINAL (for source lookup):
async function aD1(A, q) {
    let K = await wT8(A),  // Ensure directory + create lock file
        Y;
    try {
        Y = await EF6.lock(K, nD1);  // Acquire lock with retry config
        let z = await wN9(A),  // Get high-watermark
            _ = String(z + 1),  // Increment
            w = {
                id: _,
                ...q
            },
            O = yF6(A, _);  // Task file path
        return await iD1(O, B6(w, null, 2)), Gt(), _  // Write, invalidate cache, return ID
    } finally {
        if (Y) await Y()  // Release lock
    }
}

// READABLE (for understanding):
async function createTask(taskManager, taskData) {
    // Ensure task directory exists and get lock file path
    const lockPath = await ensureTaskDirectoryAndLock(taskManager);

    let releaseLock;
    try {
        // Acquire file lock with retry configuration
        releaseLock = await properLockfile.lock(lockPath, LOCK_OPTIONS);

        // Get the highest existing task ID
        const highWatermark = await getHighWaterMark(taskManager);

        // Generate new ID (increment)
        const newId = String(highWatermark + 1);

        // Build task object
        const task = {
            id: newId,
            ...taskData
        };

        // Write task file
        const taskFilePath = getTaskFilePath(taskManager, newId);
        await writeFile(taskFilePath, JSON.stringify(task, null, 2));

        // Invalidate cache
        invalidateTaskCache();

        return newId;

    } finally {
        // Always release lock
        if (releaseLock) await releaseLock();
    }
}

// Mapping: aD1→createTask, A→taskManager, q→taskData, wT8→ensureTaskDirectoryAndLock,
//          EF6.lock→properLockfile.lock, nD1→LOCK_OPTIONS, wN9→getHighWaterMark,
//          yF6→getTaskFilePath, iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache
```

**Key insight:**
The file locking pattern ensures atomic ID generation even with concurrent writers:
1. `properLockfile.lock` provides cross-process mutual exclusion
2. `LOCK_OPTIONS` = `{ retries: 10, minTimeout: 5, maxTimeout: 100 }`
3. Lock is released in `finally` block to prevent deadlocks

---

## 3. loadTask (DB) - Load and Validate

**What it does:**
Loads a task from disk and validates it against the Zod schema.

```javascript
// ============================================
// loadTask - Load and validate task
// Location: chunks.84.mjs:1687-1698
// ============================================

// ORIGINAL (for source lookup):
async function DB(A, q) {
    let K = yF6(A, q);  // Task file path
    try {
        let Y = await H84(K, "utf-8"),  // Read file
            z = i1(Y),  // Parse JSON
            _ = zN9().safeParse(z);  // Validate schema
        if (!_.success) return k(`[Tasks] Task ${q} failed schema validation: ${_.error.message}`), null;
        return _.data
    } catch (Y) {
        if (Y.code === "ENOENT") return null;  // File not found
        return k(`[Tasks] Failed to read task ${q}: ${_1(Y)}`), _6(Y), null
    }
}

// READABLE (for understanding):
async function loadTask(taskManager, taskId) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    try {
        // Read file content
        const fileContent = await readFile(taskFilePath, "utf-8");

        // Parse JSON
        const parsed = JSON.parse(fileContent);

        // Validate against Zod schema
        const validationResult = taskSchema().safeParse(parsed);

        if (!validationResult.success) {
            console.warn(`[Tasks] Task ${taskId} failed schema validation: ${validationResult.error.message}`);
            return null;
        }

        return validationResult.data;

    } catch (error) {
        // File not found - return null silently
        if (error.code === "ENOENT") {
            return null;
        }

        // Other errors - log and return null
        console.warn(`[Tasks] Failed to read task ${taskId}: ${formatError(error)}`);
        reportError(error);
        return null;
    }
}

// Mapping: DB→loadTask, A→taskManager, q→taskId, yF6→getTaskFilePath,
//          H84→readFile, i1→JSON.parse, zN9→taskSchema
```

---

## 4. updateTask (WI) - Update with Persistence

**What it does:**
Updates an existing task with new data, preserving the ID.

```javascript
// ============================================
// updateTask - Update task with new data
// Location: chunks.84.mjs:1701-1711
// ============================================

// ORIGINAL (for source lookup):
async function WI(A, q, K) {
    let Y = await DB(A, q);  // Load existing
    if (!Y) return null;
    let z = {
            ...Y,
            ...K,  // Merge updates
            id: q  // Preserve ID
        },
        _ = yF6(A, q);
    return await iD1(_, B6(z, null, 2)), Gt(), z  // Write, invalidate, return
}

// READABLE (for understanding):
async function updateTask(taskManager, taskId, updates) {
    // Load existing task
    const existingTask = await loadTask(taskManager, taskId);
    if (!existingTask) return null;

    // Merge updates (ID preserved)
    const updatedTask = {
        ...existingTask,
        ...updates,
        id: taskId  // Ensure ID is not overwritten
    };

    // Write to disk
    const taskFilePath = getTaskFilePath(taskManager, taskId);
    await writeFile(taskFilePath, JSON.stringify(updatedTask, null, 2));

    // Invalidate cache
    invalidateTaskCache();

    return updatedTask;
}

// Mapping: WI→updateTask, A→taskManager, q→taskId, K→updates
```

---

## 5. deleteTask (sD1) - Delete with Cleanup

**What it does:**
Deletes a task and removes it from all dependency arrays of other tasks.

**How it works:**
1. Update high-watermark if this was the highest ID
2. Delete the task file
3. Load all remaining tasks
4. Remove deleted ID from `blocks` and `blockedBy` arrays
5. Update affected tasks

```javascript
// ============================================
// deleteTask - Delete task and clean dependencies
// Location: chunks.84.mjs:1713-1740
// ============================================

// ORIGINAL (for source lookup):
async function sD1(A, q) {
    let K = yF6(A, q);  // Task file path
    try {
        // Update high-watermark if this was the highest
        let Y = parseInt(q, 10);
        if (!isNaN(Y)) {
            let _ = await zT8(A);  // Current high-watermark
            if (Y > _) await P84(A, Y)  // Update if needed
        }

        // Delete task file
        try {
            await j84(K)
        } catch (_) {
            if (_.code === "ENOENT") return !1;  // Already deleted
            throw _
        }

        // Clean up dependencies in remaining tasks
        let z = await DX(A);  // Load all tasks
        for (let _ of z) {
            // Remove deleted ID from blocks
            let w = _.blocks.filter(($) => $ !== q),
                // Remove deleted ID from blockedBy
                O = _.blockedBy.filter(($) => $ !== q);

            // If arrays changed, update task
            if (w.length !== _.blocks.length || O.length !== _.blockedBy.length) {
                await WI(A, _.id, {
                    blocks: w,
                    blockedBy: O
                })
            }
        }

        return Gt(), !0  // Invalidate cache, return success
    } catch {
        return !1
    }
}

// READABLE (for understanding):
async function deleteTask(taskManager, taskId) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    try {
        // Update high-watermark if this was the highest ID
        const taskIdNum = parseInt(taskId, 10);
        if (!isNaN(taskIdNum)) {
            const currentHighWatermark = await readHighWaterMarkFile(taskManager);
            if (taskIdNum > currentHighWatermark) {
                await writeHighWaterMark(taskManager, taskIdNum);
            }
        }

        // Delete the task file
        try {
            await unlink(taskFilePath);
        } catch (error) {
            if (error.code === "ENOENT") return false;  // Already deleted
            throw error;
        }

        // Clean up dependencies in all other tasks
        const allTasks = await loadAllTasks(taskManager);

        for (const task of allTasks) {
            // Remove deleted ID from blocks array
            const newBlocks = task.blocks.filter(id => id !== taskId);

            // Remove deleted ID from blockedBy array
            const newBlockedBy = task.blockedBy.filter(id => id !== taskId);

            // If arrays changed, update the task
            if (newBlocks.length !== task.blocks.length ||
                newBlockedBy.length !== task.blockedBy.length) {
                await updateTask(taskManager, task.id, {
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

// Mapping: sD1→deleteTask, j84→unlink, DX→loadAllTasks
```

**Key insight:**
The dependency cleanup ensures referential integrity:
- When task A is deleted, all tasks that A blocked have their `blockedBy` updated
- When task A is deleted, all tasks blocking A have their `blocks` updated
- This prevents orphaned references in the dependency graph

---

## 6. addTaskDependency (_T8) - Add Dependency Edge

**What it does:**
Creates a bidirectional dependency edge between two tasks (A blocks B).

```javascript
// ============================================
// addTaskDependency - Add dependency edge
// Location: chunks.84.mjs:1754-1764
// ============================================

// ORIGINAL (for source lookup):
async function _T8(A, q, K) {
    let [Y, z] = await Promise.all([DB(A, q), DB(A, K)]);  // Load both tasks
    if (!Y || !z) return !1;

    // Add K to q's blocks array (q blocks K)
    if (!Y.blocks.includes(K)) await WI(A, q, {
        blocks: [...Y.blocks, K]
    });

    // Add q to K's blockedBy array (K is blocked by q)
    if (!z.blockedBy.includes(q)) await WI(A, K, {
        blockedBy: [...z.blockedBy, q]
    });

    return !0
}

// READABLE (for understanding):
async function addTaskDependency(taskManager, blockingTaskId, blockedTaskId) {
    // Load both tasks in parallel
    const [blockingTask, blockedTask] = await Promise.all([
        loadTask(taskManager, blockingTaskId),
        loadTask(taskManager, blockedTaskId)
    ]);

    if (!blockingTask || !blockedTask) return false;

    // Add edge: blockingTask → blocks → blockedTask
    if (!blockingTask.blocks.includes(blockedTaskId)) {
        await updateTask(taskManager, blockingTaskId, {
            blocks: [...blockingTask.blocks, blockedTaskId]
        });
    }

    // Add reverse edge: blockedTask → blockedBy → blockingTask
    if (!blockedTask.blockedBy.includes(blockingTaskId)) {
        await updateTask(taskManager, blockedTaskId, {
            blockedBy: [...blockedTask.blockedBy, blockingTaskId]
        });
    }

    return true;
}

// Mapping: _T8→addTaskDependency, A→taskManager, q→blockingTaskId, K→blockedTaskId
```

**Key insight:**
Bidirectional edges enable efficient queries from both directions:
- `blocks`: "What tasks does this task block?" (forward traversal)
- `blockedBy`: "What tasks block this task?" (backward traversal)
- This enables O(1) lookup for both directions without graph traversal

---

## 7. claimTask (OT8) - Claim with Validation

**What it does:**
Claims a task for an agent, validating ownership, completion status, and dependencies.

**How it works:**
1. Acquire file lock
2. Load task and validate:
   - Task exists
   - Not already claimed by another agent
   - Not already completed
   - All blocking tasks are completed
3. Update owner and status

```javascript
// ============================================
// claimTask - Claim task with validation
// Location: chunks.84.mjs:1781-1818+
// ============================================

// ORIGINAL (for source lookup):
async function OT8(A, q, K, Y = {}) {
    let z = yF6(A, q);  // Task file path for locking
    if (!await DB(A, q)) return {
        success: !1,
        reason: "task_not_found"
    };

    if (Y.checkAgentBusy) return $N9(A, q, K);  // Delegate if checking busy

    let w;
    try {
        w = await EF6.lock(z, nD1);  // Acquire lock
        let O = await DB(A, q);
        if (!O) return {
            success: !1,
            reason: "task_not_found"
        };

        // Check ownership
        if (O.owner && O.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: O
        };

        // Check completion
        if (O.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: O
        };

        // Check dependencies
        let $ = await DX(A),  // Load all tasks
            H = new Set($.filter((M) => M.status !== "completed").map((M) => M.id)),  // Incomplete tasks
            j = O.blockedBy.filter((M) => H.has(M));  // Blocking incomplete tasks

        if (j.length > 0) return {
            success: !1,
            reason: "blocked",
            task: O,
            blockedByTasks: j
        };

        // Claim the task
        return {
            success: !0,
            task: await WI(A, q, {
                owner: K,
                // ... continue
            })
        };
    } finally {
        if (w) await w()
    }
}

// READABLE (for understanding):
async function claimTask(taskManager, taskId, agentId, options = {}) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    // Quick check if task exists
    if (!await loadTask(taskManager, taskId)) {
        return { success: false, reason: "task_not_found" };
    }

    // Delegate to busy-checking version if requested
    if (options.checkAgentBusy) {
        return claimTaskWithAgentBusyValidation(taskManager, taskId, agentId);
    }

    let releaseLock;
    try {
        // Acquire lock
        releaseLock = await properLockfile.lock(taskFilePath, LOCK_OPTIONS);

        // Reload task (may have changed)
        const task = await loadTask(taskManager, taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // Validation 1: Already claimed
        if (task.owner && task.owner !== agentId) {
            return {
                success: false,
                reason: "already_claimed",
                task
            };
        }

        // Validation 2: Already completed
        if (task.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task
            };
        }

        // Validation 3: Dependencies not complete
        const allTasks = await loadAllTasks(taskManager);
        const incompleteTaskIds = new Set(
            allTasks
                .filter(t => t.status !== "completed")
                .map(t => t.id)
        );
        const blockingIncomplete = task.blockedBy.filter(id => incompleteTaskIds.has(id));

        if (blockingIncomplete.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task,
                blockedByTasks: blockingIncomplete
            };
        }

        // All validations passed - claim the task
        const claimedTask = await updateTask(taskManager, taskId, {
            owner: agentId,
            status: "in_progress"
        });

        return { success: true, task: claimedTask };

    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: OT8→claimTask, $N9→claimTaskWithAgentBusyValidation
```

**Key insight:**
The claim validation prevents race conditions and ensures correct execution order:
1. **Lock acquisition**: Prevents concurrent claims
2. **Owner check**: Prevents stealing tasks from other agents
3. **Completion check**: Prevents working on finished tasks
4. **Dependency check**: Ensures tasks run in correct order

---

## 8. High-Watermark Algorithm

**What it does:**
Tracks the highest task ID ever assigned, enabling efficient auto-increment without scanning all files.

### Functions:

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| `getHighWaterMark` | `wN9` | Get max task ID (file scan or .highwatermark) |
| `readHighWaterMarkFile` | `zT8` | Read .highwatermark file |
| `writeHighWaterMark` | `P84` | Write .highwatermark file |
| `getMaxTaskIdFromFiles` | `W84` | Scan task files for max ID |

```javascript
// ============================================
// getHighWaterMark - Get maximum task ID
// Location: chunks.84.mjs:1664-1667
// ============================================

// ORIGINAL (for source lookup):
async function wN9(A) {
    let [q, K] = await Promise.all([
        W84(A),    // Scan files for max ID
        zT8(A)     // Read high-watermark file
    ]);
    return Math.max(q, K)
}

// READABLE (for understanding):
async function getHighWaterMark(taskManager) {
    // Get both sources in parallel
    const [maxFromFileScan, maxFromWatermarkFile] = await Promise.all([
        getMaxTaskIdFromFiles(taskManager),
        readHighWaterMarkFile(taskManager)
    ]);

    // Return the higher value
    return Math.max(maxFromFileScan, maxFromWatermarkFile);
}

// Mapping: wN9→getHighWaterMark, W84→getMaxTaskIdFromFiles, zT8→readHighWaterMarkFile
```

**Why this approach:**
- File scan is authoritative but slow (O(n))
- High-watermark file is fast but may be stale
- Taking max of both handles edge cases (manual file creation, file deletion)

---

## Task Schema

```javascript
const taskSchema = z.object({
    id: z.string(),                    // Auto-increment integer as string
    subject: z.string(),               // Brief title (required)
    description: z.string(),           // Detailed requirements (required)
    activeForm: z.string().optional(), // Present continuous status for UI spinner
    status: z.enum(["pending", "in_progress", "completed"]),
    owner: z.string().optional(),      // Agent name who owns this task
    blocks: z.array(z.string()),       // Task IDs waiting for this task
    blockedBy: z.array(z.string()),    // Task IDs this task is waiting for
    metadata: z.record(z.unknown()).optional()  // Arbitrary key-value pairs
});
```

---

## Cross-Module Integration

### Task System ↔ Tools (05)

Task tools are registered in the tool registry:
- `TaskCreate` (TR) - Create new task
- `TaskUpdate` (ck) - Update task
- `TaskGet` (lt) - Get single task
- `TaskList` (it) - List all tasks
- `TodoWrite` (MB) - Simple todo (when task system disabled)

### Task System ↔ Plan Mode (12)

After plan approval, the plan content is parsed and structured steps can be converted to tasks.

### Task System ↔ Hooks (11)

`TaskCompleted` hooks run before a task can be marked complete:
- `executeTaskCompletedHooks` (Hi6) - Run hooks
- `getTaskCompletedHookMessage` ($i6) - Build hook message

### Task System ↔ System Reminder (04)

Task status changes generate attachments for LLM context.

---

## Verification

1. **Validate createTask symbol**:
   ```bash
   grep -n "async function aD1" source/chunks.84.mjs
   # Expected: 1669:async function aD1(A, q) {
   ```

2. **Validate addTaskDependency symbol**:
   ```bash
   grep -n "async function _T8" source/chunks.84.mjs
   # Expected: 1754:async function _T8(A, q, K) {
   ```

3. **Validate claimTask symbol**:
   ```bash
   grep -n "async function OT8" source/chunks.84.mjs
   # Expected: 1781:async function OT8(A, q, K, Y = {}) {
   ```