/**
 * The tmux pane backend for the Agent Team / "swarm" subsystem (v2.1.183).
 *
 * THE v2.1.178 FIX lives here: teammate panes are created running a benign holding
 * process (`cat`) and the real relaunch command is injected by REPLACING that process
 * via `tmux respawn-pane -k -t <pane> -- <cmd>` (sendCommandViaRespawn / a3n). v2.1.156
 * instead created a pane running the user's interactive login shell and TYPED the command
 * into it with `tmux send-keys -t <pane> "<cmd>" Enter` (verified v2.1.156
 * cli_inner_pretty.js:380567 — `send-keys -t <pane> <cmd> Enter`, no explicit sleep in
 * v2.1.156; the older v2.1.88 ancestor additionally awaited a 200 ms `waitForPaneShellReady()`
 * before send-keys — 88 TmuxBackend.ts:33/35/627/699 — but that delay was already gone by
 * v2.1.156). The respawn rewrite structurally eliminates two bugs the typed-into-a-shell path
 * had — the slow-rc-init race and the keystroke-leak — see sendCommandViaRespawn below.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - SwarmPaneError class:            sF @362769-362774 (in the JFt module init)
 *   - control-char regex:              fDa = /\p{Cc}/u @362775
 *   - hasControlChars:                 mDa @362752-362754
 *   - assertNoControlChars:            Slt @362755-362763
 *   - runTmux:                         Fn(B8, …) @50307 wrapped over the tmux binary
 *   - tmux socket routers:             kj (user -S socket) @421866, yF (-L swarm label) @421871
 *   - sendCommandViaRespawn (THE FIX): a3n @421874-421878
 *   - TmuxBackend class:               Ndo @421879-422122
 *       createExternalSwarmSession     @421995-422026 (new-session/new-window … -- cat)
 *       createTeammatePaneWithLeader   @422028-422061 (split-window -d … -- cat, @422036/422050)
 *       createTeammatePaneExternal     @422062-422095 (split-window -d … -- cat @422085)
 *       sendCommandToPane              @421900-421909 (Slt guard → endpoint select → a3n)
 *       rebalancePanesWithLeader       @422096-422109, rebalancePanesTiled @422110-422121
 *   - pane-error decorator:            q5a @421839-421845, color map V5a @421854-421865
 *   - pane-creation mutex:             lDp @421846-421853 (serializes concurrent spawns)
 *   - env/availability probes:         imported from ./detection.js (mte/Wke/lBn/aBn)
 *   - tmux constants:                  B8/N8/ylt/Qoo/Gke/np @362636-362644 (./constants.js)
 * 2.1.88 ancestor: utils/swarm/backends/TmuxBackend.ts (file layout, method names,
 *   acquirePaneCreationLock, getTmuxColorName, decoratePaneError, runTmuxIn* routers).
 *   NOTE: 88's sendCommandToPane used `send-keys` + `waitForPaneShellReady()` (200 ms) and
 *   its create paths ran the default shell (no `-- cat`, no `-d`); the 183 bundle WINS on
 *   those — both are replaced by the respawn-pane + holding-`cat` design here.
 * scaffold: 30_agent_team/spawn_backends_and_tmux_fix.md (§3 a3n vs send-keys, §4 the `cat`
 *   holder, §3.3 the Slt guard) + _scout_dossier_agent_team.md §3.4.
 * cross-val (re-read in the 183 bundle): a3n @421874 (set-option remain-on-exit failed →
 *   respawn-pane -k -- <cmd> → throw sF on non-zero); every split/new-window/new-session in
 *   Ndo ends in `… "--", Gke` with `-d`; NO sleep/g8/200/WT_ anywhere in @421890-422122;
 *   sendCommandToPane @421900 calls Slt(command) then a3n. CONFIRMED.
 */

import type { AgentColorName, CreatePaneResult, PaneBackend, PaneId } from './types.js'
import {
  getLeaderPaneId,
  getUserTmuxSocket,
  isInsideTmux,
  isTmuxAvailable,
} from './detection.js'
import { registerTmuxBackend } from './registry.js'
import { count } from '../../array.js'
import { logForDebugging } from '../../debug.js'
import { logTelemetryError } from '../../telemetry.js'
import { execFileNoThrow } from '../../execFileNoThrow.js'
import {
  HIDDEN_SESSION_NAME,
  SWARM_SESSION_NAME,
  SWARM_VIEW_WINDOW_NAME,
  TMUX_BIN,
  TMUX_HOLDING_CMD,
  getSwarmSocketName,
} from '../constants.js'

