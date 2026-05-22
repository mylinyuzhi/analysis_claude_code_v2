# Goal Overlay Panel (v2.1.139)

## What it does

When the user types `/goal` (bare, no args) in an interactive session, the host renders a React dialog showing the current goal state. The dialog has three flavors:

1. **Active goal** - shows the condition, elapsed time, turns spent, tokens used, and the last "why not yet" reason if any.
2. **Goal achieved** - shows the achieved condition with final elapsed/turns/tokens stats.
3. **No goal set** - placeholder text guiding the user to set one.

Separately, while a goal is active, the **main UI status bar** shows a `◎ /goal active` badge with the elapsed time appended.

The overlay panel ticks once per second to update the elapsed time while active.

---

## How it works

### 1. The dialog component

The dialog logic lives at `cli_inner_pretty.js:507612` as function `Xk4` (the default export of the lazily-loaded interactive module, surfaced through `WE4.default` as `Hx5` at line 514106):

```javascript
// ============================================
// GoalOverlayPanel - the /goal dialog
// Location: cli_inner_pretty.js:507612-507742
// ============================================

// The component:
// - Takes `messages` (for finding the last achieved goal_status attachment)
// - Reads the current `activeGoal` from app state
// - Renders one of three layouts (active, achieved, none)

// The active-goal layout (line 507620-507675):
// ORIGINAL (for source lookup):
if ((T1(z, _ ? 1000 : null), _)) {
  let w = Date.now() - _.setAt,
    D;
  if ($[2] !== w) ((D = t7(w, { mostSignificantOnly: !0 })), ($[2] = w), ($[3] = D));
  else D = $[3];
  let j = D,
    J = nX() - _.tokensAtStart,
    X;
  if ($[4] !== J) ((X = r9(J)), ($[4] = J), ($[5] = X));
  else X = $[5];
  let L = X,
    P = `running ${j}`,
    Z;
  if ($[6] !== _.iterations)
    ((Z = _.iterations > 0 && `${_.iterations} ${S8(_.iterations, "turn")}`), ($[6] = _.iterations), ($[7] = Z));
  else Z = $[7];
  let W = `${L} tokens`,
    G;
  if ($[8] !== P || $[9] !== Z || $[10] !== W)
    ((G = [P, Z, W].filter(Boolean)), ($[8] = P), ($[9] = Z), ($[10] = W), ($[11] = G));
  else G = $[11];
  let v = G.join(" \xB7 "),
    // ... ESC binding ...
    I;
  if ($[13] !== _.condition)
    ((I = fJ.default.createElement(UF6, { label: "Goal" }, _.condition)), ($[13] = _.condition), ($[14] = I));
  else I = $[14];
  let h;
  if ($[15] !== _.lastReason)
    ((h = _.lastReason ? fJ.default.createElement(UF6, { label: "Last check" }, e_(_.lastReason.trim())) : null),
      ...
}

// READABLE (for understanding):
// _: activeGoal | undefined
// q: messages[]
// K: onCancel callback
// T1: setInterval-equivalent React hook (1000ms when active, otherwise no tick)
if (activeGoal) {
  // Auto-refresh every second to update elapsed time
  setIntervalHook(forceRender, activeGoal ? 1000 : null);
  const elapsedMs = Date.now() - activeGoal.setAt;
  const elapsedLabel = formatDuration(elapsedMs, { mostSignificantOnly: true });
  const tokensDelta = currentTokenCount() - activeGoal.tokensAtStart;
  const tokensLabel = formatThousands(tokensDelta);
  const stats = [
    `running ${elapsedLabel}`,
    activeGoal.iterations > 0 && `${activeGoal.iterations} ${pluralize(activeGoal.iterations, "turn")}`,
    `${tokensLabel} tokens`,
  ].filter(Boolean);
  const subtitle = stats.join(" · ");
  const escapeHint = <KeyHint chord="escape" action="dismiss" />;
  const conditionLine = <LabeledField label="Goal">{activeGoal.condition}</LabeledField>;
  const reasonLine = activeGoal.lastReason
    ? <LabeledField label="Last check">{trimMultiline(activeGoal.lastReason.trim())}</LabeledField>
    : null;
  return (
    <Dialog title={`${ICON_PULSE} Goal active`} subtitle={subtitle} onCancel={onCancel} inputGuide={
      <KeyHints>
        <KeyHint label="/goal clear to stop early" />
        <KeyHint chord="escape" action="dismiss" />
      </KeyHints>
    }>
      <Column>
        {conditionLine}
        {reasonLine}
      </Column>
    </Dialog>
  );
}

// Mapping:
//   T1   -> setIntervalHook,       _     -> activeGoal,
//   nX   -> currentTokenCount,     r9    -> formatThousands,
//   t7   -> formatDuration,        S8    -> pluralize,
//   UF6  -> LabeledField,          N8    -> Dialog,
//   eH   -> KeyHint,               $8    -> KeyHints,
//   vR$  -> ICON_PULSE ("◎" U+25CE)
```

