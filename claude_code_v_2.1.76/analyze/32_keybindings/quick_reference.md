# Keybindings Quick Reference Guide

## Overview

Fast lookup reference for key functions, event flow, context system, and common patterns in the keybindings system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

---

## Key Function Lookup Table

### Configuration & Loading

| Function | Obfuscated | Purpose | Returns |
|----------|------------|---------|---------|
| loadKeybindingsAsync | Mk5 | Async load from file, merge with defaults | `{bindings, warnings}` |
| loadKeybindingsSync | YS1 | Sync load with caching | `{bindings, warnings}` |
| getCachedBindings | kq7 | Get cached or load on first call | `Array<Keybinding>` |
| getKeybindingsFilePath | R71 | Build path to keybindings.json | `string` |
| getDefaultKeybindings | tqA | Return hardcoded defaults | `Array<Keybinding>` |
| isKeybindingCustomizationEnabled | Hv | Check feature flag | `boolean` |

### File Watching

| Function | Obfuscated | Purpose | Returns |
|----------|------------|---------|---------|
| watchKeybindingsFile | Lq7 | Start chokidar file watcher | `Promise<void>` |
| stopWatchingKeybindings | Pk5 | Close watcher, clear listeners | `void` |
| handleKeybindingsFileChange | Nq7 | Reload on file modification | `Promise<void>` |
| handleKeybindingsFileDelete | Wk5 | Reset to defaults on file deletion | `Promise<void>` |
| subscribeToKeybindingsChanges | Rq7 | Register reload listener | `UnsubscribeFn` |

### Validation

| Function | Obfuscated | Purpose | Returns |
|----------|------------|---------|---------|
| validateKeybindingsArray | qk5 | Check top-level array structure | `Array<Warning>` |
| validateKeybindingBlock | Ak5 | Validate single block | `Array<Warning>` |
| parseAndValidateKeystroke | eE5 | Parse keystroke, return error if invalid | `Warning \| null` |
| detectDuplicateBindings | Kk5 | Find duplicate keys in same context | `Array<Warning>` |
| detectReservedKeyConflicts | Yk5 | Check for platform-reserved shortcuts | `Array<Warning>` |
| detectMalformedJSON | aqA | Regex-based JSON linting | `Array<Warning>` |
| validateKeybindingsComprehensive | sqA | Run all validations, dedupe warnings | `Array<Warning>` |

### Parsing

| Function | Obfuscated | Purpose | Returns |
|----------|------------|---------|---------|
| parseKeystroke | iC1 | Parse string to `{key, ctrl, alt, shift, meta}` | `Keystroke` |
| parseChordString | rN5 | Split chord by spaces, parse each | `Array<Keystroke>` |
| stringifyKeystroke | oN5 | Convert keystroke object to string | `string` |
| getDisplayKeyName | aN5 | Map key names to symbols (↑, ←, Esc) | `string` |
| flattenKeybindings | aK6 | Convert blocks to flat array | `Array<FlatBinding>` |
| stringifyChord | oK6 | Convert chord array to display string | `string` |
| getKeyNameFromEvent | v77 | Extract key name from DOM event | `string \| null` |
| normalizeKeystroke | k71 | Handle modifier aliases | `string` |

### Matching & Resolution

| Function | Obfuscated | Purpose | Returns |
|----------|------------|---------|---------|
| resolveKeystroke | tK6 | Main matching orchestrator | `MatchResult` |
| eventToKeystroke | sN5 | Convert DOM event to keystroke | `Keystroke \| null` |
| isPrefixMatch | tN5 | Check if sequence is prefix of chord | `boolean` |
| isExactMatch | eN5 | Check if sequences match exactly | `boolean` |
| findKeybindingForAction | sK6 | Reverse lookup: action → chord string | `string \| undefined` |

### React Context & UI

| Function/Component | Obfuscated | Purpose | Returns |
|-------------------|------------|---------|---------|
| KeybindingSetup | dX | Top-level provider component | `ReactElement` |
| KeybindingHandler | x6Y | Global keystroke listener component | `null` |
| KeybindingContext | A36 | Context provider | `ReactElement` |
| useKeybindingContext | VL | Hook to access context | `ContextValue` |
| useRegisterContext | q36 | Hook to register/unregister context | `void` |
| logKeybindingWarnings | S6Y | Log/display validation warnings | `void` |

---

