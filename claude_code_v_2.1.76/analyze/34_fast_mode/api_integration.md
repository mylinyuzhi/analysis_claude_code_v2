# Fast Mode API Integration

## Overview

This document analyzes how Fast Mode integrates with the Anthropic LLM API, including beta flag injection, request parameter modifications, cooldown/fallback mechanisms, and error handling.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Fast mode symbols

Key functions:
- Beta injection gate — chunks.171.mjs:148
- Retry loop with fallback — chunks.89.mjs:3-93
- Cooldown state machine — chunks.56.mjs:2722-2826
- Beta string constant `_LA` — chunks.18.mjs:1847

---

## 1. API Beta Flag Injection

### 1.1 The Beta Flag

**Key insight**: Fast Mode is **NOT** a model switch — it is a **beta flag** that enables server-side optimizations on the same Opus 4.6 model.

// ============================================
// Beta Injection Gate
// Location: chunks.171.mjs:148
// ============================================

// ORIGINAL (for source lookup):
```javascript
if (Dq() && yj() && !Jm() && FH(_.model) && !!T6.fastMode) D6.push(_LA), E6 = "fast";
```

// READABLE (for understanding):
```javascript
if (isFastModeNotDisabled() &&
    isFastModeAvailable() &&
    !isCooldownActive() &&
    isOpusCompatible(request.model) &&
    state.fastMode) {

    // Push beta identifier to betas array
    betasArray.push("fast-mode-2026-02-01");

    // Set speed field for request body
    speedField = "fast";
}
```

// Mapping: Dq→isFastModeNotDisabled, yj→isFastModeAvailable, Jm→isCooldownActive, FH→isOpusCompatible, _→request, T6→state, D6→betasArray, _LA→"fast-mode-2026-02-01", E6→speedField

The `speed` field is included in the request body (`chunks.171.mjs:179-181`):
```javascript
...E6 !== void 0 && { speed: E6 }
// Produces: { speed: "fast" } when fast mode active
```

The betas array is included as `betas: D6` in the request (`chunks.171.mjs:163-165`).

### 1.2 Conditions for Injection

ALL 5 must be true:

| # | Condition | Function | What it checks |
|---|-----------|----------|----------------|
| 1 | Feature enabled | `Dq()` | `!process.env.CLAUDE_CODE_DISABLE_FAST_MODE` |
| 2 | Available | `yj()` | `Dq() && ra() === null` (no org/plan/network block) |
| 3 | Not in cooldown | `!Jm()` | `TO8().status !== "cooldown"` |
| 4 | Opus 4.6 model | `FH(model)` | Normalized model name includes `"opus-4-6"` |
| 5 | User enabled | `state.fastMode` | Boolean toggle in app state |

### 1.3 API Request Format

**With fast mode active**:
```javascript
{
    model: "claude-opus-4-6-20250514",   // SAME model — not changed
    messages: [...],
    system: "...",
    tools: [...],
    betas: ["fast-mode-2026-02-01"],     // ← Fast mode beta
    speed: "fast",                        // ← Speed optimization field
    max_tokens: 8192,
    temperature: 1.0
}
```

**Without fast mode (standard)**:
```javascript
{
    model: "claude-opus-4-6-20250514",
    messages: [...],
    system: "...",
    tools: [...],
    // No betas array (or no fast-mode entry)
    // No speed field
    max_tokens: 8192,
    temperature: 1.0
}
```

### 1.4 Beta Effect on API Behavior

**What the beta does** (server-side):
1. **Prioritizes output streaming** — reduces internal processing overhead
2. **Reduces time-to-first-token** (TTFT) latency
3. **Optimizes for interactive use** vs. batch processing

**Performance characteristics**:
- **TTFT reduction**: Significantly faster initial response
- **Quality trade-off**: Minimal for simple tasks, noticeable for complex reasoning

**Why this approach**:
- **Backward compatible**: Old clients work without beta
- **Gradual rollout**: Controlled via feature flags and availability checks
- **A/B testing**: Telemetry tracks fast mode usage for optimization
- **Server-side control**: Anthropic can tune optimization without client updates

---

## 2. Cooldown State Machine

### 2.1 State Variables

// ============================================
// Cooldown State Machine
// Location: chunks.56.mjs:2722-2826
// ============================================

State is stored in module-level variable `RD6`, initialized as `{status: "active"}` (`chunks.56.mjs:2968-2970`).

**States**:
```
{status: "active"}                           — Normal, fast mode can inject beta
{status: "cooldown", resetAt: <ts>, reason}  — Temporarily paused, no beta injection
```

### 2.2 Cooldown Duration Constants

// ============================================
// Cooldown Constants
// Location: chunks.89.mjs:227-231
// ============================================

