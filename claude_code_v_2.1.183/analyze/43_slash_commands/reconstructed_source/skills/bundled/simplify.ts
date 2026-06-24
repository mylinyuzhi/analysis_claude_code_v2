// =============================================================================
// /simplify bundled skill — readable-source reconstruction (Claude Code v2.1.183)
//
// v2.1.183 regions covered (PRIMARY: versions/2.1.183/extract/cli_inner_pretty.js):
//   - registerSimplifySkill = OKl                 @647978   (calls ap = registerBundledSkill @546973)
//   - skill name "simplify"  = BUt                @372051
//   - SIMPLIFY_PROMPT        = ZOf  (decl @648003, assigned in module-init NKl @648004; body @648007-648036)
//   - Phase 0 preamble       = _dt                @435519
//   - Reuse angle body       = bdt                @435521
//   - Simplification angle   = fLe                @435525
//   - Efficiency angle       = mLe                @435531  (expanded vs 2.1.156)
//   - Altitude angle         = ALe                @435554  (the new 4th angle vs the 2.1.88 3-agent form)
//   - AGENT_TOOL_NAME "Agent"= vs                 @149939  (interpolated as ${vs})
//
// v2.1.88 ancestor / convention: src/skills/bundled/simplify.ts
//   (registerSimplifySkill, SIMPLIFY_PROMPT — 3 review agents: Reuse / Quality / Efficiency).
//   Registrar shape from src/skills/bundledSkills.ts (registerBundledSkill / BundledSkillDefinition).
//
// 2.1.156 -> 2.1.183 delta (one line): same 4-agent structure; TWO changes — (a) a NEW
//   menuDescription field ("Clean up the changed code without changing behavior") was added to the
//   registration (absent in 2.1.156 vO9@601350), and (b) the Efficiency angle gained a
//   closure/captured-environment memory-leak paragraph; all else is just re-mangled symbols + line shifts.
//
// Cross-validation: ZOf body matches extract/assets/prompts/194_simplify-4-cleanup-agents-in-parallel.txt
//   (the decoded asset has the same wording with the ${...} interpolation slots blanked).
//
// NOTE on the 3->4 agent evolution (vs the v2.1.88 ancestor): the angles are factored into shared
//   module-level consts (reused by the /code-review family). The 4th angle "Altitude" is genuinely new
//   in the >2.1.88 line — it checks each change is implemented at the right DEPTH rather than as a
//   special-case bandaid. (A 5th "Conventions (CLAUDE.md)" angle = Sdt @435541 exists in the 183 bundle
//   but is NOT wired into /simplify; it is intentionally omitted here. See _anchors_simplify.md §5.)
//
// Verbatim prompt strings below are copied EXACTLY from the 2.1.183 bundle (— decoded to —,
//   → decoded to →). Do not paraphrase or reflow — this text IS the user-facing behavior.
// =============================================================================

import { AGENT_TOOL_NAME } from '../../tools/AgentTool/constants.js'
import { registerBundledSkill } from '../bundledSkills.js'

// 2.1.183: SKILL_NAME = BUt @372051
const SKILL_NAME = 'simplify'

// -----------------------------------------------------------------------------
// Review-angle blocks. In the bundle these are shared module-level consts at
// chunks @435519-435559 (reused across the review prompts); here they are
// co-located with the skill that assembles them, matching the v2.1.88 idiom.
// -----------------------------------------------------------------------------

// 2.1.183: DIFF_PREAMBLE = _dt @435519  (Phase 0 — establishes the review scope/diff)
const DIFF_PREAMBLE = `## Phase 0 — Gather the diff

Run \`git diff @{upstream}...HEAD\` (or \`git diff main...HEAD\` / \`git diff HEAD~1\`
if there's no upstream) to get the unified diff under review. If there are
uncommitted changes, or the range diff is empty, also run \`git diff HEAD\` and
include the working-tree changes in scope — the review often runs before the
commit. If a PR number, branch name, or file path was passed as an argument,
review that target instead. Treat this diff as the review scope.
`

// 2.1.183: REUSE_ANGLE_BODY = bdt @435521
// (The "### Reuse" header is hardcoded in SIMPLIFY_PROMPT; only the body is interpolated.)
const REUSE_ANGLE_BODY = `Flag new code that re-implements something the codebase
already has — Grep shared/utility modules and files adjacent to the change,
and name the existing helper to call instead.
`

