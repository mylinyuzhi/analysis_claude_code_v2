# System Reminder Quick Reference

> **Module**: System Reminders - Quick Reference Index
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.173.mjs:698-1131`, `chunks.142.mjs:1948-2930`

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
| `teammate_mailbox` | Team messages | `_9` | [types_team_mode.md](./types_team_mode.md) |
| `team_context` | Team identity | Inline XML | [types_team_mode.md](./types_team_mode.md) |
| `directory` | Directory listing | `_9` (tool pair) | [types_file_context.md](./types_file_context.md) |
| `file` | File contents | `_9` (tool pair) | [types_file_context.md](./types_file_context.md) |
| `edited_text_file` | File modification | `_9` | [types_file_context.md](./types_file_context.md) |
| `compact_file_reference` | Compacted file ref | `_9` | [types_file_context.md](./types_file_context.md) |
| `pdf_reference` | Large PDF ref | `_9` | [types_file_context.md](./types_file_context.md) |
| `selected_lines_in_ide` | IDE selection | `_9` | [types_ide_integration.md](./types_ide_integration.md) |
| `opened_file_in_ide` | File opened | `_9` | [types_ide_integration.md](./types_ide_integration.md) |
| `diagnostics` | LSP errors | `_9` | [types_ide_integration.md](./types_ide_integration.md) |
| `todo` | Todo list state | `_9` | [types_task_management.md](./types_task_management.md) |
| `todo_reminder` | Use TodoWrite reminder | `_9` | [types_task_management.md](./types_task_management.md) |
| `task_reminder` | Use Task tools reminder | `_9` | [types_task_management.md](./types_task_management.md) |
| `task_status` | Background task status | `tI` | [types_task_management.md](./types_task_management.md) |
| `task_progress` | Task progress message | `tI` | [types_task_management.md](./types_task_management.md) |
| `plan_mode` | Plan mode instructions | `_9` | [types_mode_control.md](./types_mode_control.md) |
| `plan_mode_reentry` | Re-enter plan mode | `_9` | [types_mode_control.md](./types_mode_control.md) |
| `plan_mode_exit` | Exit plan mode | `_9` | [types_mode_control.md](./types_mode_control.md) |
| `plan_file_reference` | Plan file content | `_9` | [types_mode_control.md](./types_mode_control.md) |
| `delegate_mode` | Delegate mode | `_9` | [types_mode_control.md](./types_mode_control.md) |
| `delegate_mode_exit` | Exit delegate mode | `_9` | [types_mode_control.md](./types_mode_control.md) |
| `invoked_skills` | Active skills | `_9` | [types_skills_memory.md](./types_skills_memory.md) |
| `skill_listing` | Available skills | `_9` | [types_skills_memory.md](./types_skills_memory.md) |
| `nested_memory` | CLAUDE.md content | `_9` | [types_skills_memory.md](./types_skills_memory.md) |
| `mcp_resource` | MCP resource content | `_9` | [types_skills_memory.md](./types_skills_memory.md) |
| `ultramemory` | Persistent memory | `_9` | [types_skills_memory.md](./types_skills_memory.md) |
| `agent_mention` | Agent @-mention | `_9` | [types_skills_memory.md](./types_skills_memory.md) |
| `async_hook_response` | Hook response | `_9` | [types_hooks.md](./types_hooks.md) |
| `hook_blocking_error` | Hook blocked | `tI` | [types_hooks.md](./types_hooks.md) |
| `hook_success` | Hook success | `tI` | [types_hooks.md](./types_hooks.md) |
| `hook_additional_context` | Hook context | `tI` | [types_hooks.md](./types_hooks.md) |
| `hook_stopped_continuation` | Hook stopped | `tI` | [types_hooks.md](./types_hooks.md) |
| `token_usage` | Token count | `tI` | [types_status_budget.md](./types_status_budget.md) |
| `budget_usd` | USD budget | `tI` | [types_status_budget.md](./types_status_budget.md) |
| `compaction_reminder` | Auto-compact notice | `_9` | [types_status_budget.md](./types_status_budget.md) |
| `critical_system_reminder` | Critical alert | `_9` | [types_status_budget.md](./types_status_budget.md) |
| `queued_command` | Queued message | `_9` | [types_status_budget.md](./types_status_budget.md) |
| `output_style` | Output style | `_9` | [types_status_budget.md](./types_status_budget.md) |
| `verify_plan_reminder` | Verify plan | `_9` | [types_status_budget.md](./types_status_budget.md) |

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
| `normalizeAttachmentForAPI` | K2z | chunks.173.mjs:698-1131 | Main dispatcher |
| `wrapWithSystemReminderTags` | _9 | chunks.173.mjs:496-523 | Message array wrapper |
| `wrapInXmlTag` | tI | chunks.173.mjs:490-494 | Inline XML wrapper |
| `createUserMessage` | c6 | chunks.172.mjs:2876-2912 | Message factory |
| `assembleAttachments` | phY | chunks.142.mjs:1948-1965 | Producer orchestrator |
| `planModeReminderDispatcher` | azz | chunks.173.mjs:525-529 | Plan mode router |

### Producer Functions

| Function | Obfuscated | Location | Produces |
|----------|------------|----------|----------|
| `extractAtMentionedFiles` | KIY | chunks.142.mjs:2199-2236 | `directory`, `file` |
| `extractMcpResources` | zIY | chunks.142.mjs:2252-2283 | `mcp_resource` |
| `getAgentMentionAttachment` | YIY | chunks.142.mjs:2238-2250 | `agent_mention` |
| `getChangedFilesAttachment` | wIY | chunks.142.mjs:2285-2335 | `edited_text_file` |
| `getNestedMemoryAttachments` | HIY | chunks.142.mjs:2337-2348 | `nested_memory` |
| `getSkillListingAttachment` | OIY | chunks.142.mjs:2381-2395 | `skill_listing` |
| `getPlanModeAttachment` | ihY | chunks.142.mjs:2034-2058 | `plan_mode` |
| `getPlanModeExitAttachment` | nhY | chunks.142.mjs:2060-2071 | `plan_mode_exit` |
| `getPlanFileReferenceAttachment` | jZ6 | chunks.146.mjs:2699-2708 | `plan_file_reference` |
| `getDelegateModeAttachment` | rhY | chunks.142.mjs:2073-2083 | `delegate_mode` |
| `getIdeSelectionAttachment` | ehY | chunks.142.mjs:2114-2127 | `selected_lines_in_ide` |
| `getIdeOpenedFileAttachment` | qIY | chunks.142.mjs:2189-2197 | `opened_file_in_ide` |
| `getDiagnosticsAttachment` | PIY | chunks.142.mjs:2463-2471 | `diagnostics` |
| `getLspDiagnosticsAttachment` | WIY | chunks.142.mjs:2473-2492 | `diagnostics` |
| `getTodoReminderAttachment` | fIY | chunks.142.mjs:2645-2661 | `todo_reminder` |
| `getTaskReminderAttachment` | NIY | chunks.142.mjs:2684-2701 | `task_reminder` |
| `getUnifiedTasksAttachment` | vIY | chunks.142.mjs:2719-2756 | `task_status`, `task_progress` |
| `getAsyncHookResponsesAttachment` | EIY | chunks.142.mjs:2758-2789 | `async_hook_response` |
| `getTeamContextAttachment` | LIY | chunks.142.mjs:2796-2813 | `team_context` |
| `getTokenUsageAttachment` | RIY | chunks.142.mjs:2815-2825 | `token_usage` |
| `getBudgetUsdAttachment` | yIY | chunks.142.mjs:2827-2835 | `budget_usd` |
| `getQueuedCommandsAttachment` | dhY | chunks.142.mjs:1993-2001 | `queued_command` |

### File Ranges

| File | Lines | Content |
|------|-------|---------|
| chunks.173.mjs | 490-523 | XML wrapper functions |
| chunks.173.mjs | 525-696 | Plan mode variants |
| chunks.173.mjs | 698-1131 | Main normalization switch |
| chunks.142.mjs | 1948-1965 | Orchestrator (phY) |
| chunks.142.mjs | 1967-1991 | Telemetry wrapper (gw) |
| chunks.142.mjs | 1993-2090 | Mode control producers |
| chunks.142.mjs | 2114-2236 | IDE and file producers |
| chunks.142.mjs | 2252-2395 | Memory and skill producers |
| chunks.142.mjs | 2442-2492 | Helper and diagnostic producers |
| chunks.142.mjs | 2503-2613 | File loading functions |
| chunks.142.mjs | 2624-2756 | Todo and task producers |
| chunks.142.mjs | 2758-2851 | Hook and status producers |
| chunks.142.mjs | 2918-2930 | Constants definition |

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