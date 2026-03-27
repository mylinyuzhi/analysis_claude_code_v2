# Plan Mode Cross-Module Integration (Claude Code v2.1.76)

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Focus**: Integration with System Reminder, Tools, Hooks, Compact, Agent Teams

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions in this document:
- `handlePlanModeTransition` (Dp) - Mode state hooks - chunks.1.mjs:2946
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `writeToMailbox` (x3) - Team communication - chunks.132.mjs:22

---

## Integration Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    PLAN MODE CROSS-MODULE INTEGRATION                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│                              ┌─────────────────────┐                          │
│                              │     PLAN MODE       │                          │
│                              │     (12_module)     │                          │
│                              └─────────┬───────────┘                          │
│                                        │                                       │
│     ┌──────────────────┬───────────────┼───────────────┬──────────────────┐   │
│     │                  │               │               │                  │   │
│     ▼                  ▼               ▼               ▼                  ▼   │
│ ┌────────┐      ┌──────────┐     ┌────────┐     ┌──────────┐      ┌─────────┐ │
│ │ SYSTEM │      │  TOOLS   │     │ HOOKS  │     │ COMPACT  │      │  AGENT  │ │
│ │REMINDER│      │  (05)    │     │  (11)  │     │   (07)   │      │  TEAMS  │ │
│ │  (04)  │      └──────────┘     └────────┘     └──────────┘      │  (30)   │ │
│ └────────┘                                                        └─────────┘ │
│                                                                                │
│ Integration Types:                                                            │
│ • System Reminder: Attachment injection, mode state propagation               │
│ • Tools: Tool filtering, execution restrictions, path validation              │
│ • Hooks: PreToolUse blocking, PostToolUse notifications                      │
│ • Compact: Plan preservation, state serialization                             │
│ • Agent Teams: Swarm approval workflow, mailbox communication                 │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Plan Mode ↔ System Reminder (04)

### Attachment Types

**What it does:**
System Reminder module injects plan-mode-specific attachments based on current session state, providing context and workflow guidance to the LLM.

```javascript
// ============================================
// Plan Mode Attachment Generation
// Location: chunks.1.mjs (attachment generation)
// ============================================

// ORIGINAL (for source lookup):
// Attachment is generated when mode === "plan"
// Content includes workflow instructions and restrictions

// READABLE (for understanding):
const PLAN_MODE_ATTACHMENT_CONFIG = {
    // Primary attachment: full workflow (injected each turn)
    plan_mode: {
        trigger: (state) => state.toolPermissionContext.mode === "plan",
        priority: 100,
        content: generatePlanModeContent,
        cacheKey: "plan_mode_workflow"
    },

    // Re-entry reminder (subsequent turns)
    plan_mode_reentry: {
        trigger: (state) =>
            state.toolPermissionContext.mode === "plan" &&
            state.turnCount > 1,
        priority: 50,
        content: "Continue planning. Use ExitPlanMode when ready."
    },

    // Exit notification
    plan_mode_exit: {
        trigger: (state) =>
            state.hasExitedPlanMode &&
            state.needsPlanModeExitAttachment,
        priority: 100,
        content: generatePlanExitContent,
        clearFlag: "needsPlanModeExitAttachment"
    },

    // Plan file reference (post-compact)
    plan_file_reference: {
        trigger: (state) =>
            state.postCompact &&
            state.hasExitedPlanMode,
        priority: 75,
        content: (state) => readPlanFile(state.agentId)
    }
};
```

### Attachment Content Structure

```javascript
// ============================================
// plan_mode Attachment Content
// Location: chunks.144.mjs (prompt generation)
// ============================================

// READABLE (for understanding):
function generatePlanModeContent(state) {
    const planFilePath = getPlanFilePath(state.agentId);

    return {
        type: "plan_mode",
        content: `You are currently in plan mode.

**Plan File:** ${planFilePath}

**Workflow:**
1. **Explore** - Read files, understand existing patterns, search for relevant code
2. **Design** - Consider multiple approaches, evaluate trade-offs
3. **Clarify** - Use AskUserQuestion to resolve ambiguities
4. **Document** - Write your plan to the plan file
5. **Exit** - Use ExitPlanMode to present for approval

**Restrictions:**
- READ-ONLY: You cannot modify files except the plan file
- Write/Edit tools are only allowed for: ${planFilePath}
- You MUST use ExitPlanMode to exit plan mode

