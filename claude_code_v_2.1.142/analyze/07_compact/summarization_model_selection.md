# Summarization Model Selection — Which Model Writes the Summary? (v2.1.142)

## Overview

When compaction runs, it makes an LLM call to produce the summary. The model used for *that call* is **always the main-loop model** — never a fallback Haiku. This document explains why, walks through where the choice is encoded, and surfaces the supporting infrastructure (output-token reservation, provider routing, subagent summary models, telemetry-friendly model fields) that makes the choice work across Bedrock/Vertex/Foundry/gateway deployments.

The choice is **not** a quality-vs-cost tradeoff — it's a **cache-locality** decision. Using the main model lets the compact API call reuse the prompt-cache prefix that the main conversation already wrote on disk, dropping per-compact cost by 70–90% on warm-cache turns.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Model registry, prompt-cache, telemetry
> - [symbol_additions_v2_1_142_compact_arch.md](../00_overview/symbol_additions_v2_1_142_compact_arch.md) - This unit's symbol mappings
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - Unit 11 cache-prefix sharing details

Key functions in this document:
- `summarizeCallWithCachePrefix` (`zH4`) - The summarize-call dispatcher; fork path first, streaming fallback second
- `runForkedAgent` (`JV`) - Forked LLM call that piggybacks on the parent's prompt cache
- `queryModelWithStreaming` (`NiH`) - The streaming-path fallback
- `getMaxOutputTokensForModel` (`e7H`) - Per-model max output tokens cap
- `COMPACT_MAX_OUTPUT_TOKENS` (`h_$`) = 20,000 - Reserved output budget for compaction
- `subagentProgressSummary` (`CM$`) - Different code path: how subagents produce their summaries (for `claude_code.summary` OTel events)
- `AGENT_SUMMARY_INTERVAL_MS` (`AP_`) - Subagent summary cadence

---

## 1. Where the Model is Chosen

`summarizeCallWithCachePrefix` (`zH4`) is the single dispatcher for the LLM call. Both compaction lanes (proactive `compactConversation` and reactive `iterateReactiveSummarize`) flow through it. The model is **never** parametrized — it's read directly from the session context every time.

