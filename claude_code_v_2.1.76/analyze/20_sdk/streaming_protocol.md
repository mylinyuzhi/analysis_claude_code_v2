# SDK Streaming Protocol (NDJSON)

## Overview

The SDK communication protocol is **newline-delimited JSON (NDJSON)** — each message is a single JSON object followed by `\n`. All messages flow over either stdio (local SDK) or WebSocket (remote SDK). The protocol is fully bidirectional with request/response correlation via `request_id`.

**Version note (v2.1.76):** A new `rate_limit` event type has been added to the server→client message set, allowing SDK clients to react to API rate-limit state without polling.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - SDK transport symbols

Key functions in this document:
- `StdioStreamIO` (so6) - Protocol processor (processLine, sendRequest, write)
- `initializeSession` (FXz) - Handles initialize control request
- `streamJsonInputHandler` (oGz) - Routes stdin → stream
- `runHeadless` (BXz) - Drives non-interactive execution loop
- `createStreamIO` (UXz) - Transport factory
- `getLastResultMessage` (gP) - Extracts final result from messages

---

## Protocol Wire Format

```
CLIENT → CLAUDE CODE (stdin / WebSocket incoming):
  {"type":"user","message":{"role":"user","content":"..."}}⏎
  {"type":"control_request","request_id":"uuid","request":{...}}⏎
  {"type":"control_response","response":{"request_id":"uuid",...}}⏎
  {"type":"keep_alive"}⏎
  {"type":"update_environment_variables","variables":{...}}⏎
  {"type":"control_cancel_request","request_id":"uuid"}⏎

CLAUDE CODE → CLIENT (stdout / WebSocket outgoing):
  {"type":"system","subtype":"init",...}⏎          ← First message
  {"type":"assistant","message":{...},...}⏎
  {"type":"stream_event","event":{...},...}⏎        ← If stream-json
  {"type":"user","message":{...},...}⏎              ← If replay mode
  {"type":"tool_use",...}⏎
  {"type":"tool_result",...}⏎
  {"type":"system","subtype":"hook_started",...}⏎
  {"type":"rate_limit","info":{...},...}⏎            ← NEW v2.1.76
  {"type":"control_request","request_id":"uuid","request":{...}}⏎  ← Permission
  {"type":"result","subtype":"success",...}⏎         ← Final message
```

---

## Client → Server Messages

### 1. `user` — User Message

Delivers a conversational message to the agent loop.

```javascript
{
  "type": "user",
  "message": {
    "role": "user",
    "content": "string | ContentBlock[]"
  }
}
```

**Validation:** `message.role` must be `"user"` (others are rejected with `process.exit(1)`).

---

### 2. `control_request` — SDK Commands

Sends a command to Claude Code. Each control request has a `request_id` that the server echoes in its `control_response`.

#### 2a. `initialize` — Session Setup

The first `control_request` sent by SDK wrappers. Must arrive before any user messages.

```javascript
{
  "type": "control_request",
  "request_id": "<uuid>",
  "request": {
    "subtype": "initialize",
    "systemPrompt": "optional override",
    "appendSystemPrompt": "optional append",
    "agents": { /* custom agent JSON */ },
    "hooks": {
      "HookEvent": [{ "matcher": "...", "hookCallbackIds": ["id1"], "timeout": 30000 }]
    },
    "jsonSchema": { /* output schema */ },
    "sdkMcpServers": ["server-name-1"],
    "promptSuggestions": true  // Enable prompt_suggestion events after each turn
  }
}
```

**What `initializeSession` (FXz) does with this:**
1. Checks if already initialized → returns error if so
2. Applies `systemPrompt` / `appendSystemPrompt` to session options
3. Parses custom agents from JSON → pushes to agent list
4. If an `agent` type is specified, loads its system prompt and model setting
5. Registers SDK-provided hooks (mapped to callback IDs)
6. Registers JSON schema for structured output validation
7. Returns `control_response` with session metadata (commands, models, account info, output styles)

