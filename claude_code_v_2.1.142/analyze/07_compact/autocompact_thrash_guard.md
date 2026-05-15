# Autocompact Thrash Guard — Two Breakers, Two Stories (v2.1.142)

## Overview

Autocompact has two distinct circuit-breaker mechanisms that disable proactive compaction under different pathologies. Both stop at three consecutive triggers, but their definitions of "consecutive" differ:

1. **Consecutive-failure breaker** (`MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` = 3): tracks compactions that *threw an exception* — API errors, network blips, prompt-too-long-on-summarize-call. Introduced in v2.1.89. Catches an "irrecoverably-over-the-limit" pathology where every compaction attempt fails the same way.
2. **Rapid-refill breaker** (`MAX_CONSECUTIVE_RAPID_REFILLS` = 3): tracks compactions that *succeeded* but were followed by *another* compaction within `RAPID_REFILL_TURN_WINDOW` = 3 turns. Catches a "thrashing" pathology where the user's workflow keeps refilling the context faster than compaction can keep up.

This document walks through:
1. The consecutive-failure breaker's state machine and trigger condition
2. The rapid-refill breaker's state machine and trigger condition
3. The actionable error message presented to the user
4. The crucial special case: PreCompact-hook blocks are *not* failures (see [precompact_hook_interaction.md](./precompact_hook_interaction.md))
5. How both breakers interact with reactive compact's failure tracking
6. The thrashing-pathology user message and recovery options

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact module
> - [symbol_additions_v2_1_142_compact_arch.md](../00_overview/symbol_additions_v2_1_142_compact_arch.md) - This unit
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - Unit 11

Key functions in this document:
- `autoCompactGenerator` (`Fo7`) - Top of the proactive lane; where both breakers are checked
- `computeRapidRefillStreak` (`Wy6`) - Computes the in-progress rapid-refill streak
- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`DH4`) = 3 - Failure breaker limit
- `RAPID_REFILL_TURN_WINDOW` (`PI6`) = 3 - Turns within which a re-fill is "rapid"
- `MAX_CONSECUTIVE_RAPID_REFILLS` (`NO8`) = 3 - Rapid-refill streak limit
- `AUTOCOMPACT_THRASHING_MESSAGE` (`Py6`) - The user-facing error string
- `PRECOMPACT_BLOCKED_PREFIX` (`$rH`) - Used to short-circuit the failure counter for hook-blocks
- `USER_ABORT_PATTERN` (`Gb`) = "API Error: Request was aborted." - Doesn't count as failure either

---

## 1. Consecutive-Failure Breaker (v2.1.89)

### State

The breaker state lives in `AutoCompactTrackingState`, threaded through the agent loop's per-turn state:

```typescript
type AutoCompactTrackingState = {
  compacted: boolean;            // Whether last turn compacted
  turnCounter: number;           // Turns since last compact
  turnId: string;                // UUID stamped on the last compact
  consecutiveFailures?: number;  // Failure counter (THIS doc)
  consecutiveRapidRefills?: number; // Rapid-refill counter (next section)
}
```

`consecutiveFailures` is checked at the top of `Fo7` and incremented in the catch block. It survives across turns because the agent loop reads/writes it via `tracking` argument.

### Algorithm: When Counter Increments

**What it does:** Counts compactions that threw exceptions and stops trying after 3 in a row.

**How it works:**

```javascript
// (cli_inner_pretty.js:408425-408444)
try {
  let j = yield* Zy6((J) => qrH(H, J, q, !0, void 0, !0, M, w, D), $);
  return (Bn(K, $.setAppState, $.agentId), { wasCompacted: !0, compactionResult: j, consecutiveFailures: 0, consecutiveRapidRefills: O });
} catch (j) {
  if (ZH(j).startsWith($rH)) return { wasCompacted: !1 };  // BLOCKED BY HOOK: no counter bump
  if (!Bd(j, Gb))                                            // NOT USER ABORT: log
    if (tu(ZH(j)) || Bd(j, UM8) || Bd(j, yrH)) N(`autocompact failed: ${ZH(j)}`, { level: "error" });
    else EH(j);
  let X = (_?.consecutiveFailures ?? 0) + 1;
  if (X >= DH4)
    (N(`autocompact: circuit breaker tripped after ${X} consecutive failures — skipping future attempts this session`, { level: "warn" }),
     d("tengu_auto_compact_circuit_breaker", { consecutiveFailures: X }));
  return { wasCompacted: !1, consecutiveFailures: X };
}
```

Three conditions reset the counter to 0 (line 408429):
- Compaction succeeds
- The loop returns `{ wasCompacted: true, ..., consecutiveFailures: 0 }`

