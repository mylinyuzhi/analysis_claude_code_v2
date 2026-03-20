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
            let _ = await zT8(A);
            if (Y > _) await P84(A, Y)
        }
        try {
            await j84(K)
        } catch (_) {
            if (_.code === "ENOENT") return !1;
            throw _
        }
        let z = await DX(A);
        for (let _ of z) {
            let w = _.blocks.filter(($) => $ !== q),
                O = _.blockedBy.filter(($) => $ !== q);
            if (w.length !== _.blocks.length || O.length !== _.blockedBy.length) await WI(A, _.id, {
                blocks: w,
                blockedBy: O
            })
        }
        return Gt(), !0
    } catch {
        return !1
    }
}

// READABLE (for understanding):
async function deleteTask(taskManager, taskId) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    try {
        const taskIdInt = parseInt(taskId, 10);
        if (!isNaN(taskIdInt)) {
            // STEP 0: Update high watermark if this task ID is higher
            const currentHighWaterMark = await readHighWaterMarkFile(taskManager);
            if (taskIdInt > currentHighWaterMark) {
                await writeHighWaterMark(taskManager, taskIdInt);
            }
        }

        // STEP 1: Delete the task file
        try {
            await deleteFile(taskFilePath);
        } catch (err) {
            if (err.code === "ENOENT") return false;  // File doesn't exist
            throw err;
        }

        // STEP 2: Clean up ALL dependency references in other tasks
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

        // STEP 3: Invalidate cache
        invalidateTaskCache();

        return true;
    } catch (error) {
        return false;
    }
}

// Mapping: sD1→deleteTask, A→taskManager, q→taskId, yF6→getTaskFilePath,
//          zT8→readHighWaterMarkFile, P84→writeHighWaterMark, j84→deleteFile,
//          DX→loadAllTasks, WI→updateTask, Gt→invalidateTaskCache

## Location References

- `chunks.84.mjs:1585` - `isTaskSystemEnabled` (r$) function.
- `chunks.84.mjs:1619` - `getTaskManager` (jf) definition.
- `chunks.84.mjs:1626` - `sanitizeTaskListId` (L06) function.
- `chunks.84.mjs:1630` - `getTaskDirectory` (wR) function.
- `chunks.84.mjs:1634` - `getTaskFilePath` (yF6) function.
- `chunks.84.mjs:1664` - `getHighWaterMark` (wN9) async function.
- `chunks.84.mjs:1669` - `createTask` (aD1) async function.
- `chunks.84.mjs:1687` - `loadTask` (DB) async function.
- `chunks.84.mjs:1701` - `updateTask` (WI) async function.
- `chunks.84.mjs:1713` - `deleteTask` (sD1) async function.
- `chunks.84.mjs:1742` - `loadAllTasks` (DX) async function.
- `chunks.84.mjs:1754` - `addTaskDependency` (_T8) async function.
- `chunks.84.mjs:1781` - `claimTask` (OT8) async function.
- `chunks.84.mjs:1831` - `claimTaskWithAgentBusyValidation` ($N9) async function.
- `chunks.84.mjs:1883` - `unassignTeammateTasks` (ft) async function.
- `chunks.84.mjs:1932` - `taskStatusSchema` (H36) and `taskSchema` (zN9) definitions.
- `chunks.90.mjs:2592` - Tool name constant TR = "TaskCreate".
- `chunks.90.mjs:2594` - Tool name constant ck = "TaskUpdate".
- `chunks.91.mjs:41` - Tool name constant lt = "TaskGet".
- `chunks.91.mjs:43` - Tool name constant it = "TaskList".
- `chunks.145.mjs:105-333` - TaskUpdate tool implementation (gAq).
- `chunks.144.mjs` - TaskCreate tool implementation.

---

## Tool Implementations

### TaskUpdate Tool Handler

// ============================================
// TaskUpdate Tool - Complete implementation with all branches
// Location: chunks.145.mjs:105-333
// ============================================