```javascript
// ============================================
// initializeSession - Processes initialize control request
// Location: chunks.187.mjs:1174-1269
// ============================================

// ORIGINAL (for source lookup):
async function FXz(A, q, K, Y, z, w, H, $, O, _, J) {
    if (K) {
        Y.enqueue({ type: "control_response", response: { subtype: "error", error: "Already initialized", request_id: q, pending_permission_requests: H.getPendingPermissionRequests() } });
        return
    }
    if (A.systemPrompt !== void 0) O.systemPrompt = A.systemPrompt;
    if (A.appendSystemPrompt !== void 0) O.appendSystemPrompt = A.appendSystemPrompt;
    if (A.agents) { let W = fJ6(A.agents, "flagSettings"); _.push(...W) }
    let P = { commands: z.map(...), output_style: D, available_output_styles: ..., models: w, account: { email, organization, subscriptionType, tokenSource, apiKeySource } };
    Y.enqueue({ type: "control_response", response: { subtype: "success", request_id: q, response: P } })
}

// READABLE (for understanding):
async function initializeSession(request, requestId, isAlreadyInitialized, outputQueue, commands, models, streamIO, enableAuthStatus, sessionOptions, agentList, getSettings) {
    if (isAlreadyInitialized) {
        outputQueue.enqueue({ type: "control_response", response: { subtype: "error", error: "Already initialized", request_id: requestId, pending_permission_requests: streamIO.getPendingPermissionRequests() } });
        return
    }
    if (request.systemPrompt !== undefined) sessionOptions.systemPrompt = request.systemPrompt;
    if (request.appendSystemPrompt !== undefined) sessionOptions.appendSystemPrompt = request.appendSystemPrompt;
    if (request.agents) {
        let customAgents = parseAgentsFromJson(request.agents, "flagSettings");
        agentList.push(...customAgents);
    }
    if (request.hooks) {
        let hookMap = {};
        for (let [hookEvent, hookConfigs] of Object.entries(request.hooks)) {
            hookMap[hookEvent] = hookConfigs.map((config) => ({
                matcher: config.matcher,
                hooks: config.hookCallbackIds.map((id) => streamIO.createHookCallback(id, config.timeout))
            }));
        }
        setHooks(hookMap);
    }
    if (request.jsonSchema) setJsonSchema(request.jsonSchema);

    let sessionMetadata = {
        commands: commands.map((cmd) => ({ name: cmd.userFacingName(), description: getCommandDescription(cmd), argumentHint: cmd.argumentHint || "" })),
        output_style: getOutputStyle(),
        available_output_styles: Object.keys(getAvailableOutputStyles()),
        models: models,
        account: { email, organization, subscriptionType, tokenSource, apiKeySource }
    };
    outputQueue.enqueue({ type: "control_response", response: { subtype: "success", request_id: requestId, response: sessionMetadata } });
}

// Mapping: FXz→initializeSession, A→request, q→requestId, K→isAlreadyInitialized, Y→outputQueue, z→commands, w→models, H→streamIO, O→sessionOptions, _→agentList
```

**Initialize response payload:**
```javascript
{
  "type": "control_response",
  "response": {
    "subtype": "success",
    "request_id": "<uuid>",
    "response": {
      "commands": [{"name": "/help", "description": "...", "argumentHint": ""}],
      "output_style": "default",
      "available_output_styles": ["default", "concise", ...],
      "models": ["claude-opus-4-6", ...],
      "account": {
        "email": "user@example.com",
        "organization": "...",
        "subscriptionType": "pro",
        "tokenSource": "api_key",
        "apiKeySource": "ANTHROPIC_API_KEY"
      },
      "fast_mode_state": "on" | "off" | "cooldown"  // only if fast mode available
    }
  }
}
```

#### 2b. `interrupt` — Abort Current Operation

Signals the agent to abort the current in-progress operation.

```javascript
{
  "type": "control_request",
  "request_id": "<uuid>",
  "request": { "subtype": "interrupt" }
}
```

**Effect:** Calls `abortController.abort()`. The agent loop detects the abort signal and terminates. Sends `control_response` success immediately.

#### 2c. `set_permission_mode` — Change Permission Level

Dynamically changes the tool permission mode without restarting the session.

```javascript
{
  "type": "control_request",
  "request_id": "<uuid>",
  "request": {
    "subtype": "set_permission_mode",
    "mode": "default" | "acceptEdits" | "bypassPermissions" | "plan"
  }
}
```

**Effect:** Calls `updateAppState` to mutate `toolPermissionContext.mode`. Response is immediate success.

#### 2d. `set_model` — Override Model

Changes the active model for subsequent requests.

```javascript
{
  "type": "control_request",
  "request_id": "<uuid>",
  "request": {
    "subtype": "set_model",
    "model": "claude-opus-4-6" | "default"
  }
}
```

**Effect:** Resolves `"default"` via `getDefaultModel()`. Sets `currentModel` and calls `setModelOverride(modelName)`.

#### 2e. `set_max_thinking_tokens` — Thinking Budget

Adjusts the extended thinking token budget for subsequent turns.

```javascript
{
  "type": "control_request",
  "request_id": "<uuid>",
  "request": {
    "subtype": "set_max_thinking_tokens",
    "max_thinking_tokens": 10000 | null
  }
}
```

**Effect:** `null` disables thinking. Integer sets `sessionOptions.maxThinkingTokens`.

#### 2f. `mcp_status` — Query MCP Servers

Queries current MCP server connection status.

```javascript
{
  "type": "control_request",
  "request_id": "<uuid>",
  "request": { "subtype": "mcp_status" }
}
```

---

### 3. `control_response` — Permission Prompt Reply (Client → Server)

Sent by the client to respond to a `control_request` that the **server** issued (i.e., a permission prompt).

```javascript
// Allow:
{
  "type": "control_response",
  "response": {
    "subtype": "success",
    "request_id": "<uuid>",
    "response": { "behavior": "allow", "updatedPermissions": {...} }
  }
}

// Deny:
{
  "type": "control_response",
  "response": {
    "subtype": "success",
    "request_id": "<uuid>",
    "response": { "behavior": "deny", "message": "User denied" }
  }
}

// Error:
{
  "type": "control_response",
  "response": {
    "subtype": "error",
    "request_id": "<uuid>",
    "error": "Error message"
  }
}
```

**Processing:** `processLine` finds the pending request by `request_id`, validates response against optional Zod schema, resolves the awaited Promise. If `replayUserMessages=true`, the response is also yielded into the message stream.

---

### 4. `keep_alive` — Heartbeat

