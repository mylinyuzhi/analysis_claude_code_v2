/**
 * Leader-side Permission Bridge for teammate tool calls (CARRYOVER, v2.1.156 → v2.1.183).
 *
 * 2.1.183 source regions covered:
 *   - createTeammateCanUseTool (eDp)            @cli_inner_pretty.js:420713-420863
 *   - eDp call-site (in-process runner)         @cli_inner_pretty.js:421155-421162
 *   - leader-name lookup (WBa / getLeaderName)  @cli_inner_pretty.js:387672-387678
 *   - request descriptor builder (TUn)          @cli_inner_pretty.js:387641-387667
 *   - publish-to-leader-mailbox (wUn)           @cli_inner_pretty.js:387680-387704
 *   - poller registry (wBn/FDa/Nlt)             @cli_inner_pretty.js:366480-366505
 *   - mailbox read/parse/mark-read (Fhe/I4e/aUt)@cli_inner_pretty.js:365930, 366121, 365977
 *   - verbatim denial messages (Wte/Mjt)        @cli_inner_pretty.js:590318, 590322
 *
 * 2.1.88 ancestor mirrored (shape + carryover logic):
 *   - utils/swarm/leaderPermissionBridge.ts  (the module-level setter registry — see note below)
 *   - utils/swarm/permissionSync.ts          (getLeaderName, request schema, mailbox request/response)
 *   The 88 `leaderPermissionBridge.ts` is ONLY the setToolUseConfirmQueue / setToolPermissionContext
 *   registry; in v2.1.183 that registry is the `clo` slot read by `jBa()` (getLeaderSetToolPermissionContext).
 *   The actual leader-side per-call `canUseTool` factory lives in the in-process runner module (`eDp`)
 *   — that is what this unit reconstructs, plus the permissionSync mailbox round-trip it drives.
 *
 * scaffold doc: 30_agent_team/coordinator_and_background_survival.md (permission-bridge section);
 *               scout dossier §4 "Permission bridge"; baseline v2.1.156 §6.
 *
 * cross-val (re-read in the 183 bundle): `eDp` body @420713-420862 confirms the two-path design —
 *   (1) if `i.requestDialog` is set (leader is interactive) show an interactive ToolUseConfirm dialog;
 *   (2) otherwise round-trip a permission_request control message through the leader's mailbox and
 *   poll the *teammate's own* inbox every `ZLp` (=500ms) for a `permission_response` whose
 *   `request_id` matches, accepting it ONLY when `k.from === np` ("team-lead"). Verbatim denial
 *   strings re-read @590318/590322. `Kut(o,s,i,a,l,void 0,r)` is the base permission evaluator;
 *   the teammate path only kicks in when its `behavior === "ask"`.
 */

// ── carryover deps from sibling reconstructed files (ESM .js specifiers) ──────────────────────────
// 2.1.183: readMailbox = Fhe @365930 ; markSingleMessageAsRead = aUt @365977
import { readMailbox, markSingleMessageAsRead } from '../teammateMailbox.js'
// 2.1.183: parsePermissionResponse = I4e @366121 (Gt(text) where type==="permission_response").
// In the reconstructed tree the control-message parser is `isPermissionResponse`.
import { isPermissionResponse } from '../teammateControlMessages.js'
// 2.1.183: TEAM_LEAD_NAME = np ("team-lead") @362636
import { TEAM_LEAD_NAME } from './constants.js'
// 2.1.183: IN_PROCESS_POLL_MS = ZLp (=500) @421380
import { IN_PROCESS_POLL_MS } from './constants.js'

