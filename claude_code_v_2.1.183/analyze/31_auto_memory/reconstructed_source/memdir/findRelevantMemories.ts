/**
 * Query-time memory recall: pick (or synthesize from) the memory files that are
 * relevant to the user's latest turn and surface them as `<system-reminder>`
 * background context.
 *
 * ── How v2.1.183 differs from the v2.1.88 ancestor ──────────────────────────
 * The v2.1.88 file was a single one-shot selector:
 *   findRelevantMemories(query, dir, signal, recentTools, alreadySurfaced)
 *     → scanMemoryFiles → one Sonnet call (manifest in the user message)
 *     → return up to 5 { path, mtimeMs }.
 *
 * v2.1.183 rebuilt this into a *conversation-cached, two-mode recall engine*:
 *   1. The available-memories manifest is sent ONCE as a cached first user
 *      message; each turn appends only the new query, so subsequent turns hit
 *      the prompt cache (cache_control:{type:"ephemeral"}). State is held in a
 *      per-memorySelector `MemoryRecallCache` keyed by memoryDir (stateByDir).
 *   2. Two modes share that cache:
 *        - SELECT mode  (findRelevantMemories): asks the model for filenames,
 *          returns { memories, knowledge } (paths + a knowledge-index sidecar).
 *          Used when tiny memory mode is OFF.
 *        - SYNTHESIZE mode (synthesizeRelevantMemories): asks the model to
 *          extract up to 7 facts from the full memory bodies, returns
 *          { synthesis, citedMemories, citedKnowledge }. Used when tiny memory
 *          mode is ON (aH @147673). The body is already in the manifest
 *          (memoryScan tiny-mode inlines it), so the model can lift facts.
 *   3. A `knowledge-index` (org "aki:" results) is offered alongside the
 *      memories via a parallel Promise; the model may also cite knowledge ids.
 *   4. Both modes record cache token usage (`lastUsage`) so the prefetch
 *      disposer can emit `tengu_memdir_prefetch_collected`.
 * None of this is in the v2.1.88 ancestor; it is reconstructed from the bundle.
 * The team-store `CLAUDE_MEMORY_STORES` recall path (the 2.1.172 headline) lives
 * on the *system-prompt* recall lane (loadMemoryPrompt/e0t), NOT here — see
 * team_memory_stores_recall.md. This file is the *query-time* recall lane.
 *
 * 2.1.183 regions: cli_inner_pretty.js
 *   - SELECT_MEMORIES_SYSTEM_PROMPT  = q3p @464524
 *   - SYNTHESIZE_MEMORIES_SYSTEM_PROMPT = V3p @464532
 *   - findRelevantMemories      = ntl @464313  (SELECT mode)
 *   - runMemorySelectorQuery    = z3p @464352  (SELECT model call)
 *   - synthesizeRelevantMemories = rtl @464417  (SYNTHESIZE mode)
 *   - runMemorySynthesisQuery   = K3p @464438  (SYNTHESIZE model call)
 *   - formatKnowledgeResults    = ttl @464306
 *   - cache: initMemoryRecallCache=tIe@230199, resetMemoryRecallCache=jUe@230202,
 *            getCachedMemoryState=u9r@230206, seedMemoryState=d9r@230209,
 *            appendMemoryTurn=p9r@230228
 *   - querySource MEMDIR_RELEVANCE = CMt="memdir_relevance" @230240
 *   - RECALL_KNOWLEDGE_TIMEOUT_MS = etl=3500 @464510
 * 2.1.88 ancestor: src/memdir/findRelevantMemories.ts
 *   (findRelevantMemories / selectRelevantMemories / SELECT_MEMORIES_SYSTEM_PROMPT / RelevantMemory)
 * scaffold: v2.1.156 memdir_core.md (prompt-builder layer); README.md (recall lane);
 *           team_memory_stores_recall.md (system-prompt recall is a *separate* lane)
 * cross-val: re-read q3p/V3p verbatim, the ntl/rtl cache-then-query flow, the
 *   { selected_memories, selected_knowledge_ids } and { relevant_facts,
 *   cited_memories, cited_knowledge_ids } schemas, and the memory_recall_select /
 *   memory_recall_synthesize telemetry (Le/Rt/Me) in the live 183 bundle.
 *   The 88 `recentTools` argument is GONE — the selector prompt no longer takes a
 *   recently-used-tools section; the conservatism guidance is now baked into q3p.
 */

