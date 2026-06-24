/**
 * SendMessageTool — the model's only channel to a teammate / the main conversation (v2.1.183).
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - findTeammateColor           (s$p) @434337-434342
 *   - resolveAgentName            (cza) @434343-434352
 *   - getSenderName               (p4n) @434353-434356
 *   - sendTeammateMessage         (i$p) @434357-434390   (string-message leg -> writeToMailbox; carryover + roster suggest)
 *   - handleShutdownRequest       (a$p) @434391-434401
 *   - handleShutdownApproval      (l$p) @434402-434454   (in-process abort vs gracefulShutdown)
 *   - handleShutdownRejection     (c$p) @434455-434463
 *   - handlePlanApproval          (u$p) @434464-434489   (lead-only; inherits resolved mode)
 *   - handlePlanRejection         (d$p) @434490-434506   (lead-only)
 *   - request-id regex            (lza) @434539  ; model-facing union (r$p) @434541-434557
 *   - input schema                (o$p) @434558-434567
 *   - sendMessageTool def         (p$p) @434568-434889   (validateInput / call / classifiers / renderers)
 *   - call() body                        @434694-434889  (async call(e,t,n,r))
 *   - call() "main" routing leg          @434699-434719  (THE delta of this unit)
 *   - call() named-teammate / background-resume legs @434720-434869
 *   - call() structured-message guard + dispatch @434870-434889
 *
 * 2.1.88 ancestor mirrored: tools/SendMessageTool/SendMessageTool.ts (buildTool def shape,
 *   handleMessage / handleShutdown* / handlePlan* handlers, the validateInput/call structure,
 *   parseAddress usage, MessageRouting/output types). Divergences from 88 (183 bundle WINS):
 *     - the `"*"` BROADCAST recipient + handleBroadcast() are REMOVED; `to:"*"` is now hard-rejected
 *       ("broadcast (to: "*") is no longer supported — send a message per recipient").
 *     - NEW `"main"` recipient routes to the main conversation's prompt queue (enqueuePrompt), not a mailbox.
 *     - NEW local-socket-address gate (isLocalSocketAddress) + the `\\.\pipe\` parser branch.
 *     - NEW two "don't smuggle a protocol/lifecycle JSON frame as a plain string" rejections.
 *     - `request_id` is now `.regex(/^[^\n\r]{1,200}$/)` (88 had a bare string).
 *
 * scaffold: 30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md §3 (whole section).
 *
 * cross-val (re-read in the 183 bundle):
 *   - validateInput @434611-434684 verbatim: empty-`to`, `to:"*"` rejection string, the
 *     LLa/bridge-uds empty-target rejection, the dual `!isLocalSocketAddress(...)` gate + the
 *     "'<to>' is not a local socket address. Use an address from ListAgents." string, the `@`
 *     rejection, the summary requirement, the isProtocolFrame guard string, and the 5-type
 *     lifecycle-frame guard list ["idle_notification","teammate_terminated","task_assignment",
 *     "task_completed","shutdown_rejected"], plus the shutdown_response constraints.
 *   - call() @434694-434889: the `"main"` leg (self-send guard + enqueuePrompt w/ priority:"next",
 *     isMeta:true, skipSlashCommands:true, origin), the named-teammate resolution
 *     (teammates -> agentNameRegistry -> parseAgentIdString fallback), running/stopped/evicted
 *     branches, the in-flight-resume Map (d4n), and the structured-message background-subagent guard.
 *   - the union r$p @434541 is 3 members only (resolves dossier open question #5: NOT trimmed).
 */

import { z } from 'zod/v4'

import { buildTool, type Tool, type ToolDef, type ToolUseContext } from '../../Tool.js'
import { MAIN_RESERVED_NAME, isTeammateSession } from '../../utils/agentId.js'
import { isAgentSwarmsEnabled } from '../../utils/agentSwarmsEnabled.js'
import { logForDebugging } from '../../utils/debug.js'
import { errorMessage } from '../../utils/errors.js'
import { jsonParse, jsonStringify } from '../../utils/slowOperations.js'
import {
  isLocalSocketAddress,
  parseSocketAddress,
} from '../../utils/peerAddress.js'
import { AGENT_TOOL_NAME } from '../AgentTool/constants.js'
import { TEAM_LEAD_NAME } from '../../utils/swarm/constants.js'
// CONFIRMED (bundle export map @103415-103435): getAgentName (ih @103455), getTeamName (zp @103460),
// getTeammateColor (fT @103514) are exported by the bundle's teammate.ts identity cluster (88 ancestor
// utils/teammate.ts), alongside getDynamicTeamContext/getAgentId/isTeammate. Reconstructed in this delta
// tree at utils/teammate.ts (the identity module), matching the real layout.
import { getAgentName, getTeamName, getTeammateColor } from '../../utils/teammate.js'
// 2.1.183: readTeamFile (async) = Nhe @362824 — the team-FILE module (88: utils/swarm/teamHelpers.ts).
import { readTeamFile } from '../../utils/swarm/teamHelpers.js'
import { generateRequestId } from '../../utils/agentId.js'
import {
  SendMessageMessageUnionSchema,
  createShutdownApprovedMessage,
  createShutdownRejectedMessage,
  createShutdownRequestMessage,
  isStructuredProtocolMessage,
} from '../../utils/teammateControlMessages.js'
import { writeToMailbox } from '../../utils/teammateMailbox.js'
import { LIST_AGENTS_TOOL, SEND_MESSAGE_TOOL_NAME } from './constants.js'
import { SEND_MESSAGE_DESCRIPTION, buildSendMessagePrompt } from './prompt.js'

