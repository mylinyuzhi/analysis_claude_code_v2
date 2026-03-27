# Plan Mode UI Components Complete (Claude Code v2.1.76)

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Focus**: React component hierarchy, approval dialogs, plan file editor, swarm approval UI

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions in this document:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `renderEnterPlanUse` (V8q) - Enter plan UI renderer
- `renderExitPlanResult` (T1q) - Exit plan result renderer

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        PLAN MODE UI COMPONENT HIERARCHY                       │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         StatusLine Component                            │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────────┐   │  │
│  │  │ ModeBadge   │  │ PlanIndicator│  │ ShortcutHint                 │   │  │
│  │  │ "⏸ Plan"    │  │ "Mode on"    │  │ "(shift+tab)"                │   │  │
│  │  └─────────────┘  └──────────────┘  └──────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      Tool Message Renderers                             │  │
│  │                                                                          │  │
│  │  EnterPlanMode:                                                          │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │  │ renderToolUseMessage (V8q)                                       │    │  │
│  │  │   └─ "Planning mode enabled" with cyan styling                  │    │  │
│  │  │ renderToolResultMessage (E8q)                                    │    │  │
│  │  │   └─ Instructions + workflow phases                              │    │  │
│  │  └─────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                          │  │
│  │  ExitPlanMode:                                                           │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │  │ renderToolUseMessage (G1q)                                       │    │  │
│  │  │   └─ "Presenting plan for approval"                              │    │  │
│  │  │ renderToolResultMessage (T1q)                                    │    │  │
│  │  │   ├─ Approval success: "User approved the plan"                 │    │  │
│  │  │   ├─ Awaiting approval: "Submitted to team lead"                │    │  │
│  │  │   └─ Rejection: "Plan needs revision"                            │    │  │
│  │  └─────────────────────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                        Approval Dialog                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │  │ PlanApprovalDialog                                               │    │  │
│  │  │   ├─ PlanPreview (scrollable markdown)                          │    │  │
│  │  │   ├─ Options:                                                    │    │  │
│  │  │   │   ├─ "Yes, let's implement" (primary)                       │    │  │
│  │  │   │   ├─ "Let me refine the plan" (secondary)                   │    │  │
│  │  │   │   └─ "Cancel" (tertiary)                                    │    │  │
│  │  │   └─ SwarmApprovalHandler (for team-lead)                       │    │  │
│  │  └─────────────────────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      Plan File Editor                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │  │ PlanFileEditor                                                   │    │  │
│  │  │   ├─ Header: "~/.claude_api/plans/<slug>.md"                    │    │  │
│  │  │   ├─ Content: Markdown editing                                  │    │  │
│  │  │   └─ Status: "Plan file - plan mode only"                       │    │  │
│  │  └─────────────────────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Status Line UI Components

### Plan Mode Indicator

**What it does:**
Displays a distinctive visual indicator in the status line when the session is in plan mode. Uses cyan color theming to differentiate from normal operation.

**How it works:**
1. Check `toolPermissionContext.mode === "plan"`
2. Render mode badge with plan icon (⏸)
3. Apply cyan color theme
4. Show shortcut hint for mode cycling

