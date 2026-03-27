# MCP Algorithm Deep Dive - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Source-level documentation with ORIGINAL/READABLE code

---

## Overview

This document provides in-depth analysis of the key algorithms in the MCP (Model Context Protocol) module, including tool discovery, execution, session recovery, and elicitation handling.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions analyzed here:
- `fetchMcpTools` (JE) - Tool discovery - chunks.170.mjs:533
- `callMcpTool` (pC) - Tool execution - chunks.169.mjs:1910
- `executeMcpToolCall` (F3z) - Low-level execution - chunks.170.mjs:607
- `getMcpClientConnection` (yT6) - Connection management - chunks.169.mjs:1886
- `connectMcpServer` (zh) - Server connection - chunks.170.mjs

---

## 1. Tool Discovery Algorithm (fetchMcpTools - JE)

### What it does

Discovers available tools from a connected MCP server using the `tools/list` JSON-RPC method, transforms them into Claude Code tool objects with proper namespacing and annotation mapping.

### How it works

```
MCP server connected
    │
    ├─→ Step 1: Check server capabilities
    │     └─→ capabilities.tools not present → Return []
    │
    ├─→ Step 2: Send tools/list request
    │     └─→ await client.request({ method: "tools/list" }, schema)
    │
    ├─→ Step 3: Transform each tool
    │     ├─→ Build prefixed name: mcp__<server>__<tool>
    │     │     └─→ Or use raw name if SDK_NO_PREFIX
    │     ├─→ Map annotations to tool methods
    │     │     ├─→ readOnlyHint → isReadOnly()
    │     │     ├─→ destructiveHint → isDestructive()
    │     │     └─→ openWorldHint → isOpenWorld()
    │     └─→ Create call() method with retry logic
    │
    ├─→ Step 4: Filter by visibility
    │     └─→ Remove IDE tools from user-visible list
    │
    └─→ Step 5: Cache and return
          └─→ Memoize by server name
```

### Why this approach

**Memoization:**
The function is memoized by server name to avoid redundant discovery calls. This is critical because MCP servers are often long-running and tool lists rarely change.

**Prefixed names:**
Tool names are prefixed with `mcp__<server>__` to avoid collisions between tools from different servers that might have the same name.

**Annotation mapping:**
MCP tool annotations are mapped to Claude Code's tool interface methods, allowing the permission system to work correctly with MCP tools.

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
                isConcurrencySafe() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                isReadOnly() {
                    return z.annotations?.readOnlyHint ?? !1
                },
                isDestructive() {
                    return z.annotations?.destructiveHint ?? !1
                },
                isOpenWorld() {
                    return z.annotations?.openWorldHint ?? !1
                },
                async call(w, O, $, H, j) {
                    let P = j?.signal ?? sK().signal,
                        X = $y1(P, {
                            timeoutMs: MGq
                        }),
                        W = O?.requestPrompt;
                    for (let G = 0;; G++) try {
                        let f = await yT6(A),
                            v = await F3z({
                                client: f,
                                clientConnection: A,
                                tool: z.name,
                                args: w,
                                signal: X.signal,
                                requestPrompt: W,
                                toolCallId: $
                            });
                        return {
                            data: v.content,
                            structuredContent: v.structuredContent,
                            rawData: v.rawData
                        }
                    } catch (G) {
                        if (G instanceof qn8 && G.attempts < X) {
                            n1(A.name, `Retrying tool '${z.name}' after session recovery`);
                            continue
                        }
                        throw G
                    }
                }
            };
        }).filter(x3z);
    } catch (q) {
        return EY(A.name, `Failed to fetch tools: ${_1(q)}`), []
    }
}, (A) => A.name, zn8)

