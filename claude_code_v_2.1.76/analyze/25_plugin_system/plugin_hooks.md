# Plugin Hooks System (Claude Code 2.1.76)

> Analysis of plugin hook extraction, how plugins register hooks during loading,
> LSP server loading from plugins, the plugin lifecycle (discovery, loading, hooks, execution),
> and the plugin permission model.

**v2.1.76 Changes:**
- `WorktreeCreate` and `WorktreeRemove` events added to the hook event initialization list (previously silently ignored)
- LSP plugin registration race condition fixed: plugins now properly register when LSP Manager is initialized before marketplaces are reconciled
- Hook event count increased from 17 to 21 events

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `loadPluginManifest` (h24) - Reads plugin manifest and discovers all components (commands, agents, skills, hooks, output styles)
- `loadPluginHooks` (N24) - Parses a hooks.json file and returns its hook configuration
- `loadAllPluginHooks` (nB) - Memoized function that registers hooks from all enabled plugins into the global registry
- `extractPluginHooksForEvent` (nF9) - Converts a plugin's hooksConfig into the event-indexed format
- `clearPluginHookCache` (d01) - Clears nB memoization and deregisters hooks
- `setupPluginHookHotReload` (oF9) - Subscribes to policySettings changes to auto-reload hooks
- `executePluginHooksForSession` (JN1) - Loads plugin hooks then runs SessionStart hook event
- `executePluginHooksForSetup` (oN1) - Loads plugin hooks then runs Setup hook event
- `allowManagedHooksOnly` (l1z) - Enterprise policy check for disabling plugin hooks

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

**Marketplace source types (v2.1.76):**
- `github` - GitHub repository (cloned via SSH or HTTPS)
- `git` - Generic git repository
- `git-subdir` - Clone only a specific subdirectory of a git repository [NEW in v2.1.76]
- `url` - Direct URL to a marketplace JSON file
- `npm` - NPM package (not yet implemented)
- `file` - Local filesystem JSON file
- `directory` - Local directory with `.claude-plugin/marketplace.json`

### Phase 2: Loading

The core loading function is `loadPluginManifest` (h24):

