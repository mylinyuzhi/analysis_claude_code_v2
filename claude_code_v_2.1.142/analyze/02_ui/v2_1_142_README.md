# 02_ui — TUI / Spinner / Transcript / Themes (v2.1.113 → v2.1.142)

## Overview

The 02_ui module in v2.1.142 covers UI changes that landed in the
**post-fullscreen-graduation era** — v2.1.110 made fullscreen the
canonical TUI mode, v2.1.111 added the effort slider, and the work
between v2.1.113 and v2.1.142 focuses on:

- **Time-aware progress signals**: the spinner now turns amber after
  10s of silence (v2.1.141) and shows rotating inline thinking hints
  ("still thinking" → "thinking more" → "thinking some more" → "almost
  done thinking") at 10s/20s/30s/45s (v2.1.116).
- **Transcript navigation**: new `?`/`{`/`}`/`v` shortcuts let the
  user move between prompts, open in `$EDITOR`/`$VISUAL`, and get
  context-sensitive help in the transcript view (v2.1.139).
- **Vim modes go full**: visual (`v`) and visual-line (`V`) modes
  with linewise/charwise selection, plus the full set of visual-op
  / visual-replace / visual-paste handlers (v2.1.118).
- **Named custom themes**: themes are persisted as `<slug>.json` with
  user-editable names. Plugin themes can also ship (v2.1.118).
- **`/usage` consolidation**: `/cost` and `/stats` merged into
  `/usage` with shared dashboard. Old names work as aliases (v2.1.118).
- **`/scroll-speed`** interactive picker for mouse wheel sensitivity,
  per-terminal-aware (v2.1.139).
- **Alt-screen disable**: `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN`
  env var added — for terminals where alt-screen breaks (some CI
  setups, older mosh, scripts piping through `tee`) (v2.1.132).
- **Dialog scrollability**: dialogs that overflow scroll instead of
  truncate (v2.1.121).
- **`/feedback` with session scope**: include past sessions (24h or
  7d) in the bug report bundle (v2.1.141).
- **Pasting hint**: dim "Pasting…" footer hint while paste is being
  ingested from clipboard (v2.1.132).
- **`/color random`**: empty `/color` arg picks a random subagent
  color (v2.1.128).

The five-layer renderer cascade from v2.1.112 (env > tmux-CC > setting
> feature gate) still owns the fullscreen-vs-default decision; this
release adds `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` as a peer of
`CLAUDE_CODE_NO_FLICKER=0` in layer 1.

## Major Changes v2.1.113 → v2.1.142

| Version | Kind | Change | Doc |
|---------|------|--------|-----|
| 2.1.113 | feat | `Ctrl+A` / `Ctrl+E` move to logical-line start/end in multiline input | [multiline_input_ctrl_a_e.md](./multiline_input_ctrl_a_e.md) |
| 2.1.116 | feat | Inline thinking spinner ("still thinking", "thinking more", "almost done thinking") | [thinking_spinner_inline.md](./thinking_spinner_inline.md) |
| 2.1.117 | feat | Faster MCP startup (cross-cuts — covered in 06_mcp); remote control sessions | (out of unit scope) |
| 2.1.118 | feat | vim visual mode (`v`) and visual-line mode (`V`) | [vim_visual_mode.md](./vim_visual_mode.md) |
| 2.1.118 | feat | `/cost` + `/stats` merged into `/usage` | [usage_merge_cost_stats.md](./usage_merge_cost_stats.md) |
| 2.1.118 | feat | Named custom themes + plugin themes | [themes_custom.md](./themes_custom.md) |
| 2.1.119 | feat | `/config` persistence | [config_persist.md](./config_persist.md) |
| 2.1.121 | feat | Dialogs that overflow are scrollable; click any line of long URLs; type-to-filter in `/skills` | [dialog_overflow_scroll.md](./dialog_overflow_scroll.md) |
| 2.1.126 | fix  | Stream-idle after wake (see [19_think_level/stream_idle_watchdog_fix.md](../19_think_level/stream_idle_watchdog_fix.md)) | (covered there) |
| 2.1.128 | feat | `/color random` (empty arg picks random) | [color_random.md] (see symbol additions) |
| 2.1.132 | feat | `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` env var | [tui_alternate_screen.md](./tui_alternate_screen.md) |
| 2.1.132 | feat | "Pasting…" footer hint while paste is read | [pasting_footer_hint.md](./pasting_footer_hint.md) |
| 2.1.132 | fix  | Fullscreen blank-screen-after-sleep | (paired with [19_think_level/stream_idle_watchdog_fix.md](../19_think_level/stream_idle_watchdog_fix.md) for the wake-side timer logic) |
| 2.1.136 | feat | Visual consistency across slash command dialogs | [slash_command_consistency.md](./slash_command_consistency.md) |
| 2.1.139 | feat | `/scroll-speed` slash command | [scroll_speed_command.md](./scroll_speed_command.md) |
| 2.1.139 | feat | Transcript navigation: `?`/`{`/`}`/`v` | [transcript_navigation.md](./transcript_navigation.md) |
| 2.1.141 | feat | Spinner warms to amber after 10s | [spinner_amber_warm.md](./spinner_amber_warm.md) |
| 2.1.141 | feat | `/feedback` includes recent sessions | [feedback_recent_sessions.md](./feedback_recent_sessions.md) |
| 2.1.141 | fix  | AskUserQuestion popup hiding last line of preceding chat content (layout fix) | (covered in [slash_command_consistency.md](./slash_command_consistency.md)) |
| 2.1.142 | feat | `/web-setup` warns before replacing an existing GitHub App connection | [web_setup_replace_warning.md](./web_setup_replace_warning.md) |
| 2.1.142 | feat | `@` mention popup ranks agents above raw MCP resources (+0.15 penalty); MCP `uriTemplate` suggestions; CJK-aware `@` boundary | [at_mention_unified_suggestions.md](./at_mention_unified_suggestions.md) |

The `/config` persistence (v2.1.119) is documented at
[config_persist.md](./config_persist.md). It's a small change for the
user surface but a meaningful one for the settings layer architecture.

## Spinner Time Thresholds (v2.1.116 + v2.1.141)

These two features share the same elapsed-time signal. The 10s mark
serves a dual purpose:

```
elapsed since first token (ms)
0        ←first token────
                                          spinner: dim gray oscillates dim↔bright
10000    ←warm to amber────────  spinner: lerp to warning color (v2.1.141)
                                          thinking hint: "still thinking"
                                          (overlay; v2.1.116)
20000    ─thinking-more─         hint: "thinking more"
30000    ─thinking-some-more─    hint: "thinking some more"
45000    ─almost-done─           hint: "almost done thinking"
60000+   ─same hint, dimmed─
```

The 10s threshold for both:
1. **Amber warm**: signals "this is taking a while; we know."
2. **First thinking hint**: signals "the model is still thinking, this
   is normal."

Together they reduce the "is it still alive?" anxiety that plagues
long thinking turns.

## Transcript Navigation Keys (v2.1.139)

After v2.1.139 the transcript view's help overlay (triggered by `?`)
shows two columns of shortcuts:

```
↑↓ j/k    scroll                  /     search
ctrl+u/d  half page                n/N   next/prev match
space b   page                     [     print to scrollback
g/G       top/bottom               v     open in editor
{/}       prev/next prompt        ctrl+o toggle transcript
                                   q      exit
                                   ?      close help
```

The `{`/`}` keys (prev/next prompt) implement a Conventional Vim-like
paragraph-motion analog adapted for chat transcripts — jump cursor to
the previous/next *user prompt* marker. The `v` key opens the current
turn's full content in `$VISUAL`/`$EDITOR` (defaulting to a system
choice if neither is set).

