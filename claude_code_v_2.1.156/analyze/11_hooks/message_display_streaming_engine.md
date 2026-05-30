# MessageDisplay Streaming Engine — Whole-Line Flush, Debounce, In-Flight Cap (2.1.156)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Hooks
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Agent loop / streaming
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI renderer wiring
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry

Key functions / values in this document:

- `createMessageDisplayEngine` (`OW9`) — factory that returns the per-message streaming transform engine (`begin`/`delta`/`finalize`/`entryLanded`/`newTurn`) (cli_inner_pretty.js:626930-627084)
- `dispatchFlush` (`A`) — runs one hook pass for a flushed chunk, serialized through `appendChain` (cli_inner_pretty.js:626938-626976)
- `entryLanded`/`maybeEmitSummary` (`Y`) — post-flush bookkeeping; emits the telemetry summary when finalized and drained (cli_inner_pretty.js:626977-626992)
- `flushWholeLines` (`f`) — the whole-line flush algorithm; slices the raw buffer on the last newline (final flush may end mid-line) (cli_inner_pretty.js:626993-627006)
- `scheduleFlush` (`O`) — the debounce scheduler; uses `MESSAGE_DISPLAY_DEBOUNCE_MS` and `MESSAGE_DISPLAY_INFLIGHT_CAP` gating (cli_inner_pretty.js:627007-627030)
- `abandonTurn` (`M`) — aborts an in-flight turn (newTurn / begin replacement) (cli_inner_pretty.js:627031-627034)
- `pruneDisplayedMessageContent` (`t5q`) — drops display-override entries whose assistant messages are gone (cli_inner_pretty.js:627085-627096)
- `applyMessageDisplayToCompletedMessage` (`MW9`) — the completed-message (non-streaming) rewrite path (cli_inner_pretty.js:627097-627127)
- `MESSAGE_DISPLAY_DEBOUNCE_MS` (`AW9`) — `1000 / Xxz` = 100 ms debounce window (cli_inner_pretty.js:627130, 627139)
- `MESSAGE_DISPLAY_FLUSH_FPS` (`Xxz`) — `10` (the `1000/10` divisor) (cli_inner_pretty.js:627129)
- `MESSAGE_DISPLAY_INFLIGHT_CAP` (`YW9`) — `3` concurrent hook flushes (cli_inner_pretty.js:627131)
- `MESSAGE_DISPLAY_TIMEOUT_MS` (`fW9`) — `1e4` (10 s) per-flush hook timeout (cli_inner_pretty.js:627132)
- `executeMessageDisplayHooks` (`l6$`) — the MessageDisplay hook pipeline generator that each flush drives (cli_inner_pretty.js:551726-551745)
- `hasHookForEvent` (`wk`) — predicate gating whether the engine activates at all (cli_inner_pretty.js:552979-552990)

> Naming note: this deep-dive's READABLE pseudocode renders these as local variables (`flushIntervalMs`/`flushesPerSecond`/`maxInFlight`/`messageDisplayTimeoutMs` for the four constants; `messageDisplayStreamEngine`/`rewriteCompletedMessage`/`hasHooksForEvent` for `OW9`/`MW9`/`wk`). The canonical single-source-of-truth readable names are the `MESSAGE_DISPLAY_*` constants and `createMessageDisplayEngine`/`applyMessageDisplayToCompletedMessage`/`hasHookForEvent`, per [symbol_additions_v2_1_156_hooks.md](../00_overview/symbol_additions_v2_1_156_hooks.md).
- `displayedMessageContent` — app-state map `apiMessageId -> displayed text` (cli_inner_pretty.js:241514)
- `MessageDisplay` event name — registered in the hook-event enum (cli_inner_pretty.js:49289)

---

## TL;DR

`MessageDisplay` is a hook event, **new after v2.1.88** (high confidence — no precursor in
`src/entrypoints/sdk/coreSchemas.ts`, and the supporting app-state field/engine do not exist in 2.1.88).
It lets a hook **transform or hide assistant message text as it is displayed**, without touching the stored
transcript or what the model sees. The hard problem it solves is *streaming*: assistant text arrives token by
token, but you cannot afford to spawn a hook subprocess per token. The engine `createMessageDisplayEngine`
(`OW9`, cli_inner_pretty.js:626930-627084) solves this with three coordinated mechanisms:

1. **Whole-line flush** (`flushWholeLines` / `f`, cli_inner_pretty.js:626993-627006): only flush text up to the
   **last newline** in the raw buffer; the trailing partial line waits. The *final* flush is the one exception — it
   flushes everything, even mid-line.
2. **Debounce** (`scheduleFlush` / `O`, cli_inner_pretty.js:627007-627030): coalesce flushes into a
   `flushIntervalMs` = 100 ms window (`AW9` = `1000 / Xxz` = `1000/10`, cli_inner_pretty.js:627130-627139).
3. **In-flight cap** (`maxInFlight` / `YW9` = 3, cli_inner_pretty.js:627131): never run more than 3 hook passes
   concurrently, so a slow hook applies back-pressure instead of unbounded process fan-out.

Order is preserved with a serialized promise chain (`appendChain`, cli_inner_pretty.js:626973-626975) even though
the flushes themselves race. **If any flush throws or times out, the engine falls back to the original delta**
(cli_inner_pretty.js:626958-626963, 626942) so a broken hook never breaks the display. A separate completed-message
path `rewriteCompletedMessage` (`MW9`, cli_inner_pretty.js:627097-627127) handles non-streamed / replayed messages.

---

## Where it sits in the streaming pipeline

The engine is a singleton React `useMemo` (cli_inner_pretty.js:628561-628577) installed into the stream consumer as
`displayTransform` (cli_inner_pretty.js:629295). The stream reducer drives it through four lifecycle calls:

```
stream event                          engine method        (cli_inner_pretty.js)
─────────────────────────────────────────────────────────────────────────────────
message_start            ───────────▶ displayTransform.begin(messageId)     445150
content_block_delta(text)───────────▶ displayTransform.delta(textChunk)     445197
message_stop             ───────────▶ displayTransform.finalize()           445153
assistant entry landed   ───────────▶ displayTransform.entryLanded(msg)     445129
(new prompt submitted)   ───────────▶ ky.newTurn()                          629465
```

