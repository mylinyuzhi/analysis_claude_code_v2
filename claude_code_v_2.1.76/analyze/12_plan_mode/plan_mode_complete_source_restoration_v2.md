# Plan Mode Module - Complete Source Restoration v2 (Claude Code 2.1.76)

> **Complete source-level restoration** of the plan mode system with cross-validated symbols and detailed algorithm analysis.
> **Version 2** - Enhanced with swarm approval workflow and UI integration.

---

## Related Symbols

> Symbol mappings: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions documented here:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `handlePlanModeTransition` (Dp) - Mode state hooks - chunks.1.mjs:2946
- `TOOL_NAME_ENTER_PLAN_MODE` (dt) - "EnterPlanMode" - chunks.90.mjs:3121
- `TOOL_NAME_EXIT_PLAN_MODE` (aJ) - "ExitPlanMode" - chunks.90.mjs:507

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

## 1. EnterPlanModeTool (Ki6) - Mode Entry

### What it does

Requests permission to enter plan mode for complex tasks requiring exploration and design. This is a read-only tool that sets the session mode to "plan".

### How it works

1. Validate that tool is not being used in agent contexts
2. Call handlePlanModeTransition with current mode and "plan"
3. Update app state with new mode
4. Return success message with planning instructions

### Why this approach

- **State preservation** via prePlanMode enables proper restoration
- **Transition hook** manages attachment flags
- **Agent context check** prevents nested planning

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
    isEnabled() { return true; },
    isConcurrencySafe() { return true; },
    isReadOnly() { return true; },  // Safe to use in plan mode
    toAutoClassifierInput() { return ""; },

    // Always allowed - entering plan mode is safe
    async checkPermissions(input) {
        return { behavior: "allow", updatedInput: input };
    },

    // UI render methods
    renderToolUseMessage: renderEnterPlanUse,
    renderToolUseProgressMessage: renderEnterPlanProgress,
    renderToolResultMessage: renderEnterPlanResult,
    renderToolUseRejectedMessage: renderEnterPlanRejected,
    renderToolUseErrorMessage: renderEnterPlanError,

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

// Mapping: Ki6→EnterPlanModeTool, dt→"EnterPlanMode", v8q→getPlanModePrompt,
//          hIY→strictObjectSchema, SIY→messageSchema, Dp→handlePlanModeTransition,
//          Ez→updateMode, LT6→savePrePlanMode, rO→isSubAgentMode
```

---

## 2. ExitPlanModeTool (zD) - Mode Exit with Approval

### What it does

Prompts the user to exit plan mode and start coding. For swarm teammates, routes approval request to team-lead.

### How it works

1. Validate user is in plan mode
2. Check if swarm teammate with team features enabled
   - If yes: Send plan_approval_request to team-lead inbox
   - If no: Show approval dialog to user
3. On approval: Restore mode from prePlanMode
4. Set hasExitedPlanMode and needsPlanModeExitAttachment flags
5. Return plan content and file path

### Why this approach

- **Swarm integration** enables teammate plan approval workflow
- **Mode restoration** properly returns to previous state
- **Attachment flags** trigger system reminder generation

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
    requiresUserInteraction() {
        if ($Y()) return !1;  // Swarm teammate - no UI interaction needed
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
                hasTaskTool: E7() && q.options.tools.some((H) => z3(H, r4))
            }
        };
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
    },

    // ... render methods and mapToolResultToToolResultBlockParam
};

// Mapping: zD→ExitPlanModeTool, aJ→"ExitPlanMode", $Y→isSwarmTeammate,
//          Fj→getPlanFilePath, sJ→readPlanFile, i3→getAgentName, l5→getTeamId,
//          x3→writeToMailbox, HV→setHasExitedPlanMode, JS→setNeedsPlanModeExitAttachment
```

---

## 3. Mode State Machine

### Mode Values

| Mode | Description |
|------|-------------|
| `default` | Normal operation |
| `plan` | Planning mode (read-only + plan file) |
| `acceptEdits` | Auto-accept edits mode |
| `delegate` | Delegate mode for teammate agents |
| `bypassPermissions` | Skip permission prompts |
| `dontAsk` | Minimize user prompts |
| `auto` | Auto-accept mode (gated) |

