# Task System Module - Complete Source Restoration Final (Claude Code 2.1.76)

> **Complete source-level restoration** of the Task System with cross-validated symbols and detailed algorithm analysis.
> **Final Version** - All symbols validated, complete task lifecycle with dependency management.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Task System section)

Key functions documented here:
- `getTaskManager` (jf) - Resolve task list ID - chunks.84.mjs:1619
- `createTask` (aD1) - Create with auto-increment - chunks.84.mjs:1669
- `loadTask` (DB) - Load and validate - chunks.84.mjs:1687
- `updateTask` (WI) - Update with persistence - chunks.84.mjs:1701
- `deleteTask` (sD1) - Delete with cleanup - chunks.84.mjs:1713
- `loadAllTasks` (DX) - Load all tasks - chunks.84.mjs:1742
- `claimTask` (OT8) - Atomic claim with validation - chunks.84.mjs:1781
- `getHighWaterMark` (wN9) - Auto-increment ID - chunks.84.mjs:1664

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TASK SYSTEM ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                    Agent Interface                         │       │
│  │  TaskCreate │ TaskUpdate │ TaskGet │ TaskList             │       │
│  └────────────────────────┬─────────────────────────────────┘       │
│                           │                                          │
│  ┌────────────────────────▼─────────────────────────────────┐       │
│  │                 Core Functions (Async)                     │       │
│  │  getTaskManager │ createTask │ loadTask                    │       │
│  │  updateTask │ deleteTask │ loadAllTasks                    │       │
│  │  claimTask │ addTaskDependency                             │       │
│  └────────────────────────┬─────────────────────────────────┘       │
│                           │                                          │
│  ┌────────────────────────▼─────────────────────────────────┐       │
│  │              Storage Layer (~/.claude/tasks/)              │       │
│  │  ├── {team-name}/           # Team-isolated tasks          │       │
│  │  │   ├── 1.json            # Task file                    │       │
│  │  │   ├── 2.json                                            │       │
│  │  │   ├── .highwatermark    # Max ID tracking               │       │
│  │  │   └── .lock             # Concurrency control           │       │
│  │  └── {agent-id}/           # Solo agent tasks              │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                 Integration Points                         │       │
│  │  • TaskCompleted Hooks (Hi6) - Pre-completion validation  │       │
│  │  • Team Messaging - Assignment notifications               │       │
│  │  • UI State - expandedView: "tasks"                        │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. getTaskManager (jf) - Resolve Task List ID

### What it does

Resolves the task list ID from the current context. Uses:
1. Environment variable override (`CLAUDE_CODE_TASK_LIST_ID`)
2. Teammate context (team name)
3. Session ID or fallback to random ID

### How it works

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
    // 1. Environment variable override
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) {
        return process.env.CLAUDE_CODE_TASK_LIST_ID;
    }

    // 2. Teammate context (team mode)
    const teammateContext = getTeammateContext();
    if (teammateContext) {
        return teammateContext.teamName;
    }

    // 3. Session ID or fallback
    return getSessionId() || cachedSessionId || generateRandomId();
}

// Mapping: jf→getTaskManager, iM→getTeammateContext, l5→getSessionId,
//          VF6→cachedSessionId, R1→generateRandomId
```

---

## 2. createTask (aD1) - Create Task with Auto-Increment

### What it does

Creates a new task with auto-incremented ID. Uses file locking for atomic operation.

### How it works

1. Acquire lock on task directory
2. Get current high watermark (max ID)
3. Generate new ID = high watermark + 1
4. Write task file
5. Invalidate cache
6. Release lock

### Why this approach

- **File locking** prevents race conditions in parallel task creation
- **High watermark** enables auto-increment without scanning all files
- **Cache invalidation** ensures consistency across reads

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
    // Acquire lock on task directory
    const lockPath = await getLockPath(taskListId);
    let releaseLock;

    try {
        // Acquire file lock with retry options
        releaseLock = await lockfile.lock(lockPath, lockOptions);

        // Get current high watermark (max existing ID)
        const currentMaxId = await getHighWaterMark(taskListId);

        // Generate new ID
        const newId = String(currentMaxId + 1);

        // Create task object
        const task = {
            id: newId,
            ...taskData
        };

        // Write task file
        const taskPath = getTaskFilePath(taskListId, newId);
        await writeFile(taskPath, JSON.stringify(task, null, 2));

        // Invalidate cache
        invalidateTaskCache();

        return newId;
    } finally {
        // Always release lock
        if (releaseLock) {
            await releaseLock();
        }
    }
}

// Mapping: aD1→createTask, A→taskListId, q→taskData, wT8→getLockPath,
//          EF6→lockfile, nD1→lockOptions, wN9→getHighWaterMark,
//          yF6→getTaskFilePath, iD1→writeFile, B6→JSON.stringify,
//          Gt→invalidateTaskCache
```

