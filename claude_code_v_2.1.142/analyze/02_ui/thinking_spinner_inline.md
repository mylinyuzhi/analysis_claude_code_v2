# Inline Thinking Spinner Progress (v2.1.116)

## What changed

When the model is in *thinking* mode and elapsed time crosses 10s, 20s,
30s, and 45s, the spinner's secondary text rotates through a sequence
of hints that signal the model is still making progress:

| Elapsed (s) | Hint text          |
|-------------|--------------------|
| 0 – 10      | `thinking`         |
| 10 – 20     | `still thinking`   |
| 20 – 30     | `thinking more`    |
| 30 – 45     | `thinking some more` |
| 45+         | `almost done thinking` |

The hint is rendered next to the spinner glyph in parentheses or as a
suffix:

```
✸ Thinking... (still thinking) · ↓ 1.2k tokens
```

When elapsed crosses one of the four thresholds, the message changes —
the user sees progress without any tokens needing to be streamed.

## Source: hint-text picker

```javascript
// ============================================
// getThinkingHintForElapsed - 4-rung threshold ladder
// Location: cli_inner_pretty.js:328461-328467
// ============================================

// ORIGINAL (for source lookup):
function oB_(H) {
  if (H >= rB_) return "almost done thinking";
  if (H >= iB_) return "thinking some more";
  if (H >= nB_) return "thinking more";
  if (H >= lB_) return "still thinking";
  return "thinking";
}

// READABLE (for understanding):
function getThinkingHintForElapsed(elapsedMs) {
  // Order matters: top-down so we land on the highest matching threshold.
  if (elapsedMs >= ALMOST_DONE_THINKING_MS) return "almost done thinking";  // ≥ 45s
  if (elapsedMs >= THINKING_SOME_MORE_MS)   return "thinking some more";    // ≥ 30s
  if (elapsedMs >= THINKING_MORE_MS)        return "thinking more";         // ≥ 20s
  if (elapsedMs >= STILL_THINKING_MS)       return "still thinking";        // ≥ 10s
  return "thinking";                                                         // 0 – 10s
}

// Mapping: oB_→getThinkingHintForElapsed, lB_→STILL_THINKING_MS,
//          nB_→THINKING_MORE_MS, iB_→THINKING_SOME_MORE_MS,
//          rB_→ALMOST_DONE_THINKING_MS
```

## Source: the threshold constants

```javascript
// ============================================
// Thinking hint thresholds
// Location: cli_inner_pretty.js:328735-328738
// ============================================

lB_ = 1e4,       // STILL_THINKING_MS        = 10_000 (10s)
nB_ = 20000,     // THINKING_MORE_MS         = 20_000 (20s)
iB_ = 30000,     // THINKING_SOME_MORE_MS    = 30_000 (30s)
rB_ = 45000;     // ALMOST_DONE_THINKING_MS  = 45_000 (45s)
```

## Source: how the hint flows into the spinner

```javascript
// ============================================
// SpinnerComponent - threading the hint text into the rendered output
// Location: cli_inner_pretty.js:328468-328694 (selected lines)
// ============================================

// In the SpinnerComponent body, around line 328570-328605:
let DH = elapsedSinceStart,        // o (Math.max-adjusted for teammate-idle correction)
    PH = getThinkingHintForElapsed(elapsedSinceStart),                                 // PH = "thinking" | "still thinking" | …
    NH = thinkingStatus === "thinking"
       ? `${PH}${effortSuffix}`                                                        // e.g. "still thinking" + " with xhigh effort"
       : typeof thinkingStatus === "number"
         ? `thought for ${Math.max(1, Math.round(thinkingStatus / 1000))}s`            // post-thinking summary
         : null,
    hH = NH ? lengthOfStringForLayout(NH) : 0;
// …
// Layout passes:
//   A$ = canFitFullHintLength;  (iH > hH width budget)
// If A$ is false but hint is "thinking" + (effortSuffix OR not the bare "thinking" word):
if (!A$ && hintIsThinkingState && (hasEffortSuffix || PH !== "thinking")) {
  if (iH > widthOfWord("thinking")) {
    NH = "thinking";                  // collapse to just "thinking" when room is tight
    hH = widthOfWord("thinking");
    A$ = true;
  }
}
// …
// Rendering, around 328626-328632 — the thinking hint is emitted with
// the spinner's "thinking intensity" color (transitioning to warning/amber):
if (A$ && NH) {
  if (thinkingStatus === "thinking" && !reducedMotion) {
    // Live thinking — apply current thinking color (amber gradient).
    children.push(React.createElement(Text, { key: "thinking", color: thinkingColor }, isParenWrapped ? `(${NH})` : NH));
  } else {
    // Already-thought summary or reduced motion — dim color.
    children.push(React.createElement(Text, { dimColor: true, key: "thinking" }, NH));
  }
}
```

The layout has two paths:

1. **Wide enough**: render the full hint string ("still thinking",
   "thinking some more", etc.) with the effort suffix.
2. **Narrow**: collapse to just `"thinking"` to preserve the visual
   tag without spilling the column.

The collapse path is what keeps the spinner readable on narrow
terminals — the hint information graceful-degrades to a bare presence
marker.

## Source: post-thinking summary

After thinking completes (the model emits a `thought for` event), the
hint changes role to a duration summary:

```javascript
// READABLE — from the same SpinnerComponent block
// `thinkingStatus` can be:
//   "thinking" — currently thinking
//   number      — milliseconds spent thinking (post-completion)
//   null        — never thought / not applicable

if (typeof thinkingStatus === "number") {
  NH = `thought for ${Math.max(1, Math.round(thinkingStatus / 1000))}s`;
  // …rendered dimmed since the thinking is done
}
```

