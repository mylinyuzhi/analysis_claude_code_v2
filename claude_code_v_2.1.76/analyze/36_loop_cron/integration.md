# Loop/Cron Integration

> **Module**: Loop/Cron Scheduling System - Integration
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.187.mjs`, `chunks.195.mjs`, `chunks.90.mjs`

---

## Table of Contents

1. [Agent Loop Integration](#1-agent-loop-integration)
2. [Message Injection Mechanism](#2-message-injection-mechanism)
3. [System Reminder Integration](#3-system-reminder-integration)
4. [Team Mode Integration](#4-team-mode-integration)
5. [File System Integration](#5-file-system-integration)
6. [Feature Flag Integration](#6-feature-flag-integration)
7. [Missed Task Handling](#7-missed-task-handling)
8. [Telemetry Integration](#8-telemetry-integration)
9. [Hook System Integration](#9-hook-system-integration)
10. [MCP Protocol Integration](#10-mcp-protocol-integration)
11. [Auto-Compaction Integration](#11-auto-compaction-integration)
12. [Cross-Module Dependency Graph](#12-cross-module-dependency-graph)

---

## 1. Agent Loop Integration

### Scheduler Creation

**Location:** chunks.187.mjs:571-586

The main agent loop creates and starts a cron scheduler when the feature is enabled.

```javascript
// ============================================
// Agent Loop Scheduler Integration
// Location: chunks.187.mjs:571-586
// ============================================

// ORIGINAL (for source lookup):
let l = null;
if (nhq && rhq?.isKairosCronEnabled()) l = nhq.createCronScheduler({
    onFire: (T6) => {
        if (D) return;
        _0({
            mode: "prompt",
            value: T6,
            uuid: WD(),
            priority: "later",
            isMeta: !0,
            workload: rA1
        }), i()
    },
    isLoading: () => M || D,
    getJitterConfig: xXz?.getCronJitterConfig,
    isKilled: () => !rhq?.isKairosCronEnabled()
}), l.start();

// READABLE (for understanding):
let cronScheduler = null;

// Only create scheduler if feature is enabled
if (schedulerModule && featureFlags?.isKairosCronEnabled()) {
    cronScheduler = schedulerModule.createCronScheduler({
        // Callback when a task fires
        onFire: (promptText) => {
            // Don't fire if agent is shutting down
            if (isShuttingDown) return;

            // Inject as a prompt message
            enqueueMessage({
                mode: "prompt",
                value: promptText,
                uuid: generateUUID(),
                priority: "later",      // Wait until idle
                isMeta: true,           // Hidden from main chat
                workload: WORKLOAD_TYPE_CRON  // "cron"
            });

            // Trigger processing
            triggerProcessing();
        },

        // Check if agent is busy
        isLoading: () => isProcessing || isShuttingDown,

        // Get jitter configuration
        getJitterConfig: configModule?.getCronJitterConfig,

        // Check if scheduler should stop
        isKilled: () => !featureFlags?.isKairosCronEnabled()
    });

    // Start the scheduler
    cronScheduler.start();
}

// Mapping: l→cronScheduler, nhq→schedulerModule, rhq→featureFlags, T6→promptText,
//          _0→enqueueMessage, WD→generateUUID, rA1→WORKLOAD_TYPE_CRON, i→triggerProcessing
```

### React Hook Integration

**Location:** chunks.195.mjs:1956-1985

The UI layer also initializes the scheduler via React hooks.

```javascript
// ============================================
// React Hook Scheduler Setup
// Location: chunks.195.mjs:1950-1985
// ============================================

// ORIGINAL (for source lookup):
function someHook({
    isLoading: A,
    assistantMode: q = !1
}) {
    let K = vb1.useRef(A);
    K.current = A;
    let Y = S5(), z = xA();
    vb1.useEffect(() => {
        if (!kR()) return;
        let _ = (O) => w0({
                value: O,
                mode: "prompt",
                priority: "later",
                isMeta: !0,
                workload: rA1
            }),
            w = Ds8({
                onFire: _,
                onFireTask: (O) => {
                    if (O.agentId) {
                        let $ = _g(O.agentId, Y.getState().tasks);
                        if ($ && !LJ6($.status)) {
                            tQ6($.id, O.prompt, z);
                            return
                        }
                        k(`[ScheduledTasks] teammate ${O.agentId} gone, removing orphaned cron ${O.id}`), yz6([O.id]);
                        return
                    }
                    _(O.prompt)
                },
                isLoading: () => K.current,
                assistantMode: q,
                getJitterConfig: Ws8,
                isKilled: () => !kR()
            });
        return w.start(), () => w.stop()
    }, [q])
}

// READABLE (for understanding):
function useCronScheduler({ isLoading, assistantMode = false }) {
    // Keep isLoading ref current
    const isLoadingRef = useRef(isLoading);
    isLoadingRef.current = isLoading;

    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => {
        // Skip if cron feature disabled
        if (!isKairosCronEnabled()) return;

        // Fire callback: inject prompt into message queue
        const firePrompt = (prompt) => enqueueMessage({
            value: prompt,
            mode: "prompt",
            priority: "later",
            isMeta: true,
            workload: WORKLOAD_TYPE_CRON
        });

        // Create scheduler
        const scheduler = createCronScheduler({
            onFire: firePrompt,

            // Handle teammate tasks specially
            onFireTask: (task) => {
                if (task.agentId) {
                    // Find the teammate task
                    const teammateTask = findTaskById(task.agentId, store.getState().tasks);
                    if (teammateTask && !isTaskTerminal(teammateTask.status)) {
                        // Route to teammate's task queue
                        dispatchTaskPrompt(teammateTask.id, task.prompt, dispatch);
                        return;
                    }
                    // Teammate gone, remove orphaned cron
                    log(`[ScheduledTasks] teammate ${task.agentId} gone, removing orphaned cron ${task.id}`);
                    deleteCronTasks([task.id]);
                    return;
                }
                // Regular task: just fire the prompt
                firePrompt(task.prompt);
            },

            isLoading: () => isLoadingRef.current,
            assistantMode,
            getJitterConfig: getCronJitterConfig,
            isKilled: () => !isKairosCronEnabled()
        });

        // Start scheduler, return cleanup
        scheduler.start();
        return () => scheduler.stop();
    }, [assistantMode]);
}

// Mapping: vb1→React, kR→isKairosCronEnabled, Ds8→createCronScheduler,
//          w0→enqueueMessage, rA1→WORKLOAD_TYPE_CRON, Ws8→getCronJitterConfig
```

---

## 2. Message Injection Mechanism

### Message Structure

When a cron job fires, it injects a message with specific properties:

```javascript
{
    mode: "prompt",           // Type of message
    value: "<prompt text>",   // The scheduled prompt
    uuid: "<generated-uuid>", // Unique identifier
    priority: "later",        // Execution priority
    isMeta: true,             // Hidden from UI transcript
    workload: "cron"          // Workload classification
}
```

### Priority System

**Location:** chunks.131.mjs:2578

```javascript
// ORIGINAL (for source lookup):
priority: C.enum(["now", "next", "later"]).optional()

// READABLE (for understanding):
// Priority levels:
// - "now": Execute immediately, interrupt current work
// - "next": Execute after current message completes
// - "later": Execute when idle (cron jobs use this)
```

### isMeta Flag

**Purpose:** The `isMeta: true` flag marks cron messages as system-generated, affecting:

1. **UI Display**: Hidden from main chat transcript
2. **Compaction**: Included in compaction processing
3. **Token Counting**: Counted in context but not shown to user

**Detection in API preparation:**

```javascript
// Location: chunks.174.mjs:2988
// Filter out meta messages from certain processing
if (line.includes('"isMeta":true') || line.includes('"isMeta": true')) continue;
```

### Workload Type

**Location:** chunks.18.mjs:1894

```javascript
// ORIGINAL (for source lookup):
rA1 = "cron"

// READABLE (for understanding):
const WORKLOAD_TYPE_CRON = "cron";

// Used to classify the workload for:
// - Telemetry
// - Priority scheduling
// - Resource allocation
```

---

## 3. System Reminder Integration

### No Dedicated cron_job Attachment Type

In v2.1.76, cron jobs do NOT generate a dedicated `cron_job` system reminder type. Instead:

1. **Cron messages use `isMeta: true`** to hide from UI
2. **They appear as regular user messages** to the LLM
3. **The workload type** classifies them internally

### isMeta Flag Processing

**What it does:** The `isMeta: true` flag marks cron messages as system-generated, affecting multiple subsystems.

**Location:** Message injection at chunks.187.mjs:574-580

```javascript
// ============================================
// isMeta Flag - Cron message classification
// Location: chunks.187.mjs:574-580
// ============================================