// ORIGINAL (for source lookup):
```javascript
Bb9 = 1800000   // 30 minutes — default cooldown (no retry-after header)
Fb9 = 600000    // 10 minutes — minimum cooldown floor
gb9 = 20000     // 20 seconds — short retry-after threshold
```

// READABLE (for understanding):
```javascript
DEFAULT_COOLDOWN_MS = 1800000;   // 30 minutes
MIN_COOLDOWN_MS     = 600000;    // 10 minutes
SHORT_RETRY_THRESHOLD_MS = 20000; // 20 seconds
```

// Mapping: Bb9→DEFAULT_COOLDOWN_MS, Fb9→MIN_COOLDOWN_MS, gb9→SHORT_RETRY_THRESHOLD_MS

**Cooldown duration computation** (`chunks.89.mjs:41`):
```javascript
let duration = Math.max(retryAfterMs ?? DEFAULT_COOLDOWN_MS, MIN_COOLDOWN_MS);
// If retry-after header exists: max(retryAfterMs, 600000) — at least 10 minutes
// If no retry-after header:     max(1800000, 600000)      — 30 minutes
```

### 2.3 State Reader with Auto-Recovery

// ============================================
// getCooldownState (TO8) - State machine with auto-recovery
// Location: chunks.56.mjs:2723-2733
// ============================================

// ORIGINAL (for source lookup):
```javascript
function TO8() {
    if (RD6.status === "cooldown" && Date.now() >= RD6.resetAt) {
        if (Dq() && !ZO8) {
            k("Fast mode cooldown expired, re-enabling fast mode"), ZO8 = !0;
            for (let A of l21) A.onCooldownExpired()
        }
        RD6 = { status: "active" }
    }
    return RD6
}
```

// READABLE (for understanding):
```javascript
function getCooldownState() {
    if (cooldownState.status === "cooldown" && Date.now() >= cooldownState.resetAt) {
        if (isFastModeNotDisabled() && !hasLoggedExpiry) {
            log("Fast mode cooldown expired, re-enabling fast mode");
            hasLoggedExpiry = true;

            // Notify all registered listeners
            for (let listener of cooldownListeners) {
                listener.onCooldownExpired();
            }
        }
        cooldownState = { status: "active" };
    }
    return cooldownState;
}
```

// Mapping: TO8→getCooldownState, RD6→cooldownState, Dq→isFastModeNotDisabled, ZO8→hasLoggedExpiry, k→log, l21→cooldownListeners

### 2.4 Cooldown Trigger

// ============================================
// triggerCooldown (kf7) - Set cooldown state
// Location: chunks.56.mjs:2736-2749
// ============================================

// ORIGINAL (for source lookup):
```javascript
function kf7(A, q) {
    RD6 = { status: "cooldown", resetAt: A, reason: q }
}
```

// READABLE (for understanding):
```javascript
function triggerCooldown(resetAt, reason) {
    cooldownState = { status: "cooldown", resetAt: resetAt, reason: reason };
}
```

// Mapping: kf7→triggerCooldown, A→resetAt, q→reason, RD6→cooldownState

---

## 3. Error Handling and Fallback

### 3.1 Four-Path Error Handling

The retry loop in `chunks.89.mjs:3-93` handles fast mode errors with 4 distinct paths:

```
API Error (fast mode active)
    │
    ├─ Path 1: Overage Disabled
    │   Condition: `anthropic-ratelimit-unified-overage-disabled-reason` header present
    │   Action: Lf7() permanently disables fast mode for session
    │   Result: z.fastMode = false, continue retry WITHOUT beta
    │
    ├─ Path 2: Short Retry-After
    │   Condition: 429/529 error AND retry-after < 20s (gb9)
    │   Action: Wait the retry-after duration
    │   Result: Retry WITH fast mode still active (beta included)
    │
    ├─ Path 3: Long Retry-After / Cooldown
    │   Condition: 429/529 error AND retry-after >= 20s (or no header)
    │   Action: kf7(Date.now() + duration, reason) triggers cooldown
    │   Duration: max(retryAfterMs, 600000) — minimum 10 min, default 30 min
    │   Result: z.fastMode = false, continue retry WITHOUT beta
    │
    └─ Path 4: Feature Disabled by Server
        Condition: 400 error with message "Fast mode is not enabled"
        Action: Ef7() permanently disables fast mode as user preference
        Result: z.fastMode = false, continue retry WITHOUT beta
```

### 3.2 Retry Loop Fast Mode Logic

// ============================================
// Retry Loop - Fast Mode Error Handling
// Location: chunks.89.mjs:17-48
// ============================================

