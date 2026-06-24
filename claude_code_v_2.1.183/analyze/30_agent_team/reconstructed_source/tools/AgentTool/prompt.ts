/**
 * AgentTool prompt — the Agent tool description builder (v2.1.183).
 *
 * 2.1.183 region covered: buildAgentToolDescription (Aqa) @cli_inner_pretty.js:423136-423318.
 *   Branch order: `if (t) return p` (coordinator slim) @423250 → `if (c)` (structured) @423259 → else (legacy) @423290.
 *   - c = Dg(model) @423237 : useStructuredAgentPrompt — picks structured vs legacy wording by model.
 *   - the swarm-relevant lines are the teammate-suppression hints: @423264 (structured) and @423308
 *     (legacy), each branching on UN() (isInProcessTeammate) then em() (isTeammateSession).
 *
 * 2.1.88 ancestor mirrored: tools/AgentTool/prompt.ts (getPrompt shape, the `isInProcessTeammate()`
 *   → "run_in_background, name, team_name, and mode … not available" hint and the `isTeammate()`
 *   → "name, team_name, and mode … not available — teammates cannot spawn other teammates" hint,
 *   the fork/when-not-to-use sections, the ${AGENT_TOOL_NAME}/${SEND_MESSAGE_TOOL_NAME} interpolation).
 *   NOTE: in 183 the hint text dropped `team_name` (it is deprecated) — see the verbatim strings below.
 *
 * scaffold: 30_agent_team/implicit_team_and_agent_tool_spawn.md §2.6 (description hides name/mode
 *   for teammates via em()); _scout_dossier_agent_team.md.
 *
 * Cross-check vs asset: assets/tools/Agent.md only carries metadata (description = "Launch a new
 *   agent", input schema = zao()) — NOT the full description. The full verbatim text is the Aqa body,
 *   re-read directly from the bundle and quoted byte-exact below.
 *
 * cross-val (re-read @423136-423318): the two teammate-hint strings @423264 / @423308, the structured
 *   `When to use` / `Usage notes` blocks, the fork sections (s,i,a,l), the pro-plan suppression note (d),
 *   and that `UN` = isInProcessTeammate (NOT "isWorkflowOrRestrictedContext" as the scaffold §2.6 guessed
 *   — confirmed via the bundle's teammate-context export map @103420).
 */

// 88 ancestor AgentTool/prompt.ts imports the teammate helpers from their real homes:
//   import { isTeammate } from '../../utils/teammate.js'
//   import { isInProcessTeammate } from '../../utils/teammateContext.js'
// (isTeammateSession is this reconstruction's readable name for isTeammate=em @103466.)
// Note: neither the bundle's Aqa nor the 88 prompt.ts imports isAgentSwarmsEnabled (Sl) —
// the description gates teammate hints on UN()/em(), so Sl is intentionally NOT imported here.
// isInProcessTeammate (UN) and the TeammateContext factory cluster were reconstructed into
// utils/agentContext.ts in this tree (the 88 ancestor split them into utils/teammateContext.ts);
// isTeammateSession (em, readable name for isTeammate) was reconstructed into utils/agentId.ts.
import { isInProcessTeammate } from '../../utils/agentContext.js'
import { isTeammateSession } from '../../utils/agentId.js'
import { hasEmbeddedSearchTools, isShellAvailable } from '../../utils/embeddedTools.js'
import { getSubscriptionType } from '../../utils/auth.js'
import { isForkSubagentEnabled } from './forkSubagent.js'
import { useStructuredAgentPrompt } from '../../constants/prompts.js'
import { isRemoteIsolationAvailable } from './remoteIsolation.js'
import { AGENT_TOOL_NAME } from './constants.js'
import { FILE_READ_TOOL_NAME } from '../FileReadTool/prompt.js'
import { GREP_TOOL_NAME } from '../GrepTool/prompt.js'
import { SEND_MESSAGE_TOOL_NAME } from '../SendMessageTool/constants.js'

/**
 * Build the Agent tool's full description.
 *
 * 2.1.183: buildAgentToolDescription = Aqa @cli_inner_pretty.js:423136
 *
 * @param model         requested model (drives structured-vs-legacy wording via Dg). [e]
 * @param isCoordinator coordinator mode → return the slim shared prompt only.        [t]
 * @param available     whether forking is available (fork sections are emitted).     [n]
 */