## Event Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. TERMINAL INPUT CAPTURE                                       │
│    stdin.read() → handleReadable() → processInput()             │
│    - Raw mode enabled (disables line buffering)                 │
│    - Reference counting for nested raw mode calls               │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. ANSI ESCAPE SEQUENCE PARSING                                 │
│    - State machine: ground, escape, csi, ss3, osc, dcs, apc     │
│    - Buffering for incomplete sequences (50ms/500ms timeouts)   │
│    - Bracket paste detection (\x1b[200~...\x1b[201~)            │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. KEY EVENT CONVERSION                                         │
│    P77() dispatcher → j77() sequence→KeyboardInputEvent         │
│    - Regex patterns for meta keys, escape sequences, CSI u      │
│    - Key name normalization via W77 mapping                     │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. EVENT DISPATCHING                                            │
│    qK9() dispatcher → InputEvent/TerminalFocusEvent creation    │
│    - React discreteUpdates() integration                        │
│    - Ctrl+Z suspend handling (non-Windows)                      │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. FOCUS ROUTING                                                │
│    handleInput() → focus system lookup                          │
│    - activeFocusId determines target component                  │
│    - Event propagation to focused component                     │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. KEYBINDING MATCHING                                          │
│    sN5() normalize event → tK6() main matching function         │
│    - Build current sequence (append to pending chord)           │
│    - Filter by activeContexts                                   │
│    - Check prefix match → "chord_started" (start 1000ms timer)  │
│    - Check exact match → "match" (execute action)               │
│    - No match → "chord_cancelled" or "none"                     │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. ACTION EXECUTION                                             │
│    Handler registry lookup: context → action → handler()        │
│    - First-match-wins among active contexts                     │
│    - Handler invocation (no parameters, no await)               │
│    - Event.stopImmediatePropagation()                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Context Activation Flowchart

```
Component Mount
     │
     ▼
useRegisterContext(contextName) hook
     │
     ▼
useLayoutEffect() runs
     │
     ├─> registerActiveContext(contextName)
     │   - Adds contextName to activeContexts Set
     │   - Set persists across component updates
     │
     ▼
Component Active
     │
     ├─> Keystrokes filtered by activeContexts
     │   - Only bindings matching active contexts considered
     │   - Global context always active
     │
     ▼
Component Unmount
     │
     ▼
useLayoutEffect() cleanup
     │
     └─> unregisterActiveContext(contextName)
         - Removes contextName from activeContexts Set
```

---

## 18 Context Reference

| Context | Activates When | Common Actions | Component Owner |
|---------|----------------|----------------|-----------------|
| **Global** | Always active | interrupt, help, toggleVim | App root |
| **Chat** | Chat input focused | submit, cancel, externalEditor, command:* | ChatInput |
| **Autocomplete** | Suggestion shown | accept, reject, nextSuggestion | AutocompleteOverlay |
| **Confirmation** | Confirmation dialog | confirm, cancel | ConfirmDialog |
| **Help** | Help modal open | close, scroll | HelpModal |
| **Transcript** | Message list focused | scroll, copy, delete | MessageList |
| **HistorySearch** | Search overlay | nextResult, prevResult, close | HistorySearchOverlay |
| **Task** | Task panel focused | claimTask, completeTask | TaskPanel |
| **ThemePicker** | Theme selector open | nextTheme, prevTheme, select | ThemePicker |
| **Settings** | Settings panel | toggleSetting, save, cancel | SettingsPanel |
| **Tabs** | Tab bar focused | nextTab, prevTab, closeTab | TabBar |
| **Attachments** | Attachment list | addAttachment, removeAttachment | AttachmentList |
| **Footer** | Footer area focused | focusInput, toggleMode | Footer |
| **MessageSelector** | Selecting messages | select, selectAll, deselect | MessageSelector |
| **DiffDialog** | Diff view open | acceptChange, rejectChange, nextDiff | DiffDialog |
| **ModelPicker** | Model selector open | nextModel, prevModel, select | ModelPicker |
| **Select** | Generic select dropdown | nextOption, prevOption, select | SelectDropdown |
| **Plugin** | Plugin UI active | pluginAction1, pluginAction2 | PluginHost |

---

## Common Patterns & Idioms

### Pattern 1: Registering Context and Handler Together

```typescript
// In a React component
function MyComponent() {
    const { registerHandler, unregisterHandler } = useKeybindingContext();

    // Register context to filter keybindings
    useRegisterContext("MyContext");

    // Register handler for action
    useEffect(() => {
        const unregister = registerHandler("myAction", "MyContext", () => {
            console.log("Action executed!");
        });

        return unregister; // Cleanup on unmount
    }, [registerHandler]);

    return <div>...</div>;
}
```

### Pattern 2: Multi-Context Component

```typescript
// Component active in multiple contexts
function ChatWithAutocomplete() {
    // Register both contexts
    useRegisterContext("Chat");
    useRegisterContext("Autocomplete");

    // Handlers will match if either context is active
    ...
}
```

### Pattern 3: Conditional Context Registration

```typescript
// Only register context when condition is met
function ConditionalContext({ isActive }) {
    useLayoutEffect(() => {
        if (!isActive) return;

        registerActiveContext("MyContext");
        return () => unregisterActiveContext("MyContext");
    }, [isActive]);
}
```

### Pattern 4: Chord Sequence Definition

```json
{
  "context": "Chat",
  "bindings": {
    "ctrl+k ctrl+s": "chat:save",
    "ctrl+k ctrl+c": "chat:clear",
    "ctrl+k n": "chat:newThread"
  }
}
```

**Note:** First keystroke (ctrl+k) is shared prefix.

### Pattern 5: Unbinding Default Shortcuts

```json
{
  "context": "Global",
  "bindings": {
    "ctrl+l": null  // Explicitly unbind default clear_history
  }
}
```

---

## Match Type Decision Tree

```
Keystroke arrives
     │
     ▼
Escape key AND chord pending?
     ├─ YES → Return "chord_cancelled"
     └─ NO  → Continue
           │
           ▼
     Can normalize to valid keystroke?
           ├─ NO  → Chord pending? → YES → Return "chord_cancelled"
           │                       → NO  → Return "none"
           └─ YES → Build sequence (append to pending or new)
                 │
                 ▼
           Filter bindings by context
                 │
                 ▼
           Any binding is PREFIX of sequence?
                 ├─ YES → Return {type: "chord_started", pending: sequence}
                 └─ NO  → Continue
                       │
                       ▼
                 Any binding EXACT matches sequence?
                       ├─ YES → Action === null? → YES → Return "unbound"
                       │                         → NO  → Return {type: "match", action}
                       └─ NO  → Chord was pending? → YES → Return "chord_cancelled"
                                                   → NO  → Return "none"
```

---

## Constants Reference

| Constant | Obfuscated | Value | Purpose |
|----------|------------|-------|---------|
| CHORD_TIMEOUT_MS | C6Y | 1000 | Max time between chord keystrokes (ms) |
| WATCH_STABILITY_THRESHOLD_MS | Jk5 | 500 | File watcher debounce delay (ms) |
| WATCH_POLL_INTERVAL_MS | Xk5 | 200 | File watcher poll interval (ms) |
| VALID_CONTEXTS | Gq7 | [18 contexts] | Allowed context names |
| DEFAULT_KEYBINDINGS | kJ1 | [...] | Fallback bindings array |

---

## Error Types Reference

| Error Type | Severity | Cause | Example |
|------------|----------|-------|---------|
| `parse_error` | error | Invalid JSON, missing fields | `"bindings must be an array"` |
| `invalid_context` | error | Unknown context name | `"Unknown context: ChatInput"` (should be "Chat") |
| `invalid_action` | error/warning | Invalid action format | `"command: binding must be in Chat context"` |
| `duplicate` | warning | Same key in same context multiple times | `"Duplicate key ctrl+s in Chat bindings"` |
| `reserved` | error/warning | Platform-reserved shortcut | `"ctrl+c may not work: hardcoded interrupt"` |

---

## File Path Constants

| Path | Purpose |
|------|---------|
| `~/.claude/keybindings.json` | User keybindings configuration file |
| `chunks.54.mjs` | Configuration, validation, file watching |
| `chunks.53.mjs` | Parsing, matching, chord logic |
| `chunks.110.mjs` | React context, handlers, UI integration |
| `chunks.177.mjs` | Help documentation, schema |

---

## Debugging Tips

### 1. Check Active Contexts

```typescript
// In KeybindingHandler, add console.log
console.log("Active contexts:", [...activeContexts]);
```

### 2. Inspect Handler Registry

```typescript
// In action execution
console.log("Registry:", handlerRegistryRef.current);
console.log("Looking for action:", actionName);
```

### 3. Trace Match Results

```typescript
// In resolveKeystroke
const result = resolveKeystroke(...);
console.log("Match result:", result.type, result);
```

### 4. Validate Bindings

```bash
# Check for syntax errors
cat ~/.claude/keybindings.json | jq .

# Validation warnings shown in /doctor command
```

---

## Summary

This quick reference provides instant lookup for:
- **54 key functions** across configuration, validation, parsing, matching
- **Event flow diagram** showing 7-stage keystroke lifecycle
- **Context system** with all 18 contexts and activation patterns
- **Common patterns** for context registration and handler management
- **Match type decision tree** for understanding keystroke resolution
- **Constants and error types** for debugging and troubleshooting

For detailed analysis, see individual documentation files in this directory.
