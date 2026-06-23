// ============================================================================
// attachments.ts — the attachment GENERATOR POOL + the API-NORMALIZE DISPATCHER
// Readable-source reconstruction of Claude Code v2.1.183
// ============================================================================
//
// 2.1.183 regions covered (cli_inner_pretty.js, 699,346 lines):
//   • collectAttachments            ctl  @464606-464692   (generator pool + master gate + 2 waves)
//   • runAttachmentGenerator        BA   @464693-464715   (per-generator try/catch + 5% telemetry)
//   • getQueuedCommandAttachments   oGt  @464716-464751   (the only gen surviving the master gate)
//   • normalizeAttachmentForAPI     PWn  @589204-589607   (3-tier team-exit / map / switch dispatcher)
//   • PER_TYPE_RENDERERS            ONl  @590431-590642   (flat per-type renderer map)
//   • AMBIENT_CONTEXT_TRAILER       _7n  @590353-590354
//   • cadence configs               rGt/Hho/itl/atl/ltl @466059-466063 (+ export aliases @464595-464599)
//   • queuedModesSet                J3p  @466064
//   • agent_listing_delta gen ref   TLe  @464916         (only its CALL-SITES live here)
//
// 2.1.88 convention mirror : /lyz/codespace/3rd/claude-code/src/utils/attachments.ts
//   (getAttachments / maybe / getQueuedCommandAttachments + the cadence-config consts;
//    the dispatcher itself lives in messages.ts in the 2.1.88 tree — mirrored shape kept here
//    because 2.1.183 colocates the renderer map next to the generator pool.)
// 2.1.156 scaffold doc    : claude_code_v_2.1.156/analyze/41_system_reminder/runtime_lifecycle.md
//   (Stage 0 = collectAttachments/master gate; Stage 1 = normalizeAttachmentForAPI 3-tier dispatch)
// Anchor dossier          : ../_anchors_primitives.md  §5 (generator pool), §6 (dispatcher+map), §7 (configs)
//
// Cross-validation: every obf id re-derived in the 183 bundle by string-anchoring
//   (CLAUDE_CODE_DISABLE_ATTACHMENTS gate @464608, tengu_attachment_compute_duration @464700/710,
//    the "Unknown attachment type:" dispatcher error @589606, the verbatim reminder literals in ONl),
//   then each line Read. Deltas vs 2.1.156 marked inline ("NEW in 2.1.183" / "DELTA").
//
// NOTE ON SCOPE: this file reconstructs the POOL + DISPATCHER contract. The ~40 individual
//   generator functions (d4p, f4p, ftl, gtl, e4p, … and the TLe agent-listing diff) are SUMMARIZED
//   with a one-line `// helper: <obf> @line` note where they cross the pool boundary; their full
//   bodies belong to neighbouring units. The wrap/strip primitives (TI/Jp/Rn/bSf/WNl/G0o) live in
//   messages.ts — only their CALL idioms appear here.
// ============================================================================

import type {
  ContentBlockParam,
  ImageBlockParam,
} from '@anthropic-ai/sdk/resources/messages.mjs'
import type { Message, MessageOrigin, UserMessage } from '../types/message.js'
import type { ToolUseContext } from '../Tool.js'
import type { QueuedCommand } from '../types/textInputTypes.js'
import type { QuerySource } from '../constants/querySource.js'
import type { UUID } from 'crypto'

// --- primitives imported from messages.ts (reconstructed in ../utils/messages.ts) -----------------
//   TI  = wrapInSystemReminder        (string -> "<system-reminder>\n…\n</system-reminder>")
//   Jp  = wrapMessagesInSystemReminder (list helper: wraps each text block via TI)
//   Rn  = createUserMessage            ({ content, isMeta } -> UserMessage; empty content -> Dw)
import {
  wrapInSystemReminder,
  wrapMessagesInSystemReminder,
  createUserMessage,
} from './messages.js'

// --- gate / model / telemetry helpers -------------------------------------------------------------
//   st  = isEnvTruthy            @ helper
//   ch  = resolveModel           (t.options.mainLoopModel -> concrete model)         // helper: ch
//   Xl  = createAbortController                                                       // helper: Xl
//   G   = logEvent (statsig/telemetry sink)                                           // helper: G
//   Re  = jsonStringify (size accounting)                                             // helper: Re
//   H3  = logAntError (structured, never throws)                                      // helper: H3
//   De  = logError                                                                    // helper: De
//   v   = log (level-tagged)                                                          // helper: v
//   gB  = ImageResizeError class                                                      // helper: gB
//   Sl  = isAgentTeamEnabled  (R7 analog; gates dispatcher Tier 1 + the team gen pair) @293831
//   Pw  = isWorkflowEnabled   (gates the workflow_keyword_request / ultra_effort pair) // helper: Pw
//   _H  = isTodoV2Enabled     (chooses task-reminder vs todo-reminder generator)       // helper: _H
//   B1r = toolSearchToolName (non-null => enable tool_search_usage_reminder gen)       // helper: B1r
import { isEnvTruthy as st } from './envUtils.js'
import { resolveModel as ch } from './model/model.js'
import { createAbortController as Xl } from './abortController.js'
import { logEvent as G } from '../services/analytics/index.js'
import { jsonStringify as Re } from './slowOperations.js'
import { logAntError as H3 } from './debug.js'
import { logError as De } from './log.js'
import { log as v } from './log.js'
import { ImageResizeError as gB } from './imageResizer.js'
import { isAgentTeamEnabled as Sl } from './agentSwarmsEnabled.js'
import { isWorkflowEnabled as Pw } from './workflow.js'
import { isTodoV2Enabled as _H } from './tasks.js'
import { toolSearchToolName as B1r } from './toolSearch.js'

// process-env bag (Ge.CLAUDE_CODE_SIMPLE is read as a plain boolean, NOT through isEnvTruthy)
declare const Ge: { CLAUDE_CODE_SIMPLE?: boolean }

