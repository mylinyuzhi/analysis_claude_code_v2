# Vim mode and the prompt input path in 2.1.220

**Bundles** (see [`_CONVENTIONS.md`](../_CONVENTIONS.md) §1): `T = 2.1.220` (872,596 lines),
`B = 2.1.193` (718,679 lines). Every `cli_inner_pretty.js:<line>` below without a `(193)` tag was read
in the 2.1.220 bundle by me.

This document covers the ten changelog bullets in this window that land in the **text-input stack** —
the shared input hook, the vim state machine on top of it, the key/paste tokenizer underneath it, and
the two composers (main prompt, agent-view dispatch) that consume them. Several of these bullets were
filed UNANCHORED by the scoping pass because they leave no user-facing string; every one of them is
anchored here by diffing the *function bodies* between builds instead.

The stack, bottom-up:

```
stdin bytes
  └─ Iay/tokenizer  ──▶ paste-mode reassembly (:242790-242890)  ── byte-identical carryover
       └─ Pay        ──▶ CSI-u sequence → literal text inside a paste (:242971)   ◀── .218 Ctrl+J fix
  └─ QXr            ──▶ key event objects
       └─ yx  (:657471)          the shared text-input hook (193: dk :493244)     ◀── .212 Ctrl+J fix
            └─ Ne  (:559916)     the base key dispatch, incl. the ← guard          ◀── .203/.206/.218
            └─ Sba (:656887)     the vim layer, wraps yx                           ◀── .208/.211/.216/.219
       └─ composers: main prompt (:753700-754400), agent view (:806800-807100)     ◀── .207/.211
```

---

## 1. `vimInsertModeRemaps` (`.208`) — two-key INSERT-mode escapes

`.208`: *"Added `vimInsertModeRemaps` setting: map two-key insert-mode sequences like `jj` to Escape in
vim mode."* `vimInsertModeRemaps` is **220=2 (`:61454`, `:656562`) / 193=0** — genuinely net-new.

### 1.1 The settings surface

The zod field (`:61454-61461`) sits next to `editorMode` and carries the whole contract in its
`.describe()`:

> `Vim INSERT-mode key-sequence remaps, e.g. {"jj": "<Esc>"}. Each key is exactly two printable`
> `characters typed in sequence; "<Esc>" (return to NORMAL mode) is the only supported target.`
> `Applies when editorMode is "vim".`

The declared type is `v.record(v.string(), v.unknown())` — deliberately **unvalidated at the schema
level**. Validation happens later, in the loader, so a bad entry is *dropped* rather than making the
whole settings file fail to parse.

### 1.2 The loader/validator

```javascript
// ============================================
// parseVimInsertModeRemaps - filters the raw settings record down to a safe two-grapheme → <Esc> map
// Location: cli_inner_pretty.js:656551-656563
// ============================================

// ORIGINAL (for source lookup):
function Yxb(e) {
  let t = new Map();
  for (let [r, n] of Object.entries(e)) {
    if (typeof n !== "string" || n.toLowerCase() !== "<esc>") continue;
    let o = r.normalize("NFC");
    if (!/^[^\p{C}\p{Z}]{2}$/u.test(o) || Vde(o) !== 2) continue;
    t.set(o, "<Esc>");
  }
  return t;
}
function dba() {
  return Yxb(Snt("vimInsertModeRemaps")[0] ?? {});
}

// READABLE (for understanding):
function parseVimInsertModeRemaps(rawRecord) {
  let remaps = new Map();
  for (let [sequence, target] of Object.entries(rawRecord)) {
    if (typeof target !== "string" || target.toLowerCase() !== "<esc>") continue;   // only <Esc> is supported
    let normalized = sequence.normalize("NFC");
    if (!/^[^\p{C}\p{Z}]{2}$/u.test(normalized) || countGraphemes(normalized) !== 2) continue;
    remaps.set(normalized, "<Esc>");
  }
  return remaps;
}
function getVimInsertModeRemaps() {
  return parseVimInsertModeRemaps(readSettingWithSource("vimInsertModeRemaps")[0] ?? {});
}

// Mapping: Yxb→parseVimInsertModeRemaps, dba→getVimInsertModeRemaps,
//          Vde→countGraphemes (:160220), Snt→readSettingWithSource (:63507)
```

### [Algorithm] The three-part key validation, and why each part is there

**What it does:** turns an arbitrary JSON object from any settings file into a `Map` the key handler
can consult on every keystroke without further checks.

**How it works:**
1. **Target check first.** `n.toLowerCase() !== "<esc>"` rejects everything but `<Esc>`. This is
   checked before the key is even normalized, because a config declaring `{"jk": "<C-o>"}` should be
   silently ignored rather than half-honoured.
2. **NFC normalization** of the key. Two-character sequences typed on a Mac can arrive decomposed
   (`e` + combining acute) while the settings file holds the composed form; without NFC the map lookup
   at keystroke time would miss.
3. **`/^[^\p{C}\p{Z}]{2}$/u`** — exactly two UTF-16 code points, neither a Unicode *Control* (`\p{C}`,
   which also covers format and surrogate categories) nor a *Separator* (`\p{Z}`, spaces). This bans
   `"j "`, `"\tj"`, and any sequence containing a lone surrogate.
4. **`Vde(o) !== 2`** — a second, *different* length check: `Vde` (`:160220`) counts **graphemes**
   using `Intl.Segmenter`, not code units. The regex `{2}` counts code points; a two-code-point
   emoji-with-modifier is one grapheme and is rejected here. Running both checks means the accepted
   set is exactly "two things a user can type, each of which is one visible character".
5. `Snt("vimInsertModeRemaps")[0]` returns the *merged* value across the settings hierarchy (the `[0]`
   discards the source label), so a user-level map is overridden wholesale by a project-level one —
   maps are not deep-merged.

**Why this approach:**
- Restricting the target to `<Esc>` is the whole reason this feature is 30 lines instead of 300.
  A general remap engine needs a keystroke *language* (`<C-o>`, `<Leader>`, counts) and a recursion
  guard. `jj → Esc` is the one remap ~everyone who asks for this actually wants.
- Fixing the length at exactly two is what makes the runtime cost bounded: the matcher only ever has
  to remember **one** pending character (§1.3). A variable-length remap needs a trie and a
  longest-prefix backtrack, and the ambiguity ("is `jjj` a remap plus a `j`?") has no obvious answer.
- Dropping bad entries instead of throwing keeps a typo in `~/.claude/settings.json` from bricking
  the CLI — consistent with the `.catch(void 0)` on the neighbouring zod fields.

**Key insight:** `dba()` is called **on every keystroke** (`:657111`, `:657186`) and re-parses the
settings each time. There is no memo. That is affordable only because the map is tiny and
`Snt` is itself cached — but it is why the validator is written as a cheap linear scan with early
`continue`s rather than a zod schema.

### 1.3 The two dispatch paths

The remap is applied in two different places in `Sba` (`:656887`), the vim hook, because text can
reach INSERT mode two ways.

**(a) Bulk text** — `U(F, G)` at `:657107-657118`. A multi-code-point `key` (a paste, or an IME
commit) is split with `[...F]` and, at each split point, the *remaining* joined string is tested:

```javascript
if (f.current.mode === "INSERT") {
  let ee = K.slice(Y).join(""),
    te = dba();
  if (te.size > 0 && te.has(ee.normalize("NFC"))) {
    (be("vim_insert_remap"), H({ buffer: { text: j, offset: z }, claimEmptyInsert: !0 }));
    return;
  }
  ...
}
```

**(b) Per-keystroke** — `W(F)` at `:657186-657217`, the interesting one:

```javascript
// ============================================
// (inside the vim INSERT branch) - completes a two-key remap using one pending character
// Location: cli_inner_pretty.js:657186-657217
// ============================================

// ORIGINAL (for source lookup):
let se = dba();
if (se.size > 0) {
  let ne = F.key.normalize("NFC"), ee = [...ne].length, te = ee === 1,
    de = (te || F.name === "") && !_ba.has(F.name);
  if (de && ee <= 2 && K && se.has(K.char + ERt(ne)) && Date.now() - K.at <= F7p &&
      G.offset === K.offsetAfter && z.text.startsWith(K.char, z.offset - K.char.length)) {
    if ((V(), K.recorded && j.insertedText.endsWith(K.char)))
      f.current = { mode: "INSERT", insertedText: j.insertedText.slice(0, -K.char.length) };
    let ve = z.offset - K.char.length, he = z.text.slice(0, ve) + z.text.slice(z.offset);
    (r(he), be("vim_insert_remap"), H({ buffer: { text: he, offset: ve }, claimEmptyInsert: !0 }),
      F.preventDefault());
    return;
  }
  if (de && !te && se.has(ne)) { (V(), be("vim_insert_remap"), H({ claimEmptyInsert: !0 }), F.preventDefault()); return; }
  let Te = de ? xZ(ne) : "";
  if (Te) C(se, Te, G.offset + ne.length, [...F.key].length === 1);
}

// READABLE (for understanding):
let remaps = getVimInsertModeRemaps();
if (remaps.size > 0) {
  let typed = key.key.normalize("NFC"),
    codePoints = [...typed].length,
    isSingleChar = codePoints === 1,
    isTextBearing = (isSingleChar || key.name === "") && !NON_TEXT_KEY_NAMES.has(key.name);
  if (isTextBearing && codePoints <= 2 && pending &&                      // there IS a pending first char
      remaps.has(pending.char + firstGrapheme(typed)) &&                  // the pair is a configured remap
      Date.now() - pending.at <= REMAP_TIMEOUT_MS &&                      // typed within 1000 ms
      cursor.offset === pending.offsetAfter &&                            // cursor has not moved since
      buffer.text.startsWith(pending.char, buffer.offset - pending.char.length)) {  // the char is still there
    cancelPending();
    if (pending.recorded && insertState.insertedText.endsWith(pending.char))
      insertState.insertedText = insertState.insertedText.slice(0, -pending.char.length);  // un-record for dot-repeat
    let newOffset = buffer.offset - pending.char.length,
      newText = buffer.text.slice(0, newOffset) + buffer.text.slice(buffer.offset);        // delete the first char
    setText(newText);
    logEvent("vim_insert_remap");
    exitInsertMode({ buffer: { text: newText, offset: newOffset }, claimEmptyInsert: true });
    key.preventDefault();
    return;
  }
  if (isTextBearing && !isSingleChar && remaps.has(typed)) { ...both chars arrived in one event... }
  let lastGrapheme = isTextBearing ? lastGraphemeOf(typed) : "";
  if (lastGrapheme) recordPendingRemapChar(remaps, lastGrapheme, cursor.offset + typed.length,
                                           [...key.key].length === 1);
}

// Mapping: se→remaps, K→pending (E.current), F7p→REMAP_TIMEOUT_MS (=1000, :656564),
//          _ba→NON_TEXT_KEY_NAMES (:657435), ERt→firstGrapheme (:160210), xZ→lastGraphemeOf (:160214),
//          C→recordPendingRemapChar (:656913), H→exitInsertMode, V→cancelPending, be→logEvent
```

The pending-character recorder is deliberately minimal:

```javascript
function C(F, G, j, z) {                    // recordPendingRemapChar(remaps, char, offsetAfter, recorded)
  for (let V of F.keys())
    if (V.startsWith(G)) { E.current = { char: G, at: Date.now(), offsetAfter: j, recorded: z }; return; }
}
```

### [Decision] Five guards on one keystroke — why the matcher is this defensive

**What it does:** decides whether the character just typed completes a remap begun by the previous
character, and if so removes the already-inserted first character and leaves INSERT mode.

**How it works / why each guard exists:**

| Guard | Line | What it prevents |
|---|---|---|
| `de` (`isTextBearing`) | `:657191` | Function keys, arrows and `backspace` cannot be the second half of a remap. `_ba` (`:657435-657460`) is the 22-name exclusion set: `backspace delete tab home end pageup pagedown insert clear enter center undefined mouse f1..f12`. |
| `Date.now() - K.at <= 1000` | `:657197` | Typing `j`, walking away, coming back and typing `j` an hour later must insert `jj`, not escape. |
| `G.offset === K.offsetAfter` | `:657198` | The user clicked or arrowed elsewhere between the two keys — the pair is no longer adjacent. |
| `z.text.startsWith(K.char, z.offset - K.char.length)` | `:657199` | The first character was undone/deleted by something else; without this the deletion below would remove the wrong byte. |
| `C()` only records if some key **starts with** this char | `:656913-656919` | Nothing is remembered while typing prose, so the common path allocates nothing. |

Only after all five pass does the handler mutate: it deletes `K.char.length` characters *before*
the cursor, sets the buffer, and calls `H({ buffer: {...}, claimEmptyInsert: !0 })`.

**Why `claimEmptyInsert: !0` matters:** `H` (`:656935-656966`, the exit-INSERT callback) normally
records `{type:"insert", text: insertedText}` as the dot-repeatable change. `claimEmptyInsert`
tells it to do so even when `insertedText` is empty — so `cwfoo<jj>` still dot-repeats as
"change word, insert foo" rather than losing the change record. The
`if (K.recorded && j.insertedText.endsWith(K.char))` block above it removes the *first* remap
character from `insertedText` for the same reason: `.` must not replay the `j`.

**Trade-off accepted:** the first character of a remap **is inserted into the buffer and rendered**,
then deleted ~one keystroke later. The alternative — buffering the first character for up to 1000 ms
before showing it — would make ordinary typing of `j` feel laggy. The visible flicker of a
transient `j` was judged the lesser evil, and it also means that if the second key never comes,
nothing has to be replayed.

**Key insight:** `F7p = 1000` ms is not a "type this fast" requirement, it is a *staleness* bound.
The `offset === offsetAfter` and `startsWith` guards already prove adjacency; the timeout only
exists so a pending record left over from a previous editing session in the same buffer cannot fire
spuriously. That is why 1000 ms is generous compared with, say, vim's default `timeoutlen` of 1000 ms
for mappings — here it costs nothing to be generous.

---

## 2. Vim `s` and `S` in NORMAL mode (`.211`)

`.211`: *"Changed Vim mode `s` and `S` (substitute char/line) to work in NORMAL mode, matching vim
behavior."* The scoping pass filed this UNANCHORED (`case "s":` 11/9, `NORMAL mode` 1/0 — all decoys).
The real anchor is `"substitute"`, which is **220=3 (`:655972`, `:656876`, `:657026`) / 193=0**.

