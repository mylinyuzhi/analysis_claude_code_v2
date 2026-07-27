# Screen reader mode in 2.1.220 — a dark-launched feature promoted, then given a voice

**Bundles** (see [`_CONVENTIONS.md`](../_CONVENTIONS.md) §1): `T = 2.1.220` (872,596 lines),
`B = 2.1.193` (718,679 lines). Every `cli_inner_pretty.js:<line>` below without a `(193)` tag was read
in the 2.1.220 bundle.

---

## 0. The headline correction: `.208` did not *add* screen reader mode

`.208`'s bullet reads:

> Added screen reader mode: opt-in plain-text rendering for screen reader users. Run
> `claude --ax-screen-reader`, set `CLAUDE_AX_SCREEN_READER=1`, or add `"axScreenReader": true` to settings.

**Every single one of those three surfaces already shipped in 2.1.193, and so did the plain-text
renderer.** Measured:

| Anchor | 2.1.220 | 2.1.193 | Verdict |
|---|---|---|---|
| `axScreenReader` (settings key) | 2 (`:60191`, `:156208`) | 2 (`:55849 (193)`, `:137299 (193)`) | carryover |
| `--ax-screen-reader` | 3 (`:60195`, `:156204`, `:851358`) | 3 | carryover |
| `CLAUDE_AX_SCREEN_READER` | 6 | 5 | carryover |
| `tengu_ax_screen_reader` (the gate) | 1 (`:156258`) | 1 (`:137315 (193)`) | carryover |
| the settings *description string* | `:60195` | `:55852 (193)` | **byte-identical** |
| `onRenderScreenReader` (the plain-text render path) | 2 (`:258299`, `:258094`) | 2 (`:175369 (193)`, `:175163 (193)`) | carryover |
| `computeScreenReaderPark` (cursor parking) | 2 (`:258440`) | 2 (`:175415 (193)`) | carryover |

So 2.1.193 already had: the flag, the env var, the setting, a remote gate, a full alternative
render path that flattens the ink tree to plain text, and cursor parking. What `.208` did was
**promote a dark-launched feature to a documented one**. This document therefore treats the
feature's *existence* as carryover and concentrates on the four things that are genuinely new in
this window:

1. **an activation-source tuple** so the client can tell the user *why* it is in screen-reader mode (§1);
2. **a startup quiet window** so the announcement is not trampled by the first paint (§2);
3. **an announcement queue** — the first time this client emits speech that is not just a
   re-render of the UI (§4, §5, §6);
4. **incremental echo + whitespace preservation** inside the render path, so a keystroke reads as
   one character rather than as a whole re-spoken line (§3).

Everything else screen-reader-adjacent in the window (the table serializer, the decorative-glyph
hiding, the audible bell, the TUI auto-off) is covered in §7–§10.

---

## 1. The detector: `isScreenReaderMode` and the activation-source tuple

### The 3-tier resolution and the gate

```javascript
// ============================================
// ScreenReaderModeDetector - resolves whether screen-reader mode is on, and from which surface
// Location: cli_inner_pretty.js:156198-156220
// ============================================

// ORIGINAL (for source lookup):
class ytu {
  #e;
  #t;
  isEnabled() {
    if (this.#e !== void 0) return this.#e;
    let e, t;
    if (JFc("--ax-screen-reader")) ((e = !0), (t = "flag"));
    else {
      let n = Z.CLAUDE_AX_SCREEN_READER;
      if (n !== void 0) ((e = n), (t = "env"));
      else ((e = eo().axScreenReader === !0), (t = "settings"));
    }
    if (!e) return (this.#e = !1);
    let r = NXi?.(eIg, !0) ?? !0;
    return ((this.#t = r ? t : void 0), (this.#e = r));
  }
  activationSource() {
    return this.isEnabled() ? this.#t : void 0;
  }
  reset() {
    ((this.#e = void 0), (this.#t = void 0));
  }
}

// READABLE (for understanding):
class ScreenReaderModeDetector {
  #enabled;              // memoised tri-state: undefined | true | false
  #activationSource;     // "flag" | "env" | "settings" | undefined
  isEnabled() {
    if (this.#enabled !== void 0) return this.#enabled;           // memoised for the process lifetime
    let requested, source;
    if (hasCliFlag("--ax-screen-reader")) (requested = true, source = "flag");
    else {
      let envValue = typedEnv.CLAUDE_AX_SCREEN_READER;
      if (envValue !== void 0) (requested = envValue, source = "env");
      else (requested = readSettings().axScreenReader === true, source = "settings");
    }
    if (!requested) return (this.#enabled = false);                // never consult the gate when off
    let gateAllows = gateEvaluator?.(AX_SCREEN_READER_GATE, true) ?? true;   // fail-OPEN
    return ((this.#activationSource = gateAllows ? source : void 0), (this.#enabled = gateAllows));
  }
  activationSource() { return this.isEnabled() ? this.#activationSource : void 0; }
  reset() { (this.#enabled = void 0), (this.#activationSource = void 0); }
}

// Mapping: ytu→ScreenReaderModeDetector, #e→#enabled, #t→#activationSource,
//          JFc→hasCliFlag, Z→typedEnv, eo→readSettings, NXi→gateEvaluator,
//          eIg→AX_SCREEN_READER_GATE ("tengu_ax_screen_reader", :156258)
```

The 2.1.193 version (`qhi`, `:137291-137307 (193)`) is the same function minus `#t`,
minus `activationSource()`, and with the tri-branch collapsed into
`e = t !== void 0 ? t : Lr().axScreenReader === !0` — a single expression that keeps *whether* but
throws away *which*.

### [Decision] Why precedence is flag → env → settings, and why the gate is checked last

**What it does:** picks a single boolean from three possible sources and remembers which one won.

**How it works:**
1. `--ax-screen-reader` on the command line wins outright and cannot be un-set by anything below it.
2. Otherwise `CLAUDE_AX_SCREEN_READER` is consulted through the *typed* env accessor `Z`, which
   coerces `"0"`/`"false"`/`""` to `false` — so `CLAUDE_AX_SCREEN_READER=0` is a real *off* switch
   that overrides the settings file, not merely an absence.
3. Otherwise the settings key, compared with `=== !0` so a truthy-but-not-boolean JSON value does
   not silently enable the mode.
4. The remote gate `tengu_ax_screen_reader` is only consulted **after** the answer is already
   "on" (`if (!e) return (this.#e = !1)` at `:156210`).
5. The gate call is `NXi?.(eIg, !0) ?? !0` — two independent fail-open defaults: `!0` as the gate's
   own default value, and `?? !0` for the case where no gate evaluator has been installed yet.

**Why this approach:**
- The classic CLI precedence order (argv > env > config) is what a user reaching for an
  accessibility escape hatch expects, and the argv form is the one a screen-reader user can type
  when the config file is unreachable *because* the TUI is unusable.
