# Edge Cases & Failures — Agent Teams (v2.1.112)

## Overview

Agent Teams is a distributed system inside a single user's machine: file-based IPC, multiple processes, async polling. It has well-defined failure modes, deliberate fallback chains, and recovery semantics that prefer "degrade gracefully" over "abort early".

This document catalogs the failure scenarios:
- Lock contention exhaustion
- File I/O failures (ENOENT, EACCES, EAGAIN)
- Pane-backend probe failure with auto-fallback
- Runtime aborts (lifecycle, current-work)
- Shutdown approval flow & rejection
- Teammate crash mid-permission/mid-plan
- Compaction blocked by hook
- Network/transient errors during agent loop
- Teammate name collision after restart
- Mailbox file corruption (manual edit)

For each: the trigger, the runtime detection, the recovery path, and the user-visible effect.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md).

Key error-paths:
- Lock retries (`z18`) — chunks.99.mjs constants
- Spawn fallback (`h77`, `bF`) — chunks.137.mjs / chunks.155.mjs
- Compact-blocked detection (`GI6` prefix) — chunks.159.mjs
- Abort signal handling — `bXY` and `CXY`
- W18 — kill path (chunks.100.mjs:1152)
- jNK with `idleReason: "failed"` — chunks.154.mjs:2419

---

## 1. Lock Contention Exhaustion

### Trigger

`F_` (writeToMailbox), `Y18`/`A18` (mark read), `O18` (clear), or `lockTeamConfig` calls `properLockfile.lock(...)` with `retries: 10, minTimeout: 5ms`. If the lock is held longer than the cumulative retry budget (~50ms minimum + jitter), the call throws.

### Detection

The `try/catch` in each operation catches the throw. For mailbox writes, the exception is logged (`E(...) + j6(...)`) and the function returns `false` (no recovery — the message is lost).

### Recovery

The runner's poll loop keeps polling. The next iteration may see new messages from successful writes; the failed write is simply absent.

### User-visible effect

A message that should have been delivered isn't, and the sender gets a `false` return from the dispatcher (e.g., `aI8` returns `false` for a failed permission request). The runner's `LXY` will see this and either retry on the next event or treat the absence as a denial.

### Why not propagate?

A loud failure ("permission could not be requested") would interrupt user flow for a transient FS issue. The silent-with-log approach lets the system self-heal on the next mailbox interaction.

---

## 2. ENOENT on Read

### Trigger

`ts` reads `inbox.json` but the file doesn't exist (e.g., teammate spawned for the first time, or directory deleted).

### Detection

```javascript
catch (e) {
  if (e.code === "ENOENT") return [];
  // ... other errors
}
```

### Recovery

Returns an empty array. The poll loop treats this as "no messages", and Priority 5 (auto-claim) gets a chance.

### User-visible effect

None. ENOENT during transient periods (between `mkdir` and first write) is normal.

---

## 3. ENOENT on Mark-Read

### Trigger

`Y18` tries to mark a message as read but the inbox file is gone (deleted by another process, or the mailbox dir was removed).

### Detection

```javascript
catch (e) {
  if (e.code === "ENOENT") return;
  // ... other errors
}
```

### Recovery

Silent return. The next read will return [], and the runner won't loop on the missing message.

### User-visible effect

None. The message is effectively "consumed" because the file is gone.

---

## 4. JSON Parse Failure

### Trigger

A reader sees a half-written `inbox.json` mid-flush from a writer, or the file is manually corrupted (e.g., a user edited it and broke the JSON).

### Detection

`safeJsonParse(data) ?? []` — `n8` returns `undefined` on parse error, the `??` defaults to `[]`.

### Recovery

The reader sees an empty inbox. On the next poll cycle, the file may have been correctly written (writers always write the entire array atomically with `JSON.stringify`).

### User-visible effect

A transient blip — one poll cycle returns no messages. Manual corruption that persists results in permanent "no messages from this inbox" until the file is repaired or recreated.

---

## 5. Pane-Backend Probe Failure

### Trigger

`v96()` throws because:
- tmux is not installed.
- iTerm2 is detected but `it2` CLI is missing.
- The terminal type cannot be identified.

### Detection

`n7Y`'s `try/catch` around `await v96()`.

### Recovery

```javascript
catch (e) {
  if (UX6() !== "auto") throw e;
  log(`No pane backend available, falling back to in-process: ${describe(e)}`);
  enableInProcessFallback();   // h77 — sets sticky flag
  return spawnInProcessTeammate(input, ctx);
}
```

If `teammateMode === "auto"`, fall back to in-process spawn and set a sticky flag so subsequent spawns skip the probe.

If `teammateMode` is pinned (`"tmux"` etc.), rethrow — the user explicitly requested pane mode and should know it failed.

