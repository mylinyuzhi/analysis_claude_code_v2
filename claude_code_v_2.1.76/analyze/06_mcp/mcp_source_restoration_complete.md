# MCP Module - Complete Source Restoration

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ All symbols cross-validated against source code

---

## Overview

This document provides complete source-level restoration of key functions in the MCP (Model Context Protocol) module. MCP enables Claude Code to connect to external servers and discover their tools dynamically.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP section)

Key functions documented here:
- `fetchMcpTools` (JE) - Tool discovery - chunks.170.mjs:533
- `callMcpTool` (pC) - Tool execution - chunks.169.mjs:1910
- `getMcpClientConnection` (yT6) - Connection management - chunks.169.mjs:1886
- `disconnectMcpServer` (VN) - Disconnect - chunks.169.mjs:1877
- `buildMcpToolName` ($58) - Name prefixing - chunks.170.mjs

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MCP SYSTEM ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Server Connections                                                │
│     ├─ StdioClientTransport - stdin/stdout communication            │
│     ├─ SSEClientTransport - HTTP SSE streaming                      │
│     └─ StreamableHTTPClientTransport - HTTP with streaming          │
│                                                                       │
│  ② Tool Discovery                                                    │
│     ├─ tools/list → fetchMcpTools (JE)                              │
│     ├─ Tool name prefixing: mcp__<server>__<tool>                   │
│     └─ Deferred loading for context efficiency                       │
│                                                                       │
│  ③ Tool Execution                                                    │
│     ├─ tools/call → callMcpTool (pC)                                │
│     ├─ Result formatting (JSON → stdout simulation)                 │
│     └─ Session recovery retry                                        │
│                                                                       │
│  ④ Resources & Prompts                                               │
│     ├─ resources/list → Resource discovery                          │
│     ├─ resources/read → Resource content fetching                   │
│     └─ prompts/list → Slash command-like prompts                    │
│                                                                       │
│  ⑤ Elicitation (Server → User Input)                               │
│     ├─ Form mode - Structured UI dialog                             │
│     ├─ URL mode - OAuth/external flow                               │
│     └─ Queue-based processing                                        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. fetchMcpTools (JE) - Tool Discovery

### What it does

Discovers available tools from a connected MCP server via the `tools/list` JSON-RPC method. Creates tool objects with proper name prefixing and annotation mapping.

### How it works

1. Check if server is connected and supports tools capability
2. Send `tools/list` JSON-RPC request
3. Build prefixed tool names: `mcp__serverName__toolName`
4. Map MCP annotations to tool interface methods:
   - `readOnlyHint` → `isReadOnly()`, `isConcurrencySafe()`
   - `destructiveHint` → `isDestructive()`
   - `openWorldHint` → `isOpenWorld()`
5. Create tool objects with `call()` method including retry logic

### Why this approach

- **Memoization** (`ZP`) caches tool discovery results
- **Prefixing** avoids name collisions between servers
- **Annotation mapping** enables permission decisions without tool knowledge
- **Retry logic** handles session recovery transparently

### Key insight

The `mcp__` prefix creates a namespace that prevents tool name collisions while allowing intuitive invocation. SDK mode can disable prefixing for simpler tool names when desired.

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
                            rules: [{
                                toolName: _,
                                ruleContent: void 0
                            }],
                            behavior: "allow",
                            destination: "localSettings"
                        }]
                    }
                },
                async call(w, O, $, H, j) {
                    let J = p3z(H),
                        M = J ? {
                            "claudecode/toolUseId": J
                        } : {};
                    if (j && J) j({
                        toolUseID: J,
                        data: {
                            type: "mcp_progress",
                            status: "started",
                            serverName: A.name,
                            toolName: z.name
                        }
                    });
                    let D = Date.now(),
                        X = 1;
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
                                    j({
                                        toolUseID: J,
                                        data: G
                                    })
                                } : void 0,
                                handleElicitation: O.handleElicitation
                            });
                        if (j && J) j({
                            toolUseID: J,
                            data: {
                                type: "mcp_progress",
                                status: "completed",
                                serverName: A.name,
                                toolName: z.name,
                                elapsedTimeMs: Date.now() - D
                            }
                        });
                        return {
                            data: Z.content,
                            ...Z._meta || Z.structuredContent ? {
                                mcpMeta: {
                                    ...Z._meta && {
                                        _meta: Z._meta
                                    },
                                    ...Z.structuredContent && {
                                        structuredContent: Z.structuredContent
                                    }
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
                            data: {
                                type: "mcp_progress",
                                status: "failed",
                                serverName: A.name,
                                toolName: z.name,
                                elapsedTimeMs: Date.now() - D
                            }
                        });
                        if (W instanceof Error && !(W instanceof EV)) {
                            let Z = W.constructor.name;
                            if (Z === "Error") throw new EV(W.message, W.message.slice(0, 200));
                            if (Z === "McpError" && "code" in W && typeof W.code === "number") throw new EV(W.message, `McpError ${W.code}`)
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

        // Request tools list
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

                // Tool annotations map to methods
                async description() {
                    return tool.description ?? "";
                },

                async prompt() {
                    return tool.description ?? "";
                },

                isConcurrencySafe() {
                    return tool.annotations?.readOnlyHint ?? false;
                },

                isReadOnly() {
                    return tool.annotations?.readOnlyHint ?? false;
                },

                isDestructive() {
                    return tool.annotations?.destructiveHint ?? false;
                },

                isOpenWorld() {
                    return tool.annotations?.openWorldHint ?? false;
                },

                inputJSONSchema: tool.inputSchema,

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

                async call(input, sessionContext, ...args) {
                    const toolUseId = getToolUseId(sessionContext);
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
                                onProgress: progressCallback,
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

                            // Wrap generic errors in McpToolExecutionError
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
                }
            };
        }).filter(filterToolByVisibility);  // Filter IDE tools

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (conn) => conn.name, MEMO_CACHE_KEY);

