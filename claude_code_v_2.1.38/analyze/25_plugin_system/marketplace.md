# Plugin Marketplace System (Claude Code 2.1.38)

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
  | { source: "url"; url: string; headers?: Record<string,string> }
  | { source: "npm"; package: string }    // NOT YET IMPLEMENTED
  | { source: "file"; path: string }
  | { source: "directory"; path: string }
```

---

## Installation Flow (`wE` → `RyA`)

### Enterprise Policy Pre-Check

```javascript
// ============================================
// installMarketplaceSource - Install with enterprise policy gate
// Location: chunks.143.mjs:180-210
// ============================================

// ORIGINAL:
async function wE(A, q) {
    if (!Fq1(A)) {
        if (nb1(A)) throw Error(`Marketplace source '${o01(A)}' is blocked by enterprise policy.`);
        let H = mq1() || [], $ = Kb7(), O = vXA(A),
            _ = `Marketplace source '${o01(A)}'`;
        if (O) _ += ` (${O})`;
        _ += " is blocked by enterprise policy.";
        if (H.length > 0) _ += ` Allowed sources: ${H.map((J) => o01(J)).join(", ")}`;
        else _ += " No external marketplaces are allowed.";
        if (A.source === "github" && $.length > 0) _ += `
Tip: The shorthand "${A.repo}" assumes github.com. For internal GitHub Enterprise, use the full URL: git@your-github-host.com:${A.repo}.git`;
        throw Error(_)
    }
    let { marketplace: K, cachePath: Y } = await RyA(A, q), z = pw8(K.name, A);
    if (z) throw Error(z);  // Name uniqueness validation
    let w = await n5();
    if (w[K.name]) throw Error(`Marketplace '${K.name}' is already installed.`);
    return w[K.name] = { source: A, installLocation: Y, lastUpdated: new Date().toISOString() },
           await qG1(w), { name: K.name }
}

// READABLE:
async function installMarketplaceSource(source, progressCallback) {
    // Gate 1: Enterprise policy enforcement
    if (!isMarketplaceAllowed(source)) {
        let errorMsg = buildPolicyErrorMessage(source);
        throw Error(errorMsg);
    }

    // Gate 2: Download and validate
    let { marketplace, cachePath } = await fetchAndCacheMarketplace(source, progressCallback);

    // Gate 3: Name uniqueness
    let nameError = validateMarketplaceName(marketplace.name, source);
    if (nameError) throw Error(nameError);

    // Gate 4: Deduplication
    let config = await getMarketplaceConfig();
    if (config[marketplace.name])
        throw Error(`Marketplace '${marketplace.name}' is already installed.`);

    // Persist
    config[marketplace.name] = {
        source,
        installLocation: cachePath,
        lastUpdated: new Date().toISOString()
    };
    await saveMarketplaceConfig(config);
    return { name: marketplace.name };
}

// Mapping: wE→installMarketplaceSource, Fq1→isMarketplaceAllowed, nb1→isExplicitlyBlocked,
//   mq1→getAllowedMarketplaceSources, RyA→fetchAndCacheMarketplace, pw8→validateMarketplaceName,
//   n5→getMarketplaceConfig, qG1→saveMarketplaceConfig
```

---

## Download and Cache (`RyA`)

This is the core download function, handling all 6 source types:

```javascript
// ============================================
// fetchAndCacheMarketplace - Download/clone marketplace and cache it
// Location: chunks.143.mjs:60-178
// ============================================

