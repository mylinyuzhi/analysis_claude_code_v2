# Keybindings UI Interaction

## Overview

This document analyzes how the keybinding system integrates with the user interface, including chord indicators, focus state feedback, help modal integration, and visual hints.

**Version**: Claude Code v2.1.76

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

Key functions in this document:
- `a1` (chunks.65.mjs:1155) - ShortcutDisplay component
- `O8` (chunks.65.mjs:1215) - KeybindingHint component
- `C8` (chunks.65.mjs:1246) - KeybindingHintsList component
- `Rq` (chunks.65.mjs:1191-1205) - useKeybindingDisplayText hook
- `PX` (chunks.90.mjs:69-83) - useKeybindingDisplayTextSync with telemetry
- `D8` (chunks.65.mjs:905) - useKeybindingAction hook
- `aj` (chunks.117.mjs:1879) - KeybindingSetup component
- `N4Y` (chunks.117.mjs:1936) - KeybindingHandler component
- `A6` (chunks.65.mjs) - useMemoSlot hook for performance optimization
- `oJ` (chunks.90.mjs:107-118) - TranscriptToggleHint component

---

## 1. Chord Indicator Display

### Visual Feedback During Chord Input

When a user initiates a chord sequence (e.g., pressing `Ctrl+K` as the first part of `Ctrl+K Ctrl+C`), the system provides visual feedback:

**How it works:**

1. **Chord Started**: `resolveKeystroke` (Z$1) returns `{type: "chord_started", pending: [keystroke]}`
2. **State Update**: `setPendingChord(pending)` updates React state
3. **Timer Start**: 1000ms timeout (`G4Y`) begins
4. **UI Render**: Pending chord state triggers visual indicator

```javascript
// ============================================
// N4Y - KeybindingHandler with chord state management
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
    const { bindings, pendingChordRef, setPendingChord, activeContexts, handlerRegistryRef } = props;

    const inputHandler = (inputString, keyEvent, domEvent) => {
        const registry = handlerRegistryRef.current;

        // Collect contexts from registered handlers
        const contextSet = new Set();
        if (registry) {
            for (const handlers of registry.values()) {
                for (const handler of handlers) {
                    contextSet.add(handler.context);
                }
            }
        }

        const allContexts = [...contextSet, ...activeContexts, "Global"];
        const isPendingChord = pendingChordRef.current !== null;

        // Resolve keystroke using main matching orchestrator
        const matchResult = resolveKeystroke(inputString, keyEvent, allContexts, bindings, pendingChordRef.current);

        switch (matchResult.type) {
            case "chord_started":
                // Show visual indicator: "Ctrl+K-"
                setPendingChord(matchResult.pending);
                domEvent.stopImmediatePropagation();
                break;

            case "match":
                // Clear indicator, execute action
                setPendingChord(null);
                if (isPendingChord) {
                    const contextSetForDispatch = new Set(allContexts);
                    if (registry) {
                        const handlers = registry.get(matchResult.action);
                        if (handlers && handlers.size > 0) {
                            for (const handler of handlers) {
                                if (contextSetForDispatch.has(handler.context)) {
                                    handler.handler(); // Execute!
                                    domEvent.stopImmediatePropagation();
                                    break;
                                }
                            }
                        }
                    }
                }
                break;

            case "chord_cancelled":
            case "unbound":
                // Clear indicator (timeout or escape pressed)
                setPendingChord(null);
                break;

            case "none":
                // No match, do nothing
                break;
        }
    };

    useInput(inputHandler);
    return null;
}

// Mapping: N4Y→KeybindingHandler, K→bindings, Y→pendingChordRef, z→setPendingChord, _→activeContexts, w→handlerRegistryRef, Z$1→resolveKeystroke, jA→useInput
```

### Chord Indicator Rendering

The pending chord is typically rendered in the status bar or footer area:

```javascript
// ============================================
// Chord indicator display pattern
// Location: Inferred from context structure
// ============================================

// When pendingChord !== null:
// Display format: "Ctrl+K-" (with dash indicating awaiting input)
// Color: Dimmed or highlighted to indicate pending state

function renderChordIndicator(pendingChord) {
    if (!pendingChord || pendingChord.length === 0) return null;

    // Convert keystroke array to display string
    const chordText = pendingChord.map(keystroke => {
        return stringifyKeystroke(keystroke);  // wl3 function
    }).join(" ");

    // Render with dash suffix to indicate pending
    return (
        <Text dimColor>
            {chordText}-
        </Text>
    );
}
```

---

## 2. Focus State UI Feedback

### Context-Based Focus Indicators

Components register their context when focused, enabling context-aware keybinding filtering:

```javascript
// ============================================
// useRegisterContext - Hook for context registration
// Location: chunks.65.mjs:878-891
// ============================================

// ORIGINAL (for source lookup):
function f$1(A, q) {
    let K = A6(5),
        Y = q === void 0 ? !0 : q,
        z = Wv(),
        _, w;
    if (K[0] !== A || K[1] !== Y || K[2] !== z) _ = () => {
        if (!z || !Y) return;
        return z.registerActiveContext(A), () => {
            z.unregisterActiveContext(A)
        }
    }, w = [A, z, Y], K[0] = A, K[1] = Y, K[2] = z, K[3] = _, K[4] = w;
    else _ = K[3], w = K[4];
    uX6.useLayoutEffect(_, w)
}

// READABLE (for understanding):
function useRegisterContext(contextName, isActive = true) {
    const context = useKeybindingContext();

    useLayoutEffect(() => {
        if (!context || !isActive) return;

        // Register this component's context
        context.registerActiveContext(contextName);

        // Cleanup: unregister when component unmounts or loses focus
        return () => {
            context.unregisterActiveContext(contextName);
        };
    }, [contextName, context, isActive]);
}

// Mapping: f$1→useRegisterContext, A→contextName, q→isActive, z→context, Wv→useKeybindingContext
```

### Visual Focus Indicators

Components may provide visual feedback when they have focus:

- **Chat Input**: Border highlight or cursor visibility
- **Autocomplete Overlay**: Highlighted suggestion row
- **Confirmation Dialog**: Focused button state
- **Help Modal**: Scroll position indicator

---

## 3. Keybinding Hint Components

### ShortcutDisplay Component

Renders a keybinding shortcut with optional description:

```javascript
// ============================================
// a1 - ShortcutDisplay component
// Location: chunks.65.mjs:1155-1181
// ============================================

// ORIGINAL (for source lookup):
function a1(A) {
    let q = A6(9),
        {
            shortcut: K,
            action: Y,
            parens: z,
            bold: _
        } = A,
        w = z === void 0 ? !1 : z,
        O = _ === void 0 ? !1 : _,
        $;
    if (q[0] !== O || q[1] !== K) $ = O ? v$1.default.createElement(Kz, {
        bold: !0
    }, K) : K, q[0] = O, q[1] = K, q[2] = $;
    else $ = q[2];
    let H = $;
    if (w) {
        let J;
        if (q[3] !== Y || q[4] !== H) J = v$1.default.createElement(Kz, null, "(", H, " to ", Y, ")"), q[3] = Y, q[4] = H, q[5] = J;
        else J = q[5];
        return J
    }
    let j;
    if (q[6] !== Y || q[7] !== H) j = v$1.default.createElement(Kz, null, H, " to ", Y), q[6] = Y, q[7] = H, q[8] = j;
    else j = q[8];
    return j
}

// READABLE (for understanding):
function ShortcutDisplay(props) {
    const { shortcut, action, parens = false, bold = false } = props;

    // Render shortcut text (bold if specified)
    const shortcutText = bold
        ? <Text bold>{shortcut}</Text>
        : shortcut;

    // With parentheses: "(Ctrl+K to clear history)"
    // Without: "Ctrl+K to clear history"
    if (parens) {
        return (
            <Text>
                ({shortcutText} to {action})
            </Text>
        );
    }

    return (
        <Text>
            {shortcutText} to {action}
        </Text>
    );
}

// Mapping: a1→ShortcutDisplay, K→shortcut, Y→action, z→parens, _→bold
```

