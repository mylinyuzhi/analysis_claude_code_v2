# Plan Mode - Mode Cycling Integration (Claude Code 2.1.76)

> Complete reverse engineering of how plan mode integrates with the Shift+Tab mode cycling system.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `W26` (chunks.191.mjs:3007) - `cycleMode` - Mode cycle logic
- `lbq` (chunks.191.mjs:3027) - `cycleModeWithContext` - Mode cycle wrapper returning next mode and context
- `cbq` (chunks.191.mjs:3003) - `isTeamLeaderWithTeam` - Helper for team leader check
- `GH` (chunks.193.mjs:649) - `handleCycleModeKeybinding` - Shift+Tab handler (keybinding action: "chat:cycleMode")
- `PM` (chunks.1.mjs) - `isTeamLeader` - Team context check
- `l8` (chunks.1.mjs) - `hasTeamContext` - Team detection
- `D57` (chunks.40.mjs:358) - `MODE_CONFIGURATION` - Mode display properties object

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

## 2. Core Function: `cycleMode` (`W26`)

```javascript
// ============================================
// W26 - cycleMode
// Location: chunks.191.mjs:3007-3025
// ============================================

// ORIGINAL (for source lookup):
function W26(A, q) {
    switch (A.mode) {
        case "default":
            return "acceptEdits";
        case "acceptEdits":
            return "plan";
        case "plan":
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            if (cbq(A)) return "auto";
            return "default";
        case "bypassPermissions":
            if (cbq(A)) return "auto";
            return "default";
        case "dontAsk":
            return "default";
        default:
            return "default"
    }
}

// READABLE (for understanding):
function cycleMode(permissionContext, teamContext) {
    switch (permissionContext.mode) {
        case "default":
            return "acceptEdits";
        case "acceptEdits":
            return "plan";
        case "plan":
            // Enterprise: bypassPermissions available after plan
            if (permissionContext.isBypassPermissionsModeAvailable) return "bypassPermissions";
            // Team leaders: auto mode available
            if (isTeamLeaderWithTeam(permissionContext)) return "auto";
            return "default";
        case "bypassPermissions":
            if (isTeamLeaderWithTeam(permissionContext)) return "auto";
            return "default";
        case "dontAsk":
            return "default";
        default:
            return "default";
    }
}

// Mapping: W26→cycleMode, cbq→isTeamLeaderWithTeam
```

### Keybinding Handler (`GH`)

The keybinding handler for `"chat:cycleMode"` is in chunks.193.mjs:

```javascript
// ============================================
// GH - handleCycleModeKeybinding
// Location: chunks.193.mjs:649-719
// ============================================

// READABLE (for understanding):
const handleCycleModeKeybinding = useCallback(() => {
    // Check if handling teammate mode (swarm context)
    if (isTeammateMode() && teammateContext && taskId) {
        let updatedContext = { ...permissionContext, mode: teammateContext.permissionMode };
        let nextMode = cycleMode(updatedContext, undefined);
        // Track and update teammate mode...
        return;
    }

    // Normal mode cycling
    let nextMode = cycleMode(permissionContext, teamContext);

    // Handle "auto" mode (team leader)
    if (nextMode === "auto" && permissionContext.mode !== "auto" && !isSubagent() && !taskId) {
        // Show auto mode confirmation dialog
        setPreAutoMode(permissionContext.mode);
        updateState({ toolPermissionContext: { ...permissionContext, mode: "auto" }});
        // Set 400ms timeout for auto mode confirmation
        return;
    }

    // Update lastPlanModeUse timestamp if entering plan mode
    if (nextMode === "plan") {
        updateSessionState(prev => ({ ...prev, lastPlanModeUse: Date.now() }));
    }

    // Apply the mode change
    updateState(prev => ({
        ...prev,
        toolPermissionContext: { ...contextAfterModeChange, mode: nextMode }
    }));

    // Log telemetry
    trackEvent("tengu_mode_cycle", { to: nextMode });
}, [permissionContext, teamContext, ...]);

// Mapping: GH→handleCycleModeKeybinding, W26→cycleMode
```

---

## 3. Mode Display Properties

Mode display properties are defined in the `D57` configuration object at `chunks.40.mjs:358`:

```javascript
// ============================================
// D57 - MODE_CONFIGURATION
// Location: chunks.40.mjs:358-403
// ============================================

D57 = {
    plan: { title: "Plan Mode", symbol: "⏸", color: "planMode" },
    acceptEdits: { title: "Accept edits", symbol: "⏵⏵", color: "autoAccept" },
    delegate: { title: "Delegate Mode", symbol: "⇢", color: "delegateMode" },
    bypassPermissions: { title: "Bypass Permissions", symbol: "⏵⏵", color: "error" },
    default: { title: "Default", symbol: "", color: "text" }
};
```

### Mode UI Properties Table

| Mode | Symbol | Title | Color key |
|------|--------|-------|-----------|
| `plan` | `⏸` | "Plan Mode" | `"planMode"` |
| `acceptEdits` | `⏵⏵` | "Accept edits" | `"autoAccept"` |
| `delegate` | `⇢` | "Delegate Mode" | `"delegateMode"` |
| `bypassPermissions` | `⏵⏵` | "Bypass Permissions" | `"error"` |
| `default` | `""` | "Default" | `"text"` |

### Visual Output Examples

```
⏸ plan mode on (shift+tab)
⏵⏵ accept edits on (shift+tab)
⇢ delegate mode on (shift+tab)
⏵⏵ bypass permissions on (shift+tab)
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

---

## 5. Key Points

1. Plan mode is always the **third** mode in the standard cycle (default → acceptEdits → plan)
2. Team leaders have an additional **delegate** mode after plan
3. Enterprise users may have **bypassPermissions** mode
4. Status bar only shows for **non-default** modes
5. `lastPlanModeUse` timestamp is updated when entering plan mode
6. `hasExitedPlanMode` is set when leaving plan mode via any method

### Interaction with Plan Mode Entry/Exit

**EnterPlanMode Tool:** When the LLM calls `EnterPlanMode`, current mode is saved as `prePlanMode`, `mode` is set to `"plan"`, and `needsPlanModeExitAttachment` is set via `Dp` transition hook.

**ExitPlanMode Tool:** When the LLM calls `ExitPlanMode` (and user approves), `mode` is restored to `prePlanMode` or `"default"`, `prePlanMode` is cleared, `hasExitedPlanMode` is set to `true`, and `needsPlanModeExitAttachment` is cleared.

**Shift+Tab Exit:** When user exits via Shift+Tab, `hasExitedPlanMode` is set immediately in the handler, mode cycles to next mode in sequence, and `needsPlanModeExitAttachment` is cleared via `Dp` hook.
