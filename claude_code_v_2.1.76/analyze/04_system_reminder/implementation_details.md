# System Reminder Implementation Details

> **Module**: System Reminders - Core Implementation
> **Version**: Claude Code 2.1.76
> **Source**:
> - `chunks.174.mjs:1-469` (normalizeAttachmentForAPI)
> - `chunks.173.mjs:1378-1412` (createUserMessage)
> - `chunks.173.mjs:2490-2740` (XML wrappers, plan/auto mode reminders)
> - `chunks.147.mjs:1-1262` (attachment producers)

---

## Table of Contents

- [Overview](#overview)
- [Core Functions](#core-functions)
- [Plan Mode Reminder Variants](#plan-mode-reminder-variants)
- [XML Tag Processing](#xml-tag-processing)
- [Message Construction Patterns](#message-construction-patterns)
- [Regex Patterns](#regex-patterns)
- [Constants and Configuration](#constants-and-configuration)
- [Related Symbols](#related-symbols)

---

## Overview

The system reminder implementation consists of three main layers:

1. **Production Layer** (`chunks.142.mjs`) - Attachment producer functions that gather data
2. **Normalization Layer** (`chunks.174.mjs`) - Converts attachments to API messages
3. **Injection Layer** (`chunks.148.mjs`) - Inserts messages into conversation stream

This document focuses on the **normalization layer** implementation details, specifically the core functions that convert typed attachment objects into formatted messages.

---

## Core Functions

### wrapInXmlTag (af) - XML Tag Wrapper

**What it does:** Wraps content string in `<system-reminder>` XML tags.

**How it works:**
```javascript
// ============================================
// wrapInXmlTag - Creates the <system-reminder> XML wrapper string
// Location: chunks.173.mjs:2490-2494
// ============================================

// ORIGINAL (for source lookup):
function af(A) {
    return `<system-reminder>
${A}
</system-reminder>`
}

// READABLE (for understanding):
function wrapInXmlTag(content) {
    return `<system-reminder>\n${content}\n</system-reminder>`;
}

// Mapping: af→wrapInXmlTag, A→content
```

**Key insight:** This is a minimal, single-purpose function. The newline after opening tag and before closing tag ensures clean formatting when content spans multiple lines.

**When used:**
- Inline wrapping in status notifications (`task_status`, `token_usage`, `budget_usd`)
- Hook response messages (`hook_blocking_error`, `hook_success`)

---

### wrapWithSystemReminderTags (b5) - Message Array Wrapper

**What it does:** Wraps an array of messages, adding XML tags to all text content.

**How it works:**
```javascript
// ============================================
// wrapWithSystemReminderTags - Wraps text content in <system-reminder> XML tags
// Location: chunks.173.mjs:2496-2523
// ============================================

// ORIGINAL (for source lookup):
function b5(A) {
    return A.map((q) => {
        if (typeof q.message.content === "string") return {
            ...q, message: { ...q.message, content: af(q.message.content) }
        };
        else if (Array.isArray(q.message.content)) {
            let K = q.message.content.map((Y) => {
                if (Y.type === "text") return { ...Y, text: af(Y.text) };
                return Y
            });
            return { ...q, message: { ...q.message, content: K } }
        }
        return q
    })
}

// READABLE (for understanding):
function wrapWithSystemReminderTags(messages) {
    return messages.map((msg) => {
        // Case 1: String content - wrap directly
        if (typeof msg.message.content === "string") {
            return {
                ...msg,
                message: {
                    ...msg.message,
                    content: wrapInXmlTag(msg.message.content)
                }
            };
        }
        // Case 2: Array content (multi-block) - wrap only text blocks
        else if (Array.isArray(msg.message.content)) {
            let wrappedBlocks = msg.message.content.map((block) => {
                if (block.type === "text") {
                    return { ...block, text: wrapInXmlTag(block.text) };
                }
                // Image and other blocks pass through unchanged
                return block;
            });
            return { ...msg, message: { ...msg.message, content: wrappedBlocks } };
        }
        // Case 3: Other content types - pass through unchanged
        return msg;
    });
}

// Mapping: b5→wrapWithSystemReminderTags, A→messages, q→msg, af→wrapInXmlTag, K→wrappedBlocks, Y→block
```

**Why this approach:**
- **String handling**: Simple wrap for text-only messages
- **Array handling**: Preserves image blocks (type: "image") without corruption
- **Flexibility**: Works with both simple text and multi-modal content

**Key insight:** The function doesn't wrap image blocks because XML tags would corrupt binary/structured image data. This allows system reminders to include images alongside text instructions.

---

### normalizeAttachmentForAPI (Ui8) - Main Dispatcher

**What it does:** Central switch statement that converts attachment objects to message arrays.

**Architecture:**
```
normalizeAttachmentForAPI(attachment)
    │
    ├─> Pre-switch check (team mode types)
    │     └─> teammate_mailbox, team_context
    │
    ├─> Main switch (57+ cases)
    │     ├─> File types: directory, file, edited_text_file, compact_file_reference, pdf_reference
    │     ├─> IDE types: selected_lines_in_ide, opened_file_in_ide
    │     ├─> Todo/Task types: todo, todo_reminder, task_reminder, task_status, task_progress
    │     ├─> Memory types: nested_memory, relevant_memories, invoked_skills, skill_listing
    │     ├─> Mode types: plan_mode, plan_mode_reentry, plan_mode_exit, auto_mode, auto_mode_exit,
    │     │                 delegate_mode, delegate_mode_exit
    │     ├─> Hook types: async_hook_response, hook_blocking_error, hook_success, hook_additional_context
    │     ├─> New hook types (v2.1.76): post_compact, elicitation, elicitation_result,
    │     │                             instructions_loaded, config_change, worktree_create, worktree_remove
    │     ├─> Budget types: token_usage, budget_usd, output_token_usage
    │     ├─> New status types (v2.1.76): session_name, cron_job, date_change, ultrathink_effort
    │     ├─> MCP integration types (v2.1.76): deferred_tools_delta, mcp_instructions_delta
    │     ├─> Other types: mcp_resource, agent_mention, diagnostics, queued_command, ultramemory
    │     └─> Silent types: already_read_file, command_permissions, edited_image_file, context_efficiency, etc.
    │
    └─> Unknown type fallback → log warning, return []
```

**Source Location:** `chunks.174.mjs:3-469`

**Complete Implementation:**
```javascript
// ============================================
// normalizeAttachmentForAPI - Main dispatcher converting attachments to messages
// Location: chunks.174.mjs:3-469
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        if (A.type === "teammate_mailbox") return [p1({ content: Kzz().formatTeammateMessages(A.messages), isMeta: !0 })];
        if (A.type === "team_context") return [p1({ content: `<system-reminder>...team coordination...</system-reminder>`, isMeta: !0 })]
    }
    switch (A.type) {
        case "directory": return b5([nr6(J4.name, { command: `ls ${j4([A.path])}`, description: `Lists files in ${A.path}` }), ir6(J4, { stdout: A.content, stderr: "", interrupted: !1 })]);
        case "edited_text_file": return b5([p1({ content: `Note: ${A.filename} was modified...`, isMeta: !0 })]);
        case "file": {
            let K = A.content;
            switch (K.type) {
                case "image": return b5([nr6(L9.name, { file_path: A.filename }), ir6(L9, K)]);
                case "text": return b5([nr6(L9.name, { file_path: A.filename }), ir6(L9, K), ...A.truncated ? [p1({ content: `Note: The file ${A.filename} was too large...`, isMeta: !0 })] : []]);
                case "notebook": return b5([nr6(L9.name, { file_path: A.filename }), ir6(L9, K)]);
                case "pdf": return b5([nr6(L9.name, { file_path: A.filename }), ir6(L9, K)])
            }
            break
        }
        case "compact_file_reference": return b5([p1({ content: `Note: ${A.filename} was read before...`, isMeta: !0 })]);
        case "pdf_reference": return b5([p1({ content: `PDF file: ${A.filename} (${A.pageCount} pages, ${xq(A.fileSize)})...`, isMeta: !0 })]);
        case "selected_lines_in_ide": {
            let Y = A.content.length > 2000 ? A.content.substring(0, 2000) + `\n... (truncated)` : A.content;
            return b5([p1({ content: `The user selected the lines ${A.lineStart} to ${A.lineEnd} from ${A.filename}:\n${Y}\n\nThis may or may not be related to the current task.`, isMeta: !0 })])
        }
        case "opened_file_in_ide": return b5([p1({ content: `The user opened the file ${A.filename} in the IDE...`, isMeta: !0 })]);
        case "plan_file_reference": return b5([p1({ content: `A plan file exists from plan mode at: ${A.planFilePath}\n\nPlan contents:\n\n${A.planContent}\n\nIf this plan is relevant...`, isMeta: !0 })]);
        case "invoked_skills": {
            if (A.skills.length === 0) return [];
            let K = A.skills.map((Y) => `### Skill: ${Y.name}\nPath: ${Y.path}\n\n${Y.content}`).join(`\n\n---\n\n`);
            return b5([p1({ content: `The following skills were invoked in this session...\n\n${K}`, isMeta: !0 })])
        }
        case "todo_reminder": { /* ... produces todo reminder message ... */ }
        case "task_reminder": { if (!r$()) return []; /* ... produces task reminder message ... */ }
        case "nested_memory": return b5([p1({ content: `Contents of ${A.content.path}:\n\n${A.content.content}`, isMeta: !0 })]);
        case "relevant_memories": return b5(A.memories.map((K) => { /* ... memory with timestamp ... */ }));
        case "dynamic_skill": return [];
        case "skill_listing": { if (!A.content) return []; return b5([p1({ content: `The following skills are available...\n\n${A.content}`, isMeta: !0 })]) }
        case "queued_command": { /* ... handles queued prompts ... */ }
        case "ultramemory": return b5([p1({ content: A.content, isMeta: !0 })]);
        case "output_style": { let K = aY6[A.style]; if (!K) return []; return b5([p1({ content: `${K.name} output style is active...`, isMeta: !0 })]) }
        case "diagnostics": { if (A.files.length === 0) return []; let K = Gb.formatDiagnosticsSummary(A.files); return b5([p1({ content: `<new-diagnostics>...\n\n${K}</new-diagnostics>`, isMeta: !0 })]) }
        case "plan_mode": return Wzz(A);
        case "plan_mode_reentry": { /* ... plan re-entry message ... */ }
        case "plan_mode_exit": { /* ... plan exit message ... */ }
        case "auto_mode": return Lzz(A);
        case "auto_mode_exit": return b5([p1({ content: `## Exited Auto Mode\n\nYou have exited auto mode...`, isMeta: !0 })]);
        case "critical_system_reminder": return b5([p1({ content: A.content, isMeta: !0 })]);
        case "mcp_resource": { /* ... handles MCP resource content ... */ }
        case "agent_mention": return b5([p1({ content: `The user has expressed a desire to invoke the agent "${A.agentType}"...`, isMeta: !0 })]);
        case "task_status": { /* ... produces task status message ... */ }
        case "async_hook_response": { /* ... handles hook response ... */ }
        case "token_usage": return [p1({ content: af(`Token usage: ${A.used}/${A.total}; ${A.remaining} remaining`), isMeta: !0 })];
        case "budget_usd": return [p1({ content: af(`USD budget: $${A.used}/$${A.total}; $${A.remaining} remaining`), isMeta: !0 })];
        case "output_token_usage": { let K = A.budget !== null ? `${fq(A.turn)} / ${fq(A.budget)}` : fq(A.turn); return [p1({ content: af(`Output tokens — turn: ${K} · session: ${fq(A.session)}`), isMeta: !0 })] }
        case "hook_blocking_error": return [p1({ content: af(`${A.hookName} hook blocking error...`), isMeta: !0 })];
        case "hook_success": { if (A.hookEvent !== "SessionStart" && A.hookEvent !== "UserPromptSubmit") return []; if (A.content === "") return []; return [p1({ content: af(`${A.hookName} hook success: ${A.content}`), isMeta: !0 })] }
        case "hook_additional_context": { if (A.content.length === 0) return []; return [p1({ content: af(`${A.hookName} hook additional context: ${A.content.join(`\n`)}`), isMeta: !0 })] }
        case "hook_stopped_continuation": return [p1({ content: af(`${A.hookName} hook stopped continuation: ${A.message}`), isMeta: !0 })];
        case "compaction_reminder": return b5([p1({ content: "Auto-compact is enabled. When the context window is nearly full...", isMeta: !0 })]);
        case "context_efficiency": return [];
        case "date_change": return b5([p1({ content: `The date has changed. Today's date is now ${A.newDate}...`, isMeta: !0 })]);
        case "ultrathink_effort": return b5([p1({ content: `The user has requested reasoning effort level: ${A.level}...`, isMeta: !0 })]);
        case "deferred_tools_delta": { /* ... handles deferred tools changes ... */ }
        case "mcp_instructions_delta": { /* ... handles MCP instruction changes ... */ }
        case "verify_plan_reminder": { /* ... verify plan message ... */ }
        case "already_read_file":
        case "command_permissions":
        case "edited_image_file":
        case "hook_cancelled":
        case "hook_error_during_execution":
        case "hook_non_blocking_error":
        case "hook_system_message":
        case "structured_output":
        case "hook_permission_decision":
            return []
    }
    if (["autocheckpointing", "background_task_status", "todo", "task_progress"].includes(A.type)) return [];
    return jV("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${A.type}`)), []
}

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    // Pre-switch: Team mode types only when in team mode
    if (isTeamMode()) {
        if (attachment.type === "teammate_mailbox") {
            return [createUserMessage({
                content: getMailboxFormatter().formatTeammateMessages(attachment.messages),
                isMeta: true
            })];
        }
        if (attachment.type === "team_context") {
            return [createUserMessage({
                content: `<system-reminder>
# Team Coordination
You are a teammate in team "${attachment.teamName}".
**Your Identity:** Name: ${attachment.agentName}
**Team Resources:** Team config: ${attachment.teamConfigPath}, Task list: ${attachment.taskListPath}
...
</system-reminder>`,
                isMeta: true
            })];
        }
    }

    switch (attachment.type) {
        // File/Directory types (cases 1-6)
        case "directory": return wrapWithSystemReminderTags([/* synthetic ls tool call + result */]);
        case "edited_text_file": return wrapWithSystemReminderTags([/* modification notification */]);
        case "file": return wrapWithSystemReminderTags([/* synthetic Read tool call + result + truncation notice */]);
        case "compact_file_reference": return wrapWithSystemReminderTags([/* compacted file notice */]);
        case "pdf_reference": return wrapWithSystemReminderTags([/* large PDF instructions */]);
        case "selected_lines_in_ide": return wrapWithSystemReminderTags([/* IDE selection context */]);
        case "opened_file_in_ide": return wrapWithSystemReminderTags([/* file opened notification */]);

        // Memory types
        case "invoked_skills": return wrapWithSystemReminderTags([/* previously invoked skills content */]);
        case "nested_memory": return wrapWithSystemReminderTags([/* memory file content */]);
        case "relevant_memories": return wrapWithSystemReminderTags([/* memory files with timestamps */]);
        case "skill_listing": return wrapWithSystemReminderTags([/* available skills list */]);
        case "ultramemory": return wrapWithSystemReminderTags([/* ultramemory content */]);

        // Task management
        case "todo_reminder": return wrapWithSystemReminderTags([/* todo list status */]);
        case "task_reminder": return wrapWithSystemReminderTags([/* task list status */]);
        case "task_status": return [/* task status notification with inline XML */];

        // Mode control
        case "plan_mode": return planModeReminderDispatcher(attachment);
        case "plan_mode_reentry": return wrapWithSystemReminderTags([/* re-entry instructions */]);
        case "plan_mode_exit": return wrapWithSystemReminderTags([/* exit confirmation */]);
        case "auto_mode": return autoModeReminder(attachment);
        case "auto_mode_exit": return wrapWithSystemReminderTags([/* auto mode exit */]);

        // Hook responses
        case "async_hook_response": return wrapWithSystemReminderTags([/* hook response content */]);
        case "hook_blocking_error": return [/* blocking error with inline XML */];
        case "hook_success": return [/* success message with inline XML */];
        case "hook_additional_context": return [/* additional context with inline XML */];
        case "hook_stopped_continuation": return [/* stopped continuation with inline XML */];

        // Status types
        case "token_usage": return [createUserMessage({ content: wrapInXmlTag(`Token usage: ${attachment.used}/${attachment.total}...`), isMeta: true })];
        case "budget_usd": return [createUserMessage({ content: wrapInXmlTag(`USD budget: $${attachment.used}/$${attachment.total}...`), isMeta: true })];
        case "compaction_reminder": return wrapWithSystemReminderTags([/* auto-compact notification */]);
        case "date_change": return wrapWithSystemReminderTags([/* date change notification */]);
        case "ultrathink_effort": return wrapWithSystemReminderTags([/* reasoning effort level */]);

        // MCP integration
        case "mcp_resource": return wrapWithSystemReminderTags([/* MCP resource content */]);
        case "deferred_tools_delta": return wrapWithSystemReminderTags([/* deferred tools availability */]);
        case "mcp_instructions_delta": return wrapWithSystemReminderTags([/* MCP instruction changes */]);

        // Other types
        case "diagnostics": return wrapWithSystemReminderTags([/* LSP diagnostics */]);
        case "queued_command": return wrapWithSystemReminderTags([/* queued user message */]);
        case "agent_mention": return wrapWithSystemReminderTags([/* agent invocation request */]);
        case "critical_system_reminder": return wrapWithSystemReminderTags([/* critical alert */]);
        case "output_style": return wrapWithSystemReminderTags([/* output style notification */]);

        // Silent types - return empty array
        case "already_read_file":
        case "command_permissions":
        case "edited_image_file":
        case "hook_cancelled":
        case "hook_error_during_execution":
        case "hook_non_blocking_error":
        case "hook_system_message":
        case "structured_output":
        case "hook_permission_decision":
        case "context_efficiency":
        case "dynamic_skill":
            return [];
    }

    // Additional silent types
    if (["autocheckpointing", "background_task_status", "todo", "task_progress"].includes(attachment.type)) {
        return [];
    }

    // Unknown type - log warning and return empty array (forward compatibility)
    logWarning("normalizeAttachmentForAPI", Error(`Unknown attachment type: ${attachment.type}`));
    return [];
}

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment, E7→isTeamMode, p1→createUserMessage,
//          b5→wrapWithSystemReminderTags, af→wrapInXmlTag, nr6→createToolCallMessage,
//          ir6→createToolResultMessage, Wzz→planModeReminderDispatcher, Lzz→autoModeReminder,
//          Kzz→getMailboxFormatter, j4→shellEscape, J4→BashTool, L9→ReadTool, xq→formatBytes
```

**Key Design Decisions:**

1. **Pre-switch team check**: Team types (`teammate_mailbox`, `team_context`) are checked before the switch because they're only relevant in team mode (`E7()` / `isTeamMode` check at `chunks.50.mjs:2543`).

```javascript
// ============================================
// Pre-switch team mode check
// Location: chunks.174.mjs:3-8
// ============================================

// ORIGINAL (for source lookup):
function Ui8(A) {
    if (E7()) {
        if (A.type === "teammate_mailbox") return [p1({ content: Kzz().formatTeammateMessages(A.messages), isMeta: !0 })];
        if (A.type === "team_context") return [p1({ content: `<system-reminder>...team coordination...`, isMeta: !0 })]
    }

// READABLE (for understanding):
function normalizeAttachmentForAPI(attachment) {
    if (isTeamMode()) {
        if (attachment.type === "teammate_mailbox")
            return [createUserMessage({ content: getMailboxFormatter().formatTeammateMessages(attachment.messages), isMeta: true })];
        if (attachment.type === "team_context")
            return [createUserMessage({ content: `<system-reminder>...team coordination...`, isMeta: true })];
    }

// Mapping: Ui8→normalizeAttachmentForAPI, A→attachment, E7→isTeamMode, p1→createUserMessage, Kzz→getMailboxFormatter
```

2. **Silent types**: Multiple types return `[]` without producing messages:
   - `already_read_file` - UI visibility only, no API message
   - `command_permissions` - Internal state, not user-facing
   - `edited_image_file` - Binary content handled separately
   - Hook internal types: `hook_cancelled`, `hook_error_during_execution`, `hook_non_blocking_error`, `hook_system_message`, `hook_permission_decision`, `structured_output`
   - Auto types: `autocheckpointing`, `background_task_status`

3. **Unknown type safety**: Any unrecognized type logs a warning and returns `[]`, ensuring forward compatibility.

---

## Plan Mode Reminder Variants

Plan mode has the most sophisticated reminder system with multiple variants (full, iterative, sparse, subagent).

> **Detailed analysis**: [types_mode_control.md](./types_mode_control.md) - Contains full code, output format, and trigger conditions for all variants

### Variant Selection Flow

```
┌───────────────────────────────────────────────────────────┐
│                   Plan Mode Attachment                      │
│                  { type: "plan_mode", ... }                 │
└───────────────────────────┬───────────────────────────────┘
                            │
                            ↓
                ┌───────────────────────┐
                │   planModeReminderDispatcher│
                │          (Wzz)              │
                └─────────────┬───────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │ isSubAgent?      │ reminderType?    │
           │                  │ = "sparse"?      │
           ↓                  ↓                  ↓
      [subagent (yzz)]   [sparse (Ezz)]    [full (Nzz)]
```

**Token efficiency**: Sparse reminders (~150 tokens) save ~1300 tokens vs. full (~1500 tokens).

**v2.1.76 change**: The `/plan` command now accepts an optional description argument. When provided, the plan attachment includes the description in the `plan_mode` object which is then rendered in the full reminder variant to give the LLM initial task context before exploration begins.

---

## XML Tag Processing

### System Reminder Regex Pattern

**Location:** `chunks.90.mjs:730`

**Pattern:**
```javascript
// ============================================
// SYSTEM_REMINDER_REGEX - Pattern for parsing <system-reminder> tags
// Location: chunks.90.mjs:730
// ============================================

// ORIGINAL (for source lookup):
let EL9 = /<system-reminder>([\s\S]*?)<\/system-reminder>/g;

// READABLE (for understanding):
const SYSTEM_REMINDER_REGEX = /<system-reminder>([\s\S]*?)<\/system-reminder>/g;

// Mapping: EL9→SYSTEM_REMINDER_REGEX
```

**Pattern explanation:**
- `<system-reminder>` - Opening tag (literal)
- `([\s\S]*?)` - Capture group: any character including newlines, non-greedy
- `<\/system-reminder>` - Closing tag (escaped forward slash)
- `g` flag - Global matching (find all occurrences)

**Usage:**
```javascript
// Extract content from system-reminder tags
let content = message.content.match(SYSTEM_REMINDER_REGEX);

// Strip tags to get inner content
let innerContent = message.content.replace(/<system-reminder>|<\/system-reminder>/g, '');
```

---

## Message Construction Patterns

### Pattern A: b5 Wrapping (Most Types)

Used for multi-message attachments (tool call + result).

```
Producer → Ui8 → [
    nr6(toolName, params),    // Tool call message
    ir6(tool, result)          // Tool result message
] → b5() wraps all in XML tags
```

**Example:** `directory` attachment
```javascript
case "directory":
    return b5([
        nr6(BashTool.name, {
            command: `ls ${shellEscape([attachment.path])}`,
            description: `Lists files in ${attachment.path}`
        }),
        ir6(BashTool, {
            stdout: attachment.content,
            stderr: "",
            interrupted: false
        })
    ]);
```

### Pattern B: Inline af Wrapping (Status Types)

Used for single notification messages.

```
Producer → Ui8 → p1({
    content: af("..."),
    isMeta: true
})
```

**Example:** `token_usage` attachment
```javascript
case "token_usage":
    return [p1({
        content: af(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
        isMeta: true
    })];
```

### Pattern C: Pre-constructed XML (Team Types)

Team types construct XML tags manually in content.

```
Producer → Ui8 → p1({
    content: `<system-reminder>...team content...</system-reminder>`,
    isMeta: true
})
```

**Example:** `team_context` attachment
```javascript
if (attachment.type === "team_context") return [p1({
    content: `<system-reminder>
# Team Coordination

You are a teammate in team "${attachment.teamName}".
...
</system-reminder>`,
    isMeta: true
})];
```

---

## Constants and Configuration

### MAX_FILE_LINES (AC1)

**Location:** `chunks.142.mjs` (referenced in K2z at line 761)

**Value:** `2000`

**Purpose:** Limits file content attachments to first 2000 lines to prevent token overflow.

**Behavior:** When exceeded, attachment includes `truncated: true` flag and additional message instructing LLM to use Read tool for more content.

### TURNS_BETWEEN_PLAN_MODE_REMINDERS

**Purpose:** Frequency throttling for plan mode reminders.

**Behavior:** Full reminder sent every N turns, sparse reminders in between.

### MAX_PDF_PAGES_PER_REQUEST

**Value:** `20`

**Purpose:** Limits PDF page reads per request.

**Behavior:** LLM instructed to read PDFs in batches.

---

## Helper Functions

> Note: Type-related helper functions are analyzed in detail in the corresponding per-type documents.

### countTokensSinceUltramemory (jIY) - Token Cooldown Tracking

> **Detailed analysis**: [types_skills_memory.md](./types_skills_memory.md#ultramemory)

**What it does:** Counts assistant tokens since the last ultramemory attachment.

**Location:** `chunks.142.mjs:2442-2454`

**Key insight:** Returns `null` if no previous ultramemory attachment exists, allowing the caller to determine first-time behavior.

---

### shouldSendUltramemoryAttachment (MIY) - Cooldown Check

> **Detailed analysis**: [types_skills_memory.md](./types_skills_memory.md#ultramemory)

**What it does:** Determines if ultramemory attachment should be sent based on token cooldown.

**Location:** `chunks.142.mjs:2456-2461`

**Key insight:** The cooldown is token-based (5000 tokens), not turn-based.

---

### countUserTurnsSincePlanModeExit (CIY) - Plan Mode Tracking

> **Detailed analysis**: [types_mode_control.md](./types_mode_control.md#plan_mode_exit)

**What it does:** Counts non-meta user messages since exiting plan mode.

**Location:** `chunks.142.mjs:2839-2847`

---

### isPathDisallowed (sW1) - Permission Check

> **Detailed analysis**: [types_file_context.md](./types_file_context.md#trigger-conditions-summary)

**What it does:** Checks if a path is denied read access based on permission rules.

**Location:** `chunks.142.mjs:2853-2855`

**Key insight:** Used by file attachment producers to silently skip sandboxed/denied files without logging errors.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key implementation functions in this document:

- `wrapInXmlTag` (af) - XML tag wrapper for strings, `chunks.173.mjs:2490-2494`
- `wrapWithSystemReminderTags` (b5) - Message array wrapper, `chunks.173.mjs:2496-2523`
- `normalizeAttachmentForAPI` (Ui8) - Main dispatcher, `chunks.174.mjs:1-469`
- `createUserMessage` (p1) - User message factory, `chunks.173.mjs:1378+`
- `createToolCallMessage` (nr6) - Tool call display, `chunks.174.mjs:490-495`
- `createToolResultMessage` (ir6) - Tool result display, `chunks.174.mjs:471-488`
- `planModeReminderDispatcher` (Wzz) - Variant router, `chunks.173.mjs:2525-2530`
- `fullPlanReminder` (Nzz) - Full instructions, `chunks.173.mjs:2556-2690`
- `sparsePlanReminder` (Ezz) - Abbreviated reminder, `chunks.173.mjs:2692-2699`
- `subAgentPlanReminder` (yzz) - Subagent instructions, `chunks.173.mjs:2701-2712`
- `ultraplanCompleteReminder` (Zzz) - Ultraplan complete, `chunks.173.mjs:2532-2538`
- `autoModeReminder` (Lzz) - Auto mode dispatcher, `chunks.173.mjs:2714-2717`
- `fullAutoModeReminder` (Rzz) - Full auto mode instructions, `chunks.173.mjs:2719-2732`
- `sparseAutoModeReminder` (hzz) - Sparse auto mode reminder, `chunks.173.mjs:2734-2739`
- `SYSTEM_REMINDER_REGEX` (EL9) - XML parsing pattern, `chunks.90.mjs:730`
- `countTokensSinceUltramemory` (jIY) - Token cooldown tracking, `chunks.142.mjs:2442-2454`
- `shouldSendUltramemoryAttachment` (MIY) - Cooldown check, `chunks.142.mjs:2456-2461`
- `countUserTurnsSincePlanModeExit` (CIY) - Plan mode tracking, `chunks.142.mjs:2839-2847`
- `isPathDisallowed` (sW1) - Permission check, `chunks.142.mjs:2853-2855`
- `isTeamMode` (E7) - Team mode check, `chunks.50.mjs:2543`
- `getMailboxFormatter` (Kzz) - Mailbox message formatter

---

## Source Locations

- `chunks.174.mjs:1-469` - Core normalization functions (normalizeAttachmentForAPI)
- `chunks.173.mjs:1378-1412` - User message construction (createUserMessage)
- `chunks.173.mjs:2490-2740` - XML wrappers, plan/auto mode reminders
- `chunks.147.mjs:1-1262` - Attachment producer functions (assembleAllAttachments, get*Attachment functions)
- `chunks.90.mjs:730` - Regex patterns

---

## Related Documents

### Core Documentation
- [overview.md](./overview.md) - System reminder architecture overview
- [reminder_types.md](./reminder_types.md) - Complete catalog of reminder types
- [attachment_producers.md](./attachment_producers.md) - Producer function analysis
- [integration_points.md](./integration_points.md) - Cross-module integration
- [ui_linkage.md](./ui_linkage.md) - UI visibility and API pipeline
- [edge_cases_and_failures.md](./edge_cases_and_failures.md) - Error handling
- [performance_and_telemetry.md](./performance_and_telemetry.md) - Performance analysis

### Per-Type Analysis Documents
- [types_team_mode.md](./types_team_mode.md) - Team/Swarm types
- [types_file_context.md](./types_file_context.md) - File/Directory types
- [types_ide_integration.md](./types_ide_integration.md) - IDE integration types
- [types_task_management.md](./types_task_management.md) - Todo/Task types
- [types_mode_control.md](./types_mode_control.md) - Plan/Delegate mode types
- [types_skills_memory.md](./types_skills_memory.md) - Skills/Memory types
- [types_hooks.md](./types_hooks.md) - Hook types
- [types_status_budget.md](./types_status_budget.md) - Status/Budget types
- [types_silent.md](./types_silent.md) - Silent types
- [quick_reference.md](./quick_reference.md) - Quick lookup index
