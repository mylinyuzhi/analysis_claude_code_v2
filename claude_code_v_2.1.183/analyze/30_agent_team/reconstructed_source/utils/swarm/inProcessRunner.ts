/**
 * In-process teammate runner — the AsyncLocalStorage in-process teammate loop.
 *
 * An in-process teammate is an async agent task that runs inside the leader's own
 * Node process (no tmux/iTerm pane). It is isolated by two AsyncLocalStorage scopes
 * (the teammate context `runWithTeammateContext` and the agent context
 * `runWithAgentContext`) and driven by a continuous per-turn loop:
 *   spawn → run agent turn → go idle (notify lead) → wait for next prompt → repeat
 * until the lifecycle AbortController fires or a shutdown is approved.
 *
 * v2.1.183 NOTES (delta vs v2.1.156 / the v2.1.88 ancestor):
 *   - Turn end now ARMS eviction: the idle update sets `evictAfter = Date.now() + EVICT_DELAY_MS`
 *     (@421263). This is the *other half* of the background-task-survival fix — the teammate
 *     schedules its own +30s eviction on coming to rest, but that eviction is then GATED
 *     (indefinitely deferred) by any live `agent:*` keepalive reasons from its background
 *     children. The keepalive/notification-routing reducer itself lives in the bg-survival
 *     unit (see `enqueueAgentNotification` / `removeKeepaliveReason`); this file only arms the
 *     timer. On a per-turn end we clear ONLY the per-turn `currentWorkAbortController`
 *     (@421247) — we never tear down the teammate's background children.
 *   - Uses `taskRegistry` (`b`) — `b.update`/`b.updateTranscript`/`b.evictTerminal` — rather
 *     than raw `setAppState` reducers; `$ce` is the type-guarded `taskRegistry.update` shim.
 *   - Genuinely-new 183 config fields: `resumeMessages`, `resumeReplacementState`, `initialFrom`
 *     (none present in 156's JT_ destructure @156:379715-379730). `standalone` is CARRYOVER —
 *     it already exists in 156 @379730 (`standalone: X = !1`).
 *   - New per-task spinner/status controller `Jae(taskId)` (`setMode`/`setRetryStatus`/…).
 *   - Agent-context fields: `depth: getAgentDepth(parent)` is genuinely new (absent from 156's
 *     agentContext @379735-379746). `parentAgentId` is CARRYOVER — present in 156 @379736 — but its
 *     VALUE SOURCE changed: 156 read `$D()?.agentId`, 183 reads `toolUseContext.agentId` (a.agentId
 *     @183:421032). Source-only change, not a new field.
 *
 * 2.1.183 regions covered:
 *   - cli_inner_pretty.js:421006-421372  runInProcessTeammate (sDp)        [READ FULLY]
 *   - cli_inner_pretty.js:421374-421379  startInProcessTeammate (qut)
 *   - cli_inner_pretty.js:421380         IN_PROCESS_POLL_MS (ZLp = 500)
 *   - cli_inner_pretty.js:420912-421005  waitForNextPromptOrShutdown (oDp)
 *   - cli_inner_pretty.js:420870-420873  deliverIdleNotification (C5a)
 *   - cli_inner_pretty.js:420867-420868  sendMessageToLead (tDp)
 *   - cli_inner_pretty.js:420864-420866  updateTeammateTask ($ce)
 *   - cli_inner_pretty.js:420874-420911  findAvailableTask/formatTaskAsPrompt/tryClaimNextTask (nDp/rDp/I5a)
 *   - cli_inner_pretty.js:366054-366060  formatAsTeammateMessage (xlt)
 *   - cli_inner_pretty.js:366068-366079  createIdleNotification (cUt)
 *   - cli_inner_pretty.js:366305-366332  getLastPeerDmSummary (_Ut)
 *
 * 2.1.88 ancestor mirrored: utils/swarm/inProcessRunner.ts + utils/swarm/spawnInProcess.ts
 *   (shape, helper names, doc comments). 183 diverges in: taskRegistry vs setAppState,
 *   standalone/resume support, the evictAfter turn-end arming, the per-task spinner controller,
 *   and the per-turn content-replacement tracker (`ace`). When 88 and 183 disagree, 183 wins.
 *
 * scaffold: 30_agent_team/coordinator_and_background_survival.md (§3.6 turn-end evictAfter),
 *           30_agent_team/spawn_backends_and_tmux_fix.md (§1.1 in-process recap)
 *
 * cross-val: re-read sDp/qut/oDp/C5a/I5a/$ce bodies in the live 183 bundle line-by-line.
 *   Confirmed: per-turn AbortController `Xl()` (@421096); turn-end clears only
 *   `currentWorkAbortController` (@421247); idle update sets `evictAfter: Date.now() + zGe`
 *   (@421263); idle notification `await C5a(name, color, team, {idleReason, summary})` (@421269);
 *   fire-and-forget `sDp(e).catch(...)` in qut (@421376); ZLp = 500 (@421380).
 */

import type { ContentBlockParam } from '@anthropic-ai/sdk/resources/messages.mjs'

// ---- Reconstructed siblings in this tree ------------------------------------
import { TEAM_LEAD_NAME } from './constants.js'
import { TEAMMATE_SYSTEM_PROMPT_ADDENDUM } from './teammatePromptAddendum.js'
import { SEND_MESSAGE_TOOL_NAME } from '../../tools/SendMessageTool/constants.js'
import {
  createIdleNotification,
  isPlanApprovalResponse,
  isModeSetRequest,
  isShutdownRequest,
  isStructuredProtocolMessage,
  planApprovalResumeText,
} from '../teammateControlMessages.js'
import { readMailbox, writeToMailbox } from '../teammateMailbox.js'
// TeammateContext was reconstructed into utils/agentContext.ts in this tree (88 split it into
// utils/teammateContext.ts; the bundle co-locates the type + factory @103394-103408).
import type { TeammateContext } from '../agentContext.js'
import { IN_PROCESS_POLL_MS } from './constants.js'