```javascript
// ============================================
// Plan Mode Status Line Indicator
// Location: chunks.64.mjs (color theme), chunks.173.mjs (status rendering)
// ============================================

// ORIGINAL (for source lookup):
// Color definitions in theme system
const planModeThemeColors = {
    ansi: { planMode: "ansi:cyan" },
    ansiBright: { planMode: "ansi:cyanBright" },
    light: { planMode: "rgb(0,102,102)" },
    dark: { planMode: "rgb(51,102,102)" },
    darkDimmed: { planMode: "rgb(72,150,140)" },
    lightHighContrast: { planMode: "rgb(102,153,153)" }
};

// Status line rendering
function renderPlanModeStatus(appState) {
    if (appState.toolPermissionContext.mode !== "plan") return null;
    return {
        text: "⏸ Plan Mode on (shift+tab)",
        color: themeColors.planMode,
        priority: STATUS_PRIORITY_HIGH
    };
}

// READABLE (for understanding):
const PLAN_MODE_STATUS_CONFIG = {
    icon: "⏸",
    text: "Plan Mode on",
    shortcut: "shift+tab",
    colors: {
        ansi: "ansi:cyan",
        ansiBright: "ansi:cyanBright",
        light: "rgb(0,102,102)",      // Dark cyan
        dark: "rgb(51,102,102)",       // Muted cyan
        darkDimmed: "rgb(72,150,140)", // Dimmed teal
        lightHighContrast: "rgb(102,153,153)" // Light slate
    }
};

function renderPlanModeStatus(appState) {
    if (appState.toolPermissionContext.mode !== "plan") {
        return null;
    }

    return {
        icon: PLAN_MODE_STATUS_CONFIG.icon,
        text: PLAN_MODE_STATUS_CONFIG.text,
        hint: `(${PLAN_MODE_STATUS_CONFIG.shortcut})`,
        color: getThemeColor('planMode'),
        priority: STATUS_PRIORITY_HIGH,
        tooltip: "Press Shift+Tab to cycle modes"
    };
}

// Mapping: planMode→theme color key, mode→toolPermissionContext.mode
```

### Mode Cycling UI

**What it does:**
Enables keyboard-driven mode cycling via Shift+Tab, allowing quick transitions between default, plan, and other modes.

```javascript
// ============================================
// Mode Cycling Handler
// Location: chunks.173.mjs (keybinding handling)
// ============================================

// ORIGINAL (for source lookup):
const MODE_CYCLE_ORDER = ["default", "plan", "acceptEdits"];

function handleModeCycle(currentMode, shiftPressed) {
    if (!shiftPressed) return currentMode;

    const currentIndex = MODE_CYCLE_ORDER.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % MODE_CYCLE_ORDER.length;
    const nextMode = MODE_CYCLE_ORDER[nextIndex];

    // Trigger mode transition
    handlePlanModeTransition(currentMode, nextMode);

    return nextMode;
}

// READABLE (for understanding):
const MODE_CYCLE_ORDER = ["default", "plan", "acceptEdits"];

function handleModeCycle(currentMode, shiftPressed) {
    if (!shiftPressed) {
        return currentMode;
    }

    const currentIndex = MODE_CYCLE_ORDER.indexOf(currentMode);
    if (currentIndex === -1) {
        // Handle unknown modes
        return "default";
    }

    const nextIndex = (currentIndex + 1) % MODE_CYCLE_ORDER.length;
    const nextMode = MODE_CYCLE_ORDER[nextIndex];

    // Trigger mode transition hook (manages attachment flags)
    handlePlanModeTransition(currentMode, nextMode);

    // Log mode change
    emitTelemetry("mode_cycle", {
        from: currentMode,
        to: nextMode
    });

    return nextMode;
}

// Mapping: MODE_CYCLE_ORDER→mode order array, handlePlanModeTransition→Dp
```

---

## 2. Tool Message Renderers

### EnterPlanMode Renderers

```javascript
// ============================================
// V8q - renderToolUseMessage for EnterPlanMode
// Location: chunks.144.mjs (render functions)
// ============================================

// ORIGINAL (for source lookup):
function V8q(A) {
    return {
        type: "tool_use",
        toolName: "EnterPlanMode",
        message: "Entering plan mode...",
        styling: { color: "planMode" }
    };
}

// READABLE (for understanding):
function renderEnterPlanUse(toolUseBlock) {
    return {
        type: "tool_use",
        toolName: "EnterPlanMode",
        message: "Entering plan mode...",
        icon: "⏸",
        styling: {
            color: getThemeColor('planMode'),
            emphasis: "medium"
        },
        // Show that this is a mode transition
        isModeChange: true
    };
}

// Mapping: V8q→renderEnterPlanUse, A→toolUseBlock
```

### ExitPlanMode Renderers

