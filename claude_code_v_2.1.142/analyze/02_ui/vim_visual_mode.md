# Vim Visual + Visual-Line Mode (v2.1.118)

## What changed

In v2.1.118, the input box's vim mode gains the full visual-mode
family:

- `v` (from NORMAL) enters **VISUAL** mode (character-wise selection).
- `V` (from NORMAL) enters **VISUAL LINE** mode (line-wise selection).
- In visual mode, motion commands (`w`/`b`/`h`/`l`/`j`/`k`/etc.) extend
  the selection.
- Operator-prefix commands (`d`/`y`/`c`/`>`/`<`/`~`) apply to the
  selection and return to NORMAL.
- `Esc` exits visual mode back to NORMAL.

Status line indicators (`vim.mode` in the status JSON, plus the
`-- VISUAL --` / `-- VISUAL LINE --` indicator below the prompt) reflect
the new modes.

## Source: state-machine definition

```javascript
// ============================================
// useVimModeStateMachine - mode + selection refs
// Location: cli_inner_pretty.js:549780-549833 (selected lines)
// ============================================

// ORIGINAL (for source lookup):
let Y = jd.useRef(0),
    { onModeChange: f, inputFilter: O } = H,
    M = Ms$({
      ...H,
      selectionAnchor: _,
      selectionLinewise: q === "VISUAL LINE",
      inputFilter: (G, V) => { /* …track INSERT-mode inserted text… */ },
    });
Y.current = M.offset;
let w = jd.useCallback((G) => {       // enterInsert
    if (G !== void 0) M.setOffset(G);
    $.current = { mode: "INSERT", insertedText: "" };
    K("INSERT");
    A(null);
    f?.("INSERT");
  }, [M, f]),
  D = jd.useCallback(() => {           // enterNormal (exit INSERT)
    /* …record visualOp/insert lastChange… */
    $.current = { mode: "NORMAL", command: { type: "idle" } };
    K("NORMAL");
    A(null);
    f?.("NORMAL");
  }, [f, M, H.value]),
  j = jd.useCallback((G, V) => {       // enterVisual
    $.current = { mode: "VISUAL", kind: V, anchor: G, command: { type: "idle" } };
    let v = V === "line" ? "VISUAL LINE" : "VISUAL";
    K(v);
    A(G);
    f?.(v);
  }, [f]);

// READABLE (for understanding):
function useVimModeStateMachine({
  value, onChange, columns,
  onModeChange,    // optional: notify host (status bar, telemetry)
  inputFilter,     // optional: filter raw keystrokes (paste protections, etc.)
}) {
  // Three mutable refs that survive React re-renders:
  //   modeRef        — the current mode (INSERT | NORMAL | VISUAL)
  //   anchorRef      — the byte-offset where VISUAL was entered (selection origin)
  //   lastChangeRef  — for "." dot-repeat
  const modeRef       = useRef({ mode: "NORMAL", command: { type: "idle" } });
  const anchorRef     = useRef(null);   // byte-offset of visual entry
  const undoHistoryRef = useRef({ register: undefined, registerIsLinewise: false, lastChange: undefined, lastFind: undefined });

  // Cursor offset is delegated to a separate hook (Ms$ / cursorPositionTracker).
  // We pass selectionAnchor + selectionLinewise to make the cursor tracker
  // render selection highlight.
  const cursor = useCursorPosition({
    value, onChange, columns,
    selectionAnchor: anchorRef.current,
    selectionLinewise: modeRef.current.mode === "VISUAL LINE",
    inputFilter: composeInputFilter(inputFilter, /* INSERT-mode insertedText tracking */),
  });

  // Mode transitions (the three callbacks above):
  const enterInsert = useCallback((newOffset) => {
    if (newOffset !== undefined) cursor.setOffset(newOffset);
    modeRef.current  = { mode: "INSERT", insertedText: "" };
    setVisibleMode("INSERT");
    anchorRef.current = null;
    onModeChange?.("INSERT");
  }, [cursor, onModeChange]);

  const enterNormalFromInsert = useCallback(() => {
    // Record what was inserted for "." dot-repeat.
    const cur = modeRef.current;
    if (cur.mode === "INSERT") {
      const last = undoHistoryRef.current.lastChange;
      if (last?.type === "visualOp" && last.op === "change") {
        // Just exited from VISUAL → change → INSERT — record as visualChange.
        undoHistoryRef.current.lastChange = {
          type: "visualChange",
          span: last.span,
          linewise: last.linewise,
          text: cur.insertedText ?? "",
        };
      } else if (cur.insertedText) {
        undoHistoryRef.current.lastChange = { type: "insert", text: cur.insertedText };
      }
      // Move cursor left by 1 (vim convention: exiting INSERT moves cursor
      // back one position unless it's at column 0 or after a newline).
      const offset = cursor.offset;
      if (offset > 0 && value.normalize("NFC")[offset - 1] !== "\n") {
        cursor.setOffset(offset - 1);
      }
    }
    modeRef.current  = { mode: "NORMAL", command: { type: "idle" } };
    setVisibleMode("NORMAL");
    anchorRef.current = null;
    onModeChange?.("NORMAL");
  }, [onModeChange, cursor, value]);

  const enterVisual = useCallback((anchorOffset, kind) => {
    modeRef.current  = { mode: "VISUAL", kind, anchor: anchorOffset, command: { type: "idle" } };
    const label = kind === "line" ? "VISUAL LINE" : "VISUAL";
    setVisibleMode(label);
    anchorRef.current = anchorOffset;
    onModeChange?.(label);
  }, [onModeChange]);

  // …key handling, operator dispatch, etc.
}

// Mapping: Ms$→useCursorPosition, jd→React (re-export),
//          f→onModeChange, K→setVisibleMode, A→setAnchorRef setter,
//          $→modeRef (state machine state), w→enterInsert,
//          D→enterNormalFromInsert, j→enterVisual
```

