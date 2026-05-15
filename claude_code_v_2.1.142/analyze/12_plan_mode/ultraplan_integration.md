# Ultraplan Integration (v2.1.142)

> Ultraplan is the "Refine plan on Claude Code on the web" path. From the local CLI, the user (or model rejecting locally with the teleport sentinel) hands the plan off to a remote CCR session. The local process then polls the remote session's event stream until an `ExitPlanMode` `tool_result` lands, at which point the plan is brought back into the local conversation. This file analyses the remote-execution loop, the `ExitPlanModeScanner` state classifier, and the polling driver.

The v2.1.112 reference document covered the architectural overview in depth. This v2.1.142 update focuses on the deobfuscation deltas and the v2.1.119 "Refine with Ultraplan not showing the remote session URL in the transcript" fix.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_plan_mode.md](../00_overview/symbol_additions_v2_1_142_plan_mode.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Existing plan-mode references

Key functions in this document:
- `ExitPlanModeScanner` (obfuscated: `gj4`) — Pure stateful classifier over the CCR event stream, `cli_inner_pretty.js:475135-475176`
- `pollForApprovedExitPlanMode` (obfuscated: `Qj4`) — Polling driver with retry + phase reporting, `cli_inner_pretty.js:475178-475233`
- `extractApprovedPlan` (obfuscated: `s05`) — Parses `## Approved Plan` marker, `cli_inner_pretty.js:475245-475260`
- `extractTeleportPlan` (obfuscated: `a05`) — Parses `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel, `cli_inner_pretty.js:475237-475244`
- `contentToText` (obfuscated: `dj4`) — Normalises string vs `[{text}]` content shapes, `cli_inner_pretty.js:475234-475236`
- `UltraplanPollError` (obfuscated: `T$H`) — Typed-reason error class, `cli_inner_pretty.js:475269-475280`
- `isUltraplanAvailable` (obfuscated: `sQ`) — Feature gate (config + remote-control bridge), `cli_inner_pretty.js:475282-475284`
- `ULTRAPLAN_TELEPORT_SENTINEL` (obfuscated: `o05`) — `"__ULTRAPLAN_TELEPORT_LOCAL__"`, `cli_inner_pretty.js:475264`
- `POLL_INTERVAL_MS` (obfuscated: `Fj4`) — 3000, `cli_inner_pretty.js:475261`
- `MAX_CONSECUTIVE_FAILURES` (obfuscated: `r05`) — 5, `cli_inner_pretty.js:475262`

---

## Architecture (recap from v2.1.112)

```
┌─────────────────┐                                ┌──────────────────────────┐
│  Local CLI      │                                │ Claude Code on the web   │
│  (user pressed  │   teleportToRemote(plan)       │  (CCR remote session)    │
│   "Refine with  ├───────────────────────────────►│                          │
│    Ultraplan"   │                                │  set_permission_mode →   │
│    in modal)    │                                │    plan                  │
└────────┬────────┘                                │  model writes plan       │
         │                                         │  user reviews in browser │
         │                                         │  user approves           │
         │                                         │    OR edits + approves   │
         │                                         │    OR rejects            │
         │                                         │    OR clicks "teleport   │
         │                                         │      back to terminal"   │
         │                                         │      (sends rejection    │
         │                                         │       w/ sentinel)       │
         │                                         └──────────┬───────────────┘
         │                                                    │
         │   ┌────────────────────────────────┐               │
         │   │ pollForApprovedExitPlanMode    │               │
         │   │ ┌────────────────────────────┐ │               │
         └──►│ │ ExitPlanModeScanner        │ │ pollRemote    │
             │ │ (stateful classifier)      │◄┼─SessionEvents─┤
             │ └────────────────────────────┘ │ (SDKMessage[])│
             │ phases: running → needs_input  │               │
             │     → plan_ready → approved    │               │
             └─────────────┬──────────────────┘
                           │
                           ▼
                ┌────────────────────────────┐
                │ extractApprovedPlan or     │
                │ extractTeleportPlan        │
                └─────────────┬──────────────┘
                              │
                              ▼
                ┌────────────────────────────┐
                │ executionTarget:           │
                │ 'remote' (approved in web) │
                │   → archive remote, end    │
                │ 'local' (teleport)         │
                │   → seed local plan + run  │
                └────────────────────────────┘
```

---

## Component: `ExitPlanModeScanner` (`gj4`)

A stateful classifier that ingests batches of new events from the remote session and reports the current state of the `ExitPlanMode` tool calls.

```javascript
// ============================================
// ExitPlanModeScanner.ingest - Classify remote events
// Location: cli_inner_pretty.js:475135-475176
// ============================================

// ORIGINAL (for source lookup):
class gj4 {
  exitPlanCalls = [];
  results = new Map();
  rejectedIds = new Set();
  terminated = void 0;
  rescanAfterRejection = !1;
  everSeenPending = !1;
  rejectCount = 0;

  get hasPendingPlan() {
    for (let H = this.exitPlanCalls.length - 1; H >= 0; H--) {
      let $ = this.exitPlanCalls[H];
      if (this.rejectedIds.has($)) continue;
      if (!this.results.has($)) return !0;
    }
    return !1;
  }

  ingest(H) {
    for (let K of H) {
      if (K.type === "assistant") {
        let _ = K.message.content;
        if (!Array.isArray(_)) continue;
        for (let A of _)
          if (A.type === "tool_use" && A.name === "ExitPlanMode") this.exitPlanCalls.push(A.id);
      } else if (K.type === "user") {
        let _ = K.message.content;
        if (!Array.isArray(_)) continue;
        for (let A of _) if (A.type === "tool_result") this.results.set(A.tool_use_id, A);
      } else if (K.type === "result" && K.subtype !== "success") this.terminated = { subtype: K.subtype };
    }
    let $ = H.length > 0 || this.rescanAfterRejection;
    this.rescanAfterRejection = !1;
    let q = null;
    if ($) {
      for (let K = this.exitPlanCalls.length - 1; K >= 0; K--) {
        let _ = this.exitPlanCalls[K];
        if (this.rejectedIds.has(_)) continue;
        let A = this.results.get(_);
        if (!A) q = { kind: "pending" };
        else if (A.is_error === !0) {
          let z = a05(A.content);
          q = z !== null ? { kind: "teleport", plan: z } : { kind: "rejected", id: _ };
        } else q = { kind: "approved", plan: s05(A.content) };
        break;
      }
      if (q?.kind === "approved" || q?.kind === "teleport") return q;
    }
    if (q?.kind === "rejected") (this.rejectedIds.add(q.id), (this.rescanAfterRejection = !0));
    if (this.terminated) return { kind: "terminated", subtype: this.terminated.subtype };
    if (q?.kind === "rejected") return q;
    if (q?.kind === "pending") return ((this.everSeenPending = !0), q);
    return { kind: "unchanged" };
  }
}

// READABLE (for understanding):
class ExitPlanModeScanner {
  exitPlanCalls = [];      // tool_use IDs of ExitPlanMode calls, in order
  results = new Map();     // tool_use_id → tool_result block
  rejectedIds = new Set(); // tool_use IDs already classified as rejected
  terminated = undefined;  // { subtype } if session ended
  rescanAfterRejection = false;
  everSeenPending = false; // has any plan been pending? (drives error message)
  rejectCount = 0;         // count of rejection cycles (for analytics)

  get hasPendingPlan() {
    // Newest non-rejected exitPlan call without a result = pending
    for (let i = this.exitPlanCalls.length - 1; i >= 0; i--) {
      const id = this.exitPlanCalls[i];
      if (this.rejectedIds.has(id)) continue;
      if (!this.results.has(id)) return true;
    }
    return false;
  }

  ingest(newEvents) {
    // 1. Update state from new events
    for (const event of newEvents) {
      if (event.type === 'assistant') {
        for (const block of event.message.content ?? []) {
          if (block.type === 'tool_use' && block.name === 'ExitPlanMode') {
            this.exitPlanCalls.push(block.id);
          }
        }
      } else if (event.type === 'user') {
        for (const block of event.message.content ?? []) {
          if (block.type === 'tool_result') {
            this.results.set(block.tool_use_id, block);
          }
        }
      } else if (event.type === 'result' && event.subtype !== 'success') {
        this.terminated = { subtype: event.subtype };
      }
    }

    // 2. Classify (scan newest first; only if there's something new OR we just rejected)
    const shouldScan = newEvents.length > 0 || this.rescanAfterRejection;
    this.rescanAfterRejection = false;
    let candidate = null;
    if (shouldScan) {
      for (let i = this.exitPlanCalls.length - 1; i >= 0; i--) {
        const id = this.exitPlanCalls[i];
        if (this.rejectedIds.has(id)) continue;
        const result = this.results.get(id);
        if (!result) {
          candidate = { kind: 'pending' };
        } else if (result.is_error === true) {
          // Rejected: check for teleport sentinel
          const teleportPlan = extractTeleportPlan(result.content);
          candidate = teleportPlan !== null
            ? { kind: 'teleport', plan: teleportPlan }
            : { kind: 'rejected', id };
        } else {
          candidate = { kind: 'approved', plan: extractApprovedPlan(result.content) };
        }
        break;
      }
      if (candidate?.kind === 'approved' || candidate?.kind === 'teleport') return candidate;
    }
    if (candidate?.kind === 'rejected') {
      this.rejectedIds.add(candidate.id);
      this.rescanAfterRejection = true;  // re-scan next round to look for newer pending plans
    }
    if (this.terminated) return { kind: 'terminated', subtype: this.terminated.subtype };
    if (candidate?.kind === 'rejected') return candidate;
    if (candidate?.kind === 'pending') {
      this.everSeenPending = true;
      return candidate;
    }
    return { kind: 'unchanged' };
  }
}

// Mapping: gj4→ExitPlanModeScanner, K→event, _→content/result, A→block, z→teleportPlan,
//          H→newEvents, $→shouldScan, q→candidate, a05→extractTeleportPlan, s05→extractApprovedPlan
```

### Algorithm: Newest-First Scan with Rejection Recovery

**What it does:** Determines the state of the most-recent non-rejected `ExitPlanMode` call. Handles multi-cycle plan refinement (where the user rejects, the model re-plans, and `ExitPlanMode` is called again).

**Step by step:**

1. **Update accumulator state**: scan new events for `assistant` tool_use (record `ExitPlanMode` IDs), `user` tool_result (record results), and `result` (terminate). This is pure state accumulation; no classification yet.
2. **Skip classification if no new events AND no pending rejection rescan**: optimization.
3. **Scan exitPlanCalls in reverse (newest first)**: find the newest non-rejected call. For each:
   - If it has no result yet: `pending`. Break.
   - If result is error (rejected by user in web UI): check teleport sentinel.
     - Sentinel present: `teleport` (user wants to bring plan back to terminal). Plan content is what follows the sentinel marker.
     - Sentinel absent: `rejected`. Break.
   - If result is success: `approved`. Parse plan via `extractApprovedPlan`. Break.
4. **Approved/teleport are terminal**: return immediately.
5. **Rejected handling**: add to `rejectedIds` set, mark `rescanAfterRejection`. The next `ingest` call (likely after the model re-emits ExitPlanMode) will re-scan and find the newer pending plan.
6. **Terminated detection**: if any error result terminated the session, propagate.
7. **Else return** `pending`, `rejected`, or `unchanged`.

**Why newest-first?**
- A session may have multiple `ExitPlanMode` calls if the user rejected a prior plan. Only the *latest* matters for current phase classification.
- The scan stops at the newest non-rejected call, so older approvals (which would never be valid) don't shadow newer pendings.

**Why `rescanAfterRejection`?**
- When a rejection is classified, the scanner's next state should be "look for whatever the model emits next". Without the rescan flag, the scanner could miss the next plan if it arrives in a batch with new events but the rejection's `rejectedIds` set wasn't visible yet to the scan logic. The flag ensures one extra scan pass after each rejection.

**Key insight:** The scanner is purely state-based (no clock). It re-classifies on every ingest. This makes it trivial to test (deterministic) and immune to event ordering quirks.

---

## Component: `extractTeleportPlan` (`a05`) — Teleport Sentinel

```javascript
// ============================================
// extractTeleportPlan - Parse the teleport-back-to-local sentinel
// Location: cli_inner_pretty.js:475237-475244
// ============================================

// ORIGINAL (for source lookup):
function a05(H) {
  let $ = dj4(H),
    q = `${o05}\n`,
    K = $.indexOf(q);
  if (K === -1) return null;
  return $.slice(K + q.length).trimEnd();
}

// READABLE (for understanding):
function extractTeleportPlan(content) {
  const text = contentToText(content);
  const sentinel = `${ULTRAPLAN_TELEPORT_SENTINEL}\n`;  // "__ULTRAPLAN_TELEPORT_LOCAL__\n"
  const index = text.indexOf(sentinel);
  if (index === -1) return null;
  return text.slice(index + sentinel.length).trimEnd();
}

// Mapping: a05→extractTeleportPlan, H→content, $→text, q→sentinel, K→index,
//          dj4→contentToText, o05→ULTRAPLAN_TELEPORT_SENTINEL
```

The sentinel `__ULTRAPLAN_TELEPORT_LOCAL__` is the user's signal to "bring this plan back to my terminal". Everything after the sentinel + newline is the plan body. The local CLI receives this and seeds its own plan with the content.

---

## Component: `extractApprovedPlan` (`s05`) — Plan Marker Parse

```javascript
// ============================================
// extractApprovedPlan - Parse approved plan from tool_result content
// Location: cli_inner_pretty.js:475245-475260
// ============================================

// ORIGINAL (for source lookup):
function s05(H) {
  let $ = dj4(H),
    q = [`## Approved Plan (edited by user):\n`, `## Approved Plan:\n`];
  for (let K of q) {
    let _ = $.indexOf(K);
    if (_ !== -1) return $.slice(_ + K.length).trimEnd();
  }
  throw Error(`ExitPlanMode approved but tool_result has no "## Approved Plan:" marker — remote may have hit the empty-plan or isAgent branch. Content preview: ${$.slice(0, 200)}`);
}

// READABLE (for understanding):
function extractApprovedPlan(content) {
  const text = contentToText(content);
  // Try both variants: edited-by-user first (newer marker), then plain
  const markers = [
    '## Approved Plan (edited by user):\n',
    '## Approved Plan:\n',
  ];
  for (const marker of markers) {
    const index = text.indexOf(marker);
    if (index !== -1) return text.slice(index + marker.length).trimEnd();
  }
  throw new Error(
    `ExitPlanMode approved but tool_result has no "## Approved Plan:" marker — ` +
    `remote may have hit the empty-plan or isAgent branch. Content preview: ${text.slice(0, 200)}`
  );
}

// Mapping: s05→extractApprovedPlan, H→content, $→text, q→markers, K→marker, _→index
```

### Algorithm: Marker Priority

**What it does:** Extracts the plan body from a `tool_result` that contains the formatted `## Approved Plan:` marker.

**Why two markers?** v2.1.112's `mapToolResultToToolResultBlockParam` introduced the `planWasEdited` distinction: if the user edited the plan via CCR/Ctrl+G, the label changes to "Approved Plan (edited by user)". The scanner tries the edited marker first to preserve the "user-edited" signal upstream — if successful, the local CLI knows the plan was modified.

**Why throw on missing marker?** The scanner expected `mapToolResultToToolResultBlockParam` to produce ONE of:
- Branch B (subagent): "User has approved the plan..." — no marker. UltraplanPollError fires.
- Branch C (empty plan): "User has approved exiting plan mode..." — no marker. Error fires.
- Branch D (main path): with marker. Extracted.

The two error branches (subagent + empty) are not expected on the Ultraplan path. If they fire, something is wrong: either the remote session is misconfigured (running as subagent?) or the plan was empty (race condition between approval click and call processing).

The error message includes a 200-char preview so users can debug.

---

## Component: `pollForApprovedExitPlanMode` (`Qj4`)

```javascript
// ============================================
// pollForApprovedExitPlanMode - Driver loop with timeout, retry, phase callbacks
// Location: cli_inner_pretty.js:475178-475233
// ============================================

// ORIGINAL (for source lookup):
async function Qj4(H, $, q, K) {
  let _ = Date.now() + $,
    A = new gj4(),
    z = { eventsReceived: 0, firstEventAt: void 0, lastEventAt: void 0 },
    Y = null,
    f = 0,
    O = "running";
  while (Date.now() < _) {
    if (K()) throw Error("poll stopped by caller");
    let D, j;
    try {
      let P = await VwH(H, Y);
      if (((D = P.newEvents), (Y = P.lastEventId), (j = P.sessionStatus), (f = 0), D.length > 0)) {
        let Z = Date.now();
        ((z.eventsReceived += D.length), (z.firstEventAt ??= Z), (z.lastEventAt = Z));
      }
    } catch (P) {
      if (!qdH(P))
        throw new T$H(P instanceof Error ? P.message : String(P), "network_or_unknown", A.rejectCount, z, { cause: P });
      if (++f >= r05)
        throw new T$H("Lost connection to the remote session after repeated retries — the session may still be running",
          "network_or_unknown", A.rejectCount, z, { cause: P });
      await a8(Fj4);
      continue;
    }
    let J;
    try { J = A.ingest(D); }
    catch (P) {
      throw new T$H(P instanceof Error ? P.message : String(P), "extract_marker_missing", A.rejectCount, z);
    }
    if (J.kind === "approved") return { plan: J.plan, rejectCount: A.rejectCount, executionTarget: "remote" };
    if (J.kind === "teleport") return { plan: J.plan, rejectCount: A.rejectCount, executionTarget: "local" };
    if (J.kind === "terminated")
      throw new T$H(`remote session ended (${J.subtype}) before plan approval`, "terminated", A.rejectCount, z);
    let X = (j === "idle" || j === "requires_action") && D.length === 0,
      L = A.hasPendingPlan ? "plan_ready" : X ? "needs_input" : "running";
    if (L !== O) (N(`[ultraplan] phase ${O} → ${L}`), (O = L), q(L));
    await a8(Fj4);
  }
  let M = Math.round($ / 60000), w = M === 1 ? "minute" : "minutes";
  throw new T$H(
    A.everSeenPending ? `no approval after ${M} ${w}` : `ExitPlanMode never reached after ${M} ${w} (the remote container failed to start, or session ID mismatch?)`,
    A.everSeenPending ? "timeout_pending" : "timeout_no_plan",
    A.rejectCount, z,
  );
}

// READABLE (for understanding):
async function pollForApprovedExitPlanMode(remoteSessionId, timeoutMs, onPhaseChange, isStopped) {
  const deadline = Date.now() + timeoutMs;
  const scanner = new ExitPlanModeScanner();
  const stats = { eventsReceived: 0, firstEventAt: undefined, lastEventAt: undefined };
  let lastEventId = null;
  let consecutiveFailures = 0;
  let phase = 'running';

  while (Date.now() < deadline) {
    if (isStopped()) throw new Error('poll stopped by caller');
    let newEvents, sessionStatus;
    try {
      const result = await pollRemoteSessionEvents(remoteSessionId, lastEventId);
      ({ newEvents, lastEventId, sessionStatus } = result);
      consecutiveFailures = 0;
      if (newEvents.length > 0) {
        const now = Date.now();
        stats.eventsReceived += newEvents.length;
        stats.firstEventAt ??= now;
        stats.lastEventAt = now;
      }
    } catch (e) {
      if (!isRetryableNetworkError(e)) {
        throw new UltraplanPollError(e.message, 'network_or_unknown', scanner.rejectCount, stats, { cause: e });
      }
      if (++consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        throw new UltraplanPollError('Lost connection...', 'network_or_unknown', scanner.rejectCount, stats, { cause: e });
      }
      await sleep(POLL_INTERVAL_MS);
      continue;
    }
    let scanResult;
    try { scanResult = scanner.ingest(newEvents); }
    catch (e) {
      throw new UltraplanPollError(e.message, 'extract_marker_missing', scanner.rejectCount, stats);
    }
    if (scanResult.kind === 'approved')
      return { plan: scanResult.plan, rejectCount: scanner.rejectCount, executionTarget: 'remote' };
    if (scanResult.kind === 'teleport')
      return { plan: scanResult.plan, rejectCount: scanner.rejectCount, executionTarget: 'local' };
    if (scanResult.kind === 'terminated')
      throw new UltraplanPollError(`remote session ended (${scanResult.subtype}) before plan approval`,
        'terminated', scanner.rejectCount, stats);
    // Phase reporting
    const sessionIdle = (sessionStatus === 'idle' || sessionStatus === 'requires_action') && newEvents.length === 0;
    const newPhase = scanner.hasPendingPlan ? 'plan_ready' : sessionIdle ? 'needs_input' : 'running';
    if (newPhase !== phase) {
      logForDebugging(`[ultraplan] phase ${phase} → ${newPhase}`);
      phase = newPhase;
      onPhaseChange(newPhase);
    }
    await sleep(POLL_INTERVAL_MS);
  }
  // Timeout
  const minutes = Math.round(timeoutMs / 60000);
  const word = minutes === 1 ? 'minute' : 'minutes';
  throw new UltraplanPollError(
    scanner.everSeenPending
      ? `no approval after ${minutes} ${word}`
      : `ExitPlanMode never reached after ${minutes} ${word} (the remote container failed to start, or session ID mismatch?)`,
    scanner.everSeenPending ? 'timeout_pending' : 'timeout_no_plan',
    scanner.rejectCount, stats,
  );
}

// Mapping: Qj4→pollForApprovedExitPlanMode, H→remoteSessionId, $→timeoutMs, q→onPhaseChange,
//          K→isStopped, _→deadline, A→scanner, z→stats, Y→lastEventId, f→consecutiveFailures,
//          O→phase, D→newEvents, j→sessionStatus, J→scanResult, X→sessionIdle, L→newPhase,
//          VwH→pollRemoteSessionEvents, qdH→isRetryableNetworkError, a8→sleep,
//          r05→MAX_CONSECUTIVE_FAILURES, Fj4→POLL_INTERVAL_MS, T$H→UltraplanPollError, N→logForDebugging
```

### Algorithm: 3-Phase Polling

**What it does:** Continuously polls the remote session for new events until a plan is approved/teleported, the session ends, or the timeout fires.

**Phase model:**
- `running`: events flowing, no pending plan
- `needs_input`: session is idle (or requires_action), no plan pending, but no events recently — the model is waiting for the user
- `plan_ready`: an `ExitPlanMode` call has been emitted; user needs to approve/reject in browser

**Phase callback** (`onPhaseChange`) drives the local CLI's UI update (status bar messages: "ultraplan ready", "ultraplan needs your input", "ultraplan working...").

**Retry policy:**
- Network errors (transient): retry up to `MAX_CONSECUTIVE_FAILURES` (5).
- Non-retryable errors: surface immediately.
- After 5 consecutive failures: surface "Lost connection..." with the underlying cause attached.

**Timeout:**
- Two error reasons distinguished:
  - `timeout_pending`: a plan was at some point pending (everSeenPending = true), but the user didn't approve in time.
  - `timeout_no_plan`: no plan was ever pending — likely the remote container failed to start.

**Cancellation:** The `isStopped()` callback is consulted each iteration. If the user navigates away from the remote-session UI (or cancels via Ctrl+C), the poll aborts.

**Key insight:** The poll is purely event-driven once started: the scanner doesn't care about elapsed time, only about events. The driver loop manages timeouts. This separation makes the scanner trivial to test (no clock mocking needed).

---

## Algorithm: Phase Display Strings

```javascript
// Inside the remote-agent label/status renderer at cli_inner_pretty.js:348802-348808:
switch ($.ultraplanPhase) {
  case "approved":
    return `${Sv} ultraplan ready`;        // success glyph + "ready"
  case "plan_ready":
  case "needs_input":
    return `${HL} ultraplan needs your input`;  // alert glyph + "needs input"
  default:
    return `${HL} ultraplan`;              // alert glyph + "ultraplan"
}
```

The renderer maps the scanner's `phase` to a user-facing label. `plan_ready` and `needs_input` are merged at the display layer because they both mean "user, please open the browser" from the CLI's perspective.

---

## v2.1.119 Fix: Remote Session URL in Transcript

The changelog entry "Fixed 'Refine with Ultraplan' not showing the remote session URL in the transcript" indicates that the local CLI used to fail to embed the CCR URL when ultraplan was invoked. The fix in v2.1.142 ensures the URL is part of the bridge-session attribution that goes into the transcript.

The relevant code path is the `ultraplanCommandHandler` (the `/ultraplan` slash command). It calls `teleportToRemote` which sets `remoteSessionId` and embeds the corresponding URL into a transcript message of subtype `bridge-session-url` (or similar). v2.1.112 had a missing branch where this embedding was skipped when the remote session was an inherited (non-fresh) one. v2.1.142 fixes that.

The specific source-code change is small and not central to plan-mode itself; refer to the `15_remote/` documentation for the bridge-session message format details.

---

## v2.1.112 → v2.1.142 Diff Summary

| Aspect | v2.1.112 | v2.1.142 | Status |
|--------|----------|----------|--------|
| `ExitPlanModeScanner` 4-state classifier | yes | yes | Identical |
| Newest-first scan with rejection rescan | yes | yes | Identical |
| `extractApprovedPlan` dual-marker | yes (planWasEdited + plain) | yes | Identical |
| `extractTeleportPlan` sentinel parsing | yes | yes | Identical |
| `pollForApprovedExitPlanMode` driver | yes (5 retries, 3s interval) | yes | Identical |
| Phase reporting (running/plan_ready/needs_input) | yes | yes | Identical |
| `UltraplanPollError` typed reasons | yes (5 reasons) | yes | Identical |
| `isUltraplanAvailable` gate (config + RC bridge + not bg) | yes | yes | Identical |
| Remote session URL in transcript | (broken pre-v2.1.119) | **Fixed** | **v2.1.119 fix** |

The Ultraplan integration is structurally unchanged. The v2.1.119 transcript-URL fix is small and orthogonal to the scanner/driver core.

---

## Related

- [implementation.md](./implementation.md) — local-side plan lifecycle (Ultraplan's local counterpart)
- [exit_plan_mode_tool.md](./exit_plan_mode_tool.md) — the `tool_result` shape that `extractApprovedPlan` parses
- [remote_sessions.md](./remote_sessions.md) — CCR persistence + recovery (orthogonal to Ultraplan)
- [permission_mode_persistence.md](./permission_mode_persistence.md) — v2.1.119/132/136 deltas
