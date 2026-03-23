# LSP Configuration Deep Dive

> **Module**: LSP Integration
> **Version**: Claude Code 2.1.76
> **Source**: `chunks.138.mjs`

---

## Overview

LSP servers are configured through plugin-provided `.lsp.json` files or manifest entries. This document provides a detailed analysis of the configuration loading, validation, variable expansion, and namespacing systems.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `loadLspConfigs` (so4) - Aggregate all plugin LSP configs
- `loadPluginLspConfig` (Nl6) - Load from single plugin
- `resolvePluginLspServersField` (zyY) - Resolve manifest.lspServers
- `expandLspConfigVars` (_yY) - Variable expansion
- `namespacePluginServers` (wyY) - Server name namespacing
- `safePluginRelativePath` (YyY) - Path traversal protection

---

## Configuration Sources

### 1. Plugin `.lsp.json` File

A plugin can provide LSP configuration via a `.lsp.json` file in its root directory:

```
my-plugin/
├── manifest.json
├── .lsp.json          ← LSP server configurations
├── main.js
└── ...
```

### 2. Plugin `manifest.lspServers` Field

Alternatively (or additionally), LSP configs can be specified in the manifest:

```json
// manifest.json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "lspServers": {
    "my-custom-server": {
      "command": "${CLAUDE_PLUGIN_ROOT}/bin/server",
      "args": ["--stdio"],
      "extensionToLanguage": {
        ".myext": "mylang"
      }
    }
  }
}
```

The `lspServers` field can also be:
- A string path to an external config file
- An array of mixed strings and objects

---

## Configuration Schema

### Zod Schema Definition

```javascript
// ============================================
// LSP Server Configuration Schema
// Location: chunks.138.mjs (referenced as DJ6)
// ============================================

// READABLE:
const lspServerConfigSchema = z.object({
    // Required
    command: z.string()
        .refine(val => !val.includes(' ') || val.startsWith('/'), {
            message: "Command should not contain spaces unless it's an absolute path"
        })
        .describe("The command to run the LSP server"),

    extensionToLanguage: z.record(z.string(), z.string())
        .refine(obj => Object.keys(obj).length > 0, {
            message: "At least one extension mapping is required"
        })
        .refine(obj => Object.keys(obj).every(ext => ext.startsWith('.')), {
            message: "Extensions must start with '.'"
        })
        .describe("Map of file extensions to language IDs"),

    // Optional
    args: z.array(z.string()).optional().default([]),
    env: z.record(z.string(), z.string()).optional(),
    workspaceFolder: z.string().optional(),
    initializationOptions: z.any().optional(),
    settings: z.any().optional(),

    // Timeout configuration
    startupTimeout: z.number().int().positive().optional()
        .describe("Milliseconds to wait for server startup"),
    shutdownTimeout: z.number().int().positive().optional()
        .describe("Milliseconds to wait for graceful shutdown"),

    // Restart configuration (not yet implemented)
    restartOnCrash: z.boolean().optional(),
    maxRestarts: z.number().int().nonnegative().optional()
});

// Mapping: DJ6→lspServerConfigSchema
```

### Schema Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `command` | Yes | string | Executable command to run server |
| `args` | No | string[] | Command-line arguments |
| `extensionToLanguage` | Yes | Record<string, string> | File extension → language ID mapping |
| `env` | No | Record<string, string> | Environment variables |
| `workspaceFolder` | No | string | Root folder for the server |
| `initializationOptions` | No | any | LSP initialization options |
| `settings` | No | any | Server-specific settings |
| `startupTimeout` | No | number | Startup timeout in ms |
| `shutdownTimeout` | No | number | Shutdown timeout in ms (not implemented) |
| `restartOnCrash` | No | boolean | Auto-restart on crash (not implemented) |
| `maxRestarts` | No | number | Max restart attempts (not implemented) |

---

