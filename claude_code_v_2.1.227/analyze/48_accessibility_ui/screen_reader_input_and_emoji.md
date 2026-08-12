# Screen-reader rendering, Vim input, and emoji completion

Claude Code's accessible input path has two layers. The input composer emits semantic announcements
for actions such as deletion, while the terminal renderer flattens the UI tree and incrementally
updates a plain-text screen-reader surface. Vim mode wraps the same composer rather than owning a
second editor. Emoji completion is another input projection, guarded by a value-difference check so
asynchronous suggestions cannot replace unrelated text.

## Screen-reader mode

### Accessibility activation and announcement buffering

**What it does:** Resolves whether screen-reader mode is enabled, records its activation source, and
buffers short semantic announcements for the next render.

**How it works:**
1. `ScreenReaderModeResolver` (`_0u`, `cli_inner_pretty.js:127248-127269`) evaluates activation in
   precedence order: `--ax-screen-reader`, `CLAUDE_AX_SCREEN_READER`, then the `axScreenReader`
   setting.
2. If none is enabled, it caches `false`. If requested, it applies the remote experiment gate and
   records the winning source only when the gate permits activation.
3. `isScreenReaderEnabled` (`FM`) exposes the cached decision; `screenReaderModeBanner` (`b0u`)
   includes the activation source for diagnostics.
4. Startup quiet-window helpers postpone rendering for a bounded interval so terminal setup output
   is not narrated as application content.
5. `enqueueScreenReaderAnnouncement` (`xGe`, `cli_inner_pretty.js:127300-127302`) pushes semantic
   phrases into a 16-item FIFO, dropping the oldest entries on overflow.
6. `drainScreenReaderAnnouncements` (`H0u`) atomically swaps the queue for an empty array during the
   next render.

**Why this approach:**
- Explicit precedence makes command-line intent authoritative while retaining environment and
  durable-setting automation.
- Caching avoids feature-gate and settings reads on every frame.
- A small bounded queue decouples input events from rendering without allowing an inactive terminal
  to accumulate unlimited stale speech.
- Dropping oldest announcements favors the user's most recent actions, though very rapid activity
  can intentionally lose earlier narration.

**Key insight:** Screen-reader output is not derived solely from pixels or text diffs. Semantic
announcements share the render cycle with the flattened UI, allowing actions such as deletion to be
spoken even when the visible result alone is ambiguous.

### Accessibility-tree flattening and cursor parking

**What it does:** Converts the Ink node tree into width-aware plain text and identifies the cursor
position that belongs to the editable input.

**How it works:**
1. `renderNodeToScreenReaderOutput` (`Sgn`, `cli_inner_pretty.js:273779-273819`) recursively visits
   visible nodes, strips unsafe controls, and returns both text and whitespace-preservation ranges.
2. `flattenScreenReaderFlexTree` (`lx_`, `cli_inner_pretty.js:273821-273843`) respects flex layout so
   siblings that are horizontal visually remain meaningful in plain text.
3. `findScreenReaderCursorPark` (`mUs`, `cli_inner_pretty.js:273844-273867`) resolves the declared
   input cursor into a text offset.
4. `TerminalRenderer.onRenderScreenReader` (`AAr`, method at
   `cli_inner_pretty.js:274667-274857`) wraps lines to terminal columns while preserving explicitly
   significant trailing whitespace.
5. It merges queued announcements after the UI lines and adjusts the first changed row so newly
   announced text is never skipped by an otherwise unchanged-frame optimization.
6. It records both the parked row/column and whether that park was explicitly declared by the tree.

**Why this approach:**
- Flattening the semantic tree avoids narrating box-drawing and layout-only glyphs.
- Preserve ranges retain whitespace only where it carries input meaning; globally preserving it
  would make screen readers announce visual padding.
- Explicit cursor declaration distinguishes a trustworthy editor cursor from a fallback end-of-frame
  position.
- The cost is a full semantic-tree flatten before the incremental terminal diff, but correctness is
  prioritized for accessibility output.

**Key insight:** Cursor parking is part of the accessibility protocol. The 2.1.221 deletion fix can
take its fast path only because both the old and new frames prove where the logical input cursor is.

### Incremental screen-reader frame update

**What it does:** Selects the smallest safe terminal update—no-op, suffix append, suffix deletion, or
fallback rewrite—while maintaining a three-state anchor invariant.