// 2.1.183: SIMPLIFICATION_ANGLE = fLe @435525
const SIMPLIFICATION_ANGLE = `### Simplification

Flag unnecessary complexity the diff adds: redundant or derivable state,
copy-paste with slight variation, deep nesting, dead code left behind. Name
the simpler form that does the same job.
`

// 2.1.183: EFFICIENCY_ANGLE = mLe @435531
// DELTA vs 2.1.156 (lq$): the closures/captured-environment memory-leak paragraph is NEW in 183.
const EFFICIENCY_ANGLE = `### Efficiency

Flag wasted work the diff introduces: redundant computation or repeated I/O,
independent operations run sequentially, blocking work added to startup or
hot paths. Also flag long-lived objects built from closures or captured
environments — they keep the entire enclosing scope alive for the object's
lifetime (a memory leak when that scope holds large values); prefer a
class/struct that copies only the fields it needs. Name the cheaper
alternative.
`

// 2.1.183: ALTITUDE_ANGLE = ALe @435554  (the NEW 4th angle vs the v2.1.88 3-agent form)
const ALTITUDE_ANGLE = `### Altitude

Check that each change is implemented at the right depth, not as a fragile
bandaid. Special cases layered on shared infrastructure are a sign the fix
isn't deep enough — prefer generalizing the underlying mechanism over adding
special cases.
`

// -----------------------------------------------------------------------------
// 2.1.183: SIMPLIFY_PROMPT = ZOf @648003 (assembled in module-init NKl @648004; body @648007-648036)
// ${AGENT_TOOL_NAME} reproduces the bundle's ${vs} ("Agent" @149939) interpolation.
// -----------------------------------------------------------------------------
const SIMPLIFY_PROMPT = `\`/simplify → 4 cleanup agents in parallel → apply the fixes\`

You are improving the quality of the changed code, not hunting for bugs. Review
it for reuse, simplification, efficiency, and altitude issues, then fix what you
find. Do not look for correctness bugs — that is what \`/code-review\` is for.

${DIFF_PREAMBLE}
## Phase 1 — Review (4 cleanup agents in parallel)

Launch **4 independent review agents** via the ${AGENT_TOOL_NAME} tool, all in a
single message so they run concurrently. Pass each agent the diff and one of
the four angles below. Each returns its findings with \`file\`, \`line\`, a
one-line \`summary\`, and the concrete cost (what is duplicated, wasted, or
harder to maintain).

### Reuse

${REUSE_ANGLE_BODY}
${SIMPLIFICATION_ANGLE}
${EFFICIENCY_ANGLE}
${ALTITUDE_ANGLE}
## Phase 2 — Apply the fixes

Wait for all four agents to complete, dedup findings that point at the same
line or mechanism, and fix each remaining one directly. Skip any finding whose
fix would change intended behavior, require changes well outside the reviewed
diff, or that you judge to be a false positive — note the skip rather than
arguing with it. Finish with a brief summary of what was fixed and what was
skipped (or confirm the code was already clean).
`

// 2.1.183: registerSimplifySkill = OKl @647978  (body calls ap = registerBundledSkill @546973)
export function registerSimplifySkill(): void {
  registerBundledSkill({
    name: SKILL_NAME,
    menuDescription: 'Clean up the changed code without changing behavior', // @647981
    description:
      'Review the changed code for reuse, simplification, efficiency, and altitude cleanups, then apply the fixes. Quality only — it does not hunt for bugs; use /code-review for that.', // @647982-647983
    argumentHint: '[<target>]', // @647984
    userInvocable: true, // @647985
    // getPromptForCommand @647986-647999: when an argument is present, PREPEND a
    // "Review target: `<arg>`" line before the prompt (vs the v2.1.88 ancestor which
    // appended an "## Additional Focus" block). Otherwise emit the prompt unchanged.
    async getPromptForCommand(args) {
      const target = args.trim() // @647987
      const prefix = target ? `Review target: \`${target}\`\n\n` : '' // @647991-647997
      return [{ type: 'text', text: `${prefix}${SIMPLIFY_PROMPT}` }]
    },
  })
}