### 2.1 The structural change: an if-chain became a null-prototype table

This bullet is not a one-line addition; the NORMAL-mode dispatcher was **rewritten from an if-chain
into a lookup table** in the same change.

```javascript
// ============================================
// resolveNormalModeKey - NORMAL-mode key → command, table-driven in 220, if-chain in 193
// Location: cli_inner_pretty.js:656620-656631 (dispatcher) / :656801-656836 (table)
// ============================================

// ORIGINAL (for source lookup):
function W7p(e, t, r) {
  if (pba(e)) return { next: { type: "operator", op: Zzo[e], count: t } };
  if (eKo.has(e)) return { execute: () => { let n = Z3t(e, r.cursor, t); r.setOffset(n.offset); } };
  if (tKo.has(e)) return { next: { type: "find", find: e, count: t } };
  return Xxb[e]?.(t, r) ?? null;
}
Xxb = Object.assign(Object.create(null), {
  g: (e) => ({ next: { type: "g", count: e } }),
  ...
  x: (e, t) => ({ execute: () => Gzo(e, t) }),
  s: (e, t) => ({ execute: () => Wzo(e, t) }),
  S: (e, t) => ({ execute: () => tjt("change", e, t) }),
  J: (e, t) => ({ execute: () => zzo(e, t) }),
  ...
});

// READABLE (for understanding):
function resolveNormalModeKey(key, count, ctx) {
  if (isOperatorKey(key)) return { next: { type: "operator", op: OPERATORS[key], count } };   // d c y
  if (MOTION_KEYS.has(key)) return { execute: () => ctx.setOffset(applyMotion(key, ctx.cursor, count).offset) };
  if (FIND_KEYS.has(key)) return { next: { type: "find", find: key, count } };                // f F t T
  return NORMAL_COMMANDS[key]?.(count, ctx) ?? null;
}
const NORMAL_COMMANDS = Object.assign(Object.create(null), {
  ...
  s: (count, ctx) => ({ execute: () => substituteChars(count, ctx) }),          // NEW in 220
  S: (count, ctx) => ({ execute: () => applyLinewiseOperator("change", count, ctx) }),   // NEW in 220
  ...
});

// Mapping: W7p→resolveNormalModeKey, Xxb→NORMAL_COMMANDS, Zzo→OPERATORS (:656820),
//          eKo→MOTION_KEYS, tKo→FIND_KEYS, Wzo→substituteChars (:655968),
//          tjt→applyLinewiseOperator (:655902), Gzo→deleteChars
```

2.1.193's equivalent is `ICl` (`:492554-492597 (193)`) — twenty-three chained
`if (e === "…") return …` statements ending at `if (e === "O") … ; return null;` — with **no `s` and
no `S` anywhere in the chain**. The VISUAL-mode dispatcher got the same treatment
(`lkb`, `:656838-656870`, also null-prototype).

### 2.2 The two commands

```javascript
// ============================================
// substituteChars - vim `s`: delete `count` characters forward, then enter INSERT
// Location: cli_inner_pretty.js:655968-655973
// ============================================

// ORIGINAL (for source lookup):
function Wzo(e, t) {
  let r = t.cursor.offset, n = E7p(t, e);
  if (n > r) (t.setRegister(t.text.slice(r, n), !1), t.setText(t.text.slice(0, r) + t.text.slice(n)));
  (t.enterInsert(r), t.recordChange({ type: "substitute", count: e }));
}

// READABLE (for understanding):
function substituteChars(count, ctx) {
  let start = ctx.cursor.offset,
    end = charwiseDeleteEnd(ctx, count);              // clamped to end-of-line, grapheme-aware
  if (end > start) {
    ctx.setRegister(ctx.text.slice(start, end), false);   // yank into the unnamed register, charwise
    ctx.setText(ctx.text.slice(0, start) + ctx.text.slice(end));
  }
  ctx.enterInsert(start);
  ctx.recordChange({ type: "substitute", count });     // dot-repeatable
}

// Mapping: Wzo→substituteChars, E7p→charwiseDeleteEnd, t→ctx
```

`S` does **not** get its own primitive: `S: (e, t) => ({ execute: () => tjt("change", e, t) })`
(`:656809`) routes to the same linewise-operator helper that `cc` uses. That is correct vim
semantics (`S` ≡ `cc`) and it means `S` inherits linewise register handling and auto-indent for free.

`x` and `s` differ by exactly one line — `x` calls `t.setOffset(lba(i, r))` to clamp the cursor
after the deletion, `s` calls `t.enterInsert(r)` instead. Reading them side by side
(`:655958-655973`) is the clearest illustration of what "substitute = delete + insert" means here.

### [Decision] Why `Object.create(null)` for a keystroke table

**What it does:** builds the command table with no prototype chain.

**Why this approach:** the lookup key is a raw character taken straight from the user's keyboard
(`Xxb[e]`). With a plain object literal, `Xxb["constructor"]` would return `Object`, and
`Xxb[e]?.(t, r)` would call it. Single-character keys cannot reach `constructor` today — `e` is
always one code point at these call sites (`:656643`, `:656649`) — so this is defensive hygiene
rather than a fix for a live bug. It costs nothing and removes a whole class of future footgun if
the dispatcher is ever extended to multi-character keys.

**Key insight:** the table refactor is the *reason* the bullet was cheap. Adding `s`/`S` to a
23-branch if-chain means finding the right place in an ordered sequence where earlier branches may
shadow later ones; adding them to a table is two lines with no ordering semantics at all. The
changelog reports the feature; the code shows the enabling refactor.

---

## 3. Dot-repeat of `c`-operators and paste (`.216`)

`.216` (bundled into a four-part bullet): *"Fixed … vim dot-repeat of `c`-operators and paste …"*.
No literal; the anchor is the diff of the exit-INSERT callback.

193's `S` (`:492830-492862 (193)`) recorded, on leaving INSERT:

```javascript
if (O?.type === "visualOp" && O.op === "change")
  y.current.lastChange = { type: "visualChange", span: O.span, linewise: O.linewise, text: P.insertedText ?? "" };
else if (P.insertedText) y.current.lastChange = { type: "insert", text: P.insertedText };
```

So after `cw` + `foo` + `Esc`, `lastChange` was **overwritten** with `{type:"insert", text:"foo"}` —
the *operator half was lost*, and `.` inserted `foo` at the cursor instead of re-performing
`change word`. The same applied to `s`, `S`, `o`, `O` and to a paste made while in INSERT.

220's `H` (`:656935-656966`) fixes it with a *provenance check* plus a new union member:

```javascript
// ============================================
// exitInsertMode - records the dot-repeatable change, preserving the operator that opened INSERT
// Location: cli_inner_pretty.js:656935-656966
// ============================================

// ORIGINAL (for source lookup):
let j = A.current.lastChange, z = j === b.current;
if (j?.type === "visualOp" && j.op === "change" && z)
  A.current.lastChange = { type: "visualChange", span: j.span, linewise: j.linewise, text: G.insertedText ?? "" };
else if (G.insertedText && bba(j) && j.type !== "visualOp" && z)
  A.current.lastChange = { ...j, insertedText: G.insertedText };
else if (G.insertedText || (F?.claimEmptyInsert && !bba(j)))
  A.current.lastChange = { type: "insert", text: G.insertedText };

// READABLE (for understanding):
let lastChange = repeatState.current.lastChange,
  openedThisInsert = lastChange === pendingInsertOrigin.current;   // did THIS change start this INSERT?
if (lastChange?.type === "visualOp" && lastChange.op === "change" && openedThisInsert)
  repeatState.current.lastChange = { type: "visualChange", span: lastChange.span,
                                     linewise: lastChange.linewise, text: insertState.insertedText ?? "" };
else if (insertState.insertedText && isChangeLikeRecord(lastChange) &&
         lastChange.type !== "visualOp" && openedThisInsert)
  repeatState.current.lastChange = { ...lastChange, insertedText: insertState.insertedText };  // KEEP the operator
else if (insertState.insertedText || (opts?.claimEmptyInsert && !isChangeLikeRecord(lastChange)))
  repeatState.current.lastChange = { type: "insert", text: insertState.insertedText };

// Mapping: A.current→repeatState.current, b.current→pendingInsertOrigin.current,
//          bba→isChangeLikeRecord (:656872), G→insertState, F→opts
```

`b.current` is set in exactly one place — the `recordChange` shim at `:656996-656999`:

```javascript
recordChange: j ? () => {} : (z) => { if (((A.current.lastChange = z), bba(z) && f.current.mode === "INSERT")) b.current = z; },
```

and cleared on both `R` (enter INSERT, `:656925`) and `q` (external `setMode`, `:657381`).

`bba` (`:656872-656886`) is the new predicate that names the change kinds that *open* INSERT:

```javascript
case "openLine": case "substitute": return !0;                                  // o O s
case "operator": case "operatorFind": case "operatorTextObj": case "visualOp":
  return e.op === "change";                                                     // cw ct{ ciw v_c
default: return !1;
```

### [Algorithm] Why a provenance pointer and not a flag

**What it does:** distinguishes "the change record currently in `lastChange` is the one that put us
into INSERT mode" from "it is a leftover from an earlier edit".

**How it works:**
1. When an operator whose result is INSERT mode is recorded, the recorder stashes the *identity* of
   the record object in `b.current`.
2. On exit, `z = (j === b.current)` is a reference comparison. It is true only if no other change was
   recorded in between.
3. If true, the operator record is **extended** (`{...j, insertedText}`) rather than replaced.
4. If false — the user entered INSERT with plain `i`, or something else recorded a change mid-insert
   — the plain `{type:"insert"}` record is written, which is the correct dot-repeat for `i`/`a`/`A`.

**Why this approach:** a boolean "we are in an operator-initiated insert" flag would need to be
cleared on every path that can record a different change, and any missed path silently corrupts `.`.
Comparing object identity makes the invariant *self-evident*: the pointer is stale the moment
anything else writes `lastChange`, with no bookkeeping.

**Key insight:** `claimEmptyInsert` (§1.3) and `bba` interact in the third branch:
`(F?.claimEmptyInsert && !bba(j))`. A remap-triggered exit with an empty insert claims the change
**only if the current record is not already change-like** — so `cw<jj>` (change word, type nothing,
escape via remap) keeps the `cw` record instead of clobbering it with an empty insert. The two
features in this document were written to compose.

---

## 4. `←` on an empty prompt from NORMAL mode (`.219`)

`.219`: *"Fixed Vim mode: pressing ← on an empty prompt now returns to the agent view from NORMAL
mode, not just INSERT."*

The vim layer intercepts arrow keys and rewrites them into motions (`:657334`,
`if (F.name === "left") oe = "h";`). In 193 the only escape hatch was for `up`/`down`:

```javascript
// :493102 (193)
if (D.command.type === "idle" && (P.name === "up" || P.name === "down") && !P.shift) { O.handleKeyDown(P); return; }
```

220 adds `left`-on-empty to the same delegation (`:657294-657300`):

```javascript
if (j.mode !== "NORMAL") return;
if (
  j.command.type === "idle" &&
  !F.shift &&
  (F.name === "up" || F.name === "down" || (F.name === "left" && z.text === ""))
) {
  G.handleKeyDown(F);        // hand to the BASE input hook, which owns the ← gesture
  return;
}
```

**Why the three sub-conditions:**
- `j.command.type === "idle"` — a pending count or operator (`3←`, `d←`) must still resolve as a
  motion; only a *bare* left arrow is a navigation gesture.
- `!F.shift` — `Shift+←` is a selection extension.
- `z.text === ""` — this is the important one. On a **non-empty** buffer, `←` must remain `h`, or vim
  users would lose left-motion entirely. The gesture only exists on an empty prompt, which is exactly
  the condition the base handler itself checks (`W.text === ""`, `:559925`).

`G.handleKeyDown` is the *base* (`yx`) handler, which runs the ← guard described next. So the fix is
not "implement the gesture for NORMAL mode" — it is "stop swallowing the key so the existing
implementation can see it". That is why there is no new state and no new string.

---

## 5. The `←` gesture guard (`.203`, `.206`, `.218`) — a six-outcome state machine

`tengu_left_arrow_editing_guard` is **220=1 (`:559928`) / 193=0**, and the 193 gate it replaced,
`tengu_left_arrow_gesture`, is **193=2 / 220=0**. Same feature, rewritten.

```javascript
// ============================================
// classifyLeftArrowPress - decides fire / arm / absorb / attach-arm / attach-absorb / reject
// Location: cli_inner_pretty.js:559650-559661
// ============================================

// ORIGINAL (for source lookup):
function Nyp(e, t, r, n, o = LXr(t), i = Vke()) {
  if (r !== !0) return "reject";
  let s = (l) => l !== 0 && l >= i;
  if (o) {
    if (s(e.lastLeftPressMs) && t - e.lastLeftPressMs < Oyp) return "attach-absorb";
    if (s(e.attachConfirmArmedAtMs) && t - e.attachConfirmArmedAtMs <= 3000)
      return t - e.attachConfirmArmedAtMs >= GV_ ? "fire" : "attach-absorb";
    return "attach-arm";
  }
  if (!n) return "fire";
  if (s(e.lastLeftPressMs) && t - e.lastLeftPressMs < Oyp) return "absorb";
  if (s(e.armedAtMs) && t - e.armedAtMs <= 3000) return "fire";
  return s(e.editedEmptyAtMs) && t - e.editedEmptyAtMs < 2000 ? "arm" : "fire";
}
var UXs = 3000, Oyp = 1000, GV_ = 150;

// READABLE (for understanding):
function classifyLeftArrowPress(state, now, isSoloKeypress, guardEnabled,
                                inAttachQuietWindow = isWithinAttachQuiet(now), epoch = gestureEpoch()) {
  if (isSoloKeypress !== true) return "reject";              // key arrived batched with others -> not a gesture
  let isFresh = (stamp) => stamp !== 0 && stamp >= epoch;    // stamps from before the last epoch reset are void
  if (inAttachQuietWindow) {                                 // just attached to a session
    if (isFresh(state.lastLeftPressMs) && now - state.lastLeftPressMs < REPEAT_WINDOW_MS) return "attach-absorb";
    if (isFresh(state.attachConfirmArmedAtMs) && now - state.attachConfirmArmedAtMs <= ARM_TTL_MS)
      return now - state.attachConfirmArmedAtMs >= MIN_CONFIRM_GAP_MS ? "fire" : "attach-absorb";
    return "attach-arm";
  }
  if (!guardEnabled) return "fire";                          // remote kill switch -> old behaviour
  if (isFresh(state.lastLeftPressMs) && now - state.lastLeftPressMs < REPEAT_WINDOW_MS) return "absorb";
  if (isFresh(state.armedAtMs) && now - state.armedAtMs <= ARM_TTL_MS) return "fire";
  return isFresh(state.editedEmptyAtMs) && now - state.editedEmptyAtMs < EDIT_QUIET_MS ? "arm" : "fire";
}
var ARM_TTL_MS = 3000, REPEAT_WINDOW_MS = 1000, MIN_CONFIRM_GAP_MS = 150;   // EDIT_QUIET_MS = 2000, inline

// Mapping: Nyp→classifyLeftArrowPress, e→state, t→now, r→isSoloKeypress, n→guardEnabled,
//          o→inAttachQuietWindow, i→epoch, Oyp→REPEAT_WINDOW_MS, GV_→MIN_CONFIRM_GAP_MS,
//          UXs→ARM_TTL_MS (the toast timeout at the call site)
```

