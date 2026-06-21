# Module 07 — Compaction (v2.1.156 → v2.1.183 DELTA)

> **This is a DELTA module.** It documents only what changed in the compaction subsystem between v2.1.156 and v2.1.183. Every citation below is `cli_inner_pretty.js:<line>` in the **v2.1.183** bundle (`/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`) unless it is explicitly labelled a v2.1.156 / v2.1.88 before-picture citation. For the full architecture, formulas, and lane-by-lane deep dives that did **not** change, read the v2.1.156 baseline docs in [../../../claude_code_v_2.1.156/analyze/07_compact/](../../../claude_code_v_2.1.156/analyze/07_compact/) — they remain the canonical reference modulo the rename map in §3 below.

## TL;DR — the subsystem is structurally the same

The compaction subsystem in v2.1.183 is the **same five-strategy / threshold-ladder design** documented for v2.1.156. The five co-existing strategies are unchanged in shape:

1. **Proactive / full compaction** — replace the whole conversation with one summary (`compactConversation`, renamed `_eH`→`zut`).
2. **Reactive / partial compaction** — group-walk summarize the oldest groups after a "prompt too long" (PTL) rejection.
3. **Micro-compaction** — keep-recent tool-result clearing, negotiated server-side via the `context_hint` beta (beta string **unchanged**: `context-hint-2026-04-09`).
4. **/rewind partial compactor** — direction-aware summarize-from / summarize-up-to (`qX4`→`cel`).
5. The **removed** session-memory experiment — still removed (0 reconstructable matches).

The per-turn flow is also unchanged: resolve the effective context window, map it through the ordered level enum (`ok | warn | compact | blocked`), and hand off to the async-generator dispatcher (`DX4`→`Ego`) when the level reaches `compact`/`blocked`. The two circuit breakers (consecutive-failure and rapid-refill, both bounded at 3) carry over verbatim.

**Four real deltas** land between 2.1.157 and 2.1.183, plus one large pure-rename pass. The deltas are:

| # | Delta | Headline | Confidence |
|---|-------|----------|-----------|
| 1 | **`--fallback-model` honoring in the summarize call** (2.1.178) | The single-pass summarize stream is now wrapped in a model-fallback chain loop | High |
| 2 | **1M-context-without-credits auto-compact-back** (2.1.172) | A 1M session blocked on credits is clamped back to the 200k standard window and compacted under it | High |
| 3 | **Window resolver grew 4 → 6 sources** | New `clientdata` and `model-default` sources inserted into the precedence chain | High (existence); Medium (clientdata semantics) |
| 4 | **Precompute arm table + remote-reactive gate + prefix-overflow pre-check** | Three independent dispatcher/precompute additions | High |

The **line numbers shifted massively** between builds (the bundle grew from 649,979 to 699,346 lines and the compaction code moved to a different region): the whole threshold ladder moved from ~423864–424154 (v2.1.156) to **~226818–226983** (v2.1.183), and the dispatcher / full pipeline moved from ~423130–424018 to **~460676–461662**. None of that movement reflects a behavioral change — it is bundler re-layout — but it is why every obfuscated name had to be re-derived from scratch.

---

## DELTA 1 (HEADLINE, 2.1.178) — Compaction summarize now honors the `--fallback-model` chain

### What it does

The function that actually streams the summary from the model (`streamCompactSummary`, v2.1.156 `_X4` → v2.1.183 `del`, `cli_inner_pretty.js:461088`) used to be a **single hardcoded-model pass**: it issued one request with `model: mainLoopModel` and, on failure, threw immediately. In v2.1.183 the same body is wrapped in a **`while (!0)` model-fallback chain loop** that, on a model-fallback error, advances to the next link in the `--fallback-model` chain and retries the summarization on the fallback model.

### How it works (step by step)

1. **Build the chain.** Before the loop, `del` computes the ordered fallback chain from the active model `A` and the user's `--fallback-model` / `settings.fallbackModel` value:

```javascript
// ============================================
// fallbackChainBuilder - Normalize fallbackModel (string|array) into a deduped chain relative to a base model
// Location: cli_inner_pretty.js:461078-461080
// ============================================

// ORIGINAL (for source lookup):
function ICn(e, t) {
  return (Array.isArray(t) ? t : t !== void 0 ? [t] : []).filter((r) => !XHe(e, r));
}

// READABLE (for understanding):
function buildFallbackChain(baseModel, fallbackModelSetting) {
  // fallbackModelSetting may be a single string, an array (the 2.1.166 up-to-three setting), or undefined
  let candidates = Array.isArray(fallbackModelSetting)
    ? fallbackModelSetting
    : fallbackModelSetting !== void 0 ? [fallbackModelSetting] : [];
  // XHe(base, candidate) === true  ⇔  window(candidate) < window(base): drop fallbacks whose context
  // window is strictly smaller than the primary's (tH(candidate) < tH(base)) — never fall back to a
  // model with a smaller window than the one we are compacting against.
  return candidates.filter((candidate) => !isSmallerWindow(baseModel, candidate));
}

// Mapping: ICn->buildFallbackChain, e->baseModel, t->fallbackModelSetting, r->candidate, XHe->isSmallerWindow
```

> **Note on the filter vs the dedup.** `XHe` (`isSmallerWindow`, `cli_inner_pretty.js:102376`) is `function XHe(e,t){ let n=Wb(); return tH(t,n) < tH(e,n); }` — a strict-smaller-context-window comparator (`tH` = `getContextWindowForModel`), **not** a same-model check. The actual *self-reference / duplicate* removal against the primary is done separately by the `.filter((b) => b !== A)` in `y = [A, ...h.filter(b => b !== A)]` in step 2 below — `ICn`'s `XHe` filter only drops smaller-window candidates.

2. **Seed the loop array and index.** `del` then forms `y = [A, ...h.filter(b => b !== A)]` (`cli_inner_pretty.js:461190`) — the primary model first, followed by the deduped fallbacks (the `b !== A` filter is where self-references/duplicates against the primary are dropped) — and starts the index `_ = 0`:

