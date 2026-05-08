# Trigger Mechanism — When Does Compact Actually Run?

## Overview

The compact subsystem in Claude Code v2.1.112 has a multi-layered trigger system that must answer five questions in order before the LLM call fires:

1. Is compaction globally disabled (env var)?
2. Has the consecutive-failure circuit breaker tripped?
3. Are we above the auto-compact threshold *and* in a window-source the user can configure?
4. Is the rapid-refill breaker about to trip?
5. (The actual call.)

Only when all five questions resolve favorably does `vI6` (`compactConversation`) execute. This document walks through the threshold math and gate cascade in detail.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Compact module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Loop integration

Key functions in this document:
- `autocompactDispatcher` (`QkK`) — chunks.159.mjs:1379 — Top-level gate cascade
- `shouldCompact` (`gDY`) — chunks.159.mjs:1365 — Threshold + ant-user gate
- `getAutoCompactThreshold` (`v38`) — chunks.159.mjs:1320 — Threshold math
- `getEffectiveContextWindow` (`Yn`) — chunks.159.mjs:1307
- `resolveWindowSource` (`Jn`) — chunks.159.mjs:1266 — env > settings > experiment > model
- `computeContextThresholds` (`UM6`) — chunks.159.mjs:1334 — UI status calculator
- `isAutoCompactEnabled` (`z0`) — chunks.159.mjs:1359
- `isCacheCold` (`FDY`) — chunks.159.mjs:1316
- `isAntUser` (`bx`) — chunks.101.mjs:1530
- `isWindowFromEnvOrSettings` (`Z38`) — chunks.159.mjs:1300
- `notifyExperimentSourceIfApplicable` (`UDY`) — chunks.159.mjs:1430

---

## 1. The Dispatcher Gate Cascade (`QkK`)

The autocompact dispatcher is invoked once per turn from `chunks.154.mjs:1010-1022`. It applies five gates in strict order. Failing any one returns `{ wasCompacted: false }` without entering the (expensive) LLM call.

### Code Excerpt

