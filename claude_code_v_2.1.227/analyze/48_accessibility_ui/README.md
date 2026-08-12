# 48_accessibility_ui — Focus view, accessible input, and terminal rendering

This module re-derives the full 2.1.220 accessibility and terminal-UX scope from the 2.1.227
bundle. It covers Focus-view transcript folding, the screen-reader renderer and announcement path,
Vim and shared-input state, emoji completion, terminal capability selection, clipboard ownership,
external-program handoff, markdown tables, hyperlinks, and fullscreen compaction scrollback.

The retained architecture is more important than the number of changelog bullets. Claude Code still
builds one semantic message stream and then derives normal, transcript, Focus, screen-reader, and
fullscreen presentations from it. The 2.1.221–2.1.225 changes repair the boundaries between those
presentations: Focus preserves live or actionable content, screen-reader backspace uses an exact
suffix-deletion path, Vim state survives component remounts, Wayland clipboard writes are serialized,
and fullscreen compaction no longer treats model-context pruning as permission to erase UI history.

## Documents

- [focus_and_transcript_folding.md](focus_and_transcript_folding.md) — view-mode resolution,
  transcript normalization, semantic activity aggregation, fold preservation rules, live-turn
  summaries, and the 2.1.225 folding repairs.
- [screen_reader_input_and_emoji.md](screen_reader_input_and_emoji.md) — accessibility activation,
  announcement buffering, incremental screen-reader rendering, end-of-line deletion, Vim state and
  undo behavior, insert remaps, and emoji alias/search semantics.
- [terminal_rendering_and_handoff.md](terminal_rendering_and_handoff.md) — synchronized output,
  mouse and terminal-mode ownership, Wayland copy ordering, fullscreen compaction scrollback,
  hyperlinks, OSC-52, and adaptive table layout.

## Version findings

| Version | Finding | Evidence |
|---|---|---|
| 2.1.220 baseline | Focus folding, screen-reader mode, Vim input, emoji completion, synchronized output, handoff, OSC-52, and adaptive tables already exist | `2.1.220:156198-156275`, `253377-253490`, `258035-258500`, `432218-432397`, `656551-657420`, `744484-747125` |
| 2.1.221 | VS Code exposes Focus view; the shared renderer uses the existing `viewMode`/legacy compatibility gate | `cli_inner_pretty.js:192033-192039`, `495379-495451`, `779592-779735` |
| 2.1.221 | End-of-line backspace gets an exact suffix-deletion renderer path instead of rewriting the whole input line | `cli_inner_pretty.js:274776-274805` versus `2.1.220:258299-258438` |
| 2.1.221 | Vim register/find state moves to a shared store, while undo-to-empty invokes the empty-input gesture arming callback | `cli_inner_pretty.js:742390-742392`, `742699-743241` |
| 2.1.221 | Emoji completion accepts nine alternate shortcodes through collision-safe alias expansion | `cli_inner_pretty.js:834810-834823`, `836398-836430` |
| 2.1.224 | Wayland standard and primary selection writes are ordered and protected by a generation token | `cli_inner_pretty.js:189439-189475`, `189588-189593` |
| 2.1.224 | Fullscreen compaction removes only preserved-message duplicates and appends the boundary, retaining earlier UI history | `cli_inner_pretty.js:853671-853672`, `916257-916274` versus `2.1.220:822580-822600` |
| 2.1.225 | Focus uses multiple semantic summary buckets, retains latest standalone actionable tools, marks the live bucket, and renders completed thinking duration separately | `cli_inner_pretty.js:351961-352344`, `732200-732490` |
| retained | Capability-driven synchronized output, terminal handoff, screen-reader tables, hyperlink policy, and OSC-52 chunking remain in force | `cli_inner_pretty.js:269679-269718`, `274405-274455`, `276022-276124`, `721545-721708` |

The 2.1.227 slash-command menu selection and Unicode highlighting changes are analyzed in
[`43_slash_commands`](../43_slash_commands/README.md), where the menu ranking and row renderer live.
They are referenced here only as a neighboring UI surface.

## Architectural conclusion

The 2.1.227 implementation deliberately separates three kinds of state:

1. The canonical conversation and model-context recorder may compact aggressively.
2. Presentation reducers retain or fold enough semantic history for the selected view.
3. Interaction state that must survive temporary UI replacement, such as the Vim yank register, is
   held outside the remounting component.

Most fixes in this window correct an earlier violation of one of those ownership boundaries. They do
not replace the terminal renderer or input framework.

## Scope and confidence

All described 2.1.227 control flow is **Verified** against the target bundle and **Cross-checked**
against 2.1.220. The readable 2.1.88 source confirms the older renderer, input, and terminal-mode
architecture, but later Focus grouping, shared Vim state, and Wayland generation logic are anchored
directly in the obfuscated target. Intermediate-version attribution follows the supplied changelog.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `foldTranscriptForFocus` (`HWd`) - replaces low-value turn detail with semantic summaries while
  retaining actionable and final content.
- `renderTranscript` (`KjE`) - selects normal, transcript, and Focus projections and applies render
  caps after semantic folding.
- `renderScreenReaderFrame` (`AAr.onRenderScreenReader`) - emits append, delete, or fallback terminal
  updates from a flattened accessibility tree.
- `useVimInput` (`O7a`) - dispatches INSERT, NORMAL, and VISUAL input over the common composer.
- `writeWaylandClipboardSelections` (`BZy`) - serializes clipboard and primary-selection ownership.
- `handleInteractiveMessage` (`jB`) - applies compaction boundaries to the visible transcript without
  discarding fullscreen history.
