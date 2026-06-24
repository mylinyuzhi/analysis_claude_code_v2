// ===========================================================================
// /loop — bundled skill (Claude Code v2.1.183, readable reconstruction)
//
// v2.1.183 regions covered:
//   - registerLoopSkill = _1f @649251  (ap()/registerBundledSkill call @649252)
//   - prompt builders i7l@649085, p1f@649090, a7l@649098, l7l@649126,
//       A1f@649134, g1f@649139, h1f@649187, y1f@649202
//   - constants agt/u1f/d1f/f1f/m1f @649363-649398 (m1f@649367, f1f@649386)
//   - loop module _9e (HUe/EUe) exports @220842-221016
//       readLoopFile=r1i@220942, isLoopDefaultPromptEnabled=o5r@220891,
//       getAutonomousLoopPreamble=t5r@220863, logAutonomousLoopActivation=n5r@220866,
//       LOOP_FILE_SENTINEL=n1i@221013, LOOP_FILE_DYNAMIC_SENTINEL=LPt@221014
//   - autonomous sentinels Rtt@220801 / wCe@220802; preambles JWr@220701 / qOi@220726
//   - gates IB@221593, jAe@221035, YTn@220859, TCe@220758
//
// v2.1.88 ancestor / convention: src/skills/bundled/loop.ts (registerLoopSkill —
//   FIXED-interval cron only). Ported forward; the dynamic / loop.md / autonomous
//   branches are new and reconstructed from the 183 bundle directly.
//
// 2.1.156 -> 2.1.183 delta (one line): the only behavioral change is the NEW
//   `menuDescription` field on the registrar (ap@546993) and on this skill —
//   the entire dynamic/loop.md/autonomous/persistent machinery already shipped in 2.1.156.
//
// Cross-validation: prompt bodies match extracted assets
//   093/097_autonomous-loop-*.txt (JWr/qOi), 125_loop-schedule-a-recurring-prompt.txt (g1f/y1f).
// ===========================================================================

import { registerBundledSkill } from '../bundledSkills.js'

// Tool-name constants (interpolated verbatim into the prompt strings).
// Obf sources in the 2.1.183 bundle:
import { CRON_CREATE_TOOL_NAME } from '../../tools/ScheduleCronTool/prompt.js' // rI="CronCreate"@221670
import { CRON_DELETE_TOOL_NAME } from '../../tools/ScheduleCronTool/prompt.js' // U2="CronDelete"@221671
import { DEFAULT_MAX_AGE_DAYS } from '../../tools/ScheduleCronTool/prompt.js' // ree=recurringMaxAgeMs/86400000@221680
import { SKILL_TOOL_NAME } from '../../tools/SkillTool/constants.js' // mH="Skill"@221449
import { ASK_USER_QUESTION_TOOL_NAME } from '../../tools/AskUserQuestionTool/prompt.js' // Ff="AskUserQuestion"@221315
import { MONITOR_TOOL_NAME } from '../../tools/MonitorTool/constants.js' // yv="Monitor"@220793
import { SCHEDULE_WAKEUP_TOOL_NAME } from '../../tools/ScheduleWakeupTool/constants.js' // $g="ScheduleWakeup"@220800
import { TASK_LIST_TOOL_NAME } from '../../tools/TaskListTool/constants.js' // IL="TaskList"@220833
import { TASK_STOP_TOOL_NAME } from '../../tools/TaskStopTool/constants.js' // uP="TaskStop"@220834
import { PUSH_NOTIFICATION_TOOL_NAME } from '../../tools/PushNotificationTool/constants.js' // G9="PushNotification"@220751

// Gates.
import { isLoopEnabled } from '../../tools/ScheduleCronTool/prompt.js' // IB@221593: !env.CLAUDE_CODE_DISABLE_CRON && flag("tengu_kairos_cron",true,300000)
import { isDynamicLoopEnabled } from '../../utils/loop/dynamic.js' // jAe@221035: flag("tengu_kairos_loop_dynamic",false)
import { isAgentPushNotifEnabled } from '../../tools/PushNotificationTool/constants.js' // TCe@220758

// Loop default-prompt module (`_9e` in the bundle: readLoopFile / autonomous defaults).
import {
  isLoopDefaultPromptEnabled, // o5r@220891: flag("tengu_kairos_loop_prompt",false)
  readLoopFile, // r1i@220942
  getAutonomousLoopPreamble, // t5r@220863
  logAutonomousLoopActivation, // n5r@220866
  LOOP_FILE_SENTINEL, // n1i@221013 = "<<loop.md>>"
  LOOP_FILE_DYNAMIC_SENTINEL, // LPt@221014 = "<<loop.md-dynamic>>"
  AUTONOMOUS_LOOP_SENTINEL, // Rtt@220801 = "<<autonomous-loop>>"
  AUTONOMOUS_LOOP_DYNAMIC_SENTINEL, // wCe@220802 = "<<autonomous-loop-dynamic>>"
} from '../../utils/loop/defaultPrompt.js'

