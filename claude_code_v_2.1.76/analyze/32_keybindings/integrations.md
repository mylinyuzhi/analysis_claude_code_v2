# System Integrations

## Overview

Claude Code's keybinding system integrates with multiple subsystems: Ink's React-based rendering, the notification system, the help dialog, Agent Teams pane management (v2.1.76), and potentially plugins/MCP servers. This document analyzes how keybindings connect to the broader application architecture.

**Version**: Claude Code v2.1.76

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure

Key functions and constants in this document:
- `N4Y` (chunks.117.mjs:1936-1979) - KeybindingHandler component
- `D8` (chunks.65.mjs:905-939) - useKeybindingAction hook
- `G$1` (chunks.65.mjs:799-870) - KeybindingContext provider component
- `aj` (chunks.117.mjs:1879-1934) - KeybindingSetup provider
- `P$1` (chunks.65.mjs:710-716) - findKeybindingForAction lookup
- `D$1` (chunks.65.mjs:647-649) - stringifyChord for display formatting
- `Rq` (chunks.65.mjs:1191-1205) - useKeybindingDisplayText hook
- `PX` (chunks.90.mjs:69-83) - useKeybindingDisplayTextSync with telemetry
- `Wv` (chunks.65.mjs:874) - useKeybindingContext hook
- `m34` (chunks.89.mjs:3203) - getCachedBindings function
- `d` (telemetry) - sendTelemetryEvent function

## 1. Ink/React Integration

### How N4Y (KeybindingHandler) Attaches to Ink App

The keybinding system leverages Ink's `useInput` hook (wrapped as `D8`) to capture raw keyboard events:

```javascript
// ============================================
// N4Y - KeybindingHandler component (attaches to Ink's input system)
// Location: chunks.117.mjs:1936-1979
// ============================================

// ORIGINAL (for source lookup):
function N4Y(A) {
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
            W = Z$1(_, J, M, K, Y.current);
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

// Mapping: N4Y→KeybindingHandler, q→memoSlot, K→bindings, Y→pendingChordRef, z→setPendingChord, w→activeContexts, H→handlerRegistryRef, $→inputHandler, _→inputString, J→key, X→event, D→handlerRegistry, j→contextSet, M→allContexts, P→isPendingChord, W→matchResult, Z$1→resolveKeystroke, D8→useInput
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
1. **Built-in defaults**: Hardcoded in `XW6` (chunks.89.mjs)
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
// Location: chunks.117.mjs:890-930
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

## 7. System Reminder Integration (04_system_reminder)

### Keybinding Hints in System Reminders

The keybinding system integrates with the `04_system_reminder` module to display contextual keybinding hints in system reminder content.

**How it works:**
1. When a system reminder is triggered, it may include keybinding hints
2. The `useKeybindingDisplayText` (Rq) hook looks up the current binding for an action
3. If the user has customized the binding, their shortcut is shown (not the default)
4. If no binding is found, the fallback text is used and telemetry is logged

```javascript
// ============================================
// Rq - Hook to get display text for an action with fallback
// Location: chunks.65.mjs:1191-1205
// ============================================

// ORIGINAL (for source lookup):
function Rq(A, q, K) {
    let Y = Wv(),
        z = Y?.getDisplayText(A, q),
        _ = z === void 0,
        w = Y ? "action_not_found" : "no_context",
        O = N$1.useRef(!1);
    return N$1.useEffect(() => {
        if (_ && !O.current) O.current = !0, d("tengu_keybinding_fallback_used", {
            action: A,
            context: q,
            fallback: K,
            reason: w
        })
    }, [_, A, q, K, w]), _ ? K : z
}

// READABLE (for understanding):
function useKeybindingDisplayText(actionName, contextName, fallbackText) {
    const context = useKeybindingContext();

    // Get display text via context's getDisplayText method
    const displayText = context?.getDisplayText(actionName, contextName);

    // Check if fallback is needed
    const needsFallback = displayText === undefined;
    const reason = context ? "action_not_found" : "no_context";

    // Track fallback usage with telemetry (once per hook instance)
    const hasLoggedRef = useRef(false);
    useEffect(() => {
        if (needsFallback && !hasLoggedRef.current) {
            hasLoggedRef.current = true;
            telemetry("tengu_keybinding_fallback_used", {
                action: actionName,
                context: contextName,
                fallback: fallbackText,
                reason: reason
            });
        }
    }, [needsFallback, actionName, contextName, fallbackText, reason]);

    // Return display text or fallback
    return needsFallback ? fallbackText : displayText;
}

