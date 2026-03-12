# SDK MCP Integration

## Overview

MCP (Model Context Protocol) integration in SDK mode enables external MCP servers to be connected dynamically through the SDK control channel. Unlike interactive CLI mode where MCP servers are spawned locally, SDK mode can route MCP messages through the `sendMcpMessage` control channel to remote MCP servers managed by the SDK client.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Transport symbols
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tool execution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - MCP platform

Key functions in this document:
- `SdkMcpTransport` (wCA) - Transport class for SDK-based MCP connections
- `initializeSdkMcpClients` (io4) - Initializes MCP clients from SDK configuration
- `sendMcpMessage` - Method on StdioStreamIO for bidirectional MCP communication
- `rH6` - MCP Client class (from MCP SDK)

---

## SDK MCP Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SDK Client                               │
│  ┌─────────────────┐     ┌──────────────────────────────────┐  │
│  │ SDK Wrapper     │     │ MCP Server Instance              │  │
│  │ (TS/Python)     │     │ (Managed by SDK client)          │  │
│  └────────┬────────┘     └───────────────────┬──────────────┘  │
│           │                                   │                 │
└───────────┼───────────────────────────────────┼─────────────────┘
            │ stdin/stdout (NDJSON)             │
            ▼                                   │
┌───────────────────────────────────────────────┼─────────────────┐
│              Claude Code Binary               │                 │
│  ┌──────────────────────┐                     │                 │
│  │ StdioStreamIO (Mc1)  │                     │                 │
│  │  - sendMcpMessage()  │◄────────────────────┘                 │
│  └──────────┬───────────┘                                       │
│             │                                                   │
│  ┌──────────▼───────────┐                                       │
│  │ SdkMcpTransport (wCA)│                                       │
│  │  - send()            │                                       │
│  │  - onmessage         │                                       │
│  └──────────┬───────────┘                                       │
│             │                                                   │
│  ┌──────────▼───────────┐                                       │
│  │ MCP Client (rH6)     │                                       │
│  │  - connect()         │                                       │
│  │  - listTools()       │                                       │
│  │  - callTool()        │                                       │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Key insight:** Unlike CLI mode where MCP servers run as local child processes, SDK mode routes MCP communication through the control channel. This allows MCP servers to run on the SDK client's machine while the Claude Code binary runs remotely (e.g., in a hosted environment).

---

## SdkMcpTransport (wCA) — Transport for SDK MCP

### Class Definition

**What it does:** Implements a lightweight MCP transport that routes messages through the SDK's `sendMcpMessage` control channel. This transport does not manage processes or sockets — it simply delegates to the SDK client's MCP handling.

**How it works:**
1. Constructor receives `serverName` and `sendMcpMessage` callback
2. `send()` calls the callback to route MCP requests through SDK
3. Response is passed to `onmessage` handler (set by MCP Client)
4. `close()` marks transport as closed and triggers cleanup

```javascript
// ============================================
// SdkMcpTransport - Transport for SDK-based MCP connections
// Location: chunks.144.mjs:1747-1768
// ============================================

// ORIGINAL (for source lookup):
class wCA {
    serverName;
    sendMcpMessage;
    isClosed = !1;
    onclose;
    onerror;
    onmessage;
    constructor(A, q) {
        this.serverName = A;
        this.sendMcpMessage = q
    }
    async start() {}
    async send(A) {
        if (this.isClosed) throw Error("Transport is closed");
        let q = await this.sendMcpMessage(this.serverName, A);
        if (this.onmessage) this.onmessage(q)
    }
    async close() {
        if (this.isClosed) return;
        this.isClosed = !0, this.onclose?.()
    }
}

// READABLE (for understanding):
class SdkMcpTransport {
    serverName;
    sendMcpMessage;
    isClosed = false;
    onclose;
    onerror;
    onmessage;

    constructor(serverName, sendMcpMessageCallback) {
        this.serverName = serverName;
        this.sendMcpMessage = sendMcpMessageCallback;
    }

    // No-op: SDK MCP servers are started externally by the SDK client
    async start() {}

    // Send MCP message through SDK control channel
    async send(message) {
        if (this.isClosed) throw Error("Transport is closed");

        // Delegate to SDK's sendMcpMessage (routes through control channel)
        let response = await this.sendMcpMessage(this.serverName, message);

        // Pass response to MCP Client's message handler
        if (this.onmessage) {
            this.onmessage(response);
        }
    }

    async close() {
        if (this.isClosed) return;
        this.isClosed = true;
        if (this.onclose) this.onclose();
    }
}

// Mapping: wCA→SdkMcpTransport, A→serverName/message, q→sendMcpMessageCallback/response
```

