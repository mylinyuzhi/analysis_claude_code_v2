# Long-Context Resume — Compaction Beta Header Propagation (v2.1.113)

## Changelog Anchor

> Fixed compacting a resumed long-context session failing with "Extra usage is required for long context requests"

(Listed in v2.1.113 — see CHANGELOG.md line 666. The task description in this unit refers to v2.1.121 but the actual fix in source maps to v2.1.113. We document the user-facing bug since the fix is in the v2.1.142 binary.)

## Background — The 1M-Context Beta Header

When a session uses a 1M-context model (Opus 4.7, Opus 4.6, Sonnet 4.6, Sonnet 4.5 — see `cli_inner_pretty.js:97567-97574`), every API request must carry the `context-1m-2025-08-07` beta header. This header tells the server "include the 1M-context override usage on this request" — without it, the server enforces the model's nominal 200k-context window and rejects oversized prompts with:

```
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Extra usage is required for long context requests"
  }
}
```

The beta header itself is registered as `EU` in the bundle:

```javascript
EU = pJ("long_context", "context-1m-2025-08-07")
//   cli_inner_pretty.js:96801
```

And gets pushed onto the betas array for any request whose model has `Kl$(model) !== null` (i.e., is a known 1M-context model):

```javascript
// cli_inner_pretty.js:525267
if (!s.includes(EU) && Kl$(tH.model) !== null) s.push(EU);
```

## The Bug

