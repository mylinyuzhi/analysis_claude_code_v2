# Stream-json events and process I/O

Headless correctness depends on more than generating the right JSON object. Input must survive blank
or closed streams, output must be acknowledged at the byte level, and a final result must preserve
the last complete text even if the model stream terminates during a replacement message.

### Structured-input iteration and unusable-stream classification

**What it does:** Consumes structured stdin until data or stream closure and distinguishes expected
pipe/console failures from application errors.

**How it works:**
1. `isStdinUnusableError` (`ocr`, `cli_inner_pretty.js:15104-15107`) extracts an error code only from
   object-like errors.
2. It accepts codes from two bounded sets: input-unusable conditions and stream-gone conditions.
3. `iterateStreamUntilClose` (`GVi`, `cli_inner_pretty.js:15225-15255`) obtains the async iterator and
   races every `next()` with a one-shot close notification.
4. It attaches a rejection handler to the pending `next()` so closure cannot leave an unhandled
   promise rejection.
5. A close sentinel, `done`, or already destroyed/ended stream exits cleanly; yielded chunks are
   normalized to strings.
6. `finally` removes the close listener and asks the iterator to return without allowing its cleanup
   rejection to escape.

**Why this approach:**
- Windows, redirected stdin, directories, sockets, and closed pipes produce different platform error
  codes; a small whitelist avoids turning every exception into a harmless EOF.
- Racing with close prevents an async iterator from hanging forever after its stream disappears.
- Explicit cleanup avoids listener leaks across long-lived SDK hosts.
- The trade-off is platform-specific classification, but it gives callers control over warning,
  fallback, or silent termination.

**Key insight:** Stream closure is modeled as data-plane completion, while only known transport errors
are downgraded. Unknown exceptions remain visible.

### Byte-accounted stdout and exit drain

**What it does:** Tracks what the process has queued versus what Node has flushed, then waits a
bounded time before exit so the final JSON/result frame is not truncated.

**How it works:**
1. `StdoutDrainState` (`zVi`, `cli_inner_pretty.js:15130-15183`) tracks cumulative queued/flushed
   bytes, write presence, output errors, drain promises, and external-clock notification.
2. `writeToStdout` (`Va`, `cli_inner_pretty.js:15185-15196`) computes UTF-8 byte length, registers a
   write callback, and records bytes only when the stream accepts the write attempt.
3. The callback increments flushed bytes and wakes the drain waiter.
4. `drainStdoutBeforeExit` (`icr`, `cli_inner_pretty.js:15198-15205`) ends non-TTY stdout once and waits
   for both the end callback and zero outstanding bytes.
5. When scaling is enabled, it races full flush with an external-clock grace promise and applies
   `getStdoutDrainBudgetMs` (`Sro`).
6. The budget is `max(caller floor, outstandingBytes / 256 KiB/s)`, capped at 30 seconds.
7. Timeout is deliberately swallowed at process teardown; the diagnostic label identifies an exit
   drain rather than turning it into a second fatal error.

**Why this approach:**
- Node's `write()` return value reports buffering, not durable delivery; the callback is the closest
  available acknowledgement.
- A backlog-derived timeout gives large piped responses more time than small frames without allowing
  indefinite shutdown.
- Counters remain monotonic, simplifying concurrent callbacks.
- The throughput assumption is approximate, but a fixed two-second wait truncates large valid
  responses and an unbounded wait can hang CI forever.

**Key insight:** The exit decision is tied to outstanding bytes, not merely to whether `stdout.end()`
was called.

### Init-event filtering and capability advertisement

**What it does:** Builds one self-describing `system/init` frame that exposes usable tools and
servers, stable diagnostics, and optional capabilities to an SDK consumer.

**How it works:**
1. `buildHeadlessInitEvent` (`FFr`, `cli_inner_pretty.js:678856-678895`) receives the already-resolved
   session snapshot rather than reading mutable globals field by field.
2. It normalizes tool names, MCP connection statuses, commands, agents, user-invocable skills, and
   plugin records.
