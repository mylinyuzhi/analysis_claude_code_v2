# CLI-Compact Integration

> How CLI state triggers auto-compaction and manages session memory

> **Main Documentation:** [07_compact/](../07_compact/) - Complete compaction module documentation

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - LLM API

Key functions in this document:
- `autoCompactDispatcher` (sqq) - Top-level auto-compaction orchestrator
- `shouldTriggerAutoCompaction` (CmY) - Determines if compaction is needed
- `getAutoCompactThreshold` (oc6) - Returns token threshold for triggering
- `trySessionMemoryQuickPath` (lE1) - Session memory compaction path
- `performFullCompaction` (mf6) - Standard compaction path

---

## Overview

The compact system integrates with CLI through:

1. **Environment Variable Overrides** - `DISABLE_COMPACT`, `DISABLE_AUTO_COMPACT`
2. **Settings Configuration** - `autoCompactEnabled` in user/project config
3. **Token Threshold Management** - Automatic triggering based on context size
4. **Session Memory Integration** - New session memory-based compaction (v2.1.38+)
5. **Circuit Breaker** - Auto-compaction stops after 3 consecutive failures (v2.1.76)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CLI → COMPACT INTEGRATION PIPELINE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │  CLI Flags       │    │  Environment      │    │  User Settings   │     │
│  │  (print mode)    │    │  DISABLE_COMPACT  │    │  autoCompact     │     │
│  │                  │    │  DISABLE_AUTO_    │    │  Enabled         │     │
│  │                  │    │  COMPACT          │    │                  │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   Auto-Compact Enabled?      │                       │
│                    │   isAutoCompactEnabled()     │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                          ┌─────────┴─────────┐                            │
│                          │                   │                            │
│                         YES                 NO                            │
│                          │                   │                            │
│                          ▼                   ▼                            │
│           ┌─────────────────────────┐   ┌─────────────┐                   │
│           │ During Agent Loop       │   │ Skip        │                   │
│           │ After each LLM response │   │ Compaction  │                   │
│           └───────────┬─────────────┘   └─────────────┘                   │
│                       │                                                    │
│                       ▼                                                    │
│           ┌─────────────────────────┐                                      │
│           │ shouldAutoCompact()     │                                      │
│           │ Check token count       │                                      │
│           │ vs threshold            │                                      │
│           └───────────┬─────────────┘                                      │
│                       │                                                    │
│             ┌─────────┴─────────┐                                         │
│             │                   │                                         │
│          Below               Above                                        │
│          Threshold          Threshold                                      │
│             │                   │                                         │
│             ▼                   ▼                                         │
│      ┌─────────────┐   ┌─────────────────────────────┐                    │
│      │ Continue    │   │ autoCompactDispatcher()     │                    │
│      │ Normal      │   │ (sqq)                       │                    │
│      │ Execution   │   │                             │                    │
│      └─────────────┘   └───────────────┬─────────────┘                    │
│                                        │                                   │
│                          ┌─────────────┴─────────────┐                    │
│                          │                           │                    │
│                   Session Memory              Standard                   │
│                   Feature Enabled             Compaction                  │
│                          │                           │                    │
│                          ▼                           ▼                    │
│              ┌─────────────────────┐   ┌─────────────────────┐           │
│              │ trySessionMemory    │   │ performFull         │           │
│              │ QuickPath()         │   │ Compaction()        │           │
│              │ (lE1)               │   │ (mf6)               │           │
│              └─────────────────────┘   └─────────────────────┘           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Environment Variable Controls

### 1.1 Disable Flags

**Source location:** `chunks.147.mjs:760-763`

```javascript
// ============================================
// isAutoCompactEnabled - Check if auto-compact is enabled
// Location: chunks.147.mjs:760-763
// ============================================

// ORIGINAL (for source lookup):
if (J6(process.env.DISABLE_COMPACT)) return !1;
if (J6(process.env.DISABLE_AUTO_COMPACT)) return !1;
return f6().autoCompactEnabled

// READABLE (for understanding):
function isAutoCompactEnabled() {
    // Environment variable: DISABLE_COMPACT
    // Disables ALL compaction (both auto and manual)
    if (parseBoolean(process.env.DISABLE_COMPACT)) return false;

    // Environment variable: DISABLE_AUTO_COMPACT
    // Disables only automatic compaction (manual still works)
    if (parseBoolean(process.env.DISABLE_AUTO_COMPACT)) return false;

    // Check user settings (default: true)
    return getUserSettings().autoCompactEnabled;
}

// Mapping: J6→parseBoolean, f6→getUserSettings
```

### 1.2 Environment Variables Reference

