# Cache-Prefix Compact — `tengu_compact_cache_prefix`

## Overview

The cache-prefix optimization (`tengu_compact_cache_prefix`, default **on**) is a Phase 3a sub-step in the compact LLM call that tries to reuse the **upstream prompt cache** for the compact summary request. Instead of issuing the compact request as a fresh API call (which would pay full cache-creation costs), the optimization issues it as a **fork** against the existing cached input prefix, paying only **cache-read costs**.

When successful, this is dramatically cheaper than the standard compact call. When it fails or returns invalid output, the system falls back to the standard streaming call.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — API

Key functions in this document:
- `cachePrefixCall` (`rP`) — referenced — the "fork" API call
- `findLastAssistantMessage` (`fM`) — referenced
- `extractSummaryText` (`MJ6`) — chunks.165.mjs:2034
- `permissionStubForCompactAgent` (`Or1`) — chunks.159.mjs:937
- `innerCompactCall` (`ALK`) — chunks.159.mjs:948 (host)

Constants:
- `Po6` — Max output tokens cap for compact (referenced)

Telemetry events:
- `tengu_compact_cache_sharing_success`
- `tengu_compact_cache_sharing_fallback`

Feature flag: `tengu_compact_cache_prefix` (default true)

---

## 1. The Optimization Premise

When a session is mid-stream:
- The **input prefix** (system prompt + early conversation messages) is cached upstream.
- Subsequent turns at the same prefix get **cache-read pricing** (~10% of input pricing).
- **New content** at the end of each turn extends the cache.

When compact runs, the conventional approach would:
- Issue a new request with the full conversation as input.
- The system prompt for compact differs from the agent's normal system prompt (compact uses "You are a helpful AI assistant tasked with summarizing conversations.").
- Result: the cache prefix doesn't match → full cache-creation cost on the input.

The cache-prefix optimization observes that:
- **The conversation messages themselves are still cached** (only the system prompt and tool definitions changed).
- **Anthropic's API supports prompt caching with multiple system prompts** by using the `cache_control` markers correctly.
- **A "fork" call** can ride the existing cache for everything except the new summary request.

The savings is roughly: `(input_tokens × 0.9) × pricing` per compact call, which on a 200K-token conversation is significant.

---

## 2. The Fork Call (`rP`)

```javascript
// chunks.159.mjs:962-988 (cache-prefix attempt block)
if (w) try {
    let f = await rP({
            promptMessages: [K],                // ONLY the summary request
            cacheSafeParams: A,                  // The cached upstream parameters
            canUseTool: Or1(),                   // Permission stub - rejects all tool use
            querySource: "compact",
            forkLabel: "compact",
            maxTurns: 1,
            maxOutputTokens: Math.min(Po6, lc(z.options.mainLoopModel)),
            skipCacheWrite: !0,                  // ← CRITICAL: don't pollute upstream cache
            skipTranscript: !0,                  // ← Don't record this in conversation transcript
            overrides: {
                abortController: z.abortController
            }
        }),
        v = fM(f.messages),                      // findLastAssistantMessage
        V = v ? MJ6(v) : null;                   // extractSummaryText

    if (v && V && !v.isApiErrorMessage) {
        if (!V.startsWith(cI)) d("tengu_compact_cache_sharing_success", {
            preCompactTokenCount: Y,
            outputTokens: f.totalUsage.output_tokens,
            cacheReadInputTokens: f.totalUsage.cache_read_input_tokens,
            cacheCreationInputTokens: f.totalUsage.cache_creation_input_tokens,
            cacheHitRate: f.totalUsage.cache_read_input_tokens > 0 ?
                f.totalUsage.cache_read_input_tokens /
                (f.totalUsage.cache_read_input_tokens +
                 f.totalUsage.cache_creation_input_tokens +
                 f.totalUsage.input_tokens) : 0
        });
        return v                                  // ← early return: skip the standard call
    }
    E(`Compact cache sharing: no text in response, falling back. Response: ${I6(v)}`,
      {level: "warn"});
    d("tengu_compact_cache_sharing_fallback", {
        reason: "no_text_response",
        preCompactTokenCount: Y
    })
} catch (f) {
    j6(f),
    d("tengu_compact_cache_sharing_fallback", {
        reason: "error",
        preCompactTokenCount: Y
    })
}
```

### Argument-by-Argument Breakdown

