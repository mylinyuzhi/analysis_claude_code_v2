# Proactive vs Reactive Compaction — Two Triggers, One Subsystem (v2.1.142)

## Overview

Claude Code v2.1.142 has **two structurally distinct compaction triggers** that feed into the same downstream pipeline:

| Lane | Trigger | When it fires | Algorithm |
|------|---------|---------------|-----------|
| **Proactive autocompact** | Pre-flight token estimate crosses a percent-of-window threshold | Before each LLM call, on the way in | Full-conversation summary (`qrH` / `compactConversation`) |
| **Reactive compact** | API returns `prompt_too_long` (1M-context models only) | After a failed LLM call | Group-walk: summarize oldest groups, preserve newest (`uq8` / `iterateReactiveSummarize`) |
| **User `/compact`** | Explicit slash command | On user demand | Full-conversation summary (same path as proactive) |
| **Server `context_hint` reject** | API returns a `context-hint` rejection with metadata | After a failed LLM call (main-thread only) | Microcompact (clear-old-tool-results) — *not* summarization |

This document walks through the decision tree that picks which lane runs, the threshold math behind proactive triggering, the per-version evolution of `CLAUDE_CODE_MAX_CONTEXT_TOKENS`, and how user-driven `/compact` re-enters the same pipeline.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Loop integration
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Model + context-window
> - [symbol_additions_v2_1_142_compact_arch.md](../00_overview/symbol_additions_v2_1_142_compact_arch.md) - This unit's symbol mappings
> - [symbol_additions_v2_1_142_compact_cache.md](../00_overview/symbol_additions_v2_1_142_compact_cache.md) - Unit 11 mappings (reactive compact in detail)

Key functions in this document:
- `autoCompactGenerator` (`Fo7`) — Top of the proactive lane; the outermost autocompact gate
- `shouldAutoCompactNow` (`o45`) — Pre-flight token threshold check
- `isAutoCompactEnabled` (`cZ`) — Env-var + user-setting gate
- `computeAutoCompactThreshold` (`vP$`) — Threshold math (effective window − 13k buffer, with env override)
- `getEffectiveContextWindow` (`FHH`) — Context window minus max-output-tokens reservation
- `getMaxContextTokensForModel` (`nJ`) — Where `CLAUDE_CODE_MAX_CONTEXT_TOKENS` is read
- `resolveAutoCompactWindowSource` (`di`) — Resolves env > settings > experiment > model default
- `isWindowFromEnvOrSettings` (`liH`) — Whether a user explicitly chose the window
- `computeContextLevel` (`MH4`) — UI-facing percent calculator (`ok` / `warn` / `compact` / `blocked`)
- `computeRapidRefillStreak` (`Wy6`) — Detects when autocompact just ran within the last `PI6` turns
- `isReactiveCompactEligible` (`H4H`) — Returns true only for 1M-context models with the ant feature flag on
- `reactiveCompactDispatcher` (`Y97`) — Top of the reactive lane (cross-link to unit 11)
- `compactWarningHook` — React subscription to suppression state (status-line "/compact recommended")
- `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES` (`DH4`) = 3 — Circuit breaker limit
- `AUTOCOMPACT_BUFFER_TOKENS` (`YH4`) = 13,000 — Buffer between threshold and effective window
- `compactConversation` (`qrH`) — The shared downstream pipeline both lanes use (full-summary variant)
- `iterateReactiveSummarize` (`uq8`) — Reactive lane's group-walk loop

---

## 1. The Decision Tree

The agent loop traverses a tree of guards for each request. The tree resolves into one of *six* outcomes per turn (numbered):

```
                      ┌─────────────────────────────────┐
                      │ Agent loop builds API request    │
                      └────────────────┬────────────────┘
                                       │
                            ┌──────────▼──────────┐
                            │ DISABLE_COMPACT ?    │
                            └────┬─────────────┬──┘
                            yes  │             │ no
                                 ▼             ▼
                       (1) Skip everything    │
                                              │
                              ┌──── Fo7 / autoCompactGenerator ──────┐
                              │                                       │
                              │  Pre-flight gates (order matters):    │
                              │                                       │
                              │  a. consecutiveFailures >= 3 ?   ┌──► (2) Circuit breaker: skip
                              │  b. cZ()? (env + setting)        │
                              │  c. o45() above threshold ?      │
                              │  d. rapid-refill streak >= 3 ?   ┌──► (3) Thrash guard: skip
                              │                                  │
                              │  All gates pass:                  │
                              │  ─────────────                   │
                              │  e. Run qrH (compactConversation)│
                              │                                  ┌──► (4) Proactive autocompact ran
                              └──────────────┬───────────────────┘
                                             │
                                ┌────────────▼────────────┐
                                │ LLM call goes out         │
                                └────┬──────────┬──────────┘
                                 OK  │          │  PTL or context_hint reject
                                     ▼          ▼
                            (5) Normal turn      │
                                                 │
                          ┌──────────────────────▼──────────────────────┐
                          │ Error classifier:                            │
                          │  - context_hint reject?  → microcompact (6)  │
                          │  - prompt_too_long?      → reactive compact  │
                          │    if H4H($) && !liH($, q)                   │
                          │    (1M model + ant flag)                     │
                          └─────────────────────────────────────────────┘
```

