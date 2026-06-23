/**
 * Cron scheduling tools — CronCreate / CronDelete / CronList.
 *
 * Three sibling tools that share one scheduled-task store (the cron task list,
 * either in-memory session store or `.claude/scheduled_tasks.json` for durable
 * jobs). Each fires an enqueued *prompt* at cron-matched wall-clock times while
 * the REPL is idle. The 2.1.88 named-TS source keeps these in three files under
 * `tools/ScheduleCronTool/`; they share schema/runtime so they are grouped here
 * but every tool keeps a distinct name/schema/description/prompt.
 *
 * 2.1.183 regions covered:
 *   - cli_inner_pretty.js:221580-221600  CronModule export map (tool-name & helper getters)
 *   - cli_inner_pretty.js:221593-221595  isKairosCronEnabled = IB
 *   - cli_inner_pretty.js:221596-221598  isDurableCronEnabled = qAe
 *   - cli_inner_pretty.js:221599-221603  buildCronCreateDescription = g5r
 *   - cli_inner_pretty.js:221604-221662  buildCronCreatePrompt = h5r
 *   - cli_inner_pretty.js:221658-221667  buildCronDeletePrompt = _5r (221658-221662), buildCronListPrompt = S5r (221663-221667)
 *   - cli_inner_pretty.js:221668-221680  consts b1i/ree/rI/U2/OPt/y5r/b5r, ree = recurringMaxAgeMs/86400000
 *   - cli_inner_pretty.js:431117         MAX_JOBS = xVa = 50
 *   - cli_inner_pretty.js:431131-431216  CronCreate schema YMp / output XMp / tool object JMp
 *   - cli_inner_pretty.js:431220-431272  CronDelete schema QMp / output ZMp / tool object eRp
 *   - cli_inner_pretty.js:431276-431359  CronList  schema tRp / output nRp / tool object rRp
 *   - cli_inner_pretty.js:220354-220363  parseCronExpression = zO
 *   - cli_inner_pretty.js:220410+        cronToHuman = pR
 *   - cli_inner_pretty.js:220606         nextCronRunMs = Dtt
 *
 * 2.1.88 convention mirror:
 *   src/tools/ScheduleCronTool/{CronCreateTool.ts, CronDeleteTool.ts, CronListTool.ts, prompt.ts}
 * 2.1.156 scaffold: 04_tools/README.md (cron tool family)
 *
 * Cross-validation note: the 2.1.88 named-TS source is a near-exact convention
 * mirror — field describe()s, error strings, MAX_JOBS=50, and the result-message
 * templates are byte-identical to the 183 bundle. Re-verified every describe()
 * string, the four validateInput error codes, and the durable/session-only result
 * branches against cli_inner_pretty.js:431131-431359 in the 2.1.183 bundle.
 * Verbatim prompt text confirmed against assets/tools/{CronCreate,CronDelete,CronList}.md.
 */

import { z } from 'zod/v4'
import { setScheduledTasksEnabled } from '../../bootstrap/state.js' // 2.1.183: AJ @431200
import type { ValidationResult } from '../Tool.js'
import { buildTool, type ToolDef } from '../Tool.js' // 2.1.183: pi (tool factory)
import { cronToHuman, parseCronExpression } from '../../utils/cron.js' // 2.1.183: pR @220410, zO @220354
import {
  addCronTask, // 2.1.183: Mtt @431199
  getCronFilePath, // 2.1.183: FAe @431172
  listAllCronTasks, // 2.1.183: pae @431187
  nextCronRunMs, // 2.1.183: Dtt @220606 / @431181
  removeCronTasks, // 2.1.183: dae @431265
} from '../../utils/cronTasks.js'
import { lazySchema } from '../../utils/lazySchema.js' // 2.1.183: we (memoize-once lazy schema)
import { coercedBoolean } from '../../utils/zodCoercion.js' // 2.1.183: n0 @292819 — canonical coerced-boolean helper ("true"/"false" string→bool preprocess)
import { getTeammateContext } from '../../utils/teammateContext.js' // 2.1.183: Pk
import { gate, isEnvDisabled } from '../../utils/featureGates.js' // 2.1.183: yK / st(env)

