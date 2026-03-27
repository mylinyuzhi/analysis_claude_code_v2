# Fast Mode Implementation

## Overview

Fast Mode in Claude Code v2.1.76 enables faster streaming output from the **same Opus 4.6 model** via API beta flag injection (`"fast-mode-2026-02-01"`). It is **NOT** a model switch to Haiku or any smaller model. The feature is accessible via the `/fast` slash command or `Alt+O` keybinding.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key symbols in this document:
- `toggleFastMode` (`Dl8`) — Core toggle function at chunks.163.mjs:639
- `toggleFastModeShortcut` (`N1z`) — Shortcut handler at chunks.163.mjs:806
- `fastModeCommand` (`k1z`) — `/fast` slash command definition at chunks.163.mjs:866
- `computeFastModeState` (`Mm`) — State computation at chunks.56.mjs:2821
- `FAST_MODEL_DISPLAY_NAME` (`Ok`) — `"Opus 4.6"` at chunks.56.mjs:2935

---

## 1. `/fast` Slash Command Definition

// ============================================
// fastModeCommand (k1z) - Slash command registration
// Location: chunks.163.mjs:866-882
// ============================================

// ORIGINAL (for source lookup):
```javascript
k1z = {
    type: "local-jsx",
    name: "fast",
    get description() {
        return `Toggle fast mode (${Ok} only)`
    },
    isEnabled: () => Dq(),
    get isHidden() {
        return !Dq()
    },
    argumentHint: "[on|off]",
    userFacingName: () => "fast",
    get immediate() {
        return XN6()
    },
    load: () => Promise.resolve().then(() => (Xl8(), pMq))
}
```

// READABLE (for understanding):
```javascript
fastModeCommand = {
    type: "local-jsx",
    name: "fast",
    get description() {
        return `Toggle fast mode (${FAST_MODEL_DISPLAY_NAME} only)`;  // "Toggle fast mode (Opus 4.6 only)"
    },
    isEnabled: () => isFastModeNotDisabled(),
    get isHidden() {
        return !isFastModeNotDisabled();
    },
    argumentHint: "[on|off]",
    userFacingName: () => "fast",
    get immediate() {
        return buildImmediateHandler();
    },
    load: () => Promise.resolve().then(() => (initFastModeModule(), fastModeModule))
};
```

// Mapping: k1z→fastModeCommand, Ok→FAST_MODEL_DISPLAY_NAME, Dq→isFastModeNotDisabled, XN6→buildImmediateHandler, Xl8→initFastModeModule, pMq→fastModeModule

---

## 2. Core Toggle Function

// ============================================
// toggleFastMode (Dl8) - Core state toggle with model auto-switch
// Location: chunks.163.mjs:639-657
// ============================================

// ORIGINAL (for source lookup):
```javascript
function Dl8(A, q) {
    if (aq6(), TA("userSettings", {
            fastMode: A ? !0 : void 0
        }), A) q((K) => {
        let Y = !FH(K.mainLoopModel);
        return {
            ...K,
            ...Y ? {
                mainLoopModel: Bx6(),
                mainLoopModelForSession: null
            } : {},
            fastMode: !0
        }
    });
    else q((K) => ({
        ...K,
        fastMode: !1
    }))
}
```

// READABLE (for understanding):
```javascript
function toggleFastMode(enable, setAppState) {
    // 1. Reset any active cooldown
    resetCooldown();

    // 2. Persist user preference
    persistSetting("userSettings", {
        fastMode: enable ? true : undefined
    });

    if (enable) {
        setAppState((state) => {
            // 3. Check if current model is NOT Opus 4.6
            let needsModelChange = !isOpusCompatible(state.mainLoopModel);
            return {
                ...state,
                // 4. Auto-switch to Opus if needed
                ...needsModelChange ? {
                    mainLoopModel: getDefaultOpusModel(),  // "opus" or "opus[1m]"
                    mainLoopModelForSession: null
                } : {},
                fastMode: true
            };
        });
    } else {
        setAppState((state) => ({
            ...state,
            fastMode: false
        }));
    }
}
```

// Mapping: Dl8→toggleFastMode, A→enable, q→setAppState, aq6→resetCooldown, TA→persistSetting, FH→isOpusCompatible, Bx6→getDefaultOpusModel, K→state, Y→needsModelChange

