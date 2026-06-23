/**
 * ToolSearchTool — the deferred-tool discovery / loader.
 *
 * Deferred tools are not advertised with full schemas in the turn-1 prompt; they
 * appear only by *name* in <system-reminder> messages, and the model must call
 * `ToolSearch` to fetch their JSONSchema (returned as `tool_reference` content
 * blocks) before it can invoke them. ToolSearch also bridges MCP autodiscovery:
 * a single call can *wait* (<=5s) for a relevant still-connecting MCP server,
 * then re-search, so the asynchrony is invisible to the model.
 *
 * Reconstructed at READABLE-SOURCE level for Claude Code v2.1.183.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - module export `mUi`/`gt`                  : 230250-230256
 *   - `getDeferredToolsCacheKey`  (eId)         : 230257-230262
 *   - `maybeInvalidateCache`      (cUi)         : 230263-230266
 *   - `clearToolSearchDescriptionCache` (tId)   : 230267-230269
 *   - `buildSearchResult`         (gnt)         : 230270-230272
 *   - `parseToolName`             (uUi)         : 230273-230288
 *   - `compileTermPatterns`       (nId)         : 230289-230293
 *   - `searchToolsWithKeywords`   (dUi)         : 230294-230362
 *   - `MCP_WAIT_BUDGET_MS`        (ZCd=5000)    : 230365
 *   - input/output schema         (pUi/fUi)     : 230381-230396
 *   - `getToolDescriptionMemoized`(oCn)         : 230397-230416
 *   - `ToolSearchTool` object     (IMt)         : 230417-230637
 *   - prompt builder `getPrompt`  (own + xvd/kvd/Lvd/Dvd) : 222325-222342
 *   - `getToolSearchMode`         (PPt)         : 221183-221193
 *   - `getNonDeferrableBuiltins`  (c1i)         : 221201-221217
 *   - `getUnsupportedModelsList`  (ovd)         : 221194-221200
 *   - `modelSupportsToolReference`(f7)          : 221218-221223
 *   - `isToolSearchEnabledOptimistic` (fR)      : 221224-221252
 *   - `isDeferredTool`            (G2)          : 222307-222321
 *   - `formatDeferredToolLine`    (k5r)         : 222322-222324
 *   - `isToolSearchEnabled`       (J4t)         : 462248-462303
 *   - `checkAutoThreshold`        (A3p)         : 462415-462434
 *   - beta header `getToolSearchBeta` (wti)     : 134585-134589
 *   - juniper_shoal config gate `toolSearchFetchRule` (qmi) : 147794-147796
 *
 * 2.1.88 convention mirror:
 *   src/tools/ToolSearchTool/{ToolSearchTool.ts, prompt.ts, constants.ts}
 *   (this single file folds prompt.ts + the toolSearch.ts utils into one unit; the
 *    2.1.88 tree split them across files).
 * 2.1.156 scaffold doc: 04_tools/tool_search.md (logic spine + readable names).
 *
 * Cross-validation note: every quoted string, Zod field, scoring weight, constant
 * (ZCd=5000, Sae=30), and branch below was re-read from the 2.1.183 bundle at the
 * line anchors above (the schemas, scorer, cache, MCP-wait machine, and select:/
 * keyword dispatch are byte-identical to 2.1.156; the seven confirmed 2.1.183
 * deltas are flagged inline with `// 2.1.183 DELTA`).
 */

import { z } from 'zod/v4'
import memoize from 'lodash-es/memoize.js'
import {
  buildTool,
  findToolByName, // vl @230301,230546
  type Tool,
  type Tools,
  type ToolResultBlockParam,
} from '../Tool.js'
import { logEvent } from '../../services/analytics/index.js' // G @widely
import { logForDebugging } from '../../utils/debug.js' // v @230265,...
import { lazySchema } from '../../utils/lazySchema.js' // we @230381
import { escapeRegExp } from '../../utils/stringUtils.js' // q0 @230291,230461
import { getMcpInfo } from '../../mcp/mcpInfo.js' // kk @230275
import { stripMcpServerPrefix } from '../../mcp/mcpName.js' // oc @230477
import { sleep } from '../../utils/time.js' // Un @230478
import { getAPIProvider } from '../../api/provider.js' // Ir @134586
import { isFirstPartyAnthropicBaseUrl } from '../../api/baseUrl.js' // Pu @221230
import { getFeatureGateValue } from '../../services/analytics/growthbook.js' // ct @221195
import { getClientConfig } from '../../services/clientConfig.js' // wt @221209
import { isExperimentalBetasDisabled } from '../../utils/betas.js' // jNe @134593
import { getToolSearchFetchRuleEnabled } from '../../config/toolSearchConfig.js' // qmi @147794
import { foundryDeploymentSupports } from '../../api/foundry.js' // Zoe @462270
import {
  parseAutoPercentage, // a5r
  isAutoToolSearchMode, // nvd
  isEnvTruthy, // st
  isEnvDefinedFalsy, // yl
} from '../../utils/toolSearchEnv.js'

// =====================================================================
// Identity
// =====================================================================

// 2.1.183: TOOL_SEARCH_TOOL_NAME = DA @cli_inner_pretty.js:221267 (var DA = "ToolSearch")
export const TOOL_SEARCH_TOOL_NAME = 'ToolSearch'

// 2.1.183: MCP_WAIT_BUDGET_MS = ZCd @cli_inner_pretty.js:230365 (var ZCd = 5000)
// The in-tool wait budget: equal to the standard MCP connect timeout, so the
// wait never outlives the connection attempt it is waiting on.
const MCP_WAIT_BUDGET_MS = 5000

// 2.1.183: DEFERRED_DELTA_LIST_CAP = Sae @cli_inner_pretty.js:462436 (var Sae = 30)
// Cap for inline name listing in hints (pending/removed) before summarizing.
const DEFERRED_DELTA_LIST_CAP = 30

// =====================================================================
// Beta headers — getToolSearchBeta (wti @134585-134589)
// =====================================================================