### KeybindingHint Component

Renders a keybinding with fallback display text:

```javascript
// ============================================
// O8 - KeybindingHint component
// Location: chunks.65.mjs:1215-1235
// ============================================

// ORIGINAL (for source lookup):
function O8(A) {
    let q = A6(5),
        {
            action: K,
            context: Y,
            fallback: z,
            description: _,
            parens: w,
            bold: O
        } = A,
        $ = Rq(K, Y, z),
        H;
    if (q[0] !== O || q[1] !== _ || q[2] !== w || q[3] !== $) H = Uj8.createElement(a1, {
        shortcut: $,
        action: _,
        parens: w,
        bold: O
    }), q[0] = O, q[1] = _, q[2] = w, q[3] = $, q[4] = H;
    else H = q[4];
    return H
}

// READABLE (for understanding):
function KeybindingHint(props) {
    const {
        action,          // Action name to look up
        context,         // Context to search in
        fallback,        // Fallback text if binding not found
        description,     // Human-readable action description
        parens = false,  // Wrap in parentheses
        bold = false     // Bold the shortcut
    } = props;

    // Get display text, with fallback for missing bindings
    const displayText = useKeybindingDisplayText(action, context, fallback);

    return (
        <ShortcutDisplay
            shortcut={displayText}
            action={description}
            parens={parens}
            bold={bold}
        />
    );
}

// Mapping: O8→KeybindingHint, K→action, Y→context, z→fallback, _→description, w→parens, O→bold
```

### KeybindingHintsList Component

Renders multiple keybinding hints with separators:

```javascript
// ============================================
// C8 - KeybindingHintsList component
// Location: chunks.65.mjs:1246-1269
// ============================================

// ORIGINAL (for source lookup):
function C8(A) {
    let q = A6(5),
        {
            children: K
        } = A,
        Y, z;
    if (q[0] !== K) {
        z = Symbol.for("react.early_return_sentinel");
        A: {
            let w = hm.Children.toArray(K);
            if (w.length === 0) {
                z = null;
                break A
            }
            Y = w.map(Dl3)
        }
        q[0] = K, q[1] = Y, q[2] = z
    } else Y = q[1], z = q[2];
    if (z !== Symbol.for("react.early_return_sentinel")) return z;
    let _;
    if (q[3] !== Y) _ = hm.default.createElement(hm.default.Fragment, null, Y), q[3] = Y, q[4] = _;
    else _ = q[4];
    return _
}

// Dl3 - Helper to render individual hint with separator
function Dl3(A, q) {
    return hm.default.createElement(hm.default.Fragment, {
        key: hm.isValidElement(A) ? A.key ?? q : q
    }, q > 0 && hm.default.createElement(T, {
        dimColor: !0
    }, " · "), A)
}

// READABLE (for understanding):
function KeybindingHintsList({ children }) {
    const hintsArray = Children.toArray(children);

    // Empty array = nothing to render
    if (hintsArray.length === 0) return null;

    // Render each hint with " · " separator between them
    return (
        <>
            {hintsArray.map((hint, index) => (
                <Fragment key={hint.key ?? index}>
                    {index > 0 && <Text dimColor> · </Text>}
                    {hint}
                </Fragment>
            ))}
        </>
    );
}

// Example output: "Ctrl+K to clear · Ctrl+C to cancel · Esc to exit"

// Mapping: C8→KeybindingHintsList, K→children, Dl3→renderHintWithSeparator
```

---

## 4. Help Modal Integration

### Keybinding Display in Help

The help modal shows available keybindings for the current context:

```javascript
// ============================================
// Help modal keybinding display pattern
// Location: Inferred from context structure
// ============================================

function HelpModalContent() {
    const { bindings, activeContexts } = useKeybindingContext();

    // Filter bindings for active contexts
    const relevantBindings = bindings.filter(binding =>
        activeContexts.includes(binding.context)
    );

    // Group by context
    const groupedBindings = groupBy(relevantBindings, 'context');

    return (
        <Box flexDirection="column">
            {Object.entries(groupedBindings).map(([context, bindings]) => (
                <Box key={context} flexDirection="column">
                    <Text bold>{context} Context</Text>
                    {bindings.map(binding => (
                        <Text key={binding.action}>
                            {stringifyChord(binding.chord)} → {binding.action}
                        </Text>
                    ))}
                </Box>
            ))}
        </Box>
    );
}
```

### Dynamic Updates on Config Change

When `keybindings.json` is modified, the help modal updates automatically:

1. File watcher (`B34`) detects change
2. Reload handler (`I34`) calls `loadKeybindingsAsync`
3. Context value updates with new bindings
4. React re-renders help modal with updated shortcuts

---

## 5. UI Feedback Patterns

### Input Guide Footer

Many modals show a footer with available actions:

```javascript
// Example from chunks.189.mjs:3049
// "Enter to select · ↑/↓ to navigate · n to add notes · Tab to switch questions · ctrl+g to edit · Esc to cancel"

function InputGuideFooter({ actions }) {
    return (
        <KeybindingHintsList>
            <KeybindingHint action="select" context="Global" fallback="Enter" description="select" parens />
            <KeybindingHint action="navigate" context="Global" fallback="↑/↓" description="navigate" parens />
            <KeybindingHint action="cancel" context="Global" fallback="Esc" description="cancel" parens />
        </KeybindingHintsList>
    );
}
```

### Validation Warning Display

When keybindings have validation errors, warnings are shown:

```javascript
// ============================================
// Warning display pattern
// Location: Inferred from validation system
// ============================================

function KeybindingWarnings({ warnings }) {
    if (!warnings || warnings.length === 0) return null;

    return (
        <Box flexDirection="column">
            {warnings.map((warning, index) => (
                <Text key={index} color={warning.severity === 'error' ? 'red' : 'yellow'}>
                    {warning.severity.toUpperCase()}: {warning.message}
                    {warning.suggestion && `\n  Suggestion: ${warning.suggestion}`}
                </Text>
            ))}
        </Box>
    );
}
```

### Telemetry Integration

UI interactions are tracked for feature usage:

```javascript
// ============================================
// Telemetry events
// Location: chunks.65.mjs:1198, chunks.89.mjs:3116
// ============================================

// Fallback used (keybinding not found)
d("tengu_keybinding_fallback_used", {
    action: "clear_history",
    context: "Chat",
    fallback: "Ctrl+L",
    reason: "action_not_found"
});

// Custom keybindings loaded
d("tengu_custom_keybindings_loaded", {
    user_binding_count: 15
});
```

---

## 6. Context Value Structure

The keybinding context provides these values to consumers:

```javascript
// ============================================
// aj - KeybindingSetup provider component
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
    // Initialize with cached bindings
    const [state, setState] = useState(() => {
        const config = loadKeybindingsSync();
        debug(`[keybindings] KeybindingSetup initialized with ${config.bindings.length} bindings, ${config.warnings.length} warnings`);
        return config;
    });
    const { bindings, warnings } = state;
    const [hasReloaded, setHasReloaded] = useState(false);

    // Display warnings as notifications
    useKeybindingWarnings(warnings, hasReloaded);

    // Chord state management
    const pendingChordRef = useRef(null);   // For sync access in handlers
    const [pendingChord, setPendingChordState] = useState(null);  // For UI render
    const timerRef = useRef(null);          // Chord timeout timer
    const handlerRegistryRef = useRef(new Map());  // action → [{context, handler}]
    const activeContextsRef = useRef(new Set());   // Set of active context names

    // Context registration callbacks
    const registerActiveContext = useCallback((contextName) => {
        activeContextsRef.current.add(contextName);
    }, []);

    const unregisterActiveContext = useCallback((contextName) => {
        activeContextsRef.current.delete(contextName);
    }, []);

    // Timer management
    const clearChordTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Set pending chord with automatic timeout
    const setPendingChord = useCallback((newChord) => {
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
    useEffect(() => {
        watchKeybindingsFile();
        const unsubscribe = subscribeToKeybindingsChanges((newConfig) => {
            setHasReloaded(true);
            setState(newConfig);
            debug(`[keybindings] Reloaded: ${newConfig.bindings.length} bindings, ${newConfig.warnings.length} warnings`);
        });
        return () => {
            unsubscribe();
            clearChordTimer();
        };
    }, [clearChordTimer]);

    // Render context provider with handler component
    return (
        <KeybindingContext.Provider
            value={{
                bindings,
                pendingChordRef,
                pendingChord,
                setPendingChord,
                activeContexts: activeContextsRef.current,
                registerActiveContext,
                unregisterActiveContext,
                handlerRegistryRef
            }}
        >
            <KeybindingHandler
                bindings={bindings}
                pendingChordRef={pendingChordRef}
                setPendingChord={setPendingChord}
                activeContexts={activeContextsRef.current}
                handlerRegistryRef={handlerRegistryRef}
            />
            {children}
        </KeybindingContext.Provider>
    );
}

// Mapping: aj→KeybindingSetup, A→children, q→bindings, K→warnings, Y→setState, $p6→loadKeybindingsSync, k→debug, f4Y→useKeybindingWarnings, w→pendingChordRef, O→pendingChord, $→setPendingChordState, H→timerRef, j→handlerRegistryRef, J→activeContextsRef, M→registerActiveContext, D→unregisterActiveContext, X→clearChordTimer, P→setPendingChord, G4Y→CHORD_TIMEOUT_MS, B34→watchKeybindingsFile, g34→subscribeToKeybindingsChanges, G$1→KeybindingContext.Provider, N4Y→KeybindingHandler
```

### Context Value Structure

The keybinding context provides these values to consumers:

```javascript
const contextValue = {
    bindings: Array<FlatBinding>,           // Current bindings (defaults + user)
    pendingChordRef: React.MutableRefObject, // Sync access for handlers
    pendingChord: Array<Keystroke> | null,   // Current pending chord for UI
    setPendingChord: (pending) => void,      // Update pending chord state
    activeContexts: Set<string>,             // Currently active context names
    registerActiveContext: (name) => void,   // Add context to active set
    unregisterActiveContext: (name) => void, // Remove context from active set
    handlerRegistryRef: React.MutableRefObject<Map> // action → handlers
};
```

---

## 7. Voice Integration (v2.1.76)

### VoiceKeybindingHandler Component

The `VoiceKeybindingHandler` (Evz) component handles push-to-talk voice activation through repeated keypress detection. This is new in v2.1.76.

**Related Symbols:**
- `Evz` (chunks.195.mjs:1807) - VoiceKeybindingHandler component
- `kvz` (chunks.195.mjs) - useVoiceIntegration hook
- `Nvz` (chunks.195.mjs:1922) - PTT_ACTIVATION_THRESHOLD = 5
- `Sgq` (chunks.195.mjs:1924) - PTT_WARMUP_THRESHOLD = 2
- `vvz` (chunks.195.mjs:1920) - PTT_RESET_TIMEOUT_MS = 120
- `Vvz` (chunks.195.mjs:1936-1943) - DEFAULT_PTT_KEYSTROKE (space key)

