# Plan Mode - State Management Analysis (Claude Code 2.1.76)

> Complete reverse engineering of plan mode state variables, transitions, and persistence mechanisms.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `nk6` (chunks.1.mjs:2930) - `hasExitedPlanMode` getter
- `HV` (chunks.1.mjs:2934) - `setHasExitedPlanMode` setter
- `Fu1` (chunks.1.mjs:2938) - `needsPlanModeExitAttachment` getter
- `JS` (chunks.1.mjs:2942) - `setNeedsPlanModeExitAttachment` setter
- `Dp` (chunks.1.mjs:2946) - `handlePlanModeTransition` hook
- `a2` (chunks.42.mjs:1637) - `applyPermissionAction` - Permission context updates
- `prePlanMode` - Stored in `toolPermissionContext`

---

## 1. Overview: State Variables

Plan mode uses several state variables to track mode transitions and attachment needs:

```
┌─────────────────────────────────────────────────────────────────┐
│                 Plan Mode State Architecture                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Global Session State (o6 object)                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ hasExitedPlanMode: boolean                                  ││
│  │ └─ Tracks if user previously exited plan mode               ││
│  │    Used for re-entry detection                              ││
│  │                                                             ││
│  │ needsPlanModeExitAttachment: boolean                        ││
│  │ └─ Signals that exit attachment should be generated         ││
│  │    Set when transitioning out of plan mode                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  toolPermissionContext (in appState)                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ mode: "default" | "plan" | "acceptEdits" | ...              ││
│  │ └─ Current permission mode                                  ││
│  │                                                             ││
│  │ prePlanMode: string | undefined                             ││
│  │ └─ Mode before entering plan mode                           ││
│  │    Used to restore previous mode on exit                    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. State Variable: `hasExitedPlanMode`

### Getter (`nk6`)

```javascript
// ============================================
// nk6 - hasExitedPlanMode getter
// Location: chunks.1.mjs:2930-2932
// ============================================

// ORIGINAL (for source lookup):
function nk6() {
    return v1.hasExitedPlanMode
}

// READABLE (for understanding):
function hasExitedPlanMode() {
    // v1 is the global session state object
    return globalSessionState.hasExitedPlanMode;
}

// Mapping: nk6→hasExitedPlanMode, v1→globalSessionState
```

### Setter (`HV`)

```javascript
// ============================================
// HV - setHasExitedPlanMode setter
// Location: chunks.1.mjs:2934-2936
// ============================================

// ORIGINAL (for source lookup):
function HV(A) {
    v1.hasExitedPlanMode = A
}

// READABLE (for understanding):
function setHasExitedPlanMode(value) {
    globalSessionState.hasExitedPlanMode = value;
}

// Mapping: HV→setHasExitedPlanMode
```

### Usage Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│                    hasExitedPlanMode Lifecycle                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Initial State: false (or undefined)                            │
│                                                                 │
│  User enters plan mode → hasExitedPlanMode = false (unchanged)  │
│                                                                 │
│  User exits plan mode (Shift+Tab / ExitPlanMode)                │
│  └─ setHasExitedPlanMode(true)                                  │
│                                                                 │
│  User re-enters plan mode                                       │
│  └─ DuY() detects hasExitedPlanMode === true                    │
│      ├─ Pushes plan_mode_reentry attachment                     │
│      └─ setHasExitedPlanMode(false)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Callers of `HV` (setHasExitedPlanMode)

| Location | Context |
|----------|---------|
| `chunks.142.mjs:2049` | After adding re-entry attachment |
| `chunks.183.mjs` | During mode cycling (Shift+Tab) |
| ExitPlanMode handlers | After successful exit |

---

## 3. State Variable: `needsPlanModeExitAttachment`

### Getter (`Fu1`)

```javascript
// ============================================
// Fu1 - needsPlanModeExitAttachment getter
// Location: chunks.1.mjs:2938-2940
// ============================================

// ORIGINAL (for source lookup):
function Fu1() {
    return v1.needsPlanModeExitAttachment
}

// READABLE (for understanding):
function needsPlanModeExitAttachment() {
    // v1 is the global session state object
    return globalSessionState.needsPlanModeExitAttachment;
}

