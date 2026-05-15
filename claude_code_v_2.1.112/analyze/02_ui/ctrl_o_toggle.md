# `Ctrl+O` Toggle Behavior Change (v2.1.110) — v2.1.112

## Overview

Before v2.1.110, `Ctrl+O` in fullscreen (NO_FLICKER) mode toggled **two** things at once:

1. Verbose transcript visibility (full vs collapsed content)
2. Focus view (only prompt + summary + final response)

v2.1.110 split these. `Ctrl+O` now toggles **only** verbose transcript view; focus is its own slash command (see [focus_view.md](./focus_view.md)).

## What `Ctrl+O` Does in v2.1.112

`Ctrl+O` is bound to the global action `app:toggleTranscript`. When pressed, it cycles the REPL screen between two modes:

- `prompt` mode (default) — normal chat with the prompt input
- `transcript` mode — fullscreen scrollable transcript with verbose details

The verbose toggle inside transcript mode is `Ctrl+E` (bound to `transcript:toggleShowAll`).

```javascript
// ============================================
// app:toggleTranscript - Ctrl+O global action
// Location: chunks.205.mjs:469-492 (handler), 527 (registration)
// ============================================

// ORIGINAL (for source lookup):
let M = yz6.useCallback(() => {
    {
        let { isBriefEnabled: V } = (rF(), B7(Xe));
        if (!V() && X && q !== "transcript") {
            H((k) => {
                if (!k.isBriefOnly) return k;
                return { ...k, isBriefOnly: !1 }
            });
            return
        }
    }
    let v = q !== "transcript";
    if (d("tengu_toggle_transcript", {
            is_entering: v,
            show_all: _,
            message_count: Y
        }), K((V) => V === "transcript" ? "prompt" : "transcript"), z(!1), v && A) A();
    if (!v && O) O()
}, [q, K, X, _, z, Y, H, A, O]),
// ...
G1("app:toggleTranscript", M, { context: "Global" });

// READABLE (for understanding):
const handleToggleTranscript = useCallback(() => {
  // First — handle the "briefOnly" edge case (not focus view; a separate "show-only-brief-tool-output" mode):
  // If brief mode is disabled in this account but the AppState had briefOnly=true from a stale session,
  // turning it off (a one-time cleanup) and bail out.
  const { isBriefEnabled } = getBriefModule();
  if (!isBriefEnabled() && isBriefOnly && screen !== "transcript") {
    setAppState((s) => s.isBriefOnly ? { ...s, isBriefOnly: false } : s);
    return;
  }

  // Normal flow: flip between prompt and transcript screens.
  const enteringTranscript = screen !== "transcript";
  logEvent("tengu_toggle_transcript", {
    is_entering: enteringTranscript,
    show_all: showAllInTranscript,
    message_count: messageCount
  });
  setScreen((s) => s === "transcript" ? "prompt" : "transcript");
  setShowAllInTranscript(false);          // always reset verbose-detail when re-entering
  if (enteringTranscript && onEnterTranscript) onEnterTranscript();
  if (!enteringTranscript && onExitTranscript) onExitTranscript();
}, [screen, setScreen, isBriefOnly, showAllInTranscript, setShowAllInTranscript, messageCount, setAppState, onEnterTranscript, onExitTranscript]);

// Mapping: M→handleToggleTranscript, q→screen, K→setScreen, X→isBriefOnly,
//          _→showAllInTranscript, z→setShowAllInTranscript, Y→messageCount,
//          H→setAppState, A→onEnterTranscript, O→onExitTranscript,
//          d→logEvent, rF()→briefModule, Xe→briefExports
```

### Why reset `showAllInTranscript` to false on entry

When the user *re-enters* transcript mode, the previous "show all" state from last time is intentionally reset. The reasoning:

- Verbose is a viewport-busy mode. Most re-entries want collapsed (the default).
- Stale "show all" from 30 minutes ago would dump a wall of content into the new transcript view.
- The user can hit `Ctrl+E` to expand again if needed.

This is a "fresh-state on re-entry" UX choice that matches how most CLI tools treat overlay modes.

## What `Ctrl+E` Does (Verbose Toggle Inside Transcript)

Inside transcript view, the `transcript:toggleShowAll` binding (default `Ctrl+E`) toggles between collapsed and verbose:

```javascript
// chunks.205.mjs:493-498
P = yz6.useCallback(() => {
    d("tengu_transcript_toggle_show_all", {
        is_expanding: !_,
        message_count: Y
    }), z((v) => !v)
}, [_, z, Y]),
// ...
G1("transcript:toggleShowAll", P, {
    context: "Transcript",
    isActive: f && !w  // f = (screen === "transcript"), w = suppressShowAll
});
```

