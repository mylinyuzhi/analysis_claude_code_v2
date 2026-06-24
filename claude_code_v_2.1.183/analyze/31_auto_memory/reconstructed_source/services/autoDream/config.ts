// Leaf config module — intentionally minimal imports so UI components
// (the /memory dialog's "Auto-dream" toggle row, see MemoryUpdateNotification.tsx)
// can read the auto-dream enabled state without dragging in the forked
// agent / task registry / message builder chain that autoDream.ts pulls in.
//
// 2.1.183 regions: cli_inner_pretty.js:454520-454534 (the enabled-gate cluster)
//   - getDreamConfig            = yQa @454520 (raw tengu_onyx_plover read)
//   - isAutoDreamServerSideOptIn= jGn @454523 (enabled || available || team-server)
//   - isAutoDreamEnabled        = T4t @454528 (server opt-in + user toggle + defaults)
// 2.1.88 ancestor: services/autoDream/config.ts (single isAutoDreamEnabled)
// scaffold: v2.1.156 auto_dream_runtime.md §1.1-1.4 (enabled gate analysis)
// cross-val: re-read 454520-454534 in the 183 bundle. The flag/presence that
//   enables auto-dream is the tengu_onyx_plover GrowthBook config (a non-null
//   payload with `.enabled === true` or `.available === true`), OR the
//   team-memory server reporting "has-content"; a user `autoDreamEnabled`
//   setting overrides the cohort default once server opt-in passes.
//
// DELTA vs 2.1.88 ancestor: the 88 config.ts had a single two-step
//   isAutoDreamEnabled (user setting, else tengu_onyx_plover.enabled). The 183
//   bundle has grown this into a 3-function cluster that adds the server-side
//   opt-in precondition (the `available` "show-but-off" rollout bit) and a
//   team-memory-server fallback. The remote/auto-memory master checks live in
//   autoDream.ts's isGateOpen (C2p @455405 — dd() remote + Iu() auto-memory) and
//   are NOT duplicated here; this module is purely the enabled toggle. @454520-454534

import { getInitialSettings } from '../../utils/settings/settings.js'
import { getFeatureValue_CACHED_MAY_BE_STALE } from '../analytics/growthbook.js'
// NEW in 183: team-memory server-status fallback. `isTeamMemServerActive` is
// isTeamMemoryEnabled() (tengu_herring_clock / CLAUDE_MEMORY_STORES) AND the
// runtime team-memory server status === "has-content". Not present in the 88
// ancestor — added with the team-store deltas. see team_memory_stores_recall.md
import { isTeamMemServerActive } from '../../memdir/teamMemPaths.js'

/** Payload shape of the tengu_onyx_plover GrowthBook config. */
type DreamConfig = {
  enabled?: unknown
  available?: unknown
  minHours?: unknown
  minSessions?: unknown
}

/**
 * Read the tengu_onyx_plover GrowthBook config (default null = not in the
 * experiment → disabled). This single flag carries both the on/off bits
 * (`enabled`/`available`) AND the scheduling knobs (`minHours`/`minSessions`,
 * consumed by getDreamThresholds in autoDream.ts), so one cohort definition
 * both enables the feature and tunes its cadence.
 */
// 2.1.183: getDreamConfig = yQa @cli_inner_pretty.js:454520
function getDreamConfig(): DreamConfig | null {
  return getFeatureValue_CACHED_MAY_BE_STALE<DreamConfig | null>(
    'tengu_onyx_plover',
    null,
  )
}

/**
 * Server-side opt-in precondition — "may the user even see/toggle this
 * feature?". Passes if EITHER the GrowthBook config marks the user `enabled`
 * or merely `available` (i.e. "you may turn it on"), OR the team-memory server
 * is active with content for this repo. The `available` branch is what
 * populates the /memory dialog's "Auto-dream" toggle row without forcing it on.
 */
// 2.1.183: isAutoDreamServerSideOptIn = jGn @cli_inner_pretty.js:454523
function isAutoDreamServerSideOptIn(): boolean {
  const cfg = getDreamConfig()
  if (cfg?.enabled === true || cfg?.available === true) return true
  // Fallback: team-memory server is active AND reports "has-content". @454526
  return isTeamMemServerActive()
}

/**
 * Whether background memory consolidation should run. Resolves the *effective*
 * enabled state by combining the server-side opt-in precondition with the
 * user's explicit /memory-dialog toggle.
 *
 * Evaluation order (precondition > user-explicit > server-default):
 *   [A] If server opt-in fails, return false. No client setting can override
 *       this hard precondition — hand-editing autoDreamEnabled:true into
 *       settings.json still yields false unless the server opted the user in.
 *   [B] If the user setting `autoDreamEnabled` is explicitly true/false (not
 *       undefined), honor it verbatim. This is what the /memory "Auto-dream"
 *       row writes; an explicit user choice beats the cohort default.
 *   [C] Otherwise fall to the cohort default: tengu_onyx_plover.enabled === true.
 *   [D] Otherwise team-memory-server-active implies on.
 *
 * Called by autoDream.ts's isGateOpen (C2p @455408), which adds the
 * kairos/remote/auto-memory master checks before this toggle.
 */
// 2.1.183: isAutoDreamEnabled = T4t @cli_inner_pretty.js:454528
export function isAutoDreamEnabled(): boolean {
  if (!isAutoDreamServerSideOptIn()) return false // [A] hard precondition @454529
  const setting = getInitialSettings().autoDreamEnabled
  if (setting !== undefined) return setting // [B] explicit user toggle wins @454530-454531
  if (getDreamConfig()?.enabled === true) return true // [C] cohort default-on @454532
  return isTeamMemServerActive() // [D] team-server default-on @454533
}