```javascript
// ============================================
// streamCompactSummary - The summarize call, now a model-fallback chain loop (delta excerpt)
// Location: cli_inner_pretty.js:461189-461290
// ============================================

// ORIGINAL (for source lookup):
let h = ICn(A, r.options.fallbackModel),
  y = [A, ...h.filter((b) => b !== A)],
  _ = 0;
while (!0) {
  let b = y[_], S = !1, T = [];
  a?.({ type: "response_length", op: "reset" });
  try {
    let x = sdt({ /* messages, systemPrompt, tools, signal, */ options: {
        /* ... */ model: b, fallbackModel: y[_ + 1], /* ... */ querySource: "compact", /* ... */
      } })[Symbol.asyncIterator](),
      I = await x.next();
    while (!I.done) { /* pump stream: stream_mode responding, response_length add, push assistant */ I = await x.next(); }
    let k = T.at(-1);
    if (k) return k.isApiErrorMessage ? k : (vCn(T) ?? k);
    if (r.abortController.signal.aborted) throw Error(yj);
    throw (v(`Compact streaming failed. hasStartedStreaming=${S}`, { level: "error" }),
      G("tengu_compact_failed", { reason: Qe("no_streaming_response"), preCompactTokenCount: o, hasStartedStreaming: S, promptCacheSharingEnabled: l }),
      Error(dpt));
  } catch (C) {
    let x = y[_ + 1];
    if (x !== void 0 && fnt(x, r.requestDialog)) { let I = _Q() ?? void 0; if (((x = I !== void 0 && !XHe(y[0], I) ? I : void 0), x !== void 0)) y[_ + 1] = x; }
    if (C instanceof vF && x !== void 0) {
      (Le("model_fallback"),
        G("tengu_model_fallback_triggered", {
          original_model: x_(C.originalModel), fallback_model: x_(x), chain_index: _ + 1,
          query_source: Qe("compact"), reason: Ne(C.reason), entrypoint: Qe("cli"),
          queryChainId: Nr(r.queryTracking?.chainId) ?? Qe(""), queryDepth: r.queryTracking?.depth ?? -1 }),
        v(`Compact: model fallback triggered (${C.reason}), retrying summarization on the fallback model`, { level: "warn" }),
        r.onCompactEvent?.({ type: "stream_mode", mode: "requesting" }), _++);
      continue;
    }
    if (C instanceof vF && C.reason === "model_blocked")
      throw new FW(`${Jd(C.originalModel)} is currently unavailable.`);
    throw C;
  }
}

// READABLE (for understanding):
let fallbacks = buildFallbackChain(primaryModel, ctx.options.fallbackModel),
  chain = [primaryModel, ...fallbacks.filter((m) => m !== primaryModel)],  // [primary, ...fallbacks]
  i = 0;
while (true) {
  let model = chain[i], hasStartedStreaming = false, assistantTurns = [];
  onResponseLength?.({ type: "response_length", op: "reset" });
  try {
    let stream = streamQuery({
      messages: /* ... */, systemPrompt: /* "summarizing conversations" */, tools: /* ... */, signal: /* ... */,
      options: {
        /* ... */
        model,                       // the current chain link
        fallbackModel: chain[i + 1], // thread the NEXT link into the request so the API layer knows its own fallback
        querySource: "compact",
        /* ... */
      },
    })[Symbol.asyncIterator]();
    // ... pump the stream: emit stream_mode "responding", accumulate response_length, collect assistant turns ...
    let last = assistantTurns.at(-1);
    if (last) return last.isApiErrorMessage ? last : (extractSummaryMessage(assistantTurns) ?? last);
    if (ctx.abortController.signal.aborted) throw Error(ABORTED);
    throw (logCompactFailed("no_streaming_response", hasStartedStreaming), Error(NO_STREAMING_RESPONSE));
  } catch (err) {
    let next = chain[i + 1];
    // If the next link needs an interactive consent dialog, try to resolve a substitute model first:
    if (next !== void 0 && needsRequestDialog(next, ctx.requestDialog)) {
      let resolved = resolveConsentedModel() ?? void 0;
      if (((next = resolved !== void 0 && !isSmallerWindow(chain[0], resolved) ? resolved : void 0), next !== void 0))
        chain[i + 1] = next;
    }
    if (err instanceof ModelFallbackError && next !== void 0) {
      logCounter("model_fallback");
      emit("tengu_model_fallback_triggered", {
        original_model: err.originalModel, fallback_model: next, chain_index: i + 1,
        query_source: "compact", reason: err.reason, entrypoint: "cli", /* queryChainId, queryDepth */
      });
      ctx.onCompactEvent?.({ type: "stream_mode", mode: "requesting" });
      i++;                 // advance to the next chain link
      continue;            // and retry the summarization
    }
    if (err instanceof ModelFallbackError && err.reason === "model_blocked")
      throw new UserFacingError(`${displayName(err.originalModel)} is currently unavailable.`);
    throw err;             // any non-fallback error propagates as before
  }
}

// Mapping: del->streamCompactSummary, A->primaryModel, h->fallbacks, y->chain, _->i, b->model,
//   r->ctx, sdt->streamQuery, vF->ModelFallbackError, FW->UserFacingError, x_->displayId,
//   vCn->extractSummaryMessage, fnt->needsRequestDialog, _Q->resolveConsentedModel, XHe->isSmallerWindow,
//   G->emit, Le->logCounter, a->onResponseLength
```

3. **Pump the stream.** The inner `while (!I.done)` pump is byte-identical to v2.1.156: it flips `stream_mode` to `"responding"` on the first text block, accumulates `response_length`, collects assistant turns, and returns the last assistant message on success.

4. **On a model-fallback error (`vF` / `ModelFallbackError`).** If the thrown error is the model-fallback error class **and** a next link exists, `del` emits **`tengu_model_fallback_triggered` with `query_source: "compact"`** (`cli_inner_pretty.js:461266`), flips the compact event to `stream_mode: "requesting"`, increments `_`, and `continue`s — re-entering the loop on the fallback model. If the error is `vF` with `reason === "model_blocked"`, it throws a user-facing "currently unavailable" error instead. **Any other error propagates unchanged**, exactly as v2.1.156 did.

5. **The cache-prefix fork is fallback-aware too.** The shorter cache-prefix summarize fork (`Xk`, called at `cli_inner_pretty.js:461118`) now passes `fallbackModel: ICn(r.options.mainLoopModel, r.options.fallbackModel)` into its request, so the cache-sharing fast path also participates in the fallback chain (it previously had no `fallbackModel` at all).

6. **New: Fable-consent substitution.** Before the loop, `del` also handles a "model policy only allows Fable 5, which requires usage credits" case (`cli_inner_pretty.js:461180-461187`): if no allowed fallback remains it throws `Compaction unavailable: your model policy only allows Fable 5, which requires usage credits · /model to set it up`, otherwise it substitutes the consented model into `A`. This is auxiliary to DELTA 1 but is part of the same rewrite.

### Why this approach

**Before (v2.1.156, `_X4` @423527):** the summarize request hardcoded `model: K.options.mainLoopModel` (verified at v2.1.156 `cli_inner_pretty.js:423641`), carried **no** `fallbackModel` in its `options`, and the only loop was the inner stream pump `while (!W.done)`. On a streaming failure it threw `Error(NH$)` directly — no model chain, no retry. A `grep -F "fallbackModel"` over the v2.1.156 `_X4` body (423527–423660) returns **0**. The compaction path simply did not participate in fallback, even though `tengu_model_fallback_triggered` existed elsewhere in the v2.1.156 build (main-loop query path). So if your primary model was rate-limited or blocked, **compaction itself would hard-fail** — the single most disruptive moment to lose your model, because you are out of context window and cannot proceed without a summary.

The v2.1.183 design threads the **same fallback machinery the main agent loop already used** into the compaction summarize call. Reusing the `vF`/`ICn`/`tengu_model_fallback_triggered` primitives (rather than inventing a compaction-specific retry) means compaction inherits the exact same chain semantics, telemetry, and `model_blocked` handling as ordinary turns — at the cost of a structurally larger function (the whole request now lives inside a `while(!0)`). The alternative — a same-model sleep+retry — was explicitly *not* chosen here (see Open Question 3): this is a **model-fallback** loop, not a streaming retry. There is no `tengu_compact_streaming_retry` inside `del`; the loop only advances on a `vF` model-fallback error, so a transient same-model stream failure still throws on the first pass exactly as before.

### Key insight

The loop variable is the **chain index**, and `fallbackModel: y[_ + 1]` is threaded into *each* request so the API layer always knows what its own next fallback would be — but the outer loop is what actually advances the model when a `vF` is caught. The `query_source: "compact"` tag on `tengu_model_fallback_triggered` is the observability hook that lets you distinguish a compaction-time fallback from a main-loop fallback. The request-dialog branch (`fnt`/`needsRequestDialog`) is a subtlety: if the *next* link would require interactive model consent, `del` first tries to swap in an already-consented model rather than block the compaction on a UI prompt — important because compaction can run non-interactively.

