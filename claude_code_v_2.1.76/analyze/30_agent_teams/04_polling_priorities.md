# Polling Priority System - Deep Dive

> **Module**: Agent Teams - In-Process Message Priority Queue
> **Version**: Claude Code 2.1.38
> **Purpose**: Complete analysis of 5-level priority polling system

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Priority Queue Architecture](#2-priority-queue-architecture)
3. [Priority 1: Pending User Messages](#3-priority-1-pending-user-messages)
4. [Priority 2: Shutdown Requests](#4-priority-2-shutdown-requests)
5. [Priority 3: Team Lead Messages](#5-priority-3-team-lead-messages)
6. [Priority 4: Any Unread Message](#6-priority-4-any-unread-message)
7. [Priority 5: Task Auto-Claim](#7-priority-5-task-auto-claim)
8. [Design Rationale & Trade-offs](#8-design-rationale--trade-offs)

---

## 1. Executive Summary

In-process teammates use a **5-level priority queue system** to determine which work to process next. This creates a natural "interrupt hierarchy" where urgent coordination signals bypass normal work queues.

```
Priority 1 (Highest):  Pending user messages (AppState fast path)
Priority 2:            Shutdown requests (bypass entire mailbox queue)
Priority 3:            Messages from team-lead (orchestrator priority)
Priority 4:            Any unread message (FIFO within priority)
Priority 5 (Lowest):   Auto-claim next available task (backfill work)
```

**Key design insight**: The priority system prevents **starvation of critical coordination signals**. Without priorities, a teammate with 100 queued messages would process shutdown requests only after those 100 messages (potentially 50+ minutes delay). With Priority 2 bypass, shutdown is guaranteed within 1 second.

**Polling interval**: 500ms between cycles (skipped on first iteration for immediate responsiveness).

---

## 2. Priority Queue Architecture

### 2.1 Complete Poll Loop Flow

```
┌─────────────────────────────────────────────┐
│ inProcessPollLoop - Priority Queue Engine   │
└─────────────────────────────────────────────┘
           │
           ├─→ [Priority 1] Check pendingUserMessages in AppState
           │      └─→ FOUND: Return immediately (0-1ms latency)
           │      └─→ NOT FOUND: Continue
           │
           ├─→ Sleep 500ms (except first iteration)
           │
           ├─→ Check abort signal
           │      └─→ ABORTED: Return {type: "aborted"}
           │
           ├─→ Read mailbox from filesystem (all messages, read + unread)
           │
           ├─→ [Priority 2] Scan ENTIRE mailbox for shutdown_request
           │      └─→ FOUND: Mark read, return shutdown (bypass queue)
           │      └─→ NOT FOUND: Continue
           │
           ├─→ [Priority 3] Find first unread from "team-lead"
           │      └─→ FOUND: Mark read, return message
           │      └─→ NOT FOUND: Continue
           │
           ├─→ [Priority 4] Find first unread message (any sender)
           │      └─→ FOUND: Mark read, return message
           │      └─→ NOT FOUND: Continue
           │
           ├─→ [Priority 5] Try to claim next available task
           │      └─→ CLAIMED: Return task prompt
           │      └─→ NO TASKS: Continue
           │
           └─→ No work available: Loop back to Priority 1
```

### 2.2 Why This Order

| Priority Level | Rationale | Bypass Behavior |
|----------------|-----------|-----------------|
| **1 - AppState** | Fastest path (in-memory), most direct | N/A (separate queue) |
| **2 - Shutdown** | Control plane signal, must not block | Scans ALL messages first |
| **3 - Team Lead** | Orchestrator decisions override peer work | Higher than peers |
| **4 - Any Message** | Normal communication, FIFO fairness | None |
| **5 - Tasks** | Self-directed work, lowest priority | Only if no messages |

**Design philosophy**: **Control signals > Coordination > Collaboration > Self-directed work**.

---

## 3. Priority 1: Pending User Messages

### 3.1 Fast Path for In-Process Communication

**What it does**: Checks `AppState.tasks[agentId].pendingUserMessages` array for direct-injected messages from team lead.

**How it works**:

```javascript
// Priority 1 check (first thing in poll loop)
const state = await context.getAppState();
const task = findTaskByAgentId(agentId, state.tasks);

if (task?.pendingUserMessages.length > 0) {
    // Dequeue first message atomically
    const message = await context.updateAppState(s => {
        const t = findTaskByAgentId(agentId, s.tasks);
        return t.pendingUserMessages.shift();  // Remove from queue
    });

    return {
        type: "user_message",
        from: message.from,
        content: message.content,
        timestamp: new Date().toISOString()
    };
}
```

**When populated**: Team lead calls `SendMessage(recipient: "backend-dev")` for in-process teammate.

**Lead's SendMessage implementation**:
```javascript
async function handleDirectMessage(input, context) {
    const { recipient, content } = input;

    // Write to mailbox (slow path, for pane-based or if in-process offline)
    await writeToMailbox(recipient, message, teamName);

    // If recipient is in-process AND currently active, inject directly
    const state = await context.getAppState();
    const recipientTask = state.tasks.find(t =>
        t.type === "in_process_teammate" &&
        t.agentName === recipient
    );

    if (recipientTask) {
        await context.updateAppState(s => {
            const task = s.tasks.find(t => t.id === recipientTask.id);
            task.pendingUserMessages.push({
                from: getAgentName() || "team-lead",
                content
            });
        });
    }

    return { success: true };
}
```

**Why this priority exists**:

| Approach | Latency | Complexity |
|----------|---------|------------|
| **Priority 1 fast path** (chosen) | 0-1ms (instant) | Moderate (dual-write) |
| **Mailbox only** | 0-500ms (polling delay) | Simple (single write) |

**Design decision**: In-process teammates share memory with lead → exploit this for <1ms message delivery. Mailbox is fallback/persistence layer.

**Trade-off**: Dual-write complexity (both AppState + mailbox). Mailbox write failure doesn't block fast delivery.

### 3.2 Dequeue Semantics

**Atomic shift** via `updateAppState`:

```javascript
const message = await context.updateAppState(state => {
    const task = state.tasks.find(t => t.agentId === agentId);
    return task.pendingUserMessages.shift();  // Returns AND removes
});
```

**Why atomic**: Prevents duplicate delivery if multiple poll loop iterations run concurrently (shouldn't happen, but defensive).

**First check, then sleep**: Priority 1 checked BEFORE 500ms sleep → immediate delivery if message available.

```
Timeline:
T0:    Poll loop starts, checks Priority 1 → empty
T0+1ms: Lead sends message → injects to pendingUserMessages
T0+2ms: Poll loop sleeps 500ms
...
T0+502ms: Poll loop wakes, checks Priority 1 → FOUND → returns immediately

Latency: 500ms (unlucky timing)
```

**Best case**: Message arrives during Priority 1 check → 0ms latency.

**Why acceptable**: Average latency ~250ms (random arrival within 500ms window). For in-process coordination, this is adequate.

---

## 4. Priority 2: Shutdown Requests

### 4.1 The Shutdown Bypass Algorithm

**Problem**: Teammate has 100 unread messages. Lead sends shutdown request (message #101). Without prioritization, teammate processes messages sequentially for 50+ minutes before reaching shutdown.

**Solution**: Scan ENTIRE mailbox for shutdown requests BEFORE processing any normal messages.

**Implementation**:

```javascript
// ============================================
// Priority 2: Shutdown request scan (bypass queue)
// Location: inProcessPollLoop, chunks.131.mjs:260-346
// ============================================

const mailbox = await readMailbox(agentName, teamName);

// Scan ALL messages (read + unread)
for (let i = 0; i < mailbox.length; i++) {
    const msg = mailbox[i];

    if (!msg.read) {
        const shutdownReq = parseShutdownRequest(msg.text);

        if (shutdownReq) {
            // CRITICAL PATH: Shutdown found, bypass remaining messages
            await markMessageAsReadByIndex(agentName, teamName, i);

            const skippedCount = mailbox.filter(m => !m.read).length - 1;
            console.log(
                `[Priority 2] Shutdown request prioritized over ` +
                `${skippedCount} unread messages`
            );

            return {
                type: "shutdown_request",
                requestId: shutdownReq.requestId,
                from: msg.from
            };
        }
    }
}

// No shutdown found, continue to Priority 3
```

**Key insight**: Shutdown detection is **O(N) scan** where N = total mailbox size. This is **intentionally expensive** to guarantee shutdown never starves.

### 4.2 Why Scan ALL Messages

**Alternative considered**: Only scan unread messages (skip read ones).

**Problem with alternative**:
```
Scenario: Mailbox has 50 read messages, then 100 unread messages, then shutdown request.
If scanning only unread: Start at message #51, find shutdown at #151 (scan 100 messages).
Current approach: Scan all 151 messages (slightly more work, but guarantees find shutdown).
```

**Chosen approach scans ALL** because:
1. **Simplicity**: Don't need to track "first unread index"
2. **Correctness**: Never miss shutdown regardless of mailbox state
3. **Performance**: O(N) scan is <1ms for typical mailboxes (<100 messages)

### 4.3 Shutdown Request Format

**JSON in message text**:
```json
{
  "type": "shutdown_request",
  "request_id": "uuid-123"
}
```

**Parsing**:
```javascript
function parseShutdownRequest(messageText) {
    try {
        const parsed = JSON.parse(messageText);
        if (parsed.type === "shutdown_request" && parsed.request_id) {
            return { requestId: parsed.request_id };
        }
    } catch {
        // Not JSON or not shutdown request
    }
    return null;
}
```

**Why request_id**: Allows shutdown_response to reference the specific request (multiple shutdown attempts might be in flight).

### 4.4 Performance Impact

**Worst case**: 10,000 message mailbox, shutdown at position 9,999.

```
Scan time: 10,000 × (JSON.parse attempt + type check) ≈ 10-20ms
Acceptable: Even huge mailboxes scanned in <100ms
```

**Mitigation for huge mailboxes**: Mailbox compaction (archive read messages). Not implemented yet.

### 4.5 Why Priority 2 > Priority 3

**Why shutdown beats team-lead messages**:

```
Scenario: Lead sends 50 coordination messages, then shutdown request.
If Priority 3 (lead) came first: Process 50 messages before shutdown (15+ minutes).
With Priority 2 (shutdown) first: Shutdown bypasses all messages (<1 second).
```

**Design rationale**: Shutdown is **termination signal**, not coordination. Should bypass ALL work.

---

## 5. Priority 3: Team Lead Messages

### 5.1 Orchestrator Prioritization

**What it does**: Finds first unread message where `msg.from === "team-lead"`.

**Implementation**:

```javascript
// Priority 3: Team lead messages
const leadMessageIndex = mailbox.findIndex(
    msg => !msg.read && msg.from === "team-lead"
);

if (leadMessageIndex !== -1) {
    await markMessageAsReadByIndex(agentName, teamName, leadMessageIndex);
    const msg = mailbox[leadMessageIndex];

    return {
        type: "team_message",
        from: msg.from,
        content: msg.text,
        timestamp: msg.timestamp
    };
}
```

**Why this priority**:

| Sender | Role | Priority |
|--------|------|----------|
| **team-lead** | Orchestrator, assigns work, provides corrections | Priority 3 (high) |
| **Teammate peer** | Collaborator, asks questions, shares info | Priority 4 (normal) |

**Use case**:
```
Mailbox state:
- Message 1 (unread): from "frontend-dev" - "What's the API format?"
- Message 2 (unread): from "team-lead" - "URGENT: Change API endpoint to /v2/users"
- Message 3 (unread): from "frontend-dev" - "Thanks!"

Without Priority 3: Process messages 1, 2, 3 in order (FIFO).
With Priority 3: Process message 2 first (team-lead), then 1, then 3.
```

**Why lead deserves priority**:

1. **Lead has global context**: Sees all teammates, coordinates plan
2. **Lead corrections are time-sensitive**: If teammate working on wrong task, lead correction should interrupt
3. **Lead-teammate communication is asymmetric**: Lead → teammate is directive, teammate → lead is informative

**Trade-off**: Peer-to-peer collaboration messages starved if lead floods teammate with messages.

**Mitigation**: Lead should batch messages or use broadcast for general announcements.

### 5.2 FIFO Within Priority

**Multiple unread lead messages**:
```
Mailbox:
- Message 5 (unread): from "team-lead" - "Implement feature A"
- Message 10 (unread): from "team-lead" - "Implement feature B"
- Message 15 (unread): from "frontend-dev" - "Question"
```

**Delivery order**: Message 5 (first lead message), then message 10 (second lead message), then message 15 (peer).

**Why FIFO within priority**: Preserves temporal ordering of lead's instructions.

---

## 6. Priority 4: Any Unread Message

### 6.1 FIFO Default Behavior

**What it does**: If no higher-priority work, process oldest unread message.

**Implementation**:

```javascript
// Priority 4: Any unread message
const anyMessageIndex = mailbox.findIndex(msg => !msg.read);

if (anyMessageIndex !== -1) {
    await markMessageAsReadByIndex(agentName, teamName, anyMessageIndex);
    const msg = mailbox[anyMessageIndex];

    return {
        type: "peer_message",
        from: msg.from,
        content: msg.text,
        timestamp: msg.timestamp
    };
}
```

**Why FIFO**:

| Approach | Pros | Cons |
|----------|------|------|
| **FIFO** (chosen) | Simple, fair, predictable | No urgency signaling |
| **LIFO** | Recent messages first | Starvation of old messages |
| **Random** | Prevents gaming | Unpredictable, confusing UX |

**FIFO chosen** because agent communication is low-volume, chronological order matches human expectation.

### 6.2 Peer Message Coordination

**Example use case**:
```
backend-dev receives:
- Message 1: from "frontend-dev" - "What's the user schema?"
- Message 2: from "db-specialist" - "Database migration complete"
- Message 3: from "frontend-dev" - "Never mind, found it in docs"
```

**Processing**: Message 1 → backend-dev responds → Message 2 → backend-dev acknowledges → Message 3 → no-op.

**Why allow peer messaging**: Teammates can unblock each other without lead intervention.

**Trade-off**: Lead loses visibility into peer-to-peer communication (not logged centrally). Mitigation: Teammates should summarize peer discussions in updates to lead.

---

## 7. Priority 5: Task Auto-Claim

### 7.1 Idle Backfill

**What it does**: If no messages available, claim next pending task from shared task ledger.

**Implementation**:

```javascript
// Priority 5: Auto-claim next available task
const taskPrompt = await claimNextTask(agentName, teamName, context);

if (taskPrompt) {
    return {
        type: "task_assignment",
        content: taskPrompt
    };
}

// No work available at all → continue poll loop (sleep 500ms, retry)
```

**When triggered**: Only if Priorities 1-4 all returned nothing.

**Why lowest priority**: Tasks are self-directed work. Direct messages (instructions, questions, shutdown) take precedence.

### 7.2 Task Claim Algorithm

**Complete flow** (obfuscated: `claimNextTask` / ib4):

```javascript
// ============================================
// claimNextTask - Claim next available task with dependency resolution
// Location: chunks.131.mjs:241
// ============================================

async function claimNextTask(agentName, teamName, context) {
    // Read all task files
    const taskDir = `~/.claude/tasks/${teamName}/`;
    const taskFiles = await fs.readdir(taskDir);

    const tasks = [];
    for (const file of taskFiles) {
        const content = await fs.readFile(`${taskDir}/${file}`, "utf-8");
        tasks.push(JSON.parse(content));
    }

    // Find next available task
    const nextTask = findNextAvailableTask(tasks);
    if (!nextTask) {
        return null;  // No claimable tasks
    }

    // Attempt to claim (with file locking)
    const claimed = await attemptToClaimTask(nextTask, agentName, taskDir);
    if (!claimed) {
        return null;  // Another agent claimed it first (race condition)
    }

    // Generate prompt for task
    return generatePromptFromTask(nextTask);
}
```

**Dependency resolution** (from `findNextAvailableTask`):

```javascript
function findNextAvailableTask(tasks) {
    const incompleteTasks = new Set(
        tasks.filter(t => t.status !== "completed").map(t => t.id)
    );

    return tasks.find(task =>
        task.status === "pending" &&
        !task.owner &&
        task.blockedBy.every(depId => !incompleteTasks.has(depId))
    );
}
```

**Why every task claim re-scans all tasks**: Task state can change (other teammates claiming/completing) between poll cycles. Re-scanning ensures fresh view.

**Performance**: ~1-5ms for 100 tasks. Acceptable for poll loop.

### 7.3 Claim Contention

**Scenario**: Two teammates both idle, both try Priority 5, both scan task list, both see task-1 available.

**Resolution**: File locking in `attemptToClaimTask` (see [01_complete_chain_analysis.md](./01_complete_chain_analysis.md#64-race-condition-handling)).

```
Teammate A: Acquire lock on task-1.json → claim succeeds
Teammate B: Attempt lock → blocks → acquire after A releases → re-read task-1 → sees owner="A" → abort claim
```

**Result**: Only one teammate claims each task.

---

## 8. Design Rationale & Trade-offs

### 8.1 Why Not Event-Driven?

**Alternative**: Use OS signals or IPC events to notify teammate of new messages.

| Approach | Pros | Cons |
|----------|------|------|
| **Polling** (chosen) | Simple, robust, cross-platform | 250ms average latency |
| **Event-driven** | 0ms latency, efficient | Complex setup, fragile (lost events) |

**Why polling chosen**:
1. **Simplicity**: Single poll loop, no event registration/cleanup
2. **Robustness**: Survives IPC failures (e.g., signal delivery issues on some OSes)
3. **Acceptable latency**: 250ms average for coordination messages is fine (agent loop iterations take seconds/minutes)

### 8.2 Why 500ms Poll Interval?

**Alternatives considered**:

| Interval | CPU Usage | Latency | I/O Load |
|----------|-----------|---------|----------|
| **50ms** | High (20 polls/sec × N agents) | ~25ms avg | Excessive fs reads |
| **500ms** (chosen) | Low (2 polls/sec) | ~250ms avg | Minimal |
| **5000ms** | Very low | ~2.5s avg | Minimal |

**500ms chosen** because:
- **Responsive enough**: User doesn't perceive lag when sending messages
- **Light enough**: 2 polls/sec × 5 agents = 10 fs reads/sec (trivial)
- **Battery friendly**: For laptop users, 500ms sleep reduces wake-ups

### 8.3 Priority Ordering Justification

**Why not flat queue** (no priorities):

```
Scenario: Teammate has 100 unread messages (mix of peer questions, lead instructions, shutdown).
Flat queue: Process in arrival order (50+ minutes to reach shutdown if each message takes 30s).
Priority queue: Shutdown processed immediately, lead messages next, peer messages last.
```

**Why this specific ordering (1 > 2 > 3 > 4 > 5)**:

| If Reordered | Problem |
|--------------|---------|
| **P4 > P3** (peers before lead) | Lead corrections delayed, teammate works on wrong task longer |
| **P3 > P2** (lead before shutdown) | Shutdown delayed by 50 lead messages (still bad, though better than 100 peer messages) |
| **P5 > P4** (tasks before messages) | Teammate ignores messages to work on tasks (defeats collaboration) |
| **P1 anywhere else** | Lose in-process fast path (defeats purpose of shared memory) |

**Current ordering is optimal** for stated design goal: "Control signals > Coordination > Collaboration > Self-directed work".

### 8.4 Starvation Analysis

**Can Priority 5 (tasks) starve?**

Yes, if messages continuously arrive. Example:
```
T0: Poll loop checks P1-P4 → all empty → checks P5 → finds task-1
T1: Before claiming task-1, new message arrives
T2: Next poll cycle checks P1-P4 → finds message → returns message
T3: After processing message, poll loop starts over
T4: New message arrives again
... (loop forever)

Result: task-1 never claimed
```

**Mitigation**: Message arrival is bursty, not continuous. Eventually message queue drains, Priority 5 reached.

**Not mitigated**: If lead floods teammate with messages continuously, tasks starve. Acceptable trade-off (lead controls workflow).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:

- `inProcessPollLoop` (WVY) - 5-level priority queue engine
- `claimNextTask` (ib4) - Task auto-claim with dependency resolution
- `findNextAvailableTask` (MVY) - Dependency-aware task selection
- `parseShutdownRequest` (ss) - Extract shutdown from message
- `markMessageAsReadByIndex` (JQ1) - Update read flag

## Source Locations

- `chunks.131.mjs:260` - inProcessPollLoop
- `chunks.131.mjs:241` - claimNextTask
- `chunks.131.mjs:222` - findNextAvailableTask
- `chunks.129.mjs:1396` - parseShutdownRequest
- `chunks.129.mjs:1130` - markMessageAsReadByIndex

---

**Document Status**: Complete analysis of 5-level priority polling system with design rationale and starvation analysis.