```
                ┌──────────────────── createMessageDisplayEngine (OW9) ─────────────────────┐
                │                                                                            │
 model stream   │  begin ──▶ turn{raw,flushedOffset,index,appendChain,inFlight,abort,stats} │   render side
 ───────────────┼──▶ delta(text) ─▶ raw += text ─▶ scheduleFlush(O) ──┐                      │
                │                                                       │                     │
                │   ┌── debounce 100ms / inFlight<3 / has whole line ──┘                     │
                │   ▼                                                                         │
                │  flushWholeLines(f) ─slice on last \n─▶ dispatchFlush(A) ─▶ l6$ hook        │
                │        │                                   │ (timeout 10s, fallback=delta)  │
                │        │                                   ▼                                 │
                │        │              appendChain.then(): output += result; emit(turn) ─────┼─▶ onStreamingDisplay(Ln)
                │   finalize() ─▶ final flush (whole raw, may end mid-line) ─▶ done=true ─────┼─▶ onMessageDisplay → displayedMessageContent[apiMessageId]
                │                                                                            │
                └────────────────────────────────────────────────────────────────────────────┘
                                                                          render substitution at 394841
```

---

## The per-message turn object

`begin` builds one mutable "turn" record per assistant message (cli_inner_pretty.js:627046-627065). Each field is
load-bearing for the flush state machine:

```javascript
// ============================================
// beginTurn - Allocate the per-message streaming turn object
// Location: cli_inner_pretty.js:627040-627066
// ============================================

// ORIGINAL (for source lookup):
begin(j) {
  if (_ && !_.finalized) M(_);
  if (!wk("MessageDisplay", H(), E$())) {
    ((_ = null), $(null));
    return;
  }
  ((_ = {
    apiMessageId: j,
    messageId: HR$.randomUUID(),
    turnId: K,
    raw: "",
    flushedOffset: 0,
    index: 0,
    output: "",
    appendChain: Promise.resolve(),
    lastFlushAt: 0,
    flushTimer: null,
    inFlight: 0,
    abortController: new AbortController(),
    finalized: !1,
    finalDispatched: !1,
    done: !1,
    abandoned: !1,
    stats: { totalDurationMs: 0, maxDurationMs: 0, errorCount: 0, summaryEmitted: !1 },
  }),
    $(""));
}

// READABLE (for understanding):
begin(apiMessageId) {
  // If a previous turn is still streaming, abort it (a new message superseded it).
  if (currentTurn && !currentTurn.finalized) abandonTurn(currentTurn);

  // Engine is opt-in: only spin up if a MessageDisplay hook is actually registered.
  if (!hasHooksForEvent("MessageDisplay", getAppState(), getSessionId())) {
    currentTurn = null;
    onStreamingDisplay(null);   // signal "no transform active" to the renderer
    return;
  }

  currentTurn = {
    apiMessageId,                       // server message id (key into displayedMessageContent)
    messageId: crypto.randomUUID(),     // local id passed to the hook for correlation
    turnId,                             // stable per user-turn id (reset by newTurn)
    raw: "",                            // accumulated model text so far
    flushedOffset: 0,                   // how many chars of raw have already been flushed
    index: 0,                           // monotonically increasing flush index
    output: "",                         // hook-transformed text accumulated in order
    appendChain: Promise.resolve(),     // serializes appends so output stays ordered
    lastFlushAt: 0,                     // timestamp of last flush (for debounce)
    flushTimer: null,                   // pending setTimeout handle, or null
    inFlight: 0,                        // count of hook passes currently running
    abortController: new AbortController(),
    finalized: false,                   // finalize() has been called
    finalDispatched: false,             // the final (whole-buffer) flush has been issued
    done: false,                        // emit as a completed message (vs streaming)
    abandoned: false,                   // superseded/cancelled; drop all output
    stats: { totalDurationMs: 0, maxDurationMs: 0, errorCount: 0, summaryEmitted: false },
  };
  onStreamingDisplay("");               // clear any stale streaming text
}

// Mapping: OW9→createMessageDisplayEngine, j→apiMessageId, _→currentTurn, K→turnId,
//          M→abandonTurn, wk→hasHooksForEvent, H→getAppState, E$→getSessionId,
//          $→onStreamingDisplay, HR$→crypto
```

Two ids deserve a note. `apiMessageId` is the **server** message id and is the key the renderer uses to look up the
displayed override (cli_inner_pretty.js:394841). `messageId`/`turnId` are local correlation ids passed to the hook so a
hook can distinguish flushes of the same message (`index`) from flushes across turns (`turnId`).

---

## Algorithm 1 — Whole-line flush (`flushWholeLines` / `f`)

### What it does

Slices the un-flushed tail of `raw` up to (and including) the **last newline**, hands that slice to a hook pass, and
advances `flushedOffset`. During streaming it deliberately leaves the trailing partial line unflushed; on the final
flush it takes everything.

```javascript
// ============================================
// flushWholeLines - Flush raw up to last newline (final flush: whole buffer)
// Location: cli_inner_pretty.js:626993-627006
// ============================================

// ORIGINAL (for source lookup):
function f(j, w) {
  if (j.flushTimer !== null) (clearTimeout(j.flushTimer), (j.flushTimer = null));
  if (j.inFlight >= YW9) return;
  let D = w
      ? j.raw.length
      : j.raw.lastIndexOf(`\n`) + 1,
    J = j.raw.slice(j.flushedOffset, D);
  if (!w && J === "") return;
  if (w) j.finalDispatched = !0;
  ((j.flushedOffset = D), (j.lastFlushAt = Date.now()));
  let X = j.index;
  (j.index++, A(j, X, w, J));
}

// READABLE (for understanding):
function flushWholeLines(turn, isFinal) {
  // Cancel any pending debounced flush — we're flushing now.
  if (turn.flushTimer !== null) {
    clearTimeout(turn.flushTimer);
    turn.flushTimer = null;
  }
  // Respect the concurrency cap. If 3 are already running, bail; the
  // finally-block of an in-flight pass will re-drive us (via maybeEmitSummary→scheduleFlush).
  if (turn.inFlight >= maxInFlight) return;

  // Flush boundary:
  //   final → end of buffer (may end mid-line);
  //   streaming → index just past the LAST newline (whole lines only).
  const flushEnd = isFinal ? turn.raw.length : turn.raw.lastIndexOf("\n") + 1;
  const chunk = turn.raw.slice(turn.flushedOffset, flushEnd);

  // Streaming flush with nothing new (no completed line yet) → nothing to do.
  if (!isFinal && chunk === "") return;

  if (isFinal) turn.finalDispatched = true;

  turn.flushedOffset = flushEnd;        // advance the watermark
  turn.lastFlushAt = Date.now();

  const flushIndex = turn.index;
  turn.index++;                         // every flush gets a unique, ordered index
  dispatchFlush(turn, flushIndex, isFinal, chunk);
}

// Mapping: f→flushWholeLines, j→turn, w→isFinal, D→flushEnd, J→chunk, X→flushIndex,
//          YW9→maxInFlight, A→dispatchFlush
```