> Confidence: **high.** This is the must-have delta and is unambiguous in source (both the v2.1.183 loop and the v2.1.156 single-pass before-picture were read line-by-line).

---

## DELTA 2 (2.1.172) — 1M-context-without-credits auto-compact-back under the standard limit

### What it does

When a session is running a 1M-token context window but the account lacks the usage credits required for long context, the API returns a 429 whose message contains "Extra usage is required for long context" / "Usage credits are required for long context". v2.1.183 detects this, sets a **new session flag** `longContext1mCreditsBlocked`, and from then on **clamps the model's hard context-window cap back down to the 200k standard window** (`jQ = 200000`). The threshold ladder then re-windows the session to 200k and compacts it under that smaller window — instead of leaving it permanently stuck at 1M (the v2.1.156 behavior).

### How it works (step by step)

**(a) Trip the flag on the 429.** Inside the rate-limit error mapper (`cli_inner_pretty.js:229183-229208`), the 429 branch checks the 1M-credits matcher and, the first time it sees one while the flag is still false, sets the flag and emits a one-shot event:

```javascript
// ============================================
// is1mCreditsError + trip — detect the 1M-credits 429 and latch the clamp flag
// Location: cli_inner_pretty.js:229192 (trip), 229606 (matcher)
// ============================================

// ORIGINAL (for source lookup):
if (s && Fwn(e.message) && !N8e()) (Wtr(!0), G("tengu_1m_credits_clamp_activated", {}));
// ...
function Fwn(e) {
  return (
    e.includes("Extra usage is required for long context") || e.includes("Usage credits are required for long context")
  );
}

// READABLE (for understanding):
// inside the 429 branch of the rate-limit error mapper:
if (isInteractive && is1mCreditsError(err.message) && !get1mCreditsBlocked()) {
  set1mCreditsBlocked(true);                       // latch the session flag
  emit("tengu_1m_credits_clamp_activated", {});    // NEW one-shot telemetry
}

function is1mCreditsError(message) {
  return (
    message.includes("Extra usage is required for long context") ||
    message.includes("Usage credits are required for long context")
  );
}

// Mapping: Fwn->is1mCreditsError, N8e->get1mCreditsBlocked, Wtr->set1mCreditsBlocked, G->emit, e->message
```

The flag accessors live in the session-state module: `get1mCreditsBlocked` (`N8e`, `cli_inner_pretty.js:2965`) returns `Ot.longContext1mCreditsBlocked`; `set1mCreditsBlocked` (`Wtr`, `cli_inner_pretty.js:2968`) writes it. The same 429 branch also returns a user-facing message (`cli_inner_pretty.js:229199-229207`) telling the user to enable usage credits or `/model` to switch to standard context.

**(b) Consume the flag in the hard-cap resolver.** The model context-window hard cap (`getContextWindowForModel`, v2.1.156 `Ov` → v2.1.183 `tH`, `cli_inner_pretty.js:134105`) gains a **new clamp branch**:

```javascript
// ============================================
// getContextWindowForModel + is1mClampActive — clamp a 1M model back to 200k when credits are blocked
// Location: cli_inner_pretty.js:134105-134123
// ============================================

// ORIGINAL (for source lookup):
function tH(e, t) {
  let n = Ati();
  if (n !== void 0) return n;
  if (ARr(e, t)) return jQ;        // NEW clamp branch
  return gti(e, t);
}
function ARr(e, t) {
  return N8e() && Ati() === void 0 && gti(e, t) > jQ;   // jQ = 200000
}
function gti(e, t) {
  if (by(e)) return 1e6;
  if (t?.includes(Oz.header) && Mq(e)) return 1e6;
  if (BN(e)) return 1e6;
  let n = VAn(e);
  if (n !== null) return n;
  return mxt;
}

// READABLE (for understanding):
function getContextWindowForModel(model, headers) {
  let override = getMaxContextTokensOverride();      // CLAUDE_CODE_MAX_CONTEXT_TOKENS, only when DISABLE_COMPACT
  if (override !== void 0) return override;
  if (is1mClampActive(model, headers)) return STANDARD_WINDOW;   // NEW: force 1M model down to 200k
  return rawModelWindow(model, headers);
}
function is1mClampActive(model, headers) {
  // active only when the credits flag is latched, there is no explicit override,
  // and the raw model window actually exceeds the standard window (i.e. this really is a 1M model)
  return get1mCreditsBlocked() && getMaxContextTokensOverride() === void 0 && rawModelWindow(model, headers) > STANDARD_WINDOW;
}
function rawModelWindow(model, headers) {
  if (is1mFamilyModel(model)) return 1e6;                          // [1m]-tagged / family
  if (headers?.includes(BETA_HEADER.header) && supports1m(model)) return 1e6;
  if (isExplicit1m(model)) return 1e6;
  let clientData = clientDataWindowForSonnet46(model);            // VAn: clientdata override for sonnet-4-6
  if (clientData !== null) return clientData;
  return DEFAULT_WINDOW;                                           // mxt = 200000
}

// Mapping: tH->getContextWindowForModel, ARr->is1mClampActive, gti->rawModelWindow, Ati->getMaxContextTokensOverride,
//   N8e->get1mCreditsBlocked, jQ->STANDARD_WINDOW (200000), mxt->DEFAULT_WINDOW (200000), VAn->clientDataWindowForSonnet46
```

`is1mClampActive` (`ARr`) is consumed in two places: (1) `tH` @134108 forces the hard cap to 200k, which flows through `z2`/`oee`/the threshold ladder so the session compacts under the standard window; and (2) the window resolver `z2` @226891 returns `source: "model-default"` with `configured: jQ` when it fires (see DELTA 3).

### Why this approach

**Before (v2.1.156, `Ov` @130165):** the hard cap had no `ARr` branch (verified — the v2.1.156 `Ov` body goes straight `CLAUDE_CODE_MAX_CONTEXT_TOKENS → DZ([1m]) → header+pB → Se → OH8 → P36` with no credits check). A 1M model resolves to `1e6` **unconditionally**. `grep -c longContext1mCreditsBlocked` and `grep -c tengu_1m_credits_clamp_activated` over the v2.1.156 bundle both return **0** — the entire mechanism is new in v2.1.183. So a session that started on 1M but hit the credits wall would keep resolving its window to `1e6` forever, never compacting under a window it can actually afford — the "permanently stuck" failure mode this delta fixes.

The clamp is implemented at the **window-cap layer** (`tH`) rather than at the dispatcher, which is the right altitude: every downstream consumer — the effective-window computation (`oee`), the threshold ladder (`gwn`/`mqr`/`nBi`), the warning state — all read through `tH`/`z2`, so a single clamp point re-windows the entire subsystem consistently. The flag is **latched** (one-way `false → true` per session) rather than re-checked per request, because once the account is out of long-context credits it will stay out for the session; latching avoids re-emitting the telemetry and re-prompting the user on every subsequent turn (the `!N8e()` guard in §(a) makes the event one-shot).

### Key insight

The clamp is gated on three independent conditions in `ARr`: the flag must be latched (`N8e()`), there must be **no** explicit `CLAUDE_CODE_MAX_CONTEXT_TOKENS` override (`Ati() === void 0`), and the *raw* window must genuinely exceed 200k (`gti(...) > jQ`). The middle guard is what makes an explicit user override win over the clamp; the last guard means the clamp is a no-op for models that were never 1M in the first place. Note `mxt` and `jQ` are both `200000` (`cli_inner_pretty.js:134192`) — `mxt` is the default model window and `jQ` is the named standard-window clamp target; they coincide numerically but carry different meaning.

