# Tool UI Components - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Source-level documentation with ORIGINAL/READABLE code

---

## Overview

This document provides comprehensive documentation of all UI components involved in the tool execution flow. The Tool UI system handles rendering of tool invocations, permission dialogs, progress indicators, and result display.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Tools section)

Key functions in this document:
- `createUserMessage` (p1) - Message factory - chunks.173.mjs:1378
- `createProgressMessage` (C4q) - Progress callback - chunks.146.mjs
- `createAttachmentMessage` (f4) - Attachment wrapper - chunks.*.mjs
- `renderToolUseMessage` - In-progress header
- `renderToolResultMessage` - Result display

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     TOOL UI COMPONENT HIERARCHY                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     REPL Component                            │    │
│  │  ├─ MessageList                                               │    │
│  │  │   ├─ AssistantMessage                                      │    │
│  │  │   │   └─ ToolUseBlock (tool_use content block)            │    │
│  │  │   │       ├─ ToolUseHeader (name, status indicator)       │    │
│  │  │   │       └─ ToolUseContent (input preview)               │    │
│  │  │   └─ ToolResultMessage                                     │    │
│  │  │       ├─ ToolResultHeader (success/error status)          │    │
│  │  │       └─ ToolResultContent (output display)               │    │
│  │  └─ Modal Stack                                               │    │
│  │      ├─ PermissionDialog (priority 1-3)                      │    │
│  │      ├─ ElicitationDialog (priority 4 - lowest)              │    │
│  │      └─ ProgressIndicator (inline)                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  State Flow:                                                          │
│  tool_use block → toolDispatcher → AsyncQueue → UI updates          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. Message Factory Functions

### 1.1 createUserMessage (p1)

**What it does:**
Creates a user message object that wraps tool results and other content. This is the primary message factory for all tool-related messages.

**How it works:**
1. Accepts content array and optional metadata
2. Creates a properly formatted message object with isMeta flag for system messages
3. Includes toolUseResult for tool result tracking

**Why this approach:**
- Centralized message creation ensures consistency
- isMeta flag separates user-visible from system-internal messages
- sourceToolAssistantUUID links tool results to their originating assistant message

```javascript
// ============================================
// createUserMessage - Message factory for tool results
// Location: chunks.173.mjs:1378-1420
// ============================================

// ORIGINAL (for source lookup):
function p1(A) {
    let q = A.content,
        K = A.toolUseResult,
        Y = A.sourceToolAssistantUUID,
        z = A.isMeta,
        _ = z === void 0 ? !1 : z;
    return {
        role: "user",
        content: q,
        ...(K !== void 0 && {
            toolUseResult: K
        }),
        ...(Y !== void 0 && {
            sourceToolAssistantUUID: Y
        }),
        isMeta: _
    }
}

// READABLE (for understanding):
function createUserMessage(options) {
    const {
        content,
        toolUseResult,
        sourceToolAssistantUUID,
        isMeta = false
    } = options;

    return {
        role: "user",
        content,
        // Optional: Tool result for API
        ...(toolUseResult !== undefined && {
            toolUseResult
        }),
        // Optional: Link to originating assistant message
        ...(sourceToolAssistantUUID !== undefined && {
            sourceToolAssistantUUID
        }),
        // Meta flag for system messages (not shown to LLM in some contexts)
        isMeta
    };
}

// Mapping: p1→createUserMessage, A→options, q→content, K→toolUseResult,
//          Y→sourceToolAssistantUUID, z→isMeta
```

**Key insight:**
The `isMeta` flag is critical for differentiating between user-visible content and system-internal messages like tool progress updates.

---

### 1.2 createProgressMessage (C4q)

**What it does:**
Creates a progress message that streams tool execution status back to the UI during long-running operations.

**How it works:**
1. Accepts toolUseID, parentToolUseID, and progress data
2. Creates an attachment-type message with progress metadata
3. Enqueued to AsyncQueue for streaming display