// ORIGINAL (for source lookup):
gAq = {
    name: ck,
    searchHint: "update a task",
    maxResultSizeChars: 1e5,
    async description() { return CAq },
    async prompt() { return IAq },
    get inputSchema() { return zbY() },
    get outputSchema() { return _bY() },
    userFacingName() { return "TaskUpdate" },
    shouldDefer: !0,
    isEnabled() { return r$() },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !1 },
    async checkPermissions(A) { return { behavior: "allow", updatedInput: A } },
    async call({
        taskId: A,
        subject: q,
        description: K,
        activeForm: Y,
        status: z,
        owner: _,
        addBlocks: w,
        addBlockedBy: O,
        metadata: $
    }, H) {
        let j = jf();
        // Expand task view in UI
        H.setAppState((P) => {
            if (P.expandedView === "tasks") return P;
            return { ...P, expandedView: "tasks" }
        });

        // Load current task
        let J = await DB(j, A);
        if (!J) return {
            data: { success: !1, taskId: A, updatedFields: [], error: "Task not found" }
        };

        let M = [], D = {};  // updatedFields, updates

        // Process subject
        if (q !== void 0 && q !== J.subject) D.subject = q, M.push("subject");
        // Process description
        if (K !== void 0 && K !== J.description) D.description = K, M.push("description");
        // Process activeForm
        if (Y !== void 0 && Y !== J.activeForm) D.activeForm = Y, M.push("activeForm");
        // Process owner
        if (_ !== void 0 && _ !== J.owner) D.owner = _, M.push("owner");

        // AUTO-ASSIGNMENT: In team mode, auto-assign owner on in_progress
        if (E7() && z === "in_progress" && _ === void 0 && !J.owner) {
            let P = i3();  // getCurrentAgentName
            if (P) D.owner = P, M.push("owner")
        }

        // Process metadata (merge, null deletes keys)
        if ($ !== void 0) {
            let P = { ...J.metadata ?? {} };
            for (let [W, Z] of Object.entries($))
                if (Z === null) delete P[W];
                else P[W] = Z;
            D.metadata = P, M.push("metadata")
        }

        // STATUS TRANSITIONS
        if (z !== void 0) {
            // BRANCH 1: Deletion
            if (z === "deleted") {
                let P = await sD1(j, A);  // deleteTask
                return {
                    data: {
                        success: P,
                        taskId: A,
                        updatedFields: P ? ["deleted"] : [],
                        error: P ? void 0 : "Failed to delete task",
                        statusChange: P ? { from: J.status, to: "deleted" } : void 0
                    }
                }
            }

            if (z !== J.status) {
                // BRANCH 2: Completion - run hooks
                if (z === "completed") {
                    let P = [],  // errors
                        W = Hi6(A, J.subject, J.description, i3(), l5(), void 0, H?.abortController?.signal, void 0, H);
                    for await (let Z of W)
                        if (Z.blockingError) P.push($i6(Z.blockingError));
                    if (P.length > 0) return {
                        data: { success: !1, taskId: A, updatedFields: [], error: P.join("\n") }
                    }
                }
                D.status = z, M.push("status")
            }
        }

        // Apply updates if any
        if (Object.keys(D).length > 0) await WI(j, A, D);

        // SEND NOTIFICATION on owner change in team mode
        if (D.owner && E7()) {
            let P = i3() || "team-lead",
                W = H$(),  // getCurrentAgentColor
                Z = JSON.stringify({
                    type: "task_assignment",
                    taskId: A,
                    subject: J.subject,
                    description: J.description,
                    assignedBy: P,
                    timestamp: new Date().toISOString()
                });
            await x3(D.owner, {  // writeToMailbox
                from: P,
                text: Z,
                timestamp: new Date().toISOString(),
                color: W
            }, j)
        }

        // Process addBlocks dependencies
        if (w && w.length > 0) {
            let P = w.filter((W) => !J.blocks.includes(W));
            for (let W of P) await _T8(j, A, W);  // addTaskDependency
            if (P.length > 0) M.push("blocks")
        }

        // Process addBlockedBy dependencies
        if (O && O.length > 0) {
            let P = O.filter((W) => !J.blockedBy.includes(W));
            for (let W of P) await _T8(j, W, A);
            if (P.length > 0) M.push("blockedBy")
        }

        return {
            data: {
                success: !0,
                taskId: A,
                updatedFields: M,
                statusChange: D.status !== void 0 ? { from: J.status, to: D.status } : void 0,
                verificationNudgeNeeded: !1
            }
        }
    }
}