// ============================================================================
// Tool-name constants & shared gates
// ============================================================================

// 2.1.183: CRON_CREATE_TOOL_NAME = rI @cli_inner_pretty.js:221670
export const CRON_CREATE_TOOL_NAME = 'CronCreate'
// 2.1.183: CRON_DELETE_TOOL_NAME = U2 @cli_inner_pretty.js:221671
export const CRON_DELETE_TOOL_NAME = 'CronDelete'
// 2.1.183: CRON_LIST_TOOL_NAME = OPt @cli_inner_pretty.js:221672
export const CRON_LIST_TOOL_NAME = 'CronList'

// 2.1.183: CRON_DELETE_DESCRIPTION = y5r @cli_inner_pretty.js:221673
const CRON_DELETE_DESCRIPTION = 'Cancel a scheduled cron job by ID'
// 2.1.183: CRON_LIST_DESCRIPTION = b5r @cli_inner_pretty.js:221674
const CRON_LIST_DESCRIPTION = 'List scheduled cron jobs'

// 2.1.183: MAX_JOBS = xVa = 50 @cli_inner_pretty.js:431117
const MAX_JOBS = 50

// 2.1.183: b1i (gate cache TTL ms) @cli_inner_pretty.js:221668
const CRON_GATE_CACHE_TTL_MS = 300_000

/**
 * Recurring-job auto-expiry, in DAYS, derived from the runtime cap
 * `recurringMaxAgeMs` (604800000 ms = 7 days) divided by ms-per-day.
 * 2.1.183: DEFAULT_MAX_AGE_DAYS = ree = U9.recurringMaxAgeMs / 86400000 @cli_inner_pretty.js:221680
 */
const DEFAULT_MAX_AGE_DAYS = getCronConfig().recurringMaxAgeMs / 86_400_000 // = 7

// 2.1.183: isKairosCronEnabled = IB @cli_inner_pretty.js:221593-221595
// Disabled by env kill-switch CLAUDE_CODE_DISABLE_CRON, else statsig gate
// "tengu_kairos_cron" (default ON), cached for 5 min.
function isKairosCronEnabled(): boolean {
  return (
    !isEnvDisabled(process.env.CLAUDE_CODE_DISABLE_CRON) && // @221594: !st(process.env.CLAUDE_CODE_DISABLE_CRON)
    gate('tengu_kairos_cron', true, CRON_GATE_CACHE_TTL_MS) // @221594
  )
}

// 2.1.183: isDurableCronEnabled = qAe @cli_inner_pretty.js:221596-221598
// Separate feature gate "tengu_kairos_cron_durable" (default ON) controlling
// whether durable: true is honoured (persist to disk) or silently downgraded.
function isDurableCronEnabled(): boolean {
  return gate('tengu_kairos_cron_durable', true, CRON_GATE_CACHE_TTL_MS) // @221597
}

// ============================================================================
// Description / prompt builders (durable-aware)
// ============================================================================

// 2.1.183: buildCronCreateDescription = g5r @cli_inner_pretty.js:221599-221603
function buildCronCreateDescription(durableEnabled: boolean): string {
  return durableEnabled
    ? // @221601
      'Schedule a prompt to run at a future time — either recurring on a cron schedule, or once at a specific time. Pass durable: true to persist to .claude/scheduled_tasks.json; otherwise session-only.'
    : // @221602
      'Schedule a prompt to run at a future time within this Claude session — either recurring on a cron schedule, or once at a specific time.'
}

// 2.1.183: buildCronDeletePrompt = _5r @cli_inner_pretty.js:221658-221662
function buildCronDeletePrompt(durableEnabled: boolean): string {
  return durableEnabled
    ? `Cancel a cron job previously scheduled with ${CRON_CREATE_TOOL_NAME}. Removes it from .claude/scheduled_tasks.json (durable jobs) or the in-memory session store (session-only jobs).`
    : `Cancel a cron job previously scheduled with ${CRON_CREATE_TOOL_NAME}. Removes it from the in-memory session store.`
}

