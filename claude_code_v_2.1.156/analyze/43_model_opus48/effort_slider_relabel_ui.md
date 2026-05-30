# The `/effort` Slider: Faster/Smarter Relabel and Effort-Picker UI

> Module: 43_model_opus48 — Opus 4.8 + Effort Levels
> Build under analysis: Claude Code v2.1.156
> Source: `cli_inner_pretty.js` (single pretty-printed bundle)

## Related Symbols

> Symbol mappings live ONLY in the central index files:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Effort, Thinking, CLI
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Model/effort resolution
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Model selection
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — UI components

Key functions/constants in this document (list format, never a table):
- `getSliderGeometry` (`mr4`) — builds slider levels + label/track geometry; cli_inner_pretty.js:527105-527131
- `EffortPickerSlider` (`K3z`) — the `/effort` slider React component; cli_inner_pretty.js:527265-527493
- `LevelLabelRenderer` (`lYz`) — renders one slider tick label (color/shimmer/rainbow/ripple); cli_inner_pretty.js:527132-527172
- `UltraRippleText` (`kF`) — per-character ripple-colored text; cli_inner_pretty.js:527205-527238
- `rippleLevel` (`Fr4`) — cosine ripple intensity for a distance; cli_inner_pretty.js:527199-527203
- `rippleDistance` (`Ur4`) — euclidean distance to ripple origin; cli_inner_pretty.js:527194-527197
- `getEffortHelpText` (`eE8`) — `/effort` usage text with capability tags; cli_inner_pretty.js:526897-526914
- `parseEffortArg` (`xYz`) — maps an `/effort <arg>` string to a value (ultracode→xhigh); cli_inner_pretty.js:526915-526921
- `getEffortDescription` (`RL5`) — per-level prose description; cli_inner_pretty.js:184964-184977
- `getEffortDescriptionWithBurnHint` (`YP6`) — adds "burns fastest" hint on high; cli_inner_pretty.js:184978-184986
- `getDefaultEffortForModel` (`q48`) — Opus 4.8→high, 4.7→xhigh; cli_inner_pretty.js:184987-184991
- `modelSupportsEffort` (`A2`) — effort param eligibility gate; cli_inner_pretty.js:184798-184814
- `modelSupportsXhighEffort` (`ycH`) — xhigh eligibility (Opus 4.8/4.7); cli_inner_pretty.js:184834-184851
- `modelSupportsMaxEffort` (`ow$`) — max eligibility (Opus 4.6+, Sonnet 4.6); cli_inner_pretty.js:184815-184833
- `resolveAppliedEffort` (`or`) — final effort with downgrade clamps; cli_inner_pretty.js:184909-184919
- `ultracodeAvailable` (`Vx`) — ultracode gate (= workflows enabled + xhigh-capable); cli_inner_pretty.js:184853-184855
- `workflowsEnabled` (`NZ`) — workflows-enabled predicate; cli_inner_pretty.js:184757-184763
- `isProTier` (`R4H`) — `_4() === "pro"`; cli_inner_pretty.js:131611-131613
- `setUltracodeAppState` (`Pi_`) — `{effortValue:"xhigh", ultracode:true}` reducer; cli_inner_pretty.js:461114-461116
- `applyModelMenuEffort` (`mH`) — model-menu effort apply handler; cli_inner_pretty.js:460906-460921
- `unpinOpusLaunchEffortLatch` (`SI`) — clears launch-default latch; cli_inner_pretty.js:184902-184908
- `XHIGH_CAPABILITY_TAG` (`_P6`) — `"Opus 4.8/4.7 only"`; cli_inner_pretty.js:184993
- `MAX_EFFORT_CAPABILITY_TAG` (`a$7`) — `"Opus 4.6+, Sonnet 4.6"`; cli_inner_pretty.js:184994
- `EFFORT_LEVELS_WITH_MAX` (`dN`) — `["low","medium","high","xhigh","max"]`; cli_inner_pretty.js:185009
- `BASE_SLIDER_LEVELS` (`T8q`) — the 5 base slider ticks; cli_inner_pretty.js:527555-527561
- `BASE_SLIDER_SPACERS` (`G8q`) — `[5,5,5,6]`; cli_inner_pretty.js:527554
- `BASE_SLIDER_TRIANGLE_POSITIONS` (`Ir4`) — `[1,10,20,30,40]`; cli_inner_pretty.js:527553
- `DEFAULT_SLIDER_INDEX` (`cYz`) — `3` (xhigh); cli_inner_pretty.js:527511
- `RIPPLE_RAMP` (`qy$`) — 8-step violet ripple color ramp; cli_inner_pretty.js:527565-527569

---

## TL;DR

Claude Code v2.1.154/156 reworks the `/effort` slider. Three changes matter:

1. **End labels relabeled** from *Speed / Intelligence* to **Faster / Smarter**
   (cli_inner_pretty.js:527377-527383). The slider is a thinking-time tradeoff
   knob: drag left to spend fewer thinking tokens (respond *faster*), drag right
   to spend more (respond *smarter*). The header above the track still reads
   "Effort" (cli_inner_pretty.js:527360).

2. **A 5-position track** — `low / medium / high / xhigh / max`
   (`BASE_SLIDER_LEVELS` `T8q`, cli_inner_pretty.js:527555-527561) — with a
   **"burns fastest" hint** that appears under `high` only for Pro-tier users
   when the `tengu_slate_finch` gate is on (`getEffortDescriptionWithBurnHint`
   `YP6`, cli_inner_pretty.js:184978-184986). When workflows are enabled, a
   **6th `ultracode` rail** is appended (`getSliderGeometry` `mr4`,
   cli_inner_pretty.js:527106-527121).

