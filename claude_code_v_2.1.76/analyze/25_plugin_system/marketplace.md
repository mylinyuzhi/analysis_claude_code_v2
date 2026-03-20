# Plugin Marketplace System (Claude Code 2.1.76)

> Deep dive into marketplace management: installation, refresh, removal, auto-update,
> enterprise policy enforcement, and the two-level caching strategy.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `installMarketplaceSource` (wE) - Install marketplace with enterprise policy check
- `removeMarketplaceSource` (OG6) - Remove marketplace, clean settings across all scopes
- `refreshMarketplace` (St) - Refresh one marketplace from its source
- `refreshAllMarketplaces` (Yn4) - Refresh all installed marketplaces
- `setMarketplaceAutoUpdate` (zn4) - Toggle auto-update flag for a marketplace
- `fetchAndCacheMarketplace` (RyA) - Download/clone marketplace source, validate, cache
- `downloadMarketplaceFromUrl` (qn4) - HTTP GET marketplace JSON with error categorization
- `getMarketplaceCached` (NZ) - Memoized marketplace data loader with auto-repair
- `getMarketplaceConfig` (n5) - Read `known_marketplaces.json`
- `saveMarketplaceConfig` (qG1) - Write `known_marketplaces.json`
- `readMarketplaceFromCache` (HG6) - Parse cached marketplace JSON
- `isMarketplaceAllowed` (Fq1) - Enterprise policy allow-list check
- `isExplicitlyBlocked` (nb1) - Enterprise policy block-list check
- `getAllowedMarketplaceSources` (mq1) - Read `policySettings.strictKnownMarketplaces`
- `getBlockedMarketplaces` (iD9) - Read `policySettings.blockedMarketplaces`
- `lookupPluginEntry` (a0) - Find plugin entry across all marketplace data
- `lookupPluginEntryFromCache` (yyA) - Synchronous fast-path lookup

---

## Overview

