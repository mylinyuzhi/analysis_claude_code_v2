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

## Summary

Keybindings provide **full customization** of keyboard shortcuts via a simple JSON config file with hot-reload support and chord sequence capabilities.
