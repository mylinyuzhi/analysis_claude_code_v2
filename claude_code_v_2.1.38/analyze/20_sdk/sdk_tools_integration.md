# SDK Tools Integration

## Overview

Tool execution in SDK mode differs significantly from interactive CLI mode. The `isNonInteractive` flag (w4) affects permission handling, error messages, and tool behavior. This document covers the complete tool execution pipeline in SDK sessions, including the MCP-based permission prompt tool mechanism.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tool execution symbols
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - SDK mode detection
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Transport layer

Key functions in this document:
- `isNonInteractive` (w4) - Core SDK mode check
- `handlePermissionPromptToolResult` (jc1) - MCP tool permission result handler
- `permissionRequestHandler` (I51) - Core permission request logic
- `processPermissionRequestIterator` ($Jz) - Generator for permission processing
- `findTool` (Tv) - Tool lookup by name
- `toolDispatcher` (bU1) - Routes tool execution

---

## Tool Execution Pipeline in SDK Mode

### High-Level Flow

```
Agent Loop receives tool_use block
    │
    ├── Find tool by name (findTool)
    │
    ├── Check if permission needed
    │   │
    │   ├── No permission needed → Execute directly
    │   │
    │   └── Permission needed:
    │       │
    │       ├── permissionPromptToolName set?
    │       │   │
    │       │   ├── YES: Call MCP tool for permission
    │       │   │   └── handlePermissionPromptToolResult()
    │       │   │
    │       │   └── NO: Use control_request/response flow
    │       │       └── Send can_use_tool to SDK client
    │       │       └── Wait for control_response
    │       │
    │       └── Permission granted?
    │           ├── YES: Execute tool
    │           └── NO: Return denial result
    │
    └── Return tool result
```

---

## isNonInteractive Flag Propagation

### Core SDK Mode Check

```javascript
// ============================================
// isNonInteractive - Core SDK mode check
// Location: chunks.1.mjs:2730-2732
// ============================================

// ORIGINAL (for source lookup):
function w4() {
    return !o6.isInteractive
}

// READABLE (for understanding):
function isNonInteractive() {
    return !globalState.isInteractive;
}

// Mapping: w4→isNonInteractive, o6→globalState
```

**What it controls:**

The `isNonInteractive` flag is checked in 30+ locations throughout the codebase. In tool execution specifically:

| Check Location | Interactive Behavior | SDK Behavior |
|---|---|---|
| Permission prompts | Shows interactive dialog | Sends control_request or MCP tool call |
| Tool timeout handling | User can Ctrl+C | Controlled via abortSignal |
| Error messages | User-friendly with hints | Machine-parseable terse strings |
| Progress indicators | Spinner with live output | Streamed as events |

---

## Permission Prompt Tool Mechanism

### Overview

When `--permission-prompt-tool <tool-name>` is specified, Claude Code routes all permission requests through an MCP tool. This enables fully automated permission handling for CI/CD and programmatic use cases.

### Permission Tool Flow

```javascript
// ============================================
// Permission request with MCP tool flow
// Location: chunks.179.mjs:1600-1630
// ============================================

// ORIGINAL (for source lookup):
let J = new Promise((P) => {
    O.addEventListener("abort", () => P("aborted"), { once: !0 });
});
// ... call MCP tool, race with abort
let j = D, M = A.mapToolResultToToolResultBlockParam(j.data, "1");
return jc1(Gv6.parse(j9(M.content[0].text)), A, Y, z)

// READABLE (for understanding):
async function callPermissionPromptTool(permissionTool, toolInput, sessionContext, abortSignal) {
    // Build the MCP tool call
    let toolCallPayload = {
        type: "tool_use",
        name: permissionTool.name,
        input: {
            tool_name: toolInput.tool_name,
            input: toolInput.input,
            tool_use_id: toolInput.tool_use_id
        }
    };

    // Race between tool execution and abort
    let abortPromise = new Promise((resolve) => {
        abortSignal.addEventListener("abort", () => resolve("aborted"), { once: true });
    });

    // Execute MCP tool
    let result = await Promise.race([
        executeMcpToolCall(toolCallPayload),
        abortPromise
    ]);

    if (result === "aborted") {
        return { behavior: "deny", message: "Request aborted" };
    }

    // Parse and process result
    let parsedResult = PermissionToolResponseSchema.parse(result.content[0].text);
    return handlePermissionPromptToolResult(parsedResult, permissionTool, toolInput, sessionContext);
}

// Mapping: Gv6→PermissionToolResponseSchema, jc1→handlePermissionPromptToolResult
```

