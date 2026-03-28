# Module: Plan Mode (12)

## Overview

Plan Mode is a specialized session state that restricts the agent to read-only exploration and enforces a structured approval workflow before implementation. It implements the "Plan → Approve → Implement" safety pattern, requiring explicit user approval via ExitPlanMode before any code changes can be made.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this module:
- `EnterPlanModeTool` (Ki6) - Enter plan mode - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit with approval - chunks.143.mjs:2802
- `handlePlanModeTransition` (Dp) - Mode state hooks - chunks.1.mjs:2946

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       PLAN MODE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① State Machine                                                     │
│     mode ∈ {"default", "plan", "acceptEdits", "auto",               │
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

## State Management

### Mode Values

| Mode | Description |
|------|-------------|
| `default` | Normal operation |
| `plan` | Planning mode (read-only + plan file) |
| `acceptEdits` | Auto-accept edits mode |
| `auto` | Autonomous execution mode (gated by feature flag) |
| `bypassPermissions` | Skip permission prompts |
| `dontAsk` | Minimize user prompts |

### Plan Mode State Fields

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
// Dp - handlePlanModeTransition
// Location: chunks.1.mjs:2946-2950
// ============================================

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
```

---

## Analysis Documents

### Core Implementation

| Document | Description |
|----------|-------------|
| [plan_mode_complete_source_restoration_v3.md](plan_mode_complete_source_restoration_v3.md) | **v3** - Complete source restoration with tool filtering |
| [plan_mode_source_restoration_final.md](plan_mode_source_restoration_final.md) | **FINAL** - Complete source restoration with all algorithms |
| [plan_mode_complete_source_restoration_v2.md](plan_mode_complete_source_restoration_v2.md) | **v2** - Complete source restoration with ORIGINAL/READABLE code |
| [plan_mode_source_restoration.md](plan_mode_source_restoration.md) | **NEW** - Complete source restoration with ORIGINAL/READABLE code |
| [plan_mode_state_machine_complete.md](plan_mode_state_machine_complete.md) | **NEW** - Complete state machine with swarm approval workflow |
| [implementation.md](implementation.md) | Complete plan mode implementation |
| [state_management.md](state_management.md) | State variables and transitions |
| [tools_filtering.md](tools_filtering.md) | Tool restrictions in plan mode |
| [tool_filtering_complete.md](tool_filtering_complete.md) | **NEW** - Complete tool restrictions analysis |
| [plan_file_format.md](plan_file_format.md) | Plan file structure and format |

### User Interaction

| Document | Description |
|----------|-------------|
| [ask_user_question_complete.md](ask_user_question_complete.md) | **NEW** - AskUserQuestion tool for multi-round interactions |
| [ask_user_question.md](ask_user_question.md) | AskUserQuestion tool overview |
| [interview_phase.md](interview_phase.md) | Iterative interview workflow |
| [interview_phase_complete.md](interview_phase_complete.md) | **UPDATED** - Complete interview phase analysis |
| [plan_approval_flow.md](plan_approval_flow.md) | Plan approval lifecycle |
| [swarm_plan_approval_complete.md](swarm_plan_approval_complete.md) | **NEW** - Swarm teammate plan approval |
| [mode_cycling.md](mode_cycling.md) | Shift+Tab mode cycling |

### UI & Integration

| Document | Description |
|----------|-------------|
| [plan_mode_ui_complete_v2.md](plan_mode_ui_complete_v2.md) | **NEW** - Complete UI components, EnterPlanMode/ExitPlanMode tools |
| [reminder_system.md](reminder_system.md) | Plan mode attachments and system reminder integration |
| [compact_integration.md](compact_integration.md) | Plan preservation during compaction |
| [hooks_integration.md](hooks_integration.md) | Hooks in plan mode |
| [task_integration.md](task_integration.md) | Task system integration |
| [ui_linkage.md](ui_linkage.md) | UI components and rendering |

### Cross-Module Integration

| Document | Description |
|----------|-------------|
| [cross_module_integration_complete.md](cross_module_integration_complete.md) | **COMPLETE** - Full cross-module integration with source restoration |
| [../00_overview/cross_module_integration_complete_v3.md](../00_overview/cross_module_integration_complete_v3.md) | Complete cross-module integration for all 4 modules |
| [../00_overview/ui_interaction_complete_v2.md](../00_overview/ui_interaction_complete_v2.md) | UI components for Tools, MCP, Plan Mode, Task System |

---

## Key Algorithms

### Tool Filtering Algorithm

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
      // Checked at execution time against planFilePath
      return true;
    }

    // Block all other tools
    return false;
  });
}
```

### Plan Mode Attachment Variants

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
  return formatFullPlanReminder(attachment);        // 5-phase workflow
}
```

### Approval Flow

```
User triggers ExitPlanMode
  │
  ├─→ Show approval dialog
  │     ├─ "Ready to code?" options
  │     ├─ "Yes, let's implement"
  │     ├─ "Let me refine the plan"
  │     └─ "Cancel"
  │
  ├─→ If approved:
  │     ├─ Restore mode from prePlanMode
  │     ├─ Set hasExitedPlanMode = true
  │     └─ Generate plan_mode_exit attachment
  │
  └─→ If rejected:
        ├─ Stay in plan mode
        └─ Show rejected plan viewer
