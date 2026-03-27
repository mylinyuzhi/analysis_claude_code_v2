# MCP Module - Complete Source Restoration (Claude Code 2.1.76)

> **Complete source-level restoration** of the Model Context Protocol integration with cross-validated symbols and detailed algorithm analysis.

---

## Related Symbols

> Symbol mappings: [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions documented here:
- `fetchMcpTools` (JE) - Tool discovery - chunks.170.mjs:533
- `callMcpTool` (pC) - Tool execution - chunks.169.mjs:1910
- `executeMcpToolCall` (F3z) - Low-level execution - chunks.170.mjs:607
- `getMcpClientConnection` (yT6) - Connection management - chunks.169.mjs:1886
- `connectAllMcpServers` (ZL1) - Batch connection - chunks.169.mjs:1966

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
                            // Get (or reconnect) client
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
                                onProgress: progressCallback && toolUseId
                                    ? (data) => progressCallback({ toolUseID: toolUseId, data })
                                    : undefined,
                                handleElicitation: sessionContext.handleElicitation
                            });

                            // Emit progress complete
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
                                        ...(result.structuredContent && {
                                            structuredContent: result.structuredContent
                                        })
                                    }
                                } : {})
                            };

                        } catch (error) {
                            // Retry on session loss
                            if (error instanceof McpSessionLostError && attempt < maxRetries) {
                                logInfo(clientConnection.name,
                                    `Retrying tool '${tool.name}' after session recovery`);
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
                                const errorType = error.constructor.name;
                                if (errorType === "Error") {
                                    throw new McpToolExecutionError(
                                        error.message,
                                        error.message.slice(0, 200)
                                    );
                                }
                                if (errorType === "McpError" && "code" in error) {
                                    throw new McpToolExecutionError(
                                        error.message,
                                        `McpError ${error.code}`
                                    );
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

// Mapping: JE→fetchMcpTools, ZP→memoize, A→clientConnection, $58→buildMcpToolName,
//          yT6→getMcpClientConnection, F3z→executeMcpToolCall, qn8→McpSessionLostError,
//          EV→McpToolExecutionError, Ws→ensureArray, x3z→filterToolByVisibility
```

---

## 2. Tool Annotation Mapping

### MCP Annotation to Tool Method Mapping

| MCP Annotation | Tool Method | Purpose |
|----------------|-------------|---------|
| `readOnlyHint` | `isReadOnly()` | Tool doesn't modify state |
| `readOnlyHint` | `isConcurrencySafe()` | Safe for concurrent execution |
| `destructiveHint` | `isDestructive()` | May cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Interacts with external systems |
| `title` | `userFacingName()` | Display name for UI |

### Annotation Extraction Algorithm

```javascript
// The annotations are extracted directly from the tool definition:

// ORIGINAL (from tool object creation):
isConcurrencySafe() { return z.annotations?.readOnlyHint ?? !1 },
isReadOnly() { return z.annotations?.readOnlyHint ?? !1 },
isDestructive() { return z.annotations?.destructiveHint ?? !1 },
isOpenWorld() { return z.annotations?.openWorldHint ?? !1 },

// READABLE:
isConcurrencySafe() { return tool.annotations?.readOnlyHint ?? false; },
isReadOnly() { return tool.annotations?.readOnlyHint ?? false; },
isDestructive() { return tool.annotations?.destructiveHint ?? false; },
isOpenWorld() { return tool.annotations?.openWorldHint ?? false; }
```

---

## 3. callMcpTool (pC) - Simplified Tool Execution

### What it does

Provides a simplified interface for executing MCP tools, used internally by the IDE integration and other components.

### How it works

1. Get abort signal from global controller
2. Call executeMcpToolRequest with all parameters
3. Return just the content (not the full result object)

```javascript
// ============================================
// callMcpTool - Simplified MCP tool execution
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

## 4. getMcpClientConnection (yT6) - Connection Management

### What it does

Gets a valid MCP client connection, reconnecting if necessary. Handles the special case of SDK-type connections that don't require reconnection.

### How it works

1. Check if connection is SDK type (no reconnection needed)
2. Attempt to reconnect via connectMcpServer
3. Verify connection is successful
4. Throw McpToolExecutionError if not connected

### Why this approach

- **SDK bypass** avoids unnecessary reconnection for embedded SDK servers
- **Lazy reconnection** only reconnects when needed
- **Error wrapping** provides consistent error messages

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
    // They're always "connected" via the SDK runtime
    if (clientConnection.config.type === "sdk") {
        return clientConnection;
    }

    // Attempt to connect/reconnect
    const reconnected = await connectMcpServer(
        clientConnection.name,
        clientConnection.config
    );

    // Verify connection success
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

## 5. connectAllMcpServers (ZL1) - Batch Connection

### What it does

Connects to all configured MCP servers in parallel with batching for different transport types.

### How it works

1. Get all server configurations
2. Filter out disabled servers
3. Calculate transport type counts (stdio, sse, http)
4. Split into local (stdio/sdk) and remote (sse/http) batches
5. Connect each batch with appropriate concurrency limits
6. For each server:
   - Skip if cached "needs-auth"
   - Connect and discover tools/resources/prompts
   - Add built-in tools for resource support
7. Report results via callback

### Batching Strategy

```
Local servers (stdio, sdk):  Batch size = 3  (Yn8)
Remote servers (sse, http):  Batch size = 20 (I3z)

Why different limits?
- stdio processes are resource-intensive
- HTTP connections are lightweight
```

```javascript
// ============================================
// connectAllMcpServers - Batch server connection
// Location: chunks.169.mjs:1966-2059
// ============================================

// ORIGINAL (for source lookup):
async function ZL1(A, q) {
    let K = !1, Y = !1, z = !1,
        _ = Object.entries(q ?? (await Je()).servers),
        w = [];

    // Filter disabled servers
    for (let Z of _)
        if (iv(Z[0])) A({
            client: { name: Z[0], type: "disabled", config: Z[1] },
            tools: [], commands: []
        });
        else w.push(Z);

    // Calculate transport counts
    let O = w.length,
        $ = w.filter(([Z, G]) => G.type === "stdio").length,
        H = w.filter(([Z, G]) => G.type === "sse").length,
        // ... more counts
        D = w.filter(([Z, G]) => OGq(G)),  // Local (stdio/sdk)
        X = w.filter(([Z, G]) => !OGq(G)), // Remote (sse/http)
        P = { totalServers: O, stdioCount: $, sseCount: H, httpCount: j, ... };

    // Connection worker
    W = async ([Z, G]) => {
        try {
            // Skip if disabled
            if (iv(Z)) { /* report disabled */ return; }

            // Check cached needs-auth
            if ((G.type === "claudeai-proxy" || G.type === "http" || G.type === "sse")
                && await R3z(Z)) {
                A({ client: { name: Z, type: "needs-auth", config: G }, tools: [], commands: [] });
                return;
            }

            // Connect
            let f = await zh(Z, G, P);
            if (f.type !== "connected") {
                A({ client: f, tools: [], commands: [] });
                return;
            }

            // Discover tools, prompts, resources in parallel
            let v = !!f.capabilities?.resources,
                [N, V, L] = await Promise.all([JE(f), K_6(f), v ? Rl(f) : Promise.resolve([])]);

            // Add built-in tools for resources
            let h = [];
            if (v && !K) K = !0, h.push(Ll, hl);  // ReadResource, ListResources tools
            // ...

            // Report result
            A({
                client: f,
                tools: [...N, ...h],
                commands: V,
                resources: L.length > 0 ? L : undefined
            });
        } catch (f) {
            // Report failure
            A({ client: { name: Z, type: "failed", config: G }, tools: [], commands: [] });
        }
    };

    // Execute with batching
    await Promise.all([
        $Gq(D, Yn8(), W),   // Local servers with batch size 3
        $Gq(X, I3z(), W)    // Remote servers with batch size 20
    ]);
}

// READABLE (for understanding):
async function connectAllMcpServers(resultCallback, serverConfigs) {
    let addedResourceTools = false;
    let addedSubscribeTools = false;
    let addedDiagnosticsTools = false;

    // Get all server configurations
    const serverEntries = Object.entries(
        serverConfigs ?? (await getMcpSettings()).servers
    );
    const enabledServers = [];

    // Filter out disabled servers
    for (const [name, config] of serverEntries) {
        if (isServerDisabled(name)) {
            resultCallback({
                client: { name, type: "disabled", config },
                tools: [],
                commands: []
            });
        } else {
            enabledServers.push([name, config]);
        }
    }

    // Calculate transport type counts for telemetry
    const totalCounts = {
        totalServers: enabledServers.length,
        stdioCount: enabledServers.filter(([_, c]) => c.type === "stdio").length,
        sseCount: enabledServers.filter(([_, c]) => c.type === "sse").length,
        httpCount: enabledServers.filter(([_, c]) => c.type === "http").length,
        sseIdeCount: enabledServers.filter(([_, c]) => c.type === "sse-ide").length,
        wsIdeCount: enabledServers.filter(([_, c]) => c.type === "ws-ide").length
    };

    // Split into local and remote batches
    const localServers = enabledServers.filter(([_, config]) =>
        isLocalTransport(config)  // stdio or sdk
    );
    const remoteServers = enabledServers.filter(([_, config]) =>
        !isLocalTransport(config)  // sse, http, etc.
    );

    // Connection worker function
    const connectWorker = async ([name, config]) => {
        try {
            // Skip if disabled
            if (isServerDisabled(name)) {
                resultCallback({
                    client: { name, type: "disabled", config },
                    tools: [],
                    commands: []
                });
                return;
            }

            // Check cached needs-auth status
            if (["claudeai-proxy", "http", "sse"].includes(config.type) &&
                await isAuthRequiredCached(name)) {
                logInfo(name, "Skipping connection (cached needs-auth)");
                resultCallback({
                    client: { name, type: "needs-auth", config },
                    tools: [],
                    commands: []
                });
                return;
            }

            // Connect to server
            const connection = await connectMcpServer(name, config, totalCounts);

            if (connection.type !== "connected") {
                resultCallback({
                    client: connection,
                    tools: [],
                    commands: []
                });
                return;
            }

            // Discover capabilities in parallel
            const hasResources = !!connection.capabilities?.resources;
            const [tools, prompts, resources] = await Promise.all([
                fetchMcpTools(connection),
                fetchMcpPrompts(connection),
                hasResources ? fetchMcpResources(connection) : Promise.resolve([])
            ]);

            // Add built-in tools for resources
            const additionalTools = [];

            // Add resource tools (only once globally)
            if (hasResources && !addedResourceTools) {
                addedResourceTools = true;
                additionalTools.push(ReadResourceTool, ListResourcesTool);
            }

            // Add subscribe tools if supported
            if (SubscribeTool && UnsubscribeTool &&
                connection.capabilities?.resources?.subscribe &&
                !addedSubscribeTools) {
                addedSubscribeTools = true;
                additionalTools.push(SubscribeTool, UnsubscribeTool);
            }

            // Add diagnostics tools if available
            if (DiagnosticsTool && OpenFileTool && !addedDiagnosticsTools) {
                addedDiagnosticsTools = true;
                additionalTools.push(DiagnosticsTool, OpenFileTool);
            }

            // Report successful connection
            resultCallback({
                client: connection,
                tools: [...tools, ...additionalTools],
                commands: prompts,
                resources: resources.length > 0 ? resources : undefined
            });

        } catch (error) {
            logError(name, `Error fetching tools/commands/resources: ${formatError(error)}`);
            resultCallback({
                client: { name, type: "failed", config },
                tools: [],
                commands: []
            });
        }
    };

    // Execute connections in parallel with batching
    await Promise.all([
        connectWithBatching(localServers, getLocalServerBatchSize(), connectWorker),
        connectWithBatching(remoteServers, getRemoteServerBatchSize(), connectWorker)
    ]);
}

// Mapping: ZL1→connectAllMcpServers, A→resultCallback, q→serverConfigs,
//          zh→connectMcpServer, JE→fetchMcpTools, K_6→fetchMcpPrompts, Rl→fetchMcpResources,
//          Yn8→getLocalServerBatchSize, I3z→getRemoteServerBatchSize,
//          iv→isServerDisabled, OGq→isLocalTransport, $Gq→connectWithBatching
```

---

## 6. Elicitation System

### What is Elicitation?

Elicitation allows MCP servers to request user input during tool execution. This is essential for:
- **OAuth flows** - Server needs user to visit URL and authenticate
- **Form input** - Server needs structured data from user
- **Dynamic parameters** - Server discovers it needs additional info

### Elicitation Modes

1. **Form Mode** - Structured JSON schema for input collection
2. **URL Mode** - Redirect user to external URL (OAuth)

### Modal Priority

Elicitation dialogs have the **lowest priority** in the modal stack:

```javascript
// Modal priority (highest → lowest)
if (sandboxPermissionQueue[0]) modal = "sandbox-permission";      // Priority 1
else if (pendingToolRequest[0]) modal = "tool-permission";       // Priority 2
else if (workerSandboxQueue[0]) modal = "worker-sandbox-permission";  // Priority 3
else if (elicitation.queue[0]) modal = "elicitation";            // Priority 4 (lowest)
```

### Elicitation Flow

```
MCP Tool execution
    │
    ├─→ Server calls elicitation/create
    │     │
    │     ├─→ Form mode: Show JSON schema form dialog
    │     └─→ URL mode: Show "Visit URL" button
    │
    ├─→ User fills form / visits URL
    │
    ├─→ elicitation/result sent back to server
    │
    └─→ Tool execution continues
```

---

## 7. Session Recovery

### McpSessionLostError (qn8)

When an MCP server connection is lost during tool execution:

1. `getMcpClientConnection` throws `McpSessionLostError`
2. Tool `call()` catches the error
3. Retry loop attempts reconnection
4. If reconnection succeeds, tool execution continues
5. If max retries exceeded, error is propagated

```javascript
// Retry logic in tool.call():
for (let attempt = 0; ; attempt++) {
    try {
        const client = await getMcpClientConnection(clientConnection);
        const result = await executeMcpToolCall({ client, ... });
        return result;
    } catch (error) {
        if (error instanceof McpSessionLostError && attempt < maxRetries) {
            logInfo(serverName, `Retrying tool '${toolName}' after session recovery`);
            continue;  // Retry
        }
        throw error;  // Give up
    }
}
```

---

## Cross-Module Integration

### MCP ↔ Tools (05)

- MCP tools registered in tool registry with `mcp__` prefix
- Tool execution routes through standard 8-stage pipeline
- Permission checks apply to MCP tools
- Annotation mapping: `readOnlyHint` → `isReadOnly()`, etc.

### MCP ↔ System Reminder (04)

Attachment types generated:
- `mcp_resource` - MCP resource content
- `elicitation` - Elicitation request from server
- `elicitation_result` - Elicitation response
- `mcp_progress` - Tool execution progress

### MCP ↔ UI (02)

- MCP server connection status display
- Elicitation dialog rendering (form/URL modes)
- Modal priority management
- Progress indicator for MCP tool execution

### MCP ↔ Hooks (11)

Elicitation hooks can intercept server requests:
- `Elicitation` hook - Pre-process elicitation requests
- `ElicitationResult` hook - Post-process responses