# Plugin State Management

> How plugin installation and enable/disable state is persisted.
>
> **Related Symbols:** See symbol index files:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Quick Navigation

- [State Architecture](#state-architecture)
- [Installed Plugins Registry](#installed-plugins-registry)
- [Enable/Disable State](#enabledisable-state)
- [Registry Operations](#registry-operations)
- [V1 to V2 Migration](#v1-to-v2-migration)
- [Scope-Aware State](#scope-aware-state)

---

## State Architecture

Plugin state is split across two storage systems:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STATE STORAGE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. INSTALLED PLUGINS REGISTRY                                         │
│     └── Where plugins are installed                                    │
│     └── Version, path, timestamps, git SHA                            │
│     └── Files:                                                         │
│         • ~/.claude/installed_plugins.json (V1)                       │
│         • ~/.claude/installed_plugins_v2.json (V2)                    │
│                                                                         │
│  2. ENABLE/DISABLE STATE                                               │
│     └── Which plugins are enabled                                      │
│     └── Stored in settings.json                                        │
│     └── Scopes:                                                        │
│         • ~/.claude/settings.json (user)                              │
│         • .claude/settings.json (project)                             │
│         • .claude/settings.local.json (local)                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Why separate?**
- Installation is expensive (download, cache, validate)
- Enable/disable is cheap (toggle boolean)
- Prevents sync issues between registry and state
- Allows different scopes for enable state

---

## Installed Plugins Registry

### Load Registry

```javascript
// ============================================
// loadInstalledPluginsRegistry - Load installed plugins from disk
// Location: chunks.91.mjs:551-579
// ============================================

// READABLE (for understanding):
function loadInstalledPluginsRegistry() {
  const fs = getFileSystem();

  // Try V2 first
  const v2Path = getInstalledPluginsV2Path();  // ~/.claude/installed_plugins_v2.json
  if (fs.existsSync(v2Path)) {
    try {
      const content = fs.readFileSync(v2Path, { encoding: "utf-8" });
      const data = JSON.parse(content);
      const result = installedPluginsV2Schema.safeParse(data);
      if (result.success) {
        return result.data;
      }
      log(`V2 registry corrupted, falling back to V1: ${result.error}`, { level: "warn" });
    } catch (error) {
      log(`Failed to load V2 registry: ${error}`, { level: "warn" });
    }
  }

  // Fall back to V1
  const v1Path = getInstalledPluginsV1Path();  // ~/.claude/installed_plugins.json
  if (fs.existsSync(v1Path)) {
    try {
      const content = fs.readFileSync(v1Path, { encoding: "utf-8" });
      const data = JSON.parse(content);
      const result = installedPluginsV1Schema.safeParse(data);
      if (result.success) {
        // Convert V1 to V2 format
        return migrateV1ToV2(result.data);
      }
    } catch (error) {
      log(`Failed to load V1 registry: ${error}`, { level: "warn" });
    }
  }

  // Return empty registry
  return { version: 2, plugins: {} };
}

// Mapping: f_→loadInstalledPluginsRegistry
```

### Save Registry

```javascript
// ============================================
// saveInstalledPluginsRegistry - Save installed plugins to disk
// Location: chunks.91.mjs:580-596
// ============================================

// READABLE (for understanding):
function saveInstalledPluginsRegistry(registry) {
  const fs = getFileSystem();
  const v2Path = getInstalledPluginsV2Path();

  try {
    // Ensure parent directory exists
    const dir = path.dirname(v2Path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write atomically
    const content = JSON.stringify(registry, null, 2);
    fs.writeFileSync(v2Path, content, { encoding: "utf-8" });

    log(`Saved installed plugins registry to ${v2Path}`);
  } catch (error) {
    log(`Failed to save registry: ${error}`, { level: "error" });
    throw error;
  }
}

// Mapping: UI0→saveInstalledPluginsRegistry
```

---

## Enable/Disable State

Enable/disable state is stored in `settings.json` under `enabledPlugins`.

```json
{
  "enabledPlugins": {
    "my-plugin@marketplace": true,
    "another-plugin@marketplace": false
  }
}
```

### Get Enabled State

```javascript
// ============================================
// getEnabledPlugins - Get enabled plugins from settings
// Location: (settings management)
// ============================================

// READABLE (for understanding):
function getEnabledPlugins(scope = "user") {
  const settings = getSettings(scope);
  return settings?.enabledPlugins || {};
}

// Returns: { "plugin-id": true/false, ... }

// Check if specific plugin is enabled:
function isPluginEnabled(pluginId, scope = "user") {
  const enabled = getEnabledPlugins(scope);
  // Default to true if not explicitly set
  return enabled[pluginId] !== false;
}
```

### Set Enabled State

```javascript
// ============================================
// setPluginEnabled - Enable or disable a plugin
// Location: (settings management)
// ============================================

// READABLE (for understanding):
function setPluginEnabled(pluginId, enabled, scope = "user") {
  const settings = getSettings(scope);
  const enabledPlugins = {
    ...settings?.enabledPlugins,
    [pluginId]: enabled
  };

  saveSettings(scope, { enabledPlugins });
  log(`Set plugin ${pluginId} enabled=${enabled} in ${scope} settings`);

  // Clear caches to trigger reload
  clearPluginCache();
}
```

---

## Registry Operations

### Add Plugin to Registry

```javascript
// ============================================
// addPluginToRegistry - Register installed plugin
// Location: chunks.91.mjs:680-725
// ============================================

// ORIGINAL (for source lookup):
function NI0(A, Q, B, G) {
  let Z = f_();
  if (!Z.plugins[A]) Z.plugins[A] = [];
  let Y = Z.plugins[A].findIndex((X) => X.scope === G);
  let J = {
    scope: G,
    version: Q.version || "unknown",
    installPath: Q.installPath,
    installedAt: Y >= 0 ? Z.plugins[A][Y].installedAt : new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    gitCommitSha: Q.gitCommitSha,
    projectPath: B
  };
  if (Y >= 0) Z.plugins[A][Y] = J;
  else Z.plugins[A].push(J);
  UI0(Z);
  k(`${Y >= 0 ? "Updated" : "Added"} plugin ${A} to registry (scope: ${G})`);
}

// READABLE (for understanding):
function addPluginToRegistry(pluginId, installEntry, projectPath, scope = "user") {
  const registry = loadInstalledPluginsRegistry();

  // Initialize plugin entry array if needed
  if (!registry.plugins[pluginId]) {
    registry.plugins[pluginId] = [];
  }

  // Find existing entry for this scope
  const existingIndex = registry.plugins[pluginId].findIndex(
    entry => entry.scope === scope
  );

  // Build new entry
  const newEntry = {
    scope: scope,
    version: installEntry.version || "unknown",
    installPath: installEntry.installPath,
    installedAt: existingIndex >= 0
      ? registry.plugins[pluginId][existingIndex].installedAt
      : new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    gitCommitSha: installEntry.gitCommitSha,
    projectPath: projectPath
  };

  // Update or add
  if (existingIndex >= 0) {
    registry.plugins[pluginId][existingIndex] = newEntry;
  } else {
    registry.plugins[pluginId].push(newEntry);
  }

  saveInstalledPluginsRegistry(registry);
  log(`${existingIndex >= 0 ? "Updated" : "Added"} plugin ${pluginId} (scope: ${scope})`);
}

// Mapping: NI0→addPluginToRegistry, f_→loadInstalledPluginsRegistry, UI0→saveInstalledPluginsRegistry
```

### Remove Plugin from Registry

```javascript
// ============================================
// removePluginFromRegistry - Remove plugin from registry
// Location: chunks.91.mjs:597-650
// ============================================

// ORIGINAL (for source lookup):
function F32(A, Q, B) {
  let G = f_();
  if (!G.plugins[A]) return null;
  let Z = G.plugins[A].findIndex((J) => J.scope === Q && (!B || J.projectPath === B));
  if (Z < 0) return null;
  let Y = G.plugins[A].splice(Z, 1)[0];
  if (G.plugins[A].length === 0) delete G.plugins[A];
  UI0(G);
  k(`Removed plugin ${A} from registry (scope: ${Q})`);
  return Y;
}

// READABLE (for understanding):
function removePluginFromRegistry(pluginId, scope = "user", projectPath = null) {
  const registry = loadInstalledPluginsRegistry();

  if (!registry.plugins[pluginId]) {
    return null;
  }

  // Find entry for this scope (and project if specified)
  const entryIndex = registry.plugins[pluginId].findIndex(
    entry => entry.scope === scope && (!projectPath || entry.projectPath === projectPath)
  );

  if (entryIndex < 0) {
    return null;
  }

  // Remove entry
  const [removedEntry] = registry.plugins[pluginId].splice(entryIndex, 1);

  // Clean up empty arrays
  if (registry.plugins[pluginId].length === 0) {
    delete registry.plugins[pluginId];
  }

  saveInstalledPluginsRegistry(registry);
  log(`Removed plugin ${pluginId} from registry (scope: ${scope})`);

  return removedEntry;  // Return for cache cleanup
}

// Mapping: F32→removePluginFromRegistry
```

### Sync Registry with Settings

```javascript
// ============================================
// syncRegistryWithSettings - Ensure consistency
// Location: chunks.91.mjs:726-780
// ============================================

// READABLE (for understanding):
function syncRegistryWithSettings() {
  const registry = loadInstalledPluginsRegistry();
  const settings = getSettings("user");
  const enabledPlugins = settings?.enabledPlugins || {};

  let hasChanges = false;
  const newEnabled = { ...enabledPlugins };

  // Remove enabled state for plugins not in registry
  for (const pluginId of Object.keys(enabledPlugins)) {
    if (!registry.plugins[pluginId]) {
      delete newEnabled[pluginId];
      hasChanges = true;
      log(`Removed orphaned enabled state for ${pluginId}`);
    }
  }

  // Ensure all installed plugins have an enabled state
  for (const pluginId of Object.keys(registry.plugins)) {
    if (newEnabled[pluginId] === undefined) {
      newEnabled[pluginId] = true;  // Default to enabled
      hasChanges = true;
      log(`Added default enabled state for ${pluginId}`);
    }
  }

  if (hasChanges) {
    saveSettings("user", { enabledPlugins: newEnabled });
  }

  return hasChanges;
}

// Mapping: wI0→syncRegistryWithSettings
```

---

## V1 to V2 Migration

```javascript
// ============================================
// migrateV1ToV2 - Convert V1 registry to V2 format
// Location: chunks.91.mjs
// ============================================

// READABLE (for understanding):
function migrateV1ToV2(v1Registry) {
  const v2Registry = {
    version: 2,
    plugins: {}
  };

  for (const [pluginId, v1Entry] of Object.entries(v1Registry.plugins)) {
    v2Registry.plugins[pluginId] = [{
      scope: "user",                          // Assume user scope
      version: v1Entry.version,
      installPath: v1Entry.installPath,
      installedAt: v1Entry.installedAt,
      lastUpdated: v1Entry.lastUpdated || v1Entry.installedAt,
      gitCommitSha: v1Entry.gitCommitSha
    }];
  }

  // Save migrated registry
  saveInstalledPluginsRegistry(v2Registry);
  log("Migrated plugin registry from V1 to V2");

  return v2Registry;
}
```

---

## Scope-Aware State

### Scope Priority

When multiple scopes have the same plugin, priority is:

1. **local** - Highest priority (development)
2. **project** - Project-specific
3. **user** - User-level default
4. **managed** - Enterprise/policy (lowest override)

```javascript
// ============================================
// getEffectivePluginState - Resolve state across scopes
// ============================================

// READABLE (for understanding):
function getEffectivePluginState(pluginId) {
  const registry = loadInstalledPluginsRegistry();
  const entries = registry.plugins[pluginId] || [];

  // Find highest priority installation
  const scopePriority = ["local", "project", "user", "managed"];
  let effectiveEntry = null;

  for (const scope of scopePriority) {
    const entry = entries.find(e => e.scope === scope);
    if (entry) {
      effectiveEntry = entry;
      break;
    }
  }

  if (!effectiveEntry) {
    return null;
  }

  // Check enabled state (also scope-aware)
  const isEnabled = isPluginEnabled(pluginId, effectiveEntry.scope);

  return {
    ...effectiveEntry,
    enabled: isEnabled
  };
}
```

### Scope-Specific Settings Files

| Scope | Settings File | Registry |
|-------|---------------|----------|
| `user` | `~/.claude/settings.json` | `~/.claude/installed_plugins_v2.json` |
| `project` | `.claude/settings.json` | `.claude/installed_plugins_v2.json` |
| `local` | `.claude/settings.local.json` | Same as project |
| `managed` | Policy directory | Policy directory |

---

## State Transitions

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PLUGIN STATE MACHINE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                        ┌────────────────┐                               │
│                        │  UNINSTALLED   │                               │
│                        └───────┬────────┘                               │
│                                │                                        │
│                    /plugin install                                      │
│                                │                                        │
│                                ▼                                        │
│                    ┌────────────────────┐                              │
│                    │     INSTALLED      │                              │
│                    │  (enabled: true)   │←──────────────┐              │
│                    └─────────┬──────────┘               │              │
│                              │                          │              │
│              ┌───────────────┴───────────────┐          │              │
│              │                               │          │              │
│      /plugin disable               /plugin uninstall    │              │
│              │                               │          │              │
│              ▼                               │          │              │
│  ┌────────────────────┐                      │          │              │
│  │     INSTALLED      │                      │   /plugin enable        │
│  │  (enabled: false)  │──────────────────────┼──────────┘              │
│  └────────────────────┘                      │                         │
│              │                               │                         │
│              │                               ▼                         │
│              │                   ┌────────────────┐                    │
│              └──────────────────>│  UNINSTALLED   │                    │
│              /plugin uninstall   └────────────────┘                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `f_` | loadInstalledPluginsRegistry | chunks.91.mjs:551 | Load registry |
| `UI0` | saveInstalledPluginsRegistry | chunks.91.mjs:580 | Save registry |
| `NI0` | addPluginToRegistry | chunks.91.mjs:680 | Add/update entry |
| `F32` | removePluginFromRegistry | chunks.91.mjs:597 | Remove entry |
| `wI0` | syncRegistryWithSettings | chunks.91.mjs:726 | Sync consistency |
| `E32` | initializePluginsSystem | chunks.91.mjs:651 | Initialize (V1→V2) |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [installation.md](./installation.md) - Plugin installation
- [loading.md](./loading.md) - Component loading
- [schemas.md](./schemas.md) - Registry schemas
- [slash_command.md](./slash_command.md) - Plugin commands