// ORIGINAL (key sections):
async function RyA(A, q) {
    let K = b1(), Y = ei4();  // ~/.claude/marketplaces/
    K.mkdirSync(Y);
    let z, w, H = false, $ = lIY(A);  // Generate temp name

    try {
        switch (A.source) {
            case "url":
                z = iZ(Y, `${$}.json`), H = true;
                await qn4(A.url, z, A.headers, q);  // HTTP GET
                w = z;
                break;
            case "github": {
                let X = `git@github.com:${A.repo}.git`,
                    D = `https://github.com/${A.repo}.git`;
                z = iZ(Y, $), H = true;
                let j = null;
                // SSH-first (or HTTPS-first based on remote detection)
                if (await UIY()) {  // hasSSHConfigured()
                    try { await eW1(X, z, A.ref, q); }
                    catch (P) {
                        j = P;
                        // Clean up failed SSH clone, retry with HTTPS
                        K.rmSync(z, { recursive: true });
                        try { await eW1(D, z, A.ref, q); j = null; }
                        catch (W) { j = W; }
                    }
                } else {
                    // HTTPS-first, fallback to SSH
                    try { await eW1(D, z, A.ref, q); }
                    catch (P) { /* ... HTTPS-then-SSH fallback ... */ }
                }
                if (j) throw j;
                w = iZ(z, A.path || ".claude-plugin/marketplace.json");
                break;
            }
            // "git": similar to github but arbitrary URL
            // "npm": throws "not yet implemented"
            // "file": reads directly from local path
            // "directory": reads from {dir}/.claude-plugin/marketplace.json
        }

        let O = Kn4(w, AH1),  // readAndValidateJsonFile against marketplace schema
            _ = iZ(Y, O.name);  // Final path = marketplaces/{marketplaceName}

        // Rename temp dir to final name (atomic-ish move)
        if (z !== _ && !isLocalSource) {
            if (K.existsSync(_)) K.rmSync(_, { recursive: true });
            K.renameSync(z, _);
        }
        return { marketplace: O, cachePath: z };
    } catch (O) {
        // Cleanup temp dir on failure
        if (H && z) K.rmSync(z, { recursive: true, force: true });
        throw O;
    }
}
```

### Clone Strategy: Bidirectional SSH/HTTPS Fallback

**Algorithm:**
```
if hasSshConfigured():
    try:  ssh_clone(repo)
    if fail:
        cleanup
        try: https_clone(repo)
        if fail: throw last error
else:
    try: https_clone(repo)
    if fail:
        cleanup
        try: ssh_clone(repo)
        if fail: throw last error
```

**Why bidirectional (not just SSH→HTTPS):**
- Users with SSH configured but expired keys → HTTPS works
- Users behind corporate proxies blocking SSH port 22 → HTTPS works
- Users with HTTPS rate limits or auth issues → SSH may work
- Remote environments (`CLAUDE_CODE_REMOTE` env var) → always use HTTPS first

### Git Clone Options

```javascript
// KxY - git clone with shallow clone options
z = ["clone", "--depth", "1", "--recurse-submodules", "--shallow-submodules"];
// --depth 1: Only latest commit (fast, small)
// --recurse-submodules: Include submodules (marketplace may reference plugin subdirectories)
// --shallow-submodules: Shallow clone for submodules too

// For specific SHA/ref checkout:
// 1. Try: git fetch --depth 1 origin {sha}
// 2. If fail: git fetch --unshallow (full history)
// 3. git checkout {sha}
```

### HTTP Download (URL Source)

```javascript
// ============================================
// downloadMarketplaceFromUrl - HTTP GET with error categorization
// Location: chunks.143.mjs:3-39
// ============================================

// ORIGINAL:
async function qn4(A, q, K, Y) {
    let w = { ...K, "User-Agent": "Claude-Code-Plugin-Manager" };
    let H = await sA.get(A, { timeout: 10000, headers: w });  // 10s timeout
    let $ = AH1.safeParse(H.data);  // Validate against marketplace schema
    if (!$.success) throw new hG(`Invalid marketplace schema...`);
    // Write to cache file
}

// Error categorization for user-facing messages:
// ECONNREFUSED / ENOTFOUND  → "Could not connect to {url}. Check your internet connection."
// ETIMEDOUT                  → "Request timed out. The server may be slow."
// HTTP 4xx/5xx               → "HTTP {status} error. The file may not exist at this URL."
// Other                      → Generic failure message
```

---

## Removal Flow (`OG6`)

Marketplace removal is a multi-step cleanup that touches multiple files:

```javascript
// ============================================
// removeMarketplaceSource - Full marketplace removal
// Location: chunks.143.mjs:212-258
// ============================================

