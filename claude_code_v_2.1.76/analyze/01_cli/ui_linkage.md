# CLI Flags to React/Ink UI Linkage

> Claude Code v2.1.76 — How command-line flags wire into the React/Ink component tree

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (CLI, Steering, Hooks)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, MCP)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands, UI Components)

Key symbols referenced throughout this document:

- `REPL` (TUA) - Root interactive UI component (chunks.188.mjs:3)
- `AppStateRoot` (Pf1) - React root wrapping FpsMetrics + AppStateProvider (chunks.176.mjs:643)
- `AppStateProvider` (Yj) - React context provider for global state store (chunks.148.mjs:2544)
- `createStateStore` (WX1) - Observable store factory: getState/setState/subscribe (chunks.85.mjs:1747)
- `useAppState` (M1) - Hook: reads a single state slice via useSyncExternalStore (chunks.148.mjs:2598)
- `useSetAppState` (xA) - Hook: returns the setState dispatcher (chunks.148.mjs:2613)
- `useStoreContext` (Bp8) - Hook: returns the raw store object (chunks.148.mjs:2592)
- `onChangeAppStateHandler` (K11) - State-to-disk sync callback (chunks.176.mjs:581)
- `renderWithCallback` (mGz) - Promise wrapper for one-shot React dialogs (chunks.189.mjs:741)
- `renderFullscreenComponent` (LF) - Full-screen dialog with AppStateProvider (chunks.189.mjs:748)
- `renderAndWait` ($l1) - Renders Ink app and blocks until exit (chunks.189.mjs:754)
- `createRenderOptions` (rGz) - Builds Ink render options with FPS/flicker tracking (chunks.189.mjs:958)
- `FpsMetricsTracker` (_QA) - Tracks per-frame render duration (chunks.176.mjs:1020)
- `FpsMetricsWrapper` (BDq) - React component providing FPS context (chunks.176.mjs:657)
- `showSetupScreens` (gRq) - Sequential onboarding/trust dialog orchestrator (chunks.189.mjs:758)

---

## 1. Overview

Claude Code uses [Ink](https://github.com/vadimdemedes/ink) — a React renderer that targets the terminal — as its UI layer. Every visual element the user sees (the prompt input, spinners, message list, dialogs, status bars) is a React component rendered by Ink into ANSI escape sequences on stdout.

CLI flags do not directly manipulate React state. Instead, they flow through a multi-stage pipeline:

```
CLI flags (Commander.js)
  │
  ▼
initialState object (~35 fields)
  │
  ▼
createStateStore(initialState, onChangeAppStateHandler)
  │
  ├──► AppStateProvider context (React tree has access)
  │
  ▼
REPL component props + v6() selectors
  │
  ▼
Rendered Ink UI (terminal output)
```

The critical insight is that the state store acts as the **intermediary**: CLI flags set the initial state; React components read slices of that state reactively; and the `onChangeAppStateHandler` callback writes state changes back to persistent settings files.

---

## 2. React/Ink Architecture

### Why Ink Over Regular Terminal Output

**What it does:** Ink wraps React's reconciliation engine and produces terminal output instead of DOM nodes. When state changes, React's diffing algorithm computes the minimal set of terminal line rewrites needed.

**How it works:**
1. Ink maintains a virtual DOM of `Box`, `Text`, and other Ink-specific elements
2. On each state change, React reconciles the old and new virtual DOM
3. Ink converts the diff into ANSI escape sequences: cursor moves, color codes, text rewrites
4. The entire "frame" is written atomically (or as close to atomic as the OS allows) to avoid partial renders

**Why this approach:**
- **Declarative over imperative:** Components describe what the UI looks like for a given state, not how to transition from state A to state B. This is essential for a complex UI with concurrent state changes (new messages arriving while tools are running).
- **Cursor management:** Ink handles the cursor-hiding, clearing, and repositioning needed for in-place UI updates. Writing raw ANSI codes would require tracking all previously written lines manually.
- **React ecosystem:** The REPL reuses React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) and the React context system, giving it access to a mature state management model.

**Key insight:** The alternative of raw `process.stdout.write(ANSI)` calls would require manually tracking what was written to the terminal and computing deltas by hand. Ink's approach reduces this to writing components and letting the reconciler figure out the minimum terminal writes.

### The createRoot / render / waitUntilExit Lifecycle

The Ink lifecycle for the main REPL follows three steps:

**Step 1: `F7(TA.renderOptions)` - createRoot**

```javascript
// TA = { getFpsMetrics, renderOptions } from createRenderOptions(rGz)
// F7 = createRoot from ink (analogous to React DOM's createRoot)
RA = await F7(TA.renderOptions);
```

`createRoot` allocates the Ink instance bound to the terminal. It does NOT render anything yet. The `renderOptions` configure which stdin/stdout streams to use, the initial frame rate, and the `onFrame` callback.

**Step 2: `$l1(RA, element)` - render + waitUntilExit**

```javascript
// ============================================
// renderAndWait - Render a full Ink app and await its exit
// Location: chunks.197.mjs:754-757
// ============================================

// ORIGINAL (for source lookup):
async function $l1(A, q) {
    A.render(q), RUA(), await A.waitUntilExit(), await nK(0)
}

// READABLE (for understanding):
async function renderAndWait(inkInstance, reactElement) {
    inkInstance.render(reactElement);   // Mount the React tree
    flushRenderQueue();                 // RUA(): force synchronous first render
    await inkInstance.waitUntilExit(); // Block until Ink calls unmount()
    await sleep(0);                    // nK(0): yield for cleanup effects
}

// Mapping: $l1→renderAndWait, A→inkInstance, q→reactElement,
//          RUA→flushRenderQueue, nK→sleep
```

