# Keybindings Conflict Resolution

## Overview

Analysis of how Claude Code handles conflicting keybindings between defaults, user config, and system shortcuts.

---

## 1. Priority Chain

**Resolution Order** (highest to lowest):

1. **User Config** (`~/.claude/keybindings.json`)
2. **Default Bindings** (built-in)
3. **System Shortcuts** (terminal/OS - not overridable)

---

## 2. Conflict Examples

### 2.1 User Override

**Scenario**: User wants `enter` to insert newline, not submit

**Config**:
```json
{
    "enter": "insert_newline",
    "ctrl+enter": "submit"
}
```

**Result**: Enter key inserts newline; Ctrl+Enter submits (user config wins)

---

### 2.2 Chord vs Single Key

**Scenario**: `ctrl+k` bound to two actions

**Config**:
```json
{
    "ctrl+k": "kill_line",
    "ctrl+k ctrl+c": "comment"
}
```

**Resolution**:
- Press `ctrl+k` → Wait 1000ms
- No second key → Execute `kill_line`
- Press `ctrl+c` within timeout → Execute `comment` (chord wins)

---

## 3. Platform-Specific Handling

**macOS**:
- `cmd` key primary modifier
- `ctrl` key secondary

**Linux/Windows**:
- `ctrl` key primary modifier
- No `cmd` key

**Cross-Platform Mapping**:
```json
{
    "meta+s": "submit"  // Maps to cmd on macOS, ctrl on Linux
}
```

---

## Summary

Conflict resolution uses **user-first priority** with **chord detection via timeout**, ensuring customization while maintaining intuitive behavior.