```javascript
// ============================================
// Evz - VoiceKeybindingHandler component
// Location: chunks.195.mjs:1807-1914
// ============================================

// ORIGINAL (for source lookup):
function Evz({
    voiceHandleKeyEvent: A,
    stripTrailing: q,
    resetAnchor: K,
    isActive: Y
}) {
    let z = S5(),
        _ = xA(),
        w = Wv(),
        O = he(),
        $ = M1((W) => W.voiceState) ?? "idle",
        H = GM.useMemo(() => {
            if (!w) return Vvz;
            let W = null;
            for (let Z of w.bindings) {
                if (Z.context !== "Chat") continue;
                if (Z.chord.length !== 1) continue;
                let G = Z.chord[0];
                if (!G) continue;
                if (Z.action === "voice:pushToTalk") W = G;
                else if (W !== null && W$1(G, W)) W = null
            }
            return W
        }, [w]),
        j = H !== null && H.key.length === 1 && !H.ctrl && !H.alt && !H.shift && !H.meta ? H.key : null,
        J = GM.useRef(0),
        M = GM.useRef(0),
        D = GM.useRef(0),
        X = GM.useRef(!1),
        P = GM.useRef(null);
    return GM.useEffect(() => {
        if ($ === "idle") X.current = !1, J.current = 0, M.current = 0, D.current = 0, _((W) => {
            if (!W.voiceWarmingUp) return W;
            return {...W, voiceWarmingUp: !1}
        })
    }, [$, _]), jA((W, Z, G) => {
        if (!((z.getState().voiceEnabled ?? !1) && GI())) return;
        if (!Y || O) return;
        if (H === null) return;
        // ... (key event handling logic)
    }, {isActive: !0}), null
}

// READABLE (for understanding):
function VoiceKeybindingHandler({
    voiceHandleKeyEvent,  // Callback to trigger voice recording
    stripTrailing,        // Function to strip characters during PTT
    resetAnchor,          // Reset cursor position after voice
    isActive              // Whether handler is active
}) {
    const store = useStore();
    const setAppState = useAppStateUpdater();
    const keybindingContext = useKeybindingContext();
    const isDisabled = useDisabledState();
    const voiceState = useAppState((s) => s.voiceState) ?? "idle";

    // Find push-to-talk keybinding from Chat context
    const pttKeystroke = useMemo(() => {
        if (!keybindingContext) return DEFAULT_PTT_KEYSTROKE; // Space key

        let foundBinding = null;
        for (const binding of keybindingContext.bindings) {
            if (binding.context !== "Chat") continue;
            if (binding.chord.length !== 1) continue; // Single-key only

            const keystroke = binding.chord[0];
            if (!keystroke) continue;

            if (binding.action === "voice:pushToTalk") {
                foundBinding = keystroke;
            } else if (foundBinding !== null && keystrokesMatch(keystroke, foundBinding)) {
                // Another binding matches the PTT key - conflict, clear it
                foundBinding = null;
            }
        }
        return foundBinding;
    }, [keybindingContext]);

    // Check if PTT uses a single character (e.g., 'v' key)
    const isSingleCharPTT = pttKeystroke !== null &&
        pttKeystroke.key.length === 1 &&
        !pttKeystroke.ctrl && !pttKeystroke.alt &&
        !pttKeystroke.shift && !pttKeystroke.meta;
    const pttChar = isSingleCharPTT ? pttKeystroke.key : null;

    // Counters for repeat detection
    const keyPressCount = useRef(0);      // Total presses in sequence
    const stripCount = useRef(0);         // Characters stripped
    const floorCount = useRef(0);         // Floor position for stripping
    const isPTTActive = useRef(false);    // PTT currently held
    const resetTimer = useRef(null);      // Reset timeout

    // Reset state when voice becomes idle
    useEffect(() => {
        if (voiceState === "idle") {
            isPTTActive.current = false;
            keyPressCount.current = 0;
            stripCount.current = 0;
            floorCount.current = 0;
            setAppState((s) => s.voiceWarmingUp ? {...s, voiceWarmingUp: false} : s);
        }
    }, [voiceState, setAppState]);

    useInput((inputString, keyEvent, domEvent) => {
        // Guard: voice must be enabled and available
        if (!((store.getState().voiceEnabled ?? false) && isVoiceAvailable())) return;
        if (!isActive || isDisabled) return;
        if (pttKeystroke === null) return;

        let pressCount;
        if (pttChar !== null) {
            // Single-char PTT: count repeated presses of that character
            if (keyEvent.ctrl || keyEvent.meta || keyEvent.shift) return;
            if (inputString[0] !== pttChar) return;
            // Allow repeated character (e.g., "vvvvv")
            if (inputString.length > 1 && inputString !== pttChar.repeat(inputString.length)) return;
            pressCount = inputString.length;
        } else {
            // Multi-key PTT: match exact keystroke
            if (!eventMatchesKeystroke(inputString, keyEvent, pttKeystroke)) return;
            pressCount = 1;
        }

        const currentVoiceState = store.getState().voiceState ?? "idle";

        // Already in PTT mode - handle key release
        if (isPTTActive.current && currentVoiceState !== "idle") {
            domEvent.stopImmediatePropagation();
            if (pttChar !== null) {
                stripTrailing(pressCount, {char: pttChar, floor: floorCount.current});
            }
            voiceHandleKeyEvent(); // Toggle off
            return;
        }

        // Count keypresses
        const previousCount = keyPressCount.current;
        keyPressCount.current += pressCount;

        // Threshold reached: ACTIVATE PTT (5 presses)
        if (keyPressCount.current >= PTT_ACTIVATION_THRESHOLD) {
            domEvent.stopImmediatePropagation();
            if (resetTimer.current) clearTimeout(resetTimer.current);
            resetTimer.current = null;

            keyPressCount.current = 0;
            isPTTActive.current = true;

            setAppState((s) => s.voiceWarmingUp ? s : {...s, voiceWarmingUp: false});

            if (pttChar !== null) {
                // Strip all typed characters and set anchor
                floorCount.current = stripTrailing(stripCount.current + pressCount, {
                    char: pttChar,
                    anchor: true
                });
                stripCount.current = 0;
            } else {
                stripTrailing(0, {anchor: true});
            }

            voiceHandleKeyEvent(); // Toggle on

            // If voice didn't start, reset
            if ((store.getState().voiceState ?? "idle") === "idle") {
                isPTTActive.current = false;
                resetAnchor();
            }
            return;
        }

        // Show warming indicator at 2 presses
        if (pttChar !== null) {
            if (previousCount >= PTT_WARMUP_THRESHOLD) {
                domEvent.stopImmediatePropagation();
                stripTrailing(pressCount, {char: pttChar, floor: stripCount.current});
            } else {
                stripCount.current += pressCount;
            }
        } else {
            domEvent.stopImmediatePropagation();
        }

        // Show warming-up state
        if (keyPressCount.current >= PTT_WARMUP_THRESHOLD) {
            setAppState((s) => s.voiceWarmingUp ? s : {...s, voiceWarmingUp: true});
        }

        // Set reset timer
        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => {
            resetTimer.current = null;
            keyPressCount.current = 0;
            stripCount.current = 0;
            setAppState((s) => s.voiceWarmingUp ? {...s, voiceWarmingUp: false} : s);
        }, PTT_RESET_TIMEOUT_MS); // 120ms
    }, {isActive: true});

    return null;
}

// Mapping: Evz→VoiceKeybindingHandler, A→voiceHandleKeyEvent, q→stripTrailing, K→resetAnchor, Y→isActive, z→store, _→setAppState, w→keybindingContext, O→isDisabled, $→voiceState, H→pttKeystroke, j→pttChar, J→keyPressCount, M→stripCount, D→floorCount, X→isPTTActive, P→resetTimer, Nvz→PTT_ACTIVATION_THRESHOLD, Sgq→PTT_WARMUP_THRESHOLD, vvz→PTT_RESET_TIMEOUT_MS, Vvz→DEFAULT_PTT_KEYSTROKE
```

### Push-to-Talk Activation Algorithm

**What it does:** Detects repeated keypresses of the PTT key to activate voice recording without requiring a modifier key hold.

**How it works:**
1. **Keystroke Detection**: Find the `voice:pushToTalk` binding in Chat context
2. **Single-Char Optimization**: If PTT key is a single character (e.g., 'v'), count repeated presses
3. **Warming Up**: At 2 presses, show visual indicator that PTT is about to activate
4. **Activation**: At 5 presses within 120ms window, toggle voice recording on
5. **Deactivation**: Any subsequent keypress while recording toggles voice off
6. **Reset**: If no keypress for 120ms, reset counter and hide warming indicator

**Why this approach:**
- **Accessibility**: Users don't need to hold a modifier key combination
- **Speed**: 5 rapid presses is faster than navigating to a button
- **Feedback**: Warming indicator at 2 presses gives advance notice
- **Conflict avoidance**: Single-char PTT (like 'v') avoids modifier conflicts

**Key Constants:**
```javascript
const PTT_ACTIVATION_THRESHOLD = 5;   // Nvz - presses needed to activate
const PTT_WARMUP_THRESHOLD = 2;        // Sgq - presses to show warming indicator
const PTT_RESET_TIMEOUT_MS = 120;      // vvz - ms before counter resets

const DEFAULT_PTT_KEYSTROKE = {        // Vvz - fallback if no binding
    key: " ",
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
    super: false
};
```

### Visual Feedback During PTT

When the user is pressing the PTT key repeatedly:

| State | Keypress Count | Visual Indicator |
|-------|----------------|------------------|
| Idle | 0 | None |
| Warming | 2-4 | Subtle indicator showing "..." |
| Active | 5+ | Voice recording indicator |
| Recording | Any | Voice waveform/transcription display |

---

## 8. StatusLine Integration

### Pending Chord Display

When a chord sequence is in progress, the StatusLine component displays the pending chord state to provide visual feedback to the user.

**How it works:**
1. `KeybindingSetup` (aj) maintains `pendingChord` state
2. StatusLine component reads `pendingChord` from KeybindingContext
3. If `pendingChord !== null`, displays the accumulated keystroke sequence
4. A dash suffix indicates waiting for the next key: `"Ctrl+K-"`

```javascript
// ============================================
// StatusLine chord indicator pattern
// Location: Inferred from KeybindingContext usage
// ============================================

// Pseudocode for chord indicator rendering
function StatusLineChordIndicator() {
    const { pendingChord } = useKeybindingContext();

    if (!pendingChord || pendingChord.length === 0) {
        return null;
    }

    // Convert keystroke array to display string
    const chordText = pendingChord.map(keystroke => {
        return stringifyKeystroke(keystroke);  // wl3 function
    }).join(" ");

    return (
        <Text dimColor>
            {chordText}-
        </Text>
    );
}
```

**Visual formatting:**
- **Dimmed color**: Indicates "waiting for input" state
- **Dash suffix**: Visual cue that more input is expected
- **Timeout behavior**: Indicator disappears if 1000ms passes without next key

### Keybinding Display Text Hook

