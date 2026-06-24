/**
 * Memory Sync Watcher (team + user multistore lanes)
 *
 * Watches the memory directory for changes and triggers a debounced push to the
 * memory-service when files are modified. Performs an initial pull on startup,
 * then starts a directory-level chokidar watch so first-time writes to a fresh
 * repo get picked up.
 *
 * ── v2.1.172 redesign (the headline this file restores) ──────────────────────
 * v2.1.88's ancestor was a SINGLE team-only debounced pusher with module-level
 * scalar state (one `syncState`, one `debounceTimer`, etc.). v2.1.183 turned it
 * into a TWO-LANE multistore orchestrator:
 *   - Module state is now per-scope: `memWatchState = { team, user }` (each a
 *     fresh `makeWatchLaneState()` record).
 *   - `startMemoryWatcherCore` (uFp) parses `CLAUDE_MEMORY_STORES` once, then
 *     SPLITS the parsed stores by their new `scope` field into a team sublist
 *     and a user sublist, building a separate multistore object for each
 *     (`teamMultistore`/`rX`, `userMultistore`/`$W`) via `buildMultistore` (lAo).
 *   - A user-scope store now drives a real personal sync lane and emits the
 *     NEW `tengu_personal_mem_sync_started` event.
 * The deep multistore transport it CALLS (buildMultistore=lAo, the store client
 * m_n, push pAo, pull sAo) is carryover plumbing reconstructed at contract level
 * in ./index.js — see team_memory_stores_recall.md §5 and the v2.1.156 baseline.
 *
 * 2.1.183 regions: cli_inner_pretty.js
 *   - export surface (uGn): 448961-448974
 *   - lane-state factory makeWatchLaneState=aGn @448975
 *   - module state var-block oFp/sFp/iFp/Dye/c4t/Rj/aFp/Lb/rX/$W/VXa @449397-449409
 *     + loader init (Lb={team,user}, VXa={...}) @449427-449429
 *   - scope->lane resolver fAo @449002, schedulePush lGn @449080
 *   - debounced push lFp @449092, executePush YXa @449022, suppress GXa @449011
 *   - start watcher AAo @449153 (chokidar), startMemoryWatcherCore uFp @449203
 *   - exported start cFp @449196, initial-pull-per-lane WXa @449277
 *   - notifyMemoryWrite cGn @449326, stop QXa @449331, resync timer JXa @449109,
 *     armResyncTimer u4t @449127, laneActive mAo @449148
 *   - isUnlinkRecoverable zXa @448987, isPermanentFailure KXa @448990
 * 2.1.88 ancestor: services/teamMemorySync/watcher.ts (single team lane)
 * 2.1.156 before: startMemoryWatcher LU_@[v2.1.156]438392 (team-only lane, no scope)
 * scaffold: team_memory_stores_recall.md §5 (watcher scope-split delta)
 * cross-val: re-read uFp@449203 (scope-split), KXa@448990 (no_repo→server_unavailable
 *   in the permanent-failure set), tengu_personal_mem_sync_started@449262 (user multistore
 *   lane; the single-store user lane only emits the ok-telemetry
 *   personal_memory_sync_watcher_start, no stats event),
 *   tengu_team_mem_sync_started{multistore:true,stores}@449259, lje@289759 (tengu_marble_lark).
 */

// NOTE: the 88 ancestor imported `feature` (bun:bundle) for feature('TEAMMEM')
// and `stat` (fs/promises) for the fs.watch ENOENT disambiguation. 183 inlines
// the enabled branch behind isWatcherEligible and uses chokidar's distinct
// add/change/unlink events, so neither is imported here.
import { FSWatcher, watch } from 'chokidar'
import { mkdir } from 'fs/promises'
import { relative, sep } from 'path'
import { getAutoMemBaseDir } from '../../memdir/paths.js'
import {
  getTeamMemPath,
  isTeamMemoryEnabled,
  isUserStoreEnabled,
  parseMemoryStoresEnv,
  type MemoryStore,
} from '../../memdir/teamMemPaths.js'
import { registerCleanup } from '../../utils/cleanupRegistry.js'
import { logForDebugging } from '../../utils/debug.js'
import { errorMessage } from '../../utils/errors.js'
import { getGithubRepo } from '../../utils/git.js'
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  logEvent,
} from '../analytics/index.js'
import {
  buildMultistore,
  makeMultistoreBackends,
  makeSingleStoreSyncState,
  multistorePush,
  multistorePull,
  pushMemory,
  type MultistoreState,
  type SyncState,
} from './index.js'
import type { TeamMemorySyncPushResult } from './types.js'

// ─── Tunables ────────────────────────────────────────────────
// 2.1.183: DEBOUNCE_MS = oFp = 2000 @449399 ; chokidar poll interval iFp = 2000 @449401
// (declared together in the module var-block @449397-449409)
const DEBOUNCE_MS = 2000 // Wait 2s after last change before pushing
const MIN_RESYNC_DELAY_MS = 1000 // 2.1.183: aFp = 1000 @449405 (resync-timer floor)

type Scope = 'team' | 'user'

