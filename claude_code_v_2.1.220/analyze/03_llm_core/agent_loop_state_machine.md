# Agent-loop state machine and turn assembly

`runQueryTurns` (`xud`, `cli_inner_pretty.js:337348-339303`) is the central async generator. It does
not merely “call the model until there are no tools.” It maintains explicit cross-iteration state,
coordinates several forms of retry, and commits assistant/tool/attachment messages only when an
attempt remains valid.

## 1. Public entry, observer wrapper, and lifecycle

### Query entrypoint lifecycle

**What it does:** `queryEntrypoint` (`Kse`) selects the plain or observer-tapped loop, guarantees
subagent-exit reporting, closes the lifecycle of queued commands consumed mid-turn, and records the
terminal turn metric (`:337283-337297`).

**How it works:**

1. It allocates an array that `runQueryTurns` fills with UUIDs of commands actually removed from the
   mid-turn queue (`:337284`, `:339211-339247`).
2. It selects `queryWithObserverTap` (`o$y`) when the observer path is enabled, otherwise calls
   `runQueryTurns` directly (`:337286`). The tap manually forwards `next()` values and captures them,
   preserving the generator's bidirectional protocol (`:337315-337346`).
3. A `finally` block emits `subagent_exit` when the context has an `agentId`, even if the loop throws
   or the consumer closes the generator (`:337287-337290`).
4. On normal return, it maps the terminal reason through `shouldCancelCommandLifecycle` (`dTo`) and
   emits one `command_lifecycle` terminal event for each consumed UUID (`:337291-337293`).
5. It separately maps the reason through `isFailureTerminalReason` (`BHs`) to choose failed-turn or
   successful-turn metering (`:337294-337296`).

**Why this approach:**

- Generator teardown is asymmetric: ordinary return, throw, and consumer-driven `.return()` do not
  execute identical code. The outer `finally` is the only reliable place for subagent cleanup.
- Command lifecycle and turn-success telemetry answer different questions, so one success boolean
  would lose information. For example, `max_turns` is not treated as a failed turn, while an API error
  is (`:336833-336859`).
- The observer is a transparent decorator rather than a branch inside the 1,956-line loop; this keeps
  capture failure from changing core yielded values.

**Key insight:** completion is deliberately split into three ledgers—subagent lifecycle, queued-command
lifecycle, and turn outcome. A terminal reason can be “done” in one ledger and “cancelled” in another.

## 2. Explicit cross-iteration state

### State-record transition machine

**What it does:** Carries every value that must survive a `continue` in one object, `g`, while keeping
request parameters such as prompts and `canUseTool` immutable for the lifetime of the generator
(`:337349-337381`).

```javascript
// ============================================
// initializeQueryLoopState - Create state carried across model/tool iterations
// Location: cli_inner_pretty.js:337364-337377
// ============================================

// ORIGINAL (for source lookup):
    g = {
      messages: e.messages,
      toolUseContext: e.toolUseContext,
      maxOutputTokensOverride: e.maxOutputTokensOverride,
      compactTracking: void 0,
      stopHookActive: e.stopHookActive ?? !1,
      stopHookBlockingCount: 0,
      maxOutputTokensRecoveryCount: 0,
      hasAttemptedReactiveCompact: !1,
      thinkingOnlyNudged: !1,
      turnCount: 1,
      pendingToolUseSummary: void 0,
      transition: void 0,
    },

// READABLE (for understanding):
    state = {
      messages: params.messages,
      toolUseContext: params.toolUseContext,
      maxOutputTokensOverride: params.maxOutputTokensOverride,
      compactTracking: undefined,
      stopHookActive: params.stopHookActive ?? false,
      stopHookBlockingCount: 0,
      maxOutputTokensRecoveryCount: 0,
      hasAttemptedReactiveCompact: false,
      thinkingOnlyNudged: false,
      turnCount: 1,
      pendingToolUseSummary: undefined,
      transition: undefined,
    };

// Mapping: g→state, e→params
```