// ── deps that live OUTSIDE the agent-team tree (referenced, not reconstructed here) ────────────────
// 2.1.183: evaluatePermission = Kut @585853 (base permission evaluator; returns allow/ask/deny)
// 2.1.183:   reEvaluatePermission = qx @585852 = Kut(...,/*onAsk*/void 0)  (used by the policy-change re-check)
// 2.1.183: getToolPermissionContext = Br @460389
// 2.1.183: applyPermissionUpdates = mG @233489 ; mergePermissionContext = n1 @233427
// 2.1.183: getLeaderSetToolPermissionContext = jBa @387631 (returns module slot `clo`, or null)
// 2.1.183: buildPermissionDialog = Wut @420653 (routes to the right dialog/descriptor)
// 2.1.183: policyChangeNotifier = Kse @149350 (= ca() @181: {subscribe,emit,clear})
// 2.1.183: buildPermissionRequest = TUn @387641 ; publishPermissionRequestToLeader = wUn @387680
// 2.1.183: registerPermissionCallback = wBn @366480 ; unregisterPermissionCallback = FDa @366483
// 2.1.183: resolvePermissionCallback = Nlt @366492
// 2.1.183: logForDebugging = v ; logError = De ; isAbortError = gy @8819
import {
  evaluatePermission,
  reEvaluatePermission,
  getToolPermissionContext,
  applyPermissionUpdates,
  mergePermissionContext,
  getLeaderSetToolPermissionContext,
  buildPermissionDialog,
  policyChangeNotifier,
} from '../permissions/permissionEngine.js'
import {
  buildPermissionRequest,
  publishPermissionRequestToLeader,
  registerPermissionCallback,
  unregisterPermissionCallback,
  resolvePermissionCallback,
} from './permissionSync.js'
// Depth fix: from utils/swarm/, the genuine debug home (utils/debug.ts) is '../debug.js'; the prior
// '../../debug.js' escaped utils/. permissionEngine.js (an out-of-scope consolidation of the bundle's
// scattered permission helpers) is homed under utils/permissions/ to match the real permission layer.
import { logForDebugging, logError, isAbortError } from '../debug.js'

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Verbatim denial messages (byte-exact from the bundle).
// 2.1.183: PERMISSION_DENIED_MESSAGE = Wte @cli_inner_pretty.js:590318
const PERMISSION_DENIED_MESSAGE =
  'Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). Try a different approach or report the limitation to complete your task.'

// 2.1.183: USER_DENIED_PREFIX = Mjt @cli_inner_pretty.js:590322 (note: ends with a trailing newline)
const USER_DENIED_PREFIX =
  'Permission for this tool use was denied. The tool use was rejected (eg. if it was a file edit, the new_string was NOT written to the file). The user said:\n'

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Types (shapes inferred from the bundle — `// UNVERIFIED` where the exact field set is not pinned).

/** Identity of the teammate (worker) whose tool calls are being bridged. */
export interface TeammateIdentity {
  agentId: string
  agentName: string
  /** Optional teammate color used for the worker badge / mailbox metadata. */
  color?: string
  teamName: string
}

/** Result returned to the agent loop's `canUseTool` contract. */
export type PermissionDecision =
  | {
      behavior: 'allow'
      updatedInput?: Record<string, unknown>
      userModified?: boolean
      acceptFeedback?: string
      contentBlocks?: unknown[]
    }
  | {
      behavior: 'ask'
      message: string
      contentBlocks?: unknown[]
    }
  | { behavior: 'deny'; message?: string; decideLocation?: string }

/** Pause-duration sink: receives ms spent waiting on a permission dialog so the */
/** teammate's `totalPausedMs` can be accumulated (so idle timeouts don't fire while parked). */
type PauseDurationSink = (elapsedMs: number) => void

/** Classifier-approvals updater (param 4 = `p0e(_)` @383728); forwarded into the engine. */
type ClassifierApprovalUpdater = unknown

