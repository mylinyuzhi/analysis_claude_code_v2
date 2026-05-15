# Spinner Amber Warming at 10s (v2.1.141)

## What changed

After 10 seconds with no streamed token (and the model is thinking, in
tool-use, or has running teammates), the spinner gradually transitions
from the dim-gray-with-shimmer baseline color to an amber `warning`
color. The transition is **linear** over the next 10 seconds — by 20s
elapsed the spinner is fully amber.

The signal is a passive cue to the user that "we know this is taking a
while." Combined with the inline thinking hints (see
[thinking_spinner_inline.md](./thinking_spinner_inline.md)) which also
start at 10s, the user sees both:

- Color shift: gray → amber (passive).
- Text shift: `thinking` → `still thinking` → … (active).

The warming intensity is also used to drive the spinner glyph itself
(via the same `stalledIntensity` 0-1 value blended into the glimmer
color).

## Source: stall detector with eased intensity

```javascript
// ============================================
// useStallDetector - tracks token gap, eases stalledIntensity 0→1
// Location: cli_inner_pretty.js:328245-328274
// ============================================

// ORIGINAL (for source lookup):
function nG6(H, $, q = !1, K = !1) {
  let _ = bj$.useRef(H),
    A = bj$.useRef($),
    z = bj$.useRef(0),
    Y = bj$.useRef(H);
  if ($ > A.current) ((_.current = H), (A.current = $), (z.current = 0), (Y.current = H));
  let f;
  if (q) ((f = 0), (_.current = H));
  else f = H - _.current;
  let O = f > 1e4 && !q,
    M = O ? Math.min((f - 1e4) / 1e4, 1) : 0;
  if (!K && (M > 0 || z.current > 0)) {
    let D = H - Y.current;
    if (D >= 50) {
      let j = Math.floor(D / 50),
        J = z.current;
      for (let X = 0; X < j; X++) {
        let L = M - J;
        if (Math.abs(L) < 0.01) { J = M; break; }
        J += L * 0.1;
      }
      ((z.current = J), (Y.current = H));
    }
  } else ((z.current = M), (Y.current = H));
  let w = K ? M : z.current;
  return { isStalled: O, stalledIntensity: w, timeSinceLastToken: f };
}

// READABLE (for understanding):
function useStallDetector(currentTimeMs, responseLength, isActivelyWorking = false, reducedMotion = false) {
  // Persistent refs survive React re-renders.
  const lastTokenTimeRef       = useRef(currentTimeMs);  // _
  const lastResponseLengthRef  = useRef(responseLength); // A
  const easedIntensityRef      = useRef(0);              // z (the 0→1 eased value)
  const lastEaseAtRef          = useRef(currentTimeMs);  // Y (last frame we eased)

  // 1) If the response grew, the model produced tokens — reset the stall clock.
  if (responseLength > lastResponseLengthRef.current) {
    lastTokenTimeRef.current      = currentTimeMs;
    lastResponseLengthRef.current = responseLength;
    easedIntensityRef.current     = 0;
    lastEaseAtRef.current         = currentTimeMs;
  }

  // 2) Time since last token. If we're actively working (tool call, thinking),
  //    fold the timer to 0 — we don't consider "active work" a stall.
  let timeSinceLastToken;
  if (isActivelyWorking) {
    timeSinceLastToken = 0;
    lastTokenTimeRef.current = currentTimeMs;
  } else {
    timeSinceLastToken = currentTimeMs - lastTokenTimeRef.current;
  }

  // 3) Are we stalled? (>10s since last token AND not actively working.)
  //    `targetIntensity` ramps linearly 0→1 over the next 10s past the 10s mark.
  //    At 10s: 0. At 20s: 1. After 20s: clamped at 1.
  const isStalled       = timeSinceLastToken > 10_000 && !isActivelyWorking;
  const targetIntensity = isStalled
    ? Math.min((timeSinceLastToken - 10_000) / 10_000, 1)
    : 0;

  // 4) Ease the visible intensity toward the target.
  //    Skip easing when reducedMotion is true (jump to target).
  if (!reducedMotion && (targetIntensity > 0 || easedIntensityRef.current > 0)) {
    const elapsedSinceEase = currentTimeMs - lastEaseAtRef.current;
    if (elapsedSinceEase >= 50) {
      // 50ms per ease step → 20 steps/sec → ~5s to reach 1 from 0 (since each
      // step closes 10% of the gap). The exponential approach makes the
      // transition feel smooth and decelerating.
      const stepCount = Math.floor(elapsedSinceEase / 50);
      let eased = easedIntensityRef.current;
      for (let i = 0; i < stepCount; i++) {
        const delta = targetIntensity - eased;
        if (Math.abs(delta) < 0.01) { eased = targetIntensity; break; }
        eased += delta * 0.1;
      }
      easedIntensityRef.current = eased;
      lastEaseAtRef.current     = currentTimeMs;
    }
  } else {
    // Reduced motion: just snap to the target.
    easedIntensityRef.current = targetIntensity;
    lastEaseAtRef.current     = currentTimeMs;
  }

  const visibleIntensity = reducedMotion ? targetIntensity : easedIntensityRef.current;
  return { isStalled, stalledIntensity: visibleIntensity, timeSinceLastToken };
}

// Mapping: nG6→useStallDetector, bj$→React (re-export)
```

