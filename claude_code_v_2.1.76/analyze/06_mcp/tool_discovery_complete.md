# MCP Tool Discovery Complete Analysis (Claude Code 2.1.76)

> Complete source-level analysis of MCP tool discovery, prefixing, annotation extraction, and registration.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions in this document:
- `fetchMcpTools` (JE) - Tool discovery entry point - chunks.170.mjs:533
- `$58` (buildMcpToolName) - Prefix builder - inferred
- `F3z` (executeMcpToolCall) - Tool execution - chunks.170.mjs:607
- `yT6` (getMcpClientConnection) - Get connected client - chunks.170.mjs:606

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                  MCP TOOL DISCOVERY ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ① MCP Server Connection                                            │
│     ├─ StdioClientTransport (SO8) - Local process                   │
│     ├─ SSEClientTransport - HTTP SSE                                │
│     └─ StreamableHTTPClientTransport - HTTP streaming               │
│                                                                       │
│  ② Capability Check                                                  │
│     ├─ client.capabilities?.tools                                   │
│     └─ Skip if server doesn't support tools                         │
│                                                                       │
│  ③ tools/list Request                                               │
│     ├─ JSON-RPC: { method: "tools/list" }                           │
│     └─ Returns: { tools: [...] }                                    │
│                                                                       │
│  ④ Tool Transformation                                               │
│     ├─ Name prefixing: mcp__<server>__<tool>                        │
│     ├─ Annotation extraction (readOnly, destructive, openWorld)     │
│     └─ Interface adaptation (call, description, permissions)        │
│                                                                       │
│  ⑤ Registration                                                      │
│     ├─ Add to session tool set                                      │
│     ├─ Cache with memoization (ZP)                                  │
│     └─ Available for LLM invocation                                 │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## fetchMcpTools (JE) - Complete Source Code

**What it does:**
Discovers all available tools from a connected MCP server via the `tools/list` JSON-RPC method. Transforms each MCP tool into a Claude Code tool object with proper prefixing, annotations, and execution wrapper.

**Why this approach:**
- Memoization via `ZP` caches results by server name, preventing redundant discovery calls
- Deferred loading via async `description()` and `prompt()` allows lazy evaluation
- Annotation extraction enables intelligent permission auto-classification
- Retry logic handles session recovery for transient failures

```javascript
// ============================================
// JE (fetchMcpTools) - Discover tools from MCP server
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
const fetchMcpTools = memoizeAsync(async (clientConnection) => {
    // 1. Check connection status
    if (clientConnection.type !== "connected") {
        return [];
    }

    try {
        // 2. Check if server supports tools
        if (!clientConnection.capabilities?.tools) {
            return [];
        }

        // 3. Request tools from server
        const response = await clientConnection.client.request(
            { method: "tools/list" },
            toolsListResponseSchema
        );

        // 4. Deduplicate tools by name
        const tools = deduplicateTools(response.tools);

        // 5. Check if prefixing should be skipped (SDK mode)
        const skipPrefix = clientConnection.config.type === "sdk" &&
            parseBoolean(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);

        // 6. Transform each MCP tool to Claude Code tool format
        return tools.map((mcpTool) => {
            // Build prefixed name: mcp__serverName__toolName
            const prefixedName = buildMcpToolName(
                clientConnection.name,
                mcpTool.name
            );

            return {
                // Base tool properties
                ...baseToolProperties,

                // Name (with or without prefix)
                name: skipPrefix ? mcpTool.name : prefixedName,

                // MCP metadata
                mcpInfo: {
                    serverName: clientConnection.name,
                    toolName: mcpTool.name
                },
                isMcp: true,

                // Async description (lazy evaluation)
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

                // Permission check
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
                async call(input, context, canUseTool, message, progressCallback) {
                    const toolUseId = extractToolUseId(message);
                    const meta = toolUseId ? { "claudecode/toolUseId": toolUseId } : {};

                    // Report progress start
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
                            // Get fresh connection
                            const client = await getMcpClientConnection(clientConnection);

                            // Execute tool
                            const result = await executeMcpToolCall({
                                client: client,
                                clientConnection: clientConnection,
                                tool: mcpTool.name,
                                args: input,
                                meta: meta,
                                signal: context.abortController.signal,
                                setAppState: context.setAppState,
                                onProgress: progressCallback && toolUseId ? (data) => {
                                    progressCallback({
                                        toolUseID: toolUseId,
                                        data: data
                                    });
                                } : undefined,
                                handleElicitation: context.handleElicitation
                            });

                            // Report progress complete
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
                            // Handle session loss - retry once
                            if (error instanceof McpSessionLostError && attempt < maxRetries) {
                                logInfo(clientConnection.name,
                                    `Retrying tool '${mcpTool.name}' after session recovery`);
                                continue;
                            }

                            // Report progress failed
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

                            // Wrap errors for better UI display
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

                // User-facing display name
                userFacingName() {
                    const title = mcpTool.annotations?.title || mcpTool.name;
                    return `${clientConnection.name} - ${title} (MCP)`;
                },

                // Chrome extension overrides (if applicable)
                ...(isChromeExtension(clientConnection.name)
                    ? getClaudeInChromeMCPToolOverrides(mcpTool.name)
                    : {})
            };
        }).filter(isValidTool);

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (conn) => conn.name, cacheConfig);

// Mapping: JE→fetchMcpTools, A→clientConnection, ZP→memoizeAsync,
//          $y6→toolsListResponseSchema, Ws→deduplicateTools, $58→buildMcpToolName,
//          tZq→baseToolProperties, p3z→extractToolUseId, yT6→getMcpClientConnection,
//          F3z→executeMcpToolCall, qn8→McpSessionLostError, EV→McpToolExecutionError,
//          W96→isChromeExtension, T3z→getClaudeInChromeOverrides, x3z→isValidTool
```