// ---- Dependencies NOT reconstructed in this delta tree ----------------------
// (cited to their v2.1.88 ancestor path; do NOT import the obfuscated bundle).
//
// createTeammateCanUseTool        — './leaderPermissionBridge.js'  (183: eDp @420713) — OTHER UNIT
// runAgent (async generator query)— '../../tools/AgentTool/runAgent.js' (183: wj* @387068)
// hasPermissionsToUseTool         — '../permissions/permissions.js' (183: Kut @585853)
// compactConversation             — '../../services/compact/compact.js' (183: zut @460676)
// buildPostCompactMessages        — '../../services/compact/compact.js' (183: sye @460650)
// getSystemPrompt                 — '../../constants/prompts.js' (183: KL @580888)
// getAutoCompactThresholdForModel — '../../services/compact/autoCompact.js' (183: lMt @226948)
// tokenCountUpToAnchor            — '../tokens.js' (183: _v @227159)
// countPersistedUserMessages      — '../messages.js' (183: Wlt @387497)
// createStickyBetaState           — (183: Hre @2177)
// cloneFileStateCache             — '../fileStateCache.js' (183: KAe @225611)
// createContentReplacementState   — '../toolResultStorage.js' (183: y$t @275064)
// trackPreservedToolResults       — '../toolResultStorage.js' (183: ace @366538)
// asSystemPrompt                  — '../systemPromptType.js' (183: Wc)
// createUserMessage               — '../messages.js' (183: Rn @587504)
// createAssistantAPIErrorMessage  — '../messages.js' (183: tc @587491)
// appendCappedMessage             — (183: Dke @353773, cap bNn=50)
// appendCappedDedupedMessage      — (183: hka @353781)
// appendTeammateTranscriptMessage — (183: sso @363230)
// createAbortController           — '../abortController.js' (183: Xl @226984)
// runWithTeammateContext          — '../teammateContext.js' (183: Kun @103397)
// runWithAgentContext            — '../agentContext.js' (183: Rq @103143)
// getAgentDepth                  — '../agentContext.js' (183: Gz @103152)
// toAgentId (brand cast)          — (183: If @2037)
// getSpinnerController            — (183: Jae @293457, per-task status/spinner controller)
// getLeaderSetClassifierApprovals — './leaderPermissionBridge.js' (183: p0e @383728)
// listTasks/claimTask/updateTask  — '../tasks.js' (183: cj/Fla/Xge)
// markMessageAsRead (single)      — '../teammateMailbox.js' (183: aUt)
// markMessagesAsRead (batch)      — '../teammateMailbox.js' (183: w4e)
// isProtocolFrame                 — '../teammateControlMessages.js' (183: iF @366256)
// applyLeadPlanApproval           — (183: FBa) ; setTeammateFileMode (183: vlt) ; normalizeMode (183: alo)
// evictTaskOutput                 — '../task/diskOutput.js' (183: i_ @575324)
// emitTaskTerminatedSdk           — '../sdkEventQueue.js' (183: Ng @234046)
// unregisterPerfettoAgent         — '../telemetry/perfettoTracing.js' (183: q2e @277521)
// jsonStringify                   — '../slowOperations.js' (183: Re @9461)
// xmlEscapeAttr                   — (183: bp) ; escapeXmlText (183: xnt) ; TEAMMATE_MESSAGE_TAG (183: hN)
// logForDebugging                 — '../debug.js' (183: v)
// logEvent / redact / mark        — '../../services/analytics/index.js' (183: G/Ne/Qe)
// countMetric / errorMetric       — (183: Le @swarm_in_process_run / Me / Rt)
// sleep                           — '../sleep.js' (183: Un)
// USER_ABORT_ERROR_MESSAGE        — (183: yj = "API Error: Request was aborted.")
// PRECOMPACT_BLOCKED_PREFIX       — (183: Vut = "Compaction blocked by PreCompact hook")
// RESUME_MESSAGE_CAP              — (183: bNn = 50)
// EVICT_DELAY_MS                  — (183: zGe = 30000 @439188)  — defined in bg-survival unit

declare const logForDebugging: (msg: string, opts?: { level?: string }) => void
declare const sleep: (ms: number) => Promise<void>
declare const jsonStringify: (v: unknown, replacer?: unknown, space?: number) => string
declare const createUserMessage: (opts: { content: unknown; origin?: unknown }) => Message
declare const createAssistantAPIErrorMessage: (opts: { content: string }) => Message
declare const appendCappedMessage: (msgs: Message[] | undefined, m: Message) => Message[]
declare const appendCappedDedupedMessage: (msgs: Message[] | undefined, m: Message) => Message[]
declare const appendTeammateTranscriptMessage: (
  taskId: string,
  m: Message,
  reg: TaskRegistry,
) => void
declare const createAbortController: () => AbortController
declare const runWithTeammateContext: <T>(ctx: TeammateContext, fn: () => Promise<T>) => Promise<T>
declare const runWithAgentContext: <T>(ctx: AgentContext, fn: () => Promise<T>) => Promise<T>
declare const getAgentDepth: (ctx: AgentContext | undefined) => number
declare const toAgentId: (id: string) => string
declare const getSpinnerController: (key: string) => SpinnerController
declare const getSystemPrompt: (tools: unknown, model: unknown) => Promise<string[]>
declare const compactConversation: (...args: unknown[]) => Promise<unknown>
declare const buildPostCompactMessages: (summary: unknown) => Message[]
declare const getAutoCompactThresholdForModel: (model: unknown, window?: unknown) => number
// 2.1.183: _v(messages, ww(model)) @421101 — `ww` (102904) resolves a model to its
// chars-per-token divisor (4 for older models in YPu @103125, else 3) used by the
// per-content token estimator. The token count MUST pass `ww(model)`, NOT the raw model.
declare const tokenCountUpToAnchor: (msgs: Message[], charsPerToken: number) => number
declare const getCharsPerTokenForModel: (model: unknown) => number // 2.1.183: ww @102904
declare const countPersistedUserMessages: (msgs: Message[]) => number
declare const createStickyBetaState: () => unknown
declare const cloneFileStateCache: (cache: unknown) => unknown
declare const createMemorySelector: () => { stateByDir: Record<string, unknown>; lastUsage: unknown } // 2.1.183: tIe @230199
declare const createContentReplacementState: () => unknown
declare const trackPreservedToolResults: (
  acc: Message[],
  msg: Message,
  prev: ReplacementTracker | null,
  state?: unknown,
) => ReplacementTracker | null
declare const asSystemPrompt: (parts: unknown[]) => unknown
declare const createTeammateCanUseTool: (
  identity: TeammateIdentity,
  workAbort: AbortController,
  onPermissionWaitMs: (ms: number) => void,
  setClassifierApprovals: unknown,
) => CanUseToolFn
declare const getLeaderSetClassifierApprovals: (setAppState: SetAppStateFn) => unknown
declare const runAgent: (config: Record<string, unknown>) => AsyncGenerator<AgentEvent>
declare const listTasks: (taskListId: string) => Promise<Task[]>
declare const claimTask: (
  taskListId: string,
  taskId: number,
  agentName: string,
) => Promise<{ success: boolean; reason?: string }>
declare const updateTask: (taskListId: string, taskId: number, patch: object) => Promise<void>
declare const evictTaskOutput: (taskId: string) => void
declare const emitTaskTerminatedSdk: (
  taskId: string,
  status: string,
  meta: { toolUseId?: string; summary?: string },
) => void
declare const unregisterPerfettoAgent: (agentId: string) => void
declare const logEvent: (name: string, props: object) => void
declare const redact: (v: unknown) => unknown
declare const countMetric: (name: string) => void
declare const errorMetric: (name: string, code: string) => void
declare const xmlEscapeAttr: (s: string) => string
declare const escapeXmlText: (tag: string, text: string) => string
declare const TEAMMATE_MESSAGE_TAG: string
declare const USER_ABORT_ERROR_MESSAGE: string
declare const PRECOMPACT_BLOCKED_PREFIX: string
declare const RESUME_MESSAGE_CAP: number
declare const EVICT_DELAY_MS: number
declare const markMessageAsRead: (
  agentName: string,
  teamName: string,
  msg: MailboxMessage,
) => Promise<void>
declare const markMessagesAsRead: (
  agentName: string,
  teamName: string,
  msgs: MailboxMessage[],
) => Promise<void>
declare const isProtocolFrame: (text: string) => boolean
declare const applyLeadPlanApproval: (
  taskId: string,
  parsed: unknown,
  reg: TaskRegistry,
) => boolean
declare const setTeammateFileMode: (
  teamName: string,
  agentName: string,
  mode: string,
) => Promise<void>
declare const normalizeMode: (mode: string) => string