Six terminal outcomes:
1. **Skipped** — `DISABLE_COMPACT=1`
2. **Circuit breaker** — Three previous auto-compacts failed in a row this session
3. **Thrash guard** — Three consecutive rapid refills (re-triggered within 3 turns)
4. **Proactive autocompact ran** — Token estimate crossed threshold; `qrH` produced a full summary
5. **Normal turn** — Token estimate under threshold; no compact action
6. **Reactive lane took over** — API rejection drove either reactive compact (`Y97`) or context-hint microcompact

---

## 2. Proactive Trigger Math

### Algorithm: Percent-of-Effective-Window with Test Override

**What it does:** Picks a single token threshold above which the proactive lane fires. The threshold sits 13,000 tokens (`AUTOCOMPACT_BUFFER_TOKENS`) below the effective window for the active model, with an optional environment override for testing.

**How it works:**

```javascript
// ============================================
// computeAutoCompactThreshold - Pick proactive autocompact firing threshold
// Location: cli_inner_pretty.js:408269-408274
// ============================================

// ORIGINAL (for source lookup):
function vP$(H, $) {
  let q = H - 13000,
    K = $.testPctOverride;
  if (K !== void 0 && !isNaN(K) && K > 0 && K <= 100) return Math.min(Math.floor(H * (K / 100)), q);
  return q;
}

// READABLE (for understanding):
function computeAutoCompactThreshold(effectiveWindow, dispatcherConfig) {
  const baselineThreshold = effectiveWindow - AUTOCOMPACT_BUFFER_TOKENS;  // 13_000
  const pctOverride = dispatcherConfig.testPctOverride;
  if (pctOverride !== undefined && !isNaN(pctOverride) && pctOverride > 0 && pctOverride <= 100) {
    const percentageThreshold = Math.floor(effectiveWindow * (pctOverride / 100));
    return Math.min(percentageThreshold, baselineThreshold);
  }
  return baselineThreshold;
}

// Mapping: vP$→computeAutoCompactThreshold, H→effectiveWindow, $→dispatcherConfig, q→baselineThreshold, K→pctOverride
```

The effective window itself is computed by `getEffectiveContextWindow` (`FHH`):

```javascript
// ============================================
// getEffectiveContextWindow - Subtracts max-output-tokens reservation from the model's context
// Location: cli_inner_pretty.js:408339-408344
// ============================================

// ORIGINAL (for source lookup):
function FHH(H, $) {
  let q = Math.min(e7H(H), jH4),
    K = cZ() ? $ : void 0,
    { window: _ } = di(H, K);
  return _ - q;
}

// READABLE (for understanding):
function getEffectiveContextWindow(model, configuredAutoCompactWindow) {
  const reservedForSummary = Math.min(getMaxOutputTokensForModel(model), MAX_OUTPUT_TOKENS_FOR_SUMMARY);  // 20_000
  const userWindow = isAutoCompactEnabled() ? configuredAutoCompactWindow : undefined;
  const { window: resolvedWindow } = resolveAutoCompactWindowSource(model, userWindow);
  return resolvedWindow - reservedForSummary;
}

// Mapping: FHH→getEffectiveContextWindow, H→model, $→configuredAutoCompactWindow, e7H→getMaxOutputTokensForModel, jH4→MAX_OUTPUT_TOKENS_FOR_SUMMARY, cZ→isAutoCompactEnabled, di→resolveAutoCompactWindowSource
```

**Why this approach:**

- **20,000-token reservation for output** comes from production p99.99 measurement of compact summary output (`17,387` tokens). The reservation guarantees the summarizer has somewhere to *write* its 5-section response even when the input prompt already eats most of the window.
- **13,000-token threshold buffer** (`AUTOCOMPACT_BUFFER_TOKENS`) means autocompact fires *before* the conversation actually fills the window. The 13k buffer holds:
  1. The next user message (≤2k typical, up to 10k for pasted code)
  2. System-prompt deltas injected this turn (skill listings, MCP delta announcements)
  3. Token-estimation error margin (token counts use char-based heuristics not the real tokenizer)
- **Test override (`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`)** lets development sessions force-trigger at e.g. 30% to exercise the path without filling a real context. The `Math.min(percentageThreshold, baselineThreshold)` clamps the override so it can only *lower* the threshold — you cannot disable autocompact by setting it to 95%.

