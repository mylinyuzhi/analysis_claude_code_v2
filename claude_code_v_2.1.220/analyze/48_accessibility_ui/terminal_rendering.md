# Terminal rendering, mode handoff and mouse control in 2.1.220

**Bundles** (see [`_CONVENTIONS.md`](../_CONVENTIONS.md) §1): `T = 2.1.220` (872,596 lines),
`B = 2.1.193` (718,679 lines). Every `cli_inner_pretty.js:<line>` below without a `(193)` tag was read
in the 2.1.220 bundle by me.

---

## 0. The single most important finding: the Ink renderer core did not change

Roughly fifteen bullets in this window read like renderer work — *"Improved terminal layout and
rendering performance"* (`.211`), *"Fixed the terminal freezing and keystrokes lagging while
streaming"* (`.207`), *"live-preview updates no longer re-render the whole screen"* (`.203`),
*"Input responsiveness while agent task lists update"* (`.208`). Before writing any of them up, I
counted the renderer core's own identifiers in both builds:

| Renderer-core anchor | 2.1.220 | 2.1.193 |
|---|---|---|
| `scheduleRender` | 9 | 9 |
| `writableLength` (backpressure) | 6 | 6 |
| `stylePool` | 38 | 38 |
| `charPool` | 23 | 23 |
| `hyperlinkPool` | 25 | 25 |
| `prevFrameContaminated` | 12 | 12 |
| `livePreview` | 5 | 5 |
| `autoScroll` | 14 | 14 |
| `jumpToBottom` | 4 | 4 |
| `useMemoCache` (React Compiler runtime) | 6 | 6 |

**The frame diffing, the cell pools, the write scheduler, the backpressure handling and the React
Compiler are all carryover.** So are the paste tokenizer and the key parser (see
[vim_and_input.md](vim_and_input.md) §6.2). The performance bullets in this window are **not**
renderer-core changes; where they are anchorable at all they land in the *component* layer — the
markdown table renderer (§4) is the clearest case, and it is a genuine rewrite.

This is a useful negative result: it means "improved rendering performance" bullets in this window
should be read as *component-level* work, and it explains why the scoping pass found no literal for
most of them. I record them as UNANCHORED in the README ledger rather than attaching them to
carryover machinery.

What *did* change in the vendored Ink fork, in full:

1. the screen-reader render path (documented in [screen_reader_mode.md](screen_reader_mode.md));
2. `altScreenMouseTracking` going from `boolean` to a tri-state string (§2);
3. two new terminal-handoff methods, `prepareTerminalForHandoff` / `restoreTerminalAfterHandoff` (§3);
4. bracketed-paste and theme-notification modes being reset on `enterAlternateScreen` (§3);
5. `MAX_TREE_DEPTH = 256` on the three recursive walkers (covered in the screen-reader doc §3.3).

---

## 1. Synchronized output under tmux (`.200`, and the `.212` correction)

`.200`: *"Fixed rendering flicker under tmux 3.4+ by enabling synchronized terminal output."*
`.212`: *"Corrected an earlier release note (2.1.200): tmux through the 3.6 series lacks
synchronized output; newer tmux with support is detected automatically."*

Scoping filed `.212` as CARRYOVER "pure release-note correction, no code delta", and filed `.200` as
DELTA against `DECRQM(2026)` (220=1 / 193=1). Both readings are half right. The probe *is* carryover;
the **consumer** is not.

DECSET 2026 is the synchronized-update mode: `ESC[?2026h` tells a terminal "buffer everything until
I send `ESC[?2026l`", which eliminates tearing on a partial repaint.

### 1.1 The probe is byte-identical carryover

`rUu` (`:254316-254342`) sends `XTVERSION`, then — if a reply came back and the terminal is not
Apple_Terminal — a `DECRQM` query for mode 2026, and records `status === 1 || status === 2` as
"supported". Under tmux it additionally shells out to
`tmux display-message -p '#{client_termtype}'` to learn the *outer* terminal's identity, because
tmux answers XTVERSION with its own name. 193's `E1i` (`:171687-171713 (193)`) is the same function,
line for line, including the `client_termtype` shell-out (`client_termtype` is 220=1 / 193=1).

### 1.2 The consumer is the delta

```javascript
// ============================================
// isSynchronizedOutputSupported - decides whether DECSET 2026 may be used
// Location: cli_inner_pretty.js:253384-253417  (193: UB, :160036-160068)
// ============================================

// ORIGINAL (for source lookup):
function f2u() {
  if (Z.TMUX && tho === void 0) return;
  return xee();
}
function xee() {
  if (process.env.CLAUDE_BG_BACKEND === "daemon") return AS()?.syncOutput !== !1;
  if (Z.TMUX) return tho === !0;
  if (Yt(process.env.CLAUDE_CODE_FORCE_SYNC_OUTPUT)) return !0;
  let e = process.env.TERM_PROGRAM, t = process.env.TERM;
  if (e === "iTerm.app" || e === "WezTerm" || e === "WarpTerminal" || e === "ghostty" ||
      e === "contour" || e === "vscode" || e === "alacritty" || e === "mintty" ||
      e === "rio" || e === "Tabby") return !0;
  ...
  if (tho) return !0;
  return !1;
}

// READABLE (for understanding):
function getSynchronizedOutputTriState() {          // used for the daemon handoff payload
  if (typedEnv.TMUX && probeResult === undefined) return undefined;   // UNKNOWN, not false
  return isSynchronizedOutputSupported();
}
function isSynchronizedOutputSupported() {
  if (process.env.CLAUDE_BG_BACKEND === "daemon") return hostCapabilities()?.syncOutput !== false;
  if (typedEnv.TMUX) return probeResult === true;   // <-- 193 had: if (process.env.TMUX) return false;
  if (parseBoolean(process.env.CLAUDE_CODE_FORCE_SYNC_OUTPUT)) return true;
  ... same allow-list of terminal names / TERM strings / VTE_VERSION >= 6800 ...
  if (probeResult) return true;
  return false;
}

// Mapping: f2u→getSynchronizedOutputTriState, xee→isSynchronizedOutputSupported,
//          tho→probeResult (set by p2u, :253377, from rUu :254336), AS→hostCapabilities,
//          Yt→parseBoolean
```

2.1.193's second line was:

```javascript
if (process.env.TMUX) return !1;         // :160038 (193)
```

— an **unconditional refusal**. Because it returned before reaching `if (FMi) return !0;`
(`:160066 (193)`), the probe result was computed, logged, and then *ignored* whenever `TMUX` was set.

### [Decision] Why tmux moved from deny to probe-gated, and why the wrapper returns `undefined`

**What it does:** decides whether Claude Code may wrap frames in `ESC[?2026h … ESC[?2026l` when
running inside tmux.

**How it works:**
1. Under the background daemon, the answer comes from the *host*'s reported capabilities
   (`AS()?.syncOutput !== !1`) — the worker has no terminal of its own to probe.
