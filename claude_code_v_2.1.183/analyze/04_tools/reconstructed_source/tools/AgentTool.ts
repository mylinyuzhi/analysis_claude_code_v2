/**
 * AgentTool — "Agent" (legacy wire name "Task"): the subagent / teammate spawner.
 *
 * Readable-source reconstruction of the v2.1.183 obfuscated tool object `f3n`.
 * The Agent tool is the single entry point for delegating work: it spawns
 *   - a fresh **subagent** (a chosen `subagent_type`, or general-purpose),
 *   - a **fork** of the current agent (`subagent_type: "fork"` — inherits context),
 *   - a **named teammate** (the 2.1.178 implicit-team route — see 30_agent_team),
 *   - a **background async** agent, or
 *   - a **remote (cloud / CCR)** agent.
 * The visible wire `description` is just `"Launch a new agent"`; the rich,
 * multi-branch prose comes from the `prompt(...)` builder `Aqa` (reconstructed
 * verbatim below — the thin assets/tools/Agent.md only captured the description).
 *
 * 2.1.183 regions covered (PRIMARY: cli_inner_pretty.js, 699,346 lines):
 *   - name const     `vs = "Agent"`                                 @149939
 *   - legacy alias   `c9 = "Task"`                                  @149940
 *   - reserved addr  `LY = "main"`                                  @362512
 *   - fork literal   `_7 = "fork"`                                  @222272
 *   - default agent  `nye` (general-purpose)                        @384836-384847
 *   - userFacingName `qao`                                          @385346-385352
 *   - bgcolor        `Vao`                                          @385353-385356
 *   - fork avail     `gqa`                                          @423337-423342
 *   - teammate spawn `cqa -> HDp` (cross-ref 30_agent_team)         @423053-423055
 *   - bg-hint delay  `TDp = 2000`                                   @423347
 *   - prompt builder `Aqa(model, terse, forkActive)`                @423136-423318
 *   - error classes  `r3t/epo/oWe`                                  @423412-423429
 *   - bg-disabled    `o3t = Ge.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS`@423430
 *   - base schema    `CDp`                                          @423431-423445
 *   - merged schema  `IDp`                                          @423446-423477
 *   - wire schema    `zao` (omit cwd, conditionally omit run_in_bg) @423478-423481
 *   - output schema  `xDp` (completed|async_launched|remote_launched)@423482-423504
 *   - tool object    `f3n = pi({...})`                              @423505-424334
 *   - call body                                                     @423525-424224
 *   - checkPermissions                                              @424241-424245
 *   - mapToolResultToToolResultBlockParam                           @424246-424326
 * 2.1.88 convention mirror: src/tools/AgentTool/{AgentTool.tsx,prompt.ts,constants.ts}
 * 2.1.156 scaffold: claude_code_v_2.1.156/analyze/04_tools/README.md
 * Cross-validation: re-read every line above in the 183 bundle. NEW vs 2.1.156
 *   (0 hits in the 2.1.156 bundle): the `team_name` "Deprecated; ignored…" input
 *   field and the `name` reserved-"main" `.refine(...)`. There is NO `effort`
 *   field on the Agent tool input (effort lives on the agent-definition model
 *   config, not the tool call). The team-spawn `cqa->HDp` impl is owned by
 *   30_agent_team — only its call site is reconstructed here.
 */

import { z } from 'zod/v4'
import type { ValidationResult } from '../Tool'
import { buildTool, type ToolDef } from '../Tool'
import { lazySchema } from '../../utils/lazySchema' // 2.1.183: we(() => …)
import { coercedBoolean } from '../../utils/zodCoercion' // 2.1.183: n0(...) (unused here; kept for family parity)

// ---- referenced helpers (anchored by use-site; defined elsewhere) ----------
// 2.1.183: getToolPermissionContext = Br(ctx) — resolves the permission context
// 2.1.183: permissionModeEnum = zts() — H.enum of permission modes (e.g. "plan")  @schema thunk
// 2.1.183: agentNameRegex = pDa — "start with letter/digit; letters/digits/_/- ; max 64"
// 2.1.183: isForkSubagentEnabled = y7() @222225-222227 — L1i() !== "disabled" (in fork/sub-agent ctx)
// 2.1.183: isInProcessTeammate = UN() @103400-103402 — GCr.getStore() !== undefined
// 2.1.183: isTeammate = em() @103466 — teammate context predicate
// 2.1.183: agentTeamsEnabled = Sl() @293831-293835 — agent-teams gate
// 2.1.183: getSubscriptionType = sa() — "pro" | …
// 2.1.183: isLeanSystemPrompt = Dg(model) @134268-134273 — lean/simple prompt predicate
// 2.1.183: hasEmbeddedSearchTools = (Qw() && Su())
// 2.1.183: READ_TOOL_NAME = Ws ; GREP_TOOL_NAME = Uc ; SEND_MESSAGE_TOOL_NAME = zh
// 2.1.183: isRemoteAgentAvailable = n3t() — remote/CCR isolation availability gate
// 2.1.183: normalizeAgentType = Yut(type) ; isOneShotBuiltin = $Ai (Set) ; isBuiltInAgent = ay(P)
// 2.1.183: forkAgentDefinition = j2 ; resolveAgentModel = pte/zhe ; spawnDepth = Gz(ctx)+1
// 2.1.183: telemetry: G(event, props) ; lifecycle markers: Me/Le("subagent_launch", reason)
// 2.1.183: teammate spawn impl = HDp (via thin wrapper cqa) — see 30_agent_team

// 2.1.183: AGENT_TOOL_NAME = vs @cli_inner_pretty.js:149939
export const AGENT_TOOL_NAME = 'Agent'

