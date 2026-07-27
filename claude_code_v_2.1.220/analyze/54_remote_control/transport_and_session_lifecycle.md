# Remote Control transport and session lifecycle

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

This document covers the wire: how a CLI process becomes a Remote Control **worker**, how it is
replaced, what it sends, and what happens when the connection breaks. Every timing constant in the
subsystem is listed in §1 so the later sections can reason about them.

---

## 0. The two halves of the transport, and why there are two

Remote Control is **not** a single duplex socket. It is deliberately split:

| Direction | Mechanism | Class | Endpoint |
|---|---|---|---|
| CLI → server (events, state, acks, heartbeat) | ordinary HTTPS requests, queued and batched | `CCRClient` (`iln`, `:415586`) | `PUT /worker`, `POST /worker/events`, `POST /worker/internal-events`, `POST /worker/events/delivery`, `POST /worker/heartbeat` |
| server → CLI (user messages, control requests) | one long-lived **SSE** stream, self-healing | `SSETransport` (`lln`, `:416401`) | `GET …/stream`, replies via `POST` |

Both halves are carryover in shape: 2.1.193 has the same two classes (`:620400`-ish and `:621250`-ish
`(193)`) with the same endpoint strings. What changed in this window is entirely in the *lifecycle*
edges — close, replace, reconnect, and re-join.

**Why split at all?** Because the two directions have opposite failure semantics. Outbound events must
be *durable* (a dropped assistant message is a hole in the transcript a phone will never see), so they
go through a retrying queue with backpressure. Inbound frames must be *live* (a stale user message is
worse than none), so they ride a stream that is torn down and rebuilt on any doubt. Muxing them onto
one connection would force one policy on both.

---

## 1. Every timing constant in the subsystem (2.1.220)

Read from two declaration blocks and one config object.

**Server-tunable session config** — the defaults object `Lkd` (`:415327-415342`) and its validating zod
schema `S7y` (`:415343-415368`). Every field arrives from the server and is clamped by the schema:

| Field | Default | Schema clamp | Purpose |
|---|---|---|---|
| `init_retry_max_attempts` | 3 | 1–10 | `PUT /worker` registration retries |
| `init_retry_base_delay_ms` | 500 | ≥100 | registration backoff base |
| `init_retry_jitter_fraction` | 0.25 | 0–1 | registration jitter |
| `init_retry_max_delay_ms` | 4000 | ≥500 | registration backoff cap |
| `http_timeout_ms` | 10000 | ≥2000 | default request timeout |
| `uuid_dedup_buffer_size` | 2000 | 100–50000 | inbound echo suppression window |
| **`heartbeat_interval_ms`** | **20000** | **5000–30000** | worker liveness ping |
| **`heartbeat_jitter_fraction`** | **0.1** | 0–0.5 | ±10 % de-synchronisation |
| `token_refresh_buffer_ms` | 300000 | 30000–1800000 | refresh the session token 5 min early |
| `teardown_archive_timeout_ms` | 1500 | 500–2000 | how long teardown waits to archive |
| `connect_timeout_ms` | 15000 | 5000–60000 | SSE connect |
| `oauth_retry_max_attempts` | 3 | 0–6 | |
| `oauth_retry_base_delay_ms` | 2000 | 100–10000 | |
| `min_version` | `"0.0.0"` | semver-refined | gates old clients (message `:415318-415319`) |

**Hard-coded client constants** (`:416212-416223` and `:416383-416389`):

```
E7y = 20000    default heartbeat interval when the server sends no config
v7y = 10000    FLOOR for a server-pushed heartbeat interval
A7y = 300000   CEILING for a server-pushed heartbeat interval
w7y = 100      stream_event coalescing window (ms)
Okd = 61440    max bytes for one ephemeral stream_event (60 KiB) before it is dropped
v$s = 1536     max preserved_event_ids carried on an internal event
T7y = 10       generic request retry attempts
C7y = 3        (secondary retry budget)
x7y = 10000    how long initialize() waits for prior worker state before registering
k7y = 3000     pre-exit internal-event flush budget
D7y = 1000     SSE reconnect backoff base
P7y = 30000    SSE reconnect backoff cap
Ukd = 45000    SSE liveness timeout — no frame in 45 s ⇒ reconnect
aln = 10       SSE POST retry attempts
O7y = 500      SSE POST backoff base
$7y = 8000     SSE POST backoff cap
```

