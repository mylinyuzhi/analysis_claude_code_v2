# MCP Connection Lifecycle Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of MCP server connection, reconnection, and lifecycle management.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions in this document:
- `fetchMcpTools` (JE) - Tool discovery from MCP server - chunks.170.mjs:533
- `callMcpTool` (pC) - Tool execution via MCP - chunks.169.mjs:1910
- `executeMcpToolCall` (F3z) - Low-level execution with retry - chunks.170.mjs:607
- `getMcpClientConnection` (yT6) - Get connected client - chunks.170.mjs:606

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                   MCP CONNECTION LIFECYCLE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① Server Configuration                                              │
│     ├─ Load from ~/.claude/settings.json (mcpServers)               │
│     ├─ Types: stdio, sse, http, sse-ide, ws-ide, sdk                │
│     └─ Check for disabled servers                                    │
│                                                                       │
│  ② Transport Selection                                               │
│     ├─ stdio: StdioClientTransport (SO8) - stdin/stdout             │
│     ├─ sse: SSEClientTransport - Server-Sent Events                 │
│     ├─ http: StreamableHTTPClientTransport - HTTP streaming         │
│     └─ ide: IDE-specific transport bridges                           │
│                                                                       │
│  ③ Connection Establishment                                          │
│     ├─ zh (connectToServer) creates connection                      │
│     ├─ Server capabilities discovery                                 │
│     └─ Status: "connected" or error state                            │
│                                                                       │
│  ④ Tool Discovery (fetchMcpTools)                                    │
│     ├─ tools/list JSON-RPC request                                   │
│     ├─ Prefix tool names: mcp__<server>__<tool>                     │
│     └─ Extract annotations (readOnly, destructive, openWorld)       │
│                                                                       │
│  ⑤ Tool Execution (callMcpTool)                                      │
│     ├─ Get connected client (yT6)                                    │
│     ├─ Execute with retry on session loss                            │
│     └─ Handle elicitation requests                                   │
│                                                                       │
│  ⑥ Session Recovery                                                   │
│     ├─ McpSessionLostError triggers reconnection                    │
│     ├─ Reconnect and retry once                                      │
│     └─ Fallback to error if retry fails                              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tool Discovery Algorithm

### fetchMcpTools Function (JE)

**What it does:**
Discovers available tools from a connected MCP server via the `tools/list` JSON-RPC method. Creates tool objects with prefixed names and extracted annotations.

**How it works:**
1. Check if server is connected and has tools capability
2. Send `tools/list` request via client
3. Process each tool: add prefix, extract annotations, create tool object
4. Return array of tool objects ready for registration

**Key insight:**
The `mcp__<server>__<tool>` prefixing ensures tool names are globally unique and identifiable as MCP tools.

```javascript
// ============================================
// JE - fetchMcpTools
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
                    // ... execution logic ...
                }
            }
        }).filter(x3z)
    } catch (q) {
        return EY(A.name, `Failed to fetch tools: ${_1(q)}`), []
    }
}, (A) => A.name, zn8)

// READABLE (for understanding):
async function fetchMcpTools(serverConnection) {
    // Only fetch from connected servers with tools capability
    if (serverConnection.type !== "connected") return [];
    if (!serverConnection.capabilities?.tools) return [];

    try {
        // Request tools list from MCP server
        const response = await serverConnection.client.request({
            method: "tools/list"
        }, ToolsListResponseSchema);

        const tools = shuffle(response.tools);  // Ws - shuffle for load balancing

        // Check if SDK mode should skip prefixing
        const skipPrefix = serverConnection.config.type === "sdk" &&
            parseBoolean(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        return tools.map((tool) => {
            // Create prefixed tool name
            const prefixedName = prefixToolName(serverConnection.name, tool.name);

            return {
                // Base tool properties
                ...baseToolProperties,
                name: skipPrefix ? tool.name : prefixedName,
                mcpInfo: {
                    serverName: serverConnection.name,
                    toolName: tool.name
                },
                isMcp: true,

                // Async description/prompt from MCP tool metadata
                async description() {
                    return tool.description ?? "";
                },
                async prompt() {
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

                // Input schema from MCP tool
                inputJSONSchema: tool.inputSchema,

                // Auto-classifier input formatter
                toAutoClassifierInput(input) {
                    return formatInputForClassifier(input, tool.name);
                },

                // Permission check - passthrough to normal permission flow
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

                // Tool execution method
                async call(input, context, canUseTool, message, progressCallback) {
                    // ... see executeMcpToolCall section ...
                },

                // User-facing display name
                userFacingName() {
                    const title = tool.annotations?.title || tool.name;
                    return `${serverConnection.name} - ${title} (MCP)`;
                }
            };
        }).filter(isValidTool);  // x3z - filter invalid tools

    } catch (error) {
        logError(serverConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}

// Mapping: JE→fetchMcpTools, A→serverConnection, ZP→memoize, $y6→ToolsListResponseSchema,
//          Ws→shuffle, t6→parseBoolean, $58→prefixToolName, tZq→baseToolProperties,
//          x3z→isValidTool, EY→logError, _1→formatError
```

---

## Tool Execution with Retry

### MCP Tool Call Implementation

**What it does:**
Executes an MCP tool with automatic session recovery on connection loss. Implements a single retry attempt.

**How it works:**
1. Get connected client (handles session recovery)
2. Execute tool via `executeMcpToolCall` (F3z)
3. On `McpSessionLostError`, retry once
4. Handle elicitation requests from MCP server
5. Return result with metadata

