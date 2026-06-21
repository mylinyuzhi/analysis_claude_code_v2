# Fallback-Model Chain in Compaction Summarization (v2.1.156 → v2.1.183)

> **Delta tree.** This document analyzes the **headline 2.1.178 delta** to the compaction subsystem. Every citation below is `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle
> (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`) **unless explicitly labelled** as a v2.1.156 or v2.1.88 before-picture citation.
> The unchanged carryover (the full 16-phase pipeline `compactConversation`, the cache-sharing forked fast path, the PTL retry loop, the strip pipeline, summary validation) is **linked**, not re-derived — see the v2.1.156 baseline
> [`compaction_pipeline.md`](../../../claude_code_v_2.1.156/analyze/07_compact/compaction_pipeline.md).

---

## 0. TL;DR

In v2.1.156 the compaction **summarize LLM call** — `streamCompactSummary` (`_X4`, v2.1.156 `cli_inner_pretty.js:423539`) — was a **single-pass stream** against one hardcoded model (`model: K.options.mainLoopModel`, v2.1.156 `:423637`). It had **no concept of a fallback model**: there was no `fallbackModel` in its request `options`, no outer retry loop, and on a streaming failure it threw `Error(NH$)` directly (v2.1.156 `:423678`). If the main-loop model was overloaded or policy-blocked, compaction simply failed.

v2.1.183 renames this function to `del` (`cli_inner_pretty.js:461088`) and wraps the streaming body in a **`while(!0)` fallback-model chain loop** (`:461192`). The loop:

1. **Builds a chain** from the user's `--fallback-model` flag / `fallbackModel` setting via `ICn` (`:461078`): `y = [primaryModel, ...fallbacks]` (`:461189-461190`).
2. **Threads the next link forward** into the request — `model: y[_]` (`:461208`) and `fallbackModel: y[_+1]` (`:461209`) — so the underlying API layer knows which model to fall to.
3. **Catches the model-fallback error class** `vF` (`FallbackTriggeredError`, defined `:460488`) raised by the request layer, advances the cursor `_++`, and `continue`s onto the next chain link (`:461264-461281`).
4. **Emits `tengu_model_fallback_triggered` with `query_source:"compact"`** (`:461266-461275`) — a telemetry source that did **not** exist in v2.1.156 (where that event was only emitted from the main-loop query path).
5. **Surfaces a clean error** when a model is hard-blocked by policy: `throw new FW("<model> is currently unavailable.")` (`:461283-461284`).

The **cache-prefix forked fast path** (`Xk` fork) was *also* made fallback-aware: it now passes `fallbackModel: ICn(r.options.mainLoopModel, r.options.fallbackModel)` (`:461118`).

**Net effect:** an overloaded or blocked primary model no longer kills compaction; the summarizer walks down the same `--fallback-model` chain the main loop uses (up to three entries, capped by `xJu=3` at `:149276`/`:149325`), and only fails if the entire chain is exhausted.

**Confidence: high.** The delta is unambiguous in source — verified by reading both bundles at the cited lines, plus a `grep -c "fallbackModel"` over the v2.1.156 `_X4` body returning 0.

---

## 1. The before-picture: v2.1.156 single-pass `streamCompactSummary` (`_X4`)

### What it does

`streamCompactSummary` (`_X4`) is the function that actually asks an LLM to write the conversation summary. It has two paths:

1. A **cache-sharing forked fast path** (when `tengu_compact_cache_prefix` is on) that runs a forked agent (`runForkedAgent`) reusing the main thread's warm prompt prefix, denying all tools.
2. A **streaming fallback** that drives a fresh `query()` stream and collects assistant messages.

This shape is unchanged in v2.1.183 (see §3). What changed is **the model selection around the streaming call.** The baseline deep-dive lives at
[`compaction_pipeline.md` §"streamCompactSummary"](../../../claude_code_v_2.1.156/analyze/07_compact/compaction_pipeline.md) (the dual-version block at v2.1.156 doc line ~344) — read it for the full single-pass anatomy; this doc only contrasts the model-selection delta.

### How it works (the streaming half — v2.1.156)

