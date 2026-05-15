# Autocompact Thrash Loop Fix (v2.1.89)

**Changelog:** "Fixed autocompact thrash loop — now detects when context refills to the limit immediately after compacting three times in a row"
**Location:** `chunks.159.mjs:1379-1428` (the dispatcher), `chunks.159.mjs:1484` (the error message), `chunks.154.mjs:1023-1033` (the consumer)

## What it does

Detects when the autocompact subsystem enters a **pointless successful** loop: compact runs → context fills back to threshold within 3 turns → compact runs again → fills again → etc. After 3 such consecutive rapid-refills, the system stops trying and emits an actionable user-visible error explaining why.

This is the **second of two** independent circuit-breakers in `autocompactDispatcher`. The other (consecutive-failure breaker) was already tracked in v2.1.88 as a counter but had no *terminating* gate — v2.1.89 added that too. Together they form a dual safety net for the compaction loop.

## v2.1.88 baseline

`claude-code-kim/src/services/compact/autoCompact.ts:241-345` had the dispatcher but **no rapid-refill detection**:

```typescript
// v2.1.88 — claude-code-kim/src/services/compact/autoCompact.ts:240-280
export async function autoCompactIfNeeded(
  messages: Message[],
  toolUseContext: ToolUseContext,
  cacheSafeParams: CacheSafeParams,
  querySource?: QuerySource,
  tracking?: AutoCompactTrackingState,
  snipTokensFreed?: number,
): Promise<{
  wasCompacted: boolean
  compactionResult?: CompactionResult
  consecutiveFailures?: number
}> {
  if (isEnvTruthy(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false }
  }

  // Circuit breaker: stop retrying after N consecutive failures.
  // Without this, sessions where context is irrecoverably over the limit
  // hammer the API with doomed compaction attempts on every turn.
  if (
    tracking?.consecutiveFailures !== undefined &&
    tracking.consecutiveFailures >= MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES
  ) {
    return { wasCompacted: false }
  }
  // ... falls through to attempt compaction ...
}
```

The `consecutiveFailures` breaker existed (counter + gate). But there was **no** equivalent for the case where compaction *succeeds* but is **useless** — the agent compacts, the next 1-2 turns refill the context (e.g. a large tool result), and the dispatcher would happily compact again, and again, forever.

## v2.1.112 implementation