```

---

## /plan Command

### Syntax

```
/plan                    # Enter plan mode, describe task after
/plan <description>      # Enter plan mode with initial task framing
```

### Examples

```
/plan fix the authentication bug in the login flow
/plan implement dark mode support
/plan refactor database schema to support multi-tenancy
```

### Flow

```
User: /plan optimize the API response time
  │
  ├─→ Parse command, extract description
  ├─→ Enter plan mode (set mode = "plan")
  ├─→ Inject description into context
  └─→ Begin interview phase with task framing

Agent: [In Plan Mode]
       "I'll help you plan optimizing the API response time.
        Let me start by asking some questions..."
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

## Swarm Integration

### Teammate Plan Approval

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

### Message Format

```javascript
// plan_approval_request
{
  type: "plan_approval_request",
  planContent: "...",
  planFilePath: "~/.claude_api/plans/..."
}

// plan_approval_response
{
  type: "plan_approval_response",
  approved: true/false,
  feedback: "Optional revision feedback"
}
```

---

## Cross-Module Integration

### Plan Mode ↔ System Reminder (04)

- `plan_mode` attachment injected each turn
- `plan_mode_exit` attachment on exit
- Turn counting for sparse reminder timing

### Plan Mode ↔ Tools (05)

- Tool filtering via `isReadOnly()` check
- Write/Edit path restriction to plan file
- ExitPlanMode as only programmatic exit

### Plan Mode ↔ Hooks (11)

- PreToolUse hooks can modify tool availability
- PostToolUse hooks for plan file changes
- PreCompact hooks for plan preservation

### Plan Mode ↔ Compact (07)

- Plan preserved as state-preservation attachment
- Plan file not affected by compaction
- TodoWrite state preserved

---

## Quick Reference

### Tool Name Constants

```javascript
TOOL_NAME_ENTER_PLAN_MODE = "EnterPlanMode"  // dt
TOOL_NAME_EXIT_PLAN_MODE = "ExitPlanMode"    // aJ
TOOL_NAME_ASK_USER_QUESTION = "AskUserQuestion"  // Fw
```

### Mode Configuration

```javascript
MODE_CONFIGURATION = {
  plan: {
    displayName: "Plan Mode",
    statusText: "⏸ Plan Mode on (shift+tab)"
  }
}
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Interview phase enhancements |
| 2.1.72 | /plan command with description argument |
| 2.1.32 | Swarm teammate plan approval |
| 2.1.18 | Shift+Tab mode cycling |

---

## Symbol Validation Status

**Last validated:** 2026-03-27

All symbols in this module have been cross-validated against source code.

### Validation Reports
- [symbol_validation_report.md](symbol_validation_report.md) - Complete symbol validation
- [plan_mode_source_restoration.md](plan_mode_source_restoration.md) - Full source restoration with algorithms

### Key Validated Symbols

| Symbol | Validated Location | Status |
|--------|-------------------|--------|
| Ki6 (EnterPlanModeTool) | chunks.144.mjs:1579 | ✅ Correct |
| zD (ExitPlanModeTool) | chunks.143.mjs:2802 | ✅ Correct |
| dt (TOOL_NAME_ENTER_PLAN_MODE) | chunks.90.mjs:3121 | ✅ Correct |
| aJ (TOOL_NAME_EXIT_PLAN_MODE) | chunks.90.mjs:507 | ✅ Correct |
| Dp (handlePlanModeTransition) | chunks.1.mjs:2946 | ✅ Correct |
| AhY (handlePlanApproval) | chunks.145.mjs:2521 | ✅ Correct |
| Vx4 (PlanApprovalRequestMessageSchema) | chunks.129.mjs:1546 | ✅ Correct |
| Nx4 (PlanApprovalResponseMessageSchema) | chunks.129.mjs:1553 | ✅ Correct |

---

## Cross-Module Integration

### Plan Mode ↔ System Reminder (04)

Plan mode generates the following attachment types:
- `plan_mode` - Full 5-phase workflow instructions (injected each turn)
- `plan_mode_reentry` - Re-entering plan mode (brief reminder)
- `plan_mode_exit` - Exited plan mode notification
- `plan_file_reference` - Existing plan file content (post-compact)

**Attachment Variants:**
- Full format - Complete 5-phase workflow
- Sparse format - Minimal reminder for experienced users
- Subagent format - Brief for nested agents (no plan file editing)

### Plan Mode ↔ Tools (05)

Tool filtering in plan mode:
- `isReadOnly()` tools always allowed
- `Write`/`Edit` allowed only to plan file path
- `ExitPlanMode` is the only programmatic exit
- `EnterPlanMode` allowed for re-entry
- `AskUserQuestion` allowed for clarification

**Tool Filtering Algorithm:**
```javascript
function filterToolsForPlanMode(tools, planFilePath) {
    return tools.filter(tool => {
        if (tool.isReadOnly?.()) return true;
        if (tool.name === "ExitPlanMode") return true;
        if (tool.name === "EnterPlanMode") return true;
        if (tool.name === "AskUserQuestion") return true;
        if (tool.name === "Write" || tool.name === "Edit") return true; // Path checked at execution
        return false;
    });
}
```

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

**Message Flow:**
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