// 2.1.183: buildCronListPrompt = S5r @cli_inner_pretty.js:221663-221667
function buildCronListPrompt(durableEnabled: boolean): string {
  return durableEnabled
    ? `List all cron jobs scheduled via ${CRON_CREATE_TOOL_NAME}, both durable (.claude/scheduled_tasks.json) and session-only.`
    : `List all cron jobs scheduled via ${CRON_CREATE_TOOL_NAME} in this session.`
}

/**
 * The long cron-authoring prompt. Two interpolated blocks (`durabilityBlock`,
 * `runtimePersistenceNote`) flip on the durable gate; the "Not for live watching"
 * section is conditional on whether the Monitor tool is enabled (`isMonitorEnabled`).
 * Verbatim text confirmed against assets/tools/CronCreate.md.
 * 2.1.183: buildCronCreatePrompt = h5r @cli_inner_pretty.js:221604-221662
 */
function buildCronCreatePrompt(durableEnabled: boolean): string {
  // @221606-221617
  const durabilityBlock = durableEnabled
    ? `## Durability

By default (durable: false) the job lives only in this Claude session — nothing is written to disk, and the job is gone when Claude exits. Pass durable: true to write to .claude/scheduled_tasks.json so the job survives restarts. Only use durable: true when the user explicitly asks for the task to persist ("keep doing this every day", "set this up permanently"). Most "remind me in 5 minutes" / "check back in an hour" requests should stay session-only.`
    : `## Session-only

Jobs live only in this Claude session — nothing is written to disk, and the job is gone when Claude exits.`

  // @221612-221614
  const runtimePersistenceNote = durableEnabled
    ? 'Durable jobs persist to .claude/scheduled_tasks.json and survive session restarts — on next launch they resume automatically. One-shot durable tasks that were missed while the REPL was closed are surfaced for catch-up. Session-only jobs die with the process. '
    : ''

  // @221615-221656 — body. ${liveWatchSection} present only when Monitor is enabled.
  const liveWatchSection = isMonitorEnabled() // @221642: nG()
    ? `
## Not for live watching

${CRON_CREATE_TOOL_NAME} re-runs a prompt at fixed wall-clock intervals. To watch a log file, process, or command output and be notified the moment something changes, use the ${MONITOR_TOOL_NAME} tool instead — ${MONITOR_TOOL_NAME} streams events as they happen; cron polls on a schedule.
`
    : ''

  return `Schedule a prompt to be enqueued at a future time. Use for both recurring schedules and one-shot reminders.

Uses standard 5-field cron in the user's local timezone: minute hour day-of-month month day-of-week. "0 9 * * *" means 9am local — no timezone conversion needed.

## One-shot tasks (recurring: false)

For "remind me at X" or "at <time>, do Y" requests — fire once then auto-delete.
Pin minute/hour/day-of-month/month to specific values:
  "remind me at 2:30pm today to check the deploy" → cron: "30 14 <today_dom> <today_month> *", recurring: false
  "tomorrow morning, run the smoke test" → cron: "57 8 <tomorrow_dom> <tomorrow_month> *", recurring: false

## Recurring jobs (recurring: true, the default)

For "every N minutes" / "every hour" / "weekdays at 9am" requests:
  "*/5 * * * *" (every 5 min), "0 * * * *" (hourly), "0 9 * * 1-5" (weekdays at 9am local)

## Avoid the :00 and :30 minute marks when the task allows it

Every user who asks for "9am" gets \`0 9\`, and every user who asks for "hourly" gets \`0 *\` — which means requests from across the planet land on the API at the same instant. When the user's request is approximate, pick a minute that is NOT 0 or 30:
  "every morning around 9" → "57 8 * * *" or "3 9 * * *" (not "0 9 * * *")
  "hourly" → "7 * * * *" (not "0 * * * *")
  "in an hour or so, remind me to..." → pick whatever minute you land on, don't round

Only use minute 0 or 30 when the user names that exact time and clearly means it ("at 9:00 sharp", "at half past", coordinating with a meeting). When in doubt, nudge a few minutes early or late — the user will not notice, and the fleet will.

${durabilityBlock}
${liveWatchSection}## Runtime behavior

Jobs only fire while the REPL is idle (not mid-query). ${runtimePersistenceNote}The scheduler adds a small deterministic jitter on top of whatever you pick: recurring tasks fire up to 10% of their period late (max 15 min); one-shot tasks landing on :00 or :30 fire up to 90 s early. Picking an off-minute is still the bigger lever.

Recurring tasks auto-expire after ${DEFAULT_MAX_AGE_DAYS} days — they fire one final time, then are deleted. This bounds session lifetime. Tell the user about the ${DEFAULT_MAX_AGE_DAYS}-day limit when scheduling recurring jobs.

Returns a job ID you can pass to ${CRON_DELETE_TOOL_NAME}.`
}

