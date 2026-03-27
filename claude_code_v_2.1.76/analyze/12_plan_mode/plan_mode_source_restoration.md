# Plan Mode State Machine Complete Source Restoration (Claude Code 2.1.76)

> Complete source-level restoration of EnterPlanMode, ExitPlanMode, swarm approval workflow, and mode transitions.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions in this document:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `handlePlanModeTransition` (Dp) - Mode state hooks

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
│  ├─ "dontAsk"       Minimize user prompts                           │
│  └─ "auto"          Auto-accept mode (gated)                        │
│                                                                       │
│  State Fields (in toolPermissionContext):                           │
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
│  ┌──────────┐     ExitPlanMode        ┌──────────┐                   │
│  │ teammate │ ──plan_approval_request─▶│team-lead │                   │
│  │  in plan │                          │ reviews  │                   │
│  └──────────┘◀──plan_approval_response─┴──────────┘                   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. EnterPlanModeTool (Ki6)

**What it does:**
Transitions the session from the current mode to plan mode. Saves the previous mode for restoration on exit and triggers the mode transition hook.

**How it works:**
1. Validate not in agent context (cannot nest planning)
2. Call `handlePlanModeTransition` to manage attachment flags
3. Update `toolPermissionContext.mode` to "plan"
4. Save previous mode to `prePlanMode`
5. Return workflow instructions

**Why this approach:**
- State preservation via `prePlanMode` ensures proper restoration
- Single entry point prevents mode inconsistencies
- Attachment flag management enables proper LLM context injection

```javascript
// ============================================
// EnterPlanModeTool - Transition to plan mode
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
        return getEnterPlanModePrompt();
    },

    get inputSchema() {
        return emptyObjectSchema();
    },

    get outputSchema() {
        return messageSchema();
    },

    userFacingName() {
        return "";  // Hidden from user
    },

    shouldDefer: true,
    isEnabled() { return true; },
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },

    toAutoClassifierInput() {
        return "";
    },

    async checkPermissions(input) {
        // Always allowed - plan mode is a safe operation
        return {
            behavior: "allow",
            updatedInput: input
        };
    },

    async call(input, sessionContext) {
        // Cannot use from agent contexts (would break planning workflow)
        if (sessionContext.agentId) {
            throw Error("EnterPlanMode tool cannot be used in agent contexts");
        }

        // Get current state
        const appState = sessionContext.getAppState();

        // Trigger mode transition hook
        handlePlanModeTransition(appState.toolPermissionContext.mode, "plan");

        // Update state
        sessionContext.setAppState((state) => ({
            ...state,
            toolPermissionContext: updateMode(
                savePrePlanMode(state.toolPermissionContext),
                { type: "setMode", mode: "plan", destination: "session" }
            )
        }));

        return {
            data: {
                message: "Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach."
            }
        };
    },

    mapToolResultToToolResultBlockParam({ message }, toolUseId) {
        const isSubAgent = isSubAgentMode();

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
            content,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: Ki6→EnterPlanModeTool, dt→"EnterPlanMode", v8q→getEnterPlanModePrompt,
//          hIY→emptyObjectSchema, SIY→messageSchema, Dp→handlePlanModeTransition,
//          Ez→updateMode, LT6→savePrePlanMode, rO→isSubAgentMode
```

---

## 2. ExitPlanModeTool (zD)

**What it does:**
Exits plan mode after user approval. For teammate agents, sends plan approval request to team lead. For main session, shows approval dialog.

**How it works:**
1. Validate currently in plan mode
2. Check if swarm teammate (needs leader approval)
3. If swarm: send `plan_approval_request` message and wait
4. If main: update mode and restore previous mode
5. Return approval status

**Why this approach:**
- Swarm approval enables distributed planning
- PrePlanMode restoration maintains session continuity
- User interaction required for safety

