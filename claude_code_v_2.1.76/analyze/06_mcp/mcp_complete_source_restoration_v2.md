# MCP Module - Complete Source Restoration v2 (Claude Code 2.1.76)

> **Complete source-level restoration** of the Model Context Protocol integration with cross-validated symbols and detailed algorithm analysis.
> **Version 2** - Enhanced with elicitation, retry logic, and progress tracking.

---

## Related Symbols

> Symbol mappings: [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions documented here:
- `fetchMcpTools` (JE) - Tool discovery - chunks.170.mjs:533
- `callMcpTool` (pC) - Tool execution - chunks.169.mjs:1910
- `executeMcpToolCall` (F3z) - Low-level execution - chunks.170.mjs:607
- `getMcpClientConnection` (yT6) - Connection management - chunks.169.mjs:1886
- `connectAllMcpServers` (ZL1) - Batch connection - chunks.169.mjs:1966
- `buildMcpToolName` ($58) - Name prefixing - chunks.170.mjs

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MCP SYSTEM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Server Connections                                                │
│     ├─ StdioClientTransport - stdin/stdout communication            │
│     ├─ SSEClientTransport - HTTP SSE streaming                      │
│     ├─ StreamableHTTPClientTransport - HTTP with streaming          │
│     └─ SDK type - Direct SDK integration                            │
│                                                                       │
│  ② Tool Discovery (JE = fetchMcpTools)                              │
│     ├─ tools/list → Discover tools                                  │
│     ├─ Tool name prefixing: mcp__<server>__<tool>                   │
│     ├─ Annotation extraction (readOnly, destructive, openWorld)     │
│     └─ Deferred loading for context efficiency                       │
│                                                                       │
│  ③ Tool Execution                                                    │
│     ├─ pC (callMcpTool) - Simplified interface                       │
│     ├─ F3z (executeMcpToolCall) - Full execution                     │
│     ├─ Retry logic for session recovery                             │
│     └─ Elicitation handling                                          │
│                                                                       │
│  ④ Elicitation System                                                │
│     ├─ Form mode - Structured UI dialog                             │
│     ├─ URL mode - OAuth/external flow                               │
│     └─ Queue-based processing                                        │
│                                                                       │
│  ⑤ Resources & Prompts                                               │
│     ├─ resources/list → Resource discovery                          │
│     ├─ resources/read → Resource content                            │
│     └─ prompts/list → Slash command-like prompts                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. fetchMcpTools (JE) - Tool Discovery

### What it does

Discovers all tools available from an MCP server via the `tools/list` JSON-RPC method, transforms them into tool objects with proper name prefixing and annotation mapping.

### How it works

1. Check if server is connected and has tools capability
2. Send `tools/list` request
3. For each tool:
   - Build prefixed name: `mcp__serverName__toolName`
   - Extract annotations to determine tool behavior
   - Create tool object with `call()` method
4. Filter out IDE-specific tools (if not allowed)
5. Return array of tool objects

### Why this approach

- **Memoization** (ZP) caches discovery results per server
- **Annotation mapping** provides semantic information about tool behavior
- **Retry logic** in `call()` handles session recovery automatically

### Key insight

The tool name prefixing (`mcp__serverName__toolName`) ensures tools from different servers don't collide, while the `CLAUDE_AGENT_SDK_MCP_NO_PREFIX` environment variable allows SDK mode to use raw names.

```javascript
// ============================================
// fetchMcpTools - Discover MCP tools via tools/list
// Location: chunks.170.mjs:533-678
// ============================================

// ORIGINAL (for source lookup):
JE = ZP(async (A) => {
    if (A.type !== "connected") return [];
    try {
        if (!A.capabilities?.tools) return [];
        let q = await A.client.request({
                method: "tools/list"
            }, $y6),
            K = Ws(q.tools),
            Y = A.config.type === "sdk" && t6(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);
        return K.map((z) => {
            let _ = $58(A.name, z.name);
            return {
                ...tZq,
                name: Y ? z.name : _,
                mcpInfo: {
                    serverName: A.name,
                    toolName: z.name
                },
                isMcp: !0,
                async description() {
                    return z.description ?? ""
                },
                async prompt() {
                    return z.description ?? ""
                },
                isConcurrencySafe() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                isReadOnly() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                toAutoClassifierInput(w) {
                    return u3z(w, z.name)
                },
                isDestructive() {
                    return z.annotations?.destructiveHint ?? !1
                },
                isOpenWorld() {
                    return z.annotations?.openWorldHint ?? !1
                },
                inputJSONSchema: z.inputSchema,
                async checkPermissions() {
                    return {
                        behavior: "passthrough",
                        message: "MCPTool requires permission.",
                        suggestions: [{
                            type: "addRules",
                            rules: [{ toolName: _, ruleContent: void 0 }],
                            behavior: "allow",
                            destination: "localSettings"
                        }]
                    }
                },
                async call(w, O, $, H, j) {
                    let J = p3z(H),
                        M = J ? { "claudecode/toolUseId": J } : {};
                    if (j && J) j({
                        toolUseID: J,
                        data: { type: "mcp_progress", status: "started",
                                serverName: A.name, toolName: z.name }
                    });
                    let D = Date.now(),
                        X = 1;  // Max retries
                    for (let P = 0;; P++) try {
                        let W = await yT6(A),
                            Z = await F3z({
                                client: W,
                                clientConnection: A,
                                tool: z.name,
                                args: w,
                                meta: M,
                                signal: O.abortController.signal,
                                setAppState: O.setAppState,
                                onProgress: j && J ? (G) => {
                                    j({ toolUseID: J, data: G });
                                } : void 0,
                                handleElicitation: O.handleElicitation
                            });
                        if (j && J) j({
                            toolUseID: J,
                            data: { type: "mcp_progress", status: "completed",
                                    serverName: A.name, toolName: z.name,
                                    elapsedTimeMs: Date.now() - D }
                        });
                        return {
                            data: Z.content,
                            ...Z._meta || Z.structuredContent ? {
                                mcpMeta: {
                                    ...Z._meta && { _meta: Z._meta },
                                    ...Z.structuredContent && { structuredContent: Z.structuredContent }
                                }
                            } : {}
                        }
                    } catch (W) {
                        if (W instanceof qn8 && P < X) {
                            n1(A.name, `Retrying tool '${z.name}' after session recovery`);
                            continue
                        }
                        if (j && J) j({
                            toolUseID: J,
                            data: { type: "mcp_progress", status: "failed",
                                    serverName: A.name, toolName: z.name,
                                    elapsedTimeMs: Date.now() - D }
                        });
                        if (W instanceof Error && !(W instanceof EV)) {
                            let Z = W.constructor.name;
                            if (Z === "Error") throw new EV(W.message, W.message.slice(0, 200));
                            if (Z === "McpError" && "code" in W && typeof W.code === "number")
                                throw new EV(W.message, `McpError ${W.code}`)
                        }
                        throw W
                    }
                },
                userFacingName() {
                    let w = z.annotations?.title || z.name;
                    return `${A.name} - ${w} (MCP)`
                },
                ...W96(A.name) ? T3z().getClaudeInChromeMCPToolOverrides(z.name) : {}
            }
        }).filter(x3z)
    } catch (q) {
        return EY(A.name, `Failed to fetch tools: ${_1(q)}`), []
    }
}, (A) => A.name, zn8)

// READABLE (for understanding):
const fetchMcpTools = memoize(async (clientConnection) => {
    // Only process connected servers
    if (clientConnection.type !== "connected") return [];

    try {
        // Check if server supports tools capability
        if (!clientConnection.capabilities?.tools) return [];

        // Request tools list via JSON-RPC
        const response = await clientConnection.client.request(
            { method: "tools/list" },
            toolsListResultSchema
        );

        const tools = ensureArray(response.tools);

        // Check if prefix should be disabled (SDK mode)
        const noPrefix = clientConnection.config.type === "sdk" &&
            isTruthy(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        return tools.map((tool) => {
            // Build prefixed name: mcp__serverName__toolName
            const prefixedName = buildMcpToolName(clientConnection.name, tool.name);

            return {
                ...baseToolProperties,
                name: noPrefix ? tool.name : prefixedName,

                mcpInfo: {
                    serverName: clientConnection.name,
                    toolName: tool.name
                },
                isMcp: true,

                // === Tool Description ===
                async description() { return tool.description ?? ""; },
                async prompt() { return tool.description ?? ""; },

                // === Annotation-Based Methods ===
                // These map MCP tool annotations to tool interface methods
                isConcurrencySafe() { return tool.annotations?.readOnlyHint ?? false; },
                isReadOnly() { return tool.annotations?.readOnlyHint ?? false; },
                isDestructive() { return tool.annotations?.destructiveHint ?? false; },
                isOpenWorld() { return tool.annotations?.openWorldHint ?? false; },

                inputJSONSchema: tool.inputSchema,

                // === Permission Check ===
                async checkPermissions() {
                    return {
                        behavior: "passthrough",
                        message: "MCPTool requires permission.",
                        suggestions: [{
                            type: "addRules",
                            rules: [{ toolName: prefixedName, ruleContent: undefined }],
                            behavior: "allow",
                            destination: "localSettings"
                        }]
                    };
                },

                // === Tool Call with Retry ===
                async call(input, sessionContext, ...args) {
                    const toolUseId = extractToolUseId(args);
                    const meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};

                    // Emit progress start
                    if (progressCallback && toolUseId) {
                        progressCallback({
                            toolUseID: toolUseId,
                            data: {
                                type: "mcp_progress",
                                status: "started",
                                serverName: clientConnection.name,
                                toolName: tool.name
                            }
                        });
                    }

                    const startTime = Date.now();
                    const maxRetries = 1;

                    // Retry loop for session recovery
                    for (let attempt = 0; ; attempt++) {
                        try {
                            const client = await getMcpClientConnection(clientConnection);
                            const result = await executeMcpToolCall({
                                client,
                                clientConnection,
                                tool: tool.name,
                                args: input,
                                meta,
                                signal: sessionContext.abortController.signal,
                                setAppState: sessionContext.setAppState,
                                onProgress: progressCallback && toolUseId ? (p) => {
                                    progressCallback({ toolUseID: toolUseId, data: p });
                                } : undefined,
                                handleElicitation: sessionContext.handleElicitation
                            });

                            // Emit progress completed
                            if (progressCallback && toolUseId) {
                                progressCallback({
                                    toolUseID: toolUseId,
                                    data: {
                                        type: "mcp_progress",
                                        status: "completed",
                                        serverName: clientConnection.name,
                                        toolName: tool.name,
                                        elapsedTimeMs: Date.now() - startTime
                                    }
                                });
                            }

                            return {
                                data: result.content,
                                ...(result._meta || result.structuredContent ? {
                                    mcpMeta: {
                                        ...(result._meta && { _meta: result._meta }),
                                        ...(result.structuredContent && { structuredContent: result.structuredContent })
                                    }
                                } : {})
                            };

                        } catch (error) {
                            // Retry on session loss
                            if (error instanceof McpSessionLostError && attempt < maxRetries) {
                                logInfo(clientConnection.name, `Retrying tool '${tool.name}' after session recovery`);
                                continue;
                            }

                            // Emit progress failed
                            if (progressCallback && toolUseId) {
                                progressCallback({
                                    toolUseID: toolUseId,
                                    data: {
                                        type: "mcp_progress",
                                        status: "failed",
                                        serverName: clientConnection.name,
                                        toolName: tool.name,
                                        elapsedTimeMs: Date.now() - startTime
                                    }
                                });
                            }

                            // Wrap generic errors
                            if (error instanceof Error && !(error instanceof McpToolExecutionError)) {
                                const errorName = error.constructor.name;
                                if (errorName === "Error") {
                                    throw new McpToolExecutionError(error.message, error.message.slice(0, 200));
                                }
                                if (errorName === "McpError" && "code" in error && typeof error.code === "number") {
                                    throw new McpToolExecutionError(error.message, `McpError ${error.code}`);
                                }
                            }
                            throw error;
                        }
                    }
                },

                userFacingName() {
                    const title = tool.annotations?.title || tool.name;
                    return `${clientConnection.name} - ${title} (MCP)`;
                },

                // Chrome extension overrides if applicable
                ...(isClaudeInChrome(clientConnection.name) ?
                    getClaudeInChromeMCPToolOverrides(tool.name) : {})
            };
        }).filter(filterToolByVisibility);  // Filter IDE tools

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (conn) => conn.name, MEMO_CACHE_KEY);

// Mapping: JE→fetchMcpTools, A→clientConnection, ZP→memoize, $58→buildMcpToolName,
//          yT6→getMcpClientConnection, F3z→executeMcpToolCall, qn8→McpSessionLostError,
//          EV→McpToolExecutionError, x3z→filterToolByVisibility, Ws→ensureArray
```

---

## 2. callMcpTool (pC) - Simplified Tool Execution

### What it does

Provides a simplified interface for executing MCP tools. Wraps the full execution with default signal handling.

```javascript
// ============================================
// callMcpTool - Execute MCP tool (simplified interface)
// Location: chunks.169.mjs:1910-1917
// ============================================

// ORIGINAL (for source lookup):
async function pC(A, q, K) {
    return (await PGq({
        client: K,
        tool: A,
        args: q,
        signal: sK().signal
    })).content
}

// READABLE (for understanding):
async function callMcpTool(toolName, args, clientConnection) {
    const result = await executeMcpToolRequest({
        client: clientConnection,
        tool: toolName,
        args: args,
        signal: getAbortController().signal
    });
    return result.content;
}

// Mapping: pC→callMcpTool, A→toolName, q→args, K→clientConnection,
//          PGq→executeMcpToolRequest, sK→getAbortController
```

---

## 3. getMcpClientConnection (yT6) - Connection Management

### What it does

Gets a valid MCP client connection, reconnecting if necessary. SDK connections bypass reconnection logic.

### How it works

1. If SDK type, return connection directly (no reconnection needed)
2. Otherwise, attempt to reconnect via `connectMcpServer`
3. If reconnection fails, throw `McpToolExecutionError`

```javascript
// ============================================
// getMcpClientConnection - Get or reconnect MCP client
// Location: chunks.169.mjs:1886-1891
// ============================================

// ORIGINAL (for source lookup):
async function yT6(A) {
    if (A.config.type === "sdk") return A;
    let q = await zh(A.name, A.config);
    if (q.type !== "connected")
        throw new EV(`MCP server "${A.name}" is not connected`, "MCP server not connected");
    return q
}

// READABLE (for understanding):
async function getMcpClientConnection(clientConnection) {
    // SDK connections don't need reconnection
    if (clientConnection.config.type === "sdk") {
        return clientConnection;
    }

    // Reconnect if needed
    const reconnected = await connectMcpServer(clientConnection.name, clientConnection.config);

    if (reconnected.type !== "connected") {
        throw new McpToolExecutionError(
            `MCP server "${clientConnection.name}" is not connected`,
            "MCP server not connected"
        );
    }

    return reconnected;
}

// Mapping: yT6→getMcpClientConnection, A→clientConnection, zh→connectMcpServer,
//          EV→McpToolExecutionError
```

---

## 4. Tool Annotation Mapping

MCP tool annotations map to tool interface methods:

| MCP Annotation | Tool Method | Purpose |
|----------------|-------------|---------|
| `readOnlyHint` | `isReadOnly()` | Tool doesn't modify state |
| `readOnlyHint` | `isConcurrencySafe()` | Safe for concurrent execution |
| `destructiveHint` | `isDestructive()` | May cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Interacts with external systems |

---

## 5. Retry Logic Algorithm

### Session Recovery Flow

```
MCP tool execution
    │
    ├─→ Attempt 1: Execute tool
    │     │
    │     ├─→ Success → Return result
    │     │
    │     └─→ Error:
    │           │
    │           ├─→ Is McpSessionLostError?
    │           │     │
    │           │     ├─→ Yes and attempts < maxRetries:
    │           │     │     ├─→ Log retry message
    │           │     │     └─→ Continue loop (reattempt)
    │           │     │
    │           │     └─→ No: Re-throw error
    │           │
    │           └─→ Is generic Error?
    │                 │
    │                 ├─→ Wrap in McpToolExecutionError
    │                 └─→ Re-throw
```

---

## 6. Progress Tracking

MCP tool execution supports progress tracking via callbacks:

```javascript
// Progress event types
type McpProgressEvent = {
    type: "mcp_progress";
    status: "started" | "completed" | "failed";
    serverName: string;
    toolName: string;
    elapsedTimeMs?: number;
};

// Progress callback signature
onProgress?: (event: { toolUseID: string; data: McpProgressEvent }) => void;
```

---

## Key Algorithms

### Tool Discovery Algorithm

```
fetchMcpTools(connection)
    │
    ├─→ Check connection type === "connected"
    │     └─→ If not: return []
    │
    ├─→ Check capabilities.tools
    │     └─→ If not: return []
    │
    ├─→ Send tools/list request
    │
    ├─→ For each tool in response:
    │     ├─→ Build prefixed name
    │     ├─→ Extract annotations
    │     ├─→ Create tool object with:
    │     │     ├─→ name (prefixed or raw)
    │     │     ├─→ mcpInfo { serverName, toolName }
    │     │     ├─→ isReadOnly/isDestructive/isOpenWorld (from annotations)
    │     │     └─→ call() with retry logic
    │     └─→ Add to result array
    │
    └─→ Filter by visibility → return tools
```

### Error Classification Algorithm

```
Classify error for telemetry:
    │
    ├─→ Is McpToolExecutionError?
    │     └─→ Use error.telemetryMessage
    │
    ├─→ Is Error with code?
    │     └─→ Return "Error:{code}"
    │
    ├─→ Is Error with unique name?
    │     └─→ Return name (max 60 chars)
    │
    └─→ Default: Return "UnknownError"
```

---

## Cross-Module Integration

### MCP ↔ Tools (05)

- MCP tools registered in tool registry with `mcp__` prefix
- Tool execution routes through standard pipeline (fxY)
- Permission checks apply to MCP tools
- Progress tracking via `mcp_progress` events
- Session recovery retry for `McpSessionLostError`

### MCP ↔ System Reminder (04)

- `mcp_resource` - MCP resource content
- `elicitation` - Elicitation request from server
- `elicitation_result` - Elicitation response
- `mcp_instructions_delta` - Server instruction changes

### MCP ↔ UI (02)

- MCP server connection status display
- Elicitation dialog rendering (form/URL modes)
- Modal priority: `elicitation` is priority 7 (low)
- Server connection status: `connected` | `needs-auth` | `disconnected`
- Progress indicator for MCP tool execution

### MCP ↔ Remote Sessions (33)

- McpHub bridges browser connections to CLI session
- Unix socket IPC for secure message passing
- Chrome extension can invoke MCP tools through bridge

---

## Symbol Validation Status

**Last validated:** 2026-03-27

| Symbol | Location | Status |
|--------|----------|--------|
| JE (fetchMcpTools) | chunks.170.mjs:533 | ✅ Correct |
| pC (callMcpTool) | chunks.169.mjs:1910 | ✅ Correct |
| F3z (executeMcpToolCall) | chunks.170.mjs:607 | ✅ Correct |
| yT6 (getMcpClientConnection) | chunks.169.mjs:1886 | ✅ Correct |
| JVq (McpHub) | chunks.178.mjs:235 | ✅ Correct |
| qn8 (McpSessionLostError) | chunks.170.mjs | ✅ Correct |
| EV (McpToolExecutionError) | chunks.170.mjs | ✅ Correct |
| WT7 (setupElicitationRequestHandler) | chunks.58.mjs:3 | ✅ Correct |
| $58 (buildMcpToolName) | chunks.170.mjs | ✅ Correct |
| ZP (memoize) | chunks.170.mjs | ✅ Correct |