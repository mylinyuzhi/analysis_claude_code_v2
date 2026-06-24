/**
 * Teammate spawn dispatch + the three backend spawn paths (v2.1.183).
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - dispatch:                cqa @423053-423055, HDp @423041-423052
 *   - identity reservation:    Xdo @422572-422623 (reserveTeammateIdentity), bDp @422632-422643
 *   - in-process path:         sqa @422925-423040 (spawnInProcessTeammate)
 *   - split-pane path:         SDp @422644-422761 (spawnPaneTeammate)
 *   - non-split-pane path:     EDp @422762-422880 (spawnNonSplitPaneTeammate)
 *   - in-process task register: lqa @422881-422924 (registerInProcessTask)
 *   - spawn helpers:           Ydo @422517-422528 (resolveTeammateModel), Jdo @422625-422631
 *                              (updateMemberBackend), iqa @422546-422549 (resolveTeammateExecPath),
 *                              aqa @422550-422571 (buildInheritedCliFlags), Qjt @421655-421663
 *                              (buildInheritedEnvVars), Vdo @422480-422482 (getCurrentBackend),
 *                              eqa @422483-422486, tqa @422487-422489, nqa @422490-422492,
 *                              rqa @422493-422495 (pane delegates), _Dp @422536-422545
 *                              (ensureExternalSwarmSession), yDp @422533-422535 (hasTmuxSession)
 *
 * 2.1.88 ancestors (shape mirrored):
 *   - utils/swarm/spawnInProcess.ts        (spawnInProcessTeammate / killInProcessTeammate)
 *   - utils/swarm/spawnUtils.ts            (getTeammateCommand, buildInheritedCliFlags, buildInheritedEnvVars)
 *   - utils/swarm/backends/PaneBackendExecutor.ts (the `cd … && env … claude --agent-id …` command builder)
 * NOTE: the v2.1.178 redesign reshaped the topology — the leaf spawners no longer receive a
 *   `team_name` argument; they READ the implicit `getAppState().teamContext.teamName` and throw the
 *   "session team not initialized" internal error when it is missing. So the 88 PaneBackendExecutor
 *   is mirrored only for the command-string shape, not the control flow.
 *
 * scaffold: 30_agent_team/implicit_team_and_agent_tool_spawn.md (§2.3 dispatcher, §2.4 guard) +
 *           30_agent_team/spawn_backends_and_tmux_fix.md (§5 SDp command tail, §1 backend split).
 *
 * cross-val (re-read in the 183 bundle):
 *   - HDp/cqa @423041-423055: in-process short-circuit (rWe) → detect (eLe) → auto-fallback (Wdo) →
 *     `use_splitpane !== false ? SDp : EDp`; protocol-frame-prompt reject (iF) up front.  CONFIRMED.
 *   - SDp @422659, EDp @422777, sqa @422939: the byte-exact "Internal error: session team not
 *     initialized. This should have happened at startup when agent swarms are enabled."  CONFIRMED.
 *   - SDp command tail @422696-422704: `cd ${Ja([p])} && env ${k} ${Ja([T])} ${C}${I}`, then
 *     mailbox seed ($A) → rqa (→ sendCommandToPane → respawn-pane).  CONFIRMED.
 *   - EDp @422815-422824: control-char guard (Slt) then a3n([], paneId, cmd) directly (no rqa).  CONFIRMED.
 *   - Xdo @422572: reserves the identity in the team file FIRST (members.push), then runs the body with
 *     commit/rollback callbacks; rolls back the roster entry (nso) only on a PRE-commit throw.  CONFIRMED.
 *   - bDp @422632: rejects "main" (LY), de-dupes name collisions to `${name}-${n}`.  CONFIRMED.
 */

import { quote } from '../bash/shellQuote.js'
import { isInBundledMode } from '../bundledMode.js'
import { formatAgentId } from '../agentId.js'
// MAIN_RESERVED_NAME SSOT home is utils/agentId.js; TEAM_LEAD_NAME SSOT home is utils/swarm/constants.js.
import { MAIN_RESERVED_NAME } from '../agentId.js'
import { getCwd } from '../../bootstrap/state.js'
import { getSessionId } from '../../bootstrap/state.js'
import { getMainLoopModelOverride } from '../../bootstrap/state.js'
import { logForDebugging } from '../debug.js'
import { logError, formatError } from '../errors.js'
import { logTelemetryError, logTelemetrySuccess } from '../telemetry.js'
import { writeToMailbox } from '../teammateMailbox.js'
import { clearInbox } from '../teammateMailbox.js'
import { isStructuredProtocolMessage, PROTOCOL_FRAME_PROMPT_ERROR } from '../teammateControlMessages.js'
import { SwarmPaneError, assertNoControlChars, hasControlChars } from './backends/TmuxBackend.js'
import { sendCommandViaRespawn } from './backends/TmuxBackend.js'
import { runTmux } from './backends/TmuxBackend.js'
import { detectPaneBackend } from './backends/detection.js'
import { isInsideTmux } from './backends/detection.js'
import { isInProcessEnabled, getTeammateMode, markInProcessFallback } from './backends/registry.js'
import { startInProcessTeammate } from './inProcessRunner.js'
// spawnInProcessTeammate (Tlt @363090) lives in the low-level in-process spawn module
// (88 ancestor utils/swarm/spawnInProcess.ts; un-reconstructed sibling in this unit's scope).
import { spawnInProcessTeammate } from './spawnInProcess.js'
import { updateTeamFile, removeTeamMember } from './teamHelpers.js'
import { TMUX_BIN, TMUX_HOLDING_CMD, TEAMMATE_COMMAND_ENV, SWARM_SESSION_NAME, TEAM_LEAD_NAME } from './constants.js'
import type { ToolUseContext } from '../../Tool.js'

// ---------------------------------------------------------------------------
// Spawn request / result shapes
// ---------------------------------------------------------------------------

/**
 * The request the Agent tool's teammate-routing builds and hands to spawnTeammate.
 * Note: there is NO `team_name` here — the leaf spawners read the implicit team
 * from app state (the v2.1.178 redesign). `team_name` survives only as a
 * deprecated/ignored Agent-tool parameter.
 */
export type TeammateSpawnRequest = {
  name: string
  prompt: string
  description?: string
  agent_type?: string
  model?: string
  cwd?: string
  /** When false, route to the non-split tmux window path (EDp) instead of the swarm-view split (SDp). */
  use_splitpane?: boolean
  plan_mode_required?: boolean
  invokingRequestId?: string
}

