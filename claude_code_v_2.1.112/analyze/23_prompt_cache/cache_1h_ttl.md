# `ENABLE_PROMPT_CACHING_1H` — 1-Hour Prompt Cache TTL

**Added:** v2.1.108
**Affects:** API key users, Bedrock, Vertex, Foundry
**Location:** `chunks.194.mjs:1034-1043`

## What it does

Opts a session into a **1-hour TTL** on the server-side prompt cache (default is 5 minutes). When set to a truthy value, every `cache_control` marker emitted in API requests carries `ttl: "1h"` instead of the default ephemeral 5-minute TTL.

`ENABLE_PROMPT_CACHING_1H_BEDROCK` (which existed pre-2.1.88) is **deprecated but still honored** as a Bedrock-specific fallback.

## v2.1.88 baseline

In `claude-code-kim/src/services/api/claude.ts:393-434`, the function `should1hCacheTTL(querySource)` already existed and already checked `ENABLE_PROMPT_CACHING_1H_BEDROCK`. But there was **no unified** flag:

```typescript
// v2.1.88 — claude-code-kim/src/services/api/claude.ts:393-401
function should1hCacheTTL(querySource?: QuerySource): boolean {
  // 3P Bedrock users get 1h TTL when opted in via env var — they manage their own billing
  // No GrowthBook gating needed since 3P users don't have GrowthBook configured
  if (
    getAPIProvider() === 'bedrock' &&
    isEnvTruthy(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK)
  ) {
    return true
  }
  // ... subscriber + allowlist gating below
}
```

API-key users, Vertex users, and Foundry users had **no way** to opt in — they were stuck on the default 5-minute TTL even if they wanted longer cache retention.

## v2.1.112 implementation

```javascript
// ============================================
// is1HourCacheEligible - Decide if this session's cache_control gets ttl: "1h"
// Location: chunks.194.mjs:1034-1043
// ============================================

// ORIGINAL (for source lookup):
function o85(q) {
    if (S6(process.env.FORCE_PROMPT_CACHING_5M)) return !1;
    if (S6(process.env.ENABLE_PROMPT_CACHING_1H) || pq() === "bedrock" && S6(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK)) return !0;
    if (!i7() || Zk.isUsingOverage) return !1;
    let K = i81();
    if (K === null) K = u8("tengu_prompt_cache_1h_config", {
        allowlist: ["repl_main_thread*", "sdk", "auto_mode"]
    }).allowlist ?? [], r81(K);
    return q !== void 0 && K.some((_) => _.endsWith("*") ? q.startsWith(_.slice(0, -1)) : q === _)
}

// READABLE (for understanding):
function is1HourCacheEligible(querySource) {
  // Hard override: even subscribers can force a 5-min TTL
  if (parseExplicitTrue(process.env.FORCE_PROMPT_CACHING_5M)) return false;

  // Explicit opt-in via unified or Bedrock-specific flag
  if (
    parseExplicitTrue(process.env.ENABLE_PROMPT_CACHING_1H) ||
    (getAPIProvider() === "bedrock" &&
     parseExplicitTrue(process.env.ENABLE_PROMPT_CACHING_1H_BEDROCK))
  ) {
    return true;
  }

  // Not eligible if not a subscriber or in overage
  if (!isSubscriber() || rateLimitState.isUsingOverage) return false;

  // Read cached allowlist for session stability (prevents mid-session TTL flips
  // that would bust the server-side cache by changing the cache_control value)
  let allowlist = getPromptCache1hAllowlist();
  if (allowlist === null) {
    allowlist = getFeatureValue("tengu_prompt_cache_1h_config", {
      allowlist: ["repl_main_thread*", "sdk", "auto_mode"]
    }).allowlist ?? [];
    setPromptCache1hAllowlist(allowlist);
  }

  // Match querySource against allowlist patterns (trailing '*' = prefix match)
  return querySource !== undefined &&
    allowlist.some(pattern =>
      pattern.endsWith("*")
        ? querySource.startsWith(pattern.slice(0, -1))
        : querySource === pattern);
}

// Mapping: o85→is1HourCacheEligible, q→querySource, S6→parseExplicitTrue,
//          pq→getAPIProvider, i7→isSubscriber, Zk→rateLimitState,
//          i81→getPromptCache1hAllowlist, r81→setPromptCache1hAllowlist,
//          u8→getFeatureValue
```

## Algorithm: Decision Tree

The function evaluates in **strict priority order** — first matching gate wins:

| Priority | Gate | Result | Notes |
|----------|------|--------|-------|
| 1 | `FORCE_PROMPT_CACHING_5M` truthy | **false** | Hard downgrade override (see [force_5m_ttl.md](./force_5m_ttl.md)) |
| 2 | `ENABLE_PROMPT_CACHING_1H` truthy | **true** | Unified opt-in (NEW v2.1.108) |
| 3 | Provider = bedrock AND `ENABLE_PROMPT_CACHING_1H_BEDROCK` truthy | **true** | Bedrock-specific legacy path |
| 4 | NOT subscriber OR `isUsingOverage` | **false** | API-key users with env-var opt-in already returned at step 2 |
| 5 | `querySource` matches allowlist pattern | **true** | GrowthBook-controlled allowlist; allowlist cached for session stability |
| 6 | (none of the above) | **false** | Default-deny |