```javascript
// ============================================
// createProgressMessage - Streaming progress updates
// Location: chunks.146.mjs (in ZxY function)
// ============================================

// ORIGINAL (for source lookup):
function C4q(A) {
    let q = A.toolUseID,
        K = A.parentToolUseID,
        Y = A.data;
    return {
        type: "progress",
        toolUseID: q,
        parentToolUseID: K,
        data: Y,
        timestamp: Date.now()
    }
}

// READABLE (for understanding):
function createProgressMessage(options) {
    const {
        toolUseID,        // Current tool use ID
        parentToolUseID,  // Parent tool (for nested calls)
        data              // Progress data (percentage, status text, etc.)
    } = options;

    return {
        type: "progress",
        toolUseID,
        parentToolUseID,
        data,
        timestamp: Date.now()
    };
}

// Mapping: C4q→createProgressMessage, A→options, q→toolUseID,
//          K→parentToolUseID, Y→data
```

**Usage in toolExecutionOrchestrator (ZxY):**

```javascript
// ============================================
// toolExecutionOrchestrator - Progress streaming
// Location: chunks.146.mjs:391-430
// ============================================

// ORIGINAL (for source lookup):
function ZxY(A, q, K, Y, z, _, w, O, $, H) {
    let j = new Pi6;
    return fxY(A, q, K, Y, z, _, w, O, $, H, (J) => {
        d("tengu_tool_use_progress", {...});
        j.enqueue({
            message: C4q({
                toolUseID: J.toolUseID,
                parentToolUseID: q,
                data: J.data
            })
        })
    }).then((J) => {
        for (let M of J) j.enqueue(M)
    }).catch((J) => {
        j.error(J)
    }).finally(() => {
        j.done()
    }), j
}

// READABLE (for understanding):
function toolExecutionOrchestrator(tool, toolUseId, input, toolUseContext,
                                    canUseTool, assistantMessage, messageId,
                                    requestId, mcpServerType, mcpServerBaseUrl) {
    // Create AsyncQueue for streaming results
    const queue = new AsyncQueue();

    // Execute pipeline with progress callback
    toolExecutionPipeline(tool, toolUseId, input, toolUseContext,
        canUseTool, assistantMessage, messageId, requestId,
        mcpServerType, mcpServerBaseUrl,
        (progressEvent) => {
            // Track progress telemetry
            trackEvent("tengu_tool_use_progress", {...});

            // Enqueue progress message for UI
            queue.enqueue({
                message: createProgressMessage({
                    toolUseID: progressEvent.toolUseID,
                    parentToolUseID: toolUseId,
                    data: progressEvent.data
                })
            });
        }
    ).then((results) => {
        // Enqueue all final results
        for (let result of results) {
            queue.enqueue(result);
        }
    }).catch((error) => {
        queue.error(error);
    }).finally(() => {
        queue.done();
    });

    return queue;  // Returns AsyncQueue for async iteration
}

// Mapping: ZxY→toolExecutionOrchestrator, A→tool, q→toolUseId, K→input,
//          Pi6→AsyncQueue, fxY→toolExecutionPipeline, C4q→createProgressMessage
```

---

### 1.3 createAttachmentMessage (f4)

**What it does:**
Creates an attachment message that wraps hook results, progress updates, and other metadata for inclusion in the conversation context.

**How it works:**
1. Wraps various attachment types (hook_additional_context, hook_blocking_error, etc.)
2. Includes toolUseID for linking to the originating tool call
3. Provides hook event metadata for debugging and telemetry

```javascript
// ============================================
// createAttachmentMessage - Attachment wrapper for hooks
// Location: chunks.*.mjs (used throughout tool pipeline)
// ============================================

// ORIGINAL (for source lookup):
function f4(A) {
    let q = A.type,
        K = A.hookName,
        Y = A.toolUseID,
        z = A.hookEvent,
        _ = A.content,
        w = A.blockingError;
    return {
        type: "attachment",
        attachment: {
            type: q,
            hookName: K,
            toolUseID: Y,
            hookEvent: z,
            ..._ && { content: _ },
            ...w && { blockingError: w }
        }
    }
}

// READABLE (for understanding):
function createAttachmentMessage(options) {
    const {
        type,           // Attachment type (hook_additional_context, etc.)
        hookName,       // e.g., "PreToolUse:Bash"
        toolUseID,      // Tool use ID this relates to
        hookEvent,      // "PreToolUse", "PostToolUse", etc.
        content,        // Optional: additional context content
        blockingError   // Optional: error that blocked execution
    } = options;

    return {
        type: "attachment",
        attachment: {
            type,
            hookName,
            toolUseID,
            hookEvent,
            ...(content && { content }),
            ...(blockingError && { blockingError })
        }
    };
}

// Mapping: f4→createAttachmentMessage, A→options, q→type, K→hookName,
//          Y→toolUseID, z→hookEvent, _→content, w→blockingError
```

