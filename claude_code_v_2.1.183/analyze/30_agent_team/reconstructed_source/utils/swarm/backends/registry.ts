/**
 * Backend registry for the Agent Team / "swarm" subsystem (v2.1.183).
 *
 * Decides HOW a teammate runs — in-process (an async task in the leader's own
 * Node process) vs. cross-process (a pane backend: tmux or iTerm2) — and owns
 * the lazily-constructed, process-lifetime-cached backend instances.
 *
 * This whole abstraction is CARRYOVER from v2.1.156 (only re-mangled); the
 * v2.1.178 tmux fix lives inside TmuxBackend, not here. The one structural
 * shape difference from the v2.1.88 ancestor: in v2.1.183 the registry's mutable
 * state lives in a plain object produced by a factory (`createBackendRegistry`,
 * J5a) with module-level functions taking `registry = globalBackendRegistry`
 * (_F) as a defaulted last arg, rather than module-level `let` variables.
 * Behaviorally identical; we reproduce the factory-state shape faithfully.
 *
 * The async resolver `detectAndGetBackend` (eLe) lives in the sibling
 * detection.ts (it is the "detection" surface, and the already-reconstructed
 * spawnTeammate.ts imports it from there as `detectPaneBackend`). It calls back
 * into the constructors + `ensureBackendsRegistered` exported here.
 *
 * ── DELIBERATE RUNTIME-ONLY IMPORT CYCLE (registry.ts <-> detection.ts) ──────
 * This is a genuine value-level cycle, NOT a cycle-free split:
 *   - registry.ts imports `detectAndGetBackend` (value), `isInITerm2`,
 *     `isInsideTmuxSync` (values) from ./detection.js.
 *   - detection.ts imports `createITermBackend`, `createTmuxBackend`,
 *     `ensureBackendsRegistered`, `globalBackendRegistry` (values) from ./registry.js.
 * It is SAFE under ESM live-bindings because BOTH sides reference the other
 * module's imports ONLY from inside function bodies (here: isInsideTmuxSync/
 * isInITerm2 inside `isInProcessEnabled`, detectAndGetBackend inside
 * `getPaneBackendExecutor`) — never at module top-level eval. By the time any of
 * those functions runs, both modules are fully evaluated and the hoisted function
 * bindings (and the `globalBackendRegistry` const used only as a default-arg, i.e.
 * call-time) resolve correctly. No top-level use exists in either file.
 *
 * 2.1.183 regions covered:
 *   - cli_inner_pretty.js:422279-422289 (J5a factory), 422291-422298 (u3n =
 *     ensureBackendsRegistered), 422299-422304 (Fdo/jdo register), 422305-422313
 *     (c3n/Q5a construct), 422405-422411 (e3t getBackendByType), 422413-422418
 *     (fDp/Gdo cached getters), 422419-422421 (Wdo markInProcessFallback),
 *     422422-422424 (mDp getTeammateMode), 422425-422439 (rWe isInProcessEnabled),
 *     422440-422442 (ADp getResolvedTeammateMode), 422443-422466 (Z5a/gDp/hDp/qdo
 *     executor + reset), 422467 (var _F), 422478 (_F = J5a()), export map @422262.
 * 2.1.88 ancestor: utils/swarm/backends/registry.ts (the isInProcessEnabled
 *   decision tree + its debug strings, markInProcessFallback, getTeammateExecutor
 *   / getInProcessBackend / getPaneBackendExecutor, the register/create-backend
 *   pair, ensureBackendsRegistered). NOTE 88 kept these as module-level lets;
 *   183 uses the J5a factory-state object.
 * scaffold: 30_agent_team/spawn_backends_and_tmux_fix.md §1.1 (backendRegistry
 *   _F @422467, isInProcessEnabled rWe @422425, markInProcessFallback Wdo
 *   @422419); _conventions.md registry.
 * cross-val: re-read rWe @422425 (xr() -> true; "in-process" -> true; "tmux" ->
 *   false; else fallback bit or `!insideTmux && !inITerm2`), Wdo @422419
 *   (inProcessFallbackActive = true), J5a @422279, u3n @422291, _F @422467/478 in
 *   the 183 bundle. Export names matched against the already-reconstructed
 *   spawnTeammate.ts (isInProcessEnabled / getTeammateMode / markInProcessFallback).
 */

