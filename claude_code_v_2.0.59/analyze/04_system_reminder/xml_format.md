# System Reminder XML Format Specification

## Overview

System reminders in Claude Code v2.0.59 use XML-style tags to wrap metadata and contextual information injected into the conversation. This document catalogs all XML formats used for system reminders.

---

## Core XML Wrapper Functions

### 1. Qu() - System Reminder Text Wrapper

**Location:** `chunks.153.mjs:2850-2854`

**Obfuscated Name:** `Qu`

**Readable Name:** `wrapSystemReminderText`

**Purpose:** Wraps text content in `<system-reminder>` XML tags

```javascript
// ============================================
// wrapSystemReminderText - Wrap text in XML tags
// Location: chunks.153.mjs:2850-2854
// ============================================

// ORIGINAL (for source lookup):
function Qu(A) { return `<system-reminder>\n${A}\n</system-reminder>` }

// READABLE (for understanding):
function wrapSystemReminderText(text) {
  return `<system-reminder>
${text}
</system-reminder>`
}

// Mapping: Qu→wrapSystemReminderText, A→text
```

**Output Format:**
```xml
<system-reminder>
[Content text here]
</system-reminder>
```

---

### 2. NG() - System Reminder Array Wrapper

**Location:** `chunks.153.mjs:2856-2883`

**Obfuscated Name:** `NG`

**Readable Name:** `wrapInSystemReminder`

**Purpose:** Wraps an array of message objects, applying `<system-reminder>` tags to all text content

```javascript
// ============================================
// wrapInSystemReminder - Wrap message array contents
// Location: chunks.153.mjs:2856-2883
// ============================================

// ORIGINAL (for source lookup):
function NG(A) {
  return A.map((Q) => {
    if (typeof Q.message.content === "string")
      return { ...Q, message: { ...Q.message, content: Qu(Q.message.content) } };
    else if (Array.isArray(Q.message.content)) {
      let B = Q.message.content.map((G) => {
        if (G.type === "text") return { ...G, text: Qu(G.text) };
        return G
      });
      return { ...Q, message: { ...Q.message, content: B } };
    }
    return Q
  })
}

// READABLE (for understanding):
function wrapInSystemReminder(messages) {
  return messages.map((message) => {
    // Case 1: String content - wrap directly
    if (typeof message.message.content === "string") {
      return {
        ...message,
        message: {
          ...message.message,
          content: wrapSystemReminderText(message.message.content)
        }
      };
    }
    // Case 2: Array content - wrap each text block
    else if (Array.isArray(message.message.content)) {
      let wrappedContent = message.message.content.map((block) => {
        if (block.type === "text") {
          return { ...block, text: wrapSystemReminderText(block.text) };
        }
        return block;  // non-text blocks unchanged (image, etc.)
      });
      return { ...message, message: { ...message.message, content: wrappedContent } };
    }
    return message;
  });
}

// Mapping: NG→wrapInSystemReminder, A→messages, Q→message, B→wrappedContent, G→block, Qu→wrapSystemReminderText
```

**Key Behavior:**
- Iterates through all messages in array
- Wraps string content directly with `Qu()` (wrapSystemReminderText)
- For array content, wraps only `type: "text"` blocks
- Leaves image and other block types unchanged

---

### 3. R0() - Meta Block Creator

**Location:** `chunks.153.mjs:2179-2204`

**Obfuscated Name:** `R0`

**Readable Name:** `createMetaBlock`

**Purpose:** Creates a user-role message with `isMeta: true` flag

```javascript
// ============================================
// createMetaBlock - Create metadata message block
// Location: chunks.153.mjs:2179-2204
// ============================================

// ORIGINAL (for source lookup):
function R0({ content: A, isMeta: Q, isVisibleInTranscriptOnly: B, isCompactSummary: G,
              toolUseResult: Z, uuid: I, thinkingMetadata: Y, timestamp: J, todos: W }) {
  return {
    type: "user",
    message: { role: "user", content: A || $q },
    isMeta: Q, isVisibleInTranscriptOnly: B, isCompactSummary: G,
    uuid: I ?? nO(), timestamp: J ?? new Date().toISOString(),
    toolUseResult: Z, thinkingMetadata: Y, todos: W
  }
}

// READABLE (for understanding):
function createMetaBlock({ content, isMeta, isVisibleInTranscriptOnly, isCompactSummary,
                           toolUseResult, uuid, thinkingMetadata, timestamp, todos }) {
  return {
    type: "user",
    message: { role: "user", content: content || EMPTY_PLACEHOLDER },
    isMeta: isMeta,
    isVisibleInTranscriptOnly: isVisibleInTranscriptOnly,
    isCompactSummary: isCompactSummary,
    uuid: uuid ?? generateUUID(),
    timestamp: timestamp ?? new Date().toISOString(),
    toolUseResult: toolUseResult,
    thinkingMetadata: thinkingMetadata,
    todos: todos
  }
}

// Mapping: R0→createMetaBlock, A→content, Q→isMeta, B→isVisibleInTranscriptOnly,
//          G→isCompactSummary, Z→toolUseResult, I→uuid, Y→thinkingMetadata,
//          J→timestamp, W→todos, $q→EMPTY_PLACEHOLDER, nO→generateUUID, !0→true
```

