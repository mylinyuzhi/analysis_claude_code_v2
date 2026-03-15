# MCP (Model Context Protocol) Implementation

## 1. Overview

The **Model Context Protocol (MCP)** implementation in Claude Code v2.1.76 acts as a bridge between the LLM and external tools/resources. It employs a **Meta-Tooling Architecture** where the model interacts with MCP servers via a virtual CLI command (`mcp-cli`) rather than native tool bindings for every single tool. This allows scaling to hundreds of tools without consuming excessive context window space.

### Key Components
-   **Meta-Tool (`mcp-cli`)**: A virtual command-line interface intercepted by the system.
-   **Client (`McpClient` / `rH6`)**: Manages JSON-RPC connections to servers.
-   **Transports**: Supports `StdioClientTransport` (`SJA`) and remote/HTTP transports.
-   **State Management**: Persists connection state and tool definitions to `~/.claude/claude-code-mcp-cli/`.

### v2.1.76 Changes
- **`oauth.authServerMetadataUrl` config option**: A new field in MCP server configuration that specifies an OAuth authorization server metadata URL (RFC 8414). When set, the MCP client uses this URL to discover OAuth endpoints (authorization, token, revocation) rather than relying on server-advertised discovery. Useful for organizations with centralized OAuth infrastructure.
- **Binary content saved to disk**: MCP responses containing binary content (PDFs, audio files) are now saved to temporary disk files rather than embedded inline as base64. The model receives a file path reference instead, preventing large binary payloads from consuming context window space.

## 2. Meta-Tool Architecture

Instead of registering every MCP tool as a native Anthropic API tool, Claude Code registers a single "Meta-Tool" or simply instructs the model to use the `mcp-cli` command.

### Execution Flow
1.  **Model Output**: The model generates a `Bash` tool call executing `mcp-cli call <server>/<tool> <args>`.
2.  **Interception**: The `Bash` tool executor (or a pre-execution hook) detects the `mcp-cli` command.
3.  **Parsing (`A11`)**: The command is parsed using a `Commander.js` instance (`mcpCliProgram`).
4.  **Execution (`yHz`)**:
    -   Resolves the server and tool name (`mFA`).
    -   Connects to the server if not already connected.
    -   Sends a `tools/call` JSON-RPC request.
5.  **Output**: The result is formatted as JSON (or text) and returned as "stdout" to the model. Binary blobs are written to disk with path references returned.

## 3. Client Implementation (`chunks.79.mjs`)

The core client logic resides in `chunks.79.mjs`.

### `McpClient` (`rH6`)
Extends a base client class (`Hb1`) and implements:
-   `connect()`: Handshakes with the server (`initialize`).
-   `callTool()`: Sends `tools/call`.
-   `readResource()`: Sends `resources/read`.
-   `listTools()` / `listResources()`: Discovery methods.

### Transports
-   **`StdioClientTransport` (`SJA`)**:
    -   Spawns a child process.
    -   Pipes `stdin` and `stdout`.
    -   Redirects `stderr` to a separate stream for logging.
    -   Handles process lifecycle (kill on close).

## 4. CLI Interface (`chunks.175.mjs`)

The `mcp-cli` logic is defined in `chunks.175.mjs` using `Commander.js`.

### Subcommands
-   `servers`: List connected servers.
-   `tools`: List available tools (optionally filtered by server).
-   `info <tool>`: Get tool schema/description.
-   `call <tool> <args>`: Execute a tool.
-   `read <resource>`: Read a resource URI.
-   `grep <pattern>`: Search tools by name/description.

### Remote Execution (`zY1`)
If the environment detects it is running in a remote context (e.g., via `RE()` check), it delegates the execution to a remote endpoint (`POST /mcp`) using `zY1` (`callRemoteMcpEndpoint`).

## 5. Configuration & State

-   **Session State**: Stored in `~/.claude/claude-code-mcp-cli/<sessionId>.json`. Contains active server configs and cached tool definitions.
-   **Config Discovery**: Looks for `.mcp.json` or project-specific settings to auto-connect servers on startup.

### oauth.authServerMetadataUrl (v2.1.76)

**What it does:** A new configuration field on MCP server entries that overrides the OAuth authorization server metadata discovery URL.

**How it works:**
1. When connecting to an HTTP/SSE MCP server, the client checks for `oauth.authServerMetadataUrl` in the server config.
2. If set, the client fetches the RFC 8414 metadata document from that URL instead of the server's well-known discovery endpoint.
3. The metadata document provides `authorization_endpoint`, `token_endpoint`, and other OAuth URLs.
4. The client uses these endpoints for the OAuth flow (requesting tokens, refreshing, revoking).

