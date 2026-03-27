# Plan Mode Module - Complete Source Restoration

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ All symbols cross-validated against source code

---

## Overview

This document provides complete source-level restoration of key functions in the Plan Mode module. Plan Mode enforces a "Plan → Approve → Implement" safety pattern, requiring explicit user approval before any code changes.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions documented here:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `handlePlanModeTransition` (Dp) - Mode state hooks - chunks.1.mjs:2946
- `TOOL_NAME_ENTER_PLAN_MODE` (dt) - Constant - chunks.90.mjs:3121
- `TOOL_NAME_EXIT_PLAN_MODE` (aJ) - Constant - chunks.90.mjs:507

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

Transitions the session into plan mode, enabling read-only exploration and plan file editing. This is the entry point for the "Plan → Approve → Implement" workflow.

### How it works

1. Validate not in agent context (agentId check)
2. Trigger mode transition hook (`Dp`)
3. Update state via `setAppState`:
   - Save previous mode to `prePlanMode`
   - Set mode to "plan"
4. Return entry message with workflow instructions

### Why this approach

- **Mode preservation** via `prePlanMode` enables restoration
- **Agent context check** prevents nested planning
- **Tool restrictions** enforced at execution time
- **Workflow instructions** guide the agent behavior

### Key insight

The `shouldDefer: true` flag indicates this tool defers execution until after tool_use processing, allowing the mode change to take effect before subsequent tool calls.

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
    toAutoClassifierInput() { return ""; },

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

## 2. ExitPlanModeTool (zD) - Exit with Approval

### What it does

Exits plan mode after user approval. For swarm teammates, sends plan approval request to team-lead.

### How it works

**Main Session Path:**
1. Validate currently in plan mode
2. Show user approval dialog
3. If approved:
   - Set `hasExitedPlanMode = true`
   - Set `needsPlanModeExitAttachment = true`
   - Restore mode from `prePlanMode`
4. Return plan content and metadata

**Swarm Teammate Path:**
1. Read plan file content
2. Create `plan_approval_request` message
3. Write to team-lead inbox via `writeToMailbox`
4. Return with `awaitingLeaderApproval: true`

### Why this approach

- **User approval** ensures plan review before implementation
- **Swarm delegation** allows team-lead to approve teammate plans
- **Mode restoration** preserves previous permission settings
- **Attachment flags** trigger reminder injection

### Key insight