**How it works:**
1. Compare old and new line arrays to find the first changed line, pulling that index earlier if a
   queued announcement begins before it.
2. If lines and cursor park are identical, emit nothing and only refresh whether the park was
   explicitly declared.
3. For a pure suffix append on the visible anchored line, verify later lines are unchanged, tabs are
   absent, the first grapheme has positive display width, and display-width arithmetic is exact.
4. If all append checks pass, move to the append column, write only the suffix, and restore the
   cursor.
5. Otherwise test the stricter suffix-deletion path described below.
6. If neither fast path is safe, clear and rewrite from the first changed row, then restore the
   cursor.
7. Update `prevScreenReaderAnchor` among `clean`, `lastRowAnchored`, and `broken` according to how
   much of the viewport was rewritten and whether the cursor remains on the last row.

**Why this approach:**
- Small terminal writes reduce both flicker and the amount a screen reader re-announces.
- Display-width and grapheme checks are necessary because JavaScript string offsets do not equal
  terminal columns for emoji, combining marks, or wide glyphs.
- The anchor state prevents an optimization after scrolling or partial repaint has made the physical
  cursor position uncertain.
- Conservative fallback costs more output but is safer than corrupting the accessible view.

**Key insight:** The renderer treats “can I prove the terminal still matches my model?” as a state
machine. Fast paths are permissions earned by exact invariants, not optimistic string diffs.

### End-of-line suffix deletion fast path

**What it does:** Handles backspace at the end of the input by erasing only the removed suffix,
preventing screen readers from re-reading the whole line.

**How it works:**
1. Require no queued announcement, unchanged line count, a visible first-difference line, and a
   `clean` or valid `lastRowAnchored` renderer state.
2. Require the old line to start with the new line and every later line to be byte-identical.
3. Derive the removed suffix and reject empty suffixes, tabs, zero-width leading code points,
   display-width mismatches, or a cut that is not on a grapheme boundary.
4. Reject a suffix that mixes whitespace and non-whitespace; accept either no whitespace or an
   entirely whitespace suffix. This avoids ambiguous terminal behavior across word/spacing edits.
5. Require an explicitly declared old and new cursor park, with the old cursor at the old line's end.
6. Move to the new end, emit erase-to-end-of-line (`jbo`, CSI `K`), and restore the new cursor park.
7. Commit the new line/park snapshot without entering the full rewrite branch.

**Why this approach:**
- Erase-to-EOL is the smallest operation that represents a terminal deletion; terminals do not
  receive “backspace changed model text” semantically.
- Requiring an end cursor avoids deleting text to the right of an interior edit.
- Grapheme and width checks protect multi-column and combining Unicode.
- The mixed-whitespace rejection is conservative; some deletions fall back to a rewrite, but none
  risk a misleading accessible line.

**Key insight:** The fix is not merely special-casing the Backspace key. It recognizes a proven
frame transition, so the optimization also works for equivalent end-of-line deletions regardless of
which input action produced them.

### Deletion narration and empty-input left gesture

**What it does:** Announces deleted content and prevents an accidental left-arrow transition
immediately after an input becomes empty.

**How it works:**
1. `announceDeletedText` (`RPa`, `cli_inner_pretty.js:643655-643676`) ignores empty deletions.
2. When the input is masked, it announces only “deleted”; otherwise all-whitespace deletions become
   “new line,” “tab,” or “space,” and ordinary text is newline-normalized before queuing.
3. `createLeftArrowGuardState` (`MCf`) tracks when editing emptied the composer, when confirmation was
   armed, the last left press, and the attach-session confirmation window.
4. `classifyLeftArrowOnEmpty` (`OCf`, `cli_inner_pretty.js:643615-643627`) returns one of six outcomes:
   reject, fire, arm, absorb, attach-arm, or attach-absorb.
5. The classifier fires immediately when confirmation is not required; otherwise a recent edit-to-
   empty arms the gesture and a second press within three seconds fires it.
6. Attached-session mode adds a minimum 150 ms delay and absorbs rapid repeats, preventing terminal
   key-repeat from confirming unintentionally.
7. `applyLeftArrowGuardOutcome` (`NCf`) updates timestamps without mixing policy into the input hook.

