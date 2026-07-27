# Emoji shortcode autocomplete (`.217`) — the one unambiguously net-new feature in this theme

**Bundles** (see [`_CONVENTIONS.md`](../_CONVENTIONS.md) §1): `T = 2.1.220` (872,596 lines),
`B = 2.1.193` (718,679 lines). Every `cli_inner_pretty.js:<line>` below without a `(193)` tag was read
in the 2.1.220 bundle by me.

`.217`: *"Added emoji shortcode autocomplete in the prompt input: type `:heart:` to insert ❤️, or
`:hea` for suggestions — disable with the `emojiCompletionEnabled` setting."*

This is the only bullet in `48_accessibility_ui` where **every** component is new. Measured:

| Anchor | 2.1.220 | 2.1.193 |
|---|---|---|
| `emojiCompletionEnabled` (settings key) | 2 (`:61202`, `:746222`) | **0** |
| `heart_eyes` (a table entry) | 2 (`:745115`, `:745116`) | **0** |
| `zipper_mouth_face` (a table entry) | 1 (`:746051`) | **0** |
| `input_emoji_completion` (telemetry) | 3 (`:746468`, `:746750`, `:746899`) | **0** |
| shortcode table `Oli` | `:744484-746052`, **1,567 entries** | absent |

There is no carryover to disentangle here, so this document concentrates on the *design* — in
particular on the two-mode trigger and on the one guard (`hLS`) that stops the feature from
corrupting text it did not create.

---

## 1. The shape of the feature

Two distinct behaviours share one shortcode table:

```
typing ":hea"      ──▶ aQa  /(^|\s):([a-z0-9_+-]{2,})$/    ──▶ SUGGESTION POPUP (up to 20 rows)
typing ":heart:"   ──▶ mLS  /(^|\s):([a-z0-9_+-]+):$/      ──▶ INLINE REPLACEMENT (no popup)
```

Both are evaluated in the same block of the prompt-input effect (`:746459-746488`), inline form
first. Both are behind one flag:

```javascript
U = tg().emojiCompletionEnabled !== !1,        // :746222
```

Note the polarity: `!== !1` means **absent or `true` both enable**. The zod field
(`:61202-61207`) says the same thing in prose:

> `When false, the :emoji: shortcode typeahead (the suggestion popup and the :name: inline`
> `replacement) is disabled. When absent or true, it is enabled.`

A default-on feature declared as an *opt-out* boolean, exactly like its neighbour
`promptSuggestionEnabled` (`:61199`). The `!== !1` idiom (rather than `?? true`) also means a
non-boolean value that survived zod's `.optional()` — say `"false"` as a string — still enables the
feature rather than crashing the read.

---

## 2. The shortcode table

`Oli` (`:744484-746052`) is a flat `{ shortcode: emoji }` object with **1,567 entries**, lazily
initialised through the bundler's module-init thunk `A5f` (`:744483`) so the ~60 KB of string data
is only materialised when something imports the module. The keys are the GitHub/Slack shortcode
vocabulary — `+1`, `-1`, `100`, `1st_place_medal`, `8ball`, … `zipper_mouth_face`, `zzz` — including
country flags (`zambia`, `zimbabwe`), keycap sequences (`zero: "0️⃣"`) and ZWJ-composed
profession/gender variants (`woman_technologist: "👩‍💻"`).

The public surface is two functions behind a namespace object (`w5f`, `:746054-746055`):

```javascript
tt(w5f, { getEmojiSuggestions: () => lLS, getEmoji: () => aLS });
```

and the consumer holds it as `NRn` (`:747125`, `NRn = (T5f(), en(w5f))`) — a *lazily-required*
module, guarded at every call site by `if (NRn && …)`. The whole table can therefore be absent
(a stripped build) without any call site throwing.

`sLS = Object.keys(Oli)` (`:746075`) is computed once at module init: the search operates on a
pre-extracted key array rather than re-enumerating the object on every keystroke.

---

## 3. Suggestions: search and ranking