// ----------------------------------------------------------------------------------------------------
// Imported attachment generators (each returns Promise<Attachment[]> or Attachment[]).
// These are the *pool members*; only their signatures matter to this unit. Full bodies live elsewhere.
//   d4p at_mentioned_files · f4p mcp_resources · p4p agent_mentions · ftl date_change · r4p ultrathink_effort
//   aye deferred_tools_delta · TLe agent_listing_delta @464916 · OWe mcp_instructions_delta · gtl changed_files
//   A4p nested_memory · b4p dynamic_skill · EUn skill_listing · e4p plan_mode · dtl plan_mode_exit
//   t4p auto_mode · n4p auto_mode_exit · w4p/v4p todo|task reminders · wtl tool_search_usage_reminder
//   k4p teammate_mailbox · L4p team_context · utl agent_pending_messages · i4p critical_system_reminder
//   P4p total_tokens_reminder · o4p workflow_keyword_request · s4p ultra_effort_enter · l4p ide_selection
//   u4p ide_opened_file · a4p output_style · S4p diagnostics · E4p lsp_diagnostics · I4p unified_tasks
//   x4p async_hook_responses · Ctl memory_update · D4p token_usage · R4p budget_usd · M4p output_token_usage
//   $4p verify_plan_reminder · Q3p buildImageContentBlocks · Jyn ultracode-keyword detector
// ----------------------------------------------------------------------------------------------------
import {
  processAtMentionedFiles as d4p,
  processMcpResourceAttachments as f4p,
  processAgentMentions as p4p,
  getDateChangeAttachments as ftl,
  getUltrathinkEffortAttachment as r4p,
  getDeferredToolsDeltaAttachment as aye,
  getAgentListingDeltaAttachment as TLe, // @464916
  getMcpInstructionsDeltaAttachment as OWe,
  getChangedFiles as gtl,
  getNestedMemoryAttachments as A4p,
  getDynamicSkillAttachments as b4p,
  getSkillListingAttachments as EUn,
  getPlanModeAttachments as e4p,
  getPlanModeExitAttachment as dtl,
  getAutoModeAttachments as t4p,
  getAutoModeExitAttachment as n4p,
  getTaskReminderAttachments as w4p,
  getTodoReminderAttachments as v4p,
  getToolSearchUsageReminderAttachment as wtl,
  getTeammateMailboxAttachments as k4p,
  getTeamContextAttachment as L4p,
  getAgentPendingMessageAttachments as utl,
  getCriticalSystemReminderAttachment as i4p,
  getTotalTokensReminderAttachment as P4p,
  getWorkflowKeywordRequestAttachment as o4p,
  getUltraEffortEnterAttachment as s4p,
  getSelectedLinesFromIDE as l4p,
  getOpenedFileFromIDE as u4p,
  getOutputStyleAttachment as a4p,
  getDiagnosticAttachments as S4p,
  getLSPDiagnosticAttachments as E4p,
  getUnifiedTaskAttachments as I4p,
  getAsyncHookResponseAttachments as x4p,
  getMemoryUpdateAttachment as Ctl,
  getTokenUsageAttachment as D4p,
  getMaxBudgetUsdAttachment as R4p,
  getOutputTokenUsageAttachment as M4p,
  getVerifyPlanReminderAttachment as $4p,
  buildImageContentBlocks as Q3p,
  hasUltracodeKeyword as Jyn,
} from './attachmentGenerators.js'

import type { Attachment } from '../types/attachment.js'

// ====================================================================================================
// Cadence configs — the per-feature throttle constants.
// All five defined in one module-init block @466059-466063, exported via aliases @464595-464599.
// Values UNCHANGED from 2.1.156.
// ====================================================================================================

// 2.1.183: TODO_REMINDER_CONFIG = rGt @cli_inner_pretty.js:466059
//   read by the todo/task reminder gens as a dual `&&` cadence gate (@465712 / @465749):
//   re-nudge only when ≥TURNS_SINCE_WRITE turns since last write AND ≥TURNS_BETWEEN_REMINDERS since last nudge.
export const TODO_REMINDER_CONFIG = {
  TURNS_SINCE_WRITE: 10, // @466059
  TURNS_BETWEEN_REMINDERS: 10, // @466059
} as const

// 2.1.183: PLAN_MODE_ATTACHMENT_CONFIG = Hho @cli_inner_pretty.js:466060
//   TURNS_BETWEEN_ATTACHMENTS read @464805; FULL_REMINDER_EVERY_N_ATTACHMENTS read @464812
//   (full reminder on the 1st, 6th, 11th… plan_mode attachment; sparse in between).
export const PLAN_MODE_ATTACHMENT_CONFIG = {
  TURNS_BETWEEN_ATTACHMENTS: 5, // @466060
  FULL_REMINDER_EVERY_N_ATTACHMENTS: 5, // @466060
} as const

// 2.1.183: ULTRA_EFFORT_CONFIG = itl @cli_inner_pretty.js:466061  (read @464898)
export const ULTRA_EFFORT_CONFIG = {
  TURNS_BETWEEN_MAINTENANCE: 10, // @466061
} as const

// 2.1.183: RELEVANT_MEMORIES_CONFIG = atl @cli_inner_pretty.js:466062  (read @465370)
//   61440 === 60 * 1024 — the per-session cumulative byte budget for auto-memory surfacing.
export const RELEVANT_MEMORIES_CONFIG = {
  MAX_SESSION_BYTES: 61440, // @466062 (60 * 1024)
} as const

// 2.1.183: VERIFY_PLAN_REMINDER_CONFIG = ltl @cli_inner_pretty.js:466063
export const VERIFY_PLAN_REMINDER_CONFIG = {
  TURNS_BETWEEN_REMINDERS: 10, // @466063
} as const