### 2. The achieved-goal layout (line 507676-507729)

```javascript
// ============================================
// GoalOverlayPanel - achieved-goal layout
// Location: cli_inner_pretty.js:507676-507729
// ============================================

// ORIGINAL (for source lookup):
let Y;
if ($[24] !== q || $[25] !== K) {
  Y = Symbol.for("react.early_return_sentinel");
  H: {
    let w = oP4(q);
    if (w) {
      let D = [];
      if (w.durationMs !== void 0) D.push(t7(w.durationMs, { mostSignificantOnly: !0 }));
      if (w.iterations !== void 0) D.push(`${w.iterations} ${S8(w.iterations, "turn")}`);
      if (w.tokens !== void 0) D.push(`${r9(w.tokens)} tokens`);
      let j;
      if ($[27] === Symbol.for("react.memo_cache_sentinel"))
        ((j = fJ.default.createElement(
          k,
          null,
          fJ.default.createElement(Rq, { status: "success", withSpace: !0 }),
          "Goal achieved",
        )),
          ($[27] = j));
      // ... assemble dialog with success styling ...
}

// READABLE (for understanding):
// When no active goal but there is an achieved goal in the transcript:
const lastAchieved = getLastGoalAttachment(messages);
if (lastAchieved) {
  const stats = [];
  if (lastAchieved.durationMs !== undefined) stats.push(formatDuration(lastAchieved.durationMs, { mostSignificantOnly: true }));
  if (lastAchieved.iterations !== undefined) stats.push(`${lastAchieved.iterations} ${pluralize(lastAchieved.iterations, "turn")}`);
  if (lastAchieved.tokens !== undefined) stats.push(`${formatThousands(lastAchieved.tokens)} tokens`);
  const subtitle = stats.join(" · ");
  return (
    <Dialog title={<><StatusGlyph status="success" withSpace /> Goal achieved</>}
            subtitle={subtitle} color="success" onCancel={onCancel}>
      <LabeledField label="Goal">{lastAchieved.condition}</LabeledField>
    </Dialog>
  );
}

// Mapping: oP4 -> getLastGoalAttachment, Rq -> StatusGlyph
```

`getLastGoalAttachment` (`oP4` at `cli_inner_pretty.js:486693-486702`):

```javascript
// ============================================
// getLastGoalAttachment - find the most recent achieved goal_status
// Location: cli_inner_pretty.js:486693-486702
// ============================================

// ORIGINAL (for source lookup):
function oP4(H) {
  for (let $ = H.length - 1; $ >= 0; $--) {
    let q = H[$];
    if (q?.type !== "attachment" || q.attachment.type !== "goal_status") continue;
    let K = q.attachment;
    if (!K.met || K.sentinel) continue;
    return { condition: K.condition, iterations: K.iterations, durationMs: K.durationMs, tokens: K.tokens };
  }
  return null;
}

// READABLE (for understanding):
function getLastGoalAttachment(messages) {
  // Walk messages newest-first
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    // Only consider goal_status attachments
    if (msg?.type !== "attachment" || msg.attachment.type !== "goal_status") continue;
    const att = msg.attachment;
    // Skip sentinels (those are just registration/clear markers, not achieved goals)
    if (!att.met || att.sentinel) continue;
    // Return the stats from the first met-non-sentinel found
    return {
      condition: att.condition,
      iterations: att.iterations,
      durationMs: att.durationMs,
      tokens: att.tokens,
    };
  }
  return null;
}
```

This walks newest-first so the dialog always shows the **most recent** achieved goal, not the first ever.

### 3. The no-goal-set layout (line 507730-507741)

