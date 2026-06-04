# Reactive (partial / PTL-driven) compaction

## Overview

Claude Code has two compaction lanes. The **proactive / full** lane (`compactConversationFull`, `_eH` @ `cli_inner_pretty.js:423130`) summarizes the *entire* conversation into one summary message. The **reactive / partial** lane — the subject of this document — keeps the conversation split into **API-round groups** and replaces only the **oldest** groups with a single summary, preserving the **newest** groups verbatim.

The reactive lane exists for two reasons:

1. **It is the minimum-loss response to a `prompt_too_long` (PTL / 413) rejection.** When the API rejects a request because the prompt is over the model's ceiling, the conversation is already too large; reactive compaction salvages it by summarizing just enough of the *oldest* history to fit, keeping the user's most-recent context (the lead-up to the failing request) losslessly.
2. **It is the preferred headroom mechanism on explicitly-windowed contexts.** When the compact window was *explicitly configured* (env / settings / experiment, as opposed to the model-default `"auto"`), summarizing the whole conversation pre-flight is wasteful and feeds the summarizer a pathologically long prompt. The bounded group-walk produces a strictly-bounded summarize input instead.

Where it plugs into the agent loop:

- On a withheld 413, the loop extracts the **reported overflow** from the rejection (`extractPTLTokenGap`, `ucH` @ `cli_inner_pretty.js:186340`) and threads it as `initialTokenGap` into `runReactiveCompact` (`lA8` @ `cli_inner_pretty.js:272213`). The loop also speculatively precomputes a reactive result during the PTL wait (`precomputeReactiveCompact`, `sv7` @ `cli_inner_pretty.js:271826` — definition; the loop invokes it at the call site `451742`).
- Proactively, the autocompact generator (`autoCompactGenerator`, `DX4` @ `cli_inner_pretty.js:424002`) routes to the reactive lane when the window source is not `"auto"` and we are not in remote mode (`routedThroughReactive` path, v2.1.156-new).

The whole subsystem is **post-v2.1.88** — see "Cross-validation against v2.1.88" below. Only the *grouping* primitive (`groupMessagesByApiRound`, `riH`) and the *summary prompt template* (`buildCompactSummaryPrompt`, `bA8`) have direct v2.1.88 ancestors; the group-walk, the `initialTokenGap` seed, the PTL-retry widening, and the `DX4` routing are all newer (v2.1.113–v2.1.142 era). v2.1.156 adds the `thresholdSource`-based proactive→reactive *routing* inside `DX4` plus a `precompute`/`precomputeOutcome` fast-path.

### The three layers of the reactive lane

There are three concentric functions, plus a finalizer, all using the `A8` / `N6` naming family:

- `runReactiveCompact` (`lA8` @ `cli_inner_pretty.js:272213`) — Orchestrator: gates, PreCompact hook, status events, telemetry, picks precomputed vs live summarize, finalizes.
- `reactiveCompactSummarizeAndFinalize` (`bN6` @ `cli_inner_pretty.js:272332-272375`) — Runs the group-walk (`xA8`) then, on success, calls `nA8` to build the boundary marker, restore attachments, and emit success telemetry; on failure fires `tengu_reactive_compact_failed`.
- `iterateReactiveGroupWalk` (`xA8` @ `cli_inner_pretty.js:271231`) — **The algorithm**: split into groups, optionally seed from `initialTokenGap`, then loop summarizing the oldest groups / preserving the newest, widening the preserve window on PTL.
- `finalizeReactiveCompact` (`nA8` @ `cli_inner_pretty.js:272376-272464`) — Builds the compact boundary marker, restores file/memory attachments, runs PostCompact + SessionStart hooks, computes post-tokens, fires `tengu_reactive_compact_succeeded`.

The summarize call itself is `summarizeReactiveAttempt` (`uc5` @ `cli_inner_pretty.js:271156`), and the two step-sizing helpers are `seedPreservedCount` (`bv7` @ `cli_inner_pretty.js:271220`, the greedy backward walk) and `nextStepFromGap` (`mc5` @ `cli_inner_pretty.js:271227`).

---

### The group-walk algorithm (`iterateReactiveGroupWalk` / `xA8`) — the heart of the lane

**What it does:** Given the full message list and the cache-safe request params, it partitions the conversation into **API-round groups**, then finds the smallest set of *oldest* groups it can summarize such that the resulting summarize-LLM-call itself fits in the window, while preserving the maximum number of *newest* groups verbatim.

**How it works** (numbered, with edge cases; `cli_inner_pretty.js:271231-271322`):

1. **Filter + group** (271232-271234): `normalizeMessages(messages)` (`nf`) normalizes, `.filter(m => m.type !== "progress")` drops progress chunks, then `groupMessagesByApiRound` (`riH`) splits into groups `_` of length `z` (`totalGroups`). A new group begins each time an `assistant` message appears with a **different `message.id`** than the previous assistant. Streaming chunks of one API response therefore stay together, and tool_results interleaved within a round stay attached.
2. **Bail if < 2 groups** (271235-271239): returns `{ ok:false, reason:"too_few_groups" }`. You cannot partition a single round into "summarize old / keep new".
3. **Initialize** (271240-271245): `groupsPreserved` = 1 (legacy default: preserve only the last group, summarize everything else); `attempts` = 0; `stepInfo`; `groupSizes` (memoized per-group token sizes); `strippedMedia` = false.
4. **Seed from `initialTokenGap`** (271246-271253) — *the key optimization*. Only if `initialTokenGap !== undefined` AND `totalGroups > 3`:
   - `groupSizes = groups.map(sumMessageTokens)` — estimate per-group tokens via `sT` (`sumMessageTokens`).
   - `deficit = initialTokenGap - (groupSizes[totalGroups-1] ?? 0)` — the gap minus the size of the **last** group (which must always be preserved; it is the rejected request). This is how many tokens of *older* groups must be shaved.
   - If `deficit > 0`: `seedPreservedCount(groupSizes, totalGroups-1, deficit)` (`bv7`) walks backward accumulating group sizes until it has accounted for `deficit` tokens, returning the count; `groupsPreserved = 1 + count` (the `1` is the always-preserved last group), and `stepInfo = { mode:"seeded", step:count, tokenGap }`.
   - **Edge case** `deficit <= 0`: the last group alone already exceeds the overflow — no seed; fall through with `groupsPreserved = 1`.
   - **Edge case** `totalGroups <= 3`: too few groups to meaningfully partition by size — skip seed.
