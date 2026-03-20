# Task System - Team Integration Analysis

## Module Overview

This document analyzes how the task system integrates with the agent teams feature (Module 30) to enable multi-agent task coordination, ownership, and collaboration patterns.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Task system and agent teams
> - [30_agent_teams/](../30_agent_teams/) - Full agent teams analysis

Key functions in this document:
- `claimTask` (OT8) - Atomically claim unassigned task
- `claimTaskWithAgentBusyValidation` ($N9) - Claim with agent busy validation
- `writeToMailbox` (x3) - Send task_assignment notifications
- `isInTeamMode` (E7) - Check if running in team context
- `unassignTeammateTasks` (ft) - Cleanup on agent shutdown
- `getCurrentAgentName` (i3) - Get executing agent ID
- `getTaskManager` (jf) - Get task list context
- `loadAllTasks` (DX) - Load all tasks
- `updateTask` (WI) - Update task

---

## 1. Team Context and Task Isolation

### 1.1 Team-Based Task Storage

Each team maintains its own isolated task directory:

```
~/.claude/tasks/
├── team-alpha/
│   ├── 1.json          (Task owned by agent-a)
│   ├── 2.json          (Task owned by agent-b)
│   ├── .highwatermark  (Max ID: 2)
│   └── .lock           (Concurrency control)
├── team-beta/
│   ├── 1.json          (Different task, same ID)
│   └── .highwatermark
└── solo-agent-id/      (Non-team agent)
    └── 1.json
```

// ============================================
// getTaskManager - Team-aware task directory resolution
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
    // Returns: currentAgentName || defaultAgentId || sessionId
    return getTeamName() || DEFAULT_AGENT_ID || getSessionId();
}

// Mapping:
// jf → getTaskManager
// iM → getTeamContext
// A → teamContext
// l5 → getTeamName
// VF6 → DEFAULT_AGENT_ID
// R1 → getSessionId

**What it does**: Determines which task directory to use based on team context.

**How it works**:
1. Check for explicit override (useful for testing/debugging)
2. Check if running in team mode:
   - Get team context from team manager
   - Extract team name
   - Use team name as directory identifier
3. Fall back to solo mode:
   - Use agent's own ID as directory
   - Each solo agent has isolated task list

**Why this approach**:
- **Isolation**: Teams don't interfere with each other's tasks
- **Flexibility**: Same agent can participate in multiple teams (different sessions)
- **Override support**: Can force specific task list via env var

**Example**:
```javascript
// Team "frontend-team" creates task
TeamCreate({ name: "frontend-team" });
TaskCreate({ subject: "Add login button" });
// Creates: ~/.claude/tasks/frontend-team/1.json

// Team "backend-team" creates task
TeamCreate({ name: "backend-team" });
TaskCreate({ subject: "Add login button" });
// Creates: ~/.claude/tasks/backend-team/1.json

// Different tasks, same subject, isolated by team
```

---

### 1.2 Team Context Detection

// ============================================
// isInTeamMode - Check if running in team context
// Location: chunks.50.mjs:2543 (E7 function)
// ============================================

// READABLE (for understanding):
function isInTeamMode() {
    const teamContext = getTeamContext();
    return teamContext !== null && teamContext !== undefined;
}

**Used throughout task system to enable team-specific features**:
- Auto-assignment on `in_progress` transition
- Task assignment notifications
- Claiming with busy-check
- Agent shutdown cleanup

---

## 2. Task Claiming and Ownership

### 2.1 Basic Claim Algorithm

// ============================================
// claimTask - Atomically claim an unassigned task
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
        return {
            success: !0,
            task: await WI(A, q, {
                owner: K
            })
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
async function claimTask(taskManager, taskId, agentName, options = {}) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    // Early check: does task exist?
    if (!await loadTask(taskManager, taskId)) {
        return { success: false, reason: "task_not_found" };
    }

    // Delegate to busy-check variant if requested
    if (options.checkAgentBusy) {
        return claimTaskWithAgentBusyValidation(taskManager, taskId, agentName);
    }

    let unlock;
    try {
        // Acquire lock (async, with retries)
        unlock = await lockfile.lock(taskFilePath, lockOptions);

        // Re-load task after lock acquired (might have changed)
        const task = await loadTask(taskManager, taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // VALIDATION 1: Already owned by different agent?
        if (task.owner && task.owner !== agentName) {
            return {
                success: false,
                reason: "already_claimed",
                task: task
            };
        }

        // VALIDATION 2: Already completed?
        if (task.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task: task
            };
        }

        // VALIDATION 3: Blocked by incomplete dependencies?
        const allTasks = await loadAllTasks(taskManager);
        const incompleteTaskIds = new Set(
            allTasks
                .filter(t => t.status !== "completed")
                .map(t => t.id)
        );
        const activeBlockers = task.blockedBy.filter(id => incompleteTaskIds.has(id));

        if (activeBlockers.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task: task,
                blockedByTasks: activeBlockers
            };
        }

        // ALL VALIDATIONS PASSED - Claim the task
        return {
            success: true,
            task: await updateTask(taskManager, taskId, { owner: agentName })
        };

    } catch (error) {
        debug(`[Tasks] Failed to claim task ${taskId}: ${formatError(error)}`);
        logError(error);
        return { success: false, reason: "task_not_found" };
    } finally {
        // ALWAYS release lock
        if (unlock) await unlock();
    }
}

