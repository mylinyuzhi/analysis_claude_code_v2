# Polling Priorities — Agent Teams (v2.1.112)

## Overview

Each teammate's main loop blocks on `CXY` (`pollForNextMessage`) between turns. `CXY` implements a **5-level priority queue** that decides what the teammate should do next. The priorities are:

1. **`pendingUserMessages`** — in-memory queue from the leader's TUI (no FS access).
2. **`shutdown_request`** — scanned across the *entire* unread set, bypassing arrival order.
3. **Team-lead messages** — first unread message whose `from === Mz`.
4. **Any unread** — first unread message regardless of sender (peers, broadcasts).
5. **Auto task-claim** — `HNK()` finds the lowest-id pending unowned task with all `blockedBy` resolved, claims it, returns a synthetic prompt.

The poll interval (between mailbox checks) is **500 ms** (`yXY = 500`).

This document explains each level's mechanism, the order rationale, the auto-claim flow, and worked examples.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md).

Key functions:
- `pollForNextMessage` (`CXY`) — chunks.154.mjs:2462
- `claimUnclaimedTask` (`HNK`) — chunks.154.mjs:2443
- `findClaimableTask` (`RXY`) — chunks.154.mjs:2424
- `formatTaskPrompt` (`SXY`) — chunks.154.mjs:2433
- `parseShutdownRequest` (`i56`) — chunks.100.mjs:293
- `markMessageAsReadByIndex` (`Y18`) — chunks.100.mjs:38
- `readMailbox` (`ts`) — chunks.99.mjs:1952
- `tasksFileRead` (`Qf`) — read tasks.json
- `tasksFileUpdate` (`ns`) — update task fields under lock
- `tasksFileClaim` (`HR4`) — atomic claim under lock
- Constants: `Mz` (`"team-lead"`), `yXY` (`500`)

---

## Source: CXY

```javascript
// ============================================
// pollForNextMessage - 5-level priority polling loop
// Location: chunks.154.mjs:2462-2547
// ============================================

// READABLE (for understanding):
async function pollForNextMessage(identity, abort, taskId, getAppState, setAppState, parentSessionId) {
  log(`[inProcessRunner] ${identity.agentName} starting poll loop (abort=${abort.signal.aborted})`);
  let pollCount = 0;
  while (!abort.signal.aborted) {

    // ── PRIORITY 1: in-memory pending user messages ───────────────
    const task = getAppState().tasks[taskId];
    if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
      const next = task.pendingUserMessages[0];
      setAppState(s => mutateTask(s, taskId, t => ({
        ...t,
        pendingUserMessages: t.pendingUserMessages.slice(1),
      })));
      log(`[inProcessRunner] ${identity.agentName} found pending user message (poll #${pollCount})`);
      return { type: "new_message", message: next, from: "user" };
    }

    // ── Idle pause between mailbox reads (skip on first iteration) ─
    if (pollCount > 0) await sleep(500);             // yXY = 500
    pollCount++;
    if (abort.signal.aborted) {
      log(`[inProcessRunner] ${identity.agentName} aborted while waiting (poll #${pollCount})`);
      return { type: "aborted" };
    }
    log(`[inProcessRunner] ${identity.agentName} poll #${pollCount}: checking mailbox`);

    try {
      const msgs = await readMailbox(identity.agentName, identity.teamName);

      // ── PRIORITY 2: shutdown_request scan (any position) ────────
      let shutdownIdx = -1;
      let shutdownPayload = null;
      for (let i = 0; i < msgs.length; i++) {
        const m = msgs[i];
        if (m && !m.read) {
          const parsed = parseShutdownRequest(m.text);  // i56
          if (parsed) {
            shutdownIdx = i;
            shutdownPayload = parsed;
            break;
          }
        }
      }
      if (shutdownIdx !== -1) {
        const original = msgs[shutdownIdx];
        const skipped = countUnreadBefore(msgs, shutdownIdx);
        log(`[inProcessRunner] ${identity.agentName} received shutdown request from ${shutdownPayload?.from} (prioritized over ${skipped} unread messages)`);
        await markAsReadByIndex(identity.agentName, identity.teamName, shutdownIdx);
        return {
          type: "shutdown_request",
          request: shutdownPayload,
          originalMessage: original.text,
        };
      }

      // ── PRIORITY 3: prefer team-lead sender ─────────────────────
      let pickIdx = -1;
      for (let i = 0; i < msgs.length; i++) {
        const m = msgs[i];
        if (m && !m.read && m.from === "team-lead") {     // Mz
          pickIdx = i; break;
        }
      }

      // ── PRIORITY 4: any unread ──────────────────────────────────
      if (pickIdx === -1) pickIdx = msgs.findIndex(m => !m.read);

      if (pickIdx !== -1) {
        const m = msgs[pickIdx];
        if (m) {
          log(`[inProcessRunner] ${identity.agentName} received new message from ${m.from} (index ${pickIdx})`);
          await markAsReadByIndex(identity.agentName, identity.teamName, pickIdx);
          return {
            type: "new_message",
            message: m.text,
            from: m.from,
            color: m.color,
            summary: m.summary,
          };
        }
      }
    } catch (e) {
      log(`[inProcessRunner] ${identity.agentName} poll error: ${e}`);
    }

    // ── PRIORITY 5: try to claim an unowned task ──────────────────
    const taskPrompt = await claimUnclaimedTask(parentSessionId, identity.agentName);
    if (taskPrompt) {
      return { type: "new_message", message: taskPrompt, from: "task-list" };
    }
  }

  log(`[inProcessRunner] ${identity.agentName} exiting poll loop (abort=${abort.signal.aborted}, polls=${pollCount})`);
  return { type: "aborted" };
}