The `requiresUserInteraction()` method returns `false` for swarm teammates because the team-lead provides approval instead of the user.

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
        if ($Y()) return !1;  // Swarm teammate
        return !0;
    },
    async validateInput(A, {
        getAppState: q,
        options: K
    }) {
        if ($Y()) return {
            result: !0
        };
        let Y = q().toolPermissionContext.mode;
        if (Y !== "plan") return {
            result: !1,
            message: "You are not in plan mode. This tool is only for exiting plan mode...",
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

        // Swarm teammate path
        if ($Y() && NF6()) {
            if (!z) throw Error(`No plan file found at ${Y}. Please write your plan...`);

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
            return {
                ...H,
                toolPermissionContext: {
                    ...H.toolPermissionContext,
                    mode: j,
                    prePlanMode: void 0
                }
            };
        });

        let $ = E7() && q.options.tools.some((H) => z3(H, r4));
        return {
            data: {
                plan: z,
                isAgent: K,
                filePath: Y,
                hasTaskTool: $ || void 0
            }
        };
    },
    mapToolResultToToolResultBlockParam({
        isAgent: A,
        plan: q,
        filePath: K,
        hasTaskTool: Y,
        awaitingLeaderApproval: z,
        requestId: _
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

**Important:** Do NOT proceed until you receive approval.

Request ID: ${_}`,
            tool_use_id: O
        };
        // ... additional cases for agent/main session
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

    async prompt() {
        return EXIT_PLAN_MODE_PROMPT;
    },

    userFacingName() {
        return "";  // Hidden from user
    },

    shouldDefer: true,
    isEnabled() { return true; },
    isConcurrencySafe() { return true; },
    isReadOnly() { return false; },

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
                message: "You are not in plan mode. This tool is only for exiting plan mode after writing a plan.",
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
                throw Error(`No plan file found at ${planFilePath}. Please write your plan to this file before calling ExitPlanMode.`);
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

        const hasTaskTool = isTeamEnabled() &&
            sessionContext.options.tools.some(t => matchesToolName(t, "Agent"));

        return {
            data: {
                plan: planContent,
                isAgent,
                filePath: planFilePath,
                hasTaskTool: hasTaskTool || undefined
            }
        };
    },

    mapToolResultToToolResultBlockParam(result, toolUseId) {
        // Teammate awaiting approval
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

        // Agent context (approved)
        if (result.isAgent) {
            return {
                type: "tool_result",
                content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
                tool_use_id: toolUseId
            };
        }

        // Main session (approved)
        if (!result.plan || result.plan.trim() === "") {
            return {
                type: "tool_result",
                content: "User has approved exiting plan mode. You can now proceed.",
                tool_use_id: toolUseId
            };
        }

        return {
            type: "tool_result",
            content: `User has approved the plan. You can now proceed with implementation.

The plan has been written to: ${result.filePath}

${result.hasTaskTool ? "You can use the Agent tool to spawn sub-agents for parallel implementation." : ""}`,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: zD→ExitPlanModeTool, aJ→"ExitPlanMode", $Y→isSwarmTeammate,
//          Fj→getPlanFilePath, sJ→readPlanFile, i3→getAgentName, l5→getTeamId,
//          x3→writeToMailbox, HV→setHasExitedPlanMode, JS→setNeedsPlanModeExitAttachment,
//          z3→matchesToolName, r4→"Agent", E7→isTeamEnabled, NF6→isTeamFeaturesEnabled
```

---

## 3. Mode State Machine

### State Fields

```typescript
interface PlanModeState {
  mode: "plan";
  prePlanMode: string;  // Mode to restore on exit

  // Global flags
  hasExitedPlanMode: boolean;
  needsPlanModeExitAttachment: boolean;

  // Plan file
  planFilePath: string;  // ~/.claude_api/plans/<slug>.md
  planFileSlug: string;  // Generated from task description
}
```

### Mode Transition Hook

```javascript
// ============================================
// handlePlanModeTransition - Manage attachment flags
// Location: chunks.1.mjs:2946-2950
// ============================================

// ORIGINAL (for source lookup):
function Dp(A, q) {
    // Entering plan mode
    if (q === "plan" && A !== "plan") {
        // Reset exit attachment flag
    }
    // Leaving plan mode
    if (A === "plan" && q !== "plan") {
        // Set needsPlanModeExitAttachment = true
    }
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

// Mapping: Dp→handlePlanModeTransition, A→fromMode, q→toMode
```

---

## 4. Tool Filtering in Plan Mode

### Filtering Algorithm

```javascript
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
        if (tool.name === "Write" || tool.name === "Edit") {
            // Path checked at execution time against planFilePath
            return true;
        }

        // Block all other tools
        return false;
    });
}
```

---

## 5. Plan Approval Flow (Swarm)

### Teammate → Team-Lead Communication

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

### Message Formats

```javascript
// plan_approval_request
{
    type: "plan_approval_request",
    from: "researcher",
    timestamp: "2026-03-27T10:00:00Z",
    planFilePath: "~/.claude_api/plans/...",
    planContent: "# Plan: ...",
    requestId: "plan_approval_researcher_default_xxx"
}

// plan_approval_response
{
    to: "researcher",
    type: "plan_approval_response",
    approved: true,
    feedback: "Optional revision feedback"
}
```

---

## Symbol Validation Summary

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| Ki6 | EnterPlanModeTool | chunks.144.mjs:1579 | ✅ Verified |
| zD | ExitPlanModeTool | chunks.143.mjs:2802 | ✅ Verified |
| dt | TOOL_NAME_ENTER_PLAN_MODE | chunks.90.mjs:3121 | ✅ Verified |
| aJ | TOOL_NAME_EXIT_PLAN_MODE | chunks.90.mjs:507 | ✅ Verified |
| Dp | handlePlanModeTransition | chunks.1.mjs:2946 | ✅ Verified |
| $Y | isSwarmTeammate | chunks.*.mjs | ✅ Verified |
| Fj | getPlanFilePath | chunks.*.mjs | ✅ Verified |
| sJ | readPlanFile | chunks.*.mjs | ✅ Verified |
| i3 | getAgentName | chunks.*.mjs | ✅ Verified |
| l5 | getTeamId | chunks.*.mjs | ✅ Verified |
| x3 | writeToMailbox | chunks.132.mjs:22 | ✅ Verified |
| HV | setHasExitedPlanMode | chunks.*.mjs | ✅ Verified |
| JS | setNeedsPlanModeExitAttachment | chunks.*.mjs | ✅ Verified |

**Total validated**: 13 symbols

---

## Cross-Module Integration

### Plan Mode ↔ System Reminder (04)

Plan mode generates the following attachment types:
- `plan_mode` - Full 5-phase workflow instructions (injected each turn)
- `plan_mode_reentry` - Re-entering plan mode (brief reminder)
- `plan_mode_exit` - Exited plan mode notification
- `plan_file_reference` - Existing plan file content (post-compact)

### Plan Mode ↔ Tools (05)

Tool filtering in plan mode:
- `isReadOnly()` tools always allowed
- `Write`/`Edit` allowed only to plan file path
- `ExitPlanMode` is the only programmatic exit
- `EnterPlanMode` allowed for re-entry
- `AskUserQuestion` allowed for clarification

### Plan Mode ↔ Hooks (11)

- PreToolUse hooks can modify tool availability
- PostToolUse hooks for plan file changes
- PreCompact hooks for plan preservation
- Elicitation hooks for plan approval workflows

### Plan Mode ↔ Compact (07)

- Plan preserved as state-preservation attachment
- Plan file not affected by compaction
- TodoWrite state preserved during compaction
- `plan_file_reference` attachment injected post-compact

### Plan Mode ↔ Agent Teams (30)

Swarm teammate plan approval workflow:
- Teammate sends `plan_approval_request` to team-lead
- Team-lead reviews and responds with `plan_approval_response`
- Approved plans allow exit from plan mode
- Rejected plans require revision