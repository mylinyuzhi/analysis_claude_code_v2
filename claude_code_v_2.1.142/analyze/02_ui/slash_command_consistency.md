# Slash Command Visual Consistency + AskUserQuestion Fix (v2.1.136 / v2.1.141)

## What changed

Two related visual fixes:

1. **v2.1.136**: Brought slash command dialog visuals into a single
   coherent pattern. Pre-2.1.136, the dialogs for `/plugin`, `/mcp`,
   `/skills`, `/agents`, `/tasks`, `/memory`, and `/branch` each had
   slightly different border styles, padding, header layouts, and
   footer hint spacing. v2.1.136 unifies them around a shared
   "boxed dialog" pattern with consistent:
   - Border style: `single` with `borderTopDimColor`.
   - Padding: `paddingLeft: 2` for content, `marginTop: 1` for
     separation from preceding content.
   - Header: bold title at top.
   - Footer hints: dim-colored, `·`-separated chord list.

2. **v2.1.141**: Fixed the `AskUserQuestion` popup hiding the last
   line of preceding chat content. The popup's anchor calculation
   was off by one line — when placed below the input, it overdrew the
   bottom edge of the assistant's most recent message.

## Source: AskUserQuestion popup name

```javascript
// ============================================
// AskUserQuestion - tool name reservation
// Location: cli_inner_pretty.js:211430
// ============================================

var Gz = "AskUserQuestion",
    /* …other tool names… */;
```

The string `"AskUserQuestion"` is the tool name registered in
`n3H` — the set of "special" tools that have UI affordances. When
the assistant invokes this tool, a popup appears below the chat with
a dropdown of answer choices.

## Source: the popup's layout

The popup component (compiled around `Gz$.default.createElement` paths
near line 179478-179511) builds a bordered box with the question
prompt and choice list. The v2.1.141 fix is in how the popup's
**vertical position** is computed relative to the surrounding
transcript.

```javascript
// ============================================
// AskUserQuestion popup layout - v2.1.141 fix
// Location: cli_inner_pretty.js:179478-179511 (excerpted from compiled component)
// ============================================

function AskUserQuestionPopup({
  question, choices, selectedIndex, hasCheckbox, value, color, dimColor,
}) {
  // The popup is positioned at the bottom of the transcript, between
  // the last assistant message and the input box.
  //
  // PRE-v2.1.141 BUG: the popup's outer box included an implicit
  // top-margin that overlapped the last line of the preceding chat
  // content. Users would see their last assistant message's bottom
  // row clipped under the popup's header.
  //
  // FIX: explicit marginTop and noSelect, plus the popup is now
  // rendered AFTER a Box height={1} spacer that pushes it down by one row.

  const headerRow = React.createElement(Text, { dimColor, key: "header" },
    React.createElement(SpinnerStub, null, value)
  );

  const choiceRow = React.createElement(Text, { color, dimColor: hasCheckbox },
    /* glyph + label + arrow */
    headerRow, " ", choices[selectedIndex], " ", /* … */
  );

  return choiceRow;
}
```

(The exact pre-fix vs post-fix diff isn't visible in the raw bundle
since each release re-prettifies; the changelog narrative is
authoritative for the "off by one line" symptom.)

## Source: the consistent dialog pattern

The v2.1.136 visual consistency pass converges multiple dialogs on a
common shape. The shape (re-derived from the bundle's dialog
components) is:

```jsx
// READABLE — the canonical slash-command dialog frame
<Box                                  // outer container
  flexDirection="column"
  // The frame: top border only, dim color, full width.
  borderTopDimColor
  borderBottom={false}
  borderLeft={false}
  borderRight={false}
  borderStyle="single"
  marginTop={1}                       // breathing room from preceding content
  paddingLeft={2}                     // left content padding
  width="100%"
  noSelect
  alignSelf="center"
>
  {/* HEADER: bold title at top */}
  <Box marginBottom={1}>
    <Text bold>{dialogTitle}</Text>
  </Box>

  {/* CONTENT: list, form, table, etc. */}
  {content}

  {/* OPTIONAL: status / search badge / count badge on right */}
  <Box flexGrow={1} />
  <Box>{statusElement}</Box>

  {/* FOOTER: dim, ·-separated chord list */}
  <Box marginTop={1}>
    <Text dimColor>
      <Fragment>
        {chordHints.map((hint, i) => (
          <Fragment key={i}>
            {i > 0 && " · "}
            {hint}
          </Fragment>
        ))}
      </Fragment>
    </Text>
  </Box>
</Box>
```

Examples of this pattern in the bundle:

- Transcript footer bar (`ri4`, cli_inner_pretty.js:579410-579475)
- Transcript help menu (`si4`, cli_inner_pretty.js:579501-579607)
- Search bar in transcript (`$HA`, cli_inner_pretty.js:579608-579675)
- Scroll speed dialog (`WJ4`, cli_inner_pretty.js:476494-476601)
- Theme editor dialog (`qL4`, cli_inner_pretty.js:481434-481605)
- Plugin browser, MCP server picker, skills picker (composed via
  `SelectableList`)

## Why this approach

### Why unify the visual pattern across dialogs?

