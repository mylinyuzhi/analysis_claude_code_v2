# Task Dependency Resolution & Blocking Logic

> **Module**: Agent Teams - Task Dependencies
> **Version**: Claude Code 2.1.38
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

**Key algorithms**:
- `findNextAvailableTask` (MVY) - Finds first pending, unclaimed, unblocked task
- `attemptToClaimTask` (o7A) - Atomic claim operation with dependency validation
- `addDependency` (r7A) - Updates bidirectional dependency links
- Task deletion cleanup - Removes deleted tasks from all dependency lists

**Limitation**: **No circular dependency detection**. Creating circular dependencies (A blocks B, B blocks A) results in deadlock—neither task becomes claimable.

---

## 2. Task Dependency Data Model

### 2.1 Task Schema with Dependencies

**What it does**: Each task object contains two arrays tracking dependencies: `blocks` (tasks this one blocks) and `blockedBy` (tasks blocking this one).

**Schema definition**:

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
    activeForm: zod.string().optional(),  // Present continuous form (e.g., "Running tests")
    owner: zod.string().optional(),  // Agent name who claimed this task
    status: TaskStatusSchema,  // "pending" | "in_progress" | "completed"
    blocks: zod.array(zod.string()),  // Task IDs that cannot start until this completes
    blockedBy: zod.array(zod.string()),  // Task IDs that must complete before this starts
    metadata: zod.record(zod.string(), zod.unknown()).optional()  // Custom metadata
});

// Mapping: u→zod, J71→TaskStatusSchema
```

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
// ============================================
// Task creation initialization (in-process teammate)
// Location: chunks.123.mjs:281
// ============================================

// ORIGINAL (for source lookup):
blockedBy: []

// READABLE (for understanding):
blockedBy: []  // Initially no blocking dependencies

// Mapping: (literal initialization)
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
Task #1 ──blocks──> Task #2 ──blocks──> Task #4
                                         /
Task #3 ──blocks────────────────────────

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

**Traversal algorithm** (see Section 5 for full details):

```
1. Get all tasks from filesystem
2. Filter to tasks with status ≠ "completed"
3. Create set of active task IDs (non-completed)
4. Find task where:
   - status = "pending"
   - owner = null (not claimed)
   - ALL tasks in blockedBy are NOT in active set (i.e., completed or deleted)
```

**Complexity**: O(n * m) where n = number of tasks, m = average number of blockers per task.
- Typical case: O(n) since most tasks have 0-3 blockers

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

        // Check 3: Dependency blocking validation
        let allTasks = getAllTasks(storageContext),
            activeTaskIds = new Set(
                allTasks
                    .filter(t => t.status !== "completed")
                    .map(t => t.id)
            ),
            blockingTasks = task.blockedBy.filter(blockerTaskId => activeTaskIds.has(blockerTaskId));

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

// Mapping: o7A→attemptToClaimTask, A→storageContext, q→taskId, K→agentName, Y→options,
// z→taskFilePath, WC1→getTaskFilePath, jr→fileExists, Cf5→attemptToClaimTaskWithBusyCheck,
// w→lockHandle, PC1.default.lockSync→properLock.lockSync, H→task, lg→readTaskById,
// $→allTasks, WX→getAllTasks, O→activeTaskIds, _→blockingTasks, JS→updateTaskState,
// h→debug, K1→logError
```

**Step-by-step algorithm**:

1. **Validate task exists**: Check that task file exists on disk
2. **Acquire file lock**: Use `proper-lockfile` to get exclusive access
3. **Read task**: Load current task state from JSON file
4. **Check if already claimed**: If `task.owner` is set and not current agent → fail with `already_claimed`
5. **Check if already completed**: If `task.status === "completed"` → fail with `already_resolved`
6. **Build active task set**: Load all tasks, filter to non-completed, extract IDs into a Set
7. **Filter blocking tasks**: For each task ID in `task.blockedBy`, check if it's in the active set
8. **Dependency validation**:
   - If `blockingTasks.length > 0` → fail with `blocked` reason
   - Otherwise → task is unblocked and claimable
9. **Claim task**: Update task with `owner: agentName`, write to file
10. **Release lock**: Unlock file in `finally` block

**Why this approach**:
- **File locking**: Prevents race conditions (two agents claiming same task simultaneously)
- **Atomic read-check-write**: Lock ensures no changes between reading and updating task
- **Set-based blocking check**: O(b) complexity where b = number of blockers (typically 0-3)
- **Graceful failure**: Returns structured error instead of throwing exceptions

**Key insight**: The dependency check uses a **set of active (non-completed) task IDs**. If a blocking task is completed or deleted, it won't be in the active set, so the task becomes unblocked. This elegantly handles both completion and deletion of blocking tasks.

### 4.2 Busy Agent Check Variant

**What it does**: Alternative claim algorithm that checks if agent is already busy with another task.

**How it works** (chunks.48.mjs:643-680):

