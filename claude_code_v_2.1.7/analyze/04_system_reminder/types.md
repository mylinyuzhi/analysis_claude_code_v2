# System Reminder Types in Claude Code v2.1.7

## Overview

This document catalogs all system reminder (attachment) types in Claude Code v2.1.7, their trigger conditions, content format, and priority ordering.

**New types in v2.1.7 (compared to v2.0.59):**
- `invoked_skills` - Skills invoked in session
- `task_reminder` - Task reminder (currently disabled)
- `plan_mode_exit` - Notification when exiting plan mode
- `delegate_mode` - Delegate mode context
- `delegate_mode_exit` - Notification when exiting delegate mode
- `task_status` - Unified task status (replaces background_shell_status, async_agent_status)
- `task_progress` - Task progress updates
- `collab_notification` - Collaboration notifications
- `verify_plan_reminder` - Plan verification reminder
- **Enhanced:** `plan_mode` now includes `reminderType` ("full" or "sparse")

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Attachment Categories

System reminders are organized into three categories:

1. **User Prompt Attachments** - Triggered by user input (@mentions, etc.)
2. **Core Attachments** - Always checked, available to all agents
3. **Main Agent Attachments** - Only available to the primary agent (not sub-agents)

---

## User Prompt Attachments

These attachments are only generated when the user provides input with special syntax.

### 1. at_mentioned_files

**Generator Function**: `h27()` (chunks.131.mjs:3372-3409)

**Trigger**: User message contains `@filename` or `@"path/to/file"` syntax

**Content Format**:
```javascript
// File attachment
{
  type: "file",
  filename: "/absolute/path/to/file",
  content: {
    type: "text" | "image" | "notebook" | "pdf",
    file: {
      filePath: string,
      content: string,
      numLines: number,
      startLine: number,
      totalLines: number
    }
  },
  truncated?: boolean
}

// Directory attachment
{
  type: "directory",
  path: "/absolute/path/to/dir",
  content: "file1.txt\nfile2.js\nsubdir/"
}
```

**Special Features**:
- Supports line range syntax: `@file.txt#L10-20`
- Handles directories: Returns `ls` output
- Handles images: Returns compressed image data
- Caching: Returns `already_read_file` if file unchanged

### 2. mcp_resources

**Generator Function**: `u27()` (chunks.131.mjs:3425-3456)

**Trigger**: User message contains `@server:resource_uri` syntax

**Content Format**:
```javascript
{
  type: "mcp_resource",
  server: "server_name",
  uri: "resource://uri",
  name: "Resource Name",
  description: "Optional description",
  content: {
    contents: [
      { text: "resource content" } |
      { blob: Buffer, mimeType: "..." }
    ]
  }
}
```

### 3. agent_mentions

**Generator Function**: `g27()` (chunks.131.mjs:3411-3423)

**Trigger**: User message contains `@agent-<agentType>` syntax

**Content Format**:
```javascript
{
  type: "agent_mention",
  agentType: "search" | "edit" | "custom"
}
```

---

## Core Attachments

These attachments are checked on every turn for all agents.

### 4. changed_files

**Generator Function**: `m27()` (chunks.131.mjs:3458-3508)

**Trigger**: Any previously-read file has been modified on disk

**Content Formats**:

**Text File Change**:
```javascript
{
  type: "edited_text_file",
  filename: "/path/to/file",
  snippet: "diff output showing changes"
}
```

**Image File Change**:
```javascript
{
  type: "edited_image_file",
  filename: "/path/to/image.png",
  content: "base64_compressed_image_data"
}
```

**TODO File Change**:
```javascript
{
  type: "todo",
  content: [
    { content: "task", status: "pending" | "in_progress" | "completed", activeForm: "..." }
  ],
  itemCount: 3,
  context: "file-watch"
}
```

### 5. nested_memory

**Generator Function**: `d27()` (chunks.131.mjs:3510-3521)

**Trigger**: Read tool triggers nested memory discovery

**Content Format**:
```javascript
{
  type: "nested_memory",
  path: "/path/to/related/file",
  content: {
    type: "text",
    path: "/path/to/related/file",
    content: "file contents"
  }
}
```

