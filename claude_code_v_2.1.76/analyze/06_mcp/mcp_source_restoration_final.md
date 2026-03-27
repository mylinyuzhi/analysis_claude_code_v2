# MCP Module - Complete Source Restoration Final (Claude Code 2.1.76)

> **Complete source-level restoration** of the Model Context Protocol (MCP) integration with cross-validated symbols and detailed algorithm analysis.
> **Final Version** - All symbols validated, complete tool discovery and elicitation with hook integration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions documented here:
- `fetchMcpTools` (JE) - Tool discovery - chunks.170.mjs:533
- `callMcpTool` (pC) - Tool execution - chunks.169.mjs:1910
- `connectMcpServer` (nl) - Server connection - chunks.169.mjs:1919
- `setupElicitationRequestHandler` (WT7) - Elicitation - chunks.58.mjs:3
- `runElicitationHook` (sx6) - Elicitation hooks - chunks.58.mjs:86
- `runElicitationResultHook` (tx6) - Result hooks - chunks.58.mjs:117

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MCP SYSTEM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Server Connections                                                │
│     ├─ StdioClientTransport (SO8) - stdin/stdout communication      │
│     ├─ SSEClientTransport - HTTP SSE streaming                      │
│     └─ StreamableHTTPClientTransport - HTTP with streaming          │
│                                                                       │
│  ② Tool Discovery                                                    │
│     ├─ tools/list → fetchMcpTools (JE)                              │
│     ├─ Tool name prefixing: mcp__<server>__<tool>                   │
│     └─ Deferred loading for context efficiency                       │
│                                                                       │
│  ③ Tool Execution                                                    │
│     ├─ mcp-cli command interception (parseMcpCliCommand)            │
│     ├─ tools/call → callMcpTool (pC)                                │
│     └─ Result formatting (JSON → stdout simulation)                 │
│                                                                       │
│  ④ Elicitation System                                               │
│     ├─ setupElicitationRequestHandler (WT7) - Request handler       │
│     ├─ runElicitationHook (sx6) - Pre-process elicitation           │
│     ├─ runElicitationResultHook (tx6) - Post-process response       │
│     └─ Form mode / URL mode dialogs                                  │
│                                                                       │
│  ⑤ McpHub (Browser Integration)                                     │
│     ├─ Unix socket IPC server                                        │
│     ├─ Chrome extension connections                                  │
│     └─ Session state persistence                                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. fetchMcpTools (JE) - Tool Discovery

### What it does

Discovers available tools from a connected MCP server via the `tools/list` JSON-RPC method. Creates tool objects with proper name prefixing and annotation extraction.

### How it works

1. Check if server is connected and has tools capability
2. Send `tools/list` request via client
3. For each tool in response:
   - Build prefixed name: `mcp__<server>__<tool>` (unless SDK mode with no prefix)
   - Extract annotations (readOnly, destructive, openWorld)
   - Create tool object with `call()` method
4. Return array of tool objects

### Why this approach

- **Memoization** via `ZP` (memoize) caches tool discovery results
- **Deferred loading** reduces context usage for large tool sets
- **Annotation extraction** enables proper permission handling

### Key insight

MCP tool names are prefixed with `mcp__<serverName>__<toolName>` to avoid collisions with built-in tools. The `CLAUDE_AGENT_SDK_MCP_NO_PREFIX` environment variable disables this for SDK mode.

