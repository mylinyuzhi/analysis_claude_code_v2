# Plugin Hooks System (Claude Code 2.1.38)

> Analysis of plugin hook extraction, how plugins register hooks during loading,
> LSP server loading from plugins, the plugin lifecycle (discovery, loading, hooks, execution),
> and the plugin permission model.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `loadPluginManifest` (Pn4) - Reads plugin manifest and discovers all components (commands, agents, skills, hooks, output styles)
- `loadPluginHooks` (Xn4) - Parses a hooks.json file and returns its hook configuration
- `mergeHooks` (Dn4) - Merges multiple hook configurations into one combined config
- `readManifestFile` (XG6) - Reads and validates a plugin.json manifest from disk
- `loadEnabledPlugins` (HxY) - Loads all enabled plugins from user settings and marketplaces
- `loadAllPluginHooks` (pa) - Memoized function that registers hooks from all enabled plugins into the global registry
- `extractPluginHooksForEvent` (oN9) - Converts a plugin's hooksConfig into the event-indexed format
- `registerPluginHooks` (O61) - Registers the extracted hooks into the global hook registry
- `setupPluginHookHotReload` (sN9) - Subscribes to policySettings changes to auto-reload hooks
- `clearPluginHookCache` (rO6) - Clears `pa` memoization and deregisters hooks
- `resetHotReloadState` (aN9) - Resets the hot-reload subscription guard
- `executeSessionStartHooks` ($yA) - Fires SessionStart hooks including plugin hooks
- `executePluginHooksForSession` (PP) - Loads plugin hooks then runs SessionStart hook event
- `executePluginHooksForSetup` (FW6) - Loads plugin hooks then runs Setup hook event
- `installMarketplaceSource` (wE) - Installs a marketplace source (validates enterprise policy, downloads, caches)
- `removeMarketplaceSource` (OG6) - Removes a marketplace and cleans up settings
- `refreshMarketplace` (St) - Refreshes a marketplace from its source
- `lookupPluginEntry` (a0) - Finds a specific plugin entry from marketplace data
- `fetchAndCacheMarketplace` (RyA) - Downloads/clones marketplace data and caches it locally

---

## Overview

Claude Code's plugin system allows third-party extensions to register:
- **Hooks** - Lifecycle callbacks that run before/after tool use, at session start, etc.
- **Commands** - Slash commands (e.g., `/my-plugin-command`)
- **Agents** - Custom agent definitions for the AgentTool
- **Skills** - Prompt-based capabilities activated by the user
- **Output Styles** - Custom rendering for tool output

Plugins are sourced from **marketplaces** (GitHub repos, URLs, local directories) and installed into the user's `~/.claude/plugins/` directory.

---

## Plugin Lifecycle

```
Discovery                Loading                  Hooks                Execution
─────────────────────────────────────────────────────────────────────────────────

 ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
 │ Settings scan │───▶│ Manifest     │───▶│ Hook         │───▶│ Hook fires   │
 │ (enabledPlugi│    │ validation   │    │ registration │    │ at event     │
 │  ns in config)│    │ (plugin.json)│    │ (hooks.json) │    │ (SessionStart│
 └──────────────┘    └──────┬───────┘    └──────────────┘    │  PreTool,    │
                            │                                │  PostTool...)│
 ┌──────────────┐    ┌──────▼───────┐                        └──────────────┘
 │ Marketplace  │───▶│ Component    │
 │ resolution   │    │ discovery    │
 │ (name@market)│    │ (commands,   │
 └──────────────┘    │  agents,     │
                     │  skills,     │
                     │  hooks,      │
                     │  outputStyles│
                     └──────────────┘
```

### Phase 1: Discovery

**Where plugins come from:**
- `enabledPlugins` in user/project/local settings (format: `"pluginName@marketplaceName": true/false`)
- Each `pluginName@marketplaceName` is resolved against installed marketplace sources
- Marketplace sources themselves are stored in `~/.claude/plugins/marketplaces.json`

**Marketplace source types:**
- `github` - GitHub repository (cloned via SSH or HTTPS)
- `git` - Generic git repository
- `url` - Direct URL to a marketplace JSON file
- `npm` - NPM package (not yet implemented)
- `file` - Local filesystem JSON file
- `directory` - Local directory with `.claude-plugin/marketplace.json`

### Phase 2: Loading

The core loading function is `loadPluginManifest` (Pn4):

