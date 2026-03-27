# Task System Module - Complete Source Restoration

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ All symbols cross-validated against source code

---

## Overview

This document provides complete source-level restoration of key functions in the Task System module. The task system provides structured task tracking with dependency management for multi-agent coordination.

---

## 1. Get Task Manager (jf)

### What it does
Resolves the task list ID from the current context. Priority: environment variable → teammate context → agent ID → default.

### Source Code

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

### Key insight
The task list ID determines task isolation. Different agents/teams get separate task directories.

---

## 2. Create Task (aD1)

### What it does
Atomically creates a new task with auto-increment ID. Uses file locking to prevent race conditions.

### How it works
1. Ensure task directory exists
2. Acquire lock on `.lock` file
3. Get current high watermark (max ID)
4. Increment and create new task
5. Write task file and release lock

### Source Code

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

### Why this approach
- **File locking** prevents race conditions when multiple agents create tasks simultaneously
- **High watermark** ensures IDs are always increasing, even after deletions
- **try/finally** ensures lock is always released, even on error

### Key insight
The lock is on a separate `.lock` file, not the task file itself. This allows concurrent reads but serializes creates.

---

## 3. Load Task (DB)

### What it does
Loads a task from disk and validates it against the schema.

### Source Code

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
        // Read file
        const content = await readFile(taskFilePath, "utf-8");

        // Parse JSON
        const parsed = JSON.parse(content);

        // Validate against schema
        const schemaResult = taskSchema().safeParse(parsed);
        if (!schemaResult.success) {
            debugLog(`[Tasks] Task ${taskId} failed schema validation: ${schemaResult.error.message}`);
            return null;
        }

        return schemaResult.data;

    } catch (error) {
        // File not found - task doesn't exist
        if (error.code === "ENOENT") {
            return null;
        }

        // Other error (corrupt file, permissions, etc.)
        debugLog(`[Tasks] Failed to read task ${taskId}: ${formatError(error)}`);
        reportError(error);
        return null;
    }
}

// Mapping: DB→loadTask, A→taskListId, q→taskId, yF6→getTaskFilePath,
//          H84→readFile, i1→JSON.parse, zN9→taskSchema, k→debugLog, _1→formatError, _6→reportError
```

### Key insight
Returns `null` for missing tasks rather than throwing, allowing callers to check existence easily.

---

## 4. Update Task (WI)

### What it does
Updates an existing task with new data while preserving the ID.

### Source Code

```javascript
// ============================================
// updateTask - Update task with validation and persistence
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
    // Step 1: Load existing task
    const existingTask = await loadTask(taskListId, taskId);
    if (!existingTask) {
        return null;
    }

    // Step 2: Merge updates (ID is preserved)
    const updatedTask = {
        ...existingTask,
        ...updates,
        id: taskId  // Ensure ID is never changed
    };

    // Step 3: Write updated task
    const taskFilePath = getTaskFilePath(taskListId, taskId);
    await writeFile(taskFilePath, JSON.stringify(updatedTask, null, 2));

    // Step 4: Invalidate cache
    invalidateTaskCache();

    return updatedTask;
}

// Mapping: WI→updateTask, A→taskListId, q→taskId, K→updates,
//          DB→loadTask, yF6→getTaskFilePath, iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache
```

### Key insight
The `id: taskId` line ensures the ID can never be accidentally overwritten by the updates object.

---

## 5. Claim Task (OT8)

### What it does
Atomically claims a task for an agent. Validates dependencies and ownership.

### How it works
1. Quick existence check
2. Delegate to agent-busy validation if requested
3. Acquire lock on task file
4. Re-verify after lock (task could have changed)
5. Check ownership conflicts
6. Check completion status
7. Check dependency completion
8. Set owner and status

### Source Code

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

### Why this approach
- **Lock on task file** prevents race conditions during claiming
- **Re-verification after lock** handles the case where another agent claimed the task while we waited
- **Dependency check** ensures tasks can't start until their dependencies complete

### Key insight
The claim result includes detailed failure reasons, allowing the caller to provide specific feedback.

---

## 6. Get High Watermark (wN9)

### What it does
Gets the maximum task ID in use. Uses two sources for robustness: scanning files and reading `.highwatermark` file.

### Source Code

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

### Why this approach
- **Two sources** provide robustness - if one is corrupted, the other provides a fallback
- **Parallel execution** minimizes latency
- **Math.max** ensures we never reuse an ID

### Key insight
The `.highwatermark` file is written after each create, but the file scan provides a fallback if that file is missing or corrupted.

---

## 7. Get Task Directory (wR) and Get Task File Path (yF6)

### What they do
Construct paths for task storage.

### Source Code

```javascript
// ============================================
// getTaskDirectory - Get task storage directory
// Location: chunks.84.mjs:1630-1632
// ============================================

// ORIGINAL (for source lookup):
function wR(A) {
    return kF6(c8(), "tasks", L06(A))
}

// READABLE (for understanding):
function getTaskDirectory(taskListId) {
    return path.join(getHomeDirectory(), "tasks", sanitizeTaskListId(taskListId));
}