5. **The walk** `while (groupsPreserved < totalGroups)` (271254-271321):
   - Abort check → `{ ok:false, reason:"aborted" }`.
   - `attempts++`.
   - `splitIdx = totalGroups - groupsPreserved`, `toSummarize = groups.slice(0, splitIdx)` (oldest groups to summarize), `toPreserve = groups.slice(splitIdx)` (newest groups to preserve), `flatSummarize = toSummarize.flat()`.
   - **Edge case** no assistant in summarize set (271261-271265): `reason` is `"exhausted"` if `attempts > 1` else `"too_few_groups"` (you cannot summarize a set with no assistant turn).
   - Fire `tengu_reactive_compact_attempt` telemetry with `groupsToSummarize / groupsToPreserve / messagesToSummarize / strippedMedia / stepMode / stepSize / tokenGap` (271266-271275).
   - `res = await summarizeReactiveAttempt(flatSummarize, cacheSafeParams, customInstructions, strippedMedia)` (`uc5`) — the actual summarize call.
   - **On success** (271277-271290): return `{ ok:true, result:{ summaryMessages, summaryText, messagesToPreserve: toPreserve.flat(), attempt, totalUsage, forkAssistantMessageCount, groupsPreserved, totalGroups } }`. (v2.1.156 carries `forkAssistantMessageCount` out of the walk at 271286.)
   - **On failure**, switch on `res.reason` (271291-271312):
     - `"aborted"` → bail.
     - `"error"` → bail with `detail/status/isTimeout`.
     - `"media_too_large"` (271304-271309): first time, set `strippedMedia = true`, **decrement `attempts` (retry does not count as an attempt)**, `continue` — re-runs the same split but with media stripped (`stripMediaToPlaceholders`, `wN6`, replaces images/documents with `[image]`/`[document]` text inside `uc5`). Second time → `"media_unstrippable"`.
     - `"prompt_too_long"` → `break` out of switch → fall to step-up.
6. **PTL step-up** (271313-271320): memoize `groupSizes` if not already; `next = nextStepFromGap(res.tokenGap, groupSizes, splitIdx)` (`mc5`) computes the next step. `mc5` returns `{ mode:"gap_guided", step: bv7(groupSizes, splitIdx, tokenGap) }` when a tokenGap was parsed, else `{ mode:"gap_unparseable", step:1 }`. `groupsPreserved += next.step` (preserve more, summarize fewer). Loop.
7. **Exhausted** (271322): if `groupsPreserved` reaches `totalGroups` without success, `{ ok:false, reason:"exhausted" }`.

**Why this approach:**

- **Suffix-preserving** (keep newest verbatim) is correct for a *continuing* session: the user's most recent context (the failing request and its lead-up) is exactly what the next turn needs, so it must survive losslessly. The summary goes in front; `assembleCompactedMessages` (`h5H` @ `cli_inner_pretty.js:423104`) assembles `[boundaryMarker, ...summaryMessages, ...messagesToKeep, ...attachments, ...hookResults]`.
- **Group-granular** (not message-granular) keeps tool_use/tool_result pairs intact — splitting mid-round would produce a dangling tool_use that the API rejects. The v2.1.88 `grouping.ts` comment documents that the assistant-id boundary is API-safe by construction (every tool_use is resolved before the next assistant turn begins).
- **Iterative widening on PTL** handles the chicken-and-egg problem: the *summarize* call is itself an LLM call subject to the same ceiling. You cannot know a priori how much you must summarize for the summarize call to fit, so you probe — but the seed (step 4) and the gap-guided step (step 6) make the probe converge in ~1 attempt instead of binary-searching.

**Key insight:** The summarize call's input is the *summarize set* (`flatSummarize = toSummarize.flat()`), **not** the preserve set. So preserving MORE groups (larger `groupsPreserved`) means summarizing FEWER (smaller `flatSummarize`), which makes the summarize call *smaller* and more likely to fit. The PTL retry therefore walks `groupsPreserved` **upward**, trading away how much history gets compressed in exchange for a summarize call that fits — the opposite intuition from full compaction, which drops messages from the FRONT to shrink its summarize prompt. The `initialTokenGap` seed front-loads this: it jumps `groupsPreserved` straight to a value sized from the *actual* overflow the API reported, so attempt 1 usually fits.