import { getIsNonInteractiveSession } from '../../../bootstrap/state.js'
import { logForDebugging } from '../../debug.js'
import {
  isInITerm2,
  isInsideTmuxSync,
} from './detection.js'
import { createInProcessBackend } from './InProcessBackend.js'
import { createPaneBackendExecutor } from './PaneBackendExecutor.js'
import { detectAndGetBackend } from './detection.js'
import { getTeammateModeFromSnapshot } from './teammateModeSnapshot.js'
import type { TeammateMode } from './teammateModeSnapshot.js'
import type {
  BackendDetectionResult,
  BackendRegistryState,
  PaneBackend,
  PaneBackendType,
} from './types.js'

// Re-export the registry-state type so detection.ts can import it from here too.
export type { BackendDetectionResult, BackendRegistryState } from './types.js'

/**
 * The cross-backend teammate executor. Its full shape (spawn/sendMessage/
 * terminate/kill/isActive) is defined with the spawner in the 183 tree, not in
 * the trimmed backends/types.ts; the registry only stores + returns it opaquely,
 * mirroring types.ts which types the executor caches as `unknown`.
 */
type TeammateExecutor = unknown

// 2.1.183: createBackendRegistry = J5a @cli_inner_pretty.js:422279
/**
 * Construct a fresh registry-state object. The fields are the v2.1.88 registry's
 * module-level caches, hoisted into a single record so the registry can be
 * instanced (used by `globalBackendRegistry`; tests can make their own).
 */
export function createBackendRegistry(): BackendRegistryState {
  return {
    cachedBackend: null,
    cachedDetectionResult: null,
    backendsRegistered: false,
    cachedInProcessBackend: null,
    cachedPaneBackendExecutor: null,
    inProcessFallbackActive: false,
    TmuxBackendClass: null,
    ITermBackendClass: null,
  }
}

// 2.1.183: globalBackendRegistry = _F @cli_inner_pretty.js:422467 (assigned = J5a() @422478)
/**
 * The process-wide singleton registry state. Every exported function defaults to
 * operating on this instance.
 */
export const globalBackendRegistry: BackendRegistryState = createBackendRegistry()

// 2.1.183: ensureBackendsRegistered = u3n @cli_inner_pretty.js:422291
/**
 * Dynamically import the backend implementations so {@link getBackendByType} and
 * {@link detectAndGetBackend} can construct them. Unlike detection, this never
 * spawns subprocesses and never throws — the lightweight option when you only
 * need class registration (e.g. killing a pane by its stored backendType). The
 * imported modules self-register their classes onto the global registry; we then
 * copy those class refs onto the passed-in registry.
 */
export async function ensureBackendsRegistered(
  registry: BackendRegistryState = globalBackendRegistry,
): Promise<void> {
  if (registry.backendsRegistered) return // @422292
  await import('./TmuxBackend.js')
  await import('./ITermBackend.js')
  registry.TmuxBackendClass = globalBackendRegistry.TmuxBackendClass // @422295
  registry.ITermBackendClass = globalBackendRegistry.ITermBackendClass
  registry.backendsRegistered = true
}

// 2.1.183: registerTmuxBackend = Fdo @cli_inner_pretty.js:422299
/**
 * Register the TmuxBackend class. Called by TmuxBackend.ts at import time to
 * avoid a circular dependency.
 */
export function registerTmuxBackend(
  backendClass: new () => PaneBackend,
  registry: BackendRegistryState = globalBackendRegistry,
): void {
  registry.TmuxBackendClass = backendClass // @422300
}

// 2.1.183: registerITermBackend = jdo @cli_inner_pretty.js:422302
/**
 * Register the ITermBackend class. Called by ITermBackend.ts at import time.
 */
export function registerITermBackend(
  backendClass: new () => PaneBackend,
  registry: BackendRegistryState = globalBackendRegistry,
): void {
  logForDebugging(
    `[registry] registerITermBackend called, class=${backendClass?.name || 'undefined'}`,
  )
  registry.ITermBackendClass = backendClass // @422303
}

// 2.1.183: createTmuxBackend = c3n @cli_inner_pretty.js:422305 (body @422306)
/**
 * Instantiate the registered TmuxBackend class. Throws if TmuxBackend.ts hasn't
 * been imported (which registers it).
 */
// NOTE: bundle `function c3n(e)` takes the registry as a REQUIRED arg (no default
// to _F); every caller (e3t/eLe/Z5a paths) passes it explicitly. @422305
export function createTmuxBackend(registry: BackendRegistryState): PaneBackend {
  if (!registry.TmuxBackendClass) {
    throw new Error(
      'TmuxBackend not registered. Import TmuxBackend.ts before using the registry.',
    )
  }
  return new registry.TmuxBackendClass()
}

