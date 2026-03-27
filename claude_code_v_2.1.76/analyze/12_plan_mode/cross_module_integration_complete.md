# Plan Mode Cross-Module Integration - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Complete integration documentation with source-level restoration

---

## Overview

This document provides comprehensive documentation of all cross-module integration points between the Plan Mode system (12) and other modules in Claude Code, including System Reminder (04), Tools (05), Hooks (11), Compact (07), and Agent Teams (30).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)

Key functions in this document:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `handlePlanModeTransition` (Dp) - Mode hooks - chunks.1.mjs:2946
- `handlePlanApproval` (AhY) - Swarm approval - chunks.145.mjs:2521

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PLAN MODE INTEGRATION ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      PLAN MODE CORE (12)                               │  │
│  │                                                                        │  │
│  │   State Machine              Tool Filtering           Approval Flow    │  │
│  │   ├─ mode: "plan"            ├─ isReadOnly()          ├─ User dialog  │  │
│  │   ├─ prePlanMode             ├─ Write/Edit path       ├─ Swarm flow   │  │
│  │   └─ hasExitedPlanMode       └─ ExitPlanMode          └─ Plan file    │  │
│  │                                                                        │  │
│  └───────────────────────────────┬───────────────────────────────────────┘  │
│                                  │                                          │
│     ┌────────────────────────────┼────────────────────────────┐             │
│     │                            │                            │             │
│     ▼                            ▼                            ▼             │
│ ┌───────────┐            ┌───────────────┐            ┌───────────┐        │
│ │  SYSTEM   │            │    TOOLS      │            │   HOOKS   │        │
│ │ REMINDER  │◄───────────│    (05)       │───────────►│   (11)    │        │
│ │   (04)    │            │               │            │           │        │
│ └───────────┘            └───────────────┘            └───────────┘        │
│        │                        │                                            │
│        │                        │                                            │
│        ▼                        ▼                                            │
│ ┌───────────┐            ┌───────────────┐                                  │
│ │  COMPACT  │            │ AGENT TEAMS   │                                  │
│ │   (07)    │            │    (30)       │                                  │
│ └───────────┘            └───────────────┘                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Plan Mode ↔ System Reminder (04)

### Integration Points

**Plan mode generates the following attachment types:**

| Attachment Type | When Generated | Purpose |
|-----------------|----------------|---------|
| `plan_mode` | Each turn in plan mode | Full 5-phase workflow instructions |
| `plan_mode_reentry` | Re-entering plan mode | Brief reminder |
| `plan_mode_exit` | Exited plan mode | Notification to system |
| `plan_file_reference` | Post-compact | Existing plan file content |

### Attachment Variants

| Variant | Use Case | Content |
|---------|----------|---------|
| Full format | Normal plan mode | Complete 5-phase workflow |
| Sparse format | Experienced users | Minimal reminder |
| Subagent format | Nested agents | Brief, no plan file editing |

### Source Code: Mode Transition Hook

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

### Source Code: EnterPlanMode Tool

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

        return {
            type: "tool_result",
            content,
            tool_use_id: toolUseId
        };
    }
};

// Mapping: Ki6→EnterPlanModeTool, dt→TOOL_NAME_ENTER_PLAN_MODE,
//          v8q→getEnterPlanModePrompt, hIY→emptyObjectSchema, SIY→messageSchema,
//          Dp→handlePlanModeTransition, Ez→updateMode, LT6→savePrePlanMode,
//          rO→isSubAgentMode
```

---

## 2. Plan Mode ↔ Tools (05)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Tool filtering | Only `isReadOnly()` tools allowed in plan mode |
| Write/Edit restriction | Only allowed to plan file path |
| ExitPlanMode | Only programmatic exit from plan mode |
| AskUserQuestion | Allowed for clarification |

### Tool Filtering Algorithm

```javascript
// ============================================
// filterToolsForPlanMode - Filter tools for plan mode
// Location: chunks.93.mjs (filterToolsByMode)
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
        if (tool.name === "Write" || tool.name === "Edit") {
            // Path is checked at execution time against planFilePath
            return true;
        }

        // Block all other tools
        return false;
    });
}

