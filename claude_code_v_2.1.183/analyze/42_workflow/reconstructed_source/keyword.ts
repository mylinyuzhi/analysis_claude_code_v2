/**
 * ultracode keyword matcher, per-turn reminders, and the keyword-trigger setting.
 *
 * This is a readable-source reconstruction of the v2.1.183 `ultracode` keyword
 * opt-in subsystem. A user can opt a single turn into multi-agent orchestration
 * by typing the literal keyword `ultracode` (siblings: `ultraplan`, `ultrareview`).
 * The matcher (`matchKeyword`) masks code spans / quotes / brackets and rejects
 * path-glued or flag-glued hits so the trigger only fires on the word used as
 * English prose. When a regular user prompt contains the keyword (and the
 * `workflowKeywordTriggerEnabled` setting is on), the reminder pipeline injects a
 * `workflow_keyword_request` attachment telling the model to use the Workflow tool.
 *
 * ── Evidence (v2.1.183 obfuscated bundle — the only source of truth) ──────────
 *   PRIMARY: /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *     matcher family + delimiter map .......... cli_inner_pretty.js:464214-464290
 *       matchKeyword            hho  @464214
 *       findUltraplanKeyword    zWn  @464255
 *       findUltrareviewKeyword  Xel  @464258
 *       findUltracodeKeyword    yho  @464261
 *       hasUltraplanKeyword     Jel  @464264
 *       hasUltracodeKeyword     Qel  @464267
 *       stripUltraplanKeyword   KWn  @464270
 *       KEYWORD_DELIMITER_MAP   Yel  @464280 (initialized in module init @464279-464281)
 *     reminder injection (registration) ....... cli_inner_pretty.js:464664-464672
 *     makeWorkflowKeywordReminder o4p ......... cli_inner_pretty.js:464869-464872
 *     makeUltraEffortReminder     s4p ......... cli_inner_pretty.js:464873-464907
 *     workflow_keyword_request renderer ....... cli_inner_pretty.js:590606-590613
 *     isUltracodeKeywordTriggerEnabled Jyn .... cli_inner_pretty.js:148797-148799
 *     settings schema entries ................. cli_inner_pretty.js:55997-56012
 *       disableWorkflows @55997, enableWorkflows @56003, workflowKeywordTriggerEnabled @56008
 *     helpers re-verified:
 *       parseBoolean st @163, getMergedSettings mk @2090, logEvent G @3810,
 *       isWorkflowsEnabled Pw @148784, isWorkflowKeywordOrUltracodeEffort eZ @148901
 *
 * ── 2.1.88 convention mirror (named-TS shape; feature gated-out there) ─────────
 *   /lyz/codespace/3rd/claude-code/src/utils/messages.ts (createUserMessage + isMeta,
 *     wrapMessagesInSystemReminder @3101) — the renderer idiom.
 *   /lyz/codespace/3rd/claude-code/src/schemas/ — Zod v4 `.boolean().optional().describe(...)`.
 *   /lyz/codespace/3rd/claude-code/src/{tools,commands,tasks}.ts — `feature('WORKFLOW_SCRIPTS')`
 *     strips the whole subsystem externally; only the file layout is borrowed.
 *
 * ── 2.1.156 scaffold (readable logic + names; re-verified against 183) ─────────
 *   /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow/
 *     gate_caps_lifecycle_relations.md — Part 2 (Keyword Opt-In). The matcher body is
 *     byte-identical to v2.1.156 `Bg6`; only the keyword regex changed from `workflows?`
 *     to `ultracode` (plus the `ultraplan`/`ultrareview` siblings) and the new `Jyn` gate.
 *
 * ── Cross-validation note ─────────────────────────────────────────────────────
 *   Re-read every assigned 183 region; confirmed each anchor line literally contains
 *   the claimed code. `matchKeyword` (hho @464214) re-derived char-by-char including the
 *   `startsWith("/")` guard @464216, the single-quote word-boundary rule @464229/464233,
 *   and the `/ \ - ?` path/flag rejection @464248-464250. The telemetry id
 *   `tengu_workflow_keyword` and the attachment type `workflow_keyword_request` are
 *   unchanged identifiers (confirmed @464871 + @590606). The setting defaults ON via the
 *   `?? !0` at @148798. No invented behavior.
 *
 * Mapping (obf → readable), this file:
 *   hho→matchKeyword, zWn→findUltraplanKeyword, Xel→findUltrareviewKeyword,
 *   yho→findUltracodeKeyword, Jel→hasUltraplanKeyword, Qel→hasUltracodeKeyword,
 *   KWn→stripUltraplanKeyword, Yel→KEYWORD_DELIMITER_MAP, o4p→makeWorkflowKeywordReminder,
 *   s4p→makeUltraEffortReminder, Jyn→isUltracodeKeywordTriggerEnabled,
 *   st→parseBoolean, mk→getMergedSettings, G→logEvent, Pw→isWorkflowsEnabled,
 *   eZ→isWorkflowKeywordOrUltracodeEffort.
 */