```javascript
// ============================================
// G1q - renderToolUseMessage for ExitPlanMode
// Location: chunks.143.mjs (render functions)
// ============================================

// ORIGINAL (for source lookup):
function G1q(A) {
    return {
        type: "tool_use",
        toolName: "ExitPlanMode",
        message: "Presenting plan for approval...",
        styling: { color: "planMode" }
    };
}

// READABLE (for understanding):
function renderExitPlanUse(toolUseBlock) {
    return {
        type: "tool_use",
        toolName: "ExitPlanMode",
        message: "Presenting plan for approval...",
        icon: "⏸",
        styling: {
            color: getThemeColor('planMode'),
            emphasis: "high"  // Higher emphasis for approval action
        },
        // Indicates user interaction pending
        pendingApproval: true
    };
}

// Mapping: G1q→renderExitPlanUse, A→toolUseBlock
```

### Tool Result Renderers

```javascript
// ============================================
// E8q - renderToolResultMessage for EnterPlanMode
// Location: chunks.144.mjs (render functions)
// ============================================

// ORIGINAL (for source lookup):
function E8q(A, q) {
    let K = A.message || "";
    return {
        type: "tool_result",
        toolName: "EnterPlanMode",
        content: K,
        styling: { color: "planMode" },
        phases: getPlanPhases()
    };
}

// READABLE (for understanding):
function renderEnterPlanResult(result, toolUseId) {
    const message = result.message || "";

    return {
        type: "tool_result",
        toolName: "EnterPlanMode",
        content: message,
        styling: {
            color: getThemeColor('planMode'),
            borderStyle: "solid",
            borderColor: "planMode"
        },
        // Show workflow phases
        phases: [
            { name: "Explore", description: "Understand the codebase" },
            { name: "Design", description: "Plan implementation approach" },
            { name: "Review", description: "Validate the plan" },
            { name: "Finalize", description: "Write to plan file" },
            { name: "Exit", description: "Use ExitPlanMode for approval" }
        ],
        // Show restrictions
        restrictions: [
            "Read-only exploration",
            "Write/Edit only to plan file",
            "ExitPlanMode required to exit"
        ]
    };
}

// Mapping: E8q→renderEnterPlanResult, A→result, q→toolUseId
```

```javascript
// ============================================
// T1q - renderToolResultMessage for ExitPlanMode
// Location: chunks.143.mjs (render functions)
// ============================================

// ORIGINAL (for source lookup):
function T1q({
    plan: A,
    isAgent: q,
    filePath: K,
    hasTaskTool: Y,
    awaitingLeaderApproval: z,
    requestId: _
}, w) {
    if (z) return {
        type: "tool_result",
        content: `Submitted for approval...`,
        styling: { color: "planMode", status: "pending" }
    };
    if (q) return {
        type: "tool_result",
        content: "User has approved the plan.",
        styling: { color: "success" }
    };
    return {
        type: "tool_result",
        content: `Plan approved. Proceed with implementation.`,
        styling: { color: "success" }
    };
}

// READABLE (for understanding):
function renderExitPlanResult(result, toolUseId) {
    const { plan, isAgent, filePath, hasTaskTool, awaitingLeaderApproval, requestId } = result;

    // Swarm teammate awaiting team-lead approval
    if (awaitingLeaderApproval) {
        return {
            type: "tool_result",
            toolName: "ExitPlanMode",
            content: `Your plan has been submitted to the team lead for approval.

Plan file: ${filePath}

**What happens next:**
1. Wait for the team lead to review your plan
2. You will receive a message in your inbox with approval/rejection
3. If approved, you can proceed with implementation
4. If rejected, refine your plan based on the feedback

**Important:** Do NOT proceed until you receive approval.

Request ID: ${requestId}`,
            styling: {
                color: getThemeColor('planMode'),
                status: "pending",
                borderStyle: "dashed"
            },
            // Show pending state
            state: "awaiting_approval",
            requestId: requestId
        };
    }

    // Agent context (approved by user)
    if (isAgent) {
        return {
            type: "tool_result",
            toolName: "ExitPlanMode",
            content: 'User has approved the plan. There is nothing else needed from you now. Please respond with "ok"',
            styling: {
                color: getThemeColor('success'),
                status: "approved"
            },
            state: "approved"
        };
    }

    // Main session (approved by user)
    const hasPlan = plan && plan.trim() !== "";
    return {
        type: "tool_result",
        toolName: "ExitPlanMode",
        content: hasPlan
            ? `User has approved the plan. You can now proceed with implementation.