The marketplace system provides a distribution layer for Claude Code plugins. Rather than pointing directly to plugin directories, users configure "marketplace sources" - repositories or files that contain a catalog of available plugins. This indirection enables:
1. Plugin discovery (browse what's available)
2. Curated distribution (marketplace owners vet plugins)
3. Version management (marketplace specifies plugin versions)
4. Enterprise control (admins whitelist allowed sources)

### Filesystem Layout

```
~/.claude/
├── known_marketplaces.json        ← Registry of installed marketplace sources
└── marketplaces/                  ← Cached marketplace data
    ├── my-market/                 ← git clone of a GitHub marketplace
    │   └── .claude-plugin/
    │       └── marketplace.json   ← Marketplace catalog
    └── other-market.json          ← URL-fetched marketplace JSON
```

---

## Marketplace Source Types

```javascript
// Six source types, from chunks.143.mjs

type MarketplaceSource =
  | { source: "github"; repo: string; ref?: string; path?: string }
  | { source: "git"; url: string; ref?: string; path?: string }
  | { source: "git-subdir"; url: string; subdir: string; ref?: string }  // NEW in v2.1.76
  | { source: "url"; url: string; headers?: Record<string,string> }
  | { source: "npm"; package: string }    // NOT YET IMPLEMENTED
  | { source: "file"; path: string }
  | { source: "directory"; path: string }
```

**New in v2.1.76 - `git-subdir` source type:**
Allows loading a marketplace from a subdirectory of a git repository. This is useful when marketplace metadata is stored alongside other files in a monorepo:

```json
{
  "source": "git-subdir",
  "url": "https://github.com/myorg/company-repo",
  "subdir": "tools/claude-plugins",
  "ref": "main"
}
```

The system clones the repository and reads marketplace.json from the specified subdirectory, without requiring the entire repository to be a dedicated plugin marketplace.

---

## Installation Flow (`wE` → `RyA`)

### Enterprise Policy Pre-Check

```javascript
// ============================================
// installMarketplaceSource - Install with enterprise policy gate
// Location: chunks.143.mjs:180-210
// ============================================

// READABLE (for understanding):
async function installMarketplaceSource(sourceConfig, options) {
    // 1. Enterprise policy check FIRST (before any network activity)
    if (isExplicitlyBlocked(sourceConfig)) {
        throw { type: "marketplace-blocked-by-policy", source: sourceConfig };
    }
    if (!isMarketplaceAllowed(sourceConfig)) {
        throw { type: "marketplace-not-in-allowlist", source: sourceConfig };
    }

    // 2. Fetch and cache the marketplace data
    let cachedPath = await fetchAndCacheMarketplace(sourceConfig);

    // 3. Register in known_marketplaces.json
    let config = getMarketplaceConfig();
    config.marketplaces[sourceConfig.name] = {
        source: sourceConfig,
        cachedPath,
        installedAt: new Date().toISOString(),
        autoUpdate: options?.autoUpdate ?? true
    };
    saveMarketplaceConfig(config);

    return cachedPath;
}
```

### Fetch and Cache (`RyA`)

```javascript
// ============================================
// fetchAndCacheMarketplace - Download/clone and cache marketplace data
// Location: chunks.143.mjs:312-380
// ============================================

// READABLE (for understanding):
async function fetchAndCacheMarketplace(sourceConfig) {
    switch (sourceConfig.source) {
        case "github":
        case "git":
        case "git-subdir": {
            // Clone the repository to ~/.claude/marketplaces/{name}/
            let clonePath = join(getMarketplacesDir(), generateName(sourceConfig));
            await gitClone(sourceConfig.url, clonePath, sourceConfig.ref);
            if (sourceConfig.source === "git-subdir") {
                // Navigate to subdirectory for git-subdir type
                clonePath = join(clonePath, sourceConfig.subdir);
            }
            return clonePath;
        }
        case "url": {
            // HTTP GET the JSON file
            let json = await downloadMarketplaceFromUrl(sourceConfig.url, sourceConfig.headers);
            let cachePath = join(getMarketplacesDir(), `${generateName(sourceConfig)}.json`);
            writeFileSync(cachePath, JSON.stringify(json));
            return cachePath;
        }
        case "file":
            return sourceConfig.path;  // No caching needed, use directly
        case "directory":
            return join(sourceConfig.path, ".claude-plugin", "marketplace.json");
    }
}
```

---

## Auto-Update System

### Refresh Flow

```
Session start OR explicit refresh
    │
    ├─ refreshAllMarketplaces (Yn4)
    │       │
    │       └─ For each marketplace with autoUpdate=true:
    │              └─ refreshMarketplace (St)
    │                     │
    │                     ├─ If source=git/github: git pull
    │                     ├─ If source=url: re-download
    │                     └─ Update cachedPath + metadata
    │
    └─ clearPluginHookCache (rO6) - invalidate loaded plugin hooks
```

**Why auto-update at session start:** Marketplace catalogs are updated by their owners to add new plugins, fix versions, or deprecate old ones. Auto-refreshing at session start ensures users have the latest plugin availability without manual intervention.

**Opt-out:** `setMarketplaceAutoUpdate(zn4)` allows disabling auto-update for stability-sensitive environments.

---

## Plugin Entry Lookup

### `lookupPluginEntry` (a0) - Async Lookup

**What it does:** Given a `pluginName@marketplaceName` identifier, finds the corresponding plugin entry in the marketplace catalog.

**How it works:**
1. Parse the `pluginName@marketplaceName` format
2. Load the named marketplace's catalog via `getMarketplaceCached(NZ)`
3. Find the plugin by name in the catalog
4. Return the entry (version, download URL, description, etc.)

### `lookupPluginEntryFromCache` (yyA) - Synchronous Fast-path

**What it does:** Same as `lookupPluginEntry` but uses only the in-memory cache. Returns `null` if the marketplace hasn't been loaded yet.

**Why two variants:** During session startup, everything is async. But during tool execution (e.g., when a plugin-contributed tool is invoked), a synchronous lookup is needed for performance. The memoized cache (`NZ`) makes this safe.

---

## Error Categories

Marketplace operations produce categorized errors for diagnostics:

| Error Type | Trigger | Recovery |
|-----------|---------|---------|
| `marketplace-blocked-by-policy` | `blockedMarketplaces` policy matches | Contact admin |
| `marketplace-not-in-allowlist` | `strictKnownMarketplaces` doesn't include source | Contact admin |
| `marketplace-fetch-failed` | Network error downloading catalog | Retry or check URL |
| `marketplace-invalid-json` | Catalog JSON malformed | Fix marketplace |
| `marketplace-git-clone-failed` | Git not installed or auth error | Fix git config |
| `plugin-not-found` | Plugin name not in catalog | Check name spelling |
| `plugin-version-mismatch` | Requested version not available | Check marketplace |

---

## Enterprise Policy Enforcement

### `strictKnownMarketplaces` Allow-list

**What it does:** When set in managed settings, ONLY marketplace sources matching the allow-list can be installed. The check happens BEFORE any network activity, so blocked sources never touch the filesystem.

**Source type patterns (v2.1.76):**

```typescript
// strictKnownMarketplaces is an array of source matchers:
type StrictKnownMarketplaces = Array<
  | { source: "github"; repo: string }           // Exact GitHub repo match
  | { source: "git"; url: string }               // Exact git URL match
  | { source: "url"; url: string }               // Exact URL match
  | { source: "file"; path: string }             // Exact file path match
  | { source: "directory"; path: string }        // Exact directory match
  | { source: "hostPattern"; hostPattern: string }  // Regex for hostname (v2.1.76)
  | { source: "pathPattern"; pathPattern: string }  // Regex for filesystem paths (v2.1.76)
>;
```

**`hostPattern` (v2.1.76):**
- Regex pattern matched against the hostname extracted from any marketplace source
- For `github` sources: matches against `"github.com"`
- For `git` sources (SSH or HTTPS): extracts hostname from URL
- Example: `"^github\\.mycompany\\.com$"` allows all marketplaces from corporate GitHub

**`pathPattern` (v2.1.76):**
- Regex pattern matched against the `.path` field of `file` and `directory` sources
- Allows filesystem-based marketplaces alongside `hostPattern` restrictions
- Example: `"^/opt/approved/"` restricts to specific directories
- Use `".*"` to allow all filesystem paths

**Example enterprise configuration:**

```json
{
  "strictKnownMarketplaces": [
    { "source": "hostPattern", "hostPattern": "^github\\.mycompany\\.com$" },
    { "source": "pathPattern", "pathPattern": "^/opt/approved/.*" }
  ],
  "extraKnownMarketplaces": {
    "company-plugins": {
      "source": "github",
      "repo": "mycompany/claude-plugins"
    }
  }
}
```

### `blockedMarketplaces` Block-list

**What it does:** Blacklist of marketplace sources that cannot be installed, even if they pass the allow-list check.

**Evaluation order:**
1. Check `blockedMarketplaces` first → reject if matched
2. Check `strictKnownMarketplaces` → reject if NOT matched
3. Allow the marketplace

### `pluginTrustMessage` (v2.1.76)

**What it does:** Custom message appended to the plugin trust warning shown before installation.

**Where it's read from:** Only from policy settings (managed-settings.json / MDM). User/project settings are ignored.

**Use case:** Enterprise administrators can add organization-specific context to the trust prompt:

```json
{
  "pluginTrustMessage": "All plugins from our internal marketplace are vetted and approved by the security team."
}
```

**Display behavior:** The message appears in the trust prompt dialog, giving users confidence that the plugin has been reviewed.

### Policy Check Functions

| Function | Obfuscated | Description |
|----------|-----------|-------------|
| `getAllowedMarketplaceSources` | `Ke` | Read `policySettings.strictKnownMarketplaces` |
| `getBlockedMarketplaces` | `Gk8` | Read `policySettings.blockedMarketplaces` |
| `isMarketplaceAllowed` | `mq1` | Check if source matches allow-list |
| `isExplicitlyBlocked` | `nb1` | Check if source matches block-list |
| `matchesHostPattern` | `gF9` | Match source against `hostPattern` regex |
| `matchesPathPattern` | `FF9` | Match source against `pathPattern` regex |
| `getPluginTrustMessage` | `V_4` | Read `policySettings.pluginTrustMessage` |