```javascript
// ============================================
// iterateReactiveGroupWalk - The reactive group-walk: split into API-round groups, seed from the reported overflow, then widen the preserve window on PTL until the summarize call fits
// Location: cli_inner_pretty.js:271231-271322
// ============================================

// ORIGINAL (for source lookup):
async function xA8(H, $, q) {
  let K = nf(H).filter((w) => w.type !== "progress"),
    _ = riH(K),
    z = _.length;
  if (z < 2)
    return (N("Reactive compact: fewer than 2 groups, nothing to compact", { level: "info" }), { ok: !1, reason: "too_few_groups", attempts: 0, totalGroups: z });
  let A = $.toolUseContext.abortController.signal, Y = 1, f = 0, O = void 0, M, j = !1;
  if (q?.initialTokenGap !== void 0 && z > 3) {
    M = _.map((D) => sT(D));
    let w = q.initialTokenGap - (M[z - 1] ?? 0);
    if (w > 0) { let D = bv7(M, z - 1, w); ((Y = 1 + D), (O = { mode: "seeded", step: D, tokenGap: q.initialTokenGap })); }
  }
  while (Y < z) {
    if (A.aborted) return { ok: !1, reason: "aborted", attempts: f, totalGroups: z };
    f++;
    let w = z - Y, D = _.slice(0, w), J = _.slice(w), X = D.flat();
    if (!X.some((Z) => Z.type === "assistant"))
      return (N("Reactive compact: no assistant messages in summarize set, bailing", { level: "info" }), { ok: !1, reason: f > 1 ? "exhausted" : "too_few_groups", attempts: f - 1, totalGroups: z });
    d("tengu_reactive_compact_attempt", { attempt: f, groupsToSummarize: D.length, groupsToPreserve: J.length, messagesToSummarize: X.length, strippedMedia: j, stepMode: O?.mode, stepSize: O?.step, tokenGap: O?.tokenGap });
    let L = await uc5(X, $, q?.customInstructions, j);
    if (L.ok) return { ok: !0, result: { summaryMessages: L.messages, summaryText: L.summaryText, messagesToPreserve: J.flat(), attempt: f, totalUsage: L.totalUsage, forkAssistantMessageCount: L.forkAssistantMessageCount, groupsPreserved: Y, totalGroups: z } };
    switch (L.reason) {
      case "aborted": return { ok: !1, reason: "aborted", attempts: f, totalGroups: z };
      case "error": return { ok: !1, reason: "error", attempts: f, totalGroups: z, detail: L.detail, status: L.status, isTimeout: L.isTimeout };
      case "media_too_large": if (!j) { ((j = !0), f--, N("Reactive compact: summarize hit media-size error, retrying stripped", { level: "info" })); continue; } return { ok: !1, reason: "media_unstrippable", attempts: f, totalGroups: z };
      case "prompt_too_long": break;
    }
    M ??= _.map((Z) => sT(Z));
    let P = mc5(L.tokenGap, M, w);
    ((O = { ...P, tokenGap: L.tokenGap }), (Y += P.step), N(`Reactive compact: attempt ${f} hit prompt-too-long (gap=${L.tokenGap ?? "?"} → ${P.mode} step ${P.step}), next preserves ${Y}/${z}`, { level: "info" }));
  }
  return { ok: !1, reason: "exhausted", attempts: f, totalGroups: z };
}

// READABLE (for understanding):
async function iterateReactiveGroupWalk(messages, cacheSafeParams, options) {
  const nonProgress = normalizeMessages(messages).filter((m) => m.type !== "progress");
  const groups = groupMessagesByApiRound(nonProgress);
  const totalGroups = groups.length;
  if (totalGroups < 2) return { ok: false, reason: "too_few_groups", attempts: 0, totalGroups };
  const abortSignal = cacheSafeParams.toolUseContext.abortController.signal;
  let groupsPreserved = 1, attempts = 0, stepInfo, groupSizes, strippedMedia = false;
  // SEED: size first attempt from the API-reported overflow (only when enough groups exist)
  if (options?.initialTokenGap !== undefined && totalGroups > 3) {
    groupSizes = groups.map(sumMessageTokens);
    const deficit = options.initialTokenGap - (groupSizes[totalGroups - 1] ?? 0); // last group always kept
    if (deficit > 0) {
      const step = seedPreservedCount(groupSizes, totalGroups - 1, deficit);
      groupsPreserved = 1 + step;
      stepInfo = { mode: "seeded", step, tokenGap: options.initialTokenGap };
    }
  }
  while (groupsPreserved < totalGroups) {
    if (abortSignal.aborted) return { ok: false, reason: "aborted", attempts, totalGroups };
    attempts++;
    const splitIdx = totalGroups - groupsPreserved;
    const toSummarize = groups.slice(0, splitIdx);    // oldest groups -> summarized
    const toPreserve = groups.slice(splitIdx);        // newest groups -> kept verbatim
    const flatSummarize = toSummarize.flat();
    if (!flatSummarize.some((m) => m.type === "assistant"))
      return { ok: false, reason: attempts > 1 ? "exhausted" : "too_few_groups", attempts: attempts - 1, totalGroups };
    logEvent("tengu_reactive_compact_attempt", { attempt: attempts, groupsToSummarize: toSummarize.length, groupsToPreserve: toPreserve.length, messagesToSummarize: flatSummarize.length, strippedMedia, stepMode: stepInfo?.mode, stepSize: stepInfo?.step, tokenGap: stepInfo?.tokenGap });
    const res = await summarizeReactiveAttempt(flatSummarize, cacheSafeParams, options?.customInstructions, strippedMedia);
    if (res.ok) return { ok: true, result: { summaryMessages: res.messages, summaryText: res.summaryText, messagesToPreserve: toPreserve.flat(), attempt: attempts, totalUsage: res.totalUsage, forkAssistantMessageCount: res.forkAssistantMessageCount, groupsPreserved, totalGroups } };
    switch (res.reason) {
      case "aborted": return { ok: false, reason: "aborted", attempts, totalGroups };
      case "error": return { ok: false, reason: "error", attempts, totalGroups, detail: res.detail, status: res.status, isTimeout: res.isTimeout };
      case "media_too_large": if (!strippedMedia) { strippedMedia = true; attempts--; continue; } return { ok: false, reason: "media_unstrippable", attempts, totalGroups };
      case "prompt_too_long": break;
    }
    groupSizes ??= groups.map(sumMessageTokens);
    const next = nextStepFromGap(res.tokenGap, groupSizes, splitIdx);
    stepInfo = { ...next, tokenGap: res.tokenGap };
    groupsPreserved += next.step; // preserve more => summarize fewer => summarize-call shrinks
  }
  return { ok: false, reason: "exhausted", attempts, totalGroups };
}

// Mapping: xA8->iterateReactiveGroupWalk, H->messages, $->cacheSafeParams, q->options, K->nonProgress, _->groups, z->totalGroups, A->abortSignal, Y->groupsPreserved, f->attempts, O->stepInfo, M->groupSizes, j->strippedMedia, w->deficit/splitIdx, D->step/toSummarize, J->toPreserve, X->flatSummarize, L->res, P->next, nf->normalizeMessages, riH->groupMessagesByApiRound, sT->sumMessageTokens, bv7->seedPreservedCount, mc5->nextStepFromGap, uc5->summarizeReactiveAttempt, d->logEvent, N->log
```

---

### `initialTokenGap` seeding (`seedPreservedCount` / `bv7`)

**What it does:** Picks the first-attempt `groupsPreserved` value directly from the byte-accurate overflow the API reported, so attempt 1 usually succeeds instead of wasting a near-full-context PTL retry.

**How it works:**

The overflow is extracted from the rejection by `extractPTLTokenGap` (`ucH`), via the regex `prompt is too long … N tokens > M tokens` → `N - M`. `iterateReactiveGroupWalk` computes `deficit = initialTokenGap - lastGroupSize` (the last group is always preserved). `seedPreservedCount` (`bv7`) walks group sizes backward from index `windowSize-1` (where `windowSize = totalGroups-1`), accumulating tokens until the cumulative `>= deficit`, returning the count walked. `groupsPreserved = 1 + count`.

**Halving safety floor:** if it had to walk nearly all groups (`stepsTaken >= windowSize-1`, meaning one giant group dominates or the gap is huge), it abandons the count and returns `Math.max(1, Math.floor(windowSize/2))` — preventing a degenerate seed that would summarize almost nothing.

**Why this approach:**

The server tells you EXACTLY how many tokens you are over; sizing the cut from that beats both the legacy `groupsPreserved = 1` (summarize everything, which almost always re-PTLs) and a blind binary search. Pre-seed, attempt 1 always used `groupsPreserved = 1` (summarize all-but-last). For a session 0.5% over a 1M ceiling, summarizing 99% of context still gives the summarize call a ~99%-of-window prompt → PTL again → a wasted ~5s + ~$0.10 LLM call before attempt 2 did the real work. Seeding jumps `groupsPreserved` to a value that leaves room, so attempt 1 succeeds first try. It only engages when there are enough groups (`totalGroups > 3`) and the overflow exceeds the always-kept last group (`deficit > 0`). The `stepMode:"seeded"` telemetry value is the deployment-efficacy signal.

**Key insight:** It uses the *literal overflow* from the rejection, not a token estimate, so the seed is as accurate as the server's own accounting — the one number in the system guaranteed to be correct.

### PTL-retry widening (`nextStepFromGap` / `mc5`)

**What it does:** When the summarize call itself hits `prompt_too_long`, computes how many more groups to preserve before retrying.

