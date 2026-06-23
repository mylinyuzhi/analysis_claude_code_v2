/**
 * ScheduleWakeup — the `/loop` dynamic-mode self-pacing tool.
 *
 * When the user invokes `/loop` WITHOUT an interval, the model self-paces:
 * before ending each turn it calls ScheduleWakeup to choose its own delay until
 * the next iteration. Calling it keeps the loop alive; omitting the call ends it.
 * The runtime clamps the requested delay to [60, 3600] seconds, schedules a
 * harness wake-up, and re-invokes the agent with the supplied `prompt` (or a
 * resolved sentinel) at fire time.
 *
 * Two distinct autonomous-loop sentinels exist; ScheduleWakeup ALWAYS uses the
 * `-dynamic` one (resolved+quoted below):
 *   - `<<autonomous-loop-dynamic>>` (wCe) — the dynamic-pacing variant this tool fires.
 *   - `<<autonomous-loop>>`         (Rtt) — the CronCreate-based autonomous-loop variant.
 * The runtime resolves the sentinel back to the autonomous-loop instructions at
 * fire time, so the model passes the literal sentinel rather than re-emitting the
 * full prompt every turn.
 *
 * 2.1.183 regions covered:
 *   - cli_inner_pretty.js:220800          name = $g = "ScheduleWakeup"
 *   - cli_inner_pretty.js:220801          AUTONOMOUS_LOOP_SENTINEL = Rtt = "<<autonomous-loop>>"
 *   - cli_inner_pretty.js:220802          AUTONOMOUS_LOOP_DYNAMIC_SENTINEL = wCe = "<<autonomous-loop-dynamic>>"
 *   - cli_inner_pretty.js:220804-220805   description = XOi
 *   - cli_inner_pretty.js:220806-220831   prompt = YOi (assigned in module init UAe)
 *   - cli_inner_pretty.js:221032-221034   logLoopEnded = Ott ("tengu_loop_ended")
 *   - cli_inner_pretty.js:221035-221037   isKairosLoopDynamicEnabled = jAe ("tengu_kairos_loop_dynamic")
 *   - cli_inner_pretty.js:221042-221044   scheduleLoopWakeup = i1i
 *   - cli_inner_pretty.js:427810-427819   input schema = nMp
 *   - cli_inner_pretty.js:427821-427827   output schema = rMp
 *   - cli_inner_pretty.js:427828-427879   tool object = Y9a = pi({...})
 *
 * 2.1.88 convention mirror:
 *   src/tools/ScheduleCronTool/* (cron-family tool shape) — there is no exact
 *   2.1.88 ScheduleWakeup file; the buildTool contract shape is mirrored.
 * 2.1.156 scaffold: 04_tools/README.md (ScheduleWakeup / loop dynamic mode)
 *
 * Cross-validation note: re-verified the two sentinel string literals (wCe @220802,
 * Rtt @220801), the [60,3600] clamp wording in describe()s, the gate-off / loop-ended
 * result strings, and the full call() gate→schedule→null flow against
 * cli_inner_pretty.js:427810-427879 + 221032-221044. Prompt text confirmed
 * against assets/tools/ScheduleWakeup.md and the inline YOi literal @220807-220831.
 */

import { z } from 'zod/v4'
import { buildTool, type ToolDef } from '../Tool.js' // 2.1.183: pi (tool factory)
import { lazySchema } from '../../utils/lazySchema.js' // 2.1.183: we
import { coerceNumber } from '../../utils/coerceNumber.js' // 2.1.183: GB @292825 — numeric-string→number preprocess
import { logEvent } from '../../telemetry.js' // 2.1.183: G

// ============================================================================
// Identity & sentinels
// ============================================================================

// 2.1.183: SCHEDULE_WAKEUP_TOOL_NAME = $g @cli_inner_pretty.js:220800
export const SCHEDULE_WAKEUP_TOOL_NAME = 'ScheduleWakeup'