```javascript
// ============================================
// GoalOverlayPanel - empty state
// Location: cli_inner_pretty.js:507730-507741
// ============================================

// ORIGINAL (for source lookup):
let f, O;
if ($[35] === Symbol.for("react.memo_cache_sentinel"))
  ((f = fJ.default.createElement(eH, { chord: "escape", action: "dismiss" })),
    (O = fJ.default.createElement(b4, { hint: "/goal <condition> to set one" }, "No goal set")),
    ($[35] = f),
    ($[36] = O));
else ((f = $[35]), (O = $[36]));
let M;
if ($[37] !== K)
  ((M = fJ.default.createElement(N8, { title: "Goal", onCancel: K, inputGuide: f }, O)), ($[37] = K), ($[38] = M));
else M = $[38];
return M;

// READABLE (for understanding):
return (
  <Dialog
    title="Goal"
    onCancel={onCancel}
    inputGuide={<KeyHint chord="escape" action="dismiss" />}
  >
    <Subtle hint="/goal <condition> to set one">No goal set</Subtle>
  </Dialog>
);
```

### 4. The labeled-field component

```javascript
// ============================================
// LabeledField - the "Label: value" two-column row
// Location: cli_inner_pretty.js:507749-507768
// ============================================

// ORIGINAL (for source lookup):
function UF6(H) {
  let $ = FF6.c(7),
    { label: q, children: K } = H,
    _;
  if ($[0] !== q)
    ((_ = fJ.default.createElement(p, { flexShrink: 0 }, fJ.default.createElement(k, { dimColor: !0 }, q, ": "))),
      ($[0] = q),
      ($[1] = _));
  else _ = $[1];
  let A;
  if ($[2] !== K)
    ((A = fJ.default.createElement(p, { flexGrow: 1 }, fJ.default.createElement(k, { wrap: "wrap" }, K))),
      ($[2] = K),
      ($[3] = A));
  else A = $[3];
  let z;
  if ($[4] !== _ || $[5] !== A)
    ((z = fJ.default.createElement(p, { flexDirection: "row" }, _, A)), ($[4] = _), ($[5] = A), ($[6] = z));
  else z = $[6];
  return z;
}

// READABLE (for understanding):
function LabeledField({ label, children }) {
  return (
    <Row>
      <Column flexShrink={0}>
        <Subtle>{label}: </Subtle>
      </Column>
      <Column flexGrow={1}>
        <Text wrap="wrap">{children}</Text>
      </Column>
    </Row>
  );
}

// Mapping: UF6 -> LabeledField, k -> Text, p -> Row/Column
```

Used for `Goal: <condition>` and `Last check: <reason>` rows.

### 5. The status-bar badge

The badge is the React component `Xx4` at `cli_inner_pretty.js:544426`. It uses `dg5` (the `setAt` selector) to read `appState.activeGoal?.setAt`, ticks a once-per-second/minute timer that calls `Qg5` (just `H + 1`), and on every animation frame advances a separate counter via `gg5` (`(H + 1) % V28`). The snippet below is the tail of the function (where the actual text/colour is built):

```javascript
// ============================================
// GoalActiveBadge tail - "◎ /goal active" rendering
// Location: cli_inner_pretty.js:544479-544501
// ============================================

// ORIGINAL (for source lookup):
if ((T1(X, _ && D ? Ug5 / V28 : null), !_)) return null;
let L = Date.now() - K,
  P;
if ($[12] !== L) ((P = L < 1000 ? "" : ` (${t7(L, { mostSignificantOnly: !0 })})`), ($[12] = L), ($[13] = P));
else P = $[13];
let Z = P,
  W;
if ($[14] !== q)
  ((W = q ? $_H.default.createElement(k, { dimColor: !0 }, " \xB7 ") : null), ($[14] = q), ($[15] = W));
else W = $[15];
let G = D?.[j] ?? "permission",
  V;
if ($[16] !== Z || $[17] !== G)
  ((V = $_H.default.createElement(k, { color: G }, vR$, " /goal active", Z)), ($[16] = Z), ($[17] = G), ($[18] = V));
else V = $[18];

// READABLE (for understanding):
// Tick the badge animation at BADGE_PULSE_PERIOD_MS/BADGE_DOTS per frame when active.
setIntervalHook(refreshTick, activeGoal && enableAnimation ? BADGE_PULSE_PERIOD_MS / BADGE_DOTS : null);
if (!activeGoal) return null;
const elapsedMs = Date.now() - activeGoal.setAt;
// Don't show the elapsed suffix in the first second (the panel would be too noisy)
const elapsedSuffix = elapsedMs < 1000 ? "" : ` (${formatDuration(elapsedMs, { mostSignificantOnly: true })})`;
const separator = hasSiblingStatus ? <Subtle> · </Subtle> : null;
const color = colorPalette?.[currentTick] ?? "permission";    // pulse through palette
return (
  <Span flexShrink={0}>
    {separator}
    <Text color={color}>{ICON_PULSE} /goal active{elapsedSuffix}</Text>
  </Span>
);

// Mapping:
//   Ug5 -> BADGE_PULSE_PERIOD_MS (4000),
//   V28 -> BADGE_DOTS (20),
//   Fg5 -> BADGE_DOT_INTERVAL_FRAC (0.18) - unused in this snippet but used by the palette generator
//   vR$ -> ICON_PULSE ("◎")
```

