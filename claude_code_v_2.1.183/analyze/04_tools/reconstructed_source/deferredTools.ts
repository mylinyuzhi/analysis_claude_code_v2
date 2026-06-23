/**
 * Deferred-tool loading machinery for ToolSearch (v2.1.183 readable-source restoration).
 *
 * Scope: the DEFERRAL MACHINERY unique to this unit — the 5-state deferred-tools
 * delta diff + the 4-section `<system-reminder>` rendering, `extractDiscoveredToolNames`
 * (with compact-boundary carry), the periodic `tool_search_usage_reminder` nudge,
 * `undiscoveredToolHint`, the juniper_shoal config surface, and the `defer_loading`
 * wire field. The 8 symbols shared with the registered ToolSearch tool object
 * (`isDeferredTool`, `getPrompt`, `TOOL_SEARCH_TOOL_NAME`, `formatDeferredToolLine`,
 * `getNonDeferrableBuiltins`, `parseToolName`, `compileTermPatterns`,
 * `searchToolsWithKeywords`) are SINGLE-SOURCED in `tools/ToolSearchTool.ts` and
 * re-exported from this file. The ToolSearch TOOL OBJECT itself (its `call()`, schemas,
 * `mapToolResultToToolResultBlockParam`) is reconstructed in that same unit; only the
 * unique machinery + verbatim reminder text live here.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - extractDiscoveredToolNames         eX   :462320-462346
 *   - getDeferredToolsDelta              Qgo  :462347-462403 (5-state diff)
 *   - summarizeByServerPrefix            xWn  :462404-462413
 *   - deferred_tools_delta reminder      —    :589470-589511 (4-section render)
 *   - tool_search_usage_reminder build   wtl  :465778-465820 (NEW) + counters C4p :465755
 *   - tool_search_usage_reminder render  —    :589323-589334 (NEW)
 *   - undiscoveredToolHint               G$p  :437133-437148 (now appends inline schema)
 *   - getToolSearchConfig / reminder cfg Dkt/B1r :147759-147786 (juniper_shoal, NEW)
 *   - defer_loading wire stamp           —    :581339 / filter :582534 / assembly :582412-582457
 *   - AMBIENT_CONTEXT_NOTE               _7n  :590353-590354
 *   - DEFERRED_DELTA_LIST_CAP (30)       Sae  :462436
 *
 * 2.1.88 convention mirror: src/tools/ToolSearchTool/{ToolSearchTool.ts,prompt.ts,constants.ts}
 *   (parseToolName/compileTermPatterns/searchToolsWithKeywords shapes, isDeferredTool/getPrompt).
 * 2.1.156 scaffold: 04_tools/deferred_tools.md (readable names: isDeferredTool pp, getPrompt r18,
 *   getDeferredToolsDelta tg6, extractDiscoveredToolNames P8H, etc.).
 *
 * Cross-validation note: every function/branch/string below was re-read at its 2.1.183 line in
 * the bundle (the dossier _anchors_deferral_toolsearch.md is the spec; spot-checked G2, c1i, own,
 * uUi, dUi scorer, Qgo, eX, the 589470-589511 reminder, wtl, G$p, the 581339 stamp and 582412+
 * assembly — all match). Seven confirmed deltas vs 2.1.156 are flagged inline with `// DELTA`.
 *
 * SSOT NOTE (cross-file coherence — DEDUP APPLIED): this file and `tools/ToolSearchTool.ts`
 * both conceptually live in `tools/ToolSearchTool/` and formerly DUPLICATED the top-level
 * definitions of eight SAME-id bundle symbols — `isDeferredTool` (G2 @222307),
 * `getPrompt` (own @222325), `TOOL_SEARCH_TOOL_NAME` (DA @221267),
 * `formatDeferredToolLine` (k5r @222322), `getNonDeferrableBuiltins` (c1i @221201),
 * `parseToolName` (uUi @230273), `compileTermPatterns` (nId @230289), and
 * `searchToolsWithKeywords` (dUi @230294). `ToolSearchTool.ts` is the canonical home (it builds
 * the registered tool object and is imported by the registry); this module had no in-tree importer.
 * The single-definition cleanup is now APPLIED: those eight symbols are DEFINED ONCE in
 * `tools/ToolSearchTool.ts` (each `export`ed there) and re-exported from this file (see the grouped
 * `export { … } from './ToolSearchTool.js'` near the imports). The three used internally here
 * (`isDeferredTool`, `TOOL_SEARCH_TOOL_NAME`, `formatDeferredToolLine`) are imported from there too.
 * getPrompt was verified to be the SAME function in both files (both reconstruct `own()` =
 * `xvd + (qmi() ? Lvd : kvd) + Dvd`, identical return string), so it was collapsed, not renamed.
 * The dependency is one-directional and acyclic (A imports from B; B never imports from A).
 * `getToolDescriptionMemoized` (oCn) is the description-cache helper used by the scorer, which now
 * also lives in `tools/ToolSearchTool.ts` (the scorer it served moved there with the collapse).
 */