// Predicate helpers used inside the builders.
import { parseBoolean } from '../../utils/env.js' // st@163
import { isBackgroundSession } from '../../utils/session.js' // yi@103598: getSessionKind()==="bg"
import { isFeatureFlagEnabled } from '../../utils/featureFlags.js' // ct@146595
import { isFeatureAllowed } from '../../utils/entitlements.js' // di@147998
import { getAllowedChannels } from '../../utils/remote/channels.js' // qb@3665

// ---------------------------------------------------------------------------
// 2.1.183: DEFAULT_INTERVAL = agt @649363
// ---------------------------------------------------------------------------
const DEFAULT_INTERVAL = '10m'

// ---------------------------------------------------------------------------
// 2.1.183: INTERVAL_RE = u1f (declared @649364, assigned @649383) — leading "5m"/"2h" token
// 2.1.183: EVERY_RE    = d1f (declared @649365, assigned @649384) — trailing "every 20m"/"every 5 minutes" clause
// ---------------------------------------------------------------------------
const INTERVAL_RE = /^\d+[smhd]$/
const EVERY_RE =
  /^every\s+(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)\s*$/i

// ---------------------------------------------------------------------------
// 2.1.183: CRON_TABLE = m1f @649367-649368 (one packed string literal)
// The interval -> cron conversion table. Interpolated as ${m1f} by the dynamic
// prompt (y1f@649238); the legacy prompt (g1f@649164) inlines the same text
// literally — both render byte-identically to this const.
// VERBATIM from the bundle (one packed string; \u escapes decoded).
// ---------------------------------------------------------------------------
const CRON_TABLE = `| Interval pattern      | Cron expression     | Notes                                    |
|-----------------------|---------------------|------------------------------------------|
| \`Nm\` where N ≤ 59   | \`*/N * * * *\`     | every N minutes                          |
| \`Nm\` where N ≥ 60   | \`0 */H * * *\`     | round to hours (H = N/60, must divide 24)|
| \`Nh\` where N ≤ 23   | \`0 */N * * *\`     | every N hours                            |
| \`Nd\`                | \`0 0 */N * *\`     | every N days at midnight local           |
| \`Ns\`                | treat as \`ceil(N/60)m\` | cron minimum granularity is 1 minute  |

**If the interval doesn't cleanly divide its unit** (e.g. \`7m\` → \`*/7 * * * *\` gives uneven gaps at :56→:00; \`90m\` → 1.5h which cron can't express), pick the nearest clean interval and tell the user what you rounded to before scheduling.`

// ---------------------------------------------------------------------------
// 2.1.183: LEGACY_USAGE_MESSAGE = f1f @649386-649398
// Usage message shown when dynamic mode is OFF and the input is empty.
// VERBATIM from the bundle.
// ---------------------------------------------------------------------------
const LEGACY_USAGE_MESSAGE = `Usage: /loop [interval] <prompt>

Run a prompt or slash command on a recurring interval.

Intervals: Ns, Nm, Nh, Nd (e.g. 5m, 30m, 2h, 1d). Minimum granularity is 1 minute.
If no interval is specified, defaults to ${DEFAULT_INTERVAL}.

Examples:
  /loop 5m /babysit-prs
  /loop 30m check the deploy
  /loop 1h /standup 1
  /loop check the deploy          (defaults to ${DEFAULT_INTERVAL})
  /loop check the deploy every 20m`

// ---------------------------------------------------------------------------
// 2.1.183: pushNotifOutcomeSuffix = i7l @649085
// Appended to dynamic-mode "to stop the loop" instructions: when agent push
// notifications are enabled, ask the model to send a one-line outcome before stopping.
// ---------------------------------------------------------------------------
function pushNotifOutcomeSuffix(): string {
  // @649086
  if (isAgentPushNotifEnabled()) {
    return ` Before you stop, send a one-line outcome via ${PUSH_NOTIFICATION_TOOL_NAME} — the user may be away and waiting to hear it's done. Skip this if you're stopping because the user just told you to; they're already here.`
  }
  return ''
}

