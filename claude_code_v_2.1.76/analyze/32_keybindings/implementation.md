# Keybindings Implementation

## Overview

Claude Code v2.1.76 provides a customizable keybinding system that supports multi-key "chords", hot-reloading from a configuration file, and context-sensitive actions. Users can define their own shortcuts in `~/.claude/keybindings.json` to override or extend the default CLI behavior.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

Key functions in this document:
- `KeybindingSetup` (aj) - React component providing keybinding context
- `KeybindingHandler` (N4Y) - Core event handler component
- `loadKeybindingsAsync` (tu9) - Async file loader with validation
- `loadKeybindingsSync` ($p6) - Sync loader with caching
- `getCachedBindings` (m34) - Returns cached or loads bindings
- `watchKeybindingsFile` (B34) - Chokidar-based file watcher
- `resolveKeystroke` (Z$1) - Main matching orchestrator
- `CHORD_TIMEOUT_MS` (G4Y) - 1000ms chord timeout constant

---

## Key Components

### 1. Keybinding Configuration

- **File**: `~/.claude/keybindings.json`
- **Loading**: `loadKeybindingsSync` ($p6) reads the file, parses the JSON schema, and merges with defaults. `loadKeybindingsAsync` (tu9) is the async variant used at startup.
- **Hot-Reloading**: `watchKeybindingsFile` (B34) uses `chokidar` to monitor the configuration file and re-initialize the system without restarting the CLI.

### 2. Event Handling

- **KeybindingSetup** (aj): A React component that wraps the UI, providing the keybinding context and managing the "chord" state. Owns the `pendingChord` state and `timerRef`.
- **KeybindingHandler** (N4Y): The core logic that receives raw keyboard events from Ink's `useInput` hook and matches them against the registered bindings.

### 3. Chord Management

The system supports multi-step sequences like `Ctrl+K, Ctrl+C`.
- **Timeout**: Hardcoded to 1000ms (`G4Y`). If the second key isn't pressed within 1 second, the chord is cancelled.
- **State**: Tracked via `pendingChord` React state and `pendingChordRef` ref (for sync access within event handlers).

---

## Key Decisions and Algorithms

### Key Matching with Chords

**What it does:** Matches incoming keystrokes against registered bindings, handling both single-key and multi-key chord sequences.

**How it works:**
1. When a key is pressed, the handler calls `resolveKeystroke` (Z$1).
2. It checks the current "active contexts" (e.g., "Global", "Chat").
3. If no chord is pending:
   - It normalizes the event to a keystroke object.
   - It checks if the keystroke starts a chord sequence (prefix match). If yes, it sets the pending chord state and starts a 1000ms timer.
   - It checks if the keystroke is a complete single-key shortcut (exact match).
4. If a chord is pending:
   - It checks if the new keystroke completes the sequence (exact match with accumulated sequence).
   - If not, it cancels the chord and returns `chord_cancelled`.
5. Escape always cancels any in-progress chord.

**Why this approach:** The VS Code-style chord system allows a vast expansion of available keyboard real estate without relying on complex modifier combinations like `Ctrl+Alt+Shift+...`. Two-key chords with a common prefix (e.g., `ctrl+k ctrl+c`, `ctrl+k ctrl+s`) share the first keystroke, making them intuitive to group conceptually.

**Key insight:** The `pendingChordRef` pattern (ref + state) is critical: the ref provides synchronous access during the event handler (no stale closure), while the React state drives UI updates like the chord indicator display.

### Code Snippet: KeybindingSetup