// ORIGINAL (for source lookup):
```javascript
let H = Dq() ? z.fastMode && !Jm() : !1;
// ... API call ...
// On error:
if (H && j instanceof a7) {
    let P = j.retryAfterMs;
    if (j.headers?.["anthropic-ratelimit-unified-overage-disabled-reason"]) {
        if (Lf7(), Dq()) z.fastMode = !1;
        continue
    }
    if ((j.status === 429 || j.status === 529 || j.error?.type === "overloaded_error") &&
        P !== void 0 && P < gb9) {
        await new Promise(X => setTimeout(X, P));
        continue
    }
    if (j.status === 429 || j.status === 529 || j.error?.type === "overloaded_error") {
        let W = Math.max(P ?? Bb9, Fb9),
            Z = j.status === 529 || j.error?.type === "overloaded_error" ? "overloaded" : "rate_limit";
        if (kf7(Date.now() + W, Z), Dq()) z.fastMode = !1;
        continue
    }
    if (Cb9(j)) {
        if (Ef7(), Dq()) z.fastMode = !1;
        continue
    }
}
```

// READABLE (for understanding):
```javascript
// Determine if fast mode is active for this attempt
let isFastModeActiveForRequest = isFastModeNotDisabled()
    ? options.fastMode && !isCooldownActive()
    : false;

// ... API call with conditional beta injection ...

// On error:
if (isFastModeActiveForRequest && error instanceof ApiError) {
    let retryAfterMs = error.retryAfterMs;

    // Path 1: Overage disabled — permanent session disable
    if (error.headers?.["anthropic-ratelimit-unified-overage-disabled-reason"]) {
        permanentlyDisableFastModeForSession();
        if (isFastModeNotDisabled()) options.fastMode = false;
        continue;  // Retry without beta
    }

    // Path 2: Short retry-after — wait and retry WITH fast mode
    if ((error.status === 429 || error.status === 529 ||
         error.error?.type === "overloaded_error") &&
        retryAfterMs !== undefined && retryAfterMs < SHORT_RETRY_THRESHOLD_MS) {
        await sleep(retryAfterMs);
        continue;  // Retry WITH beta still active
    }

    // Path 3: Long retry-after or no header — trigger cooldown
    if (error.status === 429 || error.status === 529 ||
        error.error?.type === "overloaded_error") {
        let duration = Math.max(retryAfterMs ?? DEFAULT_COOLDOWN_MS, MIN_COOLDOWN_MS);
        let reason = (error.status === 529 || error.error?.type === "overloaded_error")
            ? "overloaded"
            : "rate_limit";
        triggerCooldown(Date.now() + duration, reason);
        if (isFastModeNotDisabled()) options.fastMode = false;
        continue;  // Retry without beta
    }

    // Path 4: Server says "not enabled" — permanent preference disable
    if (isFastModeNotEnabledError(error)) {
        permanentlyDisableFastModePreference();
        if (isFastModeNotDisabled()) options.fastMode = false;
        continue;  // Retry without beta
    }
}
```

// Mapping: H→isFastModeActiveForRequest, z→options, Dq→isFastModeNotDisabled, Jm→isCooldownActive, a7→ApiError, j→error, P→retryAfterMs, gb9→SHORT_RETRY_THRESHOLD_MS, Bb9→DEFAULT_COOLDOWN_MS, Fb9→MIN_COOLDOWN_MS, kf7→triggerCooldown, Lf7→permanentlyDisableFastModeForSession, Ef7→permanentlyDisableFastModePreference, Cb9→isFastModeNotEnabledError

---

## 4. UI Notifications for Cooldown

// ============================================
// Cooldown UI Notification
// Location: chunks.195.mjs:1486-1493
// ============================================

When cooldown expires, the UI displays:
```
"Fast limit reset · now using fast mode"
```

When cooldown triggers, the user sees:
```
"Fast mode temporarily unavailable"
```

---

## 5. Billing and Cost Integration

### 5.1 Premium Rate Notification

**Pricing display** (`chunks.144.mjs:2428`):
```javascript
description: `Opus 4.6 with 1M context · ${isExtraUsage() ? "Billed as extra usage" : "Billed at premium rate"}`
```

**Fast mode pricing** (from `N06(true)` → `zT9`):
```javascript
{ inputTokens: 30, outputTokens: 150 }  // per Mtok
```

**Standard pricing** (from `N06(false)` → `DD1`):
```javascript
{ inputTokens: 5, outputTokens: 25 }    // per Mtok
```

**Example messages**:
- `"Fast mode ON · $30/$150 per Mtok"`
- `"Fast mode ON · model set to Opus 4.6 · $30/$150 per Mtok"`
- `"Set model to Opus 4.6 · Billed at premium rate"`

### 5.2 Promotional Pricing