// READABLE (for understanding):
const TaskUpdateTool = {
    name: "TaskUpdate",
    searchHint: "update a task",
    maxResultSizeChars: 100000,

    async description() {
        return getTaskUpdateDescription();
    },

    async prompt() {
        return TASK_UPDATE_PROMPT;  // Long-form instructions
    },

    get inputSchema() {
        return zod.strictObject({
            taskId: zod.string().describe("The ID of the task to update"),
            subject: zod.string().optional().describe("New subject for the task"),
            description: zod.string().optional().describe("New description for the task"),
            activeForm: zod.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
            status: zod.enum(["pending", "in_progress", "completed", "deleted"]).optional().describe("New status for the task"),
            addBlocks: zod.array(zod.string()).optional().describe("Task IDs that this task blocks"),
            addBlockedBy: zod.array(zod.string()).optional().describe("Task IDs that block this task"),
            owner: zod.string().optional().describe("New owner for the task"),
            metadata: zod.record(zod.string(), zod.unknown()).optional().describe("Metadata keys to merge into the task. Set a key to null to delete it.")
        });
    },

    get outputSchema() {
        return zod.object({
            success: zod.boolean(),
            taskId: zod.string(),
            updatedFields: zod.array(zod.string()),
            error: zod.string().optional(),
            statusChange: zod.object({
                from: zod.string(),
                to: zod.string()
            }).optional(),
            verificationNudgeNeeded: zod.boolean().optional()
        });
    },

    userFacingName() {
        return "TaskUpdate";
    },

    shouldDefer: true,
    isEnabled() { return isTaskSystemEnabled(); },
    isConcurrencySafe() { return true; },
    isReadOnly() { return false; },

    async checkPermissions(input) {
        // Task tools are auto-allowed
        return { behavior: "allow", updatedInput: input };
    },

    async call(params, toolUseContext) {
        const {
            taskId,
            subject,
            description,
            activeForm,
            status,
            owner,
            addBlocks,
            addBlockedBy,
            metadata
        } = params;

        const taskManager = getTaskManager();

        // STEP 1: Expand task view in UI
        toolUseContext.setAppState((state) => {
            if (state.expandedView === "tasks") return state;
            return { ...state, expandedView: "tasks" };
        });

        // STEP 2: Load current task
        const currentTask = await loadTask(taskManager, taskId);
        if (!currentTask) {
            return {
                data: {
                    success: false,
                    taskId: taskId,
                    updatedFields: [],
                    error: "Task not found"
                }
            };
        }

        const updatedFields = [];
        const updates = {};

        // STEP 3: Process scalar updates
        if (subject !== undefined && subject !== currentTask.subject) {
            updates.subject = subject;
            updatedFields.push("subject");
        }

        if (description !== undefined && description !== currentTask.description) {
            updates.description = description;
            updatedFields.push("description");
        }

        if (activeForm !== undefined && activeForm !== currentTask.activeForm) {
            updates.activeForm = activeForm;
            updatedFields.push("activeForm");
        }

        if (owner !== undefined && owner !== currentTask.owner) {
            updates.owner = owner;
            updatedFields.push("owner");
        }

        // STEP 4: Auto-assignment in team mode
        if (isInTeamMode() && status === "in_progress" && owner === undefined && !currentTask.owner) {
            const currentAgentName = getCurrentAgentName();
            if (currentAgentName) {
                updates.owner = currentAgentName;
                updatedFields.push("owner");
            }
        }

        // STEP 5: Process metadata (merge with null = delete)
        if (metadata !== undefined) {
            const mergedMetadata = { ...(currentTask.metadata ?? {}) };
            for (const [key, value] of Object.entries(metadata)) {
                if (value === null) {
                    delete mergedMetadata[key];
                } else {
                    mergedMetadata[key] = value;
                }
            }
            updates.metadata = mergedMetadata;
            updatedFields.push("metadata");
        }

        // STEP 6: Handle status transitions
        if (status !== undefined) {
            // BRANCH 6a: Deletion
            if (status === "deleted") {
                const deleted = await deleteTask(taskManager, taskId);
                return {
                    data: {
                        success: deleted,
                        taskId: taskId,
                        updatedFields: deleted ? ["deleted"] : [],
                        error: deleted ? undefined : "Failed to delete task",
                        statusChange: deleted ? {
                            from: currentTask.status,
                            to: "deleted"
                        } : undefined
                    }
                };
            }

            // BRANCH 6b: Status change (not deletion)
            if (status !== currentTask.status) {
                // COMPLETION: Run validation hooks
                if (status === "completed") {
                    const errors = [];

                    // Execute TaskCompleted hooks
                    const hookResults = executeTaskCompletedHooks(
                        taskId,
                        currentTask.subject,
                        currentTask.description,
                        getCurrentAgentName(),
                        getTeamName(),
                        undefined,
                        toolUseContext?.abortController?.signal,
                        undefined,
                        toolUseContext
                    );

                    // Collect blocking errors
                    for await (const result of hookResults) {
                        if (result.blockingError) {
                            errors.push(formatHookError(result.blockingError));
                        }
                    }

                    // If any hook blocked, reject completion
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

                updates.status = status;
                updatedFields.push("status");
            }
        }

        // STEP 7: Apply scalar updates
        if (Object.keys(updates).length > 0) {
            await updateTask(taskManager, taskId, updates);
        }

        // STEP 8: Send notification on owner change
        if (updates.owner && isInTeamMode()) {
            const assignerName = getCurrentAgentName() || "team-lead";
            const assignerColor = getCurrentAgentColor();

            const messagePayload = JSON.stringify({
                type: "task_assignment",
                taskId: taskId,
                subject: currentTask.subject,
                description: currentTask.description,
                assignedBy: assignerName,
                timestamp: new Date().toISOString()
            });

            await writeToMailbox(updates.owner, {
                from: assignerName,
                text: messagePayload,
                timestamp: new Date().toISOString(),
                color: assignerColor
            }, taskManager);
        }

        // STEP 9: Process addBlocks dependencies
        if (addBlocks && addBlocks.length > 0) {
            const newBlocks = addBlocks.filter(id => !currentTask.blocks.includes(id));
            for (const blockId of newBlocks) {
                await addTaskDependency(taskManager, taskId, blockId);
            }
            if (newBlocks.length > 0) {
                updatedFields.push("blocks");
            }
        }

        // STEP 10: Process addBlockedBy dependencies
        if (addBlockedBy && addBlockedBy.length > 0) {
            const newBlockedBy = addBlockedBy.filter(id => !currentTask.blockedBy.includes(id));
            for (const blockedById of newBlockedBy) {
                await addTaskDependency(taskManager, blockedById, taskId);
            }
            if (newBlockedBy.length > 0) {
                updatedFields.push("blockedBy");
            }
        }

        // STEP 11: Return success
        return {
            data: {
                success: true,
                taskId: taskId,
                updatedFields: updatedFields,
                statusChange: updates.status !== undefined ? {
                    from: currentTask.status,
                    to: updates.status
                } : undefined,
                verificationNudgeNeeded: false
            }
        };
    }
};

// Mapping: gAq→TaskUpdateTool, ck→TOOL_NAME_TASK_UPDATE, zbY→taskUpdateInputSchema,
//          _bY→taskUpdateOutputSchema, jf→getTaskManager, DB→loadTask, WI→updateTask,
//          sD1→deleteTask, Hi6→executeTaskCompletedHooks, $i6→formatHookError,
//          _T8→addTaskDependency, x3→writeToMailbox, E7→isInTeamMode, i3→getCurrentAgentName,
//          l5→getTeamName, H$→getCurrentAgentColor

---

### TaskCreate Tool Handler

// ============================================
// TaskCreate Tool - Create new task with auto-increment ID
// Location: chunks.144.mjs:2840-2990
// ============================================

// ORIGINAL (for source lookup):
TAq = {
    name: TR,
    searchHint: "create a new task",
    maxResultSizeChars: 1e5,
    async description() { return YAq },
    async prompt() { return VAq },
    get inputSchema() { return FbY() },
    get outputSchema() { return KbY() },
    userFacingName() { return "TaskCreate" },
    shouldDefer: !0,
    isEnabled() { return r$() },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !1 },
    async checkPermissions(A) { return { behavior: "allow", updatedInput: A } },
    async call({
        subject: A,
        description: q,
        activeForm: K,
        metadata: Y
    }, z) {
        let _ = jf();
        z.setAppState((O) => {
            if (O.expandedView === "tasks") return O;
            return { ...O, expandedView: "tasks" }
        });
        let w = await aD1(_, {
            subject: A,
            description: q,
            activeForm: K,
            status: "pending",
            metadata: Y
        });
        return {
            data: {
                success: !0,
                taskId: w,
                subject: A,
                description: q
            }
        }
    }
}