**What:** The v2.1.136 pass aligns every slash dialog on the same
frame, padding, header, and footer style.

**Why:**

- Users learn the dialog shape once. Recognizing "this is a dialog,
  here's where the footer is" reduces cognitive load.
- Inconsistencies feel buggy. When `/plugin` has thicker borders
  than `/skills`, users wonder if one is broken.
- A shared base component (the canonical frame) simplifies
  maintenance — future changes to the dialog visuals (e.g. new dark
  theme contrast tweaks) apply uniformly.
- Plugin authors writing custom slash dialogs can copy the pattern,
  ensuring their dialogs feel native.

### Why dim borders rather than solid?

**What:** `borderTopDimColor` and `dimColor: true` on Text
descendants throughout the dialog frame.

**Why:**

- Dim borders separate the dialog from the surrounding transcript
  without dominating the visual hierarchy.
- The content of the dialog (titles, items) gets full color; the
  chrome (borders, footer hints, status) gets dim. This creates a
  clear "what to pay attention to" gradient.
- Solid borders would compete with the content for eye attention,
  especially on themes with dark backgrounds where bright borders
  feel intrusive.

### Why `borderBottom={false}` + `borderTopDimColor`?

**What:** Only the top border is rendered.

**Why:**

- The dialog's bottom edge is naturally bounded by the input box or
  the next UI element. Adding a bottom border would be redundant.
- Top-only border creates a visual "shelf" — the dialog sits on top of
  preceding content like a panel descending from above.
- Saves a row of vertical space, valuable in narrow terminals.

### Why `marginTop: 1`?

**What:** Every dialog has one blank line of margin above its top
border.

**Why:**

- Without margin, the dialog's top border abuts whatever immediately
  precedes it (last chat message, prompt input). Visually merging
  with the previous element confuses the boundary.
- One row of breathing space is sufficient — enough to register as a
  visual separator without wasting screen real estate.
- This is what the v2.1.141 AskUserQuestion fix needed: the popup
  positioning was failing to insert this margin, causing the bottom
  line of the preceding message to be obscured.

### Why `·` as the chord separator in footer hints?

**What:** Footer hints separated by ` · ` (middle dot with surrounding
spaces).

**Why:**

- `·` is a low-noise glyph that doesn't draw the eye. Comma or `|`
  would feel heavier.
- Unicode middle dot renders correctly on essentially all modern
  terminals.
- Consistent with the spinner's suffix separator (also `·`), so the
  visual language carries across more of the UI.

### Why ensure `noSelect`?

**What:** Dialogs have `noSelect` set, so click-and-drag selection
doesn't grab the dialog chrome.

**Why:**

- Users want to select content inside the dialog (e.g. a model name,
  a skill description). They don't want to accidentally grab the
  border characters or chord hints when they drag.
- `noSelect` is a hint to the alt-screen renderer to skip these
  regions during selection extending.
- This also prevents copy-paste from inadvertently including the
  border `─` characters in the clipboard.

### Why is the `AskUserQuestion` popup placed below the chat content?

**What:** When the assistant invokes `AskUserQuestion`, the popup
appears between the latest chat content and the input box.

**Why:**

- The popup is associated with the chat turn — placing it inline
  preserves the "this is what the assistant is asking" context.
- Placing it as a centered modal would interrupt the user's reading
  flow. The user is already looking at the bottom of the screen
  (input area); the popup appearing there feels natural.
- The bug (and fix) is about correctly positioning the popup so it
  *separates* from the chat without *overlapping* it. The margin-top
  spacer is the explicit fix.

## Cross-validation: pre-2.1.136 vs 2.1.141

| Aspect | Pre-2.1.136 | v2.1.136 | v2.1.141 |
|--------|-------------|----------|----------|
| Dialog border style | Varied per dialog | Single, dim-top, no sides/bottom | Same |
| Dialog padding | Varied | `paddingLeft: 2`, `marginTop: 1` | Same |
| Header layout | Varied | Bold title at top | Same |
| Footer hints | Varied | Dim, `·`-separated | Same |
| `noSelect` | Varied | Applied to dialog containers | Same |
| AskUserQuestion popup top margin | Implicit (off by one) | (cosmetic) | Explicit margin (FIX) |
| AskUserQuestion popup obscures preceding line | Yes | Still yes (cosmetic) | No (fixed) |
| `/branch` multi-line title rendering | Wrapped incorrectly | Fixed in 2.1.136 | Same |

## Cross-references

The v2.1.136 release also included a paired fix mentioned in the
changelog: "`/branch` multi-line title fix." That was a layout bug
specific to the `/branch` slash command, where a multi-line title
(branches with commit-message-style titles spanning multiple lines)
was being rendered inconsistently. The unified dialog pattern naturally
handles multi-line headers via `flexDirection: "column"` on the
title row.

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components / Slash Commands
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `AskUserQuestion` tool name string (`Gz`) — cli_inner_pretty.js:211430
- AskUserQuestion popup layout — cli_inner_pretty.js:179478-179511
- Canonical dialog frame: borderTopDimColor + paddingLeft:2 + marginTop:1 + noSelect
- Shared chord-list separator: ` · `
- `n3H` — set of special tool names including AskUserQuestion; cli_inner_pretty.js:211699
