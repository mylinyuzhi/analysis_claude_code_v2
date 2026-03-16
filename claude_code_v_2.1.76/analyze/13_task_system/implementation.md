# Task System Implementation

## Overview

The Task System in Claude Code v2.1.76 is a robust replacement for the earlier `TodoList`. It is designed to support both single-agent and multi-agent workflows, introducing task ownership, dependencies (blocking/blockedBy), and persistent team-based storage.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Full symbol index

Key functions in this document:
- `getTaskManager` (jf) - Resolve task list context
- `createTask` (aD1) - Async task creation with locking
- `loadTask` (DB) - Async task loading from disk
- `updateTask` (WI) - Async task update with persistence
- `deleteTask` (sD1) - Async deletion with dependency cleanup
- `loadAllTasks` (DX) - Load all tasks for listing

## Key Tools

The system exposes four primary tools to the agent:

1. **TaskCreate** (tool name: `TR` = "TaskCreate"): Initializes a new task with a subject, description, and UI-friendly `activeForm`.
2. **TaskGet** (tool name: `lt` = "TaskGet"): Retrieves full task details, including dependency lists.
3. **TaskUpdate** (tool name: `ck` = "TaskUpdate"): The most versatile tool. Used to:
   - Change status (`pending` -> `in_progress` -> `completed`).
   - Assign/Change ownership (`owner`).
   - Manage dependencies (`addBlocks`, `addBlockedBy`).
   - Delete tasks (status: "deleted").
4. **TaskList** (tool name: `it` = "TaskList"): Provides a summary view of all tasks, including which are blocked and who owns them.

## Core Data Model

A task object consists of the following fields:

- `id`: Unique identifier (e.g., "1").
- `subject`: Brief title.
- `description`: Detailed instructions.
- `activeForm`: Present continuous status (e.g., "Analyzing codebase").
- `status`: `pending`, `in_progress`, `completed`, or `deleted`.
- `owner`: The name of the agent responsible for the task.
- `blocks`: Array of task IDs waiting for this task.
- `blockedBy`: Array of task IDs this task is waiting for.
- `metadata`: Arbitrary key-value pairs.

## Key Decisions & Algorithms

### [Decision] From Linear Todo to Dependency Graph

**Why this approach**:
In multi-agent swarms, tasks often run in parallel. A linear list cannot represent when a "tester" agent must wait for a "developer" agent. By using `blocks`/`blockedBy`, the lead agent can architect complex parallel workflows.

### [Algorithm] Task State Management

**How it works**:
1. When a task is updated via `TaskUpdate` tool, it calls async `updateTask` (`WI`) function.
2. It validates the state transition. For example, marking a task `completed` triggers hook execution.
3. If the task has an owner and the caller is the lead, a "task_assignment" message is automatically sent to the owner's inbox.
4. Updates are persisted to disk at `~/.claude/tasks/{team-name}/`.

## Code Snippets

// ============================================
// getTaskManager - Resolve task list context from team/agent
// Location: chunks.84.mjs:1619-1626
// ============================================

// ORIGINAL (for source lookup):
function jf() {
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) return process.env.CLAUDE_CODE_TASK_LIST_ID;
    let A = iM();
    if (A) return A.teamName;
    return l5() || R1()
}

// READABLE (for understanding):
function getTaskManager() {
    // Priority 1: Explicit override via environment variable
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) {
        return process.env.CLAUDE_CODE_TASK_LIST_ID;
    }

    // Priority 2: Active team context (if in team mode)
    const teamContext = getTeamContext();
    if (teamContext) {
        return teamContext.teamName;
    }

    // Priority 3: Solo agent mode
    return getCurrentAgentId() || getSessionId();
}

// Mapping: jf→getTaskManager, iM→getTeamContext, l5→getCurrentAgentId, R1→getSessionId

// ============================================
// createTask - Atomically create task with auto-increment ID
// Location: chunks.84.mjs:1669-1684
// ============================================

// ORIGINAL (for source lookup):
async function aD1(A, q) {
    let K = await wT8(A), Y;
    try {
        Y = await EF6.lock(K, nD1);
        let z = await wN9(A), _ = String(z + 1), w = { id: _, ...q }, O = yF6(A, _);
        return await iD1(O, B6(w, null, 2)), Gt(), _
    } finally {
        if (Y) await Y()
    }
}

