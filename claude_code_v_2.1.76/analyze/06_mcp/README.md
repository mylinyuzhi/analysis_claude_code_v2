# Module: Model Context Protocol (MCP) (06)

## Overview

The MCP module implements the Model Context Protocol, enabling Claude Code to connect to external MCP servers and dynamically discover and execute their tools, resources, and prompts. It uses a "Meta-Tooling" architecture that provides access to thousands of potential tools without exceeding context limits.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (MCP Protocol section)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this module:
- `fetchMcpTools` (JE) - Discover tools from MCP server - chunks.170.mjs:533
- `callMcpTool` (pC) - Execute MCP tool - chunks.169.mjs:1910
- `parseMcpCliCommand` (ce) - Parse mcp-cli syntax - chunks.174.mjs:2627
- `McpHub` (JVq) - Unix socket IPC server - chunks.178.mjs:235

---

## Architecture

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
│  ④ Resources & Prompts                                               │
│     ├─ resources/list → Resource discovery                          │
│     ├─ resources/read → Resource content fetching                   │
│     └─ prompts/list → Slash command-like prompts                    │
│                                                                       │
│  ⑤ Elicitation (Server → User Input)                               │
│     ├─ Form mode - Structured UI dialog                             │
│     ├─ URL mode - OAuth/external flow                               │
│     └─ Queue-based processing                                        │
│                                                                       │
│  ⑥ McpHub (Browser Integration)                                     │
│     ├─ Unix socket IPC server                                        │
│     ├─ Chrome extension connections                                  │
│     └─ Session state persistence                                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### Transport Layer

| Transport | Use Case | Location |
|-----------|----------|----------|
| StdioClientTransport (SO8) | Local MCP servers via stdin/stdout | chunks.57.mjs:1098 |
| SSEClientTransport | HTTP Server-Sent Events | chunks.57.mjs:2492 |
| StreamableHTTPClientTransport | HTTP with streaming support | chunks.80.mjs:650 |

### Tool Management

| Component | Description |
|-----------|-------------|
| `fetchMcpTools` (JE) | Discovers tools via tools/list JSON-RPC |
| `callMcpTool` (pC) | Executes tools via tools/call JSON-RPC |
| `executeMcpToolCall` (F3z) | Low-level tool execution with retry |

### Command Interception

The `mcp-cli` command is intercepted in the Bash tool:

```
User: mcp-cli call sqlite/query '{"sql": "SELECT * FROM users"}'
  │
  ├─→ Bash tool receives command
  ├─→ parseMcpCliCommand (ce) detects mcp-cli
  ├─→ Routes to callMcpTool instead of shell
  └─→ Returns formatted JSON result
```

---

## Analysis Documents

### Core Implementation

| Document | Description |
|----------|-------------|
| [mcp_complete_source_restoration_v3.md](mcp_complete_source_restoration_v3.md) | **v3** - Complete source restoration with tool discovery |
| [mcp_source_restoration_final.md](mcp_source_restoration_final.md) | **FINAL** - Complete source restoration with all algorithms |
| [mcp_complete_source_restoration_v2.md](mcp_complete_source_restoration_v2.md) | **v2** - Complete source restoration with ORIGINAL/READABLE code |
| [mcp_tool_execution_source_restoration.md](mcp_tool_execution_source_restoration.md) | **NEW** - Complete source restoration with ORIGINAL/READABLE code |
| [mcp_tool_execution_complete.md](mcp_tool_execution_complete.md) | **NEW** - Complete tool execution with elicitation and retry logic |
| [implementation.md](implementation.md) | Core MCP implementation and mcp-cli interception |
| [transport_layer_complete.md](transport_layer_complete.md) | Complete transport implementation details |
| [tool_discovery_complete.md](tool_discovery_complete.md) | Tool discovery, prefixing, annotation extraction |
| [mcp_hub.md](mcp_hub.md) | Unix socket IPC server for browser connections |
| [mcp_resources.md](mcp_resources.md) | Resource management and subscriptions |
| [symbol_validation.md](symbol_validation.md) | Symbol mapping verification |

