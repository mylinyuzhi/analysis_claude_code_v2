# Plugin Installation

> Deep dive into plugin installation from various sources (github, git, file, directory).
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Plugin System section

---

## Quick Navigation

- [Installation Sources](#installation-sources)
- [Installation Flow](#installation-flow)
- [Core Installation Function](#core-installation-function)
- [Plugin Caching](#plugin-caching)
- [Git Clone with Submodules](#git-clone-with-submodules)
- [Version Resolution](#version-resolution)
- [Registry Updates](#registry-updates)
- [Uninstallation](#uninstallation)

---

## Installation Sources

Plugins can be installed from multiple source types:

| Source Type | Format | Example |
|-------------|--------|---------|
| Relative path | `"./plugins/my-plugin"` | Local in marketplace directory |
| GitHub (default branch) | `{ source: "github-default-branch", repo: "owner/repo" }` | Auto branch detection |
| Git URL | `{ source: "git", url: "git@...", ref: "main" }` | Any git repository |
| File | `{ source: "file", path: "/path/to/marketplace.json" }` | Direct file path |
| Directory | `{ source: "directory", path: "/path/to/plugin/" }` | Directory with .claude-plugin |
| NPM | `{ source: "npm", package: "@org/plugin" }` | NPM registry (planned) |

---

## Installation Flow

```
User: /plugin install code-formatter@official
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Parse Install Command                                │
│                                                              │
│ • Extract plugin name and marketplace                        │
│ • Determine installation scope (user/project)               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Find Plugin in Marketplace                           │
│ findPluginInMarketplaces (NF) - chunks.91.mjs:264            │
│                                                              │
│ • Try cache first: HI0()                                     │
│ • Fallback: fetch marketplace data                           │
│ • Return plugin entry with source definition                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Install Plugin                                       │
│ installPlugin (ofA) - chunks.130.mjs:2267-2303               │
│                                                              │
│ • Get scope-specific settings                                │
│ • Resolve local paths for file sources                       │
│ • Cache plugin from source                                   │
│ • Update settings.enabledPlugins                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Cache and Version                                    │
│ cacheAndInstallPlugin (dO) - chunks.130.mjs                  │
│                                                              │
│ • Resolve plugin version                                     │
│ • Clone/copy to versioned cache                              │
│ • Register in installed_plugins.json                         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Finalize                                             │
│                                                              │
│ • Clear plugin caches                                        │
│ • Record telemetry                                           │
│ • Return success message                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Installation Function

```javascript
// ============================================
// installPlugin - Main entry point for plugin installation
// Location: chunks.130.mjs:2267-2303
// ============================================

// ORIGINAL (for source lookup):
async function ofA({
  pluginId: A,
  entry: Q,
  marketplaceName: B,
  scope: G = "user"
}) {
  try {
    let Z = Pb(G),              // Get scope-specific settings path
      Y = G !== "user" ? o1() : void 0,  // Project path if not user scope
      J, {
        source: X
      } = Q;
    if (Tb(X)) {                 // If source is a local path
      let W = await NF(A);       // Find plugin in marketplaces
      if (W) J = JL0(W.marketplaceInstallLocation, X)  // Resolve full path
    }
    await dO(A, Q, G, Y, J);     // Cache and install plugin
    let D = {
      ...dB(Z)?.enabledPlugins,  // Get existing enabled plugins
      [A]: !0                    // Enable this plugin
    };
    return pB(Z, {               // Save settings
      enabledPlugins: D
    }), l("tengu_plugin_installed", {  // Record telemetry
      plugin_id: A,
      marketplace_name: B
    }), NY(), {                  // Clear caches
      success: !0,
      message: `✓ Installed ${Q.name}. Restart Claude Code to load new plugins.`
    }
  } catch (Z) {
    let Y = Z instanceof Error ? Z.message : String(Z);
    return e(Z instanceof Error ? Z : Error(`Failed to install plugin: ${String(Z)}`)), {
      success: !1,
      error: `Failed to install: ${Y}`
    }
  }
}

// READABLE (for understanding):
async function installPlugin({
  pluginId,
  entry: pluginEntry,
  marketplaceName,
  scope = "user"
}) {
  try {
    // Get scope-specific settings file
    let settingsPath = getScopeSettingsPath(scope);
    let projectPath = scope !== "user" ? getCurrentProjectPath() : undefined;

    let resolvedSourcePath;
    let { source } = pluginEntry;

    // For local/relative sources, resolve the full path
    if (isLocalSource(source)) {
      let marketplaceInfo = await findPluginInMarketplaces(pluginId);
      if (marketplaceInfo) {
        resolvedSourcePath = resolvePath(
          marketplaceInfo.marketplaceInstallLocation,
          source
        );
      }
    }

    // Cache and install the plugin
    await cacheAndInstallPlugin(pluginId, pluginEntry, scope, projectPath, resolvedSourcePath);

    // Update settings to enable the plugin
    let enabledPlugins = {
      ...getSettings(settingsPath)?.enabledPlugins,
      [pluginId]: true
    };

    saveSettings(settingsPath, { enabledPlugins });

    // Record telemetry
    recordTelemetry("tengu_plugin_installed", {
      plugin_id: pluginId,
      marketplace_name: marketplaceName
    });

    // Clear caches to trigger reload
    clearAllPluginCaches();

    return {
      success: true,
      message: `✓ Installed ${pluginEntry.name}. Restart Claude Code to load new plugins.`
    };

  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : String(error);
    logError(error instanceof Error ? error : Error(`Failed to install plugin: ${String(error)}`));
    return {
      success: false,
      error: `Failed to install: ${errorMessage}`
    };
  }
}

// Mapping: ofA→installPlugin, Pb→getScopeSettingsPath, o1→getCurrentProjectPath,
//          Tb→isLocalSource, NF→findPluginInMarketplaces, JL0→resolvePath,
//          dO→cacheAndInstallPlugin, dB→getSettings, pB→saveSettings, NY→clearAllPluginCaches
```

---

## Plugin Caching

### Cache Directory Structure

```javascript
// ============================================
// getPluginCacheDir - Get plugin cache directory
// Location: chunks.130.mjs:2320-2322
// ============================================

// ORIGINAL (for source lookup):
function Tr() {
  return T8(zQ(), "plugins", "cache")
}

// READABLE (for understanding):
function getPluginCacheDir() {
  return path.join(getClaudeDataDirectory(), "plugins", "cache");
}

// Returns: ~/.claude/plugins/cache/

// Mapping: Tr→getPluginCacheDir, zQ→getClaudeDataDirectory, T8→path.join
```

### Versioned Path Calculation

```javascript
// ============================================
// getVersionedCachePath - Calculate versioned cache path
// Location: chunks.130.mjs:2324-2331
// ============================================

// ORIGINAL (for source lookup):
function xb(A, Q) {
  let B = Tr(),
    [G, Z] = A.split("@"),
    Y = (Z || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"),
    J = (G || A).replace(/[^a-zA-Z0-9\-_]/g, "-"),
    X = Q.replace(/[^a-zA-Z0-9\-_.]/g, "-");
  return T8(B, Y, J, X)
}

// READABLE (for understanding):
function getVersionedCachePath(pluginId, version) {
  const cacheDir = getPluginCacheDir();
  const [pluginName, marketplaceName] = pluginId.split("@");

  // Sanitize names for filesystem safety
  const sanitizedMarketplace = (marketplaceName || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-");
  const sanitizedPlugin = (pluginName || pluginId).replace(/[^a-zA-Z0-9\-_]/g, "-");
  const sanitizedVersion = version.replace(/[^a-zA-Z0-9\-_.]/g, "-");

  return path.join(cacheDir, sanitizedMarketplace, sanitizedPlugin, sanitizedVersion);
}

// Example: getVersionedCachePath("code-formatter@official", "1.2.0")
// Returns: ~/.claude/plugins/cache/official/code-formatter/1.2.0/

// Mapping: xb→getVersionedCachePath, Tr→getPluginCacheDir
```

### Copy to Versioned Cache

```javascript
// ============================================
// copyToVersionedCache - Copy plugin to versioned directory
// Location: chunks.130.mjs:2368-2400
// ============================================

// ORIGINAL (for source lookup):
async function wF1(A, Q, B, G, Z) {
  let Y = vA(),
    J = xb(Q, B);
  if (Y.existsSync(J) && !Y.isDirEmptySync(J))
    return k(`Plugin ${Q} version ${B} already cached at ${J}`), J;
  if (Y.existsSync(J) && Y.isDirEmptySync(J))
    k(`Removing empty cache directory for ${Q} at ${J}`), Y.rmdirSync(J);
  if (Y.mkdirSync(io2(J)), G && typeof G.source === "string" && Z) {
    let I = JL0(Z, G.source);
    if (Y.existsSync(I))
      k(`Copying source directory ${G.source} for plugin ${Q}`), rfA(I, J);
    else throw Error(`Plugin source directory not found: ${I} (from entry.source: ${G.source})`)
  } else
    k(`Copying plugin ${Q} to versioned cache (fallback to full copy)`), rfA(A, J);
  let X = T8(J, ".git");
  if (Y.existsSync(X)) Y.rmSync(X, {
    recursive: !0,
    force: !0
  });
  k(`Successfully cached plugin ${Q} at ${J}`);
  return J
}

// READABLE (for understanding):
async function copyToVersionedCache(sourcePath, pluginId, version, pluginEntry, marketplacePath) {
  const fs = getFileSystem();
  const versionedPath = getVersionedCachePath(pluginId, version);

  // Skip if already cached (and not empty)
  if (fs.existsSync(versionedPath) && !fs.isDirEmptySync(versionedPath)) {
    log(`Plugin ${pluginId} version ${version} already cached at ${versionedPath}`);
    return versionedPath;
  }

  // Remove empty cache directory
  if (fs.existsSync(versionedPath) && fs.isDirEmptySync(versionedPath)) {
    log(`Removing empty cache directory for ${pluginId} at ${versionedPath}`);
    fs.rmdirSync(versionedPath);
  }

  // Create parent directories
  fs.mkdirSync(path.dirname(versionedPath));

  // Copy plugin files
  if (pluginEntry && typeof pluginEntry.source === "string" && marketplacePath) {
    // For relative sources, copy from marketplace location
    let sourceDir = resolvePath(marketplacePath, pluginEntry.source);
    if (fs.existsSync(sourceDir)) {
      log(`Copying source directory ${pluginEntry.source} for plugin ${pluginId}`);
      copyDirectoryRecursive(sourceDir, versionedPath);
    } else {
      throw Error(`Plugin source directory not found: ${sourceDir}`);
    }
  } else {
    // Fallback: copy entire source path
    log(`Copying plugin ${pluginId} to versioned cache (fallback to full copy)`);
    copyDirectoryRecursive(sourcePath, versionedPath);
  }

  // Remove .git directory from cache
  const gitDir = path.join(versionedPath, ".git");
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }

  log(`Successfully cached plugin ${pluginId} at ${versionedPath}`);
  return versionedPath;
}

// Mapping: wF1→copyToVersionedCache, xb→getVersionedCachePath, vA→getFileSystem,
//          JL0→resolvePath, rfA→copyDirectoryRecursive, io2→path.dirname
```

### Recursive Directory Copy

```javascript
// ============================================
// copyDirectoryRecursive - Copy directory with symlink handling
// Location: chunks.130.mjs:2333-2366
// ============================================

// ORIGINAL (for source lookup):
function rfA(A, Q) {
  let B = vA();
  if (!B.existsSync(Q)) B.mkdirSync(Q);
  let G = B.readdirSync(A);
  for (let Z of G) {
    let Y = T8(A, Z.name),
      J = T8(Q, Z.name);
    if (Z.isDirectory()) rfA(Y, J);
    else if (Z.isFile()) B.copyFileSync(Y, J);
    else if (Z.isSymbolicLink()) {
      let X = B.readlinkSync(Y),
        I;
      try { I = B.realpathSync(Y) } catch { B.symlinkSync(X, J); continue }
      let D;
      try { D = B.realpathSync(A) } catch { D = A }
      let W = D.endsWith(co2) ? D : D + co2;
      if (I.startsWith(W) || I === D) {
        let K = do2(D, I),
          V = T8(Q, K),
          F = do2(io2(J), V);
        B.symlinkSync(F, J)
      } else B.symlinkSync(I, J)
    }
  }
}

// READABLE (for understanding):
function copyDirectoryRecursive(sourcePath, targetPath) {
  const fs = getFileSystem();

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }

  const entries = fs.readdirSync(sourcePath);

  for (const entry of entries) {
    const srcPath = path.join(sourcePath, entry.name);
    const dstPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy directories
      copyDirectoryRecursive(srcPath, dstPath);
    } else if (entry.isFile()) {
      // Copy files directly
      fs.copyFileSync(srcPath, dstPath);
    } else if (entry.isSymbolicLink()) {
      // Handle symlinks with special logic
      const linkTarget = fs.readlinkSync(srcPath);
      let realPath;
      try {
        realPath = fs.realpathSync(srcPath);
      } catch {
        // Broken symlink - preserve as-is
        fs.symlinkSync(linkTarget, dstPath);
        continue;
      }

      let realSourceDir;
      try { realSourceDir = fs.realpathSync(sourcePath); }
      catch { realSourceDir = sourcePath; }

      const sourceWithSep = realSourceDir.endsWith(PATH_SEP)
        ? realSourceDir
        : realSourceDir + PATH_SEP;

      // If symlink points within source directory, make it relative
      if (realPath.startsWith(sourceWithSep) || realPath === realSourceDir) {
        const relativePath = path.relative(realSourceDir, realPath);
        const targetLink = path.join(targetPath, relativePath);
        const relativeLink = path.relative(path.dirname(dstPath), targetLink);
        fs.symlinkSync(relativeLink, dstPath);
      } else {
        // External symlink - use absolute path
        fs.symlinkSync(realPath, dstPath);
      }
    }
  }
}

// Mapping: rfA→copyDirectoryRecursive, co2→PATH_SEP, do2→path.relative, io2→path.dirname
```

---

## Git Clone with Submodules

**v2.1.7 Improvement:** Added `--recurse-submodules` and `--shallow-submodules` for plugins with git submodule dependencies.

```javascript
// ============================================
// gitCloneWithSubmodules - Clone plugin repository with submodules
// Location: chunks.90.mjs:2382-2389
// ============================================

// ORIGINAL (for source lookup):
async function G32(A, Q, B) {
  let G = [
    "-c", "credential.helper=",
    "-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new",
    "clone",
    "--depth", "1",
    "--recurse-submodules",
    "--shallow-submodules"
  ];
  if (B) G.push("--branch", B);
  return G.push(A, Q), await TQ("git", G, {
    timeout: 30000,
    stdin: "ignore",
    env: getGitEnv()
  })
}

// READABLE (for understanding):
async function gitCloneWithSubmodules(repoUrl, targetPath, branch) {
  const args = [
    "-c", "credential.helper=",           // Disable credential helper for batch
    "-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new",
    "clone",
    "--depth", "1",                        // Shallow clone
    "--recurse-submodules",                // Initialize submodules (v2.1.7)
    "--shallow-submodules"                 // Shallow submodule clone (v2.1.7)
  ];

  if (branch) args.push("--branch", branch);
  args.push(repoUrl, targetPath);

  return await executeCommand("git", args, {
    timeout: 30000,
    stdin: "ignore",
    env: getGitEnv()
  });
}

// Mapping: G32→gitCloneWithSubmodules, TQ→executeCommand
```

**Key insight (v2.1.7 fix):**
- `--recurse-submodules` ensures plugin submodules are initialized
- `--shallow-submodules` keeps clone fast while including submodule content
- This fixes plugins that use git submodules for dependencies

### Git Clone with Retry

```javascript
// ============================================
// gitCloneWithRetry - Clone with SSH fallback to HTTPS
// Location: chunks.90.mjs:2392-2424
// ============================================

// ORIGINAL (for source lookup):
async function r75(A, Q, B, G, Z = !1) {
  try {
    return await G32(A, Q, B)
  } catch (Y) {
    if (!Z && B32(Y)) {
      let J = A.replace("git@github.com:", "https://github.com/").replace(".git", "");
      k(`SSH clone failed, retrying with HTTPS for ${J}`);
      try {
        let X = await $y1(J);  // Fetch default branch
        return await G32(J, Q, X || G || void 0)
      } catch (X) {
        throw Y  // Throw original SSH error
      }
    }
    throw Y
  }
}

// READABLE (for understanding):
async function gitCloneWithRetry(sshUrl, targetPath, branch, defaultBranch, alreadyRetried = false) {
  try {
    return await gitCloneWithSubmodules(sshUrl, targetPath, branch);
  } catch (error) {
    // If SSH auth failed and we haven't retried yet
    if (!alreadyRetried && isGitAuthError(error)) {
      // Convert SSH URL to HTTPS
      const httpsUrl = sshUrl
        .replace("git@github.com:", "https://github.com/")
        .replace(".git", "");

      log(`SSH clone failed, retrying with HTTPS for ${httpsUrl}`);

      try {
        const remoteBranch = await fetchDefaultBranch(httpsUrl);
        return await gitCloneWithSubmodules(
          httpsUrl,
          targetPath,
          remoteBranch || defaultBranch || undefined
        );
      } catch (retryError) {
        throw error;  // Throw original SSH error for clarity
      }
    }
    throw error;
  }
}

// Mapping: r75→gitCloneWithRetry, G32→gitCloneWithSubmodules, B32→isGitAuthError, $y1→fetchDefaultBranch
```

---

## Version Resolution

```javascript
// ============================================
// resolvePluginVersion - Determine plugin version
// Location: chunks.130.mjs (part of Od function)
// ============================================

// READABLE (for understanding):
async function resolvePluginVersion(pluginId, source, manifest, installPath, marketplaceVersion) {
  // Priority 1: Manifest version
  if (manifest?.version) {
    log(`Using manifest version for ${pluginId}: ${manifest.version}`);
    return manifest.version;
  }

  // Priority 2: Marketplace entry version
  if (marketplaceVersion) {
    log(`Using marketplace version for ${pluginId}: ${marketplaceVersion}`);
    return marketplaceVersion;
  }

  // Priority 3: Git commit SHA
  if (installPath) {
    const gitSha = await getGitCommitSha(installPath);
    if (gitSha) {
      const shortSha = gitSha.substring(0, 12);
      log(`Using git SHA for ${pluginId}: ${shortSha}`);
      return shortSha;
    }
  }

  // Priority 4: Timestamp-based for local sources
  if (typeof source === "string") {
    const version = `local-${Date.now()}`;
    log(`Using local fallback version for ${pluginId}: ${version}`);
    return version;
  }

  return "unknown";
}

// Version resolution order:
// 1. manifest.version (e.g., "1.2.0")
// 2. marketplace entry version
// 3. Git commit SHA (short, 12 chars)
// 4. Timestamp-based for local plugins
// 5. "unknown" as fallback
```

---

## Registry Updates

### Installed Plugins Registry Format

```json
{
  "version": 2,
  "plugins": {
    "code-formatter@official": [
      {
        "scope": "user",
        "installPath": "~/.claude/plugins/cache/official/code-formatter/1.2.0",
        "version": "1.2.0",
        "installedAt": "2024-01-15T10:30:00Z",
        "lastUpdated": "2024-02-01T14:22:00Z",
        "gitCommitSha": "abc123def456789..."
      }
    ]
  }
}
```

### Add/Update Plugin in Registry

```javascript
// ============================================
// addPluginToRegistry - Register installed plugin
// Location: chunks.91.mjs:680-725
// ============================================

// READABLE (for understanding):
function addPluginToRegistry(pluginId, installEntry, scope = "user") {
  const registry = loadInstalledPluginsRegistry();

  // Initialize plugin entry array if needed
  if (!registry.plugins[pluginId]) {
    registry.plugins[pluginId] = [];
  }

  // Find existing entry for this scope
  const existingIndex = registry.plugins[pluginId].findIndex(
    e => e.scope === scope
  );

  if (existingIndex >= 0) {
    // Update existing entry
    registry.plugins[pluginId][existingIndex] = {
      ...installEntry,
      scope,
      lastUpdated: new Date().toISOString()
    };
    log(`Updated installed plugin: ${pluginId} (scope: ${scope})`);
  } else {
    // Add new entry
    registry.plugins[pluginId].push({
      ...installEntry,
      scope,
      installedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
    log(`Added installed plugin: ${pluginId} (scope: ${scope})`);
  }

  saveInstalledPluginsRegistry(registry);
}

// Install entry format:
// {
//   version: "1.2.0",
//   installPath: "/path/to/cache/...",
//   gitCommitSha: "abc123...",  // If from git source
//   projectPath: "/path/to/project"  // If project scope
// }
```

---

## Uninstallation

### Remove Plugin from Registry

```javascript
// ============================================
// removePluginFromRegistry - Unregister plugin
// Location: chunks.91.mjs:597-650
// ============================================

// READABLE (for understanding):
function removePluginFromRegistry(pluginId, scope = "user") {
  const registry = loadInstalledPluginsRegistry();

  if (!registry.plugins[pluginId]) {
    log(`Plugin ${pluginId} not found in registry`);
    return null;
  }

  // Find entry for this scope
  const entryIndex = registry.plugins[pluginId].findIndex(
    e => e.scope === scope
  );

  if (entryIndex < 0) {
    log(`Plugin ${pluginId} not found for scope ${scope}`);
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
```

### Delete Plugin Cache

```javascript
// ============================================
// deletePluginCache - Delete plugin files from cache
// Location: chunks.91.mjs
// ============================================

// READABLE (for understanding):
function deletePluginCache(installPath) {
  const fs = getFileSystem();

  try {
    if (fs.existsSync(installPath)) {
      fs.rmSync(installPath, { recursive: true, force: true });
      log(`Deleted plugin cache at ${installPath}`);

      // Clean up empty parent directories
      const cacheRoot = getPluginCacheDir();
      if (installPath.includes("/cache/") && installPath.startsWith(cacheRoot)) {
        let parentDir = path.dirname(installPath);

        // Walk up and remove empty directories
        while (parentDir !== cacheRoot && parentDir.startsWith(cacheRoot)) {
          if (fs.existsSync(parentDir) && fs.readdirSync(parentDir).length === 0) {
            fs.rmdirSync(parentDir);
            log(`Deleted empty directory at ${parentDir}`);
            parentDir = path.dirname(parentDir);
          } else {
            break;
          }
        }
      }
    } else {
      log(`Plugin cache at ${installPath} doesn't exist, skipping deletion`);
    }
  } catch (error) {
    throw Error(`Failed to delete plugin cache at ${installPath}: ${error.message}`);
  }
}
```

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `ofA` | installPlugin | chunks.130.mjs:2267 | Main install entry point |
| `dO` | cacheAndInstallPlugin | chunks.130.mjs | Cache plugin from source |
| `wF1` | copyToVersionedCache | chunks.130.mjs:2368 | Copy to versioned path |
| `Tr` | getPluginCacheDir | chunks.130.mjs:2320 | Cache directory path |
| `xb` | getVersionedCachePath | chunks.130.mjs:2324 | Versioned path calculation |
| `rfA` | copyDirectoryRecursive | chunks.130.mjs:2333 | Recursive directory copy |
| `G32` | gitCloneWithSubmodules | chunks.90.mjs:2382 | Git clone with submodules |
| `r75` | gitCloneWithRetry | chunks.90.mjs:2392 | Clone with SSH/HTTPS fallback |
| `B32` | isGitAuthError | chunks.90.mjs:2378 | Check for auth errors |
| `NF` | findPluginInMarketplaces | chunks.91.mjs:264 | Find plugin entry |
| `NI0` | addPluginToRegistry | chunks.91.mjs:680 | Register installation |
| `F32` | removePluginFromRegistry | chunks.91.mjs:597 | Unregister plugin |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [loading.md](./loading.md) - Component loading
- [marketplace.md](./marketplace.md) - Marketplace management
- [schemas.md](./schemas.md) - Plugin manifest schema
- [state_management.md](./state_management.md) - Enable/disable state
- [plugin_updates.md](./plugin_updates.md) - v2.1.7 specific changes
