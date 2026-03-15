# Plugin CLI Commands and Telemetry (Claude Code 2.1.38)

> Analysis of CLI commands for plugin management and telemetry events
> for tracking plugin usage and operations.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions in this document:
- `handlePluginList` (HGz) - CLI: List installed plugins
- `handlePluginInstall` (XGz) - CLI: Install a plugin
- `handlePluginUninstall` (DGz) - CLI: Uninstall a plugin
- `handlePluginEnable` (PGz) - CLI: Enable a plugin
- `handlePluginDisable` (KGz) - CLI: Disable a plugin
- `handlePluginUpdate` (PGz) - CLI: Update a plugin
- `handleMarketplaceAdd` ($Gz) - CLI: Add a marketplace
- `handleMarketplaceList` (OGz) - CLI: List marketplaces
- `handleMarketplaceRemove` (_Gz) - CLI: Remove a marketplace
- `handleMarketplaceUpdate` (JGz) - CLI: Update a marketplace

---

## Overview

Claude Code provides a comprehensive CLI for plugin management through the `claude plugin` subcommand. All operations emit telemetry events for tracking usage and diagnosing issues.

---

## CLI Command Structure

```
claude plugin <action> [options]

Actions:
  list              List installed plugins
  install <id>      Install a plugin
  uninstall <id>    Uninstall a plugin
  enable <id>       Enable a plugin
  disable <id>      Disable a plugin
  update [id]       Update plugin(s)

claude marketplace <action> [options]

Actions:
  add <source>      Add a marketplace
  list              List configured marketplaces
  remove <name>     Remove a marketplace
  update [name]     Update marketplace(s)
```

---

## Plugin List Command

### handlePluginList (HGz)

**What it does:** Lists all installed plugins with their status, version, and scope.

```javascript
// ============================================
// handlePluginList - List installed plugins
// Location: chunks.188.mjs:2596-2691
// ============================================

// ORIGINAL (for source lookup):
async function HGz(A) {
    if (A.cowork) $T(!0);
    c("tengu_plugin_list_command", {});
    let q = uM(),  // getInstalledPluginsState()
        { getEnabledPluginsWithScopes: K } = await Promise.resolve().then(() => (vZ1(), qKq)),
        Y = K(), z = Object.keys(q.plugins);
    if (A.json) {
        // JSON output mode
        let { enabled: H, disabled: $, errors: O } = await iY(),
            _ = [...H, ...$], J = new Map(_.map((D) => [D.source, D])), X = [];
        for (let D of z.sort()) {
            let j = q.plugins[D];
            if (!j || j.length === 0) continue;
            let M = D.split("@")[0],
                P = O.filter((W) => W.source === D || ("plugin" in W) && W.plugin === M).map(TZ);
            for (let W of j) {
                let G = J.get(D), f;
                if (G) {
                    let Z = G.mcpServers || await b0A(G);
                    if (Z && Object.keys(Z).length > 0) f = Z
                }
                X.push({
                    id: D,
                    version: W.version || "unknown",
                    scope: W.scope,
                    enabled: Y.has(D),
                    installPath: W.installPath,
                    installedAt: W.installedAt,
                    lastUpdated: W.lastUpdated,
                    projectPath: W.projectPath,
                    mcpServers: f,
                    errors: P.length > 0 ? P : void 0
                })
            }
        }
        if (A.available) {
            // Include available plugins from marketplaces
            let D = await getAvailablePlugins();
            console.log(JSON.stringify({ installed: X, available: D }, null, 2));
        } else console.log(JSON.stringify(X, null, 2));
        process.exit(0)
    }
    // Human-readable output
    if (z.length === 0) {
        console.log("No plugins installed. Use `claude plugin install` to install a plugin.");
        process.exit(0);
    }
    let { errors: w } = await iY();
    console.log(`Installed plugins:\n`);
    for (let H of z.sort()) {
        let $ = q.plugins[H];
        if (!$ || $.length === 0) continue;
        let O = H.split("@")[0],
            _ = w.filter((J) => J.source === H || ("plugin" in J) && J.plugin === O);
        for (let J of $) {
            let X = Y.has(H),
                D = _.length > 0 ? `✗ failed to load` : X ? `✓ enabled` : `✗ disabled`,
                j = J.version || "unknown",
                M = J.scope;
            console.log(`  → ${H}`);
            console.log(`    Version: ${j}`);
            console.log(`    Scope: ${M}`);
            console.log(`    Status: ${D}`);
            for (let P of _) console.log(`    Error: ${TZ(P)}`);
            console.log("")
        }
    }
    process.exit(0)
}

// READABLE (for understanding):
async function handlePluginList(options) {
    if (options.cowork) setCoworkMode(true);

    // Emit telemetry
    emitTelemetry("tengu_plugin_list_command", {});

    let installedState = getInstalledPluginsState();
    let enabledPlugins = getEnabledPluginsWithScopes();
    let pluginIds = Object.keys(installedState.plugins);

    if (options.json) {
        // JSON output for programmatic use
        let { enabled, disabled, errors } = await getLoadedPlugins();
        let allPlugins = [...enabled, ...disabled];

        let output = [];
        for (let pluginId of pluginIds.sort()) {
            let records = installedState.plugins[pluginId];
            for (let record of records) {
                output.push({
                    id: pluginId,
                    version: record.version || "unknown",
                    scope: record.scope,
                    enabled: enabledPlugins.has(pluginId),
                    installPath: record.installPath,
                    installedAt: record.installedAt,
                    lastUpdated: record.lastUpdated,
                    mcpServers: await getMcpServers(pluginId),
                    errors: getErrors(pluginId)
                });
            }
        }

        if (options.available) {
            // Include plugins available in marketplaces but not installed
            let available = await getAvailablePluginsFromMarketplaces();
            console.log(JSON.stringify({ installed: output, available }, null, 2));
        } else {
            console.log(JSON.stringify(output, null, 2));
        }
        process.exit(0);
    }

    // Human-readable output
    if (pluginIds.length === 0) {
        console.log("No plugins installed. Use `claude plugin install` to install a plugin.");
        process.exit(0);
    }

    console.log(`Installed plugins:\n`);
    // ... format and display each plugin
}

// Mapping: HGz→handlePluginList, c→emitTelemetry, uM→getInstalledPluginsState,
//   iY→getLoadedPlugins, K→getEnabledPluginsWithScopes, TZ→serializeError, b0A→resolvePluginMcpConfig
```

