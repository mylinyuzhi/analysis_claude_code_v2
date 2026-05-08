# Cold Compact — `tengu_cold_compact` Strip-Non-Essential Path

## Overview

When the prompt cache has been **cold for ≥ 1.5 hours** (`pDY = 5_400_000ms`) AND the `tengu_cold_compact` feature flag is enabled, the autocompact dispatcher passes `stripNonEssential = true` to `vI6`. This activates the **cold-compact path**, which strips non-essential content from the compact LLM call:

- **Images and documents** — replaced with placeholders or stripped entirely (`SDY`)
- **Tool definitions** — empty `tools: []` array (no tools sent at all)
- **Tool inputs and results** — truncated to ~100 characters each (`CDY`)
- **Cache-prefix optimization** — disabled (no point sharing a cold cache)

The reasoning: a cold cache means the upstream prompt cache TTL has expired anyway, so there's no point investing in cache-prefix sharing. Strip down to bare minimum to reduce input cost on the inevitable re-warm.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module

Key functions in this document:
- `isCacheCold` (`FDY`) — chunks.159.mjs:1316
- `getLastActivityTimestamp` (`AV`) — referenced
- `stripImagesAndDocs` (`SDY`) — chunks.159.mjs (referenced in ALK)
- `truncateContents` (`CDY`) — chunks.159.mjs (referenced in ALK)
- `compactConversation` (`vI6`) — chunks.159.mjs:574 (uses stripNonEssential)
- `innerCompactCall` (`ALK`) — chunks.159.mjs:948 (gates SDY/CDY)

Constants:
- `pDY` (`COLD_CACHE_THRESHOLD`) — 5,400,000ms = 1.5 hours

Feature flag: `tengu_cold_compact`

---

## 1. The Trigger Path

In `QkK` (autocompactDispatcher) at chunks.159.mjs:1405:

```javascript
let X = FDY() && u8("tengu_cold_compact", !1);
try {
    let M = await vI6(q, K, _, !0, void 0, !0, J, X);
    // ...
}
```

`X` is the cold-compact flag. Both conditions must be true:
1. **`FDY()` returns true** — the cache is cold (≥1.5h since last activity)
2. **`tengu_cold_compact` flag is on** — the experiment is enabled for this user

`X` is then passed as `vI6`'s 8th argument (`stripNonEssential = w`).

**Note**: The slash-command path (`JLY`) **does not** pass `stripNonEssential = true`. Manual `/compact` always uses the full pipeline regardless of cache state. The cold path is autocompact-only.

---

## 2. Cache Cold Detection (`FDY`)

```javascript
// ============================================
// isCacheCold - Has it been ≥1.5h since last activity?
// Location: chunks.159.mjs:1316-1318
// ============================================

// ORIGINAL:
function FDY() {
    return Date.now() - AV() >= pDY
}

// READABLE:
function isCacheCold() {
  return Date.now() - getLastActivityTimestamp() >= COLD_CACHE_THRESHOLD;
}

// Mapping: FDY→isCacheCold, AV→getLastActivityTimestamp, pDY→COLD_CACHE_THRESHOLD (5_400_000ms)
```

`AV()` returns the timestamp of the last "activity" — typically the last user input or the last successful API response. The comparison `Date.now() - AV() >= pDY` is true when 1.5 hours have passed without activity.

Why 1.5 hours? Anthropic's prompt cache TTL has historically been around 5 minutes for short cache prefixes and longer for stable prefixes. 1.5 hours is well past any reasonable cache TTL — by then we know the cache is cold no matter what.

---

## 3. The `stripNonEssential` Effects in `vI6`

Three behavior changes when `stripNonEssential = true`:

### 3.1 Cache-Prefix Optimization Disabled

```javascript
// In vI6 at chunks.159.mjs:597
let W = !w && u8("tengu_compact_cache_prefix", !0);
```

The `!w` (where `w` is `stripNonEssential`) ensures `W` (cache-prefix flag) is false when stripping. The cache-prefix optimization (Phase 3a in `ALK`) reads from upstream cache without writing — but if the upstream cache is cold, there's nothing to read. Skipping the attempt avoids:
- The extra request round-trip
- The fallback telemetry events (`tengu_compact_cache_sharing_fallback`)
- Potential cache pollution if the inner call somehow does write

### 3.2 Stripped Messages in `ALK`

```javascript
// In ALK at chunks.159.mjs:1004-1007
let X = !O && await l38(...) ? j2([Kz, r58, ...z.options.tools.filter((f) => f.isMcp)], "name") : [Kz],
    M = [...H2(q), K],
    P = Ar1(Gx8(O ? SDY(M) : M)),
    W = O ? CDY(P) : P,
```

