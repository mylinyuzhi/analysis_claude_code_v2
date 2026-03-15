# Plan Mode - Mode Cycling Integration (Claude Code 2.1.76)

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
        case "default":     return "acceptEdits";
        case "acceptEdits": return "plan";
        case "plan":
            if (K) return "delegate";
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "delegate":
            if (A.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "bypassPermissions": return "default";
        case "dontAsk":     return "default"
    }
}

// READABLE (for understanding):
function cycleMode(currentPermissionContext, teamContext) {
    let isTeamLeaderWithTeam = hasTeamContext() && teamContext && isTeamLeader(teamContext);

    switch (currentPermissionContext.mode) {
        case "default":       return "acceptEdits";
        case "acceptEdits":   return "plan";
        case "plan":
            if (isTeamLeaderWithTeam) return "delegate";
            if (currentPermissionContext.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "delegate":
            if (currentPermissionContext.isBypassPermissionsModeAvailable) return "bypassPermissions";
            return "default";
        case "bypassPermissions": return "default";
        case "dontAsk":           return "default";
    }
}

// Mapping: hf1→cycleMode, l8→hasTeamContext, PM→isTeamLeader, K→isTeamLeaderWithTeam
```

---

## 3. Mode Display Properties

### Mode UI Properties Table

| Mode | Icon (`Rv1`) | Display (`CQ`) | Color key (`cP`) |
|------|-------------|----------------|-----------------|
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

**EnterPlanMode Tool:** When the LLM calls `EnterPlanMode`, current mode is saved as `prePlanMode`, `mode` is set to `"plan"`, and `needsPlanModeExitAttachment` is set via `ey` transition hook.

**ExitPlanMode Tool:** When the LLM calls `ExitPlanMode` (and user approves), `mode` is restored to `prePlanMode` or `"default"`, `prePlanMode` is cleared, `hasExitedPlanMode` is set to `true`, and `needsPlanModeExitAttachment` is cleared.

**Shift+Tab Exit:** When user exits via Shift+Tab, `hasExitedPlanMode` is set immediately in the handler, mode cycles to next mode in sequence, and `needsPlanModeExitAttachment` is cleared via `ey` hook.
