# Plan Mode UI Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of plan mode UI components, state transitions, and user interaction flows.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions in this document:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `handlePlanModeTransition` (Dp) - Mode state hooks - chunks.1.mjs:2946

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PLAN MODE UI ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Entry Trigger                                                     │
│     ├─ User calls EnterPlanMode tool                                │
│     ├─ /plan slash command                                           │
│     └─ Agent spawned with planModeRequired: true                    │
│                                                                       │
│  ② Mode State Transition                                             │
│     ├─ Dp (handlePlanModeTransition) called                         │
│     ├─ prePlanMode = current mode saved                             │
│     └─ mode = "plan" set                                             │
│                                                                       │
│  ③ UI State Update                                                   │
│     ├─ Status line shows "⏸ Plan Mode on"                           │
│     ├─ Color theme changes to planMode (cyan)                       │
│     └─ Tool filtering applied                                        │
│                                                                       │
│  ④ Planning Workflow                                                 │
│     ├─ Read-only exploration                                         │
│     ├─ Write/Edit only to plan file                                  │
│     └─ AskUserQuestion for clarification                            │
│                                                                       │
│  ⑤ Exit Trigger                                                      │
│     ├─ User calls ExitPlanMode tool                                 │
│     ├─ Swarm approval request (teammate)                            │
│     └─ Approval dialog shown                                         │
│                                                                       │
│  ⑥ Approval Dialog                                                   │
│     ├─ "Ready to implement?" options                                 │
│     ├─ "Yes, let's implement" → exit                                │
│     ├─ "Let me refine" → stay in plan                               │
│     └─ "Cancel" → stay in plan                                       │
│                                                                       │
│  ⑦ Mode Exit                                                         │
│     ├─ mode restored from prePlanMode                               │
│     ├─ hasExitedPlanMode = true                                     │
│     └─ plan_mode_exit attachment generated                           │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## EnterPlanMode Tool (Ki6)

### Tool Definition

**What it does:**
Requests permission to enter plan mode for complex tasks requiring exploration and design. This is a read-only tool that sets the session mode to "plan".

**How it works:**
1. Validate that tool is not being used in agent contexts
2. Call handlePlanModeTransition with current mode and "plan"
3. Update app state with new mode
4. Return success message with planning instructions

