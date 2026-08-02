# Streaming tool execution, concurrency, and rollback

Claude Code 2.1.220 starts local tools while model events are still arriving. The mechanism is split
between `interleaveModelStreamWithToolDrain` (`gld`, `cli_inner_pretty.js:332081-332102`) and
`StreamingToolExecutor` (`Wks`, `:331761-332080`). The query loop supplies the transaction boundary:
if the model attempt is abandoned, it rolls back both streamed output and tool activity.

This architecture is carryover in the comparison window: `tool_drain_tick`, the streaming-fallback
discard message, and `tengu_orphaned_messages_tombstoned` all occur in both 2.1.220 and 2.1.193. The
analysis below describes the 2.1.220 implementation without relabelling it as net-new.

## 1. Model/tool stream multiplexing

### Generation-based stream/drain race

**What it does:** Emits model events normally, but interrupts a stalled model read whenever the
executor advances its drain generation, allowing the caller to flush accumulated tool updates without
issuing a second `.next()` on the model iterator.

```javascript
// ============================================
// interleaveModelStreamWithToolDrain - Race model events against tool drainability
// Location: cli_inner_pretty.js:332081-332102
// ============================================

// ORIGINAL (for source lookup):
async function* gld(e, t) {
  let r = Symbol.asyncIterator in e ? e[Symbol.asyncIterator]() : e[Symbol.iterator](),
    n,
    o = t(),
    i = 0;
  try {
    while (!0) {
      n ??= Promise.resolve(r.next()).then((l) => ({ kind: "stream", r: l }));
      let s = t();
      if (s !== o) ((o = s), (i = 0));
      let a = await Promise.race([n, s.waitForDrainable(i).then((l) => ({ kind: "drain", gen: l }))]);
      if (a.kind === "drain") {
        ((i = a.gen), yield { type: "tool_drain_tick" });
        continue;
      }
      if (((n = void 0), a.r.done)) return;
      yield a.r.value;
    }
  } finally {
    Promise.resolve(r.return?.(void 0)).catch(() => {});
  }
}

// READABLE (for understanding):
async function* interleaveModelStreamWithToolDrain(modelEvents, getExecutor) {
  const iterator = Symbol.asyncIterator in modelEvents
    ? modelEvents[Symbol.asyncIterator]()
    : modelEvents[Symbol.iterator]();
  let pendingModelNext;
  let executor = getExecutor();
  let seenGeneration = 0;
  try {
    while (true) {
      pendingModelNext ??= Promise.resolve(iterator.next())
        .then(result => ({ kind: "stream", result }));
      const currentExecutor = getExecutor();
      if (currentExecutor !== executor) {
        executor = currentExecutor;
        seenGeneration = 0;
      }
      const winner = await Promise.race([
        pendingModelNext,
        executor.waitForDrainable(seenGeneration)
          .then(generation => ({ kind: "drain", generation })),
      ]);
      if (winner.kind === "drain") {
        seenGeneration = winner.generation;
        yield { type: "tool_drain_tick" };
        continue;
      }
      pendingModelNext = undefined;
      if (winner.result.done) return;
      yield winner.result.value;
    }
  } finally {
    Promise.resolve(iterator.return?.()).catch(() => {});
  }
}

// Mapping: gld→interleaveModelStreamWithToolDrain, e→modelEvents, t→getExecutor, r→iterator, n→pendingModelNext, o→executor, i→seenGeneration, a→winner
```

**How it works:**

1. It creates exactly one pending `iterator.next()` promise and retains it across drain ticks
   (`:332087`).
2. The executor exposes a monotonic `drainGeneration`. `wakeWaiters()` increments it for discard,
   bridge/interruptibility, and completion-related events (`:331777-331779`, `:331927-331940`,
   `:331991-332018`). Ordinary progress has a separate resolver used by the post-stream drain
   (`:332007-332009`, `:332050-332055`).
3. `waitForDrainable(seenGeneration)` resolves immediately if an event occurred before the waiter was
   registered, preventing a lost wakeup (`:331932-331941`).
4. A drain win yields a synthetic `tool_drain_tick`; the query loop consumes that marker internally and
   calls `getCompletedResults()` rather than exposing it as a user message (`:337950-337952`).
5. A stream win clears only the pending `.next()` slot, yields the model event, then opens the next read
   on the following iteration (`:332098-332101`).
6. If the wrapper is closed, `finally` asks the underlying iterator to return and intentionally ignores
   teardown failure (`:332099-332101`).

**Why this approach:**

- Polling would either add latency or burn CPU; a promise race sleeps until either producer has work.
- Calling `.next()` again after a tool tick could concurrently advance the same async iterator and
  reorder model events. Retaining `pendingModelNext` avoids that class of bug.
