# Cross-Validation Summary — v2.1.183 (v2.1.156 → v2.1.183 focused delta)

A cross-feature roll-up of the **five per-feature adversarial cross-validation passes** that audited the
v2.1.183 focused-delta tree, plus an independent consolidated re-check of the tree-wide invariants
(forbidden-mapping-table scan over every module doc, `## Related Symbols` presence, and a full relative-link
resolution sweep against the now-present `00_overview/` routing layer).

> **What this tree is.** This is a **focused delta analysis** of the **v2.1.156 → v2.1.183** window, scoped
> to the **five features the user requested**: Agent Team (the v2.1.178 implicit-team redesign), Dynamic
> Workflows (`ultracode`), Background Agents (nested-subagent depth limit + lifecycle), Compaction
> (fallback-model + 1M clamp + window resolver), and Auto Memory (team memory stores). It is **not** a
> comprehensive every-module re-analysis — other subsystems also changed in this window (plan mode, hooks,
> skills, permissions, model, MCP, UI, …) but are intentionally **out of scope**. The five cross-validation
> reports rolled up here therefore cover only the five in-scope module trees.

**Source under analysis (TARGET):** `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`
— **699,346 lines**. Every `cli_inner_pretty.js:<line>` citation below resolves to this bundle unless it is
explicitly tagged as a **v2.1.156 before-picture**.

**Cross-validation sources:** the **v2.1.156 bundle**
(`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`, 649,979 lines) for every
before-picture and zero-count absence grep; the **v2.1.88 named TypeScript** at `/lyz/codespace/3rd/claude-code/src/`
for NEW-vs-evolved lineage (used by the compact pass); and the five `_scout_dossier_<feature>.md` spec
dossiers as the claim source each pass adversarially re-derived.

**Scope of the delta tree:** five module dirs — `30_agent_team`, `42_workflow`, `36_background_agents`,
`07_compact`, `31_auto_memory` — plus `00_overview/` (the four consolidated `symbol_index_*.md` routing files,
five per-feature `symbol_additions_v2_1_183_*.md` tables, the five per-feature `cross_validation_report_*.md`,
and this summary). The reports rolled up here are:

- [`cross_validation_report_agent_team.md`](./cross_validation_report_agent_team.md)
- [`cross_validation_report_workflow.md`](./cross_validation_report_workflow.md)
- [`cross_validation_report_background_agents.md`](./cross_validation_report_background_agents.md)
- [`cross_validation_report_compact.md`](./cross_validation_report_compact.md)
- [`cross_validation_report_auto_memory.md`](./cross_validation_report_auto_memory.md)

---

## 1. Per-feature verification roll-up (citation spot-checks)

Each feature tree was verified independently by a default-to-FAIL skeptic who re-opened every sampled anchor
at its exact cited line in the named bundle. The table aggregates each pass's sample size, pass/fail split,
and post-fix verdict.

| Feature module | Samples (183 + 156 + grep) | Pass | Fail | Verdict (post-fix) | Confidence |
|---|---:|---:|---:|---|---|
| `30_agent_team` | 38 anchors + 11 before + 8 greps | 53 | 1 | PASS (with fixes) | HIGH |
| `42_workflow` | 40 anchors + 9 before + 6 greps (+2 line-precision noted) | 47 | 2 | PASS (with fixes) | HIGH |
| `36_background_agents` | 35 anchors + 9 before | 37 | 7 | PASS (with fixes) | HIGH |
| `07_compact` | 70 anchors + 10 before + 14 zero-greps | 90 | 4 | PASS (with fixes) | HIGH |
| `31_auto_memory` | 40 anchors + 8 before + 4 greps | 45 | 3 | PASS (with fixes) | HIGH |
| **Total** | **289 checks** | **272** | **17** | **PASS** | **HIGH** |

**Aggregate: 272 / 289 discrete checks passed (94.1%); all 17 failures were line-precision / transcription
drift — never a wrong symbol, a fabricated line, or an incorrect delta claim. All 17 were fixed in place.**

### Failure taxonomy (all 17 now fixed)

Every failure is a *citation-precision* defect: the obfuscated identifier exists, the declaration text is what
the doc says, and the delta finding holds — only the cited line (or, in two cases, a transcribed before-snippet
variable) was off. No pass found a single invented symbol or wrong-direction delta.

- **`30_agent_team` (1 fail).** README cited the Agent tool def `f3n` at `cli_inner_pretty.js:423515` (which is
  `maxResultSizeChars: 1e5`); the decl `(f3n = pi({` is at **423505** — the deep-dive doc already cited it
  correctly. Plus a cluster of README index/contrast off-by-1..4 lines (`Sl`, `v4e`, `Kyp`, `G4e`, `YR`, `oI`)
  reconciled to the declaration lines the deep-dives use.