```javascript
// ============================================
// loadPluginManifest - Load and validate a plugin from its directory
// Location: chunks.95.mjs:176-240
// ============================================

// ORIGINAL (for source lookup):
async function h24(A, q, K, Y, z = !0) {
    let _ = [],
        w = r3(A, ".claude-plugin", "plugin.json"),
        O = await $W1(w, Y, q),
        $ = {
            name: O.name,
            manifest: O,
            path: A,
            source: q,
            repository: q,
            enabled: K
        };
    // ... discovers commands, agents, skills, outputStyles, hooks ...
    let W = r3(A, "hooks", "hooks.json");
    if (await uK(W)) try {
        let M = await N24(W, O.name);
        // ... dedup and merge ...
    }
    if (O.hooks) {
        // Process manifest-declared hooks...
    }
    if (M) $.hooksConfig = M;
    return { plugin: $, errors: _ }
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

// Mapping: h24→loadPluginManifest, A→pluginDir, q→source, K→enabled, Y→pluginName,
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
// Location: chunks.95.mjs:138-145
// ============================================

// ORIGINAL (for source lookup):
async function N24(A, q) {
    if (!await uK(A)) throw Error(`Hooks file not found at ${A} for plugin ${q}.`);
    let K = await AQ6(A, { encoding: "utf-8" }),
        Y = i1(K);
    return B57().parse(Y).hooks
}

// READABLE (for understanding):
async function loadPluginHooks(hooksFilePath, pluginName) {
    if (!await fileExists(hooksFilePath))
        throw Error(`Hooks file not found at ${hooksFilePath} for plugin ${pluginName}.`);
    let content = await readFile(hooksFilePath, { encoding: "utf-8" });
    let parsed = JSON.parse(content);
    return hooksConfigSchema.parse(parsed).hooks;
}

// Mapping: N24→loadPluginHooks, A→hooksFilePath, q→pluginName, B57→hooksConfigSchema,
//   uK→fileExists, AQ6→readFile, i1→JSON.parse
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
// Location: chunks.135.mjs:1836-1880
// ============================================

// ORIGINAL (for source lookup):
async function JN1(A, { sessionId: q, agentType: K, model: Y, forceSyncExecution: z } = {}) {
    let _ = [], w = [];
    if (GL()) k("Skipping plugin hooks - allowManagedHooksOnly is enabled");
    else try {
        await nB()  // loadAllPluginHooks
    } catch ($) { /* error categorization and handling */ }
    let O = K ?? Pp();
    for await (let $ of Qu8(A, q, O, Y, void 0, void 0, z)) {
        if ($.message) _.push($.message);
        if ($.additionalContexts?.length > 0) w.push(...$.additionalContexts)
    }
    // ... additional context handling ...
    return _
}

// READABLE (for understanding):
async function executePluginHooksForSession(eventName, { sessionId, agentType, model, forceSyncExecution } = {}) {
    let messages = [], additionalContexts = [];

    // Guard: enterprise policy can disable plugin hooks entirely
    if (allowManagedHooksOnly()) {
        log("Skipping plugin hooks - allowManagedHooksOnly is enabled");
    } else {
        try { await loadAllPluginHooks(); }
        catch (err) { /* categorize: network, permissions, config issues */ }
    }

    let resolvedAgentType = agentType ?? getAgentType();
    for await (let result of executeSessionStartHooks(eventName, sessionId, resolvedAgentType, model, ...)) {
        if (result.message) messages.push(result.message);
        if (result.additionalContexts?.length > 0) additionalContexts.push(...result.additionalContexts);
    }
    return messages;
}

// Mapping: JN1→executePluginHooksForSession, GL→allowManagedHooksOnly, nB→loadAllPluginHooks,
//   Qu8→executeSessionStartHooks, Pp→getAgentType
```
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
// installMarketplaceSource - Install with enterprise policy gate
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

## Phase 3b: Global Hook Registration (`nB`, `nF9`, `KA6`)

The `nB` (loadAllPluginHooks) function is the bridge between plugin-level hooks and the global hook registry:

```javascript
// ============================================
// loadAllPluginHooks (nB) - Memoized hook registration from all enabled plugins
// Location: chunks.94.mjs:824-870
// ============================================

// ORIGINAL:
nB = e1(async () => {  // e1 = memoize
    let { enabled: A } = await _z(),  // Get all enabled plugins
        q = {
            PreToolUse: [], PostToolUse: [], PostToolUseFailure: [],
            Notification: [], UserPromptSubmit: [], SessionStart: [],
            SessionEnd: [], Stop: [], SubagentStart: [], SubagentStop: [],
            PreCompact: [], PostCompact: [], PermissionRequest: [], Setup: [],
            TeammateIdle: [], TaskCompleted: [],
            Elicitation: [], ElicitationResult: [], ConfigChange: [],
            WorktreeCreate: [], WorktreeRemove: [], InstructionsLoaded: []  // 21 events in v2.1.76
        };
    for (let Y of A) {
        if (!Y.hooksConfig) continue;
        let z = nF9(Y);    // Extract hooks indexed by event type
        for (let w of Object.keys(z)) q[w].push(...z[w])
    }
    lu1(), KA6(q);  // Deregister old, register new hooks
    let K = Object.values(q).reduce((Y, z) => Y + z.reduce((w, H) => w + H.hooks.length, 0), 0);
    k(`Registered ${K} hooks from ${A.length} plugins`)
});

// READABLE:
loadAllPluginHooks = memoize(async () => {
    let { enabled: enabledPlugins } = await getLoadedPlugins();

    // Initialize empty event queues for all 21 hook events (v2.1.76)
    let eventQueues = {
        PreToolUse: [], PostToolUse: [], PostToolUseFailure: [],
        Notification: [], UserPromptSubmit: [], SessionStart: [],
        SessionEnd: [], Stop: [], SubagentStart: [], SubagentStop: [],
        PreCompact: [], PostCompact: [], PermissionRequest: [], Setup: [],
        TeammateIdle: [], TaskCompleted: [],
        Elicitation: [], ElicitationResult: [], ConfigChange: [],
        WorktreeCreate: [], WorktreeRemove: [], InstructionsLoaded: []
    };

    // For each enabled plugin with hooks configured:
    for (let plugin of enabledPlugins) {
        if (!plugin.hooksConfig) continue;
        let pluginHooks = extractPluginHooksForEvent(plugin);  // nF9
        for (let eventName of Object.keys(pluginHooks))
            eventQueues[eventName].push(...pluginHooks[eventName]);
    }

    // Register all collected hooks into the global registry
    deregisterPluginHooks();  // lu1
    registerPluginHooks(eventQueues);  // KA6

    let totalCount = Object.values(eventQueues)
        .reduce((sum, matchers) => sum + matchers.reduce((s, m) => s + m.hooks.length, 0), 0);
    log(`Registered ${totalCount} hooks from ${enabledPlugins.length} plugins`);
});

// Mapping: nB→loadAllPluginHooks, _z→getLoadedPlugins, nF9→extractPluginHooksForEvent,
//   KA6→registerPluginHooks, lu1→deregisterPluginHooks, e1→memoize
```

