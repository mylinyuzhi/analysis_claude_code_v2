// biome-ignore-all assist/source/organizeImports: ANT-ONLY import markers must not be reordered
//
// ============================================================================
// services/autoDream/autoDream.ts  —  readable-source restoration (v2.1.183)
// ============================================================================
//
// 2.1.183 regions covered (cli_inner_pretty.js):
//   - getConfig / getDreamThresholds .................. w2p   @455394
//   - isGateOpen ...................................... C2p   @455405
//   - isForced ........................................ I2p   @455410
//   - initAutoDream (closure factory) ................. FQa   @455413
//   - runAutoDream (the gate->scan->lock->fork loop) .. BQa   @455415-455544
//   - makeDreamProgressWatcher ........................ x2p   @455546-455567
//   - countDailyLogs .................................. k2p   @455568-455576
//   - executeAutoDream (public entry) ................. UQa   @455577-455579
//   - module constants (SCAN_INTERVAL/DEFAULTS) ....... T2p/$Qa @455582-455608
//
// v2.1.88 ancestor (shape + real names + comments):
//   /lyz/codespace/3rd/claude-code/src/services/autoDream/autoDream.ts
// scaffold docs: 31_auto_memory/README.md "auto-dream scheduler";
//   v2.1.156 auto_dream_runtime.md (full scheduler analysis, carryover prose)
// cross-validation (re-read in 183 bundle):
//   - SCAN_INTERVAL = T2p = 600000 @455582 ; DEFAULTS = $Qa = {minHours:24,minSessions:5} @455608
//   - thresholds reader ct("tengu_onyx_plover", null) @455395 with per-field validation
//   - tengu_auto_dream_fired payload GAINS team_memory_enabled:Nk() @455467  (DELTA vs 88)
//   - tengu_auto_dream_failed payload is {phase, error_class} @455539       (DELTA vs 88's {})
//   - tengu_auto_dream_completed payload gains daily_logs_found / files_touched_count /
//       team_memory_enabled @455522                                          (DELTA vs 88)
//   - tengu_auto_dream_skipped {reason} for the session/lock gates @455444/455461 (DELTA vs 88)
//   - tiny-memory branch (isTinyMemoryEnabled aH@147673) swaps buildDreamPromptTiny @455480/488 (DELTA)
//   - pendingMemoryUpdates push @455507  (DELTA vs 88)
//   - watcher path filter .filter(isAutoMemPathMd) k4t@455056/455565  (DELTA vs 88)
//
// Divergence from the 88 ancestor worth flagging up front: the 183 runner threads the
// task *registry* (n.toolUseContext.taskRegistry) directly instead of the 88 ancestor's
// setAppState/getAppState plumbing. The DreamTask helpers therefore take a taskRegistry
// argument, not a setAppState callback. The 183 runner-level gate (isGateOpen=C2p@455405)
// no longer has the 88 ancestor's standalone getKairosActive() short-circuit — the 183
// gate is exactly: remote-mode exclusion (dd()@50521) -> auto-memory parent (Iu@147636)
// -> config-enabled (T4t@454528). (Where the KAIROS check went upstream is not confirmable
// in Iu's body, which has no KAIROS reference — only the gate's three checks are verified.)

