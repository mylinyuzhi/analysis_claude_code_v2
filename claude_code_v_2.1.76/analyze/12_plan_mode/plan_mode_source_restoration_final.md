# Plan Mode Module - Complete Source Restoration Final (Claude Code 2.1.76)

> **Complete source-level restoration** of the Plan Mode system with cross-validated symbols and detailed algorithm analysis.
> **Final Version** - All symbols validated, complete tool implementations and swarm approval workflow.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions documented here:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `handlePlanModeTransition` (Dp) - Mode state hooks - chunks.1.mjs:2946
- `handlePlanApproval` (_xY) - Swarm approval - chunks.145.mjs:2521
- `handlePlanRejection` (wxY) - Swarm rejection - chunks.145.mjs:2547

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       PLAN MODE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① State Machine                                                     │
│     mode ∈ {"default", "plan", "acceptEdits", "delegate",           │
│              "bypassPermissions", "dontAsk"}                         │
│     + prePlanMode (saves mode before entering plan)                  │
│     + hasExitedPlanMode (exit flag)                                  │
│     + needsPlanModeExitAttachment (attachment pending)               │
│                                                                       │
│  ② Mode Entry (EnterPlanMode)                                        │
│     ├─ Save current mode → prePlanMode                               │
│     ├─ Set mode = "plan"                                             │
│     ├─ Initialize plan file path                                     │
│     └─ Generate plan_mode attachment                                 │
│                                                                       │
│  ③ Planning Workflow                                                  │
│     ├─ Phase 1: Initial Understanding (Explore agents)               │
│     ├─ Phase 2: Design (Plan agents)                                 │
│     ├─ Phase 3: Review                                               │
│     ├─ Phase 4: Final Plan (written to plan file)                    │
│     └─ Phase 5: ExitPlanMode                                         │
│                                                                       │
│  ④ Tool Restrictions                                                 │
│     ├─ Only read-only tools allowed                                  │
│     ├─ Write/Edit allowed only to plan file path                     │
│     └─ ExitPlanMode is the only programmatic exit                    │
│                                                                       │
│  ⑤ Mode Exit (ExitPlanMode)                                          │
│     ├─ User approval dialog ("Ready to code?")                       │
│     ├─ Restore mode from prePlanMode                                 │
│     ├─ Generate plan_mode_exit attachment                            │
│     └─ Clear conversation (optional for rejection)                   │
│                                                                       │
│  ⑥ Swarm Integration                                                 │
│     ├─ Teammate sends plan_approval_request to team-lead             │
│     ├─ Team-lead reviews and responds                                │
│     └─ plan_approval_response → teammate inbox                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. EnterPlanModeTool (Ki6) - Enter Plan Mode

### What it does

Requests permission to enter plan mode for complex tasks requiring exploration and design. Throws error if used in agent contexts.

### How it works

1. Validate not in agent context (agentId check)
2. Get current app state
3. Call `Dp` (handlePlanModeTransition) to update global flags
4. Set mode to "plan" via `Ez` (setMode)
5. Return success message with instructions

### Why this approach

- **Blocking in agent contexts** prevents nested plan mode confusion
- **Mode transition hooks** ensure proper state management
- **Structured output** provides clear next steps to LLM

