/**
 * Teammate control-message protocol layer (the typed frames carried over the
 * mailbox).
 *
 * The agent-team subsystem talks through one transport: a per-recipient JSON
 * inbox file (`utils/teammateMailbox.ts` `writeToMailbox`). Every frame here is
 * `writeToMailbox`'d as a chat message whose `text` field holds the JSON of one
 * of these objects, and the recipient's inbox poll / SendMessage validator
 * recognises it by parsing the `text` back and switching on `.type`. This file
 * holds the *shapes* (builders + parsers + Zod schemas) and the master
 * "is this text a control frame?" predicate.
 *
 * 2.1.183 regions (all re-read in cli_inner_pretty.js):
 *   - export map (the `Lso` mailbox module table)        @365900-365915
 *   - IdleNotificationMessageSchema (C4e)                @366364
 *   - PlanApprovalRequestMessageSchema (pUt)             @366376
 *   - PlanApprovalResponseMessageSchema (fUt)            @366386
 *   - ShutdownRequestMessageSchema (mUt)                 @366396
 *   - ShutdownApprovedMessageSchema (Uhe)                @366405
 *   - ShutdownRejectedMessageSchema (SBn)                @366415
 *   - TaskAssignmentMessageSchema (ODa)                  @366424
 *   - TaskCompletedMessageSchema (Iso)                   @366434
 *   - TeammateTerminatedMessageSchema (x4e)              @366443
 *   - ModeSetRequestMessageSchema (NDa)                  @366444
 *   - createIdleNotification (cUt)                       @366068
 *   - isIdleNotification (Sso)                           @366080
 *   - createPermissionRequestMessage (Eso)              @366087
 *   - createPermissionResponseMessage (Hso)             @366099
 *   - isPermissionRequest (uUt) / isPermissionResponse (I4e) @366114 / @366121
 *   - createSandboxPermissionRequestMessage (vso)        @366128
 *   - createSandboxPermissionResponseMessage (Tso)       @366139
 *   - isSandboxPermissionRequest (bBn) / isSandboxPermissionResponse (dUt) @366148 / @366155
 *   - createShutdownRequestMessage (Llt)                 @366162
 *   - createShutdownApprovedMessage (wso)                @366171
 *   - createShutdownRejectedMessage (Cso)                @366181
 *   - sendShutdownRequestToMailbox (Yyp)                 @366190
 *   - isShutdownRequest (Dlt) / isShutdownApproved (jhe) / isShutdownRejected — see note
 *   - isPlanApprovalRequest (AUt) / isPlanApprovalResponse (Plt) @366207 / @366221
 *   - isTaskAssignment (EBn) via parseFrameForDisplay (jT) @366228 / @366231
 *   - isTeamPermissionUpdate (xso)                       @366238
 *   - createModeSetRequestMessage (Xyp) / isModeSetRequest (Mlt) @366246 / @366249
 *   - isStructuredProtocolMessage (iF) — the master type set @366256
 *   - planApprovalResumeText (hUt)                       @366277
 *   - isHeadlessLeadDisplayableMessage (kso)             @366282
 *   - PROTOCOL_FRAME_PROMPT_ERROR (gUt)                  @366345
 *   - model-facing SendMessage union (r$p) + request-id regex (lza) @434539-434557
 *
 * 2.1.88 ancestor (shape + naming mirror): utils/teammateMailbox.ts — the v2.1.88
 *   file co-located the mailbox mechanics AND these control-message types in one
 *   module. The reconstructed 183 tree splits the file-IO mechanics into
 *   teammateMailbox.ts and the typed protocol frames into this file; every
 *   builder/parser/schema below mirrors a v2.1.88 export of the same name
 *   (createShutdownRequestMessage, isShutdownApproved, ModeSetRequestMessageSchema,
 *   isStructuredProtocolMessage, …). The shapes are byte-for-byte carryover from
 *   v2.1.156 (dossier §4: "Shutdown / idle / permission control-message types …
 *   are present and structurally the same"); only the obfuscated names re-mangled.
 *
 * scaffold: 30_agent_team/mailbox_lifecycle_and_sendmessage_delta.md (§3.5 the
 *   message-union (non-)trim, §3.4 the iF guard) + baseline §3 + _scout_dossier §4.
 *
 * cross-val (re-read in the 183 bundle): every builder/parser body and every Zod
 *   schema literal between @366056-366345; the master type set `iF` (@366256, the
 *   same 10 types as v2.1.156 `$X8`); the model-facing union `r$p` (@434541, three
 *   members only — shutdown_request / shutdown_response / plan_approval_response);
 *   the request-id regex `lza = /^[^\n\r]{1,200}$/` (@434539); the protocol-frame
 *   prompt error `gUt` (@366345). CONFIRMED: there is NO live `createTeamPermissionUpdateMessage`
 *   builder in the bundle (only the parser `xso`); `createModeSetRequestMessage`
 *   (`Xyp`) exists and is exported but is never called within this bundle (it is
 *   the leader-side builder used by external/leader-mode code).
 */

