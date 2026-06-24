/**
 * The iTerm2 pane backend for the Agent Team / "swarm" subsystem (v2.1.183).
 *
 * iTerm2 native split panes are driven through the `it2` CLI (iTerm2's Python-API command
 * tool). IMPORTANT for the v2.1.178 tmux fix context: this backend NEVER typed the relaunch
 * command via send-keys — it has always injected the command with `it2 session run <cmd>`,
 * which runs the command in the target session directly (no keystroke typing). So the
 * send-keys → respawn-pane fix was tmux-only; the iTerm2 path stays on `it2 session run`. The
 * v2.1.183 deltas vs the v2.1.88 ancestor are two: (1) the shared `assertNoControlChars` (Slt)
 * guard at the top of sendCommandToPane, applied uniformly across the pane-spawn surface, and
 * (2) a `it2 session send <^U>` clear-line step before `session run` (88's sendCommandToPane
 * went straight to `session run` with no Ctrl-U — 88 ITermBackend.ts:253-255) — see
 * sendCommandToPane below.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - pane-creation mutex:        cDp @422137-422144 (serializes concurrent iterm splits)
 *   - runIt2:                     Zjt @422145-422147 (Fn(cBn, …); cBn = "it2")
 *   - parseSplitOutput:           uDp @422148-422152 (/Created new pane:\s*(.+)/)
 *   - getLeaderSessionId:         dDp @422153-422159 (UUID after ":" in $ITERM_SESSION_ID)
 *   - ITermBackend class:         Udo @422160-422259
 *       createTeammatePaneInSwarmView @422175-422216 (it2 session split, dead-session prune+retry)
 *       sendCommandToPane             @422217-422227 (Slt guard → it2 session send ^U → it2 session run)
 *       killPane                      @422234-422240 (it2 session close -f -s)
 *   - module state:               teammateSessionIds yye, firstPaneUsed l3n, lock K5a
 *                                 (declared @422248-422250; initialized in X5a @422258)
 *   - control-char guard:         Slt @362755 (imported via ./TmuxBackend.js)
 *   - availability probes:        oce/YFt imported from ./detection.js (isInITerm2/isIt2CliAvailable)
 * 2.1.88 ancestor: utils/swarm/backends/ITermBackend.ts (file layout, runIt2, parseSplitOutput,
 *   getLeaderSessionId, teammateSessionIds/firstPaneUsed state, acquirePaneCreationLock). The
 *   88 ancestor likewise uses `it2 session run` (no send-keys), so the split/run shape is
 *   carryover; the 183 deltas are (1) the Slt control-char guard at the top of sendCommandToPane
 *   and (2) the `session send <^U>` clear-line step before `session run` (88 had neither).
 * scaffold: 30_agent_team/spawn_backends_and_tmux_fix.md (§Scope note: iTerm2 uses it2 run, not
 *   send-keys; §3.3 note that the Slt guard is uniform across the pane-spawn surface).
 * cross-val (re-read in the 183 bundle): Udo.sendCommandToPane @422217 sends `\x15` (Ctrl-U,
 *   clear the line) then `it2 session run <cmd>` — confirms it does NOT type the command
 *   keystroke-by-keystroke and there is no send-keys path; createTeammatePaneInSwarmView prunes
 *   a dead target session and retries; supportsHideShow = false. CONFIRMED.
 */

import type { AgentColorName, CreatePaneResult, PaneBackend, PaneId } from './types.js'
import { IT2_COMMAND, isInITerm2, isIt2CliAvailable } from './detection.js'
import { SwarmPaneError, assertNoControlChars } from './TmuxBackend.js'
import { registerITermBackend } from './registry.js'
import { logForDebugging } from '../../debug.js'
import { logTelemetryError } from '../../telemetry.js'
import { execFileNoThrow } from '../../execFileNoThrow.js'

// ---------------------------------------------------------------------------
// Module state + helpers
// ---------------------------------------------------------------------------

// 2.1.183: teammateSessionIds = yye @cli_inner_pretty.js:422248 (declared); initialized `yye = []` @422258
/** it2 session UUIDs of live teammate panes, in creation order (used to pick a split target). */
const teammateSessionIds: string[] = []

// 2.1.183: firstPaneUsed = l3n @cli_inner_pretty.js:422249 (initialized !1)
/** Whether the first teammate pane has been created yet (decides "split from leader"). */
let firstPaneUsed = false

// 2.1.183: paneCreationLock = cDp + module promise K5a @cli_inner_pretty.js:422137
/** Serialize concurrent iTerm2 splits. Returns a release fn to call when done. */
let paneCreationLock: Promise<void> = Promise.resolve()
function acquirePaneCreationLock(): Promise<() => void> {
  let release!: () => void
  const next = new Promise<void>(resolve => {
    release = resolve
  })
  const previous = paneCreationLock
  paneCreationLock = next
  return previous.then(() => release)
}