**Why this approach:**
- Enterprises often run a centralized identity provider (IdP) separate from the MCP server's own domain.
- The MCP server may not have a `/.well-known/oauth-authorization-server` endpoint pointing at the correct IdP.
- Explicitly configuring `authServerMetadataUrl` bypasses discovery and routes directly to the correct IdP.
- Avoids requiring the MCP server administrator to configure DNS-based discovery correctly.

**Configuration example:**
```json
{
  "mcpServers": {
    "myEnterpriseTool": {
      "type": "sse",
      "url": "https://mcp.example.com/sse",
      "oauth": {
        "authServerMetadataUrl": "https://idp.example.com/.well-known/oauth-authorization-server"
      }
    }
  }
}
```

## 6. McpClient (rH6) Deep Dive

The `McpClient` class (chunks.79.mjs) extends a base JSON-RPC client (`Hb1`) and adds MCP-specific protocol handling.

### Constructor Properties

| Property | Purpose |
|---|---|
| `_transport` | The active transport instance (Stdio, SSE, HTTP, or WebSocket) |
| `_tools` | Cached tool list with computed validators |
| `_resources` | Cached resource list |
| `_capabilities` | Server capabilities from initialization handshake |
| `_taskSupportedTools` | Set of tool names that support the task execution pattern |
| `_validators` | Map of tool name → compiled JSON Schema validator |
| `_notificationHandlers` | Map of method → handler for server push notifications |

### `connect()` — Protocol Version Negotiation

The MCP initialization handshake follows a 3-step protocol:

```javascript
// ============================================
// McpClient.connect - MCP protocol initialization handshake
// Location: chunks.79.mjs:214313-214380
// ============================================

// ORIGINAL (for source lookup):
async connect(transport) {
  await transport.start();
  this._transport = transport;
  let result = await this.request({ method: "initialize", params: {
    protocolVersion: LATEST_PROTOCOL_VERSION,
    capabilities: this.getClientCapabilities(),
    clientInfo: { name: "claude-code", version: VERSION }
  }});
  if (!isCompatibleVersion(result.protocolVersion)) {
    throw new Error(`Incompatible protocol: ${result.protocolVersion}`);
  }
  this._capabilities = result.capabilities;
  await this.notification({ method: "notifications/initialized" });
}

// READABLE (for understanding):
async connect(transport) {
  // Step 1: Start the transport (spawn process, open connection, etc.)
  await transport.start();
  this._transport = transport;

  // Step 2: Send initialize request with our protocol version and capabilities
  const initResult = await this.request({
    method: "initialize",
    params: {
      protocolVersion: LATEST_PROTOCOL_VERSION,  // e.g., "2024-11-05"
      capabilities: this.getClientCapabilities(), // what Claude Code supports
      clientInfo: { name: "claude-code", version: VERSION }
    }
  });

  // Step 3: Check server's protocol version compatibility
  if (!isCompatibleVersion(initResult.protocolVersion)) {
    throw new Error(`Incompatible MCP protocol version: ${initResult.protocolVersion}`);
  }

  this._capabilities = initResult.capabilities;  // save server capabilities

  // Step 4: Send initialized notification (required by spec — signals client is ready)
  await this.notification({ method: "notifications/initialized" });
}

// Mapping: result→initResult, isCompatibleVersion→version compatibility check
```

**Why the `notifications/initialized` step:** The MCP spec requires this handshake to be two-phase: `initialize` request + `initialized` notification. The server may not send any messages between receiving `initialize` response and receiving `notifications/initialized`. This ordering guarantee allows the server to perform its own setup (e.g., loading tools, scanning filesystem) between the two phases.

### `listTools()` — Metadata Caching

```javascript
// ============================================
// McpClient.listTools - Discover and cache server tools with validators
// Location: chunks.79.mjs:~214500-214560
// ============================================

// ORIGINAL (for source lookup):
async listTools() {
  if (this._tools) return this._tools;
  let result = await this.request({ method: "tools/list" });
  this._validators = new Map();
  this._taskSupportedTools = new Set();
  for (let tool of result.tools) {
    this._validators.set(tool.name, compileSchema(tool.inputSchema));
    if (tool.annotations?.task) this._taskSupportedTools.add(tool.name);
  }
  this._tools = result.tools;
  return this._tools;
}

// READABLE (for understanding):
async listTools() {
  // Cache hit: return previously discovered tools
  if (this._tools) return this._tools;

  const result = await this.request({ method: "tools/list" });

  // Pre-compile JSON Schema validators for each tool's input schema
  // This avoids re-compiling on every tool call (schemas are static per session)
  this._validators = new Map();
  this._taskSupportedTools = new Set();

  for (const tool of result.tools) {
    // Compile AJV validator for input schema validation
    this._validators.set(tool.name, compileSchema(tool.inputSchema));

    // Track tools that support task execution (background/async mode)
    if (tool.annotations?.task) {
      this._taskSupportedTools.add(tool.name);
    }
  }

  this._tools = result.tools;
  return this._tools;
}

// Mapping: compileSchema→AJV schema compilation
```