import { z } from 'zod/v4'

import { generateRequestId } from './agentId.js'
import { jsonParse, jsonStringify } from './slowOperations.js'
import type { BackendType } from './swarm/backends/types.js'
import { TEAM_LEAD_NAME } from './swarm/constants.js'
import { PermissionModeSchema } from '../entrypoints/sdk/coreSchemas.js'
import { writeToMailbox } from './teammateMailbox.js'
// Session-identity accessors live in ./teammate.js (mirrors the v2.1.88
// teammateMailbox.ts import, and the existing reconstructed teammateMailbox.ts
// sibling which imports getTeamName from there). In the 183 bundle these are
// ih (getAgentName @103455), zp (getTeamName @103460), fT (getTeammateColor @103514).
import { getAgentName, getTeamName, getTeammateColor } from './teammate.js'

// NOTE: LOCK_OPTIONS (iUt @cli_inner_pretty.js:366363) is declared in this same
// bundle initialiser, but it is a mailbox-mechanics concern and is reconstructed
// in the sibling teammateMailbox.ts. The control-message layer here does not use
// it directly (it goes through writeToMailbox), so it is not re-declared.

// ===========================================================================
// 1. Idle notification — teammate -> leader, "I came to rest this turn"
// ===========================================================================

// 2.1.183: IdleNotificationMessageSchema = C4e @cli_inner_pretty.js:366364
export const IdleNotificationMessageSchema = z.object({
  type: z.literal('idle_notification'),
  from: z.string(),
  timestamp: z.string(),
  idleReason: z.enum(['available', 'interrupted', 'failed']).optional(),
  summary: z.string().optional(),
  completedTaskId: z.string().optional(),
  completedStatus: z.enum(['resolved', 'blocked', 'failed']).optional(),
  failureReason: z.string().optional(),
})
export type IdleNotificationMessage = z.infer<typeof IdleNotificationMessageSchema>

// 2.1.183: createIdleNotification = cUt @cli_inner_pretty.js:366068
/** Built by a teammate when its turn ends; written to the leader's inbox. */
export function createIdleNotification(
  agentName: string,
  options?: {
    idleReason?: IdleNotificationMessage['idleReason']
    summary?: string
    completedTaskId?: string
    completedStatus?: IdleNotificationMessage['completedStatus']
    failureReason?: string
  },
): IdleNotificationMessage {
  return {
    type: 'idle_notification',
    from: agentName,
    timestamp: new Date().toISOString(),
    idleReason: options?.idleReason,
    summary: options?.summary,
    completedTaskId: options?.completedTaskId,
    completedStatus: options?.completedStatus,
    failureReason: options?.failureReason,
  }
}

// 2.1.183: isIdleNotification = Sso @cli_inner_pretty.js:366080
/**
 * Lenient parser: JSON.parse the text and accept it if `.type` matches. The
 * idle / permission / sandbox / task parsers are deliberately schema-free (a
 * bare `.type ===` check) so a forward-compatible frame with extra fields still
 * routes; the shutdown / plan / mode parsers below use the strict Zod schemas.
 */
export function isIdleNotification(
  messageText: string,
): IdleNotificationMessage | null {
  try {
    const parsed = jsonParse(messageText)
    if (parsed && parsed.type === 'idle_notification') return parsed
  } catch {}
  return null
}

// ===========================================================================
// 2. Permission request / response — worker -> leader -> worker
//    (the leader↔teammate permission bridge `createTeammateCanUseTool` writes
//     a permission_request and polls for a matching permission_response).
// ===========================================================================