**Important:**
- Focus on understanding before planning
- Identify similar features to follow existing patterns
- Consider edge cases and error handling
- Include specific files to modify in your plan`,
        metadata: {
            planFilePath: planFilePath,
            mode: "plan",
            allowedWritePaths: [planFilePath]
        }
    };
}

function generatePlanExitContent(state) {
    return {
        type: "plan_mode_exit",
        content: `The plan has been approved. You are now in implementation mode.

**Plan File:** ${state.planFilePath}

You should now implement the plan. Remember:
- Follow the plan you wrote
- Use the Agent tool for parallel implementation if available
- Test your changes as you go`,
        metadata: {
            planFilePath: state.planFilePath,
            previousMode: "plan"
        }
    };
}
```

### State Propagation

```javascript
// ============================================
// Plan Mode State to System Reminder
// Location: chunks.1.mjs (state management)
// ============================================

// Global state flags that affect reminder generation
const PLAN_MODE_STATE_FLAGS = {
    // Set by handlePlanModeTransition (Dp)
    needsPlanModeExitAttachment: {
        type: "boolean",
        setWhen: "Exiting plan mode",
        usedBy: "System Reminder for exit attachment"
    },

    hasExitedPlanMode: {
        type: "boolean",
        setWhen: "ExitPlanMode completes",
        usedBy: "System Reminder, Tool filtering"
    },

    prePlanMode: {
        type: "string | undefined",
        setWhen: "Entering plan mode",
        usedBy: "ExitPlanMode for mode restoration"
    }
};

// State update flow
function updatePlanModeState(updates) {
    // Update global flags
    if (updates.exiting) {
        globalState.needsPlanModeExitAttachment = true;
        globalState.hasExitedPlanMode = true;
    }
    if (updates.entering) {
        globalState.needsPlanModeExitAttachment = false;
        globalState.hasExitedPlanMode = false;
    }

    // Trigger reminder regeneration
    invalidateReminderCache();
}
```

---

## 2. Plan Mode ↔ Tools (05)

### Tool Filtering Algorithm

**What it does:**
Filters the available tool set when in plan mode, allowing only read-only tools and the ExitPlanMode tool.

```javascript
// ============================================
// Plan Mode Tool Filtering
// Location: chunks.56.mjs (tool availability), chunks.144.mjs (EnterPlanMode)
// ============================================

// ORIGINAL (for source lookup):
// Tools filtered based on mode and isReadOnly() check
// Write/Edit have special path-based filtering

// READABLE (for understanding):
const PLAN_MODE_TOOL_RULES = {
    // Always allowed (regardless of mode)
    alwaysAllowed: [
        "EnterPlanMode",    // Can re-enter if already in plan mode
        "ExitPlanMode",     // The only way to exit plan mode
        "AskUserQuestion"   // For clarification during planning
    ],

    // Allowed based on isReadOnly() flag
    readOnlyTools: {
        "Read": true,
        "Glob": true,
        "Grep": true,
        "WebFetch": true,
        "WebSearch": true,
        "TaskOutput": true,
        "CronList": true
    },

    // Conditional tools (allowed only for specific paths)
    conditionalTools: {
        "Write": {
            condition: (input, planFilePath) =>
                input.file_path === planFilePath,
            errorMessage: "In plan mode, Write is only allowed for the plan file"
        },
        "Edit": {
            condition: (input, planFilePath) =>
                input.file_path === planFilePath,
            errorMessage: "In plan mode, Edit is only allowed for the plan file"
        }
    },

    // Blocked tools
    blockedTools: [
        "Bash",             // No shell commands in plan mode
        "Agent",            // No spawning agents in plan mode
        "NotebookEdit",     // No notebook editing
        "Skill",            // No skill invocation (some skills may modify)
        "EnterWorktree",    // No worktree operations
        "CronCreate",       // No cron scheduling
        "CronDelete"        // No cron deletion
    ]
};

function filterToolsForPlanMode(tools, planFilePath) {
    return tools.filter(tool => {
        // Always allowed tools
        if (PLAN_MODE_TOOL_RULES.alwaysAllowed.includes(tool.name)) {
            return true;
        }

        // Read-only tools
        if (tool.isReadOnly?.()) {
            return true;
        }

        // Conditional tools (allowed, but validated at execution time)
        if (PLAN_MODE_TOOL_RULES.conditionalTools[tool.name]) {
            return true;  // Execution-time validation handles path check
        }

        // Blocked tools
        if (PLAN_MODE_TOOL_RULES.blockedTools.includes(tool.name)) {
            return false;
        }

        // Default: block if not explicitly allowed
        return false;
    });
}
```

