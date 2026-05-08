# API Context Management — `clear_thinking_20251015`

## Overview

The Anthropic API supports a feature called **context_management** that lets the client tell the server: "before processing this request, apply these edits to the input." The edits run server-side, so the client doesn't mutate its local message state — the server simply sees the edited input.

In v2.1.112, only **one strategy** is sent by the client: `clear_thinking_20251015` with `keep: "all"`. It tells the server to drop all `thinking` and `redacted_thinking` blocks from the input messages.

**Crucial correction.** Earlier drafts of this document framed `clear_thinking_20251015` as "latched after first 422/424 reject" — i.e., the client only starts including the edit once the API has demanded relief. **This is wrong.** Direct inspection of `C85`'s caller (chunks.194.mjs:1536) shows the edit is sent on **every request that has thinking enabled**, regardless of whether overflow has ever happened. The latch (`Op6`/`wp6`) is a separate, narrower mechanism: it's used only inside `d85` (the reject handler) to make the **one-time thinking-token estimation** for telemetry idempotent. It does **not** gate whether `context_management` flows on the wire.

So the actual lifecycle is:
- Layer ② of microcompaction (this document): runs **every turn** for thinking-enabled models, server transparently strips old thinking
- Layer ③ of microcompaction ([microcompaction.md](./microcompaction.md)): only runs on 422/424 reject, latched once per session for the telemetry side

This document describes layer ② — the universal per-request thinking-clear strategy.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — API
> - [microcompaction.md](./microcompaction.md) — How layer ② fits the three-layer architecture
> - [context_hint_path.md](./context_hint_path.md) — The 422/424 reject path

Key functions in this document:
- `getAPIContextManagement` (`C85`) — chunks.194.mjs:741
- `isThinkingClearLatched` (`Op6`) — chunks.1.mjs:3272
- `setThinkingClearLatched` (`wp6`) — chunks.1.mjs:3276
- `contextHintReject` (`d85`) — chunks.194.mjs:856

Constants:
- `BZ8` (`API_BETA_CONTEXT_MANAGEMENT`) = `"context-management-2025-06-27"` — chunks.43.mjs:2741

---

## 1. The Strategy Descriptor (`C85`)

```javascript
// ============================================
// getAPIContextManagement - Returns the API context_management object for the next request
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

// Mapping: C85→getAPIContextManagement, q→opts, K→hasThinking
```

### Output shape

When `hasThinking` is true:
```json
{ "edits": [ { "type": "clear_thinking_20251015", "keep": "all" } ] }
```

When `hasThinking` is false: returns `undefined` (no `edits` array, caller omits `context_management` from the request body).

### What `keep: "all"` means

The `keep` qualifier specifies what to **keep** when applying the edit — it answers "after I clear the targeted blocks, what should remain":
- `keep: "all"` — clear all thinking blocks but keep all other content. **The only value used in v2.1.112.**
- `keep: { type: "thinking_turns", value: 1 }` — would keep only the most recent thinking turn. Was supported in v2.1.88 source's `clearAllThinking=true` mode (>1h idle); not used in v2.1.112.

So in practice, `clear_thinking_20251015 / keep: "all"` means: "drop every thinking block but keep tool_use / tool_result / text / image / document / etc."

---

## 2. The Caller — Per-Request Body Building

`C85` is invoked once per outgoing API request, inline in the request-body assembly function in chunks.194.mjs (the same function that builds `messages`, `system`, `tools`, `metadata`, etc.). Excerpt:

```javascript
// chunks.194.mjs:1513-1568 (annotated)

// Earlier in the same function — determine if thinking is enabled for this request:
R8 = _.type !== "disabled" && !S6(process.env.CLAUDE_CODE_DISABLE_THINKING);

// ... (~50 lines of other body assembly: thinking config, tools, betas) ...

// Build the context_management directive:
let v8 = C85({ hasThinking: R8 }),
    f1 = A.enablePromptCaching ?? n85(W8.model);

// ... return the request body:
return {
    model: Of(A.model),
    messages: q8A(h, f1, A.querySource, D6, V6, f6, A.skipCacheWrite),
    system: m,
    tools: U,
    tool_choice: A.toolChoice,
    ...S && !z8 && { betas: G8 },
    metadata: fK6(),
    max_tokens: _8,
    thinking: i6,
    ...l6 !== void 0 && { temperature: l6 },

    // ⬇ Layer ② of microcompaction: send context_management when:
    // (1) C85 returned a non-undefined edits object (= hasThinking was true)
    // (2) S = j.length > 0 (request has any betas)
    // (3) the context-management-2025-06-27 beta is in the betas list
    ...v8 && S && G8.includes(BZ8) && { context_management: v8 },

    ...!z8 && U6 ? U6 : {},
    ...u6,
    ...Object.keys(h6).length > 0 && { output_config: h6 },
    ...g8 !== void 0 && { speed: g8 }
};
```