import { z } from 'zod/v4'
import {
  type Tool,
  type Tools,
  type ToolUseContext,
} from '../../Tool.js'
import { logEvent } from '../../services/analytics/index.js'
import { logForDebugging } from '../../utils/debug.js'
import { uniq } from '../../utils/array.js'
import { getClientConfigCache } from '../../services/clientConfig.js'
import {
  isToolSearchEnabledOptimistic,
  isToolSearchToolAvailable,
  modelSupportsToolReference,
  getToolSearchMode,
} from '../../utils/toolSearch.js'
// SSOT: the 8 colliding symbols (same bundle ids) live in ToolSearchTool.ts — the
// canonical home that builds the registered tool object. Import the ones this module
// uses internally, then re-export the whole set below so external importers can reach
// them through either unit. (Acyclic: A imports from B; B never imports from A.)
import {
  isDeferredTool,
  TOOL_SEARCH_TOOL_NAME,
  formatDeferredToolLine,
} from './ToolSearchTool.js'

// Grouped re-export of the formerly-duplicated definitions (now single-sourced in B).
// Provenance preserved per symbol (obf @ bundle line):
//   isDeferredTool            G2  @cli_inner_pretty.js:222307-222321
//   TOOL_SEARCH_TOOL_NAME     DA  @cli_inner_pretty.js:221267
//   formatDeferredToolLine    k5r @cli_inner_pretty.js:222322-222324
//   getNonDeferrableBuiltins  c1i @cli_inner_pretty.js:221201-221217
//   getPrompt                 own @cli_inner_pretty.js:222325-222327
//   parseToolName             uUi @cli_inner_pretty.js:230273-230288
//   compileTermPatterns       nId @cli_inner_pretty.js:230289-230293
//   searchToolsWithKeywords   dUi @cli_inner_pretty.js:230294-230362
export {
  isDeferredTool,
  TOOL_SEARCH_TOOL_NAME,
  formatDeferredToolLine,
  getNonDeferrableBuiltins,
  getPrompt,
  parseToolName,
  compileTermPatterns,
  searchToolsWithKeywords,
} from './ToolSearchTool.js'

// ============================================================================
// Identity constants
// ============================================================================
//
// TOOL_SEARCH_TOOL_NAME (DA @221267) is re-exported from ToolSearchTool.ts above
// (single home) and imported there for this module's internal use.

// 2.1.183: DEFERRED_DELTA_LIST_CAP = Sae @cli_inner_pretty.js:462436 — beyond this many names,
// summarize rather than list line-by-line in reminders.
const DEFERRED_DELTA_LIST_CAP = 30 // @462436

// 2.1.183: AMBIENT_CONTEXT_NOTE = _7n @cli_inner_pretty.js:590353-590354
const AMBIENT_CONTEXT_NOTE =
  'This is ambient context — do not narrate it to the user unless they ask or it is directly relevant to their request.' // @590354

// ============================================================================
// 1-3. Deferral ladder, prompt text, keyword scorer — SINGLE-SOURCED IN B
// ============================================================================
//
// `isDeferredTool` (G2 @222307), `getNonDeferrableBuiltins` (c1i @221201),
// `formatDeferredToolLine` (k5r @222322), `getPrompt` (own @222325 — the
// xvd+(qmi()?Lvd:kvd)+Dvd concatenation), and the keyword scorer trio
// `parseToolName` (uUi @230273) / `compileTermPatterns` (nId @230289) /
// `searchToolsWithKeywords` (dUi @230294) are DEFINED ONCE in
// `tools/ToolSearchTool.ts` (the canonical home that builds the registered tool
// object) and re-exported at the top of this file. This module imports the three
// it uses internally — `isDeferredTool`, `TOOL_SEARCH_TOOL_NAME`,
// `formatDeferredToolLine` — from there. No bodies are duplicated here.
//
// The ladder-gate helpers (isRemoteTriggerEntrypoint wen, isKairosLoopDynamicEnabled
// jAe, the fork-subagent accessor) and the prompt fragments (xvd/kvd/Lvd/Dvd) live
// alongside their single owner in ToolSearchTool.ts.

// ============================================================================
// 4. Compact-aware discovered-tool extraction — extractDiscoveredToolNames
// ============================================================================

// Type guards over message content blocks (@462304-462318).
// helper: rne @462304-462306 — isToolReferenceBlock: block.type === "tool_reference"
// f3p @462307-462309 — a tool_reference block WITH a string `tool_name`
function isToolReferenceBlockWithName(
  block: unknown,
): block is { type: 'tool_reference'; tool_name: string } {
  return (
    typeof block === 'object' &&
    block !== null &&
    (block as { type?: string }).type === 'tool_reference' &&
    typeof (block as { tool_name?: unknown }).tool_name === 'string'
  )
}
// m3p @462310-462318 — a tool_result block whose `content` is an array
function isToolResultBlockWithContent(
  block: unknown,
): block is { type: 'tool_result'; content: unknown[] } {
  return (
    typeof block === 'object' &&
    block !== null &&
    (block as { type?: string }).type === 'tool_result' &&
    Array.isArray((block as { content?: unknown }).content)
  )
}

