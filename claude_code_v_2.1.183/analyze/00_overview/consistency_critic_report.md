# Whole-Tree Consistency Critic Report — v2.1.156 → v2.1.183 Focused Delta Tree

**Scope of this pass.** Adversarial consistency audit of the entire
`claude_code_v_2.1.183/analyze/` deliverable tree: `README.md`, all of `00_overview/`, the five
focus-feature module dirs (`30_agent_team/`, `42_workflow/`, `36_background_agents/`, `07_compact/`,
`31_auto_memory/`), and `by_version/`. Working files (`_scout_dossier_*.md`, `_asset_anchors.md`) were
read as reference but are not policed as deliverables.

**Tree framing (re-confirmed correct).** This is a **focused delta analysis of the v2.1.156 → v2.1.183
window scoped to five user-requested features** — Agent Team (the v2.1.178 implicit-team redesign),
Dynamic Workflows (ultracode), Background Agents (nested-subagent depth limit + lifecycle), Compaction
(fallback-model + 1M clamp + window resolver), and Auto Memory (team memory stores). It is **not** a
comprehensive every-module tree, and every index doc says so honestly. No doc overclaims comprehensiveness
about this tree.

---

## 1. Relative links

**Method.** Extracted every markdown link across all `.md` files (code-fence and inline-regex fragments
excluded), resolved each against the filesystem, and re-verified after each fix.

**Result.** Started with broken links; ended at **0 broken links tree-wide**.

Fixed:

- `00_overview/symbol_additions_v2_1_183_agent_team.md:9` — the `_asset_anchors.md` link resolved inside
  `00_overview/`, but `_asset_anchors.md` lives one level up in `analyze/`. Repointed to
  `../_asset_anchors.md`.
- `by_version/2.1.158.md:139` — `Model context:` linked `../43_model_opus48/`, a module that does not
  exist in this tree (Opus 4.7/4.8 model wiring is out of scope). De-linked to prose that names the five
  in-scope features.
- `by_version/2.1.160.md:442` — `Next:` linked `../by_version/2.1.161.md`, which does not exist.
  Repointed to the consolidated `CHANGES_2.1.157_to_2.1.183.md` timeline (which covers 2.1.161 and later).
- `00_overview/cross_validation_report_workflow.md:178` — Issue #1's quote still contained the live, now-
  fixed broken target `./README_delta_2.1.183.md`. Marked the issue RESOLVED and removed the live broken
  link (the actual `ultracode_keyword_trigger_delta.md:558` was already fixed to `./README.md` in the
  prior fix pass).

> **Note — `by_version/` grew mid-pass.** While this audit ran, a parallel process expanded `by_version/`
> from the consolidated `CHANGES` file into a set of early-window per-release notes (`2.1.157.md` …
> `2.1.160.md`). Once `2.1.157.md`/`2.1.160.md` existed, the conservative de-links this audit had placed in
> `2.1.158.md` (Prev→157) and `2.1.159.md` (Next→160) were **restored to proper links**, and the
> `by_version/` description in `README.md`, `00_overview/README.md`, and `file_index.md` was reconciled
> from "consolidated + 2 spotlight notes" to "consolidated + early-window spotlight notes (`2.1.157` …
> `2.1.160`)" to match the actual contents.

**Cross-tree depth convention — verified correct everywhere:** top `README.md` uses
`../../claude_code_v_2.1.156`; `00_overview/`, module docs, and `by_version/` use
`../../../claude_code_v_2.1.156`. All cross-tree targets resolve.

---

## 2. Forbidden obfuscated→readable mapping tables

**Method.** Scanned every table header in the deliverable tree for the forbidden shape (col0 = an
obfuscated/symbol header, col1 = a readable/name header). Allowed files: `symbol_index_*.md` and
`symbol_additions_v2_1_183_*.md`.

**Result.** **Zero forbidden mapping tables in any module doc or narrative overview doc.** The tables a
naive grep flags are all legitimate non-mapping tables explicitly permitted by the format rules:

- `30_agent_team/README.md` "Before → after contrast" — `Dimension | v2.1.156 | v2.1.183 | Evidence`
  (per-dimension before/after delta table).
- `36_background_agents/README.md` "What changed at a glance" — `# | Delta | Kind | v2.1.183 anchor |
  v2.1.156 before | Confidence` (per-delta change table).
- `00_overview/cross_validation_report_agent_team.md` C7 table — a pass/fail-style **verification** table
  (`Symbol | candidate name | candidate name | verified body | accurate name`) whose purpose is to pick
  the correct readable name, not to serve as a lookup reference.

No conversions to list format were needed.

---

## 3. Naming & structural consistency

- **Five focus-feature framing** is consistent across `README.md`, `00_overview/README.md`,
  `file_index.md`, `changelog_analysis.md`, `changelog_to_code_map.md`, and `cross_validation_summary.md`.
- **`## Related Symbols` closing block present in 22/22 module docs.** The early-pass duplicate-heading
  note for `mailbox_lifecycle_and_sendmessage_delta.md` is now stale (the doc has a single closing
  section); the summary note was corrected to say so.
