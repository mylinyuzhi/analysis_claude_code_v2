# Marketplace Management

> Deep dive into plugin marketplace discovery, fetching, caching, and management.
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Plugin System section

---

## Quick Navigation

- [What is a Marketplace](#what-is-a-marketplace)
- [Marketplace Sources](#marketplace-sources)
- [Adding a Marketplace](#adding-a-marketplace)
- [Marketplace Storage](#marketplace-storage)
- [Marketplace Fetching](#marketplace-fetching)
- [Marketplace Update](#marketplace-update)
- [Plugin Lookup](#plugin-lookup)

---

## What is a Marketplace

A marketplace is a curated collection of plugins, defined by a `marketplace.json` file:

```json
{
  "name": "claude-plugins-official",
  "owner": {
    "name": "Anthropic",
    "email": "plugins@anthropic.com"
  },
  "plugins": [
    {
      "name": "code-formatter",
      "description": "Format code in multiple languages",
      "source": "./plugins/code-formatter",
      "category": "development",
      "tags": ["formatting", "linting"]
    },
    {
      "name": "github-integration",
      "source": {
        "source": "github",
        "repo": "anthropic/claude-github"
      }
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "pluginRoot": "./plugins"
  }
}
```

**Key insight:** Plugin sources can be:
- **Relative paths** (e.g., `./plugins/code-formatter`) - resolved against marketplace directory
- **Object sources** - npm, github, git, url for external plugins

---

## Marketplace Sources

Marketplaces can be fetched from various sources defined by `marketplaceSourceSchema` (eQ1):

| Source | Example | Description |
|--------|---------|-------------|
| `url` | `https://example.com/marketplace.json` | Direct HTTP URL |
| `github` | `{ source: "github", repo: "owner/repo" }` | GitHub repository |
| `git` | `{ source: "git", url: "git@..." }` | Git URL (SSH/HTTPS) |
| `npm` | `{ source: "npm", package: "@org/pkg" }` | NPM package (not yet implemented) |
| `file` | `{ source: "file", path: "/path/to/marketplace.json" }` | Local file |
| `directory` | `{ source: "directory", path: "/path/to/dir" }` | Local directory |

---

## Adding a Marketplace

### Command

```bash
/plugin marketplace add https://github.com/anthropic/claude-plugins
/plugin marketplace add file:///local/path/marketplace.json
```

### Implementation

```javascript
// ============================================
// addMarketplaceSource - Add a new marketplace
// Location: chunks.95.mjs:572-589
// ============================================

// ORIGINAL (for source lookup):
async function rAA(A, Q) {
  if (!GB1(A)) {
    let I = LLA() || [];
    throw Error(`Marketplace source '${MLA(A)}' is blocked by enterprise policy. ` +
      (I.length > 0 ? `Allowed sources: ${I.map((Y)=>MLA(Y)).join(", ")}` : "No external marketplaces are allowed."))
  }
  let { marketplace: B, cachePath: G } = await ve1(A, Q),
      Z = await pZ();
  if (Z[B.name]) throw Error(`Marketplace '${B.name}' is already installed.`);
  return Z[B.name] = {
    source: A,
    installLocation: G,
    lastUpdated: new Date().toISOString()
  }, await TLA(Z), g(`Added marketplace source: ${B.name}`), { name: B.name }
}

// READABLE (for understanding):
async function addMarketplaceSource(source, progressCallback) {
  // Step 1: Check enterprise policy
  if (!isMarketplaceAllowedByPolicy(source)) {
    const allowedSources = getAllowedMarketplaceSources() || [];
    throw Error(`Marketplace source blocked by policy. Allowed: ${allowedSources}`);
  }

  // Step 2: Fetch and cache the marketplace
  const { marketplace, cachePath } = await fetchAndCacheMarketplace(source, progressCallback);

  // Step 3: Check for duplicates
  const config = await loadMarketplaceConfig();
  if (config[marketplace.name]) {
    throw Error(`Marketplace '${marketplace.name}' is already installed.`);
  }

  // Step 4: Save to config
  config[marketplace.name] = {
    source: source,
    installLocation: cachePath,
    lastUpdated: new Date().toISOString()
  };
  await saveMarketplaceConfig(config);

  return { name: marketplace.name };
}

// Mapping: rAA→addMarketplaceSource, GB1→isMarketplaceAllowedByPolicy,
//          LLA→getAllowedMarketplaceSources, MLA→formatSourceForDisplay,
//          ve1→fetchAndCacheMarketplace, pZ→loadMarketplaceConfig, TLA→saveMarketplaceConfig
```

### Policy Checking

**Why this matters:** Enterprise deployments can restrict marketplace sources for security.

```javascript
// ============================================
// isMarketplaceAllowedByPolicy - Check enterprise restrictions
// Location: chunks.95.mjs (referenced from rAA)
// ============================================

// The function checks:
// 1. Enterprise config for allowedMarketplaces list
// 2. If list exists, source must match one of the allowed patterns
// 3. If no list, all sources are allowed (default)

// Policy configuration example:
{
  "plugin": {
    "allowedMarketplaces": [
      { "source": "github", "repo": "anthropic/*" },
      { "source": "url", "url": "https://internal.company.com/*" }
    ]
  }
}
```

---

## Marketplace Storage

### Config File Location

```javascript
// ============================================
// getMarketplacesConfigPath - Path to .marketplaces.json
// Location: chunks.95.mjs:232
// ============================================

// ORIGINAL (for source lookup):
function u22() { return A8(MQ(), "plugins", ".marketplaces.json") }

// READABLE (for understanding):
function getMarketplacesConfigPath() {
  return path.join(getClaudeDataDirectory(), "plugins", ".marketplaces.json");
}
// Returns: ~/.claude/plugins/.marketplaces.json

// Mapping: u22→getMarketplacesConfigPath, MQ→getClaudeDataDirectory
```

### Cache Directory

```javascript
// ============================================
// getMarketplacesCacheDir - Path to marketplaces cache
// Location: chunks.95.mjs:236
// ============================================

// ORIGINAL (for source lookup):
function m22() { return A8(MQ(), "plugins", "marketplaces") }

// READABLE (for understanding):
function getMarketplacesCacheDir() {
  return path.join(getClaudeDataDirectory(), "plugins", "marketplaces");
}
// Returns: ~/.claude/plugins/marketplaces/

// Mapping: m22→getMarketplacesCacheDir
```

### Loading Config

```javascript
// ============================================
// loadMarketplaceConfig - Load .marketplaces.json
// Location: chunks.95.mjs:244-260
// ============================================

// ORIGINAL (for source lookup):
async function pZ() {
  let A = u22(), Q = RA();
  if (!Q.existsSync(A)) return {};
  try {
    let B = Q.readFileSync(A, { encoding: "utf-8" }), G = JSON.parse(B);
    return ye1.parse(G)
  } catch (B) {
    return g(`Failed to load marketplace config: ${B}`, { level: "error" }), {}
  }
}

// READABLE (for understanding):
async function loadMarketplaceConfig() {
  const configPath = getMarketplacesConfigPath();
  const fs = getFs();

  if (!fs.existsSync(configPath)) {
    return {};  // No marketplaces configured yet
  }

  try {
    const content = fs.readFileSync(configPath, { encoding: "utf-8" });
    const data = JSON.parse(content);
    return marketplacesConfigSchema.parse(data);
  } catch (error) {
    log(`Failed to load marketplace config: ${error}`, { level: "error" });
    return {};
  }
}

// Mapping: pZ→loadMarketplaceConfig, u22→getMarketplacesConfigPath,
//          RA→getFs, ye1→marketplacesConfigSchema
```

### Config Schema

```typescript
// marketplacesConfigSchema (ye1)
type MarketplacesConfig = Record<string, {
  source: MarketplaceSource;      // How to fetch the marketplace
  installLocation: string;         // Where it's cached
  lastUpdated: string;            // ISO 8601 timestamp
}>;
```

---

## Marketplace Fetching

### Main Fetching Function

```javascript
// ============================================
// fetchAndCacheMarketplace - Fetch and cache marketplace
// Location: chunks.95.mjs:463-570
// ============================================

// ORIGINAL (for source lookup):
async function ve1(A, Q) {
  let B = RA(), G = m22(), Z, I, Y = !1, J, D;
  try {
    switch (A.source) {
      case "url": {
        Z = RE(G, `temp_url_${Date.now()}`);
        Y = !0;
        await c22(A.url, Z, A.headers, Q);
        I = Z;
        break
      }
      case "github": {
        let K = A.repo.replace("/", "-");
        J = RE(G, K);
        Z = RE(G, `temp_github_${Date.now()}`);
        Y = !0;
        await RLA(K, Z, A.ref, Q);
        I = RE(Z, A.path || ".claude-plugin/marketplace.json");
        break
      }
      case "git": {
        Z = RE(G, J);
        Y = !0;
        await RLA(A.url, Z, A.ref, Q);
        I = RE(Z, A.path || ".claude-plugin/marketplace.json");
        break
      }
      case "npm":
        throw Error("NPM marketplace sources not yet implemented");
      case "file": {
        I = A.path;
        Z = A.path;
        Y = !1;
        break
      }
      case "directory": {
        I = RE(A.path, ".claude-plugin", "marketplace.json");
        Z = A.path;
        Y = !1;
        break
      }
    }
    // Validate marketplace file exists
    if (!B.existsSync(I)) throw Error(`Marketplace file not found at ${I}`);

    // Parse and validate
    let W = p22(I, TIA);  // Parse JSON and validate with schema

    // Finalize cache path
    let X = RE(G, W.name);
    if (Z !== X && !isLocalSource) {
      // Rename temp dir to final name
      if (B.existsSync(X)) B.rmSync(X, { recursive: true, force: true });
      B.renameSync(Z, X);
      Z = X;
    }

    return { marketplace: W, cachePath: Z }
  } catch (W) {
    // Cleanup on error
    if (Y && Z && B.existsSync(Z)) {
      B.rmSync(Z, { recursive: true, force: true });
    }
    throw W;
  }
}

// READABLE (for understanding):
async function fetchAndCacheMarketplace(source, progressCallback) {
  const fs = getFs();
  const cacheDir = getMarketplacesCacheDir();
  let tempPath, manifestPath, needsCleanup = false;

  try {
    switch (source.source) {
      case "url":
        tempPath = path.join(cacheDir, `temp_url_${Date.now()}`);
        needsCleanup = true;
        await downloadMarketplaceFromUrl(source.url, tempPath, source.headers, progressCallback);
        manifestPath = tempPath;
        break;

      case "github":
        tempPath = path.join(cacheDir, `temp_github_${Date.now()}`);
        needsCleanup = true;
        await gitCloneRepository(`git@github.com:${source.repo}.git`, tempPath, source.ref, progressCallback);
        manifestPath = path.join(tempPath, source.path || ".claude-plugin/marketplace.json");
        break;

      case "git":
        tempPath = path.join(cacheDir, `temp_git_${Date.now()}`);
        needsCleanup = true;
        await gitCloneRepository(source.url, tempPath, source.ref, progressCallback);
        manifestPath = path.join(tempPath, source.path || ".claude-plugin/marketplace.json");
        break;

      case "npm":
        throw Error("NPM marketplace sources not yet implemented");

      case "file":
        manifestPath = source.path;
        tempPath = source.path;
        needsCleanup = false;
        break;

      case "directory":
        manifestPath = path.join(source.path, ".claude-plugin", "marketplace.json");
        tempPath = source.path;
        needsCleanup = false;
        break;
    }

    // Validate manifest exists
    if (!fs.existsSync(manifestPath)) {
      throw Error(`Marketplace file not found at ${manifestPath}`);
    }

    // Parse and validate with schema
    const marketplace = parseJsonWithSchema(manifestPath, marketplaceSchema);

    // Rename temp directory to marketplace name
    const finalPath = path.join(cacheDir, marketplace.name);
    if (tempPath !== finalPath && needsCleanup) {
      if (fs.existsSync(finalPath)) {
        fs.rmSync(finalPath, { recursive: true, force: true });
      }
      fs.renameSync(tempPath, finalPath);
      tempPath = finalPath;
      needsCleanup = false;
    }

    return { marketplace, cachePath: tempPath };

  } catch (error) {
    // Cleanup temp directory on failure
    if (needsCleanup && tempPath && fs.existsSync(tempPath)) {
      fs.rmSync(tempPath, { recursive: true, force: true });
    }
    throw error;
  }
}

// Mapping: ve1→fetchAndCacheMarketplace, c22→downloadMarketplaceFromUrl,
//          RLA→gitCloneRepository, p22→parseJsonWithSchema, TIA→marketplaceSchema
```

**Key insight:** The function creates temporary directories during fetch, then renames to final path on success. On failure, temp directories are cleaned up automatically.

---

## Marketplace Update

### Update Single Marketplace

```javascript
// ============================================
// updateMarketplace - Refresh a marketplace
// Location: chunks.95.mjs:687-708
// ============================================

// ORIGINAL (for source lookup):
async function IB1(A, Q) {
  let B = await pZ(), G = B[A];
  if (!G) throw Error(`Marketplace '${A}' not found.`);

  // Clear memoization cache
  _D.cache?.delete?.(A);

  try {
    let { installLocation: Z, source: I } = G;

    if (I.source === "github" || I.source === "git") {
      await RLA(I.source === "github" ? `git@github.com:${I.repo}.git` : I.url, Z, I.ref, Q);
    } else if (I.source === "url") {
      await c22(I.url, Z, I.headers, Q);
    } else if (I.source === "file" || I.source === "directory") {
      tT(Q, "Validating local marketplace");
      l22(Z);  // Just validate, no fetch needed
    } else {
      throw Error("Unsupported marketplace source type for refresh");
    }

    B[A].lastUpdated = new Date().toISOString();
    await TLA(B);
    g(`Successfully refreshed marketplace: ${A}`);
  } catch (Z) {
    throw Error(`Failed to refresh marketplace '${A}': ${Z.message}`);
  }
}

// READABLE (for understanding):
async function updateMarketplace(marketplaceName, progressCallback) {
  const config = await loadMarketplaceConfig();
  const entry = config[marketplaceName];

  if (!entry) {
    throw Error(`Marketplace '${marketplaceName}' not found.`);
  }

  // Clear memoization cache to force reload
  loadMarketplaceData.cache?.delete?.(marketplaceName);

  try {
    const { installLocation, source } = entry;

    // Re-fetch based on source type
    if (source.source === "github" || source.source === "git") {
      const gitUrl = source.source === "github"
        ? `git@github.com:${source.repo}.git`
        : source.url;
      await gitPullOrClone(gitUrl, installLocation, source.ref, progressCallback);
    } else if (source.source === "url") {
      await downloadMarketplaceFromUrl(source.url, installLocation, source.headers, progressCallback);
    } else if (source.source === "file" || source.source === "directory") {
      reportProgress(progressCallback, "Validating local marketplace");
      validateMarketplaceCache(installLocation);  // Just validate
    } else {
      throw Error("Unsupported marketplace source type for refresh");
    }

    // Update timestamp
    config[marketplaceName].lastUpdated = new Date().toISOString();
    await saveMarketplaceConfig(config);

    log(`Successfully refreshed marketplace: ${marketplaceName}`);
  } catch (error) {
    throw Error(`Failed to refresh marketplace '${marketplaceName}': ${error.message}`);
  }
}

// Mapping: IB1→updateMarketplace, RLA→gitPullOrClone, c22→downloadMarketplaceFromUrl,
//          tT→reportProgress, l22→validateMarketplaceCache
```

### Update All Marketplaces

```javascript
// ============================================
// refreshAllMarketplaces - Update all marketplaces
// Location: chunks.95.mjs:675-685
// ============================================

// ORIGINAL (for source lookup):
async function i22() {
  let A = await pZ();
  for (let [Q, B] of Object.entries(A)) try {
    await ve1(B.source);
    A[Q].lastUpdated = new Date().toISOString()
  } catch (G) {
    g(`Failed to refresh marketplace ${Q}: ${G.message}`, { level: "error" })
  }
  await TLA(A)
}

// READABLE (for understanding):
async function refreshAllMarketplaces() {
  const config = await loadMarketplaceConfig();

  for (const [name, entry] of Object.entries(config)) {
    try {
      await fetchAndCacheMarketplace(entry.source);
      config[name].lastUpdated = new Date().toISOString();
    } catch (error) {
      log(`Failed to refresh marketplace ${name}: ${error.message}`, { level: "error" });
      // Continue with other marketplaces
    }
  }

  await saveMarketplaceConfig(config);
}

// Mapping: i22→refreshAllMarketplaces
```

---

## Plugin Lookup

### Find Plugin by ID

```javascript
// ============================================
// findPluginInMarketplaces - Find plugin by ID
// Location: chunks.95.mjs:654-673
// ============================================

// ORIGINAL (for source lookup):
async function nl(A) {
  let Q = A.split("@");
  if (Q.length !== 2) throw Error(`Invalid plugin ID format '${A}'. Expected: 'plugin-name@marketplace-name'`);
  let B = Q[0], G = Q[1];
  try {
    let I = (await pZ())[G];
    if (!I) return null;
    let J = (await _D(G)).plugins.find((W) => W.name === B);
    if (!J) return null;
    return {
      entry: J,
      marketplaceInstallLocation: I.installLocation
    }
  } catch (Z) {
    g(`Could not find plugin ${A}: ${Z.message}`, { level: "debug" });
    return null
  }
}

// READABLE (for understanding):
async function findPluginInMarketplaces(pluginId) {
  // Parse plugin ID format: "plugin-name@marketplace-name"
  const parts = pluginId.split("@");
  if (parts.length !== 2) {
    throw Error(`Invalid plugin ID format '${pluginId}'. Expected: 'plugin-name@marketplace-name'`);
  }

  const [pluginName, marketplaceName] = parts;

  try {
    // Get marketplace config
    const marketplaceConfig = (await loadMarketplaceConfig())[marketplaceName];
    if (!marketplaceConfig) {
      return null;  // Marketplace not found
    }

    // Load marketplace data (memoized)
    const marketplaceData = await loadMarketplaceData(marketplaceName);

    // Find plugin in marketplace
    const pluginEntry = marketplaceData.plugins.find(p => p.name === pluginName);
    if (!pluginEntry) {
      return null;  // Plugin not found in marketplace
    }

    return {
      entry: pluginEntry,
      marketplaceInstallLocation: marketplaceConfig.installLocation
    };
  } catch (error) {
    log(`Could not find plugin ${pluginId}: ${error.message}`, { level: "debug" });
    return null;
  }
}

// Mapping: nl→findPluginInMarketplaces, pZ→loadMarketplaceConfig, _D→loadMarketplaceData
```

### Load Marketplace Data (Memoized)

```javascript
// ============================================
// loadMarketplaceData - Load marketplace manifest (memoized)
// Location: chunks.95.mjs:724-739
// ============================================

// ORIGINAL (for source lookup):
_D = s1(async (A) => {
  let Q = await pZ(), B = Q[A];
  if (!B) throw Error(`Marketplace '${A}' not found.`);
  try {
    return l22(B.installLocation)
  } catch (Z) {
    g(`Cache corrupted for marketplace ${A}, re-fetching: ${Z.message}`, { level: "warn" })
  }
  let { marketplace: G } = await ve1(B.source);
  Q[A].lastUpdated = new Date().toISOString();
  await TLA(Q);
  return G
})

// READABLE (for understanding):
loadMarketplaceData = memoize(async (marketplaceName) => {
  const config = await loadMarketplaceConfig();
  const entry = config[marketplaceName];

  if (!entry) {
    throw Error(`Marketplace '${marketplaceName}' not found.`);
  }

  try {
    // Try to load from cache first
    return validateMarketplaceCache(entry.installLocation);
  } catch (error) {
    log(`Cache corrupted for marketplace ${marketplaceName}, re-fetching: ${error.message}`, { level: "warn" });
  }

  // Cache miss or corrupted - re-fetch
  const { marketplace } = await fetchAndCacheMarketplace(entry.source);
  config[marketplaceName].lastUpdated = new Date().toISOString();
  await saveMarketplaceConfig(config);
  return marketplace;
});

// Mapping: _D→loadMarketplaceData, s1→memoize, l22→validateMarketplaceCache,
//          ve1→fetchAndCacheMarketplace
```

**Key insight:** The memoization prevents redundant file reads and network requests. The cache can be cleared with `_D.cache?.delete?.(marketplaceName)` when updates are needed.

---

## Marketplace Removal

```javascript
// ============================================
// removeMarketplace - Remove a marketplace
// Location: chunks.95.mjs:591-635
// ============================================

// ORIGINAL (for source lookup):
async function ZB1(A) {
  let Q = await pZ();
  if (!Q[A]) throw Error(`Marketplace '${A}' not found`);
  delete Q[A];
  await TLA(Q);

  let B = RA(), G = m22(), Z = RE(G, A);

  // Delete cached directory
  if (B.existsSync(Z)) B.rmSync(Z, { recursive: !0, force: !0 });

  // Delete cached JSON file
  let I = RE(G, `${A}.json`);
  if (B.existsSync(I)) B.rmSync(I, { force: !0 });

  // Clean up settings
  let Y = ["userSettings", "projectSettings", "localSettings"];
  for (let J of Y) {
    let W = OB(J);
    if (!W) continue;
    let X = !1, V = {};

    // Remove from extraKnownMarketplaces
    if (W.extraKnownMarketplaces?.[A]) {
      let F = { ...W.extraKnownMarketplaces };
      delete F[A];
      V.extraKnownMarketplaces = F;
      X = !0;
    }

    // Remove plugins from this marketplace in enabledPlugins
    if (W.enabledPlugins) {
      let F = `@${A}`, K = { ...W.enabledPlugins }, D = !1;
      for (let H in K)
        if (H.endsWith(F)) { delete K[H]; D = !0; }
      if (D) { V.enabledPlugins = K; X = !0; }
    }

    if (X) cB(J, V);  // Save updated settings
  }

  g(`Removed marketplace source: ${A}`)
}

// READABLE (for understanding):
async function removeMarketplace(marketplaceName) {
  const config = await loadMarketplaceConfig();

  if (!config[marketplaceName]) {
    throw Error(`Marketplace '${marketplaceName}' not found`);
  }

  // Remove from config
  delete config[marketplaceName];
  await saveMarketplaceConfig(config);

  const fs = getFs();
  const cacheDir = getMarketplacesCacheDir();

  // Delete cached directory
  const dirPath = path.join(cacheDir, marketplaceName);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }

  // Delete cached JSON file (if exists)
  const jsonPath = path.join(cacheDir, `${marketplaceName}.json`);
  if (fs.existsSync(jsonPath)) {
    fs.rmSync(jsonPath, { force: true });
  }

  // Clean up settings (user, project, local)
  const settingsTypes = ["userSettings", "projectSettings", "localSettings"];
  for (const settingsType of settingsTypes) {
    const settings = readSettingsFile(settingsType);
    if (!settings) continue;

    let needsUpdate = false;
    const updates = {};

    // Remove from extraKnownMarketplaces
    if (settings.extraKnownMarketplaces?.[marketplaceName]) {
      updates.extraKnownMarketplaces = { ...settings.extraKnownMarketplaces };
      delete updates.extraKnownMarketplaces[marketplaceName];
      needsUpdate = true;
    }

    // Remove plugins from this marketplace
    if (settings.enabledPlugins) {
      const suffix = `@${marketplaceName}`;
      updates.enabledPlugins = { ...settings.enabledPlugins };
      for (const key in updates.enabledPlugins) {
        if (key.endsWith(suffix)) {
          delete updates.enabledPlugins[key];
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      writeSettingsFile(settingsType, updates);
    }
  }

  log(`Removed marketplace source: ${marketplaceName}`);
}

// Mapping: ZB1→removeMarketplace, OB→readSettingsFile, cB→writeSettingsFile
```

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `pZ` | loadMarketplaceConfig | chunks.95.mjs:244 | Load .marketplaces.json |
| `TLA` | saveMarketplaceConfig | chunks.95.mjs | Save .marketplaces.json |
| `_D` | loadMarketplaceData | chunks.95.mjs:724 | Load marketplace (memoized) |
| `rAA` | addMarketplaceSource | chunks.95.mjs:572 | Add marketplace |
| `ZB1` | removeMarketplace | chunks.95.mjs:591 | Remove marketplace |
| `IB1` | updateMarketplace | chunks.95.mjs:687 | Update marketplace |
| `i22` | refreshAllMarketplaces | chunks.95.mjs:675 | Update all marketplaces |
| `nl` | findPluginInMarketplaces | chunks.95.mjs:654 | Find plugin by ID |
| `ve1` | fetchAndCacheMarketplace | chunks.95.mjs:463 | Fetch and cache |
| `l22` | validateMarketplaceCache | chunks.95.mjs:637 | Validate cached manifest |
| `u22` | getMarketplacesConfigPath | chunks.95.mjs:232 | Config file path |
| `m22` | getMarketplacesCacheDir | chunks.95.mjs:236 | Cache directory path |
| `RLA` | gitCloneRepository | chunks.95.mjs | Git clone helper |
| `c22` | downloadMarketplaceFromUrl | chunks.95.mjs | URL download helper |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [schemas.md](./schemas.md) - Marketplace schema definitions
- [installation.md](./installation.md) - Plugin installation from marketplace