// Mapping:
// OT8 → claimTask
// A → taskManager
// q → taskId
// K → agentName
// Y → options
// yF6 → getTaskFilePath
// DB → loadTask
// EF6.lock → lockfile.lock
// DX → loadAllTasks
// WI → updateTask
// $N9 → claimTaskWithAgentBusyValidation
// nD1 → lockOptions

**What it does**: Atomically claims an unassigned task after validating eligibility.

**How it works**:

**Phase 1 - Quick Check**:
- Check if task file exists on disk
- Early exit if not (avoids locking non-existent task)

**Phase 2 - Acquire Lock**:
- Lock the specific task file (not entire directory)
- Allows concurrent claims of different tasks
- Blocks if another agent is claiming same task

**Phase 3 - Validation**:
1. **Load task**: Read from disk, validate schema
2. **Ownership check**: Reject if already owned by different agent
3. **Status check**: Reject if already completed
4. **Blocker check**:
   - Load ALL tasks from disk
   - Build set of incomplete task IDs
   - Filter task's `blockedBy` array to only incomplete tasks
   - Reject if any active blockers exist

**Phase 4 - Claim**:
- Update task with `owner: agentName`
- Write to disk
- Return success with updated task

**Why this approach**:
- **Atomic**: Lock ensures no race conditions during claim
- **Complete validation**: Checks all failure scenarios before modification
- **Efficient**: Uses Set for O(1) blocker lookup
- **Early exits**: Fails fast on invalid claims

**Trade-offs**:
- **Full task scan**: Loads ALL tasks to check blockers (O(N))
- **File-level locking**: Only works on single machine
- **No reservation**: Can't "reserve" task for future claim

---

### 2.2 Busy-Check Variant

// ============================================
// claimTaskWithAgentBusyValidation - Prevent multi-tasking
// Location: chunks.84.mjs:1831-1881
// ============================================

// ORIGINAL (for source lookup):
async function $N9(A, q, K) {
    let Y = await wT8(A), z;
    try {
        z = await EF6.lock(Y, nD1);
        let _ = await DX(A), w = _.find((J) => J.id === q);
        if (!w) return { success: !1, reason: "task_not_found" };
        if (w.owner && w.owner !== K) return { success: !1, reason: "already_claimed", task: w };
        if (w.status === "completed") return { success: !1, reason: "already_resolved", task: w };
        let O = new Set(_.filter((J) => J.status !== "completed").map((J) => J.id)),
            $ = w.blockedBy.filter((J) => O.has(J));
        if ($.length > 0) return {
            success: !1,
            reason: "blocked",
            task: w,
            blockedByTasks: $
        };
        let H = _.filter((J) => J.status !== "completed" && J.owner === K && J.id !== q);
        if (H.length > 0) return {
            success: !1,
            reason: "agent_busy",
            task: w,
            busyWithTasks: H.map((J) => J.id)
        };
        return {
            success: !0,
            task: await WI(A, q, { owner: K })
        }
    } catch (_) {
        return k(`[Tasks] Failed to claim task ${q} with busy check: ${_1(_)}`), _6(_), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (z) await z()
    }
}

// READABLE (for understanding):
async function claimTaskWithAgentBusyValidation(taskManager, taskId, agentName) {
    const lockFilePath = await getLockFilePath(taskManager);
    let unlock;

    try {
        // Acquire GLOBAL lock (not task-specific)
        unlock = await lockfile.lock(lockFilePath, lockOptions);

        // Load ALL tasks
        const allTasks = await loadAllTasks(taskManager);
        const task = allTasks.find(t => t.id === taskId);

        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // VALIDATION 1: Already owned by different agent?
        if (task.owner && task.owner !== agentName) {
            return {
                success: false,
                reason: "already_claimed",
                task: task
            };
        }

        // VALIDATION 2: Already completed?
        if (task.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task: task
            };
        }

        // VALIDATION 3: Blocked by incomplete dependencies?
        const incompleteTaskIds = new Set(
            allTasks.filter(t => t.status !== "completed").map(t => t.id)
        );
        const activeBlockers = task.blockedBy.filter(id => incompleteTaskIds.has(id));

        if (activeBlockers.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task: task,
                blockedByTasks: activeBlockers
            };
        }

        // VALIDATION 4: Is agent already busy with other tasks?
        const agentOwnedIncompleteTasks = allTasks.filter(t =>
            t.status !== "completed" &&
            t.owner === agentName &&
            t.id !== taskId  // Exclude the task being claimed
        );

        if (agentOwnedIncompleteTasks.length > 0) {
            return {
                success: false,
                reason: "agent_busy",
                task: task,
                busyWithTasks: agentOwnedIncompleteTasks.map(t => t.id)
            };
        }

        // ALL VALIDATIONS PASSED - Claim the task
        return {
            success: true,
            task: await updateTask(taskManager, taskId, { owner: agentName })
        };

    } catch (error) {
        debug(`[Tasks] Failed to claim task ${taskId} with busy check: ${formatError(error)}`);
        logError(error);
        return { success: false, reason: "task_not_found" };
    } finally {
        if (unlock) await unlock();
    }
}

