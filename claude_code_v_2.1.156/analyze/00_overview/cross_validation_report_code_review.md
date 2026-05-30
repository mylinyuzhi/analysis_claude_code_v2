# Cross-Validation Report — Module 45 `/code-review` + `/simplify`

- **Module:** 45_code_review (`/code-review` + `/simplify` + cloud `ultra` bridge)
- **Docs base:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/45_code_review`
- **Additions file:** `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/00_overview/symbol_additions_v2_1_156_code_review.md`
- **Source bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` (649979 lines)
- **Cross-validation source (v2.1.88 TS):** `/lyz/codespace/3rd/claude-code/src/`
- **Markdown files scanned:** 4 (README.md, code_review_command.md, review_prompt_algorithm.md, simplify_and_cloud_review.md) + 1 additions file
- **Samples checked (read at the cited line in the bundle):** 38 distinct symbol/line citations + 6 v2.1.88 precursor checks

---

## C1 — Symbol existence (38 cited symbols sampled)

Every sampled obfuscated identifier was located in the bundle by reading its cited line.

- PASS: 38
- FAIL: 0

Verified symbols (obf → readable, confirmed at the cited line):

| Symbol | Readable (canonical) | Cited line | Read result |
|--------|----------------------|-----------|-------------|
| `Y18` | `CODE_REVIEW_NAME` | 211646 | PASS — `var Y18 = "code-review", T97="verify", e26="commit", HZ6="commit-push-pr"` |
| `bA` | `registerBundledPromptCommand` | 524187 | PASS — `function bA(H){ let {files:$}=H, q, K=H.getPromptForCommand; …}` |
| `Ji4` | `BUNDLED_COMMANDS` | 524295 | PASS — `(… , (Ji4 = []))` comma-expression init |
| `zO9` | `registerCodeReview` | 600612 | PASS — `function zO9(){ bA({ name: Y18, subcommands:{ultra:"ultrareview"}, … }) }` |
| `_O9` | `parseCodeReviewArgs` | 600530 | PASS — `function _O9(H){ let {rawFirstToken:$,flags:q,rest:K}=BN8(H,["comment","fix"]), …}` |
| `BN8` | `tokenizeFlags` | 502812 | PASS — `function BN8(H,$){ …new RegExp(`(?:^|\\s)--${vR(A)}(?=\\s|$)`,"g") …}` |
| `vR` | `escapeRegex` | **9649** (decl) | PASS — `function vR(H){ return H.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") }` (502812 is a *use*-site, not the decl) |
| `dN` | `EFFORT_LEVELS` | 185009 | PASS — `dN = ["low","medium","high","xhigh","max"]` |
| `s$7` | `EFFORT_ALIASES` | 185010 | PASS — `s$7 = { med: "medium" }` |
| `KkH` | `isEffortLevel` | 184859 | PASS — `function KkH(H){ return dN.includes(H) }` |
| `_kH` | `normalizeEffortToken` | 184865 | PASS — `let $=H.trim().toLowerCase(), q=s$7[$]??$; return KkH(q)?q:void 0` |
| `E1H` | `clampEffortLevel` | 184960 | PASS — `if (typeof H==="string") return KkH(H)?H:"high"; return "high"` |
| `or` | `resolveEffortForModel` | 184909 | PASS — clamps `max`/`xhigh`→`"high"` via `ow$`/`ycH` |
| `ow$` | `modelSupportsMax` | 184816 | PASS — true for opus-4-6/4-7/4-8 + sonnet-4-6; honors `si(H,"max_effort")` |
| `ycH` | `modelSupportsXhigh` | 184834 | PASS — true only for opus-4-7/4-8 |
| `q48` | `getDefaultEffortForModel` | 184987 | PASS — `"high"` for opus-4-8, `"xhigh"` for opus-4-7, else `"high"` |
| `k3` | `getEffortFromState` | 453183 | PASS — reads `effortValue`, lets `kind==="effort"` permission layers override |
| `jk` | `isCommandEnabled` | 395641 | PASS — `function jk(H){ return H.isEnabled?.() ?? !0 }` |
| `dq$` | `gatherDiffPhase` | 600275 | PASS — single `var dq$ = "## Phase 0 — Gather the diff…"` (one row) |
| `p1q` | `correctnessAnglesABC` | 600300 | PASS — `var p1q = "### Angle A — line-by-line diff scan…"` |
| `nyz` | `correctnessAnglesDE` | 600421 (assign) | PASS — `(nyz = `${p1q}### Angle D…### Angle E…`)` in `KO9` |
| `F1q` | `cleanupShapeNote` | 600325 | PASS — `F1q = "Cleanup and altitude candidates use the same `file`/`line`/`summary` shape…"` |
| `ryz` | `sweepPhase` | 600329 | PASS — `ryz = "## Phase 3 — Sweep for gaps…up to 8 additional candidates…"` |
| `Q1q` | `buildFindingsOutputSchema` | 600342 | PASS — `Q1q = (H) => "## Output … JSON array of at most ${H} objects…"` |
| `af9` | `verifyPhasePrecision` | 600442 (assign) | PASS — `(af9 = "## Phase 2 — Verify (1-vote, 3-state)…")` |
| `iyz` | `verifyPhaseRecall` | 600458 (assign) | PASS — `(iyz = "## Phase 2 — Verify (1-vote, recall-biased)…")` |
| `sf9` | `lowEffortPrompt` | 600360 | PASS — `sf9 = "`low effort → 1 diff pass → no verify → ≤4 findings`…"` |
| `tf9` | `mediumEffortPrompt` | 600478 (assign) | PASS — `(tf9 = "`medium effort → 3+4 angles × 6…→ ≤8 findings`…precision…")` |
| `ef9` | `highEffortPrompt` | 600502 (assign) | PASS — `(ef9 = "`high effort → 3+4 angles × 6… recall-biased → ≤10`…")`, references `${iyz}` at 600525 |
| `HO9` | `buildHighRecallEffortPrompt` | 600389 | PASS — `HO9 = (H) => "`${H} effort → 5+4 angles × 8…→ sweep → ≤15`…"`, references `${af9}` |
| `$O9` / `qO9` | `xhighEffortPrompt` / `maxEffortPrompt` | 600527 / 600528 | PASS — `($O9=HO9("xhigh")), (qO9=HO9("max"))` |
| `oyz`/`pI8`/`tyz` | `effortPromptMap` / `EFFORT_LEVELS_LOCAL` / `EFFORT_PREFIX_RE` | 600659 / 600660 / 600661 | PASS — one comma-expr; `tyz = new RegExp(`^(${pI8.map(h=>h.slice(0,3)).join("|")})[a-z]*$`,"i")` |
| `eyz`/`Hhz` | `getCodeReviewDescription` / `getCodeReviewArgumentHint` | 600558 / 600561 | PASS — both gate the ultra clause on `WF()` |
| `$hz` | `buildCodeReviewPrompt` | 600564 | PASS — `async function $hz(H,$){ …`${w}${D}${oyz[j]}${_?ayz:""}${z?syz:""}` }` |
| `qhz` | `buildEffortFallbackPreamble` | 600578 | PASS — ultra-fallback / unrecognized-effort preamble tree |
| `ayz`/`syz` | `COMMENT_SUFFIX_BLOCK` / `FIX_SUFFIX_BLOCK` | 600626 / 600638 | PASS — `## Posting to GitHub (--comment)` / `## Applying fixes (--fix)` |
| `vO9`/`Ehz`/`kO9` | `registerSimplify` / `SIMPLIFY_PROMPT` / `simplifyPromptInit` | 601350 / 601378 (assign) / 601375 | PASS — `var Ehz; var kO9 = T(()=>{ Ff(); p2(); Ehz = "`/simplify → 4 cleanup agents…`" })` |
| `WF`/`x8$`/`gIH`/`Vs`/`LU4` | gate + bughunter config notes | 502747 / 502732 / 502735 / **502739** / 502743 | PASS — `Vs` (`getUltraDurationNote`) confirmed at **502739** (not 502740) |
| `dtH`/`d6`/`nP8` | `isCloudCodeRunnerBridgeReady` / `isRemoteWorkspace` / `isInsideGitWorkTree` | 372224 / 3190 / 372570 | PASS |
| `WU4`/`re6`/`oe6`/`ae6`/`pN8` | preflight/scope/eval/launch/orchestrate | 502758 / 502833 / 502896 / 502916 / 503046 | PASS — full cloud chain present |
| `ie6`/`GU4` | `rememberUltraConsent` / `ultraConsentRemembered` | 502826 | PASS — `function ie6(){ GU4 = !0 }` |
| `QU4` | `ultrareviewSlashCommand` | 504286 | PASS — `"Alias of /code-review ultra · ${Vs()} · Est. cost ${gIH()} USD…"`, `isEnabled:()=>WF()` |
| `sq`/`ZX` | `AGENT_TOOL_NAME` / `SKILL_TOOL` | 185637 / 216282 | PASS — `var sq = "Agent"`, `var ZX = "Skill"` |
| env id / clamp / `OSH` | launcher internals | 502936 / 502938-502944 / 503019 | PASS — `"env_011111111111111111111113"`, clamp helper, `OSH({remoteTaskType:"ultrareview"…})`, `tengu_review_remote_launched` at 503027 |