**Attachment Types:**

| Type | Description | When Generated |
|------|-------------|----------------|
| `hook_additional_context` | Extra context from hooks | PreToolUse hook provides context |
| `hook_blocking_error` | Error that blocked tool | PreToolUse hook denies execution |
| `hook_cancelled` | Hook was cancelled | User aborts during hook execution |
| `hook_error_during_execution` | Hook threw an error | Hook throws unexpected error |
| `progress` | Tool progress update | Long-running tool provides status |
| `task_status` | Task system update | Task created/updated/deleted |

---

## 2. Permission UI Components

### 2.1 Permission Dialog Rendering

**What it does:**
Renders the permission dialog when a tool requires user approval. The dialog shows the tool name, input parameters, and allows the user to approve/deny.

**Modal Priority Algorithm:**

```javascript
// ============================================
// Modal Priority - Determines which dialog to show
// Location: UI rendering layer
// ============================================

// PRIORITY ORDER (highest to lowest):
// 1. sandbox-permission (priority 1)
// 2. tool-permission (priority 2)
// 3. worker-sandbox-permission (priority 3)
// 4. elicitation (priority 4 - lowest)

function getActiveModal(state) {
    const {
        sandboxPermissionQueue,
        pendingToolRequest,
        workerSandboxQueue,
        elicitation
    } = state;

    if (sandboxPermissionQueue[0]) {
        return {
            type: "sandbox-permission",
            priority: 1,
            data: sandboxPermissionQueue[0]
        };
    }

    if (pendingToolRequest[0]) {
        return {
            type: "tool-permission",
            priority: 2,
            data: pendingToolRequest[0]
        };
    }

    if (workerSandboxQueue[0]) {
        return {
            type: "worker-sandbox-permission",
            priority: 3,
            data: workerSandboxQueue[0]
        };
    }

    if (elicitation.queue[0]) {
        return {
            type: "elicitation",
            priority: 4,
            data: elicitation.queue[0]
        };
    }

    return null;
}
```

### 2.2 Permission Dialog Options

**Options presented to user:**

| Option | Effect | Stored As |
|--------|--------|-----------|
| "Yes, always" | Permanently allow this tool/pattern | Added to `allowedTools` |
| "Yes, this time" | Allow once | Temporary approval |
| "No, this time" | Deny once | Temporary denial |
| "No, always" | Permanently deny | Added to `deniedTools` |

**Permission Result Structure:**

```javascript
// ============================================
// Permission Result - Returned from permission check
// ============================================

interface PermissionResult {
    behavior: "allow" | "deny" | "ask";
    message?: string;              // Denial reason (if behavior="deny")
    updatedInput?: object;         // Hook-modified input (if applicable)
    decisionReason?: {
        type: "hook" | "user" | "rule";
        hookName?: string;
        reason?: string;
    };
}
```

---

## 3. Tool Result Rendering

### 3.1 Success Result Rendering

**What it does:**
Renders successful tool execution results with proper formatting for different content types (text, images, structured data).

**How it works:**
1. Check tool result content type
2. Apply appropriate formatting (code blocks, images, etc.)
3. Handle truncation for large outputs
4. Include metadata for debugging