### When does `hasThinking` become true?

Looking at the binding `R8 = _.type !== "disabled" && !CLAUDE_CODE_DISABLE_THINKING`:
- `_.type` is the thinking config type for this turn — `"enabled"` (production), `"adaptive"` (dynamic budget), `"disabled"` (off), or possibly other future values
- `CLAUDE_CODE_DISABLE_THINKING` is an env-var override

So `hasThinking` is true whenever the model + request configuration has thinking enabled. That's the default for **Sonnet 4.x and Opus 4.x** in production. Practically, this means:
- A normal chat turn with Opus 4.7: `hasThinking=true` → `context_management` sent
- A turn that explicitly disables thinking (e.g., compact-summary forks): `hasThinking=false` → no `context_management`
- A turn with `CLAUDE_CODE_DISABLE_THINKING=1` env override: `hasThinking=false` → no `context_management`

### Why is this NOT latched?

There is no latch check between the binding of `R8` and the call to `C85`. `R8` is computed fresh per request from the thinking config and env state. The result feeds straight into `C85`, which builds the strategy descriptor unconditionally.

The implication: **every turn, for default Sonnet 4.x / Opus 4.x users, the request body contains `context_management: { edits: [{ type: "clear_thinking_20251015", keep: "all" }] }`**, starting from the very first turn. The server transparently strips thinking blocks from the prefix on every call.

### What about the `B8.thinkingClearLatched` latch?

There IS a latch in the codebase at `B8.thinkingClearLatched`, accessed via `Op6` / `wp6` (chunks.1.mjs:3272-3276):

```javascript
function Op6() { return B8.thinkingClearLatched }       // get
function wp6(q) { B8.thinkingClearLatched = q }          // set
```

But it's used only inside `d85` (the 422/424 reject handler — see [context_hint_path.md](./context_hint_path.md)):

```javascript
// chunks.194.mjs:856-887 (excerpt)
function d85(q, K) {
    let _ = qT(q), z = !1;
    if (Op6() !== !0) {                       // latch check — once per session
        wp6(!0), z = !0;                       // latch true
        let w = 0;
        for (let $ of q) {
            // ... walk messages, sum thinking + redacted_thinking byte sizes ...
        }
        kJ7("context_hint", Math.round(w / 4))    // emit thinking-tokens telemetry
    }
    let Y = qD4(q, K, { keepRecent: Q6A });    // KEEP-RECENT MC (separate from thinking-clear)
    // ...
}
```

The latch's purpose is to make the **thinking-tokens telemetry estimation** idempotent — a per-session one-shot. The estimation is a full message walk that's expensive for large conversations. We do it once (the first time `d85` fires) and stash the result via `kJ7("context_hint", estimate)`. Subsequent reject events skip the estimation.

**The latch does NOT gate the `clear_thinking_20251015` strategy itself.** The server-side stripping happens via layer ② (every turn, controlled by `hasThinking`). The latch only controls layer ③'s metadata collection.

This was a confusing point in earlier drafts of this doc — corrected here.

---

## 3. Difference from v2.1.88 Source

### v2.1.88's `getAPIContextManagement` (apiMicrocompact.ts:64-153)

```typescript
export function getAPIContextManagement(options?: {
  hasThinking?: boolean
  isRedactThinkingActive?: boolean
  clearAllThinking?: boolean
}): ContextManagementConfig | undefined {
  const { hasThinking = false, isRedactThinkingActive = false, clearAllThinking = false } = options ?? {}
  const strategies: ContextEditStrategy[] = []

  if (hasThinking && !isRedactThinkingActive) {
    strategies.push({
      type: 'clear_thinking_20251015',
      keep: clearAllThinking ? { type: 'thinking_turns', value: 1 } : 'all',
    })
  }

  // Tool clearing strategies are ant-only
  if (process.env.USER_TYPE !== 'ant') {
    return strategies.length > 0 ? { edits: strategies } : undefined
  }

  const useClearToolResults = isEnvTruthy(process.env.USE_API_CLEAR_TOOL_RESULTS)
  const useClearToolUses = isEnvTruthy(process.env.USE_API_CLEAR_TOOL_USES)

  if (!useClearToolResults && !useClearToolUses) {
    return strategies.length > 0 ? { edits: strategies } : undefined
  }

  if (useClearToolResults) {
    strategies.push({
      type: 'clear_tool_uses_20250919',
      trigger: { type: 'input_tokens', value: triggerThreshold },
      clear_at_least: { type: 'input_tokens', value: triggerThreshold - keepTarget },
      clear_tool_inputs: TOOLS_CLEARABLE_RESULTS,
    })
  }
  if (useClearToolUses) {
    strategies.push({
      type: 'clear_tool_uses_20250919',
      trigger: { type: 'input_tokens', value: triggerThreshold },
      clear_at_least: { type: 'input_tokens', value: triggerThreshold - keepTarget },
      exclude_tools: TOOLS_CLEARABLE_USES,
    })
  }
  return strategies.length > 0 ? { edits: strategies } : undefined
}
```

