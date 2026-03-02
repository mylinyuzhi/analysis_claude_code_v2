# Trigger Mechanism - Context Compaction

## Overview

The compaction trigger mechanism determines **when** Claude Code should compact the conversation context. This is a critical system that balances three competing concerns:

1. **Maximizing context utilization** - Use as much of the model's context window as possible
2. **Preventing blocking** - Never exceed the model's hard limit that would cause API errors
3. **Minimizing compaction frequency** - Avoid unnecessary compactions that lose context

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `getCompactionStatus` (Ac) - Calculates all threshold status flags
- `getAutoCompactThreshold` (SQ1) - Returns the token threshold for triggering auto-compact
- `getEffectiveContextWindow` (m51) - Calculates effective context window for a model
- `isAutoCompactEnabled` (xm) - Checks if auto-compaction is enabled
- `shouldAutoCompact` (amY) - Final decision on whether to trigger compaction

---

## Threshold Architecture

### Key Constants

```javascript
// ============================================
// Compaction Threshold Constants
// Location: chunks.147.mjs:805-813
// ============================================

// ORIGINAL (for source lookup):
nmY = 20000  // MAX_COMPACT_BUFFER - Buffer from model's max context
cCA = 13000  // AUTO_COMPACT_BUFFER_OFFSET - Default offset from threshold
rmY = 20000  // TOKEN_WARNING_THRESHOLD - Warning threshold offset
omY = 20000  // TOKEN_ERROR_THRESHOLD - Error threshold offset
lCA = 3000   // BLOCKING_LIMIT_OFFSET - Blocking limit buffer

// READABLE (for understanding):
const MAX_COMPACT_BUFFER = 20000;        // Reserved for system prompts + response
const AUTO_COMPACT_BUFFER_OFFSET = 13000; // Tokens below effective window to trigger
const TOKEN_WARNING_THRESHOLD = 20000;   // How far below threshold to show warning
const TOKEN_ERROR_THRESHOLD = 20000;     // How far below threshold to show error
const BLOCKING_LIMIT_OFFSET = 3000;      // Hard stop before model max context
```

### Threshold Calculation Flow

```
Model's Maximum Context (e.g., 200,000 for Claude Opus 4)
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Effective Context Window                                       │
│  = maxContext - min(maxOutputTokens, MAX_COMPACT_BUFFER)        │
│  = 200,000 - min(64000, 20000) = 200,000 - 20,000 = 180,000     │
│                                                                 │
│  Note: MAX_COMPACT_BUFFER caps the output token deduction       │
└────────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Auto-Compact Threshold                                         │
│  = EffectiveWindow - AUTO_COMPACT_BUFFER_OFFSET                 │
│  = 180,000 - 13,000 = 167,000                                   │
│  (Compaction triggers here when enabled)                        │
└────────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Warning Threshold                                              │
│  = AutoCompactThreshold - TOKEN_WARNING_THRESHOLD               │
│  = 167,000 - 20,000 = 147,000                                   │
│  (UI shows warning indicator)                                   │
└────────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Error Threshold                                                │
│  = AutoCompactThreshold - TOKEN_ERROR_THRESHOLD                 │
│  = 167,000 - 20,000 = 147,000                                   │
│  (UI shows error indicator)                                     │
└────────────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Blocking Limit                                                 │
│  = modelMaxContext - BLOCKING_LIMIT_OFFSET                      │
│  = 200,000 - 3,000 = 197,000                                    │
│  (Hard stop - no new messages allowed)                          │
└────────────────────────────────────────────────────────────────┘
```

---

## Core Functions

### getEffectiveContextWindow (m51)

**What it does:** Calculates the usable context window for a given model, accounting for reserved tokens.

**How it works:**
1. Gets the model's maximum context from model configuration
2. Subtracts a buffer (MAX_COMPACT_BUFFER = 20,000) to reserve space for:
   - System prompts that get injected
   - Model response generation
   - Token estimation inaccuracies
3. Returns the adjusted effective window

```javascript
// ============================================
// getEffectiveContextWindow - Calculates usable context window
// Location: chunks.147.mjs:717-719
// ============================================

// ORIGINAL (for source lookup):
function m51(A) {
    let q = Math.min(iCA(A), nmY);
    return yG(A, FP()) - q
}

// READABLE (for understanding):
function getEffectiveContextWindow(model) {
    // Get max output tokens for model (e.g., 64000 for Opus 4.5, 32000 for Opus 4)
    // But cap the buffer at MAX_COMPACT_BUFFER (20000)
    let buffer = Math.min(getMaxOutputTokens(model), MAX_COMPACT_BUFFER);
    // Subtract buffer from model's max context (200000)
    return getMaxContextTokens(model, getCurrentProvider()) - buffer;
}

// Mapping: m51→getEffectiveContextWindow, A→model, q→buffer, iCA→getMaxOutputTokens,
//   nmY→MAX_COMPACT_BUFFER, yG→getMaxContextTokens, FP→getCurrentProvider
```

