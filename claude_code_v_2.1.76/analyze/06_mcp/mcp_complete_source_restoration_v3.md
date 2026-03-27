# MCP Module - Complete Source Restoration v3

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Full source-level restoration with grep-verified symbols

---

## Overview

This document provides complete source-level restoration of all key functions in the MCP (Model Context Protocol) module. MCP enables Claude Code to connect to external servers and discover their tools dynamically.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions documented here:
- `fetchMcpTools` (JE) - Tool discovery - chunks.170.mjs:533
- `fetchMcpResources` (Rl) - Resource discovery - chunks.170.mjs:679
- `fetchMcpPrompts` (K_6) - Prompt discovery - chunks.170.mjs:694
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
│  ② Tool Discovery (fetchMcpTools - JE)                              │
│     ├─ tools/list → JSON-RPC request                                │
│     ├─ Tool name prefixing: mcp__<server>__<tool>                   │
│     ├─ Annotation mapping (readOnly, destructive, openWorld)        │
│     └─ Deferred loading for context efficiency                       │
│                                                                       │
│  ③ Tool Execution                                                    │
│     ├─ tools/call → callMcpTool (pC)                                │
│     ├─ Session recovery retry (McpSessionLostError)                 │
│     └─ Progress tracking via mcp_progress events                     │
│                                                                       │
│  ④ Resources & Prompts                                               │
│     ├─ resources/list → fetchMcpResources (Rl)                      │
│     ├─ resources/read → Resource content fetching                   │
│     └─ prompts/list → fetchMcpPrompts (K_6)                         │
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

Discovers available tools from a connected MCP server via the `tools/list` JSON-RPC method. Creates tool objects with proper name prefixing, annotation mapping, and retry logic for session recovery.

### How it works

1. Check if server is connected and supports tools capability
2. Send `tools/list` JSON-RPC request
3. Build prefixed tool names: `mcp__serverName__toolName`
4. Map MCP annotations to Claude Code tool interface methods
5. Create tool objects with `call()` method including retry logic
6. Filter by visibility (exclude IDE tools from user list)
7. Memoize results by server name

### Why this approach

- **Memoization** caches tool discovery results
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

                async prompt() {
                    return tool.description ?? "";
                },

                // Annotation mapping to tool methods
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
                async call(input, sessionContext, toolCallId, toolUseContext, progressCallback) {
                    const toolUseId = extractToolUseId(toolUseContext);
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
                                onProgress: progressCallback && toolUseId ? (progress) => {
                                    progressCallback({
                                        toolUseID: toolUseId,
                                        data: progress
                                    });
                                } : undefined,
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

                            // Wrap generic errors in McpToolExecutionError
                            if (error instanceof Error && !(error instanceof McpToolExecutionError)) {
                                const errorType = error.constructor.name;
                                if (errorType === "Error") {
                                    throw new McpToolExecutionError(
                                        error.message,
                                        error.message.slice(0, 200)
                                    );
                                }
                                if (errorType === "McpError" && "code" in error &&
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

                // User-facing name
                userFacingName() {
                    const title = tool.annotations?.title || tool.name;
                    return `${clientConnection.name} - ${title} (MCP)`;
                },

                // Chrome extension overrides if applicable
                ...(isClaudeInChromeServer(clientConnection.name) ?
                    getClaudeInChromeMCPToolOverrides(tool.name) : {})
            };
        }).filter(filterToolByVisibility);  // Filter IDE tools

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch tools: ${formatError(error)}`);
        return [];
    }
}, (conn) => conn.name, MEMO_CACHE_KEY);

// Mapping: JE→fetchMcpTools, A→clientConnection, ZP→memoize, $58→buildMcpToolName,
//          Ws→ensureArray, t6→isTruthy, yT6→getMcpClientConnection, F3z→executeMcpToolCall,
//          qn8→McpSessionLostError, EV→McpToolExecutionError, x3z→filterToolByVisibility,
//          n1→logInfo, EY→logError, _1→formatError
```

---

## 2. fetchMcpResources (Rl) - Resource Discovery

### What it does

Discovers available resources from a connected MCP server via `resources/list`. Resources represent server-provided data like files, database records, or other content.

```javascript
// ============================================
// fetchMcpResources - Discover MCP resources via resources/list
// Location: chunks.170.mjs:679-693
// ============================================

// ORIGINAL (for source lookup):
Rl = ZP(async (A) => {
    if (A.type !== "connected") return [];
    try {
        if (!A.capabilities?.resources) return [];
        let q = await A.client.request({
            method: "resources/list"
        }, Ky6);
        if (!q.resources) return [];
        return q.resources.map((K) => ({
            ...K,
            server: A.name
        }))
    } catch (q) {
        return EY(A.name, `Failed to fetch resources: ${_1(q)}`), []
    }
}, (A) => A.name, zn8)

// READABLE (for understanding):
const fetchMcpResources = memoize(async (clientConnection) => {
    // Only process connected servers
    if (clientConnection.type !== "connected") return [];

    try {
        // Check if server supports resources capability
        if (!clientConnection.capabilities?.resources) return [];

        // Request resources list
        const response = await clientConnection.client.request(
            { method: "resources/list" },
            resourcesListResultSchema
        );

        if (!response.resources) return [];

        // Add server name to each resource
        return response.resources.map((resource) => ({
            ...resource,
            server: clientConnection.name
        }));

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch resources: ${formatError(error)}`);
        return [];
    }
}, (conn) => conn.name, MEMO_CACHE_KEY);

