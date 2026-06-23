/**
 * WebSearchTool — server-side web search via the Anthropic `web_search`
 * server-tool, streamed through a nested model query. Readable-source
 * reconstruction for Claude Code v2.1.183.
 *
 * 2.1.183 regions (cli_inner_pretty.js):
 *   - 221357-221391       prompt builder `m1i` (lean vs verbose, current-month interpolation)
 *   - 221393              name const `rG = "WebSearch"`
 *   - 428475-428483       server-tool schema builder `mMp`
 *   - 428484-428513       block-stream → Output reducer `AMp`
 *   - 428532-428556       input/output Zod schemas `dMp` / `pMp` / `fMp`
 *   - 428557-428770       tool object `V3n = pi({...})`
 *   - 134268-134273       lean predicate `Dg` (scaffold X3)
 *   - 220216              current-month helper `kOi`
 *
 * 2.1.88 convention mirror: src/tools/WebSearchTool/{WebSearchTool.ts,prompt.ts}
 * 2.1.156 scaffold: 04_tools/README.md (WebSearch contract)
 *
 * Cross-validation note: re-verified in the 183 bundle that `prompt()` is now
 * model-branched on `Dg(model)` (lean: the short "Search the web…US-only."
 * block; verbose: the long CRITICAL-REQUIREMENT/Sources block) — the 2.1.88
 * single-branch prompt is the verbose branch. `isEnabled` now also allows the
 * `anthropicAws` provider and the `claude-fable-5` Vertex model, and explicitly
 * disables `gateway`. The CCR-proxy fast path (`Z9a`) and `searchCount` output
 * field are present in 183. All quoted strings confirmed verbatim against the
 * bundle and assets/tools/WebSearch.md.
 */

import type {
  BetaContentBlock,
  BetaWebSearchTool20250305,
} from '@anthropic-ai/sdk/resources/beta/messages/messages.mjs'
import { z } from 'zod/v4'
import { buildTool, type ToolDef } from '../Tool.js'
import type { PermissionResult } from '../../utils/permissions/PermissionResult.js'
import { lazySchema } from '../../utils/lazySchema.js'

// ── Identity ────────────────────────────────────────────────────────────────

// 2.1.183: WEB_SEARCH_TOOL_NAME = rG @cli_inner_pretty.js:221393
export const WEB_SEARCH_TOOL_NAME = 'WebSearch'

// ── Prompt text ─────────────────────────────────────────────────────────────

/**
 * Builds the WebSearch `prompt()` text. Two branches keyed by the lean/simple
 * system-prompt predicate `Dg` (scaffold X3). Both interpolate the current
 * month-year via `kOi()` so search queries use the correct year.
 *
 * 2.1.183: buildWebSearchPrompt = m1i @cli_inner_pretty.js:221357-221391
 * Mapping: m1i→buildWebSearchPrompt, e→model, t→currentMonthYear, kOi→getLocalMonthYear, Dg→isLeanSystemPrompt
 */
function buildWebSearchPrompt(model: unknown): string {
  const currentMonthYear = getLocalMonthYear()

  if (isLeanSystemPrompt(model)) {
    // Lean branch @221360-221364.
    return `Search the web. Returns result blocks with titles and URLs. US-only.

- The current month is ${currentMonthYear} — use this when searching for recent information.
- \`allowed_domains\` / \`blocked_domains\` filter results.
- After answering from results, end with a "Sources:" list of the URLs you used as markdown links.`
  }

  // Verbose branch @221365-221390 — the full mandate (matches 2.1.88 prompt.ts).
  return `
- Allows Claude to search the web and use the results to inform responses
- Provides up-to-date information for current events and recent data
- Returns search result information formatted as search result blocks, including links as markdown hyperlinks
- Use this tool for accessing information beyond Claude's knowledge cutoff
- Searches are performed automatically within a single API call

CRITICAL REQUIREMENT - You MUST follow this:
  - After answering the user's question, you MUST include a "Sources:" section at the end of your response
  - In the Sources section, list all relevant URLs from the search results as markdown hyperlinks: [Title](URL)
  - This is MANDATORY - never skip including sources in your response
  - Example format:

    [Your answer here]

    Sources:
    - [Source Title 1](https://example.com/1)
    - [Source Title 2](https://example.com/2)

Usage notes:
  - Domain filtering is supported to include or block specific websites
  - Web search is only available in the US

IMPORTANT - Use the correct year in search queries:
  - The current month is ${currentMonthYear}. You MUST use this year when searching for recent information, documentation, or current events.
  - Example: If the user asks for "latest React docs", search for "React documentation" with the current year, NOT last year
`
}

