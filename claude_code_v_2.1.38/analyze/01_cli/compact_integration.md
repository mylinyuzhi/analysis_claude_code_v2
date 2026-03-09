# CLI-Compact Integration

> How CLI state triggers auto-compaction and manages session memory

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Compact Module
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - LLM API

Key functions in this document:
- `autoCompactDispatcher` (fs4) - Top-level auto-compaction orchestrator
- `shouldAutoCompact` (amY) - Determines if compaction is needed
- `getAutoCompactThreshold` (SQ1) - Returns token threshold for triggering
- `performSessionMemoryCompaction` (vZ6) - Session memory compaction path
- `performFullCompaction` (AW1) - Standard compaction path

---

## Overview

The compact system integrates with CLI through:

1. **Environment Variable Overrides** - `DISABLE_COMPACT`, `DISABLE_AUTO_COMPACT`
2. **Settings Configuration** - `autoCompactEnabled` in user/project config
3. **Token Threshold Management** - Automatic triggering based on context size
4. **Session Memory Integration** - New session memory-based compaction (v2.1.38)

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
│      │ Normal      │   │ (fs4)                       │                    │
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
│              │ performSession      │   │ performFull         │           │
│              │ MemoryCompaction()  │   │ Compaction()        │           │
│              │ (vZ6)               │   │ (AW1)               │           │
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

## 2. autoCompactDispatcher (fs4)

**What it does:** Top-level orchestrator that decides whether compaction is needed and which compaction path to use.

**Location:** `chunks.147.mjs:778-803`

### 2.1 Function Implementation

```javascript
// ============================================
// autoCompactDispatcher - Main compaction orchestrator
// Location: chunks.147.mjs:778-803
// ============================================

// ORIGINAL (for source lookup):
async function fs4(A, q, K, Y) {
    if (J6(process.env.DISABLE_COMPACT)) return {
        wasCompacted: !1
    };
    let z = q.options.mainLoopModel;
    if (!await amY(A, z, Y)) return {
        wasCompacted: !1
    };
    let H = await vZ6(A, q.agentId, SQ1(z));
    if (H) return i51(void 0), {
        wasCompacted: !0,
        compactionResult: H
    };
    try {
        let $ = await AW1(A, q, K, !0, void 0, !0);
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
    if (!await shouldAutoCompact(messages, model, querySource)) {
        return { wasCompacted: false };
    }

    // Step 4: Try session memory compaction first (new path)
    let sessionMemoryResult = await performSessionMemoryCompaction(
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

// Mapping: fs4→autoCompactDispatcher, A→messages, q→sessionContext,
//          K→cacheSafeParams, Y→querySource, z→model, H→sessionMemoryResult,
//          amY→shouldAutoCompact, vZ6→performSessionMemoryCompaction,
//          SQ1→getAutoCompactThreshold, AW1→performFullCompaction, i51→clearLastCompactionTimestamp
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

## 3. shouldAutoCompact (amY)

**What it does:** Determines if token count exceeds the threshold requiring compaction.

**Location:** `chunks.147.mjs:765-776`

```javascript
// ============================================
// shouldAutoCompact - Check if compaction is needed
// Location: chunks.147.mjs:765-776
// ============================================

// ORIGINAL (for source lookup):
async function amY(A, q, K) {
    if (K === "session_memory" || K === "compact") return !1;
    if (!xm()) return !1;
    let Y = Ev(A),
        z = SQ1(q),
        w = m51(q);
    h(`autocompact: tokens=${Y} threshold=${z} effectiveWindow=${w}`);
    let {
        isAboveAutoCompactThreshold: H
    } = Ac(Y, q);
    return H
}

// READABLE (for understanding):
async function shouldAutoCompact(messages, model, querySource) {
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
    let { isAboveAutoCompactThreshold } = checkTokenThreshold(tokenCount, model);

    return isAboveAutoCompactThreshold;
}

// Mapping: amY→shouldAutoCompact, A→messages, q→model, K→querySource,
//          Y→tokenCount, z→threshold, w→effectiveWindow, Ev→countTokens,
//          SQ1→getAutoCompactThreshold, m51→getEffectiveContextWindow,
//          xm→isAutoCompactEnabled, Ac→checkTokenThreshold
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

**What it does:** New compaction path (v2.1.38) that uses persistent session memory instead of on-the-fly summarization.

### 5.1 Feature Flag Gating

```javascript
// ============================================
// Session Memory feature flags
// Location: Various config files
// ============================================

// Feature flags required for session memory compaction:
// - tengu_session_memory: Enables session memory storage
// - tengu_sm_compact: Enables session memory-based compaction

// Environment override:
// ENABLE_CLAUDE_CODE_SM_COMPACT=1

// READABLE (for understanding):
function isSessionMemoryCompactionEnabled() {
    // Check environment override first
    if (parseBoolean(process.env.ENABLE_CLAUDE_CODE_SM_COMPACT)) {
        return true;
    }

    // Check feature flags
    return isFeatureEnabled("tengu_session_memory")
        && isFeatureEnabled("tengu_sm_compact");
}
```

### 5.2 Session Memory vs Standard Compaction

| Aspect | Session Memory | Standard Compaction |
|--------|---------------|---------------------|
| Storage | Persistent `.claude/memory/` | In-message summary |
| Retention | Across sessions | Current session only |
| Performance | Faster (pre-computed) | Slower (LLM summarization) |
| Quality | Preserves key facts | May lose context |
| Availability | Feature flag | Always available |

---

## 6. Integration with Agent Loop

### 6.1 Call Site in LLM Query

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

### 6.2 Abort Signal Handling

**Critical integration point:** The compact operation checks the abort signal before starting:

```javascript
// ============================================
// Compact respects abort signal
// Location: chunks.169.mjs (in llmRequestGenerator)
// ============================================

// READABLE (for understanding):
async function* llmRequestGenerator(messages, context, params) {
    // ... build messages ...

    // Check abort before compaction
    if (signal?.aborted) {
        return;
    }

    // Only compact if not aborted
    if (shouldAutoCompact(messages, model, querySource)) {
        await autoCompactDispatcher(messages, context, params, querySource);
    }

    // Check abort again before LLM call
    if (signal?.aborted) {
        return;
    }

    // Make LLM API call
    yield* streamingQuery(messages, ...);
}
```

---

## 7. CLI Print Mode Integration

### 7.1 Print Mode Considerations

In print mode (`-p` / `--print`), compaction works differently:

1. **No user interaction** - Compaction happens silently
2. **Cost awareness** - Compaction adds LLM API calls
3. **Session persistence** - May be disabled with `--no-session-persistence`

### 7.2 Settings for Print Mode

```javascript
// ============================================
// Print mode compact settings
// Location: chunks.189.mjs
// ============================================

// In print mode:
// - autoCompactEnabled is typically true (default)
// - Can be disabled via DISABLE_AUTO_COMPACT=1
// - Session persistence affects whether compact state is saved

if (options.noSessionPersistence) {
    // Compaction state won't persist
    // But compaction still runs during the session
}
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
| Session memory | `chunks.147.mjs` | `performSessionMemoryCompaction` |
| Standard compact | `chunks.147.mjs` | `performFullCompaction` |
| Agent loop call | `chunks.169.mjs:739` | Within `llmRequestGenerator` |
| Token constants | `chunks.147.mjs:805` | Threshold values |