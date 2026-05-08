# Partial Compaction (`zLK`) — `up_to` and `from` Cursor Variants

## Overview

`zLK` (`partialCompactConversation`) is a sibling of `vI6` that compacts only **part** of the conversation around a user-selected message cursor. It supports two directions:

- `"up_to"` — Summarize everything *before* the cursor; keep everything after verbatim. Used by the message selector UI when the user wants to "compress the early stuff".
- `"from"` — Keep everything before the cursor verbatim; summarize from the cursor onward. (Less common; could be used for summarizing a long completed sub-task.)

This complements full compact (`vI6`) for power users who want surgical control over which messages the LLM gets to see.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module

Key functions in this document:
- `partialCompactConversation` (`zLK`) — chunks.159.mjs:749 — Main partial compact
- `partialCompactPromptBuilder` (`CI4`) — chunks.101.mjs (referenced)
- `partialCompactPrompt` (`Q0z`) — chunks.101.mjs:827 — `up_to` text
- `partialCompactBoundaryWrapper` (`Zr1`) — chunks.159.mjs (referenced)
- `compactSummaryContent` (`b18`) — chunks.101.mjs:804
- `createCompactBoundaryMessage` (`p18`) — chunks.166.mjs:118
- `truncateHeadForPTLRetry` (`KLK`) — chunks.159.mjs:512

---

## 1. Function Signature

```javascript
async function zLK(
  q,            // messages — full message array
  K,            // cursorIndex — split point
  _,            // sessionContext (analogous to vI6's K)
  z,            // cacheSafeParams (analogous to vI6's _)
  Y,            // userContext — text the user wants attached to the summary
  A = "from"    // direction — "up_to" | "from"
)
```

The function returns a richer structure than `vI6` because it must carry both the summary AND the kept-verbatim messages:

```typescript
{
  boundaryMarker: WrappedSystemMessage,       // wraps p18 + uuid binding
  summaryMessages: [UserMessage],
  messagesToKeep: Message[],                  // kept-verbatim slice
  attachments: AttachmentMessage[],
  hookResults: AttachmentMessage[],
  userDisplayMessage?: string,
  preCompactTokenCount: number,
  postCompactTokenCount: number,              // (planned, no truePostCompact field)
  compactionUsage: ApiUsage
}
```

---

## 2. Phase 1: Slice into Summarize / Keep

```javascript
// chunks.159.mjs:751-758
let H = A === "up_to" ? q.slice(0, K) : q.slice(K),
    J = A === "up_to"
        ? q.slice(K).filter((O6) => O6.type !== "progress" && !RJ(O6) && !(O6.type === "user" && O6.isCompactSummary))
        : q.slice(0, K).filter((O6) => O6.type !== "progress");
if (H.length === 0) throw Error(A === "up_to"
    ? "Nothing to summarize before the selected message."
    : "Nothing to summarize after the selected message.");
let X = vJ(q);
```

| Variable | `up_to` | `from` |
|----------|---------|--------|
| `H` (to summarize) | `q.slice(0, K)` (head) | `q.slice(K)` (tail) |
| `J` (to keep) | `q.slice(K)` filtered | `q.slice(0, K)` filtered |

The keep-set filters out:
- `progress` messages (UI ephemerals)
- `RJ(...)` (boundary markers and meta)
- For `up_to`: prior compact-summary user messages (would create a duplicate summary)

The pre-compact token count `X = vJ(q)` is the **whole conversation** — it's the headroom available before partial compact, not just the summarize-portion's count.

---

## 3. Phase 2: PreCompact Hook + Custom Instructions Composition

```javascript
// chunks.159.mjs:760-773
w = X, _.onCompactProgress?.({type:"hooks_start", hookType:"pre_compact"});
_.setSDKStatus?.("compacting");
let M = await oc({trigger: "manual", customInstructions: null}, _.abortController.signal);
ec8(M, _);

let P;
if (M.newCustomInstructions && Y) P = `${M.newCustomInstructions}\n\nUser context: ${Y}`;
else if (M.newCustomInstructions) P = M.newCustomInstructions;
else if (Y) P = `User context: ${Y}`;

_.setStreamMode?.("requesting"), _.resetResponseLength?.(),
_.onCompactProgress?.({type: "compact_start"});
let W = CI4(P, A),                                  // Build partial-compact prompt
    D = t8({content: W}),
    Z = {preCompactTokenCount: X, direction: A, messagesSummarized: H.length};
```

