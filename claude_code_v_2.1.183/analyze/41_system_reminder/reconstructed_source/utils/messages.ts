// ============================================================================
// utils/messages.ts — <system-reminder> PRIMITIVES (readable-source restoration)
// Claude Code v2.1.183
// ============================================================================
//
// 2.1.183 regions covered (all Read-verified against
//   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js):
//   - wrap primitives:
//       wrapInSystemReminder        TI    @589004-589008
//       wrapMessagesInSystemReminder Jp   @589078-589091
//       ensureSystemReminderWrap    bSf   @588027-588039
//       wrapMemoryAgeReminder       xOi   @220203-220208 (single-line variant)
//         memoryAgeReminderText     YWr   @220194-220201
//         memoryAgeInDays           EHd   @220191-220193
//   - extract primitives (identical anchored regex, two no-match conventions):
//       extractSystemReminderContent (returns-original) q0o @589021-589024
//       extractSystemReminderContent (history, ret-null) oKr @277246-277248
//   - strip primitives:
//       stripLeadingReminders            Rbl @587389-587397
//       stripLeadingReminders (guarded)  ePo @606156-606165  (NEW in 2.1.183)
//       stripAllReminders (regex→space)  _Ql @661920-661922
//       SYSTEM_REMINDER_CLOSE const      fyl @518148
//       index-loop strip (uses fyl)      inside Aef @518094-518101
//   - smoosh / merge final pass:
//       smooshSystemReminderSiblings     WNl @588040-588059
//       smooshIntoToolResult             G0o @588506-588536
//       isToolReferenceBlock             rne @462304-462306
//       mergeUserMessagesAndToolResults  Cx  @588170-588373 (gate tengu_chair_sermon)
//       mergeAdjacentUserMessages        KNl @588434-588449
//   - factory + trailer:
//       createUserMessage                Rn  @587504-587543 (isMeta)
//       NO_CONTENT_MESSAGE               Dw  @148106  ("(no content)")
//       AMBIENT_CONTEXT_TRAILER          _7n @590353-590354
//
// 2.1.88 CONVENTION MIRROR (shape/idiom only):
//   /lyz/codespace/3rd/claude-code/src/utils/messages.ts
//   (wrapInSystemReminder @3097, wrapMessagesInSystemReminder @3101,
//    ensureSystemReminderWrap @1797, smooshSystemReminderSiblings @1835,
//    smooshIntoToolResult @2534, createUserMessage @460);
//   components/messageActions.tsx @399 (stripSystemReminders / leading strip);
//   utils/transcriptSearch.ts @7,115 (SYSTEM_REMINDER_CLOSE index-loop strip);
//   utils/telemetry/betaSessionTracing.ts @149 (history-format extract copy).
//
// 2.1.156 SCAFFOLD (readable names + logic map):
//   claude_code_v_2.1.156/analyze/41_system_reminder/README.md
//   (S0/C_/DQ_/Az7/fi6/JN6/PG4/OD9/Nm4/hG4/Ai6/VQ_/T8/yT8).
//
// CROSS-VALIDATION: every primitive below was diffed byte-for-byte against the
// 2.1.183 bundle line(s) noted in its anchor; the two extract regexes are
// identical at both sites; the `tengu_chair_sermon` gate name and all slice
// constants (18 = "</system-reminder>".length) are unchanged from 2.1.156.
// The ONLY behavioral delta in this unit is the NEW guarded leading-strip `ePo`
// (early-return original + empty-string-preserving fallback) — see its anchor.
// ============================================================================

import type {
  ContentBlockParam,
  TextBlockParam,
  ToolResultBlockParam,
} from '@anthropic-ai/sdk/resources/index.mjs'
import { randomUUID, type UUID } from 'crypto'
import { checkStatsigFeatureGate_CACHED_MAY_BE_STALE } from '../services/analytics/growthbook.js'
import type {
  AssistantMessage,
  MessageOrigin,
  PartialCompactDirection,
  UserMessage,
} from '../types/message.js'
import type { PermissionMode } from '../types/permissions.js'
import { isToolReferenceBlock } from './toolSearch.js'

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