// ============================================================================
// CronCreate
// ============================================================================

// 2.1.183: CronCreate input schema = YMp @cli_inner_pretty.js:431131-431144
const cronCreateInputSchema = lazySchema(() =>
  z.strictObject({
    cron: z
      .string()
      .describe(
        // @431133-431135
        'Standard 5-field cron expression in local time: "M H DoM Mon DoW" (e.g. "*/5 * * * *" = every 5 minutes, "30 14 28 2 *" = Feb 28 at 2:30pm local once).',
      ),
    prompt: z.string().describe('The prompt to enqueue at each fire time.'), // @431136
    // coercedBoolean (n0): accepts "true"/"false" strings as well as booleans.
    recurring: coercedBoolean(z.boolean().optional()).describe(
      // @431137-431139
      `true (default) = fire on every cron match until deleted or auto-expired after ${DEFAULT_MAX_AGE_DAYS} days. false = fire once at the next match, then auto-delete. Use false for "remind me at X" one-shot requests with pinned minute/hour/dom/month.`,
    ),
    durable: coercedBoolean(z.boolean().optional()).describe(
      // @431140-431142
      'true = persist to .claude/scheduled_tasks.json and survive restarts. false (default) = in-memory only, dies when this Claude session ends. Use true only when the user asks the task to survive across sessions.',
    ),
  }),
)
type CronCreateInput = ReturnType<typeof cronCreateInputSchema>

// 2.1.183: CronCreate output schema = XMp @cli_inner_pretty.js:431145-431147
const cronCreateOutputSchema = lazySchema(() =>
  z.object({
    id: z.string(),
    humanSchedule: z.string(),
    recurring: z.boolean(),
    durable: z.boolean().optional(),
  }),
)
type CronCreateOutput = ReturnType<typeof cronCreateOutputSchema>
export type CronCreateResult = z.infer<CronCreateOutput>

