# Marketplace Management

> How marketplaces are discovered, registered, and managed.
>
> **Related Symbols:** See symbol index files:
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

---

## Quick Navigation

- [Marketplace Concept](#marketplace-concept)
- [Source Types](#source-types)
- [Add Marketplace](#add-marketplace)
- [Remove Marketplace](#remove-marketplace)
- [Refresh/Update Marketplace](#refreshupdate-marketplace)
- [Plugin Lookup](#plugin-lookup)
- [Auto-Update Feature](#auto-update-feature)
- [Enterprise Policy](#enterprise-policy)

---

## Marketplace Concept

A **marketplace** is a curated collection of plugins with a manifest file (`marketplace.json`).

```
marketplace/
├── .claude-plugin/
│   └── marketplace.json    # Marketplace manifest
└── plugins/                # Plugin directories (for local sources)
    ├── plugin-a/
    └── plugin-b/
```

### Marketplace Manifest Structure

```json
{
  "name": "my-marketplace",
  "description": "My custom plugin collection",
  "plugins": [
    {
      "name": "plugin-a",
      "description": "Plugin A description",
      "version": "1.0.0",
      "source": "./plugins/plugin-a"
    },
    {
      "name": "plugin-b",
      "description": "Plugin B description",
      "source": {
        "source": "github",
        "repo": "owner/plugin-b"
      }
    }
  ]
}
```

### Known Marketplaces Configuration

Registered marketplaces are stored in `~/.claude/plugins/known_marketplaces.json`:

```json
{
  "my-marketplace": {
    "source": {
      "source": "github",
      "repo": "owner/marketplace-repo"
    },
    "installLocation": "~/.claude/plugins/marketplaces/my-marketplace",
    "lastUpdated": "2024-01-15T10:30:00Z",
    "autoUpdate": true
  }
}
```

---

## Source Types

Marketplaces can be added from different source types:

| Source Type | Format | Description |
|-------------|--------|-------------|
| `github` | `{ source: "github", repo: "owner/repo", ref?: "branch" }` | GitHub repository |
| `git` | `{ source: "git", url: "git@...", ref?: "branch" }` | Any git URL |
| `url` | `{ source: "url", url: "https://...", headers?: {...} }` | Direct URL to JSON |
| `file` | `{ source: "file", path: "/path/to/marketplace.json" }` | Local file |
| `directory` | `{ source: "directory", path: "/path/to/dir" }` | Local directory |
| `npm` | Not yet implemented | NPM package |

---

## Add Marketplace

```javascript
// ============================================
// addMarketplaceSource - Register new marketplace
// Location: chunks.91.mjs:136-156
// ============================================

// ORIGINAL (for source lookup):
async function NS(A, Q) {
  if (!H4A(A)) {
    if (AyA(A)) throw Error(`Marketplace source '${KVA(A)}' is blocked by enterprise policy.`);
    let J = WVA() || [];
    throw Error(`Marketplace source '${KVA(A)}' is blocked by enterprise policy. ` + (J.length > 0 ? `Allowed sources: ${J.map((X)=>KVA(X)).join(", ")}` : "No external marketplaces are allowed."))
  }
  let {
    marketplace: B,
    cachePath: G
  } = await VI0(A, Q), Z = c62(B.name, A);
  if (Z) throw Error(Z);
  let Y = await D5();
  if (Y[B.name]) throw Error(`Marketplace '${B.name}' is already installed. Please remove it first using '/plugin marketplace remove ${B.name}' if you want to re-install it.`);
  return Y[B.name] = {
    source: A,
    installLocation: G,
    lastUpdated: new Date().toISOString()
  }, await FVA(Y), k(`Added marketplace source: ${B.name}`), {
    name: B.name
  }
}

// READABLE (for understanding):
async function addMarketplaceSource(source, progressCallback) {
  // 1. Check enterprise policy
  if (!isMarketplaceSourceAllowed(source)) {
    if (isMarketplaceSourceBlocked(source)) {
      throw Error(`Marketplace source '${formatSourceName(source)}' is blocked by enterprise policy.`);
    }
    let allowedSources = getAllowedMarketplaceSources() || [];
    throw Error(
      `Marketplace source blocked by policy. ` +
      (allowedSources.length > 0
        ? `Allowed: ${allowedSources.map(formatSourceName).join(", ")}`
        : "No external marketplaces allowed.")
    );
  }

  // 2. Download and validate marketplace
  let { marketplace, cachePath } = await loadMarketplaceSource(source, progressCallback);

  // 3. Validate marketplace name
  let validationError = validateMarketplaceName(marketplace.name, source);
  if (validationError) throw Error(validationError);

  // 4. Check for duplicates
  let config = await loadMarketplaceConfigs();
  if (config[marketplace.name]) {
    throw Error(`Marketplace '${marketplace.name}' already installed. Remove first with '/plugin marketplace remove ${marketplace.name}'.`);
  }

  // 5. Save configuration
  config[marketplace.name] = {
    source: source,
    installLocation: cachePath,
    lastUpdated: new Date().toISOString()
  };
  await saveMarketplaceConfig(config);

  log(`Added marketplace source: ${marketplace.name}`);
  return { name: marketplace.name };
}

// Mapping: NS→addMarketplaceSource, H4A→isMarketplaceSourceAllowed, AyA→isMarketplaceSourceBlocked,
//          WVA→getAllowedMarketplaceSources, VI0→loadMarketplaceSource, D5→loadMarketplaceConfigs,
//          FVA→saveMarketplaceConfig, KVA→formatSourceName
```

### Load Marketplace Source

```javascript
// ============================================
// loadMarketplaceSource - Download and validate marketplace from source
// Location: chunks.91.mjs:17-134
// ============================================

// ORIGINAL (for source lookup):
async function VI0(A, Q) {
  let B = vA(),
    G = Z32();
  B.mkdirSync(G);
  let Z, Y, J = !1,
    X = t75(A);
  try {
    switch (A.source) {
      case "url": {
        Z = sC(G, `${X}.json`), J = !0, await Y32(A.url, Z, A.headers, Q), Y = Z;
        break
      }
      case "github": {
        let K = `git@github.com:${A.repo}.git`,
          V = `https://github.com/${A.repo}.git`;
        Z = sC(G, X), J = !0;
        // SSH with HTTPS fallback (or vice versa)
        // ... clone logic
        Y = sC(Z, A.path || ".claude-plugin/marketplace.json");
        break
      }
      case "git": {
        Z = sC(G, X), J = !0, await VVA(A.url, Z, A.ref, Q), Y = sC(Z, A.path || ".claude-plugin/marketplace.json");
        break
      }
      case "npm":
        throw Error("NPM marketplace sources not yet implemented");
      case "file": {
        Y = A.path, Z = A32(A32(A.path)), J = !1;
        break
      }
      case "directory": {
        Y = sC(A.path, ".claude-plugin", "marketplace.json"), Z = A.path, J = !1;
        break
      }
      default:
        throw Error("Unsupported marketplace source type")
    }
    // Validate and finalize...
  } catch (I) {
    // Cleanup on failure
  }
}

// READABLE (for understanding):
async function loadMarketplaceSource(source, progressCallback) {
  const fs = getFileSystem();
  const marketplacesCacheDir = getMarketplacesCacheDir();  // ~/.claude/plugins/marketplaces/
  fs.mkdirSync(marketplacesCacheDir);

  let tempDir;
  let marketplacePath;
  let needsCleanup = false;
  const tempDirName = generateTempName(source);

  try {
    switch (source.source) {
      case "url": {
        // Download JSON directly
        tempDir = path.join(marketplacesCacheDir, `${tempDirName}.json`);
        needsCleanup = true;
        await downloadFile(source.url, tempDir, source.headers, progressCallback);
        marketplacePath = tempDir;
        break;
      }

      case "github": {
        // Clone from GitHub (SSH with HTTPS fallback)
        const sshUrl = `git@github.com:${source.repo}.git`;
        const httpsUrl = `https://github.com/${source.repo}.git`;
        tempDir = path.join(marketplacesCacheDir, tempDirName);
        needsCleanup = true;

        // Try SSH first if configured, fall back to HTTPS
        if (await isSSHConfigured()) {
          progressCallback?.(`Cloning via SSH: ${sshUrl}`);
          try {
            await cloneRepository(sshUrl, tempDir, source.ref, progressCallback);
          } catch (sshError) {
            progressCallback?.(`SSH failed, trying HTTPS: ${httpsUrl}`);
            if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true });
            await cloneRepository(httpsUrl, tempDir, source.ref, progressCallback);
          }
        } else {
          // Try HTTPS first, fall back to SSH
          progressCallback?.(`Cloning via HTTPS: ${httpsUrl}`);
          try {
            await cloneRepository(httpsUrl, tempDir, source.ref, progressCallback);
          } catch (httpsError) {
            progressCallback?.(`HTTPS failed, trying SSH: ${sshUrl}`);
            if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true });
            await cloneRepository(sshUrl, tempDir, source.ref, progressCallback);
          }
        }

        marketplacePath = path.join(tempDir, source.path || ".claude-plugin/marketplace.json");
        break;
      }

      case "git": {
        // Clone from any git URL
        tempDir = path.join(marketplacesCacheDir, tempDirName);
        needsCleanup = true;
        await cloneRepository(source.url, tempDir, source.ref, progressCallback);
        marketplacePath = path.join(tempDir, source.path || ".claude-plugin/marketplace.json");
        break;
      }

      case "npm":
        throw Error("NPM marketplace sources not yet implemented");

      case "file": {
        // Use file directly (no copy)
        marketplacePath = source.path;
        tempDir = path.dirname(path.dirname(source.path));
        needsCleanup = false;
        break;
      }

      case "directory": {
        // Use directory directly
        marketplacePath = path.join(source.path, ".claude-plugin", "marketplace.json");
        tempDir = source.path;
        needsCleanup = false;
        break;
      }

      default:
        throw Error("Unsupported marketplace source type");
    }

    // Validate marketplace file exists
    if (!fs.existsSync(marketplacePath)) {
      throw Error(`Marketplace file not found at ${marketplacePath}`);
    }

    // Parse and validate
    const marketplace = parseAndValidateSchema(marketplacePath, marketplaceJsonSchema);

    // Rename temp dir to marketplace name (for git/url sources)
    const finalDir = path.join(marketplacesCacheDir, marketplace.name);
    const isLocalSource = source.source === "file" || source.source === "directory";

    if (tempDir !== finalDir && !isLocalSource) {
      if (fs.existsSync(finalDir)) {
        progressCallback?.("Cleaning up old marketplace cache…");
        fs.rmSync(finalDir, { recursive: true, force: true });
      }
      fs.renameSync(tempDir, finalDir);
      tempDir = finalDir;
      needsCleanup = false;
    }

    return {
      marketplace: marketplace,
      cachePath: tempDir
    };

  } catch (error) {
    // Cleanup on failure
    if (needsCleanup && tempDir && source.source !== "file" && source.source !== "directory") {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
    throw error;
  }
}

// Mapping: VI0→loadMarketplaceSource, Z32→getMarketplacesCacheDir, t75→generateTempName,
//          VVA→cloneRepository, Y32→downloadFile, JVA→marketplaceJsonSchema
```

---

## Remove Marketplace

```javascript
// ============================================
// removeMarketplaceSource - Unregister marketplace and cleanup
// Location: chunks.91.mjs:158-201
// ============================================

// ORIGINAL (for source lookup):
async function _Z1(A) {
  let Q = await D5();
  if (!Q[A]) throw Error(`Marketplace '${A}' not found`);
  delete Q[A], await FVA(Q);
  let B = vA(),
    G = Z32(),
    Z = sC(G, A);
  if (B.existsSync(Z)) B.rmSync(Z, { recursive: !0, force: !0 });
  let Y = sC(G, `${A}.json`);
  if (B.existsSync(Y)) B.rmSync(Y, { force: !0 });
  // Clean up settings...
  k(`Removed marketplace source: ${A}`)
}

// READABLE (for understanding):
async function removeMarketplaceSource(marketplaceName) {
  // 1. Load config and verify exists
  let config = await loadMarketplaceConfigs();
  if (!config[marketplaceName]) {
    throw Error(`Marketplace '${marketplaceName}' not found`);
  }

  // 2. Remove from config
  delete config[marketplaceName];
  await saveMarketplaceConfig(config);

  // 3. Delete cached files
  const fs = getFileSystem();
  const cacheDir = getMarketplacesCacheDir();

  // Delete directory cache
  const dirPath = path.join(cacheDir, marketplaceName);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }

  // Delete JSON file cache
  const jsonPath = path.join(cacheDir, `${marketplaceName}.json`);
  if (fs.existsSync(jsonPath)) {
    fs.rmSync(jsonPath, { force: true });
  }

  // 4. Clean up settings (remove enabled plugins from this marketplace)
  const settingsScopes = ["userSettings", "projectSettings", "localSettings"];
  for (const scope of settingsScopes) {
    let settings = getSettings(scope);
    if (!settings) continue;

    let hasChanges = false;
    let updates = {};

    // Remove from extraKnownMarketplaces
    if (settings.extraKnownMarketplaces?.[marketplaceName]) {
      let newExtra = { ...settings.extraKnownMarketplaces };
      delete newExtra[marketplaceName];
      updates.extraKnownMarketplaces = newExtra;
      hasChanges = true;
    }

    // Remove enabled plugins from this marketplace
    if (settings.enabledPlugins) {
      const suffix = `@${marketplaceName}`;
      let newEnabled = { ...settings.enabledPlugins };
      let removedAny = false;
      for (const pluginId in newEnabled) {
        if (pluginId.endsWith(suffix)) {
          delete newEnabled[pluginId];
          removedAny = true;
        }
      }
      if (removedAny) {
        updates.enabledPlugins = newEnabled;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      let result = saveSettings(scope, updates);
      if (result.error) {
        logError(result.error);
        log(`Failed to clean up marketplace '${marketplaceName}' from ${scope} settings`);
      } else {
        log(`Cleaned up marketplace '${marketplaceName}' from ${scope} settings`);
      }
    }
  }

  log(`Removed marketplace source: ${marketplaceName}`);
}

// Mapping: _Z1→removeMarketplaceSource, D5→loadMarketplaceConfigs, FVA→saveMarketplaceConfig,
//          Z32→getMarketplacesCacheDir, dB→getSettings, pB→saveSettings
```

---

## Refresh/Update Marketplace

```javascript
// ============================================
// refreshMarketplace - Update marketplace from source
// Location: chunks.91.mjs:299-320
// ============================================

// ORIGINAL (for source lookup):
async function Rr(A, Q) {
  let B = await D5(),
    G = B[A];
  if (!G) throw Error(`Marketplace '${A}' not found. Available marketplaces: ${Object.keys(B).join(", ")}`);
  rC.cache?.delete?.(A);
  try {
    let { installLocation: Z, source: Y } = G;
    if (Y.source === "github" || Y.source === "git")
      await VVA(Y.source === "github" ? `git@github.com:${Y.repo}.git` : Y.url, Z, Y.ref, Q);
    else if (Y.source === "url")
      await Y32(Y.url, Z, Y.headers, Q);
    else if (Y.source === "file" || Y.source === "directory")
      b_(Q, "Validating local marketplace"), FI0(Z);
    else throw Error("Unsupported marketplace source type for refresh");
    B[A].lastUpdated = new Date().toISOString(), await FVA(B), k(`Successfully refreshed marketplace: ${A}`)
  } catch (Z) {
    let Y = Z instanceof Error ? Z.message : String(Z);
    throw k(`Failed to refresh marketplace ${A}: ${Y}`, { level: "error" }), Error(`Failed to refresh marketplace '${A}': ${Y}`)
  }
}

// READABLE (for understanding):
async function refreshMarketplace(marketplaceName, progressCallback) {
  let config = await loadMarketplaceConfigs();
  let entry = config[marketplaceName];

  if (!entry) {
    throw Error(`Marketplace '${marketplaceName}' not found. Available: ${Object.keys(config).join(", ")}`);
  }

  // Clear memoized cache
  loadOrFetchMarketplace.cache?.delete?.(marketplaceName);

  try {
    const { installLocation, source } = entry;

    // Re-fetch based on source type
    if (source.source === "github" || source.source === "git") {
      const url = source.source === "github"
        ? `git@github.com:${source.repo}.git`
        : source.url;
      await cloneRepository(url, installLocation, source.ref, progressCallback);
    } else if (source.source === "url") {
      await downloadFile(source.url, installLocation, source.headers, progressCallback);
    } else if (source.source === "file" || source.source === "directory") {
      progressCallback?.("Validating local marketplace");
      loadMarketplaceFromCache(installLocation);  // Just validate
    } else {
      throw Error("Unsupported marketplace source type for refresh");
    }

    // Update last updated timestamp
    config[marketplaceName].lastUpdated = new Date().toISOString();
    await saveMarketplaceConfig(config);

    log(`Successfully refreshed marketplace: ${marketplaceName}`);

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Failed to refresh marketplace ${marketplaceName}: ${message}`, { level: "error" });
    throw Error(`Failed to refresh marketplace '${marketplaceName}': ${message}`);
  }
}

// Mapping: Rr→refreshMarketplace, rC→loadOrFetchMarketplace, VVA→cloneRepository,
//          Y32→downloadFile, FI0→loadMarketplaceFromCache
```

---

## Plugin Lookup

### Two-Level Lookup Strategy

Plugin lookup uses a two-level strategy:
1. **Cache first**: Check local cached marketplace data
2. **Fetch fallback**: Load/refresh from source if not in cache

```javascript
// ============================================
// findPluginInCachedMarketplace - Sync cache lookup
// Location: chunks.91.mjs:237-262
// ============================================

// ORIGINAL (for source lookup):
function HI0(A) {
  let Q = A.split("@");
  if (Q.length !== 2) return null;
  let B = Q[0], G = Q[1],
    Z = vA(),
    Y = MZ1();
  if (!Z.existsSync(Y)) return null;
  try {
    let J = Z.readFileSync(Y, { encoding: "utf-8" }),
      I = AQ(J)[G];
    if (!I) return null;
    let D = e75(G);
    if (!D) return null;
    let W = D.plugins.find((K) => K.name === B);
    if (!W) return null;
    return {
      entry: W,
      marketplaceInstallLocation: I.installLocation
    }
  } catch {
    return null
  }
}

// READABLE (for understanding):
function findPluginInCachedMarketplace(pluginId) {
  const parts = pluginId.split("@");
  if (parts.length !== 2) return null;

  const [pluginName, marketplaceName] = parts;
  const fs = getFileSystem();
  const configPath = getMarketplaceConfigPath();  // ~/.claude/plugins/known_marketplaces.json

  if (!fs.existsSync(configPath)) return null;

  try {
    const configContent = fs.readFileSync(configPath, { encoding: "utf-8" });
    const config = JSON.parse(configContent);
    const marketplaceEntry = config[marketplaceName];

    if (!marketplaceEntry) return null;

    // Load cached marketplace data
    const marketplaceData = loadCachedMarketplace(marketplaceName);
    if (!marketplaceData) return null;

    // Find plugin in marketplace
    const pluginEntry = marketplaceData.plugins.find(p => p.name === pluginName);
    if (!pluginEntry) return null;

    return {
      entry: pluginEntry,
      marketplaceInstallLocation: marketplaceEntry.installLocation
    };
  } catch {
    return null;
  }
}

// Mapping: HI0→findPluginInCachedMarketplace, MZ1→getMarketplaceConfigPath, e75→loadCachedMarketplace
```

```javascript
// ============================================
// findPluginInMarketplaces - Async lookup with fetch fallback
// Location: chunks.91.mjs:264-285
// ============================================

// ORIGINAL (for source lookup):
async function NF(A) {
  let Q = HI0(A);
  if (Q) return Q;
  let B = A.split("@");
  if (B.length !== 2) return null;
  let G = B[0], Z = B[1];
  try {
    let J = (await D5())[Z];
    if (!J) return null;
    let I = (await rC(Z)).plugins.find((D) => D.name === G);
    if (!I) return null;
    return {
      entry: I,
      marketplaceInstallLocation: J.installLocation
    }
  } catch (Y) {
    return k(`Could not find plugin ${A}: ${Y instanceof Error?Y.message:String(Y)}`, { level: "debug" }), null
  }
}

// READABLE (for understanding):
async function findPluginInMarketplaces(pluginId) {
  // 1. Try cache first (fast, sync)
  let cached = findPluginInCachedMarketplace(pluginId);
  if (cached) return cached;

  // 2. Parse plugin ID
  let parts = pluginId.split("@");
  if (parts.length !== 2) return null;
  let [pluginName, marketplaceName] = parts;

  try {
    // 3. Load marketplace config
    let config = (await loadMarketplaceConfigs())[marketplaceName];
    if (!config) return null;

    // 4. Load marketplace data (memoized, may fetch from source)
    let marketplaceData = await loadOrFetchMarketplace(marketplaceName);
    let pluginEntry = marketplaceData.plugins.find(p => p.name === pluginName);
    if (!pluginEntry) return null;

    return {
      entry: pluginEntry,
      marketplaceInstallLocation: config.installLocation
    };

  } catch (error) {
    log(`Could not find plugin ${pluginId}: ${error.message}`, { level: "debug" });
    return null;
  }
}

// Mapping: NF→findPluginInMarketplaces, HI0→findPluginInCachedMarketplace,
//          D5→loadMarketplaceConfigs, rC→loadOrFetchMarketplace
```

### Memoized Marketplace Loading

```javascript
// ============================================
// loadOrFetchMarketplace - Memoized marketplace loader
// Location: chunks.91.mjs:355-370
// ============================================

// ORIGINAL (for source lookup):
rC = W0(async (A) => {
  let Q = await D5(),
    B = Q[A];
  if (!B) throw Error(`Marketplace '${A}' not found in configuration. Available marketplaces: ${Object.keys(Q).join(", ")}`);
  try {
    return FI0(B.installLocation)
  } catch (Z) {
    k(`Cache corrupted or missing for marketplace ${A}, re-fetching from source: ${Z instanceof Error?Z.message:String(Z)}`, { level: "warn" })
  }
  let { marketplace: G } = await VI0(B.source);
  return Q[A].lastUpdated = new Date().toISOString(), await FVA(Q), G
})

// READABLE (for understanding):
loadOrFetchMarketplace = createMemoizedAsync(async (marketplaceName) => {
  let config = await loadMarketplaceConfigs();
  let entry = config[marketplaceName];

  if (!entry) {
    throw Error(`Marketplace '${marketplaceName}' not found. Available: ${Object.keys(config).join(", ")}`);
  }

  // Try loading from cache first
  try {
    return loadMarketplaceFromCache(entry.installLocation);
  } catch (error) {
    log(`Cache corrupted for marketplace ${marketplaceName}, re-fetching: ${error.message}`, { level: "warn" });
  }

  // Cache miss or corrupted - fetch from source
  let { marketplace } = await loadMarketplaceSource(entry.source);

  // Update timestamp
  config[marketplaceName].lastUpdated = new Date().toISOString();
  await saveMarketplaceConfig(config);

  return marketplace;
});

// Mapping: rC→loadOrFetchMarketplace, W0→createMemoizedAsync, FI0→loadMarketplaceFromCache,
//          VI0→loadMarketplaceSource
```

---

## Auto-Update Feature

Marketplaces can be configured to auto-update.

```javascript
// ============================================
// setMarketplaceAutoUpdate - Toggle auto-update for marketplace
// Location: chunks.91.mjs:322-331
// ============================================

// ORIGINAL (for source lookup):
async function I32(A, Q) {
  let B = await D5(),
    G = B[A];
  if (!G) throw Error(`Marketplace '${A}' not found. Available marketplaces: ${Object.keys(B).join(", ")}`);
  if (G.autoUpdate === Q) return;
  B[A] = {
    ...G,
    autoUpdate: Q
  }, await FVA(B), k(`Set autoUpdate=${Q} for marketplace: ${A}`)
}

// READABLE (for understanding):
async function setMarketplaceAutoUpdate(marketplaceName, enabled) {
  let config = await loadMarketplaceConfigs();
  let entry = config[marketplaceName];

  if (!entry) {
    throw Error(`Marketplace '${marketplaceName}' not found. Available: ${Object.keys(config).join(", ")}`);
  }

  // Skip if already set to same value
  if (entry.autoUpdate === enabled) return;

  // Update config
  config[marketplaceName] = {
    ...entry,
    autoUpdate: enabled
  };

  await saveMarketplaceConfig(config);
  log(`Set autoUpdate=${enabled} for marketplace: ${marketplaceName}`);
}

// Mapping: I32→setMarketplaceAutoUpdate
```

Environment variable override:
- `FORCE_AUTOUPDATE_PLUGINS=1` - Force auto-update for all plugins (v2.1.2+)

---

## Enterprise Policy

Enterprise policies can control which marketplace sources are allowed.

### Policy Functions

```javascript
// ============================================
// isMarketplaceSourceAllowed - Check if source is allowed by policy
// Location: chunks.91.mjs:137
// ============================================

function isMarketplaceSourceAllowed(source) {
  // Check if source matches allowed sources from enterprise policy
  // Returns true if allowed, false if blocked
}

// ============================================
// isMarketplaceSourceBlocked - Check if source is explicitly blocklisted
// Location: chunks.91.mjs:138
// ============================================

function isMarketplaceSourceBlocked(source) {
  // Check if source is in enterprise blocklist
  // Returns true if blocklisted
}

// ============================================
// getAllowedMarketplaceSources - Get list of allowed sources
// Location: chunks.91.mjs:139
// ============================================

function getAllowedMarketplaceSources() {
  // Returns array of allowed source patterns from enterprise policy
  // Returns null if no restrictions
}

// Mapping: H4A→isMarketplaceSourceAllowed, AyA→isMarketplaceSourceBlocked, WVA→getAllowedMarketplaceSources
```

### Policy Scenarios

| Scenario | Behavior |
|----------|----------|
| No policy | All sources allowed |
| Allowlist only | Only specified sources allowed |
| Blocklist only | Specified sources blocked, others allowed |
| Both lists | Check blocklist first, then allowlist |

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `NS` | addMarketplaceSource | chunks.91.mjs:136 | Add marketplace |
| `_Z1` | removeMarketplaceSource | chunks.91.mjs:158 | Remove marketplace |
| `Rr` | refreshMarketplace | chunks.91.mjs:299 | Refresh/update |
| `I32` | setMarketplaceAutoUpdate | chunks.91.mjs:322 | Toggle auto-update |
| `VI0` | loadMarketplaceSource | chunks.91.mjs:17 | Download marketplace |
| `rC` | loadOrFetchMarketplace | chunks.91.mjs:355 | Memoized loader |
| `NF` | findPluginInMarketplaces | chunks.91.mjs:264 | Async lookup |
| `HI0` | findPluginInCachedMarketplace | chunks.91.mjs:237 | Cache lookup |
| `FI0` | loadMarketplaceFromCache | chunks.91.mjs:204 | Load from cache |
| `e75` | loadCachedMarketplace | chunks.91.mjs:221 | Load cached data |
| `D5` | loadMarketplaceConfigs | chunks.90.mjs:2232 | Read config |
| `FVA` | saveMarketplaceConfig | chunks.90.mjs:2258 | Write config |
| `MZ1` | getMarketplaceConfigPath | chunks.90.mjs:2220 | Config path |
| `Z32` | getMarketplacesCacheDir | chunks.90.mjs:2224 | Cache directory |
| `H4A` | isMarketplaceSourceAllowed | chunks.91.mjs | Policy check |
| `AyA` | isMarketplaceSourceBlocked | chunks.91.mjs | Blocklist check |
| `WVA` | getAllowedMarketplaceSources | chunks.91.mjs | Get allowed list |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [installation.md](./installation.md) - Plugin installation
- [loading.md](./loading.md) - Component loading
- [plugin_updates.md](./plugin_updates.md) - v2.1.7 specific changes
- [state_management.md](./state_management.md) - Enable/disable state