**Trade-offs:**
- The fixed 13k buffer doesn't scale with window size — on a 200k window, autocompact fires at 93.5% (187k); on a 1M window, autocompact fires at 98.6% (987k). On bigger windows the buffer becomes a smaller fraction of the available room, which is why 1M models additionally have the *reactive* lane as a safety net.
- A constant percentage (e.g. "compact at 90%") would scale linearly but would waste 100k tokens on a 1M model. The constant-token approach keeps the wasted ceiling fixed at 13k regardless of window.

**Key insight:** The 13k buffer is what makes proactive compaction *fire-and-forget* — once you're inside the 13k zone, the summarizer call itself doesn't have to fight for headroom. The next user message can still arrive without immediate re-compaction.

---

## 3. Window Source Resolution

### Algorithm: env > settings > experiment > model default

`resolveAutoCompactWindowSource` is where four configuration paths get reconciled. Whichever wins also sets the `source` field used by other gates.

```javascript
// ============================================
// resolveAutoCompactWindowSource - Decides where the autocompact window comes from
// Location: cli_inner_pretty.js:408320-408334
// ============================================

// ORIGINAL (for source lookup):
function di(H, $) {
  let q = k7(H),
    K = nJ(H, Tw());
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    let z = mt("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, XI6, JH4);
    if (z.status !== "invalid") {
      let Y = Math.max(XI6, z.effective);
      return { window: Math.min(K, Y), configured: Y, source: "env" };
    }
  }
  if ($ !== void 0) return { window: Math.min(K, $), configured: $, source: "settings" };
  let _ = cZ() ? n45[q] : void 0,
    A = aq8(q) ?? _ ?? K;
  return { window: Math.min(K, A), configured: A, source: "auto" };
}

// READABLE (for understanding):
function resolveAutoCompactWindowSource(model, userSettingsWindow) {
  const normalizedModel = normalizeModelId(model);
  const modelMaxTokens = getMaxContextTokensForModel(model, getSdkBetas());

  // Path 1: env var (testing override, takes precedence)
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    const parsed = parseEnvIntWithBounds("CLAUDE_CODE_AUTO_COMPACT_WINDOW",
                                          process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW,
                                          MIN_AUTO_COMPACT_WINDOW_TOKENS,   // 100_000
                                          MAX_AUTO_COMPACT_WINDOW_TOKENS);  // 1_000_000
    if (parsed.status !== "invalid") {
      const effective = Math.max(MIN_AUTO_COMPACT_WINDOW_TOKENS, parsed.effective);
      return { window: Math.min(modelMaxTokens, effective), configured: effective, source: "env" };
    }
  }

  // Path 2: explicit user setting via /autocompact or settings.json
  if (userSettingsWindow !== undefined) {
    return { window: Math.min(modelMaxTokens, userSettingsWindow), configured: userSettingsWindow, source: "settings" };
  }

  // Path 3: GrowthBook experiment override (per-model)
  // Path 4: model default (200k or 1M)
  const experimentDefault = isAutoCompactEnabled() ? n45[normalizedModel] : undefined;
  const redwoodOverride = getRedwoodAutoCompactOverride(normalizedModel);  // tengu_amber_redwood2 GB flag
  const resolvedDefault = redwoodOverride ?? experimentDefault ?? modelMaxTokens;
  return { window: Math.min(modelMaxTokens, resolvedDefault), configured: resolvedDefault, source: "auto" };
}

// Mapping: di→resolveAutoCompactWindowSource, k7→normalizeModelId, nJ→getMaxContextTokensForModel, Tw→getSdkBetas, mt→parseEnvIntWithBounds, XI6→MIN_AUTO_COMPACT_WINDOW_TOKENS, JH4→MAX_AUTO_COMPACT_WINDOW_TOKENS, aq8→getRedwoodAutoCompactOverride, n45→experimentDefaultWindowsByModel
```

**Why this ordering:**

1. **env first** — Developers and CI need a reliable kill-switch / override that beats whatever is in user settings. The `CLAUDE_CODE_AUTO_COMPACT_WINDOW` env var sits at the top.
2. **settings next** — A user who set a window via `/autocompact 600k` or `~/.claude/settings.json` expects it to stick. This is the conscious-choice path.
3. **experiment third** — GrowthBook can roll out a per-model default (e.g. `claude-opus-4-7` defaults to 800k) without changing the bundle. The experiment value is *only* consulted when the user hasn't picked one (`source === "auto"`).
4. **model max last** — If nothing wins, the model's own max-context becomes the window.

