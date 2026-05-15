# NO_FLICKER Mode (`CLAUDE_CODE_NO_FLICKER`) — v2.1.112

## Overview

`CLAUDE_CODE_NO_FLICKER=1` (introduced in v2.1.89) opts a session into the *flicker-free alt-screen renderer*: the Ink instance enters DEC 1049 (alternate screen buffer), maintains a virtualized scrollback in memory, and repaints the visible window atomically rather than reflowing the OS scrollback. By v2.1.112 the env var is one of *five* layers in the renderer-selection cascade, and v2.1.110's `/tui` command promoted the underlying behavior to a persistent setting (see [tui_command.md](./tui_command.md)).

This document covers the cascade logic, the underlying alt-screen mount, and the multi-version transition timeline.

## Why Alt-Screen Rendering Exists

Long-running TUIs on the *main* screen face an inherent flicker tradeoff. Whenever the layout reflows (window resize, sidebar expand/collapse, status change), the renderer must repaint by writing fresh content over old content. The user sees the in-between state during the write — content jumps, cursor flickers, scroll position lurches.

The alt-screen buffer (DEC 1049, originally added to xterm for vi/less) provides a *separate, viewport-sized* screen that gets restored to the original main-screen content on exit. The renderer can:

1. Take ownership of the entire viewport (height = `process.stdout.rows`).
2. Maintain its own scrollback model in memory.
3. Repaint atomically (full frame at once via `useInsertionEffect` before reconciler's `resetAfterCommit`).
4. Restore the main screen on exit so the user's prior shell history is untouched.

The cost: the OS-native scrollback is suspended for the session duration. Wheel scrolling, copy-on-select, and middle-click paste all need to be re-implemented at the application level (which is why fullscreen mode also enables SGR mouse tracking).

## Cascade Logic — Five-Layer Decision

```javascript
// ============================================
// isFullscreenMode - five-layer renderer selection cascade
// Location: chunks.65.mjs:1491-1505
// ============================================

// ORIGINAL (for source lookup):
function lq(q = Ja6) {
    if (c5(process.env.CLAUDE_CODE_NO_FLICKER)) return !1;
    if (S6(process.env.CLAUDE_CODE_NO_FLICKER)) return !0;
    if (Xa6(q)) {
        if (!q.loggedTmuxCcDisable) q.loggedTmuxCcDisable = !0, E("fullscreen disabled: tmux -CC (iTerm2 integration mode) detected · set CLAUDE_CODE_NO_FLICKER=1 to override");
        return !1
    }
    switch (v7().tui) {
        case "fullscreen": return !0;
        case "default":    return !1
    }
    return q.gbGateCached ??= u8("tengu_pewter_brook", !1), q.gbGateCached
}

// READABLE (for understanding):
function isFullscreenMode(state = sharedFlagState) {
  // Layer 1 — Operator escape hatch (highest priority)
  if (parseExplicitFalse(process.env.CLAUDE_CODE_NO_FLICKER)) return false;
  // Layer 2 — Operator opt-in
  if (parseExplicitTrue(process.env.CLAUDE_CODE_NO_FLICKER)) return true;
  // Layer 3 — tmux -CC integration mode auto-disables (alt-screen breaks iTerm2 pane integration)
  if (isTmuxIntegrationMode(state)) {
    if (!state.loggedTmuxCcDisable) {
      state.loggedTmuxCcDisable = true;
      logForDebugging('fullscreen disabled: tmux -CC (iTerm2 integration mode) detected · set CLAUDE_CODE_NO_FLICKER=1 to override');
    }
    return false;
  }
  // Layer 4 — Persistent user setting (added v2.1.110)
  switch (getUserSettings().tui) {
    case "fullscreen": return true;
    case "default":    return false;
  }
  // Layer 5 — Feature gate fallback for staged rollout
  return state.gbGateCached ??= getFeatureFlag('tengu_pewter_brook', false);
}

// Mapping: lq→isFullscreenMode, c5→parseExplicitFalse, S6→parseExplicitTrue,
//          Xa6→isTmuxIntegrationMode, v7→getUserSettings, u8→getFeatureFlag,
//          Ja6→sharedFlagState (module-level mutable cache), E→logForDebugging
```

### Why a layered cascade

Each layer represents an orthogonal authority. The order (operator > terminal capability > user > rollout) follows the principle **the most explicit override wins**:

| Layer | Authority | Example use |
|-------|-----------|-------------|
| 1/2 | Env var | Operator — CI runner sets `=0` to keep flat output; advanced user opts in before setting is rolled out |
| 3 | Terminal capability | Forced off because alt-screen + mouse tracking corrupts iTerm2's tmux pane integration (`tmux -CC`) |
| 4 | Settings | Persistent user choice via `/tui` command |
| 5 | Feature gate | Anthropic-side cohort rollout (`tengu_pewter_brook`); cached per-process |

**Why tmux -CC must auto-disable:** In `-CC` mode, iTerm2 renders tmux panes as native iTerm2 splits. tmux runs as a server (`TMUX` set) but iTerm2 is the actual terminal emulator. Alt-screen enter/exit corrupts iTerm2's pane state, and SGR mouse tracking is partially eaten by iTerm2. So both must be off. The env var (Layer 2) is honored *before* this check so that an advanced user can force-enable knowing the breakage.

**Why feature gate fallback (Layer 5):** When the user has no explicit setting and isn't in tmux -CC, the *server* decides. `USER_TYPE === 'ant'` (Anthropic employees) defaults to on; others defaulted to off until the gate was opened. This was the rollout mechanism between v2.1.89 ("alpha to ants only") and the eventual public-default rollout.

## Detecting `tmux -CC` (Layer 3 deep-dive)

```javascript
// ============================================
// isTmuxControlMode (cached) + probeTmuxControlModeSync (one-shot probe)
// Location: chunks.65.mjs:1486-1489 (cached), 1460-1483 (probe)
// ============================================

// READABLE (synthesized from chunks.65 + v2.1.88 source utils/fullscreen.ts):
function isTmuxControlMode(state = sharedFlagState) {
  if (state.tmuxControlModeProbed === undefined) probeTmuxControlModeSync(state);
  return state.tmuxControlModeProbed ?? false;
}

function probeTmuxControlModeSync(state) {
  // Try fast env-var heuristic first (zero-subprocess).
  state.tmuxControlModeProbed = isTmuxControlModeEnvHeuristic();
  if (state.tmuxControlModeProbed) return;
  if (!process.env.TMUX) return;
  // Spawn only if TERM_PROGRAM is unset (SSH-into-tmux case — heuristic can't decide).
  if (process.env.TERM_PROGRAM) return;
  let result;
  try {
    result = spawnSync('tmux', ['display-message', '-p', '#{client_control_mode}'], { encoding: 'utf8', timeout: 2000 });
  } catch { return; }
  if (result.status !== 0) return;
  state.tmuxControlModeProbed = result.stdout.trim() === '1';
}

// Mapping: Xa6→isTmuxControlMode, Mh_→probeTmuxControlModeSync, Ja6→sharedFlagState
```

### Why `spawnSync` (not async)

The probe is *sync* because the answer gates whether to enter alt-screen. An async race showed: when `coder-tmux` (SSH into a remote tmux -CC pane) didn't propagate `TERM_PROGRAM`, the env heuristic missed; by the time the async probe resolved, the renderer had already entered alt-screen with mouse tracking. Mouse wheel is dead in iTerm2 -CC, so users couldn't scroll at all. Cost: one ~5ms `spawnSync('tmux', ...)`, only on the SSH-into-tmux case.

### Why TMUX env check must come first

Without `if (!process.env.TMUX) return`, `display-message` would query *whatever tmux server happens to be running* (e.g., a server started by a different user's session) rather than our client.

## What the alt-screen mount actually writes

```javascript
// ============================================
// AlternateScreen - DOM mount that enters/exits DEC 1049 + mouse tracking
// Location: chunks.* (Ink components — also visible in v2.1.88 src/ink/components/AlternateScreen.tsx:33-67)
// ============================================

// READABLE (semantics from v2.1.88 source):
function AlternateScreen({ children, mouseTracking = true }) {
  const size = useContext(TerminalSizeContext);
  const writeRaw = useContext(TerminalWriteContext);

  // useInsertionEffect (NOT useLayoutEffect) — must fire before resetAfterCommit
  // writes the first frame, otherwise the first frame leaks to the main screen.
  useInsertionEffect(() => {
    const ink = instances.get(process.stdout);
    if (!writeRaw) return;
    writeRaw(ENTER_ALT_SCREEN + '\x1b[2J\x1b[H' + (mouseTracking ? ENABLE_MOUSE_TRACKING : ''));
    ink?.setAltScreenActive(true, mouseTracking);
    return () => {
      ink?.setAltScreenActive(false);
      ink?.clearTextSelection();
      writeRaw((mouseTracking ? DISABLE_MOUSE_TRACKING : '') + EXIT_ALT_SCREEN);
    };
  }, [writeRaw, mouseTracking]);

  return <Box flexDirection="column" height={size?.rows ?? 24} width="100%" flexShrink={0}>{children}</Box>;
}

// Note: v2.1.88 source is TypeScript (not obfuscated); the v2.1.112 chunk version compiles to
// react-compiler IR (cached memo slots via _c) but the semantics are byte-for-byte identical.
```

### Why `useInsertionEffect` not `useLayoutEffect`

react-reconciler calls `resetAfterCommit` *between* the mutation and layout commit phases. Ink's `resetAfterCommit` triggers `onRender` which writes the frame. With `useLayoutEffect`, the first `onRender` fires *before* this effect — so it writes a full frame to the main screen with `altScreen=false`. That frame stays on the main screen and is revealed as a broken view when alt-screen exits.

Insertion effects fire during the mutation phase, *before* `resetAfterCommit`, so `ENTER_ALT_SCREEN` reaches the terminal before the first frame does. Cleanup timing is unchanged — both effect types clean up in the mutation phase on unmount.

## Transition Timeline (v2.1.89 → v2.1.112)

| Version | State | Notes |
|---------|-------|-------|
| v2.1.88 | Main-screen rendering only | `src/utils/fullscreen.ts` exists but contains only tmux helpers — no alt-screen path |
| v2.1.89 | `CLAUDE_CODE_NO_FLICKER=1` opt-in introduced | Behind the env var; ants default-on, public default-off |
| v2.1.91 | tmux -CC auto-disable (with one-time hint) | Fixes broken scrollback for SSH-into-tmux -CC |
| v2.1.94 | Mouse-click toggles (DISABLE_MOUSE, DISABLE_MOUSE_CLICKS) | Per-env-var knobs for users who want alt-screen but not mouse capture |
| v2.1.97 | Focus view (Ctrl+O) added to NO_FLICKER | First mode that requires the alt-screen path |
| v2.1.98 | tmux mouse-off hint, CJK copy fix, scrollback fixes | Stabilization wave |
| v2.1.105 | autocompact mid-stream race-condition fix | Compact dispatcher rendered while reconciler held a half-frame |
| v2.1.108 | Bridge connectivity status uses fullscreen-aware layout | Floating modal slot fully wired |
| v2.1.110 | `/tui` command + `tui` setting + `viewMode` + `autoScrollEnabled` | Graduation: env var demoted to "compat" |
| v2.1.111 | Transcript footer keys `[` / `v` (alt-screen only) | Scrollback dump + open-in-editor in fullscreen viewport |

### What "demoted to compat" means in 2.1.110

`CLAUDE_CODE_NO_FLICKER` still works (Layer 1/2 of the cascade), but `/tui fullscreen` is the official way to opt in. The relaunch handler explicitly *drops* `CLAUDE_CODE_NO_FLICKER` from the relaunched-process env to ensure the new setting alone governs:

```javascript
// chunks.185.mjs:429 (inside /tui handler)
dropEnv: ["CLAUDE_CODE_NO_FLICKER", "CLAUDE_CODE_FORCE_FULLSCREEN_UPSELL"]
```

This makes the *setting* the durable record of intent; env vars are session-scoped overrides.

## Why It Cannot Hot-Swap

Switching renderers mid-session requires:

1. Tearing down the Ink instance (DOM, reconciler, event handlers).
2. Re-initializing `terminal-focus-state.ts` (alt-screen has different focus semantics).
3. Re-attaching mouse tracking handlers (the parser is alt-screen-aware).
4. Resetting `selection.ts` (mouse-driven selection vs. terminal-native).
5. Migrating in-memory scrollback to/from OS scrollback.

Doing this transactionally without flicker, dropped keystrokes, or corrupted state is impossibly fragile. The `/tui` command instead **relaunches the process** with the same conversation (`--resume <session_id>`) and a marker env var (`CLAUDE_CODE_TUI_JUST_SWITCHED`) to show a confirmation banner. See [tui_command.md](./tui_command.md).

## Sister Env Vars (Fullscreen-only)

| Env Var | Effect |
|---------|--------|
| `CLAUDE_CODE_DISABLE_MOUSE` | Skip SGR mouse tracking (keyboard scroll still works) — preserves terminal-native copy-on-select |
| `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` | Mouse wheel works but clicks/drags ignored (prevents accidental cursor moves) |
| `CLAUDE_CODE_DISABLE_VIRTUAL_SCROLL` | Disable virtualized scrollback (used by some headless test harnesses) |
| `CLAUDE_CODE_FORCE_FULLSCREEN_UPSELL` | Internal — force-show the fullscreen upsell banner |
| `CLAUDE_CODE_TUI_JUST_SWITCHED` | Internal — set by `/tui` relaunch so the new process shows "Using flicker-free rendering" banner |

`CLAUDE_CODE_NO_FLICKER=0` is all-or-nothing — disables both alt-screen *and* virtualized scrollback. `CLAUDE_CODE_DISABLE_MOUSE=1` keeps alt-screen + virtualized scroll but skips mouse. The latter is the right choice for users on terminals where copy-on-select must remain OS-native.

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - Canonical
> - [symbol_additions_unit_11.md](../00_overview/symbol_additions_unit_11.md) - This unit

Key functions:
- `isFullscreenMode` (`lq`) - Cascade dispatch (chunks.65.mjs:1491-1505)
- `isFullscreenActive` (`Ph_`) - `isInteractive() && isFullscreenMode()` (chunks.65.mjs:1517-1519)
- `isTmuxIntegrationMode` (`Xa6`) - Cached check (chunks.65.mjs:1486-1489)
- `probeTmuxControlModeSync` (`Mh_`) - One-shot tmux subprocess probe (chunks.65.mjs:1460-1483)
- `getNoFlickerEnvState` (`wK4`) - Reports current env state (`"on"`/`"off"`/`undefined`) (chunks.65.mjs:1507-1511)
- `isMouseTrackingEnabled` (`sb1`) - `!isEnvTruthy(CLAUDE_CODE_DISABLE_MOUSE)` (chunks.65.mjs:1513-1515)
- `sharedFlagState` (`Ja6`) - Module-level mutable cache for once-per-session flags (chunks.65.mjs:1553)

v2.1.88 source for cross-validation:
- `/lyz/codespace/3rd/claude-code/src/utils/fullscreen.ts` (lines 112-128 = `isFullscreenEnvEnabled`)
- `/lyz/codespace/3rd/claude-code/src/ink/components/AlternateScreen.tsx` (33-67 = the React mount)