// 2.1.183: NO_CONTENT_MESSAGE = Dw @cli_inner_pretty.js:148106
// Placeholder substituted for empty user-message content so the API never
// receives an empty string. Verbatim: "(no content)".
export const NO_CONTENT_MESSAGE = '(no content)' // @148106

// 2.1.183: SYSTEM_REMINDER_CLOSE = fyl @cli_inner_pretty.js:518148
// The closing tag, used by the index-loop strip (stripRemindersInPlace below).
// Length 18 — the literal `+ 18` slice offset hard-coded in the leading-strip
// primitives is exactly "</system-reminder>".length.
const SYSTEM_REMINDER_CLOSE = '</system-reminder>' // @518148

// 2.1.183: AMBIENT_CONTEXT_TRAILER = _7n @cli_inner_pretty.js:590353-590354
// Hoisted "do not narrate" trailer appended to ambient-context reminders
// (referenced by the attachment renderers in attachments.ts). Hoisting it to a
// single module-scope const is the slimming win over inlining it per reminder.
// Verbatim (em-dash —): // @590354
export const AMBIENT_CONTEXT_TRAILER =
  'This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request.'

// The whole-string extract regex shared by BOTH extractSystemReminderContent
// variants. `^…$` enforce "the string is wholly a reminder"; the optional `\n?`
// on each side tolerates both the multiline wrapInSystemReminder form
// (`<system-reminder>\n…\n</system-reminder>`) and the single-line
// wrapMemoryAgeReminder form (`<system-reminder>…</system-reminder>`). // @589022,@277247
const SYSTEM_REMINDER_REGEX =
  /^<system-reminder>\n?([\s\S]*?)\n?<\/system-reminder>$/

// ----------------------------------------------------------------------------
// 1. Wrap primitives
// ----------------------------------------------------------------------------

// 2.1.183: wrapInSystemReminder = TI @cli_inner_pretty.js:589004-589008
// The canonical MULTILINE envelope — newline BEFORE and AFTER content. This is
// the form ~every reminder renderer emits (via wrapMessagesInSystemReminder).
// Byte-identical to 2.1.156 S0 and to 2.1.88 mirror (messages.ts:3097).
export function wrapInSystemReminder(content: string): string {
  return `<system-reminder>\n${content}\n</system-reminder>` // @589005-589007
}

// 2.1.183: wrapMessagesInSystemReminder = Jp @cli_inner_pretty.js:589078-589091
// List helper: wraps each string-content or `text`-block via wrapInSystemReminder;
// image/document/tool_use blocks pass through untouched. Nearly every dispatcher
// case calls it as Jp([Rn({ content, isMeta: true })]).
export function wrapMessagesInSystemReminder(
  messages: UserMessage[],
): UserMessage[] {
  return messages.map(msg => {
    if (typeof msg.message.content === 'string') {
      return {
        ...msg,
        message: {
          ...msg.message,
          content: wrapInSystemReminder(msg.message.content),
        },
      }
    } else if (Array.isArray(msg.message.content)) {
      const wrappedContent = msg.message.content.map(block => {
        // Only `text` blocks are wrapped; everything else is returned as-is. // @589083
        if (block.type === 'text') {
          return { ...block, text: wrapInSystemReminder(block.text) }
        }
        return block
      })
      return {
        ...msg,
        message: { ...msg.message, content: wrappedContent },
      }
    }
    return msg
  })
}

// 2.1.183: ensureSystemReminderWrap = bSf @cli_inner_pretty.js:588027-588039
// Idempotent, IDENTITY-PRESERVING final-pass re-wrap. Skips text that already
// starts with "<system-reminder>" and — crucially — returns the SAME object
// reference when nothing changed (the `changed` flag), so the merge driver can
// cheaply map every block without churning untouched messages.
// Called from the merge driver Cx @588352 when tengu_chair_sermon is ON.
export function ensureSystemReminderWrap(msg: UserMessage): UserMessage {
  const content = msg.message.content
  if (typeof content === 'string') {
    // @588030 — the only string-content early-return-identity check.
    if (content.startsWith('<system-reminder>')) return msg
    return {
      ...msg,
      message: { ...msg.message, content: wrapInSystemReminder(content) },
    }
  }
  let changed = false
  const newContent = content.map(block => {
    if (block.type === 'text' && !block.text.startsWith('<system-reminder>')) {
      changed = true
      return { ...block, text: wrapInSystemReminder(block.text) }
    }
    return block
  })
  // Return the original object when no block was rewritten. // @588038
  return changed
    ? { ...msg, message: { ...msg.message, content: newContent } }
    : msg
}