Four conditions *don't* count as failures (don't bump the counter):
1. PreCompact hook blocked the compaction (`$rH` prefix on Error) — line 408432
2. User pressed Esc (`Gb` = "API Error: Request was aborted.") — implicit in line 408433's `!Bd(j, Gb)` check around the log
3. (Implicitly) The compact wasn't even attempted (caller returned `{wasCompacted: false}` before the try block — e.g. `shouldAutoCompactNow` returned false)

The counter only bumps on *thrown exceptions* during the compact call itself.

### What's at Top: The Read-Side Check

```javascript
// (cli_inner_pretty.js:408402)
if (_?.consecutiveFailures !== void 0 && _.consecutiveFailures >= DH4) return { wasCompacted: !1 };
```

Once the counter hits 3, every subsequent invocation short-circuits and returns immediately without trying. The session continues to function — autocompact just stops attempting. The user sees:
- Context fills up to the threshold and the threshold pass-through warning shows ("/compact recommended")
- But no actual autocompact fires
- They have to manually `/compact` or `/clear` to recover

### Trade-off: Why exactly 3?

The 2026-03-10 production rationale (commented in autoCompact.ts:67-69):
> 1,279 sessions had 50+ consecutive failures (up to 3,272) in a single session, wasting ~250K API calls/day globally.

The pathology: a session has more tokens than even `truncateHeadForPTLRetry` can salvage (the conversation is genuinely irrecoverable, e.g. a massive file pasted into a 200k-window session). Without the breaker, autocompact retries every turn — each turn = one wasted compaction API call + the failed retry. With 3,272 consecutive failures in one session, that's 3,272 wasted compaction API calls.

The 3-attempt threshold balances:
- **Too low (1 or 2):** Transient API failures (rate limits, network blips) would falsely trip the breaker.
- **Too high (5+):** Each false attempt = one wasted API call. At 3 attempts max, the bad-session waste is bounded to 3 API calls per session.

In normal operation, two consecutive failures should be vanishingly rare — most compact failures are one-off (a transient 429, a timeout). Three in a row strongly indicates a structural problem.

---

## 2. Rapid-Refill Breaker (v2.1.142 fully developed)

### Story: "Thrashing" Pathology

A session compacts successfully, then within 3 turns the context fills *back up* to the threshold and triggers another compact. That's a thrash signal — the user is doing something that's instantly refilling the context (typically reading a huge file or running a command with massive output).

The pathology is qualitatively different from the failure breaker:
- Failure breaker: compactions fail. User can't recover.
- Rapid-refill breaker: compactions succeed but achieve nothing. User pays for compaction without benefit.

### Algorithm: How the Streak is Counted

**What it does:** Tracks whether a turn that *just compacted* re-triggers compaction within the next 3 turns.

**How it works:**

```javascript
// ============================================
// computeRapidRefillStreak - In-progress streak counter
// Location: cli_inner_pretty.js:408349-408351
// ============================================

// ORIGINAL (for source lookup):
function Wy6(H) { return H?.compacted === !0 && H.turnCounter < PI6 ? (H?.consecutiveRapidRefills ?? 0) + 1 : 0; }

// READABLE (for understanding):
function computeRapidRefillStreak(tracking) {
  // We're in a rapid-refill streak if:
  //   1. Last turn(s) did compact (`tracking.compacted === true`)
  //   2. We're within RAPID_REFILL_TURN_WINDOW turns of that compact (`tracking.turnCounter < PI6`)
  // If both are true, we're about to add another compaction to the streak — increment counter.
  // Otherwise the streak is broken, reset to 0.
  if (tracking?.compacted === true && tracking.turnCounter < RAPID_REFILL_TURN_WINDOW) {
    return (tracking?.consecutiveRapidRefills ?? 0) + 1;
  }
  return 0;
}

// Mapping: Wy6->computeRapidRefillStreak, PI6->RAPID_REFILL_TURN_WINDOW
```

The check is per-call:

```javascript
// (cli_inner_pretty.js:408406-408415)
let O = Wy6(_);
if (O >= NO8)
  return (N(`autocompact: rapid-refill breaker tripped — ${O} consecutive refills within <${PI6} turns each (last was ${_?.turnCounter} turns)`, { level: "warn" }),
    J8("compact_auto", "compact_auto_rapid_refill_breaker"),
    { wasCompacted: !1, rapidRefillBreakerTripped: !0 });
```

Walk through a thrash scenario step-by-step:

| Turn | Pre-turn state | `Wy6(_)` result | Effect |
|------|----------------|-----------------|--------|
| T0 | Fresh, threshold not crossed | n/a | Normal turn |
| T1 | Threshold crossed, `compacted=false` | 0 (compacted was false) | Compact runs; tracking now has `compacted=true, turnCounter=0, consecutiveRapidRefills=0` |
| T2 | One turn later, no fill yet | n/a (didn't trigger) | Normal turn; tracking has `compacted=true, turnCounter=1, consecutiveRapidRefills=0` |
| T3 | User reads a huge file, refills context | `Wy6` returns 1 (compacted=true, turnCounter=1 < 3) | Compact runs; tracking has `compacted=true, turnCounter=0, consecutiveRapidRefills=1` |
| T4 | One turn later | n/a | tracking: `compacted=true, turnCounter=1, consecutiveRapidRefills=1` |
| T5 | Another huge file, refills | `Wy6` returns 2 (compacted=true, turnCounter=1 < 3) | Compact runs; tracking has `compacted=true, turnCounter=0, consecutiveRapidRefills=2` |
| T6 | Another huge file, refills *immediately* | `Wy6` returns 3 (compacted=true, turnCounter=0 < 3) | **Breaker trips** — compaction does NOT run, error message shown |

**Why "compacted" tracking resets `turnCounter`:**

`turnCounter` resets to 0 every time compaction *succeeds*. So `turnCounter < 3` means "within 3 turns since last successful compact". The breaker isn't sensitive to *time*, only *turns*.

**Why `consecutiveRapidRefills` doesn't reset on `compacted=false`:**

A turn without compaction doesn't reset the streak — it just doesn't increment it. The streak only resets when:
- Compaction succeeds with non-rapid refill window (`turnCounter >= 3`)
- Compaction *doesn't happen* and several turns pass without re-triggering (`compacted` may stay true if last compact was recent, but eventually turnCounter exceeds the window and any subsequent compact resets to 0)

This is a subtle non-symmetry from the failure breaker — failures are an action, rapid refills are a *pattern across multiple successes*.

### What the User Sees

The breaker trip records a special telemetry category and emits a `wasCompacted: false, rapidRefillBreakerTripped: true` return, which causes the loop to surface the actionable message:

```javascript
// (cli_inner_pretty.js:408513)
Py6 = `Autocompact is thrashing: the context refilled to the limit within ${PI6} turns of the previous compact, ${NO8} times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.`;
```

The message:
- Names the pathology ("thrashing")
- Quantifies it ("within 3 turns... 3 times in a row")
- Suggests the likely cause ("A file being read or a tool output is likely too large")
- Gives two recovery options ("smaller chunks" or "/clear")

The PI6 and NO8 constants are interpolated so the message stays accurate if the constants are tuned.

### Trade-off: Why exactly 3 within 3 turns?

The thresholds were chosen empirically. The pathology happens when:
- A user runs `Read` on a 50MB file → file content gets compacted away → user re-Reads in next turn → repeats
- An MCP tool returns megabytes of output every turn → autocompact strips it → tool re-runs every turn

3 turns × 3 cycles = catches a real pattern (not just one or two unlucky compactions). Lower thresholds (2 within 2) would trigger on transient autocompact-misjudgements; higher thresholds (5+) would let the pathology run longer before the user gets warned.

The 3-turn window matches well with how compaction interacts with a typical workflow: user types a prompt → assistant calls tools → tools return → assistant responds. That's 2-3 "logical turns" per user-visible turn, so 3 turns is roughly "1 user-cycle worth of work".

---

## 3. The Two Breakers Interact

Both breakers check at the *same gate* in `Fo7`:

```javascript
// Order of checks at top of Fo7:
if (bH(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };                       // Gate 1
if (_?.consecutiveFailures !== void 0 && _.consecutiveFailures >= DH4) return ...;       // Gate 2 (failure breaker)
let z = $.options.mainLoopModel, Y = $.getAutoCompactWindow();
if (!(await o45(H, z, Y, K, A))) return { wasCompacted: !1 };                            // Gate 3 (threshold)
let O = Wy6(_);
if (O >= NO8) return ..., { wasCompacted: !1, rapidRefillBreakerTripped: !0 };           // Gate 4 (rapid-refill breaker)
```

The order is deliberate:
1. Env-disable first (cheapest)
2. Failure breaker (no compute, just a counter read)
3. Threshold check (a token estimate scan, ~O(n))
4. Rapid-refill breaker (cheap counter check, but logically after threshold so we don't trip on turns where compaction wasn't needed anyway)

If the failure breaker is tripped, the rapid-refill check is never reached. They are *independent breakers*, not stacked.

### A Subtle Reset Asymmetry

- **Failure breaker resets:** On any successful compaction (line 408429 sets `consecutiveFailures: 0`)
- **Rapid-refill breaker resets:** On a turn where compaction succeeded *outside* the rapid window (i.e., `Wy6` returned 0 because `turnCounter >= 3`)

Both reset to 0 on successful compaction, but the conditions differ. The rapid-refill counter is incremented *before* compaction runs (in `Wy6`), then propagated through to the success-result (`consecutiveRapidRefills: O` on line 408429, where `O = Wy6(_)`). This means:

- A successful compaction *within* the rapid window: `consecutiveRapidRefills` goes from N to N+1
- A successful compaction *outside* the rapid window: `consecutiveRapidRefills` resets to 0

The asymmetry is because:
- Failure is a *negative* signal (everything's fine until it breaks).
- Rapid refill is a *pattern* signal (each successful compaction is normal, but a streak of close-together ones is a problem).

---

## 4. Reactive Compact's Parallel Breaker

Reactive compact has its own consecutive-failures tracking on the `RecompactionInfo` object, separate from the proactive lane's `AutoCompactTrackingState`. The reactive lane doesn't have a rapid-refill breaker — its triggering is driven by the server (PTL response), not the client's threshold math, so client-side thrashing wouldn't catch its failure pattern.

Reactive's "thrash guard" comes from the agent loop's PTL handler refusing to call reactive compact a second time in the same turn (`hasAttemptedReactiveCompact` flag in the loop's state).

---

## 5. Per-Session Persistence (or Lack Thereof)

Neither breaker persists across sessions. The state lives in `AutoCompactTrackingState` which is rebuilt fresh on each `claude` invocation. This is intentional:
- A user restart is the cleanest signal that the pathology should retry — maybe the user fixed whatever caused the thrashing
- Persisting would create UX where a tripped session "remembers" and won't compact even after the user fixed the underlying issue

The cost: the same pathology can trip in two consecutive sessions if the user doesn't realize what's wrong. The mitigation: the user-facing message (`Py6`) names the pathology clearly enough that a user who sees it twice should investigate.

---

## 6. Telemetry

Both breakers emit telemetry events that observability platforms can alert on:

| Event | Trigger |
|-------|---------|
| `tengu_auto_compact_circuit_breaker` | Failure breaker tripped (cli_inner_pretty.js:408442) |
| `compact_auto_rapid_refill_breaker` | Rapid-refill breaker tripped (cli_inner_pretty.js:408413; via `J8` failure-category recorder) |

Alerting platforms can use these to identify users hitting the pathologies systematically. The `tengu_auto_compact_circuit_breaker` event includes `consecutiveFailures` as an attribute so SLO dashboards can break down by depth.

---

## 7. Why Two Breakers Instead of One

It would be tempting to combine these into a single "stop autocompacting if it's not helping" counter. The reason they're separate:

| Aspect | Failure breaker | Rapid-refill breaker |
|--------|-----------------|----------------------|
| Counts | Exceptions thrown | Successful compactions that get re-triggered |
| Reset condition | Successful compaction (any kind) | Successful compaction *with turnCounter >= 3* |
| Recovery hint | "compaction is broken — try /clear" | "your workflow refills too fast — read smaller chunks" |
| Failure mode | Hard (autocompact can't run at all) | Soft (autocompact runs but is wasteful) |

The fact that both have the same magic number (3) is a coincidence. If they were combined, a user who hits 2 transient API failures and then has 1 real rapid-refill would be wrongly tripped at 3 — but each pathology demands a different recovery action.

---

## 8. Summary

```
                +-----------------------------------+
                | Fo7 (autoCompactGenerator) called |
                +----------------+------------------+
                                 |
                                 v
                       +---------+---------+
                       |  DISABLE_COMPACT?  |
                       +---+---------------++
                          yes              no
                           |                |
                           v                v
                      Skip everything    +----------------+
                                          | consecutive    |
                                          | failures >= 3? |
                                          +--+----------+-+
                                            yes        no
                                             |          |
                                             v          v
                                        Skip (breaker)  +----------------+
                                                        | o45 threshold  |
                                                        | passes?        |
                                                        +-+----------+--+
                                                         no         yes
                                                         |          |
                                                         v          v
                                                  Skip (no need)   +----------------+
                                                                   | rapid-refill   |
                                                                   | streak >= 3?   |
                                                                   +-+-----------+-+
                                                                    yes          no
                                                                     |           |
                                                                     v           v
                                                          Skip + thrash msg    Run compact (qrH)
                                                          (breaker)            on success: reset failures, recompute streak
                                                                               on exception: bump failures, no streak change
                                                                               on $rH (hook block): no counter change
                                                                               on Gb (user abort): no log, no counter bump
```

**Key insight:** The two breakers are *not* defenses against the same problem. The failure breaker stops autocompact from *flailing* (every turn fails the same way). The rapid-refill breaker stops autocompact from *churning* (every turn succeeds but achieves nothing). Each is sized for a different telemetry pattern, and each gives the user a different actionable recovery path. Treating them as one would obscure both signals.
