# Action System - Registration and Dispatch

## Overview

The action system bridges keybinding matches to executable handlers. When a keystroke resolves to an action name (like `"chat:submit"` or `"app:interrupt"`), the system looks up registered handlers for that action within the active contexts and executes them. This document explains the registry architecture, action naming conventions, and dispatch mechanism.

**Key architectural principles:**
- **Context-scoped handlers**: Multiple handlers per action, filtered by active context
- **First-match-wins**: Among active contexts, first registered handler wins
- **Dynamic registration**: Components register/unregister handlers via React hooks
- **Fire-and-forget**: Handlers execute synchronously without return values
- **Separation of concerns**: Keybinding resolution is separate from handler execution

**Version**: Claude Code v2.1.76

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

Key functions in this document:
- `KeybindingHandler` (x6Y) - Dispatches matched keybindings to handlers
- `KeybindingContext` (A36) - Provides registration API via React Context
- `resolveKeystroke` (tK6) - Returns match type and action name
- `registerHandler` (closure in A36) - Registers action handler for context
- `invokeAction` (closure in A36) - Executes handler for action in active contexts
- `useKeybindingContext` (VL) - Hook to access keybinding context
- `useRegisterContext` (q36) - Hook to mark component context as active

---

## 1. Action Registry Design

### 1.1 Registry Data Structure

The handler registry is a two-level map: action name → Set of {context, handler} objects.

```javascript
// ============================================
// registerHandler - Registers action handler in registry
// Location: chunks.53.mjs:3001-3012
// ============================================

// ORIGINAL (for source lookup):
if (q[2] !== _) j = (k) => {
    let y = _.current;
    if (!y) return AT5;
    if (!y.has(k.action)) y.set(k.action, new Set);
    return y.get(k.action).add(k), () => {
        let B = y.get(k.action);
        if (B) {
            if (B.delete(k), B.size === 0) y.delete(k.action)
        }
    }
}, q[2] = _, q[3] = j;

// READABLE (for understanding):
if (handlerRegistryRefChanged) {
    registerHandler = (handler) => {
        let registry = handlerRegistryRef.current;
        if (!registry) return noop;

        // Ensure Set exists for this action
        if (!registry.has(handler.action)) {
            registry.set(handler.action, new Set());
        }

        // Add handler to Set, return cleanup function
        registry.get(handler.action).add(handler);

        return () => {
            let handlerSet = registry.get(handler.action);
            if (handlerSet) {
                handlerSet.delete(handler);
                // Clean up empty Sets
                if (handlerSet.size === 0) {
                    registry.delete(handler.action);
                }
            }
        };
    };
}

// Mapping: q→cache, k→handler, y→registry, _→handlerRegistryRef, AT5→noop
```

**Registry structure:**
```typescript
handlerRegistryRef.current = Map<
  actionName: string,
  Set<{
    action: string,
    context: string,
    handler: () => void
  }>
>
```

**Design rationale:**
- **Map of Sets**: Allows multiple handlers per action (different contexts)
- **Cleanup function**: Returned closure removes handler on component unmount
- **Automatic pruning**: Empty Sets are deleted to prevent memory leaks
- **Type-safe lookup**: TypeScript ensures handlers match expected signature

### 1.2 Registration Lifecycle

Components register handlers in `useEffect` or `useLayoutEffect`:

```javascript
// ============================================
// KeybindingContext API - Provides registerHandler via React Context
// Location: chunks.53.mjs:3032-3046
// ============================================

// ORIGINAL (for source lookup):
if (q[12] !== H || q[13] !== K || q[14] !== D || q[15] !== W || q[16] !== z || q[17] !== $ || q[18] !== M || q[19] !== w || q[20] !== G || q[21] !== f || q[22] !== O) Z = {
    resolve: G,
    setPendingChord: w,
    getDisplayText: D,
    getPlatformDisplayText: f,
    bindings: K,
    pendingChord: z,
    activeContexts: H,
    registerActiveContext: $,
    unregisterActiveContext: O,
    registerHandler: M,
    invokeAction: W
}, q[12] = H, q[13] = K, q[14] = D, q[15] = W, q[16] = z, q[17] = $, q[18] = M, q[19] = w, q[20] = G, q[21] = f, q[22] = O, q[23] = Z;

// READABLE (for understanding):
if (anyDependencyChanged) {
    contextValue = {
        resolve: resolveKeystroke,           // tK6 - Returns match type
        setPendingChord: setPendingChord,    // Update chord state
        getDisplayText: getDisplayText,       // Format keybinding for UI
        getPlatformDisplayText: getPlatformDisplayText, // Platform-specific format
        bindings: bindings,                   // Current keybinding configuration
        pendingChord: pendingChord,           // Current chord sequence (if any)
        activeContexts: activeContexts,       // Set of active context names
        registerActiveContext: registerActiveContext, // Mark context as active
        unregisterActiveContext: unregisterActiveContext, // Mark context as inactive
        registerHandler: registerHandler,     // Register action handler
        invokeAction: invokeAction           // Execute action handler
    };
}

// Mapping: Z→contextValue, G→resolveKeystroke, w→setPendingChord, D→getDisplayText, f→getPlatformDisplayText, K→bindings, z→pendingChord, H→activeContexts, $→registerActiveContext, O→unregisterActiveContext, M→registerHandler, W→invokeAction
```

**Registration pattern:**
```javascript
// In a React component:
const { registerHandler } = useKeybindingContext();

useEffect(() => {
    const cleanup = registerHandler({
        action: "chat:submit",
        context: "Chat",
        handler: () => {
            submitMessage();
        }
    });

    return cleanup; // Automatically unregisters on unmount
}, [registerHandler]);
```

**Why this design:**
- **React integration**: Hooks ensure handlers are added/removed with component lifecycle
- **Automatic cleanup**: Cleanup function prevents stale handlers
- **Dynamic behavior**: Components can conditionally register based on props/state
- **No global pollution**: Registry is encapsulated in Context, not module-level

---

## 2. Action Types and Naming Conventions

### 2.1 Action Naming Patterns

Actions follow a `namespace:verb` pattern derived from the default keybindings:

```javascript
// ============================================
// DEFAULT_KEYBINDINGS - Built-in action mappings (excerpt)
// Location: chunks.54.mjs:1127-1240
// ============================================

// ORIGINAL (for source lookup):
{
    context: "Global",
    bindings: {
        "ctrl+c": "app:interrupt",
        "ctrl+d": "app:exit",
        "ctrl+t": "app:toggleTodos",
        "ctrl+o": "app:toggleTranscript",
        ...
    }
}, {
    context: "Chat",
    bindings: {
        escape: "chat:cancel",
        enter: "chat:submit",
        "meta+p": "chat:modelPicker",
        "meta+t": "chat:thinkingToggle",
        "ctrl+g": "chat:externalEditor",
        ...
    }
}, {
    context: "Autocomplete",
    bindings: {
        tab: "autocomplete:accept",
        escape: "autocomplete:dismiss",
        up: "autocomplete:previous",
        down: "autocomplete:next"
    }
}

// READABLE (for understanding):
// Action naming convention: {namespace}:{verb}
// - namespace: Feature area (app, chat, autocomplete, settings, etc.)
// - verb: Action to perform (submit, cancel, toggle, next, etc.)

// Mapping: None (literal data structure)
```

**Common action patterns:**