// READABLE:
async function removeMarketplaceSource(marketplaceName) {
    // 1. Remove from known_marketplaces.json
    let config = await getMarketplaceConfig();
    if (!config[marketplaceName]) throw Error(`Marketplace '${marketplaceName}' not found`);
    delete config[marketplaceName];
    await saveMarketplaceConfig(config);

    // 2. Delete cached data from filesystem
    let marketplacesDir = getMarketplacesDir();   // ~/.claude/marketplaces/
    let dirPath = path.join(marketplacesDir, marketplaceName);
    let filePath = path.join(marketplacesDir, `${marketplaceName}.json`);
    if (fs.existsSync(dirPath)) fs.rmSync(dirPath, { recursive: true, force: true });
    if (fs.existsSync(filePath)) fs.rmSync(filePath, { force: true });

    // 3. Clean up enabled plugins from ALL settings files (user/project/local)
    for (let settingsScope of ["userSettings", "projectSettings", "localSettings"]) {
        let settings = readSettings(settingsScope);
        if (!settings) continue;
        let changed = false, updates = {};

        // Remove from extraKnownMarketplaces
        if (settings.extraKnownMarketplaces?.[marketplaceName]) {
            updates.extraKnownMarketplaces = { ...settings.extraKnownMarketplaces };
            updates.extraKnownMarketplaces[marketplaceName] = undefined;
            changed = true;
        }

        // Disable all plugins from this marketplace
        if (settings.enabledPlugins) {
            let newPlugins = { ...settings.enabledPlugins };
            for (let key in newPlugins)
                if (key.endsWith(`@${marketplaceName}`)) {
                    newPlugins[key] = undefined;  // Set to undefined = remove
                    changed = true;
                }
            if (changed) updates.enabledPlugins = newPlugins;
        }

        if (changed) updateSettings(settingsScope, updates);
    }

    // 4. Clean up installation records from installed_plugins.json
    let orphanedPaths = removePluginsByMarketplace(marketplaceName);  // _b7
    for (let installPath of orphanedPaths) markForDeletion(installPath);  // tW1
}

// Mapping: OG6→removeMarketplaceSource, n5→getMarketplaceConfig,
//   qG1→saveMarketplaceConfig, ei4→getMarketplacesDir, _b7→removePluginsByMarketplace
```

**Why clean up settings across all scopes:**
If a user installs marketplace A in user settings and enables plugins P1, P2, and a project also enables P3 from marketplace A, removing marketplace A must clean all three references. Otherwise the next session would log errors for missing plugins.

---

## Refresh Flow (`St`)

```javascript
// ============================================
// refreshMarketplace - Re-fetch one marketplace from source
// Location: chunks.143.mjs:357-391
// ============================================

// READABLE:
async function refreshMarketplace(marketplaceName, progressCallback, gitRef) {
    let config = await getMarketplaceConfig();
    let { installLocation, source } = config[marketplaceName];

    // Invalidate memoized cache for this marketplace
    getMarketplaceCached.cache?.delete?.(marketplaceName);

    if (source.source === "github" || source.source === "git") {
        let url = source.source === "github"
            ? (isRemote ? `https://github.com/${source.repo}.git` : `git@github.com:${source.repo}.git`)
            : source.url;
        // git pull (with optional branch switch via ref)
        await gitPullMarketplace(url, installLocation, source.ref, progressCallback, gitRef);

        // Post-refresh validation: ensure marketplace.json still exists and is valid
        try { readMarketplaceFromCache(installLocation); }
        catch {
            // Special case: deprecated marketplace message
            if (marketplaceName === "claude-code-plugins")
                throw Error(`We've deprecated "claude-code-plugins" in favor of "claude-plugins-official".`);
            throw Error(`The marketplace.json file is no longer present. The marketplace may have been deprecated.`);
        }
    } else if (source.source === "url") {
        await downloadMarketplaceFromUrl(source.url, installLocation, source.headers, progressCallback);
    } else if (source.source === "file" || source.source === "directory") {
        // Local sources: just re-validate (the file is already there)
        readMarketplaceFromCache(installLocation);
    }

    config[marketplaceName].lastUpdated = new Date().toISOString();
    await saveMarketplaceConfig(config);
}