```javascript
// ============================================
// autocompactDispatcher - Top-level autocompact gate cascade
// Location: chunks.159.mjs:1379-1428
// ============================================

// ORIGINAL (for source lookup):
async function QkK(q, K, _, z, Y, A) {
    if (S6(process.env.DISABLE_COMPACT)) return { wasCompacted: !1 };
    if (Y?.consecutiveFailures !== void 0 && Y.consecutiveFailures >= wLK) return { wasCompacted: !1 };
    let O = K.options.mainLoopModel,
        w = K.getAppState().autoCompactWindow;
    if (!await gDY(q, O, w, z, A)) return { wasCompacted: !1 };
    let H = Y?.compacted === !0 && Y.turnCounter < a_7 ? (Y?.consecutiveRapidRefills ?? 0) + 1 : 0;
    if (H >= jLK) return E(`autocompact: rapid-refill breaker tripped — ${H} consecutive refills within <${a_7} turns each (last was ${Y?.turnCounter} turns)`, { level: "warn" }), { wasCompacted: !1, rapidRefillBreakerTripped: !0 };
    let J = {
            isRecompactionInChain: Y?.compacted === !0,
            turnsSincePreviousCompact: Y?.turnCounter ?? -1,
            previousCompactTurnId: Y?.turnId,
            autoCompactThreshold: v38(O, w),
            querySource: z
        },
        X = FDY() && u8("tengu_cold_compact", !1);
    try {
        let M = await vI6(q, K, _, !0, void 0, !0, J, X);
        return UDY(K, O, w), bs(void 0), _F(z, K.setAppState, K.resultDedupState),
               { wasCompacted: !0, compactionResult: M, consecutiveFailures: 0, consecutiveRapidRefills: H }
    } catch (M) {
        if (b6(M).startsWith(GI6)) return { wasCompacted: !1 };
        if (!p86(M, at)) j6(M);
        let W = (Y?.consecutiveFailures ?? 0) + 1;
        if (W >= wLK) E(`autocompact: circuit breaker tripped after ${W} consecutive failures — skipping future attempts this session`, { level: "warn" });
        return { wasCompacted: !1, consecutiveFailures: W }
    }
}

// READABLE (for understanding):
async function autocompactDispatcher(messages, sessionContext, deps, querySource, tracking, snipTokensFreed) {
  // Gate 1: env-disabled
  if (parseBoolean(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false };
  }

  // Gate 2: consecutive-failure breaker
  if (tracking?.consecutiveFailures !== undefined && tracking.consecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
    return { wasCompacted: false };
  }

  const model = sessionContext.options.mainLoopModel;
  const autoCompactWindow = sessionContext.getAppState().autoCompactWindow;

  // Gate 3: shouldCompact (threshold + ant-user gate + querySource exclusions)
  if (!(await shouldCompact(messages, model, autoCompactWindow, querySource, snipTokensFreed))) {
    return { wasCompacted: false };
  }

  // Gate 4: rapid-refill breaker
  const rapidRefills = tracking?.compacted === true && tracking.turnCounter < RAPID_REFILL_TURN_WINDOW
    ? (tracking?.consecutiveRapidRefills ?? 0) + 1
    : 0;
  if (rapidRefills >= RAPID_REFILL_LIMIT) {
    log(`autocompact: rapid-refill breaker tripped — ${rapidRefills} consecutive refills within <${RAPID_REFILL_TURN_WINDOW} turns each (last was ${tracking?.turnCounter} turns)`, { level: "warn" });
    return { wasCompacted: false, rapidRefillBreakerTripped: true };
  }

  // Build recompaction metadata for vI6
  const recompactionInfo = {
    isRecompactionInChain: tracking?.compacted === true,
    turnsSincePreviousCompact: tracking?.turnCounter ?? -1,
    previousCompactTurnId: tracking?.turnId,
    autoCompactThreshold: getAutoCompactThreshold(model, autoCompactWindow),
    querySource,
  };
  const stripNonEssential = isCacheCold() && featureGate("tengu_cold_compact", false);

  // Gate 5: actually call vI6
  try {
    const compactionResult = await compactConversation(messages, sessionContext, deps, /*originalLastUuid=*/true, undefined, /*isAuto=*/true, recompactionInfo, stripNonEssential);
    notifyExperimentSourceIfApplicable(sessionContext, model, autoCompactWindow);
    clearLastCompactWarningSuppression(undefined);
    onCompactSucceeded(querySource, sessionContext.setAppState, sessionContext.resultDedupState);
    return { wasCompacted: true, compactionResult, consecutiveFailures: 0, consecutiveRapidRefills: rapidRefills };
  } catch (err) {
    if (errorMessage(err).startsWith(PRE_COMPACT_BLOCKED_PREFIX)) return { wasCompacted: false };
    if (!isUserAbortError(err, USER_ABORT_MSG)) reportError(err);
    const newConsecutiveFailures = (tracking?.consecutiveFailures ?? 0) + 1;
    if (newConsecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
      log(`autocompact: circuit breaker tripped after ${newConsecutiveFailures} consecutive failures — skipping future attempts this session`, { level: "warn" });
    }
    return { wasCompacted: false, consecutiveFailures: newConsecutiveFailures };
  }
}

// Mapping: QkK→autocompactDispatcher, q→messages, K→sessionContext, _→deps, z→querySource,
//          Y→tracking, A→snipTokensFreed, S6→parseBoolean, wLK→CONSECUTIVE_FAILURE_LIMIT,
//          gDY→shouldCompact, jLK→RAPID_REFILL_LIMIT, a_7→RAPID_REFILL_TURN_WINDOW,
//          vI6→compactConversation, v38→getAutoCompactThreshold, FDY→isCacheCold,
//          UDY→notifyExperimentSourceIfApplicable, bs→clearLastCompactWarningSuppression,
//          _F→onCompactSucceeded, GI6→PRE_COMPACT_BLOCKED_PREFIX, b6→errorMessage,
//          p86→isUserAbortError, at→USER_ABORT_MSG, j6→reportError, u8→featureGate
```

### Gate-by-Gate Walkthrough