// READABLE (for understanding):
const TaskCreateTool = {
    name: "TaskCreate",
    searchHint: "create a new task",
    maxResultSizeChars: 100000,

    async description() {
        return getTaskCreateDescription();
    },

    async prompt() {
        return TASK_CREATE_PROMPT;
    },

    get inputSchema() {
        return zod.strictObject({
            subject: zod.string().describe("A brief title for the task"),
            description: zod.string().describe("A detailed description of what needs to be done"),
            activeForm: zod.string().optional()
                .describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
            metadata: zod.record(zod.string(), zod.unknown()).optional()
                .describe("Metadata keys to merge into the task")
        });
    },

    get outputSchema() {
        return zod.object({
            success: zod.boolean(),
            taskId: zod.string(),
            subject: zod.string(),
            description: zod.string()
        });
    },

    userFacingName() {
        return "TaskCreate";
    },

    shouldDefer: true,
    isEnabled() { return isTaskSystemEnabled(); },
    isConcurrencySafe() { return true; },
    isReadOnly() { return false; },

    async checkPermissions(input) {
        return { behavior: "allow", updatedInput: input };
    },

    async call(params, toolUseContext) {
        const { subject, description, activeForm, metadata } = params;
        const taskManager = getTaskManager();

        // Expand task view in UI
        toolUseContext.setAppState((state) => {
            if (state.expandedView === "tasks") return state;
            return { ...state, expandedView: "tasks" };
        });

        // Create task with auto-increment ID
        const taskId = await createTask(taskManager, {
            subject: subject,
            description: description,
            activeForm: activeForm,
            status: "pending",
            metadata: metadata
        });

        return {
            data: {
                success: true,
                taskId: taskId,
                subject: subject,
                description: description
            }
        };
    }
};