```javascript
// ============================================
// fetchMcpTools - Discover tools from MCP server
// Location: chunks.170.mjs:533-679
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
}, (A) => A.name, zn8);

// READABLE (for understanding):
const fetchMcpTools = memoize(async (clientConnection) => {
    // Only fetch from connected servers with tools capability
    if (clientConnection.type !== "connected") return [];

    try {
        if (!clientConnection.capabilities?.tools) return [];

        // Request tools via JSON-RPC
        const response = await clientConnection.client.request({
            method: "tools/list"
        }, ListToolsResultSchema);

        const tools = deduplicateTools(response.tools);

        // Check if prefix should be skipped (SDK mode)
        const skipPrefix = clientConnection.config.type === "sdk" &&
            isTruthy(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        return tools.map((mcpTool) => {
            // Build prefixed tool name
            const prefixedName = buildMcpToolName(clientConnection.name, mcpTool.name);

            return {
                ...defaultToolConfig,
                name: skipPrefix ? mcpTool.name : prefixedName,
                mcpInfo: {
                    serverName: clientConnection.name,
                    toolName: mcpTool.name
                },
                isMcp: true,

                // Description methods
                async description() {
                    return mcpTool.description ?? "";
                },
                async prompt() {
                    return mcpTool.description ?? "";
                },

                // Annotation-based capability detection
                isConcurrencySafe() {
                    return mcpTool.annotations?.readOnlyHint ?? false;
                },
                isReadOnly() {
                    return mcpTool.annotations?.readOnlyHint ?? false;
                },
                isDestructive() {
                    return mcpTool.annotations?.destructiveHint ?? false;
                },
                isOpenWorld() {
                    return mcpTool.annotations?.openWorldHint ?? false;
                },

                inputJSONSchema: mcpTool.inputSchema,

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

                // Tool execution
                async call(args, context, canUseTool, message, progressCallback) {
                    const toolUseId = extractToolUseId(context);
                    const meta = toolUseId ? {
                        "claudecode/toolUseId": toolUseId
                    } : {};

                    // Send progress: started
                    if (progressCallback && toolUseId) {
                        progressCallback({
                            toolUseID: toolUseId,
                            data: {
                                type: "mcp_progress",
                                status: "started",
                                serverName: clientConnection.name,
                                toolName: mcpTool.name
                            }
                        });
                    }

                    const startTime = Date.now();
                    const maxRetries = 1;

                    for (let attempt = 0; ; attempt++) {
                        try {
                            // Get connected client
                            const client = await getMcpClientConnection(clientConnection);

                            // Execute tool via JSON-RPC
                            const result = await executeMcpToolCall({
                                client,
                                clientConnection,
                                tool: mcpTool.name,
                                args,
                                meta,
                                signal: context.abortController.signal,
                                setAppState: context.setAppState,
                                onProgress: progressCallback && toolUseId ? (progress) => {
                                    progressCallback({
                                        toolUseID: toolUseId,
                                        data: progress
                                    });
                                } : undefined,
                                handleElicitation: context.handleElicitation
                            });

                            // Send progress: completed
                            if (progressCallback && toolUseId) {
                                progressCallback({
                                    toolUseID: toolUseId,
                                    data: {
                                        type: "mcp_progress",
                                        status: "completed",
                                        serverName: clientConnection.name,
                                        toolName: mcpTool.name,
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
                            // Handle session loss with retry
                            if (error instanceof McpSessionLostError && attempt < maxRetries) {
                                logInfo(clientConnection.name,
                                    `Retrying tool '${mcpTool.name}' after session recovery`);
                                continue;
                            }

                            // Send progress: failed
                            if (progressCallback && toolUseId) {
                                progressCallback({
                                    toolUseID: toolUseId,
                                    data: {
                                        type: "mcp_progress",
                                        status: "failed",
                                        serverName: clientConnection.name,
                                        toolName: mcpTool.name,
                                        elapsedTimeMs: Date.now() - startTime
                                    }
                                });
                            }

                            // Wrap errors for UI display
                            if (error instanceof Error && !(error instanceof McpToolExecutionError)) {
                                const errorName = error.constructor.name;
                                if (errorName === "Error") {
                                    throw new McpToolExecutionError(
                                        error.message,
                                        error.message.slice(0, 200)
                                    );
                                }
                                if (errorName === "McpError" && "code" in error &&
                                    typeof error.code === "number") {
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
                    const title = mcpTool.annotations?.title || mcpTool.name;
                    return `${clientConnection.name} - ${title} (MCP)`;
                }
            };
        }).filter(filterValidTools);
    } catch (error) {
        logError(clientConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (connection) => connection.name, memoizeOptions);

// Mapping: JE→fetchMcpTools, A→clientConnection, ZP→memoize, $58→buildMcpToolName,
//          yT6→getMcpClientConnection, F3z→executeMcpToolCall, qn8→McpSessionLostError,
//          EV→McpToolExecutionError, tZq→defaultToolConfig, Ws→deduplicateTools
```