| Gate | Check | Pass/Fail behavior |
|------|-------|--------------------|
| **1. Env** | `DISABLE_COMPACT` env var | Fail → `{wasCompacted: false}`, no telemetry |
| **2. Failure breaker** | `tracking.consecutiveFailures >= 3` | Fail → silent skip, breaker stays tripped |
| **3. shouldCompact** | `gDY(messages, model, window, source, snipFreed)` returns true | Fail → `{wasCompacted: false}` |
| **4. Refill breaker** | If previous compact within ≤2 turns AND now triggering again → `consecutiveRapidRefills + 1 >= 3` | Fail → emit warning + `{rapidRefillBreakerTripped: true}` (caller yields user error) |
| **5. vI6** | The actual LLM call | Try/catch wraps. PreCompact-blocked = silent skip. Other errors increment `consecutiveFailures` |

The dispatcher receives **6 arguments** but the 6th (`A` = `snipTokensFreed`) is only ever called with `undefined` or `0` in v2.1.112 — see [dead_code_audit.md](./dead_code_audit.md).

---

## 2. `shouldCompact` (`gDY`) — The Threshold Check

### What it does

Decides whether the current conversation has crossed the autocompact threshold, considering:
- Whether we're already in a compact-recursive query
- Whether autocompact is globally enabled
- Whether the user is "ant" (and therefore restricted to env/settings windows)
- The actual token count vs threshold

### Code Excerpt

```javascript
// ============================================
// shouldCompact - Threshold check + ant-user/source guards
// Location: chunks.159.mjs:1365-1377
// ============================================

// ORIGINAL (for source lookup):
async function gDY(q, K, _, z, Y = 0) {
    if (z === "session_memory" || z === "compact") return !1;
    if (!z0()) return !1;
    if (bx() && !Z38(K, _)) return !1;
    let A = vJ(q) - Y,
        O = v38(K, _),
        w = Yn(K, _);
    E(`autocompact: tokens=${A} threshold=${O} effectiveWindow=${w}`);
    let { isAboveAutoCompactThreshold: $ } = UM6(A, K, _);
    return $
}

// READABLE (for understanding):
async function shouldCompact(messages, model, autoCompactWindow, querySource, snipTokensFreed = 0) {
  // Reject internal queries that are themselves compact-related
  if (querySource === "session_memory" || querySource === "compact") return false;

  // Global env-or-setting disable
  if (!isAutoCompactEnabled()) return false;

  // Ant-user gate: restricted to user-configured windows
  if (isAntUser() && !isWindowFromEnvOrSettings(model, autoCompactWindow)) return false;

  // Token math
  const tokenCount = estimateMessageTokens(messages) - snipTokensFreed;
  const threshold = getAutoCompactThreshold(model, autoCompactWindow);
  const effectiveWindow = getEffectiveContextWindow(model, autoCompactWindow);
  log(`autocompact: tokens=${tokenCount} threshold=${threshold} effectiveWindow=${effectiveWindow}`);

  const { isAboveAutoCompactThreshold } = computeContextThresholds(tokenCount, model, autoCompactWindow);
  return isAboveAutoCompactThreshold;
}

// Mapping: gDY→shouldCompact, q→messages, K→model, _→autoCompactWindow, z→querySource,
//          Y→snipTokensFreed, z0→isAutoCompactEnabled, bx→isAntUser,
//          Z38→isWindowFromEnvOrSettings, vJ→estimateMessageTokens,
//          v38→getAutoCompactThreshold, Yn→getEffectiveContextWindow,
//          UM6→computeContextThresholds, E→log
```

### What does the `Y = 0` default tell us?

