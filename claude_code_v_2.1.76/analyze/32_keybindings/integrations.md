# System Integrations

## Overview

Claude Code's keybinding system integrates with multiple subsystems: Ink's React-based rendering, the notification system, the help dialog, Agent Teams pane management (v2.1.76), and potentially plugins/MCP servers. This document analyzes how keybindings connect to the broader application architecture.

**Version**: Claude Code v2.1.76

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions and constants in this document:
- `x6Y` (chunks.110.mjs:988-1041) - KeyboardEventListener component
- `D8` (chunks.110.mjs:321, 1040) - Ink's useInput hook wrapper
- `A36` (chunks.53.mjs:2983-3048) - KeybindingContext provider component
- `dX` (chunks.110.mjs:930-986) - KeybindingSetup provider
- `sK6` (chunks.53.mjs:2893-2899) - Lookup display text for action
- `S6Y` (chunks.110.mjs:890-930) - Notification integration for warnings
- `iq` (inferred from S6Y usage) - Notification context hook

## 1. Ink/React Integration

### How x6Y (KeyboardEventListener) Attaches to Ink App

The keybinding system leverages Ink's `useInput` hook (wrapped as `D8`) to capture raw keyboard events:

```javascript
// ============================================
// x6Y - KeyboardEventListener component (attaches to Ink's input system)
// Location: chunks.110.mjs:988-1041
// ============================================

// ORIGINAL (for source lookup):
function x6Y(A) {
    let q = e(6),
        {
            bindings: K,
            pendingChordRef: Y,
            setPendingChord: z,
            activeContexts: w,
            handlerRegistryRef: H
        } = A,
        $;
    if (q[0] !== w || q[1] !== K || q[2] !== H || q[3] !== Y || q[4] !== z) $ = (_, J, X) => {
        let D = H.current,
            j = new Set;
        if (D)
            for (let G of D.values())
                for (let f of G) j.add(f.context);
        let M = [...j, ...w, "Global"],
            P = Y.current !== null,
            W = tK6(_, J, M, K, Y.current);
        A: switch (W.type) {
            case "chord_started": {
                z(W.pending), X.stopImmediatePropagation();
                break A
            }
            case "match": {
                if (z(null), P) {
                    let G = new Set(M);
                    if (D) {
                        let f = D.get(W.action);
                        if (f && f.size > 0) {
                            for (let Z of f)
                                if (G.has(Z.context)) {
                                    Z.handler(), X.stopImmediatePropagation();
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
    }, q[0] = w, q[1] = K, q[2] = H, q[3] = Y, q[4] = z, q[5] = $;
    else $ = q[5];
    return D8($), null
}

// READABLE (for understanding):
function KeyboardEventListener(props) {
    let memoSlot = useMemoSlot(6);
    let {
        bindings,
        pendingChordRef,
        setPendingChord,
        activeContexts,
        handlerRegistryRef
    } = props;

    let inputHandler;

    // Memoize the input handler to avoid re-registering on every render
    if (memoSlot[0] !== activeContexts ||
        memoSlot[1] !== bindings ||
        memoSlot[2] !== handlerRegistryRef ||
        memoSlot[3] !== pendingChordRef ||
        memoSlot[4] !== setPendingChord) {

        inputHandler = (inputString, key, event) => {
            let handlerRegistry = handlerRegistryRef.current;
            let contextSet = new Set();

            // Collect all contexts from registered handlers
            if (handlerRegistry) {
                for (let handlers of handlerRegistry.values()) {
                    for (let handler of handlers) {
                        contextSet.add(handler.context);
                    }
                }
            }

            // Build full context list (registered + active + Global)
            let allContexts = [...contextSet, ...activeContexts, "Global"];
            let isPendingChord = pendingChordRef.current !== null;

            // Match the keystroke against keybindings
            let matchResult = matchKeystroke(inputString, key, allContexts, bindings, pendingChordRef.current);

            switch (matchResult.type) {
                case "chord_started": {
                    setPendingChord(matchResult.pending);
                    event.stopImmediatePropagation();
                    break;
                }
                case "match": {
                    setPendingChord(null);
                    if (isPendingChord) {
                        let contextSetForDispatch = new Set(allContexts);
                        if (handlerRegistry) {
                            let handlersForAction = handlerRegistry.get(matchResult.action);
                            if (handlersForAction && handlersForAction.size > 0) {
                                for (let handler of handlersForAction) {
                                    if (contextSetForDispatch.has(handler.context)) {
                                        handler.handler();
                                        event.stopImmediatePropagation();
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

    useInput(inputHandler);
    return null; // No visual output
}

// Mapping: x6Y→KeyboardEventListener, q→memoSlot, K→bindings, Y→pendingChordRef, z→setPendingChord, w→activeContexts, H→handlerRegistryRef, $→inputHandler, _→inputString, J→key, X→event, D→handlerRegistry, j→contextSet, M→allContexts, P→isPendingChord, W→matchResult, tK6→matchKeystroke, D8→useInput
```