// Message structure when cron fires:
{
    mode: "prompt",           // Type of message
    value: "<prompt text>",   // The scheduled prompt
    uuid: "<generated-uuid>", // Unique identifier
    priority: "later",        // Execution priority (wait until idle)
    isMeta: true,             // Hidden from UI transcript
    workload: "cron"          // Workload classification
}
```

**Effects of isMeta: true:**

| Subsystem | Effect | Source Location |
|-----------|--------|-----------------|
| UI Rendering | Message hidden from chat transcript | chunks.174.mjs:2988 |
| Token Counting | Included in context token count | chunks.147.mjs |
| Compaction | Processed like other meta messages | chunks.148.mjs |
| API Preparation | May be filtered in certain paths | chunks.174.mjs |

**Detection in API preparation:**

```javascript
// Location: chunks.174.mjs:2988
// Filter out meta messages from certain processing
if (line.includes('"isMeta":true') || line.includes('"isMeta": true')) continue;
```

### Comparison with Other Meta Message Types

The `isMeta: true` flag is used by several system-generated messages:

| Message Source | isMeta | Priority | Workload | Purpose |
|----------------|--------|----------|----------|---------|
| **Cron job fire** | ✓ true | "later" | "cron" | Scheduled prompt execution |
| **System reminder** | ✓ true | varies | varies | Context injection |
| **Hook response** | ✓ true | varies | varies | Hook feedback |
| **Queued user message** | ✗ false | "later" | - | Deferred user input |
| **Background task notification** | ✓ true | "later" | "background" | Task status update |

### Why Not a Dedicated cron_job Type?

The design choice to use `isMeta` instead of a dedicated attachment type:

**Rationale:**
1. **Simplicity** - No need for additional attachment producer
2. **Immediate execution** - Cron prompts are meant to be executed, not stored as context
3. **Consistency** - Works with existing message queue infrastructure
4. **Priority handling** - The `priority: "later"` ensures cron doesn't interrupt ongoing work

**Trade-off:**
- Cron prompts appear as user messages to the LLM
- No structured metadata about schedule timing in the prompt itself
- Less observability for debugging (no cron_job attachment to inspect)

### isMeta Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MESSAGE CREATION                                       │
│                     enqueueMessage({ isMeta: true })                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MESSAGE QUEUE                                          │
│                                                                              │
│   Message enters queue with priority: "later"                                │
│   Queue processes messages when agent is idle                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        API PREPARATION                                        │
│                     (chunks.174.mjs)                                          │
│                                                                              │
│   • isMeta messages included in API call to LLM                              │
│   • Appear as user-role messages                                             │
│   • Not filtered out (they provide context)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        UI RENDERING                                           │
│                     (chunks.174.mjs:2988)                                    │
│                                                                              │
│   • isMeta messages filtered from UI transcript                              │
│   • User doesn't see the cron message in chat history                        │
│   • Only the result of executing the prompt is shown                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Related System Reminder Types

While cron jobs don't have a dedicated type, these related types exist:

| Type | Purpose | When Generated | isMeta |
|------|---------|----------------|--------|
| `queued_command` | Shows queued prompts | When multiple prompts waiting | true |
| `task_reminder` | Background task status | Periodically for running tasks | true |
| `token_usage` | Context window usage | When enabled via env var | true |
| `hook_response` | Hook execution result | After hook runs | true |

### Missed Task Delivery (via onMissed callback)

**How missed one-shot tasks are delivered to the agent:**

When missed one-shot tasks are detected at scheduler startup, they are delivered via the `onMissed` callback or injected as a prompt message:

**Location:** chunks.186.mjs:130-138

```javascript
// ============================================
// Missed Task Delivery - How agent learns about missed tasks
// Location: chunks.186.mjs:130-138
// ============================================

// ORIGINAL (for source lookup):
let I = Y7q(R, u).filter((g) => !g.recurring && !D.has(g.id));
if (I.length > 0) {
    for (let g of I) D.add(g.id), M.set(g.id, 1 / 0);
    if (d("tengu_scheduled_task_missed", {
            count: I.length,
            taskIds: I.map((g) => g.id).join(",")
        }), _) _(I);
    else q(bhq(I));
    yz6(I.map((g) => g.id), w).catch((g) => k(`[ScheduledTasks] failed to remove missed tasks: ${g}`))
}

// READABLE (for understanding):
const missedTasks = findMissedOneShots(durableTasks, currentTime)
    .filter(task => !task.recurring && !seenJobs.has(task.id));

if (missedTasks.length > 0) {
    // Mark as seen to prevent re-detection
    for (let task of missedTasks) {
        seenJobs.add(task.id);
        nextFireTimes.set(task.id, Infinity);
    }

    // Emit telemetry
    emitTelemetry("tengu_scheduled_task_missed", {
        count: missedTasks.length,
        taskIds: missedTasks.map(t => t.id).join(",")
    });

    // Deliver to agent
    if (onMissed) {
        // Custom handler provided
        onMissed(missedTasks);
    } else {
        // Default: inject as prompt message
        onFire(formatMissedTasksMessage(missedTasks));
    }

    // Remove from durable storage
    deleteCronTasks(missedTasks.map(t => t.id)).catch(err =>
        log(`[ScheduledTasks] failed to remove missed tasks: ${err}`)
    );
}
```

**The missed task message format:**

```markdown
The following one-shot scheduled task was missed while Claude was not running.
It has already been removed from .claude/scheduled_tasks.json.

Do NOT execute this prompt yet. First use the AskUserQuestion tool to ask
whether to run it now. Only execute if the user confirms.

[Tomorrow at 2:30 PM, created 3/22/2026, 10:30:00 AM]
```
Check the deployment status
```
```

**Key insight:** The missed task notification instructs the LLM to NOT automatically execute the prompt, but instead use AskUserQuestion to get user confirmation. This prevents unexpected execution of stale reminders.

### Future: Potential cron_job Type

The system reminder infrastructure supports adding a `cron_job` type if needed:

```javascript
// Hypothetical future implementation
{
    type: "cron_job",
    id: "abc123",
    humanSchedule: "Every 5 minutes",
    prompt: "/check-status",
    nextRun: "2026-03-23T10:05:00Z",
    recurring: true
}
```

### Integration with queued_command

Cron messages can interact with the `queued_command` system reminder:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CRON + QUEUED_COMMAND FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

Scenario: Cron fires while agent is busy

1. Agent processing user request
2. Cron job fires → enqueueMessage({priority: "later", isMeta: true})
3. Message enters queue (not immediately processed)
4. Agent completes current turn
5. System checks queue → finds cron message
6. If other user messages arrived:
   - queued_command attachment generated for user messages
   - Cron message still processed (isMeta, so hidden)
7. Agent processes all queued messages in order
```

### Key Differences: isMeta vs Regular User Messages

| Aspect | Regular User Message | isMeta Message (Cron) |
|--------|---------------------|----------------------|
| Visible in UI | Yes | No |
| Token counted | Yes | Yes |
| Affects compaction | Normal | Normal |
| Priority | "now" typically | "later" |
| Source attribution | User | System |
| API inclusion | Full | Full |

---

## 4. Team Mode Integration

### Agent Ownership

Each cron task can be associated with a specific agent (teammate):

```javascript
// Task structure with agentId
{
    id: "abc123",
    cron: "*/5 * * * *",
    prompt: "/check-status",
    createdAt: 1710500000000,
    recurring: true,
    agentId: "teammate-001"  // Optional: owner agent
}
```

### Permission Model

**Location:** chunks.145.mjs:1114-1118

```javascript
// ============================================
// CronDelete Permission Check
// Location: chunks.145.mjs:1107-1123
// ============================================

// ORIGINAL (for source lookup):
let Y = iM();
if (Y && K.agentId !== Y.agentId) return {
    result: !1,
    message: `Cannot delete cron job '${A.id}': owned by another agent`,
    errorCode: 2
};

// READABLE (for understanding):
const teammateContext = getTeammateContext();
if (teammateContext && job.agentId !== teammateContext.agentId) {
    return {
        result: false,
        message: `Cannot delete cron job '${input.id}': owned by another agent`,
        errorCode: 2
    };
}
```

### Teammate Isolation