// 2.1.183: CronCreateTool = JMp = pi({...}) @cli_inner_pretty.js:431148-431216
export const CronCreateTool = buildTool({
  name: CRON_CREATE_TOOL_NAME,
  searchHint: 'schedule a recurring or one-shot prompt', // @431150
  maxResultSizeChars: 100_000, // @431151 (1e5)
  shouldDefer: true, // @431152 — kept out of the eager tool list, surfaced via ToolSearch
  get inputSchema(): CronCreateInput {
    return cronCreateInputSchema()
  },
  get outputSchema(): CronCreateOutput {
    return cronCreateOutputSchema()
  },
  isEnabled() {
    return isKairosCronEnabled() // @431160
  },
  toAutoClassifierInput(input) {
    return `${input.cron}: ${input.prompt}` // @431163
  },
  async description() {
    return buildCronCreateDescription(isDurableCronEnabled()) // @431166
  },
  async prompt() {
    return buildCronCreatePrompt(isDurableCronEnabled()) // @431169
  },
  getPath() {
    return getCronFilePath() // @431172 — .claude/scheduled_tasks.json path
  },
  // 2.1.183: validateInput @cli_inner_pretty.js:431174-431196 — four error codes
  async validateInput(input): Promise<ValidationResult> {
    // errorCode 1: malformed 5-field cron expression.
    if (!parseCronExpression(input.cron)) {
      return {
        result: false,
        message: `Invalid cron expression '${input.cron}'. Expected 5 fields: M H DoM Mon DoW.`, // @431178
        errorCode: 1,
      }
    }
    // errorCode 2: syntactically valid but matches no calendar date within the next year
    // (e.g. "0 0 30 2 *" — Feb 30 never occurs). nextCronRunMs returns null.
    if (nextCronRunMs(input.cron, Date.now()) === null) {
      return {
        result: false,
        message: `Cron expression '${input.cron}' does not match any calendar date in the next year.`, // @431184
        errorCode: 2,
      }
    }
    // errorCode 3: enforce the global cap across all scheduled jobs.
    const tasks = await listAllCronTasks()
    if (tasks.length >= MAX_JOBS) {
      return {
        result: false,
        message: `Too many scheduled jobs (max ${MAX_JOBS}). Cancel one first.`, // @431188
        errorCode: 3,
      }
    }
    // errorCode 4: teammates don't persist across sessions, so a durable teammate
    // cron would orphan on restart (its agentId would dangle). getTeammateContext (Pk)
    // is non-null only inside a teammate/sub-agent run.
    if (input.durable && getTeammateContext()) {
      return {
        result: false,
        message:
          'durable crons are not supported for teammates (teammates do not persist across sessions)', // @431192
        errorCode: 4,
      }
    }
    return { result: true }
  },
  // 2.1.183: call @cli_inner_pretty.js:431197-431201
  async call({ cron, prompt, recurring = true, durable = false }) {
    // Durable only if BOTH the caller asked for it AND the durable gate is on; if
    // the kill-switch flips mid-session the schema stays stable (no validation
    // error) but the job silently downgrades to session-only.
    const effectiveDurable = durable && isDurableCronEnabled() // @431198: o = r && qAe()
    const id = await addCronTask(
      cron,
      prompt,
      recurring,
      effectiveDurable,
      getTeammateContext()?.agentId, // @431199: Pk()?.agentId
    )
    // Flip the scheduler-active flag so the useScheduledTasks tick loop starts
    // watching this session. (2.1.183: AJ(!0) @431200)
    setScheduledTasksEnabled(true)
    return {
      data: {
        id,
        humanSchedule: cronToHuman(cron), // @431200: pR(e)
        recurring,
        durable: effectiveDurable,
      },
    }
  },
  // 2.1.183: mapToolResultToToolResultBlockParam @cli_inner_pretty.js:431202-431213
  mapToolResultToToolResultBlockParam(output, toolUseID) {
    const where = output.durable
      ? 'Persisted to .claude/scheduled_tasks.json' // @431204
      : 'Session-only (not written to disk, dies when Claude exits)' // @431205
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: output.recurring
        ? `Scheduled recurring job ${output.id} (${output.humanSchedule}). ${where}. Auto-expires after ${DEFAULT_MAX_AGE_DAYS} days. Use CronDelete to cancel sooner.` // @431210
        : `Scheduled one-shot task ${output.id} (${output.humanSchedule}). ${where}. It will fire once then auto-delete.`, // @431211
    }
  },
  // helper: HVa @431214 — renderToolUseMessage (UI), vVa @431215 — renderToolResultMessage (UI)
  renderToolUseMessage: renderCreateToolUseMessage,
  renderToolResultMessage: renderCreateResultMessage,
} satisfies ToolDef<CronCreateInput, CronCreateResult>)

// ============================================================================
// CronDelete
// ============================================================================

// 2.1.183: CronDelete input schema = QMp @cli_inner_pretty.js:431228
const cronDeleteInputSchema = lazySchema(() =>
  z.strictObject({
    id: z.string().describe('Job ID returned by CronCreate.'), // @431228
  }),
)
type CronDeleteInput = ReturnType<typeof cronDeleteInputSchema>