// logForDebugging: v @cli_inner_pretty.js:10623 — warn/debug logger.
import { logForDebugging } from '../utils/debug.js'
// errorMessage: Se @8832 — best-effort error→string.
import { errorMessage } from '../utils/errors.js'
// getDefaultSonnetModel: dx @102505 — ANTHROPIC_DEFAULT_SONNET_MODEL ?? default sonnet.
import { getDefaultSonnetModel } from '../utils/model/model.js'
// sideQuery: EW @369009 — one-shot model call with output_format/json_schema.
import { sideQuery } from '../utils/sideQuery.js'
// jsonParse: Gt @9506 ; stripModelCodeFences: RU @53146 (strips ```lang fences).
import { jsonParse } from '../utils/slowOperations.js'
import { stripModelCodeFences } from '../utils/text.js'
// dedupe: ms @36221 — [...new Set(e)].
import { dedupe } from '../utils/array.js'
// recordSuccess: Le @44569 (tengu_feature_ok) ; recordFailure: Me @44572 (tengu_feature_bad)
//   ; recordSkip: Rt @44575 (tengu_feature_sad).
import { recordFailure, recordSkip, recordSuccess } from '../utils/telemetry.js'
// DELTA v2.1.181: tiny memory mode (isTinyMemoryEnabled = aH @147673,
// "tengu_billiard_aviary") is the gate that picks SYNTHESIZE over SELECT. That
// dispatch lives in the attachments module (g4p @465265), NOT in this file, so
// isTinyMemoryEnabled is referenced here only as a cross-reference. Tiny mode
// also makes scanMemoryFiles (C4t @454800) inline each memory body into the
// manifest, which is why SYNTHESIZE can lift facts from the cached first message.
import {
  formatMemoryManifest,
  type MemoryHeader,
  scanMemoryFiles,
} from './memoryScan.js'

// 2.1.183: MEMDIR_RELEVANCE = CMt @cli_inner_pretty.js:230240 ("memdir_relevance")
//   Also in the 1h-prompt-cache allowlist @581951 and the prefetch-suppression set y4p @466065.
const MEMDIR_RELEVANCE_QUERY_SOURCE = 'memdir_relevance'

// 2.1.183: RECALL_KNOWLEDGE_TIMEOUT_MS = etl @cli_inner_pretty.js:464510 (3500)
//   The knowledge-index Promise is raced against this timeout so a slow org
//   knowledge lookup never delays recall; a timeout yields an empty result set.
const RECALL_KNOWLEDGE_TIMEOUT_MS = 3500

/** A memory file the selector judged relevant. */
export type RelevantMemory = {
  // 2.1.183: ntl maps to { path: h.filePath, mtimeMs: h.mtimeMs } @464348
  path: string
  mtimeMs: number
}

/** A knowledge-index ("aki:") result that may accompany recalled memories. */
export type KnowledgeResult = {
  id: string
  source: string
  title: string
  url?: string
  chunk: string
}

/** SELECT-mode return: chosen memory files + chosen knowledge results. */
export type MemorySelectionResult = {
  memories: RelevantMemory[]
  knowledge: KnowledgeResult[]
}

/** SYNTHESIZE-mode return: a fact bullet-list plus what it was drawn from. */
export type MemorySynthesisResult = {
  synthesis: string
  citedMemories: string[]
  citedKnowledge: KnowledgeResult[]
}

