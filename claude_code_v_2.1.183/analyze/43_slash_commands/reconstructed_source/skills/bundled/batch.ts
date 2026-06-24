// =============================================================================
// /batch bundled skill — Claude Code v2.1.183 (readable-source reconstruction)
//
// v2.1.183 regions covered (PRIMARY bundle cli_inner_pretty.js):
//   - registerBatchSkill = pzl            @637828-637845
//   - buildBatchPrompt   = h$f            @637757-637827 (3-phase coordinator prompt)
//   - WORKER_INSTRUCTIONS = g$f           decl @637849, assigned @637863-637868 in init fzl @637858
//   - MISSING_INSTRUCTION_MESSAGE = _$f   @637852-637857
//   - NOT_A_GIT_REPO_MESSAGE = y$f        @637850-637851
//   - MIN_AGENTS = uzl = 5                @637847
//   - MAX_AGENTS = dzl = 30               @637848
//   - getIsGit = T_ (memoized git check)  assigned @51962
//   - registerBundledSkill = ap           @546973
//   Tool-name constants: ENTER_PLAN_MODE A7@221314, ASK_USER_QUESTION Ff@221315,
//     EXIT_PLAN_MODE yx@152252, AGENT vs@149939, SKILL mH@221449
//
// v2.1.88 ancestor / convention path: src/skills/bundled/batch.ts (registerBatchSkill,
//   buildPrompt, WORKER_INSTRUCTIONS); registrar shape src/skills/bundledSkills.ts.
//
// 2.1.156 -> 2.1.183 delta: ONLY the `menuDescription` field was added to the
//   registration ("Plan a large change; background agents each open a PR"); all prompt
//   bodies are byte-identical to 2.1.156 (worker step 1 was already "code-review" in 156).
//
// Cross-validation: assets/slash_commands.json lists /batch as user-invocable; the
//   `code-review` skill invoked by worker step 1 exists as a sibling bundled skill.
//
// Delta vs the v2.1.88 ancestor (predates 2.1.156): worker step 1 changed from
//   "**Simplify** … skill: \"simplify\"" to "**Code review** … skill: \"code-review\"".
// =============================================================================

import { AGENT_TOOL_NAME } from '../../tools/AgentTool/constants.js'
import { ASK_USER_QUESTION_TOOL_NAME } from '../../tools/AskUserQuestionTool/prompt.js'
import { ENTER_PLAN_MODE_TOOL_NAME } from '../../tools/EnterPlanModeTool/constants.js'
import { EXIT_PLAN_MODE_TOOL_NAME } from '../../tools/ExitPlanModeTool/constants.js'
import { SKILL_TOOL_NAME } from '../../tools/SkillTool/constants.js'
import { getIsGit } from '../../utils/git.js'
import { registerBundledSkill } from '../bundledSkills.js'

// 2.1.183: MIN_AGENTS = uzl = 5 @637847
const MIN_AGENTS = 5
// 2.1.183: MAX_AGENTS = dzl = 30 @637848
const MAX_AGENTS = 30

// 2.1.183: WORKER_INSTRUCTIONS = g$f (decl @637849; assigned inside init fn fzl @637858, body @637863-637868)
// Verbatim from bundle lines 637863-637868. Interpolation ${SKILL_TOOL_NAME} = mH ("Skill") @221449.
// Delta vs 2.1.88: step 1 was **Simplify** / skill: "simplify"; 183 (and 156) use **Code review** / skill: "code-review".
const WORKER_INSTRUCTIONS = `After you finish implementing the change:
1. **Code review** — Invoke the \`${SKILL_TOOL_NAME}\` tool with \`skill: "code-review"\` to find correctness bugs (it reports findings; it does not edit code). Fix any findings it surfaces before continuing.
2. **Run unit tests** — Run the project's test suite (check for package.json scripts, Makefile targets, or common commands like \`npm test\`, \`bun test\`, \`pytest\`, \`go test\`). If tests fail, fix them.
3. **Test end-to-end** — Follow the e2e test recipe from the coordinator's prompt (below). If the recipe says to skip e2e for this unit, skip it.
4. **Commit and push** — Commit all changes with a clear message, push the branch, and create a PR with \`gh pr create\`. Use a descriptive title. If \`gh\` is not available or the push fails, note it in your final message.
5. **Report** — End with a single line: \`PR: <url>\` so the coordinator can track it. If no PR was created, end with \`PR: none — <reason>\`.`

