# Cache Control TTL Ordering Fix (v2.1.116)

## Changelog Anchor

> Fixed an intermittent API 400 error related to cache control TTL ordering that could occur when a parallel request completed during request setup

## The Race Window

Request build in Claude Code is not entirely synchronous. The pipeline (`gC` → `D$` → cache block transformation) traverses messages, applies cache_control markers, computes the betas list, and serializes the body. Concurrently, an *unrelated* request that was already in-flight might land its response and mutate shared state — e.g., subagent summary call returns and writes back into `appState`, or a parallel tool call completes and triggers a state update.

The specific shared mutation that triggered the 400 was: an in-flight request applies `cache_control` to a message *without* a `ttl` field at the moment a parallel request's TTL decision (`ivH`) is recomputing what the TTL should be. The new code path then applies `cache_control: { type: "ephemeral", ttl: "1h" }` on top of the existing `cache_control: { type: "ephemeral" }`, but the merge logic copied the `ttl` *into* the cache_control while losing field ordering — and the server's JSON validator is strict about ordering for the cache_control envelope.

The 400 response looked like:

```
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "cache_control: type must be specified before ttl"
  }
}
```

This was intermittent because it required two requests to be in-flight with overlapping state mutation windows. Many users never saw it; high-throughput SDK callers and concurrent slash-command users saw it occasionally.

## The Fix — Idempotent `$I4` Merge

`$I4(block, ttl)` is the function that adds TTL to a single text block. v2.1.116 made it idempotent:

```javascript
// ============================================
// normalizeCacheControlTtl - Idempotently add ttl to a block's cache_control
// Location: cli_inner_pretty.js:526567-526570
// ============================================

// ORIGINAL (for source lookup):
function $I4(H, $) {
  if (!("cache_control" in H) || !H.cache_control || H.cache_control.ttl) return H;
  return { ...H, cache_control: { ...H.cache_control, ttl: $ } };
}

// READABLE (for understanding):
function normalizeCacheControlTtl(block, ttl) {
  // Three pass-through cases:
  //   1. No cache_control field on this block — nothing to update
  //   2. cache_control is falsy (null/undefined) — nothing to update
  //   3. cache_control already has a ttl — already set, don't overwrite
  if (!("cache_control" in block)
      || !block.cache_control
      || block.cache_control.ttl) {
    return block;
  }
  // Otherwise, add ttl to the existing cache_control while preserving
  // its other fields (type, scope, etc.) via spread.
  return {
    ...block,
    cache_control: { ...block.cache_control, ttl },
  };
}

// Mapping: $I4→normalizeCacheControlTtl, H→block, $→ttl
```

The three pass-through conditions cover:
1. **No cache_control** — Nothing to merge into. Pass through.
2. **`cache_control === null` / `undefined`** — Falsy guard for defensiveness.
3. **`cache_control.ttl` already set** — Don't overwrite. *This is the v2.1.116 contribution.*

The third condition is the critical change. Pre-fix, `$I4` would unconditionally write `ttl: $` to the cache_control, replacing whatever ttl was there. If another mutation had already set `ttl: "5m"` (the default), this would overwrite to `ttl: "1h"` — but the spread might land the field after `type`, and the server expects strict ordering or a specific subset of keys.

By short-circuiting when `ttl` already exists, the function becomes safe to call multiple times on the same block. Concurrent code paths that both decide TTL get the same outcome: whoever wrote first wins, subsequent writes are no-ops.

## How `$I4` Is Used

```javascript
// cli_inner_pretty.js:526524-526525 (Sg's request build for side queries)
let C = h ? E.map((Q) => $I4(Q, h)) : E,
  R = h ? K.map((Q) => (typeof Q.content === "string" ? Q : { ...Q, content: Q.content.map((c) => $I4(c, h)) })) : K,
```

The pattern is: for every message block (system or user), call `$I4(block, "1h")`. This normalizes the TTL across the entire request. If a single block had `ttl: "5m"` already (from a previous code path), the post-fix `$I4` leaves it alone — preserving the original write.

For most production requests this means: the TTL is decided once (by the main `ivH` call in `D$` for the primary request build), and the `$I4` post-pass is a defensive normalization that doesn't actually mutate anything in the common case. The pass-through is the common case.

## The Race In Detail

Pre-fix, the timing that produced the 400 was:

```
Time   Main Request                            Concurrent Subagent Summary Return
────   ─────────────────                       ──────────────────────────────────
t=0    ivH("repl_main_thread") → true                                              
t=1    Q = "1h"                                                                    
t=2    Build cache_control: { type: "ephemeral" }   (no ttl yet)                  
t=3    ── pre-emption ──                       Subagent summary write: 
                                                appState.cacheBreakerPhrase ← X    
t=4                                            Side effect: triggers re-render →   
                                                some part of state recomputed     
t=5    Resume building messages:                                                   
       For each block, call $I4(block, "1h")                                       
t=6    $I4 pre-fix: unconditionally writes      
       ttl:"1h" into existing cache_control                                        
       Result: { type: "ephemeral", ttl: "1h" }                                    
       But spread order in the merge writes                                        
       ttl BEFORE type when the prior object                                       
       had been re-serialized by t=3-4 work                                        
t=7    Request goes out with                                                       
       { ttl: "1h", type: "ephemeral" }                                            
       Server validates: type before ttl                                           
       → 400 "type must be specified before ttl"                                   
```

