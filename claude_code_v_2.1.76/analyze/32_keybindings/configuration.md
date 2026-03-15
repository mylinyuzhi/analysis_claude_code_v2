# Keybindings Configuration

## Overview

Keybindings in Claude Code v2.1.38 are customizable via `~/.claude/keybindings.json`. This document analyzes the configuration file format, loading mechanism, and default bindings.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

---

## 1. Configuration File

### 1.1 File Location

**Path**: `~/.claude/keybindings.json`

**Format**: JSON object mapping key combinations to actions

**Example**:
```json
{
    "ctrl+s": "submit",
    "ctrl+c": "cancel",
    "ctrl+k ctrl+c": "clear_history",
    "cmd+enter": "submit",
    "escape": "cancel"
}
```

---

### 1.2 File Loading

**Loader**: `loadKeybindings` (YS1, chunks.54.mjs:1700)

**Loading Process**:
1. Check if file exists at `~/.claude/keybindings.json`
2. Read file with UTF-8 encoding
3. Parse as JSON
4. Validate keys and actions
5. Merge with defaults (user overrides take precedence)

**File Watcher**: `watchKeybindingsFile` (Lq7, chunks.54.mjs:1752)
- Watches for file changes via `fs.watch()`
- Auto-reloads on modification
- Hot-reloads without restart

---

## 2. Key Syntax

### 2.1 Modifier Keys

**Platform-Specific Modifiers**:
- **macOS**: `cmd`, `ctrl`, `alt`, `shift`
- **Linux/Windows**: `ctrl`, `alt`, `shift`

**Combinations**: Use `+` to combine modifiers
```
"ctrl+shift+k"
"cmd+alt+f"
```

### 2.2 Chord Sequences

**Multi-Key Sequences**: Use space to separate
```
"ctrl+k ctrl+c"  // Press Ctrl+K, then Ctrl+C
"ctrl+x ctrl+f"  // Emacs-style
```

**Timeout**: 1000ms (CHORD_TIMEOUT_MS, C6Y constant)

---

## 3. Actions

### 3.1 Available Actions

| Action | Description |
|--------|-------------|
| `submit` | Submit current input |
| `cancel` | Cancel current operation |
| `clear_history` | Clear message history |
| `toggle_vim_mode` | Switch Vim mode on/off |
| `focus_input` | Focus input field |

---

## 4. Default Bindings

**Built-in Defaults** (fallback if no config):
```json
{
    "enter": "submit",
    "ctrl+c": "cancel",
    "escape": "cancel",
    "ctrl+l": "clear_history"
}
```

---

## 5. Complete Default Keybindings

**Source**: `kJ1` constant (chunks.54.mjs:1127-1301)

All keybindings are organized by **context** - the UI state where the binding is active. When a key is pressed, Claude Code checks the current active context and executes the corresponding action.

### 5.1 Default Bindings by Context