The badge pulses through a color palette over a 4-second period (`Ug5 = 4000`), advancing one of 20 steps (`V28`) per frame. This is what gives the "/goal active" indicator its subtle breathing animation while the goal is running.

### 6. The render-state selector

The dialog component reads `activeGoal` via `xR5` (a state-selector helper):

```javascript
// ============================================
// activeGoalSelector - reads the active goal from app state
// Location: cli_inner_pretty.js:507746-507747
// ============================================

// ORIGINAL (for source lookup):
function xR5(H) {
  return H.activeGoal;
}

// READABLE (for understanding):
function activeGoalSelector(state) {
  return state.activeGoal;
}
```

Same pattern for the badge at `cli_inner_pretty.js:544508-544509`:

```javascript
function dg5(H) {
  return H.activeGoal?.setAt;
}
```

The badge re-renders only when `setAt` changes (or every animation tick), avoiding a re-render storm from other state changes.

---

## Why this approach

**Why three dialog states (active/achieved/none) instead of one stateful component?** Because they show categorically different content:

- Active: live ticking stats + interruption hint ("/goal clear to stop early")
- Achieved: final stats with success styling, no interruption hint
- None: empty placeholder with a "how to set" hint

Branching the render tree on the state at the top makes the layouts independently understandable. Sharing a single render path with conditional sub-trees would obscure the three intents.

**Why does the badge animate at 4-second pulse cycles?** Long-running goals can take minutes or hours; a static badge looks like the UI is stuck. The slow pulse signals "still working" without being noisy. The period was chosen to be visible but not distracting - 4 seconds is roughly one full color cycle, slow enough that the eye registers a single pulse per glance.

**Why is the elapsed-time suffix suppressed for the first second?** Visual noise. The instant after `/goal` is registered, the badge would briefly show `(0s)` then update to `(1s)`. The 1-second floor keeps the badge text stable in the first frame after registration.

**Why pull achieved goal data from the message log rather than app state?** Because the achieved state must survive `/clear` and `/compact` operations. The `activeGoal` field in app state is purely the active-goal pointer; once a goal is achieved, it transitions through the goal_status attachment in the transcript. Reading the attachment lets the dialog show "Last achieved: ..." even if the user explicitly cleared the app state.

**Why is the badge in a separate code path from the dialog?** Different lifecycles. The badge is always-on (renders in every interactive frame when active), the dialog is one-shot (renders only on `/goal` invocation). Combining them would either force the dialog to be persistent (UI clutter) or force the badge to be modal (broken).

**Key insight:** The overlay is essentially **a transparent skin over the Stop-hook state**. It reads `activeGoal.setAt`, `iterations`, `tokensAtStart`, and `lastReason` - all of which are written by the Stop hook chain (covered in [goal_command.md](./goal_command.md)) - and renders them with no business logic of its own. Move the Stop hook to a different mechanism and the overlay would be a 3-line change, because it does not "know" about goals; it just renders fields. That separation is what makes the goal feature feel polished without being complex.

---

## Cross-references

- The Stop-hook engine that drives `iterations++` and `lastReason` updates - `27_hooks_subsystem`, also `cli_inner_pretty.js:391740-391790`
- Token counting (`nX()`) - `06_state_management` or `25_model_selection`
- `formatDuration` (`t7`) and `formatThousands` (`r9`) - UI utility functions
- The main UI status bar where the badge renders - `21_terminal_renderer`
- The achievement attachment renderer at `cli_inner_pretty.js:347071-347110` - this is what produces the inline "Goal achieved (1m 23s · 5 turns · 2.4k tokens)" lines that appear in the transcript itself (not the overlay).
