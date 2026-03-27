# MCP Cross-Module Integration - Complete Documentation

> **Version**: Claude Code v2.1.76
> **Last Updated**: 2026-03-27
> **Status**: ✅ Complete integration documentation with source-level restoration

---

## Overview

This document provides comprehensive documentation of all cross-module integration points between the MCP (Model Context Protocol) system (06) and other modules in Claude Code, including System Reminder (04), Tools (05), Hooks (11), and Remote Sessions (33).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)

Key functions in this document:
- `fetchMcpTools` (JE) - Tool discovery - chunks.170.mjs:533
- `callMcpTool` (pC) - Tool execution - chunks.169.mjs:1910
- `executeMcpToolCall` (F3z) - Low-level execution - chunks.170.mjs:607
- `getMcpClientConnection` (yT6) - Connection management - chunks.169.mjs:1886
- `setupElicitationRequestHandler` (WT7) - Elicitation handler - chunks.58.mjs:3

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MCP INTEGRATION ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        MCP CORE (06)                                   │  │
│  │                                                                        │  │
│  │   Server Connections          Tool Discovery          Execution        │  │
│  │   ├─ StdioClientTransport     ├─ fetchMcpTools (JE)   ├─ callMcpTool  │  │
│  │   ├─ SSEClientTransport       ├─ tools/list           ├─ F3z          │  │
│  │   └─ HTTPClientTransport      └─ Tool registration    └─ Retry logic  │  │
│  │                                                                        │  │
│  └───────────────────────────────┬───────────────────────────────────────┘  │
│                                  │                                          │
│     ┌────────────────────────────┼────────────────────────────┐             │
│     │                            │                            │             │
│     ▼                            ▼                            ▼             │
│ ┌───────────┐            ┌───────────────┐            ┌───────────┐        │
│ │  SYSTEM   │            │    TOOLS      │            │   HOOKS   │        │
│ │ REMINDER  │◄───────────│    (05)       │───────────►│   (11)    │        │
│ │   (04)    │            │               │            │           │        │
│ └───────────┘            └───────────────┘            └───────────┘        │
│        │                                                                     │
│        │                     ┌───────────────┐                              │
│        └────────────────────►│    REMOTE     │                              │
│                              │   SESSIONS    │                              │
│                              │    (33)       │                              │
│                              └───────────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. MCP ↔ System Reminder (04)

### Integration Points

**MCP generates the following attachment types:**

| Attachment Type | When Generated | Purpose |
|-----------------|----------------|---------|
| `mcp_resource` | Resource content | MCP resource data |
| `elicitation` | Server requests user input | Elicitation dialog trigger |
| `elicitation_result` | User responds to elicitation | Response to server |
| `mcp_tool_result` | MCP tool execution result | Tool output |
| `mcp_progress` | During MCP tool execution | Progress updates |

### Elicitation System

**What it does:** Elicitation allows MCP servers to request user input during tool execution. This enables:
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

Elicitation dialogs have the **lowest priority** in the modal stack (priority 4), meaning they will only appear when no other modal (sandbox permission, tool permission, worker sandbox) is pending.

### Source Code: Elicitation Handler