### How it works (step by step)

1. **Cancel the timer.** Whether the flush was scheduled or forced, there is no longer a pending debounce.
2. **Concurrency gate.** If `inFlight >= 3` it returns immediately. The work is not lost: when a running pass finishes,
   its `finally` calls `maybeEmitSummary` (`Y`), which re-enters `scheduleFlush` (`O`) and re-tries (cli_inner_pretty.js:626964-626991).
3. **Compute the boundary.** Streaming: `raw.lastIndexOf("\n") + 1` — the position right after the last newline, i.e.
   the end of the last *complete* line. The `+1` includes the newline itself in the flushed chunk and makes the
   "nothing newline yet" case resolve to `0` (so `0 <= flushedOffset` shortcuts later). Final: `raw.length`.
4. **Slice.** `raw.slice(flushedOffset, flushEnd)` is exactly the un-flushed completed text.
5. **Empty-chunk short-circuit.** During streaming an empty slice means no new full line; return without spending a flush.
6. **Advance the watermark and stamp the time** (used by the debounce).
7. **Allocate a flush index** (`index++`) and dispatch. The index is what keeps ordering observable even when passes race.

### Why whole lines?

- **Stable hook input.** A hook that does, say, redaction with line-anchored regex (`^SECRET:.*$`) needs whole lines.
  Feeding it a half line (`SEC`) then later `RET:...` would mis-match. Lines are the natural transformation unit for
  text filters (think `grep`/`sed`).
- **Idempotent re-display.** The renderer shows `flushedOffset` bytes of transformed text plus the raw partial tail; a
  line boundary guarantees the transformed prefix and the raw suffix never disagree on a partial token.
- **Fewer flushes than per-token, more responsive than per-message.** Lines arrive frequently enough to feel live but
  are far coarser than tokens, slashing hook invocations.

### Why does the final flush get to end mid-line?

A model response often ends without a trailing newline. If the final flush still required a newline, the last line of
every message would never be transformed (and would be shown raw, bypassing the hook). The `isFinal` branch takes
`raw.length` so the tail is always transformed before the message lands. The cost — the hook may see a partial-looking
last line — is acceptable because it is genuinely the end of the message.

---

## Algorithm 2 — Debounce scheduler (`scheduleFlush` / `O`)

```javascript
// ============================================
// scheduleFlush - Debounced flush trigger (100ms window, gated by cap + completeness)
// Location: cli_inner_pretty.js:627007-627030
// ============================================

// ORIGINAL (for source lookup):
function O(j) {
  if (j.flushTimer !== null) return;
  if (j.inFlight >= YW9) return;
  if (
    j.raw.lastIndexOf(`\n`) +
      1 <=
    j.flushedOffset
  )
    return;
  let D = Date.now() - j.lastFlushAt;
  if (D >= AW9) {
    f(j, !1);
    return;
  }
  j.flushTimer = setTimeout(
    (J, X) => {
      if (((J.flushTimer = null), !J.finalized && !J.abandoned)) X(J, !1);
    },
    AW9 - D,
    j,
    f,
  );
}

// READABLE (for understanding):
function scheduleFlush(turn) {
  if (turn.flushTimer !== null) return;            // already scheduled
  if (turn.inFlight >= maxInFlight) return;        // at the cap; a finishing pass re-drives us
  // No new COMPLETE line since the last flush → nothing to schedule.
  if (turn.raw.lastIndexOf("\n") + 1 <= turn.flushedOffset) return;

  const sinceLastFlush = Date.now() - turn.lastFlushAt;
  if (sinceLastFlush >= flushIntervalMs) {
    flushWholeLines(turn, false);                  // window elapsed → flush immediately
    return;
  }
  // Otherwise wait out the remainder of the 100ms window, then flush.
  turn.flushTimer = setTimeout(
    (t, flush) => {
      t.flushTimer = null;
      if (!t.finalized && !t.abandoned) flush(t, false);
    },
    flushIntervalMs - sinceLastFlush,
    turn,
    flushWholeLines,
  );
}

// Mapping: O→scheduleFlush, j/J→turn, D→sinceLastFlush, X→flush(=flushWholeLines),
//          AW9→flushIntervalMs, YW9→maxInFlight, f→flushWholeLines
```

### How it works

`delta` (cli_inner_pretty.js:627067-627070) appends the new text to `raw` and calls `scheduleFlush`. The scheduler is
a *leading-then-trailing* debounce keyed on `lastFlushAt`:

- If 100 ms have already elapsed since the last flush, flush **now** (low latency for the first line of a fresh burst).
- Otherwise arm a timer for the *remaining* time in the window, so a rapid burst of deltas collapses into one flush at
  the window edge.

Three early-outs make it cheap to call on every delta:
1. A timer is already pending → no-op.
2. At the in-flight cap → no-op (the finishing pass will re-drive).
3. **No new complete line** (`raw.lastIndexOf("\n")+1 <= flushedOffset`) → no-op. This is the same boundary
   `flushWholeLines` uses; it avoids arming a timer that would flush an empty chunk.

The timer callback re-checks `!finalized && !abandoned` before flushing, because `finalize`/`newTurn` could have fired
during the 100 ms wait (`finalize` does its own final flush; `abandon` aborts).

### Constants

```javascript
// ============================================
// Engine tuning constants
// Location: cli_inner_pretty.js:627128-627139
// ============================================

// ORIGINAL (for source lookup):
var HR$,
  Xxz = 10,
  AW9,
  YW9 = 3,
  fW9 = 1e4;
var e5q = T(() => {
  ...
  ((HR$ = require("crypto")), (AW9 = 1000 / Xxz));
});

// READABLE (for understanding):
let crypto;
const flushesPerSecond = 10;            // Xxz
let flushIntervalMs;                    // AW9 — computed lazily below
const maxInFlight = 3;                  // YW9
const messageDisplayTimeoutMs = 1e4;    // fW9 — 10s per-flush hook timeout
// at module init:
crypto = require("crypto");
flushIntervalMs = 1000 / flushesPerSecond;   // = 100ms

// Mapping: Xxz→flushesPerSecond, AW9→flushIntervalMs, YW9→maxInFlight,
//          fW9→messageDisplayTimeoutMs, HR$→crypto
```

`flushIntervalMs` is expressed as `1000 / flushesPerSecond` rather than a bare `100` — the author frames the cadence as
"at most 10 flushes/sec," which is the meaningful budget knob (cli_inner_pretty.js:627129, 627139).

---

## Algorithm 3 — Dispatch + ordered append + error fallback (`dispatchFlush` / `A`)

This is where a flushed chunk is run through the hook pipeline and where the engine guarantees **order despite
concurrency**.