**Why this approach:**
- `getMaxOutputTokens(model)` returns model-specific output limits (64k for Opus 4.5, 32k for Opus 4, etc.)
- The buffer is capped at 20,000 to prevent excessive reduction for high-output models
- `getMaxContextTokens` returns 200,000 for most Claude models
- Result: 200,000 - 20,000 = 180,000 effective window for most models

---

### getAutoCompactThreshold (SQ1)

**What it does:** Returns the token count at which auto-compaction should trigger.

**How it works:**
1. Gets the effective context window
2. Subtracts the buffer offset (13,000 tokens by default)
3. If `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` env var is set, allows percentage-based threshold

```javascript
// ============================================
// getAutoCompactThreshold - Returns trigger threshold for auto-compact
// Location: chunks.147.mjs:722-733
// ============================================

// ORIGINAL (for source lookup):
function SQ1(A) {
    let q = m51(A),
        K = q - cCA,
        Y = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
    if (Y) {
        let z = parseFloat(Y);
        if (!isNaN(z) && z > 0 && z <= 100) {
            let w = Math.floor(q * (z / 100));
            return Math.min(w, K)
        }
    }
    return K
}

// READABLE (for understanding):
function getAutoCompactThreshold(model) {
    let effectiveWindow = getEffectiveContextWindow(model);
    let defaultThreshold = effectiveWindow - AUTO_COMPACT_BUFFER_OFFSET; // 13k below

    // Check for environment variable override
    let pctOverride = process.env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE;
    if (pctOverride) {
        let pct = parseFloat(pctOverride);
        if (!isNaN(pct) && pct > 0 && pct <= 100) {
            // Calculate threshold as percentage of effective window
            let pctThreshold = Math.floor(effectiveWindow * (pct / 100));
            // Use the smaller value (more conservative)
            return Math.min(pctThreshold, defaultThreshold);
        }
    }
    return defaultThreshold;
}

// Mapping: SQ1→getAutoCompactThreshold, A→model, q→effectiveWindow, K→defaultThreshold,
//   Y→pctOverride, z→pct, w→pctThreshold, m51→getEffectiveContextWindow, cCA→AUTO_COMPACT_BUFFER_OFFSET
```

**Why the 13,000 offset:**
- Provides 13,000 tokens of "breathing room" before reaching the effective window
- Accounts for tokens that will be added during the next user-assistant exchange
- Prevents immediate re-compaction after a single message

**Environment Variable Override:**
Setting `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` would trigger compaction at 80% of the effective window, allowing more context to be used before compaction.

---

### getCompactionStatus (Ac)

**What it does:** Returns a comprehensive status object indicating the current state of context utilization.

**How it works:**
1. Gets current token count and thresholds
2. Calculates percentage remaining
3. Compares against all threshold levels
4. Returns boolean flags for each status