| Context | Keystroke | Action | Notes |
|---------|-----------|--------|-------|
| **Global** | ctrl+c | app:interrupt | Interrupt current operation |
| Global | ctrl+d | app:exit | Exit application |
| Global | ctrl+t | app:toggleTodos | Show/hide task list |
| Global | ctrl+o | app:toggleTranscript | Show/hide transcript |
| Global | ctrl+shift+o | app:toggleTeammatePreview | Show/hide teammate preview |
| Global | ctrl+r | history:search | Search command history |
| **Chat** | escape | chat:cancel | Cancel current input |
| Chat | shift+tab | chat:cycleMode | Cycle through input modes (platform-dependent) |
| Chat | meta+p | chat:modelPicker | Open model picker |
| Chat | meta+t | chat:thinkingToggle | Toggle thinking mode |
| Chat | enter | chat:submit | Submit message |
| Chat | up | history:previous | Navigate to previous history item |
| Chat | down | history:next | Navigate to next history item |
| Chat | ctrl+_ | chat:undo | Undo last action |
| Chat | ctrl+shift+- | chat:undo | Undo last action (alternative) |
| Chat | ctrl+g | chat:externalEditor | Open external editor |
| Chat | ctrl+s | chat:stash | Stash current input |
| Chat | ctrl+v OR alt+v | chat:imagePaste | Paste image (platform-dependent) |
| **Autocomplete** | tab | autocomplete:accept | Accept suggestion |
| Autocomplete | escape | autocomplete:dismiss | Dismiss suggestions |
| Autocomplete | up | autocomplete:previous | Previous suggestion |
| Autocomplete | down | autocomplete:next | Next suggestion |
| **Settings** | escape | confirm:no | Cancel/reject |
| Settings | up | select:previous | Move up |
| Settings | down | select:next | Move down |
| Settings | k | select:previous | Vim-style up |
| Settings | j | select:next | Vim-style down |
| Settings | ctrl+p | select:previous | Emacs-style up |
| Settings | ctrl+n | select:next | Emacs-style down |
| Settings | enter | select:accept | Confirm selection |
| Settings | space | select:accept | Confirm selection |
| Settings | / | settings:search | Search settings |
| Settings | r | settings:retry | Retry operation |
| **Confirmation** | y | confirm:yes | Confirm yes |
| Confirmation | n | confirm:no | Confirm no |
| Confirmation | enter | confirm:yes | Confirm yes |
| Confirmation | escape | confirm:no | Cancel/no |
| Confirmation | up | confirm:previous | Previous option |
| Confirmation | down | confirm:next | Next option |
| Confirmation | tab | confirm:nextField | Next form field |
| Confirmation | space | confirm:toggle | Toggle checkbox |
| Confirmation | shift+tab | confirm:cycleMode | Cycle mode |
| Confirmation | ctrl+e | confirm:toggleExplanation | Show/hide explanation |
| Confirmation | ctrl+d | permission:toggleDebug | Toggle debug info |
| **Tabs** | tab | tabs:next | Next tab |
| Tabs | shift+tab | tabs:previous | Previous tab |
| Tabs | right | tabs:next | Next tab (arrow key) |
| Tabs | left | tabs:previous | Previous tab (arrow key) |
| **Transcript** | ctrl+e | transcript:toggleShowAll | Toggle show all |
| Transcript | ctrl+c | transcript:exit | Exit transcript |
| Transcript | escape | transcript:exit | Exit transcript |
| **HistorySearch** | ctrl+r | historySearch:next | Next match |
| HistorySearch | escape | historySearch:accept | Accept and exit |
| HistorySearch | tab | historySearch:accept | Accept and exit |
| HistorySearch | ctrl+c | historySearch:cancel | Cancel search |
| HistorySearch | enter | historySearch:execute | Execute selected |
| **Task** | ctrl+b | task:background | Move task to background |
| **ThemePicker** | ctrl+t | theme:toggleSyntaxHighlighting | Toggle syntax colors |
| **Help** | escape | help:dismiss | Close help |
| **Attachments** | right | attachments:next | Next attachment |
| Attachments | left | attachments:previous | Previous attachment |
| Attachments | backspace | attachments:remove | Remove attachment |
| Attachments | delete | attachments:remove | Remove attachment |
| Attachments | down | attachments:exit | Exit attachments |
| Attachments | escape | attachments:exit | Exit attachments |
| **Footer** | right | footer:next | Next footer item |
| Footer | left | footer:previous | Previous footer item |
| Footer | enter | footer:openSelected | Open selected |
| Footer | escape | footer:clearSelection | Clear selection |
| **MessageSelector** | up | messageSelector:up | Move up |
| MessageSelector | down | messageSelector:down | Move down |
| MessageSelector | k | messageSelector:up | Vim-style up |
| MessageSelector | j | messageSelector:down | Vim-style down |
| MessageSelector | ctrl+up | messageSelector:top | Jump to top |
| MessageSelector | shift+up | messageSelector:top | Jump to top |
| MessageSelector | meta+up | messageSelector:top | Jump to top |
| MessageSelector | shift+k | messageSelector:top | Jump to top (Vim) |
| MessageSelector | ctrl+down | messageSelector:bottom | Jump to bottom |
| MessageSelector | shift+down | messageSelector:bottom | Jump to bottom |
| MessageSelector | meta+down | messageSelector:bottom | Jump to bottom |
| MessageSelector | shift+j | messageSelector:bottom | Jump to bottom (Vim) |
| MessageSelector | enter | messageSelector:select | Select message |
| **DiffDialog** | escape | diff:dismiss | Close diff |
| DiffDialog | left | diff:previousSource | Previous source |
| DiffDialog | right | diff:nextSource | Next source |
| DiffDialog | up | diff:previousFile | Previous file |
| DiffDialog | down | diff:nextFile | Next file |
| DiffDialog | enter | diff:viewDetails | View details |
| **ModelPicker** | left | modelPicker:decreaseEffort | Lower effort level |
| ModelPicker | right | modelPicker:increaseEffort | Increase effort level |
| **Select** | up | select:previous | Previous item |
| Select | down | select:next | Next item |
| Select | j | select:next | Vim-style down |
| Select | k | select:previous | Vim-style up |
| Select | ctrl+n | select:next | Emacs-style down |
| Select | ctrl+p | select:previous | Emacs-style up |
| Select | enter | select:accept | Confirm |
| Select | escape | select:cancel | Cancel |
| **Plugin** | space | plugin:toggle | Enable/disable |
| Plugin | i | plugin:install | Install plugin |

### 5.2 Platform-Specific Variations

**Image Paste Key** (nE5):
- **Windows**: `alt+v` (because ctrl+v is reserved for system paste)
- **macOS/Linux**: `ctrl+v`

**Mode Cycle Key** (oE5):
- **Modern Runtime** (Node 22.17+, 24.2+ or Bun 1.2.23+): `shift+tab`
- **Older Runtime**: `meta+m` (fallback due to terminal limitations)

**Platform Detection**:
```javascript
// ============================================
// platformVariableKeybindings - Platform-specific key assignments
// Location: chunks.54.mjs:1124-1126
// ============================================

// ORIGINAL (for source lookup):
nE5 = eA() === "windows" ? "alt+v" : "ctrl+v",
rE5 = eA() !== "windows" || (s21() ? nqA.default.satisfies(process.versions.bun, ">=1.2.23") : nqA.default.satisfies(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")),
oE5 = rE5 ? "shift+tab" : "meta+m"

// READABLE (for understanding):
imagePasteKey = getPlatform() === "windows" ? "alt+v" : "ctrl+v",
supportsShiftTab = getPlatform() !== "windows" || (isBun() ? semver.satisfies(process.versions.bun, ">=1.2.23") : semver.satisfies(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")),
modeCycleKey = supportsShiftTab ? "shift+tab" : "meta+m"

// Mapping: nE5→imagePasteKey, eA→getPlatform, rE5→supportsShiftTab, s21→isBun, nqA→semver, oE5→modeCycleKey
```

**Why this matters**:
- Older Node.js versions on Windows don't properly distinguish shift+tab from tab due to terminal input limitations
- The fallback to meta+m ensures mode cycling always works
- Image paste uses alt+v on Windows because ctrl+v is reserved for system clipboard paste

---

## 6. Validation Deep Dive

Keybindings validation is a **multi-layered pipeline** that catches errors at parse time, preventing broken configurations from breaking the UI. All validation happens synchronously when the config file is loaded.

### 6.1 Validation Pipeline

**Orchestrator**: `validateKeybindingsComprehensive` (sqA, chunks.54.mjs:1579-1592)

The validation pipeline runs in this order:

1. **Array Structure** → `validateKeybindingsArray` (qk5)
2. **Duplicate Detection** → `detectDuplicateBindings` (Kk5)
3. **Reserved Key Conflicts** → `detectReservedKeyConflicts` (Yk5)
4. **JSON Linting** → `detectMalformedJSON` (aqA)