/**
 * Scan the message history for the set of deferred-tool names whose schemas have already been
 * loaded (discovered) via ToolSearch. A tool is "discovered" once a `tool_reference` block bearing
 * its name appears in some user-side tool_result. This set drives request assembly: only discovered
 * deferred tools get their full schema re-sent each turn.
 *
 * Compact carry: when a `compact_boundary` system message is reached, the names recorded in
 * `compactMetadata.preCompactDiscoveredTools` are folded in — so discovered tools survive a compact
 * even though the tool_reference blocks that introduced them were summarized away.
 *
 * 2.1.183: extractDiscoveredToolNames = eX @cli_inner_pretty.js:462320-462346 (byte-identical to 2.1.156 P8H)
 */
export function extractDiscoveredToolNames(messages: AnyMessage[]): Set<string> {
  const discovered = new Set<string>()
  let carriedFromCompact = 0
  for (const message of messages) {
    // Compact boundary: fold in the pre-compact snapshot. @462324-462331
    if (message.type === 'system' && message.subtype === 'compact_boundary') {
      const snapshot = message.compactMetadata?.preCompactDiscoveredTools
      if (snapshot) {
        for (const name of snapshot) discovered.add(name)
        carriedFromCompact += snapshot.length
      }
      continue
    }
    if (message.type !== 'user') continue
    const content = message.message?.content
    if (!Array.isArray(content)) continue
    for (const block of content) {
      if (isToolResultBlockWithContent(block)) {
        for (const inner of block.content)
          if (isToolReferenceBlockWithName(inner)) discovered.add(inner.tool_name) // @462337
      }
    }
  }
  if (discovered.size > 0)
    logForDebugging(
      `Dynamic tool loading: found ${discovered.size} discovered tools in message history` +
        (carriedFromCompact > 0 ? ` (${carriedFromCompact} carried from compact boundary)` : ''),
    ) // @462342-462343
  return discovered
}
// Mapping: eX→extractDiscoveredToolNames, m3p→isToolResultBlockWithContent,
//   f3p→isToolReferenceBlockWithName
// Note: snapshot WRITE sites @453446 / @460782 / @461008
//   (compactMetadata.preCompactDiscoveredTools = [...names].sort());
//   serialization key `pre_compact_discovered_tools` @529632 / @529654.

// ============================================================================
// 5. The deferred-tools delta protocol — getDeferredToolsDelta (5-state diff)
// ============================================================================

interface DeferredDeltaAttachment {
  /** Names announced as added in this attachment. */
  addedNames: string[]
  /** Per-tool display lines (currently just the names). */
  addedLines: string[]
  /** Names announced as removed. */
  removedNames: string[]
  /** Names that were re-added (MCP server reconnected after announcing earlier). */
  readdedNames: string[]
  /** Optional: MCP servers still connecting. */
  pendingMcpServers?: string[]
}

/**
 * Diff the CURRENT deferred-tool pool against everything previously announced in `deferred_tools_delta`
 * attachments, producing a 5-faceted delta the model needs to keep its mental tool inventory current.
 *
 * The five facets:
 *   1. added      — deferred tools never announced before
 *   2. addedLines — display lines for the unlisted-this-conversation tools (drives the ADDED reminder)
 *   3. removed    — previously-announced names GONE from the whole pool (MCP server disconnected)
 *   4. readded    — names being re-announced after having dropped out (server reconnected)
 *   5. pendingChanged — the set of still-connecting MCP servers changed
 *
 * Crucial invariant — "undeferred → silent": a tool only counts as REMOVED if it left the WHOLE pool
 * `p` (i.e. truly disappeared), NOT merely if it stopped deferring (left the deferred set `d`). A tool
 * that flips from deferred to eager is still present and must not be reported as removed. @462370-462373
 *
 * Returns `null` when nothing changed (no reminder needed).
 *
 * 2.1.183: getDeferredToolsDelta = Qgo @cli_inner_pretty.js:462347-462403 (byte-identical 5-facet diff to 2.1.156 tg6)
 */
