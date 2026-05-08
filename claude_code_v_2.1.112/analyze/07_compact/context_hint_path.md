# Context-Hint Path — Server-Driven Overflow Recovery (NEW in v2.1.112)

## Overview

The `context-hint-2026-04-09` beta is a **new feature in v2.1.112** that gives the Anthropic API a participatory role in context management. When enabled (via the `tengu_hazel_osprey` flag), the client adds a `context-hint` beta header and a `context_hint: { enabled: true }` body field to every applicable request. If the request would overflow, the API returns HTTP 422 (Unprocessable Entity) or 424 (Failed Dependency) with structured information that lets the client surgically recover and retry.

The recovery does two things in a fixed order:
1. **Clear thinking blocks** (latched once per session — only happens on the first 422/424).
2. **Run KEEP-RECENT MC** (`qD4`) — clear all but the last 5 tool results.

This complements local autocompact: autocompact handles the steady-state case (compress before overflow); the context-hint path handles the rare "local heuristics under-counted, the API is rejecting" case.

The path is implemented in `chunks.194.mjs:790-944` and integrates into the API client via `d6A` (the request-handler builder).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — API/Telemetry

Key functions in this document:
- `isContextHintEnabled` (`x85`) — chunks.194.mjs:790
- `isContextHintError` (`u85`) — chunks.194.mjs:794
- `isContextHintBusyError` (`B85`) — chunks.194.mjs:804
- `isContextHintBadBeta` (`p85`) — chunks.194.mjs:808
- `isContextHintInvalidRequestSse` (`m85`) — chunks.194.mjs:798
- `extractRequestId` (`F85`) — chunks.194.mjs:815
- `contextHintReject` (`d85`) — chunks.194.mjs:856 — Main reject handler
- `contextHintApplyAndRetry` (`NJ7`) — chunks.194.mjs:889 — Wrapper that emits telemetry
- `buildContextHintHandler` (`d6A`) — chunks.194.mjs:906 — Request-handler builder
- `isThinkingClearLatched` (`Op6`) — chunks.1.mjs:3272
- `setThinkingClearLatched` (`wp6`) — chunks.1.mjs:3276
- `getAPIContextManagement` (`C85`) — chunks.194.mjs:741
- Telemetry: `g85`, `Va8`, `kJ7` — chunks.194.mjs:820-844

Constants:
- `I85` — `"context-hint-2026-04-09"` (beta header)
- `Q6A` — `5` (DEFAULT_KEEP_RECENT for `qD4`)
- `Q85` — empty Set (default cleared-IDs)

---

## 1. The Beta Header

```javascript
// chunks.194.mjs:846
I85 = "context-hint-2026-04-09"
```

This beta header is sent on requests when:
1. The user has enabled the beta (gated by `tengu_hazel_osprey` experiment).
2. `q.includeFirstPartyBetas` is true (configured at the API client layer).
3. `q.querySource.startsWith("repl_main_thread")` — only for main REPL queries, not subagent or background.

The body field added is:

```json
{
  "context_hint": {
    "enabled": true
  }
}
```

This signals to the server that the client supports the reject + retry contract. Without this signal, the server falls back to its standard behavior (which is to refuse oversized requests with a less-recoverable error).

---

## 2. Detecting Reject Conditions

The reject handler distinguishes four error types:

### 2.1 Context-hint error (422 or 424) — `u85`

```javascript
// chunks.194.mjs:794-796
function u85(q) {
    return q instanceof vq && (q.status === 422 || q.status === 424)
}
```

HTTP 422 (Unprocessable Entity) and 424 (Failed Dependency) signal "the request was understood and properly formed but exceeds limits." The server applies its own analysis (which may include thinking-block size estimates and tool-result size analysis) and returns one of these statuses with structured detail in the response body.

### 2.2 Context-hint busy (409) — `B85`

```javascript
// chunks.194.mjs:804-806
function B85(q) {
    return q instanceof vq && q.status === 409
}
```

HTTP 409 (Conflict) means the server is too busy to apply context-hint analysis at this moment. The client falls back gracefully — i.e., does not retry with context-hint, but lets the call propagate as a normal "service busy" error.

### 2.3 Bad beta header (400) — `p85`

