# Auto memory deltas (v2.1.193 → v2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). Baseline `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`,
always tagged `(193)`.

The auto-memory surface got **five changelog bullets** in this window, spread over `.210`, `.211` and
`.214`. Every one of them is a *repair* to machinery that already shipped in 2.1.193, and four of the
five land in two small files:

| Concern | 2.1.220 region | Bullets |
|---|---|---|
| Frontmatter parse / rewrite | `:157974-158238` (parser + quoting pass), `:160637-160707` (memory record shape), `:238625-238756` (the stamper) | `.214` #10, `.214` #37 |
| Memory-index size budget | `:434052-434181` (the PostToolUse cap check), `:161586-161628` (the truncating loader) | `.210` #29, `.211` #28 |
| CLAUDE.md / rules loading | `:235851-236006` | `.211` #8 (shared with `40_system_prompt`) |

Two of the five bullets are the *same fix seen from two ends* — `.211` #28 corrects how the index size
is measured, and `.210` #29 changes what happens when that measurement is over the cap. They are written
up together in [`memory_index_size_budget.md`](memory_index_size_budget.md).

The single deepest item, and the one the changelog under-describes worst, is `.214` #37: a lossy
YAML round-trip that had been silently eating the tail of any frontmatter value containing an
inline `#`. The fix is a whole new *rewrite-safety* layer with a three-way fallback. That is
[`frontmatter_rewrite_safety.md`](frontmatter_rewrite_safety.md), which also covers `.214` #10 (the
`modified:` timestamp) because the two share one function and cannot be explained apart.

Current-state coverage, anchored directly in the 2.1.220 bundle:

- [`extraction_pipeline.md`](extraction_pipeline.md) — post-turn eligibility, UUID cursor, direct-write
  mutual exclusion, prose filter, throttle/coalescing, permission membrane, five-turn fork, telemetry,
  and graceful drain.
- [`dream_and_auto_dream.md`](dream_and_auto_dream.md) — availability/preference resolution, ordered
  schedule gates, PID+mtime lock, four-phase consolidation, task projection, cancellation rollback,
  settings UI, background-task UI, and three-way cross-validation.

---

## 1. Per-bullet ledger

