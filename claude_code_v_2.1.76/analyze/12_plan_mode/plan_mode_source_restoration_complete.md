# Plan Mode Module - Complete Source Restoration

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ All symbols cross-validated against source code

---

## Overview

This document provides complete source-level restoration of key functions in the Plan Mode module. Plan Mode enforces a "Plan → Approve → Implement" safety pattern, requiring explicit user approval before any code changes.

---

## 1. Enter Plan Mode Tool (Ki6)

### What it does
Transitions the session into plan mode, enabling read-only exploration and plan file editing.

### How it works
1. Validate not in agent context
2. Trigger mode transition hook
3. Update state: save previous mode, set mode to "plan"
4. Return entry message with workflow instructions

### Source Code

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

    toAutoClassifierInput() {
        return "";
    },

    async checkPermissions(input) {
        // Always allowed - plan mode is a safe operation
        return { behavior: "allow", updatedInput: input };
    },

    renderToolUseMessage: renderEnterPlanModeUseMessage,
    renderToolUseProgressMessage: renderEnterPlanModeProgress,
    renderToolResultMessage: renderEnterPlanModeResult,
    renderToolUseRejectedMessage: renderEnterPlanModeRejected,
    renderToolUseErrorMessage: renderEnterPlanModeError,

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
//          Ez→updateMode, LT6→savePrePlanMode, rO→isSubAgentMode,
//          V8q→renderEnterPlanModeUseMessage, k8q→renderEnterPlanModeProgress,
//          E8q→renderEnterPlanModeResult, y8q→renderEnterPlanModeRejected, L8q→renderEnterPlanModeError
```

### Key insight
The `shouldDefer: true` flag indicates this tool is deferred until all other tools are processed. The `mapToolResultToToolResultBlockParam` customizes the message based on whether it's a subagent.

---

## 2. Handle Plan Mode Transition (Dp)

### What it does
Manages global state flags when transitioning to/from plan mode.

### How it works
- Entering plan mode: Reset `needsPlanModeExitAttachment` to false
- Leaving plan mode: Set `needsPlanModeExitAttachment` to true

### Source Code

```javascript
// ============================================
// handlePlanModeTransition - Manage mode transition state
// Location: chunks.1.mjs:2946-2949
// ============================================

// ORIGINAL (for source lookup):
function Dp(A, q) {
    if (q === "plan" && A !== "plan") v1.needsPlanModeExitAttachment = !1;
    if (A === "plan" && q !== "plan") v1.needsPlanModeExitAttachment = !0
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

// Mapping: Dp→handlePlanModeTransition, A→fromMode, q→toMode, v1→globalSessionState
```

### Why this approach
The `needsPlanModeExitAttachment` flag signals to the system reminder system that a plan_mode_exit attachment should be generated on the next turn.

---

## 3. Set Needs Plan Mode Exit Attachment (JS)

### What it does
Sets the global flag for plan mode exit attachment generation.

### Source Code

```javascript
// ============================================
// setNeedsPlanModeExitAttachment - Set exit attachment flag
// Location: chunks.1.mjs:2942-2944
// ============================================

// ORIGINAL (for source lookup):
function JS(A) {
    v1.needsPlanModeExitAttachment = A
}

// READABLE (for understanding):
function setNeedsPlanModeExitAttachment(value) {
    globalSessionState.needsPlanModeExitAttachment = value;
}

// Mapping: JS→setNeedsPlanModeExitAttachment, A→value, v1→globalSessionState
```

---

## 4. Mode State Machine

### Mode Values

| Mode | Description |
|------|-------------|
| `default` | Normal operation |
| `plan` | Planning mode (read-only + plan file) |
| `acceptEdits` | Auto-accept edits mode |
| `delegate` | Delegate mode for teammate agents |
| `bypassPermissions` | Skip permission prompts |
| `dontAsk` | Minimize user prompts |

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
```

---

## 5. Plan File Format

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

## 6. Tool Filtering in Plan Mode

### What it does
Restricts available tools when in plan mode.

### Rules
1. **Always allowed**: `isReadOnly()` tools
2. **Allowed with restrictions**: `Write`/`Edit` (path checked at execution)
3. **Special tools**: `ExitPlanMode`, `EnterPlanMode`, `AskUserQuestion`
4. **Blocked**: All other tools

### Source Code

```javascript
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
        // (Path is checked at execution time)
        if (tool.name === "Write" || tool.name === "Edit") {
            return true;  // Path validation happens in tool execution
        }

        // Block all other tools
        return false;
    });
}
```

---

## 7. Swarm Teammate Plan Approval

### What it does
When a swarm teammate wants to exit plan mode, they must get approval from the team-lead.

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

### Message Format

```javascript
// plan_approval_request
{
    type: "plan_approval_request",
    from: "agent-name",
    timestamp: new Date().toISOString(),
    planFilePath: "~/.claude_api/plans/...",
    planContent: "...",
    requestId: "plan_approval-xxx-yyy"
}

// plan_approval_response
{
    type: "plan_approval_response",
    approved: true/false,
    feedback: "Optional revision feedback"
}
```

---

## 8. Plan Mode Attachment Variants

### Types

| Attachment Type | When Used |
|-----------------|-----------|
| `plan_mode` | Injected each turn during plan mode |
| `plan_mode_reentry` | Re-entering plan mode (brief) |
| `plan_mode_exit` | Exited plan mode notification |
| `plan_file_reference` | Existing plan file content (post-compact) |

### Variants

| Variant | Purpose |
|---------|---------|
| Full | Complete 5-phase workflow |
| Sparse | Minimal reminder for experienced users |
| Subagent | Brief for nested agents (no plan file editing) |
| Iterative | Pair-planning workflow |

---

## Summary

### Validated Symbols

| Obfuscated | Readable | Location | Status |
|------------|----------|----------|--------|
| Ki6 | EnterPlanModeTool | chunks.144.mjs:1579 | ✅ Verified |
| dt | TOOL_NAME_ENTER_PLAN_MODE | chunks.90.mjs:3121 | ✅ Verified |
| Dp | handlePlanModeTransition | chunks.1.mjs:2946 | ✅ Verified |
| JS | setNeedsPlanModeExitAttachment | chunks.1.mjs:2942 | ✅ Verified |
| Ez | updateMode | chunks.*.mjs | ✅ Verified |
| LT6 | savePrePlanMode | chunks.*.mjs | ✅ Verified |
| hIY | emptyObjectSchema | chunks.144.mjs:1577 | ✅ Verified |
| SIY | messageSchema | chunks.144.mjs:1577 | ✅ Verified |

### Key Dependencies

| Symbol | Purpose |
|--------|---------|
| v8q | getEnterPlanModePrompt |
| rO | isSubAgentMode |
| V8q | renderEnterPlanModeUseMessage |
| k8q | renderEnterPlanModeProgress |
| E8q | renderEnterPlanModeResult |
| y8q | renderEnterPlanModeRejected |
| L8q | renderEnterPlanModeError |
| v1 | globalSessionState |