The `source` discriminator is consulted by:
- `isWindowFromEnvOrSettings` (`liH`) — gates whether reactive compact is even allowed (see §6)
- `computeAutoModeHintText` (`a45`) — shows "Compacting at auto window (250k tokens) · /autocompact to configure" in the UI

---

## 4. `CLAUDE_CODE_MAX_CONTEXT_TOKENS` (v2.1.98)

A separate env var, `CLAUDE_CODE_MAX_CONTEXT_TOKENS`, sits **upstream** of the window source resolution — it overrides the model's *max-tokens* registry value directly. It is only honored when `DISABLE_COMPACT` is *also* set.

```javascript
// ============================================
// getMaxContextTokensForModel - Resolves model's context-window ceiling
// Location: cli_inner_pretty.js:128600-128611
// ============================================

// ORIGINAL (for source lookup):
function nJ(H, $) {
  if (bH(process.env.DISABLE_COMPACT) && process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS) {
    let K = parseInt(process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS, 10);
    if (!isNaN(K) && K > 0) return K;
  }
  if (aG(H)) return 1e6;
  if ($?.includes(EU.header) && bc(H)) return 1e6;
  if (OqH(H)) return 1e6;
  let q = Kl$(H);
  if (q !== null) return q;
  return d$6;
}

// READABLE (for understanding):
function getMaxContextTokensForModel(model, sdkBetas) {
  // Path 1: env override is gated by DISABLE_COMPACT — only escape hatch for advanced users
  // who explicitly opted out of compaction and want a custom hard ceiling
  if (isEnvTruthy(process.env.DISABLE_COMPACT) && process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS) {
    const parsed = parseInt(process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  // Path 2: ant-only 1M flag forced on
  if (isAntForcedLongContext(model)) return 1_000_000;
  // Path 3: SDK passed the long-context beta header AND model supports it
  if (sdkBetas?.includes(LONG_CONTEXT_BETA_HEADER) && supportsLongContextBeta(model)) return 1_000_000;
  // Path 4: model is natively 1M (Opus 4.7)
  if (isModelNative1M(model)) return 1_000_000;
  // Path 5: GrowthBook kelp_forest_sonnet override (for Sonnet 4.6 experiments)
  const kelpOverride = getKelpForestOverride(model);
  if (kelpOverride !== null) return kelpOverride;
  // Path 6: legacy default
  return DEFAULT_CONTEXT_WINDOW_TOKENS;  // 200_000
}

// Mapping: nJ→getMaxContextTokensForModel, H→model, $→sdkBetas, bH→isEnvTruthy, aG→isAntForcedLongContext, EU→longContextBetaRegistry, bc→supportsLongContextBeta, OqH→isModelNative1M, Kl$→getKelpForestOverride, d$6→DEFAULT_CONTEXT_WINDOW_TOKENS
```

**Why the `DISABLE_COMPACT` gate on the env var:**

The `CLAUDE_CODE_MAX_CONTEXT_TOKENS` override is *dangerous*: setting it above the model's real context window will trigger 4xx errors on every request once the conversation grows past the actual ceiling. The `DISABLE_COMPACT` co-requirement forces users to acknowledge they have also turned off the safety net before letting them override the ceiling. The realistic use case is custom-fine-tuned models behind a gateway whose real context is non-standard.

**Key insight:** This is the *only* env-var path that lies to the rest of the system about how big the window is — every threshold, percent-left calculation, and warning level treats the env value as gospel. Setting it carelessly will make `/context` show "100% available" while the API is actively rejecting requests.

---

## 5. Pre-flight Gate Cascade in `Fo7`

`autoCompactGenerator` is a generator that yields compact-progress events upward while running its gate cascade. It's invoked once per agent-loop turn from the message pump.

