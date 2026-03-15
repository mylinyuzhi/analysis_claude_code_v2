# Plan Mode - Mode Cycling Integration (Claude Code 2.1.38)

> Complete reverse engineering of how plan mode integrates with the Shift+Tab mode cycling system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `hf1` (chunks.183.mjs:1778) - `cycleMode` - Mode cycle logic
- `FGq` (chunks.183.mjs:1799) - `cycleModeWithContext` - Mode cycle wrapper
- `PM` (chunks.1.mjs) - `isTeamLeader` - Team context check
- `l8` (chunks.1.mjs) - `hasTeamContext` - Team detection
- `CQ` (chunks.14.mjs:3260) - `getModeDisplayName` - Mode name
- `Rv1` (chunks.14.mjs:3281) - `getModeIcon` - Mode icon
- `cP` (chunks.14.mjs:3298) - `getModeThemeColor` - Mode color

---

## 1. Overview: Mode Cycling Architecture

Shift+Tab cycles through available permission modes. Plan mode is one of the modes in this cycle.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Mode Cycling System                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Standard User Mode Sequence:                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │   default ──Shift+Tab──► acceptEdits ──Shift+Tab──► plan  │ │
│  │      ▲                                            │       │ │
│  │      └────────────────── Shift+Tab ────────────────┘       │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Team Leader Mode Sequence:                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │   default ──► acceptEdits ──► plan ──► delegate ──► ...   │ │
│  │      ▲                                     │              │ │
│  │      └─────────────── Shift+Tab ───────────┘              │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Enterprise (Bypass Permissions Available):                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │   ... ──► plan ──► bypassPermissions ──► default ──► ...  │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Function: `cycleMode` (`hf1`)

```javascript
// ============================================
// hf1 - cycleMode
// Location: chunks.183.mjs:1778-1797
// ============================================

// ORIGINAL (for source lookup):
function hf1(A, q) {
    let K = l8() && q && PM(q);
    switch (A.mode) {
        case "default":
            return "acceptEdits";
        case "acceptEdits":
            return "plan";
        case "plan":
            if (K) return "delegate";
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "delegate":
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "bypassPermissions":
            return "default";
        case "dontAsk":
            return "default"
    }
}

// READABLE (for understanding):
function cycleMode(currentPermissionContext, teamContext) {
    // Check if user is a team leader with team context
    let isTeamLeaderWithTeam = hasTeamContext() && teamContext && isTeamLeader(teamContext);

    switch (currentPermissionContext.mode) {
        case "default":
            // default → acceptEdits
            return "acceptEdits";

        case "acceptEdits":
            // acceptEdits → plan
            return "plan";

        case "plan":
            // plan → delegate (if team leader) OR bypassPermissions (if enterprise) OR default
            if (isTeamLeaderWithTeam) {
                return "delegate";
            }
            if (currentPermissionContext.isBypassPermissionsModeAvailable) {
                return "bypassPermissions";
            }
            return "default";

        case "delegate":
            // delegate → bypassPermissions (if enterprise) OR default
            if (currentPermissionContext.isBypassPermissionsModeAvailable) {
                return "bypassPermissions";
            }
            return "default";

        case "bypassPermissions":
            // bypassPermissions → default (always)
            return "default";

        case "dontAsk":
            // dontAsk → default
            return "default";
    }
}

// Mapping: hf1→cycleMode, l8→hasTeamContext, PM→isTeamLeader, K→isTeamLeaderWithTeam
```

---

## 3. Wrapper Function: `cycleModeWithContext` (`FGq`)

```javascript
// ============================================
// FGq - cycleModeWithContext
// Location: chunks.183.mjs:1799-1804
// ============================================

// ORIGINAL (for source lookup):
function FGq(A, q) {
    return {
        nextMode: hf1(A, q),
        context: A
    }
}

// READABLE (for understanding):
function cycleModeWithContext(permissionContext, teamContext) {
    return {
        nextMode: cycleMode(permissionContext, teamContext),
        context: permissionContext  // Pass through for reference
    };
}

// Mapping: FGq→cycleModeWithContext, hf1→cycleMode
```