This is what shows tool argument JSON, tool result content, hidden retries, status updates — content that's collapsed in normal transcript view for readability.

## The Conflated v2.1.97 Behavior

Between v2.1.97 and v2.1.110, `Ctrl+O` in fullscreen had **dual** effect:

1. Transcript screen flip (same as v2.1.112 now)
2. **AND** toggle of `briefTranscript` (focus view) — which the renderer would re-apply on next frame

This meant a user who just wanted to see verbose transcript would *also* flip focus view, and vice versa. There was no way to reach `(verbose=on, focus=on)` or `(verbose=off, focus=off)` without entering through one mode and out through another in a specific order.

v2.1.110 fixed this by:
- Reverting `Ctrl+O` to *just* the transcript screen flip.
- Introducing `/focus` as the dedicated focus toggle.

## The Hint Component `CtrlOToExpand`

```javascript
// ============================================
// CtrlOToExpand - dim hint shown after collapsed tool results
// Location: v2.1.88 src/components/CtrlOToExpand.tsx:29-46
// ============================================

export function CtrlOToExpand() {
  const isInSubAgent = useContext(SubAgentContext);
  const inVirtualList = useContext(InVirtualListContext);
  const expandShortcut = useShortcutDisplay('app:toggleTranscript', 'Global', 'ctrl+o');
  if (isInSubAgent || inVirtualList) return null;
  return (
    <Text dimColor>
      <KeyboardShortcutHint shortcut={expandShortcut} action="expand" parens />
    </Text>
  );
}
```

This hint shows up after collapsed content blocks (e.g., a truncated tool output). It tells the user "press the shortcut for `app:toggleTranscript` (default Ctrl+O) to expand." The hint is hidden when:

- Inside a sub-agent context (`isInSubAgent` — would clutter sub-agent output)
- Inside a virtual scrollable list (`inVirtualList` — list manages its own expand UI)

This component still exists at v2.1.112 and is rendered the same. What changed is the *action* — pressing Ctrl+O now goes to transcript view instead of toggling focus.

## Cross-Validation with v2.1.88

v2.1.88's `src/components/CtrlOToExpand.tsx:33` references `app:toggleTranscript` as `Global` action. So Ctrl+O for verbose-toggle has been the baseline since *before* v2.1.97. The v2.1.97 addition was layering focus-toggle *on top* of it (only in NO_FLICKER mode). The v2.1.110 reversion stripped that layer back off — restoring `Ctrl+O` to its pre-v2.1.97 verbose-only meaning.

## What Users Should Now Use

| Want to | Press |
|---------|-------|
| Enter/exit verbose transcript view | `Ctrl+O` (default keybinding for `app:toggleTranscript`) |
| Toggle show-all-details inside transcript | `Ctrl+E` (default keybinding for `transcript:toggleShowAll`) |
| Toggle focus mode (final-only) | `/focus` slash command |
| Pin focus mode on startup | `settings.json` → `viewMode: "focus"` |

Keybindings are user-rebindable via `~/.claude/keybindings.json` — the action names `app:toggleTranscript` and `transcript:toggleShowAll` are the canonical handles.

## Telemetry

- `tengu_toggle_transcript` — Ctrl+O fired with `{ is_entering, show_all, message_count }`
- `tengu_transcript_toggle_show_all` — Ctrl+E fired with `{ is_expanding, message_count }`
- `tengu_brief_mode_toggled` — `/focus` (and `/brief`) fired with `{ enabled, gated, source }`

The split telemetry is itself confirmation of the v2.1.110 separation — these are three distinct events, so the team can measure adoption of each independently.

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - Canonical
> - [symbol_additions_unit_11.md](../00_overview/symbol_additions_unit_11.md) - This unit

Key functions:
- `handleToggleTranscript` (`M` in chunks.205.mjs:469-492) - Ctrl+O dispatcher
- `handleToggleShowAll` (`P` in chunks.205.mjs:493-498) - Ctrl+E dispatcher
- `handleExitTranscript` (`W` in chunks.205.mjs:499-504) - Ctrl+C / Escape exits transcript
- `CtrlOToExpand` - The dim "(ctrl+o to expand)" hint component (v2.1.88 src/components/CtrlOToExpand.tsx:29; still present in v2.1.112)

v2.1.88 cross-reference: `/lyz/codespace/3rd/claude-code/src/components/CtrlOToExpand.tsx` line 33 binds to `app:toggleTranscript` (same as v2.1.112).
