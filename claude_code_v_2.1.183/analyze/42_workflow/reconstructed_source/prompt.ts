/**
 * Workflow tool description / authoring prompt — readable-source restoration
 * (Claude Code v2.1.183)
 *
 * Subsystem: the model-facing orchestration spec. This is the single giant string the model
 * reads as the Workflow tool's `prompt()` AND `description()` (both getters return it verbatim).
 * It teaches three things at once:
 *   1. The OPT-IN POLICY — when the model is (and is not) allowed to call Workflow. The whole
 *      point is that workflows can spawn dozens of agents and burn a large amount of tokens, so
 *      the model must never *infer* that scale; the user has to ask for it. The five explicit
 *      opt-in forms (the "ultracode" keyword, standing ultracode, own-words "use a workflow" /
 *      "run a workflow", a skill/slash-command instruction, a named/saved workflow) and the
 *      standing **Ultracode** section live here.
 *   2. The SCRIPTING DSL REFERENCE — the `agent()/pipeline()/parallel()/log()/phase()/workflow()`
 *      primitives, the `export const meta = {...}` header contract, the `args`/`budget` globals,
 *      and the JS-not-TS / no-`Date.now()` / determinism constraints.
 *   3. The ORCHESTRATION METHODOLOGY — the single-phase pattern catalog
 *      (Understand/Design/Review/Research/Migrate), the pipeline-vs-barrier decision rule, the
 *      loop-until-count / loop-until-budget / compose-exhaustive patterns, and the quality
 *      shapes (adversarial-verify, perspective-diverse verify, judge-panel, loop-until-dry,
 *      multi-modal sweep, completeness critic).
 *
 * The description is built lazily: a module-level `var gdo;` is declared empty (@418167) and
 * assigned inside the lazy init thunk `$Wa = E(() => { sl(); gdo = `…`; })` (@418168-418329).
 * The tool object (`workflowTool` = `DLp` @419420) returns it from BOTH `prompt()` (@419427) and
 * `description()` (@419430). Five `${…}` interpolation slots are spliced into the literal at
 * authoring time; in this build three are empty strings and two carry real values (see below).
 *
 * ── Evidence tiers (see _conventions.md) ─────────────────────────────────────────────
 * PRIMARY (truth) — v2.1.183 obfuscated bundle
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *   Regions reconstructed here (read directly, obf→readable re-derived):
 *     - WORKFLOW_DESCRIPTION    gdo   @418167 (decl), @418170-418328 (assigned text body)
 *     - WORKFLOW_ISOLATION_DESC aLp   @418164  (= "'worktree'", interpolated @418215)
 *     - (empty slot) EVERY_INVOCATION_SUFFIX   cLp   @418166  (= "", interpolated @418196)
 *     - (empty slot) RESUME_SUFFIX             iLp   @418163  (= "", interpolated @418196)
 *     - (empty slot) WORKTREE_SUFFIX           lLp   @418165  (= "", interpolated @418215)
 *     - NESTED_GROUP_GLYPH      sOe   @53770   (= "▸" = "▸", interpolated @418222)
 *     - workflowTool prompt()/description() getters return gdo  @419427 / @419430
 *   Cross-checked: `gdo` is referenced ONLY by those two getters (grep `gdo\b` → :418167 decl,
 *   :418170 assign, :419427 prompt(), :419430 description()). No other consumer.
 *
 * CONVENTION mirror — v2.1.88 named-TS tree (/lyz/codespace/3rd/claude-code/src)
 *   Workflow is gated-out there (`feature('WORKFLOW_SCRIPTS')`), so only the *shape* is borrowed:
 *   a tool description authored as an exported template-literal constant. The pattern is exactly
 *   `tools/AgentTool/prompt.ts` (its exported `getPrompt()` returning a template literal, with the
 *   tool name spliced in from the exported `AGENT_TOOL_NAME` constant) — the Workflow equivalent file would be
 *   `tools/WorkflowTool/prompt.ts`. No implementation to copy; mirrored layout only.
 *
 * SCAFFOLD — v2.1.156 baseline analysis
 *   42_workflow/workflow_authoring_and_orchestration.md (the `Fp6` authoring-prompt walkthrough)
 *   and workflow_tool_definition.md §4. Readable names inherited from there
 *   (WORKFLOW_DESCRIPTION, WORKFLOW_ISOLATION_DESC). Every line of text re-verified against the
 *   183 bundle — the prose itself drifted between 156 and 183 (see cross-validation note).
 *
 * ── Cross-validation note ────────────────────────────────────────────────────────────
 * Re-verified against the 183 bundle (NOT trusted from the 156 scaffold), line-for-line:
 *   - The opt-in list now includes own-words "use a workflow" / "run a workflow" / "fan out
 *     agents" / "orchestrate this with subagents" (@418177) and the standing **Ultracode**
 *     section (@418194) — a 156→183 prose delta, NOT a runtime detector (there is no regex for
 *     "run a workflow"; the only runtime matcher is the `ultracode` keyword matcher `hho`).
 *   - The `agent()` signature gained the per-call `effort?: string` opt
 *     ('low'|'medium'|'high'|'xhigh'|'max') @418215 — backed by the runtime `rB`/normalizeEffort
 *     read at @417123. The `isolation?` opt is typed by interpolating WORKFLOW_ISOLATION_DESC
 *     (`aLp` = "'worktree'") @418215.
 *   - Confirmed the three empty interpolation slots (`iLp`/`cLp`/`lLp` all = "") and the two live
 *     ones (`aLp` = "'worktree'", `sOe` = "▸"). Inlined them as named consts so the literal here
 *     is the exact string the model sees in THIS build.
 *   - All `—` de-escaped to em dash (—), `→` to →, `≥` to ≥, `▸` to ▸,
 *     `\xD7` to ×, `–5` (in "3–5") to the en-dash range "3–5", per the primer's
 *     "only de-escape unicode" rule. Prose is COPIED, never paraphrased.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Interpolation slots spliced into the description literal at authoring time.
// In v2.1.183 three are empty and two are live; kept as named consts so the
// exported string equals the byte-exact value the model is shown this build.
// ─────────────────────────────────────────────────────────────────────────────

// 2.1.183: WORKFLOW_ISOLATION_DESC = aLp @418164 (= "'worktree'")
// The only `isolation` value the agent() signature advertises (interpolated @418215).
export const WORKFLOW_ISOLATION_DESC = "'worktree'"

// 2.1.183: EVERY_INVOCATION_SUFFIX = cLp @418166 (= "") — trailing clause after "Every…"
const EVERY_INVOCATION_SUFFIX = ''
// 2.1.183: RESUME_SUFFIX = iLp @418163 (= "") — trailing clause after the scriptPath re-invoke tip
const RESUME_SUFFIX = ''
// 2.1.183: WORKTREE_SUFFIX = lLp @418165 (= "") — trailing clause after the worktree isolation note
const WORKTREE_SUFFIX = ''
// 2.1.183: NESTED_GROUP_GLYPH = sOe @53770 (= "▸" = "▸") — the /workflows nested-group prefix glyph
const NESTED_GROUP_GLYPH = '▸'

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW_DESCRIPTION — the model-facing Workflow tool prompt + description.
// 2.1.183: WORKFLOW_DESCRIPTION = gdo @418167 (decl), assigned @418170-418328
// Returned verbatim by workflowTool.prompt() (@419427) and .description() (@419430).
//
// Verbatim from the 183 bundle; only unicode escapes de-escaped and the five
// interpolation slots inlined via the named consts above.
// ─────────────────────────────────────────────────────────────────────────────
export const WORKFLOW_DESCRIPTION = `Execute a workflow script that orchestrates multiple subagents deterministically. Workflows run in the background — this tool returns immediately with a task ID, and a <task-notification> arrives when the workflow completes. Use /workflows to watch live progress.

A workflow structures work across many agents — to be comprehensive (decompose and cover in parallel), to be confident (independent perspectives and adversarial checks before committing), or to take on scale one context can't hold (migrations, audits, broad sweeps). The script is where you encode that structure: what fans out, what verifies, what synthesizes.

ONLY call this tool when the user has explicitly opted into multi-agent orchestration. Workflows can spawn dozens of agents and consume a large amount of tokens; the user must request that scale, not have it inferred. Explicit opt-in means one of:
- The user included the keyword "ultracode" in their prompt (you'll see a system-reminder confirming it).
- Ultracode is on for the session (a system-reminder confirms it) — see **Ultracode** below.
- The user directly asked you to run a workflow or use multi-agent orchestration in their own words ("use a workflow", "run a workflow", "fan out agents", "orchestrate this with subagents"). The ask must be in the user's words — a task that would merely benefit from a workflow does not count.
- The user invoked a skill or slash command whose instructions tell you to call Workflow.
- The user asked you to run a specific named or saved workflow.

For any other task — even one that would clearly benefit from parallelism — do NOT call this tool. Use the Agent tool for individual subagents, or briefly describe what a multi-agent workflow could do and how much it would roughly cost, and ask the user whether to run it. Mention they can ask for one with "use a workflow" in a future message to skip the ask.

When you do call it, the right move is often **hybrid**: scout inline first (list the files, find the channels, scope the diff) to discover the work-list, then call Workflow to pipeline over it. You don't need to know the shape before the *task* — only before the *orchestration step*.

Common single-phase workflows you can chain across turns:
- **Understand** — parallel readers over relevant subsystems → structured map
- **Design** — judge panel of N independent approaches → scored synthesis
- **Review** — dimensions → find → adversarially verify (example below)
- **Research** — multi-modal sweep → deep-read → synthesize
- **Migrate** — discover sites → transform each (worktree isolation) → verify

For larger work, run several in sequence — read each result before deciding the next phase. You stay in the loop; each workflow is one well-scoped fan-out.

**Ultracode.** When a system-reminder confirms ultracode is on, that opt-in is standing: author and run a workflow for every substantive task by default. The goal is the most exhaustive, correct answer you can produce — token cost is not a constraint. For multi-phase work (understand → design → implement → review), that often means several workflows in sequence — one per phase — so you stay in the loop between them. The quality patterns below (adversarial verify, multi-modal sweep, completeness critic, loop-until-dry) are the tools; pick what fits the task. Lean toward orchestrating with workflows and adversarially verifying your findings — unless the work is trivial or already verified. Solo only on conversational turns or trivial mechanical edits. When a reminder says ultracode is off, revert to the opt-in rule above.

Pass the script inline via \`script\` — do not Write it to a file first. Every${EVERY_INVOCATION_SUFFIX} invocation automatically persists its script to a file under the session directory and returns the path in the tool result. To iterate on a workflow, edit that file with Write/Edit and re-invoke Workflow with \`{scriptPath: "<path>"}\` instead of resending the full script.${RESUME_SUFFIX}

Every script must begin with \`export const meta = {...}\`:
  export const meta = {
    name: 'find-flaky-tests',
    description: 'Find flaky tests and propose fixes',   // one-line, shown in permission dialog
    phases: [                                            // one entry per phase() call
      { title: 'Scan', detail: 'grep test logs for retries' },
      { title: 'Fix', detail: 'one agent per flaky test' },
    ],
  }
  // script body starts here — use agent()/parallel()/pipeline()/phase()/log()
  phase('Scan')
  const flaky = await agent('grep CI logs for retry markers', {schema: FLAKY_SCHEMA})
  ...

The \`meta\` object must be a PURE LITERAL — no variables, function calls, spreads, or template interpolation. Required fields: \`name\`, \`description\`. Optional: \`whenToUse\` (shown in the workflow list), \`phases\`. Use the SAME phase titles in meta.phases as in phase() calls — titles are matched exactly; a phase() call with no matching meta entry just gets its own progress group. Add \`model\` to a phase entry when that phase uses a specific model override.

Script body hooks:
- agent(prompt: string, opts?: {label?: string, phase?: string, schema?: object, model?: string, effort?: string, isolation?: ${WORKFLOW_ISOLATION_DESC}, agentType?: string}): Promise<any> — spawn a subagent. Without schema, returns its final text as a string. With schema (a JSON Schema), the subagent is forced to call a StructuredOutput tool and agent() returns the validated object — no parsing needed. Returns null if the user skips the agent mid-run or the subagent dies on a terminal API error after retries (filter with .filter(Boolean)). opts.label overrides the display label. opts.phase explicitly assigns this agent to a progress group (use this inside pipeline()/parallel() stages to avoid races on the global phase() state — same phase string → same group box). opts.model overrides the model for this agent call. Default to omitting it — the agent inherits the main-loop model (the resolved session model), which is almost always correct. Only set it when you're highly confident a different tier fits the task; when unsure, omit. opts.effort overrides the reasoning effort for this agent call ('low' | 'medium' | 'high' | 'xhigh' | 'max') — omit to inherit the session effort; use 'low' for cheap mechanical stages and higher tiers only for the hardest verify/judge stages. opts.isolation: 'worktree' runs the agent in a fresh git worktree — EXPENSIVE (~200-500ms setup + disk per agent), use ONLY when agents mutate files in parallel and would otherwise conflict; the worktree is auto-removed if unchanged.${WORKTREE_SUFFIX} opts.agentType uses a custom subagent type (e.g. 'Explore', 'code-reviewer') instead of the default workflow subagent — resolved from the same registry as the Agent tool; composes with schema (the custom agent's system prompt gets a StructuredOutput instruction appended).
- pipeline(items, stage1, stage2, ...): Promise<any[]> — run each item through all stages independently, NO barrier between stages. Item A can be in stage 3 while item B is still in stage 1. This is the DEFAULT for multi-stage work. Wall-clock = slowest single-item chain, not sum-of-slowest-per-stage. Every stage callback receives (prevResult, originalItem, index) — use originalItem/index in later stages to label work without threading context through stage 1's return value. A stage that throws drops that item to \`null\` and skips its remaining stages.
- parallel(thunks: Array<() => Promise<any>>): Promise<any[]> — run tasks concurrently. This is a BARRIER: awaits all thunks before returning. A thunk that throws (or whose agent errors) resolves to \`null\` in the result array — the call itself never rejects, so \`.filter(Boolean)\` before using the results. Use ONLY when you genuinely need all results together.
- log(message: string): void — emit a progress message to the user (shown as a narrator line above the progress tree)
- phase(title: string): void — start a new phase; subsequent agent() calls are grouped under this title in the progress display
- args: any — the value passed as Workflow's \`args\` input, verbatim (undefined if not provided). Pass arrays/objects as actual JSON values in the tool call, NOT as a JSON-encoded string — \`args: ["a.ts", "b.ts"]\`, not \`args: "[\\"a.ts\\", ...]"\` (a stringified list reaches the script as one string, so \`args.filter\`/\`args.map\` throw). Use this to parameterize named workflows — e.g. pass a research question, target path, or config object directly instead of via a side-channel file.
- budget: {total: number|null, spent(): number, remaining(): number} — the turn's token target from the user's "+500k"-style directive. \`budget.total\` is null if no target was set. \`budget.spent()\` returns output tokens spent this turn across the main loop and all workflows — the pool is shared, not per-workflow. \`budget.remaining()\` returns \`max(0, total - spent())\`, or \`Infinity\` if no target. The target is a HARD ceiling, not advisory: once \`spent()\` reaches \`total\`, further \`agent()\` calls throw. Use for dynamic loops: \`while (budget.total && budget.remaining() > 50_000) { ... }\`, or static scaling: \`const FLEET = budget.total ? Math.floor(budget.total / 100_000) : 5\`.
- workflow(nameOrRef: string | {scriptPath: string}, args?: any): Promise<any> — run another workflow inline as a sub-step and return whatever it returns. Pass a name to invoke a saved workflow (same registry as {name: "..."}), or {scriptPath} to run a script file you Wrote earlier. The child shares this run's concurrency cap, agent counter, abort signal, and token budget — its agents appear under a "${NESTED_GROUP_GLYPH} name" group in /workflows and its tokens count toward budget.spent(). The args param becomes the child's \`args\` global. Nesting is one level only: workflow() inside a child throws. Throws on unknown name / unreadable scriptPath / child syntax error; catch to handle gracefully.

Subagents are told their final text IS the return value (not a human-facing message), so they return raw data. For structured output, use the schema option — validation happens at the tool-call layer so the model retries on mismatch.

Workflow agents can reach all session-connected MCP tools via ToolSearch — schemas load on demand per agent. Caveat: interactively-authenticated MCP servers (e.g. claude.ai) may be absent in headless/cron runs.

Scripts are plain JavaScript, NOT TypeScript — type annotations (\`: string[]\`), interfaces, and generics fail to parse. The script body runs in an async context — use await directly. Standard JS built-ins (JSON, Math, Array, etc.) are available — EXCEPT \`Date.now()\`/\`Math.random()\`/argless \`new Date()\`, which throw (they would break resume); pass timestamps in via \`args\`, stamp results after the workflow returns, and for randomness vary the agent prompt/label by index. No filesystem or Node.js API access.

DEFAULT TO pipeline(). Only reach for a barrier (parallel between stages) when you genuinely need ALL prior-stage results together.

A barrier is correct ONLY when stage N needs cross-item context from all of stage N-1:
- Dedup/merge across the full result set before expensive downstream work
- Early-exit if the total count is zero ("0 bugs found → skip verification entirely")
- Stage N's prompt references "the other findings" for comparison

A barrier is NOT justified by:
- "I need to flatten/map/filter first" — do it inside a pipeline stage: pipeline(items, stageA, r => transform([r]).flat(), stageB)
- "The stages are conceptually separate" — that's what pipeline() models. Separate stages ≠ synchronized stages.
- "It's cleaner code" — barrier latency is real. If 5 finders run and the slowest takes 3× the fastest, a barrier wastes 2/3 of the fast finders' idle time.

Smell test: if you wrote
  const a = await parallel(...)
  const b = transform(a)        // flatten, map, filter — no cross-item dependency
  const c = await parallel(b.map(...))
that middle transform doesn't need the barrier. Rewrite as a pipeline with the transform inside a stage. When in doubt: pipeline.

Concurrent agent() calls are capped at min(16, cpu cores - 2) per workflow — excess calls queue and run as slots free up. You can still pass 100 items to parallel()/pipeline() and they all complete; only ~10 run at any moment. Total agent count across a workflow's lifetime is capped at 1000 — a runaway-loop backstop set far above any real workflow. A single parallel()/pipeline() call accepts at most 4096 items; passing more is an explicit error, not a silent truncation.

The canonical multi-stage pattern — pipeline by default, each dimension verifies as soon as its review completes:
  export const meta = {
    name: 'review-changes',
    description: 'Review changed files across dimensions, verify each finding',
    phases: [{ title: 'Review' }, { title: 'Verify' }],
  }
  const DIMENSIONS = [{key: 'bugs', prompt: '...'}, {key: 'perf', prompt: '...'}]
  const results = await pipeline(
    DIMENSIONS,
    d => agent(d.prompt, {label: \`review:\${d.key}\`, phase: 'Review', schema: FINDINGS_SCHEMA}),
    review => parallel(review.findings.map(f => () =>
      agent(\`Adversarially verify: \${f.title}\`, {label: \`verify:\${f.file}\`, phase: 'Verify', schema: VERDICT_SCHEMA})
        .then(v => ({...f, verdict: v}))
    ))
  )
  const confirmed = results.flat().filter(Boolean).filter(f => f.verdict?.isReal)
  return { confirmed }
  // Dimension 'bugs' findings verify while dimension 'perf' is still reviewing. No wasted wall-clock.

When a barrier IS correct — dedup across all findings before expensive verification:
  const all = await parallel(DIMENSIONS.map(d => () => agent(d.prompt, {schema: FINDINGS_SCHEMA})))
  const deduped = dedupeByFileAndLine(all.filter(Boolean).flatMap(r => r.findings))  // <-- genuinely needs ALL at once
  const verified = await parallel(deduped.map(f => () => agent(verifyPrompt(f), {schema: VERDICT_SCHEMA})))

Loop-until-count pattern — accumulate to a target:
  const bugs = []
  while (bugs.length < 10) {
    const result = await agent("Find bugs in this codebase.", {schema: BUGS_SCHEMA})
    bugs.push(...result.bugs)
    log(\`\${bugs.length}/10 found\`)
  }

Loop-until-budget pattern — scale depth to the user's "+500k" directive. Guard on budget.total: with no target set, remaining() is Infinity and the loop would run straight to the 1000-agent cap.
  const bugs = []
  while (budget.total && budget.remaining() > 50_000) {
    const result = await agent("Find bugs in this codebase.", {schema: BUGS_SCHEMA})
    bugs.push(...result.bugs)
    log(\`\${bugs.length} found, \${Math.round(budget.remaining()/1000)}k remaining\`)
  }

Composing patterns — exhaustive review (find → dedup vs seen → diverse-lens panel → loop-until-dry):
  const seen = new Set(), confirmed = []
  let dry = 0
  while (dry < 2) {                                              // loop-until-dry
    const found = (await parallel(FINDERS.map(f => () =>          // barrier: collect all finders this round
      agent(f.prompt, {phase: 'Find', schema: BUGS})))).filter(Boolean).flatMap(r => r.bugs)
    const fresh = found.filter(b => !seen.has(key(b)))           // dedup vs ALL seen — plain code, not an agent
    if (!fresh.length) { dry++; continue }
    dry = 0; fresh.forEach(b => seen.add(key(b)))
    const judged = await parallel(fresh.map(b => () =>           // every fresh bug judged concurrently...
      parallel(['correctness','security','repro'].map(lens => () =>   // ...each by 3 distinct lenses
        agent(\`Judge "\${b.desc}" via the \${lens} lens — real?\`, {phase: 'Verify', schema: VERDICT})))
        .then(vs => ({ b, real: vs.filter(Boolean).filter(v => v.real).length >= 2 }))))
    confirmed.push(...judged.filter(v => v.real).map(v => v.b))
  }
  return confirmed
  // dedup vs \`seen\`, NOT \`confirmed\` — else judge-rejected findings reappear every round and it never converges.

Quality patterns — common shapes; pick by task and compose freely:
- Adversarial verify: spawn N independent skeptics per finding, each prompted to REFUTE. Kill if ≥majority refute. Prevents plausible-but-wrong findings from surviving.
    const votes = await parallel(Array.from({length: 3}, () => () =>
      agent(\`Try to refute: \${claim}. Default to refuted=true if uncertain.\`, {schema: VERDICT})))
    const survives = votes.filter(Boolean).filter(v => !v.refuted).length >= 2
- Perspective-diverse verify: when a finding can fail in more than one way, give each verifier a distinct lens (correctness, security, perf, does-it-reproduce) instead of N identical refuters — diversity catches failure modes redundancy can't.
- Judge panel: generate N independent attempts from different angles (e.g. MVP-first, risk-first, user-first), score with parallel judges, synthesize from the winner while grafting the best ideas from runners-up. Beats one-attempt-iterated when the solution space is wide.
- Loop-until-dry: for unknown-size discovery (bugs, issues, edge cases), keep spawning finders until K consecutive rounds return nothing new. Simple counters (while count < N) miss the tail.
- Multi-modal sweep: parallel agents each searching a different way (by-container, by-content, by-entity, by-time). Each is blind to what the others surface; useful when one search angle won't find everything.
- Completeness critic: a final agent that asks "what's missing — modality not run, claim unverified, source unread?" What it finds becomes the next round of work.
- No silent caps: if a workflow bounds coverage (top-N, no-retry, sampling), \`log()\` what was dropped — silent truncation reads as "covered everything" when it didn't.

Scale to what the user asked for. "find any bugs" → a few finders, single-vote verify. "thoroughly audit this" or "be comprehensive" → larger finder pool, 3–5 vote adversarial pass, synthesis stage. When unsure, lean toward thoroughness for research/review/audit requests and toward brevity for quick checks.

These patterns aren't exhaustive — compose novel harnesses when the task calls for it (tournament brackets, self-repair loops, staged escalation, whatever fits).

Use this tool for multi-step orchestration where control flow should be deterministic (loops, conditionals, fan-out) rather than model-driven.

## Resume

The tool result includes a runId. To resume after a pause, kill, or script edit, relaunch with Workflow({scriptPath, resumeFromRunId}) — the longest unchanged prefix of agent() calls returns cached results instantly; the first edited/new call and everything after it runs live. Same script + same args → 100% cache hit. Date.now()/Math.random()/new Date() are unavailable in scripts (they would break this) — stamp results after the workflow returns, or pass timestamps via args. Fallback when no journal is available: Read agent-<id>.jsonl files in the transcript directory and hand-author a continuation script.`

// Mapping: gdo→WORKFLOW_DESCRIPTION, aLp→WORKFLOW_ISOLATION_DESC, cLp→EVERY_INVOCATION_SUFFIX,
//          iLp→RESUME_SUFFIX, lLp→WORKTREE_SUFFIX, sOe→NESTED_GROUP_GLYPH, $Wa→initWorkflowDescription thunk