| Variable | Effect | Use Case |
|----------|--------|----------|
| `DISABLE_COMPACT=1` | Disables ALL compaction | Debugging, testing |
| `DISABLE_AUTO_COMPACT=1` | Disables automatic only | Manual control |
| `ENABLE_CLAUDE_CODE_SM_COMPACT=1` | Enables session memory compact | Feature testing |

---

## 2. autoCompactDispatcher (sqq)

**What it does:** Top-level orchestrator that decides whether compaction is needed and which compaction path to use.

**Location:** `chunks.147.mjs:2633-2658`

### 2.1 Function Implementation

```javascript
// ============================================
// autoCompactDispatcher - Main compaction orchestrator
// Location: chunks.147.mjs:2633-2658
// ============================================

// ORIGINAL (for source lookup):
async function sqq(A, q, K, Y) {
    if (J6(process.env.DISABLE_COMPACT)) return {
        wasCompacted: !1
    };
    let z = q.options.mainLoopModel;
    if (!await CmY(A, z, Y)) return {
        wasCompacted: !1
    };
    let H = await lE1(A, q.agentId, oc6(z));
    if (H) return i51(void 0), {
        wasCompacted: !0,
        compactionResult: H
    };
    try {
        let $ = await mf6(A, q, K, !0, void 0, !0);
        return i51(void 0), {
            wasCompacted: !0,
            compactionResult: $
        }
    } catch ($) {
        if (!ST1($, e31)) K1($ instanceof Error ? $ : Error(String($)));
        return {
            wasCompacted: !1
        }
    }
}

// READABLE (for understanding):
async function autoCompactDispatcher(messages, sessionContext, cacheSafeParams, querySource) {
    // Step 1: Check if compaction is globally disabled
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return { wasCompacted: false };
    }

    // Step 2: Get model for threshold calculation
    let model = sessionContext.options.mainLoopModel;

    // Step 3: Check if compaction is needed
    if (!await shouldTriggerAutoCompaction(messages, model, querySource)) {
        return { wasCompacted: false };
    }

    // Step 4: Try session memory compaction first (new path)
    let sessionMemoryResult = await trySessionMemoryQuickPath(
        messages,
        sessionContext.agentId,
        getAutoCompactThreshold(model)
    );

    if (sessionMemoryResult) {
        clearLastCompactionTimestamp(void 0);
        return {
            wasCompacted: true,
            compactionResult: sessionMemoryResult
        };
    }

    // Step 5: Fall back to standard compaction
    try {
        let standardResult = await performFullCompaction(
            messages,
            sessionContext,
            cacheSafeParams,
            true,           // isAutoCompact
            void 0,         // customPrompt
            true            // skipPrePostHooks
        );
        clearLastCompactionTimestamp(void 0);
        return {
            wasCompacted: true,
            compactionResult: standardResult
        };
    } catch (error) {
        // Only log non-expected compaction errors
        if (!matchesErrorType(error, ExpectedCompactionError)) {
            logError(error instanceof Error ? error : Error(String(error)));
        }
        return { wasCompacted: false };
    }
}

// Mapping: sqq→autoCompactDispatcher, A→messages, q→sessionContext,
//          K→cacheSafeParams, Y→querySource, z→model, H→sessionMemoryResult,
//          CmY→shouldTriggerAutoCompaction, lE1→trySessionMemoryQuickPath,
//          oc6→getAutoCompactThreshold, mf6→performFullCompaction, i51→clearLastCompactionTimestamp
```

### 2.2 Decision Logic Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    autoCompactDispatcher DECISION FLOW                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  autoCompactDispatcher(messages, sessionContext, cacheSafeParams, source)   │
│  │                                                                          │
│  ├─► DISABLE_COMPACT env var?                                               │
│  │   └─► YES → return { wasCompacted: false }                              │
│  │                                                                          │
│  ├─► shouldAutoCompact(messages, model, source)?                            │
│  │   └─► NO → return { wasCompacted: false }                               │
│  │                                                                          │
│  ├─► Circuit breaker: 3 consecutive failures?  (v2.1.76)                   │
│  │   └─► YES → return { wasCompacted: false }, stop trying                 │
│  │                                                                          │
│  ├─► Session Memory Feature Enabled?                                        │
│  │   │                                                                      │
│  │   ├─► YES → performSessionMemoryCompaction()                            │
│  │   │       └─► SUCCESS → return { wasCompacted: true, result }           │
│  │   │       └─► FAILURE → continue to standard                             │
│  │   │                                                                      │
│  │   └─► NO → performFullCompaction()                                       │
│  │           └─► SUCCESS → return { wasCompacted: true, result }           │
│  │           └─► ERROR → return { wasCompacted: false }                    │
│  │                                                                          │
│  └─► clearLastCompactionTimestamp()                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. shouldTriggerAutoCompaction (CmY)

**What it does:** Determines if token count exceeds the threshold requiring compaction.

**Location:** `chunks.147.mjs:2620-2631`

