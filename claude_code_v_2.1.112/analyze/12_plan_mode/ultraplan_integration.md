# Ultraplan Integration (v2.1.112)

> Ultraplan is the "Refine plan on Claude Code on the web" path. From the local CLI, the user (or model rejecting locally with the teleport sentinel) hands the plan off to a remote CCR session. The local process then polls the remote session's event stream until an `ExitPlanMode` `tool_result` lands, at which point the plan is brought back into the local conversation. This file analyses the remote-execution loop, the `ExitPlanModeScanner` state classifier, and the `pollForApprovedExitPlanMode` polling driver.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_unit_02.md](../00_overview/symbol_additions_unit_02.md) — Symbol discoveries for this unit
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Existing plan-mode references

Key functions in this document:
- `ExitPlanModeScanner` (`PlK`) — Pure stateful classifier over the CCR event stream, chunks.183.mjs:898-966
- `pollForApprovedExitPlanMode` (`WlK`) — Polling driver with retry + phase reporting, chunks.183.mjs:968-1015
- `extractApprovedPlan` (`rQY`) — Parses `## Approved Plan` marker, chunks.183.mjs:1030-1040
- `extractTeleportPlan` (`iQY`) — Parses `__ULTRAPLAN_TELEPORT_LOCAL__` sentinel, chunks.183.mjs:1021-1028
- `contentToText` (`DlK`) — Normalises string vs `[{text}]` content shapes, chunks.183.mjs:1017-1019
- `UltraplanPollError` (`_66`) — Typed-reason error class, chunks.183.mjs:1054-1063
- `isUltraplanAvailable` (`hn`) — Feature gate (config + remote-control bridge), chunks.183.mjs:1066-1068
- `isRemoteControlAvailable` (`mx`) — CCR bridge predicate, chunks.115.mjs:2513-2515
- `ultraplanCommandHandler` (`jdY`) — Slash-command entry, chunks.183.mjs:1562-1599
- `pollUltraplanSession` (`YdY`) — Background polling task, chunks.183.mjs:1267-1353
- `ULTRAPLAN_TELEPORT_SENTINEL` (`nQY`) — `"__ULTRAPLAN_TELEPORT_LOCAL__"`, chunks.183.mjs:1048
- `POLL_INTERVAL_MS` (`MlK`) — 3000, chunks.183.mjs:1042
- `MAX_CONSECUTIVE_FAILURES` (`lQY`) — 5, chunks.183.mjs:1044

---

## Architecture

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

## Stage 0: Feature Gate

```javascript
// ============================================
// isUltraplanAvailable - Feature gate for Ultraplan
// Location: chunks.183.mjs:1066-1068
// ============================================

// ORIGINAL (for source lookup):
function hn() {
    return u8("tengu_ultraplan_config", null)?.enabled === !0 && mx()
}

// READABLE (for understanding):
function isUltraplanAvailable() {
    const config = getFeatureFlag("tengu_ultraplan_config", null);
    return config?.enabled === true && isRemoteControlAvailable();
}

// Mapping: hn→isUltraplanAvailable, u8→getFeatureFlag, mx→isRemoteControlAvailable
```

### Why two clauses?