| Namespace | Purpose | Example Actions |
|-----------|---------|-----------------|
| `app:` | Global application controls | `app:interrupt`, `app:exit`, `app:toggleTodos` |
| `chat:` | Chat input/interaction | `chat:submit`, `chat:cancel`, `chat:externalEditor` |
| `autocomplete:` | Autocomplete widget | `autocomplete:accept`, `autocomplete:dismiss` |
| `confirm:` | Confirmation dialogs | `confirm:yes`, `confirm:no`, `confirm:toggle` |
| `select:` | Selection widgets | `select:previous`, `select:next`, `select:accept` |
| `history:` | Command history | `history:previous`, `history:next`, `history:search` |
| `tabs:` | Tab navigation | `tabs:next`, `tabs:previous` |
| `transcript:` | Transcript viewer | `transcript:exit`, `transcript:toggleShowAll` |
| `task:` | Task management | `task:background` |
| `theme:` | Theme picker | `theme:toggleSyntaxHighlighting` |

### 2.2 Special Action Types

**Null bindings (unbinding):**
```json
{
    "context": "Chat",
    "bindings": {
        "ctrl+c": null
    }
}
```

When `action === null`, the resolution returns `{type: "unbound"}`, and the keystroke is ignored (no handler execution, no event propagation).

**Command bindings:**
```json
{
    "context": "Chat",
    "bindings": {
        "/commit": "command:commit",
        "/tasks": "command:tasks"
    }
}
```

Command actions (prefix `command:`) are special actions that trigger skill execution. The handler maps the action to a skill invocation.

**Design rationale:**
- **Namespace isolation**: Prevents action name collisions between features
- **Semantic clarity**: Action names self-document their purpose
- **Consistent patterns**: Verbs like `next`, `previous`, `accept`, `cancel` are reused
- **Null for unbinding**: Explicit unbinding prevents accidental shadowing

---

## 3. Dispatch Mechanism

### 3.1 Keystroke to Handler Flow

The dispatch flow from keypress to handler execution:

```javascript
// ============================================
// KeybindingHandler - Dispatches keystroke events to handlers
// Location: chunks.110.mjs:998-1037
// ============================================

// ORIGINAL (for source lookup):
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

// READABLE (for understanding):
if (dependenciesChanged) {
    handleKeystroke = (event, keyInfo, domEvent) => {
        let registry = handlerRegistryRef.current;
        let registeredContexts = new Set();

        // Collect all contexts that have registered handlers
        if (registry) {
            for (let handlerSet of registry.values()) {
                for (let handler of handlerSet) {
                    registeredContexts.add(handler.context);
                }
            }
        }

        // Build context priority list: registered contexts + active contexts + "Global"
        let contextPriority = [...registeredContexts, ...activeContexts, "Global"];

        let isChordInProgress = pendingChordRef.current !== null;

        // Resolve keystroke against bindings
        let result = resolveKeystroke(event, keyInfo, contextPriority, bindings, pendingChordRef.current);

        switch (result.type) {
            case "chord_started": {
                // Start chord sequence
                setPendingChord(result.pending);
                domEvent.stopImmediatePropagation();
                break;
            }
            case "match": {
                // Clear chord state
                setPendingChord(null);

                // Only dispatch if we're completing a chord
                if (isChordInProgress) {
                    let contextSet = new Set(contextPriority);

                    if (registry) {
                        let handlers = registry.get(result.action);

                        if (handlers && handlers.size > 0) {
                            // Find first handler matching active context
                            for (let handler of handlers) {
                                if (contextSet.has(handler.context)) {
                                    handler.handler(); // Execute handler
                                    domEvent.stopImmediatePropagation();
                                    break; // First-match-wins
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
                // No action
        }
    };
}

// Mapping: $→handleKeystroke, _→event, J→keyInfo, X→domEvent, D→registry, j→registeredContexts, M→contextPriority, P→isChordInProgress, W→result, G→contextSet/handlers, f→handlerSet/handler, Z→handler
```

**Dispatch steps:**

1. **Collect active contexts**: Merge registered handler contexts + component-declared contexts + "Global"
2. **Resolve keystroke**: Call `resolveKeystroke()` to match against bindings → returns `{type, action?}`
3. **Handle chord state**: If `chord_started`, save pending chord and wait for next key
4. **Execute handler** (on `match`):
   - Look up action in registry: `registry.get(actionName)`
   - Filter handlers by active contexts
   - Execute **first matching handler** (Set iteration order)
   - Call `event.stopImmediatePropagation()` to prevent default browser behavior
