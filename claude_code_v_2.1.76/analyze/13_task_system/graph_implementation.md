# Graph-Based Task System Analysis

## Module Overview

The Todo List from v2.1.7 has been replaced in v2.1.76 with a more robust **Graph-based Task System**. This system is designed for multi-agent coordination, supporting task ownership, complex dependency trees (`blocks`/`blockedBy`), and persistent metadata.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `createTask` (aD1) - Async function to create a new task with locking
- `updateTask` (WI) - Async function to update task status, owner, or dependencies
- `loadTask` (DB) - Async function to retrieve full task details
- `loadAllTasks` (DX) - Load all tasks for dependency resolution
- `addTaskDependency` (_T8) - Async logic for linking tasks

## Task Data Structure

Each task in the graph is an object with the following core properties:
- `id`: Unique identifier (stringified integer).
- `subject`: Concise title.
- `description`: Detailed requirements.
- `status`: One of `pending`, `in_progress`, `completed`, or `deleted`.
- `owner`: The ID of the agent currently working on the task.
- `blocks`: Array of task IDs that are waiting for this task.
- `blockedBy`: Array of task IDs that this task is waiting for.
- `metadata`: Key-value store for arbitrary data.

## Dependency Management (Algorithm)

**What it does:** Ensures that tasks are executed in the correct order by maintaining a Directed Acyclic Graph (DAG) of dependencies.

**How it works:**
1. When `TaskUpdate` is called with `addBlocks` or `addBlockedBy`, the system calls `_T8` (addTaskDependency).
2. `_T8(taskManager, taskA, taskB)` loads both tasks in parallel, then adds `taskB` to `taskA.blocks` AND `taskA` to `taskB.blockedBy`.
3. The system enforces strict ordering: an agent cannot mark a task as `in_progress` if its `blockedBy` array contains any non-completed tasks.

```javascript
// ============================================
// addTaskDependency - Async version with parallel loading
// Location: chunks.84.mjs:1754-1764
// ============================================

// ORIGINAL (for source lookup):
async function _T8(A, q, K) {
    let [Y, z] = await Promise.all([DB(A, q), DB(A, K)]);
    if (!Y || !z) return !1;
    if (!Y.blocks.includes(K)) await WI(A, q, {
        blocks: [...Y.blocks, K]
    });
    if (!z.blockedBy.includes(q)) await WI(A, K, {
        blockedBy: [...z.blockedBy, q]
    });
    return !0
}

// READABLE (for understanding):
async function addTaskDependency(taskManager, blockingTaskId, blockedTaskId) {
    // Load both tasks in parallel for efficiency
    const [blockingTask, blockedTask] = await Promise.all([
        loadTask(taskManager, blockingTaskId),
        loadTask(taskManager, blockedTaskId)
    ]);

    // Validate both tasks exist
    if (!blockingTask || !blockedTask) {
        return false;
    }

    // Add bidirectional link: blockingTask -> blockedTask
    if (!blockingTask.blocks.includes(blockedTaskId)) {
        await updateTask(taskManager, blockingTaskId, {
            blocks: [...blockingTask.blocks, blockedTaskId]
        });
    }

    // Add bidirectional link: blockedTask <- blockingTask
    if (!blockedTask.blockedBy.includes(blockingTaskId)) {
        await updateTask(taskManager, blockedTaskId, {
            blockedBy: [...blockedTask.blockedBy, blockingTaskId]
        });
    }

    return true;
}

// Mapping: _T8→addTaskDependency, A→taskManager, q→blockingTaskId, K→blockedTaskId,
//          DB→loadTask, WI→updateTask
```

## Task Completion Verification

Before a task can be marked as `completed`, the system may run verification hooks to ensure requirements were actually met.

```javascript
// ============================================
// verifyTaskCompletion - Blocking error check before completion
// Location: chunks.175.mjs:2594-2608 (Hi6 function)
// ============================================

// ORIGINAL (for source lookup):
if (z === "completed") {
    let M = [], P = Hi6(A, X.subject, X.description, g5(), iM(), ...);
    for await (let W of P) if (W.blockingError) M.push($i6(W.blockingError));
    if (M.length > 0) return { data: { success: !1, error: M.join("\n") } };
}

// READABLE (for understanding):
if (newStatus === "completed") {
    let errors = [];
    // Hi6 is an async generator that runs TaskCompleted hooks
    const hookStream = executeTaskCompletedHooks(taskId, subject, description, currentAgent, teamName, ...);

    for await (const result of hookStream) {
        if (result.blockingError) {
            errors.push(getTaskCompletedHookMessage(result.blockingError));
        }
    }

    if (errors.length > 0) {
        return {
            data: {
                success: false,
                taskId: taskId,
                error: "Verification failed:\n" + errors.join("\n")
            }
        };
    }
}

// Mapping: Hi6→executeTaskCompletedHooks, $i6→getTaskCompletedHookMessage,
//          z→newStatus, A→taskId, X→currentTask, g5→getCurrentAgentName, iM→getTeamContext
```