### Output Format

**Human-readable:**
```
Installed plugins:

  → myplugin@mymarket
    Version: 1.2.0
    Scope: user
    Status: ✓ enabled

  → other-plugin@other-market
    Version: 0.5.0
    Scope: project
    Status: ✗ failed to load
    Error: Marketplace not found
```

**JSON:**
```json
[
  {
    "id": "myplugin@mymarket",
    "version": "1.2.0",
    "scope": "user",
    "enabled": true,
    "installPath": "/Users/user/.claude/cache/mymarket/myplugin/1.2.0",
    "installedAt": "2024-01-15T10:30:00.000Z",
    "lastUpdated": "2024-01-20T14:00:00.000Z"
  }
]
```

---

## Plugin Install Command

### handlePluginInstall (XGz)

**What it does:** Installs a plugin from a marketplace.

```javascript
// ============================================
// handlePluginInstall - Install a plugin
// Location: chunks.188.mjs:2800-2809
// ============================================

// ORIGINAL (for source lookup):
async function XGz(A, q) {
    if (q.cowork) $T(!0);
    let K = q.scope || "user";
    if (q.cowork && K !== "user") console.error("--cowork can only be used with user scope"), process.exit(1);
    if (!ZP.includes(K)) console.error(`Invalid scope: ${K}. Must be one of: ${ZP.join(", ")}.`), process.exit(1);
    c("tengu_plugin_install_command", {
        plugin: A,
        scope: K
    }), await fDq(A, K)
}

// READABLE (for understanding):
async function handlePluginInstall(pluginId, options) {
    if (options.cowork) setCoworkMode(true);

    let scope = options.scope || "user";

    // Validate scope
    if (options.cowork && scope !== "user") {
        console.error("--cowork can only be used with user scope");
        process.exit(1);
    }
    if (!VALID_SCOPES.includes(scope)) {
        console.error(`Invalid scope: ${scope}. Must be one of: ${VALID_SCOPES.join(", ")}.`);
        process.exit(1);
    }

    // Emit telemetry before operation
    emitTelemetry("tengu_plugin_install_command", {
        plugin: pluginId,
        scope: scope
    });

    await installPlugin(pluginId, scope);
}

// Mapping: XGz→handlePluginInstall, $T→setCoworkMode, ZP→VALID_SCOPES,
//   c→emitTelemetry, fDq→installPlugin
```

---

## Plugin Uninstall Command

### handlePluginUninstall (DGz)

```javascript
// ============================================
// handlePluginUninstall - Uninstall a plugin
// Location: chunks.188.mjs:2811-2820
// ============================================

async function handlePluginUninstall(pluginId, options) {
    let scope = options.scope || "user";

    emitTelemetry("tengu_plugin_uninstall_command", {
        plugin: pluginId,
        scope: scope
    });

    await uninstallPlugin(pluginId, scope);
}
```

---

## Plugin Enable Command

### handlePluginEnable (PGz)

```javascript
// ============================================
// handlePluginEnable - Enable a plugin
// Location: chunks.188.mjs:2822-2835
// ============================================

async function handlePluginEnable(pluginId, options) {
    let scope = options.scope || "user";

    emitTelemetry("tengu_plugin_enable_command", {
        plugin: pluginId,
        scope: scope
    });

    await enablePlugin(pluginId, scope);
}
```