Here `O` is the `stripNonEssential` argument. When true:
- `SDY(M)` — strip images and documents from the message array
- `CDY(P)` — truncate tool inputs and results in remaining messages
- `tools: O ? [] : X` — send empty tools array

When false (normal compact):
- `M` is left unchanged
- `P` is the result of `Ar1(Gx8(M))` (alternation + dedup, no stripping)
- `W = P` (no truncation)
- `tools: X` (`Kz` summary stub plus optional rich tools)

### 3.3 Tool Choice and Tool List

```javascript
let X = !O && await l38(z.options.mainLoopModel, z.options.tools, async () => _.toolPermissionContext, z.options.agentDefinitions.activeAgents, "compact")
    ? j2([Kz, r58, ...z.options.tools.filter((f) => f.isMcp)], "name")
    : [Kz];
```

When `O` (stripNonEssential) is false AND `l38(...)` (some richer-tools predicate) is true, the compact call gets a richer tool list:
- `Kz` (summary stub)
- `r58` (some other reference tool)
- All MCP tools from the session

When `O` is true OR `l38` is false, the compact call gets only `[Kz]`.

The cold-compact path forces `[Kz]` regardless of `l38`, ensuring the LLM call is as small as possible.

In the API call:
```javascript
tools: O ? [] : X,
```

Even though `X = [Kz]`, the cold-compact path overrides this with `[]` — empty tools at the API level.

---

## 4. Inferring `SDY` and `CDY` Behavior

The exact bodies of `SDY` and `CDY` weren't fully extracted in the research, but their roles are clear from the call site:

### `SDY` — Strip Images and Documents

Removes image and document content blocks from messages. Likely:
- Drops `image` blocks entirely (or replaces with `"[image]"` text placeholder)
- Drops `document` blocks (or replaces with `"[document]"` placeholder)
- Preserves `text`, `tool_use`, `tool_result` (for further processing by `CDY`)

Why? Images and documents are large in tokens (2000 per image via the standard estimate) but rarely directly relevant to summarization. Stripping them on a cold-cache path reduces input cost significantly without losing summary quality.

### `CDY` — Truncate Contents

Truncates tool_use inputs and tool_result contents to a small character limit (likely 100 chars). The purpose:
- A `Read` tool_use input might say `{"file_path": "/very/long/path/...", "offset": 0, "limit": 2000}` — only the file path matters for the summary, the rest is noise.
- A `Bash` tool_result might be 50 KB of stdout — for cold-compact, we only need to know "Bash command produced output" not the full output.

The 100-char truncation is aggressive but reasonable for cold-compact: the goal is to produce *some* summary cheaply, not the most detailed one.

The `eyK` constant referenced in some research notes is likely the truncation length (100).

---

## 5. The Combined Cold-Compact Picture

When all three effects combine, a cold compact call has approximately:

| Component | Standard compact | Cold compact |
|-----------|------------------|--------------|
| Cache-prefix sharing | Tries first (3a), falls back to standard | Skipped entirely |
| Image/document blocks | Included | Stripped |
| Tool definitions | `[Kz, r58, ...mcpTools]` (potentially many) | `[]` (none) |
| Tool inputs | Full | Truncated to ~100 chars |
| Tool results | Full | Truncated to ~100 chars |
| Resulting prompt size | Full conversation | ~20-40% of full conversation |
| LLM behavior | Detailed multi-section summary | Coarse summary (less detail in 9 sections) |
| Compact cost | Full input tokens × pricing | Significantly reduced |

The trade-off is **summary quality vs cost**. When cache is cold, the user has been idle ≥1.5 hours; they're probably picking up after a long break. A coarser summary is more acceptable than paying full cache-cold cost.

---

## 6. Why is this gated by an experiment flag?

`tengu_cold_compact` defaults to **false** (`u8("tengu_cold_compact", !1)`), meaning:
- By default, cold-compact behavior doesn't activate.
- Only users in the experiment get it.

This is standard rollout caution. The cold path:
- Strips meaningful context from the compact prompt → may produce lower-quality summaries
- Disables a working optimization (cache-prefix) → may cost more in some cases
- Has new edge cases (what if `SDY` strips an image that was actually critical to the conversation?)

Gating lets the team A/B test:
- Compare summary quality between cold/non-cold paths
- Measure actual cost savings
- Detect regression cases (e.g., users complaining "compact lost my image references")

If the experiment shows uniformly positive results, it could be promoted to default-on. The gating also makes it easy to disable if production issues emerge — flip the flag, revert to old behavior immediately, no code deployment needed.

