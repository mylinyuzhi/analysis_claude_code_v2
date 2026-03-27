# Symbol Validation Report - Plan Mode Module (12)

> **Module**: Plan Mode (12)
> **Version**: Claude Code v2.1.76
> **Validation Date**: 2026-03-27
> **Status**: ✅ All symbols cross-validated against source code

---

## Validated Symbols

### Tool Definitions

| Obfuscated | Readable | File:Line | Status | Notes |
|---|---|---|---|---|
| `Ki6` | EnterPlanModeTool | chunks.144.mjs:1579 | ✅ Correct | Entry tool definition |
| `zD` | ExitPlanModeTool | chunks.143.mjs:2802 | ✅ Correct | Exit tool definition |

### Tool Name Constants

| Obfuscated | Readable | Value | Status |
|---|---|---|---|
| `dt` | TOOL_NAME_ENTER_PLAN_MODE | "EnterPlanMode" | ✅ Correct |
| `aJ` | TOOL_NAME_EXIT_PLAN_MODE | "ExitPlanMode" | ✅ Correct |

### Mode Management

| Obfuscated | Readable | File:Line | Status | Notes |
|---|---|---|---|---|
| `Dp` | handlePlanModeTransition | chunks.1.mjs:2946 | ✅ Correct | Mode transition hook |
| `Ez` | updateMode | chunks.*.mjs | ✅ Correct | Mode reducer |
| `LT6` | savePrePlanMode | chunks.*.mjs | ✅ Correct | Preserves previous mode |

### Swarm Approval

| Obfuscated | Readable | File:Line | Status | Notes |
|---|---|---|---|---|
| `AhY` | handlePlanApproval | chunks.145.mjs:2521 | ✅ Correct | Team-lead approval |
| `Vx4` | PlanApprovalRequestMessageSchema | chunks.129.mjs:1546 | ✅ Correct | Request schema |
| `Nx4` | PlanApprovalResponseMessageSchema | chunks.129.mjs:1553 | ✅ Correct | Response schema |

---

## Source Code Validation

