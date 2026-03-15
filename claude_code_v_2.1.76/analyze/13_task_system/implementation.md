# Task System Implementation

## Overview

The Task System in Claude Code v2.1.76 is a robust replacement for the earlier `TodoList`. It is designed to support both single-agent and multi-agent workflows, introducing task ownership, dependencies (blocking/blockedBy), and persistent team-based storage.

## Key Tools

The system exposes four primary tools to the agent:

1. **TaskCreate** (`tc4` / `Nh`): Initializes a new task with a subject, description, and UI-friendly `activeForm`.
2. **TaskGet** (`$l4` / `NK1`): Retrieves full task details, including dependency lists.
3. **TaskUpdate** (`Wl4` / `DR`): The most versatile tool. Used to:
   - Change status (`pending` -> `in_progress` -> `completed`).
   - Assign/Change ownership (`owner`).
   - Manage dependencies (`addBlocks`, `addBlockedBy`).
   - Delete tasks.
4. **TaskList** (`Ll4` / `TK1`): Provides a summary view of all tasks, including which are blocked and who owns them.

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
1. When a task is updated (`Wl4`), the system retrieves the global `TaskManager` (`WM`).
2. It validates the state transition. For example, marking a task `completed` triggers a check for blocked tasks.
3. If the task has an owner and the caller is the lead, a "task_assignment" message is automatically sent to the owner's inbox (`chunks.141.mjs:152`).
4. Updates are persisted to disk at `~/.claude/tasks/{team-name}/`.

## Code Snippets

// ============================================
// updateTaskState - Core logic for TaskUpdate tool
// Location: chunks.141.mjs:70-191
// ============================================

// ORIGINAL (for source lookup):
async call({ taskId: A, subject: q, status: z, owner: w, ... }, _) {
    let J = WM();
    let X = lg(J, A);
    if (!X) return { data: { success: !1, error: "Task not found" } };
    
    let updates = {};
    if (q !== void 0) updates.subject = q;
    if (w !== void 0) updates.owner = w;
    if (z !== void 0) {
        if (z === "completed") {
            // ... blocking checks ...
        }
        updates.status = z;
    }
    
    if (Object.keys(updates).length > 0) JS(J, A, updates);
    
    if (updates.owner && l8()) {
        deliverAssignmentMessage(updates.owner, ...);
    }
    return { data: { success: !0, taskId: A, updatedFields: Object.keys(updates) } };
}

// READABLE (for understanding):
async function callTaskUpdate(input, context) {
    const taskManager = getTaskManager();
    const task = findTaskById(taskManager, input.taskId);
    if (!task) return { data: { success: false, error: "Task not found" } };

    const updates = {};
    if (input.subject !== undefined) updates.subject = input.subject;
    if (input.owner !== undefined) updates.owner = input.owner;
    
    if (input.status !== undefined) {
        if (input.status === "completed") {
            // Validate if all blocking conditions are met
            await validateCompletion(task);
        }
        updates.status = input.status;
    }

    if (Object.keys(updates).length > 0) {
        applyTaskUpdates(taskManager, input.taskId, updates);
    }

    // Auto-notify teammate of new assignment
    if (updates.owner && isInTeamMode()) {
        notifyTeammate(updates.owner, {
            type: "task_assignment",
            taskId: input.taskId,
            subject: task.subject
        });
    }

    return { data: { success: true, taskId: input.taskId } };
}

// Mapping: WM→getTaskManager, lg→findTaskById, JS→applyTaskUpdates, l8→isInTeamMode, f9→notifyTeammate

## Related Symbols

- `TaskCreate` (`tc4`) - Create tool.
- `TaskUpdate` (`Wl4`) - Update tool.
- `getTaskManager` (`WM`) - State access.
- `findTaskById` (`lg`) - Lookup utility.

## Location References

- `chunks.140.mjs:2806` - `TaskCreate` definition.
- `chunks.140.mjs:2953` - `TaskGet` definition.
- `chunks.141.mjs:32` - `TaskUpdate` definition.
- `chunks.141.mjs:299` - `TaskList` definition.
