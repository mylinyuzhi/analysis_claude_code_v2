# LSP Integration - Configuration Analysis

## Overview

The LSP integration supports configuration via `.lsp.json` files, which can be placed in plugin directories or the workspace. This document covers the configuration schema, loading flow, and variable expansion.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `lspServerConfigSchema` (ew1) - Zod schema for server config
- `loadPluginLspConfig` (HvY) - Plugin config loader
- `expandLspConfigVars` (_vY) - Variable expansion
- `namespacePluginServers` (JvY) - Server name namespacing
- `loadLspConfigs` (dm4) - Aggregate config loader

---

## 1. Configuration Schema

### LSP Server Config Schema

```javascript
// ============================================
// ew1 - Zod schema for LSP server configuration
// Location: chunks.15.mjs:274-294
// ============================================

// ORIGINAL:
ew1 = u.strictObject({
    command: u.string().min(1).refine((A) => {
        if (A.includes(" ") && !A.startsWith("/")) return !1;
        return !0
    }, {
        message: "Command should not contain spaces. Use args array for arguments."
    }).describe('Command to execute the LSP server (e.g., "typescript-language-server")'),
    args: u.array(gw8).optional().describe("Command-line arguments to pass to the server"),
    extensionToLanguage: u.record(ZOK, gw8).refine((A) => Object.keys(A).length > 0, {
        message: "extensionToLanguage must have at least one mapping"
    }).describe("Mapping from file extension to LSP language ID. File extensions and languages are derived from this mapping."),
    transport: u.enum(["stdio", "socket"]).default("stdio").describe("Communication transport mechanism"),
    env: u.record(u.string(), u.string()).optional().describe("Environment variables to set when starting the server"),
    initializationOptions: u.unknown().optional().describe("Initialization options passed to the server during initialization"),
    settings: u.unknown().optional().describe("Settings passed to the server via workspace/didChangeConfiguration"),
    workspaceFolder: u.string().optional().describe("Workspace folder path to use for the server"),
    startupTimeout: u.number().int().positive().optional().describe("Maximum time to wait for server startup (milliseconds)"),
    shutdownTimeout: u.number().int().positive().optional().describe("Maximum time to wait for graceful shutdown (milliseconds)"),
    restartOnCrash: u.boolean().optional().describe("Whether to restart the server if it crashes"),
    maxRestarts: u.number().int().nonnegative().optional().describe("Maximum number of restart attempts before giving up")
})

// READABLE:
const lspServerConfigSchema = z.strictObject({
    // Required: Command to run the LSP server
    command: z.string()
        .min(1)
        .refine((cmd) => {
            // Reject commands with spaces unless they're absolute paths
            if (cmd.includes(" ") && !cmd.startsWith("/")) return false;
            return true;
        }, {
            message: "Command should not contain spaces. Use args array for arguments."
        })
        .describe('Command to execute the LSP server (e.g., "typescript-language-server")'),

    // Optional: Command-line arguments
    args: z.array(z.string().min(1)).optional()
        .describe("Command-line arguments to pass to the server"),

    // Required: File extension to language mapping
    extensionToLanguage: z.record(
        z.string().min(2).refine(ext => ext.startsWith("."), {
            message: 'File extensions must start with dot (e.g., ".ts", not "ts")'
        }),
        z.string().min(1)
    )
    .refine(mapping => Object.keys(mapping).length > 0, {
        message: "extensionToLanguage must have at least one mapping"
    })
    .describe("Mapping from file extension to LSP language ID"),

    // Optional: Transport mechanism (defaults to stdio)
    transport: z.enum(["stdio", "socket"]).default("stdio")
        .describe("Communication transport mechanism"),

    // Optional: Environment variables
    env: z.record(z.string(), z.string()).optional()
        .describe("Environment variables to set when starting the server"),

    // Optional: Server initialization options
    initializationOptions: z.unknown().optional()
        .describe("Initialization options passed to the server during initialization"),

    // Optional: Server settings
    settings: z.unknown().optional()
        .describe("Settings passed to the server via workspace/didChangeConfiguration"),

    // Optional: Workspace folder
    workspaceFolder: z.string().optional()
        .describe("Workspace folder path to use for the server"),

    // Optional: Timeout settings
    startupTimeout: z.number().int().positive().optional()
        .describe("Maximum time to wait for server startup (milliseconds)"),
    shutdownTimeout: z.number().int().positive().optional()
        .describe("Maximum time to wait for graceful shutdown (milliseconds)"),

    // Optional: Crash recovery (not yet implemented)
    restartOnCrash: z.boolean().optional()
        .describe("Whether to restart the server if it crashes"),
    maxRestarts: z.number().int().nonnegative().optional()
        .describe("Maximum number of restart attempts before giving up")
});

// Mapping: ew1→lspServerConfigSchema, u→z, ZOK→fileExtensionSchema, gw8→nonEmptyStringSchema
```