**Key design: 21-event initialization (v2.1.76)**
The function initializes ALL event types including `WorktreeCreate`, `WorktreeRemove`, `PostCompact`, `Elicitation`, `ElicitationResult`, `ConfigChange`, and `InstructionsLoaded` even before knowing which plugins have hooks. In v2.1.38, only 17 events were initialized. In v2.1.76, all 21 events are properly initialized so plugins can register handlers for these lifecycle events.

**Memoization semantics:** `nB` is memoized with `e1` (memoize function). Once called, subsequent calls return immediately. The cache is invalidated by `d01` (clearPluginHookCache).

---

## Hot Reload: Policy-Driven Refresh (`oF9`, `rF9`, `d01`)

The system supports hot-reloading plugin hooks when enterprise policy settings change:

```javascript
// ============================================
// setupPluginHookHotReload (oF9) - Subscribe to policy changes for hook reload
// Location: chunks.94.mjs:806-818
// ============================================

// ORIGINAL:
function oF9() {
    if (Sk8) return;  // Guard: only subscribe once
    Sk8 = true;
    tO.subscribe((A) => {  // tO = settings change observable
        if (A === "policySettings") {
            let q = F_4();  // Get current enabledPlugins hash
            if (q === U01) {
                k("Plugin hooks: skipping reload, enabledPlugins unchanged");
                return
            }
            U01 = q;
            k("Plugin hooks: reloading due to enabledPlugins change");
            XZ("loadPluginHooks: enabledPlugins settings changed");
            d01();   // clearPluginHookCache() - invalidate hook registration
            nB();    // Reload plugins + re-register hooks
        }
    });
}

// READABLE:
function setupPluginHookHotReload() {
    if (hotReloadAlreadySetup) return;
    hotReloadAlreadySetup = true;
    settingsChangeObservable.subscribe((changedSettingName) => {
        if (changedSettingName === "policySettings") {
            let currentHash = getEnabledPluginsHash();
            if (currentHash === lastSeenHash) {
                log("Plugin hooks: skipping reload, enabledPlugins unchanged");
                return;
            }
            lastSeenHash = currentHash;
            log("Plugin hooks: reloading due to enabledPlugins change");
            clearPluginHookCache();
            loadAllPluginHooks();
        }
    });
}

// ============================================
// clearPluginHookCache (d01) - Invalidate hook registration
// Location: chunks.94.mjs:792-794
// ============================================

// ORIGINAL:
function d01() {
    nB.cache?.clear?.();  // Clear memoization cache
    lu1();                // Deregister all plugin hooks from global registry
}
```

