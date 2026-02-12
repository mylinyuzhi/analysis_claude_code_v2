# State Management Analysis

The application uses a custom React-based state management system centered around an `AppStateProvider` and custom hooks. The core logic is implemented in `chunks.151.mjs`.

## Store Implementation

The store is created using a closure-based pattern (`Gf6` function) that holds the state object and a set of listeners.

### `createStore` (`Gf6`)
- **Location:** `chunks.151.mjs:385680`
- **Functionality:**
  - Maintains `K` (current state) and `Y` (listeners).
  - Returns an object with `getState`, `setState`, and `subscribe`.
  - `setState` accepts a reducer function, updates the state, notifies the `onChangeAppState` callback (if provided), and invokes all subscribers.

### `initialAppState` (`gG1`)
- **Location:** `chunks.151.mjs:385700`
- **Functionality:**
  - Returns the default state object.
  - Initializes settings, tasks, verbose mode, permissions, agent definitions, file history, MCP state, plugin state, notifications, and more.
  - Determines the default `toolPermissionContext.mode` (e.g., "plan" or "default").

### State Object Structure
The state object contains a comprehensive set of properties:
- `settings`: User configuration.
- `tasks`: Active background tasks.
- `verbose`: Verbosity flag.
- `toolPermissionContext`: Security/permission settings.
- `agentDefinitions`: Available and active agents.
- `fileHistory`: Tracked files and snapshots.
- `mcp`: MCP clients, tools, and resources.
- `plugins`: Plugin status.
- `notifications`: UI notifications.
- `thinkingEnabled`: Flag for thinking mode.
- `promptSuggestion`: State for prompt suggestions.
- `gitDiff` & `prStatus`: Git integration state.

## Providers and Hooks

### `AppStateProvider` (`u_`)
- **Location:** `chunks.151.mjs:385803`
- **Functionality:**
  - Wraps the application in `T6q.Provider` and `RhA.Provider`.
  - Initializes the store using `Gf6`.
  - Manages side effects like disabling bypass permissions mode on mount.

### Hooks
- **`useAppState` (`v6`)**:
  - Location: `chunks.151.mjs:385857`
  - Uses `useSyncExternalStore` to subscribe to store updates.
  - Accepts a selector function to return specific parts of the state.
- **`useSetAppState` (`L7`)**:
  - Location: `chunks.151.mjs:385872`
  - Returns the `setState` function of the store.
- **`useAppStateContext` (`yhA`)**:
  - Internal hook to access the store context.

## State Updates

State updates are performed via `setState`, which uses a functional update pattern (receiving the previous state and returning the new state). This ensures atomic updates and avoids race conditions.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution

Key functions identified:
- `Gf6`: `createStore`
- `gG1`: `initialAppState`
- `u_`: `AppStateProvider`
- `v6`: `useAppState`
- `L7`: `useSetAppState`