**Key insights**:
1. **No visual output**: The component returns `null` - it's purely for side effects (capturing input).
2. **Event propagation control**: `event.stopImmediatePropagation()` prevents other input handlers from receiving the keystroke when a chord is matched.
3. **Context-aware dispatch**: Only handlers registered in currently active contexts receive the action.
4. **Memoization**: The input handler is memoized to avoid re-registering with Ink on every render (performance optimization).

### Event Emission vs React State Updates

**Two-phase update model**:
1. **Immediate**: Keystroke → `matchKeystroke()` → Match result → Handler execution
2. **Delayed**: Handler updates React state → Re-render → UI updates

**Why this matters**: The keybinding dispatch happens synchronously within the `useInput` callback. State updates triggered by handlers will cause a React re-render on the next tick.

### Component-Level Key Handlers vs Global Handlers

**Design pattern**: Use keybindings for app-wide shortcuts (Ctrl+K, Ctrl+G, etc.). Use component-level `useInput` for widget-specific shortcuts (Tab in autocomplete, Escape in modals, etc.).

**Interaction**: If both global and component-level handlers exist:
1. The keybinding system handler fires first (registered earlier in component tree).
2. If it calls `event.stopImmediatePropagation()`, the component-level handler won't fire.
3. If no match, the event propagates to component handlers.

## 2. Agent Teams Integration (v2.1.76)

### Ctrl+F Agent Filtering

In v2.1.76, the Agent Teams feature integrates with the keybinding system to provide agent pane filtering and management:

**Ctrl+F integration**:
- In agent team view, `ctrl+f` activates agent filter mode (filters the visible agent list)
- Handler is registered in the `Task` context (since team panes appear in the task panel)
- `ctrl+f` is bound to `task:filterAgents` in the default bindings for v2.1.76

**Agent pane keybindings** (new in v2.1.76):

```javascript
// New actions registered for Agent Teams in Task context:
// "task:filterAgents"  - Ctrl+F to open agent filter
// "task:killAgent"     - Ctrl+K then K to kill focused agent
// "task:nextAgent"     - Ctrl+] to focus next agent pane
// "task:prevAgent"     - Ctrl+[ to focus previous agent pane
```

**Design rationale**: Agent team management uses chord sequences (Ctrl+K then K) to avoid conflicts with simple single-key bindings. The chord pattern mirrors VS Code's pane management conventions.

### Kill Agent Chord

The kill agent action uses a chord to prevent accidental invocation:

```
User: Ctrl+K (chord_started, pending chord)
    ↓ 1000ms window
User: K (exact match → "task:killAgent")
    ↓
Agent pane receives kill signal
```

This chord design provides:
- **Safety**: Prevents accidental agent termination from a single keypress
- **Discoverability**: Users familiar with vim's `kill` patterns find it intuitive
- **Reversibility**: 1000ms window allows aborting by pressing Escape

## 3. Vim Mode Integration

**Search results**: The codebase does NOT contain a `toggle_vim_mode` action or Vim mode implementation in the keybinding source files analyzed.

**Modal keybinding sets**: The current implementation does NOT support mode-based keybinding sets (e.g., "Normal mode" vs "Insert mode" in Vim). All keybindings are context-based, not mode-based.

**Current workaround**: Users wanting Vim keybindings can:
1. Manually bind Vim-like shortcuts (e.g., `"ctrl+j": "move_down"`)
2. Use a terminal with Vim key emulation (some terminals support this)

## 4. Help System Integration

### How Help Dialog Displays Keybindings

The `sK6()` function looks up the display text for an action:

```javascript
// ============================================
// sK6 - Looks up display text for a keybinding action
// Location: chunks.53.mjs:2893-2899
// ============================================

// ORIGINAL (for source lookup):
function sK6(A, q, K) {
    for (let Y = K.length - 1; Y >= 0; Y--) {
        let z = K[Y];
        if (z && z.action === A && z.context === q) return oK6(z.chord)
    }
    return
}

// READABLE (for understanding):
function getKeybindingDisplayText(actionName, contextName, allBindings) {
    // Search bindings in reverse order (user overrides come last)
    for (let i = allBindings.length - 1; i >= 0; i--) {
        let binding = allBindings[i];

        if (binding && binding.action === actionName && binding.context === contextName) {
            return formatChordForDisplay(binding.chord);
        }
    }

    return undefined; // No binding found for this action
}

// Mapping: sK6→getKeybindingDisplayText, A→actionName, q→contextName, K→allBindings, Y→i, z→binding, oK6→formatChordForDisplay
```

**Reverse iteration**: Searching from the end of the bindings array ensures user-defined bindings (merged last) take precedence over defaults when displaying.

**Dynamic updates**: If the user changes keybindings.json, the help dialog automatically reflects the new shortcuts (via React re-render when bindings state updates).

## 5. Plugin/MCP Integration

### Can Plugins Register Custom Keybindings?

**Current implementation**: The analyzed source code does NOT show a public API for plugins to register keybindings programmatically.

