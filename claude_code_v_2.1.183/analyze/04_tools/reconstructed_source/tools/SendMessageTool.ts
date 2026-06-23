/**
 * SendMessageTool — send a message to another agent (teammate, the main
 * conversation, or a resumable background subagent).
 *
 * Readable-source reconstruction of the v2.1.183 obfuscated tool object `p$p`
 * (the `pi({...})`-built SendMessage tool). Only available in agent-teams mode
 * (`isEnabled` → Sl()). The message payload is a discriminated union: either a
 * plain-text string (with a required UI `summary`) or a structured protocol frame
 * (shutdown_response / plan_approval_response, plus the originated shutdown_request).
 * Recipients are bare teammate names or the reserved `"main"` address; `@`-addresses
 * and broadcast (`"*"`) are rejected.
 *
 * 2.1.183 regions (cli_inner_pretty.js):
 *   - frame schema r$p @434541-434557; input schema o$p @434558-434567
 *   - request-id regex lza @434539; tool object p$p = pi({...}) @434568-434694+
 *   - prompt builder rza @434285-434313; description nza @434314
 *   - name const zh = "SendMessage" @221450; reserved address LY = "main" @362512
 *   - team-lead address np = "team-lead" @362636; ListAgents tool name Gtt = "ListAgents" @221577
 *   - team-mode gate Sl() @293831-293835
 * 2.1.88 convention mirror: src/tools/SendMessageTool/{SendMessageTool.ts,prompt.ts,constants.ts}
 * 2.1.156 scaffold: 04_tools/README.md (tool-assembly spine; readable names inherited)
 * Cross-validation: re-read 434285-434313, 434539-434699 in the 2.1.183 bundle;
 *   confirmed the 183 prompt dropped the `"*"` broadcast row and UDS rows (UDS_INBOX
 *   feature gated out → `${""}` placeholders), the broadcast/`@`/non-local-socket
 *   validation errors, and the `${Gtt}` = ListAgents address-list reference. Quoted
 *   every error/prompt string verbatim.
 */

import { z } from 'zod/v4'
import { buildTool, type Tool, type ToolDef } from '../Tool.js'
import type {
  ValidationResult,
  ToolResult,
  ToolUseContext,
} from '../Tool.js'
import type { PermissionDecision } from 'src/utils/permissions/PermissionResult.js'
import { lazySchema } from 'src/utils/lazySchema.js' // we() — lazy memoized schema thunk
import { coercedBoolean } from 'src/utils/schema.js' // n0() — coerced-boolean helper

// 2.1.183: SEND_MESSAGE_TOOL_NAME = zh @221450
export const SEND_MESSAGE_TOOL_NAME = 'SendMessage'

// The reserved address that routes to the main conversation.
// 2.1.183: MAIN_ADDRESS = LY = "main" @362512
const MAIN_ADDRESS = 'main'

// The team-lead address; only `shutdown_response` frames may be sent to it.
// 2.1.183: TEAM_LEAD_ADDRESS = np = "team-lead" @362636
const TEAM_LEAD_ADDRESS = 'team-lead'

// Tool name surfaced in the not-a-local-socket error: "Use an address from ListAgents."
// 2.1.183: LIST_AGENTS_TOOL_NAME = Gtt = "ListAgents" @221577
const LIST_AGENTS_TOOL_NAME = 'ListAgents'

// request_id must be a single non-empty line, max 200 chars.
// 2.1.183: REQUEST_ID_REGEX = lza = /^[^\n\r]{1,200}$/ @434539
const REQUEST_ID_REGEX = /^[^\n\r]{1,200}$/

/**
 * Agent-teams / teammate-mode gate. True only when teams are experimentally enabled
 * (or auto-detected) AND the `tengu_amber_flint` feature gate is on. Drives the whole
 * SendMessage surface — the tool is hidden outside team mode.
 * 2.1.183: agentTeamsEnabled = Sl() @293831-293835
 */
declare function agentTeamsEnabled(): boolean // Sl()

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

/**
 * Structured protocol-frame schema — a discriminated union on `type`.
 * 2.1.183: messageFrameSchema = r$p = we(() => H.discriminatedUnion("type", [...])) @434541-434557
 */