- Checking the gate only on the "on" path is not an optimisation, it is a **privacy and
  reliability decision**. The gate lookup is a remote feature-flag read; evaluating it for every
  session would (a) tell the server which sessions asked about accessibility and (b) put a network
  dependency in front of a boolean that 99.9% of sessions answer "false" for locally.
- The double fail-open means a flag-service outage can never *take away* an accessibility mode the
  user explicitly asked for. Contrast this with the subagent depth resolver
  ([ground truth §2](../_GROUND_TRUTH_verified_anchors.md)), which is gate-*driven* — there, the
  server is meant to be able to change the answer; here it is only meant to be able to kill-switch
  a broken build, and even that is best-effort.

**Key insight:** the memoisation (`#e`) means screen-reader mode is decided **once per process and
never re-evaluated**. `reset()` exists but has no production caller — it is a test seam. A
consequence: `/config`-editing `axScreenReader` mid-session does nothing until restart, which is
why the announcement banner (§2) says *how* it was turned on.

### The banner and the activation-source consumer

```javascript
// ============================================
// getScreenReaderModeBanner - the one-line startup announcement, naming the activation surface
// Location: cli_inner_pretty.js:156224-156230
// ============================================

// ORIGINAL (for source lookup):
function _tu() {
  if (Cno.isEnabled()) {
    let e = Cno.activationSource();
    return e ? `[Screen Reader Mode: on via ${e}]` : "[Screen Reader Mode: on]";
  }
  return null;
}

// READABLE (for understanding):
function getScreenReaderModeBanner() {
  if (screenReaderDetector.isEnabled()) {
    let source = screenReaderDetector.activationSource();
    return source ? `[Screen Reader Mode: on via ${source}]` : "[Screen Reader Mode: on]";
  }
  return null;
}

// Mapping: _tu→getScreenReaderModeBanner, Cno→screenReaderDetector (singleton, :156271)
```

`Screen Reader Mode: on` is **220=1 / 193=0** — net-new. The single caller is in the interactive
entry path at `:829085-829087`:

```javascript
if (!F && process.stdout.isTTY && kL()) {          // not --print, real TTY, screen reader on
  let Gt = _tu();
  if (Gt !== null) (console.log(Gt), Stu());       // print, then START THE QUIET WINDOW
}
```

Note the ordering: the banner is printed with plain `console.log` **before ink mounts**, so it lands
in the terminal's normal scrollback where a screen reader reads it as ordinary output. Only then is
`Stu()` (§2) called. `kL()` (`:156221-156223`) is the exported `isScreenReaderMode()` predicate;
it has **15 call sites in 220 vs 12 for its 193 counterpart `aD()`** — a 25 % growth in how many
places the UI branches on accessibility.

---

## 2. The startup quiet window (`.217`) — `CLAUDE_AX_STARTUP_QUIET_MS`

`.217`: *"Fixed screen reader mode's startup announcement being cut off by the first prompt render."*

`CLAUDE_AX_STARTUP_QUIET_MS` is **220=2 (`:31123`, `:156240`) / 193=0** — genuinely net-new, and it
is the whole mechanism.

```javascript
// ============================================
// getStartupQuietRemainingMs - how long the renderer must stay silent after the SR banner
// Location: cli_inner_pretty.js:156231-156245
// ============================================

// ORIGINAL (for source lookup):
function Stu() { if (xno === null) xno = Date.now(); }
function Hno() { btu = !0; }
function Etu() {
  {
    if (xno === null || btu) return 0;
    let e = Math.min(Z.CLAUDE_AX_STARTUP_QUIET_MS ?? tIg, rIg),
      t = xno + e - Date.now();
    return t > 0 ? t : 0;
  }
  return 0;
}
var tIg = 3000, rIg = 600000, xno = null, btu = !1;

// READABLE (for understanding):
function beginStartupQuietWindow() { if (quietStartedAt === null) quietStartedAt = Date.now(); }
function endStartupQuietWindow()   { quietWindowCancelled = true; }
function getStartupQuietRemainingMs() {
  if (quietStartedAt === null || quietWindowCancelled) return 0;
  let budget = Math.min(typedEnv.CLAUDE_AX_STARTUP_QUIET_MS ?? DEFAULT_QUIET_MS, MAX_QUIET_MS),
    remaining = quietStartedAt + budget - Date.now();
  return remaining > 0 ? remaining : 0;
}
var DEFAULT_QUIET_MS = 3000, MAX_QUIET_MS = 600000;

// Mapping: Stu→beginStartupQuietWindow, Hno→endStartupQuietWindow,
//          Etu→getStartupQuietRemainingMs, xno→quietStartedAt, btu→quietWindowCancelled,
//          tIg→DEFAULT_QUIET_MS, rIg→MAX_QUIET_MS
```

The renderer honours it at the very top of the screen-reader render path (`:258299-258309`):

```javascript
onRenderScreenReader() {
  if (!this.isExiting) {
    let P = Etu();
    if (P > 0) {
      if (this.srStartupQuietTimer === null)
        this.srStartupQuietTimer = setTimeout(() => {
          ((this.srStartupQuietTimer = null), Hno(), this.onRender());
        }, P);
      return;                                 // <- paint NOTHING this frame
    }
  }
  ...
}
```

`srStartupQuietTimer` is **220=6 / 193=0**.

### [Algorithm] The quiet window

**What it does:** suppresses *all* screen-reader output for up to 3 s after the startup banner is
printed, so the assistive technology can finish speaking it.

**How it works:**
1. `Stu()` stamps `quietStartedAt` immediately after `console.log(banner)`. The `if (xno === null)`
   guard makes it idempotent — a second call cannot extend the window.
2. Each screen-reader render frame asks `Etu()` for the remaining time. If it is positive the frame
   is **dropped entirely** (not queued, not coalesced) and a one-shot timer is armed for exactly
   the remaining milliseconds.
3. When the timer fires it calls `Hno()` (latch the window closed) and then re-enters `onRender()`,
   which now paints the accumulated final state in one go.
4. The `srStartupQuietTimer === null` check means only one timer is ever live; subsequent frames
   during the window are pure no-ops.
5. `unmount()` clears the timer (`:258870-258871`) so a fast `Ctrl+C` during startup does not leak it.
6. **The window is also cancelled by the first real keystroke** — `Dcy` (the stdin drain) at
   `:254352`: `if (!o && t.some(Ehs)) (P5e(), Hno());`, where `Ehs` (`:254344-254349`) is
   "is this a genuine user input event" (it excludes terminal query *responses*, pure mouse-motion
   reports, and the focus-in/focus-out sequences `yPt`/`Hct`).

**Why this approach:**
- 3 s is roughly the time VoiceOver/NVDA take to speak a 30-character bracketed phrase at a default
  rate, plus margin for the utterance queue. Shorter and the first paint interrupts it; much longer
  and every screen-reader session feels frozen at launch.
