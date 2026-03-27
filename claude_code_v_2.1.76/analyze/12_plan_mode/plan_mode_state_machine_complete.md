# Plan Mode State Machine Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of plan mode entry, exit, state transitions, and swarm approval workflow.

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
│                       PLAN MODE STATE MACHINE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Mode Values:                                                        │
│  ├─ "default"       Normal operation                                 │
│  ├─ "plan"          Planning mode (read-only + plan file)           │
│  ├─ "acceptEdits"   Auto-accept edits mode                          │
│  ├─ "delegate"      Delegate mode for teammate agents               │
│  ├─ "bypassPermissions" Skip permission prompts                     │
│  └─ "dontAsk"       Minimize user prompts                           │
│                                                                       │
│  State Fields:                                                       │
│  ├─ mode: string              Current mode                          │
│  ├─ prePlanMode: string       Mode to restore on exit               │
│  ├─ hasExitedPlanMode: bool   Exit flag (global)                    │
│  └─ needsPlanModeExitAttachment: bool                               │
│                                                                       │
│  Transitions:                                                        │
│                                                                       │
│  ┌──────────┐     EnterPlanMode      ┌──────────┐                   │
│  │ default  │ ─────────────────────▶│   plan   │                   │
│  └──────────┘                        └────┬─────┘                   │
│       ▲                                   │                          │
│       │           ExitPlanMode            │                          │
│       │    (user approval required)       │                          │
│       └───────────────────────────────────┘                          │
│                                                                       │
│  Swarm Flow (teammate agents):                                       │
│  ┌──────────┐     EnterPlanMode      ┌──────────┐                   │
│  │ teammate │ ─────────────────────▶│   plan   │                   │
│  └──────────┘                        └────┬─────┘                   │
│       ▲                                   │                          │
│       │     ExitPlanMode (swarm)         │                          │
│       │     ┌──────────────────┐         │                          │
│       │     │ plan_approval_   │─────────┘                          │
│       │     │ request to lead  │                                    │
│       │     └──────────────────┘                                    │
│       │              │                                               │
│       │     ┌────────▼──────────┐                                   │
│       │     │ plan_approval_    │                                   │
│       └─────│ response from lead│                                   │
│             └───────────────────┘                                   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. EnterPlanModeTool (Ki6) - Entry Point

**What it does:**
Transitions the session from the current mode to plan mode, saving the previous mode for restoration on exit. Generates plan_mode attachment for system reminders.

**How it works:**
1. Check not in agent context (tool not available for subagents)
2. Save current mode to `prePlanMode`
3. Call `handlePlanModeTransition` with from/to modes
4. Set mode to "plan" via `setAppState`
5. Return success message with workflow instructions

**Why this approach:**
- Cannot be called from agent contexts (would break the planning workflow)
- Saving `prePlanMode` ensures proper mode restoration
- `handlePlanModeTransition` hook manages attachment flags

```javascript
// ============================================
// EnterPlanModeTool - Transition to plan mode
// Location: chunks.144.mjs:1579-1659
// ============================================

// ORIGINAL (for source lookup):
Ki6 = {
    name: dt,  // "EnterPlanMode"
    searchHint: "switch to plan mode to design an approach before coding",
    maxResultSizeChars: 1e5,
    async description() {
        return "Requests permission to enter plan mode for complex tasks requiring exploration and design"
    },
    async prompt() {
        return v8q()  // Generates tool prompt
    },
    get inputSchema() {
        return hIY()  // Zod schema for input
    },
    get outputSchema() {
        return SIY()  // Zod schema for output
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
            behavior: "allow",  // Always allow entry to plan mode
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

        // Call mode transition hook
        Dp(K.toolPermissionContext.mode, "plan");

        // Update state to plan mode
        q.setAppState((Y) => ({
            ...Y,
            toolPermissionContext: Ez(LT6(Y.toolPermissionContext), {
                type: "setMode",
                mode: "plan",
                destination: "session"
            })
        }));

        return {
            data: {
                message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
            }
        }
    },
    mapToolResultToToolResultBlockParam({ message: A }, q) {
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
        return generatePlanModePrompt();
    },

    // Always allow entry - no permission needed
    async checkPermissions(input) {
        return {
            behavior: "allow",
            updatedInput: input
        };
    },

    // Tool is safe and read-only
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },
    isEnabled() { return true; },

    async call(input, context) {
        // Cannot be used in agent/subagent contexts
        if (context.agentId) {
            throw new Error("EnterPlanMode tool cannot be used in agent contexts");
        }

        const currentState = context.getAppState();

        // Call mode transition hook
        // This sets up needsPlanModeExitAttachment flag
        handlePlanModeTransition(currentState.toolPermissionContext.mode, "plan");

        // Update session state to plan mode
        context.setAppState((state) => ({
            ...state,
            toolPermissionContext: updateModeState(
                savePrePlanMode(state.toolPermissionContext),
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
        const isSparseMode = isSparsePlanReminder();

        const fullInstructions = `${message}

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.`;

        const sparseInstructions = `${message}

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`;

        return {
            type: "tool_result",
            content: isSparseMode ? sparseInstructions : fullInstructions,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: Ki6→EnterPlanModeTool, dt→"EnterPlanMode", Dp→handlePlanModeTransition,
//          Ez→updateModeState, LT6→savePrePlanMode, rO→isSparsePlanReminder
```

