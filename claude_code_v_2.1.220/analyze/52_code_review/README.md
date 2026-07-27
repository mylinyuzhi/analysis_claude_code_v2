# 52_code_review — Review and research commands (2.1.193 → 2.1.220)

**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js`
(872,596 lines). **Baseline:** `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
(718,679 lines), always tagged `(193)` when quoted.

Conventions: [`../_CONVENTIONS.md`](../_CONVENTIONS.md).
Hand-verified anchors and the trap list: [`../_GROUND_TRUTH_verified_anchors.md`](../_GROUND_TRUTH_verified_anchors.md).
Carryover register: [`../00_overview/_false_delta_ledger.md`](../00_overview/_false_delta_ledger.md).

Scope: the `/code-review`, `/review`, `/ultrareview` (`/code-review ultra`) and `/deep-research`
surfaces. The `ReportFindings` **tool object** belongs to
[`../04_tools/`](../04_tools/tool_surface_delta_220.md); this module owns only how the review
pipeline *uses* it.

---

## The window's story for this theme, in one paragraph

Eighteen bullets across ten releases, and they resolve into three independent stories plus one that
nobody wrote down.

1. **The `/ultrareview` precondition function was rewritten from 123 lines to 422.** Eight bullets
   (`.212` ×4, `.214` ×1, `.216` ×2, `.218` ×1) all land inside one function, `PFo`
   (`:496639-497060`), whose 2.1.193 predecessor `Aer` (`:537008-537130 (193)`) sits right there for
   comparison. Every one of the eight is a *recovery path* bolted onto a refusal that used to be
   terminal: a PR reference gets normalised instead of rejected, a missing branch gets fetched from
   origin or typo-corrected, a missing merge base falls back to git's empty tree, a descriptive
   sentence becomes a note. The new `{reason, method, outcome}` recovery telemetry
   (`tengu_review_remote_precondition_recovery`, **220=13 / 193=0**) exists to measure precisely how
   often each guess is right.
2. **`/code-review` moved out of the conversation.** `.218` added a *dynamic* `getContext(args, ctx)`
   field to the slash-command schema — the whole field is new (`context ?? "inline"` is 220=1/193=0)
   — and `/code-review` is its first user, returning `"fork"`. Forked commands now default to running
   as a background agent (`qTo`, `:342396`, `e.background ?? !0`), and a three-term guard at
   `:343681` stops the stacked-slash-command parser from eating the review target.
3. **Expensive model-initiated work was progressively restrained**, with five different mechanisms
   across `.202` → `.215` → `.218`, three of which are remotely reversible and two of which are not.
   [`manual_invocation_gating.md`](manual_invocation_gating.md) tabulates the oscillation; the design
   signal is that the `.215` restraint (`disableModelInvocation` on `/verify` and `/code-review`) is
   hard-coded while `.218`'s deep-research restraint ships with a gate.

And the undocumented one: **the review workflow's verifier was re-architected in the same release as
the documented finder merge.** `.196`'s bullet mentions only "merged five cleanup finders into one,
cutting token usage by roughly 25 %". The same diff replaced one-verifier-per-candidate with
one-verifier-per-(file, line) location behind a barrier (`verifyGroups` 220=3/193=0), which the code's
own comment says cuts verifier count by "~40 % at p50". The two changes pay for each other — the
barrier costs latency, the four fewer finders refund it — which is why they had to ship together, and
only one of them got a bullet.

---

## Documents