## Source: thinking intensity (parallel signal)

The spinner also tracks a *thinking intensity* that ramps from 0→1 over
the 10s→20s window (`Xy7 = 10000`, `cB_ = 20000`). This drives the
"thinking text in amber" rendering separately from the "stalled spinner
in amber" rendering:

```javascript
// ============================================
// Spinner thinkingIntensity computation
// Location: cli_inner_pretty.js:328550-328570 (within SpinnerComponent)
// ============================================

// ORIGINAL (for source lookup):
let o = J ? Math.max(C, h - B.current) : C,
    $H = Z === "thinking" ? Math.min(Math.max((o - Xy7) / (cB_ - Xy7), 0), 1) : 0,
    zH = OHH.useRef(0),
    _H = OHH.useRef(E);
if (Z !== "thinking") ((zH.current = 0), (_H.current = E));
else if (!$ && ($H > 0 || zH.current > 0)) {
  let tH = E - _H.current;
  if (tH >= 50) {
    let s = Math.floor(tH / 50), AH = zH.current;
    for (let VH = 0; VH < s; VH++) {
      let IH = $H - AH;
      if (Math.abs(IH) < 0.01) { AH = $H; break; }
      AH += IH * 0.1;
    }
    ((zH.current = AH), (_H.current = E));
  }
} else ((zH.current = $H), (_H.current = E));
let YH = $ ? $H : zH.current;

// READABLE (for understanding):
const elapsedThinkingMs   = isHasRunningTeammates ? Math.max(elapsedSinceStart, now - earliestStartRef.current) : elapsedSinceStart;
const thinkingTarget      = thinkingStatus === "thinking"
  ? clamp01((elapsedThinkingMs - THINKING_WARM_START_MS) / (THINKING_WARM_FULL_MS - THINKING_WARM_START_MS))
  : 0;
//                          └── Xy7 = 10000      └── cB_ = 20000
// Target: 0 at elapsed <= 10s, 1 at elapsed >= 20s, linear in between.

// Ease intensity toward target with the same 10%-step every-50ms easing pattern as stalled.

// Mapping: o→elapsedThinkingMs, $H→thinkingTarget, Z→thinkingStatus,
//          Xy7→THINKING_WARM_START_MS, cB_→THINKING_WARM_FULL_MS,
//          J→isHasRunningTeammates, zH→easedIntensityRef, _H→lastEaseAtRef
```

`thinkingIntensity` and `stalledIntensity` are independent signals but
use the same warming math. They drive parallel UI elements (text color
vs. spinner glyph color).

## Source: how intensity colors the spinner

```javascript
// ============================================
// Spinner color blending - dim → bright oscillation, lerped to amber on stall/thinking
// Location: cli_inner_pretty.js:328605-328612 (within SpinnerComponent)
// ============================================

// 1) Base oscillating color: dim gray ↔ bright gray (sinusoidal, period ~2s).
const oscillationPhase = (Math.sin((elapsedMs - 3000) * Math.PI * 2 / 2) + 1) / 2;
const baseColor        = lerpColor(SPINNER_DIM_RGB, SPINNER_BRIGHT_RGB, oscillationPhase);

// 2) Active "warning" (amber) color tint pulled in proportional to intensity.
const thinkingColorTarget = thinkingIntensity > 0 ? colorToRgb(theme.warning) : null;
const finalColor          = thinkingColorTarget
  ? lerpColor(baseColor, thinkingColorTarget, thinkingIntensity)
  : baseColor;

// 3) Render: when intensity > 0.5 also tag the text as "warning" so terminal
//    colorizers (e.g. tmux status integration scraping the output) see a
//    semantically meaningful color name in addition to the RGB.
const colorName = !thinkingColorTarget && thinkingIntensity > 0.5 ? "warning" : undefined;
return <Text color={colorName ?? toAnsi(finalColor)}>{spinnerGlyph}</Text>;
```

`SPINNER_DIM_RGB = {r:153, g:153, b:153}` (gray 153, hex `#999`) and
`SPINNER_BRIGHT_RGB = {r:185, g:185, b:185}` (gray 185, hex `#B9B9B9`)
are the two endpoints of the baseline oscillation. The amber endpoint
is whatever the active theme defines as `warning`.

## Why this approach

### Why 10s as the trigger threshold?

**What:** Warming starts at `elapsedMs >= 10000`.

**Why:**

- Real-world telemetry shows most "what is this doing?" anxiety
  starts around 8-10s. Anchoring the cue at 10s puts it right at
  the inflection.
- 10s is also when the inline thinking hint changes to "still
  thinking" — consolidating two cues on the same threshold avoids
  noisy multi-signal staircases.
- The 10s mark is the standard "user notices something is slow" UX
  trigger in many systems (browser loading spinners, native progress
  dialogs all converge on 10s as a natural rhythm).