---

## 3. Shortcut-Triggered Toggle

// ============================================
// toggleFastModeShortcut (N1z) - Alt+O handler with user message
// Location: chunks.163.mjs:806-821
// ============================================

// ORIGINAL (for source lookup):
```javascript
async function N1z(A, q, K) {
    let Y = ra();
    if (Y) return `Fast mode unavailable: ${Y}`;
    let { mainLoopModel: z } = q();
    if (Dl8(A, K), d("tengu_fast_mode_toggled", {
            enabled: A, source: "shortcut"
        }), A) {
        let _ = V_6(!0),
            w = !FH(z) ? ` · model set to ${Ok}` : "",
            O = zR(N06(!0));
        return `${_} Fast mode ON${w} · ${O}`
    } else return "Fast mode OFF"
}
```

// READABLE (for understanding):
```javascript
async function toggleFastModeShortcut(enable, getState, setState) {
    // 1. Check for unavailability reasons (org/plan/network/SDK)
    let blockingReason = getBlockingReason();
    if (blockingReason) return `Fast mode unavailable: ${blockingReason}`;

    let { mainLoopModel: currentModel } = getState();

    // 2. Perform the toggle
    toggleFastMode(enable, setState);

    // 3. Track telemetry
    trackEvent("tengu_fast_mode_toggled", {
        enabled: enable, source: "shortcut"
    });

    if (enable) {
        let icon = getFastModeIcon(true);
        let modelSwitch = !isOpusCompatible(currentModel)
            ? ` · model set to ${FAST_MODEL_DISPLAY_NAME}`  // " · model set to Opus 4.6"
            : "";
        let pricing = formatPricing(getPricingInfo(true));  // "$30/$150 per Mtok"
        return `${icon} Fast mode ON${modelSwitch} · ${pricing}`;
    } else {
        return "Fast mode OFF";
    }
}
```

// Mapping: N1z→toggleFastModeShortcut, A→enable, q→getState, K→setState, ra→getBlockingReason, Dl8→toggleFastMode, d→trackEvent, V_6→getFastModeIcon, FH→isOpusCompatible, Ok→FAST_MODEL_DISPLAY_NAME, zR→formatPricing, N06→getPricingInfo

---

## 4. Fast Mode State Computation

// ============================================
// computeFastModeState (Mm) - Three-state computation for agent loop
// Location: chunks.56.mjs:2821-2826
// ============================================

// ORIGINAL (for source lookup):
```javascript
function Mm(A, q) {
    let K = Dq() && yj() && !!q && FH(A);
    if (K && Jm()) return "cooldown";
    if (K) return "on";
    return "off"
}
```

// READABLE (for understanding):
```javascript
function computeFastModeState(model, fastModeEnabled) {
    let isActive = isFastModeNotDisabled()     // env var check
                && isFastModeAvailable()        // no blocking reasons
                && !!fastModeEnabled             // user has it enabled
                && isOpusCompatible(model);      // model is Opus 4.6

    if (isActive && isCooldownActive()) return "cooldown";
    if (isActive) return "on";
    return "off";
}
```

// Mapping: Mm→computeFastModeState, A→model, q→fastModeEnabled, K→isActive, Dq→isFastModeNotDisabled, yj→isFastModeAvailable, FH→isOpusCompatible, Jm→isCooldownActive

---

## 5. UI Status Display

// ============================================
// Fast Mode Status in Model Picker
// Location: chunks.151.mjs:1148-1160
// ============================================

// ORIGINAL (for source lookup):
```javascript
Q6 = Dq() ? O ? a4.createElement(m, {
    marginBottom: 1
}, a4.createElement(T, {
    dimColor: !0
}, "Fast mode is ", a4.createElement(T, {
    bold: !0
}, "ON"), " and available with", " ", Ok, " only (/fast). Switching to other models turn off fast mode.")) : yj() && !Jm() ? a4.createElement(m, {
    marginBottom: 1
}, a4.createElement(T, {
    dimColor: !0
}, "Use ", a4.createElement(T, {
    bold: !0
}, "/fast"), " to turn on Fast mode (", Ok, " only).")) : null : null
```