The `useKeybindingDisplayText` hook (`Rq`) provides formatted keybinding text for StatusLine hints:

```javascript
// ============================================
// Rq - useKeybindingDisplayText - For StatusLine hints
// Location: chunks.65.mjs:1191-1205
// ============================================

// ORIGINAL (for source lookup):
function Rq(A, q, K) {
    let Y = PX(A, q, K);
    return Y === void 0 ? "" : Y
}

// READABLE (for understanding):
function useKeybindingDisplayText(action, context, fallback) {
    // Looks up keybinding and returns formatted string like "Ctrl+K"
    // Returns fallback if no binding found, empty string if fallback is undefined
    let displayText = useKeybindingDisplayTextSync(action, context, fallback);
    return displayText === undefined ? "" : displayText;
}

// Mapping: Rq→useKeybindingDisplayText, A→action, q→context, K→fallback, Y→displayText, PX→useKeybindingDisplayTextSync
```

### StatusLine Hint Pattern

StatusLine components use the display text hook to show context-aware keybinding hints:

```javascript
// ============================================
// StatusLine keybinding hint example
// Location: chunks.90.mjs:107-118 (oJ component)
// ============================================

// ORIGINAL (for source lookup):
function oJ() {
    let A = A6(2),
        q = x36.useContext(Q34),
        K = Rq("app:toggleTranscript", "Global", "ctrl+o");
    if (q) return null;
    let Y;
    if (A[0] !== K) Y = x36.default.createElement(T, {
        dimColor: !0
    }, x36.default.createElement(a1, {
        shortcut: K,
        action: "expand",
        parens: !0
    })), A[0] = K, A[1] = Y;
    else Y = A[1];
    return Y
}

// READABLE (for understanding):
function TranscriptToggleHint() {
    // MemoSlot for performance optimization
    let memoSlot = useMemoSlot(2);
    let isHidden = useContext(TranscriptHiddenContext);

    // Get keybinding display text with fallback
    let shortcut = useKeybindingDisplayText(
        "app:toggleTranscript",
        "Global",
        "ctrl+o"  // fallback if no binding
    );

    if (isHidden) return null;

    // Memoized rendering using MemoSlot pattern
    let rendered;
    if (memoSlot[0] !== shortcut) {
        rendered = (
            <Text dimColor>
                <ShortcutDisplay
                    shortcut={shortcut}
                    action="expand"
                    parens={true}
                />
            </Text>
        );
        memoSlot[0] = shortcut;
        memoSlot[1] = rendered;
    } else {
        rendered = memoSlot[1];
    }
    return rendered;
}

// Mapping: oJ→TranscriptToggleHint, A→memoSlot, q→isHidden, K→shortcut, Y→rendered, A6→useMemoSlot, Q34→TranscriptHiddenContext, Rq→useKeybindingDisplayText, a1→ShortcutDisplay
```

**Key insight - MemoSlot Optimization:**
The `A6` (useMemoSlot) hook provides a custom memoization pattern. Instead of re-rendering when any prop changes, it only re-renders when the specific value (`shortcut`) changes. The array `[currentKey, cachedElement]` stores:
- `[0]`: The last value (for comparison)
- `[1]`: The cached rendered element

This avoids React re-renders for unchanged keybinding display text.

### Context Badge Display

StatusLine may also show the current active context to help users understand which keybindings are active:

```javascript
// Example: When Autocomplete context is active, show badge
const activeContexts = useKeybindingContext().activeContexts;
// If "Autocomplete" in activeContexts → show autocomplete badge
// If "Confirmation" in activeContexts → show confirmation mode indicator
```

### System Reminder Integration

