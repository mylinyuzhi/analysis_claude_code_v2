# MCP Tool Execution Complete Source Restoration (Claude Code 2.1.76)

> Complete source-level restoration of MCP tool discovery, execution, progress tracking, and retry logic.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions in this document:
- `fetchMcpTools` (JE) - Tool discovery entry point - chunks.170.mjs:533
- `mcpToolCall` (call in tool object) - Tool execution wrapper - chunks.170.mjs:589
- `getMcpClientConnection` (yT6) - Get connected client - chunks.170.mjs:606
- `executeMcpToolCall` (F3z) - Core execution with elicitation

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                  MCP TOOL EXECUTION ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Tool Discovery (fetchMcpTools - JE)                              │
│     ├─ Check server connected and has tools capability               │
│     ├─ Send tools/list JSON-RPC request                              │
│     ├─ Build prefixed name: mcp__<server>__<tool>                   │
│     ├─ Extract annotations (readOnly, destructive, openWorld)       │
│     └─ Create tool object with call() method                         │
│                                                                       │
│  ② Tool Call Wrapper (in tool.call)                                 │
│     ├─ Build meta headers (toolUseId)                                │
│     ├─ Emit progress event (started)                                 │
│     ├─ Get client connection (yT6)                                   │
│     ├─ Call executeMcpToolCall (F3z)                                 │
│     ├─ Handle session recovery retry                                 │
│     └─ Emit progress event (completed/failed)                        │
│                                                                       │
│  ③ Error Handling                                                    │
│     ├─ McpSessionLostError (qn8) → Retry after recovery             │
│     ├─ McpToolExecutionError (EV) → Wrapped for UI display          │
│     └─ McpError → Converted to McpToolExecutionError                 │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. fetchMcpTools (JE) - Tool Discovery

**What it does:**
Discovers all available tools from a connected MCP server via the `tools/list` JSON-RPC method. Transforms each MCP tool into a Claude Code tool object with proper prefixing, annotations, and execution wrapper.

**How it works:**
1. Check server is connected and has `capabilities.tools`
2. Send `tools/list` JSON-RPC request
3. For each tool in response:
   - Build prefixed name: `mcp__<server>__<tool>`
   - Extract annotations from `tool.annotations`
   - Create tool object with all required methods
4. Filter and return tool objects

**Why this approach:**
- Memoization via `ZP` caches results by server name
- Deferred loading via async `description()` and `prompt()` allows lazy evaluation
- Annotation extraction enables intelligent permission auto-classification

