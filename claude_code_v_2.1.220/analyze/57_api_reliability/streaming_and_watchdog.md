# Streaming: two watchdogs, a default-on flip that *deleted* code, and partial-response preservation

> TARGET: `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (872,596 lines).
> BASELINE: `…/2.1.193/extract/cli_inner_pretty.js`, always tagged **(193)**.

The streaming path has **two independent watchdogs** that the changelog conflates into one. Getting
them straight is a precondition for reading the `.196` bullet correctly.

| | **Byte-level watchdog** | **Event-level watchdog** |
|---|---|---|
| Where | the `fetch` wrapper — wraps `Response.body` | the query generator — `setTimeout` around SSE events |
| Implementation | `kxg` `:149809-…` | `As` (`armEventWatchdog`) `:510152-510178` |
| Env switch | `CLAUDE_ENABLE_BYTE_WATCHDOG` (`nZc` `:149938-149942`) | `CLAUDE_ENABLE_STREAM_WATCHDOG` (`:510479`) |
| Gate | `tengu_stream_watchdog_default_on`, **default `!0`** | `tengu_event_watchdog_default_on`, **default `!1` in 193** |
| Telemetry `tier` | `Ee("byte")` `:511140` | `Ee("event")` `:510174` |
| Delta in this window | **carryover** — default-on in 2.1.193 already | **`.196` flipped it to default-on** |

`nZc` and its 193 twin `Vgi` (`:134482 (193)`) are structurally identical and both end
`return Ke("tengu_stream_watchdog_default_on", !0)` / `return it("tengu_stream_watchdog_default_on", !0)` —
gate count 220=1 / 193=1, default `true` in both. So *"the streaming idle watchdog"* was already on for
byte-level stalls before this window opened. The `.196` bullet is about the other one.

---

## 1. `.196` — the default-on flip is a REMOVAL, and the counts prove it

> `.196`: *"Streaming idle watchdog is now on by default for all providers; set
> `CLAUDE_ENABLE_STREAM_WATCHDOG=0` to disable."*

**Verdict: BEHAVIOR_CHANGE, implemented by deleting three things.**

The naive measurement points the wrong way:

| literal | 220 | 193 | direction |
|---|---|---|---|
| `CLAUDE_ENABLE_STREAM_WATCHDOG` | **2** | **4** | went **down** |
| `tengu_event_watchdog_default_on` | **0** | **1** | went **down** |

A default-on flip *removes* gating. Here are all six sites, read in both bundles.

### 1.1 The resolution site — the gate is gone

```javascript
// ============================================
// Event-watchdog enablement, at the top of the per-attempt streaming block
// Location: cli_inner_pretty.js:510479  (193 twin: :595164 (193))
// ============================================

// ORIGINAL, 2.1.220 (for source lookup):
        St = Z.CLAUDE_ENABLE_STREAM_WATCHDOG ?? !0,
        Jt = a7i(),
        bn = Jt / 2,
        Kn = Math.min(l7i(Hn()), St ? Jt : 1 / 0),
        ui = Math.min(c1_, Kn - xqs),

// ORIGINAL, 2.1.193 (cli_inner_pretty.js:595164-595167 (193)):
        Ln = Be.CLAUDE_ENABLE_STREAM_WATCHDOG ?? it("tengu_event_watchdog_default_on", !1),
        Wn = u3r(),
        Bn = Wn / 2,
        Fn = Math.min(d3r(_r()), Ln ? Wn : 1 / 0),
        // (no fourth timer)

// READABLE (2.1.220, for understanding):
        eventWatchdogEnabled = env.CLAUDE_ENABLE_STREAM_WATCHDOG ?? true,       // was: ?? gate(..., false)
        eventIdleTimeoutMs   = getStreamIdleTimeoutMs(),                        // max(env, 300_000)
        eventIdleWarnMs      = eventIdleTimeoutMs / 2,
        effectiveIdleMs      = Math.min(getByteStreamIdleTimeoutMs(getProvider()),
                                        eventWatchdogEnabled ? eventIdleTimeoutMs : Infinity),
        advisorStallGraceMs  = Math.min(ADVISOR_STALL_GRACE_CAP_MS,             // 90_000  (:512026)
                                        effectiveIdleMs - STALL_INDICATOR_DELAY_MS);  // 20_000 (:512025)