```javascript
// ============================================
// summarizeCallWithCachePrefix - The compaction LLM call; uses parent's main-loop model verbatim
// Location: cli_inner_pretty.js:407959-408091
// ============================================

// ORIGINAL (for source lookup):
async function zH4({ messages: H, summaryRequest: $, appState: q, context: K, preCompactTokenCount: _, cacheSafeParams: A, stripNonEssential: z = !1 }) {
  let Y = !z && Z$("tengu_compact_cache_prefix", !0);
  // ... activity interval setup ...
  try {
    if (Y) try {
      let W = await JV({
        promptMessages: [$], cacheSafeParams: A, canUseTool: Mj6(),
        querySource: "compact", forkLabel: "compact",
        maxTurns: 1,
        maxOutputTokens: Math.min(h_$, e7H(K.options.mainLoopModel)),
        skipCacheWrite: !0, skipTranscript: !0,
        overrides: { abortController: K.abortController },
      }), G = N0(W.messages), V = G ? uI(G) : null;
      if (G && V && !G.isApiErrorMessage) { /* success */ return G; }
      // falls through to streaming fallback
    } catch (W) { /* logs and falls through */ }
    // STREAMING FALLBACK PATH
    let P = NiH({
      messages: ..., systemPrompt: r4(["You are a helpful AI assistant tasked with summarizing conversations."]),
      thinkingConfig: { type: "disabled" }, tools: z ? [] : D, signal: K.abortController.signal,
      options: {
        ...
        model: K.options.mainLoopModel,         // ← THE MODEL CHOICE
        ...
        maxOutputTokensOverride: Math.min(h_$, e7H(K.options.mainLoopModel)),
        querySource: "compact",
        ...
        enablePromptCaching: !1,                // streaming path doesn't share cache
        promptTooLongIsHandled: !0,
      }
    })[Symbol.asyncIterator]();
    // ... stream consumption ...
  } finally { /* cleanup */ }
}

// READABLE (for understanding):
async function summarizeCallWithCachePrefix({ messages, summaryRequest, appState, context, preCompactTokenCount, cacheSafeParams, stripNonEssential = false }) {
  const cacheSharingEnabled = !stripNonEssential && getFeatureValue("tengu_compact_cache_prefix", true);

  // ... keep-alive interval setup for long compact calls (30s heartbeat) ...

  try {
    // PATH 1: forked-agent cache-sharing path (default for warm cache)
    if (cacheSharingEnabled) {
      try {
        const result = await runForkedAgent({
          promptMessages: [summaryRequest],
          cacheSafeParams,                          // contains the SAME cache-key params as the parent (system, tools, model)
          canUseTool: denyToolUseDuringCompact(),
          querySource: "compact",
          forkLabel: "compact",
          maxTurns: 1,
          maxOutputTokens: Math.min(COMPACT_MAX_OUTPUT_TOKENS, getMaxOutputTokensForModel(context.options.mainLoopModel)),
          skipCacheWrite: true,                     // don't write a new cache prefix from compact's output
          skipTranscript: true,
          overrides: { abortController: context.abortController },
        });
        // ... extract assistant message, log telemetry ...
        if (gotUsableSummary) return assistantMessage;
        // otherwise fall through to streaming
      } catch (forkError) {
        // logs and falls through
      }
    }

    // PATH 2: streaming fallback (cache-sharing disabled, or fork failed, or stripNonEssential path)
    const useToolSearch = !stripNonEssential && await isToolSearchEnabled(
      context.options.mainLoopModel,
      context.options.tools,
      () => appState.toolPermissionContext,
      context.options.agentDefinitions.activeAgents,
      "compact"
    );
    const tools = useToolSearch
      ? uniqBy([FileReadTool, ToolSearchTool, ...context.options.tools.filter(t => t.isMcp)], "name")
      : [FileReadTool];

    const streamingGen = queryModelWithStreaming({
      messages: normalizeMessagesForAPI(
        stripImagesFromMessages(stripReinjectedAttachments([...getMessagesAfterCompactBoundary(messages), summaryRequest])),
        stripNonEssential ? [] : context.options.tools
      ),
      systemPrompt: asSystemPrompt(["You are a helpful AI assistant tasked with summarizing conversations."]),
      thinkingConfig: { type: "disabled" },
      tools: stripNonEssential ? [] : tools,
      signal: context.abortController.signal,
      options: {
        async getToolPermissionContext() { return context.getAppState().toolPermissionContext; },
        model: context.options.mainLoopModel,           // ← THE MODEL CHOICE
        toolChoice: undefined,
        isNonInteractiveSession: context.options.isNonInteractiveSession,
        hasAppendSystemPrompt: !!context.options.appendSystemPrompt,
        maxOutputTokensOverride: Math.min(COMPACT_MAX_OUTPUT_TOKENS, getMaxOutputTokensForModel(context.options.mainLoopModel)),
        querySource: "compact",
        agents: context.options.agentDefinitions.activeAgents,
        mcpTools: [],
        effortValue: context.getEffortValue(),
        enablePromptCaching: false,                     // streaming path uses fresh cache prefix
        promptTooLongIsHandled: true,                   // PTL retry is owned by caller
      }
    })[Symbol.asyncIterator]();
    // ... drain stream, return last assistant message ...
  } finally { /* cleanup */ }
}

// Mapping: zH4→summarizeCallWithCachePrefix, JV→runForkedAgent, NiH→queryModelWithStreaming,
//          h_$→COMPACT_MAX_OUTPUT_TOKENS, e7H→getMaxOutputTokensForModel,
//          Mj6→denyToolUseDuringCompact, $Y→FileReadTool, wL$→ToolSearchTool
```

The crucial reads on both paths:
- `K.options.mainLoopModel` — the model identifier (e.g. `claude-opus-4-7-20251015`) the user picked for the session
- `getMaxOutputTokensForModel(K.options.mainLoopModel)` — the model's max-output ceiling, used to clamp output budget