5. **Clear state**: Reset pending chord on completion, cancellation, or unbinding

### 3.2 Context Priority Resolution

```javascript
// ============================================
// invokeAction - Executes handler for action in active contexts
// Location: chunks.53.mjs:3015-3023
// ============================================

// ORIGINAL (for source lookup):
if (q[4] !== H || q[5] !== _) P = (k) => {
    let y = _.current;
    if (!y) return !1;
    let B = y.get(k);
    if (!B || B.size === 0) return !1;
    for (let S of B)
        if (H.has(S.context)) return S.handler(), !0;
    return !1
}, q[4] = H, q[5] = _, q[6] = P;

// READABLE (for understanding):
if (activeContextsChanged || handlerRegistryRefChanged) {
    invokeAction = (actionName) => {
        let registry = handlerRegistryRef.current;
        if (!registry) return false;

        let handlers = registry.get(actionName);
        if (!handlers || handlers.size === 0) return false;

        // Find first handler whose context is active
        for (let handler of handlers) {
            if (activeContexts.has(handler.context)) {
                handler.handler(); // Execute handler
                return true;
            }
        }

        return false; // No active handler found
    };
}

// Mapping: P→invokeAction, k→actionName, y→registry, B→handlers, S→handler, H→activeContexts, _→handlerRegistryRef
```

---

## 4. Action Parameters and Return Values

### 4.1 Handler Signature

Action handlers are **pure side-effect functions** with no parameters or return values:

```typescript
type ActionHandler = () => void;
```

**No parameters:**
- Handlers receive no event object, keystroke info, or context
- All state access must be via closures or React hooks

**No return values:**
- Return values are ignored
- Handlers cannot signal success/failure to the dispatch system
- Side effects only (e.g., state updates, API calls)

**Example: Typical handler pattern**
```javascript
const ChatInput = () => {
    const [message, setMessage] = useState("");
    const { registerHandler } = useKeybindingContext();

    useEffect(() => {
        return registerHandler({
            action: "chat:submit",
            context: "Chat",
            handler: () => {
                // Access state via closure
                if (message.trim()) {
                    submitMessage(message);
                    setMessage("");
                }
            }
        });
    }, [registerHandler, message]); // Re-register when message changes
};
```

### 4.2 Async Handlers

Async handlers are **not awaited**:

```javascript
// This works, but the Promise is not awaited
registerHandler({
    action: "chat:submit",
    context: "Chat",
    handler: async () => {
        await submitMessageAsync();
    }
});

// Dispatch calls handler synchronously:
handler(); // Returns Promise, but not awaited
```

**Best practice: Use state management**
```javascript
const [isSubmitting, setIsSubmitting] = useState(false);

registerHandler({
    action: "chat:submit",
    context: "Chat",
    handler: async () => {
        if (isSubmitting) return; // Guard against overlapping calls
        setIsSubmitting(true);
        try {
            await submitMessageAsync();
        } finally {
            setIsSubmitting(false);
        }
    }
});
```

---

## 5. Registry Lifecycle and Cleanup

### 5.1 Component Mounting/Unmounting

