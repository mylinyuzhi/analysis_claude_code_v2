# Control Protocol

> Analysis of the control request/response protocol for permissions, hooks, and MCP routing.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - SDK Transport module

Key functions in this document:
- `sendRequest` (aSA method) - Control request sender
- `processLine` (aSA method) - Control response router
- `canUseToolResponseSchema` (ZW1) - Permission response schema
- `hookCallbackResponseSchema` (Q91) - Hook response schema
- `generateControlRequestId` (lg3) - Request ID generator

---

## Protocol Overview

The control protocol enables bidirectional communication between Claude Code and SDK clients for:

1. **Permission Checks** - Tool usage authorization
2. **Hook Callbacks** - SDK-side hook execution
3. **MCP Routing** - Model Context Protocol message bridging

```
┌─────────────────────────────────────────────────────────────────┐
│                     Control Protocol Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Claude Code                              SDK Client            │
│      │                                        │                 │
│      │  control_request                       │                 │
│      │  {type: "control_request",             │                 │
│      │   request_id: "abc123",                │                 │
│      │   request: {...}}                      │                 │
│      │ ────────────────────────────────────> │                 │
│      │                                        │                 │
│      │                          Process       │                 │
│      │                          request       │                 │
│      │                                        │                 │
│      │  control_response                      │                 │
│      │  {type: "control_response",            │                 │
│      │   response: {                          │                 │
│      │     request_id: "abc123",              │                 │
│      │     response: {...}}}                  │                 │
│      │ <──────────────────────────────────── │                 │
│      │                                        │                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request ID Correlation

### How Correlation Works

1. Claude Code generates unique `request_id` for each control request
2. Request is stored in `pendingRequests` Map with resolve/reject handlers
3. SDK processes request and returns response with same `request_id`
4. Response is matched to pending request and Promise is resolved

```javascript
// ============================================
// Request ID Generation Pattern
// Location: chunks.156.mjs:2524
// ============================================

// Request structure
{
  type: "control_request",
  request_id: lg3(),  // generateControlRequestId()
  request: {
    subtype: "can_use_tool",
    // ... request-specific fields
  }
}

// Pending request storage
pendingRequests.set(requestId, {
  request: fullRequest,
  resolve: (response) => resolvePromise(response),
  reject: (error) => rejectPromise(error),
  schema: responseSchema  // Zod schema for validation
});
```

---

## Control Request Subtypes

### 1. can_use_tool - Permission Check

**Purpose:** Request permission decision from SDK for tool execution.

**Trigger:** When local permission rules result in "ask" (not decisive allow/deny).

**Request Structure:**

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "can_use_tool",
    "tool_name": "Bash",
    "input": {
      "command": "rm -rf /tmp/test"
    },
    "permission_suggestions": [
      {"type": "allow_once"},
      {"type": "deny_once"},
      {"type": "allow_always", "pattern": "Bash(rm:*)"}
    ],
    "blocked_path": "/sensitive/path",
    "decision_reason": "Command modifies filesystem",
    "tool_use_id": "tool-uuid",
    "agent_id": "main"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `tool_name` | `string` | Name of tool being invoked |
| `input` | `object` | Tool input parameters |
| `permission_suggestions` | `array` | Suggested permission options |
| `blocked_path` | `string?` | Path that triggered permission check |
| `decision_reason` | `string` | Formatted reason for check |
| `tool_use_id` | `string` | Unique tool use identifier |
| `agent_id` | `string` | Agent making the request |

**Response Schema:**

```javascript
// ============================================
// canUseToolResponseSchema (ZW1)
// Location: chunks.156.mjs:2578
// ============================================