```javascript
// ============================================
// dispatchFlush - Run one MessageDisplay hook pass; append result in order; fall back on error
// Location: cli_inner_pretty.js:626938-626976
// ============================================

// ORIGINAL (for source lookup):
function A(j, w, D, J) {
  j.inFlight++;
  let X = Date.now(),
    L = (async () => {
      let P = J;
      try {
        for await (let Z of l6$(
          { turnId: j.turnId, messageId: j.messageId, index: w, final: D, delta: J },
          H,
          j.abortController.signal,
          fW9,
        )) {
          if (
            Z.message?.type === "attachment" &&
            (Z.message.attachment.type === "hook_non_blocking_error" ||
              Z.message.attachment.type === "hook_cancelled")
          )
            j.stats.errorCount++;
          if (Z.displayContent !== void 0) P = Z.displayContent;
        }
      } catch (Z) {
        (j.stats.errorCount++,
          N(
            `MessageDisplay hook flush ${w} failed; displaying original delta: ${Z instanceof Error ? Z.message : String(Z)}`,
            { level: "error" },
          ));
      } finally {
        let Z = Date.now() - X;
        ((j.stats.totalDurationMs += Z),
          (j.stats.maxDurationMs = Math.max(j.stats.maxDurationMs, Z)),
          j.inFlight--,
          Y(j));
      }
      return P;
    })();
  j.appendChain = j.appendChain.then(async () => {
    ((j.output += await L), z(j));
  });
}

// READABLE (for understanding):
function dispatchFlush(turn, flushIndex, isFinal, delta) {
  turn.inFlight++;
  const startedAt = Date.now();

  // Kick off the hook pass immediately (do NOT await here — passes may race).
  const transformedPromise = (async () => {
    let result = delta;                  // FALLBACK: original delta if the hook yields nothing/errors
    try {
      for await (const yielded of executeMessageDisplayHooks(
        { turnId: turn.turnId, messageId: turn.messageId, index: flushIndex, final: isFinal, delta },
        getAppState,
        turn.abortController.signal,
        messageDisplayTimeoutMs,
      )) {
        if (
          yielded.message?.type === "attachment" &&
          (yielded.message.attachment.type === "hook_non_blocking_error" ||
            yielded.message.attachment.type === "hook_cancelled")
        )
          turn.stats.errorCount++;
        if (yielded.displayContent !== undefined) result = yielded.displayContent; // last write wins
      }
    } catch (e) {
      turn.stats.errorCount++;
      logForDebugging(
        `MessageDisplay hook flush ${flushIndex} failed; displaying original delta: ${errMsg(e)}`,
        { level: "error" },
      );
      // result stays = delta → the raw text is shown unmodified.
    } finally {
      const elapsed = Date.now() - startedAt;
      turn.stats.totalDurationMs += elapsed;
      turn.stats.maxDurationMs = Math.max(turn.stats.maxDurationMs, elapsed);
      turn.inFlight--;
      maybeEmitSummary(turn);            // re-drive scheduler / emit telemetry when drained
    }
    return result;
  })();

  // ORDER GUARANTEE: append into output through a single serial promise chain.
  // Even if flush #2 resolves before flush #1, output is assembled #1 then #2.
  turn.appendChain = turn.appendChain.then(async () => {
    turn.output += await transformedPromise;
    emit(turn);                          // push the new output to the renderer
  });
}

// Mapping: A→dispatchFlush, j→turn, w→flushIndex, D→isFinal, J→delta, X→startedAt,
//          L→transformedPromise, P→result, Z→yielded/e/elapsed, l6$→executeMessageDisplayHooks,
//          H→getAppState, fW9→messageDisplayTimeoutMs, N→logForDebugging, Y→maybeEmitSummary, z→emit
```

### The two-phase structure (concurrent work, serial assembly)

The function does **two** things that must not be conflated:

1. **Phase A — run the hook (concurrent).** `transformedPromise` starts immediately, not awaited. Up to
   `maxInFlight` = 3 of these run at once. This is what lets a burst of three completed lines be transformed in
   parallel instead of strictly serially.
2. **Phase B — append in order (serial).** `appendChain = appendChain.then(...)` is a classic promise-chain
   serializer. Each flush links onto the previous link's resolution, so `output` is always assembled
   `chunk0 + chunk1 + chunk2 ...` *in flush-index order* regardless of which `transformedPromise` resolved first.

```
 flush #0  ┐ run hook (race) ─┐
 flush #1  ┤ run hook (race) ─┤      appendChain:
 flush #2  ┘ run hook (race) ─┘        Promise.resolve()
                                        .then(+= await p0; emit)   ← strictly ordered
                                        .then(+= await p1; emit)
                                        .then(+= await p2; emit)
```

### Error / timeout fallback — why "show the original delta"

`result` is initialized to the raw `delta`. The hook pipeline `executeMessageDisplayHooks` (`l6$`) only overrides it
when it yields `displayContent`. Two failure modes both leave `result === delta`:

- **Throw / abort** — caught at cli_inner_pretty.js:626958-626963, which bumps `errorCount` and logs
  `"MessageDisplay hook flush N failed; displaying original delta: ..."`.
- **Timeout** — the pipeline is given `messageDisplayTimeoutMs` = 10 s (cli_inner_pretty.js:626948, 627132); on timeout
  it yields a `hook_cancelled`/`hook_non_blocking_error` attachment (counted) and no `displayContent`, so the original
  delta survives.

This is the central robustness decision: **a display hook is a cosmetic transform; it must never be able to lose or
corrupt the model's text.** Failing open (show the original) is strictly safer than failing closed (blank the line).

---

## Lifecycle bookkeeping (`maybeEmitSummary` / `Y`) and telemetry

```javascript
// ============================================
// maybeEmitSummary - Post-flush bookkeeping; emit telemetry when finalized + drained
// Location: cli_inner_pretty.js:626977-626992
// ============================================

// ORIGINAL (for source lookup):
function Y(j) {
  if (j.abandoned) return;
  if (j.finalized) {
    if (!j.finalDispatched) f(j, !0);
    else if (j.inFlight === 0 && !j.stats.summaryEmitted)
      ((j.stats.summaryEmitted = !0),
        d("tengu_message_display_hooks", {
          flushCount: j.index,
          errorCount: j.stats.errorCount,
          totalDurationMs: j.stats.totalDurationMs,
          maxDurationMs: j.stats.maxDurationMs,
        }));
    return;
  }
  O(j);
}

// READABLE (for understanding):
function maybeEmitSummary(turn) {
  if (turn.abandoned) return;
  if (turn.finalized) {
    if (!turn.finalDispatched) {
      flushWholeLines(turn, true);       // the final flush was deferred by the cap → do it now
    } else if (turn.inFlight === 0 && !turn.stats.summaryEmitted) {
      turn.stats.summaryEmitted = true;  // emit-once guard
      telemetry("tengu_message_display_hooks", {
        flushCount: turn.index,
        errorCount: turn.stats.errorCount,
        totalDurationMs: turn.stats.totalDurationMs,
        maxDurationMs: turn.stats.maxDurationMs,
      });
    }
    return;
  }
  scheduleFlush(turn);                    // still streaming → keep the flush cadence going
}

// Mapping: Y→maybeEmitSummary, j→turn, f→flushWholeLines, O→scheduleFlush, d→telemetry
```