// ─── Per-lane watcher state ──────────────────────────────────
// DELTA v2.1.172: the 88 ancestor kept these as module-level scalars (one team
// lane). 183 holds one record PER scope inside `memWatchState`. (Lb declared
// @449406, initialized `{team:aGn(),user:aGn()}` in the module loader @449428;
// factory aGn @448975-448986; `changeSeq` is new — used to detect edits that
// race a push so the push doesn't wrongly clear hasPendingChanges.)
// 2.1.183: makeWatchLaneState = aGn @cli_inner_pretty.js:448975
interface WatchLaneState {
  syncState: SyncState | null
  debounceTimer: ReturnType<typeof setTimeout> | null
  pushInProgress: boolean
  hasPendingChanges: boolean
  changeSeq: number
  currentPushPromise: Promise<void> | null
  // Set after a push fails for a reason that can't self-heal on retry.
  // Prevents watch events from other sessions' writes to the shared dir driving
  // an infinite retry loop. Cleared on unlink for the recoverable reasons in
  // UNLINK_RECOVERABLE_REASONS_BY_SCOPE; otherwise persists until session restart.
  pushSuppressedReason: string | null
  lastSyncCompletedAt: number | null
}

function makeWatchLaneState(): WatchLaneState {
  return {
    syncState: null,
    debounceTimer: null,
    pushInProgress: false,
    hasPendingChanges: false,
    changeSeq: 0,
    currentPushPromise: null,
    pushSuppressedReason: null,
    lastSyncCompletedAt: null,
  }
}

// 2.1.183: memWatchState = Lb @cli_inner_pretty.js:449406 (decl) / init @449428
const memWatchState: Record<Scope, WatchLaneState> = {
  team: makeWatchLaneState(),
  user: makeWatchLaneState(),
}

// Multistore objects, one per scope, built from the scope-filtered store lists.
// Non-null ⇒ that lane is driven by the multistore transport rather than the
// single-store `syncState`.
// 2.1.183: teamMultistore = rX @449407 ; userMultistore = $W @449408 (both null at decl)
let teamMultistore: MultistoreState | null = null
let userMultistore: MultistoreState | null = null

// Shared directory watcher (covers both lanes — one fs watch over the memory
// base dir, events routed to a lane by `resolveLaneForPath`).
// 2.1.183: watcher = Dye @449402 ; resync timer = Rj @449404 ; watcherStarted = c4t @449403
let watcher: FSWatcher | null = null
let resyncTimer: ReturnType<typeof setTimeout> | null = null
let watcherStarted = false

/**
 * Suppression reasons that an unlink (file deletion) can RECOVER from, by scope.
 * For team: deleting files is the recovery action for the too-many-entries case,
 * so 'team_memory_too_many_entries' / 'http_413' clear suppression on unlink.
 * For user: nothing is unlink-recoverable.
 * 2.1.183: UNLINK_RECOVERABLE_REASONS_BY_SCOPE = VXa @cli_inner_pretty.js:449409 (decl) / init @449429
 */
export const UNLINK_RECOVERABLE_REASONS_BY_SCOPE: Record<Scope, Set<string>> = {
  team: new Set(['team_memory_too_many_entries', 'http_413']),
  user: new Set(),
}

function isUnlinkRecoverable(scope: Scope, reason: string): boolean {
  // 2.1.183: zXa @cli_inner_pretty.js:448987
  return UNLINK_RECOVERABLE_REASONS_BY_SCOPE[scope].has(reason)
}

/**
 * Permanent = retry without user action will fail the same way.
 * - no_oauth / server_unavailable: pre-request client checks, no status code
 * - 4xx except 409/429: client error (404 missing repo, 413 too many entries,
 *   403 permission). 409 is a transient conflict; 429 is a rate limit.
 *
 * DELTA v2.1.172: the 88 ancestor's second permanent errorType was 'no_repo';
 * 183 replaced it with 'server_unavailable' (the early github.com check moved
 * into the start path, so 'no_repo' no longer reaches a push result). @448991
 * 2.1.183: isPermanentFailure = KXa @cli_inner_pretty.js:448990
 */
export function isPermanentFailure(r: TeamMemorySyncPushResult): boolean {
  if (r.errorType === 'no_oauth' || r.errorType === 'server_unavailable')
    return true
  if (
    r.httpStatus !== undefined &&
    r.httpStatus >= 400 &&
    r.httpStatus < 500 &&
    r.httpStatus !== 409 &&
    r.httpStatus !== 429
  ) {
    return true
  }
  return false
}

/**
 * Map an absolute path that fired a watch event to its sync lane.
 * The memory base dir holds both `team/…` (team lane) and the private auto-memory
 * tree (user lane). `team/` prefix ⇒ team; an auto-managed memory file outside
 * `team/` ⇒ user; anything else (or escaping the base dir) ⇒ ignore.
 * 2.1.183: resolveLaneForPath = fAo @cli_inner_pretty.js:449002
 */
function resolveLaneForPath(absPath: string): Scope | null {
  const base = getAutoMemBaseDir()
  const rel = relative(base, absPath).replaceAll(sep, '/')
  if (rel === '' || rel.startsWith('..')) return null
  const segments = rel.split('/')
  if (normalizeForFsCompare(segments[0]) === 'team') return 'team'
  // @449007: `if (Bge(n)) return null`. Bge (isExcludedMemorySubtree) is TRUE for
  // the non-synced personal subtrees (team/logs/sessions/proposals) and dotfiles —
  // those have no user lane. A plain user `.md` makes Bge false → user lane.
  if (isExcludedMemorySubtree(rel)) return null
  return 'user'
}

/**
 * Mark this lane suppressed for the rest of the session. For team, also emit
 * tengu_team_mem_push_suppressed. A `(recoverable via file deletion)` note is
 * logged when the reason is unlink-recoverable for this scope.
 * 2.1.183: suppressLane = GXa @cli_inner_pretty.js:449011
 */
