# Keybindings Configuration

## Overview

Keybindings in Claude Code v2.1.76 are customizable via `~/.claude/keybindings.json`. This document analyzes the configuration file format, loading mechanism, validation pipeline, and hot-reload system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

Key functions in this document:
- `loadKeybindingsAsync` (tu9) - Async loader with validation
- `loadKeybindingsSync` ($p6) - Sync loader with caching
- `getCachedBindings` (m34) - Returns cached or loads bindings
- `watchKeybindingsFile` (B34) - Chokidar file watcher
- `handleKeybindingsFileChange` (I34) - Hot-reload callback
- `getDefaultBindings` (rN8) - Default bindings fallback
- `isKeybindingCustomizationEnabled` (pk) - Feature flag check
- `getKeybindingsFilePath` (b36) - Returns `~/.claude/keybindings.json`
- `WRITE_STABILITY_THRESHOLD_MS` (ru9) - 500ms debounce threshold
- `WRITE_POLL_INTERVAL_MS` (ou9) - 200ms poll interval
- `VALID_CONTEXTS` (h34) - Set of valid context names
- `VALID_CONTEXTS_ARRAY` (R34) - Array of all 18 valid contexts

---

## 1. Configuration File

### 1.1 File Location

**Path**: `~/.claude/keybindings.json`

**Format**: JSON object with a top-level `bindings` array of context-block objects

**Example**:
```json
{
    "bindings": [
        {
            "context": "Chat",
            "bindings": {
                "ctrl+k ctrl+c": "clear_history",
                "ctrl+g": "chat:externalEditor",
                "ctrl+enter": "chat:submit",
                "/my-workflow": "command:my-workflow"
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

---

### 1.2 File Loading

**Async Loader**: `loadKeybindingsAsync` (tu9, chunks.89.mjs:3143-3199)

**Loading Process**:
1. Check `isKeybindingCustomizationEnabled()` (pk) — if disabled, return defaults
2. Read file with UTF-8 encoding from `getKeybindingsFilePath()` (b36)
3. Parse as JSON
4. Validate top-level structure (must have a `"bindings"` key)
5. Validate each binding block
6. Detect duplicate keys and reserved shortcuts
7. Merge valid user bindings with defaults (user bindings appended after defaults — last-match-wins)

```javascript
// ============================================
// tu9 - Async keybindings loader with validation pipeline
// Location: chunks.89.mjs:3143-3199
// ============================================

// ORIGINAL (for source lookup):
async function tu9() {
    let A = rN8();
    if (!pk()) return {
        bindings: A,
        warnings: []
    };
    let q = b36();
    try {
        let K = await oP6(q, "utf-8"),
            Y = JSON.parse(K),
            z;
        if (typeof Y === "object" && Y !== null && "bindings" in Y) z = Y.bindings;
        else return k('[keybindings] Invalid keybindings.json: must have a "bindings" array'), {
            bindings: A,
            warnings: [{ type: "parse_error", severity: "error", message: '...' }]
        };
        // ... validation continues ...
    } catch (K) {
        if (K.code === "ENOENT") return { bindings: A, warnings: [] };
        return k(`[keybindings] Error loading ${q}: ${K instanceof Error?K.message:String(K)}`), {
            bindings: A,
            warnings: [{ type: "parse_error", severity: "error", message: `Failed to parse: ${K.message}` }]
        }
    }
}

// READABLE (for understanding):
async function loadKeybindingsAsync() {
    let defaultBindings = getDefaultBindings();

    if (!isKeybindingCustomizationEnabled()) {
        return { bindings: defaultBindings, warnings: [] };
    }

    let configPath = getKeybindingsFilePath(); // ~/.claude/keybindings.json
    try {
        let jsonContent = await readFile(configPath, "utf-8");
        let parsed = JSON.parse(jsonContent);
        let userBindings;

        if (typeof parsed === "object" && parsed !== null && "bindings" in parsed) {
            userBindings = parsed.bindings;
        } else {
            debug('[keybindings] Invalid: must have a "bindings" array');
            return {
                bindings: defaultBindings,
                warnings: [{ type: "parse_error", severity: "error", message: '...' }]
            };
        }

        // Run full validation pipeline, then merge
        let warnings = validateAllBindings(userBindings, jsonContent);
        let mergedBindings = [...defaultBindings, ...userBindings]; // User appended last
        return { bindings: mergedBindings, warnings };

    } catch (error) {
        if (error.code === "ENOENT") {
            return { bindings: defaultBindings, warnings: [] }; // First-time users
        }
        debug(`[keybindings] Error loading ${configPath}: ${error.message}`);
        return {
            bindings: defaultBindings,
            warnings: [{ type: "parse_error", severity: "error", message: `Failed to parse: ${error.message}` }]
        };
    }
}

