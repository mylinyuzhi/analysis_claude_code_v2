# Focus System and Multi-Pane Navigation

## Overview

Claude Code's TUI employs a sophisticated dual-layer focus system that coordinates keyboard input across multiple UI components. The system combines:

1. **Focus Management Layer** - Controls which component receives Tab/Shift+Tab traversal
2. **Context Layer** - 18 named contexts that filter keybinding activation based on UI state

This architecture allows different panes (Chat, Autocomplete, Settings, etc.) to coexist while ensuring keystrokes are routed to the appropriate handlers based on what's currently active.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI Components

Key functions in this document:
- `KeybindingSetup` (aj) - Initializes context tracking system
- `KeybindingHandler` (N4Y) - Processes keystrokes with context filtering
- `useRegisterContext` (f$1) - Hook for registering active contexts
- `KeybindingContext` (G$1) - React context provider for keybinding state
- `resolveKeystroke` (Z$1) - Matches keystrokes against active contexts
- `VALID_CONTEXTS` (Gq7) - Array of all 18 supported contexts
- `addFocusable` - Registers component in focus traversal list
- `activateFocusable` - Marks component as available for focus
- `deactivateFocusable` - Removes component from focus pool
- `removeFocusable` - Unregisters component from focus system
- `focusNext` - Advances focus to next active component (Tab)
- `focusPrevious` - Moves focus to previous component (Shift+Tab)
- `focus` - Direct focus assignment by component ID

---

## 1. Focus System Architecture

### 1.1 Focus State Structure

The Ink-based TUI maintains focus state at the application root level, tracking which UI components can receive focus and which one is currently active.

```javascript
// ============================================
// FocusState - Application-level focus tracking
// Location: chunks.73.mjs:33-38
// ============================================

// ORIGINAL (for source lookup):
state = {
    isFocusEnabled: !0,
    activeFocusId: void 0,
    focusables: [],
    error: void 0
};

// READABLE (for understanding):
state = {
    isFocusEnabled: true,          // Global focus enable/disable flag
    activeFocusId: undefined,       // ID of currently focused component
    focusables: [],                 // Array<{id: string, isActive: boolean}>
    error: undefined                // Error state if focus system fails
};

// Mapping: !0→true, void 0→undefined
```

**Key insight**: The `focusables` array maintains registration order, which determines Tab traversal sequence. Each entry has an `isActive` flag allowing temporary exclusion without full removal.

### 1.2 Focus Lifecycle

Components follow a four-stage lifecycle when participating in focus management:

**Stage 1: Registration (`addFocusable`)**

```javascript
// ============================================
// addFocusable - Register component for focus traversal
// Location: chunks.73.mjs:204-218
// ============================================

// ORIGINAL (for source lookup):
addFocusable = (A, {
    autoFocus: q
}) => {
    this.setState((K) => {
        let Y = K.activeFocusId;
        if (!Y && q) Y = A;
        return {
            activeFocusId: Y,
            focusables: [...K.focusables, {
                id: A,
                isActive: !0
            }]
        }
    })
};

// READABLE (for understanding):
addFocusable = (componentId, { autoFocus }) => {
    this.setState((currentState) => {
        let newActiveFocusId = currentState.activeFocusId;

        // If nothing is focused and autoFocus is requested, focus this component
        if (!newActiveFocusId && autoFocus) {
            newActiveFocusId = componentId;
        }

        return {
            activeFocusId: newActiveFocusId,
            focusables: [...currentState.focusables, {
                id: componentId,
                isActive: true
            }]
        };
    });
};

// Mapping: A→componentId, q→autoFocus, K→currentState, Y→newActiveFocusId, !0→true
```

**Why this approach:**
- Components are appended to the array, preserving visual/logical Tab order
- `autoFocus` enables modal dialogs to grab focus immediately on mount
- Registration doesn't automatically activate focus unless no other component has it

**Stage 2: Activation (`activateFocusable`)**

```javascript
// ============================================
// activateFocusable - Mark component as available for focus
// Location: chunks.73.mjs:227-237
// ============================================

// ORIGINAL (for source lookup):
activateFocusable = (A) => {
    this.setState((q) => ({
        focusables: q.focusables.map((K) => {
            if (K.id !== A) return K;
            return {
                id: A,
                isActive: !0
            }
        })
    }))
};

// READABLE (for understanding):
activateFocusable = (componentId) => {
    this.setState((currentState) => ({
        focusables: currentState.focusables.map((focusable) => {
            if (focusable.id !== componentId) return focusable;

            return {
                id: componentId,
                isActive: true
            };
        })
    }));
};

// Mapping: A→componentId, q→currentState, K→focusable, !0→true
```

**Stage 3: Deactivation (`deactivateFocusable`)**