```javascript
// chunks.194.mjs:808-813
function p85(q) {
    if (!(q instanceof vq)) return !1;
    if (q.status !== 400) return !1;
    let K = q.message ?? "";
    return K.includes("Unexpected value") && K.includes("anthropic-beta")
}
```

HTTP 400 with the specific "Unexpected value ... anthropic-beta" message means the server doesn't recognize the `context-hint-2026-04-09` beta name. Strips the beta and lets normal request flow proceed. This is fail-open: if the server doesn't support the beta, the client falls back to normal behavior.

### 2.4 SSE-stream invalid_request (no status) — `m85`

```javascript
// chunks.194.mjs:798-802
function m85(q) {
    if (!(q instanceof vq)) return !1;
    if (q.status !== void 0) return !1;
    return q.error?.error?.type === "invalid_request_error"
}
```

When a streaming response surfaces an `invalid_request_error` mid-stream (no HTTP status because the connection is open), this catches it. The reject path then runs `onStreamFallback` for cleanup.

### 2.5 Extract Request ID — `F85`

```javascript
// chunks.194.mjs:815-818
function F85(q) {
    if (q instanceof vq) return q.requestID ?? void 0;
    return
}
```

Used for telemetry correlation across the request/reject/retry sequence.

---

## 3. The Main Reject Handler — `d85`

```javascript
// ============================================
// contextHintReject - Apply thinking-clear + qD4 KEEP-RECENT MC
// Location: chunks.194.mjs:856-887
// ============================================

// ORIGINAL:
function d85(q, K) {
    let _ = qT(q),
        z = !1;
    if (Op6() !== !0) {
        wp6(!0), z = !0;
        let w = 0;
        for (let $ of q) {
            if ($.type !== "assistant" || !Array.isArray($.message.content)) continue;
            for (let j of $.message.content)
                if (j.type === "thinking") w += j.thinking.length;
                else if (j.type === "redacted_thinking") w += j.data.length
        }
        kJ7("context_hint", Math.round(w / 4))
    }
    let Y = qD4(q, K, { keepRecent: Q6A });
    if (!Y) SR();
    let A = Y ? Y.messages : q,
        O = qT(A);
    return E(`[CONTEXT_HINT_REJECT] thinkingCleared=${z} mc=${!!Y} tokensSaved=${Y?.tokensSaved??0}`), {
        messages: A,
        clearedIds: Y?.clearedIds ?? Q85,
        applied: { thinkingCleared: z, mcApplied: !!Y, mcTokensSaved: Y?.tokensSaved ?? 0 },
        preCompactTokenEstimate: _,
        postCompactTokenEstimate: O
    }
}

// READABLE:
function contextHintReject(messages, telemetryContext) {
  const preTokens = exactTokenCount(messages);
  let thinkingCleared = false;

  // Step 1: Latch-once thinking clear
  if (isThinkingClearLatched() !== true) {
    setThinkingClearLatched(true);
    thinkingCleared = true;

    // Compute estimate of cleared thinking tokens (for telemetry)
    let thinkingChars = 0;
    for (const msg of messages) {
      if (msg.type !== "assistant" || !Array.isArray(msg.message.content)) continue;
      for (const block of msg.message.content) {
        if (block.type === "thinking") thinkingChars += block.thinking.length;
        else if (block.type === "redacted_thinking") thinkingChars += block.data.length;
      }
    }
    emitThinkingClearLatched("context_hint", Math.round(thinkingChars / 4));
  }

  // Step 2: Apply KEEP-RECENT MC
  const mcResult = keepRecentMicrocompact(messages, telemetryContext, { keepRecent: DEFAULT_KEEP_RECENT });
  if (!mcResult) resetMicrocompactState();

  const newMessages = mcResult ? mcResult.messages : messages;
  const postTokens = exactTokenCount(newMessages);

  log(`[CONTEXT_HINT_REJECT] thinkingCleared=${thinkingCleared} mc=${!!mcResult} tokensSaved=${mcResult?.tokensSaved ?? 0}`);

  return {
    messages: newMessages,
    clearedIds: mcResult?.clearedIds ?? EMPTY_SET,
    applied: {
      thinkingCleared,
      mcApplied: !!mcResult,
      mcTokensSaved: mcResult?.tokensSaved ?? 0,
    },
    preCompactTokenEstimate: preTokens,
    postCompactTokenEstimate: postTokens,
  };
}

// Mapping: d85→contextHintReject, q→messages, K→telemetryContext, _→preTokens,
//          z→thinkingCleared, Y→mcResult, A→newMessages, O→postTokens,
//          qT→exactTokenCount, Op6→isThinkingClearLatched, wp6→setThinkingClearLatched,
//          qD4→keepRecentMicrocompact, Q6A→DEFAULT_KEEP_RECENT, SR→resetMicrocompactState,
//          kJ7→emitThinkingClearLatched, Q85→EMPTY_SET, E→log
```