// ====================================================================================================
// Queued-command mode allow-list.
// 2.1.183: queuedModesSet = J3p @cli_inner_pretty.js:466064
//   Only 'prompt' (human-typed) and 'task-notification' (system-injected, e.g. Local/RemoteTask
//   mid-tool-call notifications) survive into queued_command attachments. Other queued modes are
//   ignored here. Headless/--bare coworker depends on 'task-notification' flowing through even when
//   the master gate trips (see collectAttachments below).
// ====================================================================================================
const INLINE_NOTIFICATION_MODES = new Set(['prompt', 'task-notification']) // J3p @466064

// ====================================================================================================
// collectAttachments — the per-turn generator pool: master gate, 1s abort budget, two parallel waves.
// 2.1.183: collectAttachments = ctl @cli_inner_pretty.js:464606-464692
// 2.1.88 mirror: getAttachments @attachments.ts:743-1003 (same gate/abort/wave shape).
// 2.1.156 scaffold: runtime_lifecycle.md Stage 0.
// ====================================================================================================
//
// Signature note (positional, from @464606  `ctl(e,t,n,r,o,s,i)`):
//   e = input            (the user prompt string | null — null on pure tool-loop rounds)
//   t = toolUseContext
//   n = ideSelection
//   r = queuedCommands
//   o = messages
//   s = querySource
//   i = promptMeta       (carries isRegularUserPrompt / suppressWorkflowKeyword / preExpansionInput)
//
export async function collectAttachments(
  input: string | null, // e
  toolUseContext: ToolUseContext, // t
  ideSelection: unknown, // n
  queuedCommands: QueuedCommand[], // r
  messages: Message[] | undefined, // o
  querySource: QuerySource | undefined, // s
  promptMeta?: {
    isRegularUserPrompt?: boolean
    suppressWorkflowKeyword?: boolean
    preExpansionInput?: string | null
  }, // i
): Promise<Attachment[]> {
  const model = ch(toolUseContext.options.mainLoopModel) // a = resolveModel @464607

  // ── MASTER GATE @464608 ────────────────────────────────────────────────────────────────────────
  //   isEnvTruthy(CLAUDE_CODE_DISABLE_ATTACHMENTS) OR Ge.CLAUDE_CODE_SIMPLE
  //   suppresses EVERY generator except the two whose payload is *transport*, not *context*:
  //   queued commands (oGt) AND the agent-listing delta (TLe).
  //
  // ⚠ DELTA vs 2.1.156: 2.1.156 returned `gV$(K, Y)` (queued-command attachments ONLY).
  //   2.1.183 ALSO appends `...TLe(t, o)` — the agent_listing_delta now still flows in
  //   headless/SDK/SIMPLE mode so subagent spawning stays announceable. (2.1.156 @412662.)
  if (st(process.env.CLAUDE_CODE_DISABLE_ATTACHMENTS) || Ge.CLAUDE_CODE_SIMPLE) {
    return [...(await getQueuedCommandAttachments(queuedCommands, model)), ...TLe(toolUseContext, messages)] // @464609
  }

  // ── 1-SECOND ABORT BUDGET @464610-464611 ─────────────────────────────────────────────────────────
  //   One controller shared by every generator via `genCtx`. A generator that out-runs the budget
  //   (git walk, LSP round-trip, CLAUDE.md traversal) is aborted rather than blocking the request.
  const abortController = Xl() // l @464610
  const abortTimer = setTimeout((ac) => ac.abort(), 1000, abortController) // c @464611
  const genCtx = { ...toolUseContext, abortController } // u @464612
  const isMainAgent = !toolUseContext.agentId // d @464613 — subagents get the reduced set

  // ── MENTION WAVE @464614-464623 (runs only when there is fresh user input) ───────────────────────
  //   These three parse the *prompt text* (@-mentioned files, MCP resource refs, @agent mentions).
  //   Awaited FIRST so nested-memory triggers are populated before the nested_memory gen runs.
  const mentionWave = input // p @464614
    ? [
        runAttachmentGenerator('at_mentioned_files', () => d4p(input, genCtx)),
        runAttachmentGenerator('mcp_resources', () => f4p(input, genCtx)),
        runAttachmentGenerator('agent_mentions', () =>
          Promise.resolve(p4p(input, toolUseContext.options.agentDefinitions.activeAgents)),
        ),
      ]
    : []
  const mentionResults = await Promise.all(mentionWave) // f @464624

  // Memoize the todo/task reminder generator: chosen once, reused by both the wave entry AND the
  // tool_search_usage_reminder gate's "are there pending todos?" probe. @464625-464628
  //   isTodoV2Enabled() ? getTaskReminderAttachments : getTodoReminderAttachments
  let cachedTodoGen: Promise<Attachment[]> | undefined
  const todoReminderGen = (): Promise<Attachment[]> =>
    (cachedTodoGen ??= _H() ? w4p(messages, toolUseContext) : v4p(messages, toolUseContext)) // m

  // ── WAVE A — ALWAYS-RUN (all threads, main + subagents) @464629-464661 ───────────────────────────
  const waveAlways = [
    runAttachmentGenerator('queued_commands', () => getQueuedCommandAttachments(queuedCommands, model)),
    runAttachmentGenerator('date_change', () => Promise.resolve(ftl(messages))),
    runAttachmentGenerator('ultrathink_effort', () => Promise.resolve(r4p(input))),
    runAttachmentGenerator('deferred_tools_delta', () =>
      Promise.resolve(
        aye(
          toolUseContext.options.tools,
          toolUseContext.options.mainLoopModel,
          messages,
          {
            // callSite distinguishes main-thread vs subagent for telemetry @464655
            callSite: isMainAgent ? 'attachments_main' : 'attachments_subagent',
            querySource,
          },
          // pass pending MCP server names so the delta can suppress not-yet-connected tools
          toolUseContext.options.mcpClients.filter((c) => c.type === 'pending').map((c) => c.name),
        ),
      ),
    ),
    // agent_listing_delta — same gen that the master-gate short-circuit emits (TLe @464916)
    runAttachmentGenerator('agent_listing_delta', () => Promise.resolve(TLe(toolUseContext, messages))),
    runAttachmentGenerator('mcp_instructions_delta', () =>
      Promise.resolve(
        OWe(toolUseContext.options.mcpClients, toolUseContext.options.tools, toolUseContext.options.mainLoopModel, messages),
      ),
    ),
    runAttachmentGenerator('changed_files', () => gtl(genCtx)),
    runAttachmentGenerator('nested_memory', () => A4p(genCtx)),
    runAttachmentGenerator('dynamic_skill', () => b4p(genCtx)),
    runAttachmentGenerator('skill_listing', () => EUn(genCtx)),
    runAttachmentGenerator('plan_mode', () => e4p(input, messages, toolUseContext, promptMeta)),
    runAttachmentGenerator('plan_mode_exit', () => dtl(messages, toolUseContext)),
    runAttachmentGenerator('auto_mode', () => t4p(messages, toolUseContext)),
    runAttachmentGenerator('auto_mode_exit', () => n4p(messages, toolUseContext)),
    runAttachmentGenerator('todo_reminders', todoReminderGen),

    // tool_search_usage_reminder — gated by toolSearchToolName() !== null @464655-464657
    //   probe arg: an async "are there pending todos?" check that awaits the memoized todo gen.
    ...(B1r() !== null
      ? [
          runAttachmentGenerator('tool_search_usage_reminder', () =>
            wtl(messages, toolUseContext, async () => (await todoReminderGen()).length > 0),
          ),
        ]
      : []),

    // team generator pair — gated by isAgentTeamEnabled() (Sl) @464658
    ...(Sl()
      ? [
          runAttachmentGenerator('teammate_mailbox', async () => k4p(toolUseContext)),
          runAttachmentGenerator('team_context', async () => L4p(messages ?? [])),
        ]
      : []),

    runAttachmentGenerator('agent_pending_messages', async () => utl(toolUseContext)),
    runAttachmentGenerator('critical_system_reminder', () => Promise.resolve(i4p(toolUseContext))),
    // total_tokens_reminder — NEW in 2.1.183. Fires only on a pure tool-loop round (input === null):
    //   when there is no fresh user prompt this round, surface the running token total. @464661
    runAttachmentGenerator('total_tokens_reminder', () =>
      Promise.resolve(input === null ? P4p(messages ?? [], toolUseContext.options.mainLoopModel) : []),
    ),
  ]

  // ── WAVE G — MAIN-AGENT-ONLY (`isMainAgent`) @464662-464689 ──────────────────────────────────────
  //   Semantically main-conversation-only or not concurrency-safe in a subagent.
  const waveMainOnly = isMainAgent
    ? [
        // workflow / ultracode pair — gated by isWorkflowEnabled() (Pw) @464663-464673
        ...(Pw()
          ? [
              runAttachmentGenerator('workflow_keyword_request', () =>
                Promise.resolve(
                  // only on a real user prompt, not suppressed, and the "ultracode" keyword is present (Jyn)
                  promptMeta?.isRegularUserPrompt && !promptMeta.suppressWorkflowKeyword && Jyn()
                    ? o4p(promptMeta.preExpansionInput ?? input)
                    : [],
                ),
              ),
              runAttachmentGenerator('ultra_effort_enter', () =>
                Promise.resolve(promptMeta?.isRegularUserPrompt ? s4p(messages, toolUseContext) : []),
              ),
            ]
          : []),
        runAttachmentGenerator('ide_selection', async () => l4p(ideSelection, toolUseContext)),
        runAttachmentGenerator('ide_opened_file', async () => u4p(ideSelection, toolUseContext)),
        runAttachmentGenerator('output_style', () => a4p()),
        runAttachmentGenerator('diagnostics', async () => S4p(toolUseContext)),
        runAttachmentGenerator('lsp_diagnostics', async () => E4p(toolUseContext)),
        runAttachmentGenerator('unified_tasks', async () => I4p(toolUseContext)),
        runAttachmentGenerator('async_hook_responses', async () => x4p()),
        runAttachmentGenerator('memory_update', () => Promise.resolve(Ctl(toolUseContext))),
        runAttachmentGenerator('token_usage', async () =>
          Promise.resolve(D4p(messages ?? [], toolUseContext.options.mainLoopModel, toolUseContext.options.autoCompactWindow)),
        ),
        runAttachmentGenerator('budget_usd', async () => Promise.resolve(R4p(toolUseContext.options.maxBudgetUsd))),
        runAttachmentGenerator('output_token_usage', async () => Promise.resolve(M4p())),
        runAttachmentGenerator('verify_plan_reminder', async () => $4p(messages, toolUseContext)),
      ]
    : []

  // ── RUN BOTH WAVES CONCURRENTLY, then drain the abort timer @464690-464691 ───────────────────────
  const [alwaysResults, mainOnlyResults] = await Promise.all([
    Promise.all(waveAlways),
    Promise.all(waveMainOnly),
  ])

  clearTimeout(abortTimer)
  // Defensive flatten + null-strip: a generator leaking [undefined] would crash the downstream
  // `.map(a => a.type)` in normalizeAttachmentForAPI.
  return [...mentionResults.flat(), ...alwaysResults.flat(), ...mainOnlyResults.flat()].filter(
    (a) => a !== undefined && a !== null,
  )
}

