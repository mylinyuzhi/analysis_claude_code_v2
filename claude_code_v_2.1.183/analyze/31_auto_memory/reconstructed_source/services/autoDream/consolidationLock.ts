// Lock file whose mtime IS lastConsolidatedAt. Body is the holder's PID.
//
// Lives inside the memory dir (getAutoMemPath) so it keys on git-root
// like memory does, and so it's writable even when the memory path comes
// from an env/settings override whose parent may not be.
//
// ============================================================================
// v2.1.183 readable-source restoration — services/autoDream/consolidationLock.ts
// ----------------------------------------------------------------------------
// 183 regions covered: cli_inner_pretty.js
//   - lockPath                    = opo  @424609
//   - readLastConsolidatedAt      = h3n  @424612
//   - tryAcquireConsolidationLock = Cqa  @424619
//   - rollbackConsolidationLock   = y3n  @424643
//   - listSessionsTouchedSince    = Iqa  @424657
//   - LOCK_FILE      = BDp = ".consolidate-lock" @424663
//   - HOLDER_STALE_MS = FDp = 3600000           @424664
//   (helpers: isProcessRunning=lL@103243, listCandidates=sWe@424452,
//    getProjectDir=yh@232627, getOriginalCwd=Ar@2710, getAutoMemPath=hm@147746,
//    logForDebugging=v, errorMessage=Se@8832 [= `e instanceof Error ? e.message
//    : String(e)`; the minimal stringifier exported as errors.errorMessage, NOT
//    the complex truncating toolErrors.formatError])
// 88 ancestor mirror: src/services/autoDream/consolidationLock.ts
// scaffold doc: 31_auto_memory/_scout_dossier_auto_memory.md ;
//   v2.1.156 auto_dream_runtime.md (".consolidate-lock PID protocol")
// cross-val: re-read all five fns @424609-424662; BDp/FDp values confirmed
//   @424663-424664; flow confirmed at the dream runner @455416-455460
//   (h3n → Iqa → Cqa → y3n-on-failure, caller excludes current session).
// DELTA vs 88 ancestor: the 88 file's last export `recordConsolidation`
//   (the manual /dream stamp) does NOT exist in v2.1.183 — the only PID write
//   to the lock is inside tryAcquireConsolidationLock @424633. See note below.
// DELTA vs 88 ancestor: rollback's catch stringifies the error via errorMessage=Se
//   @424654 (`e instanceof Error ? e.message : String(e)`), not the 88 ancestor's
//   inline `(e as Error).message`. Differs for a non-Error throw (Se→String(e) vs
//   undefined). The 88 lock file uses no helper here — this is the 183 substitution.
// ============================================================================

import { mkdir, readFile, stat, unlink, utimes, writeFile } from 'fs/promises'
import { join } from 'path'
import { getOriginalCwd } from '../../bootstrap/state.js'
import { getAutoMemPath } from '../../memdir/paths.js'
import { logForDebugging } from '../../utils/debug.js'
import { errorMessage } from '../../utils/errors.js'
import { isProcessRunning } from '../../utils/genericProcessUtils.js'
import { listCandidates } from '../../utils/listSessionsImpl.js'
import { getProjectDir } from '../../utils/sessionStorage.js'

// 2.1.183: LOCK_FILE = BDp = ".consolidate-lock" @cli_inner_pretty.js:424663
const LOCK_FILE = '.consolidate-lock'

// Stale past this even if the PID is live (PID reuse guard).
// 2.1.183: HOLDER_STALE_MS = FDp = 3600000 @cli_inner_pretty.js:424664
const HOLDER_STALE_MS = 60 * 60 * 1000

// 2.1.183: lockPath = opo @cli_inner_pretty.js:424609
function lockPath(): string {
  return join(getAutoMemPath(), LOCK_FILE)
}

/**
 * mtime of the lock file = lastConsolidatedAt. 0 if absent.
 * Per-turn cost: one stat.
 */
// 2.1.183: readLastConsolidatedAt = h3n @cli_inner_pretty.js:424612
export async function readLastConsolidatedAt(): Promise<number> {
  try {
    const s = await stat(lockPath())
    return s.mtimeMs
  } catch {
    return 0
  }
}

/**
 * Acquire: write PID → mtime = now. Returns the pre-acquire mtime
 * (for rollback), or null if blocked / lost a race.
 *
 *   Success → do nothing. mtime stays at now.
 *   Failure → rollbackConsolidationLock(priorMtime) rewinds mtime.
 *   Crash   → mtime stuck, dead PID → next process reclaims.
 */
