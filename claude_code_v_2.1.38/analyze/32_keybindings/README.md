# 32 - Keybindings (Customizable Keyboard Shortcuts)

## Overview

The keybindings system allows users to customize keyboard shortcuts in Claude Code. It supports per-context bindings, chord sequences (multi-key combos), schema validation, and hot-reload via file watching.

**Introduced**: v2.1.18

## Key Components

### Configuration
- Config file at `~/.claude/keybindings.json`
- JSON schema validation for configuration correctness
- `/keybindings` slash command for viewing/editing bindings

### Binding Contexts
- **Global** - Active everywhere in the application
- **Chat** - Active only in the chat input area
- **Autocomplete** - Active during autocomplete/suggestion mode

### Chord Sequences
- Multi-key combinations (e.g., `Ctrl+K Ctrl+C`)
- Sequential key press detection with timeout
- Conflict resolution with single-key bindings

### Hot Reload
- File watcher on `~/.claude/keybindings.json`
- Automatic reload when configuration changes
- No restart required for binding updates

### Terminal Integration
- Key event capture and routing
- Integration with terminal input handling
- Modifier key support (Ctrl, Alt, Shift, Meta)

## Key Source Files

> To be populated during analysis. Estimated ~16 source files.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

## Changelog References

- **v2.1.18**: Full keybindings system with contexts, chords, hot-reload
