# Plan Mode Algorithm Deep Dive - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Source-level documentation with ORIGINAL/READABLE code

---

## Overview

This document provides in-depth analysis of the key algorithms in the Plan Mode module, including mode transitions, tool filtering, approval workflows, and swarm integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions analyzed here:
- `EnterPlanModeTool` (Ki6) - Entry tool - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit tool - chunks.143.mjs:2802
- `handlePlanModeTransition` (Dp) - Mode hooks - chunks.1.mjs:2946
- `handlePlanApproval` (AhY) - Swarm approval - chunks.145.mjs:2521

---

## 1. Mode Transition Algorithm

### What it does

Manages the state transitions when entering and exiting plan mode, including saving/restoring previous mode and managing attachment flags.

### Mode Values

| Mode | Description |
|------|-------------|
| `default` | Normal operation |
| `plan` | Planning mode (read-only + plan file) |
| `acceptEdits` | Auto-accept edits mode |
| `delegate` | Delegate mode for teammate agents |
| `bypassPermissions` | Skip permission prompts |
| `dontAsk` | Minimize user prompts |

### Mode Transition Flow

```
EnterPlanMode called
    │
    ├─→ Step 1: Get current mode
    │     └─→ currentMode = state.toolPermissionContext.mode
    │
    ├─→ Step 2: Call transition hook
    │     └─→ handlePlanModeTransition(currentMode, "plan")
    │           ├─→ entering plan: reset needsPlanModeExitAttachment
    │           └─→ leaving plan: set needsPlanModeExitAttachment
    │
    ├─→ Step 3: Save previous mode
    │     └─→ prePlanMode = currentMode
    │
    ├─→ Step 4: Set new mode
    │     └─→ mode = "plan"
    │
    └─→ Step 5: Generate plan_mode attachment
          └─→ Inject into conversation context
```

### handlePlanModeTransition (Dp)

```javascript
// ============================================
// handlePlanModeTransition - Mode transition hook
// Location: chunks.1.mjs:2946-2950
// ============================================

// ORIGINAL (for source lookup):
function Dp(A, q) {
    if (q === "plan" && A !== "plan") {
        // Entering plan mode: reset exit attachment flag
        JS(!1)
    }
    if (A === "plan" && q !== "plan") {
        // Leaving plan mode: mark need for exit attachment
        JS(!0)
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

// Mapping: Dp→handlePlanModeTransition, A→fromMode, q→toMode,
//          JS→setNeedsPlanModeExitAttachment
```

---

## 2. EnterPlanMode Algorithm (Ki6)

### What it does

Transitions the agent into plan mode, restricting tool access and enabling the planning workflow.

### How it works

```
EnterPlanMode tool called
    │
    ├─→ Step 1: Check agent context
    │     └─→ agentId present → Throw error (not allowed in agents)
    │
    ├─→ Step 2: Get current state
    │     └─→ appState = sessionContext.getAppState()
    │
    ├─→ Step 3: Call transition hook
    │     └─→ handlePlanModeTransition(currentMode, "plan")
    │
    ├─→ Step 4: Update state
    │     ├─→ Save previous mode → prePlanMode
    │     └─→ Set mode → "plan"
    │
    └─→ Step 5: Return success message
          └─→ Message with plan mode instructions
```

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

    shouldDefer: true,  // Defer to end of turn
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

        // Trigger mode transition hook
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

## 3. ExitPlanMode Algorithm (zD)

### What it does

Exits plan mode and presents the plan for user approval. In swarm mode, routes approval to team-lead.

### How it works