`waitUntilExit()` is the bridge between the async startup sequence and React's event-driven execution. The `await` here means the entire CLI startup chain (`cliEntry` → `mainEntry` → `commanderSetup` → action handler) is suspended until the user quits the REPL. When the REPL component calls `process.exit()` or Ink's internal `unmount()`, `waitUntilExit()` resolves.

The `await sleep(0)` at the end is a deliberate event loop yield. React `useEffect` cleanup callbacks (closing file watchers, WebSocket connections, MCP client handles) are scheduled as microtasks. Without the yield, they might be garbage-collected before they run.

**Step 3: App exit path**

The REPL calls `process.exit(exitCode)` when the user types `/exit` or presses Ctrl+D. This triggers the process "exit" event, which calls `cleanupOnExit` (tGz) to write the ANSI "show cursor" escape sequence, restoring the terminal's cursor which Ink hid during rendering.

---

## 3. The Rendering Primitives

Three functions form a layered abstraction over Ink's API. Each serves a different rendering scenario.

### `renderWithCallback` (mGz) — Promise-Based One-Shot Dialog

```javascript
// ============================================
// renderWithCallback - Render a component, resolve when it calls done()
// Location: chunks.197.mjs:741-747
// ============================================

// ORIGINAL (for source lookup):
function mGz(A, q) {
    return new Promise((K) => {
        let Y = (z) => void K(z);
        A.render(q(Y))
    })
}

// READABLE (for understanding):
function renderWithCallback(inkInstance, componentFactory) {
    return new Promise((resolve) => {
        let done = (result) => void resolve(result);
        inkInstance.render(componentFactory(done));
    });
}

// Mapping: mGz→renderWithCallback, A→inkInstance, q→componentFactory,
//          K→resolve, Y→done, z→result
```

**Pattern:** This is the standard callback-to-promise bridge. The component factory receives `done` as a function and passes it to the React component (typically as `onDone` prop). When the user dismisses the dialog (e.g., presses Enter or selects an option), the component calls `onDone(result)`, which resolves the outer `await`. This creates a sequential dialog flow using `async/await` rather than callback chains.

**Used by:** `renderFullscreenComponent` (wraps it for full-screen dialogs) and `LF` for the teleport picker.

### `renderFullscreenComponent` (LF) — Setup Screen Wrapper

```javascript
// ============================================
// renderFullscreenComponent - Full-screen dialog with AppStateProvider and ThemeProvider
// Location: chunks.197.mjs:748-753
// ============================================

// ORIGINAL (for source lookup):
function LF(A, q, K) {
    return mGz(A, (Y) => wO.default.createElement(u_, {
        onChangeAppState: K?.onChangeAppState
    }, wO.default.createElement(dX, null, q(Y))))
}

// READABLE (for understanding):
function renderFullscreenComponent(inkInstance, componentFactory, options) {
    return renderWithCallback(inkInstance, (done) =>
        React.createElement(AppStateProvider, {
            onChangeAppState: options?.onChangeAppState
        },
            React.createElement(KeybindingSetup, null,
                componentFactory(done)
            )
        )
    );
}

// Mapping: LF→renderFullscreenComponent, A→inkInstance, q→componentFactory,
//          K→options, Y→done, Yj→AppStateProvider, dX→KeybindingSetup,
//          wO→React, mGz→renderWithCallback
```

**Three wrapping layers:**
1. `AppStateProvider` (Yj) — Creates an isolated state store for the dialog. Dialogs like the onboarding screen can read and write app state (e.g., recording `hasCompletedOnboarding`). The `onChangeAppState` option controls whether state changes persist to disk (`K11`) or are transient.
2. `KeybindingSetup` (dX) — Sets up keyboard bindings and theme context. Without this, Ink's raw keyboard input would not be properly mapped to actions.
3. `componentFactory(done)` — The actual dialog component (Onboarding, TrustDialog, PolicyUpdateDialog, etc.)

**Used by:** `showSetupScreens` (gRq) for all six setup dialogs.

### `renderAndWait` ($l1) — Persistent App Renderer

This is the primitive used for the main REPL and session pickers (anything that stays mounted until the user actively quits). See Section 2 for full analysis.

**When each primitive is used:**

| Scenario | Primitive | Why |
|----------|-----------|-----|
| Main REPL | `$l1` | Needs to block until app exit |
| Setup dialogs (onboarding, trust, policy) | `LF` | Full-screen, needs AppStateProvider |
| Teleport picker | `LF` | Returns user selection as value |
| Session picker (resume with no ID) | `$l1` | Uses the Pf1/AppStateRoot wrapper instead |
| Headless mode | None | No React rendering at all |

---

## 4. The State Store — Hand-Rolled Zustand Pattern

### `createStateStore` (WX1) — Observable Store Factory

