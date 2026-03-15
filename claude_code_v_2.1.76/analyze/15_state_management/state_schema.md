# AppState Schema (Claude Code 2.1.76)

> Complete AppState structure, session vs app state, store implementation, state update mechanisms, and access patterns.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions in this document:
- `initialAppState` (gG1) - Factory function that creates the default AppState
- `createStore` (Gf6) - Creates an observable store with getState/setState/subscribe
- `AppStateProvider` (u_) - React context provider that wraps the store
- `useAppState` (v6) - React hook for reading state (selector-based)
- `useSetAppState` (L7) - React hook for writing state
- `createInternalState` (dcA) - Creates the non-React internal state object (o6)

---

## Architecture Overview

Claude Code uses a **dual-state architecture**:

1. **AppState** (React-managed): UI-facing state that drives rendering. Managed via a custom observable store wrapped in React context. Updated via functional setState pattern.

2. **InternalState** (global object): Non-React state for session-level data that persists across the entire process lifetime. Stores cumulative metrics, auth tokens, session IDs, and configuration. Accessed directly via `o6` object.

```
┌─────────────────────────────────────────────┐
│            AppState (React)                  │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Tools/  │  │ Permiss- │  │ UI State   │ │
│  │ MCP     │  │ ions     │  │ (notif,    │ │
│  │         │  │          │  │  todos,    │ │
│  │         │  │          │  │  plugins)  │ │
│  └─────────┘  └──────────┘  └────────────┘ │
│  Updated via: setState((s) => ({...s,...})) │
│  Read via: useAppState(selector)            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         InternalState (Global)               │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Session  │  │ Metrics  │  │ Auth/      │ │
│  │ IDs,CWD │  │ (cost,   │  │ Config     │ │
│  │          │  │  tokens) │  │            │ │
│  └─────────┘  └──────────┘  └────────────┘ │
│  Updated via: direct property assignment    │
│  Read via: direct property access           │
└─────────────────────────────────────────────┘
```

---

## AppState Schema

### initialAppState - Complete field breakdown

**What it does:** Creates a fresh AppState object with all default values. Called once when the AppStateProvider mounts.

**How it works:** The factory function reads initial configuration from settings, team context, and feature flags to populate the initial state.

```javascript
// ============================================
// initialAppState - Creates default AppState
// Location: chunks.151.mjs:419-519
// ============================================

// ORIGINAL (for source lookup):
function gG1() {
    let A = (Cz(), ay(d7A)),
        q = A.isTeammate() && A.isPlanModeRequired() ? "plan" : "default";
    return {
        settings: l4(),
        tasks: {},
        verbose: !1,
        mainLoopModel: null,
        // ... full state object ...
        effortValue: void 0
    }
}

// READABLE (for understanding):
function initialAppState() {
    let teamContext = getTeamContext();
    let initialPermissionMode = teamContext.isTeammate() && teamContext.isPlanModeRequired() ? "plan" : "default";
    return {
        settings: getUserSettings(),
        tasks: {},
        verbose: false,
        mainLoopModel: null,
        // ... see full schema below ...
    }
}

// Mapping: gG1→initialAppState, A→teamContext, q→initialPermissionMode
```

### Complete AppState Fields

#### Core Configuration

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `settings` | object | `l4()` (getUserSettings) | User settings from settings.json |
| `verbose` | boolean | `false` | Verbose output mode |
| `mainLoopModel` | string/null | `null` | Currently active model override |
| `mainLoopModelForSession` | string/null | `null` | Session-level model override |
| `effortValue` | string/number/undefined | `undefined` | Effort level override ("low"/"medium"/"high"/"max" or budget integer) |
| `authVersion` | number | `0` | Incremented on auth changes to trigger re-renders |

#### Permission Context

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `toolPermissionContext` | object | `{ ...QD(), mode: initialMode }` | Full permission context with mode, rules, additional directories |
| `toolPermissionContext.mode` | string | `"default"` or `"plan"` | Permission mode (default/plan/bypassPermissions) |
| `toolPermissionContext.prePlanMode` | string/undefined | `undefined` | Mode to restore when exiting plan mode |
| `toolPermissionContext.alwaysAllowRules` | object | `{}` | Auto-allow rule sets by source |
| `toolPermissionContext.alwaysDenyRules` | object | `{}` | Auto-deny rule sets |
| `toolPermissionContext.alwaysAskRules` | object | `{}` | Always-ask rule sets |
| `toolPermissionContext.additionalWorkingDirectories` | Map | `new Map` | Extra directories the agent can access |
| `toolPermissionContext.isBypassPermissionsModeAvailable` | boolean | `false` | Whether bypass mode can be enabled |