### Step 1: The Thinking-Clear Latch

`Op6()`/`wp6()` operate on a global session-state flag `B8.thinkingClearLatched`. The flag starts false; once set, it stays true for the rest of the session.

```javascript
// chunks.1.mjs:3272-3276
function Op6() { return B8.thinkingClearLatched }
function wp6(q) { B8.thinkingClearLatched = q }
```

**Why latch once?**

Thinking blocks accumulate as the model thinks through long sub-tasks. A single session may produce hundreds of KB of thinking content. Once cleared, **the API will never send thinking blocks again for this session** (the `clear_thinking_20251015` strategy in `C85` keeps the latch on for all subsequent requests). So the first 422/424 is the only chance to clear them — after that, there are no thinking blocks to clear, and re-running this step would be a waste.

The latch:
- **Saves significant tokens** when first triggered (thinking blocks can be 50% of session size in agentic workflows)
- **Is one-way**: once latched, it stays — even successful requests don't reset it
- **Is per-session**: a fresh REPL session starts unlatched

The estimate `Math.round(thinkingChars / 4)` is the rough token-count estimate (average ~4 chars per token). It's a telemetry-only number; the real savings come from the API not sending those blocks back to the client on subsequent turns.

### Step 2: KEEP-RECENT MC

`qD4` (see [microcompaction.md](./microcompaction.md)) clears all but the last 5 tool results. The `keepRecent: Q6A` argument is hardcoded at 5.

If `qD4` returns `null` (no tool results to clear, or all are already cleared), `SR()` is called as a defensive measure to reset any stale cached-MC state.

### Output Structure

```typescript
{
  messages: Message[],                   // The compacted message array (or original if no MC)
  clearedIds: Set<string>,               // tool_use_ids that were cleared (or empty if MC didn't fire)
  applied: {
    thinkingCleared: boolean,            // true on first 422/424 of session
    mcApplied: boolean,                  // true if qD4 actually modified messages
    mcTokensSaved: number,               // tokens freed by MC (0 if MC didn't fire)
  },
  preCompactTokenEstimate: number,       // tokens before any clears
  postCompactTokenEstimate: number,      // tokens after both clears
}
```

The caller uses these fields for telemetry and for deciding whether to retry the request.

---

## 4. Telemetry Wrapper — `NJ7`

```javascript
// chunks.194.mjs:889-904
function NJ7(q) {
    let K = d85(q.messages, q.querySource);
    return g85({
        requestId: q.requestId,
        preCompactTokenEstimate: K.preCompactTokenEstimate,
        postCompactTokenEstimate: K.postCompactTokenEstimate,
        tokensSaved: K.preCompactTokenEstimate - K.postCompactTokenEstimate,
        thinkingCleared: K.applied.thinkingCleared,
        mcApplied: K.applied.mcApplied,
        mcTokensSaved: K.applied.mcTokensSaved
    }), {
        messages: K.messages,
        clearedIds: K.clearedIds,
        thinkingCleared: K.applied.thinkingCleared
    }
}
```

`NJ7(contextHintApplyAndRetry)` is what the API client actually calls. It:
1. Calls `d85` to apply both clears.
2. Emits `tengu_context_hint_reject` telemetry via `g85` with full token deltas and which mechanism applied.
3. Returns a slimmer object containing only what the retry path needs: `messages`, `clearedIds`, `thinkingCleared`.

---

## 5. The Request Handler Builder — `d6A`