// Mapping: Rq→useKeybindingDisplayText, A→actionName, q→contextName, K→fallbackText, Y→context, z→displayText, _→needsFallback, w→reason, O→hasLoggedRef, d→telemetry
```

**Key insight**: The hook memoizes telemetry logging via a ref (`hasLoggedRef`) to ensure each hook instance only logs once, even across re-renders. The fallback mechanism ensures UI always shows some keybinding hint.

### Complete Function Signature

The `useKeybindingDisplayText` (Rq) hook has three parameters:

| Parameter | Type | Purpose |
|-----------|------|---------|
| `actionName` | string | The action to look up (e.g., `"chat:submit"`) |
| `contextName` | string | The context to search in (e.g., `"Chat"`) |
| `fallbackText` | string | Text to display if binding not found |

### Contextual Hint Filtering

System reminders filter keybinding hints based on the current active context:

```javascript
// Example: Show hint only when Chat context is active
const submitHint = useKeybindingDisplayText("chat:submit", "Chat");
// Returns "enter" (or user's custom binding) when Chat context is active
```

### UI Component Usage Examples

The `useKeybindingDisplayText` (Rq) hook is used throughout the application to display context-aware keybinding hints:

#### Confirmation Dialog Example

```javascript
// ============================================
// Confirmation dialog with keybinding hint
// Location: chunks.196.mjs:2003-2006
// ============================================

// The confirmation dialog shows the "Esc" key hint for cancelling:
let cancelHint = Rq("confirm:no", "Confirmation", "Esc");
// Looks up "confirm:no" action in "Confirmation" context
// Fallback: "Esc" if no binding found
```

#### Theme Picker Example

```javascript
// ============================================
// Theme picker with toggle syntax highlighting hint
// Location: chunks.151.mjs:718-719
// ============================================

// ThemePicker context registered
f$1("ThemePicker");  // useRegisterContext("ThemePicker")

// Get display text for toggle syntax action
let toggleSyntaxHint = Rq("theme:toggleSyntaxHighlighting", "ThemePicker", "ctrl+t");
// Shows user's custom binding or "ctrl+t" as fallback
```

#### Mode Indicator Integration

Keybinding hints are also shown in mode indicators and status displays:

```javascript
// Mode cycling hint shown in footer/status
// Location: Inferred from platform_specific.md
let modeCycleKey = Rq("app:cycleMode", "Global", "shift+tab");
// On older Windows Node: falls back to "meta+m"
```

### Fallback Mechanism

When a keybinding is not found, the third parameter to `Rq` provides a fallback:

```javascript
// Function signature with fallback:
// Rq(actionName, contextName, fallbackText)