---

## 2. callMcpTool (pC) - Tool Execution

### What it does

Low-level function to execute an MCP tool via the connected client. Used by DiagnosticsManager and other internal components.

### How it works

1. Call `executeMcpToolCall` (PGq) with client, tool name, and args
2. Return the content from the result

```javascript
// ============================================
// callMcpTool - Execute MCP tool via client
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
async function callMcpTool(toolName, args, client) {
    const result = await executeMcpToolCall({
        client,
        tool: toolName,
        args,
        signal: getNewAbortController().signal
    });
    return result.content;
}

// Mapping: pC→callMcpTool, A→toolName, q→args, K→client, PGq→executeMcpToolCall,
//          sK→getNewAbortController
```

---

## 3. connectMcpServer (nl) - Server Connection

### What it does

Connects to an MCP server, discovers tools, commands, and resources. Handles reconnection and error states.

### How it works

1. Initialize connection tracking
2. Connect to server via `zh` (connectMcpClient)
3. Check if connected successfully
4. Discover tools via `JE` (fetchMcpTools)
5. Discover commands via `K_6` (fetchMcpCommands)
6. Discover resources via `Rl` (fetchMcpResources)
7. Add resource management tools if capabilities support it
8. Return connection result with tools, commands, resources

```javascript
// ============================================
// connectMcpServer - Connect and discover MCP capabilities
// Location: chunks.169.mjs:1919-1958
// ============================================

// ORIGINAL (for source lookup):
async function nl(A, q) {
    try {
        tV(), await VN(A, q);
        let K = await zh(A, q);
        if (K.type !== "connected") return {
            client: K,
            tools: [],
            commands: []
        };
        if (q.type === "claudeai-proxy") XE8(A);
        let Y = !!K.capabilities?.resources,
            [z, _, w] = await Promise.all([JE(K), K_6(K), Y ? Rl(K) : Promise.resolve([])]),
            O = [];
        if (Y) {
            if (![Ll, hl].some((H) => z.some((j) => z3(j, H.name)))) O.push(Ll, hl);
            if (K.capabilities?.resources?.subscribe && xr6 && ur6) {
                if (![xr6, ur6].some((j) => z.some((J) => z3(J, J.name)))) O.push(xr6, ur6)
            }
        }
        if (mr6 && Br6) {
            if (![mr6, Br6].some((H) => z.some((j) => z3(j, H.name)))) O.push(mr6, Br6)
        }
        return {
            client: K,
            tools: [...z, ...O],
            commands: _,
            resources: w.length > 0 ? w : void 0
        }
    } catch (K) {
        return EY(A, `Error during reconnection: ${_1(K)}`), {
            client: {
                name: A,
                type: "failed",
                config: q
            },
            tools: [],
            commands: []
        }
    }
}

// READABLE (for understanding):
async function connectMcpServer(serverName, config) {
    try {
        // Initialize connection tracking
        initializeConnectionTracker();
        await trackConnectionAttempt(serverName, config);

        // Connect to MCP server
        const clientConnection = await connectMcpClient(serverName, config);

        // Handle non-connected states
        if (clientConnection.type !== "connected") {
            return {
                client: clientConnection,
                tools: [],
                commands: []
            };
        }

        // Handle Claude.ai proxy special case
        if (config.type === "claudeai-proxy") {
            trackClaudeAiProxy(serverName);
        }

        // Check resource capability
        const hasResources = !!clientConnection.capabilities?.resources;

        // Discover capabilities in parallel
        const [tools, commands, resources] = await Promise.all([
            fetchMcpTools(clientConnection),
            fetchMcpCommands(clientConnection),
            hasResources ? fetchMcpResources(clientConnection) : Promise.resolve([])
        ]);

        // Add resource management tools if capability exists
        const additionalTools = [];
        if (hasResources) {
            // Add ReadResource and ListResources tools if not already present
            if (![ReadResourceTool, ListResourcesTool].some((t) =>
                tools.some((tool) => matchesToolName(tool, t.name)))) {
                additionalTools.push(ReadResourceTool, ListResourcesTool);
            }

            // Add SubscribeResource and UnsubscribeResource if subscription supported
            if (clientConnection.capabilities?.resources?.subscribe &&
                SubscribeResourceTool && UnsubscribeResourceTool) {
                if (![SubscribeResourceTool, UnsubscribeResourceTool].some((t) =>
                    tools.some((tool) => matchesToolName(tool, t.name)))) {
                    additionalTools.push(SubscribeResourceTool, UnsubscribeResourceTool);
                }
            }
        }

        // Add prompt tools if available
        if (ListPromptsTool && GetPromptTool) {
            if (![ListPromptsTool, GetPromptTool].some((t) =>
                tools.some((tool) => matchesToolName(tool, t.name)))) {
                additionalTools.push(ListPromptsTool, GetPromptTool);
            }
        }

        return {
            client: clientConnection,
            tools: [...tools, ...additionalTools],
            commands,
            resources: resources.length > 0 ? resources : undefined
        };
    } catch (error) {
        logError(serverName, `Error during reconnection: ${formatError(error)}`);
        return {
            client: {
                name: serverName,
                type: "failed",
                config
            },
            tools: [],
            commands: []
        };
    }
}

// Mapping: nl→connectMcpServer, A→serverName, q→config, zh→connectMcpClient,
//          JE→fetchMcpTools, K_6→fetchMcpCommands, Rl→fetchMcpResources,
//          tV→initializeConnectionTracker, VN→trackConnectionAttempt,
//          EY→logError, _1→formatError, z3→matchesToolName
```

