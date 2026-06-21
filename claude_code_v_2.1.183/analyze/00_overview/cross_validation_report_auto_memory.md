# Cross-Validation Report — Auto Memory (memdir / team stores) delta — v2.1.156 → v2.1.183

**Scope:** adversarial validation of every doc written under
`claude_code_v_2.1.183/analyze/31_auto_memory/`:
- `README.md` (732 lines)
- `team_memory_stores_recall.md` (867 lines)
- `status_line_and_misc_delta.md` (462 lines)

**Method:** default-to-FAIL skeptic. Every sampled `cli_inner_pretty.js:<line>` anchor was opened at that
exact line in the bundle and the declaration confirmed verbatim. Before-picture citations were opened in the
v2.1.156 bundle. All three docs were format-audited (mapping tables, Related Symbols, snippet template,
relative-link depth, English-only). The dossier's framing traps / open questions were re-checked for
over-claiming.

**Source bundles (read directly during this validation):**
- TARGET (v2.1.183): `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- BEFORE (v2.1.156): `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- Dossier (spec): `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/_scout_dossier_auto_memory.md`
- Per-feature symbol additions (canonical names): `symbol_additions_v2_1_183_auto_memory.md`

**Verdict: PASS WITH FIXES.** Every load-bearing v2.1.183 declaration the docs claim was confirmed at the
cited line — the five real deltas (schema expansion, `promptIndex` fetch+inject, scope/mode recall routing,
`Nk` remote-fix, watcher scope-split) and the 2.1.181 status-line render change are all verified, with the
dual-version snippets copied accurately from the bundle and the v2.1.156 before-pictures correct. The issues
found are (a) **tree-wide broken `symbol_index_*.md` links** (those files do not exist in the 183 tree —
affects every module doc in the tree, not just auto_memory), (b) **two cross-doc readable-name
inconsistencies** for `Agi`/`mgi`/`Rt` that violate the single-source-of-truth rule, and (c) **a small set of
off-by-one / wrong-line carryover anchors** (`PQa`, the v2.1.156 verbose-flag line) inherited from the
dossier. None of these undermine the analysis conclusions; all are mechanical fixes.

---

## C1 — Citation spot-check (v2.1.183 TARGET bundle)

35 anchors opened at the exact cited line. PASS = declaration at that line matches the doc's claim.