import { z } from 'zod' // 2.1.88 convention: schemas/ use Zod v4 (`H` in the bundle @55997+)
import { getMergedSettings } from './settings.js' // mk @2090 — returns the merged settings record (or undefined)
import { parseBoolean } from './env.js' // st @163 — env truthiness
import { logEvent } from './telemetry.js' // G @3810
// Gate + effort readers all live in gate_and_effort.ts (Pw @148784, Jyn @148797, eZ @148901 —
// Jyn sits physically inside the 148777–148810 gate-reader cluster, so it is owned there).
import {
  isWorkflowsEnabled, // Pw @148784
  isUltracodeKeywordTriggerEnabled, // Jyn @148797
  isWorkflowKeywordOrUltracodeEffort, // eZ @148901
} from './gate_and_effort.js'

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

/** A single keyword hit inside a prompt, with the matched word and its span. */
export interface KeywordMatch {
  word: string
  start: number
  end: number
}

/** A masked region (code span / quoted span / bracket pair) to ignore matches inside. */
interface MaskedSpan {
  start: number
  end: number
}

/**
 * Per-turn reminder attachments this module can emit.
 * `workflow_keyword_request` is the model-facing nudge; its identifier is unchanged
 * from v2.1.156. `ultra_effort_enter`/`ultra_effort_exit` are emitted by the standing
 * ultracode reminder (`makeUltraEffortReminder`); their renderers live elsewhere.
 */
export type WorkflowKeywordAttachment =
  | { type: 'workflow_keyword_request' }
  | { type: 'ultra_effort_enter'; reminderType: 'full' | 'sparse' }
  | { type: 'ultra_effort_exit' }

// ──────────────────────────────────────────────────────────────────────────────
// Delimiter map — opening delimiter → its matching closing delimiter.
// Used by matchKeyword to mask code spans / quoted spans / bracket pairs so a
// keyword inside `code`, "a quote", <xml>, {obj}, [arr], (paren), or 'str' never
// triggers the opt-in. In the bundle this object is assigned in module init
// (var Yel; ... Yel = {...}) — reconstructed here as a plain const.
// ──────────────────────────────────────────────────────────────────────────────

// 2.1.183: KEYWORD_DELIMITER_MAP = Yel @464280 (declared @464278, assigned @464279-464281)
const KEYWORD_DELIMITER_MAP: Record<string, string> = {
  '`': '`',
  '"': '"',
  '<': '>',
  '{': '}',
  '[': ']',
  '(': ')',
  "'": "'",
}

// ──────────────────────────────────────────────────────────────────────────────
// Core matcher
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Find every occurrence of `keywordRegex` in `text` that is used as bare prose —
 * i.e. NOT inside a code span / quote / bracket pair, and NOT glued to a path or
 * CLI-flag character. Returns the matched spans (empty when there are none).
 *
 * Algorithm (two passes):
 *   1. Scan `text` once, tracking an open-delimiter stack of depth 1, to record the
 *      `[start, end)` ranges of all masked spans (backtick/quote/bracket regions).
 *   2. Run a `\b<kw>\b` global regex; for each hit, discard it if it falls inside any
 *      masked span or is adjacent to a path/flag character.
 *
 * 2.1.183 regions: cli_inner_pretty.js:464214-464253
 * 2.1.156 scaffold: gate_caps_lifecycle_relations.md Part 2.2 (`Bg6`; body byte-identical).
 * 2.1.88 convention: no equivalent (WORKFLOW_SCRIPTS stripped); shape borrowed from utils/.
 *
 * Mapping: hho→matchKeyword, e→text, t→keywordRegex, r→maskedSpans, o→openDelimiter,
 *          s→spanStart, i→isWordChar, a→matches, l→wordBoundaryRe, c→allHits,
 *          d→char, f→before, m→after, p→matchEnd.
 */
