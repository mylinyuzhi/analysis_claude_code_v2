# System Reminder Module - Complete Documentation

> **Module**: System Reminders (Attachments-to-API Normalization)
> **Version**: Claude Code 2.1.38
> **Source**: `chunks.173.mjs:490-1131`, `chunks.142.mjs:1948-2835`, `chunks.148.mjs:2414-2428`

---

## Overview

System reminders are **injected messages that guide the LLM's behavior without being visible to the end user in the chat UI**. They appear as meta-flagged user messages in the conversation stream, carrying instructions, context, and state notifications that the model needs to respond appropriately.

This module provides comprehensive documentation of the system reminder architecture, implementation details, and integration points.

---

## Documentation Index

| Document | Purpose | Key Topics |
|----------|---------|------------|
| [**overview.md**](./overview.md) | Architecture overview | Three-layer pipeline, core functions, design decisions |
| [**implementation_details.md**](./implementation_details.md) | Code-level implementation | Core functions, plan mode variants, XML processing |
| [**reminder_types.md**](./reminder_types.md) | Complete type catalog | All 57+ attachment types with format and triggers |
| [**attachment_producers.md**](./attachment_producers.md) | Producer deep dive | 40+ producer functions, orchestration, execution strategy |
| [**integration_points.md**](./integration_points.md) | Cross-module integration | Agent loop, plan mode, hooks, MCP, LSP, IDE |
| [**ui_linkage.md**](./ui_linkage.md) | UI visibility | isMeta flag, message filtering, API preparation |
| [**edge_cases_and_failures.md**](./edge_cases_and_failures.md) | Error handling | Three-layer fault isolation, timeout behavior, recovery |
| [**performance_and_telemetry.md**](./performance_and_telemetry.md) | Performance analysis | Parallel execution, telemetry, optimization |
| [**already_read_file_report.md**](./already_read_file_report.md) | Specific type analysis | already_read_file implementation details |

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
│                    (phY - assembleAttachments)                       │
│                      chunks.142.mjs:1948-1965                        │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               ↓
┌──────────────┴───────────────────────────────────────────────────────┐
│                   LAYER 2: ATTACHMENT NORMALIZATION                   │
│                  (K2z - normalizeAttachmentForAPI)                    │
│                     chunks.173.mjs:698-1131                          │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               ↓
┌──────────────┴───────────────────────────────────────────────────────┐
│                    LAYER 3: MESSAGE STREAM INJECTION                  │
│                   (bG1 - buildContextMessages)                       │
│                      chunks.148.mjs:2414-2428                        │
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
- `plan_mode` - Full plan mode instructions
- `plan_mode_reentry` - Re-entering plan mode
- `plan_mode_exit` - Exited plan mode
- `delegate_mode` - Team delegate mode
- `delegate_mode_exit` - Exited delegate mode

### Skills & Memory
- `invoked_skills` - Skill invocation memory
- `skill_listing` - Available skills
- `nested_memory` - Memory content
- `mcp_resource` - MCP resource content
- `ultramemory` - Ultramemory content

### Hooks & Async Responses
- `async_hook_response` - Hook response
- `hook_blocking_error` - Hook blocking
- `hook_success` - Hook success
- `hook_additional_context` - Hook context
- `hook_stopped_continuation` - Hook stopped

### Status & Budget Notifications
- `token_usage` - Token count
- `budget_usd` - USD budget
- `compaction_reminder` - Auto-compact notification
- `critical_system_reminder` - Critical alerts
- `queued_command` - Queued user message

### Silent / No-Op Types
- `already_read_file`, `command_permissions`, `edited_image_file`
- `hook_cancelled`, `hook_error_during_execution`, `hook_non_blocking_error`
- `hook_system_message`, `hook_permission_decision`, `structured_output`
- `autocheckpointing`, `background_task_status`

---

## Key Functions

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `normalizeAttachmentForAPI` | K2z | chunks.173.mjs:698-1131 | Main dispatcher converting attachments to messages |
| `wrapWithSystemReminderTags` | _9 | chunks.173.mjs:496-523 | Wraps messages in XML tags |
| `wrapInXmlTag` | tI | chunks.173.mjs:490-494 | Creates XML wrapper string |
| `createUserMessage` | c6 | chunks.172.mjs:2876-2912 | Message factory with isMeta flag |
| `assembleAttachments` | phY | chunks.142.mjs:1948-1965 | Main orchestrator for attachment production |
| `timedAttachmentProducer` | gw | chunks.142.mjs:1967-1991 | Telemetry wrapper for producers |
| `planModeReminderDispatcher` | azz | chunks.173.mjs:525-529 | Routes to plan mode variant |

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

### Hooks System (Module 21)
- Async message passing via registry
- Hook response delivery as attachments

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

- `normalizeAttachmentForAPI` (K2z) - Main dispatcher
- `wrapWithSystemReminderTags` (_9) - XML wrapper
- `wrapInXmlTag` (tI) - XML string creator
- `createUserMessage` (c6) - Message factory
- `assembleAttachments` (phY) - Orchestrator
- `timedAttachmentProducer` (gw) - Telemetry wrapper
- `planModeReminderDispatcher` (azz) - Plan mode router
- `isTeamMode` (l8) - Team mode check
- `createToolCallMessage` (pd1) - Tool call display
- `createToolResultMessage` (Ud1) - Tool result display

---

## Source Locations

| File | Lines | Content |
|------|-------|---------|
| `chunks.173.mjs` | 490-1131 | Core normalization functions |
| `chunks.142.mjs` | 1948-2835 | Attachment producer functions |
| `chunks.148.mjs` | 2414-2428 | Message injection functions |
| `chunks.172.mjs` | 2876-2912 | User message construction |
| `chunks.90.mjs` | 730 | Regex patterns |

---

## Document Status

| Document | Status | Completeness |
|----------|--------|--------------|
| overview.md | ✅ Complete | Full architecture analysis |
| implementation_details.md | ✅ Complete | Core function analysis |
| reminder_types.md | ✅ Complete | All 57+ types documented |
| attachment_producers.md | ✅ Complete | All 40+ producers analyzed |
| integration_points.md | ✅ Complete | 10 integrations documented |
| ui_linkage.md | ✅ Complete | Full visibility analysis |
| edge_cases_and_failures.md | ✅ Complete | Error handling documented |
| performance_and_telemetry.md | ✅ Complete | Performance analysis |
| already_read_file_report.md | ✅ Complete | Specific type analysis |

---

**Last Updated**: 2026-02-27
**Version**: Claude Code 2.1.38