---

## 4. Mode Sequence Tables

### Standard User (No Team, No Bypass)

| Current Mode | Next Mode | Status Bar Change |
|--------------|-----------|-------------------|
| `default` | `acceptEdits` | Shows "⏵⏵ accept edits on" |
| `acceptEdits` | `plan` | Shows "⏸ plan mode on" |
| `plan` | `default` | Mode indicator hides |

### Team Leader

| Current Mode | Next Mode | Status Bar Change |
|--------------|-----------|-------------------|
| `default` | `acceptEdits` | Shows "⏵⏵ accept edits on" |
| `acceptEdits` | `plan` | Shows "⏸ plan mode on" |
| `plan` | `delegate` | Shows "⇢ delegate mode on" |
| `delegate` | `default` | Mode indicator hides |

### Enterprise (Bypass Permissions Available)

| Current Mode | Next Mode | Status Bar Change |
|--------------|-----------|-------------------|
| `default` | `acceptEdits` | Shows "⏵⏵ accept edits on" |
| `acceptEdits` | `plan` | Shows "⏸ plan mode on" |
| `plan` | `bypassPermissions` | Shows "⏵⏵ bypass permissions on" |
| `bypassPermissions` | `default` | Mode indicator hides |

### Team Leader + Enterprise

| Current Mode | Next Mode | Status Bar Change |
|--------------|-----------|-------------------|
| `default` | `acceptEdits` | Shows "⏵⏵ accept edits on" |
| `acceptEdits` | `plan` | Shows "⏸ plan mode on" |
| `plan` | `delegate` | Shows "⇢ delegate mode on" |
| `delegate` | `bypassPermissions` | Shows "⏵⏵ bypass permissions on" |
| `bypassPermissions` | `default` | Mode indicator hides |

---

## 5. Shift+Tab Handler Implementation

The Shift+Tab key is bound to `chat:cycleMode` action. Here's the handler flow:

```javascript
// ============================================
// Shift+Tab handler (simplified from chunks.185.mjs)
// ============================================

// READABLE (for understanding):
async function handleCycleMode() {
    let appState = getAppState();
    let currentMode = appState.toolPermissionContext;
    let teamContext = appState.teamContext;

    // Get next mode
    let { nextMode } = cycleModeWithContext(currentMode, teamContext);

    // Telemetry
    trackEvent("tengu_mode_cycle", { to: nextMode });

    // Side effects based on mode change
    if (currentMode.mode === "plan" && nextMode !== "plan") {
        // Leaving plan mode
        setHasExitedPlanMode(true);
    }

    if (nextMode === "plan") {
        // Entering plan mode
        updateSettings((settings) => ({
            ...settings,
            lastPlanModeUse: Date.now()
        }));
    }

    if (nextMode === "acceptEdits") {
        trackEvent("auto-accept-mode");
    }

    // Update state
    setAppState((state) => ({
        ...state,
        toolPermissionContext: applyPermissionAction(state.toolPermissionContext, {
            type: "setMode",
            mode: nextMode,
            destination: "session"
        })
    }));
}
```

---

## 6. Mode Display Properties

### `CQ` - Get Mode Display Name

```javascript
// ============================================
// CQ - getModeDisplayName
// Location: chunks.14.mjs:3260
// ============================================

function CQ(A) {
    switch (A) {
        case "plan": return "Plan Mode";
        case "acceptEdits": return "Accept edits";
        case "delegate": return "Delegate Mode";
        case "bypassPermissions": return "Bypass Permissions";
        case "dontAsk": return "Don't Ask";
        default: return "Default";
    }
}

// READABLE:
function getModeDisplayName(mode) {
    const names = {
        "plan": "Plan Mode",
        "acceptEdits": "Accept edits",
        "delegate": "Delegate Mode",
        "bypassPermissions": "Bypass Permissions",
        "dontAsk": "Don't Ask",
        "default": "Default"
    };
    return names[mode] || "Default";
}

// Mapping: CQ→getModeDisplayName
```