/** Field names align with the SDK `can_use_tool` control protocol (snake_case). */
export type PermissionRequestMessage = {
  type: 'permission_request'
  request_id: string
  agent_id: string
  tool_name: string
  tool_use_id: string
  description: string
  input: Record<string, unknown>
  permission_suggestions: unknown[]
}

export type PermissionResponseMessage =
  | {
      type: 'permission_response'
      request_id: string
      subtype: 'success'
      response?: {
        updated_input?: Record<string, unknown>
        permission_updates?: unknown[]
      }
    }
  | {
      type: 'permission_response'
      request_id: string
      subtype: 'error'
      error: string
    }

// 2.1.183: createPermissionRequestMessage = Eso @cli_inner_pretty.js:366087
export function createPermissionRequestMessage(params: {
  request_id: string
  agent_id: string
  tool_name: string
  tool_use_id: string
  description: string
  input: Record<string, unknown>
  permission_suggestions?: unknown[]
}): PermissionRequestMessage {
  return {
    type: 'permission_request',
    request_id: params.request_id,
    agent_id: params.agent_id,
    tool_name: params.tool_name,
    tool_use_id: params.tool_use_id,
    description: params.description,
    input: params.input,
    permission_suggestions: params.permission_suggestions || [],
  }
}

// 2.1.183: createPermissionResponseMessage = Hso @cli_inner_pretty.js:366099
export function createPermissionResponseMessage(params: {
  request_id: string
  subtype: 'success' | 'error'
  error?: string
  updated_input?: Record<string, unknown>
  permission_updates?: unknown[]
}): PermissionResponseMessage {
  if (params.subtype === 'error') {
    // @366100
    return {
      type: 'permission_response',
      request_id: params.request_id,
      subtype: 'error',
      error: params.error || 'Permission denied',
    }
  }
  return {
    type: 'permission_response',
    request_id: params.request_id,
    subtype: 'success',
    response: {
      updated_input: params.updated_input,
      permission_updates: params.permission_updates,
    },
  }
}

// 2.1.183: isPermissionRequest = uUt @cli_inner_pretty.js:366114
export function isPermissionRequest(
  messageText: string,
): PermissionRequestMessage | null {
  try {
    const parsed = jsonParse(messageText)
    if (parsed && parsed.type === 'permission_request') return parsed
  } catch {}
  return null
}

// 2.1.183: isPermissionResponse = I4e @cli_inner_pretty.js:366121
export function isPermissionResponse(
  messageText: string,
): PermissionResponseMessage | null {
  try {
    const parsed = jsonParse(messageText)
    if (parsed && parsed.type === 'permission_response') return parsed
  } catch {}
  return null
}

// ===========================================================================
// 3. Sandbox permission request / response — worker -> leader -> worker
//    (raised when sandbox runtime hits a non-allowed network host).
// ===========================================================================

export type SandboxPermissionRequestMessage = {
  type: 'sandbox_permission_request'
  requestId: string
  workerId: string
  workerName: string
  workerColor?: string
  hostPattern: { host: string }
  createdAt: number
}

export type SandboxPermissionResponseMessage = {
  type: 'sandbox_permission_response'
  requestId: string
  host: string
  allow: boolean
  timestamp: string
}

// 2.1.183: createSandboxPermissionRequestMessage = vso @cli_inner_pretty.js:366128
export function createSandboxPermissionRequestMessage(params: {
  requestId: string
  workerId: string
  workerName: string
  workerColor?: string
  host: string
}): SandboxPermissionRequestMessage {
  return {
    type: 'sandbox_permission_request',
    requestId: params.requestId,
    workerId: params.workerId,
    workerName: params.workerName,
    workerColor: params.workerColor,
    hostPattern: { host: params.host },
    createdAt: Date.now(),
  }
}

// 2.1.183: createSandboxPermissionResponseMessage = Tso @cli_inner_pretty.js:366139
export function createSandboxPermissionResponseMessage(params: {
  requestId: string
  host: string
  allow: boolean
}): SandboxPermissionResponseMessage {
  return {
    type: 'sandbox_permission_response',
    requestId: params.requestId,
    host: params.host,
    allow: params.allow,
    timestamp: new Date().toISOString(),
  }
}

// 2.1.183: isSandboxPermissionRequest = bBn @cli_inner_pretty.js:366148
export function isSandboxPermissionRequest(
  messageText: string,
): SandboxPermissionRequestMessage | null {
  try {
    const parsed = jsonParse(messageText)
    if (parsed && parsed.type === 'sandbox_permission_request') return parsed
  } catch {}
  return null
}

