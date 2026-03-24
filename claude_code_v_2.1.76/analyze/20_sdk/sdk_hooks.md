# SDK Hooks Integration

## Overview

SDK sessions support hooks that are fundamentally different from shell-based hooks. Instead of executing external commands, SDK hooks use callback IDs that trigger `control_request` messages to the SDK client. This allows the TypeScript/Python SDK to implement hooks as regular functions with full access to the SDK's context.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Hook execution symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK configuration
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Transport layer

Key functions in this document:
- `createHookCallback` - Creates callback wrapper for SDK hook execution (chunks.184.mjs:2167-2184)
- `initializeSession` (FXz) - Registers SDK hooks from initialize request (chunks.187.mjs:1174-1269)
- `executePreToolHooks` (qyA) - Runs PreToolUse hooks
- `executePostToolHooks` (KyA) - Runs PostToolUse hooks
- `StdioStreamIO.sendRequest` - Sends hook callback control_request

---

## SDK Hook Architecture

### Comparison: Shell Hooks vs SDK Hooks

| Aspect | Shell Hooks | SDK Hooks |
|---|---|---|
| Execution | External shell command | SDK function via control_request |
| Configuration | settings.json with `command` | initialize request with `hookCallbackIds` |
| Input | JSON via stdin | control_request payload |
| Output | JSON to stdout | control_response payload |
| Timeout | Process timeout | control_request timeout |
| Context | Limited (subprocess) | Full SDK context access |

### Hook Registration in Initialize Request

SDK hooks are registered via the `initialize` control request:

```javascript
{
    "type": "control_request",
    "request_id": "<uuid>",
    "request": {
        "subtype": "initialize",
        "hooks": {
            "PreToolUse": [{
                "matcher": "Bash",
                "hookCallbackIds": ["callback-uuid-1"],
                "timeout": 30000
            }],
            "PostToolUse": [{
                "matcher": "*",
                "hookCallbackIds": ["callback-uuid-2"],
                "timeout": 10000
            }]
        }
    }
}
```

---

## createHookCallback Method

### Implementation

```javascript
// ============================================
// createHookCallback - Creates SDK hook callback wrapper
// Location: chunks.184.mjs:2167-2184
// ============================================

// ORIGINAL (for source lookup):
createHookCallback(A, q) {
    return {
        type: "callback",
        timeout: q,
        callback: async (K, Y, z) => {
            return await this.sendRequest({
                subtype: "hook_callback",
                callback_id: A,
                input: K,
                tool_use_id: Y || void 0
            }, gN6(), z)
        }
    }
}

// READABLE (for understanding):
createHookCallback(callbackId, timeout) {
    return {
        type: "callback",
        timeout: timeout,
        callback: async (hookInput, toolUseId, abortSignal) => {
            // Send control_request to SDK client
            return await this.sendRequest(
                {
                    subtype: "hook_callback",
                    callback_id: callbackId,
                    input: hookInput,
                    tool_use_id: toolUseId || undefined
                },
                HookCallbackResponseSchema,  // Zod schema for validation
                abortSignal
            );
        }
    };
}

// Mapping: A→callbackId, q→timeout, K→hookInput, Y→toolUseId, z→abortSignal, gN6→HookCallbackResponseSchema
```

**Key aspects:**
1. **Returns a hook object** with `type: "callback"` to distinguish from shell hooks
2. **Wraps sendRequest** to communicate with SDK client via `control_request`
3. **Includes timeout** from the hook configuration
4. **Error handling** in outer layer allows execution to continue on failure

---

## Hook Registration in initializeSession

### Hook Processing Logic

