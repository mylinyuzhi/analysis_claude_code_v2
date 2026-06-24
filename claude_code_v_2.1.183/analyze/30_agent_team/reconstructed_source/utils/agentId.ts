/**
 * Deterministic Agent ID helpers + teammate-session identity (v2.1.183).
 *
 * 2.1.183 regions:
 *   - cli_inner_pretty.js:103172-103186 (bQ formatAgentId, NCr encode, fwt parseAgentId, TYe generateRequestId)
 *   - cli_inner_pretty.js:103466-103469 (em isTeammateSession), exported as `isTeammate` @103415
 *   - cli_inner_pretty.js:362636 (np = "team-lead"), 362512 (LY = "main")
 * 2.1.88 ancestor: utils/agentId.ts (formatAgentId / parseAgentId / generateRequestId shapes),
 *   utils/swarm/constants.ts (TEAM_LEAD_NAME).
 * scaffold: _scout_dossier_agent_team.md §2 anchor table, _conventions.md naming registry.
 * cross-val: re-read bQ/fwt/TYe @103172+ and em @103466 in the 183 bundle. CONFIRMED:
 *   - `bQ(e,t)` returns `${e}@${t}` (verbatim @103173).
 *   - `fwt` (parseAgentId) splits on first `@` (slice(0,t) / slice(t+1)), null if absent (@103178-103182).
 *   - `TYe` (generateRequestId) returns `${e}-${Date.now()}@${t}` (@103183-103186).
 *   - The v2.1.88 `parseRequestId` companion has NO live counterpart adjacent to these in 183 —
 *     omitted (see manifest open question).
 *   - `em` (isTeammateSession) @103466: `if (Pk()) return true; return !!($q?.agentId && $q?.teamName)`.
 *     `Pk` (@103394, exported as getTeammateContext @103424) is the in-process AsyncLocalStorage
 *     store getter; `$q` is the *dynamic* team context (set via setDynamicTeamContext/`nMu`,
 *     read via getDynamicTeamContext/`l1e` @103447, exported @103428) — NOT the in-process store.
 *
 * ID formats (carryover): agent IDs are `agentName@teamName`; request IDs are
 * `{requestType}-{timestamp}@{agentId}`. `@` is the reserved separator, so agent
 * names must never contain `@`.
 */

import { getTeammateContext } from './agentContext.js'
// CONFIRMED (bundle export map @103428): getDynamicTeamContext (`l1e`) returns module-var `$q`,
// set via setDynamicTeamContext (`nMu` @103441), cleared via clearDynamicTeamContext (`rMu` @103444).
// Its genuine home is the bundle's teammate.ts identity cluster (88 ancestor utils/teammate.ts, which
// exports getDynamicTeamContext alongside getAgentName/getTeamName/getTeammateColor/getAgentId/isTeammate).
// That identity cluster IS reconstructed in this delta tree at utils/teammate.ts (the team-FILE I/O it
// previously held was the mislabeled 88 swarm/teamHelpers.ts content, now moved to utils/swarm/teamHelpers.ts).
// So this import resolves to the sibling identity module, matching the real source layout (utils/teammate.js).
import { getDynamicTeamContext } from './teammate.js'

// ---------------------------------------------------------------------------
// Reserved name constants (declared with the swarm constants block in the bundle)
// ---------------------------------------------------------------------------

// 2.1.183: TEAM_LEAD_NAME = np @cli_inner_pretty.js:362636 ("team-lead")
/**
 * The sole built-in roster member / team leader name.
 * SSOT: defined in utils/swarm/constants.ts (88 ancestor home: utils/swarm/constants.ts).
 * Re-exported here for the identity-helper callers that reach for it alongside formatAgentId.
 */
export { TEAM_LEAD_NAME } from './swarm/constants.js'

// 2.1.183: MAIN_RESERVED_NAME = LY @cli_inner_pretty.js:362512 ("main")
/**
 * Reserved teammate name. SendMessage routes `{ to: "main" }` to the main
 * conversation (background subagents only); the Agent `name` schema refines it out.
 */
export const MAIN_RESERVED_NAME = 'main'

// ---------------------------------------------------------------------------
// ID formatting / parsing
// ---------------------------------------------------------------------------

// 2.1.183: formatAgentId = bQ @cli_inner_pretty.js:103172
/** Formats an agent ID as `agentName@teamName`. */
export function formatAgentId(agentName: string, teamName: string): string {
  return `${agentName}@${teamName}` // @103173
}

// 2.1.183: parseAgentId = fwt @cli_inner_pretty.js:103178
/**
 * Parses an `agentName@teamName` ID into its parts. Splits on the FIRST `@`
 * (team names may legally contain `@`, agent names may not). Returns null when
 * there is no separator.
 */
export function parseAgentId(
  agentId: string,
): { agentName: string; teamName: string } | null {
  const atIndex = agentId.indexOf('@') // @103179
  if (atIndex === -1) return null // @103180
  return {
    agentName: agentId.slice(0, atIndex),
    teamName: agentId.slice(atIndex + 1),
  } // @103181
}

// 2.1.183: encodeAgentIdComponent = NCr @cli_inner_pretty.js:103175
/**
 * Percent-encodes any `%` or non-printable-ASCII char in an ID component so a
 * formatted ID is safe to embed in paths / control messages.
 */
export function encodeAgentIdComponent(component: string): string {
  return component.replace(/%|[^\x20-\x7e]/gu, (ch) => encodeURIComponent(ch)) // @103176
}

// 2.1.183: generateRequestId = TYe @cli_inner_pretty.js:103183
/** Formats a request ID as `{requestType}-{timestamp}@{agentId}`. */
export function generateRequestId(requestType: string, agentId: string): string {
  const timestamp = Date.now() // @103184
  return `${requestType}-${timestamp}@${agentId}` // @103185
}

// ---------------------------------------------------------------------------
// Teammate-session identity
// ---------------------------------------------------------------------------

// 2.1.183: isTeammateSession = em @cli_inner_pretty.js:103466 (exported as `isTeammate` @103415)
/**
 * True when the current process is running AS a teammate. Two ways to be one:
 *   1. We are an in-process teammate (AsyncLocalStorage store present), or
 *   2. The dynamic team context carries both an `agentId` and a `teamName`
 *      (process/tmux teammates joining at runtime via --agent-id/--team-name).
 * Used to hide the Agent `name`/`mode` params from teammates (flat roster: a
 * teammate cannot spawn other teammates).
 */
export function isTeammateSession(): boolean {
  // @103467: bundle uses `if (Pk())` — truthy in-process store. getTeammateContext()
  // returns that store (or undefined), so the truthy check is behaviorally identical.
  if (getTeammateContext()) return true // @103467  (Pk())
  const dyn = getDynamicTeamContext() // $q
  return !!(dyn?.agentId && dyn?.teamName) // @103468
}

// Mapping: bQ→formatAgentId, fwt→parseAgentId, NCr→encodeAgentIdComponent,
//          TYe→generateRequestId, em→isTeammateSession, Pk→getTeammateContext (in-process store),
//          $q→dynamicTeamContext (read via getDynamicTeamContext/l1e),
//          np→TEAM_LEAD_NAME, LY→MAIN_RESERVED_NAME