```javascript
// ============================================
// aj - KeybindingSetup component (React context provider)
// Location: chunks.117.mjs:1879-1934
// ============================================

// ORIGINAL (for source lookup):
function aj({
    children: A
}) {
    let [{
        bindings: q,
        warnings: K
    }, Y] = wM.useState(() => {
        let W = $p6();
        return k(`[keybindings] KeybindingSetup initialized with ${W.bindings.length} bindings, ${W.warnings.length} warnings`), W
    }), [z, _] = wM.useState(!1);
    f4Y(K, z);
    let w = wM.useRef(null),
        [O, $] = wM.useState(null),
        H = wM.useRef(null),
        j = wM.useRef(new Map),
        J = wM.useRef(new Set),
        M = wM.useCallback((W) => {
            J.current.add(W)
        }, []),
        D = wM.useCallback((W) => {
            J.current.delete(W)
        }, []),
        X = wM.useCallback(() => {
            if (H.current) clearTimeout(H.current), H.current = null
        }, []),
        P = wM.useCallback((W) => {
            if (X(), W !== null) H.current = setTimeout((Z, G) => {
                k("[keybindings] Chord timeout - cancelling"), Z.current = null, G(null)
            }, G4Y, w, $);
            w.current = W, $(W)
        }, [X]);
    return wM.useEffect(() => {
        B34();
        let W = g34((Z) => {
            _(!0), Y(Z), k(`[keybindings] Reloaded: ${Z.bindings.length} bindings, ${Z.warnings.length} warnings`)
        });
        return () => {
            W(), X()
        }
    }, [X]), wM.default.createElement(G$1, {
        bindings: q,
        pendingChordRef: w,
        pendingChord: O,
        setPendingChord: P,
        activeContexts: J.current,
        registerActiveContext: M,
        unregisterActiveContext: D,
        handlerRegistryRef: j
    }, wM.default.createElement(N4Y, {
        bindings: q,
        pendingChordRef: w,
        setPendingChord: P,
        activeContexts: J.current,
        handlerRegistryRef: j
    }), A)
}

// READABLE (for understanding):
function KeybindingSetup({ children }) {
    // Initialize state with loaded bindings
    let [configState, setConfigState] = React.useState(() => {
        let initial = loadKeybindingsSync();
        debug(`[keybindings] KeybindingSetup initialized with ${initial.bindings.length} bindings, ${initial.warnings.length} warnings`);
        return initial;
    });

    let [hasReloaded, setHasReloaded] = React.useState(false);

    // Show warnings to user
    useWarningsNotification(configState.warnings, hasReloaded);

    // Chord state: ref for sync access, state for UI
    let pendingChordRef = React.useRef(null);
    let [pendingChordState, setPendingChordState] = React.useState(null);
    let timerRef = React.useRef(null);

    // Handler registry: Map<action, Set<{context, handler}>>
    let handlerRegistryRef = React.useRef(new Map());

    // Active contexts Set
    let activeContextsRef = React.useRef(new Set());

    // Context registration callbacks
    let registerActiveContext = React.useCallback((contextName) => {
        activeContextsRef.current.add(contextName);
    }, []);

    let unregisterActiveContext = React.useCallback((contextName) => {
        activeContextsRef.current.delete(contextName);
    }, []);

    // Timer cleanup
    let clearChordTimer = React.useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Set pending chord with timeout
    let setPendingChord = React.useCallback((newChord) => {
        clearChordTimer();
        if (newChord !== null) {
            timerRef.current = setTimeout(() => {
                debug("[keybindings] Chord timeout - cancelling");
                pendingChordRef.current = null;
                setPendingChordState(null);
            }, CHORD_TIMEOUT_MS); // 1000ms
        }
        pendingChordRef.current = newChord;
        setPendingChordState(newChord);
    }, [clearChordTimer]);

    // Hot-reload subscription
    React.useEffect(() => {
        watchKeybindingsFile();
        let unsubscribe = subscribeToKeybindingsChanges((newConfig) => {
            setHasReloaded(true);
            setConfigState(newConfig);
            debug(`[keybindings] Reloaded: ${newConfig.bindings.length} bindings, ${newConfig.warnings.length} warnings`);
        });
        return () => {
            unsubscribe();
            clearChordTimer();
        };
    }, [clearChordTimer]);

    // Provide context to children
    return React.createElement(KeybindingContext, {
        bindings: configState.bindings,
        pendingChordRef: pendingChordRef,
        pendingChord: pendingChordState,
        setPendingChord: setPendingChord,
        activeContexts: activeContextsRef.current,
        registerActiveContext: registerActiveContext,
        unregisterActiveContext: unregisterActiveContext,
        handlerRegistryRef: handlerRegistryRef
    },
    React.createElement(KeybindingHandler, {
        bindings: configState.bindings,
        pendingChordRef: pendingChordRef,
        setPendingChord: setPendingChord,
        activeContexts: activeContextsRef.current,
        handlerRegistryRef: handlerRegistryRef
    }),
    children);
}

// Mapping: aj→KeybindingSetup, A→children, q→bindings, K→warnings, Y→setConfigState, z→hasReloaded, w→pendingChordRef, O→pendingChordState, $→setPendingChordState, H→timerRef, j→handlerRegistryRef, J→activeContextsRef, M→registerActiveContext, D→unregisterActiveContext, X→clearChordTimer, P→setPendingChord, G4Y→CHORD_TIMEOUT_MS (1000), B34→watchKeybindingsFile, g34→subscribeToKeybindingsChanges, f4Y→useWarningsNotification, $p6→loadKeybindingsSync, G$1→KeybindingContext, N4Y→KeybindingHandler, wM→React
```