// READABLE (for understanding):
async function createTask(taskManager, taskData) {
    const lockFilePath = await getLockFilePath(taskManager);
    let unlock;

    try {
        // ACQUIRE LOCK (async)
        unlock = await fileLock.lock(lockFilePath, lockOptions);

        // Get current high water mark (max ID)
        const currentMaxId = await getHighWaterMark(taskManager);
        const newId = String(currentMaxId + 1);

        // Build task object
        const newTask = {
            id: newId,
            ...taskData
        };

        // Write to disk
        const taskFilePath = getTaskFilePath(taskManager, newId);
        await writeFile(taskFilePath, JSON.stringify(newTask, null, 2));

        // Invalidate cache
        invalidateTaskCache();

        return newId;
    } finally {
        // RELEASE LOCK (always)
        if (unlock) await unlock();
    }
}

// Mapping: aD1→createTask, A→taskManager, q→taskData, wT8→getLockFilePath,
//          EF6.lock→fileLock.lock, wN9→getHighWaterMark, yF6→getTaskFilePath,
//          iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache

// ============================================
// updateTask - Update task with validation and persistence
// Location: chunks.84.mjs:1701-1710
// ============================================

// ORIGINAL (for source lookup):
async function WI(A, q, K) {
    let Y = await DB(A, q);
    if (!Y) return null;
    let z = { ...Y, ...K, id: q }, _ = yF6(A, q);
    return await iD1(_, B6(z, null, 2)), Gt(), z
}

// READABLE (for understanding):
async function updateTask(taskManager, taskId, updates) {
    // Load current task
    const currentTask = await loadTask(taskManager, taskId);
    if (!currentTask) return null;

    // Merge updates (preserve id)
    const updatedTask = {
        ...currentTask,
        ...updates,
        id: taskId  // Ensure id is not overwritten
    };

    // Write to disk
    const taskFilePath = getTaskFilePath(taskManager, taskId);
    await writeFile(taskFilePath, JSON.stringify(updatedTask, null, 2));

    // Invalidate cache
    invalidateTaskCache();

    return updatedTask;
}

// Mapping: WI→updateTask, A→taskManager, q→taskId, K→updates, DB→loadTask,
//          yF6→getTaskFilePath, iD1→writeFile, B6→JSON.stringify, Gt→invalidateTaskCache

// ============================================
// deleteTask - Delete task and clean all dependency references
// Location: chunks.84.mjs:1713-1739
// ============================================

// ORIGINAL (for source lookup):
async function sD1(A, q) {
    let K = yF6(A, q);
    try {
        let Y = parseInt(q, 10);
        if (!isNaN(Y)) {
            await J67(K);
            let z = await DX(A);
            for (let w of z) {
                let O = w.blocks.filter(($) => $ !== q),
                    _ = w.blockedBy.filter(($) => $ !== q);
                if (O.length !== w.blocks.length || _.length !== w.blockedBy.length)
                    await WI(A, w.id, { blocks: O, blockedBy: _ })
            }
        }
        return !0
    } catch { return !1 }
}

// READABLE (for understanding):
async function deleteTask(taskManager, taskId) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    try {
        const taskIdInt = parseInt(taskId, 10);
        if (!isNaN(taskIdInt)) {
            // STEP 1: Delete the task file
            await deleteFile(taskFilePath);

            // STEP 2: Clean up ALL dependency references
            const allTasks = await loadAllTasks(taskManager);

            for (const task of allTasks) {
                // Remove deleted task from 'blocks' array
                const newBlocks = task.blocks.filter(id => id !== taskId);

                // Remove deleted task from 'blockedBy' array
                const newBlockedBy = task.blockedBy.filter(id => id !== taskId);

                // If either array changed, update the task
                if (newBlocks.length !== task.blocks.length ||
                    newBlockedBy.length !== task.blockedBy.length) {
                    await updateTask(taskManager, task.id, {
                        blocks: newBlocks,
                        blockedBy: newBlockedBy
                    });
                }
            }
        }
        return true;
    } catch (error) {
        return false;
    }
}

// Mapping: sD1→deleteTask, A→taskManager, q→taskId, yF6→getTaskFilePath,
//          J67→deleteFile, DX→loadAllTasks, WI→updateTask

## Location References

- `chunks.84.mjs:1619` - `getTaskManager` (jf) definition.
- `chunks.84.mjs:1669` - `createTask` (aD1) async function.
- `chunks.84.mjs:1687` - `loadTask` (DB) async function.
- `chunks.84.mjs:1701` - `updateTask` (WI) async function.
- `chunks.84.mjs:1713` - `deleteTask` (sD1) async function.
- `chunks.84.mjs:1742` - `loadAllTasks` (DX) async function.
- `chunks.90.mjs:2592` - Tool name constant TR = "TaskCreate".
- `chunks.90.mjs:2594` - Tool name constant ck = "TaskUpdate".
- `chunks.91.mjs:41` - Tool name constant lt = "TaskGet".
- `chunks.91.mjs:43` - Tool name constant it = "TaskList".