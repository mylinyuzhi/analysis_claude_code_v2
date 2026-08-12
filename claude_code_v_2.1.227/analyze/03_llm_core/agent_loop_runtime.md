# Agent loop, streaming tools, recovery, and termination

## Scope and version comparison

The target's main path is:

```text
queryEntrypoint (jfe)
  -> queryWithObserverTap (ytb)
    -> runQueryTurns (K6d)
      -> model stream <-> interleaveModelStreamWithToolDrain (c8d)
                       <-> StreamingToolExecutor (TYs)
                             -> runToolUse (nAt)
```

The core design is a carryover from 2.1.220, but it was independently re-anchored in 2.1.227. Stable
markers remain present: `tool_drain_tick`, `tengu_query_before_attachments`,
`tengu_query_after_attachments`, `query_recursive_call`, `refusal_continuation`, and
`malformed_tool_use_exhausted`. The target loop moved from `:337348-339303` in 2.1.220 to
`cli_inner_pretty.js:367363-369400` and retains an explicit mutable state record rather than recursive
JavaScript calls.

The target also preserves later 2.1.220-era extensions—observer segments, structured-output recovery,
deferred-tool terminal reasons, `PostToolBatch`, and refusal continuation—while integrating the new
2.1.221–2.1.227 model and cross-session policies through dependencies rather than rewriting the loop.

### Explicit turn-state machine

**What it does:** Runs an arbitrary number of model/tool iterations while keeping every retry,
compaction, hook reinvocation, and normal continuation visible in one state record.

**How it works:**
1. `queryEntrypoint` (`jfe`, `cli_inner_pretty.js:367298-367312`) creates command-lifecycle tracking,
   delegates to the observer-wrapped or direct loop, and classifies the final reason as completed,
   cancelled, or failed.
2. `runQueryTurns` initializes messages, tool context, recovery counters, Stop-hook state, turn count,
   and a `transition` field at `:367363-367395`.
3. Each `while` iteration assigns a query-chain identity, normalizes messages, performs auto-compaction,
   and constructs a per-attempt accumulator with `createTurnAccumulator` (`u6d`, `:366600-366625`).
4. The model stream populates assistant messages and tool-use blocks. Actual tool blocks set the
   follow-up requirement; the API's final `stop_reason` is supporting metadata, not the sole authority.
5. Recovery replaces fields in the state record and returns to the top of the loop. Normal tool
   completion appends assistant and tool-result messages, absorbs queued commands, and assigns
   `transition: { reason: "next_turn" }` at `:369384-369398`.
6. A branch returns only when the terminal taxonomy says the session is done, blocked, aborted,
   deferred, backgrounded, or out of turns.

**Why this approach:**
- Iterative state replacement avoids call-stack growth during long sessions and makes retry counters
  explicit instead of hiding them in recursive frames.
- One state type lets compaction, refusal fallback, maximum-output recovery, Stop hooks, and ordinary
  continuation share a checkpoint contract.
- Using observed tool blocks avoids producing an empty tool turn when provider metadata says
  `tool_use` but no valid block was streamed.
- The trade-off is a very large coordinator. The target mitigates that by extracting the tool
  executor, accumulator, observer, end-turn handler, and compaction dependency.

**Key insight:** The `query_recursive_call` profiler marker names the semantic operation, not the
implementation. The target performs continuation by replacing state inside one loop.

### Streaming model/tool multiplexing

**What it does:** Starts eligible tools as soon as their complete blocks arrive while continuing to
stream model output, without exposing results out of order.

**How it works:**
1. `StreamingToolExecutor` (`TYs`, `cli_inner_pretty.js:360329-360637`) parses each tool input and asks
   the tool's `isConcurrencySafe` predicate about that concrete invocation.
2. Parse failure, predicate failure, or a tool without a concurrency declaration is treated as
   exclusive. Safe tools may overlap only other safe tools; an unsafe tool becomes a barrier.
3. Each tool receives its own child abort controller. A fallback or discard can cancel the abandoned
   attempt without confusing the parent session's cancellation reason.
4. Progress and bridge events may be emitted as they arrive, but completed tool results drain in
   original tool order. An executing unsafe tool prevents later results from passing it.
5. `interleaveModelStreamWithToolDrain` (`c8d`, `:360649-360670`) races the next model event with the
   executor's generation-aware drain signal and yields `tool_drain_tick` when tool output becomes
   available.
6. The generation counter resets after executor replacement, preventing a stale wakeup from a
   discarded fallback attempt from draining into the new attempt.

**Why this approach:**
- Streaming execution hides tool latency behind the remaining model stream.
- Per-invocation safety is more flexible than labeling an entire tool permanently parallel or serial;
  for example, one invocation may target independent resources while another conflicts.
- Ordered draining preserves transcript determinism even when execution completes out of order.
- The trade-off is additional executor bookkeeping and synthetic cancellation results, but the
  transcript stays replayable and API tool-result pairing remains valid.

**Key insight:** Execution can be parallel while observation stays ordered. The executor separates
resource scheduling from transcript ordering.

### Fallback rollback and refusal continuation

**What it does:** Treats assistant output, tool starts, and tool results from one model attempt as a
single rollback unit when the request must move to another model or retry mode.

**How it works:**
1. A refusal or fallback transition records the origin model, serving model, request identity, and
   retracted message UUIDs in a `model_refusal_fallback` event.
2. The loop discards or aborts every tool registered to the abandoned executor and rebuilds it through
   `createTurnAccumulator.rebuildStreamingToolExecutor`.
