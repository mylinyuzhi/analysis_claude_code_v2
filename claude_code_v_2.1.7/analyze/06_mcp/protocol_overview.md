# MCP (Model Context Protocol) Implementation - v2.1.7

## Overview

Claude Code v2.1.7 implements the **Model Context Protocol (MCP)** to integrate with external servers that provide tools, prompts, and resources. The MCP implementation supports multiple transport protocols and includes advanced features like auto-search mode for context optimization.

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Transport Types](#transport-types)
3. [Key Changes in v2.1.7](#key-changes-in-v217)
4. [Related Documents](#related-documents)

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        MCP Implementation Architecture                      │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐   │
│  │   Config Layer   │    │  Connection Layer │    │  Execution Layer    │   │
│  ├─────────────────┤    ├──────────────────┤    ├─────────────────────┤   │
│  │ cEA             │───▶│ SO               │───▶│ zr2                 │   │
│  │ loadAllMcpConfig│    │ connectMcpServer │    │ executeMcpTool      │   │
│  │                 │    │                  │    │                     │   │
│  │ efA             │    │ EL0              │    │ tB7                 │   │
│  │ parseConfigObj  │    │ batchInitServers │    │ processToolResult   │   │
│  └─────────────────┘    └──────────────────┘    └─────────────────────┘   │
│           │                      │                        │               │
│           ▼                      ▼                        ▼               │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                       Discovery Layer                                │  │
│  ├─────────────────────────────────────────────────────────────────────┤  │
│  │  Ax (fetchTools)  │  ZhA (fetchPrompts)  │  GhA (fetchResources)    │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│           │                      │                        │               │
│           ▼                      ▼                        ▼               │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    Notification Handlers                             │  │
│  ├─────────────────────────────────────────────────────────────────────┤  │
│  │  jY0 (tools/list_changed)  │  _Y0 (prompts)  │  NY0 (resources)     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    Auto-Search Mode (Default)                        │  │
│  ├─────────────────────────────────────────────────────────────────────┤  │
│  │  RZ0 (shouldEnableToolSearch)  │  Db (MCPSearch tool)               │  │
│  │  10% context threshold         │  Dynamic tool discovery             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Core Components

| Component | File Location | Purpose |
|-----------|---------------|---------|
| **Config Layer** | chunks.131.mjs | Load and parse MCP configurations |
| **Connection Layer** | chunks.131.mjs | Establish transport connections |
| **Discovery Layer** | chunks.131.mjs | Fetch tools/prompts/resources |
| **Execution Layer** | chunks.131.mjs | Execute tool calls |
| **Notification Layer** | chunks.138.mjs | Handle list_changed events |
| **Auto-Search** | chunks.85.mjs | MCPSearch mode decision logic |

---

## Transport Types

Claude Code supports multiple transport protocols for MCP servers:

| Transport | Config Type | Use Case | Connection Class |
|-----------|-------------|----------|------------------|
| **stdio** | `type: "stdio"` | Local command-line servers | `KX0` (StdioClientTransport) |
| **sse** | `type: "sse"` | Remote servers (Server-Sent Events) | `rG1` (SSEClientTransport) |
| **http** | `type: "http"` | HTTP polling servers | `kX0` (HttpClientTransport) |
| **ws** | `type: "ws"` | WebSocket servers | `JZ1` (WebSocketClientTransport) |
| **sse-ide** | `type: "sse-ide"` | IDE-specific SSE | `rG1` |
| **ws-ide** | `type: "ws-ide"` | IDE-specific WebSocket | `JZ1` |
| **sdk** | `type: "sdk"` | SDK-based servers | `VL0` |

### Transport Selection Flow

```javascript
// ============================================
// SO - Transport selection in server connection
// Location: chunks.131.mjs:1563-1700
// ============================================

// READABLE (for understanding):
async function connectMcpServer(serverName, serverConfig, diagnostics) {
  let transport;

  switch (serverConfig.type) {
    case "sse":
      // SSE with auth provider support
      transport = new SSEClientTransport(new URL(serverConfig.url), {
        authProvider: new McpAuthProvider(serverName, serverConfig),
        fetch: createFetchWithProxy(),
        requestInit: { headers: { "User-Agent": getUserAgent() } }
      });
      break;

    case "http":
      // HTTP polling transport
      transport = new HttpClientTransport(new URL(serverConfig.url), {
        authProvider: new McpAuthProvider(serverName, serverConfig),
        requestInit: { headers: { "User-Agent": getUserAgent() } }
      });
      break;

    case "ws":
    case "ws-ide":
      // WebSocket transport
      const ws = new WebSocket(serverConfig.url, ["mcp"], {
        headers: { "User-Agent": getUserAgent() }
      });
      transport = new WebSocketClientTransport(ws);
      break;

    case "stdio":
    default:
      // Standard I/O for local processes
      transport = new StdioClientTransport({
        command: serverConfig.command,
        args: serverConfig.args,
        env: { ...process.env, ...serverConfig.env },
        stderr: "pipe"
      });
      break;
  }

  // Create MCP Client and connect
  const client = new MCPClient({ name: "claude-code", version: "2.1.7" });
  await Promise.race([
    client.connect(transport),
    createTimeoutPromise(60000)  // 60s connection timeout
  ]);

  return { type: "connected", name: serverName, client, capabilities: client.getServerCapabilities() };
}

// Mapping: SO→connectMcpServer, KX0→StdioClientTransport, rG1→SSEClientTransport
// kX0→HttpClientTransport, JZ1→WebSocketClientTransport, PG1→MCPClient
```

---

## Key Changes in v2.1.7

### 1. Auto-Search Mode is Now Default

MCP tool search mode (`tst-auto`) is now the default behavior. When MCP tool descriptions exceed **10% of the context window**, tools are loaded dynamically via MCPSearch instead of being included in the system prompt.

See: [mcp_autosearch.md](./mcp_autosearch.md)

### 2. Connection Timeout

Default connection timeout is **60 seconds** (Fr2 = 60000ms).

### 3. Tool Timeout

Default tool execution timeout is **100 million milliseconds** (~27 hours), effectively unlimited.

```javascript
// Location: chunks.148.mjs:3509
function getMCPToolTimeout() {
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || 100000000
}
```

### 4. list_changed Notification Handling

Full support for dynamic tool/prompt/resource list changes from MCP servers.

See: [mcp_autosearch.md](./mcp_autosearch.md#list_changed-notification-handling-210)

---

## Related Documents

| Document | Description |
|----------|-------------|
| [protocol_overview.md](./protocol_overview.md) | This document - architecture overview |
| [mcp_autosearch.md](./mcp_autosearch.md) | Auto-search mode and MCPSearch tool |
| [server_management.md](./server_management.md) | Server configuration and connection |
| [tool_execution.md](./tool_execution.md) | Tool calling and result processing |
| [system_integration.md](./system_integration.md) | Integration with tools, system reminders, plan mode |
| [plugin_integration.md](./plugin_integration.md) | Plugin MCP servers, MCPB bundles, variable substitution |

---

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `MCP_TOOL_TIMEOUT` | 100,000,000 ms | Individual tool call timeout |
| `MCP_TIMEOUT` | 30,000 ms | Connection timeout (legacy) |
| `MCP_SERVER_CONNECTION_BATCH_SIZE` | 3 | Concurrent connections during batch |
| `ENABLE_TOOL_SEARCH` | `auto` | Force tool search mode |
| `ENABLE_MCP_CLI_ENDPOINT` | - | Enable MCP CLI mode |
| `ENABLE_MCP_LARGE_OUTPUT_FILES` | - | Save large outputs to files |

---

## Quick Reference

### Tool Naming Convention

MCP tools are renamed to avoid conflicts:

```
mcp__${serverName}__${toolName}

Examples:
- mcp__filesystem__read_file
- mcp__github__create_issue
- mcp__claude-in-chrome__tabs_context_mcp
```

### Reserved Server Names

- `claude-in-chrome` - Reserved for Chrome browser automation
- `ide` - Reserved for IDE integration

### Connection States

| State | Description |
|-------|-------------|
| `connected` | Successfully connected and ready |
| `pending` | Connection in progress |
| `failed` | Connection failed |
| `disabled` | Server disabled by user |
| `needs-auth` | OAuth authentication required |
| `proxy` | Proxy server (claudeai) |