// Example usages:
Rq("confirm:no", "Confirmation", "Esc")           // → "Esc" if not bound
Rq("theme:toggleSyntaxHighlighting", "ThemePicker", "ctrl+t")  // → "ctrl+t" if not bound
Rq("chat:submit", "Chat", "enter")               // → "enter" if not bound
```

**Why fallbacks matter**: Ensures UI always shows some keybinding hint even if:
- User removed a default binding
- Custom binding is invalid
- Configuration file has errors

### Telemetry Integration for Hints

When a fallback is used, telemetry is logged:

```javascript
// From chunks.65.mjs (inferred from context)
d("tengu_keybinding_fallback_used", {
    action: actionName,
    context: contextName,
    fallback: fallbackText,
    reason: "action_not_found"  // or "context_mismatch"
});
```

**Purpose**: Tracks which actions users may have unbound, informing UX improvements.

### Complete Usage Reference Table

The following table shows all `useKeybindingDisplayText` (Rq) usage locations across the codebase:

| File | Action | Context | Fallback | UI Location |
|------|--------|---------|----------|-------------|
| chunks.192.mjs:425 | `chat:cycleMode` | Chat | `shift+tab` | Footer mode indicator |
| chunks.192.mjs:425 | `chat:cancel` | Chat | `esc` | Footer cancel hint |
| chunks.192.mjs:425 | `app:toggleTodos` | Global | `ctrl+t` | Footer todos hint |
| chunks.192.mjs:425 | `chat:killAgents` | Chat | `ctrl+f` | Agent kill hint |
| chunks.192.mjs:425 | `voice:pushToTalk` | Chat | `Space` | Voice PTT hint |
| chunks.192.mjs:1429 | `confirm:cycleMode` | Confirmation | `shift+tab` | Confirmation dialog |
| chunks.151.mjs:719 | `theme:toggleSyntaxHighlighting` | ThemePicker | `ctrl+t` | Theme picker UI |
| chunks.152.mjs:2130 | `diff:dismiss` | DiffDialog | `esc` | Diff dialog footer |
| chunks.153.mjs:1024 | `app:toggleTranscript` | Global | `ctrl+o` | Main UI footer |
| chunks.153.mjs:1029 | `app:toggleTodos` | Global | `ctrl+t` | Main UI footer |
| chunks.153.mjs:1034 | `chat:undo` | Chat | `ctrl+_` | Chat input footer |
| chunks.153.mjs:1039 | `chat:stash` | Chat | `ctrl+s` | Chat input footer |
| chunks.153.mjs:1044 | `chat:cycleMode` | Chat | `shift+tab` | Chat mode indicator |
| chunks.153.mjs:1049 | `chat:modelPicker` | Chat | `alt+p` | Model picker hint |
| chunks.153.mjs:1054 | `chat:fastMode` | Chat | `alt+o` | Fast mode hint |
| chunks.153.mjs:1059 | `chat:externalEditor` | Chat | `ctrl+g` | Editor hint |
| chunks.153.mjs:1064 | `app:toggleTerminal` | Global | `meta+j` | Terminal toggle |
| chunks.153.mjs:1069 | `chat:imagePaste` | Chat | `ctrl+v` | Image paste hint |
| chunks.153.mjs:1330 | `help:dismiss` | Help | `esc` | Help modal footer |
| chunks.132.mjs:1368 | `app:toggleTranscript` | Global | `ctrl+o` | Transcript toggle |
| chunks.133.mjs:2634 | `task:background` | Task | `ctrl+b` | Task panel footer |
| chunks.161.mjs:38 | `transcript:toggleShowAll` | Transcript | `Ctrl+E` | Transcript view |

### Footer Integration Pattern

The footer area uses multiple Rq calls to display available shortcuts:

```javascript
// ============================================
// Footer with multiple keybinding hints
// Location: chunks.192.mjs:425 (deobfuscated)
// ============================================

// ORIGINAL (for source lookup):
} = KA(), H = Rq("chat:cycleMode", "Chat", "shift+tab"), j = M1((O6) => O6.tasks), ...
// ... later in the component:
p = Rq("app:toggleTodos", "Global", "ctrl+t"), Q = Rq("chat:killAgents", "Chat", "ctrl+f"),
U = Rq("voice:pushToTalk", "Chat", "Space"),

// READABLE (for understanding):
// Footer component retrieves hints for multiple actions
function FooterComponent() {
    // Get mode cycling hint
    const cycleModeHint = useKeybindingDisplayText("chat:cycleMode", "Chat", "shift+tab");

    // Get todos toggle hint
    const todosHint = useKeybindingDisplayText("app:toggleTodos", "Global", "ctrl+t");

    // Get kill agents hint
    const killAgentsHint = useKeybindingDisplayText("chat:killAgents", "Chat", "ctrl+f");

    // Get voice PTT hint
    const voiceHint = useKeybindingDisplayText("voice:pushToTalk", "Chat", "Space");

    // Render footer with hints
    return (
        <Box>
            <Text dimColor>{cycleModeHint} to cycle mode</Text>
            <Text dimColor> · {todosHint} for todos</Text>
            <Text dimColor> · {voiceHint} for voice</Text>
        </Box>
    );
}
```

### Dynamic Hint Display Based on State

Hints can change based on application state:

```javascript
// ============================================
// Voice hint changes based on voice enabled state
// Location: chunks.192.mjs:425 (inferred pattern)
// ============================================

// The voice hint is only shown when voice is enabled
const isVoiceEnabled = useAppState((s) => s.voiceEnabled) ?? false;
const voiceHint = isVoiceEnabled
    ? useKeybindingDisplayText("voice:pushToTalk", "Chat", "Space")
    : null;

// In footer render:
{isVoiceEnabled && (
    <KeybindingHint
        action="voice:pushToTalk"
        context="Chat"
        fallback="Space"
        description="voice"
    />
)}
```

### Lowercase Normalization Pattern

Some hints are normalized to lowercase for display:

```javascript
// ============================================
// Lowercase hint for cancel action
// Location: chunks.192.mjs:425
// ============================================

// ORIGINAL (for source lookup):
b = Rq("chat:cancel", "Chat", "esc").toLowerCase(),