Silently consumed. No response. Used for connection health monitoring.

```javascript
{ "type": "keep_alive" }
```

---

### 5. `update_environment_variables` — Dynamic Env

Allows the SDK to update environment variables in the Claude Code process without restart.

```javascript
{
  "type": "update_environment_variables",
  "variables": {
    "ANTHROPIC_API_KEY": "new-key",
    "MY_CUSTOM_VAR": "value"
  }
}
```

**Effect:** Iterates `Object.entries(variables)` and sets each on `process.env`.

---

### 6. `control_cancel_request` — Cancel Pending Control Request

Cancels a pending `control_request` that was sent by the server (e.g., a `can_use_tool` permission prompt). Sent when the agent aborts before the client responds.

```javascript
{
  "type": "control_cancel_request",
  "request_id": "<uuid>"  // The request_id of the control_request to cancel
}
```

**When emitted:** Automatically sent by `StdioStreamIO.sendRequest()` (so6) when the AbortSignal fires. Also sent by `injectControlResponse()` when a tool response is forcefully injected.

**Effect:** Removes the corresponding entry from `pendingRequests`. The client should discard any pending response for this `request_id`.

---

## Server → Client Messages

### 1. `system` — Lifecycle and Status Events

The first message always sent after initialization. Multiple subtypes:

#### 1a. `init` — Session Initialized

```javascript
{
  "type": "system",
  "subtype": "init",
  "cwd": "/path/to/working/dir",
  "session_id": "<uuid>",
  "tools": ["Bash", "Read", "Write", "Edit", ...],
  "mcp_servers": [{"name": "filesystem", "status": "connected"}],
  "model": "claude-opus-4-6",
  "permissionMode": "default",
  "slash_commands": ["/help", "/clear", ...],
  "apiKeySource": "ANTHROPIC_API_KEY",
  "betas": ["interleaved-thinking-2025-05-14"],
  "claude_code_version": {"VERSION": "2.1.76"},
  "output_style": "default",
  "agents": ["bash", "general-purpose", ...],
  "skills": ["skill-name"],
  "plugins": [{"name": "plugin-name", "path": "/path"}],
  "uuid": "<uuid>"
}
```

#### 1b. `hook_started` — Hook Execution Begin

```javascript
{
  "type": "system",
  "subtype": "hook_started",
  "hook_id": "<uuid>",
  "hook_name": "my-hook",
  "hook_event": "PreToolUse",
  "uuid": "<uuid>",
  "session_id": "<uuid>"
}
```

#### 1c. `hook_progress` — Hook Stdout/Stderr

```javascript
{
  "type": "system",
  "subtype": "hook_progress",
  "hook_id": "<uuid>",
  "hook_name": "my-hook",
  "hook_event": "PreToolUse",
  "stdout": "partial output...",
  "stderr": "",
  "output": "combined",
  "uuid": "<uuid>",
  "session_id": "<uuid>"
}
```

#### 1d. `hook_response` — Hook Execution Complete

```javascript
{
  "type": "system",
  "subtype": "hook_response",
  "hook_id": "<uuid>",
  "hook_name": "my-hook",
  "hook_event": "PreToolUse",
  "output": "final output",
  "stdout": "stdout text",
  "stderr": "stderr text",
  "exit_code": 0,
  "outcome": "allow" | "deny" | "error",
  "uuid": "<uuid>",
  "session_id": "<uuid>"
}
```

#### 1e. `status` — Permission Mode Change

Emitted when the permission mode changes dynamically.

```javascript
{
  "type": "system",
  "subtype": "status",
  "status": "bypassPermissions" | null,
  "permissionMode": "bypassPermissions",
  "uuid": "<uuid>",
  "session_id": "<uuid>"
}
```

#### 1f. `task_notification` — Background Task Status

```javascript
{
  "type": "system",
  "subtype": "task_notification",
  "task_id": "<task-uuid>",
  "status": "running" | "completed" | "failed",
  "output_file": "/path/to/output.txt",
  "summary": "Task completed successfully",
  "session_id": "<uuid>",
  "uuid": "<uuid>"
}
```

#### 1g. `auth_status` — Authentication State

**Only emitted when `--enable-auth-status` flag is set.** Provides authentication status updates during the session.

```javascript
{
  "type": "auth_status",
  "isAuthenticating": true | false,  // true if auth request is in-flight
  "output": "...",                    // auth progress output text
  "error": "...",                     // error message if failed
  "uuid": "<uuid>",
  "session_id": "<uuid>"
}
```

**Source:** chunks.187.mjs:26-35

---

#### 1h. `elicitation_complete` — MCP Elicitation Confirmed Complete

Emitted when an MCP server sends an `elicitation_complete` notification, confirming that a URL-mode elicitation has been handled.

```javascript
{
  "type": "system",
  "subtype": "elicitation_complete",
  "mcp_server_name": "my-server",
  "elicitation_id": "<uuid>",
  "uuid": "<uuid>",
  "session_id": "<uuid>"
}
```

**Source:** chunks.187.mjs:119-126 — `setNotificationHandler(My6, ...)` fires when MCP server sends completion notification.

**Note:** Only emitted for non-SDK MCP servers (type ≠ "sdk"). SDK-type MCP servers communicate via `mcp_message` control channel.