**The `Y = 0` default is the key tell**: `snipTokensFreed` is plumbed through the parameter list, but **no caller passes a value**. In the entire v2.1.112 source, `gDY` is called from exactly one site (`QkK` at chunks.159.mjs:1388: `await gDY(q, O, w, z, A)` where `A` is `QkK`'s 6th param) and `QkK` is called from exactly one site (chunks.154.mjs:1016: `await H.autocompact(U, v, ...)`) which **does not pass a 6th argument**. So `A` is always `undefined`, which becomes `0` via the default.

The wiring is intact for a hypothetical future Snip implementation, but the implementation never lands. See [dead_code_audit.md](./dead_code_audit.md).

### Why exclude `session_memory` and `compact` querySources?

The compact pipeline can recurse: a partial compact may load session memory which itself triggers another autocompact. To prevent infinite recursion, queries originating from "session_memory" or "compact" sources are exempt. This is consistent with how v2.1.88 handled the same flag.

### The Ant-User Gate

```javascript
if (isAntUser() && !isWindowFromEnvOrSettings(model, autoCompactWindow)) return false;
```

For internal Anthropic users (identified by `bx()`/`tengu_cobalt_raccoon` experiment), autocompact only fires when the user has explicitly configured a window via env var or settings — not when the window comes from the experiment or model default. This lets ant-team A/B test new model windows without their own sessions auto-compacting at unexpected sizes.

#### Version-diff note (v2.1.88 → v2.1.112)

The same flag `tengu_cobalt_raccoon` is read in both versions, but the **gate semantics differ**:

| Version | Gate | Effect |
|---|---|---|
| v2.1.88 source (autoCompact.ts:189-199) | Inside `feature('REACTIVE_COMPACT')`: `if (cobalt_raccoon) return false` | For ant users in reactive-only mode, **suppress autocompact entirely** so the reactive (server-driven prompt-too-long) path owns headroom |
| v2.1.112 binary (chunks.159.mjs:1370) | Top-level: `if (bx() && !Z38(K, _)) return false` | For ant users **with non-env/non-settings window source**, suppress autocompact. Ant users with explicit env/settings windows still get autocompact normally. |

Same flag → different consumers. The 2.1.88 version was a feature-flagged blanket suppression; the 2.1.112 version is a finer-grained window-source restriction that doesn't depend on `feature('REACTIVE_COMPACT')` (which itself is gone — see [VERSION_DIFF_2188_TO_21112.md § 3.B.1](./VERSION_DIFF_2188_TO_21112.md#3b1-tengu_cobalt_raccoon-flag--gate-semantics-changed)).

If you're tracking what `tengu_cobalt_raccoon` does for your build, the 2.1.112 semantics are what's live: it's an "ant identifier for window-source restriction", not a "reactive-only mode switch".

---

## 3. Threshold Math

The threshold is computed in three layers:

```
modelMaxContext (e.g. 200_000 from `ff(model, sdkBetas)`)
       │
       ▼
┌─────────────────────────────────────────────────┐
│  configuredWindow                                │
│  = Jn(model, userOverride).window                │
│  = min(modelMaxContext, configuredOverride)      │
└─────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│  effectiveWindow                                 │
│  = configuredWindow − min(maxOutputTokens, 20k)  │
│  (Yn function — reserves space for output)       │
└─────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│  autoCompactThreshold                            │
│  = effectiveWindow − 13_000  (default)           │
│  OR floor(effectiveWindow × pct/100) if env set  │
│  (v38 function)                                  │
└─────────────────────────────────────────────────┘
```

### `Yn` (getEffectiveContextWindow)

```javascript
// ============================================
// getEffectiveContextWindow - Window size after reserving space for output
// Location: chunks.159.mjs:1307-1314
// ============================================

// ORIGINAL:
function Yn(q, K) {
    let _ = Math.min(lc(q), uDY),
        z = z0() ? K : void 0,
        { window: Y } = Jn(q, z);
    return Y - _
}

// READABLE:
function getEffectiveContextWindow(model, autoCompactWindow) {
  const reservedForOutput = Math.min(getMaxOutputTokens(model), MAX_OUTPUT_RESERVATION);  // = 20_000
  const userOverride = isAutoCompactEnabled() ? autoCompactWindow : undefined;
  const { window: configuredWindow } = resolveWindowSource(model, userOverride);
  return configuredWindow - reservedForOutput;
}

// Mapping: Yn→getEffectiveContextWindow, q→model, K→autoCompactWindow,
//          lc→getMaxOutputTokens, uDY→MAX_OUTPUT_RESERVATION, z0→isAutoCompactEnabled,
//          Jn→resolveWindowSource
```

**Key insight**: even if the model's max-output is 64_000 (Sonnet 4.5), the reservation is capped at 20_000. This ensures that on a 200k model the effective window stays at ≥180k, even when the model's full output capacity is much larger. The trade-off: the agent may run into max-output-tokens limits more often on long responses, but the conversation can grow to 180k vs 136k.

### `v38` (getAutoCompactThreshold)

```javascript
// ============================================
// getAutoCompactThreshold - Where autocompact fires
// Location: chunks.159.mjs:1320-1332
// ============================================

// ORIGINAL:
function v38(q, K) {
    let _ = Yn(q, K),
        z = _ - t_7,
        Y = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
    if (Y) {
        let A = parseFloat(Y);
        if (!isNaN(A) && A > 0 && A <= 100) {
            let O = Math.floor(_ * (A / 100));
            return Math.min(O, z)
        }
    }
    return z
}

// READABLE:
function getAutoCompactThreshold(model, autoCompactWindow) {
  const effectiveWindow = getEffectiveContextWindow(model, autoCompactWindow);
  const defaultThreshold = effectiveWindow - AUTOCOMPACT_BUFFER;  // 13_000

  const pctOverride = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
  if (pctOverride) {
    const pct = parseFloat(pctOverride);
    if (!isNaN(pct) && pct > 0 && pct <= 100) {
      const overriddenThreshold = Math.floor(effectiveWindow * (pct / 100));
      return Math.min(overriddenThreshold, defaultThreshold);  // env override only ever LOWERS the threshold
    }
  }
  return defaultThreshold;
}

// Mapping: v38→getAutoCompactThreshold, q→model, K→autoCompactWindow,
//          Yn→getEffectiveContextWindow, t_7→AUTOCOMPACT_BUFFER (13_000)
```

### Why `Math.min(overriddenThreshold, defaultThreshold)`?

The user can use `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` to compact earlier (at 80% of effective window), but **cannot** use it to push the threshold higher than the safe default. This is a one-way slider: lower compact threshold for testing or aggressive pre-emption, but never raise it above the safe (`window − 13k`) line. The 13k buffer is the safety zone — if a single user message arrives at threshold-time and pushes the conversation by a few thousand tokens, there must still be room for the inevitable system prompts and assistant response. Allowing `PCT_OVERRIDE > effective − 13k` would defeat that safety.

### `Jn` (resolveWindowSource) — 4-Level Priority

```javascript
// ============================================
// resolveWindowSource - 4-level priority for window size
// Location: chunks.159.mjs:1266-1298
// ============================================

// ORIGINAL:
function Jn(q, K) {
    let _ = ff(q, eM());
    if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
        let Y = Lp("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, o_7, $LK);
        if (Y.status !== "invalid") {
            let A = Math.max(o_7, Y.effective);
            return { window: Math.min(_, A), configured: A, source: "env" }
        }
    }
    if (K !== void 0) return { window: Math.min(_, K), configured: K, source: "settings" };
    let z = z0() ? u8("tengu_amber_redwood", "") : "";
    if (z) {
        let Y = s_7(z);
        if (Y !== void 0) return { window: Math.min(_, Y), configured: Y, source: "experiment" }
    }
    return { window: _, configured: _, source: "model" }
}

// READABLE:
function resolveWindowSource(model, userOverride) {
  const modelDefault = getModelContextWindow(model, currentSessionMode());

  // Priority 1: env var
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    const parsed = parseEnvInt("CLAUDE_CODE_AUTO_COMPACT_WINDOW", process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW, MIN_AUTOCOMPACT, MAX_AUTOCOMPACT);
    if (parsed.status !== "invalid") {
      const window = Math.max(MIN_AUTOCOMPACT, parsed.effective);
      return { window: Math.min(modelDefault, window), configured: window, source: "env" };
    }
  }

  // Priority 2: settings (UI)
  if (userOverride !== undefined) {
    return { window: Math.min(modelDefault, userOverride), configured: userOverride, source: "settings" };
  }

  // Priority 3: experiment (`tengu_amber_redwood`)
  const experimentValue = isAutoCompactEnabled() ? featureGate("tengu_amber_redwood", "") : "";
  if (experimentValue) {
    const parsed = parseExperimentValue(experimentValue);
    if (parsed !== undefined) {
      return { window: Math.min(modelDefault, parsed), configured: parsed, source: "experiment" };
    }
  }

  // Priority 4: model default
  return { window: modelDefault, configured: modelDefault, source: "model" };
}

// Mapping: Jn→resolveWindowSource, q→model, K→userOverride, ff→getModelContextWindow,
//          eM→currentSessionMode, Lp→parseEnvInt, o_7→MIN_AUTOCOMPACT (100_000),
//          $LK→MAX_AUTOCOMPACT (1_000_000), z0→isAutoCompactEnabled, u8→featureGate,
//          s_7→parseExperimentValue
```

### Window-Source Priority Notes

- **All four sources are clamped to `min(..., modelDefault)`** — you cannot configure a window larger than what the model supports.
- **Min/max bounds** for env var: 100,000 ≤ value ≤ 1,000,000.
- **Experiment value parser** (`s_7`): accepts `"800k"`, `"1m"`, plain integer 100–1000 (treated as thousands), or raw integer otherwise.
- **`tengu_amber_redwood` experiment** lets ant-team A/B test reduced effective windows without touching model side. When the experiment fires AND triggers a compact, `UDY` adds a notification: `compacted at <window> · override with CLAUDE_CODE_AUTO_COMPACT_WINDOW=1000000`.

### `UDY` — Experiment Notification

```javascript
// ============================================
// notifyExperimentSourceIfApplicable - Tells the user when a compact was triggered by an experiment
// Location: chunks.159.mjs:1430-1441
// ============================================

// ORIGINAL:
function UDY(q, K, _) {
    let { source: z, configured: Y } = Jn(K, _);
    if (z !== "experiment") return;
    q.addNotification?.({
        key: "autocompact-experiment-hint",
        text: `compacted at ${h3(Y)} · override with CLAUDE_CODE_AUTO_COMPACT_WINDOW=1000000`,
        priority: "medium"
    })
}

// READABLE:
function notifyExperimentSourceIfApplicable(sessionContext, model, autoCompactWindow) {
  const { source, configured } = resolveWindowSource(model, autoCompactWindow);
  if (source !== "experiment") return;
  sessionContext.addNotification?.({
    key: "autocompact-experiment-hint",
    text: `compacted at ${formatTokens(configured)} · override with CLAUDE_CODE_AUTO_COMPACT_WINDOW=1000000`,
    priority: "medium"
  });
}
// Mapping: UDY→notifyExperimentSourceIfApplicable, Jn→resolveWindowSource, h3→formatTokens
```

This notification is the user's *only* hint that they're in an experiment-shrunk window — no other UI indicates `tengu_amber_redwood` is active.

---

## 4. The Status Calculator (`UM6`)

`UM6` is the function that the UI status bar calls every render. It returns four threshold flags plus a percentage. All thresholds are computed off the same `effectiveWindow`:

```javascript
// ============================================
// computeContextThresholds - UI status calculator (warning/error/auto-compact/blocking)
// Location: chunks.159.mjs:1334-1357
// ============================================

// ORIGINAL:
function UM6(q, K, _) {
    let z = z0(),
        Y = z ? _ : void 0,
        A = v38(K, Y),
        O = z ? A : Yn(K, Y),
        w = Math.max(0, Math.round((O - q) / O * 100)),
        $ = O - mDY,
        j = O - BDY,
        H = q >= $,
        J = q >= j,
        X = z && q >= A,
        P = Yn(K, Y) - e_7,
        W = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE,
        D = W ? parseInt(W, 10) : NaN,
        Z = !isNaN(D) && D > 0 ? D : P,
        G = q >= Z;
    return {
        percentLeft: w,
        isAboveWarningThreshold: H,
        isAboveErrorThreshold: J,
        isAboveAutoCompactThreshold: X,
        isAtBlockingLimit: G
    }
}

// READABLE:
function computeContextThresholds(tokenCount, model, autoCompactWindow) {
  const autoCompactEnabled = isAutoCompactEnabled();
  const effectiveOverride = autoCompactEnabled ? autoCompactWindow : undefined;

  const autoCompactThreshold = getAutoCompactThreshold(model, effectiveOverride);
  const ceiling = autoCompactEnabled ? autoCompactThreshold : getEffectiveContextWindow(model, effectiveOverride);

  const percentLeft = Math.max(0, Math.round((ceiling - tokenCount) / ceiling * 100));
  const warningThreshold = ceiling - WARNING_THRESHOLD_OFFSET;     // 20_000
  const errorThreshold = ceiling - ERROR_THRESHOLD_OFFSET;         // 20_000
  const isAboveWarningThreshold = tokenCount >= warningThreshold;
  const isAboveErrorThreshold = tokenCount >= errorThreshold;
  const isAboveAutoCompactThreshold = autoCompactEnabled && tokenCount >= autoCompactThreshold;

  // Blocking limit: env override or default (effectiveWindow - 3000)
  const defaultBlockingLimit = getEffectiveContextWindow(model, effectiveOverride) - BLOCKING_LIMIT_RESERVE;
  const envOverride = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE;
  const parsedOverride = envOverride ? parseInt(envOverride, 10) : NaN;
  const blockingLimit = !isNaN(parsedOverride) && parsedOverride > 0 ? parsedOverride : defaultBlockingLimit;
  const isAtBlockingLimit = tokenCount >= blockingLimit;

  return { percentLeft, isAboveWarningThreshold, isAboveErrorThreshold, isAboveAutoCompactThreshold, isAtBlockingLimit };
}

// Mapping: UM6→computeContextThresholds, q→tokenCount, K→model, _→autoCompactWindow,
//          z→autoCompactEnabled, Y→effectiveOverride, A→autoCompactThreshold,
//          O→ceiling, w→percentLeft, $→warningThreshold, j→errorThreshold,
//          H→isAboveWarningThreshold, J→isAboveErrorThreshold, X→isAboveAutoCompactThreshold,
//          P→defaultBlockingLimit, Z→blockingLimit, G→isAtBlockingLimit,
//          mDY→WARNING_THRESHOLD_OFFSET (20_000), BDY→ERROR_THRESHOLD_OFFSET (20_000),
//          e_7→BLOCKING_LIMIT_RESERVE (3_000)
```

### What the four thresholds mean

| Threshold | Computation | What happens at this level |
|-----------|-------------|----------------------------|
| Warning | `ceiling − 20_000` | UI shows orange "context low" indicator |
| Error | `ceiling − 20_000` | Same as warning currently — UI shows red |
| AutoCompact | `effectiveWindow − 13_000` (the *real* trigger) | `gDY` returns true, `vI6` fires |
| Blocking | `effectiveWindow − 3_000` (or env override) | `isAtBlockingLimit` returns true → caller short-circuits with `cI` error |

> **Note on warning vs error:** in current v2.1.112 these have identical offsets (both 20k). Two separate constants exist (`mDY`, `BDY`) so they can diverge in future builds without code changes. The UI may render them with different styling.

### What is `ceiling`?

When auto-compact is enabled, `ceiling = autoCompactThreshold` — the warning/error fires *relative to* where compact will trigger.
When auto-compact is disabled, `ceiling = effectiveWindow` — the warning/error fires *relative to* where the API will reject.

This makes the percent-left number user-friendly: when autocompact is on, "0% left" means "compact is about to fire," not "you'll hit the API hard wall."

---

## 5. Cold-Cache Detection (`FDY`)

```javascript
// ============================================
// isCacheCold - Has it been ≥1.5h since last activity?
// Location: chunks.159.mjs:1316-1318
// ============================================

// ORIGINAL:
function FDY() {
    return Date.now() - AV() >= pDY
}

// READABLE:
function isCacheCold() {
  return Date.now() - getLastActivityTimestamp() >= COLD_CACHE_THRESHOLD;  // = 5_400_000ms = 1.5h
}
// Mapping: FDY→isCacheCold, AV→getLastActivityTimestamp, pDY→COLD_CACHE_THRESHOLD (5_400_000ms)
```

Used in conjunction with the `tengu_cold_compact` feature flag to decide whether to send a stripped-down compact request:

```javascript
// In QkK at chunks.159.mjs:1405:
let X = FDY() && u8("tengu_cold_compact", !1);
// If true → vI6 receives stripNonEssential=true → SDY/CDY filters apply
```

The reasoning: a cold cache means the upstream prompt cache TTL has expired anyway, so there's no point investing in cache-prefix sharing. Strip down to bare minimum to reduce input cost on the inevitable re-warm. See [cold_compact.md](./cold_compact.md).

---

## 6. The Two Circuit Breakers

The autocompact pipeline has TWO independent circuit breakers, both with threshold 3:

| Breaker | Constant | Trips when | Behavior |
|---------|----------|------------|----------|
| Consecutive-failure | `wLK = 3` | LLM call failed (non-PreCompact, non-abort) 3× in a row | Skip silently; logs "circuit breaker tripped" |
| Rapid-refill | `jLK = 3` within `a_7 = 3` turn window | Compaction succeeded but the next compaction fired within ≤2 turns of the previous, 3× in a row | Skip + emit `okK` error message asking user to /clear |

### Why two breakers?

These detect orthogonal failure modes:

- **Consecutive failure**: the API or network is broken. Bail out so we don't burn cycles re-throwing.
- **Rapid refill**: the *content* is structurally too large. A single tool result (or single user message) is so big that the post-compact context starts already-near-threshold. Compacting the same content N times in a row achieves nothing but burns input tokens, and the user needs to know.

The rapid-refill error message:

```
Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3 times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.
```

### Reset semantics

| Event | `consecutiveFailures` | `consecutiveRapidRefills` |
|-------|------------------------|----------------------------|
| Successful autocompact | → 0 | → calculated based on turn distance |
| Failed autocompact (non-PreCompact, non-abort) | += 1 | unchanged |
| PreCompact-blocked | unchanged | unchanged (silent skip) |
| User-abort (`at` error) | += 1 (but not logged as error) | unchanged |
| Rapid-refill breaker trip | unchanged | += 1 |
| Successful + previous compact > 3 turns ago | → 0 | → 0 |

See [edge_cases_and_failures.md](./edge_cases_and_failures.md) for full failure-mode reference.

---

## 7. Sample Walkthrough: A 200K Sonnet Session at 168K Tokens

Setup:
- Model: Sonnet 4.5 (200,000 context window)
- `autoCompactEnabled: true`
- `autoCompactWindow: undefined` (no setting)
- `tengu_amber_redwood: ""` (no experiment)
- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE: undefined`
- `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE: undefined`

Resolution:
1. `Jn(model, undefined)` → modelDefault=200000, no env, no settings, no experiment → `{window: 200000, source: "model"}`
2. `lc(model)` = 64000, `min(64000, 20000)` = 20000 → `Yn(model, undefined)` = 200000 − 20000 = 180000
3. `v38(model, undefined)` = 180000 − 13000 = **167000** (autocompact threshold)
4. `UM6(168000, model, undefined)`:
   - autoCompactEnabled=true, ceiling=167000
   - percentLeft = max(0, round((167000 − 168000) / 167000 × 100)) = 0%
   - warningThreshold = 167000 − 20000 = 147000 → isAboveWarningThreshold=true
   - errorThreshold = 167000 − 20000 = 147000 → isAboveErrorThreshold=true
   - autoCompactThreshold = 167000 → isAboveAutoCompactThreshold=true
   - blockingLimit = 180000 − 3000 = 177000 → isAtBlockingLimit=false (will block at 177000)
5. `gDY(...)` returns true (`isAboveAutoCompactThreshold`)
6. `QkK` proceeds to gates 4 & 5 → `vI6` runs

After compact: assume post-compact tokens = 50000. Next turn, `gDY` returns false because 50000 < 167000.

If next turn is huge (say a 130K file read pushes us to 180K instantly), `gDY` returns true again, `consecutiveRapidRefills = 1` (because previous compact was 1 turn ago), `vI6` runs again. This continues until either (a) the rapid pattern breaks, or (b) `consecutiveRapidRefills >= 3` and the user sees the thrash error.

---

## 8. The 6 Symbols That Determine Triggering

| Symbol | Location | Type | Role |
|--------|----------|------|------|
| `z0` | chunks.159.mjs:1359 | function | global enable check (env + setting) |
| `bx` | chunks.101.mjs:1530 | function | ant-user check (`tengu_cobalt_raccoon`) |
| `Z38` | chunks.159.mjs:1300 | function | window-source restriction for ant users |
| `Jn` | chunks.159.mjs:1266 | function | window source resolution |
| `gDY` | chunks.159.mjs:1365 | function | the actual yes/no decision |
| `QkK` | chunks.159.mjs:1379 | function | the dispatcher with the 5-gate cascade |

A user who wants to **disable** autocompact can set `DISABLE_AUTO_COMPACT=true` (preferred) or `DISABLE_COMPACT=true` (also disables `/compact`).

A user who wants to **trigger earlier** can set `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` (compact at 80% of effective window).

A user who wants to **shrink the effective window** (e.g. for testing) can set `CLAUDE_CODE_AUTO_COMPACT_WINDOW=120000`.

A user who wants to **raise the blocking limit** can set `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE=199000`.