// READABLE (for understanding):
const cancelHint = useKeybindingDisplayText("chat:cancel", "Chat", "esc").toLowerCase();
// Result: "esc" (lowercase for consistent display)
```

### System Reminder Templates

When system reminders include keybinding hints, they use the same Rq pattern:

```javascript
// ============================================
// System reminder with keybinding hint
// Location: Inferred from system reminder module
// ============================================

// In a system reminder template:
const hint = useKeybindingDisplayText(
    "chat:submit",     // Action
    "Chat",            // Context
    "enter"            // Fallback if not bound
);

// Template string:
// `Press ${hint} to submit your message`
// Result: "Press enter to submit your message" (or user's custom binding)
```

### Telemetry Data Flow

When fallback is used, the telemetry event includes:

```javascript
// Telemetry payload structure
{
    event: "tengu_keybinding_fallback_used",
    properties: {
        action: "chat:submit",      // The action that was looked up
        context: "Chat",            // The context searched
        fallback: "enter",          // The fallback text used
        reason: "action_not_found"  // Why fallback was used
    }
}
```

**Telemetry analysis**: This data helps identify:
- Which actions users commonly unbind
- Missing bindings in default configuration
- Context mismatches between actions and where they're used

## 8. Slash Command Integration (09_slash_command)

### command: Prefix Actions

The keybinding system supports a special `command:` prefix for binding keys to slash commands:

**Configuration example**:
```json
{
    "context": "Chat",
    "bindings": {
        "ctrl+shift+/": "command:help",
        "ctrl+shift+d": "command:doctor"
    }
}
```

**How it works**:
1. User defines a binding with `command:` prefix in keybindings.json
2. When the keystroke is matched, the action string is `"command:help"`
3. The handler registry looks up handlers for `"command:help"`
4. If a slash command handler is registered, it executes the command

**Context restriction**: The `command:` prefix bindings are only valid in the `Chat` context. Validation issues a warning if used elsewhere:

```javascript
// Validation rule (inferred from error_handling.md):
if (action.startsWith("command:") && context !== "Chat") {
    warnings.push({
        type: "invalid_action",
        severity: "warning",
        message: "command: bindings should be in Chat context"
    });
}
```

**Why Chat-only**: Slash commands are chat-input features. They require the chat input to be focused to execute properly.

### Slash Command Discovery

Users can discover command bindings via the help system:
- Help modal shows `command:` actions with their bound keys
- Reverse lookup (`P$1` - findKeybindingForAction) finds the key for a command

## 9. Todo List Integration

### Keyboard-Driven Task Management

The keybinding system provides shortcuts for managing the todo list:

| Keybinding | Action | Context |
|------------|--------|---------|
| `ctrl+t` | `app:toggleTodos` | Global |
| `enter` | `todo:toggleComplete` | Task |
| `escape` | `todo:cancel` | Task |

**How handlers connect**:
1. Todo component registers `Task` context via `useRegisterContext("Task")`
2. Todo component registers handlers for `todo:toggleComplete`, `todo:cancel`
3. When user presses `enter` in Task context, the handler toggles the focused todo item

## 10. Thinking Mode Integration

### Toggle Extended Thinking

The `chat:thinkingToggle` action allows keyboard control over extended thinking:

```json
{
    "context": "Chat",
    "bindings": {
        "meta+t": "chat:thinkingToggle"
    }
}
```

**Handler behavior**:
1. Toggles the `thinkingEnabled` state
2. Updates the UI to show thinking status
3. Next message sent will include/exclude extended thinking based on state

## 11. Model Picker Integration

### Keyboard Navigation in Model Selection

The Model Picker uses keybindings for navigation:

| Keybinding | Action | Context |
|------------|--------|---------|
| `up` | `modelPicker:previous` | ModelPicker |
| `down` | `modelPicker:next` | ModelPicker |
| `enter` | `modelPicker:select` | ModelPicker |
| `escape` | `modelPicker:cancel` | ModelPicker |

**Pattern**: The Model Picker registers its context when open, enabling these bindings. When closed, the context is unregistered, and bindings fall back to Global/Chat.

---

## Extended Summary: Integration Points

| Subsystem | Integration Mechanism | Bidirectional? |
|-----------|----------------------|----------------|
| Ink React | `useInput` hook, event propagation | Yes - events flow in, state updates trigger re-renders |
| Notifications | `addNotification`/`removeNotification` from context | One-way - keybindings display warnings |
| Help System | `getKeybindingDisplayText()` lookup | One-way - help reads current bindings |
| Action Registry | `handlerRegistryRef` Map | Yes - components register handlers, keybindings invoke them |
| Logging | `k()` debug function | One-way - keybindings log events |
| Plugins/MCP | `command:` prefix (partial support) | Potentially bidirectional (not fully implemented) |
| Hot-Reload | File watcher → state update → React re-render | One-way - file changes update app state |
| Agent Teams (v2.1.76) | Task context actions (filterAgents, killAgent) | Yes - keybindings control agent lifecycle |
| System Reminder | `useKeybindingDisplayText` hook | One-way - reminders display current bindings |
| Slash Commands | `command:` prefix actions | Yes - commands can be bound and executed |
| Todo List | Task context actions | Yes - keyboard-driven task management |
| Thinking Mode | `chat:thinkingToggle` action | Yes - toggle extended thinking |
| Model Picker | ModelPicker context actions | Yes - keyboard navigation |
| Voice (v2.1.76) | `voice:pushToTalk` action | Yes - PTT via repeated keypress |

---

## 12. Voice Integration (v2.1.76)

### Push-to-Talk via Repeated Keypress

The Voice PTT feature uses an innovative activation mechanism that doesn't require holding a key combination:

**How it works:**
1. User binds `voice:pushToTalk` action in Chat context (e.g., to 'v' key)
2. `VoiceKeybindingHandler` (Evz) listens for repeated presses of the PTT key
3. At 2 presses: Shows "warming up" indicator
4. At 5 presses within 120ms: Activates voice recording
5. Any subsequent keypress while recording: Deactivates

**Why repeated keypress:**
- **No modifier required**: Single character like 'v' works without Ctrl/Alt
- **Rapid activation**: Typing "vvvvv" is faster than reaching for modifiers
- **Terminal compatible**: Works in all terminals without special protocol support
- **Character stripping**: Prevents PTT activation characters from appearing in input

### Voice Keybinding Lookup

The system finds the PTT keybinding dynamically:

```javascript
// ============================================
// PTT keybinding lookup in VoiceKeybindingHandler
// Location: chunks.195.mjs:1818-1831
// ============================================