**Why this approach:**
- Mask-aware narration avoids exposing secrets through assistive output.
- Named outcomes make timing policy testable separately from navigation side effects.
- The two-step guard protects users just after destructive editing while preserving quick navigation
  from an intentionally empty prompt.
- Multiple timestamps are more complex than a boolean, but a boolean cannot distinguish key repeat,
  fresh editing, and attach confirmation.

**Key insight:** Accessibility and safety share the same semantic input layer: deletion is narrated,
and the same edit-to-empty event arms navigation protection.

## Vim state over the shared composer

### Table-driven Vim dispatcher and durable register ownership

**What it does:** Implements Vim NORMAL, INSERT, and VISUAL modes while keeping yank/find state alive
across dialogs, history search, and transcript-view remounts.

**How it works:**
1. `useVimInput` (`O7a`, `cli_inner_pretty.js:742699-743188`) wraps `useSharedInput` (`Gdi`) and keeps
   a small command-state machine for counts, operators, finds, text objects, indentation, replacement,
   and visual selection.
2. Static null-prototype command tables map keys to actions, reducing a large nested conditional to
   composable state transitions.
3. `createSharedVimState` (`Zam`) contains `lastFind`, `register`, and `registerIsLinewise`.
4. `getOrCreateSharedVimState` (`YyE`, `cli_inner_pretty.js:743235-743240`) obtains that object through
   global accessors `LWi`/`DWi` and creates it only when absent.
5. `useVimInput` stores a ref to this shared object (`742718`) rather than constructing component-local
   state. Yanks and finds therefore survive when another surface temporarily replaces the composer.
6. Transient command mode, selection anchor, pending remap, and inserted-text tracking remain local
   to the active component and reset normally on remount.

**Why this approach:**
- Only user-expected editor memory is durable. Persisting every parser state would revive half-entered
  commands after a dialog and create surprising behavior.
- A shared mutable object gives remounted hooks the same register without forcing register updates
  through the entire React tree.
- The trade-off is process-global lifetime rather than per-component isolation, which matches the
  user's expectation of one Vim register for the current CLI process.

**Key insight:** The 2.1.221 fix is an ownership correction. In 2.1.220 the register lived in a local
`useRef(G7p())` (`2.1.220:656906`); 2.1.227 initializes the ref from `YyE()`, so UI navigation no
longer silently replaces Vim's memory.

### Undo-to-empty navigation rearming

**What it does:** Treats undo that restores an empty prompt like any other edit that empties the
composer, so the next left arrow asks for confirmation before leaving the agent view.

**How it works:**
1. `useVimSharedInput` (`ilm`, `cli_inner_pretty.js:743189-743233`) captures the base composer's
   `noteKeystrokeEmptied` callback in a ref.
2. Its normal `onChange` wrapper invokes the callback when a nonempty value becomes empty.
3. Its 2.1.227 `onUndo` wrapper invokes the same callback before delegating to the caller's undo.
4. History-up and history-down wrappers also notify the guard before replacing input state.
5. The next left-arrow classification sees a recent `editedEmptyAtMs` and returns `arm` instead of
   immediately firing the navigation action.

**Why this approach:**
- Centralizing all emptying paths on one callback prevents the gesture policy from needing to know
  whether text changed through typing, undo, or history replacement.
- Calling before the outer undo keeps the timing event coupled to the initiating keystroke.
- The wrapper adds a small indirection, but it avoids duplicating timestamp logic across editor modes.

**Key insight:** The baseline passed `onUndo` through unchanged. The current wrapper repairs a missed
state transition rather than altering Vim's undo algorithm.

### Insert-mode escape remap recognition

**What it does:** Recognizes configured two-grapheme insert sequences such as `jk` and converts them
to Escape without deleting unrelated text.

**How it works:**
1. `parseVimInsertRemaps` (`IyE`, `cli_inner_pretty.js:742363-742371`) accepts only mappings whose
   target is `<esc>`, normalizes each key to NFC, excludes control/separator characters, and requires
   exactly two graphemes.
2. The first eligible character records its value, timestamp, post-insert cursor offset, and whether
   it was already counted in inserted-text history.
3. The second character must arrive within one second, at the expected cursor, with the first
   character still immediately before the cursor.
4. On a match, the hook removes only the recorded first character, repairs inserted-text bookkeeping,
   enters NORMAL mode, and emits `vim_insert_remap` telemetry.
