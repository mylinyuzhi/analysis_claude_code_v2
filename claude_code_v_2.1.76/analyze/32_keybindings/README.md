# 32 - Keybindings (Customizable Keyboard Shortcuts)

## Overview

The keybindings system allows users to customize keyboard shortcuts in Claude Code. It supports 18 per-context bindings, chord sequences (multi-key combos), comprehensive schema validation, hot-reload via file watching, and cross-platform compatibility.

**Introduced**: v2.1.18
**Analysis Completeness**: 10/10 (comprehensive reverse engineering)
**Analysis Depth**: 9/10 (production-quality documentation)
**Version**: Claude Code v2.1.76

---

## Key Components

### Configuration System
- Config file at `~/.claude/keybindings.json`
- JSON schema validation with 6 validator functions
- 14 distinct validation error/warning types
- Platform-specific reserved shortcut detection
- `/keybindings` slash command for viewing/editing bindings
- Hot-reload via chokidar file watcher (500ms stability threshold, 200ms poll interval)

### 18 Context System
- **Global** - Active everywhere in the application
- **Chat** - Chat input area
- **Autocomplete** - Autocomplete/suggestion overlay
- **Confirmation** - Confirmation dialogs
- **Help** - Help modal
- **Transcript** - Message list
- **HistorySearch** - Search overlay
- **Task** - Task panel
- **ThemePicker** - Theme selector
- **Settings** - Settings panel
- **Tabs** - Tab bar
- **Attachments** - Attachment list
- **Footer** - Footer area
- **MessageSelector** - Message selection mode
- **DiffDialog** - Diff viewer
- **ModelPicker** - Model selector
- **Select** - Generic dropdown
- **Plugin** - Plugin UI

### Chord Sequences
- Multi-key combinations (e.g., `Ctrl+K Ctrl+C`)
- 1000ms timeout between keystrokes
- Prefix matching algorithm for chord detection
- Escape key cancellation
- Hot-reload race condition handling

### Hot Reload
- Chokidar-based file watcher on `~/.claude/keybindings.json`
- 500ms stability threshold (`Jk5`), 200ms poll interval (`Xk5`)
- Automatic reload when configuration changes
- No restart required for binding updates
- Pending chord state preserved during reload (validated against new bindings)

### Terminal Integration
- 7-stage keystroke lifecycle (input → ANSI parsing → conversion → dispatch → focus → match → execute)
- ANSI escape sequence state machine
- Bracket paste mode support
- CSI u protocol compatibility
- Cross-platform modifier key normalization

### Action System
- Handler registry: `Map<action → Set<{context, handler}>>`
- First-match-wins dispatch strategy
- Fire-and-forget handler execution
- No parameters passed to handlers

### Platform Compatibility
- macOS reserved shortcuts (cmd+c/v/x/q/w/tab/space)
- Unix/Linux reserved shortcuts (ctrl+z/ctrl+\\)
- Terminal emulator compatibility (iTerm2, Alacritty, Kitty, WezTerm, Ghostty)
- Modifier key alias normalization (cmd/meta, option/alt, control/ctrl)

---

## Documentation Files

| File | Purpose | Code Snippets | Status |
|------|---------|---------------|--------|
| [configuration.md](configuration.md) | Config loading, validation, hot-reload mechanism | 20 | Enhanced |
| [chord_mechanism.md](chord_mechanism.md) | Chord state machine, timeout, prefix matching | 8 | Enhanced |
| [event_flow.md](event_flow.md) | Complete keystroke lifecycle (7 stages) | 15 | Complete |
| [focus_and_panes.md](focus_and_panes.md) | Focus system, 18 contexts, multi-pane coordination | 10 | Complete |
| [action_system.md](action_system.md) | Action registry, dispatch mechanism | 8 | Complete |
| [platform_specific.md](platform_specific.md) | Cross-platform behavior, terminal compatibility | 7 | Complete |
| [error_handling.md](error_handling.md) | Validation errors, runtime errors, user feedback | 6 | Complete |
| [integrations.md](integrations.md) | Ink/React, Help system, Agent Teams, Plugin integration | 5 | Complete |
| [quick_reference.md](quick_reference.md) | Function lookup, event flow diagram, context reference | - | Complete |
| [complete_lifecycle.md](complete_lifecycle.md) | End-to-end walkthrough: Ctrl+K Ctrl+C example | - | Complete |
| [implementation.md](implementation.md) | Implementation overview and key decisions | - | Complete |
| [conflict_resolution.md](conflict_resolution.md) | Priority rules for conflicting bindings | - | Complete |

