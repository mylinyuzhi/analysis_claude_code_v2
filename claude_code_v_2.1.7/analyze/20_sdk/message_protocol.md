# Message Protocol (Claude Code 2.1.7)

> Analysis of SDK message types, schemas, and validation.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK Transport module

Key types in this document:
- `UserMessage` - User input messages
- `AssistantMessage` - LLM response messages
- `SystemMessage` - Status notifications
- `ResultMessage` - Final execution results
- `StreamEvent` - Real-time streaming events
- `ControlRequest/Response` - SDK control messages

---

## Message Protocol Overview

Claude Code SDK uses JSON-lines protocol (newline-delimited JSON) for all communication:

```
{"type":"user","message":{"role":"user","content":"Hello"},"uuid":"abc123"}\n
{"type":"assistant","message":{"role":"assistant","content":[...]},"uuid":"def456"}\n
{"type":"result","subtype":"success","result":"Task completed"}\n
```

---

## Inbound Message Types (SDK → Claude Code)

### 1. user - User Input

```json
{
  "type": "user",
  "session_id": "session-uuid",
  "message": {
    "role": "user",
    "content": "Write a hello world function"
  },
  "parent_tool_use_id": null,
  "uuid": "message-uuid"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"user"` | Message type identifier |
| `session_id` | `string` | Session identifier |
| `message.role` | `"user"` | Always "user" for inbound |
| `message.content` | `string` | User's prompt text |
| `parent_tool_use_id` | `string?` | Parent tool for subagent messages |
| `uuid` | `string` | Unique message ID for deduplication |

### 2. control_request - SDK Control

See [control_protocol.md](./control_protocol.md) for detailed control request types.

```json
{
  "type": "control_request",
  "request_id": "request-uuid",
  "request": {
    "subtype": "interrupt" | "initialize" | "set_model" | ...
    // ... subtype-specific fields
  }
}
```

### 3. control_response - Response to Claude Code Request

```json
{
  "type": "control_response",
  "response": {
    "request_id": "original-request-uuid",
    "subtype": "success" | "error",
    "response": { ... } | undefined,
    "error": "error message" | undefined
  }
}
```

### 4. keep_alive - Heartbeat

```json
{
  "type": "keep_alive"
}
```

Ignored by transport layer, used to keep WebSocket connections alive.

---

## Outbound Message Types (Claude Code → SDK)

### 1. user (echo) - Replayed User Message

When `replayUserMessages` option is enabled:

```json
{
  "type": "user",
  "message": {
    "role": "user",
    "content": "Original user message"
  },
  "session_id": "session-uuid",
  "parent_tool_use_id": null,
  "uuid": "message-uuid",
  "isReplay": true
}
```

### 2. assistant - LLM Response

```json
{
  "type": "assistant",
  "message": {
    "role": "assistant",
    "content": [
      {
        "type": "text",
        "text": "Here's the hello world function:"
      },
      {
        "type": "tool_use",
        "id": "tool-use-uuid",
        "name": "Write",
        "input": {
          "file_path": "/path/to/file.py",
          "content": "def hello():\n    print('Hello, World!')"
        }
      }
    ]
  },
  "model": "claude-sonnet-4-20250514",
  "session_id": "session-uuid",
  "parent_tool_use_id": null,
  "uuid": "message-uuid",
  "error": null
}
```

#### Content Block Types

| Type | Structure | Description |
|------|-----------|-------------|
| `text` | `{ type: "text", text: string }` | Text response |
| `tool_use` | `{ type: "tool_use", id: string, name: string, input: object }` | Tool invocation |
| `thinking` | `{ type: "thinking", thinking: string, signature: string }` | Extended thinking |
| `redacted_thinking` | `{ type: "redacted_thinking", data: string }` | Redacted thinking block |

### 3. system - Status Notifications

```json
{
  "type": "system",
  "subtype": "status" | "init" | "hook_response" | "tool_result",
  "session_id": "session-uuid",
  "uuid": "message-uuid",
  // Subtype-specific fields
}
```

#### System Subtypes