// 2.1.183: ADVANCED_TOOL_USE_BETA = cCr @cli_inner_pretty.js:101569
//   cCr = jS("tool_search", "advanced-tool-use-2025-11-20")
const ADVANCED_TOOL_USE_BETA = 'advanced-tool-use-2025-11-20'
// 2.1.183: TOOL_SEARCH_TOOL_BETA = JTt @cli_inner_pretty.js:101570
//   JTt = jS("tool_search", "tool-search-tool-2025-10-19")
const TOOL_SEARCH_TOOL_BETA = 'tool-search-tool-2025-10-19'

// 2.1.183: getToolSearchBeta = wti @cli_inner_pretty.js:134585
// Provider→header mapping (vertex/bedrock/mantle/gateway → the 3P beta, else the
// 1P advanced-tool-use beta). Unchanged from 2.1.156 oEK; beta values unchanged.
export function getToolSearchBeta(): string {
  const provider = getAPIProvider() // Ir @134586
  if (
    provider === 'vertex' ||
    provider === 'bedrock' ||
    provider === 'mantle' ||
    provider === 'gateway'
  ) {
    return TOOL_SEARCH_TOOL_BETA
  }
  return ADVANCED_TOOL_USE_BETA
}

// =====================================================================
// Input / output schemas (pUi @230381, fUi @230389)
//   Byte-identical to 2.1.156 + 2.1.88 — same field names, describe text, default(5).
// =====================================================================

// 2.1.183: inputSchema = pUi @cli_inner_pretty.js:230381-230388
export const inputSchema = lazySchema(() =>
  z.object({
    query: z
      .string()
      // @230384 verbatim describe
      .describe(
        'Query to find deferred tools. Use "select:<tool_name>" for direct selection, or keywords to search.',
      ),
    max_results: z
      .number()
      .optional()
      .default(5)
      // @230386 verbatim describe
      .describe('Maximum number of results to return (default: 5)'),
  }),
)
type Input = z.infer<ReturnType<typeof inputSchema>>

// 2.1.183: outputSchema = fUi @cli_inner_pretty.js:230389-230396
export const outputSchema = lazySchema(() =>
  z.object({
    matches: z.array(z.string()), // tool names matched (→ tool_reference blocks)
    query: z.string(), // echo of the query
    total_deferred_tools: z.number(), // size of the deferred pool (lets the model broaden)
    pending_mcp_servers: z.array(z.string()).optional(), // servers still connecting
  }),
)
export type Output = z.infer<ReturnType<typeof outputSchema>>

// =====================================================================
// The ToolSearch prompt text (getPrompt = own @222325-222342)
//   2.1.183 DELTA: splices a conditional middle paragraph keyed on the
//   `toolSearchFetchRule` (qmi) config gate. 2.1.156 r18 was a flat concat.
// =====================================================================

// 2.1.183: PROMPT_HEAD = xvd @cli_inner_pretty.js:222330-222332 (verbatim)
const PROMPT_HEAD = `Fetches full schema definitions for deferred tools so they can be called.

Deferred tools appear by name in <system-reminder> messages.`

// 2.1.183: PROMPT_MID_LEGACY = kvd @cli_inner_pretty.js:222333 (verbatim, qmi() false)
const PROMPT_MID_LEGACY = ` Until fetched, only the name is known — there is no parameter schema, so the tool cannot be invoked.`

// 2.1.183 DELTA: PROMPT_MID_FETCHRULE = Lvd @cli_inner_pretty.js:222334 (verbatim, qmi() true)
// NEW directive variant — names InputValidationError and instructs the model to
// proactively `select:` any deferred tool whenever any text names it.
const PROMPT_MID_FETCHRULE = ` Until fetched, only the name is known — there is no parameter schema, so calling the tool fails with InputValidationError. When any instruction, system reminder, or other tool's description names a deferred tool, fetch it with query "select:<name>" before calling it.`

// 2.1.183: PROMPT_TAIL = Dvd @cli_inner_pretty.js:222335-222342 (verbatim)
const PROMPT_TAIL = ` This tool takes a query, matches it against the deferred tool list, and returns the matched tools' complete JSONSchema definitions inside a <functions> block. Once a tool's schema appears in that result, it is callable exactly like any tool defined at the top of the prompt.

Result format: each matched tool appears as one <function>{"description": "...", "name": "...", "parameters": {...}}</function> line inside the <functions> block — the same encoding as the tool list at the top of this prompt.

Query forms:
- "select:Read,Edit,Grep" — fetch these exact tools by name
- "notebook jupyter" — keyword search, up to max_results best matches
- "+slack send" — require "slack" in the name, rank by remaining terms`

// 2.1.183: getPrompt = own @cli_inner_pretty.js:222325-222327
//   own() { return xvd + (qmi() ? Lvd : kvd) + Dvd; }
export function getPrompt(): string {
  return (
    PROMPT_HEAD +
    (getToolSearchFetchRuleEnabled() ? PROMPT_MID_FETCHRULE : PROMPT_MID_LEGACY) + // @222326 qmi() gate
    PROMPT_TAIL
  )
}

// =====================================================================
// isDeferredTool — the deferral ladder (G2 @222307-222321)
//   Decides whether a tool ships name-only (defer_loading) or full-schema.
//   2.1.183 DELTA: inserts two rules (getNonDeferrableBuiltins, PushNotification
//   in remote_trigger) and reorders. See getNonDeferrableBuiltins below.
// =====================================================================

// helper: tool name constants resolved in 2.1.183 bundle —
//   AGENT_TOOL_NAME            = vs  @149939 ("Agent")
//   BRIEF_TOOL_NAME            = Cvd @222350 (ro(xCe).BRIEF_TOOL_NAME)
//   SEND_USER_FILE_TOOL_NAME   = Ivd @222350 (ro(QTn).SEND_USER_FILE_TOOL_NAME)
//   PUSH_NOTIFICATION_TOOL_NAME= G9  @220751 ("PushNotification")
//   SCHEDULE_WAKEUP_TOOL_NAME  = $g  @220800 ("ScheduleWakeup")
//   ENTER_WORKTREE_TOOL_NAME   = WAe @221266 ("EnterWorktree")
import { AGENT_TOOL_NAME } from '../AgentTool/constants.js' // vs
import { BRIEF_TOOL_NAME } from '../BriefTool/constants.js' // Cvd
import { SEND_USER_FILE_TOOL_NAME } from '../SendUserFileTool/constants.js' // Ivd
import { PUSH_NOTIFICATION_TOOL_NAME } from '../PushNotificationTool/constants.js' // G9
import { SCHEDULE_WAKEUP_TOOL_NAME } from '../ScheduleWakeupTool/constants.js' // $g
import { ENTER_WORKTREE_TOOL_NAME } from '../EnterWorktreeTool/constants.js' // WAe
import { isForkSubagentEnabledMod } from '../AgentTool/forkSubagent.js' // (MCe(), ro(D1i))
import { isRemoteTriggerEntrypoint } from '../../entrypoints/remoteTrigger.js' // wen @43733
import { isKairosLoopDynamicEnabled } from '../../config/kairos.js' // jAe @221035