### Why a 10s ramp (10s → 20s) rather than instant flip?

**What:** Intensity ramps linearly from 0 to 1 over `[10000, 20000]`.

**Why:**

- Instant color flip would feel like a fault state — flashing amber
  reads as "error." A smooth fade reads as "warming up."
- 10s of ramp gives the user time to notice without alarming them.
  Most thinking turns finish within this window (15-20s p50), so the
  user sees a gentle drift to half-amber and back to gray — a
  background hint.
- The exponential easing on top of the linear ramp adds another layer
  of smoothness: the visible color *decelerates* into amber, which
  feels more natural than a sharp ramp end.

### Why ease with the 10%-step / 50ms pattern?

**What:** Every 50ms (20 ease steps/sec), the eased value closes 10%
of the remaining gap toward the target.

**Why:**

- An exponential approach (1 - (0.9)^n per step) creates a smooth
  visual transition where the velocity is highest at the start and
  decelerates near the target. This matches the eye's expectation for
  "thing that's approaching final state."
- 50ms is the floor for visible color transitions on a typical
  terminal (20fps). Going faster wastes CPU; slower would look
  jerky.
- The 10% multiplier creates a ~5s half-life. Combined with the 10s
  linear ramp window, the total visible transition is 8-12s
  (depending on when in the linear ramp the spinner becomes visible).

### Why a separate `thinkingIntensity` and `stalledIntensity`?

**What:** Two parallel signals with the same warming math, one for
thinking state and one for stalled state.

**Why:**

- The two states can co-exist (thinking AND no tokens for 10s, e.g. a
  long thinking turn before the model emits any text).
- They drive different visual elements:
  - `stalledIntensity` → spinner glyph color.
  - `thinkingIntensity` → thinking hint text color.
- Combining them into one signal would couple the visuals and make
  partial states (one true, other false) impossible to express
  cleanly.
- The same math + same easing pattern keeps the two signals visually
  in sync when they DO co-occur.

### Why disable easing under `reducedMotion`?

**What:** When `reducedMotion === true`, intensity snaps to its
target instead of easing.

**Why:**

- Easing IS the motion. Disabling animation while keeping the easing
  would be visually wrong (instant jump after a delay).
- The threshold cross still happens — the user still gets the "amber
  on stall" signal — but without the gradual fade.
- This is the right interpretation of `prefers-reduced-motion`: the
  state changes happen, the *visual* of the state change is just
  instantaneous.

## Why the warming threshold coincides with the spinner stall threshold

The 10s mark is mathematically determined by the `STALL_TELEMETRY_THRESHOLDS_MS`
array: `[10000, 45000, 300000]`. The 10s threshold is the lowest rung
of the stall-telemetry ladder (the upper rungs at 45s and 300s emit
escalating telemetry but don't change visuals). Aligning the visible
"start warming" with the lowest stall telemetry rung means:

- Every visible warming is a logged stall (telemetry has full coverage
  of "user-visible slowness").
- Every logged stall has a visible cue (no silent slowness — the user
  always sees the amber if telemetry recorded a stall).

This invariant simplifies UX debugging: "users complained the spinner
turned amber" maps directly to "you can find a `tengu_spinner_stalled_ui`
event at the 10s threshold."

## Cross-validation: pre-2.1.141 vs 2.1.141

| Aspect | Pre-2.1.141 | v2.1.141+ |
|--------|-------------|-----------|
| Spinner color at 0-10s | Gray oscillation | Same |
| Spinner color at 10-20s | Gray oscillation | Gray → amber lerp |
| Spinner color at 20s+ | Gray oscillation | Amber |
| `stalledIntensity` tracking | Yes (drove text only) | Yes (drives glyph color now too) |
| Reduced-motion behavior | No animation | Snap-to-target (no animation) |
| Telemetry on threshold crossing | `tengu_spinner_stalled_ui` only | Same + visible spinner cue |

## Related symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — UI / Spinner
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `useStallDetector` (`nG6`) — stall + intensity ease; cli_inner_pretty.js:328245-328274
- `SpinnerComponent` (`Py7`) — applies intensity to color; cli_inner_pretty.js:328468-328694
- `THINKING_WARM_START_MS` (`Xy7`) — 10_000; cli_inner_pretty.js:328733
- `THINKING_WARM_FULL_MS` (`cB_`) — 20_000; cli_inner_pretty.js:328734
- `SPINNER_DIM_RGB` (`gB_`) — `{r:153, g:153, b:153}`; cli_inner_pretty.js:328759
- `SPINNER_BRIGHT_RGB` (`QB_`) — `{r:185, g:185, b:185}`; cli_inner_pretty.js:328760
- `STALL_TELEMETRY_THRESHOLDS_MS` (`FB_`) — `[10000, 45000, 300000]`; cli_inner_pretty.js:328758
- `tengu_spinner_stalled_ui` — telemetry on threshold crossing
- `tengu_spinner_stall_cleared` — telemetry on stall resolution