```
ExitPlanMode tool called
    │
    ├─→ Step 1: Check if in plan mode
    │     └─→ Not in plan mode → Return error
    │
    ├─→ Step 2: Check if swarm teammate
    │     ├─→ Yes → Send plan_approval_request to team-lead
    │     │         └─→ Wait for plan_approval_response
    │     └─→ No → Continue to local approval
    │
    ├─→ Step 3: Get plan file content
    │     └─→ planContent = readPlanFile(planFilePath)
    │
    ├─→ Step 4: Check requires user interaction
    │     └─→ Yes → Show approval dialog
    │
    ├─→ Step 5: Handle user response
    │     ├─→ Approved → Restore mode, set hasExitedPlanMode
    │     └─→ Rejected → Stay in plan mode
    │
    └─→ Step 6: Return result
          └─→ plan data, approval status
```

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

    async description() {
        return "Prompts the user to exit plan mode and start coding";
    },

    requiresUserInteraction() {
        // Swarm teammates don't need user interaction (team-lead approves)
        if (isSwarmTeammate()) {
            return false;
        }
        return true;
    },

    async validateInput(input, { getAppState, options }) {
        // Swarm teammates skip validation
        if (isSwarmTeammate()) {
            return { result: true };
        }

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
            if (state.toolPermissionContext.mode !== "plan") {
                return state;
            }

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
//          x3→writeToMailbox, HV→setHasExitedPlanMode, JS→setNeedsPlanModeExitAttachment,
//          NF6→isTeamFeaturesEnabled, E7→isTeamEnabled
```

---

## 4. Tool Filtering Algorithm

### What it does

Filters the available tool set based on the current mode, restricting write operations in plan mode.

### Filtered Tool Sets

| Mode | Allowed Tools |
|------|---------------|
| `plan` | ReadOnly tools + ExitPlanMode + EnterPlanMode + AskUserQuestion + Write/Edit (plan file only) |
| `default` | All tools |
| `bypassPermissions` | All tools (no prompts) |

```javascript
// ============================================
// filterToolsForPlanMode - Tool filtering for plan mode
// ============================================

function filterToolsForPlanMode(tools, planFilePath) {
    return tools.filter((tool) => {
        // Always allow read-only tools
        if (tool.isReadOnly?.()) {
            return true;
        }

        // Allow ExitPlanMode
        if (tool.name === "ExitPlanMode") {
            return true;
        }

        // Allow EnterPlanMode (for re-entry)
        if (tool.name === "EnterPlanMode") {
            return true;
        }

        // Allow AskUserQuestion
        if (tool.name === "AskUserQuestion") {
            return true;
        }

        // Allow Write/Edit (path checked at execution time)
        if (tool.name === "Write" || tool.name === "Edit") {
            return true;
        }

        // Block all other tools
        return false;
    });
}

// Path validation at execution time
async function validatePlanModeWritePath(filePath, planFilePath) {
    const normalizedPath = normalizePath(filePath);
    const normalizedPlanPath = normalizePath(planFilePath);

    if (normalizedPath !== normalizedPlanPath) {
        throw new Error(
            `In plan mode, you can only write to the plan file: ${planFilePath}`
        );
    }
}
```

---

## 5. Swarm Approval Algorithm

### What it does

Handles plan approval workflow for swarm teammates, routing approval requests to the team-lead and processing responses.

### Approval Flow

```
Teammate calls ExitPlanMode
    │
    ├─→ Check if plan file exists
    │     └─→ No plan → Throw error
    │
    ├─→ Build plan_approval_request message
    │     {
    │       type: "plan_approval_request",
    │       from: agentName,
    │       planFilePath,
    │       planContent,
    │       requestId
    │     }
    │
    ├─→ Send to team-lead inbox
    │     └─→ writeToMailbox("team-lead", message, teamId)
    │
    ├─→ Return awaitingLeaderApproval: true
    │
    └─→ Team-lead processes request
          ├─→ Show approval dialog
          ├─→ Send plan_approval_response
          └─→ Teammate receives response
                ├─→ Approved → Exit plan mode
                └─→ Rejected → Stay in plan mode
```

### handlePlanApproval (AhY)

```javascript
// ============================================
// handlePlanApproval - Process plan approval in team-lead
// Location: chunks.145.mjs:2521-2570
// ============================================

async function handlePlanApproval(message, sessionContext) {
    const { planFilePath, planContent, requestId, from } = message;

    // Show approval dialog
    const approvalResult = await showPlanApprovalDialog({
        planContent,
        from,
        planFilePath
    });

    // Send response to teammate
    const response = {
        type: "plan_approval_response",
        requestId,
        approved: approvalResult.approved,
        feedback: approvalResult.feedback,
        timestamp: new Date().toISOString()
    };

    await writeToMailbox(from, {
        from: "team-lead",
        text: JSON.stringify(response),
        timestamp: new Date().toISOString()
    }, sessionContext.teamId);

    return response;
}
```

---

## 6. Plan Mode Attachment Variants

### Attachment Types

| Variant | When Used | Content |
|---------|-----------|---------|
| Full format | Main agent, first entry | Complete 5-phase workflow |
| Sparse format | After turn count threshold | Minimal reminder |
| Subagent format | Nested agents | Brief, no plan file editing |
| Reentry format | Re-entering plan mode | Quick reminder |

```javascript
// ============================================
// Plan mode attachment variants
// ============================================

function getPlanModeAttachment(context) {
    const { isSubAgent, reminderType, iterativeMode } = context;

    // Subagent format: Brief for nested agents
    if (isSubAgent) {
        return formatSubagentPlanReminder(context);
    }

    // Sparse format: Minimal after threshold
    if (reminderType === "sparse") {
        return formatSparsePlanReminder(context);
    }

    // Iterative format: Pair-planning workflow
    if (iterativeMode) {
        return formatIterativePlanReminder(context);
    }

    // Full format: Complete 5-phase workflow
    return formatFullPlanReminder(context);
}
```

---

## Validation Summary

| Algorithm | Status | Key Functions |
|-----------|--------|---------------|
| Mode Transition | ✅ Verified | Dp @ chunks.1.mjs:2946 |
| EnterPlanMode | ✅ Verified | Ki6 @ chunks.144.mjs:1579 |
| ExitPlanMode | ✅ Verified | zD @ chunks.143.mjs:2802 |
| Swarm Approval | ✅ Verified | AhY @ chunks.145.mjs:2521 |
| Tool Filtering | ✅ Verified | filterToolsForPlanMode |

---

## Quick Reference

### Mode Values

```javascript
const MODES = {
    DEFAULT: "default",
    PLAN: "plan",
    ACCEPT_EDITS: "acceptEdits",
    DELEGATE: "delegate",
    BYPASS_PERMISSIONS: "bypassPermissions",
    DONT_ASK: "dontAsk"
};
```

### Plan Mode State

```javascript
interface PlanModeState {
    mode: "plan";
    prePlanMode: string;
    hasExitedPlanMode: boolean;
    needsPlanModeExitAttachment: boolean;
    planFilePath: string;
}
```

### Swarm Message Types

```javascript
// Request
{
    type: "plan_approval_request",
    from: string,
    planFilePath: string,
    planContent: string,
    requestId: string
}

// Response
{
    type: "plan_approval_response",
    requestId: string,
    approved: boolean,
    feedback?: string
}
```