// SSH authentication error enhancement in gIY:
// "Permission denied (publickey)" → enhanced message with SSH key setup instructions
// This is the git pull wrapper (not the initial clone)
```

**Special case: deprecated marketplace name**
The code contains special handling for `"claude-code-plugins"` → `"claude-plugins-official"` migration. When a user's old marketplace is refreshed and the `marketplace.json` is missing (marketplace moved), a helpful deprecation message is shown instead of a generic error.

---

## Memoized Marketplace Data (`NZ`)

```javascript
// ============================================
// getMarketplaceCached - Memoized marketplace data with auto-repair
// Location: chunks.143.mjs:430-445 (NZ initialization in p$ module)
// ============================================

// ORIGINAL:
NZ = KA(async (A) => {  // KA = memoize
    let q = await n5(), K = q[A];  // getMarketplaceConfig()
    if (!K) throw Error(`Marketplace '${A}' not found...`);
    try { return HG6(K.installLocation) }  // readMarketplaceFromCache()
    catch (z) {
        // Cache corrupted/missing → auto-repair by re-fetching
        h(`Cache corrupted for marketplace ${A}, re-fetching...`);
    }
    let { marketplace: Y } = await RyA(K.source);  // Re-download
    q[A].lastUpdated = new Date().toISOString();
    await qG1(q);
    return Y;
});

// READABLE:
getMarketplaceCached = memoize(async (marketplaceName) => {
    let config = await getMarketplaceConfig();
    let marketplaceConfig = config[marketplaceName];
    if (!marketplaceConfig) throw Error(`Marketplace '${marketplaceName}' not found`);

    try {
        return readMarketplaceFromCache(marketplaceConfig.installLocation);
    } catch (err) {
        // Self-healing: cache corrupted → auto re-download
        log.warn(`Cache corrupted for marketplace ${marketplaceName}, re-fetching from source`);
    }
    let { marketplace } = await fetchAndCacheMarketplace(marketplaceConfig.source);
    config[marketplaceName].lastUpdated = new Date().toISOString();
    await saveMarketplaceConfig(config);
    return marketplace;
});

// Mapping: NZ→getMarketplaceCached, KA→memoize, HG6→readMarketplaceFromCache,
//   RyA→fetchAndCacheMarketplace
```

**Why memoize with auto-repair:**
- Marketplace data is loaded per-session, not per-request (memoized prevents repeated disk reads)
- Auto-repair handles the case where the cache directory was manually deleted or corrupted
- The memoization cache is keyed by marketplace name, so `NZ.cache?.delete?.(name)` can invalidate a specific marketplace after refresh

---

## Auto-Update Configuration (`zn4`)

```javascript
// ============================================
// setMarketplaceAutoUpdate - Enable/disable auto-update for a marketplace
// Location: chunks.143.mjs:393-402
// ============================================