// ---------------------------------------------------------------------------
// Errors + the control-character guard (shared across the pane-spawn surface)
// ---------------------------------------------------------------------------

// 2.1.183: SwarmPaneError = sF @cli_inner_pretty.js:362769
/** Error type thrown by every pane-backend failure path (tmux + iTerm2). */
export class SwarmPaneError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SwarmPaneError'
  }
}

// 2.1.183: CONTROL_CHAR_RE = fDa @cli_inner_pretty.js:362775 (/\p{Cc}/u)
/** Matches any code point in the Unicode "Control" (Cc) category — C0/C1, incl. \n \r \t ESC. */
const CONTROL_CHAR_RE = /\p{Cc}/u

// 2.1.183: hasControlChars = mDa @cli_inner_pretty.js:362752
/** Cheap boolean probe used where only "does it contain any control char?" is needed. */
export function hasControlChars(value: string): boolean {
  return CONTROL_CHAR_RE.test(value)
}

// 2.1.183: assertNoControlChars = Slt @cli_inner_pretty.js:362755
/**
 * Reject any command containing a Unicode control character BEFORE it ever reaches a
 * terminal. Defense-in-depth: even though respawn-pane exec()s the command (no shell to
 * type into), an embedded control char in a name/cwd/model value could still cause a
 * terminal-escape injection when the command is displayed in the pane title/border, or
 * break tmux's own option parsing. Throws a precise `U+XXXX` SwarmPaneError on the first hit.
 */
export function assertNoControlChars(command: string): void {
  const match = CONTROL_CHAR_RE.exec(command)
  if (match) {
    const codePoint = match[0].codePointAt(0)! // @362758
    throw new SwarmPaneError(
      // verbatim @cli_inner_pretty.js:362759-362761
      `Refusing to send command containing control character U+${codePoint
        .toString(16)
        .padStart(4, '0')
        .toUpperCase()} to terminal pane`,
    )
  }
}

// ---------------------------------------------------------------------------
// tmux process helpers + socket routers
// ---------------------------------------------------------------------------

// 2.1.183: runTmux = Fn(B8, …) @cli_inner_pretty.js:50307 (the no-throw exec helper, bound to "tmux")
/** Runs `tmux <args>` without throwing on non-zero exit; returns {stdout,stderr,code}. */
export function runTmux(
  args: string[],
): Promise<{ stdout: string; stderr: string; code: number }> {
  return execFileNoThrow(TMUX_BIN, args)
}

// 2.1.183: runTmuxInUserSession = kj @cli_inner_pretty.js:421866
/**
 * Run a tmux command against the user's own tmux server. When the user is inside tmux we
 * route through their `-S <socket>` (parsed from $TMUX) so we operate on their panes;
 * otherwise (no socket) we use the default tmux server.
 */
function runTmuxInUserSession(
  args: string[],
): Promise<{ stdout: string; stderr: string; code: number }> {
  const socket = getUserTmuxSocket() // lBn — the part of $TMUX before the first comma, or null
  return runTmux(socket ? ['-S', socket, ...args] : args) // @421868
}

// 2.1.183: runTmuxInSwarmSocket = yF @cli_inner_pretty.js:421871
/** Run a tmux command against the external standalone swarm server via `-L claude-swarm-<pid>`. */
function runTmuxInSwarmSocket(
  args: string[],
): Promise<{ stdout: string; stderr: string; code: number }> {
  return runTmux(['-L', getSwarmSocketName(), ...args]) // @421872
}

// 2.1.183: getTmuxColorName = V5a @cli_inner_pretty.js:421854
/** Maps an agent color to the tmux color name used in pane-border-style etc. */
function getTmuxColorName(color: AgentColorName): string {
  return {
    red: 'red',
    blue: 'blue',
    green: 'green',
    yellow: 'yellow',
    purple: 'magenta',
    orange: 'colour208',
    pink: 'colour205',
    cyan: 'cyan',
  }[color]
}

