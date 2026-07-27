# The MEMORY.md index size budget: explicit error (`.210`) and spliced measurement (`.211`)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`.
Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`, tagged `(193)`.

Two consecutive-release bullets on one 130-line region:

> `.210` — *"Memory writes that leave a `MEMORY.md` index over its read limit now produce an explicit
> error instead of silent truncation"*
> `.211` — *"Improved the memory index over-limit warning to measure only loaded content, excluding
> frontmatter and HTML comments"*

`.210` changes what the message *says* when you are over. `.211` changes whether you are *counted* as
over at all. `.211` is the more consequential of the two: `.210` shipped a scarier message on top of a
measurement that was systematically wrong in the pessimistic direction, and `.211` is the correction
one release later. Reading them in changelog order tells the story backwards.

**Delta proof:**

| Literal | 220 | 193 | Meaning |
|---|---|---|---|
| `over its ${r.capDesc} read limit` | 1 (`:434076`) | **0** | the `.210` error text |
| `splicedSizeBytes` | 3 (`:434052`, `:434116`, `:434167`) | **0** | the `.211` second measurement |
| `spliceActive` | 3 (`:434052`, `:434118`, `:434169`) | **0** | the `.211` applicability flag |
| `over_cap` | 2 (`:436639` + emitter) | **0** | new telemetry field |
| `approaching the` | 1 (`:434076`) | 1 (`:455252 (193)`) | the *warn* half is carryover text |
| `keep one line per entry` | 1 | 1 | the advice tail is byte-identical |

The last two rows are the trap: half the message is unchanged. Anchoring on `approaching the` or on the
advice sentence scores this bullet as carryover and misses the whole change.

---

## 0. The constants, and why those numbers

All four live in one `var` block at `:160637-160647`:

```javascript
var DS = "MEMORY.md",     // :160637
  cie = 200,              // :160638  line cap
  Ixe = 25000,            // :160639  byte cap
  Too;                    // :160640
  … Too = 4 * Ixe;        // :160647  = 100,000  read window
```

2.1.193 declares the same three at `:151952-151954 (193)` (`UH = "MEMORY.md", RY = 200, Kae = 25000`) —
**the caps themselves are pure carryover.** `Too = 4 * Ixe` is 220-only (`Too = 4` is 220=1 / 193=0).

Also 220-only in this region: `ht_ = 0.8` and `tPd = 0.7` (`:434080-434081`) — but their 193 twins
`Nof = 0.8` / `Xgl = 0.7` sit at `:455255-455256 (193)` with identical values, so those are **renamed
carryover**, not new thresholds. (`_scope_v206_210.md:535` lists `ht_`/`tPd` alongside the new error
text; they are not part of the delta.)

**Why 25,000 bytes and 200 lines?** They are not arbitrary — they are the *loader's* truncation points,
enforced by `Htr` (`:161586-161628`), the function that actually cuts the file before it reaches the
model. `Htr` is the read limit; `aLo` merely reports on it. Two caps rather than one because they fail
in different ways:

- **200 lines** is the *index* semantic. `MEMORY.md` is meant to be one line per memory
  (`:161381`: *"lines after 200 will be truncated, so keep the index concise"*). 200 lines is 200
  memories — the point at which an index stops being scannable by the model in one pass.
- **25,000 bytes** is the token budget. At roughly 4 bytes/token that is ~6 k tokens injected into
  *every* turn of *every* session, since the index is always-loaded context. It also implies a
  ~125 bytes/line average, and the prompt asks for ~150 chars/entry (`:332804`) — the two caps are
  tuned to bind at about the same point for a well-formed index.

`Htr` applies them **in that order** and re-checks: line-truncate first (`:161590-161599`), then if the
result still exceeds `Ixe`, cut at the last newline before byte 25,000 (`:161600-161607`). The
`lastIndexOf("\n", Ixe)` means the byte cut never lands mid-entry — a partial index line is worse than a
missing one, because the model would read a truncated pointer as a complete fact.

**Why the 0.8 warn threshold and the 0.7 rewrite target?** `frac < ht_` returns `null` (`:434074`), so
nothing is said below 80 % of a cap. The advice then asks for **70 %**, not 79 %. The 10-point gap is
deliberate hysteresis: compacting to just under the warn line would re-trigger the warning on the very
next memory write, and the memory index only ever grows. A 30 % headroom target buys roughly 60 more
one-line entries before the next nag.

**Why `Too = 4 × 25,000 = 100,000` for the read window?** `rPd` must answer *"how big is this file"*
without loading an unbounded file into memory — the check runs on the PostToolUse path of every Edit and
Write. `Vtt` (`:20114-20127`) opens the file, `stat`s it for the true `bytesTotal`, and reads at most
`Too` bytes, returning `{ content, bytesRead, bytesTotal }`. 4× the cap is enough to (a) always see the
whole of any file that could plausibly be *near* the cap after frontmatter and comments are stripped,
and (b) hard-bound the work at 100 KB. Beyond 4× the file is so far over that the exact spliced size
does not matter — and the code knows it, which is why the splice is conditional on
`u.bytesRead >= u.bytesTotal` (§3.2).

---

## 1. The pipeline, and where each bullet lands

```
Write/Edit lands on a file
   └─ PostToolUse internal callback (registered :436643-436654 on Read/Edit/Write/+2)
        ├─ oPd(path, teamRoot)   :434139   team memory index      ─┐
        └─ rPd(path)             :434085   user MEMORY.md index    │
              ├─ Vtt(path, 0, Too)          :434100  bounded read  │  measurement
              ├─ Lp(...).content            :434108  strip frontmatter   <- .211
              ├─ NPu(...).content           :434108  strip HTML comments <- .211
              ├─ wRt(...)                   :434105/:434108  {lineCount, byteCount}
              ├─ sLo({raw, surfaceCap, spliced, spliceCap, spliceActive}) :434052  <- .211
              └─ aLo({...})                 :434055  message + overCap    <- .210
        └─ FPd(gate, result, ctx) :436637
              ├─ O(gate, { over_cap: t.overCap, ... })   telemetry        <- .210
              └─ { hookSpecificOutput: { additionalContext: t.text } }    -> injected into the model's context