```javascript
// ============================================
// ExitPlanModeTool - Exit with approval
// Location: chunks.143.mjs:2802-3016
// ============================================

// ORIGINAL (for source lookup) - call method:
async call(A, q) {
    let K = !!q.agentId,
        Y = Fj(q.agentId),
        z = sJ(q.agentId);

    // Swarm teammate path
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

    // Main session path
    let _ = q.getAppState(),
        w = _.toolPermissionContext.prePlanMode === "ultraplan",
        O = null;
    {
        let H = _.toolPermissionContext.prePlanMode ?? "default",
            j = H === "ultraplan" ? "default" : H;
        if ((j === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) {
            let M = sl6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
            O = sl6?.getAutoModeUnavailableNotification(M) ?? "auto mode unavailable";
        }
    }

    q.setAppState((H) => {
        if (H.toolPermissionContext.mode !== "plan") return H;
        HV(!0), JS(!0);
        let j = H.toolPermissionContext.prePlanMode ?? "default",
            J = j === "ultraplan" ? "default" : j;
        // Auto-mode gate check
        if ((J === "auto" || !1) && !(sl6?.isAutoModeGateEnabled() ?? !1)) J = "default";
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
}

// READABLE (for understanding):
async function call(input, sessionContext) {
    const isAgent = !!sessionContext.agentId;
    const planFilePath = getPlanFilePath(sessionContext.agentId);
    const planContent = readPlanFile(sessionContext.agentId);

    // ========== Swarm Teammate Path ==========
    if (isSwarmTeammate() && isPlanApprovalRequired()) {
        if (!planContent) {
            throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);
        }

        const agentName = getAgentName() || "unknown";
        const teamName = getTeamName();
        const requestId = generateId("plan_approval", buildScopeKey(agentName, teamName || "default"));

        // Build plan approval request message
        const approvalRequest = {
            type: "plan_approval_request",
            from: agentName,
            timestamp: new Date().toISOString(),
            planFilePath,
            planContent,
            requestId
        };

        // Send to team-lead inbox
        await writeToMailbox("team-lead", {
            from: agentName,
            text: JSON.stringify(approvalRequest),
            timestamp: new Date().toISOString()
        }, teamName);

        // Update UI state for pending approval
        const appState = sessionContext.getAppState();
        const pendingApproval = findPendingApproval(agentName, appState);
        if (pendingApproval) {
            setPendingApprovalState(pendingApproval, sessionContext.setAppState, true);
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

    // ========== Main Session Path ==========
    const appState = sessionContext.getAppState();
    const isUltraplan = appState.toolPermissionContext.prePlanMode === "ultraplan";
    let autoModeFallbackNotification = null;

    // Check auto-mode gate
    {
        const preMode = appState.toolPermissionContext.prePlanMode ?? "default";
        const restoreMode = preMode === "ultraplan" ? "default" : preMode;

        if (restoreMode === "auto" && !isAutoModeGateEnabled()) {
            const reason = getAutoModeUnavailableReason() ?? "circuit-breaker";
            autoModeFallbackNotification = getAutoModeUnavailableNotification(reason) ?? "auto mode unavailable";
        }
    }

    // Show notification if auto-mode fallback
    if (autoModeFallbackNotification) {
        sessionContext.addNotification?.({
            key: "auto-mode-gate-plan-exit-fallback",
            text: `plan exit → default · ${autoModeFallbackNotification}`,
            priority: "immediate",
            color: "warning",
            timeoutMs: 10000
        });
    }

    // Update mode state
    sessionContext.setAppState((state) => {
        if (state.toolPermissionContext.mode !== "plan") return state;

        // Set exit flags
        setHasExitedPlanMode(true);
        setNeedsPlanModeExitAttachment(true);

        // Determine restore mode
        let restoreMode = state.toolPermissionContext.prePlanMode ?? "default";
        if (restoreMode === "ultraplan") restoreMode = "default";

        // Auto-mode gate enforcement
        if (restoreMode === "auto" && !isAutoModeGateEnabled()) {
            restoreMode = "default";
        }

        // Restore permissions if not auto mode
        const restoredPermissions = restoreMode !== "auto"
            ? restoreDangerousPermissions(state.toolPermissionContext) ?? state.toolPermissionContext
            : state.toolPermissionContext;

        return {
            ...state,
            toolPermissionContext: {
                ...restoredPermissions,
                mode: restoreMode,
                prePlanMode: undefined
            }
        };
    });

    // Check for Agent tool availability
    const hasAgentTool = isTeamsEnabled() &&
        sessionContext.options.tools.some(tool => matchesToolName(tool, "Agent"));

    return {
        data: {
            plan: planContent,
            isAgent,
            filePath: planFilePath,
            hasTaskTool: hasAgentTool || undefined,
            isUltraplan: isUltraplan || undefined
        }
    };
}

// Mapping: zD→ExitPlanModeTool, aJ→"ExitPlanMode", Fj→getPlanFilePath, sJ→readPlanFile,
//          $Y→isSwarmTeammate, NF6→isPlanApprovalRequired, i3→getAgentName, l5→getTeamName,
//          x3→writeToMailbox, B6→JSON.stringify, HV→setHasExitedPlanMode, JS→setNeedsPlanModeExitAttachment,
//          sl6→autoModeGate, r4→"Agent"
```

