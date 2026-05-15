# Scrollable Dialogs on Overflow (v2.1.121)

## What changed

Pre-v2.1.121, dialogs that exceeded the terminal viewport height were
*truncated*: the dialog rendered at its full height, the bottom portion
clipped, with no way to see hidden content.

v2.1.121 makes overflowing dialogs **scrollable**: when total content
height > available viewport, the dialog renders with internal
scrollable regions (powered by the existing virtual-scroll list
infrastructure). The user can scroll within the dialog without moving
the dialog itself.

Two related v2.1.121 changes ship in the same release window:

1. Click-any-line of long URLs (mouse handler treats a multi-line URL
   as a single click target).
2. Type-to-filter search box in `/skills`.

This document focuses on the dialog-scrollability primitive that's
shared by `/skills`, `/mcp`, `/plugin`, `/usage`, `/agents`,
`/branch`, and other scrollable lists.

## Source: virtualized list infrastructure

The bundle defines a `useVirtualScroll`-style hook (the bundle
exposes the more general `EJ4` (cli_inner_pretty.js:476726) — a
keyboard-navigable list manager). The relevant excerpt:

```javascript
// ============================================
// useKeyboardList - bounded cursor + window, paged navigation
// Location: cli_inner_pretty.js:476726-476792
// ============================================

function useKeyboardList({
  count,            // total items
  visibleCount,     // viewport height in items
  containerRef,
  isDisabled = false,
  onAccept,         // optional Enter handler
  onRowKeyDown,     // forwarded key events
  onCursorChange,
  edge = "clamp",   // "clamp" | "wrap"
}) {
  const [cursor, setCursor] = useState(0);
  const hasFocus = useHasFocus(containerRef);
  const maxCursor = Math.max(0, count - 1);
  const clampedCursor = clamp(cursor, 0, maxCursor);

  // Single-step move with edge handling.
  function move(delta) {
    setCursor((current) => {
      const next = clamp(current, 0, maxCursor) + delta;
      if (edge === "wrap" && count > 0) return ((next % count) + count) % count;
      return clamp(next, 0, maxCursor);
    });
  }

  // Re-clamp cursor when count shrinks.
  useEffect(() => { if (cursor !== clampedCursor) setCursor(clampedCursor); }, [cursor, clampedCursor]);

  // Notify external listeners of cursor change.
  const onCursorChangeRef = useRef(onCursorChange);
  onCursorChangeRef.current = onCursorChange;
  const lastNotifiedCursorRef = useRef(null);
  useEffect(() => {
    if (count === 0) { lastNotifiedCursorRef.current = null; return; }
    if (lastNotifiedCursorRef.current !== clampedCursor) {
      lastNotifiedCursorRef.current = clampedCursor;
      onCursorChangeRef.current?.(clampedCursor);
    }
  }, [clampedCursor, count]);

  // Hotkey bindings — only active when focused, not disabled, and there's content.
  useKeybindings({
    "select:next":     () => move(1),
    "select:previous": () => move(-1),
    "select:pageDown": () => move(visibleCount),
    "select:pageUp":   () => move(-visibleCount),
    "select:first":    () => setCursor(0),
    "select:last":     () => setCursor(maxCursor),
  }, { context: "Select", isActive: hasFocus && !isDisabled && count > 0 });

  // Row-specific key forwarding.
  function onKeyDown(event) {
    if (isDisabled || count === 0) return;
    if (event.key === "return" && onAccept) {
      onAccept(clampedCursor);
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    onRowKeyDown?.(event, clampedCursor);
  }

  // Window calculation: keep cursor in viewport.
  //   windowStart = max(0, min(count - visibleCount, cursor - visibleCount + 1))
  const windowStart = clamp(clampedCursor - visibleCount + 1, 0, Math.max(0, count - visibleCount));
  const windowEnd   = Math.min(windowStart + visibleCount, count);

  return {
    cursor:     clampedCursor,
    windowStart,
    windowEnd,
    moreAbove:  windowStart,             // count of items above viewport
    moreBelow:  count - windowEnd,       // count of items below viewport
    isCursor:   (i) => i === clampedCursor && count > 0,
    hasFocus,
    setCursor:  (i) => setCursor(clamp(i, 0, maxCursor)),
    bind:       { tabIndex: 0, onKeyDown },
  };
}

// Mapping: EJ4→useKeyboardList
```