// External structural types (declared, defined in their own units/trees).
type Message = unknown
type Task = {
  id: number
  subject: string
  description?: string
  status: string
  owner?: string
  blockedBy: number[]
}
type AgentEvent = Record<string, unknown> & { type: string }
type CanUseToolFn = (...args: unknown[]) => Promise<unknown>
type ReplacementTracker = { preserved: Message[]; anchorUuid?: string }
type MailboxMessage = {
  from: string
  text: string
  read?: boolean
  color?: string
  summary?: string
}
type SpinnerController = {
  setMode: (mode: string) => void
  setRetryStatus: (status: unknown) => void
}
type TaskRegistry = {
  get: (taskId: string) => InProcessTeammateTaskState | undefined
  update: (
    taskId: string,
    updater: (task: InProcessTeammateTaskState) => InProcessTeammateTaskState,
  ) => void
  updateTranscript: (taskId: string, updater: (task: any) => any) => void
  evictTerminal: (taskId: string) => void
}
type ToolUseContext = {
  setAppState: SetAppStateFn
  taskRegistry: TaskRegistry
  getAppState: () => AppState
  agentId?: string
  agentContext?: AgentContext
  options: {
    tools: unknown[]
    mainLoopModel: unknown
    autoCompactWindow?: unknown
    isNonInteractiveSession?: boolean
  }
  contentReplacementState?: unknown
  readFileState: unknown
}
type AppState = { tasks: Record<string, InProcessTeammateTaskState> }
type SetAppStateFn = (updater: (prev: AppState) => AppState) => void

type TeammateIdentity = {
  agentId: string
  agentName: string
  teamName: string
  color?: string
  planModeRequired: boolean
  parentSessionId: string
  resumableAgentId?: string
}

type CustomAgentDefinition = {
  agentType: string
  whenToUse?: string
  getSystemPrompt: () => string
  tools?: string[]
  source?: string
  permissionMode?: string
  model?: string
  memory?: unknown
}

type InProcessTeammateTaskState = {
  type: 'in_process_teammate'
  status: string
  isIdle?: boolean
  notified?: boolean
  endTime?: number
  toolUseId?: string
  permissionMode?: string
  pendingUserMessages: Array<{ text: string; origin?: unknown }>
  shutdownRequested?: boolean
  currentWorkAbortController?: AbortController
  abortController?: AbortController
  onIdleCallbacks?: Array<() => void>
  totalPausedMs?: number
  progress?: unknown
  evictAfter?: number
}

// 2.1.183: SendMessage tool name = zh @221450 ; team-essential tool names injected so
// teammates can always coordinate even with an explicit tool list (@421065).
// (Vw=TaskCreate @221451, g7=TaskGet @221452, IL=TaskList @220833, dP=TaskUpdate @221453)
const TASK_CREATE_TOOL_NAME = 'TaskCreate' // 2.1.183: Vw @221451
const TASK_GET_TOOL_NAME = 'TaskGet' // 2.1.183: g7 @221452
const TASK_LIST_TOOL_NAME = 'TaskList' // 2.1.183: IL @220833
const TASK_UPDATE_TOOL_NAME = 'TaskUpdate' // 2.1.183: dP @221453

// 2.1.183: IN_PROCESS_POLL_MS = ZLp @421380 (== 500). Mailbox poll interval; same const is
// reused by the permission-bridge mailbox poller in eDp (@420847). v2.1.156 fT_=500.
// SSOT: defined once in ./constants.js and imported above (was duplicated here).

/**
 * Configuration for running an in-process teammate.
 * 2.1.183: destructured at sDp head @421007-421026.
 */
export type InProcessRunnerConfig = {
  identity: TeammateIdentity
  taskId: string
  prompt: string
  description?: string
  agentDefinition?: CustomAgentDefinition
  teammateContext: TeammateContext
  toolUseContext: ToolUseContext
  abortController: AbortController
  model?: string
  systemPrompt?: string
  systemPromptMode?: 'default' | 'replace' | 'append'
  allowedTools?: string[]
  allowPermissionPrompts?: boolean
  invokingRequestId?: string
  /** CARRYOVER from 156 (156 @379730 `standalone: X = !1`): run as a detached standalone agent
   *  (no leader mailbox/team coordination). 183 @421022. */
  standalone?: boolean
  /** NEW in 183: prior messages to seed the transcript when resuming. @421023 */
  resumeMessages?: Message[]
  /** NEW in 183: prior content-replacement state when resuming. @421024 */
  resumeReplacementState?: unknown
  /** NEW in 183: sender attribution for the initial wrapped prompt (defaults to team-lead). @421025 */
  initialFrom?: string
}

export type InProcessRunnerResult = {
  success: boolean
  error?: string
  messages: Message[]
}

/**
 * Type-guarded `taskRegistry.update` for in-process teammate tasks.
 * Skips the update unless the task is still an `in_process_teammate`.
 * 2.1.88 ancestor: the inline `updateTaskState` reducer; 183 routes through the task registry.
 */
// 2.1.183: updateTeammateTask = $ce @420864
function updateTeammateTask(
  taskId: string,
  updater: (task: InProcessTeammateTaskState) => InProcessTeammateTaskState,
  taskRegistry: TaskRegistry,
): void {
  taskRegistry.update(taskId, task =>
    task.type === 'in_process_teammate' ? updater(task) : task,
  )
}

/**
 * Sends a message to the team-lead's file-based mailbox (same mailbox system as pane teammates).
 */
// 2.1.183: sendMessageToLead = tDp @420867
async function sendMessageToLead(
  from: string,
  text: string,
  color: string | undefined,
  teamName: string,
): Promise<void> {
  // @420868: writeToMailbox(TEAM_LEAD_NAME, { from, text, timestamp, color }, teamName)
  await writeToMailbox(
    TEAM_LEAD_NAME,
    { from, text, timestamp: new Date().toISOString(), color },
    teamName,
  )
}

/**
 * Delivers an idle notification to the lead via the file-based mailbox.
 * Uses agentName (not agentId) for parity with pane teammates.
 * 2.1.183 call site: `await C5a(t.agentName, t.color, t.teamName, { idleReason, summary })` @421269.
 */
// 2.1.183: deliverIdleNotification = C5a @420870
export async function deliverIdleNotification(
  agentName: string,
  agentColor: string | undefined,
  teamName: string,
  options?: {
    idleReason?: 'available' | 'interrupted' | 'failed'
    summary?: string
    completedTaskId?: string
    completedStatus?: 'resolved' | 'blocked' | 'failed'
    failureReason?: string
  },
): Promise<void> {
  // @420871: build the idle_notification frame; @420872: JSON-stringify it as the message text.
  const notification = createIdleNotification(agentName, options) // cUt @366068
  await sendMessageToLead(agentName, jsonStringify(notification), agentColor, teamName)
}

/**
 * Find an available task: pending, unowned, and not blocked by an unresolved task.
 */
// 2.1.183: findAvailableTask = nDp @420874
function findAvailableTask(tasks: Task[]): Task | undefined {
  const unresolvedTaskIds = new Set(
    tasks.filter(t => t.status !== 'completed').map(t => t.id),
  )
  return tasks.find(task => {
    if (task.status !== 'pending') return false
    if (task.owner) return false
    return task.blockedBy.every(id => !unresolvedTaskIds.has(id))
  })
}

/**
 * Format a claimed task as a teammate prompt.
 */
// 2.1.183: formatTaskAsPrompt = rDp @420882
function formatTaskAsPrompt(task: Task): string {
  // @420883: byte-exact prompt prefix (note the leading space before `${task.subject}`).
  let prompt = `Complete all open tasks. Start with task #${task.id}: \n\n ${task.subject}`
  if (task.description) {
    prompt += `\n\n${task.description}`
  }
  return prompt
}

/**
 * Try to claim the next available task from the team's task list.
 * Returns the formatted prompt if a task was claimed, else undefined.
 */