// 2.1.183: matchKeyword = hho @464214
export function matchKeyword(text: string, keywordRegex: string): KeywordMatch[] {
  // Fast bail-outs.
  if (!new RegExp(keywordRegex, 'i').test(text)) return [] // @464215 no occurrence at all
  if (text.startsWith('/')) return [] // @464216 slash commands are not prose

  // `\p{L}\p{N}_` = letter / number / underscore — a "word" character.
  const isWordChar = (ch: string | undefined): boolean => !!ch && /[\p{L}\p{N}_]/u.test(ch) // @464220

  // ── Pass 1: scan for masked spans (depth-1 delimiter stack). ──────────────────
  const maskedSpans: MaskedSpan[] = []
  let openDelimiter: string | null = null
  let spanStart = 0
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (openDelimiter) {
      // Inside an open span — wait for the matching close delimiter.
      if (openDelimiter === '[' && char === '[') {
        // `[[` resets the span start (e.g. wikilink / nested-bracket heuristic). @464224
        spanStart = i
        continue
      }
      if (char !== KEYWORD_DELIMITER_MAP[openDelimiter]) continue // @464228 not the closer yet
      // A `'` only closes when the next char is NOT a word char — so an apostrophe in
      // a contraction ("don't") doesn't prematurely close a string span. @464229
      if (openDelimiter === "'" && isWordChar(text[i + 1])) continue
      maskedSpans.push({ start: spanStart, end: i + 1 }) // @464230 close the span
      openDelimiter = null
    } else if (
      // `<` opens only when followed by a tag-ish char (`[a-zA-Z/]`) — so `a < b` math
      // doesn't open a phantom span. @464232
      (char === '<' && i + 1 < text.length && /[a-zA-Z/]/.test(text[i + 1])) ||
      // `'` opens only when the previous char is NOT a word char (start of a string,
      // not an apostrophe). @464233
      (char === "'" && !isWordChar(text[i - 1])) ||
      // Any other registered delimiter opens unconditionally. @464234
      (char !== '<' && char !== "'" && char in KEYWORD_DELIMITER_MAP)
    ) {
      openDelimiter = char
      spanStart = i
    }
  }

  // ── Pass 2: collect word-boundary hits outside masked spans / path-flag context. ─
  const matches: KeywordMatch[] = []
  const wordBoundaryRe = new RegExp(`\\b${keywordRegex}\\b`, 'gi') // @464239
  for (const hit of text.matchAll(wordBoundaryRe)) {
    if (hit.index === undefined) continue // @464242
    const start = hit.index
    const end = start + hit[0].length
    // Inside any masked span → skip. @464245
    if (maskedSpans.some(span => start >= span.start && start < span.end)) continue
    const before = text[start - 1]
    const after = text[end]
    // Glued to a path/flag char before → skip ("/ultracode", "\ultracode", "-ultracode"). @464248
    if (before === '/' || before === '\\' || before === '-') continue
    // Glued to a path/flag/query char after → skip ("ultracode/", "ultracode-", "ultracode?"). @464249
    if (after === '/' || after === '\\' || after === '-' || after === '?') continue
    // Member access / filename ("ultracode.foo") → skip. @464250
    if (after === '.' && isWordChar(text[end + 1])) continue
    matches.push({ word: hit[0], start, end })
  }
  return matches
}

// ──────────────────────────────────────────────────────────────────────────────
// Keyword-specific wrappers — one shared matcher, three keywords.
// ──────────────────────────────────────────────────────────────────────────────

// 2.1.183: findUltraplanKeyword = zWn @464255
export function findUltraplanKeyword(text: string): KeywordMatch[] {
  return matchKeyword(text, 'ultraplan')
}

// 2.1.183: findUltrareviewKeyword = Xel @464258
export function findUltrareviewKeyword(text: string): KeywordMatch[] {
  return matchKeyword(text, 'ultrareview')
}

