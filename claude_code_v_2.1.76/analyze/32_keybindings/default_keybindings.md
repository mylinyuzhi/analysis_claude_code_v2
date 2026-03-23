# Default Keybindings Reference

## Overview

This document provides the complete default keybindings for Claude Code v2.1.76, extracted from the source code constant `DEFAULT_KEYBINDINGS` (XW6) in chunks.89.mjs:2614-2799.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Keybindings

Key symbols in this document:
- `DEFAULT_KEYBINDINGS` (XW6) - Default bindings array constant
- `getDefaultBindings` (rN8) - Function returning default bindings
- `imagePasteKey` (Cu9) - Platform-specific paste key
- `modeCycleKey` (bu9) - Platform-specific mode cycling key
- `supportsShiftTab` (Iu9) - Platform shift+tab support flag

---

## Platform-Specific Keys

Some default keybindings are platform-dependent:

```javascript
// ============================================
// Platform-specific key definitions
// Location: chunks.89.mjs:2614
// ============================================

// ORIGINAL (for source lookup):
Cu9 = y8() === "windows" ? "alt+v" : "ctrl+v",
Iu9 = y8() !== "windows" || (A$6() ? Z$8(process.versions.bun, ">=1.2.23") : Z$8(process.versions.node, ">=22.17.0 <23.0.0 || >=24.2.0")),
bu9 = Iu9 ? "shift+tab" : "meta+m",

// READABLE (for understanding):
imagePasteKey = platform === "windows" ? "alt+v" : "ctrl+v";
supportsShiftTab = platform !== "windows" ||
    (isBun ? semverSatisfies(bunVersion, ">=1.2.23") :
             semverSatisfies(nodeVersion, ">=22.17.0 <23.0.0 || >=24.2.0"));
modeCycleKey = supportsShiftTab ? "shift+tab" : "meta+m";

// Mapping: Cu9→imagePasteKey, Iu9→supportsShiftTab, bu9→modeCycleKey, y8→getPlatform, A$6→isBun, Z$8→semverSatisfies
```

| Variable | Windows | macOS/Linux | Notes |
|----------|---------|-------------|-------|
| `imagePasteKey` | `alt+v` | `ctrl+v` | Paste image from clipboard |
| `modeCycleKey` | `meta+m` | `shift+tab` | Cycle between input modes (requires terminal support) |
| `supportsShiftTab` | Varies | `true` | Depends on Node.js version on Windows |

---

## Complete Default Keybindings by Context

### 1. Global Context

**Always active** — These bindings are available in all UI states.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `ctrl+c` | `app:interrupt` | Interrupt current operation (cancel agent, stop streaming) |
| `ctrl+d` | `app:exit` | Exit Claude Code |
| `ctrl+t` | `app:toggleTodos` | Toggle todo panel visibility |
| `ctrl+o` | `app:toggleTranscript` | Toggle transcript view |
| `ctrl+shift+b` | `app:toggleBrief` | Toggle brief output mode |
| `ctrl+shift+o` | `app:toggleTeammatePreview` | Toggle teammate preview panel |
| `ctrl+r` | `history:search` | Open history search |

---

### 2. Chat Context

**Active when** chat input is focused.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `escape` | `chat:cancel` | Cancel current operation |
| `ctrl+f` | `chat:killAgents` | Kill all running background agents |
| `shift+tab` / `meta+m` | `chat:cycleMode` | Cycle between input modes |
| `meta+p` | `chat:modelPicker` | Open model picker |
| `meta+o` | `chat:fastMode` | Toggle fast mode |
| `meta+t` | `chat:thinkingToggle` | Toggle thinking/extended thinking mode |
| `enter` | `chat:submit` | Submit message to Claude |
| `up` | `history:previous` | Navigate to previous history item |
| `down` | `history:next` | Navigate to next history item |
| `ctrl+_` / `ctrl+shift+-` | `chat:undo` | Undo last edit |
| `ctrl+g` | `chat:externalEditor` | Open external editor |
| `ctrl+s` | `chat:stash` | Stash current message |
| `alt+v` (Win) / `ctrl+v` (Mac/Linux) | `chat:imagePaste` | Paste image from clipboard |
| `space` | `voice:pushToTalk` | Push-to-talk for voice input (hold) |

---

### 3. Autocomplete Context

**Active when** autocomplete suggestions are visible.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `tab` | `autocomplete:accept` | Accept current suggestion |
| `escape` | `autocomplete:dismiss` | Dismiss autocomplete overlay |
| `up` | `autocomplete:previous` | Move to previous suggestion |
| `down` | `autocomplete:next` | Move to next suggestion |