// Mapping: Rl→fetchMcpResources, A→clientConnection, ZP→memoize, Ky6→resourcesListResultSchema,
//          EY→logError, _1→formatError
```

---

## 3. fetchMcpPrompts (K_6) - Prompt Discovery

### What it does

Discovers available prompts from a connected MCP server via `prompts/list`. Prompts are server-provided templates that can be invoked like slash commands.

```javascript
// ============================================
// fetchMcpPrompts - Discover MCP prompts via prompts/list
// Location: chunks.170.mjs:694-737
// ============================================

// ORIGINAL (for source lookup):
K_6 = ZP(async (A) => {
    if (A.type !== "connected") return [];
    try {
        if (!A.capabilities?.prompts) return [];
        let q = await A.client.request({
            method: "prompts/list"
        }, _y6);
        if (!q.prompts) return [];
        return Ws(q.prompts).map((Y) => {
            let z = Object.values(Y.arguments ?? {}).map((_) => _.name);
            return {
                type: "prompt",
                name: "mcp__" + lO(A.name) + "__" + Y.name,
                description: Y.description ?? "",
                hasUserSpecifiedDescription: !!Y.description,
                contentLength: 0,
                isEnabled: () => !0,
                isHidden: !1,
                isMcp: !0,
                progressMessage: "running",
                userFacingName() {
                    return `${A.name}:${Y.name} (MCP)`
                },
                argNames: z,
                source: "mcp",
                async getPromptForCommand(_) {
                    let w = _.split(" ");
                    try {
                        let O = await yT6(A),
                            $ = await O.client.getPrompt({
                                name: Y.name,
                                arguments: XT7(z, w)
                            });
                        return (await Promise.all($.messages.map((j) => XGq(j.content, O.name)))).flat()
                    } catch (O) {
                        throw EY(A.name, `Error running command '${Y.name}': ${_1(O)}`), O
                    }
                }
            }
        })
    } catch (q) {
        return EY(A.name, `Failed to fetch commands: ${_1(q)}`), []
    }
}, (A) => A.name, zn8)

// READABLE (for understanding):
const fetchMcpPrompts = memoize(async (clientConnection) => {
    // Only process connected servers
    if (clientConnection.type !== "connected") return [];

    try {
        // Check if server supports prompts capability
        if (!clientConnection.capabilities?.prompts) return [];

        // Request prompts list
        const response = await clientConnection.client.request(
            { method: "prompts/list" },
            promptsListResultSchema
        );

        if (!response.prompts) return [];

        return ensureArray(response.prompts).map((prompt) => {
            // Extract argument names
            const argNames = Object.values(prompt.arguments ?? {}).map((arg) => arg.name);

            return {
                type: "prompt",
                // Prefixed name for slash command
                name: "mcp__" + sanitizeName(clientConnection.name) + "__" + prompt.name,
                description: prompt.description ?? "",
                hasUserSpecifiedDescription: !!prompt.description,
                contentLength: 0,
                isEnabled: () => true,
                isHidden: false,
                isMcp: true,
                progressMessage: "running",

                userFacingName() {
                    return `${clientConnection.name}:${prompt.name} (MCP)`;
                },

                argNames,
                source: "mcp",

                // Get prompt content when invoked
                async getPromptForCommand(argsString) {
                    const args = argsString.split(" ");
                    try {
                        const client = await getMcpClientConnection(clientConnection);
                        const result = await client.client.getPrompt({
                            name: prompt.name,
                            arguments: mapArgsToNames(argNames, args)
                        });

                        // Convert MCP messages to Claude format
                        return (await Promise.all(
                            result.messages.map((msg) =>
                                convertMcpContent(msg.content, client.name)
                            )
                        )).flat();
                    } catch (error) {
                        logError(clientConnection.name,
                            `Error running command '${prompt.name}': ${formatError(error)}`);
                        throw error;
                    }
                }
            };
        });

    } catch (error) {
        logError(clientConnection.name, `Failed to fetch commands: ${formatError(error)}`);
        return [];
    }
}, (conn) => conn.name, MEMO_CACHE_KEY);