---

## Tool Name Prefixing

### Prefix Format

```
mcp__<server_name>__<tool_name>

Examples:
- mcp__sqlite__query
- mcp__filesystem__read_file
- mcp__github__create_issue
```

### Prefix Logic

```javascript
// ============================================
// $58 (buildMcpToolName) - Build prefixed tool name
// ============================================

function buildMcpToolName(serverName, toolName) {
    return `mcp__${serverName}__${toolName}`;
}

// SDK mode can disable prefixing via environment variable
const skipPrefix = clientConnection.config.type === "sdk" &&
    parseBoolean(process.env.CLAUDE_AGENT_SDK_MCP_NO_PREFIX);
```

### Name Parsing

```javascript
// ============================================
// Parse MCP tool name to extract server and tool
// ============================================

function parseMcpToolName(prefixedName) {
    if (!prefixedName.startsWith("mcp__")) {
        return null;
    }

    const parts = prefixedName.slice(5).split("__");
    if (parts.length !== 2) {
        return null;
    }

    return {
        serverName: parts[0],
        toolName: parts[1]
    };
}
```

---

## Annotation Extraction

### MCP Tool Annotations

| Annotation | Method | Purpose |
|------------|--------|---------|
| `readOnlyHint` | `isReadOnly()`, `isConcurrencySafe()` | Tool doesn't modify state |
| `destructiveHint` | `isDestructive()` | Tool may cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Tool interacts with external systems |
| `title` | `userFacingName()` | Human-readable display name |

### Auto-Classification Impact

```javascript
// Annotation-based permission auto-classification

if (tool.isReadOnly()) {
    // Auto-allow in read-only contexts
    // Safe for parallel execution
}

if (tool.isDestructive()) {
    // Higher scrutiny in permission prompt
    // Warning displayed to user
}

if (tool.isOpenWorld()) {
    // Network sandbox consideration
    // External system warnings
}
```

---

## Tool Discovery Flow

### Sequence Diagram

```
MCP Server                     Claude Code
    │                              │
    │ ◄──── tools/list ────────────│
    │                              │
    │──── { tools: [...] } ───────►│
    │                              │
    │                         ┌────┴────┐
    │                         │ Transform│
    │                         │ each tool│
    │                         └────┬────┘
    │                              │
    │                         ┌────┴────┐
    │                         │ Register│
    │                         │ in set  │
    │                         └────┬────┘
    │                              │
    │                              ▼
    │                         Available for LLM
```

### Capability Check

