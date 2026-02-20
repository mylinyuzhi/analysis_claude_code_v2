# CLI Flags to React/Ink UI Linkage

> Claude Code v2.1.38 — How command-line flags wire into the React/Ink component tree

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (CLI, Steering, Hooks)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, MCP)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (Slash Commands, UI Components)

Key symbols referenced throughout this document:

- `REPL` (TUA) - Root interactive UI component (chunks.188.mjs:3)
- `AppStateRoot` (Pf1) - React root wrapping FpsMetrics + AppStateProvider (chunks.176.mjs:643)
- `AppStateProvider` (u_) - React context provider for global state store (chunks.151.mjs:522)
- `createStateStore` (Gf6) - Observable store factory: getState/setState/subscribe (chunks.151.mjs:398)
- `useAppState` (v6) - Hook: reads a single state slice via useSyncExternalStore (chunks.151.mjs:576)
- `useSetAppState` (L7) - Hook: returns the setState dispatcher (chunks.151.mjs:591)
- `useStoreContext` (yhA) - Hook: returns the raw store object (chunks.151.mjs:574)
- `onChangeAppStateHandler` (K11) - State-to-disk sync callback (chunks.176.mjs:581)
- `renderWithCallback` (mGz) - Promise wrapper for one-shot React dialogs (chunks.189.mjs:741)
- `renderFullscreenComponent` (LF) - Full-screen dialog with AppStateProvider (chunks.189.mjs:748)
- `renderAndWait` ($l1) - Renders Ink app and blocks until exit (chunks.189.mjs:754)
- `createRenderOptions` (rGz) - Builds Ink render options with FPS/flicker tracking (chunks.189.mjs:958)
- `FpsMetricsTracker` (_QA) - Tracks per-frame render duration (chunks.189.mjs:TBD)
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
// Location: chunks.189.mjs:754-757
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
// Location: chunks.189.mjs:741-747
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
        // done() is given to the component as a prop
        // When component finishes, it calls done(result), resolving the promise
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
// Location: chunks.189.mjs:748-753
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
            React.createElement(KeybindingSetup, null,  // dX: ThemeProvider+keybindings
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
    let subscribers = new Set();   // React component re-render notifications

    return {
        getState: () => currentState,

        setState: (updater) => {
            let prevState = currentState;
            let nextState = updater(prevState);

            // Bail out if no change (prevents spurious re-renders)
            if (Object.is(nextState, prevState)) return;

            currentState = nextState;

            // Side-channel: sync to persistent storage (synchronous, before render)
            onChangeCallback?.({ newState: nextState, oldState: prevState });

            // Notify React subscribers (triggers re-renders)
            for (let notify of subscribers) notify();
        },

        // useSyncExternalStore API: returns unsubscribe function
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

2. **The updater function pattern** (`setState(fn)` not `setState(value)`) is essential for concurrent React. If multiple updates queue while React is in the middle of rendering, each update sees the latest committed state rather than a stale closure. The pattern mirrors React's own `useState(fn)` dispatch.

3. **`Object.is` bail-out** is identical to the check React uses internally. If an updater returns the same object reference (e.g., `setState(s => s)` — a no-op), the notification cycle is skipped entirely.

4. **Dual notification system:** After committing new state, the store fires two notifications:
   - `onChangeCallback` (`K11` / `onChangeAppStateHandler`) — synchronous side effects: write settings to disk, update MCP clients, refresh badge count
   - All `subscribers` — trigger React `useSyncExternalStore` re-renders

5. **Subscription returns an unsubscribe closure.** The closure `() => subscribers.delete(notify)` is returned from `subscribe()` and called by React when the component unmounts (via `useSyncExternalStore`'s cleanup).

**Why not use Zustand directly?**

The store API is functionally equivalent to Zustand v4's vanilla store. The likely reasons for hand-rolling it:

- **Bundle size:** Zustand adds ~2KB. The hand-rolled version is ~20 lines. At 190 chunks, every KB matters.
- **The `onChangeCallback` hook:** Zustand's vanilla store does not have a built-in callback for every state change. Adding `K11` as a parameter to the store constructor is cleaner than monkey-patching or subscribing separately.
- **No immer/middleware:** The REPL's state updates are already manually immutable (all components use spread). Zustand's middleware ecosystem is unnecessary.

**Key insight:** The `onChangeCallback` fires **synchronously inside `setState`**, before any React re-render. This guarantees that persistent storage (settings files, todo files) is updated atomically with the state commit. If the process is killed between a state update and the next render (e.g., OOM kill), settings are already persisted.

### `useAppState` (v6) — Reactive Slice Selector

```javascript
// ============================================
// useAppState - Reads a single state slice reactively
// Location: chunks.151.mjs:576-590
// ============================================

// ORIGINAL (for source lookup):
function v6(A) {
    let q = e(3), K = yhA(), Y;
    if (q[0] !== A || q[1] !== K) Y = () => {
        let w = K.getState(), H = A(w);
        if (w === H) throw Error(`Your selector in \`useAppState(${A.toString()})\` returned the original state, which is not allowed. You must instead return a property for optimised rendering.`);
        return H
    }, q[0] = A, q[1] = K, q[2] = Y;
    else Y = q[2];
    let z = Y;
    return eD.useSyncExternalStore(K.subscribe, z, z)
}

// READABLE (for understanding):
function useAppState(selector) {
    // Compiler memo cache: 3 slots [prev selector, prev store, prev snapshot fn]
    let cache = useCompilerCache(3);
    let store = useStoreContext();  // yhA(): get store from React context

    let snapshotFn;
    if (cache[0] !== selector || cache[1] !== store) {
        // Create new snapshot function bound to this selector
        snapshotFn = () => {
            let fullState = store.getState();
            let slice = selector(fullState);
            // Guard: selector must return a property, not the full state object
            if (fullState === slice) {
                throw new Error(
                    `Your selector in \`useAppState(${selector.toString()})\` ` +
                    `returned the original state, which is not allowed. ` +
                    `You must instead return a property for optimised rendering.`
                );
            }
            return slice;
        };
        cache[0] = selector;
        cache[1] = store;
        cache[2] = snapshotFn;
    } else {
        snapshotFn = cache[2];
    }

    // useSyncExternalStore: subscribes to store; re-renders when slice changes
    return React.useSyncExternalStore(store.subscribe, snapshotFn, snapshotFn);
}