## Configuration Loading Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  CONFIGURATION LOADING FLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   loadLspConfigs (so4) called                                   │
│          │                                                       │
│          ▼                                                       │
│   ┌──────────────────────┐                                       │
│   │ Get enabled plugins  │                                       │
│   │ from plugin state    │                                       │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │ For each plugin (in parallel):                           │  │
│   │                                                          │  │
│   │   loadSinglePluginLspConfig (ao4)                        │  │
│   │          │                                               │  │
│   │          ├─► Try loadPluginLspConfig (Nl6)               │  │
│   │          │      │                                        │  │
│   │          │      ├─► Read .lsp.json                       │  │
│   │          │      │      │                                 │  │
│   │          │      │      ├─► Parse JSON                    │  │
│   │          │      │      │                                 │  │
│   │          │      │      └─► Validate with Zod             │  │
│   │          │      │                                        │  │
│   │          │      └─► Try manifest.lspServers (zyY)        │  │
│   │          │             │                                 │  │
│   │          │             ├─► String? Load file safely     │  │
│   │          │             ├─► Array? Process each           │  │
│   │          │             └─► Object? Validate inline       │  │
│   │          │                                               │  │
│   │          └─► expandLspConfigVars (_yY) for each server   │  │
│   │                   │                                      │  │
│   │                   ├─► Expand ${CLAUDE_PLUGIN_ROOT}       │  │
│   │                   ├─► Expand ${WORKSPACE_FOLDER}         │  │
│   │                   └─► Expand ${ENV_VAR}                  │  │
│   │                                                          │  │
│   │   namespacePluginServers (wyY)                           │  │
│   │          │                                               │  │
│   │          └─► Prefix: "plugin:{name}:{server}"            │  │
│   │                                                          │  │
│   └──────────────────────────────────────────────────────────┘  │
│              │                                                   │
│              ▼                                                   │
│   ┌──────────────────────┐                                       │
│   │ Merge all configs    │                                       │
│   │ into single object   │                                       │
│   └──────────┬───────────┘                                       │
│              │                                                   │
│              ▼                                                   │
│   Return { servers: { ... } }                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Path Traversal Protection

### Security Function

```javascript
// ============================================
// safePluginRelativePath - Validate plugin-relative paths
// Location: chunks.138.mjs:585-591
// ============================================

// ORIGINAL:
function YyY(A, q) {
    let K = Um8(A),
        Y = Um8(A, q),
        z = KyY(K, Y);
    if (z.startsWith("..") || Um8(z) === z) return null;
    return Y
}

// READABLE:
function safePluginRelativePath(pluginRoot, relativePath) {
    // Resolve both paths to absolute
    const absoluteRoot = path.resolve(pluginRoot);
    const targetPath = path.resolve(pluginRoot, relativePath);

    // Compute relative path from root to target
    const relative = path.relative(absoluteRoot, targetPath);

    // Reject if path escapes plugin directory
    if (relative.startsWith("..") || path.resolve(relative) === relative) {
        return null;  // Path traversal detected
    }

    return targetPath;
}

// Mapping: YyY→safePluginRelativePath, Um8→path.resolve, KyY→path.relative
```

### Attack Scenarios Prevented

| Malicious Path | Resolution | Detection |
|----------------|------------|-----------|
| `../../../etc/passwd` | `/etc/passwd` | `relative.startsWith("..")` |
| `../other-plugin/config` | `/plugins/other-plugin/config` | `relative.startsWith("..")` |
| `/absolute/path` | `/absolute/path` | `path.resolve(relative) === relative` |
| `./subdir/../../../etc` | `/etc` | `relative.startsWith("..")` |

### Error Handling

```javascript
// When path traversal detected:
const message = `Security: Path traversal attempt blocked in plugin ${pluginName}: ${maliciousPath}`;
logError(Error(message));
log(message, { level: "warn" });
errors.push({
    type: "lsp-config-invalid",
    plugin: pluginName,
    serverName: maliciousPath,
    validationError: "Invalid path: must be relative and within plugin directory",
    source: "plugin"
});
```

---

## Variable Expansion

### Expansion Algorithm