**How it works:**

1. The top of every iteration destructures the previous state, while `toolUseContext` remains locally
   reassignable because tool execution can produce a revised context (`:337428-337448`).
2. Normal tool continuation replaces the state with the committed message history and transition
   `next_turn` (`:339287-339301`).
3. Recovery paths replace the same object but intentionally preserve or reset different counters:
   reactive compaction preserves the max-output count (`:338815-338817`); max-output recovery
   increments it (`:338854-338868`); malformed tool recovery resets it (`:338891-338913`); a Stop-hook
   block increments both the turn and hook-block counters (`:338983-339007`).
4. Each replacement writes a `transition.reason`. The next iteration uses it for retry guards and
   telemetry, including the one-retry malformed-tool rule (`:338873-338875`). Precomputed compaction
   is selected at `:338753-338791`, and its transition is recorded at `:338815`.

The reachable continuation reasons in this body are:

| Transition | Trigger | Important preserved/reset state |
|---|---|---|
| `next_turn` | tools completed normally | appends assistant + tool + attachment messages; resets recovery guards |
| `reactive_compact_retry` | overflow recovery produced a compacted history | keeps compact tracking; marks reactive attempt |
| `precomputed_compact_swap` | a precomputed compact result won | keeps the supplied compact result without marking a fresh attempt |
| `max_output_tokens_recovery` | withheld max-output error, attempts below 3 | increments only max-output recovery count |
| `malformed_tool_use_retry` | API said tool use but emitted no block | exactly one retry; optionally starts from a clean assistant attempt |
| `thinking_only_retry` | final response contains no user-visible text | sets a one-shot nudge latch |
| `stop_hook_blocking` | Stop hook returned blocking messages | appends those messages and sets `stopHookActive` |

**Why this approach:**

- A recursive implementation would place tool turns and retries on the JavaScript call stack and make
  cleanup harder to reason about. Replacing one record gives every branch the same continuation
  protocol and avoids unbounded stack growth.
- A set of independent mutable locals would make partial updates easy: a retry might reset a counter
  but accidentally retain a pending summary. Whole-record replacement makes those choices visible at
  each branch.
- The trade-off is verbosity. Every continuation repeats most fields, but that duplication acts as a
  review checklist for state that must not leak between attempts.

**Key insight:** `transition` is not the control transfer itself—the `continue` is. It is an audit tag
that lets the next iteration distinguish why it exists without inferring history from message shapes.

## 3. Per-iteration phase ordering

### Turn phase pipeline

**What it does:** Orders context preparation, compaction, model streaming, tool execution, hooks, and
attachment synthesis so each phase sees a consistent message history.

**How it works:**

1. **Preflight:** a main-loop background request can terminate before another API call; otherwise the
   loop emits `stream_request_start`, creates or increments `queryTracking`, and copies the visible
   history (`:337417-337459`).
2. **Content replacement and compaction:** it applies content-replacement state, calls the injected
   auto-compact dispatcher, handles the rapid-refill terminal, and replaces the query history when
   compaction succeeds (`:337460-337533`).
3. **Context and model setup:** it snapshots the current app/permission state, resolves live model
   overrides, handles any model-consent fallback, and performs the hard blocking-limit check before
   opening a stream (`:337560-337745`).
4. **Streaming attempt:** it calls the injected model generator through
   `interleaveModelStreamWithToolDrain`, yields visible stream events, accumulates assistant messages,
   and starts tools as their blocks arrive (`:337848-338455`).
5. **No-tool branch:** when no real tool block arrived, it handles overflow/max-output/malformed/
   thinking-only recovery, API errors, and Stop hooks, then returns a terminal reason
   (`:338687-339005`).
6. **Tool branch:** it drains remaining tools, handles abort/defer/hook/end-turn conditions, runs the
   `PostToolBatch` hook, folds queued mid-turn commands into attachments, refreshes dynamic tools and
   MCP clients, checks `maxTurns`, and commits the next state (`:339008-339303`).

