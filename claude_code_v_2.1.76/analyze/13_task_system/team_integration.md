# Task System - Team Integration Analysis

## Module Overview

This document analyzes how the task system integrates with the agent teams feature (Module 30) to enable multi-agent task coordination, ownership, and collaboration patterns.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Task system and agent teams
> - [30_agent_teams/](../30_agent_teams/) - Full agent teams analysis

Key functions in this document:
- `claim TaskClaim` (o7A, Cf5) - Atomically claim unassigned task
- `sendTeamMessage` (f9) - Send task_assignment notifications
- `isInTeamMode` (l8) - Check if running in team context
- `unassignTeammateTask` (Mr) - Cleanup on agent shutdown
- `getCurrentAgentName` (g5) - Get executing agent ID

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
// Location: chunks.48.mjs:441-446
// ============================================

// ORIGINAL (for source lookup):
function WM() {
    if (process.env.CLAUDE_CODE_TASK_LIST_ID) return process.env.CLAUDE_CODE_TASK_LIST_ID;
    let A = PL();
    if (A) return A.teamName;
    return i3() || i7A || U6()
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
    // Returns: currentAgentId || defaultAgentId || sessionId
    return getCurrentAgentName() || DEFAULT_AGENT_ID || getSessionId();
}

// Mapping:
// WM → getTaskManager
// PL → getTeamContext
// A → teamContext
// i3 → getCurrentAgentName
// i7A → DEFAULT_AGENT_ID
// U6 → getSessionId

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
// Location: chunks.188.mjs (l8 function, inferred)
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
// Location: chunks.48.mjs:593-641 (o7A function)
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
        if (H.owner && H.owner !== K) return { success: !1, reason: "already_claimed", task: H };
        if (H.status === "completed") return { success: !1, reason: "already_resolved", task: H };
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
        }
    } finally {
        if (w) w()
    }
}

// READABLE (for understanding):
function claimTask(taskManager, taskId, agentName, options = {}) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);

    // Quick check: does task file exist?
    if (!fileExists(taskFilePath)) {
        return { success: false, reason: "task_not_found" };
    }

    // Delegate to busy-check variant if requested
    if (options.checkAgentBusy) {
        return claimTaskWithBusyCheck(taskManager, taskId, agentName);
    }

    let unlock;
    try {
        // ACQUIRE LOCK on the specific task file
        unlock = lockfile.lockSync(taskFilePath);

        // Load task (validates schema)
        const task = loadTask(taskManager, taskId);
        if (!task) {
            return { success: false, reason: "task_not_found" };
        }

        // VALIDATION 1: Already claimed by another agent?
        if (task.owner && task.owner !== agentName) {
            return {
                success: false,
                reason: "already_claimed",
                task: task
            };
        }

        // VALIDATION 2: Task already completed?
        if (task.status === "completed") {
            return {
                success: false,
                reason: "already_resolved",
                task: task
            };
        }

        // VALIDATION 3: Task blocked by incomplete dependencies?
        const allTasks = loadAllTasks(taskManager);

        // Build set of incomplete task IDs
        const incompleteTasks = new Set(
            allTasks
                .filter(t => t.status !== "completed")
                .map(t => t.id)
        );

        // Filter blockedBy to only show incomplete blockers
        const activeBlockers = task.blockedBy.filter(id => incompleteTasks.has(id));

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
            task: updateTask(taskManager, taskId, { owner: agentName })
        };

    } finally {
        // RELEASE LOCK (always executes)
        if (unlock) unlock();
    }
}

// Mapping:
// o7A → claimTask
// A → taskManager
// q → taskId
// K → agentName
// Y → options
// Cf5 → claimTaskWithBusyCheck
// WC1 → getTaskFilePath
// jr → fileExists
// PC1.default.lockSync → lockfile.lockSync
// lg → loadTask
// WX → loadAllTasks
// JS → updateTask

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
// claimTaskWithBusyCheck - Prevent multi-tasking
// Location: chunks.48.mjs:643-693 (Cf5 function)
// ============================================

// READABLE (for understanding):
function claimTaskWithBusyCheck(taskManager, taskId, agentName) {
    const taskFilePath = getTaskFilePath(taskManager, taskId);
    if (!fileExists(taskFilePath)) {
        return { success: false, reason: "task_not_found" };
    }

    let unlock;
    try {
        unlock = lockfile.lockSync(taskFilePath);
        const task = loadTask(taskManager, taskId);
        if (!task) return { success: false, reason: "task_not_found" };

        // ... same ownership and status checks as basic claim ...

        // NEW VALIDATION: Is agent already working on other tasks?
        const allTasks = loadAllTasks(taskManager);
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

        // ... same blocker check as basic claim ...

        return {
            success: true,
            task: updateTask(taskManager, taskId, { owner: agentName })
        };
    } finally {
        if (unlock) unlock();
    }
}

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
// unassignTeammateTask - Clean up on agent shutdown
// Location: chunks.48.mjs:695-714 (Mr function)
// ============================================

// ORIGINAL (for source lookup):
function Mr(A, q, K, Y) {
    let w = WX(A).filter((O) =>
        O.status !== "completed" && (O.owner === q || O.owner === K)
    );
    for (let O of w) JS(A, O.id, {
        owner: void 0,
        status: "pending"
    });
    if (w.length > 0) h(`[Tasks] Unassigned ${w.length} task(s) from ${K}`);
    let $ = `${K} ${Y === "terminated" ? "was terminated" : "has shut down"}.`;
    if (w.length > 0) {
        let O = w.map((_) => `#${_.id} "${_.subject}"`).join(", ");
        $ += ` ${w.length} task(s) were unassigned: ${O}...`
    }
    return {
        unassignedTasks: w.map((O) => ({
            id: O.id,
            subject: O.subject
        })),
        notificationMessage: $
    }
}

// READABLE (for understanding):
function unassignTeammateTask(taskManager, oldAgentId, agentName, shutdownReason) {
    // Find all incomplete tasks owned by the shutting-down agent
    const allTasks = loadAllTasks(taskManager);
    const agentTasks = allTasks.filter(task =>
        task.status !== "completed" &&
        (task.owner === oldAgentId || task.owner === agentName)
    );

    // Unassign and reset all found tasks
    for (const task of agentTasks) {
        updateTask(taskManager, task.id, {
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
        notificationMessage += ` ${agentTasks.length} task(s) were unassigned: ${taskList}`;
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
// Mr → unassignTeammateTask
// A → taskManager
// q → oldAgentId
// K → agentName
// Y → shutdownReason
// w → agentTasks
// O → task
// $ → notificationMessage

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
unassignTeammateTask() called
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