```javascript
// ============================================
// shouldTriggerAutoCompaction - Check if compaction is needed
// Location: chunks.147.mjs:2620-2631
// ============================================

// ORIGINAL (for source lookup):
async function CmY(A, q, K) {
    if (K === "session_memory" || K === "compact") return !1;
    if (!Xh()) return !1;
    let Y = Ev(A),
        z = oc6(q),
        w = OF(q);
    h(`autocompact: tokens=${Y} threshold=${z} effectiveWindow=${w}`);
    let {
        isAboveAutoCompactThreshold: H
    } = mz6(Y, q);
    return H
}

// READABLE (for understanding):
async function shouldTriggerAutoCompaction(messages, model, querySource) {
    // Don't compact if we're already in a compaction-related query
    if (querySource === "session_memory" || querySource === "compact") {
        return false;
    }

    // Check if auto-compact is enabled in settings
    if (!isAutoCompactEnabled()) {
        return false;
    }

    // Calculate current token count
    let tokenCount = countTokens(messages);

    // Get model-specific threshold
    let threshold = getAutoCompactThreshold(model);
    let effectiveWindow = getEffectiveContextWindow(model);

    debug(`autocompact: tokens=${tokenCount} threshold=${threshold} effectiveWindow=${effectiveWindow}`);

    // Check if above threshold
    let { isAboveAutoCompactThreshold } = getCompactionStatus(tokenCount, model);

    return isAboveAutoCompactThreshold;
}

// Mapping: CmY→shouldTriggerAutoCompaction, A→messages, q→model, K→querySource,
//          Y→tokenCount, z→threshold, w→effectiveWindow, Ev→countTokens,
//          oc6→getAutoCompactThreshold, OF→getEffectiveContextWindow,
//          Xh→isAutoCompactEnabled, mz6→getCompactionStatus
```

---

## 4. Token Threshold Constants

**Source location:** `chunks.147.mjs:805-813`

```javascript
// ============================================
// Token threshold constants for compaction
// Location: chunks.147.mjs:805-813
// ============================================

// ORIGINAL (for source lookup):
nmY = 20000
cCA = 13000
rmY = 20000
omY = 20000
lCA = 3000

// READABLE (for understanding):
// Token thresholds for different contexts
const DEFAULT_AUTO_COMPACT_THRESHOLD = 20000;     // Default trigger point
const MIN_MESSAGES_BEFORE_COMPACT = 13000;        // Minimum messages threshold
const SESSION_MEMORY_THRESHOLD = 20000;           // For session memory mode
const BACKGROUND_COMPACT_THRESHOLD = 20000;       // For background agents
const MIN_REMAINING_TOKENS = 3000;                // Keep this many tokens after compact

// Mapping: nmY→DEFAULT_AUTO_COMPACT_THRESHOLD, cCA→MIN_MESSAGES_BEFORE_COMPACT,
//          rmY→SESSION_MEMORY_THRESHOLD, omY→BACKGROUND_COMPACT_THRESHOLD,
//          lCA→MIN_REMAINING_TOKENS
```

---

## 5. Session Memory Compaction

**What it does:** New compaction path that uses persistent session memory instead of on-the-fly summarization.

### 5.1 Feature Flag Gating

**Source location:** `chunks.147.mjs:612-617`

```javascript
// ============================================
// isSessionMemoryCompactEnabled - Feature flag check
// Location: chunks.147.mjs:612-617
// ============================================

// ORIGINAL (for source lookup):
function TZ6() {
    if (J6(process.env.ENABLE_CLAUDE_CODE_SM_COMPACT)) return !0;
    if (J6(process.env.DISABLE_CLAUDE_CODE_SM_COMPACT)) return !1;
    let A = x8("tengu_session_memory", !1),
        q = x8("tengu_sm_compact", !1);
    return A && q
}

// READABLE (for understanding):
function isSessionMemoryCompactEnabled() {
    // Environment override: force enable
    if (parseBoolean(process.env.ENABLE_CLAUDE_CODE_SM_COMPACT)) {
        return true;
    }

    // Environment override: force disable
    if (parseBoolean(process.env.DISABLE_CLAUDE_CODE_SM_COMPACT)) {
        return false;
    }

    // Check both feature flags must be enabled
    let sessionMemoryEnabled = getFeatureFlag("tengu_session_memory", false);
    let smCompactEnabled = getFeatureFlag("tengu_sm_compact", false);

    return sessionMemoryEnabled && smCompactEnabled;
}

// Mapping: TZ6→isSessionMemoryCompactEnabled, J6→parseBoolean,
//          x8→getFeatureFlag
```

**Why dual feature flags:**

The session memory compaction requires TWO feature flags to be enabled:
1. `tengu_session_memory` - Enables the session memory storage system
2. `tengu_sm_compact` - Enables compaction using session memory