### Diff to v2.1.112's `C85`

| Capability | v2.1.88 source | v2.1.112 binary |
|---|---|---|
| Input parameters | 3 (`hasThinking`, `isRedactThinkingActive`, `clearAllThinking`) | 1 (`hasThinking`) |
| `clear_thinking_20251015 / keep: "all"` (default) | ✓ when `hasThinking && !isRedactThinkingActive` | ✓ when `hasThinking` |
| `clear_thinking_20251015 / keep: { type: "thinking_turns", value: 1 }` | ✓ when `clearAllThinking` (e.g., >1h idle) | ✗ removed |
| Skip thinking-clear when redact-thinking active | ✓ | ✗ always clears if `hasThinking` |
| `clear_tool_uses_20250919 / clear_tool_inputs` (ant-only, env-gated by `USE_API_CLEAR_TOOL_RESULTS`) | ✓ | ✗ removed |
| `clear_tool_uses_20250919 / exclude_tools` (ant-only, env-gated by `USE_API_CLEAR_TOOL_USES`) | ✓ | ✗ removed |
| `TOOLS_CLEARABLE_RESULTS` constant (Bash, Glob, Grep, Read, WebFetch, WebSearch) | ✓ | n/a (no tool-uses strategy) |
| `TOOLS_CLEARABLE_USES` constant (Edit, Write, NotebookEdit) | ✓ | n/a |
| `DEFAULT_MAX_INPUT_TOKENS = 180_000` / `DEFAULT_TARGET_INPUT_TOKENS = 40_000` | ✓ | n/a |

**For non-ant default users**: behavior is identical between versions — both push `clear_thinking_20251015 / keep: "all"` when `hasThinking`. The simplification didn't affect typical users.

**For ant users with the env vars set**: lost the server-side tool-clearing strategies. Their job is now done by layer ③ (`qD4`) on the reject path — but only reactively, not proactively.

**For users with redacted-thinking active**: lost the skip behavior — thinking-clear is sent unconditionally now. May result in the server doing a no-op edit (clearing nothing) when redacted-thinking is the only thinking content.

---

## 4. The Beta Header `context-management-2025-06-27`

```javascript
// chunks.43.mjs:2741
BZ8 = "context-management-2025-06-27"
```

This beta header gates whether the `context_management` body field is recognized server-side. The client only includes the field if the beta is in the request's `betas` array (which it is for production v2.1.112 builds with the appropriate user/feature configuration).

The date suffix `2025-06-27` indicates the beta was introduced June 27, 2025. The `clear_thinking_20251015` edit type's date suffix (October 15, 2025) was added later as one of the strategies under the same beta umbrella.

Anthropic uses date-suffix versioning extensively for API beta headers (e.g., `context-hint-2026-04-09`) and edit types so old and new clients can coexist with backward compatibility on the server.

---

## 5. Server Semantics of `clear_thinking_20251015`

The exact server behavior is implementation-defined and may evolve, but the contract is:
- Find all `thinking` and `redacted_thinking` blocks in the input messages
- Remove them before the model processes the input
- Compute usage based on the **post-edit** input (so the user is billed for the smaller size)
- Apply normal cache lookup against the **pre-edit** input prefix (so the cached prefix still matches across requests with and without the edit)

The server-side cache strategy is what makes this efficient:
- The prefix cache key is computed BEFORE edits are applied
- The model sees the post-edit content
- This means caching survives across requests with `context_management` differences (as long as the underlying messages prefix is identical)

**Without the cache-aware design, layer ② would invalidate the cache prefix every turn**, defeating the purpose. The whole point of putting this server-side is to combine "smaller input to model" with "cache-prefix preservation."

---

## 6. The Latch in `d85` (Telemetry-Only)

Cleared up in §2: the latch `B8.thinkingClearLatched` does NOT control whether `clear_thinking_20251015` is sent on the wire. It controls a **one-time-per-session** behavior inside the reject handler `d85`.

