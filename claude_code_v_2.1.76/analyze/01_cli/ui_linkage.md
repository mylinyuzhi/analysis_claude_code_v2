# CLI Flags to React/Ink UI Linkage

> Claude Code v2.1.76 — How command-line flags wire into the React/Ink component tree

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (CLI, Steering, Hooks)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, MCP)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands, UI Components)

Key symbols referenced throughout this document:

- `REPL` (TUA) - Root interactive UI component (chunks.196.mjs:3)
- `AppStateRoot` (Pf1) - React root wrapping FpsMetrics + AppStateProvider (chunks.176.mjs:643)
- `AppStateProvider` (u_) - React context provider for global state store (chunks.151.mjs:522)
- `createStateStore` (Gf6) - Observable store factory: getState/setState/subscribe (chunks.151.mjs:398)
- `useAppState` (v6) - Hook: reads a single state slice via useSyncExternalStore (chunks.151.mjs:576)
- `useSetAppState` (L7) - Hook: returns the setState dispatcher (chunks.151.mjs:591)
- `useStoreContext` (yhA) - Hook: returns the raw store object (chunks.151.mjs:574)
- `onChangeAppStateHandler` (K11) - State-to-disk sync callback (chunks.176.mjs:581)
- `renderWithCallback` (mGz) - Promise wrapper for one-shot React dialogs (chunks.197.mjs:741)
- `renderFullscreenComponent` (LF) - Full-screen dialog with AppStateProvider (chunks.197.mjs:748)
- `renderAndWait` ($l1) - Renders Ink app and blocks until exit (chunks.197.mjs:754)
- `createRenderOptions` (rGz) - Builds Ink render options with FPS/flicker tracking (chunks.197.mjs:958)
- `FpsMetricsTracker` (_QA) - Tracks per-frame render duration (chunks.176.mjs:1020)
- `FpsMetricsWrapper` (BDq) - React component providing FPS context (chunks.176.mjs:657)
- `showSetupScreens` (gRq) - Sequential onboarding/trust dialog orchestrator (chunks.197.mjs:758)

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
//          K→options, Y→done, u_→AppStateProvider, dX→KeybindingSetup,
//          wO→React, mGz→renderWithCallback
```

**Three wrapping layers:**
1. `AppStateProvider` (u_) — Creates an isolated state store for the dialog. Dialogs like the onboarding screen can read and write app state (e.g., recording `hasCompletedOnboarding`). The `onChangeAppState` option controls whether state changes persist to disk (`K11`) or are transient.
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

### `createStateStore` (Gf6) — Observable Store Factory

```javascript
// ============================================
// createStateStore - Minimal observable state store (zustand-compatible)
// Location: chunks.151.mjs:398-420
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

// Mapping: Gf6→createStateStore, A→initialState, q→onChangeCallback,
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

// Mapping: Pf1→AppStateRoot, BDq→FpsMetricsWrapper, u_→AppStateProvider
```

### 6.2 AppStateProvider (u_)

**Source location:** `chunks.151.mjs:522`

`AppStateProvider` creates the state store (via `createStateStore`) and exposes it through React context. All components that need to read or write app state use this context.

```javascript
// ============================================
// AppStateProvider - React context provider for state store
// Location: chunks.151.mjs:522-560
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

// Mapping: u_→AppStateProvider, Gf6→createStateStore
```

---

## 7. State Reading Hooks

### 7.1 useAppState (v6)

**Source location:** `chunks.151.mjs:576`

Reads a single state slice reactively. Uses React's `useSyncExternalStore` for concurrent-safe reads.

```javascript
// ============================================
// useAppState - Reactive state slice reader
// Location: chunks.151.mjs:576-590
// ============================================

// ORIGINAL (for source lookup):
function v6(A) {
    let q = (0, I7.useContext)(tA);
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

// Mapping: v6→useAppState, A→selector, q→store, tA→StoreContext
```

**Pattern:** `v6(state => state.messages)` reads `messages` from the store. When `messages` changes, the component re-renders. When other fields change (e.g., `verbose`), the component does NOT re-render (selector optimization).

### 7.2 useSetAppState (L7)

**Source location:** `chunks.151.mjs:591`

Returns the store's `setState` dispatcher for writing state updates.

```javascript
// ============================================
// useSetAppState - State writer hook
// Location: chunks.151.mjs:591-595
// ============================================

// ORIGINAL (for source lookup):
function L7() {
    return (0, I7.useContext)(tA).setState
}

// READABLE (for understanding):
function useSetAppState() {
    return useContext(StoreContext).setState;
}

// Mapping: L7→useSetAppState, tA→StoreContext
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

## 9. Key Integration Points Summary

| Integration Point | Location | Description |
|-------------------|----------|-------------|
| renderAndWait | `chunks.197.mjs:754` | Main REPL mount |
| renderFullscreenComponent | `chunks.197.mjs:748` | Setup dialog wrapper |
| renderWithCallback | `chunks.197.mjs:741` | Promise-based dialog |
| createStateStore | `chunks.151.mjs:398` | Observable store factory |
| AppStateProvider | `chunks.151.mjs:522` | React context provider |
| AppStateRoot | `chunks.176.mjs:643` | Root component with FPS |
| useAppState | `chunks.151.mjs:576` | State slice reader |
| useSetAppState | `chunks.151.mjs:591` | State writer |
| onChangeAppStateHandler | `chunks.176.mjs:581` | State persistence |
| initialState construction | `chunks.197.mjs:1600` | CLI flags to React state |
