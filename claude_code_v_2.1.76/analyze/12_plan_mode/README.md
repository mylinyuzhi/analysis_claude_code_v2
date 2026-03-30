# Module: Plan Mode (12)

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-29
> **Status**: Complete source-level analysis with dual-version code

---

## Overview

Plan Mode is a specialized session state that restricts the agent to read-only exploration and enforces a structured approval workflow before implementation. It implements the "Plan -> Approve -> Implement" safety pattern, requiring explicit user approval via ExitPlanMode before any code changes can be made.

The module spans multiple source files -- primarily chunks.173.mjs (state machine, system reminders), chunks.144.mjs (EnterPlanMode tool), chunks.143.mjs (ExitPlanMode tool), chunks.191.mjs (mode cycling), and chunks.90.mjs (plan file management).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Plan Mode section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, State)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform (Permissions, Prompt)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (UI)

Key functions in this module:
- `EnterPlanModeTool` (Ki6) - Enter plan mode tool object - chunks.144.mjs:1579
- `ExitPlanModeTool` (zD) - Exit plan mode with approval - chunks.143.mjs:2798
- `handlePlanModeTransition` (Dp) - Mode state transition hook - chunks.1.mjs:2946
- `modeTransitionHandler` (ki) - Full mode transition dispatcher - chunks.173.mjs:409
- `savePrePlanMode` (LT6) - Save mode before entering plan - chunks.173.mjs:702
- `cycleMode` (W26) - Shift+Tab mode cycling - chunks.191.mjs:3007
- `planModeReminderDispatcher` (Wzz) - System reminder dispatcher - chunks.173.mjs:2525
- `getPlanFilePath` (Fj) - Plan file path resolver - chunks.90.mjs:533
- `getPlanContent` (sJ) - Read plan file content - chunks.90.mjs:539
- `isPlanModeInterviewPhase` (rO) - Feature flag for interview workflow - chunks.50.mjs:2520

---

## Architecture

```
                         PLAN MODE ARCHITECTURE
 ========================================================================

   Source Files:
   chunks.173.mjs  -- State machine (ki, LT6) + System reminders (Wzz, Nzz, ...)
   chunks.144.mjs  -- EnterPlanMode tool (Ki6)
   chunks.143.mjs  -- ExitPlanMode tool (zD) + Plan approval (ag8, k1q)
   chunks.191.mjs  -- Mode cycling (W26, cbq, lbq)
   chunks.90.mjs   -- Plan file management (Fj, sJ, bB)
   chunks.1.mjs    -- Global state flags (HV, nk6, JS, Fu1, Dp)
   chunks.50.mjs   -- Feature flags (rO)
   chunks.147.mjs  -- Attachments (DuY, XuY)

 ========================================================================

 +--------------------------+     +----------------------------+
 | User / Shift+Tab / Tool  |     |       Global AppState      |
 +------------+-------------+     |  - mode: string            |
              |                   |  - prePlanMode: string     |
              v                   |  - hasExitedPlanMode: bool |
 +------------+-------------+     |  - needsPlanModeExit-      |
 |   Mode Transition Layer  |     |    Attachment: bool        |
 |   ki() --> LT6()         |---->|  - awaitingPlanApproval    |
 |   Dp() state flags       |     +----------------------------+
 +------------+-------------+
              |
    +---------+---------+
    |                   |
    v                   v
 +--+--------+   +------+--------+
 | Enter Plan |   | Exit Plan     |
 | Ki6 tool   |   | zD tool       |
 | save mode  |   | restore mode  |
 | set "plan" |   | teammate path |
 +--+---------+   | main path     |
    |             +------+--------+
    v                    |
 +--+---------+          v
 | System     |   +------+--------+
 | Reminders  |   | Plan Approval |
 | Wzz()      |   | (teams only)  |
 | dispatches:|   | ag8() set     |
 |  Nzz full  |   | x3() mailbox  |
 |  kzz iview |   +---------------+
 |  Ezz sparse|
 |  yzz subagt|
 |  Zzz ultra |
 +------------+

 +--------------------------------------------------+
 | Mode Cycling (Shift+Tab)                          |
 | W26: default -> acceptEdits -> plan ->            |
 |      [bypassPermissions ->] [auto ->] default     |
 +--------------------------------------------------+

 +--------------------------------------------------+
 | Tool Filtering                                    |
 | Plan mode read-only enforced via system prompt    |
 | Plan subagent (x01) uses disallowedTools list     |
 | Write/Edit allowed only to plan file path         |
 +--------------------------------------------------+
```