// Mapping: v6→useAppState, A→selector, q→cache, e→useCompilerCache,
//          K→store, yhA→useStoreContext, Y→snapshotFn, w→fullState,
//          H→slice, z→snapshotFn (deduped), eD→React
```

**What it does:** A typed, memoized hook that subscribes a React component to a single slice of the global `AppState`. When any state update triggers subscribers, `useSyncExternalStore` will call `snapshotFn` to check if the subscribed slice actually changed. If the slice reference is unchanged, React does not re-render the component.

**How it works (step by step):**

1. `useStoreContext()` reads the store from React context (set by `AppStateProvider`).
2. The compiler cache avoids recreating `snapshotFn` unless the selector function or store instance changes.
3. `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` is React 18's API for subscribing to external stores. It is tear-safe (prevents reading inconsistent state in concurrent mode).
4. Every time `setState` fires all subscribers (step 4 of `createStateStore`), `useSyncExternalStore` calls `snapshotFn()` again. If the returned value is reference-equal to the previous one, the component does not re-render.

**The "no full state" guard:** The error thrown when `fullState === slice` is intentional. If a selector returns the entire state object (`s => s`), then every state update would be considered a change (since `setState` always creates a new state object). This would cause every subscriber to re-render on every state write, defeating the purpose of selective subscriptions. The guard enforces that selectors must return a property.

**Why `useSyncExternalStore` instead of `useContext`?**

`useContext` re-renders every consumer whenever the context value changes. Since the context value here is the store object (which never changes reference), using `useContext` directly would mean components never re-render reactively. `useSyncExternalStore` is the correct API for subscribing to external mutable state in React 18+.

### `useSetAppState` (L7) and `useStoreContext` (yhA)

- `useSetAppState` (L7) — Returns the store's `setState` dispatcher. Components that need to write state call `const setState = L7()` and then `setState(s => ({ ...s, key: value }))`.
- `useStoreContext` (yhA) — Returns the raw store object. Used internally by `v6` and directly by components that need both `getState` and `setState` (e.g., to read current state synchronously before dispatching).

---

## 5. The AppState Observer — `onChangeAppStateHandler` (K11)

`K11` is the `onChangeCallback` passed to `createStateStore`. It fires synchronously on every `setState` call (before any React re-render), comparing `newState` and `oldState` to determine which side effects to run.

```javascript
// ============================================
// onChangeAppStateHandler - Synchronize state changes to persistent storage
// Location: chunks.176.mjs:581-640
// ============================================

// ORIGINAL (for source lookup):
function K11({ newState: A, oldState: q }) {
    if (A.mainLoopModel !== q.mainLoopModel && A.mainLoopModel === null)
        Z7("userSettings", { model: void 0 }), CG(null);
    if (A.mainLoopModel !== q.mainLoopModel && A.mainLoopModel !== null)
        Z7("userSettings", { model: A.mainLoopModel }), CG(A.mainLoopModel);
    if (A.expandedView !== q.expandedView) { /* sync showExpandedTodos / showSpinnerTree */ }
    if (q !== null && A.todos !== q.todos) { /* persist each todo */ }
    if (A.verbose !== q.verbose && ...) { /* persist verbose */ }
    if (A.feedbackSurvey.timeLastShown !== q.feedbackSurvey.timeLastShown && ...) { /* persist */ }
    if (O$() && A.mcp !== q.mcp) { /* update MCP clients */ }
    if (A.queuedCommands !== q.queuedCommands) { /* update badge count */ }
    if (A.settings !== q.settings) { /* reapply settings, reload env */ }
}

// READABLE (for understanding):
function onChangeAppStateHandler({ newState, oldState }) {
    // [1] Model selection
    if (newState.mainLoopModel !== oldState.mainLoopModel) {
        if (newState.mainLoopModel === null) {
            updateUserSettings("userSettings", { model: undefined });  // Z7
            setGlobalModel(null);   // CG
        } else {
            updateUserSettings("userSettings", { model: newState.mainLoopModel });
            setGlobalModel(newState.mainLoopModel);
        }
    }

    // [2] Expanded view panel visibility
    if (newState.expandedView !== oldState.expandedView) {
        let showTasks = newState.expandedView === "tasks";
        let showTeammates = newState.expandedView === "teammates";
        let settings = getUserSettings();
        if (settings.showExpandedTodos !== showTasks || settings.showSpinnerTree !== showTeammates) {
            updateUserSettings(s => ({ ...s, showExpandedTodos: showTasks, showSpinnerTree: showTeammates }));
        }
    }

    // [3] Todo list persistence (per session ID)
    if (oldState !== null && newState.todos !== oldState.todos) {
        for (let sessionId in newState.todos) {
            persistTodo(newState.todos[sessionId], sessionId);  // $K1
        }
    }

    // [4] Verbose mode
    if (newState.verbose !== oldState.verbose && getUserSettings().verbose !== newState.verbose) {
        updateUserSettings(s => ({ ...s, verbose: newState.verbose }));
    }

    // [5] Feedback survey state
    if (newState.feedbackSurvey.timeLastShown !== oldState.feedbackSurvey.timeLastShown
        && newState.feedbackSurvey.timeLastShown !== null) {
        updateUserSettings(s => ({
            ...s,
            feedbackSurveyState: { lastShownTime: newState.feedbackSurvey.timeLastShown }
        }));
    }

    // [6] MCP client state
    if (isMultiClientEnabled() && newState.mcp !== oldState.mcp) {  // O$()
        updateMcpClients(newState.mcp.clients, newState.mcp.tools, newState.mcp.resources);  // CJq
        if (isBaseMode()) refreshBaseConnections();  // _f1
    }

    // [7] Command queue badge
    if (newState.queuedCommands !== oldState.queuedCommands) {
        setQueuedCommandCount(newState.queuedCommands.length);  // XR6
    }

    // [8] Settings object changed (runtime settings reload)
    if (newState.settings !== oldState.settings) {
        try {
            reloadSettings();       // i86()
            reapplySettings();      // n86()
            if (newState.settings.env !== oldState.settings.env) {
                reloadEnvSettings();    // q11()
            }
        } catch (err) {
            reportError(err instanceof Error ? err : Error(`Failed to apply settings changes: ${err}`));
        }
    }
}

