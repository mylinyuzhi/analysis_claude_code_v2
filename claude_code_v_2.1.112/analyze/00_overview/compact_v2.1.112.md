# Compact in v2.1.112 — Detailed Implementation Analysis

This document analyzes the **complete compact subsystem in Claude Code v2.1.112** by reading the obfuscated source (`claude_code_v_2.1.112/source/chunks.*.mjs`) and contrasts it with the v2.1.88 source-available reference (`claude-code-kim/src/services/compact/`).

The user prompt that motivated this document was:
> "2.1.88 的源码缺乏 snip 和 collapse 的实现，2.1.112 是否实现"
> ("v2.1.88 source lacks snip/collapse implementations — does v2.1.112 ship them?")

**Short answer:** **No.** Both `snip` and `context-collapse` (codename `marble-origami`) remain feature-flagged dead code that is **eliminated at bundle time** in 2.1.112. The shipped binary contains only:
- The full **autocompact** pipeline (LLM-based summarization)
- A no-op **microcompact wrapper** plus a server-driven **KEEP-RECENT MC** (`qD4`) reachable only via the `context_hint` reject path
- Persistence shims for marble-origami entries (write-only — no reader)
- The single API context-management strategy `clear_thinking_20251015`

---

## 1. Executive Summary

| Subsystem | 2.1.88 source | 2.1.112 shipped binary |
|-----------|---------------|------------------------|
| Autocompact dispatcher (`autoCompact.ts` ↔ `QkK`) | ✅ shipped | ✅ shipped — `chunks.159.mjs:1379-1428` |
| Full LLM compact (`compactConversation` ↔ `vI6`) | ✅ shipped | ✅ shipped — `chunks.159.mjs:574-747` |
| Compact prompt builder (`fx8`) | ✅ shipped | ✅ shipped — `chunks.101.mjs:679-788` |
| Partial compact (`zLK`) up_to / from-cursor variant | ✅ shipped | ✅ shipped — `chunks.159.mjs:749-907` |
| Cold-compact heuristic (1.5h idle) | ✅ shipped | ✅ shipped — `pDY = 5400000`, gated on `tengu_cold_compact` |
| Cache-prefix compact (`tengu_compact_cache_prefix`) | ✅ shipped | ✅ shipped — `chunks.159.mjs:957-1000` |
| PreCompact hook with `decision: "block"` | ✅ shipped | ✅ shipped — `GI6 = "Compaction blocked by PreCompact hook"` |
| Auto-compact threshold + window experiment | ✅ shipped | ✅ shipped — `Jn` + `tengu_amber_redwood` |
| Consecutive-failure breaker (`wLK = 3`) | ✅ shipped | ✅ shipped |
| Rapid-refill breaker (`jLK = 3` / `a_7 = 3`) | ✅ shipped | ✅ shipped |
| Time-based microcompact (`maybeTimeBasedMicrocompact` → `qD4`) | ✅ shipped | ⚠️ **gated** — only via `context_hint` reject |
| Cached microcompact (`cache_edits` API beta) | ⚠️ stub-only (`./cachedMicrocompact.js` not in source bundle) | ❌ **NOT shipped** (no callsites) |
| API context-management `clear_tool_uses_20250919` | ✅ shipped (ant-only env-gated) | ❌ **NOT shipped** |
| API context-management `clear_thinking_20251015` | ✅ shipped | ✅ shipped — `C85` in `chunks.194.mjs:741-752` |
| `context-hint-2026-04-09` beta + 422/424 reject path | ❌ **NOT in 2.1.88** | ✅ **NEW** — `chunks.194.mjs:790-944` |
| **`snip` (snipTokensFreed mechanism)** | ⚠️ parameter exists (`autoCompact.ts:167`); no implementation file | ⚠️ same — `gDY(q, K, _, z, Y = 0)` in `chunks.159.mjs:1365` (no caller passes `Y > 0`) |
| **`marble-origami` runtime logic** (`applyCollapsesIfNeeded`, `recoverFromOverflow`, `isWithheldPromptTooLong`, `isContextCollapseEnabled`) | ⚠️ require()d behind `feature('CONTEXT_COLLAPSE')` — `services/contextCollapse/` directory missing from bundle | ❌ **dead-code-eliminated** — none of these symbols appear in any chunk |
| `marble-origami` persistence shim (`recordContextCollapseSnapshot`, `recordContextCollapseCommit`) | ⚠️ same module gating | ✅ **half-shipped** — `chunks.191.mjs:1102-1120` (`XtY`/`MtY`) but no caller emits the type strings |
| `CACHED_MICROCOMPACT` feature flag | gated | DCE removed (no string match) |
| `CONTEXT_COLLAPSE` feature flag (`marble_origami` codename) | gated | DCE removed (no string match) |

**Net: 2.1.112 actually ships *less* compact machinery than what 2.1.88's source intends.** Both features in question (snip, context-collapse) are gated behind feature flags whose negative branch is the entire shipped path. The bundler (rollup-style) treats `feature('FOO') ? require('./foo.js') : null` as a constant-fold when `feature()` is statically known, and removes the require'd module entirely.

---

## 2. Pipeline at a glance

The compact subsystem in 2.1.112 has **three independent entry points**, all funneling through the same `vI6` (`compactConversation`) implementation:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Per-turn agent loop (yy)                        │
│                          chunks.154.mjs:936-1226                         │
└──────────────────┬───────────────────────────┬──────────────────────────┘
                   │                           │
        microcompact (every turn)       autocompact (every turn)
        chunks.154.mjs:1006              chunks.154.mjs:1010
                   │                           │
                   ▼                           ▼
          _c (chunks.85.mjs:1207)      QkK (chunks.159.mjs:1379)
          NO-OP — just `return {       1. DISABLE_COMPACT env-gate
          messages: q }`                2. Consecutive-failure breaker (≥3 → skip)
                                        3. shouldCompact gate (gDY)
                                        4. Rapid-refill breaker (3 refills < 3 turns each)
                                        5. ─────► vI6 (full compact)


┌─────────────────────────────────────────────────────────────────────────┐
│                       Server-driven context_hint                         │
│                       chunks.194.mjs:856-944                             │
└──────────────────────────────────────────────────────────────────────────┘
   On 422/424 from API + context-hint-2026-04-09 beta ─►
       d85 → qD4 (KEEP-RECENT MC) + thinking-clear latch ─►
       retry the request once with reduced messages


┌─────────────────────────────────────────────────────────────────────────┐
│                    Manual /compact (and /compact <range>)                │
└──────────────────────────────────────────────────────────────────────────┘
   /compact ──► vI6 (chunks.159.mjs:574)
   /compact up_to|from <msg> ──► zLK (chunks.159.mjs:749, partialCompact)