```javascript
// ============================================
// getEmojiSuggestions - substring search over 1,567 shortcodes with prefix-first ranking
// Location: cli_inner_pretty.js:746059-746070
// ============================================

// ORIGINAL (for source lookup):
function lLS(e) {
  let t = e.toLowerCase(),
    r = sLS.filter((n) => n.includes(t));
  return (
    r.sort((n, o) => {
      let i = n.startsWith(t) ? 0 : 1,
        s = o.startsWith(t) ? 0 : 1;
      return i - s || n.length - o.length;
    }),
    r.slice(0, iLS).map((n) => ({ id: `emoji:${n}`, displayText: Oli[n], description: `:${n}:` }))
  );
}
var iLS = 20, sLS;

// READABLE (for understanding):
function getEmojiSuggestions(query) {
  let needle = query.toLowerCase(),
    matches = SHORTCODE_KEYS.filter((k) => k.includes(needle));       // SUBSTRING, not prefix
  matches.sort((a, b) => {
    let aRank = a.startsWith(needle) ? 0 : 1,
      bRank = b.startsWith(needle) ? 0 : 1;
    return aRank - bRank || a.length - b.length;    // prefix matches first, then shortest name
  });
  return matches.slice(0, MAX_EMOJI_SUGGESTIONS).map((k) => ({
    id: `emoji:${k}`,
    displayText: EMOJI_BY_SHORTCODE[k],     // the emoji itself is the row's TEXT
    description: `:${k}:`,                  // the shortcode is the row's DESCRIPTION
  }));
}
var MAX_EMOJI_SUGGESTIONS = 20;

// Mapping: lLS→getEmojiSuggestions, aLS→getEmoji (:746056), Oli→EMOJI_BY_SHORTCODE (:744484),
//          sLS→SHORTCODE_KEYS (:746075), iLS→MAX_EMOJI_SUGGESTIONS (:746071)
```

### [Algorithm] Substring match with a two-key sort

**What it does:** turns a partial shortcode into at most 20 ranked completion rows.

**How it works:**
1. `includes(needle)` — a **substring** test, not `startsWith`. `:tech` finds `woman_technologist`
   and `man_technologist` as well as `technologist`.
2. The comparator's primary key is a *boolean promoted to 0/1*: prefix matches sort ahead of
   mid-string matches. This is the entire relevance model — there is no scoring, no fuzzy distance.
3. The tiebreaker is `a.length - b.length`, i.e. **shortest name wins**. Within the prefix group,
   `:heart` puts `heart` before `heart_eyes` before `heart_decoration`; within the substring group it
   puts the least-qualified variant first.
4. `slice(0, 20)` caps the popup.
5. The mapping is inverted relative to every other suggestion source in this input: `displayText` is
   the **emoji glyph** and `description` is the shortcode. So the popup shows a column of glyphs with
   their names alongside, and — crucially — `displayText` is what the accept path splices into the
   buffer (§5).

**Why this approach:**
- Substring rather than prefix is the right default for a vocabulary where the *distinguishing* word
  is often not first (`_face`, `_flag`, `woman_`, `man_`). Prefix-only would make
  half the table unreachable without knowing its exact opening word.
- Sorting after filtering (rather than maintaining a prefix trie) costs an O(n log n) sort over at
  most 1,567 strings on each keystroke — sub-millisecond, and it keeps the whole search to 12 lines
  with no index to build or invalidate. This is the right trade at this table size; it would not be
  at 100,000.
- The two-key comparator with `||` short-circuit is a standard idiom, but note it is **not stable
  across ties beyond length** — two shortcodes of identical length in the same rank group come out in
  `Object.keys` order, which is the source-literal order (roughly alphabetical). Good enough, and
  deterministic.

**Key insight:** the cap is 20 and the trigger requires **at least two characters**
(`{2,}` in `aQa`). Those two constants are coupled: with a one-character trigger, `:a` would match
~400 shortcodes and the top-20 would be arbitrary noise; two characters typically cuts it to a
usable set. The cap is not a performance guard (the sort already ran over everything) — it is a
*relevance* guard on the popup.

---

## 4. Inline replacement, and the guard that makes it safe

The inline path is the interesting one, because replacing text the user did not just type is how
autocorrect features become hated.

```javascript
// ============================================
// wasClosingColonJustTyped - proves the delta since the last render is a pure ":shortcode:" insertion
// Location: cli_inner_pretty.js:746077-746083
// ============================================

// ORIGINAL (for source lookup):
function hLS(e, t, r) {
  if (t === void 0) return !1;
  let n = e.length - t.length,
    o = r - n;
  return n > 0 && o >= 0 && e.slice(0, o) + e.slice(r) === t && /^[a-z0-9_+-]*:$/.test(e.slice(o, r));
}

// READABLE (for understanding):
function wasClosingColonJustTyped(currentText, previousText, cursorOffset) {
  if (previousText === undefined) return false;              // first render - nothing was "just typed"
  let insertedLength = currentText.length - previousText.length,
    insertStart = cursorOffset - insertedLength;
  return (
    insertedLength > 0 &&                                    // text grew
    insertStart >= 0 &&
    currentText.slice(0, insertStart) + currentText.slice(cursorOffset) === previousText &&
                                                             // removing [insertStart, cursor) reproduces the old text
                                                             //   -> the change was a PURE INSERTION at the cursor
    /^[a-z0-9_+-]*:$/.test(currentText.slice(insertStart, cursorOffset))
                                                             //   -> and it ends with the closing colon
  );
}

// Mapping: hLS→wasClosingColonJustTyped, e→currentText, t→previousText, r→cursorOffset
```