### `Rv1` - Get Mode Icon

```javascript
// ============================================
// Rv1 - getModeIcon
// Location: chunks.14.mjs:3281
// ============================================

function Rv1(A) {
    switch (A) {
        case "plan": return "⏸";
        case "acceptEdits": return "⏵⏵";
        case "delegate": return "⇢";
        case "bypassPermissions": return "⏵⏵";
        default: return "";
    }
}

// READABLE:
function getModeIcon(mode) {
    const icons = {
        "plan": "⏸",           // Pause icon
        "acceptEdits": "⏵⏵",  // Double play
        "delegate": "⇢",       // Right arrow
        "bypassPermissions": "⏵⏵"
    };
    return icons[mode] || "";
}

// Mapping: Rv1→getModeIcon
```

### `cP` - Get Mode Theme Color

```javascript
// ============================================
// cP - getModeThemeColor
// Location: chunks.14.mjs:3298
// ============================================

function cP(A) {
    switch (A) {
        case "plan": return "planMode";
        case "acceptEdits": return "autoAccept";
        case "delegate": return "delegateMode";
        case "bypassPermissions": return "error";
        default: return "text";
    }
}

// READABLE:
function getModeThemeColor(mode) {
    const colors = {
        "plan": "planMode",
        "acceptEdits": "autoAccept",
        "delegate": "delegateMode",
        "bypassPermissions": "error"
    };
    return colors[mode] || "text";
}

// Mapping: cP→getModeThemeColor
```

---

## 7. Status Bar Rendering

The status bar shows the current mode when it's non-default:

```javascript
// ============================================
// Status bar mode indicator (from chunks.183.mjs:2590+)
// ============================================

// READABLE (for understanding):
function renderStatusBar(appState, showHint) {
    let currentMode = appState.toolPermissionContext?.mode;
    let isNonDefaultMode = currentMode !== "default" && currentMode !== undefined;

    if (!isNonDefaultMode) {
        return null;  // No mode indicator for default mode
    }

    let cycleModeKeybinding = getKeybinding("chat:cycleMode", "Chat", "shift+tab");

    return (
        <Box flexDirection="row">
            <Text color={getModeThemeColor(currentMode)}>
                {getModeIcon(currentMode)}
                {" "}
                {getModeDisplayName(currentMode).toLowerCase()}
                {" on"}
            </Text>
            {showHint && (
                <Text dimColor>
                    {" "}
                    ({cycleModeKeybinding})
                </Text>
            )}
        </Box>
    );
}
```

### Visual Output Examples

```
⏸ plan mode on (shift+tab)
⏵⏵ accept edits on (shift+tab)
⇢ delegate mode on (shift+tab)
⏵⏵ bypass permissions on (shift+tab)
```

---

## 8. Telemetry Events

| Event | Trigger | Properties |
|-------|---------|------------|
| `tengu_mode_cycle` | Shift+Tab pressed | `{ to: nextMode }` |
| `auto-accept-mode` | Entering acceptEdits | - |

---

## 9. Help Tip Integration

Plan mode cycling is featured in help tips:

```javascript
// ============================================
// Help tips for mode cycling
// ============================================

const helpTips = [
    {
        id: "plan-mode-for-complex-tasks",
        content: `Use Plan Mode to prepare for a complex request before making changes. Press ${cycleModeKeybinding} twice to enable.`,
        isRelevant: (settings) => {
            // Show if user hasn't used plan mode in >7 days
            let daysSince = (Date.now() - (settings.lastPlanModeUse ?? 0)) / 86400000;
            return daysSince > 7;
        }
    },
    {
        id: "shift+tab cycles modes",
        content: `Hit ${cycleModeKeybinding} to cycle between default mode, auto-accept edit mode, and plan mode`
    },
    {
        id: "opusplan-mode-reminder",
        content: `Your default model setting is Opus Plan Mode. Press ${cycleModeKeybinding} twice to activate Plan Mode and plan with Claude Opus.`,
        isRelevant: (settings) => {
            let isOpusPlan = getDefaultModel() === "opusplan";
            let daysSince = (Date.now() - (settings.lastPlanModeUse ?? 0)) / 86400000;
            return isOpusPlan && daysSince > 7;
        }
    }
];
```