```javascript
// chunks.194.mjs:906-962
function d6A(q) {
    if (!q.includeFirstPartyBetas) return null;
    if (!q.querySource.startsWith("repl_main_thread")) return null;
    let K = x85(),
        _ = !1,
        z = !1,
        Y = !1;
    return {
        active: K,
        logThinkingClearLatched: kJ7,
        buildRequestParams() {
            if (z = !1, !K || _) return null;
            return z = !0, {
                betaHeader: I85,
                body: {
                    context_hint: { enabled: !0 }
                }
            }
        },
        onRequestError(A, O) {
            if (!z || _) return null;
            let w = F85(A);
            if (u85(A)) return _ = !0, NJ7({ messages: O, querySource: q.querySource, requestId: w });
            if (p85(A)) return _ = !0, Va8(w, 400), { messages: O, clearedIds: Q85, thinkingCleared: !1 };
            if (B85(A)) return _ = !0, Va8(w, 409), null;
            if (q.is529Error(A)) return _ = !0, Va8(w, 529), null;
            return null
        },
        classifyStreamError(A) {
            if (Y = !1, !z || _) return !1;
            if (!m85(A)) return !1;
            return Y = !0, !0
        },
        onStreamFallback(A, O) {
            let w = Y;
            if (_ = !0, !w) return null;
            return NJ7({ messages: A, querySource: q.querySource, requestId: O })
        },
        strip() { _ = !0 }
    }
}
```

### Local State

Three booleans capture the handler's lifecycle:
- `_` (`stripped`): true after the handler has done its work for this request — prevents double-application.
- `z` (`appliedToRequest`): true if `buildRequestParams()` actually added the beta header (it returns null if not applicable).
- `Y` (`streamErrorClassified`): true if `classifyStreamError` recognized the error as recoverable.

### Per-Method Walk

#### `buildRequestParams()`
- Returns `null` if context-hint isn't active OR has already been used for this request (e.g. retry).
- Otherwise marks `z = true` and returns `{betaHeader: "context-hint-2026-04-09", body: {context_hint: {enabled: true}}}`.

#### `onRequestError(error, messages)`
- Skip if context-hint wasn't applied this request (`!z`) or already stripped (`_`).
- Extract request ID for telemetry.
- 422/424 → call `NJ7` (apply both clears), return new messages → caller retries the request once.
- 400 bad beta → emit `Va8(requestId, 400)` busy-fallback telemetry, mark stripped, return original messages with `thinkingCleared: false`.
- 409 busy → emit `Va8(requestId, 409)`, mark stripped, return null (let the original error propagate).
- 529 (overloaded) → emit `Va8(requestId, 529)`, mark stripped, return null.

#### `classifyStreamError(error)`
- Returns true if this is an SSE-stream `invalid_request_error` AND we hadn't yet stripped.
- Sets `Y = true` so `onStreamFallback` knows to act.

#### `onStreamFallback(messages, requestId)`
- If `Y` was set by `classifyStreamError`, call `NJ7` to apply clears.
- Otherwise return null (no recovery possible).

#### `strip()`
- Public method to force the handler into "done" state. Called by the API client when it's ready to retry without context-hint behavior.

### Why one beta header per request?

The handler is stateful per-request — `z` and `Y` reset for each new request, but `_` stays true once flipped. This means:
- A retried request after a 422 starts fresh (`z = false`, `Y = false`), but the first request's beta is gone.
- The thinking-clear latch (`B8.thinkingClearLatched`) survives across requests within the session.

So a typical flow is:
1. Request 1: build params with beta → 422 → NJ7 clears thinking + tool results → retry as Request 1' (no beta this time).
2. Request 1': succeeds.
3. Request 2: build params with beta (handler is fresh per-request).
4. Request 2: succeeds (rare 422 because thinking was already cleared).

---

## 6. The API Context Management Strategy — `C85`

```javascript
// ============================================
// getAPIContextManagement - Server-side context-management strategy descriptor
// Location: chunks.194.mjs:741-752
// ============================================

// ORIGINAL:
function C85(q) {
    let { hasThinking: K = !1 } = q ?? {}, _ = [];
    if (K) _.push({ type: "clear_thinking_20251015", keep: "all" });
    return _.length > 0 ? { edits: _ } : void 0
}

// READABLE:
function getAPIContextManagement(opts) {
  const { hasThinking = false } = opts ?? {};
  const edits = [];
  if (hasThinking) {
    edits.push({ type: "clear_thinking_20251015", keep: "all" });
  }
  return edits.length > 0 ? { edits } : undefined;
}
// Mapping: C85→getAPIContextManagement, q→opts, K→hasThinking
```