// Mapping: $N9→claimTaskWithAgentBusyValidation, A→taskManager, q→taskId, K→agentName,
//          wT8→getLockFilePath, EF6.lock→lockfile.lock, DX→loadAllTasks, WI→updateTask

**Additional validation**: Prevents agent from claiming multiple tasks concurrently.

**Use case**: Team lead wants agents to focus on one task at a time.

**Example**:
```javascript
// Agent already owns task #5 (in_progress)
await claimTask(taskManager, "7", "agent-a", { checkAgentBusy: true });

// Returns:
{
    success: false,
    reason: "agent_busy",
    task: {...},
    busyWithTasks: ["5"]
}
```

---

## 3. Task Assignment Notifications

### 3.1 Assignment Message Protocol

// ============================================
// Task assignment notification sender
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

    // Build JSON payload with task details
    const assignmentPayload = JSON.stringify({
        type: "task_assignment",
        taskId: taskId,
        subject: currentTask.subject,
        description: currentTask.description,
        assignedBy: assignerName,
        timestamp: new Date().toISOString()
    });

    // Send via team messaging system
    sendTeamMessage(updates.owner, {
        from: assignerName,
        text: assignmentPayload,
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
// M → assignerName
// P → assignerColor
// W → assignmentPayload
// J → taskManager

**What it does**: Sends a formatted team message to the newly assigned agent.

**How it works**:
1. Check if owner changed AND in team mode
2. Get assigner's name and color (for visual distinction in UI)
3. Build JSON message with:
   - Message type identifier ("task_assignment")
   - Complete task details (ID, subject, description)
   - Assignment metadata (who assigned, when)
4. Send via `sendTeamMessage()` which:
   - Routes to owner's inbox file: `~/.claude/teams/{teamName}/agents/{ownerName}/inbox.jsonl`
   - Appends message as JSONL line
   - Owner reads on next poll

**Message schema**:
```javascript
{
    from: "team-lead",           // Sender's name
    text: "{...json...}",        // Stringified payload (see below)
    timestamp: "2024-02-14...",  // Send time
    color: "#FF5733"            // Sender's color
}
```

**Nested payload** (inside `text` field):
```javascript
{
    type: "task_assignment",
    taskId: "5",
    subject: "Implement login",
    description: "Add OAuth 2.0 login with Google provider",
    assignedBy: "team-lead",
    timestamp: "2024-02-14T10:30:00.000Z"
}
```

---

### 3.2 Message Consumption by Teammate

**Receiving end** (in agent loop):

1. **Poll inbox**: Periodically read `inbox.jsonl` file
2. **Parse messages**: Split by newline, parse each JSON object
3. **Type dispatch**: Check `type` field in nested payload
4. **Task assignment handling**:
```javascript
const message = JSON.parse(inboxLine);
const payload = JSON.parse(message.text);

if (payload.type === "task_assignment") {
    // Show notification to agent
    console.log(`\n[TASK ASSIGNED] #${payload.taskId}: ${payload.subject}`);
    console.log(`Assigned by: ${payload.assignedBy}`);
    console.log(`Description: ${payload.description}\n`);

    // Optionally: Auto-start working on task
    if (autoAcceptTasks) {
        await TaskUpdate({ taskId: payload.taskId, status: "in_progress" });
    }
}
```

**Why JSON-in-JSON**:
- **Extensibility**: Can add new message types without changing envelope format
- **Backward compatibility**: Old agents ignore unknown message types
- **Routing flexibility**: Envelope handles delivery, payload handles semantics

---

## 4. Agent Shutdown and Task Cleanup

### 4.1 Automatic Task Unassignment

// ============================================
// unassignTeammateTasks - Clean up on agent shutdown
// Location: chunks.84.mjs:1883-1901
// ============================================

// ORIGINAL (for source lookup):
async function ft(A, q, K, Y) {
    let _ = (await DX(A)).filter(($) => $.status !== "completed" && ($.owner === q || $.owner === K));
    for (let $ of _) await WI(A, $.id, {
        owner: void 0,
        status: "pending"
    });
    if (_.length > 0) k(`[Tasks] Unassigned ${_.length} task(s) from ${K}`);
    let O = `${K} ${Y==="terminated"?"was terminated":"has shut down"}.`;
    if (_.length > 0) {
        let $ = _.map((H) => `#${H.id} "${H.subject}"`).join(", ");
        O += ` ${_.length} task(s) were unassigned: ${$}. Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`
    }
    return {
        unassignedTasks: _.map(($) => ({
            id: $.id,
            subject: $.subject
        })),
        notificationMessage: O
    }
}

