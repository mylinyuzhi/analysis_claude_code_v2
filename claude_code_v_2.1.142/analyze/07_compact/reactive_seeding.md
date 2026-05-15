# Reactive Compaction — Token-Gap Seeded First Attempt (v2.1.142)

## Changelog Anchor

> Improved reactive compaction: the first summarize attempt now seeds from the original request's overflow size, avoiding a wasted near-full-context retry

## Background — How Reactive Compact Works

When the agent loop sends a request and the API rejects it with **"Prompt is too long"** on a 1M-context model, the response carries a `usage.input_tokens` value that exceeds the allowed window. The loop traps this in `xq8` (around line 392544 of `cli_inner_pretty.js`) and computes:

```javascript
i$ = $$ && _$ ? mUH(_$) : void 0;  // mUH extracts the overflow token count from the PTL message
```

`mUH` (token-gap extractor) reads the API's error string, which looks like:

```
Prompt is too long: 1052431 tokens > 1048576 tokens
```

…and returns `1052431 - 1048576 = 3855` (the gap). This is what gets passed to `Y97` as `initialTokenGap`, which threads it to `Ej6` → `uq8`.

Reactive compact then walks the message *groups* (one assistant turn + its preceding user/tool messages) backwards, summarizing the oldest M groups and preserving the newest A-M. Each summarize attempt is itself an LLM call that has to fit in the window. If the summarize call hits PTL, reactive compact shifts the boundary (preserve more, summarize less) and retries.

## The Problem — Wasted First Attempt

Before v2.1.142, `uq8` started with `Y = 1` (groupsToPreserve), meaning attempt 1 summarized **all but the last group**. For a session that was 0.5% over the limit, this had two failure modes:

1. The summarize call also overflows because the prompt-to-summarize *is* the conversation. If the convo is 100% of context, summarizing 99% of it (the all-but-last-group split) still gives the summarize call a 99%-of-context prompt — well above the limit.
2. Even if the summarize call succeeds, the result is *useless* in practice because the user then has zero recent context to anchor follow-up turns to. The session loses everything except the assistant's last response.

So in nearly every real-world overflow case, attempt 1 burned an LLM call (latency + tokens) and immediately failed with PTL, then attempt 2 would do the *useful* work after `B47` (the gap-guided step) recomputed the boundary.

## The Fix — Seed `groupsPreserved` From `initialTokenGap`

v2.1.142 inserts a pre-loop branch that uses `initialTokenGap` to pick a starting `Y` that already leaves enough room for the summarize call:

```javascript
// ============================================
// iterateReactiveSummarize - The group-walk loop; v2.1.142 added the seeded-first-attempt branch
// Location: cli_inner_pretty.js:243253-243336
// ============================================

// ORIGINAL (for source lookup):
async function uq8(H, $, q) {
  let K = X3(H).filter((D) => D.type !== "progress"),
    _ = hQH(K),
    A = _.length;
  if (A < 2)
    return (
      N("Reactive compact: fewer than 2 groups, nothing to compact", { level: "info" }),
      { ok: !1, reason: "too_few_groups", attempts: 0, totalGroups: A }
    );
  let z = $.toolUseContext.abortController.signal,
    Y = 1,
    f = 0,
    O = void 0,
    M,
    w = !1;
  if (q?.initialTokenGap !== void 0 && A > 3) {
    M = _.map((j) => KV(j));
    let D = q.initialTokenGap - (M[A - 1] ?? 0);
    if (D > 0) {
      let j = B47(M, A - 1, D);
      ((Y = 1 + j), (O = { mode: "seeded", step: j, tokenGap: q.initialTokenGap }));
    }
  }
  while (Y < A) {
    if (z.aborted) return { ok: !1, reason: "aborted", attempts: f, totalGroups: A };
    f++;
    let D = A - Y,
      j = _.slice(0, D),
      J = _.slice(D),
      X = j.flat();
    if (!X.some((Z) => Z.type === "assistant"))
      return (
        N("Reactive compact: no assistant messages in summarize set, bailing", { level: "info" }),
        { ok: !1, reason: f > 1 ? "exhausted" : "too_few_groups", attempts: f - 1, totalGroups: A }
      );
    d("tengu_reactive_compact_attempt", { attempt: f, groupsToSummarize: j.length, groupsToPreserve: J.length, messagesToSummarize: X.length, strippedMedia: w, stepMode: O?.mode, stepSize: O?.step, tokenGap: O?.tokenGap });
    let L = await X3_(X, $, q?.customInstructions, w);
    if (L.ok) return { ok: !0, result: { summaryMessages: L.messages, summaryText: L.summaryText, messagesToPreserve: J.flat(), attempt: f, totalUsage: L.totalUsage, groupsPreserved: Y, totalGroups: A } };
    switch (L.reason) {
      case "aborted":     return { ok: !1, reason: "aborted", attempts: f, totalGroups: A };
      case "error":       return { ok: !1, reason: "error", attempts: f, totalGroups: A, detail: L.detail };
      case "media_too_large":
        if (!w) { ((w = !0), f--, N("Reactive compact: summarize hit media-size error, retrying stripped", { level: "info" })); continue; }
        return { ok: !1, reason: "media_unstrippable", attempts: f, totalGroups: A };
      case "prompt_too_long":
        break;
    }
    M ??= _.map((Z) => KV(Z));
    let P = L3_(L.tokenGap, M, D);
    ((O = { ...P, tokenGap: L.tokenGap }), (Y += P.step), N(`Reactive compact: attempt ${f} hit prompt-too-long (gap=${L.tokenGap ?? "?"} → ${P.mode} step ${P.step}), next preserves ${Y}/${A}`, { level: "info" }));
  }
  return { ok: !1, reason: "exhausted", attempts: f, totalGroups: A };
}

// READABLE (for understanding):
async function iterateReactiveSummarize(messages, cacheSafeParams, options) {
  const nonProgress = filterOutProgress(messages);
  const groups = splitIntoAssistantGroups(nonProgress);  // hQH
  const totalGroups = groups.length;

  if (totalGroups < 2) {
    log("Reactive compact: fewer than 2 groups, nothing to compact", { level: "info" });
    return { ok: false, reason: "too_few_groups", attempts: 0, totalGroups };
  }

  const abortSignal = cacheSafeParams.toolUseContext.abortController.signal;
  let groupsPreserved = 1;          // legacy default — summarize all but last group
  let attempts = 0;
  let stepInfo;                      // { mode, step, tokenGap } - tracked for telemetry
  let groupSizes;                    // memoized per-group token counts
  let strippedMedia = false;

  // ─── v2.1.142 NEW: seed from initialTokenGap if we have one ────────────────
  if (options?.initialTokenGap !== undefined && totalGroups > 3) {
    groupSizes = groups.map((g) => estimateGroupTokens(g));   // KV
    // The last group has to stay (it's the rejected request itself), so the
    // gap minus its size is how much we must shave off the earlier groups.
    const deficit = options.initialTokenGap - (groupSizes[totalGroups - 1] ?? 0);
    if (deficit > 0) {
      // greedy backward walk: how many groups (counting from the end of the
      // summarize set) until cumulative size >= deficit
      const stepFromGap = seedPreservedCount(groupSizes, totalGroups - 1, deficit);  // B47
      groupsPreserved = 1 + stepFromGap;  // 1 (last group always preserved) + stepFromGap
      stepInfo = { mode: "seeded", step: stepFromGap, tokenGap: options.initialTokenGap };
    }
  }
  // ────────────────────────────────────────────────────────────────────────────

  while (groupsPreserved < totalGroups) {
    if (abortSignal.aborted) return { ok: false, reason: "aborted", attempts, totalGroups };
    attempts++;

    const summarizeEndIdx = totalGroups - groupsPreserved;
    const groupsToSummarize = groups.slice(0, summarizeEndIdx);
    const groupsToPreserve = groups.slice(summarizeEndIdx);
    const messagesToSummarize = groupsToSummarize.flat();

    if (!messagesToSummarize.some((m) => m.type === "assistant")) {
      log("Reactive compact: no assistant messages in summarize set, bailing", { level: "info" });
      return { ok: false, reason: attempts > 1 ? "exhausted" : "too_few_groups", attempts: attempts - 1, totalGroups };
    }

    telemetry("tengu_reactive_compact_attempt", {
      attempt: attempts,
      groupsToSummarize: groupsToSummarize.length,
      groupsToPreserve: groupsToPreserve.length,
      messagesToSummarize: messagesToSummarize.length,
      strippedMedia,
      stepMode: stepInfo?.mode,         // "seeded" | "gap_guided" | "gap_unparseable" | undefined (=initial)
      stepSize: stepInfo?.step,
      tokenGap: stepInfo?.tokenGap,
    });

    const summarizeResult = await summarizeReactiveAttempt(messagesToSummarize, cacheSafeParams, options?.customInstructions, strippedMedia);

    if (summarizeResult.ok) {
      return {
        ok: true,
        result: {
          summaryMessages: summarizeResult.messages,
          summaryText: summarizeResult.summaryText,
          messagesToPreserve: groupsToPreserve.flat(),
          attempt: attempts,
          totalUsage: summarizeResult.totalUsage,
          groupsPreserved,
          totalGroups,
        },
      };
    }

    switch (summarizeResult.reason) {
      case "aborted":
        return { ok: false, reason: "aborted", attempts, totalGroups };
      case "error":
        return { ok: false, reason: "error", attempts, totalGroups, detail: summarizeResult.detail };
      case "media_too_large":
        if (!strippedMedia) {
          strippedMedia = true;
          attempts--;  // retry with stripped media doesn't count
          log("Reactive compact: summarize hit media-size error, retrying stripped", { level: "info" });
          continue;
        }
        return { ok: false, reason: "media_unstrippable", attempts, totalGroups };
      case "prompt_too_long":
        break;  // fall through to step-up
    }

    // PTL retry: widen the preserve window
    groupSizes ??= groups.map((g) => estimateGroupTokens(g));
    const nextStep = nextStepFromGap(summarizeResult.tokenGap, groupSizes, summarizeEndIdx);  // L3_
    stepInfo = { ...nextStep, tokenGap: summarizeResult.tokenGap };
    groupsPreserved += nextStep.step;
    log(`Reactive compact: attempt ${attempts} hit prompt-too-long (gap=${summarizeResult.tokenGap ?? "?"} → ${nextStep.mode} step ${nextStep.step}), next preserves ${groupsPreserved}/${totalGroups}`, { level: "info" });
  }

  return { ok: false, reason: "exhausted", attempts, totalGroups };
}

// Mapping: uq8→iterateReactiveSummarize, H→messages, $→cacheSafeParams, q→options,
//          K→nonProgress, _→groups, A→totalGroups, z→abortSignal, Y→groupsPreserved,
//          f→attempts, O→stepInfo, M→groupSizes, w→strippedMedia, D→deficit/summarizeEndIdx,
//          j→stepFromGap/groupsToSummarize, J→groupsToPreserve, X→messagesToSummarize,
//          L→summarizeResult, P→nextStep, KV→estimateGroupTokens, B47→seedPreservedCount,
//          L3_→nextStepFromGap, X3_→summarizeReactiveAttempt
```

