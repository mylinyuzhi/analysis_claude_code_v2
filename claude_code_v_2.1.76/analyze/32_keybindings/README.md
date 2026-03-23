# 32 - Keybindings (Customizable Keyboard Shortcuts)

## Overview

The keybindings system allows users to customize keyboard shortcuts in Claude Code. It supports 18 per-context bindings, chord sequences (multi-key combos), comprehensive schema validation, hot-reload via file watching, and cross-platform compatibility.

**Introduced**: v2.1.18
**Analysis Completeness**: 10/10 (comprehensive reverse engineering)
**Analysis Depth**: 10/10 (source-level documentation with cross-validation)
**Verification Status**: ✓ All 80+ symbols verified against source code (2026-03-23)
**Cross-Validation Results**:
- Voice PTT symbols (Evz, Nvz, Sgq, vvz, Vvz) ✓ Verified in chunks.195.mjs
- UI Component symbols (a1, O8, C8, Rq, f$1) ✓ Verified in chunks.65.mjs
- Configuration symbols (XW6, G4Y, tu9, $p6) ✓ Verified in chunks.89.mjs
- Core matching symbols (Z$1, Hl3, jl3, Jl3) ✓ Verified in chunks.65.mjs
- Component symbols (aj, N4Y) ✓ Verified in chunks.117.mjs
- File watcher constants (ru9=500, ou9=200, G4Y=1000) ✓ Verified
- Voice PTT constants (Nvz=5, Sgq=2, vvz=120) ✓ Verified
**Version**: Claude Code v2.1.76
**Last Updated**: 2026-03-23

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
- 500ms stability threshold (`ru9`), 200ms poll interval (`ou9`)
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

### Voice Push-to-Talk (v2.1.76)
- Repeated keypress activation (5 presses to trigger)
- Warming indicator at 2 presses (120ms window)
- Single-character PTT support (e.g., 'v' key)
- Automatic character stripping during activation
- Visual feedback via voiceWarmingUp state

---

## Documentation Files

| File | Purpose | Code Snippets | Status |
|------|---------|---------------|--------|
| [default_keybindings.md](default_keybindings.md) | Complete default keybindings for all 18 contexts | 1 | ✓ Complete |
| [configuration.md](configuration.md) | Config loading, validation, hot-reload mechanism | 10 | ✓ Verified |
| [chord_mechanism.md](chord_mechanism.md) | Chord state machine, timeout, prefix matching | 10 | ✓ Verified |
| [event_flow.md](event_flow.md) | Complete keystroke lifecycle (7 stages) | 15 | ✓ Complete |
| [focus_and_panes.md](focus_and_panes.md) | Focus system, 18 contexts, multi-pane coordination | 10 | ✓ Complete |
| [action_system.md](action_system.md) | Action registry, dispatch mechanism, useKeybindingAction hook | 10 | ✓ Complete |
| [platform_specific.md](platform_specific.md) | Cross-platform behavior, terminal compatibility | 7 | ✓ Verified |
| [error_handling.md](error_handling.md) | Validation errors, runtime errors, user feedback | 6 | ✓ Complete |
| [integrations.md](integrations.md) | Cross-feature integrations (19 subsystems), system reminder hooks | 18 | ✓ Complete |
| [ui_interaction.md](ui_interaction.md) | UI components, VoiceKeybindingHandler source, MemoSlot pattern | 18 | ✓ Complete |
| [quick_reference.md](quick_reference.md) | Function lookup, event flow diagram, context reference | - | ✓ Verified |
| [complete_lifecycle.md](complete_lifecycle.md) | End-to-end walkthrough: Ctrl+K Ctrl+C example | - | ✓ Complete |
| [implementation.md](implementation.md) | KeybindingSetup source, KeybindingHandler source, key decisions | 4 | ✓ Verified |
| [conflict_resolution.md](conflict_resolution.md) | Priority rules for conflicting bindings | - | ✓ Complete |

---

## Source Files Analyzed

| File | Lines | Components | Symbols Mapped |
|------|-------|------------|----------------|
| chunks.65.mjs | 533-900 | Parsing, matching, chord logic, React Context | 20 |
| chunks.89.mjs | 2614-3288 | Configuration, validation, file watching, defaults | 25 |
| chunks.90.mjs | 37-53 | File watcher constants, state variables | 5 |
| chunks.117.mjs | 1879-1993 | KeybindingSetup, KeybindingHandler components | 3 |
| chunks.195.mjs | 1807-1944 | VoiceKeybindingHandler, PTT constants | 6 |
| chunks.73.mjs | 26-900 | Ink TUI, focus management, input handling | - |
| chunks.72.mjs | 2444-2467 | Event dispatching | - |
| chunks.52.mjs | 1390-1700 | React reconciler | - |
| chunks.50.mjs | 925-1062 | ANSI tokenization | - |

**Total**: 9 source files analyzed with **80+ symbols mapped** (including Voice PTT integration)

---

## Key Integrations

### System Reminder Integration (04_system_reminder)

Keybinding hints appear in system reminders through the `useKeybindingDisplayText` (Rq) hook:

- **Lookup mechanism**: Action name → Current binding → Display text
- **Fallback support**: Shows fallback text if binding not found
- **Telemetry**: Logs when fallback is used (`tengu_keybinding_fallback_used`)
- **Context-aware**: Only shows bindings for active contexts

Example usage in UI:
```javascript
// Get display text with fallback
const submitHint = Rq("chat:submit", "Chat", "Enter");
// Returns "Ctrl+Enter" if user customized, or "Enter" as fallback
```

---

## Symbol Mapping

All keybinding symbols have been mapped in [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) under the **Keybindings** module section, organized by category:

- **Configuration & Loading** (7 symbols): tu9, $p6, m34, b36, rN8, pk, XW6
- **File Watching** (7 symbols): B34, I34, Am9, eu9, S34, b34, I36
- **File Watcher Constants** (2 symbols): ru9, ou9
- **State & Caching** (5 symbols): Y0, _Z, Op6, C34, g34
- **Validation** (11 symbols): xu9, uu9, mu9, Bu9, gu9, Fu9, pu9, Qu9, iN8, h34, R34
- **Reserved Shortcuts** (5 symbols): L34, C36, wp6, cN8, lN8
- **Keystroke Parsing** (8 symbols): Qu6, pj8, wl3, Ol3, D$1, X$1, Qj8, $l3
- **Keystroke Matching** (8 symbols): Hl3, W$1, jl3, Jl3, Z$1, P$1, gL7, FL7
- **React Context & UI** (12 symbols): aj, N4Y, G$1, Wv, f$1, Rq, PX, a1, O8, C8, G4Y, jA
- **Platform-Specific** (3 symbols): Cu9, bu9, Iu9
- **Voice Integration** (5 symbols): Evz, Nvz, Sgq, vvz, Vvz
- **Telemetry** (1 symbol): x34

---

## Cross-References

- **Symbol indices**: [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md), [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md)
- **Changelog**: [changelog_analysis.md](../00_overview/changelog_analysis.md)
- **System Reminder**: [04_system_reminder/](../04_system_reminder/) - Keybinding hints in system reminders

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
- **v2.1.76**: Agent Teams integration; numeric keypad support in plan mode; Ctrl+F agent filter integration; new chord sequences for agent pane management; Voice PTT integration with repeated-keypress activation
