# 1-Hour TTL Silent Downgrade Fix (v2.1.129)

## Changelog Anchor

> Fixed 1-hour prompt cache TTL being silently downgraded to 5 minutes

## The Bug

`ivH(querySource)` (the 1-hour-TTL eligibility decision) consults a per-process allowlist sentinel stored via `nv8()`/`iv8(...)`. Pre-fix, if the allowlist hadn't been loaded yet *at the moment a query first asked for TTL eligibility*, the function would fall through to the next condition (entitlement gate) and could return `false` — meaning the request shipped with `ttl: "5m"` (the default) instead of `ttl: "1h"`.

The fall-through happened because the lazy-load code path was structured as:

```javascript
// (Reconstructed pre-fix shape)
function ivH(querySource) {
  if (FORCE_5M) return false;
  if (ENABLE_1H || (bedrock && ENABLE_1H_BEDROCK)) return true;
  if (!subscriberEligible) return false;
  let allowlist = nv8();
  if (!allowlist) return false;                    // ← Bug: deny if not loaded
  return matchesAllowlist(querySource, allowlist);
}
```

The first call to `ivH` in a session would return `false` because `nv8()` returned `null` (sentinel default). The second call — usually milliseconds later, after some other code path triggered the experiment fetch — would correctly return `true`. But by then the first request had already gone out with 5m TTL, *cache-creating a 5m entry instead of a 1h one*.

This silently halved the cache window for the first request of every session. Users observed cache misses ~5 minutes into long sessions when they expected the cache to last an hour.

## The Fix

`ivH` now lazy-loads the allowlist on the spot when the sentinel is null:

```javascript
// ============================================
// isCacheTtl1Hour - Decide whether to apply 1-hour TTL to this request's cache_control
// Location: cli_inner_pretty.js:524779-524794
// ============================================

// ORIGINAL (for source lookup):
function ivH(H) {
  if (bH(process.env.FORCE_PROMPT_CACHING_5M)) return !1;
  if (
    bH(process.env.ENABLE_PROMPT_CACHING_1H) ||
    (vq() === "bedrock" && bH(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK))
  )
    return !0;
  if (!qq() || bZ.isUsingOverage) return !1;
  let $ = nv8();
  if ($ === null)
    (($ =
      Z$("tengu_prompt_cache_1h_config", { allowlist: ["repl_main_thread*", "sdk", "auto_mode", "memdir_relevance"] })
        .allowlist ?? []),
      iv8($));
  return H !== void 0 && $.some((q) => (q.endsWith("*") ? H.startsWith(q.slice(0, -1)) : H === q));
}

// READABLE (for understanding):
function isCacheTtl1Hour(querySource) {
  // 1. Hard 5-minute override env var (never use 1h)
  if (parseBool(process.env.FORCE_PROMPT_CACHING_5M)) return false;

  // 2. Force-enable env vars (always use 1h)
  if (parseBool(process.env.ENABLE_PROMPT_CACHING_1H)
      || (getProvider() === "bedrock" && parseBool(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK))) {
    return true;
  }

  // 3. Subscriber-entitlement gate: paying user, not currently using overage credits
  if (!isSubscriberWithBenefits() || subscriberState.isUsingOverage) return false;

  // 4. Lazy-load the allowlist; treat "not yet loaded" as "force re-read",
  //    not "deny". This is the v2.1.129 fix.
  let allowlist = getCached1hAllowlist();                       // nv8
  if (allowlist === null) {
    // sentinel null → first call this process. Fetch the experiment value.
    const expResult = readExperiment("tengu_prompt_cache_1h_config", {
      allowlist: ["repl_main_thread*", "sdk", "auto_mode", "memdir_relevance"],
    });
    allowlist = expResult.allowlist ?? [];
    setCached1hAllowlist(allowlist);                            // iv8 — memoize
  }

  // 5. Per-querySource allowlist match (with trailing-* wildcard support)
  return querySource !== undefined
      && allowlist.some((pattern) =>
           pattern.endsWith("*")
             ? querySource.startsWith(pattern.slice(0, -1))
             : querySource === pattern);
}

// Mapping: ivH→isCacheTtl1Hour, H→querySource, $→allowlist,
//          bH→parseBool, vq→getProvider, qq→isSubscriberWithBenefits, bZ→subscriberState,
//          nv8→getCached1hAllowlist, iv8→setCached1hAllowlist, Z$→readExperiment
```

## Why The Allowlist Exists

The 1-hour TTL feature isn't free for Anthropic — it shifts more state into the server-side cache for longer. To roll out gradually, the feature is gated by a `tengu_prompt_cache_1h_config` experiment that returns:

```json
{
  "allowlist": ["repl_main_thread*", "sdk", "auto_mode", "memdir_relevance"]
}
```

Each entry is a query-source pattern (with optional trailing `*` wildcard). Only queries whose `querySource` matches one of these patterns get 1-hour TTL. The defaults shipped above are:

- `repl_main_thread*` — Any main-loop turn (matches `repl_main_thread`, `repl_main_thread_recompact`, etc.)
- `sdk` — Programmatic SDK invocations
- `auto_mode` — Auto-mode (`-p`) batch queries
- `memdir_relevance` — Memory-directory relevance scoring queries

Internal users (anyone with the experiment flag bumped) get a broader allowlist via remote config.

## The "Sentinel Null" Bug Window

```
Session startup timeline:

t=0 ──→ Session boot, no API calls yet
t=1 ──→ Code path A: somewhere reads getCached1hAllowlist() → returns null
        (sentinel hasn't been written to)
        Pre-fix: ivH returned false here → request goes out with 5m TTL
        Post-fix: ivH loads the experiment value, caches it, then matches

t=2 ──→ Code path B: another component reads tengu_prompt_cache_1h_config
        directly → fills the cache (but ivH already returned)
t=3 ──→ Next ivH call (could be for next turn or some other forked query)
        Pre-fix and post-fix both: returns true

The bug is the gap between t=0 and t=3.
```

This window was small — typically a single request that fired before another code path warmed the cache. But that "first request" is the one that *creates* the cache entry, so its TTL determines the lifetime of the entire cached prefix. A 5-minute first-request cache means the whole session pays a cache miss after 5 minutes of idle, even though every subsequent request would have gotten 1-hour.

## Why `null` ≠ "Deny"

Pre-fix, `null` was overloaded with two meanings:
- "Allowlist hasn't been loaded yet" (transient startup state)
- "Allowlist is empty / unavailable, do not use 1h" (steady state)

Post-fix, the sentinel uses:
- `null` — never loaded, force re-read on next access
- `[]` (empty array) — loaded, no entries match, deny

Plus an explicit `iv8(allowlist)` writes whatever was loaded (including `[]`) so the second call sees the empty list and returns false consistently. The state machine is now monotonic: once loaded, the result is deterministic.

## The Lazy-Load Concurrency Story

`Z$("tengu_prompt_cache_1h_config", default)` is the experiment read. It's synchronous (returns the local-cached value), not async. So two concurrent `ivH` calls can both reach the `if ($ === null)` branch and both fetch. That's fine — the experiment system is idempotent, both fetches return the same value, both writes via `iv8` end up storing the same array. There's no race-corruption risk.

A more defensive version would gate the load with a promise to coalesce concurrent calls. The actual implementation skips that because the experiment fetch is cheap (it's a local lookup against an already-fetched-from-server config map). Twice-paying that lookup is fine.

## What Counts As A Cache Miss In Practice

Server-side, 1h TTL means the cache entry survives 1 hour of idle. 5m means 5 minutes. Both apply per-entry, scoped to the `cache_control` block.

A typical turn produces multiple cache blocks (one for the system prompt, one for the cached tool schemas, one for the user message anchor). Each has its own TTL. Pre-fix, the system-prompt block of the first turn got 5m; the second turn's system-prompt block got 1h. The cache key includes the request hash, so the *second* turn's block doesn't share the *first* turn's entry. Result: the 5m entry from turn 1 just expires unused.

The actual cost is:
- First turn pays full prefix-creation tokens (no shared cache yet — expected)
- Second turn's prefix-creation block goes into a 1h-TTL entry
- Turns 3..N read from that 1h entry for up to 1 hour after turn 2
- After 1h of idle, the cache misses and turn N+1 pays full prefix-creation again

Pre-fix:
- First turn pays full creation, ends up in 5m entry
- Second turn writes its own 1h entry (not sharing with turn 1's 5m)
- Turn 3 reads from 1h
- 5m after turn 1, the unused 5m entry expires — invisible to the user
- The 1h cache works fine from turn 2 onwards

So the actual user-visible impact is **one extra cache_creation on the first turn**. It looked like a 2x cache_creation duplicate in metrics, hence "silently downgraded" was somewhat overstated in the user-facing changelog — but the fix is real and worth tracking.

## Telemetry Signal

The `tengu_api_cache_breakpoints` event fires on every request with `markerCount` and breakpoint placement. The `cache_creation_input_tokens` field in the API response's `usage` block tells us whether the cache entry was just written (the fingerprint). Combined: anomalous `cache_creation_input_tokens` ratios for the first request of a session indicate the pre-fix behavior.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - API client, experiment system
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key functions:
- `isCacheTtl1Hour` (`ivH`) — `cli_inner_pretty.js:524779-524794` — Eligibility decision
- `getCached1hAllowlist` (`nv8`) — Sentinel reader
- `setCached1hAllowlist` (`iv8`) — Sentinel writer
- `readExperiment` (`Z$`) — Looks up experiment config with default fallback
- `getProvider` (`vq`) — Returns `"firstParty" | "bedrock" | "vertex" | "foundry" | ...`
- `isSubscriberWithBenefits` (`qq`) — Subscriber + entitlement check
- `subscriberState.isUsingOverage` (`bZ.isUsingOverage`) — Overage credit fallback flag