// Mapping: tu9→loadKeybindingsAsync, A→defaultBindings, q→configPath, K→jsonContent/error, Y→parsed, z→userBindings, rN8→getDefaultBindings, pk→isKeybindingCustomizationEnabled, b36→getKeybindingsFilePath, oP6→readFile, k→debug
```

**File not found is not an error**: ENOENT is silently treated as "no user customizations" — first-time users should not see errors.

**Why fall back to defaults on error**: If the config file is broken, Claude Code must remain fully usable. Users see warnings but can continue working with default shortcuts.

---

### 1.3 Sync Loader with Caching

**Sync Loader**: `loadKeybindingsSync` ($p6, chunks.89.mjs:3208-3230)
**Cache Getter**: `getCachedBindings` (m34, chunks.89.mjs:3203-3206)

Used at startup and by React components that need synchronous access:

```javascript
// ============================================
// m34 - Returns cached bindings or loads synchronously
// Location: chunks.89.mjs:3203-3206
// ============================================

// ORIGINAL (for source lookup):
function m34() {
    if (Y0) return Y0;
    return $p6().bindings
}

// READABLE (for understanding):
function getCachedBindings() {
    if (cachedBindings) return cachedBindings;
    return loadKeybindingsSync().bindings;
}

// Mapping: m34→getCachedBindings, Y0→cachedBindings, $p6→loadKeybindingsSync
```

```javascript
// ============================================
// $p6 - Sync loader returning cached bindings
// Location: chunks.89.mjs:3208-3230
// ============================================

// ORIGINAL (for source lookup):
function $p6() {
    if (Y0) return { bindings: Y0, warnings: _Z };
    let A = rN8();
    if (!pk()) return Y0 = A, _Z = [], { bindings: Y0, warnings: _Z };
    let q = b36();
    // ... synchronous file read and parse
}

// READABLE (for understanding):
function loadKeybindingsSync() {
    // Return cached result if available
    if (cachedBindings !== null) {
        return { bindings: cachedBindings, warnings: cachedWarnings };
    }

    let defaultBindings = getDefaultBindings();
    if (!isKeybindingCustomizationEnabled()) {
        cachedBindings = defaultBindings;
        cachedWarnings = [];
        return { bindings: cachedBindings, warnings: cachedWarnings };
    }

    // First call: synchronous load, set cache
    let configPath = getKeybindingsFilePath();
    // ... synchronous file operations
}