---

## 4. setupElicitationRequestHandler (WT7) - Elicitation System

### What it does

Sets up request handlers for MCP elicitation (server → user input requests). Handles both form mode (JSON schema) and URL mode (OAuth flows).

### How it works

1. Register request handler for `elicitation/create` method
2. Run pre-elicitation hooks via `sx6` (runElicitationHook)
3. If hook provides response, return it
4. Otherwise, queue elicitation for UI handling
5. Wait for user response via Promise
6. Run post-elicitation hooks via `tx6` (runElicitationResultHook)
7. Return response to server
8. Handle completion notifications for URL mode

### Key insight

Elicitation enables MCP servers to request user input mid-execution. This is used for:
- **Form mode**: Collect structured data via JSON schema
- **URL mode**: Handle OAuth authentication flows

```javascript
// ============================================
// setupElicitationRequestHandler - Handle MCP elicitation requests
// Location: chunks.58.mjs:3-84
// ============================================

// ORIGINAL (for source lookup):
function WT7(A, q, K) {
    try {
        A.setRequestHandler(yp, async (Y, z) => {
            n1(q, `Received elicitation request: ${B6(Y)}`);
            let _ = jB3(Y.params);
            d("tengu_mcp_elicitation_shown", {
                mode: _
            });
            try {
                let w = await sx6(q, Y.params, z.signal);
                if (w) return n1(q, `Elicitation resolved by hook: ${B6(w)}`), d("tengu_mcp_elicitation_response", {
                    mode: _,
                    action: w.action
                }), w;
                let O = _ === "url" && "elicitationId" in Y.params ? Y.params.elicitationId : void 0,
                    H = await new Promise((J) => {
                        let M = () => {
                            J({
                                action: "cancel"
                            })
                        };
                        if (z.signal.aborted) {
                            M();
                            return
                        }
                        let D = O ? {
                            actionLabel: "Skip confirmation"
                        } : void 0;
                        K((X) => ({
                            ...X,
                            elicitation: {
                                queue: [...X.elicitation.queue, {
                                    serverName: q,
                                    requestId: z.requestId,
                                    params: Y.params,
                                    signal: z.signal,
                                    waitingState: D,
                                    respond: (P) => {
                                        z.signal.removeEventListener("abort", M), d("tengu_mcp_elicitation_response", {
                                            mode: _,
                                            action: P.action
                                        }), J(P)
                                    }
                                }]
                            }
                        })), z.signal.addEventListener("abort", M)
                    });
                return n1(q, `Elicitation response: ${B6(H)}`), await tx6(q, H, z.signal, _, O)
            } catch (w) {
                return EY(q, `Elicitation error: ${w}`), {
                    action: "cancel"
                }
            }
        }), A.setNotificationHandler(My6, (Y) => {
            let {
                elicitationId: z
            } = Y.params;
            n1(q, `Received elicitation completion notification: ${z}`), Xm({
                message: `MCP server "${q}" confirmed elicitation ${z} complete`,
                notificationType: "elicitation_complete"
            });
            let _ = !1;
            if (K((w) => {
                    let O = JB3(w.elicitation.queue, q, z);
                    if (O === -1) return w;
                    _ = !0;
                    let $ = [...w.elicitation.queue];
                    return $[O] = {
                        ...$[O],
                        completed: !0
                    }, {
                        ...w,
                        elicitation: {
                            queue: $
                        }
                    }
                }), !_) n1(q, `Ignoring completion notification for unknown elicitation: ${z}`)
        })
    } catch {
        return
    }
}

// READABLE (for understanding):
function setupElicitationRequestHandler(client, serverName, setAppState) {
    try {
        // Register handler for elicitation/create requests
        client.setRequestHandler(ElicitationCreateSchema, async (request, context) => {
            logInfo(serverName, `Received elicitation request: ${JSON.stringify(request)}`);

            // Detect elicitation mode
            const mode = detectElicitationMode(request.params);

            emitTelemetry("tengu_mcp_elicitation_shown", {
                mode
            });

            try {
                // Run pre-elicitation hook
                const hookResponse = await runElicitationHook(
                    serverName,
                    request.params,
                    context.signal
                );

                // If hook provided response, use it
                if (hookResponse) {
                    logInfo(serverName, `Elicitation resolved by hook: ${JSON.stringify(hookResponse)}`);
                    emitTelemetry("tengu_mcp_elicitation_response", {
                        mode,
                        action: hookResponse.action
                    });
                    return hookResponse;
                }

                // Extract URL mode elicitation ID if present
                const elicitationId = mode === "url" && "elicitationId" in request.params
                    ? request.params.elicitationId
                    : undefined;

                // Queue elicitation for UI handling
                const userResponse = await new Promise((resolve) => {
                    // Cancel handler for abort signal
                    const handleAbort = () => {
                        resolve({ action: "cancel" });
                    };

                    if (context.signal.aborted) {
                        handleAbort();
                        return;
                    }

                    // URL mode: show "Skip confirmation" button
                    const waitingState = elicitationId ? {
                        actionLabel: "Skip confirmation"
                    } : undefined;

                    // Add to elicitation queue
                    setAppState((state) => ({
                        ...state,
                        elicitation: {
                            queue: [...state.elicitation.queue, {
                                serverName,
                                requestId: context.requestId,
                                params: request.params,
                                signal: context.signal,
                                waitingState,
                                respond: (response) => {
                                    context.signal.removeEventListener("abort", handleAbort);
                                    emitTelemetry("tengu_mcp_elicitation_response", {
                                        mode,
                                        action: response.action
                                    });
                                    resolve(response);
                                }
                            }]
                        }
                    }));

                    context.signal.addEventListener("abort", handleAbort);
                });

                logInfo(serverName, `Elicitation response: ${JSON.stringify(userResponse)}`);

                // Run post-elicitation hook
                return await runElicitationResultHook(
                    serverName,
                    userResponse,
                    context.signal,
                    mode,
                    elicitationId
                );
            } catch (error) {
                logError(serverName, `Elicitation error: ${error}`);
                return { action: "cancel" };
            }
        });

        // Register handler for completion notifications (URL mode)
        client.setNotificationHandler(ElicitationCompleteNotification, (notification) => {
            const { elicitationId } = notification.params;

            logInfo(serverName, `Received elicitation completion notification: ${elicitationId}`);

            showNotification({
                message: `MCP server "${serverName}" confirmed elicitation ${elicitationId} complete`,
                notificationType: "elicitation_complete"
            });

            // Mark elicitation as completed in queue
            let found = false;
            setAppState((state) => {
                const queueIndex = findElicitationQueueIndex(
                    state.elicitation.queue,
                    serverName,
                    elicitationId
                );

                if (queueIndex === -1) return state;

                found = true;
                const newQueue = [...state.elicitation.queue];
                newQueue[queueIndex] = {
                    ...newQueue[queueIndex],
                    completed: true
                };

                return {
                    ...state,
                    elicitation: {
                        queue: newQueue
                    }
                };
            });

            if (!found) {
                logInfo(serverName,
                    `Ignoring completion notification for unknown elicitation: ${elicitationId}`);
            }
        });
    } catch {
        return;
    }
}

// Mapping: WT7→setupElicitationRequestHandler, A→client, q→serverName, K→setAppState,
//          yp→ElicitationCreateSchema, My6→ElicitationCompleteNotification,
//          sx6→runElicitationHook, tx6→runElicitationResultHook, jB3→detectElicitationMode,
//          JB3→findElicitationQueueIndex, n1→logInfo, EY→logError, Xm→showNotification,
//          B6→JSON.stringify, d→emitTelemetry
```

