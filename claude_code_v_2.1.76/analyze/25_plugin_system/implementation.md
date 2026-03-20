# Implementation Report - Plugin System (Module 25)

## Overview

The Plugin System is the primary extensibility mechanism for Claude Code v2.1.76. It allows third-party developers to package tools, agents, skills, lifecycle hooks, MCP servers, and custom commands into a single distributable module. The system manages marketplace-based distribution, versioned caching, installation registry, and safe integration into the agent's core execution loop.

**v2.1.76 Changes:**
- `git-subdir` source type added: clone only a subdirectory of a git repository
- `pathPattern` field added to `strictKnownMarketplaces` entries for URL-based pattern matching
- Plugins can now ship a `settings.json` file to provide default settings
- `pluginTrustMessage` managed setting added for enterprise trust display customization

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra

Key functions in this document:
- `loadPlugin` (sp6) - Core logic for caching and initializing a plugin from a marketplace entry
- `loadPluginManifest` (h24) - Parses plugin directory, discovers all components, validates paths
- `loadMarketplacePlugins` (ip9) - Loads all enabled plugins from marketplace sources
- `getLoadedPlugins` (_z) - Memoized function returning all enabled plugins
- `loadInlinePlugins` (rp9) - Loads session-only plugins from `--plugin-dir` CLI flag
- `loadPluginHooks` (N24) - Parses a `hooks.json` file, validates against schema
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
- `installPlugin` (fDq) - Full installation flow: download → cache → enable in settings
- `getAllMcpServersWithPlugins` (zG1) - Merges plugin MCP configs with system MCP configs
- `loadPluginMcpServers` (VU7) - Loads MCP server configs from a specific plugin
- `getInstalledPluginsState` (gI) - Reads `installed_plugins.json` with in-memory cache
- `savePluginInstallation` (Lk8) - Records plugin installation metadata to registry
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
 │loadMarketplace│──────────▶│lookupPluginEntry│─────────▶│  loadPlugin    │
 │Plugins (ip9)  │           │    (Qv/yyA)     │          │    (sp6)       │
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
                                          │    loadPluginManifest (h24)       │
                                          │  Discovers components:             │
                                          │  ├─ commands (slash cmds)         │
                                          │  ├─ agents (custom agents)        │
                                          │  ├─ skills (prompt skills)        │
                                          │  ├─ hooks (lifecycle hooks)       │
                                          │  ├─ outputStyles                   │
                                          │  ├─ settings.json (defaults) [NEW]│
                                          │  └─ MCP servers (.mcp.json)       │
                                          └───────────────────────────────────┘
```

---

## Phase 1: Settings-Driven Discovery (`ip9`)

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

The key format is `pluginName@marketplaceName`. The `ip9` function orchestrates discovery:

```javascript
// ============================================
// loadMarketplacePlugins - Load all enabled plugins from marketplace sources
// Location: chunks.95.mjs:441-500
// ============================================

// ORIGINAL (for source lookup):
async function ip9() {
    let A = PA(),
        q = { ...pp6(), ...A.enabledPlugins || {} },
        K = [], Y = [],
        z = Object.entries(q).filter(([D, X]) => {
            if (!XJ6().safeParse(D).success || X === void 0) return !1;
            let { marketplace: W } = n3(D);
            return W !== tp6
        }),
        _ = await eW6(),  // Get marketplace configs
        w = Ke(),          // Allowed sources
        O = Gk8(),         // Blocklist
        $ = w !== null || O !== null && O.length > 0;
    // ... filter and load plugins ...
}

// READABLE (for understanding):
async function loadMarketplacePlugins() {
    let settings = getMergedSettings();
    let enabledPlugins = { ...getInlinePlugins(), ...settings.enabledPlugins || {} };
    let plugins = [], errors = [];

    // Filter valid plugin entries
    let validEntries = Object.entries(enabledPlugins).filter(([key, val]) => {
        if (!pluginKeySchema.safeParse(key).success || val === undefined) return false;
        let { marketplace } = parsePluginKey(key);
        return marketplace !== INLINE_PLUGIN_MARKER;
    });

    let marketplaceConfigs = await getInstalledMarketplaces();
    let allowedSources = getAllowedMarketplaceSources();
    let blockedHosts = getBlockedMarketplaces();
    let hasPolicyRestrictions = allowedSources !== null || blockedHosts?.length > 0;

    // ... process each plugin entry ...
    return { plugins, errors };
}