// ─────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * Build the leader-side `canUseTool` closure used by an in-process teammate's agent loop.
 *
 * Returned closure signature mirrors the standard `canUseTool` contract:
 *   (tool, input, toolUseContext, assistantMessage, toolUseID, preEvaluated?) => PermissionDecision
 *
 * 2.1.183: createTeammateCanUseTool = eDp @cli_inner_pretty.js:420713
 *   call-site @421155: eDp(t /*teammate*\/, V /*abort*\/, (Δ)=>totalPausedMs+=Δ, p0e(_))
 *
 * Mapping (eDp params): e→teammate, t→abortController, n→onPauseMs, r→classifierApprovalUpdater
 * Mapping (closure params): o→tool, s→input, i→toolUseContext, a→assistantMessage, l→toolUseID, c→preEvaluated
 */
export function createTeammateCanUseTool(
  teammate: TeammateIdentity,
  abortController: AbortController,
  onPauseMs: PauseDurationSink,
  classifierApprovalUpdater: ClassifierApprovalUpdater,
) {
  return async (
    tool: any,
    input: Record<string, unknown>,
    toolUseContext: any,
    assistantMessage: any,
    toolUseID: string,
    preEvaluated?: PermissionDecision,
    // Return type allows `undefined`: the interactive-dialog arm's switch (@420786) has no
    // trailing return, so eDp can return undefined when result.behavior matches no case.
  ): Promise<PermissionDecision | undefined> => {
    // @420715 — use the caller's pre-evaluated decision if present, else run the base evaluator.
    // Kut(o,s,i,a,l,void 0,r): the trailing `r` is the classifier-approvals updater; the `void 0`
    // slot is the "onAsk" callback (omitted here — we handle "ask" ourselves below).
    const decision: PermissionDecision =
      preEvaluated ??
      (await evaluatePermission(
        tool,
        input,
        toolUseContext,
        assistantMessage,
        toolUseID,
        undefined,
        classifierApprovalUpdater,
      ))

    // @420716 — only "ask" needs the bridge; allow/deny short-circuit straight back to the loop.
    if (decision.behavior !== 'ask') return decision

    // @420717 — honor any input the evaluator already normalized.
    const effectiveInput =
      (decision as { updatedInput?: Record<string, unknown> }).updatedInput ?? input

    // @420718 — bail to a soft "ask"/denied result if the turn was aborted mid-evaluation.
    if (abortController.signal.aborted)
      return { behavior: 'ask', message: PERMISSION_DENIED_MESSAGE }

    // @420719 — compute the human-readable tool description shown in the dialog / mailbox request.
    const permissionContext = getToolPermissionContext(toolUseContext)
    const description = await tool.description(effectiveInput, {
      isNonInteractiveSession: toolUseContext.options.isNonInteractiveSession,
      toolPermissionContext: permissionContext,
      tools: toolUseContext.options.tools,
    })

    // @420725 — re-check abort after the (possibly async / remote) description build.
    if (abortController.signal.aborted)
      return { behavior: 'ask', message: PERMISSION_DENIED_MESSAGE }

    // @420726 — branch: is the leader interactive (has a `requestDialog`)?
    const requestDialog = toolUseContext.requestDialog
    if (requestDialog) {
      return await askViaInteractiveDialog({
        tool,
        input,
        effectiveInput,
        toolUseContext,
        assistantMessage,
        toolUseID,
        decision,
        description,
        permissionContext,
        teammate,
        abortController,
        onPauseMs,
        requestDialog,
      })
    }

    // @420791 — non-interactive leader: round-trip a control message through the mailbox.
    return await askViaMailboxRoundTrip({
      tool,
      effectiveInput,
      decision,
      description,
      toolUseID,
      teammate,
      abortController,
    })
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// PATH 1 — interactive leader dialog (@420727-420790).
// Shows the standard ToolUseConfirm dialog with the teammate's worker badge. While the dialog is
// open, it subscribes to the policy-change notifier: if an "always allow" rule that now covers this
// tool use is added elsewhere, it auto-resolves the dialog (re-running `reEvaluatePermission`).
// ─────────────────────────────────────────────────────────────────────────────────────────────────

interface InteractiveAskArgs {
  tool: any
  input: Record<string, unknown>
  effectiveInput: Record<string, unknown>
  toolUseContext: any
  assistantMessage: any
  toolUseID: string
  decision: PermissionDecision
  description: string
  permissionContext: unknown
  teammate: TeammateIdentity
  abortController: AbortController
  onPauseMs: PauseDurationSink
  requestDialog: (dialog: unknown, descriptor: unknown, opts: { signal: AbortSignal }) => Promise<any>
}

// 2.1.183: (inline arm of eDp) interactive dialog path @cli_inner_pretty.js:420727-420790
// Return type includes `undefined`: the bundle's switch over result.behavior has NO trailing
// return after it (@420786), so a non-matching behavior falls through and the function returns
// undefined. Faithfully preserved rather than inventing a default-deny.
async function askViaInteractiveDialog(args: InteractiveAskArgs): Promise<PermissionDecision | undefined> {
  const {
    tool,
    input,
    effectiveInput,
    toolUseContext,
    assistantMessage,
    toolUseID,
    decision,
    description,
    permissionContext,
    teammate,
    abortController,
    onPauseMs,
    requestDialog,
  } = args

  // @420728 — render the worker badge (name + color) so the leader sees who is asking.
  const workerBadge = teammate.color ? { name: teammate.agentName, color: teammate.color } : undefined

  // @420729 — build the dialog + descriptor (file-edit diff, bash command, generic, etc.).
  const { dialog, descriptor } = await buildPermissionDialog({
    tool,
    input: effectiveInput,
    description,
    toolUseID,
    permissionResult: decision,
    assistantMessage,
    theme: 'dark',
    toolPermissionContext: permissionContext,
    workerBadge,
  })

  // @420740 — abort re-check after the (async) dialog build.
  if (abortController.signal.aborted)
    return { behavior: 'ask', message: PERMISSION_DENIED_MESSAGE }

  // @420741 — track time-on-dialog so the teammate's totalPausedMs can be advanced on exit.
  const startedAt = Date.now()

  // @420742 — a child AbortController so a background "now allowed" resolution can cancel the dialog.
  const dialogAbort = new AbortController()
  const onParentAbort = () => dialogAbort.abort()
  abortController.signal.addEventListener('abort', onParentAbort, { once: true })

  // @420745 — auto-resolve hook: when permission policy changes, re-evaluate; if it is now "allow",
  // capture that decision and cancel the open dialog so we don't keep blocking on the user.
  let autoResolved: PermissionDecision | undefined
  // @420746
  const unsubscribePolicyChange = policyChangeNotifier.subscribe(() => {
    if (autoResolved !== undefined) return
    reEvaluatePermission(tool, input, toolUseContext, assistantMessage, toolUseID)
      .then((reEvaluated: PermissionDecision) => {
        // @420750 — only act on a fresh, now-allowed decision.
        if (autoResolved !== undefined || reEvaluated.behavior !== 'allow') return
        autoResolved = {
          ...reEvaluated,
          updatedInput:
            (reEvaluated as { updatedInput?: Record<string, unknown> }).updatedInput ?? input,
          userModified: false,
        }
        dialogAbort.abort() // @420751 — close the dialog; the "cancelled" arm below returns autoResolved.
      })
      .catch((err: unknown) => {
        // @420753 — swallow benign aborts; report everything else.
        if (!isAbortError(err)) logError(err)
      })
  })

  try {
    // @420758 — present the dialog and await the user's decision (or auto-resolution abort).
    const result = await requestDialog(dialog, descriptor, { signal: dialogAbort.signal })
    switch (result.behavior) {
      case 'allow': {
        // @420760
        const { updatedInput, permissionUpdates, feedback, contentBlocks } = result
        // @420762 — apply any "always allow" rules the user selected, then persist them on the
        // leader's permission context (preserving its mode) so future calls don't re-ask.
        applyPermissionUpdates(permissionUpdates ?? [])
        if (permissionUpdates && permissionUpdates.length > 0) {
          const setLeaderContext = getLeaderSetToolPermissionContext()
          if (setLeaderContext) {
            const merged = mergePermissionContext(
              getToolPermissionContext(toolUseContext),
              permissionUpdates,
            )
            setLeaderContext(merged, { preserveMode: true }) // @420766
          }
        }
        const acceptFeedback = feedback?.trim()
        return {
          behavior: 'allow',
          updatedInput,
          userModified: false,
          acceptFeedback: acceptFeedback || undefined,
          ...(contentBlocks && contentBlocks.length > 0 && { contentBlocks }),
        }
      }
      case 'deny': {
        // @420778 — a user "deny" maps to an "ask" result carrying the user's feedback (so the
        // model is told what to do instead, not hard-denied).
        const { feedback, contentBlocks } = result
        return {
          behavior: 'ask',
          message: feedback ? `${USER_DENIED_PREFIX}${feedback}` : PERMISSION_DENIED_MESSAGE,
          contentBlocks,
        }
      }
      case 'cancelled': {
        // @420782 — if the dialog was cancelled BY the auto-resolution, return that allow decision;
        // otherwise it was a real cancel → treat as denied.
        if (autoResolved !== undefined) return autoResolved
        return { behavior: 'ask', message: PERMISSION_DENIED_MESSAGE }
      }
    }
    // @420786-420787 — the switch's `}` falls straight into `finally`. A non-matching
    // result.behavior returns undefined (the bundle adds NO trailing return here).
  } finally {
    // @420788 — always: unsubscribe, detach the parent-abort listener, and report paused ms.
    unsubscribePolicyChange()
    abortController.signal.removeEventListener('abort', onParentAbort)
    onPauseMs(Date.now() - startedAt)
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// PATH 2 — non-interactive leader: mailbox round-trip (@420791-420861).
// Publishes a `permission_request` control message to the LEADER's inbox, then polls the TEAMMATE's
// OWN inbox every ZLp ms for a `permission_response` matching this request id. A response is honored
// only when it comes from the team-lead (`np`). The poller resolves the outer Promise via the
// callback registered with `registerPermissionCallback` (wBn) / `resolvePermissionCallback` (Nlt).
// ─────────────────────────────────────────────────────────────────────────────────────────────────

interface MailboxAskArgs {
  tool: any
  effectiveInput: Record<string, unknown>
  decision: PermissionDecision
  description: string
  toolUseID: string
  teammate: TeammateIdentity
  abortController: AbortController
}

// 2.1.183: (inline arm of eDp) mailbox round-trip path @cli_inner_pretty.js:420791-420861
function askViaMailboxRoundTrip(args: MailboxAskArgs): Promise<PermissionDecision> {
  const { tool, effectiveInput, decision, description, toolUseID, teammate, abortController } = args

  return new Promise<PermissionDecision>((resolve) => {
    // @420792 — build the SwarmPermissionRequest descriptor (id, worker identity, tool/input, etc.).
    const request = buildPermissionRequest({
      toolName: tool.name,
      toolUseId: toolUseID,
      input: effectiveInput,
      description,
      permissionSuggestions: (decision as { suggestions?: unknown[] }).suggestions,
      workerId: teammate.agentId,
      workerName: teammate.agentName,
      workerColor: teammate.color,
      teamName: teammate.teamName,
    })

    // @420803 — register the resolve callbacks under the request id, keyed for the poller below.
    registerPermissionCallback({
      requestId: request.id,
      toolUseId: toolUseID,
      // @420806 — leader approved: stop polling, apply rules, resolve "allow".
      onAllow(updatedInput?: Record<string, unknown>, permissionUpdates?: unknown[], _t?: unknown, contentBlocks?: unknown[]) {
        // @420807 — bundle calls `mG(S)` directly (no `?? []`); preserve byte-for-byte behavior.
        cleanup()
        applyPermissionUpdates(permissionUpdates as unknown[])
        const finalInput =
          updatedInput && Object.keys(updatedInput).length > 0 ? updatedInput : effectiveInput
        resolve({
          behavior: 'allow',
          updatedInput: finalInput,
          userModified: false,
          ...(contentBlocks && contentBlocks.length > 0 && { contentBlocks }),
        })
      },
      // @420811 — leader rejected: stop polling, resolve "ask" carrying any feedback.
      onReject(feedback?: string, contentBlocks?: unknown[]) {
        cleanup()
        const message = feedback ? `${USER_DENIED_PREFIX}${feedback}` : PERMISSION_DENIED_MESSAGE
        resolve({ behavior: 'ask', message, contentBlocks })
      },
    })

    // @420817 — publish the request control message into the LEADER's mailbox.
    publishPermissionRequestToLeader(request)

    // @420818 — poll the TEAMMATE's OWN inbox for the matching permission_response.
    const pollHandle = setInterval(
      async (
        abort: AbortController,
        stop: () => void,
        settle: (d: PermissionDecision) => void,
        worker: TeammateIdentity,
        req: { id: string },
      ) => {
        // @420820 — if the turn aborted, stop and resolve "ask"/denied.
        if (abort.signal.aborted) {
          stop()
          settle({ behavior: 'ask', message: PERMISSION_DENIED_MESSAGE })
          return
        }
        // @420824 — read all messages addressed to this teammate.
        const messages = await readMailbox(worker.agentName, worker.teamName)
        for (const msg of messages) {
          if (!msg || msg.read) continue // @420826
          const parsed = isPermissionResponse(msg.text) // @420827 (I4e: type==="permission_response")
          if (parsed && parsed.request_id === req.id) {
            // @420829 — consume the message, then gate on sender identity.
            await markSingleMessageAsRead(worker.agentName, worker.teamName, msg)
            if (msg.from !== TEAM_LEAD_NAME) {
              // @420830 — security: ONLY the team-lead may answer a permission request.
              logForDebugging(
                `[InProcessRunner] Ignoring permission response from non-team-lead: ${msg.from}`,
                { level: 'warn' },
              )
              continue
            }
            // @420835 — hand the parsed response to the registered callback (onAllow/onReject).
            if (parsed.subtype === 'success') {
              resolvePermissionCallback({
                requestId: parsed.request_id,
                decision: 'approved',
                updatedInput: parsed.response?.updated_input,
                permissionUpdates: parsed.response?.permission_updates,
              })
            } else {
              // @420842
              resolvePermissionCallback({
                requestId: parsed.request_id,
                decision: 'rejected',
                feedback: parsed.error,
              })
            }
            return
          }
        }
      },
      IN_PROCESS_POLL_MS, // @420847 — ZLp = 500ms
      abortController,
      cleanup,
      resolve,
      teammate,
      request,
    )

    // @420854 — parent-abort handler: stop polling and resolve "ask"/denied.
    const onAbort = () => {
      cleanup()
      resolve({ behavior: 'ask', message: PERMISSION_DENIED_MESSAGE })
    }
    abortController.signal.addEventListener('abort', onAbort, { once: true })

    // @420858 — single cleanup: clear interval, unregister the callback, detach abort listener.
    function cleanup(): void {
      clearInterval(pollHandle)
      unregisterPermissionCallback(request.id)
      abortController.signal.removeEventListener('abort', onAbort)
    }
  })
}