2. Under tmux, the answer is `probeResult === true` — strictly the runtime DECRQM answer, with
   `undefined` (probe not yet run) reading as `false`.
3. Only outside tmux does the static terminal allow-list apply.
4. `f2u()` — the value shipped to the daemon in the terminal-capability handoff payload
   (`:678294`, schema at `:330181`) — returns `undefined` rather than `false` while the probe is
   pending under tmux. The schema field is `v.boolean().optional()`, so `undefined` is a legal
   "unknown".

**Why this approach:**
- The blanket tmux deny in 193 was correct *at the time* and wrong *in general*. tmux itself did not
  implement DECSET 2026 through the 3.6 series, and — worse — a tmux that does not know the mode may
  pass it through to the outer terminal, which then buffers output tmux is not going to un-buffer.
  Denying was the safe default when there was no way to tell.
- The probe removes the need to guess. `DECRQM(?2026$p)` returns `status=1` (set) or `status=2`
  (reset) only from a terminal that *implements* the mode; an unknown mode returns `status=0`, and no
  reply at all means the terminal ignored the query. Both of those read as unsupported here.
- Under tmux specifically the probe is the **only** signal accepted, and the static allow-list is
  skipped. That is the important asymmetry: knowing the outer terminal is ghostty tells you nothing,
  because the multiplexer in between is what has to forward the mode.
- Returning `undefined` for the daemon handoff avoids a worse bug than flicker: a definite `false`
  cached in the daemon's host-capability record would suppress synchronized output for the *whole
  session*, including after the probe came back positive.

**Key insight:** this pair of changes is precisely what the `.212` release-note correction describes,
which makes `.212`'s bullet a **documentation fix for a code change that shipped in `.200`** —
not, as scoping recorded, a note with no code behind it. The code says exactly what `.212` says:
tmux is not assumed to support synchronized output; support is detected. The three sites that
consume it are the fullscreen writer's frame open/close (`:689576`, `:689612`, `:689635`) and the
plain renderer's early-out (`:258085`).

`CLAUDE_CODE_FORCE_SYNC_OUTPUT` remains the manual override, and note its position: **after** the
tmux branch, so it cannot force the mode on inside tmux. A user who knows their tmux supports 2026
but whose probe fails has no override. That is a deliberate ordering choice and arguably the one
rough edge here.

---

## 2. Mouse control: from a boolean to a tri-state (`.195`, `.203`, `.208`)

Three bullets, one mechanism.

- `.195`: *"Added `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` to disable click/drag/hover, keep wheel scroll."*
- `.203`: *"Fixed attached background sessions ignoring `CLAUDE_CODE_DISABLE_MOUSE` and
  `CLAUDE_CODE_DISABLE_MOUSE_CLICKS` opt-outs."*
- `.208`: *"Added mouse-click support for multi-select menus and 'Other' input rows in fullscreen
  mode."*

`CLAUDE_CODE_DISABLE_MOUSE_CLICKS` is **220=3 (`:31082` accessor, `:58152` env allow-list,
`:164999` resolver) / 193=0**. `CLAUDE_CODE_DISABLE_MOUSE` is 220=6 / **193=2** — carryover, with
four new sites.

### 2.1 The escape sequences

```javascript
// ============================================
// mouse tracking mode -> DEC private mode sequences
// Location: cli_inner_pretty.js:253443-253483
// ============================================

// ORIGINAL (for source lookup):
function AFe(e) {
  switch (e) {
    case "full":   return Yly;
    case "scroll": return Xly;
    case "off":    return "";
  }
}
ew = { CURSOR_VISIBLE: 25, ALT_SCREEN: 47, ALT_SCREEN_CLEAR: 1049, MOUSE_NORMAL: 1000,
       MOUSE_BUTTON: 1002, MOUSE_ANY: 1003, MOUSE_SGR: 1006, FOCUS_EVENTS: 1004,
       BRACKETED_PASTE: 2004, THEME_NOTIFY: 2031, SYNCHRONIZED_UPDATE: 2026 };
((Yly = d7(ew.MOUSE_NORMAL) + d7(ew.MOUSE_BUTTON) + d7(ew.MOUSE_ANY) + d7(ew.MOUSE_SGR)),
 (Xly = d7(ew.MOUSE_NORMAL) + d7(ew.MOUSE_SGR)),
 (Fpe = qSe(ew.MOUSE_SGR) + qSe(ew.MOUSE_ANY) + qSe(ew.MOUSE_BUTTON) + qSe(ew.MOUSE_NORMAL)));

// READABLE (for understanding):
function mouseTrackingEnableSeq(mode) {
  switch (mode) {
    case "full":   return MOUSE_FULL_ON;    // DECSET 1000 + 1002 + 1003 + 1006
    case "scroll": return MOUSE_SCROLL_ON;  // DECSET 1000 + 1006          <- no 1002, no 1003
    case "off":    return "";
  }
}
// MOUSE_OFF = DECRST 1006 + 1003 + 1002 + 1000  (reverse order of enabling)

// Mapping: AFe→mouseTrackingEnableSeq, Yly→MOUSE_FULL_ON, Xly→MOUSE_SCROLL_ON, Fpe→MOUSE_OFF,
//          d7→decSet (:253437), qSe→decReset (:253440), ew→DEC_MODES (:253456)
```

2.1.193 had **one** sequence — `oxe = SET(1000)+SET(1002)+SET(1003)+SET(1006)` at `:160018 (193)`,
identical to 220's `Yly` — and the renderer field was a plain `boolean`
(`altScreenMouseTracking = !1`, `:174958 (193)`), used as
`(this.altScreenMouseTracking ? oxe : "")` at four sites.

The `"scroll"` sequence omits **1002** (button-event tracking: reports motion *while a button is
held*, i.e. drag) and **1003** (any-event tracking: reports every motion, i.e. hover). It keeps
**1000** (normal tracking, which is what carries wheel events as buttons 64/65) and **1006** (SGR
extended coordinates, needed past column 223). That is exactly the bullet's
"disable click/drag/hover, keep wheel scroll": drag and hover are switched off at the *protocol*
level, and clicks are switched off at the *application* level (§2.3).

### 2.2 The resolver, and the `.203` fix

```javascript
// ============================================
// getMouseTrackingMode - env-driven tri-state
// Location: cli_inner_pretty.js:164997-165001  (193: Grt, :156466-156470)
// ============================================

// ORIGINAL (for source lookup):
function ybe() {
  if (Z.CLAUDE_CODE_DISABLE_MOUSE !== void 0) return Z.CLAUDE_CODE_DISABLE_MOUSE ? "off" : "full";
  if (Z.CLAUDE_CODE_DISABLE_MOUSE_CLICKS !== void 0) return Z.CLAUDE_CODE_DISABLE_MOUSE_CLICKS ? "scroll" : "full";
  return "full";
}

// READABLE (for understanding):
function getMouseTrackingMode() {
  if (typedEnv.CLAUDE_CODE_DISABLE_MOUSE !== undefined)
    return typedEnv.CLAUDE_CODE_DISABLE_MOUSE ? "off" : "full";          // the blunt switch wins
  if (typedEnv.CLAUDE_CODE_DISABLE_MOUSE_CLICKS !== undefined)
    return typedEnv.CLAUDE_CODE_DISABLE_MOUSE_CLICKS ? "scroll" : "full";
  return "full";
}

// Mapping: ybe→getMouseTrackingMode, Z→typedEnv (coerces "0"/"false"/"" to false)
```