// Mapping: TAq→TaskCreateTool, TR→TOOL_NAME_TASK_CREATE, FbY→taskCreateInputSchema,
//          KbY→taskCreateOutputSchema, jf→getTaskManager, aD1→createTask, r$→isTaskSystemEnabled

---

### TaskGet Tool Handler

// ============================================
// TaskGet Tool - Retrieve full task details
// Location: chunks.144.mjs:2992-3040
// ============================================

// READABLE (for understanding):
const TaskGetTool = {
    name: "TaskGet",
    searchHint: "get task details",
    maxResultSizeChars: 100000,

    get inputSchema() {
        return zod.strictObject({
            taskId: zod.string().describe("The ID of the task to retrieve")
        });
    },

    get outputSchema() {
        return zod.object({
            success: zod.boolean(),
            task: zod.object({
                id: zod.string(),
                subject: zod.string(),
                description: zod.string(),
                activeForm: zod.string().optional(),
                status: zod.enum(["pending", "in_progress", "completed"]),
                owner: zod.string().optional(),
                blocks: zod.array(zod.string()),
                blockedBy: zod.array(zod.string()),
                metadata: zod.record(zod.string(), zod.unknown()).optional()
            }).optional(),
            error: zod.string().optional()
        });
    },

    userFacingName() {
        return "TaskGet";
    },

    shouldDefer: true,
    isEnabled() { return isTaskSystemEnabled(); },
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },

    async checkPermissions(input) {
        return { behavior: "allow", updatedInput: input };
    },

    async call(params, toolUseContext) {
        const { taskId } = params;
        const taskManager = getTaskManager();

        // Expand task view in UI
        toolUseContext.setAppState((state) => {
            if (state.expandedView === "tasks") return state;
            return { ...state, expandedView: "tasks" };
        });

        // Load task from disk
        const task = await loadTask(taskManager, taskId);

        if (!task) {
            return {
                data: {
                    success: false,
                    error: `Task ${taskId} not found`
                }
            };
        }

        return {
            data: {
                success: true,
                task: task
            }
        };
    }
};