/**
 * Per-session recall cache. One instance lives on `toolUseContext.memorySelector`
 * (created by initMemoryRecallCache). It memoizes, per memoryDir, the cached
 * manifest message + the running query/answer conversation, plus the token-usage
 * of the most recent selector call.
 *
 * 2.1.183: shape from initMemoryRecallCache (tIe @230199) + the helpers below.
 */
export type MemoryRecallCache = {
  // memoryDir → cached manifest message + accumulated conversation
  stateByDir: Record<string, MemoryDirState>
  // token usage of the last select/synthesize call (read by the prefetch disposer)
  lastUsage: {
    cacheReadInputTokens: number
    cacheCreationInputTokens: number
    turnCount: number
  } | null
}

type MemoryDirState = {
  memories: MemoryHeader[]
  // the cached first user message (the manifest), followed by appended turns
  messages: Array<{
    role: 'user' | 'assistant'
    content: Array<{
      type: 'text'
      text: string
      cache_control?: { type: 'ephemeral' }
    }>
  }>
}

// ── Cache helpers ────────────────────────────────────────────────────────────

/**
 * Construct an empty recall cache.
 * 2.1.183: initMemoryRecallCache = tIe @cli_inner_pretty.js:230199
 */
export function initMemoryRecallCache(): MemoryRecallCache {
  return { stateByDir: {}, lastUsage: null }
}

/**
 * Clear a recall cache in place (e.g. after a compaction invalidates the
 * cached manifest). No-op on a missing cache.
 * 2.1.183: resetMemoryRecallCache = jUe @cli_inner_pretty.js:230202
 */
export function resetMemoryRecallCache(cache: MemoryRecallCache | undefined): void {
  if (!cache) return
  cache.stateByDir = {}
  cache.lastUsage = null
}

// 2.1.183: getCachedMemoryState = u9r @cli_inner_pretty.js:230206
function getCachedMemoryState(
  cache: MemoryRecallCache,
  memoryDir: string,
): MemoryDirState | undefined {
  return cache.stateByDir[memoryDir]
}

/**
 * Seed the cache for `memoryDir` with the freshly-scanned headers and the
 * manifest rendered as the first (cached) user message.
 * 2.1.183: seedMemoryState = d9r @cli_inner_pretty.js:230209
 */