// 2.1.183: LEGACY_AGENT_TOOL_NAME = c9 @cli_inner_pretty.js:149940
// Legacy wire name kept for permission rules, hooks, and resumed sessions.
export const LEGACY_AGENT_TOOL_NAME = 'Task'

// 2.1.183: RESERVED_MAIN_ADDRESS = LY @cli_inner_pretty.js:362512
// SendMessage routes `to: "main"` to the main conversation; a spawned agent's
// `name` may not equal this reserved address.
export const RESERVED_MAIN_ADDRESS = 'main'

// 2.1.183: FORK_SUBAGENT_TYPE = _7 @cli_inner_pretty.js:222272
export const FORK_SUBAGENT_TYPE = 'fork'

// 2.1.183: SYNC_BACKGROUND_HINT_MS = TDp @cli_inner_pretty.js:423347
// While a synchronous agent runs, after this delay the tool surfaces a
// "you can background this" hint to the UI (background_hint progress event).
const SYNC_BACKGROUND_HINT_MS = 2000

// 2.1.183: BACKGROUND_TASKS_DISABLED = o3t = Ge.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS @cli_inner_pretty.js:423430
const BACKGROUND_TASKS_DISABLED = Boolean(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS)

// ---------------------------------------------------------------------------
// Typed error classes — distinguish precondition / agent-type / remote failures
// so the loop can map them to the right user-facing surface.
// 2.1.183: AgentTypeError = r3t ; RemoteAgentPreconditionError = epo ;
//          AgentPreconditionError = oWe   @cli_inner_pretty.js:423412-423429
// ---------------------------------------------------------------------------
export class AgentTypeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AgentTypeError'
  }
}
export class RemoteAgentPreconditionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RemoteAgentPreconditionError'
  }
}
export class AgentPreconditionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AgentPreconditionError'
  }
}

// ===========================================================================
// Input schema
// ===========================================================================

// 2.1.183: CDp — base Task/Agent param object @cli_inner_pretty.js:423431-423445
// Shared core: description / prompt / subagent_type / model / run_in_background.
const baseAgentParams = lazySchema(() =>
  z.object({
    description: z.string().describe('A short (3-5 word) description of the task'), // @423433
    prompt: z.string().describe('The task for the agent to perform'), // @423434
    subagent_type: z
      .string()
      .optional()
      .describe('The type of specialized agent to use for this task'), // @423435
    model: z
      .enum(['sonnet', 'opus', 'haiku', 'fable'])
      .optional()
      .describe(
        // @423436-423440 (verbatim)
        `Optional model override for this agent. Takes precedence over the agent definition's model frontmatter. If omitted, uses the agent definition's model, or inherits from the parent. Ignored for subagent_type: "fork" — forks always inherit the parent model.`,
      ),
    run_in_background: z
      .boolean()
      .optional()
      .describe(
        'Set to true to run this agent in the background. You will be notified when it completes.', // @423441-423443
      ),
  }),
)

// 2.1.183: IDp — base params + {name, team_name, mode} merge + {isolation, cwd} extend
//          @cli_inner_pretty.js:423446-423477
const fullAgentParams = lazySchema(() => {
  const teammateExtras = z.object({
    // 2.1.183: pDa name regex; reserved-"main" refine — both load-bearing @423448-423457
    name: z
      .string()
      .regex(/* pDa */ /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/, {
        message:
          // @423450-423452 (verbatim)
          'name must start with a letter or digit and contain only letters, digits, underscores, or hyphens (max 64 chars)',
      })
      .refine(value => value !== RESERVED_MAIN_ADDRESS, {
        // @423453-423455 (verbatim; NEW in 2.1.183 — 0 hits in 2.1.156)
        message: `"${RESERVED_MAIN_ADDRESS}" is reserved — SendMessage routes it to the main conversation`,
      })
      .optional()
      .describe(
        'Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running.', // @423457
      ),
    // @423458 (verbatim) — NEW in 2.1.183 (0 hits in 2.1.156). The old team_name
    // param is now inert: there is one implicit team per session.
    team_name: z
      .string()
      .optional()
      .describe('Deprecated; ignored. The session has a single implicit team.'),
    // 2.1.183: zts() = permission-mode enum @423459-423461
    mode: permissionModeEnum()
      .optional()
      .describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).'),
  })

  return baseAgentParams()
    .merge(teammateExtras)
    .extend({
      isolation: z
        .enum(['worktree', 'remote'])
        .optional()
        .describe(
          // @423466-423470 (verbatim)
          'Isolation mode. "worktree" creates a temporary git worktree so the agent works on an isolated copy of the repo. "remote" launches the agent in a remote cloud environment (always runs in background; availability is gated).',
        ),
      cwd: z
        .string()
        .optional()
        .describe(
          // @423471-423475 (verbatim)
          'Absolute path to run the agent in. Overrides the working directory for all filesystem and shell operations within this agent. Mutually exclusive with isolation: "worktree".',
        ),
    })
})

// 2.1.183: zao — the WIRE-EXPOSED Agent schema @cli_inner_pretty.js:423478-423481
// Always drops `cwd` (internal-only). Drops `run_in_background` when background
// tasks are disabled (o3t) OR we are inside a fork/sub-agent context (y7()).
// Visible params: description, prompt, subagent_type, model, [run_in_background],
//                 name, team_name, mode, isolation.
const inputSchema = lazySchema(() => {
  const withoutCwd = fullAgentParams().omit({ cwd: true })
  return BACKGROUND_TASKS_DISABLED || isForkSubagentEnabled()
    ? withoutCwd.omit({ run_in_background: true })
    : withoutCwd
})

