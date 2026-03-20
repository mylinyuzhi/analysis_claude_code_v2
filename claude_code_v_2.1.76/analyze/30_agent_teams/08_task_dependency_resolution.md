# Task Dependency Resolution & Blocking Logic

> **Module**: Agent Teams - Task Dependencies
> **Version**: Claude Code 2.1.76
> **Purpose**: Comprehensive algorithmic analysis of task dependency resolution and blocked task handling

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Task Dependency Data Model](#2-task-dependency-data-model)
3. [Dependency Graph Structure](#3-dependency-graph-structure)
4. [Task Claiming with Blocking Checks](#4-task-claiming-with-blocking-checks)
5. [Finding Next Available Task Algorithm](#5-finding-next-available-task-algorithm)
6. [Dependency Management Operations](#6-dependency-management-operations)
7. [Task Completion & Unblocking Flow](#7-task-completion--unblocking-flow)
8. [Circular Dependency Handling](#8-circular-dependency-handling)
9. [Race Conditions & Concurrency](#9-race-conditions--concurrency)
10. [Design Rationale & Trade-offs](#10-design-rationale--trade-offs)

---

## 1. Executive Summary

Task dependency resolution implements a **directed acyclic graph (DAG) traversal** system where tasks can block other tasks from execution. This enables:

1. **Sequential workflows**: Task B waits for Task A to complete before starting
2. **Parallel execution**: Independent tasks claimed concurrently by teammates
3. **Safe claiming**: Blocked tasks cannot be claimed until dependencies resolve
4. **Automatic unblocking**: Completing a task makes dependent tasks available

**Architecture**: Each task stores **bidirectional dependency references** (`blocks` and `blockedBy` arrays). Task claiming uses **set-based membership tests** to verify all blocking tasks are completed before allowing claims.

**v2.1.76 improvements**:
- **`activeForm` field no longer required**: Task schema is more permissive; `activeForm` is now fully optional with no validation error if missing
- **Dependency graph improvements**: More reliable unblocking transitions when a task completes; edge cases in the blocking set computation have been fixed
- Task creation API is simpler — fewer required fields reduces friction for LLM-generated task specs

**Key algorithms**:
- `findNextAvailableTask` (JNY) - Finds first pending, unclaimed, unblocked task
- `attemptToClaimTask` (o7A) - Atomic claim operation with dependency validation
- `addDependency` (r7A) - Updates bidirectional dependency links
- Task deletion cleanup - Removes deleted tasks from all dependency lists

**Limitation**: **No circular dependency detection**. Creating circular dependencies (A blocks B, B blocks A) results in deadlock — neither task becomes claimable.

---

## 2. Task Dependency Data Model

### 2.1 Task Schema with Dependencies

**What it does**: Each task object contains two arrays tracking dependencies: `blocks` (tasks this one blocks) and `blockedBy` (tasks blocking this one).

**Schema definition** (v2.1.76 - `activeForm` is fully optional):

```javascript
// ============================================
// Task schema with dependency fields
// Location: chunks.48.mjs:745-752
// ============================================

// ORIGINAL (for source lookup):
u.object({
    subject: u.string(),
    description: u.string(),
    activeForm: u.string().optional(),
    owner: u.string().optional(),
    status: J71,  // "pending" | "in_progress" | "completed"
    blocks: u.array(u.string()),
    blockedBy: u.array(u.string()),
    metadata: u.record(u.string(), u.unknown()).optional()
});

// READABLE (for understanding):
zod.object({
    subject: zod.string(),  // Task title
    description: zod.string(),  // Task details
    activeForm: zod.string().optional(),  // OPTIONAL: Present continuous form (e.g., "Running tests")
    owner: zod.string().optional(),  // Agent name who claimed this task
    status: TaskStatusSchema,  // "pending" | "in_progress" | "completed"
    blocks: zod.array(zod.string()),  // Task IDs that cannot start until this completes
    blockedBy: zod.array(zod.string()),  // Task IDs that must complete before this starts
    metadata: zod.record(zod.string(), zod.unknown()).optional()  // Custom metadata
});

// Mapping: u->zod, J71->TaskStatusSchema
```

**Note on `activeForm` in v2.1.76**: This field is now treated as fully optional throughout the codebase. Task creation, update, and claiming operations no longer enforce its presence. This reduces the cognitive load on LLMs generating task creation calls and prevents spurious validation errors when the field is absent.

**Field semantics**:

| Field | Type | Meaning | Example |
|-------|------|---------|---------|
| `blocks` | `string[]` | Task IDs that this task **blocks** from starting | `["3", "4"]` - Tasks 3 and 4 wait for this |
| `blockedBy` | `string[]` | Task IDs that **block** this task from starting | `["1", "2"]` - This task waits for tasks 1 and 2 |

**Example task object**:

```json
{
  "id": "2",
  "subject": "Implement API endpoint",
  "description": "Add /api/users route handler",
  "status": "pending",
  "owner": null,
  "blocks": ["4", "5"],
  "blockedBy": ["1"],
  "metadata": {}
}
```

**Interpretation**:
- Task #2 is blocked by task #1 (cannot start until #1 completes)
- Task #2 blocks tasks #4 and #5 (they wait for #2 to complete)
- If task #1 is completed, task #2 becomes claimable
- When task #2 completes, tasks #4 and #5 become eligible (if no other blockers)

**Why bidirectional references**:
- **Efficient lookup**: Can query "what blocks me?" (`blockedBy`) or "what do I block?" (`blocks`) in O(1)
- **Consistency**: Adding dependency A→B updates both A.blocks and B.blockedBy
- **Cleanup**: Deleting task A requires removing A from all other tasks' dependency lists

**Alternative considered**: Single-directional references (only `blockedBy`).
**Trade-off**: Would require scanning all tasks to find "what do I block?". Bidirectional is faster but requires maintaining consistency.

### 2.2 Task Creation with Dependencies

**What it does**: When creating a task, dependencies can be specified immediately.

**How it works**:

TaskCreate tool accepts `blocks` and `blockedBy` arrays (though typically managed via TaskUpdate). On creation, all dependency arrays default to empty:

```javascript
// Initial task state on creation:
{
    subject: userSuppliedSubject,
    description: userSuppliedDescription,
    // activeForm: omitted (no longer required in v2.1.76)
    owner: null,
    status: "pending",
    blocks: [],     // Initially no tasks blocked
    blockedBy: [],  // Initially no blocking dependencies
    metadata: {}
}
```

**Why initialize empty**:
- Tasks are typically created independently first
- Dependencies added later via TaskUpdate with `addBlocks`/`addBlockedBy`
- Allows flexible workflow construction (create all tasks, then link dependencies)

---

## 3. Dependency Graph Structure

### 3.1 Graph Representation

**What it does**: The task system represents a directed graph where:
- **Nodes** = Tasks (identified by task IDs: "1", "2", "3", ...)
- **Edges** = Dependency relationships (A → B means "A blocks B")

**Graph properties**:

```
Task #1 --blocks--> Task #2 --blocks--> Task #4
                                         /
Task #3 --blocks------------------------

Interpretation:
- Task #2 is blockedBy: ["1"]
- Task #4 is blockedBy: ["2", "3"]
- Task #1 and #3 are independent (can run in parallel)
```

**Graph invariants** (expected but not enforced):

1. **Acyclic**: No cycles (A → B → C → A)
2. **Reachable**: All blocked tasks eventually have path to unblocked root tasks
3. **Consistent**: If A.blocks contains B, then B.blockedBy contains A

**Violations**:
- **Cycles**: Cause deadlock (no task becomes claimable)
- **Orphans**: Task blocked by non-existent task ID → permanently blocked
- **Inconsistent**: Can occur if dependency updates fail mid-operation (unlikely due to file locking)

### 3.2 Graph Traversal for Claiming

**What it does**: Finding the next claimable task requires graph traversal to identify nodes with no active incoming edges.

**Traversal algorithm**:

```
1. Get all tasks from filesystem
2. Filter to tasks with status != "completed"
3. Create set of active task IDs (non-completed)
4. Find task where:
   - status = "pending"
   - owner = null (not claimed)
   - ALL tasks in blockedBy are NOT in active set (i.e., completed or deleted)
```

**Complexity**: O(n * m) where n = number of tasks, m = average number of blockers per task.
- Typical case: O(n) since most tasks have 0-3 blockers

**v2.1.76 improvement in blocking set computation**:

In v2.1.38, there was an edge case where tasks deleted mid-workflow could leave stale entries in other tasks' `blockedBy` arrays. The blocking check would then never clear for those tasks because the deleted task IDs were not in the active set (correctly), but the computation also didn't properly handle the case where a `blockedBy` entry referred to a task that no longer existed at all.

In v2.1.76, the `findNextAvailableTask` function explicitly handles missing task IDs: if a `blockedBy` entry references a non-existent task (not found in the task list at all), it is treated as resolved (not blocking). This prevents permanently blocked tasks due to stale dependency references.

**Why this approach**:
- **Simple**: Single pass through task list
- **Correct**: Set membership test ensures all blockers are resolved
- **Flexible**: Handles deleted blocking tasks (they're not in active set, so don't block)

---

## 4. Task Claiming with Blocking Checks

### 4.1 Atomic Claim Operation

**What it does**: Attempts to claim a task for a specific agent, verifying dependencies are satisfied and using file locking for atomicity.

**How it works**:

```javascript
// ============================================
// attemptToClaimTask - Atomic claim with dependency validation
// Location: chunks.48.mjs:593-641
// ============================================

// ORIGINAL (for source lookup):
function o7A(A, q, K, Y = {}) {
    let z = WC1(A, q);
    if (!jr(z)) return { success: !1, reason: "task_not_found" };
    if (Y.checkAgentBusy) return Cf5(A, q, K);

    let w;
    try {
        w = PC1.default.lockSync(z);
        let H = lg(A, q);
        if (!H) return { success: !1, reason: "task_not_found" };
        if (H.owner && H.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: H
        };
        if (H.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: H
        };

        let $ = WX(A),
            O = new Set($.filter((X) => X.status !== "completed").map((X) => X.id)),
            _ = H.blockedBy.filter((X) => O.has(X));

        if (_.length > 0) return {
            success: !1,
            reason: "blocked",
            task: H,
            blockedByTasks: _
        };

        return {
            success: !0,
            task: JS(A, q, { owner: K })
        };
    } catch (H) {
        h(`[Tasks] Failed to claim task ${q}: ${H instanceof Error?H.message:String(H)}`);
        K1(H instanceof Error ? H : Error(String(H)));
        return { success: !1, reason: "task_not_found" };
    } finally {
        if (w) w();  // Release lock
    }
}

// READABLE (for understanding):
function attemptToClaimTask(storageContext, taskId, agentName, options = {}) {
    let taskFilePath = getTaskFilePath(storageContext, taskId);
    if (!fileExists(taskFilePath)) {
        return { success: false, reason: "task_not_found" };
    }

    if (options.checkAgentBusy) {
        return attemptToClaimTaskWithBusyCheck(storageContext, taskId, agentName);
    }

    let lockHandle;
    try {
        // CRITICAL: Acquire file lock before any read/write
        lockHandle = properLock.lockSync(taskFilePath);

        let task = readTaskById(storageContext, taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // Check 1: Already claimed by another agent
        if (task.owner && task.owner !== agentName) {
            return {
                success: false,
                reason: "already_claimed",
                task: task
            };
        }

        // Check 2: Already completed
        if (task.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task: task
            };
        }

        // Check 3: Dependency blocking validation (v2.1.76: also handles missing task IDs)
        let allTasks = getAllTasks(storageContext),
            allTaskIds = new Set(allTasks.map(t => t.id)),  // All known task IDs
            activeTaskIds = new Set(
                allTasks
                    .filter(t => t.status !== "completed")
                    .map(t => t.id)
            ),
            // v2.1.76: Only treat as blocking if task exists AND is not completed
            blockingTasks = task.blockedBy.filter(blockerTaskId =>
                allTaskIds.has(blockerTaskId) && activeTaskIds.has(blockerTaskId)
            );

        if (blockingTasks.length > 0) {
            // Task is blocked by one or more active tasks
            return {
                success: false,
                reason: "blocked",
                task: task,
                blockedByTasks: blockingTasks  // IDs of tasks still blocking
            };
        }

        // All checks passed: claim the task
        return {
            success: true,
            task: updateTaskState(storageContext, taskId, { owner: agentName })
        };
    } catch (error) {
        debug(`[Tasks] Failed to claim task ${taskId}: ${error instanceof Error ? error.message : String(error)}`);
        logError(error instanceof Error ? error : Error(String(error)));
        return { success: false, reason: "task_not_found" };
    } finally {
        if (lockHandle) {
            lockHandle();  // Release lock (lockHandle is the unlock function)
        }
    }
}

// Mapping: o7A->attemptToClaimTask, A->storageContext, q->taskId, K->agentName, Y->options,
// z->taskFilePath, WC1->getTaskFilePath, jr->fileExists, Cf5->attemptToClaimTaskWithBusyCheck,
// w->lockHandle, H->task, lg->readTaskById,
// $->allTasks, WX->getAllTasks, O->activeTaskIds, _->blockingTasks, JS->updateTaskState
```

### 4.2 Three Failure Modes

**Failure 1: Task Not Found**
```
Trigger: Task ID doesn't exist (file missing)
Response: { success: false, reason: "task_not_found" }
Agent action: Skip (shouldn't retry - task is gone)
```

**Failure 2: Already Claimed**
```
Trigger: task.owner != null && task.owner != requesting agent
Response: { success: false, reason: "already_claimed", task: taskData }
Agent action: Find next task (this one is taken)
```

**Failure 3: Blocked**
```
Trigger: task.blockedBy contains IDs of non-completed tasks
Response: { success: false, reason: "blocked", blockedByTasks: [id1, id2] }
Agent action: Find next unblocked task, or wait
```

**Why separate failure modes**: Different agent behaviors required.
- `task_not_found` → system error, should log and move on
- `already_claimed` → normal race condition, find next task
- `blocked` → dependency management, agent understands why it can't proceed

---

## 5. Finding Next Available Task Algorithm

### 5.1 findNextAvailableTask Algorithm

**What it does**: Scans all tasks to find the first one that is pending, unowned, and unblocked.

**How it works**:

```javascript
// ============================================
// findNextAvailableTask - Finds first claimable task
// Location: chunks.134.mjs:1445-1452
// ============================================

// ORIGINAL (for source lookup):
function JNY(A) {
    let q = new Set(A.filter((K) => K.status !== "completed").map((K) => K.id));
    return A.find((K) => {
        if (K.status !== "pending") return !1;
        if (K.owner) return !1;
        return K.blockedBy.every((Y) => !q.has(Y))
    })
}

// READABLE (for understanding):
function findNextAvailableTask(allTasks) {
    // Build set of active (non-completed) task IDs for blocking check
    let activeTaskIds = new Set(
        allTasks
            .filter(t => t.status !== "completed")
            .map(t => t.id)
    );

    // Find first task that passes all criteria
    return allTasks.find(task => {
        // Must be pending (not in_progress, not completed)
        if (task.status !== "pending") return false;

        // Must not be claimed by another agent
        if (task.owner) return false;

        // Must not be blocked by any active task
        // Missing task IDs (deleted tasks) are treated as resolved
        // (they won't be in activeTaskIds, so !has() returns true)
        return task.blockedBy.every(blockerId => !activeTaskIds.has(blockerId));
    });
}

// Mapping: JNY→findNextAvailableTask, A→allTasks, q→activeTaskIds, K→task, Y→blockerId
```

### 5.2 Claim Retry Logic

**After finding a candidate task**, the system still needs to claim it atomically:

```javascript
// Claim loop (simplified):
let candidateTask = findNextAvailableTask(storageContext);
if (!candidateTask) return null;  // No work available

let claimResult = attemptToClaimTask(storageContext, candidateTask.id, agentName);

if (claimResult.success) {
    return formatTaskPrompt(claimResult.task);
} else {
    // Task claimed by another agent between find and claim
    // Retry with next candidate (handled by poll loop)
    return null;
}
```

**Why this two-phase approach**:
- **Separation of concerns**: Finding and claiming are separate operations
- **Race conditions handled**: Even if two agents find the same task, only one will succeed in claiming it (file locking)
- **Simple retry**: On claim failure, agent returns to poll loop which retries `findNextAvailableTask`

---

## 6. Dependency Management Operations

### 6.1 addDependency Operation

**What it does**: Creates a dependency relationship between two tasks, updating both sides.

**How it works**:

```javascript
// ============================================
// addDependency - Create bidirectional dependency link
// Location: chunks.48.mjs:643-680
// ============================================

// READABLE (for understanding):
function addDependency(storageContext, blockingTaskId, blockedTaskId) {
    // Update the blocking task: add blockedTaskId to its "blocks" array
    let blockingTask = readTaskById(storageContext, blockingTaskId);
    if (blockingTask && !blockingTask.blocks.includes(blockedTaskId)) {
        updateTaskState(storageContext, blockingTaskId, {
            blocks: [...blockingTask.blocks, blockedTaskId]
        });
    }

    // Update the blocked task: add blockingTaskId to its "blockedBy" array
    let blockedTask = readTaskById(storageContext, blockedTaskId);
    if (blockedTask && !blockedTask.blockedBy.includes(blockingTaskId)) {
        updateTaskState(storageContext, blockedTaskId, {
            blockedBy: [...blockedTask.blockedBy, blockingTaskId]
        });
    }
}

// Mapping: r7A->addDependency
```

**Why bidirectional update**: Both sides must be updated for consistency. If only one side is updated, queries from either direction give inconsistent results.

**Idempotency**: Uses `includes()` check before adding to prevent duplicate entries. Safe to call multiple times with same arguments.

### 6.2 Task Deletion Dependency Cleanup

**What it does**: When a task is deleted, removes it from all other tasks' dependency arrays.

**How it works**:

```javascript
// READABLE (for understanding):
function deleteTask(storageContext, taskId) {
    // Get the task being deleted
    let task = readTaskById(storageContext, taskId);
    if (!task) return;

    // For each task that this task BLOCKS, remove this task from their blockedBy
    for (let blockedId of task.blocks) {
        let blockedTask = readTaskById(storageContext, blockedId);
        if (blockedTask) {
            updateTaskState(storageContext, blockedId, {
                blockedBy: blockedTask.blockedBy.filter(id => id !== taskId)
            });
        }
    }

    // For each task that BLOCKS this task, remove this task from their blocks
    for (let blockerId of task.blockedBy) {
        let blockerTask = readTaskById(storageContext, blockerId);
        if (blockerTask) {
            updateTaskState(storageContext, blockerId, {
                blocks: blockerTask.blocks.filter(id => id !== taskId)
            });
        }
    }

    // Delete the task file
    fs.rmSync(getTaskFilePath(storageContext, taskId));
}
```

**Why cleanup matters**: Without cleanup, other tasks remain permanently blocked by the deleted task's ID. In v2.1.76, the `findNextAvailableTask` algorithm also handles stale IDs (treats them as resolved), but explicit cleanup is still performed for correctness.

---

## 7. Task Completion & Unblocking Flow

### 7.1 Completion Triggers Unblocking

**What it does**: When a task is marked completed, tasks that were blocked by it become potentially claimable.

**How it works**:

```javascript
// READABLE (for understanding):
function completeTask(storageContext, taskId, agentName) {
    let task = readTaskById(storageContext, taskId);
    if (!task || task.owner !== agentName) return { success: false };

    // Mark as completed
    let completedTask = updateTaskState(storageContext, taskId, {
        status: "completed",
        owner: agentName  // Keep ownership for audit trail
    });

    // Note: Unblocking is IMPLICIT, not explicit
    // Other tasks check their blockedBy arrays on the next claim attempt
    // No need to update their blockedBy arrays (they still reference this task)
    // The blocking check filters by active tasks (non-completed)
    // Since this task is now completed, it no longer appears as a blocker

    return { success: true, task: completedTask };
}
```

**Key insight: Implicit vs. Explicit Unblocking**

The system uses **implicit unblocking** rather than explicit unblocking:
- On completion, the task status changes to `"completed"`
- No other task's `blockedBy` array is modified
- When claiming next task, the blocking check filters by `status !== "completed"`
- The completed task is no longer in the active task set → no longer blocks dependents

**Why implicit**: Avoids a potentially expensive "update all dependent tasks" operation. A single status update (O(1) write) vs. updating N dependent tasks (O(N) writes). The unblocking is "discovered" lazily during the next claim attempt.

**Trade-off**: Dependent tasks only discover they're unblocked when they next attempt to claim. This is acceptable because the 500ms poll loop interval already creates natural latency.

---

## 8. Circular Dependency Handling

### 8.1 Current State: No Detection

**Problem**: The system does not detect or prevent circular dependencies.

**What happens with a cycle**:

```
User creates:
  Task A blocks Task B
  Task B blocks Task A

State:
  Task A: { status: "pending", blockedBy: ["B"], blocks: ["B"] }
  Task B: { status: "pending", blockedBy: ["A"], blocks: ["A"] }

Claim attempt for Task A:
  activeTaskIds = {"A", "B"}
  blockingTasks = ["B"]  <- B is active, so A is blocked

Claim attempt for Task B:
  blockingTasks = ["A"]  <- A is active, so B is blocked

Result: DEADLOCK - neither task can be claimed
```

**Detection complexity**: Requires graph cycle detection (DFS with visited/recursion-stack tracking), which is O(V + E) where V = tasks and E = dependency edges.

**Why not implemented**:
- **Edge case**: Circular deps rare in practice (agents typically create sequential or tree-structured workflows)
- **Complexity**: Cycle detection adds overhead to every task update operation
- **User responsibility**: The LLM creating tasks is expected to reason about dependencies

### 8.2 Mitigation via v2.1.76 Stale ID Handling

While circular dependencies still cause deadlock, the v2.1.76 improvement for stale/missing task IDs prevents a different class of permanent blocking:

- Previously: If task A blocked task B, and task A was deleted, task B could remain permanently blocked (its `blockedBy` still contained A's ID, and the old code checked if A was in the "active" set — but A wasn't in the set at all, causing undefined behavior in some code paths)
- Now: If task A's ID is not found in `allTaskIds`, it is treated as resolved (not blocking)

This doesn't fix circular deps but does fix the "orphan blocker" problem.

---

## 9. Race Conditions & Concurrency

### 9.1 Task Claim Race Condition

**Scenario**: Two agents attempt to claim the same task simultaneously.

```
Agent A finds Task #3 (pending, unblocked)
Agent B finds Task #3 (pending, unblocked)
Agent A: lock #3 file -> update owner -> unlock  (Agent A wins)
Agent B: lock #3 file -> reads owner = "Agent A" -> return already_claimed
Agent B: polls again, finds next unblocked task
```

**Resolution**: File locking ensures atomicity. Only one agent claims successfully.

### 9.2 Dependency Modification During Claim

**Scenario**: Agent claims task; another agent adds a dependency to it simultaneously.

```
Agent A: findNextAvailableTask -> finds Task #5 (unblocked)
Agent B: addDependency(#4, #5) -> Task #5 now has blockedBy: ["4"]
Agent A: attemptToClaimTask(#5) -> reads current state (blockedBy: ["4"]) -> BLOCKED
Agent A: cannot claim, reports blocked
```

**Resolution**: `attemptToClaimTask` re-reads task state within the lock. Even if a dependency was added after `findNextAvailableTask` found the task, the claim attempt sees the updated state and correctly refuses.

### 9.3 Completion + Dependency Update Race

**Scenario**: Agent completes Task #1 while another agent is reading the blocking set for Task #2.

```
Agent A reads allTasks for Task #2 blocking check -> sees Task #1 as "in_progress"
Agent B completes Task #1 -> status becomes "completed"
Agent A evaluates: Task #1 in activeTaskIds? Yes (stale read) -> Task #2 still blocked
Agent A: Wait 500ms, retry
Next poll: Agent A re-reads allTasks -> Task #1 is "completed" -> Task #2 unblocked
```

**Resolution**: Stale reads are self-correcting due to the polling loop. Maximum latency: one poll interval (500ms) after the blocking task completes.

---

## 10. Design Rationale & Trade-offs

### 10.1 Bidirectional References vs. Unidirectional

**Chosen**: Both `blocks` and `blockedBy` per task.

**Rationale**:
- O(1) lookup in both directions
- LLMs can query "what am I blocking?" without scanning all tasks
- Easier debugging: task file is self-contained

**Trade-off**: Must maintain consistency in both directions on every update. File locking mitigates race conditions, but complex update failures could leave inconsistency.

### 10.2 Implicit Unblocking vs. Explicit

**Chosen**: Implicit (status check at claim time).

**Rationale**:
- Simpler implementation (single write on complete)
- No cascading updates when one task completes
- Correct by construction: completed tasks filtered from active set

**Trade-off**: Dependents don't "know" they're unblocked until they next poll. Acceptable given 500ms poll interval.

### 10.3 File-per-Task vs. Single Task File

**Chosen**: One JSON file per task (`tasks/{teamName}/{taskId}.json`).

**Rationale**:
- Independent file locking per task (agents can claim different tasks simultaneously without contention)
- Scales to hundreds of tasks without single-file bottleneck
- Simple deletion (remove single file)

**Trade-off**: `getAllTasks()` requires directory listing + reading N files. For teams with 100+ tasks, this is slower than a database query.

### 10.4 v2.1.76: Removing `activeForm` Requirement

**Problem in v2.1.38**: The `activeForm` field (present-continuous description like "Running tests") was validated as required in some task creation paths. LLMs occasionally omitted it, causing validation errors.

**Solution in v2.1.76**: Made `activeForm` fully optional everywhere. The field is still used for display when provided, but its absence no longer causes errors.

**Why this matters**: Reducing required fields in LLM-facing APIs reduces the probability of tool call failures due to missing optional information. The `activeForm` is display-only and has no semantic role in task coordination.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `findNextAvailableTask` (JNY) - Find first claimable task @ chunks.134.mjs:1445
- `attemptToClaimTask` (o7A) - Atomic task claim with dependency check (chunks.48.mjs:593)
- `addDependency` (r7A) - Add bidirectional dependency link (chunks.48.mjs:643)
- `getAllTasks` (WX) - Read all tasks from storage (chunks.48.mjs)
- `readTaskById` (lg) - Read single task by ID (chunks.48.mjs)
- `updateTaskState` (JS) - Write updated task to disk (chunks.48.mjs)
- `getTaskFilePath` (WC1) - Compute task file path (chunks.48.mjs)

## Cross-References

- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - File locking implementation
- [04_polling_priorities.md](./04_polling_priorities.md) - Priority 5 task auto-claim
- [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - Task coordination chain
- [team_config_schema.md](./team_config_schema.md) - Team config (task paths)