// 2.1.183: isSandboxPermissionResponse = dUt @cli_inner_pretty.js:366155
export function isSandboxPermissionResponse(
  messageText: string,
): SandboxPermissionResponseMessage | null {
  try {
    const parsed = jsonParse(messageText)
    if (parsed && parsed.type === 'sandbox_permission_response') return parsed
  } catch {}
  return null
}

// ===========================================================================
// 4. Shutdown protocol — request (leader -> teammate), approved / rejected
//    (teammate -> leader). All three are model-facing: shutdown_request &
//    shutdown_response are members of the SendMessage `message` union (§7).
// ===========================================================================

// 2.1.183: ShutdownRequestMessageSchema = mUt @cli_inner_pretty.js:366396
export const ShutdownRequestMessageSchema = z.object({
  type: z.literal('shutdown_request'),
  requestId: z.string(),
  from: z.string(),
  reason: z.string().optional(),
  timestamp: z.string(),
})
export type ShutdownRequestMessage = z.infer<typeof ShutdownRequestMessageSchema>

// 2.1.183: ShutdownApprovedMessageSchema = Uhe @cli_inner_pretty.js:366405
export const ShutdownApprovedMessageSchema = z.object({
  type: z.literal('shutdown_approved'),
  requestId: z.string(),
  from: z.string(),
  timestamp: z.string(),
  paneId: z.string().optional(),
  backendType: z.string().optional(),
})
export type ShutdownApprovedMessage = z.infer<typeof ShutdownApprovedMessageSchema>

// 2.1.183: ShutdownRejectedMessageSchema = SBn @cli_inner_pretty.js:366415
export const ShutdownRejectedMessageSchema = z.object({
  type: z.literal('shutdown_rejected'),
  requestId: z.string(),
  from: z.string(),
  reason: z.string(),
  timestamp: z.string(),
})
export type ShutdownRejectedMessage = z.infer<typeof ShutdownRejectedMessageSchema>

// 2.1.183: createShutdownRequestMessage = Llt @cli_inner_pretty.js:366162
export function createShutdownRequestMessage(params: {
  requestId: string
  from: string
  reason?: string
}): ShutdownRequestMessage {
  return {
    type: 'shutdown_request',
    requestId: params.requestId,
    from: params.from,
    reason: params.reason,
    timestamp: new Date().toISOString(),
  }
}

// 2.1.183: createShutdownApprovedMessage = wso @cli_inner_pretty.js:366171
export function createShutdownApprovedMessage(params: {
  requestId: string
  from: string
  paneId?: string
  backendType?: BackendType
}): ShutdownApprovedMessage {
  return {
    type: 'shutdown_approved',
    requestId: params.requestId,
    from: params.from,
    timestamp: new Date().toISOString(),
    paneId: params.paneId,
    backendType: params.backendType,
  }
}