// ORIGINAL (for source lookup):
H = GM.useMemo(() => {
    if (!w) return Vvz;
    let W = null;
    for (let Z of w.bindings) {
        if (Z.context !== "Chat") continue;
        if (Z.chord.length !== 1) continue;
        let G = Z.chord[0];
        if (!G) continue;
        if (Z.action === "voice:pushToTalk") W = G;
        else if (W !== null && W$1(G, W)) W = null  // Conflict detection
    }
    return W
}, [w]),

// READABLE (for understanding):
const pttKeystroke = useMemo(() => {
    if (!keybindingContext) return DEFAULT_PTT_KEYSTROKE; // Space key

    let found = null;
    for (let binding of keybindingContext.bindings) {
        if (binding.context !== "Chat") continue;  // Only Chat context
        if (binding.chord.length !== 1) continue;  // Only single-key bindings

        let keystroke = binding.chord[0];
        if (!keystroke) continue;

        if (binding.action === "voice:pushToTalk") {
            found = keystroke;
        } else if (found !== null && keystrokesMatch(keystroke, found)) {
            // Conflict: another action uses same key, clear PTT
            found = null;
        }
    }
    return found;
}, [keybindingContext]);

// Mapping: H→pttKeystroke, w→keybindingContext, Vvz→DEFAULT_PTT_KEYSTROKE, W→found, Z→binding, G→keystroke, W$1→keystrokesMatch
```

### Single-Character PTT Optimization

When PTT is bound to a single character, the system counts repeated occurrences:

```javascript
// Detect single-character PTT
const isSingleCharPTT = pttKeystroke.key.length === 1 &&
                        !pttKeystroke.ctrl &&
                        !pttKeystroke.alt &&
                        !pttKeystroke.shift &&
                        !pttKeystroke.meta;

const pttChar = isSingleCharPTT ? pttKeystroke.key : null;