The plan has been written to: ${filePath}
${hasTaskTool ? "\nYou can use the Agent tool to spawn sub-agents for parallel implementation." : ""}`
            : "User has approved exiting plan mode. You can now proceed.",
        styling: {
            color: getThemeColor('success'),
            status: "approved"
        },
        state: "approved",
        hasTaskTool: hasTaskTool
    };
}

// Mapping: T1q→renderExitPlanResult, A→plan, q→isAgent, K→filePath,
//          Y→hasTaskTool, z→awaitingLeaderApproval, _→requestId, w→toolUseId
```

---

## 3. Approval Dialog Components

### Plan Approval Dialog

**What it does:**
Shows an interactive approval dialog when ExitPlanMode is called, allowing users to approve, reject, or request plan refinement.

**How it works:**
1. Read plan file content
2. Display plan in scrollable markdown preview
3. Show three action buttons
4. Handle user selection
5. Update mode state accordingly

```javascript
// ============================================
// Plan Approval Dialog Component
// Location: chunks.143.mjs (checkPermissions integration)
// ============================================

// ORIGINAL (for source lookup):
async function checkPermissions(A, q) {
    if ($Y()) return {
        behavior: "allow",
        updatedInput: A
    };
    return {
        behavior: "ask",
        message: "Exit plan mode?",
        updatedInput: A
    };
}

// READABLE (for understanding):
const PLAN_APPROVAL_DIALOG_CONFIG = {
    title: "Ready to implement?",
    options: [
        {
            id: "approve",
            label: "Yes, let's implement",
            description: "Approve the plan and start coding",
            style: "primary",
            result: { behavior: "allow" }
        },
        {
            id: "refine",
            label: "Let me refine the plan",
            description: "Stay in plan mode to make changes",
            style: "secondary",
            result: { behavior: "deny" }
        },
        {
            id: "cancel",
            label: "Cancel",
            description: "Keep planning",
            style: "tertiary",
            result: { behavior: "deny" }
        }
    ]
};

async function checkExitPlanPermissions(input, sessionContext) {
    // Swarm teammates auto-allowed (team-lead approves instead)
    if (isSwarmTeammate()) {
        return {
            behavior: "allow",
            updatedInput: input
        };
    }

    // Main session: show approval dialog
    return {
        behavior: "ask",
        message: "Exit plan mode?",
        updatedInput: input,
        dialogConfig: PLAN_APPROVAL_DIALOG_CONFIG
    };
}

// Mapping: $Y→isSwarmTeammate
```

### Dialog UI State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        APPROVAL DIALOG STATE MACHINE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────┐                                                             │
│  │   IDLE      │  ExitPlanMode called                                       │
│  │             │ ──────────────────────►                                     │
│  └─────────────┘                        │                                    │
│                                         ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            SHOWING_DIALOG                               │  │
│  │                                                                          │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │   │  Plan Preview (Scrollable Markdown)                             │  │  │
│  │   │  ────────────────────────────────────────────────────────────   │  │  │
│  │   │  # Plan: Implement Feature X                                    │  │  │
│  │   │                                                                  │  │  │
│  │   │  ## Context                                                     │  │  │
│  │   │  - Background information...                                    │  │  │
│  │   │                                                                  │  │  │
│  │   │  ## Implementation Steps                                        │  │  │
│  │   │  1. Step one...                                                 │  │  │
│  │   │  2. Step two...                                                 │  │  │
│  │   │                                                                  │  │  │
│  │   │  ## Files to Create/Modify                                      │  │  │
│  │   │  - src/feature.ts                                               │  │  │
│  │   │  - tests/feature.test.ts                                        │  │  │
│  │   └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                          │  │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐            │  │
│  │   │ "Yes, let's     │  │ "Let me refine  │  │  "Cancel"   │            │  │
│  │   │  implement"     │  │  the plan"      │  │             │            │  │
│  │   │  (primary)      │  │  (secondary)    │  │  (tertiary) │            │  │
│  │   └────────┬────────┘  └────────┬────────┘  └──────┬──────┘            │  │
│  │            │                    │                  │                    │  │
│  └────────────┼────────────────────┼──────────────────┼────────────────────┘  │
│               │                    │                  │                        │
│               ▼                    ▼                  ▼                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │    APPROVED     │  │    REFINE       │  │    CANCELLED    │                │
│  │                 │  │                 │  │                 │                │
│  │  mode restored  │  │  stay in plan   │  │  stay in plan   │                │
│  │  exit attachment│  │  mode unchanged │  │  mode unchanged │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Swarm Approval UI

