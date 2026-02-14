# Error Handling and User Feedback

## Overview

Claude Code's keybinding system includes comprehensive validation and error reporting to help users identify and fix configuration issues. This document analyzes error detection, validation strategies, and user notification mechanisms.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and constants in this document:
- `Mk5` (chunks.54.mjs:1635-1693) - Async keybindings loader with validation
- `YS1` (chunks.54.mjs:1700-1750) - Sync keybindings loader
- `Ak5` (chunks.54.mjs:1420-1480) - Validates a single keybinding block
- `eE5` (chunks.54.mjs:1396-1418) - Validates a single keystroke string
- `aqA` (chunks.54.mjs:1482-1508) - Detects duplicate keys in JSON
- `sqA` (chunks.54.mjs:1519-1610) - Validates against reserved shortcuts
- `S6Y` (chunks.110.mjs:890-930) - Warning notification display
- `Nq7` (chunks.54.mjs:1793-1801) - Hot-reload error handling

## 1. Configuration Errors

### Invalid JSON Syntax

**Detection**: JSON parsing happens in `Mk5()` and `YS1()` using `_A()` (JSON.parse wrapper):

```javascript
// ============================================
// Mk5 - Async keybindings loader with JSON error handling
// Location: chunks.54.mjs:1635-1693
// ============================================

// ORIGINAL (for source lookup):
async function Mk5() {
    let A = tqA();
    if (!Hv()) return {
        bindings: A,
        warnings: []
    };
    let q = R71();
    try {
        let K = await wk5(q, "utf-8"),
            Y = _A(K),
            z;
        if (typeof Y === "object" && Y !== null && "bindings" in Y) z = Y.bindings;
        else return h('[keybindings] Invalid keybindings.json: keybindings.json must have a "bindings" array'), {
            bindings: A,
            warnings: [{
                type: "parse_error",
                severity: "error",
                message: 'keybindings.json must have a "bindings" array',
                suggestion: 'Use format: { "bindings": [ ... ] }'
            }]
        };
        // ... validation continues
    } catch (K) {
        if (Dk5(K) && K.code === "ENOENT") return {
            bindings: A,
            warnings: []
        };
        return h(`[keybindings] Error loading ${q}: ${K instanceof Error?K.message:String(K)}`), {
            bindings: A,
            warnings: [{
                type: "parse_error",
                severity: "error",
                message: `Failed to parse keybindings.json: ${K instanceof Error?K.message:String(K)}`
            }]
        }
    }
}

// READABLE (for understanding):
async function loadKeybindingsAsync() {
    let defaultBindings = getDefaultKeybindings();

    // If customization is disabled, return defaults
    if (!isCustomizationEnabled()) {
        return {
            bindings: defaultBindings,
            warnings: []
        };
    }

    let configPath = getKeybindingsPath();
    try {
        let jsonContent = await readFile(configPath, "utf-8");
        let parsed = JSON.parse(jsonContent);
        let userBindings;

        // Validate top-level structure
        if (typeof parsed === "object" && parsed !== null && "bindings" in parsed) {
            userBindings = parsed.bindings;
        } else {
            debug('[keybindings] Invalid keybindings.json: must have a "bindings" array');
            return {
                bindings: defaultBindings,
                warnings: [{
                    type: "parse_error",
                    severity: "error",
                    message: 'keybindings.json must have a "bindings" array',
                    suggestion: 'Use format: { "bindings": [ ... ] }'
                }]
            };
        }

        // Continue validation...
        // (see below for validation flow)

    } catch (error) {
        // File not found is OK - just use defaults
        if (isFileNotFoundError(error) && error.code === "ENOENT") {
            return {
                bindings: defaultBindings,
                warnings: []
            };
        }

        // Other errors (JSON syntax, permissions, etc.)
        debug(`[keybindings] Error loading ${configPath}: ${error instanceof Error ? error.message : String(error)}`);
        return {
            bindings: defaultBindings,
            warnings: [{
                type: "parse_error",
                severity: "error",
                message: `Failed to parse keybindings.json: ${error instanceof Error ? error.message : String(error)}`
            }]
        };
    }
}

// Mapping: Mk5→loadKeybindingsAsync, A→defaultBindings, q→configPath, K→jsonContent/error, Y→parsed, z→userBindings, tqA→getDefaultKeybindings, Hv→isCustomizationEnabled, R71→getKeybindingsPath, wk5→readFile, _A→JSON.parse, Dk5→isFileNotFoundError
```