```javascript
// ORIGINAL (simplified):
function Cf5(A, q, K) {
    let Y = G67(A),  // Get global task lock file
        z;
    try {
        z = PC1.default.lockSync(Y);
        let w = WX(A),
            H = w.find((X) => X.id === q);
        if (!H) return { success: !1, reason: "task_not_found" };

        let $ = new Set(w.filter((X) => X.status !== "completed").map((X) => X.id)),
            O = H.blockedBy.filter((X) => $.has(X));
        if (O.length > 0) return {
            success: !1,
            reason: "blocked",
            task: H,
            blockedByTasks: O
        };

        // Check if agent already owns another active task
        let _ = w.find((X) => X.owner === K && X.status !== "completed" && X.id !== q);
        if (_) return {
            success: !1,
            reason: "agent_busy",
            task: H,
            existingTask: _.id
        };

        return { success: !0, task: JS(A, q, { owner: K }) };
    } finally {
        if (z) z();
    }
}

// READABLE:
function attemptToClaimTaskWithBusyCheck(storageContext, taskId, agentName) {
    let globalLockPath = getGlobalTaskLockPath(storageContext),
        lockHandle;
    try {
        // Use global lock instead of per-task lock
        lockHandle = properLock.lockSync(globalLockPath);

        let allTasks = getAllTasks(storageContext),
            task = allTasks.find(t => t.id === taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // Same dependency check
        let activeTaskIds = new Set(
                allTasks.filter(t => t.status !== "completed").map(t => t.id)
            ),
            blockingTasks = task.blockedBy.filter(id => activeTaskIds.has(id));
        if (blockingTasks.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task: task,
                blockedByTasks: blockingTasks
            };
        }

        // ADDITIONAL CHECK: Is agent busy with another task?
        let agentActiveTask = allTasks.find(t =>
            t.owner === agentName &&
            t.status !== "completed" &&
            t.id !== taskId
        );
        if (agentActiveTask) {
            return {
                success: false,
                reason: "agent_busy",
                task: task,
                existingTask: agentActiveTask.id
            };
        }

        return { success: true, task: updateTaskState(storageContext, taskId, { owner: agentName }) };
    } finally {
        if (lockHandle) lockHandle();
    }
}

// Mapping: Cf5→attemptToClaimTaskWithBusyCheck, G67→getGlobalTaskLockPath
```

**Difference**: Uses **global lock** instead of per-task lock, and adds an extra check to prevent agents from claiming multiple tasks simultaneously.

**When used**: Currently only used if `options.checkAgentBusy = true` is passed. In practice, this is rarely used—teammates can work on multiple tasks concurrently.

**Why this variant exists**:
- **Serial execution**: Ensures agent finishes current task before claiming next
- **Resource limits**: Prevents single agent from hogging all tasks
- **Simpler workflow**: Forces linear task progression per agent

**Trade-off**: Serial execution is safer but slower. Default concurrent claiming allows parallelism.

---

## 5. Finding Next Available Task Algorithm

### 5.1 Core Selection Algorithm

**What it does**: Scans all tasks to find the first pending, unclaimed, unblocked task suitable for claiming.

**How it works**:

```javascript
// ============================================
// findNextAvailableTask - First-match unblocked task finder
// Location: chunks.131.mjs:222-229
// ============================================

// ORIGINAL (for source lookup):
function MVY(A) {
    let q = new Set(A.filter((K) => K.status !== "completed").map((K) => K.id));
    return A.find((K) => {
        if (K.status !== "pending") return !1;
        if (K.owner) return !1;
        return K.blockedBy.every((Y) => !q.has(Y))
    })
}

// READABLE (for understanding):
function findNextAvailableTask(allTasks) {
    // Build set of active (non-completed) task IDs
    let activeTaskIds = new Set(
        allTasks
            .filter(task => task.status !== "completed")
            .map(task => task.id)
    );

    // Find first task matching all criteria
    return allTasks.find(task => {
        // Criterion 1: Must be pending (not in_progress or completed)
        if (task.status !== "pending") return false;

        // Criterion 2: Must be unclaimed (no owner)
        if (task.owner) return false;

        // Criterion 3: All blocking tasks must be completed or deleted
        // (i.e., NOT in the active task set)
        return task.blockedBy.every(blockerTaskId => !activeTaskIds.has(blockerTaskId));
    });
}

// Mapping: MVY→findNextAvailableTask, A→allTasks, q→activeTaskIds, K→task, Y→blockerTaskId
```

**Algorithm breakdown**:

**Step 1: Build active task set** (O(n))
```javascript
let activeTaskIds = new Set(
    allTasks.filter(task => task.status !== "completed").map(task => task.id)
);
```

**Why a Set?**: Enables O(1) membership testing (`has()`). Alternative array would be O(n) per check.

**Active task definition**: Task with `status !== "completed"`. Includes:
- `pending` - Not started yet
- `in_progress` - Currently being worked on

Excludes:
- `completed` - Finished (no longer blocks)

**Step 2: Find first matching task** (O(n * b))
```javascript
return allTasks.find(task => {
    if (task.status !== "pending") return false;
    if (task.owner) return false;
    return task.blockedBy.every(blockerTaskId => !activeTaskIds.has(blockerTaskId));
});
```

**Three criteria** (AND logic):