## Source: entry on `v` / `V` (from NORMAL)

```javascript
// ============================================
// processNormalModeKey - enters visual on v or V
// Location: cli_inner_pretty.js:549950-549953
// ============================================

// ORIGINAL (for source lookup):
if ((R === "v" || R === "V") && (C.command.type === "idle" || C.command.type === "count")) {
  j(v, R === "V" ? "line" : "char");
  return;
}

// READABLE (for understanding):
// In the NORMAL-mode key dispatcher, after parsing count prefix:
if ((char === "v" || char === "V") && (currentCommand.type === "idle" || currentCommand.type === "count")) {
  // Enter visual or visual-line.
  //   v → char-wise (the "anchor" is the current cursor position; selection
  //                  grows as motion commands move the cursor)
  //   V → line-wise (selection always spans whole lines)
  // Count prefix (e.g. "3v") is ignored — visual mode is "until exit," not
  // a count-repeatable operation.
  enterVisual(currentOffset, char === "V" ? "line" : "char");
  return;
}
```

The check for `command.type === "idle" || "count"` ensures `v`/`V`
aren't intercepted in the middle of operator-pending state. For
example, in `dv` (`d` is pending operator, expecting motion), the `v`
should be treated as visual-mode-as-motion (operator-pending visual),
not as a fresh `v` keystroke.

## Source: visual-mode key dispatch

```javascript
// ============================================
// processVisualModeKey - apply motion to extend selection, or commit op
// Location: cli_inner_pretty.js:549982-550060 (key paths within Z handler)
// ============================================

// READABLE (synthesizing):
function processVisualModeKey(char, key) {
  const state = modeRef.current;
  if (state.mode !== "VISUAL") return;

  // Esc exits visual mode (back to NORMAL).
  if (key.name === "escape" && state.mode === "VISUAL") {
    modeRef.current = { mode: "NORMAL", command: { type: "idle" } };
    setVisibleMode("NORMAL");
    anchorRef.current = null;
    onModeChange?.("NORMAL");
    return;
  }

  // Return = (no-op in visual; defer to outer onSubmit handling). Most other
  // keys are routed through the visual-mode command parser:
  const cmd = parseVisualModeCommand(state.command, char, makeContext());

  if (cmd.execute) cmd.execute();

  if (state.mode === "VISUAL") {
    // Still in visual; preserve mode and update command state.
    if (cmd.next) {
      if ("next" in cmd) {
        cmd.move?.();
        modeRef.current = { mode: "VISUAL", kind: state.kind, anchor: state.anchor, command: cmd.next };
      } else if (cmd.op) {
        applyVisualOperator(cmd.op, state.anchor, currentOffset, state.kind === "line" || cmd.forceLinewise);
        if (modeRef.current.mode === "VISUAL") {
          // Operator may have transitioned to NORMAL.
          enterNormalFromVisual();
        }
      } else if (cmd.cancel) {
        modeRef.current = { mode: "VISUAL", kind: state.kind, anchor: anchorBeforeCancel, command: { type: "idle" } };
      }
    } else if (cmd.startSelection) {
      modeRef.current = { mode: "VISUAL", kind: state.kind, anchor: cmd.startSelection.start, command: { type: "idle" } };
    }
  }
}
```