`Fyp` (`:559664-559681`) is the paired reducer — a pure `(state, outcome, now) → void` transition
table — and the consumer is `Ne`'s `case "left"` at `:559923-559957`.

### [Algorithm] What each outcome does and why the constants are what they are

**What it does:** turns a single `←` keypress on an empty prompt into one of six behaviours, so that
the destructive action (background this conversation and jump to the agent view) can never be
triggered by a stray key.

**How it works:**

| Outcome | Trigger | Effect at `:559930-559956` |
|---|---|---|
| `reject` | `soloKeypress !== true` | move the cursor left; fire `tengu_left_arrow_blocked{reason:"not-solo"}` **once per process** (`Uyp` latch) |
| `fire` | the normal case | `G(z)` clears the toast, `i()` performs the gesture |
| `arm` | an edit emptied the prompt < 2000 ms ago | show `Press ← again` for 3000 ms; `tengu_left_arrow_blocked{reason:"editing-quiet"}` |
| `absorb` | a second `←` within 1000 ms of the last | swallow silently — key repeat, not intent |
| `attach-arm` | first `←` inside the post-attach quiet window | show `Ambiguous ←, press again to detach` |
| `attach-absorb` | inside the attach window, too soon after arming | swallow, log `ms_since_stamp` at debug level |

**Why these numbers:**
- **1000 ms `REPEAT_WINDOW_MS`** is above a typical terminal auto-repeat interval (~30–40 ms) by a
  wide margin. It is not tuned to auto-repeat; it is tuned to "the user is *holding* the key or
  hammering it", which is exactly the case where a confirmation prompt would be dismissed by the
  user's own next press.
- **2000 ms `EDIT_QUIET_MS`** is the *arming* condition, and it is deliberately asymmetric with the
  3000 ms TTL. Emptying the prompt with `Ctrl+U` and then pressing `←` within 2 s is almost certainly
  "I meant to move the cursor"; the user then gets 3 s to confirm. Arm-window shorter than
  confirm-window means the guard is easy to satisfy deliberately and hard to trip accidentally.
- **150 ms `MIN_CONFIRM_GAP_MS`** in the attach path is a *debounce floor*: a second `←` arriving
  under 150 ms after the hint was armed is treated as part of the same physical gesture (a
  double-tap that was already in flight when the hint appeared), not as a confirmation.
- `Vke()` (the **epoch**) is compared against every stored timestamp with `stamp >= epoch`. Bumping
  the epoch invalidates all four stamps at once without having to walk the state object — the
  cheap way to reset the whole machine on a view change.

**Key insight:** the `soloKeypress` check is **first**, before the gate. `soloKeypress` means the
key arrived alone in its stdin chunk. A `←` that arrives inside a larger burst is almost always a
paste, a terminal replaying a query response, or a multiplexer flushing — never a deliberate
gesture. Checking it before `guardEnabled` means that even with the remote kill switch
`tengu_left_arrow_editing_guard = false`, batched arrows still cannot fire the gesture. The kill
switch can restore the old *confirmation* behaviour but cannot restore the old *bug*.

`.218`'s "Esc in the agent view returns to the conversation it backgrounded" is the other half of
the same bullet and lives in the agent-view screen, outside this hook.

---

## 6. Ctrl+J: the newline that two different layers lost

Two bullets, two different layers, one root cause: **extended key reporting**. When Claude Code
enables the kitty keyboard protocol (`CSI > 1 u`, `g$u` at `:239891`) plus xterm `modifyOtherKeys=2`
(`CSI > 4 ; 2 m`, `y$u` at `:239893`) — which it does for the seven terminals in `Jly`
(`:253583`: `iTerm.app kitty WezTerm ghostty tmux windows-terminal WarpTerminal`) — control
characters stop arriving as raw bytes and start arriving as CSI-u sequences carrying a **base
character plus a modifier bitmask**. `Ctrl+J`, which is byte `0x0A` in legacy mode, becomes
`CSI 106 ; 5 u` (106 = `j`, modifier 5 = ctrl).

### 6.1 The agent-view dispatch input (`.212`)

`.212`: *"Fixed Ctrl+J not inserting a newline in the agent view dispatch input on terminals with
extended key reporting, and surfaced the newline shortcut in the `?` help overlay."*

In legacy mode `0x0A` is normalised by the key parser to `{name:"enter"}`, so the multiline branch
of the shared input hook only tested for that:

```javascript
if (c && $.name === "enter") {          // :493315 (193)
```

Under CSI-u the same physical key produces `{name:"j", ctrl:true}` and fell through to the
character-insertion path — which inserted the literal letter `j`. 220:

```javascript
if (c && (F.name === "enter" || (F.ctrl && !F.shift && !F.meta && F.name === "j"))) {   // :657542
  F.preventDefault();
  let V = z.insert(`\n`);
  (L(V.text), P(V.offset));
  return;
}
```

`c` is the hook's `multiline` prop (`:657481`). The `!F.shift && !F.meta` qualifiers keep
`Ctrl+Shift+J` and `Ctrl+Alt+J` free for other bindings.

The second half of the bullet is the help-overlay line at `:808095`
(`if (Sul) (vge.push("ctrl+s to switch views"), vge.push("ctrl+j for newline"))`) — the literal
`ctrl+j` is **220=2 / 193=1**, and the 193 hit is the keybinding table entry
`"ctrl+j": "chat:newline"` (220 `:265369`), which is **carryover**. So the *binding* always existed;
what was missing was the handler in this one composer and the hint.

### 6.2 Multi-line paste collapsing to `j` (`.218`)

`.218`: *"Fixed multi-line paste collapsing into one line with `j` in place of newlines in terminals
that encode pasted newlines as Ctrl+J."*

Same root cause, one layer lower. Inside a bracketed paste the tokenizer converts each incoming
sequence to text with a dedicated mapper. 193's:

```javascript
// :160746-160751 (193)
function $xd(e) {
  let t = L9r.exec(e), n = t ? parseInt(t[1], 10) : void 0;
  if (n === void 0 && (t = D9r.exec(e))) n = parseInt(t[2], 10);
  if (n !== void 0 && n <= 1114111) return String.fromCodePoint(n);
  return e;
}
```