// 2.1.183: createShutdownRejectedMessage = Cso @cli_inner_pretty.js:366181
export function createShutdownRejectedMessage(params: {
  requestId: string
  from: string
  reason: string
}): ShutdownRejectedMessage {
  return {
    type: 'shutdown_rejected',
    requestId: params.requestId,
    from: params.from,
    reason: params.reason,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Convenience: build + send a shutdown request to a teammate's inbox. Used by
 * both the SendMessage shutdown leg and the TeammateShutdown UI. Sender name
 * resolves from the in-process/teammate context, defaulting to the team lead;
 * the request id is `shutdown-<ts>@<target>` (deterministic per target).
 */
// 2.1.183: sendShutdownRequestToMailbox = Yyp @cli_inner_pretty.js:366190
export async function sendShutdownRequestToMailbox(
  targetName: string,
  teamName?: string,
  reason?: string,
): Promise<{ requestId: string; target: string }> {
  const resolvedTeamName = teamName || getTeamName() // @366191 (zp)
  const senderName = getAgentName() || TEAM_LEAD_NAME // @366192 (ih ?? np)
  const requestId = generateRequestId('shutdown', targetName) // @366193 (TYe)
  const shutdownMessage = createShutdownRequestMessage({
    requestId,
    from: senderName,
    reason,
  })
  await writeToMailbox(
    targetName,
    {
      from: senderName,
      text: jsonStringify(shutdownMessage), // frame serialised into the chat `text`
      timestamp: new Date().toISOString(),
      color: getTeammateColor(), // @366197 (fT)
    },
    resolvedTeamName,
  )
  return { requestId, target: targetName }
}

// 2.1.183: isShutdownRequest = Dlt @cli_inner_pretty.js:366200
/** Strict (schema-validated) parsers for the shutdown frames. */
export function isShutdownRequest(
  messageText: string,
): ShutdownRequestMessage | null {
  try {
    const result = ShutdownRequestMessageSchema.safeParse(jsonParse(messageText))
    if (result.success) return result.data
  } catch {}
  return null
}

// 2.1.183: isShutdownApproved = jhe @cli_inner_pretty.js:366214
export function isShutdownApproved(
  messageText: string,
): ShutdownApprovedMessage | null {
  try {
    const result = ShutdownApprovedMessageSchema.safeParse(jsonParse(messageText))
    if (result.success) return result.data
  } catch {}
  return null
}

// UNVERIFIED: no discrete `isShutdownRejected` predicate exists in the 2.1.183
//   bundle. Only the schema SBn (ShutdownRejectedMessageSchema @366415) is present;
//   the 2.1.183 build consumes it inline via the STRICT helper `jT(SBn(), e)` in the
//   shutdown display routing (LOa/DOa @cli_inner_pretty.js:378482 / :378491), not via
//   a standalone safeParse predicate. This function is reconstructed from the v2.1.88
//   ancestor `utils/teammateMailbox.ts:919` (which DID export `isShutdownRejected`
//   with this exact non-strict `safeParse` body); kept for API symmetry with its
//   siblings. Re-verified the SBn schema literal @366415.
export function isShutdownRejected(
  messageText: string,
): ShutdownRejectedMessage | null {
  try {
    const result = ShutdownRejectedMessageSchema.safeParse(jsonParse(messageText))
    if (result.success) return result.data
  } catch {}
  return null
}

// ===========================================================================
// 5. Plan approval protocol — request (teammate -> leader), response
//    (leader -> teammate). plan_approval_response is model-facing (§7);
//    plan_approval_request is leader-internal (sent by the worker's plan flow).
// ===========================================================================

// 2.1.183: PlanApprovalRequestMessageSchema = pUt @cli_inner_pretty.js:366376
export const PlanApprovalRequestMessageSchema = z.object({
  type: z.literal('plan_approval_request'),
  from: z.string(),
  timestamp: z.string(),
  planFilePath: z.string(),
  planContent: z.string(),
  requestId: z.string(),
})
export type PlanApprovalRequestMessage = z.infer<
  typeof PlanApprovalRequestMessageSchema
>

// 2.1.183: PlanApprovalResponseMessageSchema = fUt @cli_inner_pretty.js:366386
export const PlanApprovalResponseMessageSchema = z.object({
  type: z.literal('plan_approval_response'),
  requestId: z.string(),
  approved: z.boolean(),
  feedback: z.string().optional(),
  timestamp: z.string(),
  permissionMode: PermissionModeSchema().optional(),
})
export type PlanApprovalResponseMessage = z.infer<
  typeof PlanApprovalResponseMessageSchema
>

// 2.1.183: isPlanApprovalRequest = AUt @cli_inner_pretty.js:366207
export function isPlanApprovalRequest(
  messageText: string,
): PlanApprovalRequestMessage | null {
  try {
    const result = PlanApprovalRequestMessageSchema.safeParse(jsonParse(messageText))
    if (result.success) return result.data
  } catch {}
  return null
}

// 2.1.183: isPlanApprovalResponse = Plt @cli_inner_pretty.js:366221
export function isPlanApprovalResponse(
  messageText: string,
): PlanApprovalResponseMessage | null {
  try {
    const result = PlanApprovalResponseMessageSchema.safeParse(jsonParse(messageText))
    if (result.success) return result.data
  } catch {}
  return null
}

// 2.1.183: planApprovalResumeText = hUt @cli_inner_pretty.js:366277
/**
 * Renders a plan-approval response into the prompt text injected into the
 * worker's next turn. VERBATIM strings re-read at @366277-366279.
 */
export function planApprovalResumeText(
  response: Pick<PlanApprovalResponseMessage, 'approved' | 'feedback'>,
): string {
  if (response.approved) {
    return response.feedback
      ? `[Plan Approved] ${response.feedback}`
      : '[Plan Approved] You can now proceed with implementation'
  }
  return `[Plan Rejected] ${response.feedback || 'Please revise your plan'}`
}

// ===========================================================================
// 6. Task lifecycle frames — assignment / completed / teammate terminated.
//    Parsed via the shared strict helper parseFrameForDisplay (jT). These are
//    NOT in the master control-frame set `iF` (§7); they are the
//    lifecycle/task frames that SendMessage.validateInput separately rejects
//    as plain-string smuggling.
// ===========================================================================

// 2.1.183: TaskAssignmentMessageSchema = ODa @cli_inner_pretty.js:366424
export const TaskAssignmentMessageSchema = z.object({
  type: z.literal('task_assignment'),
  taskId: z.string(),
  subject: z.string(),
  description: z.string(),
  assignedBy: z.string(),
  timestamp: z.string(),
})
export type TaskAssignmentMessage = z.infer<typeof TaskAssignmentMessageSchema>

// 2.1.183: TaskCompletedMessageSchema = Iso @cli_inner_pretty.js:366434
export const TaskCompletedMessageSchema = z.object({
  type: z.literal('task_completed'),
  from: z.string().optional(),
  taskId: z.string(),
  taskSubject: z.string().optional(),
  timestamp: z.string().optional(),
})
export type TaskCompletedMessage = z.infer<typeof TaskCompletedMessageSchema>

// 2.1.183: TeammateTerminatedMessageSchema = x4e @cli_inner_pretty.js:366443
export const TeammateTerminatedMessageSchema = z.object({
  type: z.literal('teammate_terminated'),
  message: z.string(),
})
export type TeammateTerminatedMessage = z.infer<
  typeof TeammateTerminatedMessageSchema
>

// 2.1.183: parseFrameForDisplay = jT @cli_inner_pretty.js:366231
/**
 * Strict (`.strict()`) schema parse of an arbitrary frame text against a given
 * schema — rejects any unknown extra keys. Shared by isTaskAssignment and the
 * inbox-poller's display routing.
 */
export function parseFrameForDisplay<T>(
  schema: z.ZodObject<z.ZodRawShape>,
  messageText: string,
): T | null {
  try {
    const result = schema.strict().safeParse(jsonParse(messageText)) // @366232
    if (result.success) return result.data as T
  } catch {}
  return null
}

// 2.1.183: isTaskAssignment = EBn @cli_inner_pretty.js:366228
export function isTaskAssignment(messageText: string): TaskAssignmentMessage | null {
  return parseFrameForDisplay<TaskAssignmentMessage>(
    TaskAssignmentMessageSchema,
    messageText,
  )
}

// ===========================================================================
// 7. team_permission_update + mode_set_request — INTERNAL-ONLY protocol frames.
//    These are in the master control-frame set `iF` (§8) and on the wire, but
//    are NOT members of the model-facing SendMessage union (`r$p`, §9). The
//    model can never submit them; the leader emits them internally.
// ===========================================================================

/**
 * Broadcast from leader to teammates: apply this permission update session-wide.
 *
 * INTERNAL-ONLY. There is NO `createTeamPermissionUpdateMessage` builder in the
 * 183 bundle — only the parser `xso` exists. The inbox poller in fact *drops*
 * inbound `team_permission_update` frames defensively
 * ("[InboxPoller] Dropping team_permission_update message: permission rules are
 *  never accepted from the inbox", @666149), so a worker never trusts one over
 * the wire; the type remains in the set for completeness / display routing.
 */
export type TeamPermissionUpdateMessage = {
  type: 'team_permission_update'
  permissionUpdate: {
    type: 'addRules'
    rules: Array<{ toolName: string; ruleContent?: string }>
    behavior: 'allow' | 'deny' | 'ask'
    destination: 'session'
  }
  directoryPath: string
  toolName: string
}

// 2.1.183: isTeamPermissionUpdate = xso @cli_inner_pretty.js:366238
export function isTeamPermissionUpdate(messageText: string): boolean {
  // v2.1.156 `tJ8` @338596 returned the parsed object (or null); v2.1.183 `xso` was
  // CHANGED to a pure boolean predicate — `return !!t && t.type === "team_permission_update"`.
  try {
    const parsed = jsonParse(messageText) // @366240  Gt(e)
    return !!parsed && parsed.type === 'team_permission_update' // @366241
  } catch {
    return false // @366243
  }
}

// 2.1.183: ModeSetRequestMessageSchema = NDa @cli_inner_pretty.js:366444
/** INTERNAL-ONLY: leader tells a teammate to switch permission mode. */
export const ModeSetRequestMessageSchema = z.object({
  type: z.literal('mode_set_request'),
  mode: PermissionModeSchema(),
  from: z.string(),
})
export type ModeSetRequestMessage = z.infer<typeof ModeSetRequestMessageSchema>

// 2.1.183: createModeSetRequestMessage = Xyp @cli_inner_pretty.js:366246
/**
 * Leader-side builder. Exported and present in the bundle but NOT called within
 * it (leader-mode external code is the only producer). Note the literal omits a
 * timestamp — the mode_set frame is `{ type, mode, from }` only.
 */
export function createModeSetRequestMessage(params: {
  mode: ModeSetRequestMessage['mode']
  from: string
}): ModeSetRequestMessage {
  return { type: 'mode_set_request', mode: params.mode, from: params.from }
}

// 2.1.183: isModeSetRequest = Mlt @cli_inner_pretty.js:366249
export function isModeSetRequest(messageText: string): ModeSetRequestMessage | null {
  try {
    const result = ModeSetRequestMessageSchema.safeParse(jsonParse(messageText))
    if (result.success) return result.data
  } catch {}
  return null
}

// ===========================================================================
// 8. The master control-frame type set — "is this text a protocol frame?"
// ===========================================================================

/**
 * The ten control-frame types recognised on the wire. Used by SendMessage's
 * validateInput to reject a string that is secretly a serialized control frame
 * (so the model can't smuggle e.g. a `shutdown_request` past as plain text), and
 * by the inbox poller to route a frame instead of consuming it as raw LLM
 * context. UNCHANGED set vs v2.1.156 (`$X8`).
 *
 * NOTE: the task-lifecycle frames (idle_notification / task_assignment /
 * task_completed / teammate_terminated / shutdown_rejected) are deliberately
 * NOT in this set — SendMessage rejects those via a separate second guard.
 */
// 2.1.183: isStructuredProtocolMessage = iF @cli_inner_pretty.js:366256
export function isStructuredProtocolMessage(messageText: string): boolean {
  try {
    const parsed = jsonParse(messageText)
    if (!parsed || typeof parsed !== 'object' || !('type' in parsed)) return false // @366257
    const type = (parsed as { type: unknown }).type
    return (
      type === 'permission_request' ||
      type === 'permission_response' ||
      type === 'sandbox_permission_request' ||
      type === 'sandbox_permission_response' ||
      type === 'shutdown_request' ||
      type === 'shutdown_approved' ||
      type === 'team_permission_update' ||
      type === 'mode_set_request' ||
      type === 'plan_approval_request' ||
      type === 'plan_approval_response'
    ) // @366260-366270
  } catch {
    return false
  }
}

/**
 * Verbatim error surfaced when a teammate spawn `prompt` (or a SendMessage
 * string) is itself a serialized protocol frame.
 */
// 2.1.183: PROTOCOL_FRAME_PROMPT_ERROR = gUt @cli_inner_pretty.js:366345
export const PROTOCOL_FRAME_PROMPT_ERROR =
  'Teammate prompt must not be a mailbox protocol frame (permission/mode/plan/shutdown JSON) — pass plain-text instructions'

// 2.1.183: isHeadlessLeadDisplayableMessage = kso @cli_inner_pretty.js:366282
/**
 * In a headless lead session, a mailbox text is "displayable" if it is NOT a raw
 * control frame, OR if it is one of the three frames the headless lead surfaces
 * to its output (shutdown_approved / plan_approval_request / plan_approval_response).
 */
export function isHeadlessLeadDisplayableMessage(messageText: string): boolean {
  return (
    !isStructuredProtocolMessage(messageText) ||
    isShutdownApproved(messageText) !== null ||
    isShutdownRequest(messageText) !== null ||
    isPlanApprovalRequest(messageText) !== null
  )
}

// ===========================================================================
// 9. The MODEL-FACING SendMessage `message` union (the only control frames the
//    model can submit). Three members only — re-read @434541. This resolves
//    dossier open question #5: the union was NOT trimmed; team_permission_update
//    / mode_set_request were never model-submittable (they live only in §7/§8).
// ===========================================================================

// 2.1.183: SEND_MESSAGE_REQUEST_ID_REGEX = lza @cli_inner_pretty.js:434539
/** A request id echoed back must be one line of <=200 chars (input hygiene). */
export const SEND_MESSAGE_REQUEST_ID_REGEX = /^[^\n\r]{1,200}$/

// A boolean preprocessor: coerces the strings "true"/"false" before validating.
// The inner schema is parameterizable (defaults to z.boolean()), exactly as the
// bundle's `n0(e = H.boolean())`; SendMessage calls it with no args -> z.boolean().
// 2.1.183: coerceBoolean = n0 @cli_inner_pretty.js:292819-292821
function coerceBoolean(inner: z.ZodTypeAny = z.boolean()) {
  return z.preprocess(
    (v) => (v === 'true' ? true : v === 'false' ? false : v),
    inner,
  )
}

// 2.1.183: sendMessageMessageUnion = r$p @cli_inner_pretty.js:434541
/**
 * The model-facing control-message union for SendMessage. NOTE the field names
 * are the model-facing snake_case form (`request_id`, `approve`) and differ from
 * the on-wire frame shapes above (`requestId`, `approved`): the SendMessage tool
 * translates between them before `writeToMailbox`. shutdown_response /
 * plan_approval_response are the model's replies; shutdown_request is the model
 * asking the leader to shut a teammate down.
 */
export const SendMessageMessageUnionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('shutdown_request'),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('shutdown_response'),
    request_id: z
      .string()
      .regex(SEND_MESSAGE_REQUEST_ID_REGEX, 'must be the request id being responded to'),
    approve: coerceBoolean(),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('plan_approval_response'),
    request_id: z
      .string()
      .regex(SEND_MESSAGE_REQUEST_ID_REGEX, 'must be the request id being responded to'),
    approve: coerceBoolean(),
    feedback: z.string().optional(),
  }),
])
export type SendMessageMessage = z.infer<typeof SendMessageMessageUnionSchema>