// Mapping: Fu1→needsPlanModeExitAttachment, v1→globalSessionState
```

### Setter (`JS`)

```javascript
// ============================================
// JS - setNeedsPlanModeExitAttachment setter
// Location: chunks.1.mjs:2942-2944
// ============================================

// ORIGINAL (for source lookup):
function JS(A) {
    v1.needsPlanModeExitAttachment = A
}

// READABLE (for understanding):
function setNeedsPlanModeExitAttachment(value) {
    globalSessionState.needsPlanModeExitAttachment = value;
}

// Mapping: JS→setNeedsPlanModeExitAttachment
```

### Usage Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│           needsPlanModeExitAttachment Lifecycle                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Initial State: false                                           │
│                                                                 │
│  Transition INTO plan mode                                      │
│  └─ Dp("default", "plan") → needsPlanModeExitAttachment = false │
│                                                                 │
│  While IN plan mode                                             │
│  └─ needsPlanModeExitAttachment remains false                   │
│                                                                 │
│  Transition OUT of plan mode                                    │
│  └─ Dp("plan", "default") → needsPlanModeExitAttachment = true  │
│                                                                 │
│  Exit attachment generated (XuY)                                │
│  └─ Checks needsPlanModeExitAttachment                          │
│  └─ Generates attachment if true and mode !== "plan"            │
│  └─ Resets to false after generation                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Mode Transition Hook (`Dp`)

```javascript
// ============================================
// Dp - handlePlanModeTransition
// Location: chunks.1.mjs:2946-2950
// ============================================

// ORIGINAL (for source lookup):
function Dp(A, q) {
    if (q === "plan" && A !== "plan") v1.needsPlanModeExitAttachment = !1;
    if (A === "plan" && q !== "plan") v1.needsPlanModeExitAttachment = !0
}

// READABLE (for understanding):
function handlePlanModeTransition(oldMode, newMode) {
    // Transitioning INTO plan mode
    if (oldMode === "plan" && newMode !== "plan") {
        // We're leaving plan mode - signal exit attachment needed
        globalSessionState.needsPlanModeExitAttachment = true;
    }

    // Transitioning OUT of plan mode
    if (newMode === "plan" && oldMode !== "plan") {
        // We're entering plan mode - clear exit attachment flag
        // (This handles edge case: was previously set but mode changed back)
        globalSessionState.needsPlanModeExitAttachment = false;
    }
}

// Mapping: Dp→handlePlanModeTransition, A→oldMode, q→newMode, v1→globalSessionState
```

### Transition Logic Table

| Old Mode | New Mode | Action |
|----------|----------|--------|
| `plan` | `default` | `needsPlanModeExitAttachment = true` |
| `plan` | `acceptEdits` | `needsPlanModeExitAttachment = true` |
| `plan` | `bypassPermissions` | `needsPlanModeExitAttachment = true` |
| `plan` | `delegate` | `needsPlanModeExitAttachment = true` |
| `default` | `plan` | `needsPlanModeExitAttachment = false` |
| `acceptEdits` | `plan` | `needsPlanModeExitAttachment = false` |
| Any other | `plan` | `needsPlanModeExitAttachment = false` |

### When `Dp` is Called

The transition hook is called from `applyPermissionAction` (`a2`) when the mode changes:

```javascript
// ============================================
// a2 - applyPermissionAction (excerpt)
// Location: chunks.42.mjs:1637-1643
// ============================================

// ORIGINAL (for source lookup):
function a2(A, q) {
    switch (q.type) {
        case "setMode":
            return h(`Applying permission update: Setting mode to '${q.mode}'`), {
                ...A,
                mode: q.mode
            };
        // ... other cases ...
    }
}

// READABLE (for understanding):
function applyPermissionAction(permissionContext, action) {
    switch (action.type) {
        case "setMode":
            // Log the mode change
            log(`Applying permission update: Setting mode to '${action.mode}'`);

            // Call transition hook BEFORE updating
            // (The actual call happens at the call site, not inside a2)
            handlePlanModeTransition(permissionContext.mode, action.mode);

            return {
                ...permissionContext,
                mode: action.mode
            };
        // ... other cases for addRules, replaceRules, etc.
    }
}