```javascript
// ============================================
// validateKeybindingsComprehensive - Main validation orchestrator
// Location: chunks.54.mjs:1579-1592
// ============================================

// ORIGINAL (for source lookup):
function sqA(A, q) {
    let K = [];
    if (K.push(...qk5(A)), sE5(A)) {
        K.push(...Kk5(A));
        let z = zk5(A);
        K.push(...Yk5(z))
    }
    let Y = new Set;
    return K.filter((z) => {
        let w = `${z.type}:${z.key}:${z.context}`;
        if (Y.has(w)) return !1;
        return Y.add(w), !0
    })
}

// READABLE (for understanding):
function validateKeybindingsComprehensive(bindings, mergedBindings) {
    let errors = [];

    // Step 1: Validate array structure and each block
    errors.push(...validateKeybindingsArray(bindings));

    // Step 2: Only proceed with duplicate/reserved checks if structure is valid
    if (isValidKeybindingBlockArray(bindings)) {
        errors.push(...detectDuplicateBindings(bindings));

        let flatBindings = flattenKeybindingsForValidation(bindings);
        errors.push(...detectReservedKeyConflicts(flatBindings));
    }

    // Step 3: Deduplicate error messages (same type+key+context)
    let seen = new Set();
    return errors.filter((error) => {
        let key = `${error.type}:${error.key}:${error.context}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// Mapping: sqA→validateKeybindingsComprehensive, A→bindings, q→mergedBindings, K→errors, qk5→validateKeybindingsArray, sE5→isValidKeybindingBlockArray, Kk5→detectDuplicateBindings, zk5→flattenKeybindingsForValidation, Yk5→detectReservedKeyConflicts, Y→seen, z→error, w→key
```

**Key insight**: The validator uses a **fail-fast** approach for structural validation but **continues** to collect all semantic errors (duplicates, reserved keys). This gives users a complete picture of what needs fixing.

---

### 6.2 Validator 1: Array Structure

**Function**: `validateKeybindingsArray` (qk5, chunks.54.mjs:1510-1520)

**Purpose**: Ensures the top-level structure is an array and each block has valid structure.

```javascript
// ============================================
// validateKeybindingsArray - Top-level array validation
// Location: chunks.54.mjs:1510-1520
// ============================================

// ORIGINAL (for source lookup):
function qk5(A) {
    let q = [];
    if (!Array.isArray(A)) return q.push({
        type: "parse_error",
        severity: "error",
        message: "keybindings.json must contain an array",
        suggestion: "Wrap your bindings in [ ]"
    }), q;
    for (let K = 0; K < A.length; K++) q.push(...Ak5(A[K], K));
    return q
}

// READABLE (for understanding):
function validateKeybindingsArray(bindings) {
    let errors = [];

    // Check if top-level is an array
    if (!Array.isArray(bindings)) {
        errors.push({
            type: "parse_error",
            severity: "error",
            message: "keybindings.json must contain an array",
            suggestion: "Wrap your bindings in [ ]"
        });
        return errors;
    }

    // Validate each block in the array
    for (let index = 0; index < bindings.length; index++) {
        errors.push(...validateKeybindingBlock(bindings[index], index));
    }

    return errors;
}

// Mapping: qk5→validateKeybindingsArray, A→bindings, q→errors, K→index, Ak5→validateKeybindingBlock
```

---

### 6.3 Validator 2: Block Structure

**Function**: `validateKeybindingBlock` (Ak5, chunks.54.mjs:1420-1480)

**Purpose**: Validates each keybinding block (context + bindings object) and individual keystroke syntax.

```javascript
// ============================================
// validateKeybindingBlock - Single block validation
// Location: chunks.54.mjs:1420-1480
// ============================================

// ORIGINAL (for source lookup):
function Ak5(A, q) {
    let K = [];
    if (typeof A !== "object" || A === null) return K.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${q+1} is not an object`
    }), K;
    let Y = A, z = Y.context, w;
    if (typeof z !== "string") K.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${q+1} missing "context" field`
    });
    else if (!tE5(z)) K.push({
        type: "invalid_context",
        severity: "error",
        message: `Unknown context "${z}"`,
        context: z,
        suggestion: `Valid contexts: ${Gq7.join(", ")}`
    });
    else w = z;
    if (typeof Y.bindings !== "object" || Y.bindings === null) return K.push({
        type: "parse_error",
        severity: "error",
        message: `Keybinding block ${q+1} missing "bindings" field`
    }), K;
    let H = Y.bindings;
    for (let [$, O] of Object.entries(H)) {
        let _ = eE5($);
        if (_) _.context = w, K.push(_);
        if (O !== null && typeof O !== "string") K.push({
            type: "invalid_action",
            severity: "error",
            message: `Invalid action for "${$}": must be a string or null`,
            key: $,
            context: w
        });
        else if (typeof O === "string" && O.startsWith("command:")) {
            if (!/^command:[a-zA-Z0-9:\-_]+$/.test(O)) K.push({
                type: "invalid_action",
                severity: "warning",
                message: `Invalid command binding "${O}" for "${$}": command name may only contain alphanumeric characters, colons, hyphens, and underscores`,
                key: $,
                context: w,
                action: O
            });
            if (w && w !== "Chat") K.push({
                type: "invalid_action",
                severity: "warning",
                message: `Command binding "${O}" must be in "Chat" context, not "${w}"`,
                key: $,
                context: w,
                action: O,
                suggestion: 'Move this binding to a block with "context": "Chat"'
            })
        }
    }
    return K
}