| # | Anchor (doc claim) | Cited line | Verified declaration @ line | Result |
|---|---|---|---|---|
| 1 | `Zse` parseMemoryStoresEnv | 150442 | `function Zse() {` @150442 | PASS |
| 2 | `bQu` storeObjectSchema | 150491 | `(bQu = we(() =>` @150491 | PASS |
| 3 | `yQu` deriveMountName | 150430-431 | `function yQu(e) {` @150430 | PASS |
| 4 | `vNr` isPromptIndexPathSafe | 150438-441 | `function vNr(e) {` @150438; body `e.split("/").every(...)` @150440 | PASS |
| 5 | `agi` fetchStorePromptIndices | 150754 | `async function agi(e = xQu) {` @150754 | PASS |
| 6 | `kQu` fetchOnePromptIndex | 150768 / 150769 | `async function kQu(e, t) {` @150768 | PASS |
| 7 | `xQu` MEM_PROMPT_INDEX_TIMEOUT_MS = 5000 | 150791 | `var xQu = 5000;` @150791 | PASS |
| 8 | `cXa` buildPromptIndexSizeWarning | 447180 | `async function cXa(e, t) {` @447180; `kBp = 0.8, LBp = 0.7` @447212-213 | PASS |
| 9 | `e0t` loadMemoryPrompt | 151847 | `async function e0t(e) {` @151847 | PASS |
| 10 | `jQu` parseMemoryStoresEnvSafe (`try{Zse()}catch{null}`) | 151840 | `function jQu(){ try { return Zse(); } catch { return null; } }` @151840-846 | PASS |
| 11 | `e0t` injection preamble (`<memory path>`, `</memory` neutralize) | 151860-880 | `s = t ? await agi() : []` @151862; `.replace(/<\/memory\b/gi,"&lt;/memory")` @151874 | PASS |
| 12 | `e0t` team branch (rw/ro split, `!some(scope:"user"&&mode:"rw")`) | 151907-929 | `if (Nk()) { ... m=...rw, A=...ro ... Agi(m.map(f),A.map(f),u,r) ... mgi(u,r) }` @151907-928 | PASS |
| 13 | `e0t` simple-prompt branch → `Egi` | (README step 1) | `Egi(d, f, r, u)` @151885 | PASS |
| 14 | `e0t` tiny branch → `Sgi`/`bgi` | (README step 2) | `Sgi(d,f,u)` @151896 / `bgi("auto memory",d,u)` @151903 | PASS |
| 15 | `e0t` single-auto branch → `UNr` | (README step 4) | `UNr("auto memory", d, u, r)` @151936 | PASS |
| 16 | `e0t` disabled branch → `tengu_memdir_disabled` (+team when herring_clock OR stores) | (README step 5) | `G("tengu_memdir_disabled",...)` @151941; gate `ct("tengu_herring_clock",!1)||process.env.CLAUDE_MEMORY_STORES?.trim()` @151945 | PASS |
| 17 | `Agi` builder | 151265 | `function Agi(e, t, n, r = !1) {` @151265 | PASS |
| 18 | `mgi` builder | 151194 | `function mgi(e, t = !1) {` @151194 | PASS |
| 19 | `Sgi` builder | 151426 | `function Sgi(e, t, n) {` @151426 | PASS |
| 20 | `Egi` builder | 151481 | `function Egi(e, t, n, r) {` @151481 | PASS |
| 21 | `bgi` builder | 151378 | `function bgi(e, t, n) {` @151378 | PASS |
| 22 | `Nk` isTeamMemoryEnabled (mounted-store clause) | 151098-102 | `function Nk(){ if(!Iu()) ...; if(process.env.CLAUDE_MEMORY_STORES?.trim()) return !0; return ct("tengu_herring_clock",!1); }` @151098-102 | PASS |
| 23 | `Iu` isAutoMemoryEnabled | 147636 | `function Iu() {` @147636 | PASS |
| 24 | `Wse` getRemoteMemoryRoot | 147666-669 | `function Wse(){ if(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) return ...; return tr(); }` @147666-669 | PASS |
| 25 | `hm` getAutoMemBaseDir (memoized) | 147746 | `hm = wn(` @147746 | PASS |
| 26 | `uH` getTeamMemPath | 151103 | `function uH() {` @151103 | PASS |
| 27 | `lje` isUserStoreEnabled (`tengu_marble_lark`) | 289759 | `function lje() {` @289759 | PASS |
| 28 | `uFp` startMemoryWatcher | 449203 | `async function uFp() {` @449203 | PASS |
| 29 | `uFp` scope split (`s=team`, `i=user`, `rX`/`$W`) | 449223-235 | `let s=n.filter(scope==="team"), i=n.filter(scope==="user"); rX=lAo(CNr(s),...); $W=lAo(CNr(i),...)` @449224-235 | PASS |
| 30 | `uFp` emits `tengu_personal_mem_sync_started` | 449260-262 | `if($W)(Le("personal_memory_sync_watcher_start"),G("tengu_personal_mem_sync_started",{multistore:!0,watcher_started:!0}))` @449260-262 | PASS |
| 31 | `Svp` renderMemorySaved | 383399 | `function Svp(e) {` @383399 (ends @383440) | PASS |
| 32 | `Svp` file-list verbose-only decisive line `y = o && s.map(Evp)` | 383429 | `((y = o && s.map(Evp)), ...)` @383429 | PASS |
| 33 | `SNa` dispatch `verbose = o \|\| !!s` for memory_saved | 382871-872 | `if(n.subtype==="memory_saved"){ let p = o || !!s,` @382871-872 | PASS |
| 34 | `ANa` teamMemSavedPart | 382753-757 | `function ANa(e){ let t=e.teamCount??0; ... }` @382753-757 | PASS |
| 35 | `YGn` createMemorySavedMessage (`{type:"system",subtype:"memory_saved",writtenPaths}`) | 589751-760 | `function YGn(e){ return {type:"system",subtype:"memory_saved",writtenPaths:e,...} }` @589751-760 | PASS |
| 36 | `Evp`/`Hvp` clickable file | 383441 / 383444 | `function Evp(e){return ...createElement(Hvp,{key:e,path:e})}` @383441; `function Hvp(e){` @383444 | PASS |
| 37 | `m_n` MemoryServiceBackend (carryover) | 150574 | `class m_n {` @150574; `async readByPath(e) {` @150633 | PASS |
| 38 | caps `$w`/`tie`/`HTe` | 150799-801 | `$w="MEMORY.md", tie=200, HTe=25000` @150799-801 | PASS |
| 39 | `.consolidate-lock` `BDp`/`FDp` (carryover) | 424663-664 | `BDp=".consolidate-lock", FDp=3600000` @424663-664 | PASS |
| 40 | `w2p` getDreamThresholds (carryover) | 455394 | `function w2p() {` @455394 | PASS |