---

## 3. getHighWaterMark (wN9) - Auto-Increment Logic

### What it does

Returns the maximum task ID from both file system scan and persisted high watermark file.

### How it works

1. Scan task directory for existing .json files
2. Read persisted .highwatermark file
3. Return maximum of both

### Why this approach

- **Dual source** handles cases where files were manually deleted or high watermark file is stale
- **Atomic guarantee** when combined with file locking

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
    // Get max from both sources in parallel
    const [maxFromFileScan, maxFromHighWatermarkFile] = await Promise.all([
        getMaxTaskIdFromFiles(taskListId),
        readHighWaterMarkFile(taskListId)
    ]);

    // Return the maximum
    return Math.max(maxFromFileScan, maxFromHighWatermarkFile);
}

// Mapping: wN9→getHighWaterMark, W84→getMaxTaskIdFromFiles,
//          zT8→readHighWaterMarkFile

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
        return 0;  // Directory doesn't exist
    }

    let maxId = 0;
    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const id = parseInt(file.replace(".json", ""), 10);
        if (!isNaN(id) && id > maxId) {
            maxId = id;
        }
    }

    return maxId;
}

// Mapping: W84→getMaxTaskIdFromFiles, wR→getTaskDirectory, YT8→readdir
```

---

## 4. claimTask (OT8) - Atomic Task Claiming

### What it does

Atomically claims a task for an agent, with validation for:
- Task exists
- Not already claimed by another agent
- Not already completed
- Dependencies are satisfied

### How it works

1. Verify task exists
2. Optionally delegate to agent-busy validation
3. Acquire file lock
4. Re-verify task state (could have changed)
5. Check ownership conflict
6. Check completion status
7. Check dependencies
8. Update task with owner and in_progress status
9. Release lock

### Key insight

The **re-verification after lock acquisition** is critical for correctness. Without it, the task state could change between initial check and actual claim, leading to race conditions.

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
        // ... [continues with update]
    } finally {
        if (w) await w()
    }
}

// READABLE (for understanding):
async function claimTask(taskListId, taskId, owner, options = {}) {
    const taskPath = getTaskFilePath(taskListId, taskId);

    // Step 1: Verify task exists
    if (!await loadTask(taskListId, taskId)) {
        return { success: false, reason: "task_not_found" };
    }

    // Step 2: Delegate to agent-busy validation if requested
    if (options.checkAgentBusy) {
        return claimTaskWithAgentBusyValidation(taskListId, taskId, owner);
    }

    let releaseLock;
    try {
        // Step 3: Acquire lock on task file
        releaseLock = await lockfile.lock(taskPath, lockOptions);

        // Step 4: Re-verify task after lock (could have changed)
        const task = await loadTask(taskListId, taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // Step 5: Check already claimed by different owner
        if (task.owner && task.owner !== owner) {
            return { success: false, reason: "already_claimed", task };
        }

        // Step 6: Check already completed
        if (task.status === "completed") {
            return { success: false, reason: "already_resolved", task };
        }

        // Step 7: Check dependencies are completed
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

        // Step 8: Set owner and status
        await updateTask(taskListId, taskId, {
            owner,
            status: "in_progress"
        });

        return { success: true, task: await loadTask(taskListId, taskId) };

    } finally {
        if (releaseLock) await releaseLock();
    }
}

// Mapping: OT8→claimTask, A→taskListId, q→taskId, K→owner, Y→options,
//          yF6→getTaskFilePath, DB→loadTask, $N9→claimTaskWithAgentBusyValidation,
//          EF6→lockfile, nD1→lockOptions, DX→loadAllTasks
```

