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

### createCanUseTool Method

**What it does:** Creates a permission checker callback that wraps the `checkToolPermission` function. This method is called during SDK initialization to set up the permission handling flow for tool execution.

**How it works:**
1. Receives a callback function to trigger after permission processing
2. Returns an async function that checks tool permissions
3. If permission is already decided (allow/deny), returns immediately
4. Otherwise, delegates to `processPermissionRequestIterator` for interactive handling

```javascript
// ============================================
// createCanUseTool - Creates permission checker callback
// Location: chunks.178.mjs:1181-1200
// ============================================

// ORIGINAL (for source lookup):
createCanUseTool(A) {
    return async (q, K, Y, z, w) => {
        let H = await uX(q, K, Y, z, w);
        if (H.behavior === "allow" || H.behavior === "deny") return H;
        let $ = await $Jz(q.name, w, K, Y, H.suggestions);
        if ($) return $;
        try {
            A?.();
        } catch (O) {
            // Handle callback error
        }
        // Continue with permission request...
    };
}

// READABLE (for understanding):
createCanUseTool(onPermissionPromptCallback) {
    return async (tool, input, sessionContext, toolUseId, permissionContext) => {
        // First check if permission is already determined
        let permissionResult = await checkToolPermission(
            tool,
            input,
            sessionContext,
            toolUseId,
            permissionContext
        );

        // If allow/deny already decided, return immediately
        if (permissionResult.behavior === "allow" ||
            permissionResult.behavior === "deny") {
            return permissionResult;
        }

        // Process interactive permission request
        let interactiveResult = await processPermissionRequestIterator(
            tool.name,
            permissionContext,
            sessionContext,
            permissionResult.suggestions
        );

        if (interactiveResult) return interactiveResult;

        // Trigger callback for UI notification
        try {
            onPermissionPromptCallback?.();
        } catch (error) {
            // Handle callback error silently
        }

        // Continue with permission request flow...
    };
}

// Mapping: A→onPermissionPromptCallback, q→tool, K→input, Y→sessionContext,
//   z→toolUseId, w→permissionContext, H→permissionResult, uX→checkToolPermission,
//   $Jz→processPermissionRequestIterator
```

### checkToolPermission (uX)

**What it does:** Checks tool permission before execution. Returns a permission result with behavior and suggestions.

**Return structure:**
```javascript
{
    behavior: "allow" | "deny" | "ask",
    suggestions: [
        { rule: "allow", type: "tool", value: "Bash", scope: "session" }
    ],
    blockedPath: "/path/to/blocked/file",  // Optional
    decisionReason: { type: "...", ... }    // Optional
}
```

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
        "tool_use_id": "tu_xxx",
        "permission_suggestions": [          // NEW: Suggested permission rules
            {
                "rule": "allow",
                "type": "tool",
                "value": "Bash",
                "scope": "session"
            }
        ],
        "blocked_path": "/path/to/file",     // Optional: path that triggered the permission check
        "decision_reason": {                  // Optional: why permission was triggered
            "type": "hook" | "default" | "permission_mode",
            "hookName": "PreToolUse:...",
            "reason": "..."
        }
    }
}
```

### permission_suggestions Field

**What it does:** Provides pre-computed permission rule suggestions that the SDK client can present to the user for quick selection. These suggestions are generated based on the tool type, input analysis, and current permission context.

**How suggestions are generated:**
1. Tool analysis: `checkToolPermission` analyzes the tool and input
2. Pattern matching: Matches against known permission patterns
3. Scope determination: Suggests appropriate scope (session vs permanent)
4. Rule generation: Creates suggested permission rules

**Suggestion structure:**
```javascript
{
    suggestions: [
        {
            rule: "allow" | "deny",
            type: "tool" | "domain" | "path",
            value: string,              // Tool name, domain, or path pattern
            scope: "session" | "permanent"
        }
    ]
}
```

### decision_reason Field

**What it does:** Explains why the permission request was triggered. Useful for debugging and auditing permission flows.

**Decision reason types:**

| Type | Description | Example |
|------|-------------|---------|
| `hook` | PreToolUse hook requested permission | `{ type: "hook", hookName: "PreToolUse:Bash", reason: "..." }` |
| `default` | Default permission mode requires confirmation | `{ type: "default", mode: "default" }` |
| `permission_mode` | Current permission mode setting | `{ type: "permission_mode", mode: "ask" }` |
| `permissionPromptTool` | MCP tool processed permission | `{ type: "permissionPromptTool", toolResult: {...} }` |

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

## Tool Filtering in SDK Mode

### Allowed Tools Configuration

SDK clients can restrict which tools are available through CLI flags:

```bash
# Only allow specific tools
--allowed-tools Bash Read Write