// 2.1.183: isDeferredTool = G2 @cli_inner_pretty.js:222307-222321
export function isDeferredTool(tool: Tool): boolean {
  // 1 — explicit opt-out (MCP tools set this via _meta['anthropic/alwaysLoad']); first.
  if (tool.alwaysLoad === true) return false

  // 2 — 2.1.183 DELTA (NEW, before MCP): server-side exempt list. @222309
  // Lets Anthropic force any builtin (even an MCP-named tool) to load eagerly
  // without a client release. Placed before the MCP check so it can override it.
  if (getNonDeferrableBuiltins().includes(tool.name)) return false

  // 3 — MCP tools are always deferred (workflow-specific, potentially hundreds).
  if (tool.isMcp === true) return true

  // 4 — never defer ToolSearch itself: the model needs it to load everything else.
  if (tool.name === TOOL_SEARCH_TOOL_NAME) return false

  // 5 — fork-first experiment: Agent must be visible turn-1, not behind ToolSearch.
  if (tool.name === AGENT_TOOL_NAME && isForkSubagentEnabledMod().isForkSubagentEnabled())
    return false

  // 6 — Brief is the primary communication channel; its text-visibility contract
  //     must be seen without a ToolSearch round-trip.
  if (tool.name === BRIEF_TOOL_NAME) return false

  // 7 — SendUserFile is a sibling file-delivery channel; same reasoning.
  if (tool.name === SEND_USER_FILE_TOOL_NAME) return false

  // 8 — 2.1.183 DELTA (NEW): in remote_trigger sessions, PushNotification is the
  //     primary way to surface results back to the user, so it must be visible
  //     turn-1 (mirrors the EnterWorktree-in-bg exemption). @222317
  if (tool.name === PUSH_NOTIFICATION_TOOL_NAME && isRemoteTriggerEntrypoint()) return false

  // 9 — ScheduleWakeup not deferred when the kairos dynamic-loop gate is on. @222318
  if (tool.name === SCHEDULE_WAKEUP_TOOL_NAME && isKairosLoopDynamicEnabled()) return false

  // 10 — EnterWorktree not deferred in background-session kind. @222319
  if (
    tool.name === ENTER_WORKTREE_TOOL_NAME &&
    process.env.CLAUDE_CODE_SESSION_KIND === 'bg'
  )
    return false

  // 11 — fallthrough: the tool's own shouldDefer flag.
  return tool.shouldDefer === true
}

// 2.1.183: getNonDeferrableBuiltins = c1i @cli_inner_pretty.js:221201-221217  (NEW in 2.1.183)
// Server-side kill-switch: a dynamic exempt set of builtin names that must never
// defer. Sourced from (a) the GrowthBook gate `tengu_non_deferrable_builtins`
// and (b) server clientData `non_deferrable_builtins`. Default = [] (no exemptions).
const EMPTY_NON_DEFERRABLE: string[] = [] // svd @221264
export function getNonDeferrableBuiltins(): string[] {
  const names = new Set<string>()
  try {
    // @221204 GrowthBook gate
    const gateValue = getFeatureGateValue('tengu_non_deferrable_builtins', null)
    if (Array.isArray(gateValue)) {
      for (const n of gateValue) if (typeof n === 'string') names.add(n)
    }
  } catch {}
  try {
    // @221210 server clientData override
    const clientData = getClientConfig().clientDataCache?.non_deferrable_builtins
    if (Array.isArray(clientData)) {
      for (const n of clientData) if (typeof n === 'string') names.add(n)
    }
  } catch {}
  if (names.size === 0) return EMPTY_NON_DEFERRABLE
  return [...names]
}

// 2.1.183: formatDeferredToolLine = k5r @cli_inner_pretty.js:222322-222324
// One line per deferred tool in the <system-reminder> announcement = its name.
// (Search hints are intentionally not rendered — the hints A/B showed no benefit.)
export function formatDeferredToolLine(tool: Tool): string {
  return tool.name
}

// =====================================================================
// Enablement machine
// =====================================================================

// 2.1.183: getToolSearchMode = PPt @cli_inner_pretty.js:221183-221193
//   Map ENABLE_TOOL_SEARCH → "tst" | "tst-auto" | "standard". Identical to 2.1.156.
//   - (unset)               → "tst"      (default: defer MCP + shouldDefer tools)
//   - true / auto:0         → "tst"      (always defer)
//   - auto / auto:1..99     → "tst-auto" (defer iff deferred tokens exceed N% of ctx)
//   - false / auto:100      → "standard" (disabled — every full schema ships inline)
//   - DISABLE_EXPERIMENTAL_BETAS / hipaa → "standard" (hard kill, overrides all)
export function getToolSearchMode(): 'tst' | 'tst-auto' | 'standard' {
  if (isExperimentalBetasDisabled()) return 'standard' // jNe = DISABLE_EXPERIMENTAL_BETAS || hipaa
  const raw = process.env.ENABLE_TOOL_SEARCH
  const pct = raw ? parseAutoPercentage(raw) : null
  if (pct === 0) return 'tst'
  if (pct === 100) return 'standard'
  if (isAutoToolSearchMode(raw)) return 'tst-auto'
  if (isEnvTruthy(raw)) return 'tst'
  if (isEnvDefinedFalsy(process.env.ENABLE_TOOL_SEARCH)) return 'standard'
  return 'tst' // unset default
}