```javascript
// ============================================
// expandLspConfigVars - Expand all variables in config
// Location: chunks.138.mjs:692-722
// ============================================

// ORIGINAL:
function _yY(A, q, K, Y) {
    let z = [],
        _ = ($) => {
            let H = ZL($, q);
            if (K) H = zz1(H, K);
            let { expanded: j, missingVars: J } = _Z6(H);
            return z.push(...J), j
        },
        w = { ...A };
    if (w.command) w.command = _(w.command);
    if (w.args) w.args = w.args.map(($) => _($));
    let O = {
        CLAUDE_PLUGIN_ROOT: q,
        ...w.env || {}
    };
    for (let [$, H] of Object.entries(O))
        if ($ !== "CLAUDE_PLUGIN_ROOT") O[$] = _(H);
    if (w.env = O, w.workspaceFolder) w.workspaceFolder = _(w.workspaceFolder);
    if (z.length > 0) {
        let H = `Missing environment variables in plugin LSP config: ${[...new Set(z)].join(", ")}`;
        _6(Error(H)), k(H, { level: "warn" })
    }
    return w
}

// READABLE:
function expandLspConfigVars(config, pluginRootPath, workspaceFolder, errors) {
    const missingVars = [];

    // Helper to expand all variables in a string
    const expandString = (value) => {
        // Step 1: Expand ${CLAUDE_PLUGIN_ROOT}
        let expanded = value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRootPath);

        // Step 2: Expand ${WORKSPACE_FOLDER} if provided
        if (workspaceFolder) {
            expanded = expanded.replace(/\$\{WORKSPACE_FOLDER\}/g, workspaceFolder);
        }

        // Step 3: Expand ${ENV_VAR} from process environment
        const { expanded: result, missingVars: vars } = expandEnvVars(expanded);
        missingVars.push(...vars);

        return result;
    };

    // Create a copy to expand
    const expanded = { ...config };

    // Expand command
    if (expanded.command) {
        expanded.command = expandString(expanded.command);
    }

    // Expand args
    if (expanded.args) {
        expanded.args = expanded.args.map(expandString);
    }

    // Expand environment variables
    const env = {
        CLAUDE_PLUGIN_ROOT: pluginRootPath,  // Always available
        ...expanded.env || {}
    };

    for (const [key, value] of Object.entries(env)) {
        if (key !== "CLAUDE_PLUGIN_ROOT") {
            env[key] = expandString(value);
        }
    }
    expanded.env = env;

    // Expand workspaceFolder
    if (expanded.workspaceFolder) {
        expanded.workspaceFolder = expandString(expanded.workspaceFolder);
    }

    // Report missing environment variables
    if (missingVars.length > 0) {
        const uniqueMissing = [...new Set(missingVars)];
        const message = `Missing environment variables in plugin LSP config: ${uniqueMissing.join(", ")}`;
        logError(Error(message));
        log(message, { level: "warn" });
    }

    return expanded;
}

// Mapping: _yY→expandLspConfigVars, ZL→expandPluginRootVar, zz1→expandWorkspaceFolderVar, _Z6→expandEnvVars
```

### Variable Types

| Variable | Source | Example Value |
|----------|--------|---------------|
| `${CLAUDE_PLUGIN_ROOT}` | Plugin directory | `/plugins/my-plugin` |
| `${WORKSPACE_FOLDER}` | Current workspace | `/home/user/project` |
| `${HOME}` | Environment variable | `/home/user` |
| `${PATH}` | Environment variable | `/usr/bin:/bin` |
| `${MY_CUSTOM_VAR}` | Environment variable | User-defined |

### Example Expansion

**Input configuration:**
```json
{
  "command": "${CLAUDE_PLUGIN_ROOT}/bin/my-server",
  "args": ["--config", "${HOME}/.config/my-server/config.json"],
  "env": {
    "SERVER_ROOT": "${CLAUDE_PLUGIN_ROOT}",
    "PROJECT_ROOT": "${WORKSPACE_FOLDER}"
  }
}
```

**After expansion (with plugin at `/plugins/my-plugin` and workspace at `/home/user/project`):**
```json
{
  "command": "/plugins/my-plugin/bin/my-server",
  "args": ["--config", "/home/user/.config/my-server/config.json"],
  "env": {
    "SERVER_ROOT": "/plugins/my-plugin",
    "PROJECT_ROOT": "/home/user/project",
    "CLAUDE_PLUGIN_ROOT": "/plugins/my-plugin"
  }
}
```

