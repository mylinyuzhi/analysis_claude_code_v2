# Platform-Specific Behavior

## Overview

Claude Code's keybinding system must work across macOS, Windows, and Linux, each with different key mappings, terminal emulators, and system shortcuts. This document analyzes how the system handles platform-specific differences and terminal compatibility.

**Version**: Claude Code v2.1.76

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and constants in this document:
- `iC1` (chunks.53.mjs:2752-2808) - Parses keystroke strings with platform-aware modifiers
- `oqA` (chunks.54.mjs:1355-1383) - macOS reserved shortcuts list
- `rqA` (chunks.54.mjs:1347-1354) - Unix terminal signal shortcuts
- `pqA` (chunks.54.mjs:1340-1347) - Hardcoded reserved shortcuts
- `v77` (chunks.53.mjs:2875-2891) - Key name normalization
- `nE5` - Platform-specific image paste key
- `oE5` - Platform-specific mode cycle key

## 1. Key Mapping Differences

### macOS: cmd vs meta

**Issue**: macOS users expect `Cmd` as the primary modifier, not `Ctrl`. The `meta` key in terminals typically maps to `Option` (Alt), not `Cmd`.

**Solution**: The keystroke parser `Qu6()` treats multiple aliases as equivalent:

```javascript
// ============================================
// Qu6 - Parses keystroke strings with platform-aware modifier aliases
// Location: chunks.65.mjs:533-594
// ============================================

// ORIGINAL (for source lookup):
function Qu6(A) {
    let q = A.split("+"),
        K = {
            key: "",
            ctrl: !1,
            alt: !1,
            shift: !1,
            meta: !1,
            super: !1
        };
    for (let Y of q) {
        let z = Y.toLowerCase();
        switch (z) {
            case "ctrl":
            case "control":
                K.ctrl = !0;
                break;
            case "alt":
            case "opt":
            case "option":
                K.alt = !0;
                break;
            case "shift":
                K.shift = !0;
                break;
            case "meta":
                K.meta = !0;
                break;
            case "cmd":
            case "command":
            case "super":
            case "win":
                K.super = !0;
                break;
            case "esc":
                K.key = "escape";
                break;
            case "return":
                K.key = "enter";
                break;
            case "space":
                K.key = " ";
                break;
            case "↑":
                K.key = "up";
                break;
            case "↓":
                K.key = "down";
                break;
            case "←":
                K.key = "left";
                break;
            case "→":
                K.key = "right";
                break;
            default:
                K.key = z;
                break
        }
    }
    return K
}

// READABLE (for understanding):
function parseKeystroke(keystrokeString) {
    let parts = keystrokeString.split("+");
    let normalized = {
        key: "",
        ctrl: false,
        alt: false,
        shift: false,
        meta: false,
        super: false
    };

    for (let part of parts) {
        let lower = part.toLowerCase();
        switch (lower) {
            case "ctrl":
            case "control":
                normalized.ctrl = true;
                break;

            case "alt":
            case "opt":      // macOS Option key alias
            case "option":
                normalized.alt = true;
                break;

            case "shift":
                normalized.shift = true;
                break;

            case "meta":
                normalized.meta = true;
                break;

            case "cmd":      // macOS Command key alias
            case "command":
            case "super":    // Linux Super key
            case "win":      // Windows key
                normalized.super = true;
                break;

            // Key name aliases
            case "esc":
                normalized.key = "escape";
                break;
            case "return":
                normalized.key = "enter";
                break;
            case "space":
                normalized.key = " ";
                break;

            // Unicode arrow support
            case "↑":
                normalized.key = "up";
                break;
            case "↓":
                normalized.key = "down";
                break;
            case "←":
                normalized.key = "left";
                break;
            case "→":
                normalized.key = "right";
                break;

            default:
                normalized.key = lower;
                break;
        }
    }

    return normalized;
}

// Mapping: Qu6→parseKeystroke, A→keystrokeString, q→parts, K→normalized, Y→part, z→lower
```

**Key insight:** The parser distinguishes between `meta` and `super` (cmd/win/command):
- `meta` maps to the terminal's Meta modifier (often Option on macOS)
- `cmd`/`command`/`super`/`win` map to the Super modifier (Command on macOS, Windows key on Windows/Linux)

This separation allows precise control over which modifier to use, while still supporting common aliases.

### Alt/Meta/Super Equivalence in Matching

The matching function `W$1()` (keystrokesMatch) treats `alt` and `meta` as equivalent:

```javascript
// ============================================
// W$1 - Keystroke matching with alt/meta equivalence
// Location: chunks.65.mjs:732-734
// ============================================

// ORIGINAL (for source lookup):
function W$1(A, q) {
    return A.key === q.key && A.ctrl === q.ctrl && A.shift === q.shift && (A.alt || A.meta) === (q.alt || q.meta) && A.super === q.super
}

// READABLE (for understanding):
function keystrokesMatch(keystrokeA, keystrokeB) {
    return keystrokeA.key === keystrokeB.key &&
           keystrokeA.ctrl === keystrokeB.ctrl &&
           keystrokeA.shift === keystrokeB.shift &&
           (keystrokeA.alt || keystrokeA.meta) === (keystrokeB.alt || keystrokeB.meta) &&
           keystrokeA.super === keystrokeB.super;
}

// Mapping: W$1→keystrokesMatch, A→keystrokeA, q→keystrokeB
```

**Why this matters**: On some terminals, the `Option` key sends `alt`, while on others it sends `meta` (or can be configured either way). This equivalence ensures cross-platform consistency.

### Windows: alt behavior

**Issue**: On Windows, `Alt` is often used for menu access (Alt+F for File menu). In terminals, Alt combinations can conflict with system shortcuts.

**Solution**: Claude Code relies on the terminal emulator to forward Alt combinations. No special Windows-specific handling exists in the codebase, which means:
- Users in Windows Terminal, ConEmu, or other modern emulators should have full Alt support.
- Legacy cmd.exe or older terminals may not forward all Alt combinations correctly.

**Recommendation for users**: Use Ctrl-based shortcuts on Windows for maximum compatibility.

### Linux: meta key variations

**Issue**: Linux systems have varying `Super` (Windows key) and `Meta` key configurations depending on the desktop environment and terminal.

**Solution**: The system treats `meta` as a distinct modifier from `ctrl` and `alt`. Linux users can:
- Use `meta+...` in keybindings.json, which will work if their terminal forwards Super/Windows key events.
- Stick to `ctrl+...` and `alt+...` for guaranteed compatibility.

**Terminal behavior**: Most modern Linux terminals (GNOME Terminal, Konsole, Alacritty) forward `Super` as `meta` events. However, many desktop environments intercept Super+key combinations for system shortcuts (e.g., Super+T for terminal), preventing them from reaching the application.

## 2. Platform-Specific Keybinding Variations

### Image Paste Key and Mode Cycle Key

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

**Platform-specific variations:**

| Key Function | Windows | macOS/Linux | Notes |
|---|---|---|---|
| Image paste (`nE5`) | `alt+v` | `ctrl+v` | ctrl+v reserved for system paste on Windows |
| Mode cycle (`oE5`) | `meta+m` (fallback) or `shift+tab` | `shift+tab` | Requires Node 22.17+, 24.2+ or Bun 1.2.23+ |

**Why this matters**:
- Older Node.js versions on Windows don't properly distinguish shift+tab from tab due to terminal input limitations
- The fallback to `meta+m` ensures mode cycling always works
- Image paste uses `alt+v` on Windows because `ctrl+v` is reserved for system clipboard paste

### macOS Agent Teams Keybindings (v2.1.76)

In v2.1.76, the Agent Teams feature introduces additional macOS-specific keybindings for pane management within team sessions:

**Agent pane navigation** (macOS-specific, cmd-based):
- `cmd+[` - Focus previous agent pane
- `cmd+]` - Focus next agent pane
- `cmd+shift+f` - Filter/search agent list (Ctrl+F on other platforms)

**Why cmd-based on macOS**: These pane navigation shortcuts use `cmd` (meta) to avoid conflict with existing `ctrl`-based global shortcuts that are platform-independent. macOS users expect `cmd` for pane switching (matching iTerm2, VS Code, etc.).

## 3. Terminal Emulator Compatibility

### iTerm2 (macOS)

**CSI u Protocol**: iTerm2 supports the CSI u protocol, which provides unambiguous key event reporting. This allows distinguishing between:
- `Ctrl+I` vs `Tab` (both send the same code in legacy terminals)
- `Ctrl+M` vs `Enter` (both send CR)
- `Ctrl+[` vs `Escape`

**Claude Code's approach**: The codebase does NOT explicitly enable CSI u mode. Instead, it relies on Ink's built-in key event handling, which uses Node.js's readline and TTY APIs.

**Result**: Some ambiguous keys are hardcoded as reserved:

```javascript
// ============================================
// pqA - Hardcoded reserved shortcuts (terminal limitations)
// Location: chunks.54.mjs:1340-1347
// ============================================

// ORIGINAL (for source lookup):
pqA = [{
    key: "ctrl+d",
    reason: "Cannot be rebound - used for exit (hardcoded)",
    severity: "error"
}, {
    key: "ctrl+m",
    reason: "Cannot be rebound - identical to Enter in terminals (both send CR)",
    severity: "error"
}]

// READABLE (for understanding):
const HARDCODED_RESERVED_SHORTCUTS = [{
    key: "ctrl+d",
    reason: "Cannot be rebound - used for exit (hardcoded)",
    severity: "error"
}, {
    key: "ctrl+m",
    reason: "Cannot be rebound - identical to Enter in terminals (both send CR)",
    severity: "error"
}];

// Mapping: pqA→HARDCODED_RESERVED_SHORTCUTS
```

**Why Ctrl+M cannot be rebound**: In legacy terminal mode, pressing `Ctrl+M` and pressing `Enter` both send ASCII code 13 (CR). The terminal cannot distinguish them.

### Terminal.app (macOS)

**Limitations**: macOS's built-in Terminal.app has more limited key event support than iTerm2:
- Option key can be configured to send `+Esc` prefix or `Meta` modifier (user preference).
- Does not support CSI u mode by default.

**Recommendation**: Users experiencing keybinding issues on Terminal.app should:
1. Check Option key settings (Preferences → Profiles → Keyboard → "Use Option as Meta key").
2. Consider using iTerm2 or Alacritty for better compatibility.

### Alacritty, Kitty, WezTerm, Ghostty

**Modern terminal emulators**: These support advanced features like:
- CSI u protocol (disambiguates all key combinations)
- True color
- Extended mouse reporting

**Claude Code compatibility**: Since Claude Code uses Ink (which uses Node.js TTY), it automatically benefits from any key events the terminal forwards. No special configuration is needed.

### Windows Terminal, ConEmu

**Windows compatibility**: These modern Windows terminal emulators provide good Unix-like key event support.

**Limitations**: Windows Terminal's default behavior intercepts some shortcuts for tabs and panes:
- `Ctrl+Shift+T` - New tab
- `Ctrl+W` - Close pane
- `Alt+Shift+D` - Split pane

**Workaround**: Users can disable these in Windows Terminal settings, or use different shortcuts in Claude Code.

## 4. Reserved Shortcut Conflicts

### OS-level shortcuts that cannot be intercepted

macOS system shortcuts take precedence over terminal applications:

```javascript
// ============================================
// oqA - macOS system shortcuts (cannot be rebound)
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
const MACOS_RESERVED_SHORTCUTS = [{
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
}];

// Mapping: oqA→MACOS_RESERVED_SHORTCUTS
```

**Detection**: The validation system checks user keybindings against this list and issues error-level warnings.

**Result**: Users attempting to bind `cmd+q` will see:
```
Error: Cannot bind "cmd+q" - macOS quit application
```

### Terminal emulator shortcuts

Unix terminals reserve certain control sequences for process management:

```javascript
// ============================================
// rqA - Unix terminal signal shortcuts
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
const UNIX_TERMINAL_RESERVED_SHORTCUTS = [{
    key: "ctrl+z",
    reason: "Unix process suspend (SIGTSTP)",
    severity: "warning"  // Warning, not error - advanced users may want this
}, {
    key: "ctrl+\\",
    reason: "Terminal quit signal (SIGQUIT)",
    severity: "error"  // Error - sends SIGQUIT, kills the process
}];

// Mapping: rqA→UNIX_TERMINAL_RESERVED_SHORTCUTS
```

**Why Ctrl+Z is a warning, not an error**: Advanced users may want to rebind Ctrl+Z, knowing they can still suspend with `kill -TSTP <pid>`. However, Ctrl+\ (SIGQUIT) is an error because it terminates the process with prejudice - no graceful shutdown.

**Platform detection**: The codebase uses `process.platform` to conditionally apply macOS-specific warnings:

```javascript
// From validation logic (chunks.54.mjs, inferred from structure)
if (process.platform === "darwin") {
    // Check against MACOS_RESERVED_SHORTCUTS
    reservedChecks.push(...MACOS_RESERVED_SHORTCUTS);
}
// Always check Unix terminal signals (macOS and Linux)
if (process.platform !== "win32") {
    reservedChecks.push(...UNIX_TERMINAL_RESERVED_SHORTCUTS);
}
```

