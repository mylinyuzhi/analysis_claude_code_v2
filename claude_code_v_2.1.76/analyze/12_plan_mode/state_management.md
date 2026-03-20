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

- Plan file path: `~/.claude/plans/{slug}.md` (slug uses `{adjective}-{action}-{noun}` pattern)
- Plans are stored in a shared plans directory, not per-session
- Path generated by `uW/getPlanFilePath` (chunks.88.mjs:120), slug by `Rj1/getPlanFileSlug` (chunks.88.mjs:78)

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
// needsPlanModeExitAttachment stays true (was set by Dp when attempting to exit)
```

**What happens in XuY:**
```javascript
async function getPlanModeExitAttachment(toolUseContext) {
    if (!needsPlanModeExitAttachment()) return [];

    // Key check: if mode is still "plan", the user rejected the dialog
    if ((await toolUseContext.getAppState()).toolPermissionContext.mode === "plan") {
        setNeedsPlanModeExitAttachment(false);  // Clear the flag
        return [];  // Don't emit exit attachment
    }
    // ... otherwise, emit exit attachment
}
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

### Edge Case 4: Auto-Mode Gate Fallback

When exiting plan mode with `prePlanMode = "auto"` but the auto-mode gate is disabled:

```javascript
// In ExitPlanMode.call():
let prePlanMode = state.toolPermissionContext.prePlanMode ?? "default";
let targetMode = prePlanMode === "ultraplan" ? "default" : prePlanMode;

// Gate check
if (targetMode === "auto" && !isAutoModeGateEnabled()) {
    targetMode = "default";  // Fall back to default
    // Show notification to user
    addNotification({
        key: "auto-mode-gate-plan-exit-fallback",
        text: `plan exit → default · ${reason}`,
        priority: "immediate",
        color: "warning"
    });
}
```

**Why this matters:** The auto-mode gate can disable auto mode when:
- Circuit breaker is triggered (too many errors)
- Rate limiting is active
- System is in degraded state

This prevents cascading failures when the user exits plan mode expecting auto mode.

**Algorithm Deep-Dive: Auto-Mode Gate Check**

```javascript
// ============================================
// isAutoModeGateEnabled - Gate check for auto mode
// Location: cli.chunks.mjs:7421 (IN), chunks.143.mjs (sl6 module)
// ============================================

// READABLE (for understanding):
function isAutoModeGateEnabled() {
    // Check if auto-mode gate module has an unavailable reason
    const reason = autoModeGate.getUnavailableReason();
    return reason === null;  // null = available, any string = blocked
}

function getAutoModeUnavailableReason() {
    // Priority order for checking why auto mode is unavailable:
    // 1. Circuit breaker state (in autoModeState.tCY)
    // 2. Rate limiting active
    // 3. System degraded mode
    // 4. Feature flag disabled

    if (circuitBreaker.isOpen()) {
        return "Circuit breaker triggered";
    }
    if (rateLimiter.isLimited()) {
        return "Rate limiting active";
    }
    if (systemInDegradedMode()) {
        return "System in degraded state";
    }
    return null;  // Auto mode is available
}
```

**Key insight:** The auto-mode gate is checked ONLY at mode transition time, not during the planning session. This means:
1. If the gate closes while user is in plan mode, they can still exit to auto mode (gate check happens at exit)
2. The gate state is evaluated fresh on each mode transition
3. If auto mode becomes unavailable mid-session, the user gets a clear notification explaining why they fell back to default mode

**Interaction with `needsPlanModeExitAttachment`:**

When auto-mode gate forces fallback to default mode:
1. `needsPlanModeExitAttachment` is already set to `true` (by `Dp` during transition)
2. Exit attachment will be generated for `default` mode, not `auto` mode
3. The notification explains the fallback, avoiding user confusion about why they're in default mode instead of auto

**Why this design:** The lazy evaluation of the gate (at exit time rather than entry time) allows the system to:
- Recover from temporary outages during the planning session
- Provide up-to-date status at the moment of transition
- Avoid blocking plan mode entry even if auto mode is temporarily unavailable

