# LSP Integration - Configuration Analysis

## Overview

The LSP integration supports configuration via `.lsp.json` files, which can be placed in plugin directories or the workspace. This document covers the configuration schema, loading flow, and variable expansion.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integration infrastructure

Key functions in this document:
- `loadPluginLspConfig` (Nl6) - Plugin config loader
- `resolvePluginLspServersField` (zyY) - Resolve manifest.lspServers
- `expandLspConfigVars` (_yY) - Variable expansion
- `namespacePluginServers` (wyY) - Server name namespacing
- `safePluginRelativePath` (YyY) - Path traversal protection
- `loadLspConfigs` (so4) - Aggregate config loader

---

## 1. Configuration Loading Flow

### Plugin LSP Config Loading

```javascript
// ============================================
// loadPluginLspConfig - Load LSP config from a single plugin
// Location: chunks.138.mjs:593-628
// ============================================

// ORIGINAL:
async function Nl6(A, q = []) {
    let K = {},
        Y = qyY(A.path, ".lsp.json");
    try {
        let z = await oo4(Y, "utf-8"),
            _ = i1(z),
            w = u.record(u.string(), ew1).safeParse(_);
        if (w.success) Object.assign(K, w.data);
        else {
            let H = `LSP config validation failed for .lsp.json in plugin ${A.name}: ${w.error.message}`;
            _6(Error(H)), q.push({
                type: "lsp-config-invalid",
                plugin: A.name,
                serverName: ".lsp.json",
                validationError: w.error.message,
                source: "plugin"
            })
        }
    } catch (z) {
        if (z.code !== "ENOENT") {
            // ... error handling ...
        }
    }
    if (A.manifest.lspServers) {
        let z = await zyY(A.manifest.lspServers, A.path, A.name, q);
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

// Mapping: Nl6→loadPluginLspConfig, qyY→path.join, oo4→fs.readFile, i1→JSON.parse, zyY→resolvePluginLspServersField, ew1→lspServerConfigSchema
```

### Resolve manifest.lspServers Field

```javascript
// ============================================
// resolvePluginLspServersField - Resolve manifest.lspServers field
// Location: chunks.138.mjs:630-690
// ============================================

// ORIGINAL:
async function zyY(A, q, K, Y) {
    let z = {},
        _ = Array.isArray(A) ? A : [A];
    for (let w of _)
        if (typeof w === "string") {
            let O = YyY(q, w);
            if (!O) {
                let $ = `Security: Path traversal attempt blocked in plugin ${K}: ${w}`;
                _6(Error($)), k($, {
                    level: "warn"
                }), Y.push({
                    type: "lsp-config-path-traversal",
                    plugin: K,
                    path: w,
                    source: "plugin"
                });
                continue
            }
            // ... load config from path ...
        } else if (typeof w === "object") {
            // ... validate inline config ...
        }
    return Object.keys(z).length > 0 ? z : void 0
}

// READABLE:
async function resolvePluginLspServersField(lspServers, pluginPath, pluginName, errors) {
    const configs = {};
    const items = Array.isArray(lspServers) ? lspServers : [lspServers];

    for (const item of items) {
        if (typeof item === "string") {
            // String path: resolve and load file
            const safePath = safePluginRelativePath(pluginPath, item);
            if (!safePath) {
                const message = `Security: Path traversal attempt blocked in plugin ${pluginName}: ${item}`;
                logError(Error(message));
                log(message, { level: "warn" });
                errors.push({
                    type: "lsp-config-path-traversal",
                    plugin: pluginName,
                    path: item,
                    source: "plugin"
                });
                continue;
            }
            // Load config from safePath...
        } else if (typeof item === "object") {
            // Inline config: validate directly
            const result = lspServerConfigSchema.safeParse(item);
            // ...
        }
    }

    return Object.keys(configs).length > 0 ? configs : undefined;
}

// Mapping: zyY→resolvePluginLspServersField, YyY→safePluginRelativePath
```