It parses the **code point and discards the modifier**. A pasted `\n` arriving as `CSI 106;5u`
becomes `String.fromCodePoint(106)` = `"j"`.

```javascript
// ============================================
// decodeCsiUToPasteText - maps a CSI-u key sequence to the literal text it contributes inside a paste
// Location: cli_inner_pretty.js:242971-242993
// ============================================

// ORIGINAL (for source lookup):
function Pay(e) {
  let t = Tfs.exec(e), r = t ? parseInt(t[1], 10) : void 0, n = t ? (t[2] ? parseInt(t[2], 10) : 1) : 1;
  if (r === void 0 && (t = Cfs.exec(e))) ((n = parseInt(t[1], 10)), (r = parseInt(t[2], 10)));
  if (r !== void 0 && r <= 1114111) {
    if (n < 1) n = 1;
    if (wfs(n).ctrl)
      switch (r) {
        case 105: case 73: return "\t";
        case 106: case 74: return `\n`;
        case 109: case 77: return "\r";
      }
    return String.fromCodePoint(r);
  }
  return e;
}

// READABLE (for understanding):
function decodeCsiUToPasteText(sequence) {
  let m = CSI_U_RE.exec(sequence),                        // /^\x1b\[(\d+)(?:;(\d+))?u/       :243210
    codePoint = m ? parseInt(m[1], 10) : undefined,
    modifierParam = m ? (m[2] ? parseInt(m[2], 10) : 1) : 1;
  if (codePoint === undefined && (m = MODIFY_OTHER_KEYS_RE.exec(sequence)))   // /^\x1b\[27;(\d+);(\d+)~/  :243211
    (modifierParam = parseInt(m[1], 10), codePoint = parseInt(m[2], 10));     // note: reversed field order
  if (codePoint !== undefined && codePoint <= 0x10ffff) {
    if (modifierParam < 1) modifierParam = 1;
    if (decodeModifierBitmask(modifierParam).ctrl)
      switch (codePoint) {
        case 105: case 73: return "\t";      // Ctrl+I / Ctrl+Shift+I -> TAB
        case 106: case 74: return "\n";      // Ctrl+J / Ctrl+Shift+J -> LF     <- the .218 fix
        case 109: case 77: return "\r";      // Ctrl+M / Ctrl+Shift+M -> CR
      }
    return String.fromCodePoint(codePoint);
  }
  return sequence;
}

// Mapping: Pay→decodeCsiUToPasteText, Tfs→CSI_U_RE, Cfs→MODIFY_OTHER_KEYS_RE,
//          wfs→decodeModifierBitmask (:242883)
```

### [Decision] Why only I / J / M, and why both cases

**What it does:** restores the three ASCII control characters that are *whitespace* when a terminal
reports them as modified letters rather than as raw bytes.

**How it works:**
1. `wfs(n)` (`:242883-242886`) decodes the xterm modifier parameter as `n-1` treated as a bitmask:
   `1=shift 2=alt 4=ctrl 8=super`. So `5` → `4|1` → ctrl+shift, `5-1=4` → ctrl set.
2. Only the `ctrl` bit is consulted. `Alt+J` inside a paste is nonsense and falls through to
   `String.fromCodePoint(106)` = `"j"`, which is the right answer for a literal.
3. Both the lower-case (`105 106 109`) and upper-case (`73 74 77`) code points are matched, because
   a terminal reporting `Ctrl+Shift+J` sends the *shifted* base character.
4. Everything else — `Ctrl+A`…`Ctrl+H`, `Ctrl+K`… — falls through to `String.fromCodePoint`, i.e.
   is pasted as the plain letter.

**Why this approach:** the fully general fix would be "if ctrl is set and the code point is
0x40–0x5F, emit `codePoint & 0x1F`" — the actual ASCII control mapping. That is one line and would
handle all 32 controls. They deliberately did **not** do that, because inside a *paste* the only
control characters that can legitimately appear are TAB, LF and CR. A generic mapping would let a
paste containing `Ctrl+[` become a raw `ESC` in the prompt buffer, which is an escape-sequence
injection into whatever consumes the text next. The three-case switch is an **allow-list**, and the
narrowness is the security property.

**Key insight:** the entire surrounding paste tokenizer — `IN_PASTE` mode, `pasteBuffer`,
`pendingByteEvents`, the UTF-8 continuation-byte reassembler at `:242806-242828` — is
**byte-identical between 193 and 220** (all four literals count 220=N / 193=N with N equal). The
fix is nine lines inside one leaf function. That is the shape of most bullets in this theme: a
mature mechanism with a single wrong branch.

---

## 7. The `?` that ate your prompt (`.211`)

`.211`: *"Fixed edits that leave the input as `?` being silently swallowed and toggling the shortcuts
panel."* Scoping filed this UNANCHORED (`shortcuts panel`/`toggleShortcuts`/`showShortcuts` all 0).
The anchor is `tengu_help_toggled`, which is **220=1 (`:753731`) / 193=1 (`:635140 (193)`)** — the
same count, but at a *completely different place in the pipeline*, which is the whole finding.

**193 — the check was at submit time, on the whole buffer** (`:635139-635143 (193)`, inside the
submit callback `Bg(Ot)`):

```javascript
let Bg = $o.useCallback((Ot) => {
    if (Ot === "?") {
      (V("tengu_help_toggled", {}), ae((Kp) => !Kp));
      return;                       // <- the submission is DISCARDED
    }
    ...
```

Any submission whose final text was exactly `?` toggled the panel and was thrown away. Typing `?`
into an empty prompt did that (fine), but so did deleting a long prompt down to a single `?` and
pressing Enter (not fine, and unrecoverable — the text was already gone from the buffer).

**220 — the check moved to keystroke time, on an empty buffer** (`:754123-754131`):

```javascript
// ============================================
// helpShortcutInputFilter - consumes a lone "?" typed into an EMPTY prompt, before it enters the buffer
// Location: cli_inner_pretty.js:754123-754131
// ============================================

// ORIGINAL (for source lookup):
b5 = Di.useCallback(
  (Wt, xn) => {
    if (Wt === "?" && !xn.ctrl && !xn.meta && Rt.current === "" && (!Ae || Te === "INSERT"))
      return (LA(), (go.current = !1), "");
    return oP(Wt, xn);
  },
  [Ae, Te, oP, LA],
);

// READABLE (for understanding):
const helpShortcutInputFilter = useCallback(
  (text, key) => {
    if (text === "?" && !key.ctrl && !key.meta &&
        currentInput.current === "" &&                 // the BUFFER is empty, not "the result would be ?"
        (!vimModeEnabled || vimMode === "INSERT"))     // in NORMAL mode, ? is a vim key (see :657302)
      return (toggleShortcutsPanel(), (pendingSpaceGesture.current = false), "");   // insert nothing
    return baseInputFilter(text, key);
  },
  [vimModeEnabled, vimMode, baseInputFilter, toggleShortcutsPanel],
);

// Mapping: b5→helpShortcutInputFilter, LA→toggleShortcutsPanel (:753730), Rt→currentInput,
//          Ae→vimModeEnabled, Te→vimMode, oP→baseInputFilter, go→pendingSpaceGesture
```