// 2.1.183: findUltracodeKeyword = yho @464261
export function findUltracodeKeyword(text: string): KeywordMatch[] {
  return matchKeyword(text, 'ultracode')
}

// 2.1.183: hasUltraplanKeyword = Jel @464264
export function hasUltraplanKeyword(text: string): boolean {
  return findUltraplanKeyword(text).length > 0
}

// 2.1.183: hasUltracodeKeyword = Qel @464267
export function hasUltracodeKeyword(text: string): boolean {
  return findUltracodeKeyword(text).length > 0
}

/**
 * Remove the first `ultraplan` keyword from `text`, returning the cleaned prompt.
 *
 * Used when the keyword is consumed as an opt-in signal and should not be passed to
 * the model verbatim. Note the small grammar fix-up: a trailing "an " before the
 * keyword is rewritten to "a " (`/\b(a)n(\s+)$/i` → `$1$2`), and the matched word's
 * `"ultra"` prefix (5 chars) is dropped so e.g. "...an ultraplan" → "...a plan".
 * If removing the keyword leaves only whitespace, returns "".
 *
 * 2.1.183 region: cli_inner_pretty.js:464270-464277
 * Mapping: KWn→stripUltraplanKeyword, t→firstMatch, n→prefix, r→suffix.
 */
// 2.1.183: stripUltraplanKeyword = KWn @464270
export function stripUltraplanKeyword(text: string): string {
  const [firstMatch] = findUltraplanKeyword(text)
  if (!firstMatch) return text // @464272 nothing to strip
  let prefix = text.slice(0, firstMatch.start)
  const suffix = text.slice(firstMatch.end)
  if (!(prefix + suffix).trim()) return '' // @464275 keyword was the only content
  prefix = prefix.replace(/\b(a)n(\s+)$/i, '$1$2') // @464276 "an " → "a "
  return prefix + firstMatch.word.slice(5) + suffix // drop the "ultra" prefix → bare "plan"
}

// ──────────────────────────────────────────────────────────────────────────────
// Per-turn reminder makers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * If the prompt contains the `ultracode` keyword, emit telemetry and a single
 * `workflow_keyword_request` attachment (the model-facing nudge). Otherwise [].
 *
 * The telemetry id `tengu_workflow_keyword` and the attachment type
 * `workflow_keyword_request` are unchanged identifiers from v2.1.156.
 *
 * 2.1.183 region: cli_inner_pretty.js:464869-464872
 * 2.1.156 scaffold: gate_caps_lifecycle_relations.md Part 2.3 (`KR_`).
 * Mapping: o4p→makeWorkflowKeywordReminder, e→promptText, G→logEvent, Qel→hasUltracodeKeyword.
 */
// 2.1.183: makeWorkflowKeywordReminder = o4p @464869
export function makeWorkflowKeywordReminder(promptText: string | undefined): WorkflowKeywordAttachment[] {
  if (!promptText || !hasUltracodeKeyword(promptText)) return [] // @464870
  logEvent('tengu_workflow_keyword', {}) // @464871
  return [{ type: 'workflow_keyword_request' }]
}

/**
 * Standing-ultracode reminder. Walks the message history backwards to find the most
 * recent ultra-effort enter/exit attachment, then decides whether to (re)inject an
 * `ultra_effort_enter` (full or sparse) or an `ultra_effort_exit`:
 *
 *   - ultracode currently ON (eZ true), no prior `enter` since         → emit `enter` full
 *   - ultracode ON, already entered, ≥ N user turns since maintenance   → emit `enter` sparse
 *   - ultracode ON, already entered, < N turns                          → []
 *   - ultracode OFF, a prior `enter` is still open                      → emit `exit`
 *   - otherwise                                                         → []
 *
 * `reminderType: "full"` produces the long ultracode standing-orders text; `"sparse"`
 * is the short maintenance reminder (renderers in the reminder-renderer table).
 *
 * 2.1.183 region: cli_inner_pretty.js:464873-464907
 * Mapping: s4p→makeUltraEffortReminder, e→messages, t→sessionContext,
 *          eZ→isWorkflowKeywordOrUltracodeEffort, n→ultracodeActive, r→lastState,
 *          o→userTurnsSinceMaintenance, itl→ULTRA_EFFORT_CONFIG.
 */