---

## Server Namespacing

### Why Namespacing?

Multiple plugins might define servers with the same base name. Namespacing prevents collisions and tracks server origins.

### Implementation

```javascript
// ============================================
// namespacePluginServers - Add plugin prefix to server names
// Location: chunks.138.mjs:724-735
// ============================================

// ORIGINAL:
function wyY(A, q) {
    let K = {};
    for (let [Y, z] of Object.entries(A)) {
        let _ = `plugin:${q}:${Y}`;
        K[_] = {
            ...z,
            scope: "dynamic",
            source: q
        }
    }
    return K
}

// READABLE:
function namespacePluginServers(configs, pluginName) {
    const namespaced = {};

    for (const [serverName, config] of Object.entries(configs)) {
        // Create namespaced name: plugin:{pluginName}:{serverName}
        const namespacedName = `plugin:${pluginName}:${serverName}`;

        namespaced[namespacedName] = {
            ...config,
            scope: "dynamic",    // Mark as plugin-provided (vs built-in)
            source: pluginName   // Track origin for debugging
        };
    }

    return namespaced;
}

// Mapping: wyY→namespacePluginServers
```

### Example

**Plugin:** `my-typescript-plugin`

**Input config:**
```json
{
  "typescript-language-server": {
    "command": "typescript-language-server",
    "args": ["--stdio"],
    "extensionToLanguage": {
      ".ts": "typescript"
    }
  }
}
```

**After namespacing:**
```json
{
  "plugin:my-typescript-plugin:typescript-language-server": {
    "command": "typescript-language-server",
    "args": ["--stdio"],
    "extensionToLanguage": {
      ".ts": "typescript"
    },
    "scope": "dynamic",
    "source": "my-typescript-plugin"
  }
}
```

### Scope Field

| Value | Meaning |
|-------|---------|
| `"dynamic"` | Plugin-provided, can be reloaded |
| `"static"` | Built-in, not reloadable |

---

## Aggregate Configuration Loading

### Implementation

```javascript
// ============================================
// loadLspConfigs - Load all plugin LSP configs
// Location: chunks.138.mjs:756-796
// ============================================

// ORIGINAL:
async function so4() {
    let A = {};
    try {
        let { enabled: q } = await _z(),
            K = await Promise.all(q.map(async (Y) => {
                let z = [];
                return {
                    plugin: Y,
                    configs: await ao4(Y, z),
                    errors: z
                }
            }));
        for (let { plugin: Y, configs: z, errors: _ } of K)
            if (z && Object.keys(z).length > 0 && (Object.assign(A, z), k(`Loaded ${Object.keys(z).length} LSP server(s) from plugin: ${Y.name}`)), _.length > 0) k(`${_.length} error(s) loading LSP servers from plugin: ${Y.name}`);
        k(`Total LSP servers loaded: ${Object.keys(A).length}`)
    } catch (q) {
        _6(q instanceof Error ? q : Error(`Failed to load LSP servers: ${String(q)}`)), k(`Error loading LSP servers: ${q instanceof Error?q.message:String(q)}`)
    }
    return { servers: A }
}

// READABLE:
async function loadLspConfigs() {
    const allServers = {};

    try {
        // Get all enabled plugins
        const { enabled: plugins } = await getPluginState();  // _z

        // Load configs from all plugins in parallel
        const results = await Promise.all(plugins.map(async (plugin) => {
            const errors = [];
            const pluginConfigs = await loadSinglePluginLspConfig(plugin, errors);  // ao4
            return { plugin, configs: pluginConfigs, errors };
        }));

        // Merge results
        for (const { plugin, configs, errors } of results) {
            if (configs && Object.keys(configs).length > 0) {
                Object.assign(allServers, configs);
                log(`Loaded ${Object.keys(configs).length} LSP server(s) from plugin: ${plugin.name}`);
            }
            if (errors.length > 0) {
                log(`${errors.length} error(s) loading LSP servers from plugin: ${plugin.name}`);
            }
        }

        log(`Total LSP servers loaded: ${Object.keys(allServers).length}`);

    } catch (error) {
        logError(error instanceof Error ? error : Error(`Failed to load LSP servers: ${String(error)}`));
        log(`Error loading LSP servers: ${error.message}`);
    }

    return { servers: allServers };
}

// Mapping: so4→loadLspConfigs, _z→getPluginState, ao4→loadSinglePluginLspConfig
```