// ---------------------------------------------------------------------------
// 2.1.183: intervalFromEveryMatch = p1f @649090
// Normalizes an EVERY_RE match ([_, number, unitWord]) to `Ns`/`Nm`/`Nh`/`Nd`.
// Defaults to minutes when the unit word is none of s/h/d.
// ---------------------------------------------------------------------------
function intervalFromEveryMatch(match: RegExpMatchArray): string {
  const n = match[1]
  const unit = match[2]!.toLowerCase()
  if (unit.startsWith('s')) return `${n}s`
  if (unit.startsWith('h')) return `${n}h`
  if (unit.startsWith('d')) return `${n}d`
  return `${n}m`
}

// ---------------------------------------------------------------------------
// 2.1.183: cloudOfferSection = a7l @649098
// Conditional "## Offer cloud first" block. Only rendered when:
//   - NOT a remote session (env.CLAUDE_CODE_REMOTE falsy)            @649100
//   - NOT a background session (!isBackgroundSession())              @649101
//   - the "tengu_surreal_dali" flag is on                           @649102
//   - the "allow_remote_sessions" entitlement is allowed            @649103
//   - there are no remote channels connected (getAllowedChannels()===0) @649104
// VERBATIM body from the bundle.
// ---------------------------------------------------------------------------
function cloudOfferSection(): string {
  if (
    !parseBoolean(process.env.CLAUDE_CODE_REMOTE) &&
    !isBackgroundSession() &&
    isFeatureFlagEnabled('tengu_surreal_dali', false) &&
    isFeatureAllowed('allow_remote_sessions') &&
    getAllowedChannels().length === 0
  ) {
    return `
## Offer cloud first

Before any scheduling step, check whether EITHER is true:
- the parsed interval (rule 1 or 2) is **≥60 minutes**, or
- regardless of which rule matched, the original input uses daily phrasing ("every morning", "daily", "every day", "each night", "every weekday")

If either is true, call ${ASK_USER_QUESTION_TOOL_NAME} first:
- \`question\`: "This loop stops when you close this session. Set it up as a cloud schedule instead so it keeps running?"
- \`header\`: "Schedule"
- \`options\`: \`[{label: "Cloud schedule (recommended)", description: "Runs in Anthropic's cloud even after you close this session"}, {label: "This session only", description: "Runs in this terminal until you exit"}]\`

If they pick **Cloud schedule**: do NOT call ${CRON_CREATE_TOOL_NAME}. Invoke the \`schedule\` skill directly via the ${SKILL_TOOL_NAME} tool with \`args\` set to their original input verbatim (e.g. \`${SKILL_TOOL_NAME}({skill: "schedule", args: "every morning tell me a joke"})\`), then follow that skill's instructions to completion. Do NOT tell the user to run /schedule themselves. **Then stop — do not continue to any section below** (no ${CRON_CREATE_TOOL_NAME}, no ${SCHEDULE_WAKEUP_TOOL_NAME}, no "execute the prompt now").
If they pick **This session only**:
- If the trigger was a parsed ≥60-minute interval (rule 1 or 2): continue below with that interval.
- If the trigger was daily phrasing only (rule 3, no parsed interval): do NOT call ${CRON_CREATE_TOOL_NAME}. Explain that a daily-cadence loop won't fire before this session closes, so there's nothing useful to schedule locally — suggest they either pick Cloud schedule, or re-run \`/loop\` with an explicit shorter interval (e.g. \`/loop 1h <prompt>\`) if they want a session loop. Then stop.
If neither trigger condition was met: continue below.
`
  }
  return ''
}

// ---------------------------------------------------------------------------
// 2.1.183: sessionOnlyFooterLine = l7l @649126
// Conditional italic "_Runs until you close this session …_" confirmation footer.
// Two variants depending on whether remote channels are connected.
// Same outer gate as cloudOfferSection (minus the channels===0 check).
// VERBATIM strings from the bundle.
// ---------------------------------------------------------------------------
function sessionOnlyFooterLine(): string {
  if (
    !parseBoolean(process.env.CLAUDE_CODE_REMOTE) &&
    !isBackgroundSession() &&
    isFeatureFlagEnabled('tengu_surreal_dali', false) &&
    isFeatureAllowed('allow_remote_sessions')
  ) {
    // @649128: remote channels already connected -> always append the line
    if (getAllowedChannels().length > 0) {
      return ` End the confirmation with this exact line on its own, italicized: \`_Runs until you close this session · For durable cloud-based loops, use /schedule_\``
    }
    // @649130: only append when the cloud-offer was NOT shown above
    return ` Only if you did NOT show the cloud-offer ${ASK_USER_QUESTION_TOOL_NAME} above (i.e., neither trigger condition applied), end the confirmation with this exact line on its own, italicized: \`_Runs until you close this session · For durable cloud-based loops, use /schedule_\`. If the user already answered that question, omit this line.`
  }
  return ''
}