```javascript
// ============================================
// createStateStore - Minimal observable state store (zustand-compatible)
// Location: chunks.85.mjs:1747-1766
// ============================================

// ORIGINAL (for source lookup):
function WX1(A, q) {
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
function createStateStore(initialState, onChangeCallback) {
    let currentState = initialState;
    let subscribers = new Set();

    return {
        getState: () => currentState,

        setState: (updater) => {
            let prevState = currentState;
            let nextState = updater(prevState);

            if (Object.is(nextState, prevState)) return;

            currentState = nextState;
            onChangeCallback?.({ newState: nextState, oldState: prevState });

            for (let notify of subscribers) notify();
        },

        subscribe: (notify) => {
            subscribers.add(notify);
            return () => subscribers.delete(notify);
        }
    };
}

// Mapping: WX1→createStateStore, A→initialState, q→onChangeCallback,
//          K→currentState, Y→subscribers, z→updater, w→prevState,
//          H→nextState, $→notify
```

**What it does:** Creates a minimal observable store with three operations: read current state, write new state via an updater function, and subscribe to state changes. The interface is deliberately compatible with React's `useSyncExternalStore` hook.

**How it works:**

1. **State is a single object reference.** There is no split state, no atom graph, no selector caching at the store level. All 35+ fields of `AppState` live in one object. Updates create new objects via spread operators (`{ ...state, key: newValue }`), preserving reference equality on unchanged subtrees.

2. **The updater function pattern** (`setState(fn)` not `setState(value)`) is essential for concurrent React. If multiple updates queue while React is in the middle of rendering, each update sees the latest committed state rather than a stale closure.

3. **`Object.is` bail-out** is identical to the check React uses internally. If an updater returns the same object reference, the notification cycle is skipped entirely.

4. **Dual notification system:** After committing new state, the store fires two notifications:
   - `onChangeCallback` (`K11` / `onChangeAppStateHandler`) — synchronous side effects: write settings to disk, update MCP clients, refresh badge count
   - All `subscribers` — trigger React `useSyncExternalStore` re-renders

5. **Subscription returns an unsubscribe closure.** The closure `() => subscribers.delete(notify)` is returned from `subscribe()` and called by React when the component unmounts.

---

## 5. CLI Flags to Initial State Mapping

### 5.1 The initialState Object

**Source location:** `chunks.197.mjs:1600-1680` (action handler)

The action handler constructs an `initialState` object (~35 fields) that becomes the first argument to `createStateStore`. Every CLI flag that affects the UI is translated to an `initialState` field here.

```javascript
// ============================================
// initialState construction - CLI flags to React state
// Location: chunks.197.mjs:1600-1680
// ============================================

// READABLE (for understanding):
let initialState = {
    // From CLI flags
    verbose: verbose,                              // --verbose
    isSingleTurn: isPrintMode,                     // --print
    shouldShowCostSummary: isPrintMode,
    disableSlashCommands: disableSlashCommands,    // --disable-slash-commands
    toolPermissionContext: toolPermissionContext,  // --allowed-tools etc.
    autoUpdaterStatus: autoUpdaterStatus,
    sessionId: sessionId,

    // From config resolution
    model: resolvedModel,
    effortLevel: effortLevel,                     // --effort
    agentDefinition: agentDefinition,             // --agent

    // From session state
    messages: initialMessages,
    isResumingSession: isResume,                  // --resume

    // UI state (always defaults)
    isLoading: false,
    inputValue: "",
    isCompact: false,
};
```

### 5.2 Flag-to-State Mapping Table

| CLI Flag | initialState Field | React Component That Reads It |
|----------|-------------------|-------------------------------|
| `--verbose` | `verbose` | Message rendering |
| `--print` | `isSingleTurn` | REPL mode switcher |
| `--disable-slash-commands` | `disableSlashCommands` | REPL command list |
| `--allowed-tools` | `toolPermissionContext` | Permission gate |
| `--effort` | `effortLevel` | Status bar |
| `--agent` | `agentDefinition` | System prompt builder |
| `--resume <id>` | `messages`, `sessionId` | Message list |
| `--model` | `model` | API request builder |

---

## 6. AppStateRoot and AppStateProvider

### 6.1 AppStateRoot (Pf1)

**Source location:** `chunks.176.mjs:643`

`AppStateRoot` is the top-level React component for the main REPL session. It wraps two sub-components:
1. `FpsMetricsWrapper` (BDq) — Provides FPS context to the entire tree for performance monitoring
2. `AppStateProvider` (u_) — Provides the state store via React context

```javascript
// ============================================
// AppStateRoot - Top-level React component for main REPL
// Location: chunks.176.mjs:643-660
// ============================================

// READABLE (for understanding):
function AppStateRoot({ initialState, onChangeAppState, children }) {
    return React.createElement(FpsMetricsWrapper, null,
        React.createElement(AppStateProvider, {
            initialState: initialState,
            onChangeAppState: onChangeAppState
        },
            children
        )
    );
}

// Mapping: Pf1→AppStateRoot, BDq→FpsMetricsWrapper, Yj→AppStateProvider
```

### 6.2 AppStateProvider (Yj)

**Source location:** `chunks.148.mjs:2544`

`AppStateProvider` creates the state store (via `createStateStore`) and exposes it through React context. All components that need to read or write app state use this context.

```javascript
// ============================================
// AppStateProvider - React context provider for state store
// Location: chunks.148.mjs:2544-2583
// ============================================

// READABLE (for understanding):
function AppStateProvider({ initialState, onChangeAppState, children }) {
    let storeRef = useRef(null);
    if (!storeRef.current) {
        storeRef.current = createStateStore(initialState, onChangeAppState);
    }

    return React.createElement(StoreContext.Provider, {
        value: storeRef.current
    }, children);
}

// Mapping: Yj→AppStateProvider, WX1→createStateStore
```