// Mapping: K_6→fetchMcpPrompts, A→clientConnection, ZP→memoize, Ws→ensureArray,
//          lO→sanitizeName, yT6→getMcpClientConnection, XT7→mapArgsToNames,
//          XGq→convertMcpContent, EY→logError, _1→formatError
```

---

## 4. Annotation Mapping

MCP tool annotations are mapped to Claude Code tool interface methods:

| MCP Annotation | Tool Method | Purpose |
|----------------|-------------|---------|
| `readOnlyHint` | `isReadOnly()` | Tool doesn't modify state |
| `readOnlyHint` | `isConcurrencySafe()` | Safe for concurrent execution |
| `destructiveHint` | `isDestructive()` | May cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Interacts with external systems |
| `title` | `userFacingName()` | Display name for UI |

### Annotation Extraction

```javascript
// ============================================
// Annotation mapping in fetchMcpTools
// ============================================

// Original annotation structure from MCP server:
const mcpTool = {
    name: "query",
    description: "Execute SQL query",
    inputSchema: { type: "object", properties: { sql: { type: "string" } } },
    annotations: {
        title: "SQL Query",
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false
    }
};

// Mapped to Claude Code tool:
const claudeTool = {
    name: "mcp__sqlite__query",
    isReadOnly() { return mcpTool.annotations?.readOnlyHint ?? false; },
    isDestructive() { return mcpTool.annotations?.destructiveHint ?? false; },
    isOpenWorld() { return mcpTool.annotations?.openWorldHint ?? false; },
    isConcurrencySafe() { return mcpTool.annotations?.readOnlyHint ?? false; },
    userFacingName() {
        const title = mcpTool.annotations?.title || mcpTool.name;
        return `sqlite - ${title} (MCP)`;
    }
};
```

---

## 5. Tool Execution with Retry Logic

### Session Recovery Flow

```
Tool call initiated
    │
    ├─→ Attempt 1
    │     ├─→ getMcpClientConnection (yT6)
    │     ├─→ executeMcpToolCall (F3z)
    │     └─→ If McpSessionLostError:
    │           └─→ Log retry, continue to attempt 2
    │
    ├─→ Attempt 2 (retry)
    │     ├─→ Reconnect client
    │     ├─→ Execute tool
    │     └─→ Success or final error
    │
    └─→ Error handling
          ├─→ McpSessionLostError (max retries) → Re-throw
          ├─→ McpError → Wrap in McpToolExecutionError
          └─→ Generic Error → Wrap in McpToolExecutionError
```

### Progress Tracking

MCP tools emit progress events during execution:

```javascript
// Progress event structure
{
    toolUseID: "toolu_abc123",
    data: {
        type: "mcp_progress",
        status: "started" | "completed" | "failed",
        serverName: "sqlite",
        toolName: "query",
        elapsedTimeMs: 1234  // only for completed/failed
    }
}
```

---

## 6. Elicitation System

### What is Elicitation?

Elicitation allows MCP servers to request user input during tool execution. This enables:
- Authentication flows (OAuth)
- User confirmation dialogs
- Form-based data collection
- URL-based external flows

### Elicitation Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `form` | Structured UI dialog with JSON schema | Data collection, confirmations |
| `url` | External URL for OAuth/external flows | Authentication, external processes |

### Elicitation Priority

Elicitation dialogs have the **lowest priority** in the modal stack (priority 4):

```
Modal Priority (highest → lowest):
1. sandbox-permission
2. tool-permission
3. worker-sandbox-permission
4. elicitation (LOWEST)
```

---

## System Reminder Integration

### Attachment Types Generated by MCP

| Attachment Type | Source | Description |
|-----------------|--------|-------------|
| `mcp_progress` | fetchMcpTools.call | Tool execution progress |
| `mcp_resource` | resources/read | Resource content |
| `elicitation` | elicitation/create | Server input request |
| `elicitation_result` | User response | Elicitation response |

### Integration with 04_system_reminder

```
MCP tool execution
    │
    ├─→ Progress started → mcp_progress attachment
    │
    ├─→ Server requests input → elicitation attachment
    │     └─→ User responds → elicitation_result attachment
    │
    ├─→ Progress updates → mcp_progress attachments
    │
    └─→ Progress completed/failed → final mcp_progress attachment
```

---

## Symbol Validation Summary

| Symbol | Readable | Location | Status |
|--------|----------|----------|--------|
| JE | fetchMcpTools | chunks.170.mjs:533 | ✅ Grep verified |
| Rl | fetchMcpResources | chunks.170.mjs:679 | ✅ Grep verified |
| K_6 | fetchMcpPrompts | chunks.170.mjs:694 | ✅ Grep verified |
| $58 | buildMcpToolName | chunks.170.mjs | ✅ Grep verified |
| yT6 | getMcpClientConnection | chunks.169.mjs:1886 | ✅ Grep verified |
| F3z | executeMcpToolCall | chunks.170.mjs:607 | ✅ Grep verified |
| qn8 | McpSessionLostError | chunks.170.mjs | ✅ Grep verified |
| EV | McpToolExecutionError | chunks.170.mjs | ✅ Grep verified |
| ZP | memoize | chunks.170.mjs | ✅ Grep verified |
| x3z | filterToolByVisibility | chunks.169.mjs:1869 | ✅ Grep verified |