> Confidence: **high.** Both the trip site and the consume site were read in v2.1.183; the v2.1.156 `Ov` before-picture (no clamp) and the 0-count greps were verified.

---

## DELTA 3 — Window resolver grew from 4 sources to 6 (`clientdata`, `model-default`)

### What it does

The context-window resolver (`getAutoCompactWindow`, v2.1.156 `Xl` → v2.1.183 `z2`, `cli_inner_pretty.js:226875`) returns `{window, configured, source}`. v2.1.156 had **four** sources in precedence order: `env > settings > experiment > auto`. v2.1.183 inserts **two new sources**, giving the precedence chain:

```
env  >  settings  >  clientdata  >  experiment  >  model-default  >  auto
```

### How it works (step by step)

```javascript
// ============================================
// getAutoCompactWindow - Six-source window resolver (was four)
// Location: cli_inner_pretty.js:226875-226894
// ============================================

// ORIGINAL (for source lookup):
function z2(e, t) {
  let n = Bo(e), r = Wb(), o = tH(e, r);
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    let c = yae("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, hwn, hqr);
    if (c.status !== "invalid") { let u = Math.max(hwn, c.effective); return { window: Math.min(o, u), configured: u, source: "env" }; }
  }
  if (t !== void 0) return { window: Math.min(o, t), configured: t, source: "settings" };
  let s = ywd(n);
  if (s !== null) return { window: Math.min(o, s), configured: s, source: "clientdata" };       // NEW
  let i = _qr(n);
  if (i !== void 0) return { window: Math.min(o, i), configured: i, source: "experiment" };
  if (o < 1e6 && (hwd.has(n) || ARr(e, r))) return { window: Math.min(o, jQ), configured: jQ, source: "model-default" };  // NEW
  let l = (Kw() && Object.hasOwn(rBi, n) ? rBi[n] : void 0) ?? o;
  return { window: Math.min(o, l), configured: l, source: "auto" };
}

// READABLE (for understanding):
function getAutoCompactWindow(model, settingsWindow) {
  let modelKey = normalizeModelId(model), headers = getRequestHeaders(), hardCap = getContextWindowForModel(model, headers);
  // 1. env: CLAUDE_CODE_AUTO_COMPACT_WINDOW (validated, clamped to [100k, 1M])
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    let v = validateEnvInt("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, WINDOW_MIN, WINDOW_MAX);
    if (v.status !== "invalid") { let w = Math.max(WINDOW_MIN, v.effective); return { window: Math.min(hardCap, w), configured: w, source: "env" }; }
  }
  // 2. settings: saved autoCompactWindow
  if (settingsWindow !== void 0) return { window: Math.min(hardCap, settingsWindow), configured: settingsWindow, source: "settings" };
  // 3. clientdata (NEW): server-pushed per-model window
  let cd = clientDataWindow(modelKey);
  if (cd !== null) return { window: Math.min(hardCap, cd), configured: cd, source: "clientdata" };
  // 4. experiment: Opus-4.8 redwood2 window
  let exp = opus48ExperimentWindow(modelKey);
  if (exp !== void 0) return { window: Math.min(hardCap, exp), configured: exp, source: "experiment" };
  // 5. model-default (NEW): clamp known 1M models / credits-blocked 1M back to 200k
  if (hardCap < 1e6 && (MODEL_DEFAULT_CLAMP_SET.has(modelKey) || is1mClampActive(model, headers)))
    return { window: Math.min(hardCap, STANDARD_WINDOW), configured: STANDARD_WINDOW, source: "model-default" };
  // 6. auto: inert pass-through table (rBi is {})
  let auto = (isAutoCompactEnabled() && Object.hasOwn(AUTO_WINDOW_TABLE, modelKey) ? AUTO_WINDOW_TABLE[modelKey] : void 0) ?? hardCap;
  return { window: Math.min(hardCap, auto), configured: auto, source: "auto" };
}

// Mapping: z2->getAutoCompactWindow, Bo->normalizeModelId, Wb->getRequestHeaders, tH->getContextWindowForModel,
//   yae->validateEnvInt, hwn->WINDOW_MIN (100k), hqr->WINDOW_MAX (1M), ywd->clientDataWindow, _qr->opus48ExperimentWindow,
//   hwd->MODEL_DEFAULT_CLAMP_SET, ARr->is1mClampActive, jQ->STANDARD_WINDOW (200k), rBi->AUTO_WINDOW_TABLE ({}), Kw->isAutoCompactEnabled
```

**The `clientdata` source** is resolved by `clientDataWindow` (`ywd`, `cli_inner_pretty.js:226865`): it reads `clientDataCache().rowan_thicket[modelKey]` first, then falls back to `autoCompactWindowsCache()[modelKey]`, accepting only an integer in `[hwn, hqr]` = `[100000, 1000000]`. This is a **server-pushed** per-model window — the server can advertise a model's auto-compact window without a client release.

**The `model-default` source** clamps two cases to `jQ = 200000`: (1) any model in the `hwd` Set — `{"claude-sonnet-4-6", "claude-opus-4-6"}` (`cli_inner_pretty.js:226982`); and (2) any model where `is1mClampActive` is true (the DELTA 2 credits clamp). The `o < 1e6` guard means this only fires when the hard cap was *already* clamped (the 1M branch in `tH` returned 200k), so `z2` reports the provenance consistently with `tH`.

**Downstream updates that follow from the two new sources:**
- `isConfiguredWindow` (`qCe`, `cli_inner_pretty.js:226895`) now treats `clientdata` and `model-default` as "configured" alongside `env`/`settings` (`return n === "env" || n === "settings" || n === "clientdata" || n === "model-default"`). This matters because the dispatcher's `qCe(t,n)` guard suppresses reactive routing for non-configured windows.
- The auto-window spinner hint (`autoWindowSpinnerHint`, `Jjp`, `cli_inner_pretty.js:461655`) now returns null for both `experiment` **and** `clientdata` sources (`if ((r !== "experiment" && r !== "clientdata") || o >= s) return null`) — i.e. it only shows the "Compacting at auto window" hint for genuinely auto/derived windows, not for the new server-pushed one.

### Why this approach

**Before (v2.1.156, `Xl` @423915):** exactly four returns — `env`, `settings`, `experiment`, `auto` (verified). `grep` over the v2.1.156 bundle for `source: "clientdata"`, `source: "model-default"`, and `rowan_thicket` all return **0**.

Inserting `clientdata` **above** `experiment` but **below** `settings` is a deliberate precedence choice: a user's explicit env/settings override still wins (the user is always in control), but a server-pushed window beats a static GrowthBook experiment, letting the server dynamically tune windows per-model without a client release or an experiment-flag change. Placing `model-default` **below** `experiment` but **above** `auto` means an active Opus-4.8 experiment window still wins over the 200k clamp, while the clamp still wins over the inert `auto` pass-through. Reusing the same `Math.min(hardCap, configured)` shape for all six sources keeps the resolver uniform — every source is just a different way of computing `configured`, then clamped under the model hard cap.

### Key insight

The `auto` source is still an **inert pass-through**: `rBi`/`AUTO_WINDOW_TABLE` is initialized to `{}` (`cli_inner_pretty.js:226982`), so `Object.hasOwn(rBi, n)` is always false and `auto` just returns the hard cap. The five real sources (env/settings/clientdata/experiment/model-default) are the only ones that can produce a `configured` value different from the model's own window. The two new sources are therefore not just "more options" — `clientdata` is the **dynamic** lever (server-controlled) and `model-default` is the **safety** lever (clamps known-or-blocked 1M models down), filling the two gaps the static env/settings/experiment trio left open.

