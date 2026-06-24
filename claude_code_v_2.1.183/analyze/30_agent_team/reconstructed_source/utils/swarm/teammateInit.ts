/**
 * Implicit Session Team — the centerpiece of the v2.1.178 agent-team redesign.
 *
 * 2.1.183 regions covered:
 *   - cli_inner_pretty.js:682752-682754  sessionTeamName (xic) + SESSION_TEAM_PREFIX (B3f)
 *   - cli_inner_pretty.js:682755-682763  readInheritedTeamName (F3f) + reset helper (U3f)
 *   - cli_inner_pretty.js:682765-682815  initializeSessionTeam (j3f)
 *   - cli_inner_pretty.js:693471-693478  CLI bootstrap gate (Sl() && !xr() && !a.agentId)
 *   - cli_inner_pretty.js:694463         seed into AppState (...(c && {teamContext, teammateColors}))
 *   - cli_inner_pretty.js:3558/3561      getInheritedTeamName (ZKt) / setInheritedTeamName (e7t)
 *
 * 2.1.88 ancestor mirrored: utils/swarm/teammateInit.ts (SHAPE ONLY — the 88 file was the
 *   teammate-side hook installer; v2.1.88 had NO implicit team — TeamCreate did this work).
 *   Carryover helpers borrowed from 88: utils/swarm/teamHelpers.ts (team-file I/O +
 *   registerTeamForSessionCleanup: getTeamFilePath/readTeamFile/writeTeamFile/handleTeamWriteError),
 *   utils/tasks.ts (getTasksDir/ensureTasksDir/setLeaderTeamName), bootstrap/state.ts
 *   (getSessionId/getOriginalCwd).
 *
 * scaffold: 30_agent_team/implicit_team_and_agent_tool_spawn.md (§1, §1.1, §1.2, bootstrap gate);
 *   _scout_dossier_agent_team.md.
 *
 * cross-val (re-read in the 2.1.183 bundle):
 *   - j3f body @682765-682815 char-for-char (name resolution, idempotent write, leader-only roster,
 *     tasks-dir migration, seed return). xic @682752 = `${B3f}-${e.slice(0,8)}`, B3f="session" @682817.
 *   - F3f @682756 reads CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME ONCE, `delete`s the env var, caches via
 *     e7t/ZKt (Ot.inheritedTeamName). U3f @682762 = `e7t(void 0)`.
 *   - bootstrap gate @693472 = `if (Sl() && !xr() && !a.agentId)`, lazy `import()` of the kic module,
 *     non-fatal catch -> De(); result `c` spread into AppState @694463.
 *   - iy[0] palette head = "red" (iy = ["red","blue","green","yellow","purple","orange","pink","cyan"] @353809).
 */

import { rename } from 'fs/promises'

// 2.1.183 bootstrap-state accessors (mirror the 88 state-accessor idiom):
//   getSessionId           = xt  @cli_inner_pretty.js:2661  (Ot.sessionId)
//   getOriginalCwd         = Ar  @cli_inner_pretty.js:2710  (Ot.originalCwd)
//   getInheritedTeamName   = ZKt @cli_inner_pretty.js:3558  (Ot.inheritedTeamName getter)
//   setInheritedTeamName   = e7t @cli_inner_pretty.js:3561  (Ot.inheritedTeamName setter)
//   isNonInteractive       = xr  @cli_inner_pretty.js:3151  (`!Ot.isInteractive`)
import {
  getInheritedTeamName,
  getOriginalCwd,
  getSessionId,
  isNonInteractive,
  setInheritedTeamName,
} from '../../bootstrap/state.js'
import { formatAgentId } from '../agentId.js'
// TEAM_LEAD_NAME SSOT home is utils/swarm/constants.js (matches the 88 ancestor swarm/constants.ts).
import { TEAM_LEAD_NAME } from './constants.js'
import { isAgentSwarmsEnabled } from '../agentSwarmsEnabled.js'
import { reportError } from '../debug.js'
import {
  ensureTasksDir,
  getTasksDir,
  setLeaderTeamName,
} from '../tasks.js'
import {
  getTeamFilePath,
  handleTeamWriteError,
  readTeamFile,
  registerTeamForSessionCleanup,
  writeTeamFile,
  type TeamFile,
} from './teamHelpers.js'
import type { SessionTeamInit } from '../agentContext.js'
import { AGENT_COLORS } from '../../tools/AgentTool/agentColorManager.js'
import { SESSION_TEAM_PREFIX } from './constants.js'

