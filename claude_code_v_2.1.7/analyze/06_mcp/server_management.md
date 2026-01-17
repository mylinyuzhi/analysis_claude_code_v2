# MCP Server Configuration & Management

## Overview

Claude Code manages MCP servers through a multi-scope configuration system with enterprise policy support. This document covers server configuration, connection management, and the batch initialization process.

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Configuration Scopes

MCP servers can be configured in multiple scopes with the following precedence (highest to lowest):

| Priority | Scope | Location | Description |
|----------|-------|----------|-------------|
| 1 | Enterprise | System policy | Enterprise-wide restrictions |
| 2 | Local | `.claude.local.json` | Current directory local config |
| 3 | Project | `.mcp.json` | Project-level (walks up directory tree) |
| 4 | User | `~/.config/claude/settings.json` | User-level settings |
| 5 | Dynamic | CLI `--mcp-config` | Command-line provided configs |
| 6 | Plugin | Plugin manifests | Plugin-provided servers |

**Key Rule:** When enterprise config exists, it **completely overrides** all other scopes.

---

## Loading MCP Servers

### cEA - Load All MCP Configurations

**Location:** `chunks.131.mjs:535-587`

```javascript
// ============================================
// cEA - loadAllMcpConfig
// Location: chunks.131.mjs:535-587
// ============================================

// ORIGINAL (for source lookup):
async function cEA() {
  let {servers: A} = sX("enterprise");
  if (_10()) {
    let F = {};
    for (let [K, D] of Object.entries(A)) {
      if (!P10(K, D)) continue;
      F[K] = D
    }
    return {servers: F, errors: []}
  }
  let {servers: Q} = sX("user"),
      {servers: B} = sX("project"),
      {servers: G} = sX("local"),
      Z = {},
      I = await DG(),
      Y = [];
  // ... plugin loading ...
  let J = {};
  for (let [F, K] of Object.entries(B))
    if (C21(F) === "approved") J[F] = K;
  let W = Object.assign({}, Z, Q, J, G),
      X = {};
  for (let [F, K] of Object.entries(W)) {
    if (!P10(F, K)) continue;
    X[F] = K
  }
  return {servers: X, errors: Y}
}

// READABLE (for understanding):
async function loadAllMcpConfig() {
  // Step 1: Load enterprise servers (highest priority)
  let {servers: enterpriseServers} = loadScopeServers("enterprise");

  // Step 2: If enterprise config exists, ONLY use enterprise servers
  if (enterpriseConfigExists()) {
    let filteredServers = {};
    for (let [name, config] of Object.entries(enterpriseServers)) {
      // Apply policy filter
      if (!isServerAllowedByPolicy(name, config)) continue;
      filteredServers[name] = config;
    }
    return { servers: filteredServers, errors: [] };
  }

  // Step 3: Load from all other scopes
  let {servers: userServers} = loadScopeServers("user");
  let {servers: projectServers} = loadScopeServers("project");
  let {servers: localServers} = loadScopeServers("local");

  // Step 4: Load plugin-provided servers
  let pluginServers = {};
  let pluginMcpResult = await discoverPluginsAndHooks();
  let pluginErrors = [];
  // ... process plugin servers ...

  // Step 5: Filter project servers to only "approved" ones
  let approvedProjectServers = {};
  for (let [name, config] of Object.entries(projectServers)) {
    if (getProjectServerApprovalStatus(name) === "approved") {
      approvedProjectServers[name] = config;
    }
  }

  // Step 6: Merge servers (later overwrites earlier)
  // Priority: plugins → user → approved project → local
  let mergedServers = Object.assign({},
    pluginServers,
    userServers,
    approvedProjectServers,
    localServers
  );

  // Step 7: Apply policy filters
  let filteredServers = {};
  for (let [name, config] of Object.entries(mergedServers)) {
    if (!isServerAllowedByPolicy(name, config)) continue;
    filteredServers[name] = config;
  }

  return { servers: filteredServers, errors: pluginErrors };
}

// Mapping: cEA→loadAllMcpConfig, sX→loadScopeServers, _10→enterpriseConfigExists
// P10→isServerAllowedByPolicy, C21→getProjectServerApprovalStatus, DG→discoverPluginsAndHooks
```