// 2.1.183: decoratePaneCreateError = q5a @cli_inner_pretty.js:421839
/**
 * Turn a raw tmux split failure into an actionable message. When the failure is a
 * no-room-for-another-split error, append guidance to spawn fewer teammates / enlarge
 * the terminal / switch to in-process mode.
 */
function decoratePaneCreateError(stderr: string): string {
  const base = `Failed to create teammate pane: ${stderr}`
  const lower = stderr.toLowerCase()
  return lower.includes('no space') || lower.includes('too small')
    ? // verbatim @cli_inner_pretty.js:421843
      `${base} — no room for another tmux split. Spawn fewer concurrent teammates, enlarge your terminal if running inside tmux, or switch to in-process teammates via /config.`
    : base
}

// 2.1.183: paneCreationLock = lDp @cli_inner_pretty.js:421846 (and the module-level W5a promise)
/**
 * Serialize concurrent pane creation. Parallel teammate spawns would race tmux layout
 * operations; this chains each createPane behind the previous one. Returns the release fn.
 */
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

// ---------------------------------------------------------------------------
// THE FIX: inject the command by replacing the pane's process (respawn-pane)
// ---------------------------------------------------------------------------

// 2.1.183: sendCommandViaRespawn = a3n @cli_inner_pretty.js:421874
/**
 * Inject a command into a pane by REPLACING the pane's current process (the `cat` holder)
 * with it — not by typing into a shell. This is the v2.1.178 send-keys → respawn-pane fix.
 *
 *   v2.1.156 (BEFORE): `send-keys -t <pane> <cmd> Enter`  (verified v2.1.156
 *   cli_inner_pretty.js:380567) — literally a human typing `cd … && env … claude --agent-id …`
 *   at the pane's interactive-shell prompt and pressing Return. (The older v2.1.88 ancestor
 *   also awaited a 200 ms `waitForPaneShellReady()` before send-keys — 88 TmuxBackend.ts:33/627
 *   — to let the shell finish sourcing rc-files; that delay was already gone by v2.1.156, whose
 *   sendCommandToPane is a bare send-keys with no sleep.)
 *
 *   v2.1.183 (AFTER): create the pane running `cat` (a quiescent holder; see the create*
 *   methods), then run the two commands below.
 *
 * Why respawn-pane fixes both bugs the send-keys path had:
 *   1. SLOW-RC-INIT RACE — send-keys writes chars into the pane's pty; if the shell is still
 *      loading .zshrc/.bashrc/p10k when they land, they get swallowed, echoed pre-prompt, or
 *      interleaved with startup output. (v2.1.88 tried to paper over this with the 200 ms
 *      shell-ready guess, false on heavy profiles; v2.1.156 dropped even that.) respawn-pane is
 *      a tmux server op that targets the pane by id and exec()s the command as the pane's
 *      process image — there is no shell that must "be ready", so the race is gone entirely.
 *   2. KEYSTROKE-LEAK — a real interactive shell in the pane buffers ANY chars reaching it
 *      (stray focus, bracketed-paste fragments, terminal noise) into the same command line,
 *      mangling `cd … && env … claude …`. With respawn-pane the command is the pane's process
 *      ARGUMENT, never terminal input — there is no readline buffer to leak into.
 */
export async function sendCommandViaRespawn(
  socketArgs: string[],
  paneId: PaneId,
  command: string,
): Promise<void> {
  // @421875  Keep the pane visible if its process exits non-zero (a crashed teammate leaves a
  // dead-but-readable pane instead of vanishing). `-p` scopes the option to this pane only.
  await runTmux([...socketArgs, 'set-option', '-p', '-t', paneId, 'remain-on-exit', 'failed'])
  // @421876  Replace the pane's current process (the `cat` holder) with <command>: `-k` kills
  // the existing process first; `--` ends tmux option parsing so the command + args are taken
  // verbatim. tmux exec()s it directly — NO interactive shell, nothing to race or leak into.
  const result = await runTmux([...socketArgs, 'respawn-pane', '-k', '-t', paneId, '--', command])
  if (result.code !== 0) {
    // verbatim @cli_inner_pretty.js:421877
    throw new SwarmPaneError(`Failed to send command to pane ${paneId}: ${result.stderr}`)
  }
}