// ===========================================================================
// Output schema — a discriminated union over launch status
// 2.1.183: xDp @cli_inner_pretty.js:423482-423504
// ===========================================================================
const outputSchema = lazySchema(() => {
  // status:"completed" extends the shared completed-result shape (pRa) — token
  // usage, content blocks, optional worktree path/branch — plus the prompt.
  const completed = completedAgentResultSchema()
    .extend({ status: z.literal('completed'), prompt: z.string() })

  const asyncLaunched = z.object({
    status: z.literal('async_launched'),
    agentId: z.string().describe('The ID of the async agent'), // @423486
    description: z.string().describe('The description of the task'), // @423487
    resolvedModel: z
      .string()
      .optional()
      .describe('Model the spawn resolved (may differ from the requested one)'), // @423488
    prompt: z.string().describe('The prompt for the agent'), // @423489
    outputFile: z.string().describe('Path to the output file for checking agent progress'), // @423490
    canReadOutputFile: z
      .boolean()
      .optional()
      .describe('Whether the calling agent has Read/Bash tools to check progress'), // @423491-423493
  })

  const remoteLaunched = z.object({
    status: z.literal('remote_launched'),
    taskId: z.string().describe('The ID of the remote agent task'), // @423497
    sessionUrl: z.string().describe('The URL of the cloud session'), // @423498
    description: z.string().describe('The description of the task'),
    prompt: z.string().describe('The prompt for the agent'),
    outputFile: z.string().describe('Path to the output file for checking agent progress'),
  })

  return z.union([completed, asyncLaunched, remoteLaunched])
})

// ===========================================================================
// Description / prompt builder
// 2.1.183: Aqa(model, terse, forkActive) @cli_inner_pretty.js:423136-423318
// ===========================================================================
/**
 * Builds the Agent tool's model-facing prompt. The wire `description` stays the
 * static `"Launch a new agent"` (so the tools-block prompt cache doesn't bust on
 * agent-list / permission-mode changes); the rich guidance is the `prompt`.
 *
 * Branch structure:
 *   - `forkActive` (o) toggles the entire fork story on: a "## When to fork"
 *     section, fork-aware "## Writing the prompt" wording, and fork examples.
 *   - `terse` (t) returns just the lean base `p` early (coordinator/slim mode).
 *   - `Dg(model)` (c) selects the lean cohort: a compact "## When to use" +
 *     bullet list instead of the long "## Usage notes".
 *   - `sa() === "pro"` injects a "Do not spawn agents unless the user asks"
 *     nudge (the expensive-path warning for the Pro plan).
 *
 * Every quoted fragment below is reproduced VERBATIM from the bundle lines.
 * Mapping: e→model, t→terse, n→forkActive, r→isForkCtx, o→forkActive&&(n??true)
 */