---

### 2. `rate_limit` — API Rate Limit Information (NEW v2.1.76)

**What it does:** Emitted when the Claude API returns rate-limit headers. Allows SDK clients to implement backoff logic or surface capacity information to end users without polling.

**When emitted:** After each API response that includes `x-ratelimit-*` headers. Emitted once per turn, before the `assistant` message for that turn.

```javascript
{
  "type": "rate_limit",
  "info": {
    "requests_remaining": 42,
    "requests_reset_at": "2025-03-15T12:00:00Z",
    "tokens_remaining": 100000,
    "tokens_reset_at": "2025-03-15T12:00:00Z"
  },
  "session_id": "<uuid>",
  "uuid": "<uuid>"
}
```

**`SDKRateLimitInfo` type:**

```typescript
interface SDKRateLimitInfo {
  requests_remaining: number;       // Remaining requests in current window
  requests_reset_at: string;        // ISO 8601 timestamp when requests reset
  tokens_remaining?: number;        // Remaining tokens (may be omitted)
  tokens_reset_at?: string;         // ISO 8601 timestamp when tokens reset
}
```

**`SDKRateLimitEvent` type:**

```typescript
interface SDKRateLimitEvent {
  type: "rate_limit";
  info: SDKRateLimitInfo;
  session_id: string;
  uuid: string;
}
```

**Why this approach:**
- SDK clients previously had no visibility into rate-limit state without inspecting raw HTTP headers
- The `rate_limit` event decouples the SDK abstraction from transport-level details
- `tokens_remaining` is optional because some API tiers report only request-level limits

**Implementation Details:**

The `parseRateLimitInfo` (SJq) function extracts rate limit information from API responses:

```javascript
// ============================================
// parseRateLimitInfo - Extracts rate limit info from API response
// Location: chunks.161.mjs:2906-2935
// ============================================

// ORIGINAL (for source lookup):
function SJq(A) {
    if (!A) return;
    return {
        status: A.status,
        ...A.resetsAt !== void 0 && {
            resetsAt: A.resetsAt
        },
        ...A.rateLimitType !== void 0 && {
            rateLimitType: A.rateLimitType
        },
        ...A.utilization !== void 0 && {
            utilization: A.utilization
        },
        ...A.overageStatus !== void 0 && {
            overageStatus: A.overageStatus
        },
        ...A.overageResetsAt !== void 0 && {
            overageResetsAt: A.overageResetsAt
        },
        ...A.overageDisabledReason !== void 0 && {
            overageDisabledReason: A.overageDisabledReason
        },
        ...A.isUsingOverage !== void 0 && {
            isUsingOverage: A.isUsingOverage
        },
        ...A.surpassedThreshold !== void 0 && {
            surpassedThreshold: A.surpassedThreshold
        }
    }
}

// READABLE (for understanding):
function parseRateLimitInfo(rateLimitData) {
    if (!rateLimitData) return undefined;

    return {
        status: rateLimitData.status,
        // Only include fields that are present (sparse object pattern)
        ...(rateLimitData.resetsAt !== undefined && { resetsAt: rateLimitData.resetsAt }),
        ...(rateLimitData.rateLimitType !== undefined && { rateLimitType: rateLimitData.rateLimitType }),
        ...(rateLimitData.utilization !== undefined && { utilization: rateLimitData.utilization }),
        ...(rateLimitData.overageStatus !== undefined && { overageStatus: rateLimitData.overageStatus }),
        ...(rateLimitData.overageResetsAt !== undefined && { overageResetsAt: rateLimitData.overageResetsAt }),
        ...(rateLimitData.overageDisabledReason !== undefined && { overageDisabledReason: rateLimitData.overageDisabledReason }),
        ...(rateLimitData.isUsingOverage !== undefined && { isUsingOverage: rateLimitData.isUsingOverage }),
        ...(rateLimitData.surpassedThreshold !== undefined && { surpassedThreshold: rateLimitData.surpassedThreshold })
    };
}

// Mapping: SJq→parseRateLimitInfo, A→rateLimitData
```

**Rate Limit Event Flow in runHeadless (BXz):**

```javascript
// ============================================
// Rate limit event emission in runHeadless
// Location: chunks.187.mjs:36-44
// ============================================

// ORIGINAL (for source lookup):
let f = (T6) => {
    let D6 = SJq(T6);
    if (D6) Z.enqueue({
        type: "rate_limit_event",
        rate_limit_info: D6,
        uuid: WD(),
        session_id: R1()
    })
};

// READABLE (for understanding):
let emitRateLimitEvent = (rateLimitData) => {
    let parsedInfo = parseRateLimitInfo(rateLimitData);
    if (parsedInfo) {
        outboundQueue.enqueue({
            type: "rate_limit_event",
            rate_limit_info: parsedInfo,
            uuid: randomUUID(),
            session_id: getSessionId()
        });
    }
};

// Mapping: f→emitRateLimitEvent, T6→rateLimitData, D6→parsedInfo, Z→outboundQueue,
//          SJq→parseRateLimitInfo, WD→randomUUID, R1→getSessionId
```

**Key insight:** The rate limit system uses a callback pattern where `emitRateLimitEvent` is registered with the API layer. When rate limit headers are received, the callback transforms the raw data via `parseRateLimitInfo` and enqueues a `rate_limit_event` message to the outbound stream.