**Key insight: Pre-compiled validators:** JSON Schema validation via AJV requires an upfront compilation step that produces an optimized validator function. By caching validators in `this._validators`, subsequent tool calls avoid recompiling the same schema. In a session with hundreds of tool calls, this produces measurable performance savings.

**`task` annotation:** Tools annotated with `annotations.task: true` support an alternative "task" invocation pattern where the tool runs asynchronously and reports progress. The `_taskSupportedTools` set enables `callTool()` to route accordingly.

### `callTool()` — Task Routing

```javascript
// ============================================
// McpClient.callTool - Execute MCP tool with schema validation and task routing
// Location: chunks.79.mjs:~214580-214640
// ============================================

// ORIGINAL (for source lookup):
async callTool(name, args, options) {
  let validator = this._validators?.get(name);
  if (validator && !validator(args)) {
    throw new McpToolError(`Invalid args for ${name}: ${ajvErrorsToString(validator.errors)}`);
  }
  let method = this._taskSupportedTools?.has(name) ? "tasks/call" : "tools/call";
  return await this.request({ method, params: { name, arguments: args } }, options);
}

// READABLE (for understanding):
async callTool(toolName, toolArgs, callOptions) {
  // Validate args against the pre-compiled JSON Schema validator
  const validator = this._validators?.get(toolName);
  if (validator && !validator(toolArgs)) {
    throw new McpToolError(
      `Invalid arguments for tool "${toolName}": ${formatValidationErrors(validator.errors)}`
    );
  }

  // Route to tasks/call (async) or tools/call (sync) based on tool annotation
  const method = this._taskSupportedTools?.has(toolName) ? "tasks/call" : "tools/call";

  return await this.request(
    { method, params: { name: toolName, arguments: toolArgs } },
    callOptions  // may include AbortSignal for timeout
  );
}

// Mapping: name→toolName, args→toolArgs, options→callOptions, validator→validator
```

**Why validate before calling:** Client-side validation catches schema errors before making the network round-trip to the MCP server. For stdio transports, each round-trip involves process I/O; for remote transports, it involves HTTP. Early validation eliminates ~100% of obviously wrong calls.

### `readResource()` — Schema Validation

```javascript
// ============================================
// McpClient.readResource - Fetch MCP resource with URI validation
// Location: chunks.79.mjs:~214660-214700
// ============================================

// ORIGINAL (for source lookup):
async readResource(uri) {
  let result = await this.request({ method: "resources/read", params: { uri } });
  return ResourceContentsSchema.parse(result);
}

// READABLE (for understanding):
async readResource(resourceUri) {
  const result = await this.request({
    method: "resources/read",
    params: { uri: resourceUri }
  });

  // Validate response against Zod schema before returning
  // Prevents malformed MCP server responses from propagating as undefined behavior
  return ResourceContentsSchema.parse(result);
}

// Mapping: uri→resourceUri, ResourceContentsSchema→Zod validation schema
```

**Zod validation on responses:** Unlike tool calls (validated on input), resource reads validate the *response*. This is because resources can have complex MIME-typed content and the Zod schema ensures the client always receives a well-typed `{ uri, mimeType, text | blob }` structure regardless of what the server actually sent.

---

## 7. Transport Layer

> For full transport implementation details, see [transport_layer.md](./transport_layer.md)

The four transport types:
- `StdioClientTransport` (SJA) — subprocess pipe transport for local servers
- `SSEClientTransport` (D$6) — HTTP + Server-Sent Events for remote servers
- `StreamableHTTPClientTransport` (j$6) — HTTP long-polling with resumption tokens
- `WebSocketClientTransport` (VG6) — WebSocket frame transport

---

## 8. Related Symbols

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md)

Key functions in this document:
- `mcpCliProgram` (A11) - Commander instance for `mcp-cli`.
- `executeMcpTool` (yHz) - Tool execution logic.
- `McpClient` (rH6) - Core client class.
- `StdioClientTransport` (SJA) - Process-based transport.
- `callRemoteMcpEndpoint` (zY1) - Remote delegation.
- `callMcpServer` (ECA) - JSON-RPC request dispatcher.
- `parseToolIdentifier` (mFA) - Server/tool name parser.
- `runMcpCliCommand` (SHz) - CLI command runner.

> Cross-references:
> - Transport details: [transport_layer.md](./transport_layer.md)
> - Hub and MCPContext: [mcp_hub.md](./mcp_hub.md)
> - React UI integration: [ui_linkage.md](./ui_linkage.md)
> - Meta-tooling architecture: [implementation.md](./implementation.md)
> - Elicitation protocol: [elicitation_handler.md](./elicitation_handler.md)
> - Elicitation feature overview: [elicitation.md](./elicitation.md)