```javascript
// ============================================
// autoCompactGenerator - The pre-flight gate cascade for proactive compact
// Location: cli_inner_pretty.js:408400-408445
// ============================================

// ORIGINAL (for source lookup):
async function* Fo7(H, $, q, K, _, A) {
  if (bH(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
  if (_?.consecutiveFailures !== void 0 && _.consecutiveFailures >= DH4) return { wasCompacted: !1 };
  let z = $.options.mainLoopModel, Y = $.getAutoCompactWindow();
  if (!(await o45(H, z, Y, K, A))) return { wasCompacted: !1 };
  let O = Wy6(_);
  if (O >= NO8)
    return (
      N(`autocompact: rapid-refill breaker tripped — ${O} consecutive refills within <${PI6} turns each (last was ${_?.turnCounter} turns)`, { level: "warn" }),
      J8("compact_auto", "compact_auto_rapid_refill_breaker"),
      { wasCompacted: !1, rapidRefillBreakerTripped: !0 }
    );
  let M = { isRecompactionInChain: _?.compacted === !0, turnsSincePreviousCompact: _?.turnCounter ?? -1, previousCompactTurnId: _?.turnId, autoCompactThreshold: ny6(z, Y), querySource: K },
      w = WI6(), D = a45(z, Y);
  try {
    let j = yield* Zy6((J) => qrH(H, J, q, !0, void 0, !0, M, w, D), $);
    return (Bn(K, $.setAppState, $.agentId), { wasCompacted: !0, compactionResult: j, consecutiveFailures: 0, consecutiveRapidRefills: O });
  } catch (j) {
    if (ZH(j).startsWith($rH)) return { wasCompacted: !1 };
    if (!Bd(j, Gb)) { if (tu(ZH(j)) || Bd(j, UM8) || Bd(j, yrH)) N(`autocompact failed: ${ZH(j)}`, { level: "error" }); else EH(j); }
    let X = (_?.consecutiveFailures ?? 0) + 1;
    if (X >= DH4) (N(`autocompact: circuit breaker tripped after ${X} consecutive failures — skipping future attempts this session`, { level: "warn" }), d("tengu_auto_compact_circuit_breaker", { consecutiveFailures: X }));
    return { wasCompacted: !1, consecutiveFailures: X };
  }
}

// READABLE (for understanding):
async function* autoCompactGenerator(messages, sessionContext, cacheSafeParams, querySource, tracking, snipTokensFreed) {
  // Gate 1: hard kill-switch
  if (isEnvTruthy(process.env.DISABLE_COMPACT)) return { wasCompacted: false };

  // Gate 2: consecutive-failure circuit breaker
  if (tracking?.consecutiveFailures !== undefined && tracking.consecutiveFailures >= MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES) {
    return { wasCompacted: false };
  }

  const model = sessionContext.options.mainLoopModel;
  const autoCompactWindow = sessionContext.getAutoCompactWindow();

  // Gate 3: pre-flight threshold + feature gates
  if (!(await shouldAutoCompactNow(messages, model, autoCompactWindow, querySource, snipTokensFreed))) {
    return { wasCompacted: false };
  }

  // Gate 4: rapid-refill thrash guard
  const rapidRefills = computeRapidRefillStreak(tracking);
  if (rapidRefills >= MAX_CONSECUTIVE_RAPID_REFILLS) {
    log(`autocompact: rapid-refill breaker tripped — ${rapidRefills} consecutive refills within <${RAPID_REFILL_TURN_WINDOW} turns each (last was ${tracking?.turnCounter} turns)`, { level: "warn" });
    recordCompactFailureCategory("compact_auto", "compact_auto_rapid_refill_breaker");
    return { wasCompacted: false, rapidRefillBreakerTripped: true };
  }

  // All gates passed — assemble RecompactionInfo and call the shared pipeline
  const recompactionInfo = {
    isRecompactionInChain: tracking?.compacted === true,
    turnsSincePreviousCompact: tracking?.turnCounter ?? -1,
    previousCompactTurnId: tracking?.turnId,
    autoCompactThreshold: getAutoCompactThreshold(model, autoCompactWindow),
    querySource,
  };
  const isColdCompact = isColdCompactEnabled();
  const hintText = computeAutoModeHintText(model, autoCompactWindow);

  try {
    const compactionResult = yield* streamingCompactWrapper(
      (innerContext) => compactConversation(messages, innerContext, cacheSafeParams, /*suppressFollowUps*/ true, /*customInstructions*/ undefined, /*isAutoCompact*/ true, recompactionInfo, isColdCompact, hintText),
      sessionContext
    );
    postCompactCleanup(querySource, sessionContext.setAppState, sessionContext.agentId);
    return { wasCompacted: true, compactionResult, consecutiveFailures: 0, consecutiveRapidRefills: rapidRefills };
  } catch (error) {
    if (errorMessage(error).startsWith(PRECOMPACT_BLOCKED_PREFIX)) return { wasCompacted: false };
    if (!isUserAbort(error)) {
      if (startsWithApiErrorPrefix(errorMessage(error)) || isPTLExhaustedMessage(error) || isIncompleteResponseError(error)) {
        log(`autocompact failed: ${errorMessage(error)}`, { level: "error" });
      } else {
        logError(error);
      }
    }
    const nextFailures = (tracking?.consecutiveFailures ?? 0) + 1;
    if (nextFailures >= MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES) {
      log(`autocompact: circuit breaker tripped after ${nextFailures} consecutive failures — skipping future attempts this session`, { level: "warn" });
      logEvent("tengu_auto_compact_circuit_breaker", { consecutiveFailures: nextFailures });
    }
    return { wasCompacted: false, consecutiveFailures: nextFailures };
  }
}

// Mapping: Fo7→autoCompactGenerator, H→messages, $→sessionContext, q→cacheSafeParams, K→querySource, _→tracking, A→snipTokensFreed,
//          o45→shouldAutoCompactNow, Wy6→computeRapidRefillStreak, ny6→getAutoCompactThreshold,
//          WI6→isColdCompactEnabled, a45→computeAutoModeHintText, Zy6→streamingCompactWrapper, qrH→compactConversation,
//          Bn→postCompactCleanup, $rH→PRECOMPACT_BLOCKED_PREFIX, Gb→USER_ABORT_PATTERN
```