`tengu_ultraplan_config.enabled` is the *product*-level toggle (GrowthBook flag); `isRemoteControlAvailable()` is the *infrastructure*-level capability check (does this org's claude.ai login include the CCR bridge?).

The v2.1.101 changelog item — "hide Refine with Ultraplan option when org can't reach Claude Code web" — is implemented here: prior to v2.1.101, `hn()` returned `true` whenever the GrowthBook flag was on, even for on-prem-only orgs whose CCR bridge auth would fail at launch time. Adding `&& mx()` short-circuits the modal option, the slash command, and the keyword-trigger UI all at once.

`mx()` reads:

```javascript
// chunks.115.mjs:2513
function isRemoteControlAvailable() {
    return Qo1() && getFeatureFlag("tengu_ccr_bridge", false);
}
// Qo1() → hasSubscriptionForRemoteControl (claude.ai-class login)
```

This composes two gates: subscription class + GrowthBook bridge flag. Together they say "this user can reach the web *and* the web feature is enabled for their org."

---

## Stage 1: Local Slash-Command Launch (`/ultraplan`)

```javascript
// ============================================
// ultraplanCommandHandler - /ultraplan slash command entry
// Location: chunks.183.mjs:1562-1599
// ============================================

// ORIGINAL (excerpt):
jdY = async (q, K, _) => {
    let z = Fr8(_).trim();
    if (!N5("allow_remote_sessions")) return q(ml({ type:"policy_blocked" }), { display:"system" }), null;
    if (!z) {
        let w = await c_8({ arg:z, getAppState:K.getAppState, setAppState:K.setAppState, signal:K.abortController.signal });
        return q(w, { display:"system" }), null
    }
    let { ultraplanSessionUrl: Y, ultraplanLaunching: A } = K.getAppState();
    if (Y || A) return d("tengu_ultraplan_create_failed", {
        reason: Y ? "already_polling" : "already_launching"
    }), q(LlK(Y), { display:"system" }), null;
    let O = H8().hasSeenUltraplanTerms ? void 0 : wu6().catch(() => null);
    return K.setAppState((w) => ({ ...w, ultraplanLaunchPending: { ultraplanArg: z, sourcePromise: O } })), q(void 0, { display:"skip" }), null
}

// READABLE (for understanding):
async function ultraplanCommandHandler(emit, context, args) {
    const arg = stripUserPromptArg(args).trim();

    // Org-level block: enterprise can disable remote sessions entirely.
    if (!isOrgFeatureEnabled("allow_remote_sessions")) {
        emit(formatError({ type: "policy_blocked" }), { display: "system" });
        return null;
    }

    // No prompt provided: ask for one inline (or surface unavailability)
    if (!arg) {
        const msg = await getUltraplanUnavailableMessage({
            arg, getAppState: context.getAppState,
            setAppState: context.setAppState, signal: context.abortController.signal,
        });
        emit(msg, { display: "system" });
        return null;
    }

    // Idempotent: refuse to launch a second session while one is active
    const { ultraplanSessionUrl, ultraplanLaunching } = context.getAppState();
    if (ultraplanSessionUrl || ultraplanLaunching) {
        logEvent("tengu_ultraplan_create_failed", {
            reason: ultraplanSessionUrl ? "already_polling" : "already_launching"
        });
        emit(alreadyRunningMessage(ultraplanSessionUrl), { display: "system" });
        return null;
    }

    // Pre-fetch terms acceptance source (lazily, no-await — hydrates the modal)
    const sourcePromise = getAppConfig().hasSeenUltraplanTerms ? undefined : getUltraplanTermsSource().catch(() => null);
    context.setAppState(prev => ({
        ...prev,
        ultraplanLaunchPending: { ultraplanArg: arg, sourcePromise }
    }));
    emit(undefined, { display: "skip" });
    return null;
}
```

The handler is **non-blocking**: it stages the launch intent in `appState.ultraplanLaunchPending`, then a React effect (in the REPL/CommandQueue) picks it up, displays the consent modal, and calls `teleportToRemote(...)` on confirmation.

---

## Stage 2: ExitPlanModeScanner — The State Classifier

This is the cleverest piece of the integration. It's a *pure* class that ingests batches of `SDKMessage` events from the CCR session and tracks ExitPlanMode lifecycle independently of timers/IO.

```javascript
// ============================================
// ExitPlanModeScanner - Stateful classifier over CCR events
// Location: chunks.183.mjs:898-966
// ============================================

// ORIGINAL (for source lookup):
class PlK {
    exitPlanCalls = [];
    results = new Map;
    rejectedIds = new Set;
    terminated = null;
    rescanAfterRejection = !1;
    everSeenPending = !1;
    get rejectCount() { return this.rejectedIds.size }
    get hasPendingPlan() {
        let q = this.exitPlanCalls.findLast((K) => !this.rejectedIds.has(K));
        return q !== void 0 && !this.results.has(q)
    }
    ingest(q) {
        for (let z of q)
            if (z.type === "assistant")
                for (let Y of z.message.content) {
                    if (Y.type !== "tool_use") continue;
                    let A = Y;
                    if (A.name === dP) this.exitPlanCalls.push(A.id)
                }
            else if (z.type === "user") {
                let Y = z.message.content;
                if (!Array.isArray(Y)) continue;
                for (let A of Y) if (A.type === "tool_result") this.results.set(A.tool_use_id, A)
            } else if (z.type === "result" && z.subtype !== "success") this.terminated = { subtype: z.subtype };

        let K = q.length > 0 || this.rescanAfterRejection;
        this.rescanAfterRejection = !1;
        let _ = null;
        if (K) {
            for (let z = this.exitPlanCalls.length - 1; z >= 0; z--) {
                let Y = this.exitPlanCalls[z];
                if (this.rejectedIds.has(Y)) continue;
                let A = this.results.get(Y);
                if (!A) _ = { kind: "pending" };
                else if (A.is_error === !0) {
                    let O = iQY(A.content);
                    _ = O !== null ? { kind:"teleport", plan: O } : { kind:"rejected", id: Y }
                } else _ = { kind: "approved", plan: rQY(A.content) };
                break
            }
            if (_?.kind === "approved" || _?.kind === "teleport") return _
        }
        if (_?.kind === "rejected") this.rejectedIds.add(_.id), this.rescanAfterRejection = !0;
        if (this.terminated) return { kind:"terminated", subtype: this.terminated.subtype };
        if (_?.kind === "rejected") return _;
        if (_?.kind === "pending") return this.everSeenPending = !0, _;
        return { kind: "unchanged" }
    }
}

// READABLE (for understanding):
class ExitPlanModeScanner {
    exitPlanCalls = [];   // tool_use IDs of ExitPlanMode calls, in order
    results = new Map();  // tool_use_id → ToolResultBlockParam
    rejectedIds = new Set();
    terminated = null;
    rescanAfterRejection = false;
    everSeenPending = false;

    get rejectCount() { return this.rejectedIds.size; }
    get hasPendingPlan() {
        const id = this.exitPlanCalls.findLast(c => !this.rejectedIds.has(c));
        return id !== undefined && !this.results.has(id);
    }

    ingest(newEvents) {
        // Phase 1: absorb new events into bookkeeping
        for (const m of newEvents) {
            if (m.type === "assistant") {
                for (const block of m.message.content) {
                    if (block.type !== "tool_use") continue;
                    if (block.name === EXIT_PLAN_MODE_V2_TOOL_NAME) this.exitPlanCalls.push(block.id);
                }
            } else if (m.type === "user") {
                const content = m.message.content;
                if (!Array.isArray(content)) continue;
                for (const block of content) {
                    if (block.type === "tool_result") this.results.set(block.tool_use_id, block);
                }
            } else if (m.type === "result" && m.subtype !== "success") {
                // success fires every turn — only error subtypes mean death
                this.terminated = { subtype: m.subtype };
            }
        }

        // Phase 2: scan for the newest non-rejected ExitPlanMode and classify
        const shouldScan = newEvents.length > 0 || this.rescanAfterRejection;
        this.rescanAfterRejection = false;
        let found = null;
        if (shouldScan) {
            for (let i = this.exitPlanCalls.length - 1; i >= 0; i--) {
                const id = this.exitPlanCalls[i];
                if (this.rejectedIds.has(id)) continue;
                const result = this.results.get(id);
                if (!result) {
                    found = { kind: "pending" };
                } else if (result.is_error === true) {
                    const teleportPlan = extractTeleportPlan(result.content);
                    found = teleportPlan !== null
                        ? { kind: "teleport", plan: teleportPlan }
                        : { kind: "rejected", id };
                } else {
                    found = { kind: "approved", plan: extractApprovedPlan(result.content) };
                }
                break;
            }
            // Approval/teleport short-circuit — they always win
            if (found?.kind === "approved" || found?.kind === "teleport") return found;
        }

        // Phase 3: bookkeeping then return with precedence
        if (found?.kind === "rejected") {
            this.rejectedIds.add(found.id);
            this.rescanAfterRejection = true;
        }
        if (this.terminated) return { kind: "terminated", subtype: this.terminated.subtype };
        if (found?.kind === "rejected") return found;
        if (found?.kind === "pending") { this.everSeenPending = true; return found; }
        return { kind: "unchanged" };
    }
}

// Mapping: PlK→ExitPlanModeScanner, dP→EXIT_PLAN_MODE_V2_TOOL_NAME,
//          iQY→extractTeleportPlan, rQY→extractApprovedPlan
```

### Algorithm Deep Dive: Why the precedence `approved > terminated > rejected > pending > unchanged`?

**What it does:** Classifies the current state of the CCR session's plan flow given the accumulated events.

**How it works:**
- **`approved` first:** A batch from `pollRemoteSessionEvents` may contain *both* an approved `tool_result` AND a subsequent `{type:'result'}` (e.g., user approved, then the remote crashed immediately after — but the plan made it into threadstore). The plan is real; don't drop it because of a downstream error.
- **`terminated` second:** Any non-`success` result subtype (`error_during_execution`, `error_max_turns`, etc.) means the session is dead. Continuing to poll is wasted effort.
- **`rejected` third:** A user rejection moves the "newest non-rejected ExitPlanMode" target. We track each rejected `tool_use_id` so the next scan skips it, and we set `rescanAfterRejection` so the next `ingest()` call (even with zero new events) re-runs the scan to pick up the new newest.
- **`pending` fourth:** ExitPlanMode is in flight (`tool_use` exists, no `tool_result` yet). The web modal is showing. Caller can transition `running → plan_ready` based on this.
- **`unchanged` fallback:** Nothing relevant changed; caller continues polling.

**Why this approach:**
- The scanner is **pure**: no I/O, no timers. Unit tests can feed synthetic event batches and assert classification. Offline replay (debugging a real session) works the same way.
- Separating *bookkeeping* (Phase 1) from *classification* (Phase 2-3) means one ingestion can absorb multiple events of mixed types and still arrive at a coherent verdict.
- The "scan from newest" loop with `rejectedIds` skip is O(n) per ingest but n is bounded — the model rarely makes >5 ExitPlanMode calls per session.
- The `rescanAfterRejection` flag is the only piece of cross-batch state that triggers a scan even when the new batch is empty. Without it, a rejected-without-replacement plan would leave the scanner returning `unchanged` instead of `rejected`.

**Trade-offs:**
- The double-skip-scan optimisation (`shouldScan = newEvents.length > 0 || rescanAfterRejection`) saves CPU when nothing changed, at the cost of one extra boolean.
- Storing `tool_result` blocks (not just IDs) in `results` means the scanner can re-parse content if `extractApprovedPlan` is updated, but adds memory cost ~hundreds of bytes per call. Worth it.

**Key insight:** `is_error: true` content is **ambiguous** — it could be a normal rejection OR a "teleport back to terminal" intent. The sentinel `__ULTRAPLAN_TELEPORT_LOCAL__` in the feedback is what disambiguates. This is a clever protocol: a rejection-with-sentinel keeps the remote session in plan mode (because it's a *rejection*) but the local side knows to seize the plan.

---

## Stage 3: pollForApprovedExitPlanMode — The Driver

```javascript
// ============================================
// pollForApprovedExitPlanMode - Polling driver with retry + phase reporting
// Location: chunks.183.mjs:968-1015
// ============================================

// ORIGINAL (excerpt):
async function WlK(q, K, _, z) {
    let Y = Date.now() + K, A = new PlK, O = null, w = 0, $ = "running";
    while (Date.now() < Y) {
        if (z?.()) throw Error("poll stopped by caller");
        let J, X;
        try {
            let D = await YK8(q, O);
            J = D.newEvents, O = D.lastEventId, X = D.sessionStatus, w = 0
        } catch (D) {
            if (!Ju8(D)) throw new _66(D instanceof Error ? D.message : String(D), "network_or_unknown", A.rejectCount, { cause: D });
            if (++w >= lQY) throw new _66("Lost connection to the remote session after repeated retries — the session may still be running", "network_or_unknown", A.rejectCount, { cause: D });
            await l7(MlK);
            continue
        }
        let M;
        try { M = A.ingest(J) }
        catch (D) { throw new _66(D instanceof Error ? D.message : String(D), "extract_marker_missing", A.rejectCount) }
        if (M.kind === "approved") return { plan: M.plan, rejectCount: A.rejectCount, executionTarget: "remote" };
        if (M.kind === "teleport") return { plan: M.plan, rejectCount: A.rejectCount, executionTarget: "local" };
        if (M.kind === "terminated") throw new _66(`remote session ended (${M.subtype}) before plan approval`, "terminated", A.rejectCount);
        let P = (X === "idle" || X === "requires_action") && J.length === 0,
            W = A.hasPendingPlan ? "plan_ready" : P ? "needs_input" : "running";
        if (W !== $) E(`[ultraplan] phase ${$} → ${W}`), $ = W, _?.(W);
        await l7(MlK)
    }
    let j = Math.round(K / 60000), H = j === 1 ? "minute" : "minutes";
    throw new _66(A.everSeenPending ? `no approval after ${j} ${H}` : `ExitPlanMode never reached after ${j} ${H} (the remote container failed to start, or session ID mismatch?)`, A.everSeenPending ? "timeout_pending" : "timeout_no_plan", A.rejectCount)
}

// READABLE (for understanding):
async function pollForApprovedExitPlanMode(sessionId, timeoutMs, onPhaseChange, shouldStop) {
    const deadline = Date.now() + timeoutMs;
    const scanner = new ExitPlanModeScanner();
    let cursor = null;
    let failures = 0;
    let lastPhase = "running";

    while (Date.now() < deadline) {
        if (shouldStop?.()) throw new UltraplanPollError("poll stopped by caller", "stopped", scanner.rejectCount);

        let newEvents, sessionStatus;
        try {
            const resp = await pollRemoteSessionEvents(sessionId, cursor);
            newEvents = resp.newEvents;
            cursor = resp.lastEventId;
            sessionStatus = resp.sessionStatus;
            failures = 0;
        } catch (e) {
            const transient = isTransientNetworkError(e);
            if (!transient) {
                throw new UltraplanPollError(e instanceof Error ? e.message : String(e), "network_or_unknown", scanner.rejectCount, { cause: e });
            }
            if (++failures >= MAX_CONSECUTIVE_FAILURES) {
                throw new UltraplanPollError("Lost connection to the remote session after repeated retries — the session may still be running", "network_or_unknown", scanner.rejectCount, { cause: e });
            }
            await sleep(POLL_INTERVAL_MS);
            continue;
        }

        let result;
        try { result = scanner.ingest(newEvents); }
        catch (e) { throw new UltraplanPollError(e instanceof Error ? e.message : String(e), "extract_marker_missing", scanner.rejectCount); }

        if (result.kind === "approved")  return { plan: result.plan, rejectCount: scanner.rejectCount, executionTarget: "remote" };
        if (result.kind === "teleport")  return { plan: result.plan, rejectCount: scanner.rejectCount, executionTarget: "local" };
        if (result.kind === "terminated") throw new UltraplanPollError(`remote session ended (${result.subtype}) before plan approval`, "terminated", scanner.rejectCount);

        // CCR briefly flips to 'idle' between tool turns; only trust idle
        // when no new events arrived (events flowing = working regardless of status).
        const quietIdle = (sessionStatus === "idle" || sessionStatus === "requires_action") && newEvents.length === 0;
        const phase = scanner.hasPendingPlan ? "plan_ready" : quietIdle ? "needs_input" : "running";
        if (phase !== lastPhase) {
            logForDebugging(`[ultraplan] phase ${lastPhase} → ${phase}`);
            lastPhase = phase;
            onPhaseChange?.(phase);
        }
        await sleep(POLL_INTERVAL_MS);
    }

    const minutes = Math.round(timeoutMs / 60000);
    const word = minutes === 1 ? "minute" : "minutes";
    throw new UltraplanPollError(
        scanner.everSeenPending
            ? `no approval after ${minutes} ${word}`
            : `ExitPlanMode never reached after ${minutes} ${word} (the remote container failed to start, or session ID mismatch?)`,
        scanner.everSeenPending ? "timeout_pending" : "timeout_no_plan",
        scanner.rejectCount,
    );
}

// Mapping: WlK→pollForApprovedExitPlanMode, PlK→ExitPlanModeScanner, YK8→pollRemoteSessionEvents,
//          Ju8→isTransientNetworkError, _66→UltraplanPollError, l7→sleep, E→logForDebugging,
//          lQY→MAX_CONSECUTIVE_FAILURES, MlK→POLL_INTERVAL_MS
```

### Algorithm Deep Dive: The phase machine

**What it does:** Reports a coarse UI state (`running` → `needs_input` → `plan_ready` → terminal) to the caller so the local UI can render a pill, badge, or notification.

**How it works:**
1. `running`: default state — the remote is actively executing.
2. `plan_ready`: the scanner sees an unresolved `ExitPlanMode` `tool_use` (modal is showing in the browser).
3. `needs_input`: the session status is `idle`/`requires_action` **and** the current poll batch had zero new events. The remote asked a clarifying question and is waiting for a browser reply.
4. Terminal: returned not via phase change but by the polling driver as `approved`, `teleport`, or by throwing `UltraplanPollError` with `terminated`/`timeout_*`.

**Why the `quietIdle` check?**
- CCR briefly flips to `idle` *between tool turns*, so polling that races a turn boundary would see `idle` even though the session is mid-stream.
- Requiring `newEvents.length === 0` filters out these false idles: if events flowed in this batch, the session is working regardless of the status snapshot.
- This also makes `needs_input → running` snap back to running on the first poll that sees the user's reply event, even if `session_status` lags.

**Trade-offs:**
- Phase transitions are dispatched on every cycle even if they immediately revert; the callback is responsible for debouncing.
- Polling at 3-second intervals (`POLL_INTERVAL_MS = 3000`) is a balance: faster = more responsive UI; slower = lower server load. For a 30-minute timeout, that's ~600 calls — exactly why `MAX_CONSECUTIVE_FAILURES = 5` exists (one blip during a 30-minute poll mustn't kill the run).

**Key insight:** Network errors are classified two ways: *transient* (retry up to 5 times) and *fatal* (immediate throw). `isTransientNetworkError()` is the discriminator — its definition lives in `teleport/api.ts` and covers 5xx, ECONNRESET, etc.

---

## Stage 4: Plan Extraction

```javascript
// ============================================
// extractApprovedPlan / extractTeleportPlan - Marker parsing
// Location: chunks.183.mjs:1017-1040
// ============================================

// ORIGINAL (for source lookup):
function DlK(q) {
    return typeof q === "string" ? q : Array.isArray(q) ? q.map((K) => ("text" in K) ? K.text : "").join("") : ""
}
function iQY(q) {
    let K = DlK(q), _ = `${nQY}\n`, z = K.indexOf(_);
    if (z === -1) return null;
    return K.slice(z + _.length).trimEnd()
}
function rQY(q) {
    let K = DlK(q), _ = [`## Approved Plan (edited by user):\n`, `## Approved Plan:\n`];
    for (let z of _) {
        let Y = K.indexOf(z);
        if (Y !== -1) return K.slice(Y + z.length).trimEnd()
    }
    throw Error(`ExitPlanMode approved but tool_result has no "## Approved Plan:" marker — remote may have hit the empty-plan or isAgent branch. Content preview: ${K.slice(0,200)}`)
}