// Mapping: CXY→pollForNextMessage, q→identity, K→abort, _→taskId, z→getAppState,
//          Y→setAppState, A→parentSessionId, ts→readMailbox, Y18→markAsReadByIndex,
//          i56→parseShutdownRequest, w7→countUnreadBefore, l7→sleep,
//          HNK→claimUnclaimedTask, Mz→"team-lead"
```

---

## Priority 1: In-Memory User Messages

When a user types a message into the leader's TUI directed at a specific teammate, the leader doesn't write to the mailbox file — instead it directly mutates `AppState.tasks[teammateTaskId].pendingUserMessages[]`. The teammate's poll observes this list before doing any FS I/O.

### Why bypass the mailbox?

- **Latency.** The user is sitting at the TUI; round-tripping through the FS would add hundreds of milliseconds.
- **Visibility.** A user message from the leader is a direct interactive intent, not a structured collaboration message. It deserves the lowest-overhead path.
- **Consistency.** Pane-mode teammates can't be reached this way (no shared `AppState`), so for them the leader still has to write to the mailbox via SendMessage. In-process teammates get the fast path.

### Mechanism

```typescript
// In the leader (when user types into a teammate's chat):
queueUserMessageForTeammate(teammateTaskId: string, message: string) {
  setAppState(s => mutateTask(s, teammateTaskId, t => ({
    ...t,
    pendingUserMessages: [...t.pendingUserMessages, message],
  })));
}