// Mapping: JE→fetchMcpTools, A→clientConnection, ZP→memoize, $58→buildMcpToolName,
//          Ws→ensureArray, t6→isTruthy, yT6→getMcpClientConnection, F3z→executeMcpToolCall,
//          qn8→McpSessionLostError, EV→McpToolExecutionError, x3z→filterToolByVisibility
```

---

## 2. callMcpTool (pC) - Tool Execution

### What it does

Executes an MCP tool via the `tools/call` JSON-RPC method. This is a simplified interface for direct tool invocation.

### How it works

1. Get abort controller signal
2. Call executeMcpToolRequest with parameters
3. Return the content from the result

### Why this approach

- **Simplified interface** wraps the full execution for easy use
- **Signal propagation** enables cancellation
- **Direct content return** for simpler use cases

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

Gets a connected MCP client, reconnecting if necessary. For SDK connections, returns the connection directly.

### How it works

1. For SDK-type connections, return directly (no reconnection needed)
2. For other connections, attempt to reconnect via `connectMcpServer`
3. If connection fails, throw McpToolExecutionError

### Why this approach

- **SDK bypass** avoids unnecessary reconnection for embedded clients
- **Lazy reconnection** only connects when needed
- **Error wrapping** provides consistent error handling

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

    // Attempt reconnection for other types
    const reconnected = await connectMcpServer(clientConnection.name, clientConnection.config);

    if (reconnected.type !== "connected") {
        throw new McpToolExecutionError(
            `MCP server "${clientConnection.name}" is not connected`,
            "MCP server not connected"
        );
    }

    return reconnected;
}

// Mapping: yT6→getMcpClientConnection, A→clientConnection, zh→connectMcpServer, EV→McpToolExecutionError
```

---

## 4. disconnectMcpServer (VN) - Server Disconnection

### What it does

Disconnects an MCP server and cleans up all cached data for that server.

### How it works

1. Build cache key for the server
2. Try to call cleanup on connected client
3. Clear all caches (connection, tools, resources, prompts)

```javascript
// ============================================
// disconnectMcpServer - Disconnect and cleanup MCP server
// Location: chunks.169.mjs:1877-1884
// ============================================

// ORIGINAL (for source lookup):
async function VN(A, q) {
    let K = ei8(A, q);
    try {
        let Y = await zh(A, q);
        if (Y.type === "connected") await Y.cleanup()
    } catch {}
    zh.cache.delete(K), JE.cache.delete(A), Rl.cache.delete(A), K_6.cache.delete(A)
}

// READABLE (for understanding):
async function disconnectMcpServer(serverName, config) {
    const cacheKey = getConnectionCacheKey(serverName, config);

    try {
        const connection = await connectMcpServer(serverName, config);
        if (connection.type === "connected") {
            await connection.cleanup();
        }
    } catch {
        // Ignore cleanup errors
    }

    // Clear all caches
    connectMcpServer.cache.delete(cacheKey);
    fetchMcpTools.cache.delete(serverName);
    fetchMcpResources.cache.delete(serverName);
    fetchMcpPrompts.cache.delete(serverName);
}

// Mapping: VN→disconnectMcpServer, A→serverName, q→config, ei8→getConnectionCacheKey,
//          zh→connectMcpServer, JE→fetchMcpTools, Rl→fetchMcpResources, K_6→fetchMcpPrompts
```

---

## 5. Helper Functions

### getConnectionCacheKey (ei8)

