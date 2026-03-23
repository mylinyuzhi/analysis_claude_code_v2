# System Reminder Module - Complete Documentation

> **Module**: System Reminders (Attachments-to-API Normalization)
> **Version**: Claude Code 2.1.76
> **Source**:
> - `chunks.174.mjs:1-469` (normalizeAttachmentForAPI)
> - `chunks.173.mjs:1378-1412` (createUserMessage)
> - `chunks.173.mjs:2490-2740` (XML wrappers, plan/auto mode reminders)
> - `chunks.147.mjs:1-1262` (attachment producers)

---

## Overview

System reminders are **injected messages that guide the LLM's behavior without being visible to the end user in the chat UI**. They appear as meta-flagged user messages in the conversation stream, carrying instructions, context, and state notifications that the model needs to respond appropriately.

This module provides comprehensive documentation of the system reminder architecture, implementation details, and integration points.

---

## Documentation Index

### Core Documentation

| Document | Purpose | Key Topics |
|----------|---------|------------|
| [**overview.md**](./overview.md) | Architecture overview | Three-layer pipeline, core functions, design decisions |
| [**implementation_details.md**](./implementation_details.md) | Code-level implementation | Core functions, plan mode variants, XML processing |
| [**reminder_types.md**](./reminder_types.md) | Complete type catalog | All 57+ attachment types with format and triggers |
| [**attachment_producers.md**](./attachment_producers.md) | Producer deep dive | 40+ producer functions, orchestration, execution strategy |
| [**normalization_flow_diagram.md**](./normalization_flow_diagram.md) | Visual flow documentation | Decision trees, message patterns, token analysis |
| [**integration_points.md**](./integration_points.md) | Cross-module integration | Agent loop, plan mode, hooks, MCP, LSP, IDE |
| [**ui_linkage.md**](./ui_linkage.md) | UI visibility | isMeta flag, message filtering, API preparation |
| [**edge_cases_and_failures.md**](./edge_cases_and_failures.md) | Error handling | Three-layer fault isolation, timeout behavior, recovery |
| [**performance_and_telemetry.md**](./performance_and_telemetry.md) | Performance analysis | Parallel execution, telemetry, optimization |
| [**already_read_file_report.md**](./already_read_file_report.md) | Specific type analysis | already_read_file implementation details |

### Per-Type Analysis Documents

| Document | Types Covered | Key Content |
|----------|--------------|-------------|
| [**types_team_mode.md**](./types_team_mode.md) | `teammate_mailbox`, `team_context` | Team/swarm integration, trigger conditions |
| [**types_file_context.md**](./types_file_context.md) | `directory`, `file`, `edited_text_file`, `compact_file_reference`, `pdf_reference`, `already_read_file` | File loading, @-mention handling, truncation |
| [**types_ide_integration.md**](./types_ide_integration.md) | `selected_lines_in_ide`, `opened_file_in_ide`, `diagnostics` | IDE context, LSP integration |
| [**types_task_management.md**](./types_task_management.md) | `todo`, `todo_reminder`, `task_reminder`, `task_status`, `task_progress` | Frequency throttling, turn counting |
| [**types_mode_control.md**](./types_mode_control.md) | `plan_mode`, `plan_mode_reentry`, `plan_mode_exit`, `plan_file_reference`, `delegate_mode`, `delegate_mode_exit` | Variant selection, full/sparse/subagent; /plan with description argument (v2.1.76) |
| [**types_skills_memory.md**](./types_skills_memory.md) | `invoked_skills`, `skill_listing`, `nested_memory`, `mcp_resource`, `ultramemory`, `dynamic_skill`, `agent_mention` | Memory loading, MCP resources, cooldown; CLAUDE_SKILL_DIR, InstructionsLoaded, last-modified headers (v2.1.76) |
| [**types_hooks.md**](./types_hooks.md) | `async_hook_response`, `hook_blocking_error`, `hook_success`, `hook_additional_context`, `hook_stopped_continuation`, `post_compact`, `elicitation`, `elicitation_result`, `instructions_loaded`, `config_change`, `worktree_create`, `worktree_remove` | Hook response delivery, blocking behavior; new hook types (v2.1.76) |
| [**types_status_budget.md**](./types_status_budget.md) | `token_usage`, `budget_usd`, `compaction_reminder`, `critical_system_reminder`, `queued_command`, `output_style`, `verify_plan_reminder`, `session_name` | Resource tracking, queued messages; session_name (v2.1.76) |
| [**types_silent.md**](./types_silent.md) | All silent types | Why silent types exist, internal state tracking |

### Quick Reference

| Document | Purpose |
|----------|---------|
| [**quick_reference.md**](./quick_reference.md) | Summary tables of all types, triggers, configuration, source locations |

---

## Quick Start

### What are System Reminders?

Examples of what system reminders convey:

- "Plan mode is active -- do not make edits"
- "The user opened file X in the IDE"
- "Your todo list has changed -- here are the contents"
- "Auto-compact is enabled, older messages will be summarized"
- "A hook blocked this action with error: ..."

### How They Work