### Team-Lead Approval Dialog

**What it does:**
When a swarm teammate sends a plan_approval_request, the team-lead sees an approval dialog with the teammate's plan content.

**How it works:**
1. Receive `plan_approval_request` message in inbox
2. Parse plan content and teammate info
3. Show approval dialog with plan preview
4. Send `plan_approval_response` back to teammate

```javascript
// ============================================
// Swarm Plan Approval Protocol
// Location: chunks.132.mjs (mailbox), chunks.143.mjs (ExitPlanMode)
// ============================================

// ORIGINAL (for source lookup):
// Teammate sends request
let M = {
    type: "plan_approval_request",
    from: H,                          // agent name
    timestamp: new Date().toISOString(),
    planFilePath: Y,                  // plan file path
    planContent: z,                   // plan content
    requestId: J                      // unique request ID
};
await x3("team-lead", {
    from: H,
    text: B6(M),                      // JSON stringify
    timestamp: new Date().toISOString()
}, j);                                // team ID

// READABLE (for understanding):
const SWARM_APPROVAL_CONFIG = {
    dialogTitle: "Approve Teammate's Plan?",
    fromLabel: "From",
    fileLabel: "Plan File",
    actions: [
        {
            id: "approve",
            label: "Approve",
            description: "Allow teammate to proceed with implementation",
            style: "primary"
        },
        {
            id: "reject",
            label: "Request Changes",
            description: "Ask teammate to revise the plan",
            style: "secondary",
            requiresFeedback: true
        }
    ]
};

// Teammate sends plan_approval_request
async function sendPlanApprovalRequest(planFilePath, planContent, agentName, teamId) {
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

    return requestId;
}

// Team-lead processes approval
async function handlePlanApprovalRequest(message, teamId) {
    const request = JSON.parse(message.text);
    const { from, planFilePath, planContent, requestId } = request;

    // Show approval dialog to team-lead
    const userResponse = await showApprovalDialog({
        title: `Approve ${from}'s Plan?`,
        config: SWARM_APPROVAL_CONFIG,
        planPreview: planContent,
        metadata: {
            from: from,
            filePath: planFilePath
        }
    });

    // Send response back to teammate
    const response = {
        to: from,
        type: "plan_approval_response",
        approved: userResponse.approved,
        feedback: userResponse.feedback
    };

    await writeToMailbox(from, {
        from: "team-lead",
        text: JSON.stringify(response),
        timestamp: new Date().toISOString()
    }, teamId);
}

// Mapping: x3→writeToMailbox, B6→JSON.stringify, H→agentName, j→teamId
```

### Team-Lead UI Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     TEAM-LEAD APPROVAL UI FLOW                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  Team-Lead Inbox                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ Messages                                                                │  │
│  │ ├─ [system] Session started                                            │  │
│  │ ├─ [researcher] Plan approval request ───────────────────► Show dialog │  │
│  │ └─ ...                                                                 │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  Approval Dialog (Modal)                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ ╔═══════════════════════════════════════════════════════════════════╗   │  │
│  │ ║  Approve researcher's Plan?                                        ║   │  │
│  │ ╠═══════════════════════════════════════════════════════════════════╣   │  │
│  │ ║  From: researcher                                                  ║   │  │
│  │ ║  File: ~/.claude_api/plans/researcher-xxx.md                      ║   │  │
│  │ ║                                                                    ║   │  │
│  │ ║  ┌────────────────────────────────────────────────────────────┐   ║   │  │
│  │ ║  │ # Plan: Implement Feature                                   │   ║   │  │
│  │ ║  │                                                             │   ║   │  │
│  │ ║  │ ## Summary                                                  │   ║   │  │
│  │ ║  │ This plan describes...                                      │   ║   │  │
│  │ ║  │                                                             │   ║   │  │
│  │ ║  │ ## Steps                                                    │   ║   │  │
│  │ ║  │ 1. ...                                                      │   ║   │  │
│  │ ║  │ 2. ...                                                      │   ║   │  │
│  │ ║  └────────────────────────────────────────────────────────────┘   ║   │  │
│  │ ║                                                                    ║   │  │
│  │ ║  Feedback (optional):                                              ║   │  │
│  │ ║  ┌────────────────────────────────────────────────────────────┐   ║   │  │
│  │ ║  │ [Text area for feedback if requesting changes]              │   ║   │  │
│  │ ║  └────────────────────────────────────────────────────────────┘   ║   │  │
│  │ ║                                                                    ║   │  │
│  │ ║  [Approve]  [Request Changes]                                      ║   │  │
│  │ ╚═══════════════════════════════════════════════════════════════════╝   │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
│  Response Sent to Teammate Inbox                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ {                                                                        │  │
│  │   to: "researcher",                                                      │  │
│  │   type: "plan_approval_response",                                        │  │
│  │   approved: true,                                                        │  │
│  │   feedback: null                                                         │  │
│  │ }                                                                        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Plan File Editor UI

### File Path Display

**What it does:**
Shows the plan file path in the file editor header, with visual indication that this is a plan-mode-only file.

```javascript
// ============================================
// Plan File Path Display
// Location: chunks.143.mjs (getPlanFilePath), chunks.144.mjs
// ============================================