- The **600,000 ms (10 minute) ceiling** on the env override is the interesting constant. It is not
  a plausible user setting — it is a guard against a typo (`CLAUDE_AX_STARTUP_QUIET_MS=30000000`)
  bricking the session with a silent, input-less terminal. `Math.min` clamps rather than rejects, so
  a bad value degrades to "long but survivable" instead of throwing at startup.
- Dropping the frame instead of buffering it is correct because the ink renderer is
  *state-based*: the next frame contains everything the dropped frame would have said. A buffer
  would replay stale intermediate states.
- Cancelling on first keystroke is the essential escape hatch: a user who starts typing has by
  definition heard enough, and without this the terminal would appear dead for 3 s.

**Key insight:** the quiet window is the only place in the whole renderer where output is
suppressed for a *time* rather than for a *state reason*. That is a tell that the constraint being
modelled is not in the program at all — it is the speech synthesiser's utterance queue, which the
client cannot observe. The 3 s is a blind guess at another process's latency, and the env var exists
precisely because that guess is wrong for some users' speech rates.

The same bullet's second half ("the thinking status row re-rendering every few seconds to update
elapsed time and token counts") is the other half of the same problem: a row that re-renders on a
timer produces a fresh utterance every tick. I could not isolate a literal for that half — see the
README ledger.

---

## 3. Inside the renderer: what actually changed in `onRenderScreenReader`

The function exists in both builds. Here is the measured delta:

| Feature inside the SR render path | 2.1.220 | 2.1.193 |
|---|---|---|
| flattener return type | `{ text, preserveRanges }` (`LJr`, `:257375`) | bare `string` (`DOt`, `:174576 (193)`) |
| `preserveRanges` | 10 occurrences | **0** |
| `prevScreenReaderAnchor` state machine | 15 occurrences | **0** |
| `srStartupQuietTimer` | 6 | **0** |
| `lastRowAnchored` state label | 7 | **0** |
| announcement drain into the frame | `:258342` | **absent** |
| single-grapheme append fast path | `:258385-258397` | **absent** |
| `computeScreenReaderPark` body | `:258440-258461` | `:175415-175435 (193)` — **logically identical** |

193's whole function is 45 lines (`:175369-175414 (193)`); 220's is 140 (`:258299-258439`).

### 3.1 `preserveRanges` and the `.218` "new line" bug

`.218`: *"Fixed VoiceOver reading `new line` instead of echoing the typed space at the end of the
input in `--ax-screen-reader` mode."*

193's flattener trimmed every wrapped line's trailing whitespace unconditionally
(`r.push(H.trimEnd())`, `:175385 (193)`). So typing a space at the end of the prompt produced a
frame whose text was **byte-identical** to the previous frame — the diff loop found no changed line
— but whose *wrap* had advanced, so the terminal emitted a line break. The screen reader read the
only observable change: a new line.

220 threads a set of byte ranges through the flattener saying "trailing whitespace is significant
here":

```javascript
// ============================================
// renderNodeToScreenReaderOutput - flattens the ink tree to text + whitespace-significant ranges
// Location: cli_inner_pretty.js:257375-257407
// ============================================

// ORIGINAL (for source lookup):
function LJr(e, t, r = 0) {
  if (r >= eut) return (Ysr("renderNodeToScreenReaderOutput", e.nodeName), { text: "", preserveRanges: h9e });
  if (e.nodeName === "#text") return { text: Dho(e.nodeValue), preserveRanges: h9e };
  let n = e.accessibility;
  if (n?.hidden) return { text: "", preserveRanges: h9e };
  if (e.isHidden || e.yogaNode?.getDisplay() === 1) return { text: "", preserveRanges: h9e };
  let o = "", i = h9e;
  if (n?.label !== void 0) o = Dho(n.label);
  else if (e.nodeName === "ink-text" || e.nodeName === "ink-virtual-text" || e.nodeName === "ink-link")
    for (let s of e.childNodes) {
      let a = LJr(s, n?.role ?? t, r + 1);
      if (a.preserveRanges.length > 0) i = Lho(i, a.preserveRanges, o.length);
      o += a.text;
    }
  else if (e.nodeName === "ink-box" || e.nodeName === "ink-root") {
    let s = wuy(e, n?.role ?? t, r);
    ((o = s.text), (i = s.preserveRanges));
  }
  if (n?.state) { ... o = a + o; i = Lho(h9e, i, a.length); }
  if (n?.role && n.role !== t) { let s = `${n.role}: `; ((o = s + o), (i = Lho(h9e, i, s.length))); }
  if (n?.preserveWhitespace && o !== "") i = [[0, o.length]];
  return { text: o, preserveRanges: i };
}

// READABLE (for understanding):
function renderNodeToScreenReaderOutput(node, inheritedRole, depth = 0) {
  if (depth >= MAX_TREE_DEPTH)                                     // 256
    return (reportTreeDepthExceeded("renderNodeToScreenReaderOutput", node.nodeName),
            { text: "", preserveRanges: EMPTY_RANGES });
  if (node.nodeName === "#text")
    return { text: sanitizeForScreenReader(node.nodeValue), preserveRanges: EMPTY_RANGES };
  let ax = node.accessibility;
  if (ax?.hidden) return { text: "", preserveRanges: EMPTY_RANGES };          // aria-hidden
  if (node.isHidden || node.yogaNode?.getDisplay() === 1)                     // display:none
    return { text: "", preserveRanges: EMPTY_RANGES };
  let text = "", ranges = EMPTY_RANGES;
  if (ax?.label !== void 0) text = sanitizeForScreenReader(ax.label);         // aria-label REPLACES children
  else if (isTextLikeNode(node))
    for (let child of node.childNodes) {
      let part = renderNodeToScreenReaderOutput(child, ax?.role ?? inheritedRole, depth + 1);
      if (part.preserveRanges.length > 0) ranges = shiftRanges(ranges, part.preserveRanges, text.length);
      text += part.text;
    }
  else if (isBoxLikeNode(node)) ({ text, preserveRanges: ranges } = flattenBoxChildren(node, ax?.role ?? inheritedRole, depth));
  if (ax?.state) {                                                            // aria-state -> "(selected, focused) "
    let activeStates = Object.keys(ax.state).filter((k) => ax.state[k]);
    if (activeStates.length > 0) {
      let prefix = `(${activeStates.join(", ")}) `;
      (text = prefix + text, ranges = shiftRanges(EMPTY_RANGES, ranges, prefix.length));
    }
  }
  if (ax?.role && ax.role !== inheritedRole) {                                // aria-role -> "row: "
    let prefix = `${ax.role}: `;
    (text = prefix + text, ranges = shiftRanges(EMPTY_RANGES, ranges, prefix.length));
  }
  if (ax?.preserveWhitespace && text !== "") ranges = [[0, text.length]];     // aria-preserve-whitespace
  return { text, preserveRanges: ranges };
}

// Mapping: LJr→renderNodeToScreenReaderOutput, Dho→sanitizeForScreenReader, Lho→shiftRanges,
//          wuy→flattenBoxChildren, h9e→EMPTY_RANGES (:257481), eut→MAX_TREE_DEPTH (=256, :254907),
//          Ysr→reportTreeDepthExceeded
```

