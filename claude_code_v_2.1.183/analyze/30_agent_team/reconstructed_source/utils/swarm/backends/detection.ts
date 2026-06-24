/**
 * Backend environment detection for the Agent Team / "swarm" subsystem (v2.1.183).
 *
 * Two responsibilities:
 *   1. *Synchronous / cheap environment probes* — am I running inside the user's
 *      tmux? inside iTerm2? is tmux / the it2 CLI installed? plus the captured
 *      leader pane id and tmux socket. These feed the registry's
 *      `isInProcessEnabled` decision.
 *   2. The *async backend resolver* `detectAndGetBackend` (eLe) — given the
 *      environment, pick + construct the concrete `PaneBackend` (tmux or iTerm2),
 *      cache it for the process lifetime, and emit `swarm_backend_detect`
 *      telemetry. Exported additionally as `detectPaneBackend` to match the
 *      already-reconstructed spawnTeammate.ts import.
 *
 * 2.1.183 regions covered:
 *   - cli_inner_pretty.js:362694-362750 (env probes iBn/kgp/mte/aBn/lBn/Wke/oce/
 *     YFt/Lgp; export map @362682; module-load capture of TMUX/TMUX_PANE @362750;
 *     cBn = "it2" @362744).
 *   - cli_inner_pretty.js:422314-422382 (eLe = detectAndGetBackend), 422383-422404
 *     (pDp = getTmuxInstallInstructions).
 * 2.1.88 ancestor: utils/swarm/backends/detection.ts (the probe set, the "ONLY
 *   check TMUX env var" rationale, IT2_COMMAND, getLeaderPaneId) AND the
 *   detection half of utils/swarm/backends/registry.ts (detectAndGetBackend +
 *   getTmuxInstallInstructions). NOTE: in 88 the resolver lived in registry.ts;
 *   we place it here because spawnTeammate.ts (already reconstructed) imports
 *   `detectPaneBackend` from ./backends/detection.js, and eLe is the detection
 *   surface. It calls back into the registry's constructors + ensureBackendsRegistered.
 *
 * ── DELIBERATE RUNTIME-ONLY IMPORT CYCLE (detection.ts <-> registry.ts) ──────
 * This is a genuine value-level cycle, NOT a cycle-free split:
 *   - detection.ts imports `createITermBackend`, `createTmuxBackend`,
 *     `ensureBackendsRegistered`, `globalBackendRegistry` (values) from ./registry.js.
 *   - registry.ts imports `detectAndGetBackend` (value), `isInITerm2`,
 *     `isInsideTmuxSync` (values) from ./detection.js.
 * It is SAFE under ESM live-bindings because BOTH sides reference the other
 * module's imports ONLY from inside function bodies (here: ensureBackendsRegistered
 * / createTmuxBackend / createITermBackend inside `detectAndGetBackend`, and
 * `globalBackendRegistry` only as a default-arg, i.e. evaluated at call time) —
 * never at module top-level eval. By the time `detectAndGetBackend` runs, both
 * modules are fully evaluated and the hoisted function bindings resolve correctly.
 * No top-level use exists in either file.
 * scaffold: 30_agent_team/spawn_backends_and_tmux_fix.md §1.1 (detectBackend eLe
 *   @422314, "emits swarm_backend_detect telemetry"); baseline
 *   claude_code_v_2.1.156/analyze/30_agent_team/execution_modes_and_backend_registry.md.
 * cross-val: re-read iBn/mte/oce/Wke/YFt/lBn @362694-362744 and eLe @422314 in the
 *   183 bundle. Confirmed isInsideTmux is TMUX-env-only (no `tmux display-message`
 *   fallback), isIt2CliAvailable uses `it2 session list` (not --version), and
 *   eLe emits Le("swarm_backend_detect") on success / Rt / Me on fallback+error.
 */

import { execFileNoThrow } from '../../execFileNoThrow.js'
import { env } from '../../env.js'
import { getPlatform } from '../../platform.js'
import { substringBefore } from '../../string.js'
import { logForDebugging } from '../../debug.js'
import {
  logTelemetryError,
  logTelemetrySad,
  logTelemetrySuccess,
} from '../../telemetry.js'
import { TMUX_BIN } from '../constants.js'
import { getPreferTmuxOverIterm2 } from './it2Setup.js'
import {
  createITermBackend,
  createTmuxBackend,
  ensureBackendsRegistered,
  globalBackendRegistry,
} from './registry.js'
import type { BackendRegistryState } from './registry.js'
import type { BackendDetectionResult } from './types.js'

/**
 * The it2 CLI command name (iTerm2's Python-API command-line tool).
 */
// 2.1.183: IT2_COMMAND = cBn @cli_inner_pretty.js:362744 ("it2")
export const IT2_COMMAND = 'it2'