### Gate 3 in detail (`shouldAutoCompactNow`)

```javascript
// ============================================
// shouldAutoCompactNow - Token-count threshold check
// Location: cli_inner_pretty.js:408389-408399
// ============================================

// ORIGINAL (for source lookup):
async function o45(H, $, q, K, _ = 0) {
  if (K === "compact") return !1;
  if (!cZ()) return !1;
  if (H4H($) && !liH($, q)) return !1;
  let A = wX(H, sG($)) - _,
    z = _NH(A, $, q);
  return (N(`autocompact: tokens=${A} level=${z.level} effectiveWindow=${FHH($, q)}`),
    z.level === "compact" || z.level === "blocked");
}

// READABLE (for understanding):
async function shouldAutoCompactNow(messages, model, autoCompactWindow, querySource, snipTokensFreed = 0) {
  // Don't recursively compact: the compact agent's own forked LLM call uses querySource = "compact"
  if (querySource === "compact") return false;

  // User has compaction off via DISABLE_COMPACT, DISABLE_AUTO_COMPACT, or autoCompactEnabled = false
  if (!isAutoCompactEnabled()) return false;

  // For 1M-model + ant flag + user hasn't manually pinned a window: cede the lane to reactive compact
  if (isReactiveCompactEligible(model) && !isWindowFromEnvOrSettings(model, autoCompactWindow)) return false;

  // Token estimate, minus what snip just freed (snip removed messages but the assistant usage is sticky)
  const tokenCount = tokenCountWithEstimation(messages, getSdkBetasFor(model)) - snipTokensFreed;
  const warningState = computeTokenWarningState(tokenCount, model, autoCompactWindow);

  log(`autocompact: tokens=${tokenCount} level=${warningState.level} effectiveWindow=${getEffectiveContextWindow(model, autoCompactWindow)}`);

  return warningState.level === "compact" || warningState.level === "blocked";
}

// Mapping: o45→shouldAutoCompactNow, H→messages, $→model, q→autoCompactWindow, K→querySource, _→snipTokensFreed,
//          cZ→isAutoCompactEnabled, H4H→isReactiveCompactEligible, liH→isWindowFromEnvOrSettings,
//          wX→tokenCountWithEstimation, sG→getSdkBetasFor, _NH→computeTokenWarningState, FHH→getEffectiveContextWindow
```

**Why the `isReactiveCompactEligible && !isWindowFromEnvOrSettings` cut-out (Gate 3, third line):**

This is the *cession of control* to reactive compact. On a model where:
- `H4H($)` is true: the model is 1M-context AND the ant feature flag (`tengu_cobalt_raccoon`) is on AND no auto-compact override is configured
- `liH($, q)` is false: the user has *not* explicitly pinned an autocompact window via env or settings

…proactive compaction abdicates and lets the reactive path handle headroom. The reasoning:

1. **Proactive on 1M is wasteful.** With a 1M context and a 13k buffer, autocompact fires at ~98.6%. On real workloads it produces a summary the user will mostly never need because reactive compact would have absorbed the same overflow naturally.
2. **Proactive on 1M produces worse summaries.** A 987k-token summary input means the summarizer is reading a 1000× longer conversation than it was tuned on (the prompt is sized for ~200k contexts). Reactive compact's group-walk gives a strictly bounded summarize-call input.
3. **User-pinned windows opt back in.** If the user explicitly set `/autocompact 600k`, they've signalled that they *want* a fixed-window experience, so proactive runs at 600k − 13k.

**Key insight:** This is the seam between the two lanes. The decision is policy: 1M models route compaction *reactively* (after rejection), 200k models route it *proactively* (before rejection), unless the user overrides.

---

## 6. User `/compact` — Same Pipeline, Different Entry

The slash command `/compact` enters `compactConversation` (`qrH`) directly, bypassing `Fo7`'s gates. It also has its own threshold reservation: `MANUAL_COMPACT_BUFFER_TOKENS` = 3,000 (only used by the blocking check inside `computeContextLevel`, not by manual triggering).