// ── Schemas ─────────────────────────────────────────────────────────────────

// 2.1.183: inputSchema = dMp @cli_inner_pretty.js:428532-428537
const inputSchema = lazySchema(() =>
  z.strictObject({
    query: z.string().min(2).describe('The search query to use'), // @428534
    allowed_domains: z
      .array(z.string())
      .optional()
      .describe('Only include search results from these domains'), // @428535
    blocked_domains: z
      .array(z.string())
      .optional()
      .describe('Never include search results from these domains'), // @428536
  }),
)
type InputSchema = ReturnType<typeof inputSchema>
type Input = z.infer<InputSchema>

// 2.1.183: searchResultSchema = pMp @cli_inner_pretty.js:428539-428548
const searchResultSchema = lazySchema(() => {
  const searchHitSchema = z.object({
    title: z.string().describe('The title of the search result'), // @428541
    url: z.string().describe('The URL of the search result'), // @428542
  })
  return z.object({
    tool_use_id: z.string().describe('ID of the tool use'), // @428545
    content: z.array(searchHitSchema).describe('Array of search hits'), // @428546
  })
})
export type SearchResult = z.infer<ReturnType<typeof searchResultSchema>>

// 2.1.183: outputSchema = fMp @cli_inner_pretty.js:428549-428555
// NEW vs 2.1.88: optional `searchCount` field.
const outputSchema = lazySchema(() =>
  z.object({
    query: z.string().describe('The search query that was executed'),
    results: z
      .array(z.union([searchResultSchema(), z.string()]))
      .describe('Search results and/or text commentary from the model'),
    durationSeconds: z.number().describe('Time taken to complete the search operation'),
    searchCount: z.number().optional().describe('Number of web searches performed'), // @428554
  }),
)
type OutputSchema = ReturnType<typeof outputSchema>
export type Output = z.infer<OutputSchema>

// ── Server-tool schema + stream reducer ─────────────────────────────────────

/**
 * Builds the Anthropic `web_search_20250305` server-tool schema injected into
 * the nested query. Hard-capped at 8 searches per call.
 *
 * 2.1.183: buildWebSearchToolSchema = mMp @cli_inner_pretty.js:428475-428483
 * Mapping: mMp→buildWebSearchToolSchema, e→input
 */
function buildWebSearchToolSchema(input: Input): BetaWebSearchTool20250305 {
  return {
    type: 'web_search_20250305',
    name: 'web_search',
    allowed_domains: input.allowed_domains,
    blocked_domains: input.blocked_domains,
    max_uses: 8, // @428481
  }
}

/**
 * Reduces the streamed content blocks into the final Output. Interleaves
 * server_tool_use markers, web_search_tool_result hit-blocks (or error
 * strings), and text commentary, then sets `searchCount = max(serverToolUses,
 * resultBlocks)`.
 *
 * 2.1.183: reduceSearchBlocks = AMp @cli_inner_pretty.js:428484-428513
 * Mapping: AMp→reduceSearchBlocks, e→blocks, t→query, n→durationSeconds,
 *          r→results, o→textAcc, s→inText, i→serverToolUses, a→resultBlocks
 */