---

## 7. Telemetry Differences

The `tengu_compact` telemetry event for cold-compact has:

```javascript
d("tengu_compact", {
    // ... standard fields ...
    stripNonEssential: w,                    // ← true for cold-compact
    promptCacheSharingEnabled: W,            // ← always false for cold (because !w gate)
    // ... rest ...
});
```

`stripNonEssential: true` lets analysis distinguish cold-compact events:
- Compare token counts: cold compacts should have lower `compactionInputTokens`.
- Compare summaries (if collected): cold compacts may have lower quality scores.
- Compare retry rates: cold compacts should have lower `tengu_compact_ptl_retry` rates (because the input is smaller).

`promptCacheSharingEnabled: false` is implied by `stripNonEssential: true`, but explicit makes filtering easier.

---

## 8. When Does Cold-Compact Actually Fire?

For a user in the `tengu_cold_compact` experiment, cold-compact fires when:
1. The user has been idle ≥1.5 hours (no activity).
2. AND a new turn brings the conversation above the autocompact threshold.

This is rare in real usage. Typical scenarios:
- User leaves Claude Code open over lunch, returns, asks a question that pushes context over threshold → cold compact fires.
- User runs a long-running task in the background (without UI interaction), returns, sees the conversation has grown → cold compact fires.
- User puts laptop to sleep, wakes up next day, continues a session → almost certainly cold-compact eligible if context is high.

For most users, autocompact fires from active typing — cache is warm — and the cold path doesn't apply.

---

## 9. Why Disable Cache-Prefix on Cold?

The cache-prefix optimization (`tengu_compact_cache_prefix`) issues a separate `rP({skipCacheWrite: true})` call to read from the cached prefix. If the cache is cold:
- The cached prefix is gone (TTL expired).
- The `rP` call would have to recreate the cache anyway (cold cache miss costs full input tokens for cache write).
- But `skipCacheWrite: true` means we don't write — we just pay full input tokens for nothing.
- The fallback to standard compact then pays full input tokens AGAIN.

So cold-compact with cache-prefix would **double-charge** the user for input tokens. Disabling cache-prefix on cold is purely a cost optimization.

---

## 10. The 1.5-Hour Threshold Choice

Why 1.5 hours specifically?

| Threshold | Rationale | Trade-off |
|-----------|-----------|-----------|
| 5 min | Match shortest cache TTL | Triggers on any short break — too aggressive |
| 30 min | Match typical cache TTL | Triggers on coffee breaks |
| **1.5 hours** | Well beyond any cache TTL | Triggers only on real "user has stepped away" |
| 4 hours | "Probably end of work session" | Doesn't trigger for users with long sessions |

The 1.5-hour mark sits in a sweet spot: long enough to be confident the cache is gone, short enough to catch the "back from lunch" use case where cache-prefix optimization would otherwise mislead.

---

## 11. Code Excerpt: The Full Cold Path in `ALK`

```javascript
// chunks.159.mjs:998-1031 (full cold path)

async function ALK({messages: q, summaryRequest: K, appState: _, context: z,
                    preCompactTokenCount: Y, cacheSafeParams: A, stripNonEssential: O = !1}) {
    let w = !O && u8("tengu_compact_cache_prefix", !0);     // ← !O blocks cache-prefix in cold
    let $ = AkK() ? setInterval(...) : void 0;

    try {
        if (w) try {
            // cache-prefix attempt (skipped when cold)
            ...
        } catch (f) { ... }

        // Standard streaming call
        let j = !1, H;
        z.resetResponseLength?.();
        let X = !O && await l38(...) ? j2([Kz, r58, ...mcpTools], "name") : [Kz],   // ← !O forces [Kz] only
            M = [...H2(q), K],
            P = Ar1(Gx8(O ? SDY(M) : M)),                                            // ← O strips images/docs
            W = O ? CDY(P) : P;                                                      // ← O truncates tool contents

        let Z = eb6({
            messages: K0(W, O ? [] : z.options.tools),                               // ← O sends [] tools
            systemPrompt: sK(["You are a helpful AI assistant tasked with summarizing conversations."]),
            thinkingConfig: { type: "disabled" },
            tools: O ? [] : X,                                                       // ← O sends [] tools (redundant)
            signal: z.abortController.signal,
            options: {
                async getToolPermissionContext() { return z.getAppState().toolPermissionContext },
                model: z.options.mainLoopModel,
                toolChoice: void 0,
                isNonInteractiveSession: z.options.isNonInteractiveSession,
                hasAppendSystemPrompt: !!z.options.appendSystemPrompt,
                maxOutputTokensOverride: Math.min(Po6, lc(z.options.mainLoopModel)),
                querySource: "compact",
                agents: z.options.agentDefinitions.activeAgents,
                mcpTools: [],                                                        // ← always [] in compact
                effortValue: _.effortValue,
                enablePromptCaching: !1                                              // ← always disabled
            }
        })[Symbol.asyncIterator]();

        let G = await Z.next();
        while (!G.done) { ... }
        if (H) return H;
        throw E(...), d("tengu_compact_failed", { reason: "no_streaming_response", ... }), Error(ql8)
    } finally { clearInterval($) }
}
```

