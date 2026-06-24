// ============================================================================
// /goal — non-interactive twin + shared goal machinery (set / clear / validate)
//
// v2.1.183 regions covered:
//   - machinery module (FWe@454510-454519), chunks @454437-454509:
//       isClearKeyword (FGn@454437), findLastAchievedGoal (AQa@454440),
//       formatLastReason (gQa@454450), findStopPromptHooks (Jdt@454453),
//       goalGateCheck (ego@454461), validateGoalCondition (Qdt@454466),
//       clearGoal (Zdt@454481), makeGoalStatusAttachment (hQa@454494),
//       MAX_GOAL_CONDITION_CHARS (Xdt@454503=4000), buildGoalPrompt (UGn@454505),
//       TRUST_GATE_MESSAGE (VUp@454507), HOOKS_GATE_MESSAGE (zUp@454508),
//       CLEAR_KEYWORDS (qUp; var decl @454504, assigned @454518)
//   - non-interactive command call (module bPl@562013, SPl init @562040),
//       chunks @562015-562039: goalNonInteractive (wmf@562015)
//
// v2.1.88 convention/ancestor: NONE for goal (2.1.156-era feature). This file
//   reconstructs the bundle machinery + the `local` non-interactive call directly.
//
// 2.1.156 -> 2.1.183 delta: ONE machinery string changed — the HOOKS_GATE_MESSAGE
//   (zUp): 2.1.156 read "...hooks are disabled..." (Sg_ body @447986); 2.1.183 reads
//   "...hooks are restricted..." (zUp @454509). Everything else here (buildGoalPrompt,
//   the set/clear logic, gate ordering, MAX=4000, clear keywords, TRUST_GATE_MESSAGE,
//   the non-interactive call ladder) is byte-identical to 2.1.156 (FT8 prompt @447983,
//   Si6 gate @447938, $jz call). The other goal delta is the local-jsx description in
//   index.ts.
//
// Cross-validation: buildGoalPrompt text matches 2.1.156 @447983 verbatim; TRUST_GATE_MESSAGE
//   matches 2.1.156 (hg_ @447984) verbatim; HOOKS_GATE_MESSAGE differs ("disabled"->"restricted");
//   result strings match assets and the 2.1.156 bundle.
// ============================================================================

import { randomUUID } from 'crypto'
import type { Message, Attachment } from '../../types/messages.js'
import type { CommandContext, NonInteractiveResult } from '../../types/command.js'
import { collapseNewlines, pluralize } from '../../utils/string.js' // Kd@10156, vn@10069
import { getSessionId } from '../../state/session.js'              // xt@2661
import { getOutputTokens } from '../../state/usage.js'             // rb@2816
import { getStopHooks } from '../../hooks/registry.js'             // g0e@385695
import { isHooksDisabledByPolicy, isHooksRestricted } from '../../hooks/policy.js' // f2@150375, Qse@150369
import { isNonInteractive, isRemoteWorkspace } from '../../state/caps.js' // xr@3151, _a@3638
import { isTrusted } from '../../trust/index.js'                   // Lp@591980
import { logEvent, logFeatureOk, logFeatureSad, sanitizeFeatureName } from '../../services/analytics/index.js' // G@3810, Le@44569, Rt@44575, Qe@137

// ---------------------------------------------------------------------------
// Active-goal app-state shape (state.activeGoal). Set on a successful goal,
// cleared on clear / auto-clear.
// ---------------------------------------------------------------------------
export interface ActiveGoal {
  condition: string
  iterations: number
  setAt: number
  tokensAtStart: number
  /** Most recent Stop-hook reason for why the goal is not yet met (used in UI). */
  lastReason?: string
}

// 2.1.183: MAX_GOAL_CONDITION_CHARS = Xdt @454503
export const MAX_GOAL_CONDITION_CHARS = 4000

// 2.1.183: CLEAR_KEYWORDS = qUp (var decl @454504; assigned in FWe module init @454518)
const CLEAR_KEYWORDS = new Set(['clear', 'stop', 'off', 'reset', 'none', 'cancel'])

// 2.1.183: isClearKeyword = FGn @454437
// True when the user typed a clear keyword (case-insensitive) instead of a condition.
export function isClearKeyword(arg: string): boolean {
  return CLEAR_KEYWORDS.has(arg.toLowerCase())
}

