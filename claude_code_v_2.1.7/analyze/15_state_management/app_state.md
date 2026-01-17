# Application State Management (v2.1.7)

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Table of Contents

1. [Overview](#overview)
2. [Dual State System Architecture](#dual-state-system-architecture)
3. [State Structure](#state-structure)
4. [React Context Implementation](#react-context-implementation)
5. [State Initialization Flow](#state-initialization-flow)
6. [State Change Callback System](#state-change-callback-system)
7. [Individual Field Update Patterns](#individual-field-update-patterns)
8. [State Persistence](#state-persistence)
9. [Related Symbols](#related-symbols)

---

## Overview

Claude Code v2.1.7 uses a **dual state system** for managing application state:

1. **React State** - UI-reactive, managed via `setAppState`, triggers re-renders
2. **Global State** (`g0`) - Non-reactive, accessed directly for internal flags

**Key Components:**
- `HzA` (createDefaultAppState) - Factory function for default state structure
- `b5` (AppStateProvider) - React context provider wrapping the app
- `a0` (useAppState) - Hook to access state in components
- `HZ2` (useAppStateSafe) - Safe hook variant (returns null if outside provider)
- `g0` (globalState) - Non-reactive global flags

---

## Dual State System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     DUAL STATE SYSTEM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────┐  │
│  │      REACT STATE (RM0)          │   │   GLOBAL STATE (g0)          │  │
│  │                                 │   │                              │  │
│  │  - toolPermissionContext        │   │  - hasExitedPlanMode         │  │
│  │  - todos                        │   │  - needsPlanModeExitAttach   │  │
│  │  - notifications                │   │  - hasExitedDelegateMode     │  │
│  │  - mcp                          │   │  - planSlugCache             │  │
│  │  - plugins                      │   │  - teleportedSessionInfo     │  │
│  │  - sessionHooks                 │   │  - registeredHooks           │  │
│  │  - fileHistory                  │   │  - invokedSkills             │  │
│  │  ...                            │   │  ...                         │  │
│  │                                 │   │                              │  │
│  │  Access: useAppState()          │   │  Access: Direct read/write   │  │
│  │  Update: setAppState(fn)        │   │  Example: Iq(true)           │  │
│  │  Re-renders: Yes                │   │  Re-renders: No              │  │
│  └─────────────────────────────────┘   └─────────────────────────────┘  │
│                                                                          │
│  Why Two Systems:                                                        │
│  - React state for UI-visible changes that need re-renders             │
│  - Global state for internal flags that don't affect UI                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## State Structure

### Main State Object (v2.1.7)

```javascript
// ============================================
// createDefaultAppState - Factory function for default state
// Location: chunks.135.mjs:1235-1329
// ============================================

// ORIGINAL (for source lookup):
function HzA() {
  return {
    settings: r3(),
    tasks: {},
    verbose: !1,
    mainLoopModel: null,
    mainLoopModelForSession: null,
    statusLineText: void 0,
    showExpandedTodos: !1,
    showExpandedIPAgents: !1,
    selectedIPAgentIndex: 0,
    toolPermissionContext: {
      ...oL(),
      mode: "default"
    },
    agent: void 0,
    agentDefinitions: {
      activeAgents: [],
      allAgents: []
    },
    fileHistory: {
      snapshots: [],
      trackedFiles: new Set
    },
    attribution: z91(),
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
    thinkingEnabled: q91(),
    promptSuggestionEnabled: uH1(),
    feedbackSurvey: {
      timeLastShown: null,
      submitCountAtLastAppearance: null
    },
    sessionHooks: {},
    inbox: {
      messages: []
    },
    workerPermissions: {
      queue: [],
      selectedIndex: 0
    },
    workerSandboxPermissions: {
      queue: [],
      selectedIndex: 0
    },
    pendingWorkerRequest: null,
    pendingSandboxRequest: null,
    promptSuggestion: {
      text: null,
      promptId: null,
      shownAt: 0,
      acceptedAt: 0,
      generationRequestId: null
    },
    speculation: FzA,
    speculationSessionTimeSavedMs: 0,
    promptCoaching: {
      tip: null,
      shownAt: 0
    },
    queuedCommands: [],
    linkedAttachments: [],
    gitDiff: {
      stats: null,
      perFileStats: new Map,
      hunks: new Map,
      lastUpdated: 0
    },
    authVersion: 0,
    initialMessage: null
  }
}

// READABLE (for understanding):
function createDefaultAppState() {
  return {
    // ==========================================
    // Core Configuration
    // ==========================================
    settings: loadSettings(),                    // Merged user/project/local settings

    // ==========================================
    // Background Task Tracking
    // ==========================================
    tasks: {},                                   // Map: { [taskId]: TaskObject }

    // ==========================================
    // Debug/Logging
    // ==========================================
    verbose: false,                              // Verbose logging mode

    // ==========================================
    // Model Configuration
    // ==========================================
    mainLoopModel: null,                         // Default model from settings
    mainLoopModelForSession: null,               // Per-session model override

    // ==========================================
    // UI State
    // ==========================================
    statusLineText: undefined,                   // Custom status line message
    showExpandedTodos: false,                    // Todo panel expansion
    showExpandedIPAgents: false,                 // In-progress agents panel (NEW)
    selectedIPAgentIndex: 0,                     // Selected agent index (NEW)

    // ==========================================
    // Tool Permissions (Cross-Module Key Field)
    // ==========================================
    toolPermissionContext: {
      ...createDefaultPermissionContext(),
      mode: "default"                            // "default" | "plan" | "acceptEdits" | "bypassPermissions" | "dontAsk"
    },

    // ==========================================
    // Agent System
    // ==========================================
    agent: undefined,                            // Current agent context
    agentDefinitions: {
      activeAgents: [],                          // Currently enabled agents
      allAgents: []                              // All available agents
    },

    // ==========================================
    // File History Tracking
    // ==========================================
    fileHistory: {
      snapshots: [],                             // Historical file content
      trackedFiles: new Set()                    // Tracked file paths
    },

    // ==========================================
    // Attribution (NEW in 2.1.7)
    // ==========================================
    attribution: createDefaultAttribution(),     // Model/API attribution info

    // ==========================================
    // MCP (Model Context Protocol)
    // ==========================================
    mcp: {
      clients: [],                               // MCPClient instances
      tools: [],                                 // MCP-provided tools
      commands: [],                              // MCP-provided commands
      resources: {}                              // MCP resources
    },

    // ==========================================
    // Plugin System
    // ==========================================
    plugins: {
      enabled: [],                               // Enabled plugin IDs
      disabled: [],                              // Disabled plugin IDs
      commands: [],                              // Plugin-provided commands
      agents: [],                                // Plugin-provided agents
      errors: [],                                // Plugin errors
      installationStatus: {
        marketplaces: [],
        plugins: []
      }
    },

    // ==========================================
    // Todo List Management
    // ==========================================
    todos: {},                                   // { [sessionId]: TodoItem[] }

    // ==========================================
    // Notification System
    // ==========================================
    notifications: {
      current: null,                             // Currently displayed notification
      queue: []                                  // Queued notifications
    },

    // ==========================================
    // User Input Elicitation
    // ==========================================
    elicitation: {
      queue: []                                  // Pending input requests
    },

    // ==========================================
    // Feature Flags
    // ==========================================
    thinkingEnabled: isExtendedThinkingEnabled(),
    promptSuggestionEnabled: isPromptSuggestionEnabled(),

    // ==========================================
    // Feedback Survey
    // ==========================================
    feedbackSurvey: {
      timeLastShown: null,
      submitCountAtLastAppearance: null
    },

    // ==========================================
    // Session Hooks
    // ==========================================
    sessionHooks: {},                            // { [eventName]: HookFunction[] }

    // ==========================================
    // Inbox (NEW in 2.1.7)
    // ==========================================
    inbox: {
      messages: []                               // Inbox messages for worker
    },

    // ==========================================
    // Worker Permissions (NEW in 2.1.7)
    // ==========================================
    workerPermissions: {
      queue: [],                                 // Permission requests from workers
      selectedIndex: 0
    },
    workerSandboxPermissions: {
      queue: [],
      selectedIndex: 0
    },
    pendingWorkerRequest: null,
    pendingSandboxRequest: null,

    // ==========================================
    // Prompt Suggestions
    // ==========================================
    promptSuggestion: {
      text: null,
      promptId: null,
      shownAt: 0,
      acceptedAt: 0,
      generationRequestId: null
    },

    // ==========================================
    // Speculation (NEW in 2.1.7)
    // ==========================================
    speculation: { status: "idle" },             // Speculative execution state
    speculationSessionTimeSavedMs: 0,            // Time saved via speculation

    // ==========================================
    // Prompt Coaching (NEW in 2.1.7)
    // ==========================================
    promptCoaching: {
      tip: null,
      shownAt: 0
    },

    // ==========================================
    // Command Queue
    // ==========================================
    queuedCommands: [],                          // Commands waiting to execute

    // ==========================================
    // Linked Attachments (NEW in 2.1.7)
    // ==========================================
    linkedAttachments: [],                       // Linked file attachments

    // ==========================================
    // Git Integration
    // ==========================================
    gitDiff: {
      stats: null,                               // Overall diff stats
      perFileStats: new Map(),                   // Per-file diff stats (NEW)
      hunks: new Map(),                          // Diff hunks by file
      lastUpdated: 0
    },

    // ==========================================
    // Auth (NEW in 2.1.7)
    // ==========================================
    authVersion: 0,                              // Auth state version
    initialMessage: null                         // Initial message for session
  }
}

// Mapping: HzA→createDefaultAppState, r3→loadSettings, oL→createDefaultPermissionContext
// z91→createDefaultAttribution, q91→isExtendedThinkingEnabled, uH1→isPromptSuggestionEnabled
// FzA→{ status: "idle" }
```

### State Field Summary Table

| Field | Type | Persistence | Description |
|-------|------|-------------|-------------|
| `settings` | Object | Config files | Merged user/project/local settings |
| `tasks` | Object | Ephemeral | Background task states |
| `verbose` | boolean | Settings | Debug output mode |
| `mainLoopModel` | string \| null | userSettings | Default model |
| `mainLoopModelForSession` | string \| null | Ephemeral | Per-session model override |
| `toolPermissionContext` | Object | Mixed | **Key for cross-module interaction** |
| `toolPermissionContext.mode` | string | Session | "default" \| "plan" \| "acceptEdits" \| "bypassPermissions" \| "dontAsk" |
| `todos` | Object | JSON file | { [sessionId]: TodoItem[] } |
| `mcp` | Object | Ephemeral | MCP clients, tools, commands |
| `plugins` | Object | Ephemeral | Plugin system state |
| `sessionHooks` | Object | Config-based | Custom lifecycle hooks |
| `speculation` | Object | Ephemeral | Speculative execution state (NEW) |
| `workerPermissions` | Object | Ephemeral | Worker permission queue (NEW) |
| `inbox` | Object | Ephemeral | Worker inbox messages (NEW) |

---

## React Context Implementation

### AppStateProvider (b5)

```javascript
// ============================================
// AppStateProvider - React context provider for global state
// Location: chunks.135.mjs:1331-1384
// ============================================

// ORIGINAL (for source lookup):
function b5({
  children: A,
  initialState: Q,
  onChangeAppState: B
}) {
  if (iF.useContext(c19)) throw Error("AppStateProvider can not be nested within another AppStateProvider");
  let [Z, Y] = iF.useState({
    currentState: Q ?? HzA(),
    previousState: null
  }), J = iF.useCallback((I) => {
    Y((D) => {
      let {
        currentState: W
      } = D, K = I(W);
      if (SG7(K, W)) return D;
      let V = {
        currentState: K,
        previousState: W
      };
      return B?.({
        newState: V.currentState,
        oldState: V.previousState
      }), V
    })
  }, [B]), X = iF.useMemo(() => {
    let I = [Z.currentState, J];
    return I.__IS_INITIALIZED__ = !0, I
  }, [Z.currentState, J]);
  return iF.useEffect(() => {
    let { toolPermissionContext: I } = Z.currentState;
    if (I.isBypassPermissionsModeAvailable && phA()) {
      k("Disabling bypass permissions mode on mount");
      J((D) => ({
        ...D,
        toolPermissionContext: lhA(D.toolPermissionContext)
      }))
    }
  }, []), EDA(iF.useCallback((I, D) => {
    k(`Settings changed from ${I}, updating AppState`);
    let W = $01();
    J((K) => {
      let V = p19(K.toolPermissionContext, W);
      if (V.isBypassPermissionsModeAvailable && phA()) V = lhA(V);
      return {
        ...K,
        settings: D,
        toolPermissionContext: V
      }
    })
  }, [J])), iF.default.createElement(c19.Provider, {
    value: !0
  }, iF.default.createElement(RM0.Provider, {
    value: X
  }, A))
}

// READABLE (for understanding):
function AppStateProvider({
  children,
  initialState,
  onChangeAppState
}) {
  // Prevent nested providers (would cause state conflicts)
  if (React.useContext(providerInitializedContext)) {
    throw Error("AppStateProvider can not be nested within another AppStateProvider");
  }

  // State container with current and previous for change detection
  let [stateContainer, setStateContainer] = React.useState({
    currentState: initialState ?? createDefaultAppState(),
    previousState: null
  });

  // State updater with shallow equality check and change notification
  let updateState = React.useCallback((updaterFn) => {
    setStateContainer((container) => {
      let { currentState: previousState } = container;
      let newState = updaterFn(previousState);

      // Skip update if shallow equal (optimization)
      if (shallowEqual(newState, previousState)) return container;

      let newContainer = {
        currentState: newState,
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

  // Memoized context value: [state, setter] with initialization flag
  let contextValue = React.useMemo(() => {
    let value = [stateContainer.currentState, updateState];
    value.__IS_INITIALIZED__ = true;  // Marker for validation
    return value;
  }, [stateContainer.currentState, updateState]);

  // Effect: Disable bypass mode if remotely disabled
  React.useEffect(() => {
    let { toolPermissionContext } = stateContainer.currentState;
    if (toolPermissionContext.isBypassPermissionsModeAvailable && isRemoteBypassDisabled()) {
      log("Disabling bypass permissions mode on mount");
      updateState((state) => ({
        ...state,
        toolPermissionContext: disableBypassMode(state.toolPermissionContext)
      }));
    }
  }, []);

  // Subscribe to settings file changes
  subscribeToSettingsChanges(React.useCallback((source, newSettings) => {
    log(`Settings changed from ${source}, updating AppState`);
    let permissionUpdates = loadToolPermissions();
    updateState((state) => {
      let newPermissionContext = mergePermissionContexts(state.toolPermissionContext, permissionUpdates);
      if (newPermissionContext.isBypassPermissionsModeAvailable && isRemoteBypassDisabled()) {
        newPermissionContext = disableBypassMode(newPermissionContext);
      }
      return {
        ...state,
        settings: newSettings,
        toolPermissionContext: newPermissionContext
      };
    });
  }, [updateState]));

  // Render with nested provider flag
  return React.createElement(
    providerInitializedContext.Provider,
    { value: true },
    React.createElement(
      appStateContext.Provider,
      { value: contextValue },
      children
    )
  );
}

// Mapping: b5→AppStateProvider, A→children, Q→initialState, B→onChangeAppState
// iF→React, c19→providerInitializedContext, RM0→appStateContext
// Z→stateContainer, Y→setStateContainer, J→updateState, X→contextValue
// SG7→shallowEqual, HzA→createDefaultAppState, EDA→subscribeToSettingsChanges
// phA→isRemoteBypassDisabled, lhA→disableBypassMode, p19→mergePermissionContexts
```

### useAppState Hook (a0)

```javascript
// ============================================
// useAppState - Hook to access app state and updater
// Location: chunks.135.mjs:1386-1390
// ============================================

// ORIGINAL (for source lookup):
function a0() {
  let A = iF.useContext(RM0);
  if (!A.__IS_INITIALIZED__) throw ReferenceError("useAppState cannot be called outside of an <AppStateProvider />");
  return A
}

// READABLE (for understanding):
function useAppState() {
  let contextValue = React.useContext(appStateContext);
  if (!contextValue.__IS_INITIALIZED__) {
    throw ReferenceError("useAppState cannot be called outside of an <AppStateProvider />");
  }
  return contextValue;  // Returns [currentState, setAppState]
}

// Mapping: a0→useAppState, A→contextValue, iF→React, RM0→appStateContext
```

### useAppStateSafe Hook (HZ2)

```javascript
// ============================================
// useAppStateSafe - Safe variant that returns null outside provider
// Location: chunks.135.mjs:1392-1396
// ============================================

// ORIGINAL (for source lookup):
function HZ2() {
  let A = iF.useContext(RM0);
  if (!A.__IS_INITIALIZED__) return null;
  return A
}

// READABLE (for understanding):
function useAppStateSafe() {
  let contextValue = React.useContext(appStateContext);
  if (!contextValue.__IS_INITIALIZED__) return null;
  return contextValue;
}

// Mapping: HZ2→useAppStateSafe
```

### Context Creation

```javascript
// ============================================
// Context creation
// Location: chunks.135.mjs:1419
// ============================================

// ORIGINAL:
RM0 = iF.default.createContext([{}, (A) => A]),
c19 = iF.default.createContext(!1)

// READABLE:
appStateContext = React.createContext([{}, (updater) => updater]),
providerInitializedContext = React.createContext(false)

// Mapping: RM0→appStateContext, c19→providerInitializedContext
```

---

## State Initialization Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    STATE INITIALIZATION FLOW                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  1. CLI Entry (chunks.157.mjs)                                           │
│     │                                                                     │
│     ▼                                                                     │
│  2. Settings loaded (r3/loadSettings)                                    │
│     ├── ~/.claude/settings.json (user)                                   │
│     ├── .claude/settings.json (project)                                  │
│     └── .claude/settings.local.json (local)                              │
│     │                                                                     │
│     ▼                                                                     │
│  3. Tool permissions configured                                          │
│     ├── CLI flags (--dangerously-skip-permissions)                       │
│     ├── Settings rules                                                   │
│     └── toolPermissionContext.mode = "default"                           │
│     │                                                                     │
│     ▼                                                                     │
│  4. createDefaultAppState (HzA) called                                   │
│     ├── Creates full state structure                                     │
│     ├── Loads thinking mode, prompt suggestions                          │
│     └── Returns initial state object                                     │
│     │                                                                     │
│     ▼                                                                     │
│  5. AppStateProvider (b5) mounted                                        │
│     ├── Initializes React.useState with state                            │
│     ├── Sets up change callback                                          │
│     └── Creates context value [state, setAppState]                       │
│     │                                                                     │
│     ▼                                                                     │
│  6. Async initialization (parallel)                                      │
│     ├── MCP servers connect                                              │
│     ├── Agent definitions load                                           │
│     └── Plugins load                                                     │
│     │                                                                     │
│     ▼                                                                     │
│  7. State updates via setAppState as async ops complete                  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## State Change Callback System

The `onChangeAppState` callback monitors state changes and persists to appropriate storage.

### Key Monitored Properties

| Property | Trigger Condition | Persistence Action |
|----------|-------------------|-------------------|
| `mainLoopModel` | Value changed | Save to userSettings |
| `showExpandedTodos` | Value changed | Update settings file |
| `todos` | Object reference changed | Persist each session's todos to JSON |
| `verbose` | Value changed | Update settings file |
| `thinkingEnabled` | Value changed | Save to userSettings |
| `feedbackSurvey.timeLastShown` | Changed to non-null | Update settings file |
| `mcp.*` | Any MCP field changed | Sync to MCP CLI endpoint |
| `settings` | Object reference changed | Clear auth caches |

---

## Individual Field Update Patterns

### Immutable Update Pattern

All state updates use the immutable spread pattern:

```javascript
setAppState((state) => ({
  ...state,
  fieldName: {
    ...state.fieldName,
    subField: newValue
  }
}));
```

### Todos Update Example

```javascript
// Update todos for specific session
setAppState((state) => ({
  ...state,
  todos: {
    ...state.todos,
    [sessionId]: newTodoList
  }
}));
```

### Tool Permission Mode Update Example

```javascript
// Enter plan mode
setAppState((state) => ({
  ...state,
  toolPermissionContext: applyPermissionAction(state.toolPermissionContext, {
    type: "setMode",
    mode: "plan",
    destination: "session"
  })
}));
```

---

## State Persistence

### Persistence Matrix

| Field | Storage Location | Format | Trigger |
|-------|-----------------|--------|---------|
| `mainLoopModel` | ~/.claude/settings.json | JSON | Model change |
| `showExpandedTodos` | ~/.claude/settings.json | JSON | Preference toggle |
| `todos` | ~/.claude/todos/{sessionId}.json | JSON | Todo update |
| `fileHistory` | Session storage | Session snapshots | File operations |
| `thinkingEnabled` | ~/.claude/settings.json | JSON | Feature toggle |

### Todo File Location

```
~/.claude/todos/{sessionId}.json
```

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `createDefaultAppState` (HzA) - chunks.135.mjs:1235-1329
- `AppStateProvider` (b5) - chunks.135.mjs:1331-1384
- `useAppState` (a0) - chunks.135.mjs:1386-1390
- `useAppStateSafe` (HZ2) - chunks.135.mjs:1392-1396
- `appStateContext` (RM0) - chunks.135.mjs:1419
- `providerInitializedContext` (c19) - chunks.135.mjs:1419
- `shallowEqual` (SG7) - chunks.135.mjs:1225-1233

---

## See Also

- [state_interactions.md](./state_interactions.md) - Cross-module state interactions
- [background_tasks.md](./background_tasks.md) - Background task storage
- [session_updates.md](./session_updates.md) - Session management features
- [../12_plan_mode/](../12_plan_mode/) - Plan mode implementation
