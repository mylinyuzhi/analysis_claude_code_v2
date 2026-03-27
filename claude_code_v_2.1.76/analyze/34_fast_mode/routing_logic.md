# Fast Mode Routing Logic

## Overview

Fast Mode routing determines **whether to inject the beta flag** into API requests, not which model to use. The model always stays Opus 4.6 — only the `"fast-mode-2026-02-01"` beta header and `speed: "fast"` parameter are conditionally added.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key symbols in this document:
- `isFastModeNotDisabled` (`Dq`) — Env var gate at chunks.56.mjs:2654
- `isFastModeAvailable` (`yj`) — Availability gate at chunks.56.mjs:2658
- `getBlockingReason` (`ra`) — Returns blocking reason string or null
- `isOpusCompatible` (`FH`) — Model name check at chunks.56.mjs:2711
- `isCooldownActive` (`Jm`) — Cooldown check at chunks.56.mjs:2817
- `toggleFastMode` (`Dl8`) — Core toggle at chunks.163.mjs:639
- `getDefaultOpusModel` (`Bx6`) — Returns `"opus"` or `"opus[1m]"` at chunks.56.mjs:2698

---

## 1. Five-Condition Gate

**What it does**: Determines whether the beta flag should be injected into the current API request.

**All 5 conditions must be true**:

| # | Condition | Symbol | Location | Check |
|---|-----------|--------|----------|-------|
| 1 | Feature not env-disabled | `Dq()` | chunks.56.mjs:2654 | `!process.env.CLAUDE_CODE_DISABLE_FAST_MODE` |
| 2 | No blocking reasons | `yj()` | chunks.56.mjs:2658 | `Dq() && ra() === null` |
| 3 | Not in cooldown | `!Jm()` | chunks.56.mjs:2817 | `TO8().status !== "cooldown"` |
| 4 | Model is Opus 4.6 | `FH(model)` | chunks.56.mjs:2711 | Model string includes `"opus-4-6"` |
| 5 | User enabled fast mode | `!!T6.fastMode` | chunks.171.mjs:148 | `fastMode` boolean in state |

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

    betasArray.push("fast-mode-2026-02-01");  // _LA from chunks.18.mjs:1847
    speedField = "fast";                       // injected as { speed: "fast" } in request body
}
```

// Mapping: Dq→isFastModeNotDisabled, yj→isFastModeAvailable, Jm→isCooldownActive, FH→isOpusCompatible, _→request, T6→state, D6→betasArray, _LA→"fast-mode-2026-02-01", E6→speedField

**Result when gate passes**:
```javascript
{
    model: "claude-opus-4-6-20250514",   // Same model — NOT changed
    messages: [...],
    system: "...",
    tools: [...],
    betas: ["fast-mode-2026-02-01"],     // ← Injected beta
    speed: "fast",                        // ← Injected speed field
    max_tokens: 8192,
    temperature: 1.0
}
```

---

## 2. Availability Checks

### 2.1 Environment Variable Gate

// ============================================
// isFastModeNotDisabled (Dq) - Env var check
// Location: chunks.56.mjs:2654
// ============================================

// ORIGINAL (for source lookup):
```javascript
function Dq() {
    return !process.env.CLAUDE_CODE_DISABLE_FAST_MODE
}
```

// READABLE (for understanding):
```javascript
function isFastModeNotDisabled() {
    return !process.env.CLAUDE_CODE_DISABLE_FAST_MODE;
}
```

Setting `CLAUDE_CODE_DISABLE_FAST_MODE=1` disables the entire feature (command hidden, keybinding inactive, no beta injection).

### 2.2 Blocking Reason Check

// ============================================
// isFastModeAvailable (yj) - Combined availability
// Location: chunks.56.mjs:2658
// ============================================

// ORIGINAL (for source lookup):
```javascript
function yj() {
    return Dq() && ra() === null
}
```

// READABLE (for understanding):
```javascript
function isFastModeAvailable() {
    return isFastModeNotDisabled() && getBlockingReason() === null;
}
```

`ra()` (`getBlockingReason`) returns a string describing why fast mode is blocked (e.g., org policy, subscription plan, network issue, SDK mode), or `null` if available.

### 2.3 Opus Compatibility Check

// ============================================
// isOpusCompatible (FH) - Model string check
// Location: chunks.56.mjs:2711
// ============================================

// ORIGINAL (for source lookup):
```javascript
function FH(A) {
    if (!Dq()) return !1;
    return IY(A).toLowerCase().includes("opus-4-6")
}
```

// READABLE (for understanding):
```javascript
function isOpusCompatible(modelName) {
    if (!isFastModeNotDisabled()) return false;
    return normalizeModelName(modelName).toLowerCase().includes("opus-4-6");
}
```

// Mapping: FH→isOpusCompatible, A→modelName, Dq→isFastModeNotDisabled, IY→normalizeModelName

**Compatible models** (any name containing `"opus-4-6"` case-insensitive):
- `claude-opus-4-6-20250514`
- `claude-opus-4-6`
- Custom endpoint aliases containing `opus-4-6`

**NOT compatible**: Sonnet, Haiku, Opus 3.x, any non-Opus-4.6 model.

---

## 3. Model Locking

### 3.1 Auto-Switch to Opus on Enable

When the user enables fast mode while on a non-Opus model, the system auto-switches to Opus 4.6.

**Logic in `Dl8()`** (`chunks.163.mjs:643-650`):
```javascript
// If current model is NOT Opus, switch to default Opus
let needsModelChange = !FH(state.mainLoopModel);
if (needsModelChange) {
    state.mainLoopModel = Bx6();             // "opus" or "opus[1m]"
    state.mainLoopModelForSession = null;
}
state.fastMode = true;
```

**Example flow**:
```
User is on: Sonnet 4.5
User types: /fast
Result:
  → Model changes to: Opus 4.6
  → Fast mode enabled: true
  → Message: "⚡ Fast mode ON · model set to Opus 4.6 · $30/$150 per Mtok"