- The generation counter closes the check-then-wait race: if work arrives between checking and
  registering the resolver, the changed counter produces an immediate resolution.
- Executor identity is re-read because fallback rebuilds it mid-stream. Resetting the generation when
  identity changes prevents a high counter from the discarded executor suppressing events from the
  new one (`:332089-332091`).

**Key insight:** `tool_drain_tick` is a scheduler control frame, not conversation content. It allows a
single async-generator channel to multiplex two producers while maintaining one outstanding read per
producer.

## 2. Concurrency scheduling

### Input-sensitive exclusivity barrier

**What it does:** Starts tools as soon as their blocks arrive, allowing overlap only when the specific
invocations are proven concurrency-safe.

```javascript
// ============================================
// scheduleStreamingTool - Validate concurrency safety and respect exclusive barriers
// Location: cli_inner_pretty.js:331837-331869
// ============================================

// ORIGINAL (for source lookup):
    let n = r.inputSchema.safeParse(e.input),
      o = n?.success
        ? (() => {
            try {
              return Boolean(r.isConcurrencySafe(n.data));
            } catch {
              return !1;
            }
          })()
        : !1;
    (this.tools.push({
      id: e.id,
      block: e,
      assistantMessage: t,
      status: "queued",
      isConcurrencySafe: o,
      pendingProgress: [],
      pendingBridgeEvents: [],
      results: [],
    }),
      this.processQueue());
  }
  canExecuteTool(e) {
    let t = this.tools.filter((r) => r.status === "executing");
    return t.length === 0 || (e && t.every((r) => r.isConcurrencySafe));
  }
  async processQueue() {
    for (let e of this.tools) {
      if (e.status !== "queued") continue;
      if (this.canExecuteTool(e.isConcurrencySafe)) await this.executeTool(e);
      else if (!e.isConcurrencySafe) break;
    }
  }

// READABLE (for understanding):
    const parsed = toolDefinition.inputSchema.safeParse(toolUse.input);
    const isConcurrencySafe = parsed?.success
      ? (() => {
          try {
            return Boolean(toolDefinition.isConcurrencySafe(parsed.data));
          } catch {
            return false;
          }
        })()
      : false;
    this.tools.push({
      id: toolUse.id,
      block: toolUse,
      assistantMessage,
      status: "queued",
      isConcurrencySafe,
      pendingProgress: [],
      pendingBridgeEvents: [],
      results: [],
    });
    this.processQueue();
  }
  canExecuteTool(isConcurrencySafe) {
    const executing = this.tools.filter(tool => tool.status === "executing");
    return executing.length === 0 ||
      (isConcurrencySafe && executing.every(tool => tool.isConcurrencySafe));
  }
  async processQueue() {
    for (const tool of this.tools) {
      if (tool.status !== "queued") continue;
      if (this.canExecuteTool(tool.isConcurrencySafe)) await this.executeTool(tool);
      else if (!tool.isConcurrencySafe) break;
    }
  }

// Mapping: e→toolUse/isConcurrencySafe, t→assistantMessage/executing, r→toolDefinition, n→parsed, o→isConcurrencySafe
```

**How it works:**

1. Tool lookup honours session aliases. An unknown name is converted immediately into a completed
   error result with the original `tool_use_id`; no exception escapes the scheduler
   (`:331799-331836`).
2. The definition's schema parses the actual input before the scheduler asks
   `isConcurrencySafe(parsed.data)`. Invalid input, a thrown predicate, or a false result all fail
   closed to exclusive execution (`:331837-331846`).
3. A tool may start when nothing is running, or when it is safe and every running tool is also safe
   (`:331859-331862`).
4. Encountering a queued exclusive tool behind running work stops the scan. Later safe tools do not
   jump that barrier (`:331863-331868`).
5. `executeTool` changes status to `executing`, creates a child abort controller, launches the
   `runToolUse` generator, stores its promise, and returns control to the scheduler; completion calls
   `processQueue()` again (`:331958-332025`).

**Why this approach:**

- Safety can depend on arguments: two reads may overlap, while an edit or state-changing invocation
  needs isolation. A definition-level constant would be too coarse.
- Fail-closed classification trades some latency for correctness when schemas or predicates fail.
- The exclusive barrier preserves model order around side effects. Allowing later reads to leapfrog a
  queued write could expose pre-write state even though the model ordered the write first.
- This is not unrestricted parallelism: the maximum overlap is bounded by how many consecutive
  invocations explicitly prove safety.

**Key insight:** concurrency safety is a property of a parsed invocation, not merely of a tool name.

