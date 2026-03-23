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
| loadKeybindingsAsync | tu9 | Async load from file, merge with defaults | `{bindings, warnings}` |
| loadKeybindingsSync | $p6 | Sync load with caching | `{bindings, warnings}` |
| getCachedBindings | m34 | Get cached or load on first call | `Array<Keybinding>` |
| getKeybindingsFilePath | b36 | Build path to keybindings.json | `string` |
| getDefaultBindings | rN8 | Return hardcoded defaults | `Array<Keybinding>` |
| isKeybindingCustomizationEnabled | pk | Check feature flag | `boolean` |
| DEFAULT_KEYBINDINGS | XW6 | Default bindings array | `Array<BindingBlock>` |

> **For complete default keybindings, see [default_keybindings.md](./default_keybindings.md)**

### File Watching

| Function | Obfuscated | Purpose | Returns |
|----------|------------|---------|---------|
| watchKeybindingsFile | B34 | Start chokidar file watcher | `Promise<void>` |
| stopWatchingKeybindings | eu9 | Close watcher, clear listeners | `void` |
| handleKeybindingsFileChange | I34 | Reload on file modification | `Promise<void>` |
| handleKeybindingsFileDelete | Am9 | Reset to defaults on file deletion | `Promise<void>` |
| WRITE_STABILITY_THRESHOLD_MS | ru9 | File watcher debounce delay | `500` |
| WRITE_POLL_INTERVAL_MS | ou9 | File watcher poll interval | `200` |

### Validation

| Function | Obfuscated | Purpose | Returns |
|----------|------------|---------|---------|
| isValidKeybindingsArray | uu9 | Check top-level array structure | `boolean` |
| isValidKeybindingBlock | xu9 | Validate single block structure | `boolean` |
| isValidContext | mu9 | Check if context name is valid | `boolean` |
| parseAndValidateKeystroke | Bu9 | Parse keystroke, return error if invalid | `Warning \| null` |
| validateKeybindingBlock | gu9 | Validate single block | `Array<Warning>` |
| validateKeybindingsArray | Fu9 | Validate entire array | `Array<Warning>` |
| detectDuplicateBindings | pu9 | Find duplicate keys in same context | `Array<Warning>` |
| detectReservedKeyConflicts | Qu9 | Check for platform-reserved shortcuts | `Array<Warning>` |
| detectMalformedJSON | iN8 | Regex-based JSON linting | `Array<Warning>` |
| VALID_CONTEXTS | h34 | Allowed context names | `Array<string>` |

### Parsing (chunks.65.mjs)

| Function | Obfuscated | Purpose | Returns |
|----------|------------|---------|---------|
| parseKeystroke | Qu6 | Parse string to `{key, ctrl, alt, shift, meta}` | `Keystroke` |
| parseChordString | pj8 | Split chord by spaces, parse each | `Array<Keystroke>` |
| stringifyKeystroke | wl3 | Convert keystroke object to string | `string` |
| getDisplayKeyName | Ol3 | Map key names to symbols (↑, ←, Esc) | `string` |
| flattenKeybindings | X$1 | Convert blocks to flat array | `Array<FlatBinding>` |
| stringifyChord | D$1 | Convert chord array to display string | `string` |
| getKeyNameFromEvent | Qj8 | Extract key name from DOM event | `string \| null` |
| getModifiers | $l3 | Extract modifier flags from event | `Modifiers` |

### Matching & Resolution (chunks.65.mjs)

| Function | Obfuscated | Purpose | Returns |
|----------|------------|---------|---------|
| resolveKeystroke | Z$1 | Main matching orchestrator | `MatchResult` |
| eventToKeystroke | Hl3 | Convert DOM event to keystroke | `Keystroke \| null` |
| keystrokesMatch | W$1 | Compare two keystroke objects | `boolean` |
| isPrefixMatch | jl3 | Check if sequence is prefix of chord | `boolean` |
| isExactMatch | Jl3 | Check if sequences match exactly | `boolean` |
| findKeybindingForAction | P$1 | Reverse lookup: action → chord string | `string \| undefined` |
| modifiersMatch | gL7 | Check if modifier flags match | `boolean` |
| eventMatchesKeystroke | FL7 | Full event-to-keystroke comparison | `boolean` |

### React Context & UI (chunks.65.mjs, chunks.117.mjs, chunks.90.mjs)

| Function/Component | Obfuscated | Purpose | Returns |
|-------------------|------------|---------|---------|
| KeybindingSetup | aj | Top-level provider component | `ReactElement` |
| KeybindingHandler | N4Y | Global keystroke listener component | `null` |
| KeybindingContext | G$1 | Context provider | `ReactElement` |
| useKeybindingContext | Wv | Hook to access context | `ContextValue` |
| useRegisterContext | f$1 | Hook to register/unregister context | `void` |
| useKeybindingDisplayText | Rq | Hook to get display text with fallback | `string` |
| useKeybindingDisplayTextSync | PX | Sync lookup with telemetry tracking | `string \| undefined` |
| ShortcutDisplay | a1 | Renders `<shortcut> to <action>` | `ReactElement` |
| KeybindingHint | O8 | Renders keybinding hint with description | `ReactElement` |
| KeybindingHintsList | C8 | Renders list of keybinding hints | `ReactElement` |
| useMemoSlot | A6 | Custom memoization for performance | `[value, element]` |
| CHORD_TIMEOUT_MS | G4Y | Chord completion timeout | `1000` |

### Voice Push-to-Talk