**Key insight:**
EnterPlanMode is always allowed without permission prompts because entering plan mode is a safe, read-only operation. The restriction is enforced at exit - ExitPlanMode requires user approval. This "easy entry, controlled exit" pattern ensures users can always explore safely before committing to implementation.

---

## 2. ExitPlanModeTool (zD) - Approval and Exit

**What it does:**
Exits plan mode after user approval. In swarm mode, sends plan_approval_request to team lead and waits for response. In normal mode, prompts user for approval and restores previous mode.

**How it works:**

### Normal Mode Flow:
1. Validate currently in plan mode
2. Check permission (requires user interaction)
3. Restore `prePlanMode` (or "default" if was "ultraplan")
4. Handle auto-mode gate if configured
5. Set `hasExitedPlanMode` flag
6. Return plan content for confirmation

### Swarm Mode Flow:
1. Detect teammate agent context
2. Read plan file content
3. Create `plan_approval_request` message
4. Send to team-lead inbox via `x3`
5. Return `awaitingLeaderApproval: true`
6. Teammate waits for `plan_approval_response` message

```javascript
// ============================================
// ExitPlanModeTool - Exit with approval
// Location: chunks.143.mjs:2802-3000+
// ============================================

// ORIGINAL (for source lookup):
zD = {
    name: aJ,  // "ExitPlanMode"
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 1e5,
    async description() {
        return "Prompts the user to exit plan mode and start coding"
    },
    async prompt() {
        return Z1q  // ExitPlanMode prompt
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
        return !1  // NOT read-only - modifies state
    },
    toAutoClassifierInput() {
        return ""
    },
    requiresUserInteraction() {
        // Skip interaction in swarm mode
        if ($Y()) return !1;
        return !0
    },
    async validateInput(A, { getAppState: q, options: K }) {
        // Skip validation in swarm mode
        if ($Y()) return { result: !0 };

        let Y = q().toolPermissionContext.mode;
        if (Y !== "plan") {
            d("tengu_exit_plan_mode_called_outside_plan", {
                model: K.mainLoopModel,
                mode: Y,
                hasExitedPlanModeInSession: nk6()
            });
            return {
                result: !1,
                message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan. If your plan was already approved, continue with implementation.",
                errorCode: 1
            };
        }
        return { result: !0 }
    },
    async checkPermissions(A, q) {
        // In swarm mode, allow without prompt
        if ($Y()) return {
            behavior: "allow",
            updatedInput: A
        };
        // Otherwise, require user approval
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
        let K = !!q.agentId,  // Is this a teammate agent?
            Y = Fj(q.agentId),  // Plan file path
            z = sJ(q.agentId);  // Read plan file content

        // === SWARM MODE: Send approval request to team lead ===
        if ($Y() && NF6()) {
            if (!z) throw Error(`No plan file found at ${Y}. Please write your plan to this file before calling ExitPlanMode.`);

            let H = i3() || "unknown",  // Agent name
                j = l5(),  // Team name
                J = bZ6("plan_approval", ak(H, j || "default")),  // Request ID
                M = {
                    type: "plan_approval_request",
                    from: H,
                    timestamp: new Date().toISOString(),
                    planFilePath: Y,
                    planContent: z,
                    requestId: J
                };

            // Send to team-lead inbox
            await x3("team-lead", {
                from: H,
                text: JSON.stringify(M),
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

        // === NORMAL MODE: Exit plan mode ===
        let _ = q.getAppState(),
            w = _.toolPermissionContext.prePlanMode === "ultraplan",
            O = null;

        // Determine mode to restore
        {
            let H = _.toolPermissionContext.prePlanMode ?? "default",
                j = H === "ultraplan" ? "default" : H;

            // Auto-mode gate check
            if ((j === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) {
                let M = sl6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
                O = sl6?.getAutoModeUnavailableNotification(M) ?? "auto mode unavailable";
                k(`[auto-mode gate @ ExitPlanModeV2Tool] prePlanMode=${j} but gate is off (reason=${M}) — falling back to default on plan exit`, { level: "warn" });
            }
        }

        // Show notification if auto-mode gate blocked
        if (O) q.addNotification?.({
            key: "auto-mode-gate-plan-exit-fallback",
            text: `plan exit → default · ${O}`,
            priority: "immediate",
            color: "warning",
            timeoutMs: 1e4
        });

        // Update state to exit plan mode
        q.setAppState((H) => {
            if (H.toolPermissionContext.mode !== "plan") return H;

            // Set global flags
            HV(!0);  // hasExitedPlanMode = true
            JS(!0);  // needsPlanModeExitAttachment = true

            let j = H.toolPermissionContext.prePlanMode ?? "default",
                J = j === "ultraplan" ? "default" : j;

            // Auto-mode gate fallback
            {
                if ((J === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) J = "default";
                let X = J === "auto" || !1;
                if (tCY?.setAutoModeActive(X), j === "auto" && J !== "auto") MS(!0);
            }

            // Restore dangerous permissions if not auto mode
            let M = J !== "auto" ?
                sl6?.restoreDangerousPermissions(H.toolPermissionContext) ?? H.toolPermissionContext :
                H.toolPermissionContext;

            return {
                ...H,
                toolPermissionContext: {
                    ...M,
                    mode: J,
                    prePlanMode: void 0
                }
            }
        });

        let $ = E7() && q.options.tools.some((H) => z3(H, r4));  // Has Agent tool?

        return {
            data: {
                plan: z,
                isAgent: K,
                filePath: Y,
                hasTaskTool: $ || void 0,
                isUltraplan: w || void 0
            }
        }
    },
    mapToolResultToToolResultBlockParam({ isAgent, plan, filePath, hasTaskTool, awaitingLeaderApproval, requestId, isUltraplan }, toolUseId) {
        // Swarm mode: awaiting leader approval
        if (awaitingLeaderApproval) {
            return {
                type: "tool_result",
                content: `Your plan has been submitted to the team lead for approval.

