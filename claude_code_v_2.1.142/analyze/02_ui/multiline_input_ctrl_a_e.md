# `Ctrl+A` / `Ctrl+E` — Logical-Line Navigation in Multiline Input (v2.1.113)

## What changed

In v2.1.112 and earlier, `Ctrl+A` and `Ctrl+E` in the prompt input moved
the cursor to the **visual** line start / end — that is, to column 0 /
end-of-wrapped-row in the terminal's wrapped rendering. After a long
paragraph was wrapped across 5 visual rows, `Ctrl+A` would only jump to
the start of the current row, not the start of the paragraph.

In v2.1.113 the bindings for `Ctrl+A` and `Ctrl+E` were redirected from
`cursor.startOfLine()` / `cursor.endOfLine()` to **`cursor.startOfLogicalLine()`** / **`cursor.endOfLogicalLine()`** — i.e. they now move to the start / end of the **logical** line (the contents between two real `\n` characters), regardless of how many visual rows that line occupies.

The visual-line motions still exist and are still bound — they are now
reachable through `Home` / `End` (and `PageUp` / `PageDown` in the
default renderer) and through `Cmd+Left` / `Cmd+Right` on macOS via
`superKey + left/right`.

## Why this matters

The default-mode renderer (and now also alt-screen) wraps long input at
the terminal width. Users with single-paragraph multiline pastes (long
URLs, large diffs in code blocks, long bullet text) found that `Ctrl+A`
left them at the start of the *visible row*, not where they expected.
The fix aligns Claude Code's keymap with how Emacs / readline / bash
behave in multiline mode — `Ctrl+A` is "start of logical line" almost
everywhere else.

The split:

| Key | v2.1.112 binding | v2.1.142 binding | Motion |
|-----|------------------|------------------|--------|
| `Ctrl+A` | `startOfLine` | `startOfLogicalLine` | To previous `\n` (or buffer start) |
| `Ctrl+E` | `endOfLine` | `endOfLogicalLine` | To next `\n` (or buffer end) |
| `Home` | `startOfLine` | `startOfLine` | Visual-row start |
| `End` | `endOfLine` | `endOfLine` | Visual-row end |
| `Cmd+Left` (macOS) | `startOfLine` | `startOfLine` | Visual-row start |
| `Cmd+Right` (macOS) | `endOfLine` | `endOfLine` | Visual-row end |
| `PageUp` / `PageDown` (non-fullscreen) | `startOfLine` / `endOfLine` | `startOfLine` / `endOfLine` | Visual-row |

Logical and visual motion both remain reachable; the change is purely
about which gets bound to the `Ctrl+A`/`Ctrl+E` shortcuts that share
their semantics with readline.

## Source: the keymap

```javascript
// ============================================
// PROMPT_INPUT_CTRL_BINDINGS - input keymap, ctrl-prefix table
// Location: cli_inner_pretty.js:176104-176123
// ============================================

// ORIGINAL (for source lookup):
let o = muK([
    ["a", () => F.startOfLogicalLine()],
    ["b", () => F.left()],
    ["c", () => { return (l(), F); }],
    ["d", qH],
    ["e", () => F.endOfLogicalLine()],
    ["f", () => F.right()],
    ["h", () => F.deleteTokenBefore() ?? F.backspace()],
    ["k", a],
    ["n", () => YH()],
    ["p", () => _H()],
    ["u", t],
    ["w", MH],
    ["y", wH],
  ]),
  $H = muK([ /* meta-prefix table */ ]);

// READABLE (for understanding):
const promptInputCtrlBindings = buildKeyDispatcher([
  ["a", () => cursor.startOfLogicalLine()],   // ← v2.1.113: was startOfLine
  ["b", () => cursor.left()],                 // Ctrl+B  one char left  (emacs-ish)
  ["c", () => { interrupt(); return cursor; }],
  ["d", deleteCharForward],                   // Ctrl+D  delete forward
  ["e", () => cursor.endOfLogicalLine()],     // ← v2.1.113: was endOfLine
  ["f", () => cursor.right()],                // Ctrl+F  one char right
  ["h", () => cursor.deleteTokenBefore() ?? cursor.backspace()],
  ["k", killToEndOfLine],                     // Ctrl+K  yank-buffer kill
  ["n", goDownOrHistoryNext],                 // Ctrl+N
  ["p", goUpOrHistoryPrev],                   // Ctrl+P
  ["u", killToStartOfLine],                   // Ctrl+U
  ["w", killWordBackward],                    // Ctrl+W
  ["y", yankFromKillBuffer],                  // Ctrl+Y
]);

// Mapping: F→cursor, o→promptInputCtrlBindings, muK→buildKeyDispatcher,
//          qH→deleteCharForward, a→killToEndOfLine, t→killToStartOfLine,
//          MH→killWordBackward, wH→yankFromKillBuffer, YH→goDownOrHistoryNext,
//          _H→goUpOrHistoryPrev, l→interrupt
```

