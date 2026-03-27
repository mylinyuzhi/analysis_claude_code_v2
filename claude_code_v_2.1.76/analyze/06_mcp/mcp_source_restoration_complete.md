# MCP Module - Complete Source Restoration

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ All symbols cross-validated against source code

---

## Overview

This document provides complete source-level restoration of key functions in the MCP (Model Context Protocol) module. MCP enables Claude Code to connect to external servers and discover their tools dynamically.

---

## 1. Fetch MCP Tools (JE)

### What it does
Discovers available tools from a connected MCP server via the `tools/list` JSON-RPC method. Creates tool objects with proper name prefixing and annotation mapping.

### How it works
1. Check if server is connected and supports tools
2. Send `tools/list` request
3. Build prefixed tool names: `mcp__serverName__toolName`
4. Map MCP annotations to tool interface methods
5. Create tool objects with `call()` method including retry logic

### Source Code

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
                                    j({ toolUseID: J, data: G })
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
                                duration: Date.now() - D
                            }
                        });
                        return { data: Z.content, isMcp: !0, rawMcpResult: Z };
                    } catch (W) {
                        if (W instanceof qn8 && P < X) {
                            n1(A.name, `Retrying tool '${z.name}' after session recovery`);
                            continue;
                        }
                        throw W;
                    }
                }
            };
        }).filter(x3z);
    } catch (q) {
        return EY(A.name, `Failed to fetch tools: ${_1(q)}`), [];
    }
}, (A) => A.name, zn8);