// ====================================================================================================
// runAttachmentGenerator — per-generator resilience boundary + 5% timing telemetry.
// 2.1.183: runAttachmentGenerator = BA @cli_inner_pretty.js:464693-464715
// 2.1.88 mirror: maybe<A>() @attachments.ts:1005-1042.
// 2.1.156 scaffold: runtime_lifecycle.md Stage 0 — "per-generator isolation".
// ====================================================================================================
//   A single generator throwing must NOT lose the whole reminder set — the catch returns [], so the
//   pool degrades to "no reminder from this gen" rather than "no request". Timing/size is sampled at
//   5% to keep telemetry volume bounded.
export async function runAttachmentGenerator<A>(
  label: string, // e
  fn: () => Promise<A[]>, // t
): Promise<A[]> {
  const startedAt = Date.now() // n @464694
  try {
    const result = await fn() // r @464696
    const durationMs = Date.now() - startedAt // o @464696
    if (Math.random() < 0.05) {
      // jsonStringify(undefined) is undefined → its .length would throw; null/undefined filtered first.
      const attachmentSizeBytes = result
        .filter((a) => a !== undefined && a !== null)
        .reduce((sum, a) => sum + Re(a).length, 0) // s @464699
      // @464700 — verbatim event: success path fields
      G('tengu_attachment_compute_duration', {
        label, // e
        duration_ms: durationMs, // o
        attachment_size_bytes: attachmentSizeBytes, // s
        attachment_count: result.length,
      })
    }
    return result
  } catch (err) {
    const durationMs = Date.now() - startedAt // o @464708
    // @464710 — verbatim event: error path fields (label + duration + error:true)
    if (Math.random() < 0.05) G('tengu_attachment_compute_duration', { label, duration_ms: durationMs, error: true })
    // Image-resize failures are downgraded to a non-fatal log (gB = ImageResizeError) @464712
    if (err instanceof gB) v(`Attachment image resize failed in ${label}: ${(err as Error).message}`, { level: 'error' })
    else De(err) // generic logError @464713
    // Ant-side structured log (never throws), then swallow → [] @464714
    return (H3(`Attachment error in ${label}`, err), [])
  }
}