// 2.1.183: tryClaimNextTask = I5a @420892
async function tryClaimNextTask(
  taskListId: string,
  agentName: string,
): Promise<string | undefined> {
  try {
    const tasks = await listTasks(taskListId) // cj @420894
    const availableTask = findAvailableTask(tasks)
    if (!availableTask) return undefined

    const result = await claimTask(taskListId, availableTask.id, agentName) // Fla @420897
    if (!result.success) {
      logForDebugging(
        `[inProcessRunner] Failed to claim task #${availableTask.id}: ${result.reason}`,
      )
      return undefined
    }
    // Also set in_progress so the UI reflects it immediately. @420903
    await updateTask(taskListId, availableTask.id, { status: 'in_progress' }) // Xge
    logForDebugging(
      `[inProcessRunner] Claimed task #${availableTask.id}: ${availableTask.subject}`,
    )
    return formatTaskAsPrompt(availableTask)
  } catch (err) {
    logForDebugging(`[inProcessRunner] Error checking task list: ${err}`)
    return undefined
  }
}

/**
 * Formats a message as <teammate-message …> XML for transcript injection.
 * 2.1.88 ancestor: formatAsTeammateMessage. 183 escapes attrs/text (bp/xnt) which 88 did not.
 */
// 2.1.183: formatAsTeammateMessage = xlt @366054 (TEAMMATE_MESSAGE_TAG = hN)
function formatAsTeammateMessage(
  from: string,
  content: string,
  color?: string,
  summary?: string,
): string {
  const colorAttr = color ? ` color="${xmlEscapeAttr(color)}"` : '' // @366055
  const summaryAttr = summary ? ` summary="${xmlEscapeAttr(summary)}"` : '' // @366056
  const body = escapeXmlText(TEAMMATE_MESSAGE_TAG, content) // xnt(hN, e.text) @366057
  return `<${TEAMMATE_MESSAGE_TAG} teammate_id="${xmlEscapeAttr(from)}"${colorAttr}${summaryAttr}>\n${body}\n</${TEAMMATE_MESSAGE_TAG}>`
}

/**
 * Scans messages newest-first for the last SendMessage tool-use directed at a peer
 * (not "*", not the lead), returning `[to <peer>] <summary|first-80-chars>` capped at 200.
 * Used as the `summary` field of the idle notification so the lead sees what the teammate
 * last told a peer. Stops at the first plain-string user message boundary.
 */
// 2.1.183: getLastPeerDmSummary = _Ut @366305
function getLastPeerDmSummary(messages: any[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (!msg) continue
    // @366309: a plain-string user message marks the start of the current turn — stop.
    if (msg.type === 'user' && typeof msg.message.content === 'string') break
    if (msg.type !== 'assistant') continue
    for (const block of msg.message.content) {
      if (
        block.type === 'tool_use' &&
        block.name === SEND_MESSAGE_TOOL_NAME && // zh @366314
        typeof block.input === 'object' &&
        block.input !== null &&
        'to' in block.input &&
        typeof block.input.to === 'string' &&
        block.input.to !== '*' &&
        block.input.to.toLowerCase() !== TEAM_LEAD_NAME.toLowerCase() && // np @366320
        'message' in block.input &&
        typeof block.input.message === 'string'
      ) {
        const to = block.input.to
        const summary = (
          'summary' in block.input && typeof block.input.summary === 'string'
            ? block.input.summary
            : block.input.message.slice(0, 80)
        ).slice(0, 200)
        return `[to ${to}] ${summary}`
      }
    }
  }
  return undefined
}

/**
 * Result of waiting for the next prompt / shutdown.
 * 2.1.183: oDp returns one of these shapes.
 */
type WaitResult =
  | {
      type: 'shutdown_request'
      request: ReturnType<typeof isShutdownRequest>
      originalMessage: string
    }
  | { type: 'new_message'; message: string; from: string; color?: string; summary?: string; origin?: unknown }
  | { type: 'aborted' }

/**
 * Waits for the next prompt or a shutdown request, keeping the teammate alive (idle) rather
 * than terminating. Polls every 500ms:
 *   - in-memory `pendingUserMessages` (from transcript-view injection) — checked every iteration
 *   - shutdown requests (highest priority, prevents peer-message starvation)
 *   - lead protocol frames (plan-approval responses, mode-set requests) — applied in place
 *   - regular messages (lead prioritised over peers, else FIFO)
 *   - unclaimed team tasks
 *
 * CARRYOVER from 156 (156 DT_ @379654/@379658): when `standalone` (i) is set, the mailbox/team
 * path is skipped entirely — a standalone agent only resumes from in-memory `pendingUserMessages`,
 * and exits if `shutdownRequested` is set. 183 byte-identical at @420925/@420929 (only obf renames).
 */