The PreCompact hook fires with `trigger: "manual"` (partial is always user-initiated). The user's `Y` (userContext) gets prepended with `"User context: "` and concatenated with hook-injected instructions.

Note: partial compact does not pass `suppressNotification` — if PreCompact blocks, the user *will* see the warning notification.

---

## 4. Phase 3: LLM Call with PTL Retry

```javascript
// chunks.159.mjs:774-810
let G = A === "up_to" ? H : q,
    f = A === "up_to" ? {...z, forkContextMessages: H} : z,
    v, V, k = 0;

for (;;) {
    if (v = await ALK({
            messages: G,
            summaryRequest: D,
            appState: _.getAppState(),
            context: _,
            preCompactTokenCount: X,
            cacheSafeParams: f
        }),
        V = MJ6(v),
        !V?.startsWith(cI)) break;
    k++;
    let O6 = k <= qLK ? KLK(G, v) : null;
    if (!O6) throw d("tengu_partial_compact_failed", {
        reason: "prompt_too_long",
        ...Z,
        ptlAttempts: k
    }), Error(_LK);
    d("tengu_compact_ptl_retry", {
        attempt: k,
        droppedMessages: G.length - O6.length,
        remainingMessages: O6.length,
        path: "partial"
    }), G = O6, f = {...f, forkContextMessages: O6}
}
if (!V) throw d("tengu_partial_compact_failed", {reason: "no_summary", ...Z}),
                Error("Failed to generate conversation summary - response did not contain valid text content");
else if (fp(V)) throw d("tengu_partial_compact_failed", {reason: "api_error", ...Z}),
                       Error(V);
```

### Difference from `vI6`'s LLM call

- **No cache-prefix optimization** — `ALK` is called without `stripNonEssential`, so cache-prefix logic runs internally based on flags. But because partial compact is rare and the prompt format differs from full compact, cache hits are unlikely; the optimization rarely fires.
- **PTL retry uses `tengu_partial_compact_failed`** as the failure event (separate from `tengu_compact_failed`).
- **PTL retry telemetry** uses `tengu_compact_ptl_retry` with `path: "partial"` to distinguish from full compact retries.
- **Messages passed to `ALK`**: for `up_to`, the messages are `H` (the summarize-set) — i.e., the model sees the head. For `from`, the messages are `q` (everything) — the model sees the whole thing because the cursor cuts later content. This isn't a typo — `from` makes the model summarize tail content while having full context.

---

## 5. Phase 4: Post-Compact Reconstruction

```javascript
// chunks.159.mjs:812-829
let N = pe6(_.readFileState);
_.readFileState.clear(), _.loadedNestedMemoryPaths?.clear(), sj6(_.memorySelector);

let [R, h] = await Promise.all([
    Nx8(N, _, kx8, J),                          // ← key difference: J (kept messages) passed
    hx8(_)
]);
let C = [...R, ...h], x = Ex8(_.agentId);
if (x) C.push(x);
let B = await Lx8(_);
if (B) C.push(B);
let m = yx8(_.agentId);
if (m) C.push(m);
```

### Key difference from full compact

`Nx8` is called with a 4th argument `J` (the kept messages). Inside `Nx8`:

```javascript
async function Nx8(q, K, _, z = []) {
    let Y = bDY(z),                                // Extract file paths already mentioned in J
        A = Object.entries(q).map(...).filter(($) =>
            !xDY($.filename, K.agentId) && !Y.has(Wq($.filename))     // ← skip files already kept
        ).sort(...).slice(0, _);
    // ... (rest same as full compact)
}
```

Files mentioned in the kept-verbatim messages **don't get re-attached**. This avoids duplication: if message #50 in `J` already shows `Read("/path/to/file.txt")`, the post-compact attachments shouldn't include that file again.

