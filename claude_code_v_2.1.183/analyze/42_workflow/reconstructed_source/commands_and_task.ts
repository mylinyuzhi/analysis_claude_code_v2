/**
 * commands_and_task.ts — Workflow launch sibling, lifecycle registry, save, and the
 * `/workflows` slash command + tool-name exports.
 *
 * This file is the *launch sibling* that `tools/WorkflowTool/WorkflowTool.tsx`'s `call`
 * delegates to (`launchWorkflowRun`), plus the `LocalWorkflowTask` lifecycle module
 * (the bundle's `odo` export namespace), the `saveWorkflow` persistence path, the
 * `/workflows` local-jsx command, and the small tool-name constants/exports
 * (`WORKFLOW_TOOL_NAME`, `CODE_REVIEW_WORKFLOW_NAME`, `STRUCTURED_OUTPUT_TOOL_NAME`).
 *
 * ── Evidence (v2.1.183 obfuscated bundle: cli_inner_pretty.js) ──────────────────────
 *   launchWorkflowRun (call body)   = (inline in DLp.call)  @419541-419788
 *   registerWorkflowTask            = edo                   @411078-411118
 *   updateWorkflowProgressBatch     = tdo                   @411119-411168
 *   completeWorkflowTask            = ndo                   @411189-411196
 *   failWorkflowTask                = bjn                   @411197-411200
 *   pauseWorkflowTask               = Rjt                   @411201-411203
 *   killWorkflowTask                = gye                   @411208-411212
 *   skipWorkflowAgent               = $jt                   @411227-411229
 *   retryWorkflowAgent              = Ojt                   @411230-411232
 *   buildResumePrompt               = rdo                   @411204-411207
 *   enqueueWorkflowNotification     = Sjn                   @411233-411314
 *   transitionWorkflowTask (helper) = _jn                   @411169-411188
 *   abortWorkflowAgent (helper)     = KGa                   @411213-411226
 *   buildWorkflowTaskRecord (UI)    = kmf                   @562072-562101
 *   LocalWorkflowTask               = M0p                   @411332-411338
 *   workflowExports module          = odo / gt(odo,{...})   @411064-411077
 *   saveWorkflow                    = oHl                   @530752-530775
 *   resolveWorkflowSaveDir (helper) = Fof                   @530744-530751
 *   workflowsCommand                = jmf / Gmf             @562632-562641   (immediate:!0 — the 183 delta)
 *   WORKFLOW_TOOL_NAME              = zk                    @221550          ("Workflow")
 *   CODE_REVIEW_WORKFLOW_NAME       = Utt                   @221551          ("code-review")
 *   workflowToolExports namespace   = y1i / gt(y1i,{...})   @221548-221549
 *   STRUCTURED_OUTPUT_TOOL_NAME     = Em                    @221489          ("StructuredOutput")
 *   generateTaskId                  = lj                    @575439-575445   (prefix from Syf, "w" for local_workflow)
 *   createTaskStateBase             = c0                    @575446-575458
 *   getTaskIdPrefix                 = Eyf / Syf             @575436-575437 / @575467-575476
 *   claimTaskOutputFile             = Alt                   @575360-575371
 *   getTaskOutputPath               = fg                    @575229-575231
 *   slugifyWorkflowName             = Ume                   @152098-152105
 *   persistWorkflowScript           = Lgi                   @152112-152124
 *   resolveWorkflowTranscriptDir    = Out                   @416717-416720
 *   writeWorkflowSnapshot           = uWa                   @416721-416733
 *   compileWorkflowScript           = Mjn                   @416383-416404   (in runtime.ts)
 *   runWorkflowScript               = MWa                   @418079-418154   (in runtime.ts)
 *   emitTaskProgress                = Xlt                   @370413-370425
 *   invalidateWorkflowCaches        = Ujn                   @418003-418005
 *
 * ── 2.1.88 convention mirror (named-TS, feature-gated out via feature('WORKFLOW_SCRIPTS')) ──
 *   Task.ts                              — generateTaskId / createTaskStateBase / TASK_ID_PREFIXES
 *                                          ('local_workflow' → 'w'), 36-char alphabet (verbatim match to 183).
 *   tasks/LocalWorkflowTask/LocalWorkflowTask.ts — the lifecycle module shape (mirrored here).
 *   commands/workflows/index.ts          — the local-jsx Command object shape.
 *   tools/WorkflowTool/createWorkflowCommand.ts / toolName.ts — name/exports placement.
 *   commands/review.ts                   — a real local-jsx Command for the object shape.
 *
 * ── 2.1.156 baseline scaffold ──────────────────────────────────────────────────────
 *   42_workflow/gate_caps_lifecycle_relations.md  Part 5 (launch→flush→completion lifecycle,
 *     telemetry & UI), §5.1 fire-and-forget call, §5.2 16ms-batched progress flush, §5.3
 *     completion telemetry, §5.5 save & `/workflows` command.
 *   42_workflow/workflow_tool_definition.md §9 (call).
 *
 * ── Cross-validation note ──────────────────────────────────────────────────────────
 *   Re-verified against the 183 bundle: `jmf` carries `immediate:!0` + the reworded
 *   description "Browse running and completed workflows" (562632-562641); `oHl` emits
 *   `tengu_workflow_saved {scope, overwrite, script_size_chars}` (530772); the call body
 *   returns `{data:{status:"async_launched", taskId, taskType:"local_workflow", workflowName,
 *   runId, summary, transcriptDir, scriptPath}}` IMMEDIATELY while an IIFE runs `MWa`
 *   (419775-419786); compile failure returns async_launched WITH `error` and no throw
 *   (419552-419567); `lj("local_workflow")` mints the `w<8 base36>` task id (575439, prefix
 *   map 575472); `edo` registers via `taskRegistry.register` (411117); lifecycle exports
 *   read straight off the bundle's own readable `odo` export table (411065-411076).
 */

import { randomUUID } from 'node:crypto'

// ── Runtime (sibling: runtime.ts) ────────────────────────────────────────────────────
import {
  compileWorkflowScript, // Mjn @416383 — Function() pre-check + new vm.Script
  runWorkflowScript, // MWa @418079 — the VM executor (load journal, runInContext, abort race)
  WorkflowJournal, // ldo @416833 — per-run resume journal
} from './runtime.js'