## The Seeding Function — `seedPreservedCount` (`B47`)

```javascript
// ============================================
// seedPreservedCount - Greedy backward walk: how many trailing groups sum to ≥ target?
// Location: cli_inner_pretty.js:243242-243248
// ============================================

// ORIGINAL (for source lookup):
function B47(H, $, q) {
  let K = 0, _ = 0;
  for (let A = $ - 1; A >= 0; A--) if (((K += H[A]), _++, K >= q)) break;
  if (_ >= $ - 1) return Math.max(1, Math.floor($ / 2));
  return _;
}

// READABLE (for understanding):
function seedPreservedCount(groupSizes, summarizeWindowSize, targetGap) {
  let cumulativeTokens = 0;
  let stepsTaken = 0;

  // Walk backward from the last summarize-able group, accumulating tokens.
  // Stop when we've shaved off at least `targetGap` worth.
  for (let i = summarizeWindowSize - 1; i >= 0; i--) {
    cumulativeTokens += groupSizes[i];
    stepsTaken++;
    if (cumulativeTokens >= targetGap) break;
  }

  // Safety floor: if we'd have to take almost all groups out of the summarize
  // set (stepsTaken >= summarizeWindowSize - 1), fall back to halving.
  // This prevents degenerate cases where one giant group dominates.
  if (stepsTaken >= summarizeWindowSize - 1) {
    return Math.max(1, Math.floor(summarizeWindowSize / 2));
  }

  return stepsTaken;
}

// Mapping: B47→seedPreservedCount, H→groupSizes, $→summarizeWindowSize, q→targetGap,
//          K→cumulativeTokens, _→stepsTaken, A→i
```

## How the Seed Plugs Into the Loop