```

The result is **not** a UI warning. It is `additionalContext` on a `PostToolUse` hook output
(`:436640`), i.e. text spliced into the conversation immediately after the tool result. The audience is
the model, not the user — which is why `.210`'s change of wording matters so much: it is a prompt
change dressed as a message change.

---

## 2. Bullet `.210` — the warning became an error

### 2.1 What changed

```javascript
// ============================================
// buildMemoryIndexCapNotice - picks the binding cap and renders the warn-or-error notice
// Location: cli_inner_pretty.js:434055-434079
// ============================================

// ORIGINAL (for source lookup):
function aLo(e) {
  let t = [
    { frac: e.sizeBytes / e.byteCap, over: e.sizeBytes > e.byteCap,
      sizeDesc: pl(e.sizeBytes), capDesc: pl(e.byteCap), targetDesc: pl(Math.floor(e.byteCap * tPd)) },
  ];
  if (e.lineCap !== void 0 && e.lineCount !== void 0)
    t.push({ frac: e.lineCount / e.lineCap, over: e.lineCount > e.lineCap,
      sizeDesc: `${e.lineCount} lines`, capDesc: `${e.lineCap}-line`,
      targetDesc: `${Math.floor(e.lineCap * tPd)} lines` });
  let r = t.reduce((o, i) => (i.frac > o.frac ? i : o));
  if (r.frac < ht_) return null;
  return {
    text: `${r.over ? `Error: this write left the ${e.label} at ${e.displayPath} at ${r.sizeDesc}, over its ${r.capDesc} read limit. The write succeeded, but everything past the limit ` + "is silently dropped each time the index is loaded — entries at the end are already invisible " + "to readers. Rewrite it" : `The ${e.label} at ${e.displayPath} is ${r.sizeDesc}, approaching the ${r.capDesc} read limit. Compact it`} to under ${r.targetDesc} now: keep one line per entry, move detail into topic files, and merge or drop stale entries.`,
    overCap: r.over,
  };
}