See [transcript_navigation.md](./transcript_navigation.md) for the full
keybinding registry, the help overlay component, and the rendering
math for the footer hint that shows "v to open in editor · ? for
shortcuts".

## Alt-Screen Cascade Update (v2.1.132)

The v2.1.112 cascade had layer 1 as `CLAUDE_CODE_NO_FLICKER=0/1`. The
v2.1.132 update adds `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` as a
peer in layer 1:

```javascript
function isAlternateScreenForceDisabled() {
  return parseExplicitFalse(process.env.CLAUDE_CODE_NO_FLICKER)
      || parseExplicitTrue(process.env.CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN);
}

function isFullscreenMode(state = sharedFlagState) {
  if (isAlternateScreenForceDisabled()) return false;  // ← peer of NO_FLICKER=0
  if (parseExplicitTrue(process.env.CLAUDE_CODE_NO_FLICKER)) return true;
  if (isTmuxIntegrationMode(state)) { /* log + */ return false; }
  if (isWindowsSshOnWindows()) { /* log + */ return false; }
  if (process.env.CLAUDE_CODE_SESSION_KIND === "bg") return true;
  switch (getUserSettings().tui) {
    case "fullscreen": return true;
    case "default":    return false;
  }
  if (isDownsellGate(state)) return true;
  return getFeatureFlag("tengu_pewter_brook", false);
}
```