### Configuration Loading Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                    loadLspConfigs (so4)                         │
│                    Aggregates all plugin configs                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                For each enabled plugin:                         │
│                                                                 │
│  loadSinglePluginLspConfig (ao4)                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  1. loadPluginLspConfig (Nl6)                             │ │
│  │     ├── Read .lsp.json file                              │ │
│  │     ├── Parse and validate JSON                          │ │
│  │     └── Merge into configs object                        │ │
│  │                                                           │ │
│  │  2. Resolve manifest.lspServers field (zyY)              │ │
│  │     ├── String path → resolve and load file              │ │
│  │     ├── Array of paths → load each                       │ │
│  │     └── Object → inline config validation                │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  expandLspConfigVars (_yY)                                     │
│  ├── Expand ${CLAUDE_PLUGIN_ROOT}                             │
│  └── Expand environment variables                             │
│                              │                                  │
│                              ▼                                  │
│  namespacePluginServers (wyY)                                  │
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

## 2. Variable Expansion

### Plugin Root Variable

```javascript
// ============================================
// expandPluginRootVar - Expand ${CLAUDE_PLUGIN_ROOT} placeholder
// Location: chunks.138.mjs (embedded in _yY)
// ============================================

// READABLE:
function expandPluginRootVar(value, pluginRootPath) {
    return value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRootPath);
}
```

### Full Variable Expansion

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
            let {
                expanded: J,
                missingVars: M
            } = cz(H);
            return z.push(...M), J
        },
        w = {
            ...A
        };
    if (w.command) w.command = _(w.command);
    if (w.args) w.args = w.args.map(($) => _($));
    let H = {
        CLAUDE_PLUGIN_ROOT: q,
        ...w.env || {}
    };
    for (let [$, J] of Object.entries(H))
        if ($ !== "CLAUDE_PLUGIN_ROOT") H[$] = _(J);
    if (w.env = H, w.workspaceFolder) w.workspaceFolder = _(w.workspaceFolder);
    if (z.length > 0) {
        let J = `Missing environment variables in plugin LSP config: ${[...new Set(z)].join(", ")}`;
        _6(Error(J)), k(J, {
            level: "warn"
        })
    }
    return w
}

// READABLE:
function expandLspConfigVars(config, pluginRootPath, workspaceFolder, errors) {
    const missingVars = [];

    const expandString = (value) => {
        // First expand plugin root
        let expanded = value.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, pluginRootPath);

        // Expand workspace folder if provided
        if (workspaceFolder) {
            expanded = expanded.replace(/\$\{WORKSPACE_FOLDER\}/g, workspaceFolder);
        }

        // Then expand environment variables
        const { expanded: result, missingVars: vars } = expandEnvVars(expanded);
        missingVars.push(...vars);
        return result;
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

// Mapping: _yY→expandLspConfigVars, ZL→expandPluginRootVar, cz→expandEnvVars
```

**Variable expansion order:**
1. `${CLAUDE_PLUGIN_ROOT}` → Plugin directory path
2. `${WORKSPACE_FOLDER}` → Workspace folder path (if provided)
3. `${ENV_VAR}` → Value from process environment

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

## 3. Server Namespacing

```javascript
// ============================================
// namespacePluginServers - Namespace server names by plugin
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
        const namespacedName = `plugin:${pluginName}:${serverName}`;
        namespaced[namespacedName] = {
            ...config,
            scope: "dynamic",  // Mark as plugin-provided (vs built-in)
            source: pluginName // Track origin for debugging
        };
    }
    return namespaced;
}

// Mapping: wyY→namespacePluginServers
```

**Why namespacing:**
- Prevents name collisions between plugins
- Allows multiple plugins to define servers with the same base name
- Enables tracking of server origin for debugging
- Format: `plugin:{pluginName}:{serverName}`

---

## 4. Path Traversal Protection

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
    const absoluteRoot = path.resolve(pluginRoot);
    const targetPath = path.resolve(pluginRoot, relativePath);
    const relative = path.relative(absoluteRoot, targetPath);

    // Reject if path escapes plugin directory
    if (relative.startsWith("..") || path.resolve(relative) === relative) {
        return null;  // Path traversal detected
    }
    return targetPath;
}

// Mapping: YyY→safePluginRelativePath, Um8→path.resolve, KyY→path.relative
```

