# Cross-Validation Report — Module 07_compact (v2.1.183 delta)

- **Module:** 07_compact (Compaction delta, v2.1.156 → v2.1.183)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/07_compact/`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/00_overview/symbol_additions_v2_1_183_compact.md`
- **Dossier (verified spec):** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.183/analyze/_scout_dossier_compact.md`
- **TARGET bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js` (699,346 lines)
- **Before-picture bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649,979 lines)
- **v2.1.88 named-TS reference:** `/lyz/codespace/3rd/claude-code/src/`
- **Markdown files scanned:** 5 (`README.md`, `fallback_model_in_compaction.md`, `one_million_credits_clamp.md`, `window_resolver_six_sources.md`, `dispatcher_delta.md`) + 1 additions file
- **Samples verified:** 70+ distinct `cli_inner_pretty.js:<line>` citations read directly from the v2.1.183 bundle, 9+ before-picture decls + 14 zero-count greps read from the v2.1.156 bundle.

**Verdict (one line):** PASS. The compaction analysis is overwhelmingly accurate — every load-bearing v2.1.183 declaration, body, and the four deltas verified at the cited lines, and every v2.1.156 before-picture / 0-count grep reproduced. The two real content issues from the first pass (a wrong `XHe→isSameModel` deobfuscation in `README.md`; a "18 callers of `tH`" overcount) and the borderline cross-version rename table in `README.md` §DELTA 5 have all been **fixed** (see "Round 2" below). The only residual is the tree-wide missing `symbol_index_*.md` broken links (owned by Consolidate) and the honestly-flagged MEDIUM-confidence `rowan_thicket` server-push open question.

---

## C1 — Citation spot-check (v2.1.183 TARGET bundle)

Every line below was opened at the exact cited line in the v2.1.183 bundle and the declaration/content confirmed against the doc claim.

### Threshold ladder & window resolution (226742–226983)

| Cited line | Doc claim | Verified declaration | Result |
|---|---|---|---|
| 226742 | `isRedwood3Reactive` (`uG`) | `function uG() {` | PASS |
| 226746 | `isAutoCompactEnabled` (`Kw`) | `function Kw() {` | PASS |
| 226751 | `isLocal`→remote-reactive gate (`S7`) | `function S7() {` + `ct("tengu_reactive_compact_remote", !1)` @226753 | PASS |
| 226769 | `validateEnvInt` (`yae`) | `function yae(e, t, n, r) {` | PASS |
| 226785 | `isValidFraction` (`JNi`) | `function JNi(e) {` | PASS |
| 226788 | `parseArmEntry` (`gwd`) | `function gwd(e) {` | PASS |
| 226795 | `parseArmTable` (`eBi`) | `function eBi(e) {` | PASS |
| 226813 | `matchArm` (`tBi`) | `function tBi(e, t) {` | PASS |
| 226818 | `getAutoCompactThreshold` (`gwn`) | `function gwn(e, t) {` | PASS |
| 226824 | `precomputeThreshold` (`mqr`) | `function mqr(e, t) {` | PASS |
| 226827 | `calculateTokenWarningState` (`nBi`) | `function nBi(e, t, n, r = t) {` | PASS |
| 226843 | `parseWindowString` (`yqr`) | `function yqr(e) {` | PASS |
| 226856 | `opus48ExperimentWindow` (`_qr`) | `function _qr(e) {` | PASS |
| 226865 | `clientDataWindow` (`ywd`) | `function ywd(e) {` | PASS |
| 226875 | `getAutoCompactWindow` (`z2`, 6-source) | `function z2(e, t) {` + clientdata@226888 + model-default@226891 (read in full) | PASS |
| 226895 | `isConfiguredWindow` (`qCe`) | `function qCe(e, t) {` body returns env/settings/clientdata/model-default | PASS |
| 226899 | `getAutoCompactWindowSource` (`ywn`) | `function ywn(e, t) {` | PASS |
| 226902 | `getEffectiveContextWindowSize` (`oee`) | `function oee(e, t) {` | PASS |
| 226908 | `getEffectiveContextWindowSizeRaw` (`_wd`) | `function _wd(e) {` | PASS |
| 226912 | `reportArmTableMalformed` (`Swd`) | `function Swd(e) {` + `tengu_precompute_arm_table_malformed` + `oBi` latch | PASS |
| 226916 | `getPrecomputeBufferFraction` scalar (`gqr`) | `function gqr() {` | PASS |
| 226920 | `getPrecomputeArm` (`bqr`) | `function bqr(e, t, n) {` | PASS |
| 226935 | `getPrecomputeBufferFractionResolved` (`Ewd`) | `function Ewd(e, t, n) {` | PASS |
| 226938 | `getThresholdOverrides` (`Sqr`) | `function Sqr(e, t, n) {` | PASS |
| 226948 | `getAutoCompactThresholdForModel` (`lMt`) | `function lMt(e, t) {` | PASS |
| 226951 | `calculateTokenWarningStatePublic` (`VCe`) | `function VCe(e, t, n) {` | PASS |
| 226956 | `isAbovePrecomputeOrCompact` (`iBi`) | `function iBi(e, t, n, r) {` + `if (l < jQ) return !1` @226962 (read in full) | PASS |
| 226968-226971 | `rBi`/`hwd`/`bwd`/`oBi` var heads | `rBi,` / `hwd,` / `bwd = "tengu_amber_moleskin",` / `oBi = !1;` | PASS |
| 226982 | `rBi`/`hwd` init | `((rBi = {}), (hwd = new Set(["claude-sonnet-4-6", "claude-opus-4-6"])))` | PASS |
| 227081 | `RECOVERY_TIMEOUT_MS` (`vqr`) | `vqr = 600000;` | PASS |
| 227130 | `latestAssistantUsage` (`Qtt`) | `function Qtt(e) {` + newest-first `for (let t = e.length - 1; ...)` | PASS |