function reduceSearchBlocks(
  blocks: BetaContentBlock[],
  query: string,
  durationSeconds: number,
): Output {
  const results: (SearchResult | string)[] = []
  let textAcc = ''
  let inText = true
  let serverToolUses = 0
  let resultBlocks = 0

  for (const block of blocks) {
    if (block.type === 'server_tool_use') {
      serverToolUses++
      if (inText) {
        inText = false
        if (textAcc.trim().length > 0) results.push(textAcc.trim())
        textAcc = ''
      }
      continue
    }

    if (block.type === 'web_search_tool_result') {
      resultBlocks++
      // Error case: content is a WebSearchToolResultError, not an array. @428499-428502
      if (!Array.isArray(block.content)) {
        const errorMessage = `Web search error: ${(block.content as { error_code: string }).error_code}`
        logError(new Error(errorMessage))
        results.push(errorMessage)
        continue
      }
      const hits = block.content.map(r => ({ title: r.title, url: r.url }))
      results.push({ tool_use_id: block.tool_use_id, content: hits })
    }

    if (block.type === 'text') {
      if (inText) textAcc += block.text
      else {
        inText = true
        textAcc = block.text
      }
    }
  }

  if (textAcc.length) results.push(textAcc.trim())

  return {
    query,
    results,
    durationSeconds,
    searchCount: Math.max(serverToolUses, resultBlocks), // @428512
  }
}

// ── Gate / helper stubs (real bodies live elsewhere in the bundle) ──────────
// helper: isLeanSystemPrompt = Dg @134268-134273 — lean/simple system-prompt predicate (X3)
// helper: getLocalMonthYear = kOi @220216 — current month-year string for prompts
// helper: getAPIProvider = Ir @... — firstParty | anthropicAws | gateway | vertex | foundry
// helper: getMainLoopModel = Gs @... — active main-loop model id
// helper: isCcrProxyEnabled = Z9a @428634 — true when the CCR web-search proxy is configured
// helper: ccrProxySearch = e8a @428635 — runs the proxied search, returns {ok, results, …}
// helper: getFeatureGate = ct @... — Statsig flag getter (tengu_plum_vx3)
// helper: getSmallFastModel = Tw @... — small/fast model id
// helper: queryModelWithStreaming = sdt @... — nested streaming model query
// helper: foundryDeploymentSupports = Zoe @... — guards Foundry web_search availability
declare function isLeanSystemPrompt(model: unknown): boolean
declare function getLocalMonthYear(): string
declare function getAPIProvider(): string
declare function getMainLoopModel(): string
declare function logError(err: Error): void
type ToolUseContext = any
type WebSearchProgress = any

// ── Tool object ─────────────────────────────────────────────────────────────