The four `O` checks combine to:
1. Disable cache-prefix
2. Force `[Kz]`-only tool list at the JS level
3. Apply `SDY` to strip images/documents
4. Apply `CDY` to truncate remaining content
5. Send `[]` tools at the API level

---

## 12. Comparison with v2.1.88

| Feature | v2.1.88 source | v2.1.112 binary |
|---------|----------------|-----------------|
| Cold-cache detection | `compact.ts:1141-1143` (similar `stripNonEssential` param) | Same logic in `vI6` |
| Cold-cache threshold | 1.5h | 1.5h (`pDY = 5_400_000`) — unchanged |
| `tengu_cold_compact` flag | Yes (similar gating) | Yes (`u8("tengu_cold_compact", !1)`) |
| `SDY`/`CDY` stripping | Implemented | Same behavior, obfuscated names |
| Cache-prefix disable on cold | Yes | Yes (`!w` gate in ALK) |
| Empty tool list on cold | Yes | Yes (`tools: O ? [] : X`) |

The cold-compact mechanism has been stable across versions — same threshold, same flags, same stripping logic. The only difference is naming.

---

## 13. Edge Cases

### What if the user has been idle 1.4 hours?

`FDY()` returns false; cold path doesn't activate. Standard compact runs (with cache-prefix optimization, full content). The user pays full cost but gets full quality.

### What if the user has been idle 10 hours?

`FDY()` returns true. If `tengu_cold_compact` is on, cold path activates. The user gets a coarse summary at reduced cost.

If `tengu_cold_compact` is off, standard compact runs. The user pays for cache-prefix attempts that are guaranteed to miss (because cache is gone), then standard compact (paying full input tokens). This is the worst case for the user — but it's transparent (no functional difference, just slightly higher cost).

### What if `vI6` is called from `/compact` directly (not autocompact)?

`JLY` (slash command handler) doesn't compute `stripNonEssential` — it always calls `vI6(O, K, ..., !1, Y, !1)` with `isAuto = false` and no 8th argument. So `stripNonEssential` defaults to `false`.

This means **manual `/compact` is always full quality**, even after long idle. The user explicitly chose to compact; they get the best summary.

### Conflict: cold path with PreCompact-injected images?

If a PreCompact hook injects images into `customInstructions`, those images are part of the prompt body (`fx8` builds them in via the `Additional Instructions:` section). `SDY` walks the message list, not the summary request, so prompt-body images survive.

This is probably correct — PreCompact-injected content is intentional, while images embedded in the conversation history are likely "we already know about this" content.

---

## 14. Why the Cold Path Even Exists

The cold-compact optimization exists because **idle time is invisible to the user but expensive to the system**:
- An always-on Claude Code window with a 50-message session, idle for 4 hours, then triggered → standard compact pays for fully-cached cache-creation costs (because cache TTL has expired).
- The user has no way to know in advance that they should `/clear` and start over.
- Without cold-compact, every "back from lunch" scenario costs as much as a fresh complex compact.

The cold path is the system's way of being a good steward of compute when the user isn't paying attention. The user gets a slightly less detailed summary (often imperceptible because they were going to ask a fresh question anyway), and the system saves significant compute.

---

## 15. Key Insight

Cold compact is a **cost-quality trade that activates only when the user has been idle long enough that quality matters less**. The 1.5-hour threshold is the system's heuristic for "the user has likely context-switched." Once context-switching is assumed, the user will probably ask a fresh question rather than continue a deep thread — so a coarser summary is acceptable.

The trade-off is asymmetric:
- **Quality loss**: minor — coarser summary, less detail in tool results
- **Cost savings**: significant — no cache-prefix double-charging, smaller LLM call, no images

By making this opt-in (via `tengu_cold_compact`), Anthropic can validate the assumption that quality loss is minor before defaulting it on. Until the experiment graduates, only opted-in users see the optimization — but autocompact's threshold-based triggering is unchanged for everyone, so the cold path is purely additive.
