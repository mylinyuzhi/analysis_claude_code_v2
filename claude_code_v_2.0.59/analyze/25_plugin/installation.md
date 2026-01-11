# Plugin Installation

> Deep dive into plugin installation from various sources (npm, github, git, url, local).
>
> **Related Symbols:** See [symbol_index_infra.md](../00_overview/symbol_index_infra.md) - Plugin System section

---

## Quick Navigation

- [Installation Sources](#installation-sources)
- [Installation Flow](#installation-flow)
- [Source-Specific Handlers](#source-specific-handlers)
- [Version Resolution](#version-resolution)
- [Plugin Caching](#plugin-caching)
- [Manifest Validation](#manifest-validation)
- [Registry Updates](#registry-updates)
- [Uninstallation](#uninstallation)

---

## Installation Sources

Plugins can be installed from multiple sources defined by `pluginSourceSchema` (B85):

| Source | Format | Example |
|--------|--------|---------|
| Relative path | `"./plugins/my-plugin"` | Local in marketplace |
| NPM | `{ source: "npm", package: "@org/plugin" }` | NPM registry |
| GitHub | `{ source: "github", repo: "owner/repo" }` | GitHub repository |
| Git URL | `{ source: "url", url: "git@..." }` | Any git repository |
| PIP | `{ source: "pip", package: "plugin" }` | Python (not implemented) |

---

## Installation Flow

```
User: /plugin install code-formatter@claude-plugins-official
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Find Plugin in Marketplace                         │
│ findPluginInMarketplaces (nl) - chunks.95.mjs:654           │
│                                                             │
│ • Parse "plugin@marketplace" format                         │
│ • Load marketplace config                                   │
│ • Find plugin entry with source definition                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Cache Plugin from Source                            │
│ cachePluginFromSource (SIA) - chunks.95.mjs:959-1054        │
│                                                             │
│ • Create temporary directory                                │
│ • Fetch from source (npm/github/git/local)                  │
│ • Validate plugin.json manifest                             │
│ • Rename to final cache path                                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Copy to Versioned Cache                             │
│ copyToVersionedCache (s22) - chunks.95.mjs:819-873          │
│                                                             │
│ • Calculate version-specific path                           │
│ • Copy plugin files                                         │
│ • Remove .git directory                                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Register Installation                               │
│ addInstalledPlugin (M39) - chunks.143.mjs:3685              │
│                                                             │
│ • Update in-memory registry                                 │
│ • Save to installed_plugins.json                            │
│ • Include version, timestamp, path, git SHA                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Source-Specific Handlers

### Main Caching Function

```javascript
// ============================================
// cachePluginFromSource - Download and cache plugin
// Location: chunks.95.mjs:959-1054
// ============================================

// ORIGINAL (for source lookup):
async function SIA(A, Q) {
  let B = RA(), G = al();
  B.mkdirSync(G);
  let Z = b85(A),           // Generate temp dir name
      I = A8(G, Z),         // Full temp path
      Y = !1;

  try {
    g(`Caching plugin from source: ${JSON.stringify(A)} to temporary path ${I}`);
    Y = !0;

    if (typeof A === "string") await v85(A, I);  // Local directory
    else switch (A.source) {
      case "npm":
        await k85(A.package, I);
        break;
      case "github":
        await x85(A.repo, I, A.ref);
        break;
      case "url":
        await t22(A.url, I, A.ref);
        break;
      case "pip":
        throw Error("Python package plugins are not yet supported");
      default:
        throw Error("Unsupported plugin source type");
    }
  } catch (K) {
    // Cleanup on failure
    if (Y && B.existsSync(I)) {
      g(`Cleaning up failed installation at ${I}`);
      B.rmSync(I, { recursive: !0, force: !0 });
    }
    throw K;
  }

  // Find and validate plugin.json
  let J = A8(I, ".claude-plugin", "plugin.json"),
      W = A8(I, "plugin.json"),
      X;

  if (B.existsSync(J)) {
    // Primary location: .claude-plugin/plugin.json
    let K = B.readFileSync(J, { encoding: "utf-8" }),
        D = JSON.parse(K),
        H = nAA.safeParse(D);
    if (H.success) X = H.data;
    else throw Error(`Invalid manifest at ${J}: ${H.error.errors...}`);
  } else if (B.existsSync(W)) {
    // Legacy location: plugin.json (root)
    let K = B.readFileSync(W, { encoding: "utf-8" }),
        D = JSON.parse(K),
        H = nAA.safeParse(D);
    if (H.success) X = H.data;
    else throw Error(`Invalid manifest at ${W}: ${H.error.errors...}`);
  } else {
    // No manifest - use marketplace entry or fallback
    X = Q?.manifest || { name: Z, description: `Plugin cached from ${typeof A==="string"?A:A.source}` };
  }

  // Rename temp dir to plugin name
  let V = X.name.replace(/[^a-zA-Z0-9-_]/g, "-"),
      F = A8(G, V);
  if (B.existsSync(F)) B.rmSync(F, { recursive: !0, force: !0 });
  B.renameSync(I, F);

  g(`Successfully cached plugin ${X.name} to ${F}`);
  return { path: F, manifest: X };
}

// READABLE (for understanding):
async function cachePluginFromSource(source, options) {
  const fs = getFs();
  const cacheDir = getPluginCacheDir();
  fs.mkdirSync(cacheDir);

  const tempDirName = generateTempDirName(source);  // e.g., "temp_github_1705312800_abc123"
  const tempPath = path.join(cacheDir, tempDirName);
  let needsCleanup = false;

  try {
    log(`Caching plugin from source: ${JSON.stringify(source)} to ${tempPath}`);
    needsCleanup = true;

    // Fetch based on source type
    if (typeof source === "string") {
      await copyLocalDirectory(source, tempPath);
    } else {
      switch (source.source) {
        case "npm":
          await installNpmPackage(source.package, tempPath);
          break;
        case "github":
          await cloneGitHubRepo(source.repo, tempPath, source.ref);
          break;
        case "url":
          await cloneGitUrl(source.url, tempPath, source.ref);
          break;
        case "pip":
          throw Error("Python package plugins are not yet supported");
        default:
          throw Error("Unsupported plugin source type");
      }
    }
  } catch (error) {
    // Cleanup temp directory on failure
    if (needsCleanup && fs.existsSync(tempPath)) {
      log(`Cleaning up failed installation at ${tempPath}`);
      fs.rmSync(tempPath, { recursive: true, force: true });
    }
    throw error;
  }

  // Find and validate plugin manifest
  const primaryManifestPath = path.join(tempPath, ".claude-plugin", "plugin.json");
  const legacyManifestPath = path.join(tempPath, "plugin.json");
  let manifest;

  if (fs.existsSync(primaryManifestPath)) {
    manifest = parseAndValidateManifest(primaryManifestPath);
  } else if (fs.existsSync(legacyManifestPath)) {
    manifest = parseAndValidateManifest(legacyManifestPath);
  } else {
    // No manifest found - use marketplace entry or generate fallback
    manifest = options?.manifest || {
      name: tempDirName,
      description: `Plugin cached from ${typeof source === "string" ? source : source.source}`
    };
  }

  // Rename temp directory to plugin name
  const sanitizedName = manifest.name.replace(/[^a-zA-Z0-9-_]/g, "-");
  const finalPath = path.join(cacheDir, sanitizedName);

  if (fs.existsSync(finalPath)) {
    fs.rmSync(finalPath, { recursive: true, force: true });
  }
  fs.renameSync(tempPath, finalPath);

  log(`Successfully cached plugin ${manifest.name} to ${finalPath}`);
  return { path: finalPath, manifest };
}

// Mapping: SIA→cachePluginFromSource, al→getPluginCacheDir, b85→generateTempDirName,
//          v85→copyLocalDirectory, k85→installNpmPackage, x85→cloneGitHubRepo,
//          t22→cloneGitUrl, nAA→pluginManifestSchema
```

### NPM Package Installation

```javascript
// ============================================
// installNpmPackage - Install npm package to cache
// Location: chunks.95.mjs:888-901
// ============================================

// ORIGINAL (for source lookup):
async function k85(A, Q) {
  let B = RA(),
      G = A8(MQ(), "plugins", "npm-cache");
  B.mkdirSync(G);
  let Z = A8(G, "node_modules", A);
  if (!B.existsSync(Z)) {
    g(`Installing npm package ${A} to cache`);
    let Y = await QQ("npm", ["install", A, "--prefix", G], { useCwd: !1 });
    if (Y.code !== 0) throw Error(`Failed to install npm package: ${Y.stderr}`);
  }
  oAA(Z, Q);
  g(`Copied npm package ${A} from cache to ${Q}`);
}

// READABLE (for understanding):
async function installNpmPackage(packageName, targetPath) {
  const fs = getFs();
  const npmCacheDir = path.join(getClaudeDataDirectory(), "plugins", "npm-cache");
  fs.mkdirSync(npmCacheDir);

  const packagePath = path.join(npmCacheDir, "node_modules", packageName);

  // Install if not already cached
  if (!fs.existsSync(packagePath)) {
    log(`Installing npm package ${packageName} to cache`);
    const result = await spawnCommand("npm", ["install", packageName, "--prefix", npmCacheDir], { useCwd: false });
    if (result.code !== 0) {
      throw Error(`Failed to install npm package: ${result.stderr}`);
    }
  }

  // Copy from cache to target
  copyDirectoryRecursive(packagePath, targetPath);
  log(`Copied npm package ${packageName} from cache to ${targetPath}`);
}

// Mapping: k85→installNpmPackage, oAA→copyDirectoryRecursive, QQ→spawnCommand
```

### GitHub Repository Clone

```javascript
// ============================================
// cloneGitHubRepo - Clone GitHub repository
// Location: chunks.95.mjs:918-922
// ============================================

// ORIGINAL (for source lookup):
async function x85(A, Q, B) {
  if (!/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(A))
    throw Error(`Invalid GitHub repository format: ${A}. Expected format: owner/repo`);
  let G = `git@github.com:${A}.git`;
  return t22(G, Q, B);
}

// READABLE (for understanding):
async function cloneGitHubRepo(repoPath, targetPath, ref) {
  // Validate format: owner/repo
  if (!/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/.test(repoPath)) {
    throw Error(`Invalid GitHub repository format: ${repoPath}. Expected: owner/repo`);
  }

  const gitUrl = `git@github.com:${repoPath}.git`;
  return cloneGitUrl(gitUrl, targetPath, ref);
}

// Mapping: x85→cloneGitHubRepo, t22→cloneGitUrl
```

### Git URL Clone

```javascript
// ============================================
// cloneGitUrl - Clone from git URL
// Location: chunks.95.mjs:911-916
// ============================================

// ORIGINAL (for source lookup):
async function t22(A, Q, B) {
  let G = _85(A);  // Validate URL
  await y85(G, Q, B);  // Shallow clone
  let Z = B ? ` (ref: ${B})` : "";
  g(`Cloned repository from ${G}${Z} to ${Q}`);
}

async function y85(A, Q, B) {
  let G = ["clone", "--depth", "1"];
  if (B) G.push("--branch", B);
  G.push(A, Q);
  let Z = await QQ("git", G);
  if (Z.code !== 0) throw Error(`Failed to clone repository: ${Z.stderr}`);
}

// READABLE (for understanding):
async function cloneGitUrl(url, targetPath, ref) {
  const validatedUrl = validateGitUrl(url);
  await shallowClone(validatedUrl, targetPath, ref);
  const refInfo = ref ? ` (ref: ${ref})` : "";
  log(`Cloned repository from ${validatedUrl}${refInfo} to ${targetPath}`);
}

async function shallowClone(url, targetPath, ref) {
  const args = ["clone", "--depth", "1"];
  if (ref) args.push("--branch", ref);
  args.push(url, targetPath);

  const result = await spawnCommand("git", args);
  if (result.code !== 0) {
    throw Error(`Failed to clone repository: ${result.stderr}`);
  }
}

// Mapping: t22→cloneGitUrl, y85→shallowClone, _85→validateGitUrl
```

### Local Directory Copy

```javascript
// ============================================
// copyLocalDirectory - Copy local plugin directory
// Location: chunks.95.mjs:924-933
// ============================================

// ORIGINAL (for source lookup):
async function v85(A, Q) {
  let B = RA();
  if (!B.existsSync(A)) throw Error(`Source path does not exist: ${A}`);
  oAA(A, Q);
  let G = A8(Q, ".git");
  if (B.existsSync(G)) B.rmSync(G, { recursive: !0, force: !0 });
}

// READABLE (for understanding):
async function copyLocalDirectory(sourcePath, targetPath) {
  const fs = getFs();

  if (!fs.existsSync(sourcePath)) {
    throw Error(`Source path does not exist: ${sourcePath}`);
  }

  copyDirectoryRecursive(sourcePath, targetPath);

  // Remove .git directory from copy
  const gitDir = path.join(targetPath, ".git");
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }
}

// Mapping: v85→copyLocalDirectory, oAA→copyDirectoryRecursive
```

---

## Version Resolution

```javascript
// ============================================
// resolvePluginVersion - Determine plugin version
// Location: chunks.95.mjs:742-762
// ============================================

// ORIGINAL (for source lookup):
async function YB1(A, Q, B, G) {
  // Priority 1: Manifest version
  if (B?.version) {
    g(`Using manifest version for ${A}: ${B.version}`);
    return B.version;
  }

  // Priority 2: Git commit SHA
  if (G) {
    let Z = await T85(G);  // Get git rev-parse HEAD
    if (Z) {
      let I = Z.substring(0, 12);  // Short SHA
      g(`Using git SHA for ${A}: ${I}`);
      return I;
    }
  }

  // Priority 3: Local fallback
  if (typeof Q === "string") {
    let Z = `local-${Date.now()}`;
    g(`Using local fallback version for ${A}: ${Z}`);
    return Z;
  }

  // Priority 4: NPM version lookup
  if (Q.source === "npm") {
    let Z = await P85(Q.package);  // npm view <package> version
    if (Z) {
      g(`Using npm version for ${A}: ${Z}`);
      return Z;
    }
    return "unknown";
  }

  // Fallback for github/url sources
  if (Q.source === "github" || Q.source === "url") {
    return "pending";  // Will be updated after clone
  }

  return "unknown";
}

// READABLE (for understanding):
async function resolvePluginVersion(pluginName, source, manifest, installPath) {
  // Priority 1: Use version from manifest if available
  if (manifest?.version) {
    log(`Using manifest version for ${pluginName}: ${manifest.version}`);
    return manifest.version;
  }

  // Priority 2: For git-based sources, use commit SHA
  if (installPath) {
    const gitSha = await getGitCommitSha(installPath);
    if (gitSha) {
      const shortSha = gitSha.substring(0, 12);
      log(`Using git SHA for ${pluginName}: ${shortSha}`);
      return shortSha;
    }
  }

  // Priority 3: For local paths, generate timestamp-based version
  if (typeof source === "string") {
    const version = `local-${Date.now()}`;
    log(`Using local fallback version for ${pluginName}: ${version}`);
    return version;
  }

  // Priority 4: For npm sources, query npm registry
  if (source.source === "npm") {
    const npmVersion = await getNpmPackageVersion(source.package);
    if (npmVersion) {
      log(`Using npm version for ${pluginName}: ${npmVersion}`);
      return npmVersion;
    }
    return "unknown";
  }

  // Pending for github/url sources (updated after clone)
  if (source.source === "github" || source.source === "url") {
    return "pending";
  }

  return "unknown";
}

// Mapping: YB1→resolvePluginVersion, T85→getGitCommitSha, P85→getNpmPackageVersion
```

---

## Plugin Caching

### Cache Directory Structure

```javascript
// ============================================
// getPluginCacheDir - Get plugin cache directory
// Location: chunks.95.mjs:791-793
// ============================================

// ORIGINAL (for source lookup):
function al() { return A8(MQ(), "plugins", "cache") }

// READABLE (for understanding):
function getPluginCacheDir() {
  return path.join(getClaudeDataDirectory(), "plugins", "cache");
}
// Returns: ~/.claude/plugins/cache/

// Mapping: al→getPluginCacheDir
```

### Versioned Path Calculation

```javascript
// ============================================
// getPluginVersionPath - Calculate versioned cache path
// Location: chunks.95.mjs:795-801
// ============================================

// ORIGINAL (for source lookup):
function JB1(A, Q) {
  let B = al(),
      [G, Z] = A.split("@"),
      I = (Z || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-"),
      Y = (G || A).replace(/[^a-zA-Z0-9\-_]/g, "-");
  return A8(B, I, Y, Q);
}

// READABLE (for understanding):
function getPluginVersionPath(pluginId, version) {
  const cacheDir = getPluginCacheDir();
  const [pluginName, marketplaceName] = pluginId.split("@");

  // Sanitize names for filesystem
  const sanitizedMarketplace = (marketplaceName || "unknown").replace(/[^a-zA-Z0-9\-_]/g, "-");
  const sanitizedPlugin = (pluginName || pluginId).replace(/[^a-zA-Z0-9\-_]/g, "-");

  return path.join(cacheDir, sanitizedMarketplace, sanitizedPlugin, version);
}

// Example: getPluginVersionPath("code-formatter@official", "1.2.0")
// Returns: ~/.claude/plugins/cache/official/code-formatter/1.2.0/

// Mapping: JB1→getPluginVersionPath
```

### Copy to Versioned Cache

```javascript
// ============================================
// copyToVersionedCache - Copy plugin to versioned directory
// Location: chunks.95.mjs:819-873
// ============================================

// ORIGINAL (for source lookup):
async function s22(A, Q, B, G) {
  let Z = RA(), I = JB1(Q, B);

  // Skip if already cached
  if (Z.existsSync(I)) {
    g(`Plugin ${Q} version ${B} already cached at ${I}`);
    return I;
  }

  Z.mkdirSync(a22(I));  // Create parent directories

  let Y = A8(A, "plugin.json"),
      J = A8(A, ".claude-plugin", "plugin.json");

  if (Z.existsSync(Y) || Z.existsSync(J)) {
    // Self-contained plugin - copy everything
    g(`Copying self-contained plugin ${Q} to versioned cache`);
    oAA(A, I);
  } else if (G) {
    // Non-self-contained - copy only specified components
    g(`Copying non-self-contained plugin ${Q} to versioned cache`);
    Z.mkdirSync(I);

    let copyComponent = (path) => {
      let src = A8(A, path), dst = A8(I, path);
      if (!Z.existsSync(src)) {
        g(`Component path ${path} not found`, { level: "warn" });
        return;
      }
      if (Z.statSync(src).isDirectory()) oAA(src, dst);
      else { Z.mkdirSync(a22(dst)); Z.copyFileSync(src, dst); }
    };

    // Copy commands
    if (G.commands) {
      if (typeof G.commands === "object" && !Array.isArray(G.commands)) {
        for (let cmd of Object.values(G.commands)) if (cmd?.source) copyComponent(cmd.source);
      } else {
        let cmds = Array.isArray(G.commands) ? G.commands : [G.commands];
        for (let c of cmds) if (typeof c === "string") copyComponent(c);
      }
    }

    // Copy agents, skills, outputStyles
    for (let key of ["agents", "skills", "outputStyles"]) {
      if (G[key]) {
        let items = Array.isArray(G[key]) ? G[key] : [G[key]];
        for (let item of items) copyComponent(item);
      }
    }

    // Copy standard directories if they exist
    for (let dir of ["commands", "agents", "skills", "hooks", "output-styles"]) {
      let src = A8(A, dir);
      if (Z.existsSync(src)) oAA(src, A8(I, dir));
    }
  } else {
    // Fallback - copy everything
    g(`Copying plugin ${Q} to versioned cache (fallback)`);
    oAA(A, I);
  }

  // Remove .git directory
  let X = A8(I, ".git");
  if (Z.existsSync(X)) Z.rmSync(X, { recursive: !0, force: !0 });

  g(`Successfully cached plugin ${Q} at ${I}`);
  return I;
}

// READABLE (for understanding):
async function copyToVersionedCache(sourcePath, pluginId, version, manifest) {
  const fs = getFs();
  const versionedPath = getPluginVersionPath(pluginId, version);

  // Skip if already cached
  if (fs.existsSync(versionedPath)) {
    log(`Plugin ${pluginId} version ${version} already cached at ${versionedPath}`);
    return versionedPath;
  }

  // Create parent directories
  fs.mkdirSync(path.dirname(versionedPath), { recursive: true });

  const hasManifest =
    fs.existsSync(path.join(sourcePath, "plugin.json")) ||
    fs.existsSync(path.join(sourcePath, ".claude-plugin", "plugin.json"));

  if (hasManifest) {
    // Self-contained plugin: copy entire directory
    log(`Copying self-contained plugin ${pluginId} to versioned cache`);
    copyDirectoryRecursive(sourcePath, versionedPath);
  } else if (manifest) {
    // Non-self-contained: copy only specified components
    log(`Copying non-self-contained plugin ${pluginId} to versioned cache`);
    fs.mkdirSync(versionedPath);

    const copyComponent = (relativePath) => {
      const src = path.join(sourcePath, relativePath);
      const dst = path.join(versionedPath, relativePath);
      if (!fs.existsSync(src)) {
        log(`Component ${relativePath} not found`, { level: "warn" });
        return;
      }
      if (fs.statSync(src).isDirectory()) {
        copyDirectoryRecursive(src, dst);
      } else {
        fs.mkdirSync(path.dirname(dst), { recursive: true });
        fs.copyFileSync(src, dst);
      }
    };

    // Copy components from manifest
    copyManifestComponents(manifest, copyComponent);

    // Copy standard directories if they exist
    for (const dir of ["commands", "agents", "skills", "hooks", "output-styles"]) {
      const src = path.join(sourcePath, dir);
      if (fs.existsSync(src)) {
        copyDirectoryRecursive(src, path.join(versionedPath, dir));
      }
    }
  } else {
    // Fallback: copy everything
    log(`Copying plugin ${pluginId} to versioned cache (fallback)`);
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

// Mapping: s22→copyToVersionedCache, JB1→getPluginVersionPath, oAA→copyDirectoryRecursive
```

---

## Manifest Validation

```javascript
// ============================================
// parseAndValidateManifest - Parse and validate plugin.json
// Location: chunks.95.mjs:1056-1088 (part of SIA)
// ============================================

// READABLE (for understanding):
function parseAndValidateManifest(manifestPath) {
  const fs = getFs();

  try {
    const content = fs.readFileSync(manifestPath, { encoding: "utf-8" });
    const data = JSON.parse(content);
    const result = pluginManifestSchema.safeParse(data);

    if (result.success) {
      return result.data;
    } else {
      const errors = result.error.errors
        .map(e => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw Error(`Invalid manifest at ${manifestPath}. Errors: ${errors}`);
    }
  } catch (error) {
    if (error.message.includes("invalid manifest")) throw error;
    throw Error(`Corrupt manifest at ${manifestPath}. Parse error: ${error.message}`);
  }
}

// Validation checks:
// 1. Valid JSON syntax
// 2. name: string, non-empty, no spaces, kebab-case
// 3. version: optional, semver format
// 4. commands/agents/skills/hooks: valid structure if present
// 5. Strict mode: no extra fields allowed
```

---

## Registry Updates

### Add Installed Plugin

```javascript
// ============================================
// addInstalledPlugin - Register newly installed plugin
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

// installEntry format:
// {
//   version: "1.2.0",
//   installedAt: "2024-01-15T10:30:00Z",
//   lastUpdated: "2024-02-01T14:22:00Z",
//   installPath: "/Users/user/.claude/plugins/cache/official/code-formatter/1.2.0",
//   gitCommitSha: "abc123def456",
//   isLocal: false
// }

// Mapping: M39→addInstalledPlugin, QVA→getInstalledPlugins, cI1→saveInstalledPlugins
```

---

## Uninstallation

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

  return entry;  // Return for cleanup
}

// Mapping: O39→removeInstalledPlugin
```

### Delete Plugin Cache

```javascript
// ============================================
// deletePluginCache - Delete plugin files from cache
// Location: chunks.143.mjs:3698-3718
// ============================================

// ORIGINAL (for source lookup):
function lI1(A) {
  let Q = RA();
  try {
    if (Q.existsSync(A)) {
      Q.rmSync(A, { recursive: !0, force: !0 });
      g(`Deleted plugin cache at ${A}`);

      // Clean up empty parent directory
      let B = al();
      if (A.includes("/cache/") && A.startsWith(B)) {
        let G = YS3(A);  // path.dirname
        if (Q.existsSync(G) && G !== B && G.startsWith(B)) {
          if (Q.readdirSync(G).length === 0) {
            Q.rmdirSync(G);
            g(`Deleted empty plugin directory at ${G}`);
          }
        }
      }
    } else {
      g(`Plugin cache at ${A} doesn't exist, skipping deletion`);
    }
  } catch (B) {
    throw Error(`Failed to delete plugin cache at ${A}: ${B.message}`);
  }
}

// READABLE (for understanding):
function deletePluginCache(installPath) {
  const fs = getFs();

  try {
    if (fs.existsSync(installPath)) {
      fs.rmSync(installPath, { recursive: true, force: true });
      log(`Deleted plugin cache at ${installPath}`);

      // Clean up empty parent directories
      const cacheRoot = getPluginCacheDir();
      if (installPath.includes("/cache/") && installPath.startsWith(cacheRoot)) {
        const parentDir = path.dirname(installPath);
        if (fs.existsSync(parentDir) && parentDir !== cacheRoot && parentDir.startsWith(cacheRoot)) {
          if (fs.readdirSync(parentDir).length === 0) {
            fs.rmdirSync(parentDir);
            log(`Deleted empty plugin directory at ${parentDir}`);
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

// Mapping: lI1→deletePluginCache
```

---

## Key Symbols Summary

| Obfuscated | Readable | Location | Purpose |
|------------|----------|----------|---------|
| `SIA` | cachePluginFromSource | chunks.95.mjs:959 | Main install function |
| `s22` | copyToVersionedCache | chunks.95.mjs:819 | Copy to versioned path |
| `al` | getPluginCacheDir | chunks.95.mjs:791 | Cache directory path |
| `JB1` | getPluginVersionPath | chunks.95.mjs:795 | Versioned path calculation |
| `YB1` | resolvePluginVersion | chunks.95.mjs:742 | Version resolution |
| `k85` | installNpmPackage | chunks.95.mjs:888 | NPM installation |
| `x85` | cloneGitHubRepo | chunks.95.mjs:918 | GitHub clone |
| `t22` | cloneGitUrl | chunks.95.mjs:911 | Git URL clone |
| `v85` | copyLocalDirectory | chunks.95.mjs:924 | Local directory copy |
| `oAA` | copyDirectoryRecursive | chunks.95.mjs:803 | Recursive directory copy |
| `M39` | addInstalledPlugin | chunks.143.mjs:3685 | Register installation |
| `O39` | removeInstalledPlugin | chunks.143.mjs:3691 | Unregister plugin |
| `lI1` | deletePluginCache | chunks.143.mjs:3698 | Delete cache files |

---

## Related Files

- [overview.md](./overview.md) - Plugin system architecture
- [schemas.md](./schemas.md) - Plugin manifest schema
- [marketplace.md](./marketplace.md) - Marketplace management
- [loading.md](./loading.md) - Component loading
- [state_management.md](./state_management.md) - Enable/disable state