function suppressLane(
  scope: Scope,
  reason: string,
  extra?: Record<string, unknown>,
): void {
  const lane = memWatchState[scope]
  if (lane.pushSuppressedReason !== null) return
  lane.pushSuppressedReason = reason
  const note = isUnlinkRecoverable(scope, reason)
    ? ' (recoverable via file deletion)'
    : ''
  logForDebugging(
    `memory-watcher[${scope}]: suppressing retry for the rest of this session (${reason})${note}`,
    { level: 'warn' },
  )
  if (scope === 'team') {
    logEvent('tengu_team_mem_push_suppressed', {
      reason: reason as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      ...extra,
    })
  }
}

/**
 * Execute the push for one lane and track its lifecycle.
 *
 * If the lane has a multistore (`teamMultistore`/`userMultistore`), push via the
 * multistore transport (`multistorePush`/pAo); otherwise fall back to the
 * single-store `syncState` path (`pushMemory`/iAo — the carryover single-store
 * personal/team push). `changeSeq` is captured before the push so a write that
 * lands DURING the push doesn't get its pending flag cleared by this push's
 * success — it stays pending and the debounce re-arms.
 * 2.1.183: executePush = YXa @cli_inner_pretty.js:449022
 */
async function executePush(scope: Scope, trigger = 'watch'): Promise<void> {
  const lane = memWatchState[scope]
  const multistore = scope === 'team' ? teamMultistore : userMultistore

  // ── multistore lane ──
  if (multistore) {
    lane.pushInProgress = true
    const seqBeforePush = lane.changeSeq
    try {
      const stores = multistore.stores
      const alreadySuppressed = new Set(
        stores
          .filter(s => s.suppressedReason !== null)
          .map(s => s.mountName),
      )
      const result = await multistorePush(multistore, trigger) // @449031 pAo
      const anyFailed = Object.values(result.pushes).some(p => !p.success)
      if (!anyFailed && lane.changeSeq === seqBeforePush) {
        lane.hasPendingChanges = false
      }
      // Per-store suppression telemetry (team only).
      if (scope === 'team') {
        for (const s of stores) {
          if (s.suppressedReason !== null && !alreadySuppressed.has(s.mountName)) {
            logEvent('tengu_team_mem_push_suppressed', {
              reason:
                s.suppressedReason as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
              multistore: true,
              mount: s.mountName,
            })
          }
        }
      }
      // If EVERY store in the lane is suppressed, suppress the whole lane.
      if (stores.length > 0 && stores.every(s => s.suppressedReason !== null)) {
        suppressLane(scope, stores[0].suppressedReason as string, {
          multistore: true,
          stores: stores.length,
        })
      }
    } catch (e) {
      logForDebugging(
        `memory-watcher[${scope}]: multi-store sync error: ${errorMessage(e)}`,
        { level: 'warn' },
      )
    } finally {
      lane.lastSyncCompletedAt = Date.now()
      lane.pushInProgress = false
      lane.currentPushPromise = null
      armResyncTimer()
    }
    return
  }

  // ── single-store lane (carryover personal/team single-store path) ──
  if (!lane.syncState) return
  lane.pushInProgress = true
  const seqBeforePush = lane.changeSeq
  try {
    const result = await pushMemory(lane.syncState) // @449051 iAo
    if (result.success) {
      // For the user lane, only clear pending if no write raced the push.
      if (scope !== 'user' || lane.changeSeq === seqBeforePush) {
        lane.hasPendingChanges = false
      }
    }
    if (result.success && result.filesUploaded > 0) {
      logForDebugging(
        `memory-watcher[${scope}]: pushed ${result.filesUploaded} files`,
        { level: 'info' },
      )
    } else if (!result.success) {
      logForDebugging(
        `memory-watcher[${scope}]: push failed: ${result.error}`,
        { level: 'warn' },
      )
      if (isPermanentFailure(result)) {
        // ACL-denied gets a human-facing hint before suppression. @449059
        if (
          result.serverErrorCode === 'team_memory_group_acl_denied' ||
          result.serverErrorCode === 'team_memory_group_acl_unconfigured'
        ) {
          logForDebugging(
            `memory-watcher[${scope}]: ${result.serverMessage || 'Team memory is restricted to specific groups for your organization.'} Contact your administrator for access.`,
            { level: 'warn' },
          )
        }
        suppressLane(
          scope,
          result.serverErrorCode ??
            (result.httpStatus !== undefined
              ? `http_${result.httpStatus}`
              : (result.errorType ?? 'unknown')),
          {
            ...(result.httpStatus && { status: result.httpStatus }),
            ...(result.serverMessage !== undefined && {
              server_message: result.serverMessage,
            }),
            ...(result.serverErrorCode !== undefined && {
              server_error_code: result.serverErrorCode,
            }),
            ...(result.serverErrorType !== undefined && {
              server_error_type: result.serverErrorType,
            }),
          },
        )
      }
    }
  } catch (e) {
    logForDebugging(
      `memory-watcher[${scope}]: push error: ${errorMessage(e)}`,
      { level: 'warn' },
    )
  } finally {
    lane.pushInProgress = false
    lane.currentPushPromise = null
  }
}

/**
 * Debounced push for one lane: waits for writes to settle, then pushes once.
 * Bumps `changeSeq` so a push in flight can tell a write raced it.
 * 2.1.183: schedulePush = lGn @cli_inner_pretty.js:449080
 */