Uploader queue shapes (`:415645-415748`): durable events `maxBatchSize 100 / maxBatchBytes 10 MiB /
maxQueueSize 100000`; internal events `100 / 10 MiB / 200`; delivery acks `64 / 64`. All three share
`baseDelayMs 500, maxDelayMs 30000, jitterMs 500`.

Every one of these is **carryover** except `v7y`, `A7y` and `k7y`. `heartbeat_interval_ms` greps
**220=24 / 193=24** and the 2.1.193 declaration at `:562674 (193)` is byte-identical. Anyone anchoring
the `.218` heartbeat bullet on the interval constant will find nothing.

---

## 2. DEEP DIVE — the heartbeat / worker-replacement model and the `.218` leak

> *`.218`: "Fixed remote sessions continuing to send heartbeats after their worker was replaced, which
> left long-lived desktop and IDE processes retrying a rejected request every few seconds forever."*

### 2.1 What "the worker was replaced" actually means

**What it does:** A Remote Control session is a server-side object with exactly one *current* worker.
A worker is a whole CLI process. Replacement is expressed as a monotonically increasing integer, the
**worker epoch**, and it is transported to the new process **as an environment variable**.

**How it works:**

1. The session supervisor spawns the worker with
   `CLAUDE_CODE_WORKER_EPOCH: String(t.workerEpoch)` in its env (`:545447`, inside the child-spawn
   env block at `:545441-545448`, alongside `CLAUDE_CODE_SESSION_ACCESS_TOKEN` and
   `CLAUDE_CODE_ENVIRONMENT_KIND: "bridge"`). Note what else is in that block: `CLAUDE_CODE_OAUTH_TOKEN:
   void 0` — the parent's OAuth token is explicitly *unset* for the child, which is why the worker
   authenticates with a session-scoped ingress token instead.
2. `CCRClient.initialize` (`:415751-415817`) reads it back:
   `let c = process.env.CLAUDE_CODE_WORKER_EPOCH; e = c ? parseInt(c, 10) : NaN;` and throws
   `new rmt("missing_epoch")` if it is not a number. So a worker that cannot prove which generation it
   is refuses to start rather than registering as generation 0.
3. Every outbound request carries `worker_epoch: this.workerEpoch` — `PUT /worker` (`:415629`,
   `:415775`), `POST /worker/events` (`:415653`), `POST /worker/internal-events`, the delivery acks
   (`:416167`), and the heartbeat (`:415966`).
4. The server answers **409** to any request whose epoch is lower than the current one. Four call sites
   funnel that into one handler — `:415864`, `:415878`, `:415888` (the three request paths) and
   `:416139` (the paginated GET) all reach `handleEpochMismatch` (`:415932-415939`):

```javascript
// ============================================
// handleEpochMismatch - the worker's suicide path when a newer generation exists
// Location: cli_inner_pretty.js:415932-415939
// ============================================

// ORIGINAL (for source lookup):
  handleEpochMismatch() {
    (w("CCRClient: Epoch mismatch (409), shutting down", { level: "error" }),
      Sr("error", "cli_worker_epoch_mismatch"),
      this.onDiagnostic?.(
        `worker epoch mismatch (409), epoch=${this.workerEpoch} — superseded by a newer worker, exiting`,
      ),
      this.onEpochMismatch());
  }

// READABLE (for understanding):
  handleEpochMismatch() {
    logDebug("CCRClient: Epoch mismatch (409), shutting down", { level: "error" });
    logStructured("error", "cli_worker_epoch_mismatch");
    this.onDiagnostic?.(
      `worker epoch mismatch (409), epoch=${this.workerEpoch} — superseded by a newer worker, exiting`,
    );
    this.onEpochMismatch();                    // default (:415613-415616) is process.exit(1)
  }

// Mapping: w→logDebug, Sr→logStructured, onEpochMismatch default → () => process.exit(1)
```

The default `onEpochMismatch` is literally `() => { process.exit(1); }` (`:415613-415616`). A superseded
worker is expected to *die*, not to degrade.

**Why an env var and not a handshake?** Because the replacement decision is made by a process that is
not the worker (the supervisor, or the server when a phone reconnects to a session whose worker went
away). Baking the generation into the child's environment makes it **immutable for the process's whole
life** — there is no code path by which a worker can talk itself into a newer epoch. The alternative,
letting the worker fetch its epoch at startup, would make two workers racing to register both believe
they won.