- **Each teammate sees only their own jobs** (filtered by `agentId`)
- **Team lead sees all jobs** (no `agentId` filter)
- **Durable jobs not allowed for teammates** (they don't persist across sessions)

```javascript
// CronList filtering
const visibleTasks = teammateContext
    ? allTasks.filter(task => task.agentId === teammateContext.agentId)
    : allTasks;
```

### Orphaned Task Cleanup

When a teammate terminates, their cron jobs become orphaned:

```javascript
// Location: chunks.195.mjs:1973-1975
if (teammateTask && !isTaskTerminal(teammateTask.status)) {
    // Route to teammate
} else {
    // Teammate gone, cleanup
    log(`[ScheduledTasks] teammate ${task.agentId} gone, removing orphaned cron ${task.id}`);
    deleteCronTasks([task.id]);
}
```

---

## 5. File System Integration

### Durable Task Storage

**File Path:** `.claude/scheduled_tasks.json`

```json
{
    "tasks": [
        {
            "id": "abc12345",
            "cron": "*/5 * * * *",
            "prompt": "/check-status",
            "createdAt": 1710500000000,
            "recurring": true
        }
    ]
}
```

### Lock File

**File Path:** `.claude/scheduled_tasks.lock`

```json
{
    "sessionId": "session-uuid",
    "pid": 12345,
    "acquiredAt": 1710500000000
}
```

### Lock Acquisition

**Location:** chunks.186.mjs:47-68

```javascript
// ============================================
// acquireSchedulerLock (Ms8)
// Location: chunks.186.mjs:47-68
// ============================================

// READABLE (for understanding):
async function acquireSchedulerLock(options) {
    const lockData = {
        sessionId: options?.lockIdentity ?? getSessionId(),
        pid: process.pid,
        acquiredAt: Date.now()
    };

    // Try to create lock file exclusively
    if (await tryCreateLockFile(lockData, options?.dir)) {
        // Lock acquired
        scheduleLockHeartbeat(options);
        log(`[ScheduledTasks] acquired scheduler lock (PID ${process.pid})`);
        return true;
    }

    // Lock exists, check if stale
    const existingLock = await readLockFile(options?.dir);
    if (existingLock?.sessionId === lockData.sessionId) {
        // Same session, update PID if needed
        if (existingLock.pid !== process.pid) {
            await writeLockFile(lockData, options?.dir);
            scheduleLockHeartbeat(options);
        }
        return true;
    }

    // Check if owning process is still alive
    if (existingLock && isProcessAlive(existingLock.pid)) {
        // Lock held by another session
        log(`[ScheduledTasks] scheduler lock held by session ${existingLock.sessionId} (PID ${existingLock.pid})`);
        return false;
    }

    // Stale lock, recover it
    log(`[ScheduledTasks] recovering stale scheduler lock from PID ${existingLock.pid}`);
    await deleteLockFile(options?.dir);
    if (await tryCreateLockFile(lockData, options?.dir)) {
        scheduleLockHeartbeat(options);
        return true;
    }

    return false;
}
```

### File Watching

The scheduler uses file watching to detect changes to `scheduled_tasks.json`:

```javascript
// Location: chunks.186.mjs:209-219
const watcher = fs.watch(tasksFilePath, {
    persistent: false,
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 300 },
    ignorePermissionErrors: true
});

watcher.on("add", () => reloadTasks());
watcher.on("change", () => reloadTasks());
watcher.on("unlink", () => {
    // File deleted, clear tasks
    durableTasks = [];
    scheduledTimes.clear();
});
```

---

## 6. Feature Flag Integration

### Feature Flag: tengu_kairos_cron

**Location:** chunks.91.mjs:186-188

```javascript
// ============================================
// isKairosCronEnabled (kR)
// Location: chunks.91.mjs:186-188
// ============================================

// ORIGINAL (for source lookup):
function kR() {
    return !t6(process.env.CLAUDE_CODE_DISABLE_CRON) && lk("tengu_kairos_cron", !0, LB9)
}

// READABLE (for understanding):
function isKairosCronEnabled() {
    // Check environment variable first
    if (parseBoolean(process.env.CLAUDE_CODE_DISABLE_CRON)) {
        return false;
    }

    // Check feature flag with 5-minute cache
    return getFeatureFlag("tengu_kairos_cron", true, 300000);
}

// Mapping: kR→isKairosCronEnabled, t6→parseBoolean, lk→getFeatureFlag, LB9→300000 (5 min cache)
```

### Cache Duration

```javascript
// Location: chunks.91.mjs:190
LB9 = 300000  // 5 minutes in milliseconds
```

The feature flag is cached for 5 minutes to avoid repeated lookups.

### Environment Variable Override

```bash
# Disable cron entirely
CLAUDE_CODE_DISABLE_CRON=true

# Enable (respects feature flag)
# (unset or CLAUDE_CODE_DISABLE_CRON=false)
```

---

## 7. Missed Task Handling

### Missed One-Shot Detection

**Location:** chunks.145.mjs:821-826

When the scheduler starts, it checks for one-shot tasks whose fire time has passed:

```javascript
// ============================================
// findMissedOneShots (Y7q) - Detect missed one-shot tasks
// Location: chunks.145.mjs:821-826
// ============================================

// ORIGINAL (for source lookup):
function Y7q(A, q) {
    return A.filter((K) => {
        let Y = IT6(K.cron, K.createdAt);
        return Y !== null && Y < q
    })
}

// READABLE (for understanding):
function findMissedOneShots(tasks, currentTime) {
    return tasks.filter(task => {
        // Only check one-shot tasks (not recurring)
        if (task.recurring) return false;

        const fireTime = getNextCronMatch(task.cron, task.createdAt);
        return fireTime !== null && fireTime < currentTime;
    });
}

// Mapping: Y7q→findMissedOneShots, IT6→getNextCronMatch
```

### Missed Task Notification (bhq)

**Location:** chunks.186.mjs:251-266

When missed tasks are detected, a special notification is generated:

```javascript
// ============================================
// buildMissedTasksMessage (bhq) - Format missed task notification
// Location: chunks.186.mjs:251-266
// ============================================

// ORIGINAL (for source lookup):
function bhq(A) {
    let q = A.length > 1,
        K = `The following one-shot scheduled task${q?"s were":" was"} missed while Claude was not running. ${q?"They have":"It has"} already been removed from .claude/scheduled_tasks.json.

Do NOT execute ${q?"these prompts":"this prompt"} yet. First use the AskUserQuestion tool to ask whether to run ${q?"each one":"it"} now. Only execute if the user confirms.`,
        Y = A.map((z) => {
            return `${`[${CT6(z.cron)}, created ${new Date(z.createdAt).toLocaleString()}]`}
\`\`\`
${z.prompt}
\`\`\``
        });
    return `${K}

${Y.join(`

`)}`
}

// READABLE (for understanding):
function buildMissedTasksMessage(missedTasks) {
    const plural = missedTasks.length > 1;
    const header = `The following one-shot scheduled task${plural ? "s were" : " was"} missed while Claude was not running. ${plural ? "They have" : "It has"} already been removed from .claude/scheduled_tasks.json.

Do NOT execute ${plural ? "these prompts" : "this prompt"} yet. First use the AskUserQuestion tool to ask whether to run ${plural ? "each one" : "it"} now. Only execute if the user confirms.`;

    const taskList = missedTasks.map(task => {
        const schedule = formatCronHumanReadable(task.cron);
        const created = new Date(task.createdAt).toLocaleString();
        return `[${schedule}, created ${created}]
\`\`\`
${task.prompt}
\`\`\``;
    });

    return `${header}

${taskList.join("\n\n")}`;
}

// Mapping: bhq→buildMissedTasksMessage, CT6→formatCronHumanReadable
```

### Missed Task Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCHEDULER STARTUP                                         │
│                                                                              │
│   1. Load tasks from .claude/scheduled_tasks.json                           │
│   2. Find missed one-shots (Y7q)                                            │
│   3. Generate notification (bhq)                                            │
│   4. Delete missed tasks from disk                                          │
│   5. Fire onMissed callback with notification                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AGENT LOOP HANDLING                                       │
│                                                                              │
│   The notification is injected as a prompt message:                         │
│   • mode: "prompt"                                                          │
│   • value: <notification text>                                              │
│   • priority: "later"                                                       │
│   • isMeta: true                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LLM RESPONSE                                              │
│                                                                              │
│   Agent sees the notification and must:                                     │
│   1. Use AskUserQuestion to confirm execution                               │
│   2. Only run the prompt if user confirms                                   │
│   3. NOT automatically execute missed prompts                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Telemetry Events

```javascript
// Fire event
d("tengu_scheduled_task_fire", {
    recurring: task.recurring ?? false,
    taskId: task.id
});

// Missed event
d("tengu_scheduled_task_missed", {
    count: missedTasks.length,
    taskIds: missedTasks.map(t => t.id).join(",")
});

// Expired event (3-day limit)
d("tengu_scheduled_task_expired", {
    taskId: task.id,
    ageHours: Math.floor((now - task.createdAt) / 1000 / 60 / 60)
});
```

---

## 8. Telemetry Integration

### Event Types

| Event Name | When Fired | Data |
|------------|------------|------|
| `tengu_scheduled_task_fire` | Task executes | `{recurring, taskId}` |
| `tengu_scheduled_task_missed` | Missed one-shots detected | `{count, taskIds}` |
| `tengu_scheduled_task_expired` | Recurring task aged out (3 days) | `{taskId, ageHours}` |

### Telemetry Function

**Location:** chunks.1.mjs (imported)

```javascript
// ORIGINAL (for source lookup):
d("tengu_scheduled_task_fire", {
    recurring: g.recurring ?? !1,
    taskId: g.id
});