3. **Capability tags** annotate the levels that not every model can reach:
   `xhigh` carries `"Opus 4.8/4.7 only"` (`_P6`, cli_inner_pretty.js:184993) and
   `max` carries `"Opus 4.6+, Sonnet 4.6"` (`a$7`, cli_inner_pretty.js:184994).
   These flow into the per-level description (`getEffortDescription` `RL5`,
   cli_inner_pretty.js:184972-184975) and the `/effort` usage help
   (`getEffortHelpText` `eE8`, cli_inner_pretty.js:526905-526906).

The slider has a fancier-than-usual render path: when a ripple is active
(`W` truthy) every label is drawn with `UltraRippleText` (`kF`,
cli_inner_pretty.js:527205-527238) which colors each character by its distance
to a moving ripple origin; otherwise it falls back to plain `<Text>` fragments
(cli_inner_pretty.js:527378-527384).

**Confidence:** *Medium* that this is the same slider component relabeled from
the 2.1.142 effort picker (the 2.1.142 reference doc describes the same
5-position slider with env-reflected initial position; same geometry constants,
same `findIndex(value === level)` initial-index pattern). The **Faster/Smarter
wording is NEW** — v2.1.88 had no visual slider at all (only `EffortCallout.tsx`
text UI and a 4-value `['low','medium','high','max']` enum with no `xhigh`); see
[Cross-validation](#cross-validation-against-v2188).

---

## 1. The end-label relabel: Faster / Smarter

### 1.1 What renders

The slider header and the end labels are emitted inside `EffortPickerSlider`
(`K3z`). The header literally says "Effort"; the two ends say "Faster" and
"Smarter":

```javascript
// ============================================
// EffortPickerSlider end labels - "Faster" / "Smarter" with ripple + plain fallback
// Location: cli_inner_pretty.js:527355-527385
// ============================================

// ORIGINAL (for source lookup):
Kq.createElement(
  rL,
  null,
  W
    ? Kq.createElement(kF, {
        text: `${g}Effort${" ".repeat(Math.max(0, Q - U - 6))}`,
        col: -l,
        row: oYz,
        ripple: W,
      })
    : "Effort",
),
// ... (blank spacer row) ...
Kq.createElement(
  p,
  null,
  W
    ? Kq.createElement(kF, { text: `${c}Faster${b}Smarter${r}`, col: -l, row: sYz, ripple: W })
    : Kq.createElement(
        Kq.Fragment,
        null,
        Kq.createElement(k, null, "Faster"),
        Kq.createElement(k, null, b),
        Kq.createElement(k, null, "Smarter"),
      ),
),

// READABLE (for understanding):
createElement(SectionTitle, null,
  rippleActive
    ? createElement(UltraRippleText, {
        text: `${headerPad}Effort${" ".repeat(Math.max(0, columns - leftMargin - 6))}`,
        col: -centerOffset,
        row: ROW_HEADER,           // -2
        ripple: rippleState,
      })
    : "Effort",
);
// ...blank spacer row at ROW_BLANK (-1)...
createElement(Box, null,
  rippleActive
    ? createElement(UltraRippleText, {            // single ripple-colored string
        text: `${centerPad}Faster${midGap}Smarter${rightPad}`,
        col: -centerOffset,
        row: ROW_ENDLABELS,        // 0
        ripple: rippleState,
      })
    : createElement(Fragment, null,               // plain-fragment fallback
        createElement(Text, null, "Faster"),
        createElement(Text, null, midGap),         // b = spaces between the two ends
        createElement(Text, null, "Smarter"),
      ),
);

// Mapping: kF→UltraRippleText, k→Text, p→Box, rL→SectionTitle,
//          W→rippleActive, b→midGap (Y.width-6-7 spaces), c→centerPad, r→rightPad,
//          g→headerPad, l→centerOffset, Q→columns, U→leftMargin,
//          oYz→ROW_HEADER(-2), sYz→ROW_ENDLABELS(0)
```

The `midGap` spacer `b` is `" ".repeat(Y.width - 6 - 7)`
(cli_inner_pretty.js:527332) — `width` minus the length of "Faster" (6) minus
the length of "Smarter" (7) — so the two words bracket the full track width.

### 1.2 The two render paths

There are exactly two code paths, switched on `W` (`rippleActive`):

```
rippleActive (W) truthy
        │
        ├── true  → UltraRippleText (kF): ONE string "${pad}Faster${gap}Smarter${pad}"
        │           drawn with per-character ripple colors at row sYz (0)
        │
        └── false → Fragment: <Text>Faster</Text><Text>{gap}</Text><Text>Smarter</Text>
                    plain, uncolored, three flat nodes
```

`rippleActive` is only true when the cursor is parked on the `ultracode` rail and
a ripple animation is in flight:

```javascript
// ============================================
// EffortPickerSlider ripple activation - only for ultracode rail
// Location: cli_inner_pretty.js:527292-527298
// ============================================

// ORIGINAL (for source lookup):
X = Y.levels[O].value === "ultracode",
[, L] = $A(X && j === null ? iYz : null),
P = cl.useRef(null);
if (!X) P.current = null;
else if (P.current === null) P.current = L;
let Z = X ? L - (P.current ?? L) : 0,
  W = X ? { travel: Z * rYz, originCol: Y.trianglePositions[O] } : null,

// READABLE (for understanding):
const onUltracodeRail = geometry.levels[index].value === "ultracode";
const [, animTick] = useAnimationFrame(onUltracodeRail && pendingConfirm === null ? FRAME_MS : null);  // iYz=80
const rippleStartRef = useRef(null);
if (!onUltracodeRail) rippleStartRef.current = null;
else if (rippleStartRef.current === null) rippleStartRef.current = animTick;
const elapsed = onUltracodeRail ? animTick - (rippleStartRef.current ?? animTick) : 0;
const rippleState = onUltracodeRail
  ? { travel: elapsed * RIPPLE_SPEED, originCol: geometry.trianglePositions[index] }  // rYz=0.03
  : null;            // ← W: null unless on ultracode rail ⇒ plain fallback otherwise

// Mapping: X→onUltracodeRail, O→index, L→animTick, j→pendingConfirm, $A→useAnimationFrame,
//          iYz→FRAME_MS(80), rYz→RIPPLE_SPEED(0.03), W→rippleState, P→rippleStartRef,
//          Y.trianglePositions→triangle column positions
```

So in everyday use (cursor on low/medium/high/xhigh/max), `rippleState` is
`null` and the **plain three-node fragment** renders "Faster …spaces… Smarter".
The ripple path only lights up the violet "ultracode" easter-egg rail.

### 1.3 UltraRippleText — how the ripple colors characters

When the ripple path is taken, each character of the string is colored by its
distance to a moving origin column. `UltraRippleText` (`kF`) walks the string,
computes a ripple "level" per character via `rippleDistance` (`Ur4`) →
`rippleLevel` (`Fr4`), and coalesces runs of equal level into spans:

```javascript
// ============================================
// UltraRippleText - per-character ripple-colored text
// Location: cli_inner_pretty.js:527194-527238
// ============================================

// ORIGINAL (for source lookup):
function Ur4(H, $, q) {
  let K = H - q,
    _ = ($ - $y$) * 2;
  return Math.sqrt(K * K + _ * _);
}
function Fr4(H, $) {
  if (H > $.travel) return null;
  let q = (((H - $.travel) % tE8) + tE8) % tE8,
    K = (1 + Math.cos((2 * Math.PI * q) / tE8)) / 2;
  return Math.min(qy$.length - 1, Math.round(K * (qy$.length - 1)));
}
function kF(H) {
  let { text: q, col: K, row: _, ripple: z, dimColor: A, bold: Y, coveredColor: f } = H, O;
  // ...build O = runs of {text, level}...
  let j = 0;
  for (let w of q) {
    let D = Fr4(Ur4(K + j, _, z.originCol), z), J = O.at(-1);
    if (J && J.level === D) J.text = J.text + w;
    else O.push({ text: w, level: D });
    j++;
  }
  // ...render each run: level===null → dim/plain; else colored with qy$[level]...
  return Kq.createElement(k, null, O.map((j, w) =>
    j.level === null
      ? Kq.createElement(k, { key: w, dimColor: A, bold: Y }, j.text)
      : Kq.createElement(k, { key: w, backgroundColor: qy$[j.level], color: f ?? k8q, bold: Y }, j.text)));
}

// READABLE (for understanding):
function rippleDistance(charCol, row, originCol) {
  const dx = charCol - originCol;
  const dy = (row - ROW_TICKS) * 2;        // $y$ = 2; ×2 to correct for cell aspect ratio
  return Math.sqrt(dx * dx + dy * dy);
}
function rippleLevel(distance, ripple) {
  if (distance > ripple.travel) return null;            // ripple hasn't reached here yet
  const phase = (((distance - ripple.travel) % RIPPLE_PERIOD) + RIPPLE_PERIOD) % RIPPLE_PERIOD; // tE8=20
  const cos01 = (1 + Math.cos((2 * Math.PI * phase) / RIPPLE_PERIOD)) / 2;  // 0..1 cosine wave
  return Math.min(RIPPLE_RAMP.length - 1, Math.round(cos01 * (RIPPLE_RAMP.length - 1)));
}
function UltraRippleText({ text, col, row, ripple, dimColor, bold, coveredColor }) {
  const runs = [];
  let i = 0;
  for (const ch of text) {
    const level = rippleLevel(rippleDistance(col + i, row, ripple.originCol), ripple);
    const last = runs.at(-1);
    if (last && last.level === level) last.text += ch;   // coalesce equal-color runs
    else runs.push({ text: ch, level });
    i++;
  }
  return createElement(Text, null, runs.map((run, k) =>
    run.level === null
      ? createElement(Text, { key: k, dimColor, bold }, run.text)               // outside wavefront
      : createElement(Text, { key: k, backgroundColor: RIPPLE_RAMP[run.level], color: coveredColor ?? WHITE, bold }, run.text)));
}

// Mapping: Ur4→rippleDistance, Fr4→rippleLevel, kF→UltraRippleText,
//          $y$→ROW_TICKS(2), tE8→RIPPLE_PERIOD(20), qy$→RIPPLE_RAMP, k8q→WHITE,
//          f→coveredColor, z→ripple
```

`RIPPLE_RAMP` (`qy$`) is an 8-color violet gradient computed once from RGB
`(62,22,118)` → `(140,80,240)` (cli_inner_pretty.js:527563-527569). The cosine
term makes the band pulse rather than fade monotonically — it produces a moving
ring. Characters beyond `ripple.travel` get `level === null` and render dim
(the wavefront hasn't reached them). This is a pure cosmetic flourish for the
`ultracode` rail; the *meaning* of the slider is entirely in the label text.

---

## 2. Slider geometry and the 5 levels

### 2.1 The base levels and geometry

The base ladder is five fixed ticks. Each has a `value`, a display `label`, and
a `color` keyword that `LevelLabelRenderer` (`lYz`) maps to a rendering style:

```javascript
// ============================================
// BASE_SLIDER_LEVELS / geometry constants - the 5-position effort ladder
// Location: cli_inner_pretty.js:527507-527561
// ============================================

// ORIGINAL (for source lookup):
O6$ = 42,            // base track width
cYz = 3,             // DEFAULT_SLIDER_INDEX = xhigh
...
((Ir4 = [1, 10, 20, 30, 40]),       // triangle (caret) column per level
  (G8q = [5, 5, 5, 6]),             // spacer widths between labels
  (T8q = [
    { value: "low",    label: "low",    color: "warning" },
    { value: "medium", label: "medium", color: "success" },
    { value: "high",   label: "high",   color: "permission" },
    { value: "xhigh",  label: "xhigh",  color: "autoAccept-shimmer" },
    { value: "max",    label: "max",    color: "rainbow-animated" },
  ]));

// READABLE (for understanding):
const BASE_TRACK_WIDTH = 42;
const DEFAULT_SLIDER_INDEX = 3;             // opens on "xhigh"
const BASE_TRIANGLE_POSITIONS = [1, 10, 20, 30, 40];
const BASE_SPACERS = [5, 5, 5, 6];
const BASE_SLIDER_LEVELS = [
  { value: "low",    label: "low",    color: "warning" },        // amber tick
  { value: "medium", label: "medium", color: "success" },        // green tick
  { value: "high",   label: "high",   color: "permission" },     // blue tick
  { value: "xhigh",  label: "xhigh",  color: "autoAccept-shimmer" }, // shimmering tick
  { value: "max",    label: "max",    color: "rainbow-animated" },   // rainbow tick
];

// Mapping: O6$→BASE_TRACK_WIDTH, cYz→DEFAULT_SLIDER_INDEX, Ir4→BASE_TRIANGLE_POSITIONS,
//          G8q→BASE_SPACERS, T8q→BASE_SLIDER_LEVELS
```

`getSliderGeometry` (`mr4`) returns the layout. Crucially, when workflows are
available (`ultracodeAvailable` `Vx`), it **appends a 6th `ultracode` rail** and
widens the track; otherwise it returns the plain 5-tick geometry:

```javascript
// ============================================
// getSliderGeometry - 5-tick base, optional 6th ultracode rail
// Location: cli_inner_pretty.js:527105-527131
// ============================================

// ORIGINAL (for source lookup):
function mr4() {
  if (Vx()) {
    let K = O6$ + 3, _ = 17,
      z = [...T8q, { value: "ultracode", label: "ultracode", color: "violet-ripple" }],
      A = K + Math.floor(4), Y = [...G8q, A - O6$];
    return {
      levels: z, width: K + 17,
      trianglePositions: [...Ir4, K + Math.floor(8.5)],
      labelStarts: Cr4(z, Y), spacers: Y,
      trackChars: "─".repeat(O6$ + 1) + "┆" + "─".repeat(18),
      accentStart: O6$ + 2,
      sublabel: { text: "xhigh + workflows", start: K },
    };
  }
  return {
    levels: T8q, width: O6$, trianglePositions: Ir4,
    labelStarts: Cr4(T8q, G8q), spacers: G8q,
    trackChars: "─".repeat(O6$),
  };
}

// READABLE (for understanding):
function getSliderGeometry() {
  if (ultracodeAvailable()) {
    const railStart = BASE_TRACK_WIDTH + 3;     // ultracode rail begins past a separator
    const levels = [...BASE_SLIDER_LEVELS,
      { value: "ultracode", label: "ultracode", color: "violet-ripple" }];
    const spacers = [...BASE_SPACERS, railStart + 4 - BASE_TRACK_WIDTH];
    return {
      levels,
      width: railStart + 17,
      trianglePositions: [...BASE_TRIANGLE_POSITIONS, railStart + Math.floor(8.5)],
      labelStarts: computeLabelStarts(levels, spacers),
      spacers,
      trackChars: "─".repeat(BASE_TRACK_WIDTH + 1) + "┆" + "─".repeat(18),  // dotted separator before rail
      accentStart: BASE_TRACK_WIDTH + 2,
      sublabel: { text: "xhigh + workflows", start: railStart },
    };
  }
  return {
    levels: BASE_SLIDER_LEVELS,
    width: BASE_TRACK_WIDTH,
    trianglePositions: BASE_TRIANGLE_POSITIONS,
    labelStarts: computeLabelStarts(BASE_SLIDER_LEVELS, BASE_SPACERS),
    spacers: BASE_SPACERS,
    trackChars: "─".repeat(BASE_TRACK_WIDTH),
  };
}

// Mapping: mr4→getSliderGeometry, Vx→ultracodeAvailable, Cr4→computeLabelStarts,
//          O6$→BASE_TRACK_WIDTH, T8q→BASE_SLIDER_LEVELS, G8q→BASE_SPACERS, Ir4→BASE_TRIANGLE_POSITIONS
```

ASCII picture of the rendered slider (no ultracode, cursor on xhigh = default
index 3):

```
                       Effort
Faster                                                  Smarter
                              ▲
        ──────────────────────────────────────────
    low      medium      high      xhigh      max
                                   ^^^^^ (selected, shimmer)
        Deeper reasoning than high, just below maximum (Opus 4.8/4.7 only)
```

With workflows enabled, a dotted `┆` separator and a violet `ultracode` rail are
appended on the right, plus a `xhigh + workflows` sublabel:

```
        ───────────────────────────────────────────┆──────────────────
    low   medium   high   xhigh   max               ultracode
                                                     xhigh + workflows
```

### 2.2 The "burns fastest" hint on `high`

The per-level description text is produced by `getEffortDescription` (`RL5`),
then `getEffortDescriptionWithBurnHint` (`YP6`) appends a warning **only** for
`high`, **only** for Pro-tier users, and **only** when the `tengu_slate_finch`
feature gate is on:

```javascript
// ============================================
// getEffortDescriptionWithBurnHint - appends "burns fastest" only on high+Pro+gate
// Location: cli_inner_pretty.js:184964-184986
// ============================================

// ORIGINAL (for source lookup):
function RL5(H) {
  switch (H) {
    case "low":    return "Quick, straightforward implementation with minimal overhead";
    case "medium": return "Balanced approach with standard implementation and testing";
    case "high":   return "Comprehensive implementation with extensive testing and documentation";
    case "xhigh":  return `Deeper reasoning than high, just below maximum (${_P6})`;
    case "max":    return "Maximum capability with deepest reasoning";
  }
}
function YP6(H) {
  if (typeof H === "string") {
    let $ = RL5(H);
    if (H === "high" && R4H() && V$("tengu_slate_finch", !1))
      return `${$} \xB7 burns fastest — medium handles most tasks`;
    return $;
  }
  return "Balanced approach with standard implementation and testing";
}

// READABLE (for understanding):
function getEffortDescription(level) {
  switch (level) {
    case "low":    return "Quick, straightforward implementation with minimal overhead";
    case "medium": return "Balanced approach with standard implementation and testing";
    case "high":   return "Comprehensive implementation with extensive testing and documentation";
    case "xhigh":  return `Deeper reasoning than high, just below maximum (${XHIGH_CAPABILITY_TAG})`;
    case "max":    return "Maximum capability with deepest reasoning";
  }
}
function getEffortDescriptionWithBurnHint(level) {
  if (typeof level === "string") {
    const base = getEffortDescription(level);
    if (level === "high" && isProTier() && featureGate("tengu_slate_finch", false))
      return `${base} · burns fastest — medium handles most tasks`;
    return base;
  }
  return "Balanced approach with standard implementation and testing";  // numeric/unknown → medium prose
}

// Mapping: RL5→getEffortDescription, YP6→getEffortDescriptionWithBurnHint,
//          R4H→isProTier, V$→featureGate, _P6→XHIGH_CAPABILITY_TAG
```

`isProTier` (`R4H`) is just `_4() === "pro"` (cli_inner_pretty.js:131611-131613)
— rate-limit tier equals "pro". The hint deliberately steers Pro users away from
`high` (which on Opus 4.8 burns thinking budget fastest) toward `medium`.

---

## 3. Capability tags: `_P6` (xhigh) and `a$7` (max)

Two string constants annotate which models can actually reach the top two
levels. They are defined together right after `getDefaultEffortForModel`:

```javascript
// ============================================
// Capability tags - XHIGH_CAPABILITY_TAG / MAX_EFFORT_CAPABILITY_TAG
// Location: cli_inner_pretty.js:184992-184994
// ============================================

// ORIGINAL (for source lookup):
var dN,
  _P6 = "Opus 4.8/4.7 only",
  a$7 = "Opus 4.6+, Sonnet 4.6",
  s$7;

// READABLE (for understanding):
let EFFORT_LEVELS_WITH_MAX;                     // = ["low","medium","high","xhigh","max"], set in cA()
const XHIGH_CAPABILITY_TAG = "Opus 4.8/4.7 only";
const MAX_EFFORT_CAPABILITY_TAG = "Opus 4.6+, Sonnet 4.6";
let EFFORT_ALIAS_MAP;                           // = { med: "medium" }, set in cA()

// Mapping: dN→EFFORT_LEVELS_WITH_MAX, _P6→XHIGH_CAPABILITY_TAG, a$7→MAX_EFFORT_CAPABILITY_TAG, s$7→EFFORT_ALIAS_MAP
```

These two tags are the *documentation* side of the *capability gates*:

- `_P6` ("Opus 4.8/4.7 only") matches `modelSupportsXhighEffort` (`ycH`), which
  returns `true` **only** for `claude-opus-4-8` and `claude-opus-4-7`
  (cli_inner_pretty.js:184850) and `false` for everything else including Opus 4.6
  and Sonnet 4.6 (cli_inner_pretty.js:184838-184849).
- `a$7` ("Opus 4.6+, Sonnet 4.6") matches `modelSupportsMaxEffort` (`ow$`), which
  returns `true` for `claude-opus-4-8/4-7/4-6` and `claude-sonnet-4-6`
  (cli_inner_pretty.js:184830-184831).

So `xhigh` is the *narrowest* level (newest Opus only), while `max` is *broader*
(it predates xhigh — Opus 4.6 and Sonnet 4.6 support max but not xhigh). This
inversion is why both tags exist and read differently.

Where they surface:

1. **xhigh slider description** — `${_P6}` is interpolated into the `xhigh`
   description string (cli_inner_pretty.js:184973).
2. **`/effort` usage help** — both tags appear in the help text
   (`getEffortHelpText` `eE8`, cli_inner_pretty.js:526905-526906):

```javascript
// ============================================
// getEffortHelpText - /effort usage text with capability tags + ultracode line
// Location: cli_inner_pretty.js:526897-526914
// ============================================

// ORIGINAL (for source lookup):
function eE8() {
  return (
    `Usage: /effort [low|medium|high|xhigh|max${Vx() ? "|ultracode" : ""}|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- xhigh: Extended reasoning with thorough analysis (${_P6})
- max: Maximum capability with deepest reasoning (${a$7})
` +
    (Vx() ? `- ultracode: xhigh + dynamic workflow orchestration (this session only)
` : "") +
    "- auto: Use the default effort level for your model"
  );
}

// READABLE (for understanding):
function getEffortHelpText() {
  return `Usage: /effort [low|medium|high|xhigh|max${ultracodeAvailable() ? "|ultracode" : ""}|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- xhigh: Extended reasoning with thorough analysis (${XHIGH_CAPABILITY_TAG})
- max: Maximum capability with deepest reasoning (${MAX_EFFORT_CAPABILITY_TAG})
`
    + (ultracodeAvailable() ? "- ultracode: xhigh + dynamic workflow orchestration (this session only)\n" : "")
    + "- auto: Use the default effort level for your model";
}

// Mapping: eE8→getEffortHelpText, Vx→ultracodeAvailable, _P6→XHIGH_CAPABILITY_TAG, a$7→MAX_EFFORT_CAPABILITY_TAG
```

The `ultracode` line and the `|ultracode` usage token only appear when
`ultracodeAvailable()` is true.

---

## 4. Model-menu effort integration

The model picker (`/model`) also drives effort. When the user changes the effort
inside the model menu, `applyModelMenuEffort` (`mH`) runs. It emits the
`tengu_model_command_menu_effort` telemetry event and branches on whether the
chosen value is `ultracode`:

```javascript
// ============================================
// applyModelMenuEffort - model-menu effort apply; ultracode → xhigh+ultracode latch
// Location: cli_inner_pretty.js:460906-460921
// ============================================

// ORIGINAL (for source lookup):
function mH(p$) {
  if ((d("tengu_model_command_menu_effort", { effort: v }), v === "ultracode" && P && !M)) (SI(), j(Pi_));
  else if (!M && P) {
    let e$ = t$7(v === "ultracode" ? "xhigh" : v, vo6(p$), S8("userSettings")?.effortLevel, P),
      a$ = pjH(e$);
    if (a$ !== void 0) p6("userSettings", { effortLevel: a$ });
    (SI(), j((BH) => ({ ...BH, effortValue: e$, ultracode: !1 })));
  }
  let i$ = QV8(p$),
    A8 = P && i$ && A2(i$) && v !== "ultracode" ? v : void 0;
  if (p$ === _N$) { _(null, A8); return; }
  _(p$, A8);
}

// READABLE (for understanding):
function applyModelMenuEffort(selectedModelOption) {
  emitTelemetry("tengu_model_command_menu_effort", { effort: chosenEffort });

  if (chosenEffort === "ultracode" && effortControlVisible && !skipPersist) {
    // ultracode → set the launch-latch and set AppState {effortValue:"xhigh", ultracode:true}
    unpinOpusLaunchEffortLatch();
    setAppState(setUltracodeAppState);          // Pi_: {...s, effortValue:"xhigh", ultracode:true}
  } else if (!skipPersist && effortControlVisible) {
    // Non-ultracode: collapse ultracode→xhigh, persist if it differs from the model default
    const resolved = resolvePickerEffortPersistence(
      chosenEffort === "ultracode" ? "xhigh" : chosenEffort,
      getModelDefaultEffort(selectedModelOption),
      getSettingsForSource("userSettings")?.effortLevel,
      effortControlVisible,
    );
    const persistable = toPersistableEffort(resolved);
    if (persistable !== undefined) writeSettings("userSettings", { effortLevel: persistable });
    unpinOpusLaunchEffortLatch();
    setAppState(s => ({ ...s, effortValue: resolved, ultracode: false }));   // ← resets ultracode
  }

  // Pass an effort override forward ONLY for non-ultracode values on effort-capable models
  const modelId = resolveOptionModelId(selectedModelOption);
  const effortOverride =
    effortControlVisible && modelId && modelSupportsEffort(modelId) && chosenEffort !== "ultracode"
      ? chosenEffort : undefined;

  if (selectedModelOption === SENTINEL_CLEAR) { onSelect(null, effortOverride); return; }
  onSelect(selectedModelOption, effortOverride);
}

// Mapping: mH→applyModelMenuEffort, d→emitTelemetry, v→chosenEffort, P→effortControlVisible,
//          M→skipPersist, SI→unpinOpusLaunchEffortLatch, Pi_→setUltracodeAppState,
//          t$7→resolvePickerEffortPersistence, vo6→getModelDefaultEffort, pjH→toPersistableEffort,
//          p6→writeSettings, S8→getSettingsForSource, QV8→resolveOptionModelId,
//          A2→modelSupportsEffort, _N$→SENTINEL_CLEAR, _→onSelect
```

The reducer that ultracode installs:

```javascript
// ============================================
// setUltracodeAppState - reducer that pins xhigh + ultracode
// Location: cli_inner_pretty.js:461114-461116
// ============================================

// ORIGINAL (for source lookup):
function Pi_(H) {
  return { ...H, effortValue: "xhigh", ultracode: !0 };
}

// READABLE (for understanding):
function setUltracodeAppState(appState) {
  return { ...appState, effortValue: "xhigh", ultracode: true };
}

// Mapping: Pi_→setUltracodeAppState
```

### 4.1 best / model switches reset ultracode

The key behavioral contract: **switching model or effort away from ultracode
resets `ultracode: false`.** In the non-ultracode branch, the reducer is
`s => ({ ...s, effortValue: resolved, ultracode: false })`
(cli_inner_pretty.js:460912). So picking any concrete effort or model in the
menu clears the standing-orchestration flag. Only the explicit `ultracode`
choice re-arms it (via `setUltracodeAppState`, cli_inner_pretty.js:460907).

This mirrors the slash-command path `executeEffort` (`$y8`) consumed by the
`/effort` command runner: it sets `{ effortValue, ultracode }` together
(cli_inner_pretty.js:527586-527591), and `parseEffortArg` (`xYz`) maps the
literal `"ultracode"` arg back to `{ value: "xhigh" }` while the `ultracode`
boolean is tracked separately (cli_inner_pretty.js:526918).

### 4.2 The fast-mode notice in the model menu

Right under the model list, the menu shows a fast-mode notice. When fast mode is
on it warns that switching models turns it off; otherwise it advertises `/fast`:

```javascript
// ============================================
// Model-menu fast-mode notice - "Switching to other models turns off fast mode"
// Location: cli_inner_pretty.js:461044-461068
// ============================================

// ORIGINAL (for source lookup):
"Fast mode is ", L9.createElement(k, { bold: !0 }, "ON"),
" and available with", " ", uB(),
" (/fast). Switching to other models turns off fast mode.",
// ...else branch...
"Use ", L9.createElement(k, { bold: !0 }, "/fast"),
" to turn on Fast mode (", uB(), ").",

// READABLE (for understanding):
// fast mode ON:
`Fast mode is ON and available with ${getFastModeModelLabel()} (/fast). Switching to other models turns off fast mode.`
// fast mode available but OFF (jZ() && !Ee()):
`Use /fast to turn on Fast mode (${getFastModeModelLabel()}).`

// Mapping: uB→getFastModeModelLabel, k→Text
```

`getFastModeModelLabel` (`uB`) returns the fast-mode model name ("Opus 4.8" or
the legacy 4.6 label under the deprecated override), defined at
cli_inner_pretty.js:98243-98245.

---

## 5. The `ultracode` gate `Vx()`

The `ultracode` rail, help line, and usage token all hinge on
`ultracodeAvailable` (`Vx`):

```javascript
// ============================================
// ultracodeAvailable - workflows enabled AND model supports xhigh
// Location: cli_inner_pretty.js:184853-184855
// ============================================

// ORIGINAL (for source lookup):
function Vx(H) {
  return NZ() && (H === void 0 || ycH(H));
}

// READABLE (for understanding):
function ultracodeAvailable(model) {
  return workflowsEnabled() && (model === undefined || modelSupportsXhighEffort(model));
}

// Mapping: Vx→ultracodeAvailable, NZ→workflowsEnabled, ycH→modelSupportsXhighEffort
```

`workflowsEnabled` (`NZ`) requires the `allow_workflows` capability, a non-pro
default-on (or explicit settings flag), and no hard disable
(cli_inner_pretty.js:184757-184763). So `ultracode` is fundamentally a
*workflow* feature surfaced through the effort UI: it is **xhigh effort + standing
dynamic-workflow orchestration for the session**. When workflows are off, the
slider is the plain 5-tick ladder and `/effort` lists only `low…max|auto`.

The confirm handler in the slider treats `ultracode` as `xhigh` for the actual
effort value while preserving the ultracode flag for the confirmation dialog
(cli_inner_pretty.js:527309-527322): `o.value === "ultracode" ? "xhigh" : o.value`.

---

## Why this approach

### Why "Faster / Smarter" instead of "Speed / Intelligence"?

**What:** The two end labels changed from *Speed / Intelligence* to
*Faster / Smarter* (cli_inner_pretty.js:527381-527383).

**Why it's clearer for a thinking-time slider:**

1. **Comparatives describe a direction, nouns describe a category.** The control
   is a *continuum* you drag. "Faster" and "Smarter" are comparative adjectives —
   they read as *"drag this way to get faster, that way to get smarter."* "Speed"
   and "Intelligence" are abstract nouns that label *qualities*, not *directions*,
   so they don't tell the user what dragging *does*.

2. **"Intelligence" overclaims and risks a false dichotomy.** "Speed vs
   Intelligence" implies low effort makes the model *dumber*. That's misleading:
   the model is the same; only the *thinking budget* changes. "Faster vs Smarter"
   frames it honestly as a *tradeoff in how long it thinks*, not a change in raw
   capability. The model at low effort is still smart — it just answers faster.

3. **It pairs naturally with the warning copy.** The "burns fastest — medium
   handles most tasks" hint and the per-level prose ("Quick…", "Comprehensive…",
   "Deeper reasoning…") are all about *how much work the model does*, i.e. speed
   vs depth. "Faster/Smarter" is consistent with that vocabulary;
   "Speed/Intelligence" sat at a different level of abstraction.

4. **Parallelism.** "Faster" and "Smarter" are both single comparative
   adjectives of similar length (6 vs 7 chars) and grammatical form, so they
   balance visually at the two ends of the track. "Speed" (noun) vs
   "Intelligence" (noun, much longer) was lopsided.

### Why annotate xhigh/max with capability tags rather than hide them?

**What:** xhigh and max are always shown on the slider/help, tagged
"Opus 4.8/4.7 only" / "Opus 4.6+, Sonnet 4.6" rather than removed when the
current model can't reach them.

**Why:**

- The tags *teach* the model→capability relationship: a user on Sonnet seeing
  "xhigh (Opus 4.8/4.7 only)" learns that switching to Opus unlocks deeper
  reasoning. Hiding it would make the feature undiscoverable.
- The actual safety net is `resolveAppliedEffort` (`or`), which **clamps**:
  `if (z === "xhigh" && !ycH(model)) return "high"` and
  `if (z === "max" && !ow$(model)) return "high"` (cli_inner_pretty.js:184916-184917).
  So selecting an unreachable level on the wrong model silently degrades to
  `high` — the UI can afford to be permissive because resolution is defensive.

### Why does ultracode live on the effort slider at all?

**What:** `ultracode` is appended as a 6th rail on the *effort* slider, not as a
separate command, and it sets `effortValue:"xhigh"` plus a session `ultracode`
flag.

**Why:**

- Mechanically, ultracode *is* xhigh effort — it reuses the entire effort
  resolution pipeline (`parseEffortArg`/`resolveAppliedEffort` treat it as xhigh).
  The only addition is the standing dynamic-workflow orchestration directive.
  Surfacing it where users already pick "how hard to think" matches the mental
  model: ultracode is "think as hard as possible *and* coordinate workflows."
- Gating it on `workflowsEnabled()` keeps the slider clean for users who don't
  have workflows — they never see a confusing extra rail.
- Making model/effort switches reset `ultracode:false`
  (cli_inner_pretty.js:460912) keeps the standing-orchestration flag from leaking
  across a deliberate model change — a model switch is a fresh intent.

### Why the ripple flourish only on the ultracode rail?

**What:** `UltraRippleText` only activates when the cursor is on `ultracode`;
everywhere else the plain `<Text>` fragments render.

**Why:** It's a deliberate "premium feature" signal. ultracode is the
heavyweight, session-only, workflow-orchestrating mode; the violet animated
ripple visually distinguishes it from the everyday low→max ladder without adding
cost (the animation frame loop only runs `onUltracodeRail`,
cli_inner_pretty.js:527293). For all normal interactions there is zero animation
overhead.

---

## Key insight

The Faster/Smarter relabel is small in code (two string literals) but it
reframes the *entire* control. The slider was always a **thinking-budget knob** —
`resolveAppliedEffort` resolves a level, and the level maps to how many thinking
tokens the model spends. Naming the ends *Speed* and *Intelligence* implied the
slider trades *capability* for *latency*; naming them *Faster* and *Smarter*
correctly implies it trades *latency* for *depth of reasoning on the same model*.
The rest of the picker's vocabulary (per-level prose, the "burns fastest" hint,
the capability tags) was already built around "how much work does it do"; the
relabel finally makes the headline labels agree with the body copy.

Architecturally, the picker is a thin **view** over a defensive **resolver**:
the UI shows every level (with capability tags) and lets the user pick anything,
while `resolveAppliedEffort` (`or`) + the `modelSupports*Effort` predicates do
the real gating and silently clamp impossible selections to `high`. That split
is what lets the slider stay simple and educational instead of dynamically
hiding ticks per model.

---

## Cross-validation against v2.1.88

**Confidence: medium** for "same slider, relabeled"; **the Faster/Smarter
wording is NEW** with no v2.1.88 precursor.

| Aspect | v2.1.88 | v2.1.156 | Δ |
|--------|---------|----------|---|
| Effort enum | `['low','medium','high','max']` (`src/utils/effort.ts:14-18`) — no `xhigh` | `["low","medium","high","xhigh","max"]` (`dN`, cli_inner_pretty.js:185009) | `xhigh` added |
| `max` eligibility | "Opus 4.6 only for public models" (`src/utils/effort.ts:52`) | `modelSupportsMaxEffort` = Opus 4.8/4.7/4.6 + Sonnet 4.6 (cli_inner_pretty.js:184830-184831); tag `a$7`="Opus 4.6+, Sonnet 4.6" | broadened |
| `xhigh` eligibility | n/a (no xhigh) | Opus 4.8/4.7 only (`ycH`, cli_inner_pretty.js:184850; tag `_P6`) | NEW |
| Visual slider | none — `EffortCallout.tsx` / `EffortIndicator.ts` text UI only | full geometry slider (`getSliderGeometry` `mr4`) | NEW slider |
| End labels | none (no slider) | "Faster" / "Smarter" (cli_inner_pretty.js:527381-527383) | NEW wording |
| ultracode | none | 6th rail gated on `Vx()` / workflows (cli_inner_pretty.js:527106-527121) | NEW |
| Default effort | model-default param | Opus 4.8→high, 4.7→xhigh (`q48`, cli_inner_pretty.js:184987-184991) | evolved |

v2.1.88's `src/components/ModelPicker.tsx` already had `resolvePickerEffortPersistence`
(cli_inner_pretty.js's `t$7` at 460909) and `getDefaultEffortLevelForOption`
(`vo6`) — so the **model-menu effort plumbing is a direct descendant** (high
confidence). The **visual slider with Speed/Intelligence labels** was introduced
*between* 2.1.88 and 2.1.142 (the 2.1.142 `effort_picker_env_var.md` reference
documents the same 5-position slider with the same `findIndex(value === level)`
initial-index pattern and a `DEFAULT_SLIDER_INDEX = 3 (xhigh)`), and the
**Faster/Smarter relabel** is the 2.1.154/156 change documented here.

---

## Appendix: how the slider initial index is computed (2.1.156)

The 2.1.156 `EffortPickerSlider` (`K3z`) computes its opening position with full
ultracode/env/launch-latch awareness (compare to the 2.1.142 reference's
`py5`/`EffortSliderComponent`):

```javascript
// ============================================
// EffortPickerSlider initial-index - ultracode-aware, env-aware, launch-latch-aware
// Location: cli_inner_pretty.js:527272-527287
// ============================================

// ORIGINAL (for source lookup):
f = cl.useMemo(() => {
  if (ar(z, q, _)) {
    let DH = Y.levels.findIndex((zH) => zH.value === "ultracode");
    if (DH !== -1) return DH;
  }
  let a = W3() ? void 0 : zkH(),
    o = AkH(z) ? void 0 : q,
    $H = a === null ? void 0 : (a ?? o);
  if ($H !== void 0) {
    let DH = Y.levels.findIndex((zH) => zH.value === $H);
    if (DH !== -1) return DH;
  }
  let HH = Ev(z, $H), e = Y.levels.findIndex((DH) => DH.value === HH);
  return e === -1 ? cYz : e;
}, [q, z, Y, _]),

// READABLE (for understanding):
const initialIndex = useMemo(() => {
  // 1. If ultracode is active for this model/effort, open on the ultracode rail.
  if (isUltracodeActive(model, appStateEffort, ultracodeFlag)) {
    const ui = geometry.levels.findIndex(l => l.value === "ultracode");
    if (ui !== -1) return ui;
  }
  // 2. Env override (unless remote); launch-latch suppresses AppState until acked.
  const envOverride = isRemoteRouter() ? undefined : readEnvEffortLevel();
  const appStatePart = isOpusLaunchDefaultActive(model) ? undefined : appStateEffort;
  const effective = envOverride === null ? undefined : (envOverride ?? appStatePart);
  if (effective !== undefined) {
    const i = geometry.levels.findIndex(l => l.value === effective);
    if (i !== -1) return i;
  }
  // 3. Fall back to the model-resolved effort, else DEFAULT_SLIDER_INDEX (=3, xhigh).
  const resolved = resolveEffortLabel(model, effective);
  const i = geometry.levels.findIndex(l => l.value === resolved);
  return i === -1 ? DEFAULT_SLIDER_INDEX : i;
}, [appStateEffort, model, geometry, ultracodeFlag]);

// Mapping: ar→isUltracodeActive, W3→isRemoteRouter, zkH→readEnvEffortLevel,
//          AkH→isOpusLaunchDefaultActive, Ev→resolveEffortLabel, cYz→DEFAULT_SLIDER_INDEX,
//          z→model, q→appStateEffort, _→ultracodeFlag
```

The 2.1.156 additions vs the 2.1.142 reference are step 1 (ultracode rail short
circuit via `isUltracodeActive` `ar`, cli_inner_pretty.js:184856-184858) and the
`isOpusLaunchDefaultActive` latch in step 2 (`AkH`, cli_inner_pretty.js:184896-184900),
which keeps the slider on the model's launch default (`high` for Opus 4.8) until
the user has explicitly acked it. Everything else matches the 2.1.142 env-aware
initial-index algorithm.
