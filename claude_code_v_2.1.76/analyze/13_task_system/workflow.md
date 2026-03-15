# Task System Workflow - State Machine & Transitions

## Module Overview

This document provides deep analysis of the task system's state machine, status transitions, validation logic, and lifecycle management in Claude Code v2.1.38.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Task system symbols

Key functions in this document:
- `TaskUpdate` (DR) - Main state transition handler
- `verifyTaskCompletion` (Cg1) - Pre-completion validation hooks
- `deleteTask` (sq6) - Task deletion and cleanup
- `updateTaskState` (JS) - Low-level state persistence
- `findTaskById` (lg) - Task loading with schema validation

---

## 1. Task Status State Machine

### 1.1 Valid States and Transitions

The task system implements a **linear forward-only state machine** with a special deletion path:

```
┌─────────────────────────────────────────────────────────────┐
│              TASK STATUS STATE MACHINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────┐                                             │
│   │ PENDING  │  (Initial state)                            │
│   └────┬─────┘                                             │
│        │                                                     │
│        │  TaskUpdate({ status: "in_progress" })            │
│        │                                                     │
│        ▼                                                     │
│   ┌──────────────┐                                         │
│   │ IN_PROGRESS  │  (Being worked on)                      │
│   └────┬─────────┘                                         │
│        │                                                     │
│        │  TaskUpdate({ status: "completed" })              │
│        │  + Hook validation passes                          │
│        │                                                     │
│        ▼                                                     │
│   ┌──────────┐                                             │
│   │COMPLETED │  (Final state - no further transitions)     │
│   └──────────┘                                             │
│                                                             │
│   ┌──────────────────────────────────────────────┐        │
│   │         DELETION PATH (from any state)        │        │
│   └──────────────────────────────────────────────┘        │
│                                                             │
│   Any state + TaskUpdate({ status: "deleted" })            │
│        │                                                     │
│        ▼                                                     │
│   ┌──────────┐                                             │
│   │ DELETED  │  (File removed, dependencies cleaned)       │
│   └──────────┘                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Schema Definition** (chunks.48.mjs:742):

// ============================================
// Task Status Schema - Valid status values
// Location: chunks.48.mjs:742
// ============================================

// ORIGINAL (for source lookup):
J71 = u.enum(["pending", "in_progress", "completed"])

// READABLE (for understanding):
const taskStatusSchema = zodSchema.enum([
    "pending",       // Task created but not claimed
    "in_progress",   // Task claimed and being worked on
    "completed"      // Task finished successfully
]);

// Note: "deleted" is handled as special operation, not in enum

**Key Design Decision**: Why linear forward-only?
- **Simplicity**: Prevents confusion about task lifecycle
- **Auditability**: Clear progression from creation to completion
- **Team coordination**: No ambiguity about task state in multi-agent scenarios
- **Trade-off**: Cannot "un-complete" or "un-claim" tasks (must create new task or use deletion)

---

### 1.2 State Transition Implementation

// ============================================
// TaskUpdate - State transition handler
// Location: chunks.141.mjs:117-147
// ============================================

// ORIGINAL (for source lookup):
if (z !== void 0) {
    if (z === "deleted") {
        let M = sq6(WM(), A);
        if (!M) return { data: { success: !1, error: "Failed to delete task" } };
        return {
            data: {
                success: !0,
                taskId: A,
                updatedFields: [],
                statusChange: { from: X.status, to: "deleted" }
            }
        }
    }
    if (z === "completed") {
        let M = [],
            P = Cg1(A, X.subject, X.description, g5(), i3(), ...);
        for await (let W of P)
            if (W.blockingError) M.push(yg1(W.blockingError));
        if (M.length > 0) return {
            data: {
                success: !1,
                taskId: A,
                updatedFields: [],
                error: M.join("\n")
            }
        }
    }
    j.status = z, D.push("status")
}

// READABLE (for understanding):
if (newStatus !== undefined) {
    // BRANCH 1: Deletion path (immediate execution)
    if (newStatus === "deleted") {
        const deleted = deleteTask(getTaskManager(), taskId);
        if (!deleted) {
            return { data: { success: false, error: "Failed to delete task" } };
        }
        return {
            data: {
                success: true,
                taskId: taskId,
                updatedFields: [],
                statusChange: { from: currentTask.status, to: "deleted" }
            }
        };
    }

    // BRANCH 2: Completion path (requires validation)
    if (newStatus === "completed") {
        let errors = [];

        // Run TaskCompleted hook - can block completion
        const hookResults = verifyTaskCompletion(
            taskId,
            currentTask.subject,
            currentTask.description,
            getCurrentAgentName(),
            getTeamName(),
            // ... additional context
        );

        // Collect all blocking errors from hooks
        for await (const result of hookResults) {
            if (result.blockingError) {
                errors.push(formatError(result.blockingError));
            }
        }

        // If ANY hook returned blocking error, reject completion
        if (errors.length > 0) {
            return {
                data: {
                    success: false,
                    taskId: taskId,
                    updatedFields: [],
                    error: errors.join("\n")
                }
            };
        }
    }

    // Normal status update (if validation passed)
    updates.status = newStatus;
    updatedFields.push("status");
}

// Mapping:
// z → newStatus
// X → currentTask
// sq6 → deleteTask
// WM → getTaskManager
// Cg1 → verifyTaskCompletion
// g5 → getCurrentAgentName
// i3 → getTeamName
// yg1 → formatError
// j → updates
// D → updatedFields

**What it does**: Handles status transitions with branch-specific logic for deletion and completion.

**How it works**:

**Step 1 - Deletion Branch**:
1. Call `deleteTask()` which:
   - Physically removes `{taskId}.json` file from disk
   - Cleans up ALL dependency references in other tasks
   - Removes task from in-memory cache
2. Return success/failure immediately (no validation needed)

**Step 2 - Completion Branch**:
1. Run `verifyTaskCompletion()` hook generator
2. Iterate through ALL hook results (can be multiple hooks registered)
3. Collect any results that contain `blockingError` field
4. If ANY blocking errors exist:
   - Concatenate all error messages with newlines
   - Return failure (status does NOT change)
   - Task remains in current status
5. If no blocking errors: proceed to normal update

**Step 3 - Normal Update**:
1. Add new status to `updates` object
2. Track "status" in `updatedFields` array
3. Apply updates via `applyTaskUpdates()` later in function

**Why this approach**:
- **Deletion as escape hatch**: Any task can be deleted regardless of dependencies
- **Validation gates completion**: Prevents marking tasks complete prematurely
- **Hook extensibility**: Custom validation logic without modifying core code
- **Atomic validation**: All hooks must pass before state changes

**Trade-offs**:
- **No rollback**: If hook validation passes but disk write fails, inconsistent state
- **Sequential validation**: Hooks run serially, slowing completion for many hooks
- **All-or-nothing**: Cannot partially complete tasks (hook must pass 100%)

---

## 2. Task Completion Verification

### 2.1 Hook-Based Validation

// ============================================
// verifyTaskCompletion - Async validation hook system
// Location: chunks.141.mjs:136-147 (Cg1 function)
// ============================================

// READABLE (for understanding):
async function* verifyTaskCompletion(
    taskId,
    subject,
    description,
    agentName,
    teamName,
    // ... additional context
) {
    // Execute all registered TaskCompleted hooks
    const hookEvent = {
        type: "TaskCompleted",
        data: {
            taskId,
            subject,
            description,
            agent: agentName,
            team: teamName
        }
    };

    // Yield results from each hook
    for (const hook of registeredHooks["TaskCompleted"]) {
        const result = await hook.execute(hookEvent);
        yield result;  // Can contain: { blockingError: string } or {}
    }
}

**Hook result schema**:
```javascript
{
    blockingError: string | undefined,  // If present, prevents completion
    warnings: string[],                 // Non-blocking feedback
    metadata: any                       // Additional context
}
```

**Example hook use cases**:

1. **Test verification hook**:
```javascript
{
    name: "require-tests-passing",
    execute: async (event) => {
        const testResult = await runTests();
        if (!testResult.passed) {
            return {
                blockingError: `Cannot complete task "${event.data.subject}" - ${testResult.failures} tests failing`
            };
        }
        return {};
    }
}
```

2. **Dependency check hook**:
```javascript
{
    name: "check-dependencies",
    execute: async (event) => {
        const task = findTaskById(taskManager, event.data.taskId);
        const blockedTasks = task.blocks.filter(id => {
            const blocked = findTaskById(taskManager, id);
            return blocked.status !== "completed";
        });

        if (blockedTasks.length > 0) {
            return {
                blockingError: `Cannot complete - ${blockedTasks.length} dependent tasks still pending`
            };
        }
        return {};
    }
}
```

**Key insight**: Hook validation provides **semantic completion checking** beyond status flags. A task is only "truly complete" if external conditions (tests pass, dependent tasks done, etc.) are met.

---

### 2.2 Completion Error Handling

// ============================================
// formatError - Error message standardization
// Location: chunks.141.mjs (yg1 function)
// ============================================

// READABLE (for understanding):
function formatError(errorObj) {
    if (typeof errorObj === "string") {
        return errorObj;
    }
    if (errorObj.message) {
        return errorObj.message;
    }
    if (errorObj.blockingError) {
        return errorObj.blockingError;
    }
    return JSON.stringify(errorObj);
}

**Error aggregation flow**:
```
Hook 1: { blockingError: "Tests failing" }
Hook 2: { blockingError: "Missing documentation" }
Hook 3: {} (no error)