## Source: container with scroll affordances

The keyboard list is wrapped in a renderable that shows `↑N more`
indicators when content is hidden:

```javascript
// ============================================
// SelectableList - renders the windowed items with overflow hints
// Location: cli_inner_pretty.js:476800-476830 (approx, derived from nT5)
// ============================================

function SelectableList({
  children,
  visibleCount,
  onSelect,
  onFocus,
  isDisabled = false,
  wrap = false,
  overflowHint = "glyph",   // "glyph" | "count" | "none"
  emptyMessage,
}) {
  const containerRef = useRef(null);
  const items = React.Children.toArray(children);
  const count = items.length;

  const {
    cursor, windowStart, windowEnd, moreAbove, moreBelow, isCursor, hasFocus, bind
  } = useKeyboardList({
    count,
    visibleCount,
    containerRef,
    isDisabled,
    edge: wrap ? "wrap" : "clamp",
    onAccept: onSelect,
  });

  // Focus passthrough.
  const onFocusRef = useRef(onFocus);
  onFocusRef.current = onFocus;
  useEffect(() => { if (hasFocus) onFocusRef.current?.(cursor); }, [hasFocus, cursor]);

  if (count === 0) {
    return emptyMessage ?? null;
  }

  return (
    <Box ref={containerRef} {...bind} flexDirection="column">
      {/* Top overflow indicator */}
      {moreAbove > 0 && overflowHint !== "none" && (
        <Text dimColor>{overflowHint === "count" ? `↑ ${moreAbove} more` : "↑"}</Text>
      )}

      {items.slice(windowStart, windowEnd).map((item, i) =>
        React.cloneElement(item, { key: windowStart + i, isCursor: isCursor(windowStart + i) })
      )}

      {/* Bottom overflow indicator */}
      {moreBelow > 0 && overflowHint !== "none" && (
        <Text dimColor>{overflowHint === "count" ? `↓ ${moreBelow} more` : "↓"}</Text>
      )}
    </Box>
  );
}

// Mapping: nT5→SelectableList
```

## Source: dialog adoption

Slash command dialogs that historically rendered as bounded list boxes
now consult the available viewport size and switch to the scrollable
variant if needed. The bundle exposes the convention:

```javascript
// READABLE (a typical dialog pattern):
function SkillsDialog({ allSkills, onSelect, onCancel }) {
  const { rows, columns } = useTerminalSize();
  // Reserve a few rows for header, footer, search box, etc.
  const FOOTER_LINES = 6;
  const visibleCount = Math.max(
    MIN_VISIBLE_ITEMS,             // never below 3 items
    rows - FOOTER_LINES,
  );

  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => filterSkills(allSkills, query),
    [allSkills, query]
  );

  return (
    <Box flexDirection="column">
      <Text bold>Skills</Text>
      <SearchBox value={query} onChange={setQuery} placeholder="Type to filter…" />
      <SelectableList visibleCount={visibleCount} onSelect={onSelect} overflowHint="count">
        {filtered.map(skill => <SkillRow key={skill.id} skill={skill} />)}
      </SelectableList>
      <FooterHints
        onAccept="Enter"
        onCancel="Esc"
        chordHints={[/* … */]}
      />
    </Box>
  );
}
```

The dialog reserves space for chrome (header + footer hints + search
box) and gives the remainder to the scrollable list. When the dialog
content fits, the list shows everything inline; when not, the
windowing kicks in with `↑N more` / `↓N more` indicators.

## Why this approach

### Why scroll within the dialog rather than scale the dialog?

**What:** When content overflows, the dialog keeps its chrome
(header, footer, search box) fixed and scrolls only the *list region*.

**Why:**