// ====================================================================================================
// getQueuedCommandAttachments — the ONE generator that survives the master gate.
// 2.1.183: getQueuedCommandAttachments = oGt @cli_inner_pretty.js:464716-464751
// 2.1.88 mirror: getQueuedCommandAttachments @attachments.ts:1046-1083.
// ====================================================================================================
//   Filters the queue to INLINE_NOTIFICATION_MODES (J3p), resolves any pasted image contents into
//   content blocks, and emits one `queued_command` attachment per surviving item. Including
//   'task-notification' here is what lets proactive agentic loops drain system notifications (without
//   it they pile up forever and Sleep busy-loops with 0ms wakeups).
//
//   ⚠ DELTA vs 2.1.156: the emitted object now also carries `fileAttachments` (from QueuedCommand)
//   and, when present, `verifiedSlackHumanTurn:true` — both new pass-through fields in 2.1.183.
export async function getQueuedCommandAttachments(
  queuedCommands: QueuedCommand[], // e
  model: string, // t — threaded to image resize so the budget matches the model
): Promise<Attachment[]> {
  if (!queuedCommands) return [] // @464717
  const filtered = queuedCommands.filter((c) => INLINE_NOTIFICATION_MODES.has(c.mode)) // n @464718
  return Promise.all(
    filtered.map(async (c) => {
      const imageBlocks = await Q3p(c.pastedContents, model) // o = buildImageContentBlocks @464721
      let prompt: string | Array<ContentBlockParam> = c.value // s @464722
      if (imageBlocks.length > 0) {
        // Build a [text, …images] block array so the model sees the pasted images alongside the text.
        prompt = [
          {
            type: 'text',
            // string value passes through; structured value is flattened to text with '\n' joins (wc)
            text: typeof c.value === 'string' ? c.value : extractTextContent(c.value, '\n'),
          },
          ...imageBlocks,
        ]
      }
      return {
        type: 'queued_command',
        prompt, // s
        source_uuid: c.uuid,
        imagePasteIds: getImagePasteIds(c.pastedContents), // Bel @464742
        fileAttachments: c.fileAttachments, // NEW in 2.1.183 @464743
        commandMode: c.mode,
        origin: c.origin as MessageOrigin | undefined,
        isMeta: c.isMeta,
        // verifiedSlackHumanTurn only spread when truthy (preserves cache byte-stability) @464747
        ...(c.verifiedSlackHumanTurn && { verifiedSlackHumanTurn: true }),
      } as Attachment
    }),
  )
}

// helper: extractTextContent = wc — flatten structured prompt to a single string with a joiner @464730
declare function extractTextContent(value: unknown, joiner: string): string
// helper: getImagePasteIds = Bel @464742
declare function getImagePasteIds(pastedContents: unknown): number[] | undefined

// ====================================================================================================
// AMBIENT_CONTEXT_TRAILER — the hoisted "do not narrate" trailer appended to ambient reminders.
// 2.1.183: AMBIENT_CONTEXT_TRAILER = _7n @cli_inner_pretty.js:590353-590354
//   (single grep hit on "This is ambient context"). Byte-identical to 2.1.156 yT8.
// SINGLE-DEFINITION: the canonical home is ./messages.ts (alongside the other shared
//   <system-reminder> primitives this file already imports from it). Re-exported here so
//   this module's documented region resolves without a duplicate top-level definition.
// ====================================================================================================
export { AMBIENT_CONTEXT_TRAILER } from './messages.js' // _7n @590353-590354