The renderer then consults the ranges before trimming (`:258326-258339`):

```javascript
for (let P of o) {                                   // o = logical lines
  let M = a + P.length,
    D = a + P.trimEnd().length < M && n.some(([U, W]) => U < M && M <= W);
  //  ^ "this line HAS trailing whitespace" AND "the line's end offset falls inside a preserve range"
  if ((s.push(i.length), P === "")) i.push("");
  else {
    let U = YU(P, r, { trim: !1, hard: !0 }).split("\n");
    for (let W = 0; W < U.length; W++) {
      let q = U[W];
      i.push(D && W === U.length - 1 ? q : q.trimEnd());   // keep trailing ws ONLY on the last wrap row
    }
  }
  a = M + 1;
}
```

The producer side is the prompt input: `aria-preserve-whitespace` is **220=4 / 193=0**, declared on
the rendered input text at `:560696` and `:560717`, and the prop is plumbed through the ink
element factory `AJr` (`:253924-253927`) which builds
`{ hidden, label, role, state, preserveWhitespace }`. `preserveWhitespace` itself is **220=2 / 193=0**.

The input hook also flips `preserveTrailingWhitespace: o` where `o = Ea()` = `useScreenReaderEnabled()`
(`:560760`, `:748925`; the React context provider is at `:258858-258860`) — so the editor's own
buffer stops trimming in screen-reader mode too, and the cursor char is suppressed
(`cursorChar: e.showCursor && !o ? " " : ""`, `:560759`). `preserveTrailingWhitespace` is
**220=3 / 193=0**.

**Key insight:** the fix is not "stop trimming". Trailing whitespace still gets trimmed
*everywhere except* the last wrap row of a node that opted in, because a screen reader that reads
trailing spaces on transcript lines is unusable. This is an opt-in whitelist expressed as byte
ranges through a recursive flatten — the `Lho`/`shiftRanges` bookkeeping exists purely so the
ranges survive the string concatenations and prefix insertions that happen on the way up the tree.

### 3.2 The single-grapheme echo (`.219`) and the anchor state machine

`.219`: *"Fixed screen-reader mode rewriting the entire input line on every keystroke instead of
echoing only the typed character."*

193's diff loop found the first changed line, then rewrote **everything from that line to the end
of the frame** (`:175397-175413 (193)`). Typing one character into a 2-line prompt therefore emitted
both lines again — and a screen reader speaks re-emitted text.

220 adds a fast path (`:258368-258398`) that fires only when a long list of conditions all hold:

```javascript
// ============================================
// (fast path inside onRenderScreenReader) - emit ONLY the appended graphemes
// Location: cli_inner_pretty.js:258368-258398
// ============================================

// ORIGINAL (for source lookup):
if (!g && c === -1 &&
  (this.prevScreenReaderAnchor === "clean" ||
    (this.prevScreenReaderAnchor === "lastRowAnchored" && f === u.length - 1 && y.row === f && p.row === f)) &&
  u.length === i.length && f >= u.length - this.terminalRows && y.row >= u.length - this.terminalRows &&
  i[f].startsWith(u[f]) && !i[f].includes("\t")
) {
  let P = !0;
  for (let U = f + 1; U < u.length; U++) if (u[U] !== i[U]) { P = !1; break; }
  let M = P ? i[f].slice(u[f].length) : "",
    $ = M === "" ? 0 : Ft(u[f]);
  if (M !== "" && Ft(String.fromCodePoint(M.codePointAt(0))) > 0 &&
      $ + Ft(M) === Ft(i[f]) && Ouy(i[f], u[f].length)) {
    let U = (f !== y.row ? kSe(0, f - y.row) : "") + csr($ + 1),
      W = csr(p.col + 1) + (p.row !== f ? kSe(0, p.row - f) : "");
    (this.options.stdout.write(U + M + W), (this.prevScreenReaderLines = i), (this.prevScreenReaderPark = p));
    return;
  }
}

// READABLE (for understanding):
if (!framesIdentical && announcementStartRow === -1 &&
  (this.prevScreenReaderAnchor === "clean" ||
    (this.prevScreenReaderAnchor === "lastRowAnchored" &&
     firstDiffRow === prevLines.length - 1 && prevPark.row === firstDiffRow && newPark.row === firstDiffRow)) &&
  prevLines.length === newLines.length &&                            // no row count change
  firstDiffRow >= prevLines.length - this.terminalRows &&            // changed row still on screen
  prevPark.row >= prevLines.length - this.terminalRows &&            // old cursor still on screen
  newLines[firstDiffRow].startsWith(prevLines[firstDiffRow]) &&      // pure APPEND, not an edit
  !newLines[firstDiffRow].includes("\t")                             // tabs make columns unpredictable
) {
  let tailUnchanged = true;
  for (let r = firstDiffRow + 1; r < prevLines.length; r++)
    if (prevLines[r] !== newLines[r]) { tailUnchanged = false; break; }
  let appended = tailUnchanged ? newLines[firstDiffRow].slice(prevLines[firstDiffRow].length) : "",
    appendCol = appended === "" ? 0 : displayWidth(prevLines[firstDiffRow]);
  if (appended !== "" &&
      displayWidth(String.fromCodePoint(appended.codePointAt(0))) > 0 &&   // not a zero-width joiner tail
      appendCol + displayWidth(appended) === displayWidth(newLines[firstDiffRow]) &&  // width is additive
      isGraphemeBoundary(newLines[firstDiffRow], prevLines[firstDiffRow].length)) {   // don't split a cluster
    let moveToAppendPoint = (firstDiffRow !== prevPark.row ? cursorVerticalMove(0, firstDiffRow - prevPark.row) : "")
                          + cursorToColumn(appendCol + 1),
      moveToPark = cursorToColumn(newPark.col + 1)
                 + (newPark.row !== firstDiffRow ? cursorVerticalMove(0, newPark.row - firstDiffRow) : "");
    (this.options.stdout.write(moveToAppendPoint + appended + moveToPark),
      (this.prevScreenReaderLines = newLines), (this.prevScreenReaderPark = newPark));
    return;
  }
}

// Mapping: g→framesIdentical, c→announcementStartRow, f→firstDiffRow, u→prevLines, i→newLines,
//          y→prevPark, p→newPark, Ft→displayWidth (:160290), Ouy→isGraphemeBoundary (:257792),
//          csr→cursorToColumn (:239794), kSe→cursorVerticalMove (:239800)
```

`isGraphemeBoundary` is the grapheme guard:

```javascript
function Ouy(e, t) {                       // isGraphemeBoundary(text, offset)
  if (t <= 0) return !0;
  for (let r of TE().segment(e)) {         // TE() = memoised Intl.Segmenter({granularity:"grapheme"})
    if (r.index === t) return !0;
    if (r.index > t) return !1;
  }
  return t >= e.length;
}
```