// 2.1.183: WebSearchTool = V3n @cli_inner_pretty.js:428557-428770
export const WebSearchTool = buildTool({
  name: WEB_SEARCH_TOOL_NAME,
  searchHint: 'search the web for current information', // @428559
  maxResultSizeChars: 100_000, // @428560
  shouldDefer: true, // @428561

  async description(input) {
    // @428563
    return `Claude wants to search the web for: ${input.query}`
  },

  userFacingName() {
    return 'Web Search' // @428566
  },

  // getToolUseSummary: Dpo; getActivityDescription @428569-428571
  // → `Searching for ${summary}` | 'Searching the web'.

  /**
   * Provider gate (@428573-428588):
   *   - firstParty | anthropicAws → enabled.
   *   - gateway → disabled.
   *   - vertex → only when the model is claude-fable-5 / opus-4 / sonnet-4 / haiku-4.
   *   - foundry → enabled (Foundry only ships models that already support search).
   *   - otherwise disabled.
   */
  isEnabled() {
    const provider = getAPIProvider()
    if (provider === 'firstParty' || provider === 'anthropicAws') return true
    if (provider === 'gateway') return false
    if (provider === 'vertex') {
      const model = getMainLoopModel()
      return (
        model.includes('claude-fable-5') ||
        model.includes('claude-opus-4') ||
        model.includes('claude-sonnet-4') ||
        model.includes('claude-haiku-4')
      )
    }
    if (provider === 'foundry') return true
    return false
  },

  get inputSchema(): InputSchema {
    return inputSchema()
  },
  get outputSchema(): OutputSchema {
    return outputSchema()
  },

  isConcurrencySafe() {
    return true // @428595-428597
  },
  isReadOnly() {
    return true // @428598-428600
  },

  toAutoClassifierInput(input) {
    return input.query // @428601-428603
  },

  // Always passthrough — the harness asks once and suggests an allow rule. @428604-428609
  async checkPermissions(_input): Promise<PermissionResult> {
    return {
      behavior: 'passthrough',
      message: 'WebSearchTool requires permission.',
      suggestions: [
        {
          type: 'addRules',
          rules: [{ toolName: WEB_SEARCH_TOOL_NAME }],
          behavior: 'allow',
          destination: 'localSettings',
        },
      ],
    }
  },

  async prompt({ model }) {
    return buildWebSearchPrompt(model) // @428611-428613
  },

  // renderToolUseMessage: n8a, renderToolUseProgressMessage: r8a,
  // renderToolResultMessage: o8a — UI helpers (out of scope here).

  // Result chrome shows only "Did N searches in Xs"; results[] never renders,
  // so there is nothing for the transcript heuristic to index. @428617-428619
  extractSearchText() {
    return ''
  },

  async validateInput(input) {
    const { query, allowed_domains, blocked_domains } = input
    if (!query.length) {
      return { result: false, message: 'Error: Missing query', errorCode: 1 } // @428622
    }
    if (allowed_domains?.length && blocked_domains?.length) {
      return {
        result: false,
        // @428626
        message: 'Error: Cannot specify both allowed_domains and blocked_domains in the same request',
        errorCode: 2,
      }
    }
    return { result: true }
  },

  /**
   * Runs the search. Faithful behavior (@428631-428740):
   *
   *   - CCR-proxy fast path: when `isCcrProxyEnabled()` (@428634), call
   *     `ccrProxySearch(query, signal)`; on `!ok` throw a `ToolError`
   *     ('web-search-ccr-proxy'); else emit one `search_results_received`
   *     progress event and return `{ query, results:[{tool_use_id:'ccr-proxy-search-1',
   *     content}], durationSeconds, searchCount:1 }`. @428634-428656
   *
   *   - Otherwise issue a nested streaming model query with the `web_search`
   *     server-tool injected via `extraToolSchemas:[buildWebSearchToolSchema(input)]`
   *     and `toolChoice:{type:'tool', name:'web_search'}`. The model is the
   *     small/fast model when `getFeatureGate('tengu_plum_vx3', false)`, else
   *     the main-loop model; thinking is disabled; prompt caching is off. A
   *     Foundry guard (`foundryDeploymentSupports(model, 'web_search')`) throws
   *     'Web search is not available on this Foundry deployment.' if unsupported.
   *     @428657-428684, @428660-428661, @428737-428738
   *
   *   - While streaming: accumulate `assistant` message content; track the
   *     active `server_tool_use` id and accumulate its `input_json_delta` JSON,
   *     extracting the query via /"query"\s*:\s*"((?:[^"\\]|\\.)*)"/ to emit
   *     `query_update` progress; on each `web_search_tool_result`
   *     content_block_start emit `search_results_received` progress. @428690-428736
   *
   *   - Finally reduce all collected blocks via `reduceSearchBlocks`. @428739-428740
   */
  async call(input, context, _canUseTool, _parentMessage, onProgress) {
    const start = performance.now()
    const { query } = input

    // CCR-proxy fast path. @428634-428656
    if (isCcrProxyEnabled()) {
      const proxied = await ccrProxySearch(query, context.abortController.signal)
      const durationSeconds = (performance.now() - start) / 1000
      if (!proxied.ok) {
        throw new ToolError(
          formatError({
            error_type: proxied.errorType,
            source: proxied.source,
            message: proxied.errorMessage,
          }),
          'web-search-ccr-proxy',
        )
      }
      onProgress?.({
        type: 'progress',
        toolUseID: 'ccr-proxy-search-1',
        data: { type: 'search_results_received', resultCount: proxied.results.length, query },
      })
      return {
        data: {
          query,
          results: [{ tool_use_id: 'ccr-proxy-search-1', content: proxied.results }],
          durationSeconds,
          searchCount: 1,
        } satisfies Output,
      }
    }

    // Nested model query path. @428657-428684
    const userMessage = createUserMessage({
      content: 'Perform a web search for the query: ' + query,
    })
    const toolSchema = buildWebSearchToolSchema(input)
    const model = getFeatureGate('tengu_plum_vx3', false)
      ? getSmallFastModel()
      : context.options.mainLoopModel

    if (getAPIProvider() === 'foundry' && !foundryDeploymentSupports(model, 'web_search')) {
      throw new Error('Web search is not available on this Foundry deployment.') // @428661
    }

    const queryStream = queryModelWithStreaming({
      messages: [userMessage],
      systemPrompt: asSystemPrompt(['You are an assistant for performing a web search tool use']),
      thinkingConfig: { type: 'disabled' },
      tools: [],
      signal: context.abortController.signal,
      options: {
        getToolPermissionContext: async () => getToolPermissionContext(context),
        model,
        toolChoice: { type: 'tool', name: 'web_search' },
        isNonInteractiveSession: context.options.isNonInteractiveSession,
        hasAppendSystemPrompt: !!context.options.appendSystemPrompt,
        extraToolSchemas: [toolSchema],
        querySource: 'web_search_tool',
        enablePromptCaching: false,
        agents: context.options.agentDefinitions.activeAgents,
        mcpTools: [],
        agentId: context.agentId,
        agentContext: context.agentContext,
        stickyBetas: getStickyBetas(getBetaFlags()),
        effortValue: getEffortValue(context),
      },
    })

    const allContentBlocks: BetaContentBlock[] = []
    let currentToolUseId: string | null = null
    let currentToolUseJson = ''
    let progressCounter = 0
    const toolUseQueries = new Map<string, string>()

    for await (const event of queryStream) {
      if (event.type === 'assistant') {
        allContentBlocks.push(...event.message.content)
        continue
      }

      // Track the active server_tool_use id. @428695-428701
      if (event.type === 'stream_event' && event.event?.type === 'content_block_start') {
        const block = event.event.content_block
        if (block && block.type === 'server_tool_use') {
          currentToolUseId = block.id
          currentToolUseJson = ''
          continue
        }
      }

      // Accumulate JSON and extract the query for progress. @428702-428721
      if (
        currentToolUseId &&
        event.type === 'stream_event' &&
        event.event?.type === 'content_block_delta'
      ) {
        const delta = event.event.delta
        if (delta?.type === 'input_json_delta' && delta.partial_json) {
          currentToolUseJson += delta.partial_json
          try {
            const match = currentToolUseJson.match(/"query"\s*:\s*"((?:[^"\\]|\\.)*)"/)
            if (match && match[1]) {
              const extractedQuery = jsonParse('"' + match[1] + '"')
              if (
                !toolUseQueries.has(currentToolUseId) ||
                toolUseQueries.get(currentToolUseId) !== extractedQuery
              ) {
                toolUseQueries.set(currentToolUseId, extractedQuery)
                progressCounter++
                onProgress?.({
                  type: 'progress',
                  toolUseID: `search-progress-${progressCounter}`,
                  data: { type: 'query_update', query: extractedQuery },
                })
              }
            }
          } catch {
            // ignore partial-JSON parse errors
          }
        }
      }

      // Emit progress when results arrive. @428722-428735
      if (event.type === 'stream_event' && event.event?.type === 'content_block_start') {
        const block = event.event.content_block
        if (block && block.type === 'web_search_tool_result') {
          const toolUseId = block.tool_use_id
          const actualQuery = toolUseQueries.get(toolUseId) || query
          const content = block.content
          progressCounter++
          onProgress?.({
            type: 'progress',
            toolUseID: toolUseId || `search-progress-${progressCounter}`,
            data: {
              type: 'search_results_received',
              resultCount: Array.isArray(content) ? content.length : 0,
              query: actualQuery,
            },
          })
        }
      }
    }

    // Re-check the Foundry guard post-stream. @428737-428738
    if (getAPIProvider() === 'foundry' && !foundryDeploymentSupports(model, 'web_search')) {
      throw new Error('Web search is not available on this Foundry deployment.')
    }

    const durationSeconds = (performance.now() - start) / 1000
    return { data: reduceSearchBlocks(allContentBlocks, query, durationSeconds) }
  },

  /**
   * Formats the result block: a `Web search results for query: "<q>"` header,
   * each entry rendered as `Links: <json>` / `No links found.` / a text
   * summary, then the mandatory sources reminder. @428742-428768
   * Guards null entries (compaction / transcript round-trip).
   */
  mapToolResultToToolResultBlockParam(output, toolUseID) {
    const { query, results } = output
    let formattedOutput = `Web search results for query: "${query}"

`
    ;(results ?? []).forEach(result => {
      if (result == null) return
      if (typeof result === 'string') {
        formattedOutput += result + '\n\n'
      } else if (result.content?.length > 0) {
        formattedOutput += `Links: ${jsonStringify(result.content)}\n\n`
      } else {
        formattedOutput += 'No links found.\n\n'
      }
    })

    // @428765-428766
    formattedOutput +=
      '\nREMINDER: You MUST include the sources above in your response to the user using markdown hyperlinks.'

    return { tool_use_id: toolUseID, type: 'tool_result', content: formattedOutput.trim() }
  },
} as unknown as ToolDef<InputSchema, Output, WebSearchProgress>)