Plan file: ${filePath}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${requestId}`,
                tool_use_id: toolUseId
            };
        }

        // Agent mode: approved
        if (isAgent) {
            return {
                type: "tool_result",
                content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
                tool_use_id: toolUseId
            };
        }

        // No plan content: simple approval
        if (!plan || plan.trim() === "") {
            return {
                type: "tool_result",
                content: "User has approved exiting plan mode. You can now proceed.",
                tool_use_id: toolUseId
            };
        }

        // Ultraplan: reviewed
        if (isUltraplan) {
            return {
                type: "tool_result",
                content: "User has reviewed the ultraplan. There is nothing else to do. Respond with a brief summary of the plan.",
                tool_use_id: toolUseId
            };
        }

        // Normal mode: proceed with implementation
        // ... (continues with task integration instructions)
    }
}

// READABLE (for understanding):
const ExitPlanModeTool = {
    name: "ExitPlanMode",
    searchHint: "present plan for approval and start coding (plan mode only)",

    async description() {
        return "Prompts the user to exit plan mode and start coding";
    },

    isReadOnly() { return false; },  // Modifies state

    requiresUserInteraction() {
        // In swarm mode, skip interaction (handled via messaging)
        if (isSwarmTeammate()) return false;
        return true;
    },

    async validateInput(input, { getAppState, options }) {
        // Skip in swarm mode
        if (isSwarmTeammate()) return { result: true };

        const state = getAppState();
        if (state.toolPermissionContext.mode !== "plan") {
            emitTelemetry("tengu_exit_plan_mode_called_outside_plan", {
                model: options.mainLoopModel,
                mode: state.toolPermissionContext.mode,
                hasExitedPlanModeInSession: hasExitedPlanMode()
            });
            return {
                result: false,
                message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan.",
                errorCode: 1
            };
        }
        return { result: true };
    },

    async checkPermissions(input, context) {
        // Swarm: auto-allow (approval via messaging)
        if (isSwarmTeammate()) {
            return { behavior: "allow", updatedInput: input };
        }
        // Normal: require user confirmation
        return { behavior: "ask", message: "Exit plan mode?", updatedInput: input };
    },

    async call(input, context) {
        const isAgent = !!context.agentId;
        const planFilePath = getPlanFilePath(context.agentId);
        const planContent = readPlanFile(context.agentId);

        // === SWARM MODE: Request approval from team lead ===
        if (isSwarmTeammate() && isTeamMode()) {
            if (!planContent) {
                throw new Error(`No plan file found at ${planFilePath}. Please write your plan before calling ExitPlanMode.`);
            }

            const agentName = getAgentName() || "unknown";
            const teamName = getTeamName();
            const requestId = generateRequestId("plan_approval", `${agentName}-${teamName}`);

            const approvalRequest = {
                type: "plan_approval_request",
                from: agentName,
                timestamp: new Date().toISOString(),
                planFilePath,
                planContent,
                requestId
            };

            // Send to team-lead's inbox
            await writeToMailbox("team-lead", {
                from: agentName,
                text: JSON.stringify(approvalRequest),
                timestamp: new Date().toISOString()
            }, teamName);

            // Update agent state
            const state = context.getAppState();
            const agentState = getAgentStateByName(agentName, state);
            if (agentState) {
                updateAgentIdleState(agentState, context.setAppState, true);
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

        // === NORMAL MODE: Exit and restore mode ===
        const state = context.getAppState();
        const wasUltraplan = state.toolPermissionContext.prePlanMode === "ultraplan";

        // Determine mode to restore
        let restoreMode = state.toolPermissionContext.prePlanMode ?? "default";
        if (restoreMode === "ultraplan") restoreMode = "default";

        // Auto-mode gate check
        if (restoreMode === "auto" && !isAutoModeGateEnabled()) {
            const reason = getAutoModeUnavailableReason();
            context.addNotification?.({
                key: "auto-mode-gate-plan-exit-fallback",
                text: `plan exit → default · ${reason}`,
                priority: "immediate",
                color: "warning",
                timeoutMs: 10000
            });
            restoreMode = "default";
        }

        // Update state
        context.setAppState((s) => {
            if (s.toolPermissionContext.mode !== "plan") return s;

            // Set global flags
            setHasExitedPlanMode(true);
            setNeedsPlanModeExitAttachment(true);

            // Restore permissions
            const restoredPermissions = restoreMode !== "auto"
                ? restoreDangerousPermissions(s.toolPermissionContext)
                : s.toolPermissionContext;

            return {
                ...s,
                toolPermissionContext: {
                    ...restoredPermissions,
                    mode: restoreMode,
                    prePlanMode: undefined
                }
            };
        });

        // Check if Agent tool is available
        const hasAgentTool = isAgentToolEnabled() &&
            context.options.tools.some((t) => matchesTool(t, "Agent"));

        return {
            data: {
                plan: planContent,
                isAgent,
                filePath: planFilePath,
                hasTaskTool: hasAgentTool || undefined,
                isUltraplan: wasUltraplan || undefined
            }
        };
    },

    mapToolResultToToolResultBlockParam(result, toolUseId) {
        // Swarm: awaiting leader approval
        if (result.awaitingLeaderApproval) {
            return {
                type: "tool_result",
                content: `Your plan has been submitted to the team lead for approval.