**Event Emitter Pattern (Nt):**

The rate limit event emitter uses a `Set` as a simple event bus:

```javascript
// ============================================
// Rate limit event emitter setup
// Location: chunks.85.mjs:2451
// ============================================

// ORIGINAL (for source lookup):
Jf = {
    status: "allowed",
    unifiedRateLimitFallbackAvailable: !1,
    isUsingOverage: !1
}, Nt = new Set

// READABLE (for understanding):
const DEFAULT_RATE_LIMIT_STATE = {
    status: "allowed",
    unifiedRateLimitFallbackAvailable: false,
    isUsingOverage: false
};
const rateLimitEventEmitter = new Set(); // Set of callback functions

// Mapping: Jf→DEFAULT_RATE_LIMIT_STATE, Nt→rateLimitEventEmitter
```

**Rate Limit Status Values:**

| Status | Meaning |
|--------|---------|
| `allowed` | Normal operation, within limits |
| `overage` | Exceeded limits, using overage capacity |
| `rate_limited` | Hard rate limit hit, must wait for reset |

---

### 2a. `prompt_suggestion` — Predicted Next User Prompt

Emitted after each completed agent turn when `promptSuggestions: true` was set in the `initialize` request. Provides a predicted next user message to surface as a suggestion in SDK clients.

```javascript
{
  "type": "prompt_suggestion",
  "suggestion": "What else would you like me to do?",
  "uuid": "<uuid>",
  "session_id": "<uuid>"
}
```

**When emitted:**
- After each turn completes, when `sessionOptions.promptSuggestions` is true
- AND `CLAUDE_CODE_ENABLE_PROMPT_SUGGESTION !== "false"`
- Generated asynchronously via `mp8()` with its own AbortController (cancelled on next turn start)

**Note:** `prompt_suggestion` messages are excluded from collection in the json output format (line 1728 in chunks.186.mjs: `h.type !== "prompt_suggestion"`), so they don't appear in the final message array.

---

### 3. `assistant` — Complete Assistant Turn

A complete, non-streaming assistant response (turn boundary).

```javascript
{
  "type": "assistant",
  "message": {
    "id": "msg_xxx",
    "type": "message",
    "role": "assistant",
    "content": [
      {"type": "text", "text": "..."},
      {"type": "tool_use", "id": "tu_xxx", "name": "Bash", "input": {...}},
      {"type": "thinking", "thinking": "...", "signature": "..."}
    ],
    "model": "claude-opus-4-6",
    "stop_reason": "end_turn" | "tool_use" | "max_tokens",
    "usage": {"input_tokens": 100, "output_tokens": 200}
  },
  "session_id": "<uuid>",
  "parent_tool_use_id": null | "<tool-use-id>",
  "uuid": "<uuid>"
}
```

---

### 4. `stream_event` — Raw Claude API Streaming Events

Only emitted when `--output-format=stream-json` AND `--include-partial-messages` (or verbose) is set. Carries the raw Anthropic API streaming events.

```javascript
{
  "type": "stream_event",
  "event": {
    // Raw Claude API event — one of:
    "type": "message_start" | "message_delta" | "message_stop"
           | "content_block_start" | "content_block_delta" | "content_block_stop"
  },
  "session_id": "<uuid>",
  "parent_tool_use_id": null,
  "uuid": "<uuid>"
}
```

**Token usage tracking in stream_event processing:**

```javascript
// ============================================
// streamEventTokenTracking - Track token usage from stream events
// Location: chunks.179.mjs:308-318
// ============================================

// ORIGINAL (for source lookup):
case "stream_event":
    if (q6.event.type === "message_start") f1 = LN, f1 = e51(f1, q6.event.message.usage);
    if (q6.event.type === "message_delta") f1 = e51(f1, q6.event.usage);
    if (q6.event.type === "message_stop") this.totalUsage = Af6(this.totalUsage, f1);
    if (Z) yield { type: "stream_event", event: q6.event, session_id: U6(), parent_tool_use_id: null, uuid: Y11() };
    break;

// READABLE (for understanding):
case "stream_event":
    if (event.event.type === "message_start") {
        turnUsage = defaultUsage;
        turnUsage = mergeUsage(turnUsage, event.event.message.usage);
    }
    if (event.event.type === "message_delta") turnUsage = mergeUsage(turnUsage, event.event.usage);
    if (event.event.type === "message_stop") this.totalUsage = sumUsage(this.totalUsage, turnUsage);
    if (shouldStreamEvents) yield { type: "stream_event", event: event.event, session_id: getSessionId(), parent_tool_use_id: null, uuid: generateId() };
    break;

// Mapping: q6→event, f1→turnUsage, LN→defaultUsage, e51→mergeUsage, Af6→sumUsage, Z→shouldStreamEvents, U6→getSessionId, Y11→generateId
```

**content_block_delta sub-events (the actual streaming content):**

| delta.type | Content | Used for |
|---|---|---|
| `text_delta` | `delta.text` | Streaming assistant text |
| `input_json_delta` | `delta.partial_json` | Streaming tool input JSON |
| `thinking_delta` | `delta.thinking` | Streaming extended thinking |
| `signature_delta` | `delta.signature` | Thinking block signature |