export function getDeferredToolsDelta(
  tools: Tools,
  messages: AnyMessage[],
  diagnostics: { callSite?: string; querySource?: string } | undefined,
  pendingMcpServers: string[] | undefined,
): DeferredDeltaAttachment | null {
  // --- Replay prior delta attachments to reconstruct the announced/readded/lastPending state. ---
  const announced = new Set<string>() // o — every name ever announced (minus subsequent removals)
  const everReadded = new Set<string>() // s — names announced WITHOUT being in their readded list
  let lastPending: string[] = [] // i — last announced pending-server list
  let attachmentCount = 0 // a
  let dtdCount = 0 // l
  const attachmentTypesSeen = new Set<string>() // c

  for (const m of messages) {
    if (m.type !== 'attachment') continue
    attachmentCount++
    attachmentTypesSeen.add(m.attachment.type) // @462356
    if (m.attachment.type !== 'deferred_tools_delta') continue
    dtdCount++
    const readdedHere = new Set<string>(m.attachment.readdedNames ?? [])
    for (const name of m.attachment.addedNames) {
      announced.add(name)
      if (!readdedHere.has(name)) everReadded.add(name) // @462359
    }
    for (const name of m.attachment.removedNames) announced.delete(name) // @462360
    if (m.attachment.pendingMcpServers !== undefined)
      lastPending = m.attachment.pendingMcpServers // @462361
  }

  // --- Compute the current state. ---
  const currentDeferred = tools.filter(isDeferredTool) // u @462363
  const deferredNames = new Set(currentDeferred.map(t => t.name)) // d
  const allPoolNames = new Set(tools.map(t => t.name)) // p — whole pool, deferred or not

  const added = currentDeferred.filter(t => !announced.has(t.name)) // f @462366
  const unlisted = currentDeferred.filter(t => !everReadded.has(t.name)) // m @462367 — addedLines source
  const readded = added.filter(t => everReadded.has(t.name)).map(t => t.name) // A @462368

  const removed: string[] = [] // g
  for (const name of announced) {
    if (deferredNames.has(name)) continue // still deferred → present
    if (!allPoolNames.has(name)) removed.push(name) // gone from whole pool → truly removed @462372
    // else: undeferred (still in pool) → SILENT
  }

  // --- Pending-server change detection. ---
  const sortedPending = pendingMcpServers !== undefined ? [...pendingMcpServers].sort() : [] // h
  const pendingChanged =
    pendingMcpServers !== undefined &&
    (sortedPending.length !== lastPending.length ||
      sortedPending.some((s, idx) => s !== lastPending[idx])) // y @462375

  // No change → no reminder.
  if (added.length === 0 && removed.length === 0 && unlisted.length === 0 && !pendingChanged)
    return null // @462376

  const addedNames = uniq([...added, ...unlisted].map(t => t.name)) // _ @462377

  // Telemetry: every diff is logged with diagnostics so the delta protocol can be audited (inc-4747). @462379-462393
  logEvent('tengu_deferred_tools_pool_change', {
    addedCount: added.length,
    readdedCount: readded.length,
    unlistedCount: unlisted.length,
    removedCount: removed.length,
    pendingChanged,
    pendingCount: sortedPending.length,
    lastPendingCount: lastPending.length,
    priorAnnouncedCount: announced.size,
    messagesLength: messages.length,
    attachmentCount,
    dtdCount,
    callSite: diagnostics?.callSite ?? 'unknown',
    querySource: diagnostics?.querySource ?? 'unknown',
    attachmentTypesSeen: [...attachmentTypesSeen].sort().join(','),
  })

  return {
    addedNames: addedNames.sort(),
    addedLines: unlisted.map(formatDeferredToolLine).sort(), // @462397
    removedNames: removed.sort(),
    readdedNames: readded.sort(),
    ...(pendingMcpServers !== undefined && { pendingMcpServers: sortedPending }),
  }
}
// Mapping: Qgo→getDeferredToolsDelta, G2→isDeferredTool, k5r→formatDeferredToolLine,
//   ms→uniq, G→logEvent
// Note: delta attachment registered @464630 (BA("deferred_tools_delta", …)) and
//   emitted @464914 ([{ type: "deferred_tools_delta", ... }]).

/**
 * Collapse a list of MCP tool names into `mcp__<server>__*` groups with counts, so a server with
 * many tools reads as one line. e.g. ["mcp__slack__a","mcp__slack__b"] → "mcp__slack__* (2)".
 *
 * 2.1.183: summarizeByServerPrefix = xWn @cli_inner_pretty.js:462404-462413
 */
function summarizeByServerPrefix(names: string[]): string {
  const groups = new Map<string, number>()
  for (const name of names) {
    const key = name.startsWith('mcp__') ? `${name.split('__', 2).join('__')}__*` : name // @462407
    groups.set(key, (groups.get(key) ?? 0) + 1)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => (count > 1 ? `${key} (${count})` : key))
    .join(', ')
}
// Mapping: xWn→summarizeByServerPrefix

// ============================================================================
// 6. System-reminder rendering for the deferred-tools delta (4 sections)
// ============================================================================

/**
 * Render a `deferred_tools_delta` attachment into a `<system-reminder>` message. Four optional
 * sections, in fixed order: ADDED, RE-ADDED, REMOVED (+ ambient note), PENDING. All four strings
 * are verbatim and byte-identical to 2.1.156.
 *
 * 2.1.183: deferred_tools_delta render @cli_inner_pretty.js:589470-589511
 */
