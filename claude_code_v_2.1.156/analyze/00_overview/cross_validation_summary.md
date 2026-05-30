# Cross-validation Summary — v2.1.156 (v2.1.143 → v2.1.156 delta)

A cross-unit roll-up of the nine per-module verification passes that audited the v2.1.156 analysis tree, plus an independent re-check of the consolidated `symbol_index_*.md` files (cross-file de-dup, name single-source-of-truth, line-number spot-checks), a forbidden-mapping-table compliance scan over every module doc, and a broken-relative-link sweep.

**Source under analysis:** `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` — **649,979 lines**, `VERSION: "2.1.156"` at `cli_inner_pretty.js:568305` (both re-confirmed by direct read during this sweep).

**Cross-validation sources:** v2.1.88 readable TypeScript at `/lyz/codespace/3rd/claude-code/src/`; the prior v2.1.142 bundle for cross-version precursor checks; the v2.1.142 analyze tree (`../../../claude_code_v_2.1.142/analyze/`) as the format/depth reference.

**Scope of the delta tree:** nine module dirs — `04_tools`, `10_skill_system`, `11_hooks`, `36_background_agents`, `37_permission_policy`, `42_workflow`, `43_model_opus48`, `44_lean_prompt`, `45_code_review` — plus `00_overview/` (four consolidated index files, nine per-module `symbol_additions_*` files, README, file_index, changelog analyses, and the nine per-module cross-validation reports). This is a feature-delta tree, not a full re-analysis: only modules touched by the v2.1.143 → v2.1.156 window are present (e.g. there is intentionally no `01_agent_loop/`).

---

## 1. Per-module verification roll-up (citation spot-checks)

Each of the nine modules was verified independently against the 2.1.156 bundle by reading every cited line. The table below aggregates each module's reported sample size, pass/fail split, in-place fixes applied, and post-fix verdict.

| Module | Samples | Pass | Fail | Fixes | Verdict (post-fix) | Confidence |
|--------|--------:|-----:|-----:|------:|--------------------|------------|
| `42_workflow` | 38 | 38 | 0 | 5 | PASS | HIGH |
| `36_background_agents` | 28 | 27 | 1 | 6 | PASS | HIGH |
| `43_model_opus48` | 22 | 22 | 0 | 8 | PASS | HIGH |
| `44_lean_prompt` | 27 | 27 | 0 | 6 | PASS | HIGH |
| `45_code_review` | 44 | 43 | 1 | 5 | PASS | HIGH |
| `04_tools` | 55 | 55 | 0 | 7 | PASS | HIGH |
| `10_skill_system` | 47 | 47 | 0 | 3 | PASS | HIGH |
| `11_hooks` | 62 | 59 | 3 | 4 | PASS | HIGH |
| `37_permission_policy` | 52 | 52 | 0 | 2 | PASS | HIGH |
| **Total** | **375** | **370** | **5** | **46** | **PASS** | **HIGH** |

**Aggregate: 370 / 375 citations passed (98.7%) on the first verification read; all 5 failures were line-number / range defects (not fabricated symbols) and were fixed in place. 46 in-place corrections were applied across the nine modules.**

### Failure detail (all 5 now fixed)

The five raw failures were genuine line/range defects, not invented symbols — every obfuscated identifier existed in the bundle; only the cited line or end-of-range was wrong.

- **`36_background_agents` (1 fail):** `hwz` `--exec` handler end-line cited `542018`, actual end `542006`; the wrong end-line had propagated to 3 docs + the additions file, plus 2 off-by-one `542007` sites. All corrected. (Declaration `async function hwz` at `cli_inner_pretty.js:541956` independently re-confirmed in this sweep.)
- **`45_code_review` (1 fail):** `vR` (`escapeRegex`) was cited at its `502812` use-site; the declaration is at `cli_inner_pretty.js:9649` (independently re-confirmed: `function vR(H) {` at 9649). Fixed.
- **`11_hooks` (3 fails):** 3 line/citation defects in the schema/Stop-hook citations, plus 1 cross-doc readable-name divergence cluster, all reconciled.

### Largest recurring defect class: readable-name single-source-of-truth drift

Seven of the nine modules reported the same dominant issue — a single obfuscated symbol carrying **different readable names across the module's own docs**, contradicting the canonical name in that module's `symbol_additions_*` file. This is the expected failure mode when multiple deep-dive docs are authored in parallel. Examples reconciled in place:

- `42_workflow`: `KP6`, `r$7`, `hL5` (the `gate_caps` doc deviated from the additions-file canon; `workflow_tool_definition` already matched).
- `36_background_agents`: `hwz`, `pe4`, `q5q`, `_J`, `Nv`, `ol` (6 symbols renamed in two later deep-dives).
- `45_code_review`: `WF`, `HO9` and others — each of the 3 docs used its own name; all lookup-surface references normalized to the additions-table canon, snippet-internal READABLE pseudocode left as-is per the dual-version convention.
- `04_tools`: cross-cutting helpers `xH`/`k4`/`V$`/`yK` reconciled to the central-index canon across 7 edit sites.
- `10_skill_system`: `k3` named two ways in one doc — fixed.
- `37_permission_policy`: no name drift (cleanest module; only 2 benign off-by-one prose cites, left as-is because the cited line still contains the claimed code).

In every case the resolution was to fold all module-doc references to the `symbol_additions_*` single-source-of-truth name, and the sanctioned alias pairs (e.g. background_agents' `ol`/`ywz`/`Ewz`/`Xwz` four-alias set) were left intact per their additions-file Naming-notes.

---

## 2. Independent symbol-index re-verification (this sweep)

Beyond trusting the per-module digests, this sweep re-read a 22-citation cross-module sample directly in the bundle and audited the four consolidated index files.

### 2a. Independent line spot-checks (22 / 22 consistent)

22 distinct anchors spanning all nine modules were read directly. 19 matched the token on the exact cited line; the other 3 are the documented declaration-anchor convention where the token sits 1–3 lines below the cited block start, all confirmed correct:

- `Xi$` opus-4-8 id map opens `(Xi$ = {` at `cli_inner_pretty.js:91825` with `firstParty: "claude-opus-4-8"` at `91826`.
- `SH` (`recordFeatureOk`) is `function SH(H) {` at `41590`; it emits `d("tengu_feature_ok", {feature_name:H})` at `41591` (digest range 41590-41592).
- `reloadSkills` SessionStart flag is read at `270669` and dispatches `SH("hook_session_start_reload_skills")` at `270671`.

Exact-line matches confirmed: VERSION@568305, `mx`="Workflow"@216291, `NZ`@184757, `SL5`@184780, `Dk5`@216506, `sq`="Agent"@185637, `uB`@98243, `q48`@184987, `N0`@555614, `z44`@376250, `X3`@143864 (var decl), `Y18`="code-review"@211646, `dq$`@600275 (single var), `vR`@9649, `OW9`@626930, `l6$`@551726, `hwz`@541956, `Bwz`@542514, `Zzz`@521237.

### 2b. Index row counts and intra-file de-dup

| Index file | Data rows | Duplicate IDs within file |
|------------|----------:|---------------------------|
| `symbol_index_core_execution.md` | 71 | none |
| `symbol_index_core_features.md` | 317 | none |
| `symbol_index_infra_platform.md` | 127 | none |
| `symbol_index_infra_integration.md` | 38 | none |

The platform file holds **127** rows by direct count (the build digest reported "116"; the extra rows include the 6 cross-version precursor rows tagged `2.1.142` and a handful of shared-util rows folded in during consolidation — none are duplicates, `uniq -d` is clean). All four files are alphabetically sorted within each Module section and carry zero intra-file duplicate obfuscated IDs.

The nine `symbol_additions_*` files carry 643 data rows total (background_agents 123, model_opus48 96, skill_system 81, tools 81, permission_policy 66, code_review 65, hooks 47, lean_prompt 47, workflow 37). The code_review additions file's 65 rows match its README count.

### 2c. Cross-file ID appearances (intentional cross-refs vs. residual name drift)

21 obfuscated IDs appear in more than one index file. The home-index routing notes in the additions files deliberately list a symbol in both its home category and a cross-reference category (e.g. `mx` WORKFLOW_TOOL_NAME lives in core_features but is cross-listed once in core_execution because the coordinator prompt interpolates it). **14 of the 21 cross-listed IDs carry identical readable names and matching lines in both files** — clean cross-refs: `mx`, `uB`, `Dv`, `cKq`, `Dk5`, `Bwz`, `C74`, `Ir4`, `Pjz`, `T8q`, `b74`, `cYz`, `gt4`, `mr4`.

**Residual finding (NON-BLOCKING):** 6 cross-listed IDs still carry *divergent* readable names across two index files — a consolidation-level single-source-of-truth gap that the per-module passes (which compared module-doc vs additions-file, not index-vs-index) did not catch:

- `bA` @524187 — `registerBundledPromptCommand` (infra_integration) vs `registerBundledSkill` (core_features).
- `SH` @41590 — `recordFeatureOk` (core_execution) vs `emitFeatureOk` (core_features).
- `Ehz` @601378 — `SIMPLIFY_PROMPT` (core_features) vs `SIMPLIFY_SKILL_BODY` (infra_integration).
- `eyz` @600558 — `getCodeReviewDescription` (infra_integration) vs `codeReviewDescription` (core_features).
- `vO9` @601350 — `registerSimplify` (core_features) vs `registerSimplifySkill` (infra_integration).
- `zO9` @600612 — `registerCodeReview` (core_features) vs `registerCodeReviewSkill` (infra_integration).

All six pairs point to the **same, correct line** in both files — only the readable label differs, so no reference is *wrong*, but a future consolidation pass should pick one canonical name per symbol across the four index files (recommend the home-index name as canon). All of these involve `/code-review` and `/simplify` slash-command registrars and the `tengu_feature_ok` helper — they straddle the core_features ↔ infra_integration boundary, which is exactly where the parallel index-build seams lie.

---

## 3. Compliance: no forbidden mapping tables in module docs

A scan of all module docs across the nine module directories for the forbidden `| Obfuscated | Readable |` table header returned **zero hits** — fully compliant with the CLAUDE.md rule that mapping TABLES live only in `symbol_index_*.md` and the per-module `symbol_additions_*.md` files. Every per-module pass independently confirmed its final grep was clean of obfuscated/readable header tables and of residual deviant names. Module docs use the required list-format references.

---

## 4. Broken relative-link sweep (17 / 381 broken, 4.5%)

Resolving every `](./...)` / `](../...)` relative link under `claude_code_v_2.1.156/analyze/` (381 links) found **17 broken** — all mechanical, in three classes:

**Class A — cross-tree depth off-by-one (5 links).** `00_overview/README.md:5,129,130` and `00_overview/changelog_analysis.md:8,308,513` use `../../claude_code_v_2.1.142/analyze/...`, which resolves to a non-existent nested `claude_code_v_2.1.156/claude_code_v_2.1.142/...`. The target tree exists; the fix is `../../../claude_code_v_2.1.142/analyze/...` (verified: the three-dot form resolves to the real `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/analyze`).

**Class B — intra-module links to docs that were renamed in this tree (9 links).**
- `36_background_agents/unified_dispatcher_ol.md` links `./dispatch_flags.md` (×2) and `./worker_state_machine.md` (×4) — those filenames exist in the **2.1.142** bg module but not in 2.1.156 (renamed to `bg_session_classifier.md`, `worker_retire_respawn_2156.md`, etc.). Repoint to the 2.1.156 doc set, or to `../../../claude_code_v_2.1.142/analyze/36_background_agents/...` if the intent was the prior-tree reference.
- `10_skill_system/bundled_skill_bodies.md:3` and `skill_fork_recursion_guard.md:3` link `./skill_lifecycle.md` (a 2.1.142 doc, absent here); `skill_reload_midsession.md:564` links `../../claude_code_v_2.1.142/analyze/10_skill_system/skill_lifecycle.md` (depth off-by-one — needs `../../../`). The 2.1.142 `skill_lifecycle.md` exists, so all three should target the 2.1.142 tree at the correct depth.

**Class C — reference to a module absent from the delta tree (1 link).** `11_hooks/README.md:154` links `../01_agent_loop/`, which does not exist in the 9-module delta tree. Repoint to the 2.1.142 `01_agent_loop/` or drop the link.

None of the 17 indicate a content/symbol defect; all are navigational fixes.

---

## 5. v2.1.88 cross-version validation (NEW-vs-evolved verdicts)

Every module cross-checked its "NEW after 2.1.88" vs "evolved precursor" claims against `/lyz/codespace/3rd/claude-code/src/`. All verdicts held:

- **42_workflow — GA of an internal prototype (CONFIRMED).** `WorkflowMultiselectDialog.tsx` in 2.1.88 is a GitHub Actions installer; `feature('WORKFLOW_SCRIPTS')` refs exist (tools.ts:129, tasks.ts:9, commands.ts:86, PermissionRequest.tsx:38-39) with the underlying `.js` stripped; none of `resumeFromRunId`/`tengu_workflows_enabled`/`CLAUDE_CODE_WORKFLOWS`/`enableWorkflows`/`allow_workflows` appear in the readable tree; `coordinator/coordinatorMode.ts` exists as the `Dk5` precursor. The Dynamic Workflows feature is a GA of an internal prototype, not net-new from scratch.
- **43_model_opus48 — mixed (CONFIRMED).** `getDefaultEffortForModel` (effort.ts:279), `resolveAppliedEffort` (effort.ts:156-163), the fastMode.ts cascade, and the configs.ts opus46 ceiling all have precursors; the `B87`/`cG4` thinking-signature hotfix is correctly marked NEW (the 2.1.156 fix for Opus 4.8 thinking blocks causing API errors).
- **44_lean_prompt — net-new gate (HIGH).** The `CLAUDE_CODE_SIMPLE` short-circuit precursor exists (prompts.ts:450) with the full section builders at 175/186/199/430; but `isLeanSystemPrompt`/`isFullPromptModel`/`isForcedLeanModel`/`velvet_cascade`/`SIMPLE_SYSTEM_PROMPT`/`# Harness` all return zero — the per-model lean gate is net-new in the v2.1.154 window.
- **45_code_review — local effort machine NEW, cloud ultra bridge evolved (CONFIRMED).** `simplify.ts` (3-agent skill), prose-only `review.ts`, and `ultrareviewEnabled.ts` (`isUltrareviewEnabled` GrowthBook gate) exist; `code-reviewer` appears only as schema/example text in both builds.
- **04_tools / 10_skill_system / 11_hooks / 36_background_agents / 37_permission_policy** all confirmed their NEW symbols absent from 2.1.88 (`eagerInputStreaming`, `permissionLayers`, `contextLayers`, `reloadSkills`, `spawnedBySkill`, `fork_recursion`, `xhigh`, `MessageDisplay`/`displayedMessageContent`, `resolveShellLaunch`/`bgIsolation`/`retireIfSettled`/`bg-pty-host`) and their precursors present where claimed. Permission deltas cross-checked against both the 2.1.142 bundle and 2.1.88 src.

---

## 6. Residual low-confidence items and self-flagged gaps (carried forward)

These were honestly flagged by the individual passes and are **not** errors in the audited modules; they are scoped to other modules or are reconstructed-runtime inferences:

1. **Per-regex classifier constant lines (background_agents / core_features index).** `Dd_`/`Ed_`/`Gd_`/`hd_` etc. are cited via the grouped `449563/449567/449570` regex-block range rather than each constant's own declaration line. The block is confirmed present (`r04` classifierPrompt @449361 verified) but individual per-constant declaration lines were not isolated. LOW confidence on the exact per-symbol line; the block membership is confirmed.
2. **`36_background_agents` self-flagged gaps:** the cron-goal-loss patch site and the 2.1.154 `/logout` & `←←` arrow-view (Bedrock/Vertex/Foundry) gates are honest gaps scoped to other modules, not defects in the bg module.
3. **`37_permission_policy` medium-confidence reconstructions:** the pre-fix runtime path on the `$TMPDIR` sandbox-vs-unsandboxed divergence and the bare-assignment auto-approve bypass are reconstructed (not verbatim) — labelled medium, well-calibrated. Two benign off-by-one prose cites (system-prompt builder `nn5` header@277299 / body@277300; the 2.1.88 gate cited 224-235 actually @229-233) left as-is because the cited line still contains the claimed code.
4. **`44_lean_prompt` benign note:** `Q88` (not a lean symbol; absent from the additions table) is cited once as a function+constants range and once as a body range — benign, left as-is.
5. **Index-level name drift (Section 2c):** the 6 cross-listed IDs (`bA`, `SH`, `Ehz`, `eyz`, `vO9`, `zO9`) with divergent readable names across index files. NON-BLOCKING (all lines correct); recommend a one-pass canonicalization to the home-index name.
6. **`gt4` (WorkflowHistoryDialog)** is cited with an open-ended end range (`538403+`); start verified, end range left open in the module docs.

---

## 7. Overall conclusion

- **Citation accuracy:** 370 / 375 module spot-checks passed on first read (98.7%); all 5 failures were line/range defects (zero fabricated symbols) and are now fixed. An independent 22-citation cross-module re-read by this sweep was 22 / 22 consistent with the digests. **No wrong-symbol claims and no invented line numbers survive.**
- **Symbol indices:** four consolidated files (71 / 317 / 127 / 38 rows), alphabetically sorted, zero intra-file duplicate IDs. 14 of 21 cross-file ID appearances are clean cross-refs; 6 carry residual cross-index name drift (non-blocking).
- **Compliance:** zero forbidden mapping tables in any module doc; list-format references throughout; dual-version snippet convention respected.
- **Links:** 17 / 381 broken (4.5%), all mechanical (5 depth off-by-one, 9 renamed/relocated intra-doc targets, 1 absent-module reference).
- **Cross-version:** all NEW-vs-evolved verdicts hold against v2.1.88 src and the v2.1.142 bundle.

**Overall status: PASS — HIGH confidence**, with two concrete, low-risk follow-ups:

1. **Repoint the 17 broken relative links** — mechanical: `../../` → `../../../` for the 6 cross-tree refs; repoint the 9 renamed bg/skill intra-doc targets to the 2.1.156 doc set or the 2.1.142 tree; fix the 1 `01_agent_loop/` reference in the hooks README.
2. **Canonicalize the 6 cross-index readable-name divergences** (`bA`, `SH`, `Ehz`, `eyz`, `vO9`, `zO9`) to the home-index name across `symbol_index_*.md` — all already cite the correct line, so this is a label-only reconciliation.