## Source: where `Home` / `End` still hit visual

```javascript
// ============================================
// promptInputKeyDispatcher.Home/End - non-ctrl-prefix keys keep visual motion
// Location: cli_inner_pretty.js:176207-176218
// ============================================

// ORIGINAL (for source lookup):
case "home":
  if (PH.ctrl) return;
  return F.startOfLine();
case "end":
  if (PH.ctrl) return;
  return F.endOfLine();
case "pagedown":
  if (lq() || PH.ctrl) return;
  return F.endOfLine();
case "pageup":
  if (lq() || PH.ctrl) return;
  return F.startOfLine();

// READABLE (for understanding):
case "home":
  if (key.ctrl) return;
  return cursor.startOfLine();        // visual-row start
case "end":
  if (key.ctrl) return;
  return cursor.endOfLine();          // visual-row end
case "pagedown":
  // In fullscreen mode, PageDown is consumed by the scroller, not the input.
  if (isFullscreenMode() || key.ctrl) return;
  return cursor.endOfLine();
case "pageup":
  if (isFullscreenMode() || key.ctrl) return;
  return cursor.startOfLine();

// Mapping: PH→key, F→cursor, lq→isFullscreenMode
```

## Source: the underlying cursor primitives

The `Cursor` class exposes both flavours; only the binding changed.

```javascript
// ============================================
// Cursor.startOfLine / endOfLine / startOfLogicalLine / endOfLogicalLine
// Location: cli_inner_pretty.js:175285-175345
// ============================================

// ORIGINAL (for source lookup):
startOfLine() {
  let { line: H, column: $ } = this.getPosition();
  if ($ === 0 && H > 0) return new A4(this.measuredText, this.getOffset({ line: H - 1, column: 0 }), 0);
  return this.startOfCurrentLine();
}
endOfLine() {
  let { line: H, column: $ } = this.getPosition(),
    q = this.measuredText.getLineLength(H);
  if ($ >= q && H < this.measuredText.lineCount - 1) {
    let _ = this.measuredText.getLineLength(H + 1),
      A = this.getOffset({ line: H + 1, column: _ });
    return new A4(this.measuredText, A, 0);
  }
  let K = this.getOffset({ line: H, column: q });
  return new A4(this.measuredText, K, 0);
}
findLogicalLineStart(H = this.offset) {
  if (H === 0) return 0;
  let $ = this.text.lastIndexOf("\n", H - 1);
  return $ === -1 ? 0 : $ + 1;
}
findLogicalLineEnd(H = this.offset) {
  let $ = this.text.indexOf("\n", H);
  return $ === -1 ? this.text.length : $;
}
startOfLogicalLine() { return new A4(this.measuredText, this.findLogicalLineStart(), 0); }
endOfLogicalLine()   { return new A4(this.measuredText, this.findLogicalLineEnd(),   0); }

// READABLE (for understanding):
class Cursor {
  // VISUAL-row start: column 0 of the currently-rendered wrapped row.
  // If already at column 0 and not on the first visual row, snap back to
  // start of the previous visual row (mirrors readline's "double Ctrl+A
  // moves to row above" semantic — but bound only via Home in v2.1.142+).
  startOfLine() {
    const { line, column } = this.getPosition();
    if (column === 0 && line > 0) {
      return new Cursor(this.measuredText, this.getOffset({ line: line - 1, column: 0 }), 0);
    }
    return this.startOfCurrentLine();
  }

  // VISUAL-row end. If already at the end of this row, advance to the
  // end of the next visual row (mirror of startOfLine semantics).
  endOfLine() {
    const { line, column } = this.getPosition();
    const visualLineLen = this.measuredText.getLineLength(line);
    if (column >= visualLineLen && line < this.measuredText.lineCount - 1) {
      const nextLineLen = this.measuredText.getLineLength(line + 1);
      const offset = this.getOffset({ line: line + 1, column: nextLineLen });
      return new Cursor(this.measuredText, offset, 0);
    }
    return new Cursor(this.measuredText, this.getOffset({ line, column: visualLineLen }), 0);
  }

  // LOGICAL line bounds: scan for the nearest '\n' in either direction.
  // This is what Ctrl+A / Ctrl+E call into starting in v2.1.113.
  findLogicalLineStart(offset = this.offset) {
    if (offset === 0) return 0;
    const newline = this.text.lastIndexOf("\n", offset - 1);
    return newline === -1 ? 0 : newline + 1;
  }
  findLogicalLineEnd(offset = this.offset) {
    const newline = this.text.indexOf("\n", offset);
    return newline === -1 ? this.text.length : newline;
  }
  startOfLogicalLine() { return new Cursor(this.measuredText, this.findLogicalLineStart(), 0); }
  endOfLogicalLine()   { return new Cursor(this.measuredText, this.findLogicalLineEnd(),   0); }
}

// Mapping: A4→Cursor, H→offsetOrLine, $→column or newline, q→visualLineLen,
//          K→offset, _→nextLineLen
```