The agent-view screen carries the mirror of it in its single-character key handler
(`f5e`, `:754031-754034`): `if (Wt.key === "?" && te === "") { LA(); return; }`.

### [Decision] Input filter vs. submit interceptor

**What it does:** makes `?` a *keystroke shortcut on an empty prompt* rather than a *magic prompt
value*.

**Why this approach:**
- An input filter runs before the character reaches the buffer, so the shortcut is unambiguous:
  the buffer was empty, therefore the user cannot have meant to send `?`. Nothing can be lost,
  because nothing had been typed.
- At submit time the same information is unavailable: `"?"` as a final value is indistinguishable
  from `"?"` as a shortcut. Any submit-time rule must guess, and guessing wrong destroys user text.
- The filter returns `""`, which is how this hook's `inputFilter` contract expresses "consume the
  keystroke". The vim layer wraps the same filter (`:657413-657417`) so the remap recorder still sees
  the (empty) result and does not leave a stale pending character.
- The `(!Ae || Te === "INSERT")` clause hands `?` back to the vim layer in NORMAL mode, where
  `:657302` (`if (j.command.type === "idle" && F.key === "?" && l)`) toggles the same panel. Two
  call sites, one behaviour, and neither of them is the submit path.

**Key insight:** `onToggleHelp` is **220=4 / 193=0**. The prop did not exist in 193 because there was
nothing to pass it to — the panel toggle lived inside the submit closure. Threading it out as a
callback (`:656896` in the vim hook signature, `:657396`, `:748948`, `:754883`) is what made the
keystroke-time implementation possible. The plumbing *is* the fix.

---

## 8. The inline `Ctrl+R` history-search crash (`.202`)

`.202`: *"Fixed a crash in the inline Ctrl+R history search when accepting or cancelling while the
search was still scanning the history file."* Scoping filed this UNANCHORED (`historySearch` 18/18,
`isScanning` 0/0 — the literals are carryover keybinding-action names).

The bug and the fix are both in the scan loop. The search walks an **async generator** over
`history.jsonl` (`yPo`, `:454804-454832`), one entry at a time, awaiting each `next()`.

**193** (`:628057-628084 (193)`):

```javascript
if (!q) (P(), (I.current = Qzr()), k.current.clear());
if (!I.current) return;
let X = d.toLowerCase();
while (!0) {
  if (K?.aborted) return;
  let Z = await I.current.next();       // <- re-reads I.current on EVERY iteration
  if (Z.done) { m(!0); return; }
  ...
}
```

`P()` (cancel) sets `I.current = void 0`. `$`/`O` (close, on accept or cancel) calls `P()`. So the
sequence is:

1. the loop is parked on `await I.current.next()`;
2. the user presses Tab/Esc/Enter → close → `P()` → `I.current = undefined`;
3. the awaited `next()` resolves, the loop body runs, `Z.done` is false, it loops;
4. `await I.current.next()` → **`TypeError: Cannot read properties of undefined (reading 'next')`**.

The `K?.aborted` check at the top is useless here because the close path does not go through the
abort signal; and even when it does, the read of `I.current` happens *after* the check.

**220** (`:743417-743448`):

```javascript
// ============================================
// runHistorySearchScan - streams history entries, capturing the generator so a mid-await cancel is safe
// Location: cli_inner_pretty.js:743417-743448
// ============================================

// ORIGINAL (for source lookup):
if (!Y) (M(), (H.current = IUs()), L.current.clear());
if (!H.current) return;
let oe = H.current,
  ce = d.toLowerCase();
while (!0) {
  if (re?.aborted) return;
  let se = await oe.next();
  if (!zGf) ((zGf = !0), be("history_search_scan"));
  if (H.current !== oe) return;
  if (se.done) { m(!0); return; }
  ...
}

// READABLE (for understanding):
if (!isContinuation) (cancelScan(), (scanGen.current = openHistoryStream()), seen.current.clear());
if (!scanGen.current) return;
let gen = scanGen.current,                       // CAPTURE once, outside the loop
  needle = query.toLowerCase();
while (true) {
  if (abortSignal?.aborted) return;
  let step = await gen.next();                   // always the captured generator - cannot be undefined
  if (!scanTelemetryFired) ((scanTelemetryFired = true), logEvent("history_search_scan"));
  if (scanGen.current !== gen) return;           // GENERATION CHECK: a newer scan (or a close) superseded us
  if (step.done) { setExhausted(true); return; }
  ...
}

// Mapping: H→scanGen, M→cancelScan, L→seen, IUs→openHistoryStream (:454804),
//          re→abortSignal, oe→gen, zGf→scanTelemetryFired, be→logEvent
```

### [Algorithm] Capture-then-compare, the two-line generation guard

**What it does:** makes a long-running async loop safe against its own resource being replaced or
released while it is suspended.

**How it works:**
1. `let oe = H.current` binds the generator to a local **before** the loop. Every `await` now targets
   an object that provably exists for the whole loop, so step 4 of the 193 failure cannot happen.
2. `if (H.current !== oe) return;` runs **immediately after every await**, before any state write.
   The ref is the single source of truth for "which scan is current"; a mismatch means either
   `M()` cleared it (close) or a keystroke started a fresh scan.
3. Returning — rather than breaking — leaves the *newer* scan's state untouched. There is no
   cleanup to do: `M()` already called `oe.return(void 0)`, which resolves the generator's
   `finally` blocks and closes the file handle.
4. `M()` itself (`:743411-743413`) is `if (H.current) (H.current.return(void 0), (H.current = void 0));`
   — cooperative cancellation via the generator protocol, not an abort signal. The `AbortSignal`
   path (`re?.aborted`) is retained for the *caller-driven* cancel and is a separate mechanism.

**Why this approach:**
- Capturing the generator is the minimal change; the generation check is what turns "does not crash"
  into "does not corrupt". Without it a superseded scan would still call `R(se.value)`, `m(!1)`,
  `i(...)`, `r(...)` — four state setters — and paint a stale match over the new query's results.
- Placing the check *after* the await and *before* the state writes is the only correct position.
  Before the await it is stale by definition; after the writes it is pointless.
- The check is `!==` on object identity rather than a monotonically increasing counter. Identity is
  free here because the ref already holds the generator, and it is impossible to get wrong: any
  reassignment, including `undefined`, invalidates it.

**Key insight:** `zGf` gates a **once-per-process** `history_search_scan` telemetry event. Its
position — after the first `await`, before the generation check — means the event fires even for a
scan that is about to be discarded. That is deliberate: the metric being collected is "did any
history scan ever get far enough to await a line", i.e. "is the history file readable at all",
not "did a search succeed". The sibling `history_search_accept` /
`history_search_execute` events (`:743461`, `:743480`) with their `accept_no_match` /
`execute_no_match` error variants carry the success signal.

---

## 9. Re-pasting expands `[Pasted text #N]` in the agent view (`.207`)

`.207`: *"Improved agent view: pasting the same text again now expands the collapsed
`[Pasted text #N]` placeholder instead of adding a second one."* Scoping filed this CARRYOVER
(`[Pasted text #` 220=3 / 193=3), which is right about the *literal* and wrong about the *behaviour*.