// 2.1.183: getUnsupportedModelsList = ovd @cli_inner_pretty.js:221194-221200
// 2.1.183 DELTA: default list narrowed from 2.1.156 ["haiku"] → only the OLD
// haikus, so Haiku 4.5+ is now supported for tool_reference. Overridable via the
// GrowthBook gate `tengu_tool_search_unsupported_models`.
const TOOL_SEARCH_UNSUPPORTED_MODELS = ['claude-3-5-haiku', 'claude-3-haiku'] // rvd @221263
function getUnsupportedModelsList(): string[] {
  try {
    const gateValue = getFeatureGateValue('tengu_tool_search_unsupported_models', null) // @221196
    if (Array.isArray(gateValue)) return gateValue
  } catch {}
  return TOOL_SEARCH_UNSUPPORTED_MODELS
}

// 2.1.183: modelSupportsToolReference = f7 @cli_inner_pretty.js:221218-221223
// Negative substring test of the model id against the unsupported list.
export function modelSupportsToolReference(model: string): boolean {
  const lowered = model.toLowerCase()
  for (const unsupported of getUnsupportedModelsList())
    if (lowered.includes(unsupported.toLowerCase())) return false
  return true
}

// 2.1.183: isToolSearchEnabledOptimistic = fR @cli_inner_pretty.js:221224-221252
// Cheap "could tool search be on?" check (no model/threshold awareness). Used to
// decide whether ToolSearch is in the base tool list and whether tool_reference
// fields are preserved. Debug strings logged once via ICe.
let _optimisticLoggedOnce = false // ICe @221252
export function isToolSearchEnabledOptimistic(): boolean {
  const mode = getToolSearchMode()
  if (mode === 'standard') {
    if (!_optimisticLoggedOnce) {
      _optimisticLoggedOnce = true
      // @221229 verbatim debug
      logForDebugging(
        `[ToolSearch:optimistic] mode=${mode}, ENABLE_TOOL_SEARCH=${process.env.ENABLE_TOOL_SEARCH}, result=false`,
      )
    }
    return false
  }
  // firstParty provider but a non-Anthropic base URL → a proxy that may reject
  // tool_reference (400). Disable unless ENABLE_TOOL_SEARCH was explicitly set.
  if (
    !process.env.ENABLE_TOOL_SEARCH &&
    getAPIProvider() === 'firstParty' &&
    !isFirstPartyAnthropicBaseUrl()
  ) {
    if (!_optimisticLoggedOnce) {
      _optimisticLoggedOnce = true
      // @221236 verbatim debug
      logForDebugging(
        `[ToolSearch:optimistic] disabled: ANTHROPIC_BASE_URL=${process.env.ANTHROPIC_BASE_URL} is not a first-party Anthropic host. Set ENABLE_TOOL_SEARCH=true (or auto / auto:N) if your proxy forwards tool_reference blocks.`,
      )
    }
    return false
  }
  // Vertex AI does not accept the tool-search beta header → disable unless forced.
  if (!process.env.ENABLE_TOOL_SEARCH && getAPIProvider() === 'vertex') {
    if (!_optimisticLoggedOnce) {
      _optimisticLoggedOnce = true
      // @221244 verbatim debug
      logForDebugging(
        '[ToolSearch:optimistic] disabled: Vertex AI does not accept the tool-search beta header. Set ENABLE_TOOL_SEARCH=true to override.',
      )
    }
    return false
  }
  if (!_optimisticLoggedOnce) {
    _optimisticLoggedOnce = true
    // @221250 verbatim debug
    logForDebugging(
      `[ToolSearch:optimistic] mode=${mode}, ENABLE_TOOL_SEARCH=${process.env.ENABLE_TOOL_SEARCH}, result=true`,
    )
  }
  return true
}

// 2.1.183: isToolSearchToolAvailable = gLe @cli_inner_pretty.js:462232
// helper: gLe @462232 — true if ToolSearch is present in the pool (not disallowed).
import { isToolSearchToolAvailable } from '../../utils/toolSearch.js' // gLe

// 2.1.183: isToolSearchEnabled = J4t @cli_inner_pretty.js:462248-462303
// The definitive, async, per-request gate used at API-call time. Each decision is
// logged as `tengu_tool_search_mode_decision` with a `reason`.
// 2.1.183 DELTA: NEW Foundry-deployment gate (foundry_deployment_unsupported); the
// model_unsupported message now lists "Haiku 4.5+" (matching the narrowed list).
export async function isToolSearchEnabled(
  model: string,
  tools: Tools,
  getToolPermissionContext: unknown, // n — threaded to checkAutoThreshold
  agents: unknown, // r — threaded to checkAutoThreshold
  source?: string, // o — telemetry tag
): Promise<boolean> {
  const mcpToolCount = tools.filter(t => t.isMcp).length
  const log = (enabled: boolean, mode: string, reason: string, extra?: object) =>
    logEvent('tengu_tool_search_mode_decision', {
      enabled,
      mode,
      reason,
      checkedModel: model,
      mcpToolCount,
      mcpNonBlocking: /* Jbe() */ undefined,
      userType: 'external',
      ...extra,
    })

  // (1) model must support tool_reference blocks.
  if (!modelSupportsToolReference(model)) {
    // @462265 verbatim debug
    logForDebugging(
      `Tool search disabled for model '${model}': model does not support tool_reference blocks. This feature is available on Claude Sonnet 4+, Opus 4+, Haiku 4.5+, and newer models.`,
    )
    log(false, 'standard', 'model_unsupported')
    return false
  }

  // (2) 2.1.183 DELTA — Foundry deployment must support both tool_search_server
  //     and tool_search for this model, else tool search is off. @462270
  if (
    !foundryDeploymentSupports(model, 'tool_search_server') ||
    !foundryDeploymentSupports(model, 'tool_search')
  ) {
    // @462272 verbatim debug
    logForDebugging(`Tool search disabled: Foundry deployment for '${model}' does not support tool search.`)
    log(false, 'standard', 'foundry_deployment_unsupported')
    return false
  }

  // (3) ToolSearch must be present in the pool.
  if (!isToolSearchToolAvailable(tools)) {
    // @462278 verbatim debug
    logForDebugging(
      'Tool search disabled: ToolSearchTool is not available (may have been disallowed via disallowedTools).',
    )
    log(false, 'standard', 'mcp_search_unavailable')
    return false
  }

  // (4) switch on the configured mode.
  const mode = getToolSearchMode()
  switch (mode) {
    case 'tst':
      log(true, mode, 'tst_enabled')
      return true
    case 'tst-auto': {
      // helper: checkAutoThreshold A3p @462415 — deferred-tool token (or char) count
      //         vs Math.floor(contextWindow × pct). See note below.
      const { enabled, debugDescription, metrics } = await checkAutoThreshold(
        tools,
        getToolPermissionContext,
        agents,
        model,
      )
      if (enabled) {
        logForDebugging(`Auto tool search enabled: ${debugDescription}` + (source ? ` [source: ${source}]` : ''))
        log(true, mode, 'auto_above_threshold', metrics)
        return true
      }
      logForDebugging(`Auto tool search disabled: ${debugDescription}` + (source ? ` [source: ${source}]` : ''))
      log(false, mode, 'auto_below_threshold', metrics)
      return false
    }
    case 'standard':
      log(false, mode, 'standard_mode')
      return false
  }
}