---

### 4. Settings Context

**Active when** settings panel is open.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `escape` | `confirm:no` | Close settings without saving |
| `up` / `k` / `ctrl+p` | `select:previous` | Move selection up |
| `down` / `j` / `ctrl+n` | `select:next` | Move selection down |
| `space` | `select:accept` | Toggle current setting |
| `enter` | `settings:close` | Close settings panel |
| `/` | `settings:search` | Focus search input |
| `r` | `settings:retry` | Retry failed operation |

---

### 5. Confirmation Context

**Active when** confirmation dialog is shown.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `y` / `enter` | `confirm:yes` | Confirm action |
| `n` / `escape` | `confirm:no` | Decline action |
| `up` | `confirm:previous` | Move to previous option |
| `down` | `confirm:next` | Move to next option |
| `tab` | `confirm:nextField` | Move to next input field |
| `space` | `confirm:toggle` | Toggle checkbox/option |
| `shift+tab` | `confirm:cycleMode` | Cycle input mode |
| `ctrl+e` | `confirm:toggleExplanation` | Show/hide explanation |
| `ctrl+d` | `permission:toggleDebug` | Toggle debug mode for permissions |

---

### 6. Tabs Context

**Active when** tab bar has focus.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `tab` | `tabs:next` | Move to next tab |
| `shift+tab` | `tabs:previous` | Move to previous tab |
| `right` | `tabs:next` | Move to next tab |
| `left` | `tabs:previous` | Move to previous tab |

---

### 7. Transcript Context

**Active when** transcript view is open.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `ctrl+e` | `transcript:toggleShowAll` | Toggle showing all messages |
| `ctrl+c` / `escape` | `transcript:exit` | Exit transcript view |

---

### 8. HistorySearch Context

**Active when** history search overlay is open.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `ctrl+r` | `historySearch:next` | Find next matching history item |
| `escape` / `tab` | `historySearch:accept` | Accept selected item |
| `ctrl+c` | `historySearch:cancel` | Cancel history search |
| `enter` | `historySearch:execute` | Execute selected history command |

---

### 9. Task Context

**Active when** task panel is focused.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `ctrl+b` | `task:background` | Send task to background |

---

### 10. ThemePicker Context

**Active when** theme picker is open.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `ctrl+t` | `theme:toggleSyntaxHighlighting` | Toggle syntax highlighting |

---

### 11. Help Context

**Active when** help modal is shown.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `escape` | `help:dismiss` | Close help modal |

---

### 12. Attachments Context

**Active when** attachment list is visible.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `right` | `attachments:next` | Move to next attachment |
| `left` | `attachments:previous` | Move to previous attachment |
| `backspace` / `delete` | `attachments:remove` | Remove selected attachment |
| `down` / `escape` | `attachments:exit` | Exit attachment list |

---

### 13. Footer Context

**Active when** footer area is focused.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `right` | `footer:next` | Move to next footer item |
| `left` | `footer:previous` | Move to previous footer item |
| `enter` | `footer:openSelected` | Open selected footer item |
| `escape` | `footer:clearSelection` | Clear footer selection |

---

### 14. MessageSelector Context

**Active when** selecting messages for operations.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `up` / `k` / `ctrl+p` | `messageSelector:up` | Move selection up |
| `down` / `j` / `ctrl+n` | `messageSelector:down` | Move selection down |
| `ctrl+up` / `shift+up` / `meta+up` / `shift+k` | `messageSelector:top` | Move to top message |
| `ctrl+down` / `shift+down` / `meta+down` / `shift+j` | `messageSelector:bottom` | Move to bottom message |
| `enter` | `messageSelector:select` | Select current message |

---

### 15. DiffDialog Context

**Active when** diff view is open.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `escape` | `diff:dismiss` | Close diff dialog |
| `left` | `diff:previousSource` | View previous source |
| `right` | `diff:nextSource` | View next source |
| `up` | `diff:previousFile` | View previous file |
| `down` | `diff:nextFile` | View next file |
| `enter` | `diff:viewDetails` | View file details |

---

### 16. ModelPicker Context

**Active when** model picker is open.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `left` | `modelPicker:decreaseEffort` | Decrease reasoning effort |
| `right` | `modelPicker:increaseEffort` | Increase reasoning effort |

---

### 17. Select Context

**Active when** generic select dropdown is open.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `up` / `k` / `ctrl+p` | `select:previous` | Move to previous option |
| `down` / `j` / `ctrl+n` | `select:next` | Move to next option |
| `enter` | `select:accept` | Accept current selection |
| `escape` | `select:cancel` | Cancel selection |