// ---------------------------------------------------------------------------
// The tmux backend
// ---------------------------------------------------------------------------

// 2.1.183: TmuxBackend = Ndo @cli_inner_pretty.js:421879 (v2.1.156: ZU6)
export class TmuxBackend implements PaneBackend {
  readonly type = 'tmux' as const // @421880
  readonly displayName = 'tmux' // @421881
  readonly supportsHideShow = true // @421882

  /** Cached "session:window" id of the leader's window, to avoid repeated display-message calls. */
  private cachedLeaderWindowTarget: string | null = null // @421883
  /** Whether the very first pane of the external swarm window has been claimed yet. */
  private firstPaneUsedForExternal = false // @421884

  // @421885
  async isAvailable(): Promise<boolean> {
    return isTmuxAvailable() // Wke — `tmux -V` exit 0
  }

  // @421888
  async isRunningInside(): Promise<boolean> {
    return isInsideTmux() // mte — captured $TMUX at module load
  }

  // 2.1.183: createTeammatePaneInSwarmView (dispatch) @cli_inner_pretty.js:421891
  /** Public entry: pick the in-user-tmux path vs the external standalone-session path. */
  async createTeammatePaneInSwarmView(name: string, color: AgentColorName): Promise<CreatePaneResult> {
    const release = await acquirePaneCreationLock() // @421892
    try {
      if (await this.isRunningInside()) {
        return await this.createTeammatePaneWithLeader(name, color) // @421894
      }
      return await this.createTeammatePaneExternal(name, color) // @421895
    } finally {
      release() // @421897
    }
  }

  // 2.1.183: sendCommandToPane @cli_inner_pretty.js:421900  (Slt guard → endpoint select → a3n)
  /**
   * Inject the relaunch command into a teammate pane. Signature is unchanged from v2.1.156
   * (paneId, command, useExternalSession), but the body now (1) rejects control characters
   * and (2) routes to respawn-pane instead of send-keys.
   */
  async sendCommandToPane(paneId: PaneId, command: string, useExternalSession = false): Promise<void> {
    try {
      assertNoControlChars(command) // Slt — @421902
    } catch (err) {
      // @421904  attribute the rejection, then rethrow unchanged
      logTelemetryError('swarm_pane_spawn', 'swarm_pane_command_control_chars')
      throw err
    }
    // @421906-421908  choose the tmux endpoint: external swarm session (-L) when not inside the
    // user's tmux; else the user's session (-S <socket>) if $TMUX gives one; else default server.
    const userSocket = getUserTmuxSocket() // lBn
    const socketArgs = useExternalSession
      ? ['-L', getSwarmSocketName()] // VFt → claude-swarm-<pid>
      : userSocket
        ? ['-S', userSocket]
        : []
    await sendCommandViaRespawn(socketArgs, paneId, command) // a3n — @421908
  }

  // 2.1.183: setPaneBorderColor @cli_inner_pretty.js:421910
  async setPaneBorderColor(paneId: PaneId, color: AgentColorName, useExternalSession = false): Promise<void> {
    const tmuxColor = getTmuxColorName(color)
    const run = useExternalSession ? runTmuxInSwarmSocket : runTmuxInUserSession
    await run(['set-option', '-p', '-t', paneId, 'window-style', `bg=default,fg=${tmuxColor}`])
    await run(['set-option', '-p', '-t', paneId, 'pane-border-style', `fg=${tmuxColor}`])
    await run(['set-option', '-p', '-t', paneId, 'pane-active-border-style', `fg=${tmuxColor}`])
  }

  // 2.1.183: setPaneTitle @cli_inner_pretty.js:421917
  async setPaneTitle(paneId: PaneId, title: string, color: AgentColorName, useExternalSession = false): Promise<void> {
    const tmuxColor = getTmuxColorName(color)
    const run = useExternalSession ? runTmuxInSwarmSocket : runTmuxInUserSession
    await run(['select-pane', '-t', paneId, '-T', title])
    await run([
      'set-option',
      '-p',
      '-t',
      paneId,
      'pane-border-format',
      `#[fg=${tmuxColor},bold] #{pane_title} #[default]`,
    ])
  }