// 2.1.183: makeUltraEffortReminder = s4p @464873
export function makeUltraEffortReminder(
  messages: HistoryMessage[] | undefined,
  sessionContext: SessionContext,
): WorkflowKeywordAttachment[] {
  // ultracode is "on" when the model+effort+option triad resolves to xhigh effort. @464874
  // eZ(model, effort, option) = option===true && isWorkflowsEnabled() && resolveEffort(model, effort)==="xhigh".
  const ultracodeActive = isWorkflowKeywordOrUltracodeEffort(
    sessionContext.options.mainLoopModel,
    getSessionEffort(sessionContext),
    getSessionUltracodeOption(sessionContext),
  )

  // Scan history backwards for the most recent ultra_effort enter/exit, counting
  // non-meta user turns since (for the sparse-maintenance cadence). @464877-464891
  let lastState: 'none' | 'enter' | 'exit' = 'none'
  let userTurnsSinceMaintenance = 0
  if (messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg === undefined) continue
      if (msg.type === 'attachment') {
        if (msg.attachment.type === 'ultra_effort_enter') {
          lastState = 'enter' // @464883
          break
        }
        if (msg.attachment.type === 'ultra_effort_exit') {
          lastState = 'exit' // @464887
          break
        }
      } else if (msg.type === 'user' && !msg.isMeta && !containsToolResult(msg.message.content)) {
        userTurnsSinceMaintenance++ // @464890 count real user turns
      }
    }
  }

  if (ultracodeActive) {
    // ultracode is on. @464892
    if (lastState !== 'enter') {
      // Not yet entered (or last was exit) → full standing-orders reminder. @464893
      logEvent('tengu_ultra_effort', { is_enter: true, is_full: true })
      return [{ type: 'ultra_effort_enter', reminderType: 'full' }]
    }
    if (userTurnsSinceMaintenance >= ULTRA_EFFORT_CONFIG.TURNS_BETWEEN_MAINTENANCE) {
      // Already entered, enough turns elapsed → sparse maintenance reminder. @464898
      logEvent('tengu_ultra_effort', { is_enter: true, is_full: false })
      return [{ type: 'ultra_effort_enter', reminderType: 'sparse' }]
    }
    return [] // entered recently, nothing to re-inject @464903
  }

  // ultracode is off. If we previously entered, emit a single exit. @464905
  if (lastState === 'enter') {
    logEvent('tengu_ultra_effort', { is_enter: false })
    return [{ type: 'ultra_effort_exit' }]
  }
  return [] // @464906
}

// ──────────────────────────────────────────────────────────────────────────────
// Reminder registration (how the makers plug into the attachment pipeline)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Build the workflow-keyword reminder registrations for one turn. These are added to
 * the attachment pipeline only when workflows are enabled (`isWorkflowsEnabled`).
 *
 * The keyword reminder fires only for a *regular* user prompt that hasn't suppressed
 * the keyword, and only when the `workflowKeywordTriggerEnabled` setting is on. It
 * matches against `preExpansionInput` — the raw text the user typed, BEFORE
 * slash-command / skill expansion — so an expanded macro can't inject or strip the
 * keyword. The standing ultracode reminder (`makeUltraEffortReminder`) fires for any
 * regular user prompt.
 *
 * `registerAttachment` (BA @464693) is the generic attachment-compute wrapper that
 * times each maker and swallows errors. This function reconstructs the two registrations
 * at cli_inner_pretty.js:464664-464672 (inside the larger reminder builder).
 *
 * Mapping: registerWorkflowKeywordReminders→(inline @464664-464672),
 *          BA→registerAttachment, Pw→isWorkflowsEnabled, Jyn→isUltracodeKeywordTriggerEnabled,
 *          o4p→makeWorkflowKeywordReminder, s4p→makeUltraEffortReminder,
 *          i→promptMeta, e→rawInput, o→messages, t→sessionContext.
 */