---

### 5. `user` — User Message Echo (Replay Mode)

Only emitted when `--replay-user-messages` is active. Echoes back user messages and control responses for acknowledgment.

```javascript
{
  "type": "user",
  "message": {"role": "user", "content": "..."},
  "session_id": "<uuid>",
  "parent_tool_use_id": null,
  "uuid": "<uuid>",
  "isReplay": true
}
```

---

### 6. `tool_use` — Tool Invocation

```javascript
{
  "type": "tool_use",
  "name": "Bash",
  "input": {"command": "ls -la"},
  "id": "tu_xxx",
  "session_id": "<uuid>",
  "uuid": "<uuid>"
}
```

---

### 7. `tool_result` — Tool Execution Result

```javascript
{
  "type": "tool_result",
  "tool_use_id": "tu_xxx",
  "content": [{"type": "text", "text": "output..."}],
  "is_error": false,
  "session_id": "<uuid>",
  "uuid": "<uuid>"
}
```

---

### 8. `attachment` — Structured Metadata

Carries structured metadata attached to the conversation stream.

**attachment.type variants:**

| Type | Meaning | Triggers |
|---|---|---|
| `structured_output` | Parsed JSON output matching `--json-schema` | Sets `finalStructuredOutput = attachment.data` |
| `max_turns_reached` | Turn limit hit | Emits `result` with `subtype: "error_max_turns"` then returns |
| `queued_command` | Slash command queued for execution | Emits as a `user` message with `isReplay: true` |
| `hook_cancelled` | Hook cancelled the operation | Records cancellation reason |
| `hook_stopped_continuation` | Hook halted continuation | Stops turn continuation |
| `edited_text_file` | File was edited during session | Tracks file for rewind |

```javascript
// ============================================
// attachmentMessageHandler - Processes attachment messages from agent loop
// Location: chunks.179.mjs:315-353
// ============================================

// ORIGINAL (for source lookup):
case "attachment":
    if (this.mutableMessages.push(q6), q6.attachment.type === "structured_output") y1 = q6.attachment.data;
    else if (q6.attachment.type === "max_turns_reached") {
        yield { type: "result", subtype: "error_max_turns", duration_ms: Date.now() - B, ... };
        return
    } else if (f && q6.attachment.type === "queued_command") yield {
        type: "user",
        message: { role: "user", content: q6.attachment.prompt },
        session_id: U6(), parent_tool_use_id: null, uuid: q6.attachment.source_uuid || q6.uuid, isReplay: !0
    };
    break;

// READABLE (for understanding):
case "attachment":
    collectedMessages.push(event);
    if (event.attachment.type === "structured_output") {
        finalStructuredOutput = event.attachment.data;
    } else if (event.attachment.type === "max_turns_reached") {
        yield { type: "result", subtype: "error_max_turns", ... };
        return;
    } else if (replayEnabled && event.attachment.type === "queued_command") {
        yield { type: "user", message: { role: "user", content: event.attachment.prompt }, isReplay: true, ... };
    }
    break;

// Mapping: y1→finalStructuredOutput, f→replayEnabled, B→startTime, q6→event
```

---

### 9. `control_request` — Permission Prompt (Server → Client)

The server sends this when a tool requires permission. The client must respond with a `control_response`.

**All `control_request` subtypes sent server→client:**
- `can_use_tool` — Permission prompt for a tool invocation
- `initialize` — (client→server only; server echoes response)
- `interrupt` — (client→server only)
- `set_permission_mode` (pXz) — Dynamic permission mode update
- `set_model` — Model override
- `set_max_thinking_tokens` — Thinking budget adjustment
- `mcp_status` — MCP server status query
- `rewind` (thq) — Rewind conversation to a prior state

```javascript
{
  "type": "control_request",
  "request_id": "<uuid>",
  "request": {
    "subtype": "can_use_tool",
    "tool_name": "Bash",
    "input": {"command": "rm -rf /tmp/test"},
    "tool_use_id": "tu_xxx",
    "agent_id": "<agent-uuid>"  // ID of the agent making the permission request
  }
}
```

**Cancellation:** If aborted before response, server sends a `control_cancel_request` (see section 6):
```javascript
{
  "type": "control_cancel_request",
  "request_id": "<uuid>"
}
```

---

### 10. `result` — Final Session Outcome

Always the last message. `subtype` indicates success or failure mode.

#### 10a. `success`

```javascript
{
  "type": "result",
  "subtype": "success",
  "is_error": false,
  "duration_ms": 12345,
  "duration_api_ms": 8000,
  "num_turns": 3,
  "result": "The final text output...",
  "stop_reason": null,
  "session_id": "<uuid>",
  "total_cost_usd": 0.042,
  "usage": {
    "input_tokens": 1000,
    "output_tokens": 500,
    "cache_creation_input_tokens": 200,
    "cache_read_input_tokens": 800
  },
  "modelUsage": {"claude-opus-4-6": {"input_tokens": 1000, "output_tokens": 500}},
  "permission_denials": [],
  "uuid": "<uuid>"
}
```

#### 10b. `error_max_turns`