**Key Decision: Enterprise Override**

**Why this approach:**
- Enterprises need strict control over allowed tools
- Clear separation between managed and unmanaged environments
- Simplifies security audits - when enterprise config exists, only enterprise servers are available

---

## Batch Connection Process

### EL0 - Batch Initialize All Servers

**Location:** `chunks.131.mjs:1175-1240`

```javascript
// ============================================
// EL0 - batchInitializeAllServers
// Location: chunks.131.mjs:1175-1240
// ============================================

// READABLE (for understanding):
async function batchInitializeAllServers(onServerConnected, serverConfigs) {
  // Group servers by transport type for diagnostics
  let serverEntries = Object.entries(serverConfigs);
  let totalServers = serverEntries.length;

  let diagnostics = {
    totalServers,
    stdioCount: serverEntries.filter(([_, c]) => c.type === "stdio").length,
    sseCount: serverEntries.filter(([_, c]) => c.type === "sse").length,
    httpCount: serverEntries.filter(([_, c]) => c.type === "http").length,
    sseIdeCount: serverEntries.filter(([_, c]) => c.type === "sse-ide").length,
    wsIdeCount: serverEntries.filter(([_, c]) => c.type === "ws-ide").length
  };

  // Process servers with concurrency limit (default: 3)
  await batchProcessWithLimit(serverEntries, getBatchSize(), async ([serverName, serverConfig]) => {
    try {
      // Skip disabled servers
      if (isServerDisabled(serverName)) {
        onServerConnected({
          client: { name: serverName, type: "disabled", config: serverConfig },
          tools: [], commands: []
        });
        return;
      }

      // Connect to server
      let clientConnection = await connectMcpServer(serverName, serverConfig, diagnostics);

      if (clientConnection.type !== "connected") {
        onServerConnected({ client: clientConnection, tools: [], commands: [] });
        return;
      }

      // Fetch capabilities in parallel
      let hasResources = !!clientConnection.capabilities?.resources;
      let [tools, commands, resources] = await Promise.all([
        fetchMcpTools(clientConnection),
        fetchMcpPrompts(clientConnection),
        hasResources ? fetchMcpResources(clientConnection) : Promise.resolve([])
      ]);

      onServerConnected({
        client: clientConnection,
        tools, commands,
        resources: resources.length > 0 ? resources : undefined
      });
    } catch (error) {
      logMcpError(serverName, `Error: ${error.message}`);
      onServerConnected({
        client: { name: serverName, type: "failed", config: serverConfig },
        tools: [], commands: []
      });
    }
  });
}

// Mapping: EL0→batchInitializeAllServers, Vr2→batchProcessWithLimit
```

**Key Decision: Batch Size Limiting**

**How it works:**
1. Groups servers by transport type for telemetry
2. Processes connections with concurrency limit (default: 3)
3. Callbacks invoked progressively as servers connect
4. Parallel capability fetching within each server

**Why this approach:**
- Prevents spawning too many processes simultaneously (stdio)
- Limits concurrent network connections (sse/http)
- Progressive loading improves perceived performance

---

## Server Connection

### SO - Connect Single MCP Server

**Location:** `chunks.131.mjs:1563-1900`

This is the main entry point for establishing MCP server connections. It handles:

1. **Transport creation** based on server type
2. **Client initialization** with MCP protocol
3. **Connection timeout** (60 seconds default)
4. **Error handling** and logging
5. **Capability negotiation**