**Key initialization sequence:**
1. **Sync load on mount**: `loadKeybindingsSync()` returns cached or loads fresh
2. **Context registration**: `registerActiveContext` and `unregisterActiveContext` callbacks created
3. **Chord state setup**: `pendingChordRef` + `pendingChordState` for dual access pattern
4. **Hot-reload subscription**: `subscribeToKeybindingsChanges` updates state on file change
5. **Context provider**: Wraps children with `KeybindingContext` providing all state/accessors

### Code Snippet: KeybindingHandler

```javascript
// ============================================
// N4Y - Core event dispatcher for keybindings
// Location: chunks.117.mjs:1936-1989
// ============================================

// ORIGINAL (for source lookup):
function N4Y(A) {
    let q = A6(6),
        {
            bindings: K,
            pendingChordRef: Y,
            setPendingChord: z,
            activeContexts: _,
            handlerRegistryRef: w
        } = A,
        O;
    if (q[0] !== _ || q[1] !== K || q[2] !== w || q[3] !== Y || q[4] !== z) O = (H, j, J) => {
        let M = w.current,
            D = new Set;
        if (M)
            for (let Z of M.values())
                for (let G of Z) D.add(G.context);
        let X = [...D, ..._, "Global"],
            P = Y.current !== null,
            W = Z$1(H, j, X, K, Y.current);
        A: switch (W.type) {
            case "chord_started": {
                z(W.pending), J.stopImmediatePropagation();
                break A
            }
            case "match": {
                if (z(null), P) {
                    let Z = new Set(X);
                    if (M) {
                        let G = M.get(W.action);
                        if (G && G.size > 0) {
                            for (let f of G)
                                if (Z.has(f.context)) {
                                    f.handler(), J.stopImmediatePropagation();
                                    break
                                }
                        }
                    }
                }
                break A
            }
            case "chord_cancelled": {
                z(null);
                break A
            }
            case "unbound": {
                z(null);
                break A
            }
            case "none":
        }
    }, q[0] = _, q[1] = K, q[2] = w, q[3] = Y, q[4] = z, q[5] = O;
    else O = q[5];
    return jA(O), null
}

// READABLE (for understanding):
function KeybindingHandler(props) {
    let memoSlot = useMemoSlot(6);
    let {
        bindings,
        pendingChordRef,
        setPendingChord,
        activeContexts,
        handlerRegistryRef
    } = props;

    let inputHandler;
    if (memoSlot[0] !== activeContexts ||
        memoSlot[1] !== bindings ||
        memoSlot[2] !== handlerRegistryRef ||
        memoSlot[3] !== pendingChordRef ||
        memoSlot[4] !== setPendingChord) {

        inputHandler = (inputString, keyEvent, domEvent) => {
            let registry = handlerRegistryRef.current;
            let contextSet = new Set();

            // Collect contexts from registered handlers
            if (registry) {
                for (let handlers of registry.values()) {
                    for (let handler of handlers) {
                        contextSet.add(handler.context);
                    }
                }
            }

            let allContexts = [...contextSet, ...activeContexts, "Global"];
            let isPendingChord = pendingChordRef.current !== null;

            // Resolve keystroke using main matching orchestrator
            let matchResult = resolveKeystroke(inputString, keyEvent, allContexts, bindings, pendingChordRef.current);

            switch (matchResult.type) {
                case "chord_started": {
                    setPendingChord(matchResult.pending);
                    domEvent.stopImmediatePropagation();
                    break;
                }
                case "match": {
                    setPendingChord(null);
                    if (isPendingChord) {
                        let contextSetForDispatch = new Set(allContexts);
                        if (registry) {
                            let handlers = registry.get(matchResult.action);
                            if (handlers && handlers.size > 0) {
                                // First-match-wins: execute first handler whose context is active
                                for (let handler of handlers) {
                                    if (contextSetForDispatch.has(handler.context)) {
                                        handler.handler(); // Fire-and-forget
                                        domEvent.stopImmediatePropagation();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    break;
                }
                case "chord_cancelled": {
                    setPendingChord(null);
                    break;
                }
                case "unbound": {
                    setPendingChord(null);
                    break;
                }
                case "none":
                    break;
            }
        };

        memoSlot[0] = activeContexts;
        memoSlot[1] = bindings;
        memoSlot[2] = handlerRegistryRef;
        memoSlot[3] = pendingChordRef;
        memoSlot[4] = setPendingChord;
        memoSlot[5] = inputHandler;
    } else {
        inputHandler = memoSlot[5];
    }

    useInput(inputHandler); // Register with Ink
    return null;
}

// Mapping: N4Y→KeybindingHandler, A→props, A6→useMemoSlot, K→bindings, Y→pendingChordRef, z→setPendingChord, _→activeContexts, w→handlerRegistryRef, O→inputHandler, H→inputString, j→keyEvent, J→domEvent, M→registry, D→contextSet, X→allContexts, P→isPendingChord, W→matchResult, Z$1→resolveKeystroke, jA→useInput
```