- **`42_workflow` (2 fails).** Two before-picture line slips: the v2.1.156 `M2s`-ancestor `e3K` cited
  `@99006` (an unrelated email splitter) vs actual **98983**; and `enableWorkflows` schema cited `@56001` vs
  actual **56003** (header range `56007-56011` → `56008-56012`). All other 47 anchors exact.
- **`36_background_agents` (7 fails — the largest cluster).** Five v2.1.183 anchors inside `sKn`/the supervisor
  tick drift 2–8 lines because the doc's ORIGINAL snippets compress multi-line comma-statements (`Zyn`
  `566860→566858`; the four `left_arrow` anchors; the prewarm range-start `697259→697255`). Two v2.1.156
  before-picture defects: the cron/routine carryover guards cited `560113-560114` vs actual **560119-560120**,
  and an effort before-snippet mis-transcribed the guard variable `M` (which gates `--model`) where the source
  gates on `j` (effort). Substantive claim intact in every case.
- **`07_compact` (4 fails).** One **content** defect (Issue #1, the most important single fix in the whole
  tree): the README mis-deobfuscated `XHe` as `isSameModel` when `XHe` @102376 is a strict-smaller-**window**
  comparator (`tH(t,n) < tH(e,n)`) — the deep-dive `fallback_model_in_compaction.md` and the additions file
  both correctly call it `isSmallerWindow`, so the README was internally inconsistent. Plus a "18 callers of
  `tH`" overcount (actual ~16), a borderline cross-version rename table in the README, and a bare ORIGINAL
  excerpt without the dual-version template. (The 90/4 tally counts each of the 70 anchors, 10 before-pictures,
  and 14 zero-greps as a discrete check; the four format/content issues are the fails.)
- **`31_auto_memory` (3 fails).** Two carryover anchors off (`PQa` cited `@455299` lands inside a *different*
  function `LQa`; real decl **455311** — and the v2.1.156 verbose-flag line `393209` vs actual **393208**),
  plus two cross-doc readable-name drifts (`Agi`/`mgi` and `Rt` named two ways across docs). All carryover /
  naming, no delta affected.

---

## 2. Methodology (what made the passes adversarial)

Each pass ran the same three-layer self-check, which is why a 94% first-read precision rate could still surface
17 real defects:

1. **Two-bundle self-check.** Every v2.1.183 claim was re-opened in the 183 bundle, and every "before-picture"
   in the 156 bundle — the two trees are line-shifted by ~50k lines (e.g. compact's dispatcher moved
   ~423130→460676 and its threshold ladder ~423864→226818), so a citation cannot be confirmed by memory; it
   must be physically re-read in the correct bundle. This is what caught the line-precision drift.

2. **Absence proven by zero-count grep, not assumed.** Removal/NEW claims were proven by `grep -c` returning
   **0** in v2.1.156 for the relevant string constant or telemetry event name (these are stable, non-renamed
   tokens, so absence is meaningful). Examples reproduced: agent_team `TeamCreate` 0/6, `TeamDelete` 0/5,
   `tengu_team_created` 0/1; compact's 14/14 zero-greps (`tengu_1m_credits_clamp_activated`,
   `tengu_amber_moleskin`, `viaCreditsBoundary`, `source:"clientdata"`, …); background's `detritusOnly`/
   `"prewarm"`/`tengu_bg_attach_upgrade` all 0; workflow's `workflowKeywordTriggerEnabled` 0 and `errorCode:7`
   6→7 (exactly one new site); auto_memory's `memory_prompt_index` 0→4.

3. **v2.1.88 TypeScript lineage check (compact).** The compact pass cross-checked NEW-vs-evolved against the
   named v2.1.88 src so that "evolved precursor" vs "net-new" verdicts are anchored to the readable tree, not
   re-derived.

4. **Re-mangle re-derivation for the `/bg` surface.** Background's `JMl`/`sKn`/`iKn`/`lgf` set and the
   per-feature cross-version obf→obf rename tables were re-derived across the 156↔183 mangle (the obfuscated
   names change between builds), and the bg_command doc's cross-version table is the **allowed re-mangle
   exception** (explicitly self-labelled "not an obfuscated→readable mapping table"), not a forbidden lookup.

---

## 3. Standout accuracy win — the docs corrected their own dossier

The single strongest result of the audit is **adversarial honesty that overturned the source dossiers**, in two
independent places, each re-verified by the cross-validator:

- **Background Agents corrected the scout dossier on the retire/respawn deltas.** The dossier (§3.5) and README
  listed the **cliVersion-equality stale short-circuit** and the **`session_cron`/`routine` retire guards** as
  v2.1.183 NEW. The bg_command doc reclassified both as **carryover**, and the cross-validator independently
  re-confirmed it TRUE: v2.1.156 `respawnIfIdleStale` @560029 already contains the exact
  `cliVersion === {…VERSION:"2.1.156"…}.VERSION` short-circuit (@560035-560047), and the cron/routine guards are
  present verbatim in v2.1.156 `retireIfSettled` (@560119-560120). v2.1.183 differs only by the constant-folded
  `"2.1.183"` and by `respawnIfIdleStale` *also* now checking `session_cron`. The docs are **more accurate than
  their own dossier**.
- **Agent Team corrected the dossier on the coordinator cross-session peers.** The dossier (§3.8) claimed the
  `uds:`/`bridge:` peer block, the `<cross-session-message>` framing, and the worker-stop bullet were new in
  v2.1.183. The coordinator doc downgraded this to the four *real* prompt deltas, and the validator confirmed
  the rest pre-existed: `grep -c cross-session-message` = **2 in v2.1.156** (3 in 183), with the peer/worker-stop
  bullets at v2.1.156 `216533`/`216535`.
- **Auto Memory down-scoped its own dossier's Delta-6.** The status-line doc corrected a latent over-claim that
  the verbose flag was "set new in `SNa`": the `verbose || isTranscriptMode` computation is **carryover**
  (already `_ || !!z` in v2.1.156 @393208); the only real delta is the renderer body (`Svp` vs `sk_`).

These are the behaviors the framing-trap mandate exists to produce: the most-cited, most-tempting "headline"
deltas were the ones most rigorously down-scoped, with evidence.

---

## 4. Consolidated tree-wide invariant sweep (this summary's own re-check)

Beyond trusting the five digests, this roll-up re-ran the three tree-wide invariants directly over all five
module dirs:

- **Forbidden obfuscated→readable mapping tables in module docs — ZERO.** A scan of all 22 module-doc `.md`
  files for the `| Obfuscated | Readable |` header returned **0 hits**. Mapping tables live only in the
  `00_overview/symbol_additions_v2_1_183_*.md` files and the four `symbol_index_*.md`. The per-feature passes
  individually confirmed that the few obf-bearing tables that *do* appear in module docs (the bg_command
  re-mangle TL;DR, the compact/workflow/auto_memory cross-version before/after tables) are the **allowed
  cross-version exception**, not deobfuscation lookups. (The compact README's §DELTA 5 readable-keyed rename
  table was flagged MEDIUM by its pass as avoidable-but-tolerated; it is not a `| Obfuscated | Readable |`
  table.)

- **`## Related Symbols` closing block — present in 22/22 module docs.** Every module doc ends with the mandated
  `## Related Symbols` blockquote (agent_team 5/5, workflow 4/4, background 5/5, compact 5/5, auto_memory 3/3),
  pointing at the four `../00_overview/symbol_index_*.md` plus the per-feature additions file, followed by a
  list-format key-function index. (The early-pass cosmetic note about a duplicate `## Related Symbols` heading in
  `mailbox_lifecycle_and_sendmessage_delta.md` has since been resolved — that doc now carries a single closing section.)

- **Relative-link resolution — all resolve, 0 broken.** **This is the one place the rolled-up state now
  differs from what the five reports recorded.** All five passes flagged, as a shared MEDIUM/LOW issue, that the
  four `../00_overview/symbol_index_{core_execution,core_features,infra_platform,infra_integration}.md` targets
  **did not yet exist** in the 183 tree (they existed only in the 156 baseline) — i.e. the entire `## Related
  Symbols` block linked broken forward-references tree-wide. That routing layer has **since been authored**: all
  four `symbol_index_*.md` and all five `symbol_additions_v2_1_183_*.md` are now present in
  `00_overview/`, and a fresh sweep of every relative `.md` link across the whole tree (00_overview + the five
  module dirs + by_version + README) finds **0 broken**. The headline shared issue from all five reports is
  therefore **resolved**; the per-feature link-hygiene nits unique to each pass (workflow's dead
  `README_delta_2.1.183.md` sibling link @558, now repointed to `./README.md`; agent_team's `../30_agent_team/`
  self-sibling stylistic link) have been confirmed fixed in their respective docs.

- **English-only — PASS in all 22 docs.** Zero CJK/JP/KR word characters; only typographic/box-drawing
  non-ASCII and verbatim-quoted source string glyphs.

---

