# Module 45 — `/code-review` + `/simplify` (Claude Code v2.1.156)

> The local-and-cloud code-review subsystem: the `/code-review` and `/simplify` bundled prompt
> commands, the five-level effort ladder, the multi-angle finder → verify → sweep prompt
> compiler, the `--comment`/`--fix` suffix blocks, and the cloud `ultra` ("bughunter" fleet)
> bridge. Source under analysis: `cli_inner_pretty.js` (single pretty-printed bundle).

## Status snapshot

| | v2.1.88 (TypeScript source) | v2.1.156 (deobfuscated bundle) |
|---|---|---|
| `/simplify` | bundled **skill** (`src/skills/bundled/simplify.ts`), 3 agents (Reuse/Quality/Efficiency), always review-and-fix | bundled **prompt command** (`vO9`/`Ehz`), 4 cleanup agents in parallel (+Altitude), cleanup-only, explicitly excludes bug hunting |
| `/code-review` | did not exist (the name `simplify` covered it until the 2.1.147 rename) | bug-hunting prompt command (`zO9`/`_O9`/`$hz`) with 5 model-clamped effort levels + `--fix`/`--comment` |
| Effort levels | none | `["low","medium","high","xhigh","max"]` (`dN`) + `med` alias, model-ceiling clamped (`or`) |
| Review engine | single prose prompt; `gh pr diff` + write a review | fragment-compiler: N independent finder angles → 3-state verifier → optional sweep, all via the `Agent` tool (`sq`) |
| Cloud `ultra` | `/ultrareview` (the **only** multi-agent path; ran in CCR) | `/code-review ultra` is canonical; `/ultrareview` is the deprecated alias. `WF` gate → `re6` scope → `oe6` preflight → `ae6` teleport launch |
| `code-reviewer` agent | example-only (not built-in) | example-only (not built-in) — confirmed |

## TL;DR

In v2.1.156 the review surface is **two distinct bundled prompt commands plus one cloud
escalation path**, all registered through the same generic registrar
`registerBundledPromptCommand` (`bA`, cli_inner_pretty.js:524187):

1. **`/code-review [low|medium|high|xhigh|max|ultra] [--fix] [--comment] [<target>]`** —
   *bug hunting*. Its entire behavior is **string assembly**: parse the arg line
   (`parseCodeReviewArgs`, `_O9`, cli_inner_pretty.js:600530), pick one of five effort levels,
   splice the matching effort-specific prompt body, and append optional `--comment`/`--fix`
   instruction blocks. The model then does the reviewing by spawning `Agent` finder/verifier
   sub-agents — the command itself runs zero tools.