/**
 * Captured at module load: the user's original TMUX / TMUX_PANE env vars.
 * Shell.ts later overrides process.env.TMUX when Claude's own tmux socket is
 * initialized, so we snapshot the originals here to know if the user *started*
 * Claude from within their tmux session.
 */
// 2.1.183: capture @cli_inner_pretty.js:362750 ((blt = process.env.TMUX), (xgp = process.env.TMUX_PANE))
// (declared as module vars `var blt, xgp` @362740-362741; assigned in module init @362750)
const ORIGINAL_USER_TMUX: string | undefined = process.env.TMUX // blt @362740
const ORIGINAL_TMUX_PANE: string | undefined = process.env.TMUX_PANE // xgp @362741

/** Cached result for the async isInsideTmux probe. */
// 2.1.183: zFt @cli_inner_pretty.js:362742 (= null)
let isInsideTmuxCached: boolean | null = null

/** Cached result for the isInITerm2 probe. */
// 2.1.183: KFt @cli_inner_pretty.js:362743 (= null)
let isInITerm2Cached: boolean | null = null

// 2.1.183: isInsideTmuxSync = iBn @cli_inner_pretty.js:362694
/**
 * Synchronous "are we inside the user's tmux?" probe. Uses ONLY the captured
 * TMUX env var — it does NOT shell out to `tmux display-message`, because that
 * command succeeds whenever ANY tmux server is running, not only when *this*
 * process is inside tmux.
 */
export function isInsideTmuxSync(): boolean {
  return !!ORIGINAL_USER_TMUX // @362695
}

// 2.1.183: isInsideTmux = mte @cli_inner_pretty.js:362713
/**
 * Async counterpart to {@link isInsideTmuxSync}. Caches its result because the
 * answer cannot change during the process lifetime.
 */
export async function isInsideTmux(): Promise<boolean> {
  if (isInsideTmuxCached !== null) return isInsideTmuxCached // @362714
  isInsideTmuxCached = !!ORIGINAL_USER_TMUX // @362715
  return isInsideTmuxCached
}

// 2.1.183: getLeaderPaneId = aBn @cli_inner_pretty.js:362717
/**
 * The leader's tmux pane id (e.g. `%0`) captured at module load, or null when
 * not running inside tmux.
 */
export function getLeaderPaneId(): string | null {
  return ORIGINAL_TMUX_PANE || null // @362718
}

// 2.1.183: getUserTmuxSocket = lBn @cli_inner_pretty.js:362720
/**
 * The socket path portion of the user's TMUX env var ("<socket>,<pid>,<session>"),
 * used as the `-S <socket>` argument when talking to the user's tmux server.
 */
export function getUserTmuxSocket(): string | null {
  if (!ORIGINAL_USER_TMUX) return null // @362721
  return substringBefore(ORIGINAL_USER_TMUX, ',') || null // @362722
}

// 2.1.183: isTmuxAvailable = Wke @cli_inner_pretty.js:362724
/**
 * Whether the tmux binary is installed and on PATH (probed via `tmux -V`).
 */
export async function isTmuxAvailable(): Promise<boolean> {
  return (await execFileNoThrow(TMUX_BIN, ['-V'])).code === 0 // @362725
}

// 2.1.183: isInITerm2 = oce @cli_inner_pretty.js:362727
/**
 * Whether we're running inside iTerm2, via three indicators (any one suffices):
 *   - TERM_PROGRAM === 'iTerm.app'
 *   - ITERM_SESSION_ID present
 *   - env.terminal === 'iTerm.app'
 * Cached for the process lifetime.
 */
export function isInITerm2(): boolean {
  if (isInITerm2Cached !== null) return isInITerm2Cached // @362728
  const termProgram = process.env.TERM_PROGRAM
  const hasItermSessionId = !!process.env.ITERM_SESSION_ID
  const terminalIsITerm = env.terminal === 'iTerm.app'
  isInITerm2Cached =
    termProgram === 'iTerm.app' || hasItermSessionId || terminalIsITerm // @362732
  return isInITerm2Cached
}

// 2.1.183: isIt2CliAvailable = YFt @cli_inner_pretty.js:362734
/**
 * Whether the it2 CLI can reach iTerm2's Python API. Uses `it2 session list`
 * (NOT `--version`) because --version succeeds even when the Python API is
 * disabled in iTerm2 preferences — which would only surface later as a
 * `session split` failure with no fallback.
 */
export async function isIt2CliAvailable(): Promise<boolean> {
  return (await execFileNoThrow(IT2_COMMAND, ['session', 'list'])).code === 0 // @362735
}