---

## 5. Dependency Resolution Algorithm

### Dependency Graph Structure

Tasks use a DAG (Directed Acyclic Graph) structure:
- `blocks` - Tasks that are waiting for this task
- `blockedBy` - Tasks this task is waiting for

### Cycle Detection

When adding a dependency, the system must check for cycles:

```javascript
// Pseudocode for cycle detection
function wouldCreateCycle(taskId, dependsOnId, allTasks) {
    // BFS from dependsOnId to check if it reaches taskId
    const visited = new Set();
    const queue = [dependsOnId];

    while (queue.length > 0) {
        const current = queue.shift();

        if (current === taskId) {
            return true;  // Would create cycle
        }

        if (visited.has(current)) continue;
        visited.add(current);

        const task = allTasks.find(t => t.id === current);
        if (task) {
            queue.push(...task.blockedBy);
        }
    }

    return false;
}
```

### Task Availability Check

A task is available for work when:
1. Status is `pending`
2. All `blockedBy` tasks have status `completed`

---

## 6. Task Schema

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
    metadata?: Record<string, unknown>  // Arbitrary key-value pairs
}
```

---

## 7. Lock Configuration

```javascript
// Lock options for task operations
const lockOptions = {
    retries: 10,      // Number of retries
    minTimeout: 5,    // Minimum timeout in ms
    maxTimeout: 100   // Maximum timeout in ms
};
```

---

## 8. Cross-Module Integration

### Task System ↔ System Reminder (04)

Attachment types generated:
- `task_status` - Task state changes (create/update/delete)
- `task_claimed` - Task assignment notifications
- `task_completed` - Completion status for dependencies
- `task_progress` - Progress messages during execution

### Task System ↔ Tools (05)

- `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate` tools
- `TodoWrite` tool for simple todo mode (when `isTaskSystemEnabled()` returns false)
- Task operations use file locking for concurrency
- Permission checks via `canUseTool`

### Task System ↔ Hooks (11)

- `TaskCompleted` hooks run before marking complete
- Hook can prevent completion with validation
- `executeTaskCompletedHooks` (Hi6) is an async generator

### Task System ↔ Agent Teams (30)

- Team-isolated task storage (`~/.claude/tasks/{team-name}/`)
- `claimTask` with agent busy validation
- `unassignTeammateTasks` on agent shutdown
- Teammate context determines task list ID

---

## Symbol Validation Status

**Last validated:** 2026-03-27

All symbols in this module have been cross-validated against source code.

### Key Validated Symbols

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| jf | getTaskManager | chunks.84.mjs:1619 | ✅ Correct |
| aD1 | createTask | chunks.84.mjs:1669 | ✅ Correct |
| DB | loadTask | chunks.84.mjs:1687 | ✅ Correct |
| WI | updateTask | chunks.84.mjs:1701 | ✅ Correct |
| sD1 | deleteTask | chunks.84.mjs:1713 | ✅ Correct |
| DX | loadAllTasks | chunks.84.mjs:1742 | ✅ Correct |
| OT8 | claimTask | chunks.84.mjs:1781 | ✅ Correct |
| $N9 | claimTaskWithAgentBusyValidation | chunks.84.mjs:1831 | ✅ Correct |
| ft | unassignTeammateTasks | chunks.84.mjs:1883 | ✅ Correct |
| P84 | writeHighWaterMark | chunks.84.mjs:1580 | ✅ Correct |
| zT8 | readHighWaterMarkFile | chunks.84.mjs:1569 | ✅ Correct |
| W84 | getMaxTaskIdFromFiles | chunks.84.mjs:1647 | ✅ Correct |
| wN9 | getHighWaterMark | chunks.84.mjs:1664 | ✅ Correct |
| _N9 | HIGHWATERMARK_FILENAME | chunks.84.mjs:1914 | ✅ Correct |
| nD1 | lockOptions | chunks.84.mjs:1942 | ✅ Correct |
| Hi6 | executeTaskCompletedHooks | chunks.175.mjs:2594 | ✅ Correct |