Plan file: ${result.filePath}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval.

Request ID: ${result.requestId}`,
                tool_use_id: toolUseId
            };
        }

        // Agent: approved
        if (result.isAgent) {
            return {
                type: "tool_result",
                content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
                tool_use_id: toolUseId
            };
        }

        // No plan: simple approval
        if (!result.plan?.trim()) {
            return {
                type: "tool_result",
                content: "User has approved exiting plan mode. You can now proceed.",
                tool_use_id: toolUseId
            };
        }

        // Ultraplan: reviewed
        if (result.isUltraplan) {
            return {
                type: "tool_result",
                content: "User has reviewed the ultraplan. Respond with a brief summary of the plan.",
                tool_use_id: toolUseId
            };
        }

        // Normal: proceed with task-based implementation
        // ... continues with task creation instructions
    }
};

// Mapping: zD→ExitPlanModeTool, aJ→"ExitPlanMode", $Y→isSwarmTeammate, NF6→isTeamMode,
//          Fj→getPlanFilePath, sJ→readPlanFile, x3→writeToMailbox, HV→setHasExitedPlanMode
```

**Key insight:**
The dual-mode ExitPlanMode (normal vs swarm) enables both single-user planning and team-based planning workflows:
1. **Normal mode**: User approves directly via permission dialog
2. **Swarm mode**: Teammate sends plan to team-lead inbox, waits for response
This allows distributed planning where teammates can work independently while still requiring approval from the lead agent.

---

## 3. Mode Transition Hook (Dp)

**What it does:**
Hook called when mode transitions, setting up or clearing attachment flags for plan mode.

**How it works:**
- Entering plan mode: Reset `needsPlanModeExitAttachment` to false
- Leaving plan mode: Set `needsPlanModeExitAttachment` to true