This is the *client-side declaration* of which API-level edit strategies to apply. It's consulted when building API requests. The strategy:

- **`clear_thinking_20251015`** with `keep: "all"` — tells the server to strip all thinking blocks from the request before processing. The `keep: "all"` qualifier means "keep all non-thinking content" (the inverse — `keep: "none"` would mean "drop everything").

In v2.1.88, there were two API context-management strategies:
- `clear_thinking_20251015` (always when `hasThinking`)
- `clear_tool_uses_20250919` (env-gated for ant users via `USE_API_CLEAR_TOOL_RESULTS`)

In v2.1.112, only `clear_thinking_20251015` survived. The tool-uses strategy is gone — its job is now done by `qD4` (KEEP-RECENT MC) on the client side as part of the reject path.

### When does `hasThinking` get set?

`hasThinking` is true when the conversation contains any `thinking` or `redacted_thinking` blocks. The latch in `d85` doesn't change `hasThinking` — it changes the latched-flag that determines whether `clear_thinking` should be applied **on every subsequent request**, not just on overflow.

Once latched, the client effectively says "I never want to send thinking blocks back to you again this session" — `C85` returns the `clear_thinking` edit, and the API strips them server-side as part of normal request handling.

---

## 7. Telemetry Events

### `g85` — `tengu_context_hint_reject`

```javascript
// chunks.194.mjs:820-830
function g85(q) {
    d("tengu_context_hint_reject", {
        requestId: q.requestId,
        preCompactTokenEstimate: q.preCompactTokenEstimate,
        postCompactTokenEstimate: q.postCompactTokenEstimate,
        tokensSaved: q.tokensSaved,
        thinkingCleared: q.thinkingCleared,
        mcApplied: q.mcApplied,
        mcTokensSaved: q.mcTokensSaved
    })
}
```

Fired every time a 422/424 triggers the reject path. Tracks token deltas and which mechanism applied (thinking, MC, both).

### `Va8` — `tengu_context_hint_busy_fallback`

```javascript
// chunks.194.mjs:832-837
function Va8(q, K) {
    d("tengu_context_hint_busy_fallback", {
        requestId: q,
        status: K
    })
}
```

Fired for non-recoverable rejection paths: 409 busy, 400 bad beta, 529 overloaded. Useful for monitoring server-side context-hint deployment health.

### `kJ7` — `tengu_thinking_clear_latched`

```javascript
// chunks.194.mjs:839-844
function kJ7(q, K) {
    d("tengu_thinking_clear_latched", {
        trigger: q,
        estimatedThinkingTokens: K
    })
}
```

Fired the **first time** the thinking-clear latch flips per session. The `trigger` is `"context_hint"` (currently the only trigger that can latch this). The estimated thinking tokens is the rough total at latch-time.

---

## 8. Full Request Lifecycle With Context-Hint

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          User turn N                                     │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  buildContextHintHandler(query)                                          │
│  Returns handler if includeFirstPartyBetas && repl_main_thread query     │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  handler.buildRequestParams()                                            │
│  Returns {betaHeader: "context-hint-2026-04-09",                         │
│           body: {context_hint: {enabled: true}}}                          │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  API request fires with beta header + body field                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   200 success          422/424 reject        Other error
        │                     │                     │
        │              handler.onRequestError       │
        │                     │                     │
        │              NJ7 → d85:                   │
        │              - thinking clear (latch)     │
        │              - qD4 KEEP-RECENT MC         │
        │                     │                     │
        │              Returns new messages         │
        │                     │                     │
        │              ┌──────────────┐             │
        │              │ Retry once   │             │
        │              │ (no beta)    │             │
        │              └──────────────┘             │
        │                     │                     │
        ▼                     ▼                     ▼
   Use response         Use response         Standard error
                                              propagation