```javascript
// ============================================
// deactivateFocusable - Temporarily disable component focus
// Location: chunks.73.mjs:238-249
// ============================================

// ORIGINAL (for source lookup):
deactivateFocusable = (A) => {
    this.setState((q) => ({
        activeFocusId: q.activeFocusId === A ? void 0 : q.activeFocusId,
        focusables: q.focusables.map((K) => {
            if (K.id !== A) return K;
            return {
                id: A,
                isActive: !1
            }
        })
    }))
};

// READABLE (for understanding):
deactivateFocusable = (componentId) => {
    this.setState((currentState) => ({
        // Clear active focus if this component had it
        activeFocusId: currentState.activeFocusId === componentId
            ? undefined
            : currentState.activeFocusId,

        // Mark component as inactive in registry
        focusables: currentState.focusables.map((focusable) => {
            if (focusable.id !== componentId) return focusable;

            return {
                id: componentId,
                isActive: false
            };
        })
    }));
};

// Mapping: A→componentId, q→currentState, K→focusable, void 0→undefined, !1→false
```

**Design rationale**: Deactivation keeps the component registered but skips it during Tab traversal. This is crucial for:
- Components that are mounted but currently hidden (e.g., collapsed panels)
- Temporarily disabled UI elements that may re-enable without remount
- Preserving Tab order without requiring re-registration

**Stage 4: Removal (`removeFocusable`)**

```javascript
// ============================================
// removeFocusable - Unregister component completely
// Location: chunks.73.mjs:219-226
// ============================================

// ORIGINAL (for source lookup):
removeFocusable = (A) => {
    this.setState((q) => ({
        activeFocusId: q.activeFocusId === A ? void 0 : q.activeFocusId,
        focusables: q.focusables.filter((K) => {
            return K.id !== A
        })
    }))
};

// READABLE (for understanding):
removeFocusable = (componentId) => {
    this.setState((currentState) => ({
        // Clear active focus if this component had it
        activeFocusId: currentState.activeFocusId === componentId
            ? undefined
            : currentState.activeFocusId,

        // Remove from registry entirely
        focusables: currentState.focusables.filter((focusable) => {
            return focusable.id !== componentId;
        })
    }));
};

// Mapping: A→componentId, q→currentState, K→focusable, void 0→undefined
```

### 1.3 Focus Traversal

**Tab Key (Forward Traversal)**

```javascript
// ============================================
// focusNext - Advance to next active focusable
// Location: chunks.73.mjs:188-195
// ============================================

// ORIGINAL (for source lookup):
focusNext = () => {
    this.setState((A) => {
        let q = A.focusables.find((Y) => Y.isActive)?.id;
        return {
            activeFocusId: this.findNextFocusable(A) ?? q
        }
    })
};

// READABLE (for understanding):
focusNext = () => {
    this.setState((currentState) => {
        // Find first active focusable as fallback
        let fallbackId = currentState.focusables.find(
            (focusable) => focusable.isActive
        )?.id;

        return {
            activeFocusId: this.findNextFocusable(currentState) ?? fallbackId
        };
    });
};

// Mapping: A→currentState, q→fallbackId, Y→focusable
```

**Shift+Tab (Backward Traversal)**

```javascript
// ============================================
// focusPrevious - Move to previous active focusable
// Location: chunks.73.mjs:196-203
// ============================================

// ORIGINAL (for source lookup):
focusPrevious = () => {
    this.setState((A) => {
        let q = A.focusables.findLast((Y) => Y.isActive)?.id;
        return {
            activeFocusId: this.findPreviousFocusable(A) ?? q
        }
    })
};

// READABLE (for understanding):
focusPrevious = () => {
    this.setState((currentState) => {
        // Find last active focusable as fallback
        let fallbackId = currentState.focusables.findLast(
            (focusable) => focusable.isActive
        )?.id;

        return {
            activeFocusId: this.findPreviousFocusable(currentState) ?? fallbackId
        };
    });
};

// Mapping: A→currentState, q→fallbackId, Y→focusable
```

**Trade-offs made:**
- Linear search through `focusables` array is O(n), but typical TUI has <10 focusable components
- Fallback to first/last active component ensures focus never gets "stuck" even if current index is invalid
- Uses `findLast` for backward traversal to handle edge cases where multiple components share the same activation state

### 1.4 Direct Focus Assignment

```javascript
// ============================================
// focus - Direct focus to specific component by ID
// Location: chunks.73.mjs:180-187
// ============================================

// ORIGINAL (for source lookup):
focus = (A) => {
    this.setState((q) => {
        if (!q.focusables.some((Y) => Y?.id === A)) return q;
        return {
            activeFocusId: A
        }
    })
};

// READABLE (for understanding):
focus = (componentId) => {
    this.setState((currentState) => {
        // Validate component is registered before focusing
        if (!currentState.focusables.some((focusable) => focusable?.id === componentId)) {
            return currentState; // No-op if component not found
        }

        return {
            activeFocusId: componentId
        };
    });
};

// Mapping: A→componentId, q→currentState, Y→focusable
```