### [Algorithm] `prevScreenReaderAnchor` — a 3-state machine that licenses the fast path

**What it does:** tracks whether the terminal's cursor is where the renderer thinks it is, so the
incremental write is only attempted when the answer is provably yes.

**How it works:** the states are `"clean"`, `"lastRowAnchored"`, `"broken"`, assigned in the
post-write block at `:258420-258438`:
1. `C` (`:258403`) — "the previous frame was taller than the terminal and we can no longer address
   its scrolled-off rows" → `"broken"`.
2. Otherwise if the number of rewritten rows `P >= min(newLines.length, terminalRows)` → the whole
   visible screen was just repainted, so position is certain → `"clean"`.
3. If only *some* rows were rewritten, the state degrades: `"broken"` stays broken unless the new
   park is on the last row (`M`), in which case it becomes `"lastRowAnchored"`; `"lastRowAnchored"`
   breaks the moment the park leaves the last row; and a frame that *shrank* (`$`) while the
   previous frame did not fit the terminal (`!D`) also drops out of `"clean"`.
4. The fast path (above) accepts `"clean"` unconditionally, and accepts `"lastRowAnchored"` only
   when the change, the old park and the new park are **all** on that same anchored last row.
5. `repaint()` calls `resetScreenReaderDiffState()` (`:258486`), which clears the remembered lines
   and park — forcing a full rewrite after any terminal resize or alt-screen toggle.

**Why this approach:**
- The renderer cannot read the terminal's cursor position. Every incremental write is a bet that
  the terminal's state matches `prevScreenReaderLines` + `prevScreenReaderPark`. Once content has
  scrolled off the top, relative cursor motion (`kSe`) can no longer reach it, and the bet is
  unrepayable — hence a sticky `"broken"` state rather than a per-frame recomputation.
- `"lastRowAnchored"` exists because the overwhelmingly common case *is* typing at the bottom of a
  tall transcript: the frame is taller than the terminal (so not `"clean"`) but the only row anyone
  touches is the last one, which is always addressable. Without this third state the fast path
  would essentially never fire in a real session, and the `.219` fix would be cosmetic.
- The seven-way conjunction guarding the write is defensive to the point of paranoia
  (`startsWith` for append-only, `!includes("\t")` because tab stops are terminal-defined,
  `displayWidth` additivity to reject combining marks that change an existing cluster's width,
  `isGraphemeBoundary` to reject splitting a family emoji). Each of those failure modes produces
  *garbled* output, and garbled output to a screen reader is worse than a verbose full rewrite —
  so the code always chooses the slow path when unsure.

**Key insight:** `announcementStartRow === -1` is in the guard. Announcements (§4) are appended as
extra lines at the bottom of the frame, so **a frame that carries an announcement can never take
the fast path** — the queued speech must be emitted as a real new line, which is exactly how it
gets spoken. The two features are deliberately mutually exclusive per frame.

### 3.3 Two smaller renderer hardenings

**Control-character scrubbing at the leaf.** 193 returned `e.nodeValue` raw for `#text` nodes
(`:174577 (193)`). 220 routes every text node and every `aria-label` through `Dho`
(`:257355-257374`), which normalizes each line, then drops C0 controls except TAB/LF, drops DEL and
C1 (`0x7f`–`0x9f`), and replaces the bidi-override set (`U+061C`, `U+202A`–`U+202E`,
`U+2066`–`U+2069`) with `U+FFFD`. That is the same threat model as the visible-terminal sanitizer
(`sanitizeForTerminal`, see [terminal_rendering.md](terminal_rendering.md) §6) applied to the
screen-reader channel: a tool result containing bidi overrides could otherwise reorder what the
*text* channel emits.

**`MAX_TREE_DEPTH = 256`.** `:254907`, with a once-per-call-site error report
(`Ysr`, `:254897-254906`, message `… ink tree depth exceeded MAX_TREE_DEPTH (256) at <node>; skipping
deeper subtree instead of overflowing the call stack`). `MAX_TREE_DEPTH` is **220=2 / 193=0**;
`skipping deeper subtree` is **220=1 / 193=0**. Three recursive walkers adopt it: `hitTest`
(`:254915`), `renderNodeToOutput` (`:256826`) and the screen-reader flattener (`:257376`), plus the
node-offset walker `qhs` (`:257441`) which bails silently. This is the `.218` bullet *"Fixed crashes
(maximum call stack exceeded) … when rendering deeply nested UI trees"*, and it is
**degrade-not-crash**: the deep subtree is dropped from the output and the session continues.

---

## 4. The announcement queue — the first real "speech" channel

`cVr` / `vtu` (`:156250-156257`) plus `nRt` (the array) and `htu = 16` (the cap) are all net-new;
none of these symbols' behaviour exists in 193.

```javascript
// ============================================
// announcementQueue - a 16-slot ring of strings to be spoken on the next screen-reader frame
// Location: cli_inner_pretty.js:156250-156257, :156265-156266
// ============================================

// ORIGINAL (for source lookup):
function cVr(e) {
  if ((nRt.push(e), nRt.length > htu)) nRt.splice(0, nRt.length - htu);
}
function vtu() {
  if (nRt.length === 0) return [];
  let e = nRt;
  return ((nRt = []), e);
}
var htu = 16, nRt;

// READABLE (for understanding):
function pushAnnouncement(text) {
  if ((announcementQueue.push(text), announcementQueue.length > MAX_ANNOUNCEMENTS))
    announcementQueue.splice(0, announcementQueue.length - MAX_ANNOUNCEMENTS);   // drop OLDEST
}
function drainAnnouncements() {
  if (announcementQueue.length === 0) return [];
  let pending = announcementQueue;
  return ((announcementQueue = []), pending);      // swap, not copy
}
var MAX_ANNOUNCEMENTS = 16;

// Mapping: cVr→pushAnnouncement, vtu→drainAnnouncements, nRt→announcementQueue, htu→MAX_ANNOUNCEMENTS
```

The consumer is inside the screen-reader render path (`:258342-258356`):

```javascript
let l = this.computeScreenReaderPark(e, s, i, r), c = -1;
for (let P of vtu()) {
  let M = Dho(P);                       // sanitize the announcement too
  if (M === "") continue;
  for (let $ of M.split("\n")) {
    if (c === -1) c = i.length;         // remember where announcements begin
    if ($ === "") i.push("");
    else for (let U of YU($, r, { trim: !1, hard: !0 }).split("\n")) i.push(U.trimEnd());
  }
}
```

### [Decision] Why announcements are appended lines instead of a separate output stream

**What it does:** turns a queued string into extra text rows at the bottom of the next
screen-reader frame.

**How it works:**
1. Producers call `cVr(text)` from anywhere — they do **not** check `kL()` first (see §5, §6).
2. The queue is bounded at 16 with **oldest-dropped** semantics. `splice(0, len - 16)` handles a
   burst that pushes several at once.