// ── Source / meta (siblings: source.ts, meta.ts) ──────────────────────────────────────
import { resolveWorkflowSource } from './source.js' // n5a @419272
import { parseWorkflowMeta } from './meta.js' // m0 @416466

// ── Tool error / retraction (Vjn @419409 — declared in schemas.ts, the schema/error module) ──
import { WorkflowInputError } from './schemas.js' // Vjn @419409

// ── Generic task plumbing (convention: Task.ts) ───────────────────────────────────────
import {
  generateTaskId, // lj @575439 — prefix("local_workflow")="w" + 8 base36 chars
  createTaskStateBase, // c0 @575446
  claimTaskOutputFile, // Alt @575360 — O_EXCL-create the per-task .output file
  getTaskOutputPath, // fg @575229
  type TaskRegistry,
  type ToolUseContext,
} from '../../Task.js'

// ── Workflow filesystem helpers (siblings) ────────────────────────────────────────────
import {
  slugifyWorkflowName, // Ume @152098
  persistWorkflowScript, // Lgi @152112 — write <slug>-<runId>.js, return its path
  resolveWorkflowTranscriptDir, // Out @416717 — <projectStateDir>/subagents/workflows/<runId>
  writeWorkflowSnapshot, // uWa @416721 — <runId>.json snapshot for /workflows history
  resolveWorkflowSaveDir, // Fof @530744 — user vs project workflows dir
  invalidateWorkflowCaches, // Ujn @418003 — clear workflow + command caches after a write
} from './workflowPaths.js'

// ── UI / telemetry plumbing ──────────────────────────────────────────────────────────
import { emitTaskProgress } from '../../tasks/emitTaskProgress.js' // Xlt @370413
import { logEvent } from '../../telemetry.js' // G @<telemetry>
import { sanitizeForTelemetry as san } from '../../telemetry.js' // Ne/Qe (free-form → bucketed)
import { isInteractive } from '../../terminal.js' // xr @<terminal> — TTY gate for live progress

// ─────────────────────────────────────────────────────────────────────────────────────
// Tool-name constants + the lazy export namespaces.
//
// In the bundle these live in a tiny module whose `gt(y1i, {...})` table exposes the two
// names as lazy getters (`WORKFLOW_TOOL_NAME`/`CODE_REVIEW_WORKFLOW_NAME`). The
// StructuredOutput name `Em` sits in the StructuredOutput tool module; it is re-exported
// here because the workflow structured-output subagent forces a call to that tool by name.
//
// 2.1.183: WORKFLOW_TOOL_NAME = zk @221550 ; CODE_REVIEW_WORKFLOW_NAME = Utt @221551
//          workflowExports namespace = y1i / gt(y1i,{...}) @221548-221549
//          STRUCTURED_OUTPUT_TOOL_NAME = Em @221489
// 2.1.88 convention: tools/WorkflowTool/toolName.ts
// ─────────────────────────────────────────────────────────────────────────────────────

// 2.1.183: zk @221550
export const WORKFLOW_TOOL_NAME = 'Workflow'

// 2.1.183: Utt @221551
export const CODE_REVIEW_WORKFLOW_NAME = 'code-review'

// 2.1.183: Em @221489 — the StructuredOutput tool's name; the workflow "structured" subagent
// prompt forces exactly one call to this tool to return JSON.
export const STRUCTURED_OUTPUT_TOOL_NAME = 'StructuredOutput'

// ─────────────────────────────────────────────────────────────────────────────────────
// LocalWorkflowTask — the task-type descriptor registered with the background-task system.
//
// Mirrors Task.ts's TaskType plug-in shape: a `name`, the `type` discriminator, and a
// `kill` hook. `kill` just routes to `killWorkflowTask` (which aborts the run and emits a
// "stopped" notification).
//
// 2.1.183: LocalWorkflowTask = M0p @411332-411338
// 2.1.88 convention: tasks/LocalWorkflowTask/LocalWorkflowTask.ts
// ─────────────────────────────────────────────────────────────────────────────────────
export const LocalWorkflowTask = {
  name: 'LocalWorkflowTask',
  type: 'local_workflow' as const,
  async kill(taskId: string, taskRegistry: TaskRegistry): Promise<void> {
    killWorkflowTask(taskId, taskRegistry) // @411336 gye
  },
}

// ─────────────────────────────────────────────────────────────────────────────────────
// registerWorkflowTask — create the `running` local_workflow task record and register it.
//
// Builds the base task state via createTaskStateBase (c0), layers on all workflow-specific
// fields (script/scriptPath/args/phases/run id/progress buffers/counters), attaches a fresh
// AbortController plus a per-agent controller Map, and registers it with the task registry.
// The returned record is the live handle the launch IIFE updates as the run progresses.
//
// `claimTaskOutputFile(taskId)` (Alt) is called first to O_EXCL-create the task's `.output`
// sink so two registrations can't collide on the same id.
//
// 2.1.183: registerWorkflowTask = edo @411078-411118
// 2.1.88 convention: createTaskStateBase mirrors Task.ts createTaskStateBase.
// ─────────────────────────────────────────────────────────────────────────────────────
export interface RegisterWorkflowTaskArgs {
  taskId: string
  script: string
  scriptPath: string
  args?: unknown
  summary?: string
  workflowName?: string
  title?: string
  phases?: { title: string }[]
  defaultModel?: string
  workflowRunId: string
  taskRegistry: TaskRegistry
  toolUseId?: string
}

export function registerWorkflowTask(args: RegisterWorkflowTaskArgs) {
  const {
    taskId,
    script,
    scriptPath,
    args: scriptArgs,
    summary,
    workflowName,
    title,
    phases,
    defaultModel,
    workflowRunId,
    taskRegistry,
    toolUseId,
  } = args

  claimTaskOutputFile(taskId) // @411092 Alt — reserve the .output file (O_EXCL)

  const abortController = new AbortController() // @411093 Xl(0)
  const task = {
    // @411095 — c0(taskId, "local_workflow", summary ?? "Dynamic workflow", toolUseId)
    ...createTaskStateBase(taskId, 'local_workflow', summary ?? 'Dynamic workflow', toolUseId),
    type: 'local_workflow' as const, // @411096
    status: 'running' as const, // @411097
    script, // @411098
    scriptPath, // @411099
    args: scriptArgs, // @411100
    prompt: script, // @411101 — the model-facing "prompt" is the script itself
    summary, // @411102
    workflowName, // @411103
    title, // @411104
    phases, // @411105
    defaultModel, // @411106
    workflowRunId, // @411107
    workflowProgress: [] as WorkflowProgressEvent[], // @411108
    progressVersion: 0, // @411109
    agentCount: 0, // @411110
    totalTokens: 0, // @411111
    totalToolCalls: 0, // @411112
    logs: [] as string[], // @411113
    abortController, // @411114
    agentControllers: new Map<string, AbortController>(), // @411115
  }

  taskRegistry.register(task) // @411117
  return task
}

