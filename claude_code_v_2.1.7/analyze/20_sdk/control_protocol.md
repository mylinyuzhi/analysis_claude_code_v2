# Control Protocol (Claude Code 2.1.7)

> Analysis of the control request/response protocol for permissions, hooks, and MCP routing.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK Transport module

Key functions in this document:
- `sendRequest` (wmA method) - Control request sender
- `processLine` (wmA method) - Control response router
- `canUseToolResponseSchema` (JU1) - Permission response schema
- `hookCallbackResponseSchema` (AY1) - Hook response schema
- `runSDKAgentLoop` (LR7) - Control request handler

---

## Protocol Overview

The control protocol enables bidirectional communication between Claude Code and SDK clients for:

1. **Permission Checks** - Tool usage authorization
2. **Hook Callbacks** - SDK-side hook execution
3. **MCP Routing** - Model Context Protocol message bridging
4. **Session Control** - Interrupt, model change, etc.

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
// Location: chunks.155.mjs:2697-2737
// ============================================

// Request structure
{
  type: "control_request",
  request_id: generateControlRequestId(),  // HR7()
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

### 1. can_use_tool - Permission Check (SDK → Claude Code)

**Purpose:** Claude Code requests permission decision from SDK for tool execution.

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
// canUseToolResponseSchema (JU1)
// Location: chunks.155.mjs:2600 (union of VR7, FR7)
// ============================================

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
```

**Response Example:**

```json
{
  "type": "control_response",
  "response": {
    "subtype": "success",
    "request_id": "uuid",
    "response": {
      "behavior": "allow",
      "message": "User approved",
      "toolUseID": "tool-uuid"
    }
  }
}
```

---

### 2. hook_callback - Hook Execution (SDK → Claude Code)

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
// hookCallbackResponseSchema (AY1)
// Location: chunks.155.mjs (inferred)
// ============================================

const hookCallbackResponseSchema = z.object({
  continue_: z.boolean().optional(),      // "continue" in JSON
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
    "subtype": "success",
    "request_id": "uuid",
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

### 3. mcp_message - MCP Protocol Bridge (SDK → Claude Code)

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
    "subtype": "success",
    "request_id": "uuid",
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

### 4. SDK Client → Claude Code Control Requests

These are control requests sent FROM the SDK client TO Claude Code:

#### 4.1 interrupt - Stop Current Execution

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "interrupt"
  }
}
```

**Handler:**
```javascript
// Location: chunks.155.mjs:3381-3383
if (p.request.subtype === "interrupt") {
  if (F) F.abort();  // Abort controller
  AA(p);              // Send success response
}
```

#### 4.2 initialize - Initialize Session

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "initialize",
    "systemPrompt": "Custom system prompt",
    "appendSystemPrompt": "Additional instructions",
    "sdkMcpServers": ["server1", "server2"],
    "hooks": {...},
    "jsonSchema": {...},
    "agents": [...]
  }
}
```

**Response includes:**
- Available commands
- Output style options
- Available models
- Account information (email, organization, subscription)

#### 4.3 set_permission_mode - Change Permission Level

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "set_permission_mode",
    "mode": "acceptEdits"
  }
}
```

**Permission Modes:**
| Mode | Description |
|------|-------------|
| `default` | Prompt for dangerous operations |
| `acceptEdits` | Auto-accept file edits |
| `plan` | Planning mode only |
| `bypassPermissions` | Skip all permission checks |

**Handler:**
```javascript
// Location: chunks.155.mjs:3638-3660
function updatePermissionMode(request, requestId, currentContext, queue) {
  if (request.mode === "bypassPermissions" && isBypassDisabled()) {
    queue.enqueue({
      type: "control_response",
      response: {
        subtype: "error",
        request_id: requestId,
        error: "Cannot set bypassPermissions - disabled by settings"
      }
    });
    return currentContext;
  }

  queue.enqueue({
    type: "control_response",
    response: {
      subtype: "success",
      request_id: requestId,
      response: { mode: request.mode }
    }
  });

  onToolPermissionModeChanged(currentContext.mode, request.mode);
  return { ...currentContext, mode: request.mode };
}
```

