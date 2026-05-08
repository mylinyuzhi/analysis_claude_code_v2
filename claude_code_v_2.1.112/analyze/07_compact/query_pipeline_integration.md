# Query Pipeline Integration — How Compact Hooks Into the Agent Loop

## Overview

The compact subsystem integrates with the agent's per-turn loop through two call sites in `chunks.154.mjs:880-1226` (the `yy` query function). After each assistant response, the loop calls:

1. **`H.microcompact(...)`** at chunks.154.mjs:1006 — the per-turn microcompact entry, which is currently a no-op (`_c` stub).
2. **`H.autocompact(...)`** at chunks.154.mjs:1010-1022 — the per-turn autocompact entry, which dispatches through `QkK`.

Together, these calls run on **every** turn before the next assistant action. They are the heartbeat of compact in v2.1.112.

This document covers the call sites, the arguments passed, the result handling, and the rapid-refill error yielding flow.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Agent loop

Key functions in this document:
- `agentMainLoop` (`yy`) — chunks.154.mjs:880 — The main query function
- `microcompactStub` (`_c`) — chunks.85.mjs:1207
- `autocompactDispatcher` (`QkK`) — chunks.159.mjs:1379
- `markPerformance` (`Y9`) — referenced (telemetry timing)
- `emitTelemetry` (`d`) — referenced
- `yieldUserError` (`_9`) — referenced (yields a user-error message)

Constants:
- `okK` — rapid-refill error template

---

## 1. The Per-Turn Microcompact Call

```javascript
// chunks.154.mjs:1006 (excerpt — actual line position approximate)
let { messages: U } = await H.microcompact(messages, toolUseContext, querySource);
```

`H` is the dependency-injection object for the loop. `H.microcompact` is wired to `_c` (microcompactStub):

```javascript
// chunks.85.mjs:1207-1211
async function _c(q, K, _) {
    return a04(), { messages: q }
}
```

In v2.1.112, this is a no-op:
- Calls `a04()` to clear the cache-deletion-suppression flag (UI side effect).
- Returns the input messages unchanged.

So `U = messages` after this call. The loop continues with the unchanged messages.

### Why call a no-op?

Three reasons:
1. **Future-compatibility**: future versions may reintroduce proactive MC. Keeping the call site avoids a code-shape change.
2. **UI flag management**: `a04` clears a UI flag that the loop relies on.
3. **Consistency with autocompact**: both compact entry points are called the same way (per-turn), making the loop structure regular.

See [microcompaction.md](./microcompaction.md) for why proactive MC was removed.

---

## 2. The Per-Turn Autocompact Call

```javascript
// chunks.154.mjs:1010-1022 (excerpt)
Y9("query_autocompact_start");
let {
    compactionResult: e,
    consecutiveFailures: i,
    consecutiveRapidRefills: O6,
    rapidRefillBreakerTripped: J6
} = await H.autocompact(U, v, {
    systemPrompt: _,
    userContext: z,
    systemContext: Y,
    toolUseContext: v,
    forkContextMessages: U
}, w, g, n);
if (Y9("query_autocompact_end"), J6) return d("tengu_auto_compact_rapid_refill_breaker", {
    consecutiveRapidRefills: g?.consecutiveRapidRefills ?? 0,
    turnsSincePreviousCompact: g?.turnCounter ?? -1,
    queryChainId: F,
    queryDepth: S.depth
}), yield _9({
    content: okK,
    error: "invalid_request"
}), {
    reason: "rapid_refill_breaker"
};
```

### Argument-by-Argument

`H.autocompact` resolves to `QkK`. Arguments:

| Position | Symbol | Source | Purpose |
|----------|--------|--------|---------|
| 1 (`q`) | `U` | from microcompact result | Messages |
| 2 (`K`) | `v` | toolUseContext | Session context |
| 3 (`_`) | object | inline | cacheSafeParams (`{systemPrompt, userContext, systemContext, toolUseContext, forkContextMessages}`) |
| 4 (`z`) | `w` | local var | querySource |
| 5 (`Y`) | `g` | local var | tracking object (consecutiveFailures, consecutiveRapidRefills, turnCounter, etc.) |
| 6 (`A`) | `n` | local var | snipTokensFreed (initialized to 0 at line 1005, never reassigned) |

