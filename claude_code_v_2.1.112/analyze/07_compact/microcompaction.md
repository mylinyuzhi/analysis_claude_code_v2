# Microcompaction in v2.1.112 — Three-Layer Architecture

## Overview

> **Read first.** Earlier drafts of this document framed microcompaction as "removed in v2.1.112 — only `_c` no-op + reactive `qD4` survive." That framing is incomplete. After deep review, microcompaction is **alive and runs every turn for default users** — but its responsibilities are split across three independent layers, and only the third (client-side proactive tool_result clearing) was removed/restructured.

In v2.1.88 source, `microcompactMessages()` was a per-turn function with three internal stages, all collapsed into one client-side function. In v2.1.112, those stages have been **separated by responsibility**:

| Layer | What it does | When it runs | Where it runs |
|---|---|---|---|
| **① UI state** | Reset the cache-deletion-pending warning flag | Every turn (pre-API) | Client-side, in `_c` |
| **② API-level proactive thinking-clear** | Send `context_management.edits = [{ type: "clear_thinking_20251015", keep: "all" }]` so the server transparently strips thinking blocks from the prefix it actually feeds the model | Every turn, when thinking is enabled and the `context-management-2025-06-27` beta is in the betas list | Server-side, declared by client `C85` in the request body |
| **③ Reactive tool_result clearing** | Run the KEEP-RECENT MC algorithm: keep the last 5 tool_results, replace older ones with `"[Old tool result content cleared]"` | Only when API returns 422/424 (`context-hint-2026-04-09` reject) | Client-side, in `qD4`, called from `d85` |

For default users, layers ① and ② run every turn (assuming thinking is enabled). Layer ③ fires only when local autocompact + thinking-clear-via-server were not enough — i.e., the server actually demanded relief.

What was *removed* between v2.1.88 source and v2.1.112 binary is the **client-side proactive variant** of layer ③:
- `maybeTimeBasedMicrocompact` (60-min gap-based trigger, GrowthBook flag `tengu_slate_heron`, default off in source)
- `cachedMicrocompactPath` (ant-only, `feature('CACHED_MICROCOMPACT')`)

Both default-off in 2.1.88 source for typical public users — so removing them is a codebase cleanup, not a user-visible regression. The reactive entry (layer ③) is genuinely new in v2.1.112.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — API
> - [api_context_management.md](./api_context_management.md) — Layer ② deep-dive
> - [context_hint_path.md](./context_hint_path.md) — Layer ③ overflow recovery

Key functions in this document:

**Layer ①**
- `microcompactStub` (`_c`) — chunks.85.mjs:1207 — Per-turn entry, just clears warning flag
- `clearCompactWarningSuppression` (`a04`) — chunks.85.mjs:1147 — UI flag reset

**Layer ②**
- `getAPIContextManagement` (`C85`) — chunks.194.mjs:741 — Builds `context_management` body field
- API beta `context-management-2025-06-27` (`BZ8`) — chunks.43.mjs:2741

**Layer ③**
- `keepRecentMicrocompact` (`qD4`) — chunks.85.mjs:1235 — KEEP-RECENT MC algorithm (called from reject path)
- `contextHintReject` (`d85`) — chunks.194.mjs:856 — Reject handler that calls `qD4`
- `collectCompactableToolIds` (`t4z`) — chunks.85.mjs:1198
- `calculateToolResultTokens` (`s4z`) — chunks.85.mjs:1188
- `notifyCacheDeletion` (`nj6`) — chunks.85.mjs:1143
- `resetMicrocompactState` (`SR`) — chunks.85.mjs:1182
- `notifyCacheDeletionForAntUser` (`i04`) — chunks.85.mjs:1049

Constants:
- `o4z` (`COMPACTABLE_TOOLS_SET`) — chunks.85.mjs:1297
- `sR8` (`TIME_BASED_MC_CLEARED_MESSAGE`) — chunks.85.mjs:1276 = `"[Old tool result content cleared]"`
- `r4z` (`IMAGE_TOKEN_ESTIMATE`) — = 2000
- `Q6A` (`DEFAULT_KEEP_RECENT`) — chunks.194.mjs:964 = 5

---

## 1. Layer ① — Per-Turn UI State (`_c`)