function schedulePush(scope: Scope): void {
  const lane = memWatchState[scope]
  if (lane.pushSuppressedReason !== null) return
  lane.hasPendingChanges = true
  lane.changeSeq++
  if (lane.debounceTimer) clearTimeout(lane.debounceTimer)
  lane.debounceTimer = setTimeout(runDebouncedPush, DEBOUNCE_MS, scope)
}

/**
 * Fired by the debounce timer. Handles the user lane's mid-session
 * enable/disable: if personal sync was turned off, pause (reversibly); if it
 * came back on, un-abort. Then push unless a push is already running (re-arm).
 * 2.1.183: runDebouncedPush = lFp @cli_inner_pretty.js:449092
 */
function runDebouncedPush(scope: Scope): void {
  const lane = memWatchState[scope]
  // @449094: user lane disabled mid-session → pause (reversible).
  if (scope === 'user' && !isUserLaneEligible()) {
    if (lane.debounceTimer) {
      clearTimeout(lane.debounceTimer)
      lane.debounceTimer = null
    }
    if (lane.syncState) lane.syncState.aborted = true
    logForDebugging(
      'memory-watcher[user]: personal sync disabled mid-session — pausing (reversible)',
      { level: 'info' },
    )
    return
  }
  if (scope === 'user' && !lane.pushInProgress && lane.syncState?.aborted) {
    lane.syncState.aborted = false
  }
  if (lane.pushInProgress) {
    schedulePush(scope)
    return
  }
  if (lane.pushSuppressedReason !== null) return
  if (!lane.hasPendingChanges) return
  lane.currentPushPromise = executePush(scope)
}

/**
 * True if `scope` currently has an active lane (multistore present or a
 * single-store syncState present).
 * 2.1.183: laneActive = mAo @cli_inner_pretty.js:449148
 */
function laneActive(scope: Scope): boolean {
  if (scope === 'team' && teamMultistore) return true
  if (scope === 'user' && userMultistore) return true
  return memWatchState[scope].syncState !== null
}

/**
 * Whether the user lane is still eligible (gates can flip mid-session). When a
 * user multistore is mounted, eligibility follows the multistore team-sync gate;
 * otherwise it follows the single-store user gate `isUserStoreEnabled`.
 * 2.1.183: isUserLaneEligible = gAo @cli_inner_pretty.js:449086
 */
function isUserLaneEligible(): boolean {
  // @449087: $W ? rGn() : lje() — note the multistore branch calls the
  // multistore TEAM-sync gate (isMultistoreTeamSyncAllowed/rGn), NOT the bare
  // isMultistoreSyncAllowed (nGn).
  return userMultistore ? isMultistoreTeamSyncAllowed() : isUserStoreEnabled()
}

/**
 * Whether a periodic resync is allowed for `scope`.
 * 2.1.183: resyncAllowed = XXa @cli_inner_pretty.js:449089
 */
function resyncAllowed(scope: Scope): boolean {
  // @449090: e === "user" ? gAo() : rGn() — team branch is the multistore
  // TEAM-sync gate (isMultistoreTeamSyncAllowed/rGn), NOT nGn.
  return scope === 'user' ? isUserLaneEligible() : isMultistoreTeamSyncAllowed()
}

/**
 * Start the shared directory watcher (chokidar) over the memory base dir.
 *
 * DELTA v2.1.172: the 88 ancestor used raw `fs.watch({recursive:true})` on the
 * team dir only (to avoid chokidar's per-file kqueue fds). 183 watches the whole
 * memory base dir with chokidar and routes each event to a lane via
 * `resolveLaneForPath`. add/change → schedulePush; unlink → clear suppression if
 * recoverable, then schedulePush. The `ignored` predicate keeps `team/…` and
 * auto-managed memory files, drops everything else. Idempotent via `watcherStarted`.
 * 2.1.183: startDirectoryWatcher = AAo @cli_inner_pretty.js:449153
 */
async function startDirectoryWatcher(baseDir: string): Promise<void> {
  if (watcherStarted) return
  watcherStarted = true

  await mkdir(baseDir, { recursive: true }).catch(err =>
    logForDebugging(`memory-watcher: mkdir ${baseDir} failed: ${errorMessage(err)}`, {
      level: 'warn',
    }),
  )

  const onUpsert = (path: string): void => {
    const scope = resolveLaneForPath(path)
    if (scope === null || !laneActive(scope)) return
    schedulePush(scope)
  }
  const onUnlink = (path: string): void => {
    const scope = resolveLaneForPath(path)
    if (scope === null || !laneActive(scope)) return
    const lane = memWatchState[scope]
    if (
      lane.pushSuppressedReason !== null &&
      isUnlinkRecoverable(scope, lane.pushSuppressedReason)
    ) {
      logForDebugging(
        `memory-watcher[${scope}]: unlink cleared suppression (was: ${lane.pushSuppressedReason})`,
        { level: 'info' },
      )
      lane.pushSuppressedReason = null
    }
    schedulePush(scope)
  }

  watcher = watch(baseDir, {
    persistent: true,
    ignoreInitial: true,
    usePolling: USE_POLLING, // 2.1.183: sFp = (typeof Bun !== 'undefined') @449400/init@449427
    interval: 2000, // 2.1.183: iFp = 2000 @449401
    ignorePermissionErrors: true,
    ignored: (p: string) => {
      // @449183: chokidar `ignored` returns TRUE to ignore. Bundle:
      //   `if (I0n(s[0]) === "team") return !1; return Bge(o)`.
      // So `team/` is always watched, and any path in an excluded subtree
      // (logs/sessions/proposals or dotfiles) is ignored.
      const rel = relative(getAutoMemBaseDir(), p).replaceAll(sep, '/')
      if (rel === '' || rel.startsWith('..')) return false
      const segments = rel.split('/')
      if (normalizeForFsCompare(segments[0]) === 'team') return false // keep team/
      return isExcludedMemorySubtree(rel) // ignore excluded subtrees; watch the rest
    },
  })
  watcher.on('add', onUpsert)
  watcher.on('change', onUpsert)
  watcher.on('unlink', onUnlink)
  watcher.on('error', err => {
    logForDebugging(`memory-watcher: watcher error: ${errorMessage(err)}`, {
      level: 'warn',
    })
  })
  logForDebugging(`memory-watcher: watching ${baseDir}`, { level: 'debug' })
  armResyncTimer()
}