---

## 5. runElicitationHook (sx6) - Pre-Elicitation Hook

### What it does

Runs the `Elicitation` hook before showing the elicitation dialog. Hooks can auto-respond to known elicitation patterns.

```javascript
// ============================================
// runElicitationHook - Execute Elicitation hooks
// Location: chunks.58.mjs:86-115
// ============================================

// ORIGINAL (for source lookup):
async function sx6(A, q, K) {
    try {
        let Y = q.mode === "url" ? "url" : "form",
            z = "url" in q ? q.url : void 0,
            _ = "elicitationId" in q ? q.elicitationId : void 0,
            {
                elicitationResponse: w,
                blockingError: O
            } = await A$8({
                serverName: A,
                message: q.message,
                requestedSchema: "requestedSchema" in q ? q.requestedSchema : void 0,
                signal: K,
                mode: Y,
                url: z,
                elicitationId: _
            });
        if (O) return {
            action: "decline"
        };
        if (w) return {
            action: w.action,
            content: w.content
        };
        return
    } catch (Y) {
        EY(A, `Elicitation hook error: ${Y}`);
        return
    }
}

// READABLE (for understanding):
async function runElicitationHook(serverName, params, signal) {
    try {
        // Determine mode
        const mode = params.mode === "url" ? "url" : "form";
        const url = "url" in params ? params.url : undefined;
        const elicitationId = "elicitationId" in params ? params.elicitationId : undefined;

        // Execute hook
        const {
            elicitationResponse,
            blockingError
        } = await executeElicitationHook({
            serverName,
            message: params.message,
            requestedSchema: "requestedSchema" in params ? params.requestedSchema : undefined,
            signal,
            mode,
            url,
            elicitationId
        });

        // Handle blocking error
        if (blockingError) {
            return { action: "decline" };
        }

        // Return hook response if provided
        if (elicitationResponse) {
            return {
                action: elicitationResponse.action,
                content: elicitationResponse.content
            };
        }

        return undefined;
    } catch (error) {
        logError(serverName, `Elicitation hook error: ${error}`);
        return undefined;
    }
}

// Mapping: sx6→runElicitationHook, A→serverName, q→params, K→signal,
//          A$8→executeElicitationHook, EY→logError
```