```javascript
// ============================================
// EnterPlanModeTool - Enter plan mode for exploration
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
    name: TOOL_NAME_ENTER_PLAN_MODE,  // "EnterPlanMode"
    searchHint: "switch to plan mode to design an approach before coding",
    maxResultSizeChars: 100000,

    async description() {
        return "Requests permission to enter plan mode for complex tasks requiring exploration and design";
    },

    async prompt() {
        return getEnterPlanModePrompt();
    },

    get inputSchema() {
        return createEmptyInputSchema();
    },

    get outputSchema() {
        return createEnterPlanModeOutputSchema();
    },

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
        return true;
    },

    toAutoClassifierInput() {
        return "";
    },

    async checkPermissions(input) {
        // Always allow entering plan mode
        return {
            behavior: "allow",
            updatedInput: input
        };
    },

    // UI rendering functions
    renderToolUseMessage: renderEnterPlanModeUse,
    renderToolUseProgressMessage: renderEnterPlanModeProgress,
    renderToolResultMessage: renderEnterPlanModeResult,
    renderToolUseRejectedMessage: renderEnterPlanModeRejected,
    renderToolUseErrorMessage: renderEnterPlanModeError,

    async call(input, context) {
        // Block in agent contexts
        if (context.agentId) {
            throw Error("EnterPlanMode tool cannot be used in agent contexts");
        }

        const appState = context.getAppState();

        // Update global flags for mode transition
        handlePlanModeTransition(appState.toolPermissionContext.mode, "plan");

        // Set mode to "plan"
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

    mapToolResultToToolResultBlockParam({ message }, toolUseId) {
        const isSparseMode = isSparsePlanReminderEnabled();

        const content = isSparseMode
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
            content,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: Ki6→EnterPlanModeTool, dt→TOOL_NAME_ENTER_PLAN_MODE,
//          Dp→handlePlanModeTransition, Ez→setMode, LT6→saveCurrentMode,
//          v8q→getEnterPlanModePrompt, hIY→createEmptyInputSchema,
//          SIY→createEnterPlanModeOutputSchema, rO→isSparsePlanReminderEnabled
```

---

## 2. handlePlanModeTransition (Dp) - Mode Transition Hook

### What it does

Global state hook that manages flags during mode transitions. Specifically handles the `needsPlanModeExitAttachment` flag.

### How it works

1. If entering plan mode (to "plan", from non-"plan"): reset exit attachment flag
2. If leaving plan mode (from "plan", to non-"plan"): set exit attachment flag

### Why this approach

- **Global flag management** ensures proper attachment generation
- **Called from multiple places** (EnterPlanMode, ExitPlanMode) for consistency

```javascript
// ============================================
// handlePlanModeTransition - Manage mode transition flags
// Location: chunks.1.mjs:2946-2949
// ============================================

// ORIGINAL (for source lookup):
function Dp(A, q) {
    if (q === "plan" && A !== "plan") v1.needsPlanModeExitAttachment = !1;
    if (A === "plan" && q !== "plan") v1.needsPlanModeExitAttachment = !0
}

// READABLE (for understanding):
function handlePlanModeTransition(fromMode, toMode) {
    // Entering plan mode: reset exit attachment flag
    if (toMode === "plan" && fromMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = false;
    }

    // Leaving plan mode: mark need for exit attachment
    if (fromMode === "plan" && toMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = true;
    }
}

// Mapping: Dp→handlePlanModeTransition, A→fromMode, q→toMode,
//          v1→globalSessionState, v1.needsPlanModeExitAttachment→needsPlanModeExitAttachment
```

---

## 3. ExitPlanModeTool (zD) - Exit with Approval

### What it does

Prompts the user to exit plan mode and start coding. In swarm mode, sends plan approval request to team-lead.

### How it works

1. Validate currently in plan mode
2. If swarm teammate:
   - Send `plan_approval_request` to team-lead
   - Wait for response
   - Return awaiting approval status
3. If normal user:
   - Show approval dialog
   - Restore mode from prePlanMode
   - Generate exit attachment

### Key insight

The tool validates that you're actually in plan mode before allowing exit. If called outside plan mode, it returns an error with guidance.

