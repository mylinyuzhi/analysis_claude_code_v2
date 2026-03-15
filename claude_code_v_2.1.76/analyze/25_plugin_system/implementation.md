# Implementation Report - Plugin System (Module 25)

## Overview

The Plugin System is the primary extensibility mechanism for Claude Code v2.1.38. It allows third-party developers to package tools, agents, skills, lifecycle hooks, MCP servers, and custom commands into a single distributable module. The system manages marketplace-based distribution, versioned caching, installation registry, and safe integration into the agent's core execution loop.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `loadPlugin` ($xY) - Core logic for caching and initializing a plugin from a marketplace entry
- `loadPluginManifest` (Pn4) - Parses plugin directory, discovers all components, validates paths
- `loadEnabledPlugins` (HxY) - Orchestrates loading all enabled plugins from settings + marketplaces
- `loadInlinePlugins` (OxY) - Loads session-only plugins from `--plugin-dir` CLI flag
- `loadPluginHooks` (Xn4) - Parses a `hooks.json` file, validates against schema
- `mergeHooks` (Dn4) - Merges plugin hooks into existing hook configuration
- `fetchAndCacheMarketplace` (RyA) - Downloads/clones marketplace source and caches it
- `installMarketplaceSource` (wE) - Installs marketplace with enterprise policy enforcement
- `removeMarketplaceSource` (OG6) - Removes marketplace and cleans all related settings
- `refreshMarketplace` (St) - Refreshes marketplace from its source
- `lookupPluginEntry` (a0) - Finds a plugin in installed marketplaces
- `downloadAndCachePlugin` (F51) - Downloads a remote plugin to local cache
- `copyPluginToVersionedCache` (JG6) - Copies plugin to versioned cache path
- `buildPluginCacheKey` (RB) - Builds `~/.claude/cache/{marketplace}/{plugin}/{version}` path
- `resolvePluginVersion` (od) - Determines version from manifest, explicit setting, or git SHA
- `installPlugin` (ug1) - Full installation flow: download → cache → enable in settings
- `getAllMcpServersWithPlugins` (zG1) - Merges plugin MCP configs with system MCP configs
- `loadPluginMcpServers` (VU7) - Loads MCP server configs from a specific plugin
- `getInstalledPluginsState` (uM) - Reads `installed_plugins.json` with in-memory cache
- `savePluginInstallation` (hXA) - Records plugin installation metadata to registry
- `cleanupOrphanedPluginCache` (kyA) - Garbage-collects stale plugin cache dirs
- `isMarketplaceAllowed` (Fq1) - Enterprise policy: checks if a marketplace source is permitted
- `isExplicitlyBlocked` (nb1) - Enterprise policy: checks if source is on block list

---

## Plugin Architecture: Complete Picture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PLUGIN SYSTEM ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────────┘

 settings.json                ~/.claude/                        Runtime
 ─────────────               ──────────────────               ──────────
 enabledPlugins:             known_marketplaces.json           Agent Loop
  "myplugin@mymarket": true  marketplaces/                      │
                              └─ mymarket/                      │
                                  └─ .claude-plugin/            │
                                      └─ marketplace.json       │
                                                                │
 ┌───────────────┐  resolve  ┌─────────────────┐  load    ┌───▼────────────┐
 │loadEnabledPlu-│──────────▶│lookupPluginEntry│─────────▶│  loadPlugin    │
 │   gins (HxY)  │           │    (a0/yyA)     │          │    ($xY)       │
 └───────────────┘           └─────────────────┘          └───────┬────────┘
                                                                   │
                                          ┌────────────────────────▼──────────┐
                                          │      Versioned Cache Layer        │
                                          │  buildPluginCacheKey (RB):        │
                                          │  ~/.claude/cache/                  │
                                          │    {marketplace}/                  │
                                          │      {plugin}/                     │
                                          │        {version}/                  │
                                          │  (copyPluginToVersionedCache JG6) │
                                          └────────────────────────┬──────────┘
                                                                   │
                                          ┌────────────────────────▼──────────┐
                                          │    loadPluginManifest (Pn4)       │
                                          │  Discovers components:             │
                                          │  ├─ commands (slash cmds)         │
                                          │  ├─ agents (custom agents)        │
                                          │  ├─ skills (prompt skills)        │
                                          │  ├─ hooks (lifecycle hooks)       │
                                          │  ├─ outputStyles                   │
                                          │  └─ MCP servers (.mcp.json)       │
                                          └───────────────────────────────────┘