// READABLE (for understanding):
trackEvent("tengu_scheduled_task_fire", {
    recurring: task.recurring ?? false,
    taskId: task.id
});
```

---

## 9. Hook System Integration

Cron tool invocations go through the standard hook system:

### PreToolUse Hook

When `CronCreate` or `CronDelete` is called, `PreToolUse` hooks run:

```javascript
// Hook receives tool name and input
{
    tool_name: "CronCreate",
    tool_input: { cron: "*/5 * * * *", prompt: "/check-status", recurring: true }
}
```

### PostToolUse Hook

After tool execution:

```javascript
// Hook receives tool name, input, and result
{
    tool_name: "CronCreate",
    tool_input: { ... },
    tool_result: { id: "abc12345", humanSchedule: "Every 5 minutes", recurring: true }
}
```

---

## 10. MCP Protocol Integration

Cron tools are available as MCP tools when configured:

### Tool Discovery

The cron tools are included in the tools list returned to MCP clients:

```javascript
// Tool definitions exposed via MCP
[
    {
        name: "CronCreate",
        description: "Schedule a prompt to run at a future time...",
        inputSchema: { ... }
    },
    {
        name: "CronDelete",
        description: "Cancel a scheduled cron job by ID",
        inputSchema: { ... }
    },
    {
        name: "CronList",
        description: "List scheduled cron jobs",
        inputSchema: { ... }
    }
]
```

---

## 11. Auto-Compaction Integration

### Token Budget Considerations

Cron messages are included in token counting for auto-compaction:

```javascript
// Cron messages with isMeta: true are counted
// They contribute to the token budget trigger threshold
```

### Compaction Behavior

When auto-compaction runs, cron messages may be summarized along with other context.

---

## 12. Cross-Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOOP/CRON SYSTEM DEPENDENCIES                             │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │  User Input  │
                              │  /loop cmd   │
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                                 ▼
         ┌──────────────────┐              ┌──────────────────┐
         │  Skill System    │              │  Tool System     │
         │  (chunks.181)    │              │  (chunks.145)    │
         │  • registerLoop  │              │  • CronCreate    │
         │  • buildPrompt   │              │  • CronDelete    │
         └────────┬─────────┘              │  • CronList      │
                  │                        └────────┬─────────┘
                  │                                 │
                  └────────────────┬────────────────┘
                                   │
                                   ▼
                     ┌───────────────────────────┐
                     │     Scheduler Core        │
                     │     (chunks.186)          │
                     │  • createCronScheduler    │
                     │  • lock acquisition       │
                     │  • file watching          │
                     │  • jitter calculation     │
                     └─────────────┬─────────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       │                           │                           │
       ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│ File System  │          │ Feature Flags│          │ Agent Loop   │
│ (chunks.145) │          │ (chunks.91)  │          │ (chunks.187) │
│ • tasks.json │          │ • tengu_     │          │ • message    │
│ • lock file  │          │   kairos_cron│          │   injection  │
└──────────────┘          └──────────────┘          └──────────────┘
       │                           │                           │
       │                           │                           │
       ▼                           ▼                           ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│ Team Mode    │          │ Telemetry    │          │ System       │
│ (chunks.84)  │          │ (chunks.1)   │          │ Reminder     │
│ • agentId    │          │ • fire event │          │ (chunks.147) │
│ • filtering  │          │ • missed     │          │ • isMeta     │
└──────────────┘          └──────────────┘          └──────────────┘
```

### Key Integration Points Summary

| Module | Integration | Purpose |
|--------|-------------|---------|
| **Agent Loop** | `enqueueMessage({isMeta: true})` | Inject cron prompts |
| **System Reminder** | `isMeta: true` flag | Hide from UI transcript |
| **Team Mode** | `agentId` field, `iM()` filter | Per-teammate task isolation |
| **Feature Flags** | `tengu_kairos_cron` | Enable/disable feature |
| **File System** | `.claude/scheduled_tasks.json` | Durable task persistence |
| **Telemetry** | `tengu_scheduled_task_*` | Usage tracking |
| **Skill System** | `/loop` command | User-facing interface |
| **Tool System** | CronCreate/Delete/List | Agent interface |
| **Hooks** | PreToolUse/PostToolUse | Hook integration |

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FEATURE FLAG CHECK                                   │
│                         isKairosCronEnabled()                               │
│                              ↓                                               │
│                    CLAUDE_CODE_DISABLE_CRON?                                │
│                    ┌───────┴───────┐                                         │
│                    │ false         │ true                                   │
│                    ↓               ↓                                         │
│              ┌───────────┐   ┌──────────────┐                               │
│              │ ENABLED   │   │  DISABLED    │                               │
│              └─────┬─────┘   └──────────────┘                               │
└────────────────────┼────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SCHEDULER CREATION                                   │
│                         createCronScheduler()                               │
│                              ↓                                               │
│        ┌─────────────────────┼─────────────────────┐                        │
│        ↓                     ↓                     ↓                        │
│  ┌───────────┐        ┌───────────┐        ┌───────────┐                   │
│  │ onFire    │        │ isLoading │        │ isKilled  │                   │
│  │ callback  │        │ check     │        │ check     │                   │
│  └─────┬─────┘        └───────────┘        └───────────┘                   │
│        ↓                                                                    │
└────────┼────────────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MESSAGE INJECTION                                    │
│                         enqueueMessage()                                     │
│                              ↓                                               │
│        ┌───────────────────────────────────────────────────────┐            │
│        │  {                                                       │            │
│        │    mode: "prompt",                                       │            │
│        │    value: "<scheduled prompt>",                          │            │
│        │    priority: "later",          ← Wait until idle       │            │
│        │    isMeta: true,               ← Hidden from UI        │            │
│        │    workload: "cron"            ← Classification        │            │
│        │  }                                                       │            │
│        └───────────────────────────────────────────────────────┘            │
│                              ↓                                               │
└──────────────────────────────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT LOOP PROCESSING                                │
│                         mainAgentLoop()                                      │
│                              ↓                                               │
│        ┌─────────────────────┼─────────────────────┐                        │
│        ↓                     ↓                     ↓                        │
│  ┌───────────┐        ┌───────────┐        ┌───────────┐                   │
│  │ Priority  │        │ Idle      │        │ Execute   │                   │
│  │ Queue     │        │ Check     │        │ Prompt    │                   │
│  └───────────┘        └───────────┘        └───────────┘                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Missed Task Handling

### Detection Algorithm

**Location:** chunks.145.mjs:821-837

When Claude restarts, the scheduler checks for one-shot tasks whose scheduled time has passed:

```javascript
// ============================================
// findMissedOneShots (Y7q) - Detect missed one-shot tasks
// Location: chunks.145.mjs:821-837
// ============================================

// READABLE (for understanding):
function findMissedOneShots(tasks, now) {
    return tasks.filter(task => {
        // Only one-shot tasks (recurring tasks just fire at next interval)
        if (task.recurring) return false;

        // Calculate the scheduled time from cron expression
        const scheduledTime = getNextCronMatch(task.cron, task.createdAt);
        if (scheduledTime === null) return false;

        // Task should have fired but hasn't
        return scheduledTime < now;
    });
}
```

### Notification Flow

When missed tasks are detected:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SCHEDULER STARTUP                                     │
│                        createCronScheduler.start()                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CHECK FOR MISSED ONE-SHOTS                            │
│                        findMissedOneShots(durableTasks, now)                │
│                                                                              │
│  • Filter non-recurring tasks                                               │
│  • Calculate scheduledTime from cron + createdAt                            │
│  • Check if scheduledTime < now                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
        ┌───────────────────┐           ┌───────────────────┐
        │ No missed tasks   │           │ Missed tasks found│
        │ Continue normal   │           │ Fire notification │
        │ operation         │           │ to agent          │
        └───────────────────┘           └───────────────────┘
                                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NOTIFICATION MESSAGE                                  │
│                        formatMissedTasksMessage (bhq)                        │
│                                                                              │
│  "The following one-shot scheduled task was missed while Claude was         │
│   not running. It has already been removed from                            │
│   .claude/scheduled_tasks.json.                                             │
│                                                                              │
│   Do NOT execute this prompt yet. First use the AskUserQuestion tool to     │
│   ask whether to run it now. Only execute if the user confirms."            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AGENT ACTION                                          │
│                                                                              │
│  1. Agent receives notification as meta message                             │
│  2. Agent calls AskUserQuestion: "Run missed task?"                         │
│  3. User confirms or declines                                               │
│  4. If confirmed, agent executes the prompt                                 │
│  5. Task already deleted from storage (no cleanup needed)                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Message Format