### 6. plan_mode (Enhanced in v2.1.7)

**Generator Function**: `j27()` (chunks.131.mjs:3207-3231)

**Trigger**: Tool permission context mode is "plan"

**Content Format**:
```javascript
{
  type: "plan_mode",
  reminderType: "full" | "sparse",  // NEW in v2.1.7
  isSubAgent: boolean,
  planFilePath: "/path/to/.claude/plans/<agent-id>.md",
  planExists: boolean
}
```

**New in v2.1.7:**
- `reminderType`: "full" shows complete instructions, "sparse" shows abbreviated version
- Sparse reminders reduce token usage on subsequent plan mode turns

### 7. plan_mode_reentry

**Generator Function**: `j27()` (same as plan_mode)

**Trigger**: Re-entering plan mode after previously exiting

**Content Format**:
```javascript
{
  type: "plan_mode_reentry",
  planFilePath: "/path/to/.claude/plans/<agent-id>.md"
}
```

### 8. plan_mode_exit (NEW in v2.1.7)

**Generator Function**: `T27()` (chunks.131.mjs:3233-3244)

**Trigger**: Just exited plan mode

**Content Format**:
```javascript
{
  type: "plan_mode_exit",
  planFilePath: "/path/to/.claude/plans/<agent-id>.md",
  planExists: boolean
}
```

**System Message Format**:
```
## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions. The plan file is located at /path/to/plan.md if you need to reference it.
```

### 9. delegate_mode (NEW in v2.1.7)

**Generator Function**: `P27()` (chunks.131.mjs:3246-3256)

**Trigger**: Tool permission context mode is "delegate"

**Content Format**:
```javascript
{
  type: "delegate_mode",
  teamName: "team-name",
  taskListPath: "~/.claude/tasks/team-name/"
}
```

### 10. delegate_mode_exit (NEW in v2.1.7)

**Generator Function**: `S27()` (chunks.131.mjs:3258-3263)

**Trigger**: Just exited delegate mode

**Content Format**:
```javascript
{
  type: "delegate_mode_exit"
}
```

**System Message Format**:
```
## Exited Delegate Mode

You have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.
```

### 11. todo_reminders

**Generator Function**: `t27()` (chunks.132.mjs:117-133)

**Trigger**:
- Been 5+ assistant turns since last TodoWrite tool use
- Been 3+ assistant turns since last reminder

**Content Format**:
```javascript
{
  type: "todo_reminder",
  content: [
    { content: "task text", status: "pending", activeForm: "task text" }
  ],
  itemCount: 2
}
```

### 12. collab_notification (NEW in v2.1.7)

**Generator Function**: `B97()` (chunks.132.mjs:223-225)

**Trigger**: Collaboration messages available (currently returns empty)

**Content Format**:
```javascript
{
  type: "collab_notification",
  chats: [
    { handle: "teammate" | "self", unreadCount: number }
  ]
}
```

**System Message Format**:
```
You have N unread collab message(s) from: @teammate (X new), self (Y new). Use the CollabRead tool to read these messages.
```

### 13. critical_system_reminder

**Generator Function**: `x27()` (chunks.131.mjs:3265-3272)

**Trigger**: User has set `criticalSystemReminder_EXPERIMENTAL` in configuration

**Content Format**:
```javascript
{
  type: "critical_system_reminder",
  content: "User-defined critical instructions"
}
```

---

## Main Agent Only Attachments

These attachments are only available to the primary agent (not sub-agents).

### 14. ide_selection

**Generator Function**: `k27()` (chunks.131.mjs:3287-3300)

**Trigger**: User has selected text in IDE

**Content Format**:
```javascript
{
  type: "selected_lines_in_ide",
  ideName: "Cursor" | "VS Code" | "Zed",
  lineStart: 10,
  lineEnd: 25,
  filename: "/path/to/file",
  content: "selected text content"
}
```

### 15. ide_opened_file

**Generator Function**: `f27()` (chunks.131.mjs:3362-3370)

**Trigger**: User opened a file in IDE (without selection)

**Content Format**:
```javascript
{
  type: "opened_file_in_ide",
  filename: "/path/to/file"
}
```