  // 2.1.183: enablePaneBorderStatus @cli_inner_pretty.js:421923
  async enablePaneBorderStatus(windowTarget?: string, useExternalSession = false): Promise<void> {
    const target = windowTarget || (await this.getCurrentWindowTarget())
    if (!target) return
    await (useExternalSession ? runTmuxInSwarmSocket : runTmuxInUserSession)([
      'set-option',
      '-w',
      '-t',
      target,
      'pane-border-status',
      'top',
    ])
  }

  // 2.1.183: rebalancePanes @cli_inner_pretty.js:421928
  async rebalancePanes(windowTarget: string, hasLeader: boolean): Promise<void> {
    if (hasLeader) await this.rebalancePanesWithLeader(windowTarget)
    else await this.rebalancePanesTiled(windowTarget)
  }

  // 2.1.183: killPane @cli_inner_pretty.js:421932
  async killPane(paneId: PaneId, useExternalSession = false): Promise<boolean> {
    return (await (useExternalSession ? runTmuxInSwarmSocket : runTmuxInUserSession)(['kill-pane', '-t', paneId])).code === 0
  }

  // 2.1.183: hidePane @cli_inner_pretty.js:421935
  /** Break the pane out into a detached "claude-hidden" session so it keeps running, invisibly. */
  async hidePane(paneId: PaneId, useExternalSession = false): Promise<boolean> {
    const run = useExternalSession ? runTmuxInSwarmSocket : runTmuxInUserSession
    await run(['new-session', '-d', '-s', HIDDEN_SESSION_NAME])
    const result = await run(['break-pane', '-d', '-s', paneId, '-t', `${HIDDEN_SESSION_NAME}:`])
    if (result.code === 0) logForDebugging(`[TmuxBackend] Hidden pane ${paneId}`)
    else logForDebugging(`[TmuxBackend] Failed to hide pane ${paneId}: ${result.stderr}`)
    return result.code === 0
  }

  // 2.1.183: showPane @cli_inner_pretty.js:421943
  /** Join a hidden pane back into a window, restore main-vertical layout, leader pane to 30%. */
  async showPane(paneId: PaneId, targetWindowOrPane: string, useExternalSession = false): Promise<boolean> {
    const run = useExternalSession ? runTmuxInSwarmSocket : runTmuxInUserSession
    const joined = await run(['join-pane', '-h', '-s', paneId, '-t', targetWindowOrPane])
    if (joined.code !== 0) {
      logForDebugging(`[TmuxBackend] Failed to show pane ${paneId}: ${joined.stderr}`)
      return false
    }
    logForDebugging(`[TmuxBackend] Showed pane ${paneId} in ${targetWindowOrPane}`)
    await run(['select-layout', '-t', targetWindowOrPane, 'main-vertical'])
    const paneIds = (await run(['list-panes', '-t', targetWindowOrPane, '-F', '#{pane_id}'])).stdout
      .trim()
      .split('\n')
      .filter(Boolean)
    if (paneIds[0]) await run(['resize-pane', '-t', paneIds[0], '-x', '30%'])
    return true
  }

  // 2.1.183: getCurrentPaneId @cli_inner_pretty.js:421958
  /** The leader's pane id — prefer the captured $TMUX_PANE; else ask tmux. */
  private async getCurrentPaneId(): Promise<string | null> {
    const fromEnv = getLeaderPaneId() // aBn — captured $TMUX_PANE
    if (fromEnv) return fromEnv
    const result = await runTmuxInUserSession(['display-message', '-p', '#{pane_id}'])
    if (result.code !== 0) {
      logForDebugging(`[TmuxBackend] Failed to get current pane ID (exit ${result.code}): ${result.stderr}`)
      return null
    }
    return result.stdout.trim()
  }

  // 2.1.183: getCurrentWindowTarget @cli_inner_pretty.js:421965
  /** The leader's "window_id", cached after the first lookup. */
  private async getCurrentWindowTarget(): Promise<string | null> {
    if (this.cachedLeaderWindowTarget) return this.cachedLeaderWindowTarget
    const leaderPane = getLeaderPaneId() // aBn
    const args = ['display-message']
    if (leaderPane) args.push('-t', leaderPane)
    args.push('-p', '#{window_id}')
    const result = await runTmuxInUserSession(args)
    if (result.code !== 0) {
      logForDebugging(`[TmuxBackend] Failed to get current window target (exit ${result.code}): ${result.stderr}`)
      return null
    }
    this.cachedLeaderWindowTarget = result.stdout.trim()
    return this.cachedLeaderWindowTarget
  }