193's `Grt` (`:156466-156470 (193)`):

```javascript
function Grt() {
  if (Be.CLAUDE_CODE_SESSION_KIND === "bg") return !0;             // <-- the .203 bug
  if (Be.CLAUDE_CODE_DISABLE_MOUSE !== void 0) return !Be.CLAUDE_CODE_DISABLE_MOUSE;
  return !0;
}
```

**The first line is the `.203` bug, verbatim.** A background session forced mouse tracking on before
looking at either env var. Because an *attached* background session renders through the same
component, attaching to a bg job re-enabled mouse reporting even though the user had opted out.
220 deletes that branch: the env vars are now unconditional.

Note also that both env vars are read through `Z` (the typed env accessor), so
`CLAUDE_CODE_DISABLE_MOUSE_CLICKS=0` is a real *off* switch for the opt-out, not just an absence —
which matters because these two vars are in the settings/env allow-list at `:58151-58152`, meaning a
managed-settings `env` block can set them and a user can override back.

### 2.3 Why "scroll" also needs an application-level check

DECSET 1000 still reports button *presses*. Turning off 1002/1003 removes drag and hover but not
clicks, so the mode has to be consulted a second time in the components that act on clicks:

```javascript
Y9k = ybe() === "full" && K9k,        // :690735, inside the jump-to-bottom pill
```

`K9k = Gd.useSyncExternalStore(Ytr, $Rt)` (`:690727`) — `$Rt` (`:165006`) returns `CZi`, a one-way
latch set by `HZi()` the first time a real mouse report is *observed*. So the click affordance is
shown only when the mode allows clicks **and** the terminal has actually proved it sends them. That
second condition is why a user in a mouse-less terminal never sees a "(click)" hint that would do
nothing.

The `.208` bullet (click support for multi-select menus and "Other" rows) is the same
`mouseTracking={ybe()}` prop reaching two more component trees — `:824353`
(`No.jsx(cet, { mouseTracking: ybe(), children: _t })`) and `:833272`/`:833275`, plus the
fullscreen host at `:802418`. In 193 the equivalent sites (`:690803 (193)`, `:695640 (193)`) passed
the boolean.

### [Decision] Three states instead of two

**Why this approach:** the natural design is one boolean. It fails because the three things a
terminal mouse does have different costs to different users:

| | wheel scroll | click | drag/hover |
|---|---|---|---|
| value to the user | high — it is how you read scrollback | medium | low |
| cost | none | breaks terminal text selection (the app eats the drag) | floods stdin with motion reports |

Users who complain about mouse capture overwhelmingly mean **"I can no longer select text with my
mouse"** — which is 1002/1003. Turning the whole thing off to fix that also removes wheel scrolling,
which is a strictly worse terminal. The tri-state exists so the common complaint has a fix that does
not cost the common convenience. `CLAUDE_CODE_DISABLE_MOUSE` is kept as the blunt instrument and is
checked *first*, so a user who wants nothing gets nothing.

---

## 3. Handing the terminal to an external editor (`.210`, `.216`)

Two bullets, one pair of methods:

- `.210`: *"Fixed paste markers leaking into external editors opened from Claude Code, which could
  appear as stray È/É characters around pasted text."*
- `.216`: *"Fixed mouse and focus garbage in the terminal while a GUI editor from `/memory`,
  `/plan`, `/keybindings`, or Ctrl+G is open."*

Both were filed UNANCHORED by scoping (`È`/`É`/`pasteMarker` all 0; `GUI editor` 0). The anchors are
two net-new method names: `prepareTerminalForHandoff` and `restoreTerminalAfterHandoff`, both
**220=2 / 193=0**.

### 3.1 The handoff path

`Dmt` (`:455136-455177`, the editor spawner) has two branches: an editor that wants the alternate
screen gets `enterAlternateScreen()`, and everything else gets the handoff pair:

```javascript
let o = RUs(n) === void 0;                        // :455148  - is this a known "GUI"/non-TUI editor?
if (o) r.enterAlternateScreen();
else r.prepareTerminalForHandoff();
try { ... NFd.spawnSync(a, [...l, e], { stdio: "inherit" }) ... }
finally { if (o) r.exitAlternateScreen(); else r.restoreTerminalAfterHandoff(); }
```

```javascript
// ============================================
// prepareTerminalForHandoff / restoreTerminalAfterHandoff - release input modes to a child process
// Location: cli_inner_pretty.js:258066-258073
// ============================================

// ORIGINAL (for source lookup):
prepareTerminalForHandoff() {
  (this.pause(),
    this.options.stdout.write((this.altScreenMouseTracking !== "off" ? Fpe : "") + IPt),
    this.suspendStdin());
}
restoreTerminalAfterHandoff() {
  (this.resumeStdin(), this.options.stdout.write(AFe(this.altScreenMouseTracking) + EJr), this.resume());
}

// READABLE (for understanding):
prepareTerminalForHandoff() {
  this.pause();                                    // stop the render scheduler
  this.options.stdout.write(
    (this.altScreenMouseTracking !== "off" ? MOUSE_OFF : "")   // DECRST 1006 1003 1002 1000
    + FOCUS_EVENTS_OFF                                          // DECRST 1004
  );
  this.suspendStdin();                             // stop reading
}
restoreTerminalAfterHandoff() {
  this.resumeStdin();
  this.options.stdout.write(mouseTrackingEnableSeq(this.altScreenMouseTracking) + FOCUS_EVENTS_ON);
  this.resume();
}

// Mapping: Fpe→MOUSE_OFF (:253483), IPt→FOCUS_EVENTS_OFF (:253474), EJr→FOCUS_EVENTS_ON (:253473)
```

193's `g6` (`:504918-504959 (193)`) did only `(n.pause(), n.suspendStdin())` on the way in and
`(n.resumeStdin(), n.resume())` on the way out. It stopped *reading* stdin but left the terminal's
mouse-reporting and focus-event **modes set**. The terminal therefore kept emitting
`ESC[<0;12;4M` mouse reports and `ESC[I` / `ESC[O` focus in/out sequences straight into the child
editor, which displays them as garbage. That is `.216` exactly — and it is also the same family as
`.203`'s *"Fixed literal `^[[I` / `^[[O` escape codes being printed when reattaching to a background
session"* (`?1004` is 220=2 / 193=2, so that bullet's own literal is carryover).

