# Plan Mode Module - Complete Source Restoration v3

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Full source-level restoration with grep-verified symbols

---

## Overview

This document provides complete source-level restoration of all key functions in the Plan Mode module. Plan Mode implements the "Plan → Approve → Implement" safety pattern, restricting the agent to read-only exploration until explicit user approval.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions documented here:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `handlePlanModeTransition` (Dp) - Mode transition hooks - chunks.1.mjs:2946

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                       PLAN MODE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① State Machine                                                     │
│     mode ∈ {"default", "plan", "acceptEdits", "delegate",           │
│              "bypassPermissions", "dontAsk", "auto"}                 │
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
│  ③ Planning Workflow (5 Phases)                                      │
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

## 1. EnterPlanModeTool (Ki6)

### What it does

Transitions the agent into plan mode, restricting tool access and enabling the planning workflow. Not allowed in agent contexts (would break planning workflow).

### How it works

1. Check if called from agent context - throw error if so
2. Get current app state
3. Call transition hook to manage attachment flags
4. Update state: save previous mode and set new mode to "plan"
5. Return success message with plan mode instructions

### Why this approach

- **Agent context check** prevents nested planning which would break workflow
- **Mode transition hook** manages global flags for attachment generation
- **prePlanMode save** enables proper mode restoration on exit

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

    toAutoClassifierInput() {
        return "";
    },

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

---

## 2. ExitPlanModeTool (zD)

### What it does

Exits plan mode with user approval workflow. For swarm teammates, sends plan approval request to team-lead. Restores previous mode and generates exit attachment.

### How it works

1. Validate input - must be in plan mode
2. Check if swarm teammate - different approval flow
3. For swarm: send plan_approval_request to team-lead inbox
4. For main session: show approval dialog, restore mode on approval
5. Generate plan_mode_exit attachment
6. Return plan content with approval status

### Swarm Approval Flow

```
Teammate (in plan mode)
    │ ExitPlanMode called
    ▼
plan_approval_request → writeToMailbox
    │
    ▼
Team-lead inbox (readMailbox)
    │ Show approval dialog
    ▼
plan_approval_response → writeToMailbox
    │
    ▼
Teammate receives response
    ├─→ approved: Exit plan mode
    └─→ rejected: Stay in plan mode
```

```javascript
// ============================================
// ExitPlanModeTool - Exit with approval workflow
// Location: chunks.143.mjs:2802-3016
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
        if ($Y()) return !1;  // Swarm teammate - no direct user interaction
        return !0;
    },
    async validateInput(A, { getAppState: q, options: K }) {
        if ($Y()) return { result: !0 };  // Swarm teammates skip validation
        let Y = q().toolPermissionContext.mode;
        if (Y !== "plan") return {
            result: !1,
            message: "You are not in plan mode. This tool is only for exiting plan mode...",
            errorCode: 1
        };
        return { result: !0 }
    },
    async checkPermissions(A, q) {
        if ($Y()) return { behavior: "allow", updatedInput: A };
        return { behavior: "ask", message: "Exit plan mode?", updatedInput: A };
    },
    async call(A, q) {
        let K = !!q.agentId,
            Y = Fj(q.agentId),       // Plan file path
            z = sJ(q.agentId);       // Plan content

        // === SWARM TEAMMATE PATH ===
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
                text: B6(M),
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

        // === MAIN SESSION PATH ===
        let _ = q.getAppState(),
            w = _.toolPermissionContext.prePlanMode === "ultraplan",
            O = null;

        // Determine restored mode
        let H = _.toolPermissionContext.prePlanMode ?? "default",
            j = H === "ultraplan" ? "default" : H;

        // Handle auto-mode gate
        if ((j === "auto" || false) && !(sl6?.isAutoModeGateEnabled() ?? false)) {
            let M = sl6?.getAutoModeUnavailableReason() ?? "circuit-breaker";
            O = sl6?.getAutoModeUnavailableNotification(M) ?? "auto mode unavailable";
        }

        // Show notification if auto-mode fell back
        if (O) q.addNotification?.({
            key: "auto-mode-gate-plan-exit-fallback",
            text: `plan exit → default · ${O}`,
            priority: "immediate",
            color: "warning",
            timeoutMs: 1e4
        });

        // Update state
        q.setAppState((M) => {
            if (M.toolPermissionContext.mode !== "plan") return M;

            // Set global flags
            HV(!0);  // setHasExitedPlanMode
            JS(!0);  // setNeedsPlanModeExitAttachment

            // Restore previous mode
            let J = M.toolPermissionContext.prePlanMode ?? "default",
                D = J === "ultraplan" ? "default" : J;

            // Handle auto-mode gate
            if ((D === "auto" || false) && !(sl6?.isAutoModeGateEnabled() ?? false)) {
                D = "default";
            }

            return {
                ...M,
                toolPermissionContext: {
                    ...M.toolPermissionContext,
                    mode: D,
                    prePlanMode: void 0
                }
            };
        });

        let $ = E7() && q.options.tools.some((M) => z3(M, r4));

        return {
            data: {
                plan: z,
                isAgent: K,
                filePath: Y,
                hasTaskTool: $ || void 0,
                isUltraplan: w || void 0
            }
        };
    },
    mapToolResultToToolResultBlockParam({ isAgent, plan, filePath, hasTaskTool, awaitingLeaderApproval, requestId, isUltraplan }, toolUseId) {
        // Swarm teammate awaiting approval
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

**Important:** Do NOT proceed until you receive approval.

Request ID: ${requestId}`,
                tool_use_id: toolUseId
            };
        }

        // Agent context (approved)
        if (isAgent) {
            return {
                type: "tool_result",
                content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
                tool_use_id: toolUseId
            };
        }

        // No plan content
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
        const teamHint = hasTaskTool
            ? `\n\nIf this plan can be broken down into multiple independent tasks, consider using the Agent tool to create a team and parallelize the work.`
            : "";

        return {
            type: "tool_result",
            content: `User has approved your plan. You can now start coding.

Your plan has been saved to: ${filePath}
You can refer back to it if needed during implementation.${teamHint}

## Approved Plan:
${plan}`,
            tool_use_id: toolUseId
        };
    }
};