// 2.1.183: CronDelete output schema = ZMp @cli_inner_pretty.js:431229
const cronDeleteOutputSchema = lazySchema(() => z.object({ id: z.string() }))
type CronDeleteOutput = ReturnType<typeof cronDeleteOutputSchema>
export type CronDeleteResult = z.infer<CronDeleteOutput>

// 2.1.183: CronDeleteTool = eRp = pi({...}) @cli_inner_pretty.js:431230-431272
export const CronDeleteTool = buildTool({
  name: CRON_DELETE_TOOL_NAME,
  searchHint: 'cancel a scheduled cron job', // @431232
  maxResultSizeChars: 100_000, // @431233
  shouldDefer: true, // @431234
  get inputSchema(): CronDeleteInput {
    return cronDeleteInputSchema()
  },
  get outputSchema(): CronDeleteOutput {
    return cronDeleteOutputSchema()
  },
  isEnabled() {
    return isKairosCronEnabled() // @431242
  },
  toAutoClassifierInput(input) {
    return input.id // @431245
  },
  async description() {
    return CRON_DELETE_DESCRIPTION // @431248
  },
  async prompt() {
    return buildCronDeletePrompt(isDurableCronEnabled()) // @431251
  },
  getPath() {
    return getCronFilePath() // @431254
  },
  // 2.1.183: validateInput @cli_inner_pretty.js:431256-431262
  async validateInput(input): Promise<ValidationResult> {
    const tasks = await listAllCronTasks()
    const task = tasks.find(t => t.id === input.id)
    // errorCode 1: unknown id.
    if (!task) {
      return { result: false, message: `No scheduled job with id '${input.id}'`, errorCode: 1 } // @431258
    }
    // errorCode 2: teammates may only delete their own crons.
    const ctx = getTeammateContext()
    if (ctx && task.agentId !== ctx.agentId) {
      return {
        result: false,
        message: `Cannot delete cron job '${input.id}': owned by another agent`, // @431261
        errorCode: 2,
      }
    }
    return { result: true }
  },
  // 2.1.183: call @cli_inner_pretty.js:431264-431266
  async call({ id }) {
    await removeCronTasks([id]) // @431265: dae([e])
    return { data: { id } }
  },
  // 2.1.183: mapToolResultToToolResultBlockParam @cli_inner_pretty.js:431267-431269
  mapToolResultToToolResultBlockParam(output, toolUseID) {
    return { tool_use_id: toolUseID, type: 'tool_result', content: `Cancelled job ${output.id}.` } // @431268
  },
  // helper: TVa @431270 — renderToolUseMessage, wVa @431271 — renderToolResultMessage
  renderToolUseMessage: renderDeleteToolUseMessage,
  renderToolResultMessage: renderDeleteResultMessage,
} satisfies ToolDef<CronDeleteInput, CronDeleteResult>)

// ============================================================================
// CronList
// ============================================================================

// 2.1.183: CronList input schema = tRp @cli_inner_pretty.js:431286 — no args
const cronListInputSchema = lazySchema(() => z.strictObject({}))
type CronListInput = ReturnType<typeof cronListInputSchema>

// 2.1.183: CronList output schema = nRp @cli_inner_pretty.js:431287-431299
const cronListOutputSchema = lazySchema(() =>
  z.object({
    jobs: z.array(
      z.object({
        id: z.string(),
        cron: z.string(),
        humanSchedule: z.string(),
        prompt: z.string(),
        recurring: z.boolean().optional(),
        durable: z.boolean().optional(),
      }),
    ),
  }),
)
type CronListOutput = ReturnType<typeof cronListOutputSchema>
export type CronListResult = z.infer<CronListOutput>