// Mapping: ip9→loadMarketplacePlugins, PA→getMergedSettings, pp6→getInlinePlugins,
//   XJ6→pluginKeySchema, n3→parsePluginKey, eW6→getInstalledMarketplaces,
//   Ke→getAllowedMarketplaceSources, Gk8→getBlockedMarketplaces
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

## Phase 4: Component Discovery (`h24`)

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
// 6. settings.json: {pluginDir}/settings.json → plugin-provided default settings [v2.1.76]

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

### Plugin-Shipped Default Settings (v2.1.76)

In v2.1.76, plugins can include a `settings.json` file in their plugin root to provide default settings. These defaults are loaded during manifest discovery and merged with the user's settings (with user settings taking priority):

```
plugin-root/
├── .claude-plugin/
│   └── plugin.json        # Manifest
├── settings.json          # [NEW] Default settings provided by plugin
├── commands/
├── hooks/
└── ...
```

**Key design:** Plugin-provided defaults are the lowest priority — they are overridden by user, project, and local settings. This allows plugins to set sensible defaults without imposing restrictions on users.

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
            { plugin: O, errors: _ } = h24(H, `${$}@inline`, true, $);
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

// Mapping: OxY→loadInlinePlugins, tIY→path.resolve (alias), eIY→path.basename (alias), h24→loadPluginManifest
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
    let A = await ip9();  // Load marketplace plugins
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

**v2.1.76: `pathPattern` in `strictKnownMarketplaces`**

In addition to the existing `hostPattern` type, v2.1.76 adds a `pathPattern` field to `strictKnownMarketplaces` entries. This allows matching marketplace URLs by URL path substring or regex, not just by hostname:

```json
{
  "strictKnownMarketplaces": [
    {
      "source": "github",
      "repo": "myorg/internal-plugins"
    },
    {
      "source": "hostPattern",
      "hostPattern": "*.myorg.com",
      "pathPattern": "/plugins/"
    }
  ]
}
```

The `pathPattern` field is checked against the URL path portion of the marketplace source. This allows more granular whitelisting: for example, allowing only URLs under a specific path prefix on an internal server.

**Policy decision matrix:**

| `blockedMarketplaces` | `strictKnownMarketplaces` | Source in block list | Source in allow list | Result |
|------------------------|--------------------------|---------------------|---------------------|--------|
| null | null | - | - | **ALLOW** (no policy) |
| [...] | null | Yes | - | **BLOCK** |
| null | [] | - | - | **BLOCK ALL** (empty allow list) |
| null | [...] | - | Yes | **ALLOW** |
| null | [...] | - | No | **BLOCK** |

### `pluginTrustMessage` Managed Setting (v2.1.76)

Enterprises can customize the trust message shown to users when a plugin is installed from an external source. This is controlled via `pluginTrustMessage` in `managedSettings`:

```json
{
  "managedSettings": {
    "pluginTrustMessage": "This plugin has been approved by your IT department."
  }
}
```

When set, this message replaces the default trust warning, allowing enterprises to signal that a plugin is pre-approved.

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

## Deep Analysis: Component Discovery Algorithm (h24)

### The `loadPluginManifest` Function Deep Dive

The `loadPluginManifest` function is the most complex function in the plugin system. It discovers all components a plugin provides through a systematic discovery pattern.

### Component Discovery Order

The function processes components in this exact order:

```
1. commands    → manifest.commands || {pluginDir}/commands/
2. agents      → manifest.agents   || {pluginDir}/agents/
3. skills      → manifest.skills   || {pluginDir}/skills/
4. outputStyles → manifest.outputStyles || {pluginDir}/output-styles/
5. hooks       → {pluginDir}/hooks/hooks.json (auto) + manifest.hooks (additional)
6. settings    → {pluginDir}/settings.json [v2.1.76]
```

