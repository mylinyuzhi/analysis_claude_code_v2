# Plugin Component Loading

> How plugin components (commands, skills, agents, hooks, output-styles, LSP servers) are loaded at runtime.
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Plugin System section

---

## Quick Navigation

- [Loading Architecture](#loading-architecture)
- [Memoization Wrapper](#memoization-wrapper)
- [Plugin Discovery](#plugin-discovery)
- [Component Loading](#component-loading)
- [Agent Loading](#agent-loading)
- [Skill Loading](#skill-loading)
- [Output Style Loading](#output-style-loading)
- [LSP Server Loading](#lsp-server-loading)
- [Inline Plugins](#inline-plugins)
- [Hook Integration](#hook-integration)
- [Cache Management](#cache-management)

---

## Loading Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STARTUP FLOW                                    │
│                                                                         │
│  discoverPluginsAndHooks (DG)  ← Main entry point (memoized)           │
│          │                                                              │
│          ├──────────────────────────────────────────────┐              │
│          ▼                                              ▼              │
│  loadMarketplacePlugins (OB7)              loadInlinePlugins (RB7)     │
│  chunks.130.mjs:2841                        chunks.130.mjs:3180         │
│          │                                              │              │
│          └─────────────────┬────────────────────────────┘              │
│                            │                                            │
│                            ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  For each plugin source:                                         │   │
│  │  initializePluginFromMarketplace (MB7)                          │   │
│  │  chunks.130.mjs:2890-3177                                       │   │
│  │                                                                  │   │
│  │  1. Resolve source (local path or remote)                       │   │
│  │  2. Copy to versioned cache                                     │   │
│  │  3. Load plugin.json manifest                                   │   │
│  │  4. Discover component paths:                                   │   │
│  │     • commandsPath/commandsPaths                                │   │
│  │     • agentsPath/agentsPaths                                    │   │
│  │     • skillsPath/skillsPaths                                    │   │
│  │     • outputStylesPath/outputStylesPaths                        │   │
│  │     • hooksConfig                                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                            │                                            │
│                            ▼                                            │
│  Return: { enabled: [...], disabled: [...], errors: [...] }            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Memoization Wrapper

All plugin loading functions use a memoization wrapper `W0` (lodash memoize) to cache results and prevent redundant loading.

```javascript
// ============================================
// W0 / createMemoizedAsync - Memoization wrapper for async functions
// Location: chunks.1.mjs:636-656
// ============================================

// ORIGINAL (for source lookup):
function _U1(A, Q) {
  if (typeof A != "function" || Q != null && typeof Q != "function") throw TypeError(UR9);
  var B = function () {
    var G = arguments,
      Z = Q ? Q.apply(this, G) : G[0],
      Y = B.cache;
    if (Y.has(Z)) return Y.get(Z);
    var J = A.apply(this, G);
    return B.cache = Y.set(Z, J) || Y, J
  };
  return B.cache = new(_U1.Cache || hAA), B
}
// ...
W0 = _U1  // Export as W0

// READABLE (for understanding):
function createMemoizedAsync(asyncFn, resolver) {
  if (typeof asyncFn !== "function" || (resolver != null && typeof resolver !== "function")) {
    throw TypeError("Expected a function");
  }

  const memoized = function(...args) {
    // Compute cache key (default: first argument)
    const key = resolver ? resolver.apply(this, args) : args[0];
    const cache = memoized.cache;

    // Return cached result if exists
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Execute function and cache result
    const result = asyncFn.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };

  // Use Map as default cache
  memoized.cache = new Map();
  return memoized;
}

// Mapping: _U1→createMemoizedAsync, W0→createMemoizedAsync
```

**Usage Pattern:**

```javascript
// Wrap async function for memoization
discoverPluginsAndHooks = W0(async () => {
  // Expensive discovery logic
  return { enabled: [...], disabled: [...], errors: [...] };
});

// First call executes function
await discoverPluginsAndHooks();  // Runs full discovery

// Subsequent calls return cached result
await discoverPluginsAndHooks();  // Returns cached result instantly

// Clear cache to force reload
discoverPluginsAndHooks.cache?.clear?.();
```

**Why Memoization?**
- Plugin discovery is expensive (file I/O, parsing, validation)
- Multiple systems need plugin data (skills, agents, hooks, commands)
- Cache invalidation is explicit (on install/uninstall/enable/disable)
- Reduces startup time on subsequent accesses

---

## Plugin Discovery

### Main Discovery Function

```javascript
// ============================================
// discoverPluginsAndHooks - Main entry point for plugin discovery
// Location: chunks.130.mjs:3246-3263
// ============================================

// ORIGINAL (for source lookup):
DG = W0(async () => {
  let A = await OB7(),
    Q = [...A.plugins],
    B = [...A.errors],
    G = Qf0();
  if (G.length > 0) {
    let Y = await RB7(G);
    Q.push(...Y.plugins), B.push(...Y.errors)
  }
  k(`Found ${Q.length} plugins (${Q.filter((Y)=>Y.enabled).length} enabled, ${Q.filter((Y)=>!Y.enabled).length} disabled)`);
  let Z = Q.filter((Y) => Y.enabled);
  if (Z.length > 0) T9("plugins");
  return {
    enabled: Z,
    disabled: Q.filter((Y) => !Y.enabled),
    errors: B
  }
})

// READABLE (for understanding):
discoverPluginsAndHooks = createMemoizedAsync(async () => {
  // 1. Load marketplace-based plugins
  let marketplaceResult = await loadMarketplacePlugins();
  let allPlugins = [...marketplaceResult.plugins];
  let allErrors = [...marketplaceResult.errors];

  // 2. Load inline plugins from --plugin-dir CLI argument
  let inlinePluginPaths = getInlinePlugins();  // From session context
  if (inlinePluginPaths.length > 0) {
    let inlineResult = await loadInlinePlugins(inlinePluginPaths);
    allPlugins.push(...inlineResult.plugins);
    allErrors.push(...inlineResult.errors);
  }

  // Log discovery results
  log(`Found ${allPlugins.length} plugins (${enabledCount} enabled, ${disabledCount} disabled)`);

  // Filter to enabled plugins
  let enabledPlugins = allPlugins.filter(p => p.enabled);
  if (enabledPlugins.length > 0) {
    recordUsage("plugins");  // Telemetry
  }

  return {
    enabled: enabledPlugins,
    disabled: allPlugins.filter(p => !p.enabled),
    errors: allErrors
  };
});

// Mapping: DG→discoverPluginsAndHooks, W0→createMemoizedAsync, OB7→loadMarketplacePlugins,
//          Qf0→getInlinePlugins, RB7→loadInlinePlugins, T9→recordUsage
```

### Load Marketplace Plugins

```javascript
// ============================================
// loadMarketplacePlugins - Load plugins from registered marketplaces
// Location: chunks.130.mjs:2841-2888
// ============================================

// ORIGINAL (for source lookup):
async function OB7() {
  let Q = jQ().enabledPlugins || {},
    B = [],
    G = [],
    Z = Object.entries(Q).filter(([J, X]) => {
      return W4A.safeParse(J).success && X !== void 0
    }),
    Y = await D5();
  for (let [J, X] of Z) try {
    let [I, D] = J.split("@"), W = Y[D];
    if (W && !H4A(W.source)) {
      let F = AyA(W.source),
        H = WVA() || [];
      G.push({
        type: "marketplace-blocked-by-policy",
        source: J,
        plugin: I,
        marketplace: D,
        blockedByBlocklist: F,
        allowedSources: F ? [] : H.map((E) => KVA(E))
      });
      continue
    }
    let K = HI0(J);
    if (!K) {
      G.push({
        type: "plugin-not-found",
        source: J,
        pluginId: I,
        marketplace: D
      });
      continue
    }
    let V = await MB7(K.entry, K.marketplaceInstallLocation, J, X === !0, G);
    if (V) B.push(V)
  } catch (I) {
    let D = I instanceof Error ? I : Error(String(I));
    e(D), G.push({
      type: "generic-error",
      source: J,
      error: D.message
    })
  }
  return {
    plugins: B,
    errors: G
  }
}

// READABLE (for understanding):
async function loadMarketplacePlugins() {
  // Get enabled plugins from settings
  let enabledPluginsConfig = getSettings().enabledPlugins || {};
  let loadedPlugins = [];
  let errors = [];

  // Filter to valid plugin IDs (format: "name@marketplace")
  let validPluginIds = Object.entries(enabledPluginsConfig).filter(([id, isEnabled]) => {
    return pluginIdSchema.safeParse(id).success && isEnabled !== undefined;
  });

  // Get all registered marketplaces
  let marketplaces = await loadMarketplaceConfigs();

  // Process each enabled plugin
  for (let [pluginId, isEnabled] of validPluginIds) {
    try {
      let [pluginName, marketplaceName] = pluginId.split("@");
      let marketplace = marketplaces[marketplaceName];

      // Check enterprise policy
      if (marketplace && !isMarketplaceSourceAllowed(marketplace.source)) {
        let isBlocklisted = isMarketplaceSourceBlocked(marketplace.source);
        let allowedSources = getAllowedMarketplaceSources() || [];
        errors.push({
          type: "marketplace-blocked-by-policy",
          source: pluginId,
          plugin: pluginName,
          marketplace: marketplaceName,
          blockedByBlocklist: isBlocklisted,
          allowedSources: isBlocklisted ? [] : allowedSources.map(formatSourceName)
        });
        continue;
      }

      // Look up plugin in marketplace cache
      let pluginEntry = findPluginInCachedMarketplace(pluginId);
      if (!pluginEntry) {
        errors.push({
          type: "plugin-not-found",
          source: pluginId,
          pluginId: pluginName,
          marketplace: marketplaceName
        });
        continue;
      }

      // Initialize and load plugin
      let pluginDef = await initializePluginFromMarketplace(
        pluginEntry.entry,
        pluginEntry.marketplaceInstallLocation,
        pluginId,
        isEnabled === true,
        errors
      );

      if (pluginDef) {
        loadedPlugins.push(pluginDef);
      }
    } catch (error) {
      let err = error instanceof Error ? error : Error(String(error));
      logError(err);
      errors.push({
        type: "generic-error",
        source: pluginId,
        error: err.message
      });
    }
  }

  return {
    plugins: loadedPlugins,
    errors: errors
  };
}

// Mapping: OB7→loadMarketplacePlugins, jQ→getSettings, D5→loadMarketplaceConfigs,
//          H4A→isMarketplaceSourceAllowed, AyA→isMarketplaceSourceBlocked,
//          WVA→getAllowedMarketplaceSources, HI0→findPluginInCachedMarketplace,
//          MB7→initializePluginFromMarketplace
```

---

## Component Loading

### Load Plugin Definition from Path

```javascript
// ============================================
// loadPluginDefinitionFromPath - Load and parse plugin from filesystem
// Location: chunks.130.mjs:2612-2820
// ============================================

// ORIGINAL (for source lookup):
function ao2(A, Q, B, G, Z = !0) {
  let Y = vA(),
    J = [],
    X = T8(A, ".claude-plugin", "plugin.json"),
    I = LF1(X, G, Q),
    D = {
      name: I.name,
      manifest: I,
      path: A,
      source: Q,
      repository: Q,
      enabled: B
    },
    W = T8(A, "commands");
  if (!I.commands && Y.existsSync(W)) D.commandsPath = W;
  // ... component loading logic continues
}

// READABLE (for understanding):
function loadPluginDefinitionFromPath(pluginPath, source, enabled, pluginName, includeErrors = true) {
  const fs = getFileSystem();
  const errors = [];

  // Load manifest
  const manifestPath = path.join(pluginPath, ".claude-plugin", "plugin.json");
  const manifest = loadManifest(manifestPath, pluginName, source);

  // Base plugin definition
  const pluginDef = {
    name: manifest.name,
    manifest: manifest,
    path: pluginPath,
    source: source,
    repository: source,
    enabled: enabled
  };

  // === COMMANDS ===
  const defaultCommandsPath = path.join(pluginPath, "commands");
  if (!manifest.commands && fs.existsSync(defaultCommandsPath)) {
    pluginDef.commandsPath = defaultCommandsPath;
  }

  if (manifest.commands) {
    // Handle object format with metadata
    if (typeof manifest.commands === "object" && !Array.isArray(manifest.commands)) {
      const firstValue = Object.values(manifest.commands)[0];
      if (firstValue && typeof firstValue === "object" && ("source" in firstValue || "content" in firstValue)) {
        let commandsMetadata = {};
        let commandsPaths = [];

        for (const [cmdName, cmdDef] of Object.entries(manifest.commands)) {
          if (!cmdDef || typeof cmdDef !== "object") continue;

          if (cmdDef.source) {
            const cmdPath = path.join(pluginPath, cmdDef.source);
            if (fs.existsSync(cmdPath)) {
              commandsPaths.push(cmdPath);
              commandsMetadata[cmdName] = cmdDef;
            } else {
              errors.push({
                type: "path-not-found",
                source: source,
                plugin: manifest.name,
                path: cmdPath,
                component: "commands"
              });
            }
          } else if (cmdDef.content) {
            commandsMetadata[cmdName] = cmdDef;  // Inline content
          }
        }

        if (commandsPaths.length > 0) pluginDef.commandsPaths = commandsPaths;
        if (Object.keys(commandsMetadata).length > 0) pluginDef.commandsMetadata = commandsMetadata;
      }
    } else {
      // Handle array/string format
      const paths = Array.isArray(manifest.commands) ? manifest.commands : [manifest.commands];
      const resolvedPaths = [];

      for (const cmdPath of paths) {
        if (typeof cmdPath !== "string") continue;
        const fullPath = path.join(pluginPath, cmdPath);
        if (fs.existsSync(fullPath)) {
          resolvedPaths.push(fullPath);
        } else {
          errors.push({
            type: "path-not-found",
            source: source,
            plugin: manifest.name,
            path: fullPath,
            component: "commands"
          });
        }
      }

      if (resolvedPaths.length > 0) pluginDef.commandsPaths = resolvedPaths;
    }
  }

  // === AGENTS ===
  const defaultAgentsPath = path.join(pluginPath, "agents");
  if (!manifest.agents && fs.existsSync(defaultAgentsPath)) {
    pluginDef.agentsPath = defaultAgentsPath;
  }

  if (manifest.agents) {
    const paths = Array.isArray(manifest.agents) ? manifest.agents : [manifest.agents];
    const resolvedPaths = paths
      .filter(p => {
        const fullPath = path.join(pluginPath, p);
        if (fs.existsSync(fullPath)) return true;
        errors.push({ type: "path-not-found", source, plugin: manifest.name, path: fullPath, component: "agents" });
        return false;
      })
      .map(p => path.join(pluginPath, p));

    if (resolvedPaths.length > 0) pluginDef.agentsPaths = resolvedPaths;
  }

  // === SKILLS ===
  const defaultSkillsPath = path.join(pluginPath, "skills");
  if (!manifest.skills && fs.existsSync(defaultSkillsPath)) {
    pluginDef.skillsPath = defaultSkillsPath;
  }

  if (manifest.skills) {
    const paths = Array.isArray(manifest.skills) ? manifest.skills : [manifest.skills];
    const resolvedPaths = paths
      .filter(p => {
        const fullPath = path.join(pluginPath, p);
        if (fs.existsSync(fullPath)) return true;
        errors.push({ type: "path-not-found", source, plugin: manifest.name, path: fullPath, component: "skills" });
        return false;
      })
      .map(p => path.join(pluginPath, p));

    if (resolvedPaths.length > 0) pluginDef.skillsPaths = resolvedPaths;
  }

  // === OUTPUT STYLES ===
  const defaultOutputStylesPath = path.join(pluginPath, "output-styles");
  if (!manifest.outputStyles && fs.existsSync(defaultOutputStylesPath)) {
    pluginDef.outputStylesPath = defaultOutputStylesPath;
  }

  if (manifest.outputStyles) {
    const paths = Array.isArray(manifest.outputStyles) ? manifest.outputStyles : [manifest.outputStyles];
    const resolvedPaths = paths
      .filter(p => fs.existsSync(path.join(pluginPath, p)))
      .map(p => path.join(pluginPath, p));

    if (resolvedPaths.length > 0) pluginDef.outputStylesPaths = resolvedPaths;
  }

  // === HOOKS ===
  // ... hook loading logic (see Hook Integration section)

  return { plugin: pluginDef, errors };
}

// Mapping: ao2→loadPluginDefinitionFromPath, vA→getFileSystem, LF1→loadManifest
```

### Plugin Definition Object

```javascript
// Plugin definition structure returned by loadPluginDefinitionFromPath:
{
  name: "my-plugin",              // Plugin name from manifest
  manifest: { ... },               // Parsed plugin.json
  path: "/path/to/plugin",         // Installation path
  source: "my-plugin@marketplace", // Plugin ID
  repository: "...",               // Source repository
  enabled: true,                   // Enable state

  // Component paths (detected from manifest or default directories)
  commandsPath: "/path/commands",      // Default commands/ directory
  commandsPaths: ["/path/to/cmd"],     // Custom command paths from manifest
  commandsMetadata: {                  // Inline command definitions
    "cmd-name": {
      "source": "./commands/cmd.md",
      "description": "..."
    }
  },

  agentsPath: "/path/agents",          // Default agents/ directory
  agentsPaths: ["/custom/path"],       // Custom agent paths

  skillsPath: "/path/skills",          // Default skills/ directory
  skillsPaths: ["/custom/path"],       // Custom skill paths

  outputStylesPath: "/path/output-styles",
  outputStylesPaths: ["/custom/path"],

  hooksConfig: {                       // Merged hook configurations
    PreToolUse: [...],
    PostToolUse: [...],
    ...
  }
}
```

---

## Agent Loading

Agents are loaded from plugins using a memoized loader that iterates over all enabled plugins.

```javascript
// ============================================
// getPluginAgents - Load agents from all enabled plugins
// Location: chunks.93.mjs:554-588
// ============================================

// ORIGINAL (for source lookup):
O4A = W0(async () => {
  let {
    enabled: A,
    errors: Q
  } = await DG(), B = [];
  if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
  for (let G of A) {
    let Z = new Set;
    if (G.agentsPath) try {
      let Y = N52(G.agentsPath, G.name, G.source, Z);
      if (B.push(...Y), Y.length > 0) k(`Loaded ${Y.length} agents from plugin ${G.name} default directory`)
    } catch (Y) {
      k(`Failed to load agents from plugin ${G.name} default directory: ${Y}`, {
        level: "error"
      })
    }
    if (G.agentsPaths)
      for (let Y of G.agentsPaths) try {
        let X = vA().statSync(Y);
        if (X.isDirectory()) {
          let I = N52(Y, G.name, G.source, Z);
          if (B.push(...I), I.length > 0) k(`Loaded ${I.length} agents from plugin ${G.name} custom path: ${Y}`)
        } else if (X.isFile() && Y.endsWith(".md")) {
          let I = w52(Y, G.name, [], G.source, Z);
          if (I) B.push(I), k(`Loaded agent from plugin ${G.name} custom file: ${Y}`)
        }
      } catch (J) {
        k(`Failed to load agents from plugin ${G.name} custom path ${Y}: ${J}`, {
          level: "error"
        })
      }
  }
  return k(`Total plugin agents loaded: ${B.length}`), B
})

// READABLE (for understanding):
getPluginAgents = createMemoizedAsync(async () => {
  // Get all enabled plugins
  let { enabled: enabledPlugins, errors } = await discoverPluginsAndHooks();
  let loadedAgents = [];

  if (errors.length > 0) {
    log(`Plugin loading errors: ${errors.map(formatPluginError).join(", ")}`);
  }

  for (let plugin of enabledPlugins) {
    let loadedPaths = new Set();  // Track to avoid duplicates

    // Load from default agents/ directory
    if (plugin.agentsPath) {
      try {
        let agents = loadAgentsFromDirectory(plugin.agentsPath, plugin.name, plugin.source, loadedPaths);
        loadedAgents.push(...agents);
        if (agents.length > 0) {
          log(`Loaded ${agents.length} agents from plugin ${plugin.name} default directory`);
        }
      } catch (error) {
        log(`Failed to load agents from plugin ${plugin.name} default directory: ${error}`, { level: "error" });
      }
    }

    // Load from custom paths specified in manifest
    if (plugin.agentsPaths) {
      for (let agentPath of plugin.agentsPaths) {
        try {
          let stat = fs.statSync(agentPath);
          if (stat.isDirectory()) {
            let agents = loadAgentsFromDirectory(agentPath, plugin.name, plugin.source, loadedPaths);
            loadedAgents.push(...agents);
          } else if (stat.isFile() && agentPath.endsWith(".md")) {
            let agent = loadAgentFromFile(agentPath, plugin.name, [], plugin.source, loadedPaths);
            if (agent) loadedAgents.push(agent);
          }
        } catch (error) {
          log(`Failed to load agents from plugin ${plugin.name} custom path ${agentPath}: ${error}`, { level: "error" });
        }
      }
    }
  }

  log(`Total plugin agents loaded: ${loadedAgents.length}`);
  return loadedAgents;
});

// Mapping: O4A→getPluginAgents, N52→loadAgentsFromDirectory, w52→loadAgentFromFile
```

---

## Skill Loading

Skills are loaded from plugins following the same pattern as agents.

```javascript
// ============================================
// getPluginSkills - Load skills from all enabled plugins
// Location: chunks.130.mjs:1945-1980
// ============================================

// ORIGINAL (for source lookup):
tw0 = W0(async () => {
  let {
    enabled: A,
    errors: Q
  } = await DG(), B = [];
  if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
  k(`getPluginSkills: Processing ${A.length} enabled plugins`);
  for (let G of A) {
    let Z = new Set;
    if (k(`Checking plugin ${G.name}: skillsPath=${G.skillsPath?"exists":"none"}, skillsPaths=${G.skillsPaths?G.skillsPaths.length:0} paths`), G.skillsPath) {
      k(`Attempting to load skills from plugin ${G.name} default skillsPath: ${G.skillsPath}`);
      try {
        let Y = await So2(G.skillsPath, G.name, G.source, G.manifest, G.path, Z);
        B.push(...Y), k(`Loaded ${Y.length} skills from plugin ${G.name} default directory`)
      } catch (Y) {
        k(`Failed to load skills from plugin ${G.name} default directory: ${Y}`, {
          level: "error"
        })
      }
    }
    if (G.skillsPaths) {
      k(`Attempting to load skills from plugin ${G.name} skillsPaths: ${G.skillsPaths.join(", ")}`);
      for (let Y of G.skillsPaths) try {
        k(`Loading from skillPath: ${Y} for plugin ${G.name}`);
        let J = await So2(Y, G.name, G.source, G.manifest, G.path, Z);
        B.push(...J), k(`Loaded ${J.length} skills from plugin ${G.name} custom path: ${Y}`)
      } catch (J) {
        k(`Failed to load skills from plugin ${G.name} custom path ${Y}: ${J}`, {
          level: "error"
        })
      }
    }
  }
  return k(`Total plugin skills loaded: ${B.length}`), B
})

// READABLE (for understanding):
getPluginSkills = createMemoizedAsync(async () => {
  let { enabled: enabledPlugins, errors } = await discoverPluginsAndHooks();
  let loadedSkills = [];

  if (errors.length > 0) {
    log(`Plugin loading errors: ${errors.map(formatPluginError).join(", ")}`);
  }

  log(`getPluginSkills: Processing ${enabledPlugins.length} enabled plugins`);

  for (let plugin of enabledPlugins) {
    let loadedPaths = new Set();

    // Load from default skills/ directory
    if (plugin.skillsPath) {
      log(`Attempting to load skills from plugin ${plugin.name} default skillsPath: ${plugin.skillsPath}`);
      try {
        let skills = await loadSkillsFromPath(
          plugin.skillsPath,
          plugin.name,
          plugin.source,
          plugin.manifest,
          plugin.path,
          loadedPaths
        );
        loadedSkills.push(...skills);
        log(`Loaded ${skills.length} skills from plugin ${plugin.name} default directory`);
      } catch (error) {
        log(`Failed to load skills from plugin ${plugin.name} default directory: ${error}`, { level: "error" });
      }
    }

    // Load from custom paths
    if (plugin.skillsPaths) {
      log(`Attempting to load skills from plugin ${plugin.name} skillsPaths: ${plugin.skillsPaths.join(", ")}`);
      for (let skillPath of plugin.skillsPaths) {
        try {
          let skills = await loadSkillsFromPath(skillPath, plugin.name, plugin.source, plugin.manifest, plugin.path, loadedPaths);
          loadedSkills.push(...skills);
          log(`Loaded ${skills.length} skills from plugin ${plugin.name} custom path: ${skillPath}`);
        } catch (error) {
          log(`Failed to load skills from plugin ${plugin.name} custom path ${skillPath}: ${error}`, { level: "error" });
        }
      }
    }
  }

  log(`Total plugin skills loaded: ${loadedSkills.length}`);
  return loadedSkills;
});

// Mapping: tw0→getPluginSkills, So2→loadSkillsFromPath
```

---

## Output Style Loading

Output styles are markdown files that define response formatting.

```javascript
// ============================================
// getPluginOutputStyles - Load output styles from plugins
// Location: chunks.130.mjs:2043-2084
// ============================================

// ORIGINAL (for source lookup):
ew0 = W0(async () => {
  let {
    enabled: A,
    errors: Q
  } = await DG(), B = [];
  if (Q.length > 0) k(`Plugin loading errors: ${Q.map((G)=>h_(G)).join(", ")}`);
  for (let G of A) {
    let Z = new Set;
    if (G.outputStylesPath) try {
      let Y = yo2(G.outputStylesPath, G.name, Z);
      if (B.push(...Y), Y.length > 0) k(`Loaded ${Y.length} output styles from plugin ${G.name} default directory`)
    } catch (Y) {
      k(`Failed to load output styles from plugin ${G.name} default directory: ${Y}`, {
        level: "error"
      })
    }
    if (G.outputStylesPaths)
      for (let Y of G.outputStylesPaths) try {
        let X = vA().statSync(Y);
        if (X.isDirectory()) {
          let I = yo2(Y, G.name, Z);
          if (B.push(...I), I.length > 0) k(`Loaded ${I.length} output styles from plugin ${G.name} custom path: ${Y}`)
        } else if (X.isFile() && Y.endsWith(".md")) {
          let I = vo2(Y, G.name, Z);
          if (I) B.push(I), k(`Loaded output style from plugin ${G.name} custom file: ${Y}`)
        }
      } catch (J) {
        k(`Failed to load output styles from plugin ${G.name} custom path ${Y}: ${J}`, {
          level: "error"
        })
      }
  }
  return k(`Total plugin output styles loaded: ${B.length}`), B
})

// READABLE (for understanding):
getPluginOutputStyles = createMemoizedAsync(async () => {
  let { enabled: enabledPlugins, errors } = await discoverPluginsAndHooks();
  let loadedStyles = [];

  for (let plugin of enabledPlugins) {
    let loadedPaths = new Set();

    // Load from default output-styles/ directory
    if (plugin.outputStylesPath) {
      try {
        let styles = scanOutputStylesDirectory(plugin.outputStylesPath, plugin.name, loadedPaths);
        loadedStyles.push(...styles);
        if (styles.length > 0) {
          log(`Loaded ${styles.length} output styles from plugin ${plugin.name} default directory`);
        }
      } catch (error) {
        log(`Failed to load output styles from plugin ${plugin.name} default directory: ${error}`, { level: "error" });
      }
    }

    // Load from custom paths
    if (plugin.outputStylesPaths) {
      for (let stylePath of plugin.outputStylesPaths) {
        try {
          let stat = fs.statSync(stylePath);
          if (stat.isDirectory()) {
            let styles = scanOutputStylesDirectory(stylePath, plugin.name, loadedPaths);
            loadedStyles.push(...styles);
          } else if (stat.isFile() && stylePath.endsWith(".md")) {
            let style = loadOutputStyleFromFile(stylePath, plugin.name, loadedPaths);
            if (style) loadedStyles.push(style);
          }
        } catch (error) {
          log(`Failed to load output styles from plugin ${plugin.name} custom path ${stylePath}: ${error}`, { level: "error" });
        }
      }
    }
  }

  log(`Total plugin output styles loaded: ${loadedStyles.length}`);
  return loadedStyles;
});

// Mapping: ew0→getPluginOutputStyles, yo2→scanOutputStylesDirectory, vo2→loadOutputStyleFromFile
```

### Output Style File Format

```javascript
// ============================================
// loadOutputStyleFromFile - Parse output style markdown file
// Location: chunks.130.mjs:2006-2035
// ============================================

// ORIGINAL (for source lookup):
function vo2(A, Q, B) {
  let G = vA();
  if (Py(G, A, B)) return null;  // Skip if already loaded (symlink dedup)
  try {
    let Z = G.readFileSync(A, { encoding: "utf-8" }),
      { frontmatter: Y, content: J } = lK(Z),
      X = BB7(A, ".md"),
      I = Y.name || X,
      D = `${Q}:${I}`,
      W = Y.description || dc(J, `Output style from ${Q} plugin`),
      K = Y["force-for-plugin"],
      V = K === !0 || K === "true" ? !0 : K === !1 || K === "false" ? !1 : void 0;
    return {
      name: D,
      description: W,
      prompt: J.trim(),
      source: "plugin",
      forceForPlugin: V
    }
  } catch (Z) {
    return k(`Failed to load output style from ${A}: ${Z}`, { level: "error" }), null
  }
}

// READABLE (for understanding):
function loadOutputStyleFromFile(filePath, pluginName, loadedPaths) {
  const fs = getFileSystem();

  // Skip if symlink points to already-loaded file (deduplication)
  if (isSymlinkDuplicate(fs, filePath, loadedPaths)) return null;

  try {
    const content = fs.readFileSync(filePath, { encoding: "utf-8" });
    const { frontmatter, content: markdownContent } = parseFrontmatter(content);

    // Extract name from frontmatter or filename
    const baseName = path.basename(filePath, ".md");
    const styleName = frontmatter.name || baseName;

    // Namespace with plugin name
    const namespacedName = `${pluginName}:${styleName}`;

    // Extract description
    const description = frontmatter.description ||
      extractDescription(markdownContent, `Output style from ${pluginName} plugin`);

    // Handle force-for-plugin flag
    const forceFlag = frontmatter["force-for-plugin"];
    const forceForPlugin = forceFlag === true || forceFlag === "true" ? true
      : forceFlag === false || forceFlag === "false" ? false
      : undefined;

    return {
      name: namespacedName,         // "my-plugin:code-review"
      description: description,
      prompt: markdownContent.trim(),
      source: "plugin",
      forceForPlugin: forceForPlugin
    };
  } catch (error) {
    log(`Failed to load output style from ${filePath}: ${error}`, { level: "error" });
    return null;
  }
}

// Mapping: vo2→loadOutputStyleFromFile, Py→isSymlinkDuplicate, lK→parseFrontmatter
```

---

## LSP Server Loading

Plugins can provide LSP (Language Server Protocol) servers for enhanced code intelligence.

```javascript
// ============================================
// loadLspServersFromPlugin - Load LSP server configs from plugin
// Location: chunks.114.mjs:2009-2076
// ============================================

// ORIGINAL (for source lookup):
if (A.manifest.lspServers) {
  let Z = await xg5(A.manifest.lspServers, A.path, A.name, Q);
  if (Z) Object.assign(B, Z)
}

async function xg5(A, Q, B, G) {
  let Z = {},
    Y = Array.isArray(A) ? A : [A];
  for (let J of Y)
    if (typeof J === "string") {
      let X = Pg5(Q, J);  // Validate path is within plugin directory
      if (!X) {
        let I = `Security: Path traversal attempt blocked in plugin ${B}: ${J}`;
        e(Error(I)), k(I, { level: "warn" }), G.push({
          type: "lsp-config-invalid",
          plugin: B,
          serverName: J,
          validationError: "Invalid path: must be relative and within plugin directory",
          source: "plugin"
        });
        continue
      }
      try {
        let I = await Hy2(X, "utf-8"),
          D = AQ(I),
          W = m.record(m.string(), YVA).safeParse(D);
        if (W.success) Object.assign(Z, W.data);
        else {
          let K = `LSP config validation failed for ${J} in plugin ${B}: ${W.error.message}`;
          e(Error(K)), G.push({
            type: "lsp-config-invalid",
            plugin: B,
            serverName: J,
            validationError: W.error.message,
            source: "plugin"
          })
        }
      } catch (I) {
        // ... error handling
      }
    } else
      // Inline LSP config object
      for (let [X, I] of Object.entries(J)) {
        let D = YVA.safeParse(I);
        if (D.success) Z[X] = D.data;
        else {
          // ... validation error
        }
      }
  return Object.keys(Z).length > 0 ? Z : void 0
}

// READABLE (for understanding):
async function loadLspServersFromPlugin(lspConfig, pluginPath, pluginName, errors) {
  let lspServers = {};
  let configs = Array.isArray(lspConfig) ? lspConfig : [lspConfig];

  for (let config of configs) {
    if (typeof config === "string") {
      // Load from JSON file path
      let safePath = validatePluginPath(pluginPath, config);

      // Security: Block path traversal attempts
      if (!safePath) {
        let errorMsg = `Security: Path traversal attempt blocked in plugin ${pluginName}: ${config}`;
        logError(Error(errorMsg));
        log(errorMsg, { level: "warn" });
        errors.push({
          type: "lsp-config-invalid",
          plugin: pluginName,
          serverName: config,
          validationError: "Invalid path: must be relative and within plugin directory",
          source: "plugin"
        });
        continue;
      }

      try {
        let content = await fs.readFile(safePath, "utf-8");
        let parsed = JSON.parse(content);

        // Validate against LSP server schema
        let validation = z.record(z.string(), lspServerSchema).safeParse(parsed);
        if (validation.success) {
          Object.assign(lspServers, validation.data);
        } else {
          errors.push({
            type: "lsp-config-invalid",
            plugin: pluginName,
            serverName: config,
            validationError: validation.error.message,
            source: "plugin"
          });
        }
      } catch (error) {
        errors.push({
          type: "lsp-config-invalid",
          plugin: pluginName,
          serverName: config,
          validationError: error instanceof Error ? `Failed to parse JSON: ${error.message}` : "Failed to parse JSON file",
          source: "plugin"
        });
      }
    } else {
      // Inline LSP server definitions (object format)
      for (let [serverName, serverConfig] of Object.entries(config)) {
        let validation = lspServerSchema.safeParse(serverConfig);
        if (validation.success) {
          lspServers[serverName] = validation.data;
        } else {
          errors.push({
            type: "lsp-config-invalid",
            plugin: pluginName,
            serverName: serverName,
            validationError: validation.error.message,
            source: "plugin"
          });
        }
      }
    }
  }

  return Object.keys(lspServers).length > 0 ? lspServers : undefined;
}

// Mapping: xg5→loadLspServersFromPlugin, Pg5→validatePluginPath, YVA→lspServerSchema
```

### LSP Server Variable Expansion

```javascript
// ============================================
// expandLspServerConfig - Expand variables in LSP config
// Location: chunks.114.mjs:2078-2099
// ============================================

// ORIGINAL (for source lookup):
function yg5(A, Q) {
  return A.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, Q)
}

function vg5(A, Q, B) {
  let G = [],
    Z = (X) => {
      let I = yg5(X, Q),
        { expanded: D, missingVars: W } = BVA(I);
      return G.push(...W), D
    },
    Y = { ...A };
  if (Y.command) Y.command = Z(Y.command);
  if (Y.args) Y.args = Y.args.map((X) => Z(X));
  let J = {
    CLAUDE_PLUGIN_ROOT: Q,
    ...Y.env || {}
  };
  // ...
}

// READABLE (for understanding):
function replacePluginRoot(str, pluginPath) {
  return str.replace(/\${CLAUDE_PLUGIN_ROOT}/g, pluginPath);
}

function expandLspServerConfig(config, pluginPath, pluginName) {
  let missingVars = [];

  const expandString = (str) => {
    let expanded = replacePluginRoot(str, pluginPath);
    let { expanded: result, missingVars: missing } = expandEnvironmentVariables(expanded);
    missingVars.push(...missing);
    return result;
  };

  let expandedConfig = { ...config };

  // Expand command path
  if (expandedConfig.command) {
    expandedConfig.command = expandString(expandedConfig.command);
  }

  // Expand arguments
  if (expandedConfig.args) {
    expandedConfig.args = expandedConfig.args.map(arg => expandString(arg));
  }

  // Set environment variables
  expandedConfig.env = {
    CLAUDE_PLUGIN_ROOT: pluginPath,  // Always available
    ...(expandedConfig.env || {})
  };

  return { config: expandedConfig, missingVars };
}

// Example plugin LSP config:
// {
//   "typescript-server": {
//     "command": "${CLAUDE_PLUGIN_ROOT}/node_modules/.bin/typescript-language-server",
//     "args": ["--stdio"],
//     "env": { "TSC_NONPOLLING_WATCHER": "true" }
//   }
// }

// Mapping: yg5→replacePluginRoot, vg5→expandLspServerConfig, BVA→expandEnvironmentVariables
```

---

## Inline Plugins

Plugins can be loaded from local directories using the `--plugin-dir` CLI argument.

```javascript
// ============================================
// loadInlinePlugins - Load plugins from --plugin-dir paths
// Location: chunks.130.mjs:3180-3221
// ============================================

// ORIGINAL (for source lookup):
async function RB7(A) {
  if (A.length === 0) return {
    plugins: [],
    errors: []
  };
  let Q = [],
    B = [],
    G = vA();
  for (let [Z, Y] of A.entries()) try {
    let J = zB7(Y);
    if (!G.existsSync(J)) {
      k(`Plugin path does not exist: ${J}, skipping`, {
        level: "warn"
      }), B.push({
        type: "path-not-found",
        source: `inline[${Z}]`,
        path: J,
        component: "commands"
      });
      continue
    }
    let X = $B7(J),
      {
        plugin: I,
        errors: D
      } = ao2(J, `${X}@inline`, !0, X);
    I.source = `${I.name}@inline`, I.repository = `${I.name}@inline`, Q.push(I), B.push(...D), k(`Loaded inline plugin from path: ${I.name}`)
  } catch (J) {
    let X = J instanceof Error ? J.message : String(J);
    k(`Failed to load session plugin from ${Y}: ${X}`, {
      level: "warn"
    }), B.push({
      type: "generic-error",
      source: `inline[${Z}]`,
      error: `Failed to load plugin: ${X}`
    })
  }
  if (Q.length > 0) k(`Loaded ${Q.length} session-only plugins from --plugin-dir`);
  return {
    plugins: Q,
    errors: B
  }
}

// READABLE (for understanding):
async function loadInlinePlugins(inlinePluginPaths) {
  if (inlinePluginPaths.length === 0) {
    return { plugins: [], errors: [] };
  }

  let loadedPlugins = [];
  let errors = [];
  let fs = getFileSystem();

  for (let [index, pluginPath] of inlinePluginPaths.entries()) {
    try {
      // Normalize path
      let normalizedPath = normalizePath(pluginPath);

      // Validate path exists
      if (!fs.existsSync(normalizedPath)) {
        log(`Plugin path does not exist: ${normalizedPath}, skipping`, { level: "warn" });
        errors.push({
          type: "path-not-found",
          source: `inline[${index}]`,
          path: normalizedPath,
          component: "commands"
        });
        continue;
      }

      // Extract plugin name from path
      let pluginName = extractPluginNameFromPath(normalizedPath);

      // Load plugin definition
      let { plugin, errors: loadErrors } = loadPluginDefinitionFromPath(
        normalizedPath,
        `${pluginName}@inline`,  // Source ID marked as inline
        true,                     // Always enabled
        pluginName
      );

      // Mark as inline plugin
      plugin.source = `${plugin.name}@inline`;
      plugin.repository = `${plugin.name}@inline`;

      loadedPlugins.push(plugin);
      errors.push(...loadErrors);

      log(`Loaded inline plugin from path: ${plugin.name}`);

    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : String(error);
      log(`Failed to load session plugin from ${pluginPath}: ${errorMessage}`, { level: "warn" });
      errors.push({
        type: "generic-error",
        source: `inline[${index}]`,
        error: `Failed to load plugin: ${errorMessage}`
      });
    }
  }

  if (loadedPlugins.length > 0) {
    log(`Loaded ${loadedPlugins.length} session-only plugins from --plugin-dir`);
  }

  return {
    plugins: loadedPlugins,
    errors: errors
  };
}

// Mapping: RB7→loadInlinePlugins, zB7→normalizePath, $B7→extractPluginNameFromPath,
//          ao2→loadPluginDefinitionFromPath
```

### Get Inline Plugins from Session

```javascript
// ============================================
// getInlinePlugins - Get --plugin-dir paths from session context
// Location: chunks.1.mjs:2678
// ============================================

// ORIGINAL (for source lookup):
function Qf0() {
  return g0.inlinePlugins || []
}

// READABLE (for understanding):
function getInlinePlugins() {
  return sessionContext.inlinePlugins || [];
}

// The inlinePlugins array is populated from CLI args:
// claude --plugin-dir ./my-plugin --plugin-dir ./another-plugin

// Mapping: Qf0→getInlinePlugins, g0→sessionContext
```

---

## Hook Integration

Hooks are loaded from two locations:

1. **Standard location**: `hooks/hooks.json`
2. **Manifest-declared**: paths in `manifest.hooks`

```javascript
// ============================================
// Hook loading within loadPluginDefinitionFromPath
// Location: chunks.130.mjs:2735-2820
// ============================================

// ORIGINAL (for source lookup):
// ... within ao2 function
let H, E = new Set,
  z = T8(A, "hooks", "hooks.json");
if (Y.existsSync(z)) try {
  H = po2(z, I.name);
  try {
    E.add(Y.realpathSync(z))
  } catch {
    E.add(z)
  }
  k(`Loaded hooks from standard location for plugin ${I.name}: ${z}`)
} catch ($) {
  let O = $ instanceof Error ? $.message : String($);
  k(`Failed to load hooks for ${I.name}: ${O}`, {
    level: "error"
  }), e($ instanceof Error ? $ : Error(O)), J.push({
    type: "hook-load-failed",
    source: Q,
    plugin: I.name,
    hookPath: z,
    reason: O
  })
}
if (I.hooks) {
  let $ = Array.isArray(I.hooks) ? I.hooks : [I.hooks];
  for (let O of $)
    if (typeof O === "string") {
      let L = T8(A, O);
      // ... load hook file
    }
}

// READABLE (for understanding):
// Within loadPluginDefinitionFromPath:

let hooksConfig;
let loadedHookFiles = new Set();  // Track to avoid duplicates

// 1. Check standard location first
const standardHooksPath = path.join(pluginPath, "hooks", "hooks.json");
if (fs.existsSync(standardHooksPath)) {
  try {
    hooksConfig = loadHooksFile(standardHooksPath, manifest.name);

    // Track real path to avoid duplicates
    try {
      loadedHookFiles.add(fs.realpathSync(standardHooksPath));
    } catch {
      loadedHookFiles.add(standardHooksPath);
    }

    log(`Loaded hooks from standard location for plugin ${manifest.name}: ${standardHooksPath}`);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : String(error);
    log(`Failed to load hooks for ${manifest.name}: ${errorMessage}`, { level: "error" });
    errors.push({
      type: "hook-load-failed",
      source: source,
      plugin: manifest.name,
      hookPath: standardHooksPath,
      reason: errorMessage
    });
  }
}

// 2. Load manifest-declared hooks
if (manifest.hooks) {
  const hookPaths = Array.isArray(manifest.hooks) ? manifest.hooks : [manifest.hooks];

  for (const hookPath of hookPaths) {
    if (typeof hookPath === "string") {
      const fullHookPath = path.join(pluginPath, hookPath);

      // Skip if not found
      if (!fs.existsSync(fullHookPath)) {
        errors.push({
          type: "path-not-found",
          source: source,
          plugin: manifest.name,
          path: fullHookPath,
          component: "hooks"
        });
        continue;
      }

      // Skip if already loaded (deduplication)
      let realPath;
      try { realPath = fs.realpathSync(fullHookPath); }
      catch { realPath = fullHookPath; }

      if (loadedHookFiles.has(realPath)) {
        log(`Skipping duplicate hook file: ${fullHookPath}`);
        continue;
      }
      loadedHookFiles.add(realPath);

      // Load and merge hooks
      try {
        const additionalHooks = loadHooksFile(fullHookPath, manifest.name);
        hooksConfig = mergeHookConfigs(hooksConfig, additionalHooks);
        log(`Loaded hooks from ${fullHookPath} for plugin ${manifest.name}`);
      } catch (error) {
        errors.push({
          type: "hook-load-failed",
          source: source,
          plugin: manifest.name,
          hookPath: fullHookPath,
          reason: error.message
        });
      }
    }
  }
}

if (hooksConfig) {
  pluginDef.hooksConfig = hooksConfig;
}
```

### Load Hooks File

```javascript
// ============================================
// loadHooksFile - Parse hooks.json file
// Location: chunks.130.mjs:2602-2610
// ============================================

// ORIGINAL (for source lookup):
function po2(A, Q) {
  let B = vA();
  if (!B.existsSync(A)) throw Error(`Hooks file not found at ${A} for plugin ${Q}. If the manifest declares hooks, the file must exist.`);
  let G = B.readFileSync(A, {
      encoding: "utf-8"
    }),
    Z = AQ(G);
  return l62.parse(Z).hooks
}

// READABLE (for understanding):
function loadHooksFile(hooksPath, pluginName) {
  const fs = getFileSystem();

  if (!fs.existsSync(hooksPath)) {
    throw Error(`Hooks file not found at ${hooksPath} for plugin ${pluginName}. If the manifest declares hooks, the file must exist.`);
  }

  const content = fs.readFileSync(hooksPath, { encoding: "utf-8" });
  const parsed = JSON.parse(content);

  // Validate against hooks schema
  return hooksFileSchema.parse(parsed).hooks;
}

// Mapping: po2→loadHooksFile, l62→hooksFileSchema
```

### Merge Hook Configs

```javascript
// ============================================
// mergeHookConfigs - Merge multiple hook configurations
// Location: chunks.130.mjs:2830-2838
// ============================================

// ORIGINAL (for source lookup):
function lo2(A, Q) {
  if (!A) return Q;
  let B = {
    ...A
  };
  for (let [G, Z] of Object.entries(Q))
    if (!B[G]) B[G] = Z;
    else B[G] = [...B[G] || [], ...Z];
  return B
}

// READABLE (for understanding):
function mergeHookConfigs(baseConfig, additionalConfig) {
  if (!baseConfig) return additionalConfig;

  const merged = { ...baseConfig };

  for (const [hookType, hooks] of Object.entries(additionalConfig)) {
    if (!merged[hookType]) {
      merged[hookType] = hooks;
    } else {
      // Append to existing hooks array
      merged[hookType] = [...(merged[hookType] || []), ...hooks];
    }
  }

  return merged;
}

// Example:
// baseConfig: { PreToolUse: [hook1, hook2] }
// additionalConfig: { PreToolUse: [hook3], PostToolUse: [hook4] }
// Result: { PreToolUse: [hook1, hook2, hook3], PostToolUse: [hook4] }

// Mapping: lo2→mergeHookConfigs
```

---

## Cache Management

### Clear Plugin Cache

```javascript
// ============================================
// clearPluginCache - Clear memoized discovery function
// Location: chunks.130.mjs:3224-3226
// ============================================

// ORIGINAL (for source lookup):
function Bt() {
  DG.cache?.clear?.()
}

// READABLE (for understanding):
function clearPluginCache() {
  discoverPluginsAndHooks.cache?.clear?.();
}

// When to clear:
// - After enabling/disabling a plugin
// - After installing/uninstalling a plugin
// - After updating a plugin
// - After modifying settings.json

// Mapping: Bt→clearPluginCache, DG→discoverPluginsAndHooks
```

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `DG` | discoverPluginsAndHooks | chunks.130.mjs:3246 | Main discovery (memoized) |
| `OB7` | loadMarketplacePlugins | chunks.130.mjs:2841 | Load from marketplaces |
| `RB7` | loadInlinePlugins | chunks.130.mjs:3180 | Load from --plugin-dir |
| `MB7` | initializePluginFromMarketplace | chunks.130.mjs:2890 | Initialize single plugin |
| `ao2` | loadPluginDefinitionFromPath | chunks.130.mjs:2612 | Parse plugin from path |
| `po2` | loadHooksFile | chunks.130.mjs:2602 | Load hooks.json |
| `lo2` | mergeHookConfigs | chunks.130.mjs:2830 | Merge hook configurations |
| `Bt` | clearPluginCache | chunks.130.mjs:3224 | Clear memoized cache |
| `Qf0` | getInlinePlugins | chunks.1.mjs:2678 | Get --plugin-dir paths |
| `W0/_U1` | createMemoizedAsync | chunks.1.mjs:636 | Memoization wrapper |
| `HI0` | findPluginInCachedMarketplace | chunks.91.mjs:237 | Cache lookup |
| `H4A` | isMarketplaceSourceAllowed | chunks.91.mjs | Policy check |
| `O4A` | getPluginAgents | chunks.93.mjs:554 | Load agents (memoized) |
| `tw0` | getPluginSkills | chunks.130.mjs:1945 | Load skills (memoized) |
| `ew0` | getPluginOutputStyles | chunks.130.mjs:2050 | Load output styles (memoized) |
| `yo2` | scanOutputStylesDirectory | chunks.130.mjs:1982 | Scan output-styles dir |
| `vo2` | loadOutputStyleFromFile | chunks.130.mjs:2006 | Parse output style file |
| `xg5` | loadLspServersFromPlugin | chunks.114.mjs:2016 | Load LSP configs |
| `yg5` | replacePluginRoot | chunks.114.mjs:2078 | Expand ${CLAUDE_PLUGIN_ROOT} |
| `vg5` | expandLspServerConfig | chunks.114.mjs:2082 | Expand LSP server config |
| `N52` | loadAgentsFromDirectory | chunks.93.mjs | Scan agents directory |
| `w52` | loadAgentFromFile | chunks.93.mjs | Parse agent file |
| `So2` | loadSkillsFromPath | chunks.130.mjs | Load skills from path |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [installation.md](./installation.md) - Plugin installation
- [marketplace.md](./marketplace.md) - Marketplace management
- [state_management.md](./state_management.md) - Enable/disable state
- [../11_hook/](../11_hook/) - Hook system integration