The new env var name is more explicit than `NO_FLICKER=0` — it says
exactly what it does. See
[tui_alternate_screen.md](./tui_alternate_screen.md) for the full
cascade.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — UI / CLI
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components / Slash Commands
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols from this unit

Key components/objects in this module:
- `SpinnerComponent` (`Py7`) — renders glimmer + thinking hint + tokens
- `getThinkingHintForElapsed` (`oB_`) — 10s/20s/30s/45s hint thresholds
- `useStallDetector` (`nG6`) — `stalledIntensity` 0→1 over 10s past idle
- `TranscriptHelpMenu` (`si4`) — `?` overlay
- `TranscriptFooterBar` (`ri4`) — bottom hint bar
- `scrollSpeedCommandDef` (`lT5`) — `/scroll-speed`
- `isAlternateScreenForceDisabled` (`Y76`) — env-disable cascade
- `usageCommandDef` (`nB6`) — `/usage` with `cost`/`stats` aliases
- `ThemeEditorDialog` (`qL4`) — slug-keyed theme editor
- `EffortSliderComponent` (`py5`) — slider (cross-cuts to 19_think_level)
- `LD8` — `/color` handler with random pick on empty arg

## Reading Order

1. [thinking_spinner_inline.md](./thinking_spinner_inline.md) — the 4-rung thinking hints; 10s/20s/30s/45s thresholds
2. [spinner_amber_warm.md](./spinner_amber_warm.md) — same 10s mark drives spinner color warming
3. [tui_alternate_screen.md](./tui_alternate_screen.md) — `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN`
4. [transcript_navigation.md](./transcript_navigation.md) — `?`/`{`/`}`/`v` and the help overlay
5. [scroll_speed_command.md](./scroll_speed_command.md) — `/scroll-speed` interactive picker
6. [vim_visual_mode.md](./vim_visual_mode.md) — vim `v`/`V` modes
7. [themes_custom.md](./themes_custom.md) — named custom themes
8. [usage_merge_cost_stats.md](./usage_merge_cost_stats.md) — `/usage` consolidation
9. [config_persist.md](./config_persist.md) — `/config` persistence
10. [dialog_overflow_scroll.md](./dialog_overflow_scroll.md) — scrollable dialogs
11. [pasting_footer_hint.md](./pasting_footer_hint.md) — "Pasting…" hint
12. [feedback_recent_sessions.md](./feedback_recent_sessions.md) — `/feedback` scope picker
13. [slash_command_consistency.md](./slash_command_consistency.md) — visual consistency + AskUserQuestion fix
14. [multiline_input_ctrl_a_e.md](./multiline_input_ctrl_a_e.md) — Ctrl+A / Ctrl+E switched to logical-line motion (v2.1.113)
15. [web_setup_replace_warning.md](./web_setup_replace_warning.md) — `/web-setup` pre-replace warning for existing GitHub App (v2.1.142)
16. [at_mention_unified_suggestions.md](./at_mention_unified_suggestions.md) — `@` input popup unifies files + MCP + templates + agents; 0.15 penalty puts agents above raw MCP resources (v2.1.142)