**How it works:** If the summarize PTL error yielded a parseable `tokenGap` (via `ucH` on the summarize response), return `{ mode:"gap_guided", step: seedPreservedCount(groupSizes, summarizeWindow, tokenGap) }` — reuse the same greedy backward accumulation to size the step from the new gap. If unparseable, return `{ mode:"gap_unparseable", step:1 }` — advance conservatively by one group.

**Why this approach:** Reuses the seed logic for consistency; a parseable gap lets the retry jump straight to a fitting boundary, while the `step:1` fallback guarantees forward progress even when the error string cannot be parsed, so the loop always terminates (`groupsPreserved` strictly increases until `groupsPreserved >= totalGroups` → exhausted).

**Key insight:** The same `bv7` greedy-accumulation primitive drives both the initial seed (`mode:"seeded"`) and every PTL retry (`mode:"gap_guided"`); the telemetry `stepMode` distinguishes them for measuring how often the seed alone suffices.

```javascript
// ============================================
// seedPreservedCount + nextStepFromGap - Greedy backward token accumulation and its PTL-retry step sizer
// Location: cli_inner_pretty.js:271220-271230
// ============================================

// ORIGINAL (for source lookup):
function bv7(H, $, q) {
  let K = 0, _ = 0;
  for (let z = $ - 1; z >= 0; z--) if (((K += H[z]), _++, K >= q)) break;
  if (_ >= $ - 1) return Math.max(1, Math.floor($ / 2));
  return _;
}
function mc5(H, $, q) {
  if (H === void 0) return { mode: "gap_unparseable", step: 1 };
  return { mode: "gap_guided", step: bv7($, q, H) };
}

// READABLE (for understanding):
function seedPreservedCount(groupSizes, windowSize, targetGap) {
  let cumulative = 0, stepsTaken = 0;
  // walk groups backward from the last summarizeable group, accumulating tokens
  for (let i = windowSize - 1; i >= 0; i--) { cumulative += groupSizes[i]; stepsTaken++; if (cumulative >= targetGap) break; }
  // halving safety floor: one giant group / huge gap would otherwise eat almost everything
  if (stepsTaken >= windowSize - 1) return Math.max(1, Math.floor(windowSize / 2));
  return stepsTaken;
}
function nextStepFromGap(parsedTokenGap, groupSizes, windowSize) {
  if (parsedTokenGap === undefined) return { mode: "gap_unparseable", step: 1 }; // advance by 1 group
  return { mode: "gap_guided", step: seedPreservedCount(groupSizes, windowSize, parsedTokenGap) };
}

// Mapping: bv7->seedPreservedCount, mc5->nextStepFromGap; bv7: H->groupSizes, $->windowSize, q->targetGap, K->cumulative, _->stepsTaken; mc5: H->parsedTokenGap, $->groupSizes, q->windowSize
```

### Where `initialTokenGap` comes from — the PTL extractor (`extractPTLTokenGap` / `ucH`)

`extractPTLTokenGap` (`ucH` @ `cli_inner_pretty.js:186340`) only returns a value if the message is a PTL error. `isPromptTooLongError` (`S1H` @ `cli_inner_pretty.js:186330`) checks `isApiErrorMessage` and that a content block's text starts with `PROMPT_TOO_LONG_PREFIX` (`Rd = "Prompt is too long"` @ `cli_inner_pretty.js:186902`). It then runs `parsePTLNumbers` (`kP6` @ `cli_inner_pretty.js:186336`) — regex `/prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i` — extracting `actualTokens` and `limitTokens`, returning `actual - limit` if positive. That overflow becomes `initialTokenGap`.

The agent loop wires it in (`cli_inner_pretty.js:451734-451770`): the withheld-413 flag gates the call to `ucH`, and the result is threaded as `initialTokenGap` into `runReactiveCompact`'s params. So the seed is **the literal overflow the server reported**, not an estimate.

```javascript
// ============================================
// extractPTLTokenGap (+ isPromptTooLongError, parsePTLNumbers) - Parse the reported overflow out of a prompt-too-long rejection; the source of initialTokenGap
// Location: cli_inner_pretty.js:186330-186346, 186902
// ============================================

// ORIGINAL (for source lookup):
function S1H(H) {
  if (!H.isApiErrorMessage) return !1;
  let $ = H.message.content;
  if (!Array.isArray($)) return !1;
  return $.some((q) => q.type === "text" && q.text.startsWith(Rd));
}
function kP6(H) {
  let $ = H.match(/prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i);
  return { actualTokens: $ ? parseInt($[1], 10) : void 0, limitTokens: $ ? parseInt($[2], 10) : void 0 };
}
function ucH(H) {
  if (!S1H(H) || !H.errorDetails) return;
  let { actualTokens: $, limitTokens: q } = kP6(H.errorDetails);
  if ($ === void 0 || q === void 0) return;
  let K = $ - q;
  return K > 0 ? K : void 0;
}
// ... Rd = "Prompt is too long"

// READABLE (for understanding):
function isPromptTooLongError(msg) {
  if (!msg.isApiErrorMessage) return false;
  const content = msg.message.content;
  if (!Array.isArray(content)) return false;
  return content.some((b) => b.type === "text" && b.text.startsWith(PROMPT_TOO_LONG_PREFIX)); // "Prompt is too long"
}
function parsePTLNumbers(errorDetails) {
  const m = errorDetails.match(/prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i);
  return { actualTokens: m ? parseInt(m[1], 10) : undefined, limitTokens: m ? parseInt(m[2], 10) : undefined };
}
function extractPTLTokenGap(msg) {
  if (!isPromptTooLongError(msg) || !msg.errorDetails) return undefined;
  const { actualTokens, limitTokens } = parsePTLNumbers(msg.errorDetails);
  if (actualTokens === undefined || limitTokens === undefined) return undefined;
  const gap = actualTokens - limitTokens;
  return gap > 0 ? gap : undefined; // this becomes initialTokenGap
}

// Mapping: S1H->isPromptTooLongError, kP6->parsePTLNumbers, ucH->extractPTLTokenGap, Rd->PROMPT_TOO_LONG_PREFIX; H->msg/errorDetails, $->actualTokens, q->limitTokens, K->gap
```

---

### DX4 thresholdSource routing (proactive→reactive)

**What it does:** Decides, inside the proactive autocompact generator, whether to route headroom management to the reactive partial lane (`runReactiveCompact`) or run the legacy full-conversation summary (`compactConversationFull`).

**How it works** (`cli_inner_pretty.js:424002-424058`):