```javascript
// ============================================
// autocompactDispatcher - reactive compact with dual circuit-breakers
// Location: chunks.159.mjs:1379-1428
// ============================================

// ORIGINAL (for source lookup):
async function QkK(q, K, _, z, Y, A) {
    if (S6(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };

    // CIRCUIT-BREAKER A: consecutive failures
    if (Y?.consecutiveFailures !== void 0 && Y.consecutiveFailures >= wLK)
        return { wasCompacted: !1 };

    let O = K.options.mainLoopModel,
        w = K.getAppState().autoCompactWindow;
    if (!await gDY(q, O, w, z, A)) return { wasCompacted: !1 };

    // CIRCUIT-BREAKER B: rapid refill (NEW v2.1.89)
    let H = Y?.compacted === !0 && Y.turnCounter < a_7
          ? (Y?.consecutiveRapidRefills ?? 0) + 1
          : 0;
    if (H >= jLK)
        return E(`autocompact: rapid-refill breaker tripped — ${H} consecutive refills within <${a_7} turns each (last was ${Y?.turnCounter} turns)`,
                 { level: "warn" }),
               { wasCompacted: !1, rapidRefillBreakerTripped: !0 };

    let J = {
            isRecompactionInChain: Y?.compacted === !0,
            turnsSincePreviousCompact: Y?.turnCounter ?? -1,
            previousCompactTurnId: Y?.turnId,
            autoCompactThreshold: v38(O, w),
            querySource: z
        },
        X = FDY() && u8("tengu_cold_compact", !1);
    try {
        let M = await vI6(q, K, _, !0, void 0, !0, J, X);
        return UDY(K, O, w), bs(void 0), _F(z, K.setAppState, K.resultDedupState),
               { wasCompacted: !0, compactionResult: M, consecutiveFailures: 0, consecutiveRapidRefills: H }
    } catch (M) {
        if (b6(M).startsWith(GI6)) return { wasCompacted: !1 };  // PreCompact block — silent
        if (!p86(M, at)) j6(M);
        let W = (Y?.consecutiveFailures ?? 0) + 1;
        if (W >= wLK) E(`autocompact: circuit breaker tripped after ${W} consecutive failures — skipping future attempts this session`,
                       { level: "warn" });
        return { wasCompacted: !1, consecutiveFailures: W }
    }
}

// Constants in chunks.159.mjs:
// wLK = 3   — consecutive-failure threshold (line 1457)
// a_7 = 3   — turn-count window for "rapid" (line 1459)
// jLK = 3   — consecutive-rapid-refill threshold (line 1461)
// GI6 = "Compaction blocked by PreCompact hook" prefix

// READABLE (for understanding):
async function autocompactDispatcher(messages, ctx, sessionMemory, source, prevState, abortSignal) {
  if (parseExplicitTrue(process.env.DISABLE_COMPACT)) return { wasCompacted: false };

  // === Circuit-breaker A: consecutive failures ===
  if (prevState?.consecutiveFailures !== undefined &&
      prevState.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES /* = 3 */) {
    return { wasCompacted: false };
  }

  const model = ctx.options.mainLoopModel;
  const window = ctx.getAppState().autoCompactWindow;
  if (!await shouldCompact(messages, model, window, source, abortSignal)) {
    return { wasCompacted: false };
  }

  // === Circuit-breaker B: rapid-refill (compact → fill → compact again within 3 turns) ===
  const rapidCount = prevState?.compacted === true && prevState.turnCounter < RAPID_REFILL_TURN_WINDOW /* = 3 */
                    ? (prevState?.consecutiveRapidRefills ?? 0) + 1
                    : 0;
  if (rapidCount >= MAX_RAPID_REFILLS /* = 3 */) {
    log(`autocompact: rapid-refill breaker tripped — ${rapidCount} consecutive refills within <${RAPID_REFILL_TURN_WINDOW} turns each (last was ${prevState?.turnCounter} turns)`,
        { level: "warn" });
    return { wasCompacted: false, rapidRefillBreakerTripped: true };
  }

  const compactArgs = {
    isRecompactionInChain: prevState?.compacted === true,
    turnsSincePreviousCompact: prevState?.turnCounter ?? -1,
    previousCompactTurnId: prevState?.turnId,
    autoCompactThreshold: getCompactThreshold(model, window),
    querySource: source
  };
  const useColdCompact = isColdCompactEligible() && getFeatureValue("tengu_cold_compact", false);

  try {
    const result = await performCompaction(messages, ctx, sessionMemory, true, undefined, true,
                                            compactArgs, useColdCompact);
    return resetCompactState(ctx, model, window),
           clearProgressTimer(undefined),
           dedupSourceState(source, ctx.setAppState, ctx.resultDedupState),
           {
             wasCompacted: true,
             compactionResult: result,
             consecutiveFailures: 0,
             consecutiveRapidRefills: rapidCount  // carry forward — incremented above if rapid
           };
  } catch (err) {
    if (formatErrorDetail(err).startsWith(PRECOMPACT_BLOCKED_PREFIX)) {
      return { wasCompacted: false };  // PreCompact hook block: not a real failure
    }
    if (!isAbortError(err, abortToken)) logError(err);
    const newFailureCount = (prevState?.consecutiveFailures ?? 0) + 1;
    if (newFailureCount >= MAX_CONSECUTIVE_FAILURES /* = 3 */) {
      log(`autocompact: circuit breaker tripped after ${newFailureCount} consecutive failures — skipping future attempts this session`,
          { level: "warn" });
    }
    return { wasCompacted: false, consecutiveFailures: newFailureCount };
  }
}

// Mapping: QkK→autocompactDispatcher, q→messages, K→ctx, _→sessionMemory,
//          z→source, Y→prevState, A→abortSignal,
//          gDY→shouldCompact, vI6→performCompaction, UDY→resetCompactState,
//          FDY→isColdCompactEligible, b6→formatErrorDetail,
//          p86→isAbortError, j6→logError,
//          wLK→MAX_CONSECUTIVE_FAILURES, a_7→RAPID_REFILL_TURN_WINDOW,
//          jLK→MAX_RAPID_REFILLS, GI6→PRECOMPACT_BLOCKED_PREFIX
```