There is **no fallback model**. If the main loop is running `claude-opus-4-7`, compaction runs `claude-opus-4-7`. If the main loop is `claude-sonnet-4-6`, compaction runs `claude-sonnet-4-6`. Even for a Haiku-pinned session (`/model haiku`), compaction stays on Haiku.

---

## 2. Algorithm: Why Same-Model Beats Smaller-Model-Fallback

**What it does:** Always uses the main-loop model for compaction summaries, even though a smaller cheaper model could produce a reasonable summary.

**How it works:**

1. The conversation prefix (system prompt + tools + first N messages) is already cached on the provider's side. Cache TTL is 5 minutes by default (1 hour on the long-cache opt-in).
2. Cache hits are *exactly* model-equivalent — the cache key is `(model, system_prompt, tools, messages[:cache_breakpoint])`. Change *any* of those four and the cache misses.
3. The summarize call uses `runForkedAgent` (`JV`), which is engineered to send the **same** four cache-key inputs as the parent thread, only with a new user message appended (the summarize prompt).
4. If the model were a smaller one (e.g. Haiku for compaction on an Opus 4.7 session), the cache key would change and the *entire* conversation prefix would have to be re-tokenized + re-cached server-side. On a 187k-token compaction input, that's the difference between 187k×$0.30/Mtok (~$0.056) and 187k×$3.00/Mtok (~$0.56), or 10× per compaction event.

**Why this approach:**

The fork path is the *default*, gated by GrowthBook flag `tengu_compact_cache_prefix` (default `true`). A January 2026 experiment confirmed:
- **Fork-on (cache reuse):** 98% cache hit, ~0.04% of fleet cache_creation tokens
- **Fork-off (independent compact call):** 98% cache *miss*, ~0.76% of fleet cache_creation tokens
- The 0.76% concentrates in CCR/GHA/SDK ephemeral environments with cold caches (where neither path can help) and 3P providers where GrowthBook is disabled

The forked-agent path also requires **maxOutputTokens not to be set** in the request, or it would invalidate the cache. The fork respects this by passing `maxOutputTokens` as a *separate* argument that doesn't enter the cache key, where `runForkedAgent` translates it internally to a `thinking_budget` consistent with the parent's thinking config. The streaming-fallback path sets `maxOutputTokensOverride` directly because it doesn't share the cache.

**Trade-offs:**
- Smaller models would produce *shorter* summaries faster, but the cost saving from smaller-model inference (typically 70–90% cheaper per output token) is dwarfed by the cost of *cache miss on the input* on warm-cache turns.
- A separate-model path would also have to ship `Haiku` (or smaller) credentials/quotas as part of the session capabilities, complicating Bedrock/Vertex routing.

**Key insight:** Compaction cost is dominated by *input* tokens (the entire conversation has to be summarized), not output tokens (~17k average). The same-model rule keeps inputs cache-cheap; output cost is a rounding error either way.

---

## 3. Output Token Budget Reservation

The compact API call's output is bounded by `COMPACT_MAX_OUTPUT_TOKENS` = 20,000, clamped further by the model's max-output ceiling. Two consumers read this:

- **Threshold math:** `getEffectiveContextWindow` subtracts 20k from the model's context window so the threshold leaves room for the compact response to *write* its summary on its way through the same window.
- **Per-call budget:** `summarizeCallWithCachePrefix` clamps `maxOutputTokens` to `min(20k, model_max_output)` when invoking the summarize call.