---

## Plugin Disable Command

### handlePluginDisable (KGz)

```javascript
// ============================================
// handlePluginDisable - Disable a plugin
// Location: chunks.188.mjs:2837-2862
// ============================================

async function handlePluginDisable(pluginId, options) {
    // Special case: --all flag disables all plugins
    if (options.all) {
        emitTelemetry("tengu_plugin_disable_command", {
            plugin: "--all"
        });
        await disableAllPlugins();
        return;
    }

    let scope = options.scope || "user";

    emitTelemetry("tengu_plugin_disable_command", {
        plugin: pluginId,
        scope: scope
    });

    await disablePlugin(pluginId, scope);
}
```

---

## Plugin Update Command

### handlePluginUpdate (PGz)

```javascript
// ============================================
// handlePluginUpdate - Update a plugin
// Location: chunks.189.mjs:3-30
// ============================================

// ORIGINAL (for source lookup):
async function PGz(A, q) {
    if (q.cowork) $T(!0);
    c("tengu_plugin_update_command", {});
    let K = "user";
    if (q.scope) {
        if (!h91.includes(q.scope)) process.stderr.write(`Invalid scope "${q.scope}". Valid scopes: ${h91.join(", ")}
`), process.exit(1);
        K = q.scope
    }
    if (A) await jD9(A, K);
    else {
        let Y = uM(), z = Object.keys(Y.plugins);
        if (z.length === 0) {
            console.log("No plugins installed to update.");
            return
        }
        for (let w of z) await jD9(w, K)
    }
}

// READABLE (for understanding):
async function handlePluginUpdate(pluginId, options) {
    if (options.cowork) setCoworkMode(true);

    emitTelemetry("tengu_plugin_update_command", {});

    let scope = options.scope || "user";

    if (pluginId) {
        // Update specific plugin
        await updatePlugin(pluginId, scope);
    } else {
        // Update all installed plugins
        let installed = getInstalledPluginsState();
        let pluginIds = Object.keys(installed.plugins);

        if (pluginIds.length === 0) {
            console.log("No plugins installed to update.");
            return;
        }

        for (let id of pluginIds) {
            await updatePlugin(id, scope);
        }
    }
}

// Mapping: PGz→handlePluginUpdate, h91→VALID_SCOPES, jD9→updatePlugin, uM→getInstalledPluginsState
```

---

## Marketplace Commands

### handleMarketplaceAdd ($Gz)

```javascript
// ============================================
// handleMarketplaceAdd - Add a marketplace
// Location: chunks.188.mjs:2693-2715
// ============================================

async function handleMarketplaceAdd(sourceArg, options) {
    if (options.cowork) setCoworkMode(true);

    let parsedSource = parseMarketplaceSource(sourceArg);
    if (!parsedSource) {
        console.error("✗ Invalid marketplace source format. Try: owner/repo, https://..., or ./path");
        process.exit(1);
    }

    console.log("Adding marketplace...");
    let { name } = await installMarketplaceSource(parsedSource, (progress) => {
        console.log(progress);
    });

    clearPluginCaches();

    emitTelemetry("tengu_marketplace_added", {
        source_type: parsedSource.source
    });

    console.log(`✓ Successfully added marketplace: ${name}`);
    process.exit(0);
}
```

### handleMarketplaceList (OGz)

```javascript
// ============================================
// handleMarketplaceList - List marketplaces
// Location: chunks.188.mjs:2717-2766
// ============================================

async function handleMarketplaceList(options) {
    let config = await getMarketplaceConfig();
    let names = Object.keys(config);

    if (options.json) {
        let output = names.sort().map(name => {
            let entry = config[name];
            let source = entry?.source;
            return {
                name,
                source: source?.source,
                ...(source?.source === "github" && { repo: source.repo }),
                ...(source?.source === "git" && { url: source.url }),
                ...(source?.source === "url" && { url: source.url }),
                installLocation: entry?.installLocation
            };
        });
        console.log(JSON.stringify(output, null, 2));
        process.exit(0);
    }

    if (names.length === 0) {
        console.log("No marketplaces configured");
        process.exit(0);
    }

    console.log(`Configured marketplaces:\n`);
    for (let name of names) {
        let entry = config[name];
        console.log(`  → ${name}`);
        if (entry?.source) {
            // Display source type and location
        }
        console.log("");
    }
}
```

### handleMarketplaceRemove (_Gz)

```javascript
// ============================================
// handleMarketplaceRemove - Remove a marketplace
// Location: chunks.188.mjs:2768-2777
// ============================================

async function handleMarketplaceRemove(marketplaceName, options) {
    await removeMarketplaceSource(marketplaceName);
    clearPluginCaches();

    emitTelemetry("tengu_marketplace_removed", {
        marketplace_name: marketplaceName
    });

    console.log(`✓ Successfully removed marketplace: ${marketplaceName}`);
}
```