export function renderDeferredToolsDelta(
  delta: DeferredDeltaAttachment,
): SystemReminderMessage[] {
  const sections: string[] = []

  // --- Section 1: ADDED. The core announcement. Names the failure mode + the select: recipe. @589472-589475
  if (delta.addedLines.length > 0) {
    sections.push(
      `The following deferred tools are now available via ${TOOL_SEARCH_TOOL_NAME}. Their schemas are NOT loaded — calling them directly will fail with InputValidationError. Use ${TOOL_SEARCH_TOOL_NAME} with query "select:<name>[,<name>...]" to load tool schemas before calling them:\n${delta.addedLines.join('\n')}`,
    )
  }

  // --- Section 2: RE-ADDED (MCP server reconnected). @589476-589480
  const readded = delta.readdedNames ?? []
  if (readded.length > 0) {
    sections.push(
      `${readded.length} deferred tool${readded.length === 1 ? ' is' : 's are'} available again (MCP server reconnected — names announced earlier in this conversation): ${summarizeByServerPrefix(readded)}. Load via ${TOOL_SEARCH_TOOL_NAME} as before.`,
    )
  }

  // --- Section 3: REMOVED (summarized if > 30) + ambient-context note. @589481-589489
  if (delta.removedNames.length > 0) {
    sections.push(
      delta.removedNames.length > DEFERRED_DELTA_LIST_CAP
        ? `${delta.removedNames.length} deferred tools are no longer available (MCP server disconnected): ${summarizeByServerPrefix(delta.removedNames)}. Do not search for them — ${TOOL_SEARCH_TOOL_NAME} will return no match.`
        : `The following deferred tools are no longer available (their MCP server disconnected). Do not search for them — ${TOOL_SEARCH_TOOL_NAME} will return no match:\n${delta.removedNames.join('\n')}`,
    )
    sections.push(AMBIENT_CONTEXT_NOTE) // @589489
  }

  // --- Section 4: PENDING (servers still connecting). @589490-589501
  const pending = delta.pendingMcpServers ?? []
  if (pending.length > 0) {
    const listing =
      pending.length > DEFERRED_DELTA_LIST_CAP
        ? `${pending.slice(0, DEFERRED_DELTA_LIST_CAP).join(', ')}, …and ${pending.length - DEFERRED_DELTA_LIST_CAP} more`
        : pending.join('\n')
    sections.push(
      `The following MCP servers are still connecting — their tools (typically named mcp__<server>__*) are not yet available but will appear shortly:\n${listing}\n\nIf the user's request might be served by one of these servers (even if they didn't name it explicitly), call ${TOOL_SEARCH_TOOL_NAME} with a relevant keyword — ${TOOL_SEARCH_TOOL_NAME} will wait for connecting servers and search their tools once available. Do not report a capability as unavailable without first searching.`,
    )
  }

  if (sections.length === 0) return []
  return wrapAsSystemReminder([makeMetaMessage(sections.join('\n\n'))]) // @589503
}
// Mapping: DA→TOOL_SEARCH_TOOL_NAME, xWn→summarizeByServerPrefix, Sae→DEFERRED_DELTA_LIST_CAP,
//   _7n→AMBIENT_CONTEXT_NOTE, Jp→wrapAsSystemReminder, Rn→makeMetaMessage

// ============================================================================
// 7. Periodic nudge — tool_search_usage_reminder (NEW, juniper_shoal config)
// ============================================================================

/**
 * Walk the message history backwards counting two "turns since" metrics used by the periodic
 * ToolSearch nudge:
 *   - turnsSinceLastToolSearch: assistant turns since the model last emitted a ToolSearch tool_use
 *   - turnsSinceLastReminder:   turns since the last `tool_search_usage_reminder` attachment
 *
 * 2.1.183: getTurnsSinceCounters = C4p @cli_inner_pretty.js:465755-465777 (NEW)
 */
function getTurnsSinceCounters(messages: AnyMessage[]): {
  turnsSinceLastToolSearch: number
  turnsSinceLastReminder: number
} {
  let lastToolSearchIdx = -1
  let lastReminderIdx = -1
  let turnsSinceLastToolSearch = 0
  let turnsSinceLastReminder = 0
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m?.type === 'assistant') {
      if (isSyntheticAssistant(m)) continue // n5n @465763
      if (
        lastToolSearchIdx === -1 &&
        'message' in m &&
        Array.isArray(m.message?.content) &&
        m.message.content.some(
          c => c.type === 'tool_use' && c.name === TOOL_SEARCH_TOOL_NAME,
        )
      )
        lastToolSearchIdx = i // @465764-465770
      if (lastToolSearchIdx === -1) turnsSinceLastToolSearch++
      if (lastReminderIdx === -1) turnsSinceLastReminder++
    } else if (
      lastReminderIdx === -1 &&
      m?.type === 'attachment' &&
      m.attachment.type === 'tool_search_usage_reminder'
    ) {
      lastReminderIdx = i // @465773
    }
    if (lastToolSearchIdx !== -1 && lastReminderIdx !== -1) break
  }
  return { turnsSinceLastToolSearch, turnsSinceLastReminder }
}
// Mapping: C4p→getTurnsSinceCounters, n5n→isSyntheticAssistant

interface ToolSearchUsageReminderAttachment {
  type: 'tool_search_usage_reminder'
  undiscoveredToolNames: string[]
  undiscoveredCount: number
}

/**
 * Every-N-turns nudge: if it has been a while since the model last used ToolSearch (and since the
 * last nudge), and there are deferred tools whose schemas it has never loaded, gently remind it that
 * those capabilities exist behind ToolSearch — so it doesn't conclude a capability is missing and
 * build a workaround. Returns `[]` (no attachment) when any guard fails, logging a skip reason on the
 * cadence boundary.
 *
 * DELTA: NEW in 2.1.183 (before-grep `tool_search_usage_reminder` and `tengu_juniper_shoal_shown`
 * → 0 in 2.1.156).
 *
 * 2.1.183: buildToolSearchUsageReminder = wtl @cli_inner_pretty.js:465778-465820
 */