```javascript
// ============================================
// MCP Tool Call (extracted from JE call method)
// Location: chunks.170.mjs:589-667
// ============================================

// ORIGINAL (for source lookup):
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
}

// READABLE (for understanding):
async function executeMcpToolCall(input, context, canUseTool, message, progressCallback) {
    const toolUseId = generateToolUseId(message);
    const meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};

    // Report progress: started
    if (progressCallback && toolUseId) {
        progressCallback({
            toolUseID: toolUseId,
            data: {
                type: "mcp_progress",
                status: "started",
                serverName: serverConnection.name,
                toolName: tool.name
            }
        });
    }

    const startTime = Date.now();
    const maxRetries = 1;  // Single retry on session loss

    for (let attempt = 0; ; attempt++) {
        try {
            // Get connected client (may trigger reconnection)
            const client = await getMcpClientConnection(serverConnection);

            // Execute tool via MCP protocol
            const result = await executeMcpToolCall({
                client: client,
                clientConnection: serverConnection,
                tool: tool.name,
                args: input,
                meta: meta,
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

            // Report progress: completed
            if (progressCallback && toolUseId) {
                progressCallback({
                    toolUseID: toolUseId,
                    data: {
                        type: "mcp_progress",
                        status: "completed",
                        serverName: serverConnection.name,
                        toolName: tool.name,
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
                        ...(result.structuredContent && {
                            structuredContent: result.structuredContent
                        })
                    }
                } : {})
            };

        } catch (error) {
            // Retry on session loss (only once)
            if (error instanceof McpSessionLostError && attempt < maxRetries) {
                logInfo(serverConnection.name, `Retrying tool '${tool.name}' after session recovery`);
                continue;
            }

            // Report progress: failed
            if (progressCallback && toolUseId) {
                progressCallback({
                    toolUseID: toolUseId,
                    data: {
                        type: "mcp_progress",
                        status: "failed",
                        serverName: serverConnection.name,
                        toolName: tool.name,
                        elapsedTimeMs: Date.now() - startTime
                    }
                });
            }

            // Wrap generic errors in McpToolExecutionError
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
}

// Mapping: w→input, O→context, H→message, j→progressCallback, p3z→generateToolUseId,
//          yT6→getMcpClientConnection, F3z→executeMcpToolCall, qn8→McpSessionLostError,
//          EV→McpToolExecutionError, n1→logInfo, A→serverConnection, z→tool
```

---

## callMcpTool Helper Function

### Simple MCP Tool Invocation

**What it does:**
Provides a simplified interface for calling MCP tools, used primarily by diagnostics and internal systems.

```javascript
// ============================================
// pC - callMcpTool
// Location: chunks.169.mjs:1910-1916
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
    const result = await executeMcpToolInternal({
        client: client,
        tool: toolName,
        args: args,
        signal: getAbortController().signal
    });

    return result.content;
}

// Mapping: pC→callMcpTool, A→toolName, q→args, K→client, PGq→executeMcpToolInternal,
//          sK→getAbortController
```

---

## Tool Annotation Mapping

### MCP Annotations → Tool Methods

| MCP Annotation | Tool Method | Description |
|----------------|-------------|-------------|
| `readOnlyHint` | `isReadOnly()`, `isConcurrencySafe()` | Tool doesn't modify state |
| `destructiveHint` | `isDestructive()` | Tool may cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Tool interacts with external systems |
| `title` | `userFacingName()` | Human-readable display name |

### Permission Implications

| Annotation | Permission Behavior |
|------------|---------------------|
| `readOnlyHint: true` | Often auto-allowed in non-destructive contexts |
| `destructiveHint: true` | Always requires explicit permission |
| `openWorldHint: true` | May require additional scrutiny |

---

## Session Recovery

### McpSessionLostError Handling

**What it does:**
When the MCP server connection is lost during tool execution, the error triggers automatic reconnection and retry.

```javascript
// ============================================
// Session Recovery Logic
// ============================================

// Error class for session loss
class McpSessionLostError extends Error {
    constructor(serverName) {
        super(`MCP session lost for server: ${serverName}`);
        this.name = "McpSessionLostError";
        this.serverName = serverName;
    }
}

// Recovery flow:
// 1. Tool execution fails with McpSessionLostError
// 2. getMcpClientConnection() called on retry
// 3. Reconnection logic in zh() reconnects
// 4. Tool execution retried with new connection
// 5. If retry fails, McpToolExecutionError thrown
```

---

## Cross-Module Integration

### MCP ↔ Tools (05)

- MCP tools registered in session tool set with `mcp__` prefix
- Tool execution routes through `fxY` pipeline
- Permission checks apply to MCP tools

### MCP ↔ System Reminder (04)

- `elicitation` attachment type for MCP server input requests
- `mcp_resource` attachment for resource content
- Binary content saved to disk and referenced

### MCP ↔ UI (02)

- MCP state slice in REPL component
- `elicitation` modal at priority 7
- Server connection status display

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Binary content handling, progress tracking |
| 2.1.72 | Elicitation system (form/URL modes) |
| 2.1.32 | McpHub for browser connections |
| 2.1.27 | SSE transport support |

---

## Symbol Validation Status

**Last validated:** 2026-03-27

| Symbol | Validated Location | Status |
|--------|-------------------|--------|
| JE (fetchMcpTools) | chunks.170.mjs:533 | ✅ Correct |
| pC (callMcpTool) | chunks.169.mjs:1910 | ✅ Correct |
| F3z (executeMcpToolCall) | chunks.170.mjs:607 | ✅ Correct |
| yT6 (getMcpClientConnection) | chunks.170.mjs:606 | ✅ Correct |
| qn8 (McpSessionLostError) | chunks.170.mjs | ✅ Correct |
| EV (McpToolExecutionError) | chunks.170.mjs | ✅ Correct |