// ─────────────────────────────────────────────────────────────────────────────────────
// updateWorkflowProgressBatch — fold a batch of progress events into a task record.
//
// Coalescing semantics, run inside `taskRegistry.update`:
//   · `workflow_agent`/`workflow_phase` events are keyed by `${type}:${index}` and REPLACE
//     the existing entry for that key (live agents update in place); everything else (logs)
//     is appended.                                                                @411125-411138
//   · agentCount tracks the max agent index seen at a `workflow_agent` "start".    @411137
//   · log-trimming: once the progress array grows past `WORKFLOW_PROGRESS_CAP*2`, the oldest
//     `workflow_log` entries are dropped down to the cap so a chatty `log()` can't grow the
//     array unbounded (agent/phase rows are never dropped).                        @411139-411151
//   · totalTokens/totalToolCalls are re-summed from the surviving `workflow_agent` rows.  @411152-411158
//   · progressVersion advances by the batch size so consumers can detect staleness.  @411162
//
// No-op if status !== "running" (a completed task is frozen).                       @411122
//
// 2.1.183: updateWorkflowProgressBatch = tdo @411119-411168
// ─────────────────────────────────────────────────────────────────────────────────────
const WORKFLOW_PROGRESS_CAP = 500 // VGa @411316

export function updateWorkflowProgressBatch(
  taskId: string,
  batch: WorkflowProgressEvent[],
  taskRegistry: TaskRegistry,
): void {
  if (batch.length === 0) return // @411120
  taskRegistry.update(taskId, (task) => {
    if (task.status !== 'running') return task // @411122 — frozen

    const progress = [...task.workflowProgress]
    const indexByKey = new Map<string, number>()
    for (let i = 0; i < progress.length; i++) {
      const e = progress[i]
      if (e.type === 'workflow_agent' || e.type === 'workflow_phase') {
        indexByKey.set(`${e.type}:${e.index}`, i) // @411127
      }
    }

    let agentCount = task.agentCount
    let appendedNonAgentRow = false
    for (const event of batch) {
      if (event.type === 'workflow_agent' || event.type === 'workflow_phase') {
        const key = `${event.type}:${event.index}`
        const at = indexByKey.get(key)
        if (at !== undefined) {
          progress[at] = event // @411135 — replace in place
        } else {
          indexByKey.set(key, progress.length)
          progress.push(event) // @411136
        }
        if (event.type === 'workflow_agent' && event.state === 'start') {
          agentCount = Math.max(agentCount, event.index) // @411137
        }
      } else {
        progress.push(event) // @411138 — logs append
        appendedNonAgentRow = true
      }
    }

    // Trim oldest workflow_log rows once we're past 2× the cap. @411139-411151
    let trimmed = progress
    if (appendedNonAgentRow && progress.length > WORKFLOW_PROGRESS_CAP * 2) {
      let toDrop = progress.length - WORKFLOW_PROGRESS_CAP
      const kept: WorkflowProgressEvent[] = []
      for (const e of progress) {
        if (toDrop > 0 && e.type === 'workflow_log') {
          toDrop--
          continue
        }
        kept.push(e)
      }
      trimmed = kept
    }

    // Re-sum token/tool counters from surviving agent rows. @411152-411158
    let totalTokens = 0
    let totalToolCalls = 0
    for (const e of trimmed) {
      if (e.type === 'workflow_agent') {
        if (e.tokens) totalTokens += e.tokens
        if (e.toolCalls) totalToolCalls += e.toolCalls
      }
    }

    return {
      ...task,
      workflowProgress: trimmed,
      progressVersion: task.progressVersion + batch.length, // @411162
      agentCount,
      totalTokens,
      totalToolCalls,
    }
  })
}

// ─────────────────────────────────────────────────────────────────────────────────────
// transitionWorkflowTask — the shared terminal-state transition (completed/failed/killed/paused).
//
// Inside `update`: ignore unless still "running"; capture the prior snapshot, abort its
// controller, stamp endTime, apply the caller's patch + new status, and set `evictAfter`
// (a TTL) for terminal states so the record is GC'd from the registry later. Clears the
// abort controllers so they can't be reused. Returns the PRE-transition snapshot (used by
// callers to write the snapshot file / read final counters).
//
// 2.1.183: transitionWorkflowTask = _jn @411169-411188
// ─────────────────────────────────────────────────────────────────────────────────────
function transitionWorkflowTask(
  taskId: string,
  taskRegistry: TaskRegistry,
  status: 'completed' | 'failed' | 'killed' | 'paused',
  patch: Record<string, unknown>,
) {
  let prior: any = null
  taskRegistry.update(taskId, (task) => {
    if (task.status !== 'running') return task // @411173
    prior = task
    task.abortController?.abort() // @411174 — stop the run
    const endTime = Date.now()
    return {
      ...task,
      ...patch,
      status,
      endTime,
      ...(isTerminalStatus(status) && { evictAfter: endTime + TASK_EVICT_TTL_MS }), // @411181
      abortController: undefined,
      agentControllers: undefined,
    }
  })
  return prior
}

// ─────────────────────────────────────────────────────────────────────────────────────
// completeWorkflowTask — mark a run "completed", write its .output file, fire task metric.
// 2.1.183: completeWorkflowTask = ndo @411189-411196
// ─────────────────────────────────────────────────────────────────────────────────────
export function completeWorkflowTask(
  taskId: string,
  result: unknown,
  agentCount: number,
  logs: string[],
  taskRegistry: TaskRegistry,
): void {
  const prior = transitionWorkflowTask(taskId, taskRegistry, 'completed', { result, agentCount, logs })
  if (!prior) return
  // Persist a compact .output blob; failures are logged, never thrown. @411192-411194
  writeTaskOutputFile(
    prior.outputFile,
    JSON.stringify({ summary: prior.summary, agentCount, logs, result }, null, 2),
  ).catch((err) =>
    logWarn(`Failed to write workflow output for ${taskId}: ${err instanceof Error ? err.message : err}`),
  )
  recordTaskMetric('task_local_workflow') // @411195 Le(...)
}