### Error Collection Pattern

Errors are collected in an array rather than thrown immediately:

```javascript
const errors = [];
const configs = await loadPluginLspConfig(plugin, errors);
// Errors are accumulated in `errors` array
// Processing continues even with errors
```

**Why this pattern:**
- Allows processing to continue with partial success
- Collects all validation issues in one pass
- User can see all problems at once
- Some plugins may succeed while others fail

---

## Error Types

| Error Type | When Occurs | Example |
|------------|-------------|---------|
| `lsp-config-invalid` | Zod validation fails | Missing `command` field |
| `lsp-config-path-traversal` | Path escapes plugin | `../../../etc/passwd` |
| `lsp-config-parse-error` | JSON parse fails | Invalid JSON syntax |
| `lsp-config-not-found` | File doesn't exist | Referenced file missing |

### Error Structure

```javascript
{
    type: "lsp-config-invalid",
    plugin: "my-plugin",
    serverName: "my-server",
    validationError: "Server my-server missing required 'command' field",
    source: "plugin"
}
```

---

## Configuration Example

### Complete Plugin LSP Configuration

**File structure:**
```
my-plugin/
├── manifest.json
├── .lsp.json
├── bin/
│   └── my-language-server
└── configs/
    └── server-config.json
```

**manifest.json:**
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "lspServers": [
    "configs/server-config.json",
    {
      "inline-server": {
        "command": "${CLAUDE_PLUGIN_ROOT}/bin/my-language-server",
        "args": ["--stdio"],
        "extensionToLanguage": {
          ".mylang": "mylang"
        }
      }
    }
  ]
}
```

**.lsp.json:**
```json
{
  "primary-server": {
    "command": "my-language-server",
    "args": ["--stdio", "--config", "${HOME}/.mylang/config.json"],
    "extensionToLanguage": {
      ".my": "mylang",
      ".myx": "mylangx"
    },
    "env": {
      "MYLANG_DEBUG": "1"
    },
    "startupTimeout": 10000
  }
}
```

**Result after loading:**
```json
{
  "plugin:my-plugin:primary-server": {
    "command": "my-language-server",
    "args": ["--stdio", "--config", "/home/user/.mylang/config.json"],
    "extensionToLanguage": {
      ".my": "mylang",
      ".myx": "mylangx"
    },
    "env": {
      "MYLANG_DEBUG": "1",
      "CLAUDE_PLUGIN_ROOT": "/plugins/my-plugin"
    },
    "startupTimeout": 10000,
    "scope": "dynamic",
    "source": "my-plugin"
  },
  "plugin:my-plugin:inline-server": {
    "command": "/plugins/my-plugin/bin/my-language-server",
    "args": ["--stdio"],
    "extensionToLanguage": {
      ".mylang": "mylang"
    },
    "scope": "dynamic",
    "source": "my-plugin"
  }
}
```

---

## Source Locations

| Function | Symbol | Location |
|----------|--------|----------|
| loadLspConfigs | so4 | chunks.138.mjs:756-796 |
| loadPluginLspConfig | Nl6 | chunks.138.mjs:593-628 |
| resolvePluginLspServersField | zyY | chunks.138.mjs:630-690 |
| expandLspConfigVars | _yY | chunks.138.mjs:692-722 |
| namespacePluginServers | wyY | chunks.138.mjs:724-735 |
| loadSinglePluginLspConfig | ao4 | chunks.138.mjs:737-745 |
| safePluginRelativePath | YyY | chunks.138.mjs:585-591 |
| lspServerConfigSchema | DJ6 | chunks.138.mjs (schema definition) |

---

**Last Updated**: 2026-03-23
**Version**: Claude Code 2.1.76
**Status**: Complete - All code verified against source