**Why trigger on `policySettings` specifically:**
- `allowManagedHooksOnly` lives in `policySettings`
- When an MDM profile changes this flag, hooks need to reload immediately
- The system also checks if `enabledPlugins` actually changed to avoid unnecessary reloads
- This is a live policy enforcement mechanism, not just developer iteration

**The `Sk8` guard (`hotReloadAlreadySetup`):**
Prevents double-subscription if `setupPluginHookHotReload` is called multiple times during initialization. Without this, each call would add another subscriber, causing hooks to reload multiple times per policy change.

**The reload sequence (all steps required):**
```
1. F_4() = getEnabledPluginsHash → Check if enabledPlugins actually changed
2. d01() = clearPluginHookCache  → Deregister current hooks + clear nB memo
3. nB()  = loadAllPluginHooks    → Re-load plugin list, re-extract hooks, re-register
```

---

## LSP Plugin Registration Fix (v2.1.76)

In v2.1.38, there was a race condition: if the LSP Manager was initialized before the marketplace reconciliation completed, plugins that provide LSP server configurations would fail to register. In v2.1.76, this is fixed by ensuring LSP plugin registration occurs after the LSP Manager is ready, regardless of initialization order.

**Practical impact:** Plugins providing language server configurations (via `.lsp.json`) now reliably register in all startup sequences, including fast restarts where the LSP Manager may be initialized before marketplace data is available.

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

3. **Git-subdir** (v2.1.76): Clone a specific subdirectory of a git repository — avoids cloning the full repo when the marketplace data is in a subdirectory of a larger monorepo

4. **URL**: Direct HTTP GET, validates response against marketplace schema

5. **File**: Reads directly from local path

6. **Directory**: Reads from `{dir}/.claude-plugin/marketplace.json`

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
| WorktreeCreate/Remove events (v2.1.76) | Plugins can now respond to worktree lifecycle events |
| LSP registration race fix (v2.1.76) | LSP plugins register reliably regardless of init order |

---

## Deep Analysis: Hook Merging Strategy

### Hook Concatenation vs Replacement

The `mergeHooks` (k24) function implements a **concatenation** strategy rather than replacement:

```javascript
// ============================================
// mergeHooks - Concatenate hooks from multiple sources
// Location: chunks.95.mjs:430-438
// ============================================

// ORIGINAL (for source lookup):
function k24(A, q) {
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
    for (let [eventName, handlers] of Object.entries(newHooks)) {
        if (!merged[eventName]) merged[eventName] = handlers;
        else merged[eventName] = [...merged[eventName] || [], ...handlers];
    }
    return merged;
}

// Mapping: k24→mergeHooks, A→existingHooks, q→newHooks, K→merged
```

**Why concatenation instead of replacement:**

1. **Multiple hook sources**: A plugin can have both `hooks/hooks.json` AND manifest-declared hooks. Concatenation preserves all hooks from all sources.

2. **Plugin composition**: If multiple plugins register hooks for the same event, all hooks execute. No plugin can "override" another's hooks.

3. **Deterministic order**: Hooks execute in registration order (plugin A's hooks, then plugin B's hooks), making behavior predictable.

**Alternative considered:** Replacement semantics would allow a plugin to "shadow" hooks from other sources, but this would create hidden dependencies and make debugging difficult.

### Realpath Deduplication

Before loading a manifest-declared hooks file, the system checks if its **realpath** was already loaded:

```javascript
// In loadPluginManifest (h24):
let w = await d1(H),  // Get realpath of hooks.json (standard location)
    H = new Set;
// For manifest-declared hooks:
for (let f of G)
    if (typeof f === "string") {
        let Z = $9(A, f),  // Resolve relative path
            T = await d1(Z);  // Get realpath
        if (H.has(T)) continue;  // Skip if already loaded (via realpath check)
        H.add(T);
        // Load the hook file...
    }
```