// =====================================================================================
// EXTERNAL DEPENDENCIES (owned by other subsystems — typed thinly so this file
// type-checks in isolation; their internals are out of scope for THIS unit).
// =====================================================================================

// 2.1.183: getMainAgentId = Ls @cli_inner_pretty.js:2664 — the main conversation's agent id.
declare function getMainAgentId(): string
// 2.1.183: enqueuePrompt = o_ (queue.enqueue, wired @234005) — push a turn onto the main REPL queue.
declare function enqueuePrompt(item: {
  mode: 'prompt'
  agentId: string
  value: string
  priority: 'next'
  origin: MessageOrigin
  skipSlashCommands: boolean
  isMeta: boolean
}): void
// 2.1.183: parseAgentIdString = tUo @cli_inner_pretty.js:2040 — accept iff it matches `a(?:[\w-]{1,63}-)?[0-9a-f]{16}`.
declare function parseAgentIdString(value: string): string | null
// 2.1.183: gracefulShutdown = $i @cli_inner_pretty.js (process exit) — used on the non-in-process shutdown path.
declare function gracefulShutdown(code: number, reason: string): Promise<void>
// 2.1.183: findTeammateTaskByAgentId = Bhe — locate an in-process teammate task by agentId.
declare function findTeammateTaskByAgentId(
  agentId: string,
  tasks: Record<string, unknown>,
): { abortController?: AbortController } | undefined
// 2.1.183: getInProcessTeammateMeta = Z6a @cli_inner_pretty.js:433934 — resumable in-process teammate meta or null.
declare function getInProcessTeammateMeta(
  agentId: string,
): Promise<{ name?: string; teamName?: string } | null>
// 2.1.183: queuePendingMessage = gWe @cli_inner_pretty.js:445814 — append to a running task's pendingMessages.
declare function queuePendingMessage(
  agentId: string,
  text: string,
  taskRegistry: unknown,
  opts: { origin: MessageOrigin; isMeta: boolean },
): void
// 2.1.183: resumeAgentBackground = dLe @cli_inner_pretty.js:434052 — resume a stopped/evicted agent in the background.
declare function resumeAgentBackground(args: {
  agentId: string
  prompt: string
  promptOrigin: MessageOrigin
  toolUseContext: ToolUseContext
  canUseTool: unknown
  invokingRequestId?: string
}): Promise<{ outputFile: string }>
// 2.1.183: resumeInProcessTeammate = eza @cli_inner_pretty.js:433938 — resume a teammate as an in-process task.
declare function resumeInProcessTeammate(args: {
  resumableAgentId: string
  prompt: string | SendMessageMessage
  senderName: string | undefined
  meta: { name?: string; teamName?: string }
  fallbackName: string
  toolUseContext: ToolUseContext
}): Promise<{ taskId: string; resumedMessageCount: number }>
// 2.1.183: createDeferred = Wz @cli_inner_pretty.js:103580 — {promise, resolve, reject}.
declare function createDeferred<T>(): {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error: unknown) => void
}
// 2.1.183: resolveInheritedMode = CM — collapse "plan" -> "default", pass others through.
declare function resolveInheritedMode(mode: string): string
// 2.1.183: getToolPermissionContext = Br — current leader tool-permission context.
declare function getToolPermissionContext(ctx: ToolUseContext): { mode: string }
// 2.1.183: getAgentId = VD @cli_inner_pretty.js:103450 — current session/teammate agent id (session-identity accessor).
declare function getAgentId(): string | undefined
// 2.1.183: isTeamLead = RM — true iff this session is the team lead for the given team context.
declare function isTeamLead(teamContext: unknown): boolean

/** task.type === "local_agent" — 2.1.183: isLocalAgentTask = od @445761. */
declare function isLocalAgentTask(task: unknown): task is {
  status: string
  agentType: string
  identity?: { agentName: string; teamName: string; resumableAgentId?: string }
}
/** task.type === "local_agent" && agentType === "main-session" — 2.1.183: isMainSessionTask = L3t @433816. */
declare function isMainSessionTask(task: unknown): boolean
/** task.type === "in_process_teammate" — 2.1.183: isInProcessTeammateTask = _S @353770. */
declare function isInProcessTeammateTask(task: unknown): task is {
  id: string
  status: string
  identity: { agentName: string; teamName: string; resumableAgentId?: string }
}

// =====================================================================================
// TYPES (mirrors the v2.1.88 ancestor's output types, minus BroadcastOutput which is removed).
// =====================================================================================

export type MessageOrigin =
  | { kind: 'peer'; from: string; senderTaskId: string }
  | { kind: 'coordinator' }