const canUseToolResponseSchema = z.object({
  behavior: z.enum(["allow", "deny", "prompt"]),
  message: z.string().optional(),
  toolUseID: z.string().optional()
});
```

**Response Example:**

```json
{
  "type": "control_response",
  "response": {
    "request_id": "uuid",
    "subtype": "can_use_tool_response",
    "response": {
      "behavior": "allow",
      "message": "User approved",
      "toolUseID": "tool-uuid"
    }
  }
}
```

---

### 2. hook_callback - Hook Execution

**Purpose:** Execute SDK-registered hook callback.

**Trigger:** When a hook event fires and SDK has registered a callback.

**Request Structure:**

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "hook_callback",
    "callback_id": "hook-callback-uuid",
    "input": {
      "hook_event_name": "PreToolUse",
      "tool_name": "Bash",
      "tool_input": {
        "command": "npm install"
      }
    },
    "tool_use_id": "tool-uuid"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `callback_id` | `string` | SDK-assigned callback identifier |
| `input` | `object` | Hook event input data |
| `tool_use_id` | `string?` | Associated tool use (if applicable) |

**Response Schema:**

```javascript
// ============================================
// hookCallbackResponseSchema (Q91)
// Location: chunks.156.mjs:2600
// ============================================

const hookCallbackResponseSchema = z.object({
  continue_: z.boolean().optional(),  // "continue" in JSON
  suppressOutput: z.boolean().optional(),
  stopReason: z.string().optional(),
  decision: z.enum(["block"]).optional(),
  systemMessage: z.string().optional(),
  reason: z.string().optional(),
  hookSpecificOutput: z.object({
    hookEventName: z.string(),
    // ... event-specific fields
  }).optional()
});
```

**Response Example (PreToolUse deny):**

```json
{
  "type": "control_response",
  "response": {
    "request_id": "uuid",
    "subtype": "hook_callback_response",
    "response": {
      "hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": "Blocked by policy"
      }
    }
  }
}
```

---

### 3. mcp_message - MCP Protocol Bridge

**Purpose:** Route MCP protocol messages through SDK transport.

**Trigger:** When in-process MCP server needs to communicate.

**Request Structure:**

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "mcp_message",
    "server_name": "calculator",
    "message": {
      "method": "tools/list",
      "params": {}
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `server_name` | `string` | MCP server identifier |
| `message` | `object` | MCP protocol message |

**Response:**

```json
{
  "type": "control_response",
  "response": {
    "request_id": "uuid",
    "subtype": "mcp_message_response",
    "response": {
      "mcp_response": {
        "tools": [
          {"name": "add", "description": "Add two numbers", "inputSchema": {...}}
        ]
      }
    }
  }
}
```

---

## Error Handling

### Error Response

When request processing fails:

```json
{
  "type": "control_response",
  "response": {
    "request_id": "uuid",
    "subtype": "error",
    "error": "Permission check timed out"
  }
}
```

**Processing in Claude Code:**

```javascript
// ============================================
// Error Response Handling
// Location: chunks.156.mjs:2495-2497
// ============================================

// ORIGINAL:
if (Q.response.subtype === "error") {
  B.reject(Error(Q.response.error));
  return
}

// READABLE:
if (message.response.subtype === "error") {
  pending.reject(Error(message.response.error));
  return;
}
```

### Abort/Cancel Request

When SDK client cancels a pending request:

```json
{
  "type": "control_cancel_request",
  "request_id": "uuid"
}
```

**Processing:**

```javascript
// ============================================
// Abort Handler
// Location: chunks.156.mjs:2533-2539
// ============================================

// READABLE:
const abortHandler = () => {
  // Send cancel request to SDK
  this.write({
    type: "control_cancel_request",
    request_id: requestId
  });

  // Reject pending promise
  const pending = this.pendingRequests.get(requestId);
  if (pending) {
    pending.reject(new AbortError());
  }
};
```

---

## Response Validation

### Schema-Based Validation

Responses are validated using Zod schemas before resolving:

```javascript
// ============================================
// Schema Validation
// Location: chunks.156.mjs:2500-2504
// ============================================

// ORIGINAL:
let G = Q.response.response;
if (B.schema) try {
  B.resolve(B.schema.parse(G))
} catch (Z) {
  B.reject(Z)
} else B.resolve({});

// READABLE:
const responseData = message.response.response;