/**
 * Public entrypoint. Wraps the core start in try/finally so the
 * memory-stores-ready barrier (`releaseStoresReadyBarrier`) is always released —
 * other code (e.g. a memory-stores readiness gate) waits on it.
 * 2.1.183: startMemoryWatcher = cFp @cli_inner_pretty.js:449196
 */
export async function startMemoryWatcher(): Promise<void> {
  try {
    await startMemoryWatcherCore()
  } finally {
    releaseStoresReadyBarrier() // 2.1.183: mXa @447219
  }
}

/**
 * Start the memory sync system (team + user lanes).
 *
 * Eligibility:
 *   - team eligible if `CLAUDE_MEMORY_STORES` is mounted (multistore team-sync
 *     allowed) OR (isTeamMemoryEnabled && syncAllowed("team"))
 *   - user eligible if isUserStoreEnabled (tengu_marble_lark) && syncAllowed("user")
 * Returns early if the watcher itself is disabled (sandbox) or neither lane is
 * eligible.
 *
 * DELTA v2.1.172 (the scope-split — see team_memory_stores_recall.md §5):
 *   Parse `CLAUDE_MEMORY_STORES` ONCE, then split into a team sublist
 *   (scope==="team") and a user sublist (scope==="user"). Build a separate
 *   `buildMultistore` object for each non-empty sublist. A user-scope multistore
 *   SUPERSEDES the single-store user `syncState` (nulled out). Emit
 *   `tengu_team_mem_sync_started{multistore:true}` for the team lane and the NEW
 *   `tengu_personal_mem_sync_started` for the user lane.
 * 2.1.183: startMemoryWatcherCore = uFp @cli_inner_pretty.js:449203
 */
async function startMemoryWatcherCore(): Promise<void> {
  // 2.1.88 used feature('TEAMMEM'); 183 inlines the enabled branch behind the
  // watcher-eligible/sandbox gate. feature('TEAMMEM') inlined-enabled in 183.
  if (!isWatcherEligible()) return // 2.1.183: Lp @591980

  const teamEligible = process.env.CLAUDE_MEMORY_STORES?.trim()
    ? isMultistoreTeamSyncAllowed() // 2.1.183: rGn @447758
    : isTeamMemoryEnabled() && syncAllowed('team') // 2.1.183: Nk && oAo("team")
  const userEligible = isUserStoreEnabled() && syncAllowed('user') // lje && oAo("user")
  if (!teamEligible && !userEligible) return

  // Register graceful-shutdown flush. (88 ancestor registered this from the
  // file-watcher start; 183 registers it here in the core.)
  registerCleanup(async () => stopMemoryWatcher()) // 2.1.183: qi(async () => QXa()) @449208

  // Parse the store config once. A malformed config disables the TEAM lane and
  // emits tengu_team_mem_multistore_config_invalid (carryover); the user lane is
  // unaffected by team-config invalidity.
  let stores: MemoryStore[] | null = null
  let configInvalid = false
  if (teamEligible) {
    try {
      stores = parseMemoryStoresEnv() // 2.1.183: Zse @150442
    } catch (e) {
      logForDebugging(
        `memory-watcher: CLAUDE_MEMORY_STORES invalid, disabling team sync: ${errorMessage(e)}`,
        { level: 'error' },
      )
      logEvent('tengu_team_mem_multistore_config_invalid', {
        error:
          errorMessage(e) as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
      })
      logEventFail('team_memory_sync_watcher_start', 'config_invalid') // Me(...) @449217
      stores = null
      configInvalid = true
    }
  }

  const githubRemote = await getGithubRepo() // 2.1.183: nOe @51431

  // User single-store lane only spins up when there's a github remote.
  if (userEligible && githubRemote) {
    memWatchState.user.syncState = makeSingleStoreSyncState('user', githubRemote) // nAo
  }

  if (stores !== null) {
    // ── THE SCOPE-SPLIT (Delta 5) ──
    const teamStores = stores.filter(s => s.scope === 'team') // @449224
    const userStores = stores.filter(s => s.scope === 'user') // @449225

    if (teamStores.length > 0) {
      // 2.1.183: teamMultistore lane rX = lAo(CNr(team), …) @449227
      teamMultistore = buildMultistore(
        makeMultistoreBackends(teamStores),
        teamStores.map(s => ({ mount: s.mount, scope: s.scope })),
      )
    }
    if (userStores.length > 0) {
      // 2.1.183: userMultistore lane $W = lAo(CNr(user), …) @449232;
      // a user multistore SUPERSEDES the single-store user syncState.
      userMultistore = buildMultistore(
        makeMultistoreBackends(userStores),
        userStores.map(s => ({ mount: s.mount, scope: s.scope })),
      )
      memWatchState.user.syncState = null // @449236
    }

    // Initial push for each lane (multistore "startup" push — carryover plumbing).
    const pushLaneInitial = async (
      scope: Scope,
      multistore: MultistoreState | null,
    ): Promise<void> => {
      if (!multistore) return
      const lane = memWatchState[scope]
      lane.pushInProgress = true
      const d = multistorePush(multistore, 'startup') // pAo(..,"startup") @449241
      lane.currentPushPromise = d.then(() => {}).catch(() => {})
      try {
        await d
      } catch (e) {
        logForDebugging(
          `memory-watcher[${scope}]: multi-store initial sync failed: ${errorMessage(e)}`,
          { level: 'warn' },
        )
      } finally {
        lane.lastSyncCompletedAt = Date.now()
        lane.pushInProgress = false
        lane.currentPushPromise = null
        armResyncTimer()
      }
    }

    await pushLaneInitial('team', teamMultistore)
    await pushLaneInitial('user', userMultistore)

    if (teamMultistore) {
      logEventOk('team_memory_sync_watcher_start') // Le @449258
      logEvent('tengu_team_mem_sync_started', {
        multistore: true,
        stores: teamMultistore.stores.length,
        watcher_started: true,
      }) // @449259
    }
    if (userMultistore) {
      logEventOk('personal_memory_sync_watcher_start') // Le @449261
      // DELTA v2.1.172: NEW event — the user lane's analogue of
      // tengu_team_mem_sync_started. @449262
      logEvent('tengu_personal_mem_sync_started', {
        multistore: true,
        watcher_started: true,
      })
    }
  }

  // ── No github remote: can't sync, but still start the watcher if any lane
  //    was provisioned (multistores are disk-only without a remote). @449264 ──
  if (!githubRemote) {
    logForDebugging('memory-watcher: no github.com remote, skipping sync', {
      level: 'debug',
    })
    if (teamMultistore || userMultistore) {
      // Watch the user base dir if a user multistore exists, else the team dir.
      await startDirectoryWatcher(userMultistore ? getAutoMemBaseDir() : getTeamMemPath())
    }
    return
  }

  // ── Single-store lanes need their initial pull + watcher start. ──
  if (teamEligible && stores === null && !configInvalid) {
    memWatchState.team.syncState = makeSingleStoreSyncState('team', githubRemote) // @449269
  }
  if (memWatchState.team.syncState) await initialPullForLane('team') // @449270
  if (memWatchState.user.syncState) await initialPullForLane('user') // @449271

  if (
    memWatchState.team.syncState ||
    memWatchState.user.syncState ||
    teamMultistore ||
    userMultistore
  ) {
    // Watch the user base dir if the user lane is live, else the team dir. @449272
    const userLaneLive = memWatchState.user.syncState || userMultistore
    await startDirectoryWatcher(userLaneLive ? getAutoMemBaseDir() : getTeamMemPath())
  }
}