---

## 6. Elicitation Flow Diagram

```
MCP Server                              Claude Code
    │                                        │
    │  elicitation/create                    │
    │  {message, requestedSchema/uris}       │
    │───────────────────────────────────────▶│
    │                                        │
    │                                        ├─→ runElicitationHook (sx6)
    │                                        │   (hook can auto-respond)
    │                                        │
    │                               ┌────────┴────────┐
    │                               │ Hook provided   │
    │                               │ response?       │
    │                               └────────┬────────┘
    │                                   Yes  │  No
    │                              ◄─────────┼─────────►
    │                                        │
    │                                        ├─→ Queue in elicitation.queue
    │                                        │
    │                                        ├─→ UI: Form Dialog or URL redirect
    │                                        │
    │  ◀─────────────────────────────────────│
    │  elicitation/result                    │
    │  {action: "accept", content: {...}}    │
    │                                        │
    │                                        ├─→ runElicitationResultHook (tx6)
    │                                        │
    │  elicitation/complete (URL mode)       │
    │  {elicitationId: "..."}                │
    │◀───────────────────────────────────────│
```

---

## 7. MCP Tool Annotations

Tool annotations map to Claude Code tool methods:

| MCP Annotation | Claude Code Method | Purpose |
|----------------|-------------------|---------|
| `readOnlyHint` | `isReadOnly()`, `isConcurrencySafe()` | Tool doesn't modify state |
| `destructiveHint` | `isDestructive()` | Tool may cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Tool interacts with external systems |
| `title` | `userFacingName()` | Human-readable tool name |