```javascript
// ============================================
// initializeSession - Hook registration section
// Location: chunks.187.mjs:1210-1222
// ============================================

// ORIGINAL (for source lookup):
if (A.hooks) {
    let W = {};
    for (let [Z, G] of Object.entries(A.hooks)) W[Z] = G.map((f) => {
        let v = f.hookCallbackIds.map((N) => {
            return w.createHookCallback(N, f.timeout)
        });
        return {
            matcher: f.matcher,
            hooks: v
        }
    });
    KA6(W)
}

// READABLE (for understanding):
if (request.hooks) {
    let hookMap = {};
    for (let [hookEvent, hookConfigs] of Object.entries(request.hooks)) {
        // Each hook event (PreToolUse, PostToolUse, etc.) can have multiple configs
        hookMap[hookEvent] = hookConfigs.map((config) => ({
            matcher: config.matcher,
            hooks: config.hookCallbackIds.map((callbackId) =>
                streamIO.createHookCallback(callbackId, config.timeout)
            )
        }));
    }
    setHooks(hookMap);  // Register hooks globally
}

// Mapping: A→request, W→hookMap, Z→hookEvent, G→hookConfigs, f→config, v→hooksArray, w→streamIO, KA6→setHooks
```

---

## Hook Event Types

### Supported Hook Events

| Event | When Triggered | Input Payload |
|---|---|---|
| `PreToolUse` | Before tool execution | `{ tool_name, input, tool_use_id }` |
| `PostToolUse` | After tool execution | `{ tool_name, input, output, tool_use_id }` |
| `PrePrompt` | Before user prompt | `{ prompt }` |
| `Notification` | System notifications | `{ message, level }` |
| `Stop` | Session end | `{ reason }` |

### Hook Callback Request/Response

**Request (Server → Client):**
```javascript
{
    "type": "control_request",
    "request_id": "<uuid>",
    "request": {
        "subtype": "hook_callback",
        "callback_id": "callback-uuid-1",
        "input": {
            "tool_name": "Bash",
            "input": {"command": "ls -la"},
            "tool_use_id": "tu_xxx"
        },
        "tool_use_id": "tu_xxx"
    }
}
```

**Response (Client → Server):**
```javascript
// Allow tool execution:
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "behavior": "allow"
        }
    }
}

// Deny tool execution:
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "behavior": "deny",
            "message": "This command is not allowed"
        }
    }
}

// Modify tool input:
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "behavior": "allow",
            "updatedInput": {"command": "ls -la --color=auto"}
        }
    }
}
```

---

## Hook Execution Flow

### PreToolUse Flow

```
Tool execution requested
    │
    ├── Find hooks matching tool name
    │
    ├── For each matching hook:
    │   │
    │   ├── Hook type = "callback"?
    │   │   ├── YES: Call callback function
    │   │   │   └── sendRequest({subtype: "hook_callback", ...})
    │   │   │   └── Wait for control_response
    │   │   │
    │   │   └── NO: Execute shell command
    │   │
    │   ├── Response behavior:
    │   │   ├── "allow" → Continue to next hook
    │   │   ├── "deny" → Stop, return denial
    │   │   └── "error" → Stop, return error
    │   │
    │   └── Modified input? → Update tool input
    │
    └── All hooks passed → Execute tool
```

### PostToolUse Flow

```
Tool execution completed
    │
    ├── Find hooks matching tool name
    │
    ├── For each matching hook:
    │   │
    │   ├── Call callback with tool output
    │   │   └── sendRequest({
    │   │       subtype: "hook_callback",
    │   │       input: { tool_name, input, output, tool_use_id }
    │   │   })
    │   │
    │   └── Process response (usually just acknowledgment)
    │
    └── Return tool result
```

---

## Hook Matcher Patterns

### Matcher Syntax

| Matcher | Matches |
|---|---|
| `"*"` | All tools |
| `"Bash"` | Exact match on tool name |
| `"Bash,Read,Write"` | Multiple tools (comma-separated) |
| `["Bash", "Read"]` | Array of tool names |
| Regex pattern | Tools matching regex |

### Matcher Examples

