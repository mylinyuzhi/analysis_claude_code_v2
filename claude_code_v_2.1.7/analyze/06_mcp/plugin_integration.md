# MCP-Plugin Integration

## Overview

Claude Code v2.1.7 supports a deep integration between the Plugin System and MCP. Plugins can provide MCP servers through multiple mechanisms, including inline definitions, configuration files, and MCPB bundles.

> Symbol mappings:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Table of Contents

1. [Plugin MCP Loading Flow](#plugin-mcp-loading-flow)
2. [MCP Configuration Sources](#mcp-configuration-sources)
3. [MCPB Bundle Format](#mcpb-bundle-format)
4. [Variable Substitution](#variable-substitution)
5. [Server Namespacing](#server-namespacing)
6. [Dynamic MCP Configuration](#dynamic-mcp-configuration)
7. [Auto-Loading Behavior](#auto-loading-behavior)

---

## Plugin MCP Loading Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Plugin MCP Loading Flow                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   cEA (loadAllMcpConfig)                                                    │
│       │                                                                     │
│       ▼                                                                     │
│   DG (discoverPluginsAndHooks)                                             │
│       │                                                                     │
│       ▼                                                                     │
│   For each enabled plugin:                                                  │
│       │                                                                     │
│       ▼                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │ To2 (getPluginMcpServers)                                           │  │
│   │                                                                     │  │
│   │   1. Check if plugin is enabled                                    │  │
│   │   2. Call aQ7() to unify MCP sources                               │  │
│   │   3. Apply variable substitution (sQ7)                             │  │
│   │   4. Add namespace prefix (oQ7)                                    │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│       │                                                                     │
│       ▼                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │ aQ7 (unifyMcpServerConfig)                                          │  │
│   │                                                                     │  │
│   │   Source 1: .mcp.json file in plugin directory                     │  │
│   │   Source 2: manifest.mcpServers (string path → rw0 or jo2)         │  │
│   │   Source 3: manifest.mcpServers (array of paths)                   │  │
│   │   Source 4: manifest.mcpServers (inline object)                    │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│       │                                                                     │
│       ▼                                                                     │
│   Merge: plugins → user → approved project → local                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## MCP Configuration Sources

### Source Priority (within plugin)

Plugins can provide MCP servers from multiple sources. They are merged in order:

| Priority | Source | Description |
|----------|--------|-------------|
| 1 | `.mcp.json` file | Always loaded if exists in plugin root |
| 2 | `manifest.mcpServers` | Additional servers from manifest |

### Manifest mcpServers Schema

**Location:** `chunks.90.mjs:1665`

```javascript
// ============================================
// U75 - mcpServersDefinitionSchema (Plugin manifest)
// Location: chunks.90.mjs:1665
// ============================================

U75 = z.object({
  mcpServers: z.union([
    // Option 1: Path to .mcp.json file
    ZVA.describe("Path to MCP servers configuration file"),

    // Option 2: Path/URL to MCPB file
    m62.describe("Path or URL to MCPB file"),

    // Option 3: Inline server definitions
    z.record(z.string(), Rb).describe("MCP server configurations keyed by server name"),

    // Option 4: Array of any above
    z.array(z.union([
      ZVA,  // .json path
      m62,  // .mcpb path/URL
      z.record(z.string(), Rb)  // inline
    ])).describe("Array of MCP server configurations")
  ])
})
```

### Example Plugin Manifest

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "mcpServers": {
    "my-server": {
      "type": "stdio",
      "command": "${CLAUDE_PLUGIN_ROOT}/bin/server",
      "args": ["--mode", "production"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

Or with file reference:

```json
{
  "name": "my-plugin",
  "mcpServers": "./servers.mcp.json"
}
```

Or with MCPB bundle:

```json
{
  "name": "my-plugin",
  "mcpServers": "https://example.com/servers.mcpb"
}
```

---

## MCPB Bundle Format

MCPB (MCP Bundle) is a packaged format for distributing MCP servers.

### File Extensions

| Extension | Description |
|-----------|-------------|
| `.mcpb` | Standard MCP bundle |
| `.dxt` | Alternative extension (same format) |

### MCPB Schema

**Location:** `chunks.90.mjs:1623-1627`

```javascript
// ============================================
// m62 - mcpbFileSchema
// Location: chunks.90.mjs:1623-1627
// ============================================

m62 = z.union([
  // Local path (relative to plugin root)
  z.string().startsWith("./").refine(
    (path) => path.endsWith(".mcpb") || path.endsWith(".dxt"),
    { message: "MCPB file path must end with .mcpb or .dxt" }
  ).describe("Path to MCPB file relative to plugin root"),

  // Remote URL
  z.string().url().refine(
    (url) => url.endsWith(".mcpb") || url.endsWith(".dxt"),
    { message: "MCPB URL must end with .mcpb or .dxt" }
  ).describe("URL to MCPB file")
])
```

### MCPB Loading Process

**Location:** `chunks.130.mjs`

```javascript
// ============================================
// jo2 - loadMcpbFile
// Location: chunks.130.mjs:1094-1160 (approximate)
// ============================================

// READABLE (key steps):
async function loadMcpbFile(plugin, mcpbPathOrUrl, errors) {
  // Step 1: Check if URL or local path
  if (isUrl(mcpbPathOrUrl)) {
    // Download MCPB from URL
    logDebug(`Downloading MCPB from ${mcpbPathOrUrl}`);
    let response = await fetchWithTimeout(mcpbPathOrUrl);
    // Save to cache directory
    await saveMcpbToCache(response, plugin.name);
  }

  // Step 2: Check cache validity
  let cacheDir = getMcpbCacheDir(plugin.path);
  if (isCacheValid(cacheDir, mcpbPathOrUrl)) {
    return loadFromCache(cacheDir);
  }

  // Step 3: Extract MCPB bundle
  // MCPB is a ZIP archive containing MCP server definitions
  await extractMcpb(mcpbPath, cacheDir);

  // Step 4: Load server configurations from extracted content
  return loadServersFromExtracted(cacheDir);
}
```

### MCPB Error Types

| Error Type | Description |
|------------|-------------|
| `mcpb-download-failed` | Failed to download from URL |
| `mcpb-extract-failed` | Failed to extract bundle |
| `mcpb-invalid-manifest` | Invalid manifest in bundle |

---

## Variable Substitution

### sQ7 - expandPluginMcpConfig

**Location:** `chunks.130.mjs:1464-1528`

```javascript
// ============================================
// sQ7 - expandPluginMcpConfig
// Location: chunks.130.mjs:1464-1528
// ============================================

// ORIGINAL:
function sQ7(A, Q, B, G, Z, Y) {
  let J = [],
    X = (D) => {
      let W = ifA(D, Q);  // Replace ${CLAUDE_PLUGIN_ROOT}
      if (B) W = rQ7(W, B);  // Replace ${user_config.xxx}
      let { expanded: K, missingVars: V } = BVA(W);  // Expand env vars
      return J.push(...V), K
    },
    I;
  // ... type-specific expansion
}

// READABLE:
function expandPluginMcpConfig(serverConfig, pluginRoot, userConfig, errors, pluginName, serverName) {
  let missingVars = [];

  // Variable expansion function
  const expand = (str) => {
    // Step 1: Replace ${CLAUDE_PLUGIN_ROOT}
    let result = str.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRoot);

    // Step 2: Replace ${user_config.xxx} if user config provided
    if (userConfig) {
      result = result.replace(/\$\{user_config\.([^}]+)\}/g, (_, key) => {
        let value = userConfig[key];
        if (value === undefined) {
          throw Error(`Missing required user configuration value: ${key}`);
        }
        return String(value);
      });
    }

    // Step 3: Expand environment variables
    let { expanded, missingVars: missing } = expandEnvVars(result);
    missingVars.push(...missing);
    return expanded;
  };

  // Apply expansion based on server type
  let expandedConfig;
  switch (serverConfig.type) {
    case undefined:
    case "stdio":
      expandedConfig = {
        ...serverConfig,
        command: expand(serverConfig.command),
        args: serverConfig.args?.map(expand),
        env: {
          CLAUDE_PLUGIN_ROOT: pluginRoot,  // Always inject
          ...Object.fromEntries(
            Object.entries(serverConfig.env || {})
              .filter(([k]) => k !== "CLAUDE_PLUGIN_ROOT")
              .map(([k, v]) => [k, expand(v)])
          )
        }
      };
      break;

    case "sse":
    case "http":
    case "ws":
      expandedConfig = {
        ...serverConfig,
        url: expand(serverConfig.url),
        headers: serverConfig.headers
          ? Object.fromEntries(
              Object.entries(serverConfig.headers).map(([k, v]) => [k, expand(v)])
            )
          : undefined
      };
      break;

    default:
      expandedConfig = serverConfig;
  }

  // Report missing environment variables
  if (errors && missingVars.length > 0) {
    let uniqueVars = [...new Set(missingVars)].join(", ");
    logWarning(`Missing environment variables in plugin MCP config: ${uniqueVars}`);
    errors.push({
      type: "mcp-config-invalid",
      source: `plugin:${pluginName}`,
      plugin: pluginName,
      serverName: serverName,
      validationError: `Missing environment variables: ${uniqueVars}`
    });
  }

  return expandedConfig;
}

// Mapping: sQ7→expandPluginMcpConfig, ifA→replacePluginRoot, rQ7→replaceUserConfig
// BVA→expandEnvVars
```

### Supported Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `${CLAUDE_PLUGIN_ROOT}` | `/path/to/plugin` | Plugin installation directory |
| `${user_config.xxx}` | User-provided value | User configuration from plugin settings |
| `${ENV_VAR}` | Environment value | Any environment variable |

---

## Server Namespacing

### oQ7 - addPluginNamespace

**Location:** `chunks.130.mjs:1440-1450`

```javascript
// ============================================
// oQ7 - addPluginNamespace
// Location: chunks.130.mjs:1440-1450
// ============================================

// ORIGINAL:
function oQ7(A, Q) {
  let B = {};
  for (let [G, Z] of Object.entries(A)) {
    let Y = `plugin:${Q}:${G}`;
    B[Y] = {
      ...Z,
      scope: "dynamic"
    }
  }
  return B
}

// READABLE:
function addPluginNamespace(serverConfigs, pluginName) {
  let namespacedServers = {};

  for (let [serverName, serverConfig] of Object.entries(serverConfigs)) {
    // Add plugin namespace prefix
    let namespacedName = `plugin:${pluginName}:${serverName}`;

    namespacedServers[namespacedName] = {
      ...serverConfig,
      scope: "dynamic"  // Mark as dynamically loaded
    };
  }

  return namespacedServers;
}

// Mapping: oQ7→addPluginNamespace
```

### Naming Convention

```
Plugin server: plugin:{pluginName}:{serverName}
Example:      plugin:my-plugin:my-server

Tool name:    mcp__plugin:my-plugin:my-server__{toolName}
Example:      mcp__plugin:my-plugin:my-server__list_files
```

---

## Dynamic MCP Configuration

### CLI Flag: `--mcp-config`

Dynamic MCP servers can be passed via CLI:

```bash
claude --mcp-config '{"my-server":{"type":"stdio","command":"my-cmd"}}'
```

### Flow in Application

**Location:** `chunks.157.mjs`, `chunks.138.mjs`

```javascript
// ============================================
// dynamicMcpConfig usage
// Location: chunks.157.mjs:605, chunks.138.mjs:644
// ============================================

// In CLI setup
let dynamicMcpConfig = parsedArgs.mcpConfig ? JSON.parse(parsedArgs.mcpConfig) : undefined;

// Passed to App component
<App
  dynamicMcpConfig={dynamicMcpConfig}
  // ...
/>

// In useManageMcpConnections hook
let allServers = {
  ...configuredServers,  // From loadAllMcpConfig
  ...dynamicMcpConfig    // From CLI flag (highest priority)
};
```

### Priority

Dynamic MCP config has **highest priority** and overrides all other sources:

```
1. dynamicMcpConfig (CLI --mcp-config) ← Highest
2. local settings
3. approved project settings
4. user settings
5. plugin servers ← Lowest
```

---

## Auto-Loading Behavior

### When Are Plugin MCP Servers Loaded?

1. **At Application Start**
   - `cEA()` is called during initialization
   - All enabled plugins are discovered via `DG()`
   - Plugin MCP servers are loaded via `To2()`

2. **When Plugin is Enabled**
   - Plugin system reloads all plugin components
   - MCP servers from newly enabled plugin become available

3. **On Plugin Update**
   - Updated plugin's MCP configuration is reloaded

### Conditional Loading

Plugin MCP servers are only loaded if:

1. Plugin is **enabled** (`plugin.enabled === true`)
2. Plugin has MCP configuration (`.mcp.json` or `manifest.mcpServers`)
3. Server configuration passes validation

```javascript
// Location: chunks.130.mjs:1530-1537

async function To2(plugin, errors = []) {
  // Only load if plugin is enabled
  if (!plugin.enabled) return;

  // Get unified MCP config
  let mcpServers = plugin.mcpServers || await aQ7(plugin, errors);
  if (!mcpServers) return;

  // Apply variable substitution and namespacing
  let expanded = {};
  for (let [name, config] of Object.entries(mcpServers)) {
    expanded[name] = expandPluginMcpConfig(config, plugin.path, undefined, errors, plugin.name, name);
  }

  return addPluginNamespace(expanded, plugin.name);
}
```

### Server Connection Timing

Plugin MCP servers are connected during the same batch initialization as all other servers:

```
Application Start
    │
    ├── loadAllMcpConfig() ─┐
    │                       │
    │   Enterprise config   │
    │   User config         ├── All MCP configs merged
    │   Project config      │
    │   Plugin configs  ────┘
    │
    └── batchInitializeAllServers()
            │
            ├── Connect plugin servers
            ├── Connect user servers
            └── Connect project servers
```

---

## Related Symbols

Key functions in this document:
- `getPluginMcpServers` (To2) - Load MCP from enabled plugin
- `unifyMcpServerConfig` (aQ7) - Combine plugin MCP sources
- `loadMcpJsonFile` (rw0) - Load .mcp.json file
- `loadMcpbFile` (jo2) - Download and extract MCPB
- `expandPluginMcpConfig` (sQ7) - Variable substitution
- `addPluginNamespace` (oQ7) - Add plugin: prefix
- `replacePluginRoot` (ifA) - Replace ${CLAUDE_PLUGIN_ROOT}
- `replaceUserConfig` (rQ7) - Replace ${user_config.xxx}

Constants/Schemas:
- `mcpServersDefinitionSchema` (U75) - Plugin manifest schema
- `mcpbFileSchema` (m62) - MCPB path/URL schema
- `serverConfigSchema` (Rb) - Individual server config

---

## See Also

- [protocol_overview.md](./protocol_overview.md) - MCP architecture
- [server_management.md](./server_management.md) - Server configuration details
- [../25_plugin/](../25_plugin/) - Plugin system documentation