---

## C2 — Line/symbol pairing (sampled pairs)

Each pairing was confirmed by reading the cited line and checking that the *named* symbol is what is defined/assigned there.

- PASS: 37
- FIX-APPLIED: 1 (`vR`)
- WARN: 1 (`bA` prose attribution — clarified)

Findings:

1. **`vR` (escapeRegex) — line-number error (FIXED).** The additions table cited `vR` at
   `cli_inner_pretty.js:502812`. Reading 502812 shows the *reference* `--${vR(A)}` inside `BN8`,
   not a declaration. `vR` is actually declared at **`cli_inner_pretty.js:9649`**
   (`function vR(H){ return H.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") }`). The additions row was
   corrected to 9649 and a Line-number note was added explaining the 502812 use-site.

2. **`bA` prose attribution in code_review_command.md (FIXED).** Line 43 read
   "registered through the generic `registerBundledPromptCommand` (`bA`) helper at
   cli_inner_pretty.js:600612" — but 600612 is `zO9` (the *call site*), while `bA` is declared at
   524187. Reworded to cite `bA` at 524187 and name `registerCodeReview` (`zO9`) at 600612 as the
   call site. (The line number 600612 was correct for "where /code-review is registered"; only the
   symbol↔line attribution was loose.)

All other pairings (assignment-site late-binds for `nyz`/`af9`/`iyz`/`$O9`/`qO9`, the
`oyz`/`pI8`/`tyz` comma-expression, the `Ehz` assignment inside `kO9`) matched the Line-number
notes in the additions file exactly.