export async function buildToolSearchUsageReminder(
  messages: AnyMessage[],
  context: ToolUseContext,
  taskReminderFiredThisTurn: () => Promise<boolean>,
): Promise<ToolSearchUsageReminderAttachment[]> {
  const config = getToolSearchReminderConfig() // r @465779
  if (config === null) return [] // feature off
  if (!messages || messages.length === 0) return []

  const { turnsSinceLastToolSearch, turnsSinceLastReminder } = getTurnsSinceCounters(messages)
  // Not yet due on either clock. @465783
  if (
    turnsSinceLastToolSearch < config.everyNTurns ||
    turnsSinceLastReminder < config.everyNTurns
  )
    return []

  // Skip helper: log a skip event only ON the cadence boundary, then return []. @465784-465793
  const skip = (reason: string): never[] => {
    if (turnsSinceLastReminder % config.everyNTurns === 0)
      logEvent('tengu_juniper_shoal_shown', {
        delivered: false,
        skipReason: reason,
        everyNTurns: config.everyNTurns,
        turnsSinceLastReminder,
      })
    return []
  }

  if (getToolSearchMode() !== 'tst') return skip('mode_not_tst') // @465794
  if (!modelSupportsToolReference(context.options.mainLoopModel))
    return skip('model_unsupported') // @465795
  if (!isToolSearchToolAvailable(context.options.tools))
    return skip('toolsearch_unavailable') // @465796

  // Undiscovered deferred tools = deferred AND not yet loaded via ToolSearch. @465797-465801
  const discovered = extractDiscoveredToolNames(messages)
  const undiscovered = context.options.tools
    .filter(t => isDeferredTool(t) && !discovered.has(t.name))
    .map(t => t.name)
    .sort()
  if (undiscovered.length === 0) return skip('no_undiscovered_tools')

  // Avoid double-reminding in the same turn a task reminder already fired. @465803-465809
  let taskReminderFired = false
  try {
    taskReminderFired = await taskReminderFiredThisTurn()
  } catch {
    taskReminderFired = false
  }
  if (taskReminderFired) return skip('task_reminder_same_turn')

  logEvent('tengu_juniper_shoal_shown', {
    delivered: true,
    undiscoveredCount: undiscovered.length,
    listedCount: Math.min(undiscovered.length, config.maxNames),
    everyNTurns: config.everyNTurns,
    maxNames: config.maxNames,
  })
  return [
    {
      type: 'tool_search_usage_reminder',
      undiscoveredToolNames: undiscovered.slice(0, config.maxNames),
      undiscoveredCount: undiscovered.length,
    },
  ]
}
// Mapping: wtl→buildToolSearchUsageReminder, B1r→getToolSearchReminderConfig,
//   C4p→getTurnsSinceCounters, PPt→getToolSearchMode, f7→modelSupportsToolReference,
//   gLe→isToolSearchToolAvailable, eX→extractDiscoveredToolNames, G2→isDeferredTool
// Note: registered conditionally @464654-464656:
//   ...(getToolSearchReminderConfig() !== null
//        ? [BA("tool_search_usage_reminder", () => buildToolSearchUsageReminder(...))] : [])

/**
 * Render a `tool_search_usage_reminder` attachment into a `<system-reminder>`.
 *
 * 2.1.183: tool_search_usage_reminder render @cli_inner_pretty.js:589323-589334 (NEW)
 */
export function renderToolSearchUsageReminder(
  attachment: ToolSearchUsageReminderAttachment,
): SystemReminderMessage[] {
  const names = attachment.undiscoveredToolNames
  if (names.length === 0) return []
  const overflow = attachment.undiscoveredCount - names.length
  const listing = names.join(', ') + (overflow > 0 ? ` (+${overflow} more)` : '') // @589327
  return wrapAsSystemReminder([
    makeMetaMessage(
      `Some available tools' schemas are not loaded in this conversation yet: ${listing}. Before concluding a capability is missing or building a workaround, use ${TOOL_SEARCH_TOOL_NAME} to find and load relevant tools — keywords to search, or query "select:<name>[,<name>...]" for specific tools. Calling a tool before its schema is loaded will fail. This is just a gentle reminder - ignore if not applicable to the current work.`, // @589330
    ),
  ])
}

// ============================================================================
// 8. Undiscovered-tool retry hint — undiscoveredToolHint
// ============================================================================

/**
 * Built when the model calls a deferred tool that it never loaded (its schema was not sent to the
 * API). Tells the model exactly why the call failed and how to fix it: `select:` the tool, then
 * retry.
 *
 * DELTA: 2.1.183 now also appends the tool's input schema inline (` For reference, this tool's input
 * schema is: <JSONSchema>`), so the model can retry IMMEDIATELY with correctly-typed parameters
 * without even waiting for the select: round-trip (before-grep "For reference, this tool's input
 * schema is" → 0 in 2.1.156).
 *
 * Returns `null` (no hint) when tool search is off, ToolSearch is unavailable, the tool isn't
 * deferred, or it was already discovered.
 *
 * 2.1.183: undiscoveredToolHint = G$p @cli_inner_pretty.js:437133-437148
 */