#### 4.4 set_model - Change Model

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "set_model",
    "model": "claude-sonnet-4-20250514"
  }
}
```

Use `"default"` to reset to default model.

#### 4.5 set_max_thinking_tokens - Adjust Thinking

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "set_max_thinking_tokens",
    "max_thinking_tokens": 8000
  }
}
```

Use `null` to disable thinking tokens.

#### 4.6 mcp_status - Get MCP Server Status

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "mcp_status"
  }
}
```

**Response:**
```json
{
  "response": {
    "mcpServers": [
      {"name": "calculator", "status": "connected", "serverInfo": {...}},
      {"name": "database", "status": "failed", "error": "Connection refused"}
    ]
  }
}
```

#### 4.7 rewind_files - Restore File State (NEW in 2.1.x)

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "rewind_files",
    "user_message_id": "message-uuid",
    "dry_run": false
  }
}
```

**Handler:**
```javascript
// Location: chunks.155.mjs:3604-3636
async function rewindFiles(messageId, appState, setAppState, dryRun) {
  if (!isFileCheckpointingEnabled()) {
    return { canRewind: false, error: "File rewinding is not enabled." };
  }

  if (!hasCheckpoint(appState.fileHistory, messageId)) {
    return { canRewind: false, error: "No file checkpoint found for this message." };
  }

  if (dryRun) {
    const preview = getCheckpointDiff(appState.fileHistory, messageId);
    return {
      canRewind: true,
      filesChanged: preview?.filesChanged,
      insertions: preview?.insertions,
      deletions: preview?.deletions
    };
  }

  try {
    await restoreCheckpoint((updateFn) => setAppState((state) => ({
      ...state,
      fileHistory: updateFn(state.fileHistory)
    })), messageId);
  } catch (error) {
    return { canRewind: false, error: `Failed to rewind: ${error.message}` };
  }

  return { canRewind: true };
}
```

#### 4.8 mcp_set_servers - Dynamic MCP Configuration (NEW in 2.1.x)

```json
{
  "type": "control_request",
  "request_id": "uuid",
  "request": {
    "subtype": "mcp_set_servers",
    "servers": {
      "newServer": { "type": "sdk", "name": "newServer" }
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
    "subtype": "error",
    "request_id": "uuid",
    "error": "Permission check timed out"
  }
}
```

**Processing in Claude Code:**

```javascript
// ============================================
// Error Response Handling
// Location: chunks.155.mjs:2669-2671
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
// Abort Handler in sendRequest
// Location: chunks.155.mjs:2707-2717
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

if (abortSignal) {
  abortSignal.addEventListener("abort", abortHandler, { once: true });
}
```

---

## Response Validation

### Schema-Based Validation

Responses are validated using Zod schemas before resolving:

```javascript
// ============================================
// Schema Validation
// Location: chunks.155.mjs:2673-2678
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

## Control Request Handler Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                   Control Request Processing                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input Subtype       Handler                    Effect          │
│  ──────────────────  ────────────────────────   ───────────     │
│  interrupt           → abort current operation  → response ack  │
│  initialize          → setup MCP, send caps     → response caps │
│  set_permission_mode → update context           → response ack  │
│  set_model           → change model             → response ack  │
│  set_max_thinking    → adjust token limit       → response ack  │
│  mcp_status          → collect server status    → response list │
│  mcp_message         → route to MCP server      → response ack  │
│  mcp_set_servers     → update MCP config        → response ack  │
│  rewind_files        → rollback file state      → response/err  │
│                                                                 │
│  All control requests route through AsyncMessageQueue.enqueue() │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Related Documents

- [overview.md](./overview.md) - SDK architecture overview
- [transport_layer.md](./transport_layer.md) - Transport implementation
- [message_protocol.md](./message_protocol.md) - Message types and validation
- [output_pipeline.md](./output_pipeline.md) - Output flow and AsyncMessageQueue