---

## C3 — Line range sanity (sampled multi-line ranges)

All sampled ranges have start ≤ end, sit inside the 649979-line bundle, and bracket the claimed
construct.

- PASS: 16
- FAIL: 0

Checked: 211646-211649 (`Y18` block), 524187-524234 (`bA`), 600530-600557 (`_O9`),
600564-600577 (`$hz`), 600578-600611 (`qhz`), 600389-600416 (`HO9`), 600300-600322 (`p1q`),
600442-600457 (`af9`), 600458-600477 (`iyz`), 600329-600341 (`ryz`), 600342-600359 (`Q1q`),
601350-601373 (`vO9`), 601375-601408 (`kO9`), 502747-502749 (`WF`), 502758-502792 (`WU4`),
502916-503045 (`ae6`). `Vs` group range `502735-502746` confirmed to bracket `gIH` (502735),
`Vs` (502739), `LU4` (502743).

---

## C4 — `dq$` single-row confirmation (task-specified fix)

`dq$` is a **single `var`** (`var dq$ = "## Phase 0 — Gather the diff…\n"`,
cli_inner_pretty.js:600275), the head of a comma-expression `var` block continuing into
`BI8`/`cq$`/`lq$`/`nq$`. The additions table already carries it as **one** row (`variable`).

- **FIX-APPLIED:** the additions file's *home-index routing note* listed `dq$` under
  `symbol_index_infra_integration.md` (Slash Commands), contradicting both the table's nature
  (it is a prompt-fragment var) and the file's own "Notes & gaps" section, which states `dq$`
  is filed in `symbol_index_core_features.md` with the other review-angle fragments. Removed `dq$`
  from the infra_integration list and added it to the core_features fragment-var list so the
  single-source-of-truth routing is internally consistent.

