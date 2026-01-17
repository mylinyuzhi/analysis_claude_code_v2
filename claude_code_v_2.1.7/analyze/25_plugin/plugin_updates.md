# Plugin System Updates (2.1.7)

> **Key Changes:**
> - Git submodule initialization fixed (2.1.7)
> - Marketplace source configuration improved
> - Auto-update toggle per marketplace (2.1.2)
> - FORCE_AUTOUPDATE_PLUGINS env var (2.1.2)

---

## Overview

The plugin system allows extending Claude Code with custom tools, agents, and skills through:
1. Local plugin directories
2. Git-based marketplace sources
3. Enterprise policy controls

---

## Git Clone with Submodules

```javascript
// ============================================
// gitCloneWithSubmodules - Clone plugin repository with submodules
// Location: chunks.90.mjs:2382-2389
// ============================================

// ORIGINAL (for source lookup):
async function G32(A, Q, B) {
  let G = ["-c", "credential.helper=", "-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new",
           "clone", "--depth", "1", "--recurse-submodules", "--shallow-submodules"];
  if (B) G.push("--branch", B);
  return G.push(A, Q), await TQ("git", G, {
    timeout: 30000,
    stdin: "ignore",
    env: getGitEnv()
  })
}

// READABLE (for understanding):
async function gitCloneWithSubmodules(repoUrl, targetPath, branch) {
  let args = [
    "-c", "credential.helper=",  // Disable credential helper for batch
    "-c", "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new",
    "clone",
    "--depth", "1",              // Shallow clone
    "--recurse-submodules",      // Initialize submodules
    "--shallow-submodules"       // Shallow submodule clone
  ];

  if (branch) args.push("--branch", branch);
  args.push(repoUrl, targetPath);

  return await executeCommand("git", args, {
    timeout: 30000,
    stdin: "ignore",
    env: getGitEnv()
  });
}

// Mapping: G32→gitCloneWithSubmodules, A→repoUrl, Q→targetPath, B→branch, TQ→executeCommand
```

**Key insight (2.1.7 fix):**
- `--recurse-submodules` ensures plugin submodules are initialized
- `--shallow-submodules` keeps clone fast while including submodule content
- This fixes plugins that use git submodules for dependencies

---

## Marketplace Source Types

```javascript
// ============================================
// loadMarketplaceSource - Handle different source types
// Location: chunks.91.mjs:70-91
// ============================================

// Supported source types:
switch (source.source) {
  case "github-default-branch":
    // Clone from GitHub with automatic branch detection
    // Falls back on auth failure with token injection
    break;

  case "git":
    // Clone from any git URL with optional ref
    await gitCloneWithSubmodules(source.url, targetPath, source.ref);
    marketplacePath = join(targetPath, source.path || ".claude-plugin/marketplace.json");
    break;

  case "npm":
    throw Error("NPM marketplace sources not yet implemented");

  case "file":
    // Direct path to marketplace.json file
    marketplacePath = source.path;
    break;

  case "directory":
    // Directory containing .claude-plugin/marketplace.json
    marketplacePath = join(source.path, ".claude-plugin", "marketplace.json");
    break;
}
```

---

## Marketplace Management

### Add Marketplace

```javascript
// ============================================
// addMarketplaceSource - Register new marketplace
// Location: chunks.91.mjs:136-156
// ============================================

// ORIGINAL:
async function NS(A, Q) {
  // Check enterprise policy
  if (!H4A(A)) {
    if (AyA(A)) throw Error(`Marketplace source '${KVA(A)}' is blocked by enterprise policy.`);
    let J = WVA() || [];
    throw Error(`Marketplace source '${KVA(A)}' is blocked by enterprise policy. ` +
      (J.length > 0 ? `Allowed sources: ${J.map((X)=>KVA(X)).join(", ")}` : "No external marketplaces are allowed."))
  }

  // Download and validate marketplace
  let { marketplace: B, cachePath: G } = await VI0(A, Q);

  // Check for naming conflicts
  let Y = await D5();
  if (Y[B.name]) throw Error(`Marketplace '${B.name}' is already installed.`);

  // Save configuration
  Y[B.name] = {
    source: A,
    installLocation: G,
    lastUpdated: new Date().toISOString()
  };
  await FVA(Y);

  return { name: B.name };
}

// READABLE:
async function addMarketplaceSource(source, progressCallback) {
  // Verify enterprise policy allows this source
  if (!isMarketplaceSourceAllowed(source)) {
    if (isMarketplaceSourceBlocked(source)) {
      throw Error(`Marketplace source '${formatSourceName(source)}' is blocked by enterprise policy.`);
    }
    let allowedSources = getAllowedMarketplaceSources() || [];
    throw Error(`Marketplace source blocked. Allowed: ${allowedSources.map(formatSourceName).join(", ")}`);
  }

  // Download and validate
  let { marketplace, cachePath } = await loadMarketplaceSource(source, progressCallback);

  // Check duplicates
  let config = await getMarketplaceConfig();
  if (config[marketplace.name]) {
    throw Error(`Marketplace '${marketplace.name}' already installed.`);
  }

  // Save
  config[marketplace.name] = {
    source,
    installLocation: cachePath,
    lastUpdated: new Date().toISOString()
  };
  await saveMarketplaceConfig(config);

  return { name: marketplace.name };
}

// Mapping: NS→addMarketplaceSource, H4A→isMarketplaceSourceAllowed, AyA→isMarketplaceSourceBlocked
// WVA→getAllowedMarketplaceSources, VI0→loadMarketplaceSource, D5→getMarketplaceConfig, FVA→saveMarketplaceConfig
```

### Auto-Update Toggle

```javascript
// ============================================
// setMarketplaceAutoUpdate - Toggle auto-update for marketplace
// Location: chunks.91.mjs:326-330
// ============================================

// ORIGINAL (context):
async function setMarketplaceAutoUpdate(marketplaceName, enabled) {
  let config = await getMarketplaceConfig();
  if (!config[marketplaceName]) {
    throw Error(`Marketplace '${marketplaceName}' not found.`);
  }

  config[marketplaceName].autoUpdate = enabled;
  await saveMarketplaceConfig(config);
  logDebug(`Set autoUpdate=${enabled} for marketplace: ${marketplaceName}`);
}
```

---

## Enterprise Policy Support

Enterprises can control which marketplace sources are allowed:

| Setting | Effect |
|---------|--------|
| Allowed sources list | Only these sources can be added |
| Blocked sources | These sources are explicitly denied |
| Empty allowed list | No external marketplaces allowed |

---

## Environment Variables

| Variable | Version | Description |
|----------|---------|-------------|
| `FORCE_AUTOUPDATE_PLUGINS` | 2.1.2 | Force auto-update for all plugins |

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `gitCloneWithSubmodules` (G32) - Git clone with submodule support
- `addMarketplaceSource` (NS) - Register marketplace
- `loadMarketplaceSource` (VI0) - Download/validate marketplace
- `isMarketplaceSourceAllowed` (H4A) - Enterprise policy check
- `getMarketplaceConfig` (D5) - Read marketplace config
- `saveMarketplaceConfig` (FVA) - Write marketplace config

---

## See Also

- [../06_mcp/](../06_mcp/) - MCP server plugins
- [../10_skill/](../10_skill/) - Custom skills from plugins

