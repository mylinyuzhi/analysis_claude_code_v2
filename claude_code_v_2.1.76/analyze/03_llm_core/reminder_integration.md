# Reminder Integration (Claude Code 2.1.76)

> Complete analysis of the system reminder/attachment system: how contextual information is produced, normalized, and injected into the conversation.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `assembleAttachments` (phY) - Main orchestrator for attachment production
- `attachmentGenerator` (oP1) - Async generator that yields attachment messages
- `wrapWithSystemReminderTags` (_9) - Wraps content in `<system-reminder>` tags
- `createAttachmentMessage` (kq) - Creates the attachment message structure
- `timedAttachmentProducer` (gw) - Wraps producers with timing and error handling
- `buildQueuedCommandsAttachment` (dhY) - Builds queued commands attachment
- `countAssistantTurns` (chY) - Counts assistant turns for throttling

---

## Architecture Overview

The reminder system provides contextual information to the LLM through "attachments":

### Attachment Categories

**User-Dependent Producers (only if mentions present):**
- `@file mentions` ────► extractAtMentionedFiles
- `@mcp://` mentions ──► extractMcpResources
- `@agent mentions` ──► extractAgentMentions

**Always-Computed:**
- Changed files → getChangedFilesAttachment
- Nested memory → getNestedMemoryAttachments
- Dynamic skills → getDynamicSkillAttachments
- Plan mode → getPlanModeAttachment
- Todo reminders → getTodoReminderAttachment

**Main-Agent-Only:**
- IDE selection → getIdeSelectionAttachment
- IDE opened file → getIdeOpenedFileAttachment
- Diagnostics → getDiagnosticsAttachment
- LSP diagnostics → getLspDiagnosticsAttachment
- Token usage → getTokenUsageAttachment
- Budget USD → getBudgetUsdAttachment

**Team/Swarm Mode:**
- Teammate mailbox → getTeammateMailboxAttachment
- Team context → getTeamContextAttachment

---

## Core Algorithms

### assembleAttachments - Main orchestrator

**What it does:**
The `assembleAttachments` (phY) function coordinates the production of all attachment types. It runs multiple producers in parallel and aggregates their results.

**How it works:**

1. **Early Exit Check**: If `CLAUDE_CODE_DISABLE_ATTACHMENTS` is set, returns empty array immediately.

2. **Abort Controller Setup**: Creates a 1-second timeout abort controller to prevent hanging on slow producers.

3. **Producer Categories**: Organizes producers into three groups:
   - **User-dependent**: Only run if user input contains relevant mentions
   - **Always-computed**: Run on every turn
   - **Main-agent-only**: Only run when not in a subagent context

4. **Parallel Execution**: Uses `Promise.all()` to run all producers concurrently.

5. **Result Aggregation**: Flattens all producer results into a single array.

**Why this approach:**
- **Parallel execution**: All producers run concurrently, minimizing total latency.
- **Abort timeout**: The 1-second timeout prevents a slow producer from blocking the entire conversation.
- **Categorization**: User-dependent producers are skipped when not needed, saving computation.
- **Main-agent isolation**: Some producers (like IDE selection) are only relevant to the main agent, not subagents.

**Key insight:** The attachment system is designed for resilience. Each producer is wrapped in `timedAttachmentProducer` (gw) which catches errors and returns an empty array on failure. This ensures that a single failing producer doesn't break the entire attachment pipeline.

---

### timedAttachmentProducer - Error handling wrapper

**What it does:**
Wraps an attachment producer with timing, error handling, and optional sampling for telemetry.

**How it works:**

1. Records start time
2. Calls producer function
3. Calculates duration and size
4. Samples 5% of calls for telemetry
5. On error, catches exception and returns empty array (never breaks pipeline)

---

### attachmentGenerator - Async generator for message injection

**What it does:**
The `attachmentGenerator` (oP1) is an async generator that produces attachment messages for injection into the conversation stream.

**How it works:**

1. Produce all attachments via `assembleAttachments()`
2. Log telemetry for what was produced
3. Yield each attachment as a message

---

## Attachment Types

Each attachment is an object with at minimum a `type` field:

```typescript
type Attachment =
    | { type: "file", filename: string, content: FileContent }
    | { type: "at_mentioned_file", filename: string, content: FileContent }
    | { type: "already_read_file", filename: string, content: FileContent }
    | { type: "pdf_reference", filename: string, pageCount: number }
    | { type: "changed_files", files: ChangedFileInfo[] }
    | { type: "nested_memory", path: string, content: MemoryContent }
    | { type: "dynamic_skill", skill_name: string, prompt: string }
    | { type: "plan_mode", reminderType: "full" | "sparse", ... }
    | { type: "todo_reminder", content: TodoItem[], itemCount: number }
    | { type: "task_reminder", content: TaskItem[], itemCount: number }
    | { type: "diagnostics", files: DiagnosticInfo[] }
    | { type: "token_usage", inputTokens: number, outputTokens: number }
    | { type: "budget_usd", budget: number }
    | { type: "queued_command", prompt: string, source_uuid: string }
```

---

## Meta-Message Format

### wrapWithSystemReminderTags - Content wrapping

**What it does:**
Wraps content in `<system-reminder>` tags that signal to the LLM that this is contextual information.

**How it works:**

1. Maps over messages array
2. For string content: wraps directly
3. For array content: wraps each text block
4. Non-text blocks pass through unchanged

---

## Specific Attachment Producers

### Plan Mode Attachments

Plan mode has three reminder types based on conversation state:
- **full**: Comprehensive reminder shown periodically
- **sparse**: Minimal reminder to save tokens
- **reentry**: Shown when returning to plan mode

### Todo/Task Reminders

Produced based on thresholds:
- `TURNS_SINCE_WRITE`: How many turns since last todo write (default: 10)
- `TURNS_BETWEEN_REMINDERS`: How many turns between reminder shows (default: 10)

### Token Usage Attachment

Calculates and displays:
- Input tokens used
- Output tokens used
- Total tokens
- Context limit percentage

### Changed Files Attachment

Git status grouped by:
- Modified files (M)
- Added files (A)
- Deleted files (D)
- Untracked files (??)

---

## Injection Timing

Attachments are produced at specific points:

1. **After Tool Execution**: mainAgentLoop → oP1 called after tools complete
2. **At Session Start**: Initial context injection on first query
3. **On User Input with Mentions**: @file, @mcp://, @agent parsed and injected
4. **On Mode Transitions**: Plan mode enter/exit, delegate mode changes

---

## Constants and Configuration

```javascript
// Plan mode constants
const PLAN_MODE_CONSTANTS = {
    TURNS_BETWEEN_ATTACHMENTS: 5,
    FULL_REMINDER_EVERY_N_ATTACHMENTS: 5
};

// Todo reminder constants
const TODO_REMINDER_CONSTANTS = {
    TURNS_SINCE_WRITE: 10,
    TURNS_BETWEEN_REMINDERS: 10
};

// Maximum file lines for attachment
const MAX_FILE_LINES = 2000;
```

---

## Summary

The reminder integration system provides real-time contextual information to the LLM through:

1. **Parallel producers** that run concurrently to minimize latency
2. **Error-resilient design** where each producer is wrapped with error handling
3. **Conditional execution** where user-dependent and main-agent-only producers are skipped when not applicable
4. **XML tag formatting** using `<system-reminder>` to clearly mark contextual content
5. **Strategic timing** where attachments are injected after tool execution to include the latest state

The attachment system is a key differentiator for Claude Code, providing context that the LLM wouldn't otherwise have access to.