```javascript
// ============================================
// microcompactStub - Per-turn microcompact entry
// Location: chunks.85.mjs:1207-1211
// ============================================

// ORIGINAL:
async function _c(q, K, _) {
    return a04(), { messages: q }
}

// READABLE:
async function microcompactStub(messages, toolUseContext, querySource) {
  clearCompactWarningSuppression();
  return { messages };
}

// Mapping: _c→microcompactStub, q→messages, K→toolUseContext, _→querySource,
//          a04→clearCompactWarningSuppression
```

What it does:
1. Calls `a04()` (`clearCompactWarningSuppression`) — sets the cache-deletion-pending UI flag to `false`. Used by the React UI to suppress "cache will be invalidated next turn" warnings now that the (no-op for default users) per-turn MC has run.
2. Returns the message array unchanged.

**No client-side message mutation happens here.** The function exists as a stable entry point for the per-turn loop integration (`chunks.154.mjs:1006`):

```javascript
// chunks.154.mjs:1006 (excerpt)
Y9("query_microcompact_start"),
  U = (await H.microcompact(U, v, w)).messages;
Y9("query_microcompact_end");
```

The agent loop still emits `query_microcompact_start` / `query_microcompact_end` telemetry markers around this call, even though the body itself is a one-liner. This preserves both the telemetry shape and the architectural shape — `H.microcompact` remains a substitution point for future versions to plug a more substantive body back in.

### `a04` and `nj6` — UI Notification State

```javascript
// chunks.85.mjs:1143-1149
function nj6() { Ee6.setState(() => !0) }    // notifyCacheDeletion: pending=true
function a04() { Ee6.setState(() => !1) }    // clearCompactWarningSuppression: pending=false
```

`Ee6` is a React store flipped by side-effecting MC operations. `_c` calls `a04` to clear the flag at the start of each turn (default state: nothing pending). `qD4` (layer ③) calls `nj6` after a successful clear to announce that the next request will rebuild the cache.

### Why is `_c` not literally empty?

The single `a04()` call exists because the layer ③ side effect (`nj6()`) sets a UI flag that **needs to be cleared at the start of each turn**. Without `_c`'s `a04()` call:
- After a layer-③ MC fires (during a 422/424 reject), `nj6` flips the flag to `true`
- Without per-turn reset, the UI would show "cache invalidation pending" indefinitely after a single overflow event

So `_c` is the resetter for the layer-③-set flag. This is the reason it's not just a `return { messages }` no-op: it owns the lifecycle of the `Ee6` UI state.

---

## 2. Layer ② — Per-Turn API-Level Thinking-Clear (`C85`)

This is **the most important layer for default users**. Every API request that has thinking enabled includes a `context_management.edits` directive telling the server to strip thinking blocks from the prefix it feeds the model.

```javascript
// ============================================
// getAPIContextManagement - Build context_management body field for the request
// Location: chunks.194.mjs:741-753
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

// Mapping: C85→getAPIContextManagement
```

### Caller — Per-Turn Request Building

`C85` is invoked once per outgoing API request, inline with the request-body assembly (chunks.194.mjs:1536-1568):

```javascript
let v8 = C85({ hasThinking: R8 }),
    f1 = A.enablePromptCaching ?? n85(W8.model),
    g8;
// ... other body assembly ...
return {
  model: Of(A.model),
  messages: q8A(h, f1, A.querySource, D6, V6, f6, A.skipCacheWrite),
  system: m,
  tools: U,
  // ...
  ...v8 && S && G8.includes(BZ8) && { context_management: v8 },
  // ...
};
```

`R8` is set earlier in the same function:
```javascript
R8 = _.type !== "disabled" && !S6(process.env.CLAUDE_CODE_DISABLE_THINKING)
```

So `hasThinking` is `true` when **the thinking config for this request is not "disabled"** AND `CLAUDE_CODE_DISABLE_THINKING` env var is not set. Both conditions are typically true for any model that supports extended thinking (Sonnet 4.x, Opus 4.x).

### When does `context_management` actually get sent?

The body inclusion guard is `v8 && S && G8.includes(BZ8)`:
- `v8` — `C85`'s output is non-undefined (i.e., `hasThinking=true`, so an edit was pushed)
- `S` — `j.length > 0` where `j` is the betas array (request has *any* betas)
- `G8.includes(BZ8)` — `BZ8 = "context-management-2025-06-27"` is in the betas list

The first two are routine; the third is what gates this layer. The `context-management-2025-06-27` beta is added to the betas list as part of standard request setup for context-management-aware builds. As long as it's there (which it is for production v2.1.112), every thinking-enabled request gets `context_management`.