// ---------------------------------------------------------------------------
// 2.1.183: fixedIntervalActionBlock = A1f @649134
// The numbered "Action" block for fixed-interval mode: CronCreate, confirm,
// then execute the prompt now. VERBATIM from the bundle.
// ---------------------------------------------------------------------------
function fixedIntervalActionBlock(): string {
  return `1. Call ${CRON_CREATE_TOOL_NAME} with: \`cron\` (the expression above), \`prompt\` (the parsed prompt verbatim), \`recurring: true\`.
2. Briefly confirm: what's scheduled, the cron expression, the human-readable cadence, that recurring tasks auto-expire after ${DEFAULT_MAX_AGE_DAYS} days, and that the user can cancel sooner with ${CRON_DELETE_TOOL_NAME} (include the job ID).${sessionOnlyFooterLine()}
3. **Then immediately execute the parsed prompt now** — don't wait for the first cron fire. If it's a slash command, invoke it via the Skill tool; otherwise act on it directly.`
}

// ---------------------------------------------------------------------------
// 2.1.183: buildFixedIntervalLoopPrompt = g1f @649139
// The legacy full prompt used when dynamic mode is OFF (isDynamicLoopEnabled()===false).
// This is the direct descendant of the v2.1.88 buildPrompt(args), with two
// interpolated sections added (cloudOfferSection / sessionOnlyFooterLine).
// VERBATIM template from the bundle. NOTE: the bundle's g1f inlines the cron
// table LITERALLY @649164-649172 (not a ${m1f} interpolation); we substitute
// ${CRON_TABLE} here — the inlined literal is byte-identical to the m1f const.
// ---------------------------------------------------------------------------
function buildFixedIntervalLoopPrompt(args: string): string {
  return `# /loop — schedule a recurring prompt

Parse the input below into \`[interval] <prompt…>\` and schedule it with ${CRON_CREATE_TOOL_NAME}.

## Parsing (in priority order)

1. **Leading token**: if the first whitespace-delimited token matches \`^\\d+[smhd]$\` (e.g. \`5m\`, \`2h\`), that's the interval; the rest is the prompt.
2. **Trailing "every" clause**: otherwise, if the input ends with \`every <N><unit>\` or \`every <N> <unit-word>\` (e.g. \`every 20m\`, \`every 5 minutes\`, \`every 2 hours\`), extract that as the interval and strip it from the prompt. Only match when what follows "every" is a time expression — \`check every PR\` has no interval.
3. **Default**: otherwise, interval is \`${DEFAULT_INTERVAL}\` and the entire input is the prompt.

If the resulting prompt is empty, show usage \`/loop [interval] <prompt>\` and stop — do not call ${CRON_CREATE_TOOL_NAME}.

Examples:
- \`5m /babysit-prs\` → interval \`5m\`, prompt \`/babysit-prs\` (rule 1)
- \`check the deploy every 20m\` → interval \`20m\`, prompt \`check the deploy\` (rule 2)
- \`run tests every 5 minutes\` → interval \`5m\`, prompt \`run tests\` (rule 2)
- \`check the deploy\` → interval \`${DEFAULT_INTERVAL}\`, prompt \`check the deploy\` (rule 3)
- \`check every PR\` → interval \`${DEFAULT_INTERVAL}\`, prompt \`check every PR\` (rule 3 — "every" not followed by time)
- \`5m\` → empty prompt → show usage
${cloudOfferSection()}
## Interval → cron

Supported suffixes: \`s\` (seconds, rounded up to nearest minute, min 1), \`m\` (minutes), \`h\` (hours), \`d\` (days). Convert:

${CRON_TABLE}

## Action

1. Call ${CRON_CREATE_TOOL_NAME} with:
   - \`cron\`: the expression from the table above
   - \`prompt\`: the parsed prompt from above, verbatim (slash commands are passed through unchanged)
   - \`recurring\`: \`true\`
2. Briefly confirm: what's scheduled, the cron expression, the human-readable cadence, that recurring tasks auto-expire after ${DEFAULT_MAX_AGE_DAYS} days, and that they can cancel sooner with ${CRON_DELETE_TOOL_NAME} (include the job ID).${sessionOnlyFooterLine()}
3. **Then immediately execute the parsed prompt now** — don't wait for the first cron fire. If it's a slash command, invoke it via the Skill tool; otherwise act on it directly.

## Input

${args}`
}