const messageFrameSchema = lazySchema(() =>
  z.discriminatedUnion('type', [
    // @434543
    z.object({
      type: z.literal('shutdown_request'),
      reason: z.string().optional(),
    }),
    // @434544-434549
    z.object({
      type: z.literal('shutdown_response'),
      request_id: z.string().regex(REQUEST_ID_REGEX, 'must be the request id being responded to'),
      approve: coercedBoolean(),
      reason: z.string().optional(),
    }),
    // @434550-434555
    z.object({
      type: z.literal('plan_approval_response'),
      request_id: z.string().regex(REQUEST_ID_REGEX, 'must be the request id being responded to'),
      approve: coercedBoolean(),
      feedback: z.string().optional(),
    }),
  ]),
)

// 2.1.183: inputSchema = o$p = we(() => H.object({...})) @434558-434567
export const inputSchema = lazySchema(() =>
  z.object({
    to: z.string().describe('Recipient: teammate name'), // @434560
    summary: z
      .string()
      .max(200)
      .optional()
      // @434561-434564 — verbatim
      .describe('A 5-10 word summary shown as a preview in the UI (required when message is a string)'),
    message: z.union([
      z.string().describe('Plain text message content'), // @434565
      messageFrameSchema(),
    ]),
  }),
)
type InputSchema = ReturnType<typeof inputSchema>

// ---------------------------------------------------------------------------
// Description + prompt (verbatim from bundle)
// ---------------------------------------------------------------------------

// 2.1.183: DESCRIPTION = nza @434314 — verbatim.
export const DESCRIPTION = 'Send a message to another agent'

/**
 * 2.1.183: getPrompt = rza @434285-434313 — verbatim, `.trim()`-ed.
 * NOTE: the two `${""}` placeholders in the bundle are the UDS_INBOX feature gate
 * compiling to empty strings (the broadcast `"*"` row and the cross-session section
 * are both gated out in 2.1.183), so this single static form is the live text.
 */
export function getPrompt(): string {
  return `
# SendMessage

Send a message to another agent.

\`\`\`json
{"to": "researcher", "summary": "assign task 1", "message": "start on task #1"}
\`\`\`

| \`to\` | |
|---|---|
| \`"researcher"\` | Teammate by name |
| \`"main"\` | The main conversation (background subagents only) |

Your plain text output is NOT visible to other agents — to communicate, you MUST call this tool. Messages from teammates are delivered automatically; you don't check an inbox. Refer to active teammates by name; to resume a completed background agent, use the \`agentId\` (format \`a...-...\`) from its spawn result. When relaying, don't quote the original — it's already rendered to the user.

## Protocol responses (legacy)

If you receive a JSON message with \`type: "shutdown_request"\` or \`type: "plan_approval_request"\`, respond with the matching \`_response\` type — echo the \`request_id\`, set \`approve\` true/false:

\`\`\`json
{"to": "team-lead", "message": {"type": "shutdown_response", "request_id": "...", "approve": true}}
{"to": "researcher", "message": {"type": "plan_approval_response", "request_id": "...", "approve": false, "feedback": "add error handling"}}
\`\`\`

Approving shutdown terminates your process. Rejecting plan sends the teammate back to revise. Don't originate \`shutdown_request\` unless asked. Don't send structured JSON status messages — use TaskUpdate.
`.trim()
}

// ---------------------------------------------------------------------------
// Tool object
// ---------------------------------------------------------------------------