When a user runs `claude --resume <sessionId>` on a long-context session that has overflowed (the assistant's last attempt at the prior session hit the 1M-token limit), the agent loop on resume tries to compact the conversation as a recovery step. This compact attempt goes through the forked-query infrastructure (`JV` → `gC` → eventually `Sg`/`uEH`).

Pre-fix: the compact call from the resume-recovery path was built via `Sg` (the side-query function) which only adds `EU` when it sees the model identifier in `Vu($)`. But the compact call sometimes ran *before* `Vu` had been populated for the resumed session, or it used a different model-derivation path that skipped the beta-header step. The result: the compact call went out without `context-1m-2025-08-07`, so the server enforced the 200k limit. The resumed conversation (which is already 800k+ tokens) gets rejected with "Extra usage is required for long context requests" — a confusing error that has nothing to do with billing.

## The Fix

Two coordinated changes made in v2.1.113:

1. **Reactive compact dispatch is gated by `H4H(model)`** — only the reactive path is taken for 1M-context-eligible models. This concentrates the 1M-aware compact logic into one branch.

```javascript
// ============================================
// compactSlashCommand - Routes /compact to either reactive (1M) or qrH (legacy) pipeline
// Location: cli_inner_pretty.js:431845-431876
// ============================================

// ORIGINAL (for source lookup):
var T35 = async (H, $) => {
  let { abortController: q } = $,
    { messages: K } = $;
  if (((K = X3(K)), K.length === 0)) throw Error("No messages to compact");
  let _ = H.trim();
  try {
    let A = $.options.mainLoopModel;
    if (H4H(A)) return await V35(K, $, _);    // ← reactive path for 1M-context models
    let Y = (await Ct(K, $)).messages,
      f = await qrH(Y, $, await I44($, Y), !1, _, !1, void 0, WI6());
    return (
      C0H(),
      qM.cache.clear?.(),
      Bn(void 0, $.setAppState),
      { type: "compact", compactionResult: f, displayText: h44($, f.userDisplayMessage) }
    );
  } catch (A) {
    ...
  }
};

// READABLE (for understanding):
const compactSlashCommand = async (commandArgs, slashContext) => {
  const { abortController } = slashContext;
  let { messages } = slashContext;
  messages = filterDeadFork(messages);  // X3
  if (messages.length === 0) throw Error("No messages to compact");

  const customInstructions = commandArgs.trim();
  try {
    const model = slashContext.options.mainLoopModel;
    // ─── Gate: 1M-context-eligible model → reactive compact ─────────────────
    if (isReactiveCompactEligible(model)) {                                      // H4H
      return await runReactiveCompactManual(messages, slashContext, customInstructions);  // V35
    }
    // ─── Legacy path (200k window) ──────────────────────────────────────────
    const filteredMessages = (await applyContextManagement(messages, slashContext)).messages;
    const compactionResult = await compactConversation(
      filteredMessages,
      slashContext,
      await buildCacheSafeParams(slashContext, filteredMessages),
      false,            // not auto
      customInstructions,
      false,            // not strip-non-essential
      undefined,
      isAutocompactingDisabled(),
    );
    return (
      resetContextCollapseAck(),                  // C0H
      promptCacheClear(),
      postCompactCleanup(undefined, slashContext.setAppState),  // Bn
      { type: "compact", compactionResult, displayText: buildCompactedDisplayText(slashContext, compactionResult.userDisplayMessage) }
    );
  } catch (e) {
    ...
  }
};

// Mapping: T35→compactSlashCommand, H→commandArgs, $→slashContext, K→messages, _→customInstructions,
//          A→model, H4H→isReactiveCompactEligible, V35→runReactiveCompactManual,
//          Y→filteredMessages, f→compactionResult, qrH→compactConversation, I44→buildCacheSafeParams
```

2. **The reactive compact path (`Y97` → `Ej6` → `uq8` → `JV`) propagates `EU` through `JV`'s API call** — `JV` calls `gC` which builds request parameters via `D$`. The relevant injection is at `cli_inner_pretty.js:525267-525268`:

```javascript
let D$ = (tH) => {
  let s = [...M];                              // base betas
  if (!s.includes(EU) && Kl$(tH.model) !== null) s.push(EU);  // ← unconditional 1M-context beta if model is 1M
  ...
};
```

Critically, this branch runs at the *request build* stage, regardless of which query path called it. So the reactive-compact forked summarize call, `/compact`-driven compact call, and `/rewind` partial-compact call all pick up `EU` for 1M models.

## Why Both Halves Of The Fix Are Needed

The header-injection logic at line 525267 was already correct in principle. But:

- Pre-v2.1.113, some compact callers bypassed `gC`/`D$` by calling lower-level helpers that didn't run the beta-injection. The most common case was the resume-recovery compact path.
- Routing all 1M-model compacts through the reactive path (`V35`) means they all go through `JV` → `gC` → `D$` → `EU` push. Single point of injection, no missed call sites.

The `H4H` gate function ties this together:

```javascript
// ============================================
// isReactiveCompactEligible - Returns true if model supports reactive compact (1M context)
// Location: cli_inner_pretty.js:243938-243944
// ============================================

// ORIGINAL (for source lookup):
function H4H(H) {
  if (!DM$()) return !1;
  if (nJ(H, Tw()) !== 1e6) return !1;
  let $ = k7(H);
  if (aq8($) !== void 0) return !1;
  return !0;
}

// READABLE (for understanding):
function isReactiveCompactEligible(model) {
  // Gate 1: feature flag (tengu_cobalt_raccoon — internal users only at first)
  if (!isReactiveCompactFeatureEnabled()) return false;
  // Gate 2: context window of *this model at this query* must be 1M
  if (computeContextWindow(model, getWindowSource()) !== 1_000_000) return false;
  // Gate 3: model is not on the per-model opt-out list
  const baseModelId = stripModelSuffix(model);     // k7 — strips "[1m]" etc.
  if (getReactiveCompactOptOut(baseModelId) !== undefined) return false;
  return true;
}

// Mapping: H4H→isReactiveCompactEligible, H→model, DM$→isReactiveCompactFeatureEnabled,
//          nJ→computeContextWindow, Tw→getWindowSource, k7→stripModelSuffix, aq8→getReactiveCompactOptOut
```

## The Resume Recovery Path

When `claude --resume <sessionId>` loads a session whose last assistant attempt overflowed:

```
1. Load JSONL transcript from ~/.claude/sessions/<sessionId>/
2. Build initial messages array from transcript
3. Agent loop starts; checks for needed compact (gDY / shouldCompact)
4. If shouldCompact → autocompact path
5. For 1M-context model: routes to reactive compact (Y97)
6. Y97 calls JV with cacheSafeParams → gC → request build → D$ → EU pushed
7. Summarize call goes out with context-1m-2025-08-07 header
8. Server treats as 1M-context request, accepts the prompt
9. Compaction succeeds, conversation resumes
```

Pre-fix: step 5 might have taken a non-reactive path, or step 6 might have used a code path that didn't run `D$`. Either way, step 7 went out without the header, step 8 rejected, and the user saw "Extra usage is required for long context requests".

## Verification

```bash
# Confirm EU push is unconditional for 1M models in the modern path:
grep -A 1 "!s.includes(EU) && Kl" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# → if (!s.includes(EU) && Kl$(tH.model) !== null) s.push(EU);

# Confirm /compact gate funnels 1M models to reactive path:
grep -B 1 -A 3 "if (H4H(A)) return await V35" /lyz/codespace/claude-code-bomb/versions/2.1.142/extract/cli_inner_pretty.js
# → let A = $.options.mainLoopModel; if (H4H(A)) return await V35(K, $, _);
```

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Model registry, beta headers
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - This unit's new symbols

Key functions:
- `compactSlashCommand` (`T35`) — `cli_inner_pretty.js:431845-431876` — `/compact` entry point with 1M routing
- `runReactiveCompactManual` (`V35`) — `cli_inner_pretty.js:431766-431817` — Manual variant of reactive compact (for `/compact` on 1M models)
- `isReactiveCompactEligible` (`H4H`) — `cli_inner_pretty.js:243938-243944` — The 1M gate
- `longContextBeta` (`EU`) — `cli_inner_pretty.js:96801` — The `context-1m-2025-08-07` beta header
- `pushBetaIfMissing` (inline in `D$`) — `cli_inner_pretty.js:525267-525268` — The `EU.push` site
- `getContextWindowForModel` (`Kl$`) — Returns 1M-override config object iff model has one
- `forkedQueryRunner` (`JV`) — `cli_inner_pretty.js:242702-242802` — All forked compact/summarize calls funnel here, picking up `EU` via `gC`/`D$`