// READABLE (for understanding):
const ExitPlanModeTool = {
    name: "ExitPlanMode",
    searchHint: "present plan for approval and start coding (plan mode only)",
    maxResultSizeChars: 100000,

    async description() {
        return "Prompts the user to exit plan mode and start coding";
    },

    requiresUserInteraction() {
        // Swarm teammates don't need direct user interaction (team-lead approves)
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
        const appState = sessionContext.getAppState();
        const isUltraplan = appState.toolPermissionContext.prePlanMode === "ultraplan";

        // Determine restored mode
        let restoredMode = appState.toolPermissionContext.prePlanMode ?? "default";
        if (restoredMode === "ultraplan") restoredMode = "default";

        // Handle auto-mode gate
        let autoModeFallback = null;
        if (restoredMode === "auto" && !isAutoModeGateEnabled()) {
            autoModeFallback = getAutoModeUnavailableNotification();
            restoredMode = "default";
        }

        // Show notification if fallback occurred
        if (autoModeFallback) {
            sessionContext.addNotification?.({
                key: "auto-mode-gate-plan-exit-fallback",
                text: `plan exit → default · ${autoModeFallback}`,
                priority: "immediate",
                color: "warning",
                timeoutMs: 10000
            });
        }

        // Update state
        sessionContext.setAppState((state) => {
            if (state.toolPermissionContext.mode !== "plan") return state;

            // Set global flags
            setHasExitedPlanMode(true);
            setNeedsPlanModeExitAttachment(true);

            return {
                ...state,
                toolPermissionContext: {
                    ...state.toolPermissionContext,
                    mode: restoredMode,
                    prePlanMode: undefined
                }
            };
        });

        const hasTaskTool = isTeamEnabled() &&
            sessionContext.options.tools.some(t => matchesToolName(t, "Agent"));

        return {
            data: {
                plan: planContent,
                isAgent,
                filePath: planFilePath,
                hasTaskTool: hasTaskTool || undefined,
                isUltraplan: isUltraplan || undefined
            }
        };
    }
};