// Mapping: K11→onChangeAppStateHandler, A→newState, q→oldState,
//          Z7→updateUserSettings, CG→setGlobalModel, $K1→persistTodo,
//          O$→isMultiClientEnabled, CJq→updateMcpClients, bc→isBaseMode,
//          _f1→refreshBaseConnections, XR6→setQueuedCommandCount,
//          i86→reloadSettings, n86→reapplySettings, q11→reloadEnvSettings
```

### Deep Analysis of Each State Projection

**[1] mainLoopModel — Model Selection Persistence**

**What it does:** When the user changes the active model (e.g., via `/model opus`), the change is written to `userSettings.json` and also pushed to a global singleton (`setGlobalModel`) that controls API calls.

**Why two writes?** The settings file is the persistent store (survives process restarts). The global singleton is the hot path for API calls — it avoids reading from disk on every LLM request.

**The null case:** When `mainLoopModel === null`, `model: undefined` (not `model: null`) is written to settings. This is important because `JSON.stringify` omits `undefined` properties, effectively deleting the key from the settings file and reverting to the default model.

**[2] expandedView — Panel Layout Persistence**

**What it does:** The UI can show an expanded "tasks" panel or "teammates" panel. This preference is persisted so it is restored on the next session.

**The two-flag design:** `showExpandedTodos` and `showSpinnerTree` are separate boolean keys in settings, but `expandedView` in state is a union string `"tasks" | "teammates" | "none"`. The handler converts between them. Note that `"none"` maps to both flags being `false`, and only one can be `true` at a time.

**[3] Todos — Per-Session Persistence**

**What it does:** The todo list is keyed by session ID. When any todo changes, all todos for all sessions are re-persisted.

**Why all todos, not just changed ones?** The reference inequality check (`newState.todos !== oldState.todos`) tells us the todos object changed, but not which session's todos changed. A more granular approach would require deep diffing the todos map. The current approach is safe (idempotent writes) if slightly wasteful for large todo sets.

**[4] Verbose Mode**

**What it does:** Syncs the `verbose` state flag to `userSettings.json`. The double-check `getUserSettings().verbose !== newState.verbose` prevents redundant writes when the settings already match the desired state.

**[5] Feedback Survey**

**What it does:** Records when the feedback survey was last shown. This enables a "don't show again for N days" cooldown.

**[6] MCP Client State**

**What it does:** When the MCP connection state changes (new server connected, server disconnected, server tools reloaded), the handler refreshes the MCP client registry.

**Why synchronous?** MCP client updates must happen before the next render so that tool lists reflect the updated MCP state. If done in a `useEffect`, there would be a render frame where the UI shows outdated MCP tools.

**[7] Command Queue Badge**

**What it does:** The command queue badge (shown in the terminal title or notification system) reflects how many queued commands are pending. `setQueuedCommandCount` updates a counter that is read by the OS notification badge API (on macOS) or the terminal window title.

**[8] Settings Object Reload**

**What it does:** When the in-memory `settings` object changes (e.g., via `/settings` command that writes a new config value), the settings system is told to reload from disk and reapply all settings.

**Why reload from disk if we just wrote to it?** Settings changes may also be made by other processes (another Claude Code terminal session, a text editor saving `.claude/settings.json`). The reload-from-disk pattern ensures consistency even with external edits.

**The try/catch:** Settings reload can fail if the settings file is corrupted. The error is reported to telemetry but does not crash the REPL.

---

## 6. REPL Component Props — CLI Flags vs State Store

The `REPL` (TUA) component receives two categories of inputs: **props** (passed once at mount, from CLI flags) and **reactive state** (read via `v6()` selectors, updated throughout the session).

### All 20 Props and Their Origins

```javascript
// REPL component signature (from chunks.188.mjs:3)
function TUA({
    commands,                   // [1] Slash command registry
    debug,                      // [2] Debug mode flag
    initialTools,               // [3] MCP tools loaded at startup
    initialMessages,            // [4] Messages for session restore
    initialFileHistorySnapshots,// [5] File history for session restore
    initialAgentName,           // [6] Agent display name (teams mode)
    initialAgentColor,          // [7] Agent UI color (teams mode)
    mcpClients,                 // [8] Active MCP server connections
    dynamicMcpConfig,           // [9] Runtime MCP configuration
    mcpCliEndpoint,             // [10] MCP CLI endpoint URL
    autoConnectIdeFlag,         // [11] Auto-connect IDE flag
    strictMcpConfig,            // [12] Strict MCP config mode
    systemPrompt,               // [13] Custom system prompt
    appendSystemPrompt,         // [14] System prompt addendum
    onBeforeQuery,              // [15] Pre-query hook callback
    onTurnComplete,             // [16] Post-turn hook callback
    disabled,                   // [17] Disable REPL input flag
    mainThreadAgentDefinition,  // [18] Agent definition object
    disableSlashCommands,       // [19] Disable slash commands flag
    taskListId,                 // [20] External task list ID
    remoteSessionConfig,        // [21] Remote session config (WebSocket)
    directConnectConfig         // [22] Direct connect config
})
```

**Props from CLI flags directly:**

- `debug` — from `--debug` or `--verbose` CLI flags. Enables debug log overlay and verbose tool output in the UI.
- `systemPrompt` — from `--system-prompt` or `--system-prompt-file`. Injected as the first system message in every LLM request.
- `appendSystemPrompt` — from `--append-system-prompt` or `--append-system-prompt-file`. Concatenated to the end of the system prompt.
- `strictMcpConfig` — from `--strict-mcp-config`. When true, only MCP servers from `--mcp-config` are used; project/user config servers are ignored.
- `disableSlashCommands` — from internal flag or remote session mode. When true, the command pipeline in REPL returns an empty array.
- `autoConnectIdeFlag` — from `--ide` or IDE detection logic. Triggers automatic IDE extension connection on mount.
- `mcpCliEndpoint` — from `--mcp-cli` mode configuration.
- `taskListId` — from `--task-list-id` flag for external task coordination.

**Props from session restore logic:**

- `initialMessages` — populated when `--continue`, `--resume`, `--from-pr`, or `--teleport` successfully loads a session. Contains the full message history array.
- `initialFileHistorySnapshots` — file operation history from the restored session, used to reconstruct the file diff view.
- `initialAgentName` / `initialAgentColor` — agent display identity for restored team sessions.

**Props from runtime initialization:**

- `commands` — the full slash command registry: built-in commands + skill commands + MCP commands. Built in the Commander action handler.
- `initialTools` — MCP tool definitions loaded at startup (before REPL mounts). Tools loaded during the session are added via the `mcp` state slice.
- `mcpClients` — active MCP server connection objects. In remote mode, this is empty `[]`.
- `dynamicMcpConfig` — runtime MCP server configs (from `--mcp-config` or IDE connection).

**Props from session mode:**

- `mainThreadAgentDefinition` — set when `--agent` flag specifies a custom agent type. The REPL uses this to select which system prompt and tool set to use.
- `remoteSessionConfig` — only set in remote session mode. Contains the WebSocket URL and auth token for the remote session.
- `directConnectConfig` — for direct peer-to-peer connection scenarios.

**Props from internal hooks:**

- `onBeforeQuery` — callback invoked before each LLM API call. Used by the session recording system and remote mode.
- `onTurnComplete` — callback invoked after each complete turn (user message → assistant response). Used for session persistence and metrics.
- `disabled` — set by the headless runner or during initialization to prevent user input.

---

## 7. Reactive State Selectors in the REPL

The REPL reads 20+ slices from the store using `v6()` (useAppState). Each selector creates a separate reactive subscription:

```javascript
// From chunks.188.mjs:3 — all v6() calls in TUA
let B  = v6((s) => s.toolPermissionContext);   // [1]
let S  = v6((s) => s.verbose);                 // [2]
let m  = v6((s) => s.mcp);                     // [3]
let b  = v6((s) => s.plugins);                 // [4]
let g  = v6((s) => s.agentDefinitions);        // [5]
let U  = v6((s) => s.fileHistory);             // [6]
let x  = v6((s) => s.todos);                   // [7]
let p  = v6((s) => s.thinkingEnabled);         // [8]
let l  = v6((s) => s.initialMessage);          // [9]
let r  = v6((s) => s.queuedCommands);          // [10]
let N1 = v6((s) => s.spinnerTip);              // [11]
let j1 = v6((s) => s.expandedView) === "tasks"; // [12] (derived boolean)
let q1 = v6((s) => s.pendingWorkerRequest);    // [13]
let t  = v6((s) => s.pendingSandboxRequest);   // [14]
let J1 = v6((s) => s.teamContext);             // [15]
let D1 = v6((s) => s.tasks);                   // [16]
let Z1 = v6((s) => s.workerSandboxPermissions); // [17]
let E1 = v6((s) => s.elicitation);             // [18]
let a  = v6((s) => s.viewingAgentTaskId);      // [19]
```

### What Each Selector Drives

**[1] `toolPermissionContext` (B) → Tool availability in the UI**

The permission context determines which tools are visible and which require confirmation. It is used by `tD(B)` (loadTools) to compute `x1`, the permission-filtered tool set. When the user approves a tool in the permission dialog, the context is updated, which re-triggers `tD(B)` computation via `useMemo`, updating the available tools without a REPL remount.

**[2] `verbose` (S) → Debug overlay visibility**

When `verbose === true`, the REPL shows additional debugging information in the message list: raw API token counts, tool execution times, full JSON payloads. The REPL conditionally renders debug-only components based on this selector.

**[3] `mcp` (m) → MCP server tools and commands**

The `mcp` slice has shape `{ clients, tools, commands, resources }`. The REPL uses:
- `m.commands` → merged into the slash command pipeline alongside plugin commands
- `m.tools` → merged into the tool set alongside `initialTools` via `useMemo`
When an MCP server connects during the session, `setState({ mcp: { ...mcp, clients: [...], tools: [...] } })` triggers a re-render with the new tools immediately available.

**[4] `plugins` (b) → Plugin commands and agents**

The plugin slice has shape `{ enabled, disabled, commands, agents, errors, needsRefresh }`. The `b.commands` array is merged with slash commands. If `needsRefresh` becomes true (plugin file changed on disk), the REPL triggers a plugin reload.

**[5] `agentDefinitions` (g) → Agent switcher UI**

The available agent definitions control the agent-switching UI. When the user switches agents (e.g., from default to a custom agent), a new definition is selected from this array, and the REPL updates its system prompt.

**[6] `fileHistory` (U) → File operation tracking**

Tracks which files have been read or written during the session. Used by the file diff viewer and by session restoration to rebuild the file history state.

**[7] `todos` (x) → Task list display**

The task list panel reads the current session's todos. The key is the session ID. The panel renders a checklist that updates reactively as the AI creates, updates, and completes tasks.

**[8] `thinkingEnabled` (p) → Thinking mode indicator**

When `thinkingEnabled === true`, the REPL shows a "thinking" indicator during LLM calls. The thinking budget and model-specific capabilities are also derived from this state.

**[9] `initialMessage` (l) → Pre-filled prompt from stdin**

If the user piped text to Claude Code (`echo "review this code" | claude`), the piped text is stored in `initialMessage`. The REPL's input component reads this on first render and pre-fills the prompt box (or auto-submits it, depending on mode).

**[10] `queuedCommands` (r) → Command queue display**

Commands can be queued while a turn is in progress (e.g., the user types a new message while Claude is thinking). The REPL shows a "N commands queued" indicator based on `r.length`. When the current turn completes, queued commands are processed in order.

**[11] `spinnerTip` (N1) → Spinner text override**

Normally the spinner shows generic "Thinking..." text. Specific operations can set `spinnerTip` to provide context-specific messages (e.g., "Searching files...", "Running tests...").

**[12] `expandedView === "tasks"` (j1) → Panel layout switch**

The boolean `j1` determines whether the expanded tasks panel is visible. When true, the REPL renders the tasks panel alongside the main conversation, reducing the space for the message list.

**[13] `pendingWorkerRequest` (q1) → Sandbox permission dialog**

When a background worker (sandboxed subprocess) requests a permission, this slice is set to the pending request object. The REPL renders a modal dialog for the user to approve or deny.

**[14] `pendingSandboxRequest` (t) → Sandbox permission dialog variant**

Similar to `pendingWorkerRequest` but for a different class of sandbox requests. Both may be active simultaneously (different dialog stacks).

**[15] `teamContext` (J1) → Team/swarm UI elements**

When in agent teams mode, the team context contains the list of active teammates, their states, and the communication channel. The REPL renders a teammates panel and routes messages accordingly.

**[16] `tasks` (D1) → Background task progress**

The running background tasks (launched via the `run_in_background` tool parameter). Each task has a progress summary, activity log, and completion status. The REPL renders a spinner tree showing task progress.

**[17] `workerSandboxPermissions` (Z1) → Permission queue navigation**

When multiple sandbox permission requests are queued, `Z1.selectedIndex` tracks which one is currently being shown to the user, and `Z1.queue` contains all pending requests.

**[18] `elicitation` (E1) → MCP elicitation queue**

MCP servers can request information from the user via "elicitation" requests (structured forms). The `E1.queue` contains pending elicitation requests. The REPL renders a dialog for each one in sequence.

**[19] `viewingAgentTaskId` (a) → Agent task focus**

In teams mode, the user can "focus" on a specific agent's task to see its detailed progress. This ID controls which agent's output is shown in the expanded view.

---

## 8. Flag-to-Component Wiring — Comprehensive Mapping

This section traces each significant CLI flag from the command line to its downstream React effect.

### `--verbose` / `-v`

**Pipeline:**
1. Commander parses `--verbose` → sets `options.verbose = true`
2. Action handler: `initialState.verbose = true`
3. `createStateStore(initialState, K11)` → initial state has `verbose: true`
4. `v6(s => s.verbose)` in REPL → returns `true`
5. REPL renders debug overlay components, verbose tool output, raw token counts

**K11 effect:** When `verbose` changes at runtime (e.g., via `/settings verbose true`), K11 persists it to `userSettings.json`.

### `--debug [filter]`

**Pipeline:**
1. Commander parses `--debug` → sets `options.debug = true` (or filter string)
2. Action handler: `replProps.debug = options.debug`
3. Passed as prop directly to `TUA` component
4. REPL propagates `debug` into tool components for raw JSON display and timing info

Note: `debug` is a **prop** not a state selector. It cannot be changed at runtime without remounting the REPL.

### `--model <model>`

**Pipeline:**
1. Commander parses `--model opus` → `options.model = "opus"`
2. Action handler resolves model alias: `E7 = resolveModel(options.model)`
3. `initialState.mainLoopModel = E7`
4. `createStateStore` initializes with the resolved model
5. The LLM API call reads `store.getState().mainLoopModel` for each request

**K11 effect:** When the model changes via `/model` command at runtime:
1. `setState(s => ({ ...s, mainLoopModel: newModel }))` is called
2. K11 fires: `updateUserSettings({ model: newModel })` writes to disk
3. `setGlobalModel(newModel)` updates the singleton used by the API client

### `--mcp-config <configs...>`

**Pipeline:**
1. Commander parses configs → `options.mcpConfig = ["path1.json", "..."]`
2. Action handler loads each config: `loadMcpConfigs(options.mcpConfig)` → `mcpConfigResult`
3. `dynamicMcpConfig = mcpConfigResult` → passed as prop to REPL
4. REPL passes `dynamicMcpConfig` to the MCP connection hook
5. MCP hook connects to servers, updates `mcp` state slice
6. `v6(s => s.mcp)` in REPL triggers re-render with new tools/commands available

**K11 effect:** When `mcp` slice changes (server connected/disconnected), K11 calls `updateMcpClients()` to sync the connection registry.

### `--strict-mcp-config`

**Pipeline:**
1. Commander parses `--strict-mcp-config` → `options.strictMcpConfig = true`
2. Passed directly as prop: `REPL.strictMcpConfig = true`
3. In REPL: when building MCP connection list, user/project config servers are excluded
4. Only `dynamicMcpConfig` servers are connected

### `--permission-mode <mode>` / `--dangerously-skip-permissions`

**Pipeline:**
1. Flag parsed → `options.permissionMode = "bypassPermissions"` (or resolved)
2. Action handler: `C3 = buildPermissionContext(options.permissionMode)`
3. `initialState.toolPermissionContext = C3`
4. `v6(s => s.toolPermissionContext)` (B) in REPL → used by `tD(B)` to load tools
5. Tools that require confirmation are suppressed entirely in bypassPermissions mode

**UI effect:** The Trust Dialog (Dialog 2 in `showSetupScreens`) is skipped when `permissionMode === "bypassPermissions"`. The BypassPermissionsDialog (Dialog 5) is shown instead (once, after acceptance it is not shown again).

### `--disable-slash-commands`

**Pipeline:**
1. Commander parses flag → `options.disableSlashCommands = true`
2. Passed as prop: `REPL.disableSlashCommands = true`
3. Inside REPL, command pipeline:
   ```javascript
   let E7 = sgA(_1, b.commands);     // plugin commands merged
   let V4 = sgA(E7, m.commands);     // mcp commands merged
   let RA = useMemo(() => f ? [] : V4, [f, V4]); // f = disableSlashCommands prop
   ```
4. `RA = []` — the empty array is passed to `InputComponent` as `commands={[]}`
5. The `/` trigger in the input box shows no completions

### `--system-prompt <prompt>` / `--system-prompt-file <file>`

**Pipeline:**
1. Flag parsed → `options.systemPrompt = "..."` (read from file if `--system-prompt-file`)
2. Passed as prop: `REPL.systemPrompt = options.systemPrompt`
3. Inside REPL, the query builder reads `systemPrompt` from props and prepends it to the system message array sent to the LLM API

### `--thinking` / `--effort <level>`

**Pipeline:**
1. Commander parses effort level → `options.effort = "high"`
2. Action handler resolves thinking config:
   - `initialState.effortValue = parseEffortValue(options.effort) ?? getEffortFromSettings()`
   - `initialState.thinkingEnabled = getInitialThinkingEnabled(model, settings)` (fw6)
3. `v6(s => s.thinkingEnabled)` in REPL drives the thinking UI indicator
4. The effort value is used in LLM API request parameters

### `--agent <agent>`

**Pipeline:**
1. Commander parses `--agent my-agent` → `options.agent = "my-agent"`
2. Action handler looks up agent definition: `bA = findAgentDefinition(options.agent, L6)`
3. `initialState.agent = bA?.agentType`
4. Props: `REPL.mainThreadAgentDefinition = bA`
5. The REPL uses `mainThreadAgentDefinition.systemPrompt` as the base system prompt
6. The REPL uses `mainThreadAgentDefinition.tools` to extend the tool set

### `--remote [description]`

**Pipeline:**
1. Commander parses `--remote` → triggers remote session creation
2. Remote session created: `{ id, url, authToken }` from server
3. `initialState.remoteSessionUrl = url`
4. Props: `REPL.remoteSessionConfig = { url, authToken, websocketUrl }`
5. REPL uses `pJ` (remote connection handler) instead of `hH` (local handler):
   ```javascript
   let $O = pJ.isRemoteMode ? pJ : hH;  // remote vs local connection handler
   ```
6. REPL tools are empty: `initialTools: []`
7. Commands are filtered: `commands = yOq(commands)` (remote-compatible only)

**UI effect:** The remote session URL is displayed in the REPL's status bar. All output is mirrored to the remote session for web-based monitoring.

### `--continue` / `--resume` / `--from-pr`

**Pipeline:**
1. Session restoration loads message history from disk
2. Props: `REPL.initialMessages = restoredMessages`
3. Props: `REPL.initialFileHistorySnapshots = restoredSnapshots`
4. The REPL's message list is pre-populated; the conversation continues as if no interruption occurred

No state store changes from this — `initialMessages` is a prop that seeds the REPL's local message state on first render.

---

## 9. Component Trees by Mode

### Mode 1: Interactive (Default)

The standard interactive REPL tree for a fresh session:

```
ink.createRoot(renderOptions)          // Ink instance; renderOptions has onFrame=FPS tracker
  └── Pf1 (AppStateRoot)
        ├── BDq (FpsMetricsWrapper, getFpsMetrics=O7)
        └── u_ (AppStateProvider, initialState=Gz, onChangeAppState=K11)
              └── [SyncStateToGlobal]
                    └── TUA (REPL)
                          ├── v6(s => s.toolPermissionContext) → B → tool filtering
                          ├── v6(s => s.mcp) → m → MCP commands/tools
                          ├── v6(s => s.plugins) → b → plugin commands
                          ├── v6(s => s.thinkingEnabled) → p → thinking UI
                          ├── v6(s => s.queuedCommands) → r → queue indicator
                          ├── [MessageList component]
                          │     ├── v6(s => s.tasks) → D1 → task spinners
                          │     └── v6(s => s.todos) → x → task list
                          ├── [InputBox component]
                          │     ├── commands = RA (merged, filtered)
                          │     └── v6(s => s.initialMessage) → l → pre-fill
                          ├── [PermissionDialog conditional]
                          │     ├── v6(s => s.pendingWorkerRequest) → q1
                          │     └── v6(s => s.pendingSandboxRequest) → t
                          └── [ElicitationDialog conditional]
                                └── v6(s => s.elicitation) → E1