  // 2.1.183: getCurrentWindowPaneCount @cli_inner_pretty.js:421976
  private async getCurrentWindowPaneCount(windowTarget?: string, useExternalSession = false): Promise<number | null> {
    const target = windowTarget || (await this.getCurrentWindowTarget())
    if (!target) return null
    const args = ['list-panes', '-t', target, '-F', '#{pane_id}']
    const result = useExternalSession ? await runTmuxInSwarmSocket(args) : await runTmuxInUserSession(args)
    if (result.code !== 0) {
      logForDebugging(`[TmuxBackend] Failed to get pane count for ${target} (exit ${result.code}): ${result.stderr}`, {
        level: 'error',
      })
      return null
    }
    return count(result.stdout.trim().split('\n'), Boolean) // Wn — count of non-empty lines
  }

  // 2.1.183: hasSessionInSwarm @cli_inner_pretty.js:421992
  private async hasSessionInSwarm(sessionName: string): Promise<boolean> {
    return (await runTmuxInSwarmSocket(['has-session', '-t', sessionName])).code === 0
  }

  // 2.1.183: createExternalSwarmSession @cli_inner_pretty.js:421995
  /**
   * Ensure the external standalone swarm session/window exists (used when Claude is NOT
   * inside the user's tmux). Both `new-session` and `new-window` create the holder running
   * `cat` (`-- TMUX_HOLDING_CMD`) and are detached (`-d`), so nothing steals the terminal.
   */
  private async createExternalSwarmSession(): Promise<{ windowTarget: string; paneId: string }> {
    if (!(await this.hasSessionInSwarm(SWARM_SESSION_NAME))) {
      // @421997  new detached swarm session, first pane runs `cat`
      const created = await runTmuxInSwarmSocket([
        'new-session',
        '-d',
        '-s',
        SWARM_SESSION_NAME,
        '-n',
        SWARM_VIEW_WINDOW_NAME,
        '-P',
        '-F',
        '#{pane_id}',
        '--',
        TMUX_HOLDING_CMD,
      ])
      if (created.code !== 0) {
        throw new SwarmPaneError(`Failed to create swarm session: ${created.stderr || 'Unknown error'}`)
      }
      const paneId = created.stdout.trim()
      const windowTarget = `${SWARM_SESSION_NAME}:${SWARM_VIEW_WINDOW_NAME}`
      logForDebugging(`[TmuxBackend] Created external swarm session with window ${windowTarget}, pane ${paneId}`)
      return { windowTarget, paneId }
    }
    // Session already exists — reuse the swarm-view window, or create it (also running `cat`).
    const windowNames = (await runTmuxInSwarmSocket(['list-windows', '-t', SWARM_SESSION_NAME, '-F', '#{window_name}'])).stdout
      .trim()
      .split('\n')
      .filter(Boolean)
    const windowTarget = `${SWARM_SESSION_NAME}:${SWARM_VIEW_WINDOW_NAME}`
    if (windowNames.includes(SWARM_VIEW_WINDOW_NAME)) {
      const paneIds = (await runTmuxInSwarmSocket(['list-panes', '-t', windowTarget, '-F', '#{pane_id}'])).stdout
        .trim()
        .split('\n')
        .filter(Boolean)
      return { windowTarget, paneId: paneIds[0] || '' }
    }
    // @422024  create the swarm-view window running `cat`
    const created = await runTmuxInSwarmSocket([
      'new-window',
      '-t',
      SWARM_SESSION_NAME,
      '-n',
      SWARM_VIEW_WINDOW_NAME,
      '-P',
      '-F',
      '#{pane_id}',
      '--',
      TMUX_HOLDING_CMD,
    ])
    if (created.code !== 0) {
      throw new SwarmPaneError(`Failed to create swarm-view window: ${created.stderr || 'Unknown error'}`)
    }
    return { windowTarget, paneId: created.stdout.trim() }
  }

