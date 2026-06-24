/**
 * Team-file management — path + read/write helpers, the on-disk team-member /
 * team-config shapes, the lock-guarded mutators, and session-cleanup tracking.
 *
 * 2.1.183 regions (all re-read in cli_inner_pretty.js):
 *   - getTeamsDir            (Gbe)  @735     -> join(configDir, "teams")  (imported from envUtils)
 *   - sanitizeName           (uBn)  @362803
 *   - sanitizeAgentName      (tso)  @362806
 *   - getTeamDir             (QFt)  @362809  -> join(getTeamsDir(), sanitizeName(team))
 *   - getTeamFilePath        (gte)  @362812  -> join(getTeamDir(team), "config.json")
 *   - readTeamFileSync       (gj)   @362815  (sync; ENOENT -> null)
 *   - readTeamFile (async)   (Nhe)  @362824  (async; ENOENT -> null)
 *   - handleTeamWriteError   (dBn)  @362833  (errno -> log[error]; else reportError) (export-map: logTeamFileWriteFailure)
 *   - writeTeamFileSync      (ZFt)  @362837
 *   - missingTeamFileError   (ADa)  @362845  (export-map: teamMissingError; new TelemetrySafeError)
 *   - updateTeamFile         (ice)  @362851  (lock -> read -> mutate -> write)
 *   - removeTeamMember       (nso)  @362874  (async, via updateTeamFile)
 *   - writeTeamFile (async)  (pBn)  @362885
 *   - registerTeamForSessionCleanup (oso) @363019  (QKt().add(team))
 *   - lock options           (Dgp)  @363083  (proper-lockfile options)
 *   - leader member literal  (j3f)  @682777-682786 (exact member field set)
 *
 * 2.1.88 ancestor (shape + naming mirror): utils/swarm/teamHelpers.ts
 *   88 has the identical getTeamsDir/sanitizeName/getTeamDir/getTeamFilePath/
 *   readTeamFile(Sync|Async)/writeTeamFile(Sync|Async) + registerTeamForSessionCleanup
 *   (`getSessionCreatedTeams().add(team)`, backing Set in bootstrap/state.ts) and the
 *   TeamFile type (name/createdAt/leadAgentId/leadSessionId/members[...]). The member
 *   record here is narrowed to the field set the 183 leader literal actually writes; the
 *   88 TeamFile.members superset (model/prompt/color/planModeRequired/worktreePath/
 *   sessionId/isActive/mode) is preserved as optional for read compatibility. The
 *   lock-guarded updateTeamFile/removeTeamMember mutators are 183-new (not in the 88 tree).
 *
 * Identity accessors (getAgentName/getTeamName/getAgentId/getTeammateColor/...) live in
 * the SIBLING utils/teammate.ts (88 layout: utils/swarm/teamHelpers.ts imports them from
 * '../teammate.js'); this file is the team-FILE module only.
 *
 * scaffold: 30_agent_team/implicit_team_and_agent_tool_spawn.md +
 *           _scout_dossier_agent_team.md §2 (anchor table) / §4 (carryover note)
 *
 * cross-val: re-read getTeamFilePath (`gte` @362812 -> "config.json"), both readers
 *   (`gj`/`Nhe` @362815/362824, ENOENT->null + [TeammateTool] log), the async writer
 *   (`pBn` @362885: mkdir recursive then writeFile pretty-2), the error handler
 *   (`dBn` @362833), updateTeamFile (`ice` @362851: acquire `${path}.lock`, ENOENT ->
 *   missingTeamFileError, read -> mutate -> `s === false` short-circuit -> write, release in
 *   finally), removeTeamMember (`nso` @362874: splice via updateTeamFile, swallow+log),
 *   registerTeamForSessionCleanup (`oso` @363019: `QKt().add(team)`), and the leader member
 *   literal in `j3f` @682777-682786 in the 183 bundle. getTeamsDir (`Gbe` @735) is
 *   `join(tr(), "teams")` — no ".claude/teams" string literal anymore.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { join } from 'path'

import { getTeamsDir } from '../envUtils.js'
import { getErrnoCode, isErrnoException, errorMessage } from '../errors.js'
import { logForDebugging, reportError } from '../debug.js'
import { jsonParse, jsonStringify } from '../slowOperations.js'
// 2.1.183: getSessionCreatedTeams = QKt @cli_inner_pretty.js:3555
//   (`Ak()?.sessionCreatedTeams ?? Ot.sessionCreatedTeams`) — the per-session Set of team
//   names registered for orphan cleanup. Backing Set lives in bootstrap/state (mirrors 88).
import { getSessionCreatedTeams } from '../../bootstrap/state.js'

// ---------------------------------------------------------------------------
// External locking dep (proper-lockfile wrapper) — referenced, not reconstructed here.
// ---------------------------------------------------------------------------

/** proper-lockfile options re-used for every team-file lock acquisition. */
// 2.1.183: LOCK_OPTIONS = Dgp @cli_inner_pretty.js:363083
const LOCK_OPTIONS = {
  realpath: false,
  retries: { retries: 10, minTimeout: 5, maxTimeout: 100 },
  onCompromised: () => {},
} as const