// READABLE (for understanding):
function validateKeybindingBlock(block, index) {
    let errors = [];

    // Check if block is an object
    if (typeof block !== "object" || block === null) {
        errors.push({
            type: "parse_error",
            severity: "error",
            message: `Keybinding block ${index+1} is not an object`
        });
        return errors;
    }

    let contextName = block.context;
    let validContext;

    // Validate context field
    if (typeof contextName !== "string") {
        errors.push({
            type: "parse_error",
            severity: "error",
            message: `Keybinding block ${index+1} missing "context" field`
        });
    } else if (!isValidContext(contextName)) {
        errors.push({
            type: "invalid_context",
            severity: "error",
            message: `Unknown context "${contextName}"`,
            context: contextName,
            suggestion: `Valid contexts: ${VALID_CONTEXTS.join(", ")}`
        });
    } else {
        validContext = contextName;
    }

    // Validate bindings field
    if (typeof block.bindings !== "object" || block.bindings === null) {
        errors.push({
            type: "parse_error",
            severity: "error",
            message: `Keybinding block ${index+1} missing "bindings" field`
        });
        return errors;
    }

    // Validate each individual binding
    let bindings = block.bindings;
    for (let [key, action] of Object.entries(bindings)) {
        // Validate keystroke syntax
        let keystrokeError = parseAndValidateKeystroke(key);
        if (keystrokeError) {
            keystrokeError.context = validContext;
            errors.push(keystrokeError);
        }

        // Validate action value
        if (action !== null && typeof action !== "string") {
            errors.push({
                type: "invalid_action",
                severity: "error",
                message: `Invalid action for "${key}": must be a string or null`,
                key: key,
                context: validContext
            });
        } else if (typeof action === "string" && action.startsWith("command:")) {
            // Special validation for command: bindings
            if (!/^command:[a-zA-Z0-9:\-_]+$/.test(action)) {
                errors.push({
                    type: "invalid_action",
                    severity: "warning",
                    message: `Invalid command binding "${action}" for "${key}": command name may only contain alphanumeric characters, colons, hyphens, and underscores`,
                    key: key,
                    context: validContext,
                    action: action
                });
            }
            if (validContext && validContext !== "Chat") {
                errors.push({
                    type: "invalid_action",
                    severity: "warning",
                    message: `Command binding "${action}" must be in "Chat" context, not "${validContext}"`,
                    key: key,
                    context: validContext,
                    action: action,
                    suggestion: 'Move this binding to a block with "context": "Chat"'
                });
            }
        }
    }

    return errors;
}

// Mapping: Ak5→validateKeybindingBlock, A→block, q→index, K→errors, Y→block, z→contextName, w→validContext, tE5→isValidContext, Gq7→VALID_CONTEXTS, H→bindings, $→key, O→action, _→keystrokeError, eE5→parseAndValidateKeystroke
```

**Why command: bindings require Chat context**: Command bindings invoke slash commands (like `/commit`, `/review-pr`), which are only available in the Chat input context. Binding them elsewhere would fail silently.

---

### 6.4 Validator 3: Keystroke Syntax

**Function**: `parseAndValidateKeystroke` (eE5, chunks.54.mjs:1400-1418)

**Purpose**: Validates individual keystroke syntax (no empty parts, parseable format).

```javascript
// ============================================
// parseAndValidateKeystroke - Keystroke format validation
// Location: chunks.54.mjs:1400-1418
// ============================================

// ORIGINAL (for source lookup):
function eE5(A) {
    let q = A.toLowerCase().split("+");
    for (let Y of q)
        if (!Y.trim()) return {
            type: "parse_error",
            severity: "error",
            message: `Empty key part in "${A}"`,
            key: A,
            suggestion: 'Remove extra "+" characters'
        };
    let K = iC1(A);
    if (!K.key && !K.ctrl && !K.alt && !K.shift && !K.meta) return {
        type: "parse_error",
        severity: "error",
        message: `Could not parse keystroke "${A}"`,
        key: A
    };
    return null
}

// READABLE (for understanding):
function parseAndValidateKeystroke(keystroke) {
    // Check for empty parts (e.g., "ctrl++" or "ctrl+ ")
    let parts = keystroke.toLowerCase().split("+");
    for (let part of parts) {
        if (!part.trim()) {
            return {
                type: "parse_error",
                severity: "error",
                message: `Empty key part in "${keystroke}"`,
                key: keystroke,
                suggestion: 'Remove extra "+" characters'
            };
        }
    }

    // Try to parse the keystroke
    let parsed = parseKeystroke(keystroke);
    if (!parsed.key && !parsed.ctrl && !parsed.alt && !parsed.shift && !parsed.meta) {
        return {
            type: "parse_error",
            severity: "error",
            message: `Could not parse keystroke "${keystroke}"`,
            key: keystroke
        };
    }

    return null; // Valid
}

// Mapping: eE5→parseAndValidateKeystroke, A→keystroke, q→parts, Y→part, K→parsed, iC1→parseKeystroke
```

---

### 6.5 Validator 4: Duplicate Bindings

**Function**: `detectDuplicateBindings` (Kk5, chunks.54.mjs:1522-1544)

**Purpose**: Detects when the same keystroke appears multiple times in the same context.

```javascript
// ============================================
// detectDuplicateBindings - Find duplicate keys in same context
// Location: chunks.54.mjs:1522-1544
// ============================================

// ORIGINAL (for source lookup):
function Kk5(A) {
    let q = [], K = new Map;
    for (let Y of A) {
        let z = K.get(Y.context) ?? new Map;
        K.set(Y.context, z);
        for (let [w, H] of Object.entries(Y.bindings)) {
            let $ = k71(w), O = z.get($);
            if (O && O !== H) q.push({
                type: "duplicate",
                severity: "warning",
                message: `Duplicate binding "${w}" in ${Y.context} context`,
                key: w,
                context: Y.context,
                action: H ?? "null (unbind)",
                suggestion: `Previously bound to "${O}". Only the last binding will be used.`
            });
            z.set($, H ?? "null")
        }
    }
    return q
}