// ─────────────────────────────────────────────────────────────────────────────────────
// failWorkflowTask — mark a run "failed", drop its output sink, fire the failure metric.
// 2.1.183: failWorkflowTask = bjn @411197-411200
// ─────────────────────────────────────────────────────────────────────────────────────
export function failWorkflowTask(
  taskId: string,
  error: string,
  agentCount: number,
  logs: string[],
  taskRegistry: TaskRegistry,
): void {
  const prior = transitionWorkflowTask(taskId, taskRegistry, 'failed', { error, agentCount, logs })
  releaseTaskOutputFile(taskId) // @411199 i_(taskId)
  if (prior) recordTaskMetricFailed('task_local_workflow', 'task_local_workflow_failed') // @411199 Me(...)
}

// ─────────────────────────────────────────────────────────────────────────────────────
// pauseWorkflowTask — mark a run "paused" and pre-notify so it won't notify again on resume.
// Returns true if it was running (and so actually paused).
// 2.1.183: pauseWorkflowTask = Rjt @411201-411203
// ─────────────────────────────────────────────────────────────────────────────────────
export function pauseWorkflowTask(taskId: string, taskRegistry: TaskRegistry): boolean {
  return transitionWorkflowTask(taskId, taskRegistry, 'paused', { notified: true }) !== null
}

// ─────────────────────────────────────────────────────────────────────────────────────
// killWorkflowTask — mark a run "killed", release the sink, post a "stopped" task event.
// Returns true if it was running.
// 2.1.183: killWorkflowTask = gye @411208-411212
// ─────────────────────────────────────────────────────────────────────────────────────
export function killWorkflowTask(taskId: string, taskRegistry: TaskRegistry): boolean {
  const prior = transitionWorkflowTask(taskId, taskRegistry, 'killed', { notified: true })
  if (prior) {
    releaseTaskOutputFile(taskId) // @411210 i_(taskId)
    postTaskStateChange(taskId, 'stopped', { toolUseId: prior.toolUseId, summary: prior.description }) // @411210 Ng(...)
  }
  return prior !== null
}

// ─────────────────────────────────────────────────────────────────────────────────────
// abortWorkflowAgent / skipWorkflowAgent / retryWorkflowAgent — abort a single in-flight
// agent within a running workflow (by agentId), tagging the reason so the run can retry or
// skip it. Returns true if an un-aborted controller was found and aborted.
//
// 2.1.183: abortWorkflowAgent = KGa @411213-411226 ; skipWorkflowAgent = $jt @411227-411229 ;
//          retryWorkflowAgent = Ojt @411230-411232
// ─────────────────────────────────────────────────────────────────────────────────────
function abortWorkflowAgent(
  taskId: string,
  agentId: string,
  reason: 'user-skip' | 'user-retry',
  taskRegistry: TaskRegistry,
): boolean {
  let aborted = false
  taskRegistry.update(taskId, (task) => {
    if (task.status !== 'running') return task // @411217
    const controller = task.agentControllers?.get(agentId)
    if (controller && !controller.signal.aborted) {
      controller.abort(reason) // @411219
      aborted = true
    }
    return task
  })
  if (aborted) {
    recordTaskMetric(reason === 'user-skip' ? 'task_local_workflow_skip_agent' : 'task_local_workflow_retry_agent') // @411224
  }
  return aborted
}

export function skipWorkflowAgent(taskId: string, agentId: string, taskRegistry: TaskRegistry): boolean {
  return abortWorkflowAgent(taskId, agentId, 'user-skip', taskRegistry) // @411228
}

export function retryWorkflowAgent(taskId: string, agentId: string, taskRegistry: TaskRegistry): boolean {
  return abortWorkflowAgent(taskId, agentId, 'user-retry', taskRegistry) // @411231
}

// ─────────────────────────────────────────────────────────────────────────────────────
// buildResumePrompt — the recovery hint shown when a paused workflow can be resumed.
// 2.1.183: buildResumePrompt = rdo @411204-411207
// ─────────────────────────────────────────────────────────────────────────────────────
export function buildResumePrompt(task: {
  scriptPath: string
  workflowRunId: string
  args?: unknown
}): string {
  const argsClause = task.args !== undefined ? `, args: ${JSON.stringify(task.args)}` : '' // @411205
  return (
    `Resume the paused workflow by calling: ` +
    `Workflow({scriptPath: '${task.scriptPath}', resumeFromRunId: '${task.workflowRunId}'${argsClause}}) ` +
    `— completed agents return cached results.` // @411206
  )
}

// ─────────────────────────────────────────────────────────────────────────────────────
// enqueueWorkflowNotification — post the <task-notification> the model sees when a run ends.
//
// Idempotent via the task's `notified` flag (set under `update`); aborts any speculative
// turn, then builds an XML-ish notification with: a status sentence, an optional <recovery>
// block (resume command + transcript dir) for failed/killed runs, an optional truncated
// <result> block (8 KB cap, with a pointer to the full output file), an optional <failures>
// block, and a <usage> block (agent_count / subagent_tokens / tool_uses / duration_ms).
// The notification is enqueued at "next" priority so the model picks it up on its next turn.
//
// 2.1.183: enqueueWorkflowNotification = Sjn @411233-411314
// ─────────────────────────────────────────────────────────────────────────────────────
const WORKFLOW_RESULT_NOTIFICATION_CAP = 8000 // @411289-411290

export interface EnqueueWorkflowNotificationArgs {
  taskId: string
  summary?: string
  status: 'completed' | 'failed' | 'killed'
  result?: unknown
  failures?: string[]
  error?: string
  agentCount: number
  totalTokens: number
  totalToolCalls: number
  durationMs: number
  taskRegistry: TaskRegistry
  toolUseId?: string
  transcriptDir?: string
  scriptPath?: string
  workflowRunId?: string
  args?: unknown
}

