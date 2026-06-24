/**
 * Master gate for the Agent Team / "swarm" subsystem (v2.1.183).
 *
 * 2.1.183 regions: cli_inner_pretty.js:293828-293834 (yqd, Sl)
 * 2.1.88 ancestor: utils/agentSwarmsEnabled.ts (shape + naming idiom)
 * scaffold: 30_agent_team/_scout_dossier_agent_team.md §3 (master gate), _conventions.md §4
 * cross-val: re-read the `Sl` decl @293831 (body @293832-293834) in the 183 bundle. CONFIRMED that the
 *   v2.1.88 `process.env.USER_TYPE === 'ant'` always-on branch is DROPPED in 183 —
 *   the body is exactly the two-check sequence below with no ant short-circuit.
 *
 * Behavior (byte-confirmed @293832-293834):
 *   - Opt-in is REQUIRED for everyone: env var CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS
 *     (truthy) OR the `--agent-teams` CLI flag. There is no longer an ant bypass.
 *   - The GrowthBook killswitch `tengu_amber_flint` (default `true`) gates it.
 *
 * Helper mapping confirmed in the bundle:
 *   - st  = isEnvTruthy            (function st @163: lowercases + matches 1/true/yes/on)
 *   - ct  = getFeatureValue        (function ct @146595: cached, may-be-stale gate lookup)
 */

import { isEnvTruthy } from './envUtils.js'
import { getFeatureValue_CACHED_MAY_BE_STALE } from '../services/analytics/growthbook.js'

// 2.1.183: hasAgentTeamsCliFlag = yqd @cli_inner_pretty.js:293828
/**
 * Check if the `--agent-teams` flag is present on the command line.
 * Reads process.argv directly to avoid import cycles with bootstrap/state.
 */
export function hasAgentTeamsCliFlag(): boolean {
  return process.argv.includes('--agent-teams') // @293829
}

// 2.1.183: isAgentSwarmsEnabled = Sl @cli_inner_pretty.js:293831
/**
 * Centralized runtime check for agent-team / teammate features. This is the
 * single gate checked everywhere teammates are referenced (prompts, tool
 * `isEnabled`, UI, spawn routing, etc.).
 *
 * v2.1.183: opt-in is mandatory for ALL builds (the v2.1.88 `USER_TYPE === 'ant'`
 * always-on branch was removed in the v2.1.178 redesign era).
 */
export function isAgentSwarmsEnabled(): boolean {
  // Opt-in required: env var OR --agent-teams flag. @293832
  if (
    !isEnvTruthy(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) &&
    !hasAgentTeamsCliFlag()
  ) {
    return false
  }

  // Killswitch — GrowthBook gate, default true. @293833
  if (!getFeatureValue_CACHED_MAY_BE_STALE('tengu_amber_flint', true)) {
    return false
  }

  return true // @293834
}

// Mapping: Sl→isAgentSwarmsEnabled, yqd→hasAgentTeamsCliFlag,
//          st→isEnvTruthy, ct→getFeatureValue_CACHED_MAY_BE_STALE