**Why this design:**
- **No process management:** SDK MCP servers are managed by the SDK client, not Claude Code
- **Async request/response:** Each `send()` awaits the SDK client's response before proceeding
- **Event handlers:** MCP Client sets `onmessage` to receive responses, `onclose` for cleanup

---

## sendMcpMessage Method — MCP Control Channel

### Method on StdioStreamIO

**What it does:** Sends an MCP message through the SDK control channel and returns the response. Uses the standard `control_request`/`control_response` protocol with a special `mcp_message` subtype.

```javascript
// ============================================
// sendMcpMessage - Send MCP message through SDK control channel
// Location: chunks.178.mjs:1227-1235
// ============================================

// ORIGINAL (for source lookup):
async sendMcpMessage(A, q) {
    return (await this.sendRequest({
        subtype: "mcp_message",
        server_name: A,
        message: q
    }, u.object({
        mcp_response: u.any()
    }))).mcp_response
}

// READABLE (for understanding):
async sendMcpMessage(serverName, message) {
    let response = await this.sendRequest(
        {
            subtype: "mcp_message",
            server_name: serverName,
            message: message
        },
        zod.object({
            mcp_response: zod.any()
        })
    );
    return response.mcp_response;
}

// Mapping: A→serverName, q→message, u→zod
```

### Control Request Flow for MCP Messages

```
Claude Code Binary                 SDK Client
       │                               │
       │ control_request               │
       │ {                             │
       │   subtype: "mcp_message",     │
       │   server_name: "my_server",   │
       │   message: {                  │
       │     jsonrpc: "2.0",           │
       │     method: "tools/call",     │
       │     params: {...}             │
       │   }                           │
       │ }                             │
       │ ─────────────────────────────►│
       │                               ├── Route to MCP server "my_server"
       │                               ├── Execute MCP method
       │                               │
       │ control_response              │
       │ {                             │
       │   mcp_response: {             │
       │     jsonrpc: "2.0",           │
       │     result: {...}             │
       │   }                           │
       │ }                             │
       │◄───────────────────────────── │
       │                               │
```

---

## initializeSdkMcpClients (io4) — SDK MCP Initialization

### Function Definition

**What it does:** Initializes MCP clients from SDK-provided MCP server configuration. Creates `SdkMcpTransport` instances for each server and connects them through the MCP Client.

**How it works:**
1. Receives MCP server configuration object and `sendMcpMessage` callback
2. For each server in configuration:
   - Creates `SdkMcpTransport` with server name and callback
   - Creates MCP Client instance
   - Connects transport to client
   - Discovers available tools from server
3. Returns array of connected clients and their tools

```javascript
// ============================================
// initializeSdkMcpClients - Initialize MCP clients for SDK mode
// Location: chunks.145.mjs:1769-1832
// ============================================

// ORIGINAL (for source lookup):
async function io4(A, q) {
    let K = [],
        Y = [],
        z = await Promise.allSettled(Object.entries(A).map(async ([w, H]) => {
            let $ = new wCA(w, q),
                O = new rH6({
                    name: "claude-code",
                    version: VERSION
                }, {
                    capabilities: {}
                });
            try {
                await O.connect($);
                let _ = O.getServerCapabilities(),
                    J = {
                        type: "connected",
                        name: w,
                        capabilities: _ || {},
                        client: O,
                        config: { ...H, scope: "dynamic" },
                        cleanup: async () => { await O.close() }
                    },
                    X = [];
                if (_?.tools) {
                    let D = await wI(J);
                    X.push(...D)
                }
                return { client: J, tools: X }
            } catch (_) {
                return Kz(w, `Failed to connect SDK MCP server: ${_}`), {
                    client: { type: "failed", name: w, config: { ...H, scope: "user" } },
                    tools: []
                }
            }
        }));
    for (let w of z)
        if (w.status === "fulfilled") K.push(w.value.client), Y.push(...w.value.tools);
    return { clients: K, tools: Y }
}

// READABLE (for understanding):
async function initializeSdkMcpClients(mcpServerConfig, sendMcpMessageCallback) {
    let clients = [];
    let tools = [];

    // Initialize all MCP servers in parallel
    let results = await Promise.allSettled(
        Object.entries(mcpServerConfig).map(async ([serverName, serverConfig]) => {
            // Create SDK MCP transport
            let transport = new SdkMcpTransport(serverName, sendMcpMessageCallback);

            // Create MCP Client
            let mcpClient = new McpClient({
                name: "claude-code",
                version: VERSION
            }, {
                capabilities: {}
            });

            try {
                // Connect transport to client
                await mcpClient.connect(transport);

                // Get server capabilities
                let capabilities = mcpClient.getServerCapabilities();

                // Build client info object
                let clientInfo = {
                    type: "connected",
                    name: serverName,
                    capabilities: capabilities || {},
                    client: mcpClient,
                    config: { ...serverConfig, scope: "dynamic" },
                    cleanup: async () => { await mcpClient.close(); }
                };

                // Discover tools if server supports them
                let serverTools = [];
                if (capabilities?.tools) {
                    serverTools = await discoverMcpTools(clientInfo);
                }

                return { client: clientInfo, tools: serverTools };
            } catch (error) {
                logError(serverName, `Failed to connect SDK MCP server: ${error}`);
                return {
                    client: {
                        type: "failed",
                        name: serverName,
                        config: { ...serverConfig, scope: "user" }
                    },
                    tools: []
                };
            }
        })
    );

    // Collect successful results
    for (let result of results) {
        if (result.status === "fulfilled") {
            clients.push(result.value.client);
            tools.push(...result.value.tools);
        }
    }

    return { clients, tools };
}

// Mapping: io4→initializeSdkMcpClients, A→mcpServerConfig, q→sendMcpMessageCallback,
//   wCA→SdkMcpTransport, rH6→McpClient, wI→discoverMcpTools, Kz→logError
```