// READABLE (for understanding):
function contentToText(content) {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) return content.map(b => "text" in b ? b.text : "").join("");
    return "";
}

function extractTeleportPlan(content) {
    const text = contentToText(content);
    const marker = `${ULTRAPLAN_TELEPORT_SENTINEL}\n`;
    const idx = text.indexOf(marker);
    if (idx === -1) return null;       // regular rejection
    return text.slice(idx + marker.length).trimEnd();
}

function extractApprovedPlan(content) {
    const text = contentToText(content);
    const markers = [
        "## Approved Plan (edited by user):\n",
        "## Approved Plan:\n",
    ];
    for (const marker of markers) {
        const idx = text.indexOf(marker);
        if (idx !== -1) return text.slice(idx + marker.length).trimEnd();
    }
    throw new Error(
        `ExitPlanMode approved but tool_result has no "## Approved Plan:" marker — remote may have hit the empty-plan or isAgent branch. Content preview: ${text.slice(0, 200)}`,
    );
}

// Mapping: DlK→contentToText, iQY→extractTeleportPlan, rQY→extractApprovedPlan,
//          nQY→ULTRAPLAN_TELEPORT_SENTINEL
```

### Why two markers in `extractApprovedPlan`?

The tool's `mapToolResultToToolResultBlockParam` emits **two** label variants:
- `"Approved Plan"` (model wrote the plan; user accepted as-is)
- `"Approved Plan (edited by user):"` (user clicked Ctrl+G or edited in the CCR web UI, then accepted)

The poll loop doesn't care which — it just wants the plan content. Trying both markers in order handles both branches.

### Why throw on missing marker?

If the tool returns the *empty-plan* or *isAgent* branch (see `mapToolResultToToolResultBlockParam` in [approval_flow.md](./approval_flow.md)), the `tool_result` content has no plan in it. The scanner sees `is_error: false` so it classifies as approved, but extraction fails. The throw gets caught by `pollForApprovedExitPlanMode`, wrapped in `UltraplanPollError` with reason `extract_marker_missing`. The caller surfaces this as an error notification to the user — useful for diagnosing "I approved but the plan didn't come back."

### Content shape normalisation

`contentToText` handles two shapes that `tool_result.content` can take:
1. Plain string (the common case when threadstore serialised the result)
2. An array `[{type:'text', text:'...'}]` (the canonical SDK shape)

Both arrive depending on threadstore encoding; the helper smooths them into a single string before marker search.

---

## Stage 5: Background Polling Task (`pollUltraplanSession`)

The polling driver is wrapped in a background task so the local CLI remains interactive while the remote refines.

```javascript
// ============================================
// pollUltraplanSession - Background poller, dispatches results
// Location: chunks.183.mjs:1267-1353
// ============================================