async function buildAgentPrompt(
  model: string | undefined,
  terse: boolean,
  forkActive: boolean | undefined,
): Promise<string> {
  const isForkCtx = isForkSubagentEnabled() // r = y7()
  const fork = isForkCtx && (forkActive ?? true) // o — fork section active

  // s — "## When to fork" (only when fork is active) @423139-423154 (verbatim)
  const whenToForkSection = fork
    ? `

## When to fork

Fork yourself (pass \`subagent_type: "fork"\`) when the intermediate tool output isn't worth keeping in your context. The criterion is qualitative — "will I need this output again" — not task size. Fork open-ended questions. If research can be broken into independent questions, launch parallel forks in one message. A fork beats a fresh subagent for this — it inherits context and shares your cache.

Forks are cheap because they share your prompt cache.

**Don't peek.** The tool result includes an \`output_file\` path — do not Read or tail it. You get a completion notification; trust it. Reading the transcript mid-flight pulls the fork's tool noise into your context, which defeats the point of forking.

**Don't race.** After launching, you know nothing about what the fork found. Never fabricate or predict fork results in any format — not as prose, summary, or structured output. The notification arrives as a user-role message in a later turn; it is never something you write yourself. If the user asks a follow-up before the notification lands, tell them the fork is still running — give status, not a guess.

**Writing a fork prompt.** Since the fork inherits your context, the prompt is a *directive* — what to do, not what the situation is. Be specific about scope: what's in, what's out, what another agent is handling. Don't re-explain background.
`
    : ''

  // i — "## Writing the prompt" @423155-423168 (verbatim)
  const writingThePromptSection = `

## Writing the prompt

${fork ? 'Any agent other than a fork starts with zero context. ' : ''}Brief the agent like a smart colleague who just walked into the room — it hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters.
- Explain what you're trying to accomplish and why.
- Describe what you've already learned or ruled out.
- Give enough context about the surrounding problem that the agent can make judgment calls rather than just following a narrow instruction.
- If you need a short response, say so ("report in under 200 words").
- Lookups: hand over the exact command. Investigations: hand over the question — prescribed steps become dead weight when the premise is wrong.

${fork ? 'For fresh agents, terse' : 'Terse'} command-style prompts produce shallow, generic work.

**Never delegate understanding.** Don't write "based on your findings, fix the bug" or "based on the research, implement it." Those phrases push synthesis onto the agent instead of doing it yourself. Write prompts that prove you understood: include file paths, line numbers, what specifically to change.`

  // a — fork-active examples @423169-423209 (verbatim)
  const forkExamples = `Example usage:

<example>
user: "What's left on this branch before we can ship?"
assistant: <thinking>Forking this — it's a survey question. I want the punch list, not the git output in my context.</thinking>
${AGENT_TOOL_NAME}({
  subagent_type: "fork",
  name: "ship-audit",
  description: "Branch ship-readiness audit",
  prompt: "Audit what's left before this branch can ship. Check: uncommitted changes, commits ahead of main, whether tests exist, whether the GrowthBook gate is wired up, whether CI-relevant files changed. Report a punch list — done vs. missing. Under 200 words."
})
assistant: Ship-readiness audit running.
<commentary>
Turn ends here. The coordinator knows nothing about the findings yet. What follows is a SEPARATE turn — the notification arrives from outside, as a user-role message. It is not something the coordinator writes.
</commentary>
[later turn — notification arrives as user message]
assistant: Audit's back. Three blockers: no tests for the new prompt path, GrowthBook gate wired but not in build_flags.yaml, and one uncommitted file.
</example>

<example>
user: "so is the gate wired up or not"
<commentary>
User asks mid-wait. The audit fork was launched to answer exactly this, and it hasn't returned. The coordinator does not have this answer. Give status, not a fabricated result.
</commentary>
assistant: Still waiting on the audit — that's one of the things it's checking. Should land shortly.
</example>

<example>
user: "Can you get a second opinion on whether this migration is safe?"
assistant: <thinking>I'll ask the code-reviewer agent — it won't see my analysis, so it can give an independent read.</thinking>
<commentary>
A non-fork subagent_type is specified, so the agent starts fresh. It needs full context in the prompt. The briefing explains what to assess and why.
</commentary>
${AGENT_TOOL_NAME}({
  name: "migration-review",
  description: "Independent migration review",
  subagent_type: "code-reviewer",
  prompt: "Review migration 0042_user_schema.sql for safety. Context: we're adding a NOT NULL column to a 50M-row table. Existing rows get a backfill default. I want a second opinion on whether the backfill approach is safe under concurrent writes — I've checked locking behavior but want independent verification. Report: is this safe, and if not, what specifically breaks?"
})
</example>
`

  // l — classic (non-fork) examples @423210-423236 (verbatim)
  const classicExamples = `Example usage:

<example>
user: "What's left on this branch before we can ship?"
assistant: <thinking>A survey question across git state, tests, and config. I'll delegate it and ask for a short report so the raw command output stays out of my context.</thinking>
${AGENT_TOOL_NAME}({
  description: "Branch ship-readiness audit",
  prompt: "Audit what's left before this branch can ship. Check: uncommitted changes, commits ahead of main, whether tests exist, whether the GrowthBook gate is wired up, whether CI-relevant files changed. Report a punch list — done vs. missing. Under 200 words."
})
<commentary>
The prompt is self-contained: it states the goal, lists what to check, and caps the response length. The agent's report comes back as the tool result; relay the findings to the user.
</commentary>
</example>

<example>
user: "Can you get a second opinion on whether this migration is safe?"
assistant: <thinking>I'll ask the code-reviewer agent — it won't see my analysis, so it can give an independent read.</thinking>
${AGENT_TOOL_NAME}({
  description: "Independent migration review",
  subagent_type: "code-reviewer",
  prompt: "Review migration 0042_user_schema.sql for safety. Context: we're adding a NOT NULL column to a 50M-row table. Existing rows get a backfill default. I want a second opinion on whether the backfill approach is safe under concurrent writes — I've checked locking behavior but want independent verification. Report: is this safe, and if not, what specifically breaks?"
})
<commentary>
The agent starts with no context from this conversation, so the prompt briefs it: what to assess, the relevant background, and what form the answer should take.
</commentary>
</example>
`

  const lean = isLeanSystemPrompt(model) // c = Dg(e)

  // d — pro-plan "don't spawn" nudge @423239-423244 (verbatim)
  const proNudge =
    getSubscriptionType() === 'pro'
      ? `

**Do not spawn agents unless the user asks.** Each spawn starts cold and re-derives context you already have — it's the expensive path on this plan. A task with "multiple angles," "thorough," or several parts is not a request to spawn; handle it inline with your own tools. Only use this tool when the user explicitly says to use a subagent, or names one of the available agent types.`
      : ''

  // p — lean base prose @423245-423249 (verbatim). The fork-aware sentence vs.
  //     the classic "general-purpose by default" sentence diverge on `fork`.
  const base = `Launch a new agent to handle complex, multi-step tasks. Each agent type has specific capabilities and tools available to it.

Available agent types are listed in <system-reminder> messages in the conversation.${proNudge}

${
    fork
      ? `When using the ${AGENT_TOOL_NAME} tool, specify a subagent_type to select an agent: \`"fork"\` forks yourself (the fork inherits your full conversation context and always runs on your model — a \`model\` override is ignored); any other type — or omitting it — starts a fresh agent (general-purpose by default).`
      : `When using the ${AGENT_TOOL_NAME} tool, specify a subagent_type parameter to select which agent type to use. If omitted, the general-purpose agent is used.`
  }`

  // terse / coordinator slim mode → just the base @423250
  if (terse) return base

  // "## When not to use" — only in non-fork, non-lean classic mode @423251-423258 (verbatim)
  const grepHint = hasEmbeddedSearchTools()
    ? '`grep` via the Bash tool'
    : `the ${GREP_TOOL_NAME} tool`
  const whenNotToUse = fork
    ? ''
    : `
## When not to use