/**
 * Acquire an advisory lock and return its release function (a thin wrapper over
 * proper-lockfile's async `lock`).
 *
 * 2.1.183: acquireLock = $h @cli_inner_pretty.js:104968
 *   `let n = await lock(e, t); return Object.assign(n, { [Symbol.asyncDispose]: n });`
 */
declare function acquireLock(
  path: string,
  options: typeof LOCK_OPTIONS & { lockfilePath: string },
): Promise<() => Promise<void>>

/**
 * TelemetrySafeError — thrown when the team file is missing.
 *
 * 2.1.183: TelemetrySafeError = Bl @cli_inner_pretty.js:8957
 *   `class Bl extends Error { constructor(e, t) { super(e); this.name = "TelemetrySafeError"; this.telemetryMessage = t ?? e } }`
 */
declare class TelemetrySafeError extends Error {
  telemetryMessage: string
  constructor(message: string, telemetryMessage?: string)
}

// ---------------------------------------------------------------------------
// Team member record + TeamFile shape
// ---------------------------------------------------------------------------

/**
 * One member entry persisted in the team's config.json.
 *
 * 2.1.183: the leader member literal written by initializeSessionTeam (`j3f`)
 *   @cli_inner_pretty.js:682777-682786 uses exactly:
 *     { agentId, name, agentType, joinedAt, tmuxPaneId, cwd, subscriptions, backendType }
 *   (leader values: name=agentType="team-lead", tmuxPaneId:"leader", cwd:`Ar()`,
 *    subscriptions:[], backendType:"in-process").
 *
 * The remaining optional fields are carryover from the v2.1.88 TeamFile.members
 * superset (teamHelpers.ts) — pane-backed teammates and the TeamsDialog populate
 * them; readers must tolerate them.
 */
export type TeamMember = {
  /** Full agent id, e.g. "researcher@my-team" (`bQ(name, team)`). */
  agentId: string
  /** Display name, e.g. "researcher". The leader's name is "team-lead". */
  name: string
  /** Type/role; mirrors `name` for the leader. */
  agentType?: string
  /** Epoch ms when this member joined (`Date.now()`). */
  joinedAt: number
  /** Pane id; the literal "leader" for the team lead, otherwise the tmux pane. */
  tmuxPaneId: string
  /** Working directory the member runs in. */
  cwd: string
  /** Inbox subscriptions (topics this member listens on). Empty for the leader. */
  subscriptions: string[]
  /** Execution backend; "in-process" for the leader and in-process teammates. */
  backendType?: string
  // --- 88-carryover optional fields (not written by the 183 leader literal) ---
  model?: string
  prompt?: string
  color?: string
  planModeRequired?: boolean
  worktreePath?: string
  sessionId?: string
  /** false when idle; undefined/true when active. */
  isActive?: boolean
  /** Current permission mode for this teammate. */
  mode?: string
}

/**
 * The on-disk team config (config.json).
 *
 * 2.1.183: written by initializeSessionTeam (`j3f`) @682771-682788:
 *   { name, createdAt, leadAgentId, leadSessionId, members:[<leader>] }
 * (88 TeamFile also carries optional description/hiddenPaneIds/teamAllowedPaths,
 *  preserved here for read compatibility.)
 */
export type TeamFile = {
  name: string
  description?: string
  createdAt: number
  leadAgentId: string
  /** Actual session uuid of the leader (`xt()`), for discovery. */
  leadSessionId?: string
  hiddenPaneIds?: string[]
  teamAllowedPaths?: Array<{
    path: string
    toolName: string
    addedBy: string
    addedAt: number
  }>
  members: TeamMember[]
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

// Root directory for all team data is <configDir>/teams.
// 2.1.183: getTeamsDir = Gbe @cli_inner_pretty.js:735 — `join(tr(), "teams")`,
//   where `tr()` is the config dir. There is NO ".claude/teams" string literal;
//   the path is assembled at runtime. Imported from envUtils to mirror the 88
//   ancestor layout (utils/envUtils.ts getTeamsDir -> utils/swarm/teamHelpers.ts).

/**
 * Lowercases and replaces every non-alphanumeric char with a hyphen, for use in
 * tmux window names, worktree paths, and the team's directory name.
 */
// 2.1.183: sanitizeName = uBn @cli_inner_pretty.js:362803
export function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
}