```javascript
// ============================================
// renderToolResultMessage - Success result display
// ============================================

function renderToolResultMessage(toolResult, toolUseId, tool) {
    const { content, is_error } = toolResult;

    // Format based on content type
    if (typeof content === "string") {
        // Text content - check for truncation
        if (content.length > MAX_DISPLAY_LENGTH) {
            return {
                type: "tool_result",
                content: content.slice(0, MAX_DISPLAY_LENGTH) + "\n... [truncated]",
                is_error,
                tool_use_id: toolUseId,
                truncated: true,
                fullLength: content.length
            };
        }

        return {
            type: "tool_result",
            content,
            is_error,
            tool_use_id: toolUseId
        };
    }

    // Structured content (arrays, objects)
    if (Array.isArray(content)) {
        return {
            type: "tool_result",
            content: formatArrayContent(content),
            is_error,
            tool_use_id: toolUseId
        };
    }

    // Default JSON formatting
    return {
        type: "tool_result",
        content: JSON.stringify(content, null, 2),
        is_error,
        tool_use_id: toolUseId
    };
}
```

### 3.2 Error Result Rendering

**What it does:**
Renders error tool results with proper error formatting and diagnostic information.

**Error Types:**

| Error Type | Content Format | Example |
|------------|----------------|---------|
| `InputValidationError` | Zod error details | "InputValidationError: file_path is required" |
| `PermissionDenied` | User denial message | "Permission denied: Bash command not allowed" |
| `ToolExecutionError` | Error from tool | "Error: File not found: /path/to/file" |
| `ToolNotFoundError` | Unknown tool | "Error: No such tool available: UnknownTool" |
| `Cancelled` | Abort message | "Tool execution cancelled by user" |

```javascript
// ============================================
// Error result format
// ============================================

// Input validation error
{
    type: "tool_result",
    content: `<tool_use_error>InputValidationError: ${errorMessage}</tool_use_error>`,
    is_error: true,
    tool_use_id: toolUseId
}

// Permission denied
{
    type: "tool_result",
    content: `<tool_use_error>${permissionMessage}</tool_use_error>`,
    is_error: true,
    tool_use_id: toolUseId
}

// Tool not found
{
    type: "tool_result",
    content: `<tool_use_error>Error: No such tool available: ${toolName}</tool_use_error>`,
    is_error: true,
    tool_use_id: toolUseId
}

// Cancelled
{
    type: "tool_result",
    content: "Tool execution cancelled",  // From QT6(R96)
    is_error: false,  // Not an error - user cancelled
    tool_use_id: toolUseId
}
```

---

## 4. Progress Tracking UI

### 4.1 AsyncQueue (Pi6)

**What it does:**
Provides an async queue for streaming tool execution results back to the UI as they become available.

**How it works:**
1. Creates a queue that can be asynchronously iterated
2. Allows enqueuing results as they're produced
3. Supports error handling and completion signaling

```javascript
// ============================================
// AsyncQueue - Streaming results queue
// Location: chunks.*.mjs (imported in ZxY)
// ============================================

class AsyncQueue {
    constructor() {
        this.queue = [];
        this.pendingResolve = null;
        this.pendingReject = null;
        this.done = false;
        this.error = null;
    }

    enqueue(item) {
        if (this.done || this.error) {
            throw new Error("Queue is closed");
        }

        if (this.pendingResolve) {
            // Consumer is waiting - resolve immediately
            const resolve = this.pendingResolve;
            this.pendingResolve = null;
            this.pendingReject = null;
            resolve({ value: item, done: false });
        } else {
            // No consumer waiting - queue the item
            this.queue.push(item);
        }
    }

    error(err) {
        this.error = err;
        if (this.pendingReject) {
            const reject = this.pendingReject;
            this.pendingResolve = null;
            this.pendingReject = null;
            reject(err);
        }
    }

    finish() {
        this.done = true;
        if (this.pendingResolve) {
            const resolve = this.pendingResolve;
            this.pendingResolve = null;
            this.pendingReject = null;
            resolve({ value: undefined, done: true });
        }
    }

    [Symbol.asyncIterator]() {
        return {
            next: () => {
                if (this.queue.length > 0) {
                    return Promise.resolve({ value: this.queue.shift(), done: false });
                }

                if (this.error) {
                    return Promise.reject(this.error);
                }

                if (this.done) {
                    return Promise.resolve({ value: undefined, done: true });
                }

                // Wait for next item
                return new Promise((resolve, reject) => {
                    this.pendingResolve = resolve;
                    this.pendingReject = reject;
                });
            }
        };
    }
}
```