The visual-mode dispatcher handles three event categories:

1. **Motion**: `w`/`b`/`h`/`l`/`j`/`k`/`gg`/`G`/`0`/`$` etc. — moves the
   cursor, the selection extends from the anchor.
2. **Operator**: `d`/`y`/`c`/`>`/`<`/`~`/`gU`/`gu`/`g~` — apply to the
   selection and exit visual mode.
3. **Mode switch**: `v`/`V` in visual mode swap between char-wise and
   line-wise.

## Source: visual operator types

```javascript
// ============================================
// Visual command types - the discriminated union for dot-repeat
// Location: cli_inner_pretty.js:549890-549908 (operator switch)
// ============================================

switch (G.type) {
  // Pre-existing NORMAL-mode commands (insert, x, replace, toggleCase, etc.)…
  case "visualOp":       executeVisualOperator(G.op, G.span, G.linewise, ctx); break;
  case "visualReplace":  executeVisualReplace(G.char, G.span, G.linewise, ctx); break;
  case "visualCase":     executeVisualCase(G.caseOp, G.span, G.linewise, ctx); break;
  case "visualPaste":    executeVisualPaste(G.content, G.span, G.linewise, ctx); break;
  case "visualIndent":   executeVisualIndent(G.dir, G.count, G.lines, ctx); break;
  case "visualChange":   executeVisualChange(G.span, G.linewise, G.text, ctx); break;
}
```

The six visual operator types cover the vim canon:

| Type | Trigger | Action |
|------|---------|--------|
| `visualOp` | `d`/`y`/`c`/`gU`/`gu` etc. | Delete/yank/change/case-up/case-down on selection |
| `visualReplace` | `r<char>` | Replace each selected char with `<char>` |
| `visualCase` | `~` / `g~` / `gU` / `gu` | Toggle/upper/lower case on selection |
| `visualPaste` | `p` / `P` in visual mode | Replace selection with register contents |
| `visualIndent` | `>` / `<` | Indent / outdent each selected line |
| `visualChange` | `c` follow-through to INSERT mode | Record what was inserted after `c` for `.` repeat |

`visualChange` is special — it's emitted on the *combined* `c` →
INSERT → Esc sequence to support `.` dot-repeat of "change selection
to <new text>".

## Why this approach

### Why two visual modes (`v` and `V`) rather than one?

**What:** `v` is char-wise selection (anchor at one char, cursor at
another); `V` is line-wise (selection always spans whole lines from
anchor's line to cursor's line).

**Why:**

- This matches vim's canonical model. Vim users have muscle memory for
  `V` to "select these lines" without having to extend a char-wise
  selection to line boundaries.
- Line-wise selection is materially different at the *operator* level:
  `d` on a `VISUAL LINE` selection of lines 3-5 deletes the entire
  lines (and the newline at the end). `d` on a char-wise selection
  that happens to span the same chars deletes those exact chars.
- The status-line indicator `-- VISUAL LINE --` (vs. `-- VISUAL --`)
  tells the user which mode they're in — important to avoid surprise
  on operator commit.

### Why use `kind: "char" | "line"` rather than a separate mode constant?

**What:** Mode is `"VISUAL"` for both char-wise and line-wise; the
`kind` field on the state distinguishes.

**Why:**

- The state-machine transitions are identical for both visual modes
  — entering, exiting, key dispatch routing. Only the cursor selection
  rendering and the operator application care about line-vs-char.
- Treating them as a single "visual" mode with a flag keeps the
  dispatch tables short — 3 modes (`INSERT`/`NORMAL`/`VISUAL`) instead
  of 4.
- The visible label (in status JSON and on-screen indicator) is the
  one place the distinction is surfaced as separate strings (`VISUAL`
  vs `VISUAL LINE`).

### Why store `anchor` as a ref rather than state?