// 2.1.183: buildGoalPrompt = UGn @454505
// The verbatim Stop-hook directive injected into the conversation when a goal is set.
// VERBATIM — do not reflow. (Bundle source has — decoded to the em dash —.)
export const buildGoalPrompt = (condition: string): string =>
  `A session-scoped Stop hook is now active with condition: "${condition}". Briefly acknowledge the goal, then immediately start (or continue) working toward it — treat the condition itself as your directive and do not pause to ask the user what to do. The hook will block stopping until the condition holds. It auto-clears once the condition is met — do not tell the user to run \`/goal clear\` after success; that's only for clearing a goal early.`

// 2.1.183: TRUST_GATE_MESSAGE = VUp @454507
const TRUST_GATE_MESSAGE =
  '/goal is only available in trusted workspaces. Restart, accept the trust dialog, and try again.'

// 2.1.183: HOOKS_GATE_MESSAGE = zUp (var decl @454508; string body @454509)
// 2.1.156 -> 2.1.183 delta: was "...hooks are disabled..." in 2.1.156 (Sg_ body @447986);
//   "disabled" became "restricted" in 2.1.183 — the only changed machinery string.
const HOOKS_GATE_MESSAGE =
  "/goal can't run while hooks are restricted (disableAllHooks or allowManagedHooksOnly is set in settings or by policy)."

// 2.1.183: formatLastReason = gQa @454450
// Renders the last Stop-hook reason as a single-line "Last check: …" string.
export function formatLastReason(reason: string): string {
  return `Last check: ${collapseNewlines(reason.trim())}`
}

// 2.1.183: findLastAchievedGoal = AQa @454440
// Scans messages newest-first for the last met (non-sentinel) goal_status attachment.
// Used by the interactive dialog to show "Goal achieved" with its stats.
export function findLastAchievedGoal(
  messages: Message[],
): { condition: string; iterations: number; durationMs: number; tokens: number } | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i]
    if (message?.type !== 'attachment' || message.attachment.type !== 'goal_status') continue // @454443
    const attachment = message.attachment
    // sentinel attachments are the synthetic set/clear markers; skip them and unmet ones.
    if (!attachment.met || attachment.sentinel) continue // @454445
    return {
      condition: attachment.condition,
      iterations: attachment.iterations,
      durationMs: attachment.durationMs,
      tokens: attachment.tokens,
    }
  }
  return null
}

// 2.1.183: findStopPromptHooks = Jdt @454453
// Collects the session-scoped "prompt" Stop hooks that goal installs:
// empty matcher, no skillRoot (i.e. the ones goal itself added).
function findStopPromptHooks(appState: unknown, sessionId: string) {
  const result: Array<{ type: 'prompt'; prompt: string }> = []
  const stopHooks = getStopHooks(appState, sessionId, 'Stop').get('Stop') ?? [] // @454455
  for (const entry of stopHooks) {
    if (entry.matcher !== '' || entry.skillRoot !== undefined) continue // @454456
    for (const hook of entry.hooks) {
      if (hook.type === 'prompt') result.push(hook)
    }
  }
  return result
}

// 2.1.183: goalGateCheck = ego @454461
// Returns a blocking {message, code} if goal cannot run, else null.
// Order matters: hooks restriction is checked before trust.
function goalGateCheck(): { message: string; code: 'hooks_gate' | 'trust_gate' } | null {
  if (isHooksDisabledByPolicy() || isHooksRestricted())
    return { message: HOOKS_GATE_MESSAGE, code: 'hooks_gate' } // @454462
  if (!isNonInteractive() && !isTrusted())
    return { message: TRUST_GATE_MESSAGE, code: 'trust_gate' } // @454463
  return null
}

// 2.1.183: makeGoalStatusAttachment = hQa @454494
// Synthetic sentinel attachment appended to the transcript on set (met:false) and
// on clear (met:true) so the conversation reflects the goal lifecycle.
function makeGoalStatusAttachment(met: boolean, condition: string): Attachment {
  return {
    type: 'attachment',
    uuid: randomUUID(),
    timestamp: new Date().toISOString(),
    attachment: { type: 'goal_status', met, sentinel: true, condition },
  }
}