```javascript
// ============================================
// getModelOutputTokenLimits - Per-model output ceilings (default + upper limit)
// Location: cli_inner_pretty.js:128629-128653
// ============================================

// ORIGINAL (for source lookup):
function IYH(H) {
  let $, q, K = k7(H);
  if (K === "claude-opus-4-7") (($ = 64000), (q = 128000));
  else if (K === "claude-sonnet-4-6") (($ = 32000), (q = 128000));
  else if (K === "claude-opus-4-6") (($ = 64000), (q = 128000));
  else if (K === "claude-opus-4-5" || K === "claude-sonnet-4-0" || K === "claude-sonnet-4-5" || K === "claude-haiku-4-5") (($ = 32000), (q = 64000));
  else if (K === "claude-opus-4-1" || K === "claude-opus-4-0") (($ = 32000), (q = 32000));
  else if (K === "claude-3-opus") (($ = 4096), (q = 4096));
  else if (K === "claude-3-sonnet") (($ = 8192), (q = 8192));
  else if (K === "claude-3-haiku") (($ = 4096), (q = 4096));
  else if (K === "claude-3-5-sonnet" || K === "claude-3-5-haiku") (($ = 8192), (q = 8192));
  else if (K === "claude-3-7-sonnet") (($ = 32000), (q = 64000));
  else (($ = yV1), (q = hV1));
  let _ = gMK(H);
  if (_?.max_tokens && _.max_tokens >= 4096) ((q = _.max_tokens), ($ = Math.min($, q)));
  return { default: $, upperLimit: q };
}

// READABLE (for understanding):
function getModelOutputTokenLimits(model) {
  const normalized = normalizeModelId(model);
  let defaultBudget, upperLimit;
  switch (normalized) {
    case "claude-opus-4-7":  defaultBudget = 64_000; upperLimit = 128_000; break;
    case "claude-sonnet-4-6": defaultBudget = 32_000; upperLimit = 128_000; break;
    case "claude-opus-4-6":  defaultBudget = 64_000; upperLimit = 128_000; break;
    case "claude-opus-4-5":
    case "claude-sonnet-4-0":
    case "claude-sonnet-4-5":
    case "claude-haiku-4-5":  defaultBudget = 32_000; upperLimit = 64_000; break;
    case "claude-opus-4-1":
    case "claude-opus-4-0":   defaultBudget = 32_000; upperLimit = 32_000; break;
    case "claude-3-opus":     defaultBudget = 4_096;  upperLimit = 4_096; break;
    case "claude-3-sonnet":   defaultBudget = 8_192;  upperLimit = 8_192; break;
    case "claude-3-haiku":    defaultBudget = 4_096;  upperLimit = 4_096; break;
    case "claude-3-5-sonnet":
    case "claude-3-5-haiku":  defaultBudget = 8_192;  upperLimit = 8_192; break;
    case "claude-3-7-sonnet": defaultBudget = 32_000; upperLimit = 64_000; break;
    default:                  defaultBudget = LEGACY_DEFAULT_TOKENS; upperLimit = LEGACY_MAX_TOKENS;
  }
  // output_config override from CLAUDE_CODE_EXTRA_BODY can raise the ceiling
  const extraBody = getExtraBodyOutputConfig(model);
  if (extraBody?.max_tokens && extraBody.max_tokens >= 4096) {
    upperLimit = extraBody.max_tokens;
    defaultBudget = Math.min(defaultBudget, upperLimit);
  }
  return { default: defaultBudget, upperLimit };
}

// Mapping: IYH→getModelOutputTokenLimits, k7→normalizeModelId, gMK→getExtraBodyOutputConfig
```

The compact call uses `getMaxOutputTokensForModel` (`e7H`) which returns `upperLimit - 1` from this map. The compact-specific clamp ensures:

```
maxOutputTokens = min(20000, upperLimit - 1)
```