> Confidence: **high** on the existence and placement of both new sources (read in `z2`); **medium** on the exact server-push semantics of `clientdata` — see Open Question 1.

---

## DELTA 4 — Precompute arm table, remote-reactive gate, and dispatcher prefix-overflow pre-check

Three independent additions, all backed by a 0-count grep in v2.1.156 plus a read declaration in v2.1.183.

### 4a. Precompute "arm table" (`tengu_amber_moleskin`)

**What it does.** v2.1.156 had only a *scalar* precompute buffer fraction from `tengu_amber_rokovoko` (default `0.2`). v2.1.183 keeps that scalar (`gqr`, `cli_inner_pretty.js:226916`) but adds a richer **table resolver** that can vary the fraction per window-size and per surface (`repl` vs `sdk`).

```javascript
// ============================================
// getPrecomputeArm - Resolve the precompute buffer fraction from the arm table, falling back to the scalar
// Location: cli_inner_pretty.js:226920-226934
// ============================================

// ORIGINAL (for source lookup):
function bqr(e, t, n) {
  let r = ct(bwd, null);
  if (r === null || r === void 0) return { fraction: gqr(), source: "scalar" };
  let o = eBi(r);
  if (o === null) return (Swd(Ne(Array.isArray(r) ? "array" : typeof r)), { fraction: gqr(), source: "malformed" });
  let s = Kw() ? t : void 0, { window: i } = z2(e, s), a = tBi(o, i);
  if (a === null) return { fraction: gqr(), source: "table_no_match" };
  let l = n === "sdk" ? "sdk" : "repl", c = a.entry[l];
  return a.kind === "exact"
    ? { fraction: c, source: "table_exact", matchedWindowKey: a.entry.windowSize }
    : { fraction: c, source: "table_default" };
}

// READABLE (for understanding):
function getPrecomputeArm(model, settingsWindow, surface) {
  let raw = featureGate(PRECOMPUTE_ARM_FLAG, null);                 // "tengu_amber_moleskin"
  if (raw === null || raw === void 0) return { fraction: getScalarPrecomputeFraction(), source: "scalar" };
  let parsed = parseArmTable(raw);                                  // {entries:[{windowSize,repl,sdk}], defaultEntry}
  if (parsed === null) {                                            // malformed payload → fire telemetry, use scalar
    emitArmTableMalformed(Array.isArray(raw) ? "array" : typeof raw);
    return { fraction: getScalarPrecomputeFraction(), source: "malformed" };
  }
  let win = getAutoCompactWindow(model, isAutoCompactEnabled() ? settingsWindow : void 0).window;
  let match = matchArmEntry(parsed, win);                           // exact windowSize match, else defaultEntry
  if (match === null) return { fraction: getScalarPrecomputeFraction(), source: "table_no_match" };
  let entry = match.entry[surface === "sdk" ? "sdk" : "repl"];      // per-surface fraction
  return match.kind === "exact"
    ? { fraction: entry, source: "table_exact", matchedWindowKey: match.entry.windowSize }
    : { fraction: entry, source: "table_default" };
}

// Mapping: bqr->getPrecomputeArm, bwd->PRECOMPUTE_ARM_FLAG, ct->featureGate, gqr->getScalarPrecomputeFraction,
//   eBi->parseArmTable, tBi->matchArmEntry, Swd->emitArmTableMalformed, z2->getAutoCompactWindow, Kw->isAutoCompactEnabled
```

The table is parsed by `eBi`/`gwd`/`JNi`/`tBi` (`cli_inner_pretty.js:226785-226816`): `JNi` validates a single fraction is a finite number in `[0, 1)`; `gwd` validates a `{repl, sdk}` entry; `eBi` walks the object keys, treating numeric keys as `windowSize` entries and a literal `"default"` key as the fallback entry; `tBi` does the exact-window-size lookup with default fallback. The resolved fraction is exposed via `Ewd` (`cli_inner_pretty.js:226935`, `return bqr(e,t,n).fraction`) which feeds `Sqr`/`getThresholdOverrides` → `precomputeBufferFraction`. On a malformed payload, `Swd` (`cli_inner_pretty.js:226912`) fires the new **`tengu_precompute_arm_table_malformed`** event (once, gated by `oBi`).

**Why.** The scalar fraction is a single knob for all sessions; the table lets the precompute lead time scale with the **window size** (a 1M-window session can afford a different precompute buffer than a 200k one) and the **surface** (an SDK caller vs an interactive REPL have different latency profiles). It degrades gracefully — null flag → scalar, malformed → scalar + telemetry, no window match → scalar — so a bad arm-table payload can never break compaction; it just falls back to the proven 0.2 default. New precompute telemetry confirms the wiring: `tengu_precomputed_compact_arm_gated` (`cli_inner_pretty.js:452899`), `tengu_precomputed_compact_rearm_capped` (`cli_inner_pretty.js:452973`), and `tengu_precompute_arm_table_malformed` — all **0** in v2.1.156 (where precompute events were only `_started`/`_failed`/`_ready`/`_consumed`/`_discarded`/`borrow_boundary_miss`).

> Confidence: **high** on the table parser + gating; **medium** on exactly how `_arm_gated`/`_rearm_capped` change the reactive precompute swap timing vs v2.1.156 — see Open Question 2.

### 4b. Remote-reactive gate (`S7`)

**What it does.** The `isLocal` predicate (v2.1.156 `_JH` → v2.1.183 `S7`, `cli_inner_pretty.js:226751`) now lets a *remote* session run reactive/proactive compaction if the `tengu_reactive_compact_remote` flag is on.

```javascript
// ============================================
// isLocal - Remote-reactive gate (was a bare CLAUDE_CODE_REMOTE check)
// Location: cli_inner_pretty.js:226751-226758
// ============================================

// ORIGINAL (for source lookup):
function S7() {
  if (st(process.env.CLAUDE_CODE_REMOTE)) {
    if (((YNi ??= ct("tengu_reactive_compact_remote", !1)), !YNi)) return !1;
  }
  return !0;
}

// READABLE (for understanding):
function isLocalOrRemoteReactiveEnabled() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_REMOTE)) {
    // memoize the gate; remote sessions only pass if the flag is on
    if (((remoteReactiveFlag ??= featureGate("tengu_reactive_compact_remote", false)), !remoteReactiveFlag))
      return false;
  }
  return true;   // local sessions always pass
}

// Mapping: S7->isLocalOrRemoteReactiveEnabled, YNi->remoteReactiveFlag, st->isEnvTruthy, ct->featureGate
```

**Before (v2.1.156, `_JH` @423988):** a bare `return !xH(process.env.CLAUDE_CODE_REMOTE)` — remote sessions could *never* run the reactive/proactive lanes gated behind it. `grep "tengu_reactive_compact_remote"` in v2.1.156 → **0**. The new flag is a server-controllable rollout switch: it lets Anthropic enable reactive compaction for remote (background/cloud) sessions independently, with the flag memoized into `YNi` on first read so it is evaluated once per process. `S7` gates the dispatcher predicate (`Xjp` @461520: `if (S7() && !uG() && !qCe(t,n)) return !1`) and the reactive-routing branch in `Ego`.

### 4c. Dispatcher prefix-overflow pre-check (`Yjp`)

