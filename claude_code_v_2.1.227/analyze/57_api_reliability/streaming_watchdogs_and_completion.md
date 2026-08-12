# Streaming watchdogs, protocol completion, and partial-output safety

`streamMessages` (`Z5p`) is not merely an SSE decoder. It coordinates request setup, raw transport
liveness, semantic stream progress, fallback protocol blocks, accounting, retry safety, and partial
response preservation. In 2.1.227, its most important invariant is that transport termination and
protocol completion are related but are not identical.

## State model

The stream loop tracks four different kinds of progress:

| State | Meaning | Why it matters |
|---|---|---|
| Raw response bytes | The socket or gateway is still sending data | Prevents keep-alive comments from being mistaken for a dead connection |
| Parsed stream event | The SSE/event-stream parser produced a protocol event | Re-arms semantic-progress warning and abort timers |
| Active content block | A `content_block_start` has not yet been closed | Distinguishes complete output from a truncated final block |
| Final message delta | A non-null `stop_reason` was observed | Proves the server declared a semantic end condition |

This separation is the foundation of the 2.1.222 custom-gateway and completed-response fixes.

## 1. Raw-byte to semantic-heartbeat bridge

### Synthetic heartbeat generation from wire activity

**What it does:** Converts raw body progress that produces no parsed model event into a bounded
heartbeat, allowing SSE comments or gateway keep-alives to demonstrate liveness.

**How it works:**
1. `createApiFetchWrapper` (`kxS`) installs a byte-watched `ReadableStream` on eligible SSE
   responses.
2. Every non-empty or empty body chunk read increments byte state and updates the shared
   `_chunkTimes.lastAt` timestamp.
3. `streamWithWireHeartbeats` (`LZb`) wraps the SDK async iterator and races each pending
   `iterator.next()` against a short heartbeat timer.
4. When the timer wins, it checks whether `_chunkTimes.lastAt` advanced since the previous check.
5. If bytes advanced but no parsed event arrived, it yields a synthetic `ping`; repeated synthetic
   pings are bounded until a real event resets the counter.
6. `streamMessages` treats a ping as a stream event, re-arms its event watchdog, and skips content
   mutation.
7. If neither bytes nor events advance, the wrappers remain silent and the appropriate watchdog can
   fire.

**Why this approach:**
- SSE keep-alive comments may be consumed below the model-event parser, so event-only liveness
  creates false timeouts.
- Treating all raw chunks as model events would pollute the transcript and parser state.
- A bounded synthetic-heartbeat count prevents an intermediary sending meaningless bytes forever
  from unconditionally defeating semantic progress detection.
- The trade-off is a second liveness clock and extra iterator race, but the clocks answer different
  questions and cannot safely be collapsed.

**Key insight:** The byte watchdog does not merely avoid firing itself; its timestamp is deliberately
lifted into the semantic stream loop. This is why custom gateway keep-alive traffic now counts even
when it is invisible to the SDK event decoder.

Evidence: `LZb` at `cli_inner_pretty.js:529270-529303`, `wxS` at `612164-612289`, and the ping path at
`530475-530558`. In 2.1.220, the raw-body wrapper existed, but the fetch gate at
`cli_inner_pretty.js:149994-150009` covered only its narrower first-party eligibility predicate.

## 2. Byte-level watchdog

### Suspend-aware response-body watchdog

**What it does:** Aborts a response body that has stopped delivering bytes, while distinguishing a
real network stall from a timer firing after the computer slept.

**How it works:**
1. `resolveByteStreamIdleTimeout` (`AxS`) starts from a provider/default timeout, honors explicit
   byte/stream timeout configuration, and clamps the result to 10 seconds through 30 minutes.
2. `wrapResponseBodyWithByteWatchdog` (`wxS`) obtains the original body reader and returns a new
   `ReadableStream` around it.
3. Each successful read records time-to-first-byte once, accumulates byte count, updates shared wire
   activity, and resets the idle timer.
4. Separate diagnostic timers log partial stalls at 15, 30, 60, and 120 seconds without changing the
   stream result.
5. At the deadline, the handler compares monotonic elapsed time with wall-clock elapsed time.
6. If the monotonic clock advanced by less than half the configured timeout, it infers suspend/sleep,
   errors the wrapper with `StreamSuspendedError`, and cancels the underlying reader.
7. Otherwise it emits a `StreamIdleTimeoutError` carrying timeout, total bytes, time to first byte,
   pending-read state, request/ray identifier, and inferred slept milliseconds.
8. Pull errors, normal EOF, and consumer cancellation all clear both timer families.

**Why this approach:**
- Wrapping `Response.body` observes bytes before SDK parsing, the only layer where comments and
  transport framing are reliably visible.
- Monotonic-versus-wall time separates network inactivity from laptop sleep; presenting both as
  “network stalled” would give the user the wrong remedy.
- Rich error fields make recovery and telemetry decisions possible without parsing a display string.
- Frequent timer reset adds modest overhead, but it is proportional to chunks rather than tokens or
  rendered messages.