### 16. output_style

**Generator Function**: `y27()` (chunks.131.mjs:3274-3281)

**Trigger**: User has set output style preference (non-default)

**Content Format**:
```javascript
{
  type: "output_style",
  style: "concise" | "detailed" | "technical" | etc.
}
```

### 17. queued_commands

**Generator Function**: `M27()` (chunks.131.mjs:3166-3174)

**Trigger**: User has queued commands

**Content Format**:
```javascript
{
  type: "queued_command",
  prompt: "command text" | [{ type: "text", text: "..." }],
  source_uuid: "uuid-of-source",
  imagePasteIds?: string[]
}
```

### 18. diagnostics

**Generator Function**: `o27()` (chunks.131.mjs:3583-3591)

**Trigger**: New diagnostics available from diagnostic system

**Content Format**:
```javascript
{
  type: "diagnostics",
  files: [
    {
      filePath: "/path/to/file",
      diagnostics: [
        { message: "error", severity: "error", line: 10 }
      ]
    }
  ],
  isNew: true
}
```

### 19. lsp_diagnostics

**Generator Function**: `r27()` (chunks.131.mjs:3593-...)

**Trigger**: LSP server provides new diagnostics

**Content Format**: Same as `diagnostics` type

### 20. task_status (NEW in v2.1.7 - Unified)

**Generator Function**: `A97()` (chunks.132.mjs:151-188)

**Trigger**: Background tasks have status updates

**Content Format**:
```javascript
{
  type: "task_status",
  taskId: "task-uuid",
  taskType: "shell" | "agent" | "remote_session",
  status: "running" | "completed" | "failed",
  description: "Task description",
  deltaSummary?: "Summary of changes"
}
```

**System Message Format**:
```
Task task-uuid (type: shell) (status: completed) (description: npm test) Delta: Tests passed. You can check its output using the TaskOutput tool.
```

### 21. task_progress (NEW in v2.1.7)

**Generator Function**: `A97()` (same as task_status)

**Trigger**: Tasks have progress updates (throttled by turn count)

**Content Format**:
```javascript
{
  type: "task_progress",
  taskId: "task-uuid",
  taskType: "shell" | "agent" | "remote_session",
  message: "Progress message"
}
```

### 22. async_hook_responses

**Generator Function**: `Q97()` (chunks.132.mjs:190-221)

**Trigger**: Async hooks return responses

**Content Format**:
```javascript
{
  type: "async_hook_response",
  processId: "process-id",
  hookName: "HookName",
  hookEvent: "SessionStart" | "UserPromptSubmit" | etc.,
  toolName?: "ToolName",
  response: {
    systemMessage?: "message",
    hookSpecificOutput?: { additionalContext?: string }
  },
  stdout?: string,
  stderr?: string,
  exitCode?: number
}
```

### 23. memory

**Generator Function**: `mr2()` (referenced in orchestrator)

**Trigger**: Session memory available

**Content Format**:
```javascript
{
  type: "memory",
  memories: [
    {
      fullPath: "/path/to/.claude/session-memory/session-123.md",
      content: "preview of session summary",
      lastModified: Date,
      remainingLines: 50
    }
  ]
}
```

### 24. token_usage

**Generator Function**: `G97()` (chunks.132.mjs:227-237)

**Trigger**: Environment variable `CLAUDE_CODE_ENABLE_TOKEN_USAGE_ATTACHMENT` is set

**Content Format**:
```javascript
{
  type: "token_usage",
  used: 150000,
  total: 200000,
  remaining: 50000
}
```

### 25. budget_usd

**Generator Function**: `Z97()` (chunks.132.mjs:239-249)

**Trigger**: `maxBudgetUsd` is configured in options

**Content Format**:
```javascript
{
  type: "budget_usd",
  used: 5.23,
  total: 10.00,
  remaining: 4.77
}
```

### 26. verify_plan_reminder (NEW in v2.1.7)

**Generator Function**: `J97()` (chunks.132.mjs:274-276)

**Trigger**: Plan implementation completed (currently returns empty)

**Content Format**:
```javascript
{
  type: "verify_plan_reminder"
}
```