// 2.1.183: checkAutoThreshold = A3p @cli_inner_pretty.js:462415-462434
// auto:N threshold: compare deferred-tool token count to Math.floor(ctx × pct);
// if the token-count API is unavailable, fall back to a 2.5-chars-per-token char
// count vs the char threshold. (Deep counters d3p/p3p/gel/hel summarized.)
declare function checkAutoThreshold(
  tools: Tools,
  getToolPermissionContext: unknown,
  agents: unknown,
  model: string,
): Promise<{ enabled: boolean; debugDescription: string; metrics: object }>

// =====================================================================
// Description fingerprint cache (eId / cUi / tId @230257-230269)
//   Memoized tool.prompt() rendering, invalidated when the deferred-tool set
//   (its sorted-name fingerprint) changes. Byte-identical to 2.1.156.
// =====================================================================

let cachedDeferredToolNames: string | null = null // m9r @230363

// 2.1.183: getDeferredToolsCacheKey = eId @cli_inner_pretty.js:230257-230262
function getDeferredToolsCacheKey(deferredTools: Tools): string {
  return deferredTools
    .map(t => t.name)
    .sort()
    .join(',')
}

// 2.1.183: getToolDescriptionMemoized = oCn @cli_inner_pretty.js:230397-230416
// Renders a tool's prompt() with a stub ("default") permission context, memoized
// by tool name. Used by the keyword scorer to score against description text.
// Exported as the single home so the deferral machinery (deferredTools.ts) imports
// this one definition rather than re-declaring the memoized scorer helper.
export const getToolDescriptionMemoized = memoize(
  async (name: string, tools: Tools): Promise<string> => {
    const tool = findToolByName(tools, name) // vl @230398
    if (!tool) return ''
    return tool.prompt({
      getToolPermissionContext: async () => ({
        mode: 'default',
        additionalWorkingDirectories: new Map(),
        alwaysAllowRules: {},
        alwaysDenyRules: {},
        alwaysAskRules: {},
        isBypassPermissionsModeAvailable: false,
        mcpPermissionModeOverrides: {},
      }),
      tools,
      agents: [],
    })
  },
  (name: string) => name, // memo key = name only @230415
)

// 2.1.183: maybeInvalidateCache = cUi @cli_inner_pretty.js:230263-230266
function maybeInvalidateCache(deferredTools: Tools): void {
  const key = getDeferredToolsCacheKey(deferredTools)
  if (cachedDeferredToolNames !== key) {
    // @230265 verbatim debug
    logForDebugging('ToolSearchTool: cache invalidated - deferred tools changed')
    getToolDescriptionMemoized.cache.clear?.()
    cachedDeferredToolNames = key
  }
}

// 2.1.183: clearToolSearchDescriptionCache = tId @cli_inner_pretty.js:230267-230269
export function clearToolSearchDescriptionCache(): void {
  getToolDescriptionMemoized.cache.clear?.()
  cachedDeferredToolNames = null
}

// =====================================================================
// buildSearchResult (gnt @230270-230272)
//   Wrap matches into the tool's { data } envelope; only attach
//   pending_mcp_servers when non-empty.
// =====================================================================

// 2.1.183: buildSearchResult = gnt @cli_inner_pretty.js:230270-230272
function buildSearchResult(
  matches: string[],
  query: string,
  totalDeferredTools: number,
  pendingServers: string[],
): { data: Output } {
  return {
    data: {
      matches,
      query,
      total_deferred_tools: totalDeferredTools,
      ...(pendingServers.length > 0 && { pending_mcp_servers: pendingServers }),
    },
  }
}

// =====================================================================
// Keyword scorer (parseToolName / compileTermPatterns / searchToolsWithKeywords)
//   Byte-identical logic to 2.1.156, including the coarseParts dimension.
// =====================================================================

interface ParsedToolName {
  parts: string[]
  coarseParts: string[]
  full: string
  isMcp: boolean
}

