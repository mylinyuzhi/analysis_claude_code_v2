# System Reminder Types: Hooks & Async Responses

> **Module**: System Reminders - Hook Types
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.173.mjs:1058-1105`, `chunks.142.mjs:2758-2789`

---

## Table of Contents

- [Overview](#overview)
- [async_hook_response](#async_hook_response)
- [hook_blocking_error](#hook_blocking_error)
- [hook_success](#hook_success)
- [hook_additional_context](#hook_additional_context)
- [hook_stopped_continuation](#hook_stopped_continuation)
- [New Hook Types (v2.1.76)](#new-hook-types-v2176)
  - [post_compact](#post_compact)
  - [elicitation](#elicitation)
  - [elicitation_result](#elicitation_result)
  - [instructions_loaded](#instructions_loaded)
  - [config_change](#config_change)
  - [worktree_create](#worktree_create)
  - [worktree_remove](#worktree_remove)
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

**v2.1.76 additions:**

6. **post_compact** - PostCompact hook event fired after auto-compaction
7. **elicitation** - Elicitation hook event from MCP server
8. **elicitation_result** - Elicitation result returned by user
9. **instructions_loaded** - InstructionsLoaded hook fires when skill instructions load
10. **config_change** - ConfigChange hook fires when configuration changes at runtime
11. **worktree_create** - WorktreeCreate hook fires when a git worktree is created
12. **worktree_remove** - WorktreeRemove hook fires when a git worktree is removed

Plus several silent types for internal state tracking.

---

## Trigger Source Summary

Each hook type has a specific producer function with distinct trigger conditions:

| Type | Producer Function | Location | Key Trigger Logic |
|------|-------------------|----------|-------------------|
| `async_hook_response` | `EIY` (getAsyncHookResponsesAttachment) | chunks.142.mjs:2758-2789 | `Jn7()` returns pending responses |
| `hook_blocking_error` | Created in hook execution pipeline | chunks.149.mjs | Hook returns `block: true` |
| `hook_success` | Created in hook execution pipeline | chunks.149.mjs | Hook returns `status: "success"` |
| `hook_additional_context` | Created in hook execution pipeline | chunks.149.mjs | Hook returns `context: string` |
| `post_compact` | Created after compaction completes | chunks.146.mjs | Compaction finished, PostCompact hooks pending |
| `elicitation` | Created when MCP elicitation starts | chunks.149.mjs | MCP server sends elicitation request |
| `elicitation_result` | Created when user responds | chunks.149.mjs | User completes elicitation |
| `instructions_loaded` | Created on skill load | chunks.142.mjs | Skill instructions loaded via invoked_skills |
| `config_change` | Created on config change | chunks.149.mjs | Runtime configuration update detected |
| `worktree_create` | Created on worktree creation | chunks.149.mjs | `git worktree add` called |
| `worktree_remove` | Created on worktree removal | chunks.149.mjs | `git worktree remove` called |

### Hook Response Registry

The `async_hook_response` type pulls from a registry:

```javascript
// Location: chunks.142.mjs:2759
let pendingResponses = await getPendingHookResponses();  // Jn7()