**Why this approach:**

- Compaction must precede the request so the model and `toolUseContext.messages` agree on the history.
- Stop hooks run only after the loop knows there is no tool follow-up; otherwise they would fire in the
  middle of an agentic trajectory.
- Queued user commands are absorbed after tools, so a command sent during tool execution becomes input
  to the next model iteration instead of racing the current attempt.
- Dynamic tool/MCP refresh happens after attachments but before the next state commit, allowing a tool
  result such as MCP connection progress to change the next request's tool surface (`:339263-339283`).

**Key insight:** the “turn” visible to a user and one loop iteration are different units. One user turn
may contain many model iterations; only the message commit at the bottom makes an iteration part of the
next request.

## 4. The continuation signal

### Tool-block-driven continuation

**What it does:** Uses the presence of parsed `tool_use` blocks as the authoritative signal that the
agent needs another iteration.

**How it works:**

1. Every assistant message is appended to `assistantMessages` (`He`).
2. Its content is filtered for `tool_use` blocks; non-empty results are appended to `toolUseBlocks`
   (`lt`) and set `needsFollowUp` on the turn accumulator (`:338441-338446`).
3. Each block is passed immediately to the streaming executor (`:338446`).
4. After streaming, `!needsFollowUp` selects recovery/termination (`:338687`); otherwise the executor
   is drained and a tool-result turn is assembled (`:339008`).
5. If final metadata says `stop_reason === "tool_use"` but the block list is empty, the loop treats the
   response as malformed, retries once, then returns `malformed_tool_use_exhausted`
   (`:338873-338909`).

**Why this approach:**

- Stop metadata can be missing or inconsistent, while an actual block contains the ID, name, and input
  needed to execute anything.
- Treating metadata as advisory prevents an empty follow-up iteration that would send no matching
  `tool_result` and could corrupt the API message sequence.
- The one-retry limit balances resilience against an infinite loop on a persistently malformed model
  response.

**Key insight:** `stop_reason` validates the response; it does not drive the happy-path loop. The
executable content does.

## 5. Commit and next-turn assembly

### Atomic next-turn commit

**What it does:** Commits the prepared query history, assistant output, normalized tool results, and
post-tool attachments in one ordered array, along with the tool context that resulted from execution.

```javascript
// ============================================
// commitNextToolTurn - Commit messages and state for the next model iteration
// Location: cli_inner_pretty.js:339287-339301
// ============================================

// ORIGINAL (for source lookup):
    (wg("query_recursive_call"),
      (g = {
        messages: [...Le, ...He, ...Qe],
        toolUseContext: Rr,
        compactTracking: Ce,
        turnCount: Vt,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: !1,
        thinkingOnlyNudged: !1,
        pendingToolUseSummary: jr,
        maxOutputTokensOverride: void 0,
        stopHookActive: te,
        stopHookBlockingCount: 0,
        transition: { reason: "next_turn" },
      }));

// READABLE (for understanding):
    queryCheckpoint("query_recursive_call");
    state = {
      messages: [...messagesForQuery, ...assistantMessages, ...toolResultsAndAttachments],
      toolUseContext: updatedToolUseContext,
      compactTracking,
      turnCount: nextTurnCount,
      maxOutputTokensRecoveryCount: 0,
      hasAttemptedReactiveCompact: false,
      thinkingOnlyNudged: false,
      pendingToolUseSummary,
      maxOutputTokensOverride: undefined,
      stopHookActive,
      stopHookBlockingCount: 0,
      transition: { reason: "next_turn" },
    };

// Mapping: wg→queryCheckpoint, g→state, Le→messagesForQuery, He→assistantMessages, Qe→toolResultsAndAttachments, Rr→updatedToolUseContext, Ce→compactTracking, Vt→nextTurnCount, jr→pendingToolUseSummary, te→stopHookActive
```