// ====================================================================================================
// normalizeAttachmentForAPI — the 3-tier dispatcher: typed Attachment -> wrapped UserMessage[].
// 2.1.183: normalizeAttachmentForAPI = PWn @cli_inner_pretty.js:589204-589607
// 2.1.88 mirror: normalizeAttachmentForAPI @messages.ts:3453 (same map+switch shape).
// 2.1.156 scaffold: runtime_lifecycle.md Stage 1 ("3-tier dispatch").
//
//   ⚠ obf-id note: 2.1.156's dispatcher was kc6; the 2.1.183 analog is PWn (NOT kc6).
// ====================================================================================================
//
//   Tier 1 (589205-589245): isAgentTeamEnabled()-gated early exit for `teammate_mailbox` and
//                           `team_context`. Both delegate / inline a verbatim reminder body.
//   Tier 2 (589246):        `if (e.type in ONl) return ONl[e.type](e)` — the flat PER_TYPE_RENDERERS map.
//   Tier 3 (589247+):       inline switch for the multi-branch cases (file / invoked_skills / …).
//   Fallthrough (589606):   log a structured error but NEVER throw — a malformed attachment is
//                           degraded to silence so it can't drop the user's turn.
//
export function normalizeAttachmentForAPI(attachment: Attachment): UserMessage[] {
  // ── Tier 1: agent-team early exit @589205 ──────────────────────────────────────────────────────
  if (Sl()) {
    if (attachment.type === 'teammate_mailbox') {
      // delegate to the mailbox formatter @589209 (dSf().formatTeammateMessages)
      return [
        createUserMessage({
          content: getTeammateMailbox().formatTeammateMessages(attachment.messages, {
            recipientIsLead: attachment.recipientIsLead ?? false,
          }),
          isMeta: true,
        }),
      ]
    }
    if (attachment.type === 'team_context') {
      // verbatim multiline <system-reminder> body @589216-589241 (CARRYOVER from 2.1.156)
      return [
        createUserMessage({
          content: `<system-reminder>
# Team Coordination

You are a teammate in this session's agent team.

**Your Identity:**
- Name: ${attachment.agentName}

**Team Resources:**
- Team config: ${attachment.teamConfigPath}
- Task list: ${attachment.taskListPath}

**Team Leader:** The team lead's name is "team-lead". Send updates and completion notifications to them.

Read the team config to discover your teammates' names. Check the task list periodically. Create new tasks when work should be divided. Mark tasks resolved when complete.

**IMPORTANT:** Always refer to active teammates by their NAME (e.g., "team-lead", "analyzer", "researcher"). Use an \`agentId\` (format \`a...-...\`, from the spawn result) only to resume a background agent that has already completed. When messaging, use the name directly:

\`\`\`json
{
  "to": "team-lead",
  "message": "Your message here",
  "summary": "Brief 5-10 word preview"
}
\`\`\`
</system-reminder>`,
          isMeta: true,
        }),
      ]
    }
  }

  // ── Tier 2: per-type renderer map @589246 ──────────────────────────────────────────────────────
  if (attachment.type in PER_TYPE_RENDERERS) {
    return PER_TYPE_RENDERERS[attachment.type as keyof typeof PER_TYPE_RENDERERS](attachment as never)
  }

  // ── Tier 3: inline switch — multi-branch cases @589247+ ────────────────────────────────────────
  switch (attachment.type) {
    case 'file': {
      // image / text / notebook / pdf subcases @589250. Each renders a fake Read tool_use+result via
      // K9t (synthetic tool_use) + z9t (synthetic tool_result), wrapped by Jp.
      // The `text` subcase adds a truncation note when `truncated` is set (verbatim @589260):
      //   `Note: The file ${e.filename} was too large and has been truncated to the first ${OQe} lines.
      //    Don't tell the user about this truncation. Use ${hg.name} to read more of the file if you need.`
      //   (OQe = 2000 @152225; hg.name = "Read" @463520)
      return renderFileAttachment(attachment) // helper: file switch @589248-589271
    }
    case 'invoked_skills': {
      if (attachment.skills.length === 0) return [] // @589274
      return renderInvokedSkills(attachment) // helper: invoked_skills @589273+
    }
    // …additional multi-branch cases (todo_reminder / task_reminder / relevant_memories / plan_mode /
    //   memory_update / verify_plan_reminder / queued_command / diagnostics / plan_mode_reentry /
    //   auto_mode / mcp_resource / task_status / async_hook_response / hook_success / deferred_tools_delta /
    //   mcp_instructions_delta …) live in the same switch; each ends in
    //   `Jp([Rn({ content, isMeta: true })])`. Bodies belong to the renderer-catalogue unit; see
    //   _anchors_catalogue.md for the verbatim text of each.
  }

  // ── Tier-3 NOOP allow-list @589600-589605 ──────────────────────────────────────────────────────
  //   Types that exist in the union for transcript-load compatibility but no longer emit. Returning []
  //   keeps an old transcript loadable instead of hitting the unknown-type error path on every replay.
  //   (2.1.183 adds `echo_activities` to the legacy list.)
  if (
    [
      'autocheckpointing',
      'background_task_status',
      'todo',
      'task_progress',
      'ultramemory',
      'compaction_reminder',
      'current_session_memory',
      'thinking_reminder',
      'companion_intro',
      'pen_mode_enter',
      'pen_mode_exit',
      'ultrawork_request',
      'echo_activities', // NEW in 2.1.183
    ].includes(attachment.type)
  ) {
    return []
  }

  // ── Unknown-type fallthrough @589606 ───────────────────────────────────────────────────────────
  //   Log a structured error (names itself "normalizeAttachmentForAPI") but return [] — never throw.
  return (H3('normalizeAttachmentForAPI', new Error(`Unknown attachment type: ${(attachment as Attachment).type}`)), [])
}

// helper: getTeammateMailbox = dSf @589209 (returns the mailbox formatter object)
declare function getTeammateMailbox(): { formatTeammateMessages(messages: unknown, opts: { recipientIsLead: boolean }): string }
// helper: file switch renderer (image/text/notebook/pdf) @589248-589271
declare function renderFileAttachment(attachment: Attachment): UserMessage[]
// helper: invoked_skills renderer @589273+
declare function renderInvokedSkills(attachment: Attachment): UserMessage[]