import type { REPLHookContext } from '../../utils/hooks/postSamplingHooks.js'
import {
  createCacheSafeParams,
  runForkedAgent,
} from '../../utils/forkedAgent.js'
import {
  createUserMessage,
  createMemorySavedMessage,
} from '../../utils/messages.js'
import type { Message } from '../../types/message.js'
import { logForDebugging } from '../../utils/debug.js'
import type { ToolUseContext } from '../../Tool.js'
import { logEvent } from '../analytics/index.js'
import { getFeatureValue_CACHED_MAY_BE_STALE } from '../analytics/growthbook.js'
import {
  isAutoMemoryEnabled,
  getAutoMemPath,
  isTinyMemoryEnabled,
} from '../../memdir/paths.js'
import { isTeamMemoryEnabled } from '../../memdir/teamMemPaths.js'
import { isAutoDreamEnabled } from './config.js'
import { getProjectDir } from '../../utils/sessionStorage.js'
import { pluralize } from '../../utils/string.js'
import { getErrorMessage, getErrorClass } from '../../utils/errors.js'
import {
  getOriginalCwd,
  getIsRemoteMode,
  getSessionId,
} from '../../bootstrap/state.js'
import {
  createAutoMemCanUseTool,
  isAutoMemPathMd,
} from '../extractMemories/extractMemories.js'
// DELTA v2.1.x: skip the fork's prompt-cache write when the policy says to.
// Same helper extractMemories uses (npt @454872) — the dream fork shares the
// extraction sandbox's cache-write policy.
import { shouldSkipForkCacheWrite } from '../../utils/forkedAgentCache.js'
import { buildConsolidationPrompt } from './consolidationPrompt.js'
import { buildDreamPromptTiny } from '../../memdir/memoryTypes.js'
import {
  readLastConsolidatedAt,
  listSessionsTouchedSince,
  tryAcquireConsolidationLock,
  rollbackConsolidationLock,
} from './consolidationLock.js'
import {
  registerDreamTask,
  addDreamTurn,
  completeDreamTask,
  failDreamTask,
  isDreamTask,
} from '../../tasks/DreamTask/DreamTask.js'
import { FILE_EDIT_TOOL_NAME } from '../../tools/FileEditTool/constants.js'
import { FILE_WRITE_TOOL_NAME } from '../../tools/FileWriteTool/prompt.js'

// Scan throttle: when time-gate passes but session-gate doesn't, the lock
// mtime doesn't advance, so the time-gate keeps passing every turn. This caps
// the expensive session scan (readdir + N stats) to once per 10 min.
// 2.1.183: SESSION_SCAN_INTERVAL_MS = T2p = 600000 @cli_inner_pretty.js:455582
const SESSION_SCAN_INTERVAL_MS = 10 * 60 * 1000

type AutoDreamConfig = {
  minHours: number
  minSessions: number
}

// 2.1.183: DEFAULTS = $Qa = { minHours: 24, minSessions: 5 } @cli_inner_pretty.js:455608
const DEFAULTS: AutoDreamConfig = {
  minHours: 24,
  minSessions: 5,
}

/**
 * Thresholds from tengu_onyx_plover. The enabled gate lives in config.ts
 * (isAutoDreamEnabled); this returns only the scheduling knobs. Defensive
 * per-field validation since the Growthbook cache can return stale wrong-type
 * values (e.g. minHours:"soon" or minHours:0 — a 0 threshold would fire every
 * turn). Falling back per-field rather than per-object means a config that
 * overrides only minSessions still gets the default minHours.
 */
// 2.1.183: getConfig = getDreamThresholds = w2p @cli_inner_pretty.js:455394 (reads tengu_onyx_plover)
function getConfig(): AutoDreamConfig {
  const raw =
    getFeatureValue_CACHED_MAY_BE_STALE<Partial<AutoDreamConfig> | null>(
      'tengu_onyx_plover',
      null,
    )
  return {
    minHours:
      typeof raw?.minHours === 'number' &&
      Number.isFinite(raw.minHours) &&
      raw.minHours > 0
        ? raw.minHours
        : DEFAULTS.minHours,
    minSessions:
      typeof raw?.minSessions === 'number' &&
      Number.isFinite(raw.minSessions) &&
      raw.minSessions > 0
        ? raw.minSessions
        : DEFAULTS.minSessions,
  }
}

/**
 * The runner-level gate the scheduler calls each turn. Cheapest checks first.
 * Returns true only when this process should own the per-turn dream check.
 *
 * DELTA vs 2.1.88: the 88 ancestor's isGateOpen also short-circuited on
 * getKairosActive() ("KAIROS mode uses disk-skill dream"). In 2.1.183 that
 * KAIROS short-circuit is gone from the runner gate; the verified gate is just:
 *   remote-mode exclusion -> auto-memory parent -> config-enabled.
 * (isAutoMemoryEnabled()=Iu@147636 has no KAIROS reference, so where the check
 * moved is not confirmable here — only the gate's three checks are verified.)
 */
// 2.1.183: isGateOpen = C2p @cli_inner_pretty.js:455405
function isGateOpen(): boolean {
  // dd()@50521 returns aRe().remote; "!== null" means a remote bridge runs its
  // own consolidation, so the local scheduler stands down to avoid racing it.
  if (getIsRemoteMode()) return false // @455406
  if (!isAutoMemoryEnabled()) return false // @455407 — parent gate all three writers share
  return isAutoDreamEnabled() // @455408 — config.ts: server opt-in + user toggle
}