**What it does.** Before attempting auto-compaction, the dispatcher now estimates the **fixed cache-prefix** token weight (documents, images, tool-results that compaction cannot remove because they precede the summary boundary) and, if that fixed prefix alone already exceeds the autocompact threshold, emits **`tengu_auto_compact_prefix_overflow`** to flag that compaction physically cannot help.

```javascript
// ============================================
// prefixOverflowCheck - Detect when the fixed cache prefix already exceeds the threshold
// Location: cli_inner_pretty.js:461484-461513
// ============================================

// ORIGINAL (for source lookup):
function Yjp(e, t, n, r = 0) {
  let o = Qtt(e);
  if (!o) return null;
  let s = o.input_tokens + o.cache_read_input_tokens + o.cache_creation_input_tokens,
    i = $T(e, ww(t)), a = Math.max(0, s - r - i), l = lMt(t, n);
  if (a <= l) return null;
  let c = 0, u = 0,
    d = (p) => { for (let f of p) { let m = f; if (m.type === "document") c++; else if (m.type === "image") u++; else if (m.type === "tool_result" && Array.isArray(m.content)) d(m.content); } };
  for (let p of e) { let f = p.message?.content; if (Array.isArray(f)) d(f); }
  return { prefixTokens: a, thresholdTokens: l, totalInputTokens: s, messagesEstimate: i, snipTokensFreed: r, documentBlockCount: c, imageBlockCount: u };
}

// READABLE (for understanding):
function prefixOverflowCheck(messages, model, settingsWindow, snipTokensFreed = 0) {
  let usage = lastApiUsage(messages);
  if (!usage) return null;
  let totalInput = usage.input_tokens + usage.cache_read_input_tokens + usage.cache_creation_input_tokens,
    messagesEstimate = estimateMessageTokens(messages, getModelTokenizer(model)),
    prefixTokens = Math.max(0, totalInput - snipTokensFreed - messagesEstimate),   // the immovable cache-prefix weight
    threshold = getAutoCompactThresholdForModel(model, settingsWindow);
  if (prefixTokens <= threshold) return null;   // prefix fits under the threshold — compaction can still help
  // count immovable document / image blocks (recursing into tool_result content)
  let documentBlockCount = 0, imageBlockCount = 0;
  let count = (blocks) => { for (let b of blocks) {
    if (b.type === "document") documentBlockCount++;
    else if (b.type === "image") imageBlockCount++;
    else if (b.type === "tool_result" && Array.isArray(b.content)) count(b.content);
  } };
  for (let m of messages) { let content = m.message?.content; if (Array.isArray(content)) count(content); }
  return { prefixTokens, thresholdTokens: threshold, totalInputTokens: totalInput, messagesEstimate, snipTokensFreed, documentBlockCount, imageBlockCount };
}

// Mapping: Yjp->prefixOverflowCheck, Qtt->lastApiUsage, $T->estimateMessageTokens, ww->getModelTokenizer,
//   lMt->getAutoCompactThresholdForModel, c->documentBlockCount, u->imageBlockCount, a->prefixTokens, r->snipTokensFreed
```

It is wired into the dispatcher right after the `Xjp` gate passes (`cli_inner_pretty.js:461537-461543`): `let u = Yjp(e, a, l, s); if (u) (... Rt("compact_auto","compact_auto_prefix_overflow"), G("tengu_auto_compact_prefix_overflow", { ...u, wouldHaveBlocked: !0 }))`. It is **diagnostic only** — it logs a warning and emits telemetry with `wouldHaveBlocked: true`, then compaction proceeds anyway. `grep "tengu_auto_compact_prefix_overflow"` in v2.1.156 → **0**.

**Why.** Compaction summarizes the *removable* message body, but a conversation can be dominated by an immovable cache prefix (large pinned documents/images, tool-result blobs that sit before the summary boundary). When the prefix alone exceeds the threshold, compaction will run, succeed, and *still* leave the session over the limit — producing exactly the rapid-refill thrash the breaker exists to catch, but without explaining *why*. `Yjp` gives Anthropic an observability signal (with document/image block counts) to detect and quantify this pathology in the field. It deliberately does **not** abort compaction — there is no safe alternative action client-side, so it just records that compaction was futile.

> Confidence: **high** for all three 4a/4b/4c sub-items.

---

## DELTA 5 — The v2.1.156 → v2.1.183 RENAME MAP (no behavior change — re-map your old names)

These are pure re-minification renames; the logic is byte-identical to v2.1.156 (verified by reading both builds). They are listed so you do **not** mistake a renamed-but-stable function for new code. Use this list to re-map any v2.1.156 obfuscated name to its v2.1.183 alias. The full per-symbol cross-version table (the allowed lineage exception) lives in [symbol_additions_v2_1_183_compact.md](../00_overview/symbol_additions_v2_1_183_compact.md); the list below mirrors the list format used by [dispatcher_delta.md §0](./dispatcher_delta.md) so this module doc stays table-free.

**Threshold ladder / window resolver:**

- `getAutoCompactThreshold` (obfuscated: `gwn`, cli_inner_pretty.js:226818; was `Jv$`@423864) — `eff - 13000` autocompact gate.
- `precomputeThreshold` (obfuscated: `mqr`, cli_inner_pretty.js:226824; was `YX4`@423870) — earlier speculative-precompute trigger.
- `calculateTokenWarningState` (obfuscated: `nBi`, cli_inner_pretty.js:226827; was `fX4`@423873) — banded `{level, pctLeft}` classifier.
- `parseWindowString` (obfuscated: `yqr`, cli_inner_pretty.js:226843; was `Ac6`@423889) — `auto`/`Nm`/`Nk`/`N` parser, clamps to `[1e5,1e6]`.
- `opus48ExperimentWindow` (obfuscated: `_qr`, cli_inner_pretty.js:226856; was `wX4`@423906) — Opus-4.8 `redwood2` window override.
- `getAutoCompactWindow` (resolver) (obfuscated: `z2`, cli_inner_pretty.js:226875; was `Xl`@423915) — now **six-source** (DELTA 3).
- `isConfiguredWindow` (obfuscated: `qCe`, cli_inner_pretty.js:226895; was `EH$`@423931) — now also treats `clientdata`/`model-default` as configured (DELTA 3).
- `getAutoCompactWindowSource` (obfuscated: `ywn`, cli_inner_pretty.js:226899; was `ab_`@423935) — `z2(...).source`.
- `getEffectiveContextWindowSize` (obfuscated: `oee`, cli_inner_pretty.js:226902; was `_qH`@423938) — `resolvedWindow − min(maxOut, 20000)`.
- `getEffectiveContextWindowSizeRaw` (obfuscated: `_wd`, cli_inner_pretty.js:226908; was `sb_`@423944) — effective window over the raw cap (`tH`); blocking-limit base.
- `isRedwood3Reactive` (obfuscated: `uG`, cli_inner_pretty.js:226742; was `Pc`@423902) — `tengu_amber_redwood3` reactive-mode gate.
- `isAutoCompactEnabled` (obfuscated: `Kw`, cli_inner_pretty.js:226746; was `J0`@423983) — `DISABLE_COMPACT`/`DISABLE_AUTO_COMPACT`/setting.
- `isLocal` / reactive-remote gate (obfuscated: `S7`, cli_inner_pretty.js:226751; was `_JH`@423988) — **CHANGED, DELTA 4b**.
- `getPrecomputeBufferFraction` (scalar) (obfuscated: `gqr`, cli_inner_pretty.js:226916; was `tb_`@423954) — scalar `tengu_amber_rokovoko` fraction, now the fallback.
- `getPrecomputeBufferFraction` (resolved) (obfuscated: `Ewd`, cli_inner_pretty.js:226935; **NEW**, DELTA 4a) — `bqr(...).fraction` arm-table wrapper.
- `getThresholdOverrides` (obfuscated: `Sqr`, cli_inner_pretty.js:226938; was `jc6`@423958) — now feeds the arm-resolved `precomputeBufferFraction` (DELTA 4a).
- `getAutoCompactThresholdForModel` (obfuscated: `lMt`, cli_inner_pretty.js:226948; was `DU6`@423968) — public autocompact threshold; reused by `Yjp`.
- `calculateTokenWarningStatePublic` (obfuscated: `VCe`, cli_inner_pretty.js:226951; was `WRH`@423971) — public warning-state wrapper (blocking base = raw cap `_wd`).
- `isAbovePrecomputeOrCompact` (obfuscated: `iBi`, cli_inner_pretty.js:226956; was `tv7`@423976) — proactive-work gate (gained the `l < jQ` floor — see Open Question 4).
- `validateEnvInt` (obfuscated: `yae`, cli_inner_pretty.js:226769; was `n$H`@220968) — env-int validator with default/upper bounds.