### User-visible effect

In auto mode: the spawn succeeds in-process; the user may not notice unless they were looking for a tmux pane. In pinned mode: spawn fails with the original error message.

---

## 6. iTerm2 Setup Cancelled

### Trigger

During pane spawn, `c7Y` detects `needsIt2Setup: true` and shows the iTerm2 setup modal (`ewK`). The user clicks Cancel.

### Detection

The modal's onDone callback resolves with `"cancelled"`.

### Recovery

`c7Y` throws `"Teammate spawn cancelled - iTerm2 setup required"`. The Agent tool returns the error to the model.

### User-visible effect

The model sees the error, typically apologizes and proposes to retry without pane mode or with a different setup. No pane is left in a bad state.

---

## 7. Runtime Lifecycle Abort

### Trigger

`abortController.abort()` is called on a teammate (e.g., user kills via Ctrl+K in the agent tab, or the leader's session is shutting down).

### Detection

`bXY`'s while-loop checks `abortController.signal.aborted` at the top of each iteration. `CXY`'s while-loop checks the same.

### Recovery

The loops break cleanly. `bXY`'s exit path:
1. Mark task `status: "killed"` (or "completed" if already shutting down).
2. Fire `onIdleCallbacks`.
3. Unregister cleanup.
4. Evict task from registry after delay.
5. (For pane modes via `M2K`'s abort listener) call `backend.killPane(...)` to tear down the pane.

### User-visible effect

The teammate stops; its row in the team status updates to "Stopped"; pane (if any) is killed.

---

## 8. Current-Work Abort

### Trigger

User presses Escape while a teammate is mid-turn. The leader's TUI sets `currentWorkAbort.signal.aborted = true` for the targeted teammate.

### Detection

`bXY` checks `currentWorkAbort.signal.aborted` per agent loop event:

```javascript
if (currentWorkAbort.signal.aborted) {
  log(`current work aborted (Escape pressed)`);
  interruptedThisTurn = true;
  break;
}
```

### Recovery

The agent loop is broken out of, but the lifecycle loop continues. A synthetic "API Error: Request was aborted." message is appended to indicate the abort. Then idle gate fires with `idleReason: "interrupted"`. The teammate awaits its next message.

### User-visible effect

The teammate stops the current turn (any in-flight tool calls are cancelled). The TUI shows "(interrupted)" briefly, then returns to "Pondered" (idle past-tense verb).

---

## 9. Shutdown Request Approval/Rejection

### Trigger

The leader sends `shutdown_request` to a teammate via SendMessage.

### Detection

Priority 2 in `CXY` parses the request and returns `{type: "shutdown_request", request, originalMessage}`.

### Recovery (worker-side)

The runner doesn't auto-stop. It passes the request as a user prompt to the model, letting the model decide whether to shut down. The model's typical response:
- If currently mid-work or holding state, replies "Sorry, can't shut down yet because…" and SendMessage's `shutdown_response{approve: false, reason: "..."}` to the leader.
- If genuinely done, replies "OK, shutting down" and SendMessage's `shutdown_response{approve: true}` to the leader.

### User-visible effect

If approved, the leader processes the shutdown_response (handler `kJY`) and triggers a hard kill (`W18` / abort). If rejected, the leader receives feedback and decides whether to retry, force-kill, or wait.

### Why not auto-shutdown?

Cooperative shutdown lets the model surface an "I'm in the middle of something" objection. Force shutdown remains available via Ctrl+K.

---

## 10. Teammate Crash Mid-Permission

### Trigger

A teammate sends `aI8` (permission_request) and crashes (e.g., process killed externally, OOM) before the response arrives.

### Detection

The leader's poll picks up the request and surfaces the prompt. After the user decides, `sI8` writes the response. The dead worker doesn't consume it.

### Recovery

On respawn (with the same agent name), the new worker reads its inbox. The stale `permission_response` is delivered as Priority 4 (any unread); the new worker has no matching pending Promise (`pendingPermissions.get(requestId)` returns undefined), so the response is silently discarded.

### User-visible effect

A confused log entry (a `permission_response` with no requestor). The new worker proceeds normally; the original requestor's plan is gone.

If the crash happens mid-tool-use, the agent loop's incomplete state is lost, and on respawn the model would have to retry from a fresh state.

---

## 11. Teammate Crash Mid-Plan

### Trigger

A teammate sends `plan_approval_request` and crashes before the response arrives.

### Detection

Same as above — leader doesn't know the worker is gone until poll-cycle latency reveals it.

### Recovery

The leader's UI shows the plan modal. The user decides; the response goes to a dead worker. On respawn, the response is treated as plain text (since `plan_approval_response` has no special poll-side parser in the worker), so the model receives JSON-as-text and typically ignores or comments on it.

### User-visible effect

The plan is effectively lost. The new worker's first turn would be its initial spawn prompt or auto-claimed task, not the plan.

This is acceptable because plan crashes are rare; the user can simply re-spawn and ask for the plan again.

---

## 12. PreCompact Hook Blocks Compact

### Trigger

The teammate is over the autocompact threshold; `bXY` calls `vI6`. The user's PreCompact hook returns `decision: "block"` (or stdout indicates blocking via the standard hook protocol).

### Detection

`vI6` throws an error whose message starts with the constant `GI6` ("Compaction blocked by PreCompact hook").

### Recovery

```javascript
catch (e) {
  if (e instanceof Error && e.message.startsWith(GI6)) {
    log(`compaction blocked by PreCompact hook; continuing uncompacted`);
  } else {
    throw e;
  }
}
```

The runner continues uncompacted. The next turn may again be over the threshold and try again — giving the hook another chance (or, if the user fixed the underlying issue, succeeding).

### User-visible effect

The teammate keeps running but at reduced effective context. If the over-threshold is severe, the next LLM call may fail with PTL (Prompt Too Long), at which point the standard PTL retry chain in `vI6` would kick in (drop ~20% of head).

---

## 13. Network / Streaming Errors During Agent Loop

### Trigger

The model API returns a streaming error (overflow 422/424, network drop, rate limit, etc.) mid-event.

### Detection

`_u` (agent loop) handles these and yields error events or rethrows. `bXY` catches at the outermost try/catch.

### Recovery

```javascript
catch (err) {
  log(`Agent ${identity.agentId} failed: ${err.message}`);
  setTaskStatus("failed");
  await sendIdleNotification(identity.agentName, identity.color, identity.teamName, {
    idleReason: "failed", completedStatus: "failed", failureReason: err.message,
  });
  return { success: false, error: err.message, messages };
}
```

The teammate transitions to `status: "failed"`, sends a final idle notification with `failureReason`, and exits.

### User-visible effect

The teammate disappears from active state with a "Failed" indicator. The leader may decide to respawn it.

For the new context_hint 422/424 path (introduced in v2.1.112), the agent loop has its own retry inside `vI6`/`d85` — see [07_compact/context_hint_path.md](../07_compact/context_hint_path.md). The teammate's runner is one level above that retry.

---

## 14. Teammate Name Collision After Restart

### Trigger

User restarts Claude with the same team. The new session reads `config.json` and finds members from the previous session. They are inserted into `AppState.teamContext.teammates`, but they're NOT actually running (their processes are dead).

### Detection

When the user tries to send a message to one of these "ghost" teammates via SendMessage:
- For in-process: `LJY.call` checks `tasks[agentId]`; finds none in active set; falls through to `z38` resume path (auto-relaunches the agent in the background from transcript).
- For pane: same fallback path.

### Recovery

`z38` is the auto-resume helper. It re-spawns the teammate using the saved transcript, returning a Promise with the resume-output file path. The user sees: `"Agent 'alpha' had no active task; resumed from transcript in the background…"`.

### User-visible effect

A lag (the agent has to bootstrap), but transparent recovery.

---

## 15. Manual Mailbox Edit

### Trigger

A user (or a script) edits `inbox.json` outside Claude — adds a fake message, removes one, breaks the JSON.

### Detection

- If the edit produces valid JSON: the runner picks it up on the next poll. Order may have changed; senders may be fictional.
- If the edit produces invalid JSON: `safeJsonParse` returns nothing, the runner sees an empty inbox.

### Recovery

The runner is unaware of editing; it just trusts what it reads. A fake message goes through Priority 4 (any unread) and is delivered to the model as a prompt.

### User-visible effect

Whatever the editor injected becomes the next prompt. There are no signatures or auth — the mailbox protocol is plaintext and trust-based, scoped to the user's home directory.

---

## 16. Concurrent Spawn Name Collision

### Trigger

Two parallel SpawnTeammate calls with the same `name` reach `d7Y` (pickUniqueTeammateName) within microseconds.

### Detection

Both calls read the same team config, both see the name is unused, both try to add it.

### Recovery

The locked write in `y77` (persistTeammateRecord) serializes them. The second writer reads the updated config (which now includes the first), sees the name conflict, and… `y77` doesn't dedupe by name — it dedupes by `agentId`. Two `agentId`s for the same name would both register.

Actually `d7Y` runs *before* the lock is acquired, so two callers can both pick the same suffix. The system relies on `agentId` (derived from name+timestamp+random in `op`) being unique. Two teammates with name "alpha" can coexist if they have different agentIds.

### User-visible effect

Two rows with name "alpha" in the team UI, distinguished only by their agentId. Confusing but functional. In practice this is rare because spawns are user-driven and serial.

---

## 17. Tasks.json Atomic Claim Race

### Trigger

Two teammates both reach Priority 5 in `CXY` and both call `HR4(parentSessionId, taskId, agentName)` for the same task.

### Detection

`HR4` acquires the lock, reads, sees `owner` already set (by the first claimer), returns `{success: false, reason: "already claimed"}`.

### Recovery

The losing teammate's `claimUnclaimedTask` returns `undefined`. The poll loop continues; on the next cycle, `RXY` finds a different claimable task.

### User-visible effect

None. Task assignment is deterministic (the lock-winner gets it).

---

## 18. Tmux Pane Killed Externally

### Trigger

User runs `tmux kill-pane` directly on a teammate's pane.

### Detection

The leader has no direct event for this. The pane process dies; subsequent SendMessage attempts find the pane gone via Tmux probe failure or by mailbox going stale.

### Recovery

For SendMessage: `LJY` falls through to the `z38` resume path, relaunches the agent in the background.

For lifecycle: the leader's `M2K`-registered abort listener doesn't know to fire (no signal came in), so the registered task placeholder persists in AppState until manually killed or session restart.

### User-visible effect

A "ghost" teammate in the team list whose pane is gone. Sending a message to it triggers the resume path, transparent to the user.

---

## 19. Inbox Directory Deleted Mid-Session

### Trigger

User runs `rm -rf ~/.claude/teams/myteam/inboxes/` while teammates are active.

### Detection

Next `F_` write attempts to write into a non-existent directory; `dWz` (ensureInboxDirectory) recreates it; the write succeeds.

Next `ts` read returns ENOENT → empty array.

### Recovery

The runner sees no messages and waits for new ones. Already-sent messages are lost.

### User-visible effect

In-flight collaboration breaks. The next message recreates the inbox directory and operations continue.

---

## 20. Compact's Cache-Prefix Race

### Trigger

A teammate's autocompact crosses paths with the leader's autocompact (each runs its own; they share no data, but both are reading/writing telemetry).

### Detection

There's no cross-process detection — they're independent.

### Recovery

Both compacts succeed independently. They may double-charge for cache write costs but don't corrupt each other.

### User-visible effect

None.

---

## Summary Table

| # | Failure | Detection | Recovery |
|---|---------|-----------|----------|
| 1 | Lock contention | try/catch on lock | Log + return false; next poll retries |
| 2 | ENOENT on read | err.code check | Return []; next poll |
| 3 | ENOENT on mark-read | err.code check | Silent return |
| 4 | JSON parse fail | safeJsonParse | Return []; observable on next poll |
| 5 | Pane probe fail (auto) | try/catch in n7Y | Fallback to in-process |
| 6 | Pane probe fail (pinned) | try/catch in n7Y | Rethrow |
| 7 | iTerm2 setup cancel | modal onDone | Throw "cancelled" |
| 8 | Lifecycle abort | abort.signal.aborted | Clean exit |
| 9 | Current-work abort | currentWorkAbort.signal | Inject abort msg, idle, await next |
| 10 | Cooperative shutdown | shutdown_request → model decides | approve→W18 / reject→retry |
| 11 | Crash mid-permission | new worker has no pending Promise | Stale response discarded |
| 12 | Crash mid-plan | new worker treats response as text | Plan effectively lost |
| 13 | PreCompact hook blocks | err.message.startsWith(GI6) | Continue uncompacted |
| 14 | Streaming error | catch in bXY | Mark failed, send idle "failed" |
| 15 | Stale teammate after restart | LJY.call → z38 resume | Auto-resume from transcript |
| 16 | Manual mailbox edit | none | Trust-based; arbitrary messages |
| 17 | Concurrent spawn name | rare; agentId differs | Two rows with same name |
| 18 | Atomic claim race | HR4 lock returns success: false | Loser gets next task |
| 19 | Pane killed externally | next mailbox interaction | Auto-resume via z38 |
| 20 | Inbox dir deleted | ENOENT | Recreate on next write |
| 21 | Compact race (intra-team) | independent | No-op |

---

## Design Philosophy

The team protocol is intentionally **defensive over strict**. Most failures cause silent recovery rather than loud errors:
- A lost message becomes one missed delivery, not a crash.
- A lock failure becomes a retry, not a panic.
- A stale response becomes a discard, not a misroute.

This makes the system robust to the natural chaos of file-based IPC across multiple processes. The cost is that some failures (manual edits, concurrent name collisions) produce subtly weird state without alerting the user. The trade-off is justified: it's a single-user, single-machine system where loud failures interrupt productive work, and silent recovery aligns with the principle of least surprise during normal use.

For operations that **must** succeed cleanly — atomic task claim, plan approval — the design uses explicit locks and request/response patterns with unique IDs. The mailbox itself stays best-effort.