**Location:** chunks.186.mjs:251-266

```javascript
// ============================================
// formatMissedTasksMessage (bhq) - Format notification
// Location: chunks.186.mjs:251-266
// ============================================

// READABLE (for understanding):
function formatMissedTasksMessage(missedTasks) {
    const isPlural = missedTasks.length > 1;
    const header = isPlural
        ? `The following one-shot scheduled tasks were missed while Claude was not running. They have already been removed from .claude/scheduled_tasks.json.`
        : `The following one-shot scheduled task was missed while Claude was not running. It has already been removed from .claude/scheduled_tasks.json.`;

    const instruction = isPlural
        ? `Do NOT execute these prompts yet. First use the AskUserQuestion tool to ask whether to run each one now. Only execute if the user confirms.`
        : `Do NOT execute this prompt yet. First use the AskUserQuestion tool to ask whether to run it now. Only execute if the user confirms.`;

    const taskList = missedTasks.map(task => {
        const schedule = formatCronHumanReadable(task.cron);
        const created = formatDate(task.createdAt);
        return `[${schedule}, created ${created}]\n\`\`\`\n${task.prompt}\n\`\`\``;
    }).join('\n\n');

    return `${header}\n\n${instruction}\n\n${taskList}`;
}
```

### Integration with Session State

Missed tasks are detected only from durable storage (`scheduled_tasks.json`), not session-scoped tasks:

```javascript
// Session-scoped tasks die with the session
// Durable tasks persist and are checked on restart

async function checkMissedTasksOnStartup() {
    const durableTasks = await readDurableTasks();
    const missedTasks = findMissedOneShots(durableTasks, Date.now());

    if (missedTasks.length > 0) {
        // Delete missed tasks from storage (they've been "consumed")
        const missedIds = missedTasks.map(t => t.id);
        await deleteCronTasks(missedIds);

        // Notify agent
        const message = formatMissedTasksMessage(missedTasks);
        onFire(message);
    }
}
```

---

## 8. Telemetry Integration

### Telemetry Events Emitted

The cron system emits telemetry for monitoring and debugging:

| Event Name | When Fired | Properties | Source Location |
|------------|------------|------------|-----------------|
| `tengu_scheduled_task_fire` | Task fires | `{ recurring, taskId }` | chunks.186.mjs:154-157 |
| `tengu_scheduled_task_missed` | Missed one-shot detected | `{ count, taskIds }` | chunks.186.mjs:133-138 |
| `tengu_scheduled_task_expired` | 3-day expiry | `{ taskId, ageHours }` | chunks.186.mjs:161-165 |

### Telemetry Implementation

```javascript
// ============================================
// Telemetry Emission Points
// Location: chunks.186.mjs
// ============================================

// When task fires (line 154-157)
d("tengu_scheduled_task_fire", {
    recurring: task.recurring ?? false,
    taskId: task.id
});

// When missed one-shot tasks detected on startup (line 133-138)
d("tengu_scheduled_task_missed", {
    count: missedTasks.length,
    taskIds: missedTasks.map(t => t.id).join(",")
});

// When recurring task expires after 3 days (line 161-165)
d("tengu_scheduled_task_expired", {
    taskId: task.id,
    ageHours: Math.floor((now - task.createdAt) / 1000 / 60 / 60)
});

// Mapping: d→emitTelemetry
```

### Log Messages

The system also emits structured log messages:

| Log Message | When | Level |
|-------------|------|-------|
| `[ScheduledTasks] acquired scheduler lock (PID ${pid})` | Lock acquired | info |
| `[ScheduledTasks] scheduler lock held by session ${sessionId}` | Lock unavailable | info |
| `[ScheduledTasks] recovering stale scheduler lock from PID ${pid}` | Stale lock recovery | info |
| `[ScheduledTasks] scheduled ${id} for ${time}` | Task scheduled | debug |
| `[ScheduledTasks] firing ${id}${recurring ? " (recurring)" : ""}` | Task firing | debug |
| `[ScheduledTasks] recurring task ${id} aged out` | 3-day expiry | debug |
| `[ScheduledTasks] surfaced ${count} missed one-shot task(s)` | Missed tasks found | debug |
| `[ScheduledTasks] teammate ${agentId} gone, removing orphaned cron ${id}` | Orphan cleanup | debug |

---

## 9. Hook System Integration

### Tool Defer and Hooks

The cron tools have `shouldDefer: true`, meaning they integrate with the hook system for defer decisions:

```javascript
// Location: chunks.145.mjs:954, 1070, 1177
const CronCreateTool = {
    shouldDefer: true,  // Can be deferred by hooks
    // ...
};
```

### Hook Points

| Hook Type | Cron Integration | Notes |
|-----------|------------------|-------|
| PreToolUse | CronCreate/Delete can trigger hooks | Hooks can block cron operations |
| PostToolUse | Hook fires after cron tool completes | v2.1.76: PostCompact fires after compaction |
| Notification | Cron fire notifications use `isMeta: true` | Hooks can process meta messages |

### PostCompact Hook Integration

When auto-compact runs, the PostCompact hook fires. Cron jobs are preserved through compaction:

```javascript
// Cron jobs survive compaction because:
// 1. They are stored in sessionCronTasks[] (separate from messages)
// 2. Durable tasks are in .claude/scheduled_tasks.json
// 3. Scheduler maintains scheduledTimes Map separately
```

---

## 10. MCP Protocol Integration

### MCP Tools for Cron

Cron tools are available to MCP servers via the tool delegation system:

```javascript
// ============================================
// TEAM_DELEGATE_TOOLS - Tools available to MCP delegates
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// READABLE (for understanding):
const TEAM_DELEGATE_TOOLS = new Set([
    "Agent",          // TR - Spawn subagents
    "Task",           // lt - Task management
    "TodoWrite",      // it - Todo list
    "TaskOutput",     // ck - Get task output
    "NotebookEdit",   // hI - Edit Jupyter notebooks
    "CronCreate",     // ER - Schedule cron jobs
    "CronDelete",     // ed - Cancel cron jobs
    "CronList"        // SW6 - List cron jobs
]);

// Mapping: WY4→TEAM_DELEGATE_TOOLS, TR→"Agent", lt→"Task", it→"TodoWrite",
//          ck→"TaskOutput", hI→"NotebookEdit", ER→"CronCreate", ed→"CronDelete", SW6→"CronList"
```

**Why Cron tools are in TEAM_DELEGATE_TOOLS:**

1. **Teammate agents** can schedule their own cron jobs (isolated by agentId)
2. **MCP servers** can create recurring monitoring tasks
3. **Background workflows** can poll for status changes

### MCP Server Access

MCP servers can:
1. **Create cron jobs** via `CronCreate` tool
2. **List cron jobs** via `CronList` tool
3. **Delete cron jobs** via `CronDelete` tool

### Teammate Agent Isolation

When teammates use cron tools:

```javascript
// CronCreate with agentId
const result = await CronCreate({
    cron: "*/5 * * * *",
    prompt: "/check-my-tasks",
    recurring: true
    // agentId automatically set by getTeammateContext()
});

// CronList only shows own jobs
const tasks = await CronList();
// Returns only tasks where task.agentId === currentAgentId
```

### MCP Resource Integration

Cron jobs can reference MCP resources:
- Prompts can include MCP tool calls
- Durable tasks persist across MCP server restarts
- Session-scoped tasks tied to MCP session lifetime

---

## 11. Auto-Compaction Integration

### Compaction Survival

Cron jobs survive auto-compact because:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTO-COMPACTION FLOW                                  │
│                                                                              │
│  1. Messages compacted → summarized/removed                                 │
│  2. sessionCronTasks[] NOT affected (separate storage)                      │
│  3. .claude/scheduled_tasks.json NOT affected (file-based)                  │
│  4. scheduledTimes Map maintained by scheduler                              │
│  5. PostCompact hook fires (v2.1.76)                                        │
│                                                                              │
│  Result: Cron jobs continue uninterrupted                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### isMeta Flag and Compaction

Cron messages use `isMeta: true` which affects compaction:
- Meta messages are included in compaction analysis
- They don't appear in the UI transcript
- Token counting includes them

---

## 12. Cross-Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MODULE DEPENDENCIES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

                            ┌──────────────────┐
                            │   36_loop_cron   │
                            │   (this module)  │
                            └────────┬─────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────┐          ┌──────────────────┐          ┌───────────────────┐
│ 03_llm_core   │          │ 04_system_reminder│          │ 09_slash_command  │
│               │          │                  │          │                   │
│ • Agent loop  │          │ • isMeta flag    │          │ • /loop command   │
│ • Message     │          │ • Attachment     │          │ • Skill           │
│   injection   │          │   types          │          │   registration    │
└───────────────┘          └──────────────────┘          └───────────────────┘
        │                            │                            │
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────┐          ┌──────────────────┐          ┌───────────────────┐
│15_state_      │          │ 17_telemetry     │          │ 30_agent_teams    │
│management     │          │                  │          │                   │
│               │          │ • Event emission │          │ • Teammate        │
│ • Session     │          │ • Logging        │          │   isolation       │
│   state       │          │ • Debug traces   │          │ • agentId         │
│ • Persistence │          │                  │          │   ownership       │
└───────────────┘          └──────────────────┘          └───────────────────┘

        ┌────────────────────────────────────────────────────────┐
        │                                                        │
        ▼                                                        ▼
┌───────────────┐                                       ┌───────────────────┐
│ 16_file_      │                                       │ 11_hooks          │
│system         │                                       │                   │
│               │                                       │ • PreToolUse      │
│ • File        │                                       │ • PostToolUse     │
│   watching    │                                       │ • PostCompact     │
│ • Lock files  │                                       │                   │
└───────────────┘                                       └───────────────────┘
```