/**
 * Initial pull for a single-store lane (carryover transport). Skips if the
 * sync basis was already established by a lazy pull-on-first-push. Emits
 * tengu_team_mem_sync_started for the team lane (with pull stats);
 * personal_memory_sync_watcher_start ok-telemetry for the user lane.
 * 2.1.183: initialPullForLane = WXa @cli_inner_pretty.js:449277
 */
async function initialPullForLane(scope: Scope): Promise<void> {
  const lane = memWatchState[scope]
  if (!lane.syncState) return

  if (lane.syncState.pulled) {
    logForDebugging(
      `memory-watcher[${scope}]: initial pull skipped — basis already established by lazy pull-on-first-push`,
      { level: 'debug' },
    )
    if (scope === 'team') {
      logEventOk('team_memory_sync_watcher_start')
      logEvent('tengu_team_mem_sync_started', {
        initial_pull_success: true,
        initial_files_pulled: 0,
        initial_files_reaped: 0,
        watcher_started: true,
        server_has_content: lane.syncState.serverChecksums.size > 0,
      })
    } else {
      logEventOk('personal_memory_sync_watcher_start')
    }
    return
  }

  let success = false
  let filesPulled = 0
  let filesReaped = 0
  let serverHasContent = false
  try {
    const result = await multistorePull(lane.syncState, { skipEtagCache: true }) // sAo @449303
    success = result.success
    serverHasContent = result.entryCount > 0
    if (result.success && (result.filesWritten > 0 || result.filesReaped > 0)) {
      filesPulled = result.filesWritten
      filesReaped = result.filesReaped
      logForDebugging(
        `memory-watcher[${scope}]: initial pull got ${result.filesWritten} files` +
          (result.filesReaped > 0
            ? `, reaped ${result.filesReaped} tombstoned`
            : ''),
        { level: 'info' },
      )
    }
  } catch (e) {
    logForDebugging(
      `memory-watcher[${scope}]: initial pull failed: ${errorMessage(e)}`,
      { level: 'warn' },
    )
  }

  if (scope === 'team') {
    logEventOk('team_memory_sync_watcher_start')
    logEvent('tengu_team_mem_sync_started', {
      initial_pull_success: success,
      initial_files_pulled: filesPulled,
      initial_files_reaped: filesReaped,
      watcher_started: true,
      server_has_content: serverHasContent,
    })
  } else {
    logEventOk('personal_memory_sync_watcher_start')
  }
}

/**
 * Call this when a memory file is written (e.g. from PostToolUse hooks).
 * Resolves the path to its lane, then schedules a push for that lane. No-op if
 * the path doesn't map to an active lane.
 * 2.1.183: notifyMemoryWrite = cGn @cli_inner_pretty.js:449326
 */