| Function/Component | Obfuscated | Purpose | Returns |
|-------------------|------------|---------|---------|
| VoiceKeybindingHandler | Evz | PTT handler with repeat detection | `null` |
| PTT_ACTIVATION_THRESHOLD | Nvz | Presses needed to activate PTT | `5` |
| PTT_WARMUP_THRESHOLD | Sgq | Presses to show warming indicator | `2` |
| PTT_RESET_TIMEOUT_MS | vvz | Timeout before counter resets (ms) | `120` |
| DEFAULT_PTT_KEYSTROKE | Vvz | Fallback PTT keybinding (Space) | `{key:" "}` |

### Platform-Specific

| Variable | Obfuscated | Purpose | Value |
|----------|------------|---------|-------|
| imagePasteKey | Cu9 | Key for image paste | `alt+v` (Win) / `ctrl+v` (Mac/Linux) |
| modeCycleKey | bu9 | Key for mode cycling | `shift+tab` or `meta+m` |
| supportsShiftTab | Iu9 | Platform supports shift+tab | `boolean` |
| RESERVED_HARDCODED_SHORTCUTS | wp6 | Terminal limitations (ctrl+c, ctrl+d, ctrl+m) | `Array` |
| RESERVED_UNIX_SHORTCUTS | cN8 | Unix signals (ctrl+z, ctrl+\) | `Array` |
| RESERVED_MACOS_SHORTCUTS | lN8 | macOS system shortcuts | `Array` |

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
│    Hl3() normalize event → Z$1() main matching function         │
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
| CHORD_TIMEOUT_MS | G4Y | 1000 | Max time between chord keystrokes (ms) |
| WRITE_STABILITY_THRESHOLD_MS | ru9 | 500 | File watcher debounce delay (ms) |
| WRITE_POLL_INTERVAL_MS | ou9 | 200 | File watcher poll interval (ms) |
| VALID_CONTEXTS | h34 | [18 contexts] | Allowed context names |
| DEFAULT_KEYBINDINGS | XW6 | [...] | Fallback bindings array |
| imagePasteKey | Cu9 | `alt+v` (Win) / `ctrl+v` (Mac/Linux) | Platform-specific image paste |
| modeCycleKey | bu9 | `shift+tab` or `meta+m` | Platform-specific mode cycling |
| supportsShiftTab | Iu9 | `boolean` | Platform shift+tab support flag |
| PTT_ACTIVATION_THRESHOLD | Nvz | 5 | Presses needed to activate voice PTT |
| PTT_WARMUP_THRESHOLD | Sgq | 2 | Presses to show warming indicator |
| PTT_RESET_TIMEOUT_MS | vvz | 120 | Timeout before PTT counter resets (ms) |

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
| `chunks.65.mjs` | Parsing, matching, chord logic, React Context |
| `chunks.89.mjs` | Configuration, validation, file watching, default bindings |
| `chunks.90.mjs` | File watcher constants |
| `chunks.117.mjs` | KeybindingSetup, KeybindingHandler components |

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

## Voice PTT Algorithm Quick Reference

### PTT Activation Sequence

```
User presses PTT key (e.g., 'v')
     │
     ▼
Is voice enabled and available?
     ├─ NO  → Ignore keypress
     └─ YES → Continue
           │
           ▼
     Increment keyPressCount
           │
           ▼
     keyPressCount >= 5 (PTT_ACTIVATION_THRESHOLD)?
           ├─ YES → ACTIVATE PTT
           │        - Strip typed characters
           │        - Start voice recording
           │        - voiceWarmingUp = false
           │
           └─ NO  → Continue
                 │
                 ▼
           keyPressCount >= 2 (PTT_WARMUP_THRESHOLD)?
                 ├─ YES → voiceWarmingUp = true
                 │        Show "warming up" indicator
                 │
                 └─ NO  → Continue accumulating
                       │
                       ▼
                 120ms passes without keypress?
                       ├─ YES → Reset keyPressCount to 0
                       │        voiceWarmingUp = false
                       └─ NO  → Keep waiting for more presses
```

### PTT State Transitions

| State | Trigger | Next State | Action |
|-------|---------|------------|--------|
| Idle | 2+ presses | Warming | Show indicator |
| Warming | 5+ presses | Active | Start recording |
| Warming | 120ms timeout | Idle | Hide indicator |
| Active | Any keypress | Idle | Stop recording |

### Single-Character PTT Detection

```javascript
// Detect if PTT binding is single character (e.g., 'v')
const isSingleCharPTT = pttKeystroke.key.length === 1 &&
                        !pttKeystroke.ctrl &&
                        !pttKeystroke.alt &&
                        !pttKeystroke.shift &&
                        !pttKeystroke.meta;

// Single-char: Count repeated presses (v, vv, vvv...)
// Multi-key: Match exact keystroke combination
```

### Character Stripping During PTT

When PTT activates after typing "vvvvv":
1. `stripTrailing(count, {char: 'v', anchor: true})` called
2. Removes 5 'v' characters from input
3. Prevents PTT activation characters from appearing in text

---

## Summary

This quick reference provides instant lookup for:
- **54 key functions** across configuration, validation, parsing, matching
- **Event flow diagram** showing 7-stage keystroke lifecycle
- **Context system** with all 18 contexts and activation patterns
- **Common patterns** for context registration and handler management
- **Match type decision tree** for understanding keystroke resolution
- **Voice PTT algorithm** for repeated-keypress activation mechanism
- **Constants and error types** for debugging and troubleshooting

For detailed analysis, see individual documentation files in this directory.