export type MessageRouting = {
  sender: string
  senderColor?: string
  target: string
  targetColor?: string
  summary?: string
  content?: string
}

export type SendMessageToolOutput = {
  success: boolean
  message: string
  request_id?: string
  target?: string
  routing?: MessageRouting
}

export type SendMessageMessage = z.infer<typeof SendMessageMessageUnionSchema>

// =====================================================================================
// SCHEMA
// =====================================================================================

// 2.1.183: sendMessageInputSchema = o$p @cli_inner_pretty.js:434558
/**
 * `{ to, summary?(max 200), message: string | <3-member union> }`. NOTE the `to`
 * description is just "Recipient: teammate name" (the cross-session `uds:`/`bridge:` and
 * `"main"` shapes are accepted but not described here — they live in the prompt / validateInput).
 */
const inputSchema = z.object({
  to: z.string().describe('Recipient: teammate name'),
  summary: z
    .string()
    .max(200)
    .optional()
    .describe('A 5-10 word summary shown as a preview in the UI (required when message is a string)'),
  message: z.union([
    z.string().describe('Plain text message content'),
    SendMessageMessageUnionSchema,
  ]),
})
type InputSchema = typeof inputSchema
export type Input = z.infer<InputSchema>

// =====================================================================================
// SENDER-IDENTITY + RELAY HELPERS
// =====================================================================================

// 2.1.183: resolveAgentName = cza @cli_inner_pretty.js:434343
/** Resolve the human-readable name of the calling task (agentContext -> registry -> task). */
function resolveAgentName(ctx: ToolUseContext, taskId: string): string {
  const agentContext = ctx.agentContext
  if (agentContext?.agentType === 'teammate' && agentContext.agentName) return agentContext.agentName
  const appState = ctx.getAppState()
  for (const [name, id] of appState.agentNameRegistry) if (id === taskId) return name
  const task = appState.tasks[taskId]
  if (isLocalAgentTask(task)) return task.agentType
  if (isInProcessTeammateTask(task)) return task.identity.agentName
  return taskId
}

// 2.1.183: getSenderName = p4n @cli_inner_pretty.js:434353
/** The name to stamp as `from` on a mailbox write. */
function getSenderName(ctx: ToolUseContext): string {
  if (ctx.agentId) return resolveAgentName(ctx, ctx.agentId)
  return getAgentName() || (isTeammateSession() ? 'teammate' : TEAM_LEAD_NAME)
}

// 2.1.183: wrapRelayMessage = lDa @cli_inner_pretty.js:362507 (tag agent-message = Nen @45675)
/**
 * Wrap a known peer's plain text in `<agent-message from="<name>">…</agent-message>` so the
 * recipient (the main conversation, via the "main" leg) sees who the message is from.
 */
function wrapRelayMessage(senderName: string, text: string): string {
  return `<agent-message from="${escapeXmlAttr(senderName)}">\n${escapeXmlBody('agent-message', text)}\n</agent-message>`
}
// (escapeXmlAttr = bp, escapeXmlBody = xnt — generic XML-safety helpers, out of scope.)
declare function escapeXmlAttr(value: string): string
declare function escapeXmlBody(tag: string, value: string): string

// 2.1.183: findTeammateColor = s$p @cli_inner_pretty.js:434337
/** Look up a teammate's display color in the team context by name (for routing previews). */
function findTeammateColor(
  appState: { teamContext?: { teammates?: Record<string, { name?: string; color?: string }> } },
  name: string,
): string | undefined {
  const teammates = appState.teamContext?.teammates
  if (!teammates) return
  for (const teammate of Object.values(teammates)) {
    if ('name' in teammate && teammate.name === name) return teammate.color
  }
  return undefined
}

// =====================================================================================
// LEAF HANDLERS — string-message leg + structured-message legs (carryover from v2.1.88,
// re-verified against the 183 bundle @434357-434508).
// =====================================================================================

// 2.1.183: sendTeammateMessage = i$p @cli_inner_pretty.js:434357
/**
 * Plain-text message -> a teammate inbox file. If there is no team, refuses. For a non-lead
 * recipient not in teamContext.teammates, re-reads the team file and (if absent on the roster)
 * suggests spawning via `Agent({name:'<x>'})` (the v2.1.183 roster-suggest refinement @434367-434377).
 */