```javascript
// ============================================
// getCompactionStatus - Returns comprehensive threshold status
// Location: chunks.147.mjs:736-757
// ============================================

// ORIGINAL (for source lookup):
function Ac(A, q) {
    let K = SQ1(q),
        Y = xm() ? K : m51(q),
        z = Math.max(0, Math.round((Y - A) / Y * 100)),
        w = Y - rmY,
        H = Y - omY,
        $ = A >= w,
        O = A >= H,
        _ = xm() && A >= K,
        X = yG(q, FP()) - lCA,
        D = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE,
        j = D ? parseInt(D, 10) : NaN,
        M = !isNaN(j) && j > 0 ? j : X,
        P = A >= M;
    return {
        percentLeft: z,
        isAboveWarningThreshold: $,
        isAboveErrorThreshold: O,
        isAboveAutoCompactThreshold: _,
        isAtBlockingLimit: P
    }
}

// READABLE (for understanding):
function getCompactionStatus(currentTokens, model) {
    let autoCompactThreshold = getAutoCompactThreshold(model);

    // Use different "reference" based on auto-compact enabled
    let referenceThreshold = isAutoCompactEnabled()
        ? autoCompactThreshold
        : getEffectiveContextWindow(model);

    // Calculate percentage of context remaining
    let percentLeft = Math.max(0, Math.round(
        (referenceThreshold - currentTokens) / referenceThreshold * 100
    ));

    // Calculate warning/error thresholds
    let warningThreshold = referenceThreshold - TOKEN_WARNING_THRESHOLD; // -20k
    let errorThreshold = referenceThreshold - TOKEN_ERROR_THRESHOLD;     // -20k

    // Determine status flags
    let isAboveWarningThreshold = currentTokens >= warningThreshold;
    let isAboveErrorThreshold = currentTokens >= errorThreshold;
    let isAboveAutoCompactThreshold = isAutoCompactEnabled() && currentTokens >= autoCompactThreshold;

    // Calculate blocking limit (hard stop)
    let defaultBlockingLimit = getMaxContextTokens(model, getCurrentProvider()) - BLOCKING_LIMIT_OFFSET;
    let blockingOverride = process.env.CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE;
    let parsedOverride = blockingOverride ? parseInt(blockingOverride, 10) : NaN;
    let blockingLimit = !isNaN(parsedOverride) && parsedOverride > 0
        ? parsedOverride
        : defaultBlockingLimit;
    let isAtBlockingLimit = currentTokens >= blockingLimit;

    return {
        percentLeft,                    // e.g., 25% context remaining
        isAboveWarningThreshold,        // Show warning in UI
        isAboveErrorThreshold,          // Show error in UI
        isAboveAutoCompactThreshold,    // Trigger auto-compact
        isAtBlockingLimit               // Block new messages
    };
}

// Mapping: Ac→getCompactionStatus, A→currentTokens, q→model, K→autoCompactThreshold,
//   Y→referenceThreshold, z→percentLeft, w→warningThreshold, H→errorThreshold,
//   $→isAboveWarningThreshold, O→isAboveErrorThreshold, _→isAboveAutoCompactThreshold,
//   X→defaultBlockingLimit, D→blockingOverride, j→parsedOverride, M→blockingLimit,
//   P→isAtBlockingLimit, SQ1→getAutoCompactThreshold, xm→isAutoCompactEnabled,
//   m51→getEffectiveContextWindow, yG→getMaxContextTokens, FP→getCurrentProvider,
//   rmY→TOKEN_WARNING_THRESHOLD, omY→TOKEN_ERROR_THRESHOLD, lCA→BLOCKING_LIMIT_OFFSET
```

**Status Level Meanings:**

| Status | When True | UI Behavior |
|--------|-----------|-------------|
| `isAboveWarningThreshold` | tokens >= threshold - 20k | Yellow indicator, "Context getting long" |
| `isAboveErrorThreshold` | tokens >= threshold - 20k | Red indicator, "Context very long" |
| `isAboveAutoCompactThreshold` | tokens >= threshold AND auto-compact on | Triggers auto-compaction |
| `isAtBlockingLimit` | tokens >= modelMax - 3k | Blocks new messages, requires compact |

**Key insight:** Warning and error thresholds use the same offset (20k), meaning they trigger at the same point. The UI may differentiate based on other factors like auto-compact status.

---

### isAutoCompactEnabled (xm)

**What it does:** Checks whether auto-compaction is enabled for the current session.

```javascript
// ============================================
// isAutoCompactEnabled - Checks if auto-compact is enabled
// Location: chunks.147.mjs:759-762
// ============================================

// ORIGINAL (for source lookup):
function xm() {
    if (J6(process.env.DISABLE_COMPACT)) return !1;
    if (J6(process.env.DISABLE_AUTO_COMPACT)) return !1;
    return f6().autoCompactEnabled
}

// READABLE (for understanding):
function isAutoCompactEnabled() {
    // Check for hard-disable via environment
    if (parseBoolean(process.env.DISABLE_COMPACT)) return false;
    if (parseBoolean(process.env.DISABLE_AUTO_COMPACT)) return false;
    // Check user settings
    return getUserSettings().autoCompactEnabled;
}

// Mapping: xm→isAutoCompactEnabled, J6→parseBoolean, f6→getUserSettings
```

**Disable Flags:**
- `DISABLE_COMPACT=true` - Disables ALL compaction (auto and manual)
- `DISABLE_AUTO_COMPACT=true` - Disables auto-compaction only (manual still works)
- User setting `autoCompactEnabled: false` - Same as DISABLE_AUTO_COMPACT

---

### shouldAutoCompact (amY)

**What it does:** Makes the final decision on whether to trigger auto-compaction.