1. Pre-flight gates (424003-424017): `DISABLE_COMPACT`, `consecutiveFailures >= MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`_c6 = 3`), the `shouldAutoCompactNow` (`eb_`) threshold check, and the rapid-refill breaker via `computeRapidRefillStreak` (`fc6`) against `MAX_CONSECUTIVE_RAPID_REFILLS` (`Y08 = 3`).
2. `thresholdSource = windowSourceOf(model, window)` (`ab_` @ 424018) — the *source* of the compact window from `resolveAutoCompactWindowSource` (`Xl`): `"env"` | `"settings"` | `"experiment"` | `"auto"`. `spinnerHint = computeAutoModeHintText(...)` (`Hx_`) is the spinner hint text.
3. **Routing condition** (424020): `if (querySource !== undefined && thresholdSource !== "auto" && isNotRemote())` — when there is a querySource, the window was **explicitly configured** (not the model-default `"auto"`), and we are not in remote mode (`isNotRemote`, `_JH` = `!CLAUDE_CODE_REMOTE`). In that case route to reactive: log `autocompact: routing through reactive`, fire `tengu_auto_compact_routed_reactive`, and call `runReactiveCompact` via the `streamingCompactWrapper` (`Xv$`) with `hasAttempted:false, thresholdSource, spinnerHintText` (424023-424035).
4. On reactive success → return `{ wasCompacted:true, …, routedThroughReactive:true }` (424036-424044). On hook-block → `{ wasCompacted:false, routedThroughReactive:true }`. On failure → increment a reactive-path `consecutiveFailures` and trip the circuit breaker at `_c6` (424046-424057).
5. **Else** (424059+): the legacy proactive full path — call `compactConversationFull` (`_eH`, full-conversation summary) via `Xv$`, returning `routedThroughReactive:false`.

So `DX4` has *both* lanes inline; `routedThroughReactive` is the discriminator. The `streamingCompactWrapper` (`Xv$` @ `cli_inner_pretty.js:424103`) is a generator adapter: it runs the async compaction fn while forwarding `onCompactEvent` callbacks as yielded events through an `ad()` queue, then yields the final result.

**Why this approach:** On an explicitly-windowed context, summarizing the whole conversation pre-flight is wasteful and feeds the summarizer a pathologically long prompt; the bounded group-walk produces a strictly-bounded summarize input. `"auto"` (model-default) windows keep the legacy full path. Remote mode disables reactive (`_JH` gate).

**Key insight:** v2.1.156 makes `thresholdSource` the lane selector inside the SAME generator (`DX4`), so `routedThroughReactive` is just a boolean discriminator on one code path rather than two separately-dispatched subsystems — the reactive and full lanes share the gate cascade and circuit breaker.

```javascript
// ============================================
// DX4 reactive routing branch - Route the proactive autocompact generator to the reactive lane when the window source is explicitly configured (not "auto")
// Location: cli_inner_pretty.js:424018-424058
// ============================================

// ORIGINAL (for source lookup):
let M = ab_(A, Y), j = Hx_(A, Y);
if (K !== void 0 && M !== "auto" && _JH()) {
  (N(`autocompact: routing through reactive (thresholdSource=${M})`), d("tengu_auto_compact_routed_reactive", { thresholdSource: M }));
  let { result: J, hookBlocked: X } = yield* Xv$((Z, W, G) => lA8({ hasAttempted: !1, querySource: K, aborted: Z.abortController.signal.aborted, messages: H, cacheSafeParams: { ...q, toolUseContext: Z }, thresholdSource: M, spinnerHintText: j }), $);
  if (J) return { wasCompacted: !0, compactionResult: J, consecutiveFailures: 0, consecutiveRapidRefills: O, thresholdSource: M, routedThroughReactive: !0 };
  if (X) return { wasCompacted: !1, thresholdSource: M, routedThroughReactive: !0 };
  let P = (_?.consecutiveFailures ?? 0) + 1;
  if (P >= _c6) (N(`...circuit breaker tripped after ${P} consecutive failures (reactive path)...`, { level: "warn" }), d("tengu_auto_compact_circuit_breaker", { consecutiveFailures: P, routedThroughReactive: !0, thresholdSource: M }));
  return { wasCompacted: !1, consecutiveFailures: P, thresholdSource: M, routedThroughReactive: !0 };
}

// READABLE (for understanding):
const thresholdSource = windowSourceOf(model, autoCompactWindow); // 'env'|'settings'|'experiment'|'auto'
const spinnerHint = computeAutoModeHintText(model, autoCompactWindow);
if (querySource !== undefined && thresholdSource !== "auto" && isNotRemote()) {
  log(`autocompact: routing through reactive (thresholdSource=${thresholdSource})`);
  logEvent("tengu_auto_compact_routed_reactive", { thresholdSource });
  const { result, hookBlocked } = yield* streamingCompactWrapper(
    (ctx) => runReactiveCompact({ hasAttempted: false, querySource, aborted: ctx.abortController.signal.aborted, messages, cacheSafeParams: { ...cacheSafeParams, toolUseContext: ctx }, thresholdSource, spinnerHintText: spinnerHint }),
    sessionContext);
  if (result) return { wasCompacted: true, compactionResult: result, consecutiveFailures: 0, consecutiveRapidRefills: rapidRefills, thresholdSource, routedThroughReactive: true };
  if (hookBlocked) return { wasCompacted: false, thresholdSource, routedThroughReactive: true };
  const nextFailures = (tracking?.consecutiveFailures ?? 0) + 1;
  if (nextFailures >= MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES) { /* trip breaker, emit tengu_auto_compact_circuit_breaker */ }
  return { wasCompacted: false, consecutiveFailures: nextFailures, thresholdSource, routedThroughReactive: true };
}
// else: fall through to full-conversation compactConversationFull (routedThroughReactive:false)

