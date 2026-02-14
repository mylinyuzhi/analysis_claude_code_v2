# Platform-Specific Behavior

## Overview

Claude Code's keybinding system must work across macOS, Windows, and Linux, each with different key mappings, terminal emulators, and system shortcuts. This document analyzes how the system handles platform-specific differences and terminal compatibility.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features

Key functions and constants in this document:
- `iC1` (chunks.53.mjs:2752-2808) - Parses keystroke strings with platform-aware modifiers
- `oqA` (chunks.54.mjs:1355-1383) - macOS reserved shortcuts list
- `rqA` (chunks.54.mjs:1347-1354) - Unix terminal signal shortcuts
- `pqA` (chunks.54.mjs:1340-1347) - Hardcoded reserved shortcuts
- `v77` (chunks.53.mjs:2875-2891) - Key name normalization

## 1. Key Mapping Differences

### macOS: cmd vs meta

**Issue**: macOS users expect `Cmd` as the primary modifier, not `Ctrl`. The `meta` key in terminals typically maps to `Option` (Alt), not `Cmd`.

**Solution**: The keystroke parser `iC1()` treats multiple aliases as equivalent:

```javascript
// ============================================
// iC1 - Parses keystroke strings with platform-aware modifier aliases
// Location: chunks.53.mjs:2752-2808
// ============================================

// ORIGINAL (for source lookup):
function iC1(A) {
    let q = A.split("+"),
        K = {
            key: "",
            ctrl: !1,
            alt: !1,
            shift: !1,
            meta: !1
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
            case "cmd":
            case "command":
                K.meta = !0;
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
        meta: false
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
            case "cmd":      // macOS Command key alias
            case "command":
                normalized.meta = true;
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

// Mapping: iC1→parseKeystroke, A→keystrokeString, q→parts, K→normalized, Y→part, z→lower
```

**Key insight:** By accepting both `cmd` and `meta` as aliases for the same modifier flag, users can write keybindings using their preferred terminology. A binding defined as `cmd+k` will match the same events as `meta+k`.

### Alt/Meta Equivalence in Matching

The matching functions `tN5()` and `eN5()` treat `alt` and `meta` as equivalent:

```javascript
// From chord_mechanism.md, repeated for context
if ((Y.alt || Y.meta) !== (z.alt || z.meta)) return !1;
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

## 2. Terminal Emulator Compatibility

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

**Why Ctrl+M cannot be rebound**: In legacy terminal mode, pressing `Ctrl+M` and pressing `Enter` both send ASCII code 13 (CR). The terminal cannot distinguish them, so the keybinding system cannot bind them separately.

### Terminal.app (macOS)

**Limitations**: macOS's built-in Terminal.app has more limited key event support than iTerm2:
- Option key can be configured to send `+Esc` prefix or `Meta` modifier (user preference).
- Does not support CSI u mode by default.

**Recommendation**: Users experiencing keybinding issues on Terminal.app should:
1. Check Option key settings (Preferences → Profiles → Keyboard → "Use Option as Meta key").
2. Consider using iTerm2 or Alacritty for better compatibility.

### Alacritty, Kitty, WezTerm

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

## 3. Reserved Shortcut Conflicts

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

**Detection**: The validation system (see error_handling.md) checks user keybindings against this list and issues error-level warnings.

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

### How to detect and warn users

The validation function `sqA()` (chunks.54.mjs:1519-1610) checks user bindings against reserved shortcut lists. See error_handling.md for the full validation flow.

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

**User experience**: When loading keybindings.json, users see warnings in the debug log and in the UI notification (see integrations.md for notification details).

## 4. ANSI Escape Sequence Support

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

### Future Enhancement Opportunity

If CSI u support were added:
1. Send enable sequence on startup: `process.stdout.write('\x1b[>1u')`
2. Parse CSI u responses in Ink's input handler
3. Remove hardcoded reserved shortcuts (Ctrl+M could be distinct from Enter)

**Why it's not implemented**: The current system works for 95% of use cases. Adding CSI u would increase complexity for marginal benefit.

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

## Summary: Platform-Specific Recommendations

| Platform | Recommended Modifiers | Avoid | Notes |
|----------|----------------------|-------|-------|
| macOS | `cmd+...`, `ctrl+...` | `cmd+c`, `cmd+v`, `cmd+q`, `cmd+w`, `cmd+tab` | Use `cmd` for primary shortcuts, `ctrl` for secondary |
| Windows | `ctrl+...`, `alt+...` | `ctrl+z`, `alt+F4` | Avoid `meta` (Windows key) - often intercepted by OS |
| Linux | `ctrl+...`, `alt+...` | `ctrl+z`, `ctrl+\`, desktop Super+key bindings | Check your DE's reserved shortcuts |

**Cross-platform chords**: For maximum portability, use `ctrl+k, <key>` patterns that work identically on all platforms.