```javascript
// chunks.194.mjs:856-868 (latch usage in d85)
function d85(q, K) {
    let _ = qT(q), z = !1;
    if (Op6() !== !0) {                       // first reject this session?
        wp6(!0), z = !0;                       // latch on
        let w = 0;
        for (let $ of q) {                     // walk messages
            if ($.type !== "assistant" || !Array.isArray($.message.content)) continue;
            for (let j of $.message.content)
                if (j.type === "thinking") w += j.thinking.length;
                else if (j.type === "redacted_thinking") w += j.data.length
        }
        kJ7("context_hint", Math.round(w / 4))   // emit total-thinking-tokens estimate
    }
    let Y = qD4(q, K, { keepRecent: Q6A });    // ALWAYS run KEEP-RECENT MC
    // ...
}
```

The latched behavior:
- **First time** `d85` fires in a session: walk all messages, sum thinking byte sizes, divide by 4 (rough chars-to-tokens), emit `tengu_thinking_clear_latched` event with that estimate, set the latch
- **Subsequent times**: skip the message walk — we already know roughly how much thinking exists

The `qD4` call (KEEP-RECENT MC for tool_results) runs every time `d85` fires, not just on the first. So the latch only saves the cost of the message walk for the thinking-tokens telemetry, nothing else.

### Why latch the thinking estimate?

Walking all messages to estimate thinking-token counts is O(n) per turn where n is the message count. For a session that hits overflow repeatedly (which happens when context is so tight that thinking-clear + KEEP-RECENT MC barely cover the gap), running the walk on every reject would burn CPU. Latching reduces it to once per session.

This is a pure observability concern — the actual context management (server-side thinking strip + client-side tool_result clear) happens regardless.

---

## 7. Lifecycle: Fresh Session → Steady State

### Fresh session

