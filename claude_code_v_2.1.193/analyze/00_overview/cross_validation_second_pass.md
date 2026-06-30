# Cross-Validation — SECOND PASS (independent re-derivation) — v2.1.193

A consolidated **second, trust-nothing** cross-validation of the v2.1.183 → v2.1.193 focused-delta tree. Nine
independent default-to-FAIL validators re-opened the live bundles, re-derived every claim from scratch, and
re-hunted false-deltas tree-wide — then this consolidation re-ran the tree-wide invariants directly.

> **What this 2nd pass is.** The **first** pass verified the twelve per-theme *module trees* (Tools, Compaction,
> Agent Team, Auto Memory, Background Agents, Permissions, MCP, System Prompt, Workflow, Slash Commands,
> Telemetry, Skills). It never independently audited the **aggregator surfaces** that sit *above* those module
> docs — the `00_overview/` digests (`changelog_analysis.md`, `changelog_to_code_map.md`, `file_index.md`, the four
> `symbol_index_*.md`, the README) and the `by_version/` per-sub-version digests. Those surfaces re-state and
> re-cite the same deltas in their own words, so an error there (a misattributed anchor, a carryover dressed as
> net-new, a stale readable name) would never have been caught by the first pass. **This second pass targets
> exactly those un-validated overview + by_version + cross-doc surfaces, plus a from-scratch tree-wide
> false-delta re-hunt.** It assumes nothing the first pass concluded; every anchor is physically re-read and every
> headline count is re-grepped in all three bundles.

## Bundles under analysis

- **TARGET (193):** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` — **718,679
  lines**, build `a1938d2a`. Every `cli_inner_pretty.js:<line>` citation resolves here unless tagged `(183)`/`(156)`.
- **Before-picture (183):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` —
  **699,346 lines**, build `9d251abd`. Line-shifted ~19k vs 193 — a citation cannot be confirmed by recall.