`maybeEmitSummary` is called from every flush's `finally`. It is the engine's "what next?" hub:

- **Still streaming** → re-arm `scheduleFlush`. This is how a flush that bailed at the in-flight cap gets retried as
  soon as a slot frees.
- **Finalized but final flush deferred** (`!finalDispatched`) — the final flush could not run earlier because the cap
  was full; run it now.
- **Finalized and fully drained** (`inFlight === 0`) — emit the once-per-message telemetry
  `tengu_message_display_hooks` (cli_inner_pretty.js:626983-626988) carrying `flushCount` (= number of flush indices),
  `errorCount`, cumulative `totalDurationMs`, and `maxDurationMs`. The `summaryEmitted` flag guarantees exactly one
  emit even though several passes may drain in the same tick.

### `finalize`, `entryLanded`, `newTurn`, `abandonTurn`

```javascript
// ============================================
// finalize / entryLanded / newTurn - End-of-message + turn-boundary lifecycle
// Location: cli_inner_pretty.js:627036-627082
// ============================================

// ORIGINAL (for source lookup):
newTurn() {
  if (_ && !_.finalized) M(_);
  ((_ = null), (K = HR$.randomUUID()));
},
...
entryLanded(j) {
  let w = _;
  if (w === null || w.apiMessageId !== j.message.id) return;
  if (w.raw === "" || !j.message.content.some((D) => D.type === "text")) return;
  ((w.done = !0), z(w), $(""));
},
finalize() {
  let j = _;
  if (j === null) return;
  if (((j.finalized = !0), (_ = null), $(null), j.raw === "" && j.index === 0)) return;
  ((j.done = !0), f(j, !0), z(j));
},

// READABLE (for understanding):
newTurn() {
  // A new user prompt starts a fresh turn. Abandon any still-streaming turn and roll turnId.
  if (currentTurn && !currentTurn.finalized) abandonTurn(currentTurn);
  currentTurn = null;
  turnId = crypto.randomUUID();
},

entryLanded(landed) {
  // The assistant message has been committed to the transcript.
  const turn = currentTurn;
  if (turn === null || turn.apiMessageId !== landed.message.id) return;
  // Nothing streamed, or no text block → nothing to display-transform.
  if (turn.raw === "" || !landed.message.content.some((b) => b.type === "text")) return;
  turn.done = true;       // mark for completed-message emit
  emit(turn);             // flush current transformed output to displayedMessageContent
  onStreamingDisplay(""); // clear the streaming overlay
},

finalize() {
  // message_stop: no more deltas are coming.
  const turn = currentTurn;
  if (turn === null) return;
  turn.finalized = true;
  currentTurn = null;
  onStreamingDisplay(null);                 // tear down streaming overlay
  if (turn.raw === "" && turn.index === 0) return;  // empty message → no work
  turn.done = true;
  flushWholeLines(turn, true);              // final flush: whole buffer, may end mid-line
  emit(turn);
},

// Mapping: M→abandonTurn, _→currentTurn, K→turnId, j/w→turn, $→onStreamingDisplay,
//          z→emit, f→flushWholeLines, HR$→crypto
```

```javascript
// ============================================
// abandonTurn - Cancel an in-flight turn (superseded / new prompt)
// Location: cli_inner_pretty.js:627031-627034
// ============================================

// ORIGINAL (for source lookup):
function M(j) {
  if (((j.abandoned = !0), j.flushTimer !== null)) (clearTimeout(j.flushTimer), (j.flushTimer = null));
  j.abortController.abort();
}

// READABLE (for understanding):
function abandonTurn(turn) {
  turn.abandoned = true;                   // makes emit() a no-op and short-circuits the scheduler
  if (turn.flushTimer !== null) {
    clearTimeout(turn.flushTimer);
    turn.flushTimer = null;
  }
  turn.abortController.abort();            // cancel any in-flight hook subprocesses
}

// Mapping: M→abandonTurn, j→turn
```

`abandoned` is checked at the top of `emit` (`z`, cli_inner_pretty.js:626934) and `maybeEmitSummary` (`Y`,
cli_inner_pretty.js:626978), so once a turn is abandoned no further output reaches the renderer and the abort signal
unwinds any hook that is mid-flight.

### The `emit` dispatcher (`z`)

```javascript
// ============================================
// emit - Route engine output to the renderer (streaming vs completed)
// Location: cli_inner_pretty.js:626933-626937
// ============================================

// ORIGINAL (for source lookup):
function z(j) {
  if (j.abandoned) return;
  if (j.done) q(j.apiMessageId, j.output);
  else $(j.output);
}

// READABLE (for understanding):
function emit(turn) {
  if (turn.abandoned) return;
  if (turn.done) {
    // Completed message: persist the transformed text keyed by server message id.
    onMessageDisplay(turn.apiMessageId, turn.output);
  } else {
    // Still streaming: push to the live overlay.
    onStreamingDisplay(turn.output);
  }
}

// Mapping: z→emit, j→turn, q→onMessageDisplay, $→onStreamingDisplay
```

---

## ASCII state diagram — begin → delta* → finalize

```
                         newTurn()                      newTurn()/begin() (supersede)
                   ┌────────────────┐                ┌────────────────────────────┐
                   ▼                │                ▼                            │
   ┌──────┐ begin() ┌──────────┐ delta(t)  ┌─────────────┐  (cap full)  ┌─────────────┐
   │ IDLE │────────▶│ STREAMING│──────────▶│ raw += t    │─────────────▶│ DEFERRED    │
   └──────┘ (hook   └──────────┘           │ scheduleFlush│              │ (retry on   │
            present?)     ▲                 └─────┬───────┘              │ slot free)  │
                │ no      │                       │ 100ms / now          └──────┬──────┘
                ▼         │                       ▼                             │
            (transform   │                 flushWholeLines(false)               │
             disabled,   │                 slice on last "\n"                   │
             $(null))    │                 dispatchFlush ──▶ l6$ hook ──┐       │
                         │                                              │       │
                         └─────────── appendChain (ordered) ◀──────────┘       │
                                                                               │
   message_stop ─▶ finalize()                                                  │
                     │ finalized=true                                          │
                     ▼                                                         │
              flushWholeLines(true)  ── whole buffer (may end mid-line) ──▶ dispatchFlush
                     │
                     ▼ inFlight==0
              ┌──────────────┐  emit telemetry tengu_message_display_hooks
              │  FINALIZED   │  {flushCount,errorCount,totalDurationMs,maxDurationMs}
              └──────────────┘
                     │ entryLanded(msg): done=true → onMessageDisplay(apiMessageId, output)
                     ▼
                  COMPLETED  ─────────────────────────▶ displayedMessageContent[apiMessageId]
```