2. **`/simplify [<target>]`** — *cleanup only* (the 2.1.154 rewrite). One fixed prompt
   (`Ehz`, cli_inner_pretty.js:601378) that launches 4 cleanup agents in parallel
   (Reuse/Simplification/Efficiency/Altitude), dedups, and applies the fixes. It explicitly does
   **not** hunt for correctness bugs (that is `/code-review`'s job).
3. **`/code-review ultra`** (deprecated alias `/ultrareview`) — a **deep multi-agent review in
   the cloud**. The local CLI only orchestrates: gate (`WF`) → scope (`re6`) → preflight
   (`oe6`/`WU4`) → teleport launch (`ae6`/`pN8`). The bughunter fleet executes server-side.

The defining design idea is a **prompt compiler**: a shared fragment palette (one `var` per
review angle and per phase) is concatenated in different combinations to produce five distinct
review playbooks. The effort level controls four coupled knobs at once — number of finder
angles (1 → 7 → 9), candidates per angle (none → 6 → 8), the verifier's precision-vs-recall
prior, and whether a final gap-sweep runs (with the findings cap rising 4 → 8 → 10 → 15).

**Newness.** The local multi-angle finder/verifier/sweep effort machine and the `/code-review`
command are **NEW after v2.1.88** (high confidence). Only the cloud `ultrareview` bridge has a
genuine precursor. `/simplify` keeps its old name but its cleanup-only 4-agent semantics are new.

## Architecture / overview

```
            registerBundledPromptCommand (bA, 524187)  ──push──►  BUNDLED_COMMANDS (Ji4, 524295)
                 ▲                         ▲                                 ▲
                 │                         │                                 │ slash resolver
    registerCodeReview (zO9, 600612)   registerSimplify (vO9, 601350)        │
    name "code-review" (Y18, 211646)   name "simplify"                       │
    subcommands {ultra:"ultrareview"}  getPromptForCommand → Ehz             │
    getEffort → _O9(line).explicit                                           │
    getPromptForCommand → $hz                                                │
                 │                                                           │
                 ▼  buildCodeReviewPrompt ($hz, 600564)                      │
   ┌──────────── parse + resolve + assemble ───────────────────┐            │
   │ parseCodeReviewArgs (_O9, 600530)                          │            │
   │   tokenizeFlags (BN8, 502812) → rawFirstToken/flags/rest   │            │
   │   ultra? → ultraFallback   effort? → _kH/dN   typo? → tyz  │            │
   │ resolveEffortForModel (or, 184909) clamp max/xhigh→high    │            │
   │   ow$ (max gate) · ycH (xhigh gate) · q48 (model default)  │            │
   │ effortPromptMap[level] (oyz, 600659)                       │            │
   │   low sf9 · medium tf9 · high ef9 · xhigh $O9 · max qO9    │            │
   │   (palette: dq$ diff · p1q A/B/C · nyz +D/E · BI8/cq$/lq$/ │            │
   │    nq$ cleanup · af9/iyz verify · ryz sweep · Q1q(N) out)  │            │
   │ + COMMENT_SUFFIX_BLOCK (ayz) + FIX_SUFFIX_BLOCK (syz)      │            │
   └────────────────────────────────────────────────────────────┘            │
                 │                                                            │
        ultra requested │                                                    │
                 ▼                                                           │
   isCloudReviewAvailable (WF, 502747) = bughunter cfg.enabled && CCR && !remote
                 │ true                                                       │
                 ▼  runUltrareview (pN8, 503046)                              │
   resolveUltraScope (re6) → evaluateUltraPreflight (oe6/WU4) → launchUltrareview (ae6)
                 │                                                            │
                 ▼  teleport remote session, BUGHUNTER_* env, env_0111…113   │
            cloud bughunter fleet → results stream back as a task notification
```

Three structural choices unify the module:

- **One registrar, two commands.** Both `/code-review` and `/simplify` are plain `type:"prompt"`
  records (no JSX/React) pushed onto `BUNDLED_COMMANDS` (`Ji4`). Description and argument-hint can
  be *functions* (lazy getters) so their text changes at runtime with `isCloudReviewAvailable()`.
- **Fragment compiler over five hand-written prompts.** The five effort bodies share ~80% of
  their text. Factoring every angle/phase into a single `var` means a wording fix to "Angle B" or
  the Reuse angle propagates to all levels *and* to `/simplify` automatically.
- **Precision/recall on the verifier, not the finder.** Going medium → high does not add finder
  angles; it only swaps the verifier's prior (neutral `af9` → recall-biased `iyz`) and raises the
  cap. The same broad finder net is used everywhere; only the gate tightens or loosens.

## Module Structure

| Document | What it covers | Read it for |
|----------|----------------|-------------|
| [code_review_command.md](./code_review_command.md) | The `/code-review` and `/simplify` **slash commands**: the command-name constant, the generic bundled registrar (`bA`) and registry (`Ji4`), the lazy dynamic description/arg-hint, the two-stage argument parser (`tokenizeFlags` → `parseCodeReviewArgs`), the five-rung effort ladder + model-ceiling clamping, the prompt builder's effort-resolution precedence, the `--comment`/`--fix` suffix blocks, and the `ultra` → `/ultrareview` cloud alias. | How an arg line is parsed and how the command is wired into the harness |
| [review_prompt_algorithm.md](./review_prompt_algorithm.md) | The **prompt compiler**: the shared fragment palette (diff / correctness angles A–E / four cleanup angles / two verify phases / sweep / output schema) and how each effort level is *compiled* by concatenating fragments. Full walkthrough of all five bodies, the precision↔recall gradient, the angle×candidate×cap matrix, and why finders/verifiers run as separate `Agent` sub-agents. | The algorithm: how one `git diff` becomes a multi-angle finder/verifier/sweep playbook tuned by effort |
| [simplify_and_cloud_review.md](./simplify_and_cloud_review.md) | `/simplify` (cleanup-only 4-agent rewrite), `/code-review`'s effort levels and final assembly, and the **cloud `ultra` bughunter bridge** in depth (gate `WF` → scope `re6` → preflight `oe6`/`WU4` → launch `ae6`/`pN8`, fleet-sizing clamp, teleport env). Also proves `code-reviewer` is **not** a built-in agent and `simplifyRange` is an unrelated semver export. | The cleanup sibling, the cloud escalation machinery, and the two scoping "gotchas" |

## Reading order

1. **[code_review_command.md](./code_review_command.md)** — start here for the command surface
   (registration, argument parsing, effort ladder, suffix blocks). It establishes every symbol the
   other two docs build on.
2. **[review_prompt_algorithm.md](./review_prompt_algorithm.md)** — then go deep on *what prompt
   text* each effort level actually produces (the fragment palette and the five compiled bodies).
   This is the algorithmic heart of the module.
3. **[simplify_and_cloud_review.md](./simplify_and_cloud_review.md)** — finish with the
   cleanup-only `/simplify` and the cloud `ultra` bridge (the part that leaves the local session),
   plus the two scope-boundary clarifications.

Each doc independently cross-validates against v2.1.88 and states confidence; the consolidated
verdict is in `simplify_and_cloud_review.md`'s "Cross-validation summary."

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent tool `sq`)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (effort ladder + review-angle fragments)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (cloud review gates + teleport bridge)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations (slash commands + prompt strings)
> - [symbol_additions_v2_1_156_code_review.md](../00_overview/symbol_additions_v2_1_156_code_review.md) - **This module's consolidated additions table (65 symbols)**