```javascript
{
  "type": "result",
  "subtype": "error_max_turns",
  "is_error": false,
  "duration_ms": 45000,
  "duration_api_ms": 40000,
  "num_turns": 10,
  "stop_reason": "max_turns",
  "session_id": "<uuid>",
  "total_cost_usd": 0.15,
  "usage": {...},
  "modelUsage": {...},
  "permission_denials": [],
  "errors": [],
  "uuid": "<uuid>"
}
```

#### 10c. `error_max_budget_usd`

```javascript
{
  "type": "result",
  "subtype": "error_max_budget_usd",
  "is_error": true,
  "result": "",
  ...
}
```

#### 10d. `error_during_execution`

```javascript
{
  "type": "result",
  "subtype": "error_during_execution",
  "is_error": true,
  "result": "Error: Something went wrong",
  ...
}
```

---

## Output Format Comparison

The output format flag controls what gets written to stdout:

| `--output-format` | What's written | Use case |
|---|---|---|
| `text` (default) | Just the final text result string | Simple scripting |
| `json` | Single JSON object: the `result` message | Programmatic result parsing |
| `json` + `--verbose` | JSON array of ALL messages | Full conversation replay |
| `stream-json` | Every message as NDJSON, real-time | TypeScript/Python SDK |

```javascript
// ============================================
// outputFormatRouter - Routes output based on format setting
// Location: chunks.179.mjs:967-1020
// ============================================

// ORIGINAL (for source lookup):
switch ($.outputFormat) {
    case "json":
        if (!N || N.type !== "result") throw Error("No messages returned");
        if ($.verbose) { Q4(Q1(f) + `\n`); break }
        Q4(Q1(N) + `\n`);
        break;
    case "stream-json":
        break;  // Already streamed during loop
    default:
        if (!N || N.type !== "result") throw Error("No messages returned");
        switch (N.subtype) {
            case "success": Q4(N.result.endsWith(`\n`) ? N.result : N.result + `\n`); break;
            case "error_max_turns": Q4(`Error: Reached max turns (${$.maxTurns})`); break;
            case "error_max_budget_usd": Q4(`Error: Reached max budget`); break;
            case "error_during_execution": Q4(N.result + `\n`); break;
        }
}

// READABLE (for understanding):
switch (outputFormat) {
    case "json":
        if (isVerbose) { print(stringify(allMessages) + `\n`); break; }
        print(stringify(finalResult) + `\n`);
        break;
    case "stream-json":
        break;
    default:
        switch (finalResult.subtype) {
            case "success": print(addNewlineIfNeeded(finalResult.result)); break;
            case "error_max_turns": print(`Error: Reached max turns (${config.maxTurns})`); break;
            case "error_max_budget_usd": print(`Error: Reached max budget`); break;
            case "error_during_execution": print(finalResult.result + `\n`); break;
        }
}

// Mapping: $.outputFormat→outputFormat, N→finalResult, f→allMessages, Q4→print, Q1→stringify
```

---

## Message Filtering: What Gets Streamed vs. Collected

During the agent loop, messages are classified for two purposes simultaneously:

1. **Real-time streaming** (stream-json mode): Written to stdout immediately via `outputWriter.write(message)`
2. **Collection** (for final output): Pushed into `collectedMessages[]`

**Excluded from collection** (internal protocol only, never in final output):
- `control_response` — permission responses
- `control_request` — permission prompts
- `control_cancel_request` — cancellations
- `stream_event` — raw streaming events
- `keep_alive` — heartbeats
- `prompt_suggestion` — next-prompt predictions (chunks.186.mjs:1728)
- `streamlined_text` — internal text optimization
- `streamlined_tool_use_summary` — internal tool summary

**Why this matters:** The `json` output format returns `collectedMessages` (or the final `result` from it), which only contains semantically meaningful messages, not protocol overhead.

---

## Format Constraint Matrix

| Condition | Constraint |
|---|---|
| `--input-format=stream-json` | Requires `--output-format=stream-json` |
| `--sdk-url` | Forces both to `stream-json`, enables verbose |
| `--replay-user-messages` | Requires both `stream-json` |
| `--include-partial-messages` | Requires `--print` + `--output-format=stream-json` |
| `--output-format=stream-json` | Requires `--verbose` in print mode |

```javascript
// ============================================
// streamJsonInputHandler - Routes stdin to stream based on input format
// Location: chunks.189.mjs:984-997
// ============================================

// ORIGINAL (for source lookup):
async function oGz(A, q) {
    if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
        if (u8("piping"), q === "stream-json") return process.stdin;
        process.stdin.setEncoding("utf8");
        let K = "";
        return process.stdin.on("data", (Y) => { K += Y }), await new Promise((Y) => { process.stdin.on("end", Y) }), [A, K].filter(Boolean).join(`\n`)
    }
    return A
}

// READABLE (for understanding):
async function streamJsonInputHandler(userPrompt, inputFormat) {
    if (!process.stdin.isTTY && !process.argv.includes("mcp")) {
        debugLog("piping");
        if (inputFormat === "stream-json") {
            return process.stdin;  // Return raw stream for line-by-line parsing
        }
        process.stdin.setEncoding("utf8");
        let inputBuffer = "";
        process.stdin.on("data", (chunk) => { inputBuffer += chunk });
        await new Promise((resolve) => { process.stdin.on("end", resolve) });
        return [userPrompt, inputBuffer].filter(Boolean).join(`\n`);
    }
    return userPrompt;
}

// Mapping: oGz→streamJsonInputHandler, A→userPrompt, q→inputFormat, K→inputBuffer, u8→debugLog
```

