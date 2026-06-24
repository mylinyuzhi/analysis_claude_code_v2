// ============================================================================
// /goal — interactive Ink dialog + local-jsx command call
//
// v2.1.183 regions covered (modules gPl / _Pl):
//   - ActiveGoalDialog (APl@561812): renders active / achieved / no-goal states
//   - incrementIterations (Hmf@561943): n => n+1 (1s re-render tick)
//   - selectActiveGoal (vmf@561946): state => state.activeGoal
//   - LabelRow (NIo@561949): "label: <wrapped children>" row
//   - goal local-jsx module (yPl@561986 = { call: Tmf }); call Tmf@561989
//
// v2.1.88 convention/ancestor: src/commands/effort/effort.tsx (a local-jsx command
//   whose `call(onDone, context, args)` returns an Ink node that reads app state via
//   a selector and finishes via onDone). goal has no named-TS ancestor; this mirrors
//   the effort idiom and reconstructs the bundle component faithfully.
//
// 2.1.156 -> 2.1.183 delta: interactive component + call unchanged from 2.1.156.
//
// Cross-validation: dialog text ("◎ Goal active", "/goal clear to stop early",
//   "Goal achieved", "/goal <condition> to set another", "No goal set") read
//   verbatim from the 183 bundle; call dispatch matches goalNonInteractive.
//
// Note: the bundle output is React-compiler-cached (the t[…] memo slots). The cache
//   bookkeeping is omitted here; the render behavior is preserved (per task allowance).
// ============================================================================

import * as React from 'react'
import { useAppState } from '../../state/AppState.js'
import type { Message } from '../../types/messages.js'
import type { LocalJSXCommandOnDone } from '../../types/command.js'
import { Box, Text } from '../../components/ink.js' // B (Box), w (Text)
import { Dialog } from '../../components/Dialog.js' // zn
import { InputGuide, GuideHint, GuideRow } from '../../components/InputGuide.js' // ic, bn, and chord row `at`
import { StatusIndicator } from '../../components/StatusIndicator.js' // Ns
import { useInterval } from '../../hooks/useInterval.js' // du
import { collapseNewlines, pluralize } from '../../utils/string.js' // Kd@10156, vn@10069
import { formatDuration } from '../../utils/time.js' // ea@10983
import { formatTokens } from '../../utils/tokens.js' // _l@11032
import { getOutputTokens } from '../../state/usage.js' // rb@2816
import { logFeatureSad } from '../../services/analytics/index.js' // Rt@44575
import { ActiveGoal } from './goalNonInteractive.js'
import {
  buildGoalPrompt,
  clearGoal,
  findLastAchievedGoal,
  formatLastReason,
  isClearKeyword,
  MAX_GOAL_CONDITION_CHARS,
  setGoal,
} from './goalNonInteractive.js'

// 2.1.183: GOAL_GLYPH = nnn @53753  ("◎" → ◎)
const GOAL_GLYPH = '◎'

// 2.1.183: incrementIterations = Hmf @561943
const incrementIterations = (n: number): number => n + 1

// 2.1.183: selectActiveGoal = vmf @561946
export const selectActiveGoal = (state: { activeGoal?: ActiveGoal }): ActiveGoal | undefined =>
  state.activeGoal

// 2.1.183: LabelRow = NIo @561949
// A dimmed "label: " prefix on a flex-shrink:0 box, followed by flex-grow:1 wrapped content.
function LabelRow({ label, children }: { label: string; children: React.ReactNode }): React.ReactNode {
  return (
    <Box flexDirection="row">
      <Box flexShrink={0}>
        <Text dimColor>{label}: </Text>
      </Box>
      <Box flexGrow={1}>
        <Text wrap="wrap">{children}</Text>
      </Box>
    </Box>
  )
}