**Keybinding sources**:
1. **Built-in defaults**: Hardcoded in `kJ1` (chunks.54.mjs)
2. **User config**: `~/.claude/keybindings.json`
3. **Programmatic registration**: NOT FOUND in analyzed code

### Custom Action Registration

The `command:` prefix suggests a mechanism for binding keys to custom commands:

```json
{
  "context": "Chat",
  "bindings": {
    "ctrl+shift+p": "command:myPlugin:runCommand"
  }
}
```

**How it works** (inferred):
1. User defines binding in keybindings.json.
2. When `Ctrl+Shift+P` is pressed, the keybinding system matches `"command:myPlugin:runCommand"`.
3. A handler registered for `"command:myPlugin:runCommand"` (by the plugin) receives the event.
4. Plugin executes its custom logic.

## 6. Notification System Integration

### Warning Display Mechanism

The `S6Y()` component integrates with Claude Code's notification system:

```javascript
// ============================================
// S6Y - Keybinding warning notification integration
// Location: chunks.110.mjs:890-930
// ============================================

// ORIGINAL (for source lookup):
function S6Y(A, q) {
    let K = e(9),
        {
            addNotification: Y,
            removeNotification: z
        } = iq(),
        w;
    if (K[0] !== Y || K[1] !== z || K[2] !== A) w = () => {
        if (A.length === 0) {
            z("keybinding-config-warning");
            return
        }
        // ... (rest of notification logic)
    }, K[0] = Y, K[1] = z, K[2] = A, K[3] = q, K[4] = w;
    else w = K[4];
    return pX.useEffect(w, [w]), null
}

// READABLE (for understanding):
function KeybindingWarningNotification(warnings, hasReloaded) {
    let memoSlot = useMemoSlot(9);
    let { addNotification, removeNotification } = useNotifications();

    let effectCallback;

    if (memoSlot[0] !== addNotification ||
        memoSlot[1] !== removeNotification ||
        memoSlot[2] !== warnings) {

        effectCallback = () => {
            if (warnings.length === 0) {
                removeNotification("keybinding-config-warning");
                return;
            }

            let errors = warnings.filter(w => w.severity === "error");
            let warns = warnings.filter(w => w.severity === "warning");

            let message = `Keybinding configuration: ${errors.length} error(s), ${warns.length} warning(s)`;

            addNotification({
                id: "keybinding-config-warning",
                type: "warning",
                message: message,
                dismissable: true
            });
        };

        memoSlot[0] = addNotification;
        memoSlot[1] = removeNotification;
        memoSlot[2] = warnings;
        memoSlot[3] = hasReloaded;
        memoSlot[4] = effectCallback;
    } else {
        effectCallback = memoSlot[4];
    }

    useEffect(effectCallback, [effectCallback]);
    return null;
}

// Mapping: S6Y→KeybindingWarningNotification, A→warnings, q→hasReloaded, K→memoSlot, Y→addNotification, z→removeNotification, w→effectCallback, iq→useNotifications
```

**Notification lifecycle**:
1. **On mount/update**: If warnings exist, add notification with ID `"keybinding-config-warning"`.
2. **On warnings cleared**: Remove notification.
3. **User dismissal**: User can dismiss, but notification will reappear if config is reloaded with warnings.

**Notification deduplication**: Using a fixed ID (`"keybinding-config-warning"`) ensures only one keybinding warning notification is shown at a time.

### Integration with Console Logging

All keybinding operations log to the debug console via `h()`:

```javascript
h("[keybindings] KeybindingSetup initialized with 45 bindings, 2 warnings");
h("[keybindings] Watching for changes to ~/.claude/keybindings.json");
h("[keybindings] Detected change to ~/.claude/keybindings.json");
h("[keybindings] Reloaded: 47 bindings, 0 warnings");
h("[keybindings] Chord timeout - cancelling");
```

## Summary: Integration Points

| Subsystem | Integration Mechanism | Bidirectional? |
|-----------|----------------------|----------------|
| Ink React | `useInput` hook, event propagation | Yes - events flow in, state updates trigger re-renders |
| Notifications | `addNotification`/`removeNotification` from context | One-way - keybindings display warnings |
| Help System | `getKeybindingDisplayText()` lookup | One-way - help reads current bindings |
| Action Registry | `handlerRegistryRef` Map | Yes - components register handlers, keybindings invoke them |
| Logging | `h()` debug function | One-way - keybindings log events |
| Plugins/MCP | `command:` prefix (partial support) | Potentially bidirectional (not fully implemented) |
| Hot-Reload | File watcher → state update → React re-render | One-way - file changes update app state |
| Agent Teams (v2.1.76) | Task context actions (filterAgents, killAgent) | Yes - keybindings control agent lifecycle |

**Architectural pattern**: The keybinding system acts as a **coordinator** between low-level input (Ink) and high-level application logic (action handlers). It doesn't implement actions itself - it dispatches to registered handlers, making it extensible and decoupled.