---

## 13. System Reminder Deep Integration

### isMeta Flag Processing

**What it does:** Cron messages use `isMeta: true` to hide them from the main chat UI while still being processed by the LLM.

**Location:** chunks.187.mjs:571-586, chunks.195.mjs:1948-1986

```javascript
// ============================================
// Cron Message Injection with isMeta
// Location: chunks.187.mjs:571-586
// ============================================

// ORIGINAL (for source lookup):
_0({
    mode: "prompt",
    value: T6,
    uuid: WD(),
    priority: "later",
    isMeta: !0,
    workload: rA1
}), i()

// READABLE (for understanding):
enqueueMessage({
    mode: "prompt",        // Type: user prompt
    value: promptText,     // The cron prompt
    uuid: generateUUID(),  // Unique message ID
    priority: "later",     // Wait until idle (not immediate)
    isMeta: true,          // Hidden from UI transcript
    workload: "cron"       // Classification for telemetry
});
triggerProcessing();
```

### priority: "later" Semantics

| Priority | Behavior | Used By |
|----------|----------|---------|
| `"immediate"` | Process right away, interrupts current work | User messages |
| `"later"` | Queue for processing when idle | Cron jobs, background tasks |
| `"deferred"` | Even lower priority | System maintenance |

**Why "later" for cron?**
- Cron jobs shouldn't interrupt ongoing work
- User experience: they see their work finish before cron fires
- Prevents race conditions with active tool use

### Message Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CRON MESSAGE PROCESSING                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    Cron fires
          │
          ▼
    ┌──────────────────────┐
    │ onFire(promptText)   │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────────────────────────────────────────┐
    │ enqueueMessage({                                         │
    │   mode: "prompt",                                        │
    │   value: promptText,                                     │
    │   priority: "later",     ← Queued, not immediate        │
    │   isMeta: true,          ← Hidden from UI               │
    │   workload: "cron"       ← Telemetry classification     │
    │ })                                                       │
    └──────────────────────────┬───────────────────────────────┘
                               │
                               ▼
    ┌──────────────────────────────────────────────────────────┐
    │ Message Queue                                             │
    │                                                           │
    │   [user_message_1] ← being processed                      │
    │   [user_message_2] ← waiting (priority: immediate)        │
    │   [cron_prompt_1] ← waiting (priority: later)  ← CRON     │
    │   [cron_prompt_2] ← waiting (priority: later)  ← CRON     │
    │                                                           │
    └──────────────────────────┬───────────────────────────────┘
                               │
                               ▼
    ┌──────────────────────────────────────────────────────────┐
    │ When queue empty and agent idle:                         │
    │   → Pop next "later" message                             │
    │   → Process as if user typed it                          │
    │   → Execute prompt                                       │
    │   → LLM sees it but user doesn't see it in transcript    │
    └──────────────────────────────────────────────────────────┘
```

### Attachment Type Clarification

**Note:** Cron does NOT have a dedicated `cron_job` attachment type in the System Reminder system. Instead:

| Attachment Type | Purpose | Used By |
|-----------------|---------|---------|
| `queued_command` | Shows queued prompts | Queued user commands |
| `task_reminder` | Background task status | Task system |
| (N/A) | Cron prompts | Just `isMeta: true` messages |

**Why no dedicated type?**
1. Simplicity: Cron prompts execute immediately when processed
2. No persistence needed in attachments
3. Uses existing message queue infrastructure
4. `isMeta: true` already handles the hiding behavior

---

## 14. Teammate Orphaned Task Cleanup

### Problem

When a teammate (subagent) terminates, its cron jobs become orphaned:
- The teammate is gone
- The cron job still exists
- When it fires, there's no task to route to

### Solution: onFireTask Cleanup

**Location:** chunks.195.mjs:1967-1976

```javascript
// ============================================
// onFireTask - Handle teammate tasks with cleanup
// Location: chunks.195.mjs:1967-1976
// ============================================

// ORIGINAL (for source lookup):
onFireTask: (O) => {
    if (O.agentId) {
        let $ = _g(O.agentId, Y.getState().tasks);
        if ($ && !LJ6($.status)) {
            tQ6($.id, O.prompt, z);
            return
        }
        k(`[ScheduledTasks] teammate ${O.agentId} gone, removing orphaned cron ${O.id}`), yz6([O.id]);
        return
    }
    _(O.prompt)
}

// READABLE (for understanding):
onFireTask: (task) => {
    if (task.agentId) {
        // This task belongs to a teammate
        const teammateTask = findTaskById(task.agentId, store.getState().tasks);

        if (teammateTask && !isTaskTerminal(teammateTask.status)) {
            // Teammate is still alive - route prompt to their task queue
            dispatchTaskPrompt(teammateTask.id, task.prompt, dispatch);
            return;
        }

        // Teammate is gone (terminated or finished) - cleanup orphaned cron
        log(`[ScheduledTasks] teammate ${task.agentId} gone, removing orphaned cron ${task.id}`);
        deleteCronTasks([task.id]);
        return;
    }

    // Regular task (no agentId) - just fire the prompt
    firePrompt(task.prompt);
}
```

### Cleanup Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TEAMMATE ORPHANED TASK CLEANUP                            │
└─────────────────────────────────────────────────────────────────────────────┘

    Cron job fires (owned by teammate)
                 │
                 ▼
    ┌────────────────────────────┐
    │ onFireTask(task) called    │
    │ task.agentId = "teammate1" │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────────────────────┐
    │ findTaskById(agentId, tasks)                               │
    │                                                             │
    │ Look for teammate's task in task store                     │
    └────────────────────────────┬───────────────────────────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              │                                     │
              ▼                                     ▼
    ┌─────────────────────┐              ┌─────────────────────────┐
    │ Teammate FOUND      │              │ Teammate NOT FOUND      │
    │ and ALIVE           │              │ or TERMINAL status      │
    │                     │              │                         │
    │ dispatchTaskPrompt( │              │ log("teammate gone")    │
    │   taskId, prompt)   │              │ deleteCronTasks([id])   │
    │                     │              │                         │
    │ Result: Prompt      │              │ Result: Cron deleted,   │
    │ routed to teammate  │              │ no further fires        │
    └─────────────────────┘              └─────────────────────────┘
```

### Terminal Status Check

**Why check `!isTaskTerminal(status)`?**

A teammate task can be in these states:
- `pending` / `in_progress` → Still working, route to it
- `completed` / `failed` / `cancelled` → Terminal, clean up cron

```javascript
function isTaskTerminal(status) {
    return ['completed', 'failed', 'cancelled'].includes(status);
}
```

---

## 15. Additional Cross-Module Interactions

### Permission System Integration

| Check | Location | Behavior |
|-------|----------|----------|
| Tool enabled | `isEnabled()` | `isKairosCronEnabled()` |
| Max jobs | `validateInput()` | Check 50 job limit |
| Teammate durable | `validateInput()` | Block durable for teammates |
| Ownership | `CronDelete.validateInput()` | Only delete own jobs |

### State Management Integration

| State Variable | Module | Purpose |
|----------------|--------|---------|
| `sessionCronTasks[]` | Module 15 | In-memory task storage |
| `scheduledTasksEnabled` | Module 15 | Feature active flag |
| `sessionCreatedTeams` | Module 15 | Team isolation |

### File System Integration

| File | Purpose | Created By |
|------|---------|------------|
| `.claude/scheduled_tasks.json` | Durable tasks | `writeDurableTasks` (eAq) |
| `.claude/scheduled_tasks.lock` | Inter-process lock | `tryCreateLockFile` (Ehq) |

---

## 16. Load Distribution Strategy (Thundering Herd Prevention)

### Problem Statement