function seedMemoryState(
  cache: MemoryRecallCache,
  memoryDir: string,
  memories: MemoryHeader[],
  manifest: string,
  cacheControl: { type: 'ephemeral' } | undefined,
): MemoryDirState {
  const state: MemoryDirState = {
    memories,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Available memories:\n${manifest}`,
            ...(cacheControl && { cache_control: cacheControl }),
          },
        ],
      },
    ],
  }
  cache.stateByDir[memoryDir] = state
  return state
}

/**
 * Append the latest query + the model's raw answer to the cached conversation,
 * so the next turn's prompt cache extends past them. Note the *answer* turn is
 * stored without cache_control (only the manifest + the new query carry it).
 * 2.1.183: appendMemoryTurn = p9r @cli_inner_pretty.js:230228
 */
function appendMemoryTurn(
  cache: MemoryRecallCache,
  memoryDir: string,
  queryText: string,
  answerText: string,
): void {
  const state = cache.stateByDir[memoryDir]
  if (!state) return
  cache.stateByDir[memoryDir] = {
    ...state,
    messages: [
      ...state.messages,
      { role: 'user', content: [{ type: 'text', text: queryText }] },
      { role: 'assistant', content: [{ type: 'text', text: answerText }] },
    ],
  }
}

// ── Prompts (verbatim from the 183 bundle) ───────────────────────────────────

// 2.1.183: SELECT_MEMORIES_SYSTEM_PROMPT = q3p @cli_inner_pretty.js:464524
// DELTA v2.1.x: the 88 prompt's "recently-used tools" guidance is gone; instead
// the prompt now (a) explains the multi-turn shape ("first message lists ...;
// subsequent messages each contain one user query"), (b) adds the
// user-profile/project-overview conservatism rule, and (c) the "don't re-select
// across turns" rule. ${G3p} is an empty extension slot (G3p="" @464511).
const SELECT_MEMORIES_SYSTEM_PROMPT = `You are selecting memories that will be useful to Claude Code as it processes a user's query. The first message lists the available memory files with their filenames and descriptions; subsequent messages each contain one user query.

Return a list of filenames for the memories that will clearly be useful to Claude Code as it processes the user's query (up to 5). Only include memories that you are certain will be helpful based on their name and description.
- If you are unsure if a memory will be useful in processing the user's query, then do not include it in your list. Be selective and discerning.
- If there are no memories in the list that would clearly be useful, feel free to return an empty list.
- Be especially conservative with user-profile and project-overview memories ([user], [project]). These describe the user's ongoing focus, not what every question is about. A profile saying "works on DB performance" is NOT relevant to a question that merely contains the word "performance" unless the question is actually about that DB work. Match on what the question IS ABOUT, not on surface keyword overlap with who the user is.
- Do not re-select memories you already returned for an earlier query in this conversation.
`

// 2.1.183: SYNTHESIZE_MEMORIES_SYSTEM_PROMPT = V3p @cli_inner_pretty.js:464532
// DELTA v2.1.181: net-new for tiny memory mode. The manifest carries full bodies,
// so this prompt asks for extracted facts (max 7) rather than filenames.
// ${W3p} is an empty extension slot (W3p="" @464512).
const SYNTHESIZE_MEMORIES_SYSTEM_PROMPT = `You read persistent memory files for an AI coding assistant and extract facts to help the coding assistant answer queries. The first message lists every available memory file with its frontmatter and full body; each subsequent user message contains one query.

For each query, return a JSON object:
- relevant_facts: an array of facts (max 7) that would be useful for processing the query. Each fact is 1-2 sentences and stands on its own.
- cited_memories: array of filenames (matching the manifest exactly) for the memories you drew from

If no memories are relevant, return relevant_facts: [] and cited_memories: [].

A fact is useful when it lets the assistant do one of these things:
- Avoid re-asking: supply something the user would otherwise have to restate (a path, a name, a config value, a decision already made).
- Apply user preferences: surface conventions, styles, or tooling choices the assistant should follow for this query.
- Maintain continuity: surface the state of an ongoing project, goal, or prior thread that this query is continuing.
- Avoid a known pitfall: surface past corrections or mistakes so the assistant pre-empts repeating them.

Style and length:
- Each fact is 1-2 sentences. State the fact directly, then add the context needed to act on it.
- Name a path, flag, or identifier only when it is the thing the assistant must use or avoid. Drop supporting details like timestamps, byte counts, version numbers, and historical asides.
- Do not answer or solve the query yourself. You are a retrieval step, not the assistant: every fact must be lifted from a memory file body, not derived from general knowledge or your own reasoning about the query. If no memory covers it, return relevant_facts: [].
- Do not restate the query.
- If a prior turn in this conversation already returned the relevant facts for this query, return relevant_facts: [] and cited_memories: [] rather than restating.
`

// ── Knowledge-index formatting ───────────────────────────────────────────────

/**
 * Render org knowledge-index results as a compact bullet list for the model:
 * each line carries `{id, source}` plus a 300-char chunk preview (ellipsized).
 * 2.1.183: formatKnowledgeResults = ttl @cli_inner_pretty.js:464306
 */
function formatKnowledgeResults(results: KnowledgeResult[]): string {
  return results
    .map(r => {
      const preview = r.chunk.slice(0, 300).replace(/\s+/g, ' ').trim()
      return `- {id: "${r.id}", source: ${r.source}} ${r.title}: ${preview}${
        r.chunk.length > 300 ? '…' : ''
      }`
    })
    .join('\n')
}

// ── SELECT mode ──────────────────────────────────────────────────────────────

/**
 * SELECT-mode recall. Scan (or reuse the cached scan of) `memoryDir`, ask the
 * selector model which filenames are relevant to `query`, and return their
 * paths + any cited knowledge-index results. Up to 5 memories, up to 3 knowledge.
 *
 * `alreadySurfaced` (paths shown in prior turns) is applied in two places: as an
 * early bail-out (if every candidate is already surfaced and no fresh knowledge
 * arrived) and again as a post-filter, so the 5-slot budget is spent on fresh
 * candidates. The knowledge-index `knowledgePromise` is raced against
 * RECALL_KNOWLEDGE_TIMEOUT_MS and pre-filtered by `alreadySurfaced` (keyed on
 * url or `aki:<id>`).
 *
 * 2.1.183: findRelevantMemories = ntl @cli_inner_pretty.js:464313
 * DELTA v2.1.x vs 88: now cache-aware (MemoryRecallCache), returns
 *   { memories, knowledge } not RelevantMemory[], drops the `recentTools` arg,
 *   and folds in the knowledge-index sidecar.
 */
export async function findRelevantMemories(
  query: string,
  memoryDir: string,
  cache: MemoryRecallCache,
  signal: AbortSignal,
  alreadySurfaced: ReadonlySet<string> = new Set(),
  knowledgePromise: Promise<KnowledgeResult[]> = Promise.resolve([]),
): Promise<MemorySelectionResult> {
  cache.lastUsage = null
  const cacheControl = { type: 'ephemeral' as const }

  // Reuse the cached manifest message if present; otherwise scan, and seed the
  // cache only when there is at least one memory file and we weren't aborted. @464316
  const state =
    getCachedMemoryState(cache, memoryDir) ??
    (await scanMemoryFiles(memoryDir, signal).then(headers =>
      headers.length > 0 && !signal.aborted
        ? seedMemoryState(
            cache,
            memoryDir,
            headers,
            formatMemoryManifest(headers),
            cacheControl,
          )
        : undefined,
    ))

  // Race the knowledge lookup against a 3.5s timeout, then drop already-surfaced
  // results (keyed by url, falling back to "aki:<id>"). @464317-464319
  const knowledge = (
    await Promise.race([
      knowledgePromise,
      sleep(RECALL_KNOWLEDGE_TIMEOUT_MS, signal, { unref: true }).then(
        () => [] as KnowledgeResult[],
      ),
    ])
  ).filter(k => !alreadySurfaced.has(k.url || `aki:${k.id}`))

  // Nothing to do: no fresh knowledge AND (no memories OR every memory already
  // surfaced). Telemeter the reason and return empty. @464320-464323
  if (
    knowledge.length === 0 &&
    (!state || state.memories.every(m => alreadySurfaced.has(m.filePath)))
  ) {
    if (!signal.aborted) {
      recordSkip(
        'memory_recall_select',
        state ? 'all_surfaced' : 'no_candidates',
      )
    }
    return { memories: [], knowledge: [] }
  }

  // The conversation: either the cached manifest message(s), or — when there are
  // no local memory files but knowledge DID arrive — a placeholder. @464324-464336
  const conversation = state?.messages ?? [
    {
      role: 'user' as const,
      content: [
        {
          type: 'text' as const,
          text: 'Available memories:\n(none — this session has no local memory files yet)',
          ...(cacheControl && { cache_control: cacheControl }),
        },
      ],
    },
  ]

  const byFilename = new Map(
    (state?.memories ?? []).map(m => [m.filename, m]),
  )

  const { selectedMemories, selectedKnowledgeIds } =
    await runMemorySelectorQuery(
      query,
      memoryDir,
      cache,
      conversation,
      byFilename,
      cacheControl,
      signal,
      knowledge,
    )

  // Resolve selected knowledge ids → results (dedupe, cap 3). @464339-464343
  const knowledgeById = new Map(knowledge.map(k => [k.id, k]))
  const selectedKnowledge = dedupe(selectedKnowledgeIds)
    .map(id => knowledgeById.get(id))
    .filter((k): k is KnowledgeResult => k !== undefined)
    .slice(0, 3)

  // Resolve selected filenames → { path, mtimeMs }, dropping already-surfaced. @464345-464349
  return {
    memories: selectedMemories
      .map(filename => byFilename.get(filename))
      .filter(
        (m): m is MemoryHeader =>
          m !== undefined && !alreadySurfaced.has(m.filePath),
      )
      .map(m => ({ path: m.filePath, mtimeMs: m.mtimeMs })),
    knowledge: selectedKnowledge,
  }
}

/**
 * One SELECT model call. Appends the new query (optionally noting that N
 * knowledge-index results were offered) to the cached conversation, parses the
 * `selected_memories` / `selected_knowledge_ids`, records cache usage, and
 * persists the turn for the next call. Filters selections to valid filenames.
 *
 * 2.1.183: runMemorySelectorQuery = z3p @cli_inner_pretty.js:464352
 */
async function runMemorySelectorQuery(
  query: string,
  memoryDir: string,
  cache: MemoryRecallCache,
  conversation: MemoryDirState['messages'],
  validFilenames: Map<string, MemoryHeader>,
  cacheControl: { type: 'ephemeral' },
  signal: AbortSignal,
  knowledge: KnowledgeResult[],
): Promise<{ selectedMemories: string[]; selectedKnowledgeIds: string[] }> {
  // The model sees the knowledge results inline; the *stored* turn keeps only a
  // compact "(N knowledge-index results were offered)" note so the cached
  // conversation doesn't grow by the full chunk text. @464353-464368
  const knowledgeSection =
    knowledge.length > 0
      ? `\n\nKnowledge-index results for this query (select by id):\n${formatKnowledgeResults(knowledge)}`
      : ''
  const queryText = `Select memories relevant to:\n${query}${knowledgeSection}`
  const storedQueryText =
    knowledge.length > 0
      ? `Select memories relevant to:\n${query}\n\n(${knowledge.length} knowledge-index results were offered for this query)`
      : queryText

  const empty = { selectedMemories: [], selectedKnowledgeIds: [] }

  try {
    const result = await sideQuery({
      model: getDefaultSonnetModel(),
      system: [{ type: 'text', text: SELECT_MEMORIES_SYSTEM_PROMPT, cache_control: cacheControl }],
      skipSystemPromptPrefix: true,
      messages: [
        ...conversation,
        { role: 'user', content: [{ type: 'text', text: queryText, cache_control: cacheControl }] },
      ],
      max_tokens: 256,
      output_format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            selected_memories: { type: 'array', items: { type: 'string' } },
            selected_knowledge_ids: { type: 'array', items: { type: 'string' } },
          },
          // @464385: only selected_memories is required (knowledge is optional)
          required: ['selected_memories'],
          additionalProperties: false,
        },
      },
      signal,
      querySource: MEMDIR_RELEVANCE_QUERY_SOURCE,
    })

    const textBlock = result.content.find(block => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') return empty

    const parsed: {
      selected_memories: string[]
      selected_knowledge_ids?: string[]
    } = jsonParse(stripModelCodeFences(textBlock.text))

    // Persist this turn + record cache usage (turnCount = (history+1)/2). @464396-464401
    appendMemoryTurn(cache, memoryDir, storedQueryText, textBlock.text)
    cache.lastUsage = {
      cacheReadInputTokens: result.usage.cache_read_input_tokens ?? 0,
      cacheCreationInputTokens: result.usage.cache_creation_input_tokens ?? 0,
      turnCount: (conversation.length + 1) / 2,
    }

    recordSuccess('memory_recall_select') // Le @464402 → tengu_feature_ok
    return {
      selectedMemories: parsed.selected_memories.filter(f =>
        validFilenames.has(f),
      ),
      selectedKnowledgeIds: parsed.selected_knowledge_ids ?? [],
    }
  } catch (e) {
    cache.lastUsage = null
    if (signal.aborted) return empty
    // DELTA: telemetered failure (88 ancestor only logged). @464411-464413
    recordSkip('memory_recall_select', 'memory_recall_select_query_failed') // Rt @464411
    logForDebugging(`[memdir] selectRelevantMemories failed: ${errorMessage(e)}`, {
      level: 'warn',
    })
    return empty
  }
}

// ── SYNTHESIZE mode (tiny memory) ────────────────────────────────────────────

/**
 * SYNTHESIZE-mode recall, used when tiny memory mode is enabled. The manifest
 * already inlines each memory's body, so instead of returning filenames the
 * model extracts up to 7 standalone facts and lists which memories/knowledge it
 * drew from. Returns null when there is nothing to synthesize.
 *
 * 2.1.183: synthesizeRelevantMemories = rtl @cli_inner_pretty.js:464417
 * DELTA v2.1.181: net-new (tiny memory mode). Shares the same per-dir cache as
 *   SELECT mode, so the manifest is paid for once regardless of mode.
 */
export async function synthesizeRelevantMemories(
  query: string,
  memoryDir: string,
  cache: MemoryRecallCache,
  signal: AbortSignal,
  knowledgePromise: Promise<KnowledgeResult[]> = Promise.resolve([]),
): Promise<MemorySynthesisResult | null> {
  cache.lastUsage = null
  const cacheControl = { type: 'ephemeral' as const }

  const state =
    getCachedMemoryState(cache, memoryDir) ??
    (await scanMemoryFiles(memoryDir, signal).then(headers =>
      headers.length > 0 && !signal.aborted
        ? seedMemoryState(
            cache,
            memoryDir,
            headers,
            formatMemoryManifest(headers),
            cacheControl,
          )
        : undefined,
    ))

  const knowledge = await Promise.race([
    knowledgePromise,
    sleep(RECALL_KNOWLEDGE_TIMEOUT_MS, signal, { unref: true }).then(
      () => [] as KnowledgeResult[],
    ),
  ])

  // No memories and no knowledge → nothing to synthesize. @464422
  if (!state && knowledge.length === 0) return null

  const conversation = state?.messages ?? [
    {
      role: 'user' as const,
      content: [
        {
          type: 'text' as const,
          text: 'Available memories:\n(none — this session has no local memory files yet)',
          ...(cacheControl && { cache_control: cacheControl }),
        },
      ],
    },
  ]

  return runMemorySynthesisQuery(
    query,
    memoryDir,
    cache,
    conversation,
    new Map((state?.memories ?? []).map(m => [m.filename, m])),
    cacheControl,
    signal,
    knowledge,
  )
}

/**
 * One SYNTHESIZE model call. Parses `relevant_facts` (trimmed, non-empty, cap 7)
 * into a `- ` bullet list, resolves cited memories (to valid filenames) and
 * cited knowledge ids (dedupe, cap 3), records cache usage, persists the turn.
 * Returns null on empty facts or failure.
 *
 * 2.1.183: runMemorySynthesisQuery = K3p @cli_inner_pretty.js:464438
 */
async function runMemorySynthesisQuery(
  query: string,
  memoryDir: string,
  cache: MemoryRecallCache,
  conversation: MemoryDirState['messages'],
  validFilenames: Map<string, MemoryHeader>,
  cacheControl: { type: 'ephemeral' },
  signal: AbortSignal,
  knowledge: KnowledgeResult[],
): Promise<MemorySynthesisResult | null> {
  // Note "cite by id" (vs "select by id" in SELECT mode). @464443
  const knowledgeSection =
    knowledge.length > 0
      ? `\n\nKnowledge-index results for this query (cite by id):\n${formatKnowledgeResults(knowledge)}`
      : ''
  const queryText = `Extract facts relevant to:\n${query}${knowledgeSection}`
  const storedQueryText =
    knowledge.length > 0
      ? `Extract facts relevant to:\n${query}\n\n(${knowledge.length} knowledge-index results were offered for this query)`
      : queryText

  try {
    const result = await sideQuery({
      model: getDefaultSonnetModel(),
      system: [{ type: 'text', text: SYNTHESIZE_MEMORIES_SYSTEM_PROMPT, cache_control: cacheControl }],
      skipSystemPromptPrefix: true,
      messages: [
        ...conversation,
        { role: 'user', content: [{ type: 'text', text: queryText, cache_control: cacheControl }] },
      ],
      // @464461: synthesis needs more room than selection (2000 vs 256)
      max_tokens: 2000,
      output_format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            relevant_facts: { type: 'array', items: { type: 'string' } },
            cited_memories: { type: 'array', items: { type: 'string' } },
            cited_knowledge_ids: { type: 'array', items: { type: 'string' } },
          },
          required: ['relevant_facts', 'cited_memories'],
          additionalProperties: false,
        },
      },
      signal,
      querySource: MEMDIR_RELEVANCE_QUERY_SOURCE,
    })

    const textBlock = result.content.find(block => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') return null

    const parsed: {
      relevant_facts: string[]
      cited_memories: string[]
      cited_knowledge_ids?: string[]
    } = jsonParse(stripModelCodeFences(textBlock.text))

    // Persist turn + record cache usage. @464481-464486
    appendMemoryTurn(cache, memoryDir, storedQueryText, textBlock.text)
    cache.lastUsage = {
      cacheReadInputTokens: result.usage.cache_read_input_tokens ?? 0,
      cacheCreationInputTokens: result.usage.cache_creation_input_tokens ?? 0,
      turnCount: (conversation.length + 1) / 2,
    }

    const facts = parsed.relevant_facts
      .map(f => f.trim())
      .filter(f => f.length > 0)
      .slice(0, 7)
    if (facts.length === 0) return null // @464491

    const synthesis = facts.map(f => `- ${f}`).join('\n')
    const citedMemories = parsed.cited_memories.filter(f =>
      validFilenames.has(f),
    )
    const knowledgeById = new Map(knowledge.map(k => [k.id, k]))
    const citedKnowledge = dedupe(parsed.cited_knowledge_ids ?? [])
      .map(id => knowledgeById.get(id))
      .filter((k): k is KnowledgeResult => k !== undefined)
      .slice(0, 3)

    recordSuccess('memory_recall_synthesize') // Le @464500
    return { synthesis, citedMemories, citedKnowledge }
  } catch (e) {
    cache.lastUsage = null
    if (signal.aborted) return null
    // @464504: failure uses recordFailure (Me/tengu_feature_bad) here, vs
    //          recordSkip (Rt/tengu_feature_sad) in SELECT mode.
    recordFailure(
      'memory_recall_synthesize',
      'memory_recall_synthesize_query_failed',
    )
    logForDebugging(
      `[memdir] synthesizeRelevantMemories failed: ${errorMessage(e)}`,
      { level: 'warn' },
    )
    return null
  }
}

/**
 * Abort-aware timeout. Resolves after `ms` (or immediately/never per signal);
 * `unref` lets the timer not keep the process alive.
 * 2.1.183: sleep = Un @cli_inner_pretty.js:105278
 *
 * UNVERIFIED: re-exported here only to mirror the bundle's local helper usage;
 * in the real tree this lives in a shared util. Imported from there in practice.
 */
declare function sleep(
  ms: number,
  signal?: AbortSignal,
  opts?: { unref?: boolean; throwOnAbort?: boolean },
): Promise<void>
