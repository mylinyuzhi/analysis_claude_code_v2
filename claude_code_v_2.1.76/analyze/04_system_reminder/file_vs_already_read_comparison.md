# `file` vs `already_read_file` Attachment Types - Deep Comparison

> **Module**: System Reminders - Attachment Type Comparison
> **Version**: Claude Code 2.1.38
> **Purpose**: Clarify the critical difference between `file` and `already_read_file` attachment types

---

## Table of Contents

- [Overview and Purpose](#overview-and-purpose)
- [Common Misconception Clarification](#common-misconception-clarification)
- [Complete Flow Comparison](#complete-flow-comparison)
- [Side-by-Side Code Evidence](#side-by-side-code-evidence)
- [Synthetic Message Mechanism Deep Dive](#synthetic-message-mechanism-deep-dive)
- [Token Cost Analysis](#token-cost-analysis)
- [UI Rendering Comparison](#ui-rendering-comparison)
- [Design Rationale](#design-rationale)

---

## Overview and Purpose

Both `file` and `already_read_file` attachment types are triggered by **@mention** operations, but they differ fundamentally in how (or whether) they produce API messages.

### Why This Comparison Matters

1. **Token Efficiency**: Understanding this difference explains Claude Code's optimization for unchanged files
2. **API Message Behavior**: The two types produce vastly different API payloads
3. **User Transparency**: Despite different API behavior, users see identical UI

---

## Common Misconception Clarification

### The Misconception

A common misconception is that `already_read_file` generates synthetic tool_use/tool_result pairs like the `file` type.

### The Truth

**`already_read_file` does NOT produce synthetic tool messages.** It returns an empty array `[]`, producing no API messages at all.

### Key Question Answered

> **Does `already_read_file` create synthetic tool_use/tool_result pairs (creating extra toolcall and tooloutput), or does it return plain text?**

**Answer**: Neither. It returns an **empty array** `[]`, which means:
- No synthetic tool_use/tool_result pairs
- No plain text
- No API messages whatsoever
- Zero token cost for API context

---

## Complete Flow Comparison

### Trigger Chain

```
User @mentions file
       ↓
   KIY (extractAtMentionedFiles)  ← chunks.142.mjs:2199
       ↓
   TyA (buildFileAttachmentForMention)  ← chunks.142.mjs:2524
       ↓
   ┌─────────────────────────────────────────────────────────────┐
   │ Cached && unchanged?                                        │
   │   └─ YES → type: "already_read_file"                       │
   │   └─ NO  → read file → type: "file"                        │
   └─────────────────────────────────────────────────────────────┘
       ↓
   K2z (normalizeAttachmentForAPI)  ← chunks.173.mjs:698
       ↓
   ┌─────────────────────────────────────────────────────────────┐
   │ case "file":                                                │
   │   └─ pd1() + Ud1() → synthetic USER-role messages          │
   │                                                             │
   │ case "already_read_file":                                   │
   │   └─ return [] → NO messages                               │
   └─────────────────────────────────────────────────────────────┘
```

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    @mention File Flow                            │
│                                                                  │
│  ┌─────────────────┐                                            │
│  │ User @mentions  │                                            │
│  │ file.txt        │                                            │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ↓                                                      │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ TyA (buildFileAttachmentForMention)                    │     │
│  │                                                         │     │
│  │  Check readFileState cache:                             │     │
│  │  ┌─────────────────────────────────────────────────┐   │     │
│  │  │ File in cache?                                   │   │     │
│  │  │   └─ NO  → Read file → type: "file"             │   │     │
│  │  │   └─ YES → Check timestamp                       │   │     │
│  │  │           └─ Changed → Read file → type: "file" │   │     │
│  │  │           └─ Unchanged → type: "already_read_file" │  │
│  │  └─────────────────────────────────────────────────┘   │     │
│  └────────────────────────────────────────────────────────┘     │
│           │                                                      │
│           ↓                                                      │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ K2z (normalizeAttachmentForAPI)                        │     │
│  │                                                         │     │
│  │  switch (attachment.type):                              │     │
│  │  ┌───────────────────────────────────────────────────┐ │     │
│  │  │ case "file":                                      │ │     │
│  │  │   return _9([                                    │ │     │
│  │  │     pd1("Read", { file_path }),  // tool_use sim  │ │     │
│  │  │     Ud1(ReadTool, content)       // tool_result   │ │     │
│  │  │   ]);                                            │ │     │
│  │  │                                                  │ │     │
│  │  │ case "already_read_file":                        │ │     │
│  │  │   return [];  // Empty array - NO messages       │ │     │
│  │  └───────────────────────────────────────────────────┘ │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Both Types Triggered by @mention

| Type | Trigger | Cache State | API Messages | Token Cost |
|------|---------|-------------|--------------|------------|
| `file` | @mention | NOT in cache OR changed | YES - via pd1/Ud1 | ~100-1000+ |
| `already_read_file` | @mention | In cache AND unchanged | **NO** - returns `[]` | **0** |

---

## Side-by-Side Code Evidence

### 1. @mention Handler

```javascript
// ============================================
// extractAtMentionedFiles - Extract @mentioned files from user message
// Location: chunks.142.mjs:2199-2235
// ============================================

// ORIGINAL (for source lookup):
async function KIY(A, q) {
    let K = _IY(A);  // Extract @mentions
    // ... validation ...
    return await TyA(_, q, "tengu_at_mention_extracting_filename_success",
                     "tengu_at_mention_extracting_filename_error", "at-mention", {...});
}

// READABLE (for understanding):
async function extractAtMentionedFiles(userMessage, context) {
    let mentions = extractMentions(userMessage);
    // ... validation and path resolution ...
    return await buildFileAttachmentForMention(
        filePath,
        context,
        "tengu_at_mention_extracting_filename_success",
        "tengu_at_mention_extracting_filename_error",
        "at-mention",
        options
    );
}

// Mapping: KIY→extractAtMentionedFiles, A→userMessage, q→context, _IY→extractMentions,
//          TyA→buildFileAttachmentForMention
```

### 2. File Attachment Builder - Both Types

```javascript
// ============================================
// buildFileAttachmentForMention - Produces both file and already_read_file
// Location: chunks.142.mjs:2524-2613
// ============================================

// ORIGINAL (for source lookup):
async function TyA(A, q, K, Y, z, w) {
    // ... permission and size checks ...

    // CHECK CACHE - This is where the split happens
    let _ = q.readFileState.get(A);
    if (_ && z === "at-mention") {
        let J = aW(A);  // Get file mtime
        if (_.timestamp <= J && J === _.timestamp) {
            // FILE UNCHANGED → Return already_read_file
            return c(K, {}), {
                type: "already_read_file",
                filename: A,
                content: {
                    type: "text",
                    file: { filePath: A, content: _.content, ... }
                }
            };
        }
    }

    // FILE NOT IN CACHE OR CHANGED → Read file → Return "file" type
    // ... read file logic ...
    return { type: "file", filename: A, content: readResult.data };
}

// READABLE (for understanding):
async function buildFileAttachmentForMention(path, ctx, okMetric, errMetric, mode, opts) {
    // ... permission and size checks ...

    // Check if file is cached and unchanged
    const cachedFile = ctx.readFileState.get(path);
    if (cachedFile && mode === "at-mention") {
        const mtime = getFileMtime(path);

        // KEY DECISION: Is file unchanged?
        if (cachedFile.timestamp <= mtime && mtime === cachedFile.timestamp) {
            // UNCHANGED → Silent type (already_read_file)
            return {
                type: "already_read_file",
                filename: path,
                content: { type: "text", file: { ... } }
            };
        }
    }

    // NOT IN CACHE OR CHANGED → Read file
    const readResult = await fileReadTool.call({ file_path: path }, ctx);

    // Return "file" type (will generate synthetic messages)
    return { type: "file", filename: path, content: readResult.data };
}

// Mapping: TyA→buildFileAttachmentForMention, A→path, q→ctx, K→okMetric, Y→errMetric,
//          z→mode, w→opts, aW→getFileMtime, _→cachedFile, J→mtime, c→emitMetric
```

### 3. Normalizer - `file` Type (Creates Messages)

```javascript
// ============================================
// normalizeAttachmentForAPI - file case (CREATES synthetic messages)
// Location: chunks.173.mjs:750-772
// ============================================

// ORIGINAL (for source lookup):
case "file": {
    let K = A.content;
    switch (K.type) {
        case "text":
            return _9([
                pd1(i5.name, { file_path: A.filename }),  // synthetic tool_use
                Ud1(i5, K)                                 // synthetic tool_result
            ]);
        // ... other content types ...
    }
}

// READABLE (for understanding):
case "file": {
    const content = attachment.content;
    switch (content.type) {
        case "text":
            // Create TWO synthetic messages:
            // 1. "Called the Read tool with..."
            // 2. "Result of calling the Read tool: ..."
            return wrapWithSystemReminder([
                createToolCallMessage("Read", { file_path: attachment.filename }),
                createToolResultMessage(ReadTool, content)
            ]);
    }
}

// Mapping: A→attachment, K→content, _9→wrapWithSystemReminder,
//          pd1→createToolCallMessage, Ud1→createToolResultMessage, i5→ReadTool
```

### 4. Normalizer - `already_read_file` Type (Silent)

```javascript
// ============================================
// normalizeAttachmentForAPI - already_read_file case (NO messages)
// Location: chunks.173.mjs:1118-1127
// ============================================

// ORIGINAL (for source lookup):
case "already_read_file":
case "command_permissions":
case "edited_image_file":
case "hook_cancelled":
case "hook_error_during_execution":
case "hook_non_blocking_error":
case "hook_system_message":
case "structured_output":
case "hook_permission_decision":
    return []  // EMPTY ARRAY - No API messages!

// READABLE (for understanding):
case "already_read_file":
    // Silent type - return empty array
    // This means ZERO API messages are generated
    return [];
```

### 5. Tool Message Creators

```javascript
// ============================================
// createToolResultMessage - Creates USER-role message with tool result description
// Location: chunks.173.mjs:1133-1150
// ============================================

// ORIGINAL (for source lookup):
function Ud1(A, q) {
    let K = q.content.file;
    let Y = K.content.slice(0, 100).split("\n").length !== K.content.split("\n").length;
    return c6({
        content: `Result of calling the ${A.name} tool: ${Q1(K.content)}`,
        isMeta: !0
    });
}

// READABLE (for understanding):
function createToolResultMessage(tool, content) {
    const fileData = content.content.file;
    // Truncation check for display...

    return createUserMessage({
        content: `Result of calling the ${tool.name} tool: ${formatContent(fileData.content)}`,
        isMeta: true  // <-- Marks as meta-message for compaction
    });
}

// Mapping: Ud1→createToolResultMessage, A→tool, q→content, K→fileData, c6→createUserMessage,
//          Q1→formatContent

// ============================================
// createToolCallMessage - Creates USER-role message with tool call description
// Location: chunks.173.mjs:1152-1157
// ============================================

// ORIGINAL (for source lookup):
function pd1(A, q) {
    return c6({
        content: `Called the ${A} tool with the following input: ${Q1(q)}`,
        isMeta: !0
    });
}

// READABLE (for understanding):
function createToolCallMessage(toolName, input) {
    return createUserMessage({
        content: `Called the ${toolName} tool with the following input: ${formatContent(input)}`,
        isMeta: true  // <-- Marks as meta-message for compaction
    });
}

// Mapping: pd1→createToolCallMessage, A→toolName, q→input, c6→createUserMessage, Q1→formatContent
```

---

## Synthetic Message Mechanism Deep Dive

### CRITICAL: "Synthetic" messages are USER-role text, NOT tool_use blocks!

Many developers assume "synthetic tool messages" means actual API `tool_use` blocks. This is **incorrect**.

### What `pd1` Actually Creates

```javascript
// pd1 creates THIS:
{
    type: "user",
    message: {
        role: "user",
        content: "Called the Read tool with the following input: {\"file_path\": \"/path/to/file.txt\"}"
    },
    isMeta: true
}

// NOT an assistant message with tool_use block:
// {
//     type: "assistant",
//     message: {
//         role: "assistant",
//         content: [{
//             type: "tool_use",
//             id: "toolu_xxx",
//             name: "Read",
//             input: { file_path: "/path/to/file.txt" }
//         }]
//     }
// }
```

### API Message Format Comparison

| Type | Message Format | LLM Sees |
|------|----------------|----------|
| **Real tool_use** | `{ role: "assistant", content: [{ type: "tool_use", id, name, input }] }` | Structured tool call |
| **Real tool_result** | `{ role: "user", content: [{ type: "tool_result", tool_use_id, content }] }` | Structured result |
| **Synthetic pd1** | `{ role: "user", content: "Called the Read tool with..." }` | Plain text description |
| **Synthetic Ud1** | `{ role: "user", content: "Result of calling the Read tool: ..." }` | Plain text description |

### Why This Matters

1. **LLM doesn't "execute" synthetic messages** - No tool_use_id, no tool execution
2. **No tool_call/tool_result cycle** - Just text injected as context
3. **LLM sees these as user messages** - Part of conversation history
4. **No next-round processing** - The LLM doesn't respond with actual tool calls

### The Complete Flow (CRITICAL - USER message, NOT tool_use block!)

```
@mention file (NOT in cache)
       ↓
   TyA reads file → type: "file"
       ↓
   K2z normalizer
       ↓
   pd1("Read", { file_path })
       │
       │  Creates USER message:
       │  { type: "user", message: { role: "user", content: "Called the Read tool..." } }
       ↓
   Ud1(ReadTool, content)
       │
       │  Creates USER message:
       │  { type: "user", message: { role: "user", content: "Result of calling..." } }
       ↓
   _9() wraps with <system-reminder> tags
       ↓
   Sent to LLM as USER message with isMeta: true
       ↓
   LLM sees context but doesn't "process" as tool call
```

### Contrast with Real Tool Execution

| Real Tool Call | Synthetic "Tool" Message |
|----------------|-------------------------|
| `{ role: "assistant", content: [{ type: "tool_use", id, name, input }] }` | `{ role: "user", content: "Called the Read tool..." }` |
| Requires tool_result response | No response needed |
| Triggers actual execution | Just context injection |
| Has tool_use_id | No tool_use_id |
| LLM must handle the tool result | LLM just sees context text |

### Code Evidence: `c6` Creates USER Messages

```javascript
// ============================================
// createUserMessage - Message factory that creates USER role messages
// Location: chunks.172.mjs:2876-2912
// ============================================

// ORIGINAL (for source lookup):
function c6({
    content: A,
    isMeta: q,
    // ... other params
}) {
    return {
        type: "user",           // <-- USER type, NOT "assistant"
        message: {
            role: "user",       // <-- USER role, NOT "assistant"
            content: A || iv    // <-- Plain text content, NOT tool_use block
        },
        isMeta: q,              // <-- Meta flag for compaction
        // ... other fields
    }
}

// READABLE (for understanding):
function createUserMessage({
    content,
    isMeta,
    // ... other params
}) {
    return {
        type: "user",           // Always USER type
        message: {
            role: "user",       // Always USER role
            content: content || DEFAULT_EMPTY
        },
        isMeta: isMeta,         // Meta flag for special handling
        // ... other fields
    };
}

// Mapping: c6→createUserMessage, A→content, q→isMeta, iv→DEFAULT_EMPTY
```

---

## Token Cost Analysis

### `file` Type Token Cost

When a file is @mentioned for the first time (or has changed):

| Component | Token Estimate |
|-----------|----------------|
| Synthetic tool_use message (pd1) | ~20-50 tokens |
| Synthetic tool_result message (Ud1) | ~20-50 tokens |
| File content (variable) | ~50-10,000+ tokens |
| System-reminder wrapper | ~10-20 tokens |
| **Total** | **~100-10,000+ tokens** |

### `already_read_file` Type Token Cost

When a file is @mentioned again and unchanged:

| Component | Token Estimate |
|-----------|----------------|
| API messages | 0 (returns `[]`) |
| File content | 0 (not re-sent) |
| System-reminder wrapper | 0 (not created) |
| **Total** | **0 tokens** |

### Token Savings Example

```
Scenario: User @mentions the same 500-line file 5 times during a conversation

Without already_read_file optimization:
- 5 × (500 lines × ~3 tokens/line + overhead)
- = 5 × ~1,550 tokens
- = ~7,750 tokens

With already_read_file optimization:
- First mention: ~1,550 tokens
- Subsequent 4 mentions: 0 tokens each
- = ~1,550 tokens total

Token savings: ~80%
```

---

## UI Rendering Comparison

### Both Types Render Identically

Despite different API behavior, both types display the same way in the UI.

```javascript
// ============================================
// renderFileAttachment - UI rendering for both types
// Location: chunks.129.mjs:2584-2591
// ============================================

// ORIGINAL (for source lookup):
function(A) {
    if (A.type === "file" || A.type === "already_read_file") {
        let q = A.content.file.numLines;
        let K = A.truncated ? "+" : "";
        return `Read ${A.filename} (${q}${K} lines)`;
    }
    // ... other types ...
}

// READABLE (for understanding):
function renderFileAttachment(attachment) {
    if (attachment.type === "file" || attachment.type === "already_read_file") {
        const lines = attachment.content.file.numLines;
        const truncated = attachment.truncated ? "+" : "";
        return `Read ${attachment.filename} (${lines}${truncated} lines)`;
    }
}
```

### Why Identical UI?

1. **User transparency** - Users don't need to know about optimization
2. **Consistency** - Same visual experience regardless of cache state
3. **Context awareness** - User sees file was referenced
4. **No confusion** - No need to explain "this file was cached"

---

## Design Rationale

### Why `already_read_file` is Silent

1. **Token Efficiency**
   - File content already in LLM context from previous read
   - Re-sending would waste tokens without adding value
   - Compaction may have preserved key information

2. **No LLM Action Needed**
   - Model already has the file content
   - No need to notify LLM about redundant operation
   - System reminder would add noise without benefit

3. **UI-Only Visibility**
   - Users see "Read \<filename\>" in transcript
   - Maintains conversation continuity
   - No disruption to user experience

4. **Deduplication**
   - Prevents multiple Read tool calls for same file
   - Cache hit detection avoids redundant I/O
   - Timestamp comparison ensures freshness

### Why `file` Uses Synthetic Messages

1. **Context Injection**
   - LLM needs to know file was read
   - Synthetic messages provide context without actual tool execution
   - Format mimics tool behavior for consistency

2. **Conversation Flow**
   - Tool usage appears in conversation history
   - LLM can reference "the file I read"
   - Maintains mental model of file context

3. **Meta-Message Format**
   - `isMeta: true` allows special handling
   - Compaction can preserve or summarize
   - Separates from user's actual messages

### Architecture Trade-offs

| Decision | Trade-off |
|----------|-----------|
| Silent `already_read_file` | Saves tokens but LLM doesn't know file was re-referenced |
| Synthetic messages for `file` | Adds token overhead but maintains conversation continuity |
| Identical UI rendering | Hides optimization but reduces user confusion |
| Timestamp-based cache invalidation | Fast but may miss changes if mtime not updated |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:
- `extractAtMentionedFiles` (KIY) - Extract @mentions from user message, `chunks.142.mjs:2199`
- `buildFileAttachmentForMention` (TyA) - Producer for both types, `chunks.142.mjs:2524`
- `normalizeAttachmentForAPI` (K2z) - Normalizer dispatcher, `chunks.173.mjs:698`
- `createToolCallMessage` (pd1) - Synthetic tool_use creator, `chunks.173.mjs:1152`
- `createToolResultMessage` (Ud1) - Synthetic tool_result creator, `chunks.173.mjs:1133`
- `createUserMessage` (c6) - USER message factory, `chunks.172.mjs:2876`
- `wrapWithSystemReminder` (_9) - XML wrapper, `chunks.173.mjs:496`
- `ReadTool` (i5) - File read tool reference

---

## Related Documents

- [already_read_file_report.md](./already_read_file_report.md) - Implementation details
- [reminder_types.md](./reminder_types.md) - Complete type catalog
- [types_silent.md](./types_silent.md) - All silent types
- [integration_points.md](./integration_points.md) - Module integrations