// READABLE (for understanding):
function detectDuplicateBindings(blocks) {
    let errors = [];
    let contextMap = new Map(); // context -> (normalizedKey -> action)

    for (let block of blocks) {
        // Get or create map for this context
        let keyMap = contextMap.get(block.context) ?? new Map();
        contextMap.set(block.context, keyMap);

        for (let [keystroke, action] of Object.entries(block.bindings)) {
            // Normalize keystroke (e.g., "Ctrl+C" -> "ctrl+c")
            let normalized = normalizeKeystroke(keystroke);
            let previousAction = keyMap.get(normalized);

            // Check if this key was already bound to a different action
            if (previousAction && previousAction !== action) {
                errors.push({
                    type: "duplicate",
                    severity: "warning",
                    message: `Duplicate binding "${keystroke}" in ${block.context} context`,
                    key: keystroke,
                    context: block.context,
                    action: action ?? "null (unbind)",
                    suggestion: `Previously bound to "${previousAction}". Only the last binding will be used.`
                });
            }

            // Record this binding
            keyMap.set(normalized, action ?? "null");
        }
    }

    return errors;
}

// Mapping: Kk5→detectDuplicateBindings, A→blocks, q→errors, K→contextMap, Y→block, z→keyMap, w→keystroke, H→action, k71→normalizeKeystroke, $→normalized, O→previousAction
```

**Why normalization matters**: Users might write `"Ctrl+C"`, `"ctrl+c"`, or `"CTRL+C"` - all should be treated as the same binding.

---

### 6.6 Validator 5: Reserved Key Conflicts

**Function**: `detectReservedKeyConflicts` (Yk5, chunks.54.mjs:1546-1563)

**Purpose**: Warns when user tries to rebind platform-reserved shortcuts.

```javascript
// ============================================
// detectReservedKeyConflicts - Check against platform-reserved shortcuts
// Location: chunks.54.mjs:1546-1563
// ============================================

// ORIGINAL (for source lookup):
function Yk5(A) {
    let q = [], K = Wq7();
    for (let Y of A) {
        let z = oK6(Y.chord), w = k71(z);
        for (let H of K)
            if (k71(H.key) === w) q.push({
                type: "reserved",
                severity: H.severity,
                message: `"${z}" may not work: ${H.reason}`,
                key: z,
                context: Y.context,
                action: Y.action ?? void 0
            })
    }
    return q
}

// READABLE (for understanding):
function detectReservedKeyConflicts(flatBindings) {
    let errors = [];
    let reservedShortcuts = getReservedShortcuts(); // Platform-specific list

    for (let binding of flatBindings) {
        // Convert chord array back to string (e.g., "ctrl+c")
        let keystrokeString = stringifyChord(binding.chord);
        let normalized = normalizeKeystroke(keystrokeString);

        // Check against all reserved shortcuts
        for (let reserved of reservedShortcuts) {
            if (normalizeKeystroke(reserved.key) === normalized) {
                errors.push({
                    type: "reserved",
                    severity: reserved.severity, // "error" or "warning"
                    message: `"${keystrokeString}" may not work: ${reserved.reason}`,
                    key: keystrokeString,
                    context: binding.context,
                    action: binding.action ?? undefined
                });
            }
        }
    }

    return errors;
}

// Mapping: Yk5→detectReservedKeyConflicts, A→flatBindings, q→errors, K→reservedShortcuts, Wq7→getReservedShortcuts, Y→binding, z→keystrokeString, oK6→stringifyChord, w→normalized, k71→normalizeKeystroke, H→reserved
```

---

### 6.7 Validator 6: Malformed JSON

**Function**: `detectMalformedJSON` (aqA, chunks.54.mjs:1482-1508)

**Purpose**: Uses **regex-based** parsing to detect duplicate keys in JSON source (before JSON.parse merges them).

```javascript
// ============================================
// detectMalformedJSON - Regex-based duplicate key detection
// Location: chunks.54.mjs:1482-1508
// ============================================

// ORIGINAL (for source lookup):
function aqA(A) {
    let q = [], K = /"bindings"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, Y;
    while ((Y = K.exec(A)) !== null) {
        let z = Y[1];
        if (!z) continue;
        let $ = A.slice(0, Y.index).match(/"context"\s*:\s*"([^"]+)"[^{]*$/)?.[1] ?? "unknown",
            O = /"([^"]+)"\s*:/g, _ = new Map, J;
        while ((J = O.exec(z)) !== null) {
            let X = J[1];
            if (!X) continue;
            let D = (_.get(X) ?? 0) + 1;
            if (_.set(X, D), D === 2) q.push({
                type: "duplicate",
                severity: "warning",
                message: `Duplicate key "${X}" in ${$} bindings`,
                key: X,
                context: $,
                suggestion: "This key appears multiple times in the same context. JSON uses the last value, earlier values are ignored."
            })
        }
    }
    return q
}

// READABLE (for understanding):
function detectMalformedJSON(jsonSource) {
    let errors = [];

    // Find all "bindings" objects in the JSON source
    let bindingsRegex = /"bindings"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let bindingsMatch;

    while ((bindingsMatch = bindingsRegex.exec(jsonSource)) !== null) {
        let bindingsContent = bindingsMatch[1];
        if (!bindingsContent) continue;

        // Find the context name before this bindings block
        let contextName = jsonSource
            .slice(0, bindingsMatch.index)
            .match(/"context"\s*:\s*"([^"]+)"[^{]*$/)?.[1] ?? "unknown";

        // Find all keys in this bindings object
        let keyRegex = /"([^"]+)"\s*:/g;
        let keyCountMap = new Map();
        let keyMatch;

        while ((keyMatch = keyRegex.exec(bindingsContent)) !== null) {
            let keyName = keyMatch[1];
            if (!keyName) continue;

            let count = (keyCountMap.get(keyName) ?? 0) + 1;
            keyCountMap.set(keyName, count);

            // Report duplicate on second occurrence
            if (count === 2) {
                errors.push({
                    type: "duplicate",
                    severity: "warning",
                    message: `Duplicate key "${keyName}" in ${contextName} bindings`,
                    key: keyName,
                    context: contextName,
                    suggestion: "This key appears multiple times in the same context. JSON uses the last value, earlier values are ignored."
                });
            }
        }
    }

    return errors;
}