This separation allows:
- Enabling session memory without changing compaction behavior
- Testing compaction in isolation
- Gradual rollout of the new compaction system

### 5.2 Session Memory vs Standard Compaction

| Aspect | Session Memory | Standard Compaction |
|--------|---------------|---------------------|
| Storage | Persistent `.claude/memory/` | In-message summary |
| Retention | Across sessions | Current session only |
| Performance | Faster (pre-computed) | Slower (LLM summarization) |
| Quality | Preserves key facts | May lose context |
| Availability | Feature flag | Always available |

---

## 6. Circuit Breaker (New in v2.1.76)

### 6.1 Circuit Breaker Behavior

**What it does:** Auto-compaction stops attempting after 3 consecutive failures. This prevents a degraded session from repeatedly trying to compact (which costs API calls and time) when compaction is consistently failing.

**How it works:**
1. Each compaction failure increments a consecutive-failure counter
2. When the counter reaches 3, the circuit breaker opens
3. With the circuit open, `shouldAutoCompact()` returns `false` regardless of token count
4. The circuit breaker state is session-scoped (not persisted across sessions)

**Why 3 failures:** A single failure might be transient (network timeout, API overload). Three consecutive failures indicate a structural problem (invalid state, persistent API error) that is unlikely to resolve on its own. Three strikes balances recovery attempts against resource waste.

**Why session-scoped:** If the circuit breaker were persistent, a single bad session could permanently disable compaction for the user. Session-scoping means each new session starts fresh.

```javascript
// ============================================
// compactionCircuitBreaker - Stop after 3 consecutive failures
// Location: chunks.147.mjs (circuit breaker logic)
// ============================================

// READABLE (for understanding):
let consecutiveCompactionFailures = 0;
const COMPACTION_FAILURE_LIMIT = 3;

function recordCompactionFailure() {
    consecutiveCompactionFailures++;
    if (consecutiveCompactionFailures >= COMPACTION_FAILURE_LIMIT) {
        debug("Auto-compaction circuit breaker opened after 3 consecutive failures");
    }
}

function recordCompactionSuccess() {
    consecutiveCompactionFailures = 0;  // Reset on success
}

function isCircuitBreakerOpen() {
    return consecutiveCompactionFailures >= COMPACTION_FAILURE_LIMIT;
}
```

---

## 7. Integration with Agent Loop

### 7.1 Call Site in LLM Query

The auto-compact dispatcher is called within the main LLM query generator:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AGENT LOOP COMPACT INTEGRATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  agentLoopRunner() [chunks.130.mjs:1961]                                    │
│  │                                                                          │
│  └─► llmRequestGenerator() [chunks.169.mjs:739]                            │
│      │                                                                      │
│      ├─► Build messages array                                               │
│      │                                                                      │
│      ├─► Check abort signal                                                 │
│      │                                                                      │
│      ├─► shouldAutoCompact(messages, model)?                               │
│      │   └─► YES → autoCompactDispatcher(messages, context, params)        │
│      │               │                                                      │
│      │               ├─► Compaction succeeded                               │
│      │               │   └─► Replace messages with compacted version       │
│      │               │                                                      │
│      │               └─► Compaction failed                                  │
│      │                   └─► Continue with original messages               │
│      │                                                                      │
│      └─► Make LLM API call with (possibly compacted) messages              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Configuration Reference

### 8.1 User Settings (settings.json)

```json
{
  "autoCompactEnabled": true,
  "autoCompactTokenThreshold": 20000
}
```

### 8.2 CLI Flag Integration

| CLI Flag | Effect on Compact |
|----------|-------------------|
| `--print` | Enables non-interactive mode, compact runs silently |
| `--no-session-persistence` | Compact state not saved to disk |
| (no flags) | Interactive mode, compact may show UI feedback |

### 8.3 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DISABLE_COMPACT` | `false` | Disable ALL compaction |
| `DISABLE_AUTO_COMPACT` | `false` | Disable automatic compaction only |
| `ENABLE_CLAUDE_CODE_SM_COMPACT` | `false` | Enable session memory compaction |

---

## 9. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Enabled check | `chunks.147.mjs:760` | Environment + settings |
| Threshold decision | `chunks.147.mjs:765` | `shouldAutoCompact` |
| Main dispatcher | `chunks.147.mjs:778` | `autoCompactDispatcher` |
| Circuit breaker | `chunks.147.mjs` | Stop after 3 failures (v2.1.76) |
| Session memory | `chunks.147.mjs` | `performSessionMemoryCompaction` |
| Standard compact | `chunks.147.mjs` | `performFullCompaction` |
| Agent loop call | `chunks.169.mjs:739` | Within `llmRequestGenerator` |
| Token constants | `chunks.147.mjs:805` | Threshold values |