↓ Collected errors ↓

errors = ["Tests failing", "Missing documentation"]

↓ Joined with newline ↓

Final error message:
"Tests failing
Missing documentation"
```

**User experience**:
```javascript
// User attempts completion
await TaskUpdate({ taskId: "5", status: "completed" });

// Returns:
{
    success: false,
    taskId: "5",
    updatedFields: [],
    error: "Cannot complete task:\n- Tests failing (3 failures)\n- Missing required documentation in README.md"
}

// Task remains in "in_progress" status
```

**Why this approach**:
- **Comprehensive feedback**: User sees ALL reasons completion failed
- **Actionable errors**: Each hook provides specific failure reason
- **No partial completion**: Task stays in progress until ALL checks pass

---

## 3. Auto-Assignment on Status Change

### 3.1 Automatic Owner Assignment

// ============================================
// Auto-assign owner on in_progress transition
// Location: chunks.141.mjs:104-107
// ============================================

// ORIGINAL (for source lookup):
if (l8() && z === "in_progress" && w === void 0 && !X.owner) {
    let M = g5();
    if (M) j.owner = M, D.push("owner")
}

// READABLE (for understanding):
if (isInTeamMode() && newStatus === "in_progress" && ownerInput === undefined && !currentTask.owner) {
    const currentAgentName = getCurrentAgentName();
    if (currentAgentName) {
        updates.owner = currentAgentName;
        updatedFields.push("owner");
    }
}

// Mapping:
// l8 → isInTeamMode
// z → newStatus
// w → ownerInput
// X → currentTask
// g5 → getCurrentAgentName
// j → updates
// D → updatedFields

**What it does**: Automatically assigns the current agent as owner when a task transitions to "in_progress" in team mode.

**How it works**:
1. Check if in team mode (`isInTeamMode()` checks for active team config)
2. Check if new status is "in_progress"
3. Check if user didn't explicitly provide owner parameter
4. Check if task doesn't already have an owner
5. If all conditions met:
   - Get current agent's name from context
   - Assign as owner
   - Track "owner" in updated fields list

**Why this approach**:
- **Implicit claiming**: Agent doesn't need to explicitly set owner when starting work
- **Team coordination**: Other agents see task is now owned, won't duplicate work
- **Override support**: Can still explicitly set owner via parameter if needed

**Example workflow**:
```javascript
// Agent A checks available tasks
await TaskList();
// Returns: [ { id: "5", status: "pending", owner: undefined, blockedBy: [] } ]