### Discovery Pattern (Used for All Component Types)

For each component type, the algorithm follows this pattern:

```javascript
// ============================================
// Component Discovery Pattern - Pseudocode
// ============================================

async function discoverComponent(pluginDir, manifest, componentType) {
    let componentPaths = [];
    let errors = [];

    // Step 1: Check manifest declaration
    if (manifest[componentType]) {
        // Format A: Object with source/content per item
        if (typeof manifest[componentType] === 'object' && !Array.isArray(manifest[componentType])) {
            for (let [name, config] of Object.entries(manifest[componentType])) {
                if (config.source) {
                    // Resolve source path relative to plugin directory
                    let resolvedPath = path.join(pluginDir, config.source);
                    if (!fs.existsSync(resolvedPath)) {
                        errors.push({
                            type: "path-not-found",
                            component: componentType,
                            path: resolvedPath
                        });
                        continue;  // Continue loading other components
                    }
                    componentPaths.push({ name, path: resolvedPath, config });
                } else if (config.content) {
                    // Inline content - no file resolution needed
                    componentPaths.push({ name, content: config.content, config });
                }
            }
        }
        // Format B: Array of paths
        else if (Array.isArray(manifest[componentType])) {
            for (let item of manifest[componentType]) {
                if (typeof item === 'string') {
                    let resolvedPath = path.join(pluginDir, item);
                    if (!fs.existsSync(resolvedPath)) {
                        errors.push({
                            type: "path-not-found",
                            component: componentType,
                            path: resolvedPath
                        });
                        continue;
                    }
                    componentPaths.push({ path: resolvedPath });
                }
            }
        }
        return { componentPaths, errors };
    }

    // Step 2: Check standard directory location
    let standardDir = path.join(pluginDir, componentType);
    if (fs.existsSync(standardDir)) {
        // Scan directory for component files
        componentPaths = await scanComponentDir(standardDir);
    }

    return { componentPaths, errors };
}
```

### Error Handling Strategy

**Key design decision:** Missing component files are NON-FATAL. The algorithm:

1. **Logs the error** - Records a structured error object
2. **Continues processing** - Does NOT throw or stop loading
3. **Surfaces in diagnostics** - Errors appear in `/plugin status` output

This ensures that a broken component definition doesn't prevent other components from loading.

```javascript
// Error structure:
interface ComponentError {
    type: "path-not-found" | "parse-error" | "validation-error";
    component: "commands" | "agents" | "skills" | "outputStyles" | "hooks";
    path?: string;
    reason?: string;
}
```

### Why This Approach

**Why continue on error:**
- Plugin authors might have typos in paths
- Marketplace curators might add components that don't exist in all plugin versions
- Users should see partial functionality rather than complete failure

**Why check manifest first:**
- Explicit declarations take precedence over convention
- Allows plugins to override standard directory names
- Supports inline content (no file needed)

**Why standard directory fallback:**
- Convention over configuration
- Simple plugins can just create `commands/` or `agents/` directories
- No manifest declarations needed for basic cases

### Source Code: loadPluginManifest