### 3.2 The bracketed-paste leak

`enterAlternateScreen` is the other handoff path, and here the delta is two constants:

```javascript
// 2.1.220, :258035-258047
enterAlternateScreen() {
  (this.pause(),
    this.options.stdout.write(
      mFe + e9e +                                              // pop kitty flags, reset modifyOtherKeys
        (this.altScreenMouseTracking !== "off" ? Fpe : "") +    // mouse off
        (this.altScreenActive ? "" : "\x1B[?1049h") +
        "\x1B[?1004l" +                                        // focus events off
        Usr +                                                  // DECRST 2004  BRACKETED PASTE OFF   <- NEW
        jsr +                                                  // DECRST 2031  theme notify off      <- NEW
        "\x1B[0m\x1B[?25h\x1B[2J\x1B[H",
    ),
    this.suspendStdin());
}
```

```javascript
// 2.1.193, :175117-175127 (193)
enterAlternateScreen() {
  (this.pause(),
    this.options.stdout.write(
      Zae + gye + (this.altScreenMouseTracking ? sle : "") +
        (this.altScreenActive ? "" : "\x1B[?1049h") +
        "\x1B[?1004l\x1B[0m\x1B[?25h\x1B[2J\x1B[H",            // no 2004l, no 2031l
    ),
    this.suspendStdin());
}
```

The asymmetry in 193 is the bug and it is visible in one glance: `exitAlternateScreen`
(`:175141 (193)`) wrote `Zae + gye + "\x1B[?1004h" + gIn + rte()` where
`gIn = DECSET(2004)` (`:160008 (193)`) — **re-enabling bracketed paste that was never disabled.**
The matching `hIn = DECRST(2004)` existed (`:160009 (193)`) and was simply not called on the entry
path.

### [Decision] Why bracketed paste must be released before a child runs

**What it does:** returns DEC private mode 2004 (and 2031) to the state the child process expects
before handing over the terminal, and restores it afterwards.

**How it works:** with 2004 set, the terminal wraps *every* paste in `ESC[200~` … `ESC[201~`. Those
markers are addressed to whoever set the mode — Claude Code. A child editor that did not set it does
not strip it, so the markers land in the edited buffer around the pasted text. `ESC[?2004l` on entry
and `ESC[?2004h` on exit makes the mode's lifetime match its owner's.

**Why this approach:**
- Modes are terminal-global, not process-scoped. There is no OS mechanism that scopes DECSET to a
  process, so any program that sets one is responsible for clearing it around a `spawnSync` with
  `stdio: "inherit"`. This is the same discipline as restoring raw mode — 193 got raw mode right and
  the DEC modes wrong.
- Doing it on `enterAlternateScreen` rather than in `Dmt` keeps the invariant with the object that
  owns the modes. The renderer knows what it set; the spawner does not.
- 2031 (theme-change notification) is released for the same reason: the terminal would otherwise send
  `ESC[?997;1n` colour-scheme notifications into the editor on a light/dark switch.

**Key insight on the È/É symptom:** the changelog names the glyphs users reported, not the bytes.
`È` is U+00C8 = 200 and `É` is U+00C9 = 201 — the *parameter numbers of the two paste markers*
(`ESC[200~`, `ESC[201~`). What the code proves is that the markers leak; the exact rendering path
that turns `200`/`201` into `È`/`É` depends on the child and the locale and is **not** derivable
from this bundle. I state the mechanism as proven and the glyph derivation as inference.

### 3.3 A third, smaller hardening

`reassertTerminalModes` (`:258576-258582`, **220=2 / 193=0** for the name) re-writes
`Ruo` = `"\x1B(B\x0F"` (`:215968`) — *designate US-ASCII as G0* plus *shift-in* — followed by
`VSe()` (the extended-key-reporting sequence) and the mouse mode. That first constant exists because
a child program that crashed mid-line-drawing can leave the terminal in the DEC graphics charset,
where subsequent ASCII renders as box-drawing characters. Reasserting G0 is cheap insurance on
every resume.

---

## 4. The markdown table renderer was rewritten (`.207`, `.208`)

- `.207`: *"Fixed the terminal freezing and keystrokes lagging while streaming responses containing
  very long lists, tables, paragraphs, or code blocks."*
- `.208`: *"Fixed very large markdown tables stalling rendering or using excessive memory; tables
  over 200 rows show the first 200 with a '… N more rows' notice."*

`… N more rows not shown` is **220=1 (`:636279`) / 193=0**; `truncatedCount` is 220=5 / **193=0**;
`kind: "vertical"` and `kind: "ansi"` are 220=2 / **193=0**.

### 4.1 What 2.1.193 did

193's table rendering lived entirely inside the text markdown renderer's `case "table"`
(`:380713-380753 (193)`). It is 40 lines: measure every column by rendering each cell, then emit
`| … | … |` pipe rows. It has **no row cap**, **no memoisation**, and **no layout fallback**. Worse,
each cell is rendered by `v0(...)` *at least twice* — once inside the width loop (`c(g[f]?.tokens)`
for every row, for every column) and once again when the row is emitted.

That gives roughly `2 × rows × cols` full markdown-token renders per frame, on every frame, for a
table that is still streaming in. A 1,000-row table is 2,000+ renders per keystroke.

### 4.2 What 2.1.220 does

The pipe-table code still exists in `d2` (`:635979-636043`) — the *plain-text* renderer, used where
there is no React tree. But the interactive path now goes through a dedicated layout function:

```javascript
// ============================================
// layoutMarkdownTable - memoised, row-capped, three-strategy column sizing with a card fallback
// Location: cli_inner_pretty.js:636292-636448
// ============================================

// ORIGINAL (for source lookup):
function EUp(e, t, r, n, o, i) {
  let s = Math.max(0, e.rows.length - _Up),
    a = s > 0 ? e.rows.slice(0, _Up) : e.rows,
    l = new Map();
  function c(D) {
    let U = l.get(D);
    if (U !== void 0) return U;
    let W = _Ar(D?.map((q) => d2(q, r, { listDepth: 0, orderedListNumber: null, parent: null,
                                          highlight: n, glueProse: !1, linkCap: o })).join("") ?? "");
    return (l.set(D, W), W);
  }
  function u(D) { return xi(c(D)); }
  if (i) {
    let D = Laa(e.header.map((U) => u(U.tokens)), a.map((U) => U.map((W) => u(W.tokens))));
    if (s > 0) D += `\n${bqo(s)}`;
    return { kind: "ansi", text: D };
  }
  ...
}
var yUp = 4, bbn = 3, zhb = 4, _Up = 200;
function bqo(e) { return `… ${e.toLocaleString()} more ${Et(e, "row")} not shown`; }

// READABLE (for understanding):
function layoutMarkdownTable(table, columns, theme, highlight, linkCap, screenReaderMode) {
  let truncatedCount = Math.max(0, table.rows.length - MAX_TABLE_ROWS),
    rows = truncatedCount > 0 ? table.rows.slice(0, MAX_TABLE_ROWS) : table.rows,
    cellCache = new Map();                                   // keyed by the token ARRAY identity
  function renderCell(tokens) {                              // -> styled ANSI string, memoised
    let hit = cellCache.get(tokens);
    if (hit !== undefined) return hit;
    let out = collapseWhitespace(tokens?.map((t) => renderMarkdownToken(t, theme, {...})).join("") ?? "");
    cellCache.set(tokens, out);
    return out;
  }
  function plainCell(tokens) { return stripAnsi(renderCell(tokens)); }
  if (screenReaderMode) {                                    // see screen_reader_mode.md §7
    let text = renderTableAsSentences(table.header.map((h) => plainCell(h.tokens)),
                                      rows.map((r) => r.map((c) => plainCell(c.tokens))));
    if (truncatedCount > 0) text += "\n" + truncatedRowsNotice(truncatedCount);
    return { kind: "ansi", text };
  }
  ... column sizing, then { kind: "vertical", ... } or box-drawn rows ...
}
var TABLE_PADDING = 4, MIN_COL_WIDTH = 3, MAX_WRAPPED_LINES = 4, MAX_TABLE_ROWS = 200;

// Mapping: EUp→layoutMarkdownTable, _Up→MAX_TABLE_ROWS (:636511), bbn→MIN_COL_WIDTH,
//          zhb→MAX_WRAPPED_LINES, yUp→TABLE_PADDING, bqo→truncatedRowsNotice (:636278),
//          d2→renderMarkdownToken (:635788), Laa→renderTableAsSentences (:636191),
//          _Ar→collapseWhitespace, xi→stripAnsi, Ft→displayWidth
```

### [Algorithm] Four passes over the cells, one render each

**What it does:** lays out a markdown table for a terminal of known width, choosing between a
box-drawn grid and a vertical "card" rendering.

**How it works:**
1. **Cap first.** `rows.slice(0, 200)` happens before anything is measured, so a 50,000-row table
   costs the same as a 200-row one. `truncatedCount` is carried through to whichever renderer runs,
   and appended as `… 49,800 more rows not shown` — with `toLocaleString()` for the thousands
   separator and `Et(n, "row")` for the plural.
2. **Memoise on token-array identity.** `cellCache` is a `Map` keyed by the *token array object*, not
   by a string. That works because the markdown parser produces one token array per cell and the
   layout function receives the same objects on every pass. The cache is per-invocation, which is
   correct — it must not survive a theme or width change.
3. **Four consumers of `renderCell`**, each of which would otherwise be a full render:
   - `d(tokens)` (`:636317`) — the **minimum** width: longest single word.
   - `p(tokens)` (`:636323`) — the **natural** width: the whole cell on one line.
   - `C()` (`:636356`) — the wrapped **line count** probe, to decide grid vs. card.
   - `L(...)` / `H()` (`:636375`, `:636369`) — the actual output.
   With the memo, that is one render per cell instead of four.
4. **Three column-sizing strategies** (`:636341-636354`), chosen by comparing the sum of natural
   widths `A` and the sum of minimum widths `E` against the available width `_`:
   - `A <= _` → use natural widths. Nothing wraps.
   - `E <= _ < A` → start from minimum widths and distribute the slack `_ - E`
     **proportionally to each column's own natural-minus-minimum**, so a column that wants a lot of
     extra room gets a lot of the slack. Wrapping is soft (`hard: false`).
   - `_ < E` → even the longest words do not fit; scale every minimum by `_ / E` and set
     `hard: true`, permitting mid-word breaks.
5. **Card fallback.** If the tallest cell still needs more than `zhb = 4` wrapped lines
   (`R = C() > zhb`, `:636369`), the whole table is re-rendered as `kind: "vertical"` —
   one bolded `Header: value` line per cell, rows separated by a `─` rule of
   `min(width - 1, 40)` (`:636452-636453`), and the same truncation notice at the end.

**Why 200, 4 and 3:**
- **200 rows** is chosen against the *cost per row*, not against a memory budget: each row costs at
  minimum one wrap computation per column, and 200 rows is already several screens of scroll. Past
  that, the user is going to page or grep, not read. It also caps the string the renderer must
  diff each frame, which is the actual freeze mechanism in `.207`.
- **`zhb = 4` wrapped lines** is the grid/card decision boundary. A grid row four lines tall still
  reads as a row; five and the vertical rules stop helping the eye track across, at which point
  labelled cards are strictly more readable.
- **`bbn = 3` minimum column width** is the narrowest column in which a wrapped word plus an ellipsis
  is still recognisable, and it is also the floor applied to the header (`Math.max(_, 3)`), so a
  one-character header never collapses.
- **`yUp = 4` padding** plus `y = 1 + cols * 3` (`:636346`) is the box-drawing chrome: one leading
  `│` plus three characters (`space`, `│`, `space`) per column.

**Key insight:** the memo is the fix for `.207` and the cap is the fix for `.208`, and they are in
the same function because they attack the same product: *cells × passes*. The cap bounds the first
factor and the memo bounds the second. Either alone would have left a table that still stalls —
200 rows × 4 renders is still 800 renders per frame while streaming.

The whole thing is then wrapped in a React-Compiler-memoised component `Eqo` (`:636525-636545`) whose
dependency list is `(highlight, screenReaderEnabled, linkCap, width, theme, token)` — so a table
that has finished streaming is not re-laid-out at all when an unrelated part of the transcript
changes.

---

## 5. Hyperlinks: `assumeSupport` and `FORCE_HYPERLINK` (`.217`)

`.217`: *"Improved footer PR badge links to be clickable hyperlinks even when terminal support can't
be detected (e.g. over ssh/tmux); set `FORCE_HYPERLINK=0` to opt out."*

`assumeSupport` is **220=13 / 193=3** — a partial delta, so the mechanism pre-existed and the
surface grew. But the detection function was also **split in two**, and that split is the fix.

```javascript
// ============================================
// getHyperlinkOverride / supportsHyperlinks - an explicit-answer channel separated from the heuristic
// Location: cli_inner_pretty.js:259584-259610  (193: WC, :176447-176469)
// ============================================

// ORIGINAL (for source lookup):
function out(e) {
  let t = AS()?.hyperlinks;
  if (t !== void 0) return t;
  if ("FORCE_HYPERLINK" in (e?.env ?? process.env))
    return e?.stdoutSupported ?? Vho.default.supportsHyperlink(process.stdout);
  return;
}
function mk(e) {
  let t = out(e);
  if (t !== void 0) return t;
  ... TERM_PROGRAM allow-list / JediTerm / WT_SESSION / tmux >= 3.4 / LC_TERMINAL / kitty ...
  return !1;
}

// READABLE (for understanding):
function getHyperlinkOverride(opts) {                 // -> true | false | undefined ("no explicit answer")
  let hostSays = hostCapabilities()?.hyperlinks;
  if (hostSays !== undefined) return hostSays;        // daemon/attach handoff wins
  if ("FORCE_HYPERLINK" in (opts?.env ?? process.env))
    return opts?.stdoutSupported ?? supportsHyperlinkLib(process.stdout);  // the lib reads FORCE_HYPERLINK=0
  return undefined;                                   // nobody has an opinion
}
function supportsHyperlinks(opts) {
  let explicit = getHyperlinkOverride(opts);
  if (explicit !== undefined) return explicit;
  ...same heuristic as 193...
  return false;
}

// Mapping: out→getHyperlinkOverride, mk→supportsHyperlinks, AS→hostCapabilities,
//          Vho.default.supportsHyperlink→supportsHyperlinkLib
```

