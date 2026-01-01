# SDK Message Protocol

> Analysis of SDK message types, validation, and JSON-lines protocol.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - SDK Transport module

Key functions in this document:
- `validateSDKMessage` (gf5) - Message validation and filtering
- `sdkFatalError` (LD0) - Fatal error handler
- `fetchSessionEvents` (uf5) - Session event retrieval

---

## Protocol Overview

Claude Code SDK uses a **JSON-lines** protocol for communication:

- Each message is a single JSON object followed by a newline (`\n`)
- Messages flow bidirectionally over stdin/stdout or WebSocket
- All messages include `session_id` for multi-session routing
- Control messages use `request_id` for request-response correlation

```
┌─────────────────┐     JSON + \n      ┌─────────────────┐
│                 │ ──────────────────>│                 │
│   SDK Client    │                    │  Claude Code    │
│                 │ <──────────────────│                 │
└─────────────────┘     JSON + \n      └─────────────────┘
```

---

## Message Validation

### validateSDKMessage Function

**What it does:** Validates incoming SDK messages, filtering out internal log messages and control responses while preserving messages with session IDs.

**How it works:**
1. Check if input is a valid object with `type` property
2. Filter out internal types: `env_manager_log`, `control_response`
3. Require `session_id` field for valid user messages
4. Return `null` for invalid messages (with debug log)

**Why this approach:**
- Internal control messages (like `control_response`) are handled by the pending request system, not the main message stream
- `env_manager_log` messages are internal debugging and shouldn't reach the agent loop
- `session_id` is required for proper routing in multi-session scenarios

```javascript
// ============================================
// validateSDKMessage - Message validation and filtering
// Location: chunks.121.mjs:35-41
// ============================================

// ORIGINAL (for source lookup):
function gf5(A) {
  if (A && typeof A === "object" && "type" in A) {
    if (A.type === "env_manager_log" || A.type === "control_response") return null;
    if ("session_id" in A) return A
  }
  return g(`Event is not a valid SDKMessage: ${JSON.stringify(A)}`), null
}

// READABLE (for understanding):
function validateSDKMessage(event) {
  // Check basic structure
  if (event && typeof event === "object" && "type" in event) {
    // Filter out internal message types
    if (event.type === "env_manager_log" || event.type === "control_response") {
      return null;  // Handled separately by control system
    }
    // Validate session_id presence
    if ("session_id" in event) {
      return event;  // Valid SDK message
    }
  }
  // Log invalid message for debugging
  debug(`Event is not a valid SDKMessage: ${JSON.stringify(event)}`);
  return null;
}

// Mapping: gf5→validateSDKMessage, A→event, g→debug
```

**Key insight:** The filter for `control_response` is important because these messages are routed through the `pendingRequests` Map in the transport layer, not through the main message stream.

---

## Message Types

### Inbound Messages (SDK → Claude Code)

#### User Message

```json
{
  "type": "user",
  "session_id": "uuid-string",
  "message": {
    "role": "user",
    "content": "User prompt text"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"user"` | Message type identifier |
| `session_id` | `string` | Unique session identifier |
| `message.role` | `"user"` | Message role |
| `message.content` | `string` | User prompt content |

#### Control Request

```json
{
  "type": "control_request",
  "request_id": "uuid-string",
  "request": {
    "subtype": "can_use_tool",
    "tool_name": "Bash",
    "input": {...},
    "permission_suggestions": [...],
    "blocked_path": "/path",
    "decision_reason": "...",
    "tool_use_id": "uuid",
    "agent_id": "main"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"control_request"` | Control message type |
| `request_id` | `string` | Unique request ID for correlation |
| `request.subtype` | `string` | Request subtype (see below) |

**Control Request Subtypes:**

| Subtype | Direction | Purpose |
|---------|-----------|---------|
| `can_use_tool` | CC → SDK | Permission check for tool usage |
| `hook_callback` | CC → SDK | Execute SDK-registered hook |
| `mcp_message` | CC → SDK | Route MCP protocol message |