export function undiscoveredToolHint(
  tool: Tool,
  messages: AnyMessage[],
  tools: Tools,
): string | null {
  if (!isToolSearchEnabledOptimistic()) return null // @437134
  if (!isToolSearchToolAvailable(tools)) return null // @437135
  if (!isDeferredTool(tool)) return null // @437136
  if (extractDiscoveredToolNames(messages).has(tool.name)) return null // already discovered @437137

  // DELTA: best-effort inline schema appendix. @437138-437141
  let schemaAppendix = ''
  try {
    schemaAppendix = ` For reference, this tool's input schema is: ${JSON.stringify(z.toJSONSchema(tool.inputSchema))}`
  } catch {}

  return (
    `\n\nThis tool's schema was not sent to the API — it was not in the discovered-tool set derived from message history. ` +
    `Without the schema in your prompt, typed parameters (arrays, numbers, booleans) get emitted as strings and the client-side parser rejects them. Load the tool first: call ${TOOL_SEARCH_TOOL_NAME} with query "select:${tool.name}", then retry this call.${schemaAppendix}` // @437145-437146
  )
}
// Mapping: G$p→undiscoveredToolHint, fR→isToolSearchEnabledOptimistic,
//   gLe→isToolSearchToolAvailable, G2→isDeferredTool, eX→extractDiscoveredToolNames,
//   Re→JSON.stringify, H.toJSONSchema→z.toJSONSchema

// ============================================================================
// 9. juniper_shoal config — getToolSearchConfig / getToolSearchReminderConfig
// ============================================================================

interface ToolSearchReminderConfig {
  everyNTurns: number
  maxNames: number
}
interface ToolSearchConfig {
  toolSearchReminder: ToolSearchReminderConfig | null
  toolParamStrictness: boolean
  emptyInputRepair: boolean
  /** Gates the directive `getPrompt` middle variant (PROMPT_MID_FETCHRULE). */
  toolSearchFetchRule: boolean
  schemaDescFixes: boolean
}

const DEFAULT_EVERY_N_TURNS = 15 // Nmi @147834
const DEFAULT_MAX_NAMES = 10 // Bmi @147835
// Fmi @147840-block — all-off frozen default config.
const DEFAULT_TOOL_SEARCH_CONFIG: ToolSearchConfig = Object.freeze({
  toolSearchReminder: null,
  toolParamStrictness: false,
  emptyInputRepair: false,
  toolSearchFetchRule: false,
  schemaDescFixes: false,
})

/**
 * Read the server-controlled `juniper_shoal` clientData blob into a typed config. The blob uses
 * whimsical key names (marsh_lantern, bracken_spool, teasel_cove, gorse_hollow, thistle_skein) so
 * features can be toggled server-side without a client release. All sub-features default OFF.
 *
 * DELTA: NEW config surface in 2.1.183 (the whole juniper_shoal blob is new).
 *
 * 2.1.183: getToolSearchConfig = Dkt @cli_inner_pretty.js:147759-147784
 */
function getToolSearchConfig(): ToolSearchConfig {
  let raw: unknown
  try {
    raw = getClientConfigCache()?.juniper_shoal // @147762
  } catch {
    return DEFAULT_TOOL_SEARCH_CONFIG
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw))
    return DEFAULT_TOOL_SEARCH_CONFIG

  const blob = raw as Record<string, unknown>

  // marsh_lantern → reminder config: `true` = defaults; object = {stride, span} overrides. @147766-147771
  let reminder: ToolSearchReminderConfig | null = null
  const marshLantern = blob.marsh_lantern
  if (marshLantern === true) {
    reminder = Object.freeze({ everyNTurns: DEFAULT_EVERY_N_TURNS, maxNames: DEFAULT_MAX_NAMES })
  } else if (typeof marshLantern === 'object' && marshLantern !== null && !Array.isArray(marshLantern)) {
    const m = marshLantern as { stride?: number; span?: number }
    // stride/span must be positive integers, else fall back to defaults. @147773-147774
    const everyNTurns =
      typeof m.stride === 'number' && Number.isInteger(m.stride) && m.stride >= 1
        ? m.stride
        : DEFAULT_EVERY_N_TURNS
    const maxNames =
      typeof m.span === 'number' && Number.isInteger(m.span) && m.span >= 1
        ? m.span
        : DEFAULT_MAX_NAMES
    reminder = Object.freeze({ everyNTurns, maxNames })
  }

  return Object.freeze({
    toolSearchReminder: reminder,
    toolParamStrictness: blob.bracken_spool === true, // → strict tool params
    emptyInputRepair: blob.teasel_cove === true, // → empty-input repair
    toolSearchFetchRule: blob.gorse_hollow === true, // → directive prompt variant (PROMPT_MID_FETCHRULE)
    schemaDescFixes: blob.thistle_skein === true, // → schema-description fixes
  })
}
// Mapping: Dkt→getToolSearchConfig, Umi→getClientConfigCache, Fmi→DEFAULT_TOOL_SEARCH_CONFIG,
//   Nmi→DEFAULT_EVERY_N_TURNS, Bmi→DEFAULT_MAX_NAMES

// 2.1.183: getToolSearchReminderConfig = B1r @cli_inner_pretty.js:147785
function getToolSearchReminderConfig(): ToolSearchReminderConfig | null {
  return getToolSearchConfig().toolSearchReminder
}