---

## MCP Tool Discovery in SDK Mode

### Tool Discovery Flow

When MCP servers are initialized in SDK mode:

1. **Server capabilities checked:** `getServerCapabilities()` returns what the server supports
2. **Tools discovered:** If `capabilities.tools` is true, call `listTools` MCP method
3. **Tools registered:** Each discovered tool is wrapped and added to available tools

### Tool Naming Convention

MCP tools in SDK mode follow the naming pattern:
```
mcp_<server_name>_<tool_name>
```

For example, a tool named `search` on server `my_server` becomes:
```
mcp_my_server_search
```

### Tool Discovery Output

```javascript
// Tool discovery returns wrapped tools:
{
    name: "mcp_my_server_search",
    description: "Search for items...",
    inputSchema: {
        type: "object",
        properties: {
            query: { type: "string", description: "Search query" }
        },
        required: ["query"]
    },
    // Execution handler routes through MCP
    handler: async (input) => {
        return await mcpClient.callTool({
            name: "search",
            arguments: input
        });
    }
}
```

---

## MCP vs Permission Prompt Tool

### Decision Tree

When a tool requires permission in SDK mode:

```
Tool requires permission
    │
    ├── permissionPromptToolName set?
    │   │
    │   ├── YES: Use MCP permission tool
    │   │   └── Call MCP tool via sendMcpMessage
    │   │       └── handlePermissionPromptToolResult()
    │   │
    │   └── NO: Use standard control_request flow
    │       └── sendRequest({ subtype: "can_use_tool", ... })
    │           └── Wait for control_response
    │
    └── Execute tool based on permission result
```

### Permission Prompt Tool via MCP

When `--permission-prompt-tool <tool-name>` is set, permission requests are routed through an MCP tool:

1. Tool name specified via CLI flag or SDK option
2. Permission request constructed as MCP tool call
3. Tool call sent via MCP channel (uses same `sendMcpMessage`)
4. Response processed via `handlePermissionPromptToolResult`

See [sdk_tools_integration.md](./sdk_tools_integration.md) for detailed permission flow.

---

## MCP Server Configuration Schema

### SDK MCP Server Configuration

```javascript
// Passed in initialize control request
{
    "type": "control_request",
    "request": {
        "subtype": "initialize",
        "sdkMcpServers": {
            "server_name_1": {
                "type": "stdio",           // or "sse", "ws"
                "command": "/path/to/server",
                "args": ["--port", "8080"],
                "env": { "API_KEY": "..." }
            },
            "server_name_2": {
                "type": "sse",
                "url": "https://mcp.example.com/sse"
            }
        }
    }
}
```

### Configuration Processing

The SDK client is responsible for:
1. Starting MCP servers based on configuration
2. Managing server lifecycle
3. Routing MCP messages between Claude Code and servers
4. Handling server failures and reconnection