**Key insight:** The watchdog measures both *how long the stream was idle* and *whether JavaScript had
an opportunity to run*. A late callback after suspend is not evidence that the server was silent for
the same duration.

Evidence: `s_a`, `AxS`, and `wxS` at `cli_inner_pretty.js:612144-612289`.

## 3. Event-level watchdog and stall status

### Event-progress warning, abort, and advisor grace

**What it does:** Detects a stream that is still connected but no longer producing usable protocol
events, while delaying the user-facing stall status during a legitimate advisor operation.

**How it works:**
1. Each streaming attempt resolves the event timeout to at least 300 seconds and enables the event
   watchdog by default unless `CLAUDE_ENABLE_STREAM_WATCHDOG=0`.
2. `armEventWatchdog` (nested `bd`) first clears old timers, clears stale UI status, and always arms
   the lightweight stall-status timer.
3. If watchdog aborts are enabled, it schedules a warning at half the event timeout and an abort at
   the full timeout.
4. Every real or synthetic stream event calls the arming function again.
5. The stall-status timer waits 20 seconds, then rechecks elapsed monotonic time so a suspend-delayed
   callback does not immediately show a false warning.
6. If raw `_chunkTimes.lastAt` advanced, it re-arms rather than showing “stalled.”
7. While an advisor tool is active, it grants a bounded grace period before exposing stall status.
8. On a genuine deadline, it records an event-tier timeout and aborts the active request; the catch
   path then applies the same partial-output safety rules as a byte timeout.

**Why this approach:**
- Raw byte activity proves transport liveness but does not prove model progress; an intermediary can
  keep a dead computation connected indefinitely.
- Warning at half-time provides diagnostics before destructive abort.
- Keeping the UI stall indicator independent from the abort switch preserves feedback even when a
  user disables automatic termination.
- Advisor work is legitimately quiet, so its bounded grace suppresses false alarms without granting
  an unlimited exemption.

**Key insight:** There are three policies, not one: UI stall indication, half-time diagnostics, and
full-time cancellation. Disabling event cancellation does not erase all visibility into a quiet
stream.

Evidence: nested `Ji`, `kl`, and `bd` in `Z5p` at `cli_inner_pretty.js:530140-530190`; per-attempt
resolution and re-arming at `530475-530558`.

## 4. Protocol accumulation

### Block lifecycle and final-marker tracking

**What it does:** Maintains enough explicit protocol state to distinguish a valid response, an empty
stream, an open/truncated content block, and a response that completed except for `message_stop`.

**How it works:**
1. `message_start` records the assistant message shell, first-event timing, model, and initial usage.
2. `content_block_start` clears the “final delta was last” marker, sets the active block index, and
   creates the correct accumulator for text, thinking, redacted thinking, tool use, or server-tool
   content.
3. Content deltas mutate the accumulator and yield normalized stream events while retaining message
   objects already emitted to consumers.
4. `content_block_stop` closes the matching accumulator and clears the active block index.
5. `message_delta` merges usage, stores `stop_reason`, propagates stop metadata into every emitted
   assistant message, and marks the final-delta state when the stop reason is non-null.
6. `message_stop` performs normal completion accounting and marks the attempt complete.
7. A stream ending without `message_start`, or with neither completed content nor a stop reason, is
   rejected and routed toward non-streaming fallback rather than accepted as an empty success.
8. Malformed or internal fallback blocks are tracked separately so they do not corrupt ordinary
   content block accounting.

**Why this approach:**
- Yielded assistant messages are mutable views of an in-progress response, so final usage and stop
  reason must be backfilled after later events arrive.
- Explicit active-block state is more reliable than inferring completeness from array length.
- Rejecting structurally empty streams catches proxies that return successful HTTP/SSE framing but
  no valid model response.
- The cost is a larger state machine, but it makes recovery decisions auditable and deterministic.

**Key insight:** `stop_reason !== null` is necessary but not sufficient for completion. The stream
also proves that no content block remains open and that no newer block start invalidated the final
marker.

Evidence: `Z5p` event switch at `cli_inner_pretty.js:530668-531066` and post-loop validation at
`531080-531119`.

## 5. 2.1.222 completed-response fix

### Completion-aware transport-close acceptance

**What it does:** Accepts a semantically complete response when the connection closes after the
final `message_delta` but before the redundant `message_stop` frame.

**How it works:**
1. A stream error is normalized into watchdog, server-error, suspend, network-down, or stale-
   connection cause.
2. The partial-output branch computes three completion facts: a non-null `stop_reason`, the final-
   delta marker is still set, and no content block remains active.
3. Only when all three are true does it log that the response was already complete.
4. It emits `tengu_streaming_close_after_complete` with cause, block count, and normalized error code.
5. It marks stream accounting as completed and exits the outer attempt loop.
6. It does not synthesize another stop reason, warn that output may be incomplete, or replay the
   request.