### Execution-Time Path Validation

```javascript
// ============================================
// Write/Edit Path Validation in Plan Mode
// Location: chunks.56.mjs (validateInput), chunks.146.mjs (pipeline)
// ============================================

// ORIGINAL (for source lookup):
// In validateInput for Write/Edit tools
// Path is checked against planFilePath from state

// READABLE (for understanding):
async function validateWriteEditPath(input, sessionContext) {
    const mode = sessionContext.getAppState().toolPermissionContext.mode;

    // Only validate in plan mode
    if (mode !== "plan") {
        return { result: true };
    }

    const planFilePath = getPlanFilePath(sessionContext.agentId);
    const requestedPath = resolvePath(input.file_path);

    if (requestedPath !== planFilePath) {
        return {
            result: false,
            message: `In plan mode, you can only write to the plan file: ${planFilePath}

Current path attempted: ${requestedPath}

Please use ExitPlanMode if you need to write to other files.`,
            errorCode: "PLAN_MODE_PATH_RESTRICTION"
        };
    }

    return { result: true };
}
```

### Tool Execution Flow in Plan Mode

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    TOOL EXECUTION IN PLAN MODE                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Tool Call Request                                                            │
│       │                                                                        │
│       ▼                                                                        │
│  ┌─────────────────┐                                                          │
│  │ Is tool allowed │                                                          │
│  │ in plan mode?   │                                                          │
│  └────────┬────────┘                                                          │
│           │                                                                    │
│     ┌─────┴─────┐                                                              │
│     │           │                                                              │
│     ▼           ▼                                                              │
│   YES          NO                                                              │
│     │           │                                                              │
│     │           └──────► Return error: "Tool not available in plan mode"       │
│     │                                                                          │
│     ▼                                                                          │
│  ┌─────────────────┐                                                          │
│  │ Is tool Write   │                                                          │
│  │ or Edit?        │                                                          │
│  └────────┬────────┘                                                          │
│           │                                                                    │
│     ┌─────┴─────┐                                                              │
│     │           │                                                              │
│     ▼           ▼                                                              │
│   YES          NO                                                              │
│     │           │                                                              │
│     │           └──────► Execute tool normally                                 │
│     │                                                                          │
│     ▼                                                                          │
│  ┌─────────────────────┐                                                      │
│  │ Validate path       │                                                      │
│  │ matches plan file   │                                                      │
│  └────────┬────────────┘                                                      │
│           │                                                                    │
│     ┌─────┴─────┐                                                              │
│     │           │                                                              │
│     ▼           ▼                                                              │
│   MATCH      MISMATCH                                                         │
│     │           │                                                              │
│     │           └──────► Return error: "Can only write to plan file"           │
│     │                                                                          │
│     ▼                                                                          │
│  Execute Write/Edit                                                           │
│  to plan file                                                                 │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Plan Mode ↔ Hooks (11)

### PreToolUse Hook Integration

**What it does:**
Hooks can intercept tool calls in plan mode, allowing custom validation or blocking.

```javascript
// ============================================
// PreToolUse Hook - Plan Mode Integration
// Location: chunks.146.mjs (hook execution), chunks.58.mjs (hook types)
// ============================================

// READABLE (for understanding):
const PLAN_MODE_HOOK_CONFIG = {
    PreToolUse: {
        // Hooks run even for filtered tools
        runOnFilteredTools: false,

        // Hook can override plan mode restrictions
        canOverrideRestrictions: true,

        // Hook receives plan mode context
        contextIncludes: {
            planFilePath: true,
            mode: true
        }
    },

    PostToolUse: {
        // Track plan file changes
        trackPlanFileChanges: true,

        // Trigger on plan file write
        onPlanFileWrite: {
            emitEvent: "plan_file_updated",
            includeDiff: true
        }
    },

    PreCompact: {
        // Ensure plan is preserved
        preservePlan: true,

        // Include plan file in preservation
        preservationIncludes: ["planFilePath"]
    }
};

// Hook handler for plan mode tools
async function handlePreToolHookPlanMode(hookName, toolName, input, context) {
    const mode = context.appState.toolPermissionContext.mode;

    // Skip if not in plan mode
    if (mode !== "plan") {
        return { proceed: true };
    }

    // Special handling for plan file writes
    if ((toolName === "Write" || toolName === "Edit") &&
        input.file_path === context.planFilePath) {
        // Allow hook to validate plan content
        return {
            proceed: true,
            metadata: {
                isPlanFileEdit: true,
                planContent: input.content
            }
        };
    }

    return { proceed: true };
}
```

