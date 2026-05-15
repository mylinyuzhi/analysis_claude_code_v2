# ScheduleWakeup — Self-Paced `/loop` Dynamic-Mode Wake-Up

> **Tool name:** `ScheduleWakeup`
> **Source:** `cli_inner_pretty.js:380632-380682` (`xc7` declaration)
> **Search hint:** *self-pace next iteration: pick a delay before resuming work or running the next /loop tick*

---

## Overview

`ScheduleWakeup` is the **only tool that lets Claude self-pace a recurring task** when the user invoked `/loop` without supplying an explicit interval ("dynamic" mode). Calling the tool with `delaySeconds + reason + prompt` schedules the next firing of the loop; **omitting the call ends the loop**.

It is gated on `U3H()` (the `/loop` dynamic-mode runtime flag); when off the tool returns "Wakeup not scheduled. … the loop has ended".

---

## Schema

```javascript
// ============================================
// scheduleWakeupInputSchema - Et_ wakeup-config object
// Location: cli_inner_pretty.js:380610-380624
// ============================================

// ORIGINAL (for source lookup):
Et_ = yH(() =>
  y.strictObject({
    delaySeconds: y.number().describe("Seconds from now to wake up. Clamped to [60, 3600] by the runtime."),
    reason: y.string().describe("One short sentence explaining the chosen delay. ..."),
    prompt: y.string().describe("The /loop input to fire on wake-up. ..."),
  }),
);

// READABLE (for understanding):
const scheduleWakeupInputSchema = lazySchema(() =>
  z.strictObject({
    delaySeconds: z.number().describe("Seconds from now to wake up. Clamped to [60, 3600] by the runtime."),
    reason: z.string().describe("One short sentence explaining the chosen delay."),
    prompt: z.string().describe("The /loop input to fire on wake-up. Pass autonomous-loop-dynamic sentinel for autonomous loops."),
  }),
);

// Mapping: Et_→scheduleWakeupInputSchema, yH→lazySchema, y→z
```

**Output:** `{ scheduledFor: epochMs, clampedDelaySeconds, wasClamped }`.

---

## Key Behavior

1. **Delay clamping.** The runtime clamps `delaySeconds` to `[60, 3600]` (1 min – 1 hour). When clamped, the tool result includes "(clamped to Ns from your requested value)" so the model learns the boundary.
2. **Two sentinels for autonomous loops:**
   - `"<<autonomous-loop-dynamic>>"` (F3H) — *the* sentinel for ScheduleWakeup-driven autonomous loops.
   - `"<<autonomous-loop>>"` (vFH) — the parallel sentinel for `CronCreate`-driven autonomous loops.
   The runtime resolves either back to the autonomous-loop system prompt at fire time.
3. **End-of-loop signal.** If the runtime gate is off OR the loop hit its max duration, `call` returns `scheduledFor: 0` and the tool result says "the loop has ended; do not re-issue."

---

## Key Insights

**Why a `reason` field?** Goes to telemetry AND is shown back to the user. The model is forced to write one specific sentence — "watching CI run", not just "waiting" — so the operator can read the spinner-line and predict whether the cadence matches their needs without having to ask.

**Why the 5-minute cache-window guidance?** The Anthropic prompt cache has a 5-minute TTL. The prompt explicitly tells the model:
- `60s–270s` → stay in cache.
- `300s–3600s` → pay cache miss, but amortize over much longer dead time.
- `300s` itself is **forbidden** ("worst-of-both: cache miss without amortizing"). Default is `1200s–1800s` for idle ticks.

The "don't pick 300s" instruction is load-bearing: it nudges every dynamic-loop wake-up to either stay snappy (warm cache) or commit to a long sleep. Round-minute thinking ("wait 5 minutes") would put traffic on the worst spot in the cost curve.

**Why `shouldDefer: !o`?** ScheduleWakeup is registered in `n3H` (tool-search-bypass set at cli_inner_pretty.js:211699) so it is always available to the loop skill on every turn — without this, the deferred-tool gate would prevent its surfacing.

---

## v2.1.112 → v2.1.142 Deltas

- **v2.1.140:** Fixed `/loop` scheduling redundant wakeups to poll for background tasks that already notify on completion — the prompt now explicitly says "do NOT schedule a short-interval wakeup to poll for background work you started".
- **v2.1.113:** Pressing Esc now cancels pending wakeups; wakeups display as "Claude resuming /loop wakeup" for clarity.
- The autonomous-loop-dynamic sentinel (`F3H`) is the dynamic-pacing variant kept distinct from the CronCreate sentinel `vFH` so the runtime resolution knows which prompt to substitute.

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_utility.md](../00_overview/symbol_additions_v2_1_142_tools_utility.md) — *Module: Tools — Scheduling*

Key functions in this document:
- `ScheduleWakeupTool` (`xc7`) — tool declaration with `shouldDefer: true`
- `scheduleWakeupInputSchema` (`Et_`) — delaySeconds + reason + prompt
- `AUTONOMOUS_LOOP_DYNAMIC_SENTINEL` (`F3H`) — `<<autonomous-loop-dynamic>>` literal
- `scheduleWakeupRuntimeImpl` (`IlK`) — actually adds the scheduled fire
- `isScheduleWakeupEnabled` (`U3H`) — `/loop` dynamic-mode runtime gate