Fast mode supports dynamic promotional messaging (`chunks.163.mjs:676-688`). Promo info includes discount percentage and end date, displayed inline with the toggle notification.

---

## 6. Telemetry Integration

**Events tracked**:

| Event | When Emitted | Location |
|-------|-------------|----------|
| `tengu_fast_mode_toggled` | User toggles via shortcut or picker | chunks.163.mjs:682, 812 |
| `tengu_fast_mode_picker_shown` | Fast mode picker UI displayed | chunks.163.mjs:832 |
| `tengu_fast_mode_fallback_triggered` | Cooldown triggered on API error | chunks.56.mjs:2744 |
| `tengu_fast_mode_overage_rejected` | Overage rejected by API | chunks.56.mjs:2806 |

**Fallback telemetry payload**:
```javascript
trackEvent("tengu_fast_mode_fallback_triggered", {
    cooldown_duration_ms: 600000,  // actual computed duration
    cooldown_reason: "rate_limit"  // or "overloaded"
});
```

---

## 7. `getSmallFastModel` — Separate Feature

**Important**: The `getSmallFastModel` (`lH`) function and `ANTHROPIC_SMALL_FAST_MODEL` env var are **NOT part of the fast mode toggle feature**. They resolve a lightweight model (Haiku) used for internal tasks (e.g., compaction, subagents), completely independent from the `/fast` toggle.

// ============================================
// getSmallFastModel (lH) - Lightweight model resolver (NOT fast mode)
// Location: chunks.176.mjs:1234-1236
// ============================================

// ORIGINAL (for source lookup):
```javascript
function lH() {
    return process.env.ANTHROPIC_SMALL_FAST_MODEL || hT6()
}

function hT6() {
    if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL) return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    return _3().haiku45
}
```

// READABLE (for understanding):
```javascript
function getSmallFastModel() {
    return process.env.ANTHROPIC_SMALL_FAST_MODEL || getDefaultHaikuModel();
}

function getDefaultHaikuModel() {
    if (process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL)
        return process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    return getModelConfig().haiku45;  // "claude-3-5-haiku-20241022"
}
```

// Mapping: lH→getSmallFastModel, hT6→getDefaultHaikuModel, _3→getModelConfig

**Environment variable precedence** (for lightweight model, NOT fast mode):
```
ANTHROPIC_SMALL_FAST_MODEL       (highest priority)
  ↓ if not set
ANTHROPIC_DEFAULT_HAIKU_MODEL
  ↓ if not set
"claude-3-5-haiku-20241022"      (hardcoded fallback)
```

---

## Summary

Fast Mode API integration has these key characteristics:

1. **Beta Flag System**: `"fast-mode-2026-02-01"` + `speed: "fast"` enables server-side optimizations
2. **Model Locking**: Forces Opus 4.6, auto-disables on non-Opus model switch
3. **5-Condition Gate**: Available AND not disabled AND not cooldown AND Opus AND user-enabled
4. **4-Path Error Handling**: Overage → session disable; short retry → wait+retry; long retry → cooldown; not-enabled → preference disable
5. **Cooldown**: Min 10 min, default 30 min, auto-recovery on expiry
6. **Cost Transparency**: `$30/$150 per Mtok` pricing displayed on toggle
7. **Telemetry**: Comprehensive `tengu_fast_mode_*` event tracking

**Key architectural insight**: Fast mode is about **optimizing the SAME model (Opus 4.6) for lower latency** via API beta flags and server-side routing. The `getSmallFastModel`/`ANTHROPIC_SMALL_FAST_MODEL` system is entirely separate and used for lightweight internal tasks.

---

## Location References

- `chunks.171.mjs:148` — Beta injection gate (5-condition check).
- `chunks.171.mjs:163-165` — Betas array inclusion in request.
- `chunks.171.mjs:179-181` — `speed: "fast"` field inclusion.
- `chunks.18.mjs:1847` — `_LA = "fast-mode-2026-02-01"` constant.
- `chunks.56.mjs:2654` — `Dq()` env var check.
- `chunks.56.mjs:2658` — `yj()` availability check.
- `chunks.56.mjs:2711` — `FH()` Opus compatibility check.
- `chunks.56.mjs:2723` — `TO8()` cooldown state machine with auto-recovery.
- `chunks.56.mjs:2736` — `kf7()` trigger cooldown.
- `chunks.56.mjs:2751` — `aq6()` reset cooldown.
- `chunks.56.mjs:2817` — `Jm()` cooldown active check.
- `chunks.89.mjs:3-93` — Retry loop with 4-path error handling.
- `chunks.89.mjs:227-231` — Cooldown duration constants.
- `chunks.176.mjs:1234` — `lH()` getSmallFastModel (separate feature).
- `chunks.195.mjs:1486` — UI cooldown notification.

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