**What's the clever part**: Direct focus bypasses the `isActive` check, allowing programmatic focus even on deactivated components. This supports scenarios like:
- Modal dialogs that grab focus regardless of previous state
- Error messages that force focus to specific input fields
- Accessibility features that jump to specific UI regions

---

## 2. Context System (18 Contexts)

### 2.1 Context Registry

The keybinding system defines 18 named contexts that control which keybindings are active based on current UI state:

```javascript
// ============================================
// VALID_CONTEXTS - Complete list of supported contexts
// Location: chunks.54.mjs:1598
// ============================================

// ORIGINAL (for source lookup):
Gq7 = ["Global", "Chat", "Autocomplete", "Confirmation", "Help", "Transcript", "HistorySearch", "Task", "ThemePicker", "Settings", "Tabs", "Attachments", "Footer", "MessageSelector", "DiffDialog", "ModelPicker", "Select", "Plugin"]

// READABLE (for understanding):
VALID_CONTEXTS = [
    "Global",           // Always active - base layer bindings
    "Chat",             // Main chat input area
    "Autocomplete",     // Suggestion dropdown active
    "Confirmation",     // Permission/approval dialogs
    "Help",             // Help overlay
    "Transcript",       // Transcript viewer pane
    "HistorySearch",    // Ctrl+R command history search
    "Task",             // Task/todo list view
    "ThemePicker",      // Theme selection UI
    "Settings",         // Settings menu
    "Tabs",             // Tab navigation UI
    "Attachments",      // File attachment manager
    "Footer",           // Bottom status bar
    "MessageSelector",  // Message navigation mode
    "DiffDialog",       // Diff viewer overlay
    "ModelPicker",      // Model selection dropdown
    "Select",           // Generic select/dropdown
    "Plugin"            // Plugin management UI
];

// Mapping: Gq7→VALID_CONTEXTS
```

### 2.2 Context Activation Patterns

Each context represents a UI component that can register itself as active when visible/focused:

| Context | Activation Trigger | Component Owner | Common Keybindings |
|---------|-------------------|-----------------|-------------------|
| **Global** | Always active | Application root | `ctrl+c` (interrupt), `ctrl+d` (exit), `ctrl+o` (toggle transcript) |
| **Chat** | Chat input has focus | Main REPL input | `enter` (submit), `up/down` (history), `escape` (cancel) |
| **Autocomplete** | Suggestions visible | Autocomplete dropdown | `tab` (accept), `up/down` (navigate), `escape` (dismiss) |
| **Confirmation** | Permission dialog shown | Permission modal | `y/n` (yes/no), `tab` (next field), `space` (toggle) |
| **Help** | Help overlay visible | Help screen | `escape` (dismiss) |
| **Transcript** | Transcript pane open | Transcript viewer | `ctrl+e` (toggle show all), `escape` (exit) |
| **HistorySearch** | Ctrl+R pressed | History search UI | `ctrl+r` (next), `enter` (execute), `escape` (accept) |
| **Task** | Task view focused | Task manager | `ctrl+b` (background task) |
| **ThemePicker** | Theme UI open | Theme selector | `ctrl+t` (toggle syntax highlighting) |
| **Settings** | Settings menu open | Settings screen | `j/k` (navigate), `enter` (accept), `/` (search) |
| **Tabs** | Tab bar focused | Tab navigation | `tab/shift+tab` (cycle tabs), `left/right` (navigate) |
| **Attachments** | Attachment area focused | Attachment manager | `left/right` (navigate), `backspace/delete` (remove) |
| **Footer** | Footer bar focused | Status bar | `left/right` (navigate items), `enter` (open selected) |
| **MessageSelector** | Message nav mode | Message selector | `j/k` (up/down), `enter` (select) |
| **DiffDialog** | Diff overlay shown | Diff viewer | `left/right` (prev/next source), `up/down` (files) |
| **ModelPicker** | Model menu open | Model selector | `left/right` (adjust effort level) |
| **Select** | Generic select active | Generic dropdown | `up/down` (navigate), `enter` (accept), `escape` (cancel) |
| **Plugin** | Plugin screen open | Plugin manager | `space` (toggle), `i` (install) |

### 2.3 Context Registration Hook

Components register their context activation state using the `useRegisterContext` hook:

```javascript
// ============================================
// useRegisterContext - React hook for context lifecycle management
// Location: chunks.65.mjs:800-815
// ============================================

// ORIGINAL (for source lookup):
function f$1(A, q) {
    let K = A6(5),
        Y = q === void 0 ? !0 : q,
        z = Wv(),
        w, H;
    if (K[0] !== A || K[1] !== Y || K[2] !== z) w = () => {
        if (!z || !Y) return;
        return z.registerActiveContext(A), () => {
            z.unregisterActiveContext(A)
        }
    }, H = [A, z, Y], K[0] = A, K[1] = Y, K[2] = z, K[3] = w, K[4] = H;
    else w = K[3], H = K[4];
    uX6.useLayoutEffect(w, H)
}

// READABLE (for understanding):
function useRegisterContext(contextName, isActive) {
    let memoizedState = e(5),  // React optimization state array
        shouldRegister = isActive === undefined ? true : isActive,
        keybindingContext = useKeybindingContext(),
        effectCallback, dependencies;

    // Recompute effect if inputs changed
    if (memoizedState[0] !== contextName ||
        memoizedState[1] !== shouldRegister ||
        memoizedState[2] !== keybindingContext) {

        effectCallback = () => {
            // Skip if context not available or explicitly disabled
            if (!keybindingContext || !shouldRegister) return;

            // Register on mount
            keybindingContext.registerActiveContext(contextName);

            // Return cleanup function to unregister on unmount
            return () => {
                keybindingContext.unregisterActiveContext(contextName);
            };
        };

        dependencies = [contextName, keybindingContext, shouldRegister];

        // Cache computed values
        memoizedState[0] = contextName;
        memoizedState[1] = shouldRegister;
        memoizedState[2] = keybindingContext;
        memoizedState[3] = effectCallback;
        memoizedState[4] = dependencies;
    } else {
        // Use cached values
        effectCallback = memoizedState[3];
        dependencies = memoizedState[4];
    }

    // useLayoutEffect ensures registration happens before paint
    React.useLayoutEffect(effectCallback, dependencies);
}

// Mapping: f$1→useRegisterContext, A→contextName, q→isActive, K→memoizedState, Y→shouldRegister, z→keybindingContext, w→effectCallback, H→dependencies, Wv→useKeybindingContext, uX6→React, !0→true
```

**How it works:**
1. Component calls `useRegisterContext("Chat", isChatVisible)` in its render function
2. Hook adds "Chat" to the `activeContexts` Set when `isChatVisible` becomes `true`
3. Hook returns cleanup function that removes "Chat" from the Set when component unmounts or `isChatVisible` becomes `false`
4. Keybinding system filters actions based on current Set contents

**Why `useLayoutEffect`**: Registration must complete before the first paint to prevent a frame where keystrokes aren't handled. Using `useEffect` could create a 1-frame window where keybindings don't work.

**Example usage** (from ThemePicker component):

```javascript
// ============================================
// ThemePicker context registration example
// Location: chunks.153.mjs:1252
// ============================================

// ORIGINAL (for source lookup):
f$1("ThemePicker");

// READABLE (for understanding):
useRegisterContext("ThemePicker");

// Component registers "ThemePicker" context while mounted,
// enabling ctrl+t for syntax highlighting toggle
```

**Example with conditional activation** (from Autocomplete component):

```javascript
// ============================================
// Autocomplete conditional context registration
// Location: chunks.183.mjs:498
// ============================================

// ORIGINAL (for source lookup):
f$1("Autocomplete", Y1)

// READABLE (for understanding):
let hasAutocomplete = suggestions.length > 0 || hasPendingRequest;
useRegisterContext("Autocomplete", hasAutocomplete);

// Context only active when suggestions are actually shown
// Y1 = hasAutocomplete based on upstream logic
```

---

## 3. Multi-Pane Coordination

### 3.1 Context Priority and Stacking

When multiple contexts are active simultaneously, the keybinding resolver uses a **merging strategy** rather than strict priority:

```javascript
// ============================================
// KeybindingHandler context collection logic
// Location: chunks.117.mjs:980-1000
// ============================================

// ORIGINAL (for source lookup):
$ = (_, J, X) => {
    let D = H.current,
        j = new Set;
    if (D)
        for (let G of D.values())
            for (let f of G) j.add(f.context);
    let M = [...j, ...w, "Global"],
        P = Y.current !== null,
        W = Z$1(_, J, M, K, Y.current);

// READABLE (for understanding):
handleKeystroke = (rawInput, keyInfo, eventObject) => {
    let handlerRegistry = handlerRegistryRef.current,
        contextsFromHandlers = new Set();

    // Collect all contexts that have registered handlers
    if (handlerRegistry) {
        for (let handlersForAction of handlerRegistry.values()) {
            for (let handler of handlersForAction) {
                contextsFromHandlers.add(handler.context);
            }
        }
    }

    // Merge: registered handlers + explicitly active contexts + Global
    let activeContextsList = [
        ...contextsFromHandlers,
        ...activeContextsSet,
        "Global"
    ];

    let isChordInProgress = pendingChordRef.current !== null;
    let resolution = resolveKeystroke(
        rawInput,
        keyInfo,
        activeContextsList,
        bindings,
        pendingChordRef.current
    );
    // ... handle resolution result
};

// Mapping: $→handleKeystroke, _→rawInput, J→keyInfo, X→eventObject, D→handlerRegistry, H→handlerRegistryRef, j→contextsFromHandlers, G→handlersForAction, f→handler, M→activeContextsList, w→activeContextsSet, P→isChordInProgress, Y→pendingChordRef, K→bindings, W→resolution, Z$1→resolveKeystroke
```