| Criterion | Check | Reason for Failure |
|-----------|-------|-------------------|
| 1. Pending | `status === "pending"` | Task already started or completed |
| 2. Unclaimed | `!owner` | Another agent already claimed this task |
| 3. Unblocked | `every(id => !activeTaskIds.has(id))` | One or more blocking tasks still active |

**Criterion 3 deep dive**:

```javascript
task.blockedBy.every(blockerTaskId => !activeTaskIds.has(blockerTaskId))
```

**Interpretation**: For EVERY task ID in `blockedBy`, that ID must NOT be in the active task set.

**Examples**:

```javascript
// Example 1: Unblocked task
task.blockedBy = ["1", "2"]
activeTaskIds = new Set(["3", "4", "5"])
Result: every(id => !activeTaskIds.has(id)) = true
// Neither "1" nor "2" are active → both completed → task unblocked

// Example 2: Partially blocked
task.blockedBy = ["1", "2"]
activeTaskIds = new Set(["2", "3", "4"])
Result: every(id => !activeTaskIds.has(id)) = false
// Task "2" is active → still blocking → task remains blocked

// Example 3: No blockers
task.blockedBy = []
activeTaskIds = new Set(["1", "2", "3"])
Result: every(id => !activeTaskIds.has(id)) = true
// Empty array → every() returns true → task unblocked
```

**Why `find()` not `filter()`**: Returns **first** matching task (undefined if none). This is intentional—task order determines priority (see Section 5.2).

**Complexity analysis**:
- **Best case**: O(n) - First task matches all criteria
- **Worst case**: O(n * b) - Scan all n tasks, each with b blockers
- **Typical case**: O(n) - Most tasks have 0-3 blockers, dominated by linear scan

### 5.2 Task Priority & Order

**What it does**: Task selection depends on the order tasks appear in the `allTasks` array.

**Task order sources**:

1. **Filesystem iteration**: `getAllTasks` reads task files from directory, ordered by filename
2. **Filename format**: Tasks named `{id}.json` (e.g., `1.json`, `2.json`, `10.json`)
3. **Lexicographic sort**: Filesystem returns files in lexicographic order ("1" < "10" < "2")

**Example task selection order**:

```
Task files on disk:
- 1.json (status: completed)
- 2.json (status: pending, blockedBy: [])
- 3.json (status: pending, blockedBy: [])
- 10.json (status: pending, blockedBy: [])

Task order in allTasks: [1, 10, 2, 3]
First available task: #10 (not #2!)
```

**Why lexicographic order**:
- **Unintended**: Filesystem API returns files in lexicographic order
- **Consequence**: Task "10" claimed before task "2" if both available
- **Impact**: For small task counts (< 10), behaves as expected (numeric order)

**Alternative**: Sort tasks numerically by ID before calling `find()`.

**Current behavior**: No explicit sorting—relies on filesystem order.

### 5.3 Usage in Auto-Claim Flow

**What it does**: In-process teammates use `findNextAvailableTask` to auto-claim work when idle.

**How it works**:

```javascript
// ============================================
// claimNextTask - Auto-claim wrapper for teammates
// Location: chunks.131.mjs:241-258
// ============================================

// ORIGINAL (for source lookup):
function ib4(A, q) {
    try {
        let K = WX(A),
            Y = MVY(K);
        if (!Y) return;

        let z = o7A(A, Y.id, q);
        if (!z.success) {
            h(`[inProcessRunner] Failed to claim task #${Y.id}: ${z.reason}`);
            return;
        }

        return JS(A, Y.id, { status: "in_progress" }),
            h(`[inProcessRunner] Claimed task #${Y.id}: ${Y.subject}`),
            PVY(Y);
    } catch (K) {
        h(`[inProcessRunner] Error checking task list: ${K}`);
        return;
    }
}

// READABLE (for understanding):
function claimNextTask(storageContext, agentName) {
    try {
        let allTasks = getAllTasks(storageContext),
            nextTask = findNextAvailableTask(allTasks);

        if (!nextTask) {
            // No available tasks
            return undefined;
        }

        let claimResult = attemptToClaimTask(storageContext, nextTask.id, agentName);
        if (!claimResult.success) {
            debug(`[inProcessRunner] Failed to claim task #${nextTask.id}: ${claimResult.reason}`);
            return undefined;
        }

        // Update task status to in_progress
        updateTaskState(storageContext, nextTask.id, { status: "in_progress" });
        debug(`[inProcessRunner] Claimed task #${nextTask.id}: ${nextTask.subject}`);

        // Generate prompt for LLM
        return generatePromptFromTask(nextTask);
    } catch (error) {
        debug(`[inProcessRunner] Error checking task list: ${error}`);
        return undefined;
    }
}