## Distributed Ownership

In a Swarm environment, the `owner` field is critical for avoiding redundant work:
- Agents use `TaskList` to find `pending` tasks with empty `blockedBy` and no `owner`.
- An agent "claims" a task by calling `TaskUpdate` and setting `owner` to their `agentId`.
- The system automatically notifies the owner of the assignment via a `task_assignment` message.

**Key insight:** The transition from linear Todo lists to Graph-based tasks allows Claude Code to handle non-linear workflows and parallel team execution safely.

---

## DAG Properties and Guarantees

### No Cycle Detection (Current Implementation)

**Warning**: The current implementation does NOT detect or prevent dependency cycles.

```
┌─────────────────────────────────────────────────────────────────┐
│              CYCLE SCENARIO (NOT PREVENTED)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Task #1 ──blocks──> Task #2                                   │
│       ▲                       │                                  │
│       │                       │                                  │
│       └──── blocks ───────────┘                                  │
│                                                                  │
│   Result: Both tasks permanently blocked!                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Mitigation**:
1. Manual inspection via `TaskGet`
2. Break cycle with `TaskUpdate({ addBlockedBy: [] })`
3. Delete one task in the cycle

### DAG Traversal Algorithm

When checking if a task can be claimed:

```javascript
// Pseudocode for blocker checking
function canClaimTask(taskId) {
    const task = loadTask(taskId);

    // Get all incomplete task IDs
    const allTasks = loadAllTasks();
    const incompleteIds = new Set(
        allTasks
            .filter(t => t.status !== "completed")
            .map(t => t.id)
    );

    // Check if any blocker is still incomplete
    const activeBlockers = task.blockedBy.filter(id => incompleteIds.has(id));

    return activeBlockers.length === 0;
}
```

**Time Complexity**: O(N) where N is total number of tasks.

---

## Dependency Propagation on Completion

When a task is marked as completed, its blocking relationships are NOT automatically removed:

```
Before Task #1 completion:
  Task #1: blocks: ["2", "3"], status: "in_progress"
  Task #2: blockedBy: ["1"], status: "pending"
  Task #3: blockedBy: ["1"], status: "pending"

After Task #1 completion:
  Task #1: blocks: ["2", "3"], status: "completed"  ← Still has blocks
  Task #2: blockedBy: ["1"], status: "pending"       ← Still has blockedBy
  Task #3: blockedBy: ["1"], status: "pending"

When Task #2 is checked for claim:
  - activeBlockers = [1].filter(id => task#1.status !== "completed")
  - activeBlockers = []  ← Empty because #1 is completed!
  - Task #2 can now be claimed
```

**Key insight**: The `blockedBy` arrays remain populated, but are filtered at claim time to exclude completed tasks.

---

## Dependency Cleanup on Deletion

When a task is deleted, ALL references to it are removed:

```javascript
// From deleteTask implementation
async function deleteTask(taskManager, taskId) {
    // Delete file
    await deleteFile(getTaskFilePath(taskManager, taskId));

    // Clean up ALL references
    const allTasks = await loadAllTasks(taskManager);
    for (const task of allTasks) {
        // Remove from blocks array
        const newBlocks = task.blocks.filter(id => id !== taskId);

        // Remove from blockedBy array
        const newBlockedBy = task.blockedBy.filter(id => id !== taskId);

        // Update if changed
        if (newBlocks.length !== task.blocks.length ||
            newBlockedBy.length !== task.blockedBy.length) {
            await updateTask(taskManager, task.id, {
                blocks: newBlocks,
                blockedBy: newBlockedBy
            });
        }
    }
}
```

**Complexity**: O(N) file reads + O(B) writes where B is number of tasks that referenced the deleted task.

---

## Related Documents

- **implementation.md** - Core async functions and file management
- **workflow.md** - State machine and transitions
- **team_integration.md** - Multi-agent coordination
- **tools_integration.md** - Hook and external integrations