Key symbols across this module (list format — full table in the additions file above):

- `CODE_REVIEW_NAME` (`Y18`) — `"code-review"` command-name constant (cli_inner_pretty.js:211646)
- `registerBundledPromptCommand` (`bA`) — generic bundled prompt-command registrar; pushes onto `Ji4` (cli_inner_pretty.js:524187)
- `BUNDLED_COMMANDS` (`Ji4`) — the bundled-prompt-command registry array (cli_inner_pretty.js:524295)
- `registerCodeReview` (`zO9`) — `/code-review` registration; wires `subcommands: { ultra: "ultrareview" }` (cli_inner_pretty.js:600612)
- `parseCodeReviewArgs` (`_O9`) — arg state machine: flags → ultra/effort/typo/target (cli_inner_pretty.js:600530)
- `tokenizeFlags` (`BN8`) — strip named `--flags`, return `{rawFirstToken, flags, rest}` (cli_inner_pretty.js:502812)
- `buildCodeReviewPrompt` (`$hz`) — assemble preamble + target + effort body + suffix blocks (cli_inner_pretty.js:600564)
- `buildEffortFallbackPreamble` (`qhz`) — cloud-fallback / unrecognized-effort notice (cli_inner_pretty.js:600578)
- `effortPromptMap` (`oyz`) — level → effort-specific prompt body (cli_inner_pretty.js:600659)
- `buildHighRecallEffortPrompt` (`HO9`) — factory for the xhigh/max 9-angle body (cli_inner_pretty.js:600389)
- `EFFORT_LEVELS` (`dN`) — `["low","medium","high","xhigh","max"]`; re-bound locally as `pI8` (cli_inner_pretty.js:185009)
- `normalizeEffortToken` (`_kH`) / `clampEffortLevel` (`E1H`) — token validation + coercion (cli_inner_pretty.js:184865 / 184960)
- `resolveEffortForModel` (`or`) — clamp requested effort against the model ceiling (cli_inner_pretty.js:184909)
- `COMMENT_SUFFIX_BLOCK` (`ayz`) / `FIX_SUFFIX_BLOCK` (`syz`) — `--comment` / `--fix` instruction blocks (cli_inner_pretty.js:600626 / 600638)
- `registerSimplify` (`vO9`) / `SIMPLIFY_PROMPT` (`Ehz`) — the cleanup-only `/simplify` command + body (cli_inner_pretty.js:601350 / 601378)
- `isCloudReviewAvailable` (`WF`) — ultra gate (config enabled ∧ CCR bridge ∧ not-remote) (cli_inner_pretty.js:502747)
- `runUltrareview` (`pN8`) — cloud orchestrator: gate → scope → preflight → launch (cli_inner_pretty.js:503046)
- `AGENT_TOOL_NAME` (`sq`) — `"Agent"`; the tool finders/verifiers/sweepers are dispatched through (cli_inner_pretty.js:185637)

## Changelog timeline (147 → 154, as it ships in 2.1.156)

- **2.1.147** — renamed `/simplify` → `/code-review`; added effort levels, `parseCodeReviewArgs`,
  and `--comment` inline-PR-comment posting; removed the old cleanup-and-fix behavior.
- **2.1.152** — `/code-review --fix` applies findings to the working tree (`FIX_SUFFIX_BLOCK`);
  `/simplify` became a thin wrapper for `/code-review --fix`.
- **2.1.154** — re-split: `/simplify` regained its own cleanup-only 4-agent prompt (`vO9`/`Ehz`),
  separate from `/code-review`. This is the two-command shape captured in the 2.1.156 bundle.
- **2.1.156** — no code-review change of its own (the only 2.1.156 change is the Opus 4.8
  thinking-block hotfix); this module documents the cumulative 147→154 state.

## Cross-references

- `40_ant_promoted/10_promoted_ultrareview.md` (v2.1.142) — the cloud launch/poll machinery and
  the `claude ultrareview` CLI subcommand behind the `ultra` bridge.
- `43_model_opus48/` — `getDefaultEffortForModel` (`q48`) and the shared effort ladder (`dN`, `or`,
  `ow$`, `ycH`) that `/code-review` reuses for model-aware effort clamping.
- `04_tools/` — the `Agent` tool (`sq`) the review prompts instruct the model to spawn
  finder/verifier sub-agents through.
- `10_skill_system/` — the `/simplify` precursor lived as a bundled *skill* in v2.1.88; both are
  now bundled prompt commands registered via `registerBundledPromptCommand` (`bA`).