The 6th argument (`n`) is **always 0 in v2.1.112**. This is the vestigial Snip parameter — the wiring exists but no caller passes a non-zero value. See [dead_code_audit.md](./dead_code_audit.md).

### Result Handling

The destructured result has 4 fields:

| Field | Source | Purpose |
|-------|--------|---------|
| `compactionResult: e` | `vI6`'s return value | The compact result if successful |
| `consecutiveFailures: i` | `tracking.consecutiveFailures` | Updated count |
| `consecutiveRapidRefills: O6` | `tracking.consecutiveRapidRefills` | Updated count |
| `rapidRefillBreakerTripped: J6` | true if breaker tripped | Triggers user-visible error |

The loop reads these and updates its own tracking state for the next iteration.

### Rapid-Refill Breaker Path

```javascript
if (J6) return d("tengu_auto_compact_rapid_refill_breaker", {
    consecutiveRapidRefills: g?.consecutiveRapidRefills ?? 0,
    turnsSincePreviousCompact: g?.turnCounter ?? -1,
    queryChainId: F,
    queryDepth: S.depth
}), yield _9({
    content: okK,
    error: "invalid_request"
}), {
    reason: "rapid_refill_breaker"
};
```

When `rapidRefillBreakerTripped` is true:
1. **Telemetry fires**: `tengu_auto_compact_rapid_refill_breaker` with refill count, turns since prev, query chain ID, depth.
2. **Yield user error**: `yield _9({content: okK, error: "invalid_request"})` — the loop yields a user-visible error message (the `okK` thrash explanation).
3. **Return from loop**: `{reason: "rapid_refill_breaker"}` — the loop terminates with this reason.

This is the **only autocompact-related path that surfaces a user-visible error**. All other autocompact failures are silent.

### Telemetry Bracketing

```javascript
Y9("query_autocompact_start");
// ... await H.autocompact(...) ...
Y9("query_autocompact_end");
```

`Y9` marks performance timing. The brackets let the telemetry team measure how long autocompact takes per turn. Useful for:
- Detecting performance regressions.
- Distinguishing fast skips (gates fail early) from full compact runs (fully execute).
- Correlating with user-perceived latency.

---

## 3. The Loop's Tracking State

The `g` argument (5th param to `H.autocompact`) is the tracking state. The loop maintains it across iterations:

```typescript
// Conceptual structure (actual variable name is g)
{
  compacted: boolean,                        // Did the previous turn trigger a compact?
  turnCounter: number,                       // Turns since last compact
  turnId: string,                            // ID of last compacted turn
  consecutiveFailures: number,               // Failure count
  consecutiveRapidRefills: number,           // Rapid-refill count
}
```

Each iteration:
- Reads the previous tracking state.
- Calls `H.autocompact` which returns updated state.
- Updates local tracking with the result.
- Increments `turnCounter` if no compact happened.

### Reset Conditions

```
Successful compact:
  tracking.compacted = true
  tracking.turnId = current turn ID
  tracking.turnCounter = 0
  tracking.consecutiveFailures = 0
  tracking.consecutiveRapidRefills = (calculated based on rapid-refill check)

Failed compact:
  tracking.compacted = false (or unchanged)
  tracking.consecutiveFailures += 1
  tracking.consecutiveRapidRefills = unchanged

No compact (gate failed):
  tracking.compacted = false (or unchanged)
  tracking.turnCounter += 1
```

These transitions match what the dispatcher (`QkK`) returns in its `wasCompacted`, `consecutiveFailures`, `consecutiveRapidRefills` fields.

---

## 4. Per-Turn Sequencing

The compact calls fit into a larger per-turn sequence. The conceptual flow is:

```
┌─────────────────────────────────────────────────────────────────┐
│ Turn N starts                                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ User input received (or system event triggers turn)              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Microcompact (H.microcompact → _c) — no-op stub                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Autocompact (H.autocompact → QkK)                                │
│ - Apply 5 gates                                                  │
│ - If gates pass: vI6 (full compact)                              │
│ - Update tracking state                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                        Rapid-refill?
                              │
                              ├── Yes → yield okK error, exit loop
                              │
                              No
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Build API request                                                │
│ - Apply context_management edits if latched                     │
│ - Add context-hint beta if applicable                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ API call (eb6)                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                       Response received
                              │
                              ├── 200 success → use response
                              │
                              ├── 422/424 + context-hint
                              │     → d85 reject handler
                              │     → retry with cleared messages
                              │
                              └── Other error → propagate
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Process tools, yield content                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Turn N ends, loop continues to Turn N+1                          │
└─────────────────────────────────────────────────────────────────┘
```

### Order Matters

- **Microcompact before autocompact**: in v2.1.112 this doesn't matter (microcompact is no-op), but in legacy versions microcompact would reduce token count and autocompact would re-evaluate based on the reduced count.
- **Compact before API call**: ensures the request to the API uses the compacted messages, not the pre-compact ones.
- **Context-hint reject after API call**: only reachable if the API call returned an overflow status. Recovers, then retries.

---

## 5. The 6th Argument (`n`) — The Vestigial Snip

```javascript
// chunks.154.mjs:1005 (initialization)
let n = 0;
// ...
// chunks.154.mjs:1010-1011 (call)
let { ... } = await H.autocompact(U, v, {...}, w, g, n);
```

`n` is initialized to `0` at line 1005 and never reassigned before line 1010. So it's always `0` when passed to `H.autocompact`.

This corresponds to `snipTokensFreed` in `gDY`. The parameter exists in the function signature but no caller ever passes a meaningful value. The path was meant for a Snip implementation that never landed — see [dead_code_audit.md](./dead_code_audit.md).

The flow is:
- `n = 0` (initialized in loop)
- `n` passed as 6th arg to `H.autocompact` → `A` in `QkK`
- `A` passed as 5th arg (5-indexed from 0) to `gDY`: `await gDY(q, O, w, z, A)` → `Y` in `gDY`
- `gDY`'s `Y = 0` default kicks in if `A` is undefined; here it's 0 explicitly.
- `gDY` computes `tokenCount = vJ(q) - Y = vJ(q) - 0 = vJ(q)`.

So the parameter has no effect — it's purely vestigial wiring.

---

## 6. The `cacheSafeParams` Object

The 3rd argument to `H.autocompact` is an inline object:

```javascript
{
    systemPrompt: _,                  // The agent's system prompt
    userContext: z,                   // User-provided context attachments
    systemContext: Y,                 // System-context attachments
    toolUseContext: v,                // Tool-use context (deps for tool calls)
    forkContextMessages: U            // Messages (also passed as arg 1)
}
```

This object is passed through to `vI6` as the `_` (`deps`) argument, then forwarded to `ALK` as `cacheSafeParams: A`. `ALK` uses these to:
- Build the API request body in the standard call.
- Issue the cache-prefix call with the same parameters (so it shares the cache).

The duplication of `forkContextMessages: U` and the messages arg is intentional — `vI6` may modify the messages during PTL retry (`KLK` truncation) but `cacheSafeParams.forkContextMessages` is updated separately:

```javascript
// chunks.159.mjs:618-620 (in vI6's PTL retry loop)
G = $6;
f = {...f, forkContextMessages: $6};
```

This synchronization ensures the retry call uses consistent messages everywhere.

---

## 7. The `querySource` Field (`w`)

```javascript
// chunks.154.mjs:1010 (passed as 4th arg to H.autocompact)
await H.autocompact(U, v, {...}, w, g, n);
```

`w` is the querySource string. Values include:
- `"repl_main_thread"` — main REPL session
- `"agent:<agentId>"` — subagent invocation
- `"compact"` — recursive query during compaction
- `"session_memory"` — session-memory operations
- `"task:<taskId>"` — task-launched query

The `gDY` shouldCompact check uses this:

```javascript
// chunks.159.mjs:1366
if (z === "session_memory" || z === "compact") return !1;
```

Source-based exclusions prevent recursive compaction:
- A query running *during* compact (source = "compact") shouldn't itself trigger another compact.
- A session-memory query is short-lived and doesn't need compact.

---

## 8. The Per-Turn Loop Outer Structure

```javascript
// chunks.154.mjs:880-1226 (conceptual structure)
async function* yy(...) {
    let n = 0;                             // snipTokensFreed (vestigial)
    let g = { /* tracking state */ };       // compact tracking
    let messages = ...;                     // initial messages
    let querySource = w;
    let toolUseContext = v;

    while (loopShouldContinue) {
        // ... user input handling, system events ...

        // Microcompact (no-op stub)
        let { messages: U } = await H.microcompact(messages, toolUseContext, querySource);

        // Autocompact
        Y9("query_autocompact_start");
        let { compactionResult: e, consecutiveFailures: i, consecutiveRapidRefills: O6,
              rapidRefillBreakerTripped: J6 } =
            await H.autocompact(U, v, {systemPrompt: _, userContext: z, systemContext: Y,
                                       toolUseContext: v, forkContextMessages: U}, w, g, n);
        Y9("query_autocompact_end");

        // Rapid-refill breaker
        if (J6) {
            d("tengu_auto_compact_rapid_refill_breaker", {...});
            yield _9({content: okK, error: "invalid_request"});
            return {reason: "rapid_refill_breaker"};
        }

        // Update tracking
        if (e) {
            g.compacted = true;
            g.turnCounter = 0;
            g.turnId = e.boundaryMarker.uuid;
            g.consecutiveFailures = i ?? 0;
            g.consecutiveRapidRefills = O6 ?? 0;
            messages = [/* compacted messages from e */];
        } else {
            g.consecutiveFailures = i ?? g.consecutiveFailures;
            g.turnCounter += 1;
        }

        // Build API request
        // ... eb6 call ...
        // ... process response ...
        // ... yield content ...
    }
}
```

The loop's structure makes clear that compact is **just one phase** of each turn — it's not the dominant operation. Most turns have it complete in milliseconds (gates fail, no compact runs). Only when threshold is crossed does it take significant time (5-15s for full compact).

---

## 9. The Two Loops: yy and the Compact's Inner Loop

There's a subtle distinction:

- **`yy` loop**: the outer agent loop (one iteration per user turn).
- **Inner PTL loop in `vI6`**: retries up to 3 times if compact PTL.

These are nested:

```
yy (outer loop)
└── Per turn:
    └── H.autocompact → QkK → vI6
        └── Inner PTL loop:
            └── ALK call (1-3 attempts with KLK truncation between)
```

The outer loop runs once per user turn. The inner loop runs multiple times only when the compact LLM call returns PTL.

---

## 10. Performance Characteristics

For a typical turn:

| Phase | Duration | Notes |
|-------|----------|-------|
| Microcompact (`_c` stub) | <1ms | No-op |
| Autocompact gates (1-4) | <10ms | Token estimation + flag checks |
| `vI6` (when fired) | 5-15s | Full LLM call |
| API call | 500ms-30s | Streaming response |

So the per-turn compact cost is **near-zero in most turns** (gates fail), with occasional spikes (5-15s) when compact actually runs.

The user-perceived latency for compact is hidden:
- Compact runs **between** turns, before the next API call.
- The API call cost itself is unaffected (no compact during streaming).
- Only the gap between user input and assistant response can include compact time.

---

## 11. Performance Marks (`Y9`)

```javascript
Y9("query_autocompact_start");
// ...
Y9("query_autocompact_end");
```

`Y9` likely uses `performance.mark()` or similar. Let analysts compute compact duration distributions:
- Median compact-phase time
- p99 compact-phase time
- Distribution of fast-skip vs full-compact times

This data feeds into:
- Threshold tuning (compact threshold vs latency budget)
- Cold-compact decisions (the cache-cold strip mode trades quality for speed)
- Cache-prefix optimization validation (does it actually save time?)

---