// ====================================================================================================
// PER_TYPE_RENDERERS — the flat per-type renderer map (Tier 2 of the dispatcher).
// 2.1.183: PER_TYPE_RENDERERS = ONl @cli_inner_pretty.js:590431-590642
//   (declared as a module-scope var @590351, assigned in the module-init block @590431).
//   Each value is (attachment) => UserMessage[]. Trivial single-string cases live here; complex
//   multi-branch cases stay in the dispatcher switch (Tier 3).
//
//   Verbatim strings below are quoted EXACTLY from the bundle. Cases whose body is just a synthetic
//   tool_use/result or a delegated builder are summarized with a `// renders: …` note.
// ====================================================================================================
export const PER_TYPE_RENDERERS = {
  // synthetic `ls <path>` tool_use+result @590432 — renders: K9t(Bash) + z9t(Bash, {stdout: content})
  directory: (e: Extract<Attachment, { type: 'directory' }>) => renderDirectory(e),

  // @590437 — a file was edited by the user/linter; two branches (empty snippet vs diff-with-line-numbers)
  edited_text_file: (e: Extract<Attachment, { type: 'edited_text_file' }>) =>
    wrapMessagesInSystemReminder([
      createUserMessage({
        content:
          e.snippet === ''
            ? `Note: ${e.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. The diff was omitted because other modified files in this turn already exceeded the snippet budget; use the Read tool if you need the current content.`
            : `Note: ${e.filename} was modified, either by the user or by a linter. This change was intentional, so make sure to take it into account as you proceed (ie. don't revert it unless the user asks you to). Don't tell the user this, since they are already aware. Here are the relevant changes (shown with line numbers):
${e.snippet}`,
        isMeta: true,
      }),
    ]),

  // @590448 — file read pre-compaction, contents too large to inline
  //   ⚠ verbatim: bundle interpolates `${hg.name}` (the Read tool name) — written as "Read" here for readability.
  compact_file_reference: (e: Extract<Attachment, { type: 'compact_file_reference' }>) =>
    wrapMessagesInSystemReminder([
      createUserMessage({
        content: `Note: ${e.filename} was read before the last conversation was summarized, but the contents are too large to include. Use ${'Read' /* ${hg.name} @590451 */} tool if you need to access it.`,
        isMeta: true,
      }),
    ]),

  // @590455 — oversized PDF; force page-ranged Read
  //   ⚠ verbatim: bundle interpolates `${Ws}` (the "Read" tool-name const @152217) at both tool-name slots.
  pdf_reference: (e: Extract<Attachment, { type: 'pdf_reference' }>) =>
    wrapMessagesInSystemReminder([
      createUserMessage({
        content: `PDF file: ${e.filename} (${e.pageCount} pages, ${formatBytes(e.fileSize)}). This PDF is too large to read all at once. You MUST use the ${'Read' /* ${Ws} @590458 */} tool with the pages parameter to read specific page ranges (e.g., pages: "1-5"). Do NOT call ${'Read' /* ${Ws} */} without the pages parameter or it will fail. Start by reading the first few pages to understand the structure, then read more as needed. Maximum 20 pages per request.`,
        isMeta: true,
      }),
    ]),

  // @590462 — IDE selection; renders a synthetic note (content truncated at 2000 chars)
  selected_lines_in_ide: (e: Extract<Attachment, { type: 'selected_lines_in_ide' }>) => renderSelectedLinesInIde(e),

  // @590479 — file opened in the IDE
  opened_file_in_ide: (e: Extract<Attachment, { type: 'opened_file_in_ide' }>) => renderOpenedFileInIde(e),

  // @590486 — plan file reference (delegated builder)
  plan_file_reference: (e: Extract<Attachment, { type: 'plan_file_reference' }>) => renderPlanFileReference(e),

  // @590499 — nested CLAUDE.md memory surfaced
  nested_memory: (e: Extract<Attachment, { type: 'nested_memory' }>) => renderNestedMemory(e),

  // @590508 — @agent mention acknowledgement
  agent_mention: (e: Extract<Attachment, { type: 'agent_mention' }>) => renderAgentMention(e),

  // @590515 — skill catalogue listing
  skill_listing: (e: Extract<Attachment, { type: 'skill_listing' }>) => renderSkillListing(e),

  // @590526 — active output style
  output_style: (e: Extract<Attachment, { type: 'output_style' }>) => renderOutputStyle(e),

  // @590536 — passthrough: the content is already the full reminder body (no extra wrap text)
  critical_system_reminder: (e: Extract<Attachment, { type: 'critical_system_reminder' }>) =>
    wrapMessagesInSystemReminder([createUserMessage({ content: e.content, isMeta: true })]),

  // @590537 — exited plan mode
  plan_mode_exit: (e: Extract<Attachment, { type: 'plan_mode_exit' }>) => {
    const planRef = e.planExists ? ` The plan file is located at ${e.planFilePath} if you need to reference it.` : '' // @590540
    return wrapMessagesInSystemReminder([
      createUserMessage({
        content: `## Exited Plan Mode

You have exited plan mode. You can now make edits, run tools, and take actions.${planRef}`,
        isMeta: true,
      }),
    ])
  },

  // @590548 — exited auto mode
  auto_mode_exit: () =>
    wrapMessagesInSystemReminder([
      createUserMessage({
        content: `## Exited Auto Mode

You have exited auto mode. The user may now want to interact more directly. You should ask clarifying questions when the approach is ambiguous rather than making assumptions.`,
        isMeta: true,
      }),
    ]),

  // @590557 — running token usage
  token_usage: (e: Extract<Attachment, { type: 'token_usage' }>) => [
    createUserMessage({ content: wrapInSystemReminder(`Token usage: ${e.used}/${e.total}; ${e.remaining} remaining`), isMeta: true }),
  ],

  // @590560 — NEW in 2.1.183. The text is precomputed by the generator (P4p); just wrap it.
  total_tokens_reminder: (e: Extract<Attachment, { type: 'total_tokens_reminder' }>) => [
    createUserMessage({ content: wrapInSystemReminder(e.text), isMeta: true }),
  ],

  // @590561 — USD budget
  budget_usd: (e: Extract<Attachment, { type: 'budget_usd' }>) => [
    createUserMessage({ content: wrapInSystemReminder(`USD budget: $${e.used}/$${e.total}; $${e.remaining} remaining`), isMeta: true }),
  ],

  // @590564 — per-turn / per-session output token usage (em-dash + middle-dot separators, verbatim)
  output_token_usage: (e: Extract<Attachment, { type: 'output_token_usage' }>) => {
    const turn = e.budget !== null ? `${formatCount(e.turn)} / ${formatCount(e.budget)}` : formatCount(e.turn) // @590566
    return [createUserMessage({ content: wrapInSystemReminder(`Output tokens — turn: ${turn} · session: ${formatCount(e.session)}`), isMeta: true })]
  },

  // @590568 — a hook returned a blocking error
  hook_blocking_error: (e: Extract<Attachment, { type: 'hook_blocking_error' }>) => [
    createUserMessage({
      content: wrapInSystemReminder(
        `${e.hookName} hook blocking error from command: "${e.blockingError.command}": ${e.blockingError.blockingError}`,
      ),
      isMeta: true,
    }),
  ],

  // @590576 — a hook injected additional context (joined with newlines)
  hook_additional_context: (e: Extract<Attachment, { type: 'hook_additional_context' }>) => {
    if (e.content.length === 0) return []
    return [
      createUserMessage({
        content: wrapInSystemReminder(`${e.hookName} hook additional context: ${e.content.join('\n')}`),
        isMeta: true,
      }),
    ]
  },

  // @590588 — a hook stopped continuation
  hook_stopped_continuation: (e: Extract<Attachment, { type: 'hook_stopped_continuation' }>) => [
    createUserMessage({ content: wrapInSystemReminder(`${e.hookName} hook stopped continuation: ${e.message}`), isMeta: true }),
  ],

  // @590591 — local date rolled over (verbatim)
  date_change: (e: Extract<Attachment, { type: 'date_change' }>) =>
    wrapMessagesInSystemReminder([
      createUserMessage({
        content: `The date has changed. Today's date is now ${e.newDate}. DO NOT mention this to the user explicitly because they are already aware.`,
        isMeta: true,
      }),
    ]),

  // @590598 — "ultrathink" keyword present (verbatim)
  ultrathink_effort: () =>
    wrapMessagesInSystemReminder([
      createUserMessage({
        content:
          'The user included the keyword "ultrathink", requesting deeper reasoning on this turn. Reason as thoroughly as the task warrants.',
        isMeta: true,
      }),
    ]),

  // @590606 — "ultracode" keyword present → opt this turn into Workflow orchestration (verbatim)
  workflow_keyword_request: () =>
    wrapMessagesInSystemReminder([
      createUserMessage({
        content:
          'The user included the keyword "ultracode", opting this turn into multi-agent orchestration — use the Workflow tool to fulfill the request.',
        isMeta: true,
      }),
    ]),

  // @590614 — entered ultracode mode; full vs sparse reminder (both verbatim @590619/590620)
  ultra_effort_enter: ({ reminderType }: Extract<Attachment, { type: 'ultra_effort_enter' }>) =>
    wrapMessagesInSystemReminder([
      createUserMessage({
        content:
          reminderType === 'full'
            ? "Ultracode is on: optimize for the most exhaustive, correct answer — not the fastest or cheapest. Use the Workflow tool on every substantive task; token cost is not a constraint. See the Workflow tool's **Ultracode** section and quality patterns. Solo only on conversational/trivial turns."
            : 'Ultracode is still on — use the Workflow tool; see its Ultracode section.',
        isMeta: true,
      }),
    ]),

  // @590624 — exited ultracode mode (verbatim)
  ultra_effort_exit: () =>
    wrapMessagesInSystemReminder([
      createUserMessage({
        content: "Ultracode is off — the Workflow tool's standard opt-in rule applies again.",
        isMeta: true,
      }),
    ]),

  // ── NOOP allow-list within the map @590628-590641 ────────────────────────────────────────────────
  //   Types kept in the union for transcript-load compatibility but intentionally silent.
  dynamic_skill: () => [],
  already_read_file: () => [],
  command_permissions: () => [],
  edited_image_file: () => [],
  hook_cancelled: () => [],
  hook_error_during_execution: () => [],
  hook_non_blocking_error: () => [],
  hook_system_message: () => [],
  hook_permission_decision: () => [],
  hook_deferred_tool: () => [],
  goal_status: () => [],
  structured_output: () => [],
  max_turns_reached: () => [],
  teammate_shutdown_batch: () => [],
} as const