  // 2.1.183: createTeammatePaneWithLeader @cli_inner_pretty.js:422028
  /**
   * In-the-user's-tmux path. First teammate: split the leader pane horizontally to 70%
   * (leader kept at 30%). Subsequent teammates: split an existing teammate pane, alternating
   * -v/-h. EVERY split is `-d` (don't switch focus to the new pane) and `-- cat` (run the
   * holder, NOT the user's interactive shell). No shell-ready sleep before returning — `cat`
   * is instantly ready for the respawn-pane that follows (the v2.1.88 ancestor awaited a 200 ms
   * waitForPaneShellReady() here; v2.1.156 already had none; v2.1.183 keeps none).
   */
  private async createTeammatePaneWithLeader(name: string, color: AgentColorName): Promise<CreatePaneResult> {
    const leaderPane = await this.getCurrentPaneId()
    const windowTarget = await this.getCurrentWindowTarget()
    if (!leaderPane || !windowTarget) throw new SwarmPaneError('Could not determine current tmux pane/window')

    const paneCount = await this.getCurrentWindowPaneCount(windowTarget)
    if (paneCount === null) throw new SwarmPaneError('Could not determine pane count for current window')

    const isFirstTeammate = paneCount === 1
    let result: { stdout: string; stderr: string; code: number }
    if (isFirstTeammate) {
      // @422036  split the leader pane: -d (no focus steal), -h -l 70%, run `cat`
      result = await runTmuxInUserSession([
        'split-window',
        '-d',
        '-t',
        leaderPane,
        '-h',
        '-l',
        '70%',
        '-P',
        '-F',
        '#{pane_id}',
        '--',
        TMUX_HOLDING_CMD,
      ])
    } else {
      // @422040-422050  pick a target among existing teammate panes (skip the leader), alternate split axis
      const teammatePanes = (await runTmuxInUserSession(['list-panes', '-t', windowTarget, '-F', '#{pane_id}'])).stdout
        .trim()
        .split('\n')
        .filter(Boolean)
        .slice(1)
      const n = teammatePanes.length
      const splitVertically = n % 2 === 1
      const middleIndex = Math.floor((n - 1) / 2)
      const targetPane = teammatePanes[middleIndex] || teammatePanes.at(-1)!
      result = await runTmuxInUserSession([
        'split-window',
        '-d',
        '-t',
        targetPane,
        splitVertically ? '-v' : '-h',
        '-P',
        '-F',
        '#{pane_id}',
        '--',
        TMUX_HOLDING_CMD,
      ])
    }
    if (result.code !== 0) throw new SwarmPaneError(decoratePaneCreateError(result.stderr))

    const paneId = result.stdout.trim()
    logForDebugging(`[TmuxBackend] Created teammate pane for ${name}: ${paneId}`)
    await this.setPaneBorderColor(paneId, color)
    await this.setPaneTitle(paneId, name, color)
    await this.rebalancePanesWithLeader(windowTarget)
    return { paneId, isFirstTeammate } // @422060 — no sleep here (v2.1.88 had await waitForPaneShellReady(); v2.1.156 already dropped it)
  }