// In input handler:
if (pttChar !== null) {
    // Count repeated characters in input string
    // "v" → 1 press, "vv" → 2 presses, "vvvvv" → 5 presses
    if (inputString === pttChar.repeat(inputString.length)) {
        keyPressCount.current += inputString.length;
    }
}
```

### Voice State Coordination

The VoiceKeybindingHandler coordinates with the global voice state:

| State | PTT Behavior | Visual Indicator |
|-------|--------------|------------------|
| `idle` | Accept activation | None |
| `warming` | Accumulate presses | "..." dimmed |
| `recording` | Accept deactivation | Mic icon |
| `processing` | Ignore input | Waveform |

### Integration with KeybindingContext

Voice integration uses the standard keybinding context APIs:

1. **Context subscription**: `Wv()` (useKeybindingContext) to access bindings
2. **State management**: `M1((s) => s.voiceState)` to track voice state
3. **State updates**: `xA()` (setAppState) to modify voiceWarmingUp

---

## 13. Plan Mode Integration

### Keyboard Shortcuts in Plan Mode

Plan mode provides specialized keybindings for interview-style question answering:

| Keybinding | Action | Context |
|------------|--------|---------|
| `tab` | `plan:nextQuestion` | Plan |
| `shift+tab` | `plan:previousQuestion` | Plan |
| `enter` | `plan:submitAnswer` | Plan |
| `escape` | `plan:cancel` | Plan |
| `ctrl+g` | `plan:edit` | Plan |

### Plan Mode Context Registration

The Plan component registers its context when active:

```javascript
// ============================================
// Plan mode context registration pattern
// Location: chunks.190.mjs (inferred)
// ============================================

// ORIGINAL (for source lookup):
q36("Plan");

// READABLE (for understanding):
useRegisterContext("Plan");

// Enables plan-specific keybindings while the plan interview is active
```

---

## 14. Compact Mode Integration

### Toggle Compact Mode

The `chat:compactToggle` action allows keyboard control over compact mode:

```javascript
// Example: Toggle compact mode from Chat context
keybindingContext.registerHandler({
    action: "chat:compactToggle",
    context: "Chat",
    handler: () => {
        setCompactEnabled(!compactEnabled);
    }
});
```

---

## 15. Permission Dialog Integration

### Permission Dialog Keybindings

Permission dialogs use the Confirmation context with specialized actions:

| Keybinding | Action | Description |
|------------|--------|-------------|
| `y` / `enter` | `confirm:yes` | Grant permission |
| `n` / `escape` | `confirm:no` | Deny permission |
| `tab` | `confirm:nextField` | Navigate between fields |
| `space` | `confirm:toggle` | Toggle checkbox options |
| `ctrl+e` | `confirm:toggleExplanation` | Show/hide explanation |
| `ctrl+d` | `permission:toggleDebug` | Toggle debug mode |

### Permission Mode Cycling

The `confirm:cycleMode` action allows cycling between permission modes:

```javascript
// Cycles through: "allow once" → "allow always" → "deny" → ...
```

---

## 16. State Management Integration

### Keybinding State in Redux-like Store

Keybinding state integrates with the application state management:

```javascript
// ============================================
// Keybinding state structure
// Location: chunks.117.mjs:1882-1894
// ============================================

// State managed by KeybindingSetup component:
const keybindingState = {
    bindings: FlatBinding[],     // Current merged bindings
    warnings: ValidationWarning[], // Validation issues
    pendingChord: Keystroke[] | null, // Current chord sequence
    activeContexts: Set<string>,  // Registered contexts
    handlerRegistry: Map<action, Set<{context, handler}>>
};
```

### Cross-Component State Sharing

The KeybindingContext provides shared state to all child components:

```javascript
// Context value structure
const contextValue = {
    bindings,                  // FlatBinding[]
    pendingChord,              // Keystroke[] | null
    setPendingChord,           // (pending) => void
    activeContexts,            // Set<string>
    registerActiveContext,     // (name) => void
    unregisterActiveContext,   // (name) => void
    handlerRegistryRef,        // React.MutableRefObject<Map>
    resolve,                   // (input, key, contexts) => MatchResult
    getDisplayText,            // (action, context) => string
    registerHandler,           // (handlerInfo) => cleanup
    invokeAction               // (action) => boolean
};
```

---

## 17. Error Recovery Integration

### Graceful Degradation on Config Errors

When keybindings.json has errors, the system gracefully degrades:

```javascript
// ============================================
// Error recovery in keybinding loader
// Location: chunks.89.mjs:3187-3199
// ============================================

// ORIGINAL (for source lookup):
} catch (K) {
    if (au9(K) && K.code === "ENOENT") return {
        bindings: A,
        warnings: []
    };
    return k(`[keybindings] Error loading ${q}: ${_1(K)}`), {
        bindings: A,
        warnings: [{
            type: "parse_error",
            severity: "error",
            message: `Failed to parse keybindings.json: ${_1(K)}`
        }]
    }
}