// In the teammate's poll (priority 1):
if (task.pendingUserMessages.length > 0) {
  const next = task.pendingUserMessages[0];
  setAppState(s => mutateTask(s, taskId, t => ({
    ...t,
    pendingUserMessages: t.pendingUserMessages.slice(1),
  })));
  return { type: "new_message", message: next, from: "user" };
}
```

**Important:** the consume step is a `setAppState` mutation, not a synchronous splice. Two consecutive calls to `pendingUserMessages[0]` could race if the in-process runner had concurrency, but `bXY`'s loop is sequential, so consume-then-process is atomic from the runner's perspective.

---

## Priority 2: Shutdown Request Scan

Shutdown requests must take precedence over every other queued message. The leader sends one when:
- The user explicitly requests killing a teammate.
- The team is being torn down (e.g., `/swap-out`, session end).
- Auto-cleanup decides a teammate is unhealthy.

If shutdown were FIFO, queueing a peer message before sending shutdown would force the teammate to process the peer first, possibly invoking tools that take minutes. Priority 2 scans the entire unread set so shutdown wins regardless of arrival order.

### Why parse, not check the `from` or a flag?

The mailbox envelope has only `from`, `text`, `timestamp`, `read`, `color?`, `summary?` — no `type` field. Discriminating message intent requires parsing `text`. `i56` is one of seven JSON-decode-then-typecheck parsers (`i56` for shutdown_request, `j18` for permission_request, etc.).

### Bypass-aware logging

The runner logs `prioritized over N unread messages` so a debug session shows when the priority bypass kicked in. This is invaluable when investigating "the leader sent shutdown but the teammate processed something else first" — the answer is usually that the shutdown wasn't shaped as a structured `shutdown_request` (e.g., user typed plain text "stop now"), so it hit Priority 3 or 4.

---

## Priority 3: Team-Lead Sender

```
let pickIdx = -1;
for (let i = 0; i < msgs.length; i++) {
  if (msgs[i] && !msgs[i].read && msgs[i].from === "team-lead") {
    pickIdx = i;
    break;
  }
}
```

The first unread message with `from === Mz` wins. If the leader sent three messages before any peers, all three of them get drained in this priority bucket on successive polls — but never out of mutual order; the for-loop returns the lowest index.

### Why prefer the lead?

A team has a single coordinator. Putting lead messages before peer messages prevents a "broadcast storm" — N peers shouting at each other while the lead's instruction sits unread.

In a flat-priority FIFO design, a team of 5 with one chatty broadcasting peer would force the leader's instructions to wait behind the broadcasts. The 1-tier preference keeps the team responsive to its coordinator at all times.

### Edge case: messages from yourself

A teammate that broadcasts (`SendMessage to: "*"`) writes to all peer inboxes — including its own. Self-messages are filtered out at write time? No — they're delivered, but the runner doesn't process them in any special way (they'd hit Priority 4 unless from `"team-lead"`, which they aren't). In practice the leader wraps broadcast handling differently, so self-loops don't occur.

---

## Priority 4: Any Unread

```
if (pickIdx === -1) pickIdx = msgs.findIndex(m => !m.read);
```

If neither shutdown nor lead messages are pending, take the **first** unread message. This is FIFO within the bucket: the order is determined by write order, which is determined by mailbox-write timestamp.

### Race avoidance

Two peers writing to the same inbox can interleave their entries. Because `F_` acquires a lock, the resulting array is consistent (no torn entries). `findIndex` uses array order, so the earlier write wins.

### Why not prioritize by sender importance further?

The system has no per-peer priority; every teammate is a peer to every other. Adding priorities would require a hierarchy, which the current model deliberately avoids — there is one team lead, everyone else is equal.

---

## Priority 5: Auto Task-Claim

When the inbox is empty (no unread messages of any kind), the runner tries to find an unowned task and claim it. This lets idle teammates self-direct toward unfinished work without leader push.

### claimUnclaimedTask (HNK)

```javascript
// ============================================
// claimUnclaimedTask - Find and claim an unowned task
// Location: chunks.154.mjs:2443-2460
// ============================================

// ORIGINAL (for source lookup):
async function HNK(q, K) {
  try {
    let _ = await Qf(q),
        z = RXY(_);
    if (!z) return;
    let Y = await HR4(q, z.id, K);
    if (!Y.success) {
      E(`[inProcessRunner] Failed to claim task #${z.id}: ${Y.reason}`);
      return;
    }
    return await ns(q, z.id, { status: "in_progress" }),
           E(`[inProcessRunner] Claimed task #${z.id}: ${z.subject}`),
           SXY(z);
  } catch (_) {
    E(`[inProcessRunner] Error checking task list: ${_}`);
    return;
  }
}

// READABLE (for understanding):
async function claimUnclaimedTask(parentSessionId, agentName) {
  try {
    const tasks = await readTasksFile(parentSessionId);            // Qf
    const candidate = findClaimableTask(tasks);                    // RXY
    if (!candidate) return;
    const claimResult = await atomicClaimTask(parentSessionId, candidate.id, agentName); // HR4
    if (!claimResult.success) {
      log(`[inProcessRunner] Failed to claim task #${candidate.id}: ${claimResult.reason}`);
      return;                                                       // raced; another teammate got it
    }
    await updateTaskField(parentSessionId, candidate.id, { status: "in_progress" });    // ns
    log(`[inProcessRunner] Claimed task #${candidate.id}: ${candidate.subject}`);
    return formatTaskPrompt(candidate);                            // SXY
  } catch (e) {
    log(`[inProcessRunner] Error checking task list: ${e}`);
    return;
  }
}

// Mapping: HNK→claimUnclaimedTask, q→parentSessionId, K→agentName,
//          Qf→readTasksFile, RXY→findClaimableTask, HR4→atomicClaimTask,
//          ns→updateTaskField, SXY→formatTaskPrompt
```

### findClaimableTask (RXY)

```javascript
// ============================================
// findClaimableTask - Pick first task with status=pending, owner=null, deps clear
// Location: chunks.154.mjs:2424-2431
// ============================================