So after a thinking turn finishes, the spinner shows `thought for 27s`
until the next prompt — providing post-hoc context for how much
reasoning happened.

## Why this approach

### Why a 4-rung ladder rather than a continuous progress percentage?

**What:** Four discrete strings at 10s/20s/30s/45s.

**Why:**

- The model's *internal* thinking budget is opaque from the client.
  We cannot show a real percentage because we don't know the cap.
- A continuous percentage would be misleading — it'd anchor users on
  a fake completion estimate.
- Four discrete strings convey "still working" without implying
  measurable progress. The user knows each transition is just time
  elapsed, not progress.
- The wording is intentionally non-progressive (`still thinking` →
  `thinking more` → `thinking some more` → `almost done`). Only the
  last carries a completion hint, and only because it's empirically
  rare for a thinking turn to exceed 60s (the 45s threshold catches
  the long-tail without over-promising).

### Why these specific thresholds (10/20/30/45)?

**What:** Geometric-ish spacing: 10 → 20 → 30 → 45. Not pure
power-of-2.

**Why:**

- The transitions are visible to a casual observer. Sub-10s the user
  is happy. The 10s mark coincides with the spinner amber warming
  (see [spinner_amber_warm.md](./spinner_amber_warm.md)) — a single
  consolidated "still working" cue.
- 10 → 20 → 30 (10-second steps) catches the middle range. Most
  thinking turns finish here; the user gets 2-3 hint transitions.
- The jump from 30 → 45 (15-second step) skips a 40s threshold to
  reserve "almost done" for genuinely long thinking. If we'd put it
  at 40s many normal turns would end during "almost done" and never
  hit it, eroding its signal.
- 45s is well past p99 for normal thinking; reaching it is a real
  outlier. "Almost done" works as both a soft prediction and a
  diagnostic ("this is taking unusually long; we know").

### Why a top-down `if` chain rather than a lookup table?

**What:** `getThinkingHintForElapsed` is an ordered cascade of `>=`
checks, not a table or binary search.

**Why:**

- 4 thresholds → 4 comparisons. Maximum 5 lines including the default.
- An ordered chain is the most readable form for monotonic thresholds.
- No allocation — the function is called every render frame; the
  table-based alternative would either allocate (closure over array)
  or be a constant table (extra symbol). The cascade is allocation-free.

### Why does the effort suffix attach to the hint?

**What:** `NH = thinkingStatus === "thinking" ? \`${PH}${effortSuffix}\``
— the active effort (" with xhigh effort") follows the hint when
thinking.

**Why:**

- The user-active effort is a key piece of context during a long
  thinking turn. Surfacing it next to "still thinking" tells the user
  *why* it's taking long (xhigh budget allotted).
- After thinking completes, the post-hoc summary doesn't include
  effort — by that point the duration is the story.
- The collapse path strips effort first ("thinking" alone) — when
  space is too tight, the hint name is more diagnostic than the
  effort label.

### Why discrete 10s alignment with the spinner amber warming?

The 10s mark is the elbow of the entire spinner UX:

- **Before 10s**: spinner is dim gray (sub-perception level).
  Casual visual indicator only.
- **At 10s**: spinner starts lerp-fading to amber over 10s.
  Simultaneously, the thinking-hint cascade starts (`still thinking`).
- **At 20s**: spinner is fully amber. Hint moves to `thinking more`.
- **At 30s**: Hint moves to `thinking some more`. Amber persists.
- **At 45s**: Hint moves to `almost done thinking`.

The visual story: gray → amber → amber-with-progression-text. The 10s
threshold is the "you should notice this" point.

## Cross-validation: pre-2.1.116 vs 2.1.116

| Aspect | Pre-2.1.116 | v2.1.116+ |
|--------|-------------|-----------|
| Thinking spinner suffix | Bare `(thinking)` or absent | Rotating `(thinking)` → `(still thinking)` → … → `(almost done thinking)` |
| Threshold-triggered updates | None | 10s/20s/30s/45s |
| Post-completion hint | `(thought for Ns)` | Same (already present) |
| Effort suffix in hint | Static suffix on model name | Attached to thinking hint |
| Collapse on narrow terminal | n/a | Falls back to bare `"thinking"` |

## Reduced-motion behavior

When `reducedMotion` is true (e.g. user has `prefers-reduced-motion`
or the env var override), the spinner skips:
- The glimmer animation.
- The amber color transition.
- The hint pulse on threshold crossings.

The hint *text* still updates per threshold, but it's rendered with a
dim static color rather than the warming gradient. This preserves the
informational content for users who prefer less motion without losing
the threshold signal.

## Related symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — UI / Spinner
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `getThinkingHintForElapsed` (`oB_`) — 4-rung ladder; cli_inner_pretty.js:328461-328467
- `STILL_THINKING_MS` (`lB_`) = 10_000; cli_inner_pretty.js:328735
- `THINKING_MORE_MS` (`nB_`) = 20_000; cli_inner_pretty.js:328736
- `THINKING_SOME_MORE_MS` (`iB_`) = 30_000; cli_inner_pretty.js:328737
- `ALMOST_DONE_THINKING_MS` (`rB_`) = 45_000; cli_inner_pretty.js:328738
- `SpinnerComponent` (`Py7`) — renders the hint and the spinner; cli_inner_pretty.js:328468-328694
- `THINKING_LABEL_WIDTH` (`Dy7`) — pre-computed width of `"thinking"` for collapse path