So:
- Opus 4.7: `min(20000, 127999)` = 20000 (clamped down by compact budget)
- Sonnet 4.5: `min(20000, 63999)` = 20000 (still clamped by compact budget)
- 3.5 Sonnet: `min(20000, 8191)` = 8191 (clamped by *model* budget — older models can't produce big summaries)

**Why 20,000 specifically:** Production telemetry on compact summary output sized at p99.99 measured 17,387 tokens. The 20k reservation gives ~15% headroom over the 1-in-10,000 worst case. Going lower would truncate rare-but-real summaries; going higher would waste threshold room.

**The `output_config.max_tokens` override path:** `gMK(H)` reads the `CLAUDE_CODE_EXTRA_BODY` env variable's `output_config.max_tokens` — used by users with Bedrock/Vertex deployments that have custom inference profiles allowing different max-output. This override is *only* honored when it's ≥4096; anything lower is treated as a sign the user accidentally pasted a wrong value and is ignored.

---

## 4. Provider Routing — Bedrock, Vertex, Foundry, Gateway

The `runForkedAgent` and `queryModelWithStreaming` calls don't reach Anthropic directly — they go through the model resolver, which decides which *backend* the model identifier maps to.

The provider is chosen at session start (from env vars `ANTHROPIC_API_KEY` / `CLAUDE_CODE_USE_BEDROCK` / `CLAUDE_CODE_USE_VERTEX` / `CLAUDE_CODE_USE_FOUNDRY` / `ANTHROPIC_BASE_URL`), not per call. The compaction call inherits the parent session's provider via `cacheSafeParams.toolUseContext.options`. Each provider has its own model-ID mapping that's looked up at request build time:

| Provider | Opus 4.7 model ID | Haiku 4.5 model ID |
|----------|--------------------|---------------------|
| First-party | `claude-opus-4-7-20251015` | `claude-haiku-4-5-20251001` |
| Bedrock | `us.anthropic.claude-opus-4-7-20251015-v1:0` | `us.anthropic.claude-haiku-4-5-20251001-v1:0` |
| Vertex | `claude-opus-4-7@20251015` | `claude-haiku-4-5@20251001` |
| Foundry | `claude-opus-4-7` | `claude-haiku-4-5` |

The compact call sees only `K.options.mainLoopModel` — that's a normalized identifier like `claude-opus-4-7`. Per-provider expansion happens in `getModelInfoByApi`, downstream of the compact pipeline. So compaction is provider-agnostic: it works on any deployment that exposes the same model under whatever local ID convention.

**Why `output_config` matters in this story:**

The `CLAUDE_CODE_EXTRA_BODY` env var lets enterprise users tunnel custom request-body fields through every API call. The `output_config.max_tokens` field there is *the* mechanism for raising the compaction output ceiling above 20k — for instance, a custom Bedrock inference profile with `max_tokens: 30000` extends the compact summary cap to 30k.

`output_config.effort`, by contrast, is **not** applied to compaction calls. The compact call's `options.effortValue` reads `K.getEffortValue()`, which is the session's current effort level — but `effortValue` only affects models that support effort (Opus 4.7, Sonnet 4.6). For 3P providers that don't support effort, the session's effortValue is silently ignored at the request layer (this was the bug fix in 2.1.114: "Fixed `CLAUDE_CODE_EXTRA_BODY` `output_config.effort` causing 400 errors on subagent calls to models that don't support effort and on Vertex AI").

---

## 5. The System Prompt — Static, Provider-Independent

Both paths (fork and streaming) use the exact same system prompt for the compact call:

```
You are a helpful AI assistant tasked with summarizing conversations.
```

`r4(["..."])` (`asSystemPrompt`) wraps the array into the SDK's typed `SystemMessage` shape. The fork path passes it via `cacheSafeParams` inheritance — meaning the fork actually reuses the **parent thread's full system prompt** verbatim (not this one-liner) so the cache key matches. The streaming-path fallback uses this short single-line prompt instead because:

- The fallback path explicitly sets `enablePromptCaching: false`, so cache-key match is irrelevant.
- A shorter system prompt means more of the conversation history can fit in the request body before hitting the window.
- The detailed how-to-summarize instructions live in the *user message* (`compactPrompt` / `bq8`), not the system prompt.

The fork path's cache reuse depends on the *parent's* system prompt being identical at fork time. If the user just ran `/model` or changed `/effort` immediately before `/compact`, the parent's system prompt may have shifted — `runForkedAgent` either gets a cache miss (and the system catches it as a `tengu_compact_cache_sharing_fallback` event) or it falls back to streaming.

---

## 6. Subagent Summary Model (claude_code.summary OTel events)

Subagents have a *different* summarization path. Long-running subagents emit `claude_code.summary` OTel events every 30 seconds while they work, plus a final summary when they finish. These summaries are *not* the same as compaction summaries — they exist to keep the parent session aware of subagent progress, and they're produced by:

```javascript
// (referenced — function signature reconstructed)
async function subagentProgressSummary(subagentMessages, parentContext) {
  // Build a prompt asking the LLM to describe progress since last summary
  const prompt = buildSubagentSummaryPrompt(subagentMessages, lastSummaryMarker);
  // Call the parent's main-loop model — same logic as compaction
  const result = await queryModelWithStreaming({
    messages: prompt,
    systemPrompt: asSystemPrompt(["You are summarizing subagent progress for the parent agent."]),
    options: { model: parentContext.options.mainLoopModel, /* ... */ },
    /* ... */
  });
  // Publish to parent's subagent summary store
  publishSubagentSummary(parentContext.agentId, subagentId, result);
}
```

The model used is *still the parent's main-loop model* — same reasoning as compaction (cache reuse). The subagent summaries are short (~500 tokens output budget vs 20k for compaction), and they fire on a fixed 30-second timer (`AGENT_SUMMARY_INTERVAL_MS` = 30_000).

**Note on `claude_code.summary` OTel events:** The bundle emits these events with attributes including `subagentId`, `parentAgentId`, `summaryText`, `tokens`, and `model` (set to the parent's main-loop model, *not* a separate summary model). External observability platforms can use the `model` attribute to disambiguate which model generated which summary.

---

## 7. Cold-Start Subagent Compaction

When a subagent itself triggers compaction (long-running agent fills its own context), the subagent's `compactConversation` call reads `context.options.mainLoopModel` — but for a subagent, this is the *subagent's own* model resolution, not the parent's. The chain is:

1. Subagent spawn: `kwH(agentDefinition.model, parentMainLoopModel, override, permissionMode)` resolves which model the subagent should run
2. Subagent's `context.options.mainLoopModel` = result of step 1
3. Compaction inside the subagent: uses step 2's value

So a subagent running on Haiku 4.5 (e.g. `Explore`-type agents that pin to fast models) will use Haiku 4.5 for its own compaction. The cache-prefix reuse logic still applies — the subagent's compact call reuses its own conversation prefix.

**Edge case:** When the subagent and parent use *different* models, the fork-agent cache reuse path won't help across the boundary (cache keys are model-specific). The subagent's compaction is entirely self-contained.

---

## 8. The `enablePromptCaching: false` on Streaming Fallback

Look closely at the streaming-fallback path's options:

```javascript
options: {
  ...
  enablePromptCaching: !1,  // false
  promptTooLongIsHandled: !0,  // true
}
```

Both flags reverse the defaults:

- `enablePromptCaching: false`: The streaming fallback doesn't try to *write* a cache prefix from the compact response. The output of compaction (the summary itself) is added back to the conversation as a `UserMessage` *outside* of the compact call's API exchange, so caching it server-side is wasted work.
- `promptTooLongIsHandled: true`: Tells `queryModelWithStreaming` that the caller will catch a `prompt_too_long` response and retry. Without this flag, the streaming engine would itself attempt reactive retry, which would loop (compaction calling compaction).

`runForkedAgent` doesn't have these knobs because the fork path uses `skipCacheWrite: true` directly — and the fork's "retry on PTL" is owned by `compactConversation`'s `truncateHeadForPTLRetry` loop (the head-truncation retry in `qrH`/`compactConversation`).

---

## 9. Summary Truth Table

| Compaction trigger | Model used | Cache path |
|---------------------|------------|------------|
| Proactive autocompact (`Fo7` → `qrH`) | `K.options.mainLoopModel` | Fork (`JV`) → streaming fallback |
| Reactive compact (`Y97` → `Ej6` → `uq8`) | `K.options.mainLoopModel` | Fork (`JV`) only — no streaming fallback (`uq8` doesn't expose one) |
| User `/compact` (slash) | `K.options.mainLoopModel` | Fork (`JV`) → streaming fallback |
| Partial compact (`_H4`, `/rewind` "Summarize from/up to") | `K.options.mainLoopModel` | Fork (`JV`) → streaming fallback |
| Subagent self-compaction | Subagent's resolved model | Fork (`JV`) → streaming fallback |
| `claude_code.summary` subagent progress | Parent's main-loop model | Streaming path only (no fork) |

**Key insight:** There is exactly one model-selection rule in the compact subsystem — *use the same model as the caller*. The cache-prefix savings make this the cost-optimal choice in the common case, and the lack of a fallback model means there's no quality regression on any provider.