The consumer is the `Lo` link component (`:259616-259636`) and the OSC-8 string builder `QN`
(`:556647-556661`):

```javascript
if (Tkw ? (out() ?? !0) : mk()) { ...emit an ink-link... }        // :259620
```

### [Decision] Tri-state override vs. boolean detection

**What it does:** lets a link declare "render me as a hyperlink unless someone explicitly said no",
distinct from "render me as a hyperlink if we can prove the terminal supports it".

**How it works:**
1. `out()` answers `true`/`false` only when someone *stated* a preference: the host capability record
   (set on attach), or the presence of `FORCE_HYPERLINK` in the environment. Otherwise `undefined`.
2. `mk()` is the old conservative predicate: default **false**, true only for a known-good terminal.
3. A component passing `assumeSupport: true` evaluates `out() ?? true` — it flips the default to
   **true** while still honouring `FORCE_HYPERLINK=0`.
4. `QN` additionally requires `o` (the label is absent or equals the URL) and `process.stdout.isTTY`
   before honouring `assumeSupport`, so a *labelled* link still degrades to `label (url)` rather than
   emitting an OSC-8 that might print raw.

**Why this approach:** OSC-8 degrades **gracefully but not invisibly**. A terminal that does not
understand it typically shows the label and swallows the sequence — annoying at worst. A terminal
that *cannot be detected* (ssh with a scrubbed environment, tmux without version info) is
overwhelmingly likely to be a modern one. The old `false`-by-default was calibrated for the risk of
printing garbage; the observed risk turned out to be lower than the cost of dead links. Rather than
flip the global default — which would affect every link in the UI including inside tool output —
they added an opt-in for the 13 places where the URL is short, the fallback is fine, and clickability
matters: `claude auth login` (`:864399`), the OAuth URLs (`:674700`, `:700140`, `:703868`,
`:703943`, `:704350`), the setup-token flow (`:584278`), and the PR footer badge (`:751684`, with an
explicit `fallback:` prop).

**Key insight:** the escape hatch is the *presence* of `FORCE_HYPERLINK` in the environment, not its
value — the value is interpreted by the vendored `supports-hyperlinks` library, whose rule is
"`FORCE_HYPERLINK=0` means no, anything else means yes". So `FORCE_HYPERLINK=1` and
`FORCE_HYPERLINK=` both force on, and only the literal `0` forces off. The changelog documents the
`0` case, which is the one that matters.

---

## 6. OSC-52 clipboard under GNU screen (`.219`)

`.219`: *"Fixed copy-on-select inside GNU screen printing base64 into the terminal instead of copying
the selection."*

`]52;` is **220=2 (`:216152`, `:216158`) / 193=1 (`:156014 (193)`)** — the second site is the fix.

```javascript
// ============================================
// setClipboard - OSC-52 with multiplexer-specific framing; screen now gets chunked DCS passthrough
// Location: cli_inner_pretty.js:216139-216161
// ============================================

// ORIGINAL (for source lookup):
async function NT(e) {
  let t = Las.Buffer.from(e, "utf8").toString("base64");
  if (!PYr()) JCu(e);
  await Qzg(e);
  let r = Pas(), n = PYr(),
    o = r === "tmux" ? "raw+dcs" : r === "screen" ? "dcs" : "raw";
  (w(`clipboard: setClipboard mux=${r ?? "none"} ssh=${n} native=${!n} predicted=${OYr()} emit=${o} bytes=${e.length}`), r === "tmux")
  if (r === "tmux") { let i = `${zY}]52;c;${t}${Lj}`; return i + IB(i); }
  if (r === "screen") {
    let i = [];
    for (let s = 0; s < t.length; s += zCu) i.push(t.slice(s, s + zCu));
    return `${zY}P${zY}]52;c;${i.join(`${Ras}${zY}P`)}${Lj}${Ras}`;
  }
  return Dw(US.CLIPBOARD, "c", t);
}

// READABLE (for understanding):
async function setClipboard(text) {
  let b64 = Buffer.from(text, "utf8").toString("base64");
  if (!isSSH()) copyViaNativeTool(text);          // pbcopy / wl-copy / xclip / xsel / powershell.exe
  await copyViaTmuxLoadBuffer(text);
  let mux = detectMultiplexer();                  // "tmux" | "screen" | null
  ...
  if (mux === "tmux")
    { let osc = ESC + "]52;c;" + b64 + BEL; return osc + wrapForMultiplexer(osc); }  // send BOTH forms
  if (mux === "screen") {
    let chunks = [];
    for (let i = 0; i < b64.length; i += SCREEN_DCS_CHUNK) chunks.push(b64.slice(i, i + SCREEN_DCS_CHUNK));
    return ESC+"P" + ESC+"]52;c;" + chunks.join(ST + ESC+"P") + BEL + ST;   // N short DCS segments
  }
  return osc(OSC_CODES.CLIPBOARD, "c", b64);
}
var SCREEN_DCS_CHUNK = 76;   // :216331

// Mapping: NT→setClipboard, zY→ESC (:215965), Lj→BEL (:215966), Ras→ST ("\x1b\\", :216351),
//          zCu→SCREEN_DCS_CHUNK, IB→wrapForMultiplexer (:216085), Pas→detectMultiplexer,
//          PYr→isSSH, JCu→copyViaNativeTool (:216162), Qzg→copyViaTmuxLoadBuffer (:216130)
```

