# LLM core and agent-loop architecture in Claude Code 2.1.220

This module documents the runtime spine that the release-delta modules call into: the query entry
point, the repeated model/tool turn state machine, streaming tool execution, recovery transitions,
stop-hook reinvocation, and terminal-reason classification.

The primary implementation is `runQueryTurns` (`xud`) at
`cli_inner_pretty.js:337348-339303`. Its 1,956-line body is not one indivisible algorithm. It is a
coordinator over three smaller machines:

`queryEntrypoint (Kse)` → `runQueryTurns (xud)` → model stream/fallback episode,
`StreamingToolExecutor (Wks)` / `runToolUse (oon)`, then recovery, Stop-hook, or next-turn transition.
`interleaveModelStreamWithToolDrain (gld)` is the multiplexer between the model and executor branches.

## Scope and evidence status

This is a **current-state architecture module**, not a claim that the agent loop was introduced in the
2.1.193 → 2.1.220 window. Stable structural anchors are carryover: `tool_drain_tick` is 2/2,
`tengu_query_before_attachments` is 1/1, `tengu_query_after_attachments` is 1/1, and
`tengu_orphaned_messages_tombstoned` is 1/1 in the target/baseline bundles. Narrow changes inside the
loop remain owned by their delta modules—for example, the silent refusal-continuation events are
analysed in [`../57_api_reliability/`](../57_api_reliability/).

Evidence sources:

- **Behaviour:** the 2.1.220 bundle, especially `:331733-332105` and `:336319-339303`.
- **Delta classification:** literal counts against the 2.1.193 bundle before any “new” claim.
- **Readable cross-reference, not target authority:** the 2.1.88 source names `query`, `queryLoop`,
  `StreamingToolExecutor`, `runToolUse`, and `handleStopHooks` in `src/query.ts:219-241`,
  `src/services/tools/StreamingToolExecutor.ts:40`, `src/services/tools/toolExecution.ts:337`, and
  `src/query/stopHooks.ts:65`. It corroborates names and design ancestry; every 2.1.220 behavior claim
  is still checked in the target bundle, and every release-delta claim is checked against 2.1.193.

## Cross-validation result

The three-way comparison distinguishes evidence that would otherwise be easy to conflate:

| Finding class | Result |
|---|---|
| Exact readable counterpart | `productionDeps`, `queryCheckpoint`, `isWithheldMaxOutputTokens`, `MAX_OUTPUT_TOKENS_RECOVERY_LIMIT`, `StreamingToolExecutor`, `runToolUse`, and `handleStopHooks` are exact older-source names for the same roles. Their later fields and control paths are compared separately rather than assumed identical. |
| Structural ancestry | The explicit state record, tool-block-driven continuation, concurrency barrier, ordered result drain, reactive-compaction handoff, and three-attempt max-output recovery are present in 2.1.88 and remain recognizable in 2.1.220. |
| Post-2.1.88 evolution | The generation-based model/tool multiplexer, active fallback abort-and-rebuild, observer/lifecycle wrapper, signed-thinking resumption, Stop-hook cap, and typed terminal taxonomy are later production behavior. |
| 2.1.193 carryover vs 2.1.220 delta | The Stop-hook cap, thinking-only retry, model/tool multiplexing, fallback compensation, and tool/MCP end-turn protocol already exist in 2.1.193. Signed-thinking resumption and the `malformed_tool_use_exhausted` terminal classification do not. |
| Source-only branch rejected | The 2.1.88 feature-gated 8k-to-64k max-output escalation has no corresponding gate, metric, or constant in either analyzed production path, so it is not attributed to 2.1.220. |

## Architectural findings

1. **Continuation is data, not recursion.** Although the profiler marker still says
   `query_recursive_call`, `runQueryTurns` replaces a single mutable state record and returns to the
   top of `while (!0)` (`:339287-339301`). Recovery branches use the same mechanism, so every retry is
   inspectable through `state.transition` rather than hidden on the JavaScript call stack.
2. **Actual tool blocks—not `stop_reason`—control continuation.** Each streamed `tool_use` block sets
   `needsFollowUp` and is immediately registered with the executor (`:338441-338447`). If none arrived,
   the loop enters recovery/termination even if the API's final metadata is inconsistent
   (`:338687-338950`). A contradictory `stop_reason: "tool_use"` triggers one malformed-response retry
   rather than an empty tool turn (`:338873-338909`).
3. **Streaming output and tool execution form one rollback unit.** A fallback tombstones assistant
   output and tool results, discards or aborts every tracked tool, clears in-progress IDs, resets the
   per-attempt accumulator, and constructs a fresh executor (`:337991-338015`, `:338352-338365`). This
   prevents tool results from an abandoned model attempt from entering the next request.
4. **Tool concurrency is opt-in per invocation.** The executor parses the actual tool input and calls
   the tool definition's `isConcurrencySafe` predicate; parse failure or predicate failure becomes
   exclusive execution (`:331825-331849`). Safe tools may overlap only other safe tools
   (`:331851-331862`).
5. **Termination is a taxonomy, not a boolean.** The wrapper separately decides whether a reason
   cancels queued-command lifecycle and whether it counts as a failed turn (`:336830-336887`,
   `:337283-337297`). Thus `max_turns`, `hook_stopped`, and `background_requested` are terminal without
   being classified as turn failures.

## Documents

| Document | Focus |
|---|---|
| [`agent_loop_state_machine.md`](agent_loop_state_machine.md) | entry wrapper, iteration phases, explicit state transitions, message assembly, next-turn handoff |
| [`streaming_tool_execution.md`](streaming_tool_execution.md) | stream/tool interleaving, concurrency barriers, ordered draining, abort and fallback rollback |
| [`recovery_and_termination.md`](recovery_and_termination.md) | compaction recovery, max-output/malformed/thinking-only retries, stop hooks, terminal reasons |

## Boundaries with existing modules

- [`../07_compact/`](../07_compact/) owns compaction thresholds, dispatcher kinds, token accounting,
  and circuit breakers. This module explains only how compaction outcomes move the query loop.
- [`../41_hooks/`](../41_hooks/) owns hook configuration and execution semantics. This module explains
  why blocking Stop hooks cause another model iteration and why terminal tool/MCP results cannot.
- [`../44_telemetry/`](../44_telemetry/) owns the emitters and correlation attributes. This module uses
  `queryTracking` only to explain lifecycle propagation.
- [`../57_api_reliability/`](../57_api_reliability/) owns request retries, watchdogs, transport errors,
  and refusal-fallback selection. This module owns the rollback contract at the query-loop boundary.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New mappings from this module are staged in
> [symbol_additions_v2_1_220_llm_core.md](../00_overview/symbol_additions_v2_1_220_llm_core.md).

Key functions in this module:
- `queryEntrypoint` (`Kse`, `:337283`) - lifecycle wrapper around the turn machine
- `queryWithObserverTap` (`o$y`, `:337298`) - optional observer capture without changing yielded values
- `runQueryTurns` (`xud`, `:337348`) - central explicit-state loop
- `createTurnAccumulator` (`Zcd`, `:336776`) - per-attempt messages, flags, and executor owner
- `StreamingToolExecutor` (`Wks`, `:331761`) - concurrency-aware streaming executor
- `interleaveModelStreamWithToolDrain` (`gld`, `:332081`) - races model events against drainability
- `runToolUse` (`oon`, `:425379`) - tool lookup, cancellation, isolation, and execution entry
- `handleStopHooks` (`Ycd`, `:336419`) - normal completion hook pipeline
- `finalizeToolEndedTurn` (`e$y`, `:337178`) - terminal tool/MCP cleanup path