3. It copies plugin errors/warnings only when nonempty.
4. It removes MCP configuration errors whose server name now appears among live clients, preventing a
   stale validation warning from contradicting a successful connection.
5. It emits remaining `mcp_server_errors` as copied objects and advertises capability tokens only when
   the caller supplied them.
6. Memory paths and messaging socket path are optional; fast-mode state/reason are appended to the
   final object.
7. A fresh UUID identifies the event independently from the session ID.

**Why this approach:**
- Snapshot input makes the frame internally consistent even while plugins or MCP connections refresh.
- Omitting empty optional arrays keeps older consumers compatible and the initial frame compact.
- Filtering by connected name reports final observable state instead of every transient parser error.
- Open-ended capabilities let consumers feature-detect instead of version-sniffing.

**Key insight:** The init event is a negotiated-state snapshot. Its error list is post-reconciliation,
not a raw log of every startup attempt.

### Incomplete-result rolling accumulator

**What it does:** Preserves the previous complete assistant text when a failed stream emits a final
replacement message ending in “The response above may be incomplete.”

**How it works:**
1. `createPartialResultAccumulator` (`AUh`, `cli_inner_pretty.js:938248-938250`) starts with
   `lastAssistantText`, `priorAssistantText`, and `partialForResult` unset.
2. `updatePartialResultAccumulator` (`wUh`) clears assistant history at compact boundaries.
3. For an assistant event, it joins nonempty text blocks. A new nonempty value shifts the old last
   value into `priorAssistantText` and becomes the new last value.
4. On a result event, require a `success` variant that is nevertheless marked error, whose result
   ends with the incomplete marker and exactly equals the latest assistant text.
5. Only that four-part predicate exposes `priorAssistantText` as `partialForResult`.
6. The plain-output renderer prepends the recovered prior text to the result and then resets the
   accumulator.

**Why this approach:**
- Some stream failures replace a valid partial answer with a diagnostic assistant message; rendering
  only the last value loses useful work.
- Two slots are sufficient because recovery needs only the text immediately preceding the diagnostic.
- Exact equality and marker checks avoid duplicating text for ordinary error results.
- Compaction reset prevents content from an earlier context segment leaking into a later result.

**Key insight:** Recovery is intentionally narrow. It repairs one proven replacement pattern rather
than concatenating arbitrary assistant messages.

### Output-format filtering

**What it does:** Projects the common event stream into text, JSON, or stream-json without leaking
internal progress events to formats that cannot represent them.

**How it works:**
1. The headless output loop observes every engine event and updates the partial-result accumulator
   before format filtering.
2. Stream-json may include partial messages, hook events, and forwarded subagent frames according to
   negotiated options.
3. Internal progress subtypes—including `control_request_progress`—are suppressed from plain text
   unless a consumer explicitly requested their structured representation.
4. JSON waits for the terminal result and serializes the result object once.
5. Plain text prints the recovered/success result, preserving its existing newline or adding one.
6. All paths use the shared accounted stdout writer and final drain protocol.

**Why this approach:**
- One source event stream prevents execution semantics from diverging by output format.
- Filtering late allows stateful recovery to see events that should not be printed.
- Stream-json preserves machine-readable lifecycle detail; plain text prioritizes a single useful
  answer.
- Late filtering performs some work for discarded events, but keeps protocol and execution coupled
  correctly.

**Key insight:** Output format is a projection, not a different agent loop. Reliability state is
updated before the projection discards anything.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isStdinUnusableError` (`ocr`) - classifies expected stdin/pipe failures.
- `iterateStreamUntilClose` (`GVi`) - races async reads with closure.
- `StdoutDrainState` (`zVi`) - accounts queued and flushed bytes.
- `writeToStdout` (`Va`) - writes with byte acknowledgements.
- `drainStdoutBeforeExit` (`icr`) - performs bounded final delivery.
- `buildHeadlessInitEvent` (`FFr`) - constructs the initial SDK snapshot.
- `updatePartialResultAccumulator` (`wUh`) - applies the two-slot recovery algorithm.