193's screen branch was one line: `if (n === "screen") return Ax(o);` (`:156024 (193)`) — a single
`DCS … ST` wrapper (`Ax`, `:155954-155959 (193)`, byte-identical to 220's `IB`) around the whole
OSC-52 string.

### [Decision] Chunking at 76 characters

**What it does:** splits the base64 payload across many short DCS passthrough segments instead of one
long one.

**How it works:** the emitted stream is
`DCS ESC]52;c; <chunk1> ST DCS <chunk2> ST … DCS <chunkN> BEL ST`. Each segment is opened with
`ESC P` and closed with `ESC \`; screen strips the framing and forwards the interior to the outer
terminal, which reassembles one continuous OSC-52 sequence.

**Why this approach:**
- GNU screen has a **hard length limit on a single string escape** (its `String` buffer;
  historically 256 bytes). A base64 payload longer than that is truncated, and screen prints the
  overflow literally — which is exactly the reported symptom, "printing base64 into the terminal".
  There is no way to raise the limit from the client, so the payload must be split.
- 76 is the **RFC 2045 MIME base64 line length**. It has no protocol significance here; it is simply
  a well-known safe value comfortably under any plausible per-string limit, and it keeps each segment
  under 90 bytes including framing.
- The native-tool path runs first and unconditionally when not over SSH (`if (!PYr()) JCu(e)`), and
  `tmux load-buffer -w -` is also attempted. The OSC-52 emission is the **last resort** for the
  remote case, which is precisely when the multiplexer framing matters. Splitting costs nothing when
  the other paths already succeeded.
- Note the tmux branch does the opposite of splitting: it emits the raw OSC **and** the DCS-wrapped
  copy (`return i + IB(i)`), betting that one of the two will be understood and the other ignored.
  Different multiplexer, different failure mode.

---

## 7. Control-character sanitising — a net-new family (`.200`, `.211`)

`.200`: *"Fixed control bytes from background-agent output reaching the terminal in the agent view."*

The whole family is new: `stripVTControlCharacters` is **220=5 / 193=0**, and the
`\p{Cc}\p{Cf}` character-class regex is **220=8 / 193=0**.

```javascript
function m_(e) { return e.replace(/[\p{Cc}\p{Cf}  ]+/gu, " "); }        // :217537 - collapse to a space
function Xbr(e) { return pfp.stripVTControlCharacters(e)
                    .replace(/(?![\t\n])[\p{Cc}\p{Cf}  ]/gu, ""); }     // :545754 - strip, keep TAB/LF
```

Two different policies for two different destinations:

- **`m_` (collapse to a space)** is used where the text becomes a *label* — an agent-view row
  headline (`:404257`, `:404271`, `:404277`), an agent type (`:342049`), an MCP error message
  (`:282599`). Collapsing runs of controls into one space preserves word boundaries, so a name that
  contained a newline still reads as two words.
- **`Xbr` (strip, but keep `\t` and `\n`)** is used where the text is *multi-line output* —
  stderr warnings (`:545759`), the permissions warning log (`:829461`), an import failure
  (`:866731`). The negative lookahead `(?![\t\n])` is what distinguishes it.

Both are layered on Node's `stripVTControlCharacters`, which removes complete ANSI/CSI sequences;
the regex pass then removes the *lone* control and format code points that survive — including
`\p{Cf}`, which covers the bidi overrides and zero-width characters, and ` `/` `
(line/paragraph separator), which terminals treat inconsistently.

`f9` (`:284228-284238`) is the strictest variant and belongs to the `.211` permission-preview bullet:
after `m_`, it also NFKC-normalizes and replaces `< > " ;` **and eleven kinds of Unicode quotation
mark** (`‘’‚“”„«»‹›` plus the CJK/angle brackets)
with spaces, then collapses whitespace and truncates. That is the look-alike-quote neutralisation
`.211` describes, and it lives in the same family.

The screen-reader channel has its own third variant, `Dho` (`:257355`), documented in
[screen_reader_mode.md](screen_reader_mode.md) §3.3.

---

## 8. The fullscreen jump-to-bottom pill (`.206`)

`.206`: *"Fixed the fullscreen jump-to-bottom pill suggesting Ctrl+End on macOS, not showing rebound
chords, and wrapping over the transcript."* Three defects, three fixes, one function `rMa`
(`:690714-690790`). `new ${Et(oZo, "message")}` is **220=1 (`:690731`) / 193=0**.

```javascript
let YPa = dHe(),                                            // :690723  platform, with the SSH correction
  dhf = eMt(Shf, YPa),                                      //          default chord for this platform
  h9b = eMt(Ehf, YPa),
  XPa = pc("scroll:bottom", "Scroll", dhf),                 // :690726  the ACTUAL binding, default dhf
  g9b = pc("scroll:pageDown", "Scroll", h9b),
  K9k = Gd.useSyncExternalStore(Ytr, $Rt),                  // :690727  has a mouse ever been seen?
  XSt = oZo > 0 ? `${oZo} new ${Et(oZo, "message")}` : "Jump to bottom",
  _9b = YPa === "macos" && (XPa === "" || XPa === dhf),     // :690733  mac AND binding not customised
  Y9k = ybe() === "full" && K9k,                            // :690735  clicks available AND observed
  b9b = g9b === h9b ? `fn+${je.arrowDown}` : g9b;
if (_9b && Y9k) skr = `${XSt} (click) ${je.arrowDown}`;     // :690736
else if (_9b && b9b) skr = `${XSt}: ${b9b} to scroll`;
else if (XPa) skr = `${XSt} (${XPa}) ${je.arrowDown}`;
else skr = `${XSt} ${je.arrowDown}`;
let phf = z9k - 2;                                          // :690741  columns - 2
const fhf = `${XSt} ${je.arrowDown}`;
let X9k = [skr, fhf, XSt];
S9b = X9k.find((J9k) => Ft(J9k) <= phf) ?? XSt;             // :690747  longest label that FITS
```

- **The macOS `Ctrl+End` problem** is `_9b`: on macOS, full-size keyboards aside, there is no
  `End` key, so `Ctrl+End` is unpressable. When the platform is macOS *and* the user has not rebound
  the action, the pill advertises `(click)` or `fn+↓` instead of the nominal chord.
- **The rebound-chord problem** is `XPa = pc("scroll:bottom", "Scroll", dhf)`: the label comes from
  the keybinding registry, with the platform default as the fallback. `XPa !== dhf` proves the user
  customised it, which flips `_9b` false and prints the real chord.
- **The wrapping problem** is the three-tier `find`: full label → `Jump to bottom ↓` → bare
  `Jump to bottom`, taking the first whose `displayWidth` fits `columns - 2`, with a final
  `?? XSt` and `wrap: "truncate-end"` on the `Text` (`:690768`) as the last resort. The pill is
  `position: "absolute", bottom: 0` (`:690775`) over the transcript, so an overflowing label
  visibly corrupts content behind it — hence a *layout* fix rather than a wrap.

`dHe()` (`:261056-261062`) is the platform detector, and it carries its own bug fix — `.198`'s
*"Shortcut hints show opt/cmd instead of alt/super when connected from a Mac over SSH"*
(220=1 / 193=0):

```javascript
function dHe() {
  let e = Mt();
  if (e === "macos") return e;
  if (Z.LC_TERMINAL === "iTerm2" || Z.TERM_PROGRAM === "Apple_Terminal" || Z.TERM_PROGRAM === "iTerm.app")
    return "macos";
  return e;
}
```

`LC_TERMINAL` is forwarded by iTerm2 through `ssh` (it is in the default `SendEnv`/`AcceptEnv`
sets), so a Linux box reached from a Mac still reports the *client's* keyboard conventions. That is
the correct signal: keyboard hints describe the keyboard in front of the human, not the CPU running
the process.

---

## 9. Fullscreen mode and screen-reader precedence

Worth naming here because it is the one place where terminal-mode policy and accessibility meet.
`m8e` (`:164958-164973`) resolves fullscreen as a **reason string**, ordered:

```javascript
if (Z.CLAUDE_CODE_SESSION_KIND === "bg") return "bg_forced_on";
if (kL()) return "sr_auto_off";                        // screen-reader mode outranks everything below
if (kZi()) return "env_off";                           // CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN / NO_FLICKER=0
if (Z.CLAUDE_CODE_NO_FLICKER === !0) return "env_on";
if (Nxe(e)) return "tmux_cc_auto_off";
if (xZi()) return "win_ssh_auto_off";
switch (eo().tui) { case "fullscreen": return "settings_on"; case "default": return "settings_off"; }
if (e.downsellGateCached ?? Ke("tengu_amber_creek", !1)) return "downsell_on";
return (e.gbGateCached ?? Ke("tengu_pewter_brook", !1)) ? "gb_on" : "gb_off";
```

`kZi()` (`:164907-164909`) is
`Z.CLAUDE_CODE_NO_FLICKER === !1 || Z.CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN`, and 193's equivalent
(`:156377 (193)`) reads the raw `process.env` through a coercion helper rather than the typed
accessor — a small hardening, not a behaviour change. The rest of this ordering is discussed in
[screen_reader_mode.md](screen_reader_mode.md) §9.

`.210`'s *"Fixed returning to the agents view from a session leaving overlapping ghost frames with
`CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1`"* is the one bullet in this cluster I could **not** anchor:
the `dropEnv` list at `:732247` that strips the variable from a relaunch is byte-identical carryover
(`:545902 (193)`), and the alt-screen reset helpers are unchanged. Recorded UNANCHORED.

---

## 10. Not covered / could not anchor

| Bullet | Probe | Result |
|---|---|---|
| `.207` terminal freeze streaming long lists/paragraphs/code blocks | renderer-core counts (§0) | UNANCHORED beyond the table rewrite (§4) |
| `.211` "Improved terminal layout and rendering performance" | `writableLength` 6/6, `syncOutput` 3/3 | UNANCHORED — umbrella bullet |
| `.203` live-preview no full re-render | `livePreview` 5/5 | UNANCHORED — carryover literal |
| `.208` input responsiveness while task lists update | React Compiler 6/6 | UNANCHORED — no isolable delta |
| `.203` content jumping when scrolling long history | `scrollback` 5/5 | UNANCHORED |
| `.207` transcript jumping above the answer | `jumpToBottom` 4/4, `autoScroll` 14/14 | UNANCHORED |
| `.210` ghost frames with `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` | `dropEnv` list identical | UNANCHORED (§9) |
| `.212` welcome banner keeping old panel widths after a resize | no literal | UNANCHORED |
| `.212` diff previews losing line numbers in narrow layouts | no literal | UNANCHORED |
| `.216` dialogs in fullscreen stretching past the panel edge | no literal | UNANCHORED |
| `.216` `/config` list clipping its keyboard-hint footer | no literal | UNANCHORED |
| `.216` transcript-mode footer wrapping under 104 columns | `104 columns` 0/0 | UNANCHORED |
| `.198` markdown tables overflowing in fullscreen | `tableBorder` 0/0 | UNANCHORED (§4 is the likely home) |
| `.198` Cmd+click / double-click URL selection in Warp | `Warp` 20/19 | UNANCHORED |
| `.198` highlight.js 11 upgrade | `hljs` 60/5 | real but a vendored-dependency bump, not analysed |

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
- `isSynchronizedOutputSupported` (`xee`, `:253384`) - tmux now probe-gated, not denied
- `getSynchronizedOutputTriState` (`f2u`, `:253380`) - returns `undefined` while the probe is pending
- `setSyncOutputProbeResult` (`p2u`, `:253377`) - written once by the DECRQM probe
- `probeTerminalCapabilities` (`rUu`, `:254316`) - XTVERSION + DECRQM(2026), carryover
- `mouseTrackingEnableSeq` (`AFe`, `:253443`) - `"full" | "scroll" | "off"` → DECSET string
- `MOUSE_FULL_ON` (`Yly`, `:253481`), `MOUSE_SCROLL_ON` (`Xly`, `:253482`), `MOUSE_OFF` (`Fpe`, `:253483`)
- `DEC_MODES` (`ew`, `:253456`) - the mode-number table
- `getMouseTrackingMode` (`ybe`, `:164997`) - env resolver; 193's bg-forced-on branch removed
- `MouseTrackingHost` (`cet`, `:802308`) - the component that owns the mode's lifetime
- `prepareTerminalForHandoff` (`:258066`) / `restoreTerminalAfterHandoff` (`:258071`) - editor handoff
- `enterAlternateScreen` (`:258035`) - now also resets DECSET 2004 and 2031
- `reassertTerminalModes` (`:258576`) - re-designates US-ASCII G0 and reapplies mouse/key modes
- `openInExternalEditor` (`Dmt`, `:455136`) - chooses alt-screen vs handoff
- `layoutMarkdownTable` (`EUp`, `:636292`) - memo + 200-row cap + three column strategies
- `truncatedRowsNotice` (`bqo`, `:636278`) - `… N more rows not shown`
- `MAX_TABLE_ROWS` (`_Up`, `:636511`) - the value 200
- `MarkdownTable` (`Eqo`, `:636525`) - React-Compiler-memoised wrapper
- `getHyperlinkOverride` (`out`, `:259584`) - tri-state; `undefined` means "no opinion"
- `supportsHyperlinks` (`mk`, `:259591`) - conservative heuristic
- `Link` (`Lo`, `:259616`) - carries the `assumeSupport` prop
- `buildTerminalLink` (`QN`, `:556647`) - OSC-8 builder with the same opt-in
- `setClipboard` (`NT`, `:216139`) - chunked DCS passthrough for GNU screen
- `SCREEN_DCS_CHUNK` (`zCu`, `:216331`) - the value 76
- `wrapForMultiplexer` (`IB`, `:216085`) - tmux/screen DCS wrapper, carryover
- `sanitizeForTerminal` (`Xbr`, `:545754`) - strip controls, keep TAB/LF
- `collapseControlChars` (`m_`, `:217537`) - collapse controls to a space, for labels
- `sanitizeForRelay` (`f9`, `:284228`) - adds NFKC + look-alike-quote neutralisation
- `JumpToBottomPill` (`rMa`, `:690714`) - three-tier label shortening
- `detectPlatformForKeyHints` (`dHe`, `:261056`) - Mac-over-SSH correction
- `resolveFullscreenReason` (`m8e`, `:164958`) - `"sr_auto_off"` is checked second
- `isAlternateScreenDisabled` (`kZi`, `:164907`)