// READABLE (excerpt — happy paths only):
function pollUltraplanSession(taskId, sessionId, sessionUrl, getAppState, setAppState, onPhaseChange) {
    const taskRegistry = getTaskRegistry(getAppState, setAppState);
    const startedAt = Date.now();
    let pendingDelivered = false;
    let failed = false;

    (async () => {
        try {
            const { plan, rejectCount, executionTarget } = await pollForApprovedExitPlanMode(
                sessionId, getUltraplanTimeoutMs(),
                phase => {
                    if (getAppState().tasks?.[taskId]?.status !== "running") return;
                    if (phase === "needs_input") logEvent("tengu_ultraplan_awaiting_input", {});
                    if (phase === "plan_ready" && !pendingDelivered) {
                        pendingDelivered = true;
                        onPhaseChange?.(planReadyMessage(sessionUrl));
                        enqueuePendingNotification({
                            value: `The remote ultraplan session produced a plan and is waiting for approval. Tell the user to open ${sessionUrl} to review it.`,
                            mode: "task-notification",
                            isMeta: true,
                        });
                    }
                    taskRegistry.update(taskId, t => /* set ultraplanPhase */);
                },
                () => getAppState().tasks?.[taskId]?.status !== "running",
            );

            logEvent("tengu_ultraplan_approved", {
                duration_ms: Date.now() - startedAt,
                plan_length: plan.length,
                reject_count: rejectCount,
                execution_target: executionTarget,
            });

            if (executionTarget === "remote") {
                // Approved in CCR: PR-style execution, archive the remote
                archiveRemoteSession(sessionId).catch(/* log */);
                taskRegistry.update(taskId, t => ({ ...t, status:"completed", endTime:Date.now() }));
                setAppState(s => s.ultraplanSessionUrl === sessionUrl ? { ...s, ultraplanSessionUrl: undefined } : s);
                enqueuePendingNotification({ value: `Ultraplan approved — executing in Claude Code on the web. Follow along at: ${sessionUrl}\n\nResults will land as a pull request when the remote session finishes. There is nothing to do here.`, mode: "task-notification" });
            } else {
                // Teleport-back-to-terminal: stage a choice modal locally
                setAppState(prev => {
                    const task = prev.tasks?.[taskId];
                    if (!task || task.status !== "running") return prev;
                    return { ...prev, ultraplanPendingChoice: { plan, sessionId, taskId } };
                });
            }
        } catch (e) {
            // see chunks.183.mjs:1326-1344 for error path
        }
    })();
}
```

### Execution target dispatch

| `executionTarget` | Meaning | Local action |
|-------------------|---------|--------------|
| `"remote"` | User approved in CCR web UI; remote is executing the plan now | Archive remote session metadata; emit "follow along at <url>" notification; clear `ultraplanSessionUrl` from state |
| `"local"` | User clicked "teleport back to terminal" — they want to execute locally | Stage `ultraplanPendingChoice` in app state; UI shows a modal asking the user how to use the plan locally |

---

## Error Class

```javascript
// ============================================
// UltraplanPollError - Typed-reason error
// Location: chunks.183.mjs:1054-1063
// ============================================