```

### Mode 2: Setup Screens (Onboarding / Trust / Policy)

Before the REPL mounts, each dialog is rendered as a separate fullscreen component:

```
ink.createRoot(renderOptions)          // Same Ink instance (RA), reused
  └── u_ (AppStateProvider, onChangeAppState=K11 or undefined)
        └── dX (KeybindingSetup / ThemeProvider)
              └── [Onboarding | TrustDialog | PolicyUpdateDialog | ...]
                    └── onDone callback → resolves showSetupScreens() await
```

Key: The setup screens use the **same Ink instance** (RA) as the main REPL. There is only one `createRoot` call per Claude Code invocation. The setup screens render into it first, then the REPL renders into the same instance.

### Mode 3: Session Picker (--resume with no ID)

```
ink.createRoot(renderOptions)          // Same RA instance
  └── Pf1 (AppStateRoot)
        ├── BDq (FpsMetricsWrapper)
        └── u_ (AppStateProvider, initialState=Gz)
              └── dX (KeybindingSetup)
                    └── ResumeConversation (c1)
                          ├── worktreePaths - list of git worktrees
                          ├── initialSearchQuery - from --from-pr
                          ├── forkSession - from --fork-session flag
                          └── filterByPr - PR number filter
```

When the user selects a session, the `ResumeConversation` component exits, and the session-continue path renders `TUA` in the same Ink instance.

### Mode 4: Teleport Picker (--teleport with no ID)

```
ink.createRoot(renderOptions)          // RA instance
  └── u_ (AppStateProvider, onChangeAppState=undefined)
        └── dX (KeybindingSetup)
              └── f0q (TeleportPicker)
                    ├── onComplete: (selectedSession) → resolve LF promise
                    ├── onCancel: () => resolve(null)
                    └── source: "cliArg"
