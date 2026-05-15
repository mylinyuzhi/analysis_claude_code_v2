# Transcript View — Footer Keys (v2.1.111) + Multi-line Indent Fix (v2.1.94) — v2.1.112

## Overview

Transcript view (the fullscreen scrollable list of all messages, opened with `Ctrl+O`) gained two power-user shortcuts in v2.1.111 and had a multi-line prompt indenting bug fixed in v2.1.94. This document covers both.

## v2.1.111 — Footer Keys `[` and `v`

The transcript view footer (the bottom-bar that lists active keybindings) now exposes two underused but powerful actions:

- **`[`** → "print output" (dump current scrollable content to terminal scrollback)
- **`v`** → "open in editor" (open current transcript / output in external editor)

These appear conditionally based on context (whether we're in virtual scroll mode, whether `showAllInTranscript` is active, whether a search is active).

### The Footer Source

```javascript
// ============================================
// transcriptFooter - rendered at bottom of transcript view
// Location: chunks.208.mjs:2404-2454
// ============================================

// ORIGINAL (for source lookup):
function iO5(q) {
    let K = s(11),
        { showAllInTranscript: _, virtualScroll: z, searchBadge: Y, suppressShowAll: A, status: O } = q,
        w = A === void 0 ? !1 : A,
        $ = V3("app:toggleTranscript", "Global", "ctrl+o"),
        j = V3("transcript:toggleShowAll", "Transcript", "ctrl+e"),
        H;
    if (K[0] === Symbol.for("react.memo_cache_sentinel")) H = gmK(), K[0] = H;
    else H = K[0];
    let J = H,
        X = J ? `open in ${J}` : "open in editor",
        M = Y ? " · n/N to navigate" :
            z ? ` · ${e6.arrowUp}${e6.arrowDown} scroll · [ to print output · v to ${X}` :
            w ? ` · v to ${X}` :
            ` · ${j} to ${_?"collapse":"show all"}`,
        P;
    // ... renders <Text>"Showing detailed transcript · "</Text><$>{<Text dimColor>{M}</Text>}</>
}

// READABLE (for understanding):
function TranscriptFooter({ showAllInTranscript, virtualScroll, searchBadge, suppressShowAll = false, status }) {
  const ctrlO = getShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o");
  const ctrlE = getShortcutDisplay("transcript:toggleShowAll", "Transcript", "ctrl+e");
  const editorName = detectExternalEditor();                   // e.g., "nvim", "vscode"
  const openInLabel = editorName ? `open in ${editorName}` : "open in editor";

  let suffix;
  if (searchBadge) {
    suffix = " · n/N to navigate";
  } else if (virtualScroll) {
    // Fullscreen-only path — virtualScroll implies fullscreen renderer
    suffix = ` · ${ARROW_UP}${ARROW_DOWN} scroll · [ to print output · v to ${openInLabel}`;
  } else if (suppressShowAll) {
    suffix = ` · v to ${openInLabel}`;
  } else {
    suffix = ` · ${ctrlE} to ${showAllInTranscript ? "collapse" : "show all"}`;
  }

  return (
    <Box noSelect alignItems="center" alignSelf="center" borderTop borderStyle="single" marginTop={1} paddingLeft={2} width="100%">
      <Text dimColor>Showing detailed transcript · {ctrlO} to toggle{suffix}</Text>
      <Box flexGrow={1} />
      <TranscriptStatus status={status} searchBadge={searchBadge} />
    </Box>
  );
}

// Mapping: iO5→TranscriptFooter, V3→getShortcutDisplay, gmK→detectExternalEditor,
//          e6.arrowUp/arrowDown→ARROW_UP/DOWN, I2A→TranscriptStatus
```

### Four footer layouts

| Context | Footer suffix |
|---------|---------------|
| Search active | `· n/N to navigate` (basic search nav) |
| Virtual scroll (fullscreen) | `· ↑↓ scroll · [ to print output · v to open in editor` |
| `suppressShowAll` (e.g., non-message overlay) | `· v to open in editor` |
| Default (collapsed mode, no virtual scroll) | `· Ctrl+E to show all` |

The `[` shortcut is only shown when `virtualScroll` is true — which itself is fullscreen-only, because virtual scrolling requires the alt-screen renderer's viewport ownership. In default-rendering mode (no alt-screen), the OS terminal already has scrollback, so "dump to scrollback" is meaningless — it's already there.

### What `[` actually does

`[` writes the entire current transcript content to the underlying terminal's *real* scrollback. The renderer briefly exits the alt screen, writes the lines as raw text, then re-enters alt screen. The user can then:

1. Switch out of Claude Code (e.g., to a `screen`/`tmux` pane copy buffer, or terminal-native scrollback).
2. Copy any of the printed content.
3. Search using terminal-native search (e.g., iTerm2 Cmd+F).

This bridges the gap between the virtualized scrollback (which has its own search but limited copy UX) and the OS scrollback (where the user's existing tools work).

### What `v` actually does

`v` opens the current view in the user's configured external editor. The editor is detected at render time via `detectExternalEditor()` (which checks `$EDITOR`, `$VISUAL`, then platform-specific defaults like `code`/`subl`/`nvim`). If detection fails, the label falls back to the generic "open in editor."

The transcript content is written to a temp file and the editor is launched against it. Useful for:

- Reading transcripts in a wide-screen editor with proper word-wrap
- Saving a transcript by saving the temp file elsewhere
- Searching with the editor's regex engine

## v2.1.94 — Multi-line User Prompt Indenting

Before v2.1.94, a multi-line user prompt was rendered with wrapped lines indented under the `❯` caret instead of under the text itself.

### Visual before/after

```
Before (v2.1.93 and earlier):
  ❯ first line of the prompt continues here
     and wrapped line aligns with text? Yes, but ...    ← wrapped line under "f"
     more wrapped content                                ← also under "f"

After (v2.1.94+):
  ❯ first line of the prompt continues here
    and wrapped line aligns with text after caret        ← wrapped line under "f" (correct)
    more wrapped content                                 ← also under "f"
```

The bug was subtle. The renderer was computing the wrapping prefix based on the column position of the `❯` caret (column 2 with margin) rather than the column position where the prompt **text** began (column 4 after caret + space). So wrapped lines ended up indented under the caret instead of under the text.

### Why this matters for readability

Visual alignment makes the prompt scannable. With the caret-aligned wrap, a multi-line prompt looked like:

```
  ❯ explain the calling
   convention for fastcall      ← visually a *separate* paragraph
```

vs. with text-aligned wrap:

```
  ❯ explain the calling
    convention for fastcall     ← visually a *continuation* of the first line
```

The latter signals "this is one prompt" at a glance. The former signals "two prompts."

### The Fix

The fix (in chunks.* for v2.1.112, originally in `src/utils/messages.ts` for v2.1.94) computes the wrap prefix as:

```
wrapPrefix = caretColumn + " ".length
```

instead of:

```
wrapPrefix = caretColumn
```

Trivial change, but the alignment quality jump is large.

## Transcript Mode vs Focus Mode — Three-way orthogonality

Transcript view has three independent state axes:

| Axis | Off | On | Toggled by |
|------|-----|-----|------------|
| Screen | `prompt` | `transcript` | `Ctrl+O` (`app:toggleTranscript`) |
| Verbose | collapsed | show all | `Ctrl+E` (`transcript:toggleShowAll`) |
| Focus filter | full | brief | `/focus` slash command |

All three can be combined. Some users prefer `(transcript on, verbose off, focus off)` for a "review mode" — read what was sent and received without intermediate noise. Others use `(transcript on, verbose on, focus off)` for debugging — see every byte.

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - Canonical
> - [symbol_additions_unit_11.md](../00_overview/symbol_additions_unit_11.md) - This unit

Key functions:
- `TranscriptFooter` (`iO5`) - Bottom-bar layout with [/v hints (chunks.208.mjs:2404-2454)
- `TranscriptStatus` (`I2A`) - Right-side status/search badge (chunks.208.mjs:2456-2482)
- `detectExternalEditor` (`gmK`) - Resolves `$EDITOR`/`$VISUAL`/defaults (chunks.* utility)
- `getShortcutDisplay` (`V3`) - Reads keybindings.json + falls back to default (chunks.* utility)

v2.1.88 cross-reference:
- `Ctrl+O` action `app:toggleTranscript` existed (src/components/CtrlOToExpand.tsx:33)
- `[`/`v` shortcuts did NOT appear in the v2.1.88 footer — added v2.1.111
- The multi-line indenting fix is in `src/utils/messages.ts` at v2.1.94 (not present in v2.1.88 / v2.1.93 baselines)
