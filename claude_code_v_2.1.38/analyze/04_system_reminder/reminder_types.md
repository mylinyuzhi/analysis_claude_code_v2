# System Reminder Types - Complete Catalog

> Module: System Reminders - All reminder types in K2z switch
> Source: `chunks.173.mjs:698-1131` (normalizeAttachmentForAPI)
> Version: Claude Code 2.1.38

---

## Table of Contents

- [Pre-Switch Types (Team Mode)](#pre-switch-types-team-mode)
- [File & Directory Context](#file--directory-context)
- [Todo & Task Management](#todo--task-management)
- [Skills & Memory](#skills--memory)
- [Mode Control (Plan / Delegate)](#mode-control-plan--delegate)
- [Hooks & Async Responses](#hooks--async-responses)
- [Status & Budget Notifications](#status--budget-notifications)
- [IDE Integration](#ide-integration)
- [Miscellaneous Active Types](#miscellaneous-active-types)
- [Silent / No-Op Types](#silent--no-op-types)
- [Related Symbols](#related-symbols)

---

## How to Read This Catalog

Each entry follows this format:

| Field | Description |
|-------|-------------|
| **Type** | The `attachment.type` string value |
| **Purpose** | What this reminder tells the model |
| **Triggered when** | The condition or event that produces this attachment |
| **Wrapping** | Whether `_9` (message-level XML) or `tI` (inline XML) is used |
| **Content format** | Brief description of the output structure |

---

## Pre-Switch Types (Team Mode)

These types are checked **before** the main switch statement, and only when `l8()` (`isTeamMode`) returns true.

### teammate_mailbox

| Field | Value |
|-------|-------|
| **Purpose** | Delivers messages from other teammates in the swarm to the current agent |
| **Triggered when** | The agent is in team/swarm mode and has unread messages in its mailbox |
| **Wrapping** | None (no `_9` or `tI`) -- the mailbox formatter handles its own formatting |
| **Content format** | Formatted teammate messages via `Uzz().formatTeammateMessages(messages)`. Returns a single `c6` user message with `isMeta: true`. |

**Key detail:** This is one of the few types that creates a message without any `<system-reminder>` XML tag wrapping. The mailbox formatter (`Uzz`) provides its own structured output.

### team_context

| Field | Value |
|-------|-------|
| **Purpose** | Provides team coordination context: the agent's identity, team name, resource paths, and instructions for team communication |
| **Triggered when** | The agent is in team/swarm mode |
| **Wrapping** | Manual `<system-reminder>` tags embedded directly in the content string |
| **Content format** | Structured markdown with sections: Team Coordination heading, agent name, team resources (config path, task list path), team leader reference, communication instructions with JSON example |

**Content structure:**
```
<system-reminder>
# Team Coordination
You are a teammate in team "{teamName}".
**Your Identity:** Name: {agentName}
**Team Resources:** Team config: {teamConfigPath}, Task list: {taskListPath}
**Team Leader:** The team lead's name is "team-lead"...
**IMPORTANT:** Always refer to teammates by their NAME...
</system-reminder>
```

---

## File & Directory Context

### directory

| Field | Value |
|-------|-------|
| **Purpose** | Shows the model the contents of a directory listing, formatted as if a Bash `ls` command was executed |
| **Triggered when** | A directory path is attached to the conversation (e.g., user mentions a directory) |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Two messages: (1) a simulated tool call message showing `ls {path}` was called, (2) a simulated tool result with stdout containing the directory listing. Uses `pd1` + `Ud1` to create the tool call/result pair. |

**Key detail:** This type mimics a tool use interaction, making the directory content appear as if the model itself ran the command. This helps the model understand the context without confusion about who requested the listing.

### file

| Field | Value |
|-------|-------|
| **Purpose** | Provides the contents of a file that was read or attached to the conversation |
| **Triggered when** | A file is at-mentioned or otherwise attached by the user |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Sub-switch on content type: **image** -> tool call + image result; **text** -> tool call + text result + optional truncation notice; **notebook** -> tool call + notebook result; **pdf** -> tool call + PDF result. All formatted as simulated FileRead tool calls. |

**Truncation handling:** For text files, if `A.truncated` is true, an additional `c6` message is appended: `"Note: The file {filename} was too large and has been truncated to the first {MAX_LINES} lines."` The model is told not to mention this to the user.

### edited_text_file

| Field | Value |
|-------|-------|
| **Purpose** | Notifies the model that a file was modified externally (by the user or a linter), showing the relevant diff snippet |
| **Triggered when** | A file change is detected that was not caused by the model's own tool use |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Single message: `"Note: {filename} was modified, either by the user or by a linter. This change was intentional..."` followed by the diff snippet with line numbers. Explicitly instructs the model not to revert the change and not to tell the user about this notification. |

### compact_file_reference

| Field | Value |
|-------|-------|
| **Purpose** | Placeholder for a file that was read before compaction but is too large to re-include in the compacted context |
| **Triggered when** | Post-compaction, when a previously-read file exceeds size limits for re-injection |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"Note: {filename} was read before the last conversation was summarized, but the contents are too large to include. Use {FileReadTool} tool if you need to access it."` |

### pdf_reference

| Field | Value |
|-------|-------|
| **Purpose** | Notifies the model about a large PDF that must be read in page ranges |
| **Triggered when** | A PDF file is attached that exceeds the size limit for full inclusion |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"PDF file: {filename} ({pageCount} pages, {fileSize}). This PDF is too large to read all at once. You MUST use the {ReadTool} tool with the pages parameter..."` Includes explicit instructions about the 20-page-per-request limit. |

### edited_image_file

| Field | Value |
|-------|-------|
| **Purpose** | Placeholder for image file modifications |
| **Triggered when** | An image file is modified externally |
| **Wrapping** | N/A -- returns empty array |
| **Content format** | None. This is a **silent/no-op type**. |

### already_read_file

| Field | Value |
|-------|-------|
| **Purpose** | Marker for files that have already been read in this context |
| **Triggered when** | Internal tracking of previously-read files |
| **Wrapping** | N/A -- returns empty array |
| **Content format** | None. This is a **silent/no-op type**. |

---

## Todo & Task Management

### todo

| Field | Value |
|-------|-------|
| **Purpose** | Notifies the model about changes to its todo list, or that the list is empty |
| **Triggered when** | The todo list state changes (items added, removed, or status updated) |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Two variants: (1) If `itemCount === 0`: reminds the model the list is empty and suggests using `TodoWrite` if helpful. (2) If items exist: shows the serialized todo list content with `"Continue on with the tasks at hand."` Both include `"DO NOT mention this to the user."` |

### todo_reminder

| Field | Value |
|-------|-------|
| **Purpose** | Gentle nudge to use the TodoWrite tool when it has not been used recently |
| **Triggered when** | The TodoWrite tool has not been called for some number of turns and there may be active work |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Formatted numbered list of existing todo items: `"1. [status] content"`. Prefixed with a gentle reminder about using TodoWrite. Explicitly says `"NEVER mention this reminder to the user."` |

### task_reminder

| Field | Value |
|-------|-------|
| **Purpose** | Similar to todo_reminder but for the newer Task system (TaskCreate/TaskUpdate tools) |
| **Triggered when** | Task tools have not been used recently AND `jH()` (isTaskSystemEnabled) returns true |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Formatted list: `"#id. [status] subject"`. References `TaskCreate` (`Nh`) and `TaskUpdate` (`DR`) tool names. Returns empty array if task system is not enabled. |

---

## Skills & Memory

### invoked_skills

| Field | Value |
|-------|-------|
| **Purpose** | Provides the content of skills that were invoked in the current session, so the model continues to follow their guidelines |
| **Triggered when** | One or more skills have been invoked (e.g., via `/skill` command) |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Each skill rendered as: `"### Skill: {name}\nPath: {path}\n\n{content}"`, joined by `---` separators. Prefixed with `"The following skills were invoked in this session."` Returns empty if no skills. |

### skill_listing

| Field | Value |
|-------|-------|
| **Purpose** | Lists all available skills that can be used with the Skill tool |
| **Triggered when** | Skills are loaded and available in the session |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"The following skills are available for use with the Skill tool:\n\n{content}"`. Returns empty if no content. |

### dynamic_skill

| Field | Value |
|-------|-------|
| **Purpose** | Reserved for dynamically loaded skills |
| **Triggered when** | N/A |
| **Wrapping** | N/A -- always returns empty array |
| **Content format** | None. This type is recognized but always produces no output. |

### nested_memory

| Field | Value |
|-------|-------|
| **Purpose** | Injects the contents of a nested MEMORY.md or CLAUDE.md file |
| **Triggered when** | A nested memory file is found in the project hierarchy |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"Contents of {path}:\n\n{content}"` |

### ultramemory

| Field | Value |
|-------|-------|
| **Purpose** | Injects ultra-memory (extended persistent memory) content |
| **Triggered when** | Ultra-memory system has content to inject |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Raw content string passed directly, wrapped only in system-reminder tags |

---

## Mode Control (Plan / Delegate)

### plan_mode

| Field | Value |
|-------|-------|
| **Purpose** | Instructs the model that plan mode is active -- it must NOT make edits, only read and plan |
| **Triggered when** | The tool permission context mode is set to "plan" |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Dispatched via `azz()` to one of three variants: (1) **full** -- extensive 5-phase workflow instructions (Initial Understanding, Design, Review, Final Plan, Call PlanApprove); (2) **sparse** -- one-liner referencing earlier full instructions; (3) **sub-agent** -- minimal read-only instructions for sub-agents. See [overview.md](./overview.md#plan-mode-reminder-variants) for detailed analysis. |

**Sparse vs full decision:** Uses modular arithmetic: `(count + 1) % FULL_REMINDER_EVERY_N_ATTACHMENTS === 1` selects full, otherwise sparse. This saves tokens by not repeating the lengthy plan instructions every turn.

### plan_mode_reentry

| Field | Value |
|-------|-------|
| **Purpose** | Guides the model when returning to plan mode after having previously exited it |
| **Triggered when** | Plan mode is activated AND a plan file already exists from a previous planning session |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Markdown with "Re-entering Plan Mode" heading. Instructions to: read the existing plan, evaluate it against the current request, decide whether to start fresh or continue, and always edit the plan file before calling PlanApprove. |

### plan_mode_exit

| Field | Value |
|-------|-------|
| **Purpose** | Notifies the model that plan mode has been exited and it can now make edits and use tools |
| **Triggered when** | The tool permission mode transitions from "plan" to normal |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"## Exited Plan Mode\n\nYou have exited plan mode. You can now make edits, run tools, and take actions."` Optionally includes plan file path if a plan exists. |

### plan_file_reference

| Field | Value |
|-------|-------|
| **Purpose** | Provides the contents of an existing plan file so the model can continue working on it |
| **Triggered when** | A plan file exists from a previous planning session |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"A plan file exists from plan mode at: {planFilePath}\n\nPlan contents:\n\n{planContent}\n\nIf this plan is relevant..."` |

### verify_plan_reminder

| Field | Value |
|-------|-------|
| **Purpose** | Prompts the model to verify that all plan items were completed correctly |
| **Triggered when** | The model has completed implementing a plan |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"You have completed implementing the plan. Please call the \"\" tool directly (NOT the {subAgentTool} tool or an agent) to verify..."` |

### delegate_mode

| Field | Value |
|-------|-------|
| **Purpose** | Restricts the model to team coordination tools only (TeammateTool, TaskCreate, TaskGet, TaskUpdate, TaskList) |
| **Triggered when** | Tool permission mode is "delegate" AND team context exists AND team mode is active |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Markdown with "Delegate Mode" heading. Lists the 5 allowed tools, explicitly states all other tools are blocked, provides task list path, and instructs focus on coordination. Returns empty if not in team mode. |

### delegate_mode_exit

| Field | Value |
|-------|-------|
| **Purpose** | Notifies the model that delegate mode has ended and all tools are available again |
| **Triggered when** | The delegate mode exit flag is set |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"## Exited Delegate Mode\n\nYou have exited delegate mode. You can now use all tools..."` |

---

## Hooks & Async Responses

### hook_blocking_error

| Field | Value |
|-------|-------|
| **Purpose** | Notifies the model that a hook blocked an action with an error |
| **Triggered when** | A hook returns a blocking error during tool execution |
| **Wrapping** | `tI` (inline XML tags) |
| **Content format** | `"<system-reminder>{hookName} hook blocking error from command: \"{command}\": {blockingError}</system-reminder>"` |

### hook_success

| Field | Value |
|-------|-------|
| **Purpose** | Notifies the model of a successful hook execution (only for SessionStart and UserPromptSubmit events) |
| **Triggered when** | A hook succeeds AND its event is `SessionStart` or `UserPromptSubmit` AND content is non-empty |
| **Wrapping** | `tI` (inline XML tags) |
| **Content format** | `"<system-reminder>{hookName} hook success: {content}</system-reminder>"` Returns empty for other hook events or empty content. |

### hook_additional_context

| Field | Value |
|-------|-------|
| **Purpose** | Provides extra context from hook output to inform the model's behavior |
| **Triggered when** | A hook produces additional context strings |
| **Wrapping** | `tI` (inline XML tags) |
| **Content format** | `"<system-reminder>{hookName} hook additional context: {content joined by newlines}</system-reminder>"` Returns empty if content array is empty. |

### hook_stopped_continuation

| Field | Value |
|-------|-------|
| **Purpose** | Notifies the model that a hook stopped an auto-continuation |
| **Triggered when** | A hook prevents automatic continuation of the conversation |
| **Wrapping** | `tI` (inline XML tags) |
| **Content format** | `"<system-reminder>{hookName} hook stopped continuation: {message}</system-reminder>"` |

### async_hook_response

| Field | Value |
|-------|-------|
| **Purpose** | Delivers the results of asynchronous hook execution |
| **Triggered when** | An async hook completes and has results to report |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Constructs an array of `c6` messages: one for `systemMessage` if present, and one for `additionalContext` if present in `hookSpecificOutput`. Both marked `isMeta: true`. |

### hook_cancelled

| Field | Value |
|-------|-------|
| **Purpose** | Marker for hooks that were cancelled |
| **Triggered when** | A hook is cancelled during execution |
| **Wrapping** | N/A -- returns empty array |
| **Content format** | None. Silent/no-op type. |

### hook_error_during_execution

| Field | Value |
|-------|-------|
| **Purpose** | Marker for hooks that errored during execution |
| **Triggered when** | A hook throws during execution |
| **Wrapping** | N/A -- returns empty array |
| **Content format** | None. Silent/no-op type. |

### hook_non_blocking_error

| Field | Value |
|-------|-------|
| **Purpose** | Marker for non-blocking hook errors |
| **Triggered when** | A hook returns a non-blocking error |
| **Wrapping** | N/A -- returns empty array |
| **Content format** | None. Silent/no-op type. |

### hook_system_message

| Field | Value |
|-------|-------|
| **Purpose** | Marker for hook system messages |
| **Triggered when** | A hook produces a system message |
| **Wrapping** | N/A -- returns empty array |
| **Content format** | None. Silent/no-op type. |

### hook_permission_decision

| Field | Value |
|-------|-------|
| **Purpose** | Marker for hook permission decisions |
| **Triggered when** | A hook makes a permission decision |
| **Wrapping** | N/A -- returns empty array |
| **Content format** | None. Silent/no-op type. |

---

## Status & Budget Notifications

### task_status

| Field | Value |
|-------|-------|
| **Purpose** | Reports background task status changes (completed, failed, killed/stopped) |
| **Triggered when** | A background task changes status |
| **Wrapping** | `tI` (inline XML tags) |
| **Content format** | Two variants: (1) If status is "killed": `"Task \"{description}\" ({taskId}) was stopped by the user."` (2) Otherwise: Concatenated fields: `"Task {taskId} (type: {taskType}) (status: {status}) (description: {description})"` + optional delta summary + `"You can check its output using the TaskOutput tool."` |

**Key detail:** The "killed" status is renamed to "stopped" in the display text, softening the language for the model.

### task_progress

| Field | Value |
|-------|-------|
| **Purpose** | Reports incremental progress updates from background tasks |
| **Triggered when** | A background task emits a progress message |
| **Wrapping** | `tI` (inline XML tags) |
| **Content format** | Raw progress message wrapped in system-reminder tags |

### token_usage

| Field | Value |
|-------|-------|
| **Purpose** | Informs the model about current token consumption relative to limits |
| **Triggered when** | Token usage tracking is active and thresholds are relevant |
| **Wrapping** | `tI` (inline XML tags) |
| **Content format** | `"<system-reminder>Token usage: {used}/{total}; {remaining} remaining</system-reminder>"` |

### budget_usd

| Field | Value |
|-------|-------|
| **Purpose** | Informs the model about USD budget consumption |
| **Triggered when** | A max budget is configured via `maxBudgetUsd` option |
| **Wrapping** | `tI` (inline XML tags) |
| **Content format** | `"<system-reminder>USD budget: ${used}/${total}; ${remaining} remaining</system-reminder>"` |

### compaction_reminder

| Field | Value |
|-------|-------|
| **Purpose** | Reassures the model that auto-compaction is enabled and it does not need to rush |
| **Triggered when** | Auto-compact is enabled for the session |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"Auto-compact is enabled. When the context window is nearly full, older messages will be automatically summarized so you can continue working seamlessly. There is no need to stop or rush -- you have unlimited context through automatic compaction."` |

---

## IDE Integration

### selected_lines_in_ide

| Field | Value |
|-------|-------|
| **Purpose** | Provides the text that the user has selected/highlighted in their IDE editor |
| **Triggered when** | The user selects text in VS Code or another IDE with Claude Code integration |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"The user selected the lines {lineStart} to {lineEnd} from {filename}:\n{content}\n\nThis may or may not be related to the current task."` Content is truncated to 2000 characters with `"... (truncated)"` appended if longer. |

### opened_file_in_ide

| Field | Value |
|-------|-------|
| **Purpose** | Notifies the model that the user opened a file in their IDE |
| **Triggered when** | The user opens/switches to a file in VS Code or another integrated IDE |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"The user opened the file {filename} in the IDE. This may or may not be related to the current task."` |

### diagnostics

| Field | Value |
|-------|-------|
| **Purpose** | Reports new diagnostic issues (errors, warnings) detected by the build system or linters |
| **Triggered when** | New diagnostics are detected after a file change |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"<new-diagnostics>The following new diagnostic issues were detected:\n\n{formatted summary}</new-diagnostics>"` Uses `KI.formatDiagnosticsSummary()` to format the file-level diagnostic data. Returns empty if no files have diagnostics. |

**Key detail:** Uses `<new-diagnostics>` custom XML tags (not `<system-reminder>`) inside the content, which is then additionally wrapped by `_9` in `<system-reminder>` tags.

---

## Miscellaneous Active Types

### queued_command

| Field | Value |
|-------|-------|
| **Purpose** | Delivers a message that the user typed while the model was still working on a previous response |
| **Triggered when** | The user sends a new message before the model finishes its current turn |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Two variants: (1) If prompt is an array of content blocks: extracts text and images separately, creates `"The user sent a new message while you were working:\n{text}\n\nIMPORTANT: After completing your current task, you MUST address the user's message above."` (2) If prompt is a string: same format but simpler. Includes `IMPORTANT` emphasis to prevent the model from ignoring the queued input. |

### output_style

| Field | Value |
|-------|-------|
| **Purpose** | Reminds the model to follow a specific output style (e.g., concise, verbose) |
| **Triggered when** | An output style is active in the session configuration |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"{styleName} output style is active. Remember to follow the specific guidelines for this style."` Looks up the style from the `D51` style definitions map. Returns empty if style not found. |

### critical_system_reminder

| Field | Value |
|-------|-------|
| **Purpose** | Injects an experimental critical system reminder from the session options |
| **Triggered when** | `criticalSystemReminder_EXPERIMENTAL` is set in the session options |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Raw content string from the configuration, wrapped in system-reminder tags. This is an escape hatch for injecting arbitrary instructions. |

### mcp_resource

| Field | Value |
|-------|-------|
| **Purpose** | Provides the contents of an MCP (Model Context Protocol) resource |
| **Triggered when** | An MCP resource is fetched and attached to the conversation |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | Complex multi-block output: For text resources, creates three text blocks: `"Full contents of resource:"`, the actual text, and `"Do NOT read this resource again unless you think it may have changed."` For binary resources: `"[Binary content: {mimeType}]"`. Empty resources: `"<mcp-resource server=\"...\" uri=\"...\">(No content)</mcp-resource>"`. |

### agent_mention

| Field | Value |
|-------|-------|
| **Purpose** | Instructs the model to invoke a specific agent type that the user mentioned |
| **Triggered when** | The user uses an @agent mention in their input |
| **Wrapping** | `_9` (message-level XML tags) |
| **Content format** | `"The user has expressed a desire to invoke the agent \"{agentType}\". Please invoke the agent appropriately, passing in the required context to it."` |

### command_permissions

| Field | Value |
|-------|-------|
| **Purpose** | Marker for command permission state |
| **Triggered when** | Permission context changes |
| **Wrapping** | N/A -- returns empty array |
| **Content format** | None. Silent/no-op type. |

### structured_output

| Field | Value |
|-------|-------|
| **Purpose** | Marker for structured output mode |
| **Triggered when** | Structured output is configured |
| **Wrapping** | N/A -- returns empty array |
| **Content format** | None. Silent/no-op type. |

---

## Silent / No-Op Types

These types are recognized by the switch statement but always return an empty array `[]`. They exist either as placeholders for future functionality, or because the information they carry is handled elsewhere in the system (not as conversation messages).

### Grouped no-op case (lines 1118-1127):

| Type | Probable Purpose |
|------|-----------------|
| `already_read_file` | Tracking: file already in context, no need to re-inject |
| `command_permissions` | Tracking: permission state, handled by tool permission system |
| `edited_image_file` | Placeholder: image edits not yet surfaced to model |
| `hook_cancelled` | Hook lifecycle: cancellation tracked internally, not shown to model |
| `hook_error_during_execution` | Hook lifecycle: execution errors handled by hook system |
| `hook_non_blocking_error` | Hook lifecycle: non-critical errors logged but not shown |
| `hook_system_message` | Hook lifecycle: system messages handled separately |
| `structured_output` | Mode tracking: structured output constraints handled at prompt level |
| `hook_permission_decision` | Hook lifecycle: permission decisions tracked internally |

### Post-switch silent types (line 1129):

| Type | Probable Purpose |
|------|-----------------|
| `autocheckpointing` | Internal: checkpoint creation tracked separately |
| `background_task_status` | Internal: background task UI updates handled by UI layer |

### Always-empty active type:

| Type | Probable Purpose |
|------|-----------------|
| `dynamic_skill` | Reserved: dynamic skill loading not yet producing conversation output |

---

## Summary Table

| Type | Category | Wrapping | Output |
|------|----------|----------|--------|
| `teammate_mailbox` | Team | none | formatted messages |
| `team_context` | Team | manual XML | team instructions |
| `directory` | File | `_9` | simulated tool call/result |
| `file` | File | `_9` | simulated tool call/result |
| `edited_text_file` | File | `_9` | modification notice |
| `compact_file_reference` | File | `_9` | re-read suggestion |
| `pdf_reference` | File | `_9` | page-read instructions |
| `selected_lines_in_ide` | IDE | `_9` | selected text |
| `opened_file_in_ide` | IDE | `_9` | opened file notice |
| `todo` | Task | `_9` | todo list state |
| `todo_reminder` | Task | `_9` | gentle nudge |
| `task_reminder` | Task | `_9` | gentle nudge (task system) |
| `plan_file_reference` | Plan | `_9` | plan contents |
| `invoked_skills` | Skills | `_9` | skill content |
| `skill_listing` | Skills | `_9` | available skills |
| `nested_memory` | Memory | `_9` | memory file content |
| `ultramemory` | Memory | `_9` | ultra-memory content |
| `queued_command` | Misc | `_9` | queued user message |
| `output_style` | Misc | `_9` | style reminder |
| `diagnostics` | IDE | `_9` | diagnostic issues |
| `plan_mode` | Mode | `_9` | plan instructions (full/sparse/subagent) |
| `plan_mode_reentry` | Mode | `_9` | reentry guidance |
| `plan_mode_exit` | Mode | `_9` | mode exit notice |
| `delegate_mode` | Mode | `_9` | delegate instructions |
| `delegate_mode_exit` | Mode | `_9` | mode exit notice |
| `critical_system_reminder` | Misc | `_9` | arbitrary instructions |
| `mcp_resource` | Misc | `_9` | resource content |
| `agent_mention` | Misc | `_9` | agent invocation request |
| `compaction_reminder` | Status | `_9` | compaction reassurance |
| `verify_plan_reminder` | Plan | `_9` | verification prompt |
| `task_status` | Status | `tI` | task state change |
| `task_progress` | Status | `tI` | progress update |
| `token_usage` | Status | `tI` | token consumption |
| `budget_usd` | Status | `tI` | budget consumption |
| `hook_blocking_error` | Hook | `tI` | blocking error message |
| `hook_success` | Hook | `tI` | success message |
| `hook_additional_context` | Hook | `tI` | extra context |
| `hook_stopped_continuation` | Hook | `tI` | continuation stopped |
| `async_hook_response` | Hook | `_9` | async results |
| `dynamic_skill` | Skills | none | empty (always) |
| `already_read_file` | Silent | none | empty |
| `command_permissions` | Silent | none | empty |
| `edited_image_file` | Silent | none | empty |
| `hook_cancelled` | Silent | none | empty |
| `hook_error_during_execution` | Silent | none | empty |
| `hook_non_blocking_error` | Silent | none | empty |
| `hook_system_message` | Silent | none | empty |
| `structured_output` | Silent | none | empty |
| `hook_permission_decision` | Silent | none | empty |
| `autocheckpointing` | Silent | none | empty (post-switch) |
| `background_task_status` | Silent | none | empty (post-switch) |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions referenced in this document:
- `normalizeAttachmentForAPI` (K2z) - Main switch dispatcher, chunks.173.mjs:698-1131
- `wrapWithSystemReminderTags` (_9) - XML tag wrapper for message arrays, chunks.173.mjs:496-523
- `wrapInXmlTag` (tI) - XML tag wrapper for strings, chunks.173.mjs:490-494
- `createUserMessage` (c6) - User message factory, chunks.172.mjs:2876-2912
- `assembleAttachments` (phY) - Parallel content assembly, chunks.142.mjs:1948-1965
- `createToolCallMessage` (pd1) - Simulates tool call display, chunks.173.mjs:1152-1157
- `createToolResultMessage` (Ud1) - Simulates tool result display, chunks.173.mjs:1133-1150
- `planModeReminderDispatcher` (azz) - Plan mode variant router, chunks.173.mjs:525-529
- `isTeamMode` (l8) - Checks if running in swarm/team mode
- `isTaskSystemEnabled` (jH) - Checks if task system is active
- `formatDiagnosticsSummary` (KI.formatDiagnosticsSummary) - Diagnostic formatting utility
- `outputStyleDefinitions` (D51) - Output style configuration map
- `BashTool` (qq) - Bash tool object reference
- `FileReadTool` (i5) - File read tool object reference
- `TodoWriteTool` (cg) - Todo write tool name reference
- `TaskCreateTool` (Nh) - Task create tool name reference
- `TaskUpdateTool` (DR) - Task update tool name reference