### Hot-Reloading for Improved UX

**Why this approach:** CLI users often want to tweak their shortcuts while working. By using a file watcher, Claude Code allows users to edit `keybindings.json` and see the changes reflected immediately in the active terminal session.

**How it works:**
1. `watchKeybindingsFile` (B34) starts a chokidar watcher on `~/.claude/keybindings.json`.
2. Write stabilization (`awaitWriteFinish: {stabilityThreshold: 500ms, pollInterval: 200ms}`) prevents reload flicker during multi-write editor saves.
3. On file change, `handleKeybindingsFileChange` (I34) calls `loadKeybindingsAsync` (tu9), updates the cached bindings, and notifies all subscribers.
4. React state update triggers re-render of `KeybindingSetup`, propagating new bindings to all child components via context.

**Edge case — chord in progress during hot-reload:** If the user is mid-chord when `keybindings.json` is saved, the pending chord state is preserved. However, if the second keystroke no longer matches any binding in the new config (because the chord was removed), the keystroke returns `chord_cancelled` and the chord is aborted cleanly.

### Code Snippet: KeybindingContext

```javascript
// ============================================
// G$1 - KeybindingContext provider component
// Location: chunks.65.mjs:799-870
// ============================================

// ORIGINAL (for source lookup):
function G$1(A) {
    let q = A6(27),
        {
            bindings: K,
            pendingChordRef: Y,
            pendingChord: z,
            setPendingChord: _,
            activeContexts: w,
            registerActiveContext: O,
            unregisterActiveContext: $,
            handlerRegistryRef: H,
            children: j
        } = A,
        J;
    if (q[0] !== K) J = (V, L) => P$1(V, L, K), q[0] = K, q[1] = J;
    else J = q[1];
    let M = J,
        D;
    if (q[2] !== H) D = (V) => {
        let L = H.current;
        if (!L) return Ml3;
        if (!L.has(V.action)) L.set(V.action, new Set);
        return L.get(V.action).add(V), () => {
            let h = L.get(V.action);
            if (h) {
                if (h.delete(V), h.size === 0) L.delete(V.action)
            }
        }
    }, q[2] = H, q[3] = D;
    else D = q[3];
    let X = D,
        P;
    if (q[4] !== w || q[5] !== H) P = (V) => {
        let L = H.current;
        if (!L) return !1;
        let h = L.get(V);
        if (!h || h.size === 0) return !1;
        for (let R of h)
            if (w.has(R.context)) return R.handler(), !0;
        return !1
    }, q[4] = w, q[5] = H, q[6] = P;
    else P = q[6];
    let W = P,
        Z;
    if (q[7] !== K || q[8] !== Y) Z = (V, L, h) => Z$1(V, L, h, K, Y.current), q[7] = K, q[8] = Y, q[9] = Z;
    else Z = q[9];
    let G;
    if (q[10] !== M) G = (V, L) => M(V, L), q[10] = M, q[11] = G;
    else G = q[11];
    let f;
    if (q[12] !== w || q[13] !== K || q[14] !== M || q[15] !== W || q[16] !== z || q[17] !== O || q[18] !== X || q[19] !== _ || q[20] !== Z || q[21] !== G || q[22] !== $) f = {
        resolve: Z,
        setPendingChord: _,
        getDisplayText: M,
        getPlatformDisplayText: G,
        bindings: K,
        pendingChord: z,
        activeContexts: w,
        registerActiveContext: O,
        unregisterActiveContext: $,
        registerHandler: X,
        invokeAction: W
    }, q[12] = w, q[13] = K, q[14] = M, q[15] = W, q[16] = z, q[17] = O, q[18] = X, q[19] = _, q[20] = Z, q[21] = G, q[22] = $, q[23] = f;
    else f = q[23];
    let v = f,
        N;
    if (q[24] !== j || q[25] !== v) N = pL7.default.createElement(QL7.Provider, {
        value: v
    }, j), q[24] = j, q[25] = v, q[26] = N;
    else N = q[26];
    return N
}

// READABLE (for understanding):
function KeybindingContext(props) {
    let memoSlot = useMemoSlot(27);
    let {
        bindings,
        pendingChordRef,
        pendingChord,
        setPendingChord,
        activeContexts,
        registerActiveContext,
        unregisterActiveContext,
        handlerRegistryRef,
        children
    } = props;

    // Memoize getDisplayText function
    let getDisplayText;
    if (memoSlot[0] !== bindings) {
        getDisplayText = (action, context) => findKeybindingForAction(action, context, bindings);
        memoSlot[0] = bindings;
        memoSlot[1] = getDisplayText;
    } else {
        getDisplayText = memoSlot[1];
    }

    // Memoize registerHandler function
    let registerHandler;
    if (memoSlot[2] !== handlerRegistryRef) {
        registerHandler = (handlerInfo) => {
            let registry = handlerRegistryRef.current;
            if (!registry) return noop;

            if (!registry.has(handlerInfo.action)) {
                registry.set(handlerInfo.action, new Set());
            }
            registry.get(handlerInfo.action).add(handlerInfo);

            return () => {
                let handlers = registry.get(handlerInfo.action);
                if (handlers) {
                    handlers.delete(handlerInfo);
                    if (handlers.size === 0) {
                        registry.delete(handlerInfo.action);
                    }
                }
            };
        };
        memoSlot[2] = handlerRegistryRef;
        memoSlot[3] = registerHandler;
    } else {
        registerHandler = memoSlot[3];
    }

    // Memoize invokeAction function
    let invokeAction;
    if (memoSlot[4] !== activeContexts || memoSlot[5] !== handlerRegistryRef) {
        invokeAction = (actionName) => {
            let registry = handlerRegistryRef.current;
            if (!registry) return false;

            let handlers = registry.get(actionName);
            if (!handlers || handlers.size === 0) return false;

            for (let handler of handlers) {
                if (activeContexts.has(handler.context)) {
                    handler.handler();
                    return true;
                }
            }
            return false;
        };
        memoSlot[4] = activeContexts;
        memoSlot[5] = handlerRegistryRef;
        memoSlot[6] = invokeAction;
    } else {
        invokeAction = memoSlot[6];
    }

    // Memoize resolve function
    let resolve;
    if (memoSlot[7] !== bindings || memoSlot[8] !== pendingChordRef) {
        resolve = (inputStr, keyEvent, contextList) => {
            return resolveKeystroke(inputStr, keyEvent, contextList, bindings, pendingChordRef.current);
        };
        memoSlot[7] = bindings;
        memoSlot[8] = pendingChordRef;
        memoSlot[9] = resolve;
    } else {
        resolve = memoSlot[9];
    }

    // Build context value object
    let contextValue = {
        resolve: resolve,
        setPendingChord: setPendingChord,
        getDisplayText: getDisplayText,
        getPlatformDisplayText: getPlatformDisplayText,
        bindings: bindings,
        pendingChord: pendingChord,
        activeContexts: activeContexts,
        registerActiveContext: registerActiveContext,
        unregisterActiveContext: unregisterActiveContext,
        registerHandler: registerHandler,
        invokeAction: invokeAction
    };

    // Return React Context Provider
    return React.createElement(KeybindingContextObject.Provider, {
        value: contextValue
    }, children);
}

// Mapping: G$1→KeybindingContext, A→props, K→bindings, Y→pendingChordRef, z→pendingChord, _→setPendingChord, w→activeContexts, O→registerActiveContext, $→unregisterActiveContext, H→handlerRegistryRef, j→children, J→getDisplayText, M→getDisplayText, D→registerHandler, X→registerHandler, P→invokeAction, W→invokeAction, Z→resolve, QL7→KeybindingContextObject, Ml3→noop, P$1→findKeybindingForAction, Z$1→resolveKeystroke
```

