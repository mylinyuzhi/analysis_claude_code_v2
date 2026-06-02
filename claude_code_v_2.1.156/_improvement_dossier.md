# Improvement Dossier — v2.1.156 analyze tree (round 2: deepen & resolve)

> Companion to `_scout_dossier.md` (read that first for source layout, conventions, and the
> per-module anchors). This file scopes a **second pass** whose goal is to *improve and complete*
> an already-PASS/HIGH tree — **not** to rewrite it. Every agent must preserve existing correct
> content, voice, and format, and ADD depth / FIX defects / RESOLVE residuals only.

## Source under analysis
- Bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
  (649,979 lines; **cite as `cli_inner_pretty.js:<line>`**, verified by direct read).
- Per-decl files: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_unpack_pretty/decls/...`
- Assets: `.../extract/assets/` — `feature_gates.json`, `slash_commands.json`, `env_vars.json`,
  `cli_flags.json`, `tools/*.md`, `system_prompts/`, `prompts/` (372 extracted prompt bodies).
- xval: v2.1.88 readable TS at `/lyz/codespace/3rd/claude-code/src/`; format/depth reference tree
  `/lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.142/analyze/`.

## CONVENTIONS (MUST follow — from CLAUDE.md + _scout_dossier.md)
- **English only.**
- **No symbol mapping tables in module docs.** Use list format `` `readableName` (`OBF`) — desc (cli_inner_pretty.js:NNN) ``.
  Mapping TABLES live ONLY in `00_overview/symbol_index_*.md` and per-module `symbol_additions_*.md`.
- **Code snippets = dual-version**: `==== header (ReadableName + one-line desc + Location) ====`,
  then `// ORIGINAL (for source lookup):`, then `// READABLE (for understanding):`, then `// Mapping: ...`.
  Only ONE `====` block at the top of each snippet.
- **Every new factual claim cites `cli_inner_pretty.js:<line>` verified by reading that line.**
- Match the depth style of sibling docs (TL;DR, How it works, Why this approach, Key insight, ASCII diagrams).

## RE-VERIFIED STATE (2026-06-02) — supersedes cross_validation_summary.md where they conflict
The cross_validation_summary.md is **stale**. Re-checked today:
- **Broken links: effectively NONE.** A fresh sweep of 406 relative links found only 2 hits, both
  false positives — the literal strings `./...` and `../...` are *example text* on
  `00_overview/cross_validation_summary.md:107`, not real links. The "17 broken links" follow-up was
  already applied in a prior pass. DO NOT re-fix links unless a fresh sweep finds a real one.
- **6 cross-index name divergences: STILL OPEN** (see below). This is real, surgical work.

## OPEN ITEM 1 — Canonicalize 6 cross-index readable-name divergences (overview phase)
Each obfuscated ID below carries two *different* readable names across two index files, at the **same,
correct line**. Pick ONE canonical name per ID **by reading the source line**, then apply it to BOTH
index files (and any module-doc/additions reference). Recommended criterion: the name that most
accurately describes what the function/constant actually does; prefer the generic name if the function
is generic; keep it consistent with the home module (45_code_review for the review/simplify ones).

| ID | line | name A (where) | name B (where) |
|----|------|----------------|----------------|
| `bA` | 524187 | `registerBundledPromptCommand` (infra_integration:107) | `registerBundledSkill` (core_features:449) |
| `SH` | 41590 | `recordFeatureOk` (core_execution:179) | `emitFeatureOk` (core_features:310) |
| `Ehz` | 601378 | `SIMPLIFY_PROMPT` (infra_integration:136) | `SIMPLIFY_SKILL_BODY` (core_features:453) |
| `eyz` | 600558 | `getCodeReviewDescription` (infra_integration:118) | `codeReviewDescription` (core_features:454) |
| `vO9` | 601350 | `registerSimplify` (infra_integration:138) | `registerSimplifySkill` (core_features:464) |
| `zO9` | 600612 | `registerCodeReview` (infra_integration:130) | `registerCodeReviewSkill` (core_features:466) |

## OPEN ITEM 2 — COVERAGE GAP: workflow execution runtime / DSL semantics / subagent prompts (42_workflow)
There is currently **no dedicated doc** on how a workflow script actually *runs*. The README lists only
`workflow_tool_definition.md` (tool object/schema/meta parser) and `gate_caps_lifecycle_relations.md`
(gate/keyword/caps/journal/lifecycle). The DSL **primitive semantics as implemented in the VM** and the
**workflow subagent system prompts** are under-documented. CREATE
`42_workflow/workflow_runtime_and_subagents.md` covering, each with verified source evidence:
- **Compile + run path:** `BP8` compile-to-VM (`cli_inner_pretty.js:367468`); `g74` VM-bridge factory
  that builds the `agent()/pipeline()/parallel()/phase()/log()/workflow()` globals
  (`cli_inner_pretty.js:374939`); `q44` runner (`cli_inner_pretty.js:376007`).
- **DSL primitive semantics:** `agent()` (cap+budget check `(W(),G())` @375006; journal cache @375019;
  worktree/isolation @375075/375155/375189; stall watchdog @375210-375217); `pipeline()` no-barrier
  pipelining (`lG_=50` @375677, `BiH(lG_,...)` @375002); `parallel()` barrier (`BiH(cG_,...)` @375001);
  `phase()`/`log()`; nested `workflow()` one-level-only; `args`/`budget` globals (`remaining()`→Infinity
  when total null @375977-375979). The blocked builtins (`Date.now`/`Math.random`/`new Date`) and the
  no-fs/no-Node-API sandbox (cross-ref the determinism rule).
- **StructuredOutput forcing:** tool name `iY = "StructuredOutput"` (`cli_inner_pretty.js:212132`); the
  `SubagentStop` re-nudge via `gtH` (@375221-375236); the structured subagent prompt variant.
- **Workflow subagent system prompts (verbatim, analyzed):**
  - `iG_` plain subagent prompt — `cli_inner_pretty.js:375683` ("You are a subagent spawned by a workflow
    orchestration script…"), with the "NOTE: You are running inside a workflow script…" tail @375694.
  - `aG_` StructuredOutput subagent prompt — `cli_inner_pretty.js:375759`, tail @375758 ("…You MUST
    return your final answer by calling the ${iY} tool exactly once…").
  - The coordinator **worker-agent** prompt @236125 ("You are a worker agent executing a task assigned by
    the coordinator.") — cross-reference vs the scripted-workflow subagent prompts (two orchestration models).
- Register all new symbols in `symbol_additions_v2_1_156_workflow.md`; update `42_workflow/README.md`
  module-structure table + reading order to include the new doc.

## OPEN ITEM 3 — Resolve residual low-confidence items (verify current state first; only fix if still open)
1. **bg session classifier per-regex constant lines** (`36_background_agents/bg_session_classifier.md`).
   The status verbs/regex constants each HAVE their own declaration line near `cli_inner_pretty.js:449560-449575`:
   `Od_`@449569, `Md_`@449570 (the `done/failed/stopped` Set), and the regexes `Dd_`@449571,
   `Jd_`@449572, `Xd_`@449573, `Ld_`@449574, `Wd_`@~449575, `Zd_`, `Gd_`, `Td_`, `Vd_` in the following
   lines. If the doc currently cites a grouped block range, upgrade each to its own declaration line
   (read each line to confirm before citing). The classifier prompt `r04` is at `cli_inner_pretty.js:449361`.
2. **`gt4` WorkflowHistoryDialog end range** (42_workflow). Starts `function gt4(H) {` @`cli_inner_pretty.js:538403`;
   find the matching closing brace and cite the full range instead of `538403+`.
3. **37_permission_policy medium-confidence reconstructions.** Re-read and, where possible, replace the
   reconstructed `$TMPDIR` sandbox-vs-unsandboxed path and the bare-assignment auto-approve-bypass pseudocode
   with verbatim source + exact line; if still only reconstructable, keep the honest "reconstructed/medium"
   label but tighten the cite.
4. **`Q88` note (44_lean_prompt).** Benign double-cite (function+constants range vs body range). Verify and
   either reconcile to one accurate range or keep the honest note.

## OPEN ITEM 4 — Per-module depth & citation audit (all 9 modules + overview)
For each module: scan for (a) factual claims lacking a `cli_inner_pretty.js:<line>` cite, (b) shallow
sections that state *what* without *why/how* (CLAUDE.md depth rule), (c) any obf→readable name used in a
module doc that disagrees with that module's `symbol_additions_*` canon. Fix in place with source-backed
depth. **Be honest: if a module is already complete and deep, say so and make no cosmetic edits.**

## DO-NOT list
- Do not rewrite or delete existing correct content; additive/corrective edits only.
- Do not add mapping tables to module docs.
- Do not touch the 4 consolidated `symbol_index_*.md` or `file_index.md`/`changelog_*` from a *module*
  agent — those are edited ONLY in the overview phase (single-writer) to avoid races. A module agent may
  edit its own `symbol_additions_v2_1_156_<module>.md` and its own module dir.
- Do not invent line numbers. If you can't verify a line, say so and leave the claim flagged.
