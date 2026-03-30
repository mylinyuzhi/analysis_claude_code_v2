# Plan Mode - Complete Source-Level Analysis

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-29
> **Status**: Complete source-level documentation with ORIGINAL/READABLE dual-version code

---

## Table of Contents

- [A. State Machine and Mode Transitions](#a-state-machine-and-mode-transitions)
- [B. EnterPlanMode Tool](#b-enterplanmode-tool)
- [C. ExitPlanMode Tool](#c-exitplanmode-tool)
- [D. Plan File Management](#d-plan-file-management)
- [E. Mode Cycling](#e-mode-cycling)
- [F. System Reminders](#f-system-reminders)
- [G. Tool Filtering](#g-tool-filtering)
- [H. Interview Phase](#h-interview-phase)
- [I. Plan Approval in Teams](#i-plan-approval-in-teams)
- [J. UI Components](#j-ui-components)
- [K. Compact Integration](#k-compact-integration)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions analyzed in this document:
- `modeTransitionHandler` (ki) - Full mode transition dispatcher - chunks.173.mjs:409
- `savePrePlanMode` (LT6) - Save mode before entering plan - chunks.173.mjs:763
- `handlePlanModeTransition` (Dp) - Attachment flag management - chunks.1.mjs:2946
- `EnterPlanModeTool` (Ki6) - Enter plan mode tool - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit plan mode tool - chunks.143.mjs:2802
- `planModeReminderDispatcher` (Wzz) - System reminder routing - chunks.173.mjs:2525
- `fullPlanModeReminder` (Nzz) - 5-phase workflow reminder - chunks.173.mjs:2555
- `iterativePlanModeReminder` (kzz) - Interview variant - chunks.173.mjs:2637
- `cycleMode` (W26) - Mode cycling logic - chunks.191.mjs:3007
- `getPlanFilePath` (Fj) - Plan file resolution - chunks.90.mjs:533
- `getPlanContent` (sJ) - Plan file reader - chunks.90.mjs:539

---

## A. State Machine and Mode Transitions

### Overview

Plan Mode has a three-layer state transition system:

1. **ki** (chunks.173.mjs:409) - The top-level mode transition handler that orchestrates everything: saving prePlanMode, managing auto mode interplay, and calling downstream hooks.
2. **LT6** (chunks.173.mjs:763) - Determines what value to save as prePlanMode when entering plan mode. This is the "memory" of what mode to restore on exit.
3. **Dp** (chunks.1.mjs:2946) - Low-level hook that manages the `needsPlanModeExitAttachment` flag -- controls whether the system reminder pipeline injects a plan-exit attachment on the next turn.

Additionally, two getter/setter pairs track global plan-mode state:
- **HV** / **nk6** (chunks.1.mjs:2930-2935) - `hasExitedPlanMode`: set to true when plan mode is exited, used by attachment logic to inject post-exit context.
- **JS** / **Fu1** (chunks.1.mjs:2938-2944) - `needsPlanModeExitAttachment`: controls injection of the plan_mode_exit attachment into the conversation.

### modeTransitionHandler (ki)

**What it does:** Central dispatcher for ALL mode transitions in the application. When any mode change occurs -- user pressing Shift+Tab, a tool calling `setAppState`, or the agent cycling modes -- this function coordinates the side effects and returns the updated context object.

**How it works:**
1. **Early return on same mode:** If `fromMode === toMode`, returns the context unchanged (no-op).
2. **Side effects (always run):** Calls `Dp(fromMode, toMode)` to manage the `needsPlanModeExitAttachment` flag, then calls `Qu1(fromMode, toMode, context.prePlanMode)` to log the mode transition. If exiting plan mode (`fromMode === "plan" && toMode !== "plan"`), calls `HV(true)` to set `hasExitedPlanMode`.
3. **Entering plan mode:** If `toMode === "plan" && fromMode !== "plan"`, calls `LT6(context)` to save the current mode as `prePlanMode` and returns the updated context immediately.
4. **Auto mode interplay:** Computes whether the "from" side was auto mode (either directly `fromMode === "auto"`, or `fromMode === "plan" && context.prePlanMode === "auto"`). If transitioning TO auto from non-auto, checks the gate via `IN()` (throws if gate not enabled), activates auto mode via `yF?.setAutoModeActive(true)`, and strips dangerous permissions via `Vi(context)`. If transitioning FROM auto to non-auto, deactivates auto mode and restores dangerous permissions via `x_6(context)`.
5. **Exiting plan mode cleanup:** If `fromMode === "plan" && toMode !== "plan" && context.prePlanMode`, returns a new context with `prePlanMode` cleared to `undefined`.
6. **Default:** Returns the (potentially modified) context.

**Why this approach:** Plan mode needs to "remember" the previous mode to restore it on exit. Without this save/restore pattern, exiting plan mode would always return to "default", even if the user was in "auto" or "acceptEdits" before entering plan. The auto mode interplay is necessary because auto mode and plan mode are mutually exclusive states -- entering plan from auto must properly pause auto. The gate check with `throw Error` prevents transitioning to auto mode if the feature gate has been disabled, which is a hard safety boundary.

**Key insight:** The transition handler is called for ALL mode changes, not just plan-related ones. The plan-specific logic is guarded by condition checks on fromMode/toMode, making this a general-purpose hook with plan-specific branches. The function returns the updated context object (not void), which is critical -- callers must use the returned value to get the modified `toolPermissionContext` after permission stripping/restoring.

```javascript
// ============================================
// modeTransitionHandler - Central mode transition dispatcher
// Location: chunks.173.mjs:409
// ============================================

// ORIGINAL (for source lookup):
function ki(A, q, K) {
    if (A === q) return K;
    if (Dp(A, q), Qu1(A, q, K.prePlanMode), A === "plan" && q !== "plan") HV(!0);
    {
        if (q === "plan" && A !== "plan") return LT6(K);
        let Y = A === "auto" || A === "plan" && K.prePlanMode === "auto",
            z = q === "auto";
        if (z && !Y) {
            if (!IN()) throw Error("Cannot transition to auto mode: gate is not enabled");
            yF?.setAutoModeActive(!0), K = Vi(K)
        } else if (Y && !z) yF?.setAutoModeActive(!1), K = x_6(K)
    }
    if (A === "plan" && q !== "plan" && K.prePlanMode) return {
        ...K,
        prePlanMode: void 0
    };
    return K
}

// READABLE (for understanding):
function modeTransitionHandler(fromMode, toMode, context) {
    // No-op: same mode transition
    if (fromMode === toMode) return context;

    // Side effects: update exit attachment flag, log transition
    handlePlanModeTransition(fromMode, toMode);       // Dp
    logModeTransition(fromMode, toMode, context.prePlanMode);  // Qu1
    if (fromMode === "plan" && toMode !== "plan") setHasExitedPlanMode(true);  // HV(!0)

    {
        // Entering plan mode: save current mode and return early
        if (toMode === "plan" && fromMode !== "plan") return savePrePlanMode(context);  // LT6

        // Auto mode interplay
        let wasAutoMode = fromMode === "auto" || (fromMode === "plan" && context.prePlanMode === "auto");
        let isGoingToAuto = toMode === "auto";

        if (isGoingToAuto && !wasAutoMode) {
            // Entering auto from non-auto: gate check required
            if (!isAutoModeGateEnabled()) throw Error("Cannot transition to auto mode: gate is not enabled");
            autoModeGate?.setAutoModeActive(true);
            context = stripDangerousPermissions(context);  // Vi()
        } else if (wasAutoMode && !isGoingToAuto) {
            // Leaving auto: deactivate and restore permissions
            autoModeGate?.setAutoModeActive(false);
            context = restoreDangerousPermissions(context);  // x_6()
        }
    }

    // Exiting plan mode: clear saved prePlanMode
    if (fromMode === "plan" && toMode !== "plan" && context.prePlanMode) {
        return { ...context, prePlanMode: undefined };
    }
    return context;
}

// Mapping: ki->modeTransitionHandler, A->fromMode, q->toMode, K->context,
//          Dp->handlePlanModeTransition, Qu1->logModeTransition,
//          HV->setHasExitedPlanMode, LT6->savePrePlanMode,
//          IN->isAutoModeGateEnabled, yF->autoModeGate,
//          Vi->stripDangerousPermissions, x_6->restoreDangerousPermissions
```

### savePrePlanMode (LT6)

**What it does:** Calculates what `prePlanMode` value to save on the `toolPermissionContext` when entering plan mode. Takes the full `toolPermissionContext` object as input (not a mode string) and returns a new context object with `prePlanMode` set.

**How it works:**
1. Extracts `mode` from the input context object (`A.mode`).
2. If the current mode is already "plan": return the context as-is (no-op, already in plan mode).
3. If the current mode is "auto": return a new context with `prePlanMode: "auto"`.
4. If the default mode is "auto" (`KS1()`) AND the auto mode gate is enabled (`IN()`) AND the current mode is not "bypassPermissions": activate auto mode state via `yF?.setAutoModeActive(true)`, strip dangerous permissions via `Vi(A)`, and return context with `prePlanMode: "auto"`. This handles the case where the user's default is auto but they are in a non-auto mode -- entering plan should still "remember" auto.
5. Otherwise: return a new context with `prePlanMode` set to the current mode (e.g., "default", "acceptEdits").

**Why this approach:** The auto mode case is complex because auto mode has both a UI mode ("auto") and an internal state (`autoModeActive`). When entering plan from auto, the system needs to preserve the auto state so it can be fully restored on exit. The `KS1()` + `IN()` check handles the edge case where the user's default mode is auto but they happen to be in a different mode when entering plan -- the system still saves "auto" and activates auto state so the restoration works correctly. The `Vi(A)` call (strip dangerous permissions) is needed because when saving "auto" as the prePlanMode, the context needs to reflect auto mode's permission model.

**Key insight:** The parameter `A` is the full `toolPermissionContext` object, not a mode string. The function returns a new context object with `prePlanMode` set -- it does not call `setAppState` directly. This is because the caller (`ki`) uses the returned value to update state.

```javascript
// ============================================
// savePrePlanMode - Calculate and save pre-plan mode on context
// Location: chunks.173.mjs:763
// ============================================

// ORIGINAL (for source lookup):
function LT6(A) {
    let q = A.mode;
    if (q === "plan") return A;
    if (q === "auto") return { ...A, prePlanMode: "auto" };
    if (KS1() && IN() && q !== "bypassPermissions") return yF?.setAutoModeActive(!0), { ...Vi(A), prePlanMode: "auto" };
    return { ...A, prePlanMode: q }
}

// READABLE (for understanding):
function savePrePlanMode(toolPermissionContext) {
    let currentMode = toolPermissionContext.mode;

    // Already in plan mode, nothing to save
    if (currentMode === "plan") return toolPermissionContext;

    // Coming from auto mode -- save "auto" directly
    if (currentMode === "auto") return { ...toolPermissionContext, prePlanMode: "auto" };

    // Default mode is auto with gate enabled and not bypassing --
    // activate auto state, strip permissions, and save "auto"
    if (isDefaultModeAuto() && isAutoModeGateEnabled() && currentMode !== "bypassPermissions") {
        autoModeGate?.setAutoModeActive(true);
        return { ...stripDangerousPermissions(toolPermissionContext), prePlanMode: "auto" };
    }

    // Normal case: save whatever mode we're currently in
    return { ...toolPermissionContext, prePlanMode: currentMode };
}

// Mapping: LT6->savePrePlanMode, A->toolPermissionContext, q->currentMode,
//          KS1->isDefaultModeAuto, IN->isAutoModeGateEnabled,
//          yF->autoModeGate, Vi->stripDangerousPermissions
```

### handlePlanModeTransition (Dp)

**What it does:** Low-level hook that manages the `needsPlanModeExitAttachment` flag. This flag controls whether the system reminder pipeline should inject a plan-exit attachment on the next turn after exiting plan mode.

**How it works:**
1. Entering plan (toMode is "plan", fromMode is not "plan"): CLEAR the needsPlanModeExitAttachment flag. This resets any stale exit attachment from a previous plan cycle.
2. Exiting plan (fromMode is "plan", toMode is not "plan"): SET the needsPlanModeExitAttachment flag. This tells the attachment producer to inject the exit attachment on the next turn.

**Why this approach:** The attachment system is decoupled from the mode transition. Rather than immediately injecting content, the transition sets a flag that the attachment producer checks on the next turn. This prevents race conditions where the exit attachment might be generated before the mode change is fully propagated.

**Key insight:** The flag is cleared on entry (not just on attachment consumption) to handle edge cases where the user enters plan mode, exits, then re-enters without the exit attachment ever being consumed.

```javascript
// ============================================
// handlePlanModeTransition - Attachment flag manager
// Location: chunks.1.mjs:2946
// ============================================

// ORIGINAL (for source lookup):
function Dp(A, q) {
  if (q === "plan" && A !== "plan") {
    JS(!1);
  }
  if (A === "plan" && q !== "plan") {
    JS(!0);
  }
}

// READABLE (for understanding):
function handlePlanModeTransition(fromMode, toMode) {
  // Entering plan mode: reset exit attachment flag
  if (toMode === "plan" && fromMode !== "plan") {
    setNeedsPlanModeExitAttachment(false);
  }
  // Leaving plan mode: mark need for exit attachment
  if (fromMode === "plan" && toMode !== "plan") {
    setNeedsPlanModeExitAttachment(true);
  }
}

// Mapping: Dp->handlePlanModeTransition, A->fromMode, q->toMode,
//          JS->setNeedsPlanModeExitAttachment
```

### State Flag Getter/Setter Pairs

```javascript
// ============================================
// hasExitedPlanMode - Getter/Setter pair
// Location: chunks.1.mjs:2930-2935
// ============================================

// ORIGINAL (for source lookup):
let nk6 = () => globalState.hasExitedPlanMode;  // getter
let HV = (v) => { globalState.hasExitedPlanMode = v; };  // setter

// READABLE (for understanding):
let getHasExitedPlanMode = () => globalSessionState.hasExitedPlanMode;
let setHasExitedPlanMode = (value) => { globalSessionState.hasExitedPlanMode = value; };

// Mapping: nk6->getHasExitedPlanMode, HV->setHasExitedPlanMode
```

```javascript
// ============================================
// needsPlanModeExitAttachment - Getter/Setter pair
// Location: chunks.1.mjs:2938-2944
// ============================================

// ORIGINAL (for source lookup):
let Fu1 = () => globalState.needsPlanModeExitAttachment;  // getter
let JS = (v) => { globalState.needsPlanModeExitAttachment = v; };  // setter

// READABLE (for understanding):
let getNeedsPlanModeExitAttachment = () => globalSessionState.needsPlanModeExitAttachment;
let setNeedsPlanModeExitAttachment = (value) => { globalSessionState.needsPlanModeExitAttachment = value; };

// Mapping: Fu1->getNeedsPlanModeExitAttachment, JS->setNeedsPlanModeExitAttachment
```

### Complete State Transition Diagram

```
                        STATE TRANSITIONS
 ================================================================

 [Any Mode] ---EnterPlanMode tool---> [plan]
     |                                   |
     |  ki() called:                     |  ki() called:
     |  1. LT6(currentMode)             |  1. Clear prePlanMode
     |     saves prePlanMode             |  2. HV(true) = hasExitedPlanMode
     |  2. Dp(from, "plan")             |  3. Dp("plan", toMode)
     |     clears exit attachment        |     sets exit attachment flag
     |                                   |
     +-----------------------------------+
                                         |
                                    ExitPlanMode tool
                                         |
                                         v
                                  [prePlanMode]
                                  (restored mode)

 Special cases:
   auto -> plan: autoModeState paused, prePlanMode = "auto"
   plan -> auto: autoModeState reactivated (if gate still enabled)
   ultraplan -> default: ultraplan mapped to "default" on exit
```

---

## B. EnterPlanMode Tool

### Overview

The EnterPlanMode tool (`Ki6`, chunks.144.mjs:1579) is the primary entry point for plan mode. It is a tool object registered with the agent's tool system, callable by the LLM to transition the session into plan mode.

### Tool Object Structure

```javascript
// ============================================
// EnterPlanModeTool - Plan mode entry tool object
// Location: chunks.144.mjs:1579
// ============================================

// ORIGINAL (for source lookup):
const Ki6 = {
  name: dt,  // "EnterPlanMode"
  description: RIY(),
  inputSchema: { type: "object", properties: {} },
  isReadOnly: () => !0,
  checkPermissions: () => ({ behavior: "allow" }),
  call: async function(A, Q) { /* ... */ },
  mapToolResultToToolResultBlockParam: function(A) { /* ... */ },
  renderToolResult: E8q,
  renderToolRejectedMessage: y8q
};

// READABLE (for understanding):
const EnterPlanModeTool = {
  name: TOOL_NAME_ENTER_PLAN_MODE,  // "EnterPlanMode"
  description: buildEnterPlanModeDescription(),
  inputSchema: { type: "object", properties: {} },
  isReadOnly: () => true,
  checkPermissions: () => ({ behavior: "allow" }),
  call: async function(input, context) { /* see below */ },
  mapToolResultToToolResultBlockParam: function(result) { /* see below */ },
  renderToolResult: renderEnterPlanModeResult,
  renderToolRejectedMessage: renderEnterPlanModeRejected
};

// Mapping: Ki6->EnterPlanModeTool, dt->TOOL_NAME_ENTER_PLAN_MODE,
//          RIY->buildEnterPlanModeDescription, E8q->renderEnterPlanModeResult,
//          y8q->renderEnterPlanModeRejected
```

### Prompt/Description Generator (RIY)

**What it does:** Generates the tool description that the LLM sees in its tool definitions. The description dynamically adjusts based on whether the interview phase feature flag is enabled.

**How it works:**
1. Builds the base description explaining that EnterPlanMode switches to read-only planning.
2. Checks `rO()` (isPlanModeInterviewPhase) feature flag.
3. If interview phase is OFF: appends the "What Happens in Plan Mode" section describing the 5-phase workflow.
4. If interview phase is ON: omits that section, since the iterative workflow replaces it.

**Why this approach:** The tool description is part of the LLM's prompt context. By conditionally including workflow details, the system avoids confusing the LLM with instructions for a workflow variant that is not active.

```javascript
// ============================================
// buildEnterPlanModeDescription - Dynamic prompt for EnterPlanMode
// Location: chunks.144.mjs:1416
// ============================================

// ORIGINAL (for source lookup):
function RIY() {
  let A = `Tool to enter plan mode...`;
  if (!rO()) {
    A += UCY;  // "What Happens in Plan Mode" section
  }
  return A;
}

// READABLE (for understanding):
function buildEnterPlanModeDescription() {
  let description = `Tool to enter plan mode. In plan mode, you explore the codebase
    and create a detailed implementation plan without making changes...`;
  if (!isPlanModeInterviewPhase()) {
    description += standardPlanModeWorkflowText;  // 5-phase workflow description
  }
  return description;
}

// Mapping: RIY->buildEnterPlanModeDescription, rO->isPlanModeInterviewPhase,
//          UCY->standardPlanModeWorkflowText
```

### call() Handler

**What it does:** Executes when the LLM calls the EnterPlanMode tool. Transitions the session into plan mode.

**How it works:**
1. Checks if executing in an agent (subagent) context -- if so, throws an error. Plan mode is only available at the top-level conversation.
2. Calls `Dp(currentMode, "plan")` to handle the low-level flag management (clearing needsPlanModeExitAttachment).
3. Calls `setAppState` with `LT6()` to save the current mode as prePlanMode, then sets mode to "plan".
4. Returns a result indicating successful entry.

**Why this approach:** The agent context check prevents subagents from entering plan mode, which would create an inconsistent state -- subagents have their own tool restrictions and should not alter the top-level conversation mode. The two-step state update (flags first via Dp, then mode via setAppState) ensures the attachment system is in a clean state before the mode change takes effect.

**Key insight:** The `isReadOnly: () => true` property means the tool itself passes plan mode's own read-only filter. EnterPlanMode can be called even while already in plan mode (it is a no-op in that case since LT6 returns early if mode is already "plan").

```javascript
// ============================================
// EnterPlanModeTool.call - Entry handler
// Location: chunks.144.mjs:1620
// ============================================

// ORIGINAL (for source lookup):
async function(A, Q) {
  if (Q.isAgentContext) {
    throw new Error("EnterPlanMode cannot be used in agent context");
  }
  Dp(Q.currentMode, "plan");
  Q.setAppState(B => ({
    ...B,
    ...LT6(Q.currentMode),
    toolPermissionContext: {
      ...B.toolPermissionContext,
      mode: "plan"
    }
  }));
  return { result: "entered_plan_mode" };
}

// READABLE (for understanding):
async function enterPlanModeCall(input, context) {
  // Subagents cannot enter plan mode
  if (context.isAgentContext) {
    throw new Error("EnterPlanMode cannot be used in agent context");
  }

  // Step 1: Handle low-level flag management
  handlePlanModeTransition(context.currentMode, "plan");

  // Step 2: Save pre-plan mode and set mode to "plan"
  context.setAppState(prevState => ({
    ...prevState,
    ...savePrePlanMode(context.currentMode),
    toolPermissionContext: {
      ...prevState.toolPermissionContext,
      mode: "plan"
    }
  }));

  return { result: "entered_plan_mode" };
}

// Mapping: A->input, Q->context, Dp->handlePlanModeTransition,
//          LT6->savePrePlanMode
```

### mapToolResultToToolResultBlockParam

**What it does:** Transforms the tool result into the content block that gets sent back to the LLM as the tool's output. This is what the LLM "sees" after calling EnterPlanMode.

**How it works:**
1. Checks the interview phase flag (`rO()`).
2. If interview phase ON: returns instructions for the iterative pair-planning workflow (ask questions first).
3. If interview phase OFF: returns instructions for the standard 5-phase workflow.

**Why this approach:** The post-call instructions prime the LLM for the correct workflow variant immediately after entering plan mode, before any system reminders are injected.

```javascript
// ============================================
// EnterPlanModeTool.mapToolResultToToolResultBlockParam - Result mapper
// Location: chunks.144.mjs:1634
// ============================================

// ORIGINAL (for source lookup):
function(A) {
  if (rO()) {
    return [{ type: "text", text: "Entered plan mode. Begin by asking the user..." }];
  }
  return [{ type: "text", text: "Entered plan mode. Follow the 5-phase workflow..." }];
}

// READABLE (for understanding):
function mapEnterPlanModeResult(result) {
  if (isPlanModeInterviewPhase()) {
    return [{ type: "text", text: "Entered plan mode. Begin by asking the user clarifying questions about their task..." }];
  }
  return [{ type: "text", text: "Entered plan mode. Follow the 5-phase planning workflow: Understand, Design, Review, Final Plan, ExitPlanMode..." }];
}

// Mapping: A->result, rO->isPlanModeInterviewPhase
```

---

## C. ExitPlanMode Tool

### Overview

The ExitPlanMode tool (`zD`, chunks.143.mjs:2802) is the most complex part of plan mode. It handles two fundamentally different paths: the **teammate path** (sending a plan approval request to the team lead) and the **main agent path** (restoring the previous mode directly). It also manages auto mode gate checks and ultraplan mapping.

### Tool Object Structure

```javascript
// ============================================
// ExitPlanModeTool - Plan mode exit tool object
// Location: chunks.143.mjs:2802
// ============================================

// ORIGINAL (for source lookup):
const zD = {
  name: aJ,  // "ExitPlanMode"
  description: Z1q,
  inputSchema: { /* plan summary schema */ },
  validateInput: function(A) { /* ... */ },
  checkPermissions: function(A, Q) { /* ... */ },
  call: async function(A, Q) { /* ... */ },
  renderToolResult: T1q
};

// READABLE (for understanding):
const ExitPlanModeTool = {
  name: TOOL_NAME_EXIT_PLAN_MODE,  // "ExitPlanMode"
  description: exitPlanModePromptString,
  inputSchema: { /* plan summary schema */ },
  validateInput: function(input) { /* see below */ },
  checkPermissions: function(input, context) { /* see below */ },
  call: async function(input, context) { /* see below */ },
  renderToolResult: renderExitPlanModeResult
};

// Mapping: zD->ExitPlanModeTool, aJ->TOOL_NAME_EXIT_PLAN_MODE,
//          Z1q->exitPlanModePromptString, T1q->renderExitPlanModeResult
```

### validateInput

**What it does:** Validates that ExitPlanMode is called in a valid context. Specifically, it checks that the session is actually in plan mode (unless the caller is a teammate, which has different rules).

**How it works:**
1. If the caller is a teammate (`$Y()` returns true): always valid. Teammates have their own approval workflow.
2. If the session is NOT in plan mode: return an error with telemetry reporting. This prevents the LLM from calling ExitPlanMode when not in plan mode.

**Why this approach:** Teammates operate asynchronously and may have stale mode information. Allowing them to always call ExitPlanMode avoids race conditions in the team collaboration flow. For the main agent, the validation prevents wasted LLM turns on invalid tool calls.

```javascript
// ============================================
// ExitPlanModeTool.validateInput - Input validation
// Location: chunks.143.mjs:2833
// ============================================

// ORIGINAL (for source lookup):
function(A) {
  if ($Y()) return { valid: !0 };
  if (A.context.mode !== "plan") {
    // telemetry report
    return { valid: !1, error: "Not in plan mode" };
  }
  return { valid: !0 };
}

// READABLE (for understanding):
function validateExitPlanModeInput(input) {
  // Teammates always valid -- they use the approval workflow
  if (isTeammate()) return { valid: true };

  // Main agent: must be in plan mode
  if (input.context.mode !== "plan") {
    reportTelemetry("exit_plan_mode_not_in_plan");
    return { valid: false, error: "Not in plan mode" };
  }
  return { valid: true };
}

// Mapping: A->input, $Y->isTeammate
```

### checkPermissions

**What it does:** Determines the permission behavior for ExitPlanMode. Teammates are allowed without prompt; other agents require user confirmation.

**How it works:**
1. If teammate: return `{ behavior: "allow" }` -- no user prompt needed.
2. Otherwise: return `{ behavior: "ask", message: "Exit plan mode?" }` -- the UI shows a confirmation dialog.

**Why this approach:** Teammates need to exit plan mode as part of their automated workflow. Prompting the team lead would block the teammate's execution. For the main agent, the confirmation dialog is the critical approval step -- it is where the user reviews the plan and decides whether to proceed.

```javascript
// ============================================
// ExitPlanModeTool.checkPermissions - Permission check
// Location: chunks.143.mjs:2847
// ============================================

// ORIGINAL (for source lookup):
function(A, Q) {
  if ($Y()) return { behavior: "allow" };
  return { behavior: "ask", message: "Exit plan mode?" };
}

// READABLE (for understanding):
function checkExitPlanModePermissions(input, context) {
  if (isTeammate()) return { behavior: "allow" };
  return { behavior: "ask", message: "Exit plan mode?" };
}

// Mapping: A->input, Q->context, $Y->isTeammate
```

### call() Handler - Teammate Path

**What it does:** When a teammate agent calls ExitPlanMode, it does NOT directly exit plan mode. Instead, it sends a plan approval request to the team lead's mailbox and waits for approval.

**How it works:**
1. Guard: checks both `$Y()` (isTeammate) AND `NF6()` (isTeammateFeatureEnabled). Both must be true to enter the teammate path.
2. If no plan file exists (`!z`), throws an Error (not a return) -- the plan file is required.
3. Gets the agent name via `i3()` and the leader session ID via `l5()`.
4. Generates a `requestId` via `bZ6("plan_approval", ak(agentName, leaderSessionId))`.
5. Builds a `plan_approval_request` message with fields: `type`, `from`, `timestamp`, `planFilePath`, `planContent`, `requestId`.
6. Writes a message envelope to the team-lead's mailbox via `x3("team-lead", { from, text: B6(message), timestamp }, leaderSessionId)`. The `B6()` function serializes the message object.
7. Looks up the task ID via `ik1(agentName, appState)`, then calls `ag8(taskId, context.setAppState, true)` to mark the task as awaiting plan approval. Note: `ag8` takes three arguments (taskId, setAppState, boolean), not just taskId.
8. Returns `{ data: { plan, isAgent: true, filePath, awaitingLeaderApproval: true, requestId } }`.

**Why this approach:** In a multi-agent team, teammates cannot unilaterally exit plan mode because the team lead needs to review and approve the plan. This asynchronous mailbox pattern decouples the teammate's execution from the leader's review. The `requestId` enables correlation between the request and the leader's eventual approval/rejection response.

**Key insight:** The teammate never actually exits plan mode in this call. The actual mode transition happens later when the team lead sends an approval response, which is processed by the SendMessage tool handlers (`_xY`/`wxY`). Also, the plan file is REQUIRED -- a missing plan throws an Error, not a graceful return.

```javascript
// ============================================
// ExitPlanModeTool.call (teammate path) - Send approval request
// Location: chunks.143.mjs:2875
// ============================================

// ORIGINAL (for source lookup):
async call(A, q) {
    let K = !!q.agentId,
        Y = Fj(q.agentId),
        z = sJ(q.agentId);
    if ($Y() && NF6()) {
        if (!z) throw Error(`No plan file found at ${Y}. Please write your plan to this file before calling ExitPlanMode.`);
        let H = i3() || "unknown",
            j = l5(),
            J = bZ6("plan_approval", ak(H, j || "default")),
            M = {
                type: "plan_approval_request",
                from: H,
                timestamp: new Date().toISOString(),
                planFilePath: Y,
                planContent: z,
                requestId: J
            };
        await x3("team-lead", {
            from: H,
            text: B6(M),
            timestamp: new Date().toISOString()
        }, j);
        let D = q.getAppState(),
            X = ik1(H, D);
        if (X) ag8(X, q.setAppState, !0);
        return {
            data: {
                plan: z,
                isAgent: !0,
                filePath: Y,
                awaitingLeaderApproval: !0,
                requestId: J
            }
        }
    }
    // ... main agent path follows
}

// READABLE (for understanding):
async function exitPlanModeCall_teammatePath(input, context) {
    let isAgent = !!context.agentId;
    let planFilePath = getPlanFilePath(context.agentId);
    let planContent = getPlanContent(context.agentId);

    if (isTeammate() && isTeammateFeatureEnabled()) {
        // Plan file is REQUIRED -- throw if missing
        if (!planContent) throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);

        let agentName = getAgentName() || "unknown";
        let leaderSessionId = getLeaderSessionId();
        let requestId = generateRequestId("plan_approval", makeKey(agentName, leaderSessionId || "default"));

        // Build approval request payload
        let approvalRequest = {
            type: "plan_approval_request",
            from: agentName,
            timestamp: new Date().toISOString(),
            planFilePath: planFilePath,
            planContent: planContent,
            requestId: requestId
        };

        // Send message envelope to team-lead mailbox
        await writeToMailbox("team-lead", {
            from: agentName,
            text: serializeMessage(approvalRequest),   // B6
            timestamp: new Date().toISOString()
        }, leaderSessionId);

        // Look up task ID and mark as awaiting approval
        let appState = context.getAppState();
        let taskId = findTaskIdByAgentName(agentName, appState);  // ik1
        if (taskId) setAwaitingPlanApproval(taskId, context.setAppState, true);  // ag8

        return {
            data: {
                plan: planContent,
                isAgent: true,
                filePath: planFilePath,
                awaitingLeaderApproval: true,
                requestId: requestId
            }
        };
    }
}

// Mapping: A->input, q->context, K->isAgent, Y->planFilePath, z->planContent,
//          $Y->isTeammate, NF6->isTeammateFeatureEnabled, i3->getAgentName,
//          l5->getLeaderSessionId, bZ6->generateRequestId, ak->makeKey,
//          B6->serializeMessage, x3->writeToMailbox, ik1->findTaskIdByAgentName,
//          ag8->setAwaitingPlanApproval, sJ->getPlanContent, Fj->getPlanFilePath
```

### call() Handler - Main Agent Path

**What it does:** When the main (non-teammate) agent calls ExitPlanMode after user approval, this path restores the session to its pre-plan mode state.

**How it works:**
1. Read the full app state and check if prePlanMode was "ultraplan" (saved as a boolean `isUltraplan` for the return value).
2. **Auto mode gate check (notification):** In a separate block, reads `prePlanMode` (defaulting to "default"), maps ultraplan to "default", then checks if the resolved mode is "auto" but the gate is off via `sl6?.isAutoModeGateEnabled()`. If so, builds a notification string with the unavailability reason and logs a warning. If a notification was generated, calls `context.addNotification()` to show a warning to the user.
3. **setAppState callback:** Uses a CALLBACK function (not a direct object). Inside the callback:
   - **Mode guard:** `if (H.toolPermissionContext.mode !== "plan") return H;` -- if mode has already changed (race condition), returns state unchanged.
   - Calls `HV(true)` and `JS(true)` as function calls inside the callback (not state properties).
   - Reads `prePlanMode` again from the current state, maps ultraplan to "default".
   - Checks auto mode gate again inside the callback for consistency.
   - Calls `tCY?.setAutoModeActive(isAutoMode)` to sync the auto mode active state.
   - If prePlanMode was "auto" but resolved mode is not "auto", calls `MS(true)` to notify of the fallback.
   - For non-auto modes, calls `sl6?.restoreDangerousPermissions(H.toolPermissionContext)` which returns a full context object (not just permissions).
   - Returns new state with the restored toolPermissionContext, mode set, and prePlanMode cleared.
4. Checks if the Task tool is available via `E7()` and `context.options.tools.some(...)`.
5. Returns `{ data: { plan, isAgent, filePath, hasTaskTool, isUltraplan } }`.

**Why this approach:** The multi-step restoration handles several edge cases:
- **Ultraplan**: A special plan variant that should not persist as a mode.
- **Auto mode gate**: The gate could have been disabled while the user was in plan mode. Restoring to "auto" when the gate is off would be invalid. The check is done TWICE -- once for the notification (outside callback) and once for the actual state change (inside callback) -- to handle race conditions.
- **Dangerous permissions**: Plan mode suppresses dangerous permissions. On exit, `sl6?.restoreDangerousPermissions()` returns the full restored toolPermissionContext, not just the permissions field.
- **Mode guard**: The `if (mode !== "plan") return H` check inside the callback prevents double-exit if something else changed the mode between the outer check and the callback execution.

**Key insight:** The `HV(true)` and `JS(true)` calls (setHasExitedPlanMode, setNeedsPlanModeExitAttachment) are function calls executed INSIDE the setAppState callback, not state properties merged into the object. They set global state flags as side effects. The `sl6?.restoreDangerousPermissions()` call returns a complete `toolPermissionContext` object that gets spread into the new state.

```javascript
// ============================================
// ExitPlanModeTool.call (main agent path) - Restore mode
// Location: chunks.143.mjs:2910-2959
// ============================================

// ORIGINAL (for source lookup):
    let _ = q.getAppState(),
        w = _.toolPermissionContext.prePlanMode === "ultraplan",
        O = null;
    {
        let H = _.toolPermissionContext.prePlanMode ?? "default",
            j = H === "ultraplan" ? "default" : H;
        if ((j === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) {
            let M = sl6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
            O = sl6?.getAutoModeUnavailableNotification(M) ?? "auto mode unavailable", k(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${j} but gate is off (reason=${M}) — falling back to default on plan exit`, {
                level: "warn"
            })
        }
    }
    if (O) q.addNotification?.({
        key: "auto-mode-gate-plan-exit-fallback",
        text: `plan exit → default · ${O}`,
        priority: "immediate",
        color: "warning",
        timeoutMs: 1e4
    });
    q.setAppState((H) => {
        if (H.toolPermissionContext.mode !== "plan") return H;
        HV(!0), JS(!0);
        let j = H.toolPermissionContext.prePlanMode ?? "default",
            J = j === "ultraplan" ? "default" : j;
        {
            if ((J === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) J = "default";
            let X = J === "auto" || !1;
            if (tCY?.setAutoModeActive(X), j === "auto" && J !== "auto") MS(!0)
        }
        let M = J !== "auto" ? sl6?.restoreDangerousPermissions(H.toolPermissionContext) ?? H.toolPermissionContext : H.toolPermissionContext;
        return {
            ...H,
            toolPermissionContext: {
                ...M,
                mode: J,
                prePlanMode: void 0
            }
        }
    });
    let $ = E7() && q.options.tools.some((H) => z3(H, r4));
    return {
        data: {
            plan: z,
            isAgent: K,
            filePath: Y,
            hasTaskTool: $ || void 0,
            isUltraplan: w || void 0
        }
    }

// READABLE (for understanding):
async function exitPlanModeCall_mainPath(input, context) {
    let appState = context.getAppState();
    let isUltraplan = appState.toolPermissionContext.prePlanMode === "ultraplan";
    let notification = null;

    // Pre-check: auto mode gate for notification purposes
    {
        let savedPrePlanMode = appState.toolPermissionContext.prePlanMode ?? "default";
        let resolvedMode = savedPrePlanMode === "ultraplan" ? "default" : savedPrePlanMode;
        if (resolvedMode === "auto" && !(autoModeGate?.isAutoModeGateEnabled() ?? false)) {
            let reason = autoModeGate?.getAutoModeUnavailableReason() ?? "circuit-breaker";
            notification = autoModeGate?.getAutoModeUnavailableNotification(reason) ?? "auto mode unavailable";
            log(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${resolvedMode} but gate is off (reason=${reason}) — falling back to default on plan exit`, { level: "warn" });
        }
    }

    // Show notification if auto mode gate prevented restoration
    if (notification) context.addNotification?.({
        key: "auto-mode-gate-plan-exit-fallback",
        text: `plan exit → default · ${notification}`,
        priority: "immediate",
        color: "warning",
        timeoutMs: 10000
    });

    // State restoration via callback function
    context.setAppState((currentState) => {
        // Mode guard: if something already changed mode, no-op
        if (currentState.toolPermissionContext.mode !== "plan") return currentState;

        // Set global flags as side effects
        setHasExitedPlanMode(true);              // HV(!0)
        setNeedsPlanModeExitAttachment(true);    // JS(!0)

        let savedPrePlanMode = currentState.toolPermissionContext.prePlanMode ?? "default";
        let resolvedMode = savedPrePlanMode === "ultraplan" ? "default" : savedPrePlanMode;

        // Re-check auto mode gate inside callback (race condition safety)
        {
            if (resolvedMode === "auto" && !(autoModeGate?.isAutoModeGateEnabled() ?? false)) resolvedMode = "default";
            let isAutoMode = resolvedMode === "auto";
            autoModeController?.setAutoModeActive(isAutoMode);  // tCY
            // If was auto but falling back, notify
            if (savedPrePlanMode === "auto" && resolvedMode !== "auto") setAutoModeFallbackFlag(true);  // MS(!0)
        }

        // Restore dangerous permissions (returns full toolPermissionContext)
        let restoredContext = resolvedMode !== "auto"
            ? autoModeGate?.restoreDangerousPermissions(currentState.toolPermissionContext) ?? currentState.toolPermissionContext
            : currentState.toolPermissionContext;

        return {
            ...currentState,
            toolPermissionContext: {
                ...restoredContext,
                mode: resolvedMode,
                prePlanMode: undefined
            }
        };
    });

    // Check if Task tool is available
    let hasTaskTool = isTaskToolEnabled() && context.options.tools.some((t) => matchesTool(t, TaskToolName));

    return {
        data: {
            plan: planContent,
            isAgent: isAgent,
            filePath: planFilePath,
            hasTaskTool: hasTaskTool || undefined,
            isUltraplan: isUltraplan || undefined
        }
    };
}

// Mapping: A->input, q->context, K->isAgent, Y->planFilePath, z->planContent,
//          _->appState, w->isUltraplan, O->notification, H->currentState,
//          j->savedPrePlanMode, J->resolvedMode, M->restoredContext,
//          sl6->autoModeGate, tCY->autoModeController, HV->setHasExitedPlanMode,
//          JS->setNeedsPlanModeExitAttachment, MS->setAutoModeFallbackFlag,
//          E7->isTaskToolEnabled, z3->matchesTool, r4->TaskToolName,
//          k->log, $->hasTaskTool
```

---

## D. Plan File Management

### Overview

Plan files are Markdown documents stored at a predictable path derived from the session slug. The plan file is the primary artifact of plan mode -- it contains the implementation plan that the LLM writes during planning and that gets presented to the user for approval.

### getPlanFilePath (Fj)

**What it does:** Resolves the full filesystem path for the plan file associated with the current session.

**How it works:**
1. Gets the plan directory (typically `~/.claude/plans/`).
2. Gets the session slug via `bB()` (session slug generator).
3. If the caller is a teammate agent with an `agentId`: appends `-agent-<agentId>` to the filename to create agent-specific plan files.
4. Returns `<planDir>/<sessionSlug>.md` or `<planDir>/<sessionSlug>-agent-<agentId>.md`.

**Why this approach:** Agent-specific plan files prevent teammates from overwriting each other's plans in a multi-agent team. The session slug ties the plan to the current conversation, so plans from different sessions do not collide.

```javascript
// ============================================
// getPlanFilePath - Plan file path resolver
// Location: chunks.90.mjs:533
// ============================================

// ORIGINAL (for source lookup):
function Fj() {
  let A = getPlanDir();
  let Q = bB();
  let B = iM();  // getTeammateContext
  if (B?.agentId) {
    return `${A}/${Q}-agent-${B.agentId}.md`;
  }
  return `${A}/${Q}.md`;
}

// READABLE (for understanding):
function getPlanFilePath() {
  let planDir = getPlanDirectory();
  let sessionSlug = generateSessionSlug();
  let teammateCtx = getTeammateContext();

  // Teammates get agent-specific plan files
  if (teammateCtx?.agentId) {
    return `${planDir}/${sessionSlug}-agent-${teammateCtx.agentId}.md`;
  }
  return `${planDir}/${sessionSlug}.md`;
}

// Mapping: Fj->getPlanFilePath, A->planDir, Q->sessionSlug,
//          B->teammateCtx, bB->generateSessionSlug, iM->getTeammateContext
```

### getPlanContent (sJ)

**What it does:** Reads the plan file synchronously. Returns the file content as a string, or null if the file does not exist (ENOENT).

**How it works:**
1. Calls `Fj()` to get the plan file path.
2. Attempts `fs.readFileSync(path, "utf-8")`.
3. Catches ENOENT errors and returns null.
4. Re-throws any other filesystem errors.

**Why this approach:** Synchronous reading is used because this function is called in contexts where async is not practical (e.g., inside synchronous state checks). The null-on-ENOENT pattern allows callers to check "does a plan exist?" without try/catch boilerplate.

```javascript
// ============================================
// getPlanContent - Synchronous plan file reader
// Location: chunks.90.mjs:539
// ============================================

// ORIGINAL (for source lookup):
function sJ() {
  try {
    return fs.readFileSync(Fj(), "utf-8");
  } catch (A) {
    if (A.code === "ENOENT") return null;
    throw A;
  }
}

// READABLE (for understanding):
function getPlanContent() {
  try {
    return fs.readFileSync(getPlanFilePath(), "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") return null;  // No plan file yet
    throw error;  // Re-throw unexpected errors
  }
}

// Mapping: sJ->getPlanContent, Fj->getPlanFilePath, A->error
```

### Session Slug Generator (bB)

**What it does:** Generates a URL-safe slug from the session identifier, used to create unique plan file names per session.

**How it works:** Takes the session ID and transforms it into a filesystem-safe slug by lowercasing, replacing non-alphanumeric characters with hyphens, and truncating to a reasonable length.

```javascript
// ============================================
// generateSessionSlug - Session slug for plan file naming
// Location: chunks.90.mjs:~509
// ============================================

// ORIGINAL (for source lookup):
function bB() {
  let A = getSessionId();
  return A.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 64);
}

// READABLE (for understanding):
function generateSessionSlug() {
  let sessionId = getSessionId();
  return sessionId.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 64);
}

// Mapping: bB->generateSessionSlug, A->sessionId
```

---

## E. Mode Cycling

### Overview

Mode cycling allows users to rotate through available modes using Shift+Tab (or Meta+M on older Node versions). The keybinding is mapped to "chat:cycleMode" and calls through `lbq` which computes the next mode and applies the transition.

### cycleMode (W26)

**What it does:** Computes the next mode in the cycling sequence given the current mode.

**How it works:**
The cycle order is:
```
default -> acceptEdits -> plan -> [bypassPermissions ->] [auto ->] default
```

1. From "default": go to "acceptEdits".
2. From "acceptEdits": go to "plan".
3. From "plan": check if bypassPermissions is available; if yes, go there. Otherwise check auto mode availability (`cbq()`); if yes, go to "auto". Otherwise loop back to "default".
4. From "bypassPermissions": check auto mode; if available go to "auto", else back to "default".
5. From "auto": back to "default".

**Why this approach:** The cycling sequence prioritizes the most commonly used modes first (default, acceptEdits, plan) and puts the more powerful/dangerous modes (bypass, auto) later. The conditional inclusion of bypass and auto prevents cycling through unavailable modes.

**Key insight:** Not all modes are always available. Auto mode requires a feature gate (`cbq()` checks this). Bypass permissions may be disabled by policy. The cycle function dynamically skips unavailable modes, so users only cycle through what they can actually use.

```javascript
// ============================================
// cycleMode - Compute next mode in cycling sequence
// Location: chunks.191.mjs:3007
// ============================================

// ORIGINAL (for source lookup):
function W26(A) {
  switch (A) {
    case "default": return "acceptEdits";
    case "acceptEdits": return "plan";
    case "plan":
      if (bypassAvailable) return "bypassPermissions";
      if (cbq()) return "auto";
      return "default";
    case "bypassPermissions":
      if (cbq()) return "auto";
      return "default";
    case "auto": return "default";
    default: return "default";
  }
}

// READABLE (for understanding):
function cycleMode(currentMode) {
  switch (currentMode) {
    case "default": return "acceptEdits";
    case "acceptEdits": return "plan";
    case "plan":
      if (isBypassPermissionsAvailable()) return "bypassPermissions";
      if (isAutoModeAvailable()) return "auto";
      return "default";
    case "bypassPermissions":
      if (isAutoModeAvailable()) return "auto";
      return "default";
    case "auto": return "default";
    default: return "default";
  }
}

// Mapping: W26->cycleMode, A->currentMode, cbq->isAutoModeAvailable
```

### Auto Mode Availability Check (cbq)

**What it does:** Checks whether auto mode can be included in the mode cycle.

**How it works:** Returns true only if the auto mode feature gate is enabled AND the user has the necessary permissions/configuration for auto mode.

```javascript
// ============================================
// isAutoModeAvailable - Auto mode availability for cycling
// Location: chunks.191.mjs:3003
// ============================================

// ORIGINAL (for source lookup):
function cbq() {
  return sl6.gateEnabled && sl6.userEligible;
}

// READABLE (for understanding):
function isAutoModeAvailable() {
  return autoModeGate.gateEnabled && autoModeGate.userEligible;
}

// Mapping: cbq->isAutoModeAvailable, sl6->autoModeGate
```

### Mode Cycle Wrapper (lbq)

**What it does:** The actual keybinding handler. Computes the next mode via `W26` and then applies the transition via `ki()`.

```javascript
// ============================================
// applyCycleMode - Keybinding handler for mode cycling
// Location: chunks.191.mjs:3027
// ============================================

// ORIGINAL (for source lookup):
function lbq() {
  let A = getCurrentMode();
  let Q = W26(A);
  ki(A, Q);
}

// READABLE (for understanding):
function applyCycleMode() {
  let currentMode = getCurrentMode();
  let nextMode = cycleMode(currentMode);
  modeTransitionHandler(currentMode, nextMode);
}

// Mapping: lbq->applyCycleMode, A->currentMode, Q->nextMode,
//          W26->cycleMode, ki->modeTransitionHandler
```

### Mode Cycling Diagram

```
                        MODE CYCLING (Shift+Tab)
 ================================================================

  +----------+    +--------------+    +------+
  | default  |--->| acceptEdits  |--->| plan |---+
  +----------+    +--------------+    +------+   |
       ^                                         |
       |    +--------------------+               |
       +----| bypassPermissions  |<--(if avail)--+
       |    +--------------------+               |
       |              |                          |
       |    +------+  |                          |
       +----| auto |<-+(if avail)    (if neither)|
            +------+                     |       |
                                         +-------+
                                         |
                                         v
                                    back to default
```

---

## F. System Reminders

### Overview

Plan mode system reminders are injected into the conversation as "attachments" that the LLM sees alongside user messages. They enforce the planning workflow by instructing the LLM on what to do and what not to do. The reminder system has five variants, dispatched based on the current context.

### Reminder Dispatcher (Wzz)

**What it does:** Routes to the correct reminder variant based on the conversation context.

**How it works:**
1. If ultraplan-complete flag is set: use `Zzz` (immediately call ExitPlanMode).
2. If executing as a subagent: use `yzz` (brief, read-only instructions).
3. If sparse reminder mode (conversation has been going for a while): use `Ezz` (condensed).
4. Otherwise: use `Nzz` (full 5-phase workflow) or `kzz` (interview variant).

**Why this approach:** Token budget management. The full reminder is ~1500 tokens. Injecting that every turn would waste significant context. The sparse variant at ~150 tokens reduces overhead for long conversations where the LLM has already internalized the workflow. Subagents get a minimal variant because they have limited scope.

**Key insight:** The dispatcher uses a priority chain (ultraplan > subagent > sparse > full). This means a subagent in ultraplan-complete mode gets the ultraplan handler, not the subagent handler -- ultraplan-complete takes absolute priority because it requires immediate action.

```javascript
// ============================================
// planModeReminderDispatcher - Route to correct reminder variant
// Location: chunks.173.mjs:2525
// ============================================

// ORIGINAL (for source lookup):
function Wzz(A) {
    if (A.reminderType === "ultraplan-complete") return Zzz(A);
    if (A.isSubAgent) return yzz(A);
    if (A.reminderType === "sparse") return Ezz(A);
    return Nzz(A)
}

// READABLE (for understanding):
function planModeReminderDispatcher(attachmentContext) {
    if (attachmentContext.reminderType === "ultraplan-complete") return buildUltraplanCompleteReminder(attachmentContext);
    if (attachmentContext.isSubAgent) return buildSubagentPlanReminder(attachmentContext);
    if (attachmentContext.reminderType === "sparse") return buildSparsePlanReminder(attachmentContext);
    return buildFullPlanModeReminder(attachmentContext);
}

// Mapping: Wzz->planModeReminderDispatcher, A->attachmentContext,
//          Zzz->buildUltraplanCompleteReminder, yzz->buildSubagentPlanReminder,
//          Ezz->buildSparsePlanReminder, Nzz->buildFullPlanModeReminder
```

**Important correction:** The dispatcher uses `A.reminderType === "ultraplan-complete"` and `A.reminderType === "sparse"` (string comparisons on the `reminderType` field), NOT boolean flags like `A.ultraplanComplete` or `A.sparse`. The `reminderType` field is set by the attachment producer `DuY` to either `"full"`, `"sparse"`, or `"ultraplan-complete"`.

### Full Plan Mode Reminder (Nzz)

**What it does:** Generates the complete 5-phase workflow reminder (~1500 tokens) that instructs the LLM on how to conduct planning. This is the primary plan mode system prompt injected as an attachment.

**How it works:**
1. **Early exits:** If `A.isSubAgent` is true, returns `[]` (empty array -- subagents get no reminder from this function). If the interview feature flag `rO()` is true, delegates to `kzz(A)` (the iterative planning variant) and returns.
2. Gets plan agent count (`q` from `iJ7()`) and explore agent count (`K` from `nJ7()`).
3. Builds the reminder as a plain markdown string (NOT wrapped in `<plan-mode-instructions>` XML tags). The variable names in the source are `q` and `K`, not `Q` and `B`.
4. The content is structured in sections:
   - **Header:** "Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits..."
   - **Plan File Info:** Conditionally generated based on `A.planExists`. If a plan file exists, references it with the Edit tool name (`pX.name`). If not, references the Write tool name (`xX.name`).
   - **Phase 1 (Initial Understanding):** Use up to `K` Explore agents (`QB.agentType`) in parallel.
   - **Phase 2 (Design):** Launch `x01.agentType` agents (up to `q`). Includes conditional multi-agent guidance if `q > 1`.
   - **Phase 3 (Review):** Read critical files, ensure alignment, use AskUserQuestion (`Fw`).
   - **Phase 4:** Dynamically generated by `vzz()` which returns one of four variants (`Gzz`/`fzz`/`Tzz`/`XTq`) based on `Hz1()` returning "trim", "cut", "cap", or null.
   - **Phase 5:** Call ExitPlanMode (`zD.name`) to propose the plan.
5. Wraps the string in `b5([p1({ content: z, isMeta: true })])` to create the attachment array.

**Why this approach:** The 5-phase structure creates a systematic workflow that prevents the LLM from jumping straight to implementation. Each phase builds on the previous one. The explicit agent counts and agent type names are injected dynamically from configuration. Phase 4 is selected dynamically via `vzz()` to support different plan finalization strategies.

**Key insight:** The content is plain markdown text, not XML-wrapped. The `planExists` conditional in the Plan File Info section is important -- it tells the LLM whether to create a new plan file (Write tool) or edit an existing one (Edit tool). Phase 4 is NOT hardcoded but dynamically dispatched via `vzz()` based on the `Hz1()` configuration value.

```javascript
// ============================================
// buildFullPlanModeReminder - 5-phase workflow reminder (~1500 tokens)
// Location: chunks.173.mjs:2556
// ============================================

// ORIGINAL (for source lookup):
function Nzz(A) {
    if (A.isSubAgent) return [];
    if (rO()) return kzz(A);
    let q = iJ7(),
        K = nJ7(),
        z = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below)...

## Plan File Info:
${A.planExists?`A plan file already exists at ${A.planFilePath}. You can read it and make incremental edits using the ${pX.name} tool.`:`No plan file exists yet. You should create your plan at ${A.planFilePath} using the ${xX.name} tool.`}
You should build your plan incrementally by writing to or editing this file...

## Plan Workflow

### Phase 1: Initial Understanding
...Launch up to ${K} ${QB.agentType} agents IN PARALLEL...

### Phase 2: Design
Launch ${x01.agentType} agent(s)... up to ${q} agent(s) in parallel.
${q>1?`- **Multiple agents**: Use up to ${q} agents...`:""}

### Phase 3: Review
...Use ${Fw} to clarify any remaining questions...

${vzz()}

### Phase 5: Call ${zD.name}
...your turn should only end with either using the ${Fw} tool OR calling ${zD.name}...`;
    return b5([p1({
        content: z,
        isMeta: !0
    })])
}

// READABLE (for understanding):
function buildFullPlanModeReminder(attachmentContext) {
    // Subagents get no reminder from this function
    if (attachmentContext.isSubAgent) return [];
    // Interview mode delegates to iterative variant
    if (isPlanModeInterviewPhase()) return buildIterativePlanModeReminder(attachmentContext);

    let planDesignAgentCount = getPlanDesignAgentCount();   // q = iJ7()
    let exploreAgentCount = getPlanExploreAgentCount();     // K = nJ7()

    let reminderText = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits (with the exception of the plan file mentioned below), run any non-readonly tools, or otherwise make any changes to the system.

## Plan File Info:
${attachmentContext.planExists
    ? `A plan file already exists at ${attachmentContext.planFilePath}. You can read it and make incremental edits using the ${EditToolName} tool.`
    : `No plan file exists yet. You should create your plan at ${attachmentContext.planFilePath} using the ${WriteToolName} tool.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit.

## Plan Workflow

### Phase 1: Initial Understanding
Goal: Gain a comprehensive understanding of the user's request.
Launch up to ${exploreAgentCount} ${ExploreAgentType} agents IN PARALLEL to explore the codebase.

### Phase 2: Design
Launch ${PlanAgentType} agent(s) to design the implementation.
You can launch up to ${planDesignAgentCount} agent(s) in parallel.
${planDesignAgentCount > 1 ? `- **Multiple agents**: Use up to ${planDesignAgentCount} agents for complex tasks...` : ""}

### Phase 3: Review
Read critical files, ensure alignment with user's request.
Use ${AskUserQuestionToolName} to clarify any remaining questions.

${getPhase4Variant()}  // vzz() - dynamically selected: trim/cut/cap/default

### Phase 5: Call ${ExitPlanModeToolName}
Once you are happy with your final plan file - call ${ExitPlanModeToolName} to indicate you are done planning.
Your turn should only end with either using ${AskUserQuestionToolName} OR calling ${ExitPlanModeToolName}.`;

    return wrapAsAttachment([createContentBlock({
        content: reminderText,
        isMeta: true
    })]);
}

// Mapping: Nzz->buildFullPlanModeReminder, A->attachmentContext,
//          q->planDesignAgentCount, K->exploreAgentCount, z->reminderText,
//          iJ7->getPlanDesignAgentCount, nJ7->getPlanExploreAgentCount,
//          rO->isPlanModeInterviewPhase, kzz->buildIterativePlanModeReminder,
//          pX->EditTool (name), xX->WriteTool (name), QB->ExploreAgent (agentType),
//          x01->PlanAgent (agentType), Fw->AskUserQuestionToolName,
//          zD->ExitPlanModeTool (name), vzz->getPhase4Variant, Hz1->getPhase4Config,
//          b5->wrapAsAttachment, p1->createContentBlock
```

### Iterative Planning Reminder (kzz)

**What it does:** Generates the interview-style planning reminder that replaces the 5-phase workflow when the interview feature flag is enabled.

**How it works:**
1. Instead of a linear 5-phase workflow, describes a pair-planning loop.
2. The loop is: Explore -> Update plan -> Ask user -> repeat.
3. Encourages the LLM to ask clarifying questions via AskUserQuestion before creating a final plan.
4. Triggered when `rO()` (isPlanModeInterviewPhase) returns true.

**Why this approach:** The interview variant addresses a weakness of the 5-phase workflow: it assumes the user's initial request is complete. In practice, users often need to be asked clarifying questions. The iterative approach ensures the plan is based on a thorough understanding of requirements.

**Key insight:** The "Skip interview and plan immediately" option in AskUserQuestion allows experienced users to bypass the interview and go straight to planning, providing flexibility for users who already know exactly what they want.

```javascript
// ============================================
// buildIterativePlanModeReminder - Interview workflow variant
// Location: chunks.173.mjs:2637
// ============================================

// ORIGINAL (for source lookup):
function kzz(A) {
  return `<plan-mode-instructions>
You are in PLAN MODE (interview workflow).

## Pair-Planning Loop
1. Explore the codebase to understand current state
2. Update the plan file with findings
3. Ask the user clarifying questions via AskUserQuestion
4. Repeat until the plan is complete

## Rules
- Read-only operations only
- Write ONLY to plan file
- Ask questions before making assumptions
- When plan is ready, call ExitPlanMode
</plan-mode-instructions>`;
}

// READABLE (for understanding):
function buildIterativePlanModeReminder(context) {
  return `<plan-mode-instructions>
You are in PLAN MODE (interview workflow).

## Pair-Planning Loop
1. Explore the codebase to understand current state
2. Update the plan file with findings
3. Ask the user clarifying questions via AskUserQuestion
4. Repeat until the plan is complete

## Rules
- Read-only operations only
- Write ONLY to plan file
- Ask questions before making assumptions
- When plan is ready, call ExitPlanMode
</plan-mode-instructions>`;
}

// Mapping: kzz->buildIterativePlanModeReminder, A->context
```

### Sparse Reminder (Ezz)

**What it does:** A condensed version of the plan mode reminder (~150 tokens) for use after the full reminder has already been shown earlier in the conversation.

**How it works:** Contains only the essential reminders: "still in plan mode", "read-only only", "write to plan file only", "call ExitPlanMode when done". References the full instructions earlier in the conversation.

**Why this approach:** After several turns, the LLM has internalized the full workflow. Repeating 1500 tokens every turn wastes context. The sparse reminder keeps the LLM on track without the overhead.

```javascript
// ============================================
// buildSparsePlanReminder - Condensed reminder (~150 tokens)
// Location: chunks.173.mjs:2692
// ============================================

// ORIGINAL (for source lookup):
function Ezz(A) {
  return `<plan-mode-reminder>
Still in PLAN MODE. Read-only only. Write only to plan file.
Call ExitPlanMode when plan is complete.
(See full plan mode instructions earlier in conversation.)
</plan-mode-reminder>`;
}

// READABLE (for understanding):
function buildSparsePlanReminder(context) {
  return `<plan-mode-reminder>
Still in PLAN MODE. Read-only only. Write only to plan file.
Call ExitPlanMode when plan is complete.
(See full plan mode instructions earlier in conversation.)
</plan-mode-reminder>`;
}

// Mapping: Ezz->buildSparsePlanReminder, A->context
```

### Sub-Agent Reminder (yzz)

**What it does:** Brief plan mode reminder for subagents (~400 tokens). Subagents spawned during plan mode need to know they are read-only but do not need the full workflow instructions.

**How it works:** Includes read-only enforcement and plan file editing permissions. Does NOT include the 5-phase workflow because subagents execute specific tasks, not the full planning workflow.

```javascript
// ============================================
// buildSubagentPlanReminder - Brief subagent variant (~400 tokens)
// Location: chunks.173.mjs:2701
// ============================================

// ORIGINAL (for source lookup):
function yzz(A) {
  return `<plan-mode-reminder>
You are a subagent operating in PLAN MODE.
- Read-only operations only
- You may edit the plan file at: ${Fj()}
- Do NOT modify any other files
- Report findings to the parent agent
</plan-mode-reminder>`;
}

// READABLE (for understanding):
function buildSubagentPlanReminder(context) {
  return `<plan-mode-reminder>
You are a subagent operating in PLAN MODE.
- Read-only operations only
- You may edit the plan file at: ${getPlanFilePath()}
- Do NOT modify any other files
- Report findings to the parent agent
</plan-mode-reminder>`;
}

// Mapping: yzz->buildSubagentPlanReminder, A->context, Fj->getPlanFilePath
```

### Ultraplan-Complete Reminder (Zzz)

**What it does:** Minimal reminder (~150 tokens) that instructs the LLM to immediately call ExitPlanMode. Used when the ultraplan workflow has completed all planning phases and the only remaining action is to exit.

**How it works:** Contains a single instruction: "Call ExitPlanMode now." No workflow, no rules -- just the exit command.

**Why this approach:** Ultraplan is a variant where planning is done through a specialized subprocess. When the subprocess completes, the main agent's only job is to call the exit tool. Any additional instructions would be wasted tokens.

```javascript
// ============================================
// buildUltraplanCompleteReminder - Immediate exit instruction
// Location: chunks.173.mjs:2532
// ============================================

// ORIGINAL (for source lookup):
function Zzz(A) {
  return `<plan-mode-reminder>
Ultraplan is complete. Your ONLY action: call ExitPlanMode immediately.
Do not explore further. Do not modify the plan. Just exit.
</plan-mode-reminder>`;
}

// READABLE (for understanding):
function buildUltraplanCompleteReminder(context) {
  return `<plan-mode-reminder>
Ultraplan is complete. Your ONLY action: call ExitPlanMode immediately.
Do not explore further. Do not modify the plan. Just exit.
</plan-mode-reminder>`;
}

// Mapping: Zzz->buildUltraplanCompleteReminder, A->context
```

### Reminder Dispatch Flow

```
                     SYSTEM REMINDER DISPATCH
 ================================================================

 planModeReminderDispatcher(context)
     |
     +-- ultraplanComplete? --> Zzz: "Call ExitPlanMode now"
     |                                (~150 tokens)
     |
     +-- isSubAgent? ---------> yzz: "Read-only, edit plan file only"
     |                                (~400 tokens)
     |
     +-- sparse? -------------> Ezz: "Still in plan mode..."
     |                                (~150 tokens)
     |
     +-- interview phase? ----> kzz: "Pair-planning loop"
     |   (rO() === true)             (~800 tokens)
     |
     +-- default -------------> Nzz: "5-phase workflow"
                                      (~1500 tokens)
```

---

## G. Tool Filtering

### Overview

Plan mode enforces read-only behavior primarily through **system prompt instructions** rather than hard API-level tool filtering. The LLM is told not to use write tools, and the permission system catches violations. However, there are also hard restrictions for subagents.

### System Prompt Enforcement (Soft Filter)

The full plan mode reminder (`Nzz`) includes explicit instructions:
- "Do NOT write files, edit files, or run commands that modify state"
- "Read-only operations only"
- "Write ONLY to the plan file"

This is a **soft filter** -- the tools are still technically available, but the LLM is instructed not to use them. If the LLM attempts a write operation, the permission system (`checkPermissions`) will catch it.

### Plan Subagent Hard Filter

The built-in Plan subagent (`x01` in chunks.93.mjs:1938) uses a `disallowedTools` list to enforce hard tool restrictions:

```javascript
// ============================================
// Plan subagent disallowedTools - Hard tool restriction
// Location: chunks.93.mjs:1938
// ============================================

// ORIGINAL (for source lookup):
const x01 = {
  disallowedTools: [r4, Uk, R4, _K, bJ]
};

// READABLE (for understanding):
const planSubagentConfig = {
  disallowedTools: [
    TaskToolName,          // "Task" (r4) -- no task management in planning
    TOOL_NAME_EXIT_PLAN_MODE,  // "ExitPlanMode" (Uk) -- subagent cannot exit plan
    WriteToolName,         // "Write" (R4) -- no file writes
    EditToolName,          // "Edit" (_K) -- no file edits
    BashToolName           // "Bash" (bJ) -- no shell commands
  ]
};

// Mapping: x01->planSubagentConfig, r4->TaskToolName, Uk->TOOL_NAME_EXIT_PLAN_MODE,
//          R4->WriteToolName, _K->EditToolName, bJ->BashToolName
```

**Why this approach:** The soft filter (system prompt) works well for the main agent because the LLM is highly instruction-following and the permission system provides a safety net. Subagents, however, operate with less context and may not follow instructions as reliably, so a hard filter (disallowedTools) is used.

**Key insight:** The Write/Edit tools are NOT in the main agent's disallowed list because the agent needs them to write to the plan file. Instead, the permission system (`N51`/`Xz6`) checks the file path -- if it matches the plan file path, the write is allowed; otherwise, it is blocked.

### Write/Edit Path Restriction

```javascript
// ============================================
// checkEditPermissions - Plan file bypass for Write/Edit
// Location: chunks.146.mjs (N51) / chunks.139.mjs (Xz6)
// ============================================

// ORIGINAL (for source lookup):
function N51(A) {
  if (A.mode === "plan" && A.filePath === Fj()) {
    return "allow";  // Short-circuit: plan file is always writable
  }
  // ... normal permission check
}

// READABLE (for understanding):
function checkEditPermissions(context) {
  // In plan mode, writing to the plan file is always allowed
  if (context.mode === "plan" && context.filePath === getPlanFilePath()) {
    return "allow";
  }
  // ... normal orchestrator mode permission check follows
}

// Mapping: N51->checkEditPermissions, A->context, Fj->getPlanFilePath
```

### Prompt Suggestion Blocking

```javascript
// ============================================
// promptSuggestionDisabled - Block suggestions in plan mode
// Location: chunks.148.mjs:2195
// ============================================

// ORIGINAL (for source lookup):
function pF8(A) {
  if (A.mode === "plan") return !0;
  // ...
}

// READABLE (for understanding):
function isPromptSuggestionDisabled(context) {
  if (context.mode === "plan") return true;  // No suggestions in plan mode
  // ...
}

// Mapping: pF8->isPromptSuggestionDisabled, A->context
```

---

## H. Interview Phase

### Overview

The interview phase is a feature-flag-gated alternative to the standard 5-phase planning workflow. When enabled, it replaces the linear workflow with an iterative pair-planning loop where the LLM asks clarifying questions before creating a plan.

### Feature Flag Check (rO)

**What it does:** Checks whether the interview phase is enabled via environment variable or feature flag.

**How it works:**
1. Checks environment variable `CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE`.
2. Checks feature flag `tengu_plan_mode_interview_phase`.
3. Returns true if either is set.

```javascript
// ============================================
// isPlanModeInterviewPhase - Feature flag check
// Location: chunks.50.mjs:2520
// ============================================

// ORIGINAL (for source lookup):
function rO() {
  return !!(process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE ||
            featureFlags.get("tengu_plan_mode_interview_phase"));
}

// READABLE (for understanding):
function isPlanModeInterviewPhase() {
  return !!(process.env.CLAUDE_CODE_PLAN_MODE_INTERVIEW_PHASE ||
            featureFlags.get("tengu_plan_mode_interview_phase"));
}

// Mapping: rO->isPlanModeInterviewPhase
```

### Impact on Other Components

When interview phase is enabled:

1. **EnterPlanMode prompt** (`RIY`): Omits the "What Happens in Plan Mode" section (standard 5-phase description).
2. **EnterPlanMode result** (`mapToolResultToToolResultBlockParam`): Returns interview-specific instructions instead of 5-phase instructions.
3. **System reminder**: Uses `kzz` (iterative pair-planning) instead of `Nzz` (5-phase).
4. **AskUserQuestion**: Includes "Skip interview and plan immediately" as an option, allowing users to bypass the interview.

### Interview vs Standard Workflow Comparison

```
 STANDARD (5-PHASE)                    INTERVIEW (ITERATIVE)
 ==================                    =====================

 Phase 1: Understand                   Loop:
   Use Explore agents                    1. Explore codebase
                                         2. Update plan file
 Phase 2: Design                         3. Ask user questions
   Use Plan agents                       4. Repeat until ready

 Phase 3: Review                       AskUserQuestion options:
   Validate plan                         - Answer questions
                                         - "Skip interview and
 Phase 4: Final Plan                       plan immediately"
   Write to plan file
                                       When ready:
 Phase 5: ExitPlanMode                   Call ExitPlanMode
   Propose to user
```

---

## I. Plan Approval in Teams

### Overview

When a teammate agent operates in plan mode and calls ExitPlanMode, it does not exit directly. Instead, it sends a `plan_approval_request` to the team lead's mailbox. The team lead reviews the plan and sends back a `plan_approval_response`. This creates an asynchronous approval workflow.

### Approval Request Flow

1. **Teammate calls ExitPlanMode**: The `call()` handler detects `$Y()` (isTeammate) and enters the teammate path.
2. **Plan content read**: `sJ()` reads the plan file. If no plan exists, returns early.
3. **Message sent**: `x3("team-lead", planApprovalRequest)` writes to the team lead's mailbox.
4. **Task marked**: `ag8(taskId)` sets awaitingPlanApproval on the task.
5. **Teammate waits**: Returns `{ awaitingLeaderApproval: true }`.

### Approval Response Handlers

The team lead's approval/rejection is handled in the SendMessage tool:

```javascript
// ============================================
// handlePlanApprovalApprove - Team lead approves plan
// Location: chunks.145.mjs:2521
// ============================================

// ORIGINAL (for source lookup):
function _xY(A) {
  k1q(A.taskId);  // Clear awaiting flag
  // Send plan_approval_response { approved: true } to teammate
  x3(A.agentName, { type: "plan_approval_response", approved: !0 });
}

// READABLE (for understanding):
function handlePlanApprovalApprove(context) {
  clearAwaitingPlanApproval(context.taskId);
  writeToMailbox(context.agentName, {
    type: "plan_approval_response",
    approved: true
  });
}

// Mapping: _xY->handlePlanApprovalApprove, A->context,
//          k1q->clearAwaitingPlanApproval, x3->writeToMailbox
```

```javascript
// ============================================
// handlePlanApprovalReject - Team lead rejects plan
// Location: chunks.145.mjs:2569
// ============================================

// ORIGINAL (for source lookup):
function wxY(A) {
  k1q(A.taskId);  // Clear awaiting flag
  // Send plan_approval_response { approved: false, feedback: ... }
  x3(A.agentName, { type: "plan_approval_response", approved: !1, feedback: A.feedback });
}

// READABLE (for understanding):
function handlePlanApprovalReject(context) {
  clearAwaitingPlanApproval(context.taskId);
  writeToMailbox(context.agentName, {
    type: "plan_approval_response",
    approved: false,
    feedback: context.feedback
  });
}

// Mapping: wxY->handlePlanApprovalReject, A->context,
//          k1q->clearAwaitingPlanApproval, x3->writeToMailbox
```

### Awaiting Approval State Management

```javascript
// ============================================
// setAwaitingPlanApproval - Mark task as awaiting approval
// Location: chunks.143.mjs:2708
// ============================================

// ORIGINAL (for source lookup):
function ag8(A) {
  // Set awaitingPlanApproval on the task identified by A
  updateTask(A, { awaitingPlanApproval: !0 });
}

// READABLE (for understanding):
function setAwaitingPlanApproval(taskId) {
  updateTask(taskId, { awaitingPlanApproval: true });
}

// Mapping: ag8->setAwaitingPlanApproval, A->taskId
```

```javascript
// ============================================
// clearAwaitingPlanApproval - Clear approval flag on task
// Location: chunks.143.mjs:2715
// ============================================

// ORIGINAL (for source lookup):
function k1q(A) {
  updateTask(A, { awaitingPlanApproval: !1 });
}

// READABLE (for understanding):
function clearAwaitingPlanApproval(taskId) {
  updateTask(taskId, { awaitingPlanApproval: false });
}

// Mapping: k1q->clearAwaitingPlanApproval, A->taskId
```

### Team Plan Approval Sequence

```
 TEAM PLAN APPROVAL FLOW
 ========================

 Teammate Agent              Mailbox System            Team Lead
 ===============              ==============            =========

 1. Calls ExitPlanMode
    (teammate path)
        |
 2. sJ() reads plan file
        |
 3. x3("team-lead",       ---> team-lead inbox
    { type: "plan_approval_
      request", ... })
        |
 4. ag8(taskId) marks
    task as awaiting
        |
 5. Returns                                    6. Reads inbox
    { awaitingLeader-                              Sees plan_approval_request
      Approval: true }                             |
        |                                      7. Shows UI (T1q renderer)
    [WAITING]                                      "Plan submitted for
        |                                           team lead approval"
        |                                          |
        |                                      8. Reviews plan content
        |                                          |
        |                   <--- teammate inbox 9. _xY() or wxY()
        |                        { type:           sends response
        |                          "plan_approval_
        |                           response",
        |                          approved: bool }
        |
 10. Receives response
     |
     +-- approved: exit plan mode
     +-- rejected: stay, revise plan
```

---

## J. UI Components

### Overview

Plan mode has dedicated React components for rendering tool results in the terminal UI. These components provide visual feedback about plan mode transitions.

### EnterPlanMode Result Renderer (E8q)

**What it does:** Renders the visual feedback when EnterPlanMode is successfully called. Shows "Entered plan mode" in the UI.

```javascript
// ============================================
// renderEnterPlanModeResult - "Entered plan mode" UI
// Location: chunks.144.mjs:1526
// ============================================

// ORIGINAL (for source lookup):
function E8q(A) {
  return React.createElement("Text", { color: "green" }, "Entered plan mode");
}

// READABLE (for understanding):
function renderEnterPlanModeResult(props) {
  return React.createElement("Text", { color: "green" }, "Entered plan mode");
}

// Mapping: E8q->renderEnterPlanModeResult, A->props
```

### EnterPlanMode Rejected Renderer (y8q)

**What it does:** Renders feedback when the user declines to enter plan mode (if a permission prompt was shown).

```javascript
// ============================================
// renderEnterPlanModeRejected - "User declined" UI
// Location: chunks.144.mjs:1541
// ============================================

// ORIGINAL (for source lookup):
function y8q(A) {
  return React.createElement("Text", { color: "yellow" }, "User declined to enter plan mode");
}

// READABLE (for understanding):
function renderEnterPlanModeRejected(props) {
  return React.createElement("Text", { color: "yellow" }, "User declined to enter plan mode");
}

// Mapping: y8q->renderEnterPlanModeRejected, A->props
```

### ExitPlanMode Result Renderer (T1q)

**What it does:** Renders the ExitPlanMode result with three distinct states based on the outcome.

**How it works:**
1. **No plan file**: Simple "Exited plan mode" text.
2. **Awaiting leader approval**: "Plan submitted for team lead approval" with plan preview.
3. **Approved/normal exit**: "User approved Claude's plan" with the plan content displayed.

**Why this approach:** The three states map to the three possible outcomes of calling ExitPlanMode: direct exit (no plan), team workflow (waiting for leader), and successful approval. Each state needs different visual treatment to communicate the status clearly.

```javascript
// ============================================
// renderExitPlanModeResult - Three-state exit renderer
// Location: chunks.143.mjs:2628
// ============================================

// ORIGINAL (for source lookup):
function T1q(A) {
  if (!A.planContent) {
    return React.createElement("Text", null, "Exited plan mode");
  }
  if (A.awaitingLeaderApproval) {
    return React.createElement("Box", { flexDirection: "column" },
      React.createElement("Text", { color: "cyan" },
        "Plan submitted for team lead approval"),
      React.createElement("Text", { dimColor: !0 },
        A.planContent.slice(0, 200) + "...")
    );
  }
  return React.createElement("Box", { flexDirection: "column" },
    React.createElement("Text", { color: "green" },
      "User approved Claude's plan"),
    React.createElement("Text", { dimColor: !0 },
      A.planContent.slice(0, 500))
  );
}

// READABLE (for understanding):
function renderExitPlanModeResult(props) {
  // State 1: No plan file was created
  if (!props.planContent) {
    return React.createElement("Text", null, "Exited plan mode");
  }

  // State 2: Teammate awaiting team lead approval
  if (props.awaitingLeaderApproval) {
    return React.createElement("Box", { flexDirection: "column" },
      React.createElement("Text", { color: "cyan" },
        "Plan submitted for team lead approval"),
      React.createElement("Text", { dimColor: true },
        props.planContent.slice(0, 200) + "...")  // Brief preview
    );
  }

  // State 3: Plan approved (main agent or post-approval)
  return React.createElement("Box", { flexDirection: "column" },
    React.createElement("Text", { color: "green" },
      "User approved Claude's plan"),
    React.createElement("Text", { dimColor: true },
      props.planContent.slice(0, 500))  // Longer preview
  );
}

// Mapping: T1q->renderExitPlanModeResult, A->props
```

---

## K. Compact Integration

### Overview

When conversation compaction occurs (to reduce token usage), plan mode state must be preserved so the LLM does not lose context about being in plan mode or the plan content.

### Preservation Mechanisms

1. **Plan file on disk**: The plan file (`Fj()`) is a filesystem artifact that survives compaction. The LLM can re-read it after compaction.

2. **needsPlanModeExitAttachment flag**: If plan mode was exited just before compaction, this flag ensures the exit attachment is injected after compaction completes.

3. **Plan mode attachment producer** (`DuY`, chunks.147.mjs:136): This function runs on every turn and checks if the session is in plan mode. If so, it produces one or more attachment objects. After compaction, it will produce the attachment again, re-establishing the planning context.

### Attachment Producer (DuY)

The plan mode attachment producer takes TWO parameters: `DuY(A, q)` where `A` is the messages array and `q` is the sessionContext. It returns an array of attachment objects (empty array `[]` when not in plan mode, NOT `null`).

```javascript
// ============================================
// getPlanModeAttachment - Attachment producer with turn throttling
// Location: chunks.147.mjs:136
// ============================================

// ORIGINAL (for source lookup):
async function DuY(A, q) {
    let Y = q.getAppState().toolPermissionContext;
    if (Y.mode !== "plan") return [];
    if (A && A.length > 0) {
        let {
            turnCount: H,
            foundPlanModeAttachment: j
        } = JuY(A);
        if (j && H < t4q.TURNS_BETWEEN_ATTACHMENTS) return []
    }
    let z = Fj(q.agentId),
        _ = sJ(q.agentId),
        w = [];
    if (Y.prePlanMode === "ultraplan") return w.push({
        type: "plan_mode",
        reminderType: "ultraplan-complete",
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w;
    if (nk6() && _ !== null) w.push({
        type: "plan_mode_reentry",
        planFilePath: z
    }), HV(!1);
    let $ = (MuY(A ?? []) + 1) % t4q.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1 ? "full" : "sparse";
    return w.push({
        type: "plan_mode",
        reminderType: $,
        isSubAgent: !!q.agentId,
        planFilePath: z,
        planExists: _ !== null
    }), w
}

// READABLE (for understanding):
async function getPlanModeAttachment(messages, sessionContext) {
    let toolPermCtx = sessionContext.getAppState().toolPermissionContext;

    // Not in plan mode: return empty array (not null)
    if (toolPermCtx.mode !== "plan") return [];

    // Turn throttling: skip if a recent plan_mode attachment exists
    if (messages && messages.length > 0) {
        let { turnCount, foundPlanModeAttachment } = scanForRecentAttachment(messages);  // JuY
        if (foundPlanModeAttachment && turnCount < PLAN_MODE_CONFIG.TURNS_BETWEEN_ATTACHMENTS) return [];
    }

    let planFilePath = getPlanFilePath(sessionContext.agentId);
    let planContent = getPlanContent(sessionContext.agentId);
    let attachments = [];

    // Ultraplan-complete: early return with special reminder type
    if (toolPermCtx.prePlanMode === "ultraplan") {
        attachments.push({
            type: "plan_mode",
            reminderType: "ultraplan-complete",
            isSubAgent: !!sessionContext.agentId,
            planFilePath: planFilePath,
            planExists: planContent !== null
        });
        return attachments;
    }

    // Plan mode reentry: inject plan_mode_reentry attachment if hasExitedPlanMode
    // and a plan file exists, then clear the flag via HV(false)
    if (getHasExitedPlanMode() && planContent !== null) {   // nk6()
        attachments.push({
            type: "plan_mode_reentry",
            planFilePath: planFilePath
        });
        setHasExitedPlanMode(false);   // HV(!1)
    }

    // Full/sparse decision via modulo counter
    let reminderType = (countPlanModeAttachments(messages ?? []) + 1)  // MuY
        % PLAN_MODE_CONFIG.FULL_REMINDER_EVERY_N_ATTACHMENTS === 1
        ? "full" : "sparse";

    attachments.push({
        type: "plan_mode",
        reminderType: reminderType,     // "full" or "sparse" string, NOT boolean
        isSubAgent: !!sessionContext.agentId,
        planFilePath: planFilePath,
        planExists: planContent !== null
    });
    return attachments;
}

// Mapping: DuY->getPlanModeAttachment, A->messages, q->sessionContext,
//          Y->toolPermCtx, JuY->scanForRecentAttachment,
//          t4q->PLAN_MODE_CONFIG, Fj->getPlanFilePath, sJ->getPlanContent,
//          nk6->getHasExitedPlanMode, HV->setHasExitedPlanMode,
//          MuY->countPlanModeAttachments
```

**How the attachment producer works (detailed):**

1. **Mode check:** Gets `toolPermissionContext` from `sessionContext.getAppState()`. If `mode !== "plan"`, returns `[]` (empty array).

2. **Turn throttling:** Calls `JuY(messages)` which scans messages to find the most recent `plan_mode` attachment and counts turns since then. If a recent attachment was found within the `TURNS_BETWEEN_ATTACHMENTS` threshold, returns `[]` to skip this turn.

3. **Ultraplan detection:** If `prePlanMode === "ultraplan"`, returns immediately with a single attachment having `reminderType: "ultraplan-complete"`. This ensures the LLM gets the "call ExitPlanMode now" instruction.

4. **Plan mode reentry:** If `nk6()` (getHasExitedPlanMode) is true AND a plan file exists, pushes a `plan_mode_reentry` attachment and clears the flag. This handles the case where the user re-enters plan mode after exiting.

5. **Full/sparse decision:** Uses a modulo counter: `(MuY(messages) + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS === 1`. When the counter hits the modulo boundary, uses `"full"`; otherwise `"sparse"`. The `reminderType` field is a string (`"full"` or `"sparse"`), NOT a boolean.

6. **Return:** Returns the array of attachments (may contain both `plan_mode_reentry` and `plan_mode` entries).

**Why this approach:** The modulo-based cycling between full and sparse reminders is more predictable than the previous description suggested. Every Nth attachment is "full" (~1500 tokens), and the rest are "sparse" (~150 tokens). After compaction, the counter resets because the message history is shorter, naturally triggering a full reminder when it is most needed.

### Post-Exit Attachment

```javascript
// ============================================
// getPlanModeExitAttachment - Injects plan content after exiting
// Location: chunks.147.mjs:170
// ============================================

// ORIGINAL (for source lookup):
async function XuY(A) {
  if (!Fu1()) return null;  // needsPlanModeExitAttachment
  JS(!1);  // Clear flag (one-shot)
  let Q = sJ();  // Read plan content
  if (!Q) return null;
  return { type: "plan_mode_exit", planContent: Q };
}

// READABLE (for understanding):
async function getPlanModeExitAttachment(context) {
  // Check if exit attachment is needed
  if (!getNeedsPlanModeExitAttachment()) return null;

  // Clear flag -- this is a one-shot attachment
  setNeedsPlanModeExitAttachment(false);

  // Read plan content to include in the attachment
  let planContent = getPlanContent();
  if (!planContent) return null;

  return { type: "plan_mode_exit", planContent: planContent };
}

// Mapping: XuY->getPlanModeExitAttachment, A->context,
//          Fu1->getNeedsPlanModeExitAttachment,
//          JS->setNeedsPlanModeExitAttachment, sJ->getPlanContent
```

**Key insight:** The exit attachment is a one-shot mechanism. The flag is cleared immediately after producing the attachment, so it only appears once. This injects the plan content into the first turn after exiting plan mode, giving the LLM the complete plan as context for implementation.

---

## Summary of Key Design Decisions

### 1. Soft vs Hard Tool Filtering

**Decision:** Use system prompt instructions (soft filter) for the main agent, hard `disallowedTools` for subagents.

**Rationale:** The main agent has full conversation context and follows instructions reliably. The permission system provides a safety net. Subagents have limited context and benefit from hard enforcement.

### 2. Save/Restore Mode Pattern

**Decision:** Save prePlanMode on entry, restore on exit.

**Rationale:** Plan mode is a temporary overlay. Users expect to return to their previous state (auto, acceptEdits, etc.) after planning.

### 3. Asynchronous Team Approval

**Decision:** Teammates send approval requests via mailbox rather than directly exiting plan mode.

**Rationale:** Team leads need to review plans before implementation. The mailbox pattern supports asynchronous collaboration without blocking teammate execution.

### 4. Turn-Throttled Reminders

**Decision:** Full reminder on first turn and after compaction; sparse reminders on subsequent turns.

**Rationale:** Balances instruction compliance (full reminder) with token efficiency (sparse for ongoing turns). Compaction recovery is automatic via the turn counter.

### 5. Interview Phase as Feature Flag

**Decision:** Interview workflow gated behind `tengu_plan_mode_interview_phase` flag.

**Rationale:** Allows A/B testing of the iterative interview approach vs the standard 5-phase workflow. Can be enabled per-user or per-environment.

---

## Cross-Module Integration Points

| Integration | Mechanism | Key Symbols |
|-------------|-----------|-------------|
| Plan Mode <-> System Reminders | Attachment producer + dispatcher | DuY, Wzz, Nzz, kzz, Ezz |
| Plan Mode <-> Permissions | Path-based bypass for plan file | N51, Xz6 |
| Plan Mode <-> Compact | Turn counter resets, exit flag persists | DuY, XuY, Fu1, JS |
| Plan Mode <-> Agent Teams | Mailbox approval workflow | ag8, k1q, _xY, wxY, x3 |
| Plan Mode <-> Auto Mode | Gate check on exit, state coordination | sl6, cbq, LT6, ki |
| Plan Mode <-> Subagents | Hard tool filtering, brief reminders | x01, yzz |
| Plan Mode <-> Mode Cycling | Shift+Tab includes plan in rotation | W26, lbq |
| Plan Mode <-> Feature Flags | Interview phase toggle | rO |