---

## Key Components

### A. State Machine and Mode Transitions

| Component | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| Mode transition handler | ki | chunks.173.mjs:409 | Dispatches all mode transitions, saves/restores prePlanMode |
| Save pre-plan mode | LT6 | chunks.173.mjs:702 | Records mode before entering plan for later restoration |
| Plan mode transition hook | Dp | chunks.1.mjs:2946 | Sets/clears needsPlanModeExitAttachment flag |
| hasExitedPlanMode setter | HV | chunks.1.mjs:2934 | Marks that plan mode was exited (for attachment logic) |
| hasExitedPlanMode getter | nk6 | chunks.1.mjs:2930 | Reads exit flag |
| needsPlanModeExitAttachment setter | JS | chunks.1.mjs:2942 | Controls exit attachment injection |
| needsPlanModeExitAttachment getter | Fu1 | chunks.1.mjs:2938 | Reads attachment flag |

### B. Tools

| Component | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| EnterPlanMode tool | Ki6 | chunks.144.mjs:1579 | Enter plan mode, save state, set "plan" |
| ExitPlanMode tool | zD | chunks.143.mjs:2798 | Exit plan mode, restore state, team approval path |
| EnterPlanMode name | dt | chunks.90.mjs:3121 | Constant: "EnterPlanMode" |
| ExitPlanMode name | aJ | chunks.90.mjs:505 | Constant: "ExitPlanMode" |
| EnterPlanMode prompt | RIY | chunks.144.mjs:1416 | Dynamic prompt generator |
| ExitPlanMode prompt | Z1q | chunks.143.mjs:2595 | Detailed usage instructions |

### C. Plan File Management

| Component | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| Plan file path | Fj | chunks.90.mjs:533 | Resolves plan file path from session slug |
| Plan file reader | sJ | chunks.90.mjs:539 | Synchronous read, null on ENOENT |
| Session slug generator | bB | chunks.90.mjs:~509 | Generates slug for plan file naming |

### D. System Reminders

| Component | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| Reminder dispatcher | Wzz | chunks.173.mjs:2525 | Routes to variant based on context |
| Full reminder | Nzz | chunks.173.mjs:2555 | 5-phase workflow (~1500 tokens) |
| Interview reminder | kzz | chunks.173.mjs:2644 | Iterative pair-planning variant |
| Sparse reminder | Ezz | chunks.173.mjs:2692 | Condensed version (~150 tokens) |
| Subagent reminder | yzz | chunks.173.mjs:2701 | Brief for nested agents (~400 tokens) |
| Ultraplan-complete | Zzz | chunks.173.mjs:2532 | Calls ExitPlanMode immediately |

### E. Mode Cycling

| Component | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| Cycle order | W26 | chunks.191.mjs:3007 | Defines mode rotation sequence |
| Auto mode check | cbq | chunks.191.mjs:3003 | Checks if auto mode is available |
| Cycle wrapper | lbq | chunks.191.mjs:3027 | Calls W26 then applies ki() transition |

### F. UI Components

| Component | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| Enter result renderer | E8q | chunks.144.mjs:1526 | "Entered plan mode" |
| Enter rejected renderer | y8q | chunks.144.mjs:1541 | "User declined to enter plan mode" |
| Exit result renderer | T1q | chunks.143.mjs:2628 | Three-state: no plan / awaiting / approved |

### G. Team Plan Approval

| Component | Symbol | Location | Purpose |
|-----------|--------|----------|---------|
| Set awaiting approval | ag8 | chunks.143.mjs:2707 | Marks task as awaiting plan approval |
| Clear awaiting approval | k1q | chunks.143.mjs:2713 | Clears approval flag |
| Approve handler | _xY | chunks.145.mjs:2521 | Handle team-lead approve |
| Reject handler | wxY | chunks.145.mjs:2569 | Handle team-lead reject |

---

## Analysis Documents

### Comprehensive