// Mapping: hAq→TaskGetTool, lt→TOOL_NAME_TASK_GET, DB→loadTask

---

### TaskList Tool Handler

// ============================================
// TaskList Tool - List all tasks with filtered blockers
// Location: chunks.145.mjs:418-550
// ============================================

// ORIGINAL (for source lookup):
rAq = {
    name: it,
    searchHint: "list all tasks",
    maxResultSizeChars: 1e5,
    async description() { return UAq },
    async prompt() { return zAq },
    get inputSchema() { return JbY() },
    get outputSchema() { return QbY() },
    userFacingName() { return "TaskList" },
    shouldDefer: !0,
    isEnabled() { return r$() },
    isConcurrencySafe() { return !0 },
    isReadOnly() { return !0 },
    async checkPermissions(A) { return { behavior: "allow", updatedInput: A } },
    async call(A, q) {
        let K = jf();
        q.setAppState((Y) => {
            if (Y.expandedView === "tasks") return Y;
            return { ...Y, expandedView: "tasks" }
        });
        let Y = await DX(K),
            z = new Set(Y.filter((w) => w.status === "completed").map((w) => w.id));
        return {
            data: {
                tasks: Y.filter((w) => !w.metadata?._internal).map((w) => ({
                    id: w.id,
                    subject: w.subject,
                    status: w.status,
                    owner: w.owner,
                    blockedBy: w.blockedBy.filter((O) => !z.has(O))
                }))
            }
        }
    }
}

// READABLE (for understanding):
const TaskListTool = {
    name: "TaskList",
    searchHint: "list all tasks",
    maxResultSizeChars: 100000,

    get inputSchema() {
        return zod.strictObject({});  // No inputs needed
    },

    get outputSchema() {
        return zod.object({
            tasks: zod.array(zod.object({
                id: zod.string(),
                subject: zod.string(),
                status: zod.enum(["pending", "in_progress", "completed"]),
                owner: zod.string().optional(),
                blockedBy: zod.array(zod.string())
            }))
        });
    },

    userFacingName() {
        return "TaskList";
    },

    shouldDefer: true,
    isEnabled() { return isTaskSystemEnabled(); },
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },

    async checkPermissions(input) {
        return { behavior: "allow", updatedInput: input };
    },

    async call(params, toolUseContext) {
        const taskManager = getTaskManager();

        // Expand task view in UI
        toolUseContext.setAppState((state) => {
            if (state.expandedView === "tasks") return state;
            return { ...state, expandedView: "tasks" };
        });

        // Load all tasks
        const allTasks = await loadAllTasks(taskManager);

        // Build set of completed task IDs for blocker filtering
        const completedTaskIds = new Set(
            allTasks
                .filter(t => t.status === "completed")
                .map(t => t.id)
        );

        // Filter and transform tasks
        const tasks = allTasks
            // Exclude internal tasks (e.g., system-generated)
            .filter(task => !task.metadata?._internal)
            .map(task => ({
                id: task.id,
                subject: task.subject,
                status: task.status,
                owner: task.owner,
                // Only show incomplete blockers
                blockedBy: task.blockedBy.filter(id => !completedTaskIds.has(id))
            }));

        return {
            data: {
                tasks: tasks
            }
        };
    }
};

// Mapping: rAq→TaskListTool, it→TOOL_NAME_TASK_LIST, jf→getTaskManager, DX→loadAllTasks

**Key insight**: TaskList filters out:
1. **Internal tasks**: Tasks with `metadata._internal: true` (used for system operations)
2. **Completed blockers**: The `blockedBy` array only shows tasks that are still incomplete

### [Algorithm] Task Dependency Management

// ============================================
// addTaskDependency - Add bidirectional dependency between tasks
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
async function addTaskDependency(taskManager, taskId, dependencyId) {
    // Load both tasks in parallel for efficiency
    const [task, dependencyTask] = await Promise.all([
        loadTask(taskManager, taskId),
        loadTask(taskManager, dependencyId)
    ]);

    // Validate both tasks exist
    if (!task || !dependencyTask) {
        return false;
    }

    // Add dependencyId to task's blocks array (if not already present)
    if (!task.blocks.includes(dependencyId)) {
        await updateTask(taskManager, taskId, {
            blocks: [...task.blocks, dependencyId]
        });
    }

    // Add taskId to dependencyTask's blockedBy array (if not already present)
    if (!dependencyTask.blockedBy.includes(taskId)) {
        await updateTask(taskManager, dependencyId, {
            blockedBy: [...dependencyTask.blockedBy, taskId]
        });
    }

    return true;
}

