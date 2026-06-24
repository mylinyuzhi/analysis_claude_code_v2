/**
 * Permission Sync — mailbox round-trip + poller registry for teammate permission requests
 * (CARRYOVER, v2.1.156 → v2.1.183). This is the companion of leaderPermissionBridge.ts: the bridge
 * (`eDp`) DRIVES these helpers when a non-interactive leader must approve a teammate's tool call.
 *
 * 2.1.183 source regions covered:
 *   - buildPermissionRequest (TUn)                  @cli_inner_pretty.js:387641-387667
 *   - generateRequestId (HTp)                       @cli_inner_pretty.js:387638
 *   - getLeaderName (WBa)                           @cli_inner_pretty.js:387673-387679
 *   - publishPermissionRequestToLeader (wUn)        @cli_inner_pretty.js:387680-387704
 *   - sendPermissionResponseToWorker (CUn)          @cli_inner_pretty.js:387706-387725
 *   - createPermissionRequestMessage (Eso)          @cli_inner_pretty.js:366087-366098
 *   - createPermissionResponseMessage (Hso)         @cli_inner_pretty.js:366099-366120
 *   - parseJsonPermissionUpdates (Jyp)              @cli_inner_pretty.js:366469-366479
 *   - poller registry registerPermissionCallback (wBn) @cli_inner_pretty.js:366480-366482
 *   - unregisterPermissionCallback (FDa)            @cli_inner_pretty.js:366483-366485
 *   - hasPermissionCallback (UDa)                   @cli_inner_pretty.js:366486-366488
 *   - clearPermissionCallbacks (jDa)                @cli_inner_pretty.js:366489-366491
 *   - resolvePermissionCallback (Nlt)               @cli_inner_pretty.js:366492-366505
 *   - registry maps Olt/bUt                         @cli_inner_pretty.js:366526-366527
 *   - identity getters getAgentId/Name/TeamName (VD/ih/zp) @cli_inner_pretty.js:103450/103455/103460
 *   - getTeammateColor (fT)                         @cli_inner_pretty.js:103514
 *   - readTeamFileAsync (Nhe)                       @cli_inner_pretty.js:362824
 *
 * 2.1.88 ancestor mirrored: utils/swarm/permissionSync.ts (function names + flow). NOTE: v2.1.88's
 *   permissionSync used a FILE-based pending/resolved directory pair; v2.1.183 has fully moved to the
 *   MAILBOX-based approach (wUn/CUn write `permission_request`/`permission_response` control messages
 *   into the recipient's inbox via writeToMailbox). The file-based `getPendingDir`/`resolvePermission`
 *   surface from 88 is NOT present in the 183 bundle — only the mailbox path + the in-memory poller
 *   registry (`Olt`) survive. Reconstructed accordingly.
 *
 * scaffold doc: 30_agent_team/coordinator_and_background_survival.md (permission-bridge section);
 *               scout dossier §4; baseline v2.1.156 §6.
 *
 * cross-val (re-read in the 183 bundle): TUn @387641 throws if team/worker id/name missing and stamps
 *   `id = HTp()` (`perm-<ts>-<rand>`); wUn @387680 routes the request to `WBa(teamName)` (the team
 *   file's lead member name, defaulting to `np`="team-lead") via `$A` (writeToMailbox); Nlt @366492
 *   pops the callback from `Olt`, runs `onAllow(updatedInput, Jyp(permissionUpdates))` on "approved"
 *   else `onReject(feedback)`; Eso/Hso @366087/366099 are the verbatim control-message shapes.
 */

import { z } from 'zod/v4'