// READABLE (for understanding):
async function unassignTeammateTasks(taskManager, oldAgentId, agentName, shutdownReason) {
    // Find all incomplete tasks owned by the shutting-down agent
    const allTasks = await loadAllTasks(taskManager);
    const agentTasks = allTasks.filter(task =>
        task.status !== "completed" &&
        (task.owner === oldAgentId || task.owner === agentName)
    );

    // Unassign and reset all found tasks
    for (const task of agentTasks) {
        await updateTask(taskManager, task.id, {
            owner: undefined,    // Remove ownership
            status: "pending"    // Reset to pending
        });
    }

    // Log the cleanup
    if (agentTasks.length > 0) {
        debug(`[Tasks] Unassigned ${agentTasks.length} task(s) from ${agentName}`);
    }

    // Build notification message for team lead
    const shutdownMessage = shutdownReason === "terminated"
        ? `${agentName} was terminated.`
        : `${agentName} has shut down.`;

    let notificationMessage = shutdownMessage;

    if (agentTasks.length > 0) {
        const taskList = agentTasks
            .map(t => `#${t.id} "${t.subject}"`)
            .join(", ");
        notificationMessage += ` ${agentTasks.length} task(s) were unassigned: ${taskList}. Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`;
    }

    return {
        unassignedTasks: agentTasks.map(t => ({
            id: t.id,
            subject: t.subject
        })),
        notificationMessage: notificationMessage
    };
}

// Mapping:
// ft → unassignTeammateTasks
// A → taskManager
// q → oldAgentId
// K → agentName
// Y → shutdownReason
// _ → agentTasks
// DX → loadAllTasks
// WI → updateTask

**What it does**: Automatically unassigns tasks when a teammate agent shuts down or is terminated.

**How it works**:

**Phase 1 - Find Affected Tasks**:
1. Load all tasks
2. Filter to tasks owned by shutting-down agent
3. Exclude already-completed tasks (no need to unassign)

**Phase 2 - Reset Tasks**:
1. For each affected task:
   - Set `owner: undefined`
   - Set `status: "pending"`
2. Write updates to disk

**Phase 3 - Notification**:
1. Build human-readable message
2. Include shutdown reason (normal vs terminated)
3. List all unassigned tasks
4. Return for team lead to display

**Why this approach**:
- **Automatic cleanup**: No manual intervention needed
- **Task preservation**: Tasks are reset, not deleted
- **Team visibility**: Other agents immediately see tasks are available
- **Status reset**: Ensures tasks don't stay "in_progress" with no owner

**Example flow**:
```
Team: frontend-team
- Agent A: owns tasks #3, #5 (both in_progress)
- Agent B: owns task #7 (in_progress)

Agent A crashes unexpectedly
↓
unassignTeammateTasks() called
↓
Tasks #3, #5 → owner: undefined, status: "pending"
↓
Team lead receives:
"agent-a was terminated. 2 task(s) were unassigned: #3 "Add button", #5 "Fix CSS""
↓
TaskList now shows #3, #5 as available
↓
Agent B (or Agent C) can claim them
```

---

## 5. Team Coordination Patterns

### 5.1 Lead-Directed Assignment Pattern

**Team Lead** (typically the main agent):
1. Creates tasks representing work to be done
2. Explicitly assigns tasks to teammates via TaskUpdate
3. Monitors progress via TaskList
4. Handles task failures and reassignments

```javascript
// Lead agent workflow
const taskId = await TaskCreate({
    subject: "Implement login UI",
    description: "Create React components for login form"
});

// Assign to frontend specialist
await TaskUpdate({
    taskId: taskId,
    owner: "frontend-agent"
});
// → Triggers task_assignment message to frontend-agent

// Later: Check progress
const { tasks } = await TaskList();
const loginTask = tasks.find(t => t.id === taskId);
console.log(`Login UI: ${loginTask.status} (owner: ${loginTask.owner})`);
```

**Teammate** (receives assignment):
1. Polls inbox for task_assignment messages
2. Reads task details from message
3. Starts work by transitioning to in_progress
4. Marks complete when done

```javascript
// Frontend agent polls inbox
const inbox = readInbox();
for (const message of inbox) {
    const payload = JSON.parse(message.text);
    if (payload.type === "task_assignment") {
        console.log(`New task: ${payload.subject}`);

        // Start working
        await TaskUpdate({
            taskId: payload.taskId,
            status: "in_progress"
        });
        // Auto-assigns owner: "frontend-agent"

        // Do the work...
        await implementLoginUI();

        // Mark complete
        await TaskUpdate({
            taskId: payload.taskId,
            status: "completed"
        });
    }
}
```

---

### 5.2 Self-Service Claim Pattern

**Lead agent**:
1. Creates multiple tasks without assigning
2. Leaves tasks in "pending" state
3. Teammates pull work as they become available

```javascript
// Lead creates work queue
await TaskCreate({ subject: "Write test for login" });
await TaskCreate({ subject: "Write test for signup" });
await TaskCreate({ subject: "Write test for logout" });
// All remain: status="pending", owner=undefined
```

**Teammate** (self-assigns):
1. Queries available tasks via TaskList
2. Filters for unowned, unblocked tasks
3. Claims task atomically
4. Starts work