- **Cross-doc readable-name reconciliation (CLAUDE.md Mistake #1/#3).** `NXr`/`Dla`/`oso` now use one name
  per symbol across the agent_team README and deep-dive (`ensureTeamTasksDir`,
  `registerTeamForSession`, `recordTeamCreated`); the inaccurate `captureTeammateModeSnapshot` /
  `ensureInboxesDir` names appear in no module doc. Added a "RESOLVED" note to the C7 section so the report
  does not mislead a future reader.

**`by_version/` description corrected (stale "empty placeholder").** `file_index.md` and both READMEs
described `by_version/` as an empty placeholder / a single rolled-up file, but it actually holds
`CHANGES_2.1.157_to_2.1.183.md` **plus** the early-window spotlight notes `2.1.157.md` … `2.1.160.md`.
Updated `file_index.md` (two spots), `README.md` (file-tree + timeline section), and `00_overview/README.md`
(two spots) to list the files and resolve their inter-version navigation.

---

## 4. Framing / dossier-correction integrity

- **No "comprehensive tree" overclaim.** Every use of "comprehensive" describes either the *prior*
  v2.1.156 tree (correct contrast) or a within-feature symbol *table*, or explicitly negates it
  ("not a comprehensive module tree").
- **The five headline deltas are consistently described** (implicit-team redesign with TeamCreate/
  TeamDelete removal; nested-subagent 5-level depth limit; `workflow`→`ultracode`; compaction
  `--fallback-model`; team/remote memory stores).
- **Dossier correction re-confirmed and a re-break repaired.** The corrected fact — the
  **cliVersion-equality "not-stale" short-circuit** and the **`session_cron`/`routine` *retire* guards**
  are **carryover** (present identically in v2.1.156), NOT v2.1.183 deltas — had been **partially
  re-broken** in `36_background_agents/README.md §5`, which labelled them "(a) Upgrade-respawn now keys on
  cliVersion inequality" and "(b) New inflight guards for cron/routine", and asserted a v2.1.156
  before-picture with "no `session_cron`/`routine` guards". This contradicted the independently
  re-verified deep-dive (`bg_command_surface_and_retire_delta.md` §B.0) and the cross-validation report.
  Fixed:
  - Rewrote README §5 header, preamble, the three "(a)/(b)/(c)" bullets, and the before-picture so the
    **genuine** deltas are stated correctly: the `respawnIfIdleStale` `trigger` parameter (with its *new*
    `session_cron`-inflight check), the `gFl` "detritus" inflight allowlist + `detritusOnly` carve-out,
    and the `prewarm` respawn loop — with the cliVersion-equality short-circuit and the `retireIfSettled`
    cron/routine guards explicitly labelled CARRYOVER and cross-referenced to §B.0.
  - Updated the README "What changed at a glance" D5 row to lead with the genuine deltas.
  - Fixed `00_overview/changelog_analysis.md` (the §"D5" paragraph previously called the carryover guards
    "the genuine refinements" before contradicting itself in a parenthetical).
  - Verified `symbol_additions_v2_1_183_background_agents.md` and
    `cross_validation_report_background_agents.md` already classify them correctly (no change needed).

---

## 5. English-only / placeholders

- **English only** confirmed (no CJK/non-Latin scripts in any deliverable).
- **No leftover TODO/FIXME/WIP/TBD placeholders.** Every "placeholder" string match is a legitimate domain
  term (the `cat` pane-hold placeholder, the `failed` retryable-job placeholder, the changelog "Bug fixes
  and reliability improvements" placeholder releases).

---

## Summary of files edited

- `00_overview/symbol_additions_v2_1_183_agent_team.md` — `_asset_anchors.md` link depth.
- `00_overview/cross_validation_report_workflow.md` — Issue #1 resolved + dead link removed.
- `00_overview/cross_validation_report_agent_team.md` — C7 RESOLVED note (name reconciliation).
- `00_overview/changelog_analysis.md` — D5 carryover-vs-delta wording corrected.
- `00_overview/file_index.md` — `by_version/` description (two spots).
- `00_overview/cross_validation_summary.md` — link-count generalized, duplicate-heading note + link nits
  marked resolved.
- `00_overview/README.md` — `by_version/` description (two spots).
- `README.md` — `by_version/` file-tree + timeline section.
- `36_background_agents/README.md` — §5 dossier-correction re-break repaired + D5 glance row.
- `by_version/2.1.158.md` — out-of-scope `43_model_opus48/` link de-linked; Prev→`2.1.157.md` restored.
- `by_version/2.1.159.md` — Next→`2.1.160.md` restored (plus live module-doc cross-links).
- `by_version/2.1.160.md` — dangling `Next:` forward-reference to non-existent `2.1.161.md` repointed to
  the consolidated CHANGES timeline.

**Verdict: PASS (post-fix).** 0 broken links, 0 forbidden mapping tables, consistent five-feature framing,
`## Related Symbols` in 22/22 module docs, the dossier carryover correction restored everywhere, English
only, no placeholders.