// ORIGINAL:
async function zn4(A, q) {
    let K = await n5(), Y = K[A];
    if (!Y) throw Error(`Marketplace '${A}' not found.`);
    if (Y.autoUpdate === q) return;  // No-op if already set
    K[A] = { ...Y, autoUpdate: q }, await qG1(K);
}
```

The `autoUpdate` flag in `known_marketplaces.json` enables/disables automatic refresh at session start. When enabled, the system refreshes the marketplace before loading plugins (similar to `apt update` before installing packages).

---

## Marketplace Schema (`AH1`)

The marketplace JSON file must conform to this structure:

```typescript
// Inferred from validation code (AH1 is the Zod schema)
interface MarketplaceJSON {
    name: string;           // Unique marketplace identifier
    description?: string;
    plugins: Array<{
        name: string;       // Plugin identifier
        description?: string;
        version?: string;   // Optional explicit version
        source: string | PluginSource;  // Relative path or remote source
        commands?: string[] | Record<string, {source?: string; content?: string}>;
        agents?: string[];
        skills?: string[];
        hooks?: string | string[] | HookConfig;
        outputStyles?: string[];
        mcpServers?: string | string[] | Record<string, McpServerConfig>;
        strict?: boolean;   // Whether plugin.json conflicts are fatal
    }>;
}
```

---

## Enterprise Policy Deep Dive

### Policy Configuration in `policySettings`

Enterprise administrators deploy a `policySettings` file (usually managed by MDM/configuration management):

```json
{
  "strictKnownMarketplaces": [
    { "source": "github", "repo": "myorg/internal-plugins" },
    { "source": "url", "url": "https://internal.myorg.com/marketplace.json" }
  ],
  "blockedMarketplaces": [
    { "source": "github", "repo": "suspicious-org/plugins" }
  ]
}
```

### Decision Logic

```javascript
// isMarketplaceAllowed (Fq1) - Full logic:
function isMarketplaceAllowed(source) {
    // Explicit block list takes priority over allow list
    if (isExplicitlyBlocked(source)) return false;

    let allowList = getAllowedMarketplaceSources();

    // null = no policy configured = allow everything
    if (allowList === null) return true;

    // Empty array = block everything (whitelist mode with no entries)
    // Non-empty = check if source matches any allowed entry
    return allowList.some(allowed => {
        if (allowed.source === "hostPattern")
            return matchesHostPattern(source, allowed);  // rD9
        return marketplaceSourceEquals(source, allowed); // nD9
    });
}
```

### `hostPattern` Source Type

The `hostPattern` type allows matching by hostname rather than exact source:

```json
{ "source": "hostPattern", "hostPattern": "*.myorg.com" }
```

This allows all GitHub Enterprise repos under `myorg.com` without listing each one. The `vXA` function extracts the hostname from a source for comparison:
- `github` source → `"github.com"`
- `git` SSH URL → extracted from `git@host:` prefix
- `git` HTTPS URL → extracted from URL hostname
- `url` → extracted from URL hostname

### GitHub Enterprise Hint

When a `github` source is blocked (because the enterprise uses GitHub Enterprise at a custom domain), the error message includes:

```
Tip: The shorthand "org/repo" assumes github.com.
For internal GitHub Enterprise, use the full URL:
  git@your-github-host.com:org/repo.git
```

This hint appears when `getBlockedHosts()` (`Kb7`) returns a non-empty array, indicating the enterprise has configured GitHub Enterprise hosts.

---

## Plugin Entry Lookup: Fast Path vs. Slow Path

### Fast Path: `yyA` (lookupPluginEntryFromCache)

```javascript
// ============================================
// lookupPluginEntryFromCache - Synchronous lookup from known_marketplaces.json
// Location: chunks.143.mjs:295-320
// ============================================

// ORIGINAL:
function yyA(A) {
    let q = A.split("@");
    if (q.length !== 2) return null;
    let K = q[0], Y = q[1];         // pluginName, marketplaceName
    let z = b1(), w = $G6();        // known_marketplaces.json path
    if (!z.existsSync(w)) return null;
    try {
        let H = z.readFileSync(w, { encoding: "utf-8" }),
            O = _A(H)[Y];           // Get marketplace config entry
        if (!O) return null;
        let _ = iIY(Y);             // getCachedMarketplace(marketplaceName)
        if (!_) return null;
        let J = _.plugins.find((X) => X.name === K);
        if (!J) return null;
        return { entry: J, marketplaceInstallLocation: O.installLocation }
    } catch { return null }
}
```

This function is synchronous (no `await`) because:
1. It reads the small `known_marketplaces.json` file (just config metadata)
2. It calls `iIY` which reads the cached marketplace.json from disk synchronously
3. Used in the hot path during session init where async overhead matters

### Slow Path: `a0` (lookupPluginEntry)

The `a0` function calls `yyA` first. If that fails (cache miss or corrupted), it falls back to loading the full marketplace config asynchronously via `n5()` and `NZ()` (which may trigger a re-download if the cache is corrupted).

---

## Summary: Marketplace Lifecycle

```
INSTALL:   policy check → download/clone → validate schema → check uniqueness → persist config
LOAD:      fast lookup (yyA) → slow load (NZ) → auto-repair if corrupted
REFRESH:   invalidate memo cache → git pull / HTTP GET → validate → update timestamp
REMOVE:    delete cache → remove from config → clean settings across all scopes → mark installs orphaned
```