```javascript
// ============================================
// loadPluginManifest - Load and validate a plugin from its directory
// Location: chunks.143.mjs:889-1105
// ============================================

// ORIGINAL (for source lookup):
function Pn4(A, q, K, Y, z = !0) {
    let w = b1(), H = [], $ = $9(A, ".claude-plugin", "plugin.json"),
        O = XG6($, Y, q),
        _ = { name: O.name, manifest: O, path: A, source: q, repository: q, enabled: K };
    // ... discovers commands, agents, skills, outputStyles, hooks ...
    let W = $9(A, "hooks", "hooks.json");
    if (w.existsSync(W)) try {
        M = Xn4(W, O.name);
        // ... dedup and merge ...
    }
    if (O.hooks) {
        let G = Array.isArray(O.hooks) ? O.hooks : [O.hooks];
        for (let f of G)
            if (typeof f === "string") {
                // ... load from file path ...
                let T = Xn4(Z, O.name);
                M = Dn4(M, T);
            } else if (typeof f === "object") M = Dn4(M, f)
    }
    if (M) _.hooksConfig = M;
    return { plugin: _, errors: H }
}

// READABLE (for understanding):
function loadPluginManifest(pluginDir, source, enabled, pluginName, warnDuplicates = true) {
    let fs = getFs(), errors = [];
    let manifestPath = join(pluginDir, ".claude-plugin", "plugin.json");
    let manifest = readManifestFile(manifestPath, pluginName, source);
    let plugin = { name: manifest.name, manifest, path: pluginDir, source, enabled };

    // Discover commands, agents, skills, outputStyles from manifest...
    // (each component type follows the same pattern:
    //   check manifest field → resolve paths → validate existence → attach to plugin)

    // Hook loading: standard location + manifest-declared
    let standardHooksPath = join(pluginDir, "hooks", "hooks.json");
    let mergedHooks;
    if (fs.existsSync(standardHooksPath)) {
        mergedHooks = loadPluginHooks(standardHooksPath, manifest.name);
    }
    if (manifest.hooks) {
        for (let hookRef of [].concat(manifest.hooks)) {
            if (typeof hookRef === "string") {
                let hookFilePath = join(pluginDir, hookRef);
                let fileHooks = loadPluginHooks(hookFilePath, manifest.name);
                mergedHooks = mergeHooks(mergedHooks, fileHooks);
            } else if (typeof hookRef === "object") {
                mergedHooks = mergeHooks(mergedHooks, hookRef);
            }
        }
    }
    if (mergedHooks) plugin.hooksConfig = mergedHooks;
    return { plugin, errors };
}

// Mapping: Pn4→loadPluginManifest, A→pluginDir, q→source, K→enabled, Y→pluginName,
//   z→warnDuplicates, b1→getFs, $9→join, XG6→readManifestFile, Xn4→loadPluginHooks,
//   Dn4→mergeHooks
```

### Phase 3: Hook Registration

**How hooks are extracted and registered:**

1. The standard location `hooks/hooks.json` is loaded automatically if it exists
2. Additional hook files declared in `manifest.hooks` are loaded and merged
3. Hooks can also be provided as inline objects in the manifest
4. Duplicate detection uses realpath comparison to avoid loading the same file twice
5. The merged hook config is stored on the plugin object as `hooksConfig`

```javascript
// ============================================
// loadPluginHooks - Parse hooks.json for a plugin
// Location: chunks.143.mjs:879-887
// ============================================

// ORIGINAL (for source lookup):
function Xn4(A, q) {
    let K = b1();
    if (!K.existsSync(A)) throw Error(`Hooks file not found at ${A} for plugin ${q}.`);
    let Y = K.readFileSync(A, { encoding: "utf-8" }), z = _A(Y);
    return cw8.parse(z).hooks
}

// READABLE (for understanding):
function loadPluginHooks(hooksFilePath, pluginName) {
    let fs = getFs();
    if (!fs.existsSync(hooksFilePath))
        throw Error(`Hooks file not found at ${hooksFilePath} for plugin ${pluginName}.`);
    let content = fs.readFileSync(hooksFilePath, { encoding: "utf-8" });
    let parsed = JSON.parse(content);
    return hooksConfigSchema.parse(parsed).hooks;
}

// Mapping: Xn4→loadPluginHooks, A→hooksFilePath, q→pluginName, cw8→hooksConfigSchema
```