When multiple users across the globe schedule tasks at the same times (e.g., "9am daily", "hourly"), they create synchronized API requests that can overwhelm backend services. This is known as the **thundering herd problem**.

### Solution: Multi-Layer Jitter

The cron system implements two complementary strategies for load distribution:

1. **LLM Guidance** - The `CRON_CREATE_PROMPT` instructs the LLM to avoid `:00` and `:30` minute marks
2. **Deterministic Jitter** - The scheduler adds hash-based randomization to actual fire times

### Layer 1: LLM Prompt Guidance

**Location:** chunks.91.mjs:229-237

```javascript
// ============================================
// CRON_CREATE_PROMPT - Load Distribution Guidance
// Location: chunks.91.mjs:229-237
// ============================================

// From the tool prompt:
"## Avoid the :00 and :30 minute marks when the task allows it

Every user who asks for '9am' gets \`0 9\`, and every user who asks for 'hourly'
gets \`0 *\` — which means requests from across the planet land on the API at
the same instant. When the user's request is approximate, pick a minute that
is NOT 0 or 30:
  'every morning around 9' → '57 8 * * *' or '3 9 * * *' (not '0 9 * * *')
  'hourly' → '7 * * * *' (not '0 * * * *')
  'in an hour or so, remind me to...' → pick whatever minute you land on, don't round

Only use minute 0 or 30 when the user names that exact time and clearly means it
('at 9:00 sharp', 'at half past', coordinating with a meeting). When in doubt,
nudge a few minutes early or late — the user will not notice, and the fleet will."
```