```javascript
// ============================================
// Ki6 - EnterPlanModeTool
// Location: chunks.144.mjs:1579-1659
// ============================================

// ORIGINAL (for source lookup):
Ki6 = {
    name: dt,
    searchHint: "switch to plan mode to design an approach before coding",
    maxResultSizeChars: 1e5,
    async description() {
        return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
    },
    async prompt() {
        return v8q()
    },
    get inputSchema() {
        return hIY()
    },
    get outputSchema() {
        return SIY()
    },
    userFacingName() {
        return ""
    },
    shouldDefer: !0,
    isEnabled() {
        return !0
    },
    isConcurrencySafe() {
        return !0
    },
    isReadOnly() {
        return !0
    },
    toAutoClassifierInput() {
        return ""
    },
    async checkPermissions(A) {
        return {
            behavior: "allow",
            updatedInput: A
        }
    },
    renderToolUseMessage: V8q,
    renderToolUseProgressMessage: k8q,
    renderToolResultMessage: E8q,
    renderToolUseRejectedMessage: y8q,
    renderToolUseErrorMessage: L8q,
    async call(A, q) {
        if (q.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
        let K = q.getAppState();
        return Dp(K.toolPermissionContext.mode, "plan"), q.setAppState((Y) => ({
            ...Y,
            toolPermissionContext: Ez(LT6(Y.toolPermissionContext), {
                type: "setMode",
                mode: "plan",
                destination: "session"
            })
        })), {
            data: {
                message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
            }
        }
    },
    mapToolResultToToolResultBlockParam({
        message: A
    }, q) {
        return {
            type: "tool_result",
            content: rO() ? `${A}

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.` : `${A}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`,
            tool_use_id: q
        }
    }
}

// READABLE (for understanding):
const EnterPlanModeTool = {
    name: "EnterPlanMode",
    searchHint: "switch to plan mode to design an approach before coding",
    maxResultSizeChars: 100000,

    async description() {
        return "Requests permission to enter plan mode for complex tasks requiring exploration and design";
    },

    async prompt() {
        return getPlanModePrompt();
    },

    // Schema definitions
    get inputSchema() {
        return strictObjectSchema();  // Empty input
    },
    get outputSchema() {
        return objectSchema({
            message: stringSchema().describe("Confirmation that plan mode was entered")
        });
    },

    // Tool metadata
    userFacingName() {
        return "";  // No display name for UI
    },
    shouldDefer: true,  // Deferred tool discovery
    isEnabled() {
        return true;
    },
    isConcurrencySafe() {
        return true;  // Can run in parallel
    },
    isReadOnly() {
        return true;  // Doesn't modify files
    },
    toAutoClassifierInput() {
        return "";  // No input for classifier
    },

    // Permission handling
    async checkPermissions(input) {
        return {
            behavior: "allow",  // Always allowed
            updatedInput: input
        };
    },

    // UI rendering methods
    renderToolUseMessage: renderEnterPlanUse,
    renderToolUseProgressMessage: renderEnterPlanProgress,
    renderToolResultMessage: renderEnterPlanResult,
    renderToolUseRejectedMessage: renderEnterPlanRejected,
    renderToolUseErrorMessage: renderEnterPlanError,

    // Main execution
    async call(input, context) {
        // Validate: not allowed in agent contexts
        if (context.agentId) {
            throw Error("EnterPlanMode tool cannot be used in agent contexts");
        }

        const appState = context.getAppState();

        // Trigger mode transition hook
        handlePlanModeTransition(appState.toolPermissionContext.mode, "plan");

        // Update app state with new mode
        context.setAppState((state) => ({
            ...state,
            toolPermissionContext: setMode(
                saveCurrentMode(state.toolPermissionContext),
                {
                    type: "setMode",
                    mode: "plan",
                    destination: "session"
                }
            )
        }));

        return {
            data: {
                message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
            }
        };
    },

    // Result formatting
    mapToolResultToToolResultBlockParam({ message }, toolUseId) {
        const isSubAgent = isSubAgentContext();

        const content = isSubAgent
            ? `${message}\n\nDO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
            : `${message}\n\nIn plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`;

        return {
            type: "tool_result",
            content: content,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: Ki6→EnterPlanModeTool, dt→"EnterPlanMode", v8q→getPlanModePrompt,
//          hIY→strictObjectSchema, SIY→outputSchema, Dp→handlePlanModeTransition,
//          Ez→setMode, LT6→saveCurrentMode, rO→isSubAgentContext
```

---

## ExitPlanMode Tool (zD)

### Tool Definition

**What it does:**
Prompts the user to exit plan mode and start coding. Requires user approval before exiting plan mode.

**How it works:**
1. Validate that currently in plan mode
2. For swarm teammates, send plan_approval_request to team-lead
3. For solo mode, show approval dialog
4. On approval: restore mode from prePlanMode
5. On rejection: stay in plan mode

```javascript
// ============================================
// zD - ExitPlanModeTool
// Location: chunks.143.mjs:2802-2897
// ============================================

// ORIGINAL (for source lookup):
zD = {
    name: aJ,
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 1e5,
    async description() {
        return "Prompts the user to exit plan mode and start coding"
    },
    async prompt() {
        return Z1q
    },
    get inputSchema() {
        return E1q()
    },
    get outputSchema() {
        return AIY()
    },
    userFacingName() {
        return ""
    },
    shouldDefer: !0,
    isEnabled() {
        return !0
    },
    isConcurrencySafe() {
        return !0
    },
    isReadOnly() {
        return !1
    },
    toAutoClassifierInput() {
        return ""
    },
    requiresUserInteraction() {
        if ($Y()) return !1;
        return !0
    },
    async validateInput(A, {
        getAppState: q,
        options: K
    }) {
        if ($Y()) return {
            result: !0
        };
        let Y = q().toolPermissionContext.mode;
        if (Y !== "plan") return d("tengu_exit_plan_mode_called_outside_plan", {
            model: K.mainLoopModel,
            mode: Y,
            hasExitedPlanModeInSession: nk6()
        }), {
            result: !1,
            message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
            errorCode: 1
        };
        return {
            result: !0
        }
    },
    async checkPermissions(A, q) {
        if ($Y()) return {
            behavior: "allow",
            updatedInput: A
        };
        return {
            behavior: "ask",
            message: "Exit plan mode?",
            updatedInput: A
        }
    },
    // ... render methods ...
    async call(A, q) {
        let K = !!q.agentId,
            Y = Fj(q.agentId),
            z = sJ(q.agentId);
        if ($Y() && NF6()) {
            // Swarm teammate approval flow
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
                text: JSON.stringify(M),
                timestamp: new Date().toISOString()
            }, j);
            // ... await approval response ...
        }
        // ... exit plan mode logic ...
    }
}