### Schema Constraints

| Field | Required | Default | Validation |
|-------|----------|---------|------------|
| `command` | Yes | - | No spaces (unless absolute path) |
| `args` | No | `[]` | Array of non-empty strings |
| `extensionToLanguage` | Yes | - | At least one mapping, extensions must start with `.` |
| `transport` | No | `"stdio"` | Either `"stdio"` or `"socket"` |
| `env` | No | - | String-to-string mapping |
| `workspaceFolder` | No | - | Any string path |

### Example Configuration

```json
{
  "typescript-language-server": {
    "command": "typescript-language-server",
    "args": ["--stdio"],
    "extensionToLanguage": {
      ".ts": "typescript",
      ".tsx": "typescriptreact",
      ".js": "javascript",
      ".jsx": "javascriptreact"
    },
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096"
    }
  },
  "gopls": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    },
    "initializationOptions": {
      "usePlaceholders": true
    }
  }
}
```

---

## 2. Configuration Loading Flow

### Plugin LSP Config Loading

```javascript
// ============================================
// HvY - Load LSP config from a single plugin
// Location: chunks.133.mjs:1980-2015
// ============================================

// ORIGINAL:
async function HvY(A, q = []) {
    let K = {}, Y = YvY(A.path, ".lsp.json");
    try {
        let z = await gm4(Y, "utf-8"),
            w = _A(z),
            H = u.record(u.string(), ew1).safeParse(w);
        if (H.success) Object.assign(K, H.data);
        else {
            let $ = `LSP config validation failed for .lsp.json in plugin ${A.name}: ${H.error.message}`;
            K1(Error($)), q.push({
                type: "lsp-config-invalid",
                plugin: A.name,
                serverName: ".lsp.json",
                validationError: H.error.message,
                source: "plugin"
            })
        }
    } catch (z) {
        if (z.code !== "ENOENT") {
            // ... error handling ...
        }
    }
    if (A.manifest.lspServers) {
        let z = await $vY(A.manifest.lspServers, A.path, A.name, q);
        if (z) Object.assign(K, z)
    }
    return Object.keys(K).length > 0 ? K : void 0
}

// READABLE:
async function loadPluginLspConfig(plugin, errors = []) {
    const configs = {};

    // 1. Try loading .lsp.json file
    const lspConfigPath = path.join(plugin.path, ".lsp.json");
    try {
        const content = await fs.readFile(lspConfigPath, "utf-8");
        const parsed = JSON.parse(content);
        const result = z.record(z.string(), lspServerConfigSchema).safeParse(parsed);

        if (result.success) {
            Object.assign(configs, result.data);
        } else {
            const message = `LSP config validation failed for .lsp.json in plugin ${plugin.name}: ${result.error.message}`;
            logError(Error(message));
            errors.push({
                type: "lsp-config-invalid",
                plugin: plugin.name,
                serverName: ".lsp.json",
                validationError: result.error.message,
                source: "plugin"
            });
        }
    } catch (error) {
        // ENOENT = file doesn't exist, that's OK
        if (error.code !== "ENOENT") {
            // Other errors should be reported
            errors.push({ /* ... */ });
        }
    }

    // 2. Try loading from manifest.lspServers field
    if (plugin.manifest.lspServers) {
        const manifestConfigs = await resolvePluginLspServersField(
            plugin.manifest.lspServers,
            plugin.path,
            plugin.name,
            errors
        );
        if (manifestConfigs) {
            Object.assign(configs, manifestConfigs);
        }
    }

    return Object.keys(configs).length > 0 ? configs : undefined;
}

// Mapping: HvY→loadPluginLspConfig, YvY→path.join, gm4→fs.readFile, _A→JSON.parse, $vY→resolvePluginLspServersField
```