3. Attempt-local tool results and tool-use blocks are cleared before the replacement request.
4. For silent refusal continuation, `refusal_continuation` begins with salvage text so the already
   streamed prefix can remain visible, then ends when the replacement attempt settles.
5. A malformed `stop_reason: tool_use` with no valid block takes a bounded recovery path; exhaustion
   returns `malformed_tool_use_exhausted` instead of manufacturing a result-less tool turn.

**Why this approach:**
- Tool side effects cannot always be rolled back, but their transcript results can be quarantined so
  they are never attributed to a different model attempt.
- Reusing the old executor would allow late results and wakeups to leak across the fallback boundary.
- Preserving salvage text improves perceived continuity, while explicit retraction metadata lets SDK
  and UI clients reconcile the attempt correctly.
- The trade-off is conservative cancellation: potentially useful in-flight tool work is abandoned to
  protect causal correctness.

**Key insight:** Fallback is not merely “call another model.” It is a transactional boundary around
streamed assistant content and the executor that content created.

### End-turn and Stop-hook decision

**What it does:** Distinguishes normal assistant completion, terminal tool/MCP completion, blocking
Stop hooks, `PostToolBatch` blocks, deferred tools, and user cancellation.

**How it works:**
1. The accumulator observes attachments and tool-result metadata to record end-turn requests,
   deferred tools, and hook-prevented continuation.
2. A terminal tool or MCP result enters `finalizeToolEndedTurn` (`ftb`,
   `cli_inner_pretty.js:367193-367256`). Stop hooks still run for observation, but a blocking result is
   logged and discarded because the terminal tool already ended the turn.
3. Ordinary assistant completion runs the normal Stop-hook pipeline (`s6d`, `:366243-366559`). A
   blocking hook can append a continuation attachment and re-enter the model loop within its cap.
4. After a tool batch, the target runs `PostToolBatch` at `:369234-369308`. Additional context becomes
   transcript attachments; a blocking result terminates the continuation before queued commands are
   absorbed.
5. Abort, deferred-tool, hook-stop, explicit end-turn, loop-tick end, maximum-turn, and normal
   continuation branches are evaluated in that order at `:369167-369226`.

**Why this approach:**
- A terminal tool must remain authoritative; allowing a Stop hook to reinvoke the model afterward
  would violate the tool's end-turn contract.
- Normal Stop hooks are allowed to continue because their purpose is to check whether the agent may
  finish, not merely observe completion.
- `PostToolBatch` runs before queued-command absorption so a policy block cannot accidentally consume
  user steering intended for the next valid iteration.
- The trade-off is multiple hook semantics, but each is tied to a different causal point.

**Key insight:** “Run hooks” and “honor a hook block” are separate decisions. The end-turn source
determines whether a block may create another model iteration.

### Terminal-reason taxonomy

**What it does:** Provides typed completion reasons so lifecycle, telemetry, command queues, and UIs do
not collapse every non-successful exit into one generic failure.

**How it works:**
1. `isFailedTurnReason` (`A7s`, `cli_inner_pretty.js:366658-366685`) classifies blocking limits,
   compaction breakers, prompt/image/model/API errors, malformed tool use, budget exhaustion,
   structured-output exhaustion, unavailable deferred tools, and setup failures as failures.
2. Aborted streams/tools, hook stops, normal deferral, maximum turns, background requests, and completed
   turns are terminal but not failed-turn telemetry.
3. `queryEntrypoint` converts failed or aborted reasons into a cancelled command lifecycle; otherwise
   it completes queued-command lifecycle records.
4. Agent teardown notification runs in `finally`, independently of the terminal reason.

**Why this approach:**
- Callers need to distinguish user interruption from provider failure and policy stops from successful
  completion.
- A typed taxonomy makes new terminal cases additive without changing every caller to inspect messages.
- Treating `max_turns` or `background_requested` as failures would corrupt reliability metrics.
- The cost is maintaining exhaustive reason sets as features add new exits.

**Key insight:** Termination answers two questions: “does the loop stop?” and “did the turn fail?” The
target deliberately does not use one boolean for both.

## 2.1.220 to 2.1.227 assessment

- The main loop, streaming executor, explicit transition state, ordered drain, fallback rollback,
  malformed-tool recovery, and typed termination are architectural carryover.
- The target has not replaced the loop with a new scheduler. New features enter through tool lists,
  permission callbacks, model resolution, message queues, hooks, and dependency injection.
- Refusal-fallback instrumentation has additional target sites, consistent with the expanded model
  catalogue and Fable-related policy, but the transactional rollback mechanism predates this window.
- The target's major visible post-2.1.220 loop-adjacent changes are analyzed in their owning modules:
  cross-session permission evaluation, context enforcement, background-agent preservation, and API
  completion/watchdog fixes.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `runToolUse` (`nAt`) - per-tool execution and cancellation boundary.
- `StreamingToolExecutor` (`TYs`) - concurrency and ordered result scheduling.
- `interleaveModelStreamWithToolDrain` (`c8d`) - stream/executor multiplexer.
- `createTurnAccumulator` (`u6d`) - attempt-local rollback state.
- `isFailedTurnReason` (`A7s`) - failed-versus-terminal classification.
- `queryEntrypoint` (`jfe`) - command lifecycle and agent teardown wrapper.
- `queryWithObserverTap` (`ytb`) - non-mutating observer segmentation.
- `runQueryTurns` (`K6d`) - main explicit-state coordinator.
- `finalizeToolEndedTurn` (`ftb`) - terminal tool/MCP end-turn path.
- `runNormalStopHooks` (`s6d`) - normal completion enforcement and reinvocation.