---

## 7. State Reading Hooks

### 7.1 useAppState (M1)

**Source location:** `chunks.148.mjs:2598`

Reads a single state slice reactively. Uses React's `useSyncExternalStore` for concurrent-safe reads.

```javascript
// ============================================
// useAppState - Reactive state slice reader
// Location: chunks.148.mjs:2598-2610
// ============================================

// ORIGINAL (for source lookup):
function M1(A) {
    let q = A6(3), K = Bp8(), Y;
    return (0, C7.useSyncExternalStore)(q.subscribe, () => A(q.getState()))
}

// READABLE (for understanding):
function useAppState(selector) {
    let store = useContext(StoreContext);
    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.getState())
    );
}

// Mapping: M1→useAppState, A→selector, K→store, XU6→StoreContext
```

**Pattern:** `M1(state => state.messages)` reads `messages` from the store. When `messages` changes, the component re-renders. When other fields change (e.g., `verbose`), the component does NOT re-render (selector optimization).

### 7.2 useSetAppState (xA)

**Source location:** `chunks.148.mjs:2613`

Returns the store's `setState` dispatcher for writing state updates.

```javascript
// ============================================
// useSetAppState - State writer hook
// Location: chunks.148.mjs:2613-2615
// ============================================

// ORIGINAL (for source lookup):
function xA() {
    return (0, I7.useContext)(tA).setState
}

// READABLE (for understanding):
function useSetAppState() {
    return useContext(StoreContext).setState;
}

// Mapping: xA→useSetAppState, XU6→StoreContext
```

---

## 8. onChangeAppStateHandler (K11)

**Source location:** `chunks.176.mjs:581`

**What it does:** The synchronous callback fired by `createStateStore` after every state update. Responsible for persisting relevant state changes to disk and triggering side effects.

**Key responsibilities:**
1. **Settings persistence:** Writes `verbose`, `theme`, `model`, `effortLevel` etc. to user settings JSON
2. **MCP refresh:** Triggers MCP server reconnection when MCP config changes
3. **Badge updates:** Updates system tray badge count on macOS
4. **Telemetry:** Fires analytics events for significant state transitions

```javascript
// ============================================
// onChangeAppStateHandler - State-to-disk sync callback
// Location: chunks.176.mjs:581-640
// ============================================

// READABLE (for understanding):
function onChangeAppStateHandler({ newState, oldState }) {
    if (newState.verbose !== oldState.verbose) {
        saveUserSetting("verbose", newState.verbose);
    }
    if (newState.theme !== oldState.theme) {
        saveUserSetting("theme", newState.theme);
    }
    if (newState.mcpConfig !== oldState.mcpConfig) {
        refreshMcpServers(newState.mcpConfig);
    }
    if (newState.unreadCount !== oldState.unreadCount) {
        updateBadgeCount(newState.unreadCount);
    }
}

// Mapping: K11→onChangeAppStateHandler
```

---

## 10. Deep Integration: State Store Subscription Patterns

### 10.1 The Subscription Model

The `createStateStore` (WX1) implements a publish-subscribe pattern compatible with React's `useSyncExternalStore`. This enables components to subscribe to specific state slices without re-rendering on unrelated changes.

**Subscription Flow:**

```
Component calls useAppState(selector)
    │
    ├── useSyncExternalStore(
    │       store.subscribe,      ← Returns unsubscribe function
    │       () => selector(store.getState())
    │   )
    │
    └── React registers subscriber
            │
            ├── On setState: All subscribers notified
            │
            └── Component re-renders only if selector result changed
```

### 10.2 Selector Optimization Pattern

```javascript
// ============================================
// useAppState - Selector-based state reading with bail-out
// Location: chunks.148.mjs:2598-2610
// ============================================

// ORIGINAL (for source lookup):
function M1(A) {
    let q = A6(3), K = Bp8(), Y;
    return (0, C7.useSyncExternalStore)(q.subscribe, () => A(q.getState()))
}

// READABLE (for understanding):
function useAppState(selector) {
    // Get store from context (memoized by React)
    let store = useContext(StoreContext);

    // useSyncExternalStore handles:
    // 1. Subscribing to store changes
    // 2. Running selector to get derived value
    // 3. Bail-out if selector returns same reference
    return useSyncExternalStore(
        store.subscribe,                    // Subscribe to all changes
        () => selector(store.getState())   // Selector runs on every change
    );
}

// Mapping: M1→useAppState, A→selector, A6→useContext, C7→React,
//          Bp8→useStoreContext, XU6→StoreContext
```

**Why this approach:**
- **Selector pattern** prevents unnecessary re-renders. If `messages` changes but the component only reads `verbose`, no re-render occurs.
- **Reference equality** (`Object.is`) determines if re-render is needed. Selectors should return stable references.
- **No intermediate caching** at the store level—React's concurrent rendering handles batching.

### 10.3 State Update Propagation

```javascript
// ============================================
// State update propagation with onChange callback
// Location: chunks.85.mjs:1747-1766 (inferred from WX1)
// ============================================

// READABLE (for understanding):
function createStateStore(initialState, onChangeCallback) {
    let currentState = initialState;
    let subscribers = new Set();

    return {
        setState: (updater) => {
            let prevState = currentState;
            let nextState = updater(prevState);

            // Bail-out: Same reference = no change
            if (Object.is(nextState, prevState)) return;

            currentState = nextState;

            // 1. Synchronous callback FIRST (for side effects)
            onChangeCallback?.({ newState: nextState, oldState: prevState });

            // 2. Then notify all subscribers (React re-renders)
            for (let notify of subscribers) notify();
        }
    };
}
```