**Design rationale:**
- All active contexts participate in matching, not just the "top" one
- "Global" is always included, ensuring base keybindings like `ctrl+c` work everywhere
- Handler-registered contexts are merged in, allowing programmatic context activation
- No strict priority means bindings can be shared across contexts (e.g., `escape` often means "cancel/dismiss")

**Trade-off**: If two active contexts bind the same keystroke to different actions, the **last matching binding** in the array wins. This is deterministic but requires careful binding design.

### 3.2 Context Filtering in Resolution

The `resolveKeystroke` function filters bindings by active contexts before matching:

```javascript
// ============================================
// resolveKeystroke - Match keystroke against active contexts
// Location: chunks.65.mjs:758-795
// ============================================

// ORIGINAL (for source lookup):
function Z$1(A, q, K, Y, z) {
    if (q.escape && z !== null) return {
        type: "chord_cancelled"
    };
    let w = Hl3(A, q);
    if (!w) {
        if (z !== null) return {
            type: "chord_cancelled"
        };
        return {
            type: "none"
        }
    }
    let H = z ? [...z, w] : [w],
        $ = Y.filter((J) => K.includes(J.context));
    if ($.some((J) => J.chord.length > H.length && jl3(H, J))) return {
        type: "chord_started",
        pending: H
    };
    let _;
    for (let J of $)
        if (Jl3(H, J)) _ = J;
    if (_) {
        if (_.action === null) return {
            type: "unbound"
        };
        return {
            type: "match",
            action: _.action
        }
    }
    if (z !== null) return {
        type: "chord_cancelled"
    };
    return {
        type: "none"
    }
}

// READABLE (for understanding):
function resolveKeystroke(
    rawInput,
    keyInfo,
    activeContextsList,
    allBindings,
    pendingChord
) {
    // Escape always cancels chords in progress
    if (keyInfo.escape && pendingChord !== null) {
        return { type: "chord_cancelled" };
    }

    // Convert raw input to normalized keystroke
    let keystroke = eventToKeystroke(rawInput, keyInfo);
    if (!keystroke) {
        // Invalid keystroke - cancel chord if in progress
        if (pendingChord !== null) {
            return { type: "chord_cancelled" };
        }
        return { type: "none" };
    }

    // Build complete chord sequence
    let chordSequence = pendingChord ? [...pendingChord, keystroke] : [keystroke];

    // Filter bindings to only those from active contexts
    let candidateBindings = allBindings.filter(
        (binding) => activeContextsList.includes(binding.context)
    );

    // Check if this keystroke starts a multi-key chord
    if (candidateBindings.some((binding) =>
        binding.chord.length > chordSequence.length &&
        isPrefixMatch(chordSequence, binding)
    )) {
        return {
            type: "chord_started",
            pending: chordSequence
        };
    }

    // Find exact match in filtered bindings
    let matchedBinding;
    for (let binding of candidateBindings) {
        if (isExactMatch(chordSequence, binding)) {
            matchedBinding = binding;
        }
    }

    if (matchedBinding) {
        // Null action = explicitly unbound
        if (matchedBinding.action === null) {
            return { type: "unbound" };
        }
        return {
            type: "match",
            action: matchedBinding.action
        };
    }

    // No match - cancel chord if in progress
    if (pendingChord !== null) {
        return { type: "chord_cancelled" };
    }

    return { type: "none" };
}

// Mapping: Z$1→resolveKeystroke, A→rawInput, q→keyInfo, K→activeContextsList, Y→allBindings, z→pendingChord, w→keystroke, H→chordSequence, $→candidateBindings, J→binding, _→matchedBinding, Hl3→eventToKeystroke, jl3→isPrefixMatch, Jl3→isExactMatch
```

**Step-by-step logic:**

1. **Chord cancellation check**: Escape key always cancels in-progress chords
2. **Keystroke normalization**: Convert raw terminal input to standard format (e.g., "ctrl+c")
3. **Chord sequence building**: Append to pending chord or start new sequence
4. **Context filtering**: `allBindings.filter(...)` removes bindings from inactive contexts
5. **Prefix matching**: Check if keystroke starts a multi-key sequence (e.g., "ctrl+k" in "ctrl+k ctrl+t")
6. **Exact matching**: Linear search for complete chord match
7. **Fallback handling**: Invalid matches cancel chords or return "none"