```

### Why "retry once"?

The retry happens **once** because:
- If the first attempt was rejected for thinking-block size and we cleared all thinking, the retry should succeed.
- If the retry also fails, it means the conversation is structurally too large — autocompact would be the next intervention, but autocompact runs *between* turns, not within an in-flight request.
- Looping retries within a single user turn would risk thrashing — the user's intent is "do this thing once," and surfacing a quota/bandwidth error after one retry is the right UX.

---

## 9. Why This Design?

### Server-driven vs purely client-driven

Local autocompact is **purely client-driven**: the client estimates tokens, picks a threshold, and decides when to compact. The estimate (`vJ`) is fast but imperfect — it doesn't account for server-side message rewriting, doesn't know exact tokenization for novel content, and can't see thinking-block size on cached prefixes.

Server-driven context-hint:
- Uses **authoritative server-side counts** — the server actually tokenizes the content for inference, so it knows exactly when overflow will happen.
- Fires **only when needed** — if the local heuristic is correct, this path never fires.
- Provides **structured recovery info** — the 422/424 response can include hints about what to clear (in the future; currently the client just defaults to thinking + tool results).

### Why two clears in a fixed order?

1. **Thinking first** because:
   - The latch is one-way; we want to consolidate the cost into one operation
   - Thinking blocks tend to be larger than individual tool results
   - The savings are visible to the server immediately on retry (the API strips them server-side)

2. **Tool results second** because:
   - Even after thinking is cleared, the request might still overflow if there are many large tool results
   - Tool results are easily reversible (they're saved in the JSONL transcript)
   - Keeping the recent 5 preserves enough context for the model to continue

The fixed order means the recovery is **deterministic and idempotent** — retrying the same request always produces the same recovery state.

### Why is this gated by `tengu_hazel_osprey`?

- **Beta needs server support** — only requests routed to servers that understand the beta header benefit. Gating prevents non-supporting servers from receiving unrecognized beta headers.
- **Safety period** — new behavior should be opt-in until validated in production.
- **Per-user A/B testing** — let some users experience the new path while others use legacy behavior, to measure real-world impact on overflow recovery.

---

## 10. Comparison to v2.1.88

| Aspect | v2.1.88 | v2.1.112 |
|--------|---------|----------|
| Server-side overflow help | Not present | NEW via `context-hint-2026-04-09` |
| 422/424 status codes for context | Not used by client | Triggers d85 reject handler |
| Thinking clear strategy | Per-request via `clear_thinking_20251015` | Same, but latched once-per-session |
| Tool results clear strategy | Per-request via `clear_tool_uses_20250919` (ant-only env-gated) | Removed; replaced by client-side `qD4` MC in reject path |
| Overflow recovery within a request | None | One retry after `d85` clears |
| Gating flag | n/a | `tengu_hazel_osprey` |
| Telemetry | Standard `tengu_compact_*` | + `tengu_context_hint_*`, `tengu_thinking_clear_latched` |

---

## 11. The Three Telemetry Events Together

A typical reject sequence emits 2–3 events:

1. **`tengu_thinking_clear_latched`** (only on first 422/424 of session, before `tengu_context_hint_reject`)
   - `trigger: "context_hint"`
   - `estimatedThinkingTokens: <count>`

2. **`tengu_time_based_microcompact`** (only if `qD4` actually cleared anything)
   - `trigger: "context_hint"`
   - `toolsCleared`, `toolsKept`, `keepRecent`, `tokensSaved`

3. **`tengu_context_hint_reject`** (always for 422/424 path)
   - `requestId`, `preCompactTokenEstimate`, `postCompactTokenEstimate`, `tokensSaved`
   - `thinkingCleared`, `mcApplied`, `mcTokensSaved`

For the busy-fallback path (409, 400, 529):

- **`tengu_context_hint_busy_fallback`** (single event)
   - `requestId`, `status`

---

## 12. Key Insight

The context-hint path is **opportunistic recovery, not a primary mechanism**. Local autocompact remains the main load-bearing safety net for context management — it runs on every turn and prevents most overflow conditions before they happen. The context-hint path catches the *residual* failure cases where local heuristics under-counted.

The design philosophy is:
- **Optimize for the common case** with local autocompact (free, predictable, runs every turn).
- **Have a server-side safety net** for the rare cases where local heuristics fail (zero cost when not triggered, one round-trip cost when triggered).

This separation also allows independent evolution:
- Local autocompact can be tuned for cost (lower threshold = more compacts, but cheaper per-turn).
- Server-side context-hint can evolve to handle new failure modes (e.g., multi-modal token estimation) without touching client code.

The `tengu_hazel_osprey` gate is the bridge: when it's off, the client falls back to v2.1.88 behavior (autocompact only). When it's on, the new path activates without changing the autocompact logic at all — the two systems are orthogonal.