**System Message Format**:
```
You have completed implementing the plan. Please call the "" tool directly (NOT the Task tool or an agent) to verify that all plan items were completed correctly.
```

---

## Additional Types (from q$7 switch statement)

### 27. invoked_skills (NEW in v2.1.7)

**Location**: chunks.148.mjs:88-104

**Trigger**: Skills invoked in the session

**Content Format**:
```javascript
{
  type: "invoked_skills",
  skills: [
    {
      name: "skill-name",
      path: "/path/to/skill",
      content: "Skill instructions"
    }
  ]
}
```

**System Message Format**:
```
The following skills were invoked in this session. Continue to follow these guidelines:

### Skill: skill-name
Path: /path/to/skill

[Skill content]
```

### 28. compact_file_reference

**Location**: chunks.148.mjs:45-49

**Trigger**: File was read before compaction but too large to re-include

**Content Format**:
```javascript
{
  type: "compact_file_reference",
  filename: "/path/to/large/file"
}
```

### 29. plan_file_reference

**Location**: chunks.148.mjs:77-87

**Trigger**: Plan file exists from previous session

**Content Format**:
```javascript
{
  type: "plan_file_reference",
  planFilePath: "/path/to/.claude/plans/plan-id.md",
  planContent: "# Plan Content..."
}
```

### 30. ultramemory

**Location**: chunks.148.mjs:154-158

**Trigger**: Ultra memory content available

**Content Format**:
```javascript
{
  type: "ultramemory",
  content: "Ultra memory content string"
}
```

---

## Hook-Related Types

### 31. hook_blocking_error

**Content Format**:
```javascript
{
  type: "hook_blocking_error",
  hookName: "PreToolUse",
  blockingError: {
    command: "some-command",
    blockingError: "Error message"
  }
}
```

### 32. hook_success

**Content Format**:
```javascript
{
  type: "hook_success",
  hookEvent: "SessionStart" | "UserPromptSubmit",
  hookName: "HookName",
  content: "Success message"
}
```

### 33. hook_additional_context

**Content Format**:
```javascript
{
  type: "hook_additional_context",
  hookName: "HookName",
  content: ["context line 1", "context line 2"]
}
```

### 34. hook_stopped_continuation

**Content Format**:
```javascript
{
  type: "hook_stopped_continuation",
  hookName: "HookName",
  message: "Stop reason"
}
```

---

## Silent Attachment Types (No Message Output)

These types return empty arrays from the conversion function:

| Type | Purpose |
|------|---------|
| `already_read_file` | File unchanged since last read (cached) |
| `command_permissions` | Permission context (handled elsewhere) |
| `edited_image_file` | Image file change (visual diff not supported) |
| `hook_cancelled` | Hook was cancelled |
| `hook_error_during_execution` | Hook execution error |
| `hook_non_blocking_error` | Non-blocking hook error |
| `hook_system_message` | Hook system message (handled elsewhere) |
| `structured_output` | Structured output (handled differently) |
| `hook_permission_decision` | Hook permission decision |
| `task_reminder` | Task reminder (NEW, currently disabled) |
| `delegate_mode` | Delegate mode (returns [] in conversion) |

---

## Attachment Priority and Ordering

Attachments are processed and inserted in this order:

1. **User Prompt Attachments** (if user input exists)
   - at_mentioned_files
   - mcp_resources
   - agent_mentions

2. **Core Attachments** (all agents)
   - changed_files
   - nested_memory
   - ultra_claude_md
   - plan_mode / plan_mode_reentry
   - plan_mode_exit (NEW)
   - delegate_mode (NEW)
   - delegate_mode_exit (NEW)
   - todo_reminders
   - collab_notification (NEW)
   - critical_system_reminder

3. **Main Agent Attachments** (main agent only)
   - ide_selection
   - ide_opened_file
   - output_style
   - queued_commands
   - diagnostics
   - lsp_diagnostics
   - unified_tasks (NEW - task_status, task_progress)
   - async_hook_responses
   - memory
   - token_usage
   - budget_usd
   - verify_plan_reminder (NEW)

---

## Summary Table