// Mapping: a2→applyPermissionAction
```

---

## 5. `prePlanMode` Save/Restore Mechanism

The `prePlanMode` variable stores the mode before entering plan mode, enabling proper restoration on exit.

### Storage Location

```javascript
// Stored in toolPermissionContext
toolPermissionContext: {
    mode: "plan",
    prePlanMode: "acceptEdits",  // Was in acceptEdits before plan
    // ... other fields
}
```

### Save: EnterPlanMode Tool

```javascript
// ============================================
// EnterPlanMode - prePlanMode save
// Location: chunks.140.mjs (EnterPlanMode.call)
// ============================================

// READABLE (for understanding):
async function enterPlanMode(input, context) {
    let appState = await context.getAppState();
    let currentMode = appState.toolPermissionContext.mode;

    // Save current mode before switching to plan
    let updatedContext = {
        ...appState.toolPermissionContext,
        mode: "plan",
        prePlanMode: currentMode  // ← Save for restoration
    };

    // Update state
    setAppState({
        ...appState,
        toolPermissionContext: updatedContext
    });

    return { success: true };
}
```

### Restore: ExitPlanMode Tool

```javascript
// ============================================
// ExitPlanMode - prePlanMode restore
// Location: chunks.139.mjs (ExitPlanMode.call)
// ============================================

// READABLE (for understanding):
async function exitPlanMode(input, context) {
    let appState = await context.getAppState();
    let permissionContext = appState.toolPermissionContext;

    // Determine target mode
    // Priority: input.mode > prePlanMode > "default"
    let targetMode = input.mode ?? permissionContext.prePlanMode ?? "default";

    // Clear prePlanMode
    let updatedContext = {
        ...permissionContext,
        mode: targetMode,
        prePlanMode: undefined  // ← Clear after use
    };

    // Update state
    setAppState({
        ...appState,
        toolPermissionContext: updatedContext
    });

    return { success: true, newMode: targetMode };
}
```

### Restoration Examples

| Before Entry | During Plan | After Exit |
|--------------|-------------|------------|
| `default` | `plan` | `default` |
| `acceptEdits` | `plan` | `acceptEdits` |
| `bypassPermissions` | `plan` | `bypassPermissions` |
| `delegate` | `plan` | `delegate` |

---

## 6. State Persistence Across Sessions

Plan mode state is NOT persisted across Claude Code sessions. Each new session starts fresh:

| State Variable | Persisted? | Initial Value |
|----------------|------------|---------------|
| `hasExitedPlanMode` | No | `false` |
| `needsPlanModeExitAttachment` | No | `false` |
| `mode` | No | `"default"` |
| `prePlanMode` | No | `undefined` |

### Session Reset Behavior

When Claude Code restarts or a new session begins:

```javascript
// Session state initialization (simplified)
function initializeSessionState() {
    return {
        hasExitedPlanMode: false,
        needsPlanModeExitAttachment: false,
        // ... other state
    };
}
```

### Plan File Persistence

While state variables are not persisted, **the plan file IS persisted**:

- Plan file path: `.claude/sessions/<session-id>/plan.md`
- This file survives across sessions within the same session-id directory
- New session IDs are generated for new conversations

---

## 7. Complete State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Plan Mode State Machine                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐                                                    │
│  │ DEFAULT │ ←─────────────────────────────────────┐           │
│  │  MODE   │                                       │           │
│  └────┬────┘                                       │           │
│       │                                            │           │
│       │ EnterPlanMode / Shift+Tab                  │           │
│       │                                            │           │
│       │ ┌─────────────────────────────────┐       │           │
│       │ │ Save prePlanMode = "default"    │       │           │
│       │ │ Set mode = "plan"               │       │           │
│       │ │ needsPlanModeExitAttachment = F │       │           │
│       │ └─────────────────────────────────┘       │           │
│       │                                            │           │
│       ▼                                            │           │
│  ┌─────────┐                                       │           │
│  │  PLAN   │                                       │           │
│  │  MODE   │                                       │           │
│  └────┬────┘                                       │           │
│       │                                            │           │
│       │ ExitPlanMode (approved)                    │           │
│       │                                            │           │
│       │ ┌─────────────────────────────────┐       │           │
│       │ │ needsPlanModeExitAttachment = F │       │           │
│       │ │ mode = prePlanMode ?? "default" │       │           │
│       │ │ prePlanMode = undefined         │       │           │
│       │ │ hasExitedPlanMode = true        │       │           │
│       │ └─────────────────────────────────┘       │           │
│       │                                            │           │
│       └────────────────────────────────────────────┘           │
│                                                                 │
│  Re-entry Scenario:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ hasExitedPlanMode = true                                │   │
│  │ User re-enters plan mode                                │   │
│  │ DuY() detects hasExitedPlanMode                         │   │
│  │ ├─ Push plan_mode_reentry attachment                    │   │
│  │ └─ hasExitedPlanMode = false                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Interaction with Other Systems

### Mode Cycling (Shift+Tab)

From `ui_linkage.md`:

```javascript
// When user presses Shift+Tab in plan mode
if (currentMode.mode === "plan" && nextMode !== "plan") {
    setHasExitedPlanMode(true);  // HV(true)
}
```

### Attachment Generation

From `reminder_system.md`:

```javascript
// DuY checks hasExitedPlanMode
if (hasExitedPlanMode() && planExists !== null) {
    attachments.push({
        type: "plan_mode_reentry",
        planFilePath: planFilePath
    });
    setHasExitedPlanMode(false);
}
```

### Exit Attachment

```javascript
// XuY checks needsPlanModeExitAttachment
if (!needsPlanModeExitAttachment()) return [];
if (mode === "plan") {
    setNeedsPlanModeExitAttachment(false);
    return [];
}
```

---

## 9. Edge Cases

### Edge Case 1: Rapid Mode Cycling

User rapidly cycles through modes with Shift+Tab:

```
default → acceptEdits → plan → default → plan
         (fast)        (fast)  (fast)