```javascript
// ============================================
// streamCompactSummary (v2.1.156 BEFORE) - single-pass summarize: one hardcoded model, throw on failure
// Location: cli_inner_pretty.js:423613-423679  (v2.1.156 BEFORE-PICTURE, bundle 2.1.156)
// ============================================

// ORIGINAL (for source lookup):  [v2.1.156 bundle]
    let M = !1,
      j = [];
    Y?.({ type: "response_length", op: "reset" });
    let D = !A && (await Dv$(K.options.mainLoopModel, K.options.tools, async () => q.toolPermissionContext,
          K.options.agentDefinitions.activeAgents, "compact")) ? TX([eY, wV$, ...K.options.tools.filter((V) => V.isMcp)], "name") : [eY],
      J = [...nf(H), $],
      X = wN6(A ? db_(J) : J),
      L = A ? cb_(X) : X,
      Z = neH({
        messages: D0(L, A ? [] : K.options.tools),
        systemPrompt: Z9(["You are a helpful AI assistant tasked with summarizing conversations."]),
        thinkingConfig: { type: "disabled" },
        tools: A ? [] : D, signal: K.abortController.signal,
        options: {
          async getToolPermissionContext() { return K.getAppState().toolPermissionContext; },
          model: K.options.mainLoopModel,            // <-- hardcoded; NO fallbackModel
          toolChoice: void 0,
          isNonInteractiveSession: K.options.isNonInteractiveSession,
          hasAppendSystemPrompt: !!K.options.appendSystemPrompt,
          maxOutputTokensOverride: Math.min(NO$, E5H(K.options.mainLoopModel)),
          querySource: "compact", agents: K.options.agentDefinitions.activeAgents,
          mcpTools: [], effortValue: k3(K), enablePromptCaching: !1, promptTooLongIsHandled: !0,
        },
      })[Symbol.asyncIterator](),
      W = await Z.next();
    while (!W.done) { /* pump stream, collect assistant messages into j */ ... W = await Z.next(); }
    let G = j.at(-1);
    if (G) return G.isApiErrorMessage ? G : (IA8(j) ?? G);
    if (K.abortController.signal.aborted) throw Error(GC);
    throw ( N(`Compact streaming failed. ...`, { level: "error" }),
            d("tengu_compact_failed", { reason: "no_streaming_response", ... }),
            Error(NH$) );                            // <-- throw on failure; NO retry, NO model chain

// READABLE (for understanding):  [v2.1.156 semantics]
    let hasStartedStreaming = false, assistantMessages = [];
    onResponseLength?.({ type: "response_length", op: "reset" });
    // resolve the (deny-only) tool set for compaction, strip/truncate the message payload
    let toolSet = computeCompactToolSet(...);
    let promptMessages = [...normalizeMessages(messages), summaryRequest];
    let stripped = stripImages(stripNonEssential ? dropQueuedAttachments(promptMessages) : promptMessages);
    let finalMessages = stripNonEssential ? truncateToolPayloads(stripped) : stripped;
    let stream = query({
      messages: clampToolUses(finalMessages, stripNonEssential ? [] : context.options.tools),
      systemPrompt: buildSystemPrompt(["You are a helpful AI assistant tasked with summarizing conversations."]),
      thinkingConfig: { type: "disabled" },              // ALWAYS disabled in v2.1.156
      tools: stripNonEssential ? [] : toolSet,
      signal: context.abortController.signal,
      options: {
        getToolPermissionContext: async () => context.getAppState().toolPermissionContext,
        model: context.options.mainLoopModel,            // ONE model, no fallback
        // ... no fallbackModel key at all ...
        maxOutputTokensOverride: Math.min(COMPACT_MAX_OUTPUT_TOKENS, getMaxOutputTokensForModel(context.options.mainLoopModel)),
        querySource: "compact", enablePromptCaching: false, promptTooLongIsHandled: true,
      },
    })[Symbol.asyncIterator]();
    let cur = await stream.next();
    while (!cur.done) { /* mark "responding", count response length, collect assistant turns */ cur = await stream.next(); }
    let last = assistantMessages.at(-1);
    if (last) return last.isApiErrorMessage ? last : (findSummaryAssistantMessage(assistantMessages) ?? last);
    if (context.abortController.signal.aborted) throw Error(ERROR_USER_ABORT);
    throw Error(ERROR_COMPACTION_INTERRUPTED);          // single failure mode, no fallback attempt

// Mapping: model→K.options.mainLoopModel (hardcoded), NO fallbackModel, NH$→ERROR_COMPACTION_INTERRUPTED,
//          GC→ERROR_USER_ABORT, neH→query, NO$→COMPACT_MAX_OUTPUT_TOKENS, E5H→getMaxOutputTokensForModel
```

### Why it failed-hard (the bug this delta fixes)

If `mainLoopModel` was overloaded (HTTP 529) or blocked by an org's model policy, the v2.1.156 stream surfaced an API-error assistant message (returned at `:423668` as `G.isApiErrorMessage ? G`) or threw `Error(NH$)`. The whole compaction would then either record a degraded summary or abort. Even though the user might have configured `--fallback-model` (the up-to-three fallback chain that the *main loop* honors), the **compaction path simply ignored it** — `model` was pinned to `mainLoopModel` and no `fallbackModel` was threaded into the request, so the request layer never had a model to fall to.

### Before-picture grep proof (v2.1.156 bundle)

- `_X4` body is `cli_inner_pretty.js:423539-423682` (v2.1.156). `sed -n '423539,423682p' | grep -c "fallbackModel"` → **0**.
- Same range, `grep -c "while (!0)"` → **0** (the only loop is the inner stream pump `while (!W.done)` at v2.1.156 `:423651`).
- `tengu_model_fallback_triggered` exists in v2.1.156 at `:143197` and `:451640`, but reading the 6 lines after each shows **no `query_source` / no `compact`** — the compaction path never emitted it.
- `NH$ = "Compaction interrupted · This may be due to network issues — please try again."` at v2.1.156 `:423811` (the same string that becomes `dpt` at v2.1.183 `:461419`).

---

## 2. The after-picture: v2.1.183 fallback-chain loop in `del`

### 2.1 The chain builder `ICn`

**What it does:** Normalizes the user's `fallbackModel` (which may be a single string, an array, or absent) into a deduped list of fallback models, then **filters that list down to only models whose context window is *not larger* than the primary's.** This is the single source of fallback ordering for both the cache-prefix fork and the streaming loop.

