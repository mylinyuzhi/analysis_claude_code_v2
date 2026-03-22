# CLI-Compact Integration

> How CLI state triggers auto-compaction and manages session memory

> **Main Documentation:** [07_compact/](../07_compact/) - Complete compaction module documentation

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - LLM API

Key functions in this document (verified locations):
- `isAutoCompactEnabled` (Xh) - chunks.147.mjs:2614-2617
- `shouldTriggerAutoCompaction` (CmY) - chunks.147.mjs:2620-2631
- `autoCompactDispatcher` (sqq) - chunks.147.mjs:2633-2674
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

**Source location:** `chunks.147.mjs:2614-2617`

```javascript
// ============================================
// isAutoCompactEnabled - Check if auto-compact is enabled
// Location: chunks.147.mjs:2614-2617
// ============================================

// ORIGINAL (for source lookup):
function Xh() {
    if (t6(process.env.DISABLE_COMPACT)) return !1;
    if (t6(process.env.DISABLE_AUTO_COMPACT)) return !1;
    return X1().autoCompactEnabled
}

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

// Mapping: Xh→isAutoCompactEnabled, t6→parseBoolean, X1→getUserSettings
```

### 1.2 Environment Variables Reference

| Variable | Effect | Use Case |
|----------|--------|----------|
| `DISABLE_COMPACT=1` | Disables ALL compaction | Debugging, testing |
| `DISABLE_AUTO_COMPACT=1` | Disables automatic only | Manual control |
| `ENABLE_CLAUDE_CODE_SM_COMPACT=1` | Enables session memory compact | Feature testing |

---

## 2. autoCompactDispatcher (sqq)

**What it does:** Top-level orchestrator that decides whether compaction is needed and which compaction path to use. Includes circuit breaker logic to stop after 3 consecutive failures.

**Location:** `chunks.147.mjs:2633-2674`

### 2.1 Function Implementation