// 2.1.183: waitForNextPromptOrShutdown = oDp @420912
async function waitForNextPromptOrShutdown(
  identity: TeammateIdentity,
  abortController: AbortController,
  taskId: string,
  getAppState: () => AppState,
  taskRegistry: TaskRegistry,
  taskListId: string,
  standalone: boolean,
): Promise<WaitResult> {
  logForDebugging(
    `[inProcessRunner] ${identity.agentName} starting poll loop (abort=${abortController.signal.aborted})`,
  )
  let pollCount = 0
  while (!abortController.signal.aborted) {
    // In-memory pending messages (from transcript viewing) — every iteration. @420916
    const task = getAppState().tasks[taskId]
    if (
      task &&
      task.type === 'in_process_teammate' &&
      task.pendingUserMessages.length > 0
    ) {
      const pending = task.pendingUserMessages[0]!
      updateTeammateTask(
        taskId,
        t => ({ ...t, pendingUserMessages: t.pendingUserMessages.slice(1) }),
        taskRegistry,
      )
      logForDebugging(
        `[inProcessRunner] ${identity.agentName} found pending user message (poll #${pollCount})`,
      )
      return { type: 'new_message', message: pending.text, origin: pending.origin, from: 'user' }
    }

    // CARRYOVER from 156 (156 @379654): a standalone agent exits when shutdown was requested.
    // 183 @420925.
    if (
      task &&
      task.type === 'in_process_teammate' &&
      task.shutdownRequested &&
      standalone
    ) {
      return { type: 'aborted' }
    }

    if (pollCount > 0) await sleep(IN_PROCESS_POLL_MS) // Un(500) @420926
    pollCount++
    if (abortController.signal.aborted) {
      logForDebugging(
        `[inProcessRunner] ${identity.agentName} aborted while waiting (poll #${pollCount})`,
      )
      return { type: 'aborted' }
    }

    // CARRYOVER from 156 (156 @379658): standalone agents never touch the mailbox/team task list.
    // 183 @420929.
    if (standalone) continue

    logForDebugging(
      `[inProcessRunner] ${identity.agentName} poll #${pollCount}: checking mailbox`,
    )
    try {
      const allMessages = (await readMailbox(
        identity.agentName,
        identity.teamName,
      )) as MailboxMessage[]

      // Scan unread for a shutdown request first (highest priority). @420933-420944
      let shutdownIndex = -1
      let shutdownParsed: ReturnType<typeof isShutdownRequest> = null
      for (let i = 0; i < allMessages.length; i++) {
        const m = allMessages[i]
        if (m && !m.read) {
          const parsed = isShutdownRequest(m.text) // Dlt @420938
          if (parsed) {
            shutdownIndex = i
            shutdownParsed = parsed
            break
          }
        }
      }
      if (shutdownIndex !== -1) {
        const msg = allMessages[shutdownIndex]!
        const skippedUnread = allMessages
          .slice(0, shutdownIndex)
          .filter(m => !m.read).length // Wn(…, !read) @420947
        logForDebugging(
          `[inProcessRunner] ${identity.agentName} received shutdown request from ${shutdownParsed?.from} (prioritized over ${skippedUnread} unread messages)`,
        )
        await markMessageAsRead(identity.agentName, identity.teamName, msg) // aUt @420952
        return { type: 'shutdown_request', request: shutdownParsed, originalMessage: msg.text }
      }

      // Partition remaining unread into protocol frames vs regular messages. @420956-420962
      const protocolFrames: MailboxMessage[] = []
      const regularMessages: MailboxMessage[] = []
      for (const m of allMessages) {
        if (!m || m.read) continue
        if (isProtocolFrame(m.text)) protocolFrames.push(m) // iF @420960
        else regularMessages.push(m)
      }

      // Apply lead protocol frames (plan-approval responses, mode-set requests) in place. @420963-420986
      let planResumePrompt: string | null = null
      if (protocolFrames.length > 0) {
        for (const m of protocolFrames) {
          const planResponse = isPlanApprovalResponse(m.text) // Plt @420966
          if (planResponse && m.from === TEAM_LEAD_NAME) {
            // Only honour the lead's plan approval when we are actually awaiting it. @420968
            if (applyLeadPlanApproval(taskId, planResponse, taskRegistry)) {
              logForDebugging(
                `[inProcessRunner] ${identity.agentName} applied lead plan_approval_response: approved=${planResponse.approved}`,
              )
              planResumePrompt = planApprovalResumeText(planResponse) // hUt @420970
            } else {
              logForDebugging(
                `[inProcessRunner] ${identity.agentName} ignoring stale plan_approval_response (not awaiting approval)`,
              )
            }
            continue
          }
          const modeSet = isModeSetRequest(m.text) // Mlt @420974
          if (modeSet && m.from === TEAM_LEAD_NAME) {
            const mode = normalizeMode(modeSet.mode) // alo @420976
            logForDebugging(
              `[inProcessRunner] ${identity.agentName} applying lead mode_set_request: ${mode}`,
            )
            updateTeammateTask(
              taskId,
              t => (t.permissionMode === mode ? t : { ...t, permissionMode: mode }),
              taskRegistry,
            )
            await setTeammateFileMode(identity.teamName, identity.agentName, mode) // vlt @420979
          } else {
            logForDebugging(
              `[inProcessRunner] ${identity.agentName} dropping protocol frame from ${m.from}: ${m.text.substring(0, 80)}`,
              { level: 'warn' },
            )
          }
        }
        // Batch-mark the applied protocol frames as read. @420985
        await markMessagesAsRead(identity.agentName, identity.teamName, protocolFrames) // w4e
      }

      // A plan-approval resume turns into a new prompt from the lead. @420987
      if (planResumePrompt) {
        return { type: 'new_message', message: planResumePrompt, from: TEAM_LEAD_NAME }
      }

      // Regular messages: lead prioritised over peers, else FIFO. @420988
      const selected = regularMessages.find(m => m.from === TEAM_LEAD_NAME) ?? regularMessages[0]
      if (selected) {
        logForDebugging(
          `[inProcessRunner] ${identity.agentName} received new message from ${selected.from}`,
        )
        await markMessageAsRead(identity.agentName, identity.teamName, selected) // aUt @420992
        return {
          type: 'new_message',
          message: selected.text,
          from: selected.from,
          color: selected.color,
          summary: selected.summary,
        }
      }
    } catch (err) {
      logForDebugging(`[inProcessRunner] ${identity.agentName} poll error: ${err}`)
      // Continue polling even if one read fails.
    }

    // Check the team's task list for unclaimed work. @420998
    const taskPrompt = await tryClaimNextTask(taskListId, identity.agentName)
    if (taskPrompt) {
      return { type: 'new_message', message: taskPrompt, from: 'task-list' }
    }
  }

  logForDebugging(
    `[inProcessRunner] ${identity.agentName} exiting poll loop (abort=${abortController.signal.aborted}, polls=${pollCount})`,
  )
  return { type: 'aborted' }
}

/**
 * Runs an in-process teammate with a continuous prompt loop.
 *
 * Executes the agent query (runAgent) within the teammate + agent AsyncLocalStorage scopes,
 * tracks progress, mirrors into the task transcript, ARMS eviction + delivers an idle
 * notification on each turn end, then waits for the next prompt or a shutdown request.
 * The loop exits only on lifecycle abort or after a shutdown is approved.
 *
 * 2.1.88 ancestor: runInProcessTeammate. 183 diverges substantially — see file header.
 */