// 2.1.183: ActiveGoalDialog = APl @561812
// Three render branches:
//   (1) active goal  → "◎ Goal active" with running stats + Goal/Last check rows
//   (2) no active goal but a recently-achieved goal in transcript → "Goal achieved"
//   (3) nothing      → "No goal set"
function ActiveGoalDialog({
  messages,
  onDone,
}: {
  messages: Message[]
  onDone: () => void
}): React.ReactNode {
  const goal = useAppState(selectActiveGoal)
  // Force a re-render once a second while a goal is active so the "running …" duration ticks.
  const [, setTick] = React.useState(0)
  const tick = React.useCallback(() => setTick(incrementIterations), [])
  useInterval(tick, goal ? 1000 : null) // du(i, o ? 1000 : null) @561820

  // --- Branch 1: a goal is currently active. @561820 ---
  if (goal) {
    const runningDuration = formatDuration(Date.now() - goal.setAt, { mostSignificantOnly: true }) // @561821
    const tokensUsed = formatTokens(getOutputTokens() - goal.tokensAtStart) // @561826

    // subtitle: "running <dur>" · "<n> turn(s)" · "<tokens> tokens"
    const turnsPart =
      goal.iterations > 0 && `${goal.iterations} ${pluralize(goal.iterations, 'turn')}` // @561834
    const subtitle = [`running ${runningDuration}`, turnsPart, `${tokensUsed} tokens`]
      .filter(Boolean)
      .join(' · ') // b.join(" \xB7 ") @561841

    return (
      <Dialog
        title={`${GOAL_GLYPH} Goal active`}
        subtitle={subtitle}
        onCancel={onDone}
        inputGuide={
          <GuideRow>
            <Text>/goal clear to stop early</Text>
            <ChordHint chord="escape" action="dismiss" />
          </GuideRow>
        }
      >
        <Box flexDirection="column">
          <LabelRow label="Goal">{goal.condition}</LabelRow>
          {goal.lastReason ? (
            <LabelRow label="Last check">{collapseNewlines(goal.lastReason.trim())}</LabelRow>
          ) : null}
        </Box>
      </Dialog>
    )
  }

  // --- Branch 2: no active goal, but the transcript shows a recently-achieved goal. @561880 ---
  const achieved = findLastAchievedGoal(messages)
  if (achieved) {
    const parts: string[] = []
    if (achieved.durationMs !== undefined)
      parts.push(formatDuration(achieved.durationMs, { mostSignificantOnly: true }))
    if (achieved.iterations !== undefined)
      parts.push(`${achieved.iterations} ${pluralize(achieved.iterations, 'turn')}`)
    if (achieved.tokens !== undefined) parts.push(`${formatTokens(achieved.tokens)} tokens`)
    const subtitle = parts.join(' · ')

    return (
      <Dialog
        title={
          <Text>
            <StatusIndicator status="success" withSpace />
            Goal achieved
          </Text>
        }
        subtitle={subtitle}
        color="success"
        onCancel={onDone}
        inputGuide={
          <GuideRow>
            <Text>/goal &lt;condition&gt; to set another</Text>
            <ChordHint chord="escape" action="dismiss" />
          </GuideRow>
        }
      >
        <LabelRow label="Goal">{achieved.condition}</LabelRow>
      </Dialog>
    )
  }

  // --- Branch 3: nothing set. @561931 ---
  return (
    <Dialog
      title="Goal"
      onCancel={onDone}
      inputGuide={<ChordHint chord="escape" action="dismiss" />}
    >
      <InputGuide hint="/goal <condition> to set one">No goal set</InputGuide>
    </Dialog>
  )
}

// Small chord-hint helper standing in for the bundle's `at` element.
function ChordHint({ chord, action }: { chord: string; action: string }): React.ReactNode {
  // (UI-only; behavior is the keyboard chord binding.)
  return <GuideHint chord={chord} action={action} />
}

// ---------------------------------------------------------------------------
// 2.1.183: goal local-jsx call = Tmf @561989  (module yPl @561986 = { call: Tmf })
//   call(onDone, context, args): empty → show dialog; clear → clearGoal;
//   too-long → reject; otherwise set the goal and inject the directive as metaMessages.
// ---------------------------------------------------------------------------
export const call = async (
  onDone: LocalJSXCommandOnDone,
  context: {
    messages: Message[]
    getAppState: () => unknown
    setAppState: (updater: (s: any) => any) => void
    applyMessageOp: (op: any) => void
    sessionHooksRegistry: any
    options: { activeGoal?: ActiveGoal }
  },
  args: string,
): Promise<React.ReactNode> => {
  const arg = args.trim()

  // Empty → render the active-goal dialog; dismissing skips quietly. @561991
  if (arg === '') {
    return (
      <ActiveGoalDialog messages={context.messages} onDone={() => onDone(undefined, { display: 'skip' })} />
    )
  }

  // Clear → tear down the goal and report via a system message. @561993
  if (isClearKeyword(arg)) {
    const cleared = clearGoal(context as any)
    onDone(cleared === null ? 'No goal set' : `Goal cleared: ${cleared}`, { display: 'system' })
    return null
  }

  // Too long → reject via a system message + analytics. @561997
  if (arg.length > MAX_GOAL_CONDITION_CHARS) {
    logFeatureSad('goal_set', 'too_long') // Rt('goal_set','too_long')  @561999
    onDone(
      `Goal condition is limited to ${MAX_GOAL_CONDITION_CHARS} characters (got ${arg.length})`,
      { display: 'system' },
    )
    return null
  }

  // Set → install; on gate failure surface the gate message. @562003
  const error = setGoal(arg, context as any)
  if (error !== null) {
    onDone(error, { display: 'system' })
    return null
  }

  // Success → confirm and inject the goal directive as a meta message that triggers
  // the next query. @562005
  onDone(`Goal set: ${arg}`, { shouldQuery: true, metaMessages: [buildGoalPrompt(arg)] })
  return null
}