---

## 6. Phase 5: System Reminders (with `J` Context)

```javascript
// chunks.159.mjs:830-836
for (let O6 of MR6(_.options.tools, _.options.mainLoopModel, J, {callSite: "compact_partial"}))
    C.push(Y4(O6));
for (let O6 of PR6(_, J)) C.push(Y4(O6));
for (let O6 of WR6(_.options.mcpClients, _.options.tools, _.options.mainLoopModel, J))
    C.push(Y4(O6));
```

The system reminder builders receive the kept messages `J` so they can compute deltas correctly. For example, if `J` already contains an `agent_listing_delta` showing `["Researcher", "Writer"]`, the new builder won't emit them as "added" — it knows they're visible.

This is **strictly a delta optimization** — it prevents the post-compact prompt from showing redundant tool / agent / MCP listings the model already sees in the kept messages. Without this, partial compact's post-prompt would be larger than necessary.

---

## 7. Phase 6: SessionStart Hook + Telemetry

```javascript
// chunks.159.mjs:837-852
_.onCompactProgress?.({type: "hooks_start", hookType: "session_start"});
let S = await lR("compact", {model: _.options.mainLoopModel}),
    F = sI([v]),                                     // Planned post-compact tokens
    U = aI(v);                                       // API usage

d("tengu_partial_compact", {
    preCompactTokenCount: X,
    postCompactTokenCount: F,
    messagesKept: J.length,
    messagesSummarized: H.length,
    direction: A,
    hasUserFeedback: !!Y,
    trigger: "message_selector",
    compactionInputTokens: U?.input_tokens,
    compactionOutputTokens: U?.output_tokens,
    compactionCacheReadTokens: U?.cache_read_input_tokens ?? 0,
    compactionCacheCreationTokens: U?.cache_creation_input_tokens ?? 0
});
```

The telemetry event is named `tengu_partial_compact` (separate from `tengu_compact`). Notable extra fields:
- `messagesKept` — count of messages preserved verbatim
- `messagesSummarized` — count of messages compressed
- `direction` — `"up_to"` or `"from"`
- `hasUserFeedback` — whether the user provided `Y` userContext
- `trigger` — always `"message_selector"` (partial is always user-initiated via UI)

---

## 8. Phase 7: Boundary Marker (with Direction-Aware Wrapping)

```javascript
// chunks.159.mjs:854-882
let g = A === "up_to"
    ? q.slice(0, K).findLast((O6) => O6.type !== "progress")?.uuid
    : J.at(-1)?.uuid,
    c = p18("manual", X ?? 0, g, Y, H.length),                 // Boundary marker
    n = rc(q);
if (n.size > 0) c.compactMetadata.preCompactDiscoveredTools = [...n].sort();
c.compactMetadata.durationMs = Math.round(performance.now() - j);

let l = bY(),
    z6 = JJ() && Oa6(_.getAppState().replContexts, _.agentId),
    A6 = [t8({
        content: b18(V, !1, l, void 0, z6),                    // ← K=false (no "Continue" instruction)
        isCompactSummary: !0,
        ...J.length > 0 ? {
            summarizeMetadata: {
                messagesSummarized: H.length,
                userContext: Y,
                direction: A
            }
        } : {
            isVisibleInTranscriptOnly: !0
        }
    })];
```

### Key differences from full compact

1. **`logicalParentUuid` resolution**:
   - `up_to`: parent is the last non-progress message before the cursor (the message the user selected)
   - `from`: parent is the last message in `J` (the kept-verbatim slice)
2. **`compactMetadata.userContext`** is set to `Y` (user-provided text) — this metadata is read by UI for transcript display.
3. **`compactMetadata.messagesSummarized`** is set to `H.length` — UI shows "compacted N messages".
4. **Summary message structure**:
   - `b18(V, false, ...)` — the second arg is `false`, meaning **no "Continue" instruction**. Partial compact isn't continuing from "out of context" — it's a deliberate user action mid-conversation, so the summary is just informational.
   - **`summarizeMetadata`** is added when there are kept messages (`J.length > 0`). UI uses this to show "Earlier conversation summarized (N messages)" with the user's context.
   - When `J` is empty, behave like full compact (`isVisibleInTranscriptOnly: true`).

