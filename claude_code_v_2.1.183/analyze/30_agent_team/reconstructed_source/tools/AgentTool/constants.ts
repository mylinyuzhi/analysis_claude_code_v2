/**
 * Agent tool name + related identity constants (v2.1.183).
 *
 * 2.1.183 regions: cli_inner_pretty.js:149939-149943
 *   `var vs = "Agent", c9 = "Task", $Ai;`  and  `$Ai = new Set(["Explore", "Plan"])`
 *   `vs` is referenced as the Agent tool def's `name:` field @423512 (tool def f3n,
 *   the `pi({...})` factory call @423505; `name: vs` @423512, `aliases: [c9]` @423514).
 * 2.1.88 ancestor: tools/AgentTool/constants.ts (AGENT_TOOL_NAME / LEGACY_AGENT_TOOL_NAME /
 *   ONE_SHOT_BUILTIN_AGENT_TYPES).
 * scaffold: _scout_dossier_agent_team.md §2 (Agent tool name const `vs`).
 * cross-val: re-read `var vs = "Agent"` @149939, the Agent def `name: vs` @423512, and
 *   the `$Ai = new Set([...])` init @149943 in the 183 bundle.
 *
 * NOTE: v2.1.88's `VERIFICATION_AGENT_TYPE = 'verification'` const has no confirmed
 * adjacent counterpart in the 183 Agent-tool constants block — omitted (see manifest).
 */

// 2.1.183: AGENT_TOOL_NAME = vs @cli_inner_pretty.js:149939 ("Agent")
/** Canonical name of the Agent tool (used as the tool def `name`, @423512). */
export const AGENT_TOOL_NAME = 'Agent'

// 2.1.183: LEGACY_AGENT_TOOL_NAME = c9 @cli_inner_pretty.js:149940 ("Task")
/**
 * Legacy wire name for the Agent tool, kept as an alias for backward compat
 * (permission rules, hooks, resumed sessions). Registered via `aliases: [c9]` @423514.
 */
export const LEGACY_AGENT_TOOL_NAME = 'Task'

// 2.1.183: ONE_SHOT_BUILTIN_AGENT_TYPES = $Ai @cli_inner_pretty.js:149943
/**
 * Built-in agents that run once and return a report — the parent never SendMessages
 * back to continue them. Used to skip the agentId/SendMessage/usage trailer for
 * these to save tokens.
 */
export const ONE_SHOT_BUILTIN_AGENT_TYPES: ReadonlySet<string> = new Set([
  'Explore',
  'Plan',
])

// Mapping: vs→AGENT_TOOL_NAME, c9→LEGACY_AGENT_TOOL_NAME, $Ai→ONE_SHOT_BUILTIN_AGENT_TYPES