**Context API provided:**

| Property | Type | Purpose |
|----------|------|---------|
| `resolve` | `(input, key, contexts) => MatchResult` | Resolve keystroke against bindings |
| `setPendingChord` | `(chord: Keystroke[] \| null) => void` | Update pending chord state |
| `getDisplayText` | `(action, context) => string` | Format action binding for display |
| `getPlatformDisplayText` | `(action, context) => string` | Platform-specific format |
| `bindings` | `Binding[]` | Current keybinding configuration |
| `pendingChord` | `Keystroke[] \| null` | Current pending chord sequence |
| `activeContexts` | `Set<string>` | Set of active context names |
| `registerActiveContext` | `(context: string) => void` | Mark context as active |
| `unregisterActiveContext` | `(context: string) => void` | Mark context as inactive |
| `registerHandler` | `(handler: HandlerInfo) => () => void` | Register action handler |
| `invokeAction` | `(action: string) => boolean` | Execute action manually |

---

## Configuration Format

```json
{
    "bindings": [
        {
            "context": "Chat",
            "bindings": {
                "ctrl+k ctrl+c": "clear_history",
                "ctrl+g": "chat:externalEditor",
                "meta+p": "chat:modelPicker",
                "/my-command": "command:my-command"
            }
        },
        {
            "context": "Global",
            "bindings": {
                "ctrl+l": null
            }
        }
    ]
}
```

