// ============================================================================
// tasks/DreamTask/DreamTask.ts  —  v2.1.183 readable-source restoration
// ============================================================================
//
// Background task entry for auto-dream (memory consolidation subagent).
// Makes the otherwise-invisible forked agent visible in the footer pill
// ("dreaming") and the Shift+Down background-task dialog. The dream agent
// itself is unchanged — this is pure UI surfacing via the existing task
// registry.
//
// 2.1.183 regions covered (cli_inner_pretty.js):
//   - spo            @424675-424677  (isDreamTask type guard)
//   - xqa            @424678-424693  (registerDreamTask)
//   - kqa            @424694-424706  (addDreamTurn)
//   - Lqa            @424707-424711  (completeDreamTask)
//   - Dqa            @424712-424716  (failDreamTask)
//   - UDp = 30       @424717         (MAX_TURNS)
//   - b3n            @424724-424742  (the DreamTask object + kill)
//   - y3n            @424643-424656  (rollbackConsolidationLock; imported)
// 2.1.88 ancestor (shape + real names + logic):
//   src/tasks/DreamTask/DreamTask.ts
// scaffold doc: 31_auto_memory/README.md "DreamTask UI registry";
//   v2.1.156 auto_dream_runtime.md "DreamTask helpers (registerDreamTask /
//   finalizeDreamTask / rollbackDreamTask / isDreamTaskRecord)"
//
// Cross-validation (re-read live in the 183 bundle):
//   - Registry API moved from free functions (registerTask/updateTaskState,
//     taking setAppState) to a *registry object* with .register()/.update()/.get()
//     methods, passed as the first/last argument. See DELTA v2.1.x notes below.
//   - The task record gained `skipTranscript: true` (@424684), absent in the
//     88 ancestor.
//   - complete/fail/kill now emit telemetry + a task_notification system event
//     inline (Le/Me/Ng @424709/424714/424710/424715/424740), where the 88
//     ancestor's complete/fail/kill emitted nothing.
//   - Re-verified at the call site (autoDream runner @455468-455504): xqa(f,opts)
//     returns the id, x2p(A,f) is the onMessage->addDreamTurn handler, Lqa(A,f)
//     completes, taskRegistry.get(A) reads back filesTouched.
// ============================================================================

import { rollbackConsolidationLock } from '../../services/autoDream/consolidationLock.js'
import type { Task, TaskRegistry, TaskStateBase } from '../../Task.js'
import { createTaskStateBase, generateTaskId } from '../../Task.js'

// Keep only the N most recent turns for live display.
// 2.1.183: MAX_TURNS = UDp @cli_inner_pretty.js:424717
const MAX_TURNS = 30

// A single assistant turn from the dream agent, tool uses collapsed to a count.
export type DreamTurn = {
  text: string
  toolUseCount: number
}

// No phase detection — the dream prompt has a 4-stage structure
// (orient/gather/consolidate/prune) but we don't parse it. Just flip from
// 'starting' to 'updating' when the first Edit/Write tool_use lands.
export type DreamPhase = 'starting' | 'updating'

export type DreamTaskState = TaskStateBase & {
  type: 'dream'
  status: 'running' | 'completed' | 'failed' | 'killed'
  // DELTA v2.1.x: the record is created with skipTranscript:true
  // (@cli_inner_pretty.js:424684). The dream fork runs with skipTranscript so
  // its messages are never written to the session transcript; the flag rides on
  // the task record and is echoed into every task_notification event (Ng).
  skipTranscript: true
  phase: DreamPhase
  sessionsReviewing: number
  /**
   * Paths observed in Edit/Write tool_use blocks via onMessage. This is an
   * INCOMPLETE reflection of what the dream agent actually changed — it misses
   * any bash-mediated writes and only captures the tool calls we pattern-match.
   * Treat as "at least these were touched", not "only these were touched".
   */
  filesTouched: string[]
  /** Assistant text responses, tool uses collapsed. Prompt is NOT included. */
  turns: DreamTurn[]
  abortController?: AbortController
  /** Stashed so kill can rewind the lock mtime (same path as fork-failure). */
  priorMtime: number
}