// Mapping: St→eventWatchdogEnabled, Jt→eventIdleTimeoutMs, bn→eventIdleWarnMs, Kn→effectiveIdleMs,
//          ui→advisorStallGraceMs, a7i→getStreamIdleTimeoutMs, l7i→getByteStreamIdleTimeoutMs,
//          Hn→getProvider, c1_→ADVISOR_STALL_GRACE_CAP_MS, xqs→STALL_INDICATOR_DELAY_MS,
//          Z→managedEnvProxy, it/Ke→getFeatureValue
```

The `?? it("tengu_event_watchdog_default_on", !1)` is replaced by `?? !0`. That single edit
accounts for **both** the `CLAUDE_ENABLE_STREAM_WATCHDOG` and the `tengu_event_watchdog_default_on`
count drop by one each, and it is the whole of the bullet's user-visible semantics: `=0` still
disables (the `??` only fires on `undefined`), everything else defaults on.

### 1.2 The two forced-on sites — deleted

2.1.193 compensated for the default-off by **injecting the env var** into the two contexts that most
needed a watchdog. Both sites are gone in 220 because they are now redundant.

```javascript
// 2.1.193, background-daemon child env (cli_inner_pretty.js:606909-606926 (193)):
function wec(e, t, n, r, o) {
  let s = { ...process.env },
    i = { ...s,
      ...(n && { CLAUDE_BG_AUTH_SNAPSHOT_PATH: n }),
      ...(Wt() === "windows" && { CLAUDE_CODE_ALT_SCREEN_FULL_REPAINT: "1" }),
      ...e.env,
      CLAUDE_CODE_SESSION_KIND: "bg",
      CLAUDE_BG_BACKEND: "daemon",
      CLAUDE_ENABLE_STREAM_WATCHDOG: "1",       // <-- forced on for background sessions
      CLAUDE_BG_SOURCE: e.source, … };
```

```javascript
// 2.1.220, the same function (cli_inner_pretty.js:553391-553407):
function jhp(e, t, r, n, o) {
  let i = { ...process.env },
    s = { ...i,
      ...(r && { CLAUDE_BG_AUTH_SNAPSHOT_PATH: r }),
      ...(Mt() === "windows" && { CLAUDE_CODE_ALT_SCREEN_FULL_REPAINT: "1" }),
      ...e.env,
      CLAUDE_CODE_SESSION_KIND: "bg",
      CLAUDE_BG_BACKEND: "daemon",
      CLAUDE_BG_SOURCE: e.source, …                // <-- the line is simply absent
```

The two functions are otherwise line-for-line the same object literal in the same order, which makes
the deletion unambiguous. The second forced-on site was `:715178 (193)`. So the accounting is exact:

```
193 = 4  ->  accessor :43731  +  resolution :595164  +  forced-on :606918  +  forced-on :715178
220 = 2  ->  accessor :32806  +  resolution :510479
```

### 1.3 Why a default flip is implemented as a deletion

**What it does:** turns an opt-in experiment into unconditional behaviour.

**How it works:** an experiment needs (a) a remote gate to ramp it, and (b) hand-placed overrides for
the populations you want covered while the gate is at 0 %. Shipping it as default means (a) becomes a
constant and (b) becomes dead weight — worse than dead, because a forced `"1"` in a child env is now
*indistinguishable from a user setting it*, and would survive a future decision to turn the feature
back off.

**Why this approach over leaving the gate in place at default `!0`?**
That was available — the *byte* watchdog does exactly that (`Ke("tengu_stream_watchdog_default_on", !0)`
survives at `:149941`). Removing the event gate rather than re-defaulting it is a statement that the
event watchdog is no longer considered ramp-able: they kept the kill switch a user can reach
(`CLAUDE_ENABLE_STREAM_WATCHDOG=0`) and removed the one *Anthropic* could reach. That is the opposite
of the pattern in `_GROUND_TRUTH` §2, where the subagent depth cap was deliberately left gate-backed
*because* they expected to change it without a release — and did.

**Key insight:** the observable delta for this bullet has the wrong sign in every literal count, and
the *only* way to score it correctly is to read both resolution sites and both env-injection sites.
It is the cleanest demonstration in this tree of `_CONVENTIONS.md` §4.7.

---

## 2. What the event watchdog actually arms

`As` (`:510152-510178`) is re-armed on every stream event (`As()` is called at `:510490` before the
loop and at `:510536` inside it). It sets up **three** timers, and only two of them are gated:

```javascript
// ============================================
// armEventWatchdog - re-armed on every stream event; three timers, only two gated
// Location: cli_inner_pretty.js:510152-510178
// ============================================

// ORIGINAL (for source lookup):
        As = function () {
          if ((fi(), vs(), !St)) return;
          let Qo = performance.now();
          ((sn = setTimeout((Fs, Lc) => {
              if (performance.now() - Lc < Fs) return;
              (w(`Streaming idle warning: no chunks received for ${Fs / 1000}s`, { level: "warn" }),
                Sr("warn", "cli_streaming_idle_warning"));
            }, bn, bn, Qo)),
            (dt = setTimeout(() => {
              ((Uo = !0), (ur = performance.now()),
                w(`Streaming idle timeout: no chunks received for ${Jt / 1000}s, aborting stream`, { level: "error" }),
                Sr("error", "cli_streaming_idle_timeout"),
                O("tengu_streaming_idle_timeout", { model: i.model, request_id: mG(ze), timeout_ms: Jt, tier: Ee("event") }),
                gt());
            }, Jt)));
        };

// READABLE (for understanding):
        armEventWatchdog = function () {
          clearWatchdogTimers();
          armStallIndicator();                                   // <-- ALWAYS, even with the watchdog off
          if (!eventWatchdogEnabled) return;
          let armedAt = performance.now();
          warnTimer = setTimeout((warnMs, t0) => {               // at eventIdleTimeoutMs / 2
            if (performance.now() - t0 < warnMs) return;         // wall-clock re-check: survives suspend
            debugLog(`Streaming idle warning: no chunks received for ${warnMs / 1000}s`, { level: "warn" });
            structuredLog("warn", "cli_streaming_idle_warning");
          }, eventIdleWarnMs, eventIdleWarnMs, armedAt);
          abortTimer = setTimeout(() => {                        // at eventIdleTimeoutMs (>= 300 s)
            streamIdleAborted = true;
            abortStartedAt = performance.now();
            debugLog(`Streaming idle timeout: no chunks received for ${eventIdleTimeoutMs / 1000}s, aborting stream`, { level: "error" });
            structuredLog("error", "cli_streaming_idle_timeout");
            emitTelemetry("tengu_streaming_idle_timeout", { model, request_id, timeout_ms: eventIdleTimeoutMs, tier: "event" });
            abortInFlightStream();
          }, eventIdleTimeoutMs);
        };

// Mapping: As→armEventWatchdog, fi→clearWatchdogTimers, vs→armStallIndicator, sn→warnTimer,
//          dt→abortTimer, Uo→streamIdleAborted, ur→abortStartedAt, gt→abortInFlightStream,
//          Sr→structuredLog, mG/wr→scrubRequestId
```

The ordering `if ((fi(), vs(), !St)) return;` is deliberate and identical in 193 (`:594863 (193)`
`if ((ka(), xs(), !Ln)) return;`): **the user-facing "stalled" indicator is not part of the watchdog.**
Turning the watchdog off with `CLAUDE_ENABLE_STREAM_WATCHDOG=0` still shows you a stall countdown; it
only stops the client from *aborting*. That separation is why §3's fix is independent of §1's flip.

The double-check inside the warn timer (`if (performance.now() - Lc < Fs) return;`) exists because
`setTimeout` fires late after a laptop suspend; the byte watchdog has the far more elaborate version of
the same idea (`if (I < -t / 2)` at `:149863`, throwing `StreamSuspendedError` — `tZc` `:150088-150095`,
message *"Stream watchdog detected system suspend; aborting to retry on a fresh connection"*).

---

## 3. `.214` — the spurious "check your network" while the advisor was thinking

> `.214`: *"Fixed a spurious 'check your network' warning that appeared while the advisor was thinking."*

**Verdict: DELTA — the warning literal is carryover (`check your network` 220=3 / 193=3, the UI site is
`:580201`); the fix is a new grace window inside the stall-indicator arming function.**

```javascript
// ============================================
// armStallIndicator - "stalled" countdown; now suppressed during an advisor tool call
// Location: cli_inner_pretty.js:510132-510151  (193 twin :594848-594861 (193))
// ============================================

// ORIGINAL, 2.1.220 (for source lookup):
        vs = function () {
          if (!i.onRetryStatus || !mr) return;
          let Qo = mr.lastAt, Fs = performance.now();
          ((oo = setTimeout(() => {
            if (performance.now() - Fs < xqs / 2) return;
            if (mr.lastAt > Qo) { vs(); return; }
            let Lc = performance.now() - mr.lastAt;
            if (tr && Lc < ui) { vs(); return; }
            let ss = mr.lastAt === 0 ? performance.now() - ks : Lc;
            ((po = !0), i.onRetryStatus?.({ kind: "stalled", deadline: Date.now() + Math.max(0, Kn - ss) }));
          }, xqs)),
            oo.unref?.());
        },

// ORIGINAL, 2.1.193 (cli_inner_pretty.js:594848-594861 (193)):
        xs = function () {
          if (!s.onRetryStatus || !Mn) return;
          let Ho = Mn.lastAt, Y = performance.now();
          ((rs = setTimeout(() => {
            if (performance.now() - Y < q2o / 2) return;
            if (Mn.lastAt > Ho) { xs(); return; }
            ((ra = !0), s.onRetryStatus?.({ kind: "stalled", deadline: Date.now() + (Fn - q2o) }));
          }, q2o)),
            rs.unref?.());
        },

// READABLE (2.1.220, for understanding):
        armStallIndicator = function () {
          if (!opts.onRetryStatus || !chunkTimes) return;
          let lastAtAtArm = chunkTimes.lastAt, armedAt = performance.now();
          stallTimer = setTimeout(() => {
            if (performance.now() - armedAt < STALL_INDICATOR_DELAY_MS / 2) return;   // suspend guard
            if (chunkTimes.lastAt > lastAtAtArm) { armStallIndicator(); return; }     // progress -> re-arm
            let idleMs = performance.now() - chunkTimes.lastAt;
            if (advisorToolInFlight && idleMs < advisorStallGraceMs) {                // NEW
              armStallIndicator(); return;
            }
            let elapsed = chunkTimes.lastAt === 0                                     // NEW
              ? performance.now() - requestStartedAt                                  //   never any byte
              : idleMs;
            stallIndicatorShown = true;
            opts.onRetryStatus?.({ kind: "stalled",
              deadline: Date.now() + Math.max(0, effectiveIdleMs - elapsed) });        // NEW: elapsed-aware, floored
          }, STALL_INDICATOR_DELAY_MS);                                                // 20_000
          stallTimer.unref?.();
        },

// Mapping: vs→armStallIndicator, mr→chunkTimes, oo→stallTimer, po→stallIndicatorShown,
//          xqs→STALL_INDICATOR_DELAY_MS (20000, :512025), ui→advisorStallGraceMs,
//          tr→advisorToolInFlight, ks→requestStartedAt (:510457), Kn→effectiveIdleMs
```

### The advisor grace window

**What it does:** while an advisor tool call is outstanding, it raises the silence threshold from 20 s
to `ui = min(90 s, effectiveIdleMs − 20 s)` before the "will retry in … · check your network" banner
is allowed to appear.

**How it works:**

1. `tr` (`advisorToolInFlight`) is set when an advisor tool call is dispatched and cleared at
   `:510684` when the `advisor_tool_result` content block arrives
   (`((tr = !1), w("[AdvisorTool] Advisor tool result received"))`). It is reset to `!1` in the
   per-attempt reset block at `:510473`. The 193 twin is `Ke` (`:595158 (193)`, `:595735 (193)`).
2. The grace value is derived, not constant: `ui = Math.min(c1_, Kn - xqs)` with `c1_ = 90000`
   (`:512026`) and `xqs = 20000` (`:512025`). The `Kn - xqs` term guarantees the grace can never
   exceed the *remaining* budget before the real idle abort would fire, so the banner is still shown
   before the stream is killed — the user is never surprised by an abort they had no warning of.
3. On grace, `vs()` **re-arms itself** rather than falling through, so the check repeats every 20 s.

**Why this approach:** an advisor call is a *server-side sub-request* — the API is genuinely working,
it is just not emitting SSE events while it does. There is no client-side signal that distinguishes
"the network died" from "the advisor is thinking" except knowing that an advisor call is outstanding,
which the client does know. The alternative — extending the global idle timeout — would delay genuine
network-failure detection for every turn, not just advisor turns. Scoping the relaxation to the exact
condition that causes the false positive is strictly better.

**Why 90 s?** It is the p-high advisor latency they were willing to absorb silently. Above it, the
banner returns, because a 90-second advisor call is itself worth telling the user about.

### Two smaller fixes in the same function

- **Pre-first-byte elapsed.** 193 computed the deadline as `Fn - q2o` — a constant. If no chunk had
  *ever* arrived, `Mn.lastAt === 0` and 193 had no way to know how long the request had really been
  outstanding, so the countdown restarted from a fixed offset. 220 falls back to
  `performance.now() - ks` where `ks` is stamped at `:510457`, immediately before the attempt.
- **Floor at zero.** `Math.max(0, Kn - ss)` cannot produce a deadline in the past. 193's
  `Fn - q2o` could, whenever `Fn` (the effective idle timeout, which is `Math.min(byteTimeout, …)` and
  can be small) was under 20 s.

`tengu_advisor_tool_error` (**220=1 (`:510688`) / 193=0**) is a *different*, sibling addition in the
same block: it reports an error code carried inside a returned `advisor_tool_result`. It does not
suppress the banner; do not cite it as the fix for this bullet.

---

## 4. `.199` — keeping the partial when the server errors mid-stream

> `.199`: *"The streaming partial is now kept when the API emits a mid-stream overloaded/server error
> after partial output."*

**Verdict: NET_NEW.** Proof: `Mid-stream server error after` **220=1 (`:511256`) / 193=0**;
`Server error mid-response. The response above may be incomplete.` **220=1 (`:511281`) / 193=0**;
`finalizing partial response` 220=3 / **193=2**.

The decision is one line, `:511194`:

```javascript
// ============================================
// The mid-stream keep-partial condition
// Location: cli_inner_pretty.js:511193-511195  (193 twin :595761-595762 (193))
// ============================================

// ORIGINAL, 2.1.220 (for source lookup):
        if (Pe.some((Yn) => Yn.message.content.some((mo) => !GW(mo))) || bs) {
          let Yn = (dSe(Qo) || Dqs(Qo) || (Qo instanceof hi && Qo.type === "api_error")) && J;
          if (Uo || ss || Yn) {

// ORIGINAL, 2.1.193 (cli_inner_pretty.js:595761-595762 (193)):
        if (Ft.some((oa) => oa.message.content.some((rp) => !j2(rp))) || Fr) {
          if (qr || (Ee && Y)) {

// READABLE (2.1.220, for understanding):
        if (yieldedBlocks.some((m) => m.message.content.some((b) => !isEmptyBlock(b))) || sawServerFallback) {
          let midStreamServerError =
            (isOverloaded529(err) || isServerError5xx(err) || (err instanceof APIError && err.type === "api_error"))
            && hasProducedOutput;
          if (streamIdleAborted || connectionDropped || midStreamServerError) {

// Mapping: dSe→isOverloaded529, Dqs→isServerError5xx (:534859), hi→APIError, J→hasProducedOutput,
//          Uo→streamIdleAborted, ss→connectionDropped, GW/j2→isEmptyBlock, Pe/Ft→yieldedBlocks
```

**Two widenings, not one:**

1. **The new `Yn` disjunct** — a 529, a 5xx-that-is-not-529 (`Dqs`, `:534859-534861`), or an
   `api_error`-typed `APIError`, *and* `J` (output was already produced). This is the bullet.
2. **`ss` is wider than 193's `(Ee && Y)`.** 220 `:511176`:
   `ss = Fs !== null && (Lc || Wie.has(Fs.code))` — stale-connection **or network-down**;
   193 `:595745,:595762`: `Ee = Y !== null && Sce.has(Y.code)` and the test was `Ee && Y`, i.e. stale
   only. A `ENETDOWN`/`EHOSTUNREACH` mid-stream discarded the partial in 193 and preserves it in 220.
   The new cause token proves it: `cause: … Wie.has(Fs.code) ? Ee("network_down") : Ee("stale_connection")`
   at `:511271-511273`. 193 had **two** causes (`Ve(oa ? "watchdog" : "stale_connection")`,
   `:595834 (193)`); 220 has **four** (`watchdog` / `server_error` / `network_down` / `stale_connection`,
   `:511267-511273`).

### Why `&& J` on the server-error branch but not on the others

**What it does:** requires that real output was produced before a mid-stream server error is treated as
"finalizable" rather than "retryable".

**Why:** a 529 that arrives *before* any content is the ordinary overload case, and the correct
response is the retry ladder in [`retry_policy.md`](retry_policy.md) — model fallback, backoff, the
`JBo = 3` consecutive-529 breaker. Finalizing an empty turn on a 529 would convert a recoverable
overload into a visible failure. Only once tokens are on screen does discarding them cost more than
retrying, because a retry cannot resume — it re-bills the whole turn and re-generates different text.
The idle-watchdog (`Uo`) and connection-drop (`ss`) branches do **not** need the `&& J` guard because
they are already inside the `Pe.some(non-empty) || bs` outer test at `:511193`.

### The incomplete-response notice

The synthesized assistant message is a three-way (with-output) / two-way (thinking-only) message
matrix at `:511277-511285`. The new row is the middle one:

```javascript
content: Ys
  ? mo  ? `${RE}: Response stalled mid-stream. The response above may be incomplete.`        // watchdog   (1/1)
        : Yn ? `${RE}: Server error mid-response. The response above may be incomplete.`     // NEW        (1/0)
             : `${RE}: Connection closed mid-response. The response above may be incomplete.`// drop       (1/1)
  : mo  ? `${RE}: Response stalled while thinking, before producing a response. Try again.`  // (1/1)
        : `${RE}: Connection closed while thinking, before producing a response. Try again.` // (1/1)
```

Before yielding it the code **synthesizes a stop reason** (`:511246-511251`):
`bc = dl ? "tool_use" : "end_turn"`, stamped onto every yielded block along with the accumulated usage.
This is what makes the partial a well-formed conversation turn rather than a dangling assistant
message — without it the next request would be rejected for an unterminated `tool_use`. That machinery
is carryover (`:595815-595819 (193)`); only the new cause reaches it.

**Usage is credited exactly once** via the `jr !== "credited"` latch (`:511288`, `:511226`) — a
`"credited"` sentinel rather than a boolean, so the several exit paths through this block cannot
double-bill a partial turn.

---

## 5. `isAbortedMidStream` — partial preservation on user abort

**220=5 / 193=0.** A separate, unannounced addition in the same region. `ji`
(`buildAbortedPartialMessage`, `:510491-510507`) builds the assistant message that survives a
user-initiated abort, and 220 stamps it:

```javascript
            isAbortedMidStream: !0,                       // :510503  — absent at :595187 (193)
            ...void 0,
            ...(Le !== void 0 && { effort: Le }),         // :510505  — also new
```

The guard above it is unchanged (`if (i.querySource !== "sdk" && i.keepPartialMessageOnAbort !== !0) return;`,
`:510492` vs `:595176 (193)`), so *who* gets a partial did not change — only that the message is now
**self-describing**. That matters for the `.219` headless bullet *"`claude -p` text output dropping the
answer when a turn dies mid-stream"*, which the scoping pass filed UNANCHORED: a consumer can now
distinguish a truncated assistant message from a complete one without inspecting `stop_reason`.
[`51_headless_sdk/`](../51_headless_sdk/) owns that bullet; this is the client-side field it needs.

---

## 6. `.208` — the HTTP/2 GOAWAY crash

> `.208`: *"Fixed supervised/background sessions crashing on an HTTP/2 GOAWAY in flight."*

**Verdict: NET_NEW, and it is not in the streaming code at all — it is in the `uncaughtException` handler.**

Anchors, all 220-only: `ERR_HTTP2_GOAWAY_SESSION` `:165078` (220=1/193=0);
`Recovered HTTP/2 stream-teardown uncaught exception` `:522528` (1/0);
`uncaught_exception_recovered` `:522524` (1/0).

The problem: when the server sends a GOAWAY frame, Node's `http2` module raises the error
**asynchronously from an internal C++ callback**, not on the promise chain the streaming code is
awaiting. There is no `try`/`catch` that can see it; it lands on `process.on("uncaughtException")`,
which — under `CLAUDE_CODE_SUPERVISED` — exits the process (`:522535-522543`).

```javascript
// ============================================
// isRecoverableHttp2TeardownError - stack-frame-verified HTTP/2 teardown classifier
// Location: cli_inner_pretty.js:165073-165086 (+ regex :165101, frame matcher :165088-165100)
// ============================================

// ORIGINAL (for source lookup):
function aau(e) {
  try {
    let t = e.code;
    if (t === "ERR_HTTP2_STREAM_ERROR")
      return typeof e.message === "string" && VOg.test(e.message) && sau(e.stack, "emitStreamErrorNT (node:http2:");
    if (t === "ERR_HTTP2_GOAWAY_SESSION")
      return (
        e.message === "New streams cannot be created after receiving a GOAWAY" &&
        sau(e.stack, "streamRejectedByGoawaySession (node:http2:")
      );
    return !1;
  } catch { return !1; }
}
var VOg,
  sau = (e, t) => typeof e === "string" &&
    e.split("\n").some((r) => { let n = r.trim(); return n.startsWith("at ") && n.includes(t); });
// VOg = /^Stream closed with error code NGHTTP2_[A-Z0-9_]+$/     (:165101)

// READABLE (for understanding):
function isRecoverableHttp2TeardownError(err) {
  try {
    switch (err.code) {
      case "ERR_HTTP2_STREAM_ERROR":
        return typeof err.message === "string"
            && NGHTTP2_STREAM_CLOSE_RE.test(err.message)
            && stackHasFrame(err.stack, "emitStreamErrorNT (node:http2:");
      case "ERR_HTTP2_GOAWAY_SESSION":
        return err.message === "New streams cannot be created after receiving a GOAWAY"
            && stackHasFrame(err.stack, "streamRejectedByGoawaySession (node:http2:");
      default:
        return false;
    }
  } catch { return false; }
}

// Mapping: aau→isRecoverableHttp2TeardownError, sau→stackHasFrame, VOg→NGHTTP2_STREAM_CLOSE_RE
```

Its one caller, the `uncaughtException` handler (`:522515-522534`):

```javascript
      let n = t(r),
        o = n.isHostError && aau(r) && Dip(Date.now());          // classify + rate-limit
      Sr("error", "uncaught_exception", { ...n, recovered: o });
      …
      if (o) {
        (w(`Recovered HTTP/2 stream-teardown uncaught exception (${n.error_name}) — transport throttle, keeping the process alive`,
           { level: "error" }),
          z8s(n.error_message ?? n.error_name));
        return;                                                   // <-- survive
      }
```

**Why a three-part test (`code` + exact `message` + stack frame)?**

**What it does:** proves the exception came from Node's own HTTP/2 teardown path and not from
application code that happens to carry the same error code.

**How it works:** `code` narrows to two values; `message` is compared **verbatim** against the string
Node hardcodes (or, for stream errors, against
`/^Stream closed with error code NGHTTP2_[A-Z0-9_]+$/`); and `sau` walks the stack looking for a frame
whose text begins `at ` and contains the exact internal function name **plus the `(node:http2:` module
prefix**. A user-thrown `Error` with a spoofed `code` and `message` still fails the third test, because
it cannot manufacture an internal Node frame.

**Why this level of paranoia?** Swallowing an `uncaughtException` is the most dangerous thing a process
can do — it continues with unknown corrupted state. The three-part test is the price of confidence
that the state is *known*: an HTTP/2 session that is going away, whose only consequence is that the
in-flight request must be retried on a fresh connection, which the retry loop already handles.

**The throttle is the fourth safeguard.** `Dip(Date.now())` (`:522185`) is a rate limiter, and a second
counter caps how many recovered exceptions are *reported*: `if (J8s < Lip) (J8s++, ztr(r, "uncaught_exception_recovered"))`
with `Lip = 10` (`:522396`) and `J8s` reset to 0 at `:522302`. If GOAWAYs arrive in a storm — a load
balancer draining every connection — the process stops absorbing them and dies honestly rather than
spinning. `z8s` (`:522206`) records the last recovered message for the crash report.

**Key insight:** the bullet says "supervised/background sessions" because those are the ones where
`FTi()` (`:522535`) makes an uncaught exception fatal; an interactive session survived the same GOAWAY
by accident. The fix makes survival intentional and bounded for both.

---

## 7. `.208` — Bedrock "Truncated event message received"

> `.208`: *"Bedrock 'Truncated event message received' now names the content-type."*

**Verdict: the `_false_delta_ledger` entry for this bullet is RIGHT about the literal and WRONG about
the conclusion. The fix is not a message edit — it is a new pre-emptive guard that fires first.**

The ledger records `Truncated event message received` 220=2 / 193=2 (`:97362`, `:124031` vs
`:92763 (193)`, `:108945 (193)`) and files the bullet CARRYOVER/THIN. Both counts are correct: that
string lives inside the **vendored AWS eventstream codec**, is thrown when the binary frame header
promises more bytes than arrived, and was never edited. But it never *could* name the content-type —
by the time it throws, the codec has already committed to parsing bytes as an eventstream.

2.1.220 adds a check one layer up, in the `fetch` wrapper, with `220=4 / 193=0` on
`BedrockUnexpectedContentType`:

```javascript
// ============================================
// Bedrock eventstream content-type guard (in the fetch wrapper)
// Location: cli_inner_pretty.js:149991-149999
// ============================================

// ORIGINAL (for source lookup):
    if (
      n === "bedrock" &&
      u.ok &&
      l.includes("/invoke-with-response-stream") &&
      d &&
      !p?.includes("vnd.amazon.eventstream") &&
      !Z.CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_GUARD
    )
      throw (u.body?.cancel().catch(() => {}), new rZc(d));

// READABLE (for understanding):
    if (provider === "bedrock" &&
        response.ok &&                                             // only when the server claims success
        url.includes("/invoke-with-response-stream") &&            // only the streaming endpoint
        contentType &&                                             // header present at all
        !contentTypeLower?.includes("vnd.amazon.eventstream") &&   // ...but wrong
        !env.CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_GUARD)
      { response.body?.cancel().catch(() => {}); throw new BedrockUnexpectedContentTypeError(contentType); }

// Mapping: rZc→BedrockUnexpectedContentTypeError, n→provider, u→response, l→url,
//          d→contentType, p→contentTypeLower, Z→managedEnvProxy
```

The error class (`rZc`, `:150097-150109`) is where the content-type is named:

> `Bedrock streaming response has content-type ${JSON.stringify(e)}; expected "application/vnd.amazon.eventstream".`
> `A gateway or proxy between Claude Code and Bedrock is likely transforming the response body — Bedrock's`
> `binary event-stream format must be passed through unmodified. Set`
> `CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_GUARD=1 to suppress this check while the gateway is being fixed.`

`CLAUDE_CODE_DISABLE_BEDROCK_CONTENT_TYPE_GUARD` is **220=3 (`:31100`, `:149997`, `:150104`) / 193=0**.

**Design points worth naming:**

1. **`u.ok &&`** — the guard only fires on a *successful* response. A 4xx/5xx from Bedrock legitimately
   returns `application/json`, and refusing it here would mask the real error.
2. **`d &&`** (content-type present) — a missing header is tolerated; only a *wrong* one is fatal.
   That is the fail-open direction for the one case the client cannot distinguish from a legitimate
   older gateway.
3. **`u.body?.cancel()`** before throwing — releases the socket rather than leaking a paused body
   stream, and the `.catch(() => {})` swallows the cancel rejection so the real error propagates.
4. **The error carries the fix in its own text**, including the escape hatch, because the person who
   sees it is an operator whose gateway is at fault, not the CLI user.
5. **It is in the fail-fast set.** `:534939` `if (r?.code === "BedrockUnexpectedContentType") return !1;`
   — see [`retry_policy.md`](retry_policy.md) §3. A misconfigured gateway is deterministic; retrying it
   ten times is pure delay. And `:227952` `if (n === "BedrockUnexpectedContentType") return t.message;`
   makes the formatter surface the full explanatory text verbatim instead of a generic
   "Unable to connect to API".

**Key insight:** a bullet that says a *message* changed can be satisfied by a *new error thrown
earlier*. The correct verdict for `.208` #17 is therefore **NET_NEW (new guard) + CARRYOVER (the old
message, unchanged, now usually unreachable)** — not the ledger's flat CARRYOVER. The same fetch
wrapper is also where the byte watchdog attaches to Bedrock eventstreams (`m = n === "bedrock" &&
p?.includes("vnd.amazon.eventstream") && iZc()`, `:150001`), which is **carryover** —
`d = r === "bedrock" && c?.includes("vnd.amazon.eventstream") && zgi()` at `:134523 (193)`.

---

## 8. `.212` — mid-conversation system block behind gateways

> `.212`: *"The mid-conversation system block now works behind gateways and custom base URLs."*

Owned by [`40_system_prompt/`](../40_system_prompt/) for the block's *content*. The **retry** half is
here and is net-new: `retry:api-system-cache-demote` **220=1 (`:509925`) / 193=0**;
`api_midconv_cache_proxy` **220=2 / 193=0**.

```javascript
// ORIGINAL (cli_inner_pretty.js:509920-509926):
          w("[mid-conv-system] proxy rejected cache_control on the api_system tail — demoting the breakpoint to the trailing message for this conversation",
            { level: "warn" }),
          $e("api_midconv_cache_proxy", "proxy_rejected"),
          "retry:api-system-cache-demote"
```

The client places a prompt-caching breakpoint (`cache_control`) on the trailing `api_system` block. A
gateway that does not understand the mid-conversation system role rejects it. Rather than disable
mid-conversation system entirely, the handler **demotes the breakpoint to the trailing message** and
retries — keeping the block and losing only one cache anchor. `ec` (`:509929-509931`) latches the
demotion for the rest of the conversation (`QF(M, bji)`) and emits the success counter
`be("api_midconv_cache_proxy")`, so the cost is one retry per session, not per turn. Compare
`tengu_mid_conv_system_fallback_retry` (`:509912`), which is **220=1 / 193=1** — the *other*,
pre-existing retry for the same feature, covering upstream rejection of the role itself.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_api_reliability.md](../00_overview/symbol_additions_v2_1_220_api_reliability.md).

Key functions in this document:
- `armEventWatchdog` (`As`, `:510152`) - re-armed per event; warn + abort timers
- `armStallIndicator` (`vs`, `:510132`) - the "stalled" countdown, with the new advisor grace
- `clearWatchdogTimers` (`fi`, `:510126`) - cancels all three timers and clears the retry status
- `getStreamIdleTimeoutMs` (`a7i`, `:149792`) - `max(CLAUDE_STREAM_IDLE_TIMEOUT_MS, 300000)`
- `getByteStreamIdleTimeoutMs` (`l7i`, `:149795`) - provider-aware byte deadline, gate-tunable
- `isByteWatchdogEnabled` (`nZc`, `:149938`) - `tengu_stream_watchdog_default_on`, default true
- `isBedrockByteWatchdogEnabled` (`iZc`, `:149946`) - `CLAUDE_ENABLE_BYTE_WATCHDOG_BEDROCK`
- `attachByteWatchdog` (`kxg`, `:149809`) - the `ReadableStream` wrapper with suspend detection
- `StreamSuspendedError` (`tZc`, `:150088`) - thrown on detected system suspend
- `BedrockUnexpectedContentTypeError` (`rZc`, `:150097`) - names the content-type; carries the fix hint
- `buildAbortedPartialMessage` (`ji`, `:510491`) - now stamps `isAbortedMidStream`
- `buildServerFallbackEvent` (`fs`, `:510508`) - the `server_fallback` yield
- `isServerError5xx` (`Dqs`, `:534859`) - 5xx-excluding-529 predicate used by the keep-partial test
- `isOverloaded529` (`dSe`, `:227871`) - 529 or `"type":"overloaded_error"` in the message
- `classifyStreamFailureReason` (`LLu`, `:228003`) - `stream_suspended`/`stale_connection`/`context_hint_sse`/`watchdog`/`other`
- `isRecoverableHttp2TeardownError` (`aau`, `:165073`) - three-part GOAWAY / stream-error classifier
- `stackHasFrame` (`sau`, `:165088`) - internal-frame matcher
- `NGHTTP2_STREAM_CLOSE_RE` (`VOg`, `:165101`) - `/^Stream closed with error code NGHTTP2_[A-Z0-9_]+$/`
- `STALL_INDICATOR_DELAY_MS` (`xqs`, `:512025`) - `20000`
- `ADVISOR_STALL_GRACE_CAP_MS` (`c1_`, `:512026`) - `90000`
- `MAX_RECOVERED_UNCAUGHT_REPORTS` (`Lip`, `:522396`) - `10`