```javascript
// ============================================
// SO - connectMcpServer (simplified)
// Location: chunks.131.mjs:1563-1900
// ============================================

// Key constants
const CONNECTION_TIMEOUT = 60000; // Fr2 = 60000ms

// Transport creation
switch (serverConfig.type) {
  case "sse":
    transport = new SSEClientTransport(url, { authProvider, fetch });
    break;
  case "http":
    transport = new HttpClientTransport(url, { authProvider, fetch });
    break;
  case "ws":
  case "ws-ide":
    transport = new WebSocketClientTransport(new WebSocket(url, ["mcp"]));
    break;
  case "stdio":
  default:
    transport = new StdioClientTransport({ command, args, env, stderr: "pipe" });
    break;
}

// Client creation and connection
const client = new MCPClient({ name: "claude-code", version: "2.1.7" });
await Promise.race([
  client.connect(transport),
  createTimeoutPromise(CONNECTION_TIMEOUT)
]);

// Mapping: SO→connectMcpServer, Fr2→CONNECTION_TIMEOUT, PG1→MCPClient
// KX0→StdioClientTransport, rG1→SSEClientTransport, kX0→HttpClientTransport, JZ1→WebSocketClientTransport
```

---

## Tool Discovery

### Ax - Fetch Tools from MCP Server

**Location:** `chunks.131.mjs:1917-1988`

```javascript
// ============================================
// Ax - fetchMcpTools
// Location: chunks.131.mjs:1917-1988
// ============================================

// ORIGINAL (for source lookup):
Ax = W0(async (A) => {
  if (A.type !== "connected") return [];
  try {
    if (!A.capabilities?.tools) return [];
    let Q = await A.client.request({
      method: "tools/list"
    }, WxA);
    return Nr(Q.tools).map((G) => ({
      ...P42,
      name: `mcp__${e3(A.name)}__${e3(G.name)}`,
      originalMcpToolName: G.name,
      isMcp: !0,
      async description() { return G.description ?? "" },
      inputJSONSchema: G.inputSchema,
      isConcurrencySafe() { return G.annotations?.readOnlyHint ?? !1 },
      isReadOnly() { return G.annotations?.readOnlyHint ?? !1 },
      isDestructive() { return G.annotations?.destructiveHint ?? !1 },
      isOpenWorld() { return G.annotations?.openWorldHint ?? !1 },
      async call(Z, Y, J, X) {
        let W = await eKA(A);
        return { data: await zr2({ client: W, tool: G.name, args: Z, signal: Y.abortController.signal }) }
      },
      userFacingName() {
        let Z = G.annotations?.title || G.name;
        return `${A.name} - ${Z} (MCP)`
      }
    })).filter(rB7)
  } catch (Q) {
    return NZ(A.name, `Failed to fetch tools: ${Q.message}`), []
  }
})

// READABLE (for understanding):
const fetchMcpTools = memoize(async (serverConnection) => {
  if (serverConnection.type !== "connected") return [];

  try {
    // Check if server supports tools
    if (!serverConnection.capabilities?.tools) return [];

    // Request tool list from server
    let response = await serverConnection.client.request(
      { method: "tools/list" },
      toolsListSchema
    );

    // Transform each tool into Claude Code tool format
    return normalizeArray(response.tools).map((tool) => ({
      ...baseToolProperties,

      // Renamed with mcp__ prefix to avoid conflicts
      name: `mcp__${normalizeToolName(serverConnection.name)}__${normalizeToolName(tool.name)}`,
      originalMcpToolName: tool.name,
      isMcp: true,

      // Tool metadata
      async description() { return tool.description ?? "" },
      inputJSONSchema: tool.inputSchema,

      // Annotations from MCP spec
      isConcurrencySafe() { return tool.annotations?.readOnlyHint ?? false },
      isReadOnly() { return tool.annotations?.readOnlyHint ?? false },
      isDestructive() { return tool.annotations?.destructiveHint ?? false },
      isOpenWorld() { return tool.annotations?.openWorldHint ?? false },

      // Tool execution
      async call(args, context, assistantTurn, lastApiMessage) {
        let connectedClient = await ensureServerConnected(serverConnection);
        return {
          data: await executeMcpTool({
            client: connectedClient,
            tool: tool.name,
            args: args,
            signal: context.abortController.signal
          })
        };
      },

      // Display name for UI
      userFacingName() {
        let displayName = tool.annotations?.title || tool.name;
        return `${serverConnection.name} - ${displayName} (MCP)`;
      }
    })).filter(isValidTool);
  } catch (error) {
    logMcpError(serverConnection.name, `Failed to fetch tools: ${error.message}`);
    return [];
  }
});

// Mapping: Ax→fetchMcpTools, W0→memoize, A→serverConnection
// Nr→normalizeArray, e3→normalizeToolName, P42→baseToolProperties
// eKA→ensureServerConnected, zr2→executeMcpTool, rB7→isValidTool
```

