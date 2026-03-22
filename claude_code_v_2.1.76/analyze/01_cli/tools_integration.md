# CLI-Tools Integration

> How CLI flags flow into tool permission context and session tool set assembly

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools, State Management
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions Module

Key functions in this document:
- `xM` - Default permission context factory - chunks.56.mjs:1596
- `Ez` - Permission context reducer (handles setMode, addRules, replaceRules, etc.) - chunks.53.mjs:1224
- `_v` - Apply multiple permission updates to context - chunks.53.mjs:1296
- `U84` - Update tool permission context with settings - chunks.172.mjs:2829
- `filterToolsByMode` (Xk8) - Filters tools by mode and async context - chunks.93.mjs:1568
- `filterToolsByRules` (hg1) - Filters tools by permission rules - chunks.3.mjs:245

> **VERIFIED CORRECT MAPPINGS:** Cross-checked against source code in v2.1.76:
> - `xM` → `createDefaultPermissionContext` @ chunks.56.mjs:1596 ✓
> - `Ez` → `permissionContextReducer` @ chunks.53.mjs:1224 ✓
> - `_v` → `applyPermissionUpdates` @ chunks.53.mjs:1296 ✓
> - `U84` → `updateToolPermissionContext` @ chunks.172.mjs:2829 ✓
> - `Xk8` → `filterToolsByMode` @ chunks.93.mjs:1568 ✓
> - `hg1` → `filterToolsByRules` @ chunks.3.mjs:245 ✓

> **INCORRECT MAPPINGS (DO NOT USE):**
> - ~~`tD` as `getDefaultTools` @ chunks.141.mjs:1505~~ → chunks.141.mjs:1505 is DOM code (textarea value property). Tool assembly is a composite operation using `filterToolsByMode` and `filterToolsByRules`.
> - ~~`YP6` as `assembleSessionToolSet`~~ → `YP6` at chunks.141.mjs:1476 is DOM-related code (`vAlign: String` for HTMLTableRowElement).

---

## Overview

The CLI layer integrates with the tools system through a multi-stage pipeline:

1. **Flag Parsing** → CLI arguments (`--allowed-tools`, `--disallowed-tools`, `--tools`) parsed by Commander
2. **Context Building** → Permission context built via `Ez` (reducer) + `_v` (apply) + `U84` (merge settings)
3. **Tool Discovery** → `getDefaultTools` (tD) retrieves built-in tools
4. **Filtering** → `filterToolsByMode` (Xk8) and `filterToolsByRules` (hg1) produce final available tool set

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CLI → TOOLS INTEGRATION PIPELINE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌───────────────────┐    ┌──────────────────┐     │
│  │   CLI Flags      │    │   Config Sources  │    │   Org Policies   │     │
│  │  --allowed-tools │    │   user.json       │    │   enterprise     │     │
│  │  --disallowed-   │    │   project.json    │    │   managed        │     │
│  │  --tools         │    │   --settings      │    │                  │     │
│  └────────┬─────────┘    └─────────┬─────────┘    └────────┬─────────┘     │
│           │                        │                       │               │
│           └────────────────────────┼───────────────────────┘               │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │  Permission Context Building  │                       │
│                    │  Ez (reducer) + _v (apply)    │                       │
│                    │  U84 (merge with settings)    │                       │
│                    │  chunks.53.mjs + chunks.172   │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│                                    ▼                                       │
│                    ┌───────────────────────────────┐                       │
│                    │   ToolPermissionContext       │                       │
│                    │   - mode: default/bypass      │                       │
│                    │   - alwaysAllowRules          │                       │
│                    │   - alwaysDenyRules           │                       │
│                    │   - additionalWorkingDirs     │                       │
│                    └───────────────┬───────────────┘                       │
│                                    │                                       │
│           ┌────────────────────────┼────────────────────────┐              │
│           │                        │                        │              │
│           ▼                        ▼                        ▼              │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐          │
│  │ getDefaultTools │   │   MCP Tools     │   │ filterToolsBy   │          │
│  │      (tD)       │   │   (from MCP     │   │    Rules        │          │
│  │ chunks.141.mjs  │   │   servers)      │   │    (hg1)        │          │
│  └────────┬────────┘   └────────┬────────┘   └────────┬────────┘          │
│           │                     │                     │                   │
│           └─────────────────────┼─────────────────────┘                   │
│                                 ▼                                         │
│                 ┌───────────────────────────────┐                         │
│                 │  Tool Set Assembly            │                         │
│                 │  (composite operation)        │                         │
│                 │  filterToolsByMode (Xk8)      │                         │
│                 │  filterToolsByRules (hg1)     │                         │
│                 │  chunks.93.mjs + chunks.141   │                         │
│                 └───────────────┬───────────────┘                         │
│                                 │                                         │
│                                 ▼                                         │
│                 ┌───────────────────────────────┐                         │
│                 │   Available Tool Set          │                         │
│                 │   (passed to Agent Loop)      │                         │
│                 └───────────────────────────────┘                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. CLI Flag Parsing for Tools

### 1.1 Tool-Related CLI Flags

The following flags control tool availability:

| Flag | Type | Description |
|------|------|-------------|
| `--allowed-tools` | string[] | Tools to always allow (whitelist) |
| `--disallowed-tools` | string[] | Tools to always deny (blacklist) |
| `--tools` | string[] | Specify exact tool set (disables others) |
| `--dangerously-skip-permissions` | boolean | Bypass all permission checks |

**Source location:** `chunks.197.mjs:1017-1027`

```javascript
// ============================================
// Tool-related CLI flag definitions - Commander setup
// Location: chunks.197.mjs:1017-1027
// ============================================

// ORIGINAL (for source lookup):
.option("--allowedTools, --allowed-tools <tools...>", 'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")')
.option("--tools <tools...>", 'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read").')
.option("--disallowedTools, --disallowed-tools <tools...>", 'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")')
.option("--dangerously-skip-permissions", "Bypass all permission checks. Recommended only for sandboxes with no internet access.", () => !0)

// READABLE (for understanding):
.option("--allowed-tools <tools...>",
    'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")')
.option("--tools <tools...>",
    'Specify exact tool set. Use "" to disable all, "default" for all tools, or list names.')
.option("--disallowed-tools <tools...>",
    'Comma or space-separated list of tool names to deny')
.option("--dangerously-skip-permissions",
    "Bypass all permission checks (dangerous!)")

// Mapping: allowedTools→allowedToolsCli, disallowedTools→disallowedToolsCli, tools→baseToolsCli
```

### 1.2 Flag Extraction in Action Handler

**Source location:** `chunks.197.mjs:1032-1039`

```javascript
// ============================================
// CLI flag extraction - Action handler destructuring
// Location: chunks.197.mjs:1032-1039
// ============================================

// ORIGINAL (for source lookup):
let {
    debug: $ = !1,
    debugToStderr: O = !1,
    dangerouslySkipPermissions: _,
    allowDangerouslySkipPermissions: J = !1,
    tools: X = [],
    allowedTools: D = [],
    disallowedTools: j = [],
    mcpConfig: M = [],
    permissionMode: P,
    addDir: W = [],
    ...
} = H,

// READABLE (for understanding):
let {
    dangerouslySkipPermissions,
    allowDangerouslySkipPermissions = false,
    tools: baseToolsCli = [],              // --tools flag
    allowedTools: allowedToolsCli = [],    // --allowed-tools flag
    disallowedTools: disallowedToolsCli = [], // --disallowed-tools flag
    permissionMode,
    addDir: additionalDirectories = [],
    ...
} = options;

// Mapping: X→baseToolsCli, D→allowedToolsCli, j→disallowedToolsCli, _→dangerouslySkipPermissions
```