Claude Code's role is limited to:
1. Sending MCP requests via `sendMcpMessage`
2. Receiving MCP responses
3. Presenting MCP tools to the agent

---

## mcp_status Control Request

### Overview

**What it does:** Queries the status of connected MCP servers. This control request allows the SDK client to check which MCP servers are connected, their capabilities, and their current health status.

**How it works:**
1. SDK client sends `mcp_status` control request
2. Claude Code queries all MCP clients for their status
3. Response includes status of each server and any issues

```javascript
// ============================================
// mcp_status - Query MCP server status
// Location: chunks.179.mjs (control request handler)
// ============================================

// Control request to query MCP status
{
    "type": "control_request",
    "request": {
        "subtype": "mcp_status"
    }
}

// Response
{
    "type": "control_response",
    "response": {
        "subtype": "success",
        "request_id": "<uuid>",
        "response": {
            "servers": [
                {
                    "name": "filesystem",
                    "status": "connected",
                    "capabilities": {
                        "tools": true,
                        "resources": true,
                        "prompts": false
                    },
                    "tool_count": 5,
                    "connected_at": "2024-01-15T10:30:00Z"
                },
                {
                    "name": "github",
                    "status": "failed",
                    "error": "Connection timeout after 30s",
                    "retry_count": 3
                }
            ],
            "total_tools": 8,
            "connected_count": 1,
            "failed_count": 1
        }
    }
}
```

### Server Status Values

| Status | Description |
|--------|-------------|
| `connected` | Server is connected and operational |
| `connecting` | Connection in progress |
| `failed` | Connection failed, see `error` field |
| `disconnected` | Server was connected but is now disconnected |

### Use Cases

1. **Health monitoring:** Periodically check MCP server health
2. **Debugging:** Identify connection issues
3. **Feature detection:** Check which servers support specific capabilities
4. **Capacity planning:** Monitor tool counts across servers

### Example: Monitoring MCP Health

```javascript
// SDK client can poll MCP status
async function monitorMcpHealth(streamIO) {
    let status = await streamIO.sendRequest({ subtype: "mcp_status" });

    for (let server of status.servers) {
        if (server.status === "failed") {
            console.error(`MCP server ${server.name} failed: ${server.error}`);
            // Optionally restart or reconnect
        }
    }

    return status;
}
```

---

## Error Handling for SDK MCP

### Connection Errors

When MCP server connection fails in SDK mode:

```javascript
// Error handling in initializeSdkMcpClients
catch (error) {
    logError(serverName, `Failed to connect SDK MCP server: ${error}`);
    return {
        client: {
            type: "failed",
            name: serverName,
            config: { ...serverConfig, scope: "user" }
        },
        tools: []
    };
}
```

### Transport Closed

When the transport is closed during MCP operation:

```javascript
async send(message) {
    if (this.isClosed) throw Error("Transport is closed");
    // ... send message
}
```

### Message Timeout

MCP messages use the same timeout mechanism as other control requests:

- Default timeout: 60 seconds (controlled by MCP client)
- Timeout triggers `control_cancel_request`
- Request is removed from `pendingRequests`

---

## Comparison: CLI vs SDK MCP

| Aspect | CLI Mode | SDK Mode |
|--------|----------|----------|
| Server Location | Local child process | Remote (managed by SDK client) |
| Transport Type | Stdio transport | SdkMcpTransport (routes through control channel) |
| Process Management | Claude Code spawns/monitors | SDK client manages |
| Configuration Source | `.claude/settings.json`, `--mcp-config` | `sdkMcpServers` in initialize request |
| Tool Discovery | Same (via `listTools`) | Same (via `listTools`) |
| Error Handling | Process exit, restart | Transport error, log, continue |
| Reconnection | Automatic process restart | SDK client handles |

---

## Summary: SDK MCP Message Flow

```
Agent requests MCP tool execution
    │
    ├── Find MCP tool by name (mcp_<server>_<tool>)
    │
    ├── Get MCP client for server
    │
    ├── MCP Client calls transport.send()
    │   └── SdkMcpTransport.sendMcpMessage()
    │       └── StdioStreamIO.sendRequest({ subtype: "mcp_message" })
    │           └── Write control_request to stdout
    │               └── SDK client routes to MCP server
    │                   └── MCP server executes tool
    │                       └── Response flows back
    │
    └── Tool result returned to agent
```

This architecture enables fully remote MCP server management, which is essential for hosted/remote SDK scenarios where Claude Code runs in a different environment than the MCP servers.