```javascript
// ============================================
// ExitPlanModeTool - Exit plan mode with approval
// Location: chunks.143.mjs:2802-2949
// ============================================

// ORIGINAL (for source lookup) - Key sections:
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
    renderToolUseMessage: G1q,
    renderToolUseProgressMessage: f1q,
    renderToolResultMessage: T1q,
    renderToolUseRejectedMessage: v1q,
    renderToolUseErrorMessage: N1q,
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
        let _ = q.getAppState(),
            w = _.toolPermissionContext.prePlanMode === "ultraplan",
            O = null;
        {
            let H = _.toolPermissionContext.prePlanMode ?? "default",
                j = H === "ultraplan" ? "default" : H;
            if ((j === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) {
                let M = sl6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
                O = sl6?.getAutoModeUnavailableNotification(M) ?? "auto mode unavailable"
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
        // ... [continues with plan approval flow]
    }
}

// READABLE (for understanding):
const ExitPlanModeTool = {
    name: TOOL_NAME_EXIT_PLAN_MODE,  // "ExitPlanMode"
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 100000,

    async description() {
        return "Prompts the user to exit plan mode and start coding";
    },

    async prompt() {
        return getExitPlanModePrompt();
    },

    get inputSchema() {
        return createExitPlanModeInputSchema();
    },

    get outputSchema() {
        return createExitPlanModeOutputSchema();
    },

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
        return false;  // Modifies session state
    },

    toAutoClassifierInput() {
        return "";
    },

    requiresUserInteraction() {
        // No interaction needed in swarm mode
        if (isSwarmTeammate()) return false;
        return true;
    },

    async validateInput(input, { getAppState, options }) {
        // Skip validation in swarm mode
        if (isSwarmTeammate()) {
            return { result: true };
        }

        const currentMode = getAppState().toolPermissionContext.mode;

        // Must be in plan mode to exit
        if (currentMode !== "plan") {
            emitTelemetry("tengu_exit_plan_mode_called_outside_plan", {
                model: options.mainLoopModel,
                mode: currentMode,
                hasExitedPlanModeInSession: hasExitedPlanModeInSession()
            });

            return {
                result: false,
                message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
                errorCode: 1
            };
        }

        return { result: true };
    },

    async checkPermissions(input, context) {
        // Auto-allow in swarm mode
        if (isSwarmTeammate()) {
            return {
                behavior: "allow",
                updatedInput: input
            };
        }

        // Ask user in normal mode
        return {
            behavior: "ask",
            message: "Exit plan mode?",
            updatedInput: input
        };
    },

    // UI rendering functions
    renderToolUseMessage: renderExitPlanModeUse,
    renderToolUseProgressMessage: renderExitPlanModeProgress,
    renderToolResultMessage: renderExitPlanModeResult,
    renderToolUseRejectedMessage: renderExitPlanModeRejected,
    renderToolUseErrorMessage: renderExitPlanModeError,

    async call(input, context) {
        const isAgent = !!context.agentId;
        const planFilePath = getPlanFilePath(context.agentId);
        const planContent = readPlanFile(context.agentId);

        // === SWARM MODE: Send plan approval request to team-lead ===
        if (isSwarmTeammate() && isTeamModeEnabled()) {
            if (!planContent) {
                throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);
            }

            const teammateName = getTeammateName() || "unknown";
            const teamName = getSessionTeamName();
            const requestId = generateRequestId("plan_approval", hashString(teammateName, teamName || "default"));

            const approvalRequest = {
                type: "plan_approval_request",
                from: teammateName,
                timestamp: new Date().toISOString(),
                planFilePath,
                planContent,
                requestId
            };

            // Send to team-lead via mailbox
            await writeToMailbox("team-lead", {
                from: teammateName,
                text: JSON.stringify(approvalRequest),
                timestamp: new Date().toISOString()
            }, teamName);

            // Update UI state for awaiting approval
            const appState = context.getAppState();
            const pendingApproval = findPendingApproval(teammateName, appState);
            if (pendingApproval) {
                setAwaitingApproval(pendingApproval, context.setAppState, true);
            }

            return {
                data: {
                    plan: planContent,
                    isAgent: true,
                    filePath: planFilePath,
                    awaitingLeaderApproval: true,
                    requestId
                }
            };
        }

        // === NORMAL MODE: Restore mode and proceed ===
        const appState = context.getAppState();
        const isUltraplan = appState.toolPermissionContext.prePlanMode === "ultraplan";

        // Determine restored mode
        let restoredMode = appState.toolPermissionContext.prePlanMode ?? "default";
        if (restoredMode === "ultraplan") {
            restoredMode = "default";
        }

        // Handle auto-mode gate
        let autoModeNotification = null;
        if (restoredMode === "auto" && !isAutoModeGateEnabled()) {
            const reason = getAutoModeUnavailableReason() ?? "circuit-breaker";
            autoModeNotification = getAutoModeUnavailableNotification(reason);
            restoredMode = "default";
        }

        // Show notification if auto-mode was blocked
        if (autoModeNotification) {
            context.addNotification?.({
                key: "auto-mode-gate-plan-exit-fallback",
                text: `plan exit → default · ${autoModeNotification}`,
                priority: "immediate",
                color: "warning",
                timeoutMs: 10000
            });
        }

        // Update session state
        context.setAppState((state) => {
            if (state.toolPermissionContext.mode !== "plan") return state;

            // Set global flags
            setHasExitedPlanMode(true);
            setNeedsPlanModeExitAttachment(true);

            // Restore permissions
            const restoredPermissions = restoredMode !== "auto"
                ? restoreDangerousPermissions(state.toolPermissionContext) ?? state.toolPermissionContext
                : state.toolPermissionContext;

            return {
                ...state,
                toolPermissionContext: {
                    ...restoredPermissions,
                    mode: restoredMode,
                    prePlanMode: undefined
                }
            };
        });

        // ... [continues with result generation]
    }
};

// Mapping: zD→ExitPlanModeTool, aJ→TOOL_NAME_EXIT_PLAN_MODE,
//          $Y→isSwarmTeammate, NF6→isTeamModeEnabled,
//          Fj→getPlanFilePath, sJ→readPlanFile, i3→getTeammateName,
//          l5→getSessionTeamName, x3→writeToMailbox, HV→setHasExitedPlanMode,
//          JS→setNeedsPlanModeExitAttachment, Dp→handlePlanModeTransition
```