export async function buildAgentToolDescription(
  model: string | undefined,
  isCoordinator: boolean,
  available?: boolean,
): Promise<string> {
  const forkEnabled = isForkSubagentEnabled() // r = y7() @423137
  // o : emit fork sections only when fork is enabled AND available (default true). @423138
  const forkSections = forkEnabled && (available ?? true)

  // --- s : "## When to fork" (only when forkSections) -------------------------- @423139
  const whenToForkSection = forkSections
    ? `

## When to fork

Fork yourself (pass \`subagent_type: "fork"\`) when the intermediate tool output isn't worth keeping in your context. The criterion is qualitative — "will I need this output again" — not task size. Fork open-ended questions. If research can be broken into independent questions, launch parallel forks in one message. A fork beats a fresh subagent for this — it inherits context and shares your cache.

Forks are cheap because they share your prompt cache.

**Don't peek.** The tool result includes an \`output_file\` path — do not Read or tail it. You get a completion notification; trust it. Reading the transcript mid-flight pulls the fork's tool noise into your context, which defeats the point of forking.

**Don't race.** After launching, you know nothing about what the fork found. Never fabricate or predict fork results in any format — not as prose, summary, or structured output. The notification arrives as a user-role message in a later turn; it is never something you write yourself. If the user asks a follow-up before the notification lands, tell them the fork is still running — give status, not a guess.

**Writing a fork prompt.** Since the fork inherits your context, the prompt is a *directive* — what to do, not what the situation is. Be specific about scope: what's in, what's out, what another agent is handling. Don't re-explain background.
`
    : ''

  // --- i : "## Writing the prompt" -------------------------------------------- @423155
  const writingThePromptSection = `

## Writing the prompt

${forkSections ? 'Any agent other than a fork starts with zero context. ' : ''}Brief the agent like a smart colleague who just walked into the room — it hasn't seen this conversation, doesn't know what you've tried, doesn't understand why this task matters.
- Explain what you're trying to accomplish and why.
- Describe what you've already learned or ruled out.
- Give enough context about the surrounding problem that the agent can make judgment calls rather than just following a narrow instruction.
- If you need a short response, say so ("report in under 200 words").
- Lookups: hand over the exact command. Investigations: hand over the question — prescribed steps become dead weight when the premise is wrong.

${forkSections ? 'For fresh agents, terse' : 'Terse'} command-style prompts produce shallow, generic work.

**Never delegate understanding.** Don't write "based on your findings, fix the bug" or "based on the research, implement it." Those phrases push synthesis onto the agent instead of doing it yourself. Write prompts that prove you understood: include file paths, line numbers, what specifically to change.`

  // --- a : fork-aware example block ------------------------------------------- @423169
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

  // --- l : legacy (non-fork) example block ------------------------------------ @423210
  const legacyExamples = `Example usage:

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

  // c : structured-vs-legacy decision, keyed on the model. @423237
  const structured = useStructuredAgentPrompt(model) // Dg(e)

  // d : pro-plan "do not spawn unless asked" note. @423239
  const proPlanNote =
    getSubscriptionType() === 'pro'
      ? `

**Do not spawn agents unless the user asks.** Each spawn starts cold and re-derives context you already have — it's the expensive path on this plan. A task with "multiple angles," "thorough," or several parts is not a request to spawn; handle it inline with your own tools. Only use this tool when the user explicitly says to use a subagent, or names one of the available agent types.`
      : ''

  // p : the shared lead-in. @423245
  const shared = `Launch a new agent to handle complex, multi-step tasks. Each agent type has specific capabilities and tools available to it.

Available agent types are listed in <system-reminder> messages in the conversation.${proPlanNote}

${
    forkSections
      ? `When using the ${AGENT_TOOL_NAME} tool, specify a subagent_type to select an agent: \`"fork"\` forks yourself (the fork inherits your full conversation context and always runs on your model — a \`model\` override is ignored); any other type — or omitting it — starts a fresh agent (general-purpose by default).`
      : `When using the ${AGENT_TOOL_NAME} tool, specify a subagent_type parameter to select which agent type to use. If omitted, the general-purpose agent is used.`
  }`

  // Coordinator mode: slim — the coordinator system prompt already covers usage. @423250
  if (isCoordinator) return shared

  // f : symbol/string-search hint (embedded build → grep via Bash, else the Grep tool). @423251
  const fileSearchHint =
    hasEmbeddedSearchTools() && isShellAvailable() ? '`grep` via the Bash tool' : `the ${GREP_TOOL_NAME} tool`
  // m : "## When not to use" (legacy/non-fork only). @423252
  const whenNotToUseSection = forkSections
    ? ''
    : `
## When not to use

If the target is already known, use the direct tool: ${FILE_READ_TOOL_NAME} for a known path, ${fileSearchHint} for a specific symbol or string. Reserve this tool for open-ended questions that span the codebase, or tasks that match an available agent type.
`

  // --- STRUCTURED prompt branch (c === true) ---------------------------------- @423259
  if (structured) {
    // A : background note (only when bg tasks enabled, not in-process teammate, not fork). @423260
    const backgroundNote =
      !process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS && !isInProcessTeammate() && !forkEnabled
        ? "\n- `run_in_background: true` runs the agent asynchronously; you'll be notified when it completes."
        : ''
    // g : TEAMMATE-SUPPRESSION hint — in-process teammate first, then plain teammate. @423264
    //     verbatim: drops `team_name` (deprecated) vs the 2.1.88 wording.
    const teammateHint = isInProcessTeammate()
      ? '\n- `run_in_background`, `name`, and `mode` are unavailable here — only synchronous subagents.'
      : isTeammateSession()
        ? '\n- `name` and `mode` are unavailable here — teammates cannot spawn teammates.'
        : ''
    // h : remote-isolation note. @423269
    const remoteNote = isRemoteIsolationAvailable()
      ? '\n- `isolation: "remote"` runs the agent in a remote CCR sandbox (always background).'
      : ''

    return `${shared}${
      proPlanNote
        ? ''
        : `

## When to use

Reach for this when the task matches an available agent type, when you have independent work to run in parallel, or when answering would mean reading across several files — delegate it and you keep the conclusion, not the file dumps. For a single-fact lookup where you already know the file, symbol, or value, search directly. Once you've delegated a search, don't also run it yourself — wait for the result.`
    }${
      forkSections
        ? `

A fork runs in the background and keeps its tool output out of your context. If you are the fork, execute directly — don't re-delegate.`
        : ''
    }