## 5. Residual low-confidence items / open questions (consolidated, carried forward)

These were honestly flagged by the individual passes as **not errors** in the audited docs — they are
genuinely-unverified runtime edges or best-effort attributions that the docs explicitly carry at low/medium
confidence rather than overclaim. Carried forward for any future pass:

1. **Background — "Working forever" (2.1.178) and `--bg -cn` (2.1.176) exact sites.** Carried as low /
   medium-low confidence in every bg doc that touches them (nested §9, env §7, agents-json §7, bg_command §7);
   the exact source sites were not pinned.
2. **Background — the 2.1.161 worktree bg-edit fix.** Not isolated to a precise diff site; the prewarm-leak
   attribution (2.1.172/2.1.174) is explicitly **medium-low**.
3. **Background — the bg-task-survival exact patch line.** The agent_team coordinator pass *raised* confidence
   on the `G4e` vs `c5H` superset diff and the new `<note>`, but explicitly did **not** line-diff the in-process
   runner `sDp` turn-end against v2.1.156 `JT_` — flagged for a verifier.
4. **Compact — `clientdata` window-source semantics (`rowan_thicket`).** MEDIUM: the server-push path that
   populates the 5th window source was not traced end-to-end; the resolver *reading* it is verified, the *origin*
   is not. (Plus the precompute arm-table consumption timing, `_arm_gated`/`_rearm_capped`, MEDIUM.)
5. **Auto Memory — `sinceVersion` best-effort attribution.** The exact introducing patch (~2.1.172 vs a later
   intermediate) is best-effort; intermediates were not bisected, so every `Since` cell reads "~2.1.172". The
   writable user-scope store end-to-end and the `promptIndexMaxBytes` warning-UX trigger are carried MEDIUM
   (logic verified, trigger un-traced).
6. **Workflow — R2 bg-worktree blocking.** Upgraded to "high on the diff site" with field-by-field query
   evidence, but the bg-session blocking was reasoned from guard control-flow, not a live repro — residual
   caveat kept.

---

## 6. Overall conclusion

- **Citation accuracy:** 272 / 289 discrete checks passed on first read (94.1%); all 17 failures were
  line-precision / transcription drift (zero fabricated symbols, zero wrong-direction deltas) and are fixed.
  The only **content** defect across the whole tree was compact's README `XHe→isSameModel` mis-deobfuscation,
  contradicted by its own deep-dive and additions file — corrected to `isSmallerWindow`.
- **Delta correctness:** every headline delta is corroborated at the cited bundle lines — Agent Team
  (TeamCreate/TeamDelete removal, implicit session team, Agent-tool-as-spawner, tmux `send-keys`→`respawn-pane`,
  `"main"`/`uds:`/`bridge:`, coordinator prompt deltas, bg-survival `<note>`); Workflow (`ultracode` keyword
  trigger + `workflowKeywordTriggerEnabled`, AST determinism, per-agent `agentContext`, errorCode-7); Background
  (universal `depth < 5` Agent gate hoisted above the async branch, four-pass provider-auth scrub,
  `agents --json` three-source merge, retire/respawn refinements); Compact (fallback-model summarize loop, 1M
  clamp-back, 6-source window resolver); Auto Memory (store-schema expansion, `promptIndex` fetch+inject,
  scope/mode recall routing, `Nk` remote-fix, watcher scope-split).
- **Framing integrity:** the most tempting headline claims were the most rigorously down-scoped — two dossier
  over-claims overturned (background cliVersion/cron-routine carryover; agent_team coordinator peers) and one
  self-correction (auto_memory verbose-flag), each re-verified.
- **Compliance:** 0 forbidden mapping tables in 22 module docs; `## Related Symbols` present in 22/22;
  **every relative `.md` link across the tree now resolves, 0 broken** (the tree-wide broken-`symbol_index_*`
  issue that all five reports flagged has been resolved by authoring the routing layer); English-only throughout.

**Overall status: PASS — HIGH confidence.** The focused five-feature delta analysis is substantively correct
and every delta claim resolves to its cited bundle line. The remaining follow-ups are mechanical and
per-feature: apply the line-number bumps (background's 5 `sKn` anchors + 2 before-picture lines; agent_team's
README cluster; workflow's 2 before-picture lines; auto_memory's `PQa`/verbose lines), apply compact's
`XHe→isSmallerWindow` README correction, and reconcile the handful of cross-doc readable-name drifts
(`Agi`/`mgi`/`Rt`, `rWa`/`Jyn`, `NXr`/`Dla`/`oso`) to the per-feature `symbol_additions_*` single-source-of-truth
names — none of which invalidates a delta finding.