**Key insight:** For `stream-json` input, the function returns the raw Node.js `ReadStream` object. For `text` input, it buffers the entire stdin and concatenates it with the command-line prompt.

---

## System Reminder Transmission in SDK Mode

### How System Reminders Flow to SDK Clients

System reminders (injected context messages with `isMeta: true`) are transmitted to SDK clients through the normal message pipeline. However, there are important differences in how they appear in SDK vs interactive mode:

```javascript
// ============================================
// System reminder message in SDK output
// ============================================

{
    "type": "user",
    "message": {
        "role": "user",
        "content": "<system-reminder>\nPlan mode is active...\n</system-reminder>"
    },
    "isMeta": true,  // SDK clients can use this flag to filter
    "session_id": "<uuid>",
    "uuid": "<uuid>"
}
```

### Silent Reminder Types in SDK Mode

Some reminder types are **silent** in SDK mode — they produce no output at all:

| Type | Interactive Mode | SDK Mode | Reason |
|------|------------------|----------|--------|
| `already_read_file` | Shows in UI | Silent (no message) | Cache hit, no new information |
| `command_permissions` | Updates UI | Silent | Internal state only |
| `hook_cancelled` | Shows notification | Silent | Non-blocking event |
| `autocheckpointing` | Shows status | Silent | Background process |
| `background_task_status` | Shows in UI | Silent via `system` message | Use `task_notification` instead |

**Why silent types matter for SDK clients:**
- Reduces message noise in the stream
- No token cost for redundant information
- Cleaner conversation transcript

### Meta Message Filtering Pattern

SDK clients can filter out meta messages (system reminders) from their UI:

```typescript
// TypeScript SDK client - filtering meta messages
for await (const event of client.stream()) {
    // Filter out system reminders from display
    if (event.type === 'user' && event.isMeta) {
        // This is a system reminder - don't show in chat UI
        // But DO include it in context for the next API call
        continue;
    }

    // Display real user messages
    displayMessage(event);
}
```

### System Reminder Injection Flow in SDK

```
┌─────────────────────────────────────────────────────────────────────────┐
│           SYSTEM REMINDER INJECTION IN SDK MODE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Agent Loop Turn Start                                                  │
│        │                                                                 │
│        ▼                                                                 │
│   assembleAttachments() - chunks.142.mjs                                │
│        │                                                                 │
│        ├── Compute changed_files, todos, plan_mode, etc.                │
│        │                                                                 │
│        └── Returns: [{ type: "plan_mode", ... }, ...]                   │
│                                                                          │
│   normalizeAttachmentForAPI() - chunks.174.mjs                          │
│        │                                                                 │
│        ├── Switch on attachment.type                                    │
│        │                                                                 │
│        ├── Creates: { type: "user", message: {...}, isMeta: true }     │
│        │                                                                 │
│        └── Wraps text in <system-reminder> XML tags via b5()            │
│                                                                          │
│   Message Stream                                                         │
│        │                                                                 │
│        ├── Meta messages included in messages[] for API call            │
│        │                                                                 │
│        └── Meta messages emitted to SDK stream with isMeta: true       │
│                                                                          │
│   SDK Client                                                             │
│        │                                                                 │
│        ├── Receives: { type: "user", isMeta: true, ... }                │
│        │                                                                 │
│        ├── Filters from UI display (isMeta check)                       │
│        │                                                                 │
│        └── May preserve for context injection                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Thinking Content as System Reminder

Extended thinking content can be wrapped as a system reminder for context persistence:

```javascript
// ============================================
// Thinking content injection as system reminder
// Location: chunks.173.mjs (via b5/af functions)
// ============================================

// When thinking completes and should be preserved
const thinkingReminder = wrapInXmlTag(thinkingContent);
// Result: "<system-reminder>\n{thinkingContent}\n</system-reminder>"

// This wrapped content can then be injected as a user message
const injectedMessage = createUserMessage({
    content: thinkingReminder,
    isMeta: true
});
```

**When this is used:**
- Thinking content needs to survive compaction
- Context preservation across long conversations
- Multi-turn reasoning chains

### SDK vs Interactive Mode Comparison

| Aspect | Interactive Mode | SDK Mode |
|--------|------------------|----------|
| Meta message display | Hidden from chat, shown in status bar | Sent in stream with `isMeta: true` |
| Silent types | May show UI indicator | No message emitted |
| Thinking panel | Real-time display | `thinking_delta` events + `assistant` message |
| Permission prompts | Modal dialog | `control_request` message |
| Hook output | Inline display | `hook_progress`/`hook_response` messages |

### Permission State as System Reminder

Permission decisions can be injected as system reminders to inform future tool calls:

```javascript
// ============================================
// Permission decision injection
// ============================================

// After user allows a tool
const permissionReminder = createUserMessage({
    content: wrapInXmlTag(`Permission granted for Bash: rm -rf /tmp/*`),
    isMeta: true
});

// This reminder informs the model that permission was granted
// and similar operations may proceed without asking again
```

For complete system reminder documentation, see [../04_system_reminder/overview.md](../04_system_reminder/overview.md).