// 2.1.183: CronListTool = rRp = pi({...}) @cli_inner_pretty.js:431301-431358
export const CronListTool = buildTool({
  name: CRON_LIST_TOOL_NAME,
  searchHint: 'list active cron jobs', // @431303
  maxResultSizeChars: 100_000, // @431304
  shouldDefer: true, // @431305
  get inputSchema(): CronListInput {
    return cronListInputSchema()
  },
  get outputSchema(): CronListOutput {
    return cronListOutputSchema()
  },
  isEnabled() {
    return isKairosCronEnabled() // @431313
  },
  isConcurrencySafe() {
    return true // @431316 — pure read of the task store
  },
  isReadOnly() {
    return true // @431319
  },
  async description() {
    return CRON_LIST_DESCRIPTION // @431322
  },
  async prompt() {
    return buildCronListPrompt(isDurableCronEnabled()) // @431325
  },
  // 2.1.183: call @cli_inner_pretty.js:431327-431342
  async call() {
    const tasks = await listAllCronTasks()
    const ctx = getTeammateContext()
    // Teammates only see their own jobs; the main session sees all.
    const visible = ctx ? tasks.filter(t => t.agentId === ctx.agentId) : tasks
    return {
      data: {
        jobs: visible.map(t => ({
          id: t.id,
          cron: t.cron,
          humanSchedule: cronToHuman(t.cron), // @431335: pR(o.cron)
          prompt: t.prompt,
          // Only emit recurring/durable when they carry signal:
          // recurring true → present; durable explicitly false → flag session-only.
          ...(t.recurring ? { recurring: true } : {}), // @431337
          ...(t.durable === false ? { durable: false } : {}), // @431338
        })),
      },
    }
  },
  // 2.1.183: mapToolResultToToolResultBlockParam @cli_inner_pretty.js:431343-431355
  mapToolResultToToolResultBlockParam(output, toolUseID) {
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content:
        output.jobs.length > 0
          ? output.jobs
              .map(
                job =>
                  // @431351 — Va(prompt, 80, true) = truncate prompt to 80 chars w/ ellipsis
                  `${job.id} — ${job.humanSchedule}${job.recurring ? ' (recurring)' : ' (one-shot)'}${job.durable === false ? ' [session-only]' : ''}: ${truncate(job.prompt, 80, true)}`,
              )
              .join('\n')
          : 'No scheduled jobs.', // @431354
    }
  },
  // helper: CVa @431357 — renderToolUseMessage, IVa @431358 — renderToolResultMessage
  renderToolUseMessage: renderListToolUseMessage,
  renderToolResultMessage: renderListResultMessage,
} satisfies ToolDef<CronListInput, CronListResult>)

// ============================================================================
// External helper bindings (defined in sibling modules — referenced for shape)
// ============================================================================

// helper: nG @cli_inner_pretty.js (~221645) — is the Monitor tool enabled this session
declare function isMonitorEnabled(): boolean
// 2.1.183: Monitor tool name (yv) — interpolated into the "Not for live watching" section
declare const MONITOR_TOOL_NAME: string
// helper: gives U9 runtime config incl. recurringMaxAgeMs (604800000 ms = 7 days) @220670
declare function getCronConfig(): { recurringMaxAgeMs: number }
// helper: Va @431351 — truncate(str, maxLen, addEllipsis)
declare function truncate(str: string, maxLen: number, ellipsis: boolean): string

// UI renderers (live in ScheduleCronTool/UI.tsx per the 2.1.88 convention mirror)
declare const renderCreateToolUseMessage: ToolDef<CronCreateInput, CronCreateResult>['renderToolUseMessage']
declare const renderCreateResultMessage: ToolDef<CronCreateInput, CronCreateResult>['renderToolResultMessage']
declare const renderDeleteToolUseMessage: ToolDef<CronDeleteInput, CronDeleteResult>['renderToolUseMessage']
declare const renderDeleteResultMessage: ToolDef<CronDeleteInput, CronDeleteResult>['renderToolResultMessage']
declare const renderListToolUseMessage: ToolDef<CronListInput, CronListResult>['renderToolUseMessage']
declare const renderListResultMessage: ToolDef<CronListInput, CronListResult>['renderToolResultMessage']
