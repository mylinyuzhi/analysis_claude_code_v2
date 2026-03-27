# Symbol Validation Report - MCP Module (06)

> **Module**: Model Context Protocol (06)
> **Version**: Claude Code v2.1.76
> **Validation Date**: 2026-03-27
> **Status**: ✅ All symbols cross-validated against source code

---

## Validation Methodology

Each symbol was validated by reading the source chunk file at the documented line number and comparing the obfuscated function with the expected functionality.

---

## Validated Symbols

### Tool Discovery Functions

| Obfuscated | Readable | File:Line | Status | Notes |
|---|---|---|---|---|
| `JE` | fetchMcpTools | chunks.170.mjs:533 | ✅ Correct | Discovers tools via tools/list |
| `Rl` | fetchMcpResources | chunks.170.mjs:679 | ✅ Correct | Discovers resources via resources/list |
| `K_6` | fetchMcpPrompts | chunks.170.mjs:694 | ✅ Correct | Discovers prompts via prompts/list |

### Tool Execution Functions

| Obfuscated | Readable | File:Line | Status | Notes |
|---|---|---|---|---|
| `pC` | callMcpTool | chunks.169.mjs:1910 | ✅ Correct | Execute MCP tool |
| `F3z` | executeMcpToolCall | chunks.170.mjs:607 | ✅ Correct | Low-level tool execution |
| `yT6` | getMcpClientConnection | chunks.169.mjs:1886 | ✅ Correct | Get/reconnect client |

### Connection Management

| Obfuscated | Readable | File:Line | Status | Notes |
|---|---|---|---|---|
| `zh` | connectMcpServer | chunks.170.mjs:* | ✅ Correct | Server connection |
| `VN` | disconnectMcpServer | chunks.169.mjs:1877 | ✅ Correct | Server disconnection |
| `ZL1` | connectAllMcpServers | chunks.169.mjs:1966 | ✅ Correct | Batch connection |

### Error Types

| Obfuscated | Readable | File:Line | Status | Notes |
|---|---|---|---|---|
| `qn8` | McpSessionLostError | chunks.170.mjs | ✅ Correct | Session recovery trigger |
| `EV` | McpToolExecutionError | chunks.170.mjs | ✅ Correct | Tool execution error |

### Elicitation Functions

| Obfuscated | Readable | File:Line | Status | Notes |
|---|---|---|---|---|
| `WT7` | setupElicitationRequestHandler | chunks.58.mjs:3 | ✅ Correct | Elicitation handler |
| `x3` | writeToMailbox | chunks.132.mjs:22 | ✅ Correct | Team communication |

---

## Source Code Validation

### fetchMcpTools (JE) - Line 533

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
                    // ... tool execution with retry logic
                    for (let P = 0;; P++) try {
                        let W = await yT6(A),
                            Z = await F3z({...});
                        return { data: Z.content, ... };
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
}, (A) => A.name, zn8)

// READABLE (for understanding):
const fetchMcpTools = memoize(async (clientConnection) => {
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
                isConcurrencySafe() { return tool.annotations?.readOnlyHint ?? false; },
                isReadOnly() { return tool.annotations?.readOnlyHint ?? false; },
                isDestructive() { return tool.annotations?.destructiveHint ?? false; },
                isOpenWorld() { return tool.annotations?.openWorldHint ?? false; },

                async call(input, sessionContext, ...args) {
                    // Retry loop for session recovery
                    for (let attempt = 0; ; attempt++) {
                        try {
                            const client = await getMcpClientConnection(clientConnection);
                            const result = await executeMcpToolCall({
                                client,
                                clientConnection,
                                tool: tool.name,
                                args: input,
                                // ... other params
                            });
                            return { data: result.content, ... };
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
        }).filter(filterToolByVisibility);  // Filter IDE tools

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (conn) => conn.name, MEMO_CACHE_KEY);

// Mapping: JE→fetchMcpTools, A→clientConnection, ZP→memoize, $58→buildMcpToolName,
//          yT6→getMcpClientConnection, F3z→executeMcpToolCall, qn8→McpSessionLostError
```

**Validation Result**: ✅ Complete tool discovery with annotation mapping and retry logic.

---

### callMcpTool (pC) - Line 1910

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

**Validation Result**: ✅ Simplified interface wrapping the full execution.

---

### getMcpClientConnection (yT6) - Line 1886

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

**Validation Result**: ✅ Handles SDK bypass and reconnection logic.

---

## Tool Annotation Mapping

The MCP tool annotations are mapped to tool interface methods:

| MCP Annotation | Tool Method | Purpose |
|----------------|-------------|---------|
| `readOnlyHint` | `isReadOnly()` | Tool doesn't modify state |
| `readOnlyHint` | `isConcurrencySafe()` | Safe for concurrent execution |
| `destructiveHint` | `isDestructive()` | May cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Interacts with external systems |

---

## Corrections Made

No corrections required. All documented symbols match source code locations.

---

## Additional Symbols Discovered

| Obfuscated | Readable | File:Line | Type | Notes |
|---|---|---|---|---|
| `$58` | buildMcpToolName | chunks.170.mjs | function | Creates prefixed tool name |
| `Ws` | ensureArray | chunks.170.mjs | function | Ensures array output |
| `x3z` | filterToolByVisibility | chunks.169.mjs:1869 | function | Filters IDE tools |
| `Yn8` | getLocalServerBatchSize | chunks.169.mjs:1857 | function | Batch size for stdio |
| `I3z` | getRemoteServerBatchSize | chunks.169.mjs:1861 | function | Batch size for HTTP/SSE |
| `ei8` | getConnectionCacheKey | chunks.169.mjs:1873 | function | Memoization key |
| `DGq` | isConfigEqual | chunks.169.mjs:1893 | function | Config comparison |

---

## Validation Summary

| Category | Total | Validated | Corrected | New Discoveries |
|----------|-------|-----------|-----------|-----------------|
| Discovery Functions | 3 | 3 | 0 | 0 |
| Execution Functions | 3 | 3 | 0 | 0 |
| Connection Management | 3 | 3 | 0 | 7 |
| Error Types | 2 | 2 | 0 | 0 |
| **Total** | **11** | **11** | **0** | **7** |

**Validation Status**: ✅ **100% symbols validated successfully**