**How it works:**
1. Skips if in special session types (session_memory, compact)
2. Checks if auto-compact is enabled
3. Gets current token count and threshold
4. Returns true if above threshold

```javascript
// ============================================
// shouldAutoCompact - Final decision on auto-compact trigger
// Location: chunks.147.mjs:765-775
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
async function shouldAutoCompact(messages, model, sessionMemoryType) {
    // Skip compaction in special session types
    if (sessionMemoryType === "session_memory" || sessionMemoryType === "compact") {
        return false;
    }

    // Check if auto-compact is enabled
    if (!isAutoCompactEnabled()) return false;

    // Get current state
    let currentTokens = countMessagesTokens(messages);
    let threshold = getAutoCompactThreshold(model);
    let effectiveWindow = getEffectiveContextWindow(model);

    // Log for debugging
    debugLog(`autocompact: tokens=${currentTokens} threshold=${threshold} effectiveWindow=${effectiveWindow}`);

    // Check if above threshold
    let { isAboveAutoCompactThreshold } = getCompactionStatus(currentTokens, model);
    return isAboveAutoCompactThreshold;
}

// Mapping: amY→shouldAutoCompact, A→messages, q→model, K→sessionMemoryType,
//   Y→currentTokens, z→threshold, w→effectiveWindow, H→isAboveAutoCompactThreshold,
//   Ev→countMessagesTokens, SQ1→getAutoCompactThreshold, m51→getEffectiveContextWindow,
//   Ac→getCompactionStatus, xm→isAutoCompactEnabled, h→debugLog
```

**Why skip special session types:**
- `session_memory` - Session is for updating session memory, don't compact
- `compact` - Already in a compaction subprocess, don't recurse

---

## Environment Variables Reference

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `DISABLE_COMPACT` | boolean | Disable all compaction | `true` |
| `DISABLE_AUTO_COMPACT` | boolean | Disable auto-compact only | `true` |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | number (1-100) | Trigger at % of effective window | `80` |
| `CLAUDE_CODE_BLOCKING_LIMIT_OVERRIDE` | number | Override blocking limit in tokens | `150000` |

---

## Complete Trigger Flow
 
 ```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                         Agent Main Loop                                  │
 │   (After each assistant response, before accepting new user input)      │
 └─────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                     ┌─────────────────┐
                     │ Microcompaction │  ← First, try lightweight optimization
                     │      (gm)       │
                     └─────────────────┘
                               │
                               ▼
               ┌───────────────────────────────┐
               │   shouldAutoCompact (amY)     │
               │   - Skip if special session?  │
               │   - Auto-compact enabled?     │
               │   - tokens >= threshold?      │
               └───────────────────────────────┘
                               │
                     ┌─────────┴─────────┐
                     │                   │
                  No Trigger          Trigger
                     │                   │
                     ▼                   ▼
             Continue Loop    ┌─────────────────────────┐
                              │ autoCompactDispatcher   │
                              │        (fs4)            │
                              └─────────────────────────┘
                                         │
                               ┌─────────┴─────────┐
                               │                   │
                     Session Memory Path    Standard Path
                     (vZ6 if enabled)       (AW1 fallback)
                               │                   │
                               └─────────┬─────────┘
                                         │
                                         ▼
                              Return to main loop
                              with compacted context
 ```

---

## Key Insights

### 1. The 20k Buffer Philosophy
The 20,000 token buffer (`MAX_COMPACT_BUFFER`) is not arbitrary:
- System prompts can be 5,000-15,000 tokens in complex projects
- Tool definitions add several thousand tokens
- Model response needs room to generate
- A 20k buffer covers all these cases with margin

### 2. Why Warning/Error Are Equal
Currently `TOKEN_WARNING_THRESHOLD` and `TOKEN_ERROR_THRESHOLD` are both 20,000. This suggests:
- The UI may differentiate based on `autoCompactEnabled` status
- If auto-compact is on, reaching threshold triggers compaction (no need for warning)
- If auto-compact is off, the same level shows as a warning to suggest manual compact

### 3. The Blocking Limit Safety Net
The blocking limit (`modelMax - 3000`) is the last line of defense:
- Prevents API errors from exceeding model's true maximum
- Even if auto-compact fails or is disabled, user cannot add more tokens
- Forces manual compaction or context reduction

### 4. Percentage Override Use Case
`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` allows power users to:
- Set to `90` to use more context before compaction (riskier but more context)
- Set to `50` to compact early (safer but more frequent summarization)
- Useful for sessions where specific context is critical and should not be summarized