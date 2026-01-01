# Real-Time Steering Mechanism

> Symbol mappings:
> - [symbol_index_core.md](../00_overview/symbol_index_core.md) - Core modules
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Infrastructure modules

## Overview

Claude Code implements multiple mechanisms to guide and steer the model's behavior during execution. These mechanisms inject context, reminders, and instructions at various points in the conversation without the user seeing them directly.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Real-Time Steering Layers                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Layer 1: System Reminder Injection (gQA)                 │  │
│  │  - <system-reminder> tags                                │  │
│  │  - User context (claudeMd, gitStatus)                    │  │
│  │  - Prepended to message stream                           │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Layer 2: System Prompt Augmentation                      │  │
│  │  - appendSystemPrompt CLI flag                           │  │
│  │  - Plan mode instructions                                 │  │
│  │  - Permission mode context                                │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Layer 3: Context Modifiers (VX0)                         │  │
│  │  - Runtime context updates                               │  │
│  │  - Tool-triggered modifications                          │  │
│  │  - State changes during execution                        │  │
│  └────────────────────────────┬─────────────────────────────┘  │
│                               │                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Layer 4: Hook-Based Injection                            │  │
│  │  - SessionStart hooks                                    │  │
│  │  - hook_additional_context attachments                   │  │
│  │  - Custom steering via hooks                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. System Reminder Injection

The primary steering mechanism uses `<system-reminder>` XML tags to inject context that is visible to the model but hidden from the user.

### User Context Injection

```javascript
// ============================================
// injectSystemContext - Add user context as system reminder
// Location: chunks.146.mjs:989-1003
// ============================================

// ORIGINAL (for source lookup):
function gQA(A, Q) {
  if (Object.entries(Q).length === 0) return A;
  return [R0({
    content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(Q).map(([B,G])=>`# ${B}
${G}`).join(`
`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
    isMeta: !0
  }), ...A]
}

// READABLE (for understanding):
function injectSystemContext(messages, userContext) {
  // Skip if no context to inject
  if (Object.entries(userContext).length === 0) {
    return messages;
  }

  // Build context sections
  let contextSections = Object.entries(userContext)
    .map(([key, value]) => `# ${key}\n${value}`)
    .join('\n');

  // Create system reminder message
  let reminderMessage = createUserMessage({
    content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${contextSections}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
    isMeta: true  // Marked as metadata, not shown to user
  });

  // Prepend to message stream
  return [reminderMessage, ...messages];
}

// Mapping: gQA→injectSystemContext, R0→createUserMessage, A→messages, Q→userContext
```

**What gets injected:**
- `claudeMd` - Contents of CLAUDE.md file
- `gitStatus` - Current git status output
- Other context fields as configured

### System Context Combination

```javascript
// ============================================
// combineSystemContext - Merge system context entries
// Location: chunks.146.mjs:984-987
// ============================================

// ORIGINAL (for source lookup):
function LX9(A, Q) {
  return [...A, Object.entries(Q).map(([B, G]) => `${B}: ${G}`).join(`\n`)].filter(Boolean)
}

// READABLE (for understanding):
function combineSystemContext(systemPromptParts, systemContext) {
  let contextString = Object.entries(systemContext)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return [...systemPromptParts, contextString].filter(Boolean);
}

// Mapping: LX9→combineSystemContext
```

---

## 2. Append System Prompt

The CLI supports injecting additional system prompts via flags.

### CLI Flags

```
--append-system-prompt "<inline text>"
--append-system-prompt-file "<path to file>"
```

These are processed during initialization and appended to the base system prompt.

### Flow

```
CLI Arguments
     │
     ▼
Parse --append-system-prompt and --append-system-prompt-file
     │
     ▼
Load file content if path provided
     │
     ▼
Append to system prompt array
     │
     ▼
System prompt sent to API
```

---

## 3. Context Modifiers

Context modifiers allow tools to update the execution context in real-time during streaming.

### Context Modifier Pattern

```javascript
// ============================================
// applyContextModifiers - Apply tool-triggered context changes
// Location: chunks.146.mjs:2122-2140 (within VX0)
// ============================================