// READABLE (for understanding):
function buildMemoryIndexCapNotice(m) {
  let candidates = [
    { frac: m.sizeBytes / m.byteCap,
      over: m.sizeBytes > m.byteCap,                       // 2.1.193 used >=
      sizeDesc: formatBytes(m.sizeBytes), capDesc: formatBytes(m.byteCap),
      targetDesc: formatBytes(Math.floor(m.byteCap * COMPACT_TARGET_FRAC)) },
  ];
  if (m.lineCap !== undefined && m.lineCount !== undefined)
    candidates.push({ frac: m.lineCount / m.lineCap,
      over: m.lineCount > m.lineCap,                       // 2.1.193 used >=
      sizeDesc: `${m.lineCount} lines`, capDesc: `${m.lineCap}-line`,
      targetDesc: `${Math.floor(m.lineCap * COMPACT_TARGET_FRAC)} lines` });
  let binding = candidates.reduce((a, b) => (b.frac > a.frac ? b : a));   // whichever cap is tightest
  if (binding.frac < WARN_AT_FRAC) return null;                           // 0.8
  return {
    text: binding.over
      ? `Error: this write left the ${m.label} at ${m.displayPath} at ${binding.sizeDesc}, over its `
        + `${binding.capDesc} read limit. The write succeeded, but everything past the limit is silently `
        + `dropped each time the index is loaded — entries at the end are already invisible to readers. `
        + `Rewrite it to under ${binding.targetDesc} now: keep one line per entry, move detail into topic `
        + `files, and merge or drop stale entries.`
      : `The ${m.label} at ${m.displayPath} is ${binding.sizeDesc}, approaching the ${binding.capDesc} `
        + `read limit. Compact it to under ${binding.targetDesc} now: keep one line per entry, move detail `
        + `into topic files, and merge or drop stale entries.`,
    overCap: binding.over,                                                // NEW: structured, for telemetry
  };
}

// Mapping: aLo→buildMemoryIndexCapNotice, ht_→WARN_AT_FRAC (0.8), tPd→COMPACT_TARGET_FRAC (0.7),
//          pl→formatBytes, e→measurement, r→binding
```

The 2.1.193 twin is `lKn` (`:455230-455254 (193)`). Same `frac`/`reduce`/`0.8` skeleton. Three
differences:

| | 2.1.193 `lKn` | 2.1.220 `aLo` |
|---|---|---|
| Return type | `string \| null` | `{ text, overCap } \| null` |
| Over-cap phrasing | `over the ${capDesc} read limit — content beyond that is dropped when this index is loaded` (a clause spliced into the same sentence, `:455251 (193)`) | a separate sentence prefixed **`Error:`**, stating the write *succeeded*, that the drop is *silent* and *recurring*, and that entries are *already invisible* |
| Over-cap test | `sizeBytes >= byteCap`, `lineCount >= lineCap` (`:455234`, `:455243 (193)`) | `> byteCap`, `> lineCap` (`:434059`, `:434068`) |

### 2.2 The three rewrites of the message, and why each one matters

**`Error:` prefix.** The text goes into the model's context as `additionalContext`. Models weight a
line beginning `Error:` far more heavily than one beginning `The memory index at MEMORY.md is …`. This
is the entire mechanism of "produce an explicit error instead of silent truncation" — there is no
exception, no non-zero exit, no refusal. The write still succeeds (`:436640` returns
`hookSpecificOutput`, never a block). **The bullet's word "error" is a prompt-level classification, not
a control-flow one**, and a reader expecting the Write tool to fail will not find that code.

**"The write succeeded, but …".** Disambiguates the `Error:` prefix immediately, so the model does not
retry the write or report failure to the user. The two clauses do opposite jobs on purpose: raise
salience, then prevent the obvious wrong reaction.

**"entries at the end are already invisible to readers".** 193's *"content beyond that is dropped when
this index is loaded"* describes a future/conditional loss. 220 states a present fact about data the
model has already written. It also localises the damage — *at the end* — which tells the model where to
look. The phrase "each time the index is loaded" adds that it is not a one-off.

### 2.3 The `>=` → `>` off-by-one

An index of exactly 25,000 bytes, or exactly 200 lines, is **not truncated** by `Htr`:

```javascript
let i = n > cie,          // :161588  wasLineTruncated
  s = o > Ixe;            // :161589  wasByteTruncated
if (!i && !s) return { content: r, … };
```

Both are strict `>`. 2.1.193's warning builder used `>=`, so a file sitting exactly on a cap was told it
was over the limit and losing data — when nothing was being dropped. 2.1.220 aligns the reporter with
the enforcer.

This is invisible in a literal diff (no string changed) and would have been harmless while the message
was a soft warning. Once the message became `Error: … entries at the end are already invisible`, a
false positive is actively misleading — so the two changes belong to the same release for a reason.

### 2.4 `overCap` and the new telemetry field

```javascript
// ============================================
// deliverMemoryIndexCapNotice - emits the gate with over_cap, then injects the notice as context
// Location: cli_inner_pretty.js:436637-436642
// ============================================