// ===========================================================================
// 1. The deterministic session-scoped team name
// ===========================================================================

// 2.1.183: sessionTeamName = xic @cli_inner_pretty.js:682752
/**
 * Derives the implicit team name from the session id: `session-<sessionId[:8]>`.
 *
 * The 8-char slice keeps the name short and shell-safe (it lands on the
 * teammate sub-process `--team-name` CLI flag and in directory path components)
 * while staying effectively collision-free for the lifetime of a machine. The
 * "session" prefix makes the team's provenance obvious in logs and the teams dir.
 */
export function sessionTeamName(sessionId: string): string {
  // 2.1.183: `${B3f}-${e.slice(0, 8)}` — B3f = SESSION_TEAM_PREFIX = "session". @682753
  return `${SESSION_TEAM_PREFIX}-${sessionId.slice(0, 8)}`
}

// ===========================================================================
// 2. One-shot inheritance of the parent's team name (teammate sub-process)
// ===========================================================================
//
// A spawned assistant/teammate process inherits its parent's team name instead
// of minting a fresh one. The handoff travels via the env var
// CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME and is STRICTLY one-shot: the value is
// read exactly once, cached at module scope, and the env var is DELETED on that
// first read so it never leaks to any grandchild process this session spawns
// (e.g. a Bash subshell). The cache is the global AppState field
// `Ot.inheritedTeamName`, read/written through ZKt/e7t.

const INHERITED_TEAM_NAME_ENV = 'CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME'

// 2.1.183: readInheritedTeamName = F3f @cli_inner_pretty.js:682756
/**
 * Reads, consumes, and caches the inherited team name. Returns the cached value
 * (or null) on every subsequent call without touching the environment again.
 *
 * Why consume-on-read: if CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME leaked into child
 * processes, a teammate that later spawns its own sub-processes could
 * accidentally hand them the team name, polluting their environment. Deleting on
 * the first read makes the inheritance strictly parent -> child and only once.
 */
export function readInheritedTeamName(): string | null {
  // First read: the cache is `undefined` (never been read this process). @682756
  if (getInheritedTeamName() === undefined) {
    const fromEnv = process.env[INHERITED_TEAM_NAME_ENV] || null // @682757
    delete process.env[INHERITED_TEAM_NAME_ENV] // CONSUME — don't leak to children. @682758
    setInheritedTeamName(fromEnv) // cache (may be null). @682758
  }
  return getInheritedTeamName() ?? null // @682760
}

// 2.1.183: _resetInheritedTeamNameForTesting = U3f @cli_inner_pretty.js:682762
/** Test-only: clears the module-level inherited-name cache. */
export function _resetInheritedTeamNameForTesting(): void {
  setInheritedTeamName(undefined) // @682763
}

// ===========================================================================
// 3. The implicit team builder — runs once at CLI startup
// ===========================================================================

/** Optional override the bootstrap may pass (an already-known team name). */
export type InitializeSessionTeamOptions = {
  existingTeamName?: string
}

// 2.1.183: initializeSessionTeam = j3f @cli_inner_pretty.js:682765
/**
 * Creates the implicit, session-scoped team and returns the seed `teamContext`
 * (+ initial `teammateColors`) that the caller folds into AppState.
 *
 * Invariant established here: once this returns, `teamContext.teamName` is ALWAYS
 * populated before the model gets a turn — which is exactly what every spawn path
 * (sqa/SDp/EDp) now assumes ("Internal error: session team not initialized…").
 *
 * Ownership inversion vs v2.1.156: there, the MODEL owned the team's existence and
 * name (via TeamCreate). Here, the RUNTIME owns the team; the model only
 * contributes named teammates. This is why the Agent `team_name` parameter could
 * be demoted to "Deprecated; ignored" — there is nothing left to select between.
 */