The expander itself is carryover: `gPo` (`:454789-454802`) is byte-for-byte 193's `Tji`
(`:186048-186061 (193)`). The delta is its **call sites**:

| | 2.1.193 | 2.1.220 |
|---|---|---|
| main prompt input | `:635486 (193)` `Tji(ne, x)` | `:754073` `gPo(te, R)` |
| agent-view composer | **absent** | `:807029` `gPo(bi.current, Ao.current)` |

193's agent-view `onPaste` (`:677731-677744 (193)`) is a straight "is this big? then collapse it":

```javascript
onPaste: (ot) => {
  let Kn = ot.replace(/\r\n|\r/g, `\n`), zn = Uxe(Kn);
  if (Kn.length > d4e || zn > 2) {
    let pr = Fn.current++;
    ((Bn.current[pr] = { id: pr, type: "text", content: Kn }), Ln(new Aye(fst(pr, zn))));
    return;
  }
  Ln(new Aye(Kn));
},
```

220's (`:807020-807044`) prepends a same-content check against the *most recent* placeholder:

```javascript
onPaste: (qe) => {
  let Er = qe.replace(/\r\n|\r/g, `\n`),
    Br = Yn.current - 1,                       // the id the previous paste got
    qr = Ao.current[Br];
  if (Ya && qr?.type === "text" && qr.content === Er) {
    let Bo = gPo(bi.current, Ao.current);
    if (Bo?.id === Br) {
      (delete Ao.current[Br], Ma(Bo.expanded), Gt(Bo.cursorOffset), Ys(null));
      return;
    }
  }
  let An = Lmt(Er);
  if (Er.length > kDt || An > 2) {             // kDt = 800  (:223060)
    let Bo = Yn.current++;
    if (((Ao.current[Bo] = { id: Bo, type: "text", content: Er }), Cr(new f9e(cgr(Bo, An))), Ya && Er.length <= ugr))
      Ys(Bo);
    return;
  }
  ...
}
```

### [Decision] "Paste it again" as the un-collapse gesture

**What it does:** treats a second identical paste as a request to see the text, not to add it twice.

**How it works:**
1. Only the **immediately previous** id is considered (`Yn.current - 1`). There is no search over all
   placeholders.
2. The stored blob must be `type:"text"` and **exactly equal** after CRLF normalization.
3. `gPo` is then asked for the *highest-numbered* expandable placeholder in the buffer, and its id
   must match — so if the user typed after the paste and inserted another placeholder, the gesture
   is declined rather than expanding the wrong one.
4. On success the blob is deleted from the map, the buffer is replaced with the expanded text, and
   the cursor lands at the end of the inserted content.
5. `Ys(...)` records the id that would be expandable next; it is set to `null` on success and to the
   new id on a fresh collapse, but only when `Er.length <= ugr` (`ugr = 1e5`, `:455019`) — a
   100 KB ceiling. Beyond that the placeholder is permanent, because re-inflating 100 KB into a
   terminal text buffer would stall the renderer.

**Why this approach:** the alternative discoverable gestures are a dedicated key (another binding to
learn, another footer hint) or an automatic expansion on cursor entry (surprising, and destroys the
compaction the user wanted). "Do the same thing twice" is self-teaching: a user who cannot see their
paste and re-pastes gets exactly what they wanted, and a user who genuinely wants the text twice
notices immediately and can paste a third time.

**Trade-off:** it is impossible to intentionally paste the same block twice in a row as two
placeholders. Given `kDt = 800` characters is the collapse threshold, that is a rare intent.

---

## 10. Not covered / could not anchor

- **`.211` "300 ms delay revealing async content"** — the constant `300` is not isolable and no
  `loadingDelay`-style literal exists in either build. Confirmed only that `delay: 300` is 0/0.
- **`.216` "resume-picker hangs on failure"** and **"statusline running twice on resume"** — both
  share the `.216` four-part bullet with the dot-repeat fix (§3); they belong to other themes.
- **`.212` "shell mode `!` not executing commands with file paths while the path popup was open"** —
  `autocomplete` is 220=28 / 193=28, byte-identical; the fix is a condition inside the shell-mode
  submit path I could not isolate without a literal.
- **`.212` "auto-mode denial notifications breaking characters when truncated mid-emoji"** —
  `grapheme` 32/32, `truncateToWidth` 2/2. Pure carryover literals; belongs to permissions.
- **`.218` "prompt history entries dropped or duplicated when history writes raced"** — the write
  path is `history.jsonl` append; I found the reader (`yPo`, §8) but no diffable change in the
  writer.
- **`.215`/`.216` "@-mentions attaching nothing after file-modifying hooks"** — belongs to the hooks
  theme.

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
- `parseVimInsertModeRemaps` (`Yxb`, `:656551`) - validates a settings record into a two-grapheme → `<Esc>` map
- `getVimInsertModeRemaps` (`dba`, `:656561`) - per-keystroke resolver, no memo
- `useVimInput` (`Sba`, `:656887`) - the vim layer wrapping the base input hook
- `recordPendingRemapChar` (`C`, `:656913`) - remembers one candidate first character
- `exitInsertMode` (`H`, `:656935`) - dot-repeat recording with the provenance check
- `isChangeLikeRecord` (`bba`, `:656872`) - which change kinds open INSERT mode
- `resolveNormalModeKey` (`W7p`, `:656620`) - NORMAL dispatcher, now table-driven
- `NORMAL_COMMANDS` (`Xxb`, `:656801`) - null-prototype command table carrying `s` and `S`
- `VISUAL_COMMANDS` (`lkb`, `:656838`) - the VISUAL-mode sibling table
- `substituteChars` (`Wzo`, `:655968`) - vim `s`
- `applyLinewiseOperator` (`tjt`, `:655902`) - backs `S`, `cc`, `dd`, `yy`
- `useTextInput` (`yx`, `:657471`) - the shared input hook (193: `dk`)
- `classifyLeftArrowPress` (`Nyp`, `:559650`) - six-outcome ← gesture classifier
- `applyLeftArrowTransition` (`Fyp`, `:559664`) - its reducer
- `decodeCsiUToPasteText` (`Pay`, `:242971`) - Ctrl+I/J/M → TAB/LF/CR inside a paste
- `decodeModifierBitmask` (`wfs`, `:242883`) - xterm modifier parameter decoder
- `csiUSequenceToByte` (`SFu`, `:242961`) - CSI-u → raw byte for the UTF-8 reassembler
- `helpShortcutInputFilter` (`b5`, `:754123`) - the `?`-on-empty-prompt filter
- `toggleShortcutsPanel` (`LA`, `:753730`) - the only `tengu_help_toggled` emitter in 220
- `runHistorySearchScan` (`D`, `:743417`) - capture-then-compare scan loop
- `cancelHistorySearchScan` (`M`, `:743411`) - `generator.return()` cancellation
- `openHistoryStream` (`IUs`, `:454833`) - async generator over `history.jsonl`
- `expandLatestPastePlaceholder` (`gPo`, `:454789`) - carryover expander, new agent-view call site
- `expandAllPastePlaceholders` (`uve`, `:454778`) - used by the external-editor handoff
- `countGraphemes` (`Vde`, `:160220`), `firstGrapheme` (`ERt`, `:160210`), `lastGrapheme` (`xZ`, `:160214`)