// 2.1.183: runInProcessTeammate = sDp @421006
export async function runInProcessTeammate(
  config: InProcessRunnerConfig,
): Promise<InProcessRunnerResult> {
  // @421007-421026: destructure config. `standalone` is CARRYOVER (156 @379730); the 183-new
  // fields are resumeMessages/resumeReplacementState/initialFrom (absent from 156's destructure).
  const {
    identity,
    taskId,
    prompt,
    description,
    agentDefinition,
    teammateContext,
    toolUseContext,
    abortController,
    model,
    systemPrompt,
    systemPromptMode,
    allowedTools,
    allowPermissionPrompts,
    invokingRequestId,
    standalone = false,
    resumeMessages,
    resumeReplacementState,
    initialFrom,
  } = config
  const { setAppState, taskRegistry } = toolUseContext // @421027
  const spinner = getSpinnerController(taskId) // Jae(n) @421028

  logForDebugging(`[inProcessRunner] Starting agent loop for ${identity.agentId}`)

  // Build the AgentContext for analytics attribution + agent-tree placement. @421030-421044
  const agentContext: AgentContext = {
    agentId: identity.agentId,
    // CARRYOVER field, SOURCE-ONLY change in 183: 156 @379736 sourced this from `$D()?.agentId`;
    // 183 @421032 reads `a.agentId` (= toolUseContext.agentId). The field itself is not new.
    parentAgentId: toolUseContext.agentId,
    depth: getAgentDepth(toolUseContext.agentContext), // NEW in 183: Gz(parent) @421033 (absent from 156 @379735-379746)
    parentSessionId: identity.parentSessionId,
    agentName: identity.agentName,
    teamName: identity.teamName,
    agentColor: identity.color,
    planModeRequired: identity.planModeRequired,
    isTeamLead: false,
    agentType: 'teammate',
    invokingRequestId,
    invocationKind: 'spawn',
    invocationEmitted: false,
  }

  // Build the system prompt per systemPromptMode. @421045-421060
  let teammateSystemPrompt: string
  if (systemPromptMode === 'replace' && systemPrompt) {
    teammateSystemPrompt = systemPrompt
  } else {
    const parts = [
      ...(await getSystemPrompt(toolUseContext.options.tools, toolUseContext.options.mainLoopModel)),
      TEAMMATE_SYSTEM_PROMPT_ADDENDUM, // Rdo @421048
    ]
    if (agentDefinition) {
      const customPrompt = agentDefinition.getSystemPrompt()
      if (customPrompt) {
        parts.push(`\n# Custom Agent Instructions\n${customPrompt}`) // @421052-421054
      }
      if (agentDefinition.memory) {
        // @421055: tengu_agent_memory_loaded — note `...!1` (spreads nothing) in the bundle.
        logEvent('tengu_agent_memory_loaded', {
          scope: redact(agentDefinition.memory),
          source: redact('in-process-teammate'),
        })
      }
    }
    if (systemPromptMode === 'append' && systemPrompt) parts.push(systemPrompt) // @421057
    teammateSystemPrompt = parts.join('\n') // @421058
  }

  // Resolve the agent definition. permissionMode 'default' so teammates get full tool access
  // regardless of the lead's mode; team-essential tools always injected. @421061-421069
  const resolvedAgentDefinition: CustomAgentDefinition = {
    agentType: identity.agentName,
    whenToUse: `In-process teammate: ${identity.agentName}`,
    getSystemPrompt: () => teammateSystemPrompt,
    tools: agentDefinition?.tools
      ? [
          // ms([...]) = dedupe; team-essentials: SendMessage + Task* tools. @421065
          ...new Set([
            ...agentDefinition.tools,
            SEND_MESSAGE_TOOL_NAME,
            TASK_CREATE_TOOL_NAME,
            TASK_GET_TOOL_NAME,
            TASK_LIST_TOOL_NAME,
            TASK_UPDATE_TOOL_NAME,
          ]),
        ]
      : ['*'],
    source: 'projectSettings',
    permissionMode: 'default',
    ...(agentDefinition?.model ? { model: agentDefinition.model } : {}),
  }

  // Accumulated messages (seeded from resumeMessages when resuming). @421070-421071
  const allMessages: Message[] = resumeMessages ? [...resumeMessages] : []
  let persistedCount = resumeMessages ? countPersistedUserMessages(resumeMessages) : 0 // Wlt @421071

  // Extra metadata for resumable agents. @421072-421079
  const extraMetadata: Record<string, unknown> = {
    taskKind: 'in_process_teammate',
    teamName: identity.teamName,
    color: identity.color,
    planModeRequired: identity.planModeRequired,
    ...(agentDefinition && { customAgentType: agentDefinition.agentType }),
    ...(model && { model }),
  }

  // Wrap the initial prompt as a <teammate-message> for transcript styling. @421080
  const wrappedInitialPrompt = formatAsTeammateMessage(initialFrom ?? TEAM_LEAD_NAME, prompt, undefined, description)
  let currentPrompt = wrappedInitialPrompt // R @421081
  let currentOrigin: unknown = undefined // D @421082
  let shouldExit = false // O @421083
  let compactionBlockedByHook = false // M @421084

  // Claim a task up front (so the UI shows activity), unless standalone. @421085
  if (!standalone) await tryClaimNextTask(identity.parentSessionId, identity.agentName)

  try {
    // Seed the transcript: prior resume messages (capped) + the initial prompt. @421087-421091
    taskRegistry.updateTranscript(taskId, t => {
      let messages = t.messages
      if (resumeMessages) {
        for (const m of resumeMessages.slice(-RESUME_MESSAGE_CAP)) {
          messages = appendCappedMessage(messages, m)
        }
      }
      return { ...t, messages: appendCappedMessage(messages, createUserMessage({ content: wrappedInitialPrompt })) }
    })

    // Per-teammate content-replacement state — persisted across iterations so the wire prefix
    // stays cache-stable. Seeded from resumeReplacementState when resuming. @421092
    let teammateReplacementState = toolUseContext.contentReplacementState
      ? (resumeReplacementState ?? createContentReplacementState())
      : undefined
    const stickyBetas = createStickyBetaState() // Hre @421093

    // Main loop: until lifecycle abort or shutdown approved. @421094
    while (!abortController.signal.aborted && !shouldExit) {
      logForDebugging(
        `[inProcessRunner] ${identity.agentId} processing prompt: ${currentPrompt.substring(0, 50)}...`,
      )

      // Per-turn AbortController: Escape stops the current turn only, not the whole teammate. @421096
      const currentWorkAbortController = createAbortController() // Xl() @421096
      updateTeammateTask(
        taskId,
        t => ({ ...t, currentWorkAbortController }),
        taskRegistry,
      ) // @421097

      const userMessage = createUserMessage({ content: currentPrompt, origin: currentOrigin }) // @421098
      const promptMessages: Message[] = [userMessage] // @421099
      let contextMessages = allMessages // Y @421101

      // Compact history if over the per-model autocompact threshold. @421101-421133
      // _v(I, ww(a.options.mainLoopModel)) — second arg is the chars-per-token divisor, not the model.
      const tokenCount = tokenCountUpToAnchor(
        allMessages,
        getCharsPerTokenForModel(toolUseContext.options.mainLoopModel), // ww(...) @421101
      ) // _v @421101
      if (
        tokenCount >
        getAutoCompactThresholdForModel(
          toolUseContext.options.mainLoopModel,
          toolUseContext.options.autoCompactWindow,
        )
      ) {
        logForDebugging(
          `[inProcessRunner] ${identity.agentId} compacting history (${tokenCount} tokens)`,
        )
        // Isolated context so compaction doesn't clear the main session's readFileState or
        // fire its UI callbacks. @421104-421112
        const isolatedContext = {
          ...toolUseContext,
          abortController,
          agentId: toAgentId(identity.agentId), // If @421107
          readFileState: cloneFileStateCache(toolUseContext.readFileState), // KAe @421108
          memorySelector: createMemorySelector(), // tIe() @421108 → { stateByDir: {}, lastUsage: null }
          loadedNestedMemoryPaths: {},
          onCompactEvent: undefined,
        }
        try {
          const compacted = await compactConversation(
            allMessages,
            isolatedContext,
            {
              systemPrompt: asSystemPrompt([]), // Wc([]) @421117
              userContext: {},
              systemContext: {},
              toolUseContext: isolatedContext,
              forkContextMessages: allMessages,
            },
            true, // suppressFollowUpQuestions @421119
            undefined,
            true, // isAutoCompact @421120
          )
          contextMessages = buildPostCompactMessages(compacted) // sye @421122
          if (teammateReplacementState) teammateReplacementState = createContentReplacementState() // @421122
          // Replace allMessages in place + mirror into the transcript. @421123
          allMessages.length = 0
          allMessages.push(...contextMessages)
          persistedCount = 0
          taskRegistry.updateTranscript(taskId, t => ({ ...t, messages: [...contextMessages, userMessage] }))
        } catch (err) {
          // PreCompact hook blocked compaction: continue uncompacted. @421125-421127
          if (err instanceof Error && err.message.startsWith(PRECOMPACT_BLOCKED_PREFIX)) {
            logForDebugging(
              `[inProcessRunner] ${identity.agentId} compaction blocked by PreCompact hook; continuing uncompacted`,
            )
            compactionBlockedByHook = true
          } else if (
            abortController.signal.aborted ||
            (err instanceof Error && err.message === USER_ABORT_ERROR_MESSAGE)
          ) {
            // Aborted mid-compaction. @421128-421130
            logForDebugging(`[inProcessRunner] ${identity.agentId} aborted during compaction`)
            shouldExit = true
            break
          } else {
            throw err
          }
        }
      }

      const forkContextMessages = contextMessages.length > 0 ? [...contextMessages] : undefined // @421134
      const resumePersistedCount = persistedCount // te @421135
      allMessages.push(userMessage) // @421136

      // Fresh per-turn progress tracker + iteration buffer. @421137-421142
      const tracker = createProgressTracker() // YBn @421137
      const resolveActivity = createActivityResolver(toolUseContext.options.tools) // JBn @421138
      const iterationMessages: Message[] = [] // oe @421139

      // Read the current permission mode from task state (may have been cycled via Shift+Tab). @421140-421142
      // Bundle: ae = ue && ue.type === "in_process_teammate" ? ue.permissionMode : "default"
      // (NOTE: no `?? "default"` inside the in_process_teammate branch — when permissionMode is
      //  unset it stays undefined and overrides resolvedAgentDefinition.permissionMode in the spread.)
      const currentTask = toolUseContext.getAppState().tasks[taskId]
      const currentPermissionMode =
        currentTask && currentTask.type === 'in_process_teammate'
          ? currentTask.permissionMode
          : 'default'
      const iterationAgentDefinition = { ...resolvedAgentDefinition, permissionMode: currentPermissionMode } // @421142

      let workWasAborted = false // se @421143
      let replacementTracker: ReplacementTracker | null = null // le @421144

      // Run the agent query within the teammate + agent contexts. @421145-421245
      await runWithTeammateContext(teammateContext, async () =>
        runWithAgentContext(agentContext, async () => {
          // Mark running and clear any armed eviction; record the turn start. @421148-421150
          updateTeammateTask(
            taskId,
            t => ({ ...t, status: 'running', isIdle: false, evictAfter: undefined }),
            taskRegistry,
          )
          taskRegistry.updateTranscript(taskId, t => ({ ...t, turnStartTime: Date.now() }))
          spinner.setMode('responding')

          // The same agent query (wj* / runAgent) used by AgentTool/subagents. @421151-421187
          for await (const event of runAgent({
            agentDefinition: iterationAgentDefinition,
            promptMessages,
            toolUseContext,
            canUseTool: createTeammateCanUseTool(
              identity,
              currentWorkAbortController,
              (waitMs: number) => {
                updateTeammateTask(
                  taskId,
                  t => ({ ...t, totalPausedMs: (t.totalPausedMs ?? 0) + waitMs }),
                  taskRegistry,
                )
              },
              getLeaderSetClassifierApprovals(setAppState), // p0e(_) @421161
            ),
            isAsync: true,
            canShowPermissionPrompts: allowPermissionPrompts ?? true,
            forkContextMessages,
            querySource: 'agent:custom',
            override: {
              abortController: currentWorkAbortController,
              agentContext,
              onRetryStatus: spinner.setRetryStatus,
              ...(identity.resumableAgentId && { agentId: identity.resumableAgentId }),
            },
            // Resume-only fields. @421173-421178
            ...(identity.resumableAgentId && {
              resumePersistedCount,
              name: identity.agentName,
              description,
              extraMetadata: { ...extraMetadata, permissionMode: currentPermissionMode },
            }),
            model,
            preserveToolUseResults: true,
            availableTools: toolUseContext.options.tools,
            allowedTools,
            contentReplacementState: teammateReplacementState,
            stickyBetas,
            isTeammate: true,
            teammateContext,
          })) {
            // Lifecycle abort kills the whole teammate. @421188-421191
            if (abortController.signal.aborted) {
              logForDebugging(`[inProcessRunner] ${identity.agentId} lifecycle aborted`)
              break
            }
            // Work abort (Escape) stops just this turn — but still captures the in-flight
            // assistant/user message so the transcript is coherent. @421192-421200
            if (currentWorkAbortController.signal.aborted) {
              logForDebugging(
                `[inProcessRunner] ${identity.agentId} current work aborted (Escape pressed)`,
              )
              if (event.type === 'assistant' || event.type === 'user') {
                iterationMessages.push(event)
                allMessages.push(event)
                replacementTracker = trackPreservedToolResults(allMessages, event, replacementTracker)
              }
              workWasAborted = true
              break
            }
            // Spinner mode change. @421201-421204
            if (event.type === 'spinner_mode') {
              spinner.setMode((event as any).mode)
              continue
            }
            if (event.type === 'api_metrics') continue // @421205
            // In-progress tool-use id removals (for transcript animation). @421206-421216
            if (event.type === 'set_in_progress_tool_use_ids') {
              if ((event as any).op.action !== 'remove') continue
              const ids: string[] = (event as any).op.ids
              taskRegistry.updateTranscript(taskId, transcript => {
                const next = new Set(transcript.inProgressToolUseIDs)
                let changed = false
                for (const id of ids) if (next.delete(id)) changed = true
                return changed ? { ...transcript, inProgressToolUseIDs: next } : transcript
              })
              continue
            }
            // Persist assistant/user/compact-boundary messages. @421217-421222
            if (
              event.type === 'assistant' ||
              event.type === 'user' ||
              (event.type === 'system' && 'subtype' in event && (event as any).subtype === 'compact_boundary')
            ) {
              iterationMessages.push(event)
              allMessages.push(event)
              replacementTracker = trackPreservedToolResults(allMessages, event, replacementTracker)
            }
            // Progress tracking + transcript mirror (with in-progress tool-use id tracking). @421223-421239
            updateProgressFromMessage(tracker, event, resolveActivity, toolUseContext.options.tools)
            const progress = getProgressUpdate(tracker)
            updateTeammateTask(taskId, t => ({ ...t, progress }), taskRegistry)
            taskRegistry.updateTranscript(taskId, transcript => {
              let inProgress = transcript.inProgressToolUseIDs
              if (event.type === 'assistant') {
                for (const block of (event as any).message.content) {
                  if (block.type === 'tool_use') inProgress = new Set([...inProgress, block.id])
                }
              } else if (event.type === 'user') {
                const content = (event as any).message.content
                if (Array.isArray(content)) {
                  for (const block of content) {
                    if (typeof block === 'object' && 'type' in block && block.type === 'tool_result') {
                      inProgress = new Set(inProgress)
                      inProgress.delete(block.tool_use_id)
                    }
                  }
                }
              }
              return {
                ...transcript,
                messages: appendCappedDedupedMessage(transcript.messages, event),
                inProgressToolUseIDs: inProgress,
              }
            })
          }
          return { success: true, messages: iterationMessages }
        }),
      ).finally(() => {
        // Flush any preserved tool-result tail held back by the replacement tracker. @421243-421244
        if (replacementTracker) {
          allMessages.push(...replacementTracker.preserved)
          replacementTracker = null
        }
      })

      persistedCount = countPersistedUserMessages(allMessages) // Wlt @421246
      // Turn end: clear ONLY the per-turn work controller (NOT the teammate's bg children). @421247
      updateTeammateTask(
        taskId,
        t => ({ ...t, currentWorkAbortController: undefined }),
        taskRegistry,
      )
      if (abortController.signal.aborted) break // @421248-421250

      // Escape interrupt: record the abort message in the transcript, then go idle. @421251-421255
      if (workWasAborted) {
        logForDebugging(`[inProcessRunner] ${identity.agentId} work interrupted, returning to idle`)
        const interruptMessage = createAssistantAPIErrorMessage({ content: USER_ABORT_ERROR_MESSAGE }) // tc(yj) @421253
        taskRegistry.updateTranscript(taskId, t => ({ ...t, messages: appendCappedMessage(t.messages, interruptMessage) }))
      }

      // Was the task already idle (skip duplicate notification)? @421256-421257
      const prevTask = toolUseContext.getAppState().tasks[taskId]
      const wasAlreadyIdle = prevTask?.type === 'in_process_teammate' && prevTask.isIdle

      // Go idle + ARM eviction (+30s). NEW in 183: evictAfter is the bg-survival turn-end half.
      // The +30s timer is GATED by live `agent:*` keepalive reasons from bg children. @421258-421266
      updateTeammateTask(
        taskId,
        t => {
          t.onIdleCallbacks?.forEach(cb => cb())
          return { ...t, isIdle: true, evictAfter: Date.now() + EVICT_DELAY_MS, onIdleCallbacks: [] }
        },
        taskRegistry,
      )

      // Deliver the idle notification to the lead on the idle transition (not standalone, not
      // already idle). The teammate's response is NOT auto-forwarded to the lead — it must use
      // SendMessage, matching pane teammates. @421267-421270
      if (!wasAlreadyIdle && !standalone) {
        await deliverIdleNotification(identity.agentName, identity.color, identity.teamName, {
          idleReason: workWasAborted ? 'interrupted' : 'available',
          summary: getLastPeerDmSummary(allMessages as any[]), // _Ut @421269
        })
      } else {
        logForDebugging(`[inProcessRunner] Skipping duplicate idle notification for ${identity.agentName}`)
      }

      logForDebugging(`[inProcessRunner] ${identity.agentId} finished prompt, waiting for next`)

      // Wait for the next prompt / shutdown. @421272
      const waitResult = await waitForNextPromptOrShutdown(
        identity,
        abortController,
        taskId,
        toolUseContext.getAppState,
        taskRegistry,
        identity.parentSessionId,
        standalone,
      )

      switch (waitResult.type) {
        case 'shutdown_request': {
          // Pass the shutdown request to the model (it decides via approve/reject tools). @421274-421278
          logForDebugging(
            `[inProcessRunner] ${identity.agentId} received shutdown request - passing to model`,
          )
          currentPrompt = formatAsTeammateMessage(
            waitResult.request?.from || 'team-lead',
            waitResult.originalMessage,
          )
          currentOrigin = undefined
          appendTeammateTranscriptMessage(taskId, createUserMessage({ content: currentPrompt }), taskRegistry) // sso @421278
          break
        }
        case 'new_message': {
          logForDebugging(`[inProcessRunner] ${identity.agentId} received new message from ${waitResult.from}`)
          if (waitResult.from === 'user') {
            // User messages are plain text (no XML wrapper); they carry an origin. @421281-421282
            currentPrompt = waitResult.message
            currentOrigin = waitResult.origin
          } else {
            // Peer/lead/task-list messages get the XML wrapper + a transcript entry. @421283-421286
            currentPrompt = formatAsTeammateMessage(
              waitResult.from,
              waitResult.message,
              waitResult.color,
              waitResult.summary,
            )
            currentOrigin = undefined
            appendTeammateTranscriptMessage(taskId, createUserMessage({ content: currentPrompt }), taskRegistry)
          }
          break
        }
        case 'aborted':
          logForDebugging(`[inProcessRunner] ${identity.agentId} aborted while waiting`)
          shouldExit = true // O @421289
          break
      }
    }

    // Loop exit: mark completed. killInProcessTeammate may have already set a terminal status
    // (killed) — guard on status==='running' to avoid flipping killed→completed and
    // double-emitting the SDK bookend. @421293-421323
    let alreadyTerminal = false // W @421293
    let toolUseId: string | undefined // q @421294
    updateTeammateTask(
      taskId,
      task => {
        if (task.status !== 'running') {
          alreadyTerminal = true
          return task
        }
        toolUseId = task.toolUseId
        task.onIdleCallbacks?.forEach(cb => cb())
        return {
          ...task,
          status: 'completed',
          notified: true,
          endTime: Date.now(),
          pendingUserMessages: [],
          abortController: undefined,
          currentWorkAbortController: undefined,
          onIdleCallbacks: [],
        }
      },
      taskRegistry,
    )
    if (!alreadyTerminal) {
      // Trim the transcript to the last message on completion. @421319-421323
      taskRegistry.updateTranscript(taskId, t => ({
        ...t,
        messages: t.messages.length ? [t.messages.at(-1)] : [],
        inProgressToolUseIDs: new Set(),
      }))
    }
    evictTaskOutput(taskId) // i_ @421324
    taskRegistry.evictTerminal(taskId)
    // notified:true was pre-set ⇒ no XML notification ⇒ close the SDK task_started bookend directly. @421324
    if (!alreadyTerminal) {
      emitTaskTerminatedSdk(taskId, 'completed', { toolUseId, summary: identity.agentId }) // Ng @421324
    }
    unregisterPerfettoAgent(identity.agentId) // q2e @421325
    // Telemetry: count the run; flag compaction-blocked-by-hook. @421325-421326
    if (compactionBlockedByHook) errorMetric('swarm_in_process_run', 'compact_blocked_by_hook')
    else countMetric('swarm_in_process_run')
    return { success: true, messages: allMessages }
  } catch (error) {
    // Failure path: mark failed, emit the SDK bookend, deliver a failure idle notification. @421328-421371
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logForDebugging(`[inProcessRunner] Agent ${identity.agentId} failed: ${errorMessage}`)

    let alreadyTerminal = false
    let toolUseId: string | undefined
    updateTeammateTask(
      taskId,
      task => {
        if (task.status !== 'running') {
          alreadyTerminal = true
          return task
        }
        toolUseId = task.toolUseId
        task.onIdleCallbacks?.forEach(cb => cb())
        return {
          ...task,
          status: 'failed',
          notified: true,
          error: errorMessage,
          isIdle: true,
          endTime: Date.now(),
          onIdleCallbacks: [],
          pendingUserMessages: [],
          abortController: undefined,
          currentWorkAbortController: undefined,
        }
      },
      taskRegistry,
    )
    if (!alreadyTerminal) {
      taskRegistry.updateTranscript(taskId, t => ({
        ...t,
        messages: t.messages.length ? [t.messages.at(-1)] : [],
        inProgressToolUseIDs: new Set(),
      }))
    }
    evictTaskOutput(taskId)
    taskRegistry.evictTerminal(taskId)
    if (!alreadyTerminal) {
      emitTaskTerminatedSdk(taskId, 'failed', { toolUseId, summary: identity.agentId })
    }
    // Failure idle notification (skipped for standalone). @421365-421370
    if (!standalone) {
      await deliverIdleNotification(identity.agentName, identity.color, identity.teamName, {
        idleReason: 'failed',
        completedStatus: 'failed',
        failureReason: errorMessage,
      })
    }
    unregisterPerfettoAgent(identity.agentId)
    errorMetric('swarm_in_process_run', 'agent_loop_failed') // Me @421371
    return { success: false, error: errorMessage, messages: allMessages }
  }
}