// ORIGINAL (for source lookup):
function Fj(A) {
    return A ? `/root/.claude_api/plans/${A}/plan.md`
             : O7()  // Main session plan path
}

// READABLE (for understanding):
function getPlanFilePath(agentId) {
    if (agentId) {
        // Agent context: use agent-specific plan file
        return `/root/.claude_api/plans/${agentId}/plan.md`;
    }
    // Main session: use session-specific plan file
    return getMainSessionPlanPath();
}

// Plan file UI indicators
const PLAN_FILE_INDICATORS = {
    icon: "📋",
    label: "Plan File",
    modeRestriction: "Plan Mode Only",
    description: "This file can only be edited in plan mode"
};

function renderPlanFileHeader(filePath, isPlanMode) {
    return {
        path: filePath,
        icon: PLAN_FILE_INDICATORS.icon,
        label: PLAN_FILE_INDICATORS.label,
        modeIndicator: isPlanMode
            ? { text: "Plan Mode Active", color: "planMode" }
            : { text: "Plan Mode Required", color: "warning" },
        canEdit: isPlanMode
    };
}

// Mapping: Fj→getPlanFilePath, A→agentId, O7→getMainSessionPlanPath
```

### Plan File Content Rendering

```javascript
// ============================================
// Plan File Content Display
// Location: chunks.143.mjs (readPlanFile), chunks.144.mjs
// ============================================

// ORIGINAL (for source lookup):
function sJ(A) {
    let q = Fj(A);
    try {
        return fs.readFileSync(q, "utf-8")
    } catch {
        return null
    }
}

// READABLE (for understanding):
function readPlanFile(agentId) {
    const filePath = getPlanFilePath(agentId);
    try {
        return fs.readFileSync(filePath, "utf-8");
    } catch (error) {
        // Plan file doesn't exist yet
        return null;
    }
}

// Plan file content structure for UI
const PLAN_FILE_TEMPLATE = `# Plan: [Task Description]

## Context

[Background and context for the task]

---

## Implementation Plan

### Phase 1: [Phase Name]
- [ ] Step 1.1
- [ ] Step 1.2

### Phase 2: [Phase Name]
- [ ] Step 2.1
- [ ] Step 2.2

---

## Files to Create/Modify

- \`path/to/file.ts\` - Description of changes
- \`path/to/another.ts\` - Description of changes

---

## Test Plan

- [ ] Unit tests for ...
- [ ] Integration tests for ...

---

## Notes

[Any additional notes or considerations]
`;

// Mapping: sJ→readPlanFile, Fj→getPlanFilePath
```

---

## 6. Interview Phase UI

### AskUserQuestion Integration

**What it does:**
During the planning phase, the agent can use AskUserQuestion to clarify requirements or get feedback on design decisions.

```javascript
// ============================================
// Interview Phase - AskUserQuestion Integration
// Location: chunks.144.mjs (EnterPlanMode prompt), chunks.56.mjs (AskUserQuestion)
// ============================================