## Algorithm: Why Two Breakers?

| Breaker | Catches | Pathology example |
|---------|---------|-------------------|
| **A: consecutive failures ≥ 3** | Compactions that *crash* (API errors, timeout, malformed tool output) | Compactor model returns malformed JSON; every attempt throws |
| **B: consecutive rapid refills ≥ 3** | Compactions that *succeed but are useless* (context immediately re-fills) | User repeatedly Reads a 50KB file; each compaction frees space, but the next Read refills it |

**A failure counter alone wouldn't catch the "compaction succeeds but is useless" pattern.** A rapid-refill counter alone wouldn't catch outright crashes. Both are needed.

**Why three for both:**
- 1 isn't enough — transient blips (one bad turn, one large tool output) shouldn't trip a breaker.
- 2 is too eager — many sessions legitimately compact, refill once because of recent context-heavy turns, then settle.
- 3 is the sweet spot empirically — three consecutive symptoms is strong evidence of a real pathological loop.

## The Rapid-Refill State Machine

The `tracking` object passed across invocations holds these fields:

```typescript
type AutoCompactTrackingState = {
  compacted: boolean              // did the previous turn compact?
  turnId: string                  // UUID of the last compact (for logging)
  turnCounter: number             // turns since the last compact (0 = compact happened *this* turn)
  consecutiveFailures: number     // increments on each throw
  consecutiveRapidRefills?: number  // increments when (compacted=true AND turnCounter < 3)
}
```

The state transitions:

```
                            Turn N+1, N+2, ... (turnCounter increments each turn
                            until next compact)
                                       │
                                       ▼
Turn N: compact succeeds            ┌──────────────────────────────────┐
─────────────────────────────       │  When NEXT compact happens:       │
state = {                            │                                   │
  compacted: true,                   │  if turnCounter < 3:              │
  turnId: "abc",                     │    "rapid refill"                 │
  turnCounter: 0,                    │    consecutiveRapidRefills += 1   │
  consecutiveFailures: 0,            │                                   │
  consecutiveRapidRefills: 0         │  if turnCounter >= 3:             │
}                                    │    "normal refill"                │
                                     │    consecutiveRapidRefills = 0    │
                                     │    (reset — not a thrash)         │
                                     └──────────────────────────────────┘
```

After 3 rapid refills, the next call short-circuits **before** running compaction and returns `{rapidRefillBreakerTripped: true}`.

## The Consumer

In `chunks.154.mjs:1023-1033`, the agent loop receives the `rapidRefillBreakerTripped` flag:

```javascript
// chunks.154.mjs:1023-1033 (simplified)
const { compactionResult, consecutiveFailures, consecutiveRapidRefills, rapidRefillBreakerTripped }
  = await context.autocompact(messages, ctx, ...);

if (rapidRefillBreakerTripped) {
  emit("tengu_auto_compact_rapid_refill_breaker", {
    consecutiveRapidRefills: prevState?.consecutiveRapidRefills ?? 0,
    turnsSincePreviousCompact: prevState?.turnCounter ?? -1,
    queryChainId, queryDepth
  });
  yield buildErrorMessage({
    content: THRASH_ERROR_MESSAGE,
    error: "invalid_request"
  });
  return { reason: "rapid_refill_breaker" };
}
```