```javascript
// ============================================
// fallbackChainBuilder (ICn) - normalize+filter the --fallback-model chain for a given primary
// Location: cli_inner_pretty.js:461078-461080
// ============================================

// ORIGINAL (for source lookup):
function ICn(e, t) {
  return (Array.isArray(t) ? t : t !== void 0 ? [t] : []).filter((r) => !XHe(e, r));
}

// READABLE (for understanding):
function buildFallbackChain(primaryModel, fallbackModelConfig) {
  // 1) Coerce fallbackModelConfig into an array: array stays, single string -> [string], undefined -> []
  let candidates = Array.isArray(fallbackModelConfig)
    ? fallbackModelConfig
    : fallbackModelConfig !== undefined ? [fallbackModelConfig] : [];
  // 2) Keep only candidates whose context window is NOT LARGER than the primary's.
  //    XHe(primary, candidate) === true  ⇔  window(candidate) < window(primary).
  //    So !XHe(primary, candidate) keeps candidates with window >= primary's window... see note below.
  return candidates.filter((candidate) => !isSmallerWindow(primaryModel, candidate));
}

// Mapping: ICn→buildFallbackChain, e→primaryModel, t→fallbackModelConfig, r→candidate, XHe→isSmallerWindow
```

**The `XHe` window predicate** (`cli_inner_pretty.js:102376`):

```javascript
// ============================================
// isSmallerWindow (XHe) - true iff candidate's context window is strictly smaller than the base's
// Location: cli_inner_pretty.js:102376-102379
// ============================================

// ORIGINAL (for source lookup):
function XHe(e, t) {
  let n = Wb();
  return tH(t, n) < tH(e, n);
}

// READABLE (for understanding):
function isSmallerWindow(baseModel, candidateModel) {
  let on1mAllowed = isOneMillionContextAllowed();            // Wb()
  // tH = getContextWindowForModel (hard cap, with the NEW 1M->200k clamp branch @134105)
  return getContextWindowForModel(candidateModel, on1mAllowed)
       < getContextWindowForModel(baseModel, on1mAllowed);
}

// Mapping: XHe→isSmallerWindow, e→baseModel, t→candidateModel, Wb→isOneMillionContextAllowed, tH→getContextWindowForModel
```

> **Subtle but important.** `ICn`'s filter `!XHe(e, r)` keeps a fallback `r` when `window(r) >= window(e)` (i.e. the fallback's window is at least as large as the primary's). The intent: **never fall back to a model with a *smaller* context window than the one we're already compacting against**, because a smaller window could fail `prompt_too_long` on the very messages we're trying to summarize. This ties the fallback chain to the new 1M-clamp machinery — `tH` here is the same `getContextWindowForModel` that gained the `if (ARr(...)) return jQ` 1M→200k clamp at `:134108` (see the sibling doc [`one_million_credits_clamp.md`](./one_million_credits_clamp.md) for that branch). So a 1M model that has been credit-clamped down to 200k is compared at its *clamped* window when deciding fallback eligibility. **Confidence: high** on the predicate's literal behavior; **medium** on the precise design intent of the `>=` direction (inferred, not commented in source).

### 2.2 The chain assembly and the `while(!0)` loop