// READABLE (for understanding):
const ExitPlanModeTool = {
    name: "ExitPlanMode",
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 100000,

    async description() {
        return "Prompts the user to exit plan mode and start coding";
    },

    // Schema definitions
    get inputSchema() {
        return exitPlanModeInputSchema();
    },
    get outputSchema() {
        return exitPlanModeOutputSchema();
    },

    // Tool metadata
    userFacingName() {
        return "";
    },
    shouldDefer: true,
    isEnabled() {
        return true;
    },
    isConcurrencySafe() {
        return true;
    },
    isReadOnly() {
        return false;  // Modifies mode state
    },
    toAutoClassifierInput() {
        return "";
    },

    // Requires user interaction (approval dialog)
    requiresUserInteraction() {
        if (isSwarmTeammate()) return false;  // Swarm handles approval
        return true;
    },

    // Input validation
    async validateInput(input, { getAppState, options }) {
        if (isSwarmTeammate()) {
            return { result: true };
        }

        const currentMode = getAppState().toolPermissionContext.mode;
        if (currentMode !== "plan") {
            emitTelemetry("tengu_exit_plan_mode_called_outside_plan", {
                model: options.mainLoopModel,
                mode: currentMode,
                hasExitedPlanModeInSession: hasExitedPlanModeInSession()
            });

            return {
                result: false,
                message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan.",
                errorCode: 1
            };
        }

        return { result: true };
    },

    // Permission check
    async checkPermissions(input, context) {
        if (isSwarmTeammate()) {
            return {
                behavior: "allow",
                updatedInput: input
            };
        }
        return {
            behavior: "ask",
            message: "Exit plan mode?",
            updatedInput: input
        };
    },

    // Main execution
    async call(input, context) {
        const isAgent = !!context.agentId;
        const planFilePath = getPlanFilePath(context.agentId);
        const planContent = readPlanFile(context.agentId);

        // Swarm teammate approval flow
        if (isSwarmTeammate() && isPlanModeRequired()) {
            if (!planContent) {
                throw Error(`No plan file found at ${planFilePath}. Please write your plan before calling ExitPlanMode.`);
            }

            const agentId = getAgentId() || "unknown";
            const teamName = getTeamName();
            const requestId = generateRequestId("plan_approval", `${agentId}-${teamName || "default"}`);

            const approvalRequest = {
                type: "plan_approval_request",
                from: agentId,
                timestamp: new Date().toISOString(),
                planFilePath: planFilePath,
                planContent: planContent,
                requestId: requestId
            };

            // Send to team-lead for approval
            await writeToMailbox("team-lead", {
                from: agentId,
                text: JSON.stringify(approvalRequest),
                timestamp: new Date().toISOString()
            }, teamName);

            // ... await approval response ...
        }

        // ... rest of exit logic ...
    }
};

// Mapping: zD→ExitPlanModeTool, aJ→"ExitPlanMode", $Y→isSwarmTeammate,
//          NF6→isPlanModeRequired, Fj→getPlanFilePath, sJ→readPlanFile,
//          i3→getAgentId, l5→getTeamName, bZ6→generateRequestId, x3→writeToMailbox
```

---

## Mode Transition Hook

### handlePlanModeTransition Function (Dp)

**What it does:**
Hook that fires when mode transitions occur. Specifically handles plan mode entry/exit to manage state flags.

```javascript
// ============================================
// Dp - handlePlanModeTransition
// Location: chunks.1.mjs:2946-2950
// ============================================

// ORIGINAL (for source lookup):
function Dp(A, q) {
    if (q === "plan" && A !== "plan") {
        // Entering plan mode: reset exit attachment flag
        globalState.needsPlanModeExitAttachment = !1;
    }
    if (A === "plan" && q !== "plan") {
        // Leaving plan mode: mark need for exit attachment
        globalState.needsPlanModeExitAttachment = !0;
    }
}