// 2.1.183: AUTONOMOUS_LOOP_SENTINEL = Rtt @cli_inner_pretty.js:220801
// CronCreate-based autonomous-loop variant. NOT used by ScheduleWakeup.
const AUTONOMOUS_LOOP_SENTINEL = '<<autonomous-loop>>'

// 2.1.183: AUTONOMOUS_LOOP_DYNAMIC_SENTINEL = wCe @cli_inner_pretty.js:220802
// The dynamic-pacing variant ScheduleWakeup fires; the runtime resolves it back
// to the autonomous-loop instructions at wake-up time.
const AUTONOMOUS_LOOP_DYNAMIC_SENTINEL = '<<autonomous-loop-dynamic>>'

// 2.1.183: description = XOi @cli_inner_pretty.js:220804-220805
const SCHEDULE_WAKEUP_DESCRIPTION =
  'Schedule when to resume work in /loop dynamic mode (always pass the `prompt` arg). Call before ending the turn to keep the loop alive; omit the call to end it.'

// ============================================================================
// Runtime gate & helpers (defined in the loop-runtime module)
// ============================================================================

// 2.1.183: isKairosLoopDynamicEnabled = jAe @cli_inner_pretty.js:221035-221037
// Statsig gate "tengu_kairos_loop_dynamic" (default OFF). The tool object itself
// declares NO isEnabled() — it is always loaded — and the gate is enforced inside
// call() so the loop can end cleanly with an explanatory tool result when off.
function isKairosLoopDynamicEnabled(): boolean {
  return gate('tengu_kairos_loop_dynamic', false) // @221036
}

// 2.1.183: logLoopEnded = Ott @cli_inner_pretty.js:221032-221034
// Emits "tengu_loop_ended" with a reason (e.g. "gate_off"). In the bundle the reason
// is passed through a normalizer Ne() — `{ reason: Ne(e), ...t }` @221033 — before logging.
function logLoopEnded(reason: string, extra?: Record<string, unknown>): void {
  logEvent('tengu_loop_ended', { reason: normalizeReason(reason), ...extra }) // @221033: { reason: Ne(e), ...t }
}
// helper: Ne — telemetry reason normalizer (sanitizes/clamps the reason string)
declare function normalizeReason(reason: string): string

// 2.1.183: scheduleLoopWakeup = i1i @cli_inner_pretty.js:221042-221044
// Delegates to the keepalive scheduler (l1i) with viaKeepalive:false. Returns the
// scheduled wake-up record, or null if the loop hit its max duration / can't schedule.
declare function scheduleLoopWakeup(
  delaySeconds: number,
  prompt: string,
  reason: string,
): { scheduledFor: number; clampedDelaySeconds: number; wasClamped: boolean } | null

// helper: gate — statsig feature-gate read (ct)
declare function gate(name: string, defaultValue: boolean): boolean

// ============================================================================
// Prompt (full /loop dynamic-mode authoring prompt)
// ============================================================================

/**
 * The `/loop` dynamic-mode prompt. Assigned at module init (2.1.183: YOi, set in
 * UAe @cli_inner_pretty.js:220806-220831). Verbatim against assets/tools/ScheduleWakeup.md
 * and the inline literal. Note the sentinel interpolations resolve to the two
 * literal strings below; ScheduleWakeup always uses the `-dynamic` variant.
 * 2.1.183: prompt = YOi @cli_inner_pretty.js:220807-220831
 */