3. `vtu()` swaps the array out rather than copying, so a producer that fires during the drain
   lands in the fresh array and is spoken on the *next* frame instead of being lost.
4. Announcement lines are wrapped to the terminal width and trailing-trimmed like any other line,
   and each is control-character sanitized.
5. `c` (`announcementStartRow`) is fed back into the diff: `if (c !== -1 && f > c) f = c;`
   (`:258363`) forces the rewrite to begin no later than the first announcement row, and
   `c === -1` is a precondition of the fast path (§3.2).

**Why this approach:**
- There is **no cross-platform way for a terminal program to speak**. There is no `aria-live`, no
  OSC for "announce this". The only channel to the screen reader is text arriving on stdout. So an
  "announcement" must physically be text in the frame, and the only reliable place to put it is at
  the end, where a screen reader in a terminal reads newly-arrived output.
- Bounding at 16 and dropping the *oldest* is the right polarity for speech: if 40 announcements
  queue up, the user wants the 16 most recent facts, not the 16 stalest. (Contrast a log buffer,
  which drops newest to preserve the first error.)
- Producers not gating on `kL()` is a deliberate simplification with a real cost: in a normal
  (non-screen-reader) session `nRt` grows to 16 entries and then churns forever, because nothing
  ever drains it. That is a bounded ~16-string leak, evidently judged cheaper than sprinkling
  `if (kL())` at every producer and risking a producer that forgets.
- Because the queue is module-global and the drain is in the renderer, an announcement pushed while
  the startup quiet window (§2) is open is **not lost** — it simply waits, which is why the startup
  banner and an early mode-change both get spoken.

**Key insight:** announcements are the one thing in this renderer that is *not* a function of UI
state. Everything else is a projection of the ink tree; announcements are an imperative side
channel bolted onto a declarative renderer. The `c !== -1` interlocks in the diff logic are the
seam where the two models meet — and they are why the incremental echo and announcements can never
happen in the same frame.

---

## 5. Deletion announcements (`.218`) — and the mask privacy guard

`.218`: *"Added screen-reader announcements of deleted text for word and line deletions
(`Option+Delete`, `Ctrl+W`, `Cmd+Backspace`, `Ctrl+U`, `Ctrl+K`) in `--ax-screen-reader` mode."*

```javascript
// ============================================
// announceDeletedText - speaks what a kill-ring deletion removed, or a placeholder if masked
// Location: cli_inner_pretty.js:559690-559712
// ============================================

// ORIGINAL (for source lookup):
function jXs(e, t) {
  if (e === "") return;
  if (t !== "") {
    cVr("deleted");
    return;
  }
  let r =
    e.trim() === ""
      ? e.includes(`
`)
        ? "new line"
        : e.includes("\t")
          ? "tab"
          : "space"
      : e
          .replaceAll(
            `
`,
            " ",
          )
          .trim();
  cVr(r);
}

// READABLE (for understanding):
function announceDeletedText(deletedText, mask) {
  if (deletedText === "") return;                        // nothing removed -> silence
  if (mask !== "") { pushAnnouncement("deleted"); return; }   // masked field: NEVER speak the secret
  let spoken =
    deletedText.trim() === ""
      ? deletedText.includes("\n") ? "new line"
        : deletedText.includes("\t") ? "tab"
        : "space"                                        // name invisible content
      : deletedText.replaceAll("\n", " ").trim();        // flatten multi-line kills to one utterance
  pushAnnouncement(spoken);
}

// Mapping: jXs→announceDeletedText, e→deletedText, t→mask, cVr→pushAnnouncement
```

The three call sites are exactly the three kill-ring operations named in the bullet, and each
passes the input's `mask` prop (`mask: u = ""`, `:559733`) as the second argument:

| Line | Editor operation | Keys |
|---|---|---|
| `:559805` | `deleteToLineEnd()` | `Ctrl+K` |
| `:559809` | `deleteToLineStart()` | `Ctrl+U`, `Cmd+Backspace` |
| `:559821` | `deleteWordBefore()` | `Ctrl+W`, `Option+Delete` |

### [Decision] Speak the text, unless it is masked

**What it does:** converts a kill-ring deletion into one spoken utterance.

**How it works:**
1. Empty deletion → nothing. Pressing `Ctrl+W` on an empty prompt should not produce speech.
2. **If `mask` is non-empty the actual text is never spoken** — only the literal word `deleted`.
   `mask` is the password/secret-entry prop; the same value the renderer substitutes for every
   visible character. This is the single most important branch in the function and it is the
   *first* content branch, before any formatting work.
3. Whitespace-only deletions get a *name* rather than being read as silence: `new line`, `tab`,
   `space` (checked in that order, so a deletion containing both a newline and a tab is announced as
   `new line` — the structurally more significant edit).
4. Non-empty text has newlines flattened to spaces and is then trimmed. A screen reader given a
   multi-line string in an announcement row would otherwise be split across rows by the wrapper,
   producing several utterances for one `Ctrl+U`.
5. Only the `Ctrl+U` path additionally shows the visual hint `Ctrl+Y to paste deleted text`
   (`:559813`, a **carryover** string: 220=1 / 193=1) and only when `ze.length >= 3`.

**Why this approach:**
- The ordering `mask` check → whitespace naming → text is a strict privacy-then-usability
  precedence. Getting it the other way round would leak a password fragment into the speech
  channel, where it is also often echoed to a Bluetooth headset.
- Naming whitespace is the whole point of the feature. A user who presses `Ctrl+W` and hears
  nothing cannot distinguish "deleted a space" from "the key did nothing".
- Announcing the *content* rather than a count ("deleted 7 characters") means the user can verify
  the edit and, if wrong, reach for `Ctrl+Y`. It also composes with the hint at `:559813`.

**Key insight:** the second parameter being `mask` and not "the replacement text" is easy to
misread — the call sites `jXs(ze, u)` look like `(removed, inserted)`. It is `(removed, maskChar)`.
That distinction is the difference between a privacy control and a formatting hint.

---

## 6. Permission-mode announcements (`.210`)

`.210`: *"Screen reader mode now announces permission mode changes aloud when cycling modes with
Shift+Tab."* The scoping pass filed this UNANCHORED (it probed `ariaLive`/`axAnnounce`, both 0).
The real anchor is the announcement queue, at `:754305` inside `handleCycleMode`:

```javascript
let { context: xn } = $5f(r, ft, "shift_tab");
if ((cVr(`[${Yue(Wt)} on]`), O("tengu_mode_cycle", { to: fe(Wt) }), !CS())) be("mode_switch");
```

`Yue(mode)` (`:58478-58480`) reads the `indicator` field of the permission-mode descriptor table
`dWl` (`:58495-…`), which is the *spoken* label as distinct from `title` (the picker label) and
`symbol` (the glyph):