async function sendTeammateMessage(
  recipientName: string,
  content: string,
  summary: string | undefined,
  ctx: ToolUseContext,
): Promise<{ data: SendMessageToolOutput }> {
  const appState = ctx.getAppState()
  const teamName = getTeamName(appState.teamContext)
  if (!teamName) {
    return {
      data: {
        success: false,
        message: `No agent named '${recipientName}' is currently addressable. Spawn a new one or use the agent ID.`,
      },
    }
  }
  if (recipientName !== TEAM_LEAD_NAME) {
    const onContext = Object.values(appState.teamContext?.teammates ?? {}).some(
      (t: { name?: string }) => t.name === recipientName,
    )
    if (!onContext) {
      const teamFile = await readTeamFile(teamName)
      if (teamFile !== null && !teamFile.members.some((m: { name: string }) => m.name === recipientName)) {
        return {
          data: {
            success: false,
            message: `No teammate named '${recipientName}' is currently on team '${teamName}'. Spawn one with ${AGENT_TOOL_NAME}({name: '${recipientName}'}) — or message the lead to do so.`,
          },
        }
      }
    }
  }
  const senderName = getSenderName(ctx)
  const senderColor = getTeammateColor()
  await writeToMailbox(
    recipientName,
    { from: senderName, text: content, summary, timestamp: new Date().toISOString(), color: senderColor },
    teamName,
  )
  const recipientColor = findTeammateColor(appState, recipientName)
  return {
    data: {
      success: true,
      message: `Message sent to ${recipientName}'s inbox`,
      routing: {
        sender: senderName,
        senderColor,
        target: `@${recipientName}`,
        targetColor: recipientColor,
        summary,
        content,
      },
    },
  }
}

// 2.1.183: handleShutdownRequest = a$p @cli_inner_pretty.js:434391
async function handleShutdownRequest(
  targetName: string,
  reason: string | undefined,
  ctx: ToolUseContext,
): Promise<{ data: SendMessageToolOutput }> {
  const appState = ctx.getAppState()
  const teamName = getTeamName(appState.teamContext)
  const senderName = getSenderName(ctx)
  const requestId = generateRequestId('shutdown', targetName)
  const frame = createShutdownRequestMessage({ requestId, from: senderName, reason })
  await writeToMailbox(
    targetName,
    { from: senderName, text: jsonStringify(frame), timestamp: new Date().toISOString(), color: getTeammateColor() },
    teamName,
  )
  return {
    data: {
      success: true,
      message: `Shutdown request sent to ${targetName}. Request ID: ${requestId}`,
      request_id: requestId,
      target: targetName,
    },
  }
}

// 2.1.183: handleShutdownApproval = l$p @cli_inner_pretty.js:434402
/**
 * The approving teammate sends a shutdown_approved frame back to the lead, then terminates.
 * In-process teammates abort their AbortController directly (@434419); pane/process teammates
 * either abort a fallback in-process task found in AppState (@434432-434445) or gracefulShutdown.
 */
async function handleShutdownApproval(
  requestId: string,
  ctx: ToolUseContext,
): Promise<{ data: SendMessageToolOutput }> {
  const teamName = getTeamName()
  const agentId = getAgentId()
  const agentName = getAgentName() || 'teammate'
  logForDebugging(
    `[SendMessageTool] handleShutdownApproval: teamName=${teamName}, agentId=${agentId}, agentName=${agentName}`,
  )

  let ownPaneId: string | undefined
  let ownBackendType: string | undefined
  if (teamName) {
    const teamFile = await readTeamFile(teamName)
    if (teamFile && agentId) {
      const self = teamFile.members.find((m: { agentId?: string }) => m.agentId === agentId)
      if (self) {
        ownPaneId = (self as { tmuxPaneId?: string }).tmuxPaneId
        ownBackendType = (self as { backendType?: string }).backendType
      }
    }
  }

  const frame = createShutdownApprovedMessage({
    requestId,
    from: agentName,
    paneId: ownPaneId,
    backendType: ownBackendType,
  })
  await writeToMailbox(
    TEAM_LEAD_NAME,
    { from: agentName, text: jsonStringify(frame), timestamp: new Date().toISOString(), color: getTeammateColor() },
    teamName,
  )

  if (ownBackendType === 'in-process') {
    logForDebugging(`[SendMessageTool] In-process teammate ${agentName} approving shutdown - signaling abort`)
    if (agentId) {
      const task = findTeammateTaskByAgentId(agentId, ctx.getAppState().tasks)
      if (task?.abortController) {
        task.abortController.abort()
        logForDebugging(`[SendMessageTool] Aborted controller for in-process teammate ${agentName}`)
      } else {
        logForDebugging(`[SendMessageTool] Warning: Could not find task/abortController for ${agentName}`)
      }
    }
  } else {
    if (agentId) {
      const task = findTeammateTaskByAgentId(agentId, ctx.getAppState().tasks)
      if (task?.abortController) {
        logForDebugging(`[SendMessageTool] Fallback: Found in-process task for ${agentName} via AppState, aborting`)
        task.abortController.abort()
        return {
          data: {
            success: true,
            message: `Shutdown approved (fallback path). Agent ${agentName} is now exiting.`,
            request_id: requestId,
          },
        }
      }
    }
    setImmediate(async () => {
      await gracefulShutdown(0, 'other')
    })
  }

  return {
    data: {
      success: true,
      message: `Shutdown approved. Sent confirmation to team-lead. Agent ${agentName} is now exiting.`,
      request_id: requestId,
    },
  }
}