// 2.1.183: wrapMemoryAgeReminder = xOi @cli_inner_pretty.js:220203-220208
// The SINGLE-LINE `<system-reminder>${text}</system-reminder>\n` form (NO
// internal newlines) — wrap-only, used by the memory subsystem. Returns "" when
// the staleness content is empty (memory <= 1 day old). Only caller is the
// nested-memory attachment generator @463115 (`return xOi(t)`).
export function wrapMemoryAgeReminder(memoryTimestamp: number): string {
  const text = memoryAgeReminderText(memoryTimestamp)
  if (!text) return '' // @220205 — empty age content → emit nothing
  // Note: trailing newline AFTER the close tag, no newlines inside. // @220206-220207
  return `<system-reminder>${text}</system-reminder>\n`
}

// 2.1.183: memoryAgeReminderText = YWr @cli_inner_pretty.js:220194-220201
// The staleness marker text, fired only when the memory is more than 1 day old.
// VERBATIM string @220198-220200 (em-dash —):
export function memoryAgeReminderText(memoryTimestamp: number): string {
  const days = memoryAgeInDays(memoryTimestamp)
  if (days <= 1) return '' // @220196
  return (
    `This memory is ${days} days old. ` +
    'Memories are point-in-time observations, not live state — ' +
    'claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact.'
  )
}

// 2.1.183: memoryAgeInDays = EHd @cli_inner_pretty.js:220191-220193
// Whole days elapsed since `timestamp` (ms epoch), clamped at 0.
// 86400000 = 24 * 60 * 60 * 1000.
function memoryAgeInDays(timestamp: number): number {
  return Math.max(0, Math.floor((Date.now() - timestamp) / 86400000)) // @220192
}

// ----------------------------------------------------------------------------
// 2. Extract primitives (same anchored regex, two no-match conventions)
// ----------------------------------------------------------------------------

// 2.1.183: extractSystemReminderContent (returns-ORIGINAL) = q0o @cli_inner_pretty.js:589021-589024
// Returns the inner content when the WHOLE string is a reminder, else returns
// the ORIGINAL string unchanged. Used by the MCP-result reminder dedup (FSf
// @589025) and the per-block smoosh extractor @589071.
export function extractSystemReminderContent(text: string): string {
  const match = SYSTEM_REMINDER_REGEX.exec(text) // @589022
  return match ? match[1] : text
}

// 2.1.183: extractSystemReminderContentOrNull (history-format) = oKr @cli_inner_pretty.js:277246-277248
// The telemetry / beta-session-trace copy: trims input AND output, and returns
// `null` (not the original) on no-match — the convention the history formatter
// relies on to distinguish "this block IS a reminder" from real content.
// Mirror: 2.1.88 betaSessionTracing.ts:149.
export function extractSystemReminderContentOrNull(text: string): string | null {
  // @277247 — note the `.trim()` on input and the `?.[1]?.trim() || null`.
  return SYSTEM_REMINDER_REGEX.exec(text.trim())?.[1]?.trim() || null
}

// ----------------------------------------------------------------------------
// 3. Strip primitives
// ----------------------------------------------------------------------------

// 2.1.183: stripLeadingReminders = Rbl @cli_inner_pretty.js:587389-587397
// Repeatedly peel LEADING `<system-reminder>…</system-reminder>` blocks off the
// front of a string. 18 = "</system-reminder>".length. An unterminated opener
// (no close found) breaks the loop. ALWAYS returns the stripped result (may be
// "" if the whole string was reminders). Mirror: messageActions.tsx:399.
export function stripLeadingReminders(text: string): string {
  let rest = text.trimStart()
  while (rest.startsWith('<system-reminder>')) {
    const end = rest.indexOf('</system-reminder>')
    if (end < 0) break // unterminated tag → stop // @587393
    rest = rest.slice(end + 18).trimStart() // 18 = close-tag length // @587394
  }
  return rest
}