**Critical ordering:** The `onChangeCallback` runs BEFORE React subscriber notifications. This ensures:
1. Disk writes complete before UI updates
2. MCP server refresh starts before new state renders
3. Telemetry events fire in correct order

---

## 11. Deep Integration: Agent Loop Invocation from UI

### 11.1 The Query Entry Point

The REPL component initiates LLM queries through the `onQuery` callback, which builds context and invokes `mainAgentLoop` (Yh):

```javascript
// ============================================
// sessionOrchestrator (ot8) - Main REPL orchestration
// Location: chunks.196.mjs:3-29
// ============================================

// ORIGINAL (for source lookup):
function ot8({
    commands: A,
    debug: q,
    initialTools: K,
    initialMessages: Y,
    pendingHookMessages: z,
    initialFileHistorySnapshots: _,
    initialContentReplacements: w,
    initialAgentName: O,
    initialAgentColor: $,
    mcpClients: H,
    dynamicMcpConfig: j,
    autoConnectIdeFlag: J,
    strictMcpConfig: M = !1,
    systemPrompt: D,
    appendSystemPrompt: X,
    onBeforeQuery: P,
    onTurnComplete: W,
    disabled: Z = !1,
    mainThreadAgentDefinition: G,
    disableSlashCommands: f = !1,
    taskListId: v,
    remoteSessionConfig: N,
    directConnectConfig: V,
    sshSession: L,
    thinkingConfig: h
}) { ... }

// READABLE (for understanding):
function sessionOrchestrator({
    commands,                    // Slash commands registry
    debug,                       // Debug mode flag
    initialTools,               // Initial tool definitions
    initialMessages,            // Session messages from --resume
    pendingHookMessages,        // Messages from PreToolUse hooks
    initialFileHistorySnapshots,// Git status snapshots
    initialContentReplacements, // Content replacement rules
    initialAgentName,           // Agent name for display
    initialAgentColor,          // Agent color for UI
    mcpClients,                 // MCP server connections
    dynamicMcpConfig,           // Dynamic MCP configuration
    autoConnectIdeFlag,         // Auto-connect to IDE
    strictMcpConfig = false,    // Strict MCP config validation
    systemPrompt,               // Custom system prompt
    appendSystemPrompt,         // Appended system prompt
    onBeforeQuery,              // Pre-query hook
    onTurnComplete,             // Post-turn callback
    disabled = false,           // Disable REPL
    mainThreadAgentDefinition,  // Agent definition for main thread
    disableSlashCommands = false,
    taskListId,                 // Todo list identifier
    remoteSessionConfig,        // Remote session configuration
    directConnectConfig,        // Direct connect configuration
    sshSession,                 // SSH session info
    thinkingConfig              // Extended thinking config
}) { ... }

// Mapping: ot8→sessionOrchestrator, A→commands, q→debug, K→initialTools,
//          Y→initialMessages, Z→disabled, G→mainThreadAgentDefinition
```

### 11.2 Building the Tool Use Context

Before invoking the agent loop, the session orchestrator builds a comprehensive `toolUseContext` object:

```javascript
// ============================================
// buildToolUseContext (OW) - Constructs context for agent loop
// Location: chunks.196.mjs:562-658
// ============================================

// ORIGINAL (for source lookup):
let OW = N8.useCallback((P1, Y8, V8, c7) => {
    let FA = l.getState();
    return {
        abortController: V8,
        options: {
            commands: qA,
            tools: U8,
            debug: q,
            verbose: FA.verbose,
            mainLoopModel: c7,
            thinkingConfig: FA.thinkingEnabled !== !1 ? h : { type: "disabled" },
            mcpClients: gt8(H, FA.mcp.clients),
            mcpResources: FA.mcp.resources,
            ideInstallationStatus: K1,
            isNonInteractiveSession: !1,
            dynamicMcpConfig: T6,
            theme: OT,
            agentDefinitions: P4 ? {...FA.agentDefinitions, allowedAgentTypes: P4} : FA.agentDefinitions,
            customSystemPrompt: D,
            appendSystemPrompt: X,
            refreshTools: () => {...}
        },
        getAppState: () => l.getState(),
        setAppState: i,
        messages: P1,
        setMessages: gq,
        // ... more callbacks
    }
}, [qA, U8, q, H, K1, T6, OT, P4, l, i, V86, o6, Q6, aN, qS, Z, D, X, S2])

// READABLE (for understanding):
let buildToolUseContext = useCallback((messages, extraMessages, abortController, model) => {
    let appState = store.getState();

    return {
        // Abort controller for cancellation
        abortController: abortController,

        // Options passed to LLM API
        options: {
            commands: slashCommands,           // Available slash commands
            tools: availableTools,             // Tool definitions
            debug: debugMode,                  // Debug flag
            verbose: appState.verbose,         // Verbose logging
            mainLoopModel: model,              // Model to use
            thinkingConfig: appState.thinkingEnabled
                ? thinkingConfig
                : { type: "disabled" },
            mcpClients: activeMcpClients,      // Connected MCP servers
            mcpResources: appState.mcp.resources,
            ideInstallationStatus: ideStatus,
            isNonInteractiveSession: false,
            dynamicMcpConfig: dynamicMcpConfig,
            theme: currentTheme,
            agentDefinitions: agentDefs,
            customSystemPrompt: customPrompt,
            appendSystemPrompt: appendPrompt,
            refreshTools: () => { /* rebuild tool list */ }
        },

        // State accessors
        getAppState: () => store.getState(),
        setAppState: setState,

        // Message management
        messages: messages,
        setMessages: setMessages,

        // Callbacks
        updateFileHistoryState: (updater) => {...},
        updateAttributionState: (updater) => {...},
        openMessageSelector: () => {...},
        onChangeAPIKey: reverifyAPIKey,
        readFileState: fileStateRef,
        setToolJSX: setToolJSX,
        addNotification: addNotification,
        sendOSNotification: sendNotification,
        onChangeDynamicMcpConfig: updateMcpConfig,
        onInstallIDEExtension: installIDEExtension,

        // Streaming state
        nestedMemoryAttachmentTriggers: new Set(),
        dynamicSkillDirTriggers: new Set(),
        discoveredSkillNames: new Set(),
        setResponseLength: setResponseLength,
        pushApiMetricsEntry: undefined,
        setStreamMode: setStreamMode,
        onCompactProgress: (event) => { /* handle compact events */ },
        setInProgressToolUseIDs: setInProgressToolUseIDs,
        setHasInterruptibleToolInProgress: (flag) => {...},

        // Session management
        resume: resumeSession,
        setConversationId: setConversationId,
        requestPrompt: undefined,
        contentReplacementState: contentReplacements
    };
}, [dependencies]);

// Mapping: OW→buildToolUseContext, l→store, i→setAppState, gq→setMessages,
//          qA→slashCommands, U8→availableTools, H→mcpClients
```