// 2.1.183: runIt2 = Zjt @cli_inner_pretty.js:422145 (Fn(cBn, …))
/** Runs `it2 <args>` without throwing on non-zero exit; returns {stdout,stderr,code}. */
function runIt2(args: string[]): Promise<{ stdout: string; stderr: string; code: number }> {
  return execFileNoThrow(IT2_COMMAND, args)
}

// 2.1.183: parseSplitOutput = uDp @cli_inner_pretty.js:422148
/** Parse the new session UUID from `it2 session split` output ("Created new pane: <uuid>"). */
function parseSplitOutput(output: string): string {
  const match = output.match(/Created new pane:\s*(.+)/)
  if (match && match[1]) return match[1].trim()
  return ''
}

// 2.1.183: getLeaderSessionId = dDp @cli_inner_pretty.js:422153
/** Extract the leader's iTerm2 session UUID from $ITERM_SESSION_ID ("wXtY:UUID" → UUID). */
function getLeaderSessionId(): string | null {
  const raw = process.env.ITERM_SESSION_ID
  if (!raw) return null
  const colon = raw.indexOf(':')
  if (colon === -1) return null
  return raw.slice(colon + 1)
}

// ---------------------------------------------------------------------------
// The iTerm2 backend
// ---------------------------------------------------------------------------

// 2.1.183: ITermBackend = Udo @cli_inner_pretty.js:422160 (v2.1.156: TU6)
export class ITermBackend implements PaneBackend {
  readonly type = 'iterm2' as const // @422161
  readonly displayName = 'iTerm2' // @422162
  readonly supportsHideShow = false // @422163 — iTerm2 has no hide/show equivalent

  // @422164
  async isAvailable(): Promise<boolean> {
    const inITerm2 = isInITerm2() // oce
    logForDebugging(`[ITermBackend] isAvailable check: inITerm2=${inITerm2}`)
    if (!inITerm2) {
      logForDebugging('[ITermBackend] isAvailable: false (not in iTerm2)')
      return false
    }
    const cliAvailable = await isIt2CliAvailable() // YFt — `it2 session list` exit 0
    logForDebugging(`[ITermBackend] isAvailable: ${cliAvailable} (it2 CLI ${cliAvailable ? 'found' : 'not found'})`)
    return cliAvailable
  }

  // @422171
  async isRunningInside(): Promise<boolean> {
    const inITerm2 = isInITerm2() // oce
    logForDebugging(`[ITermBackend] isRunningInside: ${inITerm2}`)
    return inITerm2
  }