/**
 * Replaces "@" with "-" so an agent name can't break the `name@team` agent-id
 * format.
 */
// 2.1.183: sanitizeAgentName = tso @cli_inner_pretty.js:362806
export function sanitizeAgentName(name: string): string {
  return name.replaceAll('@', '-')
}

// 2.1.183: getTeamDir = QFt @cli_inner_pretty.js:362809
export function getTeamDir(teamName: string): string {
  return join(getTeamsDir(), sanitizeName(teamName))
}

/** Path to a team's config.json. */
// 2.1.183: getTeamFilePath = gte @cli_inner_pretty.js:362812
export function getTeamFilePath(teamName: string): string {
  return join(getTeamDir(teamName), 'config.json')
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/**
 * Sync read of a team file (for sync contexts like React render paths).
 * Missing file -> null; any other failure is logged and also yields null.
 */
// 2.1.183: readTeamFileSync = gj @cli_inner_pretty.js:362815
export function readTeamFileSync(teamName: string): TeamFile | null {
  try {
    const content = readFileSync(getTeamFilePath(teamName), 'utf-8')
    return jsonParse(content) as TeamFile
  } catch (e) {
    if (getErrnoCode(e) === 'ENOENT') return null // @362820
    logForDebugging(
      `[TeammateTool] Failed to read team file for ${teamName}: ${errorMessage(e)}`,
    )
    return null
  }
}

/** Async read of a team file (for tool handlers / async contexts). */
// 2.1.183: readTeamFile = Nhe @cli_inner_pretty.js:362824
export async function readTeamFile(teamName: string): Promise<TeamFile | null> {
  try {
    const content = await readFile(getTeamFilePath(teamName), 'utf-8')
    return jsonParse(content) as TeamFile
  } catch (e) {
    if (getErrnoCode(e) === 'ENOENT') return null // @362829
    logForDebugging(
      `[TeammateTool] Failed to read team file for ${teamName}: ${errorMessage(e)}`,
    )
    return null
  }
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/**
 * Classifies a team-write failure: a real filesystem (errno) error is logged at
 * error level with [TeammateTool] context; anything else is treated as an
 * unexpected programming error and routed to the generic error reporter.
 *
 * 2.1.183: handleTeamWriteError = dBn @cli_inner_pretty.js:362833 (export-map: logTeamFileWriteFailure)
 *   `if (Up(t)) v(... ,{level:"error"}); else De(t);`
 *   (Up = isErrnoException @8857, De = reportError @45881)
 */
export function handleTeamWriteError(teamName: string, error: unknown): void {
  if (isErrnoException(error)) {
    logForDebugging(
      `[TeammateTool] Failed to write team file for ${teamName} (${getErrnoCode(error)}): ${errorMessage(error)}`,
      { level: 'error' },
    )
  } else {
    reportError(error)
  }
}

/**
 * Sync write of a team file: mkdir -p the team dir, then pretty-print (indent 2)
 * config.json. Failures go through handleTeamWriteError rather than throwing.
 */
// 2.1.183: writeTeamFileSync = ZFt @cli_inner_pretty.js:362837
export function writeTeamFileSync(teamName: string, teamFile: TeamFile): void {
  try {
    const dir = getTeamDir(teamName)
    mkdirSync(dir, { recursive: true })
    writeFileSync(getTeamFilePath(teamName), jsonStringify(teamFile, null, 2))
  } catch (e) {
    handleTeamWriteError(teamName, e)
  }
}

/**
 * Async write of a team file: mkdir -p the team dir, then pretty-print config.json.
 * Used at startup by initializeSessionTeam (`j3f`) as `pBn(n, l).catch(c => dBn(n, c))`
 * @682789, and by the locked updateTeamFile (`ice`) @362851 (pBn call @362865).
 */
// 2.1.183: writeTeamFile = pBn @cli_inner_pretty.js:362885
export async function writeTeamFile(
  teamName: string,
  teamFile: TeamFile,
): Promise<void> {
  const dir = getTeamDir(teamName)
  await mkdir(dir, { recursive: true })
  await writeFile(getTeamFilePath(teamName), jsonStringify(teamFile, null, 2))
}

// ---------------------------------------------------------------------------
// Lock-guarded mutation (183-new)
// ---------------------------------------------------------------------------

/**
 * The error thrown by updateTeamFile when the team file is missing at lock time —
 * the session team should always have been initialized at startup, so a missing
 * file is treated as an internal error (telemetry-safe message attached).
 */
// 2.1.183: missingTeamFileError = ADa @cli_inner_pretty.js:362845 (export-map: teamMissingError)
export function missingTeamFileError(teamName: string): TelemetrySafeError {
  return new TelemetrySafeError(
    `Internal error: team file for "${teamName}" not found. The session team should have been initialized at startup.`,
    'Team file missing (session team not initialized)',
  )
}

/**
 * Read-modify-write a team file under an advisory lock so concurrent teammate
 * writers can't clobber each other's roster edits.
 *
 * Flow (@362851):
 *   1. Acquire `${teamFilePath}.lock`. A pre-existing ENOENT during acquisition
 *      means the team file itself is gone -> throw missingTeamFileError; any other
 *      lock error propagates.
 *   2. Re-read the file UNDER the lock (the on-disk state may have changed since the
 *      caller last read it). An unreadable file after a successful lock is a hard error.
 *   3. Run the mutator. Returning `false` is a sentinel for "no change" — the write
 *      is SKIPPED and the lock released without touching the file. Any other return
 *      value is written back (pretty-print) and then returned to the caller.
 *   4. Release the lock in `finally`; a release failure is logged, never thrown.
 *
 * @param mutate mutates `teamFile` in place; return `false` to skip the write.
 */
// 2.1.183: updateTeamFile = ice @cli_inner_pretty.js:362851
export async function updateTeamFile<T>(
  teamName: string,
  mutate: (teamFile: TeamFile) => T | false,
): Promise<T | undefined> {
  const teamFilePath = getTeamFilePath(teamName)
  let release: () => Promise<void>
  try {
    // @362855
    release = await acquireLock(teamFilePath, {
      lockfilePath: `${teamFilePath}.lock`,
      ...LOCK_OPTIONS,
    })
  } catch (e) {
    if (getErrnoCode(e) === 'ENOENT') throw missingTeamFileError(teamName) // @362857
    throw e
  }
  try {
    const teamFile = await readTeamFile(teamName) // @362861
    if (!teamFile) {
      throw new Error('Team config file unreadable (lock acquired, read failed)') // @362862
    }
    const result = mutate(teamFile) // @362863
    if (result === false) return // @362864 — sentinel: no change, skip the write.
    await writeTeamFile(teamName, teamFile) // @362865
    return result
  } finally {
    try {
      await release() // @362868
    } catch (e) {
      logForDebugging(`[TeammateTool] updateTeamFile lock release failed: ${errorMessage(e)}`) // @362870
    }
  }
}

/**
 * Remove a member (by full agentId) from the team file, under the lock. A
 * not-found member returns the `false` sentinel so updateTeamFile skips the write.
 * Any failure is swallowed and logged — roster removal is best-effort.
 */
// 2.1.183: removeTeamMember = nso @cli_inner_pretty.js:362874
export async function removeTeamMember(teamName: string, agentId: string): Promise<void> {
  try {
    await updateTeamFile(teamName, (teamFile) => {
      const idx = teamFile.members.findIndex((m) => m.agentId === agentId) // @362877
      if (idx === -1) return false // @362878 — not present: skip write.
      teamFile.members.splice(idx, 1) // @362879
    })
  } catch (e) {
    logForDebugging(`[TeammateTool] removeTeamMember(${agentId}) failed: ${errorMessage(e)}`) // @362882
  }
}

// ---------------------------------------------------------------------------
// Session-cleanup tracking
// ---------------------------------------------------------------------------

/**
 * Mark a team as created this session so it gets cleaned up on exit. Called right
 * after the initial writeTeamFile (by initializeSessionTeam). The backing Set
 * lives in bootstrap/state so it is reset between tests.
 */
// 2.1.183: registerTeamForSessionCleanup = oso @cli_inner_pretty.js:363019  (`QKt().add(e)`)
export function registerTeamForSessionCleanup(teamName: string): void {
  getSessionCreatedTeams().add(teamName)
}

// Mapping: getTeamsDir->Gbe, sanitizeName->uBn, sanitizeAgentName->tso, getTeamDir->QFt,
//          getTeamFilePath->gte, readTeamFileSync->gj, readTeamFile->Nhe,
//          handleTeamWriteError->dBn (export-map logTeamFileWriteFailure), writeTeamFileSync->ZFt,
//          missingTeamFileError->ADa (export-map teamMissingError), updateTeamFile->ice,
//          removeTeamMember->nso, writeTeamFile->pBn, registerTeamForSessionCleanup->oso,
//          getSessionCreatedTeams->QKt, acquireLock->$h, LOCK_OPTIONS->Dgp,
//          TelemetrySafeError->Bl, getErrnoCode->dn, isErrnoException->Up, errorMessage->Se,
//          logForDebugging->v, reportError->De, jsonParse->Gt, jsonStringify->Re