```javascript
// ============================================
// setupElicitationRequestHandler - Handle MCP elicitation requests
// Location: chunks.58.mjs:3-85
// ============================================

// ORIGINAL (for source lookup):
async function WT7(A, q, K) {
    let Y = q.setRequestHandler(yp, async (z) => {
        let _ = z.params;
        if (sx6("Elicitation", {
                mcpServerName: A,
                elicitationParams: _
            })) {
            let O = await tx6("ElicitationResult", {
                mcpServerName: A,
                elicitationParams: _
            });
            return O ?? {
                action: "cancel"
            }
        }
        let w = KK6();
        if (!w) return {
            action: "cancel"
        };
        let O = jb3(_);
        n1(A, `Elicitation request received, mode=${O}`);
        let $ = jB3(K.queue, A, _.id);
        if ($ !== -1) {
            let J = K.queue[$];
            return J.response ?? {
                action: "cancel"
            }
        }
        let H = {
            serverName: A,
            requestId: _.id,
            params: _,
            mode: O,
            response: void 0,
            resolve: void 0,
            reject: void 0
        };
        K.queue.push(H);
        let j = new Promise((J, M) => {
            H.resolve = J, H.reject = M
        });
        return await j
    })
}

// READABLE (for understanding):
async function setupElicitationRequestHandler(serverName, client, elicitationState) {
    // Register handler for elicitation/create requests
    client.setRequestHandler(ElicitationCreateSchema, async (request) => {
        const params = request.params;

        // Run Elicitation hook if configured
        if (runElicitationHook("Elicitation", {
            mcpServerName: serverName,
            elicitationParams: params
        })) {
            // Hook provided a response
            const hookResult = await runElicitationResultHook("ElicitationResult", {
                mcpServerName: serverName,
                elicitationParams: params
            });
            return hookResult ?? { action: "cancel" };
        }

        // Check if elicitation is enabled
        const isEnabled = isElicitationEnabled();
        if (!isEnabled) {
            return { action: "cancel" };
        }

        // Detect elicitation mode
        const mode = detectElicitationMode(params);
        logInfo(serverName, `Elicitation request received, mode=${mode}`);

        // Check for duplicate request (already in queue)
        const existingIndex = findElicitationQueueIndex(
            elicitationState.queue, serverName, params.id
        );
        if (existingIndex !== -1) {
            const existing = elicitationState.queue[existingIndex];
            return existing.response ?? { action: "cancel" };
        }

        // Create queue entry
        const queueEntry = {
            serverName,
            requestId: params.id,
            params,
            mode,
            response: undefined,
            resolve: undefined,
            reject: undefined
        };

        // Add to queue for UI processing
        elicitationState.queue.push(queueEntry);

        // Create promise that will be resolved when user responds
        const responsePromise = new Promise((resolve, reject) => {
            queueEntry.resolve = resolve;
            queueEntry.reject = reject;
        });

        // Wait for user response
        return await responsePromise;
    });
}

// Mapping: WT7→setupElicitationRequestHandler, A→serverName, q→client,
//          K→elicitationState, yp→ElicitationCreateSchema, sx6→runElicitationHook,
//          tx6→runElicitationResultHook, KK6→isElicitationEnabled, jb3→detectElicitationMode
```

---

## 2. MCP ↔ Tools (05)

### Integration Points

| Integration Point | Description | Key Function |
|-------------------|-------------|--------------|
| Tool Discovery | MCP tools discovered via `tools/list` | `JE` (fetchMcpTools) |
| Tool Registration | Tools registered with `mcp__` prefix | Tool registry |
| Tool Execution | Execution via standard pipeline | `pC` (callMcpTool) |
| Permission Checks | MCP tools go through permissions | `canUseTool` |
| Session Recovery | Retry on connection loss | `qn8` (McpSessionLostError) |

