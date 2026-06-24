/**
 * Agent / teammate context shapes carried in-session and consumed by the Agent
 * tool at spawn time.
 *
 * 2.1.183 regions:
 *   - TeamContext literal (the object the Agent tool reads as `A.teamContext`):
 *     produced by `initializeSessionTeam` (`j3f`) @cli_inner_pretty.js:682796-682814
 *   - Agent-tool destructure of `A.teamContext` / `c.teammateContext`:
 *     @cli_inner_pretty.js:423548-423549  (`_ = Sl() ? A.teamContext : void 0` @423548,
 *                                          `b = !!c.teammateContext` @423549)
 *   - TeammateContext storage + factory:
 *     getTeammateContext (`Pk`) @103394, runWithTeammateContext (`Kun`) @103397,
 *     isInProcessTeammate (`UN`) @103400, createTeammateContext (`Yun`) @103403,
 *     isTeammate (`em`) @103466
 *   - in-process runner destructure of `teammateContext` (`sDp`) @421013
 *
 * NOTE: the identity ACCESSORS (getDynamicTeamContext/set/clear, getParentSessionId,
 *   getAgentId, getAgentName, getTeamName, getTeammateColor + the dynamicTeamContext `$q`
 *   var) live in the SIBLING utils/teammate.ts — they belong to the same bundle export-map
 *   (`zCr` @103410) but the 88 layout homes them in utils/teammate.ts (this file is the
 *   88 utils/teammateContext.ts: the ALS store + factory + the team/teammate types).
 *
 * 2.1.88 ancestor (shape mirror): utils/agentContext.ts + utils/teammateContext.ts
 *   88 had the SubagentContext / TeammateAgentContext discriminated union and the
 *   AsyncLocalStorage<TeammateContext> store. The TeamContext type itself lives on
 *   AppState; its 183 shape is re-derived from the `j3f` return literal because the
 *   v2.1.178 redesign made the team *implicit* (no TeamCreate tool builds it).
 *
 * scaffold: 30_agent_team/implicit_team_and_agent_tool_spawn.md +
 *           _scout_dossier_agent_team.md §2 (anchor table) / §3.2 / §3.3
 *
 * cross-val: re-read the `j3f` teamContext literal (@682796-682812) field-by-field
 *   (teamName/teamFilePath/leadAgentId/teammates[id]{name,agentType,color,
 *    tmuxSessionName,tmuxPaneId,cwd,spawnedAt}), and the Agent-tool destructure
 *   (`A.teamContext`, `c.teammateContext`) @423548-423549, in the 183 bundle.
 */

import { AsyncLocalStorage } from 'async_hooks'

// ---------------------------------------------------------------------------
// TeamContext — the implicit session team object on AppState.
//
// 2.1.183: built once at startup by initializeSessionTeam (`j3f`)
//          @cli_inner_pretty.js:682765 and stored as AppState.teamContext.
//          The Agent tool reads it as `A.teamContext` (gated on `Sl()`) @423548.
// ---------------------------------------------------------------------------

/**
 * One teammate's runtime presence entry inside TeamContext.teammates.
 *
 * 2.1.183: literal shape re-read from the `j3f` leader entry @682802-682810:
 *   { name, agentType, color, tmuxSessionName, tmuxPaneId, cwd, spawnedAt }
 * The leader's entry is keyed by its agentId (`team-lead@<team>`) with
 * tmuxSessionName:"in-process", tmuxPaneId:"leader".
 */
export type TeammatePresence = {
  /** Display name, e.g. "researcher". For the leader this is `team-lead`. */
  name: string
  /** Agent type/role, e.g. "researcher". For the leader this is `team-lead`. */
  agentType: string
  /** Assigned UI color (first of the color palette `iy` for the leader). */
  color?: string
  /**
   * tmux session the teammate's pane lives in, or the sentinel "in-process"
   * for in-process teammates (the leader is always "in-process"). // @682806
   */
  tmuxSessionName: string
  /** Pane id; the literal "leader" for the team lead. // @682807 */
  tmuxPaneId: string
  /** Working directory the teammate was spawned in (leader = `Ar()`). */
  cwd: string
  /** Epoch ms when this teammate joined the roster (`Date.now()`). */
  spawnedAt: number
}

/**
 * The implicit, session-scoped team carried on AppState as `teamContext`.
 *
 * 2.1.183: returned by initializeSessionTeam (`j3f`) @cli_inner_pretty.js:682797:
 *   { teamName, teamFilePath, leadAgentId, teammates: { [leadAgentId]: {...} } }
 * The Agent tool consumes it as `_ = Sl() ? A.teamContext : void 0` @423548 and
 * routes a named spawn into the teammate path when `_ && s && !L` @423573.
 */
