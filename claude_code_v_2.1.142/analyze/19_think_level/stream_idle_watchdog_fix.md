# Stream Idle Watchdog Sleep/Wake Fix (v2.1.139)

## What changed

The byte-watchdog wraps the API response stream and arms a timer for
each chunk. If no chunks arrive for `idleMs` (default 5 minutes), it
fires `StreamIdleTimeoutError`, cancels the stream, and shows the
user a "Stream idle timeout" toast.

Two related bugs were present prior to v2.1.139:

1. (v2.1.126 fix) On Mac after waking from sleep, the watchdog timer
   fires immediately. Cause: the laptop slept while a stream was
   active, the timer scheduling kept its monotonic deadline, and on
   wake the event loop processed the deadline as already elapsed.
2. (v2.1.139 fix) A spurious "Stream idle timeout" appeared **5
   minutes after the response had successfully completed**. Cause: the
   watchdog timer scheduled at the start of the last-chunk receipt
   wasn't cleared when the stream's `.cancel()` was called via certain
   ReadableStream-controller paths (e.g. when the consumer aborted but
   the stream completed naturally between the abort signal and the
   readable's close event).

The v2.1.139 fix adds a `.cancel(controller)` arrow in the wrapping
`ReadableStream` that calls `J()` — the unified `clearTimeout` for
both the idle timer (`_`) and the soft-stall timer chain (`A`). This
ensures every cancellation path clears the watchdog state.

The v2.1.126-class "fired after sleep" handling is layered on top:
when the timer *does* fire, the handler first checks how far past its
deadline it ran. If it's late by more than half the idle window, the
late-ness is attributed to a sleep/suspend event, and the watchdog
re-arms instead of firing the error.

## Source: the wrapping `ReadableStream` with cancel hook

```javascript
// ============================================
// wrapStreamWithByteWatchdog - re-armable byte watchdog with sleep/suspend rescue
// Location: cli_inner_pretty.js:128281-128392
// ============================================

// ORIGINAL (for source lookup):
function TV1(H, $, q, K) {
  let _ = null,
    A = null,
    z = 0,
    Y = 0,
    f = performance.now(),
    O = null,
    M = !1,
    w = [15000, 30000, 60000, 120000],
    D = () => {
      if (A !== null) (clearTimeout(A), (A = null));
    },
    j = () => {
      if (_ !== null) (clearTimeout(_), (_ = null));
    },
    J = () => {
      (j(), D());
    },
    X = 0,
    L = (W) => {
      if ((D(), z >= w.length)) return;
      let G = w[z],
        V = performance.now() - X;
      ((A = setTimeout(
        () => {
          if (((A = null), W.desiredSize === null)) return;
          if (performance.now() - X < G / 2) {
            L(W);
            return;
          }
          try {
            N(
              `[Stall] stream_idle_partial lastChunkAgeMs=${Math.round(performance.now() - X)} bytesTotal=${Y} idleDeadlineMs=${$}`,
              { level: "warn" },
            );
          } catch {}
          (z++, L(W));
        },
        Math.max(0, G - V),
      )),
        A.unref?.());
    },
    P = (W) => {
      (J(),
        (X = performance.now()),
        (z = 0),
        L(W),
        (_ = setTimeout(() => {
          _ = null;
          let G = Math.round(performance.now() - X - $),
            V = W.desiredSize === null;
          if (G < -$ / 2) {
            (N(`[byte-watchdog] suppressed: late=${G}ms (sleep/suspend), re-arming`), P(W));
            return;
          }
          try {
            if (
              (N(`[byte-watchdog] firing: idle=${$}ms late=${G}ms errored=${V} bodyReadPending=${M}`, {
                level: "warn",
              }),
              Z8("warn", "cli_byte_watchdog_fired", { idle_ms: $, late_ms: G, readable_errored: V, body_read_pending: M }),
              G >= 1000)
            )
              d("tengu_byte_watchdog_fired_late", { idle_ms: $, late_ms: G, readable_errored: V });
          } catch {}
          let v = new $l$($, Y, O !== null ? Math.round(O - f) : void 0, M, q);
          try {
            W.error(v);
          } catch {}
          Z.cancel(v).catch(() => {});
        }, $)),
        _.unref?.());
    },
    Z = H.getReader();
  return new ReadableStream({
    start(W) {
      P(W);
    },
    async pull(W) {
      M = !0;
      let G;
      try {
        G = await Z.read();
      } catch (v) {
        ((M = !1), J());
        try {
          W.error(v);
        } catch {}
        return;
      }
      if (((M = !1), G.done)) {
        J();
        try {
          W.close();
        } catch {}
        return;
      }
      let V = G.value;
      if (O === null && V.byteLength > 0) O = performance.now();
      if (((Y += V.byteLength), K)) K.lastAt = performance.now();
      (P(W), W.enqueue(V));
    },
    cancel(W) {
      return (J(), Z.cancel(W));   // ← key fix: J() clears BOTH idle + soft-stall timers
    },
  });
}

// READABLE (for understanding):
function wrapStreamWithByteWatchdog(sourceStream, idleMs, cfRay, chunkTimingRef) {
  let idleTimer       = null;           // _
  let softStallTimer  = null;           // A
  let softStallStep   = 0;              // z
  let bytesReceived   = 0;              // Y
  let streamStartMs   = performance.now();  // f
  let firstByteMs     = null;           // O — ttfb
  let bodyReadPending = false;          // M — is there a pending read()?
  const SOFT_STALL_THRESHOLDS = [15000, 30000, 60000, 120000];  // w
  let lastChunkAtMs   = 0;              // X — performance.now of last chunk

  const clearSoftStallTimer = () => {   // D
    if (softStallTimer !== null) { clearTimeout(softStallTimer); softStallTimer = null; }
  };
  const clearIdleTimer = () => {        // j
    if (idleTimer !== null) { clearTimeout(idleTimer); idleTimer = null; }
  };
  const clearAllTimers = () => {        // J — used in done/error/CANCEL paths
    clearIdleTimer();
    clearSoftStallTimer();
  };

  // Schedule the soft-stall warning ladder: emit a warn log every time
  // we cross 15s/30s/60s/120s since the last chunk. Re-armed by chunk receipt.
  const scheduleSoftStallWarn = (controller) => {  // L
    clearSoftStallTimer();
    if (softStallStep >= SOFT_STALL_THRESHOLDS.length) return;
    const threshold = SOFT_STALL_THRESHOLDS[softStallStep];
    const elapsed   = performance.now() - lastChunkAtMs;
    softStallTimer = setTimeout(() => {
      softStallTimer = null;
      if (controller.desiredSize === null) return;  // stream errored/closed; abort silently
      // Defensive: if we fire suspiciously early (< threshold/2), re-schedule.
      // This guards against the same sleep/wake edge that affects the hard idle timer.
      if (performance.now() - lastChunkAtMs < threshold / 2) {
        scheduleSoftStallWarn(controller);
        return;
      }
      warnLog(
        `[Stall] stream_idle_partial lastChunkAgeMs=${Math.round(performance.now() - lastChunkAtMs)} bytesTotal=${bytesReceived} idleDeadlineMs=${idleMs}`,
        { level: "warn" }
      );
      softStallStep++;
      scheduleSoftStallWarn(controller);
    }, Math.max(0, threshold - elapsed));
    softStallTimer.unref?.();  // don't keep the process alive just for this
  };

  // Re-arm idle + soft-stall after a chunk receipt. Critically:
  //   - clearAllTimers() FIRST → any previously-scheduled idle fire is cancelled.
  //   - lastChunkAtMs is reset to performance.now().
  //   - The idle handler, when fired, inspects how late it was relative to its
  //     deadline. If "late" by more than half the idle window, attributes to
  //     sleep/suspend and re-arms instead of erroring.
  const armWatchdogs = (controller) => {  // P
    clearAllTimers();
    lastChunkAtMs = performance.now();
    softStallStep = 0;
    scheduleSoftStallWarn(controller);

    idleTimer = setTimeout(() => {
      idleTimer = null;
      const lateByMs        = Math.round(performance.now() - lastChunkAtMs - idleMs);
      const controllerErred = controller.desiredSize === null;

      // ───── Sleep/wake suppression ─────
      // A negative-late timer means it fired *before* its deadline as measured
      // against performance.now(). This happens when the OS suspended the
      // process; on resume, the timer fires immediately with the "late by"
      // value showing how much the clock has advanced since arming.
      //
      // Threshold of idleMs/2: we want to suppress real long sleeps (laptop
      // closed for an hour) but still fire for genuine idle. Half the window
      // is conservative — only fire if we're confident the stream really has
      // been quiet for the full idle period after wake.
      if (lateByMs < -idleMs / 2) {
        warnLog(`[byte-watchdog] suppressed: late=${lateByMs}ms (sleep/suspend), re-arming`);
        armWatchdogs(controller);
        return;
      }
      // ──────────────────────────────────

      warnLog(
        `[byte-watchdog] firing: idle=${idleMs}ms late=${lateByMs}ms errored=${controllerErred} bodyReadPending=${bodyReadPending}`,
        { level: "warn" }
      );
      structuredEvent("warn", "cli_byte_watchdog_fired", {
        idle_ms: idleMs,
        late_ms: lateByMs,
        readable_errored: controllerErred,
        body_read_pending: bodyReadPending,
      });
      if (lateByMs >= 1000) {
        // Telemetry-only signal: fired meaningfully late but not so late we
        // suppressed. Captures the gradient where we *should* have suppressed
        // but didn't — informs threshold tuning.
        emitTelemetry("tengu_byte_watchdog_fired_late", { idle_ms: idleMs, late_ms: lateByMs, readable_errored: controllerErred });
      }
      const err = new StreamIdleTimeoutError(
        idleMs,
        bytesReceived,
        firstByteMs !== null ? Math.round(firstByteMs - streamStartMs) : undefined,
        bodyReadPending,
        cfRay,
      );
      try { controller.error(err); } catch {}
      reader.cancel(err).catch(() => {});
    }, idleMs);
    idleTimer.unref?.();
  };

  const reader = sourceStream.getReader();
  return new ReadableStream({
    start(controller) {
      armWatchdogs(controller);
    },
    async pull(controller) {
      bodyReadPending = true;
      let result;
      try {
        result = await reader.read();
      } catch (readErr) {
        bodyReadPending = false;
        clearAllTimers();
        try { controller.error(readErr); } catch {}
        return;
      }
      bodyReadPending = false;
      if (result.done) {
        clearAllTimers();    // ← normal completion: clears timer
        try { controller.close(); } catch {}
        return;
      }
      const chunk = result.value;
      if (firstByteMs === null && chunk.byteLength > 0) firstByteMs = performance.now();
      bytesReceived += chunk.byteLength;
      if (chunkTimingRef) chunkTimingRef.lastAt = performance.now();
      armWatchdogs(controller);   // re-arm for next chunk
      controller.enqueue(chunk);
    },
    cancel(reason) {
      // ★ THE 2.1.139 FIX: every cancel path clears the watchdog timers ★
      //
      // Before this line, when the consumer cancelled the wrapping
      // ReadableStream (e.g. the AbortController on the outer fetch fired,
      // or the consumer threw and the readable propagated cancel up), the
      // pending idleTimer would still be scheduled. After idleMs more
      // wall-clock, it would fire spuriously even though the stream was
      // long gone — manifesting to the user as "Stream idle timeout" 5
      // minutes after their response completed.
      clearAllTimers();
      return reader.cancel(reason);
    },
  });
}

// Mapping: TV1→wrapStreamWithByteWatchdog, $l$→StreamIdleTimeoutError,
//          N→warnLog, Z8→structuredEvent, d→emitTelemetry
```

## Source: the error class

```javascript
// ============================================
// StreamIdleTimeoutError - the exception raised when the watchdog fires
// Location: cli_inner_pretty.js:128470-128485
// ============================================

class StreamIdleTimeoutError extends Error {
  idleMs;
  bytesReceived;
  ttfbMs;
  bodyReadPending;
  cfRay;
  constructor(idleMs, bytesReceived = 0, ttfbMs, bodyReadPending = true, cfRay) {
    super(`stream idle: no bytes for ${idleMs}ms`);
    this.name           = "StreamIdleTimeoutError";
    this.idleMs         = idleMs;
    this.bytesReceived  = bytesReceived;
    this.ttfbMs         = ttfbMs;
    this.bodyReadPending = bodyReadPending;
    this.cfRay          = cfRay;
  }
}
```

Each field is diagnostic:
- `idleMs` — the configured window (5 minutes default, env-overridable
  via `CLAUDE_STREAM_IDLE_TIMEOUT_MS`).
- `bytesReceived` — total bytes streamed before the gap.
- `ttfbMs` — time-to-first-byte (helps distinguish "connected but
  silent" from "never received first byte").
- `bodyReadPending` — whether a `reader.read()` is currently
  outstanding when the timer fires. A pending read means the upstream
  IS reading from the socket and just isn't getting data — the
  upstream is alive but slow. False means the read had returned
  before the timer fired, so we're stuck waiting for the next chunk.
- `cfRay` — Cloudflare ray header, for correlating with edge logs
  if the request was server-side stalled.

## Source: how the watchdog is enabled and the timeout configured

```javascript
// ============================================
// getStreamIdleTimeoutMs - env-overridable, clamped to >= 5 minutes
// Location: cli_inner_pretty.js:128278-128280
// ============================================

function getStreamIdleTimeoutMs() {
  // CLAUDE_STREAM_IDLE_TIMEOUT_MS lets ops increase the timeout for slow networks.
  // Number(undefined or NaN-string) is NaN; NaN || 0 = 0; Math.max(0, 300000) = 300000.
  // So the floor is 5 minutes; you can't *lower* the timeout to be more aggressive.
  return Math.max(Number(process.env.CLAUDE_STREAM_IDLE_TIMEOUT_MS) || 0, 300000);
}

// ============================================
// isByteWatchdogEnabled - feature flag with env override
// Location: cli_inner_pretty.js:128393-128397
// ============================================

function isByteWatchdogEnabled() {
  if (parseExplicitFalse(process.env.CLAUDE_ENABLE_BYTE_WATCHDOG)) return false;
  if (parseExplicitTrue(process.env.CLAUDE_ENABLE_BYTE_WATCHDOG))  return true;
  return getFeatureFlag("tengu_stream_watchdog_default_on", true);
}

// ============================================
// fetchWithByteWatchdog - install the wrapper on text/event-stream responses
// Location: cli_inner_pretty.js:128398-128428
// ============================================

function fetchWithByteWatchdog(baseFetch, source) {
  const fetchImpl = baseFetch ?? globalThis.fetch;
  const provider  = getProvider();
  // Wrap only when going to api.anthropic.com (firstParty + base URL match) or
  // anthropicAws first-party (the only places this code path is the one streaming).
  const shouldWrap = (provider === "firstParty" && isAnthropicHost()) ||
                     (provider === "anthropicAws" && !process.env.ANTHROPIC_AWS_BASE_URL);
  return async (request, init) => {
    const headers = new Headers(init?.headers);
    if (shouldWrap && !headers.has(REQUEST_ID_HEADER)) headers.set(REQUEST_ID_HEADER, crypto.randomUUID());
    // …request logging…
    const response = await fetchImpl(request, { ...init, headers });
    if (shouldWrap && response.body && response.headers.get("content-type")?.includes("text/event-stream") && isByteWatchdogEnabled()) {
      const idleMs        = getStreamIdleTimeoutMs();
      const cfRay         = response.headers.get("cf-ray") ?? undefined;
      const chunkTimingRef = { lastAt: 0 };  // shared with caller for connection diagnostics
      const wrapped = new Response(
        wrapStreamWithByteWatchdog(response.body, idleMs, cfRay, chunkTimingRef),
        response,
      );
      Object.defineProperty(wrapped, "url", { value: response.url });
      Object.defineProperty(wrapped, "_chunkTimes", { value: chunkTimingRef });
      return wrapped;
    }
    return response;
  };
}
```

## Why this approach

### Why two timers (idle + soft-stall) rather than one?

**What:** `_` is the hard idle timer (fires `StreamIdleTimeoutError`).
`A` is the soft-stall warning chain (logs warns at 15s/30s/60s/120s).

**Why:**

- Hard idle is for *errors* — the connection is dead and we should
  fail.
- Soft stall is for *diagnostics* — partial responses where chunks
  are coming through but slowly. The 4-rung ladder distinguishes
  "single 15s pause" from "sustained slowness."
- Telemetry on the soft-stall ladder informs back-pressure tuning;
  emitting it for every threshold gives Anthropic granularity.
- The two timers are armed independently but **share the cancellation
  path** (`clearAllTimers`) — so a single cancel kills both.

### Why is the sleep-suspend threshold `idleMs / 2`?

**What:** `if (lateByMs < -idleMs / 2)` suppresses the fire.

**Why:**

- After waking from sleep, the timer fires with a very negative
  `lateByMs` — it should have fired N ms ago but the laptop was
  asleep, so `performance.now() - lastChunkAtMs` is much less than
  the deadline implied by `idleMs`.
- The `-idleMs/2` threshold catches "the laptop was asleep for at
  least 2.5 minutes" (with the default 5-minute idle). Short blips
  (battery saver, brief OS hangs) below 2.5 minutes don't trigger
  suppression — those are real idle and should fire.
- Choosing exactly `idleMs/2` rather than a fixed constant means the
  threshold scales with the user's configured timeout. A user with
  `CLAUDE_STREAM_IDLE_TIMEOUT_MS=600000` (10 min) gets a 5-min
  sleep-suppression threshold.

### Why re-arm rather than fail-fast on detection of sleep?

**What:** When the sleep is detected, `armWatchdogs(controller)` is
called again — the watchdog continues running.

**Why:**

- The stream may still be alive after wake. Cloud providers keep TCP
  connections open through OS suspends (the kernel buffers, the peer
  retransmits). Re-arming gives the connection a fresh idle window
  to see if data resumes.
- If the connection IS dead, the next idle window will tick down
  cleanly without a clock jump and the watchdog will fire normally.
- Failing fast on sleep would interrupt working streams that survived
  the sleep — bad UX for users who sleep their laptop briefly during
  long-running queries.

### Why telemetry on `late_ms >= 1000` separately?

**What:** When the watchdog fires (not suppressed), if `late_ms >=
1000`, also emit `tengu_byte_watchdog_fired_late`.

**Why:**

- This is the gradient zone — fired but late by a meaningful amount
  (1s+). It might indicate event-loop pressure, garbage-collection
  pauses, or sub-threshold sleeps.
- Tracking it separately lets the team tune the sleep/wake threshold:
  if many fires are slightly-late, maybe the threshold should be
  tighter. If most fires are dead-on-time, threshold is fine.
- The discrimination between "fired" and "fired late" wouldn't be
  capturable in a single event.

### Why does `cancel()` need to clear timers if `pull()` already does on close/error?

**What:** The `cancel(reason)` arrow at the end of the ReadableStream
config calls `clearAllTimers()`. The pre-v2.1.139 code lacked this
arrow.

**Why:**

- `pull()` clears timers on `result.done` (normal close) and on read
  exceptions. But neither of those fires for *consumer-initiated
  cancellation*.
- A consumer cancelling the wrapping ReadableStream calls its
  `cancel()` method, which (per the WHATWG Streams spec) does NOT
  cascade to `pull()`. The wrapper must intercept this explicitly.
- Without the `cancel()` arrow, the wrapping stream is cancelled, the
  reader is cancelled, but the **idle timer is still scheduled**. The
  closure captures `controller`; when the timer fires, it calls
  `controller.error(…)` on the already-closed stream (silently swallowed
  by the `try { … } catch {}`), then tries to emit a user-visible
  toast.
- The 2.1.139 fix is a single arrow that adds cleanup to this final
  cancellation path.

## Cross-validation: pre-2.1.139 vs 2.1.139

| Aspect | Pre-2.1.139 | v2.1.139+ | Δ |
|--------|-------------|-----------|---|
| `start(controller)` → `armWatchdogs` | Same | Same | Unchanged |
| `pull()` clears on `done`/exception | Same | Same | Unchanged |
| `cancel(reason)` clears timers | No (missing!) | Yes (`clearAllTimers()`) | Fixed |
| Sleep/wake detection in idle timer | Yes (v2.1.126) | Yes | Unchanged |
| Telemetry on late fires | Yes (v2.1.126) | Yes | Unchanged |
| Spurious "Stream idle timeout" 5min after success | Possible | No | Fixed |
| Soft-stall ladder thresholds (15/30/60/120s) | Same | Same | Unchanged |

## Cross-validation: telemetry events

| Event | Meaning |
|-------|---------|
| `cli_streaming_idle_warning` | Soft warn from outer request loop: "no chunks for N seconds." |
| `cli_byte_watchdog_fired` | Hard fire (not suppressed). Includes `idle_ms`/`late_ms`/`readable_errored`/`body_read_pending`. |
| `tengu_byte_watchdog_fired_late` | Fired with `late_ms >= 1000` — gradient between normal fire and sleep suppression. |
| `tengu_spinner_stall_cleared` | UI spinner observed tokens after a stall. (UI-level signal, separate from watchdog.) |
| `tengu_spinner_stalled_ui` | UI spinner crossed a stall threshold (10s/45s/300s). |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — LLM API / Telemetry
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions and classes in this document:
- `wrapStreamWithByteWatchdog` (`TV1`) — the wrapping stream with the new `cancel()` arrow; cli_inner_pretty.js:128281-128392
- `StreamIdleTimeoutError` (`$l$`) — the error class; cli_inner_pretty.js:128470-128485
- `getStreamIdleTimeoutMs` (`U$6`) — env-overridable, 5-min floor; cli_inner_pretty.js:128278-128280
- `isByteWatchdogEnabled` (`VV1`) — feature flag; cli_inner_pretty.js:128393-128397
- `fetchWithByteWatchdog` (`vV1`) — fetch wrapper; cli_inner_pretty.js:128398-128428
- `cli_byte_watchdog_fired`, `tengu_byte_watchdog_fired_late`, `cli_streaming_idle_warning` — telemetry events