### Tool Discovery Algorithm

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
                    // Tool execution with retry logic
                    for (let P = 0;; P++) try {
                        let f = await yT6(A),
                            v = await F3z({...});
                        return { data: v.content, ... };
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
                                signal: extras?.signal,
                                requestPrompt: sessionContext?.requestPrompt,
                                toolCallId
                            });

                            return {
                                data: result.content,
                                structuredContent: result.structuredContent,
                                rawData: result.rawData
                            };

                        } catch (error) {
                            // Retry on session loss
                            if (error instanceof McpSessionLostError &&
                                attempt < maxRetries) {
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
//          Ws→ensureArray, x3z→filterToolByVisibility, tZq→baseToolProperties
```

### Tool Annotation Mapping

| MCP Annotation | Tool Method | Purpose |
|----------------|-------------|---------|
| `readOnlyHint` | `isReadOnly()` | Tool doesn't modify state |
| `readOnlyHint` | `isConcurrencySafe()` | Safe for concurrent execution |
| `destructiveHint` | `isDestructive()` | May cause irreversible changes |
| `openWorldHint` | `isOpenWorld()` | Interacts with external systems |

---

## 3. MCP ↔ Hooks (11)

### Integration Points

| Hook Type | When Called | Purpose |
|-----------|-------------|---------|
| `Elicitation` | Before showing elicitation dialog | Intercept/modify elicitation requests |
| `ElicitationResult` | After user responds | Post-process elicitation responses |

### Hook Flow

```
MCP server sends elicitation/create
    │
    ├─→ Elicitation hook fires
    │     ├─→ Hook provides response → Skip user dialog
    │     └─→ No hook response → Show dialog to user
    │
    ├─→ User responds (if dialog shown)
    │
    └─→ ElicitationResult hook fires
          └─→ Response sent back to MCP server
```

---

## 4. MCP ↔ Remote Sessions (33)

### Integration Points

| Integration Point | Description |
|-------------------|-------------|
| McpHub | Unix socket IPC server for browser connections |
| Chrome Extension | MCP tools callable from browser |
| Session State | Persistence for reconnection |

### McpHub Architecture

```javascript
// McpHub (JVq) - Unix socket IPC server
// Location: chunks.178.mjs:235

// Key features:
// - Listens on Unix socket for browser connections
// - Bridges Chrome extension to CLI session
// - Manages session state persistence
// - Handles MCP tool invocation from browser
```

---

## 5. MCP ↔ UI (02)

### UI Components

| Component | Purpose |
|-----------|---------|
| `McpServerStatusList` | Server connection status display |
| `McpServerItem` | Individual server status |
| `ElicitationDialog` | Elicitation form/URL dialog |
| `FormElicitationDialog` | Form mode dialog |
| `UrlElicitationDialog` | URL mode dialog |

### Modal Priority

```
Modal Priority (highest → lowest):
1. sandbox-permission
2. tool-permission
3. worker-sandbox-permission
4. elicitation (LOWEST) - MCP elicitation dialogs
```

### Server Status Display

```javascript
// Server status values
const SERVER_STATUS = {
    connected: "connected",
    needsAuth: "needs-auth",
    disconnected: "disconnected"
};

// UI rendering
function renderMcpServerStatus(server) {
    const statusColor = server.status === "connected" ? "green" :
                        server.status === "needs-auth" ? "yellow" : "red";

    return (
        <Box>
            <ConnectionIndicator color={statusColor} />
            <Text>{server.name}</Text>
            <Text dimColor>({server.toolCount} tools)</Text>
        </Box>
    );
}
```

---

## Key Constants

### MCP Method Names

| Method | Purpose |
|--------|---------|
| `tools/list` | Discover available tools |
| `tools/call` | Execute a tool |
| `resources/list` | List available resources |
| `resources/read` | Read resource content |
| `prompts/list` | List available prompts |
| `elicitation/create` | Request user input |

### Tool Annotations

| Annotation | Meaning |
|------------|---------|
| `readOnlyHint` | Tool doesn't modify state |
| `destructiveHint` | Tool may cause irreversible changes |
| `openWorldHint` | Tool interacts with external systems |

### Environment Variables

```javascript
MCP_TIMEOUT_MS = 1800000  // 30 minute timeout (CYz)
CLAUDE_CODE_MCP_SESSION_FILE  // Custom session file path
CLAUDE_AGENT_SDK_MCP_NO_PREFIX  // Disable tool name prefixing
```

---

## Session State Persistence

MCP session state is persisted to enable reconnection:

```javascript
// Session file: ~/.claude/mcp-session.json
{
    servers: [
        {
            name: "sqlite",
            status: "connected",
            tools: ["query", "list-tables"],
            resources: ["/db/schema"]
        }
    ]
}
```

---

## Summary

The MCP module provides extensible tool discovery and execution through the Model Context Protocol. Key integrations include:

1. **System Reminder (04)** - Elicitation attachments, resource content
2. **Tools (05)** - Tool discovery, execution, session recovery
3. **Hooks (11)** - Elicitation interception
4. **Remote Sessions (33)** - Browser integration via McpHub
5. **UI (02)** - Server status, elicitation dialogs

The system uses memoized tool discovery, automatic session recovery, and annotation-based permission hints to provide a robust external tool integration layer.