---

## 9. Phase 8: PostCompact Hook + Wrapped Boundary Return

```javascript
// chunks.159.mjs:884-906
GD6(), DR6(),
_.onCompactProgress?.({type: "hooks_start", hookType: "post_compact"});
let e = await K36({
    trigger: "manual",
    compactSummary: V
}, _.abortController.signal);
$ = qT([c, ...A6, ...J ?? [], ...C, ...S]),
c.compactMetadata.postTokens = $;
let i = A === "up_to" ? A6.at(-1)?.uuid ?? c.uuid : c.uuid;
return {
    boundaryMarker: Zr1(c, i, J),                              // ← wrapped boundary
    summaryMessages: A6,
    messagesToKeep: J,
    attachments: C,
    hookResults: S,
    userDisplayMessage: e.userDisplayMessage,
    preCompactTokenCount: X,
    postCompactTokenCount: F,
    compactionUsage: U
}
```

### `Zr1` — Boundary Wrapping

`Zr1(boundaryMarker, anchorUuid, keptMessages)` wraps the raw boundary marker `c` with information needed by the message-list reconstructor. The returned wrapped boundary tells the renderer:
- Where in the transcript this partial-compact happened
- What UUID anchors the post-compact resumption point
- Which messages were kept verbatim vs. summarized

The caller (the slash-command handler) uses this to splice the partial result back into the live message list correctly.

### Notable: `truePostCompactTokenCount` is omitted

Unlike `vI6`, the partial-compact return doesn't include a separate `truePostCompactTokenCount`. The caller computes the true count by summing message tokens themselves (the partial path doesn't drive the rapid-refill breaker, since partial is always manual).

`postCompactTokenCount: F` here is `sI([v])` — just the LLM response token count, *not* including kept messages or attachments. This is consistent with how full compact reports `postCompactTokenCount` (planned, from API response), while partial compact users typically care more about the kept-message count for context budgeting.

---

## 10. Telemetry Summary

| Event | When | Key fields |
|-------|------|------------|
| `tengu_partial_compact_failed` | LLM call exhausted retries | `reason` (`prompt_too_long` / `no_summary` / `api_error`), `direction`, `messagesSummarized`, `ptlAttempts` |
| `tengu_compact_ptl_retry` (with `path: "partial"`) | PTL retry attempt | `attempt`, `droppedMessages`, `remainingMessages` |
| `tengu_partial_compact` | Successful completion | `preCompactTokenCount`, `postCompactTokenCount`, `messagesKept`, `messagesSummarized`, `direction`, `hasUserFeedback`, `trigger`, `compaction*Tokens` |
| `aK6` (OpenTelemetry) | finally | `trigger: "manual"`, `success`, `duration_ms`, `pre_tokens`, `post_tokens`, `error` |

---

## 11. The `finally` Block

Identical structure to full compact:

```javascript
} catch (H) {
    throw O = H instanceof Error ? H.message : "partial compaction failed", YLK(H, _), H
} finally {
    _.setStreamMode?.("requesting"), _.resetResponseLength?.(),
    _.onCompactProgress?.({type:"compact_end"}),
    aK6({
        trigger: "manual",
        success: !O,
        durationMs: performance.now() - j,
        preTokens: w,
        postTokens: $,
        error: O
    }),
    _.setSDKStatus?.(null, {compactResult: O ? "failed" : "success", ...O && {compactError: O}})
}
```

Always-throw on error — partial compact failures are not silenced like autocompact failures. The user must see the error to decide whether to retry, change cursor, or give up.

---

## 12. Comparison: Full vs Partial Compact