**Why an allowlist:** 1-hour TTL is more expensive per cache entry (longer-lived cache pages tie up Anthropic's server memory). Rolling it out via allowlist lets the team gate by `querySource` type:

- `repl_main_thread*` — interactive sessions (long-lived, benefit most from 1h)
- `sdk` — programmatic SDK sessions (often long-running batch work)
- `auto_mode` — auto-pilot sessions (long-lived by design)

Excluded by default: `agent:*` (subagents — short-lived), `compact` (one-shot summarization — no future hit), `away_summary` (one-shot — no future hit).

**Why subscriber-only:** API-key users pay per-token; 1-hour TTL would reduce their cost but increase Anthropic's compute cost. The subscription tiers (Pro, Max) offset the cost shift — subscribers pay a flat fee regardless of token consumption.

**Why `isUsingOverage` disqualifies:** A subscriber who has burned through their plan limits is paying overage rates (per-token). At that point Anthropic is back to per-token economics; the 1-hour TTL would shift cost the wrong way.

## Key Algorithm: Session-Stable Allowlist

```javascript
let allowlist = getPromptCache1hAllowlist();      // chunks.1.mjs:3240
if (allowlist === null) {
  allowlist = getFeatureValue("tengu_prompt_cache_1h_config", ...).allowlist ?? [];
  setPromptCache1hAllowlist(allowlist);           // chunks.1.mjs:3244 — latch into B8 (bootstrap state)
}
```

**Why latch into session state:**

The allowlist comes from GrowthBook (`getFeatureValue` / `u8`). GrowthBook's disk cache **can update mid-session** if the local config file gets refreshed (e.g. by another `claude` process or a background updater). If that happened mid-request, two consecutive turns might produce different TTL values for the same prompt — breaking the cache.

**The invariant:** Once a session decides 1h-vs-5m for a given `querySource`, that decision sticks for the lifetime of the session. The state is stored in `B8.promptCache1hAllowlist` (a process-singleton bootstrap state), which is only written once per session.

**Trade-off:** A user whose allowlist changes (e.g. team admin pushes a new GrowthBook config) doesn't see it until the next session start. Acceptable because the cost of mid-session cache invalidation (a full re-cache write of ~20K tokens worth of system prompt + tool schemas) far exceeds the cost of staleness for a few hours.

## Telemetry-Disabled Bug (v2.1.108 fix)

The changelog notes:

> Fixed subscribers who set `DISABLE_TELEMETRY` falling back to 5-minute prompt cache TTL instead of 1 hour

The root cause: `getFeatureValue` (GrowthBook lookup) requires telemetry to be enabled in older code paths — if `DISABLE_TELEMETRY` was set, the lookup returned the default (empty allowlist), which caused step 5 of the decision tree to always fail. v2.1.108 (and 2.1.110 for the recap-equivalent) ensured the feature-flag lookup works locally even when telemetry is disabled.

## Cache Control Output

The function feeds into `getCacheControl` (`ex`, chunks.194.mjs:1019):

```javascript
function getCacheControl({ scope, querySource } = {}) {
  return {
    type: "ephemeral",
    ...(is1HourCacheEligible(querySource) && { ttl: "1h" }),
    ...(scope === "global" && { scope: "global" })
  };
}
```

Then `getCacheControl({querySource})` is called at every cache anchor site — system-prompt blocks (chunks.194.mjs:3230), user-message anchors, tool-result blocks (chunks.194.mjs:603, 648). One eligibility decision → many cache-control objects, all consistent.

## Why this approach

**Decision:** Use an env var as the explicit opt-in, allowlist as the implicit default.

**Alternatives considered (inferred):**

| Alternative | Why rejected |
|-------------|-------------|
| Always 1h for subscribers | Too expensive for short-lived sessions (subagents, one-shot SDK calls); cost-shift to Anthropic too steep |
| Per-session flag in `~/.claude/config.json` | Users would have to manually opt in; misses the bulk of subscribers who benefit silently |
| Per-request decision based on session length | Can't know session length at request time (chicken-and-egg) |
| Allowlist only, no env var | Power users with custom workflows would have no escape hatch |
| Env var only, no allowlist | Most users wouldn't know to set it; benefit wouldn't reach majority |

**Chosen approach** combines:
- **Env var** for explicit opt-in (power users, ant employees, 3P deployments)
- **Allowlist** for staged rollout (GrowthBook-controlled)
- **Subscriber gate** for cost-shift alignment
- **Force-5m override** for explicit opt-out

**Key insight:** The `cache_control` value is part of the cache key. Any mid-session flip from `{type: "ephemeral"}` to `{type: "ephemeral", ttl: "1h"}` would treat them as different keys and write a fresh cache entry — losing ~20K tokens of cached system prompt. So the function **must** be deterministic per-session. The bootstrap-state latch (`B8.promptCache1hAllowlist`) achieves this even when the underlying GrowthBook config flickers.

## Related symbols

- `is1HourCacheEligible` (`o85`) at chunks.194.mjs:1034
- `getCacheControl` (`ex`) at chunks.194.mjs:1019
- `getPromptCache1hAllowlist` (`i81`) at chunks.1.mjs:3240
- `setPromptCache1hAllowlist` (`r81`) at chunks.1.mjs:3244
- `getAPIProvider` (`pq`) at chunks.41.mjs:2678
- `isSubscriber` (`i7`) at chunks.61.mjs:1170
- `parseExplicitTrue` (`S6`) — boolean env-var parser
- `getFeatureValue` (`u8`) — GrowthBook feature flag reader

See [force_5m_ttl.md](./force_5m_ttl.md) for the companion override flag.