```

**State behavior**:
1. `needsPlanModeExitAttachment` toggles with each transition
2. `hasExitedPlanMode` only set when leaving plan for non-plan
3. No race conditions - state is synchronous

### Edge Case 2: ExitPlanMode Rejection

User rejects the ExitPlanMode dialog:

```javascript
// ExitPlanMode rejected
// Mode stays as "plan"
// hasExitedPlanMode is NOT set
// needsPlanModeExitAttachment stays true
```

### Edge Case 3: Swarm Teammate Plan Approval

For teammates, state changes come from `InboxPoller`:

```javascript
// chunks.186.mjs:511-566
if (response.approved) {
    setAppState((state) => ({
        ...state,
        toolPermissionContext: applyPermissionAction(state.toolPermissionContext, {
            type: "setMode",
            mode: normalizePermissionMode(grantedMode),
            destination: "session"
        })
    }));
    // hasExitedPlanMode is set implicitly via mode change
}
```

---

## 10. Related State Variables

### Delegate Mode Counterparts

Plan mode has parallel state variables for delegate mode:

| Plan Mode | Delegate Mode | Purpose |
|-----------|---------------|---------|
| `hasExitedPlanMode` | `hasExitedDelegateMode` | Re-entry detection |
| `needsPlanModeExitAttachment` | `needsDelegateModeExitAttachment` | Exit attachment flag |

```javascript
// chunks.1.mjs:2880-2894
function fbq() {
    return o6.hasExitedDelegateMode
}
function tL6(A) {
    o6.hasExitedDelegateMode = A
}
function eL6() {
    return o6.needsDelegateModeExitAttachment
}
function XN1(A) {
    o6.needsDelegateModeExitAttachment = A
}
```

---

## Summary: State Variable Reference

| Variable | Getter | Setter | Purpose |
|----------|--------|--------|---------|
| `hasExitedPlanMode` | `nk6()` | `HV(value)` | Track if user previously exited plan mode |
| `needsPlanModeExitAttachment` | `Fu1()` | `JS(value)` | Signal exit attachment generation |
| `prePlanMode` | Direct access | Direct access | Store mode before plan for restoration |
| `mode` | `toolPermissionContext.mode` | `a2()` action | Current permission mode |

### Key Invariants

1. **`hasExitedPlanMode`** is only `true` between exiting plan mode and re-entry
2. **`needsPlanModeExitAttachment`** is `true` after leaving plan mode (until exit attachment is generated)
3. **`prePlanMode`** is only set when entering plan mode
4. State is **not persisted** across sessions
5. All state changes are **synchronous** (no async operations)