If the target is already known, use the direct tool: ${READ_TOOL_NAME} for a known path, ${grepHint} for a specific symbol or string. Reserve this tool for open-ended questions that span the codebase, or tasks that match an available agent type.
`

  // ---- lean cohort: compact "## When to use" + bullets @423259-423289 (verbatim) ----
  if (lean) {
    const bgBullet =
      !BACKGROUND_TASKS_DISABLED && !isInProcessTeammate() && !isForkCtx
        ? "\n- `run_in_background: true` runs the agent asynchronously; you'll be notified when it completes."
        : ''
    const teammateBullet = isInProcessTeammate()
      ? '\n- `run_in_background`, `name`, and `mode` are unavailable here — only synchronous subagents.'
      : isTeammate()
        ? '\n- `name` and `mode` are unavailable here — teammates cannot spawn teammates.'
        : ''
    const remoteBullet = isRemoteAgentAvailable()
      ? '\n- `isolation: "remote"` runs the agent in a remote CCR sandbox (always background).'
      : ''
    return `${base}${
      proNudge
        ? ''
        : `

## When to use

Reach for this when the task matches an available agent type, when you have independent work to run in parallel, or when answering would mean reading across several files — delegate it and you keep the conclusion, not the file dumps. For a single-fact lookup where you already know the file, symbol, or value, search directly. Once you've delegated a search, don't also run it yourself — wait for the result.`
    }${
      fork
        ? `

A fork runs in the background and keeps its tool output out of your context. If you are the fork, execute directly — don't re-delegate.`
        : ''
    }

- The agent's final message is returned to you as the tool result; it is not shown to the user — relay what matters.
- Use ${SEND_MESSAGE_TOOL_NAME} with the agent's ID or name to continue a previously spawned agent with its context intact; a new ${AGENT_TOOL_NAME} call starts fresh${fork ? ' (except subagent_type: "fork", which inherits your context)' : ''}.
- \`isolation: "worktree"\` gives the agent its own git worktree (auto-cleaned if unchanged).${remoteBullet}${bgBullet}${teammateBullet}`
  }

  // ---- full classic cohort: long "## Usage notes" @423290-423317 (verbatim) ----
  return `${base}
${whenNotToUse}
## Usage notes

- Always include a short description summarizing what the agent will do
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.
- Trust but verify: an agent's summary describes what it intended to do, not necessarily what it did. When an agent writes or edits code, check the actual changes before reporting the work as done.${
    !BACKGROUND_TASKS_DISABLED && !isInProcessTeammate() && !isForkCtx
      ? `
- You can optionally run agents in the background using the run_in_background parameter. When an agent runs in the background, you will be automatically notified when it completes — do NOT sleep, poll, or proactively check on its progress. Continue with other work or respond to the user instead.
- **Foreground vs background**: Use foreground (default) when you need the agent's results before you can proceed — e.g., research agents whose findings inform your next steps. Use background when you have genuinely independent work to do in parallel.`
      : ''
  }
- To continue a previously spawned agent, use ${SEND_MESSAGE_TOOL_NAME} with the agent's ID or name as the \`to\` field — that resumes it with full context. A new ${AGENT_TOOL_NAME} call starts a fresh agent with no memory of prior runs${fork ? ' (except subagent_type: "fork")' : ''}, so the prompt must be self-contained.
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since a fresh agent is not aware of the user's intent
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple ${AGENT_TOOL_NAME} tool use content blocks. For example, if you need to launch both a build-validator agent and a test-runner agent in parallel, send a single message with both tool calls.
- With \`isolation: "worktree"\`, the worktree is automatically cleaned up if the agent makes no changes; otherwise the path and branch are returned in the result.${isRemoteAgentAvailable() ? '\n- You can set `isolation: "remote"` to run the agent in a remote CCR environment. This is always a background task; you\'ll be notified when it completes. Use for long-running tasks that need a fresh sandbox.' : ''}${
    isInProcessTeammate()
      ? `
- The run_in_background, name, and mode parameters are not available in this context. Only synchronous subagents are supported.`
      : isTeammate()
        ? `
- The name and mode parameters are not available in this context — teammates cannot spawn other teammates. Omit them to spawn a subagent.`
        : ''
  }${whenToForkSection}${writingThePromptSection}

${fork ? forkExamples : classicExamples}`
}

// ===========================================================================
// userFacingName / color helpers
// 2.1.183: qao @385346-385352 ; Vao @385353-385356
// ===========================================================================
/**
 * Header label shown in the UI for an Agent tool call. Shows the chosen
 * subagent_type, except the "worker" display alias and the default
 * (general-purpose) and unset cases collapse to plain "Agent".
 * 2.1.183: userFacingName = qao @385346-385352
 */
function userFacingName(input?: { subagent_type?: string }): string {
  if (input?.subagent_type && input.subagent_type !== DEFAULT_AGENT.agentType) {
    if (input.subagent_type === 'worker') return 'Agent'
    return input.subagent_type
  }
  return 'Agent'
}

// 2.1.183: userFacingNameBackgroundColor = Vao @385353-385356 — color keyed by subagent_type
function userFacingNameBackgroundColor(input?: { subagent_type?: string }): string | undefined {
  if (!input?.subagent_type) return undefined
  return agentTypeColor(input.subagent_type) // Ihe(subagent_type)
}

// ===========================================================================
// Fork availability
// 2.1.183: gqa @cli_inner_pretty.js:423337-423342
// Fork is available only when (a) we're in a fork-capable context (y7()),
// (b) no active agent already IS a fork type, (c) the optional allow-list
// permits "fork", and (d) no deny rule blocks Agent(fork).
// ===========================================================================
function getForkAvailability(
  activeAgents: AgentDefinition[],
  allowedAgentTypes: string[] | undefined,
  { toolPermissionContext }: { toolPermissionContext: ToolPermissionContext },
): { available: boolean; denyRule: PermissionRule | null } {
  if (
    !isForkSubagentEnabled() ||
    activeAgents.some(a => normalizeAgentType(a.agentType) === FORK_SUBAGENT_TYPE) ||
    !(allowedAgentTypes?.includes(FORK_SUBAGENT_TYPE) ?? true)
  )
    return { available: false, denyRule: null }
  // But(ctx, "Agent", "fork") — deny-rule lookup for Agent(fork)
  const denyRule = findDenyRule(toolPermissionContext, AGENT_TOOL_NAME, FORK_SUBAGENT_TYPE)
  return { available: denyRule === null, denyRule }
}