// Mapping: _T8→addTaskDependency, A→taskManager, q→taskId, K→dependencyId,
//          DB→loadTask, WI→updateTask

**What it does**: Establishes a bidirectional dependency relationship between two tasks.

**How it works**:
1. Load both tasks in parallel using `Promise.all` for O(1) time efficiency
2. Validate both tasks exist (return false if either missing)
3. Add `dependencyId` to the first task's `blocks` array
4. Add `taskId` to the second task's `blockedBy` array
5. Returns `true` on success

**Why this approach**:
- **Bidirectional linking**: Both tasks track the relationship, enabling O(1) lookups in both directions
- **Idempotent**: Safe to call multiple times (checks for existence first)
- **Parallel loading**: Uses `Promise.all` to load both tasks concurrently

**Trade-offs**:
- **Two writes required**: Each dependency addition requires two separate file writes
- **No transaction**: If second write fails, first write persists (partial state)

---

### [Algorithm] High Watermark Management

// ============================================
// getHighWaterMark - Get the maximum task ID ever used
// Location: chunks.84.mjs:1664-1667
// ============================================

// ORIGINAL (for source lookup):
async function wN9(A) {
    let [q, K] = await Promise.all([W84(A), zT8(A)]);
    return Math.max(q, K)
}

// READABLE (for understanding):
async function getHighWaterMark(taskManager) {
    // Get max ID from existing task files
    const maxFileId = await getMaxTaskIdFromFiles(taskManager);

    // Get stored high watermark (from .highwatermark file)
    const storedHighWaterMark = await readHighWaterMarkFile(taskManager);

    // Return the maximum of both
    return Math.max(maxFileId, storedHighWaterMark);
}

// Mapping: wN9→getHighWaterMark, A→taskManager, W84→getMaxTaskIdFromFiles,
//          zT8→readHighWaterMarkFile

**What it does**: Determines the next available task ID by finding the maximum ID ever used.

**How it works**:
1. Scan all `.json` files in task directory, extract numeric IDs
2. Read stored `.highwatermark` file (for efficiency after initial scan)
3. Return `Math.max(fileScan, storedValue)` to handle edge cases

**Why this approach**:
- **Robustness**: Handles cases where `.highwatermark` file is missing or corrupted
- **No gaps**: IDs are always monotonically increasing
- **File-based recovery**: Can reconstruct high watermark from actual files

**Key insight**: The dual-source approach (files + stored value) ensures ID uniqueness even after crashes or manual file manipulation.

---

### [Algorithm] Cache Invalidation Strategy

// ============================================
// Cache invalidation on task operations
// Location: chunks.84.mjs (inferred from context)
// ============================================

// READABLE (for understanding):
// Global cache for loaded tasks (memoization)
let taskCache = new Map<string, Task>();

function invalidateTaskCache() {
    taskCache.clear();
}

// Called after:
// - createTask() - New task created
// - updateTask() - Task modified
// - deleteTask() - Task removed
// - addTaskDependency() - Dependency added (via updateTask)

**What it does**: Clears the in-memory task cache to force fresh reads from disk.

**Why this approach**:
- **Simplicity**: Clear entire cache rather than tracking individual changes
- **Correctness**: Ensures stale data is never returned
- **Performance trade-off**: Accepts potential performance hit for simplicity

**Alternative considered**: Fine-grained cache invalidation (only remove modified task)
- **Rejected because**: Complex to implement with dependency tracking
- **Also**: Task operations are relatively infrequent

---

### [Algorithm] Task File Path Resolution

// ============================================
// Path utilities for task storage
// Location: chunks.84.mjs:1626-1636
// ============================================