**Key insight:**
The SDK mode (`CLAUDE_AGENT_SDK_MCP_NO_PREFIX`) disables tool name prefixing, which is useful for simpler integrations where the tool namespace is managed externally.

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
const fetchMcpTools = memoize(async (serverConnection) => {
    // Only process connected servers
    if (serverConnection.type !== "connected") {
        return [];
    }

    try {
        // Check if server has tools capability
        if (!serverConnection.capabilities?.tools) {
            return [];
        }

        // Send tools/list JSON-RPC request
        const response = await serverConnection.client.request(
            { method: "tools/list" },
            ToolsListResponseSchema
        );

        const tools = ensureArray(response.tools);

        // Check if SDK mode (no prefix)
        const isSdkMode = serverConnection.config.type === "sdk" &&
            parseBoolean(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        return tools.map((mcpTool) => {
            // Build prefixed tool name
            const prefixedName = buildMcpToolName(serverConnection.name, mcpTool.name);

            return {
                // Base tool properties
                ...BASE_TOOL_PROPERTIES,
                name: isSdkMode ? mcpTool.name : prefixedName,

                // MCP-specific metadata
                mcpInfo: {
                    serverName: serverConnection.name,
                    toolName: mcpTool.name
                },
                isMcp: true,

                // Async descriptions (lazy evaluation)
                async description() {
                    return mcpTool.description ?? "";
                },
                async prompt() {
                    return mcpTool.description ?? "";
                },

                // Annotation-based properties
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

                // Schema
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

                // Main execution method
                async call(input, sessionContext, streamingContext, assistantMessage, progressCallback) {
                    // Build meta headers
                    const toolUseId = extractToolUseId(assistantMessage);
                    const meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};

                    // Emit progress: started
                    if (progressCallback && toolUseId) {
                        progressCallback({
                            toolUseID: toolUseId,
                            data: {
                                type: "mcp_progress",
                                status: "started",
                                serverName: serverConnection.name,
                                toolName: mcpTool.name
                            }
                        });
                    }

                    const startTime = Date.now();
                    const maxRetries = 1;

                    // Retry loop for session recovery
                    for (let attempt = 0; ; attempt++) {
                        try {
                            // Get connected client
                            const client = await getMcpClientConnection(serverConnection);

                            // Execute tool
                            const result = await executeMcpToolCall({
                                client,
                                clientConnection: serverConnection,
                                tool: mcpTool.name,
                                args: input,
                                meta,
                                signal: sessionContext.abortController.signal,
                                setAppState: sessionContext.setAppState,
                                onProgress: progressCallback && toolUseId ? (progress) => {
                                    progressCallback({
                                        toolUseID: toolUseId,
                                        data: progress
                                    });
                                } : undefined,
                                handleElicitation: sessionContext.handleElicitation
                            });

                            // Emit progress: completed
                            if (progressCallback && toolUseId) {
                                progressCallback({
                                    toolUseID: toolUseId,
                                    data: {
                                        type: "mcp_progress",
                                        status: "completed",
                                        serverName: serverConnection.name,
                                        toolName: mcpTool.name,
                                        elapsedTimeMs: Date.now() - startTime
                                    }
                                });
                            }

                            // Return result with optional metadata
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
                            // Session lost - retry after recovery
                            if (error instanceof McpSessionLostError && attempt < maxRetries) {
                                logWarning(serverConnection.name, `Retrying tool '${mcpTool.name}' after session recovery`);
                                continue;
                            }

                            // Emit progress: failed
                            if (progressCallback && toolUseId) {
                                progressCallback({
                                    toolUseID: toolUseId,
                                    data: {
                                        type: "mcp_progress",
                                        status: "failed",
                                        serverName: serverConnection.name,
                                        toolName: mcpTool.name,
                                        elapsedTimeMs: Date.now() - startTime
                                    }
                                });
                            }

                            // Wrap errors for UI display
                            if (error instanceof Error && !(error instanceof McpToolExecutionError)) {
                                const errorType = error.constructor.name;
                                if (errorType === "Error") {
                                    throw new McpToolExecutionError(error.message, error.message.slice(0, 200));
                                }
                                if (errorType === "McpError" && "code" in error && typeof error.code === "number") {
                                    throw new McpToolExecutionError(error.message, `McpError ${error.code}`);
                                }
                            }

                            throw error;
                        }
                    }
                },

                userFacingName() {
                    const title = mcpTool.annotations?.title || mcpTool.name;
                    return `${serverConnection.name} - ${title} (MCP)`;
                }
            };
        }).filter(isValidTool);

    } catch (error) {
        logError(serverConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (server) => server.name, memoizeKeyFn);

// Mapping: JE→fetchMcpTools, A→serverConnection, ZP→memoize, $y6→ToolsListResponseSchema,
//          Ws→ensureArray, $58→buildMcpToolName, tZq→BASE_TOOL_PROPERTIES, t6→parseBoolean,
//          yT6→getMcpClientConnection, F3z→executeMcpToolCall, qn8→McpSessionLostError,
//          EV→McpToolExecutionError, p3z→extractToolUseId, x3z→isValidTool
```

---

## 2. Tool Annotation Mapping

MCP tool annotations map to Claude Code tool methods:

| MCP Annotation | Claude Code Method | Purpose |
|----------------|-------------------|---------|
| `readOnlyHint` | `isReadOnly()`, `isConcurrencySafe()` | Tool doesn't modify state |
| `destructiveHint` | `isDestructive()` | Tool may cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Tool interacts with external systems |
| `title` | `userFacingName()` | Display name for UI |

```javascript
// Annotation extraction in tool object
isReadOnly() {
    return mcpTool.annotations?.readOnlyHint ?? false;
},
isDestructive() {
    return mcpTool.annotations?.destructiveHint ?? false;
},
isOpenWorld() {
    return mcpTool.annotations?.openWorldHint ?? false;
}
```

---

## 3. Progress Tracking

MCP tools emit progress events through the progress callback:

```javascript
// Progress event structure
{
    type: "mcp_progress",
    status: "started" | "completed" | "failed",
    serverName: string,
    toolName: string,
    elapsedTimeMs?: number  // Only for completed/failed
}
```

**Progress Flow:**
1. `started` - Before tool execution begins
2. `completed` - After successful execution (includes elapsed time)
3. `failed` - On error (includes elapsed time)

---

## 4. Error Handling

### Error Types

| Error Class | Symbol | When Thrown |
|-------------|--------|-------------|
| `McpSessionLostError` | qn8 | Session disconnected (404, -32001) |
| `McpToolExecutionError` | EV | Tool execution failure (wrapped) |

### Retry Logic

```javascript
// Retry loop for session recovery
for (let attempt = 0; ; attempt++) {
    try {
        const result = await executeMcpToolCall(/* ... */);
        return result;
    } catch (error) {
        // Session lost - retry once after recovery
        if (error instanceof McpSessionLostError && attempt < 1) {
            logWarning(serverName, `Retrying tool '${toolName}' after session recovery`);
            continue;
        }
        throw error;
    }
}
```

---

## 5. callMcpTool (pC) - Simple Execution API

**What it does:**
Simple synchronous API for calling MCP tools, used by internal components like DiagnosticsManager.

```javascript
// ============================================
// callMcpTool - Simple MCP tool execution API
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
    const result = await mcpToolCallCore({
        client,
        tool: toolName,
        args,
        signal: AbortController.signal
    });

    return result.content;
}

// Mapping: pC→callMcpTool, A→toolName, q→args, K→client, PGq→mcpToolCallCore
```

---

## Integration with System Reminder

MCP tool execution generates the following attachments:

| Attachment Type | When Generated | Content |
|-----------------|----------------|---------|
| `mcp_progress` | During execution | Progress status updates |
| `structured_output` | On structured response | Tool's structured content |
| `mcp_meta` | On `_meta` response | MCP protocol metadata |

---

## 6. Elicitation Handler (WT7) - Server → User Input

**What it does:**
Sets up the request handler for `elicitation/create` messages from MCP servers. When an MCP server needs user input (e.g., authentication credentials), it sends an elicitation request that this handler processes and queues for UI display.

**How it works:**
1. Register handler for `elicitation/create` method via `setRequestHandler`
2. Detect elicitation mode (form or URL) via `detectElicitationMode` (jB3)
3. Run elicitation hook (sx6) for potential auto-response
4. If hook doesn't resolve, queue elicitation for UI display
5. Wait for user response via Promise
6. Return response to MCP server

**Why this approach:**
- Hooks can auto-respond to known elicitation patterns (e.g., OAuth flows)
- Queue-based processing enables modal priority management
- Promise-based response allows async waiting for user input

```javascript
// ============================================
// setupElicitationRequestHandler - Handle elicitation/create from MCP server
// Location: chunks.58.mjs:3-50
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
                        let M = () => { J({ action: "cancel" }) };
                        K.setAppState((G) => ({
                            ...G,
                            elicitation: {
                                ...G.elicitation,
                                queue: [...G.elicitation.queue, {
                                    id: O || generateId(),
                                    serverName: q,
                                    params: Y.params,
                                    mode: _,
                                    resolve: J,
                                    onCancel: M
                                }]
                            }
                        }))
                    });
                return d("tengu_mcp_elicitation_response", {
                    mode: _,
                    action: H.action
                }), H
            } catch (w) {
                throw n1(q, `Elicitation error: ${_1(w)}`), w
            }
        })
    } catch (Y) {
        EY(q, `Failed to set up elicitation handler: ${_1(Y)}`)
    }
}