**Security insight:** This prevents malicious plugins from reading files outside their directory using relative paths like `../../../etc/passwd`.

---

## 5. Aggregate Configuration Loading

```javascript
// ============================================
// loadLspConfigs - Load all LSP configs from all plugins
// Location: chunks.138.mjs:756-796
// ============================================

// ORIGINAL:
async function so4() {
    let A = {};
    try {
        let {
            enabled: q
        } = await _z(), K = await Promise.all(q.map(async (Y) => {
            let z = [];
            return {
                plugin: Y,
                configs: await ao4(Y, z),
                errors: z
            }
        }));
        for (let {
            plugin: Y,
            configs: z,
            errors: _
        } of K)
            if (z && Object.keys(z).length > 0 && (Object.assign(A, z), k(`Loaded ${Object.keys(z).length} LSP server(s) from plugin: ${Y.name}`)), _.length > 0) k(`${_.length} error(s) loading LSP servers from plugin: ${Y.name}`);
        k(`Total LSP servers loaded: ${Object.keys(A).length}`)
    } catch (q) {
        _6(q instanceof Error ? q : Error(`Failed to load LSP servers: ${String(q)}`)), k(`Error loading LSP servers: ${q instanceof Error?q.message:String(q)}`)
    }
    return {
        servers: A
    }
}

// READABLE:
async function loadLspConfigs() {
    const allServers = {};

    try {
        const { enabled: plugins } = await getPluginState();  // _z

        const results = await Promise.all(plugins.map(async (plugin) => {
            const errors = [];
            const pluginConfigs = await loadSinglePluginLspConfig(plugin, errors);  // ao4
            return { plugin, configs: pluginConfigs, errors };
        }));

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

---

## 6. Configuration Schema

The LSP server configuration uses Zod schema validation:

### Schema Fields

| Field | Required | Default | Validation |
|-------|----------|---------|------------|
| `command` | Yes | - | No spaces (unless absolute path) |
| `args` | No | `[]` | Array of non-empty strings |
| `extensionToLanguage` | Yes | - | At least one mapping, extensions must start with `.` |
| `transport` | No | `"stdio"` | Either `"stdio"` or `"socket"` |
| `env` | No | - | String-to-string mapping |
| `workspaceFolder` | No | - | Any string path |
| `initializationOptions` | No | - | Any JSON value |
| `settings` | No | - | Any JSON value |
| `startupTimeout` | No | - | Positive integer (milliseconds) |
| `shutdownTimeout` | No | - | Positive integer (milliseconds) |
| `restartOnCrash` | No | - | Boolean (not yet implemented) |
| `maxRestarts` | No | - | Non-negative integer (not yet implemented) |

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

## Configuration Summary

| Stage | Function | Purpose |
|-------|----------|---------|
| Parse JSON | `JSON.parse` | Convert file content to object |
| Validate | Zod schema | Ensure config matches schema |
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

---

## Source Locations

| Function | Symbol | Location |
|----------|--------|----------|
| safePluginRelativePath | YyY | chunks.138.mjs:585-591 |
| loadPluginLspConfig | Nl6 | chunks.138.mjs:593-628 |
| resolvePluginLspServersField | zyY | chunks.138.mjs:630-690 |
| expandLspConfigVars | _yY | chunks.138.mjs:692-722 |
| namespacePluginServers | wyY | chunks.138.mjs:724-735 |
| loadSinglePluginLspConfig | ao4 | chunks.138.mjs:737-745 |
| loadLspConfigs | so4 | chunks.138.mjs:756-796 |
| LspServerManager | eo4 | chunks.138.mjs:806-969 |