**Related carryover you should not mistake for new:** `Bkm(reason, epoch)` (`:844945-844947`) —
`parseInt(t ?? "1", 10) > 1 && e === "archived"` — makes a respawned worker ignore an `end_session`
frame whose reason is `archived`, because that frame belonged to the *previous* lifecycle
(`:847471-847474`, log `stale 'archived' end_session ignored on epoch>1 — from prior lifecycle`). This
is **220=1 / 193=1**: the same guard is in 2.1.193. It is context for §2.2, not the fix.

### 2.2 The bug: a self-rearming timer with no owner

**What it does (in 2.1.193):** `startHeartbeat` arms a `setTimeout` chain; each firing calls
`sendHeartbeat()` and then re-arms — *conditionally* on `this.heartbeatTimer !== null`.

```javascript
// ============================================
// startHeartbeat / sendHeartbeat - 2.1.193, the leaking version
// Location: cli_inner_pretty.js:620993-621025 (193)
// ============================================

// ORIGINAL (for source lookup):
  startHeartbeat() {
    this.stopHeartbeat();
    let e = () => {
        let n = this.heartbeatIntervalMs * this.heartbeatJitterFraction * (2 * Math.random() - 1);
        this.heartbeatTimer = setTimeout(t, this.heartbeatIntervalMs + n);
      },
      t = () => {
        if ((this.sendHeartbeat(), this.heartbeatTimer === null)) return;
        e();
      };
    e();
  }
  async sendHeartbeat() {
    if (this.heartbeatInFlight) return;
    this.heartbeatInFlight = !0;
    try {
      if ((await this.request("post", "/worker/heartbeat",
            { session_id: this.sessionId, worker_epoch: this.workerEpoch }, "Heartbeat",
            { timeout: 5000 })).ok)
        T("CCRClient: Heartbeat sent");
    } finally {
      this.heartbeatInFlight = !1;
    }
  }

// READABLE (for understanding):
  startHeartbeat() {
    this.stopHeartbeat();                                   // (a) unconditional
    let arm = () => {
        let jitter = this.heartbeatIntervalMs * this.heartbeatJitterFraction * (2 * Math.random() - 1);
        this.heartbeatTimer = setTimeout(tick, this.heartbeatIntervalMs + jitter);
      },
      tick = () => {
        this.sendHeartbeat();                               // (b) NOT awaited
        if (this.heartbeatTimer === null) return;           // (c) the re-arm guard
        arm();
      };
    arm();
  }

// Mapping: e→arm, t→tick, T→logDebug
```

The whole bug lives in the interaction of (b) and (c).

**How it goes wrong, step by step:**

1. The timer fires. Node has already consumed the timeout, but `this.heartbeatTimer` still holds the
   stale handle — **nothing clears it on fire**.
2. `tick` calls `sendHeartbeat()` *without awaiting it*. In 2.1.193 that function's first synchronous
   statement is `if (this.heartbeatInFlight) return;` — it never touches `heartbeatTimer`.
3. Control returns to `tick`, which evaluates `this.heartbeatTimer === null` → **false** (stale handle),
   so it re-arms unconditionally.
4. Therefore the only thing that can ever stop the loop is somebody calling `stopHeartbeat()` or
   `close()`. Both exist — `close()` (`:621227 (193)`) does `this.closed = !0, this.stopHeartbeat(), …`.
5. **But there is a race.** `close()` clears `heartbeatTimer` *only if it is currently set*. If `close()`
   lands in the window between step 1 (timer fired, handle now stale) and step 3 (re-arm),
   `clearTimeout` is called on an already-fired handle — a no-op — `heartbeatTimer` is set to `null`,
   and then step 3 *re-assigns it* and the chain restarts on a closed client. From then on the process
   POSTs `/worker/heartbeat` with a dead epoch every ~20 s and the server answers 409 forever.
6. In a short-lived terminal session nobody notices; the process exits. In the two hosts the bullet
   names — **desktop and IDE** — the CLI process is long-lived and outlives many bridge sessions, so
   the leaked chain accumulates and keeps hammering a rejected endpoint. That is exactly the reported
   symptom: *"long-lived desktop and IDE processes retrying a rejected request every few seconds
   forever."*

### 2.3 The fix: four lines, using the existing re-arm guard as the kill switch