// READABLE (for understanding):
function setupElicitationRequestHandler(client, serverName, sessionContext) {
    try {
        client.setRequestHandler(ElicitationCreateSchema, async (request, context) => {
            logInfo(serverName, `Received elicitation request: ${JSON.stringify(request)}`);

            // Detect mode (form or URL)
            const mode = detectElicitationMode(request.params);
            emitTelemetry("tengu_mcp_elicitation_shown", { mode });

            try {
                // Try to resolve via hook first
                const hookResponse = await runElicitationHook(serverName, request.params, context.signal);
                if (hookResponse) {
                    logInfo(serverName, `Elicitation resolved by hook: ${JSON.stringify(hookResponse)}`);
                    emitTelemetry("tengu_mcp_elicitation_response", { mode, action: hookResponse.action });
                    return hookResponse;
                }

                // Extract elicitation ID for URL mode
                const elicitationId = mode === "url" && "elicitationId" in request.params
                    ? request.params.elicitationId
                    : undefined;

                // Queue for UI display and wait for user response
                const userResponse = await new Promise((resolve) => {
                    const onCancel = () => resolve({ action: "cancel" });

                    sessionContext.setAppState((state) => ({
                        ...state,
                        elicitation: {
                            ...state.elicitation,
                            queue: [...state.elicitation.queue, {
                                id: elicitationId || generateId(),
                                serverName,
                                params: request.params,
                                mode,
                                resolve,
                                onCancel
                            }]
                        }
                    }));
                });

                emitTelemetry("tengu_mcp_elicitation_response", { mode, action: userResponse.action });
                return userResponse;

            } catch (error) {
                logError(serverName, `Elicitation error: ${serializeError(error)}`);
                throw error;
            }
        });
    } catch (error) {
        logError(serverName, `Failed to set up elicitation handler: ${serializeError(error)}`);
    }
}

// Mapping: WT7→setupElicitationRequestHandler, A→client, q→serverName, K→sessionContext,
//          yp→ElicitationCreateSchema, jB3→detectElicitationMode, sx6→runElicitationHook,
//          B6→JSON.stringify, _1→serializeError, n1→logInfo, EY→logError
```

**Key insight:**
The elicitation handler uses a Promise-based queue pattern. The Promise's `resolve` function is stored in the queue item, allowing the UI component to resolve it when the user submits or cancels. This creates a clean separation between the MCP protocol handler and the UI layer.

### Elicitation Mode Detection

```javascript
// jB3 - detectElicitationMode
function detectElicitationMode(params) {
    // URL mode: has 'uris' array
    if (params.uris && Array.isArray(params.uris)) {
        return "url";
    }
    // Form mode: has 'requestedSchema' object
    if (params.requestedSchema) {
        return "form";
    }
    // Default to form mode
    return "form";
}
```

---

## Cross-Reference

- [mcp_tool_execution_complete.md](./mcp_tool_execution_complete.md) - Original analysis
- [elicitation_complete.md](./elicitation_complete.md) - Elicitation handling
- [mcp_reminder_integration.md](./mcp_reminder_integration.md) - System reminder integration
- [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Symbol mappings