// 2.1.183: listUserTmuxSessions = kgp @cli_inner_pretty.js:362697
/**
 * Lists session names on the user's tmux server (via the captured socket), or
 * undefined when not inside tmux / on failure. 2s timeout, does not run in cwd.
 */
export async function listUserTmuxSessions(): Promise<string[] | undefined> {
  if (!ORIGINAL_USER_TMUX) return // @362698
  const socket = substringBefore(ORIGINAL_USER_TMUX, ',') // @362699
  if (!socket) return
  const { code, stdout } = await execFileNoThrow(
    TMUX_BIN,
    ['-S', socket, 'list-sessions', '-F', '#{session_name}'],
    { useCwd: false, timeout: 2000 },
  ) // @362701
  if (code !== 0) return
  return stdout.split('\n').filter(Boolean)
}

// 2.1.183: resetDetectionCache = Lgp @cli_inner_pretty.js:362737
/** Clears the cached detection probes. Test helper. */
export function resetDetectionCache(): void {
  isInsideTmuxCached = null
  isInITerm2Cached = null
}

// 2.1.183: detectAndGetBackend = eLe @cli_inner_pretty.js:422314
/**
 * Resolve and construct the concrete pane backend for this environment, caching
 * it on the registry state so the choice is fixed for the process lifetime.
 *
 * Detection priority (read directly from eLe @422323-422382):
 *   1. Inside tmux  -> TmuxBackend, isNative=true.                       (@422323)
 *   2. Inside iTerm2:                                                    (@422333)
 *        a. user prefers tmux over iTerm2 -> skip iTerm2 probe.          (@422335)
 *        b. else it2 CLI reachable        -> ITermBackend, isNative=true.(@422338)
 *        c. else tmux installed           -> TmuxBackend fallback,
 *             isNative=false, needsIt2Setup = !preferTmux.               (@422350)
 *        d. else                          -> throw (it2 not installed).  (@422360)
 *   3. Not in tmux/iTerm2 but tmux installed -> TmuxBackend external
 *        session, isNative=false.                                        (@422367)
 *   4. Otherwise -> throw with platform-specific install instructions.   (@422377)
 *
 * Telemetry: the native / external-session success paths emit `tengu_feature_ok`
 * ("swarm_backend_detect"); the iTerm2 tmux fallback emits `tengu_feature_sad`
 * with `fallback_to_tmux` / `needs_it2_setup`; the two error paths emit
 * `tengu_feature_bad` with `iterm2_no_it2_no_tmux` / `no_backend_available`.
 */
export async function detectAndGetBackend(
  registry: BackendRegistryState = globalBackendRegistry,
): Promise<BackendDetectionResult> {
  await ensureBackendsRegistered(registry) // @422315
  if (registry.cachedDetectionResult) {
    logForDebugging(
      `[BackendRegistry] Using cached backend: ${registry.cachedDetectionResult.backend.type}`,
    )
    return registry.cachedDetectionResult
  }

  logForDebugging('[BackendRegistry] Starting backend detection...')

  const insideTmux = await isInsideTmux() // @422321
  const inITerm2 = isInITerm2()
  logForDebugging(
    `[BackendRegistry] Environment: insideTmux=${insideTmux}, inITerm2=${inITerm2}`,
  )

  // Priority 1: inside tmux -> always tmux. @422323
  if (insideTmux) {
    logForDebugging(
      '[BackendRegistry] Selected: tmux (running inside tmux session)',
    )
    const backend = createTmuxBackend(registry)
    registry.cachedBackend = backend
    registry.cachedDetectionResult = {
      backend,
      isNative: true,
      needsIt2Setup: false,
    }
    logTelemetrySuccess('swarm_backend_detect') // @422329
    return registry.cachedDetectionResult
  }

  // Priority 2: inside iTerm2. @422333
  if (inITerm2) {
    const preferTmux = getPreferTmuxOverIterm2() // @422334
    if (preferTmux) {
      logForDebugging(
        '[BackendRegistry] User prefers tmux over iTerm2, skipping iTerm2 detection',
      )
    } else {
      const it2Available = await isIt2CliAvailable() // @422337
      logForDebugging(
        `[BackendRegistry] iTerm2 detected, it2 CLI available: ${it2Available}`,
      )
      if (it2Available) {
        logForDebugging(
          '[BackendRegistry] Selected: iterm2 (native iTerm2 with it2 CLI)',
        )
        const backend = createITermBackend(registry)
        registry.cachedBackend = backend
        registry.cachedDetectionResult = {
          backend,
          isNative: true,
          needsIt2Setup: false,
        }
        logTelemetrySuccess('swarm_backend_detect') // @422344
        return registry.cachedDetectionResult
      }
    }

    // it2 not available — try tmux as a fallback inside iTerm2. @422349
    const tmuxAvailable = await isTmuxAvailable()
    logForDebugging(
      `[BackendRegistry] it2 not available, tmux available: ${tmuxAvailable}`,
    )
    if (tmuxAvailable) {
      logForDebugging(
        '[BackendRegistry] Selected: tmux (fallback in iTerm2, it2 setup recommended)',
      )
      const backend = createTmuxBackend(registry)
      registry.cachedBackend = backend
      // Only signal it2 setup if the user hasn't already chosen to prefer tmux,
      // otherwise they'd be re-prompted on every spawn. @422355
      registry.cachedDetectionResult = {
        backend,
        isNative: false,
        needsIt2Setup: !preferTmux,
      }
      logTelemetrySad(
        'swarm_backend_detect',
        preferTmux ? 'fallback_to_tmux' : 'needs_it2_setup', // @422356
      )
      return registry.cachedDetectionResult
    }

    // iTerm2 with neither it2 nor tmux -> hard error. @422360
    logForDebugging(
      '[BackendRegistry] ERROR: iTerm2 detected but no it2 CLI and no tmux',
    )
    logTelemetryError('swarm_backend_detect', 'iterm2_no_it2_no_tmux') // @422362
    throw new Error(
      'iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2',
    )
  }

  // Priority 3: not in tmux/iTerm2, but tmux installed -> external session. @422366
  const tmuxAvailable = await isTmuxAvailable()
  logForDebugging(
    `[BackendRegistry] Not in tmux or iTerm2, tmux available: ${tmuxAvailable}`,
  )
  if (tmuxAvailable) {
    logForDebugging('[BackendRegistry] Selected: tmux (external session mode)')
    const backend = createTmuxBackend(registry)
    registry.cachedBackend = backend
    registry.cachedDetectionResult = {
      backend,
      isNative: false,
      needsIt2Setup: false,
    }
    logTelemetrySuccess('swarm_backend_detect') // @422373
    return registry.cachedDetectionResult
  }

  // Priority 4: no pane backend at all. @422377
  logForDebugging('[BackendRegistry] ERROR: No pane backend available')
  logTelemetryError('swarm_backend_detect', 'no_backend_available') // @422379
  throw new Error(getTmuxInstallInstructions())
}