**Why this works:**
- LLMs naturally round to clean numbers (`:00`, `:30`)
- Explicit instructions guide them to spread load
- User experience is not affected (most users don't notice 8:57 vs 9:00)

### Layer 2: Deterministic Jitter Implementation

**Location:** chunks.145.mjs:804-819, chunks.186.mjs:152

The scheduler adds jitter at runtime, ensuring tasks don't fire at exact scheduled times:

```javascript
// ============================================
// calculateNextRecurringTime (XF8) - Jitter for recurring tasks
// calculateNextOneShotTime (K7q) - Jitter for one-shot tasks
// Location: chunks.145.mjs:804-819
// ============================================

// ORIGINAL (for source lookup):
function XF8(A, q, K, Y = Lz6) {
    let z = IT6(A, q);
    if (z === null) return null;
    let _ = IT6(A, z);
    if (_ === null) return z;
    let w = Math.min(q7q(K) * Y.recurringFrac * (_ - z), Y.recurringCapMs);
    return z + w
}

function K7q(A, q, K, Y = Lz6) {
    let z = IT6(A, q);
    if (z === null) return null;
    if (new Date(z).getMinutes() % Y.oneShotMinuteMod !== 0) return z;
    let _ = Y.oneShotFloorMs + q7q(K) * (Y.oneShotMaxMs - Y.oneShotFloorMs);
    return Math.max(z - _, q)
}

// READABLE (for understanding):
function calculateNextRecurringTime(cronExpr, createdAt, jobId, config = DEFAULT_JITTER_CONFIG) {
    // Get the next scheduled time (without jitter)
    const nextTime = getNextCronMatch(cronExpr, createdAt);
    if (nextTime === null) return null;

    // Get the time after that (to calculate period)
    const periodStart = getNextCronMatch(cronExpr, nextTime);
    if (periodStart === null) return nextTime;

    // Jitter = hash(jobId) * fraction * period, capped
    const period = periodStart - nextTime;
    const jitterMs = Math.min(
        hashJobId(jobId) * config.recurringFrac * period,
        config.recurringCapMs
    );

    return nextTime + jitterMs;  // Fire late by up to jitterMs
}

function calculateNextOneShotTime(cronExpr, createdAt, jobId, config = DEFAULT_JITTER_CONFIG) {
    const scheduledTime = getNextCronMatch(cronExpr, createdAt);
    if (scheduledTime === null) return null;

    // Only jitter if scheduled at :00 or :30
    const scheduledMinute = new Date(scheduledTime).getMinutes();
    if (scheduledMinute % config.oneShotMinuteMod !== 0) {
        return scheduledTime;  // No jitter for off-minute schedules
    }

    // Jitter = floor + hash(jobId) * (max - floor), subtracted (fire early)
    const jitterMs = config.oneShotFloorMs +
        hashJobId(jobId) * (config.oneShotMaxMs - config.oneShotFloorMs);

    return Math.max(scheduledTime - jitterMs, Date.now());  // Fire early by jitterMs
}

// Mapping: XF8→calculateNextRecurringTime, K7q→calculateNextOneShotTime,
//          IT6→getNextCronMatch, q7q→hashJobId, Lz6→DEFAULT_JITTER_CONFIG
```

### Jitter Configuration

**Location:** chunks.145.mjs:841-847

```javascript
// ============================================
// DEFAULT_JITTER_CONFIG - Jitter parameters
// Location: chunks.145.mjs:841-847
// ============================================

// ORIGINAL (for source lookup):
Lz6 = {
    recurringFrac: 0.1,
    recurringCapMs: 900000,
    oneShotMaxMs: 90000,
    oneShotFloorMs: 0,
    oneShotMinuteMod: 30
}

// READABLE (for understanding):
const DEFAULT_JITTER_CONFIG = {
    recurringFrac: 0.1,      // 10% of period (max jitter for recurring)
    recurringCapMs: 900000,  // 15 minutes max delay for recurring
    oneShotMaxMs: 90000,     // 90 seconds max early fire for one-shot
    oneShotFloorMs: 0,       // Minimum early fire for one-shot
    oneShotMinuteMod: 30     // Only jitter :00 and :30 minutes
};
```

### Hash-Based Determinism

**Location:** chunks.145.mjs:799-802

```javascript
// ============================================
// hashJobId (q7q) - Deterministic hash for jitter
// Location: chunks.145.mjs:799-802
// ============================================

// ORIGINAL (for source lookup):
function q7q(A) {
    let q = parseInt(A.slice(0, 8), 16) / 4294967296;
    return Number.isFinite(q) ? q : 0
}

// READABLE (for understanding):
function hashJobId(jobId) {
    // Job IDs are hex strings like "a3f2c1b9..."
    // Take first 8 characters (32 bits), convert to number 0-1
    const hash = parseInt(jobId.slice(0, 8), 16) / 0x100000000;
    return Number.isFinite(hash) ? hash : 0;
}

// Example:
// jobId = "a3f2c1b9d4e5f6..."
// hashJobId("a3f2c1b9...") = 0xa3f2c1b9 / 0x100000000 ≈ 0.638
```

**Why hash-based?**
- **Deterministic**: Same job ID always gets same jitter
- **Uniform distribution**: Job IDs are random hex, giving good spread
- **No state needed**: No need to store jitter values
- **Restart-safe**: Jitter is recalculated correctly after restart

### Jitter Behavior Summary

| Task Type | Jitter Direction | Max Amount | Condition |
|-----------|------------------|------------|-----------|
| Recurring | Fire LATE | 10% of period, max 15 min | Always |
| One-shot at :00 or :30 | Fire EARLY | 0-90 seconds | Only at :00/:30 |
| One-shot at other times | No jitter | N/A | Off-minute schedules |

### Load Distribution Visualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOAD DISTRIBUTION WITH JITTER                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Without Jitter (all tasks at :00):                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  │         │         │         │         │         │              │   │
│  │  ▼         │         │         │         │         │    :00       │   │
│  │  █         │         │         │         │         │              │   │
│  │  █         │         │         │         │         │              │   │
│  │  █         │         │         │         │         │              │   │
│  │  ↑         │         │         │         │         │              │   │
│  │  All tasks fire here, overwhelming API                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  With Jitter (tasks spread across period):                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ▓▓░░░░░░▓▓░░░░░░▓▓░░░░░░▓▓░░░░░░▓▓░░░░░░▓▓                        │   │
│  │  ▓▓░░░░░░▓▓░░░░░░▓▓░░░░░░▓▓░░░░░░▓▓░░░░░░▓▓                        │   │
│  │                                                                          │   │
│  │  Tasks spread across 10% of period (e.g., 6 min for hourly)          │   │
│  │  Each job has deterministic offset based on its ID                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Legend: ▓▓ = task fires, ░░ = idle                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dynamic Jitter Configuration

**Location:** chunks.186.mjs:288-310

Jitter configuration can be overridden via feature flag:

```javascript
// ============================================
// getCronJitterConfig (Ws8) - Dynamic config
// Location: chunks.186.mjs:288-310
// ============================================

// ORIGINAL (for source lookup):
function Ws8() {
    let A = lk("tengu_kairos_cron_config", Lz6, vXz),
        q = NXz().safeParse(A);
    return q.success ? q.data : Lz6
}

// READABLE (for understanding):
function getCronJitterConfig() {
    // Fetch config from feature flag service (60s cache)
    const remoteConfig = getFeatureFlag(
        "tengu_kairos_cron_config",
        DEFAULT_JITTER_CONFIG,
        60000  // JITTER_CONFIG_CACHE_MS
    );

    // Validate against schema
    const parsed = jitterConfigSchema.safeParse(remoteConfig);
    return parsed.success ? parsed.data : DEFAULT_JITTER_CONFIG;
}

// Schema validates:
// - recurringFrac: 0-1
// - recurringCapMs: 0-1800000 (max 30 min)
// - oneShotMaxMs: 0-1800000
// - oneShotFloorMs <= oneShotMaxMs
// - oneShotMinuteMod: 1-60
```

---

## Related Modules

| Module | Integration Point |
|--------|-------------------|
| [03_llm_core](../03_llm_core/) | Agent loop where cron fires |
| [04_system_reminder](../04_system_reminder/) | isMeta flag processing |
| [09_slash_command](../09_slash_command/) | /loop command registration |
| [11_hooks](../11_hooks/) | Pre/Post tool hooks, PostCompact |
| [15_state_management](../15_state_management/) | Session state for tasks |
| [16_file_system](../16_file_system/) | File watching, lock files |
| [17_telemetry](../17_telemetry/) | Event emission |
| [30_agent_teams](../30_agent_teams/) | Teammate isolation, agentId ownership |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Loop/Cron System section

### Core Integration Symbols
- `isKairosCronEnabled` (kR) - Feature flag check
- `createCronScheduler` (Ds8) - Scheduler factory
- `enqueueMessage` (w0, _0) - Message injection
- `WORKLOAD_TYPE_CRON` (rA1) - "cron" workload type
- `getTeammateContext` (iM) - Teammate isolation
- `getCronJitterConfig` (Ws8) - Jitter settings

### Missed Task Handling Symbols
- `findMissedOneShots` (Y7q) - Detect missed one-shot tasks
- `formatMissedTasksMessage` (bhq) - Format notification for agent
- `loadDurableTasks` (Mi6) - Read persisted tasks from disk
- `hasScheduledTasks` (zE1) - Check if durable tasks file has tasks
- `deleteCronTasks` (yz6) - Remove tasks from storage
- `getNextCronMatch` (IT6) - Calculate scheduled time

### Lock Management Symbols
- `acquireSchedulerLock` (Ms8) - Acquire inter-process lock
- `releaseSchedulerLock` (za6) - Release lock on shutdown
- `tryAcquireLock` (Ehq) - Atomic lock acquisition attempt
- `readLockFile` (Rhq) - Read lock file contents

### Teammate Cleanup Symbols
- `findTaskById` (_g) - Find teammate task
- `isTaskTerminal` (LJ6) - Check if task is done
- `dispatchTaskPrompt` (tQ6) - Route prompt to teammate

### Telemetry Symbols
- `d` - emitTelemetry function

### Team Delegate Symbols
- `WY4` - TEAM_DELEGATE_TOOLS Set

---

## 17. REPL Idle State Integration

### The `isLoading` Callback

**What it does:** The scheduler checks if the REPL is busy before firing tasks.

**Location:** chunks.187.mjs:571-586, chunks.186.mjs:144

```javascript
// ============================================
// isLoading Check - Prevent firing during active queries
// Location: chunks.187.mjs:584, chunks.186.mjs:144
// ============================================

// ORIGINAL (for source lookup):
// In agent loop:
isLoading: () => M || D,

// In scheduler:
function V() {
    if (H?.()) return;          // isKilled check
    if (K() && !Y) return;      // isLoading check (skip if busy, unless assistantMode)
    // ... fire tasks
}

// READABLE (for understanding):
// Agent loop passes isLoading callback:
isLoading: () => isProcessing || isShuttingDown,

// Scheduler checks before firing:
function fireTasksIfReady() {
    // Don't fire if feature is killed
    if (isKilled?.()) return;

    // Don't fire if REPL is busy (unless in assistantMode)
    if (isLoading() && !assistantMode) return;

    // ... proceed to check and fire tasks
}
```

### Idle State Detection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REPL STATE MACHINE                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     User starts query     ┌─────────────┐
│    IDLE     │ ─────────────────────────▶ │   BUSY      │
│             │                            │             │
│ isLoading:  │                            │ isLoading:  │
│   false     │                            │   true      │
│             │     Query completes        │             │
│             │ ◀───────────────────────── │             │
└─────────────┘                            └─────────────┘
      │
      │  Cron scheduler checks every 1 second:
      │
      │  if (!isLoading()) {
      │    // Check if any tasks ready to fire
      │    for (task of tasks) {
      │      if (now >= task.nextFireTime) {
      │        fire(task);
      │      }
      │    }
      │  }
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TASK FIRING WHILE IDLE                                     │
│                                                                              │
│  1. Cron task scheduled for 10:00:19 (with jitter)                          │
│  2. REPL becomes idle at 10:00:15                                           │
│  3. Scheduler checks at 10:00:19                                            │
│  4. isLoading() = false → PROCEED TO FIRE                                   │
│  5. enqueueMessage({ priority: "later", isMeta: true })                     │
│  6. REPL processes the prompt                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Priority: "later" Behavior

**Location:** Message queue processing

```javascript
// ============================================
// Priority Handling for Cron Messages
// ============================================

// Cron messages use priority: "later"
enqueueMessage({
    mode: "prompt",
    value: prompt,
    priority: "later",  // Wait until current work is done
    isMeta: true,
    workload: "cron"
});

// Priority levels and their behavior:
// - "now": Process immediately, interrupt current work
// - "next": Process after current message completes
// - "later": Process when REPL is idle and queue is empty
```

**Why "later" priority?**

1. **Non-interrupting**: Cron shouldn't interrupt active agent work
2. **Queue-based**: Messages wait in queue until REPL is free
3. **Ordered processing**: Multiple cron messages process in order
4. **User-first**: User input always takes precedence

### assistantMode Special Behavior

**Location:** chunks.186.mjs:114, chunks.186.mjs:144

```javascript
// ORIGINAL (for source lookup):
let {
    // ...
    assistantMode: Y = !1,
    // ...
} = A

// In fire check:
if (K() && !Y) return;  // Skip if busy, UNLESS assistantMode

// READABLE (for understanding):
// When assistantMode is true, tasks fire even when REPL is busy
if (isLoading() && !assistantMode) return;

// Normal mode:
// - isLoading = true → Don't fire
// - isLoading = false → Fire

// Assistant mode:
// - Fire regardless of isLoading state
```

**Why fire in assistantMode when busy?**

The `assistantMode` flag indicates the scheduler is running in a context where:
- Background processing is expected
- Non-interactive mode
- Automated workflows
- Fire-and-forget behavior

### Integration with Message Queue

**Location:** chunks.131.mjs (message queue processing)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MESSAGE QUEUE INTEGRATION                               │
└─────────────────────────────────────────────────────────────────────────────┘

                    Cron fires
                        │
                        ▼
┌──────────────────────────────────────────┐
│ enqueueMessage({                         │
│   mode: "prompt",                        │
│   value: "check the deploy status",      │
│   priority: "later",                     │
│   isMeta: true,                          │
│   workload: "cron"                       │
│ })                                       │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│           MESSAGE QUEUE                   │
│                                          │
│  [user_msg_1, user_msg_2, cron_msg]      │
│                                          │
│  Priority "later" = appended to end      │
│  Priority "next" = inserted at front     │
│  Priority "now" = processed immediately  │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│         REPL PROCESSING LOOP              │
│                                          │
│  while (queue.hasMessages()) {           │
│    const msg = queue.dequeue();          │
│    if (msg.isMeta) {                     │
│      // Process but don't show in UI     │
│    }                                     │
│    processMessage(msg);                  │
│  }                                       │
└──────────────────────────────────────────┘
```

### Combined Idle + Priority Flow

```
Scenario: User is actively working, cron fires

1. User sends message: "Analyze the codebase"
2. Agent starts processing (isLoading = true)
3. Cron task fires at scheduled time
4. Scheduler checks: isLoading() → true
5. Scheduler skips firing (waits for idle)
6. Agent completes analysis
7. isLoading → false
8. Next scheduler tick: fires the task
9. enqueueMessage({ priority: "later" })
10. Message queued behind any pending user messages
11. REPL processes cron prompt when queue is ready
```

### Key Functions

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| `isLoading` callback | `K` (in scheduler) | Check if REPL is busy |
| `assistantMode` flag | `Y` | Override busy check |
| `enqueueMessage` | `w0`, `_0` | Add to message queue |
| `isKilled` callback | `H` | Check if feature disabled |

---

**Last Updated**: 2026-03-23
**Version**: Claude Code 2.1.76
**Status**: Complete - Source verified with full integration analysis including REPL idle state