// 2.1.183: parseToolName = uUi @cli_inner_pretty.js:230273-230288
// Split a tool name into searchable tokens. MCP tools tokenize server+tool;
// regular tools split camelCase + underscores. coarseParts = whole lowered names.
export function parseToolName(tool: Tool): ParsedToolName {
  const name = tool.name
  const mcpInfo = tool.mcpInfo ?? getMcpInfo(name) // kk @230275
  if (mcpInfo) {
    const coarseParts = [mcpInfo.serverName, mcpInfo.toolName]
      .filter(Boolean)
      .map(s => s.toLowerCase())
    const parts = coarseParts.flatMap(s => s.split(/[\s_.]+/)).filter(Boolean)
    return { parts, coarseParts, full: parts.join(' '), isMcp: true }
  }
  const parts = name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replaceAll('_', ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  return { parts, coarseParts: [name.toLowerCase()], full: parts.join(' '), isMcp: false }
}

// 2.1.183: compileTermPatterns = nId @cli_inner_pretty.js:230289-230293
// One whole-word \b...\b regex per search term, cached in a Map.
export function compileTermPatterns(terms: string[]): Map<string, RegExp> {
  const patterns = new Map<string, RegExp>()
  for (const term of terms)
    if (!patterns.has(term)) patterns.set(term, new RegExp(`\\b${escapeRegExp(term)}\\b`)) // q0 @230291
  return patterns
}

// 2.1.183: searchToolsWithKeywords = dUi @cli_inner_pretty.js:230294-230362
// Three stages:
//   (1) exact-name hit (deferred first, then full pool) → [name].
//   (2) mcp__ prefix (length>5) → that server's deferred tools, sliced to maxResults.
//   (3) +required / optional partition: pre-filter survivors that satisfy *every*
//       required term, then score all survivors and take the top maxResults.
export async function searchToolsWithKeywords(
  query: string,
  deferred: Tools,
  fullPool: Tools,
  maxResults: number,
): Promise<string[]> {
  const q = query.toLowerCase().trim()

  // (1) exact name match — deferred first, then full pool.
  const exact =
    deferred.find(t => t.name.toLowerCase() === q) ??
    fullPool.find(t => t.name.toLowerCase() === q)
  if (exact) return [exact.name]

  // (2) mcp__ server prefix — return that server's deferred tools.
  if (q.startsWith('mcp__') && q.length > 5) {
    const serverHits = deferred
      .filter(t => t.name.toLowerCase().startsWith(q))
      .slice(0, maxResults)
      .map(t => t.name)
    if (serverHits.length > 0) return serverHits
  }

  // (3) keyword scoring with +required / optional partition.
  const allTerms = q.split(/\s+/).filter(t => t.length > 0)
  const required: string[] = []
  const optional: string[] = []
  for (const term of allTerms)
    if (term.startsWith('+') && term.length > 1) required.push(term.slice(1))
    else optional.push(term)

  // scoringTerms: required first (so they also contribute to score), else all terms.
  const scoringTerms = required.length > 0 ? [...required, ...optional] : allTerms
  const patterns = compileTermPatterns(scoringTerms)

  // Pre-filter on required terms: a survivor must satisfy *every* required term
  // (via parts/coarseParts membership or substring, or searchHint/desc whole-word).
  let candidates = deferred
  if (required.length > 0) {
    candidates = (
      await Promise.all(
        deferred.map(async tool => {
          const parsed = parseToolName(tool)
          const desc = (await getToolDescriptionMemoized(tool.name, fullPool)).toLowerCase()
          const hint = tool.searchHint?.toLowerCase() ?? ''
          const ok = required.every(term => {
            const pat = patterns.get(term)!
            return (
              parsed.parts.includes(term) ||
              parsed.parts.some(p => p.includes(term)) ||
              parsed.coarseParts.includes(term) ||
              parsed.coarseParts.some(p => p.includes(term)) ||
              pat.test(desc) ||
              (hint !== '' && pat.test(hint))
            )
          })
          return ok ? tool : null
        }),
      )
    ).filter((t): t is Tool => t !== null)
  }

  // Score survivors. Weights are byte-identical to 2.1.156 (@230344-230353):
  //   term ∈ parts            +10 / +12 (mcp)
  //   term ⊂ some part        +5  / +6
  //   term ∈ coarseParts      +10 / +12
  //   term ⊂ some coarsePart  +3  / +4
  //   full includes term      +3  (only if running score == 0)
  //   searchHint whole-word   +4
  //   description whole-word  +2
  const scored = await Promise.all(
    candidates.map(async tool => {
      const parsed = parseToolName(tool)
      const desc = (await getToolDescriptionMemoized(tool.name, fullPool)).toLowerCase()
      const hint = tool.searchHint?.toLowerCase() ?? ''
      let score = 0
      for (const term of scoringTerms) {
        const pat = patterns.get(term)!
        if (parsed.parts.includes(term)) score += parsed.isMcp ? 12 : 10
        else if (parsed.parts.some(p => p.includes(term))) score += parsed.isMcp ? 6 : 5
        if (parsed.coarseParts.includes(term)) score += parsed.isMcp ? 12 : 10
        else if (parsed.coarseParts.some(p => p.includes(term))) score += parsed.isMcp ? 4 : 3
        if (parsed.full.includes(term) && score === 0) score += 3
        if (hint !== '' && pat.test(hint)) score += 4
        if (pat.test(desc)) score += 2
      }
      return { name: tool.name, score }
    }),
  )

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.name)
}

// =====================================================================
// The ToolSearch tool object (IMt @230417-230637)
// =====================================================================

interface CallOptions {
  options: {
    tools: Tools // t
    refreshTools?: () => Tools // n — rebuild the pool as-of-now
    mcpClients: Array<{ type: string; name: string }> // r
    refreshMcpClients?: () => Array<{ type: string; name: string }> // o
  }
  abortController: AbortController // s
}