| Subtype | Fields | Description |
|---------|--------|-------------|
| `status` | `status: string` | SDK status update (e.g., "compacting") |
| `init` | `cwd: string, models: array` | Session initialization |
| `hook_response` | `hook_event: string, response: object` | Hook execution result |
| `tool_result` | `tool_use_id: string, content: string` | Tool execution result |

### 4. result - Final Execution Result

```json
{
  "type": "result",
  "subtype": "success" | "error_during_execution" | "error_max_turns" | "error_max_budget_usd" | "error_max_structured_output_retries",
  "result": "Final response text",
  "duration_ms": 5432,
  "duration_api_ms": 4210,
  "is_error": false,
  "num_turns": 3,
  "session_id": "session-uuid",
  "total_cost_usd": 0.0234,
  "usage": {
    "input_tokens": 1234,
    "output_tokens": 567,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 890
  },
  "modelUsage": {
    "claude-sonnet-4-20250514": {
      "input_tokens": 1234,
      "output_tokens": 567
    }
  },
  "permission_denials": [],
  "uuid": "message-uuid",
  "errors": []
}
```

#### Result Subtypes

| Subtype | `is_error` | Description |
|---------|------------|-------------|
| `success` | `false` | Successful completion |
| `error_during_execution` | `true` | Execution error occurred |
| `error_max_turns` | `true` | Exceeded max turns limit |
| `error_max_budget_usd` | `true` | Exceeded budget limit |
| `error_max_structured_output_retries` | `true` | Failed structured output validation |

### 5. stream_event - Real-Time Streaming

```json
{
  "type": "stream_event",
  "uuid": "event-uuid",
  "session_id": "session-uuid",
  "event": {
    "type": "content_block_delta",
    "index": 0,
    "delta": {
      "type": "text_delta",
      "text": "partial text..."
    }
  }
}
```

#### Stream Event Types

| Event Type | Content | When Emitted |
|------------|---------|--------------|
| `message_start` | Initial message metadata | Start of response |
| `content_block_start` | Block type/id | Start of text/tool block |
| `content_block_delta` | Partial content | During streaming |
| `content_block_stop` | Block index | End of block |
| `message_delta` | Stop reason, usage | Near end |
| `message_stop` | - | End of response |

### 6. control_request - Permission/Hook Request

Claude Code sends these to SDK for permission checks and hook execution:

```json
{
  "type": "control_request",
  "request_id": "request-uuid",
  "request": {
    "subtype": "can_use_tool" | "hook_callback" | "mcp_message",
    // ... subtype-specific fields
  }
}
```

### 7. control_response - Control Acknowledgment

```json
{
  "type": "control_response",
  "response": {
    "subtype": "success" | "error",
    "request_id": "original-request-uuid",
    "response": { ... },
    "pending_permission_requests": []  // For initialize errors
  }
}
```

### 8. auth_status - OAuth Progress (NEW in 2.1.x)

```json
{
  "type": "auth_status",
  "isAuthenticating": true,
  "output": "Opening browser for authentication...",
  "error": null,
  "uuid": "message-uuid",
  "session_id": "session-uuid"
}
```

---

## Message Validation

### Input Validation (processLine)

```javascript
// ============================================
// Input Message Validation
// Location: chunks.155.mjs:2659-2692
// ============================================

// READABLE (for understanding):
async processLine(line) {
  try {
    const message = JSON.parse(line);

    // Ignore keepalives
    if (message.type === "keep_alive") return;

    // Handle control responses (resolve pending requests)
    if (message.type === "control_response") {
      // ... correlation logic
      return;
    }

    // Validate message type
    if (message.type !== "user" && message.type !== "control_request") {
      exitWithError(`Error: Expected 'user' or 'control_request', got '${message.type}'`);
    }

    // Validate control request has request field
    if (message.type === "control_request") {
      if (!message.request) {
        exitWithError("Error: Missing request on control_request");
      }
      return message;
    }

    // Validate user message has correct role
    if (message.message.role !== "user") {
      exitWithError(`Error: Expected role 'user', got '${message.message.role}'`);
    }

    return message;
  } catch (error) {
    console.error(`Error parsing streaming input line: ${line}: ${error}`);
    process.exit(1);
  }
}
```