// ── carryover deps from sibling reconstructed files (ESM .js specifiers) ──────────────────────────
// 2.1.183: writeToMailbox = $A @365950
import { writeToMailbox } from '../teammateMailbox.js'
// 2.1.183: createPermissionRequestMessage = Eso @366087 ; createPermissionResponseMessage = Hso @366099
import {
  createPermissionRequestMessage,
  createPermissionResponseMessage,
} from '../teammateControlMessages.js'
// 2.1.183: TEAM_LEAD_NAME = np ("team-lead") @362636
import { TEAM_LEAD_NAME } from './constants.js'
// 2.1.183: getAgentId = VD @103450 ; getAgentName = ih @103455 ; getTeamName = zp @103460 ; getTeammateColor = fT @103514
// (88 ancestor permissionSync.ts imports these identity getters from '../teammate.js' = the identity module.)
import { getAgentId, getAgentName, getTeamName, getTeammateColor } from '../teammate.js'
// 2.1.183: readTeamFile (async) = Nhe @362824 (88 ancestor named it readTeamFileAsync in teamHelpers.ts;
// the reconstructed tree exports `readTeamFile` from the team-FILE module './teamHelpers.js').
import { readTeamFile } from './teamHelpers.js'

// ── deps outside this tree (referenced, not reconstructed here) ───────────────────────────────────
// 2.1.183: PermissionUpdateSchema (lazy) = $lt ; jsonStringify = Re ; logForDebugging = v ; logError = De
// Depth fix: from utils/swarm/, the genuine home (88: utils/permissions/PermissionUpdateSchema.ts)
// is '../permissions/…'; '../../permissions/…' escaped utils/ to a non-existent top-level dir.
import { permissionUpdateSchema } from '../permissions/PermissionUpdateSchema.js'
// Depth fix: from utils/swarm/, the genuine homes are utils/slowOperations.ts and utils/debug.ts,
// i.e. '../…'; the prior '../../…' escaped utils/ to non-existent top-level dirs.
import { jsonStringify } from '../slowOperations.js'
import { logForDebugging, logError } from '../debug.js'

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// SwarmPermissionRequest — built by the leader bridge for each teammate "ask".
// 2.1.183: shape from TUn @387641 (matches v2.1.88 SwarmPermissionRequestSchema, minus the resolve fields
//          that 88 stored in the file-based resolved/ dir — those live in the response message now).

export interface SwarmPermissionRequest {
  id: string
  workerId: string
  workerName: string
  workerColor?: string
  teamName: string
  toolName: string
  toolUseId: string
  description: string
  input: Record<string, unknown>
  permissionSuggestions: unknown[]
  createdAt: number
}