// READABLE pseudocode:
async function* applyContextModifiers(toolUseBlocks, context, results) {
  let pendingModifiers = {};

  // Collect context modifiers from tool results
  for await (let result of results) {
    if (result.contextModifier) {
      let { toolUseID, modifyContext } = result.contextModifier;
      if (!pendingModifiers[toolUseID]) {
        pendingModifiers[toolUseID] = [];
      }
      pendingModifiers[toolUseID].push(modifyContext);
    }
    yield result;
  }

  // Apply all modifiers after batch completes
  let currentContext = context;
  for (let block of toolUseBlocks) {
    let modifiers = pendingModifiers[block.id];
    if (!modifiers) continue;
    for (let modifier of modifiers) {
      currentContext = modifier(currentContext);  // <-- Context mutation
    }
  }

  yield { newContext: currentContext };
}
```

**Use Cases:**
- Read tool updates `readFileState` with file content
- Edit tool clears stale `readFileState` entries
- Tools can add data to context for later use

---

## 4. Hook-Based Context Injection

SessionStart hooks can inject additional context at the beginning of a session.

### Hook Additional Context

```javascript
// ============================================
// SessionStart Hook Context Injection
// Location: chunks.107.mjs:1100-1104
// ============================================

// READABLE pseudocode:
function processSessionStartHookResult(hookResult, hookName) {
  if (hookResult.additionalContext) {
    return createAttachment({
      type: "hook_additional_context",
      hookName: hookName,
      event: "SessionStart",
      content: hookResult.additionalContext
    });
  }
  return null;
}
```

### Hook Result Structure

```typescript
interface SessionStartHookResult {
  additionalContext?: string;  // Injected as context
  // ... other fields
}
```

---

## 5. Steering Attachment Resending

Pending steering attachments can be resent during the conversation.

```javascript
// ============================================
// resendSteeringAttachments - Re-inject pending attachments
// Location: chunks.146.mjs:1979-2014
// ============================================

// ORIGINAL (for source lookup):
async function* gk3(A, Q) {
  for (let B of A) {
    if (B.type === "attachment" && B.attachment.type === "queued_command") {
      yield {
        type: "attachment",
        attachment: {
          type: B.attachment.type,
          prompt: B.attachment.prompt
        }
      };
    }
  }
}

// READABLE (for understanding):
async function* resendSteeringAttachments(pendingAttachments, context) {
  for (let attachment of pendingAttachments) {
    if (attachment.type === "attachment" && attachment.attachment.type === "queued_command") {
      yield {
        type: "attachment",
        attachment: {
          type: attachment.attachment.type,
          prompt: attachment.attachment.prompt
        }
      };
    }
  }
}

// Mapping: gk3→resendSteeringAttachments
```

---

## 6. Plan Mode Steering

When in plan mode, additional instructions are injected to constrain the model's behavior.

### Plan Mode Instructions

Plan mode injects instructions that:
1. Restrict the model to read-only operations
2. Require plan file writing before implementation
3. Enforce user approval workflow

```javascript
// Plan mode steering is injected via:
// 1. System prompt augmentation (plan mode instructions)
// 2. System reminders (current plan state)
// 3. Tool restrictions (read-only tools only)
```

---

## 7. Permission Mode Context

The current permission mode (`ask`, `allow`, `deny`, `bypass`) affects how the model approaches tool usage.

```javascript
// Location: chunks.146.mjs:1789-1794
let permissionMode = appState.toolPermissionContext.mode;
let model = selectModel({
  permissionMode: permissionMode,
  mainLoopModel: toolUseContext.options.mainLoopModel,
  exceeds200kTokens: permissionMode === "plan" && contextExceeds200k(messages)
});
```

---

## Steering Flow Diagram

```
User Message Submitted
         │
         ▼
┌─────────────────────────────────────┐
│  1. Load User Context               │
│  (claudeMd, gitStatus, etc.)        │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  2. Inject System Reminders (gQA)   │
│  <system-reminder>...</system-reminder>
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  3. Combine System Prompt (LX9)     │
│  Base + Append + Context            │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  4. Send to API                     │
│  (Model receives steered context)   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  5. Tool Execution                  │
│  (Context modifiers applied)        │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  6. Hook Triggers                   │
│  (Additional context injection)     │
└─────────────────────────────────────┘
```

---

## Key Functions Summary

| Function | Obfuscated | Location | Purpose |
|----------|------------|----------|---------|
| injectSystemContext | gQA | chunks.146.mjs:989-1003 | Add user context as system reminder |
| combineSystemContext | LX9 | chunks.146.mjs:984-987 | Merge system context entries |
| resendSteeringAttachments | gk3 | chunks.146.mjs:1979-2014 | Re-inject pending attachments |

---

## Steering vs User-Visible Messages

| Aspect | User-Visible | Steering (Hidden) |
|--------|--------------|-------------------|
| Display | Shown in UI | Hidden from user |
| Purpose | User communication | Model guidance |
| `isMeta` flag | `false` | `true` |
| Examples | User input, assistant output | System reminders, context injection |

**Key insight:** Messages with `isMeta: true` are visible to the model but hidden from the user interface. This allows the system to guide model behavior without cluttering the user's view.