// 2.1.183: tryAcquireConsolidationLock = Cqa @cli_inner_pretty.js:424619
export async function tryAcquireConsolidationLock(): Promise<number | null> {
  const path = lockPath()

  let mtimeMs: number | undefined
  let holderPid: number | undefined
  try {
    // @424623: stat + read in parallel — mtime is the gate, body is the PID.
    const [s, raw] = await Promise.all([stat(path), readFile(path, 'utf8')])
    mtimeMs = s.mtimeMs
    const parsed = parseInt(raw.trim(), 10)
    holderPid = Number.isFinite(parsed) ? parsed : undefined
  } catch {
    // ENOENT — no prior lock.
  }

  // @424628: inside the stale window, a live holder PID blocks us.
  if (mtimeMs !== undefined && Date.now() - mtimeMs < HOLDER_STALE_MS) {
    if (holderPid !== undefined && isProcessRunning(holderPid)) {
      logForDebugging(
        `[autoDream] lock held by live PID ${holderPid} (mtime ${Math.round((Date.now() - mtimeMs) / 1000)}s ago)`,
      )
      return null
    }
    // Dead PID or unparseable body — reclaim.
  }

  // Memory dir may not exist yet.
  // @424633: mkdir(recursive) then stamp our PID — this is the ONLY write
  //          that claims the lock (no separate recordConsolidation in 183).
  await mkdir(getAutoMemPath(), { recursive: true })
  await writeFile(path, String(process.pid))

  // Two reclaimers both write → last wins the PID. Loser bails on re-read.
  let verify: string
  try {
    verify = await readFile(path, 'utf8')
  } catch {
    return null
  }
  if (parseInt(verify.trim(), 10) !== process.pid) return null

  return mtimeMs ?? 0
}

/**
 * Rewind mtime to pre-acquire after a failed fork. Clears the PID body —
 * otherwise our still-running process would look like it's holding.
 * priorMtime 0 → unlink (restore no-file).
 */
// 2.1.183: rollbackConsolidationLock = y3n @cli_inner_pretty.js:424643
export async function rollbackConsolidationLock(
  priorMtime: number,
): Promise<void> {
  const path = lockPath()
  try {
    if (priorMtime === 0) {
      await unlink(path)
      return
    }
    await writeFile(path, '')
    const t = priorMtime / 1000 // utimes wants seconds
    await utimes(path, t, t)
  } catch (e: unknown) {
    // @424654: 183 stringifies via errorMessage=Se (`e instanceof Error ? e.message
    //          : String(e)`) — NOT the 88 ancestor's inline `(e as Error).message`,
    //          which would yield undefined for a non-Error throw. Verbatim message, em-dash (—).
    logForDebugging(
      `[autoDream] rollback failed: ${errorMessage(e)} — next trigger delayed to minHours`,
    )
  }
}

/**
 * Session IDs with mtime after sinceMs. listCandidates handles UUID
 * validation (excludes agent-*.jsonl) and parallel stat.
 *
 * Uses mtime (sessions TOUCHED since), not birthtime (0 on ext4).
 * Caller excludes the current session. Scans per-cwd transcripts — it's
 * a skip-gate, so undercounting worktree sessions is safe.
 */
// 2.1.183: listSessionsTouchedSince = Iqa @cli_inner_pretty.js:424657
//   (calls listCandidates(dir, true) = sWe @424452 with computeMtime=true)
export async function listSessionsTouchedSince(
  sinceMs: number,
): Promise<string[]> {
  const dir = getProjectDir(getOriginalCwd())
  const candidates = await listCandidates(dir, true)
  return candidates.filter(c => c.mtime > sinceMs).map(c => c.sessionId)
}

// ----------------------------------------------------------------------------
// DELTA v2.1.183: `recordConsolidation` (the v2.1.88 ancestor's fifth/last export —
// the optimistic manual-/dream PID stamp) is REMOVED. Re-verified in the 183
// bundle: the ONLY writeFile(lockPath, String(process.pid)) is inside
// tryAcquireConsolidationLock @424633; no other caller of lockPath/opo writes
// the PID, and the /dream slash command no longer stamps the lock at
// prompt-build time. (grep: String(process.pid) → 424633, 438473, 466073,
// 696087 — none of the others touch the consolidate-lock.)
// ----------------------------------------------------------------------------