```javascript
// Tester agent looks for work
const { tasks } = await TaskList();
const availableTasks = tasks.filter(t =>
    t.status === "pending" &&
    !t.owner &&
    t.blockedBy.length === 0  // Not blocked
);

if (availableTasks.length > 0) {
    const task = availableTasks[0];

    // Claim the task
    const claimResult = await claimTask(
        taskManager,
        task.id,
        "tester-agent",
        { checkAgentBusy: true }
    );

    if (claimResult.success) {
        // Start working
        await TaskUpdate({
            taskId: task.id,
            status: "in_progress"
        });
        // Work proceeds...
    }
}
```

**Trade-offs**:

| Pattern | Pros | Cons |
|---------|------|------|
| **Lead-Directed** | Explicit control<br/>Optimal assignment<br/>Clear accountability | Requires lead to know teammate capabilities<br/>Lead becomes bottleneck |
| **Self-Service** | Scalable (no bottleneck)<br/>Teammates pull at their own pace<br/>Simple for lead | No optimization<br/>Race conditions on popular tasks<br/>Load balancing challenges |

---

### 5.3 Dependency-Based Parallel Execution

**Scenario**: Multi-step workflow with dependencies

```javascript
// Lead creates task graph
const designId = await TaskCreate({
    subject: "Design login UI mockup"
});

const implementId = await TaskCreate({
    subject: "Implement login UI"
});

const testId = await TaskCreate({
    subject: "Write login UI tests"
});

// Set dependencies: design → implement → test
await TaskUpdate({
    taskId: designId,
    addBlocks: [implementId]  // Design blocks implementation
});

await TaskUpdate({
    taskId: implementId,
    addBlocks: [testId]  // Implementation blocks testing
});

// Assign to specialists
await TaskUpdate({ taskId: designId, owner: "designer-agent" });
await TaskUpdate({ taskId: implementId, owner: "developer-agent" });
await TaskUpdate({ taskId: testId, owner: "tester-agent" });
```

**Execution flow**:
```
T0: designer-agent starts on designId
    - implementId: blocked by designId (can't start)
    - testId: blocked by implementId (can't start)

T1: designer-agent completes designId
    - implementId: unblocked! developer-agent can start
    - testId: still blocked by implementId

T2: developer-agent starts on implementId
    - testId: still blocked by implementId

T3: developer-agent completes implementId
    - testId: unblocked! tester-agent can start

T4: tester-agent completes testId
    - All tasks done!
```

**Validation at claim time**:
```javascript
// Tester agent tries to claim testId at T0
const claimResult = await claimTask(taskManager, testId, "tester-agent");

// Returns:
{
    success: false,
    reason: "blocked",
    task: { id: testId, blockedBy: [implementId] },
    blockedByTasks: [implementId]  // Still incomplete
}
```

---

## 6. Conflict Resolution

### 6.1 Double-Claim Race Condition

**Scenario**: Two agents try to claim same task simultaneously

```
Agent A:                          Agent B:
   |                                 |
   |-- claimTask(taskId: "5")        |
   |   Lock acquired                 |
   |   Load task (owner: null)       |
   |                                 |-- claimTask(taskId: "5")
   |                                 |   Lock waiting...
   |                                 |
   |   Validations pass              |
   |   Update: owner="A"             |
   |   Write to disk                 |
   |   Release lock                  |
   |                                 |
   |                                 |   Lock acquired
   |                                 |   Load task (owner: "A")  ← Now owned!
   |                                 |   Validation fails
   |                                 |   Return: { success: false, reason: "already_claimed" }
   |                                 |   Release lock
```

**Result**: Agent A wins (first to acquire lock), Agent B is rejected.

**Agent B's response**:
```javascript
if (claimResult.reason === "already_claimed") {
    // Task already taken, find another task
    const otherTasks = availableTasks.filter(t => t.id !== "5");
    // ... try claiming different task
}
```

---

### 6.2 Ownership Transfer

**Scenario**: Lead wants to reassign task from Agent A to Agent B

```javascript
// Current state: Task #7 owned by agent-a (in_progress)

// Lead reassigns
await TaskUpdate({
    taskId: "7",
    owner: "agent-b"
});

// Result:
// - Task #7: owner="agent-b", status="in_progress" (unchanged)
// - agent-b receives task_assignment message
// - agent-a receives NO notification (continues working unaware!)
```

**Issue**: No automatic notification to previous owner.

**Workaround**: Lead should manually message agent-a:
```javascript
await sendTeamMessage("agent-a", {
    from: "team-lead",
    text: JSON.stringify({
        type: "task_unassignment",
        taskId: "7",
        reason: "Reassigned to agent-b"
    }),
    timestamp: new Date().toISOString()
});
```

---

## 7. Performance Considerations

### 7.1 Task Listing Scalability

**Current implementation** (chunks.141.mjs:337-351):
```javascript
function TaskList() {
    const tasks = loadAllTasks(taskManager);  // O(N) file reads
    const completedSet = new Set(
        tasks.filter(t => t.status === "completed").map(t => t.id)
    );  // O(N) iteration

    return {
        tasks: tasks.map(t => ({  // O(N) iteration
            id: t.id,
            subject: t.subject,
            status: t.status,
            owner: t.owner,
            blockedBy: t.blockedBy.filter(id => !completedSet.has(id))  // O(B) per task
        }))
    };
}
```