---

## 4. handlePlanApproval (_xY) - Swarm Plan Approval

### What it does

Handles plan approval from team-lead to teammate. Sends approval response to teammate's inbox.

### How it works

1. Validate caller is team-lead
2. Build approval response message
3. Write to teammate's inbox
4. Return success

```javascript
// ============================================
// handlePlanApproval - Send plan approval to teammate
// Location: chunks.145.mjs:2521-2545
// ============================================

// ORIGINAL (for source lookup):
async function _xY(A, q, K) {
    let Y = K.getAppState(),
        z = Y.teamContext?.teamName;
    if (!KZ(Y.teamContext)) throw Error("Only the team lead can approve plans. Teammates cannot approve their own or other plans.");
    let _ = Y.toolPermissionContext.mode,
        w = _ === "plan" ? "default" : _,
        O = {
            type: "plan_approval_response",
            requestId: q,
            approved: !0,
            timestamp: new Date().toISOString(),
            permissionMode: w
        };
    return await x3(A, {
        from: BY,
        text: B6(O),
        timestamp: new Date().toISOString()
    }, z), {
        data: {
            success: !0,
            message: `Plan approved for ${A}. They will receive the approval and can proceed with implementation.`,
            request_id: q
        }
    }
}

// READABLE (for understanding):
async function handlePlanApproval(teammateName, requestId, context) {
    const appState = context.getAppState();
    const teamName = appState.teamContext?.teamName;

    // Only team-lead can approve plans
    if (!isTeamLead(appState.teamContext)) {
        throw Error("Only the team lead can approve plans. Teammates cannot approve their own or other plans.");
    }

    // Get current mode (for permission mode restoration)
    const currentMode = appState.toolPermissionContext.mode;
    const permissionMode = currentMode === "plan" ? "default" : currentMode;

    // Build approval response
    const approvalResponse = {
        type: "plan_approval_response",
        requestId,
        approved: true,
        timestamp: new Date().toISOString(),
        permissionMode
    };

    // Send to teammate's inbox
    await writeToMailbox(teammateName, {
        from: TEAM_LEAD_ID,
        text: JSON.stringify(approvalResponse),
        timestamp: new Date().toISOString()
    }, teamName);

    return {
        data: {
            success: true,
            message: `Plan approved for ${teammateName}. They will receive the approval and can proceed with implementation.`,
            request_id: requestId
        }
    };
}

// Mapping: _xY→handlePlanApproval, A→teammateName, q→requestId, K→context,
//          KZ→isTeamLead, BY→TEAM_LEAD_ID, x3→writeToMailbox, B6→JSON.stringify
```

---

## 5. handlePlanRejection (wxY) - Swarm Plan Rejection

### What it does

Handles plan rejection from team-lead to teammate with feedback.