Timing of a 3-line burst arriving within 100 ms (`maxInFlight` not hit):

```
 t=0ms   delta "lineA\n"  → scheduleFlush: sinceLast≥100 → flush#0 NOW (lineA\n)
 t=20ms  delta "lineB\n"  → scheduleFlush: sinceLast<100 → arm timer @ +80ms
 t=40ms  delta "lineC\n"  → timer already armed → no-op (coalesced)
 t=100ms timer fires       → flush#1 (lineB\nlineC\n)     ← two lines in ONE hook pass
```

---

## Completed-message rewrite path (`rewriteCompletedMessage` / `MW9`)

The streaming engine only runs for messages that actually stream through `begin/delta/finalize`. Messages that arrive
**already complete** — resumed sessions, replayed transcripts, non-streaming SDK responses — go through a separate,
synchronous-style path invoked in the assistant-message handler at cli_inner_pretty.js:637921.

```javascript
// ============================================
// rewriteCompletedMessage - One-shot MessageDisplay transform for non-streamed assistant messages
// Location: cli_inner_pretty.js:627097-627127
// ============================================

// ORIGINAL (for source lookup):
async function MW9(H, $, q, K) {
  if (!wk("MessageDisplay", q(), E$())) return H;
  let _ = H.message.content.map((Y) => (Y.type === "text" ? Y.text : "")).join("");
  if (_ === "") return H;
  let z;
  try {
    for await (let Y of l6$({ turnId: $, messageId: HR$.randomUUID(), index: 0, final: !0, delta: _ }, q, K, fW9))
      if (Y.displayContent !== void 0) z = Y.displayContent;
  } catch (Y) {
    return (
      N(`MessageDisplay hook failed for completed message; emitting original text: ${...}`, { level: "error" }),
      H
    );
  }
  if (z === void 0) return H;
  let A = !0;
  return {
    ...H,
    message: {
      ...H.message,
      content: H.message.content.map((Y) => {
        if (Y.type !== "text") return Y;
        let f = A ? z : "";
        return ((A = !1), { ...Y, text: f });
      }),
    },
  };
}

// READABLE (for understanding):
async function rewriteCompletedMessage(assistantMsg, turnId, getAppState, signal) {
  if (!hasHooksForEvent("MessageDisplay", getAppState(), getSessionId())) return assistantMsg;

  // Concatenate all text blocks into a single delta.
  const fullText = assistantMsg.message.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");
  if (fullText === "") return assistantMsg;

  let displayContent;
  try {
    for await (const yielded of executeMessageDisplayHooks(
      { turnId, messageId: crypto.randomUUID(), index: 0, final: true, delta: fullText },
      getAppState, signal, messageDisplayTimeoutMs,
    ))
      if (yielded.displayContent !== undefined) displayContent = yielded.displayContent;
  } catch (e) {
    logForDebugging(`MessageDisplay hook failed for completed message; emitting original text: ${errMsg(e)}`,
      { level: "error" });
    return assistantMsg;                  // FALLBACK: original message unchanged
  }
  if (displayContent === undefined) return assistantMsg;  // hook opted not to transform

  // Put ALL transformed text into the FIRST text block; blank the rest.
  let firstTextBlock = true;
  return {
    ...assistantMsg,
    message: {
      ...assistantMsg.message,
      content: assistantMsg.message.content.map((b) => {
        if (b.type !== "text") return b;
        const text = firstTextBlock ? displayContent : "";
        firstTextBlock = false;
        return { ...b, text };
      }),
    },
  };
}

// Mapping: MW9→rewriteCompletedMessage, H→assistantMsg, $→turnId, q→getAppState, K→signal,
//          _→fullText, z→displayContent, A→firstTextBlock, l6$→executeMessageDisplayHooks,
//          wk→hasHooksForEvent, E$→getSessionId, N→logForDebugging, HR$→crypto, fW9→messageDisplayTimeoutMs
```

### Key differences vs the streaming engine

- **It rewrites the message itself**, not an app-state override. At cli_inner_pretty.js:637921-637923 the handler does
  `const rewritten = await rewriteCompletedMessage(msg, ...); if (rewritten !== msg) renderedMap.set(msg, rewritten);`.
  Because the message did not stream, there is no `apiMessageId → displayedMessageContent` entry to consult; the
  transformed text must live on the rendered message object.
- **All text → first block.** A streaming response is one logical text run; collapsing every text block into the first
  and blanking the rest preserves "one transformed body" semantics and avoids re-running the hook per block.
- **Same fail-open contract.** Throw → original message; no `displayContent` → original message. Identical safety
  posture to the streaming path.

---

## Renderer wiring

### Engine construction and the two callbacks

```javascript
// ============================================
// MessageDisplay engine wiring - construct OW9 with renderer callbacks
// Location: cli_inner_pretty.js:628561-628577
// ============================================

// ORIGINAL (for source lookup):
let ky = w8.useMemo(
    () =>
      OW9({
        getAppState: () => MH.getState(),
        onStreamingDisplay: (Z$) => {
          if (!Em.current) return;
          Ln(Z$);
        },
        onMessageDisplay: (Z$, $8) =>
          qH((G8) =>
            G8.displayedMessageContent[Z$] === $8
              ? G8
              : { ...G8, displayedMessageContent: { ...G8.displayedMessageContent, [Z$]: $8 } },
          ),
      }),
    [MH, qH],
  ),

// READABLE (for understanding):
const displayTransform = useMemo(
  () =>
    createMessageDisplayEngine({
      getAppState: () => appStateStore.getState(),
      // Streaming overlay: set local React state Ln (rendered while the message streams).
      onStreamingDisplay: (text) => {
        if (!streamingActiveRef.current) return;
        setStreamingDisplay(text);          // Ln
      },
      // Completed override: write into the app-state displayedMessageContent map.
      onMessageDisplay: (apiMessageId, text) =>
        setAppState((s) =>
          s.displayedMessageContent[apiMessageId] === text
            ? s                              // identity short-circuit (no re-render)
            : { ...s, displayedMessageContent: { ...s.displayedMessageContent, [apiMessageId]: text } },
        ),
    }),
  [appStateStore, setAppState],
);

// Mapping: ky→displayTransform, OW9→createMessageDisplayEngine, MH→appStateStore,
//          Ln→setStreamingDisplay, qH→setAppState, Z$→apiMessageId/text, $8→text,
//          G8→appState, Em→streamingActiveRef
```