**Error categories**:
1. **File not found**: Silently ignored, defaults used. This is NOT an error - first-time users don't have a config file yet.
2. **JSON syntax error**: Caught by try/catch, returns an error-level warning with the parser's message.
3. **Missing "bindings" key**: Caught by structural validation, returns helpful suggestion.

**Why fall back to defaults**: If the config file is broken, Claude Code should still be usable with default shortcuts. The user sees warnings but can continue working.

### Unknown Contexts/Actions

**Validation**: The `Ak5()` function validates each keybinding block:

```javascript
// ============================================
// Ak5 - Validates a single keybinding block
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
    let Y = A,
        z = Y.context,
        w;
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
function validateKeybindingBlock(block, blockIndex) {
    let errors = [];

    // Validate block is an object
    if (typeof block !== "object" || block === null) {
        errors.push({
            type: "parse_error",
            severity: "error",
            message: `Keybinding block ${blockIndex + 1} is not an object`
        });
        return errors;
    }

    let typedBlock = block;
    let contextName = typedBlock.context;
    let validContext;

    // Validate context field exists
    if (typeof contextName !== "string") {
        errors.push({
            type: "parse_error",
            severity: "error",
            message: `Keybinding block ${blockIndex + 1} missing "context" field`
        });
    } else if (!isValidContext(contextName)) {
        // Check against allowed context list (e.g., "Chat", "Global", "Artifacts")
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

    // Validate bindings field exists
    if (typeof typedBlock.bindings !== "object" || typedBlock.bindings === null) {
        errors.push({
            type: "parse_error",
            severity: "error",
            message: `Keybinding block ${blockIndex + 1} missing "bindings" field`
        });
        return errors;
    }

    let bindingsMap = typedBlock.bindings;

    // Validate each key-action pair
    for (let [keystroke, action] of Object.entries(bindingsMap)) {
        // Validate keystroke syntax
        let keystrokeError = validateKeystrokeSyntax(keystroke);
        if (keystrokeError) {
            keystrokeError.context = validContext;
            errors.push(keystrokeError);
        }

        // Validate action value
        if (action !== null && typeof action !== "string") {
            errors.push({
                type: "invalid_action",
                severity: "error",
                message: `Invalid action for "${keystroke}": must be a string or null`,
                key: keystroke,
                context: validContext
            });
        } else if (typeof action === "string" && action.startsWith("command:")) {
            // Special validation for command: prefix (custom slash commands)
            if (!/^command:[a-zA-Z0-9:\-_]+$/.test(action)) {
                errors.push({
                    type: "invalid_action",
                    severity: "warning",
                    message: `Invalid command binding "${action}" for "${keystroke}": command name may only contain alphanumeric characters, colons, hyphens, and underscores`,
                    key: keystroke,
                    context: validContext,
                    action: action
                });
            }

            // Command bindings only work in Chat context
            if (validContext && validContext !== "Chat") {
                errors.push({
                    type: "invalid_action",
                    severity: "warning",
                    message: `Command binding "${action}" must be in "Chat" context, not "${validContext}"`,
                    key: keystroke,
                    context: validContext,
                    action: action,
                    suggestion: 'Move this binding to a block with "context": "Chat"'
                });
            }
        }
    }

    return errors;
}

// Mapping: Ak5→validateKeybindingBlock, A→block, q→blockIndex, K→errors, Y→typedBlock, z→contextName, w→validContext, H→bindingsMap, $→keystroke, O→action, tE5→isValidContext, Gq7→VALID_CONTEXTS, eE5→validateKeystrokeSyntax
```

**Key insights**:
1. **Context validation**: Uses a whitelist (`Gq7`) of valid contexts. Unknown contexts are errors, not warnings, because they'll never match.
2. **Action validation**: Actions can be:
   - `null` - Explicitly unbind this shortcut
   - String (action name) - Built-in action like "external_editor"
   - `"command:<name>"` - Custom slash command (Chat context only)
3. **Command bindings**: The `command:` prefix allows binding keys to slash commands, but this feature is restricted to the Chat context where slash commands are available.

### Duplicate Bindings

**Detection**: Two separate checks for duplicates:

#### 1. JSON-level duplicates (same key appears twice in one context)