```javascript
// ============================================
// startHeartbeat / sendHeartbeat - 2.1.220, with the closed-state guards
// Location: cli_inner_pretty.js:415940-415981
// ============================================

// ORIGINAL (for source lookup):
  startHeartbeat() {
    if ((this.stopHeartbeat(), this.closed)) return;
    let e = () => { let r = this.heartbeatIntervalMs * this.heartbeatJitterFraction * (2 * Math.random() - 1);
        this.heartbeatTimer = setTimeout(t, this.heartbeatIntervalMs + r); },
      t = () => { if ((this.sendHeartbeat(), this.heartbeatTimer === null)) return; e(); };
    e();
  }
  async sendHeartbeat() {
    if (this.closed) { this.stopHeartbeat(); return; }
    if (this.heartbeatInFlight) return;
    this.heartbeatInFlight = !0;
    try {
      let e = await this.request("post", "/worker/heartbeat",
        { session_id: this.sessionId, worker_epoch: this.workerEpoch }, "Heartbeat",
        { timeout: 5000, parseBody: !0 });
      if (!e.ok) return;
      w("CCRClient: Heartbeat sent");
      let t = e.data?.heartbeat_interval_seconds;
      if (typeof t !== "number" || !Number.isFinite(t) || t <= 0) return;
      let r = Math.min(Math.max(t * 1000, v7y), A7y);
      if (r === this.heartbeatIntervalMs) return;
      (Sr("info", "cli_heartbeat_interval_updated", { from_ms: this.heartbeatIntervalMs, to_ms: r }),
        (this.heartbeatIntervalMs = r));
    } finally { this.heartbeatInFlight = !1; }
  }

// READABLE (for understanding):
  startHeartbeat() {
    this.stopHeartbeat();
    if (this.closed) return;                                 // FIX 1: never arm on a closed client
    let arm = () => {
        let jitter = this.heartbeatIntervalMs * this.heartbeatJitterFraction * (2 * Math.random() - 1);
        this.heartbeatTimer = setTimeout(tick, this.heartbeatIntervalMs + jitter);
      },
      tick = () => {
        this.sendHeartbeat();                                // still not awaited — but now it acts first
        if (this.heartbeatTimer === null) return;            // unchanged re-arm guard
        arm();
      };
    arm();
  }
  async sendHeartbeat() {
    if (this.closed) {                                       // FIX 2: synchronous, before any await
      this.stopHeartbeat();                                  //   sets heartbeatTimer = null …
      return;                                                //   … so tick's guard now returns true
    }
    if (this.heartbeatInFlight) return;
    this.heartbeatInFlight = true;
    try {
      let res = await postJson("/worker/heartbeat",
        { session_id: this.sessionId, worker_epoch: this.workerEpoch },
        { timeout: 5000, parseBody: true });                 // FIX 3: parse the body
      if (!res.ok) return;
      let seconds = res.data?.heartbeat_interval_seconds;    // FIX 4: server-driven interval
      if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds <= 0) return;
      let next = Math.min(Math.max(seconds * 1000, MIN_HEARTBEAT_MS), MAX_HEARTBEAT_MS);  // 10 s … 300 s
      if (next === this.heartbeatIntervalMs) return;
      logStructured("info", "cli_heartbeat_interval_updated",
                    { from_ms: this.heartbeatIntervalMs, to_ms: next });
      this.heartbeatIntervalMs = next;
    } finally { this.heartbeatInFlight = false; }
  }

// Mapping: v7y→MIN_HEARTBEAT_MS (1e4), A7y→MAX_HEARTBEAT_MS (3e5), Sr→logStructured,
//          this.request(...)→postJson
```

**Why this approach, and not the obvious one?** The obvious fix is "clear `heartbeatTimer` when the
timeout fires". That is one line too, and it would also work — but it changes the meaning of the field
from *"a chain is running"* to *"a timer is pending"*, and `tick`'s guard (c) exists precisely to read
the first meaning: it is there so that a `stopHeartbeat()` issued *from inside* `sendHeartbeat` (or from
any callback that ran during it) cancels the chain. Clearing on fire would break that.

Instead, 2.1.220 makes `sendHeartbeat` **do the stopping itself**, synchronously, before its first
`await`. The existing guard then does the work it was always written to do. The fix is
*additive to the invariant* rather than a rewrite of it. Note the ordering that makes it work:
`if (this.closed) { this.stopHeartbeat(); return; }` must precede the `heartbeatInFlight` check —
if it came second, a heartbeat already in flight when `close()` landed would take the early
`return` and never clear the timer.