| Type | Category | Trigger | New in v2.1.7 | Main Agent Only |
|------|----------|---------|---------------|-----------------|
| at_mentioned_files | User Prompt | @filename | No | No |
| mcp_resources | User Prompt | @server:uri | No | No |
| agent_mentions | User Prompt | @agent-type | No | No |
| changed_files | Core | File modified | No | No |
| nested_memory | Core | Related files | No | No |
| plan_mode | Core | Plan mode active | Enhanced | No |
| plan_mode_reentry | Core | Re-entering plan | No | No |
| plan_mode_exit | Core | Exiting plan mode | **Yes** | No |
| delegate_mode | Core | Delegate mode | **Yes** | No |
| delegate_mode_exit | Core | Exiting delegate | **Yes** | No |
| todo_reminders | Core | Turns threshold | No | No |
| collab_notification | Core | Collab messages | **Yes** | No |
| critical_system_reminder | Core | User config | No | No |
| ide_selection | Main Agent | IDE selection | No | Yes |
| ide_opened_file | Main Agent | IDE file open | No | Yes |
| output_style | Main Agent | Style set | No | Yes |
| queued_commands | Main Agent | Queued cmds | No | Yes |
| diagnostics | Main Agent | New diagnostics | No | Yes |
| lsp_diagnostics | Main Agent | LSP diagnostics | No | Yes |
| task_status | Main Agent | Task updates | **Yes** | Yes |
| task_progress | Main Agent | Task progress | **Yes** | Yes |
| async_hook_responses | Main Agent | Hook responses | No | Yes |
| memory | Main Agent | Session memory | No | Yes |
| token_usage | Main Agent | Env var set | No | Yes |
| budget_usd | Main Agent | Budget set | No | Yes |
| verify_plan_reminder | Main Agent | Plan complete | **Yes** | Yes |
| invoked_skills | Core | Skills invoked | **Yes** | No |

---

## Complete q$7 Switch Statement Conversion Logic

The `q$7` function (chunks.148.mjs:3-371) converts attachment objects to API messages. Here's the complete conversion logic for each type:

### Conversion Patterns

**Pattern 1: Tool Simulation (q5 + MuA + OuA)**
```javascript
// Simulates tool use and result
return q5([
  MuA(toolName, { ...params }),   // "Called the X tool..."
  OuA(tool, { ...result })        // "Result of calling..."
]);
```

**Pattern 2: Direct Meta Block (q5 + H0)**
```javascript
// Direct metadata message
return q5([H0({
  content: "message text",
  isMeta: true
})]);
```

**Pattern 3: Direct Wrap (H0 + Yh)**
```javascript
// Without q5 wrapping (already wrapped)
return [H0({
  content: Yh("message text"),  // Pre-wrapped with XML tag
  isMeta: true
})];
```

---

### Complete Type Conversion Reference

#### `directory` → Tool Simulation
```javascript
// Simulates: ls /path/to/dir
return q5([
  MuA("Bash", { command: `ls ${path}`, description: `Lists files in ${path}` }),
  OuA(BashTool, { stdout: content, stderr: "", interrupted: false })
]);
```