```javascript
// ============================================
// useRegisterContext - Marks component context as active
// Location: chunks.53.mjs:3062-3075
// ============================================

// ORIGINAL (for source lookup):
function q36(A, q) {
    let K = e(5),
        Y = q === void 0 ? !0 : q,
        z = VL(),
        w, H;
    if (K[0] !== A || K[1] !== Y || K[2] !== z) w = () => {
        if (!z || !Y) return;
        return z.registerActiveContext(A), () => {
            z.unregisterActiveContext(A)
        }
    }, H = [A, z, Y], K[0] = A, K[1] = Y, K[2] = z, K[3] = w, K[4] = H;
    else w = K[3], H = K[4];
    TJ1.useLayoutEffect(w, H)
}

// READABLE (for understanding):
function useRegisterContext(contextName, isActive = true) {
    let cache = e(5);
    let keybindingContext = useKeybindingContext();

    let effect, deps;

    if (contextChanged || isActiveChanged || keybindingContextChanged) {
        effect = () => {
            // Skip if disabled or context not available
            if (!keybindingContext || !isActive) return;

            // Register context as active
            keybindingContext.registerActiveContext(contextName);

            // Return cleanup function
            return () => {
                keybindingContext.unregisterActiveContext(contextName);
            };
        };

        deps = [contextName, keybindingContext, isActive];
    }

    // Use useLayoutEffect for immediate registration
    React.useLayoutEffect(effect, deps);
}

// Mapping: q36→useRegisterContext, A→contextName, q→isActive, K→cache, Y→isActive, z→keybindingContext, w→effect, H→deps, VL→useKeybindingContext, TJ1→React
```

**Why useLayoutEffect?**
- **Synchronous registration**: Context is active before browser paint
- **Prevents race conditions**: Handlers are registered before keystrokes can occur
- **Consistent behavior**: Context state is stable during first render

---

## 6. Global vs. Context-Specific Actions

### 6.1 Global Context

The `"Global"` context is always active and has lowest priority:

```javascript
// From dispatch mechanism:
let contextPriority = [...registeredContexts, ...activeContexts, "Global"];
```

**Global context characteristics:**
- **Always present**: Appended to every context priority list
- **Lowest priority**: Checked last after all specific contexts
- **Fallback behavior**: Handles actions when no specific context matches
- **Application-wide**: Keybindings work regardless of active component

### 6.2 Context Shadowing

More specific contexts **shadow** Global bindings:

```json
[
    {
        "context": "Global",
        "bindings": {
            "ctrl+c": "app:interrupt"
        }
    },
    {
        "context": "Transcript",
        "bindings": {
            "ctrl+c": "transcript:exit"
        }
    }
]
```

**Resolution logic:**
- **In Transcript context**: `ctrl+c` → `"transcript:exit"` (specific context wins)
- **In other contexts**: `ctrl+c` → `"app:interrupt"` (Global fallback)

---

## 7. Design Rationale and Trade-offs

### 7.1 Why Map of Sets?

**Chosen: Map of Sets**
```javascript
Map<actionName: string, Set<{context, handler}>>
```

**Why Sets win:**
- **Deduplication**: Prevents duplicate handler registration (idempotent)
- **Fast removal**: O(1) deletion by object reference
- **No ordering guarantees needed**: First-match-wins uses Set iteration order

**Trade-off:**
- **Pro**: Simple registration (add to Set, remove from Set)
- **Con**: No explicit priority control (insertion order only)

### 7.2 Why First-Match-Wins?

**Chosen: First-match-wins**
```javascript
for (let handler of handlers) {
    if (contextSet.has(handler.context)) {
        handler.handler();
        break; // Stop after first match
    }
}
```

**Why first-match-wins:**
- **Predictable behavior**: No ambiguity when multiple handlers exist
- **Performance**: Only one handler executes per keystroke
- **Browser event model**: Matches `stopImmediatePropagation()` semantics

### 7.3 Why No Handler Parameters?

**Chosen: No parameters**
```javascript
handler(); // Pure side-effect
```

**Why no parameters:**
- **Separation of concerns**: Resolution and execution are independent
- **Closure-based state**: Handlers use React hooks or closures for state
- **Flexibility**: Handlers can access any state, not just event data

### 7.4 Why Fire-and-Forget Async?

**Chosen: Fire-and-forget**
```javascript
handler(); // Don't await
```

**Why fire-and-forget:**
- **No blocking**: Keystrokes don't wait for handler completion
- **Simple dispatch**: No async complexity in keybinding system
- **User responsiveness**: UI remains interactive

**Trade-off:**
- **Pro**: Fast, non-blocking dispatch
- **Con**: Handlers must manage async state themselves (loading flags, etc.)