export function registerWorkflowKeywordReminders(
  rawInput: string,
  messages: HistoryMessage[] | undefined,
  sessionContext: SessionContext,
  promptMeta: PromptMeta | undefined,
  registerAttachment: AttachmentRegistrar,
): AttachmentRegistration[] {
  // @464664 only when workflows are enabled this session
  if (!isWorkflowsEnabled()) return []
  return [
    // @464666 keyword opt-in reminder
    registerAttachment('workflow_keyword_request', () =>
      Promise.resolve(
        // @464668 regular prompt + not suppressed + keyword-trigger setting on
        promptMeta?.isRegularUserPrompt &&
        !promptMeta.suppressWorkflowKeyword &&
        isUltracodeKeywordTriggerEnabled()
          ? makeWorkflowKeywordReminder(promptMeta.preExpansionInput ?? rawInput)
          : [],
      ),
    ),
    // @464671 standing ultracode enter/exit reminder
    registerAttachment('ultra_effort_enter', () =>
      Promise.resolve(promptMeta?.isRegularUserPrompt ? makeUltraEffortReminder(messages, sessionContext) : []),
    ),
  ]
}

// ──────────────────────────────────────────────────────────────────────────────
// Reminder renderer — what the model actually sees.
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Render the `workflow_keyword_request` attachment into the meta user message the
 * model receives. The text is verbatim from cli_inner_pretty.js:590609-590610.
 *
 * 2.1.183 region: cli_inner_pretty.js:590606-590613
 * 2.1.88 convention: utils/messages.ts — createUserMessage({ content, isMeta: true })
 *   wrapped by wrapMessagesInSystemReminder (Jp @bundle ≈ wrapMessagesInSystemReminder).
 * Mapping: workflow_keyword_request renderer→renderWorkflowKeywordRequest,
 *          Jp→wrapMessagesInSystemReminder, Rn→createUserMessage.
 */
export function renderWorkflowKeywordRequest(): UserMessage[] {
  return wrapMessagesInSystemReminder([
    createUserMessage({
      content:
        'The user included the keyword "ultracode", opting this turn into multi-agent orchestration — use the Workflow tool to fulfill the request.',
      isMeta: true,
    }),
  ])
}