```javascript
// ============================================
// autoCompactDispatcher - Main compaction orchestrator
// Location: chunks.147.mjs:2633-2674
// ============================================

// ORIGINAL (for source lookup):
async function sqq(A, q, K, Y, z, _) {
    if (t6(process.env.DISABLE_COMPACT)) return {
        wasCompacted: !1
    };
    if (z?.consecutiveFailures !== void 0 && z.consecutiveFailures >= aqq) return {
        wasCompacted: !1
    };
    let w = q.options.mainLoopModel;
    if (!await CmY(A, w, Y, _)) return {
        wasCompacted: !1
    };
    let $ = {
            isRecompactionInChain: z?.compacted === !0,
            turnsSincePreviousCompact: z?.turnCounter ?? -1,
            previousCompactTurnId: z?.turnId,
            autoCompactThreshold: oc6(w),
            querySource: Y
        },
        H = await lE1(A, q.agentId, $.autoCompactThreshold);
    if (H) return K16(void 0), gl(), {
        wasCompacted: !0,
        compactionResult: H
    };
    try {
        let j = await mf6(A, q, K, !0, void 0, !0, $);
        return K16(void 0), gl(), {
            wasCompacted: !0,
            compactionResult: j,
            consecutiveFailures: 0
        }
    } catch (j) {
        if (!$r(j, zl)) _6(j);
        let M = (z?.consecutiveFailures ?? 0) + 1;
        if (M >= aqq) k(`autocompact: circuit breaker tripped after ${M} consecutive failures — skipping future attempts this session`, {
            level: "warn"
        });
        return {
            wasCompacted: !1,
            consecutiveFailures: M
        }
    }
}

// READABLE (for understanding):
async function autoCompactDispatcher(
    messages,
    sessionContext,
    cacheSafeParams,
    querySource,
    compactState,      // v2.1.76: Tracks consecutive failures
    tokensFreedBySnip  // v2.1.76: Tokens freed by previous snip operation
) {
    // Step 1: Check if compaction is globally disabled
    if (parseBoolean(process.env.DISABLE_COMPACT)) {
        return { wasCompacted: false };
    }

    // Step 2: Circuit breaker check (v2.1.76)
    // Stop trying after 3 consecutive failures
    if (compactState?.consecutiveFailures !== undefined &&
        compactState.consecutiveFailures >= CIRCUIT_BREAKER_THRESHOLD) {
        return { wasCompacted: false };
    }

    // Step 3: Get model for threshold calculation
    let model = sessionContext.options.mainLoopModel;

    // Step 4: Check if compaction is needed
    if (!await shouldTriggerAutoCompaction(messages, model, querySource, tokensFreedBySnip)) {
        return { wasCompacted: false };
    }

    // Step 5: Build compaction context (v2.1.76 enhanced)
    let compactionContext = {
        isRecompactionInChain: compactState?.compacted === true,
        turnsSincePreviousCompact: compactState?.turnCounter ?? -1,
        previousCompactTurnId: compactState?.turnId,
        autoCompactThreshold: getAutoCompactThreshold(model),
        querySource: querySource
    };

    // Step 6: Try session memory compaction first (new path)
    let sessionMemoryResult = await trySessionMemoryQuickPath(
        messages,
        sessionContext.agentId,
        compactionContext.autoCompactThreshold
    );

    if (sessionMemoryResult) {
        clearLastCompactionTimestamp(void 0);
        resetCircuitBreaker();
        return {
            wasCompacted: true,
            compactionResult: sessionMemoryResult
        };
    }

    // Step 7: Fall back to standard compaction
    try {
        let standardResult = await performFullCompaction(
            messages,
            sessionContext,
            cacheSafeParams,
            true,              // isAutoCompact
            void 0,            // customPrompt
            true,              // skipPrePostHooks
            compactionContext  // v2.1.76: Pass context
        );
        clearLastCompactionTimestamp(void 0);
        resetCircuitBreaker();
        return {
            wasCompacted: true,
            compactionResult: standardResult,
            consecutiveFailures: 0  // Reset on success
        };
    } catch (error) {
        // Only log non-expected compaction errors
        if (!matchesErrorType(error, ExpectedCompactionError)) {
            logError(error instanceof Error ? error : Error(String(error)));
        }

        // Increment failure counter
        let newFailureCount = (compactState?.consecutiveFailures ?? 0) + 1;

        // Log circuit breaker trip
        if (newFailureCount >= CIRCUIT_BREAKER_THRESHOLD) {
            debug(`autocompact: circuit breaker tripped after ${newFailureCount} consecutive failures — skipping future attempts this session`, {
                level: "warn"
            });
        }

        return {
            wasCompacted: false,
            consecutiveFailures: newFailureCount
        };
    }
}

// Mapping: sqq→autoCompactDispatcher, A→messages, q→sessionContext,
//          K→cacheSafeParams, Y→querySource, z→compactState, _→tokensFreedBySnip,
//          w→model, H→sessionMemoryResult, $→compactionContext,
//          CmY→shouldTriggerAutoCompaction, lE1→trySessionMemoryQuickPath,
//          oc6→getAutoCompactThreshold, mf6→performFullCompaction,
//          K16→clearLastCompactionTimestamp, gl→resetCircuitBreaker,
//          aqq→CIRCUIT_BREAKER_THRESHOLD (3)
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
async function CmY(A, q, K, Y = 0) {
    if (K === "session_memory" || K === "compact") return !1;
    if (!Xh()) return !1;
    let z = eW(A) - Y,
        _ = oc6(q),
        w = OF(q);
    k(`autocompact: tokens=${z} threshold=${_} effectiveWindow=${w}${Y>0?` snipFreed=${Y}`:""}`);
    let {
        isAboveAutoCompactThreshold: O
    } = mz6(z, q);
    return O
}

// READABLE (for understanding):
async function shouldTriggerAutoCompaction(
    messages,
    model,
    querySource,
    tokensFreedBySnip = 0  // v2.1.76: Account for tokens already freed
) {
    // Don't compact if we're already in a compaction-related query
    if (querySource === "session_memory" || querySource === "compact") {
        return false;
    }

    // Check if auto-compact is enabled in settings
    if (!isAutoCompactEnabled()) {
        return false;
    }

    // Calculate current token count (subtract any freed by previous snip)
    let tokenCount = countTokens(messages) - tokensFreedBySnip;

    // Get model-specific threshold
    let threshold = getAutoCompactThreshold(model);
    let effectiveWindow = getEffectiveContextWindow(model);

    debug(`autocompact: tokens=${tokenCount} threshold=${threshold} effectiveWindow=${effectiveWindow}${tokensFreedBySnip > 0 ? ` snipFreed=${tokensFreedBySnip}` : ""}`);

    // Check if above threshold
    let { isAboveAutoCompactThreshold } = getCompactionStatus(tokenCount, model);

    return isAboveAutoCompactThreshold;
}

// Mapping: CmY→shouldTriggerAutoCompaction, A→messages, q→model, K→querySource,
//          Y→tokensFreedBySnip, z→tokenCount, _→threshold, w→effectiveWindow,
//          eW→countTokens, oc6→getAutoCompactThreshold, OF→getEffectiveContextWindow,
//          Xh→isAutoCompactEnabled, mz6→getCompactionStatus, k→debug
```