// Tool name constants
const TOOL_NAME_ENTER_PLAN_MODE = "EnterPlanMode";  // dt
const TOOL_NAME_EXIT_PLAN_MODE = "ExitPlanMode";    // aJ
const TOOL_NAME_ASK_USER_QUESTION = "AskUserQuestion";  // Fw
```

### Write/Edit Path Restriction

```javascript
// At execution time, Write/Edit tools check:
if (mode === "plan" && filePath !== planFilePath) {
    return {
        error: "In plan mode, you can only write to the plan file: " + planFilePath
    };
}
```

---

## 3. Plan Mode ↔ Hooks (11)

### Integration Points

| Hook Type | When Called | Purpose |
|-----------|-------------|---------|
| PreToolUse | Before tool execution | Modify tool availability |
| PostToolUse | After plan file changes | Track plan modifications |
| PreCompact | Before compaction | Preserve plan state |

### Hook Flow

```
Tool execution in plan mode
    │
    ├─→ PreToolUse hook fires
    │     ├─→ Can further restrict tools
    │     └─→ Can modify tool input
    │
    ├─→ Tool executes (if allowed)
    │
    └─→ PostToolUse hook fires
          └─→ Can track plan file changes
```

---

## 4. Plan Mode ↔ Compact (07)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| Plan preservation | Plan preserved as state-preservation attachment |
| Plan file | Not affected by compaction |
| TodoWrite state | Preserved during compaction |
| plan_file_reference | Injected post-compact |

### Compaction Handling

```javascript
// During compaction, plan state is preserved:
// 1. Plan file is NOT affected by compaction
// 2. TodoWrite state is preserved
// 3. plan_file_reference attachment is injected to restore context

// Post-compact, plan file reference is injected:
function injectPlanFileReference(planFilePath) {
    return {
        type: "plan_file_reference",
        content: readFileSync(planFilePath, "utf-8"),
        path: planFilePath
    };
}
```

---

## 5. Plan Mode ↔ Agent Teams (30)

### Swarm Teammate Plan Approval

When a teammate agent wants to exit plan mode:

```
Teammate                           Team Lead
   │                                    │
   ├─→ plan_approval_request ──────────►│
   │     (plan content)                 │
   │                                    ├─→ Review plan
   │                                    ├─→ Show approval dialog
   │                                    │
   │◄──────── plan_approval_response ───┤
   │     (approved/rejected)            │
   │                                    │
   ├─→ If approved: Exit plan mode      │
   └─→ If rejected: Revise plan         │
```

### Message Schemas

```javascript
// Plan approval request
const PlanApprovalRequestMessageSchema = {
    type: "plan_approval_request",
    planContent: "string",
    planFilePath: "string"
};

// Plan approval response
const PlanApprovalResponseMessageSchema = {
    type: "plan_approval_response",
    approved: "boolean",
    feedback: "string?"
};
```

---

## 6. Plan Mode ↔ UI (02)

### UI Components

| Component | Purpose |
|-----------|---------|
| Status line indicator | Shows "⏸ Plan Mode on (shift+tab)" |
| Approval dialog | Plan preview with approve/reject options |
| Plan file editor | Markdown editing for plan content |
| Mode cycling | Shift+Tab to cycle modes |

### Status Line Colors

```javascript
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
```

### Approval Dialog

```javascript
function PlanApprovalDialog({ planContent, onApprove, onReject }) {
    return (
        <Box flexDirection="column">
            <Box borderStyle="round" borderColor="cyan">
                <Text>Plan Preview:</Text>
                <Markdown content={planContent} />
            </Box>

            <Box marginTop={1}>
                <Button onPress={onApprove} variant="primary">
                    Yes, let's implement
                </Button>
                <Button onPress={onRevise} variant="secondary">
                    Let me refine the plan
                </Button>
                <Button onPress={onReject} variant="tertiary">
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}
```

---

## State Management

### Mode Values

| Mode | Description |
|------|-------------|
| `default` | Normal operation |
| `plan` | Planning mode (read-only + plan file) |
| `acceptEdits` | Auto-accept edits mode |
| `delegate` | Delegate mode for teammate agents |
| `bypassPermissions` | Skip permission prompts |
| `dontAsk` | Minimize user prompts |

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

---

## Plan File Format

### Location

```
~/.claude_api/plans/<session-slug>.md
```

### Structure

```markdown
# Plan: <Task Description>

## Context
<Why this change is being made>

## Implementation Plan
1. <Step 1>
2. <Step 2>
...

## Files to Modify
- <path/to/file1>
- <path/to/file2>

## Verification
<How to test the changes>
```

---

## Summary

The Plan Mode module implements a structured planning workflow with these key integrations:

1. **System Reminder (04)** - Plan mode attachments, exit notifications
2. **Tools (05)** - Tool filtering, path restrictions
3. **Hooks (11)** - Tool interception, plan tracking
4. **Compact (07)** - Plan preservation
5. **Agent Teams (30)** - Swarm approval workflow
6. **UI (02)** - Status indicators, approval dialogs

The system enforces read-only exploration with a structured approval workflow before any implementation can begin.