// ORIGINAL (for source lookup):
function RXY(q) {
  let K = new Set(q.filter((_) => _.status !== "completed").map((_) => _.id));
  return q.find((_) => {
    if (_.status !== "pending") return !1;
    if (_.owner) return !1;
    return _.blockedBy.every((z) => !K.has(z));
  });
}

// READABLE (for understanding):
function findClaimableTask(tasks) {
  const openIds = new Set(tasks.filter(t => t.status !== "completed").map(t => t.id));
  return tasks.find(t => {
    if (t.status !== "pending") return false;
    if (t.owner) return false;
    return t.blockedBy.every(depId => !openIds.has(depId));    // all deps completed
  });
}

// Mapping: RXY→findClaimableTask, q→tasks, K→openIds, _→t, z→depId
```

The claim heuristic is **deterministic** for a single reader: lowest-array-index task that satisfies all three predicates. Concurrent claims by multiple teammates rely on `HR4` (the lock-protected atomic claim) to disambiguate.

### Atomic claim

`HR4(parentSessionId, taskId, agentName)` (defined elsewhere in the codebase) does:

```
1. Acquire lock on tasks.json
2. Read tasks.json
3. If tasks[taskId].owner is set: release, return {success: false, reason: "already claimed"}
4. Set tasks[taskId].owner = agentName, status = "in_progress"
5. Write tasks.json
6. Release lock
7. Return {success: true}
```

The lock protects the read-modify-write so two teammates calling `HR4` on the same `taskId` see the second one fail.

### formatTaskPrompt (SXY)

```javascript
// ============================================
// formatTaskPrompt - Build the synthetic user prompt for a claimed task
// Location: chunks.154.mjs:2433-2441
// ============================================

// ORIGINAL (for source lookup):
function SXY(q) {
  let K = `Complete all open tasks. Start with task #${q.id}: \n\n ${q.subject}`;
  if (q.description) K += `\n\n${q.description}`;
  return K;
}

// READABLE (for understanding):
function formatTaskPrompt(task) {
  let prompt = `Complete all open tasks. Start with task #${task.id}: \n\n ${task.subject}`;
  if (task.description) prompt += `\n\n${task.description}`;
  return prompt;
}

// Mapping: SXY→formatTaskPrompt, q→task
```

The prompt phrasing — "Complete all open tasks. Start with task #N" — is intentional. It tells the agent that there may be more work after this one, without committing to a specific ordering. The agent can re-examine the task list at any point (via the Task tool or task-list mailbox messages, depending on the team's setup).

---

## Worked Examples

### Example 1: User asks teammate a question while peers are chattering

```
Inbox state at poll time:
  [0] from: peer-a, "FYI my analysis is done", read=true
  [1] from: peer-b, "I am running the tests", read=false  ← unread peer
  [2] from: team-lead, "Hi alpha, can you summarize?", read=false  ← user message via lead
  [3] from: peer-c, "Done with my piece", read=false

pendingUserMessages: []
```

Poll evaluation:
- Priority 1: empty → skip.
- Priority 2: scan all unread for shutdown_request — none → skip.
- Priority 3: first unread with `from === "team-lead"` → index 2.
- Returns `{type: "new_message", from: "team-lead", message: "Hi alpha, can you summarize?"}`.

Peer messages at indices 1 and 3 stay unread for the next poll.

### Example 2: Leader sends shutdown after queueing a long task

```
Inbox state:
  [0] from: team-lead, "Run the failing test suite and fix all of them", read=false
  [1] from: team-lead, JSON shutdown_request, read=false