```javascript
// ============================================
// computeContextLevel - The percent-left calculator used by /context, status line, and gate decisions
// Location: cli_inner_pretty.js:408278-408289
// ============================================

// ORIGINAL (for source lookup):
function MH4(H, $, q, K = $) {
  let _ = vP$($, q),
    A = q.enabled ? _ : $,
    z = A - 20000,
    Y = q.testBlockingOverride,
    f = Y !== void 0 && !isNaN(Y) && Y > 0 ? Y : K - 3000,
    O = Math.max(0, Math.round(((A - H) / A) * 100));
  if (H >= f) return { level: "blocked", pctLeft: O };
  if (q.enabled && H >= _) return { level: "compact", pctLeft: O };
  if (H >= z) return { level: "warn", pctLeft: O };
  return { level: "ok" };
}

// READABLE (for understanding):
function computeContextLevel(tokenUsage, effectiveWindow, dispatcherConfig, blockingBaseWindow = effectiveWindow) {
  const autoCompactThreshold = computeAutoCompactThreshold(effectiveWindow, dispatcherConfig);

  // If autocompact is enabled, the warning threshold sits 20k below the compact threshold (sandwiched zone)
  // If disabled, the warning threshold sits 20k below the raw effective window
  const ceiling = dispatcherConfig.enabled ? autoCompactThreshold : effectiveWindow;
  const warningThreshold = ceiling - 20_000;

  // Blocking threshold (manual /compact zone) — overridable via CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE
  const blockingOverride = dispatcherConfig.testBlockingOverride;
  const blockingThreshold = blockingOverride !== undefined && !isNaN(blockingOverride) && blockingOverride > 0
    ? blockingOverride
    : blockingBaseWindow - 3000;  // MANUAL_COMPACT_BUFFER_TOKENS

  const pctLeft = Math.max(0, Math.round(((ceiling - tokenUsage) / ceiling) * 100));

  if (tokenUsage >= blockingThreshold) return { level: "blocked", pctLeft };
  if (dispatcherConfig.enabled && tokenUsage >= autoCompactThreshold) return { level: "compact", pctLeft };
  if (tokenUsage >= warningThreshold) return { level: "warn", pctLeft };
  return { level: "ok" };
}

// Mapping: MH4→computeContextLevel, H→tokenUsage, $→effectiveWindow, q→dispatcherConfig, K→blockingBaseWindow,
//          vP$→computeAutoCompactThreshold
```

The four levels map to four UI states:

| Level | Token range | UI behavior |
|-------|-------------|-------------|
| `ok` | Below warningThreshold | Nothing shown |
| `warn` | warningThreshold–autoCompactThreshold (20k zone) | "/compact recommended" hint in status line (suppressible via `compactWarningHook` after a micro-compaction frees room) |
| `compact` | autoCompactThreshold–blockingThreshold (10k zone) | Autocompact would fire on next turn; manual `/compact` also valid |
| `blocked` | At or above blockingThreshold | Even `/compact` is blocked because the *compact API call itself* would overflow; user has to use `/clear` or rewind |

The `compactWarningHook` React subscription drives the status-line warning — when microcompact silently frees tokens (via `clearCompactWarningSuppression()` / `suppressCompactWarning()` calls in `microcompactMessages`), the warning auto-hides for the rest of the turn.

---

## 7. Reactive Lane Entry Conditions

Reactive compact is *the* lane for 1M-context models. Its eligibility check guards both:
- `shouldAutoCompactNow` (Gate 3 cut-out in §5) — so proactive cedes
- The agent loop's PTL/413 error handler — so reactive only fires when a fail-fast retry is impossible

```javascript
// ============================================
// isReactiveCompactEligible - The 1M-context + ant-flag gate
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
  // Reactive compact is feature-gated by `tengu_cobalt_raccoon` (ant-only)
  if (!isReactiveCompactFeatureEnabled()) return false;

  // Only enable for 1M-context models — that's the whole point of the lane
  if (getMaxContextTokensForModel(model, getSdkBetas()) !== 1_000_000) return false;

  // If a per-model autocompact override is configured (tengu_amber_redwood2),
  // the user/experiment explicitly chose a smaller window — proactive wins
  if (getRedwoodAutoCompactOverride(normalizeModelId(model)) !== undefined) return false;

  return true;
}

// Mapping: H4H→isReactiveCompactEligible, DM$→isReactiveCompactFeatureEnabled, nJ→getMaxContextTokensForModel, Tw→getSdkBetas,
//          k7→normalizeModelId, aq8→getRedwoodAutoCompactOverride
```

When reactive compact runs, it's driven by **the `initialTokenGap` returned with the PTL response** — see [reactive_seeding.md](./reactive_seeding.md) in the unit 11 worktree, or section §3 of this document's companion [autocompact_thrash_guard.md](./autocompact_thrash_guard.md).

The agent loop's PTL handler (around `cli_inner_pretty.js:392544`) extracts the gap and hands it to `Y97` / `reactiveCompactDispatcher`:

```
413/PTL response → extract usage.input_tokens overflow via mUH (extractPTLTokenGap)
                → if isReactiveCompactEligible(model) && !hasAttemptedReactiveCompact: call Y97
                → Y97 runs the group-walk and produces a partial summary
                → buildPostCompactMessages → retry the original request
```

The `consecutiveFailures` counter for reactive compact has its own state field (`consecutiveRapidRefills`) — see [autocompact_thrash_guard.md](./autocompact_thrash_guard.md) for the parallel breaker logic.

---

## 8. Context-Hint Server Reject — Microcompact, Not Summary

For main-thread queries (`querySource: "repl_main_thread"` or its `:outputStyle:` prefix variants) when the SDK includes the `context-hint` beta header, the server can respond with a special `context_hint_reject` body asking the client to free a target number of tokens before retrying. This is *not* summarization — it's a `microcompactMessages` invocation that clears old tool results.

```javascript
// ============================================
// pQ6 (handleHintReject) - Apply microcompact in response to server's context_hint rejection
// Location: cli_inner_pretty.js:524667-524681
// ============================================

// ORIGINAL (for source lookup):
async function pQ6(H) {
  let $ = await nh4(H.messages, H.querySource);
  return (
    RH("compact_hint_reject"),
    gh4({ requestId: H.requestId, preCompactTokenEstimate: $.preCompactTokenEstimate, postCompactTokenEstimate: $.postCompactTokenEstimate, tokensSaved: $.preCompactTokenEstimate - $.postCompactTokenEstimate, mcApplied: $.applied.mcApplied, mcTokensSaved: $.applied.mcTokensSaved }),
    { messages: $.messages, clearedIds: $.clearedIds, clearedContent: $.clearedContent }
  );
}

// READABLE (for understanding):
async function handleHintReject(rejectInfo) {
  // Apply microcompact (clear-old-tool-results) on the messages array
  const applied = await applyHintEdits(rejectInfo.messages, rejectInfo.querySource);

  // Telemetry
  clearCompactFailureCounter("compact_hint_reject");
  logContextHintReject({
    requestId: rejectInfo.requestId,
    preCompactTokenEstimate: applied.preCompactTokenEstimate,
    postCompactTokenEstimate: applied.postCompactTokenEstimate,
    tokensSaved: applied.preCompactTokenEstimate - applied.postCompactTokenEstimate,
    mcApplied: applied.applied.mcApplied,
    mcTokensSaved: applied.applied.mcTokensSaved,
  });

  return { messages: applied.messages, clearedIds: applied.clearedIds, clearedContent: applied.clearedContent };
}

// Mapping: pQ6→handleHintReject, nh4→applyHintEdits, RH→clearCompactFailureCounter, gh4→logContextHintReject
```

This sits below reactive compact in the decision tree — both are *reactive* (response to an API rejection), but `context_hint` is preferred because it's lower-cost (no LLM call, no summarization).

**Why two reactive paths instead of one:**

- `context_hint` rejection: server-side decision based on user intent ("the conversation has lots of stale tool output we can drop"). Free.
- `prompt_too_long`: hard ceiling, can't be salvaged without an LLM call. Expensive.

Server picks `context_hint` first when possible; only if that path is unavailable or saved too few tokens does the request fall through to a PTL response, which routes to reactive compact.

---

## 9. Summary — Lane Selection Truth Table

| Model class | `DISABLE_COMPACT` | `autoCompactEnabled` | Window source | Pre-flight at threshold | API returns PTL | API returns context_hint reject |
|-------------|-------------------|----------------------|---------------|-------------------------|-----------------|---------------------------------|
| 200k (Opus 4.5, Sonnet 4.5, etc.) | true | * | * | (1) skip | (1) error | (1) error |
| 200k | false | false | * | (5) normal | (1) error | (6) microcompact |
| 200k | false | true | * | (4) proactive `qrH` | (1) error | (6) microcompact |
| 1M (Opus 4.7) ant flag off | false | true | auto | (4) proactive `qrH` | (1) error | (6) microcompact |
| 1M (Opus 4.7) ant flag on | false | true | auto | (5) normal | reactive `Y97` | (6) microcompact |
| 1M (Opus 4.7) ant flag on | false | true | env/settings | (4) proactive `qrH` | (1) error | (6) microcompact |

(Numbers refer to the six terminal outcomes in §1's decision tree.)

**Key insight:** v2.1.142 hides a quiet policy shift: on 1M models with the ant flag, *autocompact never fires proactively*. The entire pre-flight pipeline becomes a no-op, and the lane ownership flips to reactive. The user-facing surface (status line, `/context`, `/compact`) still works — they call `computeContextLevel` directly with the same thresholds — but the gates `H4H && !liH` in `o45` and `vP$` create a quiet, deterministic divergence between the *displayed* threshold and the *operative* threshold.