// 2.1.183: isDreamTask = spo @cli_inner_pretty.js:424675
export function isDreamTask(task: unknown): task is DreamTaskState {
  return (
    typeof task === 'object' &&
    task !== null &&
    'type' in task &&
    task.type === 'dream'
  )
}

// 2.1.183: registerDreamTask = xqa @cli_inner_pretty.js:424678
//
// DELTA v2.1.x: the first argument is now the TaskRegistry object (`e.register(r)`
// @424692), not a `setAppState` callback. The 88 ancestor signature was
// `registerDreamTask(setAppState, opts)` calling the free `registerTask(task, setAppState)`.
// The description "dreaming" is what surfaces as the footer pill (pillLabel
// 'dream' -> "dreaming" @cli_inner_pretty.js:382804-382805).
export function registerDreamTask(
  taskRegistry: TaskRegistry,
  opts: {
    sessionsReviewing: number
    priorMtime: number
    abortController: AbortController
  },
): string {
  // 2.1.183: lj('dream') @cli_inner_pretty.js:424679 (id prefix 'd')
  const id = generateTaskId('dream')
  const task: DreamTaskState = {
    // 2.1.183: c0(id, 'dream', 'dreaming') @424681 (createTaskStateBase)
    ...createTaskStateBase(id, 'dream', 'dreaming'),
    type: 'dream',
    status: 'running',
    skipTranscript: true, // DELTA v2.1.x: @cli_inner_pretty.js:424684
    phase: 'starting',
    sessionsReviewing: opts.sessionsReviewing,
    filesTouched: [],
    turns: [],
    abortController: opts.abortController,
    priorMtime: opts.priorMtime,
  }
  taskRegistry.register(task) // DELTA v2.1.x: registry method, was registerTask(task, setAppState)
  return id
}

// 2.1.183: addDreamTurn = kqa @cli_inner_pretty.js:424694
//
// DELTA v2.1.x: the trailing argument is the TaskRegistry (`r.update(e, …)`
// @424695); the 88 ancestor took `setAppState` and called the free
// `updateTaskState`. Driven from the dream fork's onMessage handler
// (x2p(taskId, registry) @cli_inner_pretty.js:455499).
export function addDreamTurn(
  taskId: string,
  turn: DreamTurn,
  touchedPaths: string[],
  taskRegistry: TaskRegistry,
): void {
  taskRegistry.update<DreamTaskState>(taskId, task => {
    // Dedupe against already-seen paths; Set.add() in the filter doubles as the
    // "remember it" side-effect (the && short-circuits so add only runs on new).
    const seen = new Set(task.filesTouched)
    const newTouched = touchedPaths.filter(p => !seen.has(p) && seen.add(p))
    // Skip the update entirely if the turn is empty AND nothing new was
    // touched. Avoids re-rendering on pure no-ops. @424698
    if (
      turn.text === '' &&
      turn.toolUseCount === 0 &&
      newTouched.length === 0
    ) {
      return task
    }
    return {
      ...task,
      // First Edit/Write touch flips the phase 'starting' -> 'updating'. @424701
      phase: newTouched.length > 0 ? 'updating' : task.phase,
      filesTouched:
        newTouched.length > 0
          ? [...task.filesTouched, ...newTouched]
          : task.filesTouched,
      // Ring-buffer the turns: keep the last MAX_TURNS-1, then append this one. @424703
      turns: task.turns.slice(-(MAX_TURNS - 1)).concat(turn),
    }
  })
}