FIX 1 closes the second door: `startHeartbeat` is called from `initialize` (`:415804`), and a session
that is closed while registration is still retrying (the retry loop at `:415767-415795` explicitly
checks `this.closed` at `:415780`) would otherwise arm a chain on a corpse.

**Key insight:** the leak was not a missing teardown — the teardown existed and was called. It was a
*stale-handle* bug: `heartbeatTimer` was used as both an identity ("which timer") and a state flag
("is the chain alive"), and those two meanings diverge for exactly one tick after the timer fires. The
repair does not remove the overloading; it guarantees that the only code that can run in that divergent
window (`sendHeartbeat`) restores the invariant before yielding.

### 2.4 The `.218` fix shipped with an unadvertised capability: server-driven heartbeat rate

FIX 3/FIX 4 above are not in the changelog at all. Three anchors, all **220=N / 193=0**:

| Anchor | 220 | 193 |
|---|---|---|
| `heartbeat_interval_seconds` (`:415972`) | 1 | **0** |
| `cli_heartbeat_interval_updated` (`:415976`) | 1 | **0** |
| `parseBody` (`:415828` signature, `:415968` call) | 2 | **0** |

The heartbeat response body may now carry `heartbeat_interval_seconds`, and the client adopts it,
clamped to **10 s … 300 s** (`v7y`/`A7y`). Two things are worth stating plainly:

- The runtime ceiling (300 s) is **ten times the zod schema's ceiling** for the same quantity
  (`heartbeat_interval_ms` is capped at 30000 at `:415351`). The session-config path and the
  heartbeat-response path are therefore *different trust domains*: config is validated as untrusted
  input; the heartbeat response is treated as a live control channel. A server can back a fleet of idle
  workers down to one ping every five minutes without a client release.
- The whole feature is only safe *because* of the `.218` fix. Raising the interval on a leaked chain
  would have made the bug quieter and harder to find, not gone.

Read together, `.218` is best described as: **the heartbeat became a controllable resource, and they
fixed the leak in the same change because you cannot control what you cannot stop.**

### 2.5 The `.218` change also split shutdown into two phases

`close()` in 2.1.193 was one method (`:621227-621247 (193)`). In 2.1.220 it is three
(`:416181-416202`), and the new names are **220=N / 193=0**: `closeExceptInternalEvents` 3/0,
`registerShutdownCleanup` 2/0, `registerPreExitFlush` 2/0.

```javascript
  close()                       { this.closeExceptInternalEvents(); this.internalEventUploader.close(); }
  closeExceptInternalEvents()   { this.closed = true; this.stopHeartbeat(); stopSessionKeepalive();
                                  /* clears stream buffer, acks, worker-state, events, delivery */ }
  registerShutdownCleanup(e)    { e.registerCleanup(() => this.closeExceptInternalEvents());
                                  e.registerPreExitFlush(async () => {
                                    try { await withTimeout(this.flushInternalEvents(), 3000 /* k7y */); }
                                    finally { this.close(); } }); }
```

**Why the split?** Internal events are the ones a *reconnecting client* replays to rebuild the
transcript (`readInternalEvents` `:416045`). On shutdown you want to stop *producing* immediately
(heartbeat, keepalive, stream buffer) but keep the internal-event queue alive long enough to drain,
because anything still queued is transcript the phone will otherwise never see. The 3-second budget
(`k7y`) bounds the exit hang. 2.1.193 closed all four uploaders together, so a session torn down with
internal events pending simply lost them.

`closeExceptInternalEvents` also calls `Xrd()` (`:416185`) — the session-activity keepalive stopper
(`:318967-318973`). That refcounted keepalive (interval `qrd = 30000`, `:319025`) is separate machinery
and is **pure carryover**: `session_keepalive_heartbeat` 1/1, `session_idle_30s` 1/1,
`CLAUDE_CODE_REMOTE_SEND_KEEPALIVES` **220=3 / 193=3**. Despite the env var appearing in
`_raw_asset_diff_193_to_220.md`'s NEW list (line 574), it is present in 2.1.193 at `:43126 (193)`,
`:444347 (193)` and `:444381 (193)`.

---