| Argument | Value | Purpose |
|----------|-------|---------|
| `promptMessages` | `[K]` (just the summary request) | The new content to append; the cache provides the prefix |
| `cacheSafeParams` | `A` (forkContextMessages + system parameters) | The cached state to fork from |
| `canUseTool` | `Or1()` permission stub | Rejects any tool_use, ensuring text-only output |
| `querySource` | `"compact"` | Telemetry source identifier |
| `forkLabel` | `"compact"` | Cache-fork identifier (helps debugging cache hits) |
| `maxTurns` | `1` | One LLM turn only |
| `maxOutputTokens` | `min(Po6, modelMaxOutput)` | Standard compact output cap |
| `skipCacheWrite` | `true` | **Don't write a new cache** — read-only |
| `skipTranscript` | `true` | Don't record this in the JSONL transcript |
| `overrides.abortController` | session abort controller | User can cancel mid-fork |

### `skipCacheWrite: true` is the Key

This single flag distinguishes "fork that reads cache without polluting it" from a normal request. When `skipCacheWrite` is true:
- The request reads cache normally → cache-read pricing on the cached prefix
- No new cache entries are created → the upstream cache for the *next* normal turn is unaffected

If `skipCacheWrite` were false, the compact call would:
- Read the cached prefix (cache-read pricing on existing prefix)
- Write a new cache entry combining cached prefix + summary request (cache-creation pricing)
- The next normal turn would see TWO cached prefixes (the old one and the new one) — possibly a cache miss because of the routing complexity

---

## 3. Result Validation

After the call returns, three checks gate whether to use the result:

```javascript
let v = fM(f.messages),
    V = v ? MJ6(v) : null;

if (v && V && !v.isApiErrorMessage) {
    if (!V.startsWith(cI)) {  // cI = "Prompt is too long"
        // success
    }
}
```

| Check | Failure means | Action |
|-------|---------------|--------|
| `v` (last assistant message exists) | API returned no usable response | Fallback (no_text_response) |
| `V` (extractSummaryText returned non-null) | Response had no text content | Fallback (no_text_response) |
| `!v.isApiErrorMessage` | Response was an error wrapped as a message | Fallback (no_text_response) |
| `!V.startsWith(cI)` | Response was "Prompt is too long" | Don't return success, but also don't explicitly fallback — falls through to standard call where PTL retry kicks in |

The PTL check is subtle: if the cache-prefix call returns "Prompt is too long", we DON'T early-return. The standard call below in `ALK` will then attempt the same with PTL retry. We don't run PTL retry on the cache-prefix path because:
- PTL retry mutates the messages (drops head)
- Mutating messages would invalidate the cache match for the prefix
- The standard call's PTL handling already exists; reusing it is simpler

---

## 4. Success Telemetry

```javascript
d("tengu_compact_cache_sharing_success", {
    preCompactTokenCount: Y,
    outputTokens: f.totalUsage.output_tokens,
    cacheReadInputTokens: f.totalUsage.cache_read_input_tokens,
    cacheCreationInputTokens: f.totalUsage.cache_creation_input_tokens,
    cacheHitRate: f.totalUsage.cache_read_input_tokens > 0 ?
        f.totalUsage.cache_read_input_tokens /
        (f.totalUsage.cache_read_input_tokens +
         f.totalUsage.cache_creation_input_tokens +
         f.totalUsage.input_tokens) : 0
});
```

The `cacheHitRate` is the most analytically useful field:

```
cacheHitRate = cache_read_input_tokens / (cache_read + cache_creation + non-cached input)
```