**Why last-match-wins in the loop**: The `for` loop doesn't `break` on first match, allowing later bindings to override earlier ones. This supports customization where user bindings (loaded last) override defaults.

### 3.3 Component Focus vs Context Activation

**Critical distinction**: Focus and context are orthogonal systems:

- **Focus** determines which component receives raw keystroke events (Tab/Shift+Tab traversal)
- **Context** filters which keybindings are eligible for matching

**Example scenario:**

```
State: Chat input has focus, Autocomplete dropdown is visible

Focus State:
  activeFocusId: "chat-input"

Context State:
  activeContexts: Set(["Chat", "Autocomplete", "Global"])

Keystroke: Tab

Resolution:
  1. Focus system intercepts Tab first (chunks.73.mjs:141)
  2. If NOT consumed by focus traversal, flows to keybinding handler
  3. Handler checks activeContexts: ["Chat", "Autocomplete", "Global"]
  4. Tab matches "Autocomplete" context binding → "autocomplete:accept"
  5. Autocomplete accepts suggestion, closes dropdown
  6. Next Tab would trigger focus traversal since Autocomplete context is gone
```

**Why this design**: Separating focus and context allows:
- Components to control their own keybindings without fighting focus system
- Multiple overlapping contexts (e.g., Chat + Autocomplete) to coexist
- Global keybindings to work regardless of focus state

---

## 4. Focus Interactions with Keybindings

### 4.1 Keystroke Event Flow

Terminal input flows through multiple layers before reaching application logic:

```
Raw TTY Input (stdin)
    ↓
[Ink Key Parser] - Parse escape sequences
    ↓
[Focus System Handler] - handleInput (chunks.73.mjs:135-144)
    ↓
  ┌─→ ctrl+c → handleExit() (if exitOnCtrlC enabled)
  │
  ├─→ Escape → Clear activeFocusId
  │
  ├─→ Tab → focusNext() (if isFocusEnabled)
  │
  ├─→ Shift+Tab → focusPrevious() (if isFocusEnabled)
  │
  └─→ All other keys → Pass to KeybindingHandler
         ↓
    [Context Resolution] - resolveKeystroke (chunks.53.mjs:2942)
         ↓
    [Handler Registry Lookup] - Find action handler
         ↓
    [Action Execution] - handler()
```

### 4.2 Focus System Input Handler

```javascript
// ============================================
// handleInput - Focus-level keystroke interception
// Location: chunks.73.mjs:135-144
// ============================================

// ORIGINAL (for source lookup):
handleInput = (A) => {
    if (A === "\x03" && this.props.exitOnCtrlC) this.handleExit();
    if (A === eq9 && this.state.activeFocusId) this.setState({
        activeFocusId: void 0
    });
    if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
        if (A === sq9) this.focusNext();
        if (A === tq9) this.focusPrevious()
    }
};

// READABLE (for understanding):
handleInput = (rawInput) => {
    // ctrl+c exits application if configured
    if (rawInput === "\x03" && this.props.exitOnCtrlC) {
        this.handleExit();
    }

    // Escape clears current focus
    if (rawInput === ESCAPE_KEY && this.state.activeFocusId) {
        this.setState({
            activeFocusId: undefined
        });
    }

    // Tab/Shift+Tab traverse focusables (if system enabled and components exist)
    if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
        if (rawInput === TAB_KEY) {
            this.focusNext();
        }
        if (rawInput === SHIFT_TAB_KEY) {
            this.focusPrevious();
        }
    }
};

// Mapping: A→rawInput, eq9→ESCAPE_KEY, sq9→TAB_KEY, tq9→SHIFT_TAB_KEY, void 0→undefined
```

**Key insight**: Tab/Shift+Tab are **consumed** by the focus system and never reach the keybinding handler. This prevents conflicts with context-specific Tab bindings (like Autocomplete).

**Trade-offs:**
- Focus traversal takes precedence over keybindings (no way to rebind Tab globally)
- Simple implementation, but less flexible than allowing Tab to be context-aware
- Escape clears focus but also propagates to keybinding system (allows "escape to dismiss" in contexts)

### 4.3 Context-Based Handler Invocation

When a keystroke matches an action, the handler registry is queried for callbacks:

```javascript
// ============================================
// invokeAction - Execute handler from registry based on context
// Location: chunks.53.mjs:3015-3023
// ============================================

// ORIGINAL (for source lookup):
P = (k) => {
    let y = _.current;
    if (!y) return !1;
    let B = y.get(k);
    if (!B || B.size === 0) return !1;
    for (let S of B)
        if (H.has(S.context)) return S.handler(), !0;
    return !1
}

// READABLE (for understanding):
invokeAction = (actionName) => {
    let handlerRegistry = handlerRegistryRef.current;
    if (!handlerRegistry) return false;

    let handlersForAction = handlerRegistry.get(actionName);
    if (!handlersForAction || handlersForAction.size === 0) {
        return false; // No handlers registered
    }

    // Iterate through handlers, execute first matching active context
    for (let handlerInfo of handlersForAction) {
        if (activeContextsSet.has(handlerInfo.context)) {
            handlerInfo.handler();
            return true; // Handler executed
        }
    }

    return false; // No matching context
};

// Mapping: P→invokeAction, k→actionName, y→handlerRegistry, _→handlerRegistryRef, B→handlersForAction, S→handlerInfo, H→activeContextsSet
```

**How it works:**
1. Action name (e.g., "chat:submit") is looked up in registry `Map<action, Set<{context, handler}>>`
2. All registered handlers for that action are iterated
3. First handler whose context is in `activeContextsSet` gets executed
4. Returns `true` to signal consumption, preventing event propagation

**Example**: Action "autocomplete:accept" might have handlers from both "Autocomplete" and "Chat" contexts. If "Autocomplete" is active, its handler runs. If only "Chat" is active, Chat's handler runs (fallback behavior).

### 4.4 Handler Registration

Components register action handlers using the `registerHandler` callback from KeybindingContext:

```javascript
// ============================================
// registerHandler - Add action handler to registry
// Location: chunks.53.mjs:3001-3011
// ============================================

// ORIGINAL (for source lookup):
j = (k) => {
    let y = _.current;
    if (!y) return AT5;
    if (!y.has(k.action)) y.set(k.action, new Set);
    return y.get(k.action).add(k), () => {
        let B = y.get(k.action);
        if (B) {
            if (B.delete(k), B.size === 0) y.delete(k.action)
        }
    }
}

// READABLE (for understanding):
registerHandler = (handlerInfo) => {
    let handlerRegistry = handlerRegistryRef.current;
    if (!handlerRegistry) return noop;

    // Ensure Set exists for this action
    if (!handlerRegistry.has(handlerInfo.action)) {
        handlerRegistry.set(handlerInfo.action, new Set());
    }

    // Add handler to Set
    handlerRegistry.get(handlerInfo.action).add(handlerInfo);

    // Return cleanup function
    return () => {
        let handlersForAction = handlerRegistry.get(handlerInfo.action);
        if (handlersForAction) {
            handlersForAction.delete(handlerInfo);

            // Clean up empty Sets to avoid memory leaks
            if (handlersForAction.size === 0) {
                handlerRegistry.delete(handlerInfo.action);
            }
        }
    };
};

// Mapping: j→registerHandler, k→handlerInfo, y→handlerRegistry, _→handlerRegistryRef, B→handlersForAction, AT5→noop
```

**Typical usage pattern**:

```javascript
const keybindingContext = useKeybindingContext();

useEffect(() => {
    return keybindingContext.registerHandler({
        action: "chat:submit",
        context: "Chat",
        handler: () => {
            submitMessage();
        }
    });
}, [keybindingContext, submitMessage]);
```

**Why return cleanup function**: React's `useEffect` cleanup ensures handlers are removed when components unmount, preventing stale handlers from firing.

---

## 5. Integration Example: Chat Component

To illustrate how focus and contexts work together, here's how the Chat input component uses both systems:

**Pseudocode**:

```javascript
function ChatInputComponent() {
    const [input, setInput] = useState("");
    const focusContext = useFocusContext();
    const keybindingContext = useKeybindingContext();

    // Register in focus system
    useEffect(() => {
        focusContext.add("chat-input", { autoFocus: true });
        focusContext.activate("chat-input");

        return () => {
            focusContext.deactivate("chat-input");
            focusContext.remove("chat-input");
        };
    }, [focusContext]);

    // Register Chat context when input is visible
    useRegisterContext("Chat", isVisible);

    // Register action handlers
    useEffect(() => {
        const cleanup1 = keybindingContext.registerHandler({
            action: "chat:submit",
            context: "Chat",
            handler: () => submitMessage(input)
        });

        const cleanup2 = keybindingContext.registerHandler({
            action: "chat:cancel",
            context: "Chat",
            handler: () => setInput("")
        });

        return () => {
            cleanup1();
            cleanup2();
        };
    }, [keybindingContext, input]);

    return <Input value={input} onChange={setInput} />;
}
```

**Keystroke flow example**:

```
User presses: Enter

1. Raw input "\r" enters Ink's input handler
2. Focus system checks: Is "\r" a Tab/Shift+Tab? → No, pass through
3. KeybindingHandler receives keystroke
4. resolveKeystroke() checks activeContexts: ["Chat", "Global"]
5. Finds binding: { context: "Chat", bindings: { enter: "chat:submit" } }
6. Returns: { type: "match", action: "chat:submit" }
7. invokeAction("chat:submit") queries registry
8. Finds handler for "chat:submit" with context "Chat"
9. Executes: submitMessage(input)
```

---

## 6. Design Trade-offs and Rationale

### 6.1 Why 18 Named Contexts Instead of Hierarchical?

**Alternative approach**: Tree-based context hierarchy (e.g., `Dialog > Confirmation > FieldInput`)

**Chosen approach**: Flat 18-context system with multi-activation

**Rationale**:
- **Simplicity**: No parent/child relationship logic needed
- **Flexibility**: Multiple contexts can be active simultaneously (Chat + Autocomplete)
- **Predictability**: Linear array filtering is easy to debug
- **Performance**: O(n) filtering on 18 contexts is negligible vs tree traversal

**Trade-off**: Need to manually manage context names and avoid conflicts. Hierarchical system would auto-scope bindings.

### 6.2 Why Separate Focus and Context Systems?

**Alternative**: Single unified system where focused component controls active context

**Chosen approach**: Focus (traversal) and Context (keybinding filtering) are independent

**Rationale**:
- **Decoupling**: UI components can register contexts without participating in focus traversal
- **Overlapping contexts**: Autocomplete can be active while Chat has focus
- **Global bindings**: `ctrl+c`, `ctrl+d` work regardless of focus state
- **Modal dialogs**: Can register context without entering focus pool

**Trade-off**: Slightly more complex mental model, but enables much richer interactions.

### 6.3 Why Last-Match-Wins for Duplicate Bindings?

**Alternative**: First-match-wins or throw error on duplicates

**Chosen approach**: Last matching binding in filtered array wins

**Rationale**:
- **Customization**: User bindings (loaded last) override defaults
- **Context priority**: Later contexts in array can shadow earlier ones
- **Graceful degradation**: Duplicates don't crash, just use last definition

**Trade-off**: Silent overwrites can be confusing. Validation system (see `detectDuplicateBindings`) warns users but doesn't block.

### 6.4 Why Use Sets for Active Contexts Instead of Array?

**Implementation**:
```javascript
activeContexts: Set<string>  // Not Array<string>
```

**Rationale**:
- **O(1) lookup**: `activeContexts.has("Chat")` is constant time
- **Automatic deduplication**: Multiple registrations don't create duplicates
- **Easy add/remove**: Set API matches registration/unregistration pattern

**Trade-off**: Conversion to array for context filtering (`[...activeContextsSet]`) adds small overhead, but negligible for 18 contexts.

---

## 7. Debugging and Observability

### 7.1 Logging Active Contexts

To debug which contexts are active at any moment, add this to KeybindingHandler:

```javascript
console.log("[keybindings] Active contexts:", [...activeContextsSet]);
```

### 7.2 Inspecting Handler Registry

Handler registry is a `Map<action, Set<{context, handler}>>`:

```javascript
console.log("[keybindings] Registry:",
    Array.from(handlerRegistry.entries()).map(([action, handlers]) => ({
        action,
        contexts: Array.from(handlers).map(h => h.context)
    }))
);
```

### 7.3 Common Issues

**Problem**: Keystroke not triggering action

**Diagnosis**:
1. Check context is registered: `activeContexts` should include the binding's context
2. Verify binding exists: Check `bindings` array contains the keystroke
3. Confirm handler is registered: `handlerRegistry.get(action)` should return a Set
4. Ensure focus system isn't consuming it: Tab/Shift+Tab never reach keybinding handler

**Problem**: Wrong action firing

**Diagnosis**:
1. Check for duplicate bindings across contexts: Use `detectDuplicateBindings()`
2. Verify context filtering: Multiple active contexts may have overlapping bindings
3. Inspect match order: Last matching binding in filtered array wins

---

## 8. Summary

Claude Code's focus and context system provides a robust foundation for multi-pane keyboard navigation:

- **Focus Layer**: Manages Tab/Shift+Tab traversal across visual components
- **Context Layer**: Filters keybindings based on 18 named UI states
- **Handler Registry**: Maps actions to callbacks with context scoping
- **Integration**: Both systems work together while remaining decoupled

**Key takeaways**:
1. Focus determines **which component receives input**, Context determines **which keybindings are active**
2. Multiple contexts can be active simultaneously, enabling rich composite UIs
3. "Global" context is always active, ensuring base keybindings work everywhere
4. Tab/Shift+Tab are consumed by focus system and never reach keybinding handlers
5. Last-match-wins resolution enables user customization to override defaults

This architecture balances simplicity (flat 18-context system) with flexibility (multi-activation, independent focus/context), enabling Claude Code's responsive terminal UI.