// Mapping: aqA→detectMalformedJSON, A→jsonSource, q→errors, K→bindingsRegex, Y→bindingsMatch, z→bindingsContent, $→contextName, O→keyRegex, _→keyCountMap, J→keyMatch, X→keyName, D→count
```

**Why regex validation**: JSON.parse() silently merges duplicate keys, using the last value. This validator catches duplicates **before** parsing, so users know they have redundant entries.

---

### 6.8 Error Types Reference

| Type | Severity | Description | Example |
|------|----------|-------------|---------|
| `parse_error` | error | Invalid JSON structure, missing fields, wrong types | `"bindings" must be an array` |
| `invalid_context` | error | Unknown context name | `Unknown context "Foo"` |
| `invalid_action` | error/warning | Invalid action format or wrong context for command: | `Invalid command binding` |
| `duplicate` | warning | Same keystroke bound multiple times | `Duplicate binding "ctrl+c"` |
| `reserved` | error/warning | Platform-reserved shortcut conflict | `"ctrl+c" may not work: used for interrupt` |

**Severity levels**:
- **error**: Config will not load, falls back to defaults
- **warning**: Config loads, but specific bindings may not work as expected

---

## 7. Reserved Shortcuts

Reserved shortcuts are **platform-specific** shortcuts that either:
1. **Cannot be intercepted** by the application (OS-level bindings)
2. **Should not be rebound** due to terminal/shell conventions

### 7.1 Unix/Linux Reserved Shortcuts

**Source**: `qS1`, `rqA` (chunks.54.mjs:1335-1354)

```javascript
// ============================================
// RESERVED_UNIX_SHORTCUTS - Hardcoded terminal shortcuts
// Location: chunks.54.mjs:1335-1346
// ============================================

// ORIGINAL (for source lookup):
qS1 = [{
    key: "ctrl+c",
    reason: "Cannot be rebound - used for interrupt/exit (hardcoded)",
    severity: "error"
}, {
    key: "ctrl+d",
    reason: "Cannot be rebound - used for exit (hardcoded)",
    severity: "error"
}, {
    key: "ctrl+m",
    reason: "Cannot be rebound - identical to Enter in terminals (both send CR)",
    severity: "error"
}]

// READABLE (for understanding):
RESERVED_UNIX_SHORTCUTS = [
    {
        key: "ctrl+c",
        reason: "Cannot be rebound - used for interrupt/exit (hardcoded)",
        severity: "error"
    },
    {
        key: "ctrl+d",
        reason: "Cannot be rebound - used for exit (hardcoded)",
        severity: "error"
    },
    {
        key: "ctrl+m",
        reason: "Cannot be rebound - identical to Enter in terminals (both send CR)",
        severity: "error"
    }
];

// Mapping: qS1→RESERVED_UNIX_SHORTCUTS
```

```javascript
// ============================================
// RESERVED_UNIX_COMMON - Unix signal shortcuts
// Location: chunks.54.mjs:1347-1354
// ============================================

// ORIGINAL (for source lookup):
rqA = [{
    key: "ctrl+z",
    reason: "Unix process suspend (SIGTSTP)",
    severity: "warning"
}, {
    key: "ctrl+\\",
    reason: "Terminal quit signal (SIGQUIT)",
    severity: "error"
}]

// READABLE (for understanding):
RESERVED_UNIX_COMMON = [
    {
        key: "ctrl+z",
        reason: "Unix process suspend (SIGTSTP)",
        severity: "warning"
    },
    {
        key: "ctrl+\\",
        reason: "Terminal quit signal (SIGQUIT)",
        severity: "error"
    }
];

// Mapping: rqA→RESERVED_UNIX_COMMON
```

**Why these can't be rebound**:
- **ctrl+c**: Sends SIGINT signal, hardcoded in terminal drivers and shell
- **ctrl+d**: Sends EOF signal, triggers application exit
- **ctrl+m**: Sends Carriage Return (CR) character, identical to Enter at terminal level
- **ctrl+z**: Sends SIGTSTP, suspends process (can resume with `fg`)
- **ctrl+\\**: Sends SIGQUIT, force-quits application with core dump

---

### 7.2 macOS Reserved Shortcuts

**Source**: `oqA` (chunks.54.mjs:1355-1383)

```javascript
// ============================================
// RESERVED_MACOS_SHORTCUTS - System-level macOS bindings
// Location: chunks.54.mjs:1355-1383
// ============================================

// ORIGINAL (for source lookup):
oqA = [{
    key: "cmd+c",
    reason: "macOS system copy",
    severity: "error"
}, {
    key: "cmd+v",
    reason: "macOS system paste",
    severity: "error"
}, {
    key: "cmd+x",
    reason: "macOS system cut",
    severity: "error"
}, {
    key: "cmd+q",
    reason: "macOS quit application",
    severity: "error"
}, {
    key: "cmd+w",
    reason: "macOS close window/tab",
    severity: "error"
}, {
    key: "cmd+tab",
    reason: "macOS app switcher",
    severity: "error"
}, {
    key: "cmd+space",
    reason: "macOS Spotlight",
    severity: "error"
}]

// READABLE (for understanding):
RESERVED_MACOS_SHORTCUTS = [
    {
        key: "cmd+c",
        reason: "macOS system copy",
        severity: "error"
    },
    {
        key: "cmd+v",
        reason: "macOS system paste",
        severity: "error"
    },
    {
        key: "cmd+x",
        reason: "macOS system cut",
        severity: "error"
    },
    {
        key: "cmd+q",
        reason: "macOS quit application",
        severity: "error"
    },
    {
        key: "cmd+w",
        reason: "macOS close window/tab",
        severity: "error"
    },
    {
        key: "cmd+tab",
        reason: "macOS app switcher",
        severity: "error"
    },
    {
        key: "cmd+space",
        reason: "macOS Spotlight",
        severity: "error"
    }
];