// ORIGINAL (for source lookup):
function FPd(e, t, r) {
  return (
    O(e, { over_cap: t.overCap, ...r }),
    { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: t.text } }
  );
}

// READABLE (for understanding):
function deliverMemoryIndexCapNotice(gateName, notice, baseAttrs) {
  emitTelemetry(gateName, { over_cap: notice.overCap, ...baseAttrs });
  return { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: notice.text } };
}

// Mapping: FPd→deliverMemoryIndexCapNotice, O→emitTelemetry, t→notice, r→baseAttrs
```

The two gate names it is called with — `tengu_team_mem_prompt_index_near_cap` (`:436629`) and
`tengu_memdir_entrypoint_near_cap` (`:436633`) — are **220=1 / 193=1 each: carryover**. Only the
`over_cap` field is new (220=2 / 193=0). This is the structural reason `aLo`'s return type changed from
`string` to an object: 193 could not report *which side of the cap* fired, because the caller only had a
rendered sentence. Splitting the boolean out lets the dashboards separate "approaching" from "over"
without parsing English — and the fact that `FPd` was factored out as a shared helper for both the team
and user paths is what made the change one-line-per-call-site.

Note the argument order `{ over_cap: …, ...r }`: the spread comes **last**, so a caller-supplied
`over_cap` in `r` would win. In practice `r` is the tool-context attribute bag and never contains it.

---

## 3. Bullet `.211` — measuring the spliced content, not the file

### 3.1 The bug

The loader has always injected only *part* of `MEMORY.md`. `mny` (`:235636-235651`) — and its
byte-identical 2.1.193 twin `N9d` (`:233797-233812 (193)`) — does, in order:

1. `fny(content)` (`:235627`) → `Lp(content).content`: **strips the YAML frontmatter block.**
2. If the remainder contains `<!--`, lex it and run `sds` (`:233869`) → **strips HTML comments**,
   dropping whole comment-only tokens and blanking comments inside mixed HTML blocks.
3. `Htr(stripped)` (`:235645`) → truncates at 200 lines / 25,000 bytes.

So the cap has always applied to the **spliced** text. But 2.1.193's checker measured something else:

```javascript
async function Qgl(e) {                                     // :455260-455283 (193)
  …
  let n;
  try { n = await Jgl.readFile(e, "utf8"); } catch { return null; }
  let r = n.trim();
  return lKn({ label: "memory index", displayPath: UH,
    sizeBytes: r.length,                                    // <-- WHOLE FILE, frontmatter + comments
    byteCap: Kae,
    lineCount: hu(r, "\n") + 1, lineCap: RY });
}
```

`r.length` is the trimmed **raw file**. A memory index with a 3 KB frontmatter block and a 5 KB
commented-out staging area was measured at 8 KB more than the model would ever see. It could be warned,
or after `.210` told `Error: … entries are already invisible`, while the loaded content sat comfortably
at 60 % of the cap and nothing whatsoever was being dropped.

The failure is one-directional — the raw size is always ≥ the spliced size — so 2.1.193 could only ever
**over**-report. Combined with `.210`'s new `Error:` wording, that is a false alarm instructing the
model to destroy index entries that were fine. That is why the fix landed one release later.

### 3.2 The fix: two measurements and a chooser

```javascript
// ============================================
// checkUserMemoryIndexCap - PostToolUse size check for MEMORY.md, with raw vs spliced accounting
// Location: cli_inner_pretty.js:434085-434122
// ============================================

// ORIGINAL (for source lookup):
async function rPd(e) {
  if (!xm()) return null;
  let t = Nln.resolve(e).normalize("NFC"),
    r = t === Nln.resolve(Jqe()).normalize("NFC"),
    n = !r && Nln.basename(t) === DS && HRt(t);
  if (!r && !n) return null;
  let o = process.env.CLAUDE_COWORK_MEMORY_INDEX_CONTENT,
    i = r ? gt_() : void 0,
    s = r && o !== "" && !Axe(),
    a = i !== void 0 && !Z.CLAUDE_COWORK_MEMORY_GUIDELINES,
    l = i?.promptIndexMaxBytes,
    c = n || s || a;
  if (!c && l === void 0) return null;
  let u;
  try { u = await Vtt(e, 0, Too); } catch { return null; }
  if (u === null) return null;
  let d = wRt(u.content);
  if (s && u.bytesRead >= u.bytesTotal)
    try { d = wRt(NPu(Lp(u.content).content).content); } catch {}
  return aLo({
    label: "memory index",
    displayPath: DS,
    ...sLo({ rawSizeBytes: u.bytesTotal, surfaceCap: l, splicedSizeBytes: d.byteCount, spliceCap: Ixe, spliceActive: c }),
    ...(c && { lineCount: d.lineCount, lineCap: cie }),
  });
}