**Key Properties:**
- `isMeta: !0` (true) - Indicates this is metadata, not user content
- `type: "user"` - Sent as user role in API
- `content` - Can be string or content block array
- `$q` - EMPTY_CONTENT_PLACEHOLDER constant
- `nO()` - generateUUID function

---

## XML Tag Formats

### 1. `<system-reminder>` - Primary Wrapper

**Usage:** Most system reminders

**Format:**
```xml
<system-reminder>
[Reminder content - instructions, warnings, or metadata]
</system-reminder>
```

**Examples:**

**Warning Reminder:**
```xml
<system-reminder>
Warning: the file exists but the contents are empty.
</system-reminder>
```

**Context Reminder:**
```xml
<system-reminder>
As you answer the user's questions, you can use the following context:
# claudeMd
[CLAUDE.md content here]

IMPORTANT: this context may or may not be relevant to your tasks.
You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
```

**Malware Warning (tA5 constant):**
```xml
<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware.
You CAN and SHOULD provide analysis of malware, what it is doing.
But you MUST refuse to improve or augment the code.
You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
```

---

### 2. `<system-notification>` - Async Agent Status

**Location:** `chunks.154.mjs:243-247`

**Usage:** Async agent completion/failure notifications

**Format:**
```xml
<system-notification>Async agent "[description]" [status][: error message]. The output can be retrieved using AgentOutputTool with agentId: "[agentId]"</system-notification>
```

**Examples:**

**Successful Completion:**
```xml
<system-notification>Async agent "Search Agent" completed. The output can be retrieved using AgentOutputTool with agentId: "agent-123"</system-notification>
```

**Failed Agent:**
```xml
<system-notification>Async agent "Edit Agent" failed: File not found. The output can be retrieved using AgentOutputTool with agentId: "agent-456"</system-notification>
```

---

### 3. `<new-diagnostics>` - Diagnostic Issues

**Location:** `chunks.154.mjs:137-142`

**Usage:** New diagnostic issues detected by LSP or diagnostic system

**Format:**
```xml
<new-diagnostics>The following new diagnostic issues were detected:

[Formatted diagnostics summary]
</new-diagnostics>
```

**Example:**
```xml
<new-diagnostics>The following new diagnostic issues were detected:

File: /path/to/file.ts
Line 10: [error] Type 'string' is not assignable to type 'number'
Line 25: [warning] Variable 'foo' is declared but never used
</new-diagnostics>
```

---

### 4. `<session-memory>` - Past Session Summaries

**Location:** `chunks.154.mjs:265-272`

**Usage:** Previous session memory content

**Format:**
```xml
<session-memory>
These session summaries are from PAST sessions that might not be related to the current task and may have outdated info. Do not assume the current task is related to these summaries, until the user's messages indicate so or reference similar tasks. Only a preview of each memory is shown - use the Read tool with the provided path to access full session memory when a session is relevant.

## Previous Session ([date])
Full session notes: [path] ([N] more lines in full file)

[preview content]

---

## Previous Session ([date])
[...]
</session-memory>
```

---

### 5. `<mcp-resource>` - MCP Resource Content

**Location:** `chunks.154.mjs:170-204`

**Usage:** Content from MCP (Model Context Protocol) resources

**Format:**

**With Content:**
```
Full contents of resource:

[resource content]

Do NOT read this resource again unless you think it may have changed, since you already have the full contents.
```

**Empty Resource:**
```xml
<mcp-resource server="[server]" uri="[uri]">(No content)</mcp-resource>
```

**No Displayable Content:**
```xml
<mcp-resource server="[server]" uri="[uri]">(No displayable content)</mcp-resource>
```

---

### 6. `<teammate-message>` - Teammate Mailbox

**Location:** `chunks.107.mjs` (QY2 function)

**Usage:** Messages from other agents/teammates

**Format:**
```xml
<teammate-message teammate_id="[teammate_id]">
[message text]
</teammate-message>
```

**Example:**
```xml
<teammate-message teammate_id="agent-123">
Hey, I found a bug in the authentication module. Check line 45.
</teammate-message>
```

---

### 7. `<background-remote-session-status>` - Remote Session Status

**Location:** `chunks.154.mjs:210-216`

**Usage:** Background remote session status updates

**Format:**
```xml
<background-remote-session-status>Task id:[taskId]
Title:[title]
Status:[status]
Delta summary since last flush:[summary]</background-remote-session-status>
```

**Example:**
```xml
<background-remote-session-status>Task id:task-789
Title:Web Scraping Task
Status:running
Delta summary since last flush:Found 5 new items, processed 3</background-remote-session-status>
```