/**
 * Alias matching the already-reconstructed spawnTeammate.ts import
 * (`import { detectPaneBackend } from './backends/detection.js'`). Same eLe.
 */
export const detectPaneBackend = detectAndGetBackend

// 2.1.183: getTmuxInstallInstructions = pDp @cli_inner_pretty.js:422383
/**
 * Platform-specific tmux install instructions, shown when no pane backend is
 * available. Verbatim strings from the bundle (@422384-422402).
 */
export function getTmuxInstallInstructions(): string {
  switch (getPlatform()) {
    case 'macos':
      return `To use agent swarms, install tmux:
  brew install tmux
Then start a tmux session with: tmux new-session -s claude`
    case 'linux':
    case 'wsl':
      return `To use agent swarms, install tmux:
  sudo apt install tmux    # Ubuntu/Debian
  sudo dnf install tmux    # Fedora/RHEL
Then start a tmux session with: tmux new-session -s claude`
    case 'windows':
      return `To use agent swarms, you need tmux which requires WSL (Windows Subsystem for Linux).
Install WSL first, then inside WSL run:
  sudo apt install tmux
Then start a tmux session with: tmux new-session -s claude`
    default:
      return `To use agent swarms, install tmux using your system's package manager.
Then start a tmux session with: tmux new-session -s claude`
  }
}

// Mapping (this file):
//   iBn->isInsideTmuxSync, mte->isInsideTmux, aBn->getLeaderPaneId,
//   lBn->getUserTmuxSocket, Wke->isTmuxAvailable, oce->isInITerm2,
//   YFt->isIt2CliAvailable, kgp->listUserTmuxSessions, Lgp->resetDetectionCache,
//   cBn->IT2_COMMAND ("it2"), blt->ORIGINAL_USER_TMUX, xgp->ORIGINAL_TMUX_PANE,
//   zFt->isInsideTmuxCached, KFt->isInITerm2Cached,
//   eLe->detectAndGetBackend (aka detectPaneBackend), pDp->getTmuxInstallInstructions,
//   N5a->getPreferTmuxOverIterm2, Kt->getPlatform, Fn->execFileNoThrow, Ge->env,
//   Di->substringBefore (Di(s,t) = substring of s before first occurrence of t @10152),
//   Le->logTelemetrySuccess, Rt->logTelemetrySad, Me->logTelemetryError,
//   c3n->createTmuxBackend, Q5a->createITermBackend, u3n->ensureBackendsRegistered,
//   _F->globalBackendRegistry