### 4.2 Progress Callback Flow

```
Tool execution starts
    │
    ├─→ Progress callback registered
    │
    ├─→ Tool reports progress (e.g., file read percentage)
    │     │
    │     ├─→ createProgressMessage called
    │     ├─→ AsyncQueue.enqueue
    │     └─→ UI receives progress update
    │
    ├─→ Tool completes
    │     │
    │     └─→ Final result enqueued
    │
    └─→ AsyncQueue.done() called
          │
          └─→ UI iteration completes
```

---

## 5. Tool Use Block Rendering

### 5.1 Tool Use Header

**What it does:**
Renders the header portion of a tool_use block, showing the tool name, status indicator, and timing information.

**Header States:**

| State | Indicator | Description |
|-------|-----------|-------------|
| `pending` | Spinner | Tool execution in progress |
| `success` | ✓ checkmark | Tool completed successfully |
| `error` | ✗ cross | Tool execution failed |
| `cancelled` | ⊘ circle | Tool was cancelled |

### 5.2 Input Preview

**What it does:**
Shows a preview of the tool input parameters for context.

**Preview Truncation:**

```javascript
// Maximum input preview length
const MAX_INPUT_PREVIEW = 500;

function formatInputPreview(input, toolName) {
    let preview;

    if (typeof input === "string") {
        preview = input;
    } else {
        preview = JSON.stringify(input, null, 2);
    }

    if (preview.length > MAX_INPUT_PREVIEW) {
        return preview.slice(0, MAX_INPUT_PREVIEW) + "\n...";
    }

    return preview;
}
```

---

## 6. Cross-Module UI Integration

### 6.1 Tools ↔ System Reminder UI

**Attachment Rendering Flow:**

```
Tool execution generates attachment
    │
    ├─→ f4 (createAttachmentMessage)
    │
    ├─→ Wrapped in p1 (createUserMessage) with isMeta: true
    │
    └─→ Included in conversation context
          │
          ├─→ Shown as system message in UI
          └─→ Included in LLM context (if not meta)
```

### 6.2 Tools ↔ MCP UI

**MCP Tool Rendering:**

- MCP tools use the same rendering pipeline as built-in tools
- Tool name displayed as `mcp__<server>__<tool>`
- MCP-specific metadata shown in tooltip (server name, transport type)

### 6.3 Tools ↔ Hooks UI

**Hook Result Rendering:**

| Hook Result Type | UI Display |
|------------------|------------|
| `hook_additional_context` | Inline context block |
| `hook_blocking_error` | Error message with hook name |
| `hook_cancelled` | Cancelled indicator |
| `hook_error_during_execution` | Error with stack trace (debug mode) |

---

## Validation Summary

| Component | Status | Notes |
|-----------|--------|-------|
| createUserMessage (p1) | ✅ Verified | chunks.173.mjs:1378 |
| createProgressMessage (C4q) | ✅ Verified | chunks.146.mjs |
| createAttachmentMessage (f4) | ✅ Verified | chunks.*.mjs |
| AsyncQueue (Pi6) | ✅ Verified | chunks.*.mjs |
| Modal Priority | ✅ Verified | UI layer |
| Permission Dialog | ✅ Verified | UI layer |

---

## Quick Reference

### Message Types

```javascript
// Tool result
{ type: "tool_result", content: "...", is_error: false, tool_use_id: "..." }

// Progress update
{ type: "progress", toolUseID: "...", data: {...} }

// Attachment (hook result)
{ type: "attachment", attachment: { type: "hook_additional_context", ... } }

// Error
{ type: "tool_result", content: "<tool_use_error>...</tool_use_error>", is_error: true }
```

### Modal Priority Order

1. sandbox-permission (highest)
2. tool-permission
3. worker-sandbox-permission
4. elicitation (lowest)