**This means: layer ② runs every turn for the default Sonnet 4.x / Opus 4.x user.** The earlier "completely gutted" framing of microcompact missed this entirely.

### What does the server do with `clear_thinking_20251015`?

The strategy descriptor declares: "before processing this request, drop all `thinking` and `redacted_thinking` blocks from the input messages, but `keep: "all"` other content." The server applies the edit transparently:
- Cache lookup uses the **pre-edit** prefix hash → the cached prefix still matches across requests
- Model receives the **post-edit** content → no thinking blocks
- Usage billing uses **post-edit** size → the user pays for the smaller input

The result: thinking blocks accumulate freely in the local message store (and on disk in JSONL transcript) but **never reach the model after the first turn that produced them**. Each turn the model sees the most recent thinking only if the model just produced it — older thinking is invisible.

### Difference from v2.1.88

The 2.1.88 source `getAPIContextManagement` (apiMicrocompact.ts:64-153) supported more options:

| Option | v2.1.88 | v2.1.112 |
|---|---|---|
| `clear_thinking_20251015` with `keep: "all"` | ✓ default mode | ✓ only mode |
| `clear_thinking_20251015` with `keep: { type: "thinking_turns", value: 1 }` | ✓ (when `clearAllThinking=true`, e.g. >1h idle) | ✗ removed |
| `isRedactThinkingActive` skip behavior | ✓ skip thinking-clear when redacted-thinking is active | ✗ removed (always clears if `hasThinking`) |
| `clear_tool_uses_20250919` (ant-only, env-gated by `USE_API_CLEAR_TOOL_RESULTS` / `USE_API_CLEAR_TOOL_USES`) | ✓ two strategies (`TOOLS_CLEARABLE_RESULTS`, `TOOLS_CLEARABLE_USES`) | ✗ removed entirely |
| Number of input options | 4 (`hasThinking`, `isRedactThinkingActive`, `clearAllThinking`, [implicit env]) | 1 (`hasThinking`) |

So `C85` is a strict simplification: kept the universal default-on path, dropped the edge-case modes and the ant-only experiments. For non-ant default users, behavior is unchanged from v2.1.88.

The `clear_tool_uses_20250919` strategy's job — clearing old tool_results — has been moved client-side as layer ③ (`qD4`), but invoked only on overflow (reactively) instead of per-request (proactively).

---

## 3. Layer ③ — Reactive Tool-Result Clearing (`qD4` via `d85`)

```javascript
// ============================================
// keepRecentMicrocompact - KEEP-RECENT MC algorithm
// Location: chunks.85.mjs:1235-1274
// ============================================

// ORIGINAL:
function qD4(q, K, _) {
    let z = t4z(q),
        Y = Math.max(1, _.keepRecent),
        A = new Set(z.slice(-Y)),
        O = new Set(z.filter((j) => !A.has(j)));
    if (O.size === 0) return null;
    let w = 0,
        $ = q.map((j) => {
            if (j.type !== "user" || !Array.isArray(j.message.content)) return j;
            let H = !1,
                J = j.message.content.map((X) => {
                    if (X.type === "tool_result" && O.has(X.tool_use_id) && X.content !== sR8)
                        return w += s4z(X), H = !0, { ...X, content: sR8 };
                    return X
                });
            if (!H) return j;
            return { ...j, message: { ...j.message, content: J } }
        });
    if (w === 0) return null;
    if (d("tengu_time_based_microcompact", {
            toolsCleared: O.size,
            toolsKept: A.size,
            keepRecent: _.keepRecent,
            tokensSaved: w,
            trigger: "context_hint"
        }), E(`[KEEP-RECENT MC] context_hint trigger, cleared ${O.size} tool results (~${w} tokens), kept last ${A.size}`),
        nj6(), SR(), iI() && K) i04(K);
    return { messages: $, tokensSaved: w, clearedIds: O }
}

// READABLE:
function keepRecentMicrocompact(messages, telemetryContext, opts) {
  // Phase 1: Identify candidate tool IDs (chronological order)
  const compactableIds = collectCompactableToolIds(messages);
  const keepRecent = Math.max(1, opts.keepRecent);     // never keep zero
  const recent = new Set(compactableIds.slice(-keepRecent));
  const old = new Set(compactableIds.filter(id => !recent.has(id)));
  if (old.size === 0) return null;

  // Phase 2: Walk messages, replace old tool_result content with sR8
  let tokensSaved = 0;
  const newMessages = messages.map(msg => {
    if (msg.type !== "user" || !Array.isArray(msg.message.content)) return msg;
    let modified = false;
    const newContent = msg.message.content.map(block => {
      if (block.type === "tool_result"
          && old.has(block.tool_use_id)
          && block.content !== TIME_BASED_MC_CLEARED_MESSAGE) {
        tokensSaved += calculateToolResultTokens(block);
        modified = true;
        return { ...block, content: TIME_BASED_MC_CLEARED_MESSAGE };
      }
      return block;
    });
    return modified ? { ...msg, message: { ...msg.message, content: newContent } } : msg;
  });

  if (tokensSaved === 0) return null;                  // re-entry safety

  // Phase 3: Telemetry, side effects, notification
  emit("tengu_time_based_microcompact", {
    toolsCleared: old.size,
    toolsKept: recent.size,
    keepRecent: opts.keepRecent,
    tokensSaved,
    trigger: "context_hint",                            // hardcoded — only caller is d85
  });
  log(`[KEEP-RECENT MC] context_hint trigger, cleared ${old.size} tool results (~${tokensSaved} tokens), kept last ${recent.size}`);
  notifyCacheDeletion();                                // → Ee6 set true → UI flag
  resetMicrocompactState();                             // forward-compat for cached-MC bookkeeping
  if (isAntUser() && telemetryContext) notifyCacheDeletionForAntUser(telemetryContext);

  return { messages: newMessages, tokensSaved, clearedIds: old };
}
```

