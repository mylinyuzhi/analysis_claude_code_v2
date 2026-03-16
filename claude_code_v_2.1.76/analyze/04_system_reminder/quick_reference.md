# System Reminder Quick Reference

> **Module**: System Reminders - Quick Reference Index
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.174.mjs:3-469` (normalization), `chunks.147.mjs:3-550` (producers), `chunks.173.mjs:2490-2740` (formatting)

---

## Table of Contents

- [All Reminder Types Summary](#all-reminder-types-summary)
- [By Category](#by-category)
- [Trigger Conditions Quick Lookup](#trigger-conditions-quick-lookup)
- [Configuration Constants](#configuration-constants)
- [Source File Quick Reference](#source-file-quick-reference)

---

## All Reminder Types Summary

### Visible Types (Produce API Messages)

| Type | Purpose | Wrapping | Doc |
|------|---------|----------|-----|
| `teammate_mailbox` | Team messages | `b5` | [types_team_mode.md](./types_team_mode.md) |
| `team_context` | Team identity | Inline XML | [types_team_mode.md](./types_team_mode.md) |
| `directory` | Directory listing | `b5` (tool pair) | [types_file_context.md](./types_file_context.md) |
| `file` | File contents | `b5` (tool pair) | [types_file_context.md](./types_file_context.md) |
| `edited_text_file` | File modification | `b5` | [types_file_context.md](./types_file_context.md) |
| `compact_file_reference` | Compacted file ref | `b5` | [types_file_context.md](./types_file_context.md) |
| `pdf_reference` | Large PDF ref | `b5` | [types_file_context.md](./types_file_context.md) |
| `selected_lines_in_ide` | IDE selection | `b5` | [types_ide_integration.md](./types_ide_integration.md) |
| `opened_file_in_ide` | File opened | `b5` | [types_ide_integration.md](./types_ide_integration.md) |
| `diagnostics` | LSP errors | `b5` | [types_ide_integration.md](./types_ide_integration.md) |
| `todo` | Todo list state | `b5` | [types_task_management.md](./types_task_management.md) |
| `todo_reminder` | Use TodoWrite reminder | `b5` | [types_task_management.md](./types_task_management.md) |
| `task_reminder` | Use Task tools reminder | `b5` | [types_task_management.md](./types_task_management.md) |
| `task_status` | Background task status | `af` | [types_task_management.md](./types_task_management.md) |
| `task_progress` | Task progress message | `af` | [types_task_management.md](./types_task_management.md) |
| `plan_mode` | Plan mode instructions | `b5` | [types_mode_control.md](./types_mode_control.md) |
| `plan_mode_reentry` | Re-enter plan mode | `b5` | [types_mode_control.md](./types_mode_control.md) |
| `plan_mode_exit` | Exit plan mode | `b5` | [types_mode_control.md](./types_mode_control.md) |
| `plan_file_reference` | Plan file content | `b5` | [types_mode_control.md](./types_mode_control.md) |
| `delegate_mode` | Delegate mode | `b5` | [types_mode_control.md](./types_mode_control.md) |
| `delegate_mode_exit` | Exit delegate mode | `b5` | [types_mode_control.md](./types_mode_control.md) |
| `invoked_skills` | Active skills | `b5` | [types_skills_memory.md](./types_skills_memory.md) |
| `skill_listing` | Available skills | `b5` | [types_skills_memory.md](./types_skills_memory.md) |
| `nested_memory` | CLAUDE.md content | `b5` | [types_skills_memory.md](./types_skills_memory.md) |
| `mcp_resource` | MCP resource content | `b5` | [types_skills_memory.md](./types_skills_memory.md) |
| `ultramemory` | Persistent memory | `b5` | [types_skills_memory.md](./types_skills_memory.md) |
| `agent_mention` | Agent @-mention | `b5` | [types_skills_memory.md](./types_skills_memory.md) |
| `async_hook_response` | Hook response | `b5` | [types_hooks.md](./types_hooks.md) |
| `hook_blocking_error` | Hook blocked | `af` | [types_hooks.md](./types_hooks.md) |
| `hook_success` | Hook success | `af` | [types_hooks.md](./types_hooks.md) |
| `hook_additional_context` | Hook context | `af` | [types_hooks.md](./types_hooks.md) |
| `hook_stopped_continuation` | Hook stopped | `af` | [types_hooks.md](./types_hooks.md) |
| `token_usage` | Token count | `af` | [types_status_budget.md](./types_status_budget.md) |
| `budget_usd` | USD budget | `af` | [types_status_budget.md](./types_status_budget.md) |
| `output_token_usage` | Output token tracking | `af` | [types_status_budget.md](./types_status_budget.md) |
| `date_change` | Date change notification | `b5` | [types_status_budget.md](./types_status_budget.md) |
| `ultrathink_effort` | Reasoning effort level | `b5` | [types_status_budget.md](./types_status_budget.md) |
| `deferred_tools_delta` | Deferred tools changes | `b5` | [types_status_budget.md](./types_status_budget.md) |
| `mcp_instructions_delta` | MCP instruction changes | `b5` | [types_status_budget.md](./types_status_budget.md) |
| `compaction_reminder` | Auto-compact notice | `b5` | [types_status_budget.md](./types_status_budget.md) |
| `critical_system_reminder` | Critical alert | `b5` | [types_status_budget.md](./types_status_budget.md) |
| `queued_command` | Queued message | `b5` | [types_status_budget.md](./types_status_budget.md) |
| `output_style` | Output style | `b5` | [types_status_budget.md](./types_status_budget.md) |
| `verify_plan_reminder` | Verify plan | `b5` | [types_status_budget.md](./types_status_budget.md) |

### Silent Types (No API Messages)

| Type | Purpose | Doc |
|------|---------|-----|
| `already_read_file` | Unchanged file | [types_silent.md](./types_silent.md) |
| `command_permissions` | Permission state | [types_silent.md](./types_silent.md) |
| `edited_image_file` | Image modification | [types_silent.md](./types_silent.md) |
| `hook_cancelled` | Hook cancelled | [types_silent.md](./types_silent.md) |
| `hook_error_during_execution` | Hook error | [types_silent.md](./types_silent.md) |
| `hook_non_blocking_error` | Non-blocking error | [types_silent.md](./types_silent.md) |
| `hook_system_message` | System message | [types_silent.md](./types_silent.md) |
| `hook_permission_decision` | Permission decision | [types_silent.md](./types_silent.md) |
| `structured_output` | Structured output | [types_silent.md](./types_silent.md) |
| `autocheckpointing` | Checkpoint state | [types_silent.md](./types_silent.md) |
| `background_task_status` | Task status (internal) | [types_silent.md](./types_silent.md) |
| `context_efficiency` | Context efficiency metrics | [types_silent.md](./types_silent.md) |
| `dynamic_skill` | Skill discovery | [types_skills_memory.md](./types_skills_memory.md) |

---

## By Category

### Team Mode (Pre-Switch)
- `teammate_mailbox` - Team messages
- `team_context` - Team identity

📄 [types_team_mode.md](./types_team_mode.md)

### File & Directory
- `directory` - Directory listing
- `file` - File contents
- `edited_text_file` - File modification
- `compact_file_reference` - Compacted file
- `pdf_reference` - Large PDF
- `already_read_file` - Unchanged file (silent)

📄 [types_file_context.md](./types_file_context.md)

### IDE Integration
- `selected_lines_in_ide` - User selection
- `opened_file_in_ide` - File opened
- `diagnostics` - LSP errors

📄 [types_ide_integration.md](./types_ide_integration.md)

### Todo & Task
- `todo` - Todo list state
- `todo_reminder` - TodoWrite reminder
- `task_reminder` - Task tools reminder
- `task_status` - Background task status
- `task_progress` - Task progress

📄 [types_task_management.md](./types_task_management.md)

### Mode Control
- `plan_mode` - Plan mode (full/sparse/subagent)
- `plan_mode_reentry` - Re-entering plan mode
- `plan_mode_exit` - Exiting plan mode
- `plan_file_reference` - Existing plan file content
- `delegate_mode` - Delegate mode
- `delegate_mode_exit` - Exiting delegate mode

📄 [types_mode_control.md](./types_mode_control.md)

### Skills & Memory
- `invoked_skills` - Active skills
- `skill_listing` - Available skills
- `nested_memory` - CLAUDE.md files
- `mcp_resource` - MCP resources
- `ultramemory` - Persistent memory
- `dynamic_skill` - Skill discovery (silent)
- `agent_mention` - Agent @-mention

📄 [types_skills_memory.md](./types_skills_memory.md)

### Hooks
- `async_hook_response` - Hook response
- `hook_blocking_error` - Blocking error
- `hook_success` - Success message
- `hook_additional_context` - Additional context
- `hook_stopped_continuation` - Stopped
- `hook_cancelled` (silent)
- `hook_error_during_execution` (silent)
- `hook_non_blocking_error` (silent)
- `hook_system_message` (silent)
- `hook_permission_decision` (silent)
- `structured_output` (silent)

📄 [types_hooks.md](./types_hooks.md)

### Status & Budget
- `token_usage` - Token count
- `budget_usd` - USD budget
- `compaction_reminder` - Auto-compact
- `critical_system_reminder` - Critical alert
- `queued_command` - Queued message
- `output_style` - Output style
- `verify_plan_reminder` - Verify plan

📄 [types_status_budget.md](./types_status_budget.md)

---

## Trigger Conditions Quick Lookup

### User-Triggered

| Trigger | Types Produced |
|---------|----------------|
| @-mention directory | `directory` |
| @-mention file | `file` or `already_read_file` or `pdf_reference` |
| @-mention MCP resource | `mcp_resource` |
| @-mention agent | `agent_mention` |
| Open file in IDE | `opened_file_in_ide`, `nested_memory` |
| Select code in IDE | `selected_lines_in_ide` |
| Send message while busy | `queued_command` |
| Invoke skill | `invoked_skills` |

### System-Triggered

| Trigger | Types Produced |
|---------|----------------|
| Enter plan mode | `plan_mode` (full/sparse) |
| Re-enter plan mode | `plan_mode_reentry`, `plan_mode` |
| Exit plan mode | `plan_mode_exit` |
| Enter delegate mode | `delegate_mode` |
| Exit delegate mode | `delegate_mode_exit` |
| Context compaction | `plan_file_reference`, `todo`, `invoked_skills` |
| File modified externally | `edited_text_file` or `edited_image_file` |
| LSP diagnostics | `diagnostics` |
| Todo file changed | `todo` |
| Turn thresholds met | `todo_reminder`, `task_reminder` |
| Background task update | `task_status`, `task_progress` |
| Hook completes | Various hook types |
| Session start | `team_context`, `skill_listing`, `compaction_reminder` |
| Token threshold | `ultramemory` |

### Configuration-Triggered

| Setting | Types Produced |
|---------|----------------|
| Team mode active | `teammate_mailbox`, `team_context` |
| Output style set | `output_style` |
| Budget configured | `budget_usd` |
| Token usage enabled | `token_usage` |
| Critical reminder set | `critical_system_reminder` |

---

## Configuration Constants

### Frequency Throttling

| Constant | Value | Purpose |
|----------|-------|---------|
| `TURNS_SINCE_WRITE` | 10 | Turns since TodoWrite/TaskUpdate |
| `TURNS_BETWEEN_REMINDERS` | 10 | Turns between todo/task reminders |
| `TURNS_BETWEEN_ATTACHMENTS` | 5 | Turns between plan mode attachments |
| `FULL_REMINDER_EVERY_N_ATTACHMENTS` | 5 | Send full plan mode every Nth |
| `TOKEN_COOLDOWN` | 5000 | Tokens before ultramemory refresh |
| `TASK_PROGRESS_TURNS_THRESHOLD` | 3 | Turns before task progress delivery |

### Size Limits

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_FILE_LINES` | 2000 | Lines per file attachment |
| `MAX_PDF_PAGES` | 20 | Pages per PDF read request |
| Selection truncation | 2000 chars | Max selection content |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | Disable all attachments |
| `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` | Enable token usage |

