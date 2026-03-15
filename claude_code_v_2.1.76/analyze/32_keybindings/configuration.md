# Keybindings Configuration

## Overview

Keybindings in Claude Code v2.1.76 are customizable via `~/.claude/keybindings.json`. This document analyzes the configuration file format, loading mechanism, validation pipeline, and hot-reload system.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

Key functions in this document:
- `loadKeybindingsAsync` (Mk5) - Async loader with validation
- `loadKeybindingsSync` (YS1) - Sync loader with caching
- `watchKeybindingsFile` (Lq7) - Chokidar file watcher
- `getDefaultKeybindings` (tqA) - Default bindings fallback
- `isKeybindingCustomizationEnabled` (Hv) - Feature flag check
- `getKeybindingsFilePath` (R71) - Returns `~/.claude/keybindings.json`
- `WRITE_STABILIZATION_MS` (Jk5) - 500ms debounce threshold
- `WRITE_POLL_INTERVAL_MS` (Xk5) - 200ms poll interval

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

**Async Loader**: `loadKeybindingsAsync` (Mk5, chunks.54.mjs:1635-1693)

**Loading Process**:
1. Check `isKeybindingCustomizationEnabled()` (Hv) — if disabled, return defaults
2. Read file with UTF-8 encoding from `getKeybindingsFilePath()` (R71)
3. Parse as JSON using `_A()` (JSON.parse wrapper)
4. Validate top-level structure (must have a `"bindings"` key)
5. Validate each binding block via `validateKeybindingBlock` (Ak5)
6. Detect duplicate keys via `detectDuplicateKeysInJSON` (aqA)
7. Check reserved shortcuts via `validateKeybindingsComprehensive` (sqA)
8. Merge valid user bindings with defaults (user bindings appended after defaults — last-match-wins)

```javascript
// ============================================
// loadKeybindingsAsync - Async keybindings loader with full validation pipeline
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
        else return h('[keybindings] Invalid keybindings.json: must have a "bindings" array'), {
            bindings: A,
            warnings: [{ type: "parse_error", severity: "error", message: '...' }]
        };
        // ... validation continues ...
    } catch (K) {
        if (Dk5(K) && K.code === "ENOENT") return { bindings: A, warnings: [] };
        return h(`[keybindings] Error loading ${q}: ${K instanceof Error?K.message:String(K)}`), {
            bindings: A,
            warnings: [{ type: "parse_error", severity: "error", message: `Failed to parse: ${K.message}` }]
        }
    }
}

// READABLE (for understanding):
async function loadKeybindingsAsync() {
    let defaultBindings = getDefaultKeybindings();

    if (!isKeybindingCustomizationEnabled()) {
        return { bindings: defaultBindings, warnings: [] };
    }

    let configPath = getKeybindingsFilePath();
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
        if (isFileNotFoundError(error) && error.code === "ENOENT") {
            return { bindings: defaultBindings, warnings: [] }; // First-time users
        }
        debug(`[keybindings] Error loading ${configPath}: ${error.message}`);
        return {
            bindings: defaultBindings,
            warnings: [{ type: "parse_error", severity: "error", message: `Failed to parse: ${error.message}` }]
        };
    }
}

// Mapping: Mk5→loadKeybindingsAsync, A→defaultBindings, q→configPath, K→jsonContent/error, Y→parsed, z→userBindings, tqA→getDefaultKeybindings, Hv→isKeybindingCustomizationEnabled, R71→getKeybindingsFilePath, wk5→readFile, _A→JSON.parse, Dk5→isFileNotFoundError
```

**File not found is not an error**: ENOENT is silently treated as "no user customizations" — first-time users should not see errors.

**Why fall back to defaults on error**: If the config file is broken, Claude Code must remain fully usable. Users see warnings but can continue working with default shortcuts.

---

### 1.3 Sync Loader with Caching

**Sync Loader**: `loadKeybindingsSync` (YS1, chunks.54.mjs:1700-1750)

Used at startup and by React components that need synchronous access:

```javascript
// ============================================
// loadKeybindingsSync - Sync loader returning cached bindings
// Location: chunks.54.mjs:1700-1750
// ============================================

// ORIGINAL (for source lookup):
function YS1() {
    if (ZM !== null) return { bindings: ZM, warnings: GW };
    // ... synchronous load and cache
}

// READABLE (for understanding):
function loadKeybindingsSync() {
    // Return cached result if available
    if (cachedBindings !== null) {
        return { bindings: cachedBindings, warnings: cachedWarnings };
    }

    // First call: synchronous load, set cache
    let config = loadSynchronously();
    cachedBindings = config.bindings;
    cachedWarnings = config.warnings;
    return config;
}

// Mapping: YS1→loadKeybindingsSync, ZM→cachedBindings, GW→cachedWarnings
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
- 1000ms timeout (`CHORD_TIMEOUT_MS`, C6Y) between keystrokes — exceeding it cancels the chord
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

**Default bindings** are returned by `getDefaultKeybindings` (tqA) and stored in the module-level constant `kJ1`. They cover all 18 contexts and include bindings for:

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
// watchKeybindingsFile - Start chokidar file watcher
// Location: chunks.54.mjs:1752-1780
// ============================================

// ORIGINAL (for source lookup):
async function Lq7() {
    if (fq7 || Tq7) return;
    if (!Hv()) { h("[keybindings] Skipping file watcher - user customization disabled"); return }
    let A = R71(), q = _k5(A);
    try {
        if (!(await Hk5(q)).isDirectory()) { h(`[keybindings] Not watching: ${q} is not a directory`); return }
    } catch { h(`[keybindings] Not watching: ${q} does not exist`); return }
    fq7 = !0, h(`[keybindings] Watching for changes to ${A}`),
    L71 = wH1.watch(A, {
        persistent: !0, ignoreInitial: !0,
        awaitWriteFinish: { stabilityThreshold: Jk5, pollInterval: Xk5 },
        ignorePermissionErrors: !0, usePolling: !1, atomic: !0
    }), L71.on("add", Nq7), L71.on("change", Nq7), L71.on("unlink", Wk5),
    Tq(async () => Pk5())
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
            stabilityThreshold: WRITE_STABILIZATION_MS,  // 500ms — wait for editor to finish writing
            pollInterval: WRITE_POLL_INTERVAL_MS          // 200ms — how often to poll during stabilization
        },
        ignorePermissionErrors: true,
        usePolling: false,
        atomic: true     // Treat atomic writes (rename-based) correctly
    });

    fileWatcher.on("add", onFileChange);
    fileWatcher.on("change", onFileChange);
    fileWatcher.on("unlink", onFileDelete);

    onShutdown(async () => stopWatchingKeybindings());
}

// Mapping: Lq7→watchKeybindingsFile, fq7→watcherInitialized, Tq7→watcherShutdown, Hv→isKeybindingCustomizationEnabled, A→configPath, q→configDir, R71→getKeybindingsFilePath, _k5→getDirectoryPath, Hk5→statAsync, L71→fileWatcher, wH1→chokidar, Jk5→WRITE_STABILIZATION_MS, Xk5→WRITE_POLL_INTERVAL_MS, Nq7→onFileChange, Wk5→onFileDelete, Tq→onShutdown, Pk5→stopWatchingKeybindings
```

**Why `awaitWriteFinish`**: Many text editors (vim, VSCode) write files in chunks or rename-then-move sequences. Without stabilization, the watcher could fire on an incomplete write, causing JSON parse errors. The 500ms threshold waits until the file hasn't changed for half a second before triggering reload.

**Why watch the directory, not just the file**: Editors may delete and recreate the file (atomic write). By watching the directory for "add" events alongside "change", the watcher catches these patterns.

### 4.2 Reload on File Change

```javascript
// ============================================
// onFileChange - Reloads keybindings on file modification
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

        // Update module-level cache
        cachedBindings = newConfig.bindings;
        cachedWarnings = newConfig.warnings;

        // Notify all subscribers (React components re-render with new bindings)
        reloadSubscribers.forEach(callback => callback(newConfig));
    } catch (error) {
        // If reload fails, keep previous valid config intact
        debug(`[keybindings] Error reloading: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Mapping: Nq7→onFileChange, A→filePath, q→newConfig/error, Mk5→loadKeybindingsAsync, ZM→cachedBindings, GW→cachedWarnings, KS1→reloadSubscribers
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
1. `loadKeybindingsAsync` (Mk5) reads and validates JSON
2. Validation: structure → block → keystroke → duplicates → reserved shortcuts
3. Merge: defaults + user bindings (user wins via last-match)
4. Chokidar watcher triggers `onFileChange` (Nq7) on save
5. Subscribers (React components) receive new config and re-render

**Design principles**:
- **Never crash**: Broken config falls back to defaults
- **Immediate feedback**: Hot-reload in under 1 second
- **Explicit errors**: Validation provides actionable messages
- **User wins**: User bindings always shadow defaults for same key+context

**Last Updated**: 2026-03-15 (Claude Code v2.1.76)