// 2.1.183: createITermBackend = Q5a @cli_inner_pretty.js:422309
/**
 * Instantiate the registered ITermBackend class. Throws if ITermBackend.ts
 * hasn't been imported.
 */
// NOTE: bundle `function Q5a(e)` takes the registry as a REQUIRED arg (no default
// to _F); every caller passes it explicitly. @422309
export function createITermBackend(registry: BackendRegistryState): PaneBackend {
  if (!registry.ITermBackendClass) {
    throw new Error(
      'ITermBackend not registered. Import ITermBackend.ts before using the registry.',
    )
  }
  return new registry.ITermBackendClass()
}

// 2.1.183: getBackendByType = e3t @cli_inner_pretty.js:422405
/**
 * Construct a backend by explicit type (testing / explicit preference). Does NOT
 * detect or cache.
 */
export function getBackendByType(
  type: PaneBackendType,
  registry: BackendRegistryState = globalBackendRegistry,
): PaneBackend {
  switch (type) {
    case 'tmux':
      return createTmuxBackend(registry)
    case 'iterm2':
      return createITermBackend(registry)
  }
}

// 2.1.183: getCachedBackend = fDp @cli_inner_pretty.js:422413
/** The currently-cached backend, or null if detection hasn't run. */
export function getCachedBackend(
  registry: BackendRegistryState = globalBackendRegistry,
): PaneBackend | null {
  return registry.cachedBackend
}

// 2.1.183: getCachedDetectionResult = Gdo @cli_inner_pretty.js:422416
/**
 * The cached detection result, or null if detection hasn't run. `isNative` tells
 * UI whether teammates are visible in native panes.
 */
export function getCachedDetectionResult(
  registry: BackendRegistryState = globalBackendRegistry,
): BackendDetectionResult | null {
  return registry.cachedDetectionResult
}

// 2.1.183: markInProcessFallback = Wdo @cli_inner_pretty.js:422419
/**
 * Record that spawn fell back to in-process because no pane backend was
 * available. After this, {@link isInProcessEnabled} returns true (in 'auto'
 * mode) so the UI reflects reality and subsequent spawns short-circuit — the
 * environment won't change mid-session.
 *
 * (Exported as `markInProcessFallback` to match the 183 export map
 * @cli_inner_pretty.js:422266 `markInProcessFallback: () => Wdo`; the 88 ancestor
 * used the same name.)
 */
export function markInProcessFallback(
  registry: BackendRegistryState = globalBackendRegistry,
): void {
  logForDebugging('[BackendRegistry] Marking in-process fallback as active')
  registry.inProcessFallbackActive = true // @422420
}

// 2.1.183: getTeammateMode = mDp @cli_inner_pretty.js:422422 (delegates to Aje)
/**
 * The session's teammate mode (the startup snapshot). Thin wrapper around the
 * snapshot module's getTeammateModeFromSnapshot (Aje), so callers (here +
 * spawnTeammate.ts) don't depend on the snapshot module's exact export name.
 */
export function getTeammateMode(): TeammateMode {
  return getTeammateModeFromSnapshot()
}

// 2.1.183: isInProcessEnabled = rWe @cli_inner_pretty.js:422425
/**
 * Whether teammates should run in-process (vs. a pane backend).
 *
 * Decision tree (read directly from rWe @422426-422438):
 *   - Non-interactive session (`-p` mode, xr() => true)  -> in-process.  (@422426)
 *   - mode === 'in-process'                              -> in-process.  (@422429)
 *   - mode === 'tmux'                                    -> pane backend. (@422430)
 *   - mode === 'auto' (default):
 *       * sticky fallback bit set (a prior spawn fell back) -> in-process. (@422432)
 *         (scoped to 'auto' only, so a mid-session switch to explicit
 *          'tmux' still takes effect.)
 *       * else: in-process iff NOT inside tmux AND NOT inside iTerm2.     (@422434)
 */
export function isInProcessEnabled(
  registry: BackendRegistryState = globalBackendRegistry,
): boolean {
  // Force in-process for non-interactive (-p) sessions: pane teammates make no
  // sense without a terminal UI. @422426 (xr() === !STATE.isInteractive)
  if (getIsNonInteractiveSession()) {
    logForDebugging(
      '[BackendRegistry] isInProcessEnabled: true (non-interactive session)',
    )
    return true
  }

  const mode = getTeammateMode() // @422427
  let enabled: boolean
  if (mode === 'in-process') {
    enabled = true // @422429
  } else if (mode === 'tmux') {
    enabled = false // @422430
  } else {
    // 'auto' mode. @422431
    if (registry.inProcessFallbackActive) {
      // @422432
      logForDebugging(
        '[BackendRegistry] isInProcessEnabled: true (fallback after pane backend unavailable)',
      )
      return true
    }
    const insideTmux = isInsideTmuxSync() // @422434
    const inITerm2 = isInITerm2() // @422435
    enabled = !insideTmux && !inITerm2 // @422436
  }

  logForDebugging(
    `[BackendRegistry] isInProcessEnabled: ${enabled} (mode=${mode}, insideTmux=${isInsideTmuxSync()}, inITerm2=${isInITerm2()})`,
  )
  return enabled
}