```javascript
// ============================================
// Check if MCP server supports tools
// ============================================

if (!clientConnection.capabilities?.tools) {
    // Server doesn't support tools capability
    return [];
}

// After connection, capabilities are populated:
// {
//   tools: { /* tools capability */ },
//   resources: { /* resources capability */ },
//   prompts: { /* prompts capability */ }
// }
```

---

## Progress Reporting

### Progress Callback Structure

```javascript
// ============================================
// MCP tool progress events
// ============================================

// Progress start
{
    toolUseID: "toolu_xxx",
    data: {
        type: "mcp_progress",
        status: "started",
        serverName: "sqlite",
        toolName: "query"
    }
}

// Progress update (from server)
{
    toolUseID: "toolu_xxx",
    data: {
        type: "progress",  // MCP progress notification
        progressToken: "token-123",
        progress: 0.5,
        message: "Querying database..."
    }
}

// Progress complete
{
    toolUseID: "toolu_xxx",
    data: {
        type: "mcp_progress",
        status: "completed",
        serverName: "sqlite",
        toolName: "query",
        elapsedTimeMs: 1234
    }
}

// Progress failed
{
    toolUseID: "toolu_xxx",
    data: {
        type: "mcp_progress",
        status: "failed",
        serverName: "sqlite",
        toolName: "query",
        elapsedTimeMs: 500
    }
}
```

---

## Session Recovery

### Retry Logic

```javascript
// ============================================
// Session recovery for MCP tools
// ============================================

for (let attempt = 0; ; attempt++) {
    try {
        const client = await getMcpClientConnection(clientConnection);
        const result = await executeMcpToolCall({ ... });
        return result;

    } catch (error) {
        // McpSessionLostError - connection lost
        if (error instanceof McpSessionLostError && attempt < maxRetries) {
            logInfo(serverName, `Retrying tool after session recovery`);
            continue;  // Retry once
        }
        throw error;
    }
}
```

---

## Error Handling

### Error Types

| Error | Description | Handling |
|-------|-------------|----------|
| `McpSessionLostError` (qn8) | Connection lost during execution | Retry once |
| `McpToolExecutionError` (EV) | Tool execution failure | Display to user |
| `McpError` | Protocol-level error | Wrap in EV for UI |

### Error Wrapping

```javascript
// ============================================
// Wrap generic errors for better UI display
// ============================================

if (error instanceof Error && !(error instanceof McpToolExecutionError)) {
    const errorType = error.constructor.name;

    if (errorType === "Error") {
        throw new McpToolExecutionError(
            error.message,
            error.message.slice(0, 200)  // Truncated for display
        );
    }

    if (errorType === "McpError" && "code" in error) {
        throw new McpToolExecutionError(
            error.message,
            `McpError ${error.code}`
        );
    }
}
```

---

## Memoization

### Cache Configuration

```javascript
// ============================================
// ZP (memoizeAsync) configuration
// ============================================

const fetchMcpTools = memoizeAsync(
    async (clientConnection) => { /* ... */ },
    (connection) => connection.name,  // Cache key
    cacheConfig                        // Cache options
);

// Cache invalidation on reconnect
JE.cache.delete(serverName);
```

---

## Cross-Module Integration

### MCP → Tools (05)

- MCP tools registered in session tool set
- Tool execution routes through standard pipeline
- Permission checks apply to MCP tools

### MCP → System Reminder (04)

- Tool discovery status in session state
- Progress events become attachments
- Tool execution results as tool_result blocks

### MCP → UI (02)

- MCP state slice in REPL component
- Progress indicators during execution
- Error display for failed tools

---

## Quick Reference

### Key Symbols

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| JE | fetchMcpTools | Tool discovery |
| $58 | buildMcpToolName | Name prefixing |
| F3z | executeMcpToolCall | Tool execution |
| yT6 | getMcpClientConnection | Get client |
| qn8 | McpSessionLostError | Session lost |
| EV | McpToolExecutionError | Tool error |

### Tool Name Format

```
mcp__<server_name>__<tool_name>
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `CLAUDE_AGENT_SDK_MCP_NO_PREFIX` | Disable tool name prefixing in SDK mode |

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Binary content handling, structured content support |
| 2.1.72 | Progress reporting enhancements |
| 2.1.32 | Chrome extension tool overrides |
| 2.1.27 | SSE transport support |