### Control Response Validation (Zod Schemas)

```javascript
// ============================================
// Response Schemas
// Location: chunks.155.mjs (inferred)
// ============================================

// Permission check response
const canUseToolResponseSchema = z.union([
  z.object({
    behavior: z.enum(["allow", "deny", "prompt"]),
    message: z.string().optional(),
    toolUseID: z.string().optional()
  }),
  z.object({
    behavior: z.enum(["allow", "deny"]),
    message: z.string().optional()
  })
]);

// Hook callback response
const hookCallbackResponseSchema = z.object({
  continue_: z.boolean().optional(),
  suppressOutput: z.boolean().optional(),
  stopReason: z.string().optional(),
  decision: z.enum(["block"]).optional(),
  systemMessage: z.string().optional(),
  reason: z.string().optional(),
  hookSpecificOutput: z.object({
    hookEventName: z.string()
    // ... event-specific fields
  }).optional()
});

// MCP message response
const mcpMessageResponseSchema = z.object({
  mcp_response: z.any()
});
```

---

## Message Deduplication

Messages with UUIDs are deduplicated to prevent reprocessing:

```javascript
// ============================================
// Message Deduplication
// Location: chunks.155.mjs:3440-3454
// ============================================

// READABLE (for understanding):
if (input.uuid) {
  const sessionId = getSessionId();

  // Check if already processed (database + in-memory cache)
  if (await isDuplicateMessage(sessionId, input.uuid) || processedUuids.has(input.uuid)) {
    log(`Skipping duplicate user message: ${input.uuid}`);

    // Echo back if replay mode enabled
    if (options.replayUserMessages) {
      log(`Sending acknowledgment for duplicate user message: ${input.uuid}`);
      outputQueue.enqueue({
        type: "user",
        message: input.message,
        session_id: sessionId,
        parent_tool_use_id: null,
        uuid: input.uuid,
        isReplay: true
      });
    }
    continue;
  }

  // Mark as processed
  processedUuids.add(input.uuid);
}
```

**Key insight:** The `isReplay: true` flag allows SDK clients to distinguish between fresh and replayed messages, important for idempotent handling.

---

## Message Flow Summary

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        Message Type Flow Summary                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  SDK Client                                      Claude Code               │
│      │                                                │                    │
│      │ ──── user (prompt) ──────────────────────────► │                    │
│      │ ──── control_request (interrupt/model/...) ──► │                    │
│      │ ──── control_response (permission result) ───► │                    │
│      │ ──── keep_alive ─────────────────────────────► │ (ignored)          │
│      │                                                │                    │
│      │ ◄─── user (isReplay=true) ─────────────────── │                    │
│      │ ◄─── assistant ─────────────────────────────── │                    │
│      │ ◄─── system ─────────────────────────────────── │                    │
│      │ ◄─── stream_event ────────────────────────────── │                    │
│      │ ◄─── result ──────────────────────────────────── │                    │
│      │ ◄─── control_request (can_use_tool/hook) ────── │                    │
│      │ ◄─── control_response (ack) ───────────────────── │                    │
│      │ ◄─── auth_status ──────────────────────────────── │                    │
│      │                                                │                    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Python SDK Message Classes

The Python SDK (`claude-agent-sdk`) provides typed message classes:

```python
@dataclass
class UserMessage:
    content: str
    uuid: str | None
    parent_tool_use_id: str | None

@dataclass
class AssistantMessage:
    content: list[TextBlock | ToolUseBlock | ThinkingBlock]
    model: str
    error: str | None

@dataclass
class SystemMessage:
    subtype: str
    data: dict

@dataclass
class ResultMessage:
    subtype: str  # "success" | "error_*"
    result: str
    duration_ms: int
    total_cost_usd: float
    usage: Usage
    is_error: bool
```

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [transport_layer.md](./transport_layer.md) - Transport implementation
- [control_protocol.md](./control_protocol.md) - Control request/response
- [output_pipeline.md](./output_pipeline.md) - Output flow and AsyncMessageQueue