---

## 3. mapToolResultToToolResultBlockParam - Response Formatting

```javascript
// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam({
    isAgent: A,
    plan: q,
    filePath: K,
    hasTaskTool: Y,
    awaitingLeaderApproval: z,
    requestId: _,
    isUltraplan: w
}, O) {
    if (z) return {
        type: "tool_result",
        content: `Your plan has been submitted to the team lead for approval.

Plan file: ${K}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval. Check your inbox for response.

Request ID: ${_}`,
        tool_use_id: O
    };
    if (A) return {
        type: "tool_result",
        content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
        tool_use_id: O
    };
    if (!q || q.trim() === "") return {
        type: "tool_result",
        content: "User has approved exiting plan mode. You can now proceed.",
        tool_use_id: O
    };
    if (w) return {
        type: "tool_result",
        content: "User has reviewed the ultraplan. There is nothing else to do. Respond with a brief summary of the plan.",
        tool_use_id: O
    };
    let $ = Y ? `

If this plan can be broken down into multiple independent tasks, consider using the ${TEAM_CREATE_TOOL_NAME} tool to create a team and parallelize the work.` : "";
    return {
        type: "tool_result",
        content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${K}
You can refer back to it if needed during implementation.${$}

## Approved Plan:
${q}`,
        tool_use_id: O
    }
}

// READABLE (for understanding):
mapToolResultToToolResultBlockParam({
    isAgent,
    plan,
    filePath,
    hasTaskTool,
    awaitingLeaderApproval,
    requestId,
    isUltraplan
}, toolUseId) {

    // Swarm teammate awaiting leader approval
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

    // Swarm teammate approved
    if (isAgent) {
        return {
            type: "tool_result",
            content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
            tool_use_id: toolUseId
        };
    }

    // Empty plan
    if (!plan || plan.trim() === "") {
        return {
            type: "tool_result",
            content: "User has approved exiting plan mode. You can now proceed.",
            tool_use_id: toolUseId
        };
    }

    // Ultraplan
    if (isUltraplan) {
        return {
            type: "tool_result",
            content: "User has reviewed the ultraplan. There is nothing else to do. Respond with a brief summary of the plan.",
            tool_use_id: toolUseId
        };
    }

    // Standard plan approval
    const teamHint = hasTaskTool ? `

If this plan can be broken down into multiple independent tasks, consider using the TeamCreate tool to create a team and parallelize the work.` : "";

    return {
        type: "tool_result",
        content: `User has approved your plan. You can now start coding. Start with updating your todo list if applicable

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.${teamHint}

## Approved Plan:
${plan}`,
        tool_use_id: toolUseId
    };
}
```

---

## 4. Mode State Fields

| Field | Type | Purpose |
|-------|------|---------|
| `mode` | string | Current mode ("default", "plan", "auto", etc.) |
| `prePlanMode` | string | Mode to restore when exiting plan mode |
| `hasExitedPlanMode` | boolean | Global flag indicating plan mode has been exited |
| `needsPlanModeExitAttachment` | boolean | Whether to attach exit reminder |

---

## Integration with System Reminder

Plan mode generates the following attachment types:

| Attachment Type | When Generated | Content |
|-----------------|----------------|---------|
| `plan_mode` | Each turn while in plan mode | Workflow instructions |
| `plan_mode_exit` | On exit from plan mode | Exit confirmation |

---

## Cross-Reference

- [plan_mode_state_machine_complete.md](./plan_mode_state_machine_complete.md) - Original analysis
- [swarm_plan_approval_complete.md](./swarm_plan_approval_complete.md) - Swarm approval workflow
- [reminder_system.md](./reminder_system.md) - System reminder integration
- [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md#module-plan-mode) - Symbol mappings