```

### 3.2 Auto-Disable on Model Switch

When the user switches to a non-Opus model while fast mode is on, it auto-disables.

// ============================================
// Model Picker Handler (inner function in S7z)
// Location: chunks.166.mjs:307-327
// ============================================

// ORIGINAL (for source lookup):
```javascript
H = function(X, P) {
    d("tengu_model_command_menu", {
        action: X, from_model: Y, to_model: X
    }), w((G) => ({
        ...G,
        mainLoopModel: X,
        mainLoopModelForSession: null
    }));
    let W = `Set model to ${O1.bold(fr6(X))}`;
    if (P !== void 0) W = W + ` with ${O1.bold(P)} effort`;
    let Z = void 0;
    if (Dq()) {
        if (aq6(), !FH(X) && _) w(C7z), Z = !1;
        else if (FH(X) && yj() && _) W = W + " · Fast mode ON", Z = !0
    }
    if (az6(X, Z === !0, pH())) W = W + " · Billed as extra usage";
    if (Z === !1) W = W + " · Fast mode OFF";
    K(W)
}
```

// READABLE (for understanding):
```javascript
handleModelSelection = function(newModel, effortLevel) {
    trackEvent("tengu_model_command_menu", {
        action: newModel, from_model: currentModel, to_model: newModel
    });

    // Set the new model
    setState((state) => ({
        ...state,
        mainLoopModel: newModel,
        mainLoopModelForSession: null
    }));

    let message = `Set model to ${chalk.bold(formatModelName(newModel))}`;
    if (effortLevel !== undefined)
        message += ` with ${chalk.bold(effortLevel)} effort`;

    let fastModeResult = undefined;
    if (isFastModeNotDisabled()) {
        resetCooldown();

        if (!isOpusCompatible(newModel) && currentFastMode) {
            // Auto-disable fast mode
            setState(disableFastModeReducer);
            fastModeResult = false;
        } else if (isOpusCompatible(newModel) && isFastModeAvailable() && currentFastMode) {
            message += " · Fast mode ON";
            fastModeResult = true;
        }
    }

    if (isExtraUsageBilling(newModel, fastModeResult === true, isPro()))
        message += " · Billed as extra usage";
    if (fastModeResult === false)
        message += " · Fast mode OFF";

    notify(message);
};
```

// Mapping: H→handleModelSelection, X→newModel, P→effortLevel, Y→currentModel, w→setState, d→trackEvent, O1→chalk, fr6→formatModelName, Dq→isFastModeNotDisabled, aq6→resetCooldown, FH→isOpusCompatible, _→currentFastMode, C7z→disableFastModeReducer, yj→isFastModeAvailable, az6→isExtraUsageBilling, pH→isPro, Z→fastModeResult, K→notify

**Example flow**:
```
User is on: Opus 4.6 (fast mode ON)
User switches to: Sonnet 4.5
Result:
  → Model changes to: Sonnet 4.5
  → Fast mode disabled: false
  → Message: "Set model to Sonnet 4.5 · Fast mode OFF"