// Agent A starts working
await TaskUpdate({ taskId: "5", status: "in_progress" });
// Auto-assigns owner: "agent-a"

// Agent B checks tasks
await TaskList();
// Returns: [ { id: "5", status: "in_progress", owner: "agent-a", blockedBy: [] } ]
// Agent B sees it's claimed, doesn't touch it
```

---

## 4. Task Deletion and Cleanup

### 4.1 Deletion Implementation

// ============================================
// deleteTask - Remove task and clean dependencies
// Location: chunks.48.mjs:535-547
// ============================================

// ORIGINAL (for source lookup):
function sq6(A, q) {
    let K = WC1(A, q);
    if (!jr(K)) return !1;
    try {
        J67(K);
        let Y = WX(A);
        for (let z of Y) {
            let w = z.blocks.filter((H) => H !== q),
                $ = z.blockedBy.filter((H) => H !== q);
            if (w.length !== z.blocks.length || $.length !== z.blockedBy.length)
                JS(A, z.id, { blocks: w, blockedBy: $ })
        }
        return !0
    } catch {
        return !1
    }
}

// READABLE (for understanding):
function deleteTask(taskManager, taskId) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    // Check if file exists
    if (!fileExists(taskFilePath)) return false;

    try {
        // STEP 1: Physically delete the task file
        deleteFile(taskFilePath);

        // STEP 2: Clean up ALL dependency references
        const allTasks = loadAllTasks(taskManager);

        for (const task of allTasks) {
            // Remove deleted task from this task's 'blocks' array
            const newBlocks = task.blocks.filter(id => id !== taskId);

            // Remove deleted task from this task's 'blockedBy' array
            const newBlockedBy = task.blockedBy.filter(id => id !== taskId);

            // If either array changed, update the task
            if (newBlocks.length !== task.blocks.length ||
                newBlockedBy.length !== task.blockedBy.length) {
                updateTask(taskManager, task.id, {
                    blocks: newBlocks,
                    blockedBy: newBlockedBy
                });
            }
        }

        return true;
    } catch (error) {
        return false;
    }
}

// Mapping:
// sq6 → deleteTask
// A → taskManager
// q → taskId
// WC1 → getTaskFilePath
// jr → fileExists
// J67 → deleteFile
// WX → loadAllTasks
// JS → updateTask

**What it does**: Deletes a task and cleans up all references to it in other tasks' dependency arrays.

**How it works**:

**Phase 1 - File Deletion**:
1. Build file path: `~/.claude/tasks/{taskListId}/{taskId}.json`
2. Check if file exists (return false if not)
3. Delete the file from disk using `fs.unlinkSync()`

**Phase 2 - Dependency Cleanup**:
1. Load ALL tasks from disk (via `loadAllTasks()`)
2. For each task:
   - Filter deleted task ID from `blocks` array
   - Filter deleted task ID from `blockedBy` array
   - If either array changed:
     - Update task on disk with new arrays
     - This cascades: all references removed atomically
3. Return success

**Why this approach**:
- **Cascading cleanup**: Prevents orphaned references
- **No manual tracking**: No need to remember which tasks depend on deleted one
- **Unblocking side effect**: Tasks blocked by deleted task become immediately available
- **Idempotent**: Can call multiple times without error (file not exists → return false)

**Trade-offs**:
- **O(N) complexity**: Must scan all tasks on every deletion
- **No backup**: Deletion is permanent (no "trash" or undo)
- **No notification**: Other agents don't get notified when blocking task is deleted

---

### 4.2 Dependency Cleanup Example

**Before deletion**:
```
Task 1: { id: "1", blocks: ["2", "3"], blockedBy: [] }
Task 2: { id: "2", blocks: [], blockedBy: ["1"] }
Task 3: { id: "3", blocks: ["4"], blockedBy: ["1"] }
Task 4: { id: "4", blocks: [], blockedBy: ["3"] }
```

**Delete Task 1**:
```javascript
await TaskUpdate({ taskId: "1", status: "deleted" });
```

**After deletion**:
```
Task 1: [DELETED - file removed]
Task 2: { id: "2", blocks: [], blockedBy: [] }  ← unblocked!
Task 3: { id: "3", blocks: ["4"], blockedBy: [] }  ← unblocked!
Task 4: { id: "4", blocks: [], blockedBy: ["3"] }  (unchanged)
```

**Effect**: Tasks 2 and 3 are now available for work (no longer blocked).

---

## 5. Status Change Side Effects

### 5.1 Side Effect Matrix

| From Status | To Status | Side Effects |
|-------------|-----------|-------------|
| pending → in_progress | Auto-assign owner (if team mode)<br/>Send task_assignment message (if owner changed) |
| pending → completed | Run verification hooks<br/>Block if hooks return errors<br/>Send notifications |
| pending → deleted | Remove file<br/>Clean all dependency references<br/>No notifications |
| in_progress → completed | Run verification hooks<br/>Block if hooks return errors<br/>Send notifications |
| in_progress → deleted | Remove file<br/>Clean all dependency references<br/>Unassign from owner |
| in_progress → pending | NO AUTOMATIC PATH (must manually set owner=undefined first) |
| completed → * | NO PATHS (completed is final state) |
| * → deleted | ALWAYS ALLOWED (escape hatch from any state) |

---

### 5.2 Notification on Owner Change

// ============================================
// Task assignment notification
// Location: chunks.141.mjs:152-169
// ============================================

// ORIGINAL (for source lookup):
if (j.owner && l8()) {
    let M = g5() || "team-lead",
        P = b$(),
        W = JSON.stringify({
            type: "task_assignment",
            taskId: A,
            subject: X.subject,
            description: X.description,
            assignedBy: M,
            timestamp: new Date().toISOString()
        });
    f9(j.owner, {
        from: M,
        text: W,
        timestamp: new Date().toISOString(),
        color: P
    }, J)
}

// READABLE (for understanding):
if (updates.owner && isInTeamMode()) {
    const assignerName = getCurrentAgentName() || "team-lead";
    const assignerColor = getCurrentAgentColor();

    // Build task assignment message payload
    const messagePayload = JSON.stringify({
        type: "task_assignment",
        taskId: taskId,
        subject: currentTask.subject,
        description: currentTask.description,
        assignedBy: assignerName,
        timestamp: new Date().toISOString()
    });

    // Send message to new owner's inbox
    sendTeamMessage(updates.owner, {
        from: assignerName,
        text: messagePayload,
        timestamp: new Date().toISOString(),
        color: assignerColor
    }, taskManager);
}

// Mapping:
// j → updates
// l8 → isInTeamMode
// g5 → getCurrentAgentName
// b$ → getCurrentAgentColor
// f9 → sendTeamMessage
// A → taskId
// X → currentTask
// J → taskManager

**What it does**: Sends a team message to the newly assigned owner notifying them of the task assignment.

**How it works**:
1. Check if owner was changed AND in team mode
2. Get current agent's name (defaults to "team-lead" if unknown)
3. Build JSON message with task details
4. Send via `sendTeamMessage()` to owner's inbox
5. Message includes:
   - Task ID and subject
   - Full description
   - Who assigned it
   - Timestamp

**Message format**:
```json
{
    "from": "team-lead",
    "text": "{\"type\":\"task_assignment\",\"taskId\":\"5\",\"subject\":\"Implement login\",\"description\":\"...\",\"assignedBy\":\"team-lead\",\"timestamp\":\"2024-02-14T10:30:00.000Z\"}",
    "timestamp": "2024-02-14T10:30:00.000Z",
    "color": "#FF5733"
}
```

**Why this approach**:
- **Async notification**: Owner learns about assignment even if offline
- **Full context**: Includes complete task details, not just ID
- **Auditability**: Timestamp and assigner tracked
- **Non-blocking**: Notification failure doesn't prevent assignment

---

## 6. State Validation Rules

### 6.1 Implicit Validation via Status Enum

The Zod schema (chunks.48.mjs:742) only allows three values:
```javascript
taskStatusSchema = zod.enum(["pending", "in_progress", "completed"])
```

**Invalid status attempts**:
```javascript
await TaskUpdate({ taskId: "1", status: "in_review" });
// Result: Zod validation error - status not in enum
// Task status unchanged
```

**Deletion handling**:
```javascript
await TaskUpdate({ taskId: "1", status: "deleted" });
// "deleted" is NOT in enum, so handled separately before validation
// Goes to deletion branch (if-statement catches it first)
```

---

### 6.2 Blocked Task Completion Prevention

**Not implemented at TaskUpdate level** - handled by hooks.

Example hook implementation:
```javascript
{
    name: "check-blockers",
    event: "TaskCompleted",
    execute: async (event) => {
        const task = findTaskById(taskManager, event.data.taskId);
        const allTasks = loadAllTasks();

        // Find any tasks this task blocks that aren't complete
        const incompleteBlockedTasks = task.blocks
            .map(id => allTasks.find(t => t.id === id))
            .filter(t => t && t.status !== "completed");

        if (incompleteBlockedTasks.length > 0) {
            return {
                blockingError: `Cannot complete - ${incompleteBlockedTasks.length} dependent tasks not yet complete`
            };
        }
        return {};
    }
}
```

**Why hooks instead of core validation**:
- **Flexibility**: Different teams may have different completion requirements
- **Extensibility**: Can add custom validation without modifying core
- **Override possible**: Can skip hook via configuration if needed

---

## 7. Concurrency and Race Conditions

### 7.1 File Locking for Atomic Operations

// ============================================
// File locking during task creation
// Location: chunks.48.mjs:486-502 (n_1 function)
// ============================================

// ORIGINAL (for source lookup):
function n_1(A, q) {
    let K = G67(A), Y;
    try {
        Y = PC1.default.lockSync(K);
        let z = Rf5(A),
            w = String(z + 1),
            H = { id: w, ...q },
            $ = WC1(A, w);
        return c8($, Q1(H, null, 2)), l_1(), w
    } finally {
        if (Y) Y()
    }
}

// READABLE (for understanding):
function createTask(taskManager, taskData) {
    const lockFilePath = getLockFilePath(taskManager);
    let unlock;

    try {
        // ACQUIRE LOCK (blocks until available)
        unlock = lockfile.lockSync(lockFilePath);

        // Critical section - protected by lock
        const currentMaxId = getHighWaterMark(taskManager);
        const newId = String(currentMaxId + 1);
        const newTask = { id: newId, ...taskData };
        const taskFilePath = getTaskFilePath(taskManager, newId);

        // Write task file
        writeFile(taskFilePath, JSON.stringify(newTask, null, 2));

        // Update high water mark
        syncHighWaterMark();

        return newId;
    } finally {
        // RELEASE LOCK (always executes, even on error)
        if (unlock) unlock();
    }
}

// Mapping:
// n_1 → createTask
// PC1.default.lockSync → lockfile.lockSync
// G67 → getLockFilePath
// Rf5 → getHighWaterMark
// WC1 → getTaskFilePath
// c8 → writeFile
// Q1 → JSON.stringify
// l_1 → syncHighWaterMark

**What it does**: Uses file-based locking to ensure ID assignment is atomic even with concurrent task creation.

**How it works**:
1. Acquire exclusive lock on `.lock` file in task directory
2. If another process holds lock, blocks until available
3. Read current max ID from either files or `.highwatermark`
4. Increment ID by 1
5. Write new task file
6. Update `.highwatermark` file
7. Release lock (via finally block, ensures release even on error)

**Why this approach**:
- **Cross-process safety**: Multiple agents can create tasks simultaneously
- **No database required**: Pure filesystem-based coordination
- **Automatic cleanup**: Finally block ensures lock released on error
- **Simple debugging**: Lock file visible in filesystem

**Trade-offs**:
- **Single writer**: Only one task creation at a time (serialized)
- **Blocking**: Other agents wait for lock (could add timeouts)
- **No distributed locking**: Only works on single machine (not cloud-ready)

---

### 7.2 Race Condition Scenarios

**Scenario 1: Two agents claim same task simultaneously**

```
Agent A:                    Agent B:
  |                           |
  |-- TaskUpdate(id:5)        |
  |   owner="A"               |
  |                           |-- TaskUpdate(id:5)
  |                           |   owner="B"
  |                           |
  |-- Lock acquired           |
  |-- Load task (owner=null)  |
  |-- Set owner="A"           |
  |-- Write file              |-- Lock waiting...
  |-- Release lock            |
  |                           |-- Lock acquired
  |                           |-- Load task (owner="A")
  |                           |-- Set owner="B" (OVERWRITES!)
  |                           |-- Write file
  |                           |-- Release lock
  |                           |