```

---

## Phase 1: Settings-Driven Discovery (`HxY`)

### How Enabled Plugins Are Identified

Plugin enablement is stored in settings files (user/project/local) under `enabledPlugins`:

```json
{
  "enabledPlugins": {
    "myplugin@mymarket": true,
    "disabled-plugin@mymarket": false
  }
}
```

The key format is `pluginName@marketplaceName`. The `HxY` function orchestrates discovery:

```javascript
// ============================================
// loadEnabledPlugins - Load all enabled plugins from settings
// Location: chunks.143.mjs:1118-1165
// ============================================

// ORIGINAL (for source lookup):
async function HxY() {
    let q = C8().enabledPlugins || {},
        K = [], Y = [],
        z = Object.entries(q).filter(([H, $]) => zA1.safeParse(H).success && $ !== void 0),
        w = await n5();
    for (let [H, $] of z) try {
        let [O, _] = H.split("@"), J = w[_];
        if (J && !Fq1(J.source)) {
            // Enterprise policy violation - push error
            Y.push({ type: "marketplace-blocked-by-policy", ... });
            continue
        }
        let X = yyA(H);
        if (!X) {
            Y.push({ type: "plugin-not-found", source: H, ... });
            continue
        }
        let D = await $xY(X.entry, X.marketplaceInstallLocation, H, $ === true, Y);
        if (D) K.push(D)
    } catch (O) { Y.push({ type: "generic-error", source: H, error: ... }) }
    return { plugins: K, errors: Y }
}

// READABLE (for understanding):
async function loadEnabledPlugins() {
    let settings = getMergedSettings().enabledPlugins || {};
    let plugins = [], errors = [];
    let validEntries = Object.entries(settings).filter(
        ([key, val]) => pluginKeySchema.safeParse(key).success && val !== undefined
    );
    let installedMarketplaces = await getMarketplaceConfig();

    for (let [pluginId, isEnabled] of validEntries) {
        let [pluginName, marketplaceName] = pluginId.split("@");
        let marketplaceInfo = installedMarketplaces[marketplaceName];

        // Enterprise policy: block if marketplace not allowed
        if (marketplaceInfo && !isMarketplaceAllowed(marketplaceInfo.source)) {
            errors.push({ type: "marketplace-blocked-by-policy", ... });
            continue;
        }

        // Find the plugin entry in cached marketplace data
        let pluginEntry = lookupPluginEntryFromCache(pluginId);
        if (!pluginEntry) {
            errors.push({ type: "plugin-not-found", ... });
            continue;
        }

        // Load and cache the plugin
        let plugin = await loadPlugin(pluginEntry.entry, pluginEntry.marketplaceInstallLocation,
                                     pluginId, isEnabled === true, errors);
        if (plugin) plugins.push(plugin);
    }
    return { plugins, errors };
}

// Mapping: HxY→loadEnabledPlugins, C8→getMergedSettings, Fq1→isMarketplaceAllowed,
//   yyA→lookupPluginEntryFromCache, $xY→loadPlugin
```

**Key insight:** Plugin loading includes disabled plugins too (with `enabled: false`) to show users what plugins are available. The `iY` memoized function then filters: `plugins.filter(p => p.enabled)` for the active set. Disabled plugins are tracked so the UI can show them as toggleable.

---

## Phase 2: Plugin Entry Resolution

### Two-Level Cache Strategy for Lookup

Plugin entry lookup uses a two-phase approach (`a0` → `yyA`):

```javascript
// ============================================
// lookupPluginEntry - Find plugin in installed marketplaces (with fallback)
// Location: chunks.143.mjs:322-343
// ============================================