| Doc | Covers | Bullets |
|---|---|---|
| [`code_review_background_subagent.md`](code_review_background_subagent.md) | `getContext → "fork"`, the background-fork default and its three degradations, the stacked-command carve-out, cloud-vs-local routing and the new non-interactive `ultrareview` command, the Scope→Find→Verify→Sweep→Synthesize workflow with its effort parameterization, the `.196` finder merge + the undocumented group-verify, per-model prompt cells (`.206`), and how `ReportFindings` is consumed | `.196` ×1, `.206` ×1, `.218` ×2 |
| [`ultrareview_argument_handling.md`](ultrareview_argument_handling.md) | the `PFo` precondition state machine line by line: PR normalisation, `pr_url_wrong_repo`, origin fetch + Levenshtein branch suggestion, the git empty-tree fallback, descriptive-argument notes, the `reason` field and transcript feedback, diff-too-large / empty-diff message detail, the Desktop folder hint, and the per-conversation billing latch | `.212` ×4, `.214` ×1, `.216` ×2, `.218` ×2 |
| [`manual_invocation_gating.md`](manual_invocation_gating.md) | the restraint oscillation table, the `.202` `/review` revert proven by the removal of `${Hzn}`, `disableModelInvocation`'s exact set difference, deep research's two independent `.218` gates, the three-way verifier outcome (`.196`), and the Fetch-chip hostname trust ladder (`.207`) | `.196` ×1, `.202` ×1, `.207` ×1, `.215` ×1, `.218` ×1 |

New symbols are staged in
[`../00_overview/symbol_additions_v2_1_220_code_review.md`](../00_overview/symbol_additions_v2_1_220_code_review.md)
for merge into `symbol_index_core_features.md` and `symbol_index_infra_integration.md`.

---

## Per-bullet ledger

All 18 changelog bullets in this theme. `Verdict` uses the tree's vocabulary: **NET_NEW** (literal
220>0 / 193=0 and the mechanism is new), **DELTA** (the mechanism existed; a specific site changed),
**CARRYOVER** (no client-side change found), **SERVER_SIDE**, **UNANCHORED**.

