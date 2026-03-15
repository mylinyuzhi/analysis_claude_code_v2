# System Reminder Implementation Details

> **Module**: System Reminders - Core Implementation
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.173.mjs:490-1131`, `chunks.142.mjs:1948-2865`

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
2. **Normalization Layer** (`chunks.173.mjs`) - Converts attachments to API messages
3. **Injection Layer** (`chunks.148.mjs`) - Inserts messages into conversation stream

This document focuses on the **normalization layer** implementation details, specifically the core functions that convert typed attachment objects into formatted messages.

---

## Core Functions

### wrapInXmlTag (tI) - XML Tag Wrapper

**What it does:** Wraps content string in `<system-reminder>` XML tags.

**How it works:**
```javascript
// ============================================
// wrapInXmlTag - Creates the <system-reminder> XML wrapper string
// Location: chunks.173.mjs:490-494
// ============================================

// ORIGINAL (for source lookup):
function tI(A) {
    return `<system-reminder>\n${A}\n</system-reminder>`
}

// READABLE (for understanding):
function wrapInXmlTag(content) {
    return `<system-reminder>\n${content}\n</system-reminder>`;
}

// Mapping: tI→wrapInXmlTag, A→content
```

**Key insight:** This is a minimal, single-purpose function. The newline after opening tag and before closing tag ensures clean formatting when content spans multiple lines.

**When used:**
- Inline wrapping in status notifications (`task_status`, `token_usage`, `budget_usd`)
- Hook response messages (`hook_blocking_error`, `hook_success`)

---

### wrapWithSystemReminderTags (_9) - Message Array Wrapper

**What it does:** Wraps an array of messages, adding XML tags to all text content.

**How it works:**
```javascript
// ============================================
// wrapWithSystemReminderTags - Wraps text content in <system-reminder> XML tags
// Location: chunks.173.mjs:496-523
// ============================================

// ORIGINAL (for source lookup):
function _9(A) {
    return A.map((q) => {
        if (typeof q.message.content === "string") return {
            ...q, message: { ...q.message, content: tI(q.message.content) }
        };
        else if (Array.isArray(q.message.content)) {
            let K = q.message.content.map((Y) => {
                if (Y.type === "text") return { ...Y, text: tI(Y.text) };
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

// Mapping: _9→wrapWithSystemReminderTags, A→messages, q→msg, tI→wrapInXmlTag, K→wrappedBlocks, Y→block
```

**Why this approach:**
- **String handling**: Simple wrap for text-only messages
- **Array handling**: Preserves image blocks (type: "image") without corruption
- **Flexibility**: Works with both simple text and multi-modal content

**Key insight:** The function doesn't wrap image blocks because XML tags would corrupt binary/structured image data. This allows system reminders to include images alongside text instructions.

---

### normalizeAttachmentForAPI (K2z) - Main Dispatcher

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
    │     ├─> Memory types: nested_memory, invoked_skills, skill_listing
    │     ├─> Mode types: plan_mode, plan_mode_reentry, plan_mode_exit, delegate_mode, delegate_mode_exit
    │     ├─> Hook types: async_hook_response, hook_blocking_error, hook_success, hook_additional_context
    │     ├─> New hook types (v2.1.76): post_compact, elicitation, elicitation_result,
    │     │                             instructions_loaded, config_change, worktree_create, worktree_remove
    │     ├─> Budget types: token_usage, budget_usd
    │     ├─> New status types (v2.1.76): session_name, cron_job
    │     ├─> Other types: mcp_resource, agent_mention, diagnostics, queued_command, ultramemory
    │     └─> Silent types: already_read_file, command_permissions, edited_image_file, etc.
    │
    └─> Unknown type fallback → log warning, return []
```

**Source Location:** `chunks.173.mjs:698-1131`

**Key Design Decisions:**

1. **Pre-switch team check**: Team types (`teammate_mailbox`, `team_context`) are checked before the switch because they're only relevant in team mode (`l8()` check).

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
                │          (azz)              │
                └─────────────┬───────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │ isSubAgent?      │ reminderType?    │
           │                  │ = "sparse"?      │
           ↓                  ↓                  ↓
      [subagent (q2z)]   [sparse (A2z)]    [full (szz)]
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

### Pattern A: _9 Wrapping (Most Types)

Used for multi-message attachments (tool call + result).

```
Producer → K2z → [
    pd1(toolName, params),    // Tool call message
    Ud1(tool, result)          // Tool result message
] → _9() wraps all in XML tags
```

**Example:** `directory` attachment
```javascript
case "directory":
    return _9([
        pd1(BashTool.name, {
            command: `ls ${shellEscape([attachment.path])}`,
            description: `Lists files in ${attachment.path}`
        }),
        Ud1(BashTool, {
            stdout: attachment.content,
            stderr: "",
            interrupted: false
        })
    ]);
```

### Pattern B: Inline tI Wrapping (Status Types)

Used for single notification messages.

```
Producer → K2z → c6({
    content: tI("..."),
    isMeta: true
})
```

**Example:** `token_usage` attachment
```javascript
case "token_usage":
    return [c6({
        content: tI(`Token usage: ${attachment.used}/${attachment.total}; ${attachment.remaining} remaining`),
        isMeta: true
    })];
```

### Pattern C: Pre-constructed XML (Team Types)

Team types construct XML tags manually in content.

```
Producer → K2z → c6({
    content: `<system-reminder>...team content...</system-reminder>`,
    isMeta: true
})
```

**Example:** `team_context` attachment
```javascript
if (attachment.type === "team_context") return [c6({
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

- `wrapInXmlTag` (tI) - XML tag wrapper for strings, `chunks.173.mjs:490-494`
- `wrapWithSystemReminderTags` (_9) - Message array wrapper, `chunks.173.mjs:496-523`
- `normalizeAttachmentForAPI` (K2z) - Main dispatcher, `chunks.173.mjs:698-1131`
- `planModeReminderDispatcher` (azz) - Variant router, `chunks.173.mjs:525-529`
- `fullPlanReminder` (szz) - Full instructions, `chunks.173.mjs:531-609`
- `iterativePlanReminder` (ezz) - Iterative workflow, `chunks.173.mjs:619-674`
- `sparsePlanReminder` (A2z) - Abbreviated reminder, `chunks.173.mjs:676-683`
- `subAgentPlanReminder` (q2z) - Subagent instructions, `chunks.173.mjs:685-696`
- `createToolCallMessage` (pd1) - Tool call display, `chunks.173.mjs:1152-1157`
- `createToolResultMessage` (Ud1) - Tool result display, `chunks.173.mjs:1133-1150`
- `SYSTEM_REMINDER_REGEX` (EL9) - XML parsing pattern, `chunks.90.mjs:730`
- `countTokensSinceUltramemory` (jIY) - Token cooldown tracking, `chunks.142.mjs:2442-2454`
- `shouldSendUltramemoryAttachment` (MIY) - Cooldown check, `chunks.142.mjs:2456-2461`
- `countUserTurnsSincePlanModeExit` (CIY) - Plan mode tracking, `chunks.142.mjs:2839-2847`
- `isPathDisallowed` (sW1) - Permission check, `chunks.142.mjs:2853-2855`

---

## Source Locations

- `chunks.173.mjs:490-1131` - Core normalization functions
- `chunks.142.mjs:1948-2865` - Attachment producer functions
- `chunks.148.mjs:2414-2428` - Message injection functions
- `chunks.172.mjs:2876-2912` - User message construction
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