**Key Features:**

1. **Tool Naming:** `mcp__${serverName}__${toolName}` prevents conflicts
2. **Memoization:** Results cached per server connection
3. **Annotations Support:** ReadOnlyHint, DestructiveHint, OpenWorldHint
4. **Lazy Execution:** Tool call delegates to `executeMcpTool` (zr2)

---

## Prompt Discovery

### ZhA - Fetch Prompts from MCP Server

**Location:** `chunks.131.mjs:2003-2046`

```javascript
// ============================================
// ZhA - fetchMcpPrompts
// Location: chunks.131.mjs:2003-2046
// ============================================

// READABLE (for understanding):
const fetchMcpPrompts = memoize(async (serverConnection) => {
  if (serverConnection.type !== "connected") return [];

  try {
    if (!serverConnection.capabilities?.prompts) return [];

    let response = await serverConnection.client.request(
      { method: "prompts/list" },
      promptsListSchema
    );

    if (!response.prompts) return [];

    return normalizeArray(response.prompts).map((prompt) => {
      // Extract argument names
      let argNames = Object.values(prompt.arguments ?? {}).map((arg) => arg.name);

      return {
        type: "prompt",
        name: `mcp__${normalizeToolName(serverConnection.name)}__${prompt.name}`,
        description: prompt.description ?? "",
        isMcp: true,
        argNames: argNames,
        source: "mcp",

        userFacingName() {
          return `${serverConnection.name}:${prompt.name} (MCP)`;
        },

        async getPromptForCommand(argsString) {
          let argValues = argsString.split(" ");
          try {
            let client = await ensureServerConnected(serverConnection);
            let result = await client.client.getPrompt({
              name: prompt.name,
              arguments: mapArgsToNames(argNames, argValues)
            });
            // Convert MCP content format to Claude message format
            return (await Promise.all(
              result.messages.map((msg) => convertMcpContent(msg.content, client.name))
            )).flat();
          } catch (error) {
            logMcpError(serverConnection.name, `Error running '${prompt.name}': ${error.message}`);
            throw error;
          }
        }
      };
    });
  } catch (error) {
    logMcpError(serverConnection.name, `Failed to fetch prompts: ${error.message}`);
    return [];
  }
});

// Mapping: ZhA→fetchMcpPrompts, s9Q→mapArgsToNames, Er2→convertMcpContent
```

---

## Resource Discovery

### GhA - Fetch Resources from MCP Server

**Location:** `chunks.131.mjs:1988-2002`

```javascript
// ============================================
// GhA - fetchMcpResources
// Location: chunks.131.mjs:1988-2002
// ============================================

// READABLE (for understanding):
const fetchMcpResources = memoize(async (serverConnection) => {
  if (serverConnection.type !== "connected") return [];

  try {
    // Check if server supports resources
    if (!serverConnection.capabilities?.resources) return [];

    let response = await serverConnection.client.request(
      { method: "resources/list" },
      resourcesListSchema
    );

    if (!response.resources) return [];

    // Add server name to each resource for tracking
    return response.resources.map((resource) => ({
      ...resource,
      server: serverConnection.name
    }));
  } catch (error) {
    logMcpError(serverConnection.name, `Failed to fetch resources: ${error.message}`);
    return [];
  }
});

// Mapping: GhA→fetchMcpResources, l9A→resourcesListSchema
```