```javascript
// ============================================
// getConnectionCacheKey - Build cache key for connection
// Location: chunks.169.mjs:1873-1875
// ============================================

// ORIGINAL (for source lookup):
function ei8(A, q) {
    return `${A}-${B6(q)}`
}

// READABLE (for understanding):
function getConnectionCacheKey(serverName, config) {
    return `${serverName}-${JSON.stringify(config)}`;
}

// Mapping: ei8→getConnectionCacheKey, A→serverName, q→config, B6→JSON.stringify
```

### isConfigEqual (DGq)

```javascript
// ============================================
// isConfigEqual - Compare two MCP configs
// Location: chunks.169.mjs:1893-1903
// ============================================

// ORIGINAL (for source lookup):
function DGq(A, q) {
    if (A.type !== q.type) return !1;
    let {
        scope: K,
        ...Y
    } = A, {
        scope: z,
        ..._
    } = q;
    return B6(Y) === B6(_)
}

// READABLE (for understanding):
function isConfigEqual(configA, configB) {
    // Type must match
    if (configA.type !== configB.type) return false;

    // Compare without scope (scope doesn't affect connection)
    const { scope: _, ...aWithoutScope } = configA;
    const { scope: __, ...bWithoutScope } = configB;

    return JSON.stringify(aWithoutScope) === JSON.stringify(bWithoutScope);
}

// Mapping: DGq→isConfigEqual, A→configA, q→configB, B6→JSON.stringify
```

### formatAutoClassifierInput (u3z)

```javascript
// ============================================
// formatAutoClassifierInput - Format input for auto-classifier
// Location: chunks.169.mjs:1905-1908
// ============================================

// ORIGINAL (for source lookup):
function u3z(A, q) {
    let K = Object.keys(A);
    return K.length > 0 ? K.map((Y) => `${Y}=${String(A[Y])}`).join(" ") : q
}

// READABLE (for understanding):
function formatAutoClassifierInput(input, toolName) {
    const keys = Object.keys(input);
    if (keys.length > 0) {
        return keys.map((key) => `${key}=${String(input[key])}`).join(" ");
    }
    return toolName;
}

// Mapping: u3z→formatAutoClassifierInput, A→input, q→toolName
```

---

## Tool Annotation Mapping

MCP tool annotations are mapped to tool interface methods:

| MCP Annotation | Tool Method | Purpose |
|----------------|-------------|---------|
| `readOnlyHint` | `isReadOnly()` | Tool doesn't modify state |
| `readOnlyHint` | `isConcurrencySafe()` | Safe for concurrent execution |
| `destructiveHint` | `isDestructive()` | May cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Interacts with external systems |

---

## Session Recovery Flow

```
Tool execution fails with McpSessionLostError
       │
       ▼
Check retry count < maxRetries
       │
       ├── Yes ──► Log retry attempt
       │            │
       │            ▼
       │       getMcpClientConnection()
       │            │
       │            ▼
       │       connectMcpServer()
       │            │
       │            ▼
       │       Retry tool execution
       │
       └── No ──► Throw error
```

---

## Symbol Validation Summary

| Obfuscated | Readable | File:Line | Status |
|------------|----------|-----------|--------|
| JE | fetchMcpTools | chunks.170.mjs:533 | ✅ Verified |
| pC | callMcpTool | chunks.169.mjs:1910 | ✅ Verified |
| yT6 | getMcpClientConnection | chunks.169.mjs:1886 | ✅ Verified |
| VN | disconnectMcpServer | chunks.169.mjs:1877 | ✅ Verified |
| ei8 | getConnectionCacheKey | chunks.169.mjs:1873 | ✅ Verified |
| DGq | isConfigEqual | chunks.169.mjs:1893 | ✅ Verified |
| u3z | formatAutoClassifierInput | chunks.169.mjs:1905 | ✅ Verified |
| $58 | buildMcpToolName | chunks.170.mjs | ✅ Verified |
| Ws | ensureArray | chunks.170.mjs | ✅ Verified |
| x3z | filterToolByVisibility | chunks.169.mjs:1869 | ✅ Verified |
| ZP | memoize | chunks.170.mjs | ✅ Verified |
| qn8 | McpSessionLostError | chunks.170.mjs | ✅ Verified |
| EV | McpToolExecutionError | chunks.170.mjs | ✅ Verified |

**Total validated**: 13 symbols

---

## Cross-Module Integration

### MCP ↔ Tools (05)

- MCP tools registered in tool registry with `mcp__` prefix
- Tool execution routes through standard pipeline (fxY)
- Permission checks apply to MCP tools
- Progress tracking via `mcp_progress` events

### MCP ↔ System Reminder (04)

- `mcp_resource` attachments for resource content
- `elicitation` attachments for server requests
- `elicitation_result` attachments for responses

### MCP ↔ UI (02)

- MCP server connection status display
- Elicitation dialog rendering (form/URL modes)
- Modal priority management: `elicitation` is priority 4 (lowest)
- Server status: `connected` | `needs-auth` | `disconnected`