7. If any condition is false, handling falls through to thinking-only retry or partial finalization.

**Why this approach:**
- `message_stop` carries no new content after a final stop-bearing delta, so requiring it makes
  transport framing stronger than protocol semantics.
- Replaying an already complete answer risks duplicated tool calls or text.
- Accepting on stop reason alone would be unsafe if the last content block were still open.
- The three-part predicate is conservative: it repairs the exact false-positive close case while
  preserving truncation detection.

**Key insight:** The fix changes the definition of success from “saw the last envelope” to “proved
the semantic terminal state.” This is why the response can be complete even when the stream is not.

Evidence: `cli_inner_pretty.js:531280-531298`. The diagnostic string and
`tengu_streaming_close_after_complete` event are absent from 2.1.220.

## 6. Real partial failures

### Retry-or-finalize decision after output begins

**What it does:** Avoids both duplicating meaningful output and discarding useful partial output when
a stream genuinely fails.

**How it works:**
1. The catch path distinguishes stale/network errors, server stream errors, byte/event watchdogs,
   and explicit user abort.
2. Before meaningful output, it can retry the stream or fall back to non-streaming behavior under
   bounded attempt budgets.
3. Thinking-only output is treated as replay-safe because it has not exposed a user-visible answer
   or executable tool call; watchdog failures get one retry and stale closes get two.
4. Before retrying thinking-only output, the loop closes any open synthetic block/message framing,
   clears request identity, and reconstructs the attempt.
5. Once text, tool use, or another meaningful block has been yielded, the request is not replayed.
6. If any tool-use block exists, it synthesizes `tool_use`; otherwise it synthesizes `end_turn`.
7. It updates every emitted assistant message with final usage/stop reason and yields a warning that
   differentiates stall, server error, sleep, and connection loss.
8. Accounting is credited exactly once even when the normal terminal event was lost.

**Why this approach:**
- Retrying after a tool call was visible could execute an action twice.
- Dropping partial text wastes useful work and makes the transcript inconsistent with what the user
  saw.
- Thinking-only replay trades additional model cost for a cleaner user result without duplicating an
  external side effect.
- A synthesized stop reason is an approximation, but it preserves downstream invariants better than
  leaving messages permanently “streaming.”

**Key insight:** Replay safety is determined by the *kind of content already exposed*, not merely by
whether any SSE event was received.

Evidence: `cli_inner_pretty.js:531150-531352`.

## 7. Refusal fallback protocol

### Server-fallback materialization and client handoff

**What it does:** Converts server-side fallback metadata and refusal stop reasons into explicit
events that the outer agent loop can continue, confirm, suppress, or report without confusing the
fallback model's output with the refusing model's output.

**How it works:**
1. A `fallback` content block is shape-validated into source model, target model, reason, and optional
   refusal category.
2. Valid server fallback blocks change the effective model on the message objects and emit a
   `server_fallback` event.
3. On refusal-driven mid-stream fallback, non-text/tool-bearing messages from the refusing hop are
   discarded; retained text and retained message objects are reported explicitly.
4. Malformed fallback blocks are quarantined by block index, logged, and excluded from ordinary
   block-stop processing.
5. A final `message_delta` with `stop_reason: refusal` resolves the configured target or a bounded
   cascade route.
6. If a target exists, the stream yields `fallback_request` carrying original/target models,
   category, explanation, credit token, and cascade metadata, then returns.
7. The outer agent loop applies episode/depth/dialog policy before constructing the continuation; if
   no target is usable it yields `refusal_no_fallback` and a warning event.

**Why this approach:**
- A fallback changes attribution, accounting, and potentially user-consent requirements; silently
  swapping the model inside the decoder would hide those boundaries.
- Quarantining tool-bearing output from a refusing hop prevents an abandoned tool request from being
  executed after another model takes over.
- Explicit continuation events let interactive, headless, and Remote Control consumers apply their
  own dialog capabilities.
- The trade-off is substantial state and metadata, but it makes cross-model transitions observable
  and recoverable.

**Key insight:** Refusal fallback is not a retry of the same request. It is a typed handoff between
model hops, with retained/discarded transcript state carried as first-class data.

Evidence: fallback block validation at `cli_inner_pretty.js:359940-360032`, stream handling at
`530588-530668` and `530904-531029`, and outer-loop consumption at `368130-368220`.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `streamMessages` (`Z5p`) — streaming request, parser, fallback, recovery, and accounting state machine.
- `streamWithWireHeartbeats` (`LZb`) — bridges raw body timestamps to bounded synthetic pings.
- `wrapResponseBodyWithByteWatchdog` (`wxS`) — suspend-aware raw-body liveness wrapper.
- `createApiFetchWrapper` (`kxS`) — response guard and watchdog attachment point.
- `resolveByteStreamIdleTimeout` (`AxS`) — provider/config-aware byte timeout resolution.
- `parseStreamingFallbackBlock` (`bYs`) — validates fallback content blocks.