```javascript
// ============================================
// aqA - Detects duplicate keys in JSON source
// Location: chunks.54.mjs:1482-1508
// ============================================

// ORIGINAL (for source lookup):
function aqA(A) {
    let q = [],
        K = /"bindings"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
        Y;
    while ((Y = K.exec(A)) !== null) {
        let z = Y[1];
        if (!z) continue;
        let $ = A.slice(0, Y.index).match(/"context"\s*:\s*"([^"]+)"[^{]*$/)?.[1] ?? "unknown",
            O = /"([^"]+)"\s*:/g,
            _ = new Map,
            J;
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
function detectDuplicateKeysInJSON(jsonSource) {
    let warnings = [];

    // Regex to find all "bindings" objects in the JSON
    let bindingsBlockRegex = /"bindings"\s*:\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let blockMatch;

    while ((blockMatch = bindingsBlockRegex.exec(jsonSource)) !== null) {
        let bindingsContent = blockMatch[1];
        if (!bindingsContent) continue;

        // Extract the context name before this bindings block
        let contextMatch = jsonSource
            .slice(0, blockMatch.index)
            .match(/"context"\s*:\s*"([^"]+)"[^{]*$/);
        let contextName = contextMatch?.[1] ?? "unknown";

        // Find all keys in this bindings object
        let keyRegex = /"([^"]+)"\s*:/g;
        let keyCounts = new Map();
        let keyMatch;

        while ((keyMatch = keyRegex.exec(bindingsContent)) !== null) {
            let keyName = keyMatch[1];
            if (!keyName) continue;

            let count = (keyCounts.get(keyName) ?? 0) + 1;
            keyCounts.set(keyName, count);

            // On second occurrence, add warning
            if (count === 2) {
                warnings.push({
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

    return warnings;
}

// Mapping: aqA→detectDuplicateKeysInJSON, A→jsonSource, q→warnings, K→bindingsBlockRegex, Y→blockMatch, z→bindingsContent, $→contextName, O→keyRegex, _→keyCounts, J→keyMatch, X→keyName, D→count
```

**Why parse the JSON source directly**: The JavaScript JSON parser silently overwrites duplicate keys with the last value. By regex-parsing the raw JSON string, we can detect duplicates and warn the user about the unexpected behavior.

**Example**:
```json
{
  "context": "Chat",
  "bindings": {
    "ctrl+k": "external_editor",
    "ctrl+k": "save_to_notebook"   // WARNING: Duplicate, first binding is ignored
  }
}
```

#### 2. Cross-block duplicates (same key bound in multiple contexts or default vs user)

The `sqA()` function (chunks.54.mjs:1519-1610) checks for keybindings that conflict across contexts or with defaults. This is NOT an error, just an informational warning, because context-aware routing may make the bindings valid.

### Reserved Shortcut Conflicts

**Detection**: The `sqA()` function checks against platform-specific reserved lists (see platform_specific.md for the lists).

**Example warning**:
```
Error: Cannot bind "cmd+q" in Chat context - macOS quit application
```

**User experience**: These are error-level warnings, not blocking errors. The keybindings.json file loads successfully, but the problematic bindings are ignored.

## 2. Runtime Errors

### File Watcher Failures

**Detection**: The `Lq7()` file watcher setup includes error handling:

```javascript
// ============================================
// Lq7 - Initializes file watcher with error handling
// Location: chunks.54.mjs:1752-1780
// ============================================

// ORIGINAL (for source lookup):
async function Lq7() {
    if (fq7 || Tq7) return;
    if (!Hv()) {
        h("[keybindings] Skipping file watcher - user customization disabled");
        return
    }
    let A = R71(),
        q = _k5(A);
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
async function startKeybindingsFileWatcher() {
    // Don't start multiple watchers
    if (watcherInitialized || watcherShutdown) return;

    // Skip if customization is disabled
    if (!isCustomizationEnabled()) {
        debug("[keybindings] Skipping file watcher - user customization disabled");
        return;
    }

    let configPath = getKeybindingsPath(); // e.g., ~/.claude/keybindings.json
    let configDir = getDirectoryPath(configPath); // e.g., ~/.claude

    // Verify the directory exists before watching
    try {
        let stats = await statAsync(configDir);
        if (!stats.isDirectory()) {
            debug(`[keybindings] Not watching: ${configDir} is not a directory`);
            return;
        }
    } catch {
        debug(`[keybindings] Not watching: ${configDir} does not exist`);
        return;
    }

    watcherInitialized = true;
    debug(`[keybindings] Watching for changes to ${configPath}`);

    // Start file watcher using chokidar
    fileWatcher = chokidar.watch(configPath, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: WRITE_STABILIZATION_MS, // 500ms
            pollInterval: WRITE_POLL_MS // 200ms
        },
        ignorePermissionErrors: true,
        usePolling: false,
        atomic: true
    });

    fileWatcher.on("add", onFileChange);
    fileWatcher.on("change", onFileChange);
    fileWatcher.on("unlink", onFileDelete);

    // Register cleanup on shutdown
    onShutdown(async () => stopFileWatcher());
}

// Mapping: Lq7→startKeybindingsFileWatcher, fq7→watcherInitialized, Tq7→watcherShutdown, Hv→isCustomizationEnabled, A→configPath, q→configDir, R71→getKeybindingsPath, _k5→getDirectoryPath, Hk5→statAsync, L71→fileWatcher, wH1→chokidar, Jk5→WRITE_STABILIZATION_MS, Xk5→WRITE_POLL_MS, Nq7→onFileChange, Wk5→onFileDelete, Tq→onShutdown, Pk5→stopFileWatcher
```

**Graceful degradation**:
1. If `~/.claude` directory doesn't exist, the watcher silently skips initialization. Keybindings still work (using defaults).
2. If permission errors occur, `ignorePermissionErrors: true` prevents crashes.
3. If the watcher fails to start for any reason, the user can still use default keybindings.

**Write stabilization**: The `awaitWriteFinish` configuration prevents reload flicker during multi-write file saves (some editors write in chunks).

### Invalid Keystroke Sequences

**Detection**: The `eE5()` function validates keystroke syntax:

```javascript
// ============================================
// eE5 - Validates keystroke syntax
// Location: chunks.54.mjs:1396-1418
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
function validateKeystrokeSyntax(keystrokeString) {
    // Split on "+" to check for empty parts (e.g., "ctrl++k")
    let parts = keystrokeString.toLowerCase().split("+");
    for (let part of parts) {
        if (!part.trim()) {
            return {
                type: "parse_error",
                severity: "error",
                message: `Empty key part in "${keystrokeString}"`,
                key: keystrokeString,
                suggestion: 'Remove extra "+" characters'
            };
        }
    }

    // Try to parse the keystroke
    let parsed = parseKeystroke(keystrokeString);

    // Must have at least a key or a modifier
    if (!parsed.key && !parsed.ctrl && !parsed.alt && !parsed.shift && !parsed.meta) {
        return {
            type: "parse_error",
            severity: "error",
            message: `Could not parse keystroke "${keystrokeString}"`,
            key: keystrokeString
        };
    }

    return null; // Valid
}

// Mapping: eE5→validateKeystrokeSyntax, A→keystrokeString, q→parts, Y→part, K→parsed, iC1→parseKeystroke
```

**Common mistakes caught**:
- `"ctrl++k"` - Empty part between modifiers
- `""` - Empty string
- `"+"` - Just a plus sign
- `"ctrl+"` - Modifier without a key (will be caught by the second check - `parsed.key` is empty)

### Handler Exceptions

**Issue**: What happens if a keybinding's action handler throws an exception?

**Current implementation**: The action dispatch logic (chunks.110.mjs:1015-1024) does NOT have explicit try/catch around handler execution:

```javascript
// From chunks.110.mjs:1015-1024 (inferred)
if (matchedAction) {
    let handlerList = handlerRegistry.get(matchedAction.action);
    if (handlerList && handlerList.size > 0) {
        for (let handler of handlerList) {
            if (activeContexts.has(handler.context)) {
                handler.handler(); // No try/catch here
                event.stopImmediatePropagation();
                break;
            }
        }
    }
}
```

**Result**: If a handler throws, the exception propagates to the React error boundary. The UI may crash or show an error overlay.

**Best practice for handler authors**: Wrap handler logic in try/catch and log errors gracefully.

**Future enhancement**: Add try/catch in the dispatch logic to prevent one bad handler from breaking the entire keybinding system.

## 3. User Notifications

### S6Y - Warning Notification Function

The `S6Y()` function displays configuration warnings in the UI:

```javascript
// ============================================
// S6Y - Displays keybinding warnings as notifications
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
        // ... notification display logic
    }, K[0] = Y, K[1] = z, K[2] = A, K[3] = q, K[4] = w;
    else w = K[4];
    return pX.useEffect(w, [w]), null
}

// READABLE (for understanding):
function displayKeybindingWarnings(warnings, hasReloaded) {
    let memoSlot = useMemoSlot(9);
    let { addNotification, removeNotification } = useNotifications();

    let effectCallback;
    if (memoSlot[0] !== addNotification ||
        memoSlot[1] !== removeNotification ||
        memoSlot[2] !== warnings) {

        effectCallback = () => {
            // No warnings - remove notification if present
            if (warnings.length === 0) {
                removeNotification("keybinding-config-warning");
                return;
            }

            // Build warning message from all warnings
            let errorCount = warnings.filter(w => w.severity === "error").length;
            let warningCount = warnings.filter(w => w.severity === "warning").length;

            let message = `Keybinding configuration has ${errorCount} error(s) and ${warningCount} warning(s). Check console for details.`;

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

    return null; // No rendered output
}

// Mapping: S6Y→displayKeybindingWarnings, A→warnings, q→hasReloaded, K→memoSlot, Y→addNotification, z→removeNotification, w→effectCallback, iq→useNotifications
```

**Notification lifecycle**:
1. On initial load, if warnings exist, show notification.
2. If user fixes keybindings.json (hot-reload), notification updates/disappears.
3. User can dismiss notification, but it will reappear if config is reloaded with errors.

### Error Message Formatting

Warning objects have a consistent structure:

```typescript
interface KeybindingWarning {
    type: "parse_error" | "invalid_context" | "invalid_action" | "duplicate" | "reserved";
    severity: "error" | "warning";
    message: string;
    suggestion?: string;
    key?: string;
    context?: string;
    action?: string;
}
```

**Display in console**: All warnings are logged via `h()` (debug logger):

```javascript
h(`[keybindings] Found ${warnings.length} validation issue(s)`);
warnings.forEach(warning => {
    h(`  [${warning.severity}] ${warning.message}`);
    if (warning.suggestion) {
        h(`    Suggestion: ${warning.suggestion}`);
    }
});
```

### Recovery Strategies

**Graceful degradation hierarchy**:
1. **Best case**: Valid user config → merged with defaults → all shortcuts work
2. **Parse error**: JSON syntax broken → fall back to defaults → show error notification
3. **Validation errors**: Some bindings invalid → use valid bindings + defaults → show warning notification
4. **File watcher failure**: Can't detect changes → keybindings work but no hot-reload

**User actions to recover**:
1. **Check console** (if running in terminal): Detailed error messages
2. **Check notification**: Summary of issues
3. **Fix keybindings.json**: Errors include suggestions
4. **Delete keybindings.json**: Falls back to defaults immediately
5. **Restart Claude Code**: Full reload (not usually necessary due to hot-reload)

### Hot-Reload Error Handling

When the file watcher detects a change, errors during reload don't crash the app:

```javascript
// ============================================
// Nq7 - File change handler with error recovery
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
async function onFileChange(filePath) {
    debug(`[keybindings] Detected change to ${filePath}`);
    try {
        let newConfig = await loadKeybindingsAsync();

        // Update cache
        cachedBindings = newConfig.bindings;
        cachedWarnings = newConfig.warnings;

        // Notify all subscribers (UI updates)
        reloadSubscribers.forEach(callback => callback(newConfig));
    } catch (error) {
        debug(`[keybindings] Error reloading: ${error instanceof Error ? error.message : String(error)}`);
        // Don't update cache - keep previous valid config
    }
}

// Mapping: Nq7→onFileChange, A→filePath, q→newConfig/error, Mk5→loadKeybindingsAsync, ZM→cachedBindings, GW→cachedWarnings, KS1→reloadSubscribers
```

**Key insight**: If hot-reload fails (e.g., user saves broken JSON mid-edit), the previous valid configuration remains active. The user sees an error notification but can continue working with their old shortcuts.

## Summary: Error Handling Philosophy

1. **Never crash**: Validation errors should never prevent Claude Code from starting.
2. **Fall back to defaults**: If user config is broken, use built-in defaults.
3. **Provide context**: Error messages include suggestions for fixes.
4. **Persist valid state**: Hot-reload failures don't overwrite working config.
5. **Multi-level feedback**: Console logs for developers, notifications for users.
