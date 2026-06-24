/**
 * Teammate-mode snapshot (v2.1.183).
 *
 * Captures the teammate execution mode ("auto" | "tmux" | "in-process") ONCE at
 * session startup, mirroring the hooksConfigSnapshot pattern, so that runtime
 * config edits cannot change the mode mid-session. A CLI override
 * (`--teammate-mode`, set via setCliTeammateModeOverride before capture) takes
 * precedence over the persisted config value.
 *
 * 2.1.183 regions covered: cli_inner_pretty.js:293795-293826 (the whole snapshot
 *   module — hqd/QYr/ZYr/eXr/ALn/Aje and the UOt/Hxe/FOt module vars), export map
 *   @293788.
 * 2.1.88 ancestor: utils/swarm/backends/teammateModeSnapshot.ts (same API + the
 *   identical debug strings).
 * scaffold: 30_agent_team/spawn_backends_and_tmux_fix.md §1.1 (Aje, default
 *   "in-process"); _conventions.md registry (getTeammateMode = Aje @293813).
 * cross-val: re-read Aje @293813 (returns Hxe ?? UOt) and confirmed in the 183
 *   bundle that UOt = "in-process" @293826 — NOTE this is the v2.1.183 DEFAULT.
 *   BOTH v2.1.88 AND v2.1.156 defaulted to "auto" (156 @380291 Q1("teammateMode",
 *   "auto").value, @380296 return DSH ?? "auto"); the real delta is 156→183
 *   (auto → in-process). 2.1.183 reads config "teammateMode" with the fallback
 *   "in-process". ALn @293818 reads Ec("teammateMode", UOt).
 */

import { getEffectiveSetting } from '../../config.js'
import { logForDebugging } from '../../debug.js'
import { logError } from '../../log.js'

export type TeammateMode = 'auto' | 'tmux' | 'in-process'

// 2.1.183: DEFAULT_TEAMMATE_MODE = UOt @cli_inner_pretty.js:293818 ("in-process")
/**
 * The default teammate mode when neither a CLI override nor a persisted
 * `teammateMode` config value is present. v2.1.183 defaults to in-process
 * execution (an async task in the leader's own process) rather than spawning
 * tmux/iTerm2 panes.
 */
export const DEFAULT_TEAMMATE_MODE: TeammateMode = 'in-process'

/** The mode captured at startup; null until {@link captureTeammateModeSnapshot}. */
// 2.1.183: Hxe @cli_inner_pretty.js:293819 (= null)
let initialTeammateMode: TeammateMode | null = null

/** CLI override, set before capture when `--teammate-mode` is provided. */
// 2.1.183: FOt @cli_inner_pretty.js:293820 (= null)
let cliTeammateModeOverride: TeammateMode | null = null

// 2.1.183: setCliTeammateModeOverride = hqd @cli_inner_pretty.js:293797
/**
 * Record the CLI override. Must be called BEFORE captureTeammateModeSnapshot().
 */
export function setCliTeammateModeOverride(mode: TeammateMode): void {
  cliTeammateModeOverride = mode // @293798
}

// 2.1.183: getCliTeammateModeOverride = QYr @cli_inner_pretty.js:293800
/**
 * The current CLI override, or null if none was set.
 */
export function getCliTeammateModeOverride(): TeammateMode | null {
  return cliTeammateModeOverride // @293801
}

// 2.1.183: clearCliTeammateModeOverride = ZYr @cli_inner_pretty.js:293803
/**
 * Clear the CLI override and update the snapshot to a new mode. Called when the
 * user changes the setting in the UI so their change takes effect immediately
 * (newMode is passed in directly to avoid a config read-back race).
 */
export function clearCliTeammateModeOverride(newMode: TeammateMode): void {
  cliTeammateModeOverride = null // @293804
  initialTeammateMode = newMode
  logForDebugging(
    `[TeammateModeSnapshot] CLI override cleared, new mode: ${newMode}`,
  )
}

// 2.1.183: hasTeammateModeSnapshot = eXr @cli_inner_pretty.js:293806
/**
 * Whether the snapshot has been captured yet.
 */
export function hasTeammateModeSnapshot(): boolean {
  return initialTeammateMode !== null // @293807
}

// 2.1.183: captureTeammateModeSnapshot = ALn @cli_inner_pretty.js:293809
/**
 * Capture the teammate mode at startup. CLI override wins over config; config is
 * read via `teammateMode` with the {@link DEFAULT_TEAMMATE_MODE} fallback.
 */
export function captureTeammateModeSnapshot(): void {
  if (cliTeammateModeOverride) {
    initialTeammateMode = cliTeammateModeOverride // @293810
    logForDebugging(
      `[TeammateModeSnapshot] Captured from CLI override: ${initialTeammateMode}`,
    )
  } else {
    // 183 DIVERGENCE: v2.1.88 AND v2.1.156 both defaulted to 'auto' (156 read
    // `Q1("teammateMode","auto")` @380291); the 156→183 delta is the default flip
    // to 'in-process'. v2.1.183 reads via the settings-precedence accessor Ec (@154733), which
    // walks the settings layers and returns { value, source }, with UOt as the
    // default. @293811 — Ec("teammateMode", UOt).value
    initialTeammateMode = getEffectiveSetting('teammateMode', DEFAULT_TEAMMATE_MODE)
      .value
    logForDebugging(
      `[TeammateModeSnapshot] Captured from config: ${initialTeammateMode}`,
    )
  }
}

// 2.1.183: getTeammateModeFromSnapshot = Aje @cli_inner_pretty.js:293813
/**
 * The teammate mode for this session — the startup snapshot, ignoring later
 * runtime config changes. If called before capture (an init-order bug) it logs
 * the error and lazily captures, then falls back to {@link DEFAULT_TEAMMATE_MODE}.
 *
 * NOTE: the canonical readable name in the registry is `getTeammateMode`; the
 * exported symbol is `getTeammateModeFromSnapshot` (Aje), consumed by the
 * registry's `isInProcessEnabled` (rWe) via the local wrapper `mDp` @422422.
 */
export function getTeammateModeFromSnapshot(): TeammateMode {
  if (initialTeammateMode === null) {
    // @293814 — this indicates an initialization bug; log + lazily capture.
    logError(
      new Error(
        'getTeammateModeFromSnapshot called before capture - this indicates an initialization bug',
      ),
    )
    captureTeammateModeSnapshot()
  }
  return initialTeammateMode ?? DEFAULT_TEAMMATE_MODE // @293816
}

// Mapping (this file):
//   hqd->setCliTeammateModeOverride, QYr->getCliTeammateModeOverride,
//   ZYr->clearCliTeammateModeOverride, eXr->hasTeammateModeSnapshot,
//   ALn->captureTeammateModeSnapshot, Aje->getTeammateModeFromSnapshot,
//   UOt->DEFAULT_TEAMMATE_MODE ("in-process"), Hxe->initialTeammateMode,
//   FOt->cliTeammateModeOverride, Ec->getEffectiveSetting (settings-precedence
//     reader returning { value, source } @154733), De->logError, v->logForDebugging