export function enqueueWorkflowNotification(a: EnqueueWorkflowNotificationArgs): void {
  // Idempotency latch — only the first call notifies. @411251-411259
  let didLatch = false
  a.taskRegistry.update(a.taskId, (task) => {
    if (task.notified) return task
    didLatch = true
    return { ...task, notified: true }
  })
  if (!didLatch) return

  a.taskRegistry.abortSpeculation() // @411260
  const name = a.summary ?? 'Dynamic workflow'

  // Headline sentence. @411262-411267
  const headline =
    a.status === 'completed'
      ? `Dynamic workflow "${name}" completed`
      : a.status === 'failed'
        ? `Dynamic workflow "${name}" failed: ${a.error || 'Unknown error'}`
        : `Dynamic workflow "${name}" was stopped`

  // <recovery> block for failed/killed runs. @411268-411280
  let recovery = ''
  if (a.status === 'failed' || a.status === 'killed') {
    const lines: string[] = []
    if (a.scriptPath && a.workflowRunId) {
      const argsClause = a.args !== undefined ? `, args: ${JSON.stringify(a.args)}` : ''
      lines.push(
        `To resume after editing the script, call: ` +
          `Workflow({scriptPath: '${a.scriptPath}', resumeFromRunId: '${a.workflowRunId}'${argsClause}})`,
      )
    }
    if (a.transcriptDir) lines.push(`Agent transcripts: ${a.transcriptDir}`)
    if (lines.length > 0) recovery = `\n<recovery>${lines.join('\n')}</recovery>`
  }

  // <result> block (truncated at 8 KB, with a pointer to the full output file). @411286-411297
  const outputFile = getTaskOutputPath(a.taskId) // @411281 fg(taskId)
  let resultBlock = ''
  if (a.status === 'completed' && a.result !== undefined) {
    const text = stripAnsi(JSON.stringify(a.result)) // @411288 Kp(Re(result))
    if (text.length > WORKFLOW_RESULT_NOTIFICATION_CAP) {
      resultBlock =
        `\n<result>${text.slice(0, WORKFLOW_RESULT_NOTIFICATION_CAP)}` +
        `\n... (truncated ${text.length - WORKFLOW_RESULT_NOTIFICATION_CAP} chars, full result in ${outputFile})</result>`
    } else {
      resultBlock = `\n<result>${text}</result>`
    }
  }

  // <failures> + <usage>. @411298-411306
  const failuresBlock = a.failures?.length ? `\n<failures>${stripAnsi(a.failures.join('\n'))}</failures>` : ''
  const usageBlock =
    `\n<usage><agent_count>${a.agentCount}</agent_count>` +
    `<subagent_tokens>${a.totalTokens}</subagent_tokens>` +
    `<tool_uses>${a.totalToolCalls}</tool_uses>` +
    `<duration_ms>${a.durationMs}</duration_ms></usage>`

  // NB: the tag names are interned constants (45659-45665): mp="task-notification",
  // Xy="task-id", _M="tool-use-id", bM="output-file", yy="status", Om="summary"
  // (the "headline" sentence is wrapped in the <summary> tag, hyphenated tag names).
  const toolUseTag = a.toolUseId ? `\n<tool-use-id>${a.toolUseId}</tool-use-id>` : '' // @411282-411285 _M
  const notification =
    `<task-notification>\n` + // mp
    `<task-id>${a.taskId}</task-id>${toolUseTag}\n` + // Xy
    `<output-file>${outputFile}</output-file>\n` + // bM
    `<status>${a.status}</status>\n` + // yy
    `<summary>${stripAnsi(headline)}</summary>${recovery}${resultBlock}${failuresBlock}${usageBlock}\n` + // Om
    `</task-notification>` // @411307-411312

  enqueueBackgroundMessage({
    value: notification,
    mode: 'task-notification',
    agentId: currentAgentId(),
    priority: 'next',
    taskId: a.taskId,
  }) // @411313 _f({...})
}