| Document | Description |
|----------|-------------|
| [plan_mode_complete_analysis.md](plan_mode_complete_analysis.md) | Complete source-level analysis of all subsystems with dual-version code |

### Core Implementation

| Document | Description |
|----------|-------------|
| [plan_mode_source_restoration_final.md](plan_mode_source_restoration_final.md) | Complete source restoration with all algorithms |
| [plan_mode_state_machine_complete.md](plan_mode_state_machine_complete.md) | State machine with swarm approval workflow |
| [implementation.md](implementation.md) | Plan mode implementation overview |
| [state_management.md](state_management.md) | State variables and transitions |
| [tools_filtering.md](tools_filtering.md) | Tool restrictions in plan mode |
| [tool_filtering_complete.md](tool_filtering_complete.md) | Complete tool restrictions analysis |
| [plan_file_format.md](plan_file_format.md) | Plan file structure and format |

### User Interaction

| Document | Description |
|----------|-------------|
| [ask_user_question_complete.md](ask_user_question_complete.md) | AskUserQuestion tool for multi-round interactions |
| [ask_user_question.md](ask_user_question.md) | AskUserQuestion tool overview |
| [interview_phase.md](interview_phase.md) | Iterative interview workflow |
| [interview_phase_complete.md](interview_phase_complete.md) | Complete interview phase analysis |
| [plan_approval_flow.md](plan_approval_flow.md) | Plan approval lifecycle |
| [swarm_plan_approval_complete.md](swarm_plan_approval_complete.md) | Swarm teammate plan approval |
| [mode_cycling.md](mode_cycling.md) | Shift+Tab mode cycling |

### UI and Integration

| Document | Description |
|----------|-------------|
| [plan_mode_ui_complete.md](plan_mode_ui_complete.md) | UI components for EnterPlanMode/ExitPlanMode |
| [reminder_system.md](reminder_system.md) | Plan mode attachments and system reminders |
| [compact_integration.md](compact_integration.md) | Plan preservation during compaction |
| [hooks_integration.md](hooks_integration.md) | Hooks in plan mode |
| [task_integration.md](task_integration.md) | Task system integration |
| [ui_linkage.md](ui_linkage.md) | UI components and rendering |

### Cross-Module

| Document | Description |
|----------|-------------|
| [cross_module_integration_complete.md](cross_module_integration_complete.md) | Full cross-module integration |
| [plan_mode_cross_module_complete.md](plan_mode_cross_module_complete.md) | Cross-module dependencies |

---

## Quick Reference

### Symbol Lookup

```
Need plan mode symbols?
  --> symbol_index_core_features.md (Module: Plan Mode section)

Need agent loop / state symbols?
  --> symbol_index_core_execution.md

Need permission / prompt symbols?
  --> symbol_index_infra_platform.md

Need UI component symbols?
  --> symbol_index_infra_integration.md
```

### Mode Values

| Mode | Description |
|------|-------------|
| `default` | Normal operation |
| `plan` | Planning mode (read-only + plan file) |
| `acceptEdits` | Auto-accept edits mode |
| `auto` | Autonomous execution mode (gated by feature flag) |
| `bypassPermissions` | Skip permission prompts |
| `dontAsk` | Minimize user prompts |

### Tool Name Constants

```
TOOL_NAME_ENTER_PLAN_MODE  = "EnterPlanMode"     (dt, chunks.90.mjs:3121)
TOOL_NAME_EXIT_PLAN_MODE   = "ExitPlanMode"       (aJ, chunks.90.mjs:505)
TOOL_NAME_ASK_USER_QUESTION = "AskUserQuestion"   (TH, chunks.89.mjs:566)
```

### Key Keybindings

```
Shift+Tab      --> cycle mode (W26 via lbq)
Meta+M         --> cycle mode (fallback for older node versions)
Keybinding ID  --> "chat:cycleMode"
```

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Interview phase enhancements, ultraplan-complete workflow |
| 2.1.72 | /plan command with description argument |
| 2.1.32 | Swarm teammate plan approval |
| 2.1.18 | Shift+Tab mode cycling |

---

## Symbol Validation Status

**Last validated:** 2026-03-29

All symbols in this module have been cross-validated against source code.
See [symbol_validation_report.md](symbol_validation_report.md) for full validation details.