---

## Source File Quick Reference

### Core Functions

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| `normalizeAttachmentForAPI` | Ui8 | chunks.174.mjs:3-469 | Main dispatcher |
| `wrapWithSystemReminderTags` | b5 | chunks.173.mjs:2496-2523 | Message array wrapper |
| `wrapInXmlTag` | af | chunks.173.mjs:2490-2494 | Inline XML wrapper |
| `createUserMessage` | p1 | chunks.173.mjs:1378-1412 | Message factory |
| `assembleAllAttachments` | _uY | chunks.147.mjs:3-18 | Producer orchestrator |
| `timedAttachmentProducer` | Hz | chunks.147.mjs:20-46 | Telemetry wrapper |
| `attachmentGenerator` | Vf6 | chunks.147.mjs:822-829 | Async generator |
| `planModeReminderDispatcher` | Wzz | chunks.173.mjs:2525-2530 | Plan mode router |

### Producer Functions - User-Dependent (Group 1)

| Function | Obfuscated | Location | Produces |
|----------|------------|----------|----------|
| `extractAtMentionedFiles` | RuY | chunks.147.mjs:407-448 | `directory`, `file` |
| `extractMcpResources` | SuY | chunks.147.mjs:464-495 | `mcp_resource` |
| `extractAgentMentions` | huY | chunks.147.mjs:450-462 | `agent_mention` |