// 2.1.183: handleShutdownRejection = c$p @cli_inner_pretty.js:434455
async function handleShutdownRejection(
  requestId: string,
  reason: string,
): Promise<{ data: SendMessageToolOutput }> {
  const teamName = getTeamName()
  const agentName = getAgentName() || 'teammate'
  const frame = createShutdownRejectedMessage({ requestId, from: agentName, reason })
  await writeToMailbox(
    TEAM_LEAD_NAME,
    { from: agentName, text: jsonStringify(frame), timestamp: new Date().toISOString(), color: getTeammateColor() },
    teamName,
  )
  return {
    data: {
      success: true,
      message: `Shutdown rejected. Reason: "${reason}". Continuing to work.`,
      request_id: requestId,
    },
  }
}

// 2.1.183: handlePlanApproval = u$p @cli_inner_pretty.js:434464
/** Lead-only. Approves a teammate's plan; the teammate inherits the lead's resolved mode (plan -> default). */
async function handlePlanApproval(
  recipientName: string,
  requestId: string,
  feedback: string | undefined,
  ctx: ToolUseContext,
): Promise<{ data: SendMessageToolOutput }> {
  const appState = ctx.getAppState()
  const teamName = appState.teamContext?.teamName
  if (!isTeamLead(appState.teamContext)) {
    throw new Error('Only the team lead can approve plans. Teammates cannot approve their own or other plans.')
  }
  const leaderMode = resolveInheritedMode(getToolPermissionContext(ctx).mode)
  const modeToInherit = leaderMode === 'plan' ? 'default' : leaderMode
  const response = {
    type: 'plan_approval_response',
    requestId,
    approved: true,
    ...(feedback !== undefined && { feedback }),
    timestamp: new Date().toISOString(),
    permissionMode: modeToInherit,
  }
  await writeToMailbox(
    recipientName,
    { from: TEAM_LEAD_NAME, text: jsonStringify(response), timestamp: new Date().toISOString() },
    teamName,
  )
  return {
    data: {
      success: true,
      message: `Plan approved for ${recipientName}. They will receive the approval and can proceed with implementation.`,
      request_id: requestId,
    },
  }
}

// 2.1.183: handlePlanRejection = d$p @cli_inner_pretty.js:434490
/** Lead-only. Rejects a teammate's plan with feedback; the teammate is sent back to revise. */
async function handlePlanRejection(
  recipientName: string,
  requestId: string,
  feedback: string,
  ctx: ToolUseContext,
): Promise<{ data: SendMessageToolOutput }> {
  const appState = ctx.getAppState()
  const teamName = appState.teamContext?.teamName
  if (!isTeamLead(appState.teamContext)) {
    throw new Error('Only the team lead can reject plans. Teammates cannot reject their own or other plans.')
  }
  const response = {
    type: 'plan_approval_response',
    requestId,
    approved: false,
    feedback,
    timestamp: new Date().toISOString(),
  }
  await writeToMailbox(
    recipientName,
    { from: TEAM_LEAD_NAME, text: jsonStringify(response), timestamp: new Date().toISOString() },
    teamName,
  )
  return {
    data: {
      success: true,
      message: `Plan rejected for ${recipientName} with feedback: "${feedback}"`,
      request_id: requestId,
    },
  }
}

// =====================================================================================
// THE TOOL DEFINITION
// =====================================================================================

/** In-flight teammate-resume promises keyed by agentId — dedupes concurrent resumes. */
// 2.1.183: inFlightTeammateResumes = d4n @cli_inner_pretty.js:434540 (new Map(), exported with the tool)
export const inFlightTeammateResumes = new Map<string, Promise<string | null>>()