// 2.1.183: validateGoalCondition (set path) = Qdt @454466
// Installs the goal: gate-check, replace any existing goal Stop hooks with a new
// prompt Stop hook carrying `condition`, set activeGoal state, append the set
// sentinel, log analytics. Returns an error string to show the user, or null on success.
export function setGoal(condition: string, context: CommandContext): string | null {
  const gate = goalGateCheck()
  if (gate !== null) {
    logFeatureSad('goal_set', gate.code) // Rt('goal_set', code) @454468
    return gate.message
  }

  const sessionId = getSessionId()

  // Remove any previously-installed goal Stop hooks so a new goal replaces the old.
  for (const hook of findStopPromptHooks(context.getAppState(), sessionId)) {
    context.sessionHooksRegistry.remove(sessionId, 'Stop', hook) // @454470
  }

  // Install the goal as a session-scoped, empty-matcher "prompt" Stop hook whose
  // prompt is the raw condition. The Stop-hook machinery evaluates it each stop.
  context.sessionHooksRegistry.add(sessionId, 'Stop', '', { type: 'prompt', prompt: condition }) // @454471

  const activeGoal: ActiveGoal = {
    condition,
    iterations: 0,
    setAt: Date.now(),
    tokensAtStart: getOutputTokens(),
  }

  context.setAppState((state) => ({ ...state, activeGoal })) // @454474
  context.applyMessageOp({ type: 'append', messages: [makeGoalStatusAttachment(false, condition)] }) // @454475
  logEvent('tengu_stop_hook_added', { promptLength: condition.length, via: sanitizeFeatureName('goal') }) // @454476
  logFeatureOk('goal_set') // Le('goal_set') @454477
  return null
}

// 2.1.183: clearGoal = Zdt @454481
// Removes the goal Stop hook(s), clears activeGoal, appends the "met" sentinel,
// logs removal. Returns the cleared prompt (for the "Goal cleared: …" message),
// or null if there was no goal to clear.
export function clearGoal(context: CommandContext): string | null {
  const sessionId = getSessionId()
  const hooks = findStopPromptHooks(context.getAppState(), sessionId)
  if (hooks.length === 0) return null // @454484

  const clearedPrompt = hooks[0].prompt
  for (const hook of hooks) {
    context.sessionHooksRegistry.remove(sessionId, 'Stop', hook) // @454486
  }

  context.setAppState((state) =>
    state.activeGoal === undefined ? state : { ...state, activeGoal: undefined },
  ) // @454488
  context.applyMessageOp({ type: 'append', messages: [makeGoalStatusAttachment(true, clearedPrompt)] }) // @454489
  logEvent('tengu_stop_hook_removed', { via: sanitizeFeatureName('goal') }) // @454490
  return clearedPrompt
}

// ---------------------------------------------------------------------------
// 2.1.183: goalNonInteractive (call) = wmf @562015  (module bPl @562013,
//   exports `call: () => wmf`)
//   type:'local' command call: returns a NonInteractiveResult.
// ---------------------------------------------------------------------------
export const call = async (
  args: string,
  context: CommandContext,
): Promise<NonInteractiveResult> => {
  const arg = args.trim()

  // Empty: show current goal status (or usage when none).
  if (arg === '') {
    const goal = context.options.activeGoal
    if (!goal) return { type: 'text', value: 'No goal set. Usage: `/goal <condition>`' } // @562019
    const status =
      goal.iterations === 0
        ? 'not yet evaluated'
        : `${goal.iterations} ${pluralize(goal.iterations, 'turn')}` // @562020
    const lastReasonLine = goal.lastReason ? `\n${formatLastReason(goal.lastReason)}` : '' // @562021-562024
    return { type: 'text', value: `Goal active: ${goal.condition} (${status})${lastReasonLine}` } // @562025
  }

  // Clear keyword: tear down the active goal.
  if (isClearKeyword(arg)) {
    const cleared = clearGoal(context)
    return { type: 'text', value: cleared === null ? 'No goal set' : `Goal cleared: ${cleared}` } // @562029
  }

  // Too long: reject before installing.
  if (arg.length > MAX_GOAL_CONDITION_CHARS) {
    logFeatureSad('goal_set', 'too_long') // Rt('goal_set','too_long') @562033
    return {
      type: 'text',
      value: `Goal condition is limited to ${MAX_GOAL_CONDITION_CHARS} characters (got ${arg.length})`,
    }
  }

  // Set: install the goal; on gate failure surface the gate message.
  const error = setGoal(arg, context)
  if (error !== null) return { type: 'text', value: error } // @562037

  // Success: emit a query carrying the goal directive as the prompt.
  return { type: 'query', value: `Goal set: ${arg}`, prompt: buildGoalPrompt(arg) } // @562038
}