Its use, at `:746460-746472`:

```javascript
let _r = mt.substring(0, It),
  Wr = hLS(mt, lr, It) ? _r.match(mLS) : null;
if (Wr) {
  let $n = NRn.getEmoji(Wr[2]);
  if ($n) {
    let Nn = (Wr.index ?? 0) + (Wr[1]?.length ?? 0),
      we = mt.slice(0, Nn) + $n + mt.slice(It);
    (t(we), n(Nn + $n.length), he(), be("input_emoji_completion", { inline: !0 }));
    return;
  }
}
```

### [Decision] Why a diff-based "was it just typed" test instead of just matching the text

**What it does:** ensures the inline `:name:` → emoji substitution only fires on the keystroke that
*completed* the shortcode, never on text that merely happens to contain one.

**How it works:**
1. `insertedLength = current.length - previous.length` and `insertStart = cursor - insertedLength`
   reconstruct the presumed insertion span from two lengths and the cursor — no edit log needed.
2. `current.slice(0, insertStart) + current.slice(cursor) === previous` is the **proof**: if deleting
   that span reproduces the previous text exactly, then the only change was an insertion there. Any
   deletion, any replacement, any cursor jump, and this equality fails.
3. The span itself must match `/^[a-z0-9_+-]*:$/` — shortcode characters ending in a colon. Note the
   `*` (not `+`): a single-keystroke insertion of just `:` satisfies it, which is the common case.
   Longer spans satisfy it too, so pasting `:heart:` in one go also fires.
4. Only then is the *text before the cursor* matched against `mLS`
   (`/(^|\s):([a-z0-9_+-]+):$/`, `:747124`), which requires the opening colon to sit at the start of
   the buffer or after whitespace.
5. `Wr.index + (Wr[1]?.length ?? 0)` skips the captured leading whitespace so the replacement starts
   at the opening colon, not before it.

**Why this approach:**
- Without step 2 the feature would be actively destructive. Consider a user who has
  `see :heart: below` in the buffer and presses `←` to move the cursor to just after the closing
  colon: the regex matches, and a naive implementation would silently swap in an emoji they had
  already decided to leave as text. The same applies to undo, to history recall, and to
  `Ctrl+R` search results — every one of which can put a cursor after a `:name:` without a keystroke.
- Without step 3, a *deletion* that happens to leave the cursor after a colon would fire.
  `insertedLength > 0` alone would catch that, but the character-class test additionally rejects
  insertions like pasting a whole paragraph that ends in `:` — those are not shortcode completions.
- The alternative design — subscribing to keystrokes rather than to the rendered value — is not
  available here: this code runs in a value-effect that only sees `(currentText, previousText,
  cursorOffset)`. `hLS` reconstructs the missing keystroke information from the value diff, which is
  why it is written as a proof rather than a heuristic.

**Key insight:** the leading-whitespace requirement in both regexes (`(^|\s)`) is what keeps this
feature out of code and URLs. `http://x` contains `:` but not `\s:`; a TypeScript
`{ foo: bar }` has `: ` (colon then space) not `:name:`; a Python dict literal is safe for the same
reason. The one collision that *does* remain is a bare time-like token at a line start —
but `[a-z0-9_+-]` excludes nothing numeric, so `:30:` would match if `30` were a shortcode.
It is not; the numeric keys in the table are `100`, `1234`, `8ball`, `-1`, `+1`, `zero`. That is
luck rather than design, and worth knowing.

---

## 5. Accepting a suggestion, and the telemetry discriminator

The popup path reuses the input's generic token-replacing accept helper:

```javascript
// ============================================
// acceptSuggestionForPattern - replaces the pattern-matched token before the cursor with a suggestion
// Location: cli_inner_pretty.js:746119-746126
// ============================================

// ORIGINAL (for source lookup):
function JLr(e, t, r, n, o, i) {
  let s = t.slice(0, r).match(n);
  if (!s || s.index === void 0) return !1;
  let a = s.index + (s[1]?.length ?? 0),
    l = t.slice(0, a),
    c = l + e.displayText + " " + t.slice(r);
  return (o(c), i(l.length + e.displayText.length + 1), !0);
}

// READABLE (for understanding):
function acceptSuggestionForPattern(suggestion, text, cursor, pattern, setText, setCursor) {
  let m = text.slice(0, cursor).match(pattern);
  if (!m || m.index === undefined) return false;
  let tokenStart = m.index + (m[1]?.length ?? 0),      // skip the captured leading whitespace
    prefix = text.slice(0, tokenStart),
    next = prefix + suggestion.displayText + " " + text.slice(cursor);   // note the trailing space
  setText(next);
  setCursor(prefix.length + suggestion.displayText.length + 1);
  return true;
}

// Mapping: JLr→acceptSuggestionForPattern, e→suggestion, n→pattern, o→setText, i→setCursor
```

It is shared with the `@`-agent (`$li`) and `#`-Slack-channel (`sQa`) completions; the emoji path
just passes `aQa`. Because `displayText` is the glyph, accepting a row inserts the emoji — the
shortcode never enters the buffer. A **trailing space** is always appended, which is right for
`@name` and `#channel` and slightly opinionated for an emoji.

Both accept sites (Tab/Enter at `:746746-746751`, click/second path at `:746896-746901`) log:

```javascript
if ((he(), fr)) be("input_emoji_completion", { inline: !1 });
```

while the inline path logs `{ inline: !0 }`. One event name, one boolean property, two behaviours:

### [Decision] Why one event with a discriminator rather than two events

**What it does:** lets the metric "how often is emoji completion used" be read as a single number,
while still separating the popup from the inline substitution.

**Why this approach:** the two paths are one *feature* and one *setting* — killing
`emojiCompletionEnabled` kills both. A single event name means the adoption question is answered by
a count with no union, and the design question ("do people actually browse the popup, or do they know
the shortcode already?") is answered by grouping on `inline`. Two separate event names would have
required every downstream dashboard to sum them. The `if (fr)` guard on the popup path also means
the event only fires when the replacement actually happened (`JLr` returns `false` if the pattern no
longer matches), so the counter is of *effects*, not of *attempts*.

---

## 6. Mode bookkeeping

The suggestion popup is a shared surface with a mode tag `b` (`:746210`, `T("emoji")` at `:746481`).
Two small details are worth naming:

- `if (b === "emoji") he();` (`:746487`) — if neither regex matched on this keystroke and the popup
  was in emoji mode, dismiss it. Because the trigger regex is anchored to the cursor
  (`$`), typing a space or moving the cursor away drops the match, which drops the popup. There is no
  separate dismissal timer.
- `$Pe(Nn.suggestions, Nn.selectedSuggestion, $n)` (`:746478`) preserves the highlighted row across
  a refresh where possible, so narrowing `:hea` → `:hear` does not reset the selection to row 0.
- The emoji block is evaluated **after** the `#`-Slack-channel block (`:746452-746458`) and
  **before** the file/`@` block (`:746489+`). Ordering matters: `#` and `:` cannot collide, but the
  early `return` in each branch means the first matching completion source wins outright.

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
- `EMOJI_BY_SHORTCODE` (`Oli`, `:744484`) - the 1,567-entry shortcode table
- `SHORTCODE_KEYS` (`sLS`, `:746075`) - `Object.keys` snapshot taken once at module init
- `getEmoji` (`aLS`, `:746056`) - exact shortcode lookup
- `getEmojiSuggestions` (`lLS`, `:746059`) - substring search, prefix-first, capped at 20
- `MAX_EMOJI_SUGGESTIONS` (`iLS`, `:746071`) - the value 20
- `wasClosingColonJustTyped` (`hLS`, `:746077`) - value-diff proof that the closing `:` was just typed
- `acceptSuggestionForPattern` (`JLr`, `:746119`) - shared accept helper for `@`, `#` and `:` tokens
- `EMOJI_INLINE_RE` (`mLS`, `:747124`) - `/(^|\s):([a-z0-9_+-]+):$/`
- `EMOJI_PREFIX_RE` (`aQa`, `:747123`) - `/(^|\s):([a-z0-9_+-]{2,})$/`
- `SLACK_CHANNEL_RE` (`sQa`, `:747122`) - the sibling `#channel` pattern
- `emojiModule` (`NRn`, `:747125`) - lazily-required namespace holding the two exports