#### `edited_text_file` → Direct Meta
```javascript
return q5([H0({
  content: `Note: ${filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${snippet}`,
  isMeta: true
})]);
```

#### `file` → Tool Simulation (by subtype)
```javascript
// text/image/notebook/pdf all use same pattern:
return q5([
  MuA("Read", { file_path: filename }),
  OuA(ReadTool, content),
  // If truncated, add note:
  ...(truncated ? [H0({
    content: `Note: The file ${filename} was too large and has been truncated to the first ${MAX_LINES} lines. Don't tell the user about this truncation. Use Read to read more of the file if you need.`,
    isMeta: true
  })] : [])
]);
```

#### `compact_file_reference` → Direct Meta
```javascript
return q5([H0({
  content: `Note: ${filename} was read before the last conversation was summarized, but the contents are too large to include. Use Read tool if you need to access it.`,
  isMeta: true
})]);
```

#### `selected_lines_in_ide` → Direct Meta
```javascript
// Content truncated at 2000 chars
let truncatedContent = content.length > 2000 ? content.substring(0, 2000) + "\n... (truncated)" : content;
return q5([H0({
  content: `The user selected the lines ${lineStart} to ${lineEnd} from ${filename}:
${truncatedContent}

This may or may not be related to the current task.`,
  isMeta: true
})]);
```

#### `opened_file_in_ide` → Direct Meta
```javascript
return q5([H0({
  content: `The user opened the file ${filename} in the IDE. This may or may not be related to the current task.`,
  isMeta: true
})]);
```

#### `todo` → Direct Meta (conditional)
```javascript
if (itemCount === 0) {
  return q5([H0({
    content: `This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the TodoWrite tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.`,
    isMeta: true
  })]);
} else {
  return q5([H0({
    content: `Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${JSON.stringify(content)}. Continue on with the tasks at hand if applicable.`,
    isMeta: true
  })]);
}
```

#### `plan_file_reference` → Direct Meta
```javascript
return q5([H0({
  content: `A plan file exists from plan mode at: ${planFilePath}

Plan contents:

${planContent}

If this plan is relevant to the current work and not already complete, continue working on it.`,
  isMeta: true
})]);
```

#### `invoked_skills` → Direct Meta (NEW)
```javascript
if (skills.length === 0) return [];
let formatted = skills.map(s => `### Skill: ${s.name}\nPath: ${s.path}\n\n${s.content}`).join("\n\n---\n\n");
return q5([H0({
  content: `The following skills were invoked in this session. Continue to follow these guidelines:

${formatted}`,
  isMeta: true
})]);
```

#### `todo_reminder` → Direct Meta
```javascript
let list = content.map((t, i) => `${i+1}. [${t.status}] ${t.content}`).join("\n");
let msg = `The TodoWrite tool hasn't been used recently. If you're working on tasks that would benefit from tracking progress, consider using the TodoWrite tool to track progress. Also consider cleaning up the todo list if has become stale and no longer matches what you are working on. Only use it if it's relevant to the current work. This is just a gentle reminder - ignore if not applicable. Make sure that you NEVER mention this reminder to the user
`;
if (list.length > 0) msg += `\n\nHere are the existing contents of your todo list:\n\n[${list}]`;
return q5([H0({ content: msg, isMeta: true })]);
```

#### `nested_memory` → Direct Meta
```javascript
return q5([H0({
  content: `Contents of ${path}:

${content}`,
  isMeta: true
})]);
```

#### `queued_command` → Direct Meta (supports images)
```javascript
// If array with images:
if (Array.isArray(prompt)) {
  let text = prompt.filter(p => p.type === "text").map(p => p.text).join("\n");
  let images = prompt.filter(p => p.type === "image");
  let content = [
    { type: "text", text: `The user sent the following message:\n${text}\n\nPlease address this message and continue with your tasks.` },
    ...images
  ];
  return q5([H0({ content, isMeta: true })]);
}
// Simple string:
return q5([H0({
  content: `The user sent the following message:
${prompt}

Please address this message and continue with your tasks.`,
  isMeta: true
})]);
```

#### `ultramemory` → Direct Meta
```javascript
return q5([H0({ content: content, isMeta: true })]);
```

#### `output_style` → Direct Meta (conditional)
```javascript
let styleConfig = OUTPUT_STYLES[style];
if (!styleConfig) return [];
return q5([H0({
  content: `${styleConfig.name} output style is active. Remember to follow the specific guidelines for this style.`,
  isMeta: true
})]);
```

#### `diagnostics` → Direct Meta (XML tag)
```javascript
if (files.length === 0) return [];
let summary = DiagnosticsFormatter.formatDiagnosticsSummary(files);
return q5([H0({
  content: `<new-diagnostics>The following new diagnostic issues were detected:

${summary}</new-diagnostics>`,
  isMeta: true
})]);
```

#### `plan_mode` → Routed (z$7)
```javascript
// Routes to: $$7 (full), C$7 (sparse), or U$7 (subagent)
return z$7(attachment);
```

#### `plan_mode_reentry` → Direct Meta
```javascript
return q5([H0({
  content: `## Re-entering Plan Mode

You are returning to plan mode after having previously exited it. A plan file exists at ${planFilePath} from your previous planning session.

**Before proceeding with any new planning, you should:**
1. Read the existing plan file to understand what was previously planned
2. Evaluate the user's current request against that plan
3. Decide how to proceed:
   - **Different task**: If the user's request is for a different task—even if it's similar or related—start fresh by overwriting the existing plan
   - **Same task, continuing**: If this is explicitly a continuation or refinement of the exact same task, modify the existing plan while cleaning up outdated or irrelevant sections
4. Continue on with the plan process and most importantly you should always edit the plan file one way or the other before calling ExitPlanMode

Treat this as a fresh planning session. Do not assume the existing plan is relevant without evaluating it first.`,
  isMeta: true
})]);
```

#### `plan_mode_exit` → Direct Meta (NEW)
```javascript
return q5([H0({
  content: `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions.${planExists ? ` The plan file is located at ${planFilePath} if you need to reference it.` : ""}`,
  isMeta: true
})]);
```

#### `delegate_mode` → Empty (NEW)
```javascript
return [];  // Handled elsewhere
```

#### `delegate_mode_exit` → Direct Meta (NEW)
```javascript
return q5([H0({
  content: `## Exited Delegate Mode

You have exited delegate mode. You can now use all tools (Bash, Read, Write, Edit, etc.) and take actions directly. Continue with your tasks.`,
  isMeta: true
})]);
```

#### `critical_system_reminder` → Direct Meta
```javascript
return q5([H0({ content: content, isMeta: true })]);
```

#### `mcp_resource` → Direct Meta (complex)
```javascript
if (!content || !content.contents || content.contents.length === 0) {
  return q5([H0({
    content: `<mcp-resource server="${server}" uri="${uri}">(No content)</mcp-resource>`,
    isMeta: true
  })]);
}