```javascript
// ============================================
// handlePlanRejection - Send plan rejection with feedback
// Location: chunks.145.mjs:2547-2569
// ============================================

// ORIGINAL (for source lookup):
async function wxY(A, q, K, Y) {
    let z = Y.getAppState(),
        _ = z.teamContext?.teamName;
    if (!KZ(z.teamContext)) throw Error("Only the team lead can reject plans. Teammates cannot reject their own or other plans.");
    let w = {
        type: "plan_approval_response",
        requestId: q,
        approved: !1,
        feedback: K,
        timestamp: new Date().toISOString()
    };
    return await x3(A, {
        from: BY,
        text: B6(w),
        timestamp: new Date().toISOString()
    }, _), {
        data: {
            success: !0,
            message: `Plan rejected for ${A} with feedback: "${K}"`,
            request_id: q
        }
    }
}

// READABLE (for understanding):
async function handlePlanRejection(teammateName, requestId, feedback, context) {
    const appState = context.getAppState();
    const teamName = appState.teamContext?.teamName;

    // Only team-lead can reject plans
    if (!isTeamLead(appState.teamContext)) {
        throw Error("Only the team lead can reject plans. Teammates cannot reject their own or other plans.");
    }

    // Build rejection response with feedback
    const rejectionResponse = {
        type: "plan_approval_response",
        requestId,
        approved: false,
        feedback,
        timestamp: new Date().toISOString()
    };

    // Send to teammate's inbox
    await writeToMailbox(teammateName, {
        from: TEAM_LEAD_ID,
        text: JSON.stringify(rejectionResponse),
        timestamp: new Date().toISOString()
    }, teamName);

    return {
        data: {
            success: true,
            message: `Plan rejected for ${teammateName} with feedback: "${feedback}"`,
            request_id: requestId
        }
    };
}

// Mapping: wxY→handlePlanRejection, A→teammateName, q→requestId, K→feedback, Y→context
```

---

## 6. Swarm Plan Approval Flow

```
Teammate (in plan mode)                Team Lead
    │                                       │
    │ ExitPlanMode called                   │
    ▼                                       │
plan_approval_request ─────────────────────▶│
    {type, from, planContent,              │
     planFilePath, requestId}               │
    │                                       ├─→ Show approval dialog
    │                                       │
    │                                       ├─→ Review plan
    │                                       │
    │◄──────────────────────────────────────┤
    │  plan_approval_response               │
    │  {approved: true/false,               │
    │   feedback?, permissionMode?}         │
    │                                       │
    ├─→ approved: Exit plan mode            │
    │    Restore mode from permissionMode   │
    │    Begin implementation               │
    │                                       │
    └─→ rejected: Stay in plan mode         │
         Revise plan based on feedback      │
```

---

## 7. Cross-Module Integration

### Plan Mode ↔ System Reminder (04)

Attachment types generated:
- `plan_mode` - Full 5-phase workflow instructions
- `plan_mode_reentry` - Brief re-entry reminder
- `plan_mode_exit` - Exited plan mode notification
- `plan_file_reference` - Existing plan content

### Plan Mode ↔ Tools (05)

Tool filtering:
- `isReadOnly()` tools always allowed
- `Write`/`Edit` allowed only to plan file path
- `ExitPlanMode` is the only programmatic exit
- `EnterPlanMode` allowed for re-entry
- `AskUserQuestion` allowed for clarification

### Plan Mode ↔ Hooks (11)

- `PreToolUse` hooks can modify tool availability
- `PostToolUse` hooks for plan file changes
- `PreCompact` hooks for plan preservation

### Plan Mode ↔ Compact (07)

- Plan preserved as state-preservation attachment
- Plan file not affected by compaction
- TodoWrite state preserved

---

## Symbol Validation Status

**Last validated:** 2026-03-27

All symbols in this module have been cross-validated against source code.

### Key Validated Symbols

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| Ki6 | EnterPlanModeTool | chunks.144.mjs:1579 | ✅ Correct |
| zD | ExitPlanModeTool | chunks.143.mjs:2802 | ✅ Correct |
| dt | TOOL_NAME_ENTER_PLAN_MODE | chunks.90.mjs:3121 | ✅ Correct |
| aJ | TOOL_NAME_EXIT_PLAN_MODE | chunks.90.mjs:507 | ✅ Correct |
| Dp | handlePlanModeTransition | chunks.1.mjs:2946 | ✅ Correct |
| _xY | handlePlanApproval | chunks.145.mjs:2521 | ✅ Correct |
| wxY | handlePlanRejection | chunks.145.mjs:2547 | ✅ Correct |
| BY | TEAM_LEAD_ID | chunks.131.mjs:1981 | ✅ Correct |