---

## Context Injection Format (gQA)

**Location:** `chunks.146.mjs:989-1003`

**Obfuscated Name:** `gQA`

**Readable Name:** `injectClaudeMdContext`

**Purpose:** Injects CLAUDE.md and other context files into the conversation

```javascript
// ============================================
// injectClaudeMdContext - Add context as system reminder
// Location: chunks.146.mjs:989-1003
// ============================================

// ORIGINAL (for source lookup):
function gQA(A, Q) {
  if (Object.entries(Q).length === 0) return A;
  return [R0({
    content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(Q).map(([B,G])=>`# ${B}\n${G}`).join(`\n`)}

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
</system-reminder>
`,
    isMeta: !0
  }), ...A]
}

// READABLE (for understanding):
function injectClaudeMdContext(attachments, contextMap) {
  if (Object.entries(contextMap).length === 0) return attachments;

  return [
    createMetaBlock({
      content: `<system-reminder>
As you answer the user's questions, you can use the following context:
${Object.entries(contextMap).map(([key, value]) => `# ${key}\n${value}`).join('\n')}

      IMPORTANT: this context may or may not be relevant to your tasks...
</system-reminder>`,
      isMeta: true
    }),
    ...attachments
  ];
}

// Mapping: gQA→injectClaudeMdContext, A→attachments, Q→contextMap, B→key, G→value,
//          R0→createMetaBlock, !0→true
```

**Context Map Keys:**
- `claudeMd` - CLAUDE.md file content
- `gitStatus` - Git status information
- Other context files as needed

---

## Special Reminder Content

### File Read Reminders

**Location:** `chunks.88.mjs:1394-1402`

**Empty File Warning:**
```xml
<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>
```

**File Shorter Than Offset:**
```xml
<system-reminder>Warning: the file exists but is shorter than the provided offset ([offset]). The file has [totalLines] lines.</system-reminder>
```

**Malware Analysis Warning (tA5):**

**Location:** `chunks.88.mjs:1086-1091`

```javascript
// ============================================
// tA5 (MALWARE_WARNING_REMINDER) - Appended to all file reads
// Location: chunks.88.mjs:1086-1091
// ============================================
const MALWARE_WARNING_REMINDER = `

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
`;
```

---

## Plan Mode Content

### Main Agent Plan Mode (Sb3)

**Location:** `chunks.153.mjs:2890-2964`

Contains extensive plan mode workflow instructions including:
- 5-phase workflow (Understanding → Design → Review → Final Plan → Exit)
- Agent spawn limits and guidelines
- File editing restrictions
- Tool usage instructions

### Sub-Agent Plan Mode (_b3)

**Location:** `chunks.153.mjs:2966-2977`

Simplified version for sub-agents:
- Read-only restrictions
- Plan file editing permissions
- Query answering guidance

---

## Processing Pipeline

```
Attachment Object
      │
      ▼
kb3() - convertAttachmentToSystemMessage (chunks.154.mjs:3-322)
      │
      ├─→ [Most types] NG([R0({content, isMeta:true})]) → Wrapped messages
      │
      ├─→ [Some types] R0({content: Qu(text), isMeta:true}) → Direct wrap
      │
      └─→ [Silent types] [] → No message output

      ▼
Message with XML-wrapped content ready for API
```

---

## Quick Symbol Lookup

> Full symbol mappings: [symbol_index.md](../00_overview/symbol_index.md)

When reading obfuscated source code, use this quick reference:

### Message Creation Pattern

```javascript
// Obfuscated:
return NG([R0({ content: "text", isMeta: !0 })]);

// Deobfuscated:
return wrapInSystemReminder([createMetaBlock({ content: "text", isMeta: true })]);
```

### Tool Simulation Pattern

```javascript
// Obfuscated:
return NG([kSA(D9.name, {...}), _SA(D9, {...})]);

// Deobfuscated:
return wrapInSystemReminder([
  createToolUseMessage(BashTool.name, {...}),
  createToolResultMessage(BashTool, {...})
]);
```

### Direct Wrap Pattern

```javascript
// Obfuscated:
return [R0({ content: Qu("text"), isMeta: !0 })];

// Deobfuscated:
return [createMetaBlock({ content: wrapSystemReminderText("text"), isMeta: true })];
```

### Common Obfuscated Values

| Code | Meaning |
|------|---------|
| `!0` | `true` |
| `!1` | `false` |
| `void 0` | `undefined` |
| `A.type` | `attachment.type` |
| `Q.message` | `message.message` |
| `G.text` | `block.text` |

---

## See Also

- [mechanism.md](./mechanism.md) - Complete attachment generation pipeline
- [types.md](./types.md) - All 34+ attachment type catalog
- [symbol_index.md](../00_overview/symbol_index.md) - Complete symbol mapping
- [file_index.md](../00_overview/file_index.md) - File content index