// Mapping: oqA→RESERVED_MACOS_SHORTCUTS
```

**Why these can't be rebound**:
- Handled by macOS **before** the application receives input
- Users expect these to work system-wide
- Rebinding would break muscle memory and accessibility features

---

### 7.3 Platform Detection

**Function**: `getReservedShortcuts` (Wq7, chunks.54.mjs:1304-1309)

```javascript
// ============================================
// getReservedShortcuts - Platform-aware reserved shortcut list
// Location: chunks.54.mjs:1304-1309
// ============================================

// ORIGINAL (for source lookup):
function Wq7() {
    let A = eA(),
        q = [...qS1, ...rqA];
    if (A === "macos") q.push(...oqA);
    return q
}

// READABLE (for understanding):
function getReservedShortcuts() {
    let platform = getPlatform();

    // Start with Unix shortcuts (all platforms)
    let reserved = [...RESERVED_UNIX_SHORTCUTS, ...RESERVED_UNIX_COMMON];

    // Add macOS-specific shortcuts
    if (platform === "macos") {
        reserved.push(...RESERVED_MACOS_SHORTCUTS);
    }

    return reserved;
}

// Mapping: Wq7→getReservedShortcuts, A→platform, eA→getPlatform, q→reserved, qS1→RESERVED_UNIX_SHORTCUTS, rqA→RESERVED_UNIX_COMMON, oqA→RESERVED_MACOS_SHORTCUTS
```

**Conflict reporting**:
- **Error severity**: Binding will never work, blocks config loading
- **Warning severity**: Binding might work but is not recommended

---

## 8. Hot-Reload Mechanism

The keybindings system supports **hot-reload** - file changes are detected and applied immediately without restarting Claude Code. This is implemented using the **chokidar** file watcher library.

### 8.1 Watcher Setup

**Function**: `watchKeybindingsFile` (Lq7, chunks.54.mjs:1752-1780)

```javascript
// ============================================
// watchKeybindingsFile - Initialize file watcher for hot-reload
// Location: chunks.54.mjs:1752-1780
// ============================================

// ORIGINAL (for source lookup):
async function Lq7() {
    if (fq7 || Tq7) return;
    if (!Hv()) {
        h("[keybindings] Skipping file watcher - user customization disabled");
        return
    }
    let A = R71(), q = _k5(A);
    try {
        if (!(await Hk5(q)).isDirectory()) {
            h(`[keybindings] Not watching: ${q} is not a directory`);
            return
        }
    } catch {
        h(`[keybindings] Not watching: ${q} does not exist`);
        return
    }
    fq7 = !0, h(`[keybindings] Watching for changes to ${A}`), L71 = wH1.watch(A, {
        persistent: !0,
        ignoreInitial: !0,
        awaitWriteFinish: {
            stabilityThreshold: Jk5,
            pollInterval: Xk5
        },
        ignorePermissionErrors: !0,
        usePolling: !1,
        atomic: !0
    }), L71.on("add", Nq7), L71.on("change", Nq7), L71.on("unlink", Wk5), Tq(async () => Pk5())
}

// READABLE (for understanding):
async function watchKeybindingsFile() {
    // Prevent duplicate watchers
    if (isWatcherInitialized || isWatcherCleaned) return;

    // Feature flag check
    if (!isKeybindingCustomizationEnabled()) {
        log("[keybindings] Skipping file watcher - user customization disabled");
        return;
    }

    let filePath = getKeybindingsFilePath(); // ~/.claude/keybindings.json
    let parentDir = dirname(filePath);       // ~/.claude

    // Ensure parent directory exists
    try {
        if (!(await stat(parentDir)).isDirectory()) {
            log(`[keybindings] Not watching: ${parentDir} is not a directory`);
            return;
        }
    } catch {
        log(`[keybindings] Not watching: ${parentDir} does not exist`);
        return;
    }

    // Mark watcher as initialized
    isWatcherInitialized = true;
    log(`[keybindings] Watching for changes to ${filePath}`);

    // Create chokidar watcher
    fileWatcher = chokidar.watch(filePath, {
        persistent: true,              // Keep process alive
        ignoreInitial: true,           // Don't trigger on startup
        awaitWriteFinish: {            // Wait for file write to complete
            stabilityThreshold: WATCH_STABILITY_THRESHOLD_MS, // 500ms
            pollInterval: WATCH_POLL_INTERVAL_MS              // 200ms
        },
        ignorePermissionErrors: true,  // Don't crash on permission issues
        usePolling: false,             // Use native FS events (faster)
        atomic: true                   // Handle atomic writes (temp file + rename)
    });

    // Register event handlers
    fileWatcher.on("add", handleKeybindingsFileChange);
    fileWatcher.on("change", handleKeybindingsFileChange);
    fileWatcher.on("unlink", handleKeybindingsFileDelete);

    // Register cleanup on process exit
    onProcessExit(async () => stopWatchingKeybindings());
}

