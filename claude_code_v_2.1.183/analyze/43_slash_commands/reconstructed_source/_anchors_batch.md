# Anchor Dossier — `/batch` bundled skill (Claude Code v2.1.183)

> Reconstruction target: `reconstructed_source/skills/bundled/batch.ts`
> v2.1.88 named-TS ancestor: `src/skills/bundled/batch.ts` (`registerBatchSkill` / `buildPrompt` / `WORKER_INSTRUCTIONS`).
> PRIMARY truth bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js`.
> SCAFFOLD (before-picture) bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.156/extract/cli_inner_pretty.js`.

## Load-bearing symbols (v2.1.183)

| Readable | Obf (183) | Line (183) | Obf (156) | Role |
|----------|-----------|------------|-----------|------|
| `registerBatchSkill` | `pzl` | 637828 | `nf9` @600204 | Exporter — calls `registerBundledSkill({...})` for `name:"batch"` |
| `buildBatchPrompt` | `h$f` | 637757 | `gyz` @600132 | Coordinator prompt builder (3-phase orchestration) |
| `WORKER_INSTRUCTIONS` | `g$f` | decl 637849; assigned @637863-637868 inside init `fzl`@637858 | `Qyz` (init `if9`@600232) @600237 | 5-step worker checklist injected into each agent prompt |
| `MISSING_INSTRUCTION_MESSAGE` | `_$f` | 637852 | `cyz` @600226 | Returned when args are empty |
| `NOT_A_GIT_REPO_MESSAGE` | `y$f` | 637850 | `dyz` @600224 | Returned when not in a git repo |
| `MIN_AGENTS` | `uzl` = `5` | 637847 | `cf9`=5 @600221 | Lower bound of unit decomposition |
| `MAX_AGENTS` | `dzl` = `30` | 637848 | `lf9`=30 @600222 | Upper bound of unit decomposition |
| `registerBundledSkill` | `ap` | 546973 | `bA` | Registrar (= v2.1.88 `registerBundledSkill`) |
| `getIsGit` | `T_` | assigned @51962 (memoized via `wn`) | `sJ` | Memoized async git-repo check; emits `is_git_check_started`/`is_git_check_completed` telemetry |

### Tool-name constants interpolated into the prompts

| Readable | Obf (183) | Value | Line (183) | Used in |
|----------|-----------|-------|------------|---------|
| `ENTER_PLAN_MODE_TOOL_NAME` | `A7` | `"EnterPlanMode"` | 221314 | coordinator Phase 1 (`Call the \`${A7}\` tool now to enter plan mode`) |
| `ASK_USER_QUESTION_TOOL_NAME` | `Ff` | `"AskUserQuestion"` | 221315 | coordinator Phase 1 step 3 (ask the user how to verify e2e) |
| `EXIT_PLAN_MODE_TOOL_NAME` | `yx` | `"ExitPlanMode"` | 152252 (`var yx = "ExitPlanMode"`) | coordinator Phase 1 step 5 (`Call \`${yx}\``) |
| `AGENT_TOOL_NAME` | `vs` | `"Agent"` | 149939 | coordinator Phase 2 (spawn workers via `${vs}` tool) |
| `SKILL_TOOL_NAME` | `mH` | `"Skill"` | 221449 | WORKER_INSTRUCTIONS step 1 (`Invoke the \`${mH}\` tool with \`skill: "code-review"\``) |

> Note: in the v2.1.183 bundle the coordinator's Phase-1 step-1 plan-mode call uses **`${A7}` = EnterPlanMode**, and Phase-1 step-5 uses **`${yx}` = ExitPlanMode**. This matches the v2.1.88 ancestor which imported both `ENTER_PLAN_MODE_TOOL_NAME` and `EXIT_PLAN_MODE_TOOL_NAME`.

## Verbatim prompt strings captured

All strings below were read directly from the 183 bundle (`–`/`—`/`…`/`→` decoded to real chars in the reconstructed `.ts`; bundle stores them as `\u` escapes).