// --- PER_TYPE_RENDERERS helpers that build synthetic tool_use/result or delegate to a sub-builder ---
// helper: directory             → renderDirectory @590432 (K9t Bash ls + z9t Bash result)
declare function renderDirectory(e: Extract<Attachment, { type: 'directory' }>): UserMessage[]
// helper: selected_lines_in_ide → renderSelectedLinesInIde @590462 (content truncated at 2000 chars)
declare function renderSelectedLinesInIde(e: Extract<Attachment, { type: 'selected_lines_in_ide' }>): UserMessage[]
// helper: opened_file_in_ide    → renderOpenedFileInIde @590479
declare function renderOpenedFileInIde(e: Extract<Attachment, { type: 'opened_file_in_ide' }>): UserMessage[]
// helper: plan_file_reference   → renderPlanFileReference @590486
declare function renderPlanFileReference(e: Extract<Attachment, { type: 'plan_file_reference' }>): UserMessage[]
// helper: nested_memory         → renderNestedMemory @590499
declare function renderNestedMemory(e: Extract<Attachment, { type: 'nested_memory' }>): UserMessage[]
// helper: agent_mention         → renderAgentMention @590508
declare function renderAgentMention(e: Extract<Attachment, { type: 'agent_mention' }>): UserMessage[]
// helper: skill_listing         → renderSkillListing @590515
declare function renderSkillListing(e: Extract<Attachment, { type: 'skill_listing' }>): UserMessage[]
// helper: output_style          → renderOutputStyle @590526
declare function renderOutputStyle(e: Extract<Attachment, { type: 'output_style' }>): UserMessage[]
// helper: formatBytes = $a (human byte size); formatCount = au (human token count)
declare function formatBytes(n: number): string
declare function formatCount(n: number): string
