# Graph-Based Task System Analysis

## Module Overview

The Todo List from v2.1.7 has been replaced in v2.1.76 with a more robust **Graph-based Task System**. This system is designed for multi-agent coordination, supporting task ownership, complex dependency trees (`blocks`/`blockedBy`), and persistent metadata.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `TaskCreate` (Nh) - Tool to create a new task
- `TaskUpdate` (DR) - Tool to update task status, owner, or dependencies
- `TaskGet` (NK1) - Tool to retrieve full task details
- `TaskList` (TK1) - Tool to list all tasks with status summary
- `addDependency` (r7A) - Internal logic for linking tasks

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
1. When `TaskUpdate` is called with `addBlocks` or `addBlockedBy`, the system calls `r7A`.
2. `r7A(state, taskA, taskB)` adds `taskB` to `taskA.blocks` AND `taskA` to `taskB.blockedBy`.
3. The system enforces strict ordering: an agent cannot mark a task as `in_progress` if its `blockedBy` array contains any non-completed tasks.

```javascript
// ============================================
// addDependency - Internal logic for linking tasks
// Location: chunks.141.mjs:172-179
// ============================================

// ORIGINAL (for source lookup):
function r7A(J, A, P) {
    let X = lg(J, A), D = lg(J, P);
    if (X && D) {
        if (!X.blocks.includes(P)) X.blocks.push(P);
        if (!D.blockedBy.includes(A)) D.blockedBy.push(A);
    }
}

// READABLE (for understanding):
function addDependency(taskManager, blockingTaskId, blockedTaskId) {
    const blockingTask = findTaskById(taskManager, blockingTaskId);
    const blockedTask = findTaskById(taskManager, blockedTaskId);
    
    if (blockingTask && blockedTask) {
        // Task A blocks Task B
        if (!blockingTask.blocks.includes(blockedTaskId)) {
            blockingTask.blocks.push(blockedTaskId);
        }
        // Task B is blocked by Task A
        if (!blockedTask.blockedBy.includes(blockingTaskId)) {
            blockedTask.blockedBy.push(blockingTaskId);
        }
    }
}

// Mapping: r7A→addDependency, J→taskManager, A→blockingTaskId, P→blockedTaskId, X→blockingTask, D→blockedTask
```

## Task Completion Verification

Before a task can be marked as `completed`, the system may run verification hooks to ensure requirements were actually met.

```javascript
// ============================================
// verifyTaskCompletion - Blocking error check before completion
// Location: chunks.141.mjs:136-147
// ============================================

// ORIGINAL (for source lookup):
if (z === "completed") {
    let M = [], P = Cg1(A, X.subject, X.description, g5(), i3(), ...);
    for await (let W of P) if (W.blockingError) M.push(yg1(W.blockingError));
    if (M.length > 0) return { data: { success: !1, error: M.join("\n") } };
}

// READABLE (for understanding):
if (newStatus === "completed") {
    let errors = [];
    // Cg1 is a generator that runs verification hooks (e.g., tests, lints)
    const verificationStream = verifyTask(taskId, subject, description, currentAgent, teamName, ...);
    
    for await (const result of verificationStream) {
        if (result.blockingError) {
            errors.push(formatError(result.blockingError));
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

// Mapping: Cg1→verifyTask, yg1→formatError, z→newStatus, A→taskId, X→currentTask
```

## Distributed Ownership

In a Swarm environment, the `owner` field is critical for avoiding redundant work:
- Agents use `TaskList` to find `pending` tasks with empty `blockedBy` and no `owner`.
- An agent "claims" a task by calling `TaskUpdate` and setting `owner` to their `agentId`.
- The system automatically notifies the owner of the assignment via a `task_assignment` message.

**Key insight:** The transition from linear Todo lists to Graph-based tasks allows Claude Code to handle non-linear workflows and parallel team execution safely.