```

Note this uses `LF` (renderFullscreenComponent) not `$l1`, so it resolves when the user makes a selection or cancels. The selected session is then used to restore and render the REPL.

### Mode 5: Remote Session (--remote)

```
ink.createRoot(renderOptions)          // RA instance
  └── Pf1 (AppStateRoot)
        ├── BDq (FpsMetricsWrapper)
        └── u_ (AppStateProvider, initialState=K8)
              │  // K8 has remoteSessionUrl set in initialState
              └── TUA (REPL)
                    ├── commands = yOq(commands)  // remote-filtered commands
                    ├── initialTools = []         // EMPTY (no local MCP in remote)
                    ├── mcpClients = []           // EMPTY
                    ├── autoConnectIdeFlag = Z    // IDE still connected
                    ├── disableSlashCommands = r  // may be true
                    ├── remoteSessionConfig = fA  // WebSocket config
                    └── $O = pJ                  // remote connection handler
```

### Mode 6: Headless (--print / -p)

```
No React rendering at all.

oq = createStateStore(f8, K11)   // Same store API, same K11 callback
                                 // K11 still persists settings to disk
runHeadless(K6, async () => oq.getState(), oq.setState, TA, j6, xq, L6.activeAgents, {...})
  │
  └── Agent loop reads state via oq.getState()
      Agent loop writes state via oq.setState(updater)
      K11 fires on each setState for disk sync
      Output goes to process.stdout as text or JSON