class UltraplanPollError extends Error {
    reason;       // PollFailReason
    rejectCount;
    constructor(message, reason, rejectCount, options) {
        super(message, options);
        this.reason = reason;
        this.rejectCount = rejectCount;
        this.name = "UltraplanPollError";
    }
}

// PollFailReason values:
// "terminated"           – CCR session ended (error subtype)
// "timeout_pending"      – timeout, but ExitPlanMode was at least attempted
// "timeout_no_plan"      – timeout, ExitPlanMode never reached (container crash? wrong sessionId?)
// "extract_marker_missing" – marker absent (empty-plan / isAgent branch hit)
// "network_or_unknown"   – non-transient network error or >5 transient retries
// "stopped"              – caller cancelled via shouldStop predicate
```

The typed reason lets analytics (`tengu_ultraplan_failed`) and the user-facing message generator distinguish "your container crashed" from "you got rate-limited" from "you stopped it."

---

## Constants Reference

| Constant | Value | Why |
|----------|-------|-----|
| `POLL_INTERVAL_MS` (`MlK`) | 3000 | 3 s strikes the balance between UI responsiveness and server load |
| `MAX_CONSECUTIVE_FAILURES` (`lQY`) | 5 | At ~600 calls per 30-min poll, even a 1% transient-error rate would kill the run without retry |
| `ULTRAPLAN_TELEPORT_SENTINEL` (`nQY`) | `"__ULTRAPLAN_TELEPORT_LOCAL__"` | Browser's PlanModal embeds this in feedback when user clicks "teleport back to terminal" |
| `ULTRAPLAN_DOCS_URL` (`t_6`) | `"https://code.claude.com/docs/en/claude-code-on-the-web"` | Linked from the `/ultraplan` description |
| `DEFAULT_ULTRAPLAN_FLAVOR` (`ElK`) | `"simple_plan"` | Default flavour when none specified |
| `ULTRAPLAN_FLAVORS` (`oOj`) | `Object.keys(f$7)` = `["simple_plan", "visual_plan", "three_subagents_with_critique"]` | Available flavours |
