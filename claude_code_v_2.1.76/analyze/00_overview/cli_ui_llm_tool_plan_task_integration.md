# Cross-Module Integration Matrix (Claude Code 2.1.76)

> Complete integration matrix showing relationships between Tools, MCP, Plan Mode, Task System, and System Reminder modules.

---

## Overview

This document maps the integration points between the four primary modules and their connection to the System Reminder infrastructure.

---

## Integration Matrix

| From → To | Tools (05) | MCP (06) | Plan Mode (12) | Task System (13) | System Reminder (04) |
|-----------|------------|----------|----------------|------------------|----------------------|
| **Tools (05)** | — | MCP tools in registry | Tool filtering | Task tools | Progress, hooks |
| **MCP (06)** | Tool discovery | — | Elicitation UI | — | Elicitation queue |
| **Plan Mode (12)** | Tool filtering | — | — | Task integration | Plan attachments |
| **Task System (13)** | Task tools | — | Task hooks | — | Task status |
| **System Reminder (04)** | Attachments | Context | State | Notifications | — |

---

## Detailed Integration Points

### Tools ↔ MCP

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOOLS ↔ MCP INTEGRATION                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  MCP Server                                                          │
│       │                                                               │
│       │ tools/list                                                   │
│       ▼                                                               │
│  fetchMcpTools (JE)                                                  │
│       │                                                               │
│       │ Transform to tool objects                                    │
│       ▼                                                               │
│  Session Tool Set                                                    │
│       │                                                               │
│       │ mcp__server__tool prefix                                     │
│       ▼                                                               │
│  Tool Dispatcher (Wi6)                                               │
│       │                                                               │
│       │ Route to callMcpTool (pC)                                    │
│       ▼                                                               │
│  MCP Tool Execution                                                  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key symbols:**
- `JE` (fetchMcpTools) - chunks.170.mjs:533
- `pC` (callMcpTool) - chunks.169.mjs:1910

### Tools ↔ Plan Mode

```
┌─────────────────────────────────────────────────────────────────────┐
│                 TOOLS ↔ PLAN MODE INTEGRATION                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Enter Plan Mode                                                     │
│       │                                                               │
│       │ Set mode = "plan"                                            │
│       ▼                                                               │
│  Tool Filtering (Xk8)                                                │
│       │                                                               │
│       ├─→ Allow: Read-only tools                                    │
│       ├─→ Allow: ExitPlanMode, AskUserQuestion                      │
│       ├─→ Allow: Write/Edit (plan file only)                        │
│       └─→ Block: Bash, Agent, etc.                                  │
│                                                                       │
│  Execution Time Validation                                           │
│       │                                                               │
│       └─→ Write/Edit path check against planFilePath                │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key symbols:**
- `Xk8` (filterToolsByMode) - chunks.93.mjs:1568
- `Ki6` (EnterPlanModeTool) - chunks.144.mjs:1579
- `zD` (ExitPlanModeTool) - chunks.143.mjs:2802

### Tools ↔ Task System

```
┌─────────────────────────────────────────────────────────────────────┐
│                 TOOLS ↔ TASK SYSTEM INTEGRATION                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Task Tools                                                          │
│       │                                                               │
│       ├─→ TaskCreate (TR)                                           │
│       ├─→ TaskUpdate (ck)                                           │
│       ├─→ TaskGet (lt)                                              │
│       └─→ TaskList (it)                                             │
│                                                                       │
│  Core Functions                                                      │
│       │                                                               │
│       ├─→ createTask (aD1)                                          │
│       ├─→ updateTask (WI)                                            │
│       ├─→ deleteTask (sD1)                                           │
│       └─→ loadAllTasks (DX)                                          │
│                                                                       │
│  Hook Integration                                                    │
│       │                                                               │
│       └─→ TaskCompleted hooks (Hi6)                                  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key symbols:**
- `aD1` (createTask) - chunks.84.mjs:1669
- `WI` (updateTask) - chunks.84.mjs:1701
- `Hi6` (executeTaskCompletedHooks) - chunks.175.mjs:2594

### Tools ↔ System Reminder

```
┌─────────────────────────────────────────────────────────────────────┐
│               TOOLS ↔ SYSTEM REMINDER INTEGRATION                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Pre-Tool Hooks (y4q)                                                │
│       │                                                               │
│       ├─→ hook_additional_context → attachment                       │
│       ├─→ hook_blocking_error → attachment                           │
│       └─→ hook_error_during_execution → attachment                   │
│                                                                       │
│  Tool Execution                                                      │
│       │                                                               │
│       └─→ progress → attachment                                      │
│                                                                       │
│  Post-Tool Hooks (k4q)                                               │
│       │                                                               │
│       └─→ hook_additional_context → attachment                       │
│                                                                       │
│  Task System                                                         │
│       │                                                               │
│       └─→ task_status → attachment                                   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key symbols:**
- `y4q` (executePreToolHooksIterator) - chunks.146.mjs:74
- `k4q` (executePostToolHooksIterator) - chunks.145.mjs:3107
- `Ui8` (normalizeAttachmentForAPI) - chunks.174.mjs:3

### MCP ↔ System Reminder

```
┌─────────────────────────────────────────────────────────────────────┐
│                MCP ↔ SYSTEM REMINDER INTEGRATION                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  MCP Server Status                                                   │
│       │                                                               │
│       └─→ Connection state in session state                          │
│                                                                       │
│  Tool Discovery                                                      │
│       │                                                               │
│       └─→ Available MCP tools in context                             │
│                                                                       │
│  Elicitation                                                         │
│       │                                                               │
│       ├─→ elicitation queue in state                                 │
│       └─→ User response → attachment                                 │
│                                                                       │
│  Resource Subscriptions                                              │
│       │                                                               │
│       └─→ Resource updates → attachments                             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key symbols:**
- `WT7` (setupElicitationRequestHandler) - chunks.58.mjs:3
- `ZIq` (ElicitationDialog) - chunks.190.mjs:1242