| Aspect | `vI6` (full) | `zLK` (partial) |
|--------|--------------|------------------|
| Trigger | autocompact, `/compact` | message selector UI, `/compact <range>` |
| Replaces | Entire conversation | Slice before/after cursor |
| Other messages | None | Kept verbatim |
| `isCompactSummary` | true | true |
| `isVisibleInTranscriptOnly` | true | true (when no keep) / false (when keep) |
| Summary "continue" instruction | Yes (`b18(V, true, ...)`) | No (`b18(V, false, ...)`) |
| Cache-prefix optimization | Yes (`tengu_compact_cache_prefix`) | No (passes flag through `ALK` but not driven) |
| Cold-compact strip | Yes (when `isCacheCold && tengu_cold_compact`) | Never |
| Recompaction info | Set by autocompact | Always undefined |
| Failure breaker | Counts | Doesn't count |
| Rapid-refill breaker | Active | N/A |
| Telemetry event | `tengu_compact` | `tengu_partial_compact` |
| Failure event | `tengu_compact_failed` | `tengu_partial_compact_failed` |
| Returns | 9-field object | 10-field object (extra `messagesToKeep`) |
| Boundary wrapper | Plain `p18` result | `Zr1(p18, anchorUuid, kept)` |

---

## 13. The `up_to` Use Case Walkthrough

A user is 80 messages into a debugging session. Messages 1–60 are detailed problem identification ("here's the stack trace, here's the failed test, here's what I tried"). Messages 61–80 are the actual fix work. The user wants to compress 1–60 into a summary while keeping 61–80 verbatim.

1. User opens message selector, selects message 61, chooses "compact up to here".
2. The slash-command handler calls `zLK(allMessages, 61, ctx, deps, userContext, "up_to")`.
3. `H = q.slice(0, 61)` — 60 messages to summarize.
4. `J = q.slice(61).filter(...)` — 19 messages (filter drops `progress` markers and the user's just-selected message if it's a compact summary).
5. PreCompact hook fires with `customInstructions: null`. Hook may inject `newCustomInstructions: "focus on the test failure"`.
6. Combined instructions: `"focus on the test failure\n\nUser context: <user's text>"`.
7. LLM call sees only `H` (60 messages) and is asked to summarize via `CI4` partial-compact prompt.
8. Files referenced in `J` (e.g. `failing_test.py`) are skipped by `Nx8` because they're already in the kept slice.
9. System reminders fire with `J` context — most reminders return empty (no deltas needed since `J` already contains current state).
10. Post-compact reconstruction emits a boundary marker with `userContext: <user's text>`, `messagesSummarized: 60`, `direction: "up_to"`.
11. Summary message has `summarizeMetadata: {messagesSummarized: 60, userContext: <text>, direction: "up_to"}` (UI shows "Earlier 60 messages summarized: <user context>").
12. The 19 kept messages are appended after the summary.
13. Effective post-compact: `1 (boundary) + 1 (summary) + N (attachments) + 19 (kept) + M (hooks)` messages.

---

## 14. Why no rapid-refill counting?

Partial compact is always manual. The user *chose* to compact at this cursor. Even if the result re-triggers autocompact on the next turn (unlikely but possible), there's no autocompact-loop concern because partial doesn't fire autonomously. The two breakers exist specifically to protect against autocompact's autonomous retry behavior; partial compact has no such retry.

---

## 15. Key Insight

Partial compact is the **manual fine-grained alternative** to full compact. It exists because:

1. **Auto-compact compresses everything** — sometimes the user knows that only the early debugging history is wasted context, while recent fix attempts should stay verbatim. Partial compact lets them say so.
2. **Recovery from over-eager auto-compact** — if a user just got auto-compacted and the summary is too lossy, they can trigger a more targeted partial compact later (e.g. compress only the *now-old* parts).
3. **Long-running session hygiene** — a user with a 8-hour debugging session can periodically clean up the irrelevant early history without losing the actual problem-solving thread.

The implementation reuses ~85% of `vI6` (Phases 1, 3, 4, 5, 6, 8 are nearly identical), with the key differences being:
- **What gets summarized** (slice via cursor + direction) vs **everything**
- **What gets kept** (the other slice) vs **nothing**
- **Boundary metadata** (carries `userContext`, `direction`, `messagesSummarized`)
- **No "continue" directive** in summary (`b18(V, false, ...)`)
- **No rapid-refill counting** (manual only)
- **Filename de-duplication** in restoration (`Nx8` filters out files in `J`)