// 2.1.183: getResolvedTeammateMode = ADp @cli_inner_pretty.js:422440
/**
 * What 'auto' actually resolves to for this environment: 'in-process' | 'tmux'.
 */
export function getResolvedTeammateMode(
  registry: BackendRegistryState = globalBackendRegistry,
): 'in-process' | 'tmux' {
  return isInProcessEnabled(registry) ? 'in-process' : 'tmux'
}

// 2.1.183: getInProcessBackend = Z5a @cli_inner_pretty.js:422443
/**
 * The InProcessBackend executor, created + cached on first call.
 */
export function getInProcessBackend(
  registry: BackendRegistryState = globalBackendRegistry,
): TeammateExecutor {
  if (!registry.cachedInProcessBackend) {
    registry.cachedInProcessBackend = createInProcessBackend()
  }
  return registry.cachedInProcessBackend
}

// 2.1.183: getTeammateExecutor = gDp @cli_inner_pretty.js:422447
/**
 * A unified {@link TeammateExecutor} for spawning teammates: the InProcessBackend
 * when `preferInProcess` is set and in-process is enabled, otherwise the pane
 * backend executor wrapping the detected pane backend.
 */
export async function getTeammateExecutor(
  preferInProcess: boolean = false,
  registry: BackendRegistryState = globalBackendRegistry,
): Promise<TeammateExecutor> {
  if (preferInProcess && isInProcessEnabled(registry)) {
    logForDebugging('[BackendRegistry] Using in-process executor')
    return getInProcessBackend(registry)
  }
  logForDebugging('[BackendRegistry] Using pane backend executor')
  return getPaneBackendExecutor(registry)
}

// 2.1.183: getPaneBackendExecutor = hDp @cli_inner_pretty.js:422451
/**
 * The PaneBackendExecutor, created + cached on first call; runs detection to
 * pick the pane backend it wraps.
 */
// NOTE: bundle `async function hDp(e)` takes the registry as a REQUIRED arg (no
// default to _F); its only caller getTeammateExecutor (gDp) passes it. @422451
async function getPaneBackendExecutor(
  registry: BackendRegistryState,
): Promise<TeammateExecutor> {
  if (!registry.cachedPaneBackendExecutor) {
    const detection = await detectAndGetBackend(registry)
    registry.cachedPaneBackendExecutor = createPaneBackendExecutor(
      detection.backend,
    )
    logForDebugging(
      `[BackendRegistry] Created PaneBackendExecutor wrapping ${detection.backend.type}`,
    )
  }
  return registry.cachedPaneBackendExecutor
}

// 2.1.183: resetBackendDetection = qdo @cli_inner_pretty.js:422459
/** Clears all caches + the fallback bit. Test helper. */
export function resetBackendDetection(
  registry: BackendRegistryState = globalBackendRegistry,
): void {
  registry.cachedBackend = null
  registry.cachedDetectionResult = null
  registry.cachedInProcessBackend = null
  registry.cachedPaneBackendExecutor = null
  registry.backendsRegistered = false
  registry.inProcessFallbackActive = false
}

// Mapping (this file):
//   J5a->createBackendRegistry, _F->globalBackendRegistry, u3n->ensureBackendsRegistered,
//   Fdo->registerTmuxBackend, jdo->registerITermBackend, c3n->createTmuxBackend,
//   Q5a->createITermBackend, e3t->getBackendByType, fDp->getCachedBackend,
//   Gdo->getCachedDetectionResult, Wdo->markInProcessFallback, mDp->getTeammateMode,
//   rWe->isInProcessEnabled, ADp->getResolvedTeammateMode, Z5a->getInProcessBackend,
//   gDp->getTeammateExecutor, hDp->getPaneBackendExecutor, qdo->resetBackendDetection,
//   xr->getIsNonInteractiveSession, k5a->createInProcessBackend,
//   j5a->createPaneBackendExecutor, Aje->getTeammateModeFromSnapshot,
//   eLe->detectAndGetBackend (in detection.ts)