### Model hard-cap & 1M-credits clamp (134105–134192, 2624–2970, 229176–229611, 233039–233173)

| Cited line | Doc claim | Verified declaration | Result |
|---|---|---|---|
| 134105 | `getContextWindowForModel` (`tH`) | `function tH(e, t) {` + `if (ARr(e, t)) return jQ;` @134108 | PASS |
| 134111 | `getMaxContextTokensOverride` (`Ati`) | `function Ati() {` | PASS |
| 134118 | `is1mClampActive` (`ARr`) | `function ARr(e, t) {` body `N8e() && Ati() === void 0 && gti(e, t) > jQ` | PASS |
| 134121 | `rawModelWindow` (`gti`) | `function gti(e, t) {` | PASS |
| 134191 | `DEFAULT_WINDOW` (`mxt`) | `var mxt = 200000,` | PASS |
| 134192 | `STANDARD_WINDOW` (`jQ`) | `jQ = 200000,` | PASS |
| 2624 | flag init | `longContext1mCreditsBlocked: !1,` | PASS |
| 2965 | `get1mCreditsBlocked` (`N8e`) | `function N8e() {` | PASS |
| 2968 | `set1mCreditsBlocked` (`Wtr`) | `function Wtr(e) {` | PASS |
| 229176 | `rateLimitErrorMapper` (`$Cd`) | `function $Cd(e, t, n) {` | PASS |
| 229183 | 429 branch entry | `if (e instanceof es && e.status === 429) {` | PASS |
| 229192 | clamp trip | `if (s && Fwn(e.message) && !N8e()) (Wtr(!0), G("tengu_1m_credits_clamp_activated", {}));` (verbatim) | PASS |
| 229606 | `is1mCreditsError` (`Fwn`) | `function Fwn(e) {` body two `includes` checks | PASS |
| 229611 | `is1mCreditsApiError` (`DFi`) | `function DFi(e) {` body `N8e() && e.isApiErrorMessage === !0 && ... Fwn(e.errorDetails)` | PASS |
| 233039–233041 | reactive boundary → prompt_too_long @200k | `if (DFi(a)) { let d = $T(e) - jQ; return {... viaCreditsBoundary: !0 };` (verbatim) | PASS |
| 233110/233125/233144/233163/233173 | `tengu_compact_credits_clamp_rescue` emit + `viaCreditsBoundary) d = !0` | all five present at the exact cited lines (outcome `failed`/`ok`) | PASS |