**Key format rules:**
- Modifiers: `ctrl`, `alt`, `meta` (or `cmd`), `shift`
- Multi-key chords: separated by spaces (`ctrl+k ctrl+c`)
- Null action: explicitly unbinds a shortcut
- `command:` prefix: triggers a slash command from the Chat context

---

## Data Flow

```
~/.claude/keybindings.json
         |
         v
loadKeybindingsAsync (tu9)
  → validate & merge with defaults
  → return { bindings, warnings }
         |
         v
KeybindingSetup (aj)
  → holds bindings state
  → provides KeybindingContext (G$1)
  → renders KeybindingHandler (N4Y)
         |
         v
Terminal keystroke (via Ink useInput)
         |
         v
KeybindingHandler (N4Y)
  → resolveKeystroke (Z$1)
    → isPrefixMatch (jl3) / isExactMatch (Jl3)
    → returns MatchResult
  → lookup handler in registry
  → execute handler (fire-and-forget)
```

---

## Key Takeaways

1. **Chord state machine**: Two-phase matching (prefix → exact) with 1000ms timeout and escape cancellation
2. **Context filtering**: 18 named contexts filter which bindings are eligible per UI state
3. **First-match-wins dispatch**: Set iteration order determines priority when multiple handlers match
4. **Hot-reload via chokidar**: File changes reload bindings without process restart
5. **Graceful degradation**: Broken config falls back to defaults, preserving usability
6. **Fire-and-forget handlers**: `() => void` signature, no async awaiting in dispatch

**Last Updated**: 2026-03-23 (Claude Code v2.1.76)
