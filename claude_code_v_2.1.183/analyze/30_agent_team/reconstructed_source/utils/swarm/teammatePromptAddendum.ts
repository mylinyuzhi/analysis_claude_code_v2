/**
 * Teammate-specific system-prompt addendum (verbatim carryover).
 *
 * This block is appended to the full main-agent system prompt when an agent is
 * running as a teammate inside an agent team ("swarm"). It tells the model that
 * plain text output is NOT visible to other team members and that the only way
 * to communicate is via the SendMessage tool.
 *
 * 2.1.183 regions:
 *   - TEAMMATE_SYSTEM_PROMPT_ADDENDUM string body : cli_inner_pretty.js:420704-420712
 *   - re-export shim (gt(w5a, {...}))             : cli_inner_pretty.js:420703
 *   - composition into prompt parts (adjacent)    : cli_inner_pretty.js:421047-421058 (inside sDp)
 * 2.1.88 ancestor: utils/swarm/teammatePromptAddendum.ts
 *   NOTE: the 88 ancestor used an OLDER, bulleted form that also documented a
 *   broadcast bullet (`to: "*"` for team-wide broadcasts). The v2.1.183 bundle
 *   (and the v2.1.156 baseline before it) collapsed this to a single SendMessage
 *   sentence with NO broadcast bullet — the 183 bundle wins, reproduced verbatim
 *   below. The 88 mailbox still supports `to: "*"`, the prompt just stopped
 *   advertising it.
 * scaffold: 30_agent_team/README.md (§ System-prompt addendum, line 54) +
 *           v2.1.156 baseline mailbox_and_lifecycle_tools.md §5.
 * cross-val: re-read Rdo body @420704-420712 with `cat -A` (byte-exact incl.
 *   blank lines and escaped backticks); confirmed identical to v2.1.156 jU6;
 *   confirmed the only consumers are the re-export @420703 and the in-process
 *   runner sDp @421048 which pushes it into the system-prompt parts array.
 */

// 2.1.183: TEAMMATE_SYSTEM_PROMPT_ADDENDUM = Rdo @cli_inner_pretty.js:420704
// Verbatim byte-exact reproduction. The leading + trailing newlines inside the
// template literal are intentional (they match the bundle's `\n# Agent ...\n`).
// In the bundle the inline backticks around `to: "<name>"` are escaped (\`) only
// because the bundle stores this as a JS template literal; the actual rendered
// prompt text contains literal backtick characters around `to: "<name>"`.
export const TEAMMATE_SYSTEM_PROMPT_ADDENDUM = `
# Agent Teammate Communication

IMPORTANT: You are running as an agent in a team. To communicate with anyone on your team, use the SendMessage tool with \`to: "<name>"\` to send messages to specific teammates.

Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool.

The user interacts primarily with the team lead. Your work is coordinated through the task system and teammate messaging.
`

// 2.1.183: appendTeammatePromptAddendum (adjacent builder extracted from sDp) @cli_inner_pretty.js:421047-421058
/**
 * Compose a teammate's full system prompt.
 *
 * Mirrors the prompt-assembly branch inside the in-process runner `sDp`
 * (`runInProcessTeammate`) at cli_inner_pretty.js:421046-421059. The bundle does
 * NOT factor this into a named helper — the logic is inlined inside `sDp` — but
 * it is reproduced here as a small, faithful builder because it is the single
 * place `Rdo` is appended to a system prompt, and the unit brief asks for the
 * adjacent builder that appends the addendum.
 *
 * Bundle behavior reproduced (sDp @421046-421058):
 *   - If `systemPromptMode === "replace"` and a `systemPrompt` override exists,
 *     the addendum is NOT appended at all — the override is used as-is. @421046
 *   - Otherwise the parts array starts with the base main-loop system prompt
 *     (`await KL(tools, mainLoopModel)`) immediately followed by the addendum,
 *     then optional custom-agent instructions, then (in "append" mode) the
 *     override prompt; the parts are joined with newlines. @421048-421058
 *
 * The base-prompt builder `KL` (cli_inner_pretty.js:580888) and the
 * custom-agent-instructions header live in other units; here they are accepted
 * as already-resolved strings to keep this builder addendum-focused.
 *
 * Mapping: sDp→runInProcessTeammate, d→systemPromptMode, u→systemPromptOverride,
 *   KL→buildBaseSystemPrompt, Rdo→TEAMMATE_SYSTEM_PROMPT_ADDENDUM, F→parts
 */
export function appendTeammatePromptAddendum(opts: {
  /** Base main-loop system prompt parts, already resolved via KL(tools, model). */
  baseSystemPrompt: string
  /** "replace" | "append" | undefined — from the agent's systemPromptMode. */
  systemPromptMode?: 'replace' | 'append'
  /** The explicit systemPrompt override, when one was supplied. */
  systemPromptOverride?: string
  /**
   * Optional custom-agent instructions block (from agentDefinition.getSystemPrompt()).
   * In the bundle this is wrapped as "\n# Custom Agent Instructions\n${...}". @421050-421054
   */
  customAgentInstructions?: string
}): string {
  const { baseSystemPrompt, systemPromptMode, systemPromptOverride, customAgentInstructions } = opts

  // "replace" mode with an override short-circuits: addendum is skipped. @421046
  if (systemPromptMode === 'replace' && systemPromptOverride) {
    return systemPromptOverride
  }

  // Base prompt is immediately followed by the teammate addendum. @421048
  const parts: string[] = [baseSystemPrompt, TEAMMATE_SYSTEM_PROMPT_ADDENDUM]

  // Custom agent instructions, if the agent definition provides any. @421050-421054
  if (customAgentInstructions) {
    parts.push(`
# Custom Agent Instructions
${customAgentInstructions}`)
  }

  // In "append" mode the override is added after everything else. @421057
  if (systemPromptMode === 'append' && systemPromptOverride) {
    parts.push(systemPromptOverride)
  }

  // Parts are joined with a single newline. @421058
  return parts.join('\n')
}