There are two distinct outputs because there are two distinct render paths:

- **`onStreamingDisplay` → `Ln`** is *transient local state*. While the message is streaming, the component shows
  `streamingDisplay ?? rawStreamingText` (cli_inner_pretty.js:628578, where `es = streaming ? (ts ?? Xn) : null`).
  `Xn` is the raw model text trimmed to its last newline (cli_inner_pretty.js:628550-628557) — so even before the first
  transformed flush lands, the user sees the raw whole-line prefix, never a frozen blank.
- **`onMessageDisplay` → `displayedMessageContent`** is *durable app state* keyed by `apiMessageId`, consulted when the
  message is rendered as a committed transcript entry. The identity short-circuit (`=== text` returns the same state
  object) prevents redundant re-renders when a flush produces no change.

### The render-side substitution

```javascript
// ============================================
// Render substitution - apply displayedMessageContent override to a text block
// Location: cli_inner_pretty.js:394840-394846
// ============================================

// ORIGINAL (for source lookup):
if ($[0] !== G || $[1] !== q.type)
  ((v = (S) => (q.type === "text" && G !== void 0 ? S.displayedMessageContent[G] : void 0)),
    ($[0] = G),
    ($[1] = q.type),
    ($[2] = v));
else v = $[2];
let E = mT(v);
switch (q.type) {
  ...
  case "text": {
    if (E !== void 0 && !A) {
      ...
      if ($[29] !== E) ((h = { type: "text", text: E }), ($[29] = E), ($[30] = h));
      ...

// READABLE (for understanding):
// memo-cache the selector keyed by (apiMessageId, blockType)
if (cache[0] !== apiMessageId || cache[1] !== block.type) {
  selectOverride = (appState) =>
    block.type === "text" && apiMessageId !== undefined
      ? appState.displayedMessageContent[apiMessageId]   // the hook-transformed text, or undefined
      : undefined;
  cache[0] = apiMessageId; cache[1] = block.type; cache[2] = selectOverride;
} else selectOverride = cache[2];

const overrideText = useAppStateSelector(selectOverride);   // mT(v)
switch (block.type) {
  case "text": {
    if (overrideText !== undefined && !verbose) {           // verbose mode shows raw text
      // render the OVERRIDE text instead of block.text
      const overriddenBlock = { type: "text", text: overrideText };
      ...
    }
    // else fall through to render the original block.text
  }
}

// Mapping: G→apiMessageId, q→block, v→selectOverride, mT→useAppStateSelector, E→overrideText,
//          A→verbose, S→appState
```

The substitution is **purely at the render layer**: only `block.text` shown on screen changes. The stored transcript
block and the message the model later sees are untouched. Note `!verbose` (cli_inner_pretty.js:394898): in verbose mode
the override is bypassed and the genuine model text is shown — exactly what you want for a "hide/redact" hook when the
operator deliberately asks to see raw output.

---

## State pruning (`pruneDisplayedMessageContent` / `t5q`)

`displayedMessageContent` is keyed by message id and would otherwise grow forever as messages scroll out, are
truncated, or are removed by compaction. `pruneDisplayedMessageContent` garbage-collects it against the live message
list.

```javascript
// ============================================
// pruneDisplayedMessageContent - Drop overrides for messages no longer present
// Location: cli_inner_pretty.js:627085-627096
// ============================================

// ORIGINAL (for source lookup):
function t5q(H, $) {
  if (Object.keys(H.displayedMessageContent).length === 0) return H;
  let q = new Set();
  for (let z of $) if (z.type === "assistant") q.add(z.message.id);
  let K = {},
    _ = !1;
  for (let [z, A] of Object.entries(H.displayedMessageContent))
    if (q.has(z)) K[z] = A;
    else _ = !0;
  if (!_) return H;
  return { ...H, displayedMessageContent: K };
}

// READABLE (for understanding):
function pruneDisplayedMessageContent(appState, messages) {
  if (Object.keys(appState.displayedMessageContent).length === 0) return appState; // nothing to prune
  const liveIds = new Set();
  for (const m of messages) if (m.type === "assistant") liveIds.add(m.message.id);

  const kept = {};
  let droppedAny = false;
  for (const [id, text] of Object.entries(appState.displayedMessageContent)) {
    if (liveIds.has(id)) kept[id] = text;
    else droppedAny = true;
  }
  if (!droppedAny) return appState;          // identity if nothing changed (avoid re-render)
  return { ...appState, displayedMessageContent: kept };
}

// Mapping: t5q→pruneDisplayedMessageContent, H→appState, $→messages, q→liveIds, K→kept, _→droppedAny
```

It is called wherever the message list shrinks or is rebuilt:
- After a tombstone/replace-all rebuild (cli_inner_pretty.js:629251).
- On a rewind/truncate-from operation (cli_inner_pretty.js:630927).
- And the whole map is wiped wholesale on `/clear` and on a new `session_start` reset (cli_inner_pretty.js:456620-456628,
  alongside `storedImagePaths`/`imageDescriptions`).

Two design choices stand out: the **identity short-circuit** (`!droppedAny → return appState`) keeps React from
re-rendering when nothing was pruned, and pruning keys off **assistant `message.id`** specifically (only assistant text
is display-transformed). The `newTurn()` call at cli_inner_pretty.js:629465 also resets the engine itself (`turnId`
rolls, any in-flight turn is abandoned) so display state never leaks across user turns.

---

## Why this overall design

### Why an opt-in engine (gated by `hasHooksForEvent`)?

`begin` (cli_inner_pretty.js:627042) and `rewriteCompletedMessage` (cli_inner_pretty.js:627098) both early-out via
`hasHooksForEvent("MessageDisplay", ...)` (`wk`, cli_inner_pretty.js:552979-552990). With no MessageDisplay hook
configured, the engine allocates nothing, spawns nothing, and `onStreamingDisplay(null)` tells the renderer to fall
straight through to raw text. The feature is therefore **zero-cost when unused** — important because the hot path is
per-message streaming.

### Why whole-line + debounce + in-flight cap together?

Each guards a different failure mode of the naive "run the hook per token" design:

| Mechanism | Without it | With it |
|---|---|---|
| Whole-line flush | hook sees partial lines → broken line-anchored transforms; thrash on every token | hook sees complete, stable lines |
| Debounce (100 ms) | one hook spawn per delta = process storm on fast streams | ≤ 10 flushes/sec, bursts coalesced |
| In-flight cap (3) | a slow hook + fast stream = unbounded concurrent subprocesses | bounded concurrency, natural back-pressure |

(That is the only table in this doc — a justification matrix, not a symbol map.)

### Why fail open to the original delta?

A display hook is *cosmetic*. The contract is: it can recolor/redact/hide on-screen text, but it can never lose the
model's words. Every failure path — `dispatchFlush` catch (cli_inner_pretty.js:626958-626963), timeout via
`messageDisplayTimeoutMs`, `rewriteCompletedMessage` catch (cli_inner_pretty.js:627105-627113), and "hook yielded no
`displayContent`" — resolves to *show the original*. A misbehaving hook degrades to a plain (un-transformed) display,
never to a blank or hung UI.

### Why preserve order with a promise chain instead of just awaiting?

Awaiting each flush before starting the next would serialize hook execution and defeat the in-flight cap (which would
then never exceed 1). The split — race the hooks (`transformedPromise`), serialize the assembly (`appendChain`) — gets
both parallel throughput *and* deterministic `output` ordering. This is the single cleverest part of the engine.

---

## Telemetry

`tengu_message_display_hooks` (cli_inner_pretty.js:626983-626988) is emitted **once per streamed message**, only when a
MessageDisplay hook was active, and only after the turn finalizes and fully drains (`inFlight === 0`,
`summaryEmitted` guard). Payload:

- `flushCount` — `turn.index`, the number of flush passes (lines/bursts) dispatched.
- `errorCount` — failed/cancelled flushes (throw, timeout, or `hook_non_blocking_error`/`hook_cancelled` attachments).
- `totalDurationMs` — summed wall time across all flush passes (overlaps, so this can exceed real elapsed time).
- `maxDurationMs` — the slowest single flush, the signal that actually predicts perceived lag.

Per-invocation hook telemetry is suppressed inside the pipeline (`suppressPerInvocationTelemetry: !0`,
cli_inner_pretty.js:551743) precisely so the engine can emit one rolled-up summary instead of N noisy events per message.

---

## The hook pipeline driver (`executeMessageDisplayHooks` / `l6$`)

Each flush — streaming or completed — funnels into the same generator, which builds the `MessageDisplay` hook input and
delegates to the generic hook executor `QL`.

```javascript
// ============================================
// executeMessageDisplayHooks - Build MessageDisplay hook input and run the hook pipeline
// Location: cli_inner_pretty.js:551726-551745
// ============================================

// ORIGINAL (for source lookup):
async function* l6$(H, $, q, K = q_) {
  let _ = {
    ...w5(void 0),
    hook_event_name: "MessageDisplay",
    turn_id: H.turnId,
    message_id: H.messageId,
    index: H.index,
    final: H.final,
    delta: H.delta,
  };
  yield* QL({
    hookInput: _,
    toolUseID: `${H.messageId}-${H.index}`,
    signal: q,
    timeoutMs: K,
    getAppState: $,
    forceSyncExecution: !0,
    suppressPerInvocationTelemetry: !0,
  });
}

// READABLE (for understanding):
async function* executeMessageDisplayHooks(args, getAppState, signal, timeoutMs = DEFAULT_HOOK_TIMEOUT) {
  const hookInput = {
    ...baseHookInput(undefined),
    hook_event_name: "MessageDisplay",
    turn_id: args.turnId,                 // stable per user-turn
    message_id: args.messageId,           // per assistant message
    index: args.index,                    // flush index within the message
    final: args.final,                    // is this the final flush?
    delta: args.delta,                    // the (whole-line) text chunk
  };
  yield* runHookPipeline({
    hookInput,
    toolUseID: `${args.messageId}-${args.index}`,
    signal,
    timeoutMs,
    getAppState,
    forceSyncExecution: true,             // run inline — display can't lag behind hook scheduling
    suppressPerInvocationTelemetry: true, // engine emits one rolled-up summary instead
  });
}

// Mapping: l6$→executeMessageDisplayHooks, QL→runHookPipeline, w5→baseHookInput,
//          q_→DEFAULT_HOOK_TIMEOUT, H→args, $→getAppState, q→signal, K→timeoutMs
```

The hook contract: the hook may yield a `displayContent` string (the transformed text for this flush) and/or emit
`hook_non_blocking_error` / `hook_cancelled` attachments. `MessageDisplay` is also registered in the canonical hook
event-name list (cli_inner_pretty.js:49289), confirming it is a first-class hook event.

---

## Cross-validation against v2.1.88 — confidence

**High confidence this is net-new after v2.1.88.** Evidence:

1. `grep MessageDisplay|displayTransform|displayedMessageContent|displayContent` over
   `/lyz/codespace/3rd/claude-code/src/` returns **nothing** — none of the engine's surface exists in 2.1.88.
2. The 2.1.88 hook-event enum in `src/entrypoints/sdk/coreSchemas.ts` (lines 356-361 etc.) lists
   `PreToolUse`/`PostToolUse`/`SessionStart`/`Notification`/`UserPromptSubmit`/… but **no `MessageDisplay`**.
3. The app-state field `displayedMessageContent` and the React `displayTransform` wiring have no precursor.

The *surrounding* hook platform (the `QL`/`runHookPipeline` executor, the `hook_event_name` discriminated-union input
shape, `baseHookInput`) is the existing 2.1.88 architecture this feature plugs into — so the **mechanism is new, the
extension point is old**. This matches the module-11 summary: a net-new MessageDisplay event built on the prior
plug-in/schema architecture.

---

## Pre-completion notes

- All cited lines were read directly from `cli_inner_pretty.js`. Ranges quoted: 49285-49291, 241508-241521,
  394828-394905, 445120-445209, 456618-456631, 551726-551745, 552979-552990, 626920-627145, 628550-628589,
  628895-628919, 629245-629299, 629460-629469, 630920-630931, 637890-637939.
- No symbol mapping table appears in this module doc; the single table above is a design-rationale matrix. New symbols
  (`OW9`, `A`/`dispatchFlush`, `Y`/`maybeEmitSummary`, `f`/`flushWholeLines`, `O`/`scheduleFlush`, `M`/`abandonTurn`,
  `z`/`emit`, `t5q`, `MW9`, `l6$`, `AW9`, `Xxz`, `YW9`, `fW9`) belong in
  `00_overview/symbol_index_core_features.md` (Hooks).