Keybinding hints from StatusLine can be injected into system reminders for the LLM context. See [integrations.md](integrations.md#18-system-reminder-integration) for details on the `tengu_keybinding_fallback_used` telemetry event.

---

## 9. Footer Keybinding Hints Pattern

### Standard Footer Layout

Most interactive views display keybinding hints in a footer bar at the bottom of the screen:

```javascript
// ============================================
// Footer hint bar pattern (common across modals)
// Location: Various UI components (inferred pattern)
// ============================================

// Example from confirmation dialogs:
// "Enter to confirm · Esc to cancel · Tab to switch"

function FooterHintBar() {
    return (
        <Box borderTop>
            <KeybindingHintsList>
                <KeybindingHint
                    action="confirm:yes"
                    context="Confirmation"
                    fallback="Enter"
                    description="confirm"
                    parens
                />
                <KeybindingHint
                    action="confirm:no"
                    context="Confirmation"
                    fallback="Esc"
                    description="cancel"
                    parens
                />
                <KeybindingHint
                    action="confirm:nextField"
                    context="Confirmation"
                    fallback="Tab"
                    description="switch"
                    parens
                />
            </KeybindingHintsList>
        </Box>
    );
}
```

### Hint Separator Pattern

The `KeybindingHintsList` (C8) component renders hints with " · " separators:

```
"Enter to select · ↑/↓ to navigate · n to add notes · Tab to switch questions · ctrl+g to edit · Esc to cancel"
```

**Implementation detail:**

```javascript
// ============================================
// Dl3 - Renders hint with separator
// Location: chunks.65.mjs:428-434
// ============================================

// ORIGINAL (for source lookup):
function Dl3(A, q) {
    return hm.default.createElement(hm.default.Fragment, {
        key: hm.isValidElement(A) ? A.key ?? q : q
    }, q > 0 && hm.default.createElement(T, {
        dimColor: !0
    }, " · "), A)
}

// READABLE (for understanding):
function renderHintWithSeparator(hint, index) {
    return (
        <Fragment key={hint.key ?? index}>
            {index > 0 && <Text dimColor> · </Text>}
            {hint}
        </Fragment>
    );
}

// Mapping: Dl3→renderHintWithSeparator, A→hint, q→index, T→Text
```

### Footer Hint Examples by Context

| Context | Footer Hints |
|---------|--------------|
| **Chat** | `"Enter to submit · Esc to cancel · ↑/↓ for history · Ctrl+G for editor"` |
| **Confirmation** | `"Enter to confirm · Esc to cancel · Tab to switch"` |
| **ModelPicker** | `"Enter to select · ↑/↓ to navigate · Esc to cancel"` |
| **Autocomplete** | `"Tab to accept · Enter to confirm · Esc to dismiss"` |
| **Plan Mode** | `"Enter to submit · Tab to next · Esc to cancel · Ctrl+G to edit"` |

---

## 10. Voice PTT State Machine (Detailed)

### Complete State Transition Diagram

```
                    ┌──────────────────────────────────────────┐
                    │              IDLE STATE                   │
                    │  - keyPressCount = 0                      │
                    │  - voiceWarmingUp = false                 │
                    │  - isPTTActive = false                    │
                    └──────────────┬───────────────────────────┘
                                   │
                      User presses PTT key (v)
                                   │
                                   ▼
                    ┌──────────────────────────────────────────┐
                    │            WARMING STATE                  │
                    │  - keyPressCount = 1                      │
                    │  - voiceWarmingUp = false                 │
                    │  - Start 120ms reset timer                │
                    └──────────────┬───────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
         Next key within 120ms         120ms timeout expires
                    │                             │
                    ▼                             ▼
        ┌───────────────────┐         Return to IDLE
        │ keyPressCount++   │         (counter reset to 0)
        │ Check threshold   │
        └─────────┬─────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
count < 2                   count >= 2
    │                           │
    ▼                           ▼
Continue            ┌───────────────────────────────┐
WARMING             │   WARMING_VISIBLE STATE        │
                    │  - voiceWarmingUp = true       │
                    │  - Show "..." indicator        │
                    │  - Strip typed characters      │
                    └───────────┬───────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
        count < 5 (continue)      count >= 5 (ACTIVATE)
                    │                       │
                    ▼                       ▼
        Continue WARMING       ┌───────────────────────────────┐
        Strip characters       │      PTT_ACTIVE STATE          │
        Reset timer            │  - isPTTActive = true          │
                                │  - Start voice recording       │
                                │  - voiceWarmingUp = false      │
                                └───────────┬───────────────────┘
                                            │
                                User presses ANY key
                                            │
                                            ▼
                                ┌───────────────────────────────┐
                                │     DEACTIVATE → IDLE         │
                                │  - Stop voice recording        │
                                │  - Reset all counters          │
                                └───────────────────────────────┘
```

### State Variables and Thresholds

| Variable | Type | Purpose |
|----------|------|---------|
| `keyPressCount` | `useRef<number>` | Count of consecutive PTT key presses |
| `stripCount` | `useRef<number>` | Characters stripped during warming |
| `floorCount` | `useRef<number>` | Anchor position for text stripping |
| `isPTTActive` | `useRef<boolean>` | Whether PTT is currently active |
| `resetTimer` | `useRef<NodeJS.Timeout>` | Timer for 120ms reset |

| Constant | Value | Purpose |
|----------|-------|---------|
| `PTT_ACTIVATION_THRESHOLD` | 5 | Presses needed to activate PTT |
| `PTT_WARMUP_THRESHOLD` | 2 | Presses to show warming indicator |
| `PTT_RESET_TIMEOUT_MS` | 120 | Milliseconds before counter resets |

### Character Stripping Algorithm

**Why strip characters:** When the user types "vvvvv" to activate PTT, those 'v' characters would normally be inserted into the text input. The stripping algorithm removes them.

```javascript
// ============================================
// Character stripping during PTT activation
// Location: chunks.195.mjs:1877-1883
// ============================================

// ORIGINAL (for source lookup):
if (j !== null) D.current = q(M.current + v, {
    char: j,
    anchor: !0
}), M.current = 0;

// READABLE (for understanding):
if (isSingleCharPTT) {
    // Strip all accumulated characters and set floor position
    floorCount.current = stripTrailing(stripCount.current + pressCount, {
        char: pttChar,     // The PTT character (e.g., 'v')
        anchor: true       // Set anchor for future stripping
    });
    stripCount.current = 0;  // Reset strip counter
}

// Mapping: j→pttChar, D→floorCount, q→stripTrailing, M→stripCount, v→pressCount
```

**Stripping flow:**
1. User types "vv" → `stripCount` = 2, no visual change yet
2. User types "vvv" (total 5) → Activation triggered
3. `stripTrailing(2, {char: 'v', anchor: true})` → Removes 2 'v's, sets floor
4. `stripTrailing(3, {char: 'v', floor: 0})` → Removes remaining 3 'v's
5. Result: Input is clean, no 'v' characters remain

---

## 11. Visual Feedback State Table

### Complete UI State Matrix

| UI Element | Idle | Warming (2-4) | Active (5+) | Recording |
|------------|------|---------------|-------------|-----------|
| **StatusLine** | Normal | Normal | Shows mic icon | Shows waveform |
| **Input Field** | Normal | Normal | Focused | Focused |
| **Chord Indicator** | Hidden | Hidden | Hidden | Hidden |
| **Voice Indicator** | Hidden | `"..."` dimmed | Mic icon | Waveform/transcript |
| **Cursor** | Normal | Normal | Normal | Normal |

### Chord Progression UI States

| State | `pendingChord` | Display | Color |
|-------|---------------|---------|-------|
| None | `null` | Nothing | N/A |
| First key pressed | `[{key: "k", ctrl: true}]` | `"Ctrl+K-"` | Dimmed |
| Second key pressed | `[{...}, {key: "c", ctrl: true}]` | Match check | N/A |
| Chord timeout | `null` | Disappears | N/A |
| Escape pressed | `null` | Disappears | N/A |

---

## 12. Help Modal Keybinding Display

### Dynamic Binding Lookup

The help modal displays current keybindings by querying the context:

```javascript
// ============================================
// Help modal keybinding lookup pattern
// Location: Inferred from help system integration
// ============================================

function HelpModalKeybindings({ activeContexts }) {
    const { bindings } = useKeybindingContext();

    // Filter bindings for active contexts
    const relevantBindings = bindings.filter(binding =>
        activeContexts.includes(binding.context)
    );

    // Group by context for organized display
    const grouped = groupBy(relevantBindings, 'context');

    return (
        <Box flexDirection="column">
            {Object.entries(grouped).map(([context, contextBindings]) => (
                <Box key={context} flexDirection="column">
                    <Text bold>{context} Context</Text>
                    {contextBindings.map(binding => (
                        <Text key={binding.action}>
                            {stringifyChord(binding.chord)} → {binding.action}
                        </Text>
                    ))}
                </Box>
            ))}
        </Box>
    );
}
```

### Hot-Reload Behavior

When `keybindings.json` is modified:

1. File watcher (`B34`) detects change
2. `handleKeybindingsFileChange` (`I34`) reloads bindings
3. Context value updates with new bindings
4. Help modal re-renders with updated shortcuts
5. No restart required

---

## 13. MemoSlot Optimization Pattern

### What is MemoSlot?

The `A6` function (referred to as `useMemoSlot`) is a custom React optimization hook used throughout the keybinding system to avoid expensive recalculations and re-renders. It provides a lightweight memoization mechanism similar to `useMemo` but with a more efficient implementation for certain use cases.

### How It Works

```javascript
// ============================================
// A6 - useMemoSlot hook implementation pattern
// Location: chunks.65.mjs (inferred)
// ============================================

// ORIGINAL (for source lookup):
let q = A6(6),
    O;
if (q[0] !== _ || q[1] !== K || q[2] !== w || q[3] !== Y || q[4] !== z) O = (H, j, J) => {
    // ... handler logic ...
}, q[0] = _, q[1] = K, q[2] = w, q[3] = Y, q[4] = z, q[5] = O;
else O = q[5];

// READABLE (for understanding):
const memoSlot = useMemoSlot(6);  // Create slot with 6 elements
let inputHandler;

// Check if any dependency changed
if (memoSlot[0] !== activeContexts ||
    memoSlot[1] !== bindings ||
    memoSlot[2] !== handlerRegistryRef ||
    memoSlot[3] !== pendingChordRef ||
    memoSlot[4] !== setPendingChord) {

    // Recompute the memoized value
    inputHandler = (input, key, event) => { /* ... */ };

    // Store dependencies and result
    memoSlot[0] = activeContexts;
    memoSlot[1] = bindings;
    memoSlot[2] = handlerRegistryRef;
    memoSlot[3] = pendingChordRef;
    memoSlot[4] = setPendingChord;
    memoSlot[5] = inputHandler;  // Store result in last slot
} else {
    // Use cached result
    inputHandler = memoSlot[5];
}

// Mapping: A6→useMemoSlot, q→memoSlot, O→inputHandler
```

### Why Use MemoSlot Over useMemo?

**Performance Benefits:**
1. **No array allocation on every render**: Traditional `useMemo` creates a new dependencies array on each render
2. **Direct slot access**: Reading/writing to array indices is faster than closure captures
3. **Predictable memory usage**: Fixed-size array allocated once per component instance

**When MemoSlot is used:**
- Input handlers that need to capture multiple values
- Component logic with complex dependency tracking
- Situations where re-registering event handlers is expensive

### Usage in Keybinding Components

| Component | Slot Size | Dependencies Tracked |
|-----------|-----------|---------------------|
| `KeybindingHandler` (N4Y) | 6 | activeContexts, bindings, handlerRegistryRef, pendingChordRef, setPendingChord |
| `useRegisterContext` (f$1) | 5 | contextName, isActive, keybindingContext |
| `ShortcutDisplay` (a1) | 9 | bold, shortcut, parens, action |
| `KeybindingHint` (O8) | 5 | bold, description, parens, displayText |
| `KeybindingHintsList` (C8) | 5 | children |
| `KeybindingContext` (G$1) | 27 | Multiple context values |

### Implementation Pattern

```javascript
// Standard MemoSlot pattern:
// 1. Create slot with N elements (last slot reserved for result)
// 2. Check if any dependency changed
// 3. Recompute and store if changed
// 4. Return cached result if unchanged

function ComponentWithMemoSlot(props) {
    const slot = useMemoSlot(DEPENDENCY_COUNT + 1);  // +1 for result

    // Early exit if dependencies match
    if (dependenciesMatch(slot, props)) {
        return slot[RESULT_INDEX];
    }

    // Recompute and cache
    const result = computeExpensiveValue(props);
    storeDependencies(slot, props);
    slot[RESULT_INDEX] = result;

    return result;
}
```

### Key Insight

The MemoSlot pattern is a performance optimization that reduces the overhead of React's standard memoization. In a TUI application like Claude Code, where keystrokes trigger rapid re-renders, this optimization prevents unnecessary function recreations and event handler re-registrations.

---

## Summary

The keybinding UI interaction system provides:

1. **Chord Indicator**: Visual feedback during multi-key sequences via StatusLine
2. **Focus State**: Context registration for focused components
3. **Hint Components**: `ShortcutDisplay`, `KeybindingHint`, `KeybindingHintsList`
4. **Footer Patterns**: Standardized hint bar with " · " separators
5. **Help Modal**: Dynamic keybinding display per context with hot-reload
6. **Validation UI**: Warning display for configuration errors
7. **Telemetry**: Usage tracking for fallbacks and custom bindings
8. **Voice Integration (v2.1.76)**: Push-to-talk via repeated keypress detection with detailed state machine
9. **StatusLine Integration**: Pending chord display with dash suffix
10. **Character Stripping**: Automatic removal of PTT activation characters
11. **MemoSlot Optimization**: Custom memoization pattern for performance

All UI components are memoized and optimized for minimal re-renders during typing.

---

## 14. VoiceKeybindingHandler Source Code (v2.1.76)

### Complete Implementation

```javascript
// ============================================
// Evz - VoiceKeybindingHandler component
// Location: chunks.195.mjs:1807-1914
// ============================================

// ORIGINAL (for source lookup):
function Evz({
    voiceHandleKeyEvent: A,
    stripTrailing: q,
    resetAnchor: K,
    isActive: Y
}) {
    let z = S5(),
        _ = xA(),
        w = Wv(),
        O = he(),
        $ = M1((W) => W.voiceState) ?? "idle",
        H = GM.useMemo(() => {
            if (!w) return Vvz;
            let W = null;
            for (let Z of w.bindings) {
                if (Z.context !== "Chat") continue;
                if (Z.chord.length !== 1) continue;
                let G = Z.chord[0];
                if (!G) continue;
                if (Z.action === "voice:pushToTalk") W = G;
                else if (W !== null && W$1(G, W)) W = null
            }
            return W
        }, [w]),
        j = H !== null && H.key.length === 1 && !H.ctrl && !H.alt && !H.shift && !H.meta ? H.key : null,
        J = GM.useRef(0),
        M = GM.useRef(0),
        D = GM.useRef(0),
        X = GM.useRef(!1),
        P = GM.useRef(null);
    return GM.useEffect(() => {
        if ($ === "idle") X.current = !1, J.current = 0, M.current = 0, D.current = 0, _((W) => {
            if (!W.voiceWarmingUp) return W;
            return {
                ...W,
                voiceWarmingUp: !1
            }
        })
    }, [$, _]), jA((W, Z, G) => {
        if (!((z.getState().voiceEnabled ?? !1) && GI())) return;
        if (!Y || O) return;
        if (H === null) return;
        let v;
        if (j !== null) {
            if (Z.ctrl || Z.meta || Z.shift) return;
            if (W[0] !== j) return;
            if (W.length > 1 && W !== j.repeat(W.length)) return;
            v = W.length
        } else {
            if (!FL7(W, Z, H)) return;
            v = 1
        }
        let N = z.getState().voiceState ?? "idle";
        if (X.current && N !== "idle") {
            if (G.stopImmediatePropagation(), j !== null) q(v, {
                char: j,
                floor: D.current
            });
            A();
            return
        }
        let V = J.current;
        if (J.current += v, J.current >= Nvz) {
            if (G.stopImmediatePropagation(), P.current) clearTimeout(P.current), P.current = null;
            if (J.current = 0, X.current = !0, _((L) => {
                    if (!L.voiceWarmingUp) return L;
                    return {
                        ...L,
                        voiceWarmingUp: !1
                    }
                }), j !== null) D.current = q(M.current + v, {
                char: j,
                anchor: !0
            }), M.current = 0;
            else q(0, {
                anchor: !0
            });
            if (A(), (z.getState().voiceState ?? "idle") === "idle") X.current = !1, K();
            return
        }
        if (j !== null)
            if (V >= Sgq) G.stopImmediatePropagation(), q(v, {
                char: j,
                floor: M.current
            });
            else M.current += v;
        else G.stopImmediatePropagation();
        if (J.current >= Sgq) _((L) => {
            if (L.voiceWarmingUp) return L;
            return {
                ...L,
                voiceWarmingUp: !0
            }
        });
        if (P.current) clearTimeout(P.current);
        P.current = setTimeout((L, h, R, u) => {
            L.current = null, h.current = 0, R.current = 0, u((I) => {
                if (!I.voiceWarmingUp) return I;
                return {
                    ...I,
                    voiceWarmingUp: !1
                }
            })
        }, vvz, P, J, M, _)
    }, {
        isActive: !0
    }), null
}

// READABLE (for understanding):
function VoiceKeybindingHandler({
    voiceHandleKeyEvent,    // Callback to start/stop voice
    stripTrailing,          // Function to strip characters from input
    resetAnchor,            // Reset text anchor position
    isActive                // Whether handler is active
}) {
    let reduxStore = useStore();
    let setVoiceState = useSetVoiceState();
    let keybindingContext = useKeybindingContext();
    let isStreamingActive = useStreamingActive();
    let currentVoiceState = useSelector(state => state.voiceState) ?? "idle";

    // Find the PTT keystroke binding from Chat context
    let pttKeystroke = React.useMemo(() => {
        if (!keybindingContext) return DEFAULT_SPACE_KEYSTROKE;

        let foundBinding = null;
        for (let binding of keybindingContext.bindings) {
            if (binding.context !== "Chat") continue;
            if (binding.chord.length !== 1) continue;  // Only single-key PTT

            let keystroke = binding.chord[0];
            if (!keystroke) continue;

            if (binding.action === "voice:pushToTalk") {
                foundBinding = keystroke;
            } else if (foundBinding !== null && keystrokesMatch(keystroke, foundBinding)) {
                // Another action has same binding - PTT is shadowed
                foundBinding = null;
            }
        }
        return foundBinding;
    }, [keybindingContext]);

    // Check if PTT is a single character (e.g., 'v' or 'space')
    let isSingleCharPTT = pttKeystroke !== null &&
        pttKeystroke.key.length === 1 &&
        !pttKeystroke.ctrl && !pttKeystroke.alt &&
        !pttKeystroke.shift && !pttKeystroke.meta;

    let singleChar = isSingleCharPTT ? pttKeystroke.key : null;

    // State refs for tracking keypress counts
    let keyPressCount = React.useRef(0);   // Current count toward 5
    let stripCount = React.useRef(0);       // Characters stripped during warming
    let floorCount = React.useRef(0);       // Anchor position for stripping
    let isPTTActive = React.useRef(false);  // Whether PTT is currently active
    let resetTimer = React.useRef(null);    // 120ms reset timeout

    // Reset state when voice goes idle
    React.useEffect(() => {
        if (currentVoiceState === "idle") {
            isPTTActive.current = false;
            keyPressCount.current = 0;
            stripCount.current = 0;
            floorCount.current = 0;
            setVoiceState(state => {
                if (!state.voiceWarmingUp) return state;
                return { ...state, voiceWarmingUp: false };
            });
        }
    }, [currentVoiceState, setVoiceState]);

    // Register with Ink's input handler
    useInput((inputString, keyEvent, domEvent) => {
        // Guard checks
        if (!((reduxStore.getState().voiceEnabled ?? false) && isVoiceIntegrationAvailable())) return;
        if (!isActive || isStreamingActive) return;
        if (pttKeystroke === null) return;

        // Determine press count
        let pressCount;
        if (singleChar !== null) {
            // Single-character PTT (e.g., 'v')
            if (keyEvent.ctrl || keyEvent.meta || keyEvent.shift) return;
            if (inputString[0] !== singleChar) return;
            // Handle key repeat (e.g., "vvvvv" as single input)
            if (inputString.length > 1 && inputString !== singleChar.repeat(inputString.length)) return;
            pressCount = inputString.length;
        } else {
            // Multi-key PTT (e.g., ctrl+space)
            if (!eventMatchesKeystroke(inputString, keyEvent, pttKeystroke)) return;
            pressCount = 1;
        }

        let voiceState = reduxStore.getState().voiceState ?? "idle";

        // If PTT is already active, any key toggles it off
        if (isPTTActive.current && voiceState !== "idle") {
            domEvent.stopImmediatePropagation();
            if (singleChar !== null) {
                stripTrailing(pressCount, { char: singleChar, floor: floorCount.current });
            }
            voiceHandleKeyEvent();
            return;
        }

        // Accumulate keypress count
        let previousCount = keyPressCount.current;
        keyPressCount.current += pressCount;

        // Check for activation (5 presses)
        if (keyPressCount.current >= PTT_ACTIVATION_THRESHOLD) {
            domEvent.stopImmediatePropagation();
            if (resetTimer.current) clearTimeout(resetTimer.current);
            resetTimer.current = null;

            keyPressCount.current = 0;
            isPTTActive.current = true;

            // Clear warming indicator
            setVoiceState(state => {
                if (!state.voiceWarmingUp) return state;
                return { ...state, voiceWarmingUp: false };
            });

            // Strip characters
            if (singleChar !== null) {
                floorCount.current = stripTrailing(stripCount.current + pressCount, {
                    char: singleChar,
                    anchor: true
                });
                stripCount.current = 0;
            } else {
                stripTrailing(0, { anchor: true });
            }

            voiceHandleKeyEvent();

            // Check if voice started (might fail if no permission, etc.)
            if ((reduxStore.getState().voiceState ?? "idle") === "idle") {
                isPTTActive.current = false;
                resetAnchor();
            }
            return;
        }

        // Handle warming phase (2-4 presses)
        if (singleChar !== null) {
            if (previousCount >= PTT_WARMUP_THRESHOLD) {
                domEvent.stopImmediatePropagation();
                stripTrailing(pressCount, { char: singleChar, floor: stripCount.current });
            } else {
                stripCount.current += pressCount;
            }
        } else {
            domEvent.stopImmediatePropagation();
        }

        // Show warming indicator at 2 presses
        if (keyPressCount.current >= PTT_WARMUP_THRESHOLD) {
            setVoiceState(state => {
                if (state.voiceWarmingUp) return state;
                return { ...state, voiceWarmingUp: true };
            });
        }

        // Start/reset 120ms timeout
        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout((timerRef, countRef, stripRef, setState) => {
            timerRef.current = null;
            countRef.current = 0;
            stripRef.current = 0;
            setState(state => {
                if (!state.voiceWarmingUp) return state;
                return { ...state, voiceWarmingUp: false };
            });
        }, PTT_RESET_TIMEOUT_MS, resetTimer, keyPressCount, stripCount, setVoiceState);

    }, { isActive: true });

    return null;
}

// Mapping: Evz→VoiceKeybindingHandler, A→voiceHandleKeyEvent, q→stripTrailing, K→resetAnchor, Y→isActive, z→reduxStore, _→setVoiceState, w→keybindingContext, O→isStreamingActive, $→currentVoiceState, H→pttKeystroke, j→singleChar, J→keyPressCount, M→stripCount, D→floorCount, X→isPTTActive, P→resetTimer, W→inputString, Z→keyEvent, G→domEvent, v→pressCount, N→voiceState, V→previousCount, Nvz→PTT_ACTIVATION_THRESHOLD (5), Sgq→PTT_WARMUP_THRESHOLD (2), vvz→PTT_RESET_TIMEOUT_MS (120), Vvz→DEFAULT_SPACE_KEYSTROKE, W$1→keystrokesMatch, FL7→eventMatchesKeystroke, jA→useInput, GI→isVoiceIntegrationAvailable, M1→useSelector, he→useStreamingActive, S5→useStore, xA→useSetVoiceState, Wv→useKeybindingContext
```

### Voice PTT Constants

```javascript
// ============================================
// Voice PTT constants
// Location: chunks.195.mjs:1920-1943
// ============================================

// ORIGINAL (for source lookup):
vvz = 120
Nvz = 5
Sgq = 2
Vvz = {
    key: " ",
    ctrl: !1,
    alt: !1,
    shift: !1,
    meta: !1,
    super: !1
}

// READABLE (for understanding):
PTT_RESET_TIMEOUT_MS = 120;          // 120ms window between keypresses
PTT_ACTIVATION_THRESHOLD = 5;        // 5 presses to activate PTT
PTT_WARMUP_THRESHOLD = 2;            // 2 presses to show warming indicator
DEFAULT_SPACE_KEYSTROKE = {          // Default PTT key if not configured
    key: " ",
    ctrl: false,
    alt: false,
    shift: false,
    meta: false,
    super: false
};

// Mapping: vvz→PTT_RESET_TIMEOUT_MS, Nvz→PTT_ACTIVATION_THRESHOLD, Sgq→PTT_WARMUP_THRESHOLD, Vvz→DEFAULT_SPACE_KEYSTROKE
```

### Key Design Decisions

**Why 5 presses?**
- Prevents accidental activation from normal typing
- Fast typers can trigger quickly (5 'v' presses in ~300ms)
- Provides haptic feedback similar to Morse code patterns

**Why 120ms timeout?**
- Short enough to require intentional rapid presses
- Long enough to allow natural typing rhythm
- Prevents accidental activation from slow typing

**Why single-character support?**
- Allows 'v' or other keys to be used for PTT
- No modifiers needed (cleaner UX)
- Character stripping removes PTT activation chars from input

**Why warming indicator at 2 presses?**
- Shows user they're on the right track
- Doesn't appear on single accidental press
- Provides immediate visual feedback