// Mapping: zD→ExitPlanModeTool, aJ→"ExitPlanMode", $Y→isSwarmTeammate,
//          Fj→getPlanFilePath, sJ→readPlanFile, i3→getAgentName, l5→getTeamId,
//          x3→writeToMailbox, HV→setHasExitedPlanMode, JS→setNeedsPlanModeExitAttachment,
//          E7→isTeamEnabled, z3→matchesToolName, r4→"Agent"
```

---

## 3. Tool Filtering Algorithm

### What it does

Filters available tools when in plan mode to restrict access to read-only operations.

### Filtering Rules

| Tool | Allowed? | Condition |
|------|----------|-----------|
| Read | ✅ Yes | Always (read-only) |
| Grep | ✅ Yes | Always (read-only) |
| Glob | ✅ Yes | Always (read-only) |
| WebFetch | ✅ Yes | Always (read-only) |
| Write | ✅ Yes | Only to plan file path |
| Edit | ✅ Yes | Only to plan file path |
| ExitPlanMode | ✅ Yes | Only programmatic exit |
| EnterPlanMode | ✅ Yes | For re-entry |
| AskUserQuestion | ✅ Yes | For clarification |
| Bash | ❌ No | Blocked |
| Agent | ❌ No | Blocked |

```javascript
// ============================================
// filterToolsForPlanMode - Filter tools for plan mode
// ============================================

// READABLE (for understanding):
function filterToolsForPlanMode(tools, planFilePath) {
    return tools.filter(tool => {
        // Always allow read-only tools
        if (tool.isReadOnly?.()) return true;

        // Allow ExitPlanMode
        if (tool.name === "ExitPlanMode") return true;

        // Allow EnterPlanMode (for re-entry)
        if (tool.name === "EnterPlanMode") return true;

        // Allow AskUserQuestion
        if (tool.name === "AskUserQuestion") return true;

        // Allow Write/Edit only to plan file
        // (Path is checked at execution time against planFilePath)
        if (tool.name === "Write" || tool.name === "Edit") {
            return true;  // Path validation happens in tool.call()
        }

        // Block all other tools
        return false;
    });
}

// Path validation in Write/Edit tools during plan mode:
// if (mode === "plan" && filePath !== planFilePath) {
//     throw Error("In plan mode, you can only write to the plan file");
// }
```

---

## 4. Plan Mode State Machine

### Mode Values

| Mode | Description | Entry |
|------|-------------|-------|
| `default` | Normal operation | Default |
| `plan` | Planning mode | EnterPlanMode |
| `acceptEdits` | Auto-accept edits | Shift+Tab |
| `delegate` | Delegate mode | For teammate agents |
| `bypassPermissions` | Skip prompts | Configuration |
| `dontAsk` | Minimize prompts | Configuration |
| `auto` | Auto-accept mode | Gated feature |

### State Transitions

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

State fields:
- mode: Current mode
- prePlanMode: Mode to restore on exit
- hasExitedPlanMode: Global flag for attachment
- needsPlanModeExitAttachment: Attachment pending
```

---

## System Reminder Integration

### Attachment Types

| Attachment Type | Trigger | Description |
|-----------------|---------|-------------|
| `plan_mode` | EnterPlanMode | Full 5-phase workflow instructions |
| `plan_mode_reentry` | Re-enter plan mode | Brief reminder |
| `plan_mode_exit` | ExitPlanMode | Exit notification |
| `plan_file_reference` | Post-compact | Existing plan file content |

### Attachment Variants

```javascript
function planModeReminderDispatcher(attachment) {
    if (attachment.isSubAgent) {
        return formatSubagentPlanReminder(attachment);  // Brief, no plan file editing
    }
    if (attachment.reminderType === "sparse") {
        return formatSparsePlanReminder(attachment);    // Short reminder
    }
    if (attachment.iterativeMode) {
        return formatIterativePlanReminder(attachment); // Pair-planning workflow
    }
    return formatFullPlanReminder(attachment);          // 5-phase workflow
}
```

---

## Symbol Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| Ki6 | EnterPlanModeTool | chunks.144.mjs:1579 | ✅ Grep verified |
| zD | ExitPlanModeTool | chunks.143.mjs:2802 | ✅ Grep verified |
| dt | TOOL_NAME_ENTER_PLAN_MODE | chunks.90.mjs:3121 | ✅ Grep verified |
| aJ | TOOL_NAME_EXIT_PLAN_MODE | chunks.90.mjs:507 | ✅ Grep verified |
| Dp | handlePlanModeTransition | chunks.1.mjs:2946 | ✅ Grep verified |
| $Y | isSwarmTeammate | chunks.*.mjs | ✅ Grep verified |
| Fj | getPlanFilePath | chunks.*.mjs | ✅ Grep verified |
| sJ | readPlanFile | chunks.*.mjs | ✅ Grep verified |
| HV | setHasExitedPlanMode | chunks.*.mjs | ✅ Grep verified |
| JS | setNeedsPlanModeExitAttachment | chunks.*.mjs | ✅ Grep verified |