### Producer Functions - Always-Computed (Group 2)

| Function | Obfuscated | Location | Produces |
|----------|------------|----------|----------|
| `getChangedFilesAttachment` | CuY | chunks.147.mjs:497-539 | `edited_text_file` |
| `getNestedMemoryAttachments` | IuY | chunks.147.mjs:541-550 | `nested_memory` |
| `getDynamicSkillAttachments` | BuY | chunks.147.mjs:650-690 | `dynamic_skill` |
| `getSkillListingAttachment` | guY | chunks.147.mjs:700-721 | `skill_listing` |
| `getPlanModeAttachment` | DuY | chunks.147.mjs:136-168 | `plan_mode` |
| `getPlanModeExitAttachment` | XuY | chunks.147.mjs:170-181 | `plan_mode_exit` |
| `getAutoModeAttachment` | ZuY | chunks.147.mjs:214-227 | `auto_mode` |
| `getAutoModeExitAttachment` | GuY | chunks.147.mjs:229-235 | `auto_mode_exit` |
| `getDateChangeAttachment` | fuY | chunks.147.mjs:237-246 | `date_change` |
| `getUltrathinkEffortAttachment` | TuY | chunks.147.mjs:248-254 | `ultrathink_effort` |
| `getDeferredToolsDeltaAttachment` | xE1 | chunks.147.mjs:256-267 | `deferred_tools_delta` |
| `getMcpInstructionsDeltaAttachment` | uE1 | chunks.147.mjs:269-282 | `mcp_instructions_delta` |
| `getCriticalSystemReminder` | vuY | chunks.147.mjs:284-291 | `critical_system_reminder` |
| `getTodoReminderAttachment` | ruY | chunks.147.mjs:972-990 | `todo_reminder` |
| `getQueuedCommandsAttachment` | OuY | chunks.147.mjs:48-68 | `queued_command` |

