# Symbol Additions — v2.1.156 `/code-review` + `/simplify` (module 45_code_review)

These mappings cover every obfuscated identifier introduced or touched by the v2.1.156
**`/code-review` and `/simplify`** module: the bundled-prompt-command registrar and registry,
the `/code-review` argument parser and effort ladder, the per-effort prompt compiler (the
fragment palette + five effort bodies + verify/sweep phases + output schema), the
`--comment`/`--fix` suffix blocks, the cleanup-only `/simplify` body, and the cloud `ultra`
("bughunter" fleet) bridge (gate → scope → preflight → teleport launch).

Each row gives the v2.1.156 obfuscated identifier, the readable name, `file:line`, and type.
Every line was verified by reading
`/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js` at that location.

Cross-validated against:
- v2.1.156 bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`
- v2.1.88 TypeScript: `/lyz/codespace/3rd/claude-code/src/` — `/simplify` existed as a bundled
  skill (`src/skills/bundled/simplify.ts`, 3 agents); `/code-review` and the local multi-angle
  finder/verifier/sweep effort machine are **NEW post-2.1.88**; only the cloud `ultrareview`
  bridge (`src/commands/review.ts`, `commands/review/`) has a genuine precursor.
- Module docs: `claude_code_v_2.1.156/analyze/45_code_review/{code_review_command,review_prompt_algorithm,simplify_and_cloud_review}.md`

> **Home-index placement (single source of truth).** When merged into the central index, split
> the rows by their `category`:
> - **`symbol_index_infra_integration.md`** (Slash Commands) — the command wiring and prompt
>   strings: `Y18`, `bA`, `Ji4`, `zO9`, `_O9`, `BN8`, `TU4`, `$hz`, `qhz`, `oyz`, `HO9`, `ayz`,
>   `syz`, `eyz`, `Hhz`, `vO9`, `Ehz`, `kO9`, `pI8`, `tyz`, `Q1q`, `vR`.
> - **`symbol_index_core_features.md`** (Compact/Effort area — the shared effort ladder) —
>   `dN`, `s$7`, `_kH`, `KkH`, `E1H`, `or`, `q48`, `k3`, `ow$`, `ycH`, and the prompt-fragment
>   review-angle vars `dq$`, `BI8`, `cq$`, `lq$`, `nq$`, `p1q`, `nyz`, `U1q`, `F1q`, `af9`, `iyz`,
>   `ryz`, `sf9`, `tf9`, `ef9`, `$O9`, `qO9`.
> - **`symbol_index_infra_platform.md`** (cloud review / teleport bridge + gates) — `WF`, `QU4`,
>   `x8$`, `gIH`, `Vs`, `LU4`, `dtH`, `d6`, `WU4`, `re6`, `oe6`, `ae6`, `pN8`, `nP8`, `ie6`,
>   `GU4`, `jk`.
> - **`symbol_index_core_execution.md`** (Tools) — `sq` (`AGENT_TOOL_NAME`), already indexed
>   elsewhere; listed here only because every review body interpolates it.

> **Line-number notes (single source of truth):**
> - `Y18` is the first of a four-name constant block (`Y18`/`T97`/`e26`/`HZ6`) at 211646.
> - `Ji4` is initialized to `[]` inside a comma-expression at 524295 (`(… , (Ji4 = []))`).
> - `dN`/`s$7` (the canonical effort ladder + alias map) live at 185009-185010; `pI8`/`oyz`/`tyz`
>   are the code-review module's local re-bind/build (`pI8 = dN`) at 600659-600661.
> - `oyz`, `pI8`, `tyz` are assigned together in one comma-expression at 600659-600661; the rows
>   cite the line each name first appears on (`oyz` 600659, `pI8` 600660, `tyz` 600661).
> - `nyz`/`U1q`/`F1q`/`af9`/`iyz`/`ryz`/`sf9`/`tf9`/`ef9`/`$O9`/`qO9` are **late-bound** (declared
>   empty near 600323-600328, assigned inside the `KO9` initializer); rows cite the **assignment**
>   line. `$O9 = HO9("xhigh")` and `qO9 = HO9("max")` are both at 600527-600528.
> - `Q1q` is a **function** of the finding cap (`Q1q = (H) => …`) at 600342, not a constant string.
> - `Ehz` (`SIMPLIFY_PROMPT`) is declared `var` near 601374 and assigned inside the `kO9` init
>   thunk; the row cites the assignment at 601378.
> - `vR` (`escapeRegex`) is a module-wide regex-metacharacter escaper **declared at 9649**
>   (`function vR(H){ return H.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }`); the code-review module
>   only **references** it at 502812 inside `BN8`. The row cites the declaration (9649), not the
>   reference. (An earlier seed mis-cited it at the 502812 use-site.)

---

## Module: /code-review + /simplify

| Obfuscated | Readable | File:Line | Type |
|------------|----------|-----------|------|
| `$hz` | `buildCodeReviewPrompt` (`getPromptForCommand`: parse args → resolve+clamp effort → assemble preamble + target line + effort body + `--comment`/`--fix` blocks) | cli_inner_pretty.js:600564 | function |
| `$O9` | `xhighEffortPrompt` (`HO9("xhigh")` — 5+4 angles × 8 + sweep, ≤15) | cli_inner_pretty.js:600527 | variable |
| `_kH` | `normalizeEffortToken` (trim → lowercase → alias-map (`s$7`) → membership-check; valid level or `undefined`) | cli_inner_pretty.js:184865 | function |
| `_O9` | `parseCodeReviewArgs` (state machine: strip flags, classify first token as `ultra` / effort / unrecognized-level / target) | cli_inner_pretty.js:600530 | function |
| `ae6` | `launchUltrareview` (bundle the diff, spawn a teleport remote session with clamped `BUGHUNTER_*` env, register the `ultrareview` task) | cli_inner_pretty.js:502916 | function |
| `af9` | `verifyPhasePrecision` ("## Phase 2 — Verify (1-vote, 3-state)" neutral verifier; used by medium and embedded in xhigh/max) | cli_inner_pretty.js:600442 | variable |
| `ayz` | `COMMENT_SUFFIX_BLOCK` ("## Posting to GitHub (--comment)" — inline PR comments via `mcp__github_inline_comment__create_inline_comment`, falls back to `gh api` then stdout) | cli_inner_pretty.js:600626 | constant |
| `BI8` | `reuseAngleBody` (Reuse cleanup angle: flag re-implementations of existing helpers; name the helper to call) | cli_inner_pretty.js:600277 | variable |
| `bA` | `registerBundledPromptCommand` (generic bundled prompt-command registrar; normalizes the spec, installs lazy getters, pushes onto `Ji4`) | cli_inner_pretty.js:524187 | function |
| `BN8` | `tokenizeFlags` (strip named `--flags` with word-boundary regex; return `{rawFirstToken, flags, rest}`) | cli_inner_pretty.js:502812 | function |
| `cq$` | `simplificationAngle` ("### Simplification" cleanup angle: redundant/derivable state, copy-paste, deep nesting, dead code) | cli_inner_pretty.js:600281 | variable |
| `d6` | `isRemoteWorkspace` (`caps.workspace === "remote"`; blocks ultra-from-inside-a-remote-workspace nesting) | cli_inner_pretty.js:3190 | function |
| `dN` | `EFFORT_LEVELS` (`["low","medium","high","xhigh","max"]` — the canonical five-rung effort ladder) | cli_inner_pretty.js:185009 | constant |
| `dq$` | `gatherDiffPhase` ("## Phase 0 — Gather the diff" shared preamble: `git diff @{upstream}...HEAD`, plus `git diff HEAD` for working-tree changes) | cli_inner_pretty.js:600275 | variable |
| `dtH` | `isCloudCodeRunnerBridgeReady` (`tengu_ccr_bridge` predicate: `PO() && n0$() && getFeatureGate("tengu_ccr_bridge", false)`) | cli_inner_pretty.js:372224 | function |
| `E1H` | `clampEffortLevel` (coerce any value to a valid effort, default `"high"`) | cli_inner_pretty.js:184960 | function |
| `ef9` | `highEffortPrompt` (high effort: 3+4 angles × 6, recall-biased verify (`iyz`), ≤10) | cli_inner_pretty.js:600502 | variable |
| `Ehz` | `SIMPLIFY_PROMPT` (`/simplify` body: 4 cleanup agents in parallel + apply fixes; quality-only, no bug hunting) | cli_inner_pretty.js:601378 | variable |
| `eyz` | `getCodeReviewDescription` (dynamic description; appends the "ultra: cloud" clause only when `WF()` is true) | cli_inner_pretty.js:600558 | function |
| `F1q` | `cleanupOutputNote` (cleanup/altitude findings reuse the `file`/`line`/`summary` output shape with a *cost* in `failure_scenario`; also carries the rule "correctness bugs always outrank cleanup and altitude findings when the output cap forces a cut") | cli_inner_pretty.js:600325 | variable |
| `gIH` | `getUltraCostNote` (`tengu_review_bughunter_config.cost_note` or default `"$10-$20"`) | cli_inner_pretty.js:502735 | function |
| `GU4` | `ultraConsentRemembered` (session latch declared `var GU4 = !1`; set to `!0` by `ie6()` so subsequent `confirm` preflights auto-proceed) | cli_inner_pretty.js:503099 | variable |
| `Hhz` | `getCodeReviewArgumentHint` (dynamic hint; appends `\|ultra` to the level list only when `WF()` is true) | cli_inner_pretty.js:600561 | function |
| `HO9` | `buildHighRecallEffortPrompt` (factory for the xhigh/max 9-angle body; `$O9 = HO9("xhigh")`, `qO9 = HO9("max")`) | cli_inner_pretty.js:600389 | function |
| `ie6` | `rememberUltraConsent` (set the `GU4` consent latch after the user accepts usage-credit billing) | cli_inner_pretty.js:502826 | function |
| `iyz` | `verifyPhaseRecall` ("## Phase 2 — Verify (1-vote, recall-biased)" — PLAUSIBLE-by-default verifier; used by high) | cli_inner_pretty.js:600458 | variable |
| `Ji4` | `BUNDLED_COMMANDS` (the bundled-prompt-command registry array; initialized to `[]`) | cli_inner_pretty.js:524295 | variable |
| `jk` | `isCommandEnabled` (`isEnabled?.() ?? true` for a registered command record) | cli_inner_pretty.js:395641 | function |
| `k3` | `getEffortFromState` (read the session's current effort, letting an `effort`-kind permission layer override it) | cli_inner_pretty.js:453183 | function |
| `kO9` | `simplifyPromptInit` (module-init thunk that calls `Ff()` then assigns `Ehz`/`SIMPLIFY_PROMPT`) | cli_inner_pretty.js:601375 | function |
| `KkH` | `isEffortLevel` (membership test: `dN.includes(value)`) | cli_inner_pretty.js:184859 | function |
| `lq$` | `efficiencyAngle` ("### Efficiency" cleanup angle: redundant compute/IO, serial independent ops, startup/hot-path blocking) | cli_inner_pretty.js:600287 | variable |
| `LU4` | `getUltraModel` (`tengu_review_bughunter_config.model` or `undefined`) | cli_inner_pretty.js:502743 | function |
| `nP8` | `isInsideGitWorkTree` (`git rev-parse --is-inside-work-tree` precondition for ultra scope resolution) | cli_inner_pretty.js:372570 | function |
| `nq$` | `altitudeAngle` ("### Altitude" cleanup angle: is the fix at the right depth? prefer generalizing over special-casing) | cli_inner_pretty.js:600293 | variable |
| `nyz` | `correctnessAnglesDE` (A/B/C from `p1q` + Angle D language-pitfall + Angle E wrapper/proxy; xhigh/max only) | cli_inner_pretty.js:600421 | variable |
| `oe6` | `evaluateUltraPreflight` (turn the server preflight into `proceed` / `blocked` / `needs-confirm`) | cli_inner_pretty.js:502896 | function |
| `or` | `resolveEffortForModel` (clamp requested effort against the model's ceiling; downgrade `max`/`xhigh` → `high` on unsupported models) | cli_inner_pretty.js:184909 | function |
| `ow$` | `modelSupportsMax` (does this model allow `max` effort? Opus 4.6/4.7/4.8 + Sonnet 4.6; honors `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT`) | cli_inner_pretty.js:184816 | function |
| `oyz` | `effortPromptMap` (`{low,medium,high,xhigh,max}` → effort-specific prompt body) | cli_inner_pretty.js:600659 | object |
| `p1q` | `correctnessAnglesABC` (the 3 baseline bug-finding angles: A line-by-line scan, B removed-behavior auditor, C cross-file tracer) | cli_inner_pretty.js:600300 | variable |
| `pI8` | `EFFORT_LEVELS_LOCAL` (the code-review module's re-bind of the effort ladder: `pI8 = dN`) | cli_inner_pretty.js:600660 | variable |
| `pN8` | `runUltrareview` (top-level orchestrator: `WF()` gate → `re6` scope → `oe6` preflight → confirm → `ae6` launch) | cli_inner_pretty.js:503046 | function |
| `q48` | `getDefaultEffortForModel` (`"high"` for `claude-opus-4-8`, `"xhigh"` for `claude-opus-4-7`, else `"high"`) | cli_inner_pretty.js:184987 | function |
| `Q1q` | `buildFindingsOutputSchema` (function of the finding cap `n` → the `## Output` JSON-array schema; `Q1q(8)`/`Q1q(10)`/`Q1q(15)`) | cli_inner_pretty.js:600342 | function |
| `qhz` | `buildEffortFallbackPreamble` (cloud-fallback / model-can't-self-launch / unrecognized-effort notice prepended to the body) | cli_inner_pretty.js:600578 | function |
| `qO9` | `maxEffortPrompt` (`HO9("max")` — 5+4 angles × 8 + sweep, ≤15, "maximum" framing) | cli_inner_pretty.js:600528 | variable |
| `QU4` | `ultrareviewSlashCommand` (the `/ultrareview` local-jsx command, now described as "Alias of /code-review ultra"; gates on `WF()`) | cli_inner_pretty.js:504286 | object |
| `re6` | `resolveUltraScope` (turn the arg into a `{mode:"pr"…}` or `{mode:"branch"…}` scope, or an actionable precondition error) | cli_inner_pretty.js:502833 | function |
| `ryz` | `sweepPhase` ("## Phase 3 — Sweep for gaps" — one fresh finder over the verified list; xhigh/max only, ≤8 additional) | cli_inner_pretty.js:600329 | variable |
| `s$7` | `EFFORT_ALIASES` (`{ med: "medium" }`) | cli_inner_pretty.js:185010 | constant |
| `sf9` | `lowEffortPrompt` (low effort: 1 diff pass, no subagents, no verify, ≤4 findings, plain-text output) | cli_inner_pretty.js:600360 | variable |
| `sq` | `AGENT_TOOL_NAME` (`"Agent"`; the tool every review body dispatches finders/verifiers/sweepers through) | cli_inner_pretty.js:185637 | constant |
| `syz` | `FIX_SUFFIX_BLOCK` ("## Applying fixes (--fix)" — apply findings to the working tree, with three explicit skip conditions) | cli_inner_pretty.js:600638 | constant |
| `tf9` | `mediumEffortPrompt` (medium effort: 3+4 angles × 6, precision-biased verify (`af9`), ≤8) | cli_inner_pretty.js:600478 | variable |
| `tyz` | `EFFORT_PREFIX_RE` (`/^(low\|med\|hig\|xhi\|max)[a-z]*$/i` "did you mean an effort?" matcher, built from the first 3 letters of each level) | cli_inner_pretty.js:600661 | variable |
| `U1q` | `reuseAngleIntro` ("### Reuse" header that wraps `BI8`; introduces the cleanup angles) | cli_inner_pretty.js:600438 | variable |
| `vR` | `escapeRegex` (escape regex metacharacters in a dynamically-built flag-name `RegExp`) | cli_inner_pretty.js:9649 | function |
| `vO9` | `registerSimplify` (registers the cleanup-only `/simplify` bundled command via `bA`) | cli_inner_pretty.js:601350 | function |
| `WF` | `isCloudReviewAvailable` (ultra gate: `bughunterConfig().enabled === true && ccrBridgeReady() && !isRemoteWorkspace()`) | cli_inner_pretty.js:502747 | function |
| `WU4` | `fetchUltrareviewPreflight` (`GET /v1/ultrareview/preflight`, `auth: teleport-org`, 5s timeout; maps refusal reasons to blocks) | cli_inner_pretty.js:502758 | function |
| `x8$` | `getReviewBughunterConfig` (reads the `tengu_review_bughunter_config` feature gate object) | cli_inner_pretty.js:502732 | function |
| `ycH` | `modelSupportsXhigh` (does this model allow `xhigh` effort? Opus 4.7/4.8 only) | cli_inner_pretty.js:184834 | function |
| `Y18` | `CODE_REVIEW_NAME` (`"code-review"` command-name constant) | cli_inner_pretty.js:211646 | constant |
| `zO9` | `registerCodeReview` (registers `/code-review` via `bA`; wires `subcommands: { ultra: "ultrareview" }` and `getEffort`) | cli_inner_pretty.js:600612 | function |

---

## Naming notes

- **`F1q` canon = `cleanupOutputNote`** (was split across docs as `cleanupShapeNote` in
  `review_prompt_algorithm.md`/this file and `cleanupRankingNote` in `simplify_and_cloud_review.md`).
  Reading the source at cli_inner_pretty.js:600325-600326, `F1q` carries **both** concerns —
  the output *shape* for cleanup/altitude findings (`file`/`line`/`summary` + a cost-not-crash
  `failure_scenario`) **and** a cross-type ranking rule ("Correctness bugs always outrank cleanup
  and altitude findings when the output cap forces a cut"). Neither single-aspect name was
  accurate; `cleanupOutputNote` covers both. All three module docs now use this one name.

## Notes & gaps

- The seed table carried two rows for `dq$` (once as constant `gatherDiffPhase` / infra_integration,
  once as variable `gatherDiffPhase` / core_features). It is a single `var` (`var dq$ = …`,
  cli_inner_pretty.js:600275), so it appears **once** here as a `variable` and is filed in
  `symbol_index_core_features.md` with the other review-angle fragment vars.
- `Vs` (`getUltraDurationNote`, cli_inner_pretty.js:502739) is included for completeness as the
  duration-note companion to `gIH`/`LU4`; it powers the `QU4` description and the `ae6` launch banner.
- The cloud-bridge eligibility/launch helpers `ALH` (`checkRemoteReviewEligibility`), `_l`
  (`createTeleportSession`), `OSH` (`registerRemoteTask`), `j44` (`remoteReviewNoOutputNotice`),
  `y74` (repo-too-large guard), and the Zod schema `PU4` are referenced by the module docs but belong
  to the broader teleport/remote-session subsystem (Module 40 `10_promoted_ultrareview.md`); they are
  **out of scope** for this seed-driven additions file and should be consolidated there in a later pass.
- `Tn1` (`semver.simplifyRange`, cli_inner_pretty.js:117204) is deliberately **excluded** — it is an
  unrelated vendored-semver export flagged in the docs only to prevent a naming-collision misread.