```javascript
// ============================================
// mergeHooks - Combine multiple hook configurations
// Location: chunks.143.mjs:1107-1116
// ============================================

// ORIGINAL (for source lookup):
function Dn4(A, q) {
    if (!A) return q;
    let K = { ...A };
    for (let [Y, z] of Object.entries(q))
        if (!K[Y]) K[Y] = z;
        else K[Y] = [...K[Y] || [], ...z];
    return K
}

// READABLE (for understanding):
function mergeHooks(existingHooks, newHooks) {
    if (!existingHooks) return newHooks;
    let merged = { ...existingHooks };
    for (let [eventName, handlers] of Object.entries(newHooks))
        if (!merged[eventName]) merged[eventName] = handlers;
        else merged[eventName] = [...merged[eventName] || [], ...handlers];
    return merged;
}

// Mapping: Dn4→mergeHooks, A→existingHooks, q→newHooks
```

**Why this approach:**
- **Merge semantics**: Hooks from multiple sources (standard location + manifest-declared) are concatenated per event, not replaced. This means a plugin can define hooks in both `hooks/hooks.json` AND in additional hook files, and they will all execute.
- **Duplicate prevention via realpath**: Before loading a manifest-declared hooks file, the system checks if its realpath was already loaded. This prevents the common mistake of declaring `hooks/hooks.json` in the manifest when it is already loaded automatically.
- **Schema validation**: Hook configs are validated against `cw8` (hooksConfigSchema) using Zod, catching malformed hook definitions early.

### Phase 4: Execution

At session start, the system loads plugin hooks and fires the relevant event:

```javascript
// ============================================
// executePluginHooksForSession - Load hooks then fire SessionStart
// Location: chunks.142.mjs:248-289
// ============================================

// ORIGINAL (for source lookup):
async function PP(A, { sessionId: q, agentType: K, model: Y, forceSyncExecution: z } = {}) {
    let w = [], H = [];
    if (Ap()) h("Skipping plugin hooks - allowManagedHooksOnly is enabled");
    else try { await pa() }
    catch (O) {
        // Detailed error handling with network/permission/config diagnostics...
        h(`Warning: Failed to load plugin hooks. SessionStart hooks from plugins will not execute.`);
    }
    let $ = K ?? PN1();
    for await (let O of $yA(A, q, $, Y, void 0, void 0, z)) {
        if (O.message) w.push(O.message);
        if (O.additionalContexts?.length > 0) H.push(...O.additionalContexts)
    }
    if (H.length > 0) {
        let O = kq({ type: "hook_additional_context", content: H,
                      hookName: "SessionStart", toolUseID: "SessionStart",
                      hookEvent: "SessionStart" });
        w.push(O)
    }
    return w
}

// READABLE (for understanding):
async function executePluginHooksForSession(eventName, { sessionId, agentType, model, forceSyncExecution } = {}) {
    let messages = [], additionalContexts = [];

    // Guard: enterprise policy can disable plugin hooks entirely
    if (allowManagedHooksOnly()) {
        log("Skipping plugin hooks - allowManagedHooksOnly is enabled");
    } else {
        try { await loadAllPluginHooks(); }
        catch (err) {
            // Categorize error (network, permissions, config) and log warning
            // Plugin hooks are NON-FATAL: session continues without them
        }
    }

    let resolvedAgentType = agentType ?? getAgentType();
    for await (let result of executeSessionStartHooks(eventName, sessionId, resolvedAgentType, model, ...)) {
        if (result.message) messages.push(result.message);
        if (result.additionalContexts?.length > 0) additionalContexts.push(...result.additionalContexts);
    }

    if (additionalContexts.length > 0) {
        messages.push(createSystemMessage({
            type: "hook_additional_context",
            content: additionalContexts,
            hookEvent: "SessionStart"
        }));
    }
    return messages;
}

// Mapping: PP→executePluginHooksForSession, pa→loadAllPluginHooks, Ap→allowManagedHooksOnly,
//   $yA→executeSessionStartHooks, kq→createSystemMessage
```

**Key insight - Non-fatal loading:** Plugin hook loading failures are caught and logged as warnings, but the session proceeds. This is a deliberate design decision: a broken plugin should never prevent Claude Code from starting. The error messages are categorized into:
- Network issues (clone failure, timeout)
- Permission issues (EACCES, EPERM)
- Configuration issues (invalid JSON, schema errors)

Each category gets a specific diagnostic tip in the warning message.

---

## Deep Analysis: Marketplace and Enterprise Policy