// Mapping: iUt->LOCK_OPTIONS, C4e->IdleNotificationMessageSchema, cUt->createIdleNotification,
//          Sso->isIdleNotification, Eso->createPermissionRequestMessage, Hso->createPermissionResponseMessage,
//          uUt->isPermissionRequest, I4e->isPermissionResponse, vso->createSandboxPermissionRequestMessage,
//          Tso->createSandboxPermissionResponseMessage, bBn->isSandboxPermissionRequest, dUt->isSandboxPermissionResponse,
//          mUt->ShutdownRequestMessageSchema, Uhe->ShutdownApprovedMessageSchema, SBn->ShutdownRejectedMessageSchema,
//          Llt->createShutdownRequestMessage, wso->createShutdownApprovedMessage, Cso->createShutdownRejectedMessage,
//          Yyp->sendShutdownRequestToMailbox, Dlt->isShutdownRequest, jhe->isShutdownApproved,
//          pUt->PlanApprovalRequestMessageSchema, fUt->PlanApprovalResponseMessageSchema,
//          AUt->isPlanApprovalRequest, Plt->isPlanApprovalResponse, hUt->planApprovalResumeText,
//          ODa->TaskAssignmentMessageSchema, Iso->TaskCompletedMessageSchema, x4e->TeammateTerminatedMessageSchema,
//          EBn->isTaskAssignment, jT->parseFrameForDisplay, xso->isTeamPermissionUpdate,
//          NDa->ModeSetRequestMessageSchema, Xyp->createModeSetRequestMessage, Mlt->isModeSetRequest,
//          iF->isStructuredProtocolMessage, gUt->PROTOCOL_FRAME_PROMPT_ERROR, kso->isHeadlessLeadDisplayableMessage,
//          r$p->SendMessageMessageUnionSchema, lza->SEND_MESSAGE_REQUEST_ID_REGEX, n0->coerceBoolean,
//          PY->PermissionModeSchema, zp->getTeamName, ih->getAgentName, fT->getTeammateColor, TYe->generateRequestId,
//          $A->writeToMailbox, np->TEAM_LEAD_NAME, Gt->jsonParse, Re->jsonStringify