| mode | `title` | `indicator` (announced) | `symbol` |
|---|---|---|---|
| `default` | `Manual` | `manual mode` | `X4r` = `⏸` (`:58419`) |
| `plan` | `Plan` | `plan mode` | `⏸` |
| `acceptEdits` | `Accept edits` | `accept edits` | `⏵⏵` |
| `bypassPermissions` | `Bypass Permissions` | `bypass permissions` | `⏵⏵` |

So Shift+Tab pushes e.g. `[accept edits on]`. `indicator: "manual mode"` is **220=1 / 193=0** — the
`.200` rename of `default` → `Manual` and this table are the same change; the `indicator` field is
what makes the mode *speakable* at all.

The matching footer badge at `:751172` shows the other half of the design:

```javascript
children: [Mn.jsxs(h, { "aria-hidden": !0, children: [e1e(sne), " "] }), Yue(sne), " on", h8f]
```

The **glyph is `aria-hidden` and the indicator text is not** — the eye gets `⏸ manual mode on`, the
screen reader gets `manual mode on`. This one line is the clearest single illustration of the
`.200` bullet *"decorative glyphs are now hidden, transcript symbols read as short labels"*, and it
is measurable across the whole UI: **`"aria-hidden": !0` is 220=93 / 193=40** and
**`"aria-label"` is 220=31 / 193=19**. 53 new hidden decorations and 12 new labels.

---

## 7. Tables read as sentences (`.200`)

`.200`: *"Improved screen-reader output: … nested tables read as `Header: value.` lines."*

The markdown renderer `d2` (`:635788`) gained a `screenReader` option (`:635795`, threaded to
blockquote `:635809`, list `:635913`, list_item `:635927`) and its `table` case short-circuits:

```javascript
case "table": {
  ...
  if (l) return Laa(u.header.map((g) => p(g.tokens)),
                    u.rows.map((g) => g.map((y) => p(y.tokens)))) + oq + oq;   // :636000-636008
  ...  // otherwise: box-drawing table
}
```

```javascript
// ============================================
// renderTableAsSentences - serializes a markdown table to "Header: value." utterances
// Location: cli_inner_pretty.js:636191-636210
// ============================================

// ORIGINAL (for source lookup):
function Laa(e, t) {
  function r(s) { return s.replace(/\s+/g, " ").trim(); }
  function n(s) { return /[.!?…]["')\]]*$/.test(s) ? s : `${s}.`; }
  function o(s) {
    return s.map((a, l) => {
        let c = r(e[l] ?? ""), u = r(a);
        if (!c && !u) return null;
        return n(c ? `${c}: ${u}` : u);
      }).filter((a) => a !== null).join(" ");
  }
  return (t.length > 0 ? t.map(o) : [e.map(r).filter(Boolean).map(n).join(" ")])
    .filter((s) => s.length > 0).join(oq);
}

// READABLE (for understanding):
function renderTableAsSentences(headers, rows) {
  function collapse(s) { return s.replace(/\s+/g, " ").trim(); }
  function terminate(s) { return /[.!?…]["')\]]*$/.test(s) ? s : `${s}.`; }
  function rowToSentences(cells) {
    return cells.map((cell, col) => {
        let header = collapse(headers[col] ?? ""), value = collapse(cell);
        if (!header && !value) return null;                     // skip fully-empty columns
        return terminate(header ? `${header}: ${value}` : value);
      }).filter((s) => s !== null).join(" ");
  }
  return (rows.length > 0
            ? rows.map(rowToSentences)                          // one line per data row
            : [headers.map(collapse).filter(Boolean).map(terminate).join(" ")])  // header-only table
         .filter((line) => line.length > 0).join("\n");
}

// Mapping: Laa→renderTableAsSentences, e→headers, t→rows, r→collapse, n→terminate,
//          o→rowToSentences, oq→"\n" (:636213)
```

### [Decision] Why append a period

**What it does:** guarantees every `Header: value` fragment ends in sentence-final punctuation.

**How it works:** `terminate` tests `/[.!?…]["')\]]*$/` — terminal punctuation optionally followed by
a closing quote, paren or bracket — and appends `.` only if absent. Applied per *cell*, then cells
are joined with a single space and rows with a newline.

**Why this approach:** speech synthesisers derive prosody from punctuation. Without the period,
`Name: Alice Role: Admin Since: 2024` is one flat run-on utterance and the listener cannot tell
where one field ends. With it, each field gets a sentence-final fall and a short pause. The
allowance for a trailing `"` / `)` / `]` avoids the ugly `see (RFC 7231).` → `see (RFC 7231)..`
double-period on cells that already end in punctuation inside a bracket. Skipping columns where
*both* header and value are blank is what handles the layout-only spacer columns that markdown
tables in tool output frequently carry.

**Key insight:** the function throws away *all* two-dimensionality. There is no attempt at a
navigable table model (there is no such thing over stdout), so it commits fully to the linear
reading and spends its complexity budget on making that reading prosodically correct instead.

For the non-screen-reader table path — the 200-row cap and the per-cell memo that fixed the
streaming freeze — see [terminal_rendering.md](terminal_rendering.md) §5.

---

## 8. The audible bell (`.211`) — screen-reader mode now *preserves* a setting

`.211`: *"Fixed screen reader users losing the audible terminal bell after `/terminal-setup` or
onboarding terminal setup."* `audible bell` is **220=5 / 193=0**.

2.1.193's `/terminal-setup` for Terminal.app (`dOd`, `:185653-185678 (193)`) unconditionally called
the bell-disabling helper and printed `- Switched to visual bell` (`:185676 (193)`).

2.1.220's `kV_` (`:558487-558520`) reads `r = kL()` up front and:

```javascript
let t = (SRl() ?? 0) >= 27,          // macOS version already supports Shift+Return
  r = kL();                           // screen-reader mode
if (t && r)
  return `No Terminal.app changes needed.  ...  screen-reader mode leaves the audible bell setting unchanged.`;
...
let u = t ? !1 : await vyp(c),        // Option-as-Meta:  skip if the OS already handles it
  d = r ? !1 : await Ayp(c);          // bell disable:    skip if a screen reader is in use
...
if (!r) f.push(to("success", e)("- Disabled the audible bell"));
else f.push(wt.dim("- Left the audible bell setting unchanged (screen-reader mode uses it)"));
```

`Left the audible bell` is **220=1 / 193=0**. The related `/terminal-setup` description string also
gained `(skipped in screen-reader mode)` at `:498045`.

**Why:** the bell is not decoration for a screen-reader user — it is the *only* non-speech
completion cue available in a terminal. Disabling it as a flicker/annoyance fix (the original
rationale) removes an accessibility affordance. The two-condition early return at `:558490` is the
"there is literally nothing left to do" case, and it is worth noting that it produces a *positive*
message rather than silently doing nothing, so a screen-reader user running `/terminal-setup` hears
confirmation rather than wondering whether the command ran.

---

## 9. Screen-reader mode disables the fullscreen TUI, and exports itself to children