### Enterprise Policy Enforcement

Before installing a marketplace, the system validates against enterprise policy:

```javascript
// ============================================
// installMarketplaceSource - Install with enterprise policy check
// Location: chunks.143.mjs:448-510
// ============================================

// ORIGINAL (for source lookup):
async function wE(A, q) {
    if (!Fq1(A)) {
        if (nb1(A)) throw Error(`Marketplace source '${o01(A)}' is blocked by enterprise policy.`);
        let H = mq1() || [], $ = Kb7(), O = vXA(A),
            _ = `Marketplace source '${o01(A)}'`;
        if (O) _ += ` (${O})`;
        _ += " is blocked by enterprise policy.";
        if (H.length > 0) _ += ` Allowed sources: ${H.map(J=>o01(J)).join(", ")}`;
        // ... GitHub Enterprise hint ...
        throw Error(_)
    }
    let { marketplace: K, cachePath: Y } = await RyA(A, q);
    // ... duplicate check, save config ...
}

// READABLE (for understanding):
async function installMarketplaceSource(source, progressCallback) {
    if (!isMarketplaceAllowed(source)) {
        if (isExplicitlyBlocked(source))
            throw Error(`Marketplace source blocked by enterprise policy.`);
        let allowedSources = getAllowedSources() || [];
        let blockedHosts = getBlockedHosts();
        let errorMsg = `Marketplace source blocked by enterprise policy.`;
        if (allowedSources.length > 0) errorMsg += ` Allowed: ${allowedSources.join(", ")}`;
        throw Error(errorMsg);
    }
    let { marketplace, cachePath } = await fetchAndCacheMarketplace(source, progressCallback);
    // Validate name uniqueness, save to config...
}

// Mapping: wE→installMarketplaceSource, Fq1→isMarketplaceAllowed, nb1→isExplicitlyBlocked,
//   mq1→getAllowedSources, RyA→fetchAndCacheMarketplace
```

**Enterprise policy layers:**
1. `isMarketplaceAllowed()` - Checks if the source matches any allowed source pattern
2. `isExplicitlyBlocked()` - Checks if the source is on an explicit block list
3. `getAllowedSources()` - Returns the list of permitted marketplace sources
4. `getBlockedHosts()` - Returns blocked GitHub Enterprise hosts

**Why this layered approach:** Enterprise environments need to control which plugins their developers can install. The two-layer check (allow list + block list) provides flexibility:
- A company can whitelist specific internal marketplaces
- They can block all external sources by having an empty allow list
- GitHub Enterprise users get a helpful hint about using full URLs instead of shorthand

---

## Plugin Hook Sources and Priority

When hooks are loaded from multiple sources, the system assigns a `source` field to each:

| Source | Description | Removable? |
|--------|-------------|------------|
| `"pluginHook"` | Loaded from a plugin's hooks.json | No (disable plugin instead) |
| `"userSettings"` | From ~/.claude/settings.json | Yes |
| `"projectSettings"` | From .claude/settings.json in project | Yes |
| `"localSettings"` | From .claude/settings.local.json | Yes |

Plugin hooks (`source: "pluginHook"`) are treated as read-only in the hooks management UI. Users cannot individually remove them; they must disable the entire plugin. This prevents partial plugin state.

Priority ordering (from `chunks.75.mjs`):
```javascript
// pluginHook source has priority 999 (lowest), runs last
(j) => j === "pluginHook" ? 999 : normalPriority[j]
```

**Key insight:** Plugin hooks run AFTER all user-configured hooks. This ensures user hooks can override or preempt plugin behavior, maintaining user control.

---

## Phase 3b: Global Hook Registration (`pa`, `oN9`, `O61`)

The `pa` (loadAllPluginHooks) function is the bridge between plugin-level hooks and the global hook registry:

```javascript
// ============================================
// loadAllPluginHooks (pa) - Memoized hook registration from all enabled plugins
// Location: chunks.87.mjs:2606-2635 (pu1 module initialization)
// ============================================

// ORIGINAL:
pa = KA(async () => {  // KA = memoize
    let { enabled: A } = await iY(),  // Get all enabled plugins
        q = {
            PreToolUse: [], PostToolUse: [], PostToolUseFailure: [],
            Notification: [], UserPromptSubmit: [], SessionStart: [],
            SessionEnd: [], Stop: [], SubagentStart: [], SubagentStop: [],
            PreCompact: [], PermissionRequest: [], Setup: [],
            TeammateIdle: [], TaskCompleted: []
        };
    for (let Y of A) {
        if (!Y.hooksConfig) continue;
        let z = oN9(Y);    // Extract hooks indexed by event type
        for (let w of Object.keys(z)) q[w].push(...z[w])
    }
    O61(q);  // Register into global hook registry
    let K = Object.values(q).reduce((Y, z) => Y + z.reduce((w, H) => w + H.hooks.length, 0), 0);
    h(`Registered ${K} hooks from ${A.length} plugins`)
});

// READABLE:
loadAllPluginHooks = memoize(async () => {
    let { enabled: enabledPlugins } = await getLoadedPlugins();

    // Initialize empty event queues for all 15 hook events
    let eventQueues = {
        PreToolUse: [], PostToolUse: [], PostToolUseFailure: [],
        Notification: [], UserPromptSubmit: [], SessionStart: [],
        SessionEnd: [], Stop: [], SubagentStart: [], SubagentStop: [],
        PreCompact: [], PermissionRequest: [], Setup: [],
        TeammateIdle: [], TaskCompleted: []
    };

    // For each enabled plugin with hooks configured:
    for (let plugin of enabledPlugins) {
        if (!plugin.hooksConfig) continue;
        let pluginHooks = extractPluginHooksForEvent(plugin);  // oN9
        for (let eventName of Object.keys(pluginHooks))
            eventQueues[eventName].push(...pluginHooks[eventName]);
    }

    // Register all collected hooks into the global registry
    registerPluginHooks(eventQueues);  // O61

    let totalCount = Object.values(eventQueues)
        .reduce((sum, matchers) => sum + matchers.reduce((s, m) => s + m.hooks.length, 0), 0);
    log(`Registered ${totalCount} hooks from ${enabledPlugins.length} plugins`);
});

// Mapping: pa→loadAllPluginHooks, iY→getLoadedPlugins, oN9→extractPluginHooksForEvent,
//   O61→registerPluginHooks, KA→memoize
```

**Key design: 15-event initialization**
The function initializes ALL 15 event types even before knowing which plugins have hooks. This ensures the registry always has arrays (not undefined) for all events, preventing null-check overhead in the event dispatch path.

**Memoization semantics:** `pa` is memoized with `KA` (likely a simple cache). Once called, subsequent calls return immediately. The cache is invalidated by `rO6` (clearPluginHookCache).

---

## Hot Reload: Policy-Driven Refresh (`sN9`, `aN9`, `rO6`)

The system supports hot-reloading plugin hooks when enterprise policy settings change:

```javascript
// ============================================
// setupPluginHookHotReload (sN9) - Subscribe to policy changes for hook reload
// Location: chunks.87.mjs:2589-2593
// ============================================

// ORIGINAL:
function sN9() {
    if (g0A) return;  // Guard: only subscribe once
    g0A = true;
    zX.subscribe((A) => {  // zX = settings change observable
        if (A === "policySettings") {
            h("Plugin hooks: reloading due to policySettings change");
            Sv();    // clearPluginsCache() - invalidate plugin list
            rO6();   // clearPluginHookCache() - invalidate hook registration
            pa();    // Reload plugins + re-register hooks
        }
    });
}

// READABLE:
function setupPluginHookHotReload() {
    if (hotReloadAlreadySetup) return;  // g0A = hot reload guard
    hotReloadAlreadySetup = true;
    settingsChangeObservable.subscribe((changedSettingName) => {
        if (changedSettingName === "policySettings") {
            log("Plugin hooks: reloading due to policySettings change");
            clearPluginsCache();       // Invalidate plugin list memoization
            clearPluginHookCache();    // Invalidate hook registration memoization
            loadAllPluginHooks();      // Re-load and re-register
        }
    });
}

// ============================================
// clearPluginHookCache (rO6) - Invalidate hook registration
// Location: chunks.87.mjs:2581-2583
// ============================================

// ORIGINAL:
function rO6() {
    pa.cache?.clear?.();  // Clear memoization cache
    YR6();                // Deregister all plugin hooks from global registry
}
```

**Why trigger on `policySettings` specifically:**
- `allowManagedHooksOnly` lives in `policySettings`
- When an MDM profile changes this flag, hooks need to reload immediately
- Other settings changes (userSettings, projectSettings) don't affect which hooks can execute
- This is a live policy enforcement mechanism, not just developer iteration