### 11.3 Invoking the Main Agent Loop

```javascript
// ============================================
// mainAgentLoop (Yh) - Entry point for LLM queries
// Location: chunks.148.mjs:875-879
// ============================================

// ORIGINAL (for source lookup):
async function* Yh(A) {
    let q = [],
        K = yield* omY(A, q);
    for (let Y of q) pb(Y, "completed");
    return K
}

// READABLE (for understanding):
async function* mainAgentLoop(context) {
    // Track completed tool uses for post-processing
    let completedToolUses = [];

    // Delegate to core loop
    let result = yield* mainAgentLoopCore(context, completedToolUses);

    // Mark all tool uses as completed
    for (let toolUse of completedToolUses) {
        markToolUseCompleted(toolUse, "completed");
    }

    return result;
}

// Mapping: Yh→mainAgentLoop, q→completedToolUses, omY→mainAgentLoopCore,
//          pb→markToolUseCompleted
```

### 11.4 The Core Agent Loop

```javascript
// ============================================
// mainAgentLoopCore (omY) - Core iteration logic
// Location: chunks.148.mjs:882-903
// ============================================

// ORIGINAL (for source lookup):
async function* omY(A, q) {
    let {
        systemPrompt: K,
        userContext: Y,
        systemContext: z,
        canUseTool: _,
        fallbackModel: w,
        querySource: O,
        maxTurns: $,
        skipCacheWrite: H
    } = A, j = A.deps ?? SKq(), J = {
        messages: A.messages,
        toolUseContext: A.toolUseContext,
        maxOutputTokensOverride: A.maxOutputTokensOverride,
        autoCompactTracking: void 0,
        stopHookActive: void 0,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: !1,
        turnCount: 1,
        pendingToolUseSummary: void 0,
        transition: void 0
    }, M = null, D = RKq();
    while (!0) { ... }
}

// READABLE (for understanding):
async function* mainAgentLoopCore(params, completedToolUses) {
    let {
        systemPrompt,
        userContext,
        systemContext,
        canUseTool,
        fallbackModel,
        querySource,
        maxTurns,
        skipCacheWrite
    } = params;

    // Dependency injection for testing/mocking
    let deps = params.deps ?? createDefaultDependencies();

    // Iteration state (persists across turns)
    let iterationState = {
        messages: params.messages,
        toolUseContext: params.toolUseContext,
        maxOutputTokensOverride: params.maxOutputTokensOverride,
        autoCompactTracking: undefined,
        stopHookActive: undefined,
        maxOutputTokensRecoveryCount: 0,
        hasAttemptedReactiveCompact: false,
        turnCount: 1,
        pendingToolUseSummary: undefined,
        transition: undefined
    };

    // Main loop
    while (true) {
        // ... turn processing
    }
}

// Mapping: omY→mainAgentLoopCore, A→params, q→completedToolUses,
//          K→systemPrompt, Y→userContext, z→systemContext,
//          j→iterationState, SKq→createDefaultDependencies
```

---

## 12. Deep Integration: Event Stream Processing

### 12.1 Event Flow Through the Pipeline

```
Anthropic API SSE Stream
        │
        ▼
j.callModel() → Anthropic SDK
        │
        ▼ for await (event of stream)
        │
┌───────┴───────┐
│  Yield event  │
└───────┬───────┘
        │
        ▼
Agent Loop processes:
  - content_block_start → setStreamMode
  - content_block_delta → accumulate text/tool input
  - message_stop → finalize
        │
        ▼
Yield processed event to UI:
  - type: "assistant" for complete messages
  - type: "tombstone" for removed messages
  - type: "stream_event" for real-time updates
        │
        ▼
handleStreamedEvent → processStreamEvent
        │
        ▼
React setState calls
```