---

## Telemetry Events

### Plugin Telemetry Events

| Event Name | When Fired | Properties |
|------------|-----------|------------|
| `tengu_plugin_installed` | Plugin installation completes | `plugin_id`, `marketplace_name` |
| `tengu_plugin_installed_cli` | CLI install completes | `plugin_id`, `marketplace_name`, `scope` |
| `tengu_plugin_uninstalled_cli` | CLI uninstall completes | `plugin_id`, `scope` |
| `tengu_plugin_enabled_cli` | CLI enable completes | `plugin_id`, `scope` |
| `tengu_plugin_disabled_cli` | CLI disable completes | `plugin_id`, `scope` |
| `tengu_plugin_disabled_all_cli` | All plugins disabled | (none) |
| `tengu_plugin_updated_cli` | Update completes | `plugin_id`, `old_version`, `new_version` |
| `tengu_plugin_list_command` | List command executed | (none) |
| `tengu_plugin_install_command` | Install command started | `plugin`, `scope` |
| `tengu_plugin_uninstall_command` | Uninstall command started | `plugin`, `scope` |
| `tengu_plugin_enable_command` | Enable command started | `plugin`, `scope` |
| `tengu_plugin_disable_command` | Disable command started | `plugin`, `scope` |
| `tengu_plugin_update_command` | Update command started | (none) |
| `tengu_plugins_loaded` | Plugins loaded in session | `enabled_count`, `disabled_count`, `error_count` |

### Marketplace Telemetry Events

| Event Name | When Fired | Properties |
|------------|-----------|------------|
| `tengu_marketplace_added` | Marketplace added | `source_type` |
| `tengu_marketplace_removed` | Marketplace removed | `marketplace_name` |
| `tengu_marketplace_updated` | Marketplace updated | `marketplace_name` |

### Telemetry Emission Patterns

```javascript
// Pattern 1: After successful operation
await installPlugin(pluginId, scope);
emitTelemetry("tengu_plugin_installed_cli", {
    plugin_id: pluginId,
    marketplace_name: pluginId.split("@")[1] || "unknown",
    scope: scope
});

// Pattern 2: Before operation (for tracking attempts)
emitTelemetry("tengu_plugin_install_command", {
    plugin: pluginId,
    scope: scope
});
await installPlugin(pluginId, scope);

// Pattern 3: With computed properties
emitTelemetry("tengu_plugins_loaded", {
    enabled_count: enabled.length,
    disabled_count: disabled.length,
    error_count: errors.length
});
```

---

## UI Integration

### Plugin Loading in UI

The `tengu_plugins_loaded` event is emitted from the React UI when plugins are loaded:

```javascript
// Location: chunks.186.mjs:305-324
useEffect(() => {
    loadPlugins().then((result) => {
        emitTelemetry("tengu_plugins_loaded", result);
        logInfo("tengu_plugins_loaded", result);
    });
}, [loadPlugins]);

// On refresh
useEffect(() => {
    if (!needsRefresh) return;
    clearPluginCache();
    loadPlugins().then((result) => {
        emitTelemetry("tengu_plugins_loaded", { ...result, is_refresh: true });
        setState((prev) => ({
            ...prev,
            plugins: { ...prev.plugins, needsRefresh: false }
        }));
    });
}, [needsRefresh]);
```

---

## Scope System

### Valid Scopes

```javascript
const VALID_SCOPES = ["user", "project", "local"];
```

### Scope Precedence

```
local > project > user
```

- **user** - Settings in `~/.claude/settings.json`, available in all projects
- **project** - Settings in `.claude/settings.json`, scoped to current project
- **local** - Settings in `.claude/settings.local.json`, local overrides

---

## Error Handling

All CLI commands follow a consistent error handling pattern:

```javascript
try {
    let result = await performOperation();
    if (!result.success) throw Error(result.message);
    console.log(`✓ ${result.message}`);
    emitTelemetry("tengu_operation_success", { ... });
    process.exit(0);
} catch (err) {
    handleCliError(err, "operation name");
    process.exit(1);
}
```

### Error Categories

1. **Invalid arguments** - Exit 1, show usage
2. **Operation failure** - Exit 1, show error message
3. **Unexpected error** - Exit 2, show full error

---

## Summary: CLI Command Pattern

All plugin CLI commands follow this pattern:

```
1. Parse options and validate arguments
   ↓
2. Set cowork mode if --cowork flag present
   ↓
3. Emit telemetry event
   ↓
4. Perform operation
   ↓
5. Clear caches if needed
   ↓
6. Output result (JSON or human-readable)
   ↓
7. Exit with appropriate code
```