- Header and footer are stable references. Scrolling them off-screen
  would force the user to re-orient on every page.
- The chrome shows context (dialog title, search query, hint legend)
  the user needs during scroll. Hiding them mid-scroll breaks the
  interaction.
- The list region is the only part that grows with content; making
  it the scroll target is the natural separation.

### Why `↑N more` / `↓N more` indicators rather than a scrollbar?

**What:** Off-screen content is signaled by text indicators, not by a
vertical bar.

**Why:**

- TUI scrollbars are visually noisy and require an extra column.
- The text indicators carry *count* information — users know exactly
  how many items they're missing.
- The indicators also indicate *direction*: `↑` for items above,
  `↓` for below. A static scrollbar would require interpretation.

### Why a configurable `overflowHint` mode?

**What:** Three modes: `"glyph"` (just `↑`/`↓`), `"count"` (`↑ 5
more`), `"none"`.

**Why:**

- `glyph` is space-efficient for narrow contexts.
- `count` is more informative for wider dialogs where the user might
  need to estimate scroll distance.
- `none` lets callers suppress the indicator entirely (e.g. for
  dialogs that have an outer scroll-position display).

### Why `useKeyboardList` is shared across all selectable surfaces?

**What:** Same hook drives `/skills`, `/mcp`, `/plugin`, `/agents`,
`/usage`, `/branch`, etc.

**Why:**

- Consistent keybindings: `↑`/`↓` next/prev, `PgUp`/`PgDn` page,
  `Home`/`End` start/end. No surface-specific quirks.
- Page-down jumps a full visible-count, which means the window slides
  by exactly one viewport — the natural reading paradigm.
- Wrap mode (`edge: "wrap"`) is a one-line config change, enabling
  carousels (`/color` random picker, etc.) without re-implementing
  navigation.

### Why clamp instead of saturating to count-on-fence?

**What:** When `count` shrinks (a filter is applied, or items are
removed), the cursor is re-clamped to `maxCursor`. This happens in
the `useEffect`.

**Why:**

- A cursor pointing past the end of the list is invalid. The clamp
  is the simplest correct response.
- Saturating to `count - 1` (effectively the same value, but conceptually
  different) is wrong when count is 0 — the cursor should be a
  no-position state.
- The clamp short-circuit also handles the wrap case: when wrapping,
  `count = 0` should yield no movement, which the `if (count > 0)`
  guard inside the `move` function ensures.

### Why decouple cursor from window?

**What:** `cursor` and `windowStart` are separate state — the cursor
can be anywhere in `[windowStart, windowEnd)`, and is moved by user
input while the window is computed from cursor + viewport size.

**Why:**

- Page navigation should move the cursor and the window together
  (jump by visibleCount).
- Single-step navigation should keep the window stable when possible
  — the cursor moves within the visible region, and only jumps to a
  new window at the edges.
- Decoupling makes both behaviors compose naturally — the window
  becomes a derived value.

## Cross-validation: pre-2.1.121 vs 2.1.121

| Aspect | Pre-2.1.121 | v2.1.121+ |
|--------|-------------|-----------|
| Dialog with content > viewport | Truncated (bottom clipped) | Scrollable list region |
| Overflow indicators | None | `↑N more` / `↓N more` |
| Page navigation in dialogs | Inconsistent | Standardized via `useKeyboardList` |
| Search box in `/skills` | n/a (was a static list) | Type-to-filter with virtualized list |
| Long URLs across multiple lines | Click first line only | Click any line — same handler |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI Components
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `useKeyboardList` (`EJ4`) — cursor + window + keybindings; cli_inner_pretty.js:476726-476792
- `SelectableList` (`nT5`) — windowed list with overflow hints; cli_inner_pretty.js:476800-…
- `useHasFocus` (`Ka$`) — focus passthrough; cli_inner_pretty.js:476737
- `useKeybindings` (`o6`) — context-scoped bindings
- `select:next`, `select:previous`, `select:pageDown`, `select:pageUp`, `select:first`, `select:last` — shared action names