// Mapping: ib4→claimNextTask, A→storageContext, q→agentName, K→allTasks/error,
// Y→nextTask, WX→getAllTasks, MVY→findNextAvailableTask, z→claimResult,
// o7A→attemptToClaimTask, JS→updateTaskState, PVY→generatePromptFromTask, h→debug
```

**Call flow**:

1. **Get all tasks**: Load from `~/.claude/tasks/` directory
2. **Find next available**: Use dependency checking algorithm
3. **Attempt claim**: Atomic claim with file locking
4. **Handle failure**: If claim fails (race condition), return undefined
5. **Update status**: Change from `pending` to `in_progress`
6. **Generate prompt**: Create task assignment message for LLM

**When called**: In-process teammate poll loop checks for tasks if mailbox is empty (chunks.131.mjs:336).

**Why auto-claim**:
- **Autonomous work**: Teammates self-assign work without lead intervention
- **Load balancing**: First idle teammate claims first available task
- **Simplicity**: No explicit task assignment protocol needed

---

## 6. Dependency Management Operations

### 6.1 Adding Dependencies

**What it does**: Creates a blocking relationship between two tasks, updating both tasks' dependency lists.

**How it works**:

```javascript
// ============================================
// addDependency - Bidirectional dependency link creation
// Location: chunks.48.mjs:569-580
// ============================================

// ORIGINAL (for source lookup):
function r7A(A, q, K) {
    let Y = lg(A, q),
        z = lg(A, K);
    if (!Y || !z) return !1;

    if (!Y.blocks.includes(K)) {
        JS(A, q, { blocks: [...Y.blocks, K] });
    }
    if (!z.blockedBy.includes(q)) {
        JS(A, K, { blockedBy: [...z.blockedBy, q] });
    }
    return !0;
}

// READABLE (for understanding):
function addDependency(storageContext, blockerTaskId, blockedTaskId) {
    let blockerTask = readTaskById(storageContext, blockerTaskId),
        blockedTask = readTaskById(storageContext, blockedTaskId);

    // Validate both tasks exist
    if (!blockerTask || !blockedTask) {
        return false;  // One or both tasks don't exist
    }

    // Update blocker task: add to its `blocks` list
    if (!blockerTask.blocks.includes(blockedTaskId)) {
        updateTaskState(storageContext, blockerTaskId, {
            blocks: [...blockerTask.blocks, blockedTaskId]
        });
    }

    // Update blocked task: add to its `blockedBy` list
    if (!blockedTask.blockedBy.includes(blockerTaskId)) {
        updateTaskState(storageContext, blockedTaskId, {
            blockedBy: [...blockedTask.blockedBy, blockerTaskId]
        });
    }

    return true;
}

// Mapping: r7A→addDependency, A→storageContext, q→blockerTaskId, K→blockedTaskId,
// Y→blockerTask, z→blockedTask, lg→readTaskById, JS→updateTaskState
```

**Step-by-step algorithm**:

1. **Read both tasks**: Load blocker and blocked task objects
2. **Validate existence**: Return false if either task not found
3. **Update blocker task**:
   - Check if `blockedTaskId` already in `blockerTask.blocks`
   - If not, append to array and save to disk
4. **Update blocked task**:
   - Check if `blockerTaskId` already in `blockedTask.blockedBy`
   - If not, append to array and save to disk
5. **Return success**: Return true if both updates succeeded

**Idempotency**: Duplicate calls with same IDs are safe—no duplicate entries added due to `includes()` check.

**Why this approach**:
- **Bidirectional consistency**: Single function ensures both sides updated
- **Duplicate prevention**: `includes()` check prevents array duplication
- **Graceful failure**: Returns false instead of throwing if tasks don't exist

**Usage**: Called from TaskUpdate tool when `addBlocks` or `addBlockedBy` parameters provided (chunks.141.mjs:172-178).

**Example TaskUpdate call**:

```javascript
// User: "Update task 5 to block tasks 7 and 8"
TaskUpdate({
    taskId: "5",
    addBlocks: ["7", "8"]
})

// Implementation:
for (let blockedTaskId of ["7", "8"]) {
    addDependency(storageContext, "5", blockedTaskId);
}
// Result: Task 5.blocks = [..., "7", "8"], Task 7.blockedBy = [..., "5"], Task 8.blockedBy = [..., "5"]
```

### 6.2 Dependency Cleanup on Task Deletion

**What it does**: When a task is deleted, removes that task ID from all other tasks' dependency lists.

**How it works**:

```javascript
// ============================================
// deleteTask - Cleanup dependencies on deletion
// Location: chunks.48.mjs:530-553
// ============================================

// ORIGINAL (for source lookup):
function sq6(A, q) {
    let K = WC1(A, q);
    if (!jr(K)) return !1;

    try {
        let Y = parseInt(q, 10);
        if (!isNaN(Y)) {
            let w = n7A(A);
            if (Y > w) P67(A, Y);  // Update next task ID counter
        }

        J67(K);  // Delete task file

        // Cleanup: Remove deleted task from all dependency lists
        let z = WX(A);
        for (let w of z) {
            let H = w.blocks.filter((O) => O !== q),
                $ = w.blockedBy.filter((O) => O !== q);

            if (H.length !== w.blocks.length || $.length !== w.blockedBy.length) {
                JS(A, w.id, {
                    blocks: H,
                    blockedBy: $
                });
            }
        }

        return l_1(), !0;  // Trigger task list refresh
    } catch {
        return !1;
    }
}