// 2.1.183: SendMessageTool = p$p = pi({...}) @434568-434694+
export const SendMessageTool: Tool<InputSchema> = buildTool({
  name: SEND_MESSAGE_TOOL_NAME, // @434569
  searchHint: 'send messages to agent teammates', // @434570
  maxResultSizeChars: 100_000, // @434571 — 1e5

  userFacingName() {
    return 'SendMessage' // @434572-434574
  },

  get inputSchema(): InputSchema {
    return inputSchema()
  },
  shouldDefer: true, // @434578

  // @434579-434581 — only available in agent-teams mode.
  isEnabled(): boolean {
    return agentTeamsEnabled()
  },

  // @434582-434584 — plain-text sends are read-only; structured protocol frames
  // (shutdown / plan responses) mutate teammate lifecycle and are NOT read-only.
  isReadOnly(input): boolean {
    return typeof input.message === 'string'
  },

  /**
   * backfillObservableInput — @434585-434596. Mutates the input in place to add the
   * observable fields the UI / telemetry consume (type, recipient, content, plus
   * request_id/approve for frames). String messages become `type:"message"`;
   * structured frames copy their own `type` and project reason/feedback → content.
   */
  backfillObservableInput(input: any): void {
    if ('type' in input) return
    if (typeof input.to !== 'string') return
    if (typeof input.message === 'string') {
      input.type = 'message'
      input.recipient = input.to
      input.content = input.message
    } else if (typeof input.message === 'object' && input.message !== null) {
      const frame = input.message
      input.type = frame.type
      input.recipient = input.to
      if (frame.request_id !== undefined) input.request_id = frame.request_id
      if (frame.approve !== undefined) input.approve = frame.approve
      const content = frame.reason ?? frame.feedback
      if (content !== undefined) input.content = content
    }
  },

  /**
   * toAutoClassifierInput — @434597-434607. A compact classifier string per payload
   * kind (`to X: msg`, `shutdown_request to X`, `shutdown_response approve/reject id`,
   * `plan_approval approve/reject to X`).
   */
  toAutoClassifierInput(input): string {
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

  // @434608-434610 — always allowed (gating is handled by isEnabled + validateInput).
  async checkPermissions(input): Promise<PermissionDecision> {
    return { behavior: 'allow', updatedInput: input }
  },

  /**
   * validateInput — @434611-434683. All failures use errorCode 9. Error strings are
   * quoted verbatim. Order matters: address shape is checked first, then string-vs-frame
   * payload rules.
   */
  async validateInput(input): Promise<ValidationResult> {
    // @434612 — empty recipient.
    if (input.to.trim().length === 0) {
      return { result: false, message: 'to must not be empty', errorCode: 9 }
    }
    // @434613-434618 — broadcast was removed.
    if (input.to === '*') {
      return {
        result: false,
        message: 'broadcast (to: "*") is no longer supported — send a message per recipient',
        errorCode: 9,
      }
    }

    // @434619-434627 — address parsing. `bridge:`/`uds:` schemes require a non-empty
    // target; otherwise the bare name must be a valid local socket address.
    const address = parseAgentAddress(input.to) // LLa(e.to)
    if ((address.scheme === 'bridge' || address.scheme === 'uds') && address.target.trim().length === 0) {
      return { result: false, message: 'address target must not be empty', errorCode: 9 }
    }
    if (!isLocalSocketAddress(address.target) || !isLocalSocketAddress(input.to)) {
      return {
        result: false,
        message: `'${input.to}' is not a local socket address. Use an address from ${LIST_AGENTS_TOOL_NAME}.`,
        errorCode: 9,
      }
    }

    // @434628-434633 — `@`-addresses are rejected; the session has a single team.
    if (input.to.includes('@')) {
      return {
        result: false,
        message: 'to must be a bare teammate name — there is only one team per session',
        errorCode: 9,
      }
    }

    // ---- String (plain-text) message rules ----
    if (typeof input.message === 'string') {
      // @434635-434636 — summary is mandatory for plain text.
      if (!input.summary || input.summary.trim().length === 0) {
        return { result: false, message: 'summary is required when message is a string', errorCode: 9 }
      }
      // @434637-434643 — the text must not itself be a teammate protocol frame; to
      // respond to a plan/shutdown request the structured object form is required.
      if (looksLikeProtocolFrame(input.message)) {
        return {
          result: false,
          message:
            'message text must not be a teammate protocol frame (permission/mode/plan/shutdown JSON) — to respond to a plan or shutdown request, use the structured object form ({"message": {"type": ...}}); otherwise send plain text',
          errorCode: 9,
        }
      }
      // @434644-434665 — nor a lifecycle/task frame (idle/terminated/task/shutdown JSON).
      try {
        const parsed = safeJsonParse(input.message)
        if (
          parsed !== null &&
          typeof parsed === 'object' &&
          'type' in parsed &&
          typeof (parsed as any).type === 'string' &&
          [
            'idle_notification',
            'teammate_terminated',
            'task_assignment',
            'task_completed',
            'shutdown_rejected',
          ].includes((parsed as any).type)
        ) {
          return {
            result: false,
            message:
              'message text must not be a teammate lifecycle/task frame (idle/terminated/task/shutdown JSON) — send plain text instead',
            errorCode: 9,
          }
        }
      } catch {
        // not JSON — fine, it's plain text.
      }
      return { result: true } // @434666
    }

    // ---- Structured shutdown_response rules ----
    // @434668-434669 — must be addressed to the team lead.
    if (input.message.type === 'shutdown_response' && input.to !== TEAM_LEAD_ADDRESS) {
      return { result: false, message: `shutdown_response must be sent to "${TEAM_LEAD_ADDRESS}"`, errorCode: 9 }
    }
    // @434670-434676 — an approval carries no reason (silent confirmation).
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
    // @434677-434682 — a rejection must carry a reason.
    if (
      input.message.type === 'shutdown_response' &&
      !input.message.approve &&
      (!input.message.reason || input.message.reason.trim().length === 0)
    ) {
      return { result: false, message: 'reason is required when rejecting a shutdown request', errorCode: 9 }
    }

    return { result: true } // @434683
  },

  async description() {
    return DESCRIPTION // @434685-434687
  },
  async prompt() {
    return getPrompt() // @434688-434690 — rza()
  },

  /**
   * mapToolResultToToolResultBlockParam — @434691-434693. Wraps the result (a
   * `{success, message}` shape) as a single text block (`Re(e)` formats it).
   */
  mapToolResultToToolResultBlockParam(result, toolUseID) {
    return {
      tool_use_id: toolUseID,
      type: 'tool_result' as const,
      content: [{ type: 'text' as const, text: jsonStringify(result) }],
    }
  },

  /**
   * call — @434694-434790+. Behavior summary (source-anchored):
   *
   * Sender identity (@434695-434698): `senderTaskId = context.agentId`; resolve the
   * sender name via `cza(context, senderTaskId)`; the message origin is a `peer`
   * (`{kind:"peer", from, senderTaskId}`) when both are known, else `coordinator`.
   * A plain-text message from a known sender is wrapped via `lDa(sender, text)`.
   *
   *   1. to === "main" (@434699-434719):
   *      - If the caller IS the main conversation (no agentId) → fail:
   *        `You are the main conversation — "main" addresses you. Send to a named agent instead.`
   *      - Else enqueue into main's NEXT turn (priority:"next", isMeta:true,
   *        skipSlashCommands:true) and return
   *        `{ success:true, message:"Message queued for the main conversation's next turn." }`.
   *
   *   2. Named recipient (@434720-434790+): resolve the recipient agentId from, in
   *      order, the team roster (teamContext.teammates by name), the agentNameRegistry,
   *      then `tUo(to)`. With a resolved recipient that has a live task:
   *        - status "running" → enqueue (`gWe(...)`) →
   *          `Message queued for delivery to ${to} at its next tool round.`
   *        - stopped/finished → resume it in the background (`dLe({agentId, prompt, ...})`)
   *          → `Agent "${to}" was stopped (${status}); resumed it in the background with
   *             your message. You'll be notified when it finishes. Output: ${outputFile}`
   *          (on resume failure →
   *           `Agent "${to}" is stopped (${status}) and could not be resumed: ${err}`).
   *      Already-running teammates (resolved via the team mailbox) get the message
   *      queued for their next turn (`$A(...)`) →
   *        `Teammate "${to}" is already running; queued your message for its next turn.`
   *
   * helper: cza @434696 — resolve sender display name from agentId.
   * helper: lDa @434698 — wrap a plain-text peer message with sender attribution.
   * helper: gWe @434731 — enqueue into a running task's mailbox.
   * helper: dLe @434735 — resume a stopped/finished agent in the background.
   * helper: $A @434764 — deliver into a teammate's team mailbox.
   */
  async call(input, context, canUseTool, requestContext?): Promise<ToolResult<any>> {
    // Summarized — see the behavior contract above. The load-bearing branch is the
    // `to === "main"` reserved-address route vs. named-recipient resolution+delivery;
    // both are reconstructed at contract level and re-verified against @434694-434790
    // of the 2.1.183 bundle.
    throw new Error('reconstructed contract — see call() behavior summary above')
  },

  // renderToolUseMessage, renderToolResultMessage follow (SendMessage.md property keys).
} satisfies ToolDef<InputSchema>)

// ---------------------------------------------------------------------------
// Helper declarations (summarized — bundle-anchored, not reconstructed here)
// ---------------------------------------------------------------------------

declare function parseAgentAddress(to: string): { scheme: string; target: string } // LLa(e.to)
declare function isLocalSocketAddress(value: string): boolean // Lhe(...)
declare function looksLikeProtocolFrame(text: string): boolean // iF(e.message)
declare function safeJsonParse(text: string): unknown // Gt(e.message)
declare function jsonStringify(result: unknown): string // Re(e)