// 2.1.183: stripLeadingRemindersGuarded = ePo @cli_inner_pretty.js:606156-606165
//   ⚠️ NEW in 2.1.183 — this guard-then-fallback shape did NOT exist in 2.1.156
//   (grep for `if (!…startsWith("<system-reminder>")) return` on the 2.1.156
//    bundle = 0 matches).
// Two edges differ from stripLeadingReminders (Rbl):
//   (a) if the input does NOT start with a reminder, return the ORIGINAL `text`
//       (Rbl would still trimStart it);
//   (b) if peeling reminders leaves an EMPTY string, return the ORIGINAL `text`
//       (Rbl would return "").
// Both fallbacks are empty-string-preserving: this is invoked on string-content
// USER-MESSAGE ingestion/telemetry paths — CYn (the history-record normalizer
// @606174) and the inbound new-user-message path @689352 — where a message that
// was *only* a reminder must keep its text rather than become blank.
export function stripLeadingRemindersGuarded(text: string): string {
  let rest = text.trimStart()
  // (a) no leading reminder → return the original, untouched. // @606158
  if (!rest.startsWith('<system-reminder>')) return text
  while (rest.startsWith('<system-reminder>')) {
    const end = rest.indexOf('</system-reminder>')
    if (end < 0) break
    rest = rest.slice(end + 18).trimStart()
  }
  // (b) stripping emptied the string → fall back to the original. // @606164
  return rest === '' ? text : rest
}

// 2.1.183: stripAllReminders = _Ql @cli_inner_pretty.js:661920-661922
// Strip `<system-reminder>` OR `<task-notification>` blocks ANYWHERE in the
// string and replace each with a single SPACE. The `(<\/\1>|$)` alternation lets
// an UNTERMINATED trailing tag be nuked too (backreference `\1` matches whichever
// of the two openers matched). Used by the transcript-search/preview normalizer
// XF @661923 (which then collapses `<\/?[\w-]+>` and `\s+`).
export function stripAllReminders(text: string): string {
  // VERBATIM regex @661921 → replacement " " (one space).
  return text.replace(
    /<(system-reminder|task-notification)>[\s\S]*?(<\/\1>|$)/g,
    ' ',
  )
}

// 2.1.183: stripRemindersInPlace = index-loop inside Aef @cli_inner_pretty.js:518094-518101
// The SECOND strip-ANYWHERE form. Unlike stripAllReminders it splices each
// `<system-reminder>…</system-reminder>` slice out with NO replacement (output
// differs precisely there: nothing vs. a space). Repeats until no opener remains.
// The enclosing Aef builds a per-message-type search/digest string.
// Mirror: utils/transcriptSearch.ts:115.
export function stripRemindersInPlace(text: string): string {
  let result = text
  let open = result.indexOf('<system-reminder>')
  while (open >= 0) {
    const close = result.indexOf(SYSTEM_REMINDER_CLOSE, open)
    if (close < 0) break // @518097
    // splice the slice OUT — no space inserted. // @518098
    result =
      result.slice(0, open) + result.slice(close + SYSTEM_REMINDER_CLOSE.length)
    open = result.indexOf('<system-reminder>')
  }
  return result
}

// ----------------------------------------------------------------------------
// 4. Smoosh / merge final pass
// ----------------------------------------------------------------------------
//
// Why "smoosh": a content block sitting AFTER a tool_result renders on the wire
// as `</function_results>\n\nHuman:<…>`. Repeated mid-conversation this teaches
// the model to emit a bare `Human:` tail (a 3-token empty end_turn). The fix is
// to fold `<system-reminder>`-prefixed text siblings INTO the last tool_result's
// content instead of leaving them as separate blocks. (2.1.88 mirror @2604.)