// ORIGINAL:
async function a0(A) {
    let q = yyA(A);          // Phase 1: Check in-memory cache
    if (q) return q;
    let K = A.split("@");    // Phase 2: Async marketplace load
    let Y = K[0], z = K[1];
    try {
        let H = (await n5())[z];  // Get marketplace config
        if (!H) return null;
        let O = (await NZ(z)).plugins.find((_) => _.name === Y); // Memoized load
        if (!O) return null;
        return { entry: O, marketplaceInstallLocation: H.installLocation }
    } catch (w) {
        h(`Could not find plugin ${A}: ${w.message}`, { level: "debug" });
        return null;
    }
}

// READABLE:
async function lookupPluginEntry(pluginKey) {
    // Fast path: check in-memory/filesystem cache
    let cached = lookupPluginEntryFromCache(pluginKey);
    if (cached) return cached;

    // Slow path: async load marketplace data
    let [pluginName, marketplaceName] = pluginKey.split("@");
    let marketplaceConfig = (await getMarketplaceConfig())[marketplaceName];
    if (!marketplaceConfig) return null;

    let marketplaceData = await getMarketplaceCached(marketplaceName); // Memoized
    let pluginEntry = marketplaceData.plugins.find(p => p.name === pluginName);
    if (!pluginEntry) return null;

    return { entry: pluginEntry, marketplaceInstallLocation: marketplaceConfig.installLocation };
}

// Mapping: a0→lookupPluginEntry, yyA→lookupPluginEntryFromCache,
//   n5→getMarketplaceConfig, NZ→getMarketplaceCached
```

**Why two phases:** `yyA` reads from `known_marketplaces.json` (a fast filesystem cache), while `a0` falls back to loading the full marketplace data. This avoids async operations in the hot path when the data is already cached.

---

## Phase 3: Versioned Caching (`JG6`, `RB`)

### Cache Key Construction (`RB`)

```javascript
// ============================================
// buildPluginCacheKey - Construct versioned cache path
// Location: chunks.143.mjs:585-592
// ============================================