┌─────────────────────────────────────────────────────────────────────────┐
│                   Reactive / overflow paths (tools, sessions)            │
└──────────────────────────────────────────────────────────────────────────┘
   isAtBlockingLimit (UM6) ─► caller short-circuits with `cI` error
   tool-result oversize (Vg1=500_000) ─► tool wrapper truncates pre-compact
```

The diagram makes one thing obvious: **`_c` (microcompact in the per-turn loop) is a no-op**. The actual local message-editing microcompact (`qD4`) only runs on the **error-recovery** path, after the API has refused a request with 422/424 (overflow). This is a behavior change from 2.1.88, where `microcompactMessages()` was supposed to fire pro-actively on every turn (for ant users) via the cached-MC path.

---

## 3. The autocompact dispatcher (`QkK`) — full deobfuscated walk-through

### The decision tree

The dispatcher applies **five gates** in strict order. Failing any one returns `{ wasCompacted: false }` without entering the (expensive) LLM call:

```
   QkK(messages, ctx, deps, source, tracking, snipTokensFreed)
        │
        ├── 1. process.env.DISABLE_COMPACT  ─── true ─► SKIP
        │
        ├── 2. tracking.consecutiveFailures >= 3   ─── true ─► SKIP (circuit open)
        │
        ├── 3. await shouldCompact(messages, model, autoCompactWindow,
        │                          source, snipTokensFreed)
        │      │
        │      ├── source ∈ {"session_memory","compact"}   ─── true ─► false
        │      ├── !autoCompactEnabled                     ─── true ─► false
        │      ├── ant + non-env/non-settings window       ─── true ─► false
        │      └── tokenCount(msgs) - snipTokensFreed >= autoCompactThreshold
        │              ─── false ─► SKIP
        │
        ├── 4. consecutiveRapidRefills + 1 >= 3
        │      AND last compact < 3 turns ago             ─── true ─► EMIT BREAKER ERROR
        │
        ├── 5. ───► vI6 (full compact)
        │      ├── try   ─► return { wasCompacted: true, compactionResult, ...}
        │      └── catch ─►
        │           ├── PreCompact-blocked  ─► return { wasCompacted: false }
        │           ├── user abort          ─► rethrow uncaught
        │           └── other               ─► consecutiveFailures++ ; if ==3 log breaker