Two more consumers of `kL()` worth naming:

**TUI auto-off.** The fullscreen-mode resolver `m8e` (`:164958`) returns a *reason string*, and
screen-reader mode is the first check after the background-session force
(`:164959-164972`):

```javascript
if (Z.CLAUDE_CODE_SESSION_KIND === "bg") return "bg_forced_on";
if (kL()) return "sr_auto_off";
if (kZi()) return "env_off";
if (Z.CLAUDE_CODE_NO_FLICKER === !0) return "env_on";
if (Nxe(e)) return "tmux_cc_auto_off";
if (xZi()) return "win_ssh_auto_off";
switch (eo().tui) { case "fullscreen": return "settings_on"; case "default": return "settings_off"; }
if (e.downsellGateCached ?? Ke("tengu_amber_creek", !1)) return "downsell_on";
return (e.gbGateCached ?? Ke("tengu_pewter_brook", !1)) ? "gb_on" : "gb_off";
```

`eau(reason)` (`:164974-164991`) maps `"sr_auto_off"` → `"default"`. Screen-reader mode therefore
**outranks the user's own `tui: "fullscreen"` setting and the `CLAUDE_CODE_NO_FLICKER=1` env
override**, because the alternate screen buffer is fundamentally hostile to a screen reader: it has
no scrollback, so previously-spoken content is unreachable. Ordering matters here and the ordering
is right — an accessibility requirement that a preference can override is not a requirement. (The
one thing that outranks *it* is `CLAUDE_CODE_SESSION_KIND === "bg"`, because a background worker's
"fullscreen" is a PTY nobody is reading with a screen reader.)

The renderer's own flag is set from the same predicate: `:568803`
`r.isScreenReaderEnabled = kL()`, and the ink instance falls back to `INK_SCREEN_READER` when the
host does not pass one (`:257902`). Two visible consequences inside the renderer: the cursor-hide
sequence is suppressed (`:258059`, `:258076`) and the whole render is routed to
`onRenderScreenReader()` (`:258093-258094`).

**Inheritance by self-spawn.** `Ast` (`:156246-156249`) returns
`{ CLAUDE_AX_SCREEN_READER: "1" }` when the mode is on, and `{}` otherwise. This is merged into the
environment of child Claude Code processes (background workers, the agent view). It is
**carryover** (`pIe`, `:137311-137314 (193)`) — worth stating because it means the *inheritance*
half of the feature was already correct in 193; only the announcement half was missing.

---

## 10. What I could not anchor

- **`.200` `/mcp` server list focus tracking for screen readers and magnifiers.** `srLabel` is
  220=2 / 193=0 (`:801902`, `:807726`) but both 220 sites are in the *agent view* row renderer, not
  `/mcp`. I could not find an `/mcp`-specific anchor; the bullet may be served by the generic
  cursor-parking path (`computeScreenReaderPark`, carryover) plus a focus change I could not isolate.
- **`.218` "plugin and settings panels not moving the terminal cursor to the focused row".** The
  primitive is there and is carryover: `declareCursor` is **220=4 / 193=4** at the same four sites,
  `cursorDeclaration` 5/5, `setCursorDeclaration` 2/2. So the fix must be a *new consumer* in the
  plugin/settings panel components, which I could not isolate without a literal. Recorded as
  UNANCHORED rather than guessed.
- **`.217` "the thinking status row re-rendering every few seconds"** — no literal; the timer is a
  plain interval.
- **`.200`/`.203` decorative-glyph hiding beyond the footer badge.** The aggregate counts are solid
  (`"aria-hidden": !0` 220=93 / 193=40, `"aria-label"` 220=31 / 193=19, §6) but I did not enumerate
  the 53 new hidden decorations individually; §6 documents the one representative site.

For the *non*-screen-reader half of this window's rendering work — the tmux synchronized-output
change, the mouse tri-state, the external-editor terminal handoff, the markdown-table rewrite,
hyperlinks and OSC-52 — see [terminal_rendering.md](terminal_rendering.md). For the input-path
bullets (vim, paste, `?`, `Ctrl+R`) see [vim_and_input.md](vim_and_input.md).

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New rows from this document are staged in
> [symbol_additions_v2_1_220_accessibility_ui.md](../00_overview/symbol_additions_v2_1_220_accessibility_ui.md).

Key functions in this document:
- `ScreenReaderModeDetector` (`ytu`, `:156198`) - flag/env/settings resolver that also records the activation source
- `screenReaderDetector` (`Cno`, `:156271`) - the singleton instance
- `isScreenReaderMode` (`kL`, `:156221`) - exported predicate, 15 call sites
- `getScreenReaderModeBanner` (`_tu`, `:156224`) - `[Screen Reader Mode: on via <source>]`
- `beginStartupQuietWindow` (`Stu`, `:156231`) - stamps the quiet-window start
- `endStartupQuietWindow` (`Hno`, `:156234`) - latches it closed (timer or first keystroke)
- `getStartupQuietRemainingMs` (`Etu`, `:156237`) - `min(CLAUDE_AX_STARTUP_QUIET_MS ?? 3000, 600000)`
- `getScreenReaderEnvForChildren` (`Ast`, `:156246`) - carryover env inheritance
- `pushAnnouncement` (`cVr`, `:156250`) - 16-slot oldest-dropped announcement queue
- `drainAnnouncements` (`vtu`, `:156253`) - swap-and-clear drain
- `announceDeletedText` (`jXs`, `:559690`) - kill-ring announcements with the mask privacy guard
- `renderNodeToScreenReaderOutput` (`LJr`, `:257375`) - flattener returning `{text, preserveRanges}`
- `flattenBoxChildren` (`wuy`, `:257417`) - flex-direction-aware child join
- `shiftRanges` (`Lho`, `:257411`) - preserve-range offset bookkeeping
- `sanitizeForScreenReader` (`Dho`, `:257355`) - C0/C1/DEL/bidi scrubber for the speech channel
- `buildAccessibilityProps` (`AJr`, `:253924`) - `aria-*` prop → `node.accessibility` factory
- `isGraphemeBoundary` (`Ouy`, `:257792`) - `Intl.Segmenter` boundary check for the incremental echo
- `reportTreeDepthExceeded` (`Ysr`, `:254897`) - once-per-site `MAX_TREE_DEPTH` report
- `useScreenReaderEnabled` (`Ea`, `:260431`) - React context hook; provider at `:258858`
- `renderTableAsSentences` (`Laa`, `:636191`) - `Header: value.` serializer
- `getPermissionModeIndicator` (`Yue`, `:58478`) - the *spoken* mode label
- `renderMarkdownToken` (`d2`, `:635788`) - markdown renderer carrying the `screenReader` option
- `setupTerminalApp` (`kV_`, `:558487`) - `/terminal-setup` with the bell preservation branch
- `resolveFullscreenReason` (`m8e`, `:164958`) - returns `"sr_auto_off"` second, after `"bg_forced_on"`