**The `g0A` guard (`hotReloadAlreadySetup`):**
Prevents double-subscription if `setupPluginHookHotReload` is called multiple times during initialization. Without this, each call would add another subscriber, causing hooks to reload multiple times per policy change.

**The reload sequence (all 3 steps required):**
```
1. Sv()  = clearPluginsCache    → Force plugin list to be reloaded next time
2. rO6() = clearPluginHookCache → Deregister current hooks + clear pa memo
3. pa()  = loadAllPluginHooks   → Re-load plugin list, re-extract hooks, re-register
```

---

## Startup Integration (chunks.177.mjs:2536)

The `loadPluginHooks` and `setupPluginHookHotReload` calls happen during UI setup in the REPL:

```javascript
// After session setup jobs launch, before prefetch:
Promise.resolve().then(() => (pu1(), IU7))  // Lazy-load the pu1 module (contains pa, sN9)
    .then((D) => {
        D.loadPluginHooks();          // pa() - start hook registration
        D.setupPluginHookHotReload(); // sN9() - start watching for policy changes
    });
```

**Why deferred with Promise.resolve():**
Plugin hook loading involves disk I/O and potentially git operations (if marketplaces need refresh). Deferring it avoids blocking the main UI initialization path. The session becomes interactive immediately; hook registration completes asynchronously. If hooks aren't registered before the first tool use, they simply won't run for that invocation (hooks fire asynchronously anyway).

---

## Marketplace Source Resolution

### fetchAndCacheMarketplace (RyA)

**What it does:** Downloads/clones a marketplace from its source and caches it locally.

**How it works (by source type):**

1. **GitHub**:
   - Tries SSH clone first if SSH is configured
   - Falls back to HTTPS on failure
   - Reads marketplace.json from `{repo}/.claude-plugin/marketplace.json`

2. **Git**: Clone and read from specified path

3. **URL**: Direct HTTP GET, validates response against marketplace schema

4. **File**: Reads directly from local path

5. **Directory**: Reads from `{dir}/.claude-plugin/marketplace.json`

**Cache management:**
- Downloaded marketplaces are cached in `~/.claude/plugins/{marketplaceName}/`
- On successful download, the temp directory is renamed to the final cache path
- Failed downloads clean up their temp directories
- A `marketplaces.json` config file tracks all installed sources

**Why git clone fallback?** The SSH-then-HTTPS (or HTTPS-then-SSH) fallback ensures maximum compatibility. Some users have SSH configured but with expired keys; others are behind corporate proxies that block SSH. The bidirectional fallback handles both cases transparently.

---

## Plugin Component Discovery

The `loadPluginManifest` function discovers components in a specific order:

1. **Commands**: `manifest.commands` or `{pluginDir}/commands/` directory
2. **Agents**: `manifest.agents` or `{pluginDir}/agents/` directory
3. **Skills**: `manifest.skills` or `{pluginDir}/skills/` directory
4. **Output Styles**: `manifest.outputStyles` or `{pluginDir}/output-styles/` directory
5. **Hooks**: `hooks/hooks.json` (standard) + `manifest.hooks` (additional)

For each component type, the discovery follows the same pattern:
- Check if the manifest explicitly declares the component
- If yes, resolve paths relative to the plugin directory
- Validate that all referenced files exist
- If any file is missing, log a warning and record an error (but continue loading other components)
- If the manifest does not declare it, check the standard directory location

**Error recording:** Missing component files are tracked in an `errors` array with structured error objects:
```javascript
{ type: "path-not-found", source, plugin, path, component }
{ type: "hook-load-failed", source, plugin, hookPath, reason }
```

These errors are surfaced in diagnostic commands but do not prevent the plugin from loading its other components.

---

## Summary of Design Decisions

| Decision | Rationale |
|----------|-----------|
| Non-fatal hook loading | A broken plugin should never prevent session start |
| Enterprise policy enforcement | Corporate environments need control over plugin sources |
| SSH/HTTPS fallback | Maximum compatibility across network configurations |
| Plugin hooks run last (priority 999) | User hooks take precedence over plugin hooks |
| Read-only plugin hooks in UI | Prevents partial plugin state; disable the whole plugin instead |
| Realpath deduplication | Prevents loading the same hooks file twice from different paths |
| Schema validation (Zod) | Catches malformed configs early with clear error messages |
| Hot reload support | Developer experience; iterate on hooks without restart |
| Categorized error messages | Actionable diagnostics (network vs. permissions vs. config) |