```javascript
// ============================================
// loadPluginManifest - Full component discovery
// Location: chunks.95.mjs:176-320
// ============================================

// ORIGINAL (for source lookup):
async function h24(A, q, K, Y, z = !0) {
    let _ = [], w = r3(A, ".claude-plugin", "plugin.json"), O = await $W1(w, Y, q), $ = {
        name: O.name, manifest: O, path: A, source: q, repository: q, enabled: K
    };
    // Commands discovery
    if (O.commands) {
        if (typeof O.commands === "object" && !Array.isArray(O.commands)) {
            for (let [M, W] of Object.entries(O.commands)) {
                if (W.source) {
                    let H = $9(A, W.source);
                    if (!await uK(H)) {
                        _.push({ type: "path-not-found", component: "commands", path: H });
                        continue;
                    }
                    $.commandsPath = $.commandsPath || $9(A, r3("commands"));
                }
            }
        } else if (Array.isArray(O.commands)) {
            // Array format handling...
        }
    }
    // Standard directory fallback
    if (!$.commandsPath) {
        let M = $9(A, "commands");
        if (await uK(M)) $.commandsPath = M;
    }
    // ... similar pattern for agents, skills, outputStyles, hooks ...
    return { plugin: $, errors: _ }
}

// READABLE (for understanding):
async function loadPluginManifest(pluginDir, source, enabled, pluginName, warnDuplicates = true) {
    let errors = [];
    let manifestPath = path.join(pluginDir, ".claude-plugin", "plugin.json");
    let manifest = await readManifestFile(manifestPath, pluginName, source);

    let plugin = {
        name: manifest.name,
        manifest: manifest,
        path: pluginDir,
        source: source,
        repository: source,
        enabled: enabled
    };

    // Discover each component type using the pattern above
    // commands, agents, skills, outputStyles, hooks...

    return { plugin, errors };
}

// Mapping: h24→loadPluginManifest, A→pluginDir, q→source, K→enabled, Y→pluginName,
//   z→warnDuplicates, r3→path.join, $W1→readManifestFile, uK→fileExists
```

---

## Deep Analysis: Versioned Cache Strategy

### Cache Key Construction

The versioned cache ensures that:
1. Different plugin versions have separate cache directories
2. Running sessions use immutable snapshots
3. Updates don't affect in-progress sessions

```javascript
// ============================================
// buildPluginCacheKey - Construct versioned cache path
// Location: chunks.143.mjs:585-592
// ============================================

// ORIGINAL (for source lookup):
function RB(A, q) {
    let K = Uq1(),                                // ~/.claude/cache
        [Y, z] = A.split("@"),                    // "pluginName" + "marketplaceName"
        w = (z || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"),
        H = (Y || A).replace(/[^a-zA-Z0-9\-_]/g, "-"),
        $ = q.replace(/[^a-zA-Z0-9\-_.]/g, "-"); // version string
    return $9(K, w, H, $)
}

// READABLE (for understanding):
function buildPluginCacheKey(pluginId, version) {
    let cacheBase = getPluginCacheDir();  // ~/.claude/cache
    let [pluginName, marketplaceName] = pluginId.split("@");
    let safeMarket = sanitizePathSegment(marketplaceName || "unknown");
    let safeName = sanitizePathSegment(pluginName || pluginId);
    let safeVersion = sanitizePathSegment(version);
    return path.join(cacheBase, safeMarket, safeName, safeVersion);
}

// Example: "myplugin@mymarket" version "abc123" →
//   ~/.claude/cache/mymarket/myplugin/abc123/

// Mapping: RB→buildPluginCacheKey, Uq1→getPluginCacheDir, $9→path.join
```

### Version Resolution Priority

Version is determined in priority order:

```javascript
// ============================================
// resolvePluginVersion - Determine version for cache key
// Location: chunks.143.mjs:448-459
// ============================================

// Priority order:
// 1. manifest.version - Most reliable (author-declared)
// 2. entry.version - Marketplace curator pin
// 3. Git SHA - Auto-derived for git-hosted plugins
// 4. "unknown" - Fallback

async function resolvePluginVersion(pluginId, source, manifest, marketplaceDir, explicitVersion) {
    // 1. Manifest version (highest priority)
    if (manifest?.version) return manifest.version;

    // 2. Explicit version in marketplace entry
    if (explicitVersion) return explicitVersion;

    // 3. Git SHA of marketplace directory
    if (marketplaceDir) {
        let sha = await getGitCommitSha(marketplaceDir);
        if (sha) return sha.substring(0, 12);  // First 12 chars
    }

    // 4. Fallback
    return "unknown";
}
```

### Cache Immutability

Once a versioned cache entry is created, it is **NEVER overwritten**:

```javascript
// ============================================
// copyPluginToVersionedCache - Cache hit check
// Location: chunks.143.mjs:629-646
// ============================================

// Cache hit: return immediately
if (fs.existsSync(cachePath) && !fs.isDirEmptySync(cachePath)) {
    return cachePath;  // IMMUTABLE - no re-copy
}
```

**Why this matters:**
1. Running sessions use their immutable copy
2. Updates in other terminals don't affect current session
3. Prevents race conditions between update and usage
4. Supports safe rollback to previous versions

### Cache Cleanup (Garbage Collection)

The cleanup system uses a "mark and sweep" approach:

```javascript
// ============================================
// cleanupOrphanedPluginCache - GC stale cache directories
// Location: chunks.143.mjs:2950-2973
// ============================================

// Algorithm:
// 1. Build "live" set from installed_plugins.json installPath values
// 2. Walk ~/.claude/cache/{marketplace}/{plugin}/{version}/ directories
// 3. For each version dir NOT in live set:
//    a. If .orphaned_at doesn't exist → create it (mark)
//    b. If .orphaned_at exists AND mtime > 7 days ago → delete dir (sweep)
// 4. After sweeping, remove empty parent dirs

// Why 7-day grace period:
// - Running sessions might still be using "orphaned" cache entries
// - Allows rollback if new version breaks something
// - Prevents accidental deletion during rapid updates
```

---

## Key Architectural Insights

### 1. Distributed Capability Model

Claude Code acts as a host runtime. Plugins are "capability packages" that dynamically bind to the host. Unlike monolithic extension systems (VS Code), Claude plugins can modify:
- **What commands exist** (slash commands / skills)
- **What agents exist** (custom agent personas)
- **What tools run before/after LLM calls** (hooks)
- **What MCP servers are available** (tool providers)
- **How output is rendered** (output styles)
- **What default settings apply** (settings.json, v2.1.76)

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

---

## Deep Analysis: getLoadedPlugins Orchestration

The `_z` (getLoadedPlugins) function is the top-level entry point that combines marketplace and inline plugins:

```javascript
// ============================================
// getLoadedPlugins - Top-level plugin aggregation (memoized)
// Location: chunks.95.mjs:965-998
// ============================================

// ORIGINAL (for source lookup):
_z = KA(async () => {
    let A = await ip9(),  // loadMarketplacePlugins
        q = [...A.plugins],
        K = [...A.errors];
    let Y = $61();  // getInlinePlugins() - from state
    if (Y.length > 0) {
        let w = await rp9(Y);  // loadInlinePlugins
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

// READABLE (for understanding):
getLoadedPlugins = memoize(async () => {
    // Load marketplace plugins
    let marketplaceResult = await loadMarketplacePlugins();
    let plugins = [...marketplaceResult.plugins];
    let errors = [...marketplaceResult.errors];

    // Load inline plugins (--plugin-dir CLI flag)
    let inlinePluginDirs = getInlinePlugins();
    if (inlinePluginDirs.length > 0) {
        let inlineResult = await loadInlinePlugins(inlinePluginDirs);
        plugins.push(...inlineResult.plugins);
        errors.push(...inlineResult.errors);
    }

    // Separate enabled vs disabled
    let enabled = plugins.filter(p => p.enabled);
    if (enabled.length > 0) registerTelemetryFeature("plugins");

    return {
        enabled,
        disabled: plugins.filter(p => !p.enabled),
        errors
    };
});

// Mapping: _z→getLoadedPlugins, KA→memoize, ip9→loadMarketplacePlugins,
//   $61→getInlinePlugins, rp9→loadInlinePlugins, u8→registerTelemetryFeature
```

**Key design decisions:**
1. **Memoization**: `KA` (memoize) ensures plugins are loaded once per session, avoiding redundant I/O
2. **Disabled plugins included**: The result includes disabled plugins so the UI can show them as toggleable
3. **Error aggregation**: All errors from marketplace and inline loading are collected, not thrown

---

## Deep Analysis: syncInstalledPlugins Migration