// READABLE (for understanding):
} catch (error) {
    // File not found - use defaults silently
    if (error.code === "ENOENT") {
        return { bindings: defaultBindings, warnings: [] };
    }

    // Parse error - use defaults but show warning
    debug(`[keybindings] Error loading ${configPath}: ${formatError(error)}`);
    return {
        bindings: defaultBindings,
        warnings: [{
            type: "parse_error",
            severity: "error",
            message: `Failed to parse keybindings.json: ${formatError(error)}`
        }]
    };
}

// Mapping: K→error, A→defaultBindings, q→configPath, au9→isNodeError, _1→formatError
```

**Key insight**: The system always returns valid bindings (defaults), ensuring the application remains usable even with broken configuration.

---

## 18. System Reminder Integration

### Overview

The keybinding system integrates with the System Reminder subsystem (04_system_reminder) to display keyboard hints to users. This integration enables contextual keybinding hints to appear in the assistant's responses, guiding users toward relevant shortcuts.

**Cross-reference**: [integration_points.md](../04_system_reminder/integration_points.md) for System Reminder architecture.

### Keybinding Display Text Hook

The `useKeybindingDisplayText` hook (Rq) is the primary interface for components to retrieve display-friendly keybinding text:

```javascript
// ============================================
// Rq - useKeybindingDisplayText - Display text hook wrapper
// Location: chunks.65.mjs:1191-1205
// ============================================

// ORIGINAL (for source lookup):
function Rq(A, q, K) {
    let Y = PX(A, q, K);
    return Y === void 0 ? "" : Y
}

// READABLE (for understanding):
function useKeybindingDisplayText(action, context, fallback) {
    let displayText = useKeybindingDisplayTextSync(action, context, fallback);
    return displayText === undefined ? "" : displayText;
}

// Mapping: Rq→useKeybindingDisplayText, A→action, q→context, K→fallback, Y→displayText, PX→useKeybindingDisplayTextSync
```

### Synchronous Display Text with Telemetry

The `PX` function (useKeybindingDisplayTextSync) performs the actual lookup with telemetry tracking for fallback scenarios:

```javascript
// ============================================
// PX - useKeybindingDisplayTextSync - Core lookup with telemetry
// Location: chunks.90.mjs:69-83
// ============================================

// ORIGINAL (for source lookup):
function PX(A, q, K) {
    let Y = m34(),
        z = P$1(A, q, Y);
    if (z === void 0) {
        let _ = `${A}:${q}`;
        if (!p34.has(_)) p34.add(_), d("tengu_keybinding_fallback_used", {
            action: A,
            context: q,
            fallback: K,
            reason: "action_not_found"
        });
        return K
    }
    return z
}

// READABLE (for understanding):
function useKeybindingDisplayTextSync(action, context, fallback) {
    // STEP 1: Get cached bindings from global state
    let bindings = getCachedBindings();

    // STEP 2: Find keybinding for this action (returns stringified chord)
    // P$1 already calls D$1(stringifyChord) internally
    let displayText = findKeybindingForAction(action, context, bindings);

    // STEP 3: No binding found - track telemetry and return fallback
    if (displayText === undefined) {
        let key = `${action}:${context}`;

        // Track fallback usage once per session per action:context pair
        // p34 is a Set that persists across calls
        if (!fallbackTelemetrySent.has(key)) {
            fallbackTelemetrySent.add(key);
            sendTelemetryEvent("tengu_keybinding_fallback_used", {
                action: action,
                context: context,
                fallback: fallback,
                reason: "action_not_found"
            });
        }
        return fallback;
    }

    // STEP 4: Return the formatted chord string (e.g., "Ctrl+K Ctrl+C")
    return displayText;
}