if (pending.schema) {
  try {
    // Validate against schema and resolve
    pending.resolve(pending.schema.parse(responseData));
  } catch (validationError) {
    // Reject on validation failure
    pending.reject(validationError);
  }
} else {
  // No schema, resolve with empty object
  pending.resolve({});
}
```

**Key insight:** Schema validation ensures type safety for control responses, catching malformed responses before they affect agent behavior.

---

## Permission Check Flow

### Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        Permission Check Flow                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Agent Loop                Transport Layer              SDK Client       │
│      │                          │                           │            │
│      │ Tool invocation          │                           │            │
│      │────────────────────────> │                           │            │
│      │                          │                           │            │
│      │                          │ Check local rules         │            │
│      │                          │ (toolPermissionDispatcher)│            │
│      │                          │                           │            │
│      │                          │ Result: "ask"             │            │
│      │                          │                           │            │
│      │                          │ control_request           │            │
│      │                          │ {can_use_tool}            │            │
│      │                          │──────────────────────────>│            │
│      │                          │                           │            │
│      │                          │           ┌───────────────┤            │
│      │                          │           │ Process       │            │
│      │                          │           │ permission    │            │
│      │                          │           │ callback      │            │
│      │                          │           └───────────────┤            │
│      │                          │                           │            │
│      │                          │ control_response          │            │
│      │                          │ {behavior: "allow"}       │            │
│      │                          │<──────────────────────────│            │
│      │                          │                           │            │
│      │ Permission result        │                           │            │
│      │<──────────────────────── │                           │            │
│      │                          │                           │            │
│      │ Execute tool             │                           │            │
│      │                          │                           │            │
└──────────────────────────────────────────────────────────────────────────┘
```

### Code Path

```javascript
// 1. createCanUseTool() creates callback
const canUseTool = transport.createCanUseTool();

// 2. Tool invocation triggers callback
const permission = await canUseTool(tool, input, context, globals, toolUseId);

// 3. Inside createCanUseTool:
//    a. Check local rules first
const localResult = await toolPermissionDispatcher(tool, input, context, globals, toolUseId);

//    b. If decisive, return immediately
if (localResult.behavior === "allow" || localResult.behavior === "deny") {
  return localResult;
}

//    c. Otherwise, ask SDK
const sdkResponse = await this.sendRequest({
  subtype: "can_use_tool",
  tool_name: tool.name,
  // ...
}, canUseToolResponseSchema, abortSignal);

// 4. Process SDK response
return processToolPermissionResponse(sdkResponse, tool, input, context);
```

---

## Hook Callback Flow

### Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         Hook Callback Flow                                │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Hook System               Transport Layer              SDK Client       │
│      │                          │                           │            │
│      │ PreToolUse event         │                           │            │
│      │────────────────────────> │                           │            │
│      │                          │                           │            │
│      │                          │ createHookCallback()      │            │
│      │                          │ returns callback          │            │
│      │                          │                           │            │
│      │                          │ control_request           │            │
│      │                          │ {hook_callback}           │            │
│      │                          │──────────────────────────>│            │
│      │                          │                           │            │
│      │                          │           ┌───────────────┤            │
│      │                          │           │ Execute       │            │
│      │                          │           │ Python        │            │
│      │                          │           │ callback      │            │
│      │                          │           └───────────────┤            │
│      │                          │                           │            │
│      │                          │ control_response          │            │
│      │                          │ {hookSpecificOutput}      │            │
│      │                          │<──────────────────────────│            │
│      │                          │                           │            │
│      │ Hook result              │                           │            │
│      │<──────────────────────── │                           │            │
│      │                          │                           │            │
│      │ Apply hook decision      │                           │            │
│      │                          │                           │            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Timeout Handling

### Request Timeout via AbortSignal

```javascript
// ============================================
// Timeout Integration
// Location: chunks.156.mjs:2541-2543
// ============================================

// AbortSignal integration in sendRequest
if (abortSignal) {
  abortSignal.addEventListener("abort", abortHandler, { once: true });
}

// Hook callbacks include timeout
createHookCallback(callbackId, timeout) {
  return {
    type: "callback",
    timeout: timeout,  // Passed to AbortController
    callback: async (input, toolUseId, abortSignal) => {
      // abortSignal fires after timeout
      await this.sendRequest(..., abortSignal);
    }
  };
}
```

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [transport_layer.md](./transport_layer.md) - Transport implementation
- [python_sdk_usage.md](./python_sdk_usage.md) - Python SDK hooks