// ORIGINAL (for source lookup):
function L06(A) {
    return A.replace(/[^a-zA-Z0-9_-]/g, "-")
}
function wR(A) {
    return kF6(c8(), "tasks", L06(A))
}
function yF6(A, q) {
    return kF6(wR(A), `${L06(q)}.json`)
}

// READABLE (for understanding):
function sanitizeTaskListId(taskListId) {
    // Remove any characters that could cause filesystem issues
    return taskListId.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function getTaskDirectory(taskManager) {
    // ~/.claude/tasks/{sanitized-task-manager-id}/
    return path.join(getClaudeHome(), "tasks", sanitizeTaskListId(taskManager));
}

function getTaskFilePath(taskManager, taskId) {
    // ~/.claude/tasks/{task-manager}/{task-id}.json
    return path.join(getTaskDirectory(taskManager), `${sanitizeTaskListId(taskId)}.json`);
}

// Mapping: L06→sanitizeTaskListId, wR→getTaskDirectory, yF6→getTaskFilePath,
//          kF6→path.join, c8→getClaudeHome

**What it does**: Generates safe filesystem paths for task storage.

**How it works**:
1. `sanitizeTaskListId`: Replace unsafe characters with `-`
2. `getTaskDirectory`: Build path `~/.claude/tasks/{sanitized-id}/`
3. `getTaskFilePath`: Build path `~/.claude/tasks/{manager}/{id}.json`

**Why this approach**:
- **Cross-platform compatibility**: Handles team names with special characters
- **No path traversal**: Prevents `../../../` attacks
- **Predictable structure**: Easy to locate tasks for any manager

**Example paths**:
```
~/.claude/tasks/team-alpha/1.json      # Team task
~/.claude/tasks/agent-123/5.json       # Solo agent task
~/.claude/tasks/my-feature-branch/2.json  # Branch-specific tasks
```

---

### [Algorithm] Task System Enablement Check

// ============================================
// isTaskSystemEnabled - Check if structured tasks are enabled
// Location: chunks.84.mjs:1585-1588
// ============================================

// ORIGINAL (for source lookup):
function r$() {
    if (t6(process.env.CLAUDE_CODE_ENABLE_TASKS)) return !0;
    return !q7()
}

// READABLE (for understanding):
function isTaskSystemEnabled() {
    // Explicit enable via environment variable
    if (parseBoolean(process.env.CLAUDE_CODE_ENABLE_TASKS)) {
        return true;
    }

    // Default: enabled unless running in non-interactive mode
    return !isNonInteractiveSession();
}

// Mapping: r$→isTaskSystemEnabled, t6→parseBoolean, q7→isNonInteractiveSession

**What it does**: Determines whether the structured task system is available.

**How it works**:
1. Check `CLAUDE_CODE_ENABLE_TASKS` environment variable for explicit override
2. Default to enabled in interactive sessions, disabled in non-interactive (SDK mode)

**Why this approach**:
- **Opt-in for SDK**: SDK users typically want simpler TodoWrite
- **Backward compatibility**: Non-interactive sessions default to old behavior
- **Override support**: Can force enable for testing

---

## Lock Mechanism Details

### File Locking for Concurrency Control

The task system uses file-based locking (`EF6.lock`) to prevent race conditions:

// ============================================
// Lock acquisition pattern (from createTask)
// Location: chunks.84.mjs:1669-1684
// ============================================

// READABLE (for understanding):
async function withLock<T>(
    lockFilePath: string,
    operation: () => Promise<T>
): Promise<T> {
    let unlock;
    try {
        // Acquire lock (blocks until available)
        unlock = await lockfile.lock(lockFilePath, {
            retries: {
                retries: 10,
                minTimeout: 5,
                maxTimeout: 100
            }
        });

        // Execute critical section
        return await operation();
    } finally {
        // Always release lock
        if (unlock) await unlock();
    }
}

**Lock configuration** (from chunks.84.mjs:1942-1948):
```javascript
const lockOptions = {
    retries: {
        retries: 10,      // Try 10 times
        minTimeout: 5,    // Min 5ms between retries
        maxTimeout: 100   // Max 100ms between retries
    }
};
```

**Why this approach**:
- **Cross-process safety**: Works between different Claude processes
- **Retry mechanism**: Handles transient lock contention
- **Automatic cleanup**: `finally` block ensures lock release on error