---

## 8. Cross-Module Integration

### MCP ↔ Tools (05)

- MCP tools registered with `mcp__` prefix
- Tool execution routes through standard pipeline
- Progress tracking via `mcp_progress` events

### MCP ↔ System Reminder (04)

Attachment types generated:
- `elicitation` - Elicitation request from server
- `elicitation_result` - User response to elicitation
- `mcp_progress` - Tool execution progress
- `mcp_resource` - Resource content
- `mcp_server_status` - Connection status

### MCP ↔ Hooks (11)

- `Elicitation` hook - Pre-process elicitation requests
- `ElicitationResult` hook - Post-process responses

---

## Symbol Validation Status

**Last validated:** 2026-03-27

All symbols in this module have been cross-validated against source code.

### Key Validated Symbols

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| JE | fetchMcpTools | chunks.170.mjs:533 | ✅ Correct |
| pC | callMcpTool | chunks.169.mjs:1910 | ✅ Correct |
| nl | connectMcpServer | chunks.169.mjs:1919 | ✅ Correct |
| WT7 | setupElicitationRequestHandler | chunks.58.mjs:3 | ✅ Correct |
| sx6 | runElicitationHook | chunks.58.mjs:86 | ✅ Correct |
| tx6 | runElicitationResultHook | chunks.58.mjs:117 | ✅ Correct |
| F3z | executeMcpToolCall | chunks.170.mjs:607 | ✅ Correct |
| yT6 | getMcpClientConnection | chunks.170.mjs:606 | ✅ Correct |
| qn8 | McpSessionLostError | chunks.170.mjs | ✅ Correct |
| EV | McpToolExecutionError | chunks.170.mjs | ✅ Correct |