### Configuration Loading Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    loadLspConfigs (dm4)                         │
│                    Aggregates all plugin configs                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                For each enabled plugin:                         │
│                                                                 │
│  loadSinglePluginLspConfig (Um4)                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  1. loadPluginLspConfig (HvY)                             │ │
│  │     ├── Read .lsp.json file                              │ │
│  │     ├── Parse and validate JSON                          │ │
│  │     └── Merge into configs object                        │ │
│  │                                                           │ │
│  │  2. Resolve manifest.lspServers field                    │ │
│  │     ├── String path → resolve and load file              │ │
│  │     ├── Array of paths → load each                       │ │
│  │     └── Object → inline config validation                │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  expandLspConfigVars (_vY)                                     │
│  ├── Expand ${CLAUDE_PLUGIN_ROOT}                             │
│  └── Expand environment variables                             │
│                              │                                  │
│                              ▼                                  │
│  namespacePluginServers (JvY)                                  │
│  └── Prefix: "plugin:{pluginName}:{serverName}"               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Final aggregated config:                        │
│                                                                 │
│  {                                                              │
│    "plugin:my-plugin:typescript-language-server": {            │
│      command: "...",                                           │
│      args: [...],                                              │
│      extensionToLanguage: {...},                               │
│      scope: "dynamic",                                         │
│      source: "my-plugin"                                       │
│    }                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Variable Expansion

### Plugin Root Variable

```javascript
// ============================================
// OvY - Expand ${CLAUDE_PLUGIN_ROOT} placeholder
// Location: chunks.133.mjs:2079-2081
// ============================================

// ORIGINAL:
function OvY(A, q) {
    return A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, q)
}

// READABLE:
function expandPluginRootVar(value, pluginRootPath) {
    return value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRootPath);
}

// Mapping: OvY→expandPluginRootVar
```

### Full Variable Expansion

```javascript
// ============================================
// _vY - Expand all variables in config
// Location: chunks.133.mjs:2083-2112
// ============================================

// ORIGINAL:
function _vY(A, q, K) {
    let Y = [],
        z = ($) => {
            let O = OvY($, q),
                {
                    expanded: _,
                    missingVars: J
                } = i01(O);
            return Y.push(...J), _
        },
        w = {
            ...A
        };
    if (w.command) w.command = z(w.command);
    if (w.args) w.args = w.args.map(($) => z($));
    let H = {
        CLAUDE_PLUGIN_ROOT: q,
        ...w.env || {}
    };
    for (let [$, O] of Object.entries(H))
        if ($ !== "CLAUDE_PLUGIN_ROOT") H[$] = z(O);
    if (w.env = H, w.workspaceFolder) w.workspaceFolder = z(w.workspaceFolder);
    if (Y.length > 0) {
        let O = `Missing environment variables in plugin LSP config: ${[...new Set(Y)].join(", ")}`;
        K1(Error(O)), h(O, {
            level: "warn"
        })
    }
    return w
}

// READABLE:
function expandLspConfigVars(config, pluginRootPath, errors) {
    const missingVars = [];

    const expandString = (value) => {
        // First expand plugin root
        const withPluginRoot = expandPluginRootVar(value, pluginRootPath);
        // Then expand environment variables
        const { expanded, missingVars: vars } = expandEnvVars(withPluginRoot);
        missingVars.push(...vars);
        return expanded;
    };

    const expanded = { ...config };

    // Expand command
    if (expanded.command) {
        expanded.command = expandString(expanded.command);
    }

    // Expand args
    if (expanded.args) {
        expanded.args = expanded.args.map(expandString);
    }

    // Expand environment variables (including CLAUDE_PLUGIN_ROOT)
    const env = {
        CLAUDE_PLUGIN_ROOT: pluginRootPath,
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

    // Report missing variables
    if (missingVars.length > 0) {
        const uniqueMissing = [...new Set(missingVars)];
        const message = `Missing environment variables in plugin LSP config: ${uniqueMissing.join(", ")}`;
        logError(Error(message));
        log(message, { level: "warn" });
    }

    return expanded;
}

// Mapping: _vY→expandLspConfigVars, OvY→expandPluginRootVar, i01→expandEnvVars
```

**Variable expansion order:**
1. `${CLAUDE_PLUGIN_ROOT}` → Plugin directory path
2. `${ENV_VAR}` → Value from process environment

**Example:**
```json
{
  "command": "${CLAUDE_PLUGIN_ROOT}/bin/my-lsp-server",
  "args": ["--config", "${MY_CONFIG_PATH}/config.json"],
  "env": {
    "LSP_WORKSPACE": "${CLAUDE_PLUGIN_ROOT}/workspace"
  }
}
```

After expansion (assuming plugin at `/home/user/plugins/my-plugin` and `MY_CONFIG_PATH=/etc/lsp`):
```json
{
  "command": "/home/user/plugins/my-plugin/bin/my-lsp-server",
  "args": ["--config", "/etc/lsp/config.json"],
  "env": {
    "LSP_WORKSPACE": "/home/user/plugins/my-plugin/workspace",
    "CLAUDE_PLUGIN_ROOT": "/home/user/plugins/my-plugin"
  }
}
```

---

## 4. Server Namespacing

```javascript
// ============================================
// JvY - Namespace server names by plugin
// Location: chunks.133.mjs:2114-2125
// ============================================

// ORIGINAL:
function JvY(A, q) {
    let K = {};
    for (let [Y, z] of Object.entries(A)) {
        let w = `plugin:${q}:${Y}`;
        K[w] = {
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
        const namespacedName = `plugin:${pluginName}:${serverName}`;
        namespaced[namespacedName] = {
            ...config,
            scope: "dynamic",  // Mark as plugin-provided (vs built-in)
            source: pluginName // Track origin for debugging
        };
    }
    return namespaced;
}

// Mapping: JvY→namespacePluginServers
```

**Why namespacing:**
- Prevents name collisions between plugins
- Allows multiple plugins to define servers with the same base name
- Enables tracking of server origin for debugging
- Format: `plugin:{pluginName}:{serverName}`

---

## 5. Path Traversal Protection

```javascript
// ============================================
// wvY - Validate plugin-relative paths
// Location: chunks.133.mjs:1972-1978
// ============================================

// ORIGINAL:
function wvY(A, q) {
    let K = VkA(A),
        Y = VkA(A, q),
        z = zvY(K, Y);
    if (z.startsWith("..") || VkA(z) === z) return null;
    return Y
}

// READABLE:
function safePluginRelativePath(pluginRoot, relativePath) {
    const absoluteRoot = path.resolve(pluginRoot);
    const targetPath = path.resolve(pluginRoot, relativePath);
    const relative = path.relative(absoluteRoot, targetPath);

    // Reject if path escapes plugin directory
    if (relative.startsWith("..") || path.resolve(relative) === relative) {
        return null;  // Path traversal detected
    }
    return targetPath;
}

// Mapping: wvY→safePluginRelativePath, VkA→path.resolve, zvY→path.relative
```

**Security insight:** This prevents malicious plugins from reading files outside their directory using relative paths like `../../../etc/passwd`.

---

## 6. Aggregate Configuration Loading

```javascript
// ============================================
// dm4 - Load all LSP configs from all plugins
// Location: chunks.133.mjs:2144-2163
// ============================================

// ORIGINAL:
async function dm4() {
    let A = {};
    try {
        let {
            enabled: q
        } = await iY();
        for (let K of q) {
            let Y = [],
                z = await Um4(K, Y);
            if (z && Object.keys(z).length > 0) Object.assign(A, z), h(`Loaded ${Object.keys(z).length} LSP server(s) from plugin: ${K.name}`);
            if (Y.length > 0) h(`${Y.length} error(s) loading LSP servers from plugin: ${K.name}`)
        }
        h(`Total LSP servers loaded: ${Object.keys(A).length}`)
    } catch (q) {
        K1(q instanceof Error ? q : Error(`Failed to load LSP servers: ${String(q)}`)), h(`Error loading LSP servers: ${q instanceof Error?q.message:String(q)}`)
    }
    return {
        servers: A
    }
}

// READABLE:
async function loadLspConfigs() {
    const allServers = {};

    try {
        const { enabled: plugins } = await getPluginState();

        for (const plugin of plugins) {
            const errors = [];
            const pluginConfigs = await loadSinglePluginLspConfig(plugin, errors);

            if (pluginConfigs && Object.keys(pluginConfigs).length > 0) {
                Object.assign(allServers, pluginConfigs);
                log(`Loaded ${Object.keys(pluginConfigs).length} LSP server(s) from plugin: ${plugin.name}`);
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

// Mapping: dm4→loadLspConfigs, iY→getPluginState, Um4→loadSinglePluginLspConfig
```

---

## Configuration Summary

| Stage | Function | Purpose |
|-------|----------|---------|
| Parse JSON | `JSON.parse` | Convert file content to object |
| Validate | `lspServerConfigSchema.safeParse` | Ensure config matches schema |
| Expand | `expandLspConfigVars` | Replace variable placeholders |
| Namespace | `namespacePluginServers` | Add plugin prefix to names |
| Aggregate | `loadLspConfigs` | Combine all plugin configs |

### Error Handling

| Error Type | Behavior |
|------------|----------|
| File not found (ENOENT) | Skip silently (optional file) |
| JSON parse error | Log and report to errors array |
| Schema validation error | Log and report to errors array |
| Missing env variable | Log warning, use empty string |
| Path traversal attempt | Reject path, log security warning |