// READABLE (for understanding):
async function checkUserMemoryIndexCap(writtenPath) {
  if (!isAutoMemoryEnabled()) return null;
  let abs = path.resolve(writtenPath).normalize("NFC"),
    isUserIndex = abs === path.resolve(getUserMemoryIndexPath()).normalize("NFC"),
    isNestedStoreIndex = !isUserIndex && path.basename(abs) === "MEMORY.md" && isNestedMemoryStoreRoot(abs);
  if (!isUserIndex && !isNestedStoreIndex) return null;

  let injectedIndexOverride = process.env.CLAUDE_COWORK_MEMORY_INDEX_CONTENT,
    userMount = isUserIndex ? findUserPromptIndexMount() : undefined,
    loadedIntoPrompt   = isUserIndex && injectedIndexOverride !== "" && !isMemoryIndexHidden(),
    guidelinesInPrompt = userMount !== undefined && !env.CLAUDE_COWORK_MEMORY_GUIDELINES,
    surfaceCap = userMount?.promptIndexMaxBytes,
    spliceActive = isNestedStoreIndex || loadedIntoPrompt || guidelinesInPrompt;
  if (!spliceActive && surfaceCap === undefined) return null;      // nobody caps this file

  let read;
  try { read = await readFileWindow(writtenPath, 0, MEMORY_INDEX_READ_WINDOW); } catch { return null; }
  if (read === null) return null;

  let measured = measureTrimmed(read.content);                     // raw (minus outer whitespace)
  if (loadedIntoPrompt && read.bytesRead >= read.bytesTotal)       // only if we saw the WHOLE file
    try { measured = measureTrimmed(stripHtmlComments(parseFrontmatter(read.content).content).content); }
    catch {}                                                       // splice failure -> keep the raw measure

  return buildMemoryIndexCapNotice({
    label: "memory index",
    displayPath: "MEMORY.md",
    ...chooseBindingSizeBasis({ rawSizeBytes: read.bytesTotal, surfaceCap,
                                splicedSizeBytes: measured.byteCount, spliceCap: MEMORY_INDEX_BYTE_CAP,
                                spliceActive }),
    ...(spliceActive && { lineCount: measured.lineCount, lineCap: MEMORY_INDEX_LINE_CAP }),
  });
}

// Mapping: rPd→checkUserMemoryIndexCap, xm→isAutoMemoryEnabled, Jqe→getUserMemoryIndexPath,
//          HRt→isNestedMemoryStoreRoot, gt_→findUserPromptIndexMount, Axe→isMemoryIndexHidden,
//          Vtt→readFileWindow, wRt→measureTrimmed, NPu→stripHtmlComments, Lp→parseFrontmatter,
//          sLo→chooseBindingSizeBasis, aLo→buildMemoryIndexCapNotice, Too→MEMORY_INDEX_READ_WINDOW,
//          Ixe→MEMORY_INDEX_BYTE_CAP, cie→MEMORY_INDEX_LINE_CAP
```

**What exactly is now counted** (`:434108`, the answer to the bullet's "only loaded content"):

```
measureTrimmed( stripHtmlComments( parseFrontmatter(fileContent).content ).content )
   ^ .trim(), then byteCount = trimmed.length and lineCount = newlines + 1   (wRt, :160615-160627)
```

That is *exactly* the composition `mny` applies before calling `Htr` — steps 1 and 2 of §3.1, in the
same order, using the same two functions. The checker no longer approximates the loader; it replays it.

Three edge cases the code handles explicitly:

1. **`read.bytesRead >= read.bytesTotal`** (`:434106`). The splice only runs if the 100 KB window
   captured the whole file. On a truncated read, `Lp` would parse a frontmatter block whose closing
   fence may lie past the window and `sds` would lex an unterminated comment — either could *under*-count
   badly. Falling back to the raw measure keeps the error conservative in the right direction.
2. **`try { … } catch {}`** around the splice (`:434107-434109`). A malformed document leaves
   `measured` at its raw value. Same reasoning: never let the measurement crash a Write's PostToolUse.
3. **Line counts only when `spliceActive`** (`:434120`). If the file is not actually loaded into the
   prompt, the 200-line index semantic does not apply and only the byte cap is checked.

### 3.3 `chooseBindingSizeBasis` — two caps, two units, one answer

```javascript
// ============================================
// chooseBindingSizeBasis - picks raw-vs-surface or spliced-vs-splice, whichever is proportionally tighter
// Location: cli_inner_pretty.js:434052-434054
// ============================================