# Allow all except specific tools
--disallowed-tools WebSearch WebFetch

# Specify exact tool set (JSON format)
--tools '["Bash", "Read", "Write"]'
```

### Tool Filtering Logic

The `tools` and `disallowedTools` fields in agent configuration control tool availability:

```javascript
// ============================================
// Agent tool filtering configuration
// Location: chunks.91.mjs:48-104
// ============================================

// Agent configuration with tool restrictions
{
    agentType: "my_agent",
    whenToUse: "Use this agent for...",
    tools: ["Bash", "Read", "Write"],        // Only these tools
    disallowedTools: ["WebSearch"],          // Plus deny these
    // ... other fields
}

// Parsing function extracts tools/disallowedTools
function parseAgentConfig(agentType, jsonString, source = "flagSettings") {
    let parsed = AgentConfigSchema.parse(jsonString);

    // Get allowed tools list
    let tools = parseToolList(parsed.tools);

    // Get disallowed tools list
    let disallowedTools = parsed.disallowedTools !== undefined
        ? parseToolList(parsed.disallowedTools)
        : undefined;

    return {
        agentType,
        tools,
        disallowedTools,
        // ...
    };
}
```

### Tool Discovery in Initialize Response

The `initialize` control response includes available tools for SDK client reference:

```javascript
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "tools": [
                "Bash", "Read", "Write", "Edit", "Glob", "Grep",
                "TaskOutput", "WebFetch", "WebSearch", "TaskCreate",
                "TaskList", "TaskGet", "TaskUpdate", "TaskStop",
                "NotebookEdit", "ExitPlanMode", "EnterPlanMode",
                "AskUserQuestion", "Skill", "Agent"
            ],
            "mcp_tools": [
                "mcp_server1.tool1",
                "mcp_server1.tool2",
                "mcp_server2.tool1"
            ],
            "commands": [
                { "name": "help", "description": "Show help" },
                { "name": "clear", "description": "Clear conversation" }
            ],
            "models": ["claude-opus-4-6", "claude-sonnet-4-6"],
            // ...
        }
    }
}
```

---

## MCP Tool Integration for SDK Sessions

### MCP Tools in SDK Mode

SDK sessions can connect MCP servers through two mechanisms:

1. **SDK MCP Servers** (`sdkMcpServers` in initialize request)
   - MCP servers managed by the SDK client
   - Communication routed through `sendMcpMessage` control channel
   - See [sdk_mcp_integration.md](./sdk_mcp_integration.md) for details

2. **Permission Prompt Tool** (`--permission-prompt-tool`)
   - Special MCP tool for handling permissions programmatically
   - Routes permission requests through MCP instead of control_request

### MCP Tool Discovery Response

When MCP servers are connected, discovered tools are included in the session:

```javascript
// MCP tools are prefixed with server name
"mcp_tools": [
    "mcp_filesystem.read_file",
    "mcp_filesystem.write_file",
    "mcp_github.search_repos",
    "mcp_permission_handler.check_permission"
]
```

### Permission Tool vs Standard Permission Flow

```
Tool requires permission
    │
    ├── permissionPromptToolName set?
    │   │
    │   ├── YES: Call MCP tool via sendMcpMessage
    │   │   └── { tool_name, input, tool_use_id }
    │   │       └── Response: { behavior, message, updatedPermissions }
    │   │           └── handlePermissionPromptToolResult()
    │   │
    │   └── NO: Standard control_request flow
    │       └── sendRequest({ subtype: "can_use_tool", ... })
    │           └── Wait for control_response
    │
    └── Permission result determines tool execution
```

### Setting Up Permission Prompt Tool

```bash
# CLI usage with permission prompt tool
claude --print --output-format=stream-json \
       --permission-prompt-tool my_permission_handler \
       --mcp-config mcp_config.json
```

```javascript
// MCP server configuration
{
    "mcpServers": {
        "permission_server": {
            "command": "node",
            "args": ["permission-server.js"]
        }
    }
}

// Permission tool implementation
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
        }
        return {
            content: [{
                type: "text",
                text: JSON.stringify({
                    behavior: "deny",
                    message: "Not allowed by policy"
                })
            }]
        };
    }
);
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

---

## Cross-References

- **MCP Integration**: See [sdk_mcp_integration.md](./sdk_mcp_integration.md) for MCP server setup in SDK mode
- **Error Recovery**: See [sdk_error_recovery.md](./sdk_error_recovery.md) for tool execution error handling
- **Session Management**: See [sdk_session_management.md](./sdk_session_management.md) for tool permission persistence
- **Tool Execution Details**: See [05_tools/](../05_tools/) for tool implementation details