### Phase-by-Phase Walkthrough

#### Phase 1: Identify Candidates

`t4z` (collectCompactableToolIds) walks messages chronologically, collecting `tool_use` IDs whose tool name is in `o4z` (the compactable-tools set). Iteration is **oldest-first**, so `slice(-keepRecent)` returns the most recent N IDs.

```javascript
function t4z(q) {
    let K = [];
    for (let _ of q)
        if (_.type === "assistant" && Array.isArray(_.message.content))
            for (let z of _.message.content)
                if (z.type === "tool_use" && o4z.has(z.name)) K.push(z.id)
    return K
}
```

Only `tool_use` blocks in **assistant** messages count. Tool_use blocks elsewhere (rare/malformed) are ignored.

`o4z` (chunks.85.mjs:1297): `Set([Bash, Glob, Grep, Read, WebFetch, WebSearch, Edit, Write, ...shell-variants])`. Excludes `Task`, `SlashCommand`, MCP tools (clearing those results would lose information that can't be reconstructed).

#### Phase 2: Walk and Edit

Immutable map: `q.map(j => ...)` produces a new message array. Each `tool_result` block whose `tool_use_id` is in the `old` set has its `content` replaced with `sR8 = "[Old tool result content cleared]"`. The check `block.content !== sR8` prevents double-clearing — on re-entry, already-cleared results are skipped, `tokensSaved` doesn't double-count, and the function safely returns `null` when nothing new to do.

`s4z(block)` computes tokens (string content via `w_` estimator; image/document blocks fixed at `r4z = 2000` tokens).

#### Phase 3: Telemetry + State

`tengu_time_based_microcompact` event (the name is preserved from v2.1.88's time-based path; only the `trigger` field differs):
- `toolsCleared` / `toolsKept` / `keepRecent`
- `tokensSaved` — aggregate freed tokens
- `trigger`: `"context_hint"` (hardcoded — `qD4`'s only caller in v2.1.112 is `d85`)

`nj6()` flips `Ee6` to `true` → UI may render "cache will rebuild next turn" warning.

`SR()` clears `cachedMCState` bookkeeping (forward-compat — `cachedMCModule` may be `null` in 2.1.112 builds, the function handles that):

```javascript
function SR() {
    let q = ij6;
    if (q.cachedMCState && q.cachedMCModule)
        q.cachedMCModule.resetCachedMCState(q.cachedMCState);
    q.pendingCacheEdits = null
}
```

`iI() && K → i04(K)` (ant users only): updates per-message-cache-hash registry with `cacheDeletionsPending = true` for telemetry/break-detection. Pure observability — the deletion already happened to `messages`.

### How `qD4` Gets Called

The single caller in v2.1.112 is `d85` (chunks.194.mjs:870):

```javascript
let Y = qD4(q, K, { keepRecent: Q6A });    // Q6A = 5
```

`d85` is the context_hint reject handler. It runs only when:
1. `tengu_hazel_osprey` master switch is true.
2. The previous request had `context_hint: { enabled: true }` in its body and `context-hint-2026-04-09` in its betas.
3. The API rejected with HTTP 422 (predicted overflow) or 424 (overflow during streaming).
4. We have not already retried this request once.

The reject handler additionally does a one-time-per-session "thinking estimate" step before calling `qD4` (latched via `B8.thinkingClearLatched` — see [api_context_management.md](./api_context_management.md) for the latch's role).

See [context_hint_path.md](./context_hint_path.md) for the full reject flow.

---

## 4. The Three-Layer Story Across Versions

| Layer | v2.1.88 source | v2.1.112 binary | Default-user impact of the change |
|---|---|---|---|
| ① UI state flag | `clearCompactWarningSuppression()` always | `a04()` always | none — same |
| ② API-level thinking-clear | `getAPIContextManagement` per request, when `hasThinking` | `C85` per request, when `hasThinking` | none — same default behavior |
| ② API-level tool_use clear (ant-only) | `clear_tool_uses_20250919` env-gated | removed | ant users with env var set lost it |
| ③ Client-side proactive tool_result clear (60min gap) | `maybeTimeBasedMicrocompact`, `tengu_slate_heron`, default off | absent | none — was off in 2.1.88 too |
| ③ Client-side proactive tool_result clear (cached MC) | `cachedMicrocompactPath`, `feature('CACHED_MICROCOMPACT')`, ant-only | absent | ant users with the build flag lost it |
| ③ Client-side reactive tool_result clear (server-driven) | not present | new — `qD4` called from `d85` reject path | new safety net for overflow |

### What a default v2.1.112 user actually experiences

Every turn:
- Layer ① runs (clears UI state — invisible to user)
- Layer ② runs (server transparently strips old thinking blocks — invisible, just makes context smaller)

On overflow (rare; happens despite autocompact's threshold):
- Layer ③ runs once via `d85` (clears old tool_results to ~5 most recent, then retries)

So microcompaction **definitely happens every turn** in v2.1.112 — just at the API layer rather than as a client-side message mutation. The "client-side per-turn MC" disappeared because (a) it was experimental scaffolding default-off in 2.1.88, and (b) the API-level approach is strictly better (cache-aware, transparent, server-versioned).

---

## 5. Why the Architectural Split?

**Layer ① is a UI concern.** Resetting a user-facing warning state every turn is a different responsibility from message mutation. Keeping it in `_c` (separate from `qD4`) preserves the lifecycle invariant: the flag is set when something happens, cleared at start of next turn.

**Layer ② is a server concern.** Thinking blocks are produced by the model and accumulate without user control. Server-side clearing is:
- **Cache-aware** — doesn't break the prefix hash
- **Stateless on client** — every request can declare the strategy without remembering "what's been cleared"
- **Independently versioned** — Anthropic can evolve `clear_thinking_20251015` server-side without client redeploys

**Layer ③ is a recovery concern.** Tool results are user-traceable (each one came from a specific tool call); blindly clearing them loses information visible to the user. Doing it only on actual overflow:
- Avoids unnecessary work in the steady-state case (where autocompact prevents overflow)
- Preserves the most-recent 5 tool results (the ones the model is most likely to reference)
- Surfaces telemetry distinguishing "compact prevented overflow" vs "context-hint had to step in"

The split makes each layer **independently evolvable**. Layer ② can add new edit types (e.g., `clear_tool_uses_20260112`) without touching the client's per-turn loop. Layer ③ can change its trigger (e.g., from 422/424 to a different signal) without touching the API context_management strategy. Layer ① stays unchanged across all this.

---

## 6. Constants Reference

| Constant | Value | Purpose |
|---|---|---|
| `o4z` (`COMPACTABLE_TOOLS_SET`) | `Set([Bash, Glob, Grep, Read, WebFetch, WebSearch, Edit, Write, ...])` | Tools whose results are eligible for layer ③ MC. Excludes Task, SlashCommand, MCP. |
| `sR8` (`TIME_BASED_MC_CLEARED_MESSAGE`) | `"[Old tool result content cleared]"` | Replacement content for cleared tool_results |
| `r4z` (`IMAGE_TOKEN_ESTIMATE`) | `2000` | Fixed token estimate per image/document block |
| `Q6A` (`DEFAULT_KEEP_RECENT`) | `5` | How many tool results layer ③ preserves |
| `BZ8` | `"context-management-2025-06-27"` | API beta header gating layer ② |
| `I85` | `"context-hint-2026-04-09"` | API beta header gating layer ③ |

---

## 7. Edge Cases

### Layer ① fires before Layer ③ in the same turn

If turn N triggers a 422/424 (layer ③ fires), `nj6()` sets the UI flag to `true`. At the start of turn N+1, layer ① (`_c`) runs `a04()` which clears the flag. So the warning persists for exactly one turn after a layer-③ event. This is intentional — the user sees a brief indication that the cache will rebuild.

### Layer ② fires when there's nothing to clear

If `hasThinking=true` but the messages contain no thinking blocks (e.g., right after autocompact replaced everything with a summary), the server runs the edit as a no-op. Cost: negligible — the server walks the messages and finds nothing to remove. Predictability advantage: client doesn't need to track "is there thinking content somewhere".

### Layer ③ fires twice via overlapping rejects

Re-entry safety: `qD4` checks `block.content !== sR8` per block, so already-cleared results aren't double-counted. If `d85` somehow fires twice for the same set of messages (it shouldn't — the latch + retry prevent it, but malformed responses might), the second call returns `null` because no new tokens are saved.

### A `tool_use` in `compactableIds` has no `tool_result` (yet)

Phase 1 collects the ID into `compactableIds`. Phase 2 only modifies `tool_result` blocks, so an unmatched `tool_use` doesn't get touched. The unmatched ID still counts toward the `recent` partition — meaning the recent-5 might "include" some pending tool_uses, leaving fewer slots for completed ones. Result: layer ③ may clear *more* aggressively than the nominal 5, but never incorrectly. In practice, by the time layer ③ runs (in a reject handler), pending tool_uses are rare — they're typically resolved before the reject path fires.

---

## 8. Integration: Microcompaction in the Overflow Recovery Story

```
┌──────────────────────────────────────────────────────────────────────┐
│              Context Management Stack in v2.1.112                     │
└──────────────────────────────────────────────────────────────────────┘

EVERY TURN (default user):
  Layer ① (_c):              clear UI warning flag                  ~1µs
  Layer ② (C85→server):      strip old thinking blocks server-side  ~few-tokens-of-saving per turn

PRE-API (when threshold crossed, ~167k tokens):
  Local autocompact (vI6):   full LLM compact + state restore       ~5-15s, replaces history

ON API RESPONSE 422/424 (reject):
  Layer ③ (d85):
     Step A: thinking-clear estimate (one-time per session, latched) 
     Step B: qD4 KEEP-RECENT MC                                     ~zero (in-place edits)
     Step C: retry the request once                                  ~1 round-trip extra
```

Layers ① and ② are part of the **steady-state** protocol: they run every turn, default users included.

Local autocompact (`vI6`) is the **proactive** safety net: when the threshold is crossed, do the heavy LLM compact to reset.

Layer ③ is the **reactive** safety net: when even autocompact + thinking-clear-via-server didn't prevent overflow, peel the oldest tool results and retry once.

Each is strictly cheaper than the next:
- Layer ② saves thinking tokens with zero LLM calls (transparent server-side edit)
- Layer ③ saves tool_result tokens with zero LLM calls (in-place client mutation, costs one extra retry round-trip)
- `vI6` does an LLM call (~5-15s, ~$0.05 per session)

The composition lets the system pick the cheapest mechanism that suffices.

---

## 9. Key Insight

**Microcompaction in v2.1.112 is not gone — it's been disaggregated.** The single 2.1.88 client-side function `microcompactMessages` has been split into three layers running at different times and places, each with its own cost/benefit profile.

The most important takeaway: **layer ② (`C85`/`clear_thinking_20251015`) runs every turn for default users**. Earlier framings ("MC is gutted to a no-op") missed this because they only looked at the per-turn client-side function `_c`, not at the API request body. The server is doing the per-turn microcompaction for you, transparently.

What's been removed is the *client-side proactive* variant — and that's a strict improvement: it was experimental (default-off `tengu_slate_heron`), edge-case (60-min gap heuristic), or ant-only (cached MC). The server-driven equivalents are universal, default-on, cache-aware, and independently versioned.