// 2.1.183: buildBatchPrompt = h$f @637757
// Verbatim coordinator prompt from bundle lines 637758-637825 (3 phases). Interpolations:
//   ${ENTER_PLAN_MODE_TOOL_NAME} = A7 ("EnterPlanMode") @221314  — Phase 1 step "Call the … tool now to enter plan mode"
//   ${ASK_USER_QUESTION_TOOL_NAME} = Ff ("AskUserQuestion") @221315 — Phase 1 step 3
//   ${EXIT_PLAN_MODE_TOOL_NAME} = yx ("ExitPlanMode") @152252       — Phase 1 step 5
//   ${AGENT_TOOL_NAME} = vs ("Agent") @149939                       — Phase 2
//   ${MIN_AGENTS}/${MAX_AGENTS} = uzl/dzl                           — Phase 1 step 2
//   ${WORKER_INSTRUCTIONS} = g$f                                    — Phase 2 verbatim block
function buildBatchPrompt(instruction: string): string {
  return `# Batch: Parallel Work Orchestration

You are orchestrating a large, parallelizable change across this codebase.

## User Instruction

${instruction}

## Phase 1: Research and Plan (Plan Mode)

Call the \`${ENTER_PLAN_MODE_TOOL_NAME}\` tool now to enter plan mode, then:

1. **Understand the scope.** Launch one or more subagents (in the foreground — you need their results) to deeply research what this instruction touches. Find all the files, patterns, and call sites that need to change. Understand the existing conventions so the migration is consistent.

2. **Decompose into independent units.** Break the work into ${MIN_AGENTS}–${MAX_AGENTS} self-contained units. Each unit must:
   - Be independently implementable in an isolated git worktree (no shared state with sibling units)
   - Be mergeable on its own without depending on another unit's PR landing first
   - Be roughly uniform in size (split large units, merge trivial ones)

   Scale the count to the actual work: few files → closer to ${MIN_AGENTS}; hundreds of files → closer to ${MAX_AGENTS}. Prefer per-directory or per-module slicing over arbitrary file lists.

3. **Determine the e2e test recipe.** Figure out how a worker can verify its change actually works end-to-end — not just that unit tests pass. Look for:
   - A \`claude-in-chrome\` skill or browser-automation tool (for UI changes: click through the affected flow, screenshot the result)
   - A \`tmux\` or CLI-verifier skill (for CLI changes: launch the app interactively, exercise the changed behavior)
   - A dev-server + curl pattern (for API changes: start the server, hit the affected endpoints)
   - An existing e2e/integration test suite the worker can run

   If you cannot find a concrete e2e path, use the \`${ASK_USER_QUESTION_TOOL_NAME}\` tool to ask the user how to verify this change end-to-end. Offer 2–3 specific options based on what you found (e.g., "Screenshot via chrome extension", "Run \`bun run dev\` and curl the endpoint", "No e2e — unit tests are sufficient"). Do not skip this — the workers cannot ask the user themselves.

   Write the recipe as a short, concrete set of steps that a worker can execute autonomously. Include any setup (start a dev server, build first) and the exact command/interaction to verify.

4. **Write the plan.** In your plan file, include:
   - A summary of what you found during research
   - A numbered list of work units — for each: a short title, the list of files/directories it covers, and a one-line description of the change
   - The e2e test recipe (or "skip e2e because …" if the user chose that)
   - The exact worker instructions you will give each agent (the shared template)

5. Call \`${EXIT_PLAN_MODE_TOOL_NAME}\` to present the plan for approval.

## Phase 2: Spawn Workers (After Plan Approval)

Once the plan is approved, spawn one background agent per work unit using the \`${AGENT_TOOL_NAME}\` tool. **All agents must use \`isolation: "worktree"\` and \`run_in_background: true\`.** Launch them all in a single message block so they run in parallel.

For each agent, the prompt must be fully self-contained. Include:
- The overall goal (the user's instruction)
- This unit's specific task (title, file list, change description — copied verbatim from your plan)
- Any codebase conventions you discovered that the worker needs to follow
- The e2e test recipe from your plan (or "skip e2e because …")
- The worker instructions below, copied verbatim:

\`\`\`
${WORKER_INSTRUCTIONS}
\`\`\`

Use \`subagent_type: "general-purpose"\` unless a more specific agent type fits.

## Phase 3: Track Progress

After launching all workers, render an initial status table:

| # | Unit | Status | PR |
|---|------|--------|----|
| 1 | <title> | running | — |
| 2 | <title> | running | — |

As background-agent completion notifications arrive, parse the \`PR: <url>\` line from each agent's result and re-render the table with updated status (\`done\` / \`failed\`) and PR links. Keep a brief failure note for any agent that did not produce a PR.

When all agents have reported, render the final table and a one-line summary (e.g., "22/24 units landed as PRs").
`
}

// 2.1.183: NOT_A_GIT_REPO_MESSAGE = y$f @637850-637851 — verbatim, byte-identical to 2.1.88 ancestor.
const NOT_A_GIT_REPO_MESSAGE = `This is not a git repository. The \`/batch\` command requires a git repo because it spawns agents in isolated git worktrees and creates PRs from each. Initialize a repo first, or run this from inside an existing one.`

// 2.1.183: MISSING_INSTRUCTION_MESSAGE = _$f @637852-637857 — verbatim, byte-identical to 2.1.88 ancestor.
const MISSING_INSTRUCTION_MESSAGE = `Provide an instruction describing the batch change you want to make.

Examples:
  /batch migrate from react to vue
  /batch replace all uses of lodash with native equivalents
  /batch add type annotations to all untyped function parameters`

// 2.1.183: registerBatchSkill = pzl @637828
// Registers the /batch bundled skill. 2.1.156 -> 2.1.183 delta: `menuDescription` field added.
export function registerBatchSkill(): void {
  registerBundledSkill({
    name: 'batch',
    // 2.1.183: NEW field vs 2.1.156 @637831
    menuDescription: 'Plan a large change; background agents each open a PR',
    description:
      'Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR.',
    whenToUse:
      'Use when the user wants to make a sweeping, mechanical change across many files (migrations, refactors, bulk renames) that can be decomposed into independent parallel units.',
    argumentHint: '<instruction>',
    userInvocable: true,
    disableModelInvocation: true,
    async getPromptForCommand(args) {
      const instruction = args.trim()
      // @637841: empty args -> usage/help message
      if (!instruction) {
        return [{ type: 'text', text: MISSING_INSTRUCTION_MESSAGE }]
      }

      // @637842: getIsGit = T_ (memoized async git-repo check)
      const isGit = await getIsGit()
      if (!isGit) {
        return [{ type: 'text', text: NOT_A_GIT_REPO_MESSAGE }]
      }

      // @637843: emit the 3-phase coordinator prompt
      return [{ type: 'text', text: buildBatchPrompt(instruction) }]
    },
  })
}