// 2.1.183: completeDreamTask = Lqa @cli_inner_pretty.js:424707
//
// notified: true immediately — dream has no model-facing notification path
// (it's UI-only), and eviction requires terminal + notified. The inline
// appendSystemMessage / pendingMemoryUpdates completion note IS the user surface.
//
// DELTA v2.1.x: in addition to the state update, this now fires telemetry and a
// task_notification system event inline (the 88 ancestor's completeDreamTask only
// flipped state):
//   - Le('task_dream')                               -> tengu_feature_ok @424709
//   - notifyTask(taskId,'completed',{skipTranscript}) -> task_notification @424710
export function completeDreamTask(
  taskId: string,
  taskRegistry: TaskRegistry,
): void {
  taskRegistry.update<DreamTaskState>(taskId, task => ({
    ...task,
    status: 'completed',
    endTime: Date.now(),
    notified: true,
    abortController: undefined,
  }))
  telemetryFeatureOk('task_dream') // DELTA v2.1.x: Le('task_dream') @424709
  notifyTaskStatus(taskId, 'completed', { skipTranscript: true }) // DELTA v2.1.x: Ng @424710
}

// 2.1.183: failDreamTask = Dqa @cli_inner_pretty.js:424712
//
// DELTA v2.1.x: emits failure telemetry + a 'failed' task_notification inline:
//   - Me('task_dream','task_dream_failed') -> tengu_feature_bad @424714
//   - notifyTask(taskId,'failed',{skipTranscript}) -> task_notification @424715
export function failDreamTask(
  taskId: string,
  taskRegistry: TaskRegistry,
): void {
  taskRegistry.update<DreamTaskState>(taskId, task => ({
    ...task,
    status: 'failed',
    endTime: Date.now(),
    notified: true,
    abortController: undefined,
  }))
  telemetryFeatureBad('task_dream', 'task_dream_failed') // DELTA v2.1.x: Me @424714
  notifyTaskStatus(taskId, 'failed', { skipTranscript: true }) // DELTA v2.1.x: Ng @424715
}

// 2.1.183: DreamTask = b3n @cli_inner_pretty.js:424724
export const DreamTask: Task = {
  name: 'DreamTask',
  type: 'dream',

  // 2.1.183: kill @cli_inner_pretty.js:424727
  //
  // DELTA v2.1.x: signature takes the TaskRegistry (`t.update(e, …)` @424730),
  // not setAppState; and a 'stopped' task_notification is emitted before the
  // lock rollback (Ng @424740). The 88 ancestor's kill emitted nothing.
  async kill(taskId, taskRegistry) {
    let priorMtime: number | undefined
    taskRegistry.update<DreamTaskState>(taskId, task => {
      if (task.status !== 'running') return task
      task.abortController?.abort()
      priorMtime = task.priorMtime
      return {
        ...task,
        status: 'killed',
        endTime: Date.now(),
        notified: true,
        abortController: undefined,
      }
    })
    // Rewind the lock mtime so the next session can retry. Same path as the
    // fork-failure catch in autoDream.ts (Dqa(...); await y3n(d) @455542). If
    // update was a no-op (already terminal), priorMtime stays undefined and we
    // skip both the notification and the rollback. @424738
    if (priorMtime !== undefined) {
      // DELTA v2.1.x: emit 'stopped' notification before rollback. @424740
      notifyTaskStatus(taskId, 'stopped', { skipTranscript: true })
      // 2.1.183: rollbackConsolidationLock = y3n @cli_inner_pretty.js:424643
      await rollbackConsolidationLock(priorMtime)
    }
  },
}

// ---------------------------------------------------------------------------
// Telemetry + notification shims (cross-module helpers used inline in 183).
// These live in the shared telemetry / task-framework layers, not in this file;
// they are declared here only to make the DELTA call sites above type-check in
// isolation. In the real tree they are imported from those modules.
// ---------------------------------------------------------------------------

// 2.1.183: telemetryFeatureOk = Le @cli_inner_pretty.js:44569 (emits tengu_feature_ok)
declare function telemetryFeatureOk(feature: string): void
// 2.1.183: telemetryFeatureBad = Me @cli_inner_pretty.js:44572 (emits tengu_feature_bad)
declare function telemetryFeatureBad(feature: string, errorCode: string): void
// 2.1.183: notifyTaskStatus = Ng @cli_inner_pretty.js:234046 (enqueues a
//   {type:'system', subtype:'task_notification', status, skip_transcript} SDK event)
declare function notifyTaskStatus(
  taskId: string,
  status: 'completed' | 'failed' | 'stopped',
  opts: { skipTranscript: true },
): void