- `B8.thinkingClearLatched = false` (uninitialized)
- Every turn that has thinking enabled: request body includes `context_management: { edits: [{ type: "clear_thinking_20251015", keep: "all" }] }`
- Server transparently strips thinking from each request's input
- Local message store retains thinking blocks (they're written to the JSONL transcript on disk for replay/resume)

### Conversation grows

- Local thinking blocks accumulate in the message store
- Each turn, the server still strips them via layer ②
- If the LOCAL token count crosses autocompact threshold (~167k typical), `vI6` runs and replaces history with a summary (no thinking blocks in the summary)

### Overflow despite autocompact

- Some turn's input pushes over the API's hard limit even with thinking stripped
- API returns 422 (predicted) or 424 (mid-stream) with `context_hint`
- `d85` runs:
  - First time: latch on, walk thinking bytes, emit `tengu_thinking_clear_latched`
  - Always: run `qD4` to clear old tool_results (keep recent 5)
- Caller retries the request once
- The retry includes the same `context_management` directive (still on every turn) AND now has fewer tool_results

### Steady state (post-overflow)

- `context_management` continues every turn (unchanged from pre-overflow)
- The latch is on; subsequent `d85` calls skip the message walk for telemetry
- Local message store has some `[Old tool result content cleared]` placeholders where layer ③ ran

### New session

- `B8` is fresh; `thinkingClearLatched = false`
- Cycle restarts

---

## 8. Telemetry Events

### `tengu_thinking_clear_latched` (chunks.194.mjs)

```javascript
function kJ7(q, K) {
    d("tengu_thinking_clear_latched", {
        trigger: q,                          // "context_hint" — only trigger in v2.1.112
        estimatedThinkingTokens: K           // Math.round(thinkingBytes / 4)
    })
}
```

Fires once per session, on the first 422/424 reject. Useful for:
- Distribution of "how often do users hit overflow despite layer ②?" — count of events per session
- Distribution of "how big is the thinking content at overflow?" — `estimatedThinkingTokens` quantiles
- Correlation with autocompact threshold tuning

The `trigger` field is parameterized so future versions can add other triggers (e.g., `"manual_clear"`) without breaking analysis.

### `tengu_time_based_microcompact` (chunks.85.mjs:1262)

Emitted by `qD4` whenever it actually clears tool_results. Despite the legacy name, in v2.1.112 the `trigger` field is hardcoded `"context_hint"`. See [microcompaction.md § 3](./microcompaction.md#3-layer--reactive-tool-result-clearing-qd4-via-d85).

---

## 9. Edge Cases

### Latch flipped but no thinking content remains

If a fresh session never has thinking enabled (e.g., always non-thinking model, or `CLAUDE_CODE_DISABLE_THINKING=1`), `hasThinking` is permanently false → `C85` returns undefined → `context_management` never appears in requests. The latch in `d85` doesn't matter because thinking-related telemetry is moot.

### Manual `/compact` while latched

Manual `/compact` runs through `vI6` like normal. The compact LLM call has thinking disabled (it's a forked agent with `thinkingConfig: { type: 'disabled' }`), so its request doesn't carry `context_management`. The main-loop request before/after compact still has `hasThinking=true` and includes `context_management` as usual. The latch state is unaffected by manual compact — it only flips on actual 422/424 events.

### Server doesn't recognize `clear_thinking_20251015`

The beta header `context-management-2025-06-27` is what gates whether the server processes the field at all. If the beta is misconfigured server-side, the server returns 400 with "unrecognized beta" — that's a deployment regression. In practice, betas and edit types are coordinated between client/server releases.

### Thinking config switches mid-session

If a user starts in thinking-enabled mode, then switches to a non-thinking model mid-session, subsequent turns have `hasThinking=false` → `context_management` stops being sent. The local store still has the thinking blocks from earlier turns; without `context_management`, the server now sees them. This may push the input over the limit and trigger 422/424 → layer ③ kicks in. Acceptable — it's a rare path.

---

## 10. Why Server-Side?

The thinking-clear could in principle be done client-side (walk messages, drop thinking blocks before sending). But:

- **Cache invalidation**: client-side editing changes the prefix hash → cache miss → cache-creation cost
- **State complexity**: every send needs message-walk + edit
- **Reversibility**: local message state should remain authoritative (for transcript display, resume, audit)
- **Versioning**: API edit types are versioned independently from client releases

Server-side via `context_management`:
- **Cache-aware**: server applies edit AFTER cache lookup → prefix match preserved
- **Stateless on client**: client sends the same messages each turn; server handles edits
- **Forward-compatible**: new edit types can be added without client changes

The trade-off the design makes: defer to the server for context-shape transformations that affect caching. This is symmetric with how the API beta `context-hint-2026-04-09` (used by layer ③ via `d85`) operates — server tells client when to act, client edits messages locally for cases where server-side editing would be semantically wrong (tool_results carry user-visible information that client UIs need to handle).

---

## 11. Comparison Across Versions

| Aspect | v2.1.88 source | v2.1.112 binary |
|---|---|---|
| `clear_thinking_20251015 / keep: "all"` for default users | ✓ when `hasThinking && !isRedactThinkingActive` | ✓ when `hasThinking` |
| `clear_thinking_20251015 / keep: thinking_turns:1` for >1h idle | ✓ via `clearAllThinking` | ✗ removed |
| `clear_tool_uses_20250919 / clear_tool_inputs` (ant) | ✓ env-gated | ✗ removed |
| `clear_tool_uses_20250919 / exclude_tools` (ant) | ✓ env-gated | ✗ removed |
| Client decides what to send (proactive, per-request) | ✓ same | ✓ same |
| Latch on first overflow | ✗ (no latch) | ✓ but only for telemetry estimate, not for sending the strategy |
| Tool-result clearing (when ant env vars not set) | none server-side; nothing client-side either | new client-side `qD4` on reject path |

The economic shift:
- **v2.1.88 (default user)**: every thinking turn pays for sending `context_management` directive (negligible bytes); server strips thinking; user pays for stripped-size billing
- **v2.1.112 (default user)**: same exact behavior

So for **default users** the layer-② behavior is identical between versions — the simplification of `C85` is invisible. The visible changes are:
- ant users with `USE_API_CLEAR_TOOL_RESULTS` lost their server-side strategy (replaced by client-side reactive `qD4`)
- ant users with `USE_API_CLEAR_TOOL_USES` lost their server-side strategy (no replacement)
- redacted-thinking users no longer get the skip behavior

---

## 12. Key Insight

`clear_thinking_20251015` is **the universal per-turn microcompact for v2.1.112**. It's not gated, not latched, not optional — every default-user request that has thinking enabled tells the server to strip thinking. This is what keeps the model's input from being polluted by accumulated thinking blocks across long sessions.

The simplicity of `C85` (one strategy, one toggle field) belies how much load it carries:
- Without it, every long session would hit overflow within a few hundred turns
- Without it, autocompact would have to fire much more aggressively
- Without it, the cache would be invalidated frequently as thinking content shifts

The composition is the architectural reason the v2.1.112 system is robust: layer ② (server, every turn) handles the steady state, autocompact handles threshold events, layer ③ (client, on reject) handles overflow tail risk. Each layer is independently versioned and independently testable. The "boring" universal layer (this one) is the workhorse — but it's also the one most prone to being missed when reading the codebase, because it's just a one-liner emitted into a request body field.