---

### 18. Plugin Context

**Active when** plugin UI is active.

| Keystroke | Action | Description |
|-----------|--------|-------------|
| `space` | `plugin:toggle` | Toggle plugin state |
| `i` | `plugin:install` | Install plugin |

---

## Source Code Reference

```javascript
// ============================================
// XW6 - Complete DEFAULT_KEYBINDINGS array
// Location: chunks.89.mjs:2614-2799
// ============================================

// ORIGINAL (for source lookup):
XW6 = [{
    context: "Global",
    bindings: {
        "ctrl+c": "app:interrupt",
        "ctrl+d": "app:exit",
        "ctrl+t": "app:toggleTodos",
        "ctrl+o": "app:toggleTranscript",
        ...{ "ctrl+shift+b": "app:toggleBrief" },
        "ctrl+shift+o": "app:toggleTeammatePreview",
        "ctrl+r": "history:search",
        ...{}, ...{}, ...{}
    }
}, {
    context: "Chat",
    bindings: {
        escape: "chat:cancel",
        "ctrl+f": "chat:killAgents",
        [bu9]: "chat:cycleMode",
        "meta+p": "chat:modelPicker",
        "meta+o": "chat:fastMode",
        "meta+t": "chat:thinkingToggle",
        enter: "chat:submit",
        up: "history:previous",
        down: "history:next",
        "ctrl+_": "chat:undo",
        "ctrl+shift+-": "chat:undo",
        "ctrl+g": "chat:externalEditor",
        "ctrl+s": "chat:stash",
        [Cu9]: "chat:imagePaste",
        ...{ space: "voice:pushToTalk" }
    }
}, {
    context: "Autocomplete",
    bindings: {
        tab: "autocomplete:accept",
        escape: "autocomplete:dismiss",
        up: "autocomplete:previous",
        down: "autocomplete:next"
    }
}, {
    context: "Settings",
    bindings: {
        escape: "confirm:no",
        up: "select:previous",
        down: "select:next",
        k: "select:previous",
        j: "select:next",
        "ctrl+p": "select:previous",
        "ctrl+n": "select:next",
        space: "select:accept",
        enter: "settings:close",
        "/": "settings:search",
        r: "settings:retry"
    }
}, {
    context: "Confirmation",
    bindings: {
        y: "confirm:yes",
        n: "confirm:no",
        enter: "confirm:yes",
        escape: "confirm:no",
        up: "confirm:previous",
        down: "confirm:next",
        tab: "confirm:nextField",
        space: "confirm:toggle",
        "shift+tab": "confirm:cycleMode",
        "ctrl+e": "confirm:toggleExplanation",
        "ctrl+d": "permission:toggleDebug"
    }
}, {
    context: "Tabs",
    bindings: {
        tab: "tabs:next",
        "shift+tab": "tabs:previous",
        right: "tabs:next",
        left: "tabs:previous"
    }
}, {
    context: "Transcript",
    bindings: {
        "ctrl+e": "transcript:toggleShowAll",
        "ctrl+c": "transcript:exit",
        escape: "transcript:exit"
    }
}, {
    context: "HistorySearch",
    bindings: {
        "ctrl+r": "historySearch:next",
        escape: "historySearch:accept",
        tab: "historySearch:accept",
        "ctrl+c": "historySearch:cancel",
        enter: "historySearch:execute"
    }
}, {
    context: "Task",
    bindings: { "ctrl+b": "task:background" }
}, {
    context: "ThemePicker",
    bindings: { "ctrl+t": "theme:toggleSyntaxHighlighting" }
}, ...[], {
    context: "Help",
    bindings: { escape: "help:dismiss" }
}, {
    context: "Attachments",
    bindings: {
        right: "attachments:next",
        left: "attachments:previous",
        backspace: "attachments:remove",
        delete: "attachments:remove",
        down: "attachments:exit",
        escape: "attachments:exit"
    }
}, {
    context: "Footer",
    bindings: {
        right: "footer:next",
        left: "footer:previous",
        enter: "footer:openSelected",
        escape: "footer:clearSelection"
    }
}, {
    context: "MessageSelector",
    bindings: {
        up: "messageSelector:up",
        down: "messageSelector:down",
        k: "messageSelector:up",
        j: "messageSelector:down",
        "ctrl+p": "messageSelector:up",
        "ctrl+n": "messageSelector:down",
        "ctrl+up": "messageSelector:top",
        "shift+up": "messageSelector:top",
        "meta+up": "messageSelector:top",
        "shift+k": "messageSelector:top",
        "ctrl+down": "messageSelector:bottom",
        "shift+down": "messageSelector:bottom",
        "meta+down": "messageSelector:bottom",
        "shift+j": "messageSelector:bottom",
        enter: "messageSelector:select"
    }
}, {
    context: "DiffDialog",
    bindings: {
        escape: "diff:dismiss",
        left: "diff:previousSource",
        right: "diff:nextSource",
        up: "diff:previousFile",
        down: "diff:nextFile",
        enter: "diff:viewDetails"
    }
}, {
    context: "ModelPicker",
    bindings: {
        left: "modelPicker:decreaseEffort",
        right: "modelPicker:increaseEffort"
    }
}, {
    context: "Select",
    bindings: {
        up: "select:previous",
        down: "select:next",
        j: "select:next",
        k: "select:previous",
        "ctrl+n": "select:next",
        "ctrl+p": "select:previous",
        enter: "select:accept",
        escape: "select:cancel"
    }
}, {
    context: "Plugin",
    bindings: {
        space: "plugin:toggle",
        i: "plugin:install"
    }
}]

// Mapping: XW6→DEFAULT_KEYBINDINGS, bu9→modeCycleKey, Cu9→imagePasteKey
```