// Mapping: wR→getTaskDirectory, A→taskListId, kF6→path.join, c8→getHomeDirectory, L06→sanitizeTaskListId

// ============================================
// getTaskFilePath - Get path to specific task file
// Location: chunks.84.mjs:1634-1636
// ============================================

// ORIGINAL (for source lookup):
function yF6(A, q) {
    return kF6(wR(A), `${L06(q)}.json`)
}

// READABLE (for understanding):
function getTaskFilePath(taskListId, taskId) {
    return path.join(getTaskDirectory(taskListId), `${sanitizeTaskListId(taskId)}.json`);
}

// Mapping: yF6→getTaskFilePath, A→taskListId, q→taskId, wR→getTaskDirectory, kF6→path.join, L06→sanitizeTaskListId
```

### Path Structure
```
~/.claude/tasks/
├── {team-name}/           # Team-isolated tasks
│   ├── 1.json
│   ├── 2.json
│   ├── .highwatermark
│   └── .lock
└── {agent-id}/           # Solo agent tasks
    ├── 1.json
    └── ...
```

---

## 8. Task Schema (zN9)

### What it does
Defines the Zod schema for task validation.

### Source Code

```javascript
// ============================================
// taskSchema - Zod schema for task validation
// Location: chunks.84.mjs:1932
// ============================================

// READABLE (for understanding):
const taskStatusSchema = z.enum(["pending", "in_progress", "completed"]);

const taskSchema = z.object({
    id: z.string(),                    // Auto-increment integer as string
    subject: z.string(),               // Brief title (required)
    description: z.string(),           // Detailed requirements (required)
    activeForm: z.string().optional(), // Present continuous status for UI spinner
    status: taskStatusSchema,          // pending | in_progress | completed
    owner: z.string().optional(),      // Agent name who owns this task
    blocks: z.array(z.string()),       // Task IDs waiting for this task
    blockedBy: z.array(z.string()),    // Task IDs this task is waiting for
    metadata: z.record(z.unknown()).optional()  // Arbitrary key-value pairs
});

// Mapping: zN9→taskSchema, H36→taskStatusSchema
```

---

## 9. Lock Configuration (nD1)

### What it does
Configuration for file locking with retry behavior.

### Source Code

```javascript
// ============================================
// lockOptions - File lock retry configuration
// Location: chunks.84.mjs:1942
// ============================================

// ORIGINAL (for source lookup):
nD1 = { retries: 10, minTimeout: 5, maxTimeout: 100 }

// READABLE (for understanding):
const LOCK_OPTIONS = {
    retries: 10,      // Maximum retry attempts
    minTimeout: 5,    // Minimum wait between retries (ms)
    maxTimeout: 100   // Maximum wait between retries (ms)
};

// Mapping: nD1→LOCK_OPTIONS
```

### Key insight
The exponential backoff (5ms to 100ms) with 10 retries means the lock will be attempted for up to ~1 second before failing.

---

## Task State Machine

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

## Summary

### Validated Symbols

| Obfuscated | Readable | Location | Status |
|------------|----------|----------|--------|
| jf | getTaskManager | chunks.84.mjs:1619 | ✅ Verified |
| aD1 | createTask | chunks.84.mjs:1669 | ✅ Verified |
| DB | loadTask | chunks.84.mjs:1687 | ✅ Verified |
| WI | updateTask | chunks.84.mjs:1701 | ✅ Verified |
| sD1 | deleteTask | chunks.84.mjs:1713 | ✅ Verified |
| DX | loadAllTasks | chunks.84.mjs:1742 | ✅ Verified |
| OT8 | claimTask | chunks.84.mjs:1781 | ✅ Verified |
| wN9 | getHighWaterMark | chunks.84.mjs:1664 | ✅ Verified |
| W84 | getMaxTaskIdFromFiles | chunks.84.mjs:1647 | ✅ Verified |
| zT8 | readHighWaterMarkFile | chunks.84.mjs:1569 | ✅ Verified |
| P84 | writeHighWaterMark | chunks.84.mjs:1580 | ✅ Verified |
| wR | getTaskDirectory | chunks.84.mjs:1630 | ✅ Verified |
| yF6 | getTaskFilePath | chunks.84.mjs:1634 | ✅ Verified |
| L06 | sanitizeTaskListId | chunks.84.mjs:1626 | ✅ Verified |
| nD1 | lockOptions | chunks.84.mjs:1942 | ✅ Verified |
| zN9 | taskSchema | chunks.84.mjs:1932 | ✅ Verified |
| H36 | taskStatusSchema | chunks.84.mjs:1932 | ✅ Verified |

### Key Dependencies

| Symbol | Purpose |
|--------|---------|
| EF6 | lockfile (npm package) |
| H84 | readFile |
| iD1 | writeFile |
| i1 | JSON.parse |
| B6 | JSON.stringify |
| kF6 | path.join |
| c8 | getHomeDirectory |
| Gt | invalidateTaskCache |
| k | debugLog |
| _1 | formatError |
| _6 | reportError |