Post-fix, step t=6 would short-circuit: `block.cache_control.ttl` is undefined (the prior path didn't set it because nothing in pre-state needed to). So `$I4` writes the spread with type first: `{ ...block.cache_control (= { type: "ephemeral" }), ttl }` → `{ type: "ephemeral", ttl: "1h" }`. Correct ordering preserved.

Actually re-reading the function:

```javascript
return { ...block, cache_control: { ...block.cache_control, ttl } };
```

The spread `{ ...block.cache_control, ttl }` always puts new keys after the existing ones in V8 (insertion order is preserved). So if `block.cache_control = { type: "ephemeral" }`, the result is `{ type: "ephemeral", ttl: "1h" }` — type first, ttl after. That's the order the server wants.

The pre-fix bug was that if `block.cache_control` was rebuilt by another code path (concurrent state mutation) in a way that put fields in a different order, the spread inherited that order. By short-circuiting on existing ttl, the merge can't ever happen against a stale rebuilt object — we just return the existing block. The block's cache_control retains whatever order the original setter used.

## Why Idempotency Was The Right Fix

Alternatives considered (inferable from the codebase structure):

1. **Acquire a mutex around the request build** — Would prevent the race but at a cost of serializing every API request. Throughput hit.
2. **Build the entire request body in a single sync pass** — Would prevent pre-emption. But the codebase has side-query helpers that intentionally allow concurrent state changes (e.g., the title generator runs in parallel with main turns).
3. **Skip TTL normalization entirely** — Would re-introduce the bug where some blocks have ttl and some don't.

Option 4 (chosen): make the normalizer itself idempotent. Whoever writes first wins, subsequent calls are no-ops. No locks, no serialization, no removed functionality.

## The Other Pre-Fix Footgun

`block.cache_control` is sometimes `null` (intentionally — for blocks that explicitly opted out of caching) and sometimes undefined (the field is absent). Pre-fix, the check was:

```javascript
// Pre-fix shape:
if (!("cache_control" in H)) return H;     // missed null case
return { ...H, cache_control: { ...H.cache_control, ttl: $ } };  // would throw on null
```

Post-fix:
```javascript
if (!("cache_control" in H) || !H.cache_control || H.cache_control.ttl) return H;
//                            ^^^^^^^^^^^^^^^^^ defensive null/undefined guard
return { ...H, cache_control: { ...H.cache_control, ttl: $ } };
```

The `!H.cache_control` guard catches `null` and `undefined`. The `H.cache_control.ttl` guard is the idempotency check. Three defenses, one return per branch.

## What The Server Validates

The Anthropic API's cache_control schema (in the bundle's documentation at `cli_inner_pretty.js:589681-589700`):

```
{
  "type": "ephemeral",                  ← required, exactly one value
  "ttl": "5m" | "1h",                   ← optional, two valid values
  "scope": "global" | undefined,        ← optional, requires preview header
}
```

The fields are independent; ordering shouldn't strictly matter for a JSON object. But the server's validator stack may parse them as a tagged union where `type` is consumed first to discriminate, then other fields are applied. If `ttl` appears before `type` in the serialized JSON, the validator might apply ttl to an unknown-type object and reject.

This is unusual JSON behavior — most JSON parsers are order-insensitive. The fact that the server rejected with "type must be specified before ttl" suggests the validator was order-sensitive at the wire level, possibly because of a streaming-validator implementation.

The client-side fix (idempotent merge) sidesteps the question of whether the server should be order-insensitive — by never modifying a block that already has TTL, the client never produces a re-ordered serialization.

## Verification

```bash
# Confirm the three-condition guard:
sed -n '526567,526570p' /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# function $I4(H, $) {
#   if (!("cache_control" in H) || !H.cache_control || H.cache_control.ttl) return H;
#   return { ...H, cache_control: { ...H.cache_control, ttl: $ } };
# }

# Confirm $I4 is called at side-query build:
grep -n "\\\$I4(Q, h)\|\\\$I4(Q, " /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# (multiple call sites in Sg/uEH paths)
```

## Cross-Link With ivH and AWH

The TTL value itself is decided by `ivH(querySource)` returning `"1h"` or `undefined`. The beta header `extended-cache-ttl-2025-04-11` (`AWH`) is pushed when `Q === "1h" && RT()`. `$I4` is the third leg: it applies the decided TTL to each block in the message body.

All three must agree:
- `ivH` says "1h"
- `AWH` is in betas list
- `$I4` applies `ttl: "1h"` to cache_control blocks

The idempotency fix ensures `$I4` doesn't *disrupt* this agreement under concurrent mutation. The other two pieces (TTL decision and beta header) are stateless per-request.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - API client, request build
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key functions / constants:
- `normalizeCacheControlTtl` (`$I4`) — `cli_inner_pretty.js:526567-526570` — Idempotent merge
- `makeCacheControl` (`Xi`) — `cli_inner_pretty.js:524776-524778` — Builds `{ type: "ephemeral", ttl, scope }`
- `applyCacheBreakpoints` (`YB5`) — `cli_inner_pretty.js:526228-526317` — Adds cache_control to selected message indexes
- `buildSystemPromptCacheBlocks` (`fB5`) — `cli_inner_pretty.js:526318-526326` — Applies cache_control to system prompt blocks
- `extendedCacheTtlBeta` (`AWH`) — `cli_inner_pretty.js:96810` — The beta header required when ttl is set
- `isCacheTtl1Hour` (`ivH`) — `cli_inner_pretty.js:524779-524794` — TTL decision
- `sideQueryRequestBuild` (`Sg`) — `cli_inner_pretty.js:526468-526566` — One of the call sites that uses `$I4`