/** Resolution handed to a worker's response. */
export interface PermissionResolution {
  decision: 'approved' | 'rejected'
  feedback?: string
  updatedInput?: Record<string, unknown>
  permissionUpdates?: unknown[]
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Request id + builder.

// 2.1.183: generateRequestId = HTp @cli_inner_pretty.js:387638
export function generateRequestId(): string {
  return `perm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// 2.1.183: buildPermissionRequest = TUn @cli_inner_pretty.js:387641
// Mapping: e→params, t→teamName, n→workerId, r→workerName, o→workerColor
export function buildPermissionRequest(params: {
  toolName: string
  toolUseId: string
  input: Record<string, unknown>
  description: string
  permissionSuggestions?: unknown[]
  teamName?: string
  workerId?: string
  workerName?: string
  workerColor?: string
}): SwarmPermissionRequest {
  const teamName = params.teamName || getTeamName() // @387642
  const workerId = params.workerId || getAgentId()
  const workerName = params.workerName || getAgentName()
  const workerColor = params.workerColor || getTeammateColor()

  // @387646 — hard requirements; without these a request cannot be routed.
  if (!teamName) throw new Error('Team name is required for permission requests')
  if (!workerId) throw new Error('Worker ID is required for permission requests')
  if (!workerName) throw new Error('Worker name is required for permission requests')

  return {
    id: generateRequestId(),
    workerId,
    workerName,
    workerColor,
    teamName,
    toolName: params.toolName,
    toolUseId: params.toolUseId,
    description: params.description,
    input: params.input,
    permissionSuggestions: params.permissionSuggestions || [],
    createdAt: Date.now(),
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Leader lookup + mailbox send (leader-side worker→leader request, leader→worker response).

// 2.1.183: getLeaderName = WBa @cli_inner_pretty.js:387673
// Reads the team file; the leader's name is the member whose agentId === leadAgentId (default "team-lead").
export async function getLeaderName(teamName?: string): Promise<string | null> {
  const team = teamName || getTeamName()
  if (!team) return null
  const teamFile = await readTeamFile(team)
  if (!teamFile) {
    logForDebugging(`[PermissionSync] Team file not found for team: ${team}`)
    return null
  }
  // @387678
  return (
    teamFile.members.find((m: { agentId: string }) => m.agentId === teamFile.leadAgentId)?.name ||
    TEAM_LEAD_NAME
  )
}

// 2.1.183: publishPermissionRequestToLeader = wUn @cli_inner_pretty.js:387680
// Writes a `permission_request` control message into the leader's inbox.
export async function publishPermissionRequestToLeader(
  request: SwarmPermissionRequest,
): Promise<boolean> {
  const leaderName = await getLeaderName(request.teamName) // @387681
  if (!leaderName) {
    logForDebugging('[PermissionSync] Cannot send permission request: leader name not found')
    return false
  }
  try {
    // @387685 — Eso shape: {type:"permission_request", request_id, agent_id, tool_name, ...}
    const message = createPermissionRequestMessage({
      request_id: request.id,
      agent_id: request.workerName,
      tool_name: request.toolName,
      tool_use_id: request.toolUseId,
      description: request.description,
      input: request.input,
      permission_suggestions: request.permissionSuggestions,
    })
    // @387695 — deliver to the leader's mailbox (file- or in-process-routed by recipient).
    await writeToMailbox(
      leaderName,
      {
        from: request.workerName,
        text: jsonStringify(message),
        timestamp: new Date().toISOString(),
        color: request.workerColor,
      },
      request.teamName,
    )
    logForDebugging(
      `[PermissionSync] Sent permission request ${request.id} to leader ${leaderName} via mailbox`,
    )
    return true
  } catch (error) {
    logForDebugging(`[PermissionSync] Failed to send permission request via mailbox: ${error}`)
    logError(error)
    return false
  }
}

// 2.1.183: sendPermissionResponseToWorker = CUn @cli_inner_pretty.js:387706
// Leader-side: write a `permission_response` control message into the worker's inbox (from "team-lead").
export async function sendPermissionResponseToWorker(
  workerName: string,
  resolution: PermissionResolution,
  requestId: string,
  teamName?: string,
): Promise<boolean> {
  const team = teamName || getTeamName() // @387707
  if (!team) {
    logForDebugging('[PermissionSync] Cannot send permission response: team name not found')
    return false
  }
  try {
    // @387711 — Hso shape: success → {response:{updated_input,permission_updates}}, error → {error}
    const message = createPermissionResponseMessage({
      request_id: requestId,
      subtype: resolution.decision === 'approved' ? 'success' : 'error',
      error: resolution.feedback,
      updated_input: resolution.updatedInput,
      permission_updates: resolution.permissionUpdates,
    })
    // @387720 — note: `from` is the literal team-lead name (np), not the live agent name.
    await writeToMailbox(
      workerName,
      { from: TEAM_LEAD_NAME, text: jsonStringify(message), timestamp: new Date().toISOString() },
      team,
    )
    logForDebugging(
      `[PermissionSync] Sent permission response for ${requestId} to worker ${workerName} via mailbox`,
    )
    return true
  } catch (error) {
    logForDebugging(`[PermissionSync] Failed to send permission response via mailbox: ${error}`)
    logError(error)
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Poller callback registry. The leader bridge registers an {onAllow,onReject} pair under a request id;
// when the matching `permission_response` is found in the teammate's inbox, the poll loop calls
// resolvePermissionCallback(...) which fires the right callback and removes the entry.
// 2.1.183: registry maps Olt (permission), bUt (sandbox) @cli_inner_pretty.js:366526-366527

interface PermissionCallback {
  requestId: string
  toolUseId: string
  onAllow(
    updatedInput?: Record<string, unknown>,
    permissionUpdates?: unknown[],
    _unused?: unknown,
    contentBlocks?: unknown[],
  ): void
  onReject(feedback?: string, contentBlocks?: unknown[]): void
}

interface SandboxPermissionCallback {
  requestId: string
  resolve(allow: boolean): void
}

// 2.1.183: Olt = new Map() @366526 ; bUt = new Map() @366527
const permissionCallbacks = new Map<string, PermissionCallback>()
const sandboxPermissionCallbacks = new Map<string, SandboxPermissionCallback>()

// 2.1.183: registerPermissionCallback = wBn @cli_inner_pretty.js:366480
export function registerPermissionCallback(callback: PermissionCallback): void {
  permissionCallbacks.set(callback.requestId, callback)
  logForDebugging(`[SwarmPermissionPoller] Registered callback for request ${callback.requestId}`)
}

// 2.1.183: unregisterPermissionCallback = FDa @cli_inner_pretty.js:366483
export function unregisterPermissionCallback(requestId: string): void {
  permissionCallbacks.delete(requestId)
  logForDebugging(`[SwarmPermissionPoller] Unregistered callback for request ${requestId}`)
}

// 2.1.183: hasPermissionCallback = UDa @cli_inner_pretty.js:366486
export function hasPermissionCallback(requestId: string): boolean {
  return permissionCallbacks.has(requestId)
}

// 2.1.183: clearPermissionCallbacks = jDa @cli_inner_pretty.js:366489
export function clearPermissionCallbacks(): void {
  permissionCallbacks.clear()
  sandboxPermissionCallbacks.clear()
}

/** Parsed permission_response payload routed from the poll loop. */
export interface MailboxPermissionResponse {
  requestId: string
  decision: 'approved' | 'rejected'
  updatedInput?: Record<string, unknown>
  permissionUpdates?: unknown[]
  feedback?: string
}

// 2.1.183: resolvePermissionCallback = Nlt @cli_inner_pretty.js:366492
// Pops the registered callback and fires onAllow/onReject. Returns false if none was registered.
export function resolvePermissionCallback(response: MailboxPermissionResponse): boolean {
  const callback = permissionCallbacks.get(response.requestId)
  if (!callback) {
    logForDebugging(
      `[SwarmPermissionPoller] No callback registered for mailbox response ${response.requestId}`,
    )
    return false
  }
  logForDebugging(
    `[SwarmPermissionPoller] Processing mailbox response for request ${response.requestId}: ${response.decision}`,
  )
  permissionCallbacks.delete(response.requestId) // @366500
  if (response.decision === 'approved') {
    // @366500 — sanitize the "always allow" rules before applying.
    const updates = parseJsonPermissionUpdates(response.permissionUpdates)
    callback.onAllow(response.updatedInput, updates)
  } else {
    callback.onReject(response.feedback)
  }
  return true
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Permission-update sanitizer used by resolvePermissionCallback.

// 2.1.183: parseJsonPermissionUpdates = Jyp @cli_inner_pretty.js:366469
// Drops any malformed permissionUpdate entries (warn-logged), keeps the schema-valid ones.
export function parseJsonPermissionUpdates(raw: unknown): unknown[] {
  if (!Array.isArray(raw)) return []
  const schema = permissionUpdateSchema()
  const out: unknown[] = []
  for (const entry of raw) {
    const parsed = (schema as z.ZodTypeAny).safeParse(entry)
    if (parsed.success) out.push(parsed.data)
    else
      logForDebugging(
        `[SwarmPermissionPoller] Dropping malformed permissionUpdate entry: ${parsed.error.message}`,
        { level: 'warn' },
      )
  }
  return out
}