```

The state store exists and functions identically. K11 persists settings changes. But there is no Ink, no React, no component tree, no `useSyncExternalStore` subscribers. The "UI" is lines of text to stdout.

---

## 10. Headless vs Interactive State

The fundamental design insight is that the state store (`createStateStore`) is **UI-agnostic**. The same store instance is used in both headless and interactive modes.

**What is shared between modes:**

- `createStateStore` (Gf6) — identical implementation
- `onChangeAppStateHandler` (K11) — fires in both modes, persists to disk in both
- State schema (AppState) — same fields, same initial values
- Settings loading — same logic reads `userSettings.json` in both modes

**What differs:**

| Aspect | Interactive | Headless |
|--------|-------------|----------|
| Store consumers | React components via `v6()` | Agent loop functions via `getState()` |
| State updates | `L7()` hook in components | Direct `setState()` calls in agent functions |
| Re-render trigger | `subscribe()` → `useSyncExternalStore` | Not applicable (no rendering) |
| UI output | Ink → ANSI terminal | `process.stdout.write()` → text/JSON |

**Why this design matters:**

Any logic that reads or writes app state works in both modes without modification. The agent loop, tool execution pipeline, and hook system all interact with the state store the same way regardless of whether React is mounted. This means:

1. Bug fixes in state management apply to both modes
2. Features that update state (todo persistence, MCP connection tracking) work in headless mode automatically
3. Testing the agent loop in headless mode produces the same state transitions as in interactive mode

---

## 11. FPS Tracking — rGz / _QA / BDq

The FPS tracking system is wired from the Ink render callback up to a React context, enabling components to query render performance.

### `createRenderOptions` (rGz) — Ink Configuration

```javascript
// ============================================
// createRenderOptions - Ink render config with FPS tracking and flicker detection
// Location: chunks.189.mjs:958-983
// ============================================