The `Rk8` (syncInstalledPlugins) function handles V1→V2 registry migration and state synchronization:

```javascript
// ============================================
// syncInstalledPlugins - Migrate and sync plugin registry
// Location: chunks.94.mjs:110-210
// ============================================

// Algorithm:
// 1. Read installed_plugins.json
// 2. If version field missing (V1 format), migrate to V2
// 3. Validate each plugin entry against current marketplaces
// 4. Remove stale entries (marketplace no longer installed)
// 5. Write updated registry

// V1 format (flat):
// { "plugins": { "pluginName": { version, installPath } } }

// V2 format (scoped):
// { "version": 2, "plugins": { "name@market": [{ scope, installPath, version, ... }] } }
```

**Migration logic:**
- V1 entries get `scope: "user"` assigned automatically
- Each V1 key becomes a V2 `pluginName@marketplaceName` key
- The `installedAt` and `lastUpdated` timestamps are set to current time (V1 didn't track these)

---

## Deep Analysis: Memoization Pattern

### The `e1` (memoize) Utility

All plugin loaders use memoization to prevent redundant I/O operations during session startup. The `e1` function wraps async functions with a promise cache:

```javascript
// ============================================
// memoize - Cache async function results for session lifetime
// Location: chunks.94.mjs (utility function)
// ============================================

// ORIGINAL (for source lookup):
e1 = (A) => {
    let q, K = !1;
    return async (...Y) => (K || (q = A(...Y), K = !0), q)
}

// READABLE (for understanding):
function memoize(asyncFn) {
    let cachedPromise;
    let hasExecuted = false;

    return async (...args) => {
        // First call: execute function and cache the promise
        if (!hasExecuted) {
            cachedPromise = asyncFn(...args);
            hasExecuted = true;
        }
        // Subsequent calls: return cached promise
        return cachedPromise;
    };
}

// Mapping: e1→memoize, A→asyncFn, q→cachedPromise, K→hasExecuted
```

**How it works:**
1. First call executes the async function and caches the resulting promise
2. Subsequent calls return the cached promise immediately
3. Cache key is implicit (function identity, no parameters)
4. Cache lives for the session lifetime (no invalidation mechanism in `e1` itself)

**Applied to:**
- `getPluginAgents` (KQ6) - Load custom agent definitions
- `getPluginCommands` (w96) - Load slash commands
- `getPluginSkills` (hk8) - Load skill definitions
- `getLoadedPlugins` (_z) - Load all enabled plugins
- `getPluginOutputStyles` (Ik8) - Load output styles
- `loadAllPluginHooks` (nB) - Register plugin hooks

**Why this approach:**
- Plugin loading involves I/O (reading manifests, scanning directories, git operations)
- Multiple components may request plugin data during session startup
- Memoization ensures single I/O operation per session
- The cached promise handles concurrent callers automatically

**Cache invalidation:**
For functions that need cache invalidation (like `loadAllPluginHooks`), a separate `clear` function is provided:

```javascript
// ============================================
// clearPluginHookCache - Invalidate nB memoization
// Location: chunks.94.mjs:792-794
// ============================================

// ORIGINAL (for source lookup):
function d01() {
    nB.cache?.clear?.();  // Clear memoization cache
    lu1();                // Deregister all plugin hooks from global registry
}

// READABLE (for understanding):
function clearPluginHookCache() {
    loadAllPluginHooks.cache?.clear?.();
    deregisterPluginHooks();
}

// Mapping: d01→clearPluginHookCache, nB→loadAllPluginHooks, lu1→deregisterPluginHooks
```

---

## Deep Analysis: git-subdir Sparse Checkout (Qp9)

### `cloneGitSubdir` - Efficient Monorepo Marketplace Loading

**What it does:** Clones only a specific subdirectory of a git repository for `git-subdir` marketplace sources, avoiding the need to download the entire repository.

```javascript
// ============================================
// cloneGitSubdir - Sparse checkout for subdirectory marketplace sources
// Location: chunks.143.mjs:2920-3023
// ============================================

// READABLE (for understanding):
async function cloneGitSubdir(gitUrl, subdir, ref, targetPath) {
    // Step 1: Clone with --filter=tree:0 (no blob data initially)
    // This creates a minimal git repository without file contents
    await execGit("clone", [
        "--filter=tree:0",   // Skip blob data download
        "--no-checkout",     // Don't create working tree yet
        "--single-branch",   // Only fetch the target branch
        "--branch", ref || "main",
        gitUrl,
        targetPath
    ]);

    // Step 2: Configure sparse checkout
    await execGit(["-C", targetPath, "sparse-checkout", "init", "--cone"]);
    // Cone mode is more efficient than full sparse checkout

    // Step 3: Set the subdirectory to check out
    await execGit(["-C", targetPath, "sparse-checkout", "set", subdir]);

    // Step 4: Checkout the specified ref (now only the subdirectory)
    await execGit(["-C", targetPath, "checkout", ref || "main"]);

    // The targetPath now contains only the subdirectory contents
    return targetPath;
}

// Mapping: Qp9→cloneGitSubdir
```

**How it works (step-by-step):**
1. **`--filter=tree:0`**: Tells git to skip downloading blob (file content) data in the initial clone. Only tree (directory structure) and commit metadata are fetched.
2. **`--no-checkout`**: Skips creating the working tree, which would fail anyway since we have no blobs.
3. **`sparse-checkout init --cone`**: Enables sparse checkout in "cone" mode, which is more efficient than the legacy sparse checkout. Cone mode uses directory-level filtering.
4. **`sparse-checkout set {subdir}`**: Defines which subdirectory to include in the working tree.
5. **`checkout`**: Finally creates the working tree, downloading only the blobs needed for the specified subdirectory.

**Why this approach:**
- Many organizations store plugin marketplaces as subdirectories of larger monorepos
- Cloning the entire monorepo wastes bandwidth and disk space
- Sparse checkout with cone mode requires Git 2.25+ (released Jan 2020)
- Significantly faster for large repositories with small marketplace directories

**Requirements:**
- Git 2.25+ for `sparse-checkout --cone` mode
- Git must be available in PATH
- Network access to the git repository

**Error handling:**
- If sparse checkout fails, falls back to full clone
- Handles authentication errors via SSH/HTTPS fallback in parent functions
- Validates subdirectory exists after checkout

---

## Cross-Module Integration

### Plugin Commands in Slash Command System

Plugin commands are merged with built-in commands in `getAllSkills`:

```javascript
// In slash command registry:
let allCommands = [
    ...getBuiltinCommands(),    // Built-in commands like /help, /clear
    ...await getPluginCommands(),  // Plugin commands: /plugin-name:command
    ...loadSkillDirCommands()   // User skill directories
];
```

**Naming convention:** Plugin commands use `/plugin-name:command-name` format to prevent collisions.

### Plugin Skills in System Reminder

Plugin skills appear in the skill listing attachment sent to the LLM:

```javascript
// In generateSkillListingAttachment:
let pluginSkills = await getPluginSkills();
// pluginSkills have loadedFrom: "plugin" marker for attribution
```

The system reminder shows: `skill-name (from plugin-name): description`

### Plugin MCP Servers in MCP Manager

Plugin MCP servers are namespaced and merged:

```javascript
// In getAllMcpServersWithPlugins:
let allServers = {
    ...userMcpServers,           // From settings.json
    ...await loadPluginMcpServers(enabledPlugins),  // Plugin MCPs
    ...projectMcpServers         // From .claude/settings.json
};

// Plugin servers are prefixed: "plugin:{pluginName}:{serverName}"
// And have scope: "dynamic" marker
```

### Plugin Hooks Priority

Plugin hooks always run AFTER user-configured hooks:

```javascript
// Priority assignment:
(j) => j === "pluginHook" ? 999 : normalPriority[j]

// This means:
// 1. User hooks execute first (priority 1-100)
// 2. Plugin hooks execute last (priority 999)
// 3. User hooks can preempt or modify plugin behavior
```