// 2.1.183: isToolReferenceBlock = rne @cli_inner_pretty.js:462304-462306
// Type guard: an object block whose `type` is "tool_reference". Imported here
// from toolSearch.js in the real tree; reproduced inline for the contract.
// (Shown for completeness — the canonical decl is in toolSearch.ts.)
//   function isToolReferenceBlock(b: unknown): boolean {
//     return typeof b === 'object' && b !== null && 'type' in b
//       && (b as { type: string }).type === 'tool_reference'  // @462305
//   }

// 2.1.183: smooshIntoToolResult = G0o @cli_inner_pretty.js:588506-588536
// Folds `blocks` into a tool_result `tr`. Returns:
//   - `tr` unchanged when there is nothing to fold;
//   - `null` (DECLINES) when tr.content contains a tool_reference block — the API
//     forbids mixing folded text with tool_reference, so the caller must leave
//     the siblings standalone;
//   - otherwise the merged tool_result, collapsing adjacent text with "\n\n".
// is_error tool_results may only contain text blocks, so non-text incoming
// blocks are dropped first (the pasted image arrives as its own user turn anyway).
export function smooshIntoToolResult(
  tr: ToolResultBlockParam,
  blocks: ContentBlockParam[],
): ToolResultBlockParam | null {
  if (blocks.length === 0) return tr // @588507

  const existing = tr.content
  // tool_reference present → decline; caller keeps the siblings standalone. // @588509
  if (Array.isArray(existing) && existing.some(isToolReferenceBlock)) {
    return null
  }

  // API constraint: is_error tool_results must be all-text. // @588510-588512
  if (tr.is_error) {
    blocks = blocks.filter(b => b.type === 'text')
    if (blocks.length === 0) return tr
  }

  const allText = blocks.every(b => b.type === 'text')

  // Fast path: existing is string/undefined and all incoming blocks are text →
  // produce a single trimmed string joined by "\n\n" (the common hook-reminder
  // -into-Bash/Read-result case; preserves the legacy string output shape). // @588513-588516
  if (allText && (existing === undefined || typeof existing === 'string')) {
    const joined = [
      (existing ?? '').trim(),
      ...blocks.map(b => (b as TextBlockParam).text.trim()),
    ]
      .filter(Boolean)
      .join('\n\n')
    return { ...tr, content: joined }
  }

  // General path: normalize existing to an array, concat, merge adjacent text. // @588517+
  const base: ContentBlockParam[] =
    existing === undefined
      ? []
      : typeof existing === 'string'
        ? existing.trim()
          ? [{ type: 'text', text: existing.trim() }]
          : []
        : [...existing]

  const merged: ContentBlockParam[] = []
  for (const block of [...base, ...blocks]) {
    if (block.type === 'text') {
      const t = block.text.trim()
      if (!t) continue
      const prev = merged.at(-1)
      if (prev?.type === 'text') {
        // Collapse into the previous text block with a blank-line separator. // @588528
        merged[merged.length - 1] = { ...prev, text: `${prev.text}\n\n${t}` }
      } else {
        merged.push({ type: 'text', text: t })
      }
    } else {
      merged.push(block) // image / search_result / document — pass through
    }
  }
  return { ...tr, content: merged }
}

// 2.1.183: smooshSystemReminderSiblings = WNl @cli_inner_pretty.js:588040-588059
// Per-user-message pass: partition content into `<system-reminder>`-prefixed
// text (`srText`) vs. everything else (`kept`), then fold the srText INTO the
// LAST tool_result via smooshIntoToolResult. Skips messages with no tool_result
// and messages with no SR-text. If smooshIntoToolResult declines (tool_reference),
// the message is left untouched. Pure function of shape; idempotent.
export function smooshSystemReminderSiblings(
  messages: (UserMessage | AssistantMessage)[],
): (UserMessage | AssistantMessage)[] {
  return messages.map(msg => {
    if (msg.type !== 'user') return msg
    const content = msg.message.content
    if (!Array.isArray(content)) return msg
    if (!content.some(b => b.type === 'tool_result')) return msg // @588044

    const srText: TextBlockParam[] = []
    const kept: ContentBlockParam[] = []
    for (const block of content) {
      // SR discriminator: the "<system-reminder>" prefix (set by ensureSystemReminderWrap). // @588050
      if (block.type === 'text' && block.text.startsWith('<system-reminder>')) {
        srText.push(block)
      } else {
        kept.push(block)
      }
    }
    if (srText.length === 0) return msg

    // Fold into the LAST tool_result (positionally adjacent in the rendered prompt). // @588055
    const lastTrIdx = kept.findLastIndex(b => b.type === 'tool_result')
    const lastTr = kept[lastTrIdx] as ToolResultBlockParam
    const smooshed = smooshIntoToolResult(lastTr, srText)
    if (smooshed === null) return msg // tool_reference constraint — leave alone // @588057

    const newContent = [
      ...kept.slice(0, lastTrIdx),
      smooshed,
      ...kept.slice(lastTrIdx + 1),
    ]
    return { ...msg, message: { ...msg.message, content: newContent } }
  })
}