**Hard cap / model window:**

- `getContextWindowForModel` (obfuscated: `tH`, cli_inner_pretty.js:134105; was `Ov`@130165) — model hard cap; gained the 1M→200k clamp branch (DELTA 2).
- `rawModelWindow` (obfuscated: `gti`, cli_inner_pretty.js:134121; extracted from the inner of `Ov`) — raw per-model window.
- `STANDARD_WINDOW` (200k) (obfuscated: `jQ`, cli_inner_pretty.js:134192; was `P36`@130223) — standard window and 1M-clamp target.

**Dispatcher / breakers:**

- `shouldAutoCompact` (predicate) (obfuscated: `Xjp`, cli_inner_pretty.js:461519; was `eb_`@423991) — should-compact predicate / token-band gate.
- `autoCompactIfNeeded` (dispatcher) (obfuscated: `Ego`, cli_inner_pretty.js:461531; was `DX4`@424002) — async-generator dispatcher.
- `computeRapidRefillStreak` (obfuscated: `Igo`, cli_inner_pretty.js:461481; was `fc6`@423948) — rapid-refill counter.
- `isColdCompact` (obfuscated: `Wgo`, cli_inner_pretty.js:461516; was `Mc6`@423951) — `CLAUDE_CODE_COLD_COMPACT` env read.
- `autoWindowSpinnerHint` (obfuscated: `Jjp`, cli_inner_pretty.js:461655; was `Hx_`@424095) — `/autocompact` spinner hint (now also branches on `clientdata`).
- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (=3) (obfuscated: `jgo`, cli_inner_pretty.js:461663; was `_c6`@424128).
- `RAPID_REFILL_TURN_WINDOW` (=3) (obfuscated: `Ggo`, cli_inner_pretty.js:461664; was `Yc6`@424129).
- `RAPID_REFILL_BREAKER_COUNT` (=3) (obfuscated: `cWn`, cli_inner_pretty.js:461665; was `Y08`@424130).

**Pipeline / summarize / partial:**

- `compactConversation` (full pipeline) (obfuscated: `zut`, cli_inner_pretty.js:460676; was `_eH`@423130) — full 16-phase compaction pipeline.
- `streamCompactSummary` (+fallback loop) (obfuscated: `del`, cli_inner_pretty.js:461088; was `_X4`@423539) — summarize call, now a `while(!0)` model-fallback loop (DELTA 1).
- `partialCompact` (/rewind) (obfuscated: `cel`, cli_inner_pretty.js:460886; was `qX4`@423340) — direction-aware partial compactor.
- OTEL compaction span helper (obfuscated: `D$t`, cli_inner_pretty.js:460682 (call); was `xP$`@276662).

**Constants:**

- `AUTOCOMPACT_BUFFER_TOKENS` (13000) (obfuscated: `QNi`, cli_inner_pretty.js:226839; was `zX4`@423885).
- `MANUAL_COMPACT_BUFFER_TOKENS` (3000) (obfuscated: `ZNi`, cli_inner_pretty.js:226840; was `AX4`@423886).
- `DEFAULT_PRECOMPUTE_BUFFER_FRACTION` (0.2) (obfuscated: `fqr`, cli_inner_pretty.js:226841; was `qc6`@423887).
- `MAX_OUTPUT_TOKENS_FOR_SUMMARY` (20000) (obfuscated: `sBi`, cli_inner_pretty.js:226965; was `MX4`@424124).
- `WINDOW_MIN` (100k) (obfuscated: `hwn`, cli_inner_pretty.js:226966; was `zc6`@424125).
- `WINDOW_MAX` (1M) (obfuscated: `hqr`, cli_inner_pretty.js:226967; was `jX4`@424126).
- `AUTO_WINDOW_TABLE` ({} inert) (obfuscated: `rBi`, cli_inner_pretty.js:226968 / init 226982; was `ob_`@424154).

**Stable-logic verifications carried from the dossier:**
- `partialCompact` (`cel`) is `qX4` renamed, still `s = "from"` default direction (`cli_inner_pretty.js:460886`), same `up_to`/`from` discriminator, shared PTL slicer, directional anchor, `tengu_partial_compact`/`_failed`.
- The full-pipeline `zut` retains the same 16-phase shape: OTEL span at `cli_inner_pretty.js:460682` (`D$t("claude_code.compaction", {spanType:"compaction"})`), HEAD-truncation PTL retry loop, summary extraction, `tengu_compact` event. The dispatcher breaker thrash message constants are the same `3/3/3` (`jgo`/`Ggo`/`cWn`).
- `parseWindowString` (`yqr` @226843) is byte-identical: `"auto"` → `"auto"`, `…m`→×1e6, `…k`→×1000, integers in `[100,1000]` interpreted as thousands, clamp to `[1e5, 1e6]`.
- The threshold formulas are unchanged: `gwn` = `eff - 13000` (with `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` floor via `testPctOverride`), `mqr` = `min(eff - round(eff*frac), gwn(...))`, `nBi` returns `{level: ok|warn|compact|blocked, pctLeft}` with `warn = base - 20000` and `blocked = blockingBase - 3000`.

> One **new** wrinkle in the renamed `iBi` (`isAbovePrecomputeOrCompact`, `cli_inner_pretty.js:226956`): when the model is *not* redwood3-reactive but the window *is* configured, it now additionally guards `if (l < jQ) return !1` — i.e. it only treats a configured window as "above precompute" if that window is at least the 200k standard. This `l < jQ` guard ties into the 1M-clamp (`jQ` = 200000) and is the only logic touch inside the otherwise byte-identical ladder. (Carried as a low-priority verify item — see Open Question 4.)

---

## What is UNCHANGED — see the v2.1.156 baseline (do NOT re-derive)

These were checked and are materially identical to v2.1.156 (modulo the rename map above). For their deep dives, follow the links into the v2.1.156 baseline.