export async function initializeSessionTeam(
  options?: InitializeSessionTeamOptions,
): Promise<SessionTeamInit> {
  // --- (1) Name resolution -------------------------------------------------
  // An inherited name (teammate sub-process) wins; otherwise derive from the
  // session id. NB: `existingTeamName` (||) takes precedence over the env var,
  // then the env-var/cache (??) over the derived name. @682766
  const inheritedName = options?.existingTeamName || readInheritedTeamName()
  const teamName = inheritedName ?? sessionTeamName(getSessionId()) // xic(xt()) @682767
  const leadAgentId = formatAgentId(TEAM_LEAD_NAME, teamName) // bQ(np, n) => "team-lead@<team>" @682768
  const teamFilePath = getTeamFilePath(teamName) // gte(n) @682769

  // --- (2) Idempotent write ------------------------------------------------
  // For a FRESH name (no inherited name) `inheritedName ? readTeamFile : null`
  // short-circuits to null, so the `if (!(...))` is always true and the file is
  // written. For an INHERITED name we first re-read; if the file already exists
  // (the leader wrote it) the write is SKIPPED — this prevents a late-starting
  // teammate from racing the leader and clobbering the roster. @682770
  if (!(inheritedName ? await readTeamFile(teamName) : null)) {
    const teamConfig: TeamFile = {
      name: teamName, // @682772
      createdAt: Date.now(), // @682773
      leadAgentId, // @682774
      leadSessionId: getSessionId(), // xt() — actual leader session uuid, for discovery. @682775
      members: [
        // The roster starts LEADER-ONLY. Teammates are appended lazily by the
        // spawn paths (sqa/SDp/EDp) as the model spawns them. @682776-682786
        {
          agentId: leadAgentId,
          name: TEAM_LEAD_NAME, // "team-lead" @682779
          agentType: TEAM_LEAD_NAME, // mirrors name for the leader @682780
          joinedAt: Date.now(),
          tmuxPaneId: 'leader', // sentinel — the leader has no real pane. @682782
          cwd: getOriginalCwd(), // Ar() @682783
          subscriptions: [],
          backendType: 'in-process', // the leader always runs in-process. @682785
        },
      ],
    }
    // pBn(n, l).catch(c => dBn(n, c)) — a write failure is LOGGED, never thrown. @682789
    await writeTeamFile(teamName, teamConfig).catch(e =>
      handleTeamWriteError(teamName, e),
    )
  }

  // --- (3) Register as the active task-list team --------------------------
  // setLeaderTeamName so the tasks subsystem stores/looks up this leader's tasks
  // under the team name (where tmux/iTerm2 teammates also look), not the raw
  // session id. Emits a "tasks updated" event for subscribers. @682791
  setLeaderTeamName(teamName) // Dla(n)

  // --- (4) Migrate any session-id-keyed tasks dir to the team name --------
  // If the team name differs from the raw session id, best-effort rename the
  // session-keyed tasks dir to the canonical team-named dir (an earlier path or
  // an inherited name may have keyed tasks by session id). Swallow failure. @682793
  const sessionId = getSessionId() // xt()
  if (teamName !== sessionId) {
    await rename(getTasksDir(sessionId), getTasksDir(teamName)).catch(() => {}) // Iic.rename(WG(i), WG(n))
  }
  await ensureTasksDir(teamName) // NXr(n): mkdir of the team tasks dir. @682794
  registerTeamForSessionCleanup(teamName) // oso(n): add to the orphan-cleanup set. @682794

  // --- (5) Seed teamContext + color bookkeeping ---------------------------
  const leaderColor = AGENT_COLORS[0] // iy[0] = "red" @682795
  return {
    teamContext: {
      teamName, // @682798
      teamFilePath, // @682799
      leadAgentId, // @682800
      teammates: {
        // Live roster keyed by agentId — seeded with only the leader. @682801-682811
        [leadAgentId]: {
          name: TEAM_LEAD_NAME,
          agentType: TEAM_LEAD_NAME,
          color: leaderColor,
          tmuxSessionName: 'in-process', // sentinel for the leader/in-process. @682806
          tmuxPaneId: 'leader', // @682807
          cwd: getOriginalCwd(), // Ar() @682808
          spawnedAt: Date.now(),
        },
      },
    },
    teammateColors: {
      // The live color-assignment state the spawn paths extend per new teammate. @682813
      assignments: new Map([[leadAgentId, leaderColor]]),
      index: 1, // next color index to hand out.
    },
  }
}