// READABLE (for understanding):
```javascript
fastModeNotice = isFastModeNotDisabled()
    ? isFastModeEnabled
        ? <Box marginBottom={1}>
              <Text dimColor>
                  Fast mode is <Text bold>ON</Text> and available with {FAST_MODEL_DISPLAY_NAME} only (/fast).
                  Switching to other models turn off fast mode.
              </Text>
          </Box>
        : isFastModeAvailable() && !isCooldownActive()
            ? <Box marginBottom={1}>
                  <Text dimColor>
                      Use <Text bold>/fast</Text> to turn on Fast mode ({FAST_MODEL_DISPLAY_NAME} only).
                  </Text>
              </Box>
            : null
    : null;
```

// Mapping: Dq→isFastModeNotDisabled, O→isFastModeEnabled, Ok→FAST_MODEL_DISPLAY_NAME, yj→isFastModeAvailable, Jm→isCooldownActive

---

## 6. Keybinding Registration

// ============================================
// Fast Mode Keybinding
// Location: chunks.153.mjs:1054
// ============================================

// ORIGINAL (for source lookup):
```javascript
h = Rq("chat:fastMode", "Chat", "alt+o"),
```

// READABLE (for understanding):
```javascript
fastModeKeybinding = registerKeybinding("chat:fastMode", "Chat", "alt+o");
```

// Mapping: h→fastModeKeybinding, Rq→registerKeybinding

The keybinding is conditionally active only when `Dq() && yj()` (fast mode available).

---

## 7. Billing & Pricing Display

**Pricing constants** (`chunks.56.mjs`):
- Fast mode pricing (`zT9`): `{ inputTokens: 30, outputTokens: 150, ... }` per Mtok
- Standard pricing (`DD1`): `{ inputTokens: 5, outputTokens: 25, ... }` per Mtok

**UI messages** (`chunks.144.mjs:2428`):
```javascript
description: `Opus 4.6 with 1M context · ${isExtraUsage() ? "Billed as extra usage" : "Billed at premium rate"}`
```

**Example messages**:
- `"Fast mode ON · $30/$150 per Mtok"`
- `"Fast mode ON · model set to Opus 4.6 · $30/$150 per Mtok"`
- `"Fast mode OFF"`

---

## Key Decisions & Algorithms

### [Decision] Same Model, Not Model Switch

**Why this approach**:
Fast mode optimizes the **same Opus 4.6 model** via server-side beta flags rather than switching to a smaller model (like Haiku). This preserves model capability while reducing latency, and allows Anthropic to control the optimization entirely server-side without client model changes.

### [Decision] Model Locking to Opus 4.6

**Why this approach**:
Fast mode beta only works with Opus 4.6 (`FH()` checks for `"opus-4-6"` in model name). If a user manually selects a different model, fast mode auto-disables to prevent confusion. Conversely, enabling fast mode auto-switches to Opus if not already on it.

### [Algorithm] Three-State Computation

**How it works**:
1. `Mm(model, fastModeEnabled)` evaluates 4 conditions (env, availability, user setting, model).
2. If all pass AND cooldown active → `"cooldown"`.
3. If all pass AND no cooldown → `"on"`.
4. Otherwise → `"off"`.

This three-state value is injected into every system message so the agent can adapt its behavior.

---

## Location References

- `chunks.163.mjs:639` — `toggleFastMode` (`Dl8`) core toggle.
- `chunks.163.mjs:806` — `toggleFastModeShortcut` (`N1z`) shortcut handler.
- `chunks.163.mjs:866` — `fastModeCommand` (`k1z`) slash command definition.
- `chunks.56.mjs:2654` — `isFastModeNotDisabled` (`Dq`) env var check.
- `chunks.56.mjs:2658` — `isFastModeAvailable` (`yj`) availability check.
- `chunks.56.mjs:2711` — `isOpusCompatible` (`FH`) model compatibility.
- `chunks.56.mjs:2821` — `computeFastModeState` (`Mm`) three-state computation.
- `chunks.151.mjs:1148` — UI status display (fast mode hint).
- `chunks.153.mjs:1054` — Keybinding registration (`Alt+O`).
- `chunks.185.mjs:1973` — Agent loop injection of `fast_mode_state`.
- `chunks.131.mjs:2844` — Schema: `z.enum(["off", "cooldown", "on"])`.
- `chunks.168.mjs:2209` — System prompt text about fast mode.

**Last Updated**: 2026-03-27
**Version**: Claude Code 2.1.76