## 12. The Subagent Loop

Subagent invocations also run a similar loop, but:
- Subagents have their own `agentId`.
- Their `querySource` typically contains their agent ID.
- Their compact tracking is **separate** from the main thread.
- Their compact may use different thresholds (subagent context windows can differ).

The subagent loop is in chunks.155.mjs (separate from `yy` in chunks.154.mjs). The compact integration is structurally similar but uses subagent-specific configuration.

A consequence: a heavy subagent that fills its own context will autocompact independently. The main thread's autocompact tracking is unaffected.

---

## 13. Integration with Plan Mode

Plan mode restricts agent capabilities (only research tools, no mutations). Compact operates *across* plan-mode boundaries:

- A user in plan mode can trigger autocompact normally.
- The compact LLM call uses its own permission stub (`Or1()`), not the agent's plan-mode restrictions.
- Post-compact, plan mode is preserved via `Lx8` reminder attachment.

So compact doesn't break plan mode — it can be invoked, complete, and the agent stays in plan mode afterwards.

---

## 14. Integration with Background Agents

Background agents (long-running async tasks) have their own context. Their compact behavior:

- Each background agent runs in its own loop with its own tracking state.
- Background-agent compacts don't affect main-thread tracking.
- After a background-agent compact, the agent's task status (via `hx8`) is updated and may surface to the main thread on next interaction.

This isolation lets background agents run for hours without impacting main-thread behavior.

---

## 15. The Loop's Role in `consecutiveRapidRefills` Calculation

The dispatcher (`QkK`) does the math:

```javascript
// chunks.159.mjs:1391-1393
let H = Y?.compacted === !0 && Y.turnCounter < a_7
    ? (Y?.consecutiveRapidRefills ?? 0) + 1
    : 0;
```

But the **loop** is what populates `Y.compacted` and `Y.turnCounter`. After a successful compact:
- Loop sets `g.compacted = true`, `g.turnCounter = 0`.
- Next turn: `g.turnCounter = 1`.
- Next next: `g.turnCounter = 2`.

When the next compact triggers:
- `Y.compacted === true` ✓
- `Y.turnCounter === 2 < 3` ✓
- `consecutiveRapidRefills` increments.

If three consecutive cycles happen (each compact within 2 turns of the previous), the breaker trips on the third. The loop yields the `okK` user error and exits.

This calculation requires the loop to be honest about state transitions. A subtle bug in the loop's tracking would make the breaker either trip too early or never trip.

---

## 16. Summary of Loop-Compact Interaction

| Interaction | What loop does | What compact does |
|-------------|----------------|-------------------|
| Per-turn entry | Calls `H.microcompact`, then `H.autocompact` | Stub returns unchanged; dispatcher applies gates |
| Successful compact | Updates messages, resets tracking | Returns new messages + boundary marker |
| Failed compact | Increments failure count | Returns failure state |
| Rapid-refill breaker | Yields user error, exits | Returns breaker-tripped flag |
| Manual `/compact` | Routes through slash command, not the loop | `JLY` calls `vI6` directly |
| Context-hint reject | Inside the API call layer, not the loop | `d85` modifies messages, retries request |

The loop is the **orchestrator**; compact is the **mechanism**. The loop decides when to ask for compact; compact decides whether and how.

---

## 17. Key Insight

The agent loop's compact integration is **lightweight by design**:

- The per-turn cost is one cheap function call (`_c` no-op + `QkK` gates → typically <10ms).
- Heavy work (full compact) only fires when thresholds are crossed.
- The loop doesn't know or care about compact internals — it just gives the dispatcher a chance, takes the result, and continues.

This separation of concerns is what makes both systems independently iterable:
- The loop can change its turn structure without affecting compact internals.
- Compact can change its phase ordering without affecting the loop.
- The contract is a simple interface: messages in, messages out, plus tracking metadata.

The few places where the loop **does** know about compact internals (the `okK` rapid-refill error yielding, the tracking state structure) are minimal and stable. They've remained largely unchanged across the v2.1.x line, suggesting the abstraction boundary is well-chosen.
