/**
 * Teammate identity accessors (v2.1.183).
 *
 * Identifies whether this Claude Code instance is running as a spawned teammate
 * and exposes the teammate's identity (agentId / agentName / teamName / color /
 * parentSessionId). Identity is resolved from TWO layers, in priority order:
 *   1. the AsyncLocalStorage in-process teammate context (`getTeammateContext`/`Pk`),
 *      used by teammates running in the SAME process; then
 *   2. the module-level "dynamic" team context (`dynamicTeamContext`/`$q`), set
 *      out-of-band from CLI args (--agent-id/--team-name/...) by tmux/iTerm2 (pane)
 *      and cross-session teammates that join at runtime.
 *
 * 2.1.183 regions (export-map `zCr` @cli_inner_pretty.js:103410 — all accessors below
 * read `Pk() ?? $q`; re-read in the zCr region of the 183 bundle):
 *   - dynamicTeamContext     ($q)   @103570  (module var, `var $q = null`)
 *   - getDynamicTeamContext  (l1e)  @103447  (`return $q`)
 *   - setDynamicTeamContext  (nMu)  @103441  (`$q = e`)
 *   - clearDynamicTeamContext(rMu)  @103444  (`$q = null`)
 *   - getParentSessionId     (a4)   @103436  (Pk()?.parentSessionId ?? $q?.parentSessionId)
 *   - getAgentId             (VD)   @103450  (Pk()?.agentId ?? $q?.agentId)
 *   - getAgentName           (ih)   @103455  (Pk()?.agentName ?? $q?.agentName)
 *   - getTeamName            (zp)   @103460  (Pk()?.teamName ?? $q?.teamName ?? arg?.teamName)
 *   - getTeammateColor       (fT)   @103514  (Pk()?.color ?? $q?.color)
 * (isTeammate (`em` @103466) is part of this same bundle module but is reconstructed as
 *  isTeammateSession in utils/agentId.ts to keep the agentId helpers together; isPlanModeRequired
 *  (`gwt` @103519) / isTeamLead (`RM`) / hasActiveInProcessTeammates etc. are owned elsewhere.)
 *
 * 2.1.88 ancestor (exact layout + naming mirror): utils/teammate.ts — the identity module.
 *   88 imports getTeammateContext from './teammateContext.js' (= the 183 agentContext module),
 *   declares the same `dynamicTeamContext` module var, and exports getParentSessionId /
 *   set/clear/getDynamicTeamContext / getAgentId / getAgentName / getTeamName / getTeammateColor.
 *   The 88 dynamicTeamContext carries planModeRequired (read by isPlanModeRequired); preserved
 *   here so getDynamicTeamContext returns the full shape (the 183 `$q` carries it too — `gwt`
 *   reads `$q.planModeRequired`).
 *
 * scaffold: 30_agent_team/implicit_team_and_agent_tool_spawn.md;
 *           _scout_dossier_agent_team.md §2 (anchor table) / §3.2 / §3.3
 *
 * cross-val: re-read every accessor body in the zCr region @103436-103517 of the 183 bundle
 *   (each reads the in-process ALS store via Pk() then falls back to $q), plus `var $q = null`
 *   @103570 and the export-map `zCr` @103410.
 */

import { getTeammateContext } from './agentContext.js'

// ---------------------------------------------------------------------------
// Dynamic team context (`$q`) — the NON-ALS fallback identity.
// ---------------------------------------------------------------------------

/**
 * The out-of-band identity fallback shape carried in `$q`. Set from CLI args when
 * a pane/process teammate joins a team at runtime; takes precedence over env vars
 * but NOT over the in-process AsyncLocalStorage context.
 */
export type DynamicTeamContext = {
  agentId: string
  agentName: string
  teamName: string
  color?: string
  /** Whether this teammate must enter plan mode before implementing. */
  planModeRequired: boolean
  parentSessionId?: string
}

// 2.1.183: dynamicTeamContext = $q @cli_inner_pretty.js:103570 (`var $q = null`)
let dynamicTeamContext: DynamicTeamContext | null = null

// 2.1.183: getDynamicTeamContext = l1e @cli_inner_pretty.js:103447  (`return $q`)
export function getDynamicTeamContext(): DynamicTeamContext | null {
  return dynamicTeamContext
}

// 2.1.183: setDynamicTeamContext = nMu @cli_inner_pretty.js:103441  (`$q = e`)
export function setDynamicTeamContext(context: DynamicTeamContext | null): void {
  dynamicTeamContext = context
}

// 2.1.183: clearDynamicTeamContext = rMu @cli_inner_pretty.js:103444  (`$q = null`)
export function clearDynamicTeamContext(): void {
  dynamicTeamContext = null
}

// ---------------------------------------------------------------------------
// Identity accessors — in-process ALS store first, then dynamic context.
// ---------------------------------------------------------------------------

// 2.1.183: getParentSessionId = a4 @cli_inner_pretty.js:103436
/** Parent (team-lead) session id; for transcript correlation. */
export function getParentSessionId(): string | undefined {
  const inProcessCtx = getTeammateContext()
  if (inProcessCtx) return inProcessCtx.parentSessionId
  return dynamicTeamContext?.parentSessionId
}

// 2.1.183: getAgentId = VD @cli_inner_pretty.js:103450
/** Full agent id (`agentName@teamName`) when running as a teammate, else undefined. */
export function getAgentId(): string | undefined {
  const inProcessCtx = getTeammateContext()
  if (inProcessCtx) return inProcessCtx.agentId
  return dynamicTeamContext?.agentId
}

// 2.1.183: getAgentName = ih @cli_inner_pretty.js:103455
/** Display name when running as a teammate, else undefined. */
export function getAgentName(): string | undefined {
  const inProcessCtx = getTeammateContext()
  if (inProcessCtx) return inProcessCtx.agentName
  return dynamicTeamContext?.agentName
}

// 2.1.183: getTeamName = zp @cli_inner_pretty.js:103460
/**
 * Team name this session belongs to. Falls back to a passed-in team context
 * (from AppState) so a LEAD — which has neither an ALS frame nor a dynamic
 * context — can still resolve its team name.
 *
 * @param teamContext optional AppState team context (for leaders).
 */
export function getTeamName(teamContext?: { teamName?: string }): string | undefined {
  const inProcessCtx = getTeammateContext()
  if (inProcessCtx) return inProcessCtx.teamName
  if (dynamicTeamContext?.teamName) return dynamicTeamContext.teamName
  return teamContext?.teamName
}

// 2.1.183: getTeammateColor = fT @cli_inner_pretty.js:103514
/** Assigned UI color when running as a teammate, else undefined. */
export function getTeammateColor(): string | undefined {
  const inProcessCtx = getTeammateContext()
  if (inProcessCtx) return inProcessCtx.color
  return dynamicTeamContext?.color
}

// Mapping: dynamicTeamContext->$q, getDynamicTeamContext->l1e, setDynamicTeamContext->nMu,
//          clearDynamicTeamContext->rMu, getParentSessionId->a4, getAgentId->VD,
//          getAgentName->ih, getTeamName->zp, getTeammateColor->fT, getTeammateContext->Pk
// NOTE: isTeammate (`em` @103466) lives as isTeammateSession in utils/agentId.ts; the in-process
//       ALS store + factory (getTeammateContext/Pk, createTeammateContext/Yun, etc.) live in the
//       sibling utils/agentContext.ts (88 layout: utils/teammateContext.ts).