**What:** `anchorRef.current` is the byte-offset of the visual-entry
position, held in a `useRef` rather than `useState`.

**Why:**

- React re-rendering on every keystroke for selection extension would
  be expensive — the cursor moves typically once per keystroke, and
  visual operations involve many keystrokes.
- The anchor doesn't need to drive React re-render on its own — the
  cursor offset (which IS state) drives the selection-rendering, and
  the anchor only matters at *operator* time.
- The ref avoids stale-closure issues in the key handler — every
  invocation sees the live anchor.

### Why record `visualChange` as a distinct dot-repeat type?

**What:** When the user does `V c new text <Esc>`, the lastChange is
recorded as `{ type: "visualChange", span: …, linewise: true, text: "new text" }`.
A subsequent `.` re-applies the operation.

**Why:**

- `c` in visual mode is fundamentally "delete selection + enter
  INSERT". The dot-repeat needs to replay both: delete + insert.
- Without a `visualChange` type, the dot-repeat would either replay
  just the delete (losing the text), or replay just the insert (with
  no selection to delete first).
- The `span` records what was selected; the `linewise` records the
  kind; the `text` records what was typed in INSERT. Replay
  re-selects an analogous span (relative to current cursor) and
  applies both the delete and the insert.

### Why does `escape` exit visual mode immediately rather than via a command state?

**What:** `Esc` in visual mode short-circuits the command parser and
sets `mode: "NORMAL"` directly.

**Why:**

- The vim convention: `Esc` always returns to NORMAL. No mid-command
  state can swallow it.
- Allowing the command parser to handle Esc would let a misbehaving
  command consume it, leaving the user stuck in visual mode.
- The short-circuit also clears the anchor (`anchorRef.current = null`),
  ensuring no stale selection persists.

### Why does the INSERT exit move the cursor back by one?

**What:** When exiting INSERT mode (via `Esc`), the cursor moves
left by 1 unless it's at column 0 or after a newline.

**Why:**

- Vim convention: INSERT mode positions the cursor *between*
  characters. Exiting puts the cursor *on* the character to the left
  of where you stopped typing.
- Skipping the move at column 0 prevents underflow.
- Skipping after a newline prevents the cursor from landing on a
  wrap-back position (column 80 on the previous line, etc.).
- This matches the vim behavior users expect — without it, the cursor
  would drift right by 1 every INSERT visit, which is wrong.

## Cross-validation: pre-2.1.118 vs 2.1.118

| Aspect | Pre-2.1.118 | v2.1.118+ |
|--------|-------------|-----------|
| `v` from NORMAL | No-op | Enters VISUAL |
| `V` from NORMAL | No-op | Enters VISUAL LINE |
| `Esc` in visual mode | n/a | Exits to NORMAL |
| Motion in visual mode | n/a | Extends selection |
| Operator in visual mode (`d`/`y`/`c`/etc.) | n/a | Applies + returns to NORMAL |
| `.` dot-repeat with visualChange | n/a | Replays delete + insert |
| Status line `vim.mode` values | `INSERT` / `NORMAL` | + `VISUAL` / `VISUAL LINE` |
| `disableVimVisualMode` setting | n/a (only NORMAL/INSERT exposed) | Documented (settings.json) |
| `-- VISUAL --` indicator line | n/a | Rendered below prompt (suppressible via `disableVimMode` indicator) |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components / Vim
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `useVimModeStateMachine` (inferred wrapper around `Ms$`) — state machine and mode transitions
- `enterVisual` (`j`) — `{ mode: "VISUAL", kind, anchor }`; cli_inner_pretty.js:549825-549832
- `processVisualModeKey` (inline within Z handler) — key dispatch in visual mode; cli_inner_pretty.js:549982-550060
- `executeVisualOperator` (`eu4`) — applies d/y/c/etc. to selection
- `executeVisualReplace` (`Km4`) — `r<char>` replacement
- `executeVisualCase` (`zm4`) — `~`/`gU`/`gu`/`g~` case ops
- `executeVisualPaste` (`fm4`) — `p`/`P` over selection
- `executeVisualIndent` (`au4`) — `>`/`<` indentation
- `executeVisualChange` (`Hm4`) — `c` follow-through with INSERT replay
- `isVimModeEnabled` (`X$H`) — gate for `vim.mode` in status line
