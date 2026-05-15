# 02_ui — TUI / Fullscreen / Focus / Notifications (v2.1.112)

## Overview

This module documents the *terminal user interface* evolution between v2.1.88 and v2.1.112. The bulk of the change is the multi-version graduation of flicker-free rendering: it shipped as an opt-in environment variable (`CLAUDE_CODE_NO_FLICKER=1`) in v2.1.89, stabilized across many bug-fix releases through v2.1.108, and graduated to a first-class `/tui` slash command + persistent `tui` setting in v2.1.110. Focus view and the push-notification tool are the two other v2.1.110-era additions covered here.

The v2.1.88 source baseline (`/lyz/codespace/3rd/claude-code/src/`) already contains the alt-screen renderer (`src/ink/components/AlternateScreen.tsx`), the cascade helper (`src/utils/fullscreen.ts`), the `CLAUDE_CODE_NO_FLICKER` gate, and `Ctrl+O` transcript toggle — these were the v2.1.89-era artifacts. What v2.1.112 adds on top is: the `tui` settings enum, the `/tui` and `/focus` slash commands, the `viewMode` startup override, the `briefTranscript` AppState/Config slot, the `PushNotificationTool` (deferred), and the v2.1.111 transcript-footer `[` / `v` shortcuts.

## Rendering Architecture (high-level)

```
                            ┌──────────────────────┐
                            │  REPL.tsx (top)      │
                            └──────────┬───────────┘
                                       │
                  ┌────────────────────┼─────────────────────┐
            isFullscreenMode()       (no)                  (yes)
                 (chunks.65.mjs:1491-1505 — `lq`)
                       │                                    │
              ┌────────▼────────┐                  ┌────────▼─────────────┐
              │ Main screen     │                  │ AlternateScreen      │
              │ (legacy, append │                  │ (DEC 1049 alt buffer)│
              │  & reflow)      │                  │ + virtualized        │
              │ no flicker      │                  │   scrollback         │
              │ guarantee       │                  │ + SGR mouse tracking │
              └────────┬────────┘                  └────────┬─────────────┘
                       │                                    │
                       │           ┌────────────────────────┘
                       │           │
                       │           │  briefTranscript?
                       │           │       │
                       ▼           ▼       ▼
                ┌──────────────────────────────────────┐
                │  TranscriptView (chunks.182)         │
                │   - verbose toggle (Ctrl+O)          │
                │   - focus toggle (/focus)            │
                │   - transcript footer (`[`, `v`)     │
                └──────────────────────────────────────┘
```

The five layers in `isFullscreenMode()` (precedence highest to lowest):
1. `CLAUDE_CODE_NO_FLICKER=0` (operator escape hatch)
2. `CLAUDE_CODE_NO_FLICKER=1` (operator opt-in)
3. tmux integration mode (`tmux -CC`) auto-disables
4. `settings.json` `tui: "fullscreen" | "default"` (user preference, persistent)
5. Feature gate `tengu_pewter_brook` (Anthropic-side rollout)

## Major Changes 2.1.88 → 2.1.112

| Version | Item | Doc |
|---------|------|-----|
| 2.1.89 | `CLAUDE_CODE_NO_FLICKER=1` env-var opt-in | [no_flicker_mode.md](./no_flicker_mode.md) |
| 2.1.97 | `Ctrl+O` toggles focus view in NO_FLICKER mode | [focus_view.md](./focus_view.md) |
| 2.1.110 | `/tui` command + `tui` setting persistence | [tui_command.md](./tui_command.md) |
| 2.1.110 | `/focus` split out from `Ctrl+O` | [focus_view.md](./focus_view.md) |
| 2.1.110 | `Ctrl+O` reverts to verbose-only toggle | [ctrl_o_toggle.md](./ctrl_o_toggle.md) |
| 2.1.110 | `PushNotification` tool (deferred) | [push_notifications.md](./push_notifications.md) |
| 2.1.111 | Transcript footer `[` / `v` shortcuts | [transcript_view.md](./transcript_view.md) |
| 2.1.94 | Multi-line user prompt indenting fix | [transcript_view.md](./transcript_view.md) |

## How Fullscreen Differs From Default

| Aspect | Default | Fullscreen |
|--------|---------|------------|
| Screen buffer | Main (DEC 47, append-only) | Alternate (DEC 1049) |
| Scrollback | OS terminal | Virtualized (in-memory) |
| Mouse tracking | None | SGR DEC 1000/1002/1006 |
| Click-to-expand | No | Yes (collapsed tool results) |
| Click-to-position cursor | No | Yes |
| Click-to-copy-on-select | OS default | Auto-copies (default; `/config` to change) |
| Reflow on resize | Reflows scrollback (flicker) | Repaints viewport (no flicker) |
| Modal overlays | Inline | Centered in viewport |
| Focus view (briefTranscript) | Not available | Available via `/focus` |
| `autoScrollEnabled` | N/A | Configurable |

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - Canonical
> - [symbol_additions_unit_11.md](../00_overview/symbol_additions_unit_11.md) - This unit

Key functions in this module:
- `isFullscreenMode` (`lq`) - Five-layer cascade for renderer selection (chunks.65.mjs:1491-1505)
- `isFullscreenActive` (`Ph_`) - `isInteractive() && isFullscreenMode()` (chunks.65.mjs:1517-1519)
- `isTmuxIntegrationMode` (`Xa6`) - `tmux -CC` detection (chunks.65.mjs:1486-1489)
- `getNoFlickerEnvState` (`wK4`) - `"on" | "off" | undefined` (chunks.65.mjs:1507-1511)
- `tuiCommandHandler` (`bcY`) - `/tui` dispatcher with relaunch (chunks.185.mjs:397-431)
- `focusCommandDef` (`FoY`) - `/focus` definition (chunks.189.mjs:1450-1475)
- `PushNotificationTool` (`AJY`) - Push tool wrapper (chunks.152.mjs:2184-2295)
- `relaunchSession` (`er8`) - Used by `/tui` to re-spawn with new env (chunks.185.mjs:354-381)

## Reading Order

1. [no_flicker_mode.md](./no_flicker_mode.md) — env-var foundation, why alt-screen
2. [tui_command.md](./tui_command.md) — graduation to slash command
3. [ctrl_o_toggle.md](./ctrl_o_toggle.md) — what `Ctrl+O` now does after 2.1.110
4. [focus_view.md](./focus_view.md) — focus view's split from Ctrl+O
5. [transcript_view.md](./transcript_view.md) — verbose transcript + footer keys
6. [push_notifications.md](./push_notifications.md) — push notification tool