**Why realpath instead of path:**
- Symlinks can create multiple paths pointing to the same file
- `path.resolve` doesn't resolve symlinks; `fs.realpath` does
- Prevents the common mistake of declaring `hooks/hooks.json` in manifest when it's already loaded automatically

### Error Categorization for Diagnostics

The system categorizes hook loading errors into specific types for actionable diagnostics:

```javascript
// Error types for hook loading:
type HookLoadError =
  | { type: "path-not-found"; hookPath: string; plugin: string }
  | { type: "hook-parse-error"; hookPath: string; reason: string }
  | { type: "hook-schema-validation"; hookPath: string; errors: string[] }
  | { type: "hook-permission-denied"; hookPath: string }
  ;

// The serializePluginError (sM) function formats these for display:
function serializePluginError(error) {
    switch (error.type) {
        case "path-not-found":
            return `Hook file not found: ${error.hookPath}. Check if the file exists.`;
        case "hook-parse-error":
            return `Invalid JSON in ${error.hookPath}: ${error.reason}`;
        case "hook-schema-validation":
            return `Schema validation failed: ${error.errors.join(", ")}`;
        // ...
    }
}
```

**Diagnostic tips by error category:**

| Error Type | Diagnostic Tip |
|------------|---------------|
| Network/clone failure | Check internet connection and git credentials |
| Permission denied (EACCES) | Check file permissions on plugin directory |
| Invalid JSON | Validate JSON syntax with a linter |
| Schema validation | Check hooks.json against the schema |
| Plugin not found | Run `/plugin list` to see installed plugins |

---

## Deep Analysis: Hot Reload Mechanism

### Observable Subscription Pattern

The hot reload system uses an observable pattern to detect policy changes:

```javascript
// ============================================
// setupPluginHookHotReload - Subscribe to settings changes
// Location: chunks.94.mjs:806-818
// ============================================

// The settings observable (tO) notifies subscribers when settings change:
tO.subscribe((changedSettingName) => {
    if (changedSettingName === "policySettings") {
        // Check if enabledPlugins actually changed
        let currentHash = getEnabledPluginsHash();
        if (currentHash === lastSeenHash) return;  // No change, skip reload
        lastSeenHash = currentHash;

        // Clear cache and reload
        clearPluginHookCache();
        loadAllPluginHooks();
    }
});
```

### Hash-Based Change Detection

The `getEnabledPluginsHash` (F_4) function creates a hash of the current `enabledPlugins` state:

```javascript
// ============================================
// getEnabledPluginsHash - Create hash for change detection
// Location: chunks.94.mjs:800-804
// ============================================

function F_4() {
    let A = C8().enabledPlugins || {};  // Get current enabled plugins
    return JSON.stringify(Object.keys(A).sort());  // Sorted keys for stable hash
}
```

**Why hash comparison instead of deep equality:**
- String comparison is O(n) where n is the number of plugins
- Deep equality would be O(n*m) for nested objects
- Hash is stable across reloads (sorted keys)
- Avoids unnecessary reloads when only other settings change

### The Three-Step Reload Sequence

When policy changes, the reload follows a strict sequence:

```
1. getEnabledPluginsHash() → Check if enabledPlugins changed
   └─ If hash unchanged: SKIP (no reload needed)

2. clearPluginHookCache() → Deregister current hooks
   ├─ nB.cache?.clear?.()  → Clear memoization cache
   └─ lu1()                → Deregister from global registry

3. loadAllPluginHooks() → Re-register hooks
   ├─ Get enabled plugins
   ├─ Extract hooks per plugin
   └─ Register into global registry
```