#### Agent & Tools

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `agent` | object/undefined | `undefined` | Current agent configuration |
| `agentDefinitions` | object | `{ activeAgents: [], allAgents: [] }` | Available agent type definitions |
| `mcp.clients` | array | `[]` | Connected MCP server clients |
| `mcp.tools` | array | `[]` | Available MCP tools |
| `mcp.commands` | array | `[]` | Available MCP commands |
| `mcp.resources` | object | `{}` | MCP resource registry |

#### Plugin System

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `plugins.enabled` | array | `[]` | Active plugin list |
| `plugins.disabled` | array | `[]` | Disabled plugins |
| `plugins.commands` | array | `[]` | Plugin-provided commands |
| `plugins.agents` | array | `[]` | Plugin-provided agents |
| `plugins.errors` | array | `[]` | Plugin loading errors |
| `plugins.installationStatus` | object | `{ marketplaces: [], plugins: [] }` | Installation status tracking |
| `plugins.needsRefresh` | boolean | `false` | Whether plugin list needs reloading |

#### Task Management

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `tasks` | object (map) | `{}` | Active tasks by ID (includes background agents) |
| `todos` | object (map) | `{}` | Todo items (legacy format) |

#### UI State

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `statusLineText` | string/undefined | `undefined` | Custom status line text |
| `expandedView` | string | `"none"` | Currently expanded view panel |
| `showTeammateMessagePreview` | boolean | `false` | Whether to show team message preview |
| `selectedIPAgentIndex` | number | `-1` | Selected in-process agent index |
| `viewSelectionMode` | string | `"none"` | Current view selection mode |
| `notifications` | object | `{ current: null, queue: [] }` | Notification system state |
| `initialMessage` | any/null | `null` | Initial message for new sessions |

#### Features

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `thinkingEnabled` | boolean | `fw6()` | Whether extended thinking is enabled |
| `promptSuggestionEnabled` | boolean | `Wf6()` | Whether prompt suggestions are enabled |
| `sessionHooks` | object | `{}` | Hooks registered for this session |
| `elicitation` | object | `{ queue: [] }` | Pending elicitation requests |

#### File & Attribution Tracking

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `fileHistory` | object | `{ snapshots: [], trackedFiles: new Set }` | File modification history |
| `attribution` | object | `Zw6()` | Code attribution tracking state |
| `gitDiff` | object | `{ stats: null, perFileStats: new Map, hunks: new Map, lastUpdated: 0 }` | Git diff state for UI |
| `prStatus` | object | `{ number: null, url: null, reviewState: null, lastUpdated: 0 }` | PR status tracking |

#### Sandbox & Worker State

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `workerSandboxPermissions` | object | `{ queue: [], selectedIndex: 0 }` | Worker sandbox permission requests |
| `pendingWorkerRequest` | any/null | `null` | Currently pending worker permission request |
| `pendingSandboxRequest` | any/null | `null` | Currently pending sandbox permission request |

#### Prompt Suggestions & Speculation

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `promptSuggestion` | object | `{ text: null, promptId: null, shownAt: 0, acceptedAt: 0, generationRequestId: null }` | Current prompt suggestion state |
| `speculation` | object | `{ status: "idle" }` | Speculative execution state |
| `speculationSessionTimeSavedMs` | number | `0` | Time saved by speculation in this session |
| `promptCoaching` | object | `{ tip: null, shownAt: 0 }` | Prompt coaching tips |

#### Remote & Team

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `remoteSessionUrl` | string/undefined | `undefined` | URL for remote session |
| `inbox` | object | `{ messages: [] }` | Team message inbox |

#### Session Feedback

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `feedbackSurvey` | object | `{ timeLastShown: null, submitCountAtLastAppearance: null }` | Feedback survey state |
| `queuedCommands` | array | `[]` | Commands queued for execution |

---

## Store Implementation

### createStore - Observable store with subscription

**What it does:** Creates a minimal observable store that React components can subscribe to for efficient re-rendering.

**How it works:**

