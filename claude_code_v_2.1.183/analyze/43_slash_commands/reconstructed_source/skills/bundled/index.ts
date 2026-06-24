// =============================================================================
// Bundled-skill REGISTRY — initBundledSkills (Claude Code v2.1.183)
// =============================================================================
// v2.1.183 regions covered:
//   - initBundledSkills = FJn @660991-661026 (idempotent via IJl flag @661027)
//   - registerSimplifySkill = OKl @647978 (ap({}) call @647979; called unconditionally @661006)
//   - registerBatchSkill    = pzl @637828 (ap({}) call @637829; called unconditionally @661007)
//   - registerLoopSkill     = the require()-style lazy import @661011-661012;
//       loop is registered UNCONDITIONALLY — its own isEnabled (= IB) gates visibility.
//   - loop gates: isDynamicLoopEnabled = jAe @221035 (tengu_kairos_loop_dynamic, default false)
//                 isLoopEnabled        = IB  @221593 (tengu_kairos_cron, default true unless
//                                         CLAUDE_CODE_DISABLE_CRON), via gate helpers ct@146595 / yK@146611
// v2.1.88 ancestor / convention path:
//   src/skills/bundled/index.ts — initBundledSkills() + feature()-gated requires.
//   Ported forward; the conditional/eager split is reproduced from the 2.1.183 bundle.
// 2.1.156->2.1.183 delta (registry):
//   - 2.1.88 gated /loop behind feature('AGENT_TRIGGERS'); by 2.1.183 /loop is registered
//     UNCONDITIONALLY and visibility is decided lazily per-invocation by isEnabled = IB
//     (isLoopEnabled). simplify and batch are likewise unconditional (no feature gate).
//   - The dynamic-pacing /loop variant is selected at prompt-build time by isDynamicLoopEnabled
//     (jAe) — a runtime gate, not a registration gate; it does not affect whether /loop registers.
// Cross-validation: FJn@660991 calls OKl()@661006, pzl()@661007 directly and lazily binds
//   { registerLoopSkill } from a deferred module then calls it @661012 with no guard; the only
//   guards in FJn are env-var skips for unrelated skills (claude-api / claude-code) and bR().
// =============================================================================

import { registerBatchSkill } from './batch.js'      // 2.1.183: pzl @637828
import { registerSimplifySkill } from './simplify.js' // 2.1.183: OKl @647978

// 2.1.183: idempotency latch = IJl @661027 (init runs at most once per process)
let bundledSkillsInitialized = false

// 2.1.183: initBundledSkills = FJn @660991
/**
 * Initialize the bundled skills that ship with the CLI. Idempotent.
 *
 * The three commands reconstructed in this module — /simplify, /batch, /loop —
 * are all registered unconditionally here:
 *   - /simplify and /batch have no feature gate.
 *   - /loop is registered unconditionally too; its `isEnabled` callback
 *     (= isLoopEnabled / IB) decides visibility lazily per invocation, the same
 *     lazy pattern the cron tools use. The dynamic-pacing branch of /loop is a
 *     prompt-time decision (isDynamicLoopEnabled / jAe), not a registration gate.
 *
 * (Other bundled skills omitted here for focus; in the bundle FJn also wires up
 * verify/debug/stuck/remember/skillify/run/etc. and a few env-gated extras.)
 */
export function initBundledSkills(): void {
  if (bundledSkillsInitialized) return // @660992
  bundledSkillsInitialized = true

  // ... other bundled skills (verify, debug, stuck, remember, skillify, ...) ...

  registerSimplifySkill() // OKl() @661006 — no gate
  registerBatchSkill()    // pzl() @661007 — no gate

  // 2.1.183 @661011-661012: /loop is loaded from a deferred module and registered
  // unconditionally. Its visibility is gated lazily by isEnabled = isLoopEnabled (IB).
  // (The bundle uses a require()-style deferred binding; modeled here as a dynamic
  // import for readability — the registration is still unconditional.)
  {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { registerLoopSkill } = require('./loop.js') // 2.1.183: _1f @649251 (ap({}) call @649252)
    registerLoopSkill()
  }

  // ... env-gated extras (scheduleRemoteAgents, claudeApi, runSkill, ...) ...
}