// Mapping: $p6→loadKeybindingsSync, Y0→cachedBindings, _Z→cachedWarnings, A→defaultBindings, q→configPath, rN8→getDefaultBindings, pk→isKeybindingCustomizationEnabled, b36→getKeybindingsFilePath
```

---

## 2. Key Syntax

### 2.1 Modifier Keys

**Platform-Specific Modifiers**:
- **macOS**: `cmd`, `ctrl`, `alt`, `shift`
- **Linux/Windows**: `ctrl`, `alt`, `shift`

**Modifier aliases** (all treated as equivalent by `parseKeystroke` (iC1)):
- `cmd` = `meta` = `command`
- `alt` = `opt` = `option`
- `ctrl` = `control`

**Combinations**: Use `+` to combine modifiers
```
"ctrl+shift+k"
"cmd+alt+f"
"meta+p"
```

### 2.2 Chord Sequences

**Multi-Key Sequences**: Use space to separate keystrokes in a chord
```json
{
    "ctrl+k ctrl+c": "clear_history",
    "ctrl+k ctrl+s": "save_session",
    "ctrl+k n": "new_thread"
}
```

**Chord rules**:
- The first keystroke must be a prefix of at least one chord in the active contexts
- 1000ms timeout (`CHORD_TIMEOUT_MS`, G4Y) between keystrokes — exceeding it cancels the chord
- Escape key always cancels an in-progress chord
- Typing an invalid second key cancels the chord

### 2.3 Special Key Names

| Config syntax | Normalized name | Key pressed |
|--------------|----------------|-------------|
| `enter` / `return` | `enter` | Enter / Return |
| `esc` / `escape` | `escape` | Escape |
| `space` | ` ` | Space bar |
| `tab` | `tab` | Tab |
| `backspace` | `backspace` | Backspace |
| `delete` | `delete` | Delete / Fn+Backspace |
| `up` / `↑` | `up` | Up arrow |
| `down` / `↓` | `down` | Down arrow |
| `left` / `←` | `left` | Left arrow |
| `right` / `→` | `right` | Right arrow |
| `pageup` | `pageup` | Page Up |
| `pagedown` | `pagedown` | Page Down |
| `home` | `home` | Home |
| `end` | `end` | End |

---

## 3. Default Keybindings

**Default bindings** are returned by `getDefaultBindings` (rN8) and stored in the module-level constant `XW6`. They cover all 18 contexts and include bindings for:

### Global Context (always active)
| Binding | Action |
|---------|--------|
| `ctrl+c` | `app:interrupt` |
| `ctrl+d` | `app:exit` |
| `ctrl+t` | `app:toggleTodos` |
| `ctrl+o` | `app:toggleTranscript` |

### Chat Context
| Binding | Action |
|---------|--------|
| `enter` | `chat:submit` |
| `escape` | `chat:cancel` |
| `meta+p` | `chat:modelPicker` |
| `meta+t` | `chat:thinkingToggle` |
| `ctrl+g` | `chat:externalEditor` |

### Autocomplete Context
| Binding | Action |
|---------|--------|
| `tab` | `autocomplete:accept` |
| `escape` | `autocomplete:dismiss` |
| `up` | `autocomplete:previous` |
| `down` | `autocomplete:next` |

---

## 4. Hot-Reload System

### 4.1 File Watcher Setup

```javascript
// ============================================
// B34 - Start chokidar file watcher for hot-reload
// Location: chunks.89.mjs:3260-3288
// ============================================

// ORIGINAL (for source lookup):
async function B34() {
    if (S34 || b34) return;
    if (!pk()) { k("[keybindings] Skipping file watcher - user customization disabled"); return }
    let A = b36(), q = nu9(A);
    try {
        if (!(await cu9(q)).isDirectory()) { k(`[keybindings] Not watching: ${q} is not a directory`); return }
    } catch { k(`[keybindings] Not watching: ${q} does not exist`); return }
    S34 = !0, k(`[keybindings] Watching for changes to ${A}`),
    I36 = g46.watch(A, {
        persistent: !0, ignoreInitial: !0,
        awaitWriteFinish: { stabilityThreshold: ru9, pollInterval: ou9 },
        ignorePermissionErrors: !0, usePolling: !1, atomic: !0
    }), I36.on("add", I34), I36.on("change", I34), I36.on("unlink", Am9),
    E4(async () => eu9())
}

// READABLE (for understanding):
async function watchKeybindingsFile() {
    if (watcherInitialized || watcherShutdown) return;
    if (!isKeybindingCustomizationEnabled()) {
        debug("[keybindings] Skipping file watcher - user customization disabled");
        return;
    }

    let configPath = getKeybindingsFilePath();      // ~/.claude/keybindings.json
    let configDir = getDirectoryPath(configPath);   // ~/.claude

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

    fileWatcher = chokidar.watch(configPath, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
            stabilityThreshold: WRITE_STABILITY_THRESHOLD_MS,  // 500ms — wait for editor to finish writing
            pollInterval: WRITE_POLL_INTERVAL_MS                // 200ms — how often to poll during stabilization
        },
        ignorePermissionErrors: true,
        usePolling: false,
        atomic: true     // Treat atomic writes (rename-based) correctly
    });

    fileWatcher.on("add", handleKeybindingsFileChange);
    fileWatcher.on("change", handleKeybindingsFileChange);
    fileWatcher.on("unlink", handleKeybindingsFileDelete);

    onShutdown(async () => stopWatchingKeybindings());
}