```javascript
// ============================================
// streamCompactSummary fallback loop (del) - chain assembly + retry-on-fallback-error loop
// Location: cli_inner_pretty.js:461176-461287
// ============================================

// ORIGINAL (for source lookup):
      A = r.options.mainLoopModel,
      g = r.agentId === void 0;
    if (fnt(A, r.requestDialog)) {                               // Fable-5-only policy substitution
      let b = _Q();
      if (b === null) {
        if (g) Me("model_fable_consent", "compact_no_allowed_fallback");
        throw Error("Compaction unavailable: your model policy only allows Fable 5, which requires usage credits \xB7 /model to set it up");
      }
      if (g) Rt("model_fable_consent", "compact_substituted");
      A = b;
    }
    let h = ICn(A, r.options.fallbackModel),
      y = [A, ...h.filter((b) => b !== A)],
      _ = 0;
    while (!0) {
      let b = y[_], S = !1, T = [];
      a?.({ type: "response_length", op: "reset" });
      try {
        let x = sdt({
            messages: Cx(m, i ? [] : r.options.tools),
            systemPrompt: Wc(["You are a helpful AI assistant tasked with summarizing conversations."]),
            thinkingConfig: MBn(b) ? r.options.thinkingConfig : { type: "disabled" },
            tools: i ? [] : d, signal: r.abortController.signal,
            options: {
              async getToolPermissionContext() { return r.getAppState().toolPermissionContext; },
              model: b,
              fallbackModel: y[_ + 1],
              toolChoice: void 0,
              isNonInteractiveSession: r.options.isNonInteractiveSession,
              hasAppendSystemPrompt: !!r.options.appendSystemPrompt,
              maxOutputTokensOverride: Math.min(Axt, XAe(b)),
              querySource: "compact",
              agents: r.options.agentDefinitions.activeAgents, mcpTools: [],
              agentContext: r.agentContext, stickyBetas: F0(gk()),
              effortValue: Bg(r), enablePromptCaching: !1, promptTooLongIsHandled: !0,
            },
          })[Symbol.asyncIterator](),
          I = await x.next();
        while (!I.done) { /* mark "responding"; count response length; collect assistant turns into T */ I = await x.next(); }
        let k = T.at(-1);
        if (k) return k.isApiErrorMessage ? k : (vCn(T) ?? k);
        if (r.abortController.signal.aborted) throw Error(yj);
        throw ( v(`Compact streaming failed. hasStartedStreaming=${S}`, { level: "error" }),
                G("tengu_compact_failed", { reason: Qe("no_streaming_response"), preCompactTokenCount: o, hasStartedStreaming: S, promptCacheSharingEnabled: l }),
                Error(dpt) );
      } catch (C) {
        let x = y[_ + 1];
        if (x !== void 0 && fnt(x, r.requestDialog)) {           // next link also Fable-only? re-resolve it
          let I = _Q() ?? void 0;
          if (((x = I !== void 0 && !XHe(y[0], I) ? I : void 0), x !== void 0)) y[_ + 1] = x;
        }
        if (C instanceof vF && x !== void 0) {                   // model-fallback error + a next link exists
          (Le("model_fallback"),
            G("tengu_model_fallback_triggered", {
              original_model: x_(C.originalModel),
              fallback_model: x_(x),
              chain_index: _ + 1,
              query_source: Qe("compact"),
              reason: Ne(C.reason),
              entrypoint: Qe("cli"),
              queryChainId: Nr(r.queryTracking?.chainId) ?? Qe(""),
              queryDepth: r.queryTracking?.depth ?? -1,
            }),
            v(`Compact: model fallback triggered (${C.reason}), retrying summarization on the fallback model`, { level: "warn" }),
            r.onCompactEvent?.({ type: "stream_mode", mode: "requesting" }),
            _++);
          continue;
        }
        if (C instanceof vF && C.reason === "model_blocked")
          throw new FW(`${Jd(C.originalModel)} is currently unavailable.`);
        throw C;
      }
    }

// READABLE (for understanding):
    let primaryModel = context.options.mainLoopModel;
    let isTopLevelAgent = context.agentId === undefined;

    // --- Fable-5-only policy substitution (unchanged carryover, see note) ---
    if (modelRequiresFableConsent(primaryModel, context.requestDialog)) {
      let substituted = getConsentedFableModel();
      if (substituted === null) {
        if (isTopLevelAgent) logFeatureBad("model_fable_consent", "compact_no_allowed_fallback");
        throw Error("Compaction unavailable: your model policy only allows Fable 5, which requires usage credits · /model to set it up");
      }
      if (isTopLevelAgent) logFeatureOk("model_fable_consent", "compact_substituted");
      primaryModel = substituted;
    }

    // --- Build the fallback chain: [primary, ...eligible fallbacks], dropping any dup of primary ---
    let eligibleFallbacks = buildFallbackChain(primaryModel, context.options.fallbackModel);
    let chain = [primaryModel, ...eligibleFallbacks.filter((m) => m !== primaryModel)];
    let cursor = 0;

    while (true) {
      let model = chain[cursor], hasStartedStreaming = false, assistantMessages = [];
      onResponseLength?.({ type: "response_length", op: "reset" });
      try {
        let stream = query({
          messages: clampToolUses(finalMessages, stripNonEssential ? [] : context.options.tools),
          systemPrompt: buildSystemPrompt(["You are a helpful AI assistant tasked with summarizing conversations."]),
          // NEW vs v2.1.156: thinking is conditionally enabled per clientdata gate (cedar_lagoon), not always disabled
          thinkingConfig: isThinkingEnabledForModel(model) ? context.options.thinkingConfig : { type: "disabled" },
          tools: stripNonEssential ? [] : toolSet,
          signal: context.abortController.signal,
          options: {
            getToolPermissionContext: async () => context.getAppState().toolPermissionContext,
            model: model,                       // current chain link
            fallbackModel: chain[cursor + 1],   // NEXT chain link threaded into the request layer
            maxOutputTokensOverride: Math.min(COMPACT_MAX_OUTPUT_TOKENS, getMaxOutputTokensForModel(model)),
            querySource: "compact", enablePromptCaching: false, promptTooLongIsHandled: true,
            // ... agentContext, stickyBetas, effortValue carried ...
          },
        })[Symbol.asyncIterator]();
        let cur = await stream.next();
        while (!cur.done) { /* pump stream, collect assistant turns */ cur = await stream.next(); }
        let last = assistantMessages.at(-1);
        if (last) return last.isApiErrorMessage ? last : (findSummaryAssistantMessage(assistantMessages) ?? last);
        if (context.abortController.signal.aborted) throw Error(ERROR_USER_ABORT);
        throw Error(ERROR_COMPACTION_INTERRUPTED);   // dpt
      } catch (err) {
        let nextLink = chain[cursor + 1];
        // If the NEXT link is itself Fable-only-gated, re-resolve it to a consented model (or drop it)
        if (nextLink !== undefined && modelRequiresFableConsent(nextLink, context.requestDialog)) {
          let consented = getConsentedFableModel() ?? undefined;
          nextLink = (consented !== undefined && !isSmallerWindow(chain[0], consented)) ? consented : undefined;
          if (nextLink !== undefined) chain[cursor + 1] = nextLink;
        }
        // Case A: the request layer raised FallbackTriggeredError AND we have a next link -> advance & retry
        if (err instanceof FallbackTriggeredError && nextLink !== undefined) {
          logFeatureBad("model_fallback");
          logEvent("tengu_model_fallback_triggered", {
            original_model: err.originalModel, fallback_model: nextLink,
            chain_index: cursor + 1, query_source: "compact", reason: err.reason, entrypoint: "cli",
            queryChainId: context.queryTracking?.chainId ?? "", queryDepth: context.queryTracking?.depth ?? -1,
          });
          context.onCompactEvent?.({ type: "stream_mode", mode: "requesting" });
          cursor++;
          continue;
        }
        // Case B: model hard-blocked by policy and no usable next link -> clean user-facing error
        if (err instanceof FallbackTriggeredError && err.reason === "model_blocked")
          throw new ModelUnavailableError(`${displayModelName(err.originalModel)} is currently unavailable.`);
        // Case C: any other error -> propagate (handled by the PTL retry loop / caller)
        throw err;
      }
    }

// Mapping: del→streamCompactSummary, A→primaryModel, g→isTopLevelAgent, fnt→modelRequiresFableConsent,
//   _Q→getConsentedFableModel, ICn→buildFallbackChain, h→eligibleFallbacks, y→chain, _→cursor, b→model,
//   sdt→query, Cx→clampToolUses, MBn→isThinkingEnabledForModel, Axt→COMPACT_MAX_OUTPUT_TOKENS,
//   XAe→getMaxOutputTokensForModel, x→stream, I→cur, T→assistantMessages, k→last, vCn→findSummaryAssistantMessage,
//   yj→ERROR_USER_ABORT, dpt→ERROR_COMPACTION_INTERRUPTED, C→err, vF→FallbackTriggeredError, x_→displayModelName,
//   Le→logFeatureBad, G→logEvent, Qe/Ne→telemetryString, FW→ModelUnavailableError, Jd→displayModelName(throw),
//   Rt→logFeatureOk, Me→logFeatureBad
```