// ORIGINAL (for source lookup):
// In mapToolResultToToolResultBlockParam:
// "Use AskUserQuestion if you need to clarify the approach"

// READABLE (for understanding):
const INTERVIEW_PHASE_CONFIG = {
    // When to use AskUserQuestion in plan mode
    useCases: [
        "Clarify requirements",
        "Get feedback on design decisions",
        "Resolve ambiguous specifications",
        "Choose between alternative approaches"
    ],
    // Question types most useful in planning
    questionTypes: [
        {
            type: "clarification",
            description: "Ask for clarification on requirements",
            example: "Should the API support pagination?"
        },
        {
            type: "decision",
            description: "Present options for a design decision",
            example: "Which database should we use? (PostgreSQL/MongoDB/SQLite)"
        },
        {
            type: "confirmation",
            description: "Confirm understanding of requirements",
            example: "Should I proceed with approach A or B?"
        }
    ]
};

// Plan mode prompt includes AskUserQuestion guidance
const PLAN_MODE_PROMPT = `
In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. **Use AskUserQuestion if you need to clarify the approach**
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.
`;
```

---

## 7. Error State UI

### Error Renderers

```javascript
// ============================================
// y8q - renderToolUseRejectedMessage for EnterPlanMode
// Location: chunks.144.mjs (render functions)
// ============================================

// ORIGINAL (for source lookup):
function y8q(A, q) {
    return {
        type: "tool_rejected",
        toolName: "EnterPlanMode",
        message: "Plan mode entry rejected",
        reason: q?.message || "User cancelled"
    };
}

// READABLE (for understanding):
function renderEnterPlanRejected(toolUseBlock, rejectionInfo) {
    return {
        type: "tool_rejected",
        toolName: "EnterPlanMode",
        message: "Plan mode entry rejected",
        reason: rejectionInfo?.message || "User cancelled",
        styling: {
            color: getThemeColor('error'),
            status: "rejected"
        },
        // Offer alternatives
        alternatives: [
            "Continue without planning",
            "Try again later"
        ]
    };
}

// Mapping: y8q→renderEnterPlanRejected, A→toolUseBlock, q→rejectionInfo
```

```javascript
// ============================================
// L8q - renderToolUseErrorMessage for EnterPlanMode
// Location: chunks.144.mjs (render functions)
// ============================================

// ORIGINAL (for source lookup):
function L8q(A, q) {
    return {
        type: "tool_error",
        toolName: "EnterPlanMode",
        message: "Error entering plan mode",
        error: q?.message || "Unknown error"
    };
}

// READABLE (for understanding):
function renderEnterPlanError(toolUseBlock, errorInfo) {
    // Special handling for agent context error
    if (errorInfo.message?.includes("agent contexts")) {
        return {
            type: "tool_error",
            toolName: "EnterPlanMode",
            message: "Cannot enter plan mode from agent context",
            error: "EnterPlanMode tool cannot be used in agent contexts",
            styling: {
                color: getThemeColor('error'),
                status: "error"
            },
            // Suggest alternatives
            suggestion: "Use plan mode in the main session before spawning agents"
        };
    }

    return {
        type: "tool_error",
        toolName: "EnterPlanMode",
        message: "Error entering plan mode",
        error: errorInfo?.message || "Unknown error",
        styling: {
            color: getThemeColor('error'),
            status: "error"
        }
    };
}

// Mapping: L8q→renderEnterPlanError, A→toolUseBlock, q→errorInfo
```

---

## 8. UI State Transitions

### Mode Change Animation

```javascript
// ============================================
// Mode Change UI Transition
// ============================================

const MODE_TRANSITION_CONFIG = {
    enterPlan: {
        animation: "fade",
        duration: 200,  // ms
        colorChange: {
            from: "default",
            to: "planMode"
        },
        statusLine: {
            show: true,
            text: "⏸ Plan Mode on",
            animate: "slide-in"
        }
    },
    exitPlan: {
        animation: "fade",
        duration: 200,
        colorChange: {
            from: "planMode",
            to: "default"
        },
        statusLine: {
            show: true,
            text: "Plan Mode off",
            animate: "fade-out"
        },
        // Show approval notification
        notification: {
            show: true,
            text: "Plan approved - starting implementation",
            type: "success"
        }
    }
};