export type TeamContext = {
  /** Team name; deterministically `session-<sessionId[:8]>` (see sessionTeamName). */
  teamName: string
  /** Absolute path to the team's config.json (`o = gte(n)`). // @682769 */
  teamFilePath: string
  /** Full agent id of the lead, `team-lead@<teamName>` (`r = bQ(np, n)`). // @682768 */
  leadAgentId: string
  /** Live roster keyed by agentId. Seeded with only the leader at startup. */
  teammates: { [agentId: string]: TeammatePresence }
}

/**
 * Color bookkeeping returned alongside teamContext by `j3f` @682813:
 *   { assignments: Map<agentId, color>, index }
 * `index` is the next color index to hand out; `assignments` maps each agentId
 * to its assigned palette color. Seeded with the leader at index 1.
 */
export type TeammateColors = {
  assignments: Map<string, string>
  index: number
}

/** The full return value of initializeSessionTeam (`j3f`). // @682796-682814 */
export type SessionTeamInit = {
  teamContext: TeamContext
  teammateColors: TeammateColors
}

// ---------------------------------------------------------------------------
// TeammateContext — AsyncLocalStorage context for *in-process* teammates.
//
// Distinct from TeamContext (the team roster on AppState). TeammateContext is the
// per-execution identity of a single in-process teammate, isolated via ALS so
// concurrently-backgrounded teammates don't clobber each other.
//
// 2.1.88 ancestor: utils/teammateContext.ts (same fields + factory).
// ---------------------------------------------------------------------------

/**
 * Runtime context for an in-process teammate, stored in AsyncLocalStorage.
 *
 * 2.1.183: field set re-confirmed via the factory `Yun` (createTeammateContext)
 *   @103403 (`{ ...e, isInProcess: !0 }`) and the accessor helpers that read each
 *   field — parentSessionId (`a4`) @103436, agentId (`VD`) @103450,
 *   agentName (`ih`) @103455, teamName (`zp`) @103460, color (`fT`) @103514.
 *   The full field set passed to `Yun` (agentId/agentName/teamName/color/
 *   planModeRequired/parentSessionId/abortController) is re-read at the call
 *   site @363109-363117; the factory adds `isInProcess:true`.
 */
export type TeammateContext = {
  /** Full agent id, e.g. "researcher@my-team". */
  agentId: string
  /** Display name, e.g. "researcher". */
  agentName: string
  /** Team name this teammate belongs to. */
  teamName: string
  /** Assigned UI color. */
  color?: string
  /** Whether this teammate must enter plan mode before implementing. */
  planModeRequired: boolean
  /** The leader's session id, for transcript correlation. */
  parentSessionId: string
  /** Discriminator — always true for in-process teammates. // @103403 */
  isInProcess: true
  /** Lifecycle abort controller (per-teammate, independent of the leader's). */
  abortController: AbortController
}

// 2.1.183: teammateContextStorage = GCr @cli_inner_pretty.js:103408 (new AsyncLocalStorage())
const teammateContextStorage = new AsyncLocalStorage<TeammateContext>()

// 2.1.183: getTeammateContext = Pk @cli_inner_pretty.js:103394
export function getTeammateContext(): TeammateContext | undefined {
  return teammateContextStorage.getStore()
}

// 2.1.183: runWithTeammateContext = Kun @cli_inner_pretty.js:103397
export function runWithTeammateContext<T>(
  context: TeammateContext,
  fn: () => T,
): T {
  return teammateContextStorage.run(context, fn)
}

// 2.1.183: isInProcessTeammate = UN @cli_inner_pretty.js:103400
export function isInProcessTeammate(): boolean {
  return teammateContextStorage.getStore() !== undefined
}

/**
 * Build a TeammateContext from spawn config. The abortController is supplied by
 * the caller (in-process teammates use an independent controller so they keep
 * running when the leader's query is interrupted).
 *
 * 2.1.183: createTeammateContext = Yun @cli_inner_pretty.js:103403
 *          body is exactly `{ ...e, isInProcess: !0 }`.
 */
export function createTeammateContext(config: {
  agentId: string
  agentName: string
  teamName: string
  color?: string
  planModeRequired: boolean
  parentSessionId: string
  abortController: AbortController
}): TeammateContext {
  return { ...config, isInProcess: true }
}

// Mapping: TeammatePresence/TeamContext/TeammateColors/SessionTeamInit<-j3f return literal,
//          teammateContextStorage->GCr, getTeammateContext->Pk, runWithTeammateContext->Kun,
//          isInProcessTeammate->UN, createTeammateContext->Yun
// NOTE: the identity accessors (getDynamicTeamContext/set/clear, getParentSessionId, getAgentId,
//       getAgentName, getTeamName, getTeammateColor + the dynamicTeamContext/$q var) and
//       isTeammate (`em` @103466, reconstructed as isTeammateSession) live in the SIBLING files
//       utils/teammate.ts and utils/agentId.ts respectively (88 layout).