### 12.2 Streaming Tool Executor Integration

```javascript
// ============================================
// StreamingToolExecutor (ui6) - Parallel tool execution during streaming
// Location: chunks.148.mjs:3 (class definition)
// ============================================

// ORIGINAL (for source lookup):
let s = D.gates.streamingToolExecution ? new ui6(X.options.tools, _, X) : null;

// Later in the loop:
if (s && !X.abortController.signal.aborted) {
    for (let C6 of u6) s.addTool(C6, Q6);  // Add tool_use to executor
}

if (s && !X.abortController.signal.aborted) {
    for (let u6 of s.getCompletedResults())  // Get completed tool results
        if (u6.message) yield u6.message;
}

// READABLE (for understanding):
// Create streaming tool executor if gate is enabled
let streamingToolExecutor = featureGates.streamingToolExecution
    ? new StreamingToolExecutor(tools, canUseTool, toolUseContext)
    : null;

// During streaming, add tool_use blocks to executor
if (streamingToolExecutor && !abortController.signal.aborted) {
    for (let toolUseBlock of assistantMessageToolUses) {
        streamingToolExecutor.addTool(toolUseBlock, assistantMessage);
    }
}

// Yield completed tool results as they finish
if (streamingToolExecutor && !abortController.signal.aborted) {
    for (let result of streamingToolExecutor.getCompletedResults()) {
        if (result.message) {
            yield result.message;  // Tool result becomes user message
        }
    }
}

// Mapping: ui6→StreamingToolExecutor, s→streamingToolExecutor,
//          D.gates→featureGates, X.options.tools→tools,
//          _→canUseTool, X→toolUseContext
```

**Key insight:** The `StreamingToolExecutor` enables parallel tool execution while the LLM is still streaming. As each `tool_use` block completes, it's added to the executor queue. The executor runs tools concurrently and yields results back to the agent loop as they complete.

---

## 13. Deep Integration: Error Handling Coordination

### 13.1 Error Recovery Patterns

```javascript
// ============================================
// Error handling in mainAgentLoopCore
// Location: chunks.148.mjs:1116-1149
// ============================================

// ORIGINAL (for source lookup):
} catch (D6) {
    if (D6 instanceof R36 && w) {
        if (N6 = w, o = !0, yield* Sp8(e, "Model fallback triggered"),
            e.length = 0, Y6.length = 0, H6.length = 0, J6 = !1, s)
            s.discard(), s = new ui6(X.options.tools, _, X);
        X.options.mainLoopModel = w;
        d("tengu_model_fallback_triggered", {...});
        continue
    }
    throw D6
}

// ... later:
} catch (D6) {
    _6(D6);
    let Q6 = D6 instanceof Error ? D6.message : String(D6);
    d("tengu_query_error", {...});
    if (D6 instanceof n06 || D6 instanceof pd)
        return yield y9({content: D6.message}), {reason: "image_error"};
    return yield* Sp8(e, Q6), yield Ug({toolUse: !1}), {reason: "model_error", error: D6}
}

// READABLE (for understanding):
// Model fallback recovery
} catch (error) {
    if (error instanceof OverloadedError && fallbackModel) {
        // Switch to fallback model
        currentModel = fallbackModel;
        shouldRetry = true;

        // Yield notification to user
        yield* addErrorMessage(assistantMessages, "Model fallback triggered");

        // Reset all buffers
        assistantMessages.length = 0;
        toolResults.length = 0;
        toolUseBlocks.length = 0;
        hasToolExecution = false;

        // Discard and recreate streaming tool executor
        if (streamingToolExecutor) {
            streamingToolExecutor.discard();
            streamingToolExecutor = new StreamingToolExecutor(tools, canUseTool, context);
        }

        // Update model in options
        context.options.mainLoopModel = fallbackModel;

        // Log telemetry
        logEvent("tengu_model_fallback_triggered", {
            original_model: error.originalModel,
            fallback_model: fallbackModel,
            entrypoint: "cli",
            queryChainId: chainId,
            queryDepth: queryTracking.depth
        });

        continue;  // Retry with fallback model
    }
    throw error;
}

// Final error handling
} catch (error) {
    reportError(error);
    let errorMessage = error instanceof Error ? error.message : String(error);

    logEvent("tengu_query_error", {
        assistantMessages: assistantMessages.length,
        toolUses: assistantMessages.flatMap(m =>
            m.message.content.filter(c => c.type === "tool_use")
        ).length,
        queryChainId: chainId,
        queryDepth: queryTracking.depth
    });

    // Image processing errors have special handling
    if (error instanceof ImageProcessingError || error instanceof ImageValidationError) {
        yield createUserMessage({content: error.message});
        return { reason: "image_error" };
    }

    // Generic error: yield error message and cleanup
    yield* addErrorMessage(assistantMessages, errorMessage);
    yield updateUserMessage({toolUse: false});

    reportErrorToTelemetry("Query error", error);

    return { reason: "model_error", error: error };
}

// Mapping: D6→error, R36→OverloadedError, w→fallbackModel, o→shouldRetry,
//          Sp8→addErrorMessage, e→assistantMessages, Y6→toolResults,
//          H6→toolUseBlocks, J6→hasToolExecution, s→streamingToolExecutor
```

### 13.2 Abort Handling