// ──────────────────────────────────────────────────────────────────────────────
// The keyword-trigger setting
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Whether the `ultracode` keyword trigger is enabled. Reads the merged
 * `workflowKeywordTriggerEnabled` setting and defaults to ON when unset.
 *
 * This gate is consulted in two places: the keyword reminder registration
 * (`registerWorkflowKeywordReminders` @464668) and the prompt-editor input
 * highlight memo (cli_inner_pretty.js:622226). It is NEW in v2.1.183 — there is no
 * v2.1.156 ancestor; previously the keyword highlight/reminder were gated only by
 * `isWorkflowsEnabled`.
 *
 * 2.1.183 region: cli_inner_pretty.js:148797-148799
 * Mapping: Jyn→isUltracodeKeywordTriggerEnabled, mk→getMergedSettings,
 *          settings.workflowKeywordTriggerEnabled (the setting's own name).
 */
// 2.1.183: isUltracodeKeywordTriggerEnabled = Jyn @148797 — defined in gate_and_effort.ts (it sits
// inside the 148777–148810 gate-reader cluster) and imported at the top of this file. Its body is:
//   getMergedSettings()?.settings.workflowKeywordTriggerEnabled ?? true   (default ON; bundle: `?? !0`)
// Used by registerWorkflowKeywordReminders above (the `&& Jyn()` reminder gate).

// ──────────────────────────────────────────────────────────────────────────────
// Settings schema (Zod v4) — the three Workflow settings.
//
// These are entries in the larger settings object schema (`H` is Zod in the bundle).
// Reconstructed here as a standalone fragment to capture the exact `.describe(...)`
// strings, which are verbatim from cli_inner_pretty.js:55997-56012.
//
// 2.1.183 region: cli_inner_pretty.js:55997-56012
// 2.1.88 convention: schemas/ use `z.boolean().optional().describe(...)`.
// ──────────────────────────────────────────────────────────────────────────────

export const workflowSettingsSchemaFragment = {
  // @55997 — disableWorkflows
  disableWorkflows: z
    .boolean()
    .optional()
    .describe('Disable the Workflows feature (also via CLAUDE_CODE_DISABLE_WORKFLOWS).'),

  // @56003 — enableWorkflows
  enableWorkflows: z
    .boolean()
    .optional()
    .describe(
      'Enable or disable the Workflows feature for this user. Unset = default by plan once the feature is available.',
    ),

  // @56008 — workflowKeywordTriggerEnabled (NEW in v2.1.183)
  workflowKeywordTriggerEnabled: z
    .boolean()
    .optional()
    .describe(
      'Enable the "ultracode" keyword trigger: including the keyword in a prompt opts that turn into the Workflow tool. Set to false to disable the trigger. Default: true.',
    ),
}

// ──────────────────────────────────────────────────────────────────────────────
// Imported / cross-file types & helpers referenced above.
// Declared here for self-containment of this reconstruction; the real definitions
// live in the agent-loop / messages / settings modules.
// ──────────────────────────────────────────────────────────────────────────────

// Renderer helpers (2.1.88: utils/messages.ts).
declare function wrapMessagesInSystemReminder(messages: UserMessage[]): UserMessage[]
declare function createUserMessage(opts: { content: string; isMeta: boolean }): UserMessage
interface UserMessage {
  type: 'user'
  message: { content: string | unknown[] }
  isMeta?: boolean
}

// Reminder-pipeline plumbing (2.1.183: BA @464693 and the reminder builder @464655+).
type AttachmentRegistration = Promise<WorkflowKeywordAttachment[]>
type AttachmentRegistrar = (
  label: string,
  compute: () => Promise<WorkflowKeywordAttachment[]>,
) => AttachmentRegistration

/** The `i` argument at @464664 — per-turn prompt metadata. */
interface PromptMeta {
  isRegularUserPrompt?: boolean
  suppressWorkflowKeyword?: boolean
  /** Raw text the user typed, before slash-command/skill expansion. @464668 */
  preExpansionInput?: string
}

/** History entry; only the fields used by makeUltraEffortReminder are modeled. @464879-464890 */
type HistoryMessage =
  | { type: 'attachment'; attachment: { type: string } }
  | { type: 'user'; isMeta?: boolean; message: { content: unknown } }
  | { type: string; [key: string]: unknown }

/** Session context (the `t` arg at @464873). */
interface SessionContext {
  options: { mainLoopModel: string; [key: string]: unknown }
  [key: string]: unknown
}

// Effort/ultracode helpers referenced by makeUltraEffortReminder.
//   eZ(model, effort, option): n === true && Pw() && ZQ(model, effort) === "xhigh". @148902
//   So in s4p: eZ(model, Bg(ctx), zjn(ctx)) feeds eZ's 2nd/3rd args. @464874
//   getSessionEffort (Bg @460428): resolves effortValue through permission layers
//     (let t = ctx.getAppState().effortValue; for each effort layer t = layer.effort).
//     It is the effort VALUE (passed as ZQ's 2nd arg), not a boolean.
//   getSessionUltracodeOption (zjn @460448): ctx.getAppState().ultracode === true.
declare function getSessionEffort(ctx: SessionContext): string // Bg @460428 (returns effortValue)
declare function getSessionUltracodeOption(ctx: SessionContext): boolean // zjn @460448

/**
 * True when the content array contains a tool_result element (btl @465405:
 * `Array.isArray(content) && content.some(isToolResultElement)`, where the
 * predicate `_4p` @465402 = `typeof e==="object" && e!==null && e.type==="tool_result"
 * && typeof e.tool_use_id==="string"`). Used by makeUltraEffortReminder to skip
 * tool-result-bearing user turns when counting "real" prose user turns for the
 * maintenance cadence (`!btl(i.message.content)` @464890).
 */
// 2.1.183: containsToolResult = btl @465405 (renamed from the earlier misnomer isReminderOnlyContent —
// the predicate detects a tool_result element, it does NOT test for reminder-only content).
declare function containsToolResult(content: unknown): boolean

/**
 * Standing-ultracode cadence config (`itl`, exported as ULTRA_EFFORT_CONFIG @464596).
 * Verified value @466061: `itl = { TURNS_BETWEEN_MAINTENANCE: 10 }`. Its USE at
 * @464898 (`o >= itl.TURNS_BETWEEN_MAINTENANCE`) gates the sparse-maintenance reminder
 * after 10 non-reminder user turns since the last enter/maintenance.
 */
const ULTRA_EFFORT_CONFIG = { TURNS_BETWEEN_MAINTENANCE: 10 } as const