**How it works:**

1. The executor is fully drained before the commit (`:339008-339028`).
2. `PostToolBatch` can append context or stop continuation (`:339127-339208`).
3. Eligible queued commands and prefetched memories are converted to attachments in `Qe`
   (`:339209-339268`).
4. Tool and MCP client lists are refreshed into the updated context (`:339269-339283`).
5. `maxTurns` is computed before queue folding; when exceeded, `dn` is empty, so the loop returns
   without consuming a next-turn command batch (`:339213-339219`, `:339281-339287`).
6. The ordered concatenation keeps each assistant `tool_use` before its corresponding user
   `tool_result`, which is required for a valid next API request (`:339287`).

**Why this approach:**

- A single commit point prevents recovery branches from accidentally appending partial messages.
- Keeping attachments in the tool-result tail makes all mid-turn environmental changes visible to the
  next model call without modifying the already-streamed assistant message.
- Resetting attempt-local guards here ensures an overflow or malformed-response retry in one model
  iteration does not suppress recovery in a later, genuine tool turn.

**Key insight:** the array order is the transaction boundary: prepared history → assistant decision →
results/environment. Everything before that assignment is provisional.

## Cross-validation against the readable 2.1.88 source

The older source confirms the design ancestry but also exposes two meaningful later changes:

| Decision or invariant | 2.1.88 readable source | 2.1.220 bundle conclusion |
|---|---|---|
| Public/inner split | `query` delegates to `queryLoop` at `src/query.ts:219-241`. | `queryEntrypoint` (`Kse`) and `runQueryTurns` (`xud`) are the evolved pair. The project keeps the established `runQueryTurns` mapping; `queryLoop` is a counterpart name, not a remapping. |
| Explicit state machine | `State` is initialized at `src/query.ts:263-279`, destructured at `:307-321`, and replaced at each continuation. | Confirms that the loop is intentionally iterative and transition-driven rather than accidental minifier output. |
| Continuation authority | The source explicitly says `stop_reason === 'tool_use'` is unreliable and makes parsed blocks the sole loop-exit signal at `src/query.ts:551-558`. | Directly confirms the rationale for the 2.1.220 block-driven branch at `:338441-338446`. |
| Atomic commit order | `src/query.ts:1714-1727` commits prepared history, assistant messages, then tool results. | Confirms the same protocol transaction at `:339287-339301`. |
| Command queue vs `maxTurns` | 2.1.88 marks and removes eligible commands at `src/query.ts:1632-1643`, then checks `maxTurns` at `:1704-1712`. | 2.1.220 computes the limit before queue folding and returns before consuming commands (`:339213-339219`, `:339281-339287`), preventing commands from being lost when no next request will occur. |
| Lifecycle wrapper | 2.1.88 marks consumed commands completed only after a normal `queryLoop` return (`src/query.ts:229-238`). | 2.1.220 adds observer forwarding, `subagent_exit` cleanup, and reason-aware completed/cancelled command lifecycle (`:337283-337346`). |

**Cross-validation conclusion:** the state machine, continuation signal, and commit ordering are
confirmed independently. Queue preservation at the turn cap and the richer lifecycle wrapper are
real evolution, not merely renamed 2.1.88 code.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `queryEntrypoint` (`Kse`, `:337283`) - outer lifecycle wrapper
- `queryWithObserverTap` (`o$y`, `:337298`) - transparent observer decorator
- `runQueryTurns` (`xud`, `:337348`) - explicit turn state machine
- `productionDeps` (`nud`, `:336815`) - injects model, compaction, clock, and UUID dependencies
- `findCurrentTurnStartIndex` (`kud`, `:339319`) - finds the last real user turn boundary
- `createTurnAccumulator` (`Zcd`, `:336776`) - owns per-attempt arrays and continuation flags
- `handleStopHooks` (`Ycd`, `:336419`) - normal no-tool completion path