/**
 * Ant-build-only test override. Bypasses enabled/time/session gates but NOT
 * the lock (so repeated turns don't pile up dreams) or the memory-dir
 * precondition. Still scans sessions so the prompt's session-hint is populated.
 * Ships as a constant `false` in the public bundle.
 */
// 2.1.183: isForced = I2p @cli_inner_pretty.js:455410 (returns !1)
function isForced(): boolean {
  return false
}

type AppendSystemMessageFn = NonNullable<ToolUseContext['appendSystemMessage']>

let runner:
  | ((
      context: REPLHookContext,
      appendSystemMessage?: AppendSystemMessageFn,
    ) => Promise<void>)
  | null = null

/**
 * Call once at startup (from backgroundHousekeeping alongside
 * initExtractMemories), or per-test in beforeEach for a fresh closure.
 *
 * Closure factory: captures a private lastSessionScanAt = 0 and assigns the
 * worker to the module-level `runner`. State is closure-scoped rather than
 * module-level so tests get a clean throttle clock without resetting a global.
 */
// 2.1.183: initAutoDream = FQa @cli_inner_pretty.js:455413 (assigns runner BQa@455415)
export function initAutoDream(): void {
  let lastSessionScanAt = 0

  runner = async function runAutoDream(context, appendSystemMessage) {
    const cfg = getConfig()
    const force = isForced()
    // --- Gate 1: feature enabled (cheapest — flag reads, no I/O) ---
    if (!force && !isGateOpen()) return // @455418

    // --- Gate 2: time since last consolidation (one stat) ---
    // readLastConsolidatedAt is a single stat of the .consolidate-lock file;
    // its mtime IS lastConsolidatedAt. Missing file -> 0 (epoch) -> gate passes.
    let lastAt: number
    try {
      lastAt = await readLastConsolidatedAt() // @455421 h3n
    } catch (e: unknown) {
      logForDebugging(
        `[autoDream] readLastConsolidatedAt failed: ${getErrorMessage(e)}`,
      )
      return
    }
    const hoursSince = (Date.now() - lastAt) / 3_600_000 // @455426
    if (!force && hoursSince < cfg.minHours) return // @455427

    // --- Gate 3: scan throttle (0 syscalls — in-memory subtraction) ---
    const sinceScanMs = Date.now() - lastSessionScanAt
    if (!force && sinceScanMs < SESSION_SCAN_INTERVAL_MS) {
      logForDebugging(
        `[autoDream] scan throttle — time-gate passed but last scan was ${Math.round(sinceScanMs / 1000)}s ago`,
      )
      return // @455429
    }
    lastSessionScanAt = Date.now() // @455433

    // --- Gate 4: enough OTHER sessions touched since last consolidation ---
    let sessionIds: string[]
    try {
      sessionIds = await listSessionsTouchedSince(lastAt) // @455436 Iqa
    } catch (e: unknown) {
      logForDebugging(
        `[autoDream] listSessionsTouchedSince failed: ${getErrorMessage(e)}`,
      )
      return
    }
    // Exclude the current session (its mtime is always recent).
    const currentSession = getSessionId() // @455441 xt
    sessionIds = sessionIds.filter(id => id !== currentSession)
    if (!force && sessionIds.length < cfg.minSessions) {
      logForDebugging(
        `[autoDream] skip — ${sessionIds.length} sessions since last consolidation, need ${cfg.minSessions}`,
      )
      // DELTA v2.1.x: 88 ancestor just returned here; 183 emits a skip event. @455444
      logEvent('tengu_auto_dream_skipped', {
        reason: 'sessions',
        session_count: sessionIds.length,
        min_required: cfg.minSessions,
      })
      return
    }

    // --- Gate 5: acquire the filesystem lock (prevents two concurrent dreams) ---
    // Under force, skip acquire entirely — reuse the existing mtime so kill's
    // rollback is a no-op (rewinds to where it already is). The lock file stays
    // untouched; next non-force turn sees it as-is.
    let priorMtime: number | null
    if (force) {
      priorMtime = lastAt // @455452
    } else {
      try {
        priorMtime = await tryAcquireConsolidationLock() // @455455 Cqa
      } catch (e: unknown) {
        logForDebugging(
          `[autoDream] lock acquire failed: ${getErrorMessage(e)}`,
        )
        return
      }
      if (priorMtime === null) {
        // DELTA v2.1.x: 88 ancestor returned silently; 183 emits a skip event. @455461
        logEvent('tengu_auto_dream_skipped', { reason: 'lock' })
        return
      }
    }

    // All gates passed: FIRE.
    // DELTA v2.1.x: team_memory_enabled added to the fired payload @455467.
    // Nk()@151098 = isTeamMemoryEnabled (feature('TEAMMEM') inlined-enabled in 183).
    const teamMemoryEnabled = isTeamMemoryEnabled() // @455465 Nk
    logForDebugging(
      `[autoDream] firing — ${hoursSince.toFixed(1)}h since last, ${sessionIds.length} sessions to review`,
    )
    logEvent('tengu_auto_dream_fired', {
      hours_since: Math.round(hoursSince),
      sessions_since: sessionIds.length,
      team_memory_enabled: teamMemoryEnabled, // DELTA v2.1.x: @455467
    })

    // DELTA vs 2.1.88: the 183 runner threads the task registry directly off
    // the tool-use context rather than the 88 ancestor's setAppState plumbing.
    const { taskRegistry } = context.toolUseContext // @455468
    const abortController = new AbortController()
    const taskId = registerDreamTask(taskRegistry, {
      sessionsReviewing: sessionIds.length,
      priorMtime,
      abortController,
    }) // @455470 xqa

    // DELTA vs 2.1.88: the 88 catch had no `phase` and rolled back the lock +
    // failed the task UNCONDITIONALLY. 183 introduces `phase` (g@455471) and
    // gates both failDreamTask + rollback on phase === 'fork' (@455540) — a
    // completion-phase error means the dream already ran, so rewinding would let
    // it re-run pointlessly.
    let phase: 'fork' | 'completion' = 'fork' // @455471

    try {
      const memoryRoot = getAutoMemPath() // @455473 hm
      const transcriptDir = getProjectDir(getOriginalCwd()) // @455474 yh(Ar())
      // DELTA v2.1.x: count daily logs for the completion telemetry. @455476
      const dailyLogsFound = await countDailyLogs(memoryRoot)

      // DELTA v2.1.x: tiny-memory mode swaps in a delete-only "Memory Pruning"
      // prompt and a stricter tool-constraints note. @455477 aH = isTinyMemoryEnabled
      const tinyMemory = isTinyMemoryEnabled()

      // Tool constraints note goes in `extra`, not the shared prompt body —
      // manual /dream runs in the main loop with normal permissions and this
      // would be misleading there.
      const extra = tinyMemory
        ? // @455480 — tiny branch: memories are immutable, so delete + Write.
          `

**Tool constraints for this run:** Shell access is restricted to read-only commands (\`ls\`, \`find\`, \`grep\`, \`cat\`, \`stat\`, \`wc\`, \`head\`, \`tail\`, and similar) plus deleting \`.md\` paths inside the memory directory. ${FILE_EDIT_TOOL_NAME} is not permitted — memories are immutable, so delete + ${FILE_WRITE_TOOL_NAME} to replace, never edit in place. Plan your exploration with this in mind — no need to probe.`
        : // @455481 — normal branch + the session list hint.
          `

**Tool constraints for this run:** Shell access is restricted to read-only commands (\`ls\`, \`find\`, \`grep\`, \`cat\`, \`stat\`, \`wc\`, \`head\`, \`tail\`, and similar) plus deleting \`.md\` paths inside the memory directory. Anything else that writes, redirects to a file, or modifies state will be denied. Plan your exploration with this in mind — no need to probe.

Sessions since last consolidation (${sessionIds.length}):
${sessionIds.map(id => `- ${id}`).join('\n')}`

      // DELTA v2.1.x: prompt selection branches on tiny-memory. @455488
      const prompt = tinyMemory
        ? buildDreamPromptTiny(memoryRoot, extra, teamMemoryEnabled) // Hgi@151520
        : buildConsolidationPrompt(
            memoryRoot,
            transcriptDir,
            extra,
            teamMemoryEnabled,
          ) // PQa@455311 — team flag added vs 88

      const result = await runForkedAgent({
        promptMessages: [createUserMessage({ content: prompt })],
        cacheSafeParams: createCacheSafeParams(context), // @455493 S8
        canUseTool: createAutoMemCanUseTool(memoryRoot), // @455494 zGn — SAME validator as extraction
        querySource: 'auto_dream',
        forkLabel: 'auto_dream',
        skipTranscript: true,
        overrides: { abortController },
        onMessage: makeDreamProgressWatcher(taskId, taskRegistry), // @455499 x2p
        // DELTA v2.1.x: skip the cache-write when the fork policy says to. @455500
        skipCacheWrite: shouldSkipForkCacheWrite(),
      }) // @455491 Xk

      phase = 'completion' // @455502
      completeDreamTask(taskId, taskRegistry) // @455502 Lqa — emits task_dream, status=completed

      // Inline completion summary in the main transcript (same surface as
      // extractMemories's "Saved N memories" message, but verb "Improved").
      const dreamState = taskRegistry.get(taskId) // @455503
      const filesTouchedCount = isDreamTask(dreamState)
        ? dreamState.filesTouched.length
        : 0
      if (
        isDreamTask(dreamState) &&
        dreamState.filesTouched.length > 0 // @455505
      ) {
        // The inline transcript pill — createMemorySavedMessage with verb swapped.
        appendSystemMessage?.({
          ...createMemorySavedMessage(dreamState.filesTouched), // YGn@589751
          verb: 'Improved',
        })
        // DELTA v2.1.x: push onto the pendingMemoryUpdates app-state queue —
        // drained next turn into an ambient memory_update attachment so the
        // next main-agent turn knows "your memory just changed". @455507
        context.toolUseContext.setAppState(s => ({
          ...s,
          pendingMemoryUpdates: [
            ...s.pendingMemoryUpdates,
            {
              source: 'dream',
              summary: `consolidated ${dreamState.filesTouched.length} ${pluralize(dreamState.filesTouched.length, 'memory file')}`,
              paths: dreamState.filesTouched,
            },
          ],
        }))
      }

      logForDebugging(
        `[autoDream] completed — cache: read=${result.totalUsage.cache_read_input_tokens} created=${result.totalUsage.cache_creation_input_tokens}`,
      )
      // DELTA v2.1.x: the completed payload gains daily_logs_found,
      // files_touched_count, and team_memory_enabled vs the 88 ancestor. @455522
      // (The trailing `...P` spread in the bundle is `P = null` — a vestigial
      // no-op; omitted here.)
      logEvent('tengu_auto_dream_completed', {
        cache_read: result.totalUsage.cache_read_input_tokens,
        cache_created: result.totalUsage.cache_creation_input_tokens,
        output: result.totalUsage.output_tokens,
        sessions_reviewed: sessionIds.length,
        daily_logs_found: dailyLogsFound, // DELTA v2.1.x: @455527
        files_touched_count: filesTouchedCount, // DELTA v2.1.x: @455528
        team_memory_enabled: teamMemoryEnabled, // DELTA v2.1.x: @455529
      })
    } catch (e: unknown) {
      // If the user killed from the bg-tasks dialog, DreamTask.kill already
      // aborted, rolled back the lock, and set status=killed. Don't overwrite
      // or double-rollback.
      if (abortController.signal.aborted) {
        logForDebugging('[autoDream] aborted by user') // @455534
        return
      }
      logForDebugging(`[autoDream] ${phase} failed: ${getErrorMessage(e)}`) // @455538
      // DELTA v2.1.x: 88 ancestor logged tengu_auto_dream_failed with empty {};
      // 183 logs {phase, error_class}. @455539
      logEvent('tengu_auto_dream_failed', {
        phase, // Ne(g) — identity passthrough of "fork" | "completion"
        error_class: getErrorClass(e).name, // yo(h).name
      })
      // Only fork-phase failures roll back. A completion-phase error means the
      // dream already ran; rewinding the lock would let it re-run pointlessly.
      if (phase === 'fork') {
        failDreamTask(taskId, taskRegistry) // @455542 Dqa — emits task_dream_failed
        // Rewind mtime so the time-gate passes again; scan throttle is the backoff.
        await rollbackConsolidationLock(priorMtime) // @455542 y3n
      }
    }
  }
}