### Dispatcher / pipeline / fallback summarize (460488–462778)

| Cited line | Doc claim | Verified declaration | Result |
|---|---|---|---|
| 460488 | `FallbackTriggeredError` (`vF`) | `vF = class vF extends Error {` (lazy-init module) | PASS |
| 460676 | `compactConversation` (`zut`) | `async function zut(e, t, n, r, o, s = !1, i, a = !1, l, c, u) {` | PASS |
| 460682 | OTEL span (`D$t`) | `g = D$t("claude_code.compaction", {` | PASS |
| 460886 | `partialCompact` (`cel`, `s="from"`) | `async function cel(e, t, n, r, o, s = "from", i, a) {` | PASS |
| 461078 | `buildFallbackChain` (`ICn`) | `function ICn(e, t) {` | PASS |
| 461088 | `streamCompactSummary` (`del`) | `async function del({` | PASS |
| 461118 | cache-fork fallback-aware | `fallbackModel: ICn(r.options.mainLoopModel, r.options.fallbackModel),` (verbatim) | PASS |
| 461189–461192 | chain assembly + `while(!0)` | `let h = ICn(A, r.options.fallbackModel), y = [A, ...h.filter((b) => b !== A)], _ = 0; while (!0) {` | PASS |
| 461208–461209 | model + fallbackModel threaded | `model: b,` / `fallbackModel: y[_ + 1],` | PASS |
| 461266 | `tengu_model_fallback_triggered{query_source:"compact"}` | `G("tengu_model_fallback_triggered", {` + `query_source: Qe("compact"),` (read in full) | PASS |
| 461283–461284 | model_blocked → `FW` | `if (C instanceof vF && C.reason === "model_blocked") throw new FW(...is currently unavailable.)` | PASS |
| 461419 | `dpt` interrupted string | `dpt = "Compaction interrupted ..."` | PASS |
| 461476 | `ModelUnavailableError` (`FW`) | `FW = class FW extends Error {};` | PASS |
| 461478 | `isModelUnavailableError` (`Kjp`) | `function Kjp(e) { return e instanceof FW || ...` | PASS |
| 461481 | `computeRapidRefillStreak` (`Igo`) | `function Igo(e) {` body identical to v2.1.156 `fc6` | PASS |
| 461484 | `prefixOverflowCheck` (`Yjp`) | `function Yjp(e, t, n, r = 0) {` | PASS |
| 461516 | `isColdCompact` (`Wgo`) | `function Wgo() {` | PASS |
| 461519 | `shouldAutoCompact` (`Xjp`) | `async function Xjp(e, t, n, r, o = 0) {` + `if (S7() && !uG() && !qCe(t, n)) return !1;` @461523 | PASS |
| 461531 | `autoCompactIfNeeded` (`Ego`) | `async function* Ego(e, t, n, r, o, s, i) {` (7-param, confirms new `i` swap callback) | PASS |
| 461537–461543 | prefix-overflow call-site | `let u = Yjp(e, a, l, s); if (u) (... Rt("compact_auto","compact_auto_prefix_overflow"), G("tengu_auto_compact_prefix_overflow", { ...u, wouldHaveBlocked: !0 }))` (verbatim) | PASS |
| 461556 | reactive fork S7 gate | `if (r !== void 0 && p !== "auto" && S7()) {` | PASS |
| 461559–461572 | recovery-timeout block | `let L = ZO(T.abortController), P = setTimeout((R) => R.abort("recovery-timeout"), vqr, L);` (verbatim) | PASS |
| 461655 | `autoWindowSpinnerHint` (`Jjp`) | `function Jjp(e, t) {` + `if ((r !== "experiment" && r !== "clientdata") || o >= s) return null;` @461660 | PASS |
| 461663–461665 | breaker constants 3/3/3 | `var jgo = 3, Ggo = 3, cWn = 3,` | PASS |
| 461687 | `THRASHING_USER_MESSAGE` (`wgo`) | `wgo = `Autocompact is thrashing...${Ggo}...${cWn}`` | PASS |
| 462778 | `estimateMessagesTokens` (`$T`) | `function $T(e, t) {` | PASS |