```javascript
// Match all tools
{ "matcher": "*", "hookCallbackIds": ["log-all"] }

// Match specific tool
{ "matcher": "Bash", "hookCallbackIds": ["validate-bash"] }

// Match multiple tools
{ "matcher": "Read,Write,Edit", "hookCallbackIds": ["file-operations"] }

// Match MCP tools
{ "matcher": "mcp_*", "hookCallbackIds": ["mcp-logger"] }
```

---

## Hook Response Schema

### Behavior Types

```typescript
interface HookResponse {
    behavior: "allow" | "deny" | "error";
    message?: string;           // Message for deny/error
    updatedInput?: object;      // Modified tool input (PreToolUse only)
    reason?: string;            // Reason for decision
}
```

### Behavior Effects

| Behavior | Effect on Tool Execution |
|---|---|
| `allow` | Tool executes normally |
| `allow` + `updatedInput` | Tool executes with modified input |
| `deny` | Tool execution blocked, denial message returned |
| `deny` + `interrupt` | Tool blocked, entire session aborted |
| `error` | Tool execution failed with error message |

---

## TypeScript SDK Hook Example

```typescript
// TypeScript SDK: Registering hooks
import { Claude } from "@anthropic-ai/claude-code-sdk";

const client = new Claude();

// Register a PreToolUse hook for Bash
const session = await client.run("List the files", {
    hooks: {
        PreToolUse: [{
            matcher: "Bash",
            hookCallbackIds: ["validate-bash-command"],
            timeout: 30000
        }]
    },
    hookHandlers: {
        "validate-bash-command": async (input) => {
            // Your validation logic
            if (input.input.command.includes("rm -rf")) {
                return {
                    behavior: "deny",
                    message: "Destructive commands are not allowed"
                };
            }
            return { behavior: "allow" };
        }
    }
});
```

---

## Hook Timeout Handling

### Timeout Configuration

```javascript
// Hook configuration with timeout
{
    "matcher": "Bash",
    "hookCallbackIds": ["slow-validation"],
    "timeout": 60000  // 60 seconds
}
```

### Timeout Behavior

1. Hook callback is called with the specified timeout
2. If no `control_response` is received within timeout:
   - Hook is considered failed
   - Error is logged
   - Tool execution proceeds (safe default) or is denied based on hook type

```javascript
// In createHookCallback, timeout is passed to sendRequest
return await this.sendRequest(
    { subtype: "hook_callback", ... },
    HookCallbackResponseSchema,
    AbortSignal.timeout(timeout)  // Abort after timeout
);
```

---

## Differences from Shell Hooks

### Key Architectural Differences

**Shell Hooks:**
- Execute in separate process
- Communicate via stdin/stdout
- Limited context access
- Can run any shell command
- Process management overhead

**SDK Callback Hooks:**
- Execute within SDK client process
- Communicate via control_request/response
- Full SDK context access
- SDK client handles the callback
- No separate process overhead

### When to Use Each

| Use Shell Hooks When | Use SDK Callbacks When |
|---|---|
| Independent validation scripts | SDK has context needed |
| External services integration | Callback needs SDK state |
| Legacy hook scripts | Performance is critical |
| Multi-language hook implementations | Same language as SDK |

---

## Summary: SDK Hook Flow

```
initialize request received
    │
    ├── Parse hooks configuration
    │
    └── For each hook event:
        └── For each hook config:
            └── createHookCallback(callbackId, timeout)
                └── Returns: {
                    type: "callback",
                    timeout: number,
                    callback: async (input, toolUseId, signal) => {...}
                }

Tool execution (PreToolUse hook):
    │
    ├── Find matching hooks
    │
    └── For each hook:
        └── hook.callback(input, toolUseId, signal)
            └── sendRequest({subtype: "hook_callback", callback_id, input})
                └── SDK client receives control_request
                    └── SDK client executes handler
                        └── control_response returned
                            └── Hook response processed
                                ├── allow → Continue
                                ├── deny → Block tool
                                └── error → Handle error
```
