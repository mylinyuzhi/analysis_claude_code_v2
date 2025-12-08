# Application State Management

> Symbol mappings: [symbol_index.md](../00_overview/symbol_index.md#module-state-management)

## Table of Contents

1. [Overview](#overview)
2. [State Architecture](#state-architecture)
3. [State Structure](#state-structure)
4. [State Initialization Flow](#state-initialization-flow)
5. [State Initialization Helpers](#state-initialization-helpers)
6. [React Context Implementation](#react-context-implementation)
7. [State Change Callback](#state-change-callback)
8. [Individual Field Update Patterns](#individual-field-update-patterns)
9. [State Persistence](#state-persistence)
10. [Summary](#summary)

---

## Overview

Claude Code v2.0.59 uses a centralized application state object (`f0`) that manages all runtime state for the interactive mode. The state management is built on React Context API with:

- **Single source of truth**: One `f0` object containing all state
- **Immutable updates**: Spread operator pattern for state changes
- **Change detection**: Callback system (`Yu`) for persistence
- **Session-aware**: Per-session state tracking (todos, file history)

**Key Components:**
- `f0` (appState) - Main state object created in chunks.158.mjs
- `wp()` (getDefaultAppState) - Factory function for default state
- `yG` (AppStateProvider) - React context provider
- `OQ` (useAppState) - Hook to access state in components
- `Yu` (onChangeAppState) - Callback for state change persistence

---

## State Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLI Entry (mu3)                              │
│                   chunks.158.mjs:1438                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Main Handler (hu3)                             │
│                   chunks.158.mjs:3                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              State Initialization                          │ │
│  │                                                            │ │
│  │  1. $T()  → Load Settings                                  │ │
│  │  2. e1()  → Get/Create Session ID                          │ │
│  │  3. _E9() → Initialize Tool Permissions                    │ │
│  │  4. Kf2() → Load Agent Definitions                         │ │
│  │  5. $21() → Initialize MCP Servers                         │ │
│  │  6. VrA() → Check Thinking Mode                            │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                Create State Object (f0)                          │
│                chunks.158.mjs:353-415                            │
│                                                                  │
│  {                                                               │
│    settings, backgroundTasks, verbose, mainLoopModel,           │
│    toolPermissionContext, agentDefinitions, mcp, plugins,       │
│    notifications, elicitation, todos, fileHistory,              │
│    thinkingEnabled, feedbackSurvey, sessionHooks,               │
│    promptSuggestion, queuedCommands, gitDiff                    │
│  }                                                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌───────────────────────┐     ┌───────────────────────────────────┐
│   Interactive Mode    │     │      Non-Interactive Mode          │
│                       │     │                                    │
│  AppStateProvider     │     │  Direct state mutation             │
│  (yG)                 │     │  via callback                      │
│       │               │     │                                    │
│       ▼               │     │  Rw9() handler                     │
│  useAppState (OQ)     │     │  chunks.156.mjs:2934               │
│       │               │     │                                    │
│       ▼               │     └───────────────────────────────────┘
│  Components update    │
│  state via setter     │
│       │               │
│       ▼               │
│  Yu() callback        │
│  persists changes     │
└───────────────────────┘
```

---

## State Structure

### State Field Summary

| Field | Type | Persistence | Description |
|-------|------|-------------|-------------|
| `settings` | Object | Config files | User and project settings |
| `backgroundTasks` | Object | Ephemeral | Running background task states |
| `verbose` | boolean | Settings file | Debug output mode |
| `mainLoopModel` | string \| null | userSettings | Default model for session |
| `mainLoopModelForSession` | string \| null | Ephemeral | Per-session model override |
| `showExpandedTodos` | boolean | Settings file | Todo panel expansion state |
| `statusLineText` | string \| undefined | Ephemeral | Custom status line message |
| `toolPermissionContext` | Object | Mixed | Tool permission configuration |
| `agentDefinitions` | Object | Config-based | Available agents |
| `mcp` | Object | Ephemeral | MCP clients, tools, commands |
| `plugins` | Object | Ephemeral | Plugin system state |
| `notifications` | Object | Ephemeral | Notification queue and current |
| `elicitation` | Object | Ephemeral | User input request queue |
| `todos` | Object | JSON per session | Todo lists keyed by session |
| `fileHistory` | Object | Session snapshots | File tracking for undo |
| `thinkingEnabled` | boolean | userSettings | Extended thinking mode |
| `feedbackSurvey` | Object | Settings file | Survey display tracking |
| `sessionHooks` | Object | Config-based | Custom lifecycle hooks |
| `promptSuggestion` | Object | Ephemeral | Suggested prompt state |
| `queuedCommands` | Array | Ephemeral | Commands waiting to execute |
| `gitDiff` | Object | In-memory | Git diff tracking |

### Main State Object (f0)

```javascript
// ============================================
// appState - Main application state object
// Location: chunks.158.mjs:353-415
// ============================================

// ORIGINAL (for source lookup):
let k0 = e1(),
  f0 = {
    settings: $T(),
    backgroundTasks: {},
    verbose: e ?? N1().verbose ?? !1,
    mainLoopModel: UkA(),
    mainLoopModelForSession: null,
    showExpandedTodos: N1().showExpandedTodos ?? !1,
    toolPermissionContext: oA,
    agentDefinitions: v1,
    mcp: {
      clients: [],
      tools: [],
      commands: [],
      resources: {}
    },
    plugins: {
      enabled: [],
      disabled: [],
      commands: [],
      agents: [],
      errors: [],
      installationStatus: {
        marketplaces: [],
        plugins: []
      }
    },
    statusLineText: void 0,
    notifications: {
      current: null,
      queue: KA ? [{
        key: "permission-mode-notification",
        text: KA,
        priority: "high"
      }] : []
    },
    elicitation: {
      queue: []
    },
    todos: {
      [k0]: Nh(k0)
    },
    fileHistory: {
      snapshots: [],
      trackedFiles: new Set
    },
    thinkingEnabled: VrA(),
    feedbackSurvey: {
      timeLastShown: null,
      submitCountAtLastAppearance: null
    },
    sessionHooks: {},
    promptSuggestion: {
      text: null,
      shownAt: 0
    },
    queuedCommands: [],
    gitDiff: {
      stats: null,
      hunks: new Map,
      lastUpdated: 0,
      version: 0
    }
  };

// READABLE (for understanding):
let todoSessionId = getSessionId(),
  appState = {
    // ========================================
    // Core Configuration
    // ========================================
    settings: loadSettings(),
    // Merged settings from user/project/local config files

    // ========================================
    // Background Task Tracking
    // ========================================
    backgroundTasks: {},
    // Map: { [taskId]: { id, command, startTime, status, output } }

    // ========================================
    // Debug/Logging
    // ========================================
    verbose: verboseFlag ?? getSettings().verbose ?? false,
    // Verbose logging mode (CLI flag > config > default)

    // ========================================
    // Model Configuration
    // ========================================
    mainLoopModel: getInitialMainLoopModel(),
    // Default model resolved from: CLI > env > config > default

    mainLoopModelForSession: null,
    // Per-session model override (set during session)

    // ========================================
    // UI State
    // ========================================
    showExpandedTodos: getSettings().showExpandedTodos ?? false,
    // Whether todo panel is expanded

    statusLineText: undefined,
    // Custom status line message (optional)

    // ========================================
    // Tool Permissions
    // ========================================
    toolPermissionContext: toolPermissionContext,
    // From initializeToolPermissionContext():
    // {
    //   mode: "default" | "bypassPermissions",
    //   additionalWorkingDirectories: Map,
    //   alwaysAllowRules: { cliArg: [], settings: [] },
    //   alwaysDenyRules: { cliArg: [], settings: [] },
    //   alwaysAskRules: {},
    //   isBypassPermissionsModeAvailable: boolean
    // }

    // ========================================
    // Agent System
    // ========================================
    agentDefinitions: agentDefinitions,
    // From loadAgentDefinitions():
    // {
    //   allAgents: Agent[],      // Built-in + custom agents
    //   activeAgents: Agent[],   // Currently enabled agents
    //   failedFiles?: []         // Files that failed to parse
    // }

    // ========================================
    // MCP (Model Context Protocol) State
    // ========================================
    mcp: {
      clients: [],
      // MCPClient instances (populated async)

      tools: [],
      // Tools from MCP servers: { name, description, inputSchema }

      commands: [],
      // Commands from MCP servers: { name, description, arguments }

      resources: {}
      // Resources: { [uri]: { content, mimeType } }
    },

    // ========================================
    // Plugin System State
    // ========================================
    plugins: {
      enabled: [],      // Enabled plugin IDs
      disabled: [],     // Disabled plugin IDs
      commands: [],     // Plugin-provided commands
      agents: [],       // Plugin-provided agents
      errors: [],       // Plugin errors: { pluginId, error, timestamp }
      installationStatus: {
        marketplaces: [], // { name, lastUpdated, status }
        plugins: []       // { id, version, installed, enabled }
      }
    },

    // ========================================
    // Notification System
    // ========================================
    notifications: {
      current: null,
      // Currently displayed: { key, text, priority, timeoutMs }

      queue: permissionWarning ? [{
        key: "permission-mode-notification",
        text: permissionWarning,
        priority: "high"
      }] : []
      // Queued notifications (priority: "immediate" | "high" | "medium" | "low")
    },

    // ========================================
    // User Input Elicitation
    // ========================================
    elicitation: {
      queue: []
      // Pending input requests: { prompt, type, validator, resolve, reject }
    },

    // ========================================
    // Todo List Management
    // ========================================
    todos: {
      [todoSessionId]: readTodosFromFile(todoSessionId)
      // Todo list per session:
      // {
      //   items: [{ content, status, activeForm }],
      //   expanded: boolean,
      //   lastUpdated: timestamp
      // }
    },

    // ========================================
    // File History Tracking
    // ========================================
    fileHistory: {
      snapshots: [],
      // Historical file content: { path, content, timestamp, operation }

      trackedFiles: new Set()
      // Set of file paths being tracked
    },

    // ========================================
    // Feature Flags
    // ========================================
    thinkingEnabled: isExtendedThinkingEnabled(),
    // Extended thinking mode (Opus-specific)

    // ========================================
    // Feedback Survey
    // ========================================
    feedbackSurvey: {
      timeLastShown: null,
      submitCountAtLastAppearance: null
    },

    // ========================================
    // Session Lifecycle Hooks
    // ========================================
    sessionHooks: {},
    // { [eventName]: hookFunction[] }

    // ========================================
    // Prompt Suggestions
    // ========================================
    promptSuggestion: {
      text: null,
      shownAt: 0
    },

    // ========================================
    // Command Queue
    // ========================================
    queuedCommands: [],
    // Commands waiting: { name, args, priority }

    // ========================================
    // Git Integration
    // ========================================
    gitDiff: {
      stats: null,         // { additions, deletions }
      hunks: new Map(),    // Map<filePath, Hunk[]>
      lastUpdated: 0,
      version: 0           // For change detection
    }
  };

// Mapping: f0→appState, k0→todoSessionId, e→verboseFlag, N1()→getSettings(),
// $T()→loadSettings(), UkA()→getInitialMainLoopModel(), VrA()→isExtendedThinkingEnabled(),
// oA→toolPermissionContext, v1→agentDefinitions, KA→permissionWarning, Nh→readTodosFromFile
```

### Default State Factory (wp)

```javascript
// ============================================
// getDefaultAppState - Factory function for default state
// Location: chunks.70.mjs:2336-2397
// ============================================

// ORIGINAL (for source lookup):
function wp() {
  return {
    settings: $T(),
    backgroundTasks: {},
    verbose: !1,
    mainLoopModel: null,
    mainLoopModelForSession: null,
    statusLineText: void 0,
    showExpandedTodos: !1,
    toolPermissionContext: ZE(),
    agentDefinitions: {
      activeAgents: [],
      allAgents: []
    },
    fileHistory: {
      snapshots: [],
      trackedFiles: new Set
    },
    mcp: {
      clients: [],
      tools: [],
      commands: [],
      resources: {}
    },
    plugins: {
      enabled: [],
      disabled: [],
      commands: [],
      agents: [],
      errors: [],
      installationStatus: {
        marketplaces: [],
        plugins: []
      }
    },
    todos: {},
    notifications: {
      current: null,
      queue: []
    },
    elicitation: {
      queue: []
    },
    thinkingEnabled: VrA(),
    feedbackSurvey: {
      timeLastShown: null,
      submitCountAtLastAppearance: null
    },
    sessionHooks: {},
    promptSuggestion: {
      text: null,
      shownAt: 0
    },
    queuedCommands: [],
    gitDiff: {
      stats: null,
      hunks: new Map,
      lastUpdated: 0,
      version: 0
    }
  }
}

// READABLE (for understanding):
function getDefaultAppState() {
  return {
    settings: loadSettings(),
    backgroundTasks: {},
    verbose: false,
    mainLoopModel: null,
    mainLoopModelForSession: null,
    statusLineText: undefined,
    showExpandedTodos: false,
    toolPermissionContext: initializeDefaultToolPermissions(),
    agentDefinitions: {
      activeAgents: [],
      allAgents: []
    },
    fileHistory: {
      snapshots: [],
      trackedFiles: new Set()
    },
    mcp: {
      clients: [],
      tools: [],
      commands: [],
      resources: {}
    },
    plugins: {
      enabled: [],
      disabled: [],
      commands: [],
      agents: [],
      errors: [],
      installationStatus: {
        marketplaces: [],
        plugins: []
      }
    },
    todos: {},
    notifications: {
      current: null,
      queue: []
    },
    elicitation: {
      queue: []
    },
    thinkingEnabled: isExtendedThinkingEnabled(),
    feedbackSurvey: {
      timeLastShown: null,
      submitCountAtLastAppearance: null
    },
    sessionHooks: {},
    promptSuggestion: {
      text: null,
      shownAt: 0
    },
    queuedCommands: [],
    gitDiff: {
      stats: null,
      hunks: new Map(),
      lastUpdated: 0,
      version: 0
    }
  }
}

// Mapping: wp→getDefaultAppState, $T→loadSettings, ZE→initializeDefaultToolPermissions, VrA→isExtendedThinkingEnabled
```

**Key Difference from f0:**
- `wp()` uses minimal defaults (empty objects, null model)
- `f0` is fully initialized with CLI args and loaded configurations

---

## State Initialization Flow

### Initialization Sequence

```
┌──────────────────────────────────────────────────────────────────┐
│ 0ms    │ CLI parsing complete (Commander.js)                     │
├────────┼─────────────────────────────────────────────────────────┤
│ 10ms   │ Settings loaded ($T)                                    │
│        │ - ~/.claude/settings.json (user)                        │
│        │ - .claude/settings.json (project)                       │
│        │ - .claude/settings.local.json (local)                   │
├────────┼─────────────────────────────────────────────────────────┤
│ 15ms   │ Session ID resolved (e1)                                │
│        │ - Get existing or generate new UUID                     │
├────────┼─────────────────────────────────────────────────────────┤
│ 20ms   │ Tool permissions configured (_E9)                       │
│        │ - Merge CLI flags + config + feature flags              │
├────────┼─────────────────────────────────────────────────────────┤
│ 25ms   │ Model configuration resolved (UkA)                      │
│        │ - Priority: CLI > env > config > default                │
├────────┼─────────────────────────────────────────────────────────┤
│ 50ms   │ Agent definitions loaded (Kf2)                          │
│        │ - Parse AGENTS.md files                                 │
│        │ - Merge built-in + custom agents                        │
├────────┼─────────────────────────────────────────────────────────┤
│ 100ms  │ Initial state object created (f0)                       │
├────────┼─────────────────────────────────────────────────────────┤
│ 150ms  │ MCP servers start connecting ($21)                      │
│        │ - Async, doesn't block rendering                        │
├────────┼─────────────────────────────────────────────────────────┤
│ 200ms  │ Plugins begin loading                                   │
├────────┼─────────────────────────────────────────────────────────┤
│ 500ms  │ UI renders with initial state                           │
├────────┼─────────────────────────────────────────────────────────┤
│ 1000ms │ MCP servers connected (async completion)                │
│        │ - State updated with tools/commands                     │
├────────┼─────────────────────────────────────────────────────────┤
│ 1500ms │ State updated with MCP tools/commands                   │
├────────┼─────────────────────────────────────────────────────────┤
│ 2000ms │ Plugins loaded and activated                            │
└────────┴─────────────────────────────────────────────────────────┘
```

---

## State Initialization Helpers

### Settings Loading ($T and Cf3)

```javascript
// ============================================
// loadAllSettings - Load and merge all settings sources
// Location: chunks.154.mjs:2439-2475
// ============================================

// ORIGINAL (for source lookup):
function Cf3() {
  let A = {}, Q = [], B = new Set, G = new Set;
  for (let I of ls()) {
    let Y = Gw(I);
    if (!Y) continue;
    let J = xSA(Y);
    if (G.has(J)) continue;
    G.add(J);
    let { settings: W, errors: X } = Ez9(Y);
    for (let V of X) {
      let F = `${V.file}:${V.path}:${V.message}`;
      if (!B.has(F)) B.add(F), Q.push(V)
    }
    if (W) A = rX1(A, W, (V, F) => {
      if (Array.isArray(V) && Array.isArray(F)) return Hf3(V, F);
      return
    })
  }
  let Z = ["user", "project", "local"];
  return Q.push(...Z.flatMap((I) => sX(I).errors)), {
    settings: A,
    errors: Q
  }
}

function $T() {
  let { settings: A } = wa();
  return A || {}
}

function wa() {
  if (vSA !== null) return vSA;
  return vSA = Cf3(), vSA
}

// READABLE (for understanding):
function loadAllSettings() {
  let settings = {};
  let errors = [];
  let seenErrors = new Set();
  let processedPaths = new Set();

  // Iterate through all config sources
  for (let configSource of getConfigSources()) {
    let configPath = resolveConfigPath(configSource);
    if (!configPath) continue;

    // Skip duplicate paths
    let normalizedPath = normalizePath(configPath);
    if (processedPaths.has(normalizedPath)) continue;
    processedPaths.add(normalizedPath);

    // Parse settings file
    let { settings: sourceSettings, errors: parseErrors } = parseSettingsFile(configPath);

    // Collect unique errors
    for (let error of parseErrors) {
      let errorKey = `${error.file}:${error.path}:${error.message}`;
      if (!seenErrors.has(errorKey)) {
        seenErrors.add(errorKey);
        errors.push(error);
      }
    }

    // Deep merge with array concatenation
    if (sourceSettings) {
      settings = deepMerge(settings, sourceSettings, (existingValue, newValue) => {
        if (Array.isArray(existingValue) && Array.isArray(newValue)) {
          return concatenateArrays(existingValue, newValue);
        }
        return undefined; // Use standard merge
      });
    }
  }

  // Include validation errors from standard sources
  let standardSources = ["user", "project", "local"];
  errors.push(...standardSources.flatMap((source) => getValidationErrors(source)));

  return {
    settings: settings,
    errors: errors
  }
}

function loadSettings() {
  let { settings } = getCachedSettings();
  return settings || {}
}

function getCachedSettings() {
  if (settingsCache !== null) return settingsCache;
  return settingsCache = loadAllSettings(), settingsCache;
}

// Mapping: Cf3→loadAllSettings, $T→loadSettings, wa→getCachedSettings, vSA→settingsCache
// ls→getConfigSources, Gw→resolveConfigPath, xSA→normalizePath, Ez9→parseSettingsFile
// rX1→deepMerge, Hf3→concatenateArrays, sX→getValidationErrors
```

**How it works:**
1. Iterates through configured settings sources
2. Resolves file paths for each source
3. Skips already-processed paths
4. Parses each file and collects errors (deduplicated)
5. Deep merges with special array handling (concatenates arrays)
6. Caches result for performance

**Why this approach:**
- Supports hierarchical configuration (user → project → local)
- Arrays concatenate rather than replace (additive configuration)
- Error deduplication prevents duplicate messages
- Caching avoids repeated file I/O

### Session ID Management (e1)

```javascript
// ============================================
// getSessionId - Get current session ID
// Location: chunks.1.mjs:2473-2483
// ============================================

// ORIGINAL (for source lookup):
function e1() {
  return WQ.sessionId
}

function qE0() {
  return WQ.sessionId = wE0(), WQ.sessionId
}

function zR(A) {
  if (WQ.sessionId = A, process.env.CLAUDE_CODE_SESSION_ID !== void 0) {
    process.env.CLAUDE_CODE_SESSION_ID = A
  }
}

// READABLE (for understanding):
function getSessionId() {
  return globalSessionState.sessionId
}

function generateNewSessionId() {
  return globalSessionState.sessionId = generateRandomUUID(), globalSessionState.sessionId
}

function setSessionId(newId) {
  globalSessionState.sessionId = newId;
  if (process.env.CLAUDE_CODE_SESSION_ID !== undefined) {
    process.env.CLAUDE_CODE_SESSION_ID = newId;
  }
}

// Mapping: e1→getSessionId, qE0→generateNewSessionId, zR→setSessionId, WQ→globalSessionState, wE0→generateRandomUUID
```

### Tool Permission Context (_E9)

```javascript
// ============================================
// initializeToolPermissionContext - Build permission context from all sources
// Location: chunks.153.mjs:1602-1657
// ============================================

// ORIGINAL (for source lookup):
function _E9({
  allowedToolsCli: A,
  disallowedToolsCli: Q,
  baseToolsCli: B,
  permissionMode: G,
  allowDangerouslySkipPermissions: Z,
  addDirs: I
}) {
  let Y = w0A(A), J = w0A(Q);
  if (B && B.length > 0) {
    let U = Vb3(B), q = new Set(U), N = DV0().filter((R) => !q.has(R));
    J = [...J, ...N]
  }
  let W = [], X = new Map, V = process.env.PWD;
  if (V && V !== uQ() && Fb3({ originalCwd: uQ(), processPwd: V })) {
    X.set(V, { path: V, source: "session" })
  }
  let F = o2("tengu_disable_bypass_permissions_mode"), K = l0() || {}, D = K.permissions?.disableBypassPermissionsMode === "disable",
    C = jE9({ mode: G, additionalWorkingDirectories: X, alwaysAllowRules: { cliArg: Y }, alwaysDenyRules: { cliArg: J },
      alwaysAskRules: {}, isBypassPermissionsModeAvailable: (G === "bypassPermissions" || Z) && !F && !D }, IxA()),
    E = [...K.permissions?.additionalDirectories || [], ...I];
  for (let U of E) {
    let q = XSA(U, C);
    if (q.resultType === "success") {
      C = UF(C, { type: "addDirectories", directories: [q.absolutePath], destination: "cliArg" })
    } else if (q.resultType !== "alreadyInWorkingDirectory") {
      W.push(VSA(q))
    }
  }
  return { toolPermissionContext: C, warnings: W }
}

// READABLE (for understanding):
function initializeToolPermissionContext({
  allowedToolsCli,
  disallowedToolsCli,
  baseToolsCli,
  permissionMode,
  allowDangerouslySkipPermissions,
  addDirs
}) {
  // Normalize tool lists from CLI args
  let allowedTools = normalizeToolList(allowedToolsCli);
  let deniedTools = normalizeToolList(disallowedToolsCli);

  // If base tools specified, deny everything else
  if (baseToolsCli && baseToolsCli.length > 0) {
    let baseToolsNormalized = normalizeBaseTools(baseToolsCli);
    let baseToolsSet = new Set(baseToolsNormalized);
    let allTools = getAllAvailableTools();
    let toolsNotInBase = allTools.filter((tool) => !baseToolsSet.has(tool));
    deniedTools = [...deniedTools, ...toolsNotInBase];
  }

  let warnings = [];
  let additionalWorkingDirs = new Map();
  let currentProcessDir = process.env.PWD;

  // Add process PWD if different from original cwd
  if (currentProcessDir && currentProcessDir !== getOriginalCwd() &&
      isValidWorkingDirectory({ originalCwd: getOriginalCwd(), processPwd: currentProcessDir })) {
    additionalWorkingDirs.set(currentProcessDir, {
      path: currentProcessDir,
      source: "session"
    });
  }

  // Check if bypass mode is disabled
  let isBypassDisabledViaStatsig = checkFeatureFlag("tengu_disable_bypass_permissions_mode");
  let settings = getSettings() || {};
  let isBypassDisabledViaSettings = settings.permissions?.disableBypassPermissionsMode === "disable";

  // Create initial context
  let permissionContext = createToolPermissionContext({
    mode: permissionMode,
    additionalWorkingDirectories: additionalWorkingDirs,
    alwaysAllowRules: { cliArg: allowedTools },
    alwaysDenyRules: { cliArg: deniedTools },
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable:
      (permissionMode === "bypassPermissions" || allowDangerouslySkipPermissions) &&
      !isBypassDisabledViaStatsig &&
      !isBypassDisabledViaSettings
  }, getCurrentToolPermissions());

  // Add additional directories
  let dirsToAdd = [
    ...settings.permissions?.additionalDirectories || [],
    ...addDirs
  ];
  for (let dirPath of dirsToAdd) {
    let result = validateAndNormalizeDirectory(dirPath, permissionContext);
    if (result.resultType === "success") {
      permissionContext = updatePermissionContext(permissionContext, {
        type: "addDirectories",
        directories: [result.absolutePath],
        destination: "cliArg"
      });
    } else if (result.resultType !== "alreadyInWorkingDirectory") {
      warnings.push(formatValidationError(result));
    }
  }

  return {
    toolPermissionContext: permissionContext,
    warnings: warnings
  }
}

// Mapping: _E9→initializeToolPermissionContext, w0A→normalizeToolList, Vb3→normalizeBaseTools
// DV0→getAllAvailableTools, uQ→getOriginalCwd, Fb3→isValidWorkingDirectory
// o2→checkFeatureFlag, l0→getSettings, jE9→createToolPermissionContext
// IxA→getCurrentToolPermissions, XSA→validateAndNormalizeDirectory
// UF→updatePermissionContext, VSA→formatValidationError
```

**Permission Context Structure:**
```javascript
{
  mode: "default" | "bypassPermissions",
  additionalWorkingDirectories: Map<string, { path, source }>,
  alwaysAllowRules: { cliArg: string[], settings: string[] },
  alwaysDenyRules: { cliArg: string[], settings: string[] },
  alwaysAskRules: {},
  isBypassPermissionsModeAvailable: boolean
}
```

### Extended Thinking Detection (VrA)

```javascript
// ============================================
// isExtendedThinkingEnabled - Check if thinking mode is available
// Location: chunks.70.mjs:2295-2303
// ============================================

// ORIGINAL (for source lookup):
function VrA() {
  if (process.env.MAX_THINKING_TOKENS) return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  let Q = l0().alwaysThinkingEnabled;
  if (Q === !0 || Q === !1) return Q;
  let B = k3();
  if (B.includes("claude-sonnet-4-5")) return !0;
  if (B.includes("claude-opus-4-5")) return BZ("tengu_deep_ocean_current", "on_by_default", !1);
  return !1
}

// READABLE (for understanding):
function isExtendedThinkingEnabled() {
  // Priority 1: Environment variable
  if (process.env.MAX_THINKING_TOKENS) {
    return parseInt(process.env.MAX_THINKING_TOKENS, 10) > 0;
  }

  // Priority 2: Explicit setting
  let settingsValue = getSettings().alwaysThinkingEnabled;
  if (settingsValue === true || settingsValue === false) {
    return settingsValue;
  }

  // Priority 3: Model capability detection
  let modelName = getCurrentModel();
  if (modelName.includes("claude-sonnet-4-5")) {
    return true;  // Sonnet 4.5 always has thinking
  }
  if (modelName.includes("claude-opus-4-5")) {
    // Opus 4.5: check feature flag (defaults to false)
    return checkFeatureFlag("tengu_deep_ocean_current", "on_by_default", false);
  }

  return false;
}

// Mapping: VrA→isExtendedThinkingEnabled, l0→getSettings, k3→getCurrentModel, BZ→checkFeatureFlag
```

**Priority Order:**
1. Environment: `MAX_THINKING_TOKENS > 0`
2. Settings: `alwaysThinkingEnabled`
3. Model capability: Sonnet 4.5 → true
4. Feature flag: Opus 4.5 + Statsig check
5. Default: false

### Agent Definitions Loading (Kf2)

```javascript
// ============================================
// loadAgentDefinitions - Load and parse all agent definitions
// Location: chunks.125.mjs:1799-1846
// ============================================

// ORIGINAL (for source lookup):
Kf2 = s1(async () => {
  try {
    let A = await _n("agents"), Q = [], B = A.map(({
      filePath: J, baseDir: W, frontmatter: X, content: V, source: F
    }) => {
      let K = ei5(J, W, X, V, F);
      if (!K) {
        let D = oi5(X);
        return Q.push({ path: J, error: D }), g(`Failed to parse agent from ${J}: ${D}`),
          GA("tengu_agent_parse_error", { error: D, location: F }), null
      }
      return K
    }).filter((J) => J !== null), G = await _0A(), I = [...N70(), ...G, ...B], Y = ky(I);
    for (let J of Y) if (J.color) jWA(J.agentType, J.color);
    return { activeAgents: Y, allAgents: I, failedFiles: Q.length > 0 ? Q : void 0 }
  } catch (A) {
    let Q = A instanceof Error ? A.message : String(A);
    g(`Error loading agent definitions: ${Q}`), AA(A instanceof Error ? A : Error(String(A)));
    let B = N70();
    return { activeAgents: B, allAgents: B, failedFiles: [{ path: "unknown", error: Q }] }
  }
})

// READABLE (for understanding):
const loadAgentDefinitions = createCachedAsyncTask(async () => {
  try {
    // Load all AGENTS.md files
    let agentFiles = await loadAgentsFromDisk("agents");
    let failedParsing = [];

    // Parse each agent file
    let parsedAgents = agentFiles.map(({
      filePath,
      baseDir,
      frontmatter,
      content,
      source
    }) => {
      let agent = parseAgent(filePath, baseDir, frontmatter, content, source);
      if (!agent) {
        let errorMsg = formatParseError(frontmatter);
        failedParsing.push({ path: filePath, error: errorMsg });
        logger(`Failed to parse agent from ${filePath}: ${errorMsg}`);
        sendAnalytics("tengu_agent_parse_error", {
          error: errorMsg,
          location: source
        });
        return null;
      }
      return agent;
    }).filter((agent) => agent !== null);

    // Get built-in agents
    let builtInAgents = await getBuiltInAgents();

    // Combine all: defaults + built-in + user-defined
    let allAgents = [
      ...getDefaultAgents(),
      ...builtInAgents,
      ...parsedAgents
    ];

    // Filter active agents
    let activeAgents = filterActiveAgents(allAgents);

    // Store colors
    for (let agent of activeAgents) {
      if (agent.color) {
        saveAgentColor(agent.agentType, agent.color);
      }
    }

    return {
      activeAgents: activeAgents,
      allAgents: allAgents,
      failedFiles: failedParsing.length > 0 ? failedParsing : undefined
    };
  } catch (error) {
    let errorMsg = error instanceof Error ? error.message : String(error);
    logger(`Error loading agent definitions: ${errorMsg}`);
    reportError(error instanceof Error ? error : Error(String(error)));

    let defaultAgents = getDefaultAgents();
    return {
      activeAgents: defaultAgents,
      allAgents: defaultAgents,
      failedFiles: [{ path: "unknown", error: errorMsg }]
    };
  }
});

// Mapping: Kf2→loadAgentDefinitions, s1→createCachedAsyncTask, _n→loadAgentsFromDisk
// ei5→parseAgent, oi5→formatParseError, _0A→getBuiltInAgents, N70→getDefaultAgents
// ky→filterActiveAgents, jWA→saveAgentColor
```

### MCP State Initialization ($21)

```javascript
// ============================================
// initializeMcpState - Load tools/commands from MCP servers
// Location: chunks.101.mjs:3123-3162
// ============================================

// ORIGINAL (for source lookup):
$21 = s1(async (A) => {
  return new Promise((Q) => {
    let B = 0, G = 0;
    if (B = Object.keys(A).length, B === 0) {
      Q({ clients: [], tools: [], commands: [] });
      return
    }
    let Z = [], I = [], Y = [];
    v10((J) => {
      if (Z.push(J.client), I.push(...J.tools), Y.push(...J.commands), G++, G >= B) {
        let W = Y.reduce((X, V) => {
          let F = V.name.length + (V.description ?? "").length + (V.argumentHint ?? "").length;
          return X + F
        }, 0);
        GA("tengu_mcp_tools_commands_loaded", {
          tools_count: I.length,
          commands_count: Y.length,
          commands_metadata_length: W
        });
        Q({ clients: Z, tools: I, commands: Y })
      }
    }, A).catch((J) => {
      WI("prefetchAllMcpResources", `Failed to get MCP resources: ${J instanceof Error ? J.message : String(J)}`);
      Q({ clients: [], tools: [], commands: [] })
    })
  })
})

// READABLE (for understanding):
const initializeMcpState = createCachedAsyncTask(async (mcpServerConfigs) => {
  return new Promise((resolve) => {
    let expectedServerCount = Object.keys(mcpServerConfigs).length;
    let loadedServerCount = 0;

    // Early exit if no servers
    if (expectedServerCount === 0) {
      resolve({ clients: [], tools: [], commands: [] });
      return;
    }

    let allClients = [];
    let allTools = [];
    let allCommands = [];

    // Prefetch from each server
    prefetchAllMcpServers((serverResources) => {
      allClients.push(serverResources.client);
      allTools.push(...serverResources.tools);
      allCommands.push(...serverResources.commands);
      loadedServerCount++;

      // When all servers loaded
      if (loadedServerCount >= expectedServerCount) {
        // Calculate metadata size for analytics
        let totalMetadataSize = allCommands.reduce((total, cmd) => {
          return total + cmd.name.length +
                 (cmd.description ?? "").length +
                 (cmd.argumentHint ?? "").length;
        }, 0);

        sendAnalytics("tengu_mcp_tools_commands_loaded", {
          tools_count: allTools.length,
          commands_count: allCommands.length,
          commands_metadata_length: totalMetadataSize
        });

        resolve({
          clients: allClients,
          tools: allTools,
          commands: allCommands
        });
      }
    }, mcpServerConfigs).catch((error) => {
      logError("prefetchAllMcpResources",
        `Failed to get MCP resources: ${error instanceof Error ? error.message : String(error)}`);
      // Graceful fallback
      resolve({ clients: [], tools: [], commands: [] });
    });
  });
});

// Mapping: $21→initializeMcpState, v10→prefetchAllMcpServers, GA→sendAnalytics, WI→logError
```

---

## React Context Implementation

### AppStateProvider (yG)

```javascript
// ============================================
// AppStateProvider - React context provider for global state
// Location: chunks.70.mjs:2399-2437
// ============================================

// ORIGINAL (for source lookup):
function yG({
  children: A,
  initialState: Q,
  onChangeAppState: B
}) {
  if (IE.useContext(aMB)) throw Error("AppStateProvider can not be nested within another AppStateProvider");
  let [Z, I] = IE.useState({
    currentState: Q ?? wp(),
    previousState: null
  }), Y = IE.useCallback((W) => {
    I(({
      currentState: X
    }) => {
      let V = {
        currentState: W(X),
        previousState: X
      };
      return B?.({
        newState: V.currentState,
        oldState: V.previousState
      }), V
    })
  }, [B]), J = IE.useMemo(() => {
    let W = [Z.currentState, Y];
    return W.__IS_INITIALIZED__ = !0, W
  }, [Z.currentState, Y]);
  return t7A(IE.useCallback((W, X) => {
    g(`Settings changed from ${W}, updating AppState`);
    let V = IxA();
    Y((F) => ({
      ...F,
      settings: X,
      toolPermissionContext: rMB(F.toolPermissionContext, V)
    }))
  }, [Y])), IE.default.createElement(aMB.Provider, {
    value: !0
  }, IE.default.createElement(sMB.Provider, {
    value: J
  }, A))
}

// READABLE (for understanding):
function AppStateProvider({
  children,
  initialState,
  onChangeAppState
}) {
  // Prevent nested providers (would cause state conflicts)
  if (React.useContext(appStateProviderInitializedContext)) {
    throw Error("AppStateProvider can not be nested within another AppStateProvider");
  }

  // State container with current and previous for diffing
  let [stateContainer, setStateContainer] = React.useState({
    currentState: initialState ?? getDefaultAppState(),
    previousState: null
  });

  // State updater with change notification
  let updateState = React.useCallback((updaterFn) => {
    setStateContainer(({ currentState: previousState }) => {
      let newContainer = {
        currentState: updaterFn(previousState),
        previousState: previousState
      };
      // Notify parent of change
      onChangeAppState?.({
        newState: newContainer.currentState,
        oldState: newContainer.previousState
      });
      return newContainer;
    });
  }, [onChangeAppState]);

  // Memoized context value: [state, setter]
  let contextValue = React.useMemo(() => {
    let value = [stateContainer.currentState, updateState];
    value.__IS_INITIALIZED__ = true;  // Marker for validation
    return value;
  }, [stateContainer.currentState, updateState]);

  // Subscribe to settings file changes
  subscribeToSettingsChanges(React.useCallback((source, newSettings) => {
    console.log(`Settings changed from ${source}, updating AppState`);
    let permissionUpdates = loadToolPermissions();
    updateState((state) => ({
      ...state,
      settings: newSettings,
      toolPermissionContext: mergePermissionContexts(state.toolPermissionContext, permissionUpdates)
    }));
  }, [updateState]));

  // Render with nested provider flag
  return React.createElement(
    appStateProviderInitializedContext.Provider,
    { value: true },
    React.createElement(
      appStateContext.Provider,
      { value: contextValue },
      children
    )
  );
}

// Mapping: yG→AppStateProvider, A→children, Q→initialState, B→onChangeAppState
// IE→React, aMB→appStateProviderInitializedContext, sMB→appStateContext
// Z→stateContainer, I→setStateContainer, Y→updateState, J→contextValue
// t7A→subscribeToSettingsChanges, IxA→loadToolPermissions, rMB→mergePermissionContexts
```

**Key Design Points:**
1. **Nested Provider Protection** - Throws if already inside another provider
2. **State Container Pattern** - Stores both current and previous state
3. **Callback-based Updates** - Uses reducer-style pattern
4. **Initialization Flag** - `__IS_INITIALIZED__` for hook validation
5. **Settings Sync** - Auto-updates when config files change

### useAppState Hook (OQ)

```javascript
// ============================================
// useAppState - Hook to access app state and updater
// Location: chunks.70.mjs:2440-2443
// ============================================

// ORIGINAL (for source lookup):
function OQ() {
  let A = IE.useContext(sMB);
  if (!A.__IS_INITIALIZED__) throw ReferenceError("useAppState cannot be called outside of an <AppStateProvider />");
  return A
}

// READABLE (for understanding):
function useAppState() {
  let contextValue = React.useContext(appStateContext);
  if (!contextValue.__IS_INITIALIZED__) {
    throw ReferenceError("useAppState cannot be called outside of an <AppStateProvider />");
  }
  return contextValue;  // Returns [state, setState]
}

// Mapping: OQ→useAppState, A→contextValue, IE→React, sMB→appStateContext
```

**Usage Pattern:**
```javascript
// In any component inside AppStateProvider
let [appState, setAppState] = useAppState();

// Read state
let currentModel = appState.mainLoopModel;
let todos = appState.todos[sessionId];

// Update state (immutable)
setAppState((state) => ({
  ...state,
  verbose: true
}));
```

### Context Creation

```javascript
// ============================================
// Context creation
// Location: chunks.70.mjs:2460
// ============================================

// ORIGINAL:
sMB = IE.default.createContext([{}, (A) => A]),
aMB = IE.default.createContext(!1)

// READABLE:
appStateContext = React.createContext([{}, (updater) => updater]),
appStateProviderInitializedContext = React.createContext(false)
```

---

## State Change Callback

### onChangeAppState (Yu)

```javascript
// ============================================
// onChangeAppState - Callback for persisting state changes
// Location: chunks.156.mjs:2146-2183
// ============================================

// ORIGINAL (for source lookup):
function Yu({
  newState: A,
  oldState: Q
}) {
  if (A.mainLoopModel !== Q.mainLoopModel && A.mainLoopModel === null) cB("userSettings", {
    model: void 0
  }), Ts(null);
  if (A.mainLoopModel !== Q.mainLoopModel && A.mainLoopModel !== null) cB("userSettings", {
    model: A.mainLoopModel
  }), Ts(A.mainLoopModel);
  if (A.showExpandedTodos !== Q.showExpandedTodos && N1().showExpandedTodos !== A.showExpandedTodos) c0({
    ...N1(),
    showExpandedTodos: A.showExpandedTodos
  });
  if (Q !== null && A.todos !== Q.todos)
    for (let B in A.todos) UYA(A.todos[B], B);
  if (A.verbose !== Q.verbose && N1().verbose !== A.verbose) c0({
    ...N1(),
    verbose: A.verbose
  });
  if (A.thinkingEnabled !== Q.thinkingEnabled) cB("userSettings", {
    alwaysThinkingEnabled: A.thinkingEnabled
  });
  if (A.feedbackSurvey.timeLastShown !== Q.feedbackSurvey.timeLastShown && A.feedbackSurvey.timeLastShown !== null) c0({
    ...N1(),
    feedbackSurveyState: {
      lastShownTime: A.feedbackSurvey.timeLastShown
    }
  });
  if (bZ() && (A.mcp.tools.length > 0 || A.mcp.clients.length > 0 || Object.keys(A.mcp.resources).length > 0 || A.mcp !== Q.mcp)) {
    if (Yz9(A.mcp.clients, A.mcp.tools, A.mcp.resources), xVA()) pJ1()
  }
  if (A.settings !== Q.settings) try {
    LiA(), MiA()
  } catch (B) {
    AA(B instanceof Error ? B : Error(`Failed to clear auth caches: ${B}`))
  }
}

// READABLE (for understanding):
function onChangeAppState({ newState, oldState }) {
  // ========================================
  // Model Changes
  // ========================================
  if (newState.mainLoopModel !== oldState.mainLoopModel) {
    if (newState.mainLoopModel === null) {
      saveSettingsValue("userSettings", { model: undefined });
      setCurrentModel(null);
    } else {
      saveSettingsValue("userSettings", { model: newState.mainLoopModel });
      setCurrentModel(newState.mainLoopModel);
    }
  }

  // ========================================
  // UI Preferences
  // ========================================
  if (newState.showExpandedTodos !== oldState.showExpandedTodos &&
      getSettings().showExpandedTodos !== newState.showExpandedTodos) {
    updateSettings({
      ...getSettings(),
      showExpandedTodos: newState.showExpandedTodos
    });
  }

  // ========================================
  // Todo Persistence
  // ========================================
  if (oldState !== null && newState.todos !== oldState.todos) {
    for (let sessionId in newState.todos) {
      persistTodoData(newState.todos[sessionId], sessionId);
    }
  }

  // ========================================
  // Verbose Flag
  // ========================================
  if (newState.verbose !== oldState.verbose &&
      getSettings().verbose !== newState.verbose) {
    updateSettings({
      ...getSettings(),
      verbose: newState.verbose
    });
  }

  // ========================================
  // Thinking Mode
  // ========================================
  if (newState.thinkingEnabled !== oldState.thinkingEnabled) {
    saveSettingsValue("userSettings", {
      alwaysThinkingEnabled: newState.thinkingEnabled
    });
  }

  // ========================================
  // Feedback Survey
  // ========================================
  if (newState.feedbackSurvey.timeLastShown !== oldState.feedbackSurvey.timeLastShown &&
      newState.feedbackSurvey.timeLastShown !== null) {
    updateSettings({
      ...getSettings(),
      feedbackSurveyState: {
        lastShownTime: newState.feedbackSurvey.timeLastShown
      }
    });
  }

  // ========================================
  // MCP State Sync
  // ========================================
  if (isMcpCliEndpointEnabled() &&
      (newState.mcp.tools.length > 0 ||
       newState.mcp.clients.length > 0 ||
       Object.keys(newState.mcp.resources).length > 0 ||
       newState.mcp !== oldState.mcp)) {
    updateMcpState(newState.mcp.clients, newState.mcp.tools, newState.mcp.resources);
    if (isMcpCliEndpointRunning()) {
      updateMcpCliState();
    }
  }

  // ========================================
  // Settings Change - Clear Auth Caches
  // ========================================
  if (newState.settings !== oldState.settings) {
    try {
      clearAuthTokenCache();
      clearAuthSessionCache();
    } catch (error) {
      handleError(error instanceof Error ? error : Error(`Failed to clear auth caches: ${error}`));
    }
  }
}

// Mapping: Yu→onChangeAppState, A→newState, Q→oldState, cB→saveSettingsValue
// Ts→setCurrentModel, N1→getSettings, c0→updateSettings, UYA→persistTodoData
// bZ→isMcpCliEndpointEnabled, Yz9→updateMcpState, xVA→isMcpCliEndpointRunning
// pJ1→updateMcpCliState, LiA→clearAuthTokenCache, MiA→clearAuthSessionCache, AA→handleError
```

### Monitored Properties Summary

| Property | Trigger Condition | Persistence Action |
|----------|-------------------|-------------------|
| `mainLoopModel` | Value changed | Save to userSettings, update global |
| `showExpandedTodos` | Value changed, differs from settings | Update settings file |
| `todos` | Object reference changed | Persist each session's todos |
| `verbose` | Value changed, differs from settings | Update settings file |
| `thinkingEnabled` | Value changed | Save to userSettings |
| `feedbackSurvey.timeLastShown` | Changed to non-null | Update settings file |
| `mcp.*` | Any MCP field changed | Sync to MCP CLI endpoint |
| `settings` | Object reference changed | Clear auth caches |

---

## Individual Field Update Patterns

### Todos Update

```javascript
// ============================================
// updateTodosInState - Update todo list for current agent
// Location: chunks.60.mjs:1186-1202
// ============================================

// ORIGINAL (for source lookup):
async call({
  todos: A
}, Q) {
  let G = (await Q.getAppState()).todos[Q.agentId] ?? [],
    Z = A.every((I) => I.status === "completed") ? [] : A;
  return Q.setAppState((I) => ({
    ...I,
    todos: {
      ...I.todos,
      [Q.agentId]: Z
    }
  })), {
    data: {
      oldTodos: G,
      newTodos: A
    }
  }
}

// READABLE (for understanding):
async function updateTodosInState({ todos: newTodos }, context) {
  // Get existing todos
  let existingTodos = (await context.getAppState()).todos[context.agentId] ?? [];

  // Clear if all completed, otherwise keep new list
  let todosToStore = newTodos.every((todo) => todo.status === "completed") ? [] : newTodos;

  // Update state immutably
  context.setAppState((state) => ({
    ...state,
    todos: {
      ...state.todos,
      [context.agentId]: todosToStore
    }
  }));

  return {
    data: {
      oldTodos: existingTodos,
      newTodos: newTodos
    }
  };
}

// Mapping: A→newTodos, Q→context, G→existingTodos, Z→todosToStore, I→state
```

**Key pattern:** Todos keyed by `agentId` for per-agent tracking.

### Notifications Update

```javascript
// ============================================
// useNotificationManager - Notification queue management
// Location: chunks.70.mjs:2463-2527
// ============================================

// READABLE (for understanding):
function useNotificationManager() {
  let [appState, setAppState] = useAppState();

  // Process next notification from queue
  let processNextNotification = useCallback(() => {
    setAppState((state) => {
      let nextNotification = sortNotificationsByPriority(state.notifications.queue);
      if (state.notifications.current !== null || !nextNotification) return state;

      // Schedule timeout to clear
      notificationTimeoutId = setTimeout(() => {
        notificationTimeoutId = null;
        setAppState((s) => {
          if (s.notifications.current?.key !== nextNotification.key) return s;
          return {
            ...s,
            notifications: {
              queue: s.notifications.queue,
              current: null
            }
          };
        });
        processNextNotification();
      }, nextNotification.timeoutMs ?? DEFAULT_NOTIFICATION_TIMEOUT);

      // Move next to current
      return {
        ...state,
        notifications: {
          queue: state.notifications.queue.filter((n) => n !== nextNotification),
          current: nextNotification
        }
      };
    });
  }, [setAppState]);

  // Add notification to queue
  let addNotification = useCallback((notification) => {
    if (notification.priority === "immediate") {
      // Handle immediate: clear current, show new immediately
      if (notificationTimeoutId) clearTimeout(notificationTimeoutId);
      // ... immediate handling logic
    } else {
      // Normal: add to queue with deduplication
      setAppState((state) => {
        let isDuplicate = new Set(state.notifications.queue.map((n) => n.key)).has(notification.key) ||
                          state.notifications.current?.key === notification.key;
        return {
          ...state,
          notifications: {
            current: state.notifications.current,
            queue: isDuplicate
              ? state.notifications.queue
              : [...state.notifications.queue, notification]
          }
        };
      });
      processNextNotification();
    }
  }, [setAppState, processNextNotification]);

  return { addNotification };
}

// Mapping: vZ→useNotificationManager, $U6→sortNotificationsByPriority, oMB→DEFAULT_NOTIFICATION_TIMEOUT
```

**Key patterns:**
- Queue + current pattern
- Priority support ("immediate" bypasses queue)
- Auto-timeout clearing
- Deduplication via key

### Background Tasks Update

```javascript
// ============================================
// registerBackgroundTask - Add task to tracking
// Location: chunks.121.mjs:618-627
// ============================================

// READABLE (for understanding):
setAppState((state) => ({
  ...state,
  backgroundTasks: {
    ...state.backgroundTasks,
    [taskId]: {
      id: taskId,
      command: commandString,
      startTime: Date.now(),
      status: "starting",
      output: ""
    }
  }
}));

// ============================================
// updateBackgroundTaskState - Update specific task
// Location: chunks.106.mjs:475-486
// ============================================

// ORIGINAL (for source lookup):
function q(y, v) {
  B((x) => {
    let p = x.backgroundTasks[y];
    if (p && p.type !== "shell") return x;
    return {
      ...x,
      backgroundTasks: {
        ...x.backgroundTasks,
        [y]: v(p)
      }
    }
  })
}

// READABLE (for understanding):
function updateBackgroundTaskState(taskId, updaterFn) {
  setState((state) => {
    let existingTask = state.backgroundTasks[taskId];
    // Type check: only update shell tasks
    if (existingTask && existingTask.type !== "shell") return state;
    return {
      ...state,
      backgroundTasks: {
        ...state.backgroundTasks,
        [taskId]: updaterFn(existingTask)
      }
    };
  });
}

// Mapping: q→updateBackgroundTaskState, y→taskId, v→updaterFn, x→state, p→existingTask
```

### Git Diff Update

```javascript
// ============================================
// incrementGitDiffVersion - Trigger git diff re-evaluation
// Location: chunks.122.mjs:2604-2612
// ============================================

// ORIGINAL (for source lookup):
function K51(A) {
  A((Q) => ({
    ...Q,
    gitDiff: {
      ...Q.gitDiff,
      version: Q.gitDiff.version + 1
    }
  }))
}

// READABLE (for understanding):
function incrementGitDiffVersion(setAppState) {
  setAppState((state) => ({
    ...state,
    gitDiff: {
      ...state.gitDiff,
      version: state.gitDiff.version + 1
    }
  }));
}

// Mapping: K51→incrementGitDiffVersion, A→setAppState, Q→state
```

**Key pattern:** Version increment for change detection/triggering re-renders.

### File History Update

```javascript
// ============================================
// updateFileHistoryState - Update file history
// Location: chunks.145.mjs:240-245
// ============================================

// ORIGINAL (for source lookup):
updateFileHistoryState(x4) {
  q((J8) => ({
    ...J8,
    fileHistory: x4(J8.fileHistory)
  }))
}

// READABLE (for understanding):
updateFileHistoryState(updaterFn) {
  setAppState((state) => ({
    ...state,
    fileHistory: updaterFn(state.fileHistory)
  }));
}

// Mapping: x4→updaterFn, q→setAppState, J8→state
```

### Prompt Suggestion Update

```javascript
// ============================================
// updatePromptSuggestion - Set suggested prompt
// Location: chunks.146.mjs:1598-1604
// ============================================

// READABLE (for understanding):
context.setAppState((state) => ({
  ...state,
  promptSuggestion: {
    text: suggestionText,
    shownAt: Date.now()
  }
}));
```

---

## State Persistence

### Persistence Matrix

| Field | Storage Location | Format | Trigger |
|-------|-----------------|--------|---------|
| `mainLoopModel` | ~/.claude/settings.json | JSON | Model change |
| `showExpandedTodos` | ~/.claude/settings.json | JSON | Preference toggle |
| `verbose` | ~/.claude/settings.json | JSON | Flag toggle |
| `thinkingEnabled` | ~/.claude/settings.json | JSON | Feature toggle |
| `feedbackSurvey` | ~/.claude/settings.json | JSON | Survey shown |
| `todos` | ~/.claude/todos/{sessionId}.json | JSON | Todo update |
| `fileHistory` | Session storage | Session snapshots | File operations |

### Todo Persistence

```javascript
// ============================================
// persistTodoData - Write todos to file
// Location: chunks.106.mjs:1862-1864
// ============================================

// ORIGINAL:
function UYA(A, Q) {
  gZ2(Ri(Q), A)
}

// READABLE:
function persistTodoData(todoData, sessionId) {
  writeJsonTodoFile(getTodoFilePath(sessionId), todoData);
}

// File location: ~/.claude/todos/{sessionId}.json
```

### Settings File Structure

```json
// ~/.claude/settings.json
{
  "model": "claude-sonnet-4-20250514",
  "verbose": false,
  "showExpandedTodos": true,
  "alwaysThinkingEnabled": true,
  "feedbackSurveyState": {
    "lastShownTime": 1699999999999
  },
  "permissions": {
    "additionalDirectories": [],
    "disableBypassPermissionsMode": null
  }
}
```

---

## Summary

### State Management Architecture

Claude Code v2.0.59 implements a comprehensive state management system:

1. **Centralized State**: Single `f0` object containing all runtime state
2. **Immutable Updates**: Spread operator pattern ensures immutability
3. **React Context**: `AppStateProvider` + `useAppState` hook for component access
4. **Change Detection**: `Yu` callback monitors and persists changes
5. **Session-aware**: Per-session tracking for todos, file history
6. **Lazy Initialization**: MCP servers, agents load asynchronously
7. **Settings Sync**: Auto-updates when config files change externally

### Key Symbols Reference

| Obfuscated | Readable | Purpose |
|------------|----------|---------|
| `f0` | appState | Main state object |
| `wp` | getDefaultAppState | Factory function |
| `yG` | AppStateProvider | React context provider |
| `OQ` | useAppState | State access hook |
| `Yu` | onChangeAppState | Persistence callback |
| `$T` | loadSettings | Settings loader |
| `e1` | getSessionId | Session ID getter |
| `_E9` | initializeToolPermissionContext | Permission setup |
| `Kf2` | loadAgentDefinitions | Agent loader |
| `$21` | initializeMcpState | MCP initialization |
| `VrA` | isExtendedThinkingEnabled | Thinking detection |

### Update Pattern Summary

All state updates follow the immutable spread pattern:

```javascript
setAppState((state) => ({
  ...state,
  fieldName: {
    ...state.fieldName,
    subField: newValue
  }
}));
```

This ensures React detects changes and triggers appropriate re-renders while maintaining state integrity.