---

## 4. Token Threshold Constants

**Source location:** `chunks.147.mjs:2676-2686`

```javascript
// ============================================
// Token threshold constants for compaction
// Location: chunks.147.mjs:2676-2686
// ============================================

// ORIGINAL (for source lookup):
RmY = 20000
Jp8 = 13000
hmY = 20000
SmY = 20000
Mp8 = 3000
aqq = 3

// READABLE (for understanding):
// Token thresholds for different contexts
const DEFAULT_AUTO_COMPACT_THRESHOLD = 20000;     // RmY - Default trigger point
const MIN_MESSAGES_BEFORE_COMPACT = 13000;        // Jp8 - Minimum messages threshold
const SESSION_MEMORY_THRESHOLD = 20000;           // hmY - For session memory mode
const BACKGROUND_COMPACT_THRESHOLD = 20000;       // SmY - For background agents
const MIN_REMAINING_TOKENS = 3000;                // Mp8 - Keep this many tokens after compact
const CIRCUIT_BREAKER_THRESHOLD = 3;              // aqq - Max consecutive failures (v2.1.76)

// Mapping: RmY→DEFAULT_AUTO_COMPACT_THRESHOLD, Jp8→MIN_MESSAGES_BEFORE_COMPACT,
//          hmY→SESSION_MEMORY_THRESHOLD, SmY→BACKGROUND_COMPACT_THRESHOLD,
//          Mp8→MIN_REMAINING_TOKENS, aqq→CIRCUIT_BREAKER_THRESHOLD
```

### 4.1 Threshold Selection Algorithm

**How the threshold is determined:**

1. **Model-specific thresholds** - Different models have different context windows
2. **Default fallback** - If no model-specific threshold, use 20,000 tokens
3. **Buffer calculation** - Threshold = context_window * 0.8 (leaves 20% buffer)
4. **Minimum threshold** - Never compact if tokens < 13,000 (avoids premature compaction)

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

### 6.2 Circuit Breaker Implementation (Verified Source)

**Source location:** `chunks.147.mjs:2686`

```javascript
// ============================================
// Circuit Breaker Constants and Logic
// Location: chunks.147.mjs:2633-2674 (logic), 2686 (threshold)
// ============================================

// ORIGINAL (for source lookup):
// From chunks.147.mjs:2686
aqq = 3

// From chunks.147.mjs:2633-2674 (inside sqq)
async function sqq(A, q, K, Y, z, _) {
    // Circuit breaker check (early return)
    if (z?.consecutiveFailures !== void 0 && z.consecutiveFailures >= aqq) return {
        wasCompacted: !1
    };
    // ... compaction logic ...
    try {
        // ... perform compaction ...
        return {
            wasCompacted: !0,
            compactionResult: j,
            consecutiveFailures: 0  // Reset on success
        }
    } catch (j) {
        let M = (z?.consecutiveFailures ?? 0) + 1;
        if (M >= aqq) k(`autocompact: circuit breaker tripped after ${M} consecutive failures — skipping future attempts this session`, {
            level: "warn"
        });
        return {
            wasCompacted: !1,
            consecutiveFailures: M
        }
    }
}

// READABLE (for understanding):
const CIRCUIT_BREAKER_THRESHOLD = 3;  // aqq

async function autoCompactDispatcher(
    messages,
    sessionContext,
    cacheSafeParams,
    querySource,
    compactState,      // Contains consecutiveFailures counter
    tokensFreedBySnip
) {
    // Circuit breaker: Stop if 3+ consecutive failures
    if (compactState?.consecutiveFailures !== undefined &&
        compactState.consecutiveFailures >= CIRCUIT_BREAKER_THRESHOLD) {
        return { wasCompacted: false };
    }

    try {
        // ... compaction logic ...
        return {
            wasCompacted: true,
            compactionResult: result,
            consecutiveFailures: 0  // Reset on success
        };
    } catch (error) {
        let newFailureCount = (compactState?.consecutiveFailures ?? 0) + 1;

        // Log when circuit breaker trips
        if (newFailureCount >= CIRCUIT_BREAKER_THRESHOLD) {
            debug(`autocompact: circuit breaker tripped after ${newFailureCount} consecutive failures — skipping future attempts this session`, {
                level: "warn"
            });
        }

        return {
            wasCompacted: false,
            consecutiveFailures: newFailureCount
        };
    }
}

// Mapping: aqq→CIRCUIT_BREAKER_THRESHOLD, sqq→autoCompactDispatcher,
//          z→compactState, M→newFailureCount
```