/** The `{ data: … }` envelope returned by every spawn path (shape shared with v2.1.156). */
export type TeammateSpawnResult = {
  data: {
    teammate_id: string
    agent_id: string
    agent_type?: string
    model?: string
    name: string
    color: string
    tmux_session_name: string
    tmux_window_name: string
    tmux_pane_id: string
    team_name: string
    is_splitpane: boolean
    plan_mode_required?: boolean
  }
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

// 2.1.183: spawnTeammate = cqa @cli_inner_pretty.js:423053
/**
 * Thin wrapper the Agent tool's `call` invokes. Delegates to the dispatcher. The
 * dossier names this `cqa` because it is the symbol Agent.call references; the real
 * dispatch is `dispatchTeammateSpawn` (HDp).
 */
export async function spawnTeammate(
  request: TeammateSpawnRequest,
  ctx: ToolUseContext,
): Promise<TeammateSpawnResult> {
  return dispatchTeammateSpawn(request, ctx) // @423054
}

// 2.1.183: dispatchTeammateSpawn = HDp @cli_inner_pretty.js:423041
/**
 * Picks the backend spawn path:
 *   1. Reject a prompt that is itself a teammate-protocol frame (would corrupt the mailbox).
 *   2. If in-process mode is enabled (rWe) — non-interactive, explicit "in-process", or an
 *      already-active fallback — spawn in-process and stop. This is the master backend toggle.
 *   3. Otherwise probe for a pane backend (eLe). On probe failure, surface the error UNLESS the
 *      mode is "auto", in which case degrade to in-process and set the sticky fallback bit (Wdo).
 *   4. With a pane backend available: `use_splitpane !== false` → the swarm-view split (SDp),
 *      else a standalone tmux window (EDp).
 */
export async function dispatchTeammateSpawn(
  request: TeammateSpawnRequest,
  ctx: ToolUseContext,
): Promise<TeammateSpawnResult> {
  // @423042
  if (request.prompt && isStructuredProtocolMessage(request.prompt)) {
    logTelemetryError('subagent_launch', 'subagent_teammate_protocol_frame_prompt')
    throw new Error(PROTOCOL_FRAME_PROMPT_ERROR) // gUt
  }

  if (isInProcessEnabled()) return spawnInProcessTeammatePath(request, ctx) // @423043  (rWe → sqa)

  try {
    await detectPaneBackend() // @423045  (eLe: probe tmux / iTerm2)
  } catch (err) {
    // @423047  explicit pane mode ⇒ surface the failure; only "auto" degrades.
    if (getTeammateMode() !== 'auto') {
      logTelemetryError('subagent_launch', 'subagent_teammate_pane_unavailable')
      throw err
    }
    logForDebugging(
      `[handleSpawn] No pane backend available, falling back to in-process: ${formatError(err)}`,
    )
    markInProcessFallback() // @423048  (Wdo: sticky bit)
    return spawnInProcessTeammatePath(request, ctx)
  }

  if (request.use_splitpane !== false) return spawnPaneTeammate(request, ctx) // @423050  (SDp)
  return spawnNonSplitPaneTeammate(request, ctx) // @423051  (EDp)
}

// Mapping: cqa→spawnTeammate, HDp→dispatchTeammateSpawn, iF→isStructuredProtocolMessage, gUt→PROTOCOL_FRAME_PROMPT_ERROR,
//          rWe→isInProcessEnabled, eLe→detectPaneBackend, Aje→getTeammateMode, Wdo→markInProcessFallback,
//          sqa→spawnInProcessTeammatePath, SDp→spawnPaneTeammate, EDp→spawnNonSplitPaneTeammate, v→logForDebugging
// NOTE: HDp @423046 calls the snapshot getter Aje() @293813 DIRECTLY (= our getTeammateMode); this is
//       distinct from the registry wrapper mDp @422422, which itself delegates to Aje() — same value, two call sites.

// ---------------------------------------------------------------------------
// Shared identity reservation (Xdo) + name de-dup (bDp)
// ---------------------------------------------------------------------------

type ReservedIdentity = {
  sanitizedName: string
  teammateId: string
  teammateColor: string
}

/** App-state color allocator handed to every spawn path (`t.teammateColors`). */
type TeammateColors = { assign(agentId: string): string }

// 2.1.183: reserveTeammateIdentity = Xdo @cli_inner_pretty.js:422572
/**
 * Reserves a teammate's identity in the team file BEFORE running the backend-specific
 * spawn body, then runs that body with commit/rollback callbacks.
 *
 * Why reserve first: the roster entry (with a de-duped name, an `agentId`, and a color)
 * must exist before the teammate's own process can find itself in the team file. The body
 * receives a `commit` callback (call once the teammate is irreversibly live) and a
 * `registerCleanup` callback (register a pane-kill to run on a pre-commit failure).
 *
 * Rollback policy:
 *   - throw BEFORE commit ⇒ run the registered pane cleanup, then remove the roster entry (nso).
 *   - throw AFTER commit  ⇒ keep the entry (the agent is already running) and just log; rethrow.
 */
export async function reserveTeammateIdentity(
  name: string,
  teamName: string,
  memberDefaults: {
    agentType?: string
    model?: string
    prompt: string
    planModeRequired?: boolean
    cwd: string
  },
  colors: TeammateColors,
  body: (
    identity: ReservedIdentity,
    commit: () => void,
    registerCleanup: (cleanup: () => void | Promise<void>) => void,
  ) => Promise<TeammateSpawnResult>,
): Promise<TeammateSpawnResult> {
  // @422573  reject control chars in BOTH name and team_name, with a field-specific message.
  for (const [field, value] of [
    ['name', name],
    ['team_name', teamName],
  ] as const)
    if (hasControlChars(value)) {
      logTelemetryError('subagent_launch', 'subagent_teammate_control_chars')
      throw new Error(
        field === 'name'
          ? 'Invalid name: control characters are not allowed in agent or team names'
          : 'Invalid team_name: control characters are not allowed in agent or team names',
      )
    }

  // @422586  Atomically push a roster member into the team file. The de-duped name + agentId +
  //          color come out so the body knows its final identity.
  const reserved = await updateTeamFile(teamName, (teamFile) => {
    const sanitizedName = dedupeTeammateName(name, teamFile) // bDp
    const teammateId = formatAgentId(sanitizedName, teamName) // bQ
    const teammateColor = colors.assign(teammateId)
    teamFile.members.push({
      agentId: teammateId,
      name: sanitizedName,
      color: teammateColor,
      joinedAt: Date.now(),
      tmuxPaneId: '',
      subscriptions: [],
      ...memberDefaults,
    })
    return { sanitizedName, teammateId, teammateColor }
  })
  if (!reserved) {
    // @422596
    logTelemetryError('subagent_launch', 'subagent_teammate_internal_invariant')
    throw new Error('reserveTeammateIdentity: updateTeamFile returned undefined')
  }

  let committed = false
  let cleanup: (() => void | Promise<void>) | undefined
  try {
    return await body(
      reserved,
      () => {
        committed = true // @422606
      },
      (fn) => {
        cleanup = fn // @422609
      },
    )
  } catch (err) {
    if (!committed) {
      // @422613  pre-commit failure: undo the pane (if any) and the roster entry.
      if (cleanup)
        try {
          await cleanup()
        } catch (cleanupErr) {
          logForDebugging(
            `[spawnTeammate] pane cleanup failed for ${reserved.teammateId}: ${formatError(cleanupErr)}`,
          )
        }
      await removeTeamMember(teamName, reserved.teammateId) // nso
    } else {
      // @422621  post-commit failure: the agent is already running, keep the entry.
      logForDebugging(
        `[spawnTeammate] post-commit failure for ${reserved.teammateId}; entry kept (agent already running): ${formatError(err)}`,
      )
    }
    throw err
  }
}

// 2.1.183: dedupeTeammateName = bDp @cli_inner_pretty.js:422632
/**
 * Sanitizes a requested teammate name (strip `@`) and ensures it is unique within
 * the team roster (case-insensitive). Rejects the reserved "main" name. Collisions
 * get a numeric suffix: `name-2`, `name-3`, …
 */
function dedupeTeammateName(name: string, teamFile: { members: { name: string }[] }): string {
  const sanitized = sanitizeAgentName(name) // tso: replaceAll("@","-")  @422633
  if (sanitized === MAIN_RESERVED_NAME)
    // @422634  byte-exact (note the em-dash —)
    throw new Error(
      '"main" is a reserved recipient name (SendMessage routes it to the main conversation) — choose another teammate name.',
    )
  const taken = new Set(teamFile.members.map((m) => m.name.toLowerCase())) // @422638
  if (!taken.has(sanitized.toLowerCase())) return sanitized
  let n = 2 // @422640
  while (taken.has(`${sanitized}-${n}`.toLowerCase())) n++
  return `${sanitized}-${n}`
}

// 2.1.183: sanitizeAgentName = tso @cli_inner_pretty.js:362806
/** Replaces every `@` (the agent-id separator) with `-` so a name is safe in `name@team`. */
function sanitizeAgentName(name: string): string {
  return name.replaceAll('@', '-')
}

// Mapping: Xdo→reserveTeammateIdentity, ice→updateTeamFile, bQ→formatAgentId, nso→removeTeamMember,
//          bDp→dedupeTeammateName, tso→sanitizeAgentName, mDa→hasControlChars, LY→MAIN_RESERVED_NAME

// ---------------------------------------------------------------------------
// Path 1: in-process spawn (sqa)
// ---------------------------------------------------------------------------

// 2.1.183: spawnInProcessTeammatePath = sqa @cli_inner_pretty.js:422925
/**
 * Spawns a teammate that runs in the leader's own Node process (AsyncLocalStorage-isolated).
 *
 * Sequence:
 *   1. resolve the model (Ydo), require name+prompt, READ the implicit team name from app state
 *      (throwing the "session team not initialized" internal error if absent).
 *   2. reserve the identity in the team file (reserveTeammateIdentity), then in the body:
 *      a. mark the roster member's backend "in-process" (Jdo),
 *      b. find the matching active agent definition (if agent_type given),
 *      c. clear the inbox (lUt → clearInbox), low-level spawn (Tlt → spawnInProcessTeammate), kick the runner (qut → startInProcessTeammate),
 *      d. lazily register the leader (team-lead) as a roster member the FIRST time (when no
 *         leadAgentId is set yet), then register this teammate in app-state teamContext.teammates.
 */
async function spawnInProcessTeammatePath(
  request: TeammateSpawnRequest,
  ctx: ToolUseContext,
): Promise<TeammateSpawnResult> {
  const { setAppState, getAppState } = ctx
  const { name, prompt, agent_type, plan_mode_required } = request
  const model = resolveTeammateModel(request.model, getAppState().mainLoopModel) // Ydo @422928

  if (!name || !prompt) {
    // @422929
    logTelemetryError('subagent_launch', 'subagent_teammate_missing_params')
    throw new Error('name and prompt are required for spawn operation')
  }

  const teamName = getAppState().teamContext?.teamName // @422934
  if (!teamName) {
    // @422935
    logTelemetryError('subagent_launch', 'subagent_teammate_no_team_name')
    throw new Error(
      'Internal error: session team not initialized. This should have happened at startup when agent swarms are enabled.',
    )
  }

  return reserveTeammateIdentity(
    name,
    teamName,
    { agentType: agent_type, model, prompt, planModeRequired: plan_mode_required, cwd: getCwd() },
    ctx.teammateColors,
    async ({ sanitizedName, teammateId, teammateColor }, commit) => {
      // @422948
      await updateMemberBackend(teamName, teammateId, {
        tmuxPaneId: 'in-process',
        backendType: 'in-process',
      })

      // @422950  resolve the agent definition (only if it is a real teammate-spawnable def)
      let agentDefinition: unknown
      if (agent_type) {
        const def = ctx.options.agentDefinitions.activeAgents.find((a) => a.agentType === agent_type)
        if (def && isTeammateSpawnableAgent(def)) agentDefinition = def // _ye
        logForDebugging(`[handleSpawnInProcess] agent_type=${agent_type}, found=${!!agentDefinition}`)
      }

      const spawnConfig = {
        name: sanitizedName,
        teamName,
        prompt,
        color: teammateColor,
        planModeRequired: plan_mode_required ?? false,
        model,
      }
      await clearInbox(sanitizedName, teamName) // lUt @422956  (resets the inbox to [])
      const spawned = await spawnInProcessTeammate(spawnConfig, ctx) // Tlt @422957
      if (!spawned.ok) {
        // @422958
        logTelemetryError('subagent_launch', 'subagent_teammate_inprocess_failed')
        logForDebugging(`[handleSpawnInProcess] spawn failed: ${spawned.error}`)
        throw new Error('Failed to spawn in-process teammate')
      }

      commit() // @422964  the agent is now irreversibly live
      startInProcessTeammate({
        // qut @422965
        identity: spawned.identity,
        taskId: spawned.taskId,
        prompt,
        description: request.description,
        model,
        agentDefinition,
        teammateContext: spawned.teammateContext,
        toolUseContext: { ...ctx, messages: [] },
        abortController: spawned.abortController,
        invokingRequestId: request.invokingRequestId,
      })
      logForDebugging(`[handleSpawnInProcess] Started agent execution for ${teammateId}`)

      // @422978  Lazily register the LEADER (team-lead) as a roster member the first time we
      //          spawn anything — the leadAgentId may not have been seeded yet.
      const existingLeadId = getAppState().teamContext?.leadAgentId
      const isFirstSpawn = !existingLeadId
      const leadAgentId = existingLeadId ?? formatAgentId(TEAM_LEAD_NAME, teamName) // bQ(np, u)
      const leadColor = isFirstSpawn ? ctx.teammateColors.assign(leadAgentId) : undefined

      setAppState((state) => {
        const existingTeammates = state.teamContext?.teammates || {}
        const leaderEntry = isFirstSpawn
          ? {
              [leadAgentId]: {
                name: TEAM_LEAD_NAME,
                agentType: TEAM_LEAD_NAME,
                color: leadColor,
                tmuxSessionName: 'in-process',
                tmuxPaneId: 'leader',
                cwd: getCwd(),
                spawnedAt: Date.now(),
              },
            }
          : {}
        return {
          ...state,
          teamContext: {
            ...state.teamContext,
            teamName: teamName ?? state.teamContext?.teamName ?? 'default',
            teamFilePath: state.teamContext?.teamFilePath ?? '',
            leadAgentId,
            teammates: {
              ...existingTeammates,
              ...leaderEntry,
              [teammateId]: {
                name: sanitizedName,
                agentType: agent_type,
                color: teammateColor,
                tmuxSessionName: 'in-process',
                tmuxPaneId: 'in-process',
                cwd: getCwd(),
                spawnedAt: Date.now(),
              },
            },
          },
        }
      })

      return {
        data: {
          teammate_id: teammateId,
          agent_id: teammateId,
          agent_type,
          model,
          name: sanitizedName,
          color: teammateColor,
          tmux_session_name: 'in-process',
          tmux_window_name: 'in-process',
          tmux_pane_id: 'in-process',
          team_name: teamName,
          is_splitpane: false,
          plan_mode_required,
        },
      }
    },
  )
}

// Mapping: sqa→spawnInProcessTeammatePath, Ydo→resolveTeammateModel, Jdo→updateMemberBackend,
//          _ye→isTeammateSpawnableAgent, lUt→clearInbox, Tlt→spawnInProcessTeammate,
//          qut→startInProcessTeammate, bQ→formatAgentId, np→TEAM_LEAD_NAME, Pt→getCwd

// ---------------------------------------------------------------------------
// Path 2: split-pane spawn (SDp) — the swarm-view split
// ---------------------------------------------------------------------------

// 2.1.183: spawnPaneTeammate = SDp @cli_inner_pretty.js:422644
/**
 * Spawns a teammate as a brand-new `claude` process living in a tmux/iTerm2 pane
 * inside the leader's "swarm view" split.
 *
 * Sequence (inside the reserved-identity body):
 *   1. (re)detect the backend; if iTerm2 needs setup and a dialog hook exists, prompt the user.
 *   2. create the teammate pane in the swarm view (tqa → backend.createTeammatePaneInSwarmView),
 *      registering a pane-kill cleanup; enable the pane-border status on the first teammate.
 *   3. build the relaunch command `cd <cwd> && env <env> <claude> --agent-id … --team-name <team> …`.
 *   4. clear the inbox (lUt), write the seed mailbox message (the teammate's first task), inject the
 *      command via rqa (→ sendCommandToPane → respawn-pane), then commit.
 *   5. register the teammate in app-state teamContext.teammates and a pane-tracking task (lqa).
 */
async function spawnPaneTeammate(
  request: TeammateSpawnRequest,
  ctx: ToolUseContext,
): Promise<TeammateSpawnResult> {
  const { setAppState, getAppState } = ctx
  const { name, prompt, agent_type, cwd, plan_mode_required } = request
  const model = resolveTeammateModel(request.model, getAppState().mainLoopModel) // @422647

  if (!name || !prompt) {
    // @422648
    logTelemetryError('subagent_launch', 'subagent_teammate_missing_params')
    throw new Error('name and prompt are required for spawn operation')
  }

  const appState = getAppState()
  const teamName = appState.teamContext?.teamName // @422654
  if (!teamName) {
    // @422655
    logTelemetryError('subagent_launch', 'subagent_teammate_no_team_name')
    throw new Error(
      'Internal error: session team not initialized. This should have happened at startup when agent swarms are enabled.',
    )
  }
  const workingDir = cwd || getCwd() // @422662

  return reserveTeammateIdentity(
    name,
    teamName,
    { agentType: agent_type, model, prompt, planModeRequired: plan_mode_required, cwd: workingDir },
    ctx.teammateColors,
    async ({ sanitizedName, teammateId, teammateColor }, commit, registerCleanup) => {
      // @422669  re-probe the backend; handle the iTerm2-setup dialog branch.
      let backendInfo = await detectPaneBackend() // eLe
      if (backendInfo.needsIt2Setup && ctx.requestDialog) {
        const tmuxAvailable = await isTmuxBinaryAvailable() // Wke
        const choice = await ctx.requestDialog(IT2_SETUP_DIALOG, { tmuxAvailable }) // sBn
        if (choice === 'cancelled') {
          logTelemetryError('subagent_launch', 'subagent_teammate_iterm_cancelled')
          throw new SwarmPaneError('Teammate spawn cancelled - iTerm2 setup required')
        }
        if (choice === 'installed' || choice === 'use-tmux') {
          clearIt2SetupCache() // qdo
          backendInfo = await detectPaneBackend()
        }
      }

      const insideTmux = await isInsideTmux() // eqa @422680
      const { paneId, isFirstTeammate } = await createTeammatePaneInSwarmView(sanitizedName, teammateColor) // tqa @422681
      registerCleanup(() => backendInfo.backend.killPane(paneId, !insideTmux)) // @422682
      await updateMemberBackend(teamName, teammateId, {
        tmuxPaneId: paneId,
        backendType: backendInfo.backend.type,
      })
      if (isFirstTeammate && insideTmux) await enablePaneBorderStatus() // nqa @422683

      // @422684-422700  build the relaunch command.
      const execPath = resolveTeammateExecPath() // iqa
      const identityFlags = [
        `--agent-id ${quote([teammateId])}`,
        `--agent-name ${quote([sanitizedName])}`,
        `--team-name ${quote([teamName])}`,
        `--agent-color ${quote([teammateColor])}`,
        `--parent-session-id ${quote([getSessionId()])}`,
        plan_mode_required ? '--plan-mode-required' : '',
        agent_type ? `--agent-type ${quote([agent_type])}` : '',
      ]
        .filter(Boolean)
        .join(' ')
      let inheritedFlags = buildInheritedCliFlags({
        planModeRequired: plan_mode_required,
        permissionMode: appState.toolPermissionContext.mode,
        skipModel: !!model,
      })
      if (model)
        inheritedFlags = inheritedFlags
          ? `${inheritedFlags} --model ${quote([model])}`
          : `--model ${quote([model])}`
      const flagsSuffix = inheritedFlags ? ` ${inheritedFlags}` : ''
      const envStr = buildInheritedEnvVars() // Qjt
      const command = `cd ${quote([workingDir])} && env ${envStr} ${quote([execPath])} ${identityFlags}${flagsSuffix}` // @422700

      // @422701-422704  clear the inbox, seed the first task, then inject the command (respawn-pane path).
      await clearInbox(sanitizedName, teamName) // lUt @422701  (resets the inbox to [])
      await writeToMailbox(
        sanitizedName,
        { from: TEAM_LEAD_NAME, text: prompt, timestamp: new Date().toISOString() },
        teamName,
      ) // $A
      await sendCommandToPane(paneId, command, !insideTmux) // rqa → sendCommandToPane → a3n
      commit()

      // @422705  swarm session/window names (external swarm vs the user's current session).
      const tmuxSessionName = insideTmux ? 'current' : SWARM_SESSION_NAME
      const tmuxWindowName = insideTmux ? 'current' : 'swarm-view'

      setAppState((state) => ({
        ...state,
        teamContext: {
          ...state.teamContext,
          teamName: teamName ?? state.teamContext?.teamName ?? 'default',
          teamFilePath: state.teamContext?.teamFilePath ?? '',
          leadAgentId: state.teamContext?.leadAgentId ?? '',
          teammates: {
            ...(state.teamContext?.teammates || {}),
            [teammateId]: {
              name: sanitizedName,
              agentType: agent_type,
              color: teammateColor,
              tmuxSessionName,
              tmuxPaneId: paneId,
              cwd: workingDir,
              spawnedAt: Date.now(),
            },
          },
        },
      }))

      registerInProcessTask(ctx.taskRegistry, {
        // lqa @422729
        teammateId,
        sanitizedName,
        teamName,
        teammateColor,
        prompt,
        plan_mode_required,
        paneId,
        insideTmux,
        backendType: backendInfo.backend.type,
        toolUseId: ctx.toolUseId,
        cwd: workingDir,
      })

      return {
        data: {
          teammate_id: teammateId,
          agent_id: teammateId,
          agent_type,
          model,
          name: sanitizedName,
          color: teammateColor,
          tmux_session_name: tmuxSessionName,
          tmux_window_name: tmuxWindowName,
          tmux_pane_id: paneId,
          team_name: teamName,
          is_splitpane: true,
          plan_mode_required,
        },
      }
    },
  )
}

// Mapping: SDp→spawnPaneTeammate, eLe→detectPaneBackend, eqa→isInsideTmux, tqa→createTeammatePaneInSwarmView,
//          nqa→enablePaneBorderStatus, iqa→resolveTeammateExecPath, aqa→buildInheritedCliFlags,
//          Qjt→buildInheritedEnvVars, lUt→clearInbox, $A→writeToMailbox, rqa→sendCommandToPane (delegate),
//          lqa→registerInProcessTask, Ja→quote, xt→getSessionId, Wke→isTmuxBinaryAvailable, sBn→IT2_SETUP_DIALOG,
//          qdo→clearIt2SetupCache, N8→SWARM_SESSION_NAME, sF→SwarmPaneError

// ---------------------------------------------------------------------------
// Path 3: non-split-pane spawn (EDp) — a standalone tmux window in the swarm session
// ---------------------------------------------------------------------------

// 2.1.183: spawnNonSplitPaneTeammate = EDp @cli_inner_pretty.js:422762
/**
 * The `use_splitpane === false` path. Instead of splitting the leader's pane into a
 * swarm view, it creates a standalone tmux WINDOW in the external "claude-swarm" session
 * (ensuring that session exists first), running the `cat` holder. The command is then
 * injected directly via `a3n` (respawn-pane) — note it calls `assertNoControlChars` + `a3n`
 * inline rather than going through the `sendCommandToPane` delegate (rqa) that SDp uses.
 */
async function spawnNonSplitPaneTeammate(
  request: TeammateSpawnRequest,
  ctx: ToolUseContext,
): Promise<TeammateSpawnResult> {
  const { setAppState, getAppState } = ctx
  const { name, prompt, agent_type, cwd, plan_mode_required } = request
  const model = resolveTeammateModel(request.model, getAppState().mainLoopModel) // @422765

  if (!name || !prompt) {
    // @422766
    logTelemetryError('subagent_launch', 'subagent_teammate_missing_params')
    throw new Error('name and prompt are required for spawn operation')
  }

  const appState = getAppState()
  const teamName = appState.teamContext?.teamName // @422772
  if (!teamName) {
    // @422773  same byte-exact guard as SDp/sqa.
    logTelemetryError('subagent_launch', 'subagent_teammate_no_team_name')
    throw new Error(
      'Internal error: session team not initialized. This should have happened at startup when agent swarms are enabled.',
    )
  }
  const workingDir = cwd || getCwd() // @422780

  return reserveTeammateIdentity(
    name,
    teamName,
    { agentType: agent_type, model, prompt, planModeRequired: plan_mode_required, cwd: workingDir },
    ctx.teammateColors,
    async ({ sanitizedName, teammateId, teammateColor }, commit, registerCleanup) => {
      const windowName = `teammate-${slugifyForTmux(sanitizedName)}` // uBn @422787
      await ensureExternalSwarmSession(SWARM_SESSION_NAME) // _Dp @422788

      // @422789  create a standalone window running `cat`.
      const created = await runTmux(TMUX_BIN, [
        'new-window',
        '-t',
        SWARM_SESSION_NAME,
        '-n',
        windowName,
        '-P',
        '-F',
        '#{pane_id}',
        '--',
        TMUX_HOLDING_CMD,
      ])
      if (created.code !== 0) {
        // @422790
        logTelemetryError('subagent_launch', 'subagent_teammate_tmux_window_failed')
        throw new Error(`Failed to create tmux window: ${created.stderr}`)
      }
      const paneId = created.stdout.trim() // @422795
      registerCleanup(() => runTmux(TMUX_BIN, ['kill-pane', '-t', paneId])) // @422796
      await updateMemberBackend(teamName, teammateId, { tmuxPaneId: paneId, backendType: 'tmux' })

      // @422797-422813  build the relaunch command (same shape as SDp).
      const execPath = resolveTeammateExecPath()
      const identityFlags = [
        `--agent-id ${quote([teammateId])}`,
        `--agent-name ${quote([sanitizedName])}`,
        `--team-name ${quote([teamName])}`,
        `--agent-color ${quote([teammateColor])}`,
        `--parent-session-id ${quote([getSessionId()])}`,
        plan_mode_required ? '--plan-mode-required' : '',
        agent_type ? `--agent-type ${quote([agent_type])}` : '',
      ]
        .filter(Boolean)
        .join(' ')
      let inheritedFlags = buildInheritedCliFlags({
        planModeRequired: plan_mode_required,
        permissionMode: appState.toolPermissionContext.mode,
        skipModel: !!model,
      })
      if (model)
        inheritedFlags = inheritedFlags
          ? `${inheritedFlags} --model ${quote([model])}`
          : `--model ${quote([model])}`
      const flagsSuffix = inheritedFlags ? ` ${inheritedFlags}` : ''
      const envStr = buildInheritedEnvVars()
      const command = `cd ${quote([workingDir])} && env ${envStr} ${quote([execPath])} ${identityFlags}${flagsSuffix}`

      // @422814  clear the inbox, then seed the first task.
      await clearInbox(sanitizedName, teamName) // lUt  (resets the inbox to [])
      await writeToMailbox(
        sanitizedName,
        { from: TEAM_LEAD_NAME, text: prompt, timestamp: new Date().toISOString() },
        teamName,
      )

      // @422815-422824  control-char guard, then inject directly via respawn-pane (NOT the rqa delegate).
      try {
        assertNoControlChars(command) // Slt @422816
      } catch (err) {
        logTelemetryError('subagent_launch', 'subagent_teammate_control_chars')
        throw err
      }
      try {
        await sendCommandViaRespawn([], paneId, command) // a3n([], b, k) @422821  — no socket args (default server)
      } catch (err) {
        logTelemetryError('subagent_launch', 'subagent_teammate_tmux_respawn_failed')
        throw err
      }

      commit() // @422826

      setAppState((state) => ({
        ...state,
        teamContext: {
          ...state.teamContext,
          teamName: teamName ?? state.teamContext?.teamName ?? 'default',
          teamFilePath: state.teamContext?.teamFilePath ?? '',
          leadAgentId: state.teamContext?.leadAgentId ?? '',
          teammates: {
            ...(state.teamContext?.teammates || {}),
            [teammateId]: {
              name: sanitizedName,
              agentType: agent_type,
              color: teammateColor,
              tmuxSessionName: SWARM_SESSION_NAME,
              tmuxPaneId: paneId,
              cwd: workingDir,
              spawnedAt: Date.now(),
            },
          },
        },
      }))

      registerInProcessTask(ctx.taskRegistry, {
        teammateId,
        sanitizedName,
        teamName,
        teammateColor,
        prompt,
        plan_mode_required,
        paneId,
        insideTmux: false,
        backendType: 'tmux',
        toolUseId: ctx.toolUseId,
        cwd: workingDir,
      })

      return {
        data: {
          teammate_id: teammateId,
          agent_id: teammateId,
          agent_type,
          model,
          name: sanitizedName,
          color: teammateColor,
          tmux_session_name: SWARM_SESSION_NAME,
          tmux_window_name: windowName,
          tmux_pane_id: paneId,
          team_name: teamName,
          is_splitpane: false,
          plan_mode_required,
        },
      }
    },
  )
}

// Mapping: EDp→spawnNonSplitPaneTeammate, uBn→slugifyForTmux, _Dp→ensureExternalSwarmSession,
//          Fn→runTmux, B8→TMUX_BIN, Gke→TMUX_HOLDING_CMD, N8→SWARM_SESSION_NAME, Slt→assertNoControlChars,
//          a3n→sendCommandViaRespawn, $A→writeToMailbox, lUt→clearInbox, lqa→registerInProcessTask

// ---------------------------------------------------------------------------
// In-process task registration for pane teammates (lqa)
// ---------------------------------------------------------------------------

type TaskRegistry = {
  register(task: unknown): void
}

type PaneTaskInfo = {
  teammateId: string
  sanitizedName: string
  teamName: string
  teammateColor: string
  prompt: string
  plan_mode_required?: boolean
  paneId: string
  insideTmux: boolean
  backendType: string
  toolUseId?: string
  cwd: string
}

// 2.1.183: registerInProcessTask = lqa @cli_inner_pretty.js:422881
/**
 * Registers an `in_process_teammate` task entry that tracks a PANE teammate from the
 * leader's side (status/spinner UI + a pane-kill on abort). Unlike a true in-process
 * teammate, this task has no agent loop of its own — it mirrors the remote pane process.
 * The abort listener kills the pane when the backend is a pane backend (tmux/iterm2).
 */
function registerInProcessTask(taskRegistry: TaskRegistry, info: PaneTaskInfo): void {
  const taskId = generateTaskId('in_process_teammate') // lj @422897
  const description = `${info.prompt.substring(0, 50)}${info.prompt.length > 50 ? '...' : ''}` // @422898
  const abortController = new AbortController() // @422899
  const task = {
    ...createTaskStateBase(taskId, 'in_process_teammate', description, info.toolUseId), // c0 @422901
    type: 'in_process_teammate',
    status: 'running',
    cwd: info.cwd,
    identity: {
      agentId: info.teammateId,
      agentName: info.sanitizedName,
      teamName: info.teamName,
      color: info.teammateColor,
      planModeRequired: info.plan_mode_required ?? false,
      parentSessionId: getSessionId(),
    },
    prompt: info.prompt,
    abortController,
    awaitingPlanApproval: false,
    permissionMode: info.plan_mode_required ? 'plan' : 'default',
    isIdle: false,
    shutdownRequested: false,
    lastReportedToolCount: 0,
    lastReportedTokenCount: 0,
    pendingUserMessages: [],
  }
  taskRegistry.register(task) // @422916
  abortController.signal.addEventListener(
    'abort',
    () => {
      // @422920  on abort, kill the pane via the matching backend (only for pane backends).
      if (isPaneBackendType(info.backendType))
        getBackendByType(info.backendType).killPane(info.paneId, !info.insideTmux)
    },
    { once: true },
  )
}

// Mapping: lqa→registerInProcessTask, lj→generateTaskId, c0→createTaskStateBase, xt→getSessionId,
//          XFt→isPaneBackendType, e3t→getBackendByType

// ---------------------------------------------------------------------------
// Spawn-side helpers
// ---------------------------------------------------------------------------

// 2.1.183: resolveTeammateModel = Ydo @cli_inner_pretty.js:422517
/**
 * Resolves the model for a spawned teammate, in priority order:
 *   1. The CLAUDE_CODE_SUBAGENT_MODEL env override (unless it is literally "inherit");
 *      a non-allowlisted value warns (Kdo) and falls back to the default teammate model.
 *   2. The request's `model === "inherit"` ⇒ the leader's mainLoopModel.
 *   3. A request `model` not in the allowlist warns and falls back to the default.
 *   4. Otherwise the request `model`, or the default teammate model.
 */
function resolveTeammateModel(requestedModel: string | undefined, mainLoopModel: string): string {
  const envModel = process.env.CLAUDE_CODE_SUBAGENT_MODEL // @422518
  if (envModel && envModel !== 'inherit') {
    const resolved = resolveModelName(envModel) // _s
    if (isAllowedModel(resolved)) return resolved // ul
    warnModelNotAllowed(envModel) // Kdo
    return defaultTeammateModel(mainLoopModel) // d3n
  }
  if (requestedModel === 'inherit') return mainLoopModel ?? defaultTeammateModel(mainLoopModel) // @422524
  if (requestedModel !== undefined && !isAllowedModel(requestedModel)) {
    warnModelNotAllowed(requestedModel)
    return defaultTeammateModel(mainLoopModel)
  }
  return requestedModel ?? defaultTeammateModel(mainLoopModel) // @422526
}

// 2.1.183: updateMemberBackend = Jdo @cli_inner_pretty.js:422625
/** Updates a roster member's `tmuxPaneId` + `backendType` in the team file (no-op if absent). */
async function updateMemberBackend(
  teamName: string,
  agentId: string,
  backend: { tmuxPaneId: string; backendType: string },
): Promise<void> {
  await updateTeamFile(teamName, (teamFile) => {
    const member = teamFile.members.find((m) => m.agentId === agentId)
    if (!member) return false // @422628
    member.tmuxPaneId = backend.tmuxPaneId
    member.backendType = backend.backendType
  })
}

// 2.1.183: resolveTeammateExecPath = iqa @cli_inner_pretty.js:422546
/** The command used to (re)launch a teammate: the env override, else the current binary. */
function resolveTeammateExecPath(): string {
  if (process.env[TEAMMATE_COMMAND_ENV]) return process.env[TEAMMATE_COMMAND_ENV]! // @422547
  return isInBundledMode() ? process.execPath : process.argv[1]! // @422548
}

// 2.1.183: buildInheritedCliFlags = aqa @cli_inner_pretty.js:422550
/**
 * Builds the CLI flags a teammate sub-process should inherit from the leader: permission
 * mode (suppressed when plan mode is required), model (unless skipModel), settings path,
 * plugin dirs, and the chrome flag. Mirrors the v2.1.88 spawnUtils.buildInheritedCliFlags
 * shape.
 *
 * Delta vs v2.1.156 (verified against the 156 ancestor rA4 @cli_inner_pretty.js:397673):
 *   - NEW in 183: the `--plugin-dir-no-mcp` loop (`for (let l of x6()) … "--plugin-dir-no-mcp"`,
 *     x6 = getInlinePluginsNoMcp). grep: 156 has 0 occurrences of `--plugin-dir-no-mcp`, 183 has 10.
 *   - CARRYOVER from 156 (NOT a 183 addition): the `auto` permission mode
 *     (`else if (K === "auto") $.push("--permission-mode auto")`, rA4 @397673) and the
 *     `--plugin-url` loop (`for (let f of Wt()) $.push("--plugin-url …")`, rA4 @397682).
 */
function buildInheritedCliFlags(options: {
  planModeRequired?: boolean
  permissionMode?: string
  skipModel?: boolean
}): string {
  const flags: string[] = []
  const { planModeRequired, permissionMode, skipModel } = options || {}

  // @422553  plan mode suppresses inherited permission-mode flags.
  if (planModeRequired) {
    // intentionally inherit nothing
  } else if (permissionMode === 'bypassPermissions') flags.push('--dangerously-skip-permissions')
  else if (permissionMode === 'acceptEdits') flags.push('--permission-mode acceptEdits')
  else if (permissionMode === 'auto') flags.push('--permission-mode auto')

  if (!skipModel) {
    const modelOverride = getMainLoopModelOverride() // E_
    if (modelOverride) flags.push(`--model ${quote([modelOverride])}`)
  }
  const settingsPath = getFlagSettingsPath() ?? getSettingsPath() // eRe ?? ZMe
  if (settingsPath) flags.push(`--settings ${quote([settingsPath])}`)
  for (const dir of getInlinePlugins()) flags.push(`--plugin-dir ${quote([dir])}`) // I6
  for (const dir of getInlinePluginsNoMcp()) flags.push(`--plugin-dir-no-mcp ${quote([dir])}`) // x6
  for (const url of getInlinePluginUrls()) flags.push(`--plugin-url ${quote([url])}`) // Ire
  const chromeFlag = getChromeFlagOverride() // $de
  if (chromeFlag === true) flags.push('--chrome')
  else if (chromeFlag === false) flags.push('--no-chrome')

  return flags.join(' ')
}

// 2.1.183: buildInheritedEnvVars = Qjt @cli_inner_pretty.js:421655
/**
 * Builds the `env KEY=VALUE …` prefix forwarded to a tmux teammate (tmux may start a new
 * login shell that does not inherit the parent env). Always sets CLAUDECODE=1 and
 * CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1, then forwards each set var from TEAMMATE_ENV_VARS,
 * plus CLAUDE_SECURESTORAGE_CONFIG_DIR.
 */
function buildInheritedEnvVars(): string {
  const envVars = ['CLAUDECODE=1', 'CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1'] // @421656
  for (const key of TEAMMATE_ENV_VARS) {
    const value = process.env[key]
    if (value !== undefined && value !== '') envVars.push(`${key}=${quote([value])}`) // @421659
  }
  const secureStorageDir = process.env.CLAUDE_SECURESTORAGE_CONFIG_DIR
  if (secureStorageDir !== undefined)
    envVars.push(`CLAUDE_SECURESTORAGE_CONFIG_DIR=${quote([secureStorageDir])}`) // @421661
  return envVars.join(' ')
}

// 2.1.183: TEAMMATE_ENV_VARS = aDp @cli_inner_pretty.js:421665-421710 (verbatim, in order)
/**
 * Env vars forwarded to tmux-spawned teammates. Verbatim from the bundle (aDp): provider
 * selection (Bedrock/Vertex/Foundry/Anthropic-AWS/Mantle + their AWS/region/credential vars),
 * the subagent model override, the API base URL, the config dir, the CCR/remote markers, the
 * proxy + CA-bundle vars, and the telemetry-disable vars.
 */
const TEAMMATE_ENV_VARS = [
  'CLAUDE_CODE_USE_BEDROCK',
  'CLAUDE_CODE_USE_VERTEX',
  'CLAUDE_CODE_USE_FOUNDRY',
  'CLAUDE_CODE_USE_ANTHROPIC_AWS',
  'CLAUDE_CODE_USE_MANTLE',
  'ANTHROPIC_AWS_WORKSPACE_ID',
  'ANTHROPIC_AWS_BASE_URL',
  'ANTHROPIC_AWS_API_KEY',
  'CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH',
  'AWS_BEARER_TOKEN_BEDROCK',
  'ANTHROPIC_BEDROCK_MANTLE_BASE_URL',
  'CLAUDE_CODE_SKIP_MANTLE_AUTH',
  'AWS_REGION',
  'AWS_DEFAULT_REGION',
  'AWS_PROFILE',
  'AWS_CONFIG_FILE',
  'AWS_SHARED_CREDENTIALS_FILE',
  'ANTHROPIC_BEDROCK_SERVICE_TIER',
  'CLAUDE_CODE_SUBAGENT_MODEL',
  'ANTHROPIC_BASE_URL',
  'CLAUDE_CONFIG_DIR',
  'CLAUDE_CODE_REMOTE',
  'CLAUDE_CODE_REMOTE_MEMORY_DIR',
  'HTTPS_PROXY',
  'https_proxy',
  'HTTP_PROXY',
  'http_proxy',
  'NO_PROXY',
  'no_proxy',
  'SSL_CERT_FILE',
  'NODE_EXTRA_CA_CERTS',
  'REQUESTS_CA_BUNDLE',
  'CURL_CA_BUNDLE',
  'CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC',
  'CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST',
  'DISABLE_ERROR_REPORTING',
  'DISABLE_GROWTHBOOK',
  'DISABLE_TELEMETRY',
  'DO_NOT_TRACK',
] as const

// ---------------------------------------------------------------------------
// Pane-backend delegates (eqa / tqa / nqa / rqa / Vdo) + external-session helpers (_Dp / yDp)
// ---------------------------------------------------------------------------

// 2.1.183: getCurrentBackend = Vdo @cli_inner_pretty.js:422480
/** Returns the active pane backend (the result of the most recent detection). */
async function getCurrentBackend(): Promise<PaneBackend> {
  return (await detectPaneBackend()).backend // @422481
}

// 2.1.183: createTeammatePaneInSwarmView = tqa @cli_inner_pretty.js:422487 (delegate onto Vdo)
async function createTeammatePaneInSwarmView(
  name: string,
  color: string,
): Promise<{ paneId: string; isFirstTeammate: boolean }> {
  return (await getCurrentBackend()).createTeammatePaneInSwarmView(name, color)
}

// 2.1.183: enablePaneBorderStatus = nqa @cli_inner_pretty.js:422490 (delegate onto Vdo)
async function enablePaneBorderStatus(paneId?: string, useExternalSession = false): Promise<void> {
  return (await getCurrentBackend()).enablePaneBorderStatus(paneId, useExternalSession)
}

// 2.1.183: sendCommandToPane = rqa @cli_inner_pretty.js:422493 (delegate onto Vdo)
/** Injects a command into a pane via the active backend (tmux → respawn-pane; iTerm2 → it2 run). */
async function sendCommandToPane(
  paneId: string,
  command: string,
  useExternalSession = false,
): Promise<void> {
  return (await getCurrentBackend()).sendCommandToPane(paneId, command, useExternalSession)
}

// 2.1.183: ensureExternalSwarmSession = _Dp @cli_inner_pretty.js:422536
/** Creates the detached external "claude-swarm" tmux session if it does not already exist. */
async function ensureExternalSwarmSession(sessionName: string): Promise<void> {
  if (!(await hasTmuxSession(sessionName))) {
    // @422537
    const created = await runTmux(TMUX_BIN, ['new-session', '-d', '-s', sessionName])
    if (created.code !== 0) {
      logTelemetryError('subagent_launch', 'subagent_teammate_tmux_session_failed')
      throw new Error(
        `Failed to create tmux session '${sessionName}': ${created.stderr || 'Unknown error'}`,
      )
    }
  }
}

// 2.1.183: hasTmuxSession = yDp @cli_inner_pretty.js:422533
/** True if a tmux session with the given name exists (`tmux has-session -t <name>`). */
async function hasTmuxSession(sessionName: string): Promise<boolean> {
  return (await runTmux(TMUX_BIN, ['has-session', '-t', sessionName])).code === 0 // @422534
}

// 2.1.183: slugifyForTmux = uBn @cli_inner_pretty.js:362803
/** Lower-cases and replaces every non-alphanumeric char with `-` (for tmux window names). */
function slugifyForTmux(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() // @362804
}

// Mapping: Vdo→getCurrentBackend, tqa→createTeammatePaneInSwarmView, nqa→enablePaneBorderStatus,
//          rqa→sendCommandToPane, _Dp→ensureExternalSwarmSession, yDp→hasTmuxSession, uBn→slugifyForTmux,
//          Fn→runTmux, B8→TMUX_BIN

// ---------------------------------------------------------------------------
// External symbols referenced above (declared in sibling reconstructed modules / the
// real source tree). Listed here so the spawn-path logic above is self-documenting;
// each carries its v2.1.183 anchor. They are imported, not redefined.
// ---------------------------------------------------------------------------

// 2.1.183: getCurrentBackend's PaneBackend interface — utils/swarm/backends/types.ts (88 ancestor)
type PaneBackend = {
  type: string
  createTeammatePaneInSwarmView(
    name: string,
    color: string,
  ): Promise<{ paneId: string; isFirstTeammate: boolean }>
  enablePaneBorderStatus(paneId?: string, useExternalSession?: boolean): Promise<void>
  sendCommandToPane(paneId: string, command: string, useExternalSession?: boolean): Promise<void>
  killPane(paneId: string, useExternalSession?: boolean): Promise<boolean>
  isAvailable(): Promise<boolean>
}

// The following are declared in sibling modules; signatures shown for clarity.
// 2.1.183: isTeammateSpawnableAgent = _ye @cli_inner_pretty.js:472402
declare function isTeammateSpawnableAgent(def: unknown): boolean
// 2.1.183: generateTaskId = lj @cli_inner_pretty.js:575439 ; createTaskStateBase = c0
declare function generateTaskId(taskType: string): string
declare function createTaskStateBase(
  taskId: string,
  taskType: string,
  description: string,
  toolUseId?: string,
): object
// 2.1.183: isPaneBackendType = XFt @cli_inner_pretty.js:362764 ("tmux" || "iterm2")
declare function isPaneBackendType(type: string): boolean
// 2.1.183: getBackendByType = e3t (returns the registered backend for a type)
declare function getBackendByType(type: string): PaneBackend
// model helpers: _s = resolveModelName, ul = isAllowedModel, Kdo = warnModelNotAllowed, d3n = defaultTeammateModel
declare function resolveModelName(name: string): string
declare function isAllowedModel(name: string): boolean
declare function warnModelNotAllowed(name: string): void
declare function defaultTeammateModel(mainLoopModel: string): string
// iTerm2-setup dialog plumbing (SDp branch): Wke = isTmuxBinaryAvailable, sBn = IT2_SETUP_DIALOG, qdo = clearIt2SetupCache
declare function isTmuxBinaryAvailable(): Promise<boolean>
declare const IT2_SETUP_DIALOG: unknown
declare function clearIt2SetupCache(): void
// bootstrap/CLI flag accessors used by buildInheritedCliFlags
// E_ = getMainLoopModelOverride (re-exported as getMainLoopModelOverride), eRe = getFlagSettingsPath,
// ZMe = getSettingsPath, I6 = getInlinePlugins, x6 = getInlinePluginsNoMcp, Ire = getInlinePluginUrls, $de = getChromeFlagOverride
declare function getFlagSettingsPath(): string | undefined
declare function getSettingsPath(): string | undefined
declare function getInlinePlugins(): string[]
declare function getInlinePluginsNoMcp(): string[]
declare function getInlinePluginUrls(): string[]
declare function getChromeFlagOverride(): boolean | undefined