// ORIGINAL:
function RB(A, q) {
    let K = Uq1(),                                // ~/.claude/cache
        [Y, z] = A.split("@"),                    // "pluginName" + "marketplaceName"
        w = (z || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"),
        H = (Y || A).replace(/[^a-zA-Z0-9\-_]/g, "-"),
        $ = q.replace(/[^a-zA-Z0-9\-_.]/g, "-"); // version string
    return $9(K, w, H, $)
}

// READABLE:
function buildPluginCacheKey(pluginId, version) {
    let cacheBase = getPluginCacheDir();  // ~/.claude/cache
    let [pluginName, marketplaceName] = pluginId.split("@");
    let safeMarket = (marketplaceName || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-");
    let safeName = (pluginName || pluginId).replace(/[^a-zA-Z0-9\-_]/g, "-");
    let safeVersion = version.replace(/[^a-zA-Z0-9\-_.]/g, "-");
    return path.join(cacheBase, safeMarket, safeName, safeVersion);
}

// Mapping: RB→buildPluginCacheKey, Uq1→getPluginCacheDir
// Example: "myplugin@mymarket" version "abc123" →
//   ~/.claude/cache/mymarket/myplugin/abc123/
```

### Version Resolution (`od`)

Version is determined in priority order:

```javascript
// ============================================
// resolvePluginVersion - Determine plugin version for cache key
// Location: chunks.143.mjs:448-459
// ============================================

// ORIGINAL:
async function od(A, q, K, Y, z) {
    if (K?.version) return K.version;          // 1. Manifest version
    if (z) return z;                            // 2. Explicit version in entry
    if (Y) {
        let w = await nIY(Y);                  // 3. Git SHA of marketplace dir
        if (w) return w.substring(0, 12);
    }
    return "unknown"                             // 4. Fallback
}

// READABLE:
async function resolvePluginVersion(pluginId, source, manifest, marketplaceDir, explicitVersion) {
    if (manifest?.version) return manifest.version;  // Prefer manifest-declared
    if (explicitVersion) return explicitVersion;     // Then entry-explicit
    if (marketplaceDir) {
        let sha = await getGitCommitSha(marketplaceDir);
        if (sha) return sha.substring(0, 12);        // First 12 chars of SHA
    }
    return "unknown";
}

// Mapping: od→resolvePluginVersion, nIY→getGitCommitSha
```

**Why this priority order:**
1. `manifest.version` is the most reliable - the plugin author explicitly declares it
2. `entry.version` allows marketplace curators to pin a specific version
3. Git SHA provides automatic versioning for git-hosted plugins without explicit versions
4. "unknown" is a fallback that still creates a cache entry (just not versioned)

### Cache Copy Mechanics (`JG6`)

```javascript
// ============================================
// copyPluginToVersionedCache - Copy plugin files to versioned cache
// Location: chunks.143.mjs:629-646
// ============================================

// ORIGINAL:
async function JG6(A, q, K, Y, z) {
    let w = b1(), H = RB(q, K);
    if (w.existsSync(H) && !w.isDirEmptySync(H))
        return H;  // Cache hit - return immediately
    if (w.existsSync(H) && w.isDirEmptySync(H))
        w.rmdirSync(H);  // Clean up empty remnant
    w.mkdirSync(jn4(H));  // Create parent dirs
    if (Y && typeof Y.source === "string" && z) {
        let O = IyA(z, Y.source);  // Path-traversal-safe resolution
        if (w.existsSync(O)) Bg1(O, H);  // Recursive copy
        else throw Error(`Plugin source directory not found: ${O}`);
    } else Bg1(A, H);  // Fallback: copy entire plugin dir
    // Strip .git directory from cache
    let $ = $9(H, ".git");
    if (w.existsSync($)) w.rmSync($, { recursive: true, force: true });
    return H;
}

// READABLE:
async function copyPluginToVersionedCache(sourceDir, pluginId, version, entry, marketplaceDir) {
    let cachePath = buildPluginCacheKey(pluginId, version);

    // Cache hit: return existing (IMMUTABLE once written)
    if (fs.existsSync(cachePath) && !fs.isDirEmptySync(cachePath))
        return cachePath;

    // Create the versioned directory
    fs.mkdirSync(path.dirname(cachePath), { recursive: true });

    if (entry && typeof entry.source === "string" && marketplaceDir) {
        // For local-source entries: copy only the plugin subdirectory
        let resolvedPath = pathTraversalSafeJoin(marketplaceDir, entry.source);
        copyDirectoryRecursive(resolvedPath, cachePath);
    } else {
        // Fallback: copy the entire plugin directory
        copyDirectoryRecursive(sourceDir, cachePath);
    }

    // Strip .git to reduce cache size and avoid confusion
    let gitDir = path.join(cachePath, ".git");
    if (fs.existsSync(gitDir)) fs.rmSync(gitDir, { recursive: true, force: true });

    return cachePath;
}

// Mapping: JG6→copyPluginToVersionedCache, RB→buildPluginCacheKey,
//   Bg1→copyDirectoryRecursive, IyA→pathTraversalSafeJoin
```

**Key insight - Cache Immutability:** Once a versioned cache entry is created (non-empty directory exists), it is NEVER overwritten. This means:
- A running session uses its immutable copy even if the plugin is updated on disk
- The cache acts as a "snapshot" of the plugin at the time of load
- Hot-reload (for hook files only) is an exception handled at a higher level

---

## Phase 4: Component Discovery (`Pn4`)

### The `loadPluginManifest` Function Deep Dive

This is the most complex function in the plugin system. It discovers all components a plugin provides:

**Component Discovery Pattern (used for all component types):**
1. If manifest declares the component explicitly → resolve paths, validate existence, log warnings on missing
2. If manifest doesn't declare it → check the standard directory location
3. Errors are recorded but don't stop loading of other components

```javascript
// ============================================
// loadPluginManifest - Full component discovery from plugin directory
// Location: chunks.143.mjs:889-1105
// ============================================

// Component discovery order in source:
// 1. commands: manifest.commands || {pluginDir}/commands/ directory
// 2. agents:   manifest.agents   || {pluginDir}/agents/ directory
// 3. skills:   manifest.skills   || {pluginDir}/skills/ directory
// 4. outputStyles: manifest.outputStyles || {pluginDir}/output-styles/ directory
// 5. hooks:    {pluginDir}/hooks/hooks.json (auto) + manifest.hooks (additional)

// For commands, two manifest formats are supported:
// Format A: Object with source/content per command:
//   { commands: { "myCmd": { source: "commands/myCmd.md", description: "..." } } }
// Format B: Array of paths:
//   { commands: ["commands/myCmd.md", "commands/otherCmd.md"] }
```

**Two-source manifest merging (strict mode):**

When a plugin has BOTH a `plugin.json` AND marketplace entry component declarations, the `strict` flag controls behavior:
- `strict: true` (default): Conflict → error, plugin not loaded
- `strict: false`: Marketplace entry augments plugin.json (merge instead of error)
- No `plugin.json`: Marketplace entry serves as the manifest entirely

This is critical for marketplace-curated plugins where the marketplace may add commands not in the plugin's own manifest.

---

## Phase 5: MCP Server Integration

### Plugin MCP Server Loading (`VU7`, `b0A`, `BN9`, `bN9`)

Plugins can provide MCP servers to Claude Code. These servers are loaded and merged with the system MCP config:

```javascript
// ============================================
// loadPluginMcpServers - Load MCP servers from a plugin
// Location: chunks.87.mjs:1697-1704
// ============================================

// ORIGINAL:
async function VU7(A, q = []) {
    if (!A.enabled) return;
    let K = A.mcpServers || await b0A(A, q);
    if (!K) return;
    let Y = {};
    for (let [z, w] of Object.entries(K)) Y[z] = BN9(w, A.path, void 0, q, A.name, z);
    return bN9(Y, A.name)
}

// READABLE:
async function loadPluginMcpServers(plugin, errors = []) {
    if (!plugin.enabled) return;  // Disabled plugins don't contribute MCP servers

    // MCP servers can come from:
    // 1. plugin.mcpServers already set (from loadPlugin)
    // 2. .mcp.json file in plugin root
    // 3. manifest.mcpServers (string path, array, or inline config)
    let mcpServers = plugin.mcpServers || await resolvePluginMcpConfig(plugin, errors);
    if (!mcpServers) return;

    // Expand variables in all server configs
    let expanded = {};
    for (let [name, config] of Object.entries(mcpServers))
        expanded[name] = expandMcpServerVariables(config, plugin.path, undefined, errors, plugin.name, name);

    // Namespace servers: "plugin:{pluginName}:{serverName}" with scope: "dynamic"
    return namespaceMcpServers(expanded, plugin.name);
}

// Mapping: VU7→loadPluginMcpServers, b0A→resolvePluginMcpConfig,
//   BN9→expandMcpServerVariables, bN9→namespaceMcpServers
```

### Variable Expansion in Plugin MCP Configs (`BN9`)

Plugin MCP configs support two special variables:
- `${CLAUDE_PLUGIN_ROOT}` → expanded to the plugin's install path (`Iu1`)
- `${user_config.KEY}` → expanded from user-provided config values (`uN9`)

```javascript
// Example plugin MCP server config in plugin.json:
{
  "mcpServers": {
    "myserver": {
      "command": "${CLAUDE_PLUGIN_ROOT}/bin/server",
      "args": ["--data-dir", "${user_config.dataPath}"],
      "env": { "CLAUDE_PLUGIN_ROOT": "${CLAUDE_PLUGIN_ROOT}" }
    }
  }
}
// After expansion → command is "/path/to/cached/plugin/bin/server"
```

### MCP Server Namespace Format

All plugin MCP servers are prefixed: `plugin:{pluginName}:{serverName}` with `scope: "dynamic"`.

This namespacing:
1. Prevents collisions between plugins and system MCP configs
2. Allows the MCP manager to identify which plugin a server came from
3. The `scope: "dynamic"` marks them as runtime-injected (not from static settings files)

### Full MCP Merge Order (`zG1`)

```
Enterprise mode:           Only enterprise servers (filtered by allowlist)
Normal mode:               Plugin MCPs + User MCPs + Project MCPs + Local MCPs
                           + claude.ai MCP servers (if OAuth scope present)
Priority:                  Local overrides Project overrides User overrides Plugin
```

---

## Phase 6: Inline Plugins (`OxY`)

The `--plugin-dir` CLI flag enables session-only plugins without marketplace installation:

```javascript
// ============================================
// loadInlinePlugins - Load session-only plugins from --plugin-dir
// Location: chunks.143.mjs:1458-1500
// ============================================

// ORIGINAL:
async function OxY(A) {
    if (A.length === 0) return { plugins: [], errors: [] };
    let q = [], K = [], Y = b1();
    for (let [z, w] of A.entries()) try {
        let H = tIY(w);  // path.resolve(w) - normalize path
        if (!Y.existsSync(H)) {
            K.push({ type: "path-not-found", source: `inline[${z}]`, ... });
            continue
        }
        let $ = eIY(H),  // path.basename(H) - directory name as plugin name
            { plugin: O, errors: _ } = Pn4(H, `${$}@inline`, true, $);
        O.source = `${O.name}@inline`, O.repository = `${O.name}@inline`;
        q.push(O), K.push(..._)
    } catch (H) { K.push({ type: "generic-error", ... }) }
    return { plugins: q, errors: K }
}

// READABLE:
async function loadInlinePlugins(pluginDirPaths) {
    if (pluginDirPaths.length === 0) return { plugins: [], errors: [] };
    let plugins = [], errors = [];
    for (let [idx, rawPath] of pluginDirPaths.entries()) {
        let resolvedPath = path.resolve(rawPath);  // tIY = path.resolve
        if (!fs.existsSync(resolvedPath)) {
            errors.push({ type: "path-not-found", source: `inline[${idx}]`, path: resolvedPath });
            continue;
        }
        let pluginName = path.basename(resolvedPath);  // eIY = path.basename
        let { plugin, errors: pluginErrors } = loadPluginManifest(
            resolvedPath, `${pluginName}@inline`, true /* enabled */, pluginName
        );
        // Mark as inline so it's never cached or persisted
        plugin.source = `${plugin.name}@inline`;
        plugin.repository = `${plugin.name}@inline`;
        plugins.push(plugin);
        errors.push(...pluginErrors);
    }
    return { plugins, errors };
}

// Mapping: OxY→loadInlinePlugins, tIY→path.resolve (alias), eIY→path.basename (alias)
```

**Key difference from marketplace plugins:**
- Inline plugins are NOT cached (loaded directly from the source path)
- They use `source: "name@inline"` as a sentinel value
- They are always `enabled: true`
- They survive only for the current session (no `installed_plugins.json` entry)

---

## Phase 7: Full Plugin Load Orchestration (`iY`)

The memoized `iY` function is the top-level entry point that combines marketplace and inline plugins:

```javascript
// ============================================
// getLoadedPlugins (memoized) - Top-level plugin aggregation
// Location: chunks.143.mjs:1526-1543
// ============================================

// Initialization setup (VJ module):
iY = KA(async () => {  // KA = memoize
    let A = await HxY();  // Load marketplace plugins
    let q = [...A.plugins], K = [...A.errors];

    let Y = $61();  // getInlinePlugins() - from state
    if (Y.length > 0) {
        let w = await OxY(Y);  // Load --plugin-dir plugins
        q.push(...w.plugins);
        K.push(...w.errors);
    }

    let z = q.filter((w) => w.enabled);
    if (z.length > 0) u8("plugins");  // Register telemetry feature flag

    return {
        enabled: z,
        disabled: q.filter((w) => !w.enabled),
        errors: K
    };
});
```

---

## Installation Registry: `installed_plugins.json`

### File Format (V2)

Located at `~/.claude/installed_plugins.json`:

```json
{
  "version": 2,
  "plugins": {
    "myplugin@mymarket": [
      {
        "scope": "user",
        "installPath": "/Users/user/.claude/cache/mymarket/myplugin/abc123def456",
        "version": "abc123def456",
        "installedAt": "2024-01-15T10:30:00.000Z",
        "lastUpdated": "2024-01-15T10:30:00.000Z",
        "gitCommitSha": "abc123def456789..."
      }
    ]
  }
}
```

Each plugin can have multiple installation records (one per scope: `user`, `project`, `local`).

### V1 → V2 Migration (`tD9`, `yXA`)

V1 used a flat structure (`{plugins: {"name": {version, installPath}}}`). V2 supports multiple scopes per plugin. The migration (`yXA`) converts each V1 entry to a V2 entry with `scope: "user"`.

### Key Registry Functions

| Function | Obfuscated | Description |
|----------|-----------|-------------|
| `getInstalledPluginsState` | `uM` | Reads JSON with in-memory cache (`LB`) |
| `persistInstalledPlugins` | `x$6` | Writes JSON, invalidates cache |
| `savePluginInstallation` | `hXA` | Upserts one plugin's record |
| `removePluginInstallation` | `$b7` | Removes one scope record |
| `removePluginsByMarketplace` | `_b7` | Removes all plugins for a marketplace |
| `isPluginInstalled` | `BM` | Checks if metadata exists |
| `getInstalledPluginMetadata` | `eD9` | Returns first scope's metadata |
| `loadInstalledPlugins` | `ja` | Schema-parsed registry read |

---

## Cache Garbage Collection (`kyA`)

Over time, as plugins are updated, old versioned cache directories accumulate. The cleanup system uses a "mark and sweep" approach:

```javascript
// ============================================
// cleanupOrphanedPluginCache - GC stale cache directories
// Location: chunks.143.mjs:2950-2973
// ============================================

// Algorithm:
// 1. Build "live" set: all installPath values from installed_plugins.json
// 2. Walk ~/.claude/cache/{marketplace}/{plugin}/{version}/ directories
// 3. For each version dir NOT in the live set:
//    a. If .orphaned_at doesn't exist → create it (mark)
//    b. If .orphaned_at exists AND mtime > 7 days ago → delete dir (sweep)
//    c. After sweeping, remove empty {plugin}/ and {marketplace}/ parent dirs

// Constants:
// bIY = ".orphaned_at"    - marker file name
// uIY = 604800000         - 7 days in milliseconds (grace period)
```

**Why a 7-day grace period:** Prevents accidental deletion of cache entries that are:
- Still being used by a running session that hasn't updated `installed_plugins.json` yet
- Temporarily orphaned due to filesystem race conditions during updates
- Needed for rapid rollback if a new plugin version breaks something

---

## Security Architecture

### Path Traversal Prevention (`IyA`)

```javascript
// ============================================
// pathTraversalSafeJoin - Prevent path traversal attacks in plugin paths
// Location: chunks.143.mjs:475-479
// ============================================

// ORIGINAL:
function IyA(A, q) {
    let K = SyA(A, q),    // path.resolve(A, q)
        Y = SyA(A) + hyA; // path.resolve(A) + path.sep
    if (!K.startsWith(Y) && K !== SyA(A))
        throw Error(`Path traversal detected: "${q}" would escape the base directory`);
    return K
}

// READABLE:
function pathTraversalSafeJoin(baseDir, relativePath) {
    let resolved = path.resolve(baseDir, relativePath);
    let baseDirWithSep = path.resolve(baseDir) + path.sep;
    if (!resolved.startsWith(baseDirWithSep) && resolved !== path.resolve(baseDir))
        throw Error(`Path traversal detected: "${relativePath}" would escape the base directory`);
    return resolved;
}
```

This prevents a malicious plugin from declaring `source: "../../some-other-plugin"` to read files outside the marketplace directory.

### Enterprise Policy Enforcement (`Fq1`, `nb1`, `mq1`)

Three-layer policy check for marketplace installation:

```javascript
// Layer 1: Explicit block list
function isExplicitlyBlocked(source) {  // nb1
    let blockedList = getBlockedMarketplaces();  // policySettings.blockedMarketplaces
    if (blockedList === null) return false;
    return blockedList.some(blocked => marketplaceSourceEquals(source, blocked));
}

// Layer 2: Allow list check
function isMarketplaceAllowed(source) {  // Fq1
    if (isExplicitlyBlocked(source)) return false;   // Block list takes priority
    let allowList = getAllowedMarketplaceSources();   // policySettings.strictKnownMarketplaces
    if (allowList === null) return true;             // No policy = allow all
    return allowList.some(allowed => sourceMatchesAllowed(source, allowed));
}
```

**Policy decision matrix:**

| `blockedMarketplaces` | `strictKnownMarketplaces` | Source in block list | Source in allow list | Result |
|------------------------|--------------------------|---------------------|---------------------|--------|
| null | null | - | - | **ALLOW** (no policy) |
| [...] | null | Yes | - | **BLOCK** |
| null | [] | - | - | **BLOCK ALL** (empty allow list) |
| null | [...] | - | Yes | **ALLOW** |
| null | [...] | - | No | **BLOCK** |

### `allowManagedHooksOnly` Mode (`Ap`)

When enterprise policy sets `allowManagedHooksOnly: true`, all plugin hooks are disabled. Sessions still load (plugins provide commands/agents), but:
- SessionStart and Setup hook events skip plugin hook loading
- Plugin hooks registered via `hooksConfig` are not executed
- User-defined hooks in settings.json still run normally

---

## Error Taxonomy

Plugin loading errors are structured objects:

```typescript
type PluginError =
  | { type: "generic-error"; source: string; error: string }
  | { type: "path-not-found"; source: string; plugin: string; path: string; component: string }
  | { type: "hook-load-failed"; source: string; plugin: string; hookPath: string; reason: string }
  | { type: "plugin-not-found"; source: string; pluginId: string; marketplace: string }
  | { type: "marketplace-blocked-by-policy"; source: string; plugin: string; marketplace: string; blockedByBlocklist: boolean; allowedSources: string[] }
  | { type: "mcp-config-invalid"; source: string; plugin: string; serverName: string; validationError: string }
  | { type: "manifest-parse-error"; parseError: string }
  | { type: "manifest-validation-error"; validationErrors: string[] }
  | { type: "git-auth-failed"; authType: string; gitUrl: string }
  | { type: "git-timeout"; operation: string; gitUrl: string }
  | { type: "network-error"; url: string; details?: string }
```

The `TZ` function serializes these for logging/UI display.

---

## Key Architectural Insights

### 1. Distributed Capability Model

Claude Code acts as a host runtime. Plugins are "capability packages" that dynamically bind to the host. Unlike monolithic extension systems (VS Code), Claude plugins can modify:
- **What commands exist** (slash commands / skills)
- **What agents exist** (custom agent personas)
- **What tools run before/after LLM calls** (hooks)
- **What MCP servers are available** (tool providers)
- **How output is rendered** (output styles)

### 2. Immutable Versioned Cache = Session Stability

The cache key includes the version hash (manifest version > git SHA > "unknown"). Once a session loads version `abc123` of a plugin, it continues using that exact copy even if:
- The plugin is updated in the marketplace
- The user runs `plugin update` in another terminal
- The marketplace cache is refreshed

### 3. Non-Fatal Loading with Structured Error Collection

Every loading function returns `{ plugins, errors }` rather than throwing. Errors are collected and surfaced to diagnostics commands (`/plugin status`) rather than crashing the session. This is critical for usability: a broken plugin definition should never prevent Claude Code from starting.

### 4. Scope-Aware Installation

Each plugin can be installed at multiple scopes simultaneously:
- `user` scope → `~/.claude/settings.json` → available in all projects
- `project` scope → `.claude/settings.json` → scoped to current project
- `local` scope → `.claude/settings.local.json` → local overrides (not committed)

The installation registry tracks one metadata record per scope per plugin.