**Why this order matters:**
- Step 1 prevents unnecessary work (most policy changes don't affect plugins)
- Step 2 must complete before Step 3 (or stale hooks persist)
- Step 3 rebuilds the registry from scratch (not incremental)

---

## Deep Analysis: 21 Hook Events (v2.1.76)

The plugin hook system supports 21 lifecycle events in v2.1.76. Each event provides a specific hook point for plugins to intercept or react to system behavior.

### Complete Hook Events Table

| # | Event Name | When Fired | Can Block? | Payload Fields |
|---|------------|------------|------------|----------------|
| 1 | `PreToolUse` | Before any tool execution | **Yes** | `toolName`, `toolInput`, `conversationId` |
| 2 | `PostToolUse` | After successful tool execution | No | `toolName`, `toolInput`, `toolResult`, `conversationId` |
| 3 | `PostToolUseFailure` | After failed tool execution | No | `toolName`, `toolInput`, `error`, `conversationId` |
| 4 | `Notification` | When notification is displayed | No | `notification`, `level`, `conversationId` |
| 5 | `UserPromptSubmit` | When user submits input | **Yes** | `prompt`, `conversationId` |
| 6 | `SessionStart` | When session begins | No | `sessionId`, `agentType`, `model` |
| 7 | `SessionEnd` | When session ends | No | `sessionId`, `reason` |
| 8 | `Stop` | When user requests stop | No | `sessionId`, `reason` |
| 9 | `SubagentStart` | When subagent spawns | No | `subagentId`, `agentType`, `parentAgentId` |
| 10 | `SubagentStop` | When subagent completes | No | `subagentId`, `result`, `duration` |
| 11 | `PreCompact` | Before context compaction | No | `messageCount`, `currentTokens` |
| 12 | `PostCompact` | After context compaction | No | `messageCount`, `newTokens`, `tokensSaved` |
| 13 | `PermissionRequest` | When permission is requested | No | `permission`, `resource`, `conversationId` |
| 14 | `Setup` | After SessionStart (for setup tasks) | No | `sessionId`, `agentType` |
| 15 | `TeammateIdle` | When teammate has no work | No | `teammateId`, `teamName` |
| 16 | `TaskCompleted` | When task finishes | No | `taskId`, `result`, `conversationId` |
| 17 | `Elicitation` | MCP elicitation request | No | `requestId`, `message`, `options` |
| 18 | `ElicitationResult` | MCP elicitation response | No | `requestId`, `response`, `selectedOption` |
| 19 | `ConfigChange` | When settings change | No | `changedKey`, `oldValue`, `newValue` |
| 20 | `WorktreeCreate` | When git worktree is created | No | `worktreePath`, `branch`, `conversationId` |
| 21 | `InstructionsLoaded` | When CLAUDE.md files are loaded | No | `files`, `conversationId` |

### Blocking vs Non-Blocking Events

**Blocking events** (can prevent the action):
- `PreToolUse` - Return `{ block: true, reason: "..." }` to prevent tool execution
- `UserPromptSubmit` - Return `{ block: true, reason: "..." }` to prevent prompt submission

**Non-blocking events**:
- All other events are informational only
- Hook handlers receive the event payload but cannot prevent the action
- Useful for logging, telemetry, side effects

### Hook Event Categories

**Tool Lifecycle:**
- `PreToolUse` → Tool executes → `PostToolUse` (success) OR `PostToolUseFailure` (error)

**Session Lifecycle:**
- `SessionStart` → `Setup` → [normal operation] → `Stop` → `SessionEnd`

**Subagent Lifecycle:**
- `SubagentStart` → [subagent runs] → `SubagentStop`

**Context Management:**
- `PreCompact` → [compaction happens] → `PostCompact`

**MCP Elicitation:**
- `Elicitation` → [user responds] → `ElicitationResult`

### Hook Priority System

Plugin hooks run at **priority 999** (lowest priority, runs last):

```javascript
// Priority assignment:
(source) => source === "pluginHook" ? 999 : normalPriority[source]

// Execution order:
// 1. System hooks (built-in)      - priority 1-10
// 2. User hooks (settings.json)   - priority 10-100
// 3. Plugin hooks                 - priority 999 (last)
```

**Why plugin hooks run last:**
1. User hooks can preempt or override plugin behavior
2. Plugins cannot interfere with critical system hooks
3. User maintains control over their environment
4. Enterprise policy (`allowManagedHooksOnly`) can disable all plugin hooks

### extractPluginHooksForEvent Implementation

The `nF9` function converts a plugin's `hooksConfig` into the event-indexed format:

```javascript
// ============================================
// extractPluginHooksForEvent - Convert hooksConfig to event-indexed format
// Location: chunks.94.mjs:751-790
// ============================================

// ORIGINAL (for source lookup):
function nF9(A) {
    let q = A.hooksConfig;
    if (!q) return {};
    let K = {};
    for (let [Y, z] of Object.entries(q)) {
        // Y = event name, z = array of hook matchers
        if (!K[Y]) K[Y] = [];
        for (let w of z) {
            // Convert each hook config to registry format
            K[Y].push({
                hooks: w.hooks,           // Array of hook handler objects
                matcher: w.matcher,       // Tool name matcher (for PreToolUse/PostToolUse)
                source: "pluginHook",     // Marker for priority assignment
                pluginName: A.name        // Attribution
            });
        }
    }
    return K;
}

// READABLE (for understanding):
function extractPluginHooksForEvent(plugin) {
    let hooksConfig = plugin.hooksConfig;
    if (!hooksConfig) return {};

    let eventIndexed = {};
    for (let [eventName, matchers] of Object.entries(hooksConfig)) {
        if (!eventIndexed[eventName]) eventIndexed[eventName] = [];

        for (let matcher of matchers) {
            eventIndexed[eventName].push({
                hooks: matcher.hooks,       // The actual hook handler configs
                matcher: matcher.matcher,   // For filtering (e.g., tool name match)
                source: "pluginHook",       // Priority marker
                pluginName: plugin.name     // For attribution/debugging
            });
        }
    }
    return eventIndexed;
}

// Mapping: nF9→extractPluginHooksForEvent, A→plugin, q→hooksConfig,
//   K→eventIndexed, Y→eventName, z→matchers, w→matcher
```

**How hooks are matched:**

For `PreToolUse` and `PostToolUse` events, hooks can specify a `matcher` to filter which tools they apply to:

```javascript
// Hook with matcher (only triggers for Bash tool)
{
    "hooks": [{ "type": "command", "command": "echo 'Bash executed'" }],
    "matcher": "Bash"
}

// Hook with regex matcher
{
    "hooks": [{ "type": "command", "command": "echo 'File tool used'" }],
    "matcher": "^(Read|Edit|Write)$"
}

// Hook without matcher (triggers for all tools)
{
    "hooks": [{ "type": "command", "command": "echo 'Tool used'" }]
}
```

---

## Deep Analysis: 21 Hook Events (v2.1.76)

The plugin hook system supports 21 lifecycle events in v2.1.76:

### Core Tool Events
- **PreToolUse** - Before tool execution (can block)
- **PostToolUse** - After successful tool execution
- **PostToolUseFailure** - After failed tool execution

### Session Lifecycle
- **SessionStart** - When session begins
- **SessionEnd** - When session ends
- **Setup** - After SessionStart, for setup tasks

### User Interaction
- **UserPromptSubmit** - When user submits input
- **Notification** - When notification is sent
- **Stop** - When user requests stop

### Subagent Events
- **SubagentStart** - When subagent spawns
- **SubagentStop** - When subagent completes

### Compact Events
- **PreCompact** - Before context compaction
- **PostCompact** - After context compaction

### Teammate/Task Events
- **TeammateIdle** - When teammate has no work
- **TaskCompleted** - When task finishes

### MCP/Elicitation
- **Elicitation** - MCP elicitation request
- **ElicitationResult** - MCP elicitation response

### Configuration/Worktree (NEW v2.1.76)
- **ConfigChange** - When settings change
- **WorktreeCreate** - When git worktree is created
- **WorktreeRemove** - When git worktree is removed
- **InstructionsLoaded** - When CLAUDE.md files are loaded
- **PermissionRequest** - When permission is requested