### 6.3 Circuit Breaker State Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CIRCUIT BREAKER STATE MACHINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Initial State: consecutiveFailures = 0                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        COMPACT ATTEMPT                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│                 ┌────────────┴────────────┐                                 │
│                 │                         │                                 │
│              SUCCESS                    FAILURE                             │
│                 │                         │                                 │
│                 ▼                         ▼                                 │
│    consecutiveFailures = 0      consecutiveFailures++                       │
│    (circuit remains CLOSED)            │                                   │
│                                        │                                   │
│                         ┌──────────────┴──────────────┐                    │
│                         │                             │                    │
│                failures < 3                    failures >= 3               │
│                    │                                 │                    │
│                    ▼                                 ▼                    │
│              Circuit CLOSED                   Circuit OPEN                 │
│              (keep trying)                    (stop trying)                │
│                                                                              │
│  RECOVERY:                                                                   │
│  - On session restart: consecutiveFailures = 0                             │
│  - On successful compact: consecutiveFailures = 0                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key insight:** The circuit breaker is implemented as part of the `compactState` object passed between compaction attempts. This design allows:
1. State to be tracked per-session
2. No global state pollution
3. Easy reset on new session or successful compact

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
| Enabled check | `chunks.147.mjs:2614` | `isAutoCompactEnabled` (Xh) |
| Threshold decision | `chunks.147.mjs:2620` | `shouldTriggerAutoCompaction` (CmY) |
| Main dispatcher | `chunks.147.mjs:2633` | `autoCompactDispatcher` (sqq) |
| Circuit breaker | `chunks.147.mjs:2686` | `aqq = 3` threshold |
| Session memory | `chunks.147.mjs` | `trySessionMemoryQuickPath` (lE1) |
| Standard compact | `chunks.147.mjs` | `performFullCompaction` (mf6) |
| Agent loop call | `chunks.169.mjs:739` | Within `llmRequestGenerator` |
| Token constants | `chunks.147.mjs:2676-2686` | Threshold values |

---

## 10. Deep Algorithm Analysis

### 10.1 Token Threshold Calculation Algorithm

**How the compaction threshold is determined:**

The threshold calculation involves three interconnected functions: `getEffectiveContextWindow` (OF), `getAutoCompactThreshold` (oc6), and `getCompactionStatus` (mz6).

#### 10.1.1 Effective Context Window Calculation (OF)