// 2.1.183: mergeAdjacentUserMessages = KNl @cli_inner_pretty.js:588434-588449
// Folds back-to-back user messages into one (via the content-merge helper
// `b7n`). Early-outs (returns the input array) when no two adjacent user
// messages exist, so the common case allocates nothing.
//   helper: b7n @588… (mergeUserContentBlocks) — concatenates two user messages'
//   content, applying the same tool_result smoosh as the merge driver.
export function mergeAdjacentUserMessages<T extends UserMessage | AssistantMessage>(
  messages: T[],
): T[] {
  let hasAdjacent = false
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].type === 'user' && messages[i - 1].type === 'user') {
      hasAdjacent = true
      break
    }
  }
  if (!hasAdjacent) return messages // @588441 — nothing to merge

  const result: T[] = []
  for (const msg of messages) {
    const prev = result.at(-1)
    if (msg.type === 'user' && prev?.type === 'user') {
      // result[last] = mergeUserContentBlocks(prev, msg)  // b7n @588446
      result[result.length - 1] = mergeUserMessages(prev as UserMessage, msg as UserMessage) as T
    } else {
      result.push(msg)
    }
  }
  return result
}

// helper: b7n @588… — merge two adjacent user messages.
// SUMMARIZED: concatenates the two messages' content arrays, smooshing any
// post-tool_result siblings into the trailing tool_result exactly like the
// gated path in the driver (see 2.1.88 mirror mergeUserContentBlocks @2600).
declare function mergeUserMessages(a: UserMessage, b: UserMessage): UserMessage

// 2.1.183: mergeUserMessagesAndToolResults = Cx @cli_inner_pretty.js:588170-588373
// The merge DRIVER for the API-bound message array. Walks the conversation,
// folding tool_results back next to their tool_use and collapsing trailing user
// messages. The `tengu_chair_sermon` Statsig gate (default false = OFF) controls
// the smoosh behavior at TWO sites:
//   • @588352 — when ON, ensure-wrap every block (ensureSystemReminderWrap) before
//     reducing them into the trailing user message; when OFF, pass them through.
//   • @588370 — when ON (and not the streaming short-circuit `r` branch), run
//     smooshSystemReminderSiblings over the merge-adjacent-user output.
// Final pass is always sanitizeErrorToolResultContent (SSf @588060).
//
// Full body SUMMARIZED (the load-bearing reminder-relevant tail is reconstructed):
export function mergeUserMessagesAndToolResults(
  messages: (UserMessage | AssistantMessage)[],
  tools: { name: string }[] = [],
  // streaming/partial-compact context; `r` below is derived from it.
  streamingContext?: unknown,
): (UserMessage | AssistantMessage)[] {
  // ... (588171-588351) per-message walk: pair tool_results to tool_uses, build
  //     the accumulator `A`, etc. SUMMARIZED — not reminder-specific.

  // --- tail @588352-588372 (verbatim logic) ---------------------------------
  // When the gate is ON, ensure-wrap each pending block before folding it into
  // the trailing user message; otherwise leave the blocks as-is. // @588352
  // const wrapped = ct('tengu_chair_sermon', false)
  //   ? pending.map(ensureSystemReminderWrap)
  //   : pending
  // const tail = last(A)
  // if (tail?.type === 'user') {
  //   A[A.length - 1] = wrapped.reduce((acc, m) => mergeUserMessages(acc, m), tail) // CSf @588374
  //   continue
  // }
  // A.push(...wrapped)
  //
  // ... normalization passes h4e → JSf → g4e → QSf produce `C` ...
  // let x
  // if (r) x = h ? xSf(C) : C                       // streaming short-circuit // @588368
  // else if (ct('tengu_chair_sermon', false))       // gate ON → smoosh // @588370
  //   x = smooshSystemReminderSiblings(mergeAdjacentUserMessages(C))
  // else x = C
  // return sanitizeErrorToolResultContent(x)        // SSf @588060 // @588372

  // Reconstructed reminder-relevant decision (the rest is summarized above):
  const gateOn = checkStatsigFeatureGate_CACHED_MAY_BE_STALE('tengu_chair_sermon') // @588352,@588370
  const normalized = messages // placeholder for the C produced by the walk above
  if (gateOn) {
    return sanitizeErrorToolResultContent(
      smooshSystemReminderSiblings(mergeAdjacentUserMessages(normalized)),
    )
  }
  return sanitizeErrorToolResultContent(normalized)
}