### Edge Case 5: Ultraplan Mode

Ultraplan is a special mode used for remote planning sessions:

```javascript
// In DuY (getPlanModeAttachment):
if (permContext.prePlanMode === "ultraplan") {
    // Special reminder type for ultraplan
    attachments.push({
        type: "plan_mode",
        reminderType: "ultraplan-complete",
        ...
    });
    return attachments;  // Skip normal reminder logic
}

// In ExitPlanMode.call():
let prePlanMode = state.toolPermissionContext.prePlanMode ?? "default";
let targetMode = prePlanMode === "ultraplan" ? "default" : prePlanMode;
// Ultraplan always exits to "default", never back to "ultraplan"
```

### Edge Case 6: Plan Mode Re-entry Without Plan File

User exits plan mode, then re-enters, but the plan file was deleted:

```javascript
// In DuY:
if (hasExitedPlanMode() && planContent !== null) {  // planContent check is critical!
    attachments.push({ type: "plan_mode_reentry", planFilePath });
    setHasExitedPlanMode(false);
}
// If planContent is null, no re-entry attachment is generated
// The LLM starts fresh as if entering plan mode for the first time
```

### Edge Case 7: Concurrent State Modifications

Multiple components trying to modify state simultaneously:

```javascript
// State updates are batched via React's setAppState
// All updates use the functional form to avoid race conditions:
setAppState((prevState) => ({
    ...prevState,
    toolPermissionContext: {
        ...prevState.toolPermissionContext,
        mode: newMode
    }
}));
```

**Why this works:** React batches state updates within the same event loop tick, so even if multiple callers invoke `setAppState` concurrently, each gets the correct previous state.

---

## 10. Related State Variables

### Auto Mode Counterparts

Plan mode has related state variables for auto mode (used when exiting plan mode to auto mode):

```javascript
// ============================================
// Auto Mode State Variables
// Location: chunks.1.mjs:2951-2964
// ============================================

// ORIGINAL (for source lookup):
function pu1() {
    return v1.needsAutoModeExitAttachment
}
function MS(A) {
    v1.needsAutoModeExitAttachment = A
}
function Qu1(A, q, K) {
    let Y = A === "auto" || A === "plan" && K === "auto",
        z = q === "auto" || q === "plan" && A === "auto";
    if (z && !Y) v1.needsAutoModeExitAttachment = !1;
    if (Y && !z) v1.needsAutoModeExitAttachment = !0
}

// READABLE (for understanding):
function needsAutoModeExitAttachment() {
    return globalSessionState.needsAutoModeExitAttachment;
}

function setNeedsAutoModeExitAttachment(value) {
    globalSessionState.needsAutoModeExitAttachment = value;
}

function handleAutoModeTransition(currentMode, nextMode, prePlanMode) {
    // Check if we're in an "auto-related" state
    let wasAutoRelated = currentMode === "auto"
        || (currentMode === "plan" && prePlanMode === "auto");
    let isAutoRelated = nextMode === "auto"
        || (nextMode === "plan" && currentMode === "auto");

    // Transitioning INTO auto-related state
    if (isAutoRelated && !wasAutoRelated) {
        globalSessionState.needsAutoModeExitAttachment = true;
    }

    // Transitioning OUT of auto-related state
    if (wasAutoRelated && !isAutoRelated) {
        globalSessionState.needsAutoModeExitAttachment = false;
    }
}

// Mapping: pu1→needsAutoModeExitAttachment, MS→setNeedsAutoModeExitAttachment
// Mapping: Qu1→handleAutoModeTransition
```

**Why auto mode has separate state:**

When a user enters plan mode with `prePlanMode = "auto"`, they're planning while in auto mode. On exit, the system needs to:
1. Generate an auto_mode_exit attachment (in addition to plan_mode_exit)
2. Track that the user was in auto mode before plan mode
3. Restore the "dangerous permissions" that auto mode had revoked

The `handleAutoModeTransition` function is more complex than `handlePlanModeTransition` because it handles the "plan → auto" and "auto → plan" transitions as special cases.

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