// Mapping: ab_->windowSourceOf, Hx_->computeAutoModeHintText, lA8->runReactiveCompact, Xv$->streamingCompactWrapper, _JH->isNotRemote, _c6->MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES; M->thresholdSource, j->spinnerHint, K->querySource, O->rapidRefills, J->result, X->hookBlocked, P->nextFailures
```

### Proactive full vs reactive partial — explicit contrast

| Dimension | Proactive / full (`compactConversationFull`, `_eH` @ 423130) | Reactive / partial (`iterateReactiveGroupWalk`, `xA8` @ 271231) |
|---|---|---|
| **Trigger** | Pre-flight token estimate crosses threshold (`shouldAutoCompactNow`, level `compact`/`blocked`), or user `/compact` | API rejection `prompt_too_long` (`ucH`/`S1H`), OR `DX4` routing when `thresholdSource !== "auto"` |
| **Scope** | Whole conversation → single summary; `messagesToPreserve` empty-ish (only post-summary) | Oldest N groups → summary; newest `totalGroups - groupsPreserved` groups preserved verbatim |
| **Summarize input** | All messages (can be ~98% of a 1M window) | Only `toSummarize.flat()` (the oldest groups); bounded and shrinks as `groupsPreserved` grows |
| **Retry on PTL** | Drops messages from the front via `$X4` (drops first `z` groups, returns `slice(z).flat()`). `$X4` sizes the drop count `z` from the reported overflow (`ucH`) — accumulating group token sizes — or a 20% fallback (`floor(K.length*0.2)`) when no gap is parseable, clamped to `min(z, K.length-1)`, then returns `K.slice(z).flat()`. Capped at `HX4 = 3` attempts (`C <= HX4`, @ 423806); on exhaustion throws `Error(z08)` | Widens preserve window `groupsPreserved += step`, sized by `mc5`/`bv7`; on exhaustion returns `{ reason:"exhausted" }` |
| **First-attempt sizing** | n/a (summarizes everything) | Seeded from `initialTokenGap` (the reported overflow) |
| **Boundary structure** | `PP$` boundary + summary in front of (empty) kept set | `buildReactiveBoundaryMarker` (`xN6`) records `preservedSegment{headUuid,anchorUuid,tailUuid}` + `preservedMessages` of the kept newest groups |
| **Telemetry** | `tengu_compact`, `tengu_compact_ptl_retry`, `tengu_compact_failed` | `tengu_reactive_compact_{triggered,attempt,succeeded,failed}` |

Note: there is no function literally named `S3` in this build; the proactive/full path is `compactConversationFull` (`_eH` @ `cli_inner_pretty.js:423130`), reached from `DX4`'s else-branch.

---

### Finalization (`finalizeReactiveCompact` / `nA8`) and the suffix-preserving boundary

`finalizeReactiveCompact` (`nA8` @ `cli_inner_pretty.js:272376-272464`) builds the result after a successful group-walk:

- Clears `readFileState`, nested-memory paths, resets the memory selector (272393-272395) — so stale file reads are not carried past the boundary.
- `boundaryMarker = PP$(trigger, preCompactTokens, lastUuid)` builds the compact boundary marker (272398); records `durationMs`, `precomputed`, `preCompactDiscoveredTools` (272399-272401).
- Maps the preserved set via `PEH` (@ `cli_inner_pretty.js:272465`), which strips assistant-message internals as needed.
- Restores file/hook attachments for the preserved set via `Kl5` (272403).
- Runs PostCompact hooks (`zJH`, 272407) and computes the boundary via `buildReactiveBoundaryMarker` (`xN6` @ `cli_inner_pretty.js:423110`), which records `preservedSegment` (head/anchor/tail uuids) and `preservedMessages` — the metadata that lets resume rehydrate exactly which newest messages survived.
- `assembleCompactedMessages` (`h5H` @ `cli_inner_pretty.js:423104`) assembles the final array `[boundaryMarker, ...summaryMessages, ...messagesToKeep, ...attachments, ...hookResults]` → `postTokens = sumMessageTokens(...)`.
- Fires `tengu_reactive_compact_succeeded` with `attempts, groupsPreserved, totalGroups, forkAssistantMessageCount, pre/postCompactTokens, cacheHitRate`, plus precompute telemetry (272432-272461).

---

### The precompute / precomputed fast-path (v2.1.156)

`runReactiveCompact` (`lA8` @ `cli_inner_pretty.js:272240-272268`) branches on whether a precomputed result was supplied. If one exists, it skips the live group-walk entirely and reuses its `compactResult`, appending `messagesSince` to `messagesToPreserve` (messages that arrived between the precompute and now), and records precompute telemetry (`statusAtPTL, leadMs, totalMs, borrowed, messagesSinceTokens`). Otherwise it runs the live path: PreCompact hook (`Wc`) then `summarize = () => reactiveCompactSummarizeAndFinalize(messages, sessionContext, { customInstructions, initialTokenGap, ... })`.

The precompute itself is produced by `precomputeReactiveCompact` (`sv7` @ `cli_inner_pretty.js:271826` — the function body lives here; `451742` is where the loop *invokes* the precompute, not where it is defined), invoked just before `lA8` in the loop (451740-451752), which speculatively builds a compact result during the PTL wait so the boundary can be swapped in immediately (`transition.reason: "precomputed_compact_swap"` vs `"reactive_compact_retry"`, 451799). This precompute/borrow machinery is **post-v2.1.142**.

### Constants and gates

- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`_c6 = 3` @ `cli_inner_pretty.js:424128`) — circuit breaker, both lanes.
- `RAPID_REFILL_TURN_WINDOW` (`Yc6 = 3` @ `cli_inner_pretty.js:424129`) — a refill within this many turns counts toward the rapid-refill streak.
- `MAX_CONSECUTIVE_RAPID_REFILLS` (`Y08 = 3` @ `cli_inner_pretty.js:424130`) — rapid-refill breaker trips at this many.
- `MX4 = 20000` (@ `cli_inner_pretty.js:424124`) — max-output-tokens reservation for the summary.
- `NO$` — capped max output tokens for the reactive summarize call (`uc5` @ `cli_inner_pretty.js:271168`: `Math.min(NO$, E5H(model))`).
- `isAutoCompactEnabled` (`J0` @ `cli_inner_pretty.js:423983`) — false if `DISABLE_COMPACT`/`DISABLE_AUTO_COMPACT` set or the setting is off.
- `isNotRemote` (`_JH` @ `cli_inner_pretty.js:423988`) — `!CLAUDE_CODE_REMOTE`; reactive is disabled in remote mode.
- `lA8`'s own proceed-gate (@ `cli_inner_pretty.js:272228`): `if (!(!$ && q !== "compact" && J0() && _JH() && !K)) return …` — only proceeds when *not already attempted*, querySource is not the recursive `"compact"`, autocompact is enabled, not remote, and not aborted.

---

## Cross-validation against v2.1.88

The v2.1.88 checkout (`/lyz/codespace/3rd/claude-code/src/services/compact/`) has **no** `reactiveCompact.ts` file — `compact.ts:686` and `autoCompact.ts` only *reference* `reactiveCompact.ts` in comments, and `autoCompact.ts:189-200` describes a "Reactive-only mode" gated by the ant flag `tengu_cobalt_raccoon` as a new/then-emerging path. So the entire group-walk, the `initialTokenGap` seed, the PTL-retry widening, and the `DX4` routing all post-date v2.1.88.

### Matched to v2.1.88 readable source

- `groupMessagesByApiRound` (`riH` @ `cli_inner_pretty.js:270812`) is an **exact structural match** to `grouping.ts:groupMessagesByApiRound` — same assistant-id boundary gate, same trailing-group flush. The v2.1.88 docstring confirms intent: it "Replaces the prior human-turn grouping with finer-grained API-round grouping, allowing reactive compact to operate on single-prompt agentic sessions," and that the assistant-id boundary is API-safe (every tool_use is resolved before the next assistant turn). High confidence the reactive group-walk operates on API-round groups, not human turns.

```javascript
// ============================================
// groupMessagesByApiRound - Split messages into API-round groups; a new group begins on a new assistant message.id
// Location: cli_inner_pretty.js:270812-270823
// ============================================