```javascript
// ============================================
// Abort handling in mainAgentLoopCore
// Location: chunks.148.mjs:1152-1161
// ============================================

// ORIGINAL (for source lookup):
if (X.abortController.signal.aborted) {
    if (s) {
        for await (let D6 of s.getRemainingResults())
            if (D6.message) yield D6.message
    } else yield* Sp8(e, "Interrupted by user");
    if (X.abortController.signal.reason !== "interrupt")
        yield Ug({toolUse: !1});
    return {reason: "aborted_streaming"}
}

// READABLE (for understanding):
if (abortController.signal.aborted) {
    // If using streaming tool executor, wait for remaining results
    if (streamingToolExecutor) {
        for await (let result of streamingToolExecutor.getRemainingResults()) {
            if (result.message) {
                yield result.message;  // Yield any completed tool results
            }
        }
    } else {
        // Without streaming executor, add interruption message
        yield* addErrorMessage(assistantMessages, "Interrupted by user");
    }

    // If abort wasn't an "interrupt" (e.g., user cancel vs timeout)
    if (abortController.signal.reason !== "interrupt") {
        yield updateUserMessage({toolUse: false});
    }

    return { reason: "aborted_streaming" };
}

// Mapping: X.abortController→abortController, s→streamingToolExecutor,
//          Sp8→addErrorMessage, e→assistantMessages, Ug→updateUserMessage
```

### 13.3 Tombstone Event for Context Overflow

```javascript
// ============================================
// Tombstone event generation for orphaned messages
// Location: chunks.148.mjs:1062-1071
// ============================================

// ORIGINAL (for source lookup):
if (D6) {
    for (let u6 of e) yield {
        type: "tombstone",
        message: u6
    };
    if (d("tengu_orphaned_messages_tombstoned", {
        orphanedMessageCount: e.length,
        queryChainId: u,
        queryDepth: R.depth
    }), e.length = 0, Y6.length = 0, H6.length = 0, J6 = !1, s)
        s.discard(), s = new ui6(X.options.tools, _, X)
}

// READABLE (for understanding):
if (contextOverflowDetected) {
    // Yield tombstone for every orphaned message
    for (let msg of orphanedMessages) {
        yield {
            type: "tombstone",
            message: msg
        };
    }

    // Log telemetry
    logEvent("tengu_orphaned_messages_tombstoned", {
        orphanedMessageCount: orphanedMessages.length,
        queryChainId: chainId,
        queryDepth: queryTracking.depth
    });

    // Reset all buffers
    orphanedMessages.length = 0;
    toolResults.length = 0;
    toolUseBlocks.length = 0;
    hasToolExecution = false;

    // Reset streaming tool executor
    if (streamingToolExecutor) {
        streamingToolExecutor.discard();
        streamingToolExecutor = new StreamingToolExecutor(tools, canUseTool, context);
    }
}

// Mapping: D6→contextOverflowDetected, e→orphanedMessages, u→chainId,
//          R→queryTracking, ui6→StreamingToolExecutor, s→streamingToolExecutor
```

---

## 14. Cross-Module State Synchronization

### 14.1 State Synchronization Patterns

The CLI, UI, and LLM core maintain synchronized state through several mechanisms:

| State Source | Sync Mechanism | Target |
|--------------|----------------|--------|
| CLI flags | Initial state object | AppState store |
| AppState store | `onChangeAppStateHandler` | Disk persistence |
| Tool execution | `setAppState` callback | UI components |
| Streaming events | `processStreamEvent` | React state |
| Abort signal | AbortController | Agent loop + UI |

### 14.2 Concurrent State Updates

React batches state updates within a single event loop tick:

```javascript
// ============================================
// Batched state updates example
// Location: chunks.196.mjs:694-720 (inferred)
// ============================================

// These updates are batched into a single re-render:
setStreamMode("tool-use");                    // Update stream mode
setResponseLength(prev => prev + chunkLen);   // Update token count
setStreamingToolUses(prev =>                  // Update tool preview
    new Map(prev).set(toolId, toolUse)
);
// Only ONE re-render occurs after all updates
```

---

## 15. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| renderAndWait | `chunks.189.mjs:754` | Main REPL mount |
| renderFullscreenComponent | `chunks.189.mjs:748` | Setup dialog wrapper |
| renderWithCallback | `chunks.189.mjs:741` | Promise-based dialog |
| createStateStore | `chunks.85.mjs:1747` | Observable store factory |
| AppStateProvider | `chunks.148.mjs:2544` | React context provider |
| AppStateRoot | `chunks.176.mjs:643` | Root component with FPS |
| useAppState | `chunks.148.mjs:2598` | State slice reader |
| useSetAppState | `chunks.148.mjs:2613` | State writer |
| onChangeAppStateHandler | `chunks.176.mjs:581` | State persistence |
| initialState construction | `chunks.192.mjs` | CLI flags to React state |
| sessionOrchestrator | `chunks.196.mjs:3` | Main REPL orchestration |
| buildToolUseContext | `chunks.196.mjs:562` | Context builder for agent loop |
| mainAgentLoop | `chunks.148.mjs:875` | Agent loop entry point |
| mainAgentLoopCore | `chunks.148.mjs:882` | Core iteration logic |
| StreamingToolExecutor | `chunks.148.mjs:3` | Parallel tool execution |
| handleCancel | `chunks.196.mjs:420` | Cancel propagation |
| getInputDialogType | `chunks.196.mjs:387` | Dialog priority dispatcher |