### Cross-cutting / supporting cast

| Cited line | Doc claim | Verified declaration | Result |
|---|---|---|---|
| 102376 | `isSmallerWindow` (`XHe`) | `function XHe(e, t) { ... return tH(t, n) < tH(e, n); }` — **window comparator** (see Issue #1) | PASS (decl); README mis-maps it |
| 102904 | `ctxWindowForModel` (`ww`) | `function ww(e) {` | PASS |
| 145276 | `displayModelName` (`x_`) | `function x_(e) {` | PASS |
| 149264 | `resolveFallbackModelChain` (`SAi`) | `function SAi(e) {` | PASS |
| 149276 / 149325 | `xJu = 3` cap | break @149276 uses `xJu`; `xJu = 3,` declared @149325 | PASS |
| 368570 | `isThinkingEnabledForModel` (`MBn`) | `function MBn(e) {` | PASS |
| 44575 | `logFeatureSad` (`Rt`) | `function Rt(e, t, n) {` | PASS |
| 453256 | `reactiveCompact` (`TGn`) | `async function TGn(e) {` | PASS |
| 452899 / 452973 | precompute gated/rearm telemetry (open-Q anchors) | `G("tengu_precomputed_compact_arm_gated", {` / `G("tengu_precomputed_compact_rearm_capped", {` | PASS |
| 101582 | context-hint beta (unchanged) | `dCr = jS("context_hint", "context-hint-2026-04-09")` | PASS |
| 582383/590761/590806/590838 | `vF` raise sites | all four `new vF(...)` present with claimed `reason` args | PASS |
| 590793 | `FALLBACK_FOR_ALL_PRIMARY_MODELS` gate | `(process.env.FALLBACK_FOR_ALL_PRIMARY_MODELS ||` | PASS |

**C1 result:** 70/70 cited v2.1.183 anchors verified at their exact lines. Zero citation-line FAILs. (One semantic-mapping FAIL is logged under Issue #1 — the *line* is correct, the *readable rewrite* in README is wrong.)

---

## C2 — Before-picture spot-check (v2.1.156 bundle)

| v2.1.156 cited line | Doc claim | Verified | Result |
|---|---|---|---|
| 423539 | `_X4` summarize head | `async function _X4({` | PASS |
| 423637 | `model: mainLoopModel` hardcoded | `model: K.options.mainLoopModel,` | PASS |
| 423678 | `throw Error(NH$)` on failure | `Error(NH$)` | PASS |
| 423915 | `Xl` 4-source resolver | `function Xl(H, $) {` — body has exactly env/settings/experiment/auto returns (no clientdata/model-default) | PASS |
| 423931 | `EH$` configured-window | `function EH$(H, $) { ... return q === "env" || q === "settings"; }` (2 members only) | PASS |
| 423988 | `_JH` bare remote check | `function _JH() { return !xH(process.env.CLAUDE_CODE_REMOTE); }` | PASS |
| 130165 | `Ov` hard cap (no clamp) | `function Ov(H, $) {` — no `ARr`/`N8e` branch | PASS |
| 130223 | `P36` standard window | `var P36 = 200000,` | PASS |
| 423954 | `tb_` scalar fraction | `function tb_() {` (no arm table) | PASS |
| 186612–186614 | credits-string user-message only | `H.message.includes("Extra usage is required for long context")` (user-message, no flag/clamp) | PASS |

**Zero-count grep proofs reproduced in v2.1.156** (all returned **0**, matching the docs/dossier):
`longContext1mCreditsBlocked`, `tengu_1m_credits_clamp_activated`, `tengu_compact_credits_clamp_rescue`, `viaCreditsBoundary`, `source: "clientdata"`, `source: "model-default"`, `rowan_thicket`, `tengu_amber_moleskin`, `tengu_precompute_arm_table_malformed`, `tengu_reactive_compact_remote`, `tengu_auto_compact_prefix_overflow`, `recovery-timeout`, `wouldHaveBlocked`, `compact_auto_prefix_overflow` — **14/14 = 0**. The `_X4` body (156:423539–423682) `grep -c "fallbackModel"` = **0** and `grep -c "while (!0)"` = **0**, confirming the single-pass before-picture. The corresponding v2.1.183 presence counts (`tengu_reactive_compact_remote`→1, `tengu_auto_compact_prefix_overflow`→1, `compact_auto_prefix_overflow`→1, `wouldHaveBlocked`→1) were also confirmed.

**C2 result:** 10/10 before-picture decls + 14/14 zero-greps + the `_X4`-body greps verified. PASS.

---

## C3 — Format scan

### (a) No obfuscated→readable mapping TABLE in a module doc

- `fallback_model_in_compaction.md`, `one_million_credits_clamp.md`, `window_resolver_six_sources.md`, `dispatcher_delta.md`: **PASS** — symbol references use list format (`readableName` (obf: `Xy2`, cli_inner_pretty.js:NNN)); the only tables present are an analytical Delta/Source/Confidence/Topic table (not obf→readable).
- `README.md`: **PARTIAL / borderline.** §"DELTA 5" carries a 4-column **cross-version rename table** `| Readable name | v2.1.156 obf | v2.1.183 obf | v2.1.183 line |` (line 531). It is *readable-keyed*, not a pure `| Obfuscated | Readable |` deobfuscation lookup, and is a 156↔183 cross-version comparison — which the task framing tolerates as a cross-version exception, but the strict CLAUDE.md rule scopes that exception to cross_validation/symbol_additions docs. `dispatcher_delta.md` presents the *same* rename information in compliant list format, demonstrating the table is avoidable. See Issue #3 (medium).

### (b) Every doc ends with a `## Related Symbols` blockquote

**PASS (template).** All 5 docs end with `## Related Symbols` (README:626, fallback:570, one_million:494, window_resolver:540, dispatcher:606), each a blockquote pointing at the four `../00_overview/symbol_index_*.md` + the per-feature `symbol_additions_v2_1_183_compact.md`, followed by a list-format key-function index. **However the four `symbol_index_*.md` targets do not exist in this tree** — see Issue #2.

### (c) Dual-version snippets use the single-`====` header template

**PASS.** Header-bar count = 2× block count in every doc, and ORIGINAL/READABLE counts match the block count: README 8 blocks (8/8), fallback 7 (7/7), one_million 8 (8 READABLE / 7 plain ORIGINAL + 1 `// ORIGINAL (v2.1.156, for source lookup):` labelled-variant = 8), window_resolver 7 (7/7), dispatcher 5 (5/5). No ORIGINAL/READABLE labels are wrapped in their own `====` bars. **Minor nuance:** `one_million_credits_clamp.md` §5b (line 439) contains a *bare* v2.1.156 ORIGINAL excerpt (`// ORIGINAL (v2.1.156, for source lookup) — cli_inner_pretty.js:186612-186621:`) with no `====` header and no READABLE pair — this is an inline quoted-source excerpt, not a full dual-version block; acceptable but noted (low).

### (d) Relative links resolve

- **Cross-tree** `../../../claude_code_v_2.1.156/analyze/07_compact/*.md` (THREE `../`): **PASS** — all 8 distinct baseline targets exist and the depth is correct in every doc. No wrong-depth (`../../` or `../../../../`) cross-tree links found.
- **Sibling overview** `../00_overview/symbol_additions_v2_1_183_compact.md`: **PASS** (file exists).
- **Sibling overview** `../00_overview/symbol_index_{core_execution,core_features,infra_platform,infra_integration}.md`: **FAIL (tree-wide)** — these four files do **not** exist under `claude_code_v_2.1.183/analyze/00_overview/` (the dir holds only `symbol_additions_*` and `cross_validation_report_*`). See Issue #2.
- **This-tree siblings** `./README.md`, `./one_million_credits_clamp.md`, `./window_resolver_six_sources.md` (and bare-filename `window_resolver_six_sources.md`): **PASS** — all resolve.

### (e) English only

**PASS.** No CJK/Japanese/Korean characters in any doc. The `·` / `—` / `\xB7` / `—` glyphs are escaped string literals copied verbatim from the bundle (e.g. `dpt`, the credits remediation message), not prose.

---

## C4 — Dossier framing-trap / open-question honoring

| Dossier item | Required framing | Honored? |
|---|---|---|
| OQ1 `clientdata`/`rowan_thicket` semantics | MEDIUM, server-push path not traced | **YES** — flagged MEDIUM in README OQ1, window_resolver §2 "OPEN QUESTION", confidence table, one_million OQ2. Not overclaimed. |
| OQ2 precompute arm-table consumption timing | MEDIUM, `_arm_gated`/`_rearm_capped` swap timing not traced | **YES** — flagged in README OQ2, window_resolver §4 close, dispatcher §3/§5; anchors 452899/452973 verified to exist. |
| OQ3 no same-model streaming-retry resurrection | LOW; the `while(!0)` is a **model-fallback** loop, not streaming retry | **YES** — README OQ3 and fallback §8.3 both explicitly characterize it as model-fallback (advances only on `vF`), confirm no `tengu_compact_streaming_retry` in `del`. Correctly framed. |
| OQ4 `iBi` `l < jQ` guard | LOW, standard-window floor | **YES** — window_resolver §3 reads the guard and confirms it is the 200k floor, not a math change; README OQ4 + one_million OQ4 carry the caveat. |
| OQ5 `fallbackModel` up-to-three enforcement | LOW, schema has no max-3, cap is doc/UI-level? | **HONORED + RESOLVED** — fallback §4 locates the hard cap in the *resolver* (`xJu = 3` @149325, `if (r.length === xJu) break`), verified. README OQ5 keeps the schema caveat. Appropriately upgraded with evidence, not overclaimed. |

**C4 result:** PASS. All five dossier open questions carried into the docs with honest confidence; OQ5 was correctly resolved with a verified citation rather than left dangling, and OQ3 (the highest-risk mischaracterization trap) is correctly framed in both docs.

---

## Issues (for the fix pass)

### Issue #1 — [HIGH] `README.md` mis-maps `XHe` as `isSameModel` (contradicts source + sibling doc)

`README.md` (lines 47–61, the `buildFallbackChain` dual-version block) renames `XHe → isSameModel` with the inline comment `// XHe(base, candidate) == "candidate is the same model as base" — drop self-references`. The actual v2.1.183 source at `cli_inner_pretty.js:102376` is `function XHe(e, t) { let n = Wb(); return tH(t, n) < tH(e, n); }` — a **strict-smaller-window comparator**, not a same-model check. `fallback_model_in_compaction.md` §2.1 (correctly) maps it `XHe → isSmallerWindow` with the right `>=` filter semantics, and `symbol_additions_v2_1_183_compact.md:145` also says `isSmallerWindow`. So the README is internally inconsistent with both the source and the rest of the module. This is load-bearing — it changes the *meaning* of the `ICn` chain filter (keep fallbacks whose window is ≥ the primary's, vs "drop duplicates"). **Fix:** in the README `ICn` block, rename `XHe → isSmallerWindow`, change the comment to "drop fallbacks whose context window is strictly smaller than the primary's (`tH(candidate) < tH(base)`)", and update the Mapping line `XHe->isSameModel` → `XHe->isSmallerWindow`. (Note the dedup-against-primary is actually done by the separate `.filter((b) => b !== A)` in `y = [A, ...]`, so the README's "drop self-references" intent belongs on *that* filter, not `XHe`.)

### Issue #2 — [MEDIUM] Four broken `../00_overview/symbol_index_*.md` links in all 5 docs (tree-wide)

Every doc's `## Related Symbols` blockquote links `../00_overview/symbol_index_{core_execution,core_features,infra_platform,infra_integration}.md`, but those four files do **not** exist in `claude_code_v_2.1.183/analyze/00_overview/` (which holds only `symbol_additions_*` and `cross_validation_report_*`). The v2.1.156 baseline tree *does* have them. This is the identical tree-wide gap already flagged by `cross_validation_report_agent_team.md`, `cross_validation_report_background_agents.md`, and `cross_validation_report_workflow.md` — the compact docs are *template-compliant* (the blockquote is the mandated format) but the targets are pending consolidation. **Fix (pick one, consistent with the rest of the tree):** (a) author/copy the four `symbol_index_*.md` into `claude_code_v_2.1.183/analyze/00_overview/` and fold the `symbol_additions_v2_1_183_compact.md` Compact rows in; or (b) until then, repoint the four links to the baseline `../../../claude_code_v_2.1.156/analyze/00_overview/symbol_index_*.md`. The per-feature `symbol_additions_v2_1_183_compact.md` link already resolves. (Do NOT special-case compact — fix tree-wide.)

### Issue #3 — [MEDIUM] `README.md` §DELTA 5 carries a cross-version obf rename table in a module doc

`README.md:531` is a 4-column `| Readable name | v2.1.156 obf | v2.1.183 obf | v2.1.183 line |` rename table (≈45 rows). CLAUDE.md forbids obfuscated mapping tables in module docs and scopes the cross-version-table exception to cross_validation / symbol_additions docs. The table is readable-keyed (not a pure `| Obfuscated | Readable |` lookup) and the same content already lives compliantly in `symbol_additions_v2_1_183_compact.md` and is rendered in **list format** by `dispatcher_delta.md` §0 — so it is avoidable. **Fix:** either (a) convert the README §DELTA 5 table to the list format used by `dispatcher_delta.md` §0 (`readableName` (v2.1.156 `oldObf` → v2.1.183 `newObf`, cli_inner_pretty.js:NNN)), or (b) move the full rename map to `symbol_additions_v2_1_183_compact.md` and leave a one-line pointer in the README. (Lower-effort acceptable resolution: keep it but add an explicit note that it is a cross-version rename/lineage table, the allowed exception — though list format is the cleaner outcome.)

### Issue #4 — [LOW] "18 callers of `tH`" overcount in `one_million_credits_clamp.md`

`one_million_credits_clamp.md` §3b (line 299) states "There are 18 callers of `tH` in the v2.1.183 bundle (grep-verified)". Re-running: `grep -nE '\btH\(' cli_inner_pretty.js` = **16 lines** (17 total occurrences — line 102378 inside `XHe` has two `tH(`), minus the 1 declaration = **~15–16 call-sites**, not 18. The architectural point ("clamping at the single hard-cap point re-windows the whole subsystem; clamping elsewhere would touch every caller") is sound regardless of the exact number. **Fix:** change "18 callers" to "~16 call-sites" (or drop the specific count and say "every window consumer reads through `tH`"). Low severity — a parenthetical metric, not a load-bearing claim.

### Issue #5 — [LOW] `one_million_credits_clamp.md` §5b bare ORIGINAL excerpt without the dual-version template

§5b (line 439) presents `// ORIGINAL (v2.1.156, for source lookup) — cli_inner_pretty.js:186612-186621:` as a standalone code excerpt with no `====` header block and no paired READABLE. It is a short quoted before-picture string (the credits user-message), used illustratively rather than as a deobfuscation block. Strictly it is not a full dual-version snippet. **Fix (optional):** either wrap it in the full `====` header + ORIGINAL/READABLE/Mapping template, or leave it as a clearly-labelled inline quote (it is already labelled "ORIGINAL (v2.1.156…)" so this is borderline-acceptable). Lowest priority.

---

## Round 2 — re-verification pass + fix application (this pass)

A second skeptical pass re-read 23 anchors against live source and confirmed the analysis is clean: all 4 headline deltas (fallback-model loop in `del`, 1M-credits-without-entitlement clamp, window resolver 4→6 sources, precompute arm table + remote-reactive gate + prefix-overflow probe) verified at the cited line numbers with accurate code snippets; all 7 new telemetry/feature terms confirmed absent in v2.1.156 and present in v2.1.183; **zero drift, zero content defects** found.

**Round-1 issues — disposition:**

- **Issue #1 (HIGH) — `XHe→isSameModel` mis-map: FIXED.** `README.md` §DELTA 1 now maps `XHe → isSmallerWindow` (the strict-smaller-window comparator `tH(candidate) < tH(base)`), with the dedup-against-primary correctly attributed to the separate `.filter((b) => b !== A)`. Internally consistent with `fallback_model_in_compaction.md` §2.1 and `symbol_additions_v2_1_183_compact.md`.
- **Issue #3 (MEDIUM) — README §DELTA 5 cross-version rename table: FIXED.** Converted to list format (`readableName` (obfuscated: `newObf`, cli_inner_pretty.js:NNN; was `oldObf`@NNN)), mirroring `dispatcher_delta.md §0`, with a one-line pointer to `symbol_additions_v2_1_183_compact.md` for the full lineage table. No obf→readable table remains in any module doc.
- **Issue #4 (LOW) — "18 callers of `tH`" overcount: FIXED.** `one_million_credits_clamp.md` §3b now reads "~16 call-sites of `tH` (`grep -nE '\btH\(' ` = 16 lines; every window consumer reads through `tH`)".
- **Issue #5 (LOW) — bare v2.1.156 ORIGINAL excerpt: addressed.** `one_million_credits_clamp.md` §5b is now explicitly labelled an "illustrative quote, not a dual-version block" with a sentence explaining there is no paired READABLE because the inline block was *replaced* by the named `Fwn` matcher deobfuscated in §3a/§3b. Acceptable as a clearly-labelled inline quote.
- **Issue #2 (MEDIUM, tree-wide) — missing `symbol_index_*.md`: DEFERRED to Consolidate.** The four `../00_overview/symbol_index_*.md` targets still do not exist under `claude_code_v_2.1.183/analyze/00_overview/`. This is the identical tree-wide gap flagged by the other v2.1.183 feature trees; the compact docs are template-compliant (the blockquote is the mandated format). Not fixable from within the compact unit's owned files without special-casing compact — left for the Consolidate phase to author/copy the four index files tree-wide.

**Residual open question — `clientdata` window-source ORIGIN (rowan_thicket server-push): STILL OPEN, sharpened.** Re-verification confirmed the read path is fully pinned (`z2`@226887 → `ywd`@226865-226874 → `hti()?.rowan_thicket`) but `grep -n 'rowan_thicket =' cli_inner_pretty.js` returns **0 write sites** — the field is read-only in-bundle, populated by an external (SDK/server) clientdata sync. Confidence is now explicitly split: **HIGH on existence + wiring**, **MEDIUM on the server-push mechanism** (inferred external cache population). The honest flag in `window_resolver_six_sources.md` §2 (and §7 confidence table), README OQ1, and `one_million_credits_clamp.md` OQ2 was updated to record the negative-grep evidence and the HIGH/MEDIUM split. The gap remains correctly characterized as a server-controlled cache field outside this bundle — no overclaim.

---

## Verdict

**PASS.** The 07_compact delta analysis is exceptionally well-grounded: 70/70 v2.1.183 citation anchors and all four deltas (fallback-model summarize loop, 1M-credits clamp-back, 6-source window resolver, arm-table/remote-reactive/prefix-overflow/recovery-timeout) verified verbatim at the cited lines; 10/10 v2.1.156 before-picture decls and 14/14 zero-count grep proofs reproduced; the dossier's five open questions all honored (and OQ5 correctly resolved with a verified `xJu=3` citation, OQ3's streaming-retry trap correctly avoided); Round-2 re-verification (23 anchors) found zero drift and zero content defects. Format is strong (English-only, correct three-`../` cross-tree depth, single-`====` snippet template, every doc ends with `## Related Symbols`).

The Round-1 content fixes (**Issue #1** README `XHe→isSameModel`; **Issue #3** README cross-version rename table; **Issues #4–#5** LOW polish) are all applied. The only open item is **Issue #2** (missing `symbol_index_*.md`, MEDIUM, tree-wide) — a format/consolidation gap shared with the other v2.1.183 feature trees and deferred to the Consolidate phase. None of these undermine the analysis's core correctness — the deltas, line numbers, and before/after contrasts are sound.