---

## C5 — Mapping conflicts (one readable name per symbol)

Initial scan found **systematic readable-name divergence** across the three module docs: each doc
had been written with its own naming style, contradicting the canonical names in the additions
table. The lookup-surface (list-format entries, section headers, standalone prose `name (obf)`
references) was normalized to the canonical additions-table names. Snippet-internal READABLE
pseudocode variables remain (they are doc-local and documented by their `// Mapping:` lines), per
the dual-version convention.

Conflicts resolved (obf → divergent names found → canonical applied):

- `bA`: `registerCommand` / `registerSlashCommand` → **`registerBundledPromptCommand`**
- `_O9`: `parseReviewArgs` → **`parseCodeReviewArgs`**
- `$hz`: `getReviewPrompt` → **`buildCodeReviewPrompt`**
- `qhz`: `ultraFallbackBanner` / `ultraFallbackNotice` → **`buildEffortFallbackPreamble`**
- `oyz`: `EFFORT_PROMPT_MAP` → **`effortPromptMap`**
- `zO9`: `codeReviewCommandFactory` / `registerCodeReviewCommand` → **`registerCodeReview`**
- `vO9`: `simplifyCommandFactory` / `registerSimplifyCommand` → **`registerSimplify`**
- `Ehz`: `simplifyPrompt` → **`SIMPLIFY_PROMPT`**
- `HO9`: `extraHighMaxPrompt` / `recallEffortPromptFactory` → **`buildHighRecallEffortPrompt`**
- `Q1q`: `outputSpec` / `outputSchema` → **`buildFindingsOutputSchema`**
- `tyz`: `unrecognizedLevelRegex` / `unrecognizedEffortRegex` → **`EFFORT_PREFIX_RE`**
- `WF`: `cloudReviewAvailable` / `ultraAvailable` → **`isCloudReviewAvailable`**
- `re6`: `resolveRemoteReviewScope` → **`resolveUltraScope`**
- `WU4`: `ultrareviewPreflight` → **`fetchUltrareviewPreflight`**
- `_kH`/`KkH`/`E1H`/`or`/`ow$`/`ycH`: `parseEffortLevel`/`isValidEffort`/`canonicalEffort`/`clampEffortToModel`/`maxEffortGate`/`xhighEffortGate` → **`normalizeEffortToken`/`isEffortLevel`/`clampEffortLevel`/`resolveEffortForModel`/`modelSupportsMax`/`modelSupportsXhigh`**
- `dq$`/`BI8`/`ayz`/`syz`/`x8$`/`dtH`/`nP8`/`gIH`/`Vs`/`LU4`/`sq`: `DIFF_GATHER_PREAMBLE`/`reuseAngle`/`commentFlagBody`/`fixFlagBody`/`bughunterConfig`/`ccrBridgeAvailable`/`ultrareviewPreconditionMet`/`ultraCostNote`/`ultraDurationNote`/`ultraModel`/`SPAWN_AGENT_TOOL` → canonical `gatherDiffPhase`/`reuseAngleBody`/`COMMENT_SUFFIX_BLOCK`/`FIX_SUFFIX_BLOCK`/`getReviewBughunterConfig`/`isCloudCodeRunnerBridgeReady`/`isInsideGitWorkTree`/`getUltraCostNote`/`getUltraDurationNote`/`getUltraModel`/`AGENT_TOOL_NAME`

Post-fix automated re-scan of all `name (obf)` lookup-surface references across the four module
docs + additions file: **0 remaining divergences.**

- Mapping conflicts after fix: 0

---

## S1 — Semantic spot-check (5 samples)