## Why this approach

### Why redirect Ctrl+A/E to logical-line motion?

**What it does:** `Ctrl+A` and `Ctrl+E` in a multiline input buffer now
jump to the start / end of the **paragraph** (logical line) rather than
the current **visible row**.

**How it works:**
1. The prompt input dispatches `key.ctrl && key.key === "a"` (resp. `"e"`)
   to a small lookup table (`promptInputCtrlBindings`).
2. That table's `"a"` entry, starting in v2.1.113, calls
   `cursor.startOfLogicalLine()` (resp. `endOfLogicalLine()`).
3. The logical methods scan the raw text for the nearest `\n` boundary
   in either direction and return a new `Cursor` positioned there. They
   never consult the **visual** wrap layout (`measuredText.getLineLength`)
   that `startOfLine` / `endOfLine` use.

**Why this approach:**
- **Match readline / bash / emacs**: in those tools `Ctrl+A` always
  means "beginning of the logical line you're editing." Users coming
  from a shell or REPL expect that semantic.
- **Multi-line paste**: a single pasted paragraph wrapped across 4
  visual rows is *conceptually* one line. The old binding made
  navigation tedious — multiple `Ctrl+A` presses to escape the wrap.
- **Visual motion still reachable**: `Home`/`End` remain bound to
  visual-row motion, so vim users who want row-by-row navigation can
  still get it.

**Key insight:** The change is one line per binding — replacing
`startOfLine` with `startOfLogicalLine` in the `ctrl`-prefix table.
The underlying `Cursor` class already shipped both flavours of the
method since v2.1.88 (see `src/utils/Cursor.ts:455`/`:499` in the v2.1.88
TS source). v2.1.113 simply switches which one the keymap calls.

### Why keep two flavours of "line-start"?

Because the two needs are genuinely different:

- **Visual-row motion** (`startOfLine`/`endOfLine`) — useful for jumping
  inside a wrapped paragraph, e.g. when you want to navigate within a
  single visible row of a long pasted code block. Bound to `Home`/`End`
  in v2.1.142.
- **Logical-line motion** (`startOfLogicalLine`/`endOfLogicalLine`) —
  needed for whole-paragraph navigation: jumping over a freshly-typed
  multi-line code-snippet to add a prefix word at the start. Bound to
  `Ctrl+A`/`Ctrl+E`.

The vim NORMAL/VISUAL modes also use both: `0`/`$` for visual, `g0`/`g$`
for logical, mirroring vim's `gj`/`gk` "go by display line" distinction
(see `cli_inner_pretty.js:549584` for the vim transition that maps `0`
to `startOfLogicalLine`).

## v2.1.88 baseline

In v2.1.88 (`/lyz/codespace/3rd/claude-code/src/hooks/useTextInput.ts:225,229`)
the bindings were:

```typescript
['a', () => cursor.startOfLine()],   // visual-row start
['e', () => cursor.endOfLine()],     // visual-row end
```

The `startOfLogicalLine` / `endOfLogicalLine` methods existed on the
`Cursor` class (`src/utils/Cursor.ts:495,499`) but were called only by
the vim transitions module (`src/vim/transitions.ts:189,255`). v2.1.113
extends their reach to the readline-style shortcuts.

## Related Symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components

Key symbols in this document:

- `promptInputCtrlBindings` (anonymous `o` at `cli_inner_pretty.js:176104`) — ctrl-prefix dispatch table
- `buildKeyDispatcher` (`muK`) — generic single-key dispatcher
- `Cursor.startOfLogicalLine` / `endOfLogicalLine` (`cli_inner_pretty.js:175342, :175339`) — logical-line motion
- `Cursor.startOfLine` / `endOfLine` (`cli_inner_pretty.js:175289, :175301`) — visual-row motion
- `Cursor.findLogicalLineStart` / `findLogicalLineEnd` (`cli_inner_pretty.js:175312, :175321`) — newline scanner

## Testing notes

This is a pure keybinding change; observable behaviours to verify:

- In a multiline buffer wrapped across 3 terminal rows, `Ctrl+A` should
  land at column 0 of the buffer (or after the most recent `\n`), not
  the start of the current visible row.
- `Home` should still go to the start of the current visible row.
- `Ctrl+E` should land just before the next `\n` (or at buffer end).
- After pasting a paragraph that wraps onto several rows, `Ctrl+A`
  followed by `Ctrl+E` should select / span the entire pasted block
  (logical line), not just one visible row of it.
- vim NORMAL mode `0` / `$` (and `g0` / `g$`) remain unchanged.