// ORIGINAL (for source lookup):
function rGz(A) {
    let q = 0, K = js(A);
    if (K.stdin) c("tengu_stdin_interactive", {});
    let Y = new _QA;
    return {
        getFpsMetrics: () => Y.getMetrics(),
        renderOptions: {
            ...K,
            onFrame: (z) => {
                if (Y.record(z.durationMs), Tv7()) return;
                for (let w of z.flickers) {
                    if (w.reason === "resize") continue;
                    let H = Date.now();
                    if (H - q < 1000) c("tengu_flicker", {
                        desiredHeight: w.desiredHeight,
                        actualHeight: w.availableHeight,
                        reason: w.reason
                    });
                    q = H
                }
            }
        }
    }
}

// READABLE (for understanding):
function createRenderOptions(cliOptions) {
    let lastFlickerTimestamp = 0;
    let inkOptions = resolveInkOptions(cliOptions);   // js()

    if (inkOptions.stdin) recordTelemetry("tengu_stdin_interactive", {});

    let fpsTracker = new FpsMetricsTracker();   // _QA

    return {
        // Exposed to AppStateRoot via prop; flows into FpsMetricsWrapper context
        getFpsMetrics: () => fpsTracker.getMetrics(),

        renderOptions: {
            ...inkOptions,
            onFrame: (frameInfo) => {
                // Always record frame duration (even in tmux mode)
                fpsTracker.record(frameInfo.durationMs);

                // tmux mode: flicker reporting is not meaningful, skip
                if (isTmuxMode()) return;   // Tv7()

                // Check each flicker in this frame
                for (let flicker of frameInfo.flickers) {
                    if (flicker.reason === "resize") continue;  // resize flickers are expected

                    let now = Date.now();
                    // Rate-limit: one flicker report per second maximum
                    if (now - lastFlickerTimestamp < 1000) {
                        recordTelemetry("tengu_flicker", {
                            desiredHeight: flicker.desiredHeight,
                            actualHeight: flicker.availableHeight,
                            reason: flicker.reason
                        });
                    }
                    lastFlickerTimestamp = now;
                }
            }
        }
    };
}

// Mapping: rGz→createRenderOptions, A→cliOptions, q→lastFlickerTimestamp,
//          K→inkOptions, js→resolveInkOptions, Y→fpsTracker, _QA→FpsMetricsTracker,
//          z→frameInfo, w→flicker, H→now, Tv7→isTmuxMode, c→recordTelemetry
```

**What `onFrame` receives:** Ink calls this callback after each render cycle. The `frameInfo` object contains:
- `durationMs` — how long the render took in milliseconds
- `flickers` — array of flicker events, each with `reason`, `desiredHeight`, `actualHeight`

**Flicker detection logic:**

Ink can only write as many rows as the terminal has available. If the component tree wants to render 100 rows but the terminal only has 60 rows, Ink clips to 60 rows. This "desired > actual" situation causes flickering when the user scrolls or new content is added. By tracking these events and sending telemetry, the team can identify when the REPL is too tall for typical terminal sizes.

The 1000ms rate limit prevents flooding telemetry when the terminal is being rapidly resized.

### `FpsMetricsWrapper` (BDq) — React Context Provider

```javascript
// From chunks.176.mjs:657
React.createElement(BDq, { getFpsMetrics: O7 }, stateProviderElement)
```

`BDq` wraps the `AppStateProvider` in `AppStateRoot`. It provides the `getFpsMetrics` function via React context, so any component deep in the tree can query the current FPS without prop-drilling.

### Data Flow: CLI → Ink → React

```
createRenderOptions(cliOptions)
  │  returns: { getFpsMetrics, renderOptions: { onFrame } }
  │
  ▼
ink.createRoot(renderOptions)   // renderOptions.onFrame is registered with Ink
  │
  ▼
[Each render frame]
  Ink calls: renderOptions.onFrame({ durationMs, flickers })
    fpsTracker.record(durationMs)    // Updates rolling average
    if (flicker) → telemetry         // Reports to analytics
  │
  ▼
Pf1(AppStateRoot) receives: getFpsMetrics = () => fpsTracker.getMetrics()
  │
  ▼
BDq(FpsMetricsWrapper) receives: getFpsMetrics prop
  Provides it via FpsMetricsContext
  │
  ▼