### Sample 1 — `Vs` (`getUltraDurationNote`) at cli_inner_pretty.js:502739

```js
function Vs() {
  let H = x8$()?.duration_note;
  return typeof H === "string" && H.length > 0 ? H : "~10–20 min";
}
```
**Verdict:** PASS — function begins at **502739** (preceded by `gIH` 502735, followed by `LU4`
502743). The task-specified "starts at 502739 not 502740" is confirmed; the additions file's Notes
already cited 502739 (no change required there).

### Sample 2 — `dq$` (`gatherDiffPhase`) at cli_inner_pretty.js:600275

```js
var dq$ =
    "## Phase 0 — Gather the diff\n\nRun `git diff @{upstream}...HEAD` …also run `git diff HEAD` and\ninclude the working-tree changes in scope …",
  BI8 = `Flag new code that re-implements something the codebase\nalready has …`,
  …
```
**Verdict:** PASS — `dq$` is a single `var` (one row), head of a comma-expression block. The
"gather the range diff *and* `git diff HEAD`" claim is verbatim correct.

### Sample 3 — `HO9` (`buildHighRecallEffortPrompt`) verify-phase subtlety at 600389/600411/600525

```js
HO9 = (H,) => `\`${H} effort → 5+4 angles × 8 candidates → 1-vote verify → sweep → ≤15 findings\`
…Run **9 independent finder angles** via the ${sq} tool…
${nyz}${U1q}${cq$}${lq$}${nq$}${F1q}${af9}
This is recall mode — a single non-REFUTED vote carries the finding…
${ryz}${Q1q(15)}`;
```
**Verdict:** PASS — confirms the doc's non-obvious claim: xhigh/max embed `af9` (the *neutral*
verifier) plus a trailing recall-line, whereas high (`ef9`) swaps in the full `iyz` recall
verifier (`${iyz}` at 600525). Both read directly.

### Sample 4 — `WF` (`isCloudReviewAvailable`) three-clause gate at cli_inner_pretty.js:502747

```js
function WF() {
  return x8$()?.enabled === !0 && dtH() && !d6();
}
```
**Verdict:** PASS — three conjuncts (`tengu_review_bughunter_config.enabled` ∧ CCR bridge `dtH`
∧ not-remote `d6`) exactly as documented; matches the v2.1.88 `isUltrareviewEnabled` core
(`cfg?.enabled === true`).

### Sample 5 — `_O9` (`parseCodeReviewArgs`) ultra/effort/typo classifier at cli_inner_pretty.js:600530

```js
function _O9(H) {
  let { rawFirstToken: $, flags: q, rest: K } = BN8(H, ["comment", "fix"]), … ;
  if ($.toLowerCase() === "ultra") return { …, ultraFallback: !0 };
  let f = Y.toLowerCase() === "ultra" ? void 0 : _kH(Y);
  if (f !== void 0) return { explicit: f, … };
  let O = tyz.test(Y);
  return { …, unrecognizedLevel: O ? Y : void 0, ultraFallback: !1 };
}
```
**Verdict:** PASS — the two `ultra` checks (`rawFirstToken` vs `first`), the `_kH` effort path,
and the `tyz` typo path all match the doc's decision tree verbatim.

---

## v2.1.88 cross-validation spot-checks

- `src/skills/bundled/simplify.ts` — **PASS**: exists; 3 agents (Code Reuse / Code Quality /
  Efficiency) via `AGENT_TOOL_NAME`; "Review all changed files for reuse, quality, and efficiency.
  Fix any issues found." → confirms the doc's "3-agent skill, no Altitude, no bug-hunt disclaimer"
  precursor and the "4-agent cleanup-only is NEW" conclusion (HIGH).
- `src/commands/review.ts` — **PASS**: "You are an expert code reviewer… `gh pr list` / `gh pr view`
  / `gh pr diff`… thorough code review" → confirms 2.1.88 `/review` was a single prose prompt; the
  local angle/verify/sweep machine is NEW (HIGH).
- `src/commands/review/ultrareviewEnabled.ts` — **PASS**: `isUltrareviewEnabled()` =
  `cfg?.enabled === true` (GrowthBook) → confirms `WF` is the matured descendant; the CCR-bridge +
  not-remote conjuncts are the 2.1.156 additions (MEDIUM-HIGH "evolved").
- `src/commands/review/{ultrareviewCommand.tsx,reviewRemote.ts,UltrareviewOverageDialog.tsx}` —
  **PASS**: present → confirms the preflight/overage-dialog precursor behind `WU4`/`oe6`.
- `code-reviewer` in v2.1.88 — **PASS**: appears only in `coreSchemas.ts`, `agentContext.ts`,
  `tools/AgentTool/prompt.ts`, `generateAgent.ts`, `attachments.ts` (schema/example/context), never
  a built-in registration → confirms "example-only, NOT built-in" in both builds (HIGH).
- `code-reviewer` in v2.1.156 — **PASS**: only at 240554/240561/240585 (Agent-tool examples),
  336657 (hook-input schema doc), 376122 (workflow `agent()` doc), 519061 (agent-memory example) —
  all string literals; no registry call (HIGH).

---

## Fixes applied (in place)

1. `symbol_additions_…_code_review.md`: `vR` line `502812 → 9649` (declaration site); added a
   Line-number note explaining the 502812 use-site.
2. `symbol_additions_…_code_review.md`: moved `dq$` in the home-index routing note from
   `infra_integration` → `core_features` (matching its own Notes section; resolves an internal
   contradiction). `dq$` remains a single table row.
3. `review_prompt_algorithm.md`: normalized the "Key symbols" list, section headers, and prose
   references to canonical names (`bA`, `_O9`, `$hz`, `qhz`, `oyz`, `HO9`, `Q1q`, `tyz`, `WF`,
   `re6`, `WU4`, `_kH`, `KkH`, `E1H`, `ow$`, `ycH`, `BN8`, `eyz`, `Hhz`, `ayz`, `syz`, `pI8`,
   `Ehz`); aligned the affected snippet headers + Mapping lines.
4. `simplify_and_cloud_review.md`: normalized list entries, section headers, and prose to canonical
   names (`bA`, `vO9`, `zO9`, `qhz`, `oyz`, `WF`, `E1H`, `or`, `dq$`, `BI8`, `ayz`, `syz`, `x8$`,
   `dtH`, `nP8`, `gIH`, `Vs`, `LU4`, `_kH`, `KkH`, `tyz`, `HO9`, `sq`); aligned the `registerSimplify`
   / `registerCodeReview` snippet headers, bodies, and Mapping lines.
5. `code_review_command.md`: clarified the `bA` (524187) vs `zO9` (600612) attribution so the
   symbol↔line pairing in the opening paragraph is exact.

---

## Confidence roll-up

| Dimension | Result | Confidence |
|-----------|--------|------------|
| C1 Symbol existence | 38/38 PASS | HIGH |
| C2 Line/symbol pairing | 37 PASS, 1 fixed (`vR`), 1 clarified (`bA` prose) | HIGH (after fix) |
| C3 Range sanity | 16/16 PASS | HIGH |
| C4 `dq$` single-row | confirmed single var; routing-note contradiction fixed | HIGH |
| C5 Mapping conflicts | many divergences found, all normalized; 0 remaining | HIGH (after fix) |
| S1 Semantic spot-check | 5/5 PASS | HIGH |
| v2.1.88 cross-validation | 6/6 PASS | HIGH (HIGH on newness; MEDIUM-HIGH on the evolved ultra bridge) |

**Overall verdict: PASS (after fixes).** All sampled citations are accurate against the 2.1.156
bundle; the one genuine line-number error (`vR` 502812 → 9649) and one internal routing
contradiction (`dq$`) were corrected, and the cross-doc readable-name inconsistencies were
normalized to the canonical additions-table names. The v2.1.88 precursor claims (3-agent
`/simplify` skill, prose-only `/review`, GrowthBook `isUltrareviewEnabled`, example-only
`code-reviewer`) all check out, supporting the docs' "local effort machine is NEW, cloud bridge
evolved" conclusions.