## 5. Key Name Normalization

The `v77()` function normalizes raw input to consistent key names:

```javascript
// ============================================
// v77 - Key name normalization (platform-independent)
// Location: chunks.53.mjs:2875-2891
// ============================================

// ORIGINAL (for source lookup):
function v77(A, q) {
    if (q.escape) return "escape";
    if (q.return) return "enter";
    if (q.tab) return "tab";
    if (q.backspace) return "backspace";
    if (q.delete) return "delete";
    if (q.upArrow) return "up";
    if (q.downArrow) return "down";
    if (q.leftArrow) return "left";
    if (q.rightArrow) return "right";
    if (q.pageUp) return "pageup";
    if (q.pageDown) return "pagedown";
    if (q.home) return "home";
    if (q.end) return "end";
    if (A.length === 1) return A.toLowerCase();
    return null
}

// READABLE (for understanding):
function normalizeKeyName(inputString, keyEvent) {
    // Special keys have boolean flags in Ink's event
    if (keyEvent.escape) return "escape";
    if (keyEvent.return) return "enter";
    if (keyEvent.tab) return "tab";
    if (keyEvent.backspace) return "backspace";
    if (keyEvent.delete) return "delete";

    // Arrow keys
    if (keyEvent.upArrow) return "up";
    if (keyEvent.downArrow) return "down";
    if (keyEvent.leftArrow) return "left";
    if (keyEvent.rightArrow) return "right";

    // Navigation keys
    if (keyEvent.pageUp) return "pageup";
    if (keyEvent.pageDown) return "pagedown";
    if (keyEvent.home) return "home";
    if (keyEvent.end) return "end";

    // Single character (alphanumeric or symbol)
    if (inputString.length === 1) {
        return inputString.toLowerCase();
    }

    // Unrecognized or modifier-only
    return null;
}

// Mapping: v77→normalizeKeyName, A→inputString, q→keyEvent
```

**Why lowercase normalization**: The `inputString.toLowerCase()` call ensures that `Shift+A` produces `key: "a", shift: true`, not `key: "A"`. This allows bindings to be case-insensitive unless shift is explicitly required.

**Example**:
- User presses: `Shift+K`
- Ink provides: `inputString = "K"`, `keyEvent.shift = true`
- Normalized: `{ key: "k", shift: true }`
- Matches binding: `"shift+k"`

## 6. ANSI Escape Sequence Support

### Current Implementation

Claude Code does NOT directly parse ANSI escape sequences for keybindings. Instead, it relies on:
1. **Ink's useInput hook**: Provides normalized key events from the terminal.
2. **Node.js readline**: Handles raw terminal input parsing.
3. **TTY mode**: Enables raw mode for character-by-character input.

### Why CSI u Protocol is Not Explicitly Enabled

**CSI u** (also called "fixterms" or "disambiguate") is a protocol where:
- Applications send `\x1b[>1u` to enable it.
- The terminal sends extended key codes like `\x1b[97;5u` (Ctrl+A with modifiers encoded).

**Claude Code's approach**: By not enabling CSI u, the system maintains compatibility with older terminals while accepting that some key combinations are ambiguous (e.g., Ctrl+I = Tab).

**Trade-off**:
- **Pro**: Works on any terminal, including legacy ones.
- **Con**: Cannot distinguish Ctrl+I from Tab, Ctrl+M from Enter, Ctrl+[ from Escape.

## Summary: Platform-Specific Recommendations

| Platform | Recommended Modifiers | Avoid | Notes |
|----------|----------------------|-------|-------|
| macOS | `cmd+...`, `ctrl+...` | `cmd+c`, `cmd+v`, `cmd+q`, `cmd+w`, `cmd+tab` | Use `cmd` for primary shortcuts, `ctrl` for secondary |
| Windows | `ctrl+...`, `alt+...` | `ctrl+z`, `alt+F4` | Avoid `meta` (Windows key) - often intercepted by OS |
| Linux | `ctrl+...`, `alt+...` | `ctrl+z`, `ctrl+\`, desktop Super+key bindings | Check your DE's reserved shortcuts |

**Cross-platform chords**: For maximum portability, use `ctrl+k, <key>` patterns that work identically on all platforms.

**v2.1.76 Agent Teams note**: Agent team pane keybindings on macOS use `cmd+[` and `cmd+]` for consistency with macOS pane switching conventions. On other platforms, `ctrl+[` and `ctrl+]` are used where available.