// ---------------------------------------------------------------------------
// 2.1.183: buildDynamicUsageMessage = h1f @649187
// Usage message shown when dynamic mode is ON and the input is empty.
// (Differs from LEGACY_USAGE_MESSAGE: mentions self-pacing / model-picked delays.)
// VERBATIM from the bundle.
// ---------------------------------------------------------------------------
function buildDynamicUsageMessage(): string {
  return `Usage: /loop [interval] <prompt>

Run a prompt or slash command on a recurring interval — or with no interval, let the model self-pace based on the task.

Intervals: Ns, Nm, Nh, Nd (e.g. 5m, 30m, 2h, 1d). Minimum granularity is 1 minute.
If no interval is specified, the model picks a delay between iterations based on what it's doing.

Examples:
  /loop 5m /babysit-prs
  /loop 30m check the deploy
  /loop 1h /standup 1
  /loop check the deploy          (dynamic — model picks delays)
  /loop check the deploy every 20m`
}

// ---------------------------------------------------------------------------
// 2.1.183: buildDynamicLoopPrompt = y1f @649202
// Full prompt used when dynamic mode is ON and there IS a (non-empty) input.
// Has BOTH a fixed-interval mode section (rules 1&2) and a dynamic-mode section
// (rule 3: self-pace via ScheduleWakeup + optional Monitor event-gating).
// The inner `selfPaceInstructions` (`t` in the bundle) is the dynamic-mode body.
// VERBATIM strings from the bundle.
// ---------------------------------------------------------------------------
function buildDynamicLoopPrompt(args: string): string {
  // @649203: the self-pacing instructions block (`t` in the bundle)
  const selfPaceInstructions = `The user wants you to self-pace. Decide what makes the next iteration worth running — a passage of time, or an observable event.

1. **Run the parsed prompt now.** If it's a slash command, invoke it via the Skill tool; otherwise act on it directly.
2. **If the next run is gated on an event** (CI finishing, a log line matching, a file changing, a PR comment) and no ${MONITOR_TOOL_NAME} is already running for it: arm one now with \`persistent: true\`. Its events arrive as \`<task-notification>\` messages and wake this loop immediately — you do not wait for the ${SCHEDULE_WAKEUP_TOOL_NAME} deadline. Arm once; on later iterations call ${TASK_LIST_TOOL_NAME} first and skip this step if a monitor is already running.
3. **Briefly confirm**: that you're self-pacing, whether a ${MONITOR_TOOL_NAME} is the primary wake signal, that you ran the task now, and what fallback delay you're about to pick. Write this as text *before* calling ${SCHEDULE_WAKEUP_TOOL_NAME} — the turn ends as soon as that tool returns.
4. **Then, as the last action of this turn, call ${SCHEDULE_WAKEUP_TOOL_NAME}** with:
   - \`delaySeconds\`: with a ${MONITOR_TOOL_NAME} armed this is the **fallback heartbeat** — how long to wait if no event fires (lean 1200–1800s; idle ticks past the 5-minute cache window are pure overhead). Without a ${MONITOR_TOOL_NAME} this is the cadence — pick based on what you observed. Read the tool's own description for cache-aware delay guidance.
   - \`reason\`: one short sentence on why you picked that delay.
   - \`prompt\`: the full original /loop input verbatim, prefixed with \`/loop \` so the next firing re-enters this skill and continues the loop. For example, if the user typed \`/loop check the deploy\`, pass \`/loop check the deploy\` as the prompt.
5. **If you were woken by a \`<task-notification>\`** rather than this prompt: handle the event in the context of the loop task, then call ${SCHEDULE_WAKEUP_TOOL_NAME} again with the same \`prompt\` and the same 1200–1800s \`delaySeconds\` from step 4 — the ${MONITOR_TOOL_NAME} remains the wake signal; this only resets the safety net.
6. **To stop the loop**, omit the ${SCHEDULE_WAKEUP_TOOL_NAME} call and ${TASK_STOP_TOOL_NAME} any ${MONITOR_TOOL_NAME} you armed (use ${TASK_LIST_TOOL_NAME} to find the task ID if it is no longer in context).${pushNotifOutcomeSuffix()}`

  return `# /loop — schedule a recurring or self-paced prompt

Parse the input below into \`[interval] <prompt…>\` and schedule it.

## Parsing (in priority order)

1. **Leading token**: if the first whitespace-delimited token matches \`^\\d+[smhd]$\` (e.g. \`5m\`, \`2h\`), that's the interval; the rest is the prompt.
2. **Trailing "every" clause**: otherwise, if the input ends with \`every <N><unit>\` or \`every <N> <unit-word>\` (e.g. \`every 20m\`, \`every 5 minutes\`, \`every 2 hours\`), extract that as the interval and strip it from the prompt. Only match when what follows "every" is a time expression — \`check every PR\` has no interval.
3. **No interval**: otherwise, the entire input is the prompt and you'll self-pace dynamically (see "Dynamic mode" below).

If the resulting prompt is empty, show usage \`/loop [interval] <prompt>\` and stop.

Examples:
- \`5m /babysit-prs\` → interval \`5m\`, prompt \`/babysit-prs\` (rule 1)
- \`check the deploy every 20m\` → interval \`20m\`, prompt \`check the deploy\` (rule 2)
- \`run tests every 5 minutes\` → interval \`5m\`, prompt \`run tests\` (rule 2)
- \`check the deploy\` → no interval → dynamic mode, prompt \`check the deploy\` (rule 3)
- \`check every PR\` → no interval → dynamic mode, prompt \`check every PR\` (rule 3 — "every" not followed by time)
- \`5m\` → empty prompt → show usage
${cloudOfferSection()}
## Fixed-interval mode (rules 1 and 2)

Convert the interval to a cron expression:

${CRON_TABLE}

Then:
${fixedIntervalActionBlock()}

## Dynamic mode (rule 3 — no interval)

${selfPaceInstructions}

## Input

${args}`
}