// 2.1.183: toolSearchFetchRuleEnabled = qmi @cli_inner_pretty.js:147794-147796
//   The `toolSearchFetchRule` gate (juniper_shoal.gorse_hollow) is consumed by
//   `getPrompt` (own), which now lives in ToolSearchTool.ts and reads it via its own
//   `getToolSearchFetchRuleEnabled` import — so no local accessor is needed here.
//   `getToolSearchConfig().toolSearchFetchRule` exposes the same value if required.

// ============================================================================
// 10. The defer_loading wire field
// ============================================================================
//
// The deferral decision is realized on the wire by a single boolean field on the per-request tool
// schema. `buildToolSchema` (CWn) stamps it when the per-tool overlay carries `deferLoading`:
//
//   // @581339, alongside input_schema / strict / eager_input_streaming / cache_control
//   if (toolFlags.deferLoading) apiToolSchema.defer_loading = true
//
// Request assembly (@582412-582457) decides `deferLoading` per tool and which tools ship at all:
//
//   const searchEnabled = await isToolSearchEnabled(model, tools, ctx.getToolPermissionContext,
//                                                    ctx.agents, 'query')                 // @582412
//   const deferredNames = new Set<string>()
//   if (searchEnabled) for (const t of tools) if (isDeferredTool(t)) deferredNames.add(t.name) // @582414-416
//   // No deferred tools and no pending servers → tool search is pointless; turn it off:
//   if (searchEnabled && deferredNames.size === 0 && !ctx.hasPendingMcpServers) {
//     logForDebugging('Tool search disabled: no deferred tools available to search')           // @582418
//     searchEnabled = false
//   }
//
//   // THREE-WAY SPLIT of which tools get a full schema this turn (@582420-582431):
//   let toShip: Tools
//   if (searchEnabled) {
//     const discovered = extractDiscoveredToolNames(messages)                                   // @582421
//     toShip = tools.filter(t => {
//       if (!deferredNames.has(t.name)) return true            // non-deferred → always full schema
//       if (toolMatchesName(t, TOOL_SEARCH_TOOL_NAME)) return true // ToolSearch → always
//       return discovered.has(t.name)                          // deferred → only if discovered
//     })
//   } else {
//     // search off → drop ToolSearch entirely (nothing to load)
//     toShip = tools.filter(t => !toolMatchesName(t, TOOL_SEARCH_TOOL_NAME))                    // @582427-431
//   }
//
//   // Beta header (unless bedrock):
//   const provider = getAPIProvider(ctx.model)                                                  // @582432
//   const betaHeader = searchEnabled ? getToolSearchBeta() : null
//   if (betaHeader && provider !== 'bedrock' && !betaHeaders.includes(betaHeader))
//     betaHeaders.push(betaHeader)                                                              // @582434-436
//
//   // Per-tool deferLoading flag: a tool defers if (search on AND it's a deferred name) OR it's an
//   // LSP tool that should defer regardless (shouldDeferLspTool/cbf):
//   const deferLoadingFlag = (t: Tool) =>
//     searchEnabled && (deferredNames.has(t.name) || shouldDeferLspTool(t))                     // @582438
//   const schemas = await Promise.all(
//     toShip.map(t => buildToolSchema(t, { ..., model, deferLoading: deferLoadingFlag(t) })))   // @582442-453
//
// Loaded-only filter (passes that need only fully-loaded tools exclude deferred ones):
//   // @582534
//   const loadedOnly = schemas.filter(s => !('defer_loading' in s && s.defer_loading))
//
// (Three-way split, beta-header provider map, and `defer_loading` stamp are byte-identical to 2.1.156.)
//
// Mapping: CWn→buildToolSchema, J4t→isToolSearchEnabled, G2→isDeferredTool,
//   eX→extractDiscoveredToolNames, Rc→toolMatchesName, DA→TOOL_SEARCH_TOOL_NAME,
//   cbf→shouldDeferLspTool, _y→getAPIProvider, wti→getToolSearchBeta

// ============================================================================
// Imported/external helper declarations (defined elsewhere in the tree)
// ============================================================================

// helper: Jp @589503 — wrap meta messages in a <system-reminder> envelope
declare function wrapAsSystemReminder(messages: SystemReminderMessage[]): SystemReminderMessage[]
// helper: Rn @589504 — make an isMeta system-reminder message from content
declare function makeMetaMessage(content: string): SystemReminderMessage
// helper: n5n @465763 — true for synthetic/progress assistant turns (excluded from turn counting)
declare function isSyntheticAssistant(message: AnyMessage): boolean

// Minimal structural message types (the bundle uses the shared message union here).
type SystemReminderMessage = { isMeta: boolean; content: string } & Record<string, unknown>
type AnyMessage = {
  type: string
  subtype?: string
  message?: { content?: unknown[] }
  attachment?: { type: string } & Record<string, unknown>
  compactMetadata?: { preCompactDiscoveredTools?: string[] }
} & Record<string, unknown>

// Tool-shape extras referenced above but owned by Tool.ts:
//   tool.alwaysLoad?: boolean   — force eager
//   tool.shouldDefer?: boolean  — opt into deferral (27 tool decls set this)
//   tool.isMcp?: boolean
//   tool.mcpInfo?: { serverName: string; toolName: string }
//   tool.searchHint?: string    — curated capability phrase, scored above prompt text
