# Plugin State Management

> Enable/disable state, persistence, and registry management.
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Plugin System section

---

## Quick Navigation

- [State Model](#state-model)
- [Installed Plugins Registry](#installed-plugins-registry)
- [V1 vs V2 Schema](#v1-vs-v2-schema)
- [State Functions](#state-functions)
- [Settings Storage](#settings-storage)
- [State Synchronization](#state-synchronization)

---

## State Model

### Plugin States

| State | Description | Setting Value |
|-------|-------------|---------------|
| **Installed** | Plugin files exist in cache | Entry in installed_plugins.json |
| **Enabled** | Plugin is active and loaded | `enabledPlugins[id] = true` or undefined |
| **Disabled** | Plugin installed but not loaded | `enabledPlugins[id] = false` |
| **Uninstalled** | Plugin removed | No entry in registry |

### State Storage Locations

```
~/.claude/
├── plugins/
│   └── ... (plugin files)
├── installed_plugins.json      ← V1 registry
├── installed_plugins_v2.json   ← V2 registry (with scopes)
└── settings.json               ← enabledPlugins settings
    {
      "enabledPlugins": {
        "code-formatter@official": true,
        "debug-helper@my-marketplace": false
      }
    }
```

---

## Installed Plugins Registry

### Get Installed Plugins (V1)

```javascript
// ============================================
// getInstalledPlugins - Get V1 installed plugins
// Location: chunks.143.mjs:3462-3490
// ============================================

// ORIGINAL (for source lookup):
function QVA() {
  if (hg !== null) return hg.plugins;  // Return cached

  let A = dI1();  // Get registry file path
  try {
    let Q = ajA();  // Read registry file
    if (!Q) {
      g(`installed_plugins.json doesn't exist at ${A}`);
      hg = { version: 1, plugins: {} };
      return hg.plugins;
    }

    // Handle V2 format if feature enabled
    if (Q.version === 2) {
      let G = AB1.parse(Q.data),  // Validate V2 schema
          Z = VS3(G);             // Convert V2 to V1 format
      hg = { version: 1, plugins: Z };
      return Z;
    }

    // V1 format
    let B = $LA.parse(Q.data);  // Validate V1 schema
    hg = B;
    g(`Loaded ${Object.keys(B.plugins).length} installed plugins`);
    return B.plugins;
  } catch (Q) {
    g(`Failed to load installed_plugins.json: ${Q.message}`, { level: "error" });
    hg = { version: 1, plugins: {} };
    return hg.plugins;
  }
}

// READABLE (for understanding):
function getInstalledPlugins() {
  // Return cached data if available
  if (installedPluginsCache !== null) {
    return installedPluginsCache.plugins;
  }

  const registryPath = getInstalledPluginsPath();

  try {
    const rawData = readRegistryFile();
    if (!rawData) {
      log(`installed_plugins.json doesn't exist at ${registryPath}`);
      installedPluginsCache = { version: 1, plugins: {} };
      return installedPluginsCache.plugins;
    }

    // Handle V2 format (if feature flag enabled, V2 is read)
    if (rawData.version === 2) {
      const v2Data = installedPluginsV2Schema.parse(rawData.data);
      const v1Plugins = convertV2ToV1(v2Data);
      installedPluginsCache = { version: 1, plugins: v1Plugins };
      return v1Plugins;
    }

    // Standard V1 format
    const v1Data = installedPluginsV1Schema.parse(rawData.data);
    installedPluginsCache = v1Data;
    log(`Loaded ${Object.keys(v1Data.plugins).length} installed plugins`);
    return v1Data.plugins;
  } catch (error) {
    log(`Failed to load installed_plugins.json: ${error.message}`, { level: "error" });
    installedPluginsCache = { version: 1, plugins: {} };
    return installedPluginsCache.plugins;
  }
}

// Returns: Record<PluginId, InstallEntry>
// {
//   "code-formatter@official": {
//     version: "1.2.0",
//     installedAt: "2024-01-15T10:30:00Z",
//     installPath: "~/.claude/plugins/cache/...",
//     gitCommitSha: "abc123"
//   }
// }

// Mapping: QVA→getInstalledPlugins, hg→installedPluginsCache, dI1→getInstalledPluginsPath,
//          ajA→readRegistryFile, $LA→installedPluginsV1Schema, AB1→installedPluginsV2Schema
```

### Save Installed Plugins (V1)

```javascript
// ============================================
// saveInstalledPlugins - Save V1 installed plugins
// Location: chunks.143.mjs:3492-3511
// ============================================

// ORIGINAL (for source lookup):
function cI1(A) {
  let Q = RA(),
      B = dI1();
  try {
    let G = Xx(MQ(), "plugins");
    if (!Q.existsSync(G)) Q.mkdirSync(G);

    let Z = { version: 1, plugins: A },
        I = JSON.stringify(Z, null, 2);
    Q.writeFileSync(B, I, { encoding: "utf-8", flush: !0 });
    hg = Z;  // Update cache
    g(`Saved ${Object.keys(A).length} installed plugins`);
  } catch (G) {
    throw Error(`Failed to save installed_plugins.json: ${G.message}`);
  }
}

// READABLE (for understanding):
function saveInstalledPlugins(plugins) {
  const fs = getFs();
  const registryPath = getInstalledPluginsPath();

  try {
    // Ensure plugins directory exists
    const pluginsDir = path.join(getClaudeDataDirectory(), "plugins");
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir);
    }

    const data = { version: 1, plugins };
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(registryPath, json, { encoding: "utf-8", flush: true });

    // Update cache
    installedPluginsCache = data;
    log(`Saved ${Object.keys(plugins).length} installed plugins`);
  } catch (error) {
    throw Error(`Failed to save installed_plugins.json: ${error.message}`);
  }
}

// Mapping: cI1→saveInstalledPlugins, dI1→getInstalledPluginsPath, hg→installedPluginsCache
```

---

## V1 vs V2 Schema

### V1 Schema (Current Default)

```javascript
// installed_plugins.json
{
  "version": 1,
  "plugins": {
    "plugin-name@marketplace": {
      "version": "1.2.0",
      "installedAt": "2024-01-15T10:30:00Z",
      "lastUpdated": "2024-02-01T14:22:00Z",
      "installPath": "/Users/.../plugins/cache/.../1.2.0",
      "gitCommitSha": "abc123def456",
      "isLocal": false
    }
  }
}
```

### V2 Schema (Feature-Gated)

```javascript
// installed_plugins_v2.json
{
  "version": 2,
  "plugins": {
    "plugin-name@marketplace": [
      {
        "scope": "user",
        "projectPath": null,
        "installPath": "/Users/.../plugins/cache/.../1.2.0",
        "version": "1.2.0",
        "installedAt": "2024-01-15T10:30:00Z",
        "gitCommitSha": "abc123def456"
      },
      {
        "scope": "project",
        "projectPath": "/Users/user/my-project",
        "installPath": "/Users/user/my-project/.claude/plugins/...",
        "version": "1.1.0",
        "installedAt": "2024-01-10T08:00:00Z"
      }
    ]
  }
}
```

**Key insight:** V2 allows multiple installations of the same plugin at different scopes (user, project, managed, local), enabling project-specific plugin versions.

### Get Versioned Plugins (V2)

```javascript
// ============================================
// getVersionedPlugins - Get V2 installed plugins
// Location: chunks.143.mjs:3537-3541
// ============================================

// ORIGINAL (for source lookup):
function yQA() {
  if (T$ !== null) return T$;
  if (o2("tengu_enable_versioned_plugins")) return KS3();  // Load V2
  return DS3();  // Fallback: wrap V1 as V2
}

// READABLE (for understanding):
function getVersionedPlugins() {
  if (versionedPluginsCache !== null) {
    return versionedPluginsCache;
  }

  if (isFeatureEnabled("tengu_enable_versioned_plugins")) {
    return loadVersionedPluginsV2();  // Native V2 loading
  }

  return loadVersionedPluginsFromV1();  // Convert V1 to V2 format
}

// Mapping: yQA→getVersionedPlugins, T$→versionedPluginsCache,
//          o2→isFeatureEnabled, KS3→loadVersionedPluginsV2, DS3→loadVersionedPluginsFromV1
```

### V1 to V2 Migration

```javascript
// ============================================
// convertV1ToV2 - Migrate V1 registry to V2
// Location: chunks.143.mjs:3513-3531
// ============================================

// ORIGINAL (for source lookup):
function $X0(A) {
  let Q = {};
  for (let [B, G] of Object.entries(A.plugins)) {
    let Z = JB1(B, G.version);  // Calculate versioned path
    Q[B] = [{
      scope: "user",
      installPath: Z,
      version: G.version,
      installedAt: G.installedAt,
      lastUpdated: G.lastUpdated,
      gitCommitSha: G.gitCommitSha,
      isLocal: G.isLocal
    }];
  }
  return { version: 2, plugins: Q };
}

// READABLE (for understanding):
function convertV1ToV2(v1Data) {
  const v2Plugins = {};

  for (const [pluginId, entry] of Object.entries(v1Data.plugins)) {
    const versionedPath = getPluginVersionPath(pluginId, entry.version);

    v2Plugins[pluginId] = [{
      scope: "user",  // V1 plugins are always user-scope
      installPath: versionedPath,
      version: entry.version,
      installedAt: entry.installedAt,
      lastUpdated: entry.lastUpdated,
      gitCommitSha: entry.gitCommitSha,
      isLocal: entry.isLocal
    }];
  }

  return { version: 2, plugins: v2Plugins };
}

// Mapping: $X0→convertV1ToV2, JB1→getPluginVersionPath
```

---

## State Functions

### Check if Plugin is Installed

```javascript
// ============================================
// isPluginInstalled - Check if plugin exists
// Location: chunks.143.mjs:3681-3683
// ============================================

// ORIGINAL (for source lookup):
function gg(A) {
  return zS3(A) !== void 0;  // Check registry entry exists
}

function zS3(A) {
  return QVA()[A];  // Get entry from registry
}

// READABLE (for understanding):
function isPluginInstalled(pluginId) {
  return getPluginEntry(pluginId) !== undefined;
}

function getPluginEntry(pluginId) {
  return getInstalledPlugins()[pluginId];
}

// Mapping: gg→isPluginInstalled, zS3→getPluginEntry
```

### Add Installed Plugin

```javascript
// ============================================
// addInstalledPlugin - Register new plugin
// Location: chunks.143.mjs:3685-3689
// ============================================

// ORIGINAL (for source lookup):
function M39(A, Q) {
  let B = QVA(),
      G = A in B;
  B[A] = Q;
  cI1(B);
  g(`${G ? "Updated" : "Added"} installed plugin: ${A}`);
}

// READABLE (for understanding):
function addInstalledPlugin(pluginId, installEntry) {
  const registry = getInstalledPlugins();
  const isUpdate = pluginId in registry;

  registry[pluginId] = installEntry;
  saveInstalledPlugins(registry);

  log(`${isUpdate ? "Updated" : "Added"} installed plugin: ${pluginId}`);
}

// Mapping: M39→addInstalledPlugin
```

### Remove Installed Plugin

```javascript
// ============================================
// removeInstalledPlugin - Unregister plugin
// Location: chunks.143.mjs:3691-3696
// ============================================

// ORIGINAL (for source lookup):
function O39(A) {
  let Q = QVA(),
      B = Q[A];
  if (B) {
    delete Q[A];
    cI1(Q);
    g(`Removed installed plugin: ${A}`);
  }
  return B;
}

// READABLE (for understanding):
function removeInstalledPlugin(pluginId) {
  const registry = getInstalledPlugins();
  const entry = registry[pluginId];

  if (entry) {
    delete registry[pluginId];
    saveInstalledPlugins(registry);
    log(`Removed installed plugin: ${pluginId}`);
  }

  return entry;  // Return for cache cleanup
}

// Mapping: O39→removeInstalledPlugin
```

---

## Settings Storage

### Enable/Disable Plugin

Plugin enabled state is stored in user settings:

```javascript
// Settings structure:
{
  "enabledPlugins": {
    "code-formatter@official": true,     // Explicitly enabled
    "debug-helper@official": false,       // Disabled
    // If not present, defaults to enabled
  }
}
```

### Get Enabled Settings

```javascript
// READABLE (for understanding):
function getEnabledPluginSettings() {
  const settings = readSettingsFile("userSettings");
  return settings?.enabledPlugins || {};
}

// Logic:
// - If plugin ID in enabledPlugins with value true → enabled
// - If plugin ID in enabledPlugins with value false → disabled
// - If plugin ID not in enabledPlugins → enabled (default)
```

### Toggle Plugin State

```javascript
// READABLE (for understanding):
async function togglePluginEnabled(pluginId, enabled) {
  const settings = readSettingsFile("userSettings") || {};
  const enabledPlugins = { ...settings.enabledPlugins } || {};

  if (enabled) {
    // Remove from settings (default is enabled)
    delete enabledPlugins[pluginId];
  } else {
    // Explicitly set to false
    enabledPlugins[pluginId] = false;
  }

  writeSettingsFile("userSettings", { enabledPlugins });

  // Clear caches to reload
  clearPluginCaches();
}
```

---

## State Synchronization

### Initialize Plugins

```javascript
// ============================================
// initializePlugins - Startup initialization
// Location: chunks.143.mjs:3665-3675
// ============================================

// ORIGINAL (for source lookup):
async function L39() {
  try {
    await qX0();  // Sync installed plugins
  } catch (A) {
    AA(A instanceof Error ? A : Error(String(A)));
  }

  if (o2("tengu_enable_versioned_plugins")) {
    let A = wX0();  // Get startup versioned plugins
    g(`Initialized versioned plugins system with ${Object.keys(A.plugins).length} plugins`);
  }
}

// READABLE (for understanding):
async function initializePlugins() {
  try {
    // Sync settings with installed registry
    await syncInstalledPlugins();
  } catch (error) {
    logError(error instanceof Error ? error : Error(String(error)));
  }

  if (isFeatureEnabled("tengu_enable_versioned_plugins")) {
    const plugins = getStartupVersionedPlugins();
    log(`Initialized versioned plugins with ${Object.keys(plugins.plugins).length} plugins`);
  }
}

// Mapping: L39→initializePlugins, qX0→syncInstalledPlugins, wX0→getStartupVersionedPlugins
```

### Sync Installed Plugins

```javascript
// ============================================
// syncInstalledPlugins - Sync settings with registry
// Location: chunks.144.mjs:3 (referenced)
// ============================================

// READABLE (for understanding):
async function syncInstalledPlugins() {
  const installed = getInstalledPlugins();
  const settings = readSettingsFile("userSettings") || {};
  const enabledPlugins = settings.enabledPlugins || {};

  let needsUpdate = false;

  // Check for plugins in settings but not installed
  for (const pluginId of Object.keys(enabledPlugins)) {
    if (pluginId.includes("@") && !(pluginId in installed)) {
      // Plugin in settings but not installed - this shouldn't happen
      // Could clean up orphaned settings here
    }
  }

  // Check for installed plugins not in settings
  for (const pluginId of Object.keys(installed)) {
    // Plugins are enabled by default if not in settings
    // No action needed - absence means enabled
  }

  if (needsUpdate) {
    writeSettingsFile("userSettings", { enabledPlugins });
  }
}

// Mapping: qX0→syncInstalledPlugins
```

---

## State Diagram

```
                    UNINSTALLED
                         │
                         │ /plugin install
                         ▼
              ┌──────────────────────┐
              │     INSTALLED        │
              │   (enabled: true)    │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         │ /plugin       │               │ /plugin
         │ disable       │               │ uninstall
         ▼               │               ▼
┌─────────────────┐      │        UNINSTALLED
│    DISABLED     │      │          (cache deleted)
│ (enabled: false)│      │
└────────┬────────┘      │
         │               │
         │ /plugin       │
         │ enable        │
         └───────────────┘
```

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `QVA` | getInstalledPlugins | chunks.143.mjs:3462 | Get V1 registry |
| `cI1` | saveInstalledPlugins | chunks.143.mjs:3492 | Save V1 registry |
| `yQA` | getVersionedPlugins | chunks.143.mjs:3537 | Get V2 registry |
| `q39` | saveVersionedPlugins | chunks.143.mjs:3594 | Save V2 registry |
| `gg` | isPluginInstalled | chunks.143.mjs:3681 | Check if installed |
| `zS3` | getPluginEntry | chunks.143.mjs:3677 | Get registry entry |
| `M39` | addInstalledPlugin | chunks.143.mjs:3685 | Register plugin |
| `O39` | removeInstalledPlugin | chunks.143.mjs:3691 | Unregister plugin |
| `L39` | initializePlugins | chunks.143.mjs:3665 | Startup init |
| `qX0` | syncInstalledPlugins | chunks.144.mjs:3 | Sync settings |
| `$X0` | convertV1ToV2 | chunks.143.mjs:3513 | V1→V2 migration |
| `$LA` | installedPluginsV1Schema | chunks.94.mjs:2614 | V1 schema |
| `AB1` | installedPluginsV2Schema | chunks.94.mjs:2626 | V2 schema |
| `hg` | installedPluginsCache | chunks.143.mjs | V1 cache variable |
| `T$` | versionedPluginsCache | chunks.143.mjs | V2 cache variable |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [schemas.md](./schemas.md) - Registry schemas
- [installation.md](./installation.md) - Plugin installation
- [loading.md](./loading.md) - Component loading
- [slash_command.md](./slash_command.md) - `/plugin` command