// ---------------------------------------------------------------------------
// 2.1.183: buildEmptyInputDefaultPrompt = inner closure `a(loopFile, dynamic)` in _1f @649278
//
// Reached when isLoopDefaultPromptEnabled() is true AND the input is empty
// (or just a bare interval). Builds the "default" prompt across 2 × 2 cases:
//
//   loopFile  present  -> run tasks from loop.md (readLoopFile())
//   loopFile  null     -> run the autonomous-loop default
//                          (logAutonomousLoopActivation() + getAutonomousLoopPreamble())
//   dynamic   true      -> self-pace via ScheduleWakeup, no cron
//                          (sentinel: LOOP_FILE_DYNAMIC_SENTINEL / AUTONOMOUS_LOOP_DYNAMIC_SENTINEL)
//   dynamic   false     -> schedule a recurring cron each tick
//                          (sentinel: LOOP_FILE_SENTINEL / AUTONOMOUS_LOOP_SENTINEL)
//
// The `interval` param (`i` in the bundle: intervalFromEveryMatch(everyMatch) || input || DEFAULT_INTERVAL)
// only appears as flavor text describing what the user typed. VERBATIM strings from the bundle.
// ---------------------------------------------------------------------------
function buildEmptyInputDefaultPrompt(
  loopFile: { path: string; content: string } | null,
  interval: string,
  dynamic: boolean,
): string {
  // @649279: section header naming the source of the work for this tick
  const sourceHeader = loopFile
    ? `## Loop tasks (from ${loopFile.path})`
    : '## Autonomous-loop instructions (for the immediate execution and every fire)'

  // @649283: the inlined work body (loop.md contents, or the autonomous preamble)
  let inlinedInstructions: string
  if (loopFile) {
    inlinedInstructions = loopFile.content
  } else {
    // @649284: first activation of the autonomous default — log it, then inline the preamble
    logAutonomousLoopActivation()
    inlinedInstructions = getAutonomousLoopPreamble()
  }

  // @649285: human label for "run X now"
  const runLabel = loopFile ? 'the loop.md tasks' : 'the autonomous check'

  // -------- Dynamic-pacing default (ScheduleWakeup, no cron) -------- @649286
  if (dynamic) {
    // @649287: the sentinel the model must pass back to ScheduleWakeup
    const dynamicSentinel = loopFile
      ? LOOP_FILE_DYNAMIC_SENTINEL
      : AUTONOMOUS_LOOP_DYNAMIC_SENTINEL

    // @649288: title/intro
    const title = loopFile
      ? `# /loop — loop.md tasks with dynamic pacing

The user invoked \`/loop\` with no prompt and no interval and has a loop-tasks file at \`${loopFile.path}\`. Run those tasks now, then self-pace the next iteration via ${SCHEDULE_WAKEUP_TOOL_NAME} — no cron.`
      : `# /loop — autonomous default with dynamic pacing

The user invoked \`/loop\` with no prompt and no interval. Run the autonomous check now, then self-pace the next iteration via ${SCHEDULE_WAKEUP_TOOL_NAME} — no cron.`

    // @649295: fragment of the "briefly confirm" line
    const confirmFragment = loopFile
      ? `that you're running tasks from \`${loopFile.path}\` in dynamic-pacing mode, that you ran the first tick now`
      : 'that this is the autonomous default in dynamic-pacing mode, that you ran the check now'

    // @649298: the numbered action block
    const actionBlock = `1. **Run ${runLabel} now**, following the instructions inlined below.
2. **If the next tick is gated on an event** (CI finishing, a PR comment, a log line) and no ${MONITOR_TOOL_NAME} is already running for it: arm one now with \`persistent: true\`. Its events wake this loop immediately — you do not wait for the ${SCHEDULE_WAKEUP_TOOL_NAME} deadline. Arm once; on later ticks call ${TASK_LIST_TOOL_NAME} first and skip if a monitor is already running.
3. **Briefly confirm**: ${confirmFragment}, whether a ${MONITOR_TOOL_NAME} is the primary wake signal, and what fallback delay you're about to pick. Write this as text *before* calling ${SCHEDULE_WAKEUP_TOOL_NAME} — the turn ends as soon as that tool returns.
4. **Then, as the last action of this turn, call ${SCHEDULE_WAKEUP_TOOL_NAME}** with:
   - \`delaySeconds\`: with a ${MONITOR_TOOL_NAME} armed this is the fallback heartbeat (lean 1200–1800s). Without one, pick based on what you observed this turn — quiet branch? wait longer. Lots in flight? wait shorter. Read the tool's own description for cache-aware delay guidance.
   - \`reason\`: one short sentence on why you picked that delay.
   - \`prompt\`: the literal string \`${dynamicSentinel}\` — the dynamic-mode sentinel expands at fire time to the full instructions (first fire / first fire post-compact / loop.md edited) or a dynamic-pacing-specific short reminder (subsequent fires). Do not pass the full instructions; that is handled automatically.
5. **If woken by a \`<task-notification>\`** rather than this prompt: handle the event, then call ${SCHEDULE_WAKEUP_TOOL_NAME} again with \`${dynamicSentinel}\` and the same 1200–1800s \`delaySeconds\` — the ${MONITOR_TOOL_NAME} remains the wake signal; this only resets the safety net.
6. **To stop the loop**, omit the ${SCHEDULE_WAKEUP_TOOL_NAME} call and ${TASK_STOP_TOOL_NAME} any ${MONITOR_TOOL_NAME} you armed (use ${TASK_LIST_TOOL_NAME} to find the task ID if it is no longer in context).${pushNotifOutcomeSuffix()}`

    return `${title}

## Action

${actionBlock}

${sourceHeader}

${inlinedInstructions}`
  }

  // -------- Cron-scheduled default (recurring CronCreate each tick) -------- @649317
  const cronSentinel = loopFile ? LOOP_FILE_SENTINEL : AUTONOMOUS_LOOP_SENTINEL

  // @649318: title/intro
  const title = loopFile
    ? `# /loop — schedule loop.md tasks

The user invoked \`/loop\` with no prompt (input was empty or just the interval \`${interval}\`) and has a loop-tasks file at \`${loopFile.path}\`. Schedule a recurring cron that runs those tasks each tick, then run the first tick immediately.`
    : `# /loop — schedule the autonomous default

The user invoked \`/loop\` with no prompt (input was empty or just the interval \`${interval}\`). Schedule the autonomous-loop default and then run the first autonomous check immediately.`

  // @649325: explanation of what the sentinel expands to at fire time
  const sentinelExpansion = loopFile
    ? 'it expands at fire time to the full loop.md contents on first delivery (and whenever loop.md has been edited since last fire), and to a short reminder on subsequent unchanged fires. The long instructions stay in the cached message-prefix.'
    : 'it expands at fire time to the full autonomous-loop instructions on first delivery, and to a short reminder on subsequent fires (the long instructions stay in the cached message-prefix).'

  // @649328: the "briefly confirm" clause
  const confirmClause = loopFile
    ? `what's scheduled, the cron expression, the human-readable cadence, that it's running tasks from \`${loopFile.path}\`, that recurring tasks auto-expire after ${DEFAULT_MAX_AGE_DAYS} days, and that the user can cancel sooner with ${CRON_DELETE_TOOL_NAME} (include the job ID).`
    : `what's scheduled, the cron expression, the human-readable cadence, that recurring tasks auto-expire after ${DEFAULT_MAX_AGE_DAYS} days, and that they can cancel sooner with ${CRON_DELETE_TOOL_NAME} (include the job ID). Mention this is the autonomous default and that the autonomous-loop instructions are baked in.`

  return `${title}

## Action

1. Convert \`${interval}\` to a 5-field cron expression. Supported suffixes: \`s\` → ceil to nearest minute, \`m\` (minutes), \`h\` (hours), \`d\` (days). Examples: \`5m\` → \`*/5 * * * *\`, \`1h\` → \`0 * * * *\`, \`1d\` → \`0 0 * * *\`. If the interval doesn't cleanly divide its unit, round to the nearest clean interval and tell the user what you rounded to.
2. Call ${CRON_CREATE_TOOL_NAME} with:
   - \`cron\`: the expression from step 1
   - \`prompt\`: the literal string \`${cronSentinel}\` — ${sentinelExpansion}
   - \`recurring\`: \`true\`
3. Briefly confirm: ${confirmClause}
4. **Then immediately run ${runLabel} now**, following the instructions inlined below. Don't wait for the first cron fire.

${sourceHeader}

${inlinedInstructions}`
}