### State Diagram

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
```

---

## 4. Tool Filtering Algorithm

### Plan Mode Tool Restrictions

```javascript
// ============================================
// filterToolsForPlanMode - Restrict tools in plan mode
// ============================================

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
        // (Path checked at execution time against planFilePath)
        if (tool.name === "Write" || tool.name === "Edit") {
            return true;  // Execution-time check
        }

        // Block all other tools
        return false;
    });
}
```

---

## 5. Swarm Approval Workflow

### Message Flow

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

### Message Schemas

```javascript
// plan_approval_request
{
    type: "plan_approval_request",
    from: string,           // Agent name
    timestamp: string,      // ISO timestamp
    planFilePath: string,   // Path to plan file
    planContent: string,    // Full plan content
    requestId: string       // Unique identifier
}

// plan_approval_response
{
    type: "plan_approval_response",
    approved: boolean,      // Approval status
    feedback?: string       // Optional revision feedback
}
```

---

## Key Algorithms

### Plan Mode Entry Algorithm

```
EnterPlanMode.call()
    │
    ├─→ Check agent context
    │     └─→ If agentId: throw Error
    │
    ├─→ Get current state
    │
    ├─→ Call handlePlanModeTransition(fromMode, "plan")
    │     └─→ Sets needsPlanModeExitAttachment flag
    │
    ├─→ Update state:
    │     ├─→ prePlanMode = current mode
    │     └─→ mode = "plan"
    │
    └─→ Return success message
```

### Plan Mode Exit Algorithm

```
ExitPlanMode.call()
    │
    ├─→ Validate in plan mode
    │
    ├─→ Is swarm teammate?
    │     ├─→ Yes: Send plan_approval_request
    │     │        Return awaitingLeaderApproval
    │     │
    │     └─→ No: Show approval dialog
    │              ├─→ Approved: Continue
    │              └─→ Rejected: Stay in plan mode
    │
    ├─→ Set hasExitedPlanMode = true
    ├─→ Set needsPlanModeExitAttachment = true
    │
    ├─→ Restore mode from prePlanMode
    │
    └─→ Return plan data
```

---

## Cross-Module Integration

### Plan Mode ↔ System Reminder (04)

- `plan_mode` - Full 5-phase workflow instructions (injected each turn)
- `plan_mode_reentry` - Re-entering plan mode (brief reminder)
- `plan_mode_exit` - Exited plan mode notification
- `plan_file_reference` - Existing plan file content (post-compact)

### Plan Mode ↔ Tools (05)

- Tool filtering via `isReadOnly()` check
- Write/Edit path restriction to plan file
- ExitPlanMode as only programmatic exit
- EnterPlanMode allowed for re-entry

### Plan Mode ↔ Hooks (11)

- PreToolUse hooks can modify tool availability
- PostToolUse hooks for plan file changes
- PreCompact hooks for plan preservation

### Plan Mode ↔ Compact (07)

- Plan preserved as state-preservation attachment
- Plan file not affected by compaction
- `plan_file_reference` attachment injected post-compact

### Plan Mode ↔ Agent Teams (30)

- Swarm teammate plan approval workflow
- plan_approval_request/response messaging
- Team-lead reviews and approves/rejects

---

## Symbol Validation Status

**Last validated:** 2026-03-27

| Symbol | Location | Status |
|--------|----------|--------|
| Ki6 (EnterPlanModeTool) | chunks.144.mjs:1579 | ✅ Correct |
| zD (ExitPlanModeTool) | chunks.143.mjs:2802 | ✅ Correct |
| dt (TOOL_NAME_ENTER_PLAN_MODE) | chunks.90.mjs:3121 | ✅ Correct |
| aJ (TOOL_NAME_EXIT_PLAN_MODE) | chunks.90.mjs:507 | ✅ Correct |
| Dp (handlePlanModeTransition) | chunks.1.mjs:2946 | ✅ Correct |
| AhY (handlePlanApproval) | chunks.145.mjs:2521 | ✅ Correct |
| Vx4 (PlanApprovalRequestMessageSchema) | chunks.129.mjs:1546 | ✅ Correct |
| Nx4 (PlanApprovalResponseMessageSchema) | chunks.129.mjs:1553 | ✅ Correct |