| Topic | Status | v2.1.156 baseline doc |
|---|---|---|
| Threshold formulas & buffer ladder (13000/3000/0.2/20000/100k/1M) | Unchanged (renamed) | [threshold_and_window_resolution.md](../../../claude_code_v_2.1.156/analyze/07_compact/threshold_and_window_resolution.md) |
| `parseWindowString` shorthand + `[1e5,1e6]` clamp | Byte-identical | [threshold_and_window_resolution.md](../../../claude_code_v_2.1.156/analyze/07_compact/threshold_and_window_resolution.md) |
| Dispatcher gate cascade & async-generator shape; both breakers (=3) | Unchanged (renamed) | [autocompact_dispatcher_and_breakers.md](../../../claude_code_v_2.1.156/analyze/07_compact/autocompact_dispatcher_and_breakers.md) |
| Full pipeline 16-phase try/finally, HEAD-trunc PTL retry, summary extraction | Unchanged (renamed `_eH`→`zut`) | [compaction_pipeline.md](../../../claude_code_v_2.1.156/analyze/07_compact/compaction_pipeline.md) |
| Reactive lane (group-walk, `initialTokenGap` seed, PTL extraction, precompute swap/borrow) | Unchanged except arm-table fraction (DELTA 4a) | [reactive_compaction.md](../../../claude_code_v_2.1.156/analyze/07_compact/reactive_compaction.md) |
| Micro-compaction / `context_hint` (beta `context-hint-2026-04-09` **unchanged**, 20000 floor, disk-persist pointer) | Unchanged | [micro_compact.md](../../../claude_code_v_2.1.156/analyze/07_compact/micro_compact.md) |
| Session-memory experiment | Still removed (0 reconstructable matches) | [session_memory_and_partial_compact.md](../../../claude_code_v_2.1.156/analyze/07_compact/session_memory_and_partial_compact.md) |
| `/rewind` partial compactor (`up_to`/`from`, shared PTL slicer, directional anchor) | Unchanged (renamed `qX4`→`cel`) | [session_memory_and_partial_compact.md](../../../claude_code_v_2.1.156/analyze/07_compact/session_memory_and_partial_compact.md) |
| Summary meta-prompt templates (security clause, REPL-cleared trailer, no-tools sandwich, `maxTurns:1`) | Assumed carried (no string diff found) | [summary_prompt_templates.md](../../../claude_code_v_2.1.156/analyze/07_compact/summary_prompt_templates.md) |
| PostCompact tail & prompt-cache break (OTEL still 1 site, PostCompact hook, cache-break reset) | Carried | [postcompact_and_prompt_cache.md](../../../claude_code_v_2.1.156/analyze/07_compact/postcompact_and_prompt_cache.md) |

The micro-compact **`context_hint` beta string is verified unchanged**: `context-hint-2026-04-09` at v2.1.183 `cli_inner_pretty.js:101582` (`k76 = KX("context_hint", "context-hint-2026-04-09")`) vs v2.1.156 `cli_inner_pretty.js:98137` — same string, no beta version bump.

---

## Open questions / low-confidence items (carried honestly from the dossier)

1. **`clientdata` window source semantics (MEDIUM).** `ywd` reads `rowan_thicket` from `clientDataCache` and `autoCompactWindowsCache`. The exact server-push mechanism that populates these caches — and whether `rowan_thicket` is a feature-gate key or a clientdata blob field — was not traced end-to-end. HIGH confidence on its existence and placement in `z2`; MEDIUM on the classification as a "window source" and its population path.

2. **Precompute arm-table consumption (MEDIUM).** The table parser (`bqr`/`eBi`/`tBi`) and the new gated telemetry are confirmed, but exactly how `tengu_precomputed_compact_arm_gated` / `_rearm_capped` (`cli_inner_pretty.js:452899`/`452973`) change the reactive precompute swap *timing* vs v2.1.156 was not fully traced. A focused read of 452899–452990 would close this.

3. **No same-model streaming-retry resurrection (LOW risk).** The v2.1.156 README noted that streaming retry was removed from the full path. The v2.1.183 `del` now has a `while(!0)` loop — but it is a **model-fallback** loop, not a same-model streaming retry: it only advances on a `vF`/`ModelFallbackError`. No `tengu_compact_streaming_retry` event was found inside `del`, and there is no sleep+retry on the same model. LOW risk of mischaracterization, but flagged because the loop superficially resembles the old retry.

4. **The `iBi` `l < jQ` guard (LOW).** The `isAbovePrecomputeOrCompact` function gained an `if (l < jQ) return !1` guard (`cli_inner_pretty.js:226962`) referencing `jQ`=200k, which ties into the 1M-clamp. Read confirms the surrounding formulas are otherwise identical; this guard appears to be the standard-window floor for treating a configured window as "above precompute," but was not exhaustively cross-checked against every call site.

5. **2.1.166 `fallbackModel` up-to-three enforcement (LOW).** The settings schema is `H.array(H.string())` with no explicit `max(3)` in the parser that was read; the "up to three" cap may be UI/doc-level only. No hard length cap was located. The CLI flag feeds the chain via `--fallback-model`'s comma-split, and `ICn` dedupes against the base model, but does not itself enforce a length limit.

---

## Related Symbols

> Symbol mappings live in the central index files — this module doc uses list format only.
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact lives here
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Loop / dispatcher integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Telemetry / model context window / rate-limit mapper
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI spinner hints
> - [symbol_additions_v2_1_183_compact.md](../00_overview/symbol_additions_v2_1_183_compact.md) — This module's new/renamed v2.1.183 symbols

Key functions in this document:

- `streamCompactSummary` (`del`, `cli_inner_pretty.js:461088`) — Summarize call, now a `while(!0)` model-fallback chain loop (DELTA 1)
- `buildFallbackChain` (`ICn`, `cli_inner_pretty.js:461078`) — Normalizes `fallbackModel` into a deduped chain relative to the base model (DELTA 1)
- `is1mCreditsError` (`Fwn`, `cli_inner_pretty.js:229606`) — Matches the 1M-credits 429 message (DELTA 2)
- `set1mCreditsBlocked` / `get1mCreditsBlocked` (`Wtr`/`N8e`, `cli_inner_pretty.js:2968`/`2965`) — Session credits-clamp flag accessors (DELTA 2)
- `getContextWindowForModel` (`tH`, `cli_inner_pretty.js:134105`) — Model hard cap; new `is1mClampActive` 200k branch (DELTA 2)
- `is1mClampActive` (`ARr`, `cli_inner_pretty.js:134118`) — Gate for the 1M→200k clamp (DELTA 2)
- `getAutoCompactWindow` (`z2`, `cli_inner_pretty.js:226875`) — Six-source window resolver (DELTA 3)
- `clientDataWindow` (`ywd`, `cli_inner_pretty.js:226865`) — `rowan_thicket` server-pushed window source (DELTA 3)
- `getPrecomputeArm` (`bqr`, `cli_inner_pretty.js:226920`) — `tengu_amber_moleskin` arm-table fraction resolver (DELTA 4a)
- `isLocalOrRemoteReactiveEnabled` (`S7`, `cli_inner_pretty.js:226751`) — Remote-reactive gate (DELTA 4b)
- `prefixOverflowCheck` (`Yjp`, `cli_inner_pretty.js:461484`) — Fixed-cache-prefix overflow diagnostic (DELTA 4c)
- `autoCompactIfNeeded` (`Ego`, `cli_inner_pretty.js:461531`) — Async-generator dispatcher (renamed `DX4`)
- `compactConversation` (`zut`, `cli_inner_pretty.js:460676`) — Full 16-phase pipeline (renamed `_eH`)
- `partialCompact` (`cel`, `cli_inner_pretty.js:460886`) — `/rewind` direction-aware compactor (renamed `qX4`)
- `getAutoCompactThreshold` (`gwn`, `cli_inner_pretty.js:226818`) — `eff - 13000` autocompact gate (renamed `Jv$`)
- `calculateTokenWarningState` (`nBi`, `cli_inner_pretty.js:226827`) — Ordered level enum `{level, pctLeft}` (renamed `fX4`)