---

## Action Categories

Actions follow a naming convention: `<context>:<verb>` or `<domain>:<action>`.

### App Actions (`app:*`)
| Action | Description |
|--------|-------------|
| `app:interrupt` | Interrupt current operation |
| `app:exit` | Exit Claude Code |
| `app:toggleTodos` | Toggle todo panel |
| `app:toggleTranscript` | Toggle transcript view |
| `app:toggleBrief` | Toggle brief output mode |
| `app:toggleTeammatePreview` | Toggle teammate preview |

### Chat Actions (`chat:*`)
| Action | Description |
|--------|-------------|
| `chat:submit` | Submit message |
| `chat:cancel` | Cancel operation |
| `chat:cycleMode` | Cycle input mode |
| `chat:modelPicker` | Open model picker |
| `chat:fastMode` | Toggle fast mode |
| `chat:thinkingToggle` | Toggle thinking mode |
| `chat:externalEditor` | Open external editor |
| `chat:stash` | Stash message |
| `chat:undo` | Undo last edit |
| `chat:imagePaste` | Paste image |
| `chat:killAgents` | Kill background agents |

### Voice Actions (`voice:*`)
| Action | Description |
|--------|-------------|
| `voice:pushToTalk` | Push-to-talk (hold space) |

### History Actions (`history:*`)
| Action | Description |
|--------|-------------|
| `history:previous` | Previous history item |
| `history:next` | Next history item |
| `history:search` | Open history search |

### Confirm Actions (`confirm:*`)
| Action | Description |
|--------|-------------|
| `confirm:yes` | Confirm |
| `confirm:no` | Decline |
| `confirm:previous` | Previous option |
| `confirm:next` | Next option |
| `confirm:nextField` | Next field |
| `confirm:toggle` | Toggle option |
| `confirm:cycleMode` | Cycle mode |
| `confirm:toggleExplanation` | Toggle explanation |

### Select Actions (`select:*`)
| Action | Description |
|--------|-------------|
| `select:previous` | Previous item |
| `select:next` | Next item |
| `select:accept` | Accept selection |
| `select:cancel` | Cancel selection |

### Autocomplete Actions (`autocomplete:*`)
| Action | Description |
|--------|-------------|
| `autocomplete:accept` | Accept suggestion |
| `autocomplete:dismiss` | Dismiss overlay |
| `autocomplete:previous` | Previous suggestion |
| `autocomplete:next` | Next suggestion |

---

## Customization Examples

### Adding a Chord Binding

```json
{
    "bindings": [{
        "context": "Chat",
        "bindings": {
            "ctrl+k ctrl+s": "chat:save",
            "ctrl+k ctrl+l": "chat:clear"
        }
    }]
}
```

### Unbinding a Default

```json
{
    "bindings": [{
        "context": "Chat",
        "bindings": {
            "enter": null
        }
    }]
}
```

### Adding a Slash Command Binding

```json
{
    "bindings": [{
        "context": "Chat",
        "bindings": {
            "ctrl+shift+d": "command:doctor"
        }
    }]
}
```

---

## Summary

- **18 contexts** organize keybindings by UI state
- **80+ default actions** available across all contexts
- **Platform-specific keys** adapt to terminal capabilities
- **Voice PTT** enabled via `space` hold in Chat context (v2.1.76)
- **Vim-style navigation** (`j`/`k`) in Settings, MessageSelector, and Select contexts

**Last Updated**: 2026-03-23 (Claude Code v2.1.76)