**Complexity**:
- **File I/O**: O(N) disk reads (one per task file)
- **Memory**: O(N) to load all tasks
- **Filtering**: O(N + T*B) where T=tasks, B=avg blockers per task

**Scalability limits**:
- **100 tasks**: <100ms (acceptable)
- **1000 tasks**: ~1s (slow)
- **10000+ tasks**: Several seconds (unusable)

**Optimization opportunities**:
1. **Caching**: Keep in-memory cache, invalidate on writes
2. **Indexing**: Maintain separate index file with summary data
3. **Pagination**: Return subset of tasks (e.g., first 50)
4. **Lazy loading**: Only load task details on demand (not in TaskList)

---

## 8. Integration with Hooks System

### 8.1 Task Lifecycle Hooks

Tasks integrate with the hooks system (Module 11) via several hook points:

**TaskCompleted Hook** (verified):
```javascript
{
    event: "TaskCompleted",
    trigger: "When TaskUpdate transitions status to 'completed'",
    payload: {
        taskId: string,
        subject: string,
        description: string,
        agent: string,
        team: string
    },
    canBlock: true  // Can return blockingError to prevent completion
}
```

**Potential other hooks** (not verified in code):
- `TaskCreated`: After TaskCreate succeeds
- `TaskClaimed`: After ownership assigned
- `TaskDeleted`: After task deletion
- `TaskAssigned`: When owner changes

---

## Summary

The task system's team integration provides **robust multi-agent coordination** through:

1. **Team-Based Isolation**: Each team has separate task directory, preventing cross-team interference
2. **Atomic Claiming**: File locking prevents double-claim race conditions
3. **Smart Assignment**: Auto-assignment on status change + manual assignment via owner parameter
4. **Notification Protocol**: JSON-in-JSON messaging for task assignments
5. **Automatic Cleanup**: Tasks auto-unassigned when agent shuts down
6. **Dependency Awareness**: Claiming respects blockedBy relationships
7. **Flexible Patterns**: Supports lead-directed and self-service coordination

**Key architectural decisions**:
- **File-based storage** enables simple multi-process coordination (vs. in-memory)
- **Synchronous I/O** with locking prevents race conditions (vs. eventual consistency)
- **JSON messages** provide extensible notification protocol (vs. RPC)
- **Hook integration** allows custom validation without core changes

**Trade-offs**:
- **Scalability**: O(N) task loading limits to ~1000 tasks per team
- **Single-machine**: File locking doesn't work across distributed systems
- **No reservations**: Can't "reserve" task for future claim
- **Manual load balancing**: No automatic task distribution algorithm

The system prioritizes **correctness and simplicity** over maximum scalability, suitable for teams of 2-10 agents working on 10-1000 tasks.

---

## 9. Complete Claim Algorithm Analysis

### 9.1 Claim Task Async (OT8)

// ============================================
// claimTask - Async claim with lock and validation
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
        return {
            success: !0,
            task: await WI(A, q, {
                owner: K
            })
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
async function claimTask(taskManager, taskId, agentName, options = {}) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    // Early check: does task exist?
    if (!await loadTask(taskManager, taskId)) {
        return { success: false, reason: "task_not_found" };
    }

    // Delegate to busy-check variant if requested
    if (options.checkAgentBusy) {
        return claimTaskWithAgentBusyValidation(taskManager, taskId, agentName);
    }

    let unlock;
    try {
        // Acquire lock (async, with retries)
        unlock = await lockfile.lock(taskFilePath, lockOptions);

        // Re-load task after lock acquired (might have changed)
        const task = await loadTask(taskManager, taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // VALIDATION 1: Already owned by different agent?
        if (task.owner && task.owner !== agentName) {
            return {
                success: false,
                reason: "already_claimed",
                task: task
            };
        }

        // VALIDATION 2: Already completed?
        if (task.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task: task
            };
        }

        // VALIDATION 3: Blocked by incomplete dependencies?
        const allTasks = await loadAllTasks(taskManager);
        const incompleteTaskIds = new Set(
            allTasks
                .filter(t => t.status !== "completed")
                .map(t => t.id)
        );
        const activeBlockers = task.blockedBy.filter(id => incompleteTaskIds.has(id));

        if (activeBlockers.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task: task,
                blockedByTasks: activeBlockers
            };
        }

        // ALL VALIDATIONS PASSED - Claim the task
        return {
            success: true,
            task: await updateTask(taskManager, taskId, { owner: agentName })
        };

    } catch (error) {
        debug(`[Tasks] Failed to claim task ${taskId}: ${formatError(error)}`);
        logError(error);
        return { success: false, reason: "task_not_found" };
    } finally {
        // ALWAYS release lock
        if (unlock) await unlock();
    }
}