let blocks = [];
for (let item of content.contents) {
  if ("text" in item && typeof item.text === "string") {
    blocks.push(
      { type: "text", text: "Full contents of resource:" },
      { type: "text", text: item.text },
      { type: "text", text: "Do NOT read this resource again unless you think it may have changed, since you already have the full contents." }
    );
  } else if ("blob" in item) {
    let mimeType = item.mimeType || "application/octet-stream";
    blocks.push({ type: "text", text: `[Binary content: ${mimeType}]` });
  }
}

if (blocks.length > 0) {
  return q5([H0({ content: blocks, isMeta: true })]);
}
return q5([H0({
  content: `<mcp-resource server="${server}" uri="${uri}">(No displayable content)</mcp-resource>`,
  isMeta: true
})]);
```

#### `agent_mention` → Direct Meta
```javascript
return q5([H0({
  content: `The user has expressed a desire to invoke the agent "${agentType}". Please invoke the agent appropriately, passing in the required context to it. `,
  isMeta: true
})]);
```

#### `task_status` → Direct Wrap (NEW)
```javascript
let parts = [
  `Task ${taskId}`,
  `(type: ${taskType})`,
  `(status: ${status})`,
  `(description: ${description})`
];
if (deltaSummary) parts.push(`Delta: ${deltaSummary}`);
parts.push("You can check its output using the TaskOutput tool.");
return [H0({
  content: Yh(parts.join(" ")),  // Pre-wrapped
  isMeta: true
})];
```

#### `task_progress` → Direct Wrap (NEW)
```javascript
return [H0({
  content: Yh(message),  // Pre-wrapped
  isMeta: true
})];
```

#### `async_hook_response` → Direct Meta (complex)
```javascript
let messages = [];
if (response.systemMessage) {
  messages.push(H0({ content: response.systemMessage, isMeta: true }));
}
if (response.hookSpecificOutput?.additionalContext) {
  messages.push(H0({ content: response.hookSpecificOutput.additionalContext, isMeta: true }));
}
return q5(messages);
```

#### `memory` → Direct Meta (XML tag)
```javascript
let formatted = memories.map(m => {
  let extra = m.remainingLines > 0 ? ` (${m.remainingLines} more lines in full file)` : "";
  let date = (m.lastModified instanceof Date ? m.lastModified : new Date(m.lastModified)).toLocaleDateString();
  return `## Previous Session (${date})
Full session notes: ${m.fullPath}${extra}

${m.content}`;
}).join("\n\n---\n\n");