// ORIGINAL (for source lookup):
function riH(H) {
  let $ = [], q = [], K;
  for (let _ of H) {
    if (_.type === "assistant" && _.message.id !== K && q.length > 0) ($.push(q), (q = [_]));
    else q.push(_);
    if (_.type === "assistant") K = _.message.id;
  }
  if (q.length > 0) $.push(q);
  return $;
}

// READABLE (for understanding):
function groupMessagesByApiRound(messages) {
  const groups = [];
  let current = [];
  let lastAssistantId;
  for (const msg of messages) {
    // boundary fires only when a NEW assistant response begins (different message.id)
    if (msg.type === "assistant" && msg.message.id !== lastAssistantId && current.length > 0) {
      groups.push(current);
      current = [msg];
    } else {
      current.push(msg);
    }
    if (msg.type === "assistant") lastAssistantId = msg.message.id;
  }
  if (current.length > 0) groups.push(current);
  return groups;
}

// Mapping: riH->groupMessagesByApiRound (matches v2.1.88 grouping.ts exactly), H->messages, $->groups, q->current, K->lastAssistantId, _->msg
```

- `buildCompactSummaryPrompt` (`bA8` @ `cli_inner_pretty.js:270917`) — the "TEXT ONLY" / `<analysis>`+`<summary>` 9-section summary prompt — matches the prompt builders in v2.1.88 `compact.ts`/`prompt.ts` (`getCompactPrompt` / `getPartialCompactPrompt`) in shape and section list.
- The suffix-preserving structure (summary precedes kept-newest) matches v2.1.88 `compact.ts:346-347`, which explicitly names "suffix-preserving (reactive/session-memory): last summary message" vs "prefix-preserving (partial compact): the boundary itself."

### Diverged / no v2.1.88 ancestor (post-2.1.88)

- `iterateReactiveGroupWalk` / `reactiveCompactSummarizeAndFinalize` / `runReactiveCompact` / `finalizeReactiveCompact` / `summarizeReactiveAttempt` / `seedPreservedCount` / `nextStepFromGap` (`xA8`/`bN6`/`lA8`/`nA8`/`uc5`/`bv7`/`mc5`) — the reactive group-walk machinery has no counterpart file in the v2.1.88 checkout. `reactiveCompact.ts` is referenced but absent, and `autoCompact.ts:189` frames "Reactive-only mode" as a new ant-flag (`tengu_cobalt_raccoon`) feature. So `initialTokenGap` seeding, PTL-retry widening, and the attempt taxonomy (`too_few_groups` / `exhausted` / `media_unstrippable`) are all post-2.1.88.
- The **closest** v2.1.88 relative is `partialCompactConversation` (`compact.ts:772`) — the user-driven `/compact`-at-a-pivot ("summarize from here" / "summarize up_to here"). It is conceptually the same "replace PART of the conversation" idea (slice at a pivotIndex, summarize one side, keep the other), but it is (a) manually triggered with an explicit pivot, (b) single-shot (no group-walk, no PTL retry, no token-gap seed), and (c) supports a `up_to` prefix-preserving direction reactive compact does not use. It is **not** the reactive-PTL lane.
- The `DX4` `thresholdSource` routing and the precompute/borrow path are entirely v2.1.156-era; no v2.1.88 analogue exists.

### v2.1.142 → v2.1.156 deltas (symbol renames due to re-minification; structure stable)

- `xA8` (was `uq8` in v2.1.142) — group-walk; same seed branch (`initialTokenGap !== undefined && totalGroups > 3`), same media-strip retry, same exhausted/too_few_groups taxonomy. **New** in v2.1.156: `forkAssistantMessageCount` is carried out of the walk (271286) and into `tengu_reactive_compact_succeeded`.
- `bv7` (was `B47`) and `mc5` (was `L3_`) — byte-for-byte identical logic; only the names changed.
- `riH` (was `hQH`) ≡ v2.1.88 `groupMessagesByApiRound`, unchanged.
- `ucH` (was `mUH`) — the PTL overflow extractor; same regex/semantics.
- **New** `thresholdSource` routing in `DX4`: `windowSourceOf` producing `'env'|'settings'|'experiment'|'auto'`, the gate `querySource !== undefined && thresholdSource !== "auto" && isNotRemote()`, the `tengu_auto_compact_routed_reactive` event, and the `routedThroughReactive` return field. In v2.1.142 reactive was driven primarily by the loop's PTL handler; v2.1.156 additionally lets the *proactive* generator delegate to the reactive lane for explicitly-windowed contexts.
- **New** precompute path: `sv7` builds `{outcome, swap, emittedEarlyCompactStart}`; `lA8` accepts `precomputed`/`precomputeOutcome` and a precomputed summarize closure; `nA8`/`lA8` emit precompute telemetry (`statusAtPTL, leadMs, totalMs, borrowed, messagesSinceTokens`) and `transition.reason "precomputed_compact_swap"`. The loop tracks `hasAttemptedReactiveCompact` and `borrowFrom`.
- The reactive lane now has its **own** circuit-breaker accounting inside `DX4` (`consecutiveFailures` + `routedThroughReactive` flag in `tengu_auto_compact_circuit_breaker`), distinct from the full path's breaker, both bounded by `_c6 = 3`.

**Honest gap:** Because `reactiveCompact.ts` is not in the provided v2.1.88 tree, the original (TypeScript) names for `lA8`/`bN6`/`xA8`/`nA8`/`uc5` could not be recovered from v2.1.88 directly. The v2.1.142 `07_compact/reactive_seeding.md` readable names (`iterateReactiveSummarize`/`seedPreservedCount`/`nextStepFromGap`/`summarizeReactiveAttempt`) were used for continuity, plus behavior-inferred names (`runReactiveCompact`/`finalizeReactiveCompact`). No symbol literally named "S3" exists in this build; the proactive/full path is `_eH` @ 423130, named `compactConversationFull` here and explicitly contrasted with the reactive lane.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Telemetry / model context window
> - [symbol_additions_v2_1_156_compact.md](../00_overview/symbol_additions_v2_1_156_compact.md) - This module’s new symbols

Key functions in this document:

- `runReactiveCompact` (`lA8`) — cli_inner_pretty.js:272213-272331 — Reactive-lane orchestrator: gates, fires `tengu_reactive_compact_triggered`, picks precomputed vs live summarize, runs PreCompact hook, emits compact_progress/sdk_status events, returns `{result, hookBlocked}`.
- `reactiveCompactSummarizeAndFinalize` (`bN6`) — cli_inner_pretty.js:272332-272375 — Runs the group-walk (`xA8`) with `{customInstructions, initialTokenGap}`; on failure fires `tengu_reactive_compact_failed`; on success delegates to `nA8`.
- `iterateReactiveGroupWalk` (`xA8`) — cli_inner_pretty.js:271231-271322 — The core group-walk: filters progress, groups by API round, optionally seeds `groupsPreserved` from `initialTokenGap`, then loops summarizing oldest / preserving newest, widening on PTL.
- `finalizeReactiveCompact` (`nA8`) — cli_inner_pretty.js:272376-272464 — Post-walk finalize: clears readFileState/memory, builds boundary (`PP$`/`xN6`), restores attachments, runs PostCompact+SessionStart hooks, computes postTokens, fires `tengu_reactive_compact_succeeded`.
- `summarizeReactiveAttempt` (`uc5`) — cli_inner_pretty.js:271156-271219 — One summarize LLM call: builds `bA8` prompt, forks via `xZ` (querySource 'compact', forkLabel 'reactive-compact', maxTurns 1, maxOutputTokens `min(NO$, model)`), classifies into ok/prompt_too_long(tokenGap)/media_too_large/error/aborted.
- `seedPreservedCount` (`bv7`) — cli_inner_pretty.js:271220-271226 — Greedy backward token-accumulation walk to size the seed/step; halving safety floor. Identical to v2.1.142 `B47`.
- `nextStepFromGap` (`mc5`) — cli_inner_pretty.js:271227-271230 — PTL-retry step sizer: `gap_guided` via `bv7` when a tokenGap parsed, else `gap_unparseable` step 1.
- `extractPTLTokenGap` (`ucH`) — cli_inner_pretty.js:186340-186346 — Returns `actualTokens - limitTokens` overflow from a PTL error; the source of `initialTokenGap`.
- `parsePTLNumbers` (`kP6`) — cli_inner_pretty.js:186336-186339 — Regex `/prompt is too long … N tokens > M/i` → `{actualTokens, limitTokens}`.
- `isPromptTooLongError` (`S1H`) — cli_inner_pretty.js:186330-186335 — True if an API error whose first text block starts with `Rd`.
- `PROMPT_TOO_LONG_PREFIX` (`Rd`) — cli_inner_pretty.js:186902 — String `"Prompt is too long"`.
- `groupMessagesByApiRound` (`riH`) — cli_inner_pretty.js:270812-270823 — Splits messages into API-round groups by assistant `message.id`. Matches v2.1.88 `grouping.ts` exactly.
- `buildCompactSummaryPrompt` (`bA8`) — cli_inner_pretty.js:270917+ — The 'TEXT ONLY' 9-section summary prompt used by both reactive (`uc5`) and full (`_eH`) compaction.
- `extractSummaryText` (`CA8`) — cli_inner_pretty.js:270805-270811 — Pulls trimmed text content from the assistant summarization response.
- `autoCompactGenerator` (`DX4`) — cli_inner_pretty.js:424002-424093 — Proactive autocompact generator with the v2.1.156 reactive-routing fork; returns `routedThroughReactive`.
- `compactConversationFull` (`_eH`) — cli_inner_pretty.js:423130+ — The proactive/full whole-conversation compaction path with front-dropping PTL retry capped at `HX4`; the contrast to reactive.
- `streamingCompactWrapper` (`Xv$`) — cli_inner_pretty.js:424103-424123 — Generator adapter forwarding `onCompactEvent` callbacks as yielded events through `ad()`, then yielding the result.
- `windowSourceOf` (`ab_`) — cli_inner_pretty.js:423935-423937 — Returns `Xl(...).source`: `'env'|'settings'|'experiment'|'auto'` — the `thresholdSource` that gates reactive routing.
- `resolveAutoCompactWindowSource` (`Xl`) — cli_inner_pretty.js:423915-423930 — Resolves the compact window and its source: env > settings > experiment > model-default('auto').
- `computeAutoModeHintText` (`Hx_`) — cli_inner_pretty.js:424095-424102 — Spinner hint text for experiment-source windows.
- `shouldAutoCompactNow` (`eb_`) — cli_inner_pretty.js:423991-424001 — Pre-flight gate: false for querySource 'compact'/disabled/remote; else true when token level is 'compact'/'blocked'.
- `computeRapidRefillStreak` (`fc6`) — cli_inner_pretty.js:423948-423950 — Counts consecutive rapid refills for the thrash breaker.
- `isAutoCompactEnabled` (`J0`) — cli_inner_pretty.js:423983-423987 — False if `DISABLE_COMPACT`/`DISABLE_AUTO_COMPACT` set or setting off.
- `isNotRemote` (`_JH`) — cli_inner_pretty.js:423988-423990 — `!CLAUDE_CODE_REMOTE`; reactive disabled in remote mode.
- `sumMessageTokens` (`sT`) — cli_inner_pretty.js:425283-425287 — Sums per-message token estimates over a list; used for per-group sizing in the seed.
- `tokenCountWithEstimation` (`jJ`) — cli_inner_pretty.js:221106+ — Estimates total token count of a message list (from the last compact boundary); preCompactTokens source.
- `assembleCompactedMessages` (`h5H`) — cli_inner_pretty.js:423104-423106 — `[boundaryMarker, ...summaryMessages, ...messagesToKeep, ...attachments, ...hookResults]` suffix-preserving array.
- `buildReactiveBoundaryMarker` (`xN6`) — cli_inner_pretty.js:423110-423121 — Augments the boundary with `preservedSegment{headUuid,anchorUuid,tailUuid}` and `preservedMessages` for resume rehydration.
- `stripMediaToPlaceholders` (`wN6`) — cli_inner_pretty.js:422983-423007 — Replaces image/document content blocks with `[image]`/`[document]` text; used for the media_too_large stripped retry.
- `precomputeReactiveCompact` (`sv7`) — cli_inner_pretty.js:271826 (definition; loop call site at 451742) — Speculative precompute of a reactive compact result during the PTL wait; produces `{outcome, swap, emittedEarlyCompactStart}`.
- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`_c6`) — cli_inner_pretty.js:424128 — 3; circuit-breaker limit for both lanes.
- `RAPID_REFILL_TURN_WINDOW` (`Yc6`) — cli_inner_pretty.js:424129 — 3; refill-within-N-turns window.
- `MAX_CONSECUTIVE_RAPID_REFILLS` (`Y08`) — cli_inner_pretty.js:424130 — 3; rapid-refill breaker limit.
- `MAX_SUMMARY_OUTPUT_TOKENS` (`MX4`) — cli_inner_pretty.js:424124 — 20000; max-output-tokens reservation for the summary.