```

---

## 4. Slash Command `/model` Handler

The same auto-disable logic exists in the `/model <name>` slash command handler.

// ============================================
// Slash Command Model Handler (inner function in u7z)
// Location: chunks.166.mjs:416-434
// ============================================

// ORIGINAL (for source lookup):
```javascript
function w(O) {
    Y((j) => ({
        ...j,
        mainLoopModel: O,
        mainLoopModelForSession: null
    }));
    let $ = `Set model to ${O1.bold(fr6(O))}`,
        H = void 0;
    if (Dq()) {
        if (aq6(), !FH(O) && K) Y((j) => ({
            ...j,
            fastMode: !1
        })), H = !1;
        else if (FH(O) && K) $ += " · Fast mode ON", H = !0
    }
    if (az6(O, H === !0, pH())) $ += " · Billed as extra usage";
    if (H === !1) $ += " · Fast mode OFF";
    q($)
}
```

// READABLE (for understanding):
```javascript
function handleModelSlashCommand(newModel) {
    setState((state) => ({
        ...state,
        mainLoopModel: newModel,
        mainLoopModelForSession: null
    }));

    let message = `Set model to ${chalk.bold(formatModelName(newModel))}`;
    let fastModeResult = undefined;

    if (isFastModeNotDisabled()) {
        resetCooldown();

        if (!isOpusCompatible(newModel) && currentFastMode) {
            // Inline disable — no reducer, direct state update
            setState((state) => ({ ...state, fastMode: false }));
            fastModeResult = false;
        } else if (isOpusCompatible(newModel) && currentFastMode) {
            message += " · Fast mode ON";
            fastModeResult = true;
        }
    }

    if (isExtraUsageBilling(newModel, fastModeResult === true, isPro()))
        message += " · Billed as extra usage";
    if (fastModeResult === false)
        message += " · Fast mode OFF";

    notify(message);
}
```

// Mapping: w→handleModelSlashCommand, O→newModel, Y→setState, K→currentFastMode, O1→chalk, fr6→formatModelName, Dq→isFastModeNotDisabled, aq6→resetCooldown, FH→isOpusCompatible, az6→isExtraUsageBilling, pH→isPro, H→fastModeResult, q→notify

---

## 5. Routing Decision Flow

```
API Request Preparation
    │
    ├─ Dq() — CLAUDE_CODE_DISABLE_FAST_MODE not set?
    │   └─ NO → Standard request (no beta)
    │
    ├─ yj() — No blocking reason (org/plan/network)?
    │   └─ NO → Standard request (no beta)
    │
    ├─ !Jm() — Not in cooldown?
    │   └─ NO (cooldown active) → Standard request (no beta)
    │
    ├─ FH(model) — Model contains "opus-4-6"?
    │   └─ NO → Standard request (no beta)
    │
    ├─ state.fastMode — User has toggled fast mode ON?
    │   └─ NO → Standard request (no beta)
    │
    └─ ALL YES → Inject beta + speed field
        ├─ betas: ["fast-mode-2026-02-01"]
        └─ speed: "fast"
```

---

## Location References

- `chunks.171.mjs:148` — Beta injection gate (5-condition check).
- `chunks.18.mjs:1847` — `_LA = "fast-mode-2026-02-01"` beta string.
- `chunks.56.mjs:2654` — `Dq()` env var check.
- `chunks.56.mjs:2658` — `yj()` availability check.
- `chunks.56.mjs:2711` — `FH()` Opus compatibility check.
- `chunks.56.mjs:2817` — `Jm()` cooldown active check.
- `chunks.56.mjs:2698` — `Bx6()` default Opus model getter.
- `chunks.163.mjs:639` — `Dl8()` core toggle with auto-switch.
- `chunks.166.mjs:307` — Model picker auto-disable handler.
- `chunks.166.mjs:416` — `/model` slash command auto-disable handler.

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