// ===========================================================================
// 4. CLI bootstrap gate (reconstructed as a callable for documentation)
// ===========================================================================
//
// In the bundle the implicit team is created inline at the CLI bootstrap
// (cli_inner_pretty.js:693471-693478) and its result is later spread into the
// new AppState at :694463:
//
//   let c;
//   if (Sl() && !xr() && !a.agentId)
//     try {
//       let { initializeSessionTeam: Jn } = await Promise.resolve().then(() => (Lic(), kic));
//       c = await Jn();
//     } catch (Jn) { De(Jn); }
//   ...
//   ...(c && { teamContext: c.teamContext, teammateColors: c.teammateColors }),   // @694463
//
// The three-part gate `Sl() && !xr() && !a.agentId`:
//   1. Sl()  (isAgentSwarmsEnabled @293831) — swarms must be opted in
//      (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS / --agent-teams + tengu_amber_flint).
//   2. !xr() (NOT isNonInteractive @3151; xr = `!Ot.isInteractive`) — interactive
//      REPL only; --print/headless runs have nobody to drive a team.
//   3. !cliArgs.agentId — the --agent-id flag is set ONLY on a spawned teammate's
//      own `claude` process, so a teammate sub-process must NOT mint its own
//      session team — it inherits the leader's. (Recursion guard at bootstrap.)
//
// Lazy `import()` keeps the team machinery off the hot path for the common
// no-swarm session; the catch swallows to reportError (De) so a failed team-file
// write degrades swarms but never blocks the REPL from booting ("team is an
// enhancement, not a precondition").

/**
 * Reconstructed bootstrap helper — runs the implicit-team init iff the gate holds
 * and returns the seed (or undefined). The real bundle inlines this at the CLI
 * entry; extracted here so the gate logic is in one verifiable place.
 *
 * @param cliArgs the parsed CLI args object (`a` in the bundle); only `agentId`
 *   (the `--agent-id` flag) is consulted.
 */
export async function bootstrapSessionTeam(cliArgs: {
  agentId?: string
}): Promise<SessionTeamInit | undefined> {
  // 2.1.183: gate @693472 — isNonInteractive (xr) is read off global state.
  if (!isAgentSwarmsEnabled() || isNonInteractive() || cliArgs.agentId) {
    return undefined
  }
  try {
    // The bundle lazy-imports the kic module here; in this tree the module is
    // statically linked, so we just call the export directly. @693474
    return await initializeSessionTeam()
  } catch (e) {
    reportError(e) // De() — non-fatal: swarm degrades, REPL still boots. @693477
    return undefined
  }
}

// ===========================================================================
// Mapping
// ===========================================================================
// j3f                       -> initializeSessionTeam
// xic                       -> sessionTeamName
// B3f                       -> SESSION_TEAM_PREFIX ("session")
// F3f                       -> readInheritedTeamName
// U3f                       -> _resetInheritedTeamNameForTesting
// ZKt                       -> getInheritedTeamName (Ot.inheritedTeamName getter)
// e7t                       -> setInheritedTeamName (Ot.inheritedTeamName setter)
// xt                        -> getSessionId
// Ar                        -> getOriginalCwd
// bQ                        -> formatAgentId
// np                        -> TEAM_LEAD_NAME ("team-lead")
// gte                       -> getTeamFilePath
// Nhe                       -> readTeamFile (async)
// pBn                       -> writeTeamFile (async)
// dBn                       -> handleTeamWriteError
// Dla                       -> setLeaderTeamName  (sets $Xr active-team var, emits via Lla)
// WG                        -> getTasksDir (<configDir>/tasks/<sanitized team>)
// NXr                       -> ensureTasksDir (mkdir of the team tasks dir)
// oso                       -> registerTeamForSessionCleanup (adds to QKt() session-created set)
// iy                        -> AGENT_COLORS (88: tools/AgentTool/agentColorManager.ts; iy[0] = "red")
// Iic                       -> fs/promises
// Sl                        -> isAgentSwarmsEnabled
// xr                        -> isNonInteractive
// a (cli args).agentId      -> cliArgs.agentId
// De                        -> reportError
// c (bootstrap local)       -> SessionTeamInit return spread into AppState @694463