### 2.3 Step-by-step walk of the loop

**Phase 0 — Fable-5 policy substitution (carryover, but now *inside* the loop's preamble).**
Before building the chain, `del` checks `fnt(primaryModel, requestDialog)` (`:461178`) — "does the model policy force Fable-5-only?". If so it substitutes a consented model via `_Q()` (`:461179`), or throws a clear "Compaction unavailable…" message if none is consented (`:461182-461184`). This existed in v2.1.156's `_X4` *before* the stream too; what's new is that the substituted model becomes the **chain head** `A`/`primaryModel`.

**Phase 1 — chain assembly (`:461189-461191`).**
`h = ICn(A, r.options.fallbackModel)` builds the eligible fallback list; `y = [A, ...h.filter(b => b !== A)]` produces the final ordered chain with the primary first and any accidental duplicate of the primary removed. `_ = 0` is the cursor.

**Phase 2 — per-link request (`:461192-461224`).**
Each iteration sets `b = y[_]` (current link) and calls `sdt({...})` — the same `query()` the v2.1.156 path used — but now with two new request keys: `model: b` (`:461208`) and `fallbackModel: y[_+1]` (`:461209`). Passing `fallbackModel` is what lets the **API request layer itself** decide to raise `vF` rather than silently degrading: the request layer (around `:590790-590840`) throws `new vF(model, fallbackModel, reason, error)` on overload (`:590806`), policy block (`:582383`, reason `"model_blocked"`), or last-resort non-retryable status (`:590838`, reason `"last_resort"`).

**Phase 3 — stream pump (`:461225-461246`).**
Identical in shape to v2.1.156: pump `x.next()`, flip `stream_mode → responding` on first text block, accumulate `response_length` deltas, collect assistant turns into `T`. On a clean finish with a last assistant message, **return immediately** (`:461246`) — the chain stops at the first model that produces a summary.

**Phase 4 — catch + advance (`:461258-461285`).**
If the stream throws:
- It first **re-resolves the next link if it too is Fable-gated** (`:461260-461262`) — re-running `_Q()` and re-checking the window with `XHe(y[0], I)` so it never advances onto a smaller-window or non-consented model.
- **Case A** (`:461264-461281`): `err instanceof vF && nextLink !== undefined` → log `model_fallback`, emit `tengu_model_fallback_triggered` with `query_source:"compact"` and `chain_index: _+1`, flip `stream_mode → requesting`, `_++`, `continue`. This is the actual fallback step.
- **Case B** (`:461283-461284`): `err instanceof vF && err.reason === "model_blocked"` → throw `new FW("<model> is currently unavailable.")`. `FW` (`cli_inner_pretty.js:461476`) is a bare `class FW extends Error {}` — a sentinel the caller's classifier `Kjp` (`:461478-461479`) recognizes (`e instanceof FW || ...`) to render a clean message rather than a stack trace.
- **Case C** (`:461285`): any other error (or `vF` with no next link) `throw C` — falls out of `del` to the PTL retry loop / dispatcher.

### 2.4 The cache-prefix forked fast path is *also* fallback-aware

The cache-sharing fork (the `Xk` forked-agent fast path, `:461111-461123`) — which runs **before** the streaming loop and short-circuits the whole thing if it produces a clean summary — now passes a fallback chain too:

```javascript
// ============================================
// del cache-prefix fork (fallback-aware) - forked-agent fast path now threads the fallback chain
// Location: cli_inner_pretty.js:461111-461123
// ============================================

// ORIGINAL (for source lookup):
        let b = await Xk({
            promptMessages: [t],
            cacheSafeParams: s,
            canUseTool: W9r(),
            querySource: "compact",
            forkLabel: "compact",
            maxTurns: 1,
            fallbackModel: ICn(r.options.mainLoopModel, r.options.fallbackModel),
            maxOutputTokens: Math.min(Axt, XAe(r.options.mainLoopModel)),
            skipCacheWrite: !0,
            skipTranscript: !0,
            overrides: { abortController: r.abortController },
          }),

// READABLE (for understanding):
        let fork = await runForkedAgent({
          promptMessages: [summaryRequest],
          cacheSafeParams,
          canUseTool: createCompactCanUseTool(),    // denies ALL tools during compaction
          querySource: "compact",
          forkLabel: "compact",
          maxTurns: 1,
          // NEW vs v2.1.156: pass the fallback chain so the fork can also fall over on overload/block
          fallbackModel: buildFallbackChain(context.options.mainLoopModel, context.options.fallbackModel),
          maxOutputTokens: Math.min(COMPACT_MAX_OUTPUT_TOKENS, getMaxOutputTokensForModel(context.options.mainLoopModel)),
          skipCacheWrite: true, skipTranscript: true,
          overrides: { abortController: context.abortController },
        });

// Mapping: Xk→runForkedAgent, W9r→createCompactCanUseTool, ICn→buildFallbackChain,
//   Axt→COMPACT_MAX_OUTPUT_TOKENS, XAe→getMaxOutputTokensForModel, t→summaryRequest, s→cacheSafeParams
```

**Why two paths get the fallback chain.** The fork path tries to reuse the warm cache prefix; the streaming path is the cold fallback. v2.1.156 had the same two-path structure, but neither path honored fallback. v2.1.183 makes **both** participate: the fork passes the *pre-built* chain to the fork runner (which itself owns the retry-on-`vF` semantics internally), while the streaming loop owns the retry explicitly via `while(!0)`. The asymmetry is because the fork runner (`runForkedAgent`/`Xk`) is a higher-level driver that already loops over `fallbackModel` internally, whereas the raw `query()` stream does not — so the streaming path has to implement the loop itself. **Confidence: high** that both pass the chain; **medium** that the fork runner internally loops (inferred from it accepting a `fallbackModel` array, not re-traced into `Xk`).

---

## 3. What is the fallback error class `vF`, and where does it come from?

`vF` is `FallbackTriggeredError`, defined at `cli_inner_pretty.js:460488-460501` inside the same lazy-init module as `del`:

```javascript
// ============================================
// FallbackTriggeredError (vF) - signals "the request layer wants to fall to the next model"
// Location: cli_inner_pretty.js:460488-460501
// ============================================

// ORIGINAL (for source lookup):
  vF = class vF extends Error {
    originalModel; fallbackModel; reason; originalError;
    constructor(e, t, n = "overloaded", r) {
      super(`Model fallback triggered: ${e} -> ${t}`);
      this.originalModel = e; this.fallbackModel = t; this.reason = n; this.originalError = r;
      this.name = "FallbackTriggeredError";
    }
  };

// READABLE (for understanding):
  FallbackTriggeredError = class FallbackTriggeredError extends Error {
    originalModel; fallbackModel; reason; originalError;
    constructor(originalModel, fallbackModel, reason = "overloaded", originalError) {
      super(`Model fallback triggered: ${originalModel} -> ${fallbackModel}`);
      this.originalModel = originalModel;     // the model that failed
      this.fallbackModel = fallbackModel;     // the model the request layer suggests next
      this.reason = reason;                   // "overloaded" | "model_blocked" | "last_resort"
      this.originalError = originalError;      // the underlying API error
      this.name = "FallbackTriggeredError";
    }
  };

// Mapping: vF→FallbackTriggeredError, e→originalModel, t→fallbackModel, n→reason, r→originalError
```

**Where it's raised.** `del` does not raise `vF` itself — it is raised inside the **API request layer** that `query()` (`sdt`) drives. The raise sites (all v2.1.183):

- `:582383` — `new vF(s.model, s.fallbackModel, "model_blocked")` — model blocked by org policy.
- `:590761` — `new vF(n.model, n.fallbackModel, k, y)` — typed reason from the 5xx classifier.
- `:590806` — `new vF(n.model, n.fallbackModel, "overloaded", y)` — repeated 529 overload, **gated on** `process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS || n.fallbackModel !== void 0 || (!Co() && (Yoe(b) || SYe(b) || EYe(b)))` (`:590793-590795`). This is the env-var tie-in: setting `FALLBACK_FOR_ALL_PRIMARY_MODELS` (NEW env var, asset-anchors §"Compact") forces the overload-fallback path even for models that aren't normally fallback-eligible.
- `:590838` — `new vF(n.model, n.fallbackModel, "last_resort", y)` — a non-retryable status with a configured fallback different from the current model.

**Key insight:** the fallback decision is **split** between two layers. The request layer (`sdt`) *detects* the failure and *names* the suggested fallback (raising `vF` with `originalModel`/`fallbackModel`/`reason`), and the `del` loop *executes* the advance (incrementing the cursor and re-driving a fresh stream on the next chain link). This is why `del` only needs to pass `fallbackModel: y[_+1]` and catch `vF` — it delegates the "should we fall?" policy to the request layer, and only owns the "which link is next?" bookkeeping. The compaction path piggybacks on the exact same fallback machinery the main loop uses, rather than re-implementing overload detection.

---

## 4. Where the chain comes from: `--fallback-model`, `fallbackModel` setting, `xJu=3`

The chain that `ICn` filters originates from the CLI/settings resolver `SAi` (`cli_inner_pretty.js:149264-149279`):

```javascript
// ============================================
// resolveFallbackModelChain (SAi) - CLI --fallback-model / settings.fallbackModel -> deduped, capped chain
// Location: cli_inner_pretty.js:149264-149279
// ============================================

// ORIGINAL (for source lookup):
function SAi(e) {
  let t = e.cli.fallbackModel?.split(",") ?? (Array.isArray(e.settings.fallbackModel) ? e.settings.fallbackModel : void 0);
  if (t === void 0) return;
  let n = new Set(), r = [];
  for (let o of t) {
    let s = typeof o === "string" ? o.trim() : "";
    if (s === "") continue;
    let i = _s(s === "default" ? Rh() : s);
    if (n.has(i)) continue;
    if (!ul(i)) continue;
    if ((n.add(i), r.push(i), r.length === xJu)) break;
  }
  return r.length > 0 ? r : void 0;
}

// READABLE (for understanding):
function resolveFallbackModelChain(config) {
  // CLI flag wins (comma-split), else the settings array
  let raw = config.cli.fallbackModel?.split(",")
    ?? (Array.isArray(config.settings.fallbackModel) ? config.settings.fallbackModel : undefined);
  if (raw === undefined) return undefined;
  let seen = new Set(), chain = [];
  for (let entry of raw) {
    let trimmed = typeof entry === "string" ? entry.trim() : "";
    if (trimmed === "") continue;
    let resolved = canonicalizeModel(trimmed === "default" ? getDefaultModel() : trimmed);
    if (seen.has(resolved)) continue;          // dedup
    if (!isKnownModel(resolved)) continue;     // drop unknown models
    seen.add(resolved); chain.push(resolved);
    if (chain.length === MAX_FALLBACK_CHAIN /* xJu = 3 */) break;   // HARD cap at 3
  }
  return chain.length > 0 ? chain : undefined;
}

// Mapping: SAi→resolveFallbackModelChain, _s→canonicalizeModel, Rh→getDefaultModel, ul→isKnownModel, xJu→MAX_FALLBACK_CHAIN(=3)
```

**The "up to three" question, resolved.** The dossier flagged (open question #5) that the 2.1.166 schema `H.array(H.string())` had no explicit max-3. The cap lives in the *resolver*, not the schema: `if (r.length === xJu) break;` with `xJu = 3` (`:149276` / `:149325`). So the schema accepts any-length array, but `SAi` truncates to the first 3 distinct known models. Precedence: **`--fallback-model` (comma-split) overrides `settings.fallbackModel`** (`:149265-149266`). The literal `"default"` resolves to the default model. **Confidence: high** (read both the cap and the precedence).

This resolved chain becomes `r.options.fallbackModel`, which `del` reads at `:461118` (fork) and `:461189` (loop) and feeds to `ICn`.

---

## 5. Telemetry delta: `tengu_model_fallback_triggered{query_source:"compact"}`

The event itself is not new (it existed in v2.1.156 at `:143197`/`:451640` for the main-loop query path), but emitting it **from the compaction path with `query_source:"compact"` is new in v2.1.183** (`:461266-461275`). Its shape:

- `original_model` / `fallback_model` — display-formatted via `x_` (`displayModelName`, `:145276`).
- `chain_index: _ + 1` — which link of the chain we're falling to (1 = first fallback).
- `query_source: "compact"` — the **new** discriminator that lets dashboards separate compaction fallbacks from main-loop fallbacks.
- `reason` — the `vF.reason` (`"overloaded"` / `"model_blocked"` / `"last_resort"`).
- `entrypoint: "cli"`, plus `queryChainId` / `queryDepth` from `context.queryTracking`.

**Before-picture:** in v2.1.156, reading the 6 lines after each `tengu_model_fallback_triggered` site shows no `query_source` and no `compact` — confirming the compaction path never emitted it. This is the observable signal that proves the feature shipped.

---

## 6. Secondary delta riding along: conditional thinking config

A small but real change inside the same loop: v2.1.156's `_X4` hardcoded `thinkingConfig: { type: "disabled" }` (v2.1.156 `:423630`). v2.1.183's `del` sets it conditionally: `thinkingConfig: MBn(b) ? r.options.thinkingConfig : { type: "disabled" }` (`:461201`).

`MBn` (`cli_inner_pretty.js:368570-368575`) is a **clientdata gate**: it reads `clientDataCache.cedar_lagoon`, and if that object marks any of the model's name-tokens as `true`, thinking is enabled for that model during the summary call. So the summarizer can now use extended thinking for specific models the server opts in via the `cedar_lagoon` clientdata blob; for everyone else it stays disabled exactly as before.

**Why it's coupled to this delta:** because thinking config must be re-evaluated *per chain link* (`MBn(b)`, where `b` is the current model), it had to move inside the loop. A model further down the fallback chain may have different thinking-eligibility than the primary. **Confidence: high** on the literal change; **medium** on intent (no comment; `cedar_lagoon` semantics not traced end-to-end).

---

## 7. What is unchanged (link, do not re-derive)

These are byte-identical (modulo rename) to v2.1.156 and are fully documented in the baseline:

- **The two-path summarize structure** (cache-prefix fork fast path → streaming fallback), the deny-all-tools `canUseTool` (`W9r`/`createCompactCanUseTool`), `maxTurns:1`, `skipCacheWrite`/`skipTranscript`, the strip/truncate pipeline (`stripNonEssential` lane), and the `tengu_compact_cache_sharing_success`/`_fallback` telemetry — all carry. → baseline [`compaction_pipeline.md`](../../../claude_code_v_2.1.156/analyze/07_compact/compaction_pipeline.md) (the `streamCompactSummary` deep-dive).
- **The caller** — the full pipeline `compactConversation` (`zut`, v2.1.183 `:460676`; v2.1.156 `_eH`) and its **PTL (prompt-too-long) HEAD-truncation retry loop** that *drives* `del`/`streamCompactSummary` — is unchanged in shape; only the model selection inside `del` changed. → baseline `compaction_pipeline.md` Phase 7.
- **The error constant** `dpt` (v2.1.183 `:461419`) is the identical string to v2.1.156 `NH$` (`:423811`) — "Compaction interrupted · …". Renamed, not changed.
- **`COMPACT_MAX_OUTPUT_TOKENS`** reserve — v2.1.156 `NO$`, v2.1.183 `Axt` (`:134193` = 20000) — unchanged value.

---

## 8. Open questions / caveats (carried from the dossier)

1. **Fork-runner internal loop (medium).** §2.4 asserts the cache-prefix fork (`Xk`/`runForkedAgent`) loops over the passed `fallbackModel` chain internally. I confirmed it *accepts* `fallbackModel: ICn(...)` (an array) at `:461118`, but did not re-trace `Xk` to prove it iterates the chain the way `del`'s explicit `while(!0)` does. The streaming loop is fully verified; the fork's internal fallback behavior is inferred from the array-typed argument.
2. **`ICn` window-filter intent (medium).** The literal predicate (`keep fallbacks with window >= primary's`) is verified; the *design rationale* (avoid falling to a smaller window that could `prompt_too_long` on the messages being summarized) is inferred, not commented in source. Note the coupling to the 1M-credits clamp: `tH` inside `XHe` is the clamped window resolver (see [`one_million_credits_clamp.md`](./one_million_credits_clamp.md)).
3. **No same-model streaming retry (low risk, resolved).** The dossier asked whether v2.1.88's removed `tengu_compact_streaming_retry` (sleep+retry on the *same* model) came back. It did **not**: the `while(!0)` in `del` is a **model-fallback** loop (advances `_++` only on `vF`), never a same-model sleep+retry. No `tengu_compact_streaming_retry` event appears in `del`. A single streaming pass per chain link, then either return or fall to the next model.
4. **`cedar_lagoon` thinking gate (medium).** The conditional `thinkingConfig` (§6) depends on a clientdata blob whose population path was not traced.
5. **`FALLBACK_FOR_ALL_PRIMARY_MODELS` (high on existence, medium on full effect).** Confirmed at the `vF`-raise gate `:590793` — when set, it forces the overload→`vF` path for any primary model. The full set of models it changes eligibility for (vs the default `Yoe`/`SYe`/`EYe` family checks) was not enumerated.

---

## Related Symbols

> Symbol mappings live in the four overview indexes and the per-feature additions file — not inline here.
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Compact module)
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (Model selection)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_183_compact.md](../00_overview/symbol_additions_v2_1_183_compact.md) — v2.1.183 compact symbol additions