```javascript
// ============================================
// getEffectiveContextWindow - Calculate usable context window
// Location: chunks.147.mjs:2566-2575
// ============================================

// ORIGINAL (for source lookup):
function OF(A) {
    let q = Math.min(Li6(A), RmY),
        K = uM(A, Zj()),
        Y = process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
    if (Y) {
        let z = parseInt(Y, 10);
        if (!isNaN(z) && z > 0) K = Math.min(K, z)
    }
    return K - q
}

// READABLE (for understanding):
function getEffectiveContextWindow(model) {
    // Step 1: Get reserved tokens for thinking budget (min of model's thinking budget, 20000 cap)
    let reservedTokens = Math.min(getThinkingBudget(model), DEFAULT_AUTO_COMPACT_THRESHOLD);

    // Step 2: Get model's maximum context window
    let maxContextWindow = getContextWindow(model, getSettings());

    // Step 3: Allow environment override to reduce window
    let envWindow = process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW;
    if (envWindow) {
        let parsed = parseInt(envWindow, 10);
        if (!isNaN(parsed) && parsed > 0) {
            maxContextWindow = Math.min(maxContextWindow, parsed);
        }
    }

    // Step 4: Subtract reserved tokens from available window
    return maxContextWindow - reservedTokens;
}

// Mapping: OF→getEffectiveContextWindow, A→model, q→reservedTokens,
//          K→maxContextWindow, Y→envWindow, Li6→getThinkingBudget,
//          uM→getContextWindow, Zj→getSettings, RmY→DEFAULT_AUTO_COMPACT_THRESHOLD
```

**Why reserve tokens:** The reserved tokens account for the thinking budget that the model may use. This ensures auto-compaction triggers before the context fills up AND before thinking tokens would be constrained.

#### 10.1.2 Auto-Compact Threshold Calculation (oc6)

```javascript
// ============================================
// getAutoCompactThreshold - Calculate compaction trigger threshold
// Location: chunks.147.mjs:2577-2589
// ============================================

// ORIGINAL (for source lookup):
function oc6(A) {
    let q = OF(A),
        K = q - Jp8,
        Y = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
    if (Y) {
        let z = parseFloat(Y);
        if (!isNaN(z) && z > 0 && z <= 100) {
            let _ = Math.floor(q * (z / 100));
            return Math.min(_, K)
        }
    }
    return K
}

// READABLE (for understanding):
function getAutoCompactThreshold(model) {
    // Step 1: Get effective window (already subtracts reserved tokens)
    let effectiveWindow = getEffectiveContextWindow(model);

    // Step 2: Calculate threshold with minimum buffer
    // This leaves MIN_MESSAGES_BEFORE_COMPACT (13,000) tokens of buffer
    let threshold = effectiveWindow - MIN_MESSAGES_BEFORE_COMPACT;

    // Step 3: Allow percentage-based override
    let pctOverride = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
    if (pctOverride) {
        let pct = parseFloat(pctOverride);
        if (!isNaN(pct) && pct > 0 && pct <= 100) {
            let pctThreshold = Math.floor(effectiveWindow * (pct / 100));
            // Use the smaller of percentage-based or default threshold
            return Math.min(pctThreshold, threshold);
        }
    }

    return threshold;
}

// Mapping: oc6→getAutoCompactThreshold, A→model, q→effectiveWindow,
//          K→threshold, Y→pctOverride, Jp8→MIN_MESSAGES_BEFORE_COMPACT (13000)
```

**Why 13,000 token buffer:** The `MIN_MESSAGES_BEFORE_COMPACT` (13,000) buffer ensures:
1. Space for the next user message
2. Room for tool results that may be injected
3. Margin for token estimation variance
4. Prevents compaction from triggering on small contexts

#### 10.1.3 Compaction Status Calculation (mz6)