export async function notifyMemoryWrite(path: string): Promise<void> {
  const scope = resolveLaneForPath(path)
  if (scope === null || !laneActive(scope)) return
  schedulePush(scope)
}

/**
 * Stop the watcher and flush both lanes' pending changes.
 * Clears the resync timer, both debounce timers, closes the shared watcher,
 * awaits any in-flight pushes, then best-effort flushes each lane. For the user
 * lane, if personal sync was disabled mid-session, the flush is skipped and the
 * single-store syncState is aborted.
 * 2.1.183: stopMemoryWatcher = QXa @cli_inner_pretty.js:449331
 */
export async function stopMemoryWatcher(): Promise<void> {
  if (resyncTimer) {
    clearTimeout(resyncTimer)
    resyncTimer = null
  }
  for (const scope of ['team', 'user'] as Scope[]) {
    const lane = memWatchState[scope]
    if (lane.debounceTimer) {
      clearTimeout(lane.debounceTimer)
      lane.debounceTimer = null
    }
  }
  if (watcher) {
    await watcher.close().catch(() => {})
    watcher = null
  }

  // Await in-flight pushes on both lanes.
  await Promise.all(
    (['team', 'user'] as Scope[]).map(async scope => {
      const lane = memWatchState[scope]
      if (lane.currentPushPromise) {
        try {
          await lane.currentPushPromise
        } catch {
          // Ignore errors during shutdown
        }
      }
    }),
  )
  if (resyncTimer) {
    clearTimeout(resyncTimer)
    resyncTimer = null
  }

  // Best-effort flush of debounced-but-unpushed changes per lane.
  await Promise.all(
    (['team', 'user'] as Scope[]).map(async scope => {
      const lane = memWatchState[scope]
      if (!lane.hasPendingChanges || lane.pushSuppressedReason !== null) return
      // User lane disabled mid-session → skip flush, abort the single-store state.
      if (scope === 'user' && !isUserLaneEligible()) {
        lane.hasPendingChanges = false
        if (lane.syncState) lane.syncState.aborted = true
        logForDebugging(
          'memory-watcher[user]: personal sync disabled — skipping shutdown flush',
          { level: 'info' },
        )
        return
      }
      try {
        const multistore = scope === 'team' ? teamMultistore : userMultistore
        if (multistore) {
          await Promise.all(
            multistore.stores
              .filter(s => s.suppressedReason === null)
              .map(s => flushStore(s)), // uAo @448747
          )
        } else if (lane.syncState) {
          if (scope === 'user') lane.syncState.aborted = false
          await pushMemory(lane.syncState) // iAo
        }
      } catch {
        // Best-effort — shutdown may kill this
      }
    }),
  )
}

/**
 * Periodically re-sync lanes whose last sync is stale (drift correction for
 * writes another session made that we didn't observe a watch event for). Driven
 * by the resync timer; one push per stale, idle, unsuppressed, still-eligible lane.
 * 2.1.183: maybeResyncStaleStores = JXa @cli_inner_pretty.js:449109
 */
export function maybeResyncStaleStores(): void {
  try {
    if (!watcherStarted) return
    const staleAfterMs = getStaleResyncIntervalMs() // dAo @448827
    if (staleAfterMs <= 0) return
    const now = Date.now()
    for (const scope of ['team', 'user'] as Scope[]) {
      if (!(scope === 'team' ? teamMultistore : userMultistore)) continue
      const lane = memWatchState[scope]
      if (lane.pushSuppressedReason !== null || lane.pushInProgress) continue
      if (
        lane.lastSyncCompletedAt === null ||
        now - lane.lastSyncCompletedAt <= staleAfterMs
      ) {
        continue
      }
      if (!resyncAllowed(scope)) continue
      lane.currentPushPromise = executePush(scope, 'periodic')
    }
  } catch (e) {
    logForDebugging(
      `memory-watcher: stale-store check failed: ${errorMessage(e)}`,
      { level: 'warn' },
    )
  }
}

/**
 * (Re)arm the resync timer to fire at the earliest lane's next stale deadline.
 * `unref()`'d so it never keeps the process alive. Floor of MIN_RESYNC_DELAY_MS.
 * 2.1.183: armResyncTimer = u4t @cli_inner_pretty.js:449127
 */
function armResyncTimer(): void {
  if (resyncTimer) {
    clearTimeout(resyncTimer)
    resyncTimer = null
  }
  if (!watcherStarted) return
  const staleAfterMs = getStaleResyncIntervalMs()
  if (staleAfterMs <= 0) return
  const now = Date.now()
  let earliest: number | null = null
  for (const scope of ['team', 'user'] as Scope[]) {
    if (!(scope === 'team' ? teamMultistore : userMultistore)) continue
    const lane = memWatchState[scope]
    if (
      lane.pushSuppressedReason !== null ||
      lane.pushInProgress ||
      lane.lastSyncCompletedAt === null
    ) {
      continue
    }
    const due = resyncAllowed(scope)
      ? lane.lastSyncCompletedAt + staleAfterMs
      : now + staleAfterMs
    if (earliest === null || due < earliest) earliest = due
  }
  if (earliest === null) return
  const delay = Math.max(earliest - now, MIN_RESYNC_DELAY_MS)
  const timer = setTimeout(() => {
    resyncTimer = null
    maybeResyncStaleStores()
    armResyncTimer()
  }, delay)
  timer.unref?.()
  resyncTimer = timer
}

// ─── Test-only helpers (exported on the module) ──────────────