### Hook Event Types

```javascript
// ============================================
// Plan Mode Hook Events
// ============================================

const PLAN_MODE_HOOK_EVENTS = {
    // Emitted when entering plan mode
    plan_mode_entered: {
        trigger: "EnterPlanMode.call completes",
        data: {
            previousMode: "string",
            planFilePath: "string"
        }
    },

    // Emitted when exiting plan mode
    plan_mode_exited: {
        trigger: "ExitPlanMode.call completes with approval",
        data: {
            planFilePath: "string",
            planContent: "string",
            approvedBy: "user | team-lead"
        }
    },

    // Emitted on plan file write
    plan_file_updated: {
        trigger: "Write/Edit to plan file",
        data: {
            filePath: "string",
            content: "string",
            diff: "string"
        }
    },

    // Emitted on approval request (swarm)
    plan_approval_requested: {
        trigger: "Swarm teammate calls ExitPlanMode",
        data: {
            fromAgent: "string",
            requestId: "string",
            planFilePath: "string"
        }
    },

    // Emitted on approval response (swarm)
    plan_approval_responded: {
        trigger: "Team-lead responds to approval request",
        data: {
            toAgent: "string",
            approved: "boolean",
            feedback: "string | null"
        }
    }
};
```

---

## 4. Plan Mode ↔ Compact (07)

### Plan Preservation During Compaction

**What it does:**
When context compaction occurs, the plan content is preserved and injected as a reference attachment so the LLM maintains context of the approved plan.

```javascript
// ============================================
// Plan Preservation in Compaction
// Location: chunks.107.mjs (compact), chunks.1.mjs (preservation)
// ============================================

// ORIGINAL (for source lookup):
// Plan file is added to state-preservation attachments
// Plan content included in post-compact reminder

// READABLE (for understanding):
const COMPACT_PRESERVATION_CONFIG = {
    // Files to preserve (not affected by compaction)
    preservedFiles: [
        "planFilePath"  // Plan file is preserved
    ],

    // State to preserve
    preservedState: [
        "hasExitedPlanMode",
        "needsPlanModeExitAttachment",
        "prePlanMode"
    ],

    // Attachments to include post-compact
    postCompactAttachments: [
        {
            type: "plan_file_reference",
            generator: (state) => {
                if (!state.hasExitedPlanMode) return null;
                const planContent = readPlanFile(state.agentId);
                if (!planContent) return null;

                return {
                    type: "plan_file_reference",
                    content: `**Existing Plan Reference** (after context compaction)

The following plan was approved and is currently being implemented:

---
${planContent}
---

Continue implementing according to this plan.`
                };
            }
        }
    ]
};

// Compaction handler for plan mode
function handleCompactInPlanMode(messages, state) {
    // If still in plan mode, preserve full planning context
    if (state.toolPermissionContext.mode === "plan") {
        return {
            preserveAll: true,  // Don't compact planning messages
            reason: "Plan mode active - preserving full context"
        };
    }

    // If exited plan mode, preserve plan reference
    if (state.hasExitedPlanMode) {
        return {
            preservePlan: true,
            planReference: readPlanFile(state.agentId),
            attachment: COMPACT_PRESERVATION_CONFIG.postCompactAttachments[0]
        };
    }

    return { preservePlan: false };
}
```

---

## 5. Plan Mode ↔ Agent Teams (30)

### Swarm Approval Workflow

**What it does:**
When a swarm teammate with `planModeRequired: true` calls ExitPlanMode, the plan is sent to the team-lead for approval via the mailbox system.