```
┌──────────────────────────────────────────────────────────────────────┐
│                   LAYER 1: ATTACHMENT PRODUCTION                      │
│                    (_uY - assembleAllAttachments)                     │
│                      chunks.147.mjs:3-18                              │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               ↓
┌──────────────┴───────────────────────────────────────────────────────┐
│                   LAYER 2: ATTACHMENT NORMALIZATION                   │
│                  (Ui8 - normalizeAttachmentForAPI)                    │
│                     chunks.174.mjs:3-469                              │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               ↓
┌──────────────┴───────────────────────────────────────────────────────┐
│                    LAYER 3: MESSAGE STREAM INJECTION                  │
│                   (Vf6 - attachmentGenerator)                         │
│                      chunks.147.mjs:822-829                           │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Reminder Type Categories

### Pre-Switch Types (Team Mode Only)
- `teammate_mailbox` - Messages from teammates
- `team_context` - Team identity and resources

### File & Directory Context
- `directory` - Directory listing
- `file` - File contents (text, image, notebook, PDF)
- `edited_text_file` - File modification notification
- `compact_file_reference` - Compacted file reference
- `pdf_reference` - Large PDF notification
- `already_read_file` - Unchanged file (silent)

### IDE Integration
- `selected_lines_in_ide` - User selection context
- `opened_file_in_ide` - File open notification
- `diagnostics` - LSP diagnostics

### Todo & Task Management
- `todo` - Todo list status
- `todo_reminder` - Periodic todo reminder
- `task_reminder` - Task system reminder
- `task_status` - Background task status
- `task_progress` - Task progress messages

### Mode Control
- `plan_mode` - Full plan mode instructions (v2.1.76: /plan supports description argument)
- `plan_mode_reentry` - Re-entering plan mode
- `plan_mode_exit` - Exited plan mode
- `plan_file_reference` - Existing plan file content (post-compact)
- `delegate_mode` - Team delegate mode
- `delegate_mode_exit` - Exited delegate mode
- `auto_mode` - Auto mode instructions (v2.1.76 new)
- `auto_mode_exit` - Exited auto mode (v2.1.76 new)

### Skills & Memory
- `invoked_skills` - Skill invocation memory
- `skill_listing` - Available skills (v2.1.76: includes CLAUDE_SKILL_DIR env var support)
- `nested_memory` - Memory content (v2.1.76: last-modified timestamps in headers)
- `relevant_memories` - Memory files with timestamps (v2.1.76 new)
- `mcp_resource` - MCP resource content
- `ultramemory` - Ultramemory content
- `dynamic_skill` - Dynamically discovered skills
- `agent_mention` - Agent @-mention invocation

### Hooks & Async Responses
- `async_hook_response` - Hook response
- `hook_blocking_error` - Hook blocking
- `hook_success` - Hook success
- `hook_additional_context` - Hook context
- `hook_stopped_continuation` - Hook stopped
- `post_compact` - PostCompact hook event (v2.1.76 new)
- `elicitation` - Elicitation hook event (v2.1.76 new)
- `elicitation_result` - Elicitation result hook event (v2.1.76 new)
- `instructions_loaded` - InstructionsLoaded hook event (v2.1.76 new)
- `config_change` - ConfigChange hook event (v2.1.76 new)
- `worktree_create` - WorktreeCreate hook event (v2.1.76 new)
- `worktree_remove` - WorktreeRemove hook event (v2.1.76 new)

### Status & Budget Notifications
- `token_usage` - Token count
- `budget_usd` - USD budget
- `compaction_reminder` - Auto-compact notification
- `critical_system_reminder` - Critical alerts
- `queued_command` - Queued user message
- `session_name` - Current session name (v2.1.76 new)
- `output_token_usage` - Output token tracking (v2.1.76 new)
- `date_change` - Date change notification (v2.1.76 new)
- `ultrathink_effort` - Reasoning effort level (v2.1.76 new)
- `deferred_tools_delta` - Deferred tools availability changes (v2.1.76 new)
- `mcp_instructions_delta` - MCP server instruction changes (v2.1.76 new)

### Silent / No-Op Types
- `already_read_file`, `command_permissions`, `edited_image_file`
- `hook_cancelled`, `hook_error_during_execution`, `hook_non_blocking_error`
- `hook_system_message`, `hook_permission_decision`, `structured_output`
- `autocheckpointing`, `background_task_status`, `context_efficiency` (v2.1.76 new)

---

## Key Functions

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `normalizeAttachmentForAPI` | Ui8 | chunks.174.mjs:3-469 | Main dispatcher converting attachments to messages |
| `wrapWithSystemReminderTags` | b5 | chunks.173.mjs:2496-2523 | Wraps messages in XML tags |
| `wrapInXmlTag` | af | chunks.173.mjs:2490-2494 | Creates XML wrapper string |
| `createUserMessage` | p1 | chunks.173.mjs:1378-1412 | Message factory with isMeta flag |
| `createToolCallMessage` | nr6 | chunks.174.mjs:490-495 | Synthetic tool call message |
| `createToolResultMessage` | ir6 | chunks.174.mjs:471-488 | Synthetic tool result message |
| `assembleAllAttachments` | _uY | chunks.147.mjs:3-18 | Main orchestrator for attachment production |
| `timedAttachmentProducer` | Hz | chunks.147.mjs:20-46 | Telemetry wrapper for producers |
| `planModeReminderDispatcher` | Wzz | chunks.173.mjs:2525-2530 | Routes to plan mode variant |

---

## Design Principles

### 1. User Messages, Not System Messages

System reminders are injected as **user-role messages** with `isMeta: true`, not as system messages. This enables:

- **Conversation context positioning** - Reminders appear inline at relevant points
- **Compaction compatibility** - Reminders participate in auto-compaction
- **Pipeline uniformity** - Single message processing pipeline

### 2. Fail Safe, Proceed with Partial Context

The system never crashes due to attachment failures:

- Three-layer error isolation
- 1-second global timeout
- Silent fallback for unknown types

### 3. Token Efficiency

- Sparse vs. full reminders (plan mode)
- Frequency throttling (todos, tasks)
- Size limits and truncation (files)
- Deduplication (skills)

---

## Integration Points

### Agent Loop (Module 01)
- `bG1` calls `oP1` during message preparation
- Lazy attachment generation via async generator

### Plan Mode (Module 11)
- Mode detection via `toolPermissionContext.mode`
- Variant selection (full/sparse/subagent)
- Plan file path provision

### Auto-Compaction (Module 07)
- Meta message detection via `isMeta` flag
- Special retention rules during compaction
- v2.1.76: PostCompact hook fires after compaction completes

### Hooks System (Module 21)
- Async message passing via registry
- Hook response delivery as attachments
- v2.1.76: New hook types: PostCompact, Elicitation, ElicitationResult, InstructionsLoaded, ConfigChange, WorktreeCreate, WorktreeRemove

### MCP Protocol (Module 23)
- Resource fetching via @-mentions
- External knowledge injection

### LSP Integration (Module 25)
- Diagnostic registry polling
- Real-time error awareness

### IDE Integration (Module 26)
- Selection/opened file context
- Implicit intent inference

### Swarm/Team Mode (Module 30)
- Team identity establishment
- Mailbox message delivery

---

## Symbol Reference

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:

- `normalizeAttachmentForAPI` (Ui8) - Main dispatcher
- `wrapWithSystemReminderTags` (b5) - XML wrapper
- `wrapInXmlTag` (af) - XML string creator
- `createUserMessage` (p1) - Message factory
- `createToolCallMessage` (nr6) - Tool call display
- `createToolResultMessage` (ir6) - Tool result display
- `assembleAllAttachments` (_uY) - Orchestrator
- `timedAttachmentProducer` (Hz) - Telemetry wrapper
- `planModeReminderDispatcher` (Wzz) - Plan mode router
- `fullPlanReminder` (Nzz) - Full plan instructions
- `sparsePlanReminder` (Ezz) - Sparse plan reminder
- `subAgentPlanReminder` (yzz) - Subagent plan reminder
- `ultraplanCompleteReminder` (Zzz) - Ultraplan complete
- `autoModeReminder` (Lzz) - Auto mode dispatcher
- `isTeamMode` (E7) - Team mode check

---

## Source Locations

| File | Lines | Content |
|------|-------|---------|
| `chunks.174.mjs` | 1-469 | Core normalization functions (normalizeAttachmentForAPI) |
| `chunks.173.mjs` | 1378-1412 | User message construction (createUserMessage) |
| `chunks.173.mjs` | 2490-2740 | XML wrappers, plan/auto mode reminders |
| `chunks.147.mjs` | 1-1262 | Attachment producer functions |
| `chunks.90.mjs` | 730 | Regex patterns |

---

## Document Status

### Core Documentation

| Document | Status | Completeness |
|----------|--------|--------------|
| overview.md | Complete | Full architecture analysis |
| implementation_details.md | Complete | Core function analysis |
| reminder_types.md | Complete | All 57+ types documented |
| attachment_producers.md | Complete | All 40+ producers analyzed |
| integration_points.md | Complete | 10 integrations documented |
| ui_linkage.md | Complete | Full visibility analysis |
| edge_cases_and_failures.md | Complete | Error handling documented |
| performance_and_telemetry.md | Complete | Performance analysis |
| already_read_file_report.md | Complete | Specific type analysis |

### Per-Type Analysis

| Document | Status | Completeness |
|----------|--------|--------------|
| types_team_mode.md | Complete | Team/Swarm types |
| types_file_context.md | Complete | File/Directory types |
| types_ide_integration.md | Complete | IDE integration types |
| types_task_management.md | Complete | Todo/Task types |
| types_mode_control.md | Complete | Plan/Delegate mode types |
| types_skills_memory.md | Complete | Skills/Memory types |
| types_hooks.md | Complete | Hook types (including v2.1.76 additions) |
| types_status_budget.md | Complete | Status/Budget types (including v2.1.76 additions) |
| types_silent.md | Complete | Silent types |
| quick_reference.md | Complete | Quick lookup index |

---

**Last Updated**: 2026-03-16
**Version**: Claude Code 2.1.76
**Status**: Complete - All v2.1.76 types documented with source code verification