Any component: useFpsMetrics() → calls getFpsMetrics() → { fps, frameDuration }
```

---

## 12. Tool and Command Pipeline

### How Tools Flow from MCP → Permission Filter → REPL Render

Tools have two sources and go through a permission filter before the REPL sees them.

**Source 1: `initialTools` prop (MCP tools at startup)**

```javascript
// Action handler (chunks.189.mjs):
let Oq = $Y;   // $Y = MCP tools loaded before REPL mounts
// Passed as prop:
REPL.initialTools = Oq;   // or []  in remote mode
```

These are the tools from MCP servers that were connected before the REPL mounted. They are passed as a prop because they are available before any React state is initialized.

**Source 2: `mcp.tools` from state (MCP tools connected during session)**

```javascript
// v6() selector in REPL:
let m = v6((s) => s.mcp);   // m.tools = tools from MCP servers connected during session
```

When a new MCP server connects during the session (e.g., via `/mcp add`), its tools are added to `mcp.tools` in the state store.

**Merging step in REPL:**

```javascript
// From chunks.188.mjs — inside TUA:

// [1] Permission-filtered tools from toolPermissionContext
let x1 = useMemo(() => tD(B), [B, G1]);
//  tD = loadTools function: filters tools based on permission mode
//  B = toolPermissionContext (from v6)
//  G1 = isProactiveActive state (proactive mode adds extra tools)

// [2] Merge: permission-filtered tools + initialTools (from prop K)
let G6 = useMemo(() => [...x1, ...K], [x1, K]);
//  x1 = permission-filtered built-in + MCP tools from state
//  K = initialTools prop (MCP tools from startup)

// Final: G6 is passed to the query builder as the active tool set
```

**Why separate `initialTools` prop from `mcp.tools` state?**

`initialTools` are the tools loaded synchronously before React mounts. They cannot be in state because state does not exist yet. Once the REPL is mounted, new MCP connections add their tools to `mcp.tools` in state. The `useMemo` merge keeps both sources in sync.

### How Commands Flow from Sources → Filter → Input UI

```javascript
// From chunks.188.mjs — inside TUA:

let [_1, $1] = useState(A);  // _1 = commands from prop (initial slash command registry)
PVq(ZO(), $1);  // Subscribe to plugin command changes; updates _1 when plugins reload

// [1] Merge built-in commands + plugin commands
let E7 = sgA(_1, b.commands);
//  sgA = mergeCommandArrays (deduplicates by name)
//  _1 = base commands (from prop)
//  b.commands = plugin-contributed commands (from v6 mcp.plugins selector)

// [2] Merge with MCP commands
let V4 = sgA(E7, m.commands);
//  m.commands = commands contributed by MCP servers (from v6 mcp selector)

// [3] Apply disableSlashCommands gate
let RA = useMemo(() => f ? [] : V4, [f, V4]);
//  f = disableSlashCommands prop
//  If true: empty array (no commands)
//  If false: full merged V4 array
```

**Command sources in priority order:**
1. Built-in commands (hardcoded in CommandRegistry)
2. Skill commands (from loaded skills via `getSlashCommandSkills`)
3. Plugin commands (from `b.commands` state slice, updated when plugins reload)
4. MCP commands (from `m.commands` state slice, updated when MCP servers connect)

**Why plugin commands come from state, not props:**

Plugins can be installed, uninstalled, and hot-reloaded during a session. When a plugin changes, the REPL needs to update its command registry without remounting. State-driven commands (via `v6`) make this reactive: when `b.commands` changes, the `E7 → V4 → RA` chain recomputes automatically.

**The `PVq(ZO(), $1)` subscription:** This subscribes the REPL's local `commands` state to plugin command changes. `ZO()` returns the plugin command change event emitter. When plugins are reloaded (e.g., after `needsRefresh` becomes true), `$1` is called with the new command array, updating `_1` and triggering the merge chain.

**Remote mode command filtering:**

```javascript
// In the remote session path (chunks.189.mjs:1813):
commands = yOq(commands);   // yOq = filterEssentialCommands
```

`yOq` (filterEssentialCommands) removes commands that are not safe or meaningful in remote session context. This happens before the commands prop is passed to the REPL, so `RA` in the REPL never sees the filtered-out commands.

---

## Summary: The Complete Wiring Path

```
User types: claude --verbose --model claude-opus-4-5 --mcp-config ./mcp.json

  cliEntry (qZz)
    │ lazy-loads main module
    ▼
  mainEntry (nGz)
    │ detects clientType = "cli"
    │ isNonInteractive = false → Ink rendering mode
    ▼
  commanderSetup (aGz)
    │ parses: verbose=true, model="claude-opus-4-5", mcpConfig=["./mcp.json"]
    │ builds: initialState = { verbose: true, mainLoopModel: "claude-opus-4-5", ... }
    │ loads: initialTools = [MCP tools from ./mcp.json]
    │ builds: commands = [builtins + skills]
    ▼
  showSetupScreens (gRq)  [if needed]
    │ renders: Onboarding, TrustDialog, PolicyDialog sequentially via LF()
    ▼
  createRenderOptions (rGz)
    │ creates: fpsTracker, Ink renderOptions with onFrame
    ▼
  ink.createRoot(renderOptions) → RA (Ink instance)
    ▼
  renderAndWait($l1):
    ink.render(
      React.createElement(Pf1/AppStateRoot, { getFpsMetrics, initialState },
        React.createElement(vK/REPL, { verbose: true, commands, initialTools, ... })
      )
    )
    ▼
  AppStateProvider (u_)
    │ createStateStore(initialState, K11) → store
    │ provides store via React context
    ▼
  REPL (TUA) mounts:
    │ v6(s => s.verbose) → true → debug overlay rendered
    │ v6(s => s.mcp) → { tools: [], commands: [] } → merges with initialTools
    │ tD(toolPermissionContext) → builds available tools list
    │ G6 = [...filteredTools, ...initialTools] → tool set for LLM
    ▼
  User types: /model claude-opus-4-6
    │
    ├─→ REPL: setState(s => ({ ...s, mainLoopModel: "claude-opus-4-6" }))
    ├─→ K11 fires: updateUserSettings({ model: "claude-opus-4-6" }) [disk write]
    ├─→ K11 fires: setGlobalModel("claude-opus-4-6") [singleton update]
    └─→ v6(s => s.mainLoopModel) subscribers: model picker UI re-renders
```

The entire system is a **unidirectional data flow**: CLI flags → initial state → store → React selectors → rendered UI. State changes flow back through the same path: UI action → `setState` → K11 (disk sync) → subscriber notifications → React re-render.