```
                              ┌────────────────────────────────────────────┐
                              │ API responds: "Prompt is too long: 1052431  │
                              │ tokens > 1048576 tokens"                    │
                              └────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                              ┌────────────────────────────────────────────┐
                              │ Agent loop at xq8 (line ~392566)            │
                              │   i$ = mUH(rejectedResponse)                │
                              │      = 3855 (the overflow)                  │
                              │   → Y97({ ..., initialTokenGap: 3855 })     │
                              └────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                              ┌────────────────────────────────────────────┐
                              │ Y97 → Ej6 → uq8                             │
                              │                                            │
                              │ q.initialTokenGap = 3855                    │
                              │ A = totalGroups (say 22)                    │
                              │ A > 3 ✓                                     │
                              │                                            │
                              │ groupSizes = [12000, 8000, ..., 38000]      │
                              │              ← per-group token estimates    │
                              │                                            │
                              │ deficit = 3855 - groupSizes[21]             │
                              │         = 3855 - 38000 = -34145             │
                              │                                            │
                              │ If deficit > 0: seed.                       │
                              │ If deficit < 0 (rare): the last group       │
                              │   alone is bigger than the overflow.        │
                              │   Skip seed, fall back to Y=1.              │
                              │                                            │
                              │ Common case: gap is BIGGER than last group  │
                              │ deficit = 50000 - 38000 = 12000             │
                              │ stepFromGap = walks back through groups     │
                              │ 20, 19, 18, ... until accumulator ≥ 12000   │
                              │ = e.g. 2 groups                             │
                              │                                            │
                              │ Y = 1 + 2 = 3   (preserve last 3 groups)    │
                              │ stepInfo = { mode: "seeded", step: 2 }       │
                              └────────────────────┬───────────────────────┘
                                                   │
                                                   ▼
                              ┌────────────────────────────────────────────┐
                              │ Attempt 1 fires:                            │
                              │   summarize groups[0..19]  (20 groups)      │
                              │   preserve groups[19..22]  (3 groups)        │
                              │ tengu_reactive_compact_attempt              │
                              │   { attempt:1, stepMode: "seeded",          │
                              │     stepSize: 2, tokenGap: 3855 }            │
                              │                                            │
                              │ → Almost always succeeds because the        │
                              │   summarize prompt is 19/22 of original     │
                              │   which is well under the limit.            │
                              └────────────────────────────────────────────┘
```

## Why This Matters — Quantitative Picture

**Pre-v2.1.142 (no seed):**
- Convo size: 1,052,431 tokens (overflow by 3855)
- Attempt 1: summarize groups[0..20], preserve groups[21..22] = 1 group
- Summarize prompt size: ~1,014,431 tokens (last group ≈ 38000)
- Result: PTL again (still over the 1M limit)
- LLM call burned: ~$0.10 + ~5s wait
- Attempt 2: `L3_` recomputes a step from PTL response, lands on something like Y=3
- Attempt 2 finally succeeds

**Post-v2.1.142 (with seed):**
- Same overflow
- Attempt 1 seeded with Y=3 directly
- Summarize prompt: ~938,431 tokens
- Result: succeeds first try

This saves one LLM round-trip (~5s of perceived latency, ~$0.10) on every overflow event for 1M-context users.

## Edge Cases

| Case | Behavior |
|------|----------|
| `q.initialTokenGap === undefined` | Seed branch skipped → `Y = 1` legacy default |
| `A <= 3` (too few groups) | Seed branch skipped — not enough groups to meaningfully partition |
| `deficit <= 0` (last group alone is bigger than the gap) | Seed branch entered but no-op (no `if (deficit > 0)` branch fires) → `Y = 1` |
| `B47` walks past `$ - 1` (essentially asking to summarize nothing) | Returns `max(1, floor($/2))` — halving fallback prevents bad single-large-group sessions |
| Summarize call itself hits PTL | Same retry path as before; `L3_` computes a `gap_guided` step from the PTL response |
| Abort during summarize | Returns `{ ok: false, reason: "aborted" }`, same as pre-fix |

## Telemetry Signal — `stepMode: "seeded"`

`tengu_reactive_compact_attempt` carries `stepMode` on every attempt. v2.1.142 adds the `"seeded"` enum value, which appears on attempt 1 *only when the seed branch fired*. Existing values (`"gap_guided"`, `"gap_unparseable"`) still appear on retry attempts.

This is the clean signal for measuring deployment efficacy: percentage of overflow events where attempt 1 was `stepMode === "seeded"` AND succeeded should approach 100% post-rollout.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry events
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - New symbols this unit

Key functions:
- `iterateReactiveSummarize` (`uq8`) — `cli_inner_pretty.js:243253-243336` — The group-walk loop with the seed branch
- `seedPreservedCount` (`B47`) — `cli_inner_pretty.js:243242-243248` — Greedy backward walk
- `nextStepFromGap` (`L3_`) — `cli_inner_pretty.js:243249-243252` — Step calc on PTL retry
- `extractPTLTokenGap` (`mUH`) — Extracts overflow count from "Prompt is too long" error message
- `reactiveCompactDispatcher` (`Y97`) — `cli_inner_pretty.js:243951-244055` — Receives `initialTokenGap` from agent loop
- `runReactiveCompact` (`Ej6`) — `cli_inner_pretty.js:244056-244092` — Plumbs `initialTokenGap` into `uq8` options