// ── External-helper stubs (real bodies live elsewhere in the bundle) ─────────
declare function isCcrProxyEnabled(): boolean // Z9a @428634
declare function ccrProxySearch(
  query: string,
  signal: AbortSignal,
): Promise<{
  ok: boolean
  results: any[]
  errorType?: string
  source?: string
  errorMessage?: string
}> // e8a @428635
declare function getFeatureGate(flag: string, fallback: boolean): boolean // ct @...
declare function getSmallFastModel(): string // Tw @...
declare function foundryDeploymentSupports(model: string, name: string): boolean // Zoe @...
declare function queryModelWithStreaming(args: any): AsyncIterable<any> // sdt @...
declare function createUserMessage(args: { content: string }): any // Rn @...
declare function asSystemPrompt(lines: string[]): any // Wc @...
declare function getToolPermissionContext(context: ToolUseContext): unknown // Br @...
declare function jsonParse(s: string): string // Gt @...
declare function jsonStringify(v: unknown): string // Re @...
declare function getStickyBetas(flags: unknown): unknown // F0 @...
declare function getBetaFlags(): unknown // gk @...
declare function getEffortValue(context: ToolUseContext): unknown // Bg @...
// NOT a distinct symbol: the CCR-proxy error path (@428639) formats its error
// object via the same Re=JSON.stringify as jsonStringify above —
// `Re({ error_type, source, message })`. Aliased here only for call-site readability.
declare function formatError(o: unknown): string // Re=JSON.stringify @9461 (call @428639)
declare class ToolError extends Error {
  constructor(message: string, source: string)
}