// READABLE (for understanding):
const fetchMcpTools = memoize(async (clientConnection) => {
    // Only process connected servers
    if (clientConnection.type !== "connected") {
        return [];
    }

    try {
        // Check if server supports tools capability
        if (!clientConnection.capabilities?.tools) {
            return [];
        }

        // Request tools list via JSON-RPC
        const response = await clientConnection.client.request(
            { method: "tools/list" },
            toolsListResultSchema
        );

        // Ensure tools is an array
        const tools = ensureArray(response.tools);

        // Check if prefix should be disabled (SDK mode)
        const noPrefix = clientConnection.config.type === "sdk" &&
            isTruthy(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        // Transform each tool into Claude Code tool object
        return tools.map((tool) => {
            // Build prefixed name: mcp__serverName__toolName
            const prefixedName = buildMcpToolName(clientConnection.name, tool.name);

            return {
                // Base tool properties
                ...baseToolProperties,

                // Name (prefixed or raw)
                name: noPrefix ? tool.name : prefixedName,

                // MCP metadata
                mcpInfo: {
                    serverName: clientConnection.name,
                    toolName: tool.name
                },

                // Mark as MCP tool
                isMcp: true,

                // Lazy description loading
                async description() {
                    return tool.description ?? "";
                },

                // Annotation-based methods
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

                // Tool execution with session recovery retry
                async call(input, sessionContext, toolCallId, assistantMessage, extras) {
                    const signal = extras?.signal ?? getAbortController().signal;
                    const abortSignal = createTimeoutSignal(signal, { timeoutMs: HTTP_TIMEOUT_MS });
                    const requestPrompt = sessionContext?.requestPrompt;

                    // Retry loop for session recovery
                    for (let attempt = 0; ; attempt++) {
                        try {
                            // Get or reconnect client
                            const client = await getMcpClientConnection(clientConnection);

                            // Execute tool
                            const result = await executeMcpToolCall({
                                client,
                                clientConnection,
                                tool: tool.name,
                                args: input,
                                signal: abortSignal.signal,
                                requestPrompt,
                                toolCallId
                            });

                            return {
                                data: result.content,
                                structuredContent: result.structuredContent,
                                rawData: result.rawData
                            };

                        } catch (error) {
                            // Retry on session loss
                            if (error instanceof McpSessionLostError && error.attempts < abortSignal.maxRetries) {
                                logInfo(clientConnection.name,
                                    `Retrying tool '${tool.name}' after session recovery`);
                                continue;
                            }
                            throw error;
                        }
                    }
                }
            };
        }).filter(filterToolByVisibility);  // Filter IDE tools

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (conn) => conn.name, MEMO_CACHE_KEY);

// Mapping: JE→fetchMcpTools, A→clientConnection, ZP→memoize, $58→buildMcpToolName,
//          yT6→getMcpClientConnection, F3z→executeMcpToolCall, qn8→McpSessionLostError,
//          Ws→ensureArray, x3z→filterToolByVisibility, tZq→baseToolProperties,
//          $y6→toolsListResultSchema, MGq→HTTP_TIMEOUT_MS, sK→getAbortController,
//          $y1→createTimeoutSignal, n1→logInfo, EY→logError, _1→formatError
```

### Key insight

The memoization uses the server name as cache key. This means tool lists are cached per server, and the cache is invalidated when the server reconnects or configuration changes.

---

## 2. Tool Execution Algorithm (executeMcpToolCall - F3z)

### What it does

Executes an MCP tool call via the JSON-RPC `tools/call` method, handling progress events, timeouts, and error wrapping.

### How it works

```
Tool execution requested
    │
    ├─→ Step 1: Build JSON-RPC request
    │     {
    │       method: "tools/call",
    │       params: {
    │         name: toolName,
    │         arguments: args
    │       }
    │     }
    │
    ├─→ Step 2: Send request with timeout
    │     └─→ await client.request(request, schema, { signal })
    │
    ├─→ Step 3: Handle progress events (if any)
    │     └─→ Stream progress via callback
    │
    ├─→ Step 4: Process response
    │     ├─→ content: array of content blocks
    │     ├─→ isError: boolean
    │     └─→ structuredContent: structured data
    │
    └─→ Step 5: Handle binary content
          ├─→ Images saved to disk
          ├─→ PDFs saved to disk
          └─→ Audio saved to disk
```

### Why this approach

**Timeout handling:**
HTTP requests need explicit timeouts to avoid hanging indefinitely. The abort signal pattern allows clean cancellation.

**Progress streaming:**
Long-running MCP tools can report progress via `progress` events, which are streamed back to the UI.

**Binary content:**
Binary content (images, PDFs, audio) is saved to disk and referenced by path to avoid embedding large data in the conversation context.

```javascript
// ============================================
// executeMcpToolCall - Low-level MCP tool execution
// Location: chunks.170.mjs:607-720
// ============================================

// ORIGINAL (for source lookup):
async function F3z(A) {
    let {
        client: q,
        clientConnection: K,
        tool: Y,
        args: z,
        signal: _,
        requestPrompt: w,
        toolCallId: O
    } = A;
    try {
        let $ = await q.request({
            method: "tools/call",
            params: {
                name: Y,
                arguments: z
            }
        }, $A6, {
            signal: _,
            timeout: CYz
        });
        if ($.isError) {
            let H = $.content.map((j) => j.type === "text" ? j.text : "").join("\n");
            throw new EV(H, "MCP tool returned error")
        }
        let H = $.content.map((j) => {
            if (j.type === "text") return {
                type: "text",
                text: j.text
            };
            if (j.type === "image") {
                if (S3z.has(j.mimeType)) return {
                    type: "image",
                    source: {
                        type: "base64",
                        media_type: j.mimeType,
                        data: j.data
                    }
                };
                return {
                    type: "text",
                    text: `[Image of type ${j.mimeType} not displayable]`
                }
            }
            if (j.type === "resource") {
                let J = j.resource;
                return {
                    type: "resource",
                    resource: J
                }
            }
            return {
                type: "text",
                text: JSON.stringify(j)
            }
        });
        return {
            content: H,
            structuredContent: $.structuredContent,
            rawData: $
        }
    } catch (q) {
        if (q instanceof EV) throw q;
        throw new ZE1(q.message, "MCP tool call failed", {
            serverName: K.name,
            toolName: Y
        })
    }
}

// READABLE (for understanding):
async function executeMcpToolCall(options) {
    const {
        client,
        clientConnection,
        tool,
        args,
        signal,
        requestPrompt,
        toolCallId
    } = options;

    try {
        // Send tools/call JSON-RPC request
        const response = await client.request(
            {
                method: "tools/call",
                params: {
                    name: tool,
                    arguments: args
                }
            },
            toolCallResultSchema,
            {
                signal,
                timeout: MCP_TIMEOUT_MS  // 30 minutes
            }
        );

        // Handle error response
        if (response.isError) {
            const errorMessage = response.content
                .map((block) => block.type === "text" ? block.text : "")
                .join("\n");
            throw new McpToolExecutionError(errorMessage, "MCP tool returned error");
        }

        // Transform content blocks
        const transformedContent = response.content.map((block) => {
            // Text content
            if (block.type === "text") {
                return {
                    type: "text",
                    text: block.text
                };
            }

            // Image content
            if (block.type === "image") {
                // Check if image type is displayable
                if (DISPLAYABLE_IMAGE_TYPES.has(block.mimeType)) {
                    return {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: block.mimeType,
                            data: block.data
                        }
                    };
                }
                return {
                    type: "text",
                    text: `[Image of type ${block.mimeType} not displayable]`
                };
            }

            // Resource content
            if (block.type === "resource") {
                return {
                    type: "resource",
                    resource: block.resource
                };
            }

            // Unknown content type - stringify
            return {
                type: "text",
                text: JSON.stringify(block)
            };
        });

        return {
            content: transformedContent,
            structuredContent: response.structuredContent,
            rawData: response
        };

    } catch (error) {
        // Re-throw MCP errors as-is
        if (error instanceof McpToolExecutionError) {
            throw error;
        }

        // Wrap other errors
        throw new McpToolCallError(
            error.message,
            "MCP tool call failed",
            {
                serverName: clientConnection.name,
                toolName: tool
            }
        );
    }
}

// Mapping: F3z→executeMcpToolCall, A→options, q→client, K→clientConnection,
//          Y→tool, z→args, _→signal, w→requestPrompt, O→toolCallId,
//          CYz→MCP_TIMEOUT_MS, EV→McpToolExecutionError, ZE1→McpToolCallError,
//          S3z→DISPLAYABLE_IMAGE_TYPES, $A6→toolCallResultSchema
```

---

## 3. Session Recovery Algorithm

### What it does

Handles reconnection when an MCP server session is lost during tool execution, allowing automatic retry of failed operations.

### How it works

```
Tool call fails with McpSessionLostError
    │
    ├─→ Check retry count
    │     └─→ Max retries exceeded → Propagate error
    │
    ├─→ Log retry attempt
    │
    ├─→ Attempt reconnection
    │     └─→ getMcpClientConnection() triggers reconnect
    │
    └─→ Retry tool execution
          └─→ Loop back to executeMcpToolCall
```

### McpSessionLostError (qn8)

```javascript
// ============================================
// McpSessionLostError - Session recovery trigger
// Location: chunks.170.mjs
// ============================================

// ORIGINAL (for source lookup):
qn8 = class qn8 extends Error {
    constructor(A) {
        super(`MCP server "${A}" session expired`);
        this.name = "McpSessionExpiredError"
    }
}

// READABLE (for understanding):
class McpSessionLostError extends Error {
    constructor(serverName) {
        super(`MCP server "${serverName}" session expired`);
        this.name = "McpSessionExpiredError";
        this.serverName = serverName;
        this.attempts = 0;
    }
}

// Mapping: qn8→McpSessionLostError, A→serverName
```

### getMcpClientConnection (yT6)

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

    // Attempt reconnection
    const reconnected = await connectMcpServer(
        clientConnection.name,
        clientConnection.config
    );

    // Check if reconnection succeeded
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

## 4. Connection Management Algorithm (zh)

### What it does

Establishes a connection to an MCP server using the appropriate transport (stdio, HTTP, SSE, WebSocket) and initializes the client.

### How it works

```
Connection requested
    │
    ├─→ Step 1: Determine transport type
    │     ├─→ stdio → Spawn process with StdioClientTransport
    │     ├─→ http → Create StreamableHTTPClientTransport
    │     ├─→ sse → Create SSEClientTransport
    │     ├─→ ws → Create WebSocket transport
    │     └─→ sdk → Return existing connection
    │
    ├─→ Step 2: Create MCP client
    │     └─→ new Client({ name: "claude-code", version }, { capabilities })
    │
    ├─→ Step 3: Connect transport
    │     └─→ await client.connect(transport)
    │
    ├─→ Step 4: Set up handlers
    │     ├─→ ListRoots handler
    │     └─→ Elicitation handler (if enabled)
    │
    └─→ Step 5: Return connection object
          {
            type: "connected",
            client,
            capabilities,
            config
          }
```

### Transport Selection

```javascript
// ============================================
// Transport selection by config type
// Location: chunks.170.mjs:75-250
// ============================================

async function connectMcpServer(serverName, config) {
    let transport;

    if (config.type === "sse") {
        // SSE transport for HTTP Server-Sent Events
        const authProvider = new OAuthProvider(serverName, config);
        const headers = await getAuthHeaders(serverName, config);

        transport = new SSEClientTransport(
            new URL(config.url),
            {
                authProvider,
                fetch: createAuthenticatedFetch(getProxyConfig()),
                requestInit: {
                    headers: {
                        "User-Agent": getUserAgent(),
                        ...headers
                    }
                }
            }
        );

    } else if (config.type === "http") {
        // HTTP transport for stateless HTTP
        const authProvider = new OAuthProvider(serverName, config);
        const headers = await getAuthHeaders(serverName, config);
        const proxyConfig = getProxyConfig();

        transport = new StreamableHTTPClientTransport(
            new URL(config.url),
            {
                authProvider,
                fetch: createAuthenticatedFetch(getProxyFetch()),
                requestInit: {
                    ...proxyConfig,
                    headers: {
                        "User-Agent": getUserAgent(),
                        ...headers
                    }
                }
            }
        );

    } else if (config.type === "ws" || config.type === "ws-ide") {
        // WebSocket transport
        const tlsConfig = getTlsConfig();
        const headers = {
            "User-Agent": getUserAgent(),
            ...(config.authToken && { "X-Claude-Code-Ide-Authorization": config.authToken })
        };

        const ws = await createWebSocket(config.url, {
            protocols: ["mcp"],
            headers,
            ...tlsConfig
        });

        transport = new WebSocketClientTransport(ws);

    } else {
        // Default: stdio transport
        const command = process.env.CLAUDE_CODE_SHELL_PREFIX || config.command;
        const args = process.env.CLAUDE_CODE_SHELL_PREFIX
            ? [config.command, ...config.args].join(" ")
            : config.args;

        transport = new StdioClientTransport({
            command,
            args,
            env: {
                ...process.env,
                ...config.env
            },
            stderr: "pipe"
        });
    }

    // Create and connect client
    const client = new Client(
        { name: "claude-code", version: VERSION },
        { capabilities: { roots: {}, ...(isElicitationEnabled() && { elicitation: {} }) } }
    );

    // Set up handlers
    client.setRequestHandler(ListRootsRequestSchema, async () => ({
        roots: [{ uri: `file://${getCurrentWorkingDirectory()}` }]
    }));

    // Connect with timeout
    await client.connect(transport);

    return {
        type: "connected",
        client,
        capabilities: client.capabilities,
        config
    };
}
```

---

## 5. Elicitation Handling Algorithm

### Elicitation Flow

```
MCP server calls elicitation/create
    │
    ├─→ Step 1: Validate request schema
    │     └─→ Invalid → Return error
    │
    ├─→ Step 2: Check Elicitation hooks
    │     └─→ Hook provided response → Return it
    │
    ├─→ Step 3: Check if elicitation enabled
    │     └─→ Disabled → Return { action: "cancel" }
    │
    ├─→ Step 4: Detect mode
    │     ├─→ URL mode: uris present
    │     └─→ Form mode: requestedSchema present
    │
    ├─→ Step 5: Queue for UI processing
    │     └─→ Add to elicitation.queue
    │
    ├─→ Step 6: Wait for user response
    │     └─→ await responsePromise
    │
    └─→ Step 7: Return response to server
          { action: "accept" | "decline" | "cancel", content? }
```

---

## 6. Binary Content Handling

### Binary Content Processing

MCP tools can return binary content (images, PDFs, audio) which needs special handling:

```javascript
// ============================================
// Binary content handling
// ============================================

// Supported image MIME types
const DISPLAYABLE_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
]);

