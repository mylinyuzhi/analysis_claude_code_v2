# Plugin CLI Commands and Telemetry (Claude Code 2.1.76)

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

## Plugin Commands

### `handlePluginList` (HGz)

**What it does:** Lists all installed plugins with their status, version, and scope.

**Output modes:**
- Default: Human-readable table with plugin name, version, status, source
- `--json`: Machine-readable JSON array (for scripting)

**Telemetry:** `tengu_plugin_list_command`

### `handlePluginInstall` (XGz)

**What it does:** Downloads, caches, and enables a plugin from a marketplace.

**Flow:**
1. Validate the plugin ID format (`pluginName@marketplaceName`)
2. Look up the plugin in marketplace catalog
3. Download and cache via `downloadAndCachePlugin` (F51)
4. Record in `installed_plugins.json` via `savePluginInstallation` (hXA)
5. Enable in user settings

**Options:**
- `--scope <user|project|local>`: Which settings file to write the enable flag to
- `--version <version>`: Specific version to install

**Telemetry:** `tengu_plugin_install_command`, `tengu_plugin_install_success`, `tengu_plugin_install_error`

### `handlePluginUninstall` (DGz)

**What it does:** Disables and removes a plugin's installation record.

**Behavior:**
- Removes from `installed_plugins.json`
- Disables in all settings scopes
- Does NOT delete cached plugin files (to allow re-enabling without re-downloading)
- Runs `cleanupOrphanedPluginCache` (kyA) to remove unreferenced cache entries

**Telemetry:** `tengu_plugin_uninstall_command`

### `handlePluginEnable` / `handlePluginDisable`

**What it does:** Toggle the `enabledPlugins` flag in settings without install/uninstall.

**Scope options:** `--scope <user|project|local>` controls which settings file is modified.

**Telemetry:** `tengu_plugin_enable_command`, `tengu_plugin_disable_command`

---

## Marketplace Commands

### `handleMarketplaceAdd` ($Gz)

**What it does:** Registers a new marketplace source and fetches its catalog.

**Input formats:**
```
claude marketplace add github:myorg/plugins-repo
claude marketplace add https://plugins.example.com/catalog.json
claude marketplace add /path/to/local/marketplace
```

**Validation:**
1. Enterprise policy check (blockedMarketplaces, strictKnownMarketplaces)
2. Source format validation
3. Initial catalog fetch (fails if source is unreachable)

**Telemetry:** `tengu_marketplace_add_command`

### `handleMarketplaceUpdate` (JGz)

**What it does:** Refreshes one or all marketplace catalogs.

```
claude marketplace update              # Update all
claude marketplace update my-market   # Update specific
```

**Telemetry:** `tengu_marketplace_update_command`

---

## Telemetry Events Reference

| Event | When Fired | Properties |
|-------|-----------|------------|
| `tengu_plugin_list_command` | `claude plugin list` | `{ pluginCount }` |
| `tengu_plugin_install_command` | `claude plugin install` starts | `{ pluginId }` |
| `tengu_plugin_install_success` | Install completes | `{ pluginId, version, source }` |
| `tengu_plugin_install_error` | Install fails | `{ pluginId, errorType }` |
| `tengu_plugin_uninstall_command` | `claude plugin uninstall` | `{ pluginId }` |
| `tengu_plugin_enable_command` | `claude plugin enable` | `{ pluginId, scope }` |
| `tengu_plugin_disable_command` | `claude plugin disable` | `{ pluginId, scope }` |
| `tengu_marketplace_add_command` | `claude marketplace add` starts | `{ sourceType }` |
| `tengu_marketplace_update_command` | `claude marketplace update` | `{ marketplaceName }` |
| `tengu_plugin_loaded` | Plugin loaded successfully | `{ pluginName, componentCount }` |
| `tengu_plugin_load_error` | Plugin load fails | `{ pluginName, errorType }` |
| `tengu_plugin_hook_executed` | Plugin hook fires | `{ pluginName, eventType }` |

---

## Installation State Management

### `installed_plugins.json` Format

```json
{
  "plugins": {
    "my-plugin@my-market": {
      "name": "my-plugin",
      "marketplace": "my-market",
      "version": "1.2.3",
      "installedAt": "2025-01-15T10:30:00Z",
      "cachedPath": "~/.claude/cache/my-market/my-plugin/1.2.3/",
      "source": "my-plugin@my-market"
    }
  },
  "lastCleanup": "2025-01-15T10:00:00Z"
}
```

### Cache Garbage Collection

`cleanupOrphanedPluginCache` (kyA) runs after uninstall and periodically:
1. Reads `installed_plugins.json` for referenced cache paths
2. Lists all directories under `~/.claude/cache/`
3. Deletes directories not referenced by any installed plugin
4. Updates `lastCleanup` timestamp