const SCHEDULE_WAKEUP_PROMPT = `Schedule when to resume work in /loop dynamic mode — the user invoked /loop without an interval, asking you to self-pace iterations of a specific task.

Do NOT schedule a short-interval wakeup to poll for background work you started — when harness-tracked work finishes, you are re-invoked automatically, so polling is wasted. Instead schedule a long fallback (1200s+) so the loop survives if the work hangs or never notifies. The exception is external work the harness cannot track (a CI run, a deploy, a remote queue) — there, pick a delay matched to how fast that state actually changes.

Pass the same /loop prompt back via \`prompt\` each turn so the next firing repeats the task. For an autonomous /loop (no user prompt), pass the literal sentinel \`${AUTONOMOUS_LOOP_DYNAMIC_SENTINEL}\` as \`prompt\` instead — the runtime resolves it back to the autonomous-loop instructions at fire time. (There is a similar \`${AUTONOMOUS_LOOP_SENTINEL}\` sentinel for CronCreate-based autonomous loops; do not confuse the two — ${SCHEDULE_WAKEUP_TOOL_NAME} always uses the \`-dynamic\` variant.) Omit the call to end the loop.

## Picking delaySeconds

The Anthropic prompt cache has a 5-minute TTL. Sleeping past 300 seconds means the next wake-up reads your full conversation context uncached — slower and more expensive. So the natural breakpoints:

- **Under 5 minutes (60s–270s)**: cache stays warm. Right for actively polling external state the harness can't notify you about — a CI run, a deploy, a remote queue.
- **5 minutes to 1 hour (300s–3600s)**: pay the cache miss. Right when there's no point checking sooner — waiting on something that takes minutes to change, genuinely idle, or as the long fallback heartbeat when something else is the primary wake signal.

**Don't pick 300s.** It's the worst-of-both: you pay the cache miss without amortizing it. If you're tempted to "wait 5 minutes," either drop to 270s (stay in cache) or commit to 1200s+ (one cache miss buys a much longer wait). Don't think in round-number minutes — think in cache windows.

For idle ticks with no specific signal to watch, default to **1200s–1800s** (20–30 min). The loop checks back, you don't burn cache 12× per hour for nothing, and the user can always interrupt if they need you sooner.

Think about what you're actually waiting for, not just "how long should I sleep." If you're polling a CI run that takes ~8 minutes, sleeping 60s burns the cache 8 times before it finishes — sleep ~270s twice instead.

The runtime clamps to [60, 3600], so you don't need to clamp yourself.

## The reason field

One short sentence on what you chose and why. Goes to telemetry and is shown back to the user. "watching CI run" beats "waiting." The user reads this to understand what you're doing without having to predict your cadence in advance — make it specific.
`

// ============================================================================
// Schemas
// ============================================================================

// 2.1.183: input schema = nMp @cli_inner_pretty.js:427810-427819
const scheduleWakeupInputSchema = lazySchema(() =>
  z.strictObject({
    // coerceNumber (GB): accepts numeric strings as well as numbers.
    delaySeconds: coerceNumber(z.number()).describe(
      'Seconds from now to wake up. Clamped to [60, 3600] by the runtime.', // @427812
    ),
    reason: z.string().describe(
      // @427813-427815
      'One short sentence explaining the chosen delay. Goes to telemetry and is shown to the user. Be specific.',
    ),
    prompt: z.string().describe(
      // @427816-427818 — note the two interpolated sentinels resolve to the literals below.
      `The /loop input to fire on wake-up. Pass the same /loop input verbatim each turn so the next firing re-enters the skill and continues the loop. For autonomous /loop (no user prompt), pass the literal sentinel \`${AUTONOMOUS_LOOP_DYNAMIC_SENTINEL}\` instead (the dynamic-pacing variant, not the CronCreate-mode \`${AUTONOMOUS_LOOP_SENTINEL}\`).`,
    ),
  }),
)
type ScheduleWakeupInput = ReturnType<typeof scheduleWakeupInputSchema>

// 2.1.183: output schema = rMp @cli_inner_pretty.js:427821-427827
const scheduleWakeupOutputSchema = lazySchema(() =>
  z.object({
    scheduledFor: z.number().describe('Epoch ms timestamp when the next wakeup will fire'), // @427823
    clampedDelaySeconds: z.number().describe('Actual delay used after clamping to runtime bounds'), // @427824
    wasClamped: z.boolean().describe('True if the requested delaySeconds was outside [60, 3600]'), // @427825
  }),
)
type ScheduleWakeupOutput = ReturnType<typeof scheduleWakeupOutputSchema>
export type ScheduleWakeupResult = z.infer<ScheduleWakeupOutput>