---

## 2. Permission Context Building

### 2.1 Ez - Permission Context Reducer

**What it does:** The core reducer function that handles individual permission context updates. It processes different update types: `setMode`, `addRules`, `replaceRules`, `removeRules`, `addDirectories`, `removeDirectories`.

**Source location:** `chunks.53.mjs:1224-1294`

```javascript
// ============================================
// Ez - Permission context reducer
// Location: chunks.53.mjs:1224-1294
// ============================================

// ORIGINAL (for source lookup):
function Ez(A, q) {
    switch (q.type) {
        case "setMode":
            return k(`Applying permission update: Setting mode to '${q.mode}'`), {
                ...A,
                mode: q.mode
            };
        case "addRules": {
            let K = q.rules.map((z) => L5(z));
            k(`Applying permission update: Adding ${q.rules.length} ${q.behavior} rule(s) to destination '${q.destination}': ${B6(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: [...A[Y][q.destination] || [], ...K]
                }
            }
        }
        case "replaceRules": {
            let K = q.rules.map((z) => L5(z));
            k(`Replacing all ${q.behavior} rules for destination '${q.destination}' with ${q.rules.length} rule(s): ${B6(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: K
                }
            }
        }
        case "addDirectories": {
            k(`Applying permission update: Adding ${q.directories.length} director${q.directories.length===1?"y":"ies"} with destination '${q.destination}': ${B6(q.directories)}`);
            let K = new Map(A.additionalWorkingDirectories);
            for (let Y of q.directories) K.set(Y, {
                path: Y,
                source: q.destination
            });
            return {
                ...A,
                additionalWorkingDirectories: K
            }
        }
        case "removeRules": {
            let K = q.rules.map((O) => L5(O));
            k(`Applying permission update: Removing ${q.rules.length} ${q.behavior} rule(s) from source '${q.destination}': ${B6(K)}`);
            let Y = q.behavior === "allow" ? "alwaysAllowRules" : q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules",
                z = A[Y][q.destination] || [],
                _ = new Set(K),
                w = z.filter((O) => !_.has(O));
            return {
                ...A,
                [Y]: {
                    ...A[Y],
                    [q.destination]: w
                }
            }
        }
        case "removeDirectories": {
            k(`Applying permission update: Removing ${q.directories.length} director${q.directories.length===1?"y":"ies"}: ${B6(q.directories)}`);
            let K = new Map(A.additionalWorkingDirectories);
            for (let Y of q.directories) K.delete(Y);
            return {
                ...A,
                additionalWorkingDirectories: K
            }
        }
        default:
            return A
    }
}

// READABLE (for understanding):
function permissionContextReducer(context, update) {
    switch (update.type) {
        case "setMode":
            debug(`Applying permission update: Setting mode to '${update.mode}'`);
            return { ...context, mode: update.mode };

        case "addRules": {
            let normalizedRules = update.rules.map(normalizeRule);
            debug(`Adding ${update.rules.length} ${update.behavior} rule(s) to ${update.destination}`);
            let rulesKey = update.behavior === "allow" ? "alwaysAllowRules"
                         : update.behavior === "deny" ? "alwaysDenyRules"
                         : "alwaysAskRules";
            return {
                ...context,
                [rulesKey]: {
                    ...context[rulesKey],
                    [update.destination]: [...(context[rulesKey][update.destination] || []), ...normalizedRules]
                }
            };
        }

        case "replaceRules": {
            let normalizedRules = update.rules.map(normalizeRule);
            debug(`Replacing all ${update.behavior} rules for ${update.destination}`);
            let rulesKey = update.behavior === "allow" ? "alwaysAllowRules"
                         : update.behavior === "deny" ? "alwaysDenyRules"
                         : "alwaysAskRules";
            return {
                ...context,
                [rulesKey]: {
                    ...context[rulesKey],
                    [update.destination]: normalizedRules
                }
            };
        }

        case "addDirectories": {
            debug(`Adding ${update.directories.length} director(y/ies) to ${update.destination}`);
            let newDirs = new Map(context.additionalWorkingDirectories);
            for (let dir of update.directories) {
                newDirs.set(dir, { path: dir, source: update.destination });
            }
            return { ...context, additionalWorkingDirectories: newDirs };
        }

        case "removeRules": {
            // Remove specific rules from a destination
            let normalizedRules = update.rules.map(normalizeRule);
            let rulesKey = update.behavior === "allow" ? "alwaysAllowRules"
                         : update.behavior === "deny" ? "alwaysDenyRules"
                         : "alwaysAskRules";
            let existingRules = context[rulesKey][update.destination] || [];
            let rulesToRemove = new Set(normalizedRules);
            let filteredRules = existingRules.filter(rule => !rulesToRemove.has(rule));
            return {
                ...context,
                [rulesKey]: {
                    ...context[rulesKey],
                    [update.destination]: filteredRules
                }
            };
        }

        case "removeDirectories": {
            debug(`Removing ${update.directories.length} director(y/ies)`);
            let newDirs = new Map(context.additionalWorkingDirectories);
            for (let dir of update.directories) newDirs.delete(dir);
            return { ...context, additionalWorkingDirectories: newDirs };
        }

        default:
            return context;
    }
}

// Mapping: Ez→permissionContextReducer, A→context, q→update, k→debug, L5→normalizeRule,
//          B6→JSON.stringify, Y→rulesKey, K→normalizedRules
```

### 2.2 _v - Apply Multiple Updates

**What it does:** Applies a sequence of permission updates to a context by iteratively calling the reducer.

**Source location:** `chunks.53.mjs:1296-1300`

```javascript
// ============================================
// _v - Apply multiple permission updates
// Location: chunks.53.mjs:1296-1300
// ============================================

// ORIGINAL (for source lookup):
function _v(A, q) {
    let K = A;
    for (let Y of q) K = Ez(K, Y);
    return K
}

// READABLE (for understanding):
function applyPermissionUpdates(context, updates) {
    let result = context;
    for (let update of updates) {
        result = permissionContextReducer(result, update);
    }
    return result;
}

// Mapping: _v→applyPermissionUpdates, A→context, q→updates, K→result, Ez→permissionContextReducer
```

### 2.3 U84 - Update Tool Permission Context with Settings

**What it does:** Merges settings into the tool permission context. This function is called when settings change to update the permission context accordingly.

**Source location:** `chunks.172.mjs:2829-2852`

```javascript
// ============================================
// U84 - Update tool permission context with settings
// Location: chunks.172.mjs:2829-2852
// ============================================

// ORIGINAL (for source lookup):
function U84(A, q) {
    let K = A;
    if (Eb6()) {
        let _ = ["userSettings", "projectSettings", "localSettings", "cliArg", "session"],
            w = ["allow", "deny", "ask"];
        for (let O of _)
            for (let $ of w) K = Ez(K, {
                type: "replaceRules",
                rules: [],
                behavior: $,
                destination: O
            })
    }
    let Y = ["userSettings", "projectSettings", "localSettings"];
    for (let _ of Y)
        for (let w of ["allow", "deny", "ask"]) K = Ez(K, {
            type: "replaceRules",
            rules: [],
            behavior: w,
            destination: _
        });
    let z = ifq(q, "replaceRules");
    return _v(K, z)
}

// READABLE (for understanding):
function updateToolPermissionContext(context, settingsChanges) {
    let result = context;

    // If enterprise mode, clear all rules from all sources
    if (isEnterpriseMode()) {
        let allSources = ["userSettings", "projectSettings", "localSettings", "cliArg", "session"];
        let allBehaviors = ["allow", "deny", "ask"];
        for (let source of allSources) {
            for (let behavior of allBehaviors) {
                result = permissionContextReducer(result, {
                    type: "replaceRules",
                    rules: [],
                    behavior: behavior,
                    destination: source
                });
            }
        }
    }

    // Clear rules from user/project/local settings (always done on settings change)
    let settingsSources = ["userSettings", "projectSettings", "localSettings"];
    for (let source of settingsSources) {
        for (let behavior of ["allow", "deny", "ask"]) {
            result = permissionContextReducer(result, {
                type: "replaceRules",
                rules: [],
                behavior: behavior,
                destination: source
            });
        }
    }

    // Apply new rules from settings changes
    let replaceUpdates = groupSettingsByDestination(settingsChanges, "replaceRules");
    return applyPermissionUpdates(result, replaceUpdates);
}

// Mapping: U84→updateToolPermissionContext, A→context, q→settingsChanges, K→result,
//          Eb6→isEnterpriseMode, Ez→permissionContextReducer, ifq→groupSettingsByDestination,
//          _v→applyPermissionUpdates
```

### 2.4 Key Design Decisions

**Why immutable updates:**

All permission context updates use immutable patterns (`...spread`, `new Map()`). This:
1. Enables efficient change detection (Object.is comparison)
2. Allows undo/redo operations by storing previous contexts
3. Prevents accidental mutations from cascading through the app

**Why multiple rule sources:**

Rules are organized by source (`userSettings`, `projectSettings`, `localSettings`, `cliArg`, `session`):
1. **Precedence**: CLI args override project settings, which override user settings
2. **Visibility**: Users can see where rules came from
3. **Isolation**: Enterprise mode can clear specific sources without affecting others

**Why separate allow/deny/ask rules:**

Three rule types enable fine-grained control:
- `alwaysAllowRules`: Skip prompts for matched tools
- `alwaysDenyRules`: Block matched tools without prompts
- `alwaysAskRules`: Always prompt for matched tools (even in semi-auto mode)

### 2.5 Default Permission Context Factory (xM)

**What it does:** Factory function that creates the initial/default permission context. This is used when no previous context exists or when resetting to defaults.

**Source location:** `chunks.56.mjs:1596-1603`

```javascript
// ============================================
// xM - Default permission context factory
// Location: chunks.56.mjs:1596-1603
// ============================================

// ORIGINAL (for source lookup):
xM = () => ({
    mode: "default",
    additionalWorkingDirectories: new Map,
    alwaysAllowRules: {},
    alwaysDenyRules: {},
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable: !1
})

// READABLE (for understanding):
const createDefaultPermissionContext = () => ({
    mode: "default",                          // Default permission mode
    additionalWorkingDirectories: new Map(),  // Empty map for extra working dirs
    alwaysAllowRules: {},                     // No allow rules initially
    alwaysDenyRules: {},                      // No deny rules initially
    alwaysAskRules: {},                       // No ask rules initially
    isBypassPermissionsModeAvailable: false   // Bypass disabled by default
});

// Mapping: xM→createDefaultPermissionContext
```

**Why a factory function:**

Using a factory function instead of a constant ensures:
1. **Fresh instances**: Each call returns a new object, preventing accidental shared state
2. **Map initialization**: `new Map()` creates a fresh Map each time (not shared references)
3. **Test isolation**: Tests can create independent contexts without state pollution
4. **Predictable defaults**: Always starts from a known clean state

**Initial state rationale:**

| Field | Default Value | Rationale |
|-------|---------------|-----------|
| `mode` | `"default"` | Normal permission prompts active |
| `additionalWorkingDirectories` | `new Map()` | No extra dirs until explicitly added |
| `alwaysAllowRules` | `{}` | No auto-allowed tools until configured |
| `alwaysDenyRules` | `{}` | No auto-denied tools until configured |
| `alwaysAskRules` | `{}` | No forced-prompt tools until configured |
| `isBypassPermissionsModeAvailable` | `false` | Bypass requires explicit `--dangerously-skip-permissions` |

**Key insight:** The empty objects `{}` for rules are organized by source (e.g., `userSettings`, `cliArg`), but start empty. As settings are loaded and CLI args parsed, rules are added via the reducer pattern (`Ez`).

---

## 3. getDefaultTools (tD)

**What it does:** Returns the collection of built-in tools available for the session, filtered by permission context and environment.

**Location:** `chunks.141.mjs:1505-1516`

### 3.1 Tool Collection Definition

```javascript
// ============================================
// kt - Built-in tool collection definition
// Location: chunks.141.mjs:1465-1467
// ============================================

// ORIGINAL (for source lookup):
function kt() {
    return [rj1, kW6, qq, WB, tS, Nj, i5, sW, vj, gd, Vj, bO, LW6, vW6, dW1, wt, kg1,
        ...jH() ? [tc4, $l4, Wl4, Ll4] : [],
        ...Hi4 ? [Hi4] : [],
        ...$i4 ? [$i4] : [],
        vRA,
        ...l8() ? [zhY(), whY(), HhY()] : [],
        ...wi4 ? [wi4] : [],
        ...zi4 ? [zi4] : [],
        cd, ld,
        ...Fp() ? [IW6] : []]
}

// READABLE (for understanding):
function getToolCollection() {
    return [
        // Core tools (always available)
        AgentTool,          // Task/Agent spawning
        TaskOutputTool,     // Async task output retrieval
        BashTool,           // Shell command execution
        GlobTool,           // File pattern matching
        GrepTool,           // Content search
        WebSearchTool,      // Web search
        FileReadTool,       // File reading
        EditTool,           // File editing
        FileWriteTool,      // File writing
        NotebookEditTool,   // Jupyter notebook editing
        WebFetchTool,       // URL content fetching
        BashOutputTool,     // Background bash output
        TaskCreateTool,     // Task creation (structured tasks)
        TaskStopTool,       // Stop running task
        TaskListTool,       // List tasks
        SkillTool,          // Skill invocation
        NotebookReadTool,   // Jupyter notebook reading

        // Conditional tools based on feature flags
        ...(isTeamsEnabled() ? [
            TeamCreateTool,
            TeamDeleteTool,
            SendMessageTool
        ] : []),

        // Dynamic tools (loaded from MCP/plugins)
        ...(mcpTool ? [mcpTool] : []),
        ...(pluginTool ? [pluginTool] : []),

        // Structured output tools
        StructuredOutputTool,
        ToolSearchTool,

        // Rewind tool (if enabled)
        ...(isRewindEnabled() ? [RewindTool] : [])
    ];
}

// Mapping: kt→getToolCollection, rj1→AgentTool, kW6→TaskOutputTool, qq→BashTool,
//          WB→GlobTool, tS→GrepTool, i5→FileReadTool, sW→EditTool, vj→FileWriteTool,
//          wt→SkillTool, cd→StructuredOutputTool, ld→ToolSearchTool
```

### 3.2 Default Tool Selection with Filtering

```javascript
// ============================================
// getDefaultTools - Filtered tool selection
// Location: chunks.141.mjs:1505-1516
// ============================================

// ORIGINAL (for source lookup):
$hY
tD = (A) => {
        if (J6(void 0)) return [qq];
        let q = new Set([cd.name, ld.name, cD]),
            K = kt().filter((w) => !q.has(w.name)),
            Y = hg1(K, A);
        if (A.mode === "delegate") Y = Y.filter((w) => R_6.has(w.name));
        if (J6(process.env.CLAUDE_REPL_MODE)) {
            if (Y.some((H) => H.name === y_6)) Y = Y.filter((H) => !rp7.has(H.name))
        }
        let z = Y.map((w) => w.isEnabled());
        return Y.filter((w, H) => z[H])
    }

// READABLE (for understanding):
const getDefaultTools = (permissionContext) => {
    // Edge case: if undefined context (test mode), return only Bash
    if (isTestMode(undefined)) return [BashTool];

    // Always exclude these from the default list (they're added separately)
    let alwaysExcludeSet = new Set([
        StructuredOutputTool.name,
        ToolSearchTool.name,
        STRUCTURED_OUTPUT_NAME
    ]);

    // Get all tools and exclude the always-exclude set
    let allTools = getToolCollection().filter(tool => !alwaysExcludeSet.has(tool.name));

    // Apply permission rules filtering
    let filteredTools = filterToolsByRules(allTools, permissionContext);

    // Delegate mode: restrict to DELEGATE_ALLOWED_TOOLS only
    if (permissionContext.mode === "delegate") {
        filteredTools = filteredTools.filter(tool =>
            DELEGATE_ALLOWED_TOOLS.has(tool.name)
        );
    }

    // REPL mode filtering: exclude REPL-conflicting tools
    if (isTestMode(process.env.CLAUDE_REPL_MODE)) {
        if (filteredTools.some(tool => tool.name === REPL_TOOL_NAME)) {
            filteredTools = filteredTools.filter(tool =>
                !REPL_CONFLICT_TOOLS.has(tool.name)
            );
        }
    }

    // Filter to only enabled tools
    let enabledFlags = filteredTools.map(tool => tool.isEnabled());
    return filteredTools.filter((tool, index) => enabledFlags[index]);
};

// Mapping: tD→getDefaultTools, A→permissionContext, q→alwaysExcludeSet,
//          K→allTools, Y→filteredTools, hg1→filterToolsByRules, R_6→DELEGATE_ALLOWED_TOOLS
```

---

## 4. filterToolsByMode (Xk8)

**What it does:** Core tool filtering function that filters tools based on mode (built-in, async, plan), permission context, and exclusion rules.

**Location:** `chunks.93.mjs:1568-1588`

```javascript
// ============================================
// filterToolsByMode - Core tool filtering by mode
// Location: chunks.93.mjs:1568-1588
// ============================================

// ORIGINAL (for source lookup):
function Xk8({
    tools: A,
    isBuiltIn: q,
    isAsync: K = !1,
    permissionMode: Y
}) {
    return A.filter((z) => {
        if (z.name.startsWith("mcp__")) return !0;
        if (z3(z, aJ) && Y === "plan") return !0;
        if (CW6.has(z.name)) return !1;
        if (!q && xV8.has(z.name)) return !1;
        if (K && !eP1.has(z.name)) {
            if (E7() && eP()) {
                if (z3(z, r4)) return !0;
                if (WY4.has(z.name)) return !0
            }
            return !1
        }
        return !0
    })
}

// READABLE (for understanding):
function filterToolsByMode({tools, isBuiltIn, isAsync = false, permissionMode}) {
    return tools.filter((tool) => {
        // Always include MCP tools (prefix: mcp__)
        if (tool.name.startsWith("mcp__")) return true;

        // Plan mode: allow plan-specific tools
        if (matchesTool(tool, PLAN_ALLOWED_TOOLS) && permissionMode === "plan") {
            return true;
        }

        // Exclude tools in EXCLUDED_TOOLS set
        if (EXCLUDED_TOOLS.has(tool.name)) return false;

        // For non-built-in contexts, exclude non-builtin-filtered tools
        if (!isBuiltIn && NON_BUILTIN_EXCLUDED.has(tool.name)) return false;

        // Async mode: only include ASYNC_ALLOWED_TOOLS
        if (isAsync && !ASYNC_ALLOWED_TOOLS.has(tool.name)) {
            // Exception: team mode with background agents
            if (isTeamMode() && isBackgroundEnabled()) {
                if (matchesTool(tool, AGENT_TOOL)) return true;
                if (BACKGROUND_AGENT_TOOLS.has(tool.name)) return true;
            }
            return false;
        }

        return true;
    });
}

// Mapping: Xk8→filterToolsByMode, A→tools, q→isBuiltIn, K→isAsync, Y→permissionMode,
//          z→tool, CW6→EXCLUDED_TOOLS, xV8→NON_BUILTIN_EXCLUDED, eP1→ASYNC_ALLOWED_TOOLS,
//          z3→matchesTool, aJ→PLAN_ALLOWED_TOOLS, r4→AGENT_TOOL, WY4→BACKGROUND_AGENT_TOOLS,
//          E7→isTeamMode, eP→isBackgroundEnabled
```

### 4.1 Mode-Specific Tool Restrictions

Different execution modes have different tool availability:

| Mode | Restriction | Rationale |
|------|-------------|-----------|
| `default` | Full tool set | Normal operation |
| `delegate` | DELEGATE_ALLOWED_TOOLS only | Subagents have limited capabilities |
| `bypassPermissions` | Full tool set, no prompts | Dangerous but convenient |
| `background` | BACKGROUND_AGENT_ALLOWED_TOOLS | Background tasks can't interact with UI |
| `plan` | PLAN_ALLOWED_TOOLS + EnterPlanMode | Planning mode restricts to read-only + plan tools |

### 4.2 EXCLUDED_TOOLS (CW6) - Always Excluded from Default Filtering

**What it does:** A set of tool names that are ALWAYS excluded from tool filtering operations. These tools are special-purpose and are added separately to the tool set rather than being included in the default filtered list.

**Source location:** `chunks.91.mjs:269`

```javascript
// ============================================
// EXCLUDED_TOOLS - Tools always excluded from default filtering
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
CW6 = new Set([$C, aJ, dt, r4, Fw, OC])

// READABLE (for understanding):
const EXCLUDED_TOOLS = new Set([
    "TaskOutput",      // $C - Always added separately for task management
    "ExitPlanMode",    // aJ - Added only when in plan mode
    "EnterPlanMode",   // dt - Added only when entering plan mode
    "Agent",           // r4 - Added separately for subagent spawning
    "AskUserQuestion", // Fw - Added when interactive prompts are available
    "TaskStop"         // OC - Always added separately for task management
]);

// Mapping: CW6→EXCLUDED_TOOLS, $C→"TaskOutput", aJ→"ExitPlanMode", dt→"EnterPlanMode",
//          r4→"Agent", Fw→"AskUserQuestion", OC→"TaskStop"
```

**Why these tools are excluded:**

1. **TaskOutput/TaskStop**: Task management tools are added conditionally based on whether the session has active tasks
2. **EnterPlanMode/ExitPlanMode**: Plan mode tools are only available when the mode is active
3. **Agent**: The Agent tool is added separately to allow special permission handling
4. **AskUserQuestion**: Only available when interactive mode is enabled (not in background/async)

### 4.3 matchesTool (z3) - Tool Name Matching Helper

**What it does:** Checks if a tool matches a given name, including checking the tool's aliases.

**Source location:** `chunks.56.mjs:1588-1590`

```javascript
// ============================================
// matchesTool - Tool name/alias matching
// Location: chunks.56.mjs:1588-1590
// ============================================

// ORIGINAL (for source lookup):
function z3(A, q) {
    return A.name === q || (A.aliases?.includes(q) ?? !1)
}

// READABLE (for understanding):
function matchesTool(tool, toolName) {
    return tool.name === toolName || (tool.aliases?.includes(toolName) ?? false);
}

// Mapping: z3→matchesTool, A→tool, q→toolName
```

**Why aliases matter:**

Some tools have multiple names for backward compatibility or convenience:
- `Agent` tool has alias `Task` (I46)
- This allows `filterToolsByMode` to check for either name

### 4.4 ASYNC_ALLOWED_TOOLS (eP1) - Tools for Async/Background Mode

**What it does:** Defines which tools are available when running in async/background mode. These tools can operate without immediate user interaction.

**Source location:** `chunks.91.mjs:269`

```javascript
// ============================================
// ASYNC_ALLOWED_TOOLS - Tools allowed in async/background mode
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
eP1 = new Set([s7, jv, MB, N9, sO, qz, ...ZU, R4, _K, bJ, oH, oM, HZ, sP1, tP1])

// READABLE (for understanding):
const ASYNC_ALLOWED_TOOLS = new Set([
    // Core read-only tools
    "Read",            // s7 - File reading
    "WebSearch",       // jv - Web search
    "Grep",            // N9 - Content search
    "WebFetch",        // sO - URL content fetching
    "Glob",            // qz - File pattern matching

    // State management
    "TodoWrite",       // MB - Todo list updates

    // File modification tools (allowed in async for autonomous operation)
    "Edit",            // R4 - File editing
    "Write",           // _K - File writing
    "NotebookEdit",    // bJ - Jupyter notebook editing

    // Tool/Skill invocation
    "Skill",           // oH - Skill invocation

    // Additional async-safe tools from ZU spread
    ...ASYNC_ADDITIONAL_TOOLS,  // Includes Task*, EnterPlanMode, ExitPlanMode, etc.

    // Plan mode tools (for async planning)
    // ... other async-safe tools
]);

// Mapping: eP1→ASYNC_ALLOWED_TOOLS, s7→"Read", jv→"WebSearch", MB→"TodoWrite",
//          N9→"Grep", sO→"WebFetch", qz→"Glob", R4→"Edit", _K→"Write",
//          bJ→"NotebookEdit", oH→"Skill"
```

**Why these tools are async-safe:**

1. **Read-only tools (Read, WebSearch, Grep, WebFetch, Glob)**: No side effects, safe for background execution
2. **TodoWrite**: Essential for progress tracking in background tasks
3. **Edit/Write**: Required for autonomous code modification (with proper permissions)
4. **Skill**: Allows invoking pre-defined, safe operations
5. **NotebookEdit**: For data science workflows in background

**Key insight:** The async tool set is intentionally broader than background-only tools because async mode may still have eventual user interaction (via `AskUserQuestion` queuing), while background agents run completely autonomously.

---

## 5. Tool Whitelist Constants

### 5.0 resolveToolFilter (_c) - Tool Resolution and Filtering

**What it does:** Resolves a tool filter request by applying mode filtering and validating against available tools. Returns the resolved tool set with validation results.

**How it works:**
1. Extracts filter criteria (tools list, disallowed tools, source, permission mode)
2. Applies mode-based filtering via `filterToolsByMode` (Xk8)
3. Removes disallowed tools from the result
4. Validates requested tools against available tools
5. Handles special case for Agent tool with agent type rules

**Source location:** `chunks.93.mjs:1590-1644`

```javascript
// ============================================
// resolveToolFilter - Tool resolution and validation
// Location: chunks.93.mjs:1590-1644
// ============================================

// ORIGINAL (for source lookup):
function _c(A, q, K = !1, Y = !1) {
    let {
        tools: z,
        disallowedTools: _,
        source: w,
        permissionMode: O
    } = A, $ = Y ? q : Xk8({
        tools: q,
        isBuiltIn: w === "built-in",
        isAsync: K,
        permissionMode: O
    }), H = new Set(_?.map((G) => {
        let {
            toolName: f
        } = CH(G);
        return f
    }) ?? []), j = $.filter((G) => !H.has(G.name));
    if (z === void 0 || z.length === 1 && z[0] === "*") return {
        hasWildcard: !0,
        validTools: [],
        invalidTools: [],
        resolvedTools: j
    };
    // ... continues with tool validation
}

// READABLE (for understanding):
function resolveToolFilter(filterRequest, availableTools, isAsync = false, skipModeFilter = false) {
    let {
        tools: requestedTools,      // Specific tools requested
        disallowedTools,            // Tools to explicitly deny
        source,                     // "built-in" or other source
        permissionMode              // Current permission mode
    } = filterRequest;

    // Step 1: Apply mode-based filtering (unless skipped)
    let filteredTools = skipModeFilter
        ? availableTools
        : filterToolsByMode({
            tools: availableTools,
            isBuiltIn: source === "built-in",
            isAsync: isAsync,
            permissionMode: permissionMode
        });

    // Step 2: Remove disallowed tools
    let disallowedSet = new Set(
        disallowedTools?.map(t => parseToolPattern(t).toolName) ?? []
    );
    let allowedTools = filteredTools.filter(tool => !disallowedSet.has(tool.name));

    // Step 3: Handle wildcard case (all allowed tools)
    if (requestedTools === undefined ||
        (requestedTools.length === 1 && requestedTools[0] === "*")) {
        return {
            hasWildcard: true,
            validTools: [],
            invalidTools: [],
            resolvedTools: allowedTools
        };
    }

    // Step 4: Validate requested tools against available
    let toolMap = new Map();
    for (let tool of allowedTools) toolMap.set(tool.name, tool);

    let validTools = [];
    let invalidTools = [];
    let resolvedTools = [];
    let seenTools = new Set();
    let allowedAgentTypes;

    for (let requested of requestedTools) {
        let { toolName, ruleContent } = parseToolPattern(requested);

        // Special handling for Agent tool - extract agent type restrictions
        if (toolName === "Agent") {
            if (ruleContent) {
                allowedAgentTypes = ruleContent.split(",").map(t => t.trim());
            }
            if (!skipModeFilter) {
                validTools.push(requested);
                continue;
            }
        }

        let resolved = toolMap.get(toolName);
        if (resolved) {
            validTools.push(requested);
            if (!seenTools.has(resolved)) {
                resolvedTools.push(resolved);
                seenTools.add(resolved);
            }
        } else {
            invalidTools.push(requested);
        }
    }

    return {
        hasWildcard: false,
        validTools,
        invalidTools,
        resolvedTools,
        allowedAgentTypes
    };
}

// Mapping: _c→resolveToolFilter, A→filterRequest, q→availableTools, K→isAsync,
//          Y→skipModeFilter, z→requestedTools, _→disallowedTools, w→source,
//          O→permissionMode, $→filteredTools, H→disallowedSet, j→allowedTools,
//          M→toolMap, D→validTools, X→invalidTools, P→resolvedTools, Z→allowedAgentTypes,
//          CH→parseToolPattern, r4→"Agent"
```

**Key design decisions:**

1. **Wildcard handling (`*`)**: Allows specifying "all tools" without listing each one
2. **Agent tool special case**: Agent tool can have type restrictions (e.g., "Agent(general-purpose)")
3. **Separate valid/invalid lists**: Helps provide clear error messages about invalid tool names
4. **Deduplication via Set**: Ensures each tool appears once in resolvedTools

### 5.1 BACKGROUND_AGENT_ALLOWED_TOOLS (WY4) - Tools for Background Agents

**What it does:** Defines the minimal set of tools available to background agents. Background agents run completely autonomously without any user interaction capability.

**Source location:** `chunks.91.mjs:269`

```javascript
// ============================================
// BACKGROUND_AGENT_ALLOWED_TOOLS - Minimal tools for background agents
// Location: chunks.91.mjs:269
// ============================================

// ORIGINAL (for source lookup):
WY4 = new Set([TR, lt, it, ck, hI, ER, ed, SW6])

// READABLE (for understanding):
const BACKGROUND_AGENT_ALLOWED_TOOLS = new Set([
    // Task management (no execution, just coordination)
    "TaskCreate",      // TR - Create structured tasks
    "TaskGet",         // lt - Get task details
    "TaskList",        // it - List all tasks
    "TaskUpdate",      // ck - Update task status

    // Team communication
    "SendMessage",     // hI - Send message to team channel

    // Scheduling tools
    "CronCreate",      // ER - Schedule future prompts
    "CronDelete",      // ed - Delete scheduled prompts
    "CronList",        // SW6 - List scheduled prompts
]);

// Mapping: WY4→BACKGROUND_AGENT_ALLOWED_TOOLS, TR→"TaskCreate", lt→"TaskGet",
//          it→"TaskList", ck→"TaskUpdate", hI→"SendMessage", ER→"CronCreate",
//          ed→"CronDelete", SW6→"CronList"
```

**Why background agents need different tools:**

Background agents run without user interaction, so they:
- Can't use tools that require synchronous user input
- Can use `SendMessage` which queues messages for team review
- Need `TaskCreate`/`TaskGet`/`TaskList`/`TaskUpdate` for managing child tasks
- Can schedule future work with `CronCreate`/`CronDelete`/`CronList`
- Can enter/exit plan mode for planning workflows

**Critical difference from ASYNC_ALLOWED_TOOLS:**
- **ASYNC mode**: Broader tool set including Read, Write, Edit - can modify files
- **BACKGROUND mode**: Minimal coordination-only tools - cannot modify files or execute commands

This separation ensures background agents are truly sandboxed and can only coordinate work, not perform it directly.

### 5.2 ALL_SAFE_TOOLS (L_6)

```javascript
// ============================================
// ALL_SAFE_TOOLS - Safe tools for restricted contexts
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
L_6 = new Set([Jq, JL, cg, s9, xO, Jz, h4, bq, f5, jM, NJ, cD, dM, ...[], iB])

// READABLE (for understanding):
const ALL_SAFE_TOOLS = new Set([
    "Read",            // File reading
    "WebSearch",       // Web search
    "Glob",            // File pattern matching
    "Grep",            // Content search
    "WebFetch",        // URL fetching
    // ... other read-only tools
    "SendMessage"      // Team messaging
]);

// Mapping: L_6→ALL_SAFE_TOOLS, Jq→"Read", JL→"WebSearch"
```

### 5.3 STRUCTURED_TASK_TOOLS (np7)

```javascript
// ============================================
// STRUCTURED_TASK_TOOLS - Tools for structured task management
// Location: chunks.89.mjs:876
// ============================================

// ORIGINAL (for source lookup):
np7 = new Set([Nh, NK1, TK1, DR])

// READABLE (for understanding):
const STRUCTURED_TASK_TOOLS = new Set([
    "TaskCreate",      // Create tasks
    "TaskGet",         // Get task details
    "TaskList",        // List tasks
    "TaskUpdate"       // Update tasks
]);

// Mapping: np7→STRUCTURED_TASK_TOOLS, Nh→"TaskCreate", NK1→"TaskGet",
//          TK1→"TaskList", DR→"TaskUpdate"
```

---

## 6. Complete Integration Flow

### 6.1 Sequence Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CLI → TOOLS INTEGRATION SEQUENCE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User                                                                       │
│   │                                                                         │
│   │ claude --allowed-tools "Bash(git:*)" --disallowed-tools "WebFetch"     │
│   ▼                                                                         │
│  Commander.parse()                                                          │
│   │                                                                         │
│   │ Extract: allowedTools=["Bash(git:*)"], disallowedTools=["WebFetch"]    │
│   ▼                                                                         │
│  mainEntry() [chunks.197.mjs:931]                                          │
│   │                                                                         │
│   │ Resolve permission mode from flags/config                              │
│   ▼                                                                         │
│  buildToolPermissionContext() [chunks.172.mjs:2252]                        │
│   │                                                                         │
│   │ ├─ Parse tool patterns: "Bash(git:*)" → {tool:"Bash", args:"git:*"}   │
│   │ ├─ Merge with user/project config                                     │
│   │ ├─ Check feature flags & org policies                                 │
│   │ └─ Build ToolPermissionContext                                         │
│   ▼                                                                         │
│  ToolPermissionContext                                                      │
│   {                                                                         │
│     mode: "default",                                                        │
│     alwaysAllowRules: { cliArg: [{tool:"Bash", args:"git:*"}] },          │
│     alwaysDenyRules: { cliArg: [{tool:"WebFetch"}] },                     │
│     isBypassPermissionsModeAvailable: false                                │
│   }                                                                         │
│   │                                                                         │
│   ▼                                                                         │
│  getDefaultTools(permissionContext) [chunks.141.mjs:1505]                  │
│   │                                                                         │
│   │ ├─ Get all built-in tools                                              │
│   │ ├─ Filter by permission rules                                          │
│   │ └─ Return enabled tools only                                           │
│   ▼                                                                         │
│  filterToolsByMode({tools, isBuiltIn, isAsync, permissionMode})            │
│   │       [chunks.93.mjs:1568]                                             │
│   │                                                                         │
│   │ ├─ Filter by mode (plan, async, delegate)                             │
│   │ ├─ Apply exclusion rules                                               │
│   │ └─ Merge with MCP tools                                                │
│   ▼                                                                         │
│  Available Tool Set → Agent Loop                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Tool Permission Decision Matrix

When a tool is invoked, the permission system checks:

```
┌─────────────────────────────────────────────────────────────────┐
│                TOOL PERMISSION DECISION TREE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tool invocation request                                         │
│  │                                                               │
│  ▼                                                               │
│  ┌─────────────────────────────────────────┐                    │
│  │ Is bypass permissions mode active?      │                    │
│  │ (mode === "bypassPermissions" AND      │                    │
│  │  isBypassPermissionsModeAvailable)     │                    │
│  └────────────────┬────────────────────────┘                    │
│                   │                                              │
│         ┌────────┴────────┐                                      │
│         │                 │                                      │
│        YES               NO                                      │
│         │                 │                                      │
│         ▼                 ▼                                      │
│    ┌─────────┐   ┌─────────────────────────────────┐            │
│    │ ALLOW   │   │ Check alwaysAllowRules          │            │
│    │ (no     │   │ Does tool match any allow rule? │            │
│    │ prompt) │   └────────────────┬────────────────┘            │
│    └─────────┘                    │                             │
│                          ┌────────┴────────┐                    │
│                          │                 │                    │
│                         YES               NO                    │
│                          │                 │                    │
│                          ▼                 ▼                    │
│                     ┌─────────┐   ┌─────────────────────────┐   │
│                     │ ALLOW   │   │ Check alwaysDenyRules   │   │
│                     │ (no     │   │ Does tool match any     │   │
│                     │ prompt) │   │ deny rule?              │   │
│                     └─────────┘   └────────────────┬────────┘   │
│                                             │                  │
│                                   ┌─────────┴─────────┐        │
│                                   │                   │        │
│                                  YES                 NO        │
│                                   │                   │        │
│                                   ▼                   ▼        │
│                              ┌─────────┐   ┌───────────────┐   │
│                              │ DENY    │   │ Check mode    │   │
│                              │ (error  │   │ specific      │   │
│                              │ or ask) │   │ rules         │   │
│                              └─────────┘   └───────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| Flag parsing | `chunks.197.mjs:1017` | Commander definitions |
| Flag extraction | `chunks.197.mjs:1032` | Destructuring in action handler |
| Permission reducer | `chunks.53.mjs:1224` | `Ez` - core permission context reducer |
| Apply updates | `chunks.53.mjs:1296` | `_v` - apply multiple updates |
| Settings merge | `chunks.172.mjs:2829` | `U84` - update with settings |
| Tool discovery | `chunks.141.mjs:1505` | `getDefaultTools` (tD) |
| Tool filtering | `chunks.93.mjs:1568` | `filterToolsByMode` (Xk8) |
| Rule filtering | `chunks.141.mjs:1469` | `filterToolsByRules` (hg1) |
| Excluded tools | `chunks.91.mjs:269` | `CW6` set |
| Async-allowed tools | `chunks.91.mjs:269` | `eP1` set |
| Background tools | `chunks.91.mjs:269` | `WY4` set |
| Tool name matcher | `chunks.56.mjs:1588` | `z3` - matchesTool helper |
| Tool filter resolver | `chunks.93.mjs:1590` | `_c` - resolveToolFilter |

---

## 8. Deep Algorithm Analysis

### 8.1 Complete Tool Filtering Algorithm

**The 4-stage filtering pipeline:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE TOOL FILTERING PIPELINE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Stage 1: MODE FILTERING (filterToolsByMode/Xk8)                            │
│  ├─ MCP tools: Always pass (prefix "mcp__")                                 │
│  ├─ Plan mode: Allow PLAN_ALLOWED_TOOLS + plan-specific                     │
│  ├─ Exclusion: Remove tools in EXCLUDED_TOOLS (CW6)                         │
│  ├─ Non-builtin: Remove tools in NON_BUILTIN_EXCLUDED (xV8)                 │
│  └─ Async mode: Restrict to ASYNC_ALLOWED_TOOLS (eP1)                       │
│      └─ Team+Background exception: Allow BACKGROUND_AGENT_TOOLS (WY4)       │
│                                                                              │
│  Stage 2: DISALLOWED TOOLS REMOVAL                                          │
│  ├─ Parse each disallowed pattern via parseToolPattern (CH)                 │
│  ├─ Extract toolName from pattern (e.g., "Bash(git:*)" → "Bash")            │
│  └─ Filter out tools matching disallowed names                              │
│                                                                              │
│  Stage 3: REQUESTED TOOLS VALIDATION (resolveToolFilter/_c)                 │
│  ├─ Wildcard case: "*" → return all remaining tools                         │
│  ├─ Specific tools: Validate each against available                         │
│  │   ├─ Valid: Add to validTools, resolve to tool object                    │
│  │   └─ Invalid: Add to invalidTools for error reporting                    │
│  └─ Agent tool: Extract allowedAgentTypes from rule content                 │
│                                                                              │
│  Stage 4: PERMISSION RULE FILTERING (filterToolsByRules)                    │
│  ├─ Check alwaysAllowRules for each tool                                    │
│  ├─ Check alwaysDenyRules for each tool                                     │
│  └─ Apply permission mode decision                                          │
│                                                                              │
│  OUTPUT: Final tool set available for the session                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Async vs Background Mode Tool Sets

**Why different tool sets for async and background modes?**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ASYNC vs BACKGROUND TOOL COMPARISON                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ASYNC_ALLOWED_TOOLS (eP1)              BACKGROUND_AGENT_TOOLS (WY4)        │
│  ══════════════════════════            ═════════════════════════════════    │
│                                                                              │
│  ✓ Read                                 ✗ Read                              │
│  ✓ Write                                ✗ Write                             │
│  ✓ Edit                                 ✗ Edit                              │
│  ✓ WebSearch                            ✗ WebSearch                         │
│  ✓ Grep                                 ✗ Grep                              │
│  ✓ Glob                                 ✗ Glob                              │
│  ✓ WebFetch                             ✗ WebFetch                          │
│  ✓ TodoWrite                            ✗ TodoWrite                         │
│  ✓ NotebookEdit                         ✗ NotebookEdit                      │
│  ✓ Skill                                ✗ Skill                             │
│  ✓ Task tools                           ✓ Task tools                        │
│  ✓ SendMessage                          ✓ SendMessage                       │
│  ✓ Cron tools                           ✓ Cron tools                        │
│                                                                              │
│  USE CASE:                              USE CASE:                           │
│  - Background task execution           - Background agent coordination     │
│  - Autonomous file modification       - Task delegation                    │
│  - Long-running operations            - Status reporting                   │
│  - Eventual user interaction          - No user interaction                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key insight:** Background agents are MORE restricted than async mode because:
1. They run without ANY user interaction capability
2. They're used for coordination, not execution
3. File modifications could cause unreviewed changes
4. The parent agent retains responsibility for actual work

### 8.3 Permission Context State Machine

**How permission context evolves through the session:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PERMISSION CONTEXT STATE MACHINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Initial State (at CLI entry)                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ ToolPermissionContext {                                              │    │
│  │   mode: "default" | "plan" | "acceptEdits" | "bypassPermissions",   │    │
│  │   alwaysAllowRules: {                                                │    │
│  │     userSettings: [],                                                │    │
│  │     projectSettings: [],                                             │    │
│  │     localSettings: [],                                               │    │
│  │     cliArg: [...from --allowed-tools],                               │    │
│  │     session: []                                                      │    │
│  │   },                                                                 │    │
│  │   alwaysDenyRules: { ... },                                          │    │
│  │   alwaysAskRules: { ... },                                           │    │
│  │   additionalWorkingDirectories: Map { ... },                        │    │
│  │   isBypassPermissionsModeAvailable: boolean                         │    │
│  │ }                                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Update Actions (via Ez reducer):                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ setMode:           Change permission mode                            │    │
│  │ addRules:          Add rules to allow/deny/ask                       │    │
│  │ replaceRules:      Replace all rules for a source                    │    │
│  │ removeRules:       Remove specific rules                             │    │
│  │ addDirectories:    Add working directories                           │    │
│  │ removeDirectories: Remove working directories                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  State Flow:                                                                │
│                                                                              │
│  CLI Entry ──► Parse flags ──► Build initial context ──► Session start      │
│      │                                       │                              │
│      │                                       ▼                              │
│      │                              Settings updates                        │
│      │                              (via U84)                               │
│      │                                       │                              │
│      │                                       ▼                              │
│      │                              User approval flows                     │
│      │                              (addRules via session)                  │
│      │                                       │                              │
│      └───────────────────────────────────────┘                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.4 Composite Permission Context Pattern

**Why there's no single `assembleSessionToolSet` function:**

The permission context architecture deliberately avoids a monolithic "build everything in one place" pattern. Instead, it uses a **composite pattern** with a reducer at its core.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPOSITE PERMISSION CONTEXT PATTERN                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ❌ ANTI-PATTERN: Monolithic Builder                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ function assembleSessionToolSet(flags, settings, env, mcpTools) {  │   │
│  │     // 500 lines of nested if/else                                  │   │
│  │     // Hard to test individual pieces                              │   │
│  │     // Difficult to extend with new sources                        │   │
│  │     // No clear separation of concerns                             │   │
│  │ }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ✅ ACTUAL PATTERN: Composite with Reducer                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐        │   │
│  │  │ CLI Flags     │   │ User Settings │   │ Project Config│        │   │
│  │  └───────┬───────┘   └───────┬───────┘   └───────┬───────┘        │   │
│  │          │                   │                   │                 │   │
│  │          └───────────────────┼───────────────────┘                 │   │
│  │                              ▼                                     │   │
│  │                  ┌───────────────────────┐                        │   │
│  │                  │  Permission Updates   │                        │   │
│  │                  │  [{type, ...payload}] │                        │   │
│  │                  └───────────┬───────────┘                        │   │
│  │                              │                                     │   │
│  │                              ▼                                     │   │
│  │                  ┌───────────────────────┐                        │   │
│  │                  │  Ez Reducer           │                        │   │
│  │                  │  (Pure Function)      │                        │   │
│  │                  │                       │                        │   │
│  │                  │  state → action →     │                        │   │
│  │                  │    newState           │                        │   │
│  │                  └───────────┬───────────┘                        │   │
│  │                              │                                     │   │
│  │                              ▼                                     │   │
│  │                  ┌───────────────────────┐                        │   │
│  │                  │ Permission Context    │                        │   │
│  │                  │ {                     │                        │   │
│  │                  │   mode,               │                        │   │
│  │                  │   alwaysAllowRules,   │                        │   │
│  │                  │   alwaysDenyRules,    │                        │   │
│  │                  │   alwaysAskRules,     │                        │   │
│  │                  │   additionalDirs      │                        │   │
│  │                  │ }                     │                        │   │
│  │                  └───────────────────────┘                        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Benefits of the composite pattern:**

| Aspect | Composite Pattern | Monolithic Builder |
|--------|-------------------|-------------------|
| Testability | Each update type tested independently | Must test entire function |
| Extensibility | Add new update type in one switch case | Modify large function |
| Debuggability | Log each update individually | Hard to trace single source |
| Time-travel | Store update history, replay/undo | Must snapshot entire state |
| Parallelization | Updates can be computed in parallel | Sequential processing only |

**The `_v` batch update optimization:**

```javascript
// ============================================
// applyPermissionUpdates - Batch update optimization
// Location: chunks.53.mjs:1296-1300
// ============================================

// ORIGINAL (for source lookup):
function _v(A, q) {
    return q.reduce((K, Y) => Ez(K, Y), A)
}

// READABLE (for understanding):
function applyPermissionUpdates(initialContext, updates) {
    // Apply each update sequentially using reduce
    // This enables:
    // 1. Debugging individual updates
    // 2. Storing update history for undo
    // 3. Logging each transformation
    return updates.reduce(
        (context, update) => permissionContextReducer(context, update),
        initialContext
    );
}

// Mapping: _v→applyPermissionUpdates, A→initialContext, q→updates,
//          K→context, Y→update, Ez→permissionContextReducer
```

**Why `reduce` pattern:** The `reduce` operation:
1. Applies updates in order (CLI args override settings which override defaults)
2. Produces a single final context
3. Enables easy logging of intermediate states
4. Supports time-travel debugging by storing the updates array

**Update type routing in Ez reducer:**

```javascript
// Each update type is a separate case in the switch statement
switch (update.type) {
    case "setMode":           // Change permission mode
    case "addRules":          // Add allow/deny/ask rules
    case "replaceRules":      // Replace all rules of a type
    case "removeRules":       // Remove specific rules
    case "addDirectories":    // Add working directories
    case "removeDirectories": // Remove working directories
    default:                  // Unknown update, return unchanged
}
```

**Key insight:** The composite pattern transforms permission context building from a procedural "do everything in order" approach into a declarative "describe what you want" approach. Each update is a self-contained description of a change, and the reducer is a pure function that applies that change. This separation of "what to do" from "how to do it" is the foundation of the permission system's flexibility.

---

## 9. Cross-Feature Connections

### 9.1 Connection to 04_system_reminder

The CLI tool configuration affects system reminder attachment producers:

| CLI Flag | Attachment Producer Affected |
|----------|------------------------------|
| `--dangerously-skip-permissions` | Permission prompts suppressed |
| `--allowed-tools` | Tool approval reminders reduced |
| `--disallowed-tools` | Tool denial reminders pre-cached |
| `--permission-mode` | Changes permission prompt behavior |

### 9.2 Connection to 05_tools

Tool filtering integrates with the Tools module:

| Function | Role |
|----------|------|
| `getDefaultTools` (tD) | Discovers available built-in tools |
| `filterToolsByMode` (Xk8) | Applies mode restrictions |
| `resolveToolFilter` (_c) | Validates tool requests |
| `matchesTool` (z3) | Name/alias matching |

### 9.3 Connection to 08_subagent

Subagent execution uses restricted tool sets:

| Context | Tool Set |
|---------|----------|
| Delegate mode | DELEGATE_ALLOWED_TOOLS (subset of eP1) |
| Background agent | BACKGROUND_AGENT_TOOLS (WY4) |
| Plan mode subagent | PLAN_ALLOWED_TOOLS + ASYNC_ALLOWED |

### 9.4 Connection to 11_hooks

Hooks can modify permission context:

| Hook Type | Permission Effect |
|-----------|-------------------|
| `PreToolUse` | Can deny tool or modify input |
| `PermissionRequest` | Can auto-approve/deny permissions |
| `SessionStart` | Can pre-configure permission rules |

---

## 10. Symbol Reference Summary

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tools, State Management
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - CLI Module
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Permissions Module

Key symbols verified in this document:
- `Ez` (permissionContextReducer) - chunks.53.mjs:1224
- `_v` (applyPermissionUpdates) - chunks.53.mjs:1296
- `Xk8` (filterToolsByMode) - chunks.93.mjs:1568
- `_c` (resolveToolFilter) - chunks.93.mjs:1590
- `z3` (matchesTool) - chunks.56.mjs:1588
- `CW6` (EXCLUDED_TOOLS) - chunks.91.mjs:269
- `eP1` (ASYNC_ALLOWED_TOOLS) - chunks.91.mjs:269
- `WY4` (BACKGROUND_AGENT_TOOLS) - chunks.91.mjs:269
- `xV8` (NON_BUILTIN_EXCLUDED) - chunks.91.mjs:269