## 3. Result draining and context propagation

### Ordered, progress-aware result drain

**What it does:** Separates transient progress/bridge events from final conversation messages, emits
completed tool results, clears in-progress IDs, and carries context updates forward.

**How it works:**

1. Each tracked tool has `queued → executing → completed → yielded` status and separate buffers for
   final results, progress, and bridge events (`:331766-331772`, `:331837-331845`).
2. `getCompletedResults()` emits bridge events and progress first. Completed final results then become
   yielded, followed by a `set_in_progress_tool_use_ids/remove` control event (`:332027-332039`).
3. An executing exclusive tool is a result-order barrier; the drain stops at it. Executing safe tools
   do not block inspection of later safe completions (`:332033-332039`).
4. `getRemainingResults()` repeatedly starts newly eligible work, drains ready outputs, then races
   running promises against the progress wakeup resolver so progress is not held until completion
   (`:332044-332058`).
5. Non-concurrent tools may apply returned context layers to the executor's `toolUseContext` once they
   finish (`:332013-332020`). The query loop reads `newContext` while draining and commits the latest
   context to the next turn (`:339008-339028`).

**Why this approach:**

- Progress must remain low-latency, but final tool results must preserve enough ordering to respect
  exclusive side effects.
- Buffering final messages avoids exposing a half-complete tool invocation to the conversation.
- Context layers are serialized behind exclusive tools because concurrent context mutations would
  require a merge policy and could overwrite one another.
- The trade-off is head-of-line blocking at exclusive operations; it is intentional because the
  alternative changes observable execution order.

**Key insight:** “ordered results” does not mean every event is globally ordered. Progress is eager;
exclusive final results form the ordering barriers.

## 4. Cancellation and attempt rollback

### Abort-reason conversion

**What it does:** Converts cancellation conditions into valid `tool_result` messages and controls which
running tools may be interrupted.

**How it works:**

1. A discarded executor reports `streaming_fallback`; a parent abort reports user interruption, except
   an `interrupt` signal respects each tool's `interruptBehavior` (`:331908-331916`).
2. An `end_conversation` abort cancels every tool except the `EndConversation` invocation that caused
   it (`:331910-331914`).
3. Cancellation becomes a synthetic error result carrying the original tool ID, so any retained
   assistant message would still have a structurally valid pair (`:331870-331906`).
4. The child abort controller propagates non-fallback cancellation back to the query controller, while
   `discarded` prevents rollback cancellation from aborting the replacement attempt
   (`:331972-331978`).

**Why this approach:**

- The API message protocol requires a result for a retained `tool_use`; throwing from the scheduler
  would leave an orphan block.
- Per-tool interrupt behaviour prevents a steering message from killing operations that must finish
  atomically.
- The EndConversation exception avoids cancelling the very tool whose result is supposed to terminate
  the turn.

**Key insight:** cancellation is represented twice: as process control through `AbortController`, and
as conversation data through a synthetic `tool_result`.

### Fallback rollback transaction

**What it does:** Removes every visible and executable consequence of a model attempt before retrying
with a different stream/model.

```javascript
// ============================================
// rollbackStreamingFallbackAttempt - Tombstone messages and rebuild tool execution state
// Location: cli_inner_pretty.js:338352-338365
// ============================================

// ORIGINAL (for source lookup):
            if (Rn) {
              for (let St of He) yield { type: "tombstone", message: St };
              for (let St of Qe) yield { type: "tombstone", message: St };
              (O("tengu_orphaned_messages_tombstoned", {
                orphanedMessageCount: He.length,
                queryChainId: he,
                queryDepth: ve.depth,
              }),
                Ze.reset({ clearAssistantMessages: !0 }),
                (go.length = 0));
              let Je = non(Ze.streamingToolExecutor, "streaming_fallback");
              if ((Ze.rebuildStreamingToolExecutor(), Je)) yield Je;
              Rn = !1;
            }

// READABLE (for understanding):
            if (streamingFallbackOccurred) {
              for (const message of assistantMessages) yield { type: "tombstone", message };
              for (const message of toolResults) yield { type: "tombstone", message };
              logEvent("tengu_orphaned_messages_tombstoned", {
                orphanedMessageCount: assistantMessages.length,
                queryChainId,
                queryDepth: queryTracking.depth,
              });
              turnAccumulator.reset({ clearAssistantMessages: true });
              observableInputBackfills.length = 0;
              const removeIds = sweepInFlightToolsForFallback(
                turnAccumulator.streamingToolExecutor,
                "streaming_fallback",
              );
              turnAccumulator.rebuildStreamingToolExecutor();
              if (removeIds) yield removeIds;
              streamingFallbackOccurred = false;
            }

// Mapping: Rn→streamingFallbackOccurred, St→message, He→assistantMessages, Qe→toolResults, O→logEvent, he→queryChainId, ve→queryTracking, Ze→turnAccumulator, go→observableInputBackfills, non→sweepInFlightToolsForFallback, Je→removeIds
```