#### Control Response

```json
{
  "type": "control_response",
  "response": {
    "request_id": "uuid-string",
    "subtype": "can_use_tool_response",
    "response": {
      "behavior": "allow",
      "message": "Approved",
      "toolUseID": "uuid"
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"control_response"` | Response message type |
| `response.request_id` | `string` | Matches original request |
| `response.subtype` | `string` | Response subtype |

#### Keep-Alive

```json
{
  "type": "keep_alive"
}
```

Keep-alive messages are used to prevent connection timeouts during long operations.

---

### Outbound Messages (Claude Code → SDK)

#### Stream Event

```json
{
  "type": "stream_event",
  "session_id": "uuid-string",
  "uuid": "event-uuid",
  "event": {
    "type": "content_block_delta",
    "delta": {...}
  },
  "parent_tool_use_id": "uuid" | null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"stream_event"` | Streaming event type |
| `session_id` | `string` | Session identifier |
| `uuid` | `string` | Unique event ID |
| `event` | `object` | Raw Anthropic API stream event |
| `parent_tool_use_id` | `string?` | Parent tool context (for subagents) |

#### Result Message

```json
{
  "type": "result",
  "session_id": "uuid-string",
  "subtype": "success",
  "duration_ms": 5000,
  "duration_api_ms": 3000,
  "is_error": false,
  "num_turns": 3,
  "total_cost_usd": 0.05,
  "usage": {
    "input_tokens": 1000,
    "output_tokens": 500
  },
  "result": "Final response text",
  "structured_output": {...}
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"result"` | Result message type |
| `subtype` | `string` | `"success"` or `"error"` |
| `duration_ms` | `number` | Total execution time |
| `duration_api_ms` | `number` | API call time |
| `is_error` | `boolean` | Error flag |
| `num_turns` | `number` | Number of conversation turns |
| `total_cost_usd` | `number?` | Total API cost |
| `usage` | `object?` | Token usage statistics |
| `result` | `string?` | Final text result |
| `structured_output` | `any` | Structured output (if configured) |

#### System Message

```json
{
  "type": "system",
  "session_id": "uuid-string",
  "subtype": "status",
  "data": {
    "status": "working",
    "message": "Processing..."
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"system"` | System message type |
| `subtype` | `string` | System message category |
| `data` | `object` | Message-specific data |

#### Auth Status

```json
{
  "type": "auth_status",
  "session_id": "uuid-string",
  "status": "authenticated",
  "user": {...}
}
```

---

## Message Flow Diagram

```
SDK Client                                      Claude Code
    │                                               │
    │  ┌─────────────────────────────────────┐     │
    │  │ {"type": "user",                    │     │
    │  │  "session_id": "abc",               │     │
    │  │  "message": {"role": "user", ...}}  │     │
    │  └─────────────────────────────────────┘     │
    │─────────────────────────────────────────────>│
    │                                               │
    │                                               │ validateSDKMessage (gf5)
    │                                               │ Process in agent loop
    │                                               │
    │  ┌─────────────────────────────────────┐     │
    │  │ {"type": "stream_event",            │     │
    │  │  "session_id": "abc",               │     │
    │  │  "event": {...}}                    │     │
    │  └─────────────────────────────────────┘     │
    │<─────────────────────────────────────────────│
    │                                               │
    │  ┌─────────────────────────────────────┐     │
    │  │ {"type": "control_request",         │     │ Permission check needed
    │  │  "request_id": "xyz",               │     │
    │  │  "request": {"subtype": "can_use_tool"}}│ │
    │  └─────────────────────────────────────┘     │
    │<─────────────────────────────────────────────│
    │                                               │
    │  ┌─────────────────────────────────────┐     │
    │  │ {"type": "control_response",        │     │
    │  │  "response": {"request_id": "xyz",  │     │
    │  │   "response": {"behavior": "allow"}}}│    │
    │  └─────────────────────────────────────┘     │
    │─────────────────────────────────────────────>│
    │                                               │
    │  ┌─────────────────────────────────────┐     │
    │  │ {"type": "result",                  │     │
    │  │  "session_id": "abc",               │     │
    │  │  "is_error": false, ...}            │     │
    │  └─────────────────────────────────────┘     │
    │<─────────────────────────────────────────────│
    │                                               │
```