- **Second baseline (156):** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` —
  **649,979 lines**. The independent second zero-count for every NET-NEW / REMOVED claim.

## Discipline (what makes this independent)

1. **Physical re-read, never memory.** Every sampled anchor was re-opened (`sed -n`) at its exact cited line in
   the correct bundle. The ~19k/~69k line shifts between bundles make recall impossible — a confirmation *is* a
   re-read.
2. **Dual-zero-count grep for every delta.** A genuine 193 delta must be `0 in 183 AND 0 in 156` for a stable,
   non-renamed token. Every headline claim was re-grepped in all three bundles from scratch — this is the only step
   that exposes a "carryover dressed as net-new."
3. **`grep -c` line-count convention reconciled.** Module docs report `grep -c` (matching-line) counts; raw
   occurrence counts (`grep -oF`) diverge on multi-hit lines. Every divergence (e.g. `effortValue` 55 lines / 61
   occurrences, `rewound` 12 lines / 15 occurrences, `killedBy` 8/9) was reconciled to the doc's stated `grep -c`
   number; none was a defect.
4. **Default to FAIL.** Each validator started from "this surface is wrong" and had to be argued out of it with
   bundle evidence. PASS was earned, not assumed.

---

## 1. Roll-up — nine independent surfaces

| Surface | Anchors re-read | grep diffs (193/183/156) | NEW false-deltas | Defects fixed | Verdict | Confidence |
|---|---:|---:|---:|---:|---|---|
| Tree-wide false-delta re-hunt | 11 | 96 | 0 | 0 | PASS | HIGH |
| `changelog_analysis.md` | 95 | 46 | 0 | 0 | PASS | HIGH |
| `changelog_to_code_map.md` + `file_index.md` | 105 | 36 | 2 | 3 | PASS WITH FIXES | HIGH |
| `symbol_index_*.md` ×4 | 96 | 30 | 0 | 1 | PASS WITH FIXES | HIGH |
| `by_version/2.1.186.md` | 75 | 28 | 0 | 1 | PASS WITH FIXES | HIGH |
| `by_version/2.1.187.md` + `2.1.191.md` | 85 | 22 | 0 | 1 | PASS WITH FIXES | HIGH |
| `by_version/2.1.193/.185/.190.md` + xval report | 86 | 22 | 1 | 2 | PASS WITH FIXES | HIGH |
| Cross-doc consistency (symbol↔file↔module) | 28 | 5 | 0 | 1 | PASS WITH FIXES | HIGH |
| Navigation + summary (READMEs + summary) | 78 | 7 | 0 | 4 | PASS WITH FIXES | HIGH |
| **Total** | **659** | **292** | **3** | **13** | **9 / 9 PASS** | **HIGH** |

**Headline: 9 / 9 PASS, HIGH confidence. 659 aggregator-surface anchors physically re-read; 292 grep-count diffs
re-run across all three bundles; 13 defects fixed in place; 3 NEW false-deltas caught (beyond the 2 already known);
0 FAIL.** None of the 659 anchors resolved to a wrong symbol or a fabricated line — every defect is a precision,
attribution, count, or NET-NEW-vs-CARRYOVER classification correction.

> These 659 anchors and 292 grep diffs are **disjoint from** the first pass's 625 module-doc anchors: this pass
> re-derived the overview + by_version layer that the first pass never independently opened.

---

## 2. False-delta re-hunt result

The single most important step. Every NET-NEW / CARRYOVER / REMOVED / REFACTOR claim across the whole tree was
re-grepped with `grep -c` in **193, 183, and 156** for a stable token, from scratch — not trusting any prior pass.

### 2.1 The two known false-deltas — both HELD (stayed corrected everywhere)

Independently re-grepped against the live bundles by this consolidation:

| Token | 193 | 183 | 156 | Classification |
|---|---:|---:|---:|---|
| `mcp_headers_helper` | 7 | 6 | 6 | **CARRYOVER** (pre-existing `tengu_feature_sad` feature_name; *not* net-new) |
| `reauth_retry` | 1 | 0 | 0 | the *actual* 193 MCP delta (the error_code value) |
| `user_kill_async` | 1 | 1 | 1 | **CARRYOVER** (pre-existing termination reason; *not* net-new) |
| `parent_kill_async` | 1 | 0 | 0 | the *actual* 193 stop-attribution arm |
| `system_kill_async` | 1 | 0 | 0 | the *actual* 193 stop-attribution arm |

Both corrections held **consistently across every aggregator doc** that re-states them — `changelog_analysis.md`,
`changelog_to_code_map.md`, `by_version/2.1.193.md`, both READMEs, the `symbol_index_*.md` files, and the module
docs. No doc reverted to the old `1|0` framing. This is the trap the dual-bundle step exists to catch: a per-file
read accepts the `1|0` row; only `grep -c` in 183 **and** 156 exposes the pre-existing uses.

### 2.2 Three NEW false-deltas caught this pass (beyond the two known)

The from-scratch re-hunt found three additional framing errors the first pass had not flagged — each a
carryover/genuine-delta misclassification on an aggregator surface (all now fixed, see §3):

1. **`file_index.md` — a carryover UI hint dressed as the headline background delta.** Row `UG@193813` cited
   `"send a prompt to start"` (an input-box hint, grep `183=1 / 193=1` — **carryover**) but labeled it
   `BG_TURN_END_NEEDS_USER` "(no longer 'end your response')". The real "keeps working / no longer end your
   response" delta lives at `431253-431264` (`async_launched` tool-result, `"end your response"` **4→2** vs 183).
2. **`changelog_to_code_map.md` — a genuine delta wrongly bucketed as carryover.** The "retired-tool framing"
   notice (RETIRED_TOOL_NAMES + skip; `SuggestBackgroundPR` grep `183=0 / 193=1` — **genuinely net-new**) was
   counted *inside* the "carryover / false-delta" summary, inflating that count to **eight** when the doc's own
   Coverage notes enumerate **seven**.
3. **`by_version/2.1.193.md` §15 — a carryover cache-clear folded into a delta.** The `oauth_logout` "2→5 logout
   widening" was presented as a 3-field delta. The 183 logout already clears `additionalModelCostsCache`
   (`:340789`, grep `183=4` — carryover); the doc cited the two *outer* lines of a contiguous 3-line block and
   skipped `:340789`. Only **two** fields (`modelAccessCache`, `clientDataCacheSlots`) are genuinely net-new.

### 2.3 Headline deltas — actual 193 / 183 / 156 counts (re-verified)

Every NET-NEW headline string flips `0 → present` from 183, and is also 0 in 156 (a genuine window delta). Removals
and refactors verified in the reverse direction:

| Token | 193 | 183 | 156 | Kind |
|---|---:|---:|---:|---|
| `classifyAllShell` | 2 | 0 | 0 | NET-NEW (permissions trust-collapse) |
| `tengu_billiard_aviary` | 0 | 1 | 1 | REMOVED |
| `tiny_memory` | 0 | 4 | 4 | REMOVED |
| `wasCompacted` | 0 | 10 | 10 | REFACTOR (flat → discriminated union; removed) |
| `rapid_refill_breaker_tripped` | 2 | 0 | 0 | REFACTOR (added in the new union) |

Plus the **+1 enforcement-site** family verified exactly (each gains one new throw/grant site in 193):
`"Permission granted for"` **2 / 1**, `"has been denied by permission rule"` **3 / 2**, `subagent_type_denied`
**3 / 2**. And a long roster of NET-NEW tokens confirmed `0` in **both** 183 and 156: `denyReadPaths`,
`unsetEnvVars`, `addSessionAllowedHost`, `assistant_response`, `OTEL_LOG_ASSISTANT_RESPONSES`,
`task_local_shell_pressure_reap`, `memoryPressure`, `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP`,
`tengu_mcp_login`/`logout`, `ENDPOINT_NOT_FOUND`, `"No MCP server named"`, `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`,
`requiresStructuredOutput` (=8), `respondToBashCommands`, `scope: "skills"`, `tengu_plugin_renamed`,
`tengu_rewind_first_message`, `denied_by_entitlement`, `skill_load_yaml_failed`, `toolDenialKind`, `bash-path`,
`subagent_depth_cap`, `SuggestBackgroundPR`, `clientDataCacheSlots`, `modelAccessCache`, `tengu_client_data_cache_key`.

### 2.4 The one item that *looked* like a false-delta but is genuine

The agent-team `"iterm2"` teammate enum is the only token that superficially resembled a false-delta — the bare
token `iterm2` appears **41×** in 183. Re-reading the actual schema arrays settles it: 183 `:53728`
(`["auto","tmux","in-process"]` — **no** iterm2) vs 193 `:54136` (`["auto","tmux","iterm2","in-process"]`); the
exec-mode *choices array* grep is **3 / 0** — genuinely net-new. The 41 bare-token hits in 183 are unrelated
substring matches, not the enum.

**Net result of the re-hunt: the 2 known false-deltas held; 3 NEW ones were caught and fixed; every headline delta
direction is corroborated by a dual-zero-count grep. The first pass held up on the module-doc layer; the framing
errors all lived on the aggregator surfaces it never independently checked.**

---

## 3. Defects fixed this pass (13 across 9 surfaces)

Surfaces **1 (false-delta re-hunt)** and **2 (`changelog_analysis.md`)** needed **zero** fixes — both held up
under fully independent re-derivation.

### `changelog_to_code_map.md` + `file_index.md` (3)

- **`file_index.md:183`** — `UG@193813` read `"send a prompt to start"` (a carryover input-box hint, grep
  `183=1 / 193=1`) but was labeled `BG_TURN_END_NEEDS_USER` "(no longer 'end your response')". The real delta is at
  `431253-431264` (`async_launched` tool-result; `"end your response"` 4→2 vs 183). **Fix:** re-anchored the row to
  `cli_inner_pretty.js:431253-431264` and corrected the description to match `changelog_to_code_map:78`.
- **`changelog_to_code_map.md:58`** — claimed "**eight** are explicitly mapped as carryover / false-delta" and
  listed "retired-tool framing." That notice is a **genuine** 193 delta (`SuggestBackgroundPR` grep `183=0 / 193=1`)
  and is **not** in the Coverage-notes enumeration (which lists **seven**). **Fix:** "eight"→"seven" and removed the
  retired-tool item so the count and list reconcile.
- **`changelog_to_code_map.md:74`** — the backgrounding row tagged `:689578` as `("would be abandoned" 0→present in
  183)`, which misleadingly reads as carryover. Grep is `183=0 / 193=2` (net-new wording). **Fix:** reworded to
  `("would be abandoned" wording is net-new: 0 in 183 → 2 in 193)`.

### `symbol_index_*.md` ×4 (1)

- **`symbol_index_core_execution.md` — named-spawn enforcement row `E9e`.** Cited `cli_inner_pretty.js:430518`
  with `type=class`, but `:430518` is `if (Se)` — a **usage** site, not the declaration. The real decl is `:430345`
  (`E9e = class E9e extends Error`, runtime `name="AgentTypeError"`). **Fix:** re-cited `:430345` and annotated the
  throw sites `:430513/430521/430530` plus the runtime name.

### `by_version/2.1.186.md` (1)

- **Item 6 (`Agent(type)` enforcement) — before-picture overstatement.** Doc claimed 183's spawn body
  `@cli_inner_pretty.js:423565` "had no upfront check." 183 `@423567` already throws the **resolved**-type deny
  (`if (x && k) throw … "has been denied by permission rule"`). The real 193 net-new is only the **requested**-type
  (`t`) deny + `allowedAgentTypes` not-found enforcement. **Fix:** reworded with grep evidence
  (`"has been denied by permission rule"` 2→3, `subagent_type_not_found` 1→2, `"Available agents:"` 4→6).

### `by_version/2.1.187.md` + `2.1.191.md` (1)

- **`2.1.187.md` §17b — 8-line citation drift.** Parenthetical cited `:155920` for the `TERM_PROGRAM_VERSION
  1123000–1125000` range-check literal, but that literal is at `:155912` (`:155920` is the version-parse regex
  inside `OTd` at `:155918`). **Fix:** re-cited `:155912` and noted `OTd` `:155918`.

### `by_version/2.1.193.md` + `2.1.185.md` + `2.1.190.md` + xval report (2)

- **`2.1.193.md` §15 (oauth_logout)** — claimed 183 "cleared only **two**" cache fields. It clears **three** of the
  five tracked (`additionalModelOptionsCache` `:340788`, `additionalModelCostsCache` `:340789` — grep `183=4`,
  carryover — `clientDataCache` `:340790`); the doc cited the two outer lines and skipped `:340789`. The true 193
  delta is the **two added** clears `modelAccessCache` (`:350427`) and `clientDataCacheSlots` (`:350429`), both
  `0-in-183`. **Fix:** prose → "three of these five"; table → "3 of 5 → all 5, +2 net-new."
- **`2.1.193.md` §2 (auto-mode denial toast)** — toast-reason render cited `:640271`, an **11-line** drift;
  `:640271` only *prepares* the reason text (truncate-to-80), the actual JSX render `k ? OOe.jsxs(...) : null` is at
  `:640282`. The 183 before-picture was imprecise (183 has no reason middle line; `k=""` at `:627452`, never
  rendered). **Fix:** cite both `:640271` (prepare) and `:640282` (render); corrected the 183 description.
- *(The validator also added a transparent second-pass addendum recording this correction to
  `by_version/cross_validation_report.md:271`.)*

### Cross-doc consistency (1)

- **`file_index.md:160` — readable-name drift.** `NFe` was labeled `isModelRestricted`, while all 13 other
  published refs (`symbol_index_infra_platform`, `symbol_additions_permissions`, `org_model_restrictions.md` ×8,
  `38_permissions/README`) use the canonical `isModelRestrictedByEntitlements`; bundle `:102814` =
  `function NFe(e, t)`. **Fix:** → `isModelRestrictedByEntitlements`.

### Navigation + summary (4)

- **`00_overview/README.md:26`** — `VERSION` anchor cited `:162214` (`if (mAt === null) {`, unrelated).
  `VERSION:"2.1.193"` lives in the build-metadata object at `:211`. **Fix:** `162214 → 211`.
- **`00_overview/README.md:37`** — asset count: `tools_index.json (51 tools)`. The literal top-level
  `tools_index.json` is a legacy flat index (1 entry); the authoritative `assets/tools/_index.json` lists **50**
  tools (51 is the `.md` file count). **Fix:** → `tools/_index.json (50 tools)`.
- **`00_overview/README.md:115`** — background_agents row originally said "6 anchor defects fixed" while the report's
  then-current C4 enumerated **5** distinct defects. **Fix at the time:** `6 → 5`. A later focused panel-render audit
  added a real sixth background-agents defect, so the current authoritative roll-up is 42 defects.
- **`README.md:43`** (tree front-door) — false arithmetic: `(23,434 files = 11,547 var-decl + 11,892
  var-decl-empty)`. The `vars/` dir has 23,434 `.js` files but the manifest lists `11,547 + 11,892 = 23,439`
  entries (5 more). **Fix:** reworded to "(23,434 files; 11,547 var-decl + 11,892 var-decl-empty **entries** in
  `_manifest.json`)" to remove the false `=`.

**Confirmation:** every one of the 13 fixes is a precision / attribution / count / classification correction. In
every case the obfuscated token exists, the declaration/string is what the doc says, and the underlying delta holds.
**Zero fabricated symbols, zero wrong tokens, zero wrong-direction deltas** on the aggregator surfaces.

---

## 4. What the first pass missed / what held up (honest)

**Held up (independently re-derived, zero changes):**

- **The whole tree-wide false-delta re-hunt** (surface 1): 11 anchors re-read, 96 grep diffs re-run — **0 new
  false-deltas** at that level and **0 defects**. Every NET-NEW claim is `0` in both 183 and 156; every removal,
  refactor, carryover, and +1-enforcement-site count reconciles exactly.
- **`changelog_analysis.md`** (surface 2): 95 anchors re-`sed`'d, 46 grep diffs — **0 defects**. Window-shape
  counts (185=1 / 186=33 / 187=21 / 190=1 / 191=20 / 193=15 = 91), all decl/string anchors (≤1–2 line drift, within
  tolerance), and every NET-NEW/CARRYOVER/removal direction held.
- Both **known false-deltas** stayed corrected on **every** surface that re-states them.

**Missed by the first pass (caught only because this pass independently re-derived the aggregator layer):**

- The first pass **never independently opened the overview + by_version surfaces** — it trusted that the digests
  faithfully re-stated the module-doc findings. They mostly did, but **3 framing errors slipped through there**
  (§2.2): a carryover UI hint in `file_index` dressed as the headline background delta; a genuine retired-tool delta
  mis-bucketed as carryover in `changelog_to_code_map`; and a carryover cache-clear folded into the oauth_logout
  delta in `2.1.193.md`. All three are exactly the "carryover ⇄ net-new" trap, and all three lived *above* the
  module docs the first pass checked.
- The first pass's **by_version before-picture sampling was too thin**: it never opened the 183 `oauth_logout`
  block (missing the `:340789` carryover clear) and accepted the `2.1.186` "183 had no upfront check" overstatement
  without reading 183 `:423567` (which already had the resolved-type throw). Independent before-picture re-reads
  caught both.
- A handful of **aggregator citation drifts the first pass didn't surface** because it audited module docs, not the
  digests: the `E9e` usage-vs-decl line, the `:155920→155912` 8-line drift, the `:640271→640282` 11-line toast
  drift, and the `README:26` `VERSION` anchor landing on an unrelated line.
- **Cross-doc naming drift** (`NFe` `isModelRestricted` vs the canonical `isModelRestrictedByEntitlements` used in
  13 other places) — invisible to a single-module pass, visible only on a cross-doc consistency sweep.

The honest summary: **the first pass's module-doc verification was sound and its two false-delta corrections were
right; the gap was that it never adversarially re-derived the layer of digests that summarize those modules.** This
pass closes that gap.

---

## 5. Final verdict, confidence, residuals

**Verdict: PASS — HIGH confidence (9 / 9 surfaces PASS).** The overview + by_version + cross-doc aggregator layer
is substantively correct; after the 13 in-place fixes, every re-stated delta resolves to its cited 193 line and
every NET-NEW claim is proven absent in both 183 and 156. The 3 NEW false-deltas were the only framing errors and
are all reclassified with grep evidence.

**Residuals (carried forward, not errors):**

1. **Sub-version pinning is not bundle-verifiable.** Only the 193/183/156 bundles exist, so the evidence confirms
   "new in the 183→193 window," not the exact intermediate sub-version (.185/.186/.187/.190/.191/.193). Taken from
   changelog scoping.
2. **`grep -c` vs occurrence convention.** A few in-scope by_version focus items (`2.1.191` §1/§4: `rewound` 1→12
   lines vs 15 raw occurrences; `stoppedByUser` 0→9 lines vs 12 raw) label line-counts as "occurrences." Numbers are
   reproducible and the net-new/carryover classification is correct; left as the doc's `grep -c` convention.
3. **Scout-dossier scratch files carry stale lines** (`_pp@292228`, `Mil@429446`) that the **published** docs
   already override with explicit "Drift fixed vs the scout dossier" notes pointing at the verified lines — a
   scratch-file artifact, not a published-tree inconsistency.
4. **Minor sub-tolerance drift left as-is** (within the ≤5 tolerance): `2.1.190.md` says "versions dir contains only
   156/183/193 (for this delta)" though 132/142 also exist as unrelated older builds (defensible under the
   qualifier). The earlier `VERSION:'2.1.193'` line-role ambiguity is now resolved in the published docs as metadata
   blocks at `:162`, `:196`, and `:211-214`. The earlier `_ne` and `Yjd` line-role ambiguities are also resolved:
   `_ne` is documented as decl `:283549` plus object assignment `:283584-283585`; `Yjd` is documented as decl
   `:211675` plus merge `:211677`.
5. **Runtime-vs-role names annotated, not renamed** (e.g. `Vht` readable "AgentStoppedError" abbreviates runtime
   "AgentStoppedByUserError"; MCP `lWe`/`Vj`), consistent with the tree convention.

---

## 6. Final tree-wide invariant re-sweep (run directly by this consolidation)

After writing the report, this consolidation re-ran the three tree-wide invariants over the live tree and recorded
the real numbers.

### (a) Forbidden obf→readable mapping tables in module docs — **0**

A scan of the **47 numbered-module** docs (`NN_module/*.md`, excluding `00_overview/`) for the
`| Obfuscated | Readable` table header, both the exact form (`grep -E '^\| *Obfuscated *\| *Readable'`) and the
broad "any header cell containing both words" form, returned **0 hits**. Mapping tables live only where they are
allowed — the twelve `00_overview/symbol_additions_v2_1_193_*.md` and the four `00_overview/symbol_index_*.md`.
`## Related Symbols` is present in **47 / 47** module docs (`grep -c` = 1 each).

### (b) Relative `.md` link resolution — **0 genuine broken**

A full sweep over all **102** `.md` files (code-fence and inline-code spans stripped to avoid false positives)
extracted **1,037** markdown links: **1,033** relative path links, **0** external, **4** anchor-only. Resolution:
**1 unresolved candidate**, which is the **documented false positive** — `[Title](file.md)` inside a verbatim
backtick-quoted blockquote of the dream-consolidation source prompt at
`31_auto_memory/memory_reminder_and_dream_carryover.md:88` ("…each entry should be one line … `- [Title](file.md) —
one-line hook`"). It is an illustrative markdown example embedded in quoted source text, **not** a navigational
link, and is correctly left untouched. **Genuine broken links tree-wide: 0.** (The 2 stale
`nested_subagent_depth_limit.md` links the first-pass summary repointed to `subagent_depth_tracking.md` resolve
cleanly here, and the `cross_validation_summary.md` self-reference now resolves alongside this file.)

### (c) English-only — **PASS**

A `grep -P` for CJK / Hiragana / Katakana / Hangul / Cyrillic across every `.md` in the tree returned **0 files**.
The only non-ASCII glyphs are typographic / box-drawing (`·` `…` `—` `←` `→` `≤`) and verbatim-quoted source-string
glyphs.

### Fix applied during this sweep

One additional in-place consistency fix, beyond the 13 surface defects, originally reconciled the background-agents
report's defect count with its C4 section. A later focused panel-render audit superseded that count: the report now
has a sixth fixed defect for replacing a stale panel schema pointer with verified render anchors, and the
authoritative tree-wide total is **42**. No other invariant required a fix.

**Final sweep result: (a) 0 forbidden tables / 47-of-47 `## Related Symbols`; (b) 1,033 relative links, 0 genuine
broken (1 documented `file.md` quoted-example false positive); (c) English-only PASS. The tree is internally
consistent.**