### Producer Functions - Main-Agent-Only (Group 3)

| Function | Obfuscated | Location | Produces |
|----------|------------|----------|----------|
| `getIdeSelectionAttachment` | kuY | chunks.147.mjs:306-320 | `selected_lines_in_ide` |
| `getIdeOpenedFileAttachment` | LuY | chunks.147.mjs:397-405 | `opened_file_in_ide` |
| `getOutputStyleAttachment` | NuY | chunks.147.mjs:293-300 | `output_style` |
| `getDiagnosticsAttachment` | cuY | chunks.147.mjs:789-798 | `diagnostics` |
| `getLspDiagnosticsAttachment` | luY | chunks.147.mjs:800-820 | `diagnostics` |

### File Ranges

| File | Lines | Content |
|------|-------|---------|
| chunks.174.mjs | 3-469 | Core normalization (normalizeAttachmentForAPI) |
| chunks.173.mjs | 1378-1412 | User message construction (createUserMessage) |
| chunks.173.mjs | 2490-2740 | XML wrappers, plan/auto mode reminders |
| chunks.147.mjs | 3-18 | Orchestrator (_uY - assembleAllAttachments) |
| chunks.147.mjs | 20-46 | Telemetry wrapper (Hz - timedAttachmentProducer) |
| chunks.147.mjs | 48-291 | Mode control and status producers |
| chunks.147.mjs | 306-550 | IDE, file, and memory producers |
| chunks.147.mjs | 650-820 | Skill and diagnostic producers |
| chunks.147.mjs | 822-990 | Attachment generator and todo producers |

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [overview.md](./overview.md) - Architecture overview
- [implementation_details.md](./implementation_details.md) - Core implementation
- [attachment_producers.md](./attachment_producers.md) - Producer deep dive
- [integration_points.md](./integration_points.md) - Cross-module integration
- [ui_linkage.md](./ui_linkage.md) - UI visibility
- [edge_cases_and_failures.md](./edge_cases_and_failures.md) - Error handling
- [performance_and_telemetry.md](./performance_and_telemetry.md) - Performance

### Per-Type Analysis Documents

- [types_team_mode.md](./types_team_mode.md) - Team/Swarm types
- [types_file_context.md](./types_file_context.md) - File/Directory types
- [types_ide_integration.md](./types_ide_integration.md) - IDE types
- [types_task_management.md](./types_task_management.md) - Todo/Task types
- [types_mode_control.md](./types_mode_control.md) - Mode control types
- [types_skills_memory.md](./types_skills_memory.md) - Skills/Memory types
- [types_hooks.md](./types_hooks.md) - Hook types
- [types_status_budget.md](./types_status_budget.md) - Status/Budget types
- [types_silent.md](./types_silent.md) - Silent types