The `THRASH_ERROR_MESSAGE` (chunks.159.mjs:1484):

```
Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3 times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.
```

## Why this approach

**The actionable error message is the key design choice.** When the breaker trips, the user sees a specific, helpful error — not a vague "something went wrong":

| What the message tells the user | Why it matters |
|----------------------------------|---------------|
| "the context refilled to the limit within 3 turns" | Names the symptom precisely |
| "3 times in a row" | Communicates the consecutive-detection logic |
| "A file being read or a tool output is likely too large" | Points to the most common cause (large Read or Bash output) |
| "Try reading in smaller chunks" | Actionable advice — uses Read with offset/limit |
| "use /clear to start fresh" | Escape hatch — fully reset state |

**Why a per-session breaker, not a per-attempt one:**

The breaker state lives in `tracking` which threads through the agent loop. It's **not** a global flag. This means:
- A `/clear` resets it (new conversation = new tracking object).
- A `--resume` resumes with the prior tracking state intact.
- Different sub-agents have their own tracking (each agent's loop has its own tracker).

This per-loop scope is correct — a thrash in one sub-agent shouldn't kill the parent.

**Alternative considered:** Make the breaker advisory (log warning, allow next attempt). Rejected because:
- Without the gate, the loop is genuinely infinite — the model would compact, get a 200K-token result, fail to fit it, compact again, forever, burning Anthropic compute and user budget.
- The breaker IS the safety net; if it's advisory, there's no safety net.

**Alternative considered:** Make the threshold tunable via env var. Rejected (kept hardcoded at 3) because:
- Tunable thresholds invite "set it to 99 and pretend the bug isn't there" anti-patterns.
- 3 is empirically the right number; no real workload hits it without a genuine pathology.

## Key Insight

The dual breaker isn't a single "thrash detector" — it's a **symptom-disambiguation** system. The two breakers ask:

- **A: Is compaction failing?** → API errors, malformed outputs → "retry doesn't help, stop."
- **B: Is compaction succeeding but useless?** → Context refills immediately → "the real problem isn't compaction, it's the input size, stop and tell the user."

By exposing the **specific symptom** through the message ("refilled to limit" vs "consecutive failures"), the user can correctly diagnose:

| Symptom | What to try |
|---------|-------------|
| Rapid-refill breaker (B) | Read in smaller chunks; check if a tool produces huge output; /clear |
| Consecutive-failure breaker (A) | Check API health; check for malformed user input; restart |

A single "compaction broke" error would leave the user guessing. The split is the whole point.

## Related symbols

- `autocompactDispatcher` (`QkK`) at chunks.159.mjs:1379
- `shouldCompact` (`gDY`) at chunks.159.mjs (predicate)
- `performCompaction` (`vI6`) at chunks.159.mjs:574
- `resetCompactState` (`UDY`) at chunks.159.mjs:1430
- `isColdCompactEligible` (`FDY`) - predicate for cold-compact mode
- `MAX_CONSECUTIVE_FAILURES` (`wLK = 3`) at chunks.159.mjs:1457
- `RAPID_REFILL_TURN_WINDOW` (`a_7 = 3`) at chunks.159.mjs:1459
- `MAX_RAPID_REFILLS` (`jLK = 3`) at chunks.159.mjs:1461
- `THRASH_ERROR_MESSAGE` (`okK`) at chunks.159.mjs:1484
- `PRECOMPACT_BLOCKED_PREFIX` (`GI6`) - error prefix from a PreCompact hook block (different path)

See [../07_compact/edge_cases_and_failures.md](../07_compact/edge_cases_and_failures.md) for the full compaction error catalog, and [../07_compact/trigger_mechanism.md](../07_compact/trigger_mechanism.md) for the threshold math that drives `shouldCompact`.
