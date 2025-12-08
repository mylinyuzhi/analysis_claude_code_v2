# MCP (Model Context Protocol) Implementation

## Overview

Claude Code v2.0.59 implements the **Model Context Protocol (MCP)** to integrate with external servers that provide tools, prompts, and resources. The MCP implementation supports multiple transport protocols: stdio, SSE (Server-Sent Events), HTTP, and IDE-specific transports.

> Symbol mappings: [symbol_index_infra.md](../00_overview/symbol_index_infra.md#module-mcp-protocol)

## Related Symbols

Key functions documented in this analysis:

**Core Connection:**
- `connectSingleMcpServer` (D1A) - Single server connection entry point
- `batchConnectMcpServers` (v10) - Batch connection with concurrency limits
- `connectToMcpServer` (ZYA) - Low-level transport connection
- `initializeMcpServer` (IYA) - Pre-connection setup

**Configuration Management:**
- `addServerToConfig` (K1A) - Add server to configuration scope
- `loadAllMcpServers` (fk) - Aggregate servers from all scopes
- `parseMcpConfigObject` (ZMA) - Validate and expand config object
- `parseMcpConfigFile` (BYA) - Load and parse config file

**Timeout Configuration:**
- `getMCPToolTimeout` (MY5) - Tool execution timeout (default: 100M ms)
- `getMCPConnectionTimeout` (z21) - Connection timeout (default: 30s)
- `getMCPServerConnectionBatchSize` (OY5) - Batch size (default: 3)

**Tool Calling & Results:**
- `callMcpTool` (y32) - Main tool invocation with progress monitoring
- `processMcpToolResult` (jY5) - Result processing with IDE bypass
- `limitToolResultSize` (DB2) - Apply token limit truncation
- `exceedsTokenLimit` ($e1) - Two-tier threshold check
- `truncateResultWithWarning` (B95) - Truncate and append warning

**Image Processing:**
- `processImageForSize` (rt) - Progressive image optimization
- `multiScaleResizing` (yz6) - Multi-scale resize strategy
- `applyFormatSpecificEncoding` (xz6) - Format-specific compression
- `pngCompressionOptimization` (vz6) - PNG palette compression
- `jpegQualityOptimization` (bz6) - JPEG quality reduction
- `aggressiveJpegCompression` (fz6) - Aggressive JPEG fallback

---

## Table of Contents

1. [MCP Client Architecture](#mcp-client-architecture)
2. [MCP Server Configuration & Management](#mcp-server-configuration--management)
3. [Dynamic MCP Server Loading](#dynamic-mcp-server-loading)
4. [Transport Types](#transport-types)
5. [MCP Tool Timeout Configuration](#mcp-tool-timeout-configuration)
6. [MCP Tool Calling & Progress Monitoring](#mcp-tool-calling--progress-monitoring)
7. [MCP Tool Failure/Error Handling](#mcp-tool-failureerror-handling)
8. [Large MCP Tool Result Handling](#large-mcp-tool-result-handling)
9. [Image Processing for MCP Results](#image-processing-for-mcp-results)
10. [Dynamic Tool Naming](#dynamic-tool-naming)
11. [MCP Configuration Format](#mcp-configuration-format)

---

## MCP Client Architecture

### Main Connection Function: connectSingleMcpServer (D1A)

**Location:** `chunks.101.mjs:2309-2341`

**What it does:** Establishes connection to a single MCP server, initializes it, and fetches all available capabilities (tools, prompts, resources).

```javascript
// ============================================
// connectSingleMcpServer - Main entry point for single MCP connection
// Location: chunks.101.mjs:2309-2341
// ============================================

// ORIGINAL (for source lookup):
async function D1A(A, Q) {
  try {
    await IYA(A, Q);
    let B = await ZYA(A, Q);
    if (B.type !== "connected") {
      return { client: B, tools: [], commands: [] };
    }
    let G = !!B.capabilities?.resources,
        [Z, I, Y] = await Promise.all([
          x10(B), _32(B), G ? S32(B) : Promise.resolve([])
        ]),
        J = [];
    if (G) {
      if (![Wh, Xh].some((X) => Z.some((V) => V.name === X.name)))
        J.push(Wh, Xh);
    }
    return {
      client: B,
      tools: [...Z, ...J],
      commands: I,
      resources: Y.length > 0 ? Y : void 0
    };
  } catch (B) {
    WI(A, `Error during reconnection: ${B instanceof Error ? B.message : String(B)}`);
    return { client: { name: A, type: "failed", config: Q }, tools: [], commands: [] };
  }
}

// READABLE (for understanding):
async function connectSingleMcpServer(serverName, serverConfig) {
  try {
    // Step 1: Initialize the server (pre-connection setup)
    await initializeMcpServer(serverName, serverConfig);

    // Step 2: Establish connection to the server
    let clientConnection = await connectToMcpServer(serverName, serverConfig);

    // Step 3: Check if connection was successful
    if (clientConnection.type !== "connected") {
      return { client: clientConnection, tools: [], commands: [] };
    }

    // Step 4: Check server capabilities
    let hasResourceCapability = !!clientConnection.capabilities?.resources;

    // Step 5: Fetch tools, prompts, and resources in parallel
    let [tools, prompts, resources] = await Promise.all([
      listMcpTools(clientConnection),
      listMcpPrompts(clientConnection),
      hasResourceCapability ? listMcpResources(clientConnection) : Promise.resolve([])
    ]);

    // Step 6: Add resource helper tools if server supports resources
    let additionalTools = [];
    if (hasResourceCapability) {
      // Only add if not already provided by the server
      if (![readResourceTool, refreshResourcesTool].some(
        (helperTool) => tools.some((serverTool) => serverTool.name === helperTool.name)
      )) {
        additionalTools.push(readResourceTool, refreshResourcesTool);
      }
    }

    return {
      client: clientConnection,
      tools: [...tools, ...additionalTools],
      commands: prompts,
      resources: resources.length > 0 ? resources : undefined
    };
  } catch (error) {
    logMcpError(serverName, `Error during reconnection: ${error instanceof Error ? error.message : String(error)}`);
    return {
      client: { name: serverName, type: "failed", config: serverConfig },
      tools: [],
      commands: []
    };
  }
}

// Mapping: D1A→connectSingleMcpServer, A→serverName, Q→serverConfig
// IYA→initializeMcpServer, ZYA→connectToMcpServer, x10→listMcpTools
// _32→listMcpPrompts, S32→listMcpResources, Wh→readResourceTool, Xh→refreshResourcesTool
```

**Key Decision: Parallel Capability Fetching**

**How it works:**
1. Initialize server with pre-connection setup
2. Establish transport connection
3. Check capabilities advertised by server
4. Fetch tools, prompts, and resources in parallel using `Promise.all()`
5. Inject helper tools for resource-capable servers

**Why this approach:**
- Parallel fetching reduces total connection time
- Capability check prevents unnecessary resource requests
- Helper tool injection ensures consistent resource access interface

---

### Batch Connection: batchConnectMcpServers (v10)

**Location:** `chunks.101.mjs:2350-2411`

**What it does:** Connects to multiple MCP servers concurrently with batch size limiting to prevent overwhelming the system.

```javascript
// ============================================
// batchConnectMcpServers - Batch connect to multiple MCP servers
// Location: chunks.101.mjs:2350-2411
// ============================================

// ORIGINAL (for source lookup):
async function v10(A, Q) {
  let B = !1,
      G = Object.entries(Q ?? (await fk()).servers),
      Z = G.length,
      I = G.filter(([V, F]) => F.type === "stdio").length,
      Y = G.filter(([V, F]) => F.type === "sse").length,
      J = G.filter(([V, F]) => F.type === "http").length,
      W = G.filter(([V, F]) => F.type === "sse-ide").length,
      X = G.filter(([V, F]) => F.type === "ws-ide").length;

  await PY5(G, OY5(), async ([V, F]) => {
    try {
      if (IMA(V)) {
        A({ client: { name: V, type: "disabled", config: F }, tools: [], commands: [] });
        return;
      }
      let D = await ZYA(V, F, {
        totalServers: Z, stdioCount: I, sseCount: Y,
        httpCount: J, sseIdeCount: W, wsIdeCount: X
      });
      if (D.type !== "connected") {
        A({ client: D, tools: [], commands: [] });
        return;
      }
      let H = !!D.capabilities?.resources,
          [C, E, U] = await Promise.all([x10(D), _32(D), H ? S32(D) : Promise.resolve([])]),
          q = [];
      if (H && !B) { B = !0; q.push(Wh, Xh); }
      A({
        client: D,
        tools: [...C, ...q],
        commands: E,
        resources: U.length > 0 ? U : void 0
      });
    } catch (K) {
      WI(V, `Error fetching tools/commands/resources: ${K instanceof Error ? K.message : String(K)}`);
      A({ client: { name: V, type: "failed", config: F }, tools: [], commands: [] });
    }
  });
}

// READABLE (for understanding):
async function batchConnectMcpServers(onServerConnected, optionalServerConfigs) {
  // Use provided configs or load from all configuration scopes
  let serverConfigs = optionalServerConfigs ?? (await loadAllMcpServers()).servers;
  let serverEntries = Object.entries(serverConfigs);
  let totalServers = serverEntries.length;

  // Count servers by transport type for diagnostics
  let stdioCount = serverEntries.filter(([name, config]) => config.type === "stdio").length;
  let sseCount = serverEntries.filter(([name, config]) => config.type === "sse").length;
  let httpCount = serverEntries.filter(([name, config]) => config.type === "http").length;
  let sseIdeCount = serverEntries.filter(([name, config]) => config.type === "sse-ide").length;
  let wsIdeCount = serverEntries.filter(([name, config]) => config.type === "ws-ide").length;

  // Track if we've already added resource-related tools (only add once)
  let resourceToolsAdded = false;

  // Connect to all servers with concurrency limit
  await batchProcessWithLimit(serverEntries, getMCPServerConnectionBatchSize(), async ([serverName, serverConfig]) => {
    try {
      // Skip disabled servers
      if (isServerDisabled(serverName)) {
        onServerConnected({
          client: { name: serverName, type: "disabled", config: serverConfig },
          tools: [],
          commands: []
        });
        return;
      }

      // Connect to server with diagnostic info
      let clientConnection = await connectToMcpServer(serverName, serverConfig, {
        totalServers: totalServers,
        stdioCount: stdioCount,
        sseCount: sseCount,
        httpCount: httpCount,
        sseIdeCount: sseIdeCount,
        wsIdeCount: wsIdeCount
      });

      // Handle failed connection
      if (clientConnection.type !== "connected") {
        onServerConnected({ client: clientConnection, tools: [], commands: [] });
        return;
      }

      // Fetch capabilities
      let hasResources = !!clientConnection.capabilities?.resources;
      let [tools, commands, resources] = await Promise.all([
        listMcpTools(clientConnection),
        listMcpPrompts(clientConnection),
        hasResources ? listMcpResources(clientConnection) : Promise.resolve([])
      ]);

      // Add resource tools only once across all servers
      let additionalTools = [];
      if (hasResources && !resourceToolsAdded) {
        resourceToolsAdded = true;
        additionalTools.push(readResourceTool, refreshResourcesTool);
      }

      // Callback with connected server
      onServerConnected({
        client: clientConnection,
        tools: [...tools, ...additionalTools],
        commands: commands,
        resources: resources.length > 0 ? resources : undefined
      });
    } catch (error) {
      logMcpError(serverName, `Error fetching tools/commands/resources: ${error instanceof Error ? error.message : String(error)}`);
      onServerConnected({
        client: { name: serverName, type: "failed", config: serverConfig },
        tools: [],
        commands: []
      });
    }
  });
}

// Mapping: v10→batchConnectMcpServers, A→onServerConnected, Q→optionalServerConfigs
// fk→loadAllMcpServers, OY5→getMCPServerConnectionBatchSize, PY5→batchProcessWithLimit
// IMA→isServerDisabled, ZYA→connectToMcpServer
```

**Key Decision: Batch Size Limiting**

**What it does:** Processes server connections in batches to prevent system overload.

**How it works:**
1. Collects server configurations from all scopes (or uses provided)
2. Groups by transport type for diagnostics
3. Processes connections with concurrency limit (default: 3)
4. Callback invoked for each server as it connects
5. Resource tools added only once across all servers

**Why this approach:**
- Prevents spawning too many processes simultaneously (stdio)
- Limits concurrent network connections (sse/http)
- Progressive loading improves perceived performance
- Single set of resource tools avoids duplicates

**Trade-offs considered:**
- **Higher concurrency (e.g., 10)**: Faster initial connection but risks overwhelming system resources, especially for stdio servers that spawn processes
- **Lower concurrency (e.g., 1)**: Safer but slower startup when many servers configured
- **Default of 3**: Balanced choice - fast enough for typical setups (2-5 servers), safe for resource-constrained environments

**Key insight:** The batch size is configurable via `MCP_SERVER_CONNECTION_BATCH_SIZE` environment variable, allowing users to tune based on their hardware and server count. This flexibility is crucial because stdio servers (spawning processes) have different resource profiles than network-based servers (SSE/HTTP).

---

## MCP Server Configuration & Management

### CLI Commands for MCP Management

**Location:** `chunks.131.mjs:597-815`

Claude Code provides comprehensive CLI commands for managing MCP servers:

```bash
# Add stdio server
claude mcp add <name> <command> [args...] --transport stdio --env KEY=VALUE

# Add SSE server
claude mcp add <name> <url> --transport sse --header "Authorization: Bearer token"

# Add HTTP server
claude mcp add <name> <url> --transport http --header "X-API-Key: key"

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

### Configuration Scopes (Priority Order)

Claude Code supports 5 configuration scopes with this precedence order (highest to lowest):

| Priority | Scope | Location | Description |
|----------|-------|----------|-------------|
| 1 | Enterprise | System policy | Enterprise-wide restrictions |
| 2 | Local | `.claude.local.json` | Current directory local config |
| 3 | Project | `.mcp.json` | Project-level (walks up directory tree) |
| 4 | User | `~/.config/claude/settings.json` | User-level settings |
| 5 | Dynamic | CLI `--mcp-config` | Command-line provided configs |

When a server exists in multiple scopes, the **highest priority scope wins**.

### addServerToConfig (K1A)

**Location:** `chunks.101.mjs:1699-1768`

**What it does:** Validates and adds an MCP server to the specified configuration scope.

```javascript
// ============================================
// addServerToConfig - Add MCP server to configuration file
// Location: chunks.101.mjs:1699-1768
// ============================================

// ORIGINAL (for source lookup):
function K1A(A, Q, B) {
  if (A.match(/[^a-zA-Z0-9_-]/)) throw Error(`Invalid name ${A}...`);
  let G = il.safeParse(Q);
  if (!G.success) {
    let I = G.error.errors.map((Y) => `${Y.path.join(".")}: ${Y.message}`).join(", ");
    throw Error(`Invalid configuration: ${I}`)
  }
  let Z = G.data;
  if (T32(A, Z)) throw Error(`Cannot add MCP server "${A}": server is explicitly blocked by enterprise policy`);
  if (!P10(A, Z)) throw Error(`Cannot add MCP server "${A}": not allowed by enterprise policy`);
  switch (B) {
    case "project": {
      let {servers: I} = j10();
      if (I[A]) throw Error(`MCP server ${A} already exists in .mcp.json`);
      break
    }
    case "user": {
      if (N1().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in user config`);
      break
    }
    case "local": {
      if (j5().mcpServers?.[A]) throw Error(`MCP server ${A} already exists in local config`);
      break
    }
  }
  switch (B) {
    case "project": {
      let {servers: I} = j10(), Y = {};
      for (let [W, X] of Object.entries(I)) {
        let {scope: V, ...F} = X;
        Y[W] = F
      }
      Y[A] = Z;
      let J = {mcpServers: Y};
      try { M32(J) } catch (W) { throw Error(`Failed to write to mcp.json: ${W}`) }
      break
    }
    case "user": {
      let I = N1();
      if (!I.mcpServers) I.mcpServers = {};
      I.mcpServers[A] = Z, c0(I);
      break
    }
    case "local": {
      let I = j5();
      if (!I.mcpServers) I.mcpServers = {};
      I.mcpServers[A] = Z, AY(I);
      break
    }
  }
}

// READABLE (for understanding):
function addServerToConfig(serverName, serverConfig, scope) {
  // Step 1: Validate server name (alphanumeric, hyphens, underscores only)
  if (serverName.match(/[^a-zA-Z0-9_-]/)) {
    throw Error(`Invalid name ${serverName}. Names can only contain letters, numbers, hyphens, and underscores.`)
  }

  // Step 2: Validate server configuration against schema
  let parseResult = serverConfigSchema.safeParse(serverConfig)
  if (!parseResult.success) {
    let errorMessages = parseResult.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ")
    throw Error(`Invalid configuration: ${errorMessages}`)
  }
  let validatedConfig = parseResult.data

  // Step 3: Check enterprise policy blocklist
  if (isServerBlocked(serverName, validatedConfig)) {
    throw Error(`Cannot add MCP server "${serverName}": server is explicitly blocked by enterprise policy`)
  }

  // Step 4: Check enterprise policy allowlist
  if (!isServerAllowedByPolicy(serverName, validatedConfig)) {
    throw Error(`Cannot add MCP server "${serverName}": not allowed by enterprise policy`)
  }

  // Step 5: Check for duplicates in target scope
  switch (scope) {
    case "project":
      let {servers: projectServers} = loadProjectMcpConfig()
      if (projectServers[serverName]) {
        throw Error(`MCP server ${serverName} already exists in .mcp.json`)
      }
      break
    case "user":
      if (getUserSettings().mcpServers?.[serverName]) {
        throw Error(`MCP server ${serverName} already exists in user config`)
      }
      break
    case "local":
      if (getLocalSettings().mcpServers?.[serverName]) {
        throw Error(`MCP server ${serverName} already exists in local config`)
      }
      break
  }

  // Step 6: Write to appropriate configuration file
  switch (scope) {
    case "project":
      let {servers: existingServers} = loadProjectMcpConfig()
      let cleanedServers = {}
      for (let [name, config] of Object.entries(existingServers)) {
        let {scope: s, ...cleanConfig} = config
        cleanedServers[name] = cleanConfig
      }
      cleanedServers[serverName] = validatedConfig
      let projectConfig = {mcpServers: cleanedServers}
      try { saveProjectMcpConfig(projectConfig) }
      catch (err) { throw Error(`Failed to write to mcp.json: ${err}`) }
      break

    case "user":
      let userSettings = getUserSettings()
      if (!userSettings.mcpServers) userSettings.mcpServers = {}
      userSettings.mcpServers[serverName] = validatedConfig
      saveUserSettings(userSettings)
      break

    case "local":
      let localSettings = getLocalSettings()
      if (!localSettings.mcpServers) localSettings.mcpServers = {}
      localSettings.mcpServers[serverName] = validatedConfig
      saveLocalSettings(localSettings)
      break
  }
}

// Mapping: K1A→addServerToConfig, A→serverName, Q→serverConfig, B→scope
// il→serverConfigSchema, T32→isServerBlocked, P10→isServerAllowedByPolicy
// j10→loadProjectMcpConfig, N1→getUserSettings, j5→getLocalSettings
// M32→saveProjectMcpConfig, c0→saveUserSettings, AY→saveLocalSettings
```

**Key Decision: Validation Pipeline**

**How it works:**
1. **Name validation** - Only alphanumeric, hyphens, underscores
2. **Schema validation** - Zod schema validates configuration structure
3. **Policy check (blocklist)** - Enterprise can explicitly block servers
4. **Policy check (allowlist)** - Enterprise can restrict to approved servers
5. **Duplicate check** - Prevents overwriting existing configs
6. **Scope-specific write** - Writes to correct configuration file

**Why this approach:**
- Multi-layer validation prevents invalid configurations
- Enterprise policy support enables organization-wide control
- Scope isolation maintains configuration hygiene

### loadAllMcpServers (fk)

**Location:** `chunks.101.mjs:1955-2026`

**What it does:** Aggregates MCP server configurations from all scopes, applies policy filters, and handles plugin-provided servers.

```javascript
// ============================================
// loadAllMcpServers - Aggregate servers from all scopes
// Location: chunks.101.mjs:1955-2026
// ============================================

// ORIGINAL (for source lookup):
async function fk() {
  let {servers: A} = sX("enterprise");
  if (_10()) {
    let F = {};
    for (let [K, D] of Object.entries(A)) {
      if (!P10(K, D)) continue;
      F[K] = D
    }
    return GA("tengu_mcp_servers", {enterprise: Object.keys(F).length, global: 0, project: 0, user: 0, plugin: 0}), {
      servers: F, errors: []
    }
  }
  let {servers: Q} = sX("user"), {servers: B} = sX("project"), {servers: G} = sX("local"), Z = {}, I = await l7(), Y = [];
  // ... plugin loading ...
  let J = {};
  for (let [F, K] of Object.entries(B))
    if (C21(F) === "approved") J[F] = K;
  let W = Object.assign({}, Z, Q, J, G), X = {};
  for (let [F, K] of Object.entries(W)) {
    if (!P10(F, K)) continue;
    X[F] = K
  }
  // ... analytics ...
  return {servers: X, errors: Y}
}

// READABLE (for understanding):
async function loadAllMcpServers() {
  // Step 1: Load enterprise servers (highest priority)
  let {servers: enterpriseServers} = loadScopeServers("enterprise")

  // Step 2: If enterprise config exists, ONLY return enterprise servers
  if (enterpriseConfigExists()) {
    let filteredServers = {}
    for (let [name, config] of Object.entries(enterpriseServers)) {
      if (!isServerAllowedByPolicy(name, config)) continue
      filteredServers[name] = config
    }
    reportAnalytics("tengu_mcp_servers", {
      enterprise: Object.keys(filteredServers).length,
      global: 0, project: 0, user: 0, plugin: 0
    })
    return { servers: filteredServers, errors: [] }
  }

  // Step 3: Load from all other scopes
  let {servers: userServers} = loadScopeServers("user")
  let {servers: projectServers} = loadScopeServers("project")
  let {servers: localServers} = loadScopeServers("local")
  let pluginServers = {}
  let pluginErrors = []

  // Step 4: Load plugin-provided MCP servers
  let pluginMcpResult = await loadPluginMcpServers()
  // ... process plugin servers and errors ...

  // Step 5: Filter project servers to only "approved" ones
  let approvedProjectServers = {}
  for (let [name, config] of Object.entries(projectServers)) {
    if (isProjectServerApproved(name) === "approved") {
      approvedProjectServers[name] = config
    }
  }

  // Step 6: Merge servers (later scopes override earlier)
  // Priority: plugins → user → approved project → local
  let mergedServers = Object.assign({}, pluginServers, userServers, approvedProjectServers, localServers)

  // Step 7: Apply policy filters
  let filteredServers = {}
  for (let [name, config] of Object.entries(mergedServers)) {
    if (!isServerAllowedByPolicy(name, config)) continue
    filteredServers[name] = config
  }

  return { servers: filteredServers, errors: pluginErrors }
}

// Mapping: fk→loadAllMcpServers, sX→loadScopeServers, _10→enterpriseConfigExists
// P10→isServerAllowedByPolicy, C21→isProjectServerApproved, l7→loadPluginMcpServers
```

**Key Decision: Enterprise Override**

**What it does:** When enterprise config exists, it completely overrides all other scopes.

**How it works:**
1. Check if enterprise config file exists (`enterpriseConfigExists()`)
2. If exists: load ONLY enterprise servers, apply policy filters, return immediately
3. If not exists: load from all other scopes (user, project, local, plugins)
4. Merge scopes with priority (plugins → user → approved project → local)
5. Apply policy filters to merged result

**Why this approach:**
- Enterprises need strict control over allowed tools
- Prevents accidental use of unapproved servers
- Clear separation between managed and unmanaged environments

**Alternatives considered:**
- **Merge with enterprise priority**: Would allow non-enterprise servers alongside approved ones, but creates audit complexity
- **Blocklist-only approach**: Enterprise defines what's blocked, rest allowed - less secure, harder to audit
- **Per-scope policy application**: Apply different policies per scope - too complex to reason about

**Key insight:** The "all-or-nothing" enterprise approach dramatically simplifies security audits. When `enterpriseConfigExists()` returns true, security teams know exactly which servers are available (only those in enterprise config that pass policy filters). There's no need to inspect user, project, or plugin configurations - they're completely ignored.

**Security implications:**
- Project `.mcp.json` servers require explicit "approval" even without enterprise config
- This prevents malicious repos from auto-loading dangerous MCP servers
- The `isProjectServerApproved()` check (C21) maintains per-server approval state

---

## Dynamic MCP Server Loading

### --mcp-config CLI Argument Processing

**Location:** `chunks.131.mjs:108-157`

**What it does:** Processes MCP configurations provided via `--mcp-config` command-line argument, supporting both JSON strings and file paths.

```javascript
// ============================================
// Dynamic MCP Config Loading from CLI
// Location: chunks.131.mjs:108-157
// ============================================

// ORIGINAL (for source lookup):
if (C && C.length > 0) {
  let G0 = C.map((sQ) => sQ.trim()).filter((sQ) => sQ.length > 0), yQ = {}, aQ = [];
  for (let sQ of G0) {
    let K0 = null, mB = [], e2 = f7(sQ);
    if (e2) {
      let s8 = ZMA({ configObject: e2, filePath: "command line", expandVars: !0, scope: "dynamic" });
      if (s8.config) K0 = s8.config.mcpServers;
      else mB = s8.errors
    } else {
      let s8 = SD0(sQ), K5 = BYA({ filePath: s8, expandVars: !0, scope: "dynamic" });
      if (K5.config) K0 = K5.config.mcpServers;
      else mB = K5.errors
    }
    if (mB.length > 0) aQ.push(...mB);
    else if (K0) yQ = {...yQ, ...K0}
  }
  if (aQ.length > 0) {
    let sQ = aQ.map((K0) => `${K0.path?K0.path+": ":""}${K0.message}`).join(`\n`);
    throw Error(`Invalid MCP configuration:\n${sQ}`)
  }
  if (Object.keys(yQ).length > 0) {
    let sQ = ns(yQ, (K0) => ({...K0, scope: "dynamic"}));
    yA = {...yA, ...sQ}
  }
}

// READABLE (for understanding):
if (mcpConfigArgs && mcpConfigArgs.length > 0) {
  // Step 1: Trim and filter empty args
  let trimmedConfigs = mcpConfigArgs
    .map((arg) => arg.trim())
    .filter((arg) => arg.length > 0)

  let mergedServers = {}
  let allErrors = []

  // Step 2: Process each MCP config argument
  for (let configArg of trimmedConfigs) {
    let servers = null
    let errors = []

    // Step 3: Try to parse as JSON string first
    let parsedJson = parseJson(configArg)
    if (parsedJson) {
      let result = parseMcpConfigObject({
        configObject: parsedJson,
        filePath: "command line",
        expandVars: true,
        scope: "dynamic"
      })
      if (result.config) servers = result.config.mcpServers
      else errors = result.errors
    } else {
      // Step 4: Try to parse as file path
      let filePath = resolvePathVariables(configArg)
      let result = parseMcpConfigFile({
        filePath: filePath,
        expandVars: true,
        scope: "dynamic"
      })
      if (result.config) servers = result.config.mcpServers
      else errors = result.errors
    }

    // Step 5: Accumulate errors or merge servers
    if (errors.length > 0) allErrors.push(...errors)
    else if (servers) mergedServers = {...mergedServers, ...servers}
  }

  // Step 6: Report all errors
  if (allErrors.length > 0) {
    let errorMessages = allErrors
      .map((err) => `${err.path ? err.path + ": " : ""}${err.message}`)
      .join("\n")
    throw Error(`Invalid MCP configuration:\n${errorMessages}`)
  }

  // Step 7: Mark all loaded servers as "dynamic" scope
  if (Object.keys(mergedServers).length > 0) {
    let normalizedServers = mapObject(mergedServers, (server) => ({
      ...server,
      scope: "dynamic"
    }))
    dynamicMcpConfigs = {...dynamicMcpConfigs, ...normalizedServers}
  }
}

// Mapping: C→mcpConfigArgs, G0→trimmedConfigs, f7→parseJson
// ZMA→parseMcpConfigObject, BYA→parseMcpConfigFile, SD0→resolvePathVariables
```

**Key Decision: JSON vs File Path Detection**

**How it works:**
1. First attempts to parse argument as JSON string
2. If JSON parsing fails, treats it as a file path
3. Environment variables are expanded in both cases
4. All loaded servers marked with "dynamic" scope

**Usage Examples:**

```bash
# Direct JSON string
claude --mcp-config '{"mcpServers":{"github":{"type":"stdio","command":"npx","args":["-y","@modelcontextprotocol/server-github"]}}}'

# File path
claude --mcp-config ./mcp-servers.json

# Multiple configs (merged)
claude --mcp-config ./servers1.json --mcp-config ./servers2.json
```

### parseMcpConfigObject (ZMA)

**Location:** `chunks.101.mjs:2028-2094`

**What it does:** Validates MCP configuration object against schema and expands environment variables.

```javascript
// ============================================
// parseMcpConfigObject - Validate and process MCP config object
// Location: chunks.101.mjs:2028-2094
// ============================================

// ORIGINAL (for source lookup):
function ZMA(A) {
  let {configObject: Q, expandVars: B, scope: G, filePath: Z} = A, I = O22.safeParse(Q);
  if (!I.success) return {
    config: null,
    errors: I.error.issues.map((W) => ({
      ...Z && {file: Z},
      path: W.path.join("."),
      message: "Does not adhere to MCP server configuration schema",
      mcpErrorMetadata: {scope: G, severity: "fatal"}
    }))
  };
  let Y = [], J = {};
  for (let [W, X] of Object.entries(I.data.mcpServers)) {
    let V = X;
    if (B) {
      let {expanded: F, missingVars: K} = wY5(X);
      if (K.length > 0) Y.push({
        ...Z && {file: Z},
        path: `mcpServers.${W}`,
        message: `Missing environment variables: ${K.join(", ")}`,
        suggestion: `Set the following environment variables: ${K.join(", ")}`,
        mcpErrorMetadata: {scope: G, serverName: W, severity: "warning"}
      });
      V = F
    }
    // Windows npx warning...
    J[W] = V
  }
  return {config: {mcpServers: J}, errors: Y}
}

// READABLE (for understanding):
function parseMcpConfigObject(options) {
  let {configObject, expandVars, scope, filePath} = options

  // Step 1: Validate against schema
  let parseResult = configObjectSchema.safeParse(configObject)
  if (!parseResult.success) {
    return {
      config: null,
      errors: parseResult.error.issues.map((issue) => ({
        ...(filePath && {file: filePath}),
        path: issue.path.join("."),
        message: "Does not adhere to MCP server configuration schema",
        mcpErrorMetadata: { scope: scope, severity: "fatal" }
      }))
    }
  }

  let warnings = []
  let processedServers = {}

  // Step 2: Process each server
  for (let [serverName, serverConfig] of Object.entries(parseResult.data.mcpServers)) {
    let finalConfig = serverConfig

    // Step 3: Expand environment variables if requested
    if (expandVars) {
      let {expanded, missingVars} = expandEnvironmentVariables(serverConfig)
      if (missingVars.length > 0) {
        warnings.push({
          ...(filePath && {file: filePath}),
          path: `mcpServers.${serverName}`,
          message: `Missing environment variables: ${missingVars.join(", ")}`,
          suggestion: `Set the following environment variables: ${missingVars.join(", ")}`,
          mcpErrorMetadata: { scope: scope, serverName: serverName, severity: "warning" }
        })
      }
      finalConfig = expanded
    }

    // Step 4: Windows-specific npx warning
    if (getPlatform() === "windows" && (!finalConfig.type || finalConfig.type === "stdio") &&
        (finalConfig.command === "npx" || finalConfig.command.endsWith("\\npx"))) {
      warnings.push({
        ...(filePath && {file: filePath}),
        path: `mcpServers.${serverName}`,
        message: "Windows requires 'cmd /c' wrapper to execute npx",
        suggestion: 'Change command to "cmd" with args ["/c", "npx", ...]',
        mcpErrorMetadata: { scope: scope, serverName: serverName, severity: "warning" }
      })
    }

    processedServers[serverName] = finalConfig
  }

  return { config: {mcpServers: processedServers}, errors: warnings }
}

// Mapping: ZMA→parseMcpConfigObject, Q→configObject, B→expandVars, G→scope, Z→filePath
// O22→configObjectSchema, wY5→expandEnvironmentVariables, dQ→getPlatform
```

---

## Transport Types

Claude Code supports multiple MCP transport types:

### 1. STDIO Transport

Standard input/output for local processes:

```javascript
// Configuration
{
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-example"],
  "env": {
    "API_KEY": "your-key"
  }
}
```

**Transport Initialization:**
```javascript
transport = new StdioClientTransport({
  command: command,
  args: args,
  env: {...process.env, ...serverConfig.env},
  stderr: "pipe"
})
```

### 2. SSE (Server-Sent Events) Transport

HTTP-based transport for remote servers:

```javascript
// Configuration
{
  "type": "sse",
  "url": "https://mcp.example.com/sse",
  "headers": {
    "Authorization": "Bearer token",
    "X-Custom": "value"
  }
}
```

**Transport Initialization:**
```javascript
transport = new SseClientTransport(new URL(serverConfig.url), {
  authProvider: authProvider,
  requestInit: {
    headers: { "User-Agent": getUserAgent(), ...authHeaders },
    signal: AbortSignal.timeout(60000)  // 60 second connection timeout
  }
})
```

### 3. HTTP Transport

Standard HTTP for request-response:

```javascript
// Configuration
{
  "type": "http",
  "url": "https://mcp.example.com/mcp",
  "headers": {
    "Authorization": "Bearer token"
  }
}
```

### 4. IDE Transports

Special transports for IDE integration:

```javascript
// SSE-IDE
{ "type": "sse-ide", "url": "...", /* IDE-specific config */ }

// WS-IDE (WebSocket)
{ "type": "ws-ide", "url": "...", /* IDE-specific config */ }
```

---

## MCP Tool Timeout Configuration

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `MCP_TOOL_TIMEOUT` | 100,000,000 ms (~27 hours) | Individual tool call timeout |
| `MCP_TIMEOUT` | 30,000 ms (30 seconds) | Server connection timeout |
| `MCP_SERVER_CONNECTION_BATCH_SIZE` | 3 | Concurrent connections during batch connect |

### getMCPToolTimeout (MY5)

**Location:** `chunks.101.mjs:2271-2273`

```javascript
// ============================================
// getMCPToolTimeout - Tool execution timeout
// Location: chunks.101.mjs:2271-2273
// ============================================

// ORIGINAL (for source lookup):
function MY5() {
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || 1e8
}

// READABLE (for understanding):
function getMCPToolTimeout() {
  // Default: 100,000,000 ms (approximately 27 hours - effectively unlimited)
  return parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10) || 100000000
}

// Mapping: MY5→getMCPToolTimeout
```

**Key insight:** The default timeout is effectively unlimited (27+ hours), allowing long-running tools like data processing or complex queries to complete without interruption.

### getMCPConnectionTimeout (z21)

**Location:** `chunks.101.mjs:2275-2277`

```javascript
// ============================================
// getMCPConnectionTimeout - Server connection timeout
// Location: chunks.101.mjs:2275-2277
// ============================================

// ORIGINAL (for source lookup):
function z21() {
  return parseInt(process.env.MCP_TIMEOUT || "", 10) || 30000
}

// READABLE (for understanding):
function getMCPConnectionTimeout() {
  // Default: 30,000 ms (30 seconds)
  return parseInt(process.env.MCP_TIMEOUT || "", 10) || 30000
}

// Mapping: z21→getMCPConnectionTimeout
```

### Connection Timeout Implementation

**Location:** `chunks.101.mjs:2847-2862`

```javascript
// ============================================
// Connection with Timeout - Promise.race pattern
// Location: chunks.101.mjs:2847-2862
// ============================================

// ORIGINAL (for source lookup):
let J = Y.connect(Z),
  W = new Promise((w, N) => {
    let R = setTimeout(() => {
      let T = Date.now() - G;
      y0(A, `Connection timeout triggered after ${T}ms (limit: ${z21()}ms)`);
      N(Error(`Connection to MCP server "${A}" timed out after ${z21()}ms`))
    }, z21());
    J.then(() => clearTimeout(R), () => clearTimeout(R))
  });
try {
  await Promise.race([J, W]);
  let w = Date.now() - G;
  y0(A, `Successfully connected to ${Q.type} server in ${w}ms`)

// READABLE (for understanding):
let connectPromise = mcpClient.connect(transport),
  timeoutPromise = new Promise((resolve, reject) => {
    let timeoutHandle = setTimeout(() => {
      let elapsedMs = Date.now() - connectionStartTime;
      logMcpDebug(serverName, `Connection timeout triggered after ${elapsedMs}ms (limit: ${getMCPConnectionTimeout()}ms)`);
      reject(Error(`Connection to MCP server "${serverName}" timed out after ${getMCPConnectionTimeout()}ms`))
    }, getMCPConnectionTimeout());

    // Clean up timeout on success or failure
    connectPromise.then(
      () => clearTimeout(timeoutHandle),
      () => clearTimeout(timeoutHandle)
    )
  });

try {
  // Race: connection vs timeout
  await Promise.race([connectPromise, timeoutPromise]);

  let elapsedMs = Date.now() - connectionStartTime;
  logMcpDebug(serverName, `Successfully connected to ${transportType} server in ${elapsedMs}ms`)
```

**Key Decision: Promise.race() for Timeout**

**How it works:**
1. Create actual connection promise
2. Create timeout promise that rejects after `z21()` ms
3. Race both with `Promise.race()`
4. First to complete wins (connection or timeout)
5. Cleanup timeout handle regardless of outcome

**Why this approach:**
- Native Promise pattern, no external dependencies
- Automatic cleanup prevents memory leaks
- Detailed logging for debugging connection issues

---

## MCP Tool Calling & Progress Monitoring

### callMcpTool (y32)

**Location:** `chunks.101.mjs:2523-2568`

**What it does:** Executes an MCP tool call with timeout, progress monitoring, and error handling.

```javascript
// ============================================
// callMcpTool - Main MCP tool invocation
// Location: chunks.101.mjs:2523-2568
// ============================================

// ORIGINAL (for source lookup):
async function y32({
  client: { client: A, name: Q },
  tool: B,
  args: G,
  meta: Z,
  signal: I
}) {
  let Y = Date.now(), J;
  try {
    y0(Q, `Calling MCP tool: ${B}`);
    J = setInterval(() => {
      let F = Date.now() - Y,
        D = `${Math.floor(F / 1000)}s`;
      y0(Q, `Tool '${B}' still running (${D} elapsed)`)
    }, 30000);
    let W = await A.callTool({
      name: B, arguments: G, _meta: Z
    }, aT, {
      signal: I, timeout: MY5()
    });
    if ("isError" in W && W.isError) {
      let F = "Unknown error";
      if ("content" in W && Array.isArray(W.content) && W.content.length > 0) {
        let K = W.content[0];
        if (K && typeof K === "object" && "text" in K) F = K.text
      } else if ("error" in W) F = String(W.error);
      throw WI(Q, F), Error(F)
    }
    let X = Date.now() - Y,
      V = X < 1000 ? `${X}ms` : X < 60000 ? `${Math.floor(X / 1000)}s` : `${Math.floor(X / 60000)}m ${Math.floor(X % 60000 / 1000)}s`;
    return y0(Q, `Tool '${B}' completed successfully in ${V}`), await jY5(W, B, Q)
  } catch (W) {
    if (J !== void 0) clearInterval(J);
    let X = Date.now() - Y;
    if (W instanceof Error && W.name !== "AbortError")
      y0(Q, `Tool '${B}' failed after ${Math.floor(X / 1000)}s: ${W.message}`);
    if (!(W instanceof Error) || W.name !== "AbortError") throw W
  } finally {
    if (J !== void 0) clearInterval(J)
  }
}

// READABLE (for understanding):
async function callMcpTool({
  client: { client: mcpClient, name: serverName },
  tool: toolName,
  args: toolArguments,
  meta: metadata,
  signal: abortSignal
}) {
  let startTime = Date.now(), progressInterval;

  try {
    // Step 1: Log tool call initiation
    logMcpDebug(serverName, `Calling MCP tool: ${toolName}`);

    // Step 2: Setup progress monitoring (logs every 30 seconds)
    progressInterval = setInterval(() => {
      let elapsedMs = Date.now() - startTime,
        elapsedStr = `${Math.floor(elapsedMs / 1000)}s`;
      logMcpDebug(serverName, `Tool '${toolName}' still running (${elapsedStr} elapsed)`)
    }, 30000);  // 30 second interval

    // Step 3: Execute the tool call with timeout
    let toolResult = await mcpClient.callTool({
      name: toolName,
      arguments: toolArguments,
      _meta: metadata
    }, toolResultSchema, {
      signal: abortSignal,
      timeout: getMCPToolTimeout()  // Default: 100M ms
    });

    // Step 4: Check for error responses
    if ("isError" in toolResult && toolResult.isError) {
      let errorMessage = "Unknown error";
      // Extract error from content or error property
      if ("content" in toolResult && Array.isArray(toolResult.content) && toolResult.content.length > 0) {
        let firstContent = toolResult.content[0];
        if (firstContent && typeof firstContent === "object" && "text" in firstContent)
          errorMessage = firstContent.text
      } else if ("error" in toolResult)
        errorMessage = String(toolResult.error);

      throw logMcpError(serverName, errorMessage), Error(errorMessage)
    }

    // Step 5: Format duration for logging
    let totalTime = Date.now() - startTime,
      durationStr = totalTime < 1000 ? `${totalTime}ms` :
                    totalTime < 60000 ? `${Math.floor(totalTime / 1000)}s` :
                    `${Math.floor(totalTime / 60000)}m ${Math.floor(totalTime % 60000 / 1000)}s`;

    logMcpDebug(serverName, `Tool '${toolName}' completed successfully in ${durationStr}`);

    // Step 6: Process and return result (with truncation if needed)
    return await processMcpToolResult(toolResult, toolName, serverName);

  } catch (error) {
    // Clean up progress interval
    if (progressInterval !== undefined) clearInterval(progressInterval);

    let totalTime = Date.now() - startTime;

    // Log errors (except AbortError which is expected during cancellation)
    if (error instanceof Error && error.name !== "AbortError")
      logMcpDebug(serverName, `Tool '${toolName}' failed after ${Math.floor(totalTime / 1000)}s: ${error.message}`);

    // Re-throw unless it was an abort
    if (!(error instanceof Error) || error.name !== "AbortError") throw error;

  } finally {
    // Always clean up interval
    if (progressInterval !== undefined) clearInterval(progressInterval)
  }
}

// Mapping: y32→callMcpTool, A→mcpClient, Q→serverName, B→toolName
// G→toolArguments, Z→metadata, I→abortSignal, MY5()→getMCPToolTimeout
// aT→toolResultSchema, jY5→processMcpToolResult, y0→logMcpDebug, WI→logMcpError
```

**Key Decision: 30-Second Progress Logging**

**What it does:** Logs tool execution status every 30 seconds for long-running operations.

**How it works:**
1. Start a 30-second interval timer at tool call start
2. Each interval logs elapsed time
3. Timer is cleared on completion, error, or abort
4. `finally` block ensures cleanup even on exceptions

**Why this approach:**
- Prevents "silent hangs" - users see progress
- 30-second interval balances feedback with log volume
- Helps identify slow or stuck tools
- Non-blocking - doesn't affect tool execution

---

## MCP Tool Failure/Error Handling

### Error Detection Flow

```
Tool Result → Check isError flag → Extract message → Log & Throw
                  ↓
          [Error Sources]
          1. content[0].text (preferred)
          2. error property (fallback)
          3. "Unknown error" (default)
```

### Error Message Extraction Priority

1. **First content item's `text` property** - Standard MCP error format
2. **`error` property** in response - Alternative error location
3. **Default: "Unknown error"** - Fallback when no message found

### Connection Error Classification

**Location:** `chunks.101.mjs:2898-2910`

```javascript
// ============================================
// Connection Error Classification
// Location: chunks.101.mjs:2898-2910
// ============================================

// ORIGINAL (for source lookup):
Y.onerror = (w) => {
  let N = Date.now() - K;
  D = !0;
  let R = Q.type || "stdio";
  if (y0(A, `${R.toUpperCase()} connection dropped after ${Math.floor(N/1000)}s uptime`), w.message)
    if (w.message.includes("ECONNRESET")) y0(A, "Connection reset - server may have crashed or restarted");
    else if (w.message.includes("ETIMEDOUT")) y0(A, "Connection timeout - network issue or server unresponsive");
    else if (w.message.includes("ECONNREFUSED")) y0(A, "Connection refused - server may be down");
    else if (w.message.includes("EPIPE")) y0(A, "Broken pipe - server closed connection unexpectedly");
    else if (w.message.includes("EHOSTUNREACH")) y0(A, "Host unreachable - network connectivity issue");
    else if (w.message.includes("ESRCH")) y0(A, "Process not found - stdio server process terminated");
    else if (w.message.includes("spawn")) y0(A, "Failed to spawn process - check command and permissions");
    else y0(A, `Connection error: ${w.message}`)
}

// READABLE (for understanding):
transportClient.onerror = (error) => {
  let connectionUptimeMs = Date.now() - connectionEstablishmentTime;
  hasConnectionError = true;
  let transportType = transportConfig.type || "stdio";

  logMcpDebug(serverName, `${transportType.toUpperCase()} connection dropped after ${Math.floor(connectionUptimeMs/1000)}s uptime`);

  if (error.message) {
    // Classify error and provide user-friendly message
    if (error.message.includes("ECONNRESET"))
      logMcpDebug(serverName, "Connection reset - server may have crashed or restarted");
    else if (error.message.includes("ETIMEDOUT"))
      logMcpDebug(serverName, "Connection timeout - network issue or server unresponsive");
    else if (error.message.includes("ECONNREFUSED"))
      logMcpDebug(serverName, "Connection refused - server may be down");
    else if (error.message.includes("EPIPE"))
      logMcpDebug(serverName, "Broken pipe - server closed connection unexpectedly");
    else if (error.message.includes("EHOSTUNREACH"))
      logMcpDebug(serverName, "Host unreachable - network connectivity issue");
    else if (error.message.includes("ESRCH"))
      logMcpDebug(serverName, "Process not found - stdio server process terminated");
    else if (error.message.includes("spawn"))
      logMcpDebug(serverName, "Failed to spawn process - check command and permissions");
    else
      logMcpDebug(serverName, `Connection error: ${error.message}`);
  }
}
```

**Error Types and User-Friendly Messages:**

| Error Code | System Cause | User-Friendly Message |
|------------|--------------|----------------------|
| ECONNRESET | TCP connection reset | "Server may have crashed or restarted" |
| ETIMEDOUT | Network timeout | "Network issue or server unresponsive" |
| ECONNREFUSED | No listener on port | "Server may be down" |
| EPIPE | Write to closed socket | "Server closed connection unexpectedly" |
| EHOSTUNREACH | Network unreachable | "Network connectivity issue" |
| ESRCH | Process doesn't exist | "stdio server process terminated" |
| spawn | Can't start subprocess | "Check command and permissions" |

### Abort/Cancellation Handling

```javascript
// AbortError is silently suppressed (expected during user cancellation)
if (!(error instanceof Error) || error.name !== "AbortError") throw error;
```

**Why silently suppress AbortError:**
- User-initiated cancellation shouldn't show as error
- Tool was stopped intentionally, not due to failure
- Clean user experience when pressing Ctrl+C

---

## Large MCP Tool Result Handling

### Token Limits Configuration

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_MCP_OUTPUT_TOKENS` | 25,000 | Maximum output tokens (env: `MAX_MCP_OUTPUT_TOKENS`) |
| `IMAGE_TOKEN_COST` (VB2) | 1,600 | Estimated tokens per image |
| `THRESHOLD_MULTIPLIER` (o25) | 0.5 | Quick check threshold (50% of max) |

### Truncation Flow

```
Tool Result → jY5() → DB2() → $e1() → B95() → Q95()
                ↓        ↓         ↓         ↓         ↓
          IDE bypass  Check    2-tier    Truncate  Array
                     needed   threshold  + warn    truncate
```

### processMcpToolResult (jY5)

**Location:** `chunks.101.mjs:2515-2521`

```javascript
// ============================================
// processMcpToolResult - Entry point with IDE bypass
// Location: chunks.101.mjs:2515-2521
// ============================================

// ORIGINAL (for source lookup):
async function jY5(A, Q, B) {
  let { content: G } = await b10(A, Q, B);
  if (B !== "ide") return await DB2(G);
  return G
}

// READABLE (for understanding):
async function processMcpToolResult(toolResponse, toolName, clientName) {
  let { content: processedContent } = await processMcpResult(toolResponse, toolName, clientName);

  // IDE clients get full content (no truncation)
  if (clientName !== "ide") {
    return await limitToolResultSize(processedContent);
  }

  return processedContent;
}

// Mapping: jY5→processMcpToolResult, A→toolResponse, Q→toolName, B→clientName
// b10→processMcpResult, DB2→limitToolResultSize
```

**Key Decision: IDE Bypass**

**Why skip truncation for IDE clients:**
- IDEs have more display capacity than CLI
- IDE integrations may handle large content differently
- Preserves full context for IDE-specific processing

### exceedsTokenLimit ($e1)

**Location:** `chunks.94.mjs:341-356`

**What it does:** Implements two-tier threshold checking to efficiently determine if truncation is needed.

```javascript
// ============================================
// exceedsTokenLimit - Two-tier threshold check
// Location: chunks.94.mjs:341-356
// ============================================

// ORIGINAL (for source lookup):
async function $e1(A) {
  if (!A) return !1;
  if (Ue1(A) <= xQ1() * o25) return !1;
  try {
    let G = await bNA(typeof A === "string" ? [{
      role: "user", content: A
    }] : [{ role: "user", content: A }], []);
    return !!(G && G > xQ1())
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), !1
  }
}

// READABLE (for understanding):
async function exceedsTokenLimit(toolContent) {
  // Empty content never exceeds
  if (!toolContent) return false;

  // TIER 1: Quick approximate check (50% of limit)
  // If content is below 50% of limit, definitely fits - skip expensive API call
  let estimatedTokens = countApproxTokens(toolContent);
  if (estimatedTokens <= getMaxMcpOutputTokens() * 0.5) {
    return false;
  }

  // TIER 2: Precise check using API token counter
  try {
    let actualTokens = await countTokensAccurately(
      typeof toolContent === "string"
        ? [{ role: "user", content: toolContent }]
        : [{ role: "user", content: toolContent }],
      []  // no tools
    );

    return !!(actualTokens && actualTokens > getMaxMcpOutputTokens());
  } catch (error) {
    // On error, don't truncate (conservative approach)
    logError(error instanceof Error ? error : Error(String(error)));
    return false;
  }
}

// Mapping: $e1→exceedsTokenLimit, A→toolContent, Ue1→countApproxTokens
// xQ1→getMaxMcpOutputTokens, o25→THRESHOLD_MULTIPLIER (0.5), bNA→countTokensAccurately
```

**Key Decision: Two-Tier Threshold Check**

**How it works:**
1. **Tier 1 (Quick):** Approximate token count using character length / 4
2. **Threshold:** If below 50% of max, skip precise counting
3. **Tier 2 (Precise):** API-based token counting for edge cases
4. **Fallback:** On counting error, don't truncate (preserve data)

**Why this approach:**
- Saves expensive API calls for small results
- 50% buffer ensures safe margin for system messages
- Precise counting catches edge cases near limit
- Graceful degradation on API errors

**Algorithm Analysis:**

```
Token Estimation Formula: characters / 4 (rough approximation)

Threshold: 50% of MAX_MCP_OUTPUT_TOKENS (25,000 * 0.5 = 12,500 tokens)

Decision Tree:
┌──────────────────────────────────────────────────────────────┐
│ Tier 1: Quick Check (O(1) - no API call)                     │
│ ─────────────────────────────────────────────────────────────│
│ IF approxTokens <= 12,500 THEN return false (no truncation)  │
│ ELSE proceed to Tier 2                                       │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ Tier 2: Precise Check (API call)                             │
│ ─────────────────────────────────────────────────────────────│
│ actualTokens = await countTokensAccurately(content)          │
│ IF actualTokens > 25,000 THEN return true (need truncation)  │
│ ELSE return false                                            │
└──────────────────────────────────────────────────────────────┘
```

**Why 50% threshold:**
- Character-to-token ratio varies (code: ~1:3, prose: ~1:4, non-ASCII: ~1:2)
- 50% buffer accounts for worst-case estimation errors
- Ensures we never accidentally truncate content that fits
- Most tool results are well under 12,500 tokens, so API call is rare

**Performance impact:**
- Small results (< 50K chars): Single O(1) check, returns immediately
- Large results (> 50K chars): One API call for precise counting
- API call cost justified only for content near/over limit

### truncateResultWithWarning (B95)

**Location:** `chunks.94.mjs:358-370`

```javascript
// ============================================
// truncateResultWithWarning - Truncate and add warning
// Location: chunks.94.mjs:358-370
// ============================================

// ORIGINAL (for source lookup):
async function B95(A) {
  if (!A) return A;
  let Q = t25(), B = e25();
  if (typeof A === "string") return A95(A, Q) + B;
  else {
    let G = await Q95(A, Q);
    return G.push({ type: "text", text: B }), G
  }
}

// READABLE (for understanding):
async function truncateResultWithWarning(toolContent) {
  if (!toolContent) return toolContent;

  let truncationTokenLimit = getMaxTokensForTruncation();  // 25000 * 4 = 100000
  let warningMessage = getTruncationWarningMessage();

  if (typeof toolContent === "string") {
    // String: truncate then append warning
    return truncateStringToTokens(toolContent, truncationTokenLimit) + warningMessage;
  } else {
    // Array: truncate items then append warning as content block
    let truncatedArray = await truncateContentArrayToTokens(toolContent, truncationTokenLimit);
    truncatedArray.push({ type: "text", text: warningMessage });
    return truncatedArray;
  }
}

// Mapping: B95→truncateResultWithWarning, A→toolContent
// t25→getMaxTokensForTruncation (100000), e25→getTruncationWarningMessage
// A95→truncateStringToTokens, Q95→truncateContentArrayToTokens
```

### Truncation Warning Message

**Location:** `chunks.94.mjs:295-301`

```javascript
function getTruncationWarningMessage() {
  return `

[OUTPUT TRUNCATED - exceeded ${getMaxMcpOutputTokens()} token limit]

The tool output was truncated. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data. If pagination is not available, inform the user that you are working with truncated output and results may be incomplete.`;
}
```

**Why include guidance:**
- Informs AI model why content is incomplete
- Suggests pagination/filtering alternatives
- Instructs to communicate truncation to user

### truncateContentArrayToTokens (Q95)

**Location:** `chunks.94.mjs:308-339`

**What it does:** Progressively truncates content array items to fit within token budget.

```javascript
// ============================================
// truncateContentArrayToTokens - Progressive array truncation
// Location: chunks.94.mjs:308-339
// ============================================

// ORIGINAL (for source lookup):
async function Q95(A, Q) {
  let B = [], G = 0;
  for (let Z of A)
    if (FB2(Z)) {
      let I = Q - G;
      if (I <= 0) break;
      if (Z.text.length <= I) B.push(Z), G += Z.text.length;
      else {
        B.push({ type: "text", text: Z.text.slice(0, I) });
        break
      }
    } else if (KB2(Z)) {
      let I = VB2 * 4;
      if (G + I <= Q) B.push(Z), G += I;
      else {
        let Y = Q - G;
        if (Y > 0) {
          let J = Math.floor(Y * 0.75);
          try {
            let W = await KMB(Z, J);
            if (B.push(W), W.source.type === "base64") G += W.source.data.length;
            else G += I
          } catch {}
        }
      }
    } else B.push(Z);
  return B
}

// READABLE (for understanding):
async function truncateContentArrayToTokens(contentArray, tokenLimit) {
  let truncatedContent = [];
  let currentTokenCount = 0;

  for (let item of contentArray) {
    // Handle TEXT content
    if (isTextContent(item)) {
      let remainingTokens = tokenLimit - currentTokenCount;

      if (remainingTokens <= 0) break;  // Hit limit

      if (item.text.length <= remainingTokens) {
        // Full text fits
        truncatedContent.push(item);
        currentTokenCount += item.text.length;
      } else {
        // Partial text - truncate and stop
        truncatedContent.push({
          type: "text",
          text: item.text.slice(0, remainingTokens)
        });
        break;
      }
    }
    // Handle IMAGE content
    else if (isImageContent(item)) {
      let imageTokenCost = IMAGE_TOKEN_COST * 4;  // 1600 * 4 = 6400

      if (currentTokenCount + imageTokenCost <= tokenLimit) {
        // Full image fits
        truncatedContent.push(item);
        currentTokenCount += imageTokenCost;
      } else {
        // Try to resize image to fit remaining space
        let remainingTokens = tokenLimit - currentTokenCount;
        if (remainingTokens > 0) {
          let maxImageBytes = Math.floor(remainingTokens * 0.75);
          try {
            let resizedImage = await resizeImageToFitLimit(item, maxImageBytes);
            truncatedContent.push(resizedImage);
            if (resizedImage.source.type === "base64") {
              currentTokenCount += resizedImage.source.data.length;
            } else {
              currentTokenCount += imageTokenCost;
            }
          } catch {
            // Skip image if resize fails
          }
        }
      }
    }
    // Other content types pass through
    else {
      truncatedContent.push(item);
    }
  }

  return truncatedContent;
}

// Mapping: Q95→truncateContentArrayToTokens, A→contentArray, Q→tokenLimit
// FB2→isTextContent, KB2→isImageContent, VB2→IMAGE_TOKEN_COST (1600)
// KMB→resizeImageToFitLimit
```

**Key Decision: Per-Item Truncation Strategy**

**How it works:**
1. Iterate through content items
2. **Text:** Add if fits; truncate mid-item if partial; stop if none remains
3. **Images:** Cost = 1600×4 = 6400 tokens; add if fits; try resize if partial; skip if fails
4. **Other:** Pass through as-is

**Why this approach:**
- Preserves complete items when possible
- Text can be cut mid-content (still useful)
- Images are atomic - resize or skip (no partial images)
- Smart image resizing maximizes visual content

---

## Image Processing for MCP Results

### Image Size Limits

| Constant | Value | Purpose |
|----------|-------|---------|
| `DEFAULT_IMAGE_MAX_BYTES` ($$A) | 3,932,160 (3.75 MB) | Maximum image size |
| `IMAGE_TOKEN_COST` (VB2) | 1,600 | Estimated tokens per image |

### Supported Image Formats

```javascript
IMAGE_SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
])
```

### processImageForSize (rt)

**Location:** `chunks.70.mjs:1035-1069`

**What it does:** Resizes and optimizes images using progressive strategies to fit within size limits.

```javascript
// ============================================
// processImageForSize - Progressive image optimization
// Location: chunks.70.mjs:1035-1069
// ============================================

// ORIGINAL (for source lookup):
async function rt(A, Q = $$A, B) {
  let G = B?.split("/")[1] || "jpeg",
    Z = G === "jpg" ? "jpeg" : G;
  try {
    let I = await Promise.resolve().then(() => BA(psA(), 1)),
      Y = I.default || I,
      J = await Y(A).metadata(),
      W = J.format || Z,
      X = A.length,
      V = { imageBuffer: A, metadata: J, format: W, maxBytes: Q, originalSize: X, sharp: Y };
    if (X <= Q) return w$A(A, W, X);
    let F = await yz6(V);
    if (F) return F;
    if (W === "png") {
      let D = await vz6(V);
      if (D) return D
    }
    let K = await bz6(V, 50);
    if (K) return K;
    return await fz6(V)
  } catch (I) {
    return AA(I), { base64: A.toString("base64"), mediaType: `image/${Z}`, originalSize: A.length }
  }
}

// READABLE (for understanding):
async function processImageForSize(imageBuffer, maxBytes = DEFAULT_IMAGE_MAX_BYTES, mimeType) {
  // Normalize format
  let extractedFormat = mimeType?.split("/")[1] || "jpeg";
  let normalizedFormat = extractedFormat === "jpg" ? "jpeg" : extractedFormat;

  try {
    // Load sharp image library
    let sharpModule = await loadSharpModule();
    let sharp = sharpModule.default || sharpModule;

    // Get image metadata
    let metadata = await sharp(imageBuffer).metadata();
    let detectedFormat = metadata.format || normalizedFormat;
    let originalSize = imageBuffer.length;

    let processConfig = {
      imageBuffer, metadata, format: detectedFormat,
      maxBytes, originalSize, sharp
    };

    // If already small enough, return as-is
    if (originalSize <= maxBytes) {
      return encodeImageAsBase64(imageBuffer, detectedFormat, originalSize);
    }

    // STRATEGY 1: Multi-scale resizing (100%, 75%, 50%, 25%)
    let scaled = await multiScaleResizing(processConfig);
    if (scaled) return scaled;

    // STRATEGY 2: PNG-specific compression (64-color palette)
    if (detectedFormat === "png") {
      let pngOptimized = await pngCompressionOptimization(processConfig);
      if (pngOptimized) return pngOptimized;
    }

    // STRATEGY 3: JPEG quality 50 (600x600 max)
    let jpegQuality50 = await jpegQualityOptimization(processConfig, 50);
    if (jpegQuality50) return jpegQuality50;

    // STRATEGY 4: Aggressive JPEG (quality 20, 400x400)
    return await aggressiveJpegCompression(processConfig);

  } catch (error) {
    // Fallback: return original if processing fails
    logError(error);
    return {
      base64: imageBuffer.toString("base64"),
      mediaType: `image/${normalizedFormat}`,
      originalSize: imageBuffer.length
    }
  }
}

// Mapping: rt→processImageForSize, A→imageBuffer, Q→maxBytes, B→mimeType
// $$A→DEFAULT_IMAGE_MAX_BYTES, yz6→multiScaleResizing, vz6→pngCompressionOptimization
// bz6→jpegQualityOptimization, fz6→aggressiveJpegCompression
```

### Progressive Optimization Strategies

| Strategy | Function | Settings | When Used |
|----------|----------|----------|-----------|
| 1. Multi-scale | `yz6` | 100%, 75%, 50%, 25% | First attempt |
| 2. PNG compression | `vz6` | 64-color palette, 800x800 | PNG only |
| 3. JPEG quality 50 | `bz6` | Quality 50, 600x600 | If above fail |
| 4. Aggressive JPEG | `fz6` | Quality 20, 400x400 | Last resort |

### multiScaleResizing (yz6)

**Location:** `chunks.70.mjs:1101-1115`

```javascript
// ============================================
// multiScaleResizing - Try multiple resolution scales
// Location: chunks.70.mjs:1101-1115
// ============================================

// ORIGINAL (for source lookup):
async function yz6(A) {
  let Q = [1, 0.75, 0.5, 0.25];
  for (let B of Q) {
    let G = Math.round((A.metadata.width || 2000) * B),
      Z = Math.round((A.metadata.height || 2000) * B),
      I = A.sharp(A.imageBuffer).resize(G, Z, { fit: "inside", withoutEnlargement: !0 });
    I = xz6(I, A.format);
    let Y = await I.toBuffer();
    if (Y.length <= A.maxBytes) return w$A(Y, A.format, A.originalSize)
  }
  return null
}

// READABLE (for understanding):
async function multiScaleResizing(processConfig) {
  let scales = [1, 0.75, 0.5, 0.25];  // 100%, 75%, 50%, 25%

  for (let scale of scales) {
    let newWidth = Math.round((processConfig.metadata.width || 2000) * scale);
    let newHeight = Math.round((processConfig.metadata.height || 2000) * scale);

    let resizeOp = processConfig.sharp(processConfig.imageBuffer).resize(newWidth, newHeight, {
      fit: "inside",
      withoutEnlargement: true  // Don't enlarge small images
    });

    resizeOp = applyFormatSpecificEncoding(resizeOp, processConfig.format);

    let resizedBuffer = await resizeOp.toBuffer();

    if (resizedBuffer.length <= processConfig.maxBytes) {
      return encodeImageAsBase64(resizedBuffer, processConfig.format, processConfig.originalSize);
    }
  }

  return null;  // None of the scales worked
}

// Mapping: yz6→multiScaleResizing, A→processConfig, Q→scales
// xz6→applyFormatSpecificEncoding, w$A→encodeImageAsBase64
```

### Format-Specific Encoding (xz6)

**Location:** `chunks.70.mjs:1117-1136`

```javascript
// ============================================
// applyFormatSpecificEncoding - Format-specific compression
// Location: chunks.70.mjs:1117-1136
// ============================================

// ORIGINAL (for source lookup):
function xz6(A, Q) {
  switch (Q) {
    case "png": return A.png({ compressionLevel: 9, palette: !0 });
    case "jpeg":
    case "jpg": return A.jpeg({ quality: 80 });
    case "webp": return A.webp({ quality: 80 });
    default: return A
  }
}

// READABLE (for understanding):
function applyFormatSpecificEncoding(sharpInstance, format) {
  switch (format) {
    case "png":
      return sharpInstance.png({
        compressionLevel: 9,  // Maximum compression
        palette: true         // Use indexed color palette
      });
    case "jpeg":
    case "jpg":
      return sharpInstance.jpeg({ quality: 80 });
    case "webp":
      return sharpInstance.webp({ quality: 80 });
    default:
      return sharpInstance;
  }
}

// Mapping: xz6→applyFormatSpecificEncoding, A→sharpInstance, Q→format
```

---

## Dynamic Tool Naming

MCP tools are renamed to avoid conflicts between servers using a naming convention:

```javascript
// From chunks.158.mjs, line 1345:
let toolName = `mcp__${normalizeToolName(serverName)}__${normalizeToolName(originalToolName)}`;

// Example:
// Server: "github"
// Tool: "create-issue"
// Result: "mcp__github__create_issue"
```

### Tool Name Resolution

When calling a tool, Claude Code resolves the original tool name:

```javascript
let originalName = (() => {
  let prefixedName = `mcp__${normalizeToolName(serverName)}__${normalizeToolName(toolName)}`;
  return tools.find((tool) => tool.name === prefixedName)?.originalToolName || toolName;
})();
```

**Benefits:**
- Multiple MCP servers can have same-named tools
- Clear indication that a tool is from MCP
- Tracking which server provides which tool

---

## MCP Configuration Format

### Configuration Structure

```json
{
  "mcpServers": {
    "server-name": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-example"],
      "env": {
        "API_KEY": "your-key"
      }
    },
    "remote-server": {
      "type": "sse",
      "url": "https://mcp.example.com/sse",
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

### Configuration Files

| Scope | File Path |
|-------|-----------|
| User | `~/.config/claude/settings.json` |
| Project | `.mcp.json` (walks up directory tree) |
| Local | `.claude.local.json` |

### CLI Configuration Examples

```bash
# Add stdio server with environment variable
claude mcp add airtable --transport stdio \
  --env AIRTABLE_API_KEY=your-key \
  -- npx -y airtable-mcp-server

# Add SSE server with auth header
claude mcp add asana --transport sse \
  --header "Authorization: Bearer token" \
  https://mcp.asana.com/sse

# Add HTTP server
claude mcp add sentry --transport http \
  --header "X-API-Key: key" \
  https://mcp.sentry.dev/mcp

# Add from JSON string
claude mcp add-json custom '{"type":"stdio","command":"python","args":["-m","my_server"]}'

# Import from Claude Desktop
claude mcp add-from-claude-desktop
```

---

## Summary

Claude Code's MCP implementation provides:

1. **Multiple transports**: stdio, SSE, HTTP, IDE-specific
2. **Configuration scopes**: Enterprise → Local → Project → User → Dynamic
3. **Dynamic loading**: `--mcp-config` for runtime configuration
4. **Batch connection**: Concurrent server initialization with limits
5. **Progress monitoring**: 30-second logging for long-running tools
6. **Two-tier timeout**: 30s connection, ~unlimited tool execution
7. **Error classification**: User-friendly messages for connection errors
8. **Result truncation**: Two-tier threshold check with warning message
9. **Image optimization**: Progressive strategies (resize → compress → quality)
10. **Dynamic tool naming**: `mcp__server__tool` pattern prevents conflicts

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `MCP_TOOL_TIMEOUT` | 100,000,000 ms | Tool call timeout |
| `MCP_TIMEOUT` | 30,000 ms | Connection timeout |
| `MCP_SERVER_CONNECTION_BATCH_SIZE` | 3 | Concurrent connections |
| `MAX_MCP_OUTPUT_TOKENS` | 25,000 | Max result tokens |