5. A key event containing both graphemes can match directly; cursor movement, timeout, or a protected
   special key cancels the pending candidate.

**Why this approach:**
- NFC plus grapheme counting supports accented and composed input while rejecting ambiguous control
  sequences.
- Cursor continuity proves the user has not moved or edited between the two characters.
- A one-second window balances intentional remaps against ordinary typing.
- Supporting a two-grapheme event handles terminal/input-method batching without broadening accepted
  mappings.

**Key insight:** Matching is bound to the exact text and cursor transition, not just two successive
key names. That prevents a stale first key from deleting the wrong character.

## Emoji completion

### Collision-safe alias expansion and ranked search

**What it does:** Adds familiar alternate emoji shortcodes while preserving canonical names and the
existing completion ranking.

**How it works:**
1. `emojiAliases` (`RZm`, `cli_inner_pretty.js:834810-834823`) maps nine alternate names—including
   `thumbsup`, `thumbsdown`, and `love`—to canonical table keys.
2. `initializeEmojiIndex` (`PZm`, `cli_inner_pretty.js:836416-836427`) starts with all canonical
   entries.
3. For each alias, it looks up the canonical glyph and adds the alias only if the target exists and
   the alias does not collide with a canonical key.
4. The merged entries become a `Map`; a stable key snapshot supports repeated searches.
5. `getEmojiSuggestions` (`WHv`, `cli_inner_pretty.js:836401-836414`) performs case-insensitive
   substring matching, ranks prefix matches first, then shorter names, and returns at most 20 rows.
6. `getEmoji` (`GHv`) resolves both canonical and alternate names through the same map.

**Why this approach:**
- Alias indirection avoids duplicating glyph literals and automatically tracks canonical corrections.
- Canonical-key collision protection guarantees an alias can never shadow the base data set.
- Substring matching is forgiving; prefix and length ranking keep likely choices near the top without
  requiring a fuzzy-search dependency.
- A fixed 20-row cap bounds rendering and keyboard traversal cost.

**Key insight:** Alternate shortcode support is a data-layer expansion. Search, lookup, and insertion
remain one pipeline because aliases are normalized into the same index at initialization.

### Inline replacement validity guard

**What it does:** Confirms that a pending inline emoji suggestion still corresponds to the current
input before replacing its shortcode.

**How it works:**
1. `isValidEmojiCompletionDiff` (`QHv`, `cli_inner_pretty.js:836430-836435`) rejects a missing prior
   value.
2. It computes the length delta and derives the proposed shortcode start from the current cursor.
3. It removes that candidate span from the new value and requires the result to equal the prior
   value exactly.
4. It requires the inserted span to end with `:` and contain only lowercase letters, digits,
   underscore, plus, or minus.
5. Only after this proof does the input component replace the span, move the cursor, close completion,
   and emit `input_emoji_completion` with `inline: true`.

**Why this approach:**
- Suggestion state can lag typing; comparing the full outside text prevents replacement after an
  unrelated edit.
- A narrow shortcode grammar avoids interpreting arbitrary colon-delimited text as emoji input.
- Exact comparison is cheaper and more reliable than reconstructing editor operations.
- The conservative guard may discard a stale but recoverable suggestion, which is safer than
  overwriting user text.

**Key insight:** The autocomplete trusts a suggestion only after proving the current value equals the
old value plus one valid shortcode at the cursor.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `ScreenReaderModeResolver` (`_0u`) - resolves and caches accessibility activation.
- `renderNodeToScreenReaderOutput` (`Sgn`) - flattens the semantic UI tree.
- `TerminalRenderer` (`AAr`) - owns incremental accessible and visual terminal rendering.
- `classifyLeftArrowOnEmpty` (`OCf`) - computes the guarded empty-input navigation outcome.
- `useSharedInput` (`Gdi`) - common text composer used by normal and Vim modes.
- `useVimInput` (`O7a`) - mode/state dispatcher over the shared composer.
- `getOrCreateSharedVimState` (`YyE`) - preserves the yank register and last find across remounts.
- `getEmojiSuggestions` (`WHv`) - ranks canonical and alias emoji shortcodes.
- `isValidEmojiCompletionDiff` (`QHv`) - validates safe inline replacement.
