# System Reminder Types: Hooks & Async Responses

> **Module**: System Reminders - Hook Types
> **Version**: Claude Code 2.1.38
> **Source**: `chunks.173.mjs:1058-1105`, `chunks.142.mjs:2758-2789`

---

## Table of Contents

- [Overview](#overview)
- [async_hook_response](#async_hook_response)
- [hook_blocking_error](#hook_blocking_error)
- [hook_success](#hook_success)
- [hook_additional_context](#hook_additional_context)
- [hook_stopped_continuation](#hook_stopped_continuation)
- [Silent Hook Types](#silent-hook-types)
- [Hook Response Flow](#hook-response-flow)

---

## Overview

Hook types deliver results from the hooks system back to the LLM:

1. **async_hook_response** - Response from async hook execution
2. **hook_blocking_error** - Hook that blocked an action
3. **hook_success** - Hook executed successfully
4. **hook_additional_context** - Hook provided extra context
5. **hook_stopped_continuation** - Hook stopped continuation

Plus several silent types for internal state tracking.

---

## async_hook_response

### What It Does

Delivers responses from asynchronously executed hooks. This is the primary mechanism for hooks to communicate results back to the LLM.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Hook completed | Async hook process finished |
| Response available | Hook produced output |
| In registry | Response stored in hook registry |

### Source Code

#### Producer Function

```javascript
// ============================================
// getAsyncHookResponsesAttachment - Get pending hook responses
// Location: chunks.142.mjs:2758-2789
// ============================================

// ORIGINAL (for source lookup):
async function EIY() {
    let A = await Jn7();
    if (A.length === 0) return [];
    h(`Hooks: getAsyncHookResponseAttachments found ${A.length} responses`);
    let q = A.map(({
        processId: K,
        response: Y,
        hookName: z,
        hookEvent: w,
        toolName: H,
        stdout: $,
        stderr: O,
        exitCode: _
    }) => {
        return h(`Hooks: Creating attachment for ${K} (${z}): ${Q1(Y)}`), {
            type: "async_hook_response",
            processId: K,
            hookName: z,
            hookEvent: w,
            toolName: H,
            response: Y,
            stdout: $,
            stderr: O,
            exitCode: _
        }
    });
    if (A.length > 0) {
        let K = A.map((Y) => Y.processId);
        Xn7(K), h(`Hooks: Removed ${K.length} delivered hooks from registry`)
    }
    return h(`Hooks: getAsyncHookResponseAttachments found ${q.length} attachments`), q
}

// READABLE (for understanding):
async function getAsyncHookResponsesAttachment() {
    // Get pending hook responses from registry
    let pendingResponses = await getPendingHookResponses();
    if (pendingResponses.length === 0) return [];

    debugLog(`Hooks: getAsyncHookResponseAttachments found ${pendingResponses.length} responses`);

    let attachments = pendingResponses.map(({
        processId,
        response,
        hookName,
        hookEvent,
        toolName,
        stdout,
        stderr,
        exitCode
    }) => {
        debugLog(`Hooks: Creating attachment for ${processId} (${hookName}): ${truncate(response)}`);

        return {
            type: "async_hook_response",
            processId: processId,
            hookName: hookName,
            hookEvent: hookEvent,
            toolName: toolName,
            response: response,
            stdout: stdout,
            stderr: stderr,
            exitCode: exitCode
        };
    });

    // Remove delivered responses from registry
    if (pendingResponses.length > 0) {
        let processIds = pendingResponses.map(r => r.processId);
        removeDeliveredResponses(processIds);
        debugLog(`Hooks: Removed ${processIds.length} delivered hooks from registry`);
    }

    debugLog(`Hooks: getAsyncHookResponseAttachments found ${attachments.length} attachments`);
    return attachments;
}

// Mapping: EIY→getAsyncHookResponsesAttachment, A→pendingResponses, q→attachments, K→processId, Y→response, z→hookName, w→hookEvent, H→toolName, $→stdout, O→stderr, _→exitCode, Jn7→getPendingHookResponses, Xn7→removeDeliveredResponses, h→debugLog, Q1→truncate
```

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - async_hook_response case
// Location: chunks.173.mjs:1058-1069
// ============================================

// ORIGINAL (for source lookup):
case "async_hook_response": {
    let K = A.response,
        Y = [];
    if (K.systemMessage) Y.push(c6({
        content: K.systemMessage,
        isMeta: !0
    }));
    if (K.hookSpecificOutput && "additionalContext" in K.hookSpecificOutput && K.hookSpecificOutput.additionalContext) Y.push(c6({
        content: K.hookSpecificOutput.additionalContext,
        isMeta: !0
    }));
    return _9(Y)
}

// READABLE (for understanding):
case "async_hook_response": {
    let response = attachment.response;
    let messages = [];

    // Add system message if present
    if (response.systemMessage) {
        messages.push(createUserMessage({
            content: response.systemMessage,
            isMeta: true
        }));
    }

    // Add additional context from hook output
    if (response.hookSpecificOutput &&
        "additionalContext" in response.hookSpecificOutput &&
        response.hookSpecificOutput.additionalContext) {
        messages.push(createUserMessage({
            content: response.hookSpecificOutput.additionalContext,
            isMeta: true
        }));
    }

    return wrapWithSystemReminderTags(messages);
}

// Mapping: A→attachment, K→response, Y→messages, c6→createUserMessage, _9→wrapWithSystemReminderTags
```

### Output Format

```markdown
<system-reminder>
[Hook system message here]

[Additional context from hook]
</system-reminder>
```

### Key Insight

The `async_hook_response` can produce **multiple messages** if the hook provides both a `systemMessage` and `additionalContext`.

---

## hook_blocking_error

### What It Does

Notifies the LLM that a hook blocked an action with an error. This prevents the action from being taken.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Hook blocks | Hook returns blocking error |
| Blocking mode | Hook configured to block on error |

### Source Code

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - hook_blocking_error case
// Location: chunks.173.mjs:1081-1085
// ============================================

// ORIGINAL (for source lookup):
case "hook_blocking_error":
    return [c6({
        content: tI(`${A.hookName} hook blocking error from command: "${A.blockingError.command}": ${A.blockingError.blockingError}`),
        isMeta: !0
    })];

// READABLE (for understanding):
case "hook_blocking_error":
    return [createUserMessage({
        content: wrapInXmlTag(`${attachment.hookName} hook blocking error from command: "${attachment.blockingError.command}": ${attachment.blockingError.blockingError}`),
        isMeta: true
    })];

// Mapping: A→attachment, tI→wrapInXmlTag, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
pre-commit hook blocking error from command: "npm run lint": Found 3 linting errors
</system-reminder>
```

### Key Insight

Blocking errors are **critical** - they prevent the action from being executed. The LLM must address the issue before proceeding.

---

## hook_success

### What It Does

Notifies the LLM that a hook executed successfully with output content.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Hook success | Hook executed without errors |
| Has content | Hook produced non-empty content |
| SessionStart or UserPromptSubmit | Only these events produce visible messages |

### Source Code

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - hook_success case
// Location: chunks.173.mjs:1086-1092
// ============================================

// ORIGINAL (for source lookup):
case "hook_success":
    if (A.hookEvent !== "SessionStart" && A.hookEvent !== "UserPromptSubmit") return [];
    if (A.content === "") return [];
    return [c6({
        content: tI(`${A.hookName} hook success: ${A.content}`),
        isMeta: !0
    })];

// READABLE (for understanding):
case "hook_success":
    // Only show for specific hook events
    if (attachment.hookEvent !== "SessionStart" &&
        attachment.hookEvent !== "UserPromptSubmit") {
        return [];
    }

    // Skip empty content
    if (attachment.content === "") return [];

    return [createUserMessage({
        content: wrapInXmlTag(`${attachment.hookName} hook success: ${attachment.content}`),
        isMeta: true
    })];

// Mapping: A→attachment, tI→wrapInXmlTag, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
session-start hook success: Environment loaded successfully
</system-reminder>
```

### Key Insight

Success messages are only shown for `SessionStart` and `UserPromptSubmit` events. Other hook events (like `PreToolUse`, `PostToolUse`) produce silent success.

---

## hook_additional_context

### What It Does

Provides additional context from a hook that doesn't block but adds information.

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Hook output | Hook provided additional context |
| Non-empty content | Context array is not empty |

### Source Code

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - hook_additional_context case
// Location: chunks.173.mjs:1093-1099
// ============================================

// ORIGINAL (for source lookup):
case "hook_additional_context": {
    if (A.content.length === 0) return [];
    return [c6({
        content: tI(`${A.hookName} hook additional context: ${A.content.join(`
`)}`),
        isMeta: !0
    })]
}

// READABLE (for understanding):
case "hook_additional_context": {
    if (attachment.content.length === 0) return [];

    return [createUserMessage({
        content: wrapInXmlTag(`${attachment.hookName} hook additional context: ${attachment.content.join('\n')}`),
        isMeta: true
    })];
}

// Mapping: A→attachment, tI→wrapInXmlTag, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
pre-tool-use hook additional context: Remember to check file permissions before editing
Always run tests after changes
</system-reminder>
```

---

## hook_stopped_continuation

### What It Does

Notifies the LLM that a hook stopped the continuation of work (similar to blocking but for ongoing operations).

### Triggered When

| Condition | Requirement |
|-----------|-------------|
| Hook stops | Hook returned stop signal |
| Has message | Stop message is present |

### Source Code

#### Normalization Function

```javascript
// ============================================
// normalizeAttachmentForAPI - hook_stopped_continuation case
// Location: chunks.173.mjs:1101-1105
// ============================================

// ORIGINAL (for source lookup):
case "hook_stopped_continuation":
    return [c6({
        content: tI(`${A.hookName} hook stopped continuation: ${A.message}`),
        isMeta: !0
    })];

// READABLE (for understanding):
case "hook_stopped_continuation":
    return [createUserMessage({
        content: wrapInXmlTag(`${attachment.hookName} hook stopped continuation: ${attachment.message}`),
        isMeta: true
    })];

// Mapping: A→attachment, tI→wrapInXmlTag, c6→createUserMessage
```

### Output Format

```markdown
<system-reminder>
safety-check hook stopped continuation: Sensitive file access detected
</system-reminder>
```

---

## Silent Hook Types

These types return empty arrays from normalization - they exist only for internal state tracking:

### hook_cancelled

**Location:** `chunks.173.mjs:1121`

Hook was cancelled before completion.

```javascript
case "hook_cancelled":
    return [];  // Silent
```

### hook_error_during_execution

**Location:** `chunks.173.mjs:1122`

Hook encountered an error during execution (non-blocking).

```javascript
case "hook_error_during_execution":
    return [];  // Silent
```

### hook_non_blocking_error

**Location:** `chunks.173.mjs:1123`

Hook had an error but wasn't configured to block.

```javascript
case "hook_non_blocking_error":
    return [];  // Silent
```

### hook_system_message

**Location:** `chunks.173.mjs:1124`

Hook provided a system message (handled elsewhere).

```javascript
case "hook_system_message":
    return [];  // Silent
```

### hook_permission_decision

**Location:** `chunks.173.mjs:1126`

Hook made a permission decision.

```javascript
case "hook_permission_decision":
    return [];  // Silent
```

### structured_output

**Location:** `chunks.173.mjs:1125`

Structured output from hook (handled elsewhere).

```javascript
case "structured_output":
    return [];  // Silent
```

---

## Hook Response Flow

### Production Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Hook Execution (Async)                        │
│                       chunks.21_hook/                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ↓
                ┌───────────────────────┐
                │  Hook completes       │
                │  (success/error/stop) │
                └───────────┬───────────┘
                            │
                            ↓
                ┌───────────────────────┐
                │  Store in Registry    │
                │  (Jn7/getPending)     │
                └───────────┬───────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         getAsyncHookResponsesAttachment (EIY)                    │
│                 chunks.142.mjs:2758                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ↓
                ┌───────────────────────┐
                │  Create attachment    │
                │  { type: "async_      │
                │    hook_response" }   │
                └───────────┬───────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│        normalizeAttachmentForAPI (K2z)                           │
│                  chunks.173.mjs:1058                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ↓
                ┌───────────────────────┐
                │  Wrap in XML tags     │
                │  (_9)                 │
                └───────────┬───────────┘
                            │
                            ↓
                ┌───────────────────────┐
                │  Inject into          │
                │  conversation         │
                └───────────────────────┘
```

### Response Types by Hook Result

| Hook Result | Attachment Type | Visibility |
|-------------|-----------------|------------|
| Success (SessionStart/UserPromptSubmit) | `hook_success` | Visible |
| Success (other events) | Silent | Silent |
| Blocking Error | `hook_blocking_error` | Visible |
| Additional Context | `hook_additional_context` | Visible |
| Stop Continuation | `hook_stopped_continuation` | Visible |
| Cancelled | `hook_cancelled` | Silent |
| Non-blocking Error | `hook_non_blocking_error` | Silent |
| Permission Decision | `hook_permission_decision` | Silent |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions in this document:

- `getAsyncHookResponsesAttachment` (EIY) - Hook response producer, `chunks.142.mjs:2758-2789`
- `getPendingHookResponses` (Jn7) - Get pending responses from registry
- `removeDeliveredResponses` (Xn7) - Clear delivered responses
- `normalizeAttachmentForAPI` (K2z) - Main dispatcher, `chunks.173.mjs:698-1131`
- `wrapInXmlTag` (tI) - XML tag wrapper, `chunks.173.mjs:490-494`
- `createUserMessage` (c6) - Message factory

---

## Related Documents

- [README.md](./README.md) - Documentation index
- [implementation_details.md](./implementation_details.md) - Core implementation
- [types_silent.md](./types_silent.md) - Silent types including silent hook types