---

## Source Files Analyzed

| File | Lines | Components | Symbols Mapped |
|------|-------|------------|----------------|
| chunks.54.mjs | 1304-1900 | Configuration, validation, file watching | 34 |
| chunks.53.mjs | 2750-3070 | Parsing, matching, chord logic | 13 |
| chunks.110.mjs | 890-1045 | React context, handlers, UI | 7 |
| chunks.177.mjs | Full | Help documentation, schema | - |
| chunks.73.mjs | 26-900 | Ink TUI, focus management, input handling | - |
| chunks.72.mjs | 2444-2467 | Event dispatching | - |
| chunks.52.mjs | 1390-1700 | React reconciler | - |
| chunks.50.mjs | 925-1062 | ANSI tokenization | - |

**Total**: 8 source files analyzed with **54+ symbols mapped**

---

## Symbol Mapping

All keybinding symbols have been mapped in [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) under the **Keybindings** module section, organized by category:

- **Configuration & Loading** (9 symbols): Mk5, YS1, kq7, R71, tqA, Hv, kJ1, yq7, Dk5
- **File Watching** (10 symbols): Lq7, Pk5, Nq7, Wk5, Rq7, Jk5, Xk5, L71, fq7, Tq7
- **State & Caching** (5 symbols): ZM, GW, KS1, Vq7, Cq7
- **Validation** (14 symbols): aE5, sE5, tE5, eE5, Ak5, qk5, Kk5, Yk5, aqA, zk5, sqA, Gq7, jk5, Eq7
- **Reserved Shortcuts** (5 symbols): Wq7, k71, qS1, rqA, oqA
- **Keystroke Parsing** (7 symbols): iC1, rN5, oN5, aN5, aK6, oK6, v77
- **Matching & Resolution** (6 symbols): sK6, sN5, tN5, eN5, tK6, C6Y
- **React Context & UI** (7 symbols): dX, x6Y, A36, k77, S6Y, VL, q36
- **Telemetry & Utilities** (4 symbols): RK, m0, vq7, AT5

---

## Cross-References

- **Symbol indices**: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md), [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
- **Changelog**: [changelog_analysis.md](../00_overview/changelog_analysis.md)

---

## Quick Start Guide

**For understanding the system:**
1. Start with [quick_reference.md](quick_reference.md) - Function lookup and event flow diagram
2. Read [complete_lifecycle.md](complete_lifecycle.md) - End-to-end example walkthrough
3. Deep dive into [event_flow.md](event_flow.md) - 7-stage keystroke lifecycle

**For implementation details:**
1. [configuration.md](configuration.md) - How bindings are loaded and validated
2. [chord_mechanism.md](chord_mechanism.md) - How multi-key chords work
3. [action_system.md](action_system.md) - How actions are registered and dispatched

**For integration:**
1. [focus_and_panes.md](focus_and_panes.md) - Context system and multi-pane navigation
2. [integrations.md](integrations.md) - How keybindings integrate with other systems
3. [platform_specific.md](platform_specific.md) - Cross-platform considerations

**For troubleshooting:**
1. [error_handling.md](error_handling.md) - Validation errors and user feedback
2. [quick_reference.md](quick_reference.md) - Debugging tips section

---

## Changelog References

- **v2.1.18**: Full keybindings system with contexts, chords, hot-reload, validation
- **v2.1.76**: Agent Teams integration; numeric keypad support in plan mode; Ctrl+F agent filter integration; new chord sequences for agent pane management