### handlePermissionPromptToolResult (jc1)

```javascript
// ============================================
// handlePermissionPromptToolResult - Process MCP permission result
// Location: chunks.178.mjs:989-1010
// ============================================

// ORIGINAL (for source lookup):
function jc1(A, q, K, Y) {
    let z = { type: "permissionPromptTool", permissionPromptToolName: q.name, toolResult: A };
    if (A.behavior === "allow") {
        let w = A.updatedPermissions;
        if (w) Y.setAppState((H) => ({ ...H, toolPermissionContext: WV(H.toolPermissionContext, w) })), nC(w);
        return { ...A, decisionReason: z }
    } else if (A.behavior === "deny" && A.interrupt) {
        h(`SDK permission prompt deny+interrupt: tool=${q.name} message=${A.message}`), Y.abortController.abort()
    }
    return { ...A, decisionReason: z }
}

// READABLE (for understanding):
function handlePermissionPromptToolResult(toolResult, permissionTool, toolInput, sessionContext) {
    // Build decision reason for telemetry and debugging
    let decisionReason = {
        type: "permissionPromptTool",
        permissionPromptToolName: permissionTool.name,
        toolResult: toolResult
    };

    if (toolResult.behavior === "allow") {
        // Apply permission updates if provided
        let updatedPerms = toolResult.updatedPermissions;
        if (updatedPerms) {
            // Update app state with new permissions
            sessionContext.setAppState((state) => ({
                ...state,
                toolPermissionContext: mergePermissions(state.toolPermissionContext, updatedPerms)
            }));
            // Persist to disk
            persistPermissions(updatedPerms);
        }
        return { ...toolResult, decisionReason };
    } else if (toolResult.behavior === "deny" && toolResult.interrupt) {
        // interrupt=true means abort the entire session, not just this tool
        logDebug(`SDK permission prompt deny+interrupt: tool=${permissionTool.name}`);
        sessionContext.abortController.abort();
    }
    return { ...toolResult, decisionReason };
}

// Mapping: jc1→handlePermissionPromptToolResult, A→toolResult, q→permissionTool, K→toolInput, Y→sessionContext, z→decisionReason, WV→mergePermissions, nC→persistPermissions
```

### Permission Tool Response Schema

```javascript
// The MCP permission tool must return a JSON object matching this schema:
{
    behavior: "allow" | "deny" | "ask",
    message?: string,              // Optional: message for deny/ask
    updatedPermissions?: [         // Optional: persistent permission updates
        {
            rule: "allow" | "deny",
            type: "tool" | "domain" | "path",
            value: string,
            scope: "session" | "permanent"
        }
    ],
    interrupt?: boolean,           // If true + deny: abort entire session
    updatedInput?: {...}           // Optional: modified tool input
}
```

---

## Standard control_request Permission Flow

When no `permissionPromptToolName` is set, permissions use the bidirectional `control_request`/`control_response` protocol:

### Permission Request Message (Server → Client)

```javascript
{
    "type": "control_request",
    "request_id": "<uuid>",
    "request": {
        "subtype": "can_use_tool",
        "tool_name": "Bash",
        "input": {"command": "rm -rf /tmp/test"},
        "tool_use_id": "tu_xxx"
    }
}
```