// READABLE (for understanding):
function deleteTask(storageContext, taskId) {
    let taskFilePath = getTaskFilePath(storageContext, taskId);
    if (!fileExists(taskFilePath)) {
        return false;  // Task doesn't exist
    }

    try {
        // Update next task ID counter if necessary
        let taskIdNum = parseInt(taskId, 10);
        if (!isNaN(taskIdNum)) {
            let nextTaskIdCounter = getNextTaskId(storageContext);
            if (taskIdNum > nextTaskIdCounter) {
                setNextTaskId(storageContext, taskIdNum);
            }
        }

        // Delete the task file
        deleteFile(taskFilePath);

        // CRITICAL: Remove deleted task from all other tasks' dependency lists
        let allTasks = getAllTasks(storageContext);
        for (let task of allTasks) {
            let updatedBlocks = task.blocks.filter(id => id !== taskId),
                updatedBlockedBy = task.blockedBy.filter(id => id !== taskId);

            // Only update if something changed (avoid unnecessary writes)
            if (updatedBlocks.length !== task.blocks.length ||
                updatedBlockedBy.length !== task.blockedBy.length) {
                updateTaskState(storageContext, task.id, {
                    blocks: updatedBlocks,
                    blockedBy: updatedBlockedBy
                });
            }
        }

        triggerTaskListRefresh();
        return true;
    } catch {
        return false;
    }
}

// Mapping: sq6→deleteTask, A→storageContext, q→taskId, K→taskFilePath, WC1→getTaskFilePath,
// jr→fileExists, Y→taskIdNum, w→nextTaskIdCounter/task, n7A→getNextTaskId, P67→setNextTaskId,
// J67→deleteFile, z→allTasks, WX→getAllTasks, H→updatedBlocks, $→updatedBlockedBy,
// JS→updateTaskState, l_1→triggerTaskListRefresh
```

**Cleanup algorithm**:

1. **Delete task file**: Remove `{taskId}.json` from filesystem
2. **Load all remaining tasks**: Get full task list
3. **Scan all tasks**: For each task, filter out deleted task ID from `blocks` and `blockedBy` arrays
4. **Update modified tasks**: Only write to disk if dependency lists changed
5. **Trigger refresh**: Notify UI that task list changed

**Why this approach**:
- **Automatic cleanup**: No orphaned references to deleted tasks
- **Unblocking**: Tasks blocked by deleted task become unblocked
- **Consistency**: Ensures dependency graph remains valid

**Example**:

```
Before deletion:
- Task 1: blocks: [], blockedBy: []
- Task 2: blocks: [3], blockedBy: [1]
- Task 3: blocks: [], blockedBy: [2]

Delete task 2:
- Task 1: blocks: [], blockedBy: []  (unchanged)
- Task 3: blocks: [], blockedBy: []  (removed "2" from blockedBy)

Result: Task 3 becomes unblocked and claimable
```

**Key insight**: Deletion has the **same effect as completion** regarding unblocking. Both remove the task from the active task set, making dependent tasks claimable.

---

## 7. Task Completion & Unblocking Flow

### 7.1 Completion Trigger

**What it does**: When a task is marked as completed, dependent tasks become eligible for claiming.

**How it works**:

TaskUpdate tool allows setting `status: "completed"`:

```javascript
// User: "Mark task 2 as completed"
TaskUpdate({
    taskId: "2",
    status: "completed"
})
```

**Implementation** (chunks.141.mjs:151-215):

```javascript
// ORIGINAL (simplified):
let X = lg(J, A);
// ... validation ...
if (j.status && j.status !== X.status) {
    JS(J, A, { status: j.status });
}
```

**No automatic unblocking**: Completing task #2 does NOT automatically update tasks blocked by #2. The unblocking happens **implicitly** via the active task set logic.

### 7.2 Unblocking Mechanism

**What it does**: Tasks blocked by a completed task automatically become available for claiming.

**How it works**:

Unblocking is **implicit** through the `findNextAvailableTask` algorithm:

**Before completion**:
```javascript
// Task 2: status = "in_progress"
// Task 4: blockedBy = ["2"]

activeTaskIds = new Set(["2", "3", "5"])  // Task 2 is active
task4.blockedBy.every(id => !activeTaskIds.has(id))  // false (2 is active)
// Task 4 NOT claimable
```

**After completion**:
```javascript
// Task 2: status = "completed"
// Task 4: blockedBy = ["2"]

activeTaskIds = new Set(["3", "5"])  // Task 2 NOT active (completed)
task4.blockedBy.every(id => !activeTaskIds.has(id))  // true (2 not in set)
// Task 4 IS claimable
```

**Why implicit unblocking**:
- **No cascading updates**: Don't need to update every dependent task when one completes
- **O(1) completion**: Marking task completed is single file write
- **O(n) discovery**: Finding unblocked tasks requires scanning list, but happens only when claiming

**Alternative**: Explicit unblocking (remove completed task from all `blockedBy` lists).
**Trade-off**: Would require O(n) updates on every completion. Implicit approach defers work until claiming.

### 7.3 Unblocking Notification

**What it does**: After completing a task, the TaskUpdate tool prompts the LLM to check for newly unblocked tasks.

**How it works**:

```javascript
// ============================================
// TaskUpdate result message with unblocking prompt
// Location: chunks.141.mjs:206-213
// ============================================