  // 2.1.183: createTeammatePaneExternal @cli_inner_pretty.js:422062
  /**
   * Standalone-swarm path (Claude not inside the user's tmux). Reuse the swarm window's
   * initial `cat` pane for the first teammate; split (alternating -v/-h, `-d`, `-- cat`) for
   * the rest. Uses the tiled layout instead of leader-30%.
   */
  private async createTeammatePaneExternal(name: string, color: AgentColorName): Promise<CreatePaneResult> {
    const { windowTarget, paneId: initialPaneId } = await this.createExternalSwarmSession()
    const paneCount = await this.getCurrentWindowPaneCount(windowTarget, true)
    if (paneCount === null) throw new SwarmPaneError('Could not determine pane count for swarm window')

    const isFirstTeammate = !this.firstPaneUsedForExternal && paneCount === 1
    let paneId: string
    if (isFirstTeammate) {
      paneId = initialPaneId
      this.firstPaneUsedForExternal = true
      logForDebugging(`[TmuxBackend] Using initial pane for first teammate ${name}: ${paneId}`)
      await this.enablePaneBorderStatus(windowTarget, true)
    } else {
      const panes = (await runTmuxInSwarmSocket(['list-panes', '-t', windowTarget, '-F', '#{pane_id}'])).stdout
        .trim()
        .split('\n')
        .filter(Boolean)
      const n = panes.length
      const splitVertically = n % 2 === 1
      const middleIndex = Math.floor((n - 1) / 2)
      const targetPane = panes[middleIndex] || panes.at(-1)!
      // @422085  split running `cat`, detached, alternating axis
      const result = await runTmuxInSwarmSocket([
        'split-window',
        '-d',
        '-t',
        targetPane,
        splitVertically ? '-v' : '-h',
        '-P',
        '-F',
        '#{pane_id}',
        '--',
        TMUX_HOLDING_CMD,
      ])
      if (result.code !== 0) throw new SwarmPaneError(decoratePaneCreateError(result.stderr))
      paneId = result.stdout.trim()
      logForDebugging(`[TmuxBackend] Created teammate pane for ${name}: ${paneId}`)
    }
    await this.setPaneBorderColor(paneId, color, true)
    await this.setPaneTitle(paneId, name, color, true)
    await this.rebalancePanesTiled(windowTarget)
    return { paneId, isFirstTeammate }
  }

  // 2.1.183: rebalancePanesWithLeader @cli_inner_pretty.js:422096
  /** main-vertical layout with the leader pane forced to 30% width. No-op for <=2 panes. */
  private async rebalancePanesWithLeader(windowTarget: string): Promise<void> {
    const paneIds = (await runTmuxInUserSession(['list-panes', '-t', windowTarget, '-F', '#{pane_id}'])).stdout
      .trim()
      .split('\n')
      .filter(Boolean)
    if (paneIds.length <= 2) return
    await runTmuxInUserSession(['select-layout', '-t', windowTarget, 'main-vertical'])
    const leaderPane = paneIds[0]
    await runTmuxInUserSession(['resize-pane', '-t', leaderPane, '-x', '30%'])
    logForDebugging(`[TmuxBackend] Rebalanced ${paneIds.length - 1} teammate panes with leader`)
  }

  // 2.1.183: rebalancePanesTiled @cli_inner_pretty.js:422110
  /** tiled layout (external swarm window, no leader). No-op for <=1 pane. */
  private async rebalancePanesTiled(windowTarget: string): Promise<void> {
    const paneIds = (await runTmuxInSwarmSocket(['list-panes', '-t', windowTarget, '-F', '#{pane_id}'])).stdout
      .trim()
      .split('\n')
      .filter(Boolean)
    if (paneIds.length <= 1) return
    await runTmuxInSwarmSocket(['select-layout', '-t', windowTarget, 'tiled'])
    logForDebugging(`[TmuxBackend] Rebalanced ${paneIds.length} teammate panes with tiled layout`)
  }
}

// 2.1.183: registration = Fdo(Ndo) @cli_inner_pretty.js:422133 (Bdo module init @422124)
// Register the class with the backend registry on import so the registry can lazily
// construct it without a static import cycle.
registerTmuxBackend(TmuxBackend)

// Mapping (this file):
//   sF→SwarmPaneError, fDa→CONTROL_CHAR_RE, mDa→hasControlChars, Slt→assertNoControlChars,
//   Fn(B8,…)→runTmux (Fn wraps execFileNoThrow), kj→runTmuxInUserSession, yF→runTmuxInSwarmSocket, lBn→getUserTmuxSocket,
//   aBn→getLeaderPaneId, V5a→getTmuxColorName, q5a→decoratePaneCreateError, lDp→acquirePaneCreationLock,
//   a3n→sendCommandViaRespawn, Ndo→TmuxBackend, B8→TMUX_BIN, Gke→TMUX_HOLDING_CMD,
//   N8→SWARM_SESSION_NAME, ylt→SWARM_VIEW_WINDOW_NAME, Qoo→HIDDEN_SESSION_NAME,
//   VFt→getSwarmSocketName, Wke→isTmuxAvailable, mte→isInsideTmux, Wn→count, v→logForDebugging,
//   Me→logTelemetryError, Fdo→registerTmuxBackend