// ---------------------------------------------------------------------------
// 2.1.183: registerLoopSkill = _1f @649251 (ap({...}) call opens @649252)
//
// Registers the `loop` bundled skill (aliases: ["proactive"]).
// Dispatch in getPromptForCommand:
//
//   trimmed input -> match EVERY_RE (everyMatch), isEmpty, isIntervalOrEvery
//   IF (isEmpty || isIntervalOrEvery):                                 @649275
//     IF isLoopDefaultPromptEnabled():                                 @649276
//        interval = intervalFromEveryMatch(everyMatch) || input || DEFAULT_INTERVAL
//        loopFile = readLoopFile()                                     @649347
//        IF (isEmpty && isDynamicLoopEnabled()) -> default(loopFile, dynamic=true) @649348
//        ELSE                                   -> default(loopFile, dynamic=false) @649349
//   IF isDynamicLoopEnabled():                                         @649353
//     empty -> buildDynamicUsageMessage(); else -> buildDynamicLoopPrompt()
//   ELSE (legacy):                                                     @649357
//     empty -> LEGACY_USAGE_MESSAGE; else -> buildFixedIntervalLoopPrompt()
//
// NOTE: the isEmpty/isIntervalOrEvery branch only *enters* the default-prompt
// path; if isLoopDefaultPromptEnabled() is false it falls through to the
// dynamic/legacy branches below (matching the bundle's control flow exactly).
// ---------------------------------------------------------------------------
export function registerLoopSkill(): void {
  registerBundledSkill({
    name: 'loop',
    // 2.1.183 DELTA: menuDescription is NEW (registrar ap@546993 + this skill).
    // It is the short slash-menu label; `description` stays the model-invocation text.
    menuDescription:
      'Repeat a prompt or command on an interval (e.g. /loop 5m /foo)',
    aliases: ['proactive'],
    // @649256: dynamic-aware description getter
    get description() {
      if (isDynamicLoopEnabled()) {
        return 'Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo). Omit the interval to let the model self-pace.'
      }
      return 'Run a prompt or slash command on a recurring interval (e.g. /loop 5m /foo, defaults to 10m)'
    },
    whenToUse:
      'When the user wants to set up a recurring task, poll for status, or run something repeatedly on an interval (e.g. "check the deploy every 5 minutes", "keep running /babysit-prs"). Do NOT invoke for one-off tasks.',
    // @649263: argumentHint getter — prompt becomes optional once the default-prompt path exists
    get argumentHint() {
      if (isLoopDefaultPromptEnabled()) return '[interval] [prompt]'
      return '[interval] <prompt>'
    },
    userInvocable: true,
    isEnabled: isLoopEnabled,
    async getPromptForCommand(args /* , ctx */) {
      const trimmed = args.trim()

      // @649272: parse leading interval / trailing "every" clause
      const everyMatch = trimmed.match(EVERY_RE)
      const isEmpty = !trimmed
      const isIntervalOrEvery = INTERVAL_RE.test(trimmed) || everyMatch !== null

      // @649275: empty input OR a bare interval/every with no prompt body
      if (isEmpty || isIntervalOrEvery) {
        // @649276: the loop.md / autonomous default-prompt path
        if (isLoopDefaultPromptEnabled()) {
          const interval = everyMatch
            ? intervalFromEveryMatch(everyMatch)
            : trimmed || DEFAULT_INTERVAL
          const loopFile = readLoopFile() // @649347

          // @649348: empty input + dynamic flag -> dynamic-pacing default
          if (isEmpty && isDynamicLoopEnabled()) {
            return [
              {
                type: 'text',
                text: buildEmptyInputDefaultPrompt(loopFile, interval, true),
              },
            ]
          }
          // @649349: otherwise the cron-scheduled default
          return [
            {
              type: 'text',
              text: buildEmptyInputDefaultPrompt(loopFile, interval, false),
            },
          ]
        }
        // (falls through to the branches below when default-prompt is disabled)
      }

      // @649353: dynamic mode (self-pacing) enabled
      if (isDynamicLoopEnabled()) {
        if (!trimmed) {
          return [{ type: 'text', text: buildDynamicUsageMessage() }]
        }
        return [{ type: 'text', text: buildDynamicLoopPrompt(trimmed) }]
      }

      // @649357: legacy fixed-interval-only mode
      if (!trimmed) {
        return [{ type: 'text', text: LEGACY_USAGE_MESSAGE }]
      }
      return [{ type: 'text', text: buildFixedIntervalLoopPrompt(trimmed) }]
    },
  })
}