// ORIGINAL (for source lookup):
let $ = `Updated task #${Y} ${z.join(", ")}`;
if (H?.to === "completed" && ID() && l8()) {
    $ += `

Task completed. Call TaskList now to find your next available task or see if your work unblocked others.`;
}

// READABLE (for understanding):
let resultMessage = `Updated task #${taskId} ${updatedFields.join(", ")}`;
if (statusChange?.to === "completed" && isTeammate() && isAgentTeamsEnabled()) {
    resultMessage += `

Task completed. Call TaskList now to find your next available task or see if your work unblocked others.`;
}

// Mapping: $→resultMessage, Y→taskId, z→updatedFields, H→statusChange,
// ID→isTeammate, l8→isAgentTeamsEnabled
```

**When triggered**: Only if:
1. Status changed to `completed`
2. Agent is a teammate (not team lead)
3. Agent teams feature is enabled

**Why prompt to call TaskList**:
- **Discovery**: LLM won't know if unblocking occurred unless it checks
- **Proactive work**: Encourages teammate to claim next task immediately
- **Visibility**: Shows teammate what work became available due to their completion

**Example flow**:

```
Teammate: (completes task #3)
System: "Updated task #3 status. Task completed. Call TaskList now to find your next available task or see if your work unblocked others."
Teammate LLM: (calls TaskList tool)
System: (returns task list, including newly unblocked task #5)
Teammate LLM: (claims task #5)
```

**Key insight**: Unblocking is **passive** (no active notification), relying on LLM prompt to trigger discovery. This is simple but may cause delays if LLM doesn't follow the prompt.

---

## 8. Circular Dependency Handling

### 8.1 Lack of Cycle Detection

**What it does**: The system does **NOT** detect or prevent circular dependencies.

**Current behavior**:

```javascript
// Create circular dependency:
TaskUpdate({ taskId: "1", addBlocks: ["2"] })  // Task 1 blocks task 2
TaskUpdate({ taskId: "2", addBlocks: ["1"] })  // Task 2 blocks task 1

// Result:
// Task 1: blockedBy: ["2"], blocks: ["1"]  ← INVALID (self-reference)
// Task 2: blockedBy: ["1"], blocks: ["2"]  ← INVALID (self-reference)

// findNextAvailableTask:
task1.blockedBy.every(id => !activeTaskIds.has(id))  // false (task 2 is active)
task2.blockedBy.every(id => !activeTaskIds.has(id))  // false (task 1 is active)
// Neither task is claimable → DEADLOCK
```

**Types of cycles**:

1. **Self-cycle**: Task blocks itself (`task1.blocks = ["1"]`)
2. **Two-node cycle**: A blocks B, B blocks A
3. **Multi-node cycle**: A blocks B, B blocks C, C blocks A

**Detection algorithm** (NOT implemented):

```javascript
// Hypothetical cycle detection using DFS
function hasCycle(taskId, allTasks, visited = new Set(), recursionStack = new Set()) {
    if (recursionStack.has(taskId)) {
        return true;  // Cycle detected
    }
    if (visited.has(taskId)) {
        return false;  // Already explored this path
    }

    visited.add(taskId);
    recursionStack.add(taskId);

    let task = allTasks.find(t => t.id === taskId);
    if (task) {
        for (let blockedTaskId of task.blocks) {
            if (hasCycle(blockedTaskId, allTasks, visited, recursionStack)) {
                return true;
            }
        }
    }

    recursionStack.delete(taskId);
    return false;
}
```

**Why no cycle detection**:
- **Trust LLM**: Assumes LLM won't create circular dependencies
- **Complexity**: Cycle detection adds O(n + e) overhead on every dependency add
- **Rare occurrence**: In practice, LLMs rarely create cycles
- **Recoverable**: User can manually delete/edit tasks to break cycles

**Trade-off**: Simplicity vs robustness. No cycle detection simplifies implementation but allows deadlocks.

### 8.2 Manual Cycle Resolution

**What users do**: If a circular dependency is created, the user must manually intervene.

**Resolution steps**:

1. **Identify cycle**: Call TaskList to see that no tasks are claimable
2. **Inspect dependencies**: Check `blockedBy` fields to trace the cycle
3. **Break cycle**: Use TaskUpdate to remove one dependency link

**Example**:

```bash
# Diagnose:
TaskList
# Returns: All tasks have status "pending" but none are claimable

# Inspect:
TaskGet { taskId: "1" }
# Returns: blockedBy: ["2"], blocks: ["2"]

TaskGet { taskId: "2" }
# Returns: blockedBy: ["1"], blocks: ["1"]

# Fix: Remove one dependency
TaskUpdate { taskId: "1", blockedBy: [] }
# Result: Task 1 becomes claimable
```

**Why manual resolution**:
- **Rare**: Cycles are uncommon, so automated detection not justified
- **User context**: User understands which dependency should be removed
- **Simple tools**: Existing TaskUpdate tool sufficient for fixing

---

## 9. Race Conditions & Concurrency

### 9.1 File Locking Strategy

**What it does**: Uses `proper-lockfile` library to prevent concurrent access to task files.

**Locking scope**:

| Operation | Lock Type | Lock Target | Duration |
|-----------|-----------|-------------|----------|
| Claim task | Exclusive | Per-task file | Read + validate + write |
| Update task | Exclusive | Per-task file | Read + modify + write |
| Delete task | No lock | Task file | Delete + scan all tasks |
| List tasks | No lock | Directory | Read all task files |

**Claim task locking** (see Section 4.1):

```javascript
lockHandle = properLock.lockSync(taskFilePath);
// ... read task ...
// ... validate dependencies ...
// ... write owner ...
lockHandle();  // Release lock
```

**Why per-task locks**:
- **Granularity**: Multiple agents can claim different tasks concurrently
- **Performance**: No global lock bottleneck
- **Correctness**: Prevents two agents claiming same task

**Lock acquisition**:
- **Blocking**: `lockSync()` waits until lock available
- **Timeout**: Default timeout (usually 5-10 seconds)
- **Failure**: If timeout, returns error (treated as task unavailable)

### 9.2 Race Condition Scenarios

**Scenario 1: Simultaneous claim attempts**

```
Time  | Agent A                          | Agent B
------|----------------------------------|----------------------------------
T0    | findNextAvailableTask() → task 5 | findNextAvailableTask() → task 5
T1    | attemptToClaimTask("5", "A")     | attemptToClaimTask("5", "B")
T2    | lockSync(task5.json) → ACQUIRED  | lockSync(task5.json) → WAITING
T3    | Read: task.owner = null          |
T4    | Write: task.owner = "A"          |
T5    | unlock()                         | lockSync(task5.json) → ACQUIRED
T6    |                                  | Read: task.owner = "A"
T7    |                                  | Return { success: false, reason: "already_claimed" }
```

**Result**: Agent A claims task, Agent B fails gracefully. No corruption.

**Scenario 2: Task completion unblocks task during claim**

```
Time  | Agent A (working on task 2)      | Agent B (trying to claim task 4)
------|----------------------------------|----------------------------------
T0    | TaskUpdate({ taskId: "2", status: "completed" }) |
T1    |                                  | findNextAvailableTask()
T2    | Write: task2.status = "completed" |
T3    |                                  | Read all tasks (task 2 completed)
T4    |                                  | activeTaskIds = Set([3, 5]) ← no "2"
T5    |                                  | task4.blockedBy = ["2"]
T6    |                                  | every(id => !Set([3,5]).has(id)) → true
T7    |                                  | attemptToClaimTask("4", "B")
T8    |                                  | lockSync(task4.json)
T9    |                                  | Re-validate dependencies ← IMPORTANT
T10   |                                  | Write: task4.owner = "B"
```

**Result**: Agent B successfully claims task 4 after task 2 completes. Re-validation at T9 ensures consistency.

**Scenario 3: Dependency added during claim**

```
Time  | Agent A (team lead)              | Agent B (claiming task 3)
------|----------------------------------|----------------------------------
T0    |                                  | findNextAvailableTask() → task 3
T1    |                                  | task3.blockedBy = [] ← unblocked
T2    | TaskUpdate({ taskId: "2", addBlocks: ["3"] }) |
T3    | addDependency("2", "3")          |
T4    | Write: task3.blockedBy = ["2"]   |
T5    |                                  | attemptToClaimTask("3", "B")
T6    |                                  | lockSync(task3.json)
T7    |                                  | Read: task3.blockedBy = ["2"]
T8    |                                  | activeTaskIds = Set([2, ...])
T9    |                                  | every(id => !activeTaskIds.has(id)) → false
T10   |                                  | Return { success: false, reason: "blocked" }
```

**Result**: Agent B fails to claim because dependency was added. Task claiming is **atomic** due to file lock.

**Key insight**: File locking + re-validation in critical section ensures atomicity. Even if state changes between `findNextAvailableTask` and `attemptToClaimTask`, the lock prevents corruption.

### 9.3 Stale Task List Issues

**Problem**: `findNextAvailableTask` operates on a snapshot of tasks. If tasks change after snapshot, selection may be stale.

**Example**:

```javascript
// T0: Agent loads tasks
let allTasks = getAllTasks(storageContext);  // Snapshot: tasks 1, 2, 3

// T1: Another agent completes task 1 (unblocks task 2)
// (filesystem updated, but allTasks snapshot unchanged)

// T2: Agent calls findNextAvailableTask(allTasks)
// Still sees task 1 as active → task 2 appears blocked
// May miss newly available task 2
```

**Mitigation**: `attemptToClaimTask` re-reads task state under lock, catching changes.

**Why not problematic**:
- **Conservative**: Stale snapshot may miss available tasks, but won't claim invalid tasks
- **Next poll**: Teammate will reload tasks on next iteration and discover newly unblocked work
- **Correctness preserved**: Atomicity guaranteed by locking

---

## 10. Design Rationale & Trade-offs

### 10.1 Why Bidirectional Dependency Links?

**Problem**: Need to track "what blocks me?" and "what do I block?" for each task.

**Solution**: Store both `blocks` and `blockedBy` arrays in every task.

**Benefits**:
1. **Fast lookup**: O(1) access to both directions
2. **Explicit**: Dependency graph visible in task data
3. **Debugging**: Can inspect task file to see all dependencies

**Trade-offs**:
- **Consistency**: Must update both tasks when adding/removing dependency
- **Storage**: Duplicate information (A→B stored in both A.blocks and B.blockedBy)
- **Cleanup complexity**: Deleting task requires scanning all tasks

**Alternative**: Single-directional (only `blockedBy`).
**Why not**: Would require scanning all tasks to find "what do I block?" (O(n) instead of O(1)).

### 10.2 Why Set-Based Blocking Check?

**Problem**: Need to verify all blocking tasks are completed before claiming.

**Solution**: Create Set of active task IDs, check if blockers are NOT in set.

**Benefits**:
1. **Efficient**: O(1) membership test per blocker
2. **Handles deletion**: Deleted tasks automatically excluded from active set
3. **Simple**: Single logical condition (every blocker NOT active)

**Trade-offs**:
- **Memory**: O(n) Set creation on every claim attempt
- **Snapshot consistency**: Set represents point-in-time state

**Alternative**: For each blocker, read task file and check status.
**Why not**: O(b) file reads per claim (much slower than Set construction).

### 10.3 Why No Circular Dependency Detection?

**Problem**: Circular dependencies cause deadlock (no tasks claimable).

**Solution**: No automatic detection or prevention.

**Rationale**:
1. **Rare occurrence**: LLMs rarely create cycles in practice
2. **Complexity**: Cycle detection adds O(n + e) overhead
3. **Recoverable**: User can manually fix cycles
4. **Trust model**: Assumes LLM competence

**Trade-offs**:
- **Deadlock risk**: Circular dependencies stall work
- **User burden**: Manual diagnosis and fixing required
- **Simplicity**: No complex graph algorithms in codebase

**Alternative**: Run cycle detection on every `addDependency`.
**Why not**: Overhead not justified given rarity of cycles.

### 10.4 Why Implicit Unblocking?

**Problem**: When task completes, dependent tasks should become available.

**Solution**: Completed tasks excluded from active set; dependents discovered during next claim attempt.

**Benefits**:
1. **No cascading writes**: Completing one task = one file write
2. **Lazy evaluation**: Only compute unblocking when needed (during claim)
3. **Consistent with deletion**: Deletion and completion both remove from active set

**Trade-offs**:
- **Delayed discovery**: Teammates don't learn about unblocking until they check TaskList
- **No proactive notification**: Rely on LLM prompt to trigger check
- **Repeated computation**: Every claim attempt recomputes active set

**Alternative**: Explicit unblocking (remove completed task from all `blockedBy` lists).
**Why not**: Would require O(n) updates on every completion (slower).

### 10.5 Why File Locking for Atomicity?

**Problem**: Multiple agents claiming tasks concurrently can cause races.

**Solution**: Use `proper-lockfile` to serialize access to task files.

**Benefits**:
1. **Cross-process safety**: Works with separate process teammates (pane mode)
2. **Simple**: No need for database or coordination service
3. **Proven**: Filesystem locking is well-understood and robust

**Trade-offs**:
- **Blocking**: Agents wait for lock (latency)
- **Failure modes**: Lock timeouts, stale locks if process crashes
- **Performance**: File I/O slower than in-memory operations

**Alternative**: In-memory locking (mutexes).
**Why not**: Only works for in-process teammates, not pane-based teammates (separate processes).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `findNextAvailableTask` (MVY) - First-match unblocked task finder (chunks.131.mjs:222)
- `attemptToClaimTask` (o7A) - Atomic claim with dependency validation (chunks.48.mjs:593)
- `addDependency` (r7A) - Bidirectional dependency link creation (chunks.48.mjs:569)
- `claimNextTask` (ib4) - Auto-claim wrapper for teammates (chunks.131.mjs:241)
- `deleteTask` (sq6) - Cleanup dependencies on deletion (chunks.48.mjs:530)
- `getAllTasks` (WX) - Load all tasks from directory (chunks.48.mjs:555)
- `readTaskById` (lg) - Load single task by ID (chunks.48.mjs:504)
- `updateTaskState` (JS) - Update task fields and save (chunks.141.mjs:151)
- `getTaskFilePath` (WC1) - Compute task file path (chunks.48.mjs:452)
- `generatePromptFromTask` (PVY) - Create task assignment message (chunks.131.mjs:231)

Constants:
- `TaskStatusSchema` (J71) - Zod schema for task status (chunks.140.mjs:2949)

---

## Cross-References

- [01_complete_chain_analysis.md](./01_complete_chain_analysis.md) - Overall team workflow including task claiming
- [04_polling_priorities.md](./04_polling_priorities.md) - How teammates poll for tasks when idle
- [02_spawn_mechanisms_deep_dive.md](./02_spawn_mechanisms_deep_dive.md) - Teammate spawning and task assignment
- [03_mailbox_and_locking.md](./03_mailbox_and_locking.md) - File locking patterns (similar to task locking)
- [pane_backend_executor.md](./pane_backend_executor.md) - Pane-based teammate execution with task auto-claiming