// 2.1.183: sendMessageTool = p$p @cli_inner_pretty.js:434568
export const SendMessageTool: Tool<InputSchema, SendMessageToolOutput> = buildTool({
  name: SEND_MESSAGE_TOOL_NAME,
  searchHint: 'send messages to agent teammates', // @434570 (v2.1.156 had "... (swarm protocol)")
  maxResultSizeChars: 100_000,

  userFacingName() {
    return 'SendMessage'
  },

  get inputSchema(): InputSchema {
    return inputSchema
  },
  shouldDefer: true,

  isEnabled() {
    return isAgentSwarmsEnabled()
  },

  isReadOnly(input) {
    return typeof input.message === 'string'
  },

  // @434585-434596 — flattens the message into observable fields for UI/telemetry.
  backfillObservableInput(input: Record<string, unknown>) {
    if ('type' in input) return
    if (typeof input.to !== 'string') return
    if (typeof input.message === 'string') {
      input.type = 'message'
      input.recipient = input.to
      input.content = input.message
    } else if (typeof input.message === 'object' && input.message !== null) {
      const msg = input.message as {
        type?: string
        request_id?: string
        approve?: boolean
        reason?: string
        feedback?: string
      }
      input.type = msg.type
      input.recipient = input.to
      if (msg.request_id !== undefined) input.request_id = msg.request_id
      if (msg.approve !== undefined) input.approve = msg.approve
      const content = msg.reason ?? msg.feedback
      if (content !== undefined) input.content = content
    }
  },

  // @434597-434607 — compact one-line summary for the auto-permission classifier.
  toAutoClassifierInput(input) {
    if (typeof input.message === 'string') return `to ${input.to}: ${input.message}`
    switch (input.message.type) {
      case 'shutdown_request':
        return `shutdown_request to ${input.to}`
      case 'shutdown_response':
        return `shutdown_response ${input.message.approve ? 'approve' : 'reject'} ${input.message.request_id}`
      case 'plan_approval_response':
        return `plan_approval ${input.message.approve ? 'approve' : 'reject'} to ${input.to}`
    }
  },

  // @434608-434610 — SendMessage is always allowed; no checkPermissions gating in v2.1.183.
  async checkPermissions(input, _ctx) {
    return { behavior: 'allow' as const, updatedInput: input }
  },

  // 2.1.183: validateInput @cli_inner_pretty.js:434611
  async validateInput(input, _ctx) {
    if (input.to.trim().length === 0) {
      return { result: false, message: 'to must not be empty', errorCode: 9 } // @434612
    }
    if (input.to === '*') {
      // @434613 — broadcast support REMOVED in the v2.1.178 redesign.
      return {
        result: false,
        message: 'broadcast (to: "*") is no longer supported — send a message per recipient',
        errorCode: 9,
      }
    }
    const addr = parseSocketAddress(input.to) // @434619 (LLa)
    if ((addr.scheme === 'bridge' || addr.scheme === 'uds') && addr.target.trim().length === 0) {
      return { result: false, message: 'address target must not be empty', errorCode: 9 } // @434620-434621
    }
    // NEW in v2.1.183: a //-prefixed target must be a well-formed local socket address (named pipe);
    // a plain teammate name / "main" / unix path passes isLocalSocketAddress trivially. @434622
    if (!isLocalSocketAddress(addr.target) || !isLocalSocketAddress(input.to)) {
      return {
        result: false,
        message: `'${input.to}' is not a local socket address. Use an address from ${LIST_AGENTS_TOOL}.`,
        errorCode: 9,
      }
    }
    if (input.to.includes('@')) {
      return {
        result: false,
        message: 'to must be a bare teammate name — there is only one team per session',
        errorCode: 9,
      } // @434628
    }

    if (typeof input.message === 'string') {
      if (!input.summary || input.summary.trim().length === 0) {
        return { result: false, message: 'summary is required when message is a string', errorCode: 9 } // @434635-434636
      }
      // Guard 1 (@434637): the string must not be a serialized teammate protocol frame.
      if (isStructuredProtocolMessage(input.message)) {
        return {
          result: false,
          message:
            'message text must not be a teammate protocol frame (permission/mode/plan/shutdown JSON) — to respond to a plan or shutdown request, use the structured object form ({"message": {"type": ...}}); otherwise send plain text',
          errorCode: 9,
        }
      }
      // Guard 2 (@434644): nor a serialized lifecycle/task notification frame.
      try {
        const parsed = jsonParse(input.message)
        if (
          parsed !== null &&
          typeof parsed === 'object' &&
          'type' in parsed &&
          typeof (parsed as { type: unknown }).type === 'string' &&
          ['idle_notification', 'teammate_terminated', 'task_assignment', 'task_completed', 'shutdown_rejected'].includes(
            (parsed as { type: string }).type,
          )
        ) {
          return {
            result: false,
            message:
              'message text must not be a teammate lifecycle/task frame (idle/terminated/task/shutdown JSON) — send plain text instead',
            errorCode: 9,
          }
        }
      } catch {}
      return { result: true }
    }

    // Structured-message constraints (@434668-434682):
    if (input.message.type === 'shutdown_response' && input.to !== TEAM_LEAD_NAME) {
      return { result: false, message: `shutdown_response must be sent to "${TEAM_LEAD_NAME}"`, errorCode: 9 }
    }
    if (
      input.message.type === 'shutdown_response' &&
      input.message.approve &&
      input.message.reason !== undefined
    ) {
      return {
        result: false,
        message:
          'reason is only delivered on rejections (approve: false) — approvals are sent as a silent confirmation with no reason text; omit reason or reject instead',
        errorCode: 9,
      }
    }
    if (
      input.message.type === 'shutdown_response' &&
      !input.message.approve &&
      (!input.message.reason || input.message.reason.trim().length === 0)
    ) {
      return { result: false, message: 'reason is required when rejecting a shutdown request', errorCode: 9 }
    }
    return { result: true }
  },

  async description() {
    return SEND_MESSAGE_DESCRIPTION
  },

  async prompt() {
    return buildSendMessagePrompt()
  },

  mapToolResultToToolResultBlockParam(data, toolUseID) {
    return {
      tool_use_id: toolUseID,
      type: 'tool_result' as const,
      content: [{ type: 'text' as const, text: jsonStringify(data) }],
    }
  },

  // 2.1.183: call @cli_inner_pretty.js:434694
  async call(input, ctx, canUseTool, assistantMessage) {
    const callerTaskId = ctx.agentId
    const callerName = callerTaskId ? resolveAgentName(ctx, callerTaskId) : undefined
    const origin: MessageOrigin =
      callerTaskId !== undefined && callerName !== undefined
        ? { kind: 'peer', from: callerName, senderTaskId: callerTaskId }
        : { kind: 'coordinator' }
    // A known peer's plain text is wrapped in an <agent-message from="..."> relay envelope:
    const payload: string | SendMessageMessage =
      typeof input.message === 'string' && callerTaskId !== undefined && callerName !== undefined
        ? wrapRelayMessage(callerName, input.message)
        : input.message

    // --- THE DELTA: route to the MAIN conversation (background subagents only) @434699 ---
    if (typeof input.message === 'string' && typeof payload === 'string' && input.to === MAIN_RESERVED_NAME) {
      if (callerTaskId === undefined) {
        // The main conversation itself cannot self-message "main".
        return {
          data: {
            success: false,
            message: `You are the main conversation — "${MAIN_RESERVED_NAME}" addresses you. Send to a named agent instead.`,
          },
        }
      }
      enqueuePrompt({
        mode: 'prompt',
        agentId: getMainAgentId(),
        value: payload,
        priority: 'next',
        origin,
        skipSlashCommands: true,
        isMeta: true,
      })
      return { data: { success: true, message: "Message queued for the main conversation's next turn." } }
    }

    // --- named-agent resolution + background-resume legs @434720 ---
    if (typeof input.message === 'string' && typeof payload === 'string') {
      const appState = ctx.getAppState()
      const agentId =
        (Object.values(appState.teamContext?.teammates ?? {}).some((t: { name?: string }) => t.name === input.to)
          ? undefined
          : appState.agentNameRegistry.get(input.to)) ?? parseAgentIdString(input.to)
      if (agentId) {
        const task = appState.tasks[agentId]
        if (isLocalAgentTask(task) && !isMainSessionTask(task)) {
          if (task.status === 'running') {
            queuePendingMessage(agentId, payload, ctx.taskRegistry, { origin, isMeta: true })
            return {
              data: { success: true, message: `Message queued for delivery to ${input.to} at its next tool round.` },
            }
          }
          // task exists but stopped — auto-resume in the background.
          try {
            const result = await resumeAgentBackground({
              agentId,
              prompt: payload,
              promptOrigin: origin,
              toolUseContext: ctx,
              canUseTool,
              invokingRequestId: assistantMessage?.requestId,
            })
            return {
              data: {
                success: true,
                message: `Agent "${input.to}" was stopped (${task.status}); resumed it in the background with your message. You'll be notified when it finishes. Output: ${result.outputFile}`,
              },
            }
          } catch (e) {
            return {
              data: {
                success: false,
                message: `Agent "${input.to}" is stopped (${task.status}) and could not be resumed: ${errorMessage(e)}`,
              },
            }
          }
        } else {
          // task evicted from state — dedupe via the in-flight resume map, then try teammate/transcript resume.
          const inFlight = inFlightTeammateResumes.get(agentId)
          if (inFlight) {
            const resolvedId = await inFlight
            const runningTask = resolvedId ? ctx.getAppState().tasks[resolvedId] : undefined
            if (runningTask && isInProcessTeammateTask(runningTask)) {
              await writeToMailbox(
                runningTask.identity.agentName,
                {
                  from: getSenderName(ctx),
                  text: input.message,
                  summary: input.summary,
                  timestamp: new Date().toISOString(),
                  color: getTeammateColor(),
                },
                runningTask.identity.teamName,
              )
              return {
                data: {
                  success: true,
                  message: `Teammate "${input.to}" is already running; queued your message for its next turn.`,
                },
              }
            }
          }
          const deferred = createDeferred<string | null>()
          inFlightTeammateResumes.set(agentId, deferred.promise)
          let meta: { name?: string; teamName?: string } | null = null
          try {
            meta = await getInProcessTeammateMeta(agentId)
            if (meta) {
              const teammateName = meta.name ?? input.to
              const teamName = meta.teamName ?? getTeamName(ctx.getAppState().teamContext)
              // If a matching teammate task is already running, just queue to its inbox.
              for (const t of Object.values(ctx.getAppState().tasks)) {
                if (
                  isInProcessTeammateTask(t) &&
                  t.status === 'running' &&
                  (t.identity.resumableAgentId === agentId ||
                    (t.identity.agentName === teammateName && t.identity.teamName === teamName))
                ) {
                  deferred.resolve(t.id)
                  await writeToMailbox(
                    t.identity.agentName,
                    {
                      from: getSenderName(ctx),
                      text: input.message,
                      summary: input.summary,
                      timestamp: new Date().toISOString(),
                      color: getTeammateColor(),
                    },
                    t.identity.teamName,
                  )
                  return {
                    data: {
                      success: true,
                      message: `Teammate "${input.to}" is already running; queued your message for its next turn.`,
                    },
                  }
                }
              }
              // Otherwise resume it as a fresh in-process teammate.
              const resumed = await resumeInProcessTeammate({
                resumableAgentId: agentId,
                prompt: input.message,
                senderName: callerName,
                meta,
                fallbackName: input.to,
                toolUseContext: ctx,
              })
              deferred.resolve(resumed.taskId)
              return {
                data: {
                  success: true,
                  message:
                    resumed.resumedMessageCount > 0
                      ? `Teammate "${input.to}" was not running; resumed it as an in-process teammate with ${resumed.resumedMessageCount} prior messages and your message as its next prompt.`
                      : `Teammate "${input.to}" was not running; resumed it as an in-process teammate (no prior transcript) with your message as its next prompt.`,
                },
              }
            }
            // Not an in-process teammate — resume from disk transcript in the background.
            deferred.resolve(null)
            const result = await resumeAgentBackground({
              agentId,
              prompt: payload,
              promptOrigin: origin,
              toolUseContext: ctx,
              canUseTool,
              invokingRequestId: assistantMessage?.requestId,
            })
            return {
              data: {
                success: true,
                message: `Agent "${input.to}" had no active task; resumed from transcript in the background with your message. You'll be notified when it finishes. Output: ${result.outputFile}`,
              },
            }
          } catch (e) {
            deferred.resolve(null)
            return {
              data: {
                success: false,
                message: meta
                  ? `Failed to resume teammate "${input.to}": ${errorMessage(e)}`
                  : `Agent "${input.to}" has no transcript to resume. It may have been cleaned up. (${errorMessage(e)})`,
              },
            }
          } finally {
            inFlightTeammateResumes.delete(agentId)
          }
        }
      }
    }

    // --- ordinary teammate inbox send (string message, no active task) @434870 ---
    if (typeof input.message === 'string') {
      return sendTeammateMessage(input.to, input.message, input.summary, ctx)
    }

    // --- structured team-protocol messages @434871 ---
    // Only the session itself may send structured frames; a background subagent cannot.
    if (ctx.agentId) {
      const task = ctx.getAppState().tasks[ctx.agentId]
      if (isLocalAgentTask(task) || ctx.agentContext?.agentType !== 'teammate') {
        return {
          data: {
            success: false,
            message:
              'Structured team-protocol messages (shutdown/plan responses and requests) are acts of the session itself and cannot be sent by a background subagent. Send a plain text message instead.',
          },
        }
      }
    }
    switch (input.message.type) {
      case 'shutdown_request':
        return handleShutdownRequest(input.to, input.message.reason, ctx)
      case 'shutdown_response':
        if (input.message.approve) return handleShutdownApproval(input.message.request_id, ctx)
        return handleShutdownRejection(input.message.request_id, input.message.reason!)
      case 'plan_approval_response':
        if (input.message.approve) return handlePlanApproval(input.to, input.message.request_id, input.message.feedback, ctx)
        return handlePlanRejection(
          input.to,
          input.message.request_id,
          input.message.feedback ?? 'Plan needs revision',
          ctx,
        )
    }
  },

  renderToolUseMessage,
  renderToolResultMessage,
} satisfies ToolDef<InputSchema, SendMessageToolOutput>)