// Mapping: OT8→claimTask, A→taskManager, q→taskId, K→agentName,
//          Y→options, yF6→getTaskFilePath, DB→loadTask, EF6.lock→lockfile.lock,
//          DX→loadAllTasks, WI→updateTask, $N9→claimTaskWithAgentBusyValidation

### 9.2 Claim Task with Agent Busy Validation ($N9)

// ============================================
// claimTaskWithAgentBusyValidation - Claim with agent busy check
// Location: chunks.84.mjs:1831-1881
// ============================================

// ORIGINAL (for source lookup):
async function $N9(A, q, K) {
    let Y = await wT8(A),
        z;
    try {
        z = await EF6.lock(Y, nD1);
        let _ = await DX(A),
            w = _.find((J) => J.id === q);
        if (!w) return {
            success: !1,
            reason: "task_not_found"
        };
        if (w.owner && w.owner !== K) return {
            success: !1,
            reason: "already_claimed",
            task: w
        };
        if (w.status === "completed") return {
            success: !1,
            reason: "already_resolved",
            task: w
        };
        let O = new Set(_.filter((J) => J.status !== "completed").map((J) => J.id)),
            $ = w.blockedBy.filter((J) => O.has(J));
        if ($.length > 0) return {
            success: !1,
            reason: "blocked",
            task: w,
            blockedByTasks: $
        };
        let H = _.filter((J) => J.status !== "completed" && J.owner === K && J.id !== q);
        if (H.length > 0) return {
            success: !1,
            reason: "agent_busy",
            task: w,
            busyWithTasks: H.map((J) => J.id)
        };
        return {
            success: !0,
            task: await WI(A, q, {
                owner: K
            })
        }
    } catch (_) {
        return k(`[Tasks] Failed to claim task ${q} with busy check: ${_1(_)}`), _6(_), {
            success: !1,
            reason: "task_not_found"
        }
    } finally {
        if (z) await z()
    }
}

// READABLE (for understanding):
async function claimTaskWithAgentBusyValidation(taskManager, taskId, agentName) {
    const lockFilePath = await getLockFilePath(taskManager);
    let unlock;

    try {
        // Acquire GLOBAL lock (not task-specific)
        unlock = await lockfile.lock(lockFilePath, lockOptions);

        // Load ALL tasks
        const allTasks = await loadAllTasks(taskManager);
        const task = allTasks.find(t => t.id === taskId);

        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // VALIDATION 1: Already owned by different agent?
        if (task.owner && task.owner !== agentName) {
            return {
                success: false,
                reason: "already_claimed",
                task: task
            };
        }

        // VALIDATION 2: Already completed?
        if (task.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task: task
            };
        }

        // VALIDATION 3: Blocked by incomplete dependencies?
        const incompleteTaskIds = new Set(
            allTasks.filter(t => t.status !== "completed").map(t => t.id)
        );
        const activeBlockers = task.blockedBy.filter(id => incompleteTaskIds.has(id));

        if (activeBlockers.length > 0) {
            return {
                success: false,
                reason: "blocked",
                task: task,
                blockedByTasks: activeBlockers
            };
        }

        // VALIDATION 4: Is agent already busy with other tasks?
        const agentOwnedIncompleteTasks = allTasks.filter(t =>
            t.status !== "completed" &&
            t.owner === agentName &&
            t.id !== taskId  // Exclude the task being claimed
        );

        if (agentOwnedIncompleteTasks.length > 0) {
            return {
                success: false,
                reason: "agent_busy",
                task: task,
                busyWithTasks: agentOwnedIncompleteTasks.map(t => t.id)
            };
        }

        // ALL VALIDATIONS PASSED - Claim the task
        return {
            success: true,
            task: await updateTask(taskManager, taskId, { owner: agentName })
        };

    } catch (error) {
        debug(`[Tasks] Failed to claim task ${taskId} with busy check: ${formatError(error)}`);
        logError(error);
        return { success: false, reason: "task_not_found" };
    } finally {
        if (unlock) await unlock();
    }
}

// Mapping: $N9→claimTaskWithAgentBusyValidation, A→taskManager, q→taskId, K→agentName,
//          wT8→getLockFilePath, EF6.lock→lockfile.lock, DX→loadAllTasks, WI→updateTask

### 9.2 Claim Result Types

| Reason | Description | Recovery Action |
|--------|-------------|-----------------|
| `task_not_found` | Task file doesn't exist | Create new task or use correct ID |
| `already_claimed` | Another agent owns this task | Wait for release or claim different task |
| `already_resolved` | Task is already completed | No action needed |
| `blocked` | Dependencies not yet complete | Wait for blockers to complete |
| `agent_busy` | Agent already has other tasks (busy-check mode) | Complete current tasks first |

---

## 10. Advanced Team Coordination Patterns