**C1 result: 40/40 sampled anchors PASS** (well above the ≥25 requirement). Two anchors below were ALSO
sampled and FAILED line-precision (carryover items only; see Issues AM-04/AM-05) — they do not appear in the
PASS table:
- `PQa` "# Dream: Memory Consolidation" cited @455299 → actual decl `function PQa(e,t,n,r=!1)` @**455311**, header string @**455312**. Line 455299 is inside a *different* function `LQa()` (`function LQa()` @455298). **WRONG-LINE.**
- v2.1.156 verbose computation `w = _ || !!z` cited @[v2.1.156]393209 → actual @[v2.1.156]**393208** (line 393209 is the continuation `D;`). **OFF-BY-ONE.**

### Grep-count claims (re-verified)

| Claim | Doc says | Verified |
|---|---|---|
| `memory_prompt_index` occurrences | 0 in v2.1.156, 4 in v2.1.183 | **0 / 4** — PASS |
| `tengu_personal_mem_sync_started` | 0 in v2.1.156, 1 in v2.1.183 | **0 / 1** — PASS |
| `tengu_kairos_dream` (still absent) | 0 in v2.1.183 | **0** — PASS |
| `CLAUDE_MEMORY_STORES` present in v2.1.156 (watcher-only) | "5 hits" / present | **5** — PASS |

---

## C2 — Before-picture spot-check (v2.1.156 BEFORE bundle)