## 3. The inbound stream: liveness, reconnect, and two new frame vetoes

`SSETransport` (`lln`, `:416401`) maintains one `GET …/stream` and rebuilds it on any interruption.

**The self-healing loop** (`handleConnectionError`, `:416610-416631`):

1. Cancel the liveness timer; bail if already `closing`/`closed`.
2. Abort the in-flight fetch, record `reconnectStartTime` on the first failure of a run.
3. **Refresh the auth headers** (`this.refreshHeaders()`, `:416617-416620`) — the reason a credential
   rotation does not kill the session.
4. Backoff `min(1000 · 2^(attempt−1), 30000)` with ±25 % jitter, then `connect()`.

**The liveness watchdog** (`onLivenessTimeout`, `:416632-416640`): every received frame calls
`resetLivenessTimer()` (`:416641-416643`), which arms `Ukd = 45000`. Forty-five seconds of silence is
treated as a dead connection even though the socket is open, and the transport aborts and reconnects
itself. This is why a heartbeat of 20 s matters on the *other* direction: the two are deliberately set
so that ~2 heartbeat periods fit inside one liveness window.

All of this is **carryover**: `Ukd = 45000` (`:416385`) vs `q$f = 45000` (`:560085 (193)`) and
`fsc = 45000` (`:621289 (193)`); the backoff shape is identical. The `Reconnecting` literal is
**220=41 / 193=42** — it went *down*. Do not attribute `.198`/`.199`'s reconnect bullets to this code.

**What is new is frame vetting** — three anchors, all 220>0 / 193=0, inside `handleSSEFrame`
(`:416571-416609`):

| Anchor | 220 line | What it refuses |
|---|---|---|
| `cli_sse_workflow_launch_event_type_mismatch` | `:416597` | a payload claiming `type: "workflow_launch"` whose envelope `event_type` says otherwise — the payload is vetoed via `onEventVetoed` |
| `cli_sse_worker_control_request_dropped` | `:416600` | a `control_request` whose `source` is `"worker"` — i.e. a worker trying to issue control requests to itself through the server |
| `onEventVetoed` | `:416598` (220=3/193=0) | the veto callback itself |

Both refusals are **envelope-vs-payload consistency checks**: the server-set envelope fields
(`event_type`, `source`) are trusted, the client-supplied payload is not, and a disagreement is
resolved by dropping the frame rather than by preferring either. The pre-existing check next to them
(`this.eventFilter?.(r)` → `cli_sse_event_filtered`, `:416593-416595`) is carryover.

---

## 4. Task state on membership change — `background_tasks_changed`

> *`.205`: "Fixed background tasks in the web and mobile Remote Control panels showing stale 'Running'
> status by forwarding full task state on every membership change."*

**Verdict: NET_NEW.** `background_tasks_changed` is **220=11 / 193=0**.

The schema (`mdE`, `:837667-837683`) is the single most self-documenting object in this subsystem, and
its `.describe()` states the design rule outright:

> `The full set of live background tasks, emitted whenever membership changes (start, completion, kill,
> a foreground agent being backgrounded). A level signal, unlike the task_started/task_notification edge
> bookends: consumers that only need 'is background work running' should replace their set with each
> payload rather than pairing edges, so a missed bookend cannot wedge a stale running indicator.`

### 4.1 Edge versus level, and why the fix had to change the protocol

**What it does:** replaces (for the "is anything running?" question) a pair of edge events with a
periodic snapshot.

**How it works:**

1. The pre-existing protocol had `task_started` and `task_notification` — an *opening* and a *closing*
   bookend per task. A client tracks "running" by incrementing on one and decrementing on the other.
2. Any lost closing bookend — a reconnect straddling completion, a 4xx that dropped an ephemeral batch,
   a client that joined between the two — leaves the counter permanently above zero. The panel shows
   "Running" forever. **This is not fixable by retrying the edges**: the client cannot know it missed
   one.
3. `background_tasks_changed` carries the *whole* live set (`task_id`, `task_type`, `description` only,
   `:837673`) with REPLACE semantics. One correct payload heals any amount of prior divergence.
4. Emission sites: on change (`:568652`), **and on bridge connect from both hosts** — the TUI host at
   `:738593` (`lA({ type: "system", subtype: "background_tasks_changed", tasks: aEr(F.getState()) })`,
   in the same statement list as `G1t(F.getState().toolPermissionContext.mode)`) and the SDK/headless
   host at `:848974`. That connect-time emission is what makes a **late-joining viewer** correct
   immediately, and it is the real anchor for the `.207`/`.208` "not seeing background agents" bullets
   (see [`client_surfaces.md`](client_surfaces.md) §1.2).