1. Holds state in a closure variable `K` (currentState)
2. `setState(updater)` applies a functional update, compares with `Object.is`, and notifies subscribers only if the reference changed
3. `subscribe(listener)` adds a callback to a Set and returns an unsubscribe function
4. The onChange callback (if provided) receives both new and old state for side-effect handling

```javascript
// ============================================
// createStore - Observable store implementation
// Location: chunks.151.mjs:398-417
// ============================================

// ORIGINAL (for source lookup):
function Gf6(A, q) {
    let K = A, Y = new Set;
    return {
        getState: () => K,
        setState: (z) => {
            let w = K, H = z(w);
            if (Object.is(H, w)) return;
            K = H, q?.({ newState: H, oldState: w });
            for (let $ of Y) $()
        },
        subscribe: (z) => { return Y.add(z), () => Y.delete(z) }
    }
}

// READABLE (for understanding):
function createStore(initialState, onChange) {
    let currentState = initialState;
    let listeners = new Set();
    return {
        getState: () => currentState,
        setState: (updater) => {
            let oldState = currentState;
            let newState = updater(oldState);
            if (Object.is(newState, oldState)) return;  // No change, skip update
            currentState = newState;
            onChange?.({ newState, oldState });
            for (let listener of listeners) listener();  // Notify all subscribers
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);  // Return unsubscribe function
        }
    }
}

// Mapping: Gf6→createStore, A→initialState, q→onChange, K→currentState, Y→listeners
```

**Why this approach:**
- Using `Object.is` for comparison ensures that identity-equal objects do not trigger re-renders, which is critical for performance since AppState updates are frequent (every tool call, every stream event, etc.)
- The Set-based listener pattern is O(1) for add/remove and O(n) for notify, optimal for the typical case of <50 subscribed components
- React integration via `useSyncExternalStore` ensures proper concurrent mode compatibility

**Key insight:** The store deliberately does NOT use any middleware, immer, or other state management libraries. The functional update pattern `setState((prev) => ({...prev, field: newValue}))` is the only mutation mechanism, ensuring immutability by convention. This keeps the update path fast and debuggable.

---

## Access Patterns

### useAppState - Selector-based state reading

**What it does:** React hook that subscribes to a specific slice of AppState using a selector function.

**How it works:**

1. Gets the store from React context
2. Creates a memoized selector closure
3. Uses `useSyncExternalStore` to subscribe and read, ensuring the component only re-renders when the selected value changes

```javascript
// ============================================
// useAppState - Selector-based state reading
// Location: chunks.151.mjs:576-589
// ============================================

// ORIGINAL (for source lookup):
function v6(A) {
    let q = e(3), K = yhA(), Y;
    if (q[0] !== A || q[1] !== K) Y = () => {
        let w = K.getState(), H = A(w);
        if (w === H) throw Error(`Your selector returned the original state, which is not allowed.`);
        return H
    }, q[0] = A, q[1] = K, q[2] = Y;
    else Y = q[2];
    return eD.useSyncExternalStore(K.subscribe, Y, Y)
}

// READABLE (for understanding):
function useAppState(selector) {
    let store = useStoreContext();
    let getSnapshot = useMemo(() => () => {
        let state = store.getState();
        let selected = selector(state);
        if (state === selected) throw Error("Selector must return a property, not the entire state");
        return selected;
    }, [selector, store]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

// Mapping: v6→useAppState, A→selector, K→store, Y→getSnapshot
```

**Why this approach:**
- The selector pattern prevents components from subscribing to the entire state, avoiding unnecessary re-renders
- The "returned original state" check catches a common bug where a selector like `(s) => s` would cause every component to re-render on every state change
- `useSyncExternalStore` is the React 18+ recommended way to integrate external stores with concurrent rendering

---

## InternalState (o6) Schema

### createInternalState - Non-React global state

**What it does:** Creates the process-level state object that persists for the entire CLI session. Unlike AppState which is scoped to the React tree, this state exists independently.

**Key fields:**