### Permission Response Message (Client → Server)

```javascript
// Allow:
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "behavior": "allow",
            "updatedPermissions": [...]
        }
    }
}

// Deny:
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "behavior": "deny",
            "message": "User denied this operation"
        }
    }
}
```

---

## Tool Result Handling Differences

### Streaming Tool Output

In SDK mode with `--output-format=stream-json`, tool results are streamed as they become available:

```javascript
// ============================================
// Tool result streaming in SDK mode
// Location: chunks.179.mjs:315-353
// ============================================

case "tool_result":
    collectedMessages.push(event);
    // Stream tool result to SDK client
    if (shouldStreamEvents) {
        yield {
            type: "tool_result",
            tool_use_id: event.tool_use_id,
            content: event.content,
            is_error: event.is_error,
            session_id: getSessionId(),
            uuid: generateId()
        };
    }
    break;
```

### Error Handling Differences

| Error Type | Interactive Mode | SDK Mode |
|---|---|---|
| Tool not found | `"Tool 'X' not found"` | Same message, no hint |
| Permission denied | Interactive dialog | Returns deny result |
| Timeout | User can cancel | Controlled via abortSignal |
| Invalid input | Shows schema | Returns validation error |

---

## MCP Tool Integration for Permissions

### Setting Up Permission Prompt Tool

**CLI Usage:**
```bash
claude --print --output-format=stream-json \
       --permission-prompt-tool my_permission_handler \
       --mcp-config mcp_config.json
```

**MCP Server Configuration:**
```json
{
    "mcpServers": {
        "my_permission_server": {
            "command": "node",
            "args": ["permission-server.js"]
        }
    }
}
```

**Permission Tool Implementation:**
```javascript
// permission-server.js - MCP server with permission tool
const server = new McpServer({ name: "permission-server", version: "1.0.0" });

server.tool(
    "my_permission_handler",
    {
        type: "object",
        properties: {
            tool_name: { type: "string" },
            input: { type: "object" },
            tool_use_id: { type: "string" }
        }
    },
    async (params) => {
        // Your permission logic here
        if (isAllowed(params.tool_name, params.input)) {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        behavior: "allow",
                        updatedPermissions: []
                    })
                }]
            };
        } else {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        behavior: "deny",
                        message: "Operation not allowed by policy"
                    })
                }]
            };
        }
    }
);
```

---

## Tool Filtering in SDK Mode

### Allowed Tools Configuration

SDK clients can restrict which tools are available:

```javascript
// CLI flags for tool restriction:
--allowed-tools Bash Read Write     // Only these tools
--disallowed-tools WebSearch WebFetch  // All except these
--tools '["Bash", "Read", "Write"]'    // Exact set (JSON)
```

### Tool Discovery in Initialize Response

The `initialize` control response includes available tools:

```javascript
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "tools": ["Bash", "Read", "Write", "Edit", "Glob", "Grep", ...],
            "mcp_tools": ["mcp_server_name.tool_name", ...],
            ...
        }
    }
}
```

---

## Summary: Tool Execution Decision Tree

```
Tool execution requested
    │
    ├── Is tool in allowed list?
    │   ├── NO → Return error: "Tool not allowed"
    │   └── YES → Continue
    │
    ├── Does tool require permission?
    │   ├── NO → Execute tool
    │   └── YES → Check permission mode
    │
    ├── Permission mode:
    │   ├── bypassPermissions → Execute without asking
    │   ├── acceptEdits → Auto-allow edit tools
    │   └── default → Request permission
    │
    ├── Permission request:
    │   ├── permissionPromptToolName set?
    │   │   ├── YES → Call MCP tool → handlePermissionPromptToolResult()
    │   │   └── NO → Send control_request → Wait for control_response
    │   │
    │   └── Result:
    │       ├── allow → Execute tool
    │       ├── deny → Return denial result
    │       └── deny+interrupt → Abort session
    │
    └── Execute tool → Return result
```