// READABLE (for understanding):
function handlePlanModeTransition(fromMode, toMode) {
    // Entering plan mode: reset exit attachment flag
    if (toMode === "plan" && fromMode !== "plan") {
        globalState.needsPlanModeExitAttachment = false;
    }

    // Leaving plan mode: mark need for exit attachment
    if (fromMode === "plan" && toMode !== "plan") {
        globalState.needsPlanModeExitAttachment = true;
    }
}

// Mapping: Dp→handlePlanModeTransition, A→fromMode, q→toMode
```

---

## UI Color Theme

### Plan Mode Colors

Plan mode uses a distinct cyan color theme to visually indicate the planning state:

```javascript
// ============================================
// Plan Mode Color Definitions
// Location: chunks.64.mjs
// ============================================

const planModeColors = {
    // Light theme
    light: {
        planMode: "rgb(0,102,102)"      // Dark cyan
    },

    // ANSI theme
    ansi: {
        planMode: "ansi:cyan"           // Cyan
    },

    // ANSI bright theme
    ansiBright: {
        planMode: "ansi:cyanBright"     // Bright cyan
    },

    // Dark theme variants
    dark: {
        planMode: "rgb(51,102,102)"     // Muted cyan
    },
    darkDimmed: {
        planMode: "rgb(72,150,140)"     // Dimmed teal
    },
    lightHighContrast: {
        planMode: "rgb(102,153,153)"    // Light slate
    }
};
```

---

## Status Line Display

### Plan Mode Status Text

When in plan mode, the status line displays a special indicator:

```javascript
// ============================================
// Plan Mode Status Line
// ============================================

const planModeStatusText = "⏸ Plan Mode on (shift+tab)";

// Status line component shows:
// - Plan mode indicator (⏸)
// - Current mode name
// - Shortcut hint for mode cycling
```

---

## Swarm Approval Flow

### Teammate Plan Approval Protocol

When a swarm teammate with `planModeRequired: true` calls ExitPlanMode:

```
Teammate                           Team Lead
   │                                    │
   ├─→ plan_approval_request ──────────►│
   │     {                              │
   │       type: "plan_approval_request",
   │       from: "agent-id",            │
   │       planFilePath: "...",         │
   │       planContent: "...",          │
   │       requestId: "..."             │
   │     }                              │
   │                                    ├─→ Show approval dialog
   │                                    │   "Approve teammate's plan?"
   │                                    │
   │◄──────── plan_approval_response ───┤
   │     {                              │
   │       approved: true/false,        │
   │       feedback: "..."              │
   │     }                              │
   │                                    │
   ├─→ If approved: Exit plan mode      │
   └─→ If rejected: Revise plan         │
```

---

## Cross-Module Integration

### Plan Mode ↔ System Reminder (04)

- `plan_mode` attachment injected each turn
- `plan_mode_reentry` for subsequent turns
- `plan_mode_exit` attachment on exit
- Plan file path included in attachments

### Plan Mode ↔ Tools (05)

- Tool filtering via `isReadOnly()` check
- Write/Edit path restriction to plan file
- ExitPlanMode as only programmatic exit

### Plan Mode ↔ UI (02)

- Status line shows plan mode indicator
- Color theme changes to cyan
- Mode cycling with Shift+Tab

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | /plan with description argument |
| 2.1.72 | Interview phase enhancements |
| 2.1.32 | Swarm teammate plan approval |
| 2.1.18 | Shift+Tab mode cycling |

---

## Symbol Validation Status

**Last validated:** 2026-03-27

| Symbol | Validated Location | Status |
|--------|-------------------|--------|
| Ki6 (EnterPlanModeTool) | chunks.144.mjs:1579 | ✅ Correct |
| zD (ExitPlanModeTool) | chunks.143.mjs:2802 | ✅ Correct |
| dt (TOOL_NAME_ENTER_PLAN_MODE) | chunks.90.mjs:3121 | ✅ Correct |
| aJ (TOOL_NAME_EXIT_PLAN_MODE) | chunks.90.mjs:507 | ✅ Correct |
| Dp (handlePlanModeTransition) | chunks.1.mjs:2946 | ✅ Correct |