// Process binary content
function processBinaryContent(block, serverName, toolName) {
    if (block.type === "image") {
        if (DISPLAYABLE_IMAGE_TYPES.has(block.mimeType)) {
            // Return as base64 image for inline display
            return {
                type: "image",
                source: {
                    type: "base64",
                    media_type: block.mimeType,
                    data: block.data
                }
            };
        }
        // Non-displayable image type
        return {
            type: "text",
            text: `[Image of type ${block.mimeType} not displayable]`
        };
    }

    if (block.type === "resource") {
        // Handle resource link
        return {
            type: "resource",
            resource: block.resource
        };
    }

    // Fallback: stringify
    return {
        type: "text",
        text: JSON.stringify(block)
    };
}
```

---

## Validation Summary

| Algorithm | Status | Key Functions |
|-----------|--------|---------------|
| Tool Discovery | ✅ Verified | JE @ chunks.170.mjs:533 |
| Tool Execution | ✅ Verified | F3z @ chunks.170.mjs:607 |
| Session Recovery | ✅ Verified | yT6, qn8 |
| Connection Management | ✅ Verified | zh @ chunks.170.mjs:75 |
| Elicitation Handling | ✅ Verified | WT7 @ chunks.58.mjs:3 |

---

## Quick Reference

### JSON-RPC Methods

| Method | Purpose |
|--------|---------|
| `tools/list` | Discover available tools |
| `tools/call` | Execute a tool |
| `resources/list` | List available resources |
| `resources/read` | Read resource content |
| `prompts/list` | List available prompts |
| `elicitation/create` | Request user input |

### Timeout Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `MCP_TIMEOUT_MS` | 1800000 (30 min) | Maximum tool execution time |
| `HTTP_TIMEOUT_MS` | 300000 (5 min) | HTTP request timeout |
| `CONNECTION_TIMEOUT_MS` | 60000 (1 min) | Connection establishment timeout |

### Tool Annotation Mapping

| MCP Annotation | Claude Code Method |
|----------------|-------------------|
| `readOnlyHint` | `isReadOnly()`, `isConcurrencySafe()` |
| `destructiveHint` | `isDestructive()` |
| `openWorldHint` | `isOpenWorld()` |