---

## Server Reconnection

### C3A - Reconnect Failed Server

**Location:** `chunks.131.mjs:1125-1166`

```javascript
// ============================================
// C3A - reconnectMcpServer
// Location: chunks.131.mjs:1125-1166
// ============================================

// READABLE (for understanding):
async function reconnectMcpServer(serverConnection) {
  // Validate server config still exists
  let serverConfig = validateServerConfig(serverConnection);

  // Attempt connection
  let newConnection = await connectMcpServer(serverConnection.name, serverConfig);

  if (newConnection.type !== "connected") {
    return newConnection;
  }

  // Fetch all capabilities
  let hasResources = !!newConnection.capabilities?.resources;
  let [tools, prompts, resources] = await Promise.all([
    fetchMcpTools(newConnection),
    fetchMcpPrompts(newConnection),
    hasResources ? fetchMcpResources(newConnection) : Promise.resolve([])
  ]);

  return {
    client: newConnection,
    tools,
    commands: prompts,
    resources: resources.length > 0 ? resources : undefined
  };
}

// Mapping: C3A→reconnectMcpServer, pc→validateServerConfig
```

---

## Configuration Format

### Server Configuration Schema

```javascript
// Location: chunks.90.mjs
const serverConfigSchema = z.union([
  // stdio - local process
  z.object({
    type: z.literal("stdio").optional(),
    command: z.string(),
    args: z.array(z.string()).optional(),
    env: z.record(z.string()).optional()
  }),

  // sse - Server-Sent Events
  z.object({
    type: z.literal("sse"),
    url: z.string(),
    headers: z.record(z.string()).optional()
  }),

  // http - HTTP polling
  z.object({
    type: z.literal("http"),
    url: z.string(),
    headers: z.record(z.string()).optional()
  }),

  // ws - WebSocket
  z.object({
    type: z.literal("ws"),
    url: z.string(),
    headers: z.record(z.string()).optional()
  }),

  // IDE-specific transports
  z.object({ type: z.literal("sse-ide"), /* ... */ }),
  z.object({ type: z.literal("ws-ide"), /* ... */ }),

  // SDK-based
  z.object({ type: z.literal("sdk") })
]);
```

### Example Configuration Files

**~/.config/claude/settings.json (User scope):**
```json
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
    }
  }
}
```

**.mcp.json (Project scope):**
```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## CLI Commands

```bash
# Add stdio server
claude mcp add <name> <command> [args...] --transport stdio --env KEY=VALUE

# Add SSE server
claude mcp add <name> <url> --transport sse --header "Authorization: Bearer token"

# Add HTTP server
claude mcp add <name> <url> --transport http

# Remove server
claude mcp remove <name> --scope local|user|project

# List all servers
claude mcp list

# Get server details
claude mcp get <name>

# Add from JSON
claude mcp add-json <name> '{"type":"stdio","command":"npx","args":["-y","server"]}'

# Import from Claude Desktop
claude mcp add-from-claude-desktop
```

---

## Related Symbols

Key functions in this document:
- `loadAllMcpConfig` (cEA) - Load all MCP configurations
- `batchInitializeAllServers` (EL0) - Batch server initialization
- `connectMcpServer` (SO) - Single server connection
- `fetchMcpTools` (Ax) - Tool discovery
- `fetchMcpPrompts` (ZhA) - Prompt discovery
- `fetchMcpResources` (GhA) - Resource discovery
- `reconnectMcpServer` (C3A) - Server reconnection
- `CONNECTION_TIMEOUT` (Fr2) - 60000ms constant

---

## See Also

- [protocol_overview.md](./protocol_overview.md) - Architecture overview
- [tool_execution.md](./tool_execution.md) - Tool calling details
- [mcp_autosearch.md](./mcp_autosearch.md) - Auto-search mode