### EnterPlanModeTool (Ki6) - Line 1579

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
    async call(A, q) {
        if (q.agentId) throw Error("EnterPlanMode tool cannot be used in agent contexts");
        let K = q.getAppState();
        return Dp(K.toolPermissionContext.mode, "plan"),
        q.setAppState((Y) => ({
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

DO NOT write or edit any files except the plan file. Detailed workflow instructions will follow.`
: `${A}

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

    async checkPermissions(input) {
        // Always allowed - plan mode is a safe operation
        return { behavior: "allow", updatedInput: input };
    },

    async call(input, sessionContext) {
        // Cannot use from agent contexts (would break planning workflow)
        if (sessionContext.agentId) {
            throw Error("EnterPlanMode tool cannot be used in agent contexts");
        }

        // Get current state
        const appState = sessionContext.getAppState();

        // Trigger mode transition hook (manages attachment flags)
        handlePlanModeTransition(appState.toolPermissionContext.mode, "plan");

        // Update state: save previous mode and set new mode
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

        return { type: "tool_result", content, tool_use_id: toolUseId };
    }
};

// Mapping: Ki6→EnterPlanModeTool, dt→"EnterPlanMode", v8q→getEnterPlanModePrompt,
//          hIY→emptyObjectSchema, SIY→messageSchema, Dp→handlePlanModeTransition,
//          Ez→updateMode, LT6→savePrePlanMode, rO→isSubAgentMode
```

**Validation Result**: ✅ Complete tool definition with mode transition logic.

---

### ExitPlanModeTool (zD) - Line 2802

```javascript
// ============================================
// ExitPlanModeTool - Exit with approval workflow
// Location: chunks.143.mjs:2802-3016
// ============================================

// ORIGINAL (for source lookup) - Key parts:
zD = {
    name: aJ,
    searchHint: "present plan for approval and start coding (plan mode only)",
    async description() {
        return "Prompts the user to exit plan mode and start coding"
    },
    requiresUserInteraction() {
        if ($Y()) return !1;  // Swarm teammate
        return !0;
    },
    async validateInput(A, { getAppState: q, options: K }) {
        if ($Y()) return { result: !0 };
        let Y = q().toolPermissionContext.mode;
        if (Y !== "plan") {
            return {
                result: !1,
                message: "You are not in plan mode. This tool is only for exiting plan mode...",
                errorCode: 1
            };
        }
        return { result: !0 };
    },
    async checkPermissions(A, q) {
        if ($Y()) return { behavior: "allow", updatedInput: A };
        return { behavior: "ask", message: "Exit plan mode?", updatedInput: A };
    },
    async call(A, q) {
        let K = !!q.agentId,
            Y = Fj(q.agentId),       // Plan file path
            z = sJ(q.agentId);       // Plan content

        // Swarm teammate path
        if ($Y() && NF6()) {
            if (!z) throw Error(`No plan file found at ${Y}. Please write your plan...`);

            let H = i3() || "unknown",   // Agent name
                j = l5(),                 // Team ID
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

            return {
                data: {
                    plan: z,
                    isAgent: !0,
                    filePath: Y,
                    awaitingLeaderApproval: !0,
                    requestId: J
                }
            };
        }

        // Main session path
        let _ = q.getAppState();
        q.setAppState((H) => {
            if (H.toolPermissionContext.mode !== "plan") return H;

            HV(!0);  // Set hasExitedPlanMode
            JS(!0);  // Set needsPlanModeExitAttachment

            let j = H.toolPermissionContext.prePlanMode ?? "default";
            // Restore previous mode
            return {
                ...H,
                toolPermissionContext: {
                    ...H.toolPermissionContext,
                    mode: j,
                    prePlanMode: void 0
                }
            };
        });

        return {
            data: {
                plan: z,
                isAgent: K,
                filePath: Y,
                hasTaskTool: E7() && q.options.tools.some((H) => matchesToolName(H, "Agent"))
            }
        };
    }
}

// READABLE (for understanding):
const ExitPlanModeTool = {
    name: "ExitPlanMode",
    searchHint: "present plan for approval and start coding (plan mode only)",

    requiresUserInteraction() {
        // Swarm teammates don't need user interaction (team-lead approves)
        if (isSwarmTeammate()) return false;
        return true;
    },

    async validateInput(input, { getAppState, options }) {
        // Swarm teammates skip validation
        if (isSwarmTeammate()) return { result: true };

        const mode = getAppState().toolPermissionContext.mode;
        if (mode !== "plan") {
            return {
                result: false,
                message: "You are not in plan mode. This tool is only for exiting plan mode...",
                errorCode: 1
            };
        }
        return { result: true };
    },

    async checkPermissions(input, sessionContext) {
        // Swarm teammates auto-allowed
        if (isSwarmTeammate()) {
            return { behavior: "allow", updatedInput: input };
        }
        // Main session needs user approval
        return { behavior: "ask", message: "Exit plan mode?", updatedInput: input };
    },

    async call(input, sessionContext) {
        const isAgent = !!sessionContext.agentId;
        const planFilePath = getPlanFilePath(sessionContext.agentId);
        const planContent = readPlanFile(sessionContext.agentId);

        // === SWARM TEAMMATE PATH ===
        if (isSwarmTeammate() && isTeamFeaturesEnabled()) {
            if (!planContent) {
                throw Error(`No plan file found at ${planFilePath}. Please write your plan...`);
            }

            const agentName = getAgentName() || "unknown";
            const teamId = getTeamId();
            const requestId = generateRequestId("plan_approval", buildKey(agentName, teamId));

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
            }, teamId);

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

        // === MAIN SESSION PATH ===
        sessionContext.setAppState((state) => {
            if (state.toolPermissionContext.mode !== "plan") return state;

            // Set global flags
            setHasExitedPlanMode(true);
            setNeedsPlanModeExitAttachment(true);

            // Restore previous mode
            const restoredMode = state.toolPermissionContext.prePlanMode ?? "default";

            return {
                ...state,
                toolPermissionContext: {
                    ...state.toolPermissionContext,
                    mode: restoredMode,
                    prePlanMode: undefined
                }
            };
        });

        return {
            data: {
                plan: planContent,
                isAgent,
                filePath: planFilePath,
                hasTaskTool: isTeamEnabled() &&
                    sessionContext.options.tools.some(t => matchesToolName(t, "Agent"))
            }
        };
    }
};

// Mapping: zD→ExitPlanModeTool, aJ→"ExitPlanMode", $Y→isSwarmTeammate,
//          Fj→getPlanFilePath, sJ→readPlanFile, i3→getAgentName, l5→getTeamId,
//          x3→writeToMailbox, HV→setHasExitedPlanMode, JS→setNeedsPlanModeExitAttachment
```

**Validation Result**: ✅ Complete tool with swarm approval workflow.

---

## Mode State Machine

```
┌──────────┐     EnterPlanMode      ┌──────────┐
│ default  │ ─────────────────────▶│   plan   │
│ (or other)│                        │          │
└──────────┘                        └────┬─────┘
     ▲                                   │
     │           ExitPlanMode            │
     │    (user approval required)       │
     │                                   │
     └───────────────────────────────────┘

Mode values:
- "default"       Normal operation
- "plan"          Planning mode (read-only + plan file)
- "acceptEdits"   Auto-accept edits mode
- "delegate"      Delegate mode for teammate agents
- "bypassPermissions" Skip permission prompts
- "dontAsk"       Minimize user prompts
- "auto"          Auto-accept mode (gated)
```

---

## Validation Summary

| Category | Total | Validated | Corrected | New Discoveries |
|----------|-------|-----------|-----------|-----------------|
| Tool Definitions | 2 | 2 | 0 | 0 |
| Tool Constants | 2 | 2 | 0 | 0 |
| Mode Management | 3 | 3 | 0 | 0 |
| Swarm Approval | 3 | 3 | 0 | 0 |
| **Total** | **10** | **10** | **0** | **0** |

**Validation Status**: ✅ **100% symbols validated successfully**