  // 2.1.183: createTeammatePaneInSwarmView @cli_inner_pretty.js:422175
  /**
   * Create an iTerm2 split pane for a teammate. First teammate: split vertically from the
   * leader session (or the active session if the leader UUID is unknown). Subsequent: split
   * from the most recently created teammate session. If a split fails because the target
   * teammate session has died, prune it from the tracking list and retry; if no teammate
   * sessions remain, reset firstPaneUsed and fall back to splitting from the leader.
   */
  async createTeammatePaneInSwarmView(name: string, color: AgentColorName): Promise<CreatePaneResult> {
    logForDebugging(`[ITermBackend] createTeammatePaneInSwarmView called for ${name} with color ${color}`)
    const release = await acquirePaneCreationLock()
    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const isFirstTeammate = !firstPaneUsed // @422180
        logForDebugging(
          `[ITermBackend] Creating pane: isFirstTeammate=${isFirstTeammate}, existingPanes=${teammateSessionIds.length}`,
        )
        let splitArgs: string[]
        let targetTeammateSession: string | undefined
        if (isFirstTeammate) {
          const leaderSession = getLeaderSessionId() // dDp
          if (leaderSession) {
            splitArgs = ['session', 'split', '-v', '-s', leaderSession]
            logForDebugging(`[ITermBackend] First split from leader session: ${leaderSession}`)
          } else {
            splitArgs = ['session', 'split', '-v']
            logForDebugging('[ITermBackend] First split from active session (no leader ID)')
          }
        } else if ((targetTeammateSession = teammateSessionIds.at(-1))) {
          splitArgs = ['session', 'split', '-s', targetTeammateSession]
          logForDebugging(`[ITermBackend] Subsequent split from teammate session: ${targetTeammateSession}`)
        } else {
          splitArgs = ['session', 'split']
          logForDebugging('[ITermBackend] Subsequent split from active session (no teammate ID)')
        }

        const result = await runIt2(splitArgs)
        if (result.code !== 0) {
          // @422191-422201  if we targeted a now-dead session, prune it and retry from the leader
          if (targetTeammateSession) {
            const sessionList = await runIt2(['session', 'list'])
            if (sessionList.code === 0 && !sessionList.stdout.includes(targetTeammateSession)) {
              logForDebugging(
                `[ITermBackend] Split failed targeting dead session ${targetTeammateSession}, pruning and retrying: ${result.stderr}`,
              )
              const idx = teammateSessionIds.indexOf(targetTeammateSession)
              if (idx !== -1) teammateSessionIds.splice(idx, 1)
              if (teammateSessionIds.length === 0) firstPaneUsed = false
              continue
            }
          }
          throw new SwarmPaneError(`Failed to create iTerm2 split pane: ${result.stderr}`)
        }

        if (isFirstTeammate) firstPaneUsed = true
        const paneId = parseSplitOutput(result.stdout)
        if (!paneId) throw new Error(`Failed to parse session ID from split output: ${result.stdout}`)
        logForDebugging(`[ITermBackend] Created teammate pane for ${name}: ${paneId}`)
        teammateSessionIds.push(paneId)
        return { paneId, isFirstTeammate }
      }
    } finally {
      release()
    }
  }

  // 2.1.183: sendCommandToPane @cli_inner_pretty.js:422217  (Slt guard → ^U → it2 session run)
  /**
   * Inject the relaunch command into an iTerm2 pane. Unlike tmux there is no respawn-pane
   * equivalent and no send-keys typing of the command: it sends a single Ctrl-U (^U / \x15)
   * to clear any partial input on the line, then runs the command directly via
   * `it2 session run <cmd>`. Two things are new vs the v2.1.88 ancestor: the Slt control-char
   * guard (kept uniform across the whole pane-spawn surface) and the Ctrl-U clear-line send
   * before `session run` (88 went straight to `session run`).
   */
  async sendCommandToPane(paneId: PaneId, command: string, _useExternalSession?: boolean): Promise<void> {
    try {
      assertNoControlChars(command) // Slt — @422219
    } catch (err) {
      logTelemetryError('swarm_pane_spawn', 'swarm_pane_command_control_chars') // @422221
      throw err
    }
    const sessionArgs = paneId ? ['-s', paneId] : [] // @422223
    // @422224  Ctrl-U (\x15) clears any pending input on the target session's line first.
    await runIt2(['session', 'send', ...sessionArgs, '\x15'])
    // @422225  run the command directly in the session (NOT typed keystroke-by-keystroke).
    const result = await runIt2(['session', 'run', ...sessionArgs, command])
    if (result.code !== 0) {
      throw new SwarmPaneError(`Failed to send command to iTerm2 pane ${paneId}: ${result.stderr}`)
    }
  }

  // @422228-422230  styling/border-status are no-ops on iTerm2 (handled by iTerm2 itself)
  async setPaneBorderColor(_paneId: PaneId, _color: AgentColorName, _useExternalSession?: boolean): Promise<void> {}
  async setPaneTitle(_paneId: PaneId, _name: string, _color: AgentColorName, _useExternalSession?: boolean): Promise<void> {}
  async enablePaneBorderStatus(_windowTarget?: string, _useExternalSession?: boolean): Promise<void> {}

  // @422231
  async rebalancePanes(_windowTarget: string, _hasLeader: boolean): Promise<void> {
    logForDebugging('[ITermBackend] Pane rebalancing not implemented for iTerm2')
  }

  // 2.1.183: killPane @cli_inner_pretty.js:422234
  async killPane(paneId: PaneId, _useExternalSession?: boolean): Promise<boolean> {
    const result = await runIt2(['session', 'close', '-f', '-s', paneId])
    const idx = teammateSessionIds.indexOf(paneId)
    if (idx !== -1) teammateSessionIds.splice(idx, 1)
    if (teammateSessionIds.length === 0) firstPaneUsed = false
    return result.code === 0
  }

  // @422246  iTerm2 cannot hide/show panes
  async hidePane(_paneId: PaneId, _useExternalSession?: boolean): Promise<boolean> {
    logForDebugging('[ITermBackend] hidePane not supported in iTerm2')
    return false
  }
  async showPane(_paneId: PaneId, _targetWindowOrPane: string, _useExternalSession?: boolean): Promise<boolean> {
    logForDebugging('[ITermBackend] showPane not supported in iTerm2')
    return false
  }
}

// 2.1.183: registration = jdo(Udo) @cli_inner_pretty.js:422259 (X5a module init @422251)
registerITermBackend(ITermBackend)

// Mapping (this file):
//   Udo→ITermBackend, Zjt→runIt2, cBn/IT2_COMMAND→"it2", uDp→parseSplitOutput,
//   dDp→getLeaderSessionId, cDp→acquirePaneCreationLock, yye→teammateSessionIds, l3n→firstPaneUsed,
//   oce→isInITerm2, YFt→isIt2CliAvailable, Slt→assertNoControlChars, sF→SwarmPaneError,
//   v→logForDebugging, Me→logTelemetryError, jdo→registerITermBackend