// Mapping: B34→watchKeybindingsFile, S34→watcherInitialized, b34→watcherShutdown, pk→isKeybindingCustomizationEnabled, A→configPath, q→configDir, b36→getKeybindingsFilePath, nu9→getDirectoryPath, cu9→statAsync, I36→fileWatcher, g46→chokidar, ru9→WRITE_STABILITY_THRESHOLD_MS, ou9→WRITE_POLL_INTERVAL_MS, I34→handleKeybindingsFileChange, Am9→handleKeybindingsFileDelete, E4→onShutdown, eu9→stopWatchingKeybindings
```

**Why `awaitWriteFinish`**: Many text editors (vim, VSCode) write files in chunks or rename-then-move sequences. Without stabilization, the watcher could fire on an incomplete write, causing JSON parse errors. The 500ms threshold waits until the file hasn't changed for half a second before triggering reload.

**Why watch the directory, not just the file**: Editors may delete and recreate the file (atomic write). By watching the directory for "add" events alongside "change", the watcher catches these patterns.

### 4.2 Reload on File Change

```javascript
// ============================================
// I34 - Reloads keybindings on file modification
// Location: chunks.90.mjs:14-22
// ============================================

// ORIGINAL (for source lookup):
async function I34(A) {
    k(`[keybindings] Detected change to ${A}`);
    try {
        let q = await tu9();
        Y0 = q.bindings, _Z = q.warnings, Op6.forEach((K) => K(q))
    } catch (q) {
        k(`[keybindings] Error reloading: ${_1(q)}`)
    }
}

// READABLE (for understanding):
async function handleKeybindingsFileChange(filePath) {
    debug(`[keybindings] Detected change to ${filePath}`);
    try {
        let newConfig = await loadKeybindingsAsync();

        // Update module-level cache
        cachedBindings = newConfig.bindings;
        cachedWarnings = newConfig.warnings;

        // Notify all subscribers (React components re-render with new bindings)
        reloadSubscribers.forEach(callback => callback(newConfig));
    } catch (error) {
        // If reload fails, keep previous valid config intact
        debug(`[keybindings] Error reloading: ${formatError(error)}`);
    }
}

// Mapping: I34→handleKeybindingsFileChange, A→filePath, k→debug, tu9→loadKeybindingsAsync, Y0→cachedBindings, _Z→cachedWarnings, Op6→reloadSubscribers, _1→formatError
```

**Key insight**: If hot-reload fails (e.g., user saves broken JSON mid-edit), the previous valid configuration remains active because the `catch` block exits without updating the cache. The user sees an error notification but their shortcuts continue working.

### 4.3 Subscriber Pattern

Components subscribe to keybinding changes via `subscribeToKeybindingsChanges` (Rq7):

```javascript
// React component subscribes on mount, unsubscribes on unmount:
useEffect(() => {
    let unsubscribe = subscribeToKeybindingsChanges((newConfig) => {
        setBindings(newConfig.bindings);
        setWarnings(newConfig.warnings);
    });
    return unsubscribe; // Cleanup
}, []);
```

This pattern propagates hot-reload changes from the module-level cache through to React state, triggering re-renders that update the keybinding handler with new bindings.

---

## 5. Merge Strategy

User bindings are **appended after defaults**, not merged into them. The `resolveKeystroke` function uses **last-match-wins**:

```javascript
let mergedBindings = [...defaultBindings, ...userBindings];
// User bindings come last → they shadow defaults with same keystroke+context
```

**Example**: If defaults bind `enter` to `chat:submit` in Chat context, and the user binds `enter` to `insert_newline` in Chat context, the user's binding wins because it appears later in the array.

**How to explicitly unbind a default**: Set action to `null`:
```json
{
    "context": "Global",
    "bindings": {
        "ctrl+l": null
    }
}
```

This creates a binding with `action: null`, which returns `{type: "unbound"}` from `resolveKeystroke`, consuming the keystroke without triggering any handler.

---

## 6. Summary

**Configuration pipeline**:
1. `loadKeybindingsAsync` (tu9) reads and validates JSON
2. Validation: structure → block → keystroke → duplicates → reserved shortcuts
3. Merge: defaults + user bindings (user wins via last-match)
4. Chokidar watcher triggers `handleKeybindingsFileChange` (I34) on save
5. Subscribers (React components) receive new config and re-render

**Design principles**:
- **Never crash**: Broken config falls back to defaults
- **Immediate feedback**: Hot-reload in under 1 second
- **Explicit errors**: Validation provides actionable messages
- **User wins**: User bindings always shadow defaults for same key+context

**Last Updated**: 2026-03-23 (Claude Code v2.1.76)