return q5([H0({
  content: `<session-memory>
These session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.

${formatted}
</session-memory>`,
  isMeta: true
})]);
```

#### `token_usage` → Direct Wrap
```javascript
return [H0({
  content: Yh(`Token usage: ${used}/${total}; ${remaining} remaining`),
  isMeta: true
})];
```

#### `budget_usd` → Direct Wrap
```javascript
return [H0({
  content: Yh(`USD budget: $${used}/$${total}; $${remaining} remaining`),
  isMeta: true
})];
```

#### `hook_blocking_error` → Direct Wrap
```javascript
return [H0({
  content: Yh(`${hookName} hook blocking error from command: "${blockingError.command}": ${blockingError.blockingError}`),
  isMeta: true
})];
```

#### `hook_success` → Direct Wrap (conditional)
```javascript
if (hookEvent !== "SessionStart" && hookEvent !== "UserPromptSubmit") return [];
if (content === "") return [];
return [H0({
  content: Yh(`${hookName} hook success: ${content}`),
  isMeta: true
})];
```

#### `hook_additional_context` → Direct Wrap
```javascript
if (content.length === 0) return [];
return [H0({
  content: Yh(`${hookName} hook additional context: ${content.join("\n")}`),
  isMeta: true
})];
```

#### `hook_stopped_continuation` → Direct Wrap
```javascript
return [H0({
  content: Yh(`${hookName} hook stopped continuation: ${message}`),
  isMeta: true
})];
```

#### `collab_notification` → Direct Meta (NEW)
```javascript
let total = chats.reduce((sum, c) => sum + c.unreadCount, 0);
let formatted = chats.map(c => c.handle === "self" ? `self (${c.unreadCount} new)` : `@${c.handle} (${c.unreadCount} new)`).join(", ");
return q5([H0({
  content: `You have ${total} unread collab message${total !== 1 ? "s" : ""} from: ${formatted}. Use the CollabRead tool to read these messages.`,
  isMeta: true
})]);
```

#### `verify_plan_reminder` → Direct Meta (NEW)
```javascript
return q5([H0({
  content: `You have completed implementing the plan. Please call the "" tool directly (NOT the Task tool or an agent) to verify that all plan items were completed correctly.`,
  isMeta: true
})]);
```

---

## Helper Functions

### MuA - createToolUseMessage (chunks.148.mjs:392-397)
```javascript
function MuA(toolName, params) {
  return H0({
    content: `Called the ${toolName} tool with the following input: ${JSON.stringify(params)}`,
    isMeta: true
  });
}
```

### OuA - createToolResultMessage (chunks.148.mjs:373-390)
```javascript
function OuA(tool, result) {
  try {
    let block = tool.mapToolResultToToolResultBlockParam(result, "1");
    // If result contains images, return as content blocks
    if (Array.isArray(block.content) && block.content.some(b => b.type === "image")) {
      return H0({ content: block.content, isMeta: true });
    }
    return H0({
      content: `Result of calling the ${tool.name} tool: ${JSON.stringify(block.content)}`,
      isMeta: true
    });
  } catch {
    return H0({
      content: `Result of calling the ${tool.name} tool: Error`,
      isMeta: true
    });
  }
}
```

---

## Implementation Notes

1. **All attachments use `isMeta: true`**: System reminders are metadata messages
2. **Empty arrays are filtered**: Generators return `[]` when not applicable
3. **Errors are graceful**: Attachment failures don't break the conversation
4. **1 second timeout**: All attachment generation completes within 1 second
5. **Telemetry**: 5% sample rate for performance monitoring
6. **Parallel execution**: All attachments in a category generate concurrently
7. **Sparse reminders**: Plan mode uses abbreviated instructions to save tokens
8. **Unified tasks**: Shell/agent/remote tasks consolidated into single system
9. **Three conversion patterns**: Tool simulation (q5+MuA+OuA), Direct meta (q5+H0), Direct wrap (H0+Yh)
10. **Image support**: queued_command and mcp_resource support image content blocks