| # | Rel | Bullet (abridged) | Verdict | Anchor (2.1.220) | Doc section |
|---|---|---|---|---|---|
| 1 | `.196` | `/code-review` workflow: merged five cleanup finders into one, ~25 % fewer tokens | **DELTA** | header `:424055-424062` vs `:443425-443429 (193)`; merged descriptor `:424278-424283`; `CLEANUP_TEXT` 220=2/193=0, `CLEANUP_ANGLES` 220=0/193=2 | background_subagent §3.1 |
| 2 | `.196` | `/deep-research` misreporting verifier failures as "all claims refuted" instead of `unverified` | **NET_NEW** | `:424757-424794` vs `:443995-444023 (193)`; `claims refuted` 220=2/193=1; comment cites `go/ccissue/69883` | gating §5 |
| 3 | `.202` | `/review <pr>` back to a fast single-pass review; `/code-review <level> <pr#>` for multi-agent | **DELTA** | prompt `:497600-497628` vs `:538510-538538 (193)`; `${Hzn}` and `effort: "medium"` both removed | gating §2 |
| 4 | `.206` | Improved `/code-review` findings quality on `claude-opus-4-8` across all effort levels | **DELTA — client-side** (scoping said SERVER_SIDE; **corrected**) | `cMr` per-model cell table `:774655-774678`; `o48-low-v1` 220=2/193=0; `measuredExternal` 220=8/193=0; 193's flat table `:650897 (193)` | background_subagent §4.2 |
| 5 | `.207` | Deep research labelling every Fetch-phase agent "unknown" — chips show the source hostname | **DELTA** | `:424593-424604` + `:424696-424703` vs `:443938-443941 (193)`; `URL` constructor replaced by regex + 4-condition trust ladder | gating §6 |
| 6 | `.212` | `/ultrareview` rejecting `#123`, `PR 123`, pasted PR URLs; errors name your command | **NET_NEW** | normaliser `:496649-496651`; `pr_arg_normalization` 220=1/193=0; `pr_url_wrong_repo` 220=2/193=0 | argument_handling §1 |
| 7 | `.212` | `/ultrareview <branch>` not fetching from origin; suggests closest branch on typos | **NET_NEW** | `JI_` `:497074-497130`, `QI_` `:497131-497159`; `fetch_retry` 2/0, `branch_suggestion` 1/0 | argument_handling §2 |
| 8 | `.212` | `/ultrareview` skipping the billing confirmation in a new conversation after `/clear` | **NET_NEW** | `ultrareviewOverageConfirmed` 220=11/193=0; reset manifest `:448580-448596`; 193's process-lifetime `var SOo` `:537358 (193)`; `_resetOverageConfirmedForTests` 220=0/193=1 | argument_handling §7 |
| 9 | `.212` | `/ultrareview` "not a git repository" on Claude Desktop suggests the repo folder | **DELTA — one sentence** | `y7d()` `:497507-497511`, called at `:496646` and `:497194`; 193 hard-codes the terminal text at `:537014` / `:537164 (193)` | argument_handling §6 |
| 10 | `.214` | `/ultrareview` refusing repos with no merge base; now offers all tracked files | **NET_NEW** | `kWs = "4b825dc…"` `:497523` 220=1/193=0; `empty_tree_bundle` 6/0; `empty_tree_fallback_enabled` 1/0; `bundleForceScope` 2/0 | argument_handling §3 |
| 11 | `.215` | Claude no longer runs `/verify` and `/code-review` on its own | **DELTA — existing flag, new subjects** | `disableModelInvocation: !0` 220=13/193=8; `verify` `:789551`, `code-review` `:774588`; neither present in 193's set | gating §3 |
| 12 | `.216` | `/ultrareview` diff-too-large error shows limits, measured size, largest files | **NET_NEW** | `g7d` `:497061-497070`; `Largest files:` 220=1/193=0; message `:497039` vs `:537125 (193)` | argument_handling §5.1 |
| 13 | `.216` | `/code-review ultra` empty-diff message names the exact base ref | **NET_NEW** | `:497013` (names `${b}` and merge-base short SHA) vs `:537107 (193)`; new telemetry `used_origin_ref` / `had_explicit_base` `:497004-497005` | argument_handling §5.2 |
| 14 | `.218` | `/code-review` runs as a background subagent; stacked slash commands stay its review target | **NET_NEW** | `getContext` `:774594` (absent at `:650844-650856 (193)`); resolver `:326547`; `Running in the background as` 220=2/193=0; stacking guard `:343681`, `:343856-343866` | background_subagent §1 |
| 15 | `.218` | `/ultrareview` failing on descriptive arguments; text applied as a note to the findings | **NET_NEW** | classifier `:496762-496801`; `reviewInstructions` 7/0; `read as a note, not a base branch` 2/0; `recorded at launch time` 1/0 | argument_handling §4 |
| 16 | `.218` | `/code-review ultra` silently running a local review in non-interactive sessions | **NET_NEW** | second `ultrareview` command object `:497657-497668` (`supportsNonInteractive: !0`, `isEnabled: () => yn() && dee()`); `tengu_review_remote_gate_blocked` `:497402` 220=1/193=0. **The warning branch at `:343323` is carryover** (`:397841 (193)`) | background_subagent §2.2 |
| 17 | `.218` | Improved `/ultrareview` error feedback so Claude can correct an invalid argument | **NET_NEW** | `reason` field on all ten `PFo` failure returns; `Ultrareview did not launch:` `:844960` 220=1/193=0 | argument_handling §4.3 |
| 18 | `.218` | `/deep-research` starts only when invoked manually | **NET_NEW ×2** | registration third arg `:424879` (absent `:444099 (193)`); `MJy` `:424445-424448`; `tengu_sorrel_avocet` `:424888` 220=1/193=0; **plus** `Kep` `:508111-508115` + `ZXn` `:118700` | gating §4 |

