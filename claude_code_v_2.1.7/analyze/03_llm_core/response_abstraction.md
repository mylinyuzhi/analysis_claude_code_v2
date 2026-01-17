# Response Model Abstraction (Claude Code 2.1.7)

## Table of Contents

1. [Overview](#overview)
2. [Message Type Hierarchy](#message-type-hierarchy)
3. [Assistant Message Structure](#assistant-message-structure)
4. [User Message Structure](#user-message-structure)
5. [Content Block Types](#content-block-types)
6. [SDK Types vs Internal Types](#sdk-types-vs-internal-types)
7. [Message Factory Functions](#message-factory-functions)

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution symbols

Key functions in this document:
- `PJ9` (createAssistantMessage) - Create assistant message wrapper
- `QU` (createTextAssistantMessage) - Create text-only assistant message
- `DZ` (createErrorMessage) - Create error message
- `H0` (createUserMessage) - Create user message wrapper
- `GM` (generateUUID) - Generate internal UUID

---

## Overview

Claude Code uses a **custom message abstraction layer** that wraps the Anthropic SDK types. This provides:

1. **Internal tracking**: UUID, timestamp for each message
2. **Extended metadata**: `isMeta`, `toolUseResult`, `thinkingMetadata`
3. **Type discrimination**: `type` field distinguishes message kinds
4. **Decoupling**: Not directly dependent on SDK type changes

### Design Decision

**Why not use SDK types directly?**

| Aspect | SDK Types | Claude Code Types |
|--------|-----------|-------------------|
| Identity | API `id` only | Internal `uuid` + API `id` |
| Timestamp | Not provided | Added by Claude Code |
| Extensibility | Fixed schema | Custom fields supported |
| UI State | No UI metadata | `isMeta`, `isVisibleInTranscriptOnly` |
| Tool Integration | Basic | `toolUseResult`, `sourceToolAssistantUUID` |

---

## Message Type Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Claude Code Message Type Hierarchy                        │
└─────────────────────────────────────────────────────────────────────────────┘

ConversationMessage (Union Type)
    │
    ├── AssistantMessage
    │   ├── type: "assistant"
    │   ├── uuid: string
    │   ├── timestamp: string
    │   ├── requestId?: string
    │   ├── message: APIMessage        ← SDK Message type
    │   ├── isApiErrorMessage?: boolean
    │   └── apiError?: string
    │
    ├── UserMessage
    │   ├── type: "user"
    │   ├── uuid: string
    │   ├── timestamp: string
    │   ├── message: { role, content }
    │   ├── isMeta?: boolean
    │   ├── isVisibleInTranscriptOnly?: boolean
    │   ├── isCompactSummary?: boolean
    │   ├── toolUseResult?: object
    │   ├── thinkingMetadata?: object
    │   └── sourceToolAssistantUUID?: string
    │
    ├── ProgressMessage
    │   ├── type: "progress"
    │   ├── toolUseID: string
    │   └── content: string
    │
    ├── AttachmentMessage
    │   ├── type: "attachment"
    │   └── attachments: Attachment[]
    │
    └── SystemMessage
        ├── type: "system"
        └── content: string
```

---

## Assistant Message Structure

### Complete Structure

```javascript
// ============================================
// Assistant Message - Claude Code internal type
// Location: chunks.147.mjs:2358-2378
// ============================================

// ORIGINAL (for source lookup):
function PJ9({
  content: A,
  isApiErrorMessage: Q = !1,
  apiError: B,
  error: G,
  usage: Z = { /* defaults */ }
}) {
  return {
    type: "assistant",
    uuid: GM(),
    timestamp: new Date().toISOString(),
    message: {
      id: GM(),
      container: null,
      model: EKA,
      role: "assistant",
      stop_reason: "stop_sequence",
      stop_sequence: "",
      type: "message",
      usage: Z,
      content: A,
      context_management: null
    },
    requestId: void 0,
    apiError: B,
    error: G,
    isApiErrorMessage: Q
  }
}

// READABLE (for understanding):
function createAssistantMessage({
  content,
  isApiErrorMessage = false,
  apiError,
  error,
  usage = defaultUsage
}) {
  return {
    // Claude Code envelope
    type: "assistant",
    uuid: generateUUID(),
    timestamp: new Date().toISOString(),
    requestId: undefined,
    apiError: apiError,
    error: error,
    isApiErrorMessage: isApiErrorMessage,

    // Wrapped SDK Message
    message: {
      id: generateUUID(),
      container: null,
      model: currentModel,
      role: "assistant",
      stop_reason: "stop_sequence",
      stop_sequence: "",
      type: "message",
      usage: usage,
      content: content,           // ContentBlock[]
      context_management: null
    }
  };
}

// Mapping: PJ9→createAssistantMessage, GM→generateUUID, EKA→currentModel
```

### Field Descriptions

| Field | Type | Purpose |
|-------|------|---------|
| `type` | `"assistant"` | Discriminator for type guards |
| `uuid` | `string` | Claude Code internal ID (not API ID) |
| `timestamp` | `string` | ISO timestamp when created |
| `requestId` | `string?` | API request ID for debugging |
| `message` | `APIMessage` | SDK Message object |
| `isApiErrorMessage` | `boolean` | Marks error responses |
| `apiError` | `string?` | Error type (e.g., "max_output_tokens") |

---

## User Message Structure

### Complete Structure

```javascript
// ============================================
// User Message - Claude Code internal type
// Location: chunks.147.mjs:2410-2440
// ============================================

// ORIGINAL (for source lookup):
function H0({
  content: A,
  isMeta: Q,
  isVisibleInTranscriptOnly: B,
  isCompactSummary: G,
  toolUseResult: Z,
  uuid: Y,
  thinkingMetadata: J,
  timestamp: X,
  todos: I,
  imagePasteIds: D,
  sourceToolAssistantUUID: W
}) {
  return {
    type: "user",
    message: {
      role: "user",
      content: A || JO
    },
    isMeta: Q,
    isVisibleInTranscriptOnly: B,
    isCompactSummary: G,
    uuid: Y ?? GM(),
    timestamp: X ?? new Date().toISOString(),
    toolUseResult: Z,
    thinkingMetadata: J,
    todos: I,
    imagePasteIds: D,
    sourceToolAssistantUUID: W
  }
}

// READABLE (for understanding):
function createUserMessage({
  content,
  isMeta,
  isVisibleInTranscriptOnly,
  isCompactSummary,
  toolUseResult,
  uuid,
  thinkingMetadata,
  timestamp,
  todos,
  imagePasteIds,
  sourceToolAssistantUUID
}) {
  return {
    // Claude Code envelope
    type: "user",
    uuid: uuid ?? generateUUID(),
    timestamp: timestamp ?? new Date().toISOString(),

    // SDK-compatible message
    message: {
      role: "user",
      content: content || EMPTY_CONTENT_PLACEHOLDER
    },

    // Claude Code extensions
    isMeta: isMeta,                              // Meta message (not shown to user)
    isVisibleInTranscriptOnly: isVisibleInTranscriptOnly,
    isCompactSummary: isCompactSummary,          // Compaction summary
    toolUseResult: toolUseResult,                // Tool execution result
    thinkingMetadata: thinkingMetadata,          // Extended thinking info
    todos: todos,                                // Todo list state
    imagePasteIds: imagePasteIds,                // Image paste tracking
    sourceToolAssistantUUID: sourceToolAssistantUUID  // Link to tool call
  };
}

// Mapping: H0→createUserMessage, GM→generateUUID, JO→EMPTY_CONTENT_PLACEHOLDER
```

### Extension Fields

| Field | Purpose |
|-------|---------|
| `isMeta` | Internal messages not shown in UI |
| `isVisibleInTranscriptOnly` | Show only in transcript, not chat |
| `isCompactSummary` | Message is a compaction summary |
| `toolUseResult` | Contains tool execution result |
| `thinkingMetadata` | Extended thinking mode metadata |
| `todos` | Todo list state snapshot |
| `sourceToolAssistantUUID` | Links tool_result to original tool_use |

---

## Content Block Types

### Supported Content Blocks

```javascript
// ============================================
// Content Block Types
// Location: chunks.147.mjs:186-216
// ============================================

// Text Block
{
  type: "text",
  text: "Hello, world!"
}

// Tool Use Block
{
  type: "tool_use",
  id: "toolu_01abc...",
  name: "Read",
  input: { file_path: "/path/to/file" }
}

// Server Tool Use Block (MCP)
{
  type: "server_tool_use",
  id: "toolu_02xyz...",
  name: "mcp_tool_name",
  input: { ... }
}

// Thinking Block (Extended Thinking)
{
  type: "thinking",
  thinking: "Let me analyze this...",
  signature: "..."  // Optional signature
}

// Tool Result Block (in user messages)
{
  type: "tool_result",
  tool_use_id: "toolu_01abc...",
  content: "File contents here...",
  is_error: false
}

// Image Block
{
  type: "image",
  source: {
    type: "base64",
    media_type: "image/png",
    data: "..."
  }
}
```

### Content Block Processing

```javascript
// ============================================
// processContent - Normalize content blocks
// Location: chunks.147.mjs (JP0 function)
// ============================================

// READABLE (for understanding):
function processContent(contentBlocks, context, agentId) {
  return contentBlocks.map(block => {
    switch (block.type) {
      case "tool_use":
        // Parse JSON input if it's still a string
        if (typeof block.input === "string") {
          try {
            block.input = JSON.parse(block.input);
          } catch {
            // Keep as string if parse fails
          }
        }
        return block;

      case "text":
      case "thinking":
      default:
        return block;
    }
  });
}

// Mapping: JP0→processContent
```

---

## SDK Types vs Internal Types

### Comparison Table

| Aspect | Anthropic SDK | Claude Code Internal |
|--------|---------------|---------------------|
| **Message ID** | `message.id` (API-generated) | `uuid` (locally generated) |
| **Timestamp** | Not included | `timestamp` (ISO string) |
| **Type Field** | `message.type = "message"` | `type = "assistant" \| "user"` |
| **Content** | `message.content: ContentBlock[]` | Same, wrapped in `message.content` |
| **Role** | `message.role` | Same, in `message.role` |
| **Error Info** | Exception thrown | `isApiErrorMessage`, `apiError` |
| **Tool Results** | In content array | Also in `toolUseResult` field |

### Type Guard Functions

```javascript
// ============================================
// Type guard functions
// Location: chunks.147.mjs:2314-2596
// ============================================

// Check if message is assistant with tool use
function hasToolUse(message) {
  return message.type === "assistant" &&
         message.message.content.some(block => block.type === "tool_use");
}

// Check if message is user with tool result
function hasToolResult(message) {
  return message.type === "user" &&
         (Array.isArray(message.message.content) &&
          message.message.content[0]?.type === "tool_result" ||
          Boolean(message.toolUseResult));
}

// Get text content from assistant message
function getTextContent(message) {
  if (message.type !== "assistant") return null;
  if (Array.isArray(message.message.content)) {
    return message.message.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n")
      .trim() || null;
  }
  return null;
}

// Mapping: RJ9→hasToolUse, y19→hasToolResult, Xt→getTextContent
```

---

## Message Factory Functions

### Factory Function Summary

| Function | Obfuscated | Purpose |
|----------|------------|---------|
| `createAssistantMessage` | `PJ9` | Full assistant message with all options |
| `createTextAssistantMessage` | `QU` | Simple text-only assistant message |
| `createErrorMessage` | `DZ` | Error response message |
| `createUserMessage` | `H0` | User message with extensions |

### Error Message Factory

```javascript
// ============================================
// createErrorMessage - Error response factory
// Location: chunks.147.mjs:2394-2408
// ============================================

// ORIGINAL (for source lookup):
function DZ({
  content: A,
  apiError: Q,
  error: B
}) {
  return PJ9({
    content: [{
      type: "text",
      text: A === "" ? JO : A
    }],
    isApiErrorMessage: !0,
    apiError: Q,
    error: B
  })
}

// READABLE (for understanding):
function createErrorMessage({ content, apiError, error }) {
  return createAssistantMessage({
    content: [{
      type: "text",
      text: content === "" ? EMPTY_PLACEHOLDER : content
    }],
    isApiErrorMessage: true,
    apiError: apiError,    // e.g., "max_output_tokens", "rate_limit"
    error: error           // Error object
  });
}

// Mapping: DZ→createErrorMessage, PJ9→createAssistantMessage
```

---

## Message Normalization (Internal → API)

Before sending to the API, internal messages must be normalized. This is handled by `FI` (normalizeMessagesToAPI).

### Normalization Process

```javascript
// ============================================
// normalizeMessagesToAPI - Convert internal messages to API format
// Location: chunks.147.mjs:2876-2948
// ============================================

// ORIGINAL (for source lookup):
function FI(A, Q = []) {
  let B = new Set(Q.map((Y) => Y.name)),  // Tool names
    G = I$7(A),                            // Reorder attachments
    Z = [];                                // Output array

  return G.filter((Y) => {
    // Filter out progress and system messages
    if (Y.type === "progress" || Y.type === "system" || J$7(Y)) return !1;
    return !0
  }).forEach((Y) => {
    switch (Y.type) {
      case "user": {
        // Merge consecutive user messages
        let X = QC(Z);  // Get last element
        if (X?.type === "user") {
          Z[Z.indexOf(X)] = F$7(X, J);  // Merge
          return
        }
        Z.push(J);
        return
      }
      case "assistant": {
        // Process tool_use inputs, merge if same message.id
        let X = { ...Y, message: { ...Y.message, content: processToolUseInputs() } };
        // Check if we should merge with previous assistant message
        for (let I = Z.length - 1; I >= 0; I--) {
          let D = Z[I];
          if (D.type === "assistant" && D.message.id === X.message.id) {
            Z[I] = K$7(D, X);  // Merge content arrays
            return
          }
        }
        Z.push(X);
        return
      }
      case "attachment": {
        // Convert attachment to system message
        let J = q$7(Y.attachment);  // convertAttachmentToSystemMessage
        Z.push(...J);
        return
      }
    }
  }), MeB(Z), w$7(Z)  // Final cleanup
}

// READABLE (for understanding):
function normalizeMessagesToAPI(messages, tools = []) {
  let toolNames = new Set(tools.map(t => t.name));
  let reorderedMessages = reorderAttachments(messages);
  let output = [];

  // Filter and process
  reorderedMessages
    .filter(msg => msg.type !== "progress" && msg.type !== "system" && !isFilteredMessage(msg))
    .forEach(msg => {
      switch (msg.type) {
        case "user":
          // API requires alternating user/assistant - merge consecutive users
          let lastMsg = output[output.length - 1];
          if (lastMsg?.type === "user") {
            output[output.length - 1] = mergeUserMessages(lastMsg, msg);
          } else {
            output.push(msg);
          }
          break;

        case "assistant":
          // Process tool inputs and handle per-block yielding merge
          let processedMsg = {
            ...msg,
            message: {
              ...msg.message,
              content: msg.message.content.map(block => {
                if (block.type === "tool_use") {
                  let tool = tools.find(t => t.name === block.name);
                  return {
                    type: "tool_use",
                    id: block.id,
                    name: block.name,
                    input: tool ? normalizeToolInput(tool, block.input) : block.input
                  };
                }
                return block;
              })
            }
          };

          // Merge if same message.id (from per-block yielding)
          for (let i = output.length - 1; i >= 0; i--) {
            if (output[i].type === "assistant" &&
                output[i].message.id === processedMsg.message.id) {
              output[i] = mergeAssistantMessages(output[i], processedMsg);
              return;
            }
          }
          output.push(processedMsg);
          break;

        case "attachment":
          // Convert to user message with system content
          let converted = convertAttachmentToSystemMessage(msg.attachment);
          output.push(...converted);
          break;
      }
    });

  // Final cleanup: remove empty messages, validate structure
  removeEmptyMessages(output);
  return ensureAlternatingMessages(output);
}

// Mapping: FI→normalizeMessagesToAPI, I$7→reorderAttachments, J$7→isFilteredMessage,
//          QC→getLastElement, F$7→mergeUserMessages, K$7→mergeAssistantMessages,
//          q$7→convertAttachmentToSystemMessage, uA9→normalizeToolInput,
//          MeB→removeEmptyMessages, w$7→ensureAlternatingMessages
```

### Key Normalization Steps

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Message Normalization Pipeline                            │
└─────────────────────────────────────────────────────────────────────────────┘

Internal Messages (Claude Code format)
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  1. Filter                                                                    │
│     - Remove: progress, system messages                                       │
│     - Remove: filtered/internal messages                                      │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  2. Reorder Attachments                                                       │
│     - Move attachments to correct positions relative to messages              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  3. Merge Per-Block Yields                                                    │
│     - Multiple assistant messages with same message.id → Single message      │
│     - Concatenate content arrays                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  4. Merge Consecutive User Messages                                           │
│     - API requires alternating user/assistant                                 │
│     - Merge adjacent user messages into one                                   │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  5. Process Tool Inputs                                                       │
│     - Normalize tool input based on tool schema                               │
│     - Remove extra fields not in schema                                       │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│  6. Convert Attachments                                                       │
│     - Attachment messages → User messages with system content                 │
└──────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
API-Ready Messages (Anthropic SDK format)
```

### Why Merge Per-Block Yields?

The stream aggregation yields one message per `content_block_stop`. But the API expects:
```json
{
  "role": "assistant",
  "content": [
    { "type": "text", "text": "I'll help..." },
    { "type": "tool_use", "id": "...", "name": "Read", "input": {...} }
  ]
}
```

Not separate messages for each block. So normalization merges them back:

```
Before normalization:
  [
    { type: "assistant", message: { id: "msg1", content: [text_block] } },
    { type: "assistant", message: { id: "msg1", content: [tool_use_block] } }
  ]

After normalization:
  [
    { type: "assistant", message: { id: "msg1", content: [text_block, tool_use_block] } }
  ]
```

---

## Usage in Agent Loop

### Message Flow

```
User Input
    │
    ▼
┌───────────────────────────────────────────────────────────────────┐
│  createUserMessage({ content: userInput })                        │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────────┐
│  API Request (SDK types)                                          │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────────┐
│  Stream Aggregation (see stream_aggregation.md)                   │
│  → Yields: { type: "assistant", message: {...}, uuid, ... }       │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────────────────┐
│  Tool Execution (if tool_use present)                             │
│  → createUserMessage({ toolUseResult: {...} })                    │
└───────────────────────────────────────────────────────────────────┘
    │
    ▼
Continue loop...
```

---

## Related Documents

- [stream_aggregation.md](./stream_aggregation.md) - How streaming responses are aggregated
- [api_calling.md](./api_calling.md) - API call mechanism
- [agent_loop.md](./agent_loop.md) - Main agent loop using these messages