// 2.1.183: ToolSearchTool = IMt @cli_inner_pretty.js:230417-230637 (pi = buildTool)
export const ToolSearchTool = buildTool({
  isEnabled() {
    return isToolSearchEnabledOptimistic() // fR
  },
  isConcurrencySafe() {
    return true
  },
  isReadOnly() {
    return true // pure discovery; never mutates
  },
  name: TOOL_SEARCH_TOOL_NAME, // DA
  maxResultSizeChars: 100_000, // 1e5
  async description() {
    return getPrompt() // own
  },
  async prompt() {
    return getPrompt() // own
  },
  get inputSchema() {
    return inputSchema()
  },
  get outputSchema() {
    return outputSchema()
  },

  // call() — multi-phase search with in-tool MCP refresh+wait (@230441-230616).
  async call(input: Input, { options, abortController }: CallOptions) {
    const { tools, refreshTools, mcpClients, refreshMcpClients } = options
    const { query, max_results = 5 } = input

    // Setup (@230442-230445): refresh the pool eagerly — the deferred set can have
    // grown since the agent loop's last tool list (MCP connected, plugin activated).
    const freshTools = refreshTools?.() ?? tools // l
    const deferred = freshTools.filter(isDeferredTool) // c
    maybeInvalidateCache(deferred) // cUi
    const getMcpClients = () => refreshMcpClients?.() ?? mcpClients // u

    // getPendingServerNames (d @230447): MCP clients still connecting → names.
    const getPendingServerNames = (): string[] =>
      getMcpClients()
        .filter(c => c.type === 'pending')
        .map(c => c.name)

    // extractTargetServers (p @230452): which pending servers could satisfy this
    // query? Parse explicit mcp__<server>__ patterns + bare whole-word server names.
    // This is the gating signal for whether waiting is worthwhile.
    const extractTargetServers = (
      queryOrTerms: string | string[],
      knownServerNames: string[],
    ): string[] => {
      const text = Array.isArray(queryOrTerms) ? queryOrTerms.join(' ') : queryOrTerms
      const targets = new Set<string>()
      for (const m of text.matchAll(/mcp__([a-zA-Z0-9._-]+)/g)) {
        const frag = m[1]
        const dd = frag.indexOf('__')
        targets.add(dd >= 0 ? frag.slice(0, dd) : frag)
      }
      const lowered = text.toLowerCase()
      for (const name of knownServerNames)
        if (new RegExp(`\\b${escapeRegExp(name)}\\b`, 'i').test(lowered)) targets.add(name)
      return [...targets]
    }

    // refreshDeferredPool (f @230464): recompute the pool, count newly-appeared
    // tools, re-invalidate the description cache.
    const refreshDeferredPool = () => {
      const fresh = refreshTools?.() ?? freshTools
      const priorNames = new Set(freshTools.map(t => t.name))
      const newCount = fresh.filter(t => !priorNames.has(t.name)).length
      const freshDeferred = fresh.filter(isDeferredTool)
      maybeInvalidateCache(freshDeferred)
      return { freshTools: fresh, freshDeferred, newCount }
    }

    // waitForPendingMcpServers (m @230471): poll <=5s for relevant pending servers.
    // The wait lives in the tool, not the loop, so one invocation absorbs MCP
    // startup latency rather than burning a round-trip per poll. 50ms granularity.
    const waitForPendingMcpServers = async (targetServers: string[]): Promise<number> => {
      const start = Date.now()
      const deadline = start + MCP_WAIT_BUDGET_MS // ZCd = 5000
      while (Date.now() < deadline && !abortController.signal.aborted) {
        const pending = getMcpClients().filter(c => c.type === 'pending')
        if (pending.length === 0) break // all connected — done
        // early-out: no pending server matches our targets → waiting can't help.
        if (
          targetServers.length > 0 &&
          !pending.some(
            c => targetServers.includes(c.name) || targetServers.includes(stripMcpServerPrefix(c.name)),
          )
        )
          break
        await sleep(50, abortController.signal) // Un(50, …)
      }
      return Date.now() - start
    }

    // searchWithMcpRefresh (A @230482): run a searcher against a refreshed pool; if
    // it found nothing AND a target server is still pending, wait then re-search.
    // Returns null (short-circuit) when refreshTools is absent or nothing changed.
    const searchWithMcpRefresh = async (
      searcher: (deferred: Tools, all: Tools) => Promise<string[]>,
      queryType: 'select' | 'keyword',
      queryString: string | string[],
    ): Promise<{ matches: string[]; freshDeferred: Tools; freshTools: Tools } | null> => {
      let refreshed = refreshDeferredPool()
      const pending = getPendingServerNames()
      const pendingBefore = pending.length
      if (!refreshTools || (refreshed.newCount === 0 && pendingBefore === 0)) return null // nothing to do

      let matches =
        refreshed.newCount > 0 ? await searcher(refreshed.freshDeferred, refreshed.freshTools) : []
      let waitedMs = 0
      let refreshOnly = true

      const targets = extractTargetServers(queryString, getMcpClients().map(c => c.name))
      const strippedPending = pending.map(stripMcpServerPrefix)
      const targetIsPending =
        targets.length === 0 ||
        targets.some(t => pending.includes(t) || strippedPending.includes(t))

      if (matches.length === 0 && pendingBefore > 0 && targetIsPending) {
        refreshOnly = false
        waitedMs = await waitForPendingMcpServers(targets)
        refreshed = refreshDeferredPool()
        matches = await searcher(refreshed.freshDeferred, refreshed.freshTools)
      }

      logEvent('tengu_tool_search_mcp_wait', {
        queryType,
        refreshOnly,
        waitedMs,
        pendingBefore,
        pendingAfter: getPendingServerNames().length,
        matchesAfterWait: matches.length,
        targetServerCount: targets.length,
        skippedPollNoTargetPending: pendingBefore > 0 && !targetIsPending && matches.length === 0,
      })
      return { matches, freshDeferred: refreshed.freshDeferred, freshTools: refreshed.freshTools }
    }

    // logFalseUnavailable (g @230512): fires when a query *named* a pending MCP
    // server but found nothing — the canonical "SDK reported a tool unavailable
    // that is actually still connecting" failure the wait machinery prevents.
    const logFalseUnavailable = (
      queryType: 'select' | 'keyword',
      mcpNamesInQuery: string[],
      pendingServers: string[],
    ): void => {
      if (pendingServers.length === 0 || mcpNamesInQuery.length === 0) return
      const queried = new Set(mcpNamesInQuery.map(n => n.split('__')[1]).filter(Boolean))
      const targetedPending = pendingServers.filter(p => queried.has(stripMcpServerPrefix(p))).length
      logEvent('tengu_sdk_mcp_false_unavailable', {
        queryType,
        pendingServers: pendingServers.length,
        targetedPendingServers: targetedPending,
      })
    }

    // logSearchOutcome (h @230518): per-call result + MCP server-state counts.
    const logSearchOutcome = (
      matches: string[],
      queryType: 'select' | 'keyword',
      refreshResult?: { freshDeferred: Tools; freshTools: Tools },
    ): void => {
      const clients = getMcpClients()
      const totalDeferred = (refreshResult?.freshDeferred ?? deferred).length
      const pool = refreshResult?.freshTools ?? freshTools
      logEvent('tengu_tool_search_outcome', {
        queryLength: query.length,
        querySelectCount: queryType === 'select' ? countOccurrences(query, ',') + 1 : undefined,
        queryType,
        matchCount: matches.length,
        totalDeferredTools: totalDeferred,
        maxResults: max_results,
        hasMatches: matches.length > 0,
        mcpServersConfigured: clients.length,
        mcpServersConnected: clients.filter(c => c.type === 'connected').length,
        mcpServersPending: clients.filter(c => c.type === 'pending').length,
        mcpToolsInPool: pool.filter(t => !!(t as Tool).mcpInfo).length,
      })
    }

    // -------------------- dispatch (@230537) --------------------

    // select: exact-name path.
    const selectMatch = query.match(/^select:(.+)$/i) // @230537
    if (selectMatch) {
      const requested = selectMatch[1]
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      const found: string[] = []
      const missing: string[] = []
      for (const name of requested) {
        // resolve against deferred first, then full pool — a name that is already
        // loaded resolves as a harmless no-op rather than "missing".
        const tool = findToolByName(deferred, name) ?? findToolByName(freshTools, name) // @230546
        if (tool) {
          if (!found.includes(tool.name)) found.push(tool.name)
        } else missing.push(name)
      }

      let lastRefresh:
        | { matches: string[]; freshDeferred: Tools; freshTools: Tools }
        | null
        | undefined
      if (missing.length > 0) {
        // try an MCP refresh+wait for the missing names.
        const r = await searchWithMcpRefresh(
          async (def, all) => {
            const resolved: string[] = []
            for (const name of missing) {
              const tool = findToolByName(def, name) ?? findToolByName(all, name)
              if (tool && !resolved.includes(tool.name)) resolved.push(tool.name)
            }
            return resolved
          },
          'select',
          missing,
        )
        if (r) {
          lastRefresh = r
          if (r.matches.length > 0) {
            const merged = [...found, ...r.matches]
            const stillMissing = missing.filter(m => !r.matches.includes(m))
            if (stillMissing.length > 0)
              // @230571 verbatim debug
              logForDebugging(
                `ToolSearchTool: partial select after MCP refresh — found: ${merged.join(', ')}, missing: ${stillMissing.join(', ')}`,
              )
            // @230573 verbatim debug
            else logForDebugging(`ToolSearchTool: selected ${merged.join(', ')} after MCP refresh`)
            logSearchOutcome(merged, 'select', r)
            return buildSearchResult(merged, query, r.freshDeferred.length, [])
          }
        }
      }

      if (found.length === 0) {
        // total miss → expose pending servers so the model knows to retry.
        // @230579 verbatim debug
        logForDebugging(`ToolSearchTool: select failed — none found: ${missing.join(', ')}`)
        logSearchOutcome([], 'select', lastRefresh ?? undefined)
        const pending = getPendingServerNames()
        logFalseUnavailable('select', missing.filter(m => m.startsWith('mcp__')), pending)
        return buildSearchResult([], query, lastRefresh?.freshDeferred.length ?? deferred.length, pending)
      }

      if (missing.length > 0)
        // @230590 verbatim debug
        logForDebugging(`ToolSearchTool: partial select — found: ${found.join(', ')}, missing: ${missing.join(', ')}`)
      // @230591 verbatim debug
      else logForDebugging(`ToolSearchTool: selected ${found.join(', ')}`)
      logSearchOutcome(found, 'select', lastRefresh ?? undefined)
      return buildSearchResult(found, query, lastRefresh?.freshDeferred.length ?? deferred.length, [])
    }

    // keyword path.
    let matches = await searchToolsWithKeywords(query, deferred, freshTools, max_results)
    // @230595 verbatim debug
    logForDebugging(`ToolSearchTool: keyword search for "${query}", found ${matches.length} matches`)

    let refreshResult: { matches: string[]; freshDeferred: Tools; freshTools: Tools } | undefined
    if (matches.length === 0) {
      const r = await searchWithMcpRefresh(
        (def, all) => searchToolsWithKeywords(query, def, all, max_results),
        'keyword',
        query,
      )
      if (r) {
        refreshResult = r
        if (r.matches.length > 0) {
          matches = r.matches
          // @230603 verbatim debug
          logForDebugging(
            `ToolSearchTool: keyword search for "${query}" found ${matches.length} matches after MCP refresh`,
          )
          logSearchOutcome(matches, 'keyword', r)
          return buildSearchResult(matches, query, r.freshDeferred.length, [])
        }
      }
    }

    logSearchOutcome(matches, 'keyword', refreshResult)
    const totalDeferred = refreshResult?.freshDeferred.length ?? deferred.length
    if (matches.length === 0) {
      const pending = getPendingServerNames()
      logFalseUnavailable('keyword', query.match(/mcp__[A-Za-z0-9_-]+/g) ?? [], pending)
      return buildSearchResult(matches, query, totalDeferred, pending)
    }
    return buildSearchResult(matches, query, totalDeferred, [])
  },

  renderToolUseMessage() {
    return null // invisible in the transcript
  },
  userFacingName: () => '',

  // mapToolResultToToolResultBlockParam (@230621): matches → tool_reference blocks;
  // empty-with-pending → the 3-clause retry/capability/don't-stop hint.
  mapToolResultToToolResultBlockParam(data: Output, toolUseID: string): ToolResultBlockParam {
    if (data.matches.length === 0) {
      let content = 'No matching deferred tools found'
      if (data.pending_mcp_servers && data.pending_mcp_servers.length > 0) {
        const servers = data.pending_mcp_servers
        const list =
          servers.length > DEFERRED_DELTA_LIST_CAP // Sae = 30
            ? `${servers.slice(0, DEFERRED_DELTA_LIST_CAP).join(', ')}, …and ${servers.length - DEFERRED_DELTA_LIST_CAP} more`
            : servers.join(', ')
        // @230627 verbatim hint (retry / capability-keywords / don't-stop-after-searching)
        content += `. Some MCP servers are still connecting: ${list}. Their tools will become available shortly — try searching again. If you're looking for a capability rather than a specific tool name, try keywords that might match the server's purpose (e.g., 'slack message', 'calendar event'). Once you find a matching tool, call it directly — do not stop after searching.`
      }
      return { type: 'tool_result', tool_use_id: toolUseID, content }
    }
    // Non-empty: emit tool_reference blocks — the API expands these into callable
    // tool defs (full JSONSchema injected into a <functions> block next turn).
    return {
      type: 'tool_result',
      tool_use_id: toolUseID,
      content: data.matches.map(name => ({ type: 'tool_reference', tool_name: name })), // @230634
    }
  },
})

// helper: countOccurrences Fu @230531 — number of `needle` chars in `haystack`.
function countOccurrences(haystack: string, needle: string): number {
  let n = 0
  for (const ch of haystack) if (ch === needle) n++
  return n
}