```javascript
// ============================================
// handlePlanModeTransition - Mode transition hook
// Location: chunks.1.mjs:2946-2950
// ============================================

// ORIGINAL (for source lookup):
function Dp(fromMode, toMode) {
    // Entering plan mode
    if (toMode === "plan" && fromMode !== "plan") {
        // Reset exit attachment flag
        globalSessionState.needsPlanModeExitAttachment = !1;
    }
    // Leaving plan mode
    if (fromMode === "plan" && toMode !== "plan") {
        // Mark need for exit attachment
        globalSessionState.needsPlanModeExitAttachment = !0;
    }
}

// READABLE (for understanding):
function handlePlanModeTransition(fromMode, toMode) {
    // Entering plan mode: reset exit attachment flag
    // This ensures we don't generate stale exit attachments
    if (toMode === "plan" && fromMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = false;
    }

    // Leaving plan mode: request exit attachment
    // The attachment producer will generate plan_mode_exit on next turn
    if (fromMode === "plan" && toMode !== "plan") {
        globalSessionState.needsPlanModeExitAttachment = true;
    }
}

// Mapping: Dp→handlePlanModeTransition
```

---

## 4. State Fields and Meanings

| Field | Type | Purpose |
|-------|------|---------|
| `mode` | string | Current execution mode |
| `prePlanMode` | string | Mode to restore when exiting plan mode |
| `hasExitedPlanMode` | boolean | Global flag - has exited plan mode this session |
| `needsPlanModeExitAttachment` | boolean | Should generate exit attachment on next turn |

### Mode Values:

| Mode | Description | Tool Restrictions |
|------|-------------|-------------------|
| `default` | Normal operation | All tools available |
| `plan` | Planning mode | Read-only + plan file only |
| `acceptEdits` | Auto-accept edits | Edit/Write auto-approved |
| `delegate` | Delegate mode | For teammate agents |
| `bypassPermissions` | Skip prompts | All permissions auto-approved |
| `dontAsk` | Minimize prompts | Fewer user prompts |
| `ultraplan` | Enhanced planning | Special plan review flow |

---

## 5. Swarm Plan Approval Protocol

### Message Format:

```javascript
// Request (from teammate to team-lead):
{
    type: "plan_approval_request",
    from: "agent-name",
    timestamp: "2024-01-15T10:30:00Z",
    planFilePath: "~/.claude_api/plans/...",
    planContent: "# Plan: ...",
    requestId: "plan_approval-agent-team-abc123"
}

// Response (from team-lead to teammate):
{
    type: "plan_approval_response",
    approved: true,  // or false
    feedback: "Optional revision feedback",  // if rejected
    requestId: "plan_approval-agent-team-abc123"
}
```

### Flow:

```
Teammate                              Team Lead
    │                                     │
    ├─ EnterPlanMode                     │
    │                                     │
    ├─ Explore codebase                  │
    │                                     │
    ├─ Write plan to file                │
    │                                     │
    ├─ ExitPlanMode ────────────────────►│
    │   (plan_approval_request)           │
    │                                     ├─ Review plan
    │                                     ├─ Show approval dialog
    │                                     │
    │◄────────────────────────────────────┤
    │   (plan_approval_response)          │
    │                                     │
    ├─ If approved: Exit plan mode       │
    └─ If rejected: Revise plan          │
```

---

## Cross-Module Integration

### Plan Mode ↔ System Reminder (04)

The `needsPlanModeExitAttachment` flag triggers attachment generation:
- When set to `true`, the attachment producer generates `plan_mode_exit` attachment
- This attachment provides context about exiting plan mode to the LLM

### Plan Mode ↔ Tools (05)

Tool filtering in plan mode:
- `filterToolsByMode` checks `tool.isReadOnly()`
- Write/Edit allowed only to plan file path
- ExitPlanMode is the only programmatic exit

### Plan Mode ↔ Task System (13)

After plan approval:
- Task creation prompts appear if plan has structured steps
- `hasTaskTool` in ExitPlanMode result enables task suggestions

---

## Verification

1. **Validate EnterPlanMode symbol**:
   ```bash
   grep -n "Ki6 = {" source/chunks.144.mjs
   # Expected: 1579:    })), Ki6 = {
   ```

2. **Validate ExitPlanMode symbol**:
   ```bash
   grep -n "zD = {" source/chunks.143.mjs
   # Expected: 2802:    })), zD = {
   ```

3. **Validate mode transition hook**:
   ```bash
   grep -n "function Dp" source/chunks.1.mjs
   ```