---

## JSON-Lines Protocol Details

### Line Parsing Algorithm

The transport layer accumulates input and splits on newlines:

```javascript
// ============================================
// Line Parsing in read() Generator
// Location: chunks.156.mjs:2459-2478
// ============================================

// ORIGINAL (for source lookup):
async * read() {
  let A = "";
  for await (let Q of this.input) {
    A += Q;
    let B;
    while ((B = A.indexOf(`\n`)) !== -1) {
      let G = A.slice(0, B);
      A = A.slice(B + 1);
      let Z = await this.processLine(G);
      if (Z) yield Z
    }
  }
  if (A) {
    let Q = await this.processLine(A);
    if (Q) yield Q
  }
  this.inputClosed = !0;
  for (let Q of this.pendingRequests.values())
    Q.reject(Error("Tool permission stream closed before response received"))
}

// READABLE (for understanding):
async *read() {
  let buffer = "";

  // Process incoming data chunks
  for await (let chunk of this.input) {
    buffer += chunk;

    // Extract complete lines
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);

      const message = await this.processLine(line);
      if (message) yield message;
    }
  }

  // Process any remaining data (incomplete final line)
  if (buffer) {
    const message = await this.processLine(buffer);
    if (message) yield message;
  }

  // Cleanup: mark stream closed
  this.inputClosed = true;

  // Reject any pending requests
  for (let pending of this.pendingRequests.values()) {
    pending.reject(Error("Tool permission stream closed before response received"));
  }
}

// Mapping: A→buffer, Q→chunk/pending, B→newlineIndex, G→line, Z→message
```

**Key insight:** The algorithm handles:
1. Partial lines (accumulates until newline received)
2. Multiple lines in single chunk (processes all complete lines)
3. Incomplete final line (processes remaining buffer on stream close)
4. Cleanup of pending requests on stream closure

---

### Message Routing

The `processLine` function routes messages to appropriate handlers:

```javascript
// ============================================
// processLine - Message Router
// Location: chunks.156.mjs:2485-2518
// ============================================

// ORIGINAL (for source lookup):
async processLine(A) {
  try {
    let Q = JSON.parse(A);
    if (Q.type === "keep_alive") return;
    if (Q.type === "control_response") {
      let B = this.pendingRequests.get(Q.response.request_id);
      if (!B) {
        if (this.unexpectedResponseCallback) await this.unexpectedResponseCallback(Q);
        return
      }
      if (this.pendingRequests.delete(Q.response.request_id), Q.response.subtype === "error") {
        B.reject(Error(Q.response.error));
        return
      }
      let G = Q.response.response;
      if (B.schema) try {
        B.resolve(B.schema.parse(G))
      } catch (Z) {
        B.reject(Z)
      } else B.resolve({});
      if (this.replayUserMessages) return Q;
      return
    }
    if (Q.type !== "user" && Q.type !== "control_request")
      LD0(`Error: Expected message type 'user' or 'control', got '${Q.type}'`);
    if (Q.type === "control_request") {
      if (!Q.request) LD0("Error: Missing request on control_request");
      return Q
    }
    if (Q.message.role !== "user")
      LD0(`Error: Expected message role 'user', got '${Q.message.role}'`);
    return Q
  } catch (Q) {
    console.error(`Error parsing streaming input line: ${A}: ${Q}`);
    process.exit(1)
  }
}

// READABLE (for understanding):
async processLine(line) {
  try {
    const message = JSON.parse(line);

    // Ignore keep-alive pings
    if (message.type === "keep_alive") return;

    // Handle control responses (route to pending request)
    if (message.type === "control_response") {
      const pending = this.pendingRequests.get(message.response.request_id);

      if (!pending) {
        // Unexpected response - may be callback for replay
        if (this.unexpectedResponseCallback) {
          await this.unexpectedResponseCallback(message);
        }
        return;
      }

      // Remove from pending map
      this.pendingRequests.delete(message.response.request_id);

      // Handle error responses
      if (message.response.subtype === "error") {
        pending.reject(Error(message.response.error));
        return;
      }

      // Validate and resolve response
      const response = message.response.response;
      if (pending.schema) {
        try {
          pending.resolve(pending.schema.parse(response));
        } catch (validationError) {
          pending.reject(validationError);
        }
      } else {
        pending.resolve({});
      }

      // For replay mode, return the control response
      if (this.replayUserMessages) return message;
      return;
    }

    // Validate message type
    if (message.type !== "user" && message.type !== "control_request") {
      sdkFatalError(`Error: Expected message type 'user' or 'control', got '${message.type}'`);
    }

    // Validate control requests
    if (message.type === "control_request") {
      if (!message.request) {
        sdkFatalError("Error: Missing request on control_request");
      }
      return message;
    }

    // Validate user messages
    if (message.message.role !== "user") {
      sdkFatalError(`Error: Expected message role 'user', got '${message.message.role}'`);
    }

    return message;
  } catch (parseError) {
    console.error(`Error parsing streaming input line: ${line}: ${parseError}`);
    process.exit(1);
  }
}

// Mapping: A→line, Q→message/parseError, B→pending, G→response, Z→validationError, LD0→sdkFatalError
```

---

## Error Handling

### Fatal Error Handler

```javascript
// ============================================
// sdkFatalError - Fatal error handler
// Location: chunks.156.mjs:2618-2620
// ============================================

// ORIGINAL:
function LD0(A) {
  console.error(A), process.exit(1)
}

// READABLE:
function sdkFatalError(message) {
  console.error(message);
  process.exit(1);
}

// Mapping: LD0→sdkFatalError, A→message
```

**When triggered:**
- Unknown message type received
- Missing `request` field on `control_request`
- Invalid message role on user message
- JSON parse failure

---

## Session Management

### Session ID Purpose

Every SDK message includes a `session_id` field for:

1. **Multi-session routing:** Multiple concurrent sessions on same transport
2. **State isolation:** Each session has independent conversation state
3. **Event correlation:** Match events to originating session

### Session Event Retrieval

For WebSocket mode, session events can be retrieved via API:

```javascript
// ============================================
// fetchSessionEvents - Retrieve session history
// Location: chunks.121.mjs:43-80
// ============================================

// ORIGINAL (partial):
async function uf5(A, Q, B) {
  let G = IC(B);
  try {
    let Z = `${e9().BASE_API_URL}/v1/sessions/${A}/events`;
    g(`Fetching events from: ${Z}`);
    let I = await YQ.get(Z, {
      headers: {...G, "x-organization-uuid": Q},
      timeout: 30000
    });
    // ... validation and processing
  }
}

// READABLE:
async function fetchSessionEvents(sessionId, organizationId, authToken) {
  const headers = buildAuthHeaders(authToken);
  try {
    const url = `${getConfig().BASE_API_URL}/v1/sessions/${sessionId}/events`;
    debug(`Fetching events from: ${url}`);
    const response = await axios.get(url, {
      headers: {...headers, "x-organization-uuid": organizationId},
      timeout: 30000
    });
    // ... validation and processing
  }
}

// Mapping: uf5→fetchSessionEvents, A→sessionId, Q→organizationId, B→authToken
```

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [transport_layer.md](./transport_layer.md) - Transport implementation
- [control_protocol.md](./control_protocol.md) - Control message details