---

## 10. Keybinding Registration

The `chat:cycleMode` action is registered with default binding `shift+tab`:

```javascript
// ============================================
// Keybinding registration (from chunks.183.mjs)
// ============================================

// READABLE (for understanding):
const keybindings = {
    "chat:cycleMode": {
        default: "shift+tab",
        context: "Chat",
        description: "Cycle through permission modes"
    }
};
```

---

## 11. Complete Mode Transition Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 Shift+Tab Mode Transition Flow                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User presses Shift+Tab                                         │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Get current permission context                              ││
│  │ Get team context (if any)                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ FGq() → hf1()                                               ││
│  │                                                             ││
│  │ Determine next mode based on:                               ││
│  │ • Current mode                                              ││
│  │ • Team leader status                                        ││
│  │ • Bypass permissions availability                           ││
│  └─────────────────────────────────────────────────────────────┘│
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Pre-transition side effects:                                ││
│  │                                                             ││
│  │ If leaving plan mode:                                       ││
│  │   → setHasExitedPlanMode(true)                              ││
│  │                                                             ││
│  │ If entering plan mode:                                      ││
│  │   → updateSettings({ lastPlanModeUse: Date.now() })        ││
│  └─────────────────────────────────────────────────────────────┘│
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Update app state:                                           ││
│  │                                                             ││
│  │ setAppState(prev => ({                                      ││
│  │   ...prev,                                                  ││
│  │   toolPermissionContext: {                                  ││
│  │     ...prev.toolPermissionContext,                          ││
│  │     mode: nextMode                                          ││
│  │   }                                                         ││
│  │ }))                                                         ││
│  └─────────────────────────────────────────────────────────────┘│
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ UI Update:                                                  ││
│  │                                                             ││
│  │ • Status bar renders new mode indicator                     ││
│  │ • Mode-specific UI elements update                          ││
│  │ • Tools permission context changes                          ││
│  └─────────────────────────────────────────────────────────────┘│
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Telemetry:                                                  ││
│  │                                                             ││
│  │ trackEvent("tengu_mode_cycle", { to: nextMode })            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Interaction with Plan Mode Entry/Exit

### EnterPlanMode Tool

When the LLM calls `EnterPlanMode`:

1. Current mode is saved as `prePlanMode`
2. `mode` is set to `"plan"`
3. `needsPlanModeExitAttachment` is set via `ey` transition hook

### ExitPlanMode Tool

When the LLM calls `ExitPlanMode` (and user approves):

1. `mode` is restored to `prePlanMode` or `"default"`
2. `prePlanMode` is cleared
3. `hasExitedPlanMode` is set to `true`
4. `needsPlanModeExitAttachment` is cleared

### Shift+Tab Exit

When user exits via Shift+Tab:

1. `hasExitedPlanMode` is set immediately in the handler
2. Mode cycles to next mode in sequence
3. `needsPlanModeExitAttachment` is cleared via `ey` hook

---

## Summary: Mode Cycling Reference

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| `cycleMode` | `hf1` | Core logic for determining next mode |
| `cycleModeWithContext` | `FGq` | Wrapper returning { nextMode, context } |
| `getModeDisplayName` | `CQ` | Human-readable mode name |
| `getModeIcon` | `Rv1` | Unicode icon for mode |
| `getModeThemeColor` | `cP` | Theme color key for mode |
| `isTeamLeader` | `PM` | Check if user is team leader |
| `hasTeamContext` | `l8` | Check if team context exists |

### Key Points

1. Plan mode is always the **third** mode in the standard cycle (default → acceptEdits → plan)
2. Team leaders have an additional **delegate** mode after plan
3. Enterprise users may have **bypassPermissions** mode
4. Status bar only shows for **non-default** modes
5. `lastPlanModeUse` timestamp is updated when entering plan mode
6. `hasExitedPlanMode` is set when leaving plan mode via any method