Time: T+0   leader writes [0]
Time: T+5s  user changes mind, leader writes [1]
Time: T+5.5 teammate poll (currently busy on [0]'s task)
```

The teammate is still inside its current turn from `[0]` — the poll happens *between* turns. Suppose this poll happens after the teammate finishes turn N:

- Priority 2: scan unread for shutdown_request → index 1 matches.
- Returns `{type: "shutdown_request", originalMessage: ...}`.
- Teammate continues into turn N+1 with the shutdown request as the prompt; the model decides whether to honor the shutdown (typical behavior: it does, sending a shutdown_response approve).

The earlier "Run the failing test suite" at index 0 stays unread. If the teammate's model rejects the shutdown, on the next poll Priority 3 picks up index 0.

### Example 3: Idle teammate sees an unowned task

```
Inbox: empty (or all read)
tasks.json:
  [
    {id: 1, subject: "Audit TODOs",        status: "in_progress", owner: "alpha", blockedBy: []},
    {id: 2, subject: "Run linter",         status: "pending",      owner: null,    blockedBy: []},
    {id: 3, subject: "Summarize results",  status: "pending",      owner: null,    blockedBy: [2]},
  ]

Teammate beta polls, has no unread messages.
```

- Priority 5: claimUnclaimedTask runs.
  - readTasksFile → all three.
  - findClaimableTask → openIds = {1, 2, 3}; iterate:
    - id=1: status !== "pending" → skip.
    - id=2: status="pending", owner=null, blockedBy=[] → all deps complete → return.
  - atomicClaimTask(2, "beta") → success.
  - updateTaskField(2, status="in_progress").
  - formatTaskPrompt(2) → `"Complete all open tasks. Start with task #2: \n\n Run linter"`.
- Returns `{type: "new_message", from: "task-list", message: "..."}`.

Task #3 stays pending because its `blockedBy=[2]` still contains an open id.

### Example 4: Concurrent teammates racing to claim

Two teammates beta and gamma both find the inbox empty and reach Priority 5 within milliseconds.

- beta calls `HR4(parentSessionId, 2, "beta")`. Lock acquired, owner=null, sets owner=beta. Releases.
- gamma calls `HR4(parentSessionId, 2, "gamma")`. Lock acquired, owner=beta, returns `{success: false, reason: "already claimed"}`.
- gamma's `claimUnclaimedTask` returns `undefined`. Poll loop continues; gamma sleeps 500ms and tries again.

Next iteration, gamma may find another claimable task (say id=3 if id=2 is now complete).

---

## Latency Profile

| Scenario | Worst-case wakeup latency |
|----------|---------------------------|
| User message via leader (priority 1) | ~0 ms |
| Shutdown request | up to 500 ms (one poll cycle) |
| Lead message | up to 500 ms |
| Peer message | up to 500 ms |
| Auto task claim | 500 ms idle + up to lock-acquisition (~10 ms) |

The 500ms baseline is tunable via the constant `yXY` but ships as 500. Lower values would mean more FS reads per second; higher values would slow inter-agent dispatch.

---

## Why Polling, Not Subscription?

Three alternatives were considered (in the lineage of v2.1.32 → v2.1.112):

1. **`fs.watch` / inotify / FSEvents.** Cross-platform inconsistent; macOS FSEvents has known coalescing issues that miss back-to-back writes. Windows `fs.watch` is unreliable for shared directories.
2. **Unix domain sockets.** Requires a daemon; no graceful recovery from leader crash.
3. **Shared memory.** Requires native bindings and manual reference counting; doesn't work cross-process on Windows trivially.

Polling at 500ms is the simplest cross-platform answer, and the lock-then-RMW pattern in `F_` makes it crash-resilient. The runtime cost is one `fs.readFile` per teammate per 500ms — negligible compared to the LLM call cost.

---

## Telemetry Hooks

The poll loop emits debug logs (`E(...)`) at every level transition. Each `[inProcessRunner]` line includes:
- The agent name.
- The poll count.
- The action taken (or skipped).

There is no telemetry counter for "polls per second" — the polling is an implementation detail, not a user-visible signal. The visible signal is "teammate is idle" (priority 5 reached / `isIdle: true`), surfaced in the TUI via the spinner.

---

## Summary of Priority Order

| Priority | Source | Mechanism | Cost | Wakeup latency |
|----------|--------|-----------|------|----------------|
| 1 | `pendingUserMessages` (in-memory) | AppState pop | 0 FS, 1 setState | ~0 ms |
| 2 | Mailbox shutdown_request | Full-array JSON-parse scan | 1 FS read + 1 mark-read write | up to 500 ms |
| 3 | Mailbox lead messages | Indexed scan | (shared with 2) + 1 mark-read | up to 500 ms |
| 4 | Mailbox any unread | Linear find | (shared) + 1 mark-read | up to 500 ms |
| 5 | tasks.json claim | 1 FS read + 1 atomic-claim write + 1 update | up to 500 ms + ~10 ms lock |

The hierarchy embodies a clear philosophy: **interactive intent first, structural intent second, ordered intent third, optional self-direction last.**