// renderToolUseMessage = sza @434316 / renderToolResultMessage = iza @434322 — pure UI render
// helpers (out of scope per _conventions.md; declared so the tool def type-checks).
declare const renderToolUseMessage: ToolDef<InputSchema, SendMessageToolOutput>['renderToolUseMessage']
declare const renderToolResultMessage: ToolDef<InputSchema, SendMessageToolOutput>['renderToolResultMessage']

// Mapping: p$p->SendMessageTool, o$p->inputSchema, r$p->SendMessageMessageUnionSchema (in teammateControlMessages),
//          nza->SEND_MESSAGE_DESCRIPTION, rza->buildSendMessagePrompt, zh->SEND_MESSAGE_TOOL_NAME,
//          LLa->parseSocketAddress, Lhe->isLocalSocketAddress, Gtt->LIST_AGENTS_TOOL, iF->isStructuredProtocolMessage,
//          LY->MAIN_RESERVED_NAME, np->TEAM_LEAD_NAME, vs->AGENT_TOOL_NAME, Sl->isAgentSwarmsEnabled,
//          cza->resolveAgentName, p4n->getSenderName, lDa->wrapRelayMessage, s$p->findTeammateColor,
//          i$p->sendTeammateMessage, a$p->handleShutdownRequest, l$p->handleShutdownApproval,
//          c$p->handleShutdownRejection, u$p->handlePlanApproval, d$p->handlePlanRejection,
//          o_->enqueuePrompt, Ls->getMainAgentId, tUo->parseAgentIdString, Z6a->getInProcessTeammateMeta,
//          gWe->queuePendingMessage, dLe->resumeAgentBackground, eza->resumeInProcessTeammate,
//          Wz->createDeferred, d4n->inFlightTeammateResumes, od->isLocalAgentTask, L3t->isMainSessionTask,
//          _S->isInProcessTeammateTask, $A->writeToMailbox, Re->jsonStringify, Gt->jsonParse, Se->errorMessage,
//          ih->getAgentName, zp->getTeamName, fT->getTeammateColor, VD->getAgentId, RM->isTeamLead,
//          CM->resolveInheritedMode, Br->getToolPermissionContext, Bhe->findTeammateTaskByAgentId,
//          TYe->generateRequestId, Llt->createShutdownRequestMessage, wso->createShutdownApprovedMessage,
//          Cso->createShutdownRejectedMessage, $i->gracefulShutdown, sza->renderToolUseMessage, iza->renderToolResultMessage