**Nothing in this theme is CARRYOVER at the bullet level, and nothing is UNANCHORED.** Two bullets
(#9, #11) are narrow deltas on existing mechanisms and are labelled as such rather than as
introductions; one (#16) is half carryover and the half is called out in the row.

---

## Undocumented deltas found while reading (no changelog bullet)

| Finding | Verdict | Anchor |
|---|---|---|
| Verifier merged from one-agent-per-candidate to one-agent-per-(file, line), behind a new barrier | **NET_NEW** | `verifyGroups` 220=3/193=0 `:424252`; `GROUP_VERDICT_SCHEMA` 2/0; `group-by-location` 1/0; 193's per-candidate `verifyCandidate` `:443560 (193)` |
| Finder path canonicalisation by longest-suffix match against the Scope agent's file list | **NET_NEW** | `canonFile` 220=2/193=0 `:424216-424224` — a prerequisite for grouping to be correct at all |
| `claude-opus-5` review cells (`o5-bmin`) and the `Unm` re-report suppression for them | **NET_NEW** | `o5-bmin` 220=4/193=0 `:774672-774673`; `y && !A` gate `:774433`, `:774445` |
| `tengu_code_review_routed` payload grew from 6 to 13 fields | **DELTA** | `:774406-774420` vs `:650760-650767 (193)`; new: `uses_report_findings_tool`, `publishes_artifact`, `low_variant`, `model_family`, `finder_budget`, `agent_tool_available`, `threaded_effort` |
| Effort cells gained an `Agent`-tool-unavailable single-pass fallback | **NET_NEW** | `cNs` `:423628`; tags at `:423847`, `:423879`, `:423916`; also applied to `/simplify` `:788479` |
| Git hardening across the ultrareview precheck: `--end-of-options`, `--no-ext-diff --no-textconv`, `Sl` safe flags, `GIT_ALLOW_PROTOCOL`, `credential.helper=`, `core.askPass=`, `BatchMode=yes` | **NET_NEW** | `end-of-options` 220=5/193=0 (`:496758`, `:497093`, `:497121`); 193's precheck used raw `$n(yo(), [...])` with no flags |
| `cwd_is_home` on every precondition-failure event | **NET_NEW** | `Z7()` `:497512-497520`; literal 220=16/193=0 |
| Workflow-agent scope prompt now suggests fanning out with `/simplify` and `/code-review`, gated on the spawn-depth cap | **NET_NEW** | `:269622`, gated on `hee() > 1` (`_GROUND_TRUTH` §2) |
| `code-review-low-fast` tip nudges users of *custom* code-review skills onto the built-in one | **NET_NEW** | `:815651-815665`; `if (t === REe) return !1` excludes the built-in from the relevance test |
| `empty_tree_fallback_enabled` remote kill switch for the `.214` fallback | **NET_NEW** | `eLu()` `:226422-226424`, 220=1/193=0, default on |

---

## Carryover — do not write these up as introductions

| Thing | 220 | 193 | Note |
|---|---|---|---|
| `LEVEL_PARAMS` (3/5 correctness angles, 6/8 per angle, 10/15 findings, sweep at xhigh+) | `:424063-424067` | `:443430-443434 (193)` | **identical**. The `.196` change is fan-out shape, not budgets |
| `SWEEP_MAX = 8` | `:424068` | `:443435 (193)` | identical |
| "you cannot launch it yourself, so do not attempt to via Bash or otherwise" | `:507669` | `:592710 (193)` | byte-identical session-guidance clause |
| `subcommands: { ultra: "ultrareview" }` | `:774584` | `:650848 (193)` | the retarget mechanism predates the window |
| The `Jdo()` "Running a local review instead." warning branch | `:343323-343325` | `:397841-397843 (193)` | shape-identical; `.218` #16's fix is the missing *target*, not the message |
| `Xdo()` diff limits (`max_diff_files` 500 / `max_diff_lines` 8000) | `:226417-226421` | `TSo` `:384872 (193)` | byte-equivalent helper |
| `Dtn` / `gIy` GitHub PR-URL regex | `:316026`, `:316033` | `:307915 (193)` | existed; `.212` #6's delta is that the precheck now *calls* it |
| `tengu_review_workflow_routing`, `tengu_review_bughunter_config`, `tengu_review_remote_launched`, `tengu_review_overage_dialog_shown`, `tengu_review_overage_blocked`, `tengu_review_remote_teleport_failed` | 1, 1, 1, 2, 2, 3 | 1, 1, 1, 2, 2, 3 | gate names unchanged; only `_recovery`, `_gate_blocked` and the `_failed` payloads moved |
| `This review bills as usage credits (…)` | `:497176` | `:537147 (193)` | the string is old; the *latch* behind it is what changed |
| `LC_ALL: "C"` on shortstat parsing | `:496893`, `:496999` | `:537100 (193)` | pre-existing locale guard |

### Decoy anchors — literals that look like proof and are not

- **`single-pass` (220=9 / 193=2)** is *not* an anchor for `.202`. Six of the nine hits belong to the
  new Agent-tool-unavailable effort-cell fallback and `/simplify`; two are unrelated prose in the
  bundled `claude-api` skill (`:796735`, `:797223`). The `.202` proof is the *absence* of `${Hzn}`
  from `:497600-497628`.
- **`deep-research: Scope → pipeline(...)`** (220=1 / 193=1) is the workflow header comment and is
  byte-identical in both builds. It cannot anchor `.207`.
- **`not a git repository` (220=5 / 193=3)** — the ultrareview message never contains that phrase; it
  says `is not inside one`. The count drift is unrelated code.
- **`ultrareview` (220=90 / 193=65)** and **`code-review` (220=43 / 193=38)** are far too common to
  prove anything. Every claim in this module is anchored on a narrower literal.

---

## Reading order for someone new to this theme

1. `code_review_background_subagent.md` §0 — the three execution shapes. Nothing else makes sense
   without it.
2. `code_review_background_subagent.md` §3 — the workflow's self-documenting header at `:424055`.
   It is the best single artefact in the module.
3. `ultrareview_argument_handling.md` §0 — the `{reason, method, outcome}` recovery vocabulary, then
   any one of §§1-7 as a worked example.
4. `manual_invocation_gating.md` §1 — the oscillation table, if you care about product policy rather
   than mechanism.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> This module's new symbols are staged in
> [symbol_additions_v2_1_220_code_review.md](../00_overview/symbol_additions_v2_1_220_code_review.md).

The entry points a reader should know:

- `precheckLaunchScope` (`PFo`) - the `/ultrareview` argument + precondition state machine, `:496639`
- `runUltrareviewHeadless` (`OBt`) - the non-interactive cloud-review driver, `:497398`
- `launchRemoteReview` (`OFo`) - cloud session creation and note plumbing, `:497180`
- `registerCodeReviewCommand` (`Knm`) - the `/code-review` command object, `:774580`
- `buildCodeReviewPrompt` (`DqS`) - cell selection, routing telemetry, prompt assembly, `:774384`
- `resolveCommandContext` (`RAo`) - `getContext?.() ?? context ?? "inline"`, `:326547`
- `shouldRunForkInBackground` (`qTo`) - the background-agent default, `:342396`
- `codeReviewCellsByModel` (`cMr`) - per-model, per-effort prompt cells, `:774655`
- `registerBundledWorkflow` (`kxo`) - `hidden` / `disableModelInvocation` options bag, `:385327`
- `isDeepResearchModelInvocationDisabled` (`MJy`) - fail-closed manual-invocation gate, `:424445`
- `CODE_REVIEW_WORKFLOW_NAME` (`Cir`) / `CODE_REVIEW_SKILL_NAME` (`REe`) - `:231212` / `:318660`
- `REPORT_FINDINGS_TOOL_NAME` (`ZB`) - `:403821` (tool object owned by [`../04_tools/`](../04_tools/))
