# System Reminder Types: Silent / No-Op Types

> **Module**: System Reminders - Silent Types
> **Version**: Claude Code 2.1.38
> **Source**: `chunks.173.mjs:1118-1131`

---

## Table of Contents

- [Overview](#overview)
- [Why Silent Types Exist](#why-silent-types-exist)
- [Type Catalog](#type-catalog)
- [already_read_file](#already_read_file)
- [command_permissions](#command_permissions)
- [edited_image_file](#edited_image_file)
- [Hook Silent Types](#hook-silent-types)
- [Other Silent Types](#other-silent-types)
  - [autocheckpointing](#autocheckpointing)
  - [background_task_status](#background_task_status)
  - [edited_image_file (Enhanced Detail)](#edited_image_file-enhanced-detail)
- [Complete Silent Type Reference](#complete-silent-type-reference)
- [Edge Cases and Error Handling](#edge-cases-and-error-handling)

---

## Overview

Silent types are attachment types that **produce no API messages**. They return an empty array `[]` from `normalizeAttachmentForAPI`. Despite being "silent", they serve important purposes:

1. **UI state tracking** - Update internal state without API messages
2. **Deduplication signals** - Prevent redundant operations
3. **Internal bookkeeping** - Track operations for later reference
4. **Error handling** - Record errors without disturbing conversation

---

## Why Silent Types Exist

### Design Rationale

```
┌─────────────────────────────────────────────────────────────────┐
│                     Normal Attachment Flow                       │
│                                                                  │
│  Producer → Attachment → K2z → [Messages] → API → LLM           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Silent Attachment Flow                       │
│                                                                  │
│  Producer → Attachment → K2z → [] → (No API message)            │
│                              │                                   │
│                              └─> UI State / Internal Tracking    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Benefits

| Benefit | Example |
|---------|---------|
| Token efficiency | Don't waste tokens on internal state |
| Clean API messages | No noise in conversation context |
| State tracking | UI knows file was already read |
| Deduplication | Prevent duplicate file reads |

---

## Type Catalog

| Type | Category | Purpose |
|------|----------|---------|
| `already_read_file` | File Context | Track unchanged file @-mention |
| `command_permissions` | Permissions | Internal permission state |
| `edited_image_file` | File Context | Binary file modification |
| `hook_cancelled` | Hooks | Hook was cancelled |
| `hook_error_during_execution` | Hooks | Hook execution error |
| `hook_non_blocking_error` | Hooks | Non-blocking hook error |
| `hook_system_message` | Hooks | System message from hook |
| `hook_permission_decision` | Hooks | Permission decision from hook |
| `structured_output` | Hooks | Structured output from hook |
| `autocheckpointing` | System | Auto-checkpoint notification |
| `background_task_status` | Tasks | Background task status (internal) |

---

## already_read_file

### What It Does

Signals that a file @-mentioned by the user has already been read and hasn't changed. Prevents redundant file reads.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| @-mention | User @-mentions a file |
| File in cache | File exists in `readFileState` |
| Not modified | File timestamp matches cache |
| Mode is at-mention | Triggered from @-mention context |

### Source Code

#### Producer Function

```javascript
// ============================================
// loadFileAttachment - already_read_file case
// Location: chunks.142.mjs:2545-2563
// ============================================

// ORIGINAL (for source lookup):
let _ = q.readFileState.get(A);
if (_ && z === "at-mention") try {
    let J = aW(A);
    if (_.timestamp <= J && J === _.timestamp) return c(K, {}), {
        type: "already_read_file",
        filename: A,
        content: {
            type: "text",
            file: {
                filePath: A,
                content: _.content,
                numLines: _.content.split(`
`).length,
                startLine: H ?? 1,
                totalLines: _.content.split(`
`).length
            }
        }
    }
} catch {}

// READABLE (for understanding):
let cachedFile = sessionContext.readFileState.get(filePath);
if (cachedFile && mode === "at-mention") {
    try {
        let mtime = getMtime(filePath);

        // Check if file is unchanged
        if (cachedFile.timestamp <= mtime && mtime === cachedFile.timestamp) {
            logTelemetry(successEvent, {});

            return {
                type: "already_read_file",
                filename: filePath,
                content: {
                    type: "text",
                    file: {
                        filePath: filePath,
                        content: cachedFile.content,
                        numLines: cachedFile.content.split('\n').length,
                        startLine: offset ?? 1,
                        totalLines: cachedFile.content.split('\n').length
                    }
                }
            };
        }
    } catch {}
}
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - already_read_file case
// Location: chunks.173.mjs:1118
// ============================================

// ORIGINAL (for source lookup):
case "already_read_file":
// ... falls through to return []

// READABLE (for understanding):
case "already_read_file":
    return [];  // Silent - no message produced
```

### Why Silent?

1. **Token efficiency** - Don't re-send unchanged content
2. **State tracking** - UI can show file is "known"
3. **Deduplication** - Prevent redundant Read tool calls

---

## command_permissions

### What It Does

Internal tracking for command permission decisions. Used by the permission system to record decisions.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Permission check | System checks command permission |
| Decision made | Allow/deny decision recorded |

### Source Code

```javascript
// ============================================
// normalizeAttachmentForAPI - command_permissions case
// Location: chunks.173.mjs:1119
// ============================================

// ORIGINAL (for source lookup):
case "command_permissions":
// ... falls through to return []

// READABLE (for understanding):
case "command_permissions":
    return [];  // Silent - internal state only
```

### Why Silent?

Permission decisions are tracked internally for:
- Audit logging
- Permission caching
- State management

No need to inform the LLM about permission internals.

---

## edited_image_file

### What It Does

Tracks when an image file has been modified externally (by user or tool). Images are handled separately from text files.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Image in watch list | File is in `readFileState` |
| Image modified | File modification detected |
| Content is image | File type is image |

### Source Code

```javascript
// ============================================
// getChangedFilesAttachment - Image handling
// Location: chunks.142.mjs:2319-2330
// ============================================

// ORIGINAL (for source lookup):
if (O.data.type === "image") try {
    let J = await vyA(w);
    return {
        type: "edited_image_file",
        filename: w,
        content: J
    }
} catch (J) {
    return K1(J), c("tengu_watched_file_compression_failed", {
        file: w
    }), null
}

// READABLE (for understanding):
if (result.data.type === "image") {
    try {
        let imageContent = await compressImage(absolutePath);
        return {
            type: "edited_image_file",
            filename: absolutePath,
            content: imageContent
        };
    } catch (error) {
        logError(error);
        logTelemetry("tengu_watched_file_compression_failed", {
            file: absolutePath
        });
        return null;
    }
}
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - edited_image_file case
// Location: chunks.173.mjs:1120
// ============================================

// ORIGINAL (for source lookup):
case "edited_image_file":
// ... falls through to return []

// READABLE (for understanding):
case "edited_image_file":
    return [];  // Silent - images handled differently
```

### Why Silent?

Image modifications are tracked but not injected as reminders because:
- Binary content would be corrupted by XML wrapping
- Images are handled through the tool result mechanism
- UI can update state without LLM notification

---

## Hook Silent Types

### hook_cancelled

**Triggered when:** Hook process was cancelled before completion.

```javascript
// Location: chunks.173.mjs:1121
case "hook_cancelled":
    return [];  // Silent
```

**Why silent:** Cancellation is a normal operation, not an error that needs LLM attention.

### hook_error_during_execution

**Triggered when:** Hook encountered an error during execution (non-blocking).

```javascript
// Location: chunks.173.mjs:1122
case "hook_error_during_execution":
    return [];  // Silent
```

**Why silent:** Non-blocking errors don't affect the operation. Logged for debugging.

### hook_non_blocking_error

**Triggered when:** Hook had an error but wasn't configured to block.

```javascript
// Location: chunks.173.mjs:1123
case "hook_non_blocking_error":
    return [];  // Silent
```

**Why silent:** Similar to `hook_error_during_execution` - error doesn't block the operation.

### hook_system_message

**Triggered when:** Hook provided a system message (handled elsewhere).

```javascript
// Location: chunks.173.mjs:1124
case "hook_system_message":
    return [];  // Silent
```

**Why silent:** System messages are delivered through other mechanisms (see `async_hook_response`).

### hook_permission_decision

**Triggered when:** Hook made a permission decision.

```javascript
// Location: chunks.173.mjs:1126
case "hook_permission_decision":
    return [];  // Silent
```

**Why silent:** Permission decisions are internal state, tracked for audit/caching.

### structured_output

**Triggered when:** Hook returned structured output.

```javascript
// Location: chunks.173.mjs:1125
case "structured_output":
    return [];  // Silent
```

**Why silent:** Structured output is processed by the system, not shown to the LLM directly.

---

## Other Silent Types

### autocheckpointing

**Triggered when:** Auto-checkpoint system is active.

```javascript
// Location: chunks.173.mjs:1129
if (["autocheckpointing", "background_task_status"].includes(A.type)) return [];
```

**Why silent:** Checkpoint status is internal system state.

#### Detailed Analysis

**What it does:**
The `autocheckpointing` type tracks the state of the auto-checkpoint system, which automatically creates conversation checkpoints at strategic points. This enables:
1. Crash recovery - Restore conversation after unexpected termination
2. Session resumption - Continue from last known good state
3. Undo capability - Roll back to previous checkpoint if needed

**Flow diagram:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    Auto-Checkpoint Flow                          │
│                                                                  │
│  1. User sends message                                           │
│  2. Agent processes → tool calls                                 │
│  3. Auto-checkpoint triggers (based on turn count/state)         │
│  4. Checkpoint attachment created → Silent (no API message)      │
│  5. State persisted to ~/.claude/checkpoints/                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why this design:**
- Checkpoints are transparent to the LLM - they don't need to know about them
- Reduces noise in context - no checkpoint notifications in conversation
- Internal state management - UI shows checkpoint status separately

---

### background_task_status

**Triggered when:** Background task status update (internal).

**Note:** This is different from `task_status` which IS visible. The `background_task_status` is an internal tracking type.

**Why silent:** Internal task tracking, not meant for LLM consumption.

#### Detailed Analysis

**What it does:**
The `background_task_status` type tracks the internal state of background tasks for the UI and system management. It differs from `task_status` in several key ways:

| Aspect | `task_status` (Visible) | `background_task_status` (Silent) |
|--------|-------------------------|-----------------------------------|
| Audience | LLM + User | Internal UI only |
| Content | Task ID, type, description, status | Internal state, progress metadata |
| Trigger | Task completion/status change | Periodic polling, state updates |
| Format | Formatted message with instructions | Raw state object |

**Internal state tracking diagram:**
```
┌─────────────────────────────────────────────────────────────────┐
│                 Background Task Status Flow                      │
│                                                                  │
│  ┌─────────────┐     ┌─────────────────────┐                    │
│  │ TaskRunner  │────▶│ background_task_    │                    │
│  │             │     │ status attachment   │                    │
│  └─────────────┘     └──────────┬──────────┘                    │
│                                 │                                │
│                                 ↓ Silent (return [])             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   UI State Update                        │    │
│  │  - Progress bar updates                                  │    │
│  │  - Task list refresh                                     │    │
│  │  - Status indicators                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Why separate from task_status:**
- Background tasks may have different visibility rules
- Internal state includes metadata not relevant to LLM
- Avoids cluttering conversation with background task updates
- UI can poll/display status without LLM needing to act on it

---

### edited_image_file (Enhanced Detail)

**What it does:**

Tracks when an image file has been modified externally (by user or tool). Images are handled separately from text files.

#### Why Image Files Are Special

1. **Binary content**: Cannot be wrapped in XML without corruption
2. **Token inefficiency**: Base64 encoding would waste tokens
3. **Tool result mechanism**: Images are already handled through tool results
4. **Multi-modal support**: LLM can "see" images directly through content blocks

#### Image Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Image File Change Detection                   │
│                                                                  │
│  1. File watcher detects image modification                     │
│  2. getChangedFilesAttachment (wIY) checks type                 │
│  3. If type === "image":                                        │
│     a. Read and compress image (vyA)                            │
│     b. Return edited_image_file attachment                      │
│     c. normalizeAttachmentForAPI → return []                    │
│  4. UI updates state separately                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Error Handling

```javascript
// Location: chunks.142.mjs:2319-2330
if (result.data.type === "image") {
    try {
        let imageContent = await compressImage(absolutePath);
        return {
            type: "edited_image_file",
            filename: absolutePath,
            content: imageContent
        };
    } catch (error) {
        logError(error);
        logTelemetry("tengu_watched_file_compression_failed", {
            file: absolutePath
        });
        return null;  // Silently fail - no attachment
    }
}
```

**Key insight:** Image compression failures are logged but don't produce error messages to avoid disrupting the conversation.

---

## Complete Silent Type Reference

### Source Code

```javascript
// ============================================
// normalizeAttachmentForAPI - All silent cases
// Location: chunks.173.mjs:1118-1131
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
    return []
}
if (["autocheckpointing", "background_task_status"].includes(A.type)) return [];

// READABLE (for understanding):
switch (attachment.type) {
    // ... visible types ...

    // Silent file types
    case "already_read_file":
    case "command_permissions":
    case "edited_image_file":
        return [];

    // Silent hook types
    case "hook_cancelled":
    case "hook_error_during_execution":
    case "hook_non_blocking_error":
    case "hook_system_message":
    case "structured_output":
    case "hook_permission_decision":
        return [];
}

// Silent system types (array check)
if (["autocheckpointing", "background_task_status"].includes(attachment.type)) {
    return [];
}
```

### Summary Table

| Type | Category | Normalization Result | Primary Purpose |
|------|----------|---------------------|-----------------|
| `already_read_file` | File | `[]` | Deduplication, state tracking |
| `command_permissions` | Permission | `[]` | Internal permission state |
| `edited_image_file` | File | `[]` | Image modification tracking |
| `hook_cancelled` | Hook | `[]` | Cancellation record |
| `hook_error_during_execution` | Hook | `[]` | Error logging |
| `hook_non_blocking_error` | Hook | `[]` | Non-blocking error record |
| `hook_system_message` | Hook | `[]` | System message tracking |
| `structured_output` | Hook | `[]` | Structured data tracking |
| `hook_permission_decision` | Hook | `[]` | Permission decision record |
| `autocheckpointing` | System | `[]` | Checkpoint state |
| `background_task_status` | Task | `[]` | Internal task tracking |

---

## Edge Cases and Error Handling

### Race Conditions

**Problem:** File modified while processing silent attachment.

**Solution:** Silent types use cached state that doesn't block on I/O:
```javascript
// already_read_file uses cached timestamp comparison
if (cachedFile.timestamp <= mtime && mtime === cachedFile.timestamp) {
    return { type: "already_read_file", ... };
}
```

### Permission Denied Scenarios

**Problem:** Silent types should never fail due to permission issues.

**Solution:** Permission checks happen at producer stage, not normalization:
- `already_read_file`: Only produced if file was already read successfully
- `edited_image_file`: Compression failures return `null`, not error attachments
- Hook types: All hooks have permission checks before execution

### Concurrent Modification Handling

| Type | Concurrent Modification Risk | Mitigation |
|------|------------------------------|------------|
| `already_read_file` | File changes after cache | Timestamp comparison catches changes |
| `edited_image_file` | Image modified during compression | try/catch with telemetry logging |
| `background_task_status` | Task completes during status poll | Status is atomic snapshot |
| `autocheckpointing` | Checkpoint during state change | Checkpoint captures consistent state |

### Size Limit Boundaries

Silent types don't have explicit size limits because they don't produce API messages. However:

1. **already_read_file**: Content stored in `readFileState` cache (memory limit applies)
2. **edited_image_file**: Image compression reduces size before attachment
3. **background_task_status**: Metadata only, no content size concerns
4. **autocheckpointing**: State serialized to disk, disk space limit applies

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `normalizeAttachmentForAPI` (K2z) - Main dispatcher, `chunks.173.mjs:698-1131`
- `loadFileAttachment` (TyA) - File loader with already_read_file handling, `chunks.142.mjs:2524-2613`
- `getChangedFilesAttachment` (wIY) - File change detector, `chunks.142.mjs:2285-2335`

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_file_context.md](./types_file_context.md) - File context types
- [types_hooks.md](./types_hooks.md) - Hook types (including visible ones)