// ─────────────────────────────────────────────────────────────────────────────────────
// buildWorkflowTaskRecord — adapt a completed snapshot into a (notified, terminal) task
// record for the /workflows history viewer. (UI-side; mirrors the registry record shape but
// with `notified:true` and a derived endTime.)
//
// 2.1.183: buildWorkflowTaskRecord = kmf @562072-562101
// ─────────────────────────────────────────────────────────────────────────────────────
export function buildWorkflowTaskRecord(snapshot: WorkflowSnapshot) {
  return {
    id: snapshot.taskId,
    type: 'local_workflow' as const,
    description: snapshot.summary ?? 'Dynamic workflow', // @562076
    status: snapshot.status,
    startTime: snapshot.startTime,
    endTime: snapshot.startTime + snapshot.durationMs, // @562079
    toolUseId: undefined,
    outputFile: '',
    outputOffset: 0,
    notified: true, // @562083 — history records never re-notify
    script: snapshot.script,
    scriptPath: snapshot.scriptPath,
    prompt: snapshot.script,
    summary: snapshot.summary,
    workflowName: snapshot.workflowName,
    phases: snapshot.phases,
    defaultModel: snapshot.defaultModel,
    workflowRunId: snapshot.runId, // @562091
    workflowProgress: snapshot.workflowProgress,
    progressVersion: 0,
    agentCount: snapshot.agentCount,
    totalTokens: snapshot.totalTokens ?? 0,
    totalToolCalls: snapshot.totalToolCalls ?? 0,
    logs: snapshot.logs,
    result: snapshot.result,
    error: snapshot.error,
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// launchWorkflowRun — the fire-and-forget launcher delegated from WorkflowTool.tsx's `call`.
//
// This is the back half of the Workflow tool's `call` (the front half — resolve, parse, mint
// runId — runs in WorkflowTool.tsx and passes its results here). It:
//   1. compiles the script body to a VM script (compileWorkflowScript). On a syntax error it
//      RETURNS an `async_launched` result carrying `error` — it does NOT throw, so the model
//      gets a clean "syntax error, not launched" tool result.                     @419552-419567
//   2. resolves the transcript dir, persists the script to disk, emits `tengu_workflow_launched`.
//                                                                                  @419568-419584
//   3. on resume, prunes any non-running task with the same run id from the registry so the
//      resumed run replaces the stale one in the UI.                              @419585-419591
//   4. registers the running task (registerWorkflowTask).                          @419592-419605
//   5. spawns the VM in a background IIFE (runWorkflowScript) with a 16 ms-batched progress
//      flush, an agent-controller registry, a token budget, and the resume journal. On
//      completion it emits `tengu_workflow_completed` (+ per-phase rollups for built-in
//      workflows), writes the snapshot, routes the result into the registry, and posts the
//      completion notification. A top-level `.catch` guarantees even an unexpected throw
//      records a `failed` task and notifies.                                       @419609-419774
//   6. RETURNS IMMEDIATELY with `{data:{status:"async_launched", taskId, ...}}` — the IIFE
//      keeps running.                                                              @419775-419786
//
// 2.1.183: launchWorkflowRun = inline DLp.call body @419541-419788
// 2.1.156 scaffold: gate_caps_lifecycle_relations.md §5.1–§5.3
// ─────────────────────────────────────────────────────────────────────────────────────
export interface LaunchWorkflowRunArgs {
  input: WorkflowInput
  context: ToolUseContext
  canUseTool: unknown
  parentMessage: unknown
  onProgress: unknown
  script: string
  source: string // resolved source bucket: "scriptPath" | "inline" | "named" | "built-in" | ...
  resolvedScriptPath?: string
  meta: WorkflowMeta
  scriptBody: string
  runId: string
}

const PROGRESS_FLUSH_INTERVAL_MS = 16 // @419612 k = 16

export async function launchWorkflowRun(a: LaunchWorkflowRunArgs): Promise<WorkflowToolOutput> {
  const { input, context, meta, scriptBody, runId } = a

  const taskId = generateTaskId('local_workflow') // @419548 lj("local_workflow") → "w" + 8 base36
  const description = meta.description
  const workflowName = meta.name
  const title = meta.title

  // 1. Compile. On syntax error, return async_launched WITH error (no throw). @419552-419567
  const compiled = compileWorkflowScript(scriptBody) // @419552 Mjn(scriptBody)
  if (!compiled.ok) {
    recordTaskMetricFailed('task_local_workflow', 'compile_failed') // @419555 Me(...)
    return {
      data: {
        status: 'async_launched',
        taskId,
        taskType: 'local_workflow',
        workflowName,
        runId,
        summary: description,
        error: compiled.error,
      },
    }
  }

  // 2. Transcript dir + persist script + launch telemetry. @419568-419584
  const transcriptDir = resolveWorkflowTranscriptDir(runId) // @419568 Out(runId)
  const scriptPath = a.resolvedScriptPath ?? persistWorkflowScript(workflowName, runId, a.script) // @419569 Lgi(...)
  const invocationSource = input.scriptPath ? 'scriptPath' : (a.source ?? 'inline') // @419570
  const telemetryWorkflowName = bucketWorkflowName(workflowName, a.source) // @419571 xLp(...)
  const telemetryDescription = bucketWorkflowDescription(meta.description, a.source) // @419572 LLp(...)

  logEvent('tengu_workflow_launched', {
    invocation_mode: san(input.scriptPath ? 'scriptPath' : input.name ? 'named' : 'inline'), // @419575
    workflow_source: san(invocationSource),
    workflow_name: telemetryWorkflowName,
    workflow_description: telemetryDescription,
    phase_count: meta.phases?.length ?? 0, // @419579
    launched_from_subagent: context.agentId != null, // @419580
    has_args: input.args != null, // @419581
    is_resume: input.resumeFromRunId != null, // @419582
    script_size_chars: a.script.length, // @419583
  })

  // 3. Resume: prune stale non-running tasks for the same run id. @419585-419591
  if (input.resumeFromRunId != null) {
    recordTaskMetric('task_local_workflow_resume') // @419587
    for (const [id, task] of Object.entries(context.taskRegistry.all())) {
      if (
        task.type === 'local_workflow' &&
        task.workflowRunId === input.resumeFromRunId &&
        task.status !== 'running'
      ) {
        context.taskRegistry.remove(id) // @419590
      }
    }
  }

  // 4. Register the running task. @419592-419605
  const task = registerWorkflowTask({
    taskId,
    script: a.script,
    scriptPath,
    summary: description,
    workflowName,
    title,
    phases: meta.phases,
    defaultModel: context.options.mainLoopModel, // @419600
    workflowRunId: runId,
    args: input.args,
    taskRegistry: context.taskRegistry,
    toolUseId: context.toolUseId,
  })

  // The VM run uses the task's abort controller (so kill() stops it). @419606
  const runContext = { ...context, abortController: task.abortController ?? context.abortController }

  // Per-run token budget snapshot. @419607-419608
  const budgetBaseline = totalTokensSoFar() - turnTokensConsumed()
  const tokenBudget = { total: turnTokenBudget(), getTurnSpent: () => totalTokensSoFar() - budgetBaseline }

  // 5. Background IIFE — drives the run; the outer function does NOT await it. @419609-419774
  void (async () => {
    // 16 ms-batched progress flush. @419611-419637
    let pending: WorkflowProgressEvent[] = []
    let flushTimer: ReturnType<typeof setTimeout> | undefined

    const flush = () => {
      flushTimer = undefined
      if (pending.length === 0) return
      const batch = pending
      pending = []
      updateWorkflowProgressBatch(taskId, batch, context.taskRegistry) // @419617
      if (!isInteractive()) return // @419617 !xr() — no live UI off-TTY
      const visible = batch.filter((e) => e.type !== 'workflow_log') // @419618
      if (visible.length === 0) return // @419619 — logs alone don't force a render
      const live = runContext.getAppState()?.tasks?.[taskId]
      if (live?.type !== 'local_workflow' || live.status !== 'running') return // @419620-419621
      const lastAgent = visible.findLast((e) => e.type === 'workflow_agent') // @419622
      emitTaskProgress({
        taskId,
        toolUseId: context.toolUseId,
        description: lastAgent
          ? lastAgent.phaseTitle
            ? `${lastAgent.phaseTitle}: ${lastAgent.label}`
            : lastAgent.label
          : task.description, // @419626
        startTime: task.startTime,
        totalTokens: live.totalTokens,
        toolUses: live.totalToolCalls,
        lastToolName: lastAgent?.label,
        summary: description,
        workflowProgress: visible,
      })
    }

    const onProgress = (event: { type: string; data: WorkflowProgressEvent }) => {
      if (event.type !== 'progress') return // @419636
      pending.push(event.data)
      if (!flushTimer) flushTimer = setTimeout(flush, PROGRESS_FLUSH_INTERVAL_MS) // @419637
    }

    // Run the compiled VM script (the executor lives in runtime.ts). @419639-419650
    const outcome = await runWorkflowScript(compiled.vmScript, runContext, a.canUseTool, {
      workflowRunId: runId,
      onProgress,
      onAgentController: (agentId, controller) => {
        // @419642-419645 — register/deregister per-agent controllers for skip/retry/kill
        if (controller) task.agentControllers?.set(agentId, controller)
        else task.agentControllers?.delete(agentId)
      },
      args: input.args,
      seedPhaseTitles: meta.phases?.map((p) => p.title),
      tokenBudget,
      journal: new WorkflowJournal(runId), // @419649 new ldo(runId)
    })

    if (flushTimer) clearTimeout(flushTimer) // @419651
    flush() // @419652 — final drain

    // Derive final counters/status from the live record. @419653-419657
    const live = runContext.getAppState()?.tasks?.[taskId]
    const finalProgress = (live?.workflowProgress ?? []).filter((e) => e.type !== 'workflow_log')
    const totalTokens = live?.totalTokens ?? 0
    const totalToolCalls = live?.totalToolCalls ?? 0
    const status: 'killed' | 'failed' | 'completed' = task.abortController?.signal.aborted
      ? 'killed'
      : outcome.error
        ? 'failed'
        : 'completed' // @419657

    // Completion telemetry. @419658-419669
    logEvent('tengu_workflow_completed', {
      workflow_run_id: runId,
      workflow_source: san(invocationSource),
      workflow_name: telemetryWorkflowName,
      workflow_description: telemetryDescription,
      status: san(status),
      agent_count: outcome.agentCount,
      total_tokens: totalTokens,
      total_tool_calls: totalToolCalls,
      duration_ms: outcome.durationMs,
    })

    // Per-phase rollups — built-in workflows only. @419670-419712
    if (a.source === 'built-in') {
      emitPerPhaseRollups(runId, invocationSource, telemetryWorkflowName, live?.workflowProgress ?? [])
    }

    // Snapshot the run for the /workflows history viewer. @419713-419734
    writeWorkflowSnapshot(runId, {
      taskId,
      script: a.script,
      scriptPath,
      args: input.args,
      result: outcome.result,
      agentCount: outcome.agentCount,
      logs: outcome.logs,
      durationMs: outcome.durationMs,
      error: outcome.error,
      summary: description,
      workflowName,
      title,
      status,
      startTime: task.startTime,
      phases: task.phases,
      defaultModel: task.defaultModel,
      workflowProgress: finalProgress,
      totalTokens,
      totalToolCalls,
    })

    // If the run was aborted (killed) the kill path already transitioned + notified. @419735-419737
    if (task.abortController?.signal.aborted) return

    // Route result/failure into the registry. @419738-419739
    if (outcome.error) {
      failWorkflowTask(taskId, outcome.error, outcome.agentCount, outcome.logs, context.taskRegistry)
    } else {
      completeWorkflowTask(taskId, outcome.result, outcome.agentCount, outcome.logs, context.taskRegistry)
    }

    // Post the <task-notification> the model picks up next turn. @419740-419754
    enqueueWorkflowNotification({
      taskId,
      summary: description,
      status: outcome.error ? 'failed' : 'completed',
      error: outcome.error,
      result: outcome.result,
      failures: outcome.failures,
      agentCount: outcome.agentCount,
      totalTokens,
      totalToolCalls,
      durationMs: outcome.durationMs,
      taskRegistry: context.taskRegistry,
      toolUseId: context.toolUseId,
      transcriptDir,
    })
  })().catch((err) => {
    // Last-ditch: an unexpected throw still records failed + notifies. @419755-419773
    reportError(err)
    const message = err instanceof Error ? err.message : String(err)
    const live = runContext.getAppState()?.tasks?.[taskId]
    const agentCount = live?.agentCount ?? 0
    failWorkflowTask(taskId, message, agentCount, live?.logs ?? [], context.taskRegistry)
    enqueueWorkflowNotification({
      taskId,
      summary: description,
      status: 'failed',
      error: message,
      agentCount,
      totalTokens: live?.totalTokens ?? 0,
      totalToolCalls: live?.totalToolCalls ?? 0,
      durationMs: Date.now() - task.startTime,
      taskRegistry: context.taskRegistry,
      toolUseId: context.toolUseId,
      transcriptDir,
    })
  })

  // 6. Return immediately — the IIFE above keeps running in the background. @419775-419786
  return {
    data: {
      status: 'async_launched',
      taskId,
      taskType: 'local_workflow',
      workflowName,
      runId,
      summary: description,
      transcriptDir,
      scriptPath,
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// saveWorkflow — persist a named dynamic workflow to disk (user or project scope).
//
// Slugs the name, resolves the scope dir (~/.claude/workflows for user, <project>/.claude/
// workflows otherwise), `mkdir -p` it (mode 0o700), and writes `<slug>.js` (mode 0o600). The
// write uses flag "wx" (exclusive) unless `overwrite`, so a clobber raises EEXIST which is
// re-thrown as a friendly "already exists" error. After a successful write it invalidates the
// workflow + command memoization caches and resets the sent-skill-names cache (so the new
// workflow is immediately discoverable), then emits `tengu_workflow_saved`.
//
// 2.1.183: saveWorkflow = oHl @530752-530775
// 2.1.156 scaffold: gate_caps_lifecycle_relations.md §5.5 (save)
// ─────────────────────────────────────────────────────────────────────────────────────
export interface SaveWorkflowArgs {
  name: string
  script: string
  scope: 'user' | 'project'
  cwd: string
  overwrite: boolean
}

export async function saveWorkflow(
  args: SaveWorkflowArgs,
): Promise<{ name: string; path: string; scope: 'user' | 'project' }> {
  const slug = slugifyWorkflowName(args.name) // @530753 Ume(name)
  const dir = resolveWorkflowSaveDir(args.scope, args.cwd) // @530754 Fof(scope, cwd)
  const filePath = joinPath(dir, `${slug}.js`) // @530755

  await mkdir(dir, { recursive: true, mode: 0o700 }) // @530756 mode 448
  try {
    await writeFile(filePath, args.script, {
      encoding: 'utf8',
      mode: 0o600, // @530758 mode 384
      flag: args.overwrite ? 'w' : 'wx', // @530758 — "wx" = exclusive create
    })
  } catch (err) {
    if (errorCode(err) === 'EEXIST') {
      // @530760 — refuse to clobber unless overwrite
      throw new Error(
        `Dynamic workflow "${slug}" already exists at ${filePath}. Use a different name or overwrite.`,
      )
    }
    throw err
  }

  invalidateWorkflowCaches() // @530764 Ujn()
  // Clear the command-memoization + sent-skill-name caches so the workflow is discoverable now.
  const [{ clearCommandMemoizationCaches }, { resetSentSkillNames }] = await Promise.all([
    import('../../commands/cache.js'), // @530766 Sm() → pTo
    import('../../skills/sentNames.js'), // @530767 OT() → xtl
  ])
  clearCommandMemoizationCaches() // @530770
  resetSentSkillNames() // @530771

  logEvent('tengu_workflow_saved', {
    scope: san(args.scope),
    overwrite: args.overwrite,
    script_size_chars: args.script.length,
  }) // @530772

  return { name: slug, path: filePath, scope: args.scope } // @530773
}

// ─────────────────────────────────────────────────────────────────────────────────────
// workflowsCommand — the `/workflows` local-jsx slash command.
//
// Opens the workflow-history dialog (live runs from app-state + completed runs from the
// snapshot dir). v2.1.183 deltas vs 2.1.156: `immediate: !0` (the dialog renders without a
// round-trip through the model — the 2.1.169 change) and the reworded description "Browse
// running and completed workflows". Gated on `isWorkflowsEnabled()` (Pw).
//
// 2.1.183: workflowsCommand = jmf / Gmf @562632-562641
// 2.1.88 convention: commands/workflows/index.ts (the local-jsx Command shape)
// 2.1.156 scaffold: gate_caps_lifecycle_relations.md §5.5 (command)
// ─────────────────────────────────────────────────────────────────────────────────────
export const workflowsCommand = {
  type: 'local-jsx' as const, // @562633
  name: 'workflows', // @562634
  aliases: [] as string[], // @562635
  description: 'Browse running and completed workflows', // @562636
  isEnabled: () => isWorkflowsEnabled(), // @562637 Pw()
  immediate: true, // @562638 — the 183 delta: render without a model round-trip
  load: () => import('./workflowHistoryDialog.js'), // @562639 — lazily renders the history dialog
}

// The bundle exposes the workflow tool names via a lazy-getter namespace (`y1i`); mirror
// that re-export surface here. @221548-221549 gt(y1i, {WORKFLOW_TOOL_NAME, CODE_REVIEW_WORKFLOW_NAME})
export { WORKFLOW_TOOL_NAME as workflowToolName, CODE_REVIEW_WORKFLOW_NAME as codeReviewWorkflowName }

// ─────────────────────────────────────────────────────────────────────────────────────
// Types (shapes only; the canonical definitions live with the tool/runtime/Task modules).
// ─────────────────────────────────────────────────────────────────────────────────────
type WorkflowInput = {
  script?: string
  name?: string
  scriptPath?: string
  args?: unknown
  resumeFromRunId?: string
}

type WorkflowMeta = {
  name?: string
  title?: string
  description?: string
  phases?: { title: string }[]
}

type WorkflowProgressEvent =
  | { type: 'workflow_agent'; index: number; state: string; label: string; phaseTitle?: string; phaseIndex?: number; tokens?: number; toolCalls?: number; durationMs?: number; error?: string }
  | { type: 'workflow_phase'; index: number; title: string }
  | { type: 'workflow_log'; message: string }

type WorkflowSnapshot = {
  runId: string
  taskId: string
  startTime: number
  durationMs: number
  status: 'completed' | 'failed' | 'killed'
  script: string
  scriptPath?: string
  summary?: string
  workflowName?: string
  phases?: { title: string }[]
  defaultModel?: string
  workflowProgress: WorkflowProgressEvent[]
  agentCount: number
  totalTokens?: number
  totalToolCalls?: number
  logs: string[]
  result?: unknown
  error?: string
}

type WorkflowToolOutput = {
  data: {
    status: 'async_launched'
    taskId: string
    taskType: 'local_workflow'
    workflowName?: string
    runId: string
    summary?: string
    transcriptDir?: string
    scriptPath?: string
    error?: string
  }
}

// ─── External plumbing referenced above (canonical homes elsewhere) ───────────────────
// Constants / helpers whose definitions live in other modules; declared here for clarity.
const TASK_EVICT_TTL_MS = 30_000 // zGe @439188 — terminal-record TTL (30 s) before GC from the registry.
declare function isTerminalStatus(status: string): boolean // tC @<task>
declare function isWorkflowsEnabled(): boolean // Pw @148784 (canonical: gate_and_effort.ts)
declare function writeTaskOutputFile(file: string, data: string): Promise<void> // zGa.writeFile @411193
declare function releaseTaskOutputFile(taskId: string): void // i_ @<task>
declare function postTaskStateChange(taskId: string, kind: string, meta: unknown): void // Ng @<task>
declare function recordTaskMetric(name: string): void // Le @<telemetry>
declare function recordTaskMetricFailed(name: string, failName: string): void // Me @<telemetry>
declare function enqueueBackgroundMessage(msg: unknown): void // _f @<messages>
declare function currentAgentId(): string | undefined // Ls @<agent>
declare function stripAnsi(s: string): string // Kp @<text>
declare function emitPerPhaseRollups(runId: string, source: string, name: string, progress: WorkflowProgressEvent[]): void // inline @419672-419711
declare function bucketWorkflowName(name: string | undefined, source: string): string // xLp @419571
declare function bucketWorkflowDescription(desc: string | undefined, source: string): string // LLp @419572
declare function totalTokensSoFar(): number // rb @419607
declare function turnTokensConsumed(): number // xht @419607
declare function turnTokenBudget(): number // kht @419608
declare function reportError(err: unknown): void // De @419756
declare function logWarn(msg: string): void // v(...,{level}) @411194
declare function mkdir(dir: string, opts: { recursive: boolean; mode: number }): Promise<void> // qVn.mkdir @530756
declare function writeFile(path: string, data: string, opts: unknown): Promise<void> // qVn.writeFile @530758
declare function joinPath(...parts: string[]): string // oqt.join @530755
declare function errorCode(err: unknown): string | undefined // dn @530760