- The agent's final message is returned to you as the tool result; it is not shown to the user — relay what matters.
- Use ${SEND_MESSAGE_TOOL_NAME} with the agent's ID or name to continue a previously spawned agent with its context intact; a new ${AGENT_TOOL_NAME} call starts fresh${forkSections ? ' (except subagent_type: "fork", which inherits your context)' : ''}.
- \`isolation: "worktree"\` gives the agent its own git worktree (auto-cleaned if unchanged).${remoteNote}${backgroundNote}${teammateHint}`
  }

  // --- LEGACY prompt branch (c === false) ------------------------------------- @423290
  return `${shared}
${whenNotToUseSection}
## Usage notes

- Always include a short description summarizing what the agent will do
- When the agent is done, it will return a single message back to you. The result returned by the agent is not visible to the user. To show the user the result, you should send a text message back to the user with a concise summary of the result.
- Trust but verify: an agent's summary describes what it intended to do, not necessarily what it did. When an agent writes or edits code, check the actual changes before reporting the work as done.${
    !process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS && !isInProcessTeammate() && !forkEnabled
      ? `
- You can optionally run agents in the background using the run_in_background parameter. When an agent runs in the background, you will be automatically notified when it completes — do NOT sleep, poll, or proactively check on its progress. Continue with other work or respond to the user instead.
- **Foreground vs background**: Use foreground (default) when you need the agent's results before you can proceed — e.g., research agents whose findings inform your next steps. Use background when you have genuinely independent work to do in parallel.`
      : ''
  }
- To continue a previously spawned agent, use ${SEND_MESSAGE_TOOL_NAME} with the agent's ID or name as the \`to\` field — that resumes it with full context. A new ${AGENT_TOOL_NAME} call starts a fresh agent with no memory of prior runs${forkSections ? ' (except subagent_type: "fork")' : ''}, so the prompt must be self-contained.
- Clearly tell the agent whether you expect it to write code or just to do research (search, file reads, web fetches, etc.), since a fresh agent is not aware of the user's intent
- If the agent description mentions that it should be used proactively, then you should try your best to use it without the user having to ask for it first.
- If the user specifies that they want you to run agents "in parallel", you MUST send a single message with multiple ${AGENT_TOOL_NAME} tool use content blocks. For example, if you need to launch both a build-validator agent and a test-runner agent in parallel, send a single message with both tool calls.
- With \`isolation: "worktree"\`, the worktree is automatically cleaned up if the agent makes no changes; otherwise the path and branch are returned in the result.${
    isRemoteIsolationAvailable()
      ? '\n- You can set `isolation: "remote"` to run the agent in a remote CCR environment. This is always a background task; you\'ll be notified when it completes. Use for long-running tasks that need a fresh sandbox.'
      : ''
  }${
    // TEAMMATE-SUPPRESSION hint (legacy branch) @423308 — verbatim; drops `team_name`.
    isInProcessTeammate()
      ? `
- The run_in_background, name, and mode parameters are not available in this context. Only synchronous subagents are supported.`
      : isTeammateSession()
        ? `
- The name and mode parameters are not available in this context — teammates cannot spawn other teammates. Omit them to spawn a subagent.`
        : ''
  }${whenToForkSection}${writingThePromptSection}

${forkSections ? forkExamples : legacyExamples}`
}

/*
 * Mapping (this file):
 *   buildAgentToolDescription→Aqa, useStructuredAgentPrompt→Dg, isForkSubagentEnabled→y7,
 *   isInProcessTeammate→UN, isTeammateSession→em, hasEmbeddedSearchTools→Qw, isShellAvailable→Su,
 *   getSubscriptionType→sa, isRemoteIsolationAvailable→n3t, AGENT_TOOL_NAME→vs,
 *   SEND_MESSAGE_TOOL_NAME→zh, FILE_READ_TOOL_NAME→Ws ("Read"), GREP_TOOL_NAME→Uc ("Grep") ;
 *   locals: model→e, isCoordinator→t, available→n, forkEnabled→r, forkSections→o,
 *     whenToForkSection→s, writingThePromptSection→i, forkExamples→a, legacyExamples→l,
 *     structured→c, proPlanNote→d, shared→p, fileSearchHint→f, whenNotToUseSection→m,
 *     backgroundNote→A, teammateHint→g, remoteNote→h.
 */