```javascript
// ============================================
// Swarm Plan Approval Protocol
// Location: chunks.143.mjs (ExitPlanMode), chunks.132.mjs (mailbox)
// ============================================

// ORIGINAL (for source lookup):
if ($Y() && NF6()) {
    // Swarm teammate approval flow
    let M = {
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
}

// READABLE (for understanding):
const SWARM_APPROVAL_PROTOCOL = {
    // Message types
    messageTypes: {
        plan_approval_request: {
            from: "teammate",
            to: "team-lead",
            fields: {
                type: "plan_approval_request",
                from: "string (agent name)",
                timestamp: "ISO string",
                planFilePath: "string",
                planContent: "string",
                requestId: "string"
            }
        },
        plan_approval_response: {
            from: "team-lead",
            to: "teammate",
            fields: {
                to: "string (agent name)",
                type: "plan_approval_response",
                approved: "boolean",
                feedback: "string | null"
            }
        }
    },

    // Approval flow
    flow: [
        "Teammate completes planning",
        "Teammate calls ExitPlanMode",
        "System sends plan_approval_request to team-lead",
        "Team-lead sees approval dialog",
        "Team-lead responds with approval/rejection",
        "System sends plan_approval_response to teammate",
        "Teammate proceeds or revises plan"
    ]
};

// Teammate sends approval request
async function sendPlanApprovalRequest(sessionContext) {
    const planFilePath = getPlanFilePath(sessionContext.agentId);
    const planContent = readPlanFile(sessionContext.agentId);

    if (!planContent) {
        throw Error(`No plan file found at ${planFilePath}. Please write your plan before calling ExitPlanMode.`);
    }

    const agentName = getAgentName() || "unknown";
    const teamId = getTeamId();
    const requestId = generateRequestId("plan_approval", `${agentName}-${teamId}`);

    const approvalRequest = {
        type: "plan_approval_request",
        from: agentName,
        timestamp: new Date().toISOString(),
        planFilePath: planFilePath,
        planContent: planContent,
        requestId: requestId
    };

    // Write to team-lead's mailbox
    await writeToMailbox("team-lead", {
        from: agentName,
        text: JSON.stringify(approvalRequest),
        timestamp: new Date().toISOString()
    }, teamId);

    return {
        awaitingLeaderApproval: true,
        requestId: requestId
    };
}

// Team-lead processes approval
async function handlePlanApprovalRequest(message, teamId) {
    const request = JSON.parse(message.text);
    const { from, planContent, planFilePath, requestId } = request;

    // Show approval dialog to team-lead
    const result = await showApprovalDialog({
        title: `Approve ${from}'s Plan?`,
        planContent: planContent,
        options: [
            { id: "approve", label: "Approve" },
            { id: "reject", label: "Request Changes", requiresFeedback: true }
        ]
    });

    // Send response back to teammate
    const response = {
        to: from,
        type: "plan_approval_response",
        approved: result.approved,
        feedback: result.feedback || null
    };

    await writeToMailbox(from, {
        from: "team-lead",
        text: JSON.stringify(response),
        timestamp: new Date().toISOString()
    }, teamId);
}

// Mapping: $Y→isSwarmTeammate, NF6→isTeamFeaturesEnabled, x3→writeToMailbox,
//          H→agentName, Y→planFilePath, z→planContent, J→requestId, j→teamId
```

### Swarm Communication Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     SWARM PLAN APPROVAL FLOW                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Teammate (planModeRequired: true)                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                          │  │
│  │  1. Enter plan mode (EnterPlanMode)                                     │  │
│  │     ├─ mode = "plan"                                                    │  │
│  │     └─ Plan file initialized                                            │  │
│  │                                                                          │  │
│  │  2. Planning workflow                                                   │  │
│  │     ├─ Explore codebase (Read, Grep, Glob)                              │  │
│  │     ├─ Design approach                                                  │  │
│  │     └─ Write plan to plan file                                         │  │
│  │                                                                          │  │
│  │  3. Exit plan mode (ExitPlanMode)                                       │  │
│  │     └─► Send plan_approval_request                                      │  │
│  │                                                                          │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                        │                                       │
│                                        │ writeToMailbox("team-lead", ...)      │
│                                        ▼                                       │
│  Team-Lead Inbox                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  {                                                                        │  │
│  │    type: "plan_approval_request",                                        │  │
│  │    from: "researcher",                                                   │  │
│  │    planFilePath: "~/.claude_api/plans/researcher/plan.md",               │  │
│  │    planContent: "# Plan: ...\n\n## Steps\n1. ...",                       │  │
│  │    requestId: "plan_approval_researcher_default_xxx"                     │  │
│  │  }                                                                        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                        │                                       │
│                                        ▼                                       │
│  Team-Lead Approval Dialog                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ╔═══════════════════════════════════════════════════════════════════╗   │  │
│  │  ║  Approve researcher's Plan?                                        ║   │  │
│  │  ╠═══════════════════════════════════════════════════════════════════╣   │  │
│  │  ║  [Plan content preview]                                            ║   │  │
│  │  ║                                                                    ║   │  │
│  │  ║  [Approve]  [Request Changes]                                      ║   │  │
│  │  ╚═══════════════════════════════════════════════════════════════════╝   │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                        │                                       │
│                                        │ writeToMailbox("researcher", ...)     │
│                                        ▼                                       │
│  Teammate Inbox                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  {                                                                        │  │
│  │    to: "researcher",                                                      │  │
│  │    type: "plan_approval_response",                                        │  │
│  │    approved: true,                                                        │  │
│  │    feedback: null                                                         │  │
│  │  }                                                                        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                        │                                       │
│                                        ▼                                       │
│  Teammate continues:                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  4. Receive approval response                                           │  │
│  │     ├─ approved: true → Exit plan mode, start implementation            │  │
│  │     └─ approved: false → Revise plan based on feedback                  │  │
│  │                                                                          │  │
│  │  5. Implementation (if approved)                                        │  │
│  │     └─ Execute plan steps                                               │  │
│  │                                                                          │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Integration Matrix

| Integration Point | Trigger | Data Flow | Side Effects |
|-------------------|---------|-----------|--------------|
| System Reminder Enter | mode = "plan" | State → Reminder | plan_mode attachment |
| System Reminder Exit | hasExitedPlanMode | State → Reminder | plan_mode_exit attachment |
| Tools Filter | mode check | State → Tool filter | Tool availability |
| Tools Path Validate | Write/Edit call | Input → Validation | Error or proceed |
| Hooks PreToolUse | Tool call | Context → Hook | Permission modification |
| Hooks PostToolUse | Plan file write | Diff → Event | plan_file_updated event |
| Compact Preserve | Compaction trigger | State → Preservation | Plan reference attachment |
| Swarm Request | ExitPlanMode | Teammate → Team-lead | plan_approval_request |
| Swarm Response | Approval dialog | Team-lead → Teammate | plan_approval_response |

---

## 7. Error Handling Integration

### Cross-Module Error Propagation

```javascript
// ============================================
// Error Handling Across Modules
// ============================================