Final state: owner="B" (last writer wins)
```

**No explicit prevention** - Last write wins. Agents should check owner before claiming.

**Scenario 2: Task deleted while another agent updates**

```
Agent A:                    Agent B:
  |                           |
  |-- TaskUpdate(id:5)        |
  |   status="completed"      |
  |                           |
  |-- Load task (exists)      |-- TaskUpdate(id:5)
  |                           |   status="deleted"
  |                           |
  |                           |-- Delete file
  |                           |-- Clean dependencies
  |                           |
  |-- Attempt write           |
  |-- File not found!         |
  |-- Silent failure or error |
```

**Mitigation**: TaskUpdate checks if file exists before writing (return "Task not found" error).

---

## Summary

The task system workflow implements a **simple but robust state machine** with these key characteristics:

1. **Linear Forward Progression**: pending → in_progress → completed (no backwards transitions)
2. **Deletion Escape Hatch**: Any task can be deleted from any state, with full cleanup
3. **Hook-Based Validation**: Completion requires passing all registered validation hooks
4. **Auto-Assignment**: Tasks auto-assign owner when transitioning to in_progress in team mode
5. **Notification Integration**: Owner changes trigger team messages
6. **Atomic Operations**: File locking prevents race conditions during ID assignment
7. **Cascading Cleanup**: Task deletion removes all dependency references across ALL tasks

**The system prioritizes**:
- **Simplicity** over flexibility (linear state machine)
- **Extensibility** via hooks over hard-coded validation
- **Team coordination** via automatic notifications
- **Data integrity** via cleanup on deletion

**Key trade-off**: Simplicity comes at the cost of flexibility. Cannot "undo" completion or "release" claimed tasks without deletion.