/**
 * Watch the forked agent's messages. For each assistant turn, extracts any
 * text blocks (the agent's reasoning/summary — what the user wants to see)
 * and collapses tool_use blocks to a count. Edit/Write file_paths are
 * collected for phase-flip + the inline completion message.
 *
 * DELTA vs 2.1.88: the 88 ancestor's watcher only recorded Edit/Write
 * file_paths. The 183 watcher (a) adds a shell-`rm` parser branch so dream
 * *deletions* (rm/Remove-Item/del of .md paths) count as touched files, and
 * (b) runs the collected paths through isMemoryMdPathSafe before recording —
 * dropping anything that isn't a .md inside the memory dir.
 */
// 2.1.183: makeDreamProgressWatcher = x2p @cli_inner_pretty.js:455546
function makeDreamProgressWatcher(
  taskId: string,
  taskRegistry: import('../../tasks/taskRegistry.js').TaskRegistry,
): (msg: Message) => void {
  return msg => {
    if (msg.type !== 'assistant') return
    let text = ''
    let toolUseCount = 0
    const touchedPaths: string[] = []
    for (const block of msg.message.content) {
      if (block.type === 'text') {
        text += block.text
      } else if (block.type === 'tool_use') {
        toolUseCount++
        if (
          block.name === FILE_EDIT_TOOL_NAME || // @455555 Fa
          block.name === FILE_WRITE_TOOL_NAME // Kc
        ) {
          const input = block.input as { file_path?: unknown }
          if (typeof input.file_path === 'string') {
            touchedPaths.push(input.file_path)
          }
        } else if (SHELL_TOOL_NAMES.includes(block.name)) {
          // DELTA v2.1.x: parse shell deletes so rm'd memories count. @455558
          const input = block.input as { command?: unknown }
          if (
            typeof input.command === 'string' &&
            /^\s*(rm|remove-item|ri|del|erase)\b/i.test(input.command)
          ) {
            // Matches quoted "foo.md"/'foo.md' and absolute /path/foo.md or
            // C:\path\foo.md ending in .md, mirroring the canUseTool validators.
            for (const m of input.command.matchAll(
              /"[^"]*\.md"|'[^']*\.md'|(?:\/|[A-Za-z]:[\\/])\S*\.md\b/g,
            )) {
              touchedPaths.push(m[0].replace(/^["']|["']$/g, ''))
            }
          }
        }
      }
    }
    addDreamTurn(
      taskId,
      { text: text.trim(), toolUseCount },
      // DELTA v2.1.x: drop paths that aren't safe .md paths in the memory dir.
      // @455565 k4t = isAutoMemPathMd (endsWith ".md" && isAutoMemPathWritable Lkt@147721);
      // shared with the extraction sandbox's write carve-out.
      touchedPaths.filter(isAutoMemPathMd),
      taskRegistry,
    )
  }
}

/**
 * Recursive count of `.md` files under <memoryRoot>/logs — feeds the
 * daily_logs_found field on tengu_auto_dream_completed. ENOENT is a quiet 0
 * (a project may have no logs dir yet); any other error is logged.
 *
 * DELTA vs 2.1.88: no equivalent in the 88 ancestor.
 */
// 2.1.183: countDailyLogs = k2p @cli_inner_pretty.js:455568
async function countDailyLogs(memoryRoot: string): Promise<number> {
  try {
    const entries = await fs.readdir(path.join(memoryRoot, 'logs'), {
      recursive: true,
    })
    return countWhere(entries, name => name.endsWith('.md')) // @455571 Wn
  } catch (e: unknown) {
    if (!isENOENT(e)) {
      logForDebugging(`[autoDream] countDailyLogs: ${getErrorMessage(e)}`)
    }
    return 0
  }
}

/**
 * Entry point from stopHooks. No-op until initAutoDream() has been called.
 * Per-turn cost when enabled: one GB cache read + one stat.
 */
// 2.1.183: executeAutoDream = UQa @cli_inner_pretty.js:455577 (delegates to runner BQa)
export async function executeAutoDream(
  context: REPLHookContext,
  appendSystemMessage?: AppendSystemMessageFn,
): Promise<void> {
  await runner?.(context, appendSystemMessage)
}

// ---------------------------------------------------------------------------
// Module-local imports kept at the bottom to mirror the bundle's late require()
// of fs/promises + path inside the module-init closure (sgo@455585, requires
// resolved @455608). In real source these would sit with the other imports.
// ---------------------------------------------------------------------------
import { promises as fs } from 'node:fs' // OQa = require("fs/promises") @455608
import path from 'node:path' // NQa = require("path") @455608
import { countWhere } from '../../utils/array.js' // Wn @455571
import { isENOENT } from '../../utils/errors.js' // ds @455573
import { SHELL_TOOL_NAMES } from '../../tools/BashTool/constants.js' // XO @221440