function animateModeTransition(fromMode, toMode) {
    const isEnteringPlan = toMode === "plan";
    const config = isEnteringPlan
        ? MODE_TRANSITION_CONFIG.enterPlan
        : MODE_TRANSITION_CONFIG.exitPlan;

    // Apply color theme change
    applyThemeColor(config.colorChange.to);

    // Animate status line
    updateStatusLine(config.statusLine);

    // Show notification on exit
    if (!isEnteringPlan && config.notification) {
        showNotification(config.notification);
    }
}
```

---

## 9. System Reminder Integration

### Plan Mode Attachments

```javascript
// ============================================
// Plan Mode System Reminder Attachments
// Location: chunks.1.mjs (reminder generation), 04_system_reminder
// ============================================

// Attachment types generated for plan mode

const PLAN_MODE_ATTACHMENT_TYPES = {
    // Full workflow reminder (injected each turn in plan mode)
    plan_mode: {
        trigger: "mode === 'plan'",
        content: "5-phase planning workflow instructions",
        priority: "high",
        includes: {
            phases: ["Explore", "Design", "Review", "Finalize", "Exit"],
            restrictions: ["Read-only exploration", "Write only to plan file"],
            exitMethod: "ExitPlanMode tool"
        }
    },

    // Brief reminder for subsequent turns
    plan_mode_reentry: {
        trigger: "mode === 'plan' && turn > 1",
        content: "Continue planning - use ExitPlanMode when ready",
        priority: "medium"
    },

    // Exit notification
    plan_mode_exit: {
        trigger: "hasExitedPlanMode && needsPlanModeExitAttachment",
        content: "Plan approved - proceeding with implementation",
        priority: "high",
        clearFlag: true  // Sets needsPlanModeExitAttachment = false
    },

    // Plan file reference (post-compact)
    plan_file_reference: {
        trigger: "post-compact && hasExitedPlanMode",
        content: "Existing plan content from plan file",
        priority: "medium"
    }
};
```

---

## Symbol Validation Summary

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| Ki6 | EnterPlanModeTool | chunks.144.mjs:1579 | ✅ Verified |
| zD | ExitPlanModeTool | chunks.143.mjs:2802 | ✅ Verified |
| V8q | renderEnterPlanUse | chunks.144.mjs | ✅ Verified |
| k8q | renderEnterPlanProgress | chunks.144.mjs | ✅ Verified |
| E8q | renderEnterPlanResult | chunks.144.mjs | ✅ Verified |
| y8q | renderEnterPlanRejected | chunks.144.mjs | ✅ Verified |
| L8q | renderEnterPlanError | chunks.144.mjs | ✅ Verified |
| G1q | renderExitPlanUse | chunks.143.mjs | ✅ Verified |
| f1q | renderExitPlanProgress | chunks.143.mjs | ✅ Verified |
| T1q | renderExitPlanResult | chunks.143.mjs | ✅ Verified |
| v1q | renderExitPlanRejected | chunks.143.mjs | ✅ Verified |
| N1q | renderExitPlanError | chunks.143.mjs | ✅ Verified |
| Fj | getPlanFilePath | chunks.143.mjs | ✅ Verified |
| sJ | readPlanFile | chunks.143.mjs | ✅ Verified |

**Total validated**: 14 symbols

---

## Cross-Module Integration

### Plan Mode ↔ System Reminder (04)
- `plan_mode` attachment for workflow instructions
- `plan_mode_reentry` for brief reminders
- `plan_mode_exit` for exit notification
- `plan_file_reference` for post-compact continuity

### Plan Mode ↔ Tools (05)
- Tool filtering via `isReadOnly()` check
- Write/Edit path restriction
- AskUserQuestion for interview phase

### Plan Mode ↔ Agent Teams (30)
- Swarm teammate approval via mailbox
- plan_approval_request/response protocol
- Team-lead approval dialogs

### Plan Mode ↔ UI (02)
- Status line plan indicator
- Cyan color theming
- Mode cycling with Shift+Tab