**Why this approach:** the alternative — make the bookends reliable — would require per-client
acknowledgement and replay of the edge stream, which is exactly what the durable event queue already
does and *still* cannot guarantee across a client that was not connected. A level signal makes
reliability a *property of the last message* instead of a property of the whole history.

**The two caveats in the schema text are the interesting part**, because they are the cost of the
choice:

- *"Ordering relative to the bookends for the same transition is unspecified (in practice the level
  precedes them) and the payload carries ids only, so do not correlate it with the edge stream."* — the
  level and the edges are two independent views; mixing them re-introduces the bug.
- *"The level is per-process: nothing is emitted at startup, so consumers must reset to the empty set
  whenever the session's CLI process (re)starts."* — i.e. the level is **not** a full-state protocol,
  it is a change-triggered snapshot, and worker replacement (§2.1) is a state reset the client must
  handle itself.

### 4.2 The publish path learned to distinguish the two

A new helper `A$s` (`:415578-415585`) classifies an outgoing batch before reporting a metric:

```javascript
// ============================================
// classifyTaskStatusBatch - decides which task-status metric a client-event batch earns
// Location: cli_inner_pretty.js:415578-415585
// ============================================

// ORIGINAL (for source lookup):
function A$s(e) {
  let t = !1, r = !1;
  for (let n of e)
    if (n.payload.subtype === "task_notification") t = !0;
    else if (n.payload.subtype === "background_tasks_changed") r = !0;
  return t || r ? { has_terminal_bookend: t, has_level: r } : null;
}

// READABLE (for understanding):
function classifyTaskStatusBatch(batch) {
  let sawTerminalBookend = false, sawLevel = false;
  for (let event of batch)
    if (event.payload.subtype === "task_notification") sawTerminalBookend = true;
    else if (event.payload.subtype === "background_tasks_changed") sawLevel = true;
  return sawTerminalBookend || sawLevel
    ? { has_terminal_bookend: sawTerminalBookend, has_level: sawLevel }
    : null;                                   // batch carries no task status at all — no metric
}

// Mapping: A$s→classifyTaskStatusBatch, e→batch, t→sawTerminalBookend, r→sawLevel
```

Its two consumers are the success metric `be("ccr_task_status_publish", s)` (`:415658`) and the
4xx-drop counter `pe("ccr_task_status_publish", "status_events_4xx_dropped", l)` (`:415691`).
`ccr_task_status_publish` is **220=5 / 193=0** and `has_terminal_bookend` is **220=2 / 193=0**.

This is instrumentation with a purpose: it lets the server measure *which of the two signals* is being
lost when a batch is dropped, which is the only way to tell whether the level signal is actually
covering the failure it was introduced for.

`ccr_worker_state_publish` (`:415631`, `:415636`, **220=2 / 193=0**) is the same idea one layer up, on
the `PUT /worker` state channel, with a distinguished `state_4xx_dropped` outcome.

### 4.3 Task status surviving a reconnect — `tengu_remote_active_goal_adopted`

> *`.207`: "Fixed Remote Control task status updates being lost when the connection recovered from a
> network interruption or credential refresh."*

**Verdict: NET_NEW.** `tengu_remote_active_goal_adopted` is **220=3 / 193=0**, and the three sites are
three *different* ways the client can learn the active goal — which is the fix:

| Site | `via` | Trigger |
|---|---|---|
| `:757214` | `seed` | `e.seedActiveGoal !== void 0` — the value handed to the session hook at construction, i.e. **restored from local state across a reconnect** |
| `:757334` | `stream` | an `active_goal` frame on the live stream |
| `:757958` | `thin_client_stream` | the same frame on the *thin-client* transport — a second, lighter session manager whose `createManager({ onMessage })` callback starts at `:757953-757954` |

Before, the goal existed only as a stream-delivered value: a reconnect that missed the frame left the
panel blank until the next update. 2.1.220 makes the goal part of the session's **seed state**, so it
is re-adopted at construction time, and instruments which of the three routes supplied it. `seedActiveGoal`
is **220=4 / 193=0**.