1. **Coordinator prompt** `buildBatchPrompt` (`h$f`) — bundle lines **637758–637825** (full `# Batch: Parallel Work Orchestration` template through Phase 3 table + final summary line). 3 phases: Phase 1 Research and Plan (Plan Mode), Phase 2 Spawn Workers, Phase 3 Track Progress.
2. **Worker instructions** `WORKER_INSTRUCTIONS` (`g$f`) — bundle lines **637863–637868** (5-step checklist: Code review via `${mH}` `skill:"code-review"` / Run unit tests / Test end-to-end / Commit and push / Report `PR: <url>`).
3. **`NOT_A_GIT_REPO_MESSAGE`** (`y$f`) — bundle lines **637850–637851**: `"This is not a git repository. The \`/batch\` command requires a git repo because it spawns agents in isolated git worktrees and creates PRs from each. Initialize a repo first, or run this from inside an existing one."`
4. **`MISSING_INSTRUCTION_MESSAGE`** (`_$f`) — bundle lines **637852–637857** (`Provide an instruction…` with 3 `/batch …` examples).
5. **Registration metadata strings** (`pzl` @637828–637845):
   - `menuDescription`: `"Plan a large change; background agents each open a PR"`
   - `description`: `"Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR."`
   - `whenToUse`: `"Use when the user wants to make a sweeping, mechanical change across many files (migrations, refactors, bulk renames) that can be decomposed into independent parallel units."`
   - `argumentHint`: `"<instruction>"`
   - `userInvocable: !0` (true), `disableModelInvocation: !0` (true)

## v2.1.88 ancestor mapping

| v2.1.88 (`src/skills/bundled/batch.ts`) | v2.1.183 obf | Notes |
|-----------------------------------------|--------------|-------|
| `registerBatchSkill()` | `pzl` | Same `registerBundledSkill({...})` shape |
| `buildPrompt(instruction)` | `h$f(e)` | Renamed to `buildBatchPrompt` in reconstruction |
| `WORKER_INSTRUCTIONS` | `g$f` | step 1 changed: `simplify` → `code-review` (see delta) |
| `NOT_A_GIT_REPO_MESSAGE` | `y$f` | byte-identical text |
| `MISSING_INSTRUCTION_MESSAGE` | `_$f` | byte-identical text |
| `MIN_AGENTS=5`, `MAX_AGENTS=30` | `uzl`, `dzl` | unchanged |
| `getIsGit` (`utils/git.js`) | `T_` | unchanged behavior |
| `registerBundledSkill` (`bundledSkills.js`) | `ap` | unchanged registrar |
| imports `ENTER_PLAN_MODE_TOOL_NAME`, `EXIT_PLAN_MODE_TOOL_NAME`, `ASK_USER_QUESTION_TOOL_NAME`, `AGENT_TOOL_NAME`, `SKILL_TOOL_NAME` | `A7`,`yx`,`Ff`,`vs`,`mH` | same tool-name constants |

### Delta vs v2.1.88 ancestor (carried in, NOT a 156→183 change)
- **Worker step 1 rewritten**: v2.1.88 = `**Simplify** — Invoke the \`${SKILL_TOOL_NAME}\` tool with \`skill: "simplify"\` to review and clean up your changes.` → 183 = `**Code review** — Invoke the \`${SKILL_TOOL_NAME}\` tool with \`skill: "code-review"\` to find correctness bugs (it reports findings; it does not edit code). Fix any findings it surfaces before continuing.` This change was **already present in 2.1.156** (`ZX` `skill:"code-review"` @600238), so it predates 2.1.156.
- The coordinator prompt body, the two messages, MIN/MAX, and registration flags are otherwise unchanged from v2.1.88 → 183.

## 2.1.156 → 2.1.183 delta (the only change in this build)

- **`menuDescription` field ADDED** to the batch registration: `menuDescription: "Plan a large change; background agents each open a PR"` (183 `pzl` @637831). The 2.1.156 registration (`nf9` @600205) has **no `menuDescription`**. This is a systematic 2.1.183 addition across bundled skills (e.g. `claude-in-chrome` `mzl` also gained `menuDescription: "Let Claude browse and interact with pages in your Chrome"` @637873). The `BundledSkillDefinition` type in the v2.1.88 ancestor has no `menuDescription` field, confirming it is a newer schema addition.
- **Prompt bodies are byte-identical 156→183** (verified by normalized diff that masked `${…}` interpolation variables; the only diffs were the function-name lines `gyz`→`h$f` and the const-name line `Qyz`→`g$f`).

## Cross-validation
- `extract/assets/slash_commands.json` lists `/batch` as a user-invocable command (consistent with `userInvocable:!0`, `disableModelInvocation:!0`).
- The `code-review` skill referenced by worker step 1 exists as a bundled skill (corroborated by the available-skills list and the `code-review` finder-angle review path in the same bundle).

## Open questions
- None blocking. `getIsGit` (`T_`) is a memoized wrapper (`wn(asyncFn, …)`); the cache key/invalidation detail is not load-bearing for the `/batch` reconstruction and was not fully traced.