const PLAN_MODE_ERROR_CODES = {
    // Tool errors
    PLAN_MODE_PATH_RESTRICTION: {
        module: "Tools",
        message: "In plan mode, can only write to plan file",
        recovery: "Use ExitPlanMode or write to plan file"
    },

    PLAN_MODE_TOOL_BLOCKED: {
        module: "Tools",
        message: "Tool not available in plan mode",
        recovery: "Use ExitPlanMode to access this tool"
    },

    // Swarm errors
    PLAN_FILE_NOT_FOUND: {
        module: "Agent Teams",
        message: "No plan file found",
        recovery: "Write plan to plan file before ExitPlanMode"
    },

    APPROVAL_TIMEOUT: {
        module: "Agent Teams",
        message: "No response from team-lead",
        recovery: "Wait for response or retry"
    },

    // State errors
    NOT_IN_PLAN_MODE: {
        module: "Plan Mode",
        message: "ExitPlanMode called outside plan mode",
        recovery: "Enter plan mode first"
    },

    AGENT_CONTEXT_DENIED: {
        module: "Plan Mode",
        message: "EnterPlanMode not allowed in agent context",
        recovery: "Use plan mode in main session"
    }
};

function handlePlanModeError(error, context) {
    const errorConfig = PLAN_MODE_ERROR_CODES[error.code];

    if (!errorConfig) {
        return { handled: false };
    }

    // Log telemetry
    emitTelemetry("plan_mode_error", {
        code: error.code,
        module: errorConfig.module,
        context: context
    });

    // Return user-friendly error
    return {
        handled: true,
        message: errorConfig.message,
        recovery: errorConfig.recovery
    };
}
```

---

## Symbol Validation Summary

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| Dp | handlePlanModeTransition | chunks.1.mjs:2946 | ✅ Verified |
| Ki6 | EnterPlanModeTool | chunks.144.mjs:1579 | ✅ Verified |
| zD | ExitPlanModeTool | chunks.143.mjs:2802 | ✅ Verified |
| x3 | writeToMailbox | chunks.132.mjs:22 | ✅ Verified |
| $Y | isSwarmTeammate | chunks.*.mjs | ✅ Verified |
| NF6 | isTeamFeaturesEnabled | chunks.*.mjs | ✅ Verified |
| Fj | getPlanFilePath | chunks.*.mjs | ✅ Verified |
| sJ | readPlanFile | chunks.*.mjs | ✅ Verified |

**Total validated**: 8 symbols

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced swarm approval workflow, /plan with description |
| 2.1.72 | Interview phase enhancements, AskUserQuestion integration |
| 2.1.32 | Swarm teammate plan approval via mailbox |
| 2.1.18 | Shift+Tab mode cycling, plan mode color theming |
| 2.1.0 | Initial plan mode implementation |