```javascript
// ============================================
// getCompactionStatus - Calculate all threshold-related states
// Location: chunks.147.mjs:2591-2612
// ============================================

// ORIGINAL (for source lookup):
function mz6(A, q) {
    let K = oc6(q),
        Y = Xh() ? K : OF(q),
        z = Math.max(0, Math.round((Y - A) / Y * 100)),
        _ = Y - hmY,
        w = Y - SmY,
        O = A >= _,
        $ = A >= w,
        H = Xh() && A >= K,
        J = OF(q) - Mp8,
        M = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE,
        D = M ? parseInt(M, 10) : NaN,
        X = !isNaN(D) && D > 0 ? D : J,
        P = A >= X;
    return {
        percentLeft: z,
        isAboveWarningThreshold: O,
        isAboveErrorThreshold: $,
        isAboveAutoCompactThreshold: H,
        isAtBlockingLimit: P
    }
}

// READABLE (for understanding):
function getCompactionStatus(tokenCount, model) {
    // Calculate thresholds
    let autoCompactThreshold = getAutoCompactThreshold(model);
    let effectiveWindow = getEffectiveContextWindow(model);

    // Use auto-compact threshold if enabled, otherwise use full window
    let referenceWindow = isAutoCompactEnabled() ? autoCompactThreshold : effectiveWindow;

    // Calculate percentage remaining
    let percentLeft = Math.max(0, Math.round((referenceWindow - tokenCount) / referenceWindow * 100));

    // Calculate warning threshold (window - 20,000)
    let warningThreshold = referenceWindow - SESSION_MEMORY_THRESHOLD;  // 20,000

    // Calculate error threshold (window - 20,000)
    let errorThreshold = referenceWindow - BACKGROUND_COMPACT_THRESHOLD;  // 20,000

    // Check if above warning level
    let isAboveWarningThreshold = tokenCount >= warningThreshold;

    // Check if above error level
    let isAboveErrorThreshold = tokenCount >= errorThreshold;

    // Check if should trigger auto-compact (requires auto-compact enabled)
    let isAboveAutoCompactThreshold = isAutoCompactEnabled() && tokenCount >= autoCompactThreshold;

    // Calculate blocking limit (window - 3,000 minimum remaining)
    let blockingLimit = effectiveWindow - MIN_REMAINING_TOKENS;

    // Allow environment override for blocking limit
    let envBlockingOverride = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE;
    let parsedOverride = envBlockingOverride ? parseInt(envBlockingOverride, 10) : NaN;
    let effectiveBlockingLimit = !isNaN(parsedOverride) && parsedOverride > 0
        ? parsedOverride
        : blockingLimit;

    // Check if at blocking limit (cannot continue)
    let isAtBlockingLimit = tokenCount >= effectiveBlockingLimit;

    return {
        percentLeft,
        isAboveWarningThreshold,
        isAboveErrorThreshold,
        isAboveAutoCompactThreshold,
        isAtBlockingLimit
    };
}

// Mapping: mz6→getCompactionStatus, A→tokenCount, q→model,
//          K→autoCompactThreshold, Y→referenceWindow, z→percentLeft,
//          _→warningThreshold, w→errorThreshold, O→isAboveWarningThreshold,
//          $→isAboveErrorThreshold, H→isAboveAutoCompactThreshold,
//          J→blockingLimit, P→isAtBlockingLimit,
//          hmY→SESSION_MEMORY_THRESHOLD (20000), SmY→BACKGROUND_COMPACT_THRESHOLD (20000),
//          Mp8→MIN_REMAINING_TOKENS (3000)
```

#### 10.1.4 Threshold Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THRESHOLD HIERARCHY (Model: claude-sonnet-4)              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Context Window: 200,000 tokens                                              │
│  ├─ Reserved for thinking: 20,000 tokens (capped)                          │
│  └─ Effective Window: 180,000 tokens                                        │
│                                                                              │
│  Thresholds (from high to low):                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Blocking Limit:      177,000 tokens (window - 3,000)              │   │
│  │                              ↑ Cannot proceed beyond this          │   │
│  │                              │                                      │   │
│  │  Auto-Compact Trigger: 167,000 tokens (effective - 13,000)         │   │
│  │                              ↑ Compaction starts here              │   │
│  │                              │                                      │   │
│  │  Error Threshold:      160,000 tokens (window - 20,000)            │   │
│  │                              ↑ UI shows error indicator            │   │
│  │                              │                                      │   │
│  │  Warning Threshold:    160,000 tokens (window - 20,000)            │   │
│  │                              ↑ UI shows warning indicator          │   │
│  │                              │                                      │   │
│  │  Safe Zone:            0 - 160,000 tokens                          │   │
│  │                              ↑ Normal operation                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Percent Left Calculation:                                                  │
│  percentLeft = max(0, round((referenceWindow - tokenCount) / referenceWindow * 100))    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why multiple thresholds:**
1. **Warning threshold** - Alerts user that context is filling up (UI indicator)
2. **Error threshold** - Indicates context is nearly full (stronger UI warning)
3. **Auto-compact threshold** - Triggers automatic compaction
4. **Blocking limit** - Hard stop; cannot proceed without compaction or context reduction

### 10.2 Compaction Path Selection Algorithm