Note the idempotence in both handlers: `q((Pe) => (Pe.activeGoal === we ? Pe : { ...Pe, activeGoal: we }))`
— re-adopting the same goal is a no-op on the store, so seed-then-stream does not produce a spurious
re-render. The telemetry, however, fires unconditionally on the seed path only when
`we !== void 0` (`:757213`), so an empty seed is not counted as an adoption.

---

## 5. Mid-turn crash recovery (`.196`) — owned by `36_background_agents`, summarised here

> *`.196`: "Fixed mid-turn crash recovery for Remote sessions — sessions interrupted by a server
> restart now auto-resume on the next worker."*

The mechanism is the **respawn** path in the background launcher, not the RC transport, so
[`../36_background_agents/`](../36_background_agents/) owns it. The RC-relevant facts, verified here:

- `tengu_resume_interrupted_turn` **220=2 / 193=0**. The emitter `wrn` (`:320160-320166`) tags
  `surface: "print" | "repl_restore"` and `kind: "synthetic_continue" | "resubmit"` — a resumed worker
  either re-submits the user's actual last message or injects a synthetic
  `"Continue from where you left off."` (`Uvo`, `:320143-320145`, overridable by
  `CLAUDE_CODE_RESUME_PROMPT`).
- The staleness cut-off `znd` (`:320146-320158`) reads
  `CLAUDE_CODE_RESUME_INTERRUPTED_TURN_MAX_AGE_MS` (**220=6 / 193=0**), treats `0` as *disabled*, and
  falls back to **3600000 ms (1 h)** on a non-positive or non-finite value. It scans backwards past
  `system` and `progress` entries to find the last real message's timestamp, and — the important edge
  case — **returns `true` (stale) when no timestamped message exists at all**. Fail-safe: an
  unreadable transcript is not auto-resumed.
- The launcher sets `CLAUDE_CODE_RESUME_INTERRUPTED_TURN = "1"` on the child only when
  `this.attempt > 1 && l && !t` (`:554378-554383`) — i.e. on a *respawn* whose transcript actually has
  messages — and only then does it also pass the max-age (`:554381`, `fq_ = 3600000` at `:554827`).

The RC connection to all of this is §2.1: the "next worker" in the bullet **is** the next epoch.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_remote_control.md](../00_overview/symbol_additions_v2_1_220_remote_control.md).

Key functions in this document:
- `CCRClient` (`iln`, `:415586`) - worker-side Remote Control client
- `CCRClient.startHeartbeat` (`:415940`) - now refuses to arm on a closed client
- `CCRClient.sendHeartbeat` (`:415955`) - now stops the chain synchronously and adopts a server interval
- `CCRClient.handleEpochMismatch` (`:415932`) - 409 → `process.exit(1)`
- `CCRClient.initialize` (`:415751`) - reads `CLAUDE_CODE_WORKER_EPOCH`, registers, starts the heartbeat
- `CCRClient.closeExceptInternalEvents` (`:416184`) - phase-1 shutdown
- `CCRClient.registerShutdownCleanup` (`:416193`) - phase-2 pre-exit flush with a 3 s budget
- `classifyTaskStatusBatch` (`A$s`, `:415578`) - edge-vs-level metric attribution
- `RemoteControlSessionConfigDefaults` (`Lkd`, `:415327`) - the 14-field server-tunable config
- `RemoteControlSessionConfigSchema` (`S7y`, `:415343`) - its clamping zod schema
- `EventUploadQueue` (`oln`, `:415372`) - batching queue with backpressure and a drop breaker
- `SSETransport` (`lln`, `:416401`) - inbound frame stream
- `SSETransport.handleSSEFrame` (`:416571`) - envelope-vs-payload vetting
- `SSETransport.handleConnectionError` (`:416610`) - header-refreshing reconnect
- `SSETransport.onLivenessTimeout` (`:416632`) - 45 s silence watchdog
- `BackgroundTasksChangedSchema` (`mdE`, `:837667`) - the REPLACE-semantics level event
- `isStaleInterruptedTurn` (`znd`, `:320146`) - resume staleness cut-off
- `emitResumeInterruptedTurn` (`wrn`, `:320160`) - resume telemetry
- `isStaleArchivedEndSession` (`Bkm`, `:844945`) - carryover epoch>1 guard
- `stopSessionKeepalive` (`Xrd`, `:318967`) - refcounted keepalive stopper (carryover)