### Plan Mode ↔ System Reminder

```
┌─────────────────────────────────────────────────────────────────────┐
│             PLAN MODE ↔ SYSTEM REMINDER INTEGRATION                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Enter Plan Mode                                                     │
│       │                                                               │
│       └─→ plan_mode attachment injected each turn                    │
│                                                                       │
│  Exit Plan Mode                                                      │
│       │                                                               │
│       └─→ plan_mode_exit attachment                                  │
│                                                                       │
│  Plan File                                                           │
│       │                                                               │
│       └─→ Path tracked in session state                              │
│                                                                       │
│  Swarm Integration                                                   │
│       │                                                               │
│       ├─→ plan_approval_request → team-lead                          │
│       └─→ plan_approval_response → teammate                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key symbols:**
- `Dp` (handlePlanModeTransition) - chunks.1.mjs:2946
- `AhY` (handlePlanApproval) - chunks.145.mjs:2521

### Task System ↔ System Reminder

```
┌─────────────────────────────────────────────────────────────────────┐
│            TASK SYSTEM ↔ SYSTEM REMINDER INTEGRATION                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Task Status Changes                                                 │
│       │                                                               │
│       └─→ task_status attachment                                    │
│                                                                       │
│  Task Claims (Team Mode)                                             │
│       │                                                               │
│       ├─→ claimTask (OT8) → notification                            │
│       └─→ unassignTeammateTasks (ft) → cleanup                      │
│                                                                       │
│  Task Completed Hooks                                                │
│       │                                                               │
│       └─→ Hook messages → attachments                               │
│                                                                       │
│  UI State                                                            │
│       │                                                               │
│       └─→ expandedView: "tasks"                                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key symbols:**
- `OT8` (claimTask) - chunks.84.mjs:1781
- `ft` (unassignTeammateTasks) - chunks.84.mjs:1883

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPLETE DATA FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  User Input                                                              │
│       │                                                                   │
│       ▼                                                                   │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐            │
│  │   CLI   │────▶│   UI    │────▶│ Agent   │────▶│   LLM   │            │
│  │  (01)   │     │  (02)   │     │  Loop   │     │   API   │            │
│  └─────────┘     └─────────┘     └────┬────┘     └─────────┘            │
│                                       │                                   │
│                                       ▼                                   │
│                                 ┌──────────┐                             │
│                                 │  Tools   │◀───── MCP Tools (06)        │
│                                 │  (05)    │                             │
│                                 └────┬─────┘                             │
│                                      │                                    │
│          ┌───────────────────────────┼───────────────────────────┐       │
│          │                           │                           │       │
│          ▼                           ▼                           ▼       │
│   ┌────────────┐            ┌────────────┐            ┌────────────┐     │
│   │   Hooks    │            │   Tasks    │            │   Plan     │     │
│   │   (11)     │            │   (13)     │            │   (12)     │     │
│   └─────┬──────┘            └─────┬──────┘            └─────┬──────┘     │
│         │                         │                         │             │
│         └─────────────────────────┴─────────────────────────┘             │
│                                       │                                   │
│                                       ▼                                   │
│                            ┌───────────────────┐                         │
│                            │  System Reminder  │                         │
│                            │       (04)        │                         │
│                            └───────────────────┘                         │
│                                       │                                   │
│                                       ▼                                   │
│                            ┌───────────────────┐                         │
│                            │  LLM Context      │                         │
│                            └───────────────────┘                         │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Modal Priority Stack

```
Priority 1: message-selector    (highest)
Priority 2: sandbox-permission
Priority 3: tool-permission
Priority 4: prompt              (AskUserQuestion)
Priority 5: worker-sandbox-permission
Priority 6: elicitation         (MCP)
Priority 7: cost
Priority 8: ide-onboarding
Priority 9: effort-callout
Priority 10: remote-callout
Priority 11: lsp-recommendation
Priority 12: desktop-upsell     (lowest)
```

---

## Quick Reference

### Key Integration Files

| Integration | Primary File |
|-------------|--------------|
| Tools ↔ MCP | chunks.170.mjs, chunks.169.mjs |
| Tools ↔ Plan | chunks.93.mjs, chunks.144.mjs |
| Tools ↔ Tasks | chunks.84.mjs, chunks.175.mjs |
| Tools ↔ Reminders | chunks.146.mjs |
| MCP ↔ UI | chunks.190.mjs, chunks.196.mjs |
| Plan ↔ Swarm | chunks.145.mjs |

### Attachment Types Summary

| Type | Source | Purpose |
|------|--------|---------|
| `hook_additional_context` | Hooks | Hook-provided context |
| `hook_blocking_error` | Hooks | Hook denial |
| `progress` | Tools | Execution progress |
| `task_status` | Tasks | Status changes |
| `plan_mode` | Plan Mode | Plan context |
| `elicitation` | MCP | User input request |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Enhanced elicitation, binary content |
| 2.1.72 | Plan approval for swarm |
| 2.1.32 | Task system integration |
| 2.1.18 | Modal priority system |