// ===========================================================================
// Teammate spawn route (thin wrapper) — implementation owned by 30_agent_team
// 2.1.183: cqa -> HDp @cli_inner_pretty.js:423053-423055
// ===========================================================================
// 2.1.183: spawnTeammate = cqa @423053 — delegates to HDp (team-spawn impl).
// Reconstructed in 30_agent_team; here we only call it from the team-spawn branch.
declare function spawnTeammate(
  opts: TeammateSpawnOptions,
  ctx: ToolUseContext,
): Promise<{ data: { teammate_id: string; name: string } }>

// ===========================================================================
// Tool object
// 2.1.183: f3n = pi({...}) @cli_inner_pretty.js:423505-424334
// ===========================================================================
export const AgentTool: ToolDef<typeof inputSchema, typeof outputSchema> = buildTool({
  // 2.1.183: prompt(...) @423506-423511 — calls buildAgentPrompt(model, oI(), forkAvailable)
  async prompt({ agents, getToolPermissionContext, allowedAgentTypes, model }) {
    const permissionContext = await getToolPermissionContext()
    const terse = isCoordinatorPrompt() // s = oI()
    const { available: forkAvailable } = getForkAvailability(agents, allowedAgentTypes, {
      toolPermissionContext: permissionContext,
    })
    return buildAgentPrompt(model, terse, forkAvailable)
  },

  name: AGENT_TOOL_NAME, // vs @423512
  searchHint: 'delegate work to a subagent', // @423513
  aliases: [LEGACY_AGENT_TOOL_NAME], // [c9] @423514
  maxResultSizeChars: 1e5, // @423515

  // Static wire description — kept short so the tools-block cache survives
  // agent-list/permission changes; the real guidance lives in prompt().
  async description() {
    return 'Launch a new agent' // @423516-423518 (matches assets/tools/Agent.md)
  },

  get inputSchema() {
    return inputSchema() // zao() @423519-423521
  },
  get outputSchema() {
    return outputSchema() // xDp() @423522-423524
  },

  // The Agent tool spawns work but does not itself mutate state synchronously.
  isReadOnly() {
    return true // @424225-424227
  },
  isConcurrencySafe() {
    return true // @424233-424235
  },

  // 2.1.183: toAutoClassifierInput @424228-424232 — "(subagent_type, mode=…): prompt"
  toAutoClassifierInput(input) {
    const tags = [input.subagent_type, input.mode ? `mode=${input.mode}` : undefined].filter(
      t => t !== undefined,
    )
    return `${tags.length > 0 ? `(${tags.join(', ')}): ` : ': '}${input.prompt}`
  },

  userFacingName, // qao @424236
  userFacingNameBackgroundColor, // Vao @424237
  getActivityDescription(input) {
    return input?.description ?? 'Running task' // @424238-424240
  },

  // -------------------------------------------------------------------------
  // checkPermissions — in "auto" permission mode the loop must pause and ask
  // before this tool may spawn subagents; otherwise allow with the input intact.
  // 2.1.183: @424241-424245
  // -------------------------------------------------------------------------
  async checkPermissions(input, ctx) {
    if (getToolPermissionContext(ctx).mode === 'auto')
      return {
        behavior: 'passthrough',
        message: 'Agent tool requires permission to spawn subagents.', // @424243 (verbatim)
      }
    return { behavior: 'allow', updatedInput: input }
  },

  // -------------------------------------------------------------------------
  // call — the spawn dispatcher. Faithful behavior summary; the heavy lifting
  // (stream pump, worktree setup, remote session) is delegated to helpers.
  // 2.1.183: @423525-424224
  //
  // Inputs (destructured @423525-423536):
  //   prompt, subagent_type, description, model, run_in_background, name, mode,
  //   isolation, cwd. (`cwd` is internal — never on the wire schema.)
  // Context locals:
  //   model override m = isModelOverrideSuppressed() ? undefined : model  // z9() @423543
  //   teamContext _ = agentTeamsEnabled() ? appState.teamContext : undefined  // Sl()
  //   callerIsTeammate b = !!ctx.teammateContext
  //   taskRegistry y = ctx.taskRegistry
  // -------------------------------------------------------------------------
  async call(
    { prompt, subagent_type, description, model, run_in_background, name, mode, isolation, cwd },
    ctx,
    canUseTool,
    parentMessage,
    onEvent,
  ) {
    // --- guard rails (all throw + Me("subagent_launch", reason) telemetry) ---

    // @423550-423556 — a teammate (or in-process teammate) may not name-spawn:
    // the team roster is flat. Omitting `name` downgrades to a plain subagent.
    if ((callerIsTeammate || !!isInProcessTeammateScope()) && name)
      throw new AgentPreconditionError(
        'Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter.',
      ) // reason: subagent_nested_teammate

    // @423557-423562 — in-process teammates cannot background.
    if (callerIsTeammate && run_in_background === true)
      throw new AgentPreconditionError(
        'In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents.',
      ) // reason: subagent_teammate_background_denied

    // --- fork branch detection (@423564-423572) ---
    // isFork x = subagent_type !== undefined && normalize(subagent_type) === "fork"
    // { available, denyRule } = getForkAvailability(activeAgents, allowedAgentTypes, …)
    // @423567-423571 fork explicitly denied by an Agent(fork) rule:
    //   throw new AgentTypeError(`Agent type 'fork' has been denied by permission
    //     rule 'Agent(fork)' from ${denyRule.source}.`)  reason: subagent_type_denied
    // forkActive L = isFork && available

    // --- team-spawn route (the 2.1.178 implicit-team teammate spawner) ---
    // @423573-423591 — when team active && name supplied && NOT a fork:
    //   ye = await spawnTeammate({ name, prompt, description, use_splitpane: true,
    //     plan_mode_required: mode === "plan", model: m ?? resolveAgentModel(def),
    //     agent_type: subagent_type, invokingRequestId }, ctx)
    //   return { data: { status: "teammate_spawned", prompt, ...ye.data } }
    //   (cqa -> HDp; reconstructed in 30_agent_team.)

    // --- fork resolution (@423592-423606) ---
    //   fork + isolation:"remote" @423594-423600:
    //     throw new AgentPreconditionError('Fork cannot use isolation: "remote" —
    //       a remote session cannot inherit the conversation context. Omit isolation
    //       (or use "worktree"), or spawn a named agent type for remote work.')
    //       reason: subagent_fork_remote_isolation
    //   fork inside a fork @423601-423605 (querySource is the builtin fork agent,
    //   or messages already carry a fork marker):
    //     throw new AgentPreconditionError('Fork is not available inside a forked
    //       worker. Complete your task directly using your tools.')
    //       reason: subagent_recursive_fork
    //   selectedAgent P = forkAgentDefinition (j2)

    // --- subagent_type resolution (non-fork) (@423607-423651) ---
    //   requested de = subagent_type ?? DEFAULT_AGENT.agentType ("general-purpose")
    //   candidates = visibleAgents(allowedAgentTypes-filtered activeAgents, ctx)
    //   if no exact match, try normalized matching:
    //     - ambiguous (multiple normalized matches) @423625-423627:
    //         throw new AgentTypeError(`Agent type '${de}' is ambiguous — matches
    //           …. Use the exact name: … / None of these are available. Available
    //           agents: …`)  reason: subagent_type_ambiguous
    //           (telemetry tengu_subagent_type_miss)
    //     - single normalized match → adopt it (telemetry tengu_subagent_type_normalized @423633)
    //       but if it isn't visible and a deny rule applies @423637-423641:
    //         throw new AgentTypeError(`Agent type '${name}' has been denied by
    //           permission rule 'Agent(${name})' from ${rule.source}.`)
    //     - still not found @423644-423649:
    //         throw new AgentTypeError(`Agent type '${de}' not found. Available
    //           agents: ${available.join(", ")}`)  reason: subagent_type_not_found
    //   selectedAgent P = the resolved AgentDefinition

    // --- teammate + background-flagged agent def @423653-423659 ---
    //   if callerIsTeammate && P.background === true:
    //     throw new AgentPreconditionError(`In-process teammates cannot spawn
    //       background agents. Agent '${P.agentType}' has background: true in its
    //       definition.`)  reason: subagent_teammate_background_denied

    // --- required-MCP-servers wait/verify @423660-423700 ---
    //   If P.requiredMcpServers is set, wait up to 30s for matching MCP clients to
    //   settle (poll @500ms), then verify the agent's required servers are present.
    //   On miss @423693-423699:
    //     throw new AgentPreconditionError(`Agent '${P.agentType}' requires MCP
    //       servers matching: ${missing}. MCP servers with tools: ${present|"none"}.
    //       Use /mcp to configure and authenticate the required MCP servers.`)
    //       reason: subagent_mcp_required_missing

    // --- resolve model / isolation / async / depth ---
    //   resolvedModel O = resolveAgentModel(P, mainLoopModel, forkActive ? undefined : m, mode)  // @423702
    //   isolation q = isolation ?? P.isolation                                                   // @423709
    //   if q === "remote" && !isRemoteAgentAvailable():                                          // @423710-423719
    //     fall back to "worktree" (or local) and log
    //       "[remote agent] isolation:'remote' is unavailable …"
    //   isRemote V = q === "remote"
    //   isAsync Q = V || ((run_in_background === true || P.background === true
    //               || isCoordinator || isForkCtx) && !BACKGROUND_TASKS_DISABLED)               // @423721
    //   spawnDepth z = parentSpawnDepth(ctx.agentContext) + 1                                    // @423722

    // telemetry tengu_agent_tool_selected @423724-423736:
    //   { agent_type, model, source, color, is_built_in_agent, is_resume:false,
    //     is_async, is_fork, agent_depth, agent_system_prompt_chars }

    // --- remote (cloud / CCR) launch @423737-423791 ---
    //   eligibility = await checkRemoteEligibility()  // tce()
    //   if !eligible:
    //     throw new RemoteAgentPreconditionError(`Cannot launch cloud agent:\n${errors}`)
    //       reason: subagent_remote_ineligible
    //   session = await createRemoteSession({ initialMessage: prompt, source:"remote_agent",
    //     description, model: O, permissionMode, branchName, signal, onBundleFail, onCreateFail })
    //   if !session:
    //     throw new RemoteAgentPreconditionError(bundleErr ?? "Failed to create cloud session")
    //       reason: subagent_remote_session_failed
    //   register remote task → telemetry tengu_agent_tool_remote_launched @423778
    //   return { data: { status: "remote_launched", taskId, sessionUrl, description,
    //                    prompt, outputFile } }                                                  // @423780-423790

    // --- build the spawn options (system prompt, tools, worktree, mailbox) ---
    //   For forks: reuse the rendered system prompt + fork repl-hydration, fork tools,
    //   and carry forkContextMessages = ctx.messages (so the fork sees the conversation).
    //   For fresh agents: render the agent system prompt, filter the tool pool by the
    //   agent's allow/deny lists, seed the prompt message.
    //   If q === "worktree": create a temporary git worktree; on completion the
    //   worktree is auto-cleaned if unchanged, else its path/branch are returned.

    // --- async (background) launch @423914-423984 ---
    //   register a background task (Xut), pump the agent stream via runAgentStream
    //   (W4e) + makeStream (wj) under the task's abort controller, register the
    //   `name` (if any, and not "main") so SendMessage can reach it.
    //   return { data: { isAsync: true, status: "async_launched", agentId,
    //     description, resolvedModel: O, prompt, outputFile, canReadOutputFile } }              // @423972-423983

    // --- sync (foreground) launch @423985-424223 ---
    //   pump the agent stream to completion. A SYNC_BACKGROUND_HINT_MS (2000ms)
    //   timer surfaces a {kind:"background_hint"} progress event @424091 so the
    //   user can promote the run to background. The run may flip to background
    //   mid-flight (then returns "async_launched"). On user cancel, telemetry
    //   tengu_agent_tool_terminated @424128/@424169 fires.
    //   On normal completion:
    //     return { data: { status: "completed", prompt, ...summarizedResult,
    //                      ...worktreeResult } }                                                 // @424196
    //   `finally` (@424197-424220) clears the hint timer + tool JSX and, unless the
    //   run was backgrounded, emits a `task_notification` system message carrying
    //   status (completed|failed|stopped) and a <usage> footer
    //   (total_tokens / tool_uses / duration_ms).

    // (Full streaming/worktree/remote internals are reconstructed in 30_agent_team
    //  and the runAgent helpers; this contract-level reconstruction summarizes them.)
    return undefined as never // see behavior summary above; not a literal return
  },

  // -------------------------------------------------------------------------
  // mapToolResultToToolResultBlockParam — formats each launch status into the
  // tool_result text block the model sees. All strings verbatim @424246-424326.
  // -------------------------------------------------------------------------
  mapToolResultToToolResultBlockParam(result, toolUseId) {
    // teammate_spawned @424248-424262 (verbatim)
    if (
      typeof result === 'object' &&
      result !== null &&
      'status' in result &&
      result.status === 'teammate_spawned'
    ) {
      const r = result as TeammateSpawnedResult
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [
          {
            type: 'text',
            text: `Spawned successfully.
agent_id: ${r.teammate_id}
name: ${r.name}
The agent is now running and will receive instructions via mailbox.`,
          },
        ],
      }
    }

    // remote_launched @424264-424280 (verbatim)
    if (result.status === 'remote_launched') {
      const r = result
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [
          {
            type: 'text',
            text: `Cloud agent launched.
taskId: ${r.taskId}
session_url: ${r.sessionUrl}
output_file: ${r.outputFile}
The agent is running in the cloud. You will be notified automatically when it completes.
Briefly tell the user what you launched and end your response.`,
          },
        ],
      }
    }

    // async_launched @424282-424294 (verbatim) — note the JSONL-overflow warning
    // only appears when the caller actually has Read/Bash tools to peek.
    if (result.status === 'async_launched') {
      const head = `Async agent launched successfully.
agentId: ${result.agentId} (internal ID - do not mention to user. Use SendMessage with to: '${result.agentId}' to continue this agent.)
The agent is working in the background. You will be notified automatically when it completes.`
      const tail = result.canReadOutputFile
        ? `Do not duplicate this agent's work — avoid working with the same files or topics it is using. Work on non-overlapping tasks, or briefly tell the user what you launched and end your response.
output_file: ${result.outputFile}
Do NOT ${READ_TOOL_NAME} or tail this file via the shell tool — it is the full subagent JSONL transcript and reading it will overflow your context. If the user asks for progress, say the agent is still running; you'll get a completion notification.`
        : 'Briefly tell the user what you launched and end your response. Do not generate any other text — agent results will arrive in a subsequent message.'
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [{ type: 'text', text: `${head}\n${tail}` }],
      }
    }

    // completed @424295-424320 (verbatim). One-shot built-in agents (Explore/Plan,
    // the $Ai set) skip the agentId/SendMessage/usage trailer to save tokens.
    if (result.status === 'completed') {
      const r = result
      const worktreeSuffix = r.worktreePath
        ? `
worktreePath: ${r.worktreePath}
worktreeBranch: ${r.worktreeBranch}`
        : ''
      const content =
        r.content.length > 0
          ? r.content
          : [{ type: 'text', text: '(Subagent completed but returned no output.)' }] // @424305 (verbatim)
      if (r.agentType && ONE_SHOT_BUILTIN_AGENT_TYPES.has(r.agentType) && !worktreeSuffix)
        return { tool_use_id: toolUseId, type: 'tool_result', content }
      return {
        tool_use_id: toolUseId,
        type: 'tool_result',
        content: [
          ...content,
          {
            type: 'text',
            text: `agentId: ${r.agentId} (use SendMessage with to: '${r.agentId}' to continue this agent)${worktreeSuffix}
<usage>subagent_tokens: ${r.totalTokens}
tool_uses: ${r.totalToolUseCount}
duration_ms: ${r.totalDurationMs}</usage>`,
          },
        ],
      }
    }

    // default @424322-424325 — unreachable; signals a programming error.
    throw new Error(`Unexpected agent tool result status: ${(result as { status: string }).status}`) // reason: subagent_unexpected_result_status
  },

  // renderers (UI components; see ./UI) @424327-424333
  renderToolResultMessage, // ZNa
  renderToolUseMessage, // eBa
  renderToolUseTag, // tBa
  renderToolUseProgressMessage, // m0e
  renderToolUseRejectedMessage, // nBa
  renderToolUseErrorMessage, // rBa
  renderGroupedToolUse, // oBa
})

// NOTE: the Agent tool has NO `isEnabled()` — it is always present. Availability
// is enforced inside `call` via agent-type filtering and the permission context,
// not a top-level gate. (Confirmed: `isEnabled` is absent from the f3n property
// keys in assets/tools/Agent.md and the bundle object @423505-424334.)