Key functions in this document:

- `streamCompactSummary` (obf: `del`, cli_inner_pretty.js:461088) — the summarize LLM call; now wraps the streaming body in a `while(!0)` fallback-model chain loop.
- `buildFallbackChain` (obf: `ICn`, cli_inner_pretty.js:461078) — normalizes `fallbackModel` (string|array|undefined) into a deduped chain, filtered to fallbacks whose window is not smaller than the primary's.
- `isSmallerWindow` (obf: `XHe`, cli_inner_pretty.js:102376) — window-size comparator used by `ICn`'s filter; calls `getContextWindowForModel` (`tH`).
- `FallbackTriggeredError` (obf: `vF`, cli_inner_pretty.js:460488) — error class the request layer raises to request a model fall-over; carries `originalModel`/`fallbackModel`/`reason`.
- `ModelUnavailableError` (obf: `FW`, cli_inner_pretty.js:461476) — sentinel error thrown for `reason === "model_blocked"`; recognized by classifier `Kjp` (`:461478`).
- `resolveFallbackModelChain` (obf: `SAi`, cli_inner_pretty.js:149264) — resolves `--fallback-model`/`settings.fallbackModel` into a deduped chain capped at `xJu` (=3, `:149325`).
- `isThinkingEnabledForModel` (obf: `MBn`, cli_inner_pretty.js:368570) — clientdata (`cedar_lagoon`) gate deciding per-model thinking config inside the loop.
- `displayModelName` (obf: `x_`, cli_inner_pretty.js:145276) — model display formatter used in the fallback telemetry payload.
- v2.1.156 before-picture: `streamCompactSummary` (obf: `_X4`, v2.1.156 cli_inner_pretty.js:423539) — single-pass stream, `model: mainLoopModel` hardcoded (v2.1.156 `:423637`), `throw Error(NH$)` on failure (v2.1.156 `:423678`), no `fallbackModel`.