/**
 * Test-only: reset module state and optionally seed lanes/multistores.
 * The watcher-eligible gate at the top of startMemoryWatcherCore() is false in
 * bun test, so tests can't reach lane state through the normal path.
 * 2.1.183: _resetWatcherStateForTesting = dFp @cli_inner_pretty.js:449371
 */
export function _resetWatcherStateForTesting(opts?: {
  skipWatcher?: boolean
  multiStoreState?: MultistoreState | null
  userMultiStoreState?: MultistoreState | null
  teamSyncState?: SyncState | null
  userSyncState?: SyncState | null
  teamPushSuppressedReason?: string | null
  userPushSuppressedReason?: string | null
  teamLastSyncCompletedAt?: number | null
  userLastSyncCompletedAt?: number | null
}): void {
  watcher = null
  if (resyncTimer) {
    clearTimeout(resyncTimer)
    resyncTimer = null
  }
  watcherStarted = opts?.skipWatcher ?? false
  teamMultistore = opts?.multiStoreState ?? null
  userMultistore = opts?.userMultiStoreState ?? null
  memWatchState.team = makeWatchLaneState()
  memWatchState.team.syncState = opts?.teamSyncState ?? null
  memWatchState.team.pushSuppressedReason = opts?.teamPushSuppressedReason ?? null
  memWatchState.team.lastSyncCompletedAt = opts?.teamLastSyncCompletedAt ?? null
  memWatchState.user = makeWatchLaneState()
  memWatchState.user.syncState = opts?.userSyncState ?? null
  memWatchState.user.pushSuppressedReason = opts?.userPushSuppressedReason ?? null
  memWatchState.user.lastSyncCompletedAt = opts?.userLastSyncCompletedAt ?? null
}

/**
 * Test-only: start the real directory watcher on a specified dir.
 * 2.1.183: _startFileWatcherForTesting = pFp @cli_inner_pretty.js:449385 (→ AAo)
 */
export function _startFileWatcherForTesting(dir: string): Promise<void> {
  return startDirectoryWatcher(dir)
}

/**
 * Test-only: read a lane's lastSyncCompletedAt.
 * 2.1.183: _lastSyncCompletedAtForTesting = fFp @cli_inner_pretty.js:449388
 */
export function _lastSyncCompletedAtForTesting(scope: Scope): number | null {
  return memWatchState[scope].lastSyncCompletedAt
}

/**
 * Test-only: read the current resync timer handle.
 * 2.1.183: _resyncTimerForTesting = mFp @cli_inner_pretty.js:449391
 */
export function _resyncTimerForTesting(): ReturnType<typeof setTimeout> | null {
  return resyncTimer
}

/**
 * Test-only: arm the resync timer directly.
 * 2.1.183: _armResyncTimerForTesting = AFp @cli_inner_pretty.js:449394
 */
export function _armResyncTimerForTesting(): void {
  armResyncTimer()
}

// ─── Contract-level dependencies (defined elsewhere; see index.js / memdir) ──
// These are the gates/transport the watcher CALLS. Reconstructed at contract
// level only — the multistore transport is carryover the delta docs do not
// re-derive (see team_memory_stores_recall.md §5 and the v2.1.156 baseline).

// 2.1.183: isWatcherEligible = Lp @591980 (sandbox/env watcher-on gate)
declare function isWatcherEligible(): boolean
// 2.1.183: isMultistoreSyncAllowed = nGn @447336 (oauth Pu() + repo Co() + iH() + feature gates)
declare function isMultistoreSyncAllowed(): boolean
// 2.1.183: isMultistoreTeamSyncAllowed = rGn @447758
//   (Iu() && !removed && allow_memory_sync && (mounted-stores sS()!==null || nGn()))
declare function isMultistoreTeamSyncAllowed(): boolean
// 2.1.183: syncAllowed = oAo @447753 (not removed-account, allow_memory_sync gate, multistore allowed)
declare function syncAllowed(scope: Scope): boolean
// 2.1.183: USE_POLLING = sFp @449400 (decl) / init @449427 (typeof Bun !== "undefined")
declare const USE_POLLING: boolean
// 2.1.183: normalizeForFsCompare = I0n @289766 (NFC + trim trailing dot/space + lowercase)
declare function normalizeForFsCompare(name: string): string
// 2.1.183: isExcludedMemorySubtree = Bge @289772 (memdir personal-memory exclusion).
//   Bge(rel) === true when rel's first segment is one of the non-synced subtrees
//   pYr = ["team","logs","sessions","proposals"] (@289826) OR any segment is a
//   dotfile. NOTE: this is NOT memoryFileDetection.ts's isAutoManagedMemoryFile
//   (kWe @444865) — that render-path predicate has the OPPOSITE polarity (true =
//   IS a managed memory file). The watcher uses the exclusion predicate Bge.
declare function isExcludedMemorySubtree(relPath: string): boolean
// 2.1.183: getStaleResyncIntervalMs = dAo @448827 (resync-interval ms; <=0 disables)
declare function getStaleResyncIntervalMs(): number
// 2.1.183: flushStore = uAo @448747 (single-store flush within a multistore)
declare function flushStore(store: MultistoreState['stores'][number]): Promise<void>
// 2.1.183: releaseStoresReadyBarrier = mXa @447219 (signals memory-stores-ready barrier)
declare function releaseStoresReadyBarrier(): void
// 2.1.183: logEventOk = Le @44569 (tengu_feature_ok) ; logEventFail = Me @44572 (tengu_feature_bad)
declare function logEventOk(name: string): void
declare function logEventFail(name: string, code: string): void