// After delivery, clean up registry
if (pendingResponses.length > 0) {
    let processIds = pendingResponses.map(r => r.processId);
    removeDeliveredHooks(processIds);  // Xn7()
}
```

### Hook Response Structure

```javascript
// Location: chunks.142.mjs:2762-2782
{
    type: "async_hook_response",
    processId: string,       // Process ID of hook execution
    hookName: string,        // Name of the hook that ran
    hookEvent: string,       // Event that triggered hook
    toolName: string,        // Tool that triggered the hook
    response: object,        // Hook response object
    stdout: string,          // stdout from hook process
    stderr: string,          // stderr from hook process
    exitCode: number         // Exit code of hook process
}
```

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

    if (response.systemMessage) {
        messages.push(createUserMessage({
            content: response.systemMessage,
            isMeta: true
        }));
    }

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
    if (attachment.hookEvent !== "SessionStart" &&
        attachment.hookEvent !== "UserPromptSubmit") {
        return [];
    }

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

## New Hook Types (v2.1.76)

Seven new hook event types were introduced in v2.1.76, corresponding to new lifecycle points in the Claude Code session.

---

### post_compact

**What It Does:**

Fires after auto-compaction completes. Allows hooks and the system to inject relevant context into the freshly compacted session. The attachment carries information about what was compacted, enabling the model to understand that context was summarized.

**How it works:**

When `autoCompactDispatcher` (sI2) completes a compaction cycle, it fires the `PostCompact` hook event. Any registered PostCompact hooks run and their results are collected as `post_compact` attachments that get normalized and injected at the start of the new compacted context.

**Triggered When:**

| Condition | Requirement |
|-----------|-------------|
| Compaction completed | Auto-compact or manual compact ran |
| PostCompact hooks registered | User has configured PostCompact hook scripts |

**Output Format:**

```markdown
<system-reminder>
[PostCompact hook output content]
</system-reminder>
```

**Key Insight:** PostCompact hooks provide an extension point for workflows that need to do cleanup or re-initialization after context is summarized. For example, a hook might re-inject key project context that was in the compacted portion.

---

### elicitation

**What It Does:**

Delivers an elicitation prompt from an MCP server to the model. Elicitation is the MCP protocol mechanism for a server to interactively request information from the user.

**How it works:**

When an MCP server sends an elicitation request (via the `elicitation/create` MCP method), the system creates an `elicitation` attachment. The model reads this and understands that it must present the elicitation UI to the user and collect a response.

**Triggered When:**

| Condition | Requirement |
|-----------|-------------|
| MCP elicitation request | Server calls elicitation/create |
| Connected MCP server | The requesting server must be connected |

**Output Format:**

```markdown
<system-reminder>
MCP server "[server-name]" is requesting information via elicitation:
[Elicitation title/prompt content]
[Schema/form definition]
</system-reminder>
```

**Key Insight:** The elicitation mechanism bridges MCP server-side workflows with user interaction. The model acts as an intermediary, presenting the elicitation UI and routing the result back to the MCP server as an `elicitation_result`.

---

### elicitation_result

**What It Does:**

Delivers the user's response to an elicitation request. After the user fills in the elicitation form/prompt, the result is injected back into the conversation for the model to process and forward to the originating MCP server.

**Triggered When:**

| Condition | Requirement |
|-----------|-------------|
| User responded | User completed the elicitation UI |
| Pending elicitation | An active elicitation was awaiting response |

**Output Format:**

```markdown
<system-reminder>
Elicitation result from user for "[elicitation-title]":
[User response data as structured output]
</system-reminder>
```

---

### instructions_loaded

**What It Does:**

Fires when skill instructions are loaded into the conversation (via the `invoked_skills` attachment mechanism). This hook event allows hook scripts to react to skill loading -- for example, logging which skills are active, validating skill content, or supplementing the instructions with additional context.

**Triggered When:**

| Condition | Requirement |
|-----------|-------------|
| Skill invoked | User invoked a skill via `/skill-name` |
| Instructions loaded | The skill's SKILL.md content was loaded |

**Integration with `invoked_skills`:**

When the `skill_listing` or `invoked_skills` attachment is produced and includes skill content, the `InstructionsLoaded` hook fires with the skill name and content. Any hook script registered for `InstructionsLoaded` can inspect or react to this event. The hook result comes back as an `instructions_loaded` attachment.

**Output Format:**

```markdown
<system-reminder>
[InstructionsLoaded hook output]
</system-reminder>
```

**Key Insight:** The `InstructionsLoaded` hook was designed to support enterprise scenarios where organizations want to audit or extend the instructions loaded into the model's context. It fires for both built-in skills and custom plugin skills.

**v2.1.76 significance:** Combined with the `CLAUDE_SKILL_DIR` environment variable support in `skill_listing`, this enables a full lifecycle for custom skill management: discover skills from custom directories, load them, and hook into the loading event.

---

### config_change

**What It Does:**

Notifies the model when Claude Code's configuration changes at runtime. This allows the model to be aware of changes such as permission mode switches, MCP server connections/disconnections, or settings updates without requiring a full session restart.

**Triggered When:**

| Condition | Requirement |
|-----------|-------------|
| Config updated | Runtime configuration change detected |
| ConfigChange hook registered | User has configured ConfigChange hook scripts |

**Output Format:**

```markdown
<system-reminder>
Configuration changed: [description of what changed]
[New configuration details relevant to the model]
</system-reminder>
```

**Key Insight:** Config changes in v2.1.76 include MCP server hot-reload, permission mode changes via API, and settings file updates. The `config_change` attachment ensures the model's understanding of available tools and permissions stays current.

---

### worktree_create

**What It Does:**

Fires when a new git worktree is created within the session. Provides the model with context about the new worktree so it can properly navigate and work within multi-worktree repository layouts.

**Triggered When:**

| Condition | Requirement |
|-----------|-------------|
| Worktree created | `git worktree add` was called (via Bash tool or externally) |
| WorktreeCreate hook registered | User has configured WorktreeCreate hook scripts |

**Structure:**

```javascript
{
    type: "worktree_create",
    worktreePath: string,   // Absolute path to new worktree
    branch: string,         // Branch checked out in worktree
    mainWorktreePath: string // Absolute path to main worktree
}
```

**Output Format:**

```markdown
<system-reminder>
A new git worktree was created at: /path/to/new-worktree (branch: feature/new-branch)
Main worktree is at: /path/to/main-worktree
[WorktreeCreate hook output if any]
</system-reminder>
```

**Key Insight:** Multi-worktree workflows in Claude Code allow the agent to work on multiple branches simultaneously without switching branches. The `worktree_create` and `worktree_remove` hooks are key to keeping the model informed about the active worktree topology.

---

### worktree_remove

**What It Does:**

Fires when a git worktree is removed. Notifies the model that a worktree is no longer accessible, preventing it from trying to use paths that no longer exist.

**Triggered When:**

| Condition | Requirement |
|-----------|-------------|
| Worktree removed | `git worktree remove` was called |
| WorktreeRemove hook registered | User has configured WorktreeRemove hook scripts |

**Output Format:**

```markdown
<system-reminder>
The git worktree at /path/to/removed-worktree has been removed.
[WorktreeRemove hook output if any]
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
| PostCompact result | `post_compact` | Visible |
| Elicitation request | `elicitation` | Visible |
| Elicitation response | `elicitation_result` | Visible |
| Instructions loaded | `instructions_loaded` | Visible |
| Config change | `config_change` | Visible |
| Worktree created | `worktree_create` | Visible |
| Worktree removed | `worktree_remove` | Visible |

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