```

### Gate 4: the rapid-refill breaker (deep-dive)

The autocompact pipeline has TWO independent circuit breakers, both with threshold 3:

| Breaker | Constant | Trips when | Behavior |
|---------|----------|------------|----------|
| Consecutive-failure | `wLK = 3` | LLM call failed (non-PreCompact, non-abort) 3× in a row | Skip silently; logs "circuit breaker tripped" |
| Rapid-refill | `jLK = 3` within `a_7 = 3` turn window | Compaction succeeded but the next compaction fired within ≤2 turns of the previous, 3× in a row | Skip + emit `okK` error message asking user to /clear |

The rapid-refill breaker exists because successful compaction that *immediately* triggers another compaction means a single tool result (or single user message) is so large that the post-compact context starts already-near-threshold — compacting the same content N times in a row achieves nothing but burns input tokens. The error message:

```
Autocompact is thrashing: the context refilled to the limit within 3 turns of the previous compact, 3 times in a row. A file being read or a tool output is likely too large for the context window. Try reading in smaller chunks, or use /clear to start fresh.
```

### Code excerpt

```javascript
// ============================================
// autocompactDispatcher - The autocompact entry point. Applies all gates and dispatches to vI6.
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
  if (parseBoolean(process.env.DISABLE_COMPACT)) return { wasCompacted: false };
  if (tracking?.consecutiveFailures !== undefined && tracking.consecutiveFailures >= CONSECUTIVE_FAILURE_LIMIT) {
    return { wasCompacted: false };
  }
  const model = sessionContext.options.mainLoopModel;
  const autoCompactWindow = sessionContext.getAppState().autoCompactWindow;

  if (!(await shouldCompact(messages, model, autoCompactWindow, querySource, snipTokensFreed))) {
    return { wasCompacted: false };
  }

  const rapidRefills = tracking?.compacted === true && tracking.turnCounter < RAPID_REFILL_TURN_WINDOW
    ? (tracking?.consecutiveRapidRefills ?? 0) + 1
    : 0;
  if (rapidRefills >= RAPID_REFILL_LIMIT) {
    log(`autocompact: rapid-refill breaker tripped — ${rapidRefills} consecutive refills within <${RAPID_REFILL_TURN_WINDOW} turns each (last was ${tracking?.turnCounter} turns)`, { level: "warn" });
    return { wasCompacted: false, rapidRefillBreakerTripped: true };
  }

  const recompactionInfo = {
    isRecompactionInChain: tracking?.compacted === true,
    turnsSincePreviousCompact: tracking?.turnCounter ?? -1,
    previousCompactTurnId: tracking?.turnId,
    autoCompactThreshold: getAutoCompactThreshold(model, autoCompactWindow),
    querySource,
  };
  const stripNonEssential = isCacheCold() && featureGate("tengu_cold_compact", false);

  try {
    const compactionResult = await compactConversation(messages, sessionContext, deps, /*isAuto=*/true, undefined, /*persistAndStreamFlag=*/true, recompactionInfo, stripNonEssential);
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

// Mapping: QkK→autocompactDispatcher, gDY→shouldCompact, vI6→compactConversation,
//          v38→getAutoCompactThreshold, FDY→isCacheCold, u8→featureGate,
//          UDY→notifyExperimentSourceIfApplicable, bs→clearLastCompactWarningSuppression,
//          _F→onCompactSucceeded, GI6→PRE_COMPACT_BLOCKED_PREFIX, at→USER_ABORT_MSG,
//          wLK→CONSECUTIVE_FAILURE_LIMIT, jLK→RAPID_REFILL_LIMIT, a_7→RAPID_REFILL_TURN_WINDOW
```

### `gDY` (shouldCompact) — what *Y* (snipTokensFreed) does

```javascript
// ============================================
// shouldCompact - Decides whether the autocompact threshold has been crossed.
// Location: chunks.159.mjs:1365-1377
// ============================================

// ORIGINAL:
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

// READABLE:
async function shouldCompact(messages, model, autoCompactWindow, querySource, snipTokensFreed = 0) {
  if (querySource === "session_memory" || querySource === "compact") return false;
  if (!isAutoCompactEnabled()) return false;
  if (isAntUser() && !isWindowFromEnvOrSettings(model, autoCompactWindow)) return false;

  const tokenCount = estimateMessageTokens(messages) - snipTokensFreed;
  const threshold = getAutoCompactThreshold(model, autoCompactWindow);
  const effectiveWindow = getEffectiveContextWindow(model, autoCompactWindow);
  log(`autocompact: tokens=${tokenCount} threshold=${threshold} effectiveWindow=${effectiveWindow}`);

  const { isAboveAutoCompactThreshold } = computeContextThresholds(tokenCount, model, autoCompactWindow);
  return isAboveAutoCompactThreshold;
}

// Mapping: gDY→shouldCompact, z0→isAutoCompactEnabled, bx→isAntUser,
//          Z38→isWindowFromEnvOrSettings, vJ→estimateMessageTokens,
//          v38→getAutoCompactThreshold, Yn→getEffectiveContextWindow,
//          UM6→computeContextThresholds, Y→snipTokensFreed
```

**The `Y = 0` default is the key tell**: `snipTokensFreed` is plumbed through the parameter list, but **no caller passes a value**. In the entire 2.1.112 source, `gDY` is called from exactly one site (`QkK` at chunks.159.mjs:1388: `await gDY(q, O, w, z, A)` where `A` is `QkK`'s 6th param) and `QkK` is called from exactly one site (`chunks.154.mjs:1016: await H.autocompact(U, v, ...)`) which **does not pass a 6th argument**. So `A` is always `undefined`, which becomes `0` via the default. The wiring is intact for a hypothetical future Snip implementation, but the implementation never lands.

**This matches 2.1.88 exactly** — `autoCompact.ts:225` reads `tokenCountWithEstimation(messages) - snipTokensFreed`, and the parameter is wired through but not bound in 2.1.88 either (the only assigned value is `0`, never anything from a real snip pass).

### Threshold math: how `v38` and `Yn` compute the autocompact line

```javascript
// ============================================
// getEffectiveContextWindow + getAutoCompactThreshold - Window math.
// Location: chunks.159.mjs:1307-1332
// ============================================

// ORIGINAL:
function Yn(q, K) {
    let _ = Math.min(lc(q), uDY),  // uDY = 20000 = soft cap on max-output reservation
        z = z0() ? K : void 0,
        { window: Y } = Jn(q, z);
    return Y - _
}
function v38(q, K) {
    let _ = Yn(q, K),
        z = _ - t_7,                // t_7 = 13000 — autocompact buffer
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
function getEffectiveContextWindow(model, autoCompactWindow) {
  const reservedForOutput = Math.min(getMaxOutputTokens(model), MAX_OUTPUT_RESERVATION);  // 20_000
  const userOverride = isAutoCompactEnabled() ? autoCompactWindow : undefined;
  const { window: configuredWindow } = resolveWindowSource(model, userOverride);
  return configuredWindow - reservedForOutput;
}

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

// Mapping: Yn→getEffectiveContextWindow, v38→getAutoCompactThreshold, lc→getMaxOutputTokens,
//          uDY→MAX_OUTPUT_RESERVATION, t_7→AUTOCOMPACT_BUFFER, Jn→resolveWindowSource
```

### Window-source priority (`Jn`)

```javascript
// ============================================
// resolveWindowSource - 4-level priority for window size.
// Location: chunks.159.mjs:1266-1298
// ============================================

// ORIGINAL: function Jn(q, K) { ... }
// READABLE:
function resolveWindowSource(model, userOverride) {
  const modelDefault = getModelContextWindow(model, currentSessionMode());  // env "model" source
  // Priority 1: env var
  if (process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW) {
    const parsed = parseEnv("CLAUDE_CODE_AUTO_COMPACT_WINDOW", env, MIN_AUTOCOMPACT, MAX_AUTOCOMPACT);
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
// Mapping: Jn→resolveWindowSource, ff→getModelContextWindow, eM→currentSessionMode,
//          o_7→MIN_AUTOCOMPACT (100_000), $LK→MAX_AUTOCOMPACT (1_000_000)
```

The `tengu_amber_redwood` experiment value is a string with optional `m`/`k` suffix (`"800k"`, `"1m"`, plain integer 100..1000 = thousands, otherwise raw). This lets ant-team experiment with reduced effective windows without touching the model side. When the experiment fires and triggers a compact, `UDY` adds a notification: `compacted at <window> · override with CLAUDE_CODE_AUTO_COMPACT_WINDOW=1000000` (chunks.159.mjs:1430-1441).

---

## 4. The full LLM compact (`vI6` / `compactConversation`)

`vI6` is the heart — both auto and manual `/compact` go through it. Walk-through:

### Phase 1: Pre-compact

1. **Token estimation** (`vJ(q)` → `estimateMessageTokens`).
2. **Permission switch** to `"summary"` mode (`_R6(...,"summary")`) — restricts the compact agent to only the `Kz` (summarization) tool.
3. **`onCompactProgress({type: "hooks_start", hookType: "pre_compact"})`** — UI signal.
4. **PreCompact hook fires** (`oc({trigger, customInstructions})`):
   - Hook can return `{ decision: "block", reason }` → `ec8` throws `BeError("Compaction blocked by PreCompact hook: <reason>")`.
   - Hook can return `{ decision: "allow", customInstructions }` → instructions are merged with user's via `r_7(Y, M.newCustomInstructions)`.
5. **Build the summary request** via `fx8(customInstructions)` (chunks.101.mjs:679-788) — see §6.

### Phase 2: LLM call (with PTL retry loop)

```
let G = q, k = 0
loop:
  v = await ALK({ messages: G, summaryRequest, ..., stripNonEssential })
  V = MJ6(v)                    // extract summary text
  if !V?.startsWith(cI):        // cI = "API Error: prompt too long"
    break
  k++
  if k > qLK (= 3):             // PTL retry limit
    throw "Conversation too long. Press esc twice to go up a few messages and try again."
  G = KLK(G, v)                 // truncate head: drop ~20% of messages or compute via Rh8(error)
```

### Phase 3: Cache-prefix compact (Phase 0, actually)

Before the main `eb6()` call, if `tengu_compact_cache_prefix = true` AND we're not stripping non-essential, `ALK` runs a **separate inner call** through `rP({...skipCacheWrite:true})`. This piggy-backs on the cached prefix (no separate cache write), saving cache-creation tokens by issuing the compact summary as a normal "fork" against the same cached input prefix. On success: emit `tengu_compact_cache_sharing_success` with hit rate. On failure / no-text response: fall through to the regular `eb6()` call and emit `tengu_compact_cache_sharing_fallback`.

### Phase 4: Post-compact reconstruction

```javascript
// chunks.159.mjs:642-674 (semantic excerpt)
let preservedReadFiles = pe6(K.readFileState);
K.readFileState.clear();                     // start with clean file cache post-compact
K.loadedNestedMemoryPaths?.clear();
sj6(K.memorySelector);                       // reset memory-search state

let [restoredFiles, restoredMemory] = await Promise.all([
  Nx8(preservedReadFiles, K, kx8 /* =5 */),  // POST_COMPACT_MAX_FILES_TO_RESTORE
  hx8(K),                                    // re-load CLAUDE.md hierarchy
]);
let attachments = [...restoredFiles, ...restoredMemory];

if (planAttachment = Ex8(K.agentId)) attachments.push(planAttachment);
if (asyncAgentAttachment = await Lx8(K)) attachments.push(asyncAgentAttachment);
if (skillAttachment = yx8(K.agentId)) attachments.push(skillAttachment);

// Re-enumerate tools, agent definitions, MCP tools — fresh system reminders
for (const reminder of MR6(...)) attachments.push(Y4(reminder));
for (const reminder of PR6(...)) attachments.push(Y4(reminder));
for (const reminder of WR6(...)) attachments.push(Y4(reminder));

// Run SessionStart hook to inject any external context
let hookResults = await lR("compact", { model: K.options.mainLoopModel });
```

The `kx8 = 5` (max files), `yDY = 50000` (token budget across files), `LDY = 5000` (per-file), `RDY = 25000` (skills budget), `hDY = 5000` (per-skill) constants exactly mirror 2.1.88's `POST_COMPACT_MAX_FILES_TO_RESTORE = 5`, `POST_COMPACT_TOKEN_BUDGET = 50_000`, etc.

### Phase 5: Boundary marker + telemetry

```javascript
let boundaryMarker = p18(isAuto ? "auto" : "manual", preCompactTokenCount, lastUUID);
let preservedToolDiscoveries = rc(messages);     // tools auto-discovered pre-compact
if (preservedToolDiscoveries.size > 0) boundaryMarker.compactMetadata.preCompactDiscoveredTools = [...].sort();

let summaryUserMsg = makeUserMessage({
  content: b18(summaryText, parentMsg, sessionFile, undefined, replContexts),
  isCompactSummary: true,
  isVisibleInTranscriptOnly: true,            // ← NOT included in API request after this
});

let postCompactPlannedTokens = sI([apiResponse]);
let truePostCompactTokens = qT([boundaryMarker, summaryUserMsg, ...attachments, ...hookResults]);
boundaryMarker.compactMetadata.postTokens = truePostCompactTokens;
boundaryMarker.compactMetadata.durationMs = Math.round(performance.now() - startTime);

emit("tengu_compact", { preCompactTokenCount, postCompactTokenCount: postCompactPlannedTokens, truePostCompactTokenCount: truePostCompactTokens, autoCompactThreshold, willRetriggerNextTurn: truePostCompactTokens >= autoCompactThreshold, isAutoCompact: isAuto, ... });
```

The **`willRetriggerNextTurn`** field is the post-compact health check — when true, the next turn will trip autocompact again, which is what the rapid-refill breaker counts.

### Phase 6: PostCompact hook

```javascript
let postHookResult = await K36({trigger: isAuto ? "auto" : "manual", compactSummary}, abortSignal);
let userDisplayMessage = [preHookDisplayMsg, postHookResult.userDisplayMessage].filter(Boolean).join("\n");
return {
  boundaryMarker, summaryMessages: [summaryUserMsg], attachments, hookResults,
  userDisplayMessage, preCompactTokenCount, postCompactTokenCount, truePostCompactTokenCount, compactionUsage
};
```

---

## 5. Microcompact in 2.1.112 — the part that's been cut down

In 2.1.88, `microcompactMessages()` in `microCompact.ts:253-293` runs every turn and does **two distinct things**:

1. **Time-based MC** (`maybeTimeBasedMicrocompact`) — if the gap to the last assistant message exceeds the cache TTL (1h), edits old tool results in-place to `'[Old tool result content cleared]'`.
2. **Cached MC** (ant-only, `feature('CACHED_MICROCOMPACT')`) — uses the `cache_edits` API to delete tool results without invalidating the cache; never modifies local message content.

In 2.1.112, the per-turn entry is a stub:

```javascript
// ============================================
// microcompactStub - Per-turn microcompact wrapper, no-op in 2.1.112.
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
// Mapping: _c→microcompactStub, a04→clearCompactWarningSuppression
```

**The actual local-edit microcompact lives in `qD4`** (chunks.85.mjs:1235-1274), but it is reachable from exactly one site: the `context_hint` reject handler `d85` at chunks.194.mjs:856-887. The flow is:

```
API request ──► response 422 / 424 (overflow) AND used context-hint-2026-04-09 beta
   │
   ▼
u85(error) returns true ──► classifyStreamError handles ──► onRequestError fires
   │
   ▼
NJ7({ messages, querySource, requestId })
   │
   ▼
d85(messages, querySource):
   1. If thinking-not-yet-cleared this session: clear thinking blocks, log token cost
   2. qD4(messages, querySource, { keepRecent: Q6A /* = 5 */ }):
        - Find all tool_use blocks for "compactable" tools
        - Pick the OLDEST (length - 5) of them
        - Replace their tool_result with "[Old tool result content cleared]" placeholder
        - Tally tokens saved
   3. Emit telemetry (tengu_context_hint_reject, tengu_thinking_clear_latched)
   4. Return { messages: clearedMessages, clearedIds, applied }
```

### `qD4` (KEEP-RECENT MC) details

```javascript
// ============================================
// keepRecentMicrocompact - Clears old tool results, keeps last N.
// Location: chunks.85.mjs:1235-1274
// ============================================

// ORIGINAL: function qD4(q, K, _) { ... }
// READABLE:
function keepRecentMicrocompact(messages, telemetryContext, opts) {
  const compactableIds = collectCompactableToolIds(messages);  // t4z(messages)
  const keepRecent = Math.max(1, opts.keepRecent);             // = Q6A = 5
  const recent = new Set(compactableIds.slice(-keepRecent));
  const old = new Set(compactableIds.filter(id => !recent.has(id)));
  if (old.size === 0) return null;

  let tokensSaved = 0;
  const newMessages = messages.map(msg => {
    if (msg.type !== "user" || !Array.isArray(msg.message.content)) return msg;
    let modified = false;
    const newContent = msg.message.content.map(block => {
      if (block.type === "tool_result" && old.has(block.tool_use_id) && block.content !== TIME_BASED_MC_CLEARED_MESSAGE) {
        tokensSaved += calculateToolResultTokens(block);
        modified = true;
        return { ...block, content: TIME_BASED_MC_CLEARED_MESSAGE };
      }
      return block;
    });
    return modified ? { ...msg, message: { ...msg.message, content: newContent } } : msg;
  });

  if (tokensSaved === 0) return null;

  emit("tengu_time_based_microcompact", {
    toolsCleared: old.size, toolsKept: recent.size, keepRecent: opts.keepRecent,
    tokensSaved, trigger: "context_hint",
  });
  log(`[KEEP-RECENT MC] context_hint trigger, cleared ${old.size} tool results (~${tokensSaved} tokens), kept last ${recent.size}`);
  notifyCacheDeletion();  // nj6
  resetMicrocompactState();  // SR
  if (isAntUser() && telemetryContext) i04(telemetryContext);

  return { messages: newMessages, tokensSaved, clearedIds: old };
}

// Mapping: qD4→keepRecentMicrocompact, t4z→collectCompactableToolIds,
//          o4z→COMPACTABLE_TOOLS_SET, sR8→TIME_BASED_MC_CLEARED_MESSAGE,
//          s4z→calculateToolResultTokens, Q6A→DEFAULT_KEEP_RECENT (5),
//          nj6→notifyCacheDeletion, SR→resetMicrocompactState
```

### Compactable tools

`o4z` (chunks.85.mjs:1297) is built once on module init and contains the tools whose results are eligible to be cleared:

```javascript
o4z = new Set([xq, ...dj6, a5, T9, hR, PH, J4, IK]);
// → { Bash, ...SHELL_TOOL_NAMES (e.g. PowerShell, Cmd), Glob, Grep, Read, WebFetch, Edit, Write }
// (subset matches 2.1.88 COMPACTABLE_TOOLS in microCompact.ts:41-50)
```

The set excludes `Task`, `SlashCommand`, `WebSearch` results, MCP tools, and others where retroactively clearing would break either reproducibility or attribution. Note that **the v2.1.88 `WEB_SEARCH_TOOL_NAME`** appears in the original COMPACTABLE_TOOLS — but in 2.1.112 the obfuscated set seems narrower. Verifying the exact symbols for chunks.85.mjs:1297 would require chasing through `dj6`, `a5`, `T9`, `hR`, `PH`, `J4`, `IK` definitions; left as future work.

---

## 6. The compact prompt (`fx8` / `Q0z`)

The summary request is built in two flavors — full and partial. Full version (`fx8`, chunks.101.mjs:679-788, ~3 KB):

> CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.
>
> - Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
> - You already have all the context you need in the conversation above.
> - Tool calls will be REJECTED and will waste your only turn — you will fail the task.
> - Your entire response must be plain text: an `<analysis>` block followed by a `<summary>` block.
>
> Your task is to create a detailed summary of the conversation so far, paying close attention to the user's explicit requests and your previous actions.
>
> Before providing your final summary, wrap your analysis in `<analysis>` tags...
>
> Your summary should include the following sections:
> 1. Primary Request and Intent: ...
> 2. Key Technical Concepts
> 3. Files and Code Sections
> 4. Errors and fixes
> 5. Problem Solving
> 6. All user messages
> 7. Pending Tasks
> 8. Current Work
> 9. Optional Next Step

**Notable v2.1.112 hardening (vs older versions):** The leading "CRITICAL: ... Tool calls will be REJECTED and will waste your only turn" block is unusually strong. The compact agent is launched with:
- `tools: [Kz]` (only the summarization-stub) — set at chunks.159.mjs:1004
- `thinkingConfig: { type: "disabled" }` — chunks.159.mjs:1011-1013
- `systemPrompt: ["You are a helpful AI assistant tasked with summarizing conversations."]` — chunks.159.mjs:1010

If the model still produces a `tool_use` block during compact, the `Kz` tool is `Or1()`'s permission stub which **rejects with**:

```
chunks.159.mjs:935-945:
  message: "Tool use is not allowed during compaction",
  decisionReason: { type: "other", reason: "compaction agent should only produce text summary" }
```

This three-layer defense (system prompt + prompt prefix + permission denier) was tightened over v2.1.x to handle a class of regressions where the compact agent attempted to re-run searches or read files instead of summarizing.

Partial version (`Q0z`, chunks.101.mjs:599-671) is similar but instructs that "newer messages will follow after your summary" (for `up_to` cursor), so the summary should be a *prefix* the future continuation builds on.

**Custom-instructions tail**: if the user has set a non-empty compact instruction (e.g. via `/compact "focus on the auth refactor"`) OR the PreCompact hook returned `newCustomInstructions`, those are appended at the end:

```
Additional Instructions:
<user/hook customInstructions>
<SI4 — global compact suffix>
```

`SI4` (chunks.101.mjs) is a global trailing block that stays constant across the prompt lifetime.

---

## 7. Cold-compact (`tengu_cold_compact` + `pDY = 5400000`)

The autocompact dispatcher passes `stripNonEssential = isCacheCold() && featureGate("tengu_cold_compact", false)` to `vI6`:

```javascript
function FDY() {  // isCacheCold
  return Date.now() - AV() >= pDY;  // pDY = 5_400_000 ms = 1.5 hours since last activity
}
```

When `stripNonEssential = true` (the cache is cold AND the experiment is on), `vI6` and `ALK` strip non-essential content from the compact request:
- `SDY(M)` removes images/documents/large attachments from the messages
- `CDY(P)` further trims to "essential" only
- `tools: []` (no tool definitions sent at all — empty array)
- `tengu_compact_cache_prefix` is **disabled** (`!w` overrides — `957: !O && u8("tengu_compact_cache_prefix", !0)`)

The reasoning: a cold cache means the upstream prompt cache TTL has expired anyway, so there's no point investing in cache-prefix sharing. Strip down to bare minimum to reduce input cost on the inevitable re-warm.

---

## 8. PreCompact / PostCompact hooks

PreCompact (`oc`):
- Trigger: `"auto"` (autocompact) or `"manual"` (`/compact`).
- Returns: `{ decision?: "block" | "allow", reason?: string, newCustomInstructions?: string, userDisplayMessage?: string }`.
- Block path: `ec8(M, K, ...)` at chunks.159.mjs:533-544 throws a `BeError("Compaction blocked by PreCompact hook: <reason>")`. The dispatcher (`QkK`) catches errors whose message starts with `GI6 = "Compaction blocked by PreCompact hook"` and **silently skips** without bumping `consecutiveFailures`. So PreCompact-blocked is NOT a circuit-breaker hit.

PostCompact (`K36`):
- Trigger: `"auto"` or `"manual"`.
- Receives: `{ trigger, compactSummary }`.
- Returns: `{ userDisplayMessage }` only — no decision.
- Combined with PreCompact's `userDisplayMessage` and shown above the post-compact prompt.

These are wired through `_c8` (chunks.155.mjs in subagents), `cI4`/`lI4` (tool definitions in chunks.101.mjs), and the PreCompact hook surface added in v2.1.105 (see `by_version/v2.1.105.md`).

---

## 9. The 422/424 + `context_hint` reject path (NEW in v2.1.112-era)

The `context-hint-2026-04-09` beta header signals to the API server that the client supports a self-correcting overflow path. When the request would overflow:

- Server returns **HTTP 422** or **424** (`u85(error) === true`).
- Client's `onRequestError` handler runs `NJ7({messages, querySource, requestId})` → `d85(messages, querySource)`.
- `d85` first calls `qD4` (KEEP-RECENT MC) AND, if not yet done this session, clears all `thinking` and `redacted_thinking` blocks (latched once via `Op6()` / `wp6(true)`).
- Returns `{messages: cleared, clearedIds, thinkingCleared}` — the caller retries the request once.

There's also `context_hint_busy_fallback` (status 409 → server is too busy to apply context-hint, fall back gracefully) and `context_hint_sse` (SSE-stream classifier error → handles when overflow surfaces mid-stream).

This is fundamentally a **server-driven** alternative to local autocompact for the moments when the local threshold heuristic fails or the user has autocompact disabled. It coexists with local autocompact rather than replacing it: a typical session sees `QkK` fire dozens of times, and `d85` rarely or never (only when the local heuristic mis-counted, e.g. due to large tool_use inputs that estimateMessageTokens underestimates).

The `tengu_hazel_osprey` flag (chunks.194.mjs:790-792) controls whether the entire context-hint subsystem is active:
```javascript
function x85() { return featureGate("tengu_hazel_osprey", false); }
```

---

## 10. Marble-origami persistence (the only `CONTEXT_COLLAPSE` artifact left)

Only **two** functions in 2.1.112 reference the `marble-origami` codename, and both are append-to-session-log shims with no readers:

```javascript
// ============================================
// recordContextCollapseCommit / recordContextCollapseSnapshot - Persistence shims.
// Location: chunks.191.mjs:1102-1120
// ============================================

// ORIGINAL:
async function XtY(q) {
    let K = I8();
    if (!K) return;
    await x_().appendEntry({ type: "marble-origami-commit", sessionId: K, ...q })
}
async function MtY(q) {
    let K = I8();
    if (!K) return;
    await x_().appendEntry({ type: "marble-origami-snapshot", sessionId: K, ...q })
}

// READABLE:
async function recordContextCollapseCommit(commit) {
  const sessionId = getCurrentSessionId();
  if (!sessionId) return;
  await getSessionWriter().appendEntry({ type: "marble-origami-commit", sessionId, ...commit });
}
async function recordContextCollapseSnapshot(snapshot) {
  const sessionId = getCurrentSessionId();
  if (!sessionId) return;
  await getSessionWriter().appendEntry({ type: "marble-origami-snapshot", sessionId, ...snapshot });
}

// Mapping: XtY→recordContextCollapseCommit, MtY→recordContextCollapseSnapshot,
//          I8→getCurrentSessionId, x_→getSessionWriter
```

`cli.chunks.mjs:9124-9125` re-exports both:
```javascript
recordContextCollapseSnapshot: () => MtY,
recordContextCollapseCommit: () => XtY,
```

But **no code in any chunk calls these functions**. Searches for the referencing literals (`marble-origami-commit`, `marble-origami-snapshot`) hit only the function bodies themselves. So the shipped binary contains write-side persistence with no caller — perfect dead code that the bundler kept because it's exported through the public-API surface.

Symbols that 2.1.88 references but 2.1.112 does not contain:
- `applyCollapsesIfNeeded` ❌
- `recoverFromOverflow` ❌
- `isWithheldPromptTooLong` ❌
- `isContextCollapseEnabled` ❌
- `resetContextCollapse` ❌
- `CtxInspectTool` ❌
- The string `<collapsed>` ❌
- The string `marble_origami` (with underscore — feature-flag string) ❌
- The string `tengu_context_collapse` ❌

The only partial linkage that survived is the **session-log persistence shim** (because it was extracted into a file outside `services/contextCollapse/` — likely `services/sessions/persist.ts` in 2.1.88 — and is exported through the SDK's session-log iterator, which is shared with non-collapse code paths).

**Conclusion for `collapse`:** v2.1.112 ships **less** of context-collapse than the 2.1.88 source-tree describes. 2.1.88 source has *placeholder require()s* into a missing directory. 2.1.112 has *the placeholder require()s removed* AND *the persistence shim still exported but never called*. Neither version actually runs collapse logic.

---

## 11. Snip — what the 2.1.88 source/collapse references mean

The `snipTokensFreed` parameter in 2.1.88's `autoCompact.ts` (line 167) and the comment block at lines 164-166:

```typescript
// Snip removes messages but the surviving assistant's usage still reflects
// pre-snip context, so tokenCountWithEstimation can't see the savings.
// Subtract the rough-delta that snip already computed.
snipTokensFreed = 0,
```

…strongly implies a separate "snip" operation that:
1. Surgically deletes messages locally (the comment "Snip removes messages")
2. Reports the rough token-count saved (the `snipTokensFreed` value passed back)
3. Is run *before* the autocompact threshold check, so the threshold sees the post-snip count

In 2.1.88, no such caller / implementation exists in the source bundle — `snipTokensFreed` is only ever the default `0`. **In 2.1.112, the situation is identical**: the parameter is plumbed through (`Y = 0` on `gDY`), but no caller passes a non-zero value. The implementation that would have populated this — likely under `feature('CONTEXT_COLLAPSE')` or another flag — is dead-code-eliminated.

A reasonable reading: **snip and context-collapse are the same feature, viewed from different vantage points**. Context-collapse (`marble-origami`) is the user-facing name for an LLM-driven message-archival system; "snip" is the surgical-deletion primitive that the collapse agent emits. The autocompact path needed to know how many tokens snip had freed (without re-tokenizing) so its threshold heuristic stayed correct after snip ran. Removing collapse from the bundle removes the only producer of `snipTokensFreed > 0`, which renders the parameter vestigial — but since it's a default-valued parameter, removing it is a behavior-equivalent refactor that hasn't been done yet.

---

## 12. Constants reference

| Constant | Value | 2.1.88 name | Purpose |
|---------:|------:|-------------|---------|
| `wLK` | 3 | `CONSECUTIVE_FAILURE_LIMIT` | autocompact circuit breaker (consecutive errors) |
| `jLK` | 3 | (new in 2.1.89) | rapid-refill breaker count |
| `a_7` | 3 | (new in 2.1.89) | rapid-refill turn window |
| `qLK` | 3 | (PTL_RETRY_LIMIT) | prompt-too-long retry attempts within `vI6` |
| `kx8` | 5 | `POST_COMPACT_MAX_FILES_TO_RESTORE` | max files re-attached post-compact |
| `yDY` | 50,000 | `POST_COMPACT_TOKEN_BUDGET` | total budget for restored files |
| `LDY` | 5,000 | `POST_COMPACT_MAX_TOKENS_PER_FILE` | per-file truncation |
| `hDY` | 5,000 | `POST_COMPACT_MAX_TOKENS_PER_SKILL` | per-skill truncation |
| `RDY` | 25,000 | `POST_COMPACT_SKILLS_TOKEN_BUDGET` | total budget for restored skills |
| `oyK` | 100 | (max recent messages?) | (boundary slice cap) |
| `uDY` | 20,000 | (max output reservation) | reserved-for-output cap inside `Yn` |
| `t_7` | 13,000 | (autocompact buffer) | threshold = window − reservation − buffer |
| `e_7` | 3,000 | (blocking buffer) | hard-block threshold |
| `mDY` | 20,000 | (warning offset) | post-compact warning offset |
| `BDY` | 20,000 | (error offset) | post-compact error offset |
| `o_7` | 100,000 | (MIN_AUTOCOMPACT) | env-var lower bound |
| `$LK` | 1,000,000 | (MAX_AUTOCOMPACT) | env-var upper bound |
| `pDY` | 5,400,000 ms (1.5 h) | (cold-cache threshold) | strip-non-essential trigger |
| `Q6A` | 5 | (DEFAULT_KEEP_RECENT) | tools to keep in qD4 (KEEP-RECENT MC) |
| `Vg1` | 500,000 | (TOOL_RESULT_HARD_CAP) | per-tool-result truncation ceiling |
| `GI6` | "Compaction blocked by PreCompact hook" | (PRE_COMPACT_BLOCKED_PREFIX) | error-message prefix |
| `_LK` | "Conversation too long. Press esc twice..." | (PTL_FAILURE_MSG) | user-facing PTL exhaustion msg |
| `cI` | "API Error: prompt too long" (prefix) | (PTL_DETECTION_PREFIX) | response-string match |
| `at` | "API Error: Request was aborted." | (USER_ABORT_MSG) | abort detection |
| `ayK` | "[earlier conversation truncated for compaction retry]" | (PTL_RETRY_MARKER) | inserted as msg[0] on PTL truncation |
| `okK` | rapid-refill error template | (RAPID_REFILL_MSG) | thrash explanation |
| `ql8` | "Compaction interrupted · This may be due to network issues..." | (NETWORK_INTERRUPT_MSG) | retry-able error msg |
| `QI6` | "Not enough messages to compact." | (NO_MSGS_MSG) | early-return error |

---

## 13. Why the eliminated features matter (and how to confirm)

Both Snip and Context-Collapse target the same problem: **the autocompact dispatcher's all-or-nothing approach**. When a session crosses the threshold, autocompact replaces the entire conversation with a 2-3KB summary, which:

- Forfeits cache-prefix continuity (the entire post-compact prompt is fresh)
- Drops fine-grained context (e.g. the exact files visited, the precise edit history)
- Risks summarization errors (the LLM may misremember decisions)

Context-collapse intends to solve this by **archiving older sub-conversations into per-segment summaries** (the "commits" persisted via `recordContextCollapseCommit`), keeping recent turns verbatim — a mid-ground between full compact and no-action. It's the right idea for a code-editing agent, where the most recent turn is always the most-important.

But **shipping that as a default is risky**: any bug in the archive/restore loop could permanently corrupt sessions. So Anthropic has kept it dark in shipped builds across the entire 2.1.x line, with only the persistence-write side compiled in (so future builds can read sessions written by future versions that DO have collapse enabled).

To definitively confirm the no-ship status in any future v2.1.x bundle, a one-shot check is:

```bash
# All four substrings should be empty in a "no-collapse" build:
cd source/
grep -l "applyCollapsesIfNeeded\|recoverFromOverflow\|isContextCollapseEnabled\|isWithheldPromptTooLong" chunks.*.mjs
```

For Snip, the same idea — but the absence of an implementation is harder to prove negatively because `snipTokensFreed` is just a parameter. The right check is: **does any caller pass a non-zero `Y` to `gDY`?** In 2.1.112, the answer is no:

```bash
# Look for callers of QkK passing a 6th argument:
grep -A2 "\.autocompact(" chunks.*.mjs | head -20
# In chunks.154.mjs:1016, the call is:
#   await H.autocompact(U, v, {systemPrompt, userContext, systemContext, toolUseContext, forkContextMessages: U}, w, g, n)
#                       arg1 arg2 arg3-large-object                                                            ,arg4,arg5,arg6=n
# arg6 (n) is initialized at line 1005 as `n = 0` and never reassigned before line 1016 — confirming no snip wiring.
```

---

## 14. Comparison summary table

| Feature | 2.1.88 source | 2.1.112 binary | Comment |
|---------|---------------|----------------|---------|
| **Autocompact pipeline** | `services/compact/autoCompact.ts` (351 lines) | `chunks.159.mjs:1379-1428` (50 lines) + helpers | Same logic; 2.1.112 adds rapid-refill breaker; otherwise behavior-equivalent |
| **Full compact** | `compactConversation` in `compact.ts` (1705 lines) | `vI6` in `chunks.159.mjs:574-747` + helpers | Same phases; same constants; 2.1.112 adds cache-prefix compact path |
| **Partial compact** | `partialCompactConversation` (lines 772-1108) | `zLK` in `chunks.159.mjs:749-907` | Same `up_to`/`from` logic |
| **PreCompact hook** | wired through compact.ts | `oc()` + `ec8()` in `chunks.159.mjs:533-544` | Same `decision: "block"` semantics |
| **Microcompact: time-based** | `maybeTimeBasedMicrocompact` in `microCompact.ts` | `qD4` in `chunks.85.mjs:1235-1274` | 2.1.88: pro-active per-turn. 2.1.112: only via `context_hint` reject |
| **Microcompact: cached (cache_edits)** | `cachedMicrocompactPath` referencing `./cachedMicrocompact.js` | ❌ removed | Both versions actually missing this — 2.1.88 source-tree references it but the file is missing; 2.1.112 has no callsites at all |
| **API CM: `clear_thinking_20251015`** | `apiMicrocompact.ts:82-87` | `C85` in `chunks.194.mjs:741-752` | Same; 2.1.112 simplifies to thinking-only (drops env-gated tool-use clearing) |
| **API CM: `clear_tool_uses_20250919`** | `apiMicrocompact.ts:104-150` (USE_API_CLEAR_TOOL_RESULTS env) | ❌ removed | The ant-only env-gated tool-clearing strategy was dropped |
| **`context-hint-2026-04-09` beta** | ❌ not in 2.1.88 | ✅ `chunks.194.mjs:846` (`I85`) + 422/424 reject path | NEW; replaces what cached-MC would have done |
| **Cold-compact strip-non-essential** | `compact.ts:1141-1143` (stripNonEssential param) | `chunks.159.mjs:1405` (X = `FDY() && tengu_cold_compact`) | Same |
| **Cache-prefix compact** | `tengu_compact_cache_prefix` gate in compact.ts | `chunks.159.mjs:957-1000` | Same flag, same fallback path |
| **Snip** | parameter only (`snipTokensFreed`) | parameter only (`Y = 0`) | **Both versions: feature absent** |
| **Context-collapse / marble-origami runtime** | `feature('CONTEXT_COLLAPSE')` gates pointing to missing `services/contextCollapse/` directory | DCE — symbols don't appear at all | **Both versions: feature absent**. 2.1.88 leaks the placeholder require()s; 2.1.112 has cleaned up the dispatcher to not even mention them |
| **Context-collapse persistence** | `services/contextCollapse/persist.ts` referenced in 2.1.88 | `XtY`/`MtY` in `chunks.191.mjs:1102-1120` | Persistence shim ships in 2.1.112 with no caller. Forward-compat for sessions written by future builds |
| **`session_memory` source** | `compactConversation(querySource: 'session_memory')` early-returns in shouldCompact | `gDY: if (z === "session_memory") return false` | Same |
| **Session memory compact** | `sessionMemoryCompact.ts` (630 lines) | wired in chunks (multiple) | Behavior preserved, dispersed across chunks |
| **Cold-compact threshold** | 1.5h (≥5,400,000 ms) | `pDY = 5400000` | Same |
| **Auto-compact window source priority** | env > settings > experiment > model | env > settings > experiment > model | Same in `Jn` |

---

## 15. References

Files inspected for this analysis:

- `chunks.85.mjs:1147-1349` — microcompact stub, KEEP-RECENT MC, telemetry helpers
- `chunks.101.mjs:599-788` — compact prompt builder (`fx8`, `Q0z`, `d0z`)
- `chunks.154.mjs:880-1226` — query loop calling `microcompact` and `autocompact` per-turn
- `chunks.159.mjs:505-1500` — full compact pipeline (`vI6`, `zLK`, `ALK`, `KLK`, `QkK`, `gDY`, `Jn`, `v38`, `Yn`, `UM6`, constants)
- `chunks.191.mjs:1102-1120` — `recordContextCollapseCommit`/`Snapshot` shims
- `chunks.194.mjs:719-952` — `context_hint` reject path (`d85`, `NJ7`, `C85`, `I85`)
- `cli.chunks.mjs:9124-9125` — `recordContextCollapse*` re-exports

Comparison source files (2.1.88):

- `services/compact/autoCompact.ts` (351 lines) — autocompact dispatcher
- `services/compact/compact.ts` (1705 lines) — full compact
- `services/compact/microCompact.ts` (530 lines) — microcompact (cached + time-based)
- `services/compact/apiMicrocompact.ts` (153 lines) — API context-management strategies
- `services/compact/postCompactCleanup.ts` (77 lines) — post-compact cleanup
- `services/compact/prompt.ts` (374 lines) — compact prompt body
- `services/compact/sessionMemoryCompact.ts` (630 lines) — session memory variant
- `query.ts:440-1180` — references to `contextCollapse.applyCollapsesIfNeeded`/`recoverFromOverflow`
- `setup.ts:295-298`, `tools.ts:110` — `feature('CONTEXT_COLLAPSE')` gates
- `utils/sessionRestore.ts:121-132` — `feature('CONTEXT_COLLAPSE')` persistence-restore

Cross-references in this analysis directory:

- `by_version/v2.1.89.md` § 3 — autocompact circuit breakers original deep-dive
- `by_version/v2.1.105.md` § 4 — PreCompact `decision: "block"` introduction
- `by_version/v2.1.110.md` § 3 — `context_hint` reject path arrival
- `00_overview/symbol_index_core_features.md` — Compact module symbols
- `00_overview/file_index.md` — `chunks.159.mjs` role description

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](symbol_index_core_features.md) — Compact module symbols (where these go)

Key functions in this document:
- `autocompactDispatcher` (`QkK`) — chunks.159.mjs:1379 — Top-level autocompact gate
- `compactConversation` (`vI6`) — chunks.159.mjs:574 — Full LLM compact
- `partialCompactConversation` (`zLK`) — chunks.159.mjs:749 — `up_to`/`from` cursor compact
- `shouldCompact` (`gDY`) — chunks.159.mjs:1365 — Threshold check
- `getAutoCompactThreshold` (`v38`) — chunks.159.mjs:1320
- `getEffectiveContextWindow` (`Yn`) — chunks.159.mjs:1307
- `resolveWindowSource` (`Jn`) — chunks.159.mjs:1266 — env > settings > experiment > model
- `isCacheCold` (`FDY`) — chunks.159.mjs:1316 — 1.5h since last activity
- `truncateHeadForPTLRetry` (`KLK`) — chunks.159.mjs:512 — drop ~20% on PTL retry
- `compactPromptBuilder` (`fx8`) — chunks.101.mjs:679
- `partialCompactPrompt` (`Q0z`) — chunks.101.mjs (same chunk, `up_to` flavor)
- `microcompactStub` (`_c`) — chunks.85.mjs:1207 — no-op
- `keepRecentMicrocompact` (`qD4`) — chunks.85.mjs:1235 — server-driven only
- `contextHintReject` (`d85`) — chunks.194.mjs:856 — 422/424 + thinking-clear path
- `contextHintApplyAndRetry` (`NJ7`) — chunks.194.mjs:889
- `getAPIContextManagement` (`C85`) — chunks.194.mjs:741 — clear_thinking_20251015 only
- `recordContextCollapseCommit` (`XtY`) — chunks.191.mjs:1102 — write-only persistence shim
- `recordContextCollapseSnapshot` (`MtY`) — chunks.191.mjs:1112 — write-only persistence shim
- `preCompactBlocked` (`ec8`) — chunks.159.mjs:533 — throws GI6-prefixed error