### Integration

| Document | Description |
|----------|-------------|
| [mcp_connection_lifecycle_complete.md](mcp_connection_lifecycle_complete.md) | **NEW** - Connection, reconnection, tool discovery lifecycle |
| [cross_module_integration.md](cross_module_integration.md) | Integration with tools, reminders, UI |
| [ui_linkage.md](ui_linkage.md) | React state integration and modal priority |
| [elicitation_handler.md](elicitation_handler.md) | MCP server → user input requests |
| [elicitation_complete.md](elicitation_complete.md) | Complete elicitation analysis with form/URL modes |
| [elicitation_ui_complete.md](elicitation_ui_complete.md) | Elicitation UI components and form rendering |
| [binary_content_handling.md](binary_content_handling.md) | PDF/audio/image handling in MCP responses |
| [mcp_reminder_integration.md](mcp_reminder_integration.md) | **NEW** - System reminder integration |

### Cross-Module Integration

| Document | Description |
|----------|-------------|
| [cross_module_integration_complete.md](cross_module_integration_complete.md) | **COMPLETE** - Full cross-module integration with source restoration |
| [../00_overview/cross_module_integration_complete_v3.md](../00_overview/cross_module_integration_complete_v3.md) | Complete cross-module integration for all 4 modules |
| [../00_overview/ui_interaction_complete_v2.md](../00_overview/ui_interaction_complete_v2.md) | UI components for Tools, MCP, Plan Mode, Task System |

---

## Key Algorithms

### MCP Tool Discovery Algorithm

```
MCP server connects
  │
  ├─→ Check capabilities.tools
  │
  ├─→ Send tools/list request
  │
  ├─→ For each tool in response:
  │     ├─→ Build prefixed name: mcp__<server>__<tool>
  │     ├─→ Extract annotations (readOnly, destructive, openWorld)
  │     └─→ Create tool object with call() method
  │
  └─→ Register tools in session tool set
```

### Elicitation Priority Algorithm

Elicitation dialogs have lowest priority in modal stack:

```javascript
// Modal priority (highest → lowest)
if (sandboxPermissionQueue[0]) modal = "sandbox-permission";
else if (pendingToolRequest[0]) modal = "tool-permission";
else if (workerSandboxQueue[0]) modal = "worker-sandbox-permission";
else if (elicitation.queue[0]) modal = "elicitation";  // Lowest priority
```

### Tool Name Parsing

```javascript
// mcp-cli call server/tool → { server, tool, args }
function parseMcpCliCommand(command) {
  const match = command.match(/^mcp-cli\s+(call|read)\s+([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)(?:\s+([\s\S]+))?$/);
  if (!match) return null;
  return {
    command: match[1],     // "call" or "read"
    server: match[2],      // server name
    tool: match[3],        // tool name
    args: match[4] || ""   // JSON arguments
  };
}
```

---

## Cross-Module Integration

### MCP ↔ Tools (05)

- MCP tools are registered in the tool registry with `mcp__` prefix
- Tool execution routes through standard pipeline (fxY)
- Permission checks apply to MCP tools

### MCP ↔ System Reminder (04)

- MCP resources can generate attachments
- Tool discovery status in session state
- Elicitation as special attachment type

### MCP ↔ UI (02)

- MCP state slice in REPL component
- Elicitation dialog rendering
- Modal priority management

---

## Elicitation System

### Form Mode

Server requests structured input via JSON schema:

```javascript
{
  method: "elicitation/create",
  params: {
    message: "Please provide database credentials",
    requestedSchema: {
      type: "object",
      properties: {
        host: { type: "string" },
        port: { type: "number" }
      }
    }
  }
}
```

### URL Mode

Server provides URL for OAuth flow:

```javascript
{
  method: "elicitation/create",
  params: {
    message: "Please authenticate",
    uris: ["https://auth.example.com/oauth?state=xyz"]
  }
}
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

## Quick Reference

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

### Key Constants

```javascript
MCP_TIMEOUT_MS = 1800000  // 30 minute timeout (CYz)
```

---

## Configuration

### MCP Server Configuration

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "mcp-server-sqlite",
      "args": ["--db-path", "/data/mydb.db"]
    }
  }
}
```

### Environment Variables

- `CLAUDE_CODE_MCP_SESSION_FILE` - Custom session file path
- `CLAUDE_AGENT_SDK_MCP_NO_PREFIX` - Disable tool name prefixing

---

## Version History

| Version | Changes |
|---------|---------|
| 2.1.76 | Binary content handling (PDFs, audio saved to disk) |
| 2.1.72 | Elicitation system (form/URL modes) |
| 2.1.32 | McpHub for browser connections |
| 2.1.27 | SSE transport support |

---

## Symbol Validation Status

**Last validated:** 2026-03-27

All symbols in this module have been cross-validated against source code.

### Validation Reports
- [symbol_validation_report.md](symbol_validation_report.md) - Complete symbol validation
- [mcp_complete_source_restoration.md](mcp_complete_source_restoration.md) - Full source restoration with algorithms

### Key Validated Symbols

| Symbol | Validated Location | Status |
|--------|-------------------|--------|
| JE (fetchMcpTools) | chunks.170.mjs:533 | ✅ Correct |
| pC (callMcpTool) | chunks.169.mjs:1910 | ✅ Correct |
| JVq (McpHub) | chunks.178.mjs:235 | ✅ Correct |
| F3z (executeMcpToolCall) | chunks.170.mjs:607 | ✅ Correct |
| yT6 (getMcpClientConnection) | chunks.169.mjs:1886 | ✅ Correct |
| qn8 (McpSessionLostError) | chunks.170.mjs | ✅ Correct |
| EV (McpToolExecutionError) | chunks.170.mjs | ✅ Correct |
| WT7 (setupElicitationRequestHandler) | chunks.58.mjs:3 | ✅ Correct |
| ZP (memoize) | chunks.170.mjs | ✅ Correct |
| $58 (buildMcpToolName) | chunks.170.mjs | ✅ Correct |

---

## Cross-Module Integration

### MCP ↔ Tools (05)

MCP tools are registered in the tool registry with `mcp__` prefix:
- Tool discovery via `fetchMcpTools` (JE) → `tools/list` JSON-RPC
- Tool execution routes through standard pipeline (fxY)
- Permission checks apply to MCP tools
- MCP tool annotations map to tool methods:
  - `readOnlyHint` → `isReadOnly()`
  - `destructiveHint` → `isDestructive()`
  - `openWorldHint` → `isOpenWorld()`
- Progress tracking via `mcp_progress` events
- Session recovery retry for `McpSessionLostError`

### MCP ↔ System Reminder (04)

MCP resources can generate attachments:
- `mcp_resource` - MCP resource content
- `elicitation` - Elicitation request from server
- `elicitation_result` - Elicitation response
- Tool discovery status in session state
- Binary content (PDFs, images) saved to disk and referenced

### MCP ↔ UI (02)

MCP state slice in REPL component:
- MCP server connection status display
- Elicitation dialog rendering (form/URL modes)
- Modal priority management: `elicitation` is priority 4 (lowest)
- Server connection status: `connected` | `needs-auth` | `disconnected`
- Progress indicator for MCP tool execution

### MCP ↔ Remote Sessions (33)

McpHub bridges browser connections to CLI session:
- Unix socket IPC for secure message passing
- Chrome extension can invoke MCP tools through bridge
- Session state persistence for reconnection

### MCP ↔ Hooks (11)

Elicitation hooks can intercept server requests:
- `Elicitation` hook - Pre-process elicitation requests
- `ElicitationResult` hook - Post-process responses
- Hook can auto-respond to known elicitation patterns