| Field | Default | Purpose |
|-------|---------|---------|
| `originalCwd` | `process.cwd()` | Original working directory at startup |
| `projectRoot` | `process.cwd()` | Resolved project root |
| `cwd` | `process.cwd()` | Current working directory |
| `totalCostUSD` | `0` | Accumulated API cost |
| `totalAPIDuration` | `0` | Total API request time including retries |
| `totalAPIDurationWithoutRetries` | `0` | API time excluding retries |
| `totalToolDuration` | `0` | Total tool execution time |
| `startTime` | `Date.now()` | Session start timestamp |
| `lastInteractionTime` | `Date.now()` | Last user interaction timestamp |
| `totalLinesAdded` | `0` | Lines added across all edits |
| `totalLinesRemoved` | `0` | Lines removed across all edits |
| `hasUnknownModelCost` | `false` | Whether any model had unknown pricing |
| `modelUsage` | `{}` | Per-model usage statistics |
| `mainLoopModelOverride` | `undefined` | CLI-arg model override |
| `initialMainLoopModel` | `null` | The first model used |
| `isInteractive` | `false` | Whether in interactive mode |
| `clientType` | `"cli"` | Client type identifier |
| `sessionId` | `pcA()` | Unique session ID |
| `parentSessionId` | `undefined` | Parent session for subagents |
| `agentColorMap` | `new Map` | Agent type to color mapping |
| `agentColorIndex` | `0` | Next available color index |
| `inlinePlugins` | `[]` | Programmatically registered plugins |
| `useCoworkPlugins` | `false` | Whether cowork plugins are active |
| `sessionBypassPermissionsMode` | `false` | Whether bypass mode is active |
| `sessionTrustAccepted` | `false` | Whether trust prompt was accepted |
| `sessionPersistenceDisabled` | `false` | Whether session saving is disabled |
| `hasExitedPlanMode` | `false` | Whether plan mode was exited this session |
| `needsPlanModeExitAttachment` | `false` | Whether plan exit attachment is pending |
| `registeredHooks` | `null` | Hook registration state |
| `planSlugCache` | `new Map` | Cache of plan file slugs |
| `invokedSkills` | `new Map` | Skills invoked in this session |
| `slowOperations` | `[]` | Tracked slow operations |
| `promptCacheBreaks` | `[]` | Points where prompt cache was invalidated |
| `sdkBetas` | `undefined` | SDK beta features |

**Why two state systems:**
- AppState changes trigger React re-renders -- this is appropriate for UI-visible data (notifications, tool permissions, model selection)
- InternalState does not trigger re-renders -- this is appropriate for cumulative metrics (cost, tokens, lines changed) that are only read at session end or in response to explicit /usage commands
- Mixing these would cause either missed updates (if metrics were in AppState but components did not subscribe) or excessive re-renders (if every token count update triggered UI refresh)

---

## State Update Patterns

### Functional Updates (AppState)

All AppState updates use the functional pattern:

```javascript
setAppState((prevState) => ({
    ...prevState,
    fieldToUpdate: newValue
}))
```

Common patterns seen in the codebase:

1. **Simple field update**: `(s) => ({ ...s, verbose: true })`
2. **Nested object update**: `(s) => ({ ...s, toolPermissionContext: { ...s.toolPermissionContext, mode: "plan" } })`
3. **Map/collection update**: `(s) => ({ ...s, tasks: { ...s.tasks, [id]: newTask } })`
4. **Conditional update**: `(s) => { if (s.field === expected) return { ...s, field: newValue }; return s; }`

### Direct Assignment (InternalState)

InternalState fields are updated via direct property assignment:

```javascript
o6.totalCostUSD += costDelta;
o6.lastInteractionTime = Date.now();
```

Some fields have dedicated update functions:
- `jA` (updateGlobalConfig) - Updates configuration via `chunks.174.mjs:1460`
- `f6` (getGlobalConfig) - Reads configuration via `chunks.174.mjs:1539`

---

## Persistence

### Session Persistence

AppState is NOT directly persisted. Instead, the conversation transcript (messages array) is persisted to JSONL files, and AppState is reconstructed when resuming a session via:

1. `yt` (resumeSession) loads messages from the transcript file
2. Session start hooks are re-executed to rebuild hook state
3. Permission context is reconstructed from stored messages
4. Other state fields start from defaults and are re-populated as the session progresses

### InternalState Persistence

InternalState is not persisted across process restarts. It is recreated fresh each time the CLI starts. Cumulative metrics (cost, tokens) are reported in telemetry events at session end but are not saved locally.

**Key insight:** The lack of direct state persistence means that every session resume is a "warm start" -- the conversation context is restored, but UI state, permission decisions, and configuration are reset to defaults. This is intentional: it ensures that stale state (like an expired permission grant) does not carry over to new sessions.