| # | Bullet (verbatim) | Ver | Verdict | Anchor (2.1.220) | Doc section |
|---|---|---|---|---|---|
| 1 | *"Memory writes that leave a `MEMORY.md` index over its read limit now produce an explicit error instead of silent truncation"* | `.210` | **NET_NEW** | `over its ${r.capDesc} read limit` `:434076` — 220=1 / 193=0 | [budget §2](memory_index_size_budget.md#2-bullet-210--the-warning-became-an-error) |
| 2 | *"Improved the memory index over-limit warning to measure only loaded content, excluding frontmatter and HTML comments"* | `.211` | **NET_NEW** | `splicedSizeBytes` `:434052` / `spliceActive` — both 220=3 / 193=0 | [budget §3](memory_index_size_budget.md#3-bullet-211--measuring-the-spliced-content-not-the-file) |
| 3 | *"Fixed nested `.claude/rules/*.md` files loading even when setting sources exclude project settings"* | `.211` | **NET_NEW** (real anchor differs from the one scoped) | `if (o) {` guard `:235976` + `!pg("projectSettings")` `:235988` | [§4 below](#4-bullet-211-8--the-rules-loader-guard-real-anchor-recovered) |
| 4 | *"Added an ISO `modified` timestamp to memory file frontmatter"* | `.214` | **NET_NEW** (scoped anchor is a false delta) | `stampNewMemoryContent` `:238652-238668`; `modified: ${t}` `:238683` | [frontmatter §4](frontmatter_rewrite_safety.md#4-bullet-214-10--the-modified-timestamp) |
| 5 | *"Fixed memory frontmatter values being silently truncated at an inline `#` when memory files are saved"* | `.214` | **NET_NEW** (scoped anchor is a misattribution) | `quoteLossyValues` 220=5 / 193=0, `:158079`; `unprovableKeys` 220=3 / 193=0, `:158056` | [frontmatter §2-§3](frontmatter_rewrite_safety.md#2-the-bug-a-lossy-yaml-round-trip) |

**Score: 5 accounted for, 5 implemented-and-anchored, 0 carryover, 0 server-side, 0 unanchored.**
This theme has an unusually high hit rate — because all five bullets describe file-format behaviour,
and file-format behaviour always leaves a string literal behind.

---

## 2. False deltas caught

Three of the five anchors handed to this module by the scoping pass are wrong. All three would have
produced a plausible-looking but incorrect document.

### 2.1 `modified: new Date(` is **carryover**, not the `.214` anchor

`_scope_v211_214.md:190` proposes `modified: new Date(` (3 sites) as the anchor for the ISO-timestamp
bullet, scored `220=3 / 193=0`.

**Measured: 220=3 / 193=3.** The three 220 sites `:526781`, `:527058`, `:527327` map one-for-one onto
193's `:584954 (193)`, `:585212 (193)`, `:585435 (193)`. Read in both bundles, they are the **session /
transcript listing** builders — `modified: new Date(m.mtime)` on a session file's stat, feeding the
`/resume` picker's relative-time column (`:160548` `HZ(e.modified, { style: "short" })`). They have
nothing to do with memory frontmatter. The real writer is `Bfo` (`:238652`), which formats with
`new Date().toISOString()` at `:238654`, a string that appears nowhere in the proposed anchor.

The generic literal `modified` is 220=54 / 193=14 for `modified:` — a large but useless bump, because
most of it is unrelated. **Lesson: `modified` is one of the highest-frequency English words in this
bundle; never anchor on it.**

### 2.2 `tengu_cc_memory_tag_stripped` is **not** the inline-`#` gate

`_scope_v211_214.md:217` files the inline-`#` bullet as "NET_NEW (gate only)" on
`tengu_cc_memory_tag_stripped`. The gate *is* genuinely new (220=1 `:819762` / 193=0), but reading its
one call site shows it is about something else entirely: `obm` (`:819751-819776`) walks each assistant
`text`/`thinking` block, runs `Unu` (`:160716`) to count `<cc-memory …>` citation tags, and reports
`open_tag_count` / `close_tag_count` / `tagged_content_chars` / `memory_file_count` /
`missing_filenames_attr`. It measures how often the model emits the **memory-citation markup** that
`nk` (`:160712`) then strips from the display. Not a frontmatter parser, not a `#`, not a save path.

The real inline-`#` fix carries four 220-only literals — `quoteLossyValues`, `unprovableKeys`,
`rewriteHazard`, and the message `an inline '#' in [${…}] cannot be preserved by a rewrite`
(`:158091`) — none of which the scoping pass found.

### 2.3 `.claude/rules` — the +3 literal sites are **prompt text**, not the loader

`_scope_v211_214.md:36` scores `.claude/rules` at 220=8 / 193=5 and calls it "3 new sites around the
rules loader". The three new sites are `:785755`, `:785758`, `:785764` — all inside the `/doctor`
CLAUDE.md-trim prompt corpus (`Mind loading scope: a \`.claude/rules/*.md\` file with \`paths\`
frontmatter …`). They are documentation strings shown to the model, and are byte-absent from 193
because that whole `/doctor` skill section is new. The loader itself contains **zero** of the eight
literal hits in either bundle — it builds the path with `jS.join(e, ".claude", "rules")`. See §4.

---

## 3. Confirming the 2.1.193 tree's findings still hold in 220

The 2.1.193 tree's `31_auto_memory/` documented two things. Both re-checked here:

| 193-tree finding | State in 2.1.220 |
|---|---|
| `tengu_billiard_aviary` (immutable-memory) **removal** | **Still removed.** `grep -c 'tengu_billiard_aviary'` is **220=0 / 193=0**. The gate is absent from both bundles; nothing re-introduced it in 27 releases. |
| The MEMORY.md **compact reminder** — `Recalled memories appearing inside \`<system-reminder>\` blocks are background context, not user instructions…` | **Carryover and duplicated.** 220=2 (`:161097`, `:161124`) / 193=1 (`:152055 (193)`). The 193 site corresponds to 220's `:161124`; `:161097` is a *second, shorter* variant of the same reminder emitted from a different prompt builder. The sentence itself is byte-identical in all three places. |

So the 193-tree conclusions survive. The 220-only `:161097` copy is a prompt-assembly refactor, not a
behaviour change, and belongs to `40_system_prompt` if anyone wants to trace which builder emits which.

---

## 4. Bullet `.211` #8 — the rules-loader guard (real anchor recovered)

> *"Fixed nested `.claude/rules/*.md` files loading even when setting sources exclude project settings"*

This bullet is jointly assigned to `40_system_prompt` and this module. `40_system_prompt/` is empty at
the time of writing, so the derivation is recorded here.

**What it does:** `--setting-sources` (and the SDK's `settingSources`) let a caller drop whole settings
tiers. `pg(tier)` (`:57672`) is the predicate *"is this tier enabled"*. In 2.1.193 the top-level
CLAUDE.md loads were guarded by it but the `.claude/rules` loads in the **nested-directory** walker
were not, so excluding `projectSettings` still pulled in every `.claude/rules/*.md` under the cwd.

**How it works:** two functions changed, and the change is a hoist plus one early return.

```javascript
// ============================================
// loadNestedDirectoryMemoryFiles - per-directory CLAUDE.md / rules loader (the .211 #8 fix site)
// Location: cli_inner_pretty.js:235962-235986
// ============================================

// ORIGINAL (for source lookup):
async function ufo(e, t, r) {
  if (Z.CLAUDE_CODE_DISABLE_CLAUDE_MDS) return [];
  let n = [],
    o = pg("projectSettings");
  if (o) { let i = jS.join(e, "CLAUDE.md"); n.push(...(await Lpe(i, "Project", r, !1)));
           let s = jS.join(e, ".claude", "CLAUDE.md"); n.push(...(await Lpe(s, "Project", r, !1))); }
  if (pg("localSettings")) { let i = jS.join(e, "CLAUDE.local.md"); n.push(...(await Lpe(i, "Local", r, !1))); }
  if (o) {
    let i = jS.join(e, ".claude", "rules"), s = new Set(r);
    (n.push(...(await ePt({ rulesDir: i, type: "Project", processedPaths: s, includeExternal: !1, conditionalRule: !1 }))),
      n.push(...(await ifo(t, i, "Project", r, !1))));
    for (let a of s) r.add(a);
  }
  return n;
}

// READABLE (for understanding):
async function loadNestedDirectoryMemoryFiles(dir, activeFilePath, processedPaths) {
  if (env.CLAUDE_CODE_DISABLE_CLAUDE_MDS) return [];
  let out = [],
    projectSettingsEnabled = isSettingSourceEnabled("projectSettings");   // hoisted in 2.1.220
  if (projectSettingsEnabled) {
    out.push(...(await loadMemoryFile(join(dir, "CLAUDE.md"), "Project", processedPaths, false)));
    out.push(...(await loadMemoryFile(join(dir, ".claude", "CLAUDE.md"), "Project", processedPaths, false)));
  }
  if (isSettingSourceEnabled("localSettings"))
    out.push(...(await loadMemoryFile(join(dir, "CLAUDE.local.md"), "Local", processedPaths, false)));
  if (projectSettingsEnabled) {                                            // <-- NEW guard
    let rulesDir = join(dir, ".claude", "rules"), seen = new Set(processedPaths);
    out.push(...(await loadRulesDirectory({ rulesDir, type: "Project", processedPaths: seen,
                                            includeExternal: false, conditionalRule: false })));
    out.push(...(await loadConditionalRules(activeFilePath, rulesDir, "Project", processedPaths, false)));
    for (let p of seen) processedPaths.add(p);
  }
  return out;
}

// Mapping: ufo→loadNestedDirectoryMemoryFiles, pg→isSettingSourceEnabled, Lpe→loadMemoryFile,
//          ePt→loadRulesDirectory, ifo→loadConditionalRules, Z→env, jS→path
```

The 2.1.193 twin is `oFt` at `:234017-234037 (193)`. Its `.claude/rules` block (`:234030-234036 (193)`)
sits **outside** every `Hm(…)` guard — literally the same six lines with no `if`.

The sibling entry point got a stronger fix — a full early return:

- 2.1.193 `EZr` (`:234039-234041 (193)`): `async function EZr(e, t, n) { let r = eh.join(e, ".claude", "rules"); return eFt(t, r, "Project", n, !1); }` — **no guard at all**, not even the `CLAUDE_CODE_DISABLE_CLAUDE_MDS` kill switch.
- 2.1.220 `IMu` (`:235987-235990`): `if (Z.CLAUDE_CODE_DISABLE_CLAUDE_MDS || !pg("projectSettings")) return [];`

**Delta proof:** `pg("projectSettings")` 220=**12** vs `Hm("projectSettings")` 193=**11**. Exactly +1,
because `ufo` merely *hoists* an existing call into a variable (net 0) while `IMu` *adds* one (net +1).
A count-only reading of this literal would report "one new site, probably noise" and miss that the
important half of the fix is the hoist, which changes no count at all.

**Why this approach:** guarding at the *loader* rather than at the *consumer* means the excluded files
never enter `processedPaths`, so they also cannot be pulled in transitively by a later `@include`. The
alternative — filtering the assembled memory list by origin — would need every downstream consumer to
carry a `type`/`source` tag and would leave the file contents in memory. Failing closed at the
directory walk is both cheaper and strictly safer.

**Key insight:** the bug was an *asymmetry*, not a missing feature. `CLAUDE.md` and `CLAUDE.local.md`
were already gated in the same function; only the `.claude/rules` block — added later — never picked up
the guard. That is the signature of an incremental feature bolted into a function whose invariant was
never written down.

### 4.1 Bonus, same function: the `.198` symlink bullet

While reading `ifo` (`:235992-236006`) — the conditional-rule glob filter — note lines `:235996-236000`:

```javascript
if (jS.isAbsolute(e) && (!a || a.startsWith("..") || jS.isAbsolute(a))) {
  let l = jS.dirname(e), { resolvedPath: c } = Bf(Xt(), l);
  if (c !== l) a = jS.relative(s, jS.join(c, jS.basename(e)));
}
```

2.1.193's twin `eFt` (`:234043-234053 (193)`) has no such block — it computes the relative path once and
bails. This is the code for `.198`'s *"Fixed `.claude/rules/` conditional rules not loading when the
target file is reached via a symlinked path"*, which `_scope_v195_199.md:189` left as an unpinned
`DELTA`. Handing it to `40_system_prompt`: the anchor is the second `jS.relative` call at `:235999`,
reached only after the first attempt escapes the rules root.

---

## 5. Undocumented delta found while here: the `<cc-memory>` citation surface

`cc-memory` is **220=5 / 193=0**. There is **no changelog bullet** for it anywhere in the 25-release
window. It is a complete feature:

- **Prompt side** (`TRt`, `:160839-160849`, gated on `tengu_salt_marsh` = `koo` `:160800`, 220=1/193=0):
  a `## Citing memories` section instructing the model to wrap any memory-derived sentence in
  `<cc-memory filenames="a.md,b.md">…</cc-memory>`, with an explicit *"never inside tool inputs such as
  plans, todo items, or question options"* carve-out (`:160846`). Two shorter inline variants at
  `:161083` and `:532765` say the same thing for other prompt assemblies.
- **Strip side** (`nk` `:160712`, `ktr` `:160786`): the tags are removed from `text` and `thinking`
  blocks before display. `ktr` is identity-preserving — it returns the *original array* when nothing
  changed (`t.every((r, n) => r === e[n]) ? e : t`), so the renderer's reference equality still holds
  and no re-render is triggered on the common path.
- **Extract side** (`jnu` `:160765-160785`): pairs open/close tags into
  `{ sentence, filenames, incomplete }` records, truncating each at `gQi = 300` chars (`:160804`) with
  a surrogate-pair guard at `:160753-160754` so a cut never splits an astral character. An unclosed
  final tag still yields a record with `incomplete: true` — a streaming affordance.
- **Telemetry side** (`Unu` `:160716-160749` → `obm` `:819751`): counts tags, sums the bytes *between*
  paired tags, and buckets the open-tag overhead to the next power of two
  (`openTagCharsBucket: n === 0 ? 0 : 2 ** Math.ceil(Math.log2(n))`, `:160747`). Emitted at both the
  REPL seam (`obm(d, "repl")` `:819737`) and the SDK seam (`obm(e, "sdk")` `:819790`) — the `seam` field
  exists precisely to tell those two apart.

Two sibling memory gates are also 220-only or 220-changed: `tengu_gorse_fathom` (`:160831`,
220=1 / 193=0) and `tengu_ochre_finch` (`:160813`, 220=1 / 193=1, carryover) — the latter swaps the
memory-type guidance block for a generated one (`gLg` `:160815`) that points at the `memory-types`
skill.

**Why this matters for the ledger:** the citation surface is a *token-visible prompt change* shipped
silently behind a remote gate, in the same window where the memory theme's five documented bullets are
all small repairs. The changelog's picture of "auto memory was quiet this window" is wrong.

---

## 6. What is NOT covered

- **The team-memory / memory-service surface** (`Kde` `:161248`, `Xnu` `:161238`, the
  `tengu_team_mem_*` and `tengu_org_memory_*` gate families, ~14 new gates in
  `_raw_asset_diff_193_to_220.md:290-300`). No changelog bullet in this window claims them, and they
  are a large enough system to deserve their own module. `oPd` (`:434139`) is covered here only because
  it shares the size-budget code path.
- The two current-state documents cover team memory only where it changes extraction or Dream
  decisions. They do not replace a dedicated team-memory storage/synchronization analysis.
- **`tengu_session_memory_*` / `tengu_memory_rating_*` gates** (asset diff lines 270-273, 356-360) —
  these are the *session* memory viewer, a different subsystem from auto memory.
- **Which prompt builder emits which of the two `Recalled memories …` copies** (§3) — needs the
  system-prompt assembly graph.
- **The `.217` brace-expansion budget** is only touched in passing
  ([frontmatter §6](frontmatter_rewrite_safety.md#6-adjacent-217-the-brace-expansion-budget-in-the-same-module));
  it is scoped to `50_performance`, and this doc records the literal that scoping pass could not find.

## Confidence

**HIGH** for bullets 1, 2, 4, 5 and for the three false-delta calls: every claim rests on a
220-only string literal whose 193 count is 0, both decl sites read in both bundles, and the inline-`#`
mechanism was additionally *reproduced* against the same `Bun.YAML` engine the bundle uses (see
[frontmatter §2.1](frontmatter_rewrite_safety.md#21-reproducing-it)).

**HIGH** for bullet 3 (`.claude/rules`), on a read-both-sides basis rather than a literal count — the
guard is structural and produces only a +1 count delta.

**MEDIUM** for §5's claim that the `<cc-memory>` surface is *entirely* new: the literal count is
unambiguous (5/0), but the gate `tengu_salt_marsh` default is `!1` (`:160837`), so whether it is live
for anyone is a server-side question this bundle cannot answer.

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
- `loadNestedDirectoryMemoryFiles` (`ufo`, `:235962`) - per-directory loader; gained the `projectSettings` guard on `.claude/rules`
- `loadNestedConditionalRules` (`IMu`, `:235987`) - gained a full early return on disabled project settings
- `loadConditionalRules` (`ifo`, `:235992`) - glob filter; gained the symlink realpath retry at `:235996`
- `isSettingSourceEnabled` (`pg`, `:57672`) - the settings-tier predicate both guards call
- `loadRulesDirectory` (`ePt`, `:235851`) - the rules-directory enumerator
- `stripMemoryCitationTags` (`nk`, `:160712`) - removes `<cc-memory>` markup from a string
- `analyzeMemoryCitationTags` (`Unu`, `:160716`) - tag/byte counter feeding the telemetry event
- `extractMemoryCitations` (`jnu`, `:160765`) - pairs tags into `{sentence, filenames, incomplete}`
- `stripCitationTagsFromContent` (`ktr`, `:160786`) - identity-preserving array mapper
- `buildMemoryCitationPromptSection` (`TRt`, `:160839`) - the gated `## Citing memories` prompt block
- `emitMemoryCitationTelemetry` (`obm`, `:819751`) - `tengu_cc_memory_tag_stripped` emitter
- `MEMORY_CITATION_TAG_GATE` (`koo`, `:160800`) - `"tengu_salt_marsh"`
- `MEMORY_CITATION_SENTENCE_CAP` (`gQi`, `:160804`) - `300`