// ============================================================================
// Tool object
// ============================================================================

// 2.1.183: ScheduleWakeupTool = Y9a = pi({...}) @cli_inner_pretty.js:427828-427879
export const ScheduleWakeupTool = buildTool({
  name: SCHEDULE_WAKEUP_TOOL_NAME,
  searchHint:
    'self-pace next iteration: pick a delay before resuming work or running the next /loop tick', // @427830
  maxResultSizeChars: 1000, // @427831
  async description() {
    return SCHEDULE_WAKEUP_DESCRIPTION // @427833
  },
  async prompt() {
    return SCHEDULE_WAKEUP_PROMPT // @427836
  },
  get inputSchema(): ScheduleWakeupInput {
    return scheduleWakeupInputSchema()
  },
  get outputSchema(): ScheduleWakeupOutput {
    return scheduleWakeupOutputSchema()
  },
  // Empty user-facing name — the tool renders no visible header in the transcript.
  userFacingName() {
    return '' // @427845
  },
  shouldDefer: true, // @427847
  // No isEnabled() on the tool object — it is always loaded; the runtime gate is
  // checked inside call() (isKairosLoopDynamicEnabled) so the loop can end gracefully.
  async checkPermissions(input) {
    return { behavior: 'allow', updatedInput: input } // @427849 — always allowed
  },
  renderToolUseMessage() {
    return null // @427852
  },
  // 2.1.183: call @cli_inner_pretty.js:427854-427861
  async call({ delaySeconds, reason, prompt }) {
    // Gate off → end the loop, log "gate_off", return scheduledFor:0 sentinel.
    if (!isKairosLoopDynamicEnabled()) {
      logLoopEnded('gate_off') // @427855
      return { data: { scheduledFor: 0, clampedDelaySeconds: 0, wasClamped: false } }
    }
    // Schedule the next wake-up (clamps internally to [60,3600]); null means the
    // loop hit its maximum duration / can't reschedule — surface the same sentinel.
    const scheduled = scheduleLoopWakeup(delaySeconds, prompt, reason) // @427856: i1i(e, n, t)
    if (scheduled === null) {
      return { data: { scheduledFor: 0, clampedDelaySeconds: 0, wasClamped: false } } // @427857
    }
    return {
      data: {
        scheduledFor: scheduled.scheduledFor,
        clampedDelaySeconds: scheduled.clampedDelaySeconds,
        wasClamped: scheduled.wasClamped,
      },
    }
  },
  // 2.1.183: mapToolResultToToolResultBlockParam @cli_inner_pretty.js:427862-427878
  mapToolResultToToolResultBlockParam({ scheduledFor, clampedDelaySeconds, wasClamped }, toolUseID) {
    // scheduledFor === 0 → the loop ended (gate off or max-duration reached).
    if (scheduledFor === 0) {
      return {
        tool_use_id: toolUseID,
        type: 'tool_result',
        content:
          'Wakeup not scheduled. Either the /loop dynamic runtime gate is off or the loop reached its maximum duration — the loop has ended; do not re-issue.', // @427868
      }
    }
    const wakeTime = new Date(scheduledFor).toTimeString().slice(0, 8) // @427870 — HH:MM:SS
    const inSeconds = Math.max(0, Math.round((scheduledFor - Date.now()) / 1000)) // @427871
    const clampNote = wasClamped ? ` (clamped to ${clampedDelaySeconds}s from your requested value)` : '' // @427872
    return {
      tool_use_id: toolUseID,
      type: 'tool_result',
      content: `Next wakeup scheduled for ${wakeTime} (in ${inSeconds}s)${clampNote}. Nothing more to do this turn — the harness re-invokes you when the wakeup fires or a task-notification arrives.`, // @427876
    }
  },
} satisfies ToolDef<ScheduleWakeupInput, ScheduleWakeupResult>)