A value of `0.95` means 95% of input tokens were served from cache. A value of `0.0` means no cache was hit (the optimization didn't help).

For a typical successful compact:
- Pre-compact tokens: ~167K (autocompact threshold)
- Cache-read tokens: ~165K (the conversation, mostly cached)
- Cache-creation tokens: ~50 (the summary request, which is small)
- Non-cached input tokens: ~0
- Cache hit rate: ~99.97%

### Why log the breakdown?

Anthropic likely uses this telemetry to:
- Validate that the optimization is actually working in production (not just in tests)
- Identify cache-routing regressions (sudden drop in `cacheHitRate`)
- Tune cache TTL strategies (low hit rates suggest TTL is too short)
- Compare cost savings across different model families

---

## 5. Fallback Telemetry

```javascript
d("tengu_compact_cache_sharing_fallback", {
    reason: "no_text_response" | "error",
    preCompactTokenCount: Y
})
```

Two reasons:
- `"no_text_response"` — the call succeeded HTTP-wise but returned no usable text
- `"error"` — the call threw an exception

Distinguishing these helps diagnose:
- High `no_text_response` rates suggest the model is producing tool_use even with the permission stub (possibly a model regression).
- High `error` rates suggest network or API issues.

After fallback telemetry fires, the standard streaming path runs (Phase 3b), which has its own retry logic.

---

## 6. The Fall-Through to Standard Call

If the cache-prefix attempt fails or returns no usable response, **execution does not return** — instead, it falls through to the standard streaming call below in `ALK`:

```javascript
// In ALK, after the cache-prefix block (chunks.159.mjs:998 onward)
let j = !1, H;
z.resetResponseLength?.();
let X = !O && await l38(...) ? j2([Kz, r58, ...mcpTools], "name") : [Kz],
    M = [...H2(q), K],
    P = Ar1(Gx8(O ? SDY(M) : M)),
    W = O ? CDY(P) : P,
    Z = eb6({...})[Symbol.asyncIterator](),
    G = await Z.next();
// ... (standard streaming loop)
```

The standard call **does not retry the cache-prefix optimization** — it goes straight to a normal API call with full input. This is by design:
- If cache-prefix failed, retrying it is unlikely to succeed (the failure mode is probably persistent: PTL, model regression, network).
- The standard call has its own retry logic (PTL truncation in `vI6`'s outer loop).
- Retrying cache-prefix would double the cost on the failure case.

So the worst case is: cache-prefix call (failed) + standard call (succeeded) = roughly 1.5× the standard call's cost. The best case is: cache-prefix call only = ~0.05× the standard call's cost. The expected value depends on the failure rate; in production it's likely heavily weighted toward success.

---

## 7. When is Cache-Prefix Skipped?

Two cases skip the cache-prefix attempt entirely:

### Case 1: `stripNonEssential` is true (cold compact)

```javascript
let w = !O && u8("tengu_compact_cache_prefix", !0);
//      ^ !O blocks when stripNonEssential
```

When compacting on a cold cache, we already know there's nothing to read from. See [cold_compact.md](./cold_compact.md).

### Case 2: `tengu_compact_cache_prefix` flag is false

The flag defaults to `true`, but can be flipped off:
- For an experiment showing it's not helping
- For temporary kill-switch if a regression is detected in production
- For users in a control group

When the flag is false, `w` is false, the cache-prefix block is skipped, standard call runs.

---

## 8. Why Not Always Use Cache-Prefix?

If cache-prefix is so much cheaper, why have a fallback at all?

**Failure modes**:
1. **Cache miss** — the prefix may not be cached upstream (e.g., first compact in a fresh session, or after PTL retries that mutated the prefix).
2. **Stale prefix** — if any messages in the prefix were modified (e.g., by `qD4` MC), the cache hash differs.
3. **Model regression** — the model may produce an unexpected response shape (e.g., starting with empty text block).
4. **API errors** — transient errors are handled by the fallback path.

**The fallback ensures the user always gets a compact**, even when the optimization fails. Cost predictability matters: users would rather pay 1.5× cost when something goes wrong than have compact fail entirely.

---

## 9. Why Not Always Use Standard Call?

If the standard call always works, why have cache-prefix at all?

**Cost matters at scale**:
- Most autocompact triggers happen on long sessions where cache is warm.
- Most cache-prefix attempts succeed.
- The expected cost reduction is significant — for a high-volume user, cache-prefix saves substantial compute.

**The optimization is opportunistic**: it tries to be cheap when it can, falls back to standard when it can't. The user sees no functional difference; only the bill differs.

---

## 10. Interaction with PTL Retry

The cache-prefix path **does not handle PTL retries**:

```javascript
if (!V.startsWith(cI)) d("...success", {...}), return v;
// If V starts with cI ("Prompt is too long"), don't return success.
// Don't fallback either — let the function continue to standard call.
// Standard call will produce its own PTL response, and the OUTER loop in vI6 handles retries.
```

This is subtle: a PTL response from cache-prefix doesn't trigger fallback telemetry. Instead, it's silently ignored, and the standard call runs. The standard call hits PTL again, triggering `vI6`'s outer retry loop with `KLK` truncation.

Why?
- The cache-prefix PTL would imply truncating the cached prefix → cache miss on retry → defeats the optimization.
- Letting the standard call handle PTL means the truncation is uniform across cache-prefix and standard paths.

---

## 11. Interaction with `Or1()` Permission Stub

The cache-prefix call uses `canUseTool: Or1()`, the same permission stub as the standard call. This ensures:
- Even if the model attempts a tool_use, the call is rejected with `"Tool use is not allowed during compaction"`.
- The result has no tool_use blocks, only text.

If the model produces a tool_use, the rejected tool_use becomes part of the response, but `MJ6` (extractSummaryText) only extracts text. So a tool_use would result in `V` being null or empty → fallback path.

---

## 12. The `forkLabel: "compact"` Field

This argument helps the upstream cache routing:
- Cache lookups are keyed by something including the forkLabel.
- Multiple forks against the same prefix (e.g., "compact" and "background_research") get distinct cache entries.
- This prevents accidental cache collisions where one fork's response gets served for a different fork's request.

For compact, `"compact"` is the only label used. Other features (e.g., subagent invocation) use different labels.

---

## 13. Telemetry Volume Estimate

For a typical heavy user (multiple compacts per day):
- Per session: 1-3 autocompact triggers
- Cache-prefix success rate (estimate): ~85-95%
- For successful: 1 `tengu_compact_cache_sharing_success` event with detailed token breakdown
- For failed: 1 `tengu_compact_cache_sharing_fallback` event + 1 standard call

The success events are more informative (have cacheHitRate, token breakdowns); the fallback events are simpler (just reason + preCompactTokenCount). This makes sense: success is more analytically interesting (how well is it working?), failure is more about routing (how often does the fallback kick in?).

---

## 14. Comparison with v2.1.88

| Feature | v2.1.88 source | v2.1.112 binary |
|---------|----------------|-----------------|
| `tengu_compact_cache_prefix` flag | Yes (similar gate) | Yes (`u8("tengu_compact_cache_prefix", !0)`) |
| Default state | true | true |
| Disable on cold-compact | Yes | Yes (`!w` gate) |
| `rP({skipCacheWrite: true})` mechanism | Yes | Yes (same call shape) |
| Success telemetry with `cacheHitRate` | Yes | Yes (same fields) |
| Fallback telemetry with `reason` field | Yes | Yes (same fields) |
| Fallback to standard streaming on failure | Yes | Yes |

The cache-prefix optimization has been stable across versions — same gate, same call shape, same telemetry. This suggests the optimization is a well-validated production-grade feature, not an active experiment.

---

## 15. Edge Cases

### Cache-prefix succeeds with PTL response

The function falls through to standard call. Not a true failure or success — telemetry doesn't fire either event for this case (the PTL is silently dropped). The standard call then handles PTL retry.

### Cache-prefix throws AbortError mid-call

User cancelled compact. The `catch` block calls `j6(f)` to log the error and emits `tengu_compact_cache_sharing_fallback` with `reason: "error"`. Then the standard call also throws AbortError (because the same abortController is shared). `vI6`'s outer try/catch handles the abort.

### Multiple compacts in rapid succession

Each compact is a separate `rP` call. The cache may or may not hit depending on:
- Whether the previous compact wrote anything (it doesn't, due to `skipCacheWrite: true`).
- Whether the upstream cache TTL hasn't expired.
- Whether other API calls (between compacts) modified the cached prefix.

In typical use, rapid compacts (e.g., autocompact + manual `/compact` immediately after) both hit the cache because nothing changed in between.

### Cache-prefix succeeds but the response is structurally invalid

If the response has tool_use only (no text), `MJ6` returns null → `V` is null → fallback path. Standard call runs.

If the response has text content but `isApiErrorMessage` is true (server-side error wrapped as a message), the third check `!v.isApiErrorMessage` triggers fallback. Standard call runs.

In both cases, the fallback is silent at the user level — they just see a slight delay before the compact completes, but no error.

---

## 16. Why is the Default `true`?

Most users benefit from cache-prefix:
- Long sessions (where compact fires) are typically warm-cache scenarios.
- The optimization is transparent — failure falls back gracefully.
- The cost savings are significant in aggregate.

Defaulting `false` would leave money on the table. Defaulting `true` with a gate gives Anthropic a kill-switch if production issues emerge.

---

## 17. Key Insight

Cache-prefix compact is a **cost optimization for the common case**:
- **Common case**: warm-cache mid-session compact → use cache-prefix to slash cost ~10×.
- **Uncommon case**: cold-cache, error, or weird model behavior → silently fall back to standard call, no user impact.
- **Failure modes are isolated**: a failed cache-prefix attempt doesn't break compaction; it just costs slightly more.

The pattern is "try cheap first, fall back to expensive on failure" — a classic optimization that only works when the fallback is truly transparent. The presence of `tengu_compact_cache_sharing_*` telemetry events shows Anthropic actively monitors whether the optimization is paying off; if the success rate ever dropped significantly, they could disable the gate and revert to standard-only behavior in seconds.