≥5 before-picture citations opened in `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.

| # | Before-picture claim | Cited line [v2.1.156] | Verified | Result |
|---|---|---|---|---|
| 1 | `z24` parser, no scope/single-user guard | 436721 / 436734-739 | `function z24() {` @436721; loop `K.push({path,mode,mount})` (no scope) @436738 | PASS |
| 2 | `dp_` schema `{path,mode,mount?}`, no scope/promptIndex | 436760-771 | object schema lacks `scope`/`promptIndex`/`promptIndexMaxBytes` @436761-769 | PASS |
| 3 | `sM$` dispatcher + flat team branch | 145046 / 145088-098 | `async function sM$(H){` @145046; team branch `A95.buildCombinedMemoryPrompt(z,K)` single dir @145088-097 | PASS |
| 4 | `nM$` gate flag-only (`tengu_herring_clock`) | 144715-718 | `function nM$(){ if(!M1()) return !1; return V$("tengu_herring_clock",!1); }` @144715-718 | PASS |
| 5 | `LU_` watcher feeds team lane only | 438392-394 | `async function LU_(){ ... let H = nM$() && Mn6("team")` @438392-394 | PASS |
| 6 | `sk_` renderer always shows truncated list + "+N more" | 393698-699 | `function sk_(H) {` @393698 | PASS |
| 7 | `ak_` truncation constant `= 3` | 393839 | `ak_ = 3;` @393839 | PASS |
| 8 | v2.1.156 memory_saved verbose `_ || !!z` | 393209 | actual `let w = _ || !!z` @**393208** (393209 = `D;`) | **FAIL (off-by-one)** — Issue AM-05 |

**C2 result: 7/8 PASS, 1 off-by-one.** The substantive before-picture claims (no scope, flag-only gate,
team-lane-only watcher, always-truncated renderer, `ak_=3`) are all correct; only the verbose-flag line
number is one off.

---

## C3 — Format audit

| Check | README.md | team_memory_stores_recall.md | status_line_and_misc_delta.md |
|---|---|---|---|
| (a) No obf→readable mapping TABLE in module doc | PASS — only delta-summary table | PASS — only delta table + the **allowed** 88/156/183 cross-version table (§6, self-labelled @803) | PASS — only the **allowed** behavior side-by-side (§2.3, self-labelled @342-344) |
| (b) Ends with `## Related Symbols` blockquote | PASS | PASS | PASS |
| (c) Dual-version snippet template (single `====` header) | PASS — 9 snippets, 9 ORIGINAL / 9 READABLE, 18 `====` (2/snippet) | PASS — 16 snippets; 16 ORIGINAL / 11 READABLE (5 are v2.1.156 **before-pictures**, original-only, acceptable) | PASS — 4 snippets, 4 ORIGINAL / 4 READABLE, 8 `====` |
| (d) Relative-link depth | cross-tree v2.1.156 links use `../../../` (3) ✓; **but `../00_overview/symbol_index_*.md` targets do not exist** — Issue AM-01 | same — sibling `../00_overview/` ✓ depth, **broken `symbol_index_*` targets** — AM-01 | same — AM-01 |
| (e) English only | PASS — no CJK | PASS | PASS |

**Mapping-table audit detail.** Every markdown table header across the three docs was enumerated:
`| # | Delta | Headline | Since | Confidence |` (README), `| # | Delta | Where | Kind |` and
`| Concept | v2.1.88 | v2.1.156 | v2.1.183 | Status |` (team_memory),
`| Aspect | v2.1.156 (sk_) | v2.1.183 (Svp) |` (status). **None is an obfuscated→readable mapping table.**
The two cross-version tables are the explicitly-permitted exception and are self-labelled as such. PASS.

**Snippet-fidelity audit.** Every dual-version ORIGINAL block sampled (`Zse`, `bQu`, `vNr`, `agi`, `kQu`,
`cXa`, `e0t` preamble + team branch, `Nk`, `Iu`/`Wse`, `uFp` scope-split, `Svp`, `YGn`, `ANa`) was compared
character-for-character against the bundle: **the ORIGINAL code is copied, not invented.** The `Svp` and
`sk_` React-Compiler memo-cache bodies, the `cXa` threshold constants, and the `</memory` neutralization
regex all match verbatim.

---

## C4 — Dossier framing traps / open questions (honored, not over-claimed)

| Dossier open question | Carried into docs? | Verdict |
|---|---|---|
| (1) Exact introducing patch (2.1.172 vs later) is best-effort; intermediates not bisected | README "Attribution caveat" @28 + "Open questions" #1; team_memory §7; all `Since` cells say "~2.1.172" | HONORED |
| (2) `promptIndexMaxBytes` warning UX trigger (low confidence) | README "Open questions" #2; team_memory §2.3 caveat @423; README §Delta2 caveat @326 | HONORED — `cXa` *logic* verified, UX trigger explicitly flagged un-traced |
| (3) `Agi`/`mgi`/`Sgi`/`Egi`/`bgi` builder bodies (medium) | README #3; team_memory §3.2 + §7 ("full bodies for mgi/Agi, signatures for rest") | HONORED |
| (4) Writable user-scope store end-to-end (medium) | README #4; team_memory §5 caveat @797; README §Delta3 "Why" @406 | HONORED |

**Bonus honesty (good).** `status_line_and_misc_delta.md` §2.4 + the caveat @392-397 *corrects* a latent
over-claim in the dossier's own Delta-6 framing: the dossier said the verbose flag is "set in the renderer
dispatch `SNa`," which could read as "new." The doc correctly notes the `verbose || isTranscriptMode`
computation is **carryover** (already `_ || !!z` in v2.1.156) and that the *only* real delta is the renderer
body. This is exactly the adversarial-honesty posture wanted — the doc does not inflate the delta. (The only
defect is the line number it gives for that v2.1.156 computation: 393209, off by one from 393208 — AM-05.)

No delta is over-claimed: Delta 4 (`Nk`) is correctly scoped as a one-line precedence inversion riding on
carryover machinery (`Iu`/`Wse`/`hm`/`uH`), and the transport plumbing (`lAo`/`pAo`/`CNr`/`m_n`) is
consistently marked carryover in all three docs and the symbol_additions file.

---

## Issues (for the fix pass)

### AM-01 — Broken `symbol_index_*.md` links in every Related Symbols blockquote (tree-wide)  — MEDIUM
The four `../00_overview/symbol_index_{core_execution,core_features,infra_platform,infra_integration}.md`
targets referenced in all three docs' Related Symbols blockquotes **do not exist in the v2.1.183 tree** —
`00_overview/` contains only `symbol_additions_v2_1_183_*.md` and `cross_validation_report_*.md`. The
`symbol_index_*.md` files exist only in the **v2.1.156** tree. This is **tree-wide** (background_agents,
agent_team, compact, workflow docs link the same nonexistent targets) and is the mandated template, and the
`symbol_additions_v2_1_183_auto_memory.md` "Home-index routing note" documents these as forward-references to
be merged into the 156-tree index on a future merge. So the links are intentional but technically broken
today.
**Fix (tree-level, not auto_memory-specific):** either (a) create the four `symbol_index_*.md` files in
`claude_code_v_2.1.183/analyze/00_overview/` (even as stubs that link onward to the 156-tree index), or
(b) repoint the four blockquote links to the existing 156-tree files
(`../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_*.md`, 3×`../`). Keep the per-feature
`symbol_additions_v2_1_183_auto_memory.md` link as-is (it resolves). Apply consistently across the whole 183
tree.

### AM-02 — `Agi`/`mgi` have two different readable names across docs (single-source violation)  — MEDIUM
The canonical names in `symbol_additions_v2_1_183_auto_memory.md` are `Agi → buildTeamRecallRwRo` (row @105)
and `mgi → buildCombinedPrivateTeam` (row @104). `README.md` uses these canonical names. But
`team_memory_stores_recall.md` §3.2 prose + the snippet Mapping line (@547) rename them
`Agi → buildTeamMemoryPromptMultiDir` and `mgi → buildTeamMemoryPromptSingleDir` — and its own Related
Symbols footer (@860-861) then uses the canonical names, so the doc is internally inconsistent too. This is
CLAUDE.md "Mistake 3: Duplicating existing mappings — same symbol with different readable names." The `mgi`
*description* also drifts: symbol_additions/README call it the "combined private+team" fallback builder;
team_memory §3.2 @552 calls it "single-team-dir builder."
**Fix:** in `team_memory_stores_recall.md`, replace `buildTeamMemoryPromptMultiDir` → `buildTeamRecallRwRo`
and `buildTeamMemoryPromptSingleDir` → `buildCombinedPrivateTeam` everywhere (§3.2 prose @551-552, the
readable code @537/544, the Mapping line @547, and the Related Symbols footer @860-861), and align the `mgi`
one-line description to "combined private+team fallback builder."

### AM-03 — `Rt` telemetry helper has two readable names across docs  — LOW
`README.md` maps `Rt → telemetryFail` (Mapping @272); `team_memory_stores_recall.md` maps
`Rt → telemetrySad` (Mapping @352, and §2.2 prose calls it `tengu_feature_sad`). Same helper, two readable
names. (`Rt`/`Le` are generic and not in the symbol_additions file, so neither is "canonical" — but the two
docs should agree.)
**Fix:** pick one (suggest `telemetryFail` for `Rt`, `telemetryOk` for `Le`, matching README) and use it in
both docs' Mapping lines and prose.

### AM-04 — `PQa` carryover anchor points into the wrong function (`LQa`)  — LOW
`README.md` cites `buildDreamPrompt (PQa)` at `cli_inner_pretty.js:455299` (TL;DR @12, "what NOT to re-read"
@668). At 455299 the bundle has `function LQa()` body (`if (!S2p()) return "";`). The real `PQa` declaration
is `function PQa(e, t, n, r = !1)` @**455311**, and the "# Dream: Memory Consolidation" header string is
@**455312**. (Inherited from the dossier anchor table @48 and repeated in `symbol_additions_…auto_memory.md`
@170.) `PQa` is carryover (linked, not analyzed), so impact is low, but the line is wrong.
**Fix:** change `455299` → `455311` (decl) or `455312` (the header string) wherever `PQa` is cited — in
`README.md` (×2), and in `symbol_additions_v2_1_183_auto_memory.md` (@40 self-check list and @170 row). The
tiny-prune header `@151521` ("# Dream: Memory Pruning") is correct and needs no change.

### AM-05 — v2.1.156 verbose-flag line cited @393209, actual @393208  — LOW
`status_line_and_misc_delta.md` cites the v2.1.156 dispatcher's `w = _ || !!z` computation at
`[v2.1.156] cli_inner_pretty.js:393209` in three places (§2.4 step @389, the caveat @395-396, and the Related
Symbols `SNa` row would inherit it). The actual line is **393208** (`let w = _ || !!z,`); 393209 is the
continuation `D;`. Off-by-one.
**Fix:** change `393209` → `393208` in `status_line_and_misc_delta.md` (§2.4 and the §2.4 caveat). The
v2.1.183-side claim that `SNa` computes `p = o || !!s` @382872 is correct and unchanged.

### AM-06 — `BQa` carryover anchor off-by-one  — LOW (optional)
`README.md` and the symbol_additions file cite the auto-dream scheduler `BQa` @455416; the assignment
`BQa = async function (n, r) {` is @**455415** (455416 is its first body line `let o = w2p(),`). Carryover,
linked-only, so cosmetic.
**Fix (optional):** change `455416` → `455415` for `BQa` if precise decl lines are desired; otherwise leave
(it points inside the function body, not into a different function, so it is far less wrong than AM-04).

### AM-07 — minor citation-range looseness (informational, no fix required)
- `team_memory_stores_recall.md` cites the v2.1.156 schema snippet header as "436758-436771" while the actual
  object schema spans 436760-436769; the quoted ORIGINAL is correct, only the header range is generously
  padded. Acceptable.
- `kQu` is cited as both `@150768` (README key-functions, symbol_additions) and `@150769` (dossier anchor
  table, team_memory header). The declaration is @150768; 150769 is the first body line. Self-consistent
  enough; standardize on 150768 if touching.
These are noted for completeness; no action strictly required.

---

## Summary

- **Citations:** 40/40 sampled v2.1.183 anchors PASS at the exact line; 7/8 v2.1.156 before-pictures PASS.
  Two carryover anchors fail line-precision (`PQa` wrong-function @455299→455311; v2.1.156 verbose
  @393209→393208) — both inherited from the dossier, both on linked-only carryover, low impact.
- **Format:** all three docs end with `## Related Symbols`; no obfuscated→readable mapping tables (the two
  cross-version tables are the permitted, self-labelled exception); dual-version snippets follow the single
  `====` template; ORIGINAL code is copied verbatim from the bundle; English only. The one structural defect
  is the **tree-wide** broken `symbol_index_*.md` links (AM-01).
- **Naming discipline:** two single-source-of-truth violations (`Agi`/`mgi` AM-02, `Rt` AM-03) — the
  `team_memory` doc deviates from the canonical names in the symbol_additions file and from `README.md`.
- **Framing:** all four dossier open questions are honored as explicit caveats; no delta is over-claimed; the
  status-line doc adds a correct adversarial down-scope of the dossier's own Delta-6 framing.

**Net: the analysis is substantively correct and well-evidenced. Apply AM-01 (links), AM-02/AM-03 (name
consistency), and AM-04/AM-05 (anchor line fixes); AM-06/AM-07 optional.**