// helper: SSf @588060-588093 (sanitizeErrorToolResultContent) — strips non-text
// blocks out of is_error tool_results (API rejects mixed content when is_error),
// re-merging adjacent text. SUMMARIZED; mirror 2.1.88 messages.ts:1884.
declare function sanitizeErrorToolResultContent<T extends UserMessage | AssistantMessage>(
  messages: T[],
): T[]

// ----------------------------------------------------------------------------
// 5. User-message factory (isMeta)
// ----------------------------------------------------------------------------

// 2.1.183: createUserMessage = Rn @cli_inner_pretty.js:587504-587543
// The user-message factory. `isMeta` flags a message that is API-bound context
// but NOT shown in the UI transcript — every attachment reminder is created via
// `createUserMessage({ content, isMeta: true })`. Empty content falls back to
// NO_CONTENT_MESSAGE so the API never receives an empty user message.
// (2.1.183 head carries extra fields over 2.1.88: promptSource, interruptedMessageId,
//  now, uuidFn — injectable clock/uuid for deterministic replay.)
export function createUserMessage({
  content,
  isMeta,
  isVisibleInTranscriptOnly,
  isVirtual,
  isCompactSummary,
  summarizeMetadata,
  toolUseResult,
  mcpMeta,
  uuid,
  timestamp,
  imagePasteIds,
  sourceToolAssistantUUID,
  permissionMode,
  origin,
  promptSource,
  interruptedMessageId,
  now,
  uuidFn,
}: {
  content: string | ContentBlockParam[]
  isMeta?: true
  isVisibleInTranscriptOnly?: true
  isVirtual?: true
  isCompactSummary?: true
  toolUseResult?: unknown
  mcpMeta?: {
    _meta?: Record<string, unknown>
    structuredContent?: Record<string, unknown>
  }
  uuid?: UUID | string
  timestamp?: string
  imagePasteIds?: number[]
  sourceToolAssistantUUID?: UUID
  permissionMode?: PermissionMode
  summarizeMetadata?: {
    messagesSummarized: number
    userContext?: string
    direction?: PartialCompactDirection
  }
  origin?: MessageOrigin
  promptSource?: unknown
  interruptedMessageId?: string
  // Injectable clock / uuid for deterministic replay.
  now?: () => string
  uuidFn?: () => string
}): UserMessage {
  return {
    type: 'user',
    // @587526 — empty content → "(no content)" placeholder.
    message: { role: 'user', content: content || NO_CONTENT_MESSAGE },
    isMeta,
    isVisibleInTranscriptOnly,
    isVirtual,
    isCompactSummary,
    summarizeMetadata,
    uuid: (uuid as UUID | undefined) || (uuidFn ? (uuidFn() as UUID) : randomUUID()),
    timestamp: timestamp ?? (now ? now() : new Date().toISOString()),
    toolUseResult,
    mcpMeta,
    imagePasteIds,
    sourceToolAssistantUUID,
    permissionMode,
    origin,
    promptSource,
    interruptedMessageId,
  } as UserMessage
}