// Mapping: PX→useKeybindingDisplayTextSync, A→action, q→context, K→fallback, Y→bindings, z→displayText, m34→getCachedBindings, P$1→findKeybindingForAction, p34→fallbackTelemetrySent, d→sendTelemetryEvent
```

**Key insight - Telemetry Deduplication:**
The telemetry event `tengu_keybinding_fallback_used` is sent at most once per session per action:context pair (tracked via the `p34` Set). This prevents telemetry spam while still providing insights into which actions lack proper keybindings.

### Integration Flow Diagram

```
Component needs keybinding hint
              │
              ▼
    useKeybindingDisplayText(action)
              │
              ▼
    useKeybindingDisplayTextSync(action)
              │
              ▼
    getCachedBindings() ──────────────┐
              │                          │
              ▼                          │
    findKeybindingForAction(action, context, bindings)
              │                          │
              ▼                          │
    ┌─────────────────────┐              │
    │ Binding found?      │              │
    └─────────────────────┘              │
         │           │                   │
        YES          NO                  │
         │           │                   │
         ▼           ▼                   │
  Return chord    Send telemetry         │
  stringified     Return fallback        │
         │           │                   │
         ▼           ▼                   │
    Return "Ctrl+K"  Return "Ctrl+D"     │
              │                          │
              ▼                          │
    System Reminder Injection ◄──────────┘
              │
              ▼
    Display in assistant response
```

### System Reminder Injection Pattern

Keybinding hints are injected into system reminders through the integration documented in `04_system_reminder/integration_points.md`:

```javascript
// ============================================
// Example: Keybinding hint injection into system reminder
// Location: chunks.73.mjs (inferred pattern)
// ============================================

// When constructing a system reminder for tool permission:
const keybindingHint = useKeybindingDisplayText(
    "permission:toggleDebug",
    "Confirmation",
    "ctrl+d"  // fallback if no binding found
);

const systemReminderContent = {
    type: "permission_request",
    tool: "Bash",
    hints: {
        keyboardShortcut: keybindingHint, // "Ctrl+D"
        description: "Press Ctrl+D to toggle debug mode"
    }
};

// This gets injected into the conversation as a system message
```

### Telemetry Event: tengu_keybinding_fallback_used

**Purpose**: Track when a keybinding lookup returns an empty result, indicating missing keybinding configuration.

**Event Properties**:

| Property | Type | Description |
|----------|------|-------------|
| `action` | string | The action that had no keybinding |
| `context` | string | The context where the action was looked up |
| `fallback` | string | The fallback value returned |
| `reason` | string | Always "action_not_found" |

**Deduplication**: One event per session per action:context pair (tracked via `p34` Set).

**Use case**: Product analytics to identify which actions need default keybindings added.

### Cross-Reference: Integration Points

| Integration Point | Symbol | Description |
|-------------------|--------|-------------|
| Display text hook | `Rq` | Wrapper that returns empty string on undefined |
| Sync display text | `PX` | Core lookup with telemetry |
| Find binding | `P$1` | Reverse lookup action → chord string |
| Stringify chord | `D$1` | Convert keystroke array to display string |
| Get cached bindings | `m34` | Access global bindings cache |
| Telemetry send | `d` | Send telemetry event |
| Fallback tracking | `p34` | Set tracking sent telemetry events |

---

## 19. Accessibility Considerations

### Keyboard-Only Navigation

The keybinding system is designed for full keyboard accessibility:

1. **All actions accessible via keyboard**: No mouse-required operations
2. **Context-aware shortcuts**: Different contexts have appropriate keybindings
3. **Visual feedback**: Chord indicators and hints guide users
4. **Escape always cancels**: Consistent cancellation pattern

### Screen Reader Compatibility

While Ink (the TUI framework) has limited screen reader support, the keybinding system provides:

- Consistent keybinding patterns across contexts
- Clear action naming conventions
- Help modal showing all available shortcuts

---

## Summary

The keybinding system serves as a central coordination layer for keyboard input across all Claude Code features:

1. **Ink Integration**: Captures raw terminal input and routes to handlers
2. **Context System**: 18 contexts enable context-aware keybindings
3. **Action Registry**: Decouples keybinding definitions from handler implementations
4. **Cross-Feature Integration**: Seamless integration with 18+ subsystems
5. **Voice PTT**: Innovative repeated-keypress activation for push-to-talk
6. **Hot-Reload**: Configuration changes apply immediately without restart
7. **System Reminder Integration**: Keybinding hints injected into assistant responses with telemetry
8. **Graceful Degradation**: Errors fall back to defaults, maintaining usability

**Integration Count**: 19 subsystems documented (Ink, Help Dialog, Notifications, File Watcher, Agent Teams, Chat Input, Auto-Complete, Vim Mode, Diff Viewer, Image Paste, URL Detection, Message Selection, MCP Tools, Voice PTT, Plan Mode, Compact Mode, Permission Dialog, State Management, System Reminder)

**Last Updated**: 2026-03-23 (Claude Code v2.1.76)