// ORIGINAL (for source lookup):
function sLo({ rawSizeBytes: e, surfaceCap: t, splicedSizeBytes: r, spliceCap: n, spliceActive: o }) {
  return t !== void 0 && (!o || e / t >= r / n) ? { sizeBytes: e, byteCap: t } : { sizeBytes: r, byteCap: n };
}

// READABLE (for understanding):
function chooseBindingSizeBasis({ rawSizeBytes, surfaceCap, splicedSizeBytes, spliceCap, spliceActive }) {
  let surfaceBinds = surfaceCap !== undefined
    && (!spliceActive                                   // no prompt splice -> the surface cap is the only one
        || rawSizeBytes / surfaceCap >= splicedSizeBytes / spliceCap);   // else: proportionally tighter wins
  return surfaceBinds
    ? { sizeBytes: rawSizeBytes,    byteCap: surfaceCap }
    : { sizeBytes: splicedSizeBytes, byteCap: spliceCap };
}

// Mapping: sLo→chooseBindingSizeBasis, e→rawSizeBytes, t→surfaceCap, r→splicedSizeBytes,
//          n→spliceCap, o→spliceActive
```

**What it does:** there are genuinely two different limits on a memory index and they measure different
bytes.

| Basis | Bytes counted | Cap | Who enforces it |
|---|---|---|---|
| **surface** | `bytesTotal` — the whole file on disk | `promptIndexMaxBytes`, a per-mount value from the memory-mount config (`gt_`, `:434123-434125`) | the memory service that stores/syncs the file |
| **splice** | frontmatter- and comment-stripped, trimmed | `Ixe = 25000` | `Htr`, the local prompt loader |

**How it decides:** by comparing *fractions of cap*, `raw/surfaceCap` vs `spliced/spliceCap`, not
absolute sizes. Comparing bytes would be meaningless — the two numbers count different things against
different ceilings. The `>=` on the fraction comparison makes the surface cap win ties, which keeps the
message pointed at the externally-imposed limit when both are equally tight.

Two short-circuits precede the comparison, in order:

1. `surfaceCap === undefined` — no mount-level cap configured, so the splice basis is the only one.
2. `!spliceActive` — the file is not injected into the prompt at all (index hidden via
   `tengu_moth_copse`/`CLAUDE_MEMORY_STORES` (`:156959-156963`), or overridden by
   `CLAUDE_COWORK_MEMORY_INDEX_CONTENT`), so the 25,000-byte prompt cap is irrelevant and only the
   surface cap can bind. Note that in this branch `splicedSizeBytes` still holds the *raw* trimmed
   measure (the splice at `:434108` is guarded by `loadedIntoPrompt`), so falling through to the splice
   basis would compare raw bytes against the prompt cap — the guard is load-bearing, not cosmetic.

**Why this approach:** the alternative — emit two notices, one per cap — would double the context
injected on every over-limit write, and the two would frequently disagree about the target size
(`0.7 × promptIndexMaxBytes` vs 17.5 KB). Reporting only the binding constraint gives the model exactly
one number to hit. It also composes cleanly with `aLo`'s *own* `reduce` over the byte and line
candidates (`:434073`): `sLo` picks the binding **byte** basis, `aLo` then picks between that and the
**line** basis. Two independent max-by-fraction selections, same idiom, no cross-product.

**Key insight:** `.211` is not "subtract the frontmatter". It is the recognition that *the checker and
the loader must compute the same number*, and that when two authorities cap the same file for different
reasons, the honest report is the tighter one expressed as a fraction.

### 3.4 The team-index twin

`oPd` (`:434139-434172`) is the same shape for team memory indexes, keyed by a mount whose
`promptIndex` path resolves to the written file (`:434143-434148`, case-folded via `xtr` `:160628`).
Two differences worth noting:

- `spliceActive` is simply `!Z.CLAUDE_COWORK_MEMORY_GUIDELINES` (`:434159`) — team indexes have no
  hidden/override modes.
- It always uses the raw measure for `splicedSizeBytes` (`:434167` reads `s.byteCount` from
  `wRt(i.content)` at `:434157` with **no splice step**). So the team path got the new *plumbing* but
  not the frontmatter/comment stripping. Whether that is intentional (team indexes are
  service-generated and carry no frontmatter) or an omission is not decidable from the bundle — but a
  reader should not claim `.211` fixed both paths. It fixed the user path.

The 2.1.193 team twin `thl` (`:455292-455316 (193)`) used `(await stat(e)).size` and
`o.promptIndexMaxBytes ?? Kae` — a single measurement, a single cap, with the 25,000 default folded in
via `??`. 2.1.220 splits that `??` into the explicit two-basis choice, which is what made a per-basis
comparison possible at all.

---

## 4. What a reader should take away

1. **The "error" is a prompt, not a control-flow event.** `Error:` is a token the model weights; the
   write always succeeds. Nothing in this path can fail a tool call.
2. **The caps are old; the accounting is new.** 25,000 / 200 / 0.8 / 0.7 are all carryover under
   different symbol names. Anyone diffing constants finds nothing here.
3. **`.210` and `.211` must be read as a pair,** and in reverse changelog order: `.210` sharpened a
   message that `.211` then made trustworthy. Documenting `.210` alone would describe a scary message
   sitting on a measurement that systematically over-reported.
4. **The team path is only half-fixed** (§3.4) — new plumbing, no splice.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_auto_memory.md](../00_overview/symbol_additions_v2_1_220_auto_memory.md).

Key functions in this document:
- `chooseBindingSizeBasis` (`sLo`, `:434052`) - raw-vs-spliced basis chooser, compares fractions of cap
- `buildMemoryIndexCapNotice` (`aLo`, `:434055`) - warn-or-error renderer returning `{text, overCap}`
- `checkUserMemoryIndexCap` (`rPd`, `:434085`) - PostToolUse check for the user `MEMORY.md`
- `checkTeamMemoryIndexCap` (`oPd`, `:434139`) - the team-mount twin (no splice step)
- `findUserPromptIndexMount` (`gt_`, `:434123`) - user-scope mount whose `promptIndex` is `MEMORY.md`
- `deliverMemoryIndexCapNotice` (`FPd`, `:436637`) - emits `over_cap` telemetry, returns `additionalContext`
- `truncateMemoryForPrompt` (`Htr`, `:161586`) - the actual read limit: 200 lines then 25,000 bytes
- `measureTrimmed` (`wRt`, `:160615`) - `{trimmed, lineCount, byteCount}`
- `readFileWindow` (`Vtt`, `:20114`) - bounded positional read returning `{content, bytesRead, bytesTotal}`
- `stripHtmlComments` (`NPu`, `:233865`) - marked-lexer comment stripper
- `stripHtmlCommentTokens` (`sds`, `:233869`) - the token walk behind it
- `loadMemoryFileForPrompt` (`mny`, `:235636`) - the loader whose splice order the checker now replays
- `splitFrontmatterAndPaths` (`fny`, `:235627`) - frontmatter strip + `paths:` extraction
- `isAutoMemoryEnabled` (`xm`, `:156938`) - master auto-memory switch
- `isMemoryIndexHidden` (`Axe`, `:156959`) - `tengu_moth_copse` / `CLAUDE_MEMORY_STORES`
- `isNestedMemoryStoreRoot` (`HRt`, `:161961`) - nested-store `MEMORY.md` detector
- `getMemoryMounts` (`atr`, `:158545`) - mount list, `null` on failure
- `formatBytes` (`pl`, `:33132`) - `bytes`/`KB`/`MB`/`GB` renderer
- `MEMORY_INDEX_FILENAME` (`DS`, `:160637`) - `"MEMORY.md"`
- `MEMORY_INDEX_LINE_CAP` (`cie`, `:160638`) - `200`
- `MEMORY_INDEX_BYTE_CAP` (`Ixe`, `:160639`) - `25000`
- `MEMORY_INDEX_READ_WINDOW` (`Too`, `:160647`) - `4 * Ixe` = 100,000
- `WARN_AT_FRAC` (`ht_`, `:434080`) - `0.8`
- `COMPACT_TARGET_FRAC` (`tPd`, `:434081`) - `0.7`