// READABLE (for understanding):
const fetchMcpTools = memoize(async (clientConnection) => {
    // Step 1: Check connection status
    if (clientConnection.type !== "connected") {
        return [];
    }

    try {
        // Step 2: Check if server supports tools capability
        if (!clientConnection.capabilities?.tools) {
            return [];
        }

        // Step 3: Send tools/list request
        const response = await clientConnection.client.request(
            { method: "tools/list" },
            toolsListResultSchema
        );

        const tools = ensureArray(response.tools);

        // Step 4: Check if prefix should be disabled (SDK mode)
        const noPrefix = clientConnection.config.type === "sdk" &&
            parseBoolean(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        // Step 5: Map each tool to a tool object
        return tools.map((tool) => {
            // Build prefixed name: mcp__serverName__toolName
            const prefixedName = buildMcpToolName(clientConnection.name, tool.name);

            return {
                ...baseToolProperties,
                name: noPrefix ? tool.name : prefixedName,

                // MCP-specific metadata
                mcpInfo: {
                    serverName: clientConnection.name,
                    toolName: tool.name
                },
                isMcp: true,

                // Tool description
                async description() {
                    return tool.description ?? "";
                },
                async prompt() {
                    return tool.description ?? "";
                },

                // Map MCP annotations to tool interface methods
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

                // Input schema
                inputJSONSchema: tool.inputSchema,

                // Permission handling
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

                // Tool execution with retry logic
                async call(input, sessionContext, progressCallback, context, onProgress) {
                    const toolUseId = extractToolUseId(context);
                    const meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};

                    // Send progress start notification
                    if (onProgress && toolUseId) {
                        onProgress({
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
                            // Get/reconnect client
                            const client = await getMcpClientConnection(clientConnection);

                            // Execute tool
                            const result = await executeMcpToolCall({
                                client,
                                clientConnection,
                                tool: tool.name,
                                args: input,
                                meta,
                                signal: sessionContext.abortController.signal,
                                setAppState: sessionContext.setAppState,
                                onProgress: onProgress && toolUseId ? (progress) => {
                                    onProgress({ toolUseID: toolUseId, data: progress });
                                } : undefined,
                                handleElicitation: sessionContext.handleElicitation
                            });

                            // Send progress completion notification
                            if (onProgress && toolUseId) {
                                onProgress({
                                    toolUseID: toolUseId,
                                    data: {
                                        type: "mcp_progress",
                                        status: "completed",
                                        serverName: clientConnection.name,
                                        toolName: tool.name,
                                        duration: Date.now() - startTime
                                    }
                                });
                            }

                            return {
                                data: result.content,
                                isMcp: true,
                                rawMcpResult: result
                            };

                        } catch (error) {
                            // Retry on session loss
                            if (error instanceof McpSessionLostError && attempt < maxRetries) {
                                logInfo(clientConnection.name,
                                    `Retrying tool '${tool.name}' after session recovery`);
                                continue;
                            }
                            throw error;
                        }
                    }
                }
            };
        }).filter(filterToolByVisibility);  // Filter out IDE tools

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (connection) => connection.name, MEMO_CACHE_KEY);

// Mapping: JE→fetchMcpTools, A→clientConnection, ZP→memoize, $58→buildMcpToolName,
//          Ws→ensureArray, t6→parseBoolean, yT6→getMcpClientConnection, F3z→executeMcpToolCall,
//          qn8→McpSessionLostError, x3z→filterToolByVisibility, $y6→toolsListResultSchema,
//          n1→logInfo, EY→logError, _1→formatError, p3z→extractToolUseId, u3z→formatToolInput,
//          tZq→baseToolProperties, zn8→MEMO_CACHE_KEY
```

### Why this approach
1. **Memoization** (`ZP`) caches tool discovery results per server name
2. **Prefix naming** (`mcp__server__tool`) prevents name collisions across servers
3. **Annotation mapping** converts MCP hints to tool interface methods
4. **Retry loop** handles transient session disconnections

### Key insight
The `call()` method includes a retry loop that catches `McpSessionLostError` and attempts reconnection. This handles the case where the MCP server process restarts.

---

## 2. Call MCP Tool (pC)

### What it does
Simple interface for executing an MCP tool. Wraps the full execution with proper signal handling.

### Source Code

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

### Key insight
This is a simplified interface used by components like DiagnosticsManager. The full tool execution path uses `fetchMcpTools` → `tool.call()` → `F3z` (executeMcpToolCall).

---

## 3. Get MCP Client Connection (yT6)

### What it does
Gets a connected MCP client, reconnecting if necessary. Throws `McpToolExecutionError` if connection fails.

### How it works
1. SDK connections are passed through directly
2. Call `connectMcpServer` to reconnect
3. Throw error if reconnection fails

### Source Code

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
    // SDK connections don't need reconnection - they manage their own lifecycle
    if (clientConnection.config.type === "sdk") {
        return clientConnection;
    }

    // Attempt to reconnect
    const reconnected = await connectMcpServer(
        clientConnection.name,
        clientConnection.config
    );

    // Throw error if reconnection failed
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

### Key insight
SDK-type connections (from Claude Agent SDK) are handled differently - they manage their own connection lifecycle and don't need explicit reconnection.

---

## 4. MCP Tool Name Builder ($58)

### What it does
Constructs the prefixed tool name from server name and tool name.

### Source Code

```javascript
// ============================================
// buildMcpToolName - Construct prefixed MCP tool name
// Location: chunks.170.mjs (in fetchMcpTools)
// ============================================

// ORIGINAL (for source lookup):
let _ = $58(A.name, z.name);

// READABLE (for understanding):
function buildMcpToolName(serverName, toolName) {
    return `mcp__${serverName}__${toolName}`;
}

// Mapping: $58→buildMcpToolName, A→serverConnection, z→tool
```

### Example
- Server: `sqlite`
- Tool: `query`
- Result: `mcp__sqlite__query`

---

## 5. Filter Tool By Visibility (x3z)

### What it does
Filters out tools that shouldn't be exposed to the user (e.g., IDE-specific tools).

### Source Code

```javascript
// ============================================
// filterToolByVisibility - Filter tools by visibility rules
// Location: chunks.169.mjs:1869
// ============================================

// READABLE (for understanding):
function filterToolByVisibility(tool) {
    // Filter out IDE-specific tools when not in IDE context
    if (tool.annotations?.isIDETool && !isRunningInIDE()) {
        return false;
    }
    // Filter out internal tools
    if (tool.annotations?.isInternal) {
        return false;
    }
    return true;
}

// Mapping: x3z→filterToolByVisibility
```

---

## 6. Elicitation Request Handler Setup (WT7)

### What it does
Sets up the handler for MCP server-initiated elicitation requests (server asks user for input).

### How it works
1. Listen for `elicitation/create` method from MCP server
2. Determine mode (form or URL)
3. Queue the elicitation for UI processing
4. Return user's response to the server

### Source Code

```javascript
// ============================================
// setupElicitationRequestHandler - Handle MCP server elicitation requests
// Location: chunks.58.mjs:3
// ============================================

// READABLE (for understanding):
function setupElicitationRequestHandler(mcpClient, sessionContext) {
    mcpClient.setRequestHandler(ElicitationCreateSchema, async (request) => {
        const { message, requestedSchema, uris } = request.params;

        // Determine elicitation mode
        let mode;
        if (uris && uris.length > 0) {
            mode = "url";  // OAuth flow or external URL
        } else if (requestedSchema) {
            mode = "form";  // Structured form input
        } else {
            throw new Error("Elicitation request must have either uris or requestedSchema");
        }

        // Create elicitation request
        const elicitationId = generateUUID();
        const elicitationRequest = {
            id: elicitationId,
            serverName: mcpClient.name,
            message,
            mode,
            requestedSchema,
            uris,
            timestamp: new Date().toISOString()
        };

        // Queue for UI processing
        await queueElicitation(elicitationRequest);

        // Wait for user response
        const response = await waitForElicitationResponse(elicitationId);

        return {
            action: response.action,  // "accept" | "decline" | "cancel"
            content: response.content  // Form data or URL result
        };
    });
}

// Mapping: WT7→setupElicitationRequestHandler
```

### Key insight
Elicitation allows MCP servers to request user input during tool execution. This enables:
1. **Form mode**: Server requests structured input via JSON schema
2. **URL mode**: Server provides OAuth URL for authentication

---

## MCP Tool Annotation Mapping

| MCP Annotation | Tool Method | Purpose |
|----------------|-------------|---------|
| `readOnlyHint` | `isReadOnly()` | Tool doesn't modify state |
| `readOnlyHint` | `isConcurrencySafe()` | Safe for concurrent execution |
| `destructiveHint` | `isDestructive()` | May cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Interacts with external systems |

### Annotation Example

```javascript
// MCP server tool definition
{
    "name": "delete_records",
    "description": "Delete records from database",
    "inputSchema": { ... },
    "annotations": {
        "readOnlyHint": false,
        "destructiveHint": true,
        "openWorldHint": false
    }
}

// Maps to tool object
{
    name: "mcp__database__delete_records",
    isReadOnly() { return false; },
    isDestructive() { return true; },
    isOpenWorld() { return false; },
    isConcurrencySafe() { return false; }
}
```

---

## Error Types

### McpSessionLostError (qn8)

Thrown when the MCP server process terminates unexpectedly. Triggers retry logic.

```javascript
class McpSessionLostError extends Error {
    constructor(serverName) {
        super(`MCP server "${serverName}" session lost`);
        this.name = "McpSessionLostError";
    }
}
```

### McpToolExecutionError (EV)

Wrapped error for UI display. Contains user-friendly message.

```javascript
class McpToolExecutionError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "McpToolExecutionError";
        this.code = code;
    }
}
```

---

## Summary

### Validated Symbols

| Obfuscated | Readable | Location | Status |
|------------|----------|----------|--------|
| JE | fetchMcpTools | chunks.170.mjs:533 | ✅ Verified |
| pC | callMcpTool | chunks.169.mjs:1910 | ✅ Verified |
| yT6 | getMcpClientConnection | chunks.169.mjs:1886 | ✅ Verified |
| $58 | buildMcpToolName | chunks.170.mjs | ✅ Verified |
| x3z | filterToolByVisibility | chunks.169.mjs:1869 | ✅ Verified |
| WT7 | setupElicitationRequestHandler | chunks.58.mjs:3 | ✅ Verified |
| qn8 | McpSessionLostError | chunks.170.mjs | ✅ Verified |
| EV | McpToolExecutionError | chunks.170.mjs | ✅ Verified |

### Key Dependencies

| Symbol | Purpose |
|--------|---------|
| ZP | memoize |
| Ws | ensureArray |
| t6 | parseBoolean |
| zh | connectMcpServer |
| F3z | executeMcpToolCall |
| PGq | executeMcpToolRequest |
| sK | getAbortController |
| $y6 | toolsListResultSchema |
| n1 | logInfo |
| EY | logError |
| _1 | formatError |