// Mapping: Lq7→watchKeybindingsFile, fq7→isWatcherInitialized, Tq7→isWatcherCleaned, Hv→isKeybindingCustomizationEnabled, h→log, A→filePath, R71→getKeybindingsFilePath, q→parentDir, _k5→dirname, Hk5→stat, L71→fileWatcher, wH1→chokidar, Jk5→WATCH_STABILITY_THRESHOLD_MS, Xk5→WATCH_POLL_INTERVAL_MS, Nq7→handleKeybindingsFileChange, Wk5→handleKeybindingsFileDelete, Tq→onProcessExit, Pk5→stopWatchingKeybindings
```

**Why these settings matter**:

**stabilityThreshold: 500ms**
- Waits 500ms after last file change before triggering reload
- Prevents multiple reloads when editors save in multiple steps (write → fsync → metadata update)
- Essential for editors like VSCode that do atomic writes via temp files

**pollInterval: 200ms**
- Checks file size every 200ms during the stability window
- Faster polling = quicker detection that write has finished
- 200ms balances responsiveness with CPU usage

**atomic: true**
- Handles editors that write to temp file then rename (atomic write pattern)
- Without this, watcher might trigger on half-written temp file

**persistent: true**
- Keeps Node.js event loop alive even if no other work
- Required for CLI tools that otherwise exit when idle

---

### 8.2 Change Detection

**Function**: `handleKeybindingsFileChange` (Nq7, chunks.54.mjs:1793-1801)

```javascript
// ============================================
// handleKeybindingsFileChange - Reload bindings on file change
// Location: chunks.54.mjs:1793-1801
// ============================================

// ORIGINAL (for source lookup):
async function Nq7(A) {
    h(`[keybindings] Detected change to ${A}`);
    try {
        let q = await Mk5();
        ZM = q.bindings, GW = q.warnings, KS1.forEach((K) => K(q))
    } catch (q) {
        h(`[keybindings] Error reloading: ${q instanceof Error?q.message:String(q)}`)
    }
}

// READABLE (for understanding):
async function handleKeybindingsFileChange(filePath) {
    log(`[keybindings] Detected change to ${filePath}`);

    try {
        // Reload keybindings from disk
        let result = await loadKeybindingsAsync();

        // Update global cache
        cachedBindings = result.bindings;
        cachedWarnings = result.warnings;

        // Notify all registered listeners
        changeListeners.forEach((listener) => listener(result));
    } catch (error) {
        log(`[keybindings] Error reloading: ${error instanceof Error ? error.message : String(error)}`);
        // Keep old bindings on error
    }
}

// Mapping: Nq7→handleKeybindingsFileChange, A→filePath, h→log, q→result, Mk5→loadKeybindingsAsync, ZM→cachedBindings, GW→cachedWarnings, KS1→changeListeners, K→listener
```

**Function**: `handleKeybindingsFileDelete` (Wk5, chunks.54.mjs:1803-1810)

```javascript
// ============================================
// handleKeybindingsFileDelete - Reset to defaults on file deletion
// Location: chunks.54.mjs:1803-1810
// ============================================

// ORIGINAL (for source lookup):
async function Wk5(A) {
    h(`[keybindings] Detected deletion of ${A}`);
    let q = tqA();
    ZM = q, GW = [], KS1.forEach((K) => K({
        bindings: q,
        warnings: []
    }))
}

// READABLE (for understanding):
async function handleKeybindingsFileDelete(filePath) {
    log(`[keybindings] Detected deletion of ${filePath}`);

    // Reset to defaults
    let defaults = getDefaultKeybindings();
    cachedBindings = defaults;
    cachedWarnings = [];

    // Notify listeners
    changeListeners.forEach((listener) => listener({
        bindings: defaults,
        warnings: []
    }));
}

// Mapping: Wk5→handleKeybindingsFileDelete, A→filePath, h→log, q→defaults, tqA→getDefaultKeybindings, ZM→cachedBindings, GW→cachedWarnings, KS1→changeListeners, K→listener
```

---

### 8.3 Config Merge Strategy

**Function**: `getDefaultKeybindings` (tqA, chunks.54.mjs:1631-1633) + `loadKeybindingsAsync` (Mk5, chunks.54.mjs:1635-1693)

```javascript
// ============================================
// configMergeStrategy - How defaults and user bindings combine
// Location: chunks.54.mjs:1669-1672
// ============================================

// ORIGINAL (for source lookup):
let w = aK6(z);
h(`[keybindings] Loaded ${w.length} user bindings from ${q}`);
let H = [...A, ...w];

// READABLE (for understanding):
let userBindingsFlat = flattenKeybindings(userBindingsBlocks);
log(`[keybindings] Loaded ${userBindingsFlat.length} user bindings from ${filePath}`);
let mergedBindings = [...defaultBindings, ...userBindingsFlat];

// Mapping: w→userBindingsFlat, aK6→flattenKeybindings, z→userBindingsBlocks, h→log, q→filePath, H→mergedBindings, A→defaultBindings
```

**Merge behavior**:
1. **Defaults loaded first** - All built-in bindings from kJ1
2. **User bindings appended** - Loaded from keybindings.json
3. **Last binding wins** - If user rebinds `ctrl+c` in Chat context, their binding overrides default
4. **Validation runs on merged array** - Checks for conflicts between user + defaults

**Example**:
```json
// User keybindings.json
{
  "bindings": [
    {
      "context": "Chat",
      "bindings": {
        "ctrl+s": "chat:submit"  // Override default (chat:stash → chat:submit)
      }
    }
  ]
}
```

Result: In Chat context, `ctrl+s` now submits instead of stashing.

---

### 8.4 Race Condition Handling

**Question**: What happens if the file changes **during** a chord sequence?

**Answer**: The chord sequence is **NOT reset** on config reload.

**Why**: Chord state lives in the **React KeybindingHandler component** (x6Y, chunks.110.mjs:988), which maintains its own state. The file watcher updates the **global binding cache**, but active UI components continue their current interaction.

**Example scenario**:
1. User presses `ctrl+k` (starts chord sequence)
2. Config file changes and reloads
3. User presses `ctrl+c` within 1000ms
4. System matches against **new** bindings using old chord state

**Mitigation**: The 500ms stability threshold makes it extremely unlikely that a file change completes during the 1000ms chord window.

---

**Question**: Are active contexts preserved on reload?

**Answer**: Yes. Context is determined by **React component tree** (which component is focused), not by keybindings config. Reloading bindings doesn't change which component is active.

---

## Summary

Keybindings provide **full customization** of keyboard shortcuts via a simple JSON config file with hot-reload support and chord sequence capabilities.