/**
 * Starts an in-process teammate fire-and-forget.
 *
 * Main entry point after spawn: kicks off the agent loop and swallows unhandled rejections.
 * The agentId is extracted BEFORE the closure so the catch handler doesn't retain the full
 * config (incl. toolUseContext) for the (possibly hours-long) lifetime of a teammate.
 */
// 2.1.183: startInProcessTeammate = qut @421374
export function startInProcessTeammate(config: InProcessRunnerConfig): void {
  const agentId = config.identity.agentId // @421375
  // @421376: void runInProcessTeammate(config).catch(...) — fire-and-forget.
  void runInProcessTeammate(config).catch(error => {
    logForDebugging(`[inProcessRunner] Unhandled error in ${agentId}: ${error}`)
  })
}

// ---- progress-tracking shims (defined in LocalAgentTask in the real tree) ----
// 2.1.183: createProgressTracker = YBn ; createActivityResolver = JBn ;
//          updateProgressFromMessage = XBn ; getProgressUpdate = $Ut.
declare function createProgressTracker(): unknown
declare function createActivityResolver(tools: unknown[]): unknown
declare function updateProgressFromMessage(
  tracker: unknown,
  message: AgentEvent,
  resolveActivity: unknown,
  tools: unknown[],
): void
declare function getProgressUpdate(tracker: unknown): unknown

// ---- AgentContext shape (defined in utils/agentContext.ts in the real tree) ----
type AgentContext = {
  agentId: string
  parentAgentId?: string
  depth: number
  parentSessionId: string
  agentName: string
  teamName: string
  agentColor?: string
  planModeRequired: boolean
  isTeamLead: boolean
  agentType: string
  invokingRequestId?: string
  invocationKind: string
  invocationEmitted: boolean
}