**How the system chooses between session memory and standard compaction:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPACTION PATH SELECTION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  autoCompactDispatcher()                                                    │
│  │                                                                          │
│  ├─► shouldTriggerAutoCompaction() returns true?                           │
│  │   │                                                                      │
│  │   └─► YES (tokens > threshold)                                          │
│  │                                                                          │
│  ├─► isSessionMemoryCompactEnabled()?                                       │
│  │   │                                                                      │
│  │   ├─► YES ──► trySessionMemoryQuickPath()                               │
│  │   │              │                                                       │
│  │   │              ├─► SUCCESS ──► Return compacted messages              │
│  │   │              │                                                       │
│  │   │              └─► FAILURE ──► Fall through to standard               │
│  │   │                                                                      │
│  │   └─► NO ──► performFullCompaction()                                    │
│  │                  │                                                       │
│  │                  ├─► SUCCESS ──► Return compacted messages              │
│  │                  │                                                       │
│  │                  └─► FAILURE ──► Increment circuit breaker              │
│  │                                                                          │
│  └─► Return { wasCompacted: boolean, result?, consecutiveFailures? }       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Session Memory vs Standard Compaction Trade-offs

| Aspect | Session Memory Compact | Standard Compact |
|--------|------------------------|------------------|
| **Mechanism** | Pre-computed memory from `.claude/memory/` | LLM summarization on-demand |
| **Performance** | Fast (no LLM call needed) | Slower (requires API call) |
| **Quality** | Preserves key facts from history | May lose context details |
| **Availability** | Requires feature flags | Always available |
| **Cost** | No API cost per compact | API call per compact |
| **Freshness** | Updated asynchronously | Real-time summarization |

**When session memory is preferred:**
- Long-running sessions with many turns
- Sessions where key facts need persistence
- When API cost is a concern
- When speed is critical

**When standard compaction is preferred:**
- Feature flags not enabled
- Real-time context is essential
- Session memory not yet populated
- Complex multi-turn reasoning needs summarization

---

## 11. Cross-Feature Connections

### 11.1 Connection to 04_system_reminder

Compaction affects system reminder attachment producers:

| Compaction Event | System Reminder Effect |
|------------------|------------------------|
| Pre-compaction | `CompactionTriggeredAttachment` produced |
| Post-compaction | `CompactionSummaryAttachment` added |
| Session memory | Memory-based reminders updated |

### 11.2 Connection to 05_tools

Tool usage affects compaction triggers:

| Tool | Compaction Effect |
|------|-------------------|
| Snip tool | Frees tokens, may avoid compaction |
| Compact tool | Manual compaction trigger |
| Long tool results | Increase token count, may trigger compaction |

### 11.3 Connection to 06_mcp

MCP servers can contribute to context growth:

| MCP Source | Token Impact |
|------------|--------------|
| Large tool schemas | Added to system prompt |
| Tool results | Contribute to message history |
| Resource content | May trigger compaction |

### 11.4 Connection to 11_hooks

Hooks are triggered during compaction:

| Hook Type | Compaction Timing |
|-----------|-------------------|
| `PreCompact` | Before compaction starts |
| `PostCompact` | After compaction completes |

---

## 12. Symbol Reference Summary

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - LLM API

Key symbols verified in this document:
- `Xh` (isAutoCompactEnabled) - chunks.147.mjs:2614
- `CmY` (shouldTriggerAutoCompaction) - chunks.147.mjs:2620
- `sqq` (autoCompactDispatcher) - chunks.147.mjs:2633
- `oc6` (getAutoCompactThreshold) - Token threshold getter
- `lE1` (trySessionMemoryQuickPath) - Session memory compaction
- `mf6` (performFullCompaction) - Standard compaction
- `aqq` (CIRCUIT_BREAKER_THRESHOLD) - chunks.147.mjs:2686 (value: 3)
- `RmY` (DEFAULT_AUTO_COMPACT_THRESHOLD) - chunks.147.mjs:2676 (value: 20000)
- `Jp8` (MIN_MESSAGES_BEFORE_COMPACT) - chunks.147.mjs:2678 (value: 13000)
- `Mp8` (MIN_REMAINING_TOKENS) - chunks.147.mjs:2684 (value: 3000)