**How it works:**

1. Tombstones retract assistant and tool-result messages already emitted to consumers
   (`:338353-338354`).
2. The accumulator clears arrays and flags from the abandoned attempt (`:338360-338361`).
3. `sweepInFlightToolsForFallback` calls `discardAndAbortInFlight`, counts executing/completed/queued
   tools, and returns one control event removing every tracked in-progress tool ID
   (`:331733-331759`).
4. `discardAndAbortInFlight` wakes waiters, does not restart queued tools, and aborts executing child
   controllers (`:331777-331797`).
5. A new executor is constructed before the replacement stream continues (`:338363`). Other
   fallback lanes use the same sequence, including allowlist rejection and refusal retries
   (`:337991-338015`, `:338293-338298`).

**Why this approach:**

- Tombstoning only assistant text is insufficient: a tool may already have changed UI state or emitted
  a result tied to an abandoned `tool_use_id`.
- Reusing the discarded executor would retain its discard latch and tracked IDs. Rebuilding gives the
  retry an empty scheduler and current tool context.
- Completed tools cannot necessarily be undone at the operating-system level. The rollback is a
  **conversation/UI rollback**, plus best-effort abortion of work still in flight. This is the main
  trade-off of starting side effects before the model attempt is final.

**Key insight:** streaming execution reduces latency by making speculative side effects possible; the
fallback sweep is the compensating transaction that keeps their protocol artifacts out of the retry.

## Cross-validation against the readable 2.1.88 source

| Decision or mechanism | 2.1.88 readable source | 2.1.220 bundle conclusion |
|---|---|---|
| Class identity | `StreamingToolExecutor` is declared at `src/services/tools/StreamingToolExecutor.ts:40`. | Exact class-name and role match. |
| Input-sensitive concurrency | Input is schema-parsed and `isConcurrencySafe(parsedInput)` is guarded by `try/catch` at `:104-120`; `canExecuteTool` admits overlap only when all running tools are safe at `:129-149`. | Confirms both the fail-exclusive default and the exclusive barrier described here. |
| Ordered drain | `getCompletedResults` drains in tracked order and stops at an executing exclusive tool (`:407-439`); `getRemainingResults` waits on completion or progress (`:449-490`). | Confirms that ordered emission and progress wakeups are intentional scheduler guarantees. |
| Context mutation | Context modifiers are applied only for non-concurrent tools at `:388-395`. | Confirms the serialization trade-off behind context propagation. |
| Model/tool multiplexing | The old query loop polls `getCompletedResults()` after model events at `src/query.ts:848-855`; the class has no drain generation or `waitForDrainable`. | `interleaveModelStreamWithToolDrain` and `tool_drain_tick` are post-2.1.88 evolution, but literal counts 2/2 show they already existed by 2.1.193. |
| Fallback compensation | Old `discard()` only sets a latch at `StreamingToolExecutor.ts:64-71`. | 2.1.220 actively aborts executing children, removes tracked UI IDs, and rebuilds the executor. This stronger rollback also exists in 2.1.193. |
| Cancellation policy | 2.1.88 has a Bash sibling-error cascade (`sibling_error`, `:43-48`, `:153-217`, `:360-362`). | That policy is absent from the 2.1.220 executor; the newer scheduler instead exposes end-conversation interruption, bridge-state wakeups, and same-turn tool context. |

**Cross-validation conclusion:** concurrency and ordering are stable invariants. Generation wakeups and
active compensation are later latency/rollback improvements, while Bash sibling cancellation was
removed rather than silently carried forward.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `StreamingToolExecutor` (`Wks`, `:331761`) - streaming scheduler and result owner
- `interleaveModelStreamWithToolDrain` (`gld`, `:332081`) - model/tool multiplexer
- `sweepInFlightToolsForFallback` (`non`, `:331733`) - fallback compensation and ID removal
- `createTurnAccumulator` (`Zcd`, `:336776`) - rebuilds the executor through its factory
- `runToolUse` (`oon`, `:425379`) - tool lookup, cancellation/isolation checks, and execution
- `resolveToolByNameOrAlias` (`Ic`, `:224038`) - session-aware tool lookup
- `applyToolContextLayers` (`Kir`, `:237877`) - serial context-layer application