### 10.1 Parallel Execution with Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│         PARALLEL EXECUTION WITH DEPENDENCY GRAPH                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────┐         ┌──────────┐         ┌──────────┐       │
│   │ Task #1  │────────>│ Task #3  │────────>│ Task #5  │       │
│   │ Design   │         │Implement │         │  Test    │       │
│   │ (done)   │         │ (agent-a)│         │ (blocked)│       │
│   └──────────┘         └──────────┘         └──────────┘       │
│        │                    │                                    │
│        │                    │                                    │
│        ▼                    ▼                                    │
│   ┌──────────┐         ┌──────────┐                             │
│   │ Task #2  │────────>│ Task #4  │                             │
│   │ Review   │         │ Document │                             │
│   │ (done)   │         │ (agent-b)│                             │
│   └──────────┘         └──────────┘                             │
│                                                                  │
│   Legend: ────────> blocks relationship                          │
│                                                                  │
│   Task #3: Can start (unblocked, claimed by agent-a)            │
│   Task #4: Can start (unblocked, claimed by agent-b)            │
│   Task #5: Blocked by #3 (waiting)                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key insight**: Parallel execution is enabled when tasks have no dependency path between them.

### 10.2 Team Lead Notification Protocol

// ============================================
// Team message format for task assignment
// Location: chunks.129.mjs (inferred)
// ============================================

// READABLE (for understanding):
interface TaskAssignmentMessage {
    from: string;           // Sender's agent name
    text: string;           // JSON-encoded payload
    timestamp: string;      // ISO 8601 timestamp
    color: string;          // Sender's display color
}

interface TaskAssignmentPayload {
    type: "task_assignment";
    taskId: string;
    subject: string;
    description: string;
    assignedBy: string;
    timestamp: string;
}

// Message routing
function sendTaskAssignment(ownerName, task, assignerName, teamName) {
    const message = {
        from: assignerName,
        text: JSON.stringify({
            type: "task_assignment",
            taskId: task.id,
            subject: task.subject,
            description: task.description,
            assignedBy: assignerName,
            timestamp: new Date().toISOString()
        }),
        timestamp: new Date().toISOString(),
        color: getAgentColor(assignerName)
    };

    // Write to owner's inbox
    writeToMailbox(ownerName, message, teamName);
}

**Message consumption pattern**:

```javascript
// Teammate polls inbox periodically
while (isRunning) {
    const messages = readMailbox();

    for (const message of messages) {
        const payload = JSON.parse(message.text);

        if (payload.type === "task_assignment") {
            // Display notification
            showNotification(`New task: ${payload.subject}`);

            // Optionally auto-claim
            if (autoAcceptAssignments) {
                await TaskUpdate({
                    taskId: payload.taskId,
                    status: "in_progress"
                });
            }
        }
    }

    await sleep(POLL_INTERVAL_MS);
}
```

---

## 11. Error Recovery in Team Context

### 11.1 Agent Crash Recovery

When an agent crashes unexpectedly:

```
┌─────────────────────────────────────────────────────────────────┐
│              AGENT CRASH RECOVERY FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Detect crash (timeout or explicit termination)              │
│           │                                                      │
│           ▼                                                      │
│  2. Call unassignTeammateTasks()                                │
│     - Find all tasks owned by crashed agent                     │
│     - Set owner: undefined                                       │
│     - Set status: "pending"                                      │
│           │                                                      │
│           ▼                                                      │
│  3. Notify team lead                                             │
│     "agent-a was terminated. 2 tasks unassigned:                │
│      #3 'Implement feature', #5 'Write tests'"                  │
│           │                                                      │
│           ▼                                                      │
│  4. Tasks become available for other agents                     │
│     - TaskList shows #3, #5 as pending/unassigned               │
│     - Other agents can claim them                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Dependency Cycle Detection

**Not implemented in current version** - Dependencies can create cycles.

**Manual mitigation**:
1. Use `TaskGet` to inspect `blocks` and `blockedBy` arrays
2. Use `TaskUpdate` with `addBlockedBy: []` or `addBlocks: []` to break cycles
3. Delete stuck tasks with `TaskUpdate({ status: "deleted" })`

---

## Summary

The task system's team integration provides **robust multi-agent coordination** through:

1. **Team-Based Isolation**: Each team has separate task directory, preventing cross-team interference
2. **Atomic Claiming**: File locking prevents double-claim race conditions
3. **Smart Assignment**: Auto-assignment on status change + manual assignment via owner parameter
4. **Notification Protocol**: JSON-in-JSON messaging for task assignments
5. **Automatic Cleanup**: Tasks auto-unassigned when agent shuts down
6. **Dependency Awareness**: Claiming respects blockedBy relationships
7. **Flexible Patterns**: Supports lead-directed and self-service coordination

**Key architectural decisions**:
- **File-based storage** enables simple multi-process coordination (vs. in-memory)
- **Synchronous I/O** with locking prevents race conditions (vs. eventual consistency)
- **JSON messages** provide extensible notification protocol (vs. RPC)
- **Hook integration** allows custom validation without core changes

**Trade-offs**:
- **Scalability**: O(N) task loading limits to ~1000 tasks per team
- **Single-machine**: File locking doesn't work across distributed systems
- **No reservations**: Can't "reserve" task for future claim
- **Manual load balancing**: No automatic task distribution algorithm

The system prioritizes **correctness and simplicity** over maximum scalability, suitable for teams of 2-10 agents working on 10-1000 tasks.
