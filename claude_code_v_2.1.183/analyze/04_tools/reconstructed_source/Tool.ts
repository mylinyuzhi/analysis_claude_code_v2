/**
 * Tool.ts — the tool FRAMEWORK type spine + base factory for Claude Code v2.1.183.
 *
 * This is the file every per-tool module imports from: the `Tool`/`ToolDef` shape,
 * `buildTool` factory + `TOOL_DEFAULTS`, the `ValidationResult` /`ToolResult<T>` /
 * `ToolProgress` /`ToolUseContext` types, the `findToolByName`/`toolMatchesName`
 * name-resolution helpers (with a two-tier WeakMap cache), and
 * `getEmptyToolPermissionContext`.
 *
 * 2.1.183 regions covered (PRIMARY bundle cli_inner_pretty.js, 699,346 lines):
 *   - buildTool                    `pi`   @149995-149997
 *   - TOOL_DEFAULTS                `jJu`  @150010, init @150013-150021 (inside thunk Ci)
 *   - getEmptyToolPermissionContext`kO`   @149998-150006
 *   - toolMatchesName              `Rc`   @149965-149967
 *   - findToolByName (cached)      `vl`   @149984-149994
 *   - buildToolNameMap             `UJu`  @149974-149983
 *   - registerBaseToolsProvider    `jAi`  @149968-149970
 *   - getBaseTools accessor        `u_n`  @149971-149973
 *   - filterToolProgressMessages   `STe`  @149962-149964
 *   - caches BAi/FAi               init in thunk `Ci` @150011-150022
 *   - tool-name-alias canon map           @55551-55556 (findToolByName's optional aliasMap)
 *
 * 2.1.88 convention mirror: /lyz/codespace/3rd/claude-code/src/Tool.ts
 *   (ToolDef/Tool/ValidationResult/ToolUseContext/ToolResult/buildTool/TOOL_DEFAULTS/
 *    findToolByName/toolMatchesName/getEmptyToolPermissionContext).
 * 2.1.156 scaffold: claude_code_v_2.1.156/analyze/04_tools/README.md (registration pipeline).
 *
 * Cross-validation note: framework decls are byte-for-byte the 2.1.88 precursor shape
 * (buildTool's Object.defineProperties getter-preservation, TOOL_DEFAULTS fail-closed
 * defaults, the two-tier findToolByName cache) — re-read in THIS bundle @149962-150022.
 * The ONLY 2.1.183 drift from the 2.1.88 mirror is that `getEmptyToolPermissionContext`
 * now emits `mcpPermissionModeOverrides: {}` (confirmed live @150005, consumed @279488,
 * @688645-688649) and `alwaysAskRules: {}`, and `prompt()` now also threads a `model`
 * field (confirmed @423506). `ToolResult<T>`/`ToolProgress` survive only as object-literal
 * yield shapes — their field names are inferred (see // UNVERIFIED-shape markers below).
 */

import type {
  ToolResultBlockParam,
  ToolUseBlockParam,
} from '@anthropic-ai/sdk/resources/index.mjs'
import type {
  ElicitRequestURLParams,
  ElicitResult,
} from '@modelcontextprotocol/sdk/types.js'
import type { UUID } from 'crypto'
import type { z } from 'zod/v4'
import type { Command } from './commands.js'
import type { CanUseToolFn } from './hooks/useCanUseTool.js'
import type { ThinkingConfig } from './utils/thinking.js'
import type { Notification } from './context/notifications.js'
import type {
  MCPServerConnection,
  ServerResource,
} from './services/mcp/types.js'
import type {
  AgentDefinition,
  AgentDefinitionsResult,
} from './tools/AgentTool/loadAgentsDir.js'
import type {
  AssistantMessage,
  AttachmentMessage,
  Message,
  ProgressMessage,
  SystemLocalCommandMessage,
  SystemMessage,
  UserMessage,
} from './types/message.js'
import type {
  AdditionalWorkingDirectory,
  PermissionMode,
  PermissionResult,
  ToolPermissionRulesBySource,
} from './types/permissions.js'
import type { ToolProgressData } from './types/tools.js'
import type { FileStateCache } from './utils/fileStateCache.js'
import type { DenialTrackingState } from './utils/permissions/denialTracking.js'
import type { SystemPrompt } from './utils/systemPromptType.js'
import type { ContentReplacementState } from './utils/toolResultStorage.js'
import type { SpinnerMode } from './components/Spinner.js'
import type { QuerySource } from './constants/querySource.js'
import type { SDKStatus } from './entrypoints/agentSdkTypes.js'
import type { AppState } from './state/AppState.js'
import type {
  HookProgress,
  PromptRequest,
  PromptResponse,
} from './types/hooks.js'
import type { AgentId } from './types/ids.js'
import type { DeepImmutable } from './types/utils.js'
import type { AttributionState } from './utils/commitAttribution.js'
import type { FileHistoryState } from './utils/fileHistory.js'
import type { Theme, ThemeName } from './utils/theme.js'

// Re-export for backwards compatibility (per-tool files import these from Tool.ts).
export type { ToolProgressData }
export type { ToolPermissionRulesBySource }

export type ToolInputJSONSchema = {
  [x: string]: unknown
  type: 'object'
  properties?: { [x: string]: unknown }
}

// =============================================================================
// ValidationResult — return type of every tool's `validateInput`
// =============================================================================
//
// 2.1.183: this literal shape `{ result: !0 }` | `{ result: !1, message, errorCode }`
// is never a named type in the bundle (TS erased) but is ubiquitous and stable.
// Verified converging sites:
//   @370793 `return { result: !0 };`                                   (Glob/Grep success)
//   @370801 `return { result: !1, message: c, errorCode: 1 };`         (Glob/Grep failure)
//   @371127 `return { result: !1, message: \`Path is not a directory: ${e}\`, errorCode: 2 };`
//   @390676/390688/390700 (Read: errorCode 7 / 0 / 6 symlink)
//   @391107 (NotebookEdit, errorCode 12)
//   @391117 `message: "Edit mode must be replace, insert, or delete.", errorCode: 4`
//   @391119 `message: "Cell type is required when using edit_mode=insert.", errorCode: 5`
//   @391145 `message: "Notebook file does not exist.", errorCode: 1`
//
// `result: true` is the no-message success branch. `result: false` carries `message`
// (string shown to the model) + a small integer `errorCode` used for telemetry/branching.
// NOTE: in 2.1.88 src `errorCode` is required on the false branch; the bundle sites
// always supply it, so it is modeled as required here.
export type ValidationResult =
  | { result: true }
  | {
      result: false
      message: string
      errorCode: number
    }

// =============================================================================
// ToolPermissionContext + getEmptyToolPermissionContext (kO)
// =============================================================================

// 2.1.88 convention: src/Tool.ts ToolPermissionContext (DeepImmutable wrapper).
export type ToolPermissionContext = DeepImmutable<{
  mode: PermissionMode
  additionalWorkingDirectories: Map<string, AdditionalWorkingDirectory>
  alwaysAllowRules: ToolPermissionRulesBySource
  alwaysDenyRules: ToolPermissionRulesBySource
  alwaysAskRules: ToolPermissionRulesBySource
  isBypassPermissionsModeAvailable: boolean
  isAutoModeAvailable?: boolean
  strippedDangerousRules?: ToolPermissionRulesBySource
  /** When true, permission prompts are auto-denied (e.g., background agents that can't show UI) */
  shouldAvoidPermissionPrompts?: boolean
  /** When true, automated checks (classifier, hooks) are awaited before showing the permission dialog (coordinator workers) */
  awaitAutomatedChecksBeforeDialog?: boolean
  /** Stores the permission mode before model-initiated plan mode entry, so it can be restored on exit */
  prePlanMode?: PermissionMode
  /**
   * Per-MCP-server permission-mode overrides. 2.1.183 addition vs the 2.1.88
   * mirror — `kO()` now seeds this `{}` (@150005); read @279488
   * (`t.mcpPermissionModeOverrides?.[n]`) and spread-merged @688645-688649.
   */
  mcpPermissionModeOverrides?: Record<string, PermissionMode>
}>

// 2.1.183: getEmptyToolPermissionContext = kO @149998-150006 (arrow var)
//
// A fresh, fully-empty permission context. This object IS the canonical
// `ToolUseContext.permissionContext` / `toolPermissionContext` shape — callers spread
// it then override (e.g. @294564 `{ ...kO(), mode: t }`). Callers verified:
// @294564, @502197, @528436, @529365 (React memo zR(kO())), @542417, @584445, @584471,
// @586517, @598914, @598928, @608913.
//
// 2.1.183 drift vs 2.1.88 mirror: this build also emits `alwaysAskRules: {}` and
// `mcpPermissionModeOverrides: {}` — both confirmed present @150003 / @150005.
export const getEmptyToolPermissionContext: () => ToolPermissionContext =
  () => ({
    mode: 'default',
    additionalWorkingDirectories: new Map(),
    alwaysAllowRules: {},
    alwaysDenyRules: {},
    alwaysAskRules: {}, // @150003
    isBypassPermissionsModeAvailable: false,
    mcpPermissionModeOverrides: {}, // @150005 — 2.1.183 addition
  })

// =============================================================================
// ToolUseContext — the per-tool-call execution context
// =============================================================================
//
// Threaded into checkPermissions / validateInput / call. Shape mirrors the 2.1.88
// src/Tool.ts ToolUseContext (the bundle keeps these field names on the runtime object;
// only a representative subset is load-bearing for the framework contract). The
// `toolPermissionContext`/permission-context field carried by callers is exactly the
// `getEmptyToolPermissionContext()` (kO) shape above (confidence: high).
export type CompactProgressEvent =
  | {
      type: 'hooks_start'
      hookType: 'pre_compact' | 'post_compact' | 'session_start'
    }
  | { type: 'compact_start' }
  | { type: 'compact_end' }

export type QueryChainTracking = {
  chainId: string
  depth: number
}

export type ToolUseContext = {
  options: {
    commands: Command[]
    debug: boolean
    mainLoopModel: string
    tools: Tools
    verbose: boolean
    thinkingConfig: ThinkingConfig
    mcpClients: MCPServerConnection[]
    mcpResources: Record<string, ServerResource[]>
    isNonInteractiveSession: boolean
    agentDefinitions: AgentDefinitionsResult
    maxBudgetUsd?: number
    /** Custom system prompt that replaces the default system prompt */
    customSystemPrompt?: string
    /** Additional system prompt appended after the main system prompt */
    appendSystemPrompt?: string
    /** Override querySource for analytics tracking */
    querySource?: QuerySource
    /** Optional callback to get the latest tools (e.g., after MCP servers connect mid-query) */
    refreshTools?: () => Tools
  }
  abortController: AbortController
  readFileState: FileStateCache
  getAppState(): AppState
  setAppState(f: (prev: AppState) => AppState): void
  /**
   * Always-shared setAppState for session-scoped infrastructure (background
   * tasks, session hooks). Unlike setAppState, which is no-op for async agents,
   * this always reaches the root store so agents at any nesting depth can
   * register/clean up infrastructure that outlives a single turn. Only set by
   * createSubagentContext; main-thread contexts fall back to setAppState.
   */
  setAppStateForTasks?: (f: (prev: AppState) => AppState) => void
  /**
   * Optional handler for URL elicitations triggered by tool call errors (-32042).
   * In print/SDK mode delegates to structuredIO.handleElicitation; in REPL mode
   * undefined (queue-based UI path used instead).
   */
  handleElicitation?: (
    serverName: string,
    params: ElicitRequestURLParams,
    signal: AbortSignal,
  ) => Promise<ElicitResult>
  setToolJSX?: SetToolJSXFn
  addNotification?: (notif: Notification) => void
  appendSystemMessage?: (
    msg: Exclude<SystemMessage, SystemLocalCommandMessage>,
  ) => void
  sendOSNotification?: (opts: {
    message: string
    notificationType: string
  }) => void
  nestedMemoryAttachmentTriggers?: Set<string>
  loadedNestedMemoryPaths?: Set<string>
  dynamicSkillDirTriggers?: Set<string>
  discoveredSkillNames?: Set<string>
  userModified?: boolean
  setInProgressToolUseIDs: (f: (prev: Set<string>) => Set<string>) => void
  setHasInterruptibleToolInProgress?: (v: boolean) => void
  setResponseLength: (f: (prev: number) => number) => void
  pushApiMetricsEntry?: (ttftMs: number) => void
  setStreamMode?: (mode: SpinnerMode) => void
  onCompactProgress?: (event: CompactProgressEvent) => void
  setSDKStatus?: (status: SDKStatus) => void
  openMessageSelector?: () => void
  updateFileHistoryState: (
    updater: (prev: FileHistoryState) => FileHistoryState,
  ) => void
  updateAttributionState: (
    updater: (prev: AttributionState) => AttributionState,
  ) => void
  setConversationId?: (id: UUID) => void
  agentId?: AgentId
  agentType?: string
  requireCanUseTool?: boolean
  messages: Message[]
  fileReadingLimits?: {
    maxTokens?: number
    maxSizeBytes?: number
  }
  globLimits?: {
    maxResults?: number
  }
  toolDecisions?: Map<
    string,
    {
      source: string
      decision: 'accept' | 'reject'
      timestamp: number
    }
  >
  queryTracking?: QueryChainTracking
  requestPrompt?: (
    sourceName: string,
    toolInputSummary?: string | null,
  ) => (request: PromptRequest) => Promise<PromptResponse>
  toolUseId?: string
  criticalSystemReminder_EXPERIMENTAL?: string
  preserveToolUseResults?: boolean
  localDenialTracking?: DenialTrackingState
  contentReplacementState?: ContentReplacementState
  renderedSystemPrompt?: SystemPrompt
}

export type SetToolJSXFn = (
  args: {
    jsx: React.ReactNode | null
    shouldHidePromptInput: boolean
    shouldContinueAnimation?: true
    showSpinner?: boolean
    isLocalJSXCommand?: boolean
    isImmediate?: boolean
    clearLocalJSX?: boolean
  } | null,
) => void

// =============================================================================
// ToolProgress / ToolResult<T> — call()'s async-generator yield items
// =============================================================================
//
// 2.1.183: these survive only as object-literal yield shapes — no named type in the
// bundle (TS erased). Two yield kinds: `{ type: "result", data }` and `{ type:
// "progress", ... }`. The progress-filter helper `filterToolProgressMessages` (STe)
// @149962-149964 confirms progress items carry `.data.type` (it drops `hook_progress`).
// Field names below are taken from the 2.1.88 mirror and the yield-site shapes.

export type Progress = ToolProgressData | HookProgress

// UNVERIFIED-shape: { toolUseID, data } field names inferred from 2.1.88 mirror;
// the bundle's STe (@149962) only proves the `.data.type` access path.
export type ToolProgress<P extends ToolProgressData = ToolProgressData> = {
  toolUseID: string
  data: P
}

export type ToolCallProgress<P extends ToolProgressData = ToolProgressData> = (
  progress: ToolProgress<P>,
) => void

// 2.1.183: filterToolProgressMessages = STe @149962-149964
//
// ORIGINAL: function STe(e){ return e.filter((t)=> t.data?.type !== "hook_progress"); }
//
// Strips hook-emitted progress messages, leaving only genuine tool progress. The
// `t.data?.type !== "hook_progress"` literal is verbatim from the bundle (@149963).
// Mapping: STe→filterToolProgressMessages, e→progressMessagesForMessage
export function filterToolProgressMessages(
  progressMessagesForMessage: ProgressMessage[],
): ProgressMessage<ToolProgressData>[] {
  return progressMessagesForMessage.filter(
    (msg): msg is ProgressMessage<ToolProgressData> =>
      msg.data?.type !== 'hook_progress', // @149963
  )
}

// UNVERIFIED-shape: { data, newMessages?, contextModifier?, mcpMeta? } field names
// inferred from the 2.1.88 mirror; in the bundle this is the `{ type: "result", data }`
// payload's `data` plus the optional message/context riders consumed by query.ts.
export type ToolResult<T> = {
  data: T
  newMessages?: (
    | UserMessage
    | AssistantMessage
    | AttachmentMessage
    | SystemMessage
  )[]
  /** contextModifier is only honored for tools that aren't concurrency safe. */
  contextModifier?: (context: ToolUseContext) => ToolUseContext
  /** MCP protocol metadata (structuredContent, _meta) passed through to SDK consumers. */
  mcpMeta?: {
    _meta?: Record<string, unknown>
    structuredContent?: Record<string, unknown>
  }
}

/** Any Zod schema that outputs an object with string keys. */
export type AnyObject = z.ZodType<{ [key: string]: unknown }>

// =============================================================================
// Name resolution — toolMatchesName (Rc) + findToolByName (vl) + buildToolNameMap (UJu)
// =============================================================================

// 2.1.183: toolMatchesName = Rc @149965-149967
//
// ORIGINAL: function Rc(e,t){ return e.name === t || (e.aliases?.includes(t) ?? !1); }
//
// True when `name` is the tool's primary name OR appears in its `aliases` array.
// Mapping: Rc→toolMatchesName, e→tool, t→name
export function toolMatchesName(
  tool: { name: string; aliases?: string[] },
  name: string,
): boolean {
  return tool.name === name || (tool.aliases?.includes(name) ?? false)
}

// 2.1.183: buildToolNameMap = UJu @149974-149983 — name+alias → tool Map (first wins)
//
// Builds a Map keyed by both each tool's primary `name` AND every entry of its
// `aliases`, first occurrence winning on collision. Backs findToolByName's cached path.
// Mapping: UJu→buildToolNameMap, e→tools
function buildToolNameMap(tools: Tools): Map<string, Tool> {
  const map = new Map<string, Tool>()
  for (const tool of tools) {
    if (!map.has(tool.name)) map.set(tool.name, tool)
    if (tool.aliases) {
      for (const alias of tool.aliases) {
        if (!map.has(alias)) map.set(alias, tool)
      }
    }
  }
  return map
}

// WeakMap/WeakSet caches for findToolByName, keyed by the *array instance*.
// 2.1.183: BAi (nameMapCache) + FAi (seenArrays), both `new` inside thunk Ci @150011.
const nameMapCache = new WeakMap<Tools, Map<string, Tool>>() // BAi
const seenArrays = new WeakSet<Tools>() // FAi

// 2.1.183: findToolByName = vl @149984-149994
//
// ORIGINAL:
// function vl(e,t,n){
//   let r = n && Object.hasOwn(n,t) ? n[t] : void 0;
//   if (r !== void 0 && r !== t) return vl(e, r);
//   let o = BAi.get(e); if (o) return o.get(t);
//   if (FAi.has(e)) { let s = UJu(e); return (BAi.set(e,s), s.get(t)); }
//   return (FAi.add(e), e.find((s) => Rc(s, t)));
// }
//
// Two-tier caching keyed by the array instance:
//   1. Optional `aliasMap` canonicalization (e.g. {KillBash:"TaskStop", AgentOutput:"TaskOutput", …}
//      @55551-55556) — resolve a deprecated name to its current name, then recurse.
//   2. Fast path: a name→tool Map already materialized for THIS array → Map.get.
//   3. Second sighting of this array → build the Map, cache it, then Map.get.
//   4. First sighting → linear `find` (avoid Map cost for one-shot lookups).
//
// Design: a one-off lookup pays only a linear scan; the *second* lookup of the same
// array amortizes a Map build. The cache must key on identity (WeakMap) so a freshly
// assembled tool array gets a fresh Map.
// Mapping: vl→findToolByName, e→tools, t→name, n→aliasMap, UJu→buildToolNameMap,
//          BAi→nameMapCache, FAi→seenArrays, Rc→toolMatchesName
export function findToolByName(
  tools: Tools,
  name: string,
  aliasMap?: Record<string, string>,
): Tool | undefined {
  // 1. canonicalize via optional alias map
  const canonical =
    aliasMap && Object.hasOwn(aliasMap, name) ? aliasMap[name] : undefined
  if (canonical !== undefined && canonical !== name) {
    return findToolByName(tools, canonical)
  }
  // 2. fast path: Map already cached for this array instance
  const cached = nameMapCache.get(tools)
  if (cached) return cached.get(name)
  // 3. second sighting → build + cache the Map
  if (seenArrays.has(tools)) {
    const map = buildToolNameMap(tools)
    nameMapCache.set(tools, map)
    return map.get(name)
  }
  // 4. first sighting → linear find
  seenArrays.add(tools)
  return tools.find(t => toolMatchesName(t, name))
}

// =============================================================================
// Base-tools provider slot — registerBaseToolsProvider (jAi) + getBaseTools (u_n)
// =============================================================================
//
// The registry (tools.ts) publishes `getAllBaseTools` here via `jAi(LW)` (@436714) so
// other subsystems read the canonical built-in list without importing the registry,
// breaking an import cycle. `u_n()` returns the registered provider's result (or
// undefined if never registered).

let baseToolsProvider: (() => Tools) | undefined // UAi @150007

// 2.1.183: registerBaseToolsProvider = jAi @149968-149970
// Mapping: jAi→registerBaseToolsProvider, UAi→baseToolsProvider
export function registerBaseToolsProvider(provider: () => Tools): void {
  baseToolsProvider = provider
}

// 2.1.183: getBaseTools = u_n @149971-149973
// Mapping: u_n→getBaseTools, UAi→baseToolsProvider
export function getBaseTools(): Tools | undefined {
  return baseToolsProvider?.()
}

// =============================================================================
// Tool / ToolDef shape
// =============================================================================
//
// 2.1.88 convention: src/Tool.ts `Tool<Input,Output,P>`. The full interface is large;
// the framework contract (the parts buildTool / the registry / query.ts depend on) is
// reproduced here. The bundle keeps these method names on each built tool object.

export type Tool<
  Input extends AnyObject = AnyObject,
  Output = unknown,
  P extends ToolProgressData = ToolProgressData,
> = {
  /** Backwards-compat aliases; the tool resolves by any of these (see findToolByName). */
  aliases?: string[]
  /** One-line capability phrase for ToolSearch keyword matching (3–10 words, no period). */
  searchHint?: string
  call(
    args: z.infer<Input>,
    context: ToolUseContext,
    canUseTool: CanUseToolFn,
    parentMessage: AssistantMessage,
    onProgress?: ToolCallProgress<P>,
  ): Promise<ToolResult<Output>>
  description(
    input: z.infer<Input>,
    options: {
      isNonInteractiveSession: boolean
      toolPermissionContext: ToolPermissionContext
      tools: Tools
    },
  ): Promise<string>
  readonly inputSchema: Input
  readonly inputJSONSchema?: ToolInputJSONSchema
  outputSchema?: z.ZodType<unknown>
  inputsEquivalent?(a: z.infer<Input>, b: z.infer<Input>): boolean
  isConcurrencySafe(input: z.infer<Input>): boolean
  isEnabled(): boolean
  isReadOnly(input: z.infer<Input>): boolean
  /** Defaults to false. Only set for irreversible operations (delete, overwrite, send). */
  isDestructive?(input: z.infer<Input>): boolean
  /** 'cancel' = stop + discard on new user message; 'block' (default) = keep running. */
  interruptBehavior?(): 'cancel' | 'block'
  isSearchOrReadCommand?(input: z.infer<Input>): {
    isSearch: boolean
    isRead: boolean
    isList?: boolean
  }
  isOpenWorld?(input: z.infer<Input>): boolean
  requiresUserInteraction?(): boolean
  isMcp?: boolean
  isLsp?: boolean
  /** Deferred (defer_loading:true) — requires a ToolSearch round-trip before use. */
  readonly shouldDefer?: boolean
  /** Never deferred — full schema in the initial prompt even under ToolSearch. */
  readonly alwaysLoad?: boolean
  /** MCP tools: server + tool names as received from the server (unnormalized). */
  mcpInfo?: { serverName: string; toolName: string }
  readonly name: string
  /** Max chars before the tool result is persisted to disk (Infinity = never). */
  maxResultSizeChars: number
  /** Stricter API tool-schema adherence; only honored when tengu_tool_pear is on. */
  readonly strict?: boolean
  /** Idempotent in-place backfill of observable input copies (legacy/derived fields). */
  backfillObservableInput?(input: Record<string, unknown>): void

  /**
   * Returns a ValidationResult: informs the model why a tool use failed before
   * permission checks. Tool-specific; runs before checkPermissions. No UI.
   */
  validateInput?(
    input: z.infer<Input>,
    context: ToolUseContext,
  ): Promise<ValidationResult>

  /**
   * Tool-specific permission decision (allow/ask/deny). Only called after
   * validateInput() passes. General logic lives in permissions.ts.
   */
  checkPermissions(
    input: z.infer<Input>,
    context: ToolUseContext,
  ): Promise<PermissionResult>

  getPath?(input: z.infer<Input>): string
  preparePermissionMatcher?(
    input: z.infer<Input>,
  ): Promise<(pattern: string) => boolean>

  /**
   * Per-tool prompt copy injected into the system prompt. 2.1.183 also threads
   * `model` (confirmed @423506: `prompt({ agents, getToolPermissionContext,
   * allowedAgentTypes, model })`) — used e.g. by AskUserQuestion's lean-model
   * reservation paragraph.
   */
  prompt(options: {
    getToolPermissionContext: () => Promise<ToolPermissionContext>
    tools: Tools
    agents: AgentDefinition[]
    allowedAgentTypes?: string[]
    model?: string // @423506 — 2.1.183 addition
  }): Promise<string>

  userFacingName(input: Partial<z.infer<Input>> | undefined): string
  userFacingNameBackgroundColor?(
    input: Partial<z.infer<Input>> | undefined,
  ): keyof Theme | undefined
  isTransparentWrapper?(): boolean
  getToolUseSummary?(input: Partial<z.infer<Input>> | undefined): string | null
  getActivityDescription?(
    input: Partial<z.infer<Input>> | undefined,
  ): string | null

  /** Compact representation for the auto-mode security classifier ('' = skip tool). */
  toAutoClassifierInput(input: z.infer<Input>): unknown
  mapToolResultToToolResultBlockParam(
    content: Output,
    toolUseID: string,
  ): ToolResultBlockParam

  // ---- UI rendering (React) — optional per tool ----------------------------
  renderToolResultMessage?(
    content: Output,
    progressMessagesForMessage: ProgressMessage<P>[],
    options: {
      style?: 'condensed'
      theme: ThemeName
      tools: Tools
      verbose: boolean
      isTranscriptMode?: boolean
      isBriefOnly?: boolean
      input?: unknown
    },
  ): React.ReactNode
  extractSearchText?(out: Output): string
  renderToolUseMessage(
    input: Partial<z.infer<Input>>,
    options: { theme: ThemeName; verbose: boolean; commands?: Command[] },
  ): React.ReactNode
  isResultTruncated?(output: Output): boolean
  renderToolUseTag?(input: Partial<z.infer<Input>>): React.ReactNode
  renderToolUseProgressMessage?(
    progressMessagesForMessage: ProgressMessage<P>[],
    options: {
      tools: Tools
      verbose: boolean
      terminalSize?: { columns: number; rows: number }
      inProgressToolCallCount?: number
      isTranscriptMode?: boolean
    },
  ): React.ReactNode
  renderToolUseQueuedMessage?(): React.ReactNode
  renderToolUseRejectedMessage?(
    input: z.infer<Input>,
    options: {
      columns: number
      messages: Message[]
      style?: 'condensed'
      theme: ThemeName
      tools: Tools
      verbose: boolean
      progressMessagesForMessage: ProgressMessage<P>[]
      isTranscriptMode?: boolean
    },
  ): React.ReactNode
  renderToolUseErrorMessage?(
    result: ToolResultBlockParam['content'],
    options: {
      progressMessagesForMessage: ProgressMessage<P>[]
      tools: Tools
      verbose: boolean
      isTranscriptMode?: boolean
    },
  ): React.ReactNode
  renderGroupedToolUse?(
    toolUses: Array<{
      param: ToolUseBlockParam
      isResolved: boolean
      isError: boolean
      isInProgress: boolean
      progressMessages: ProgressMessage<P>[]
      result?: {
        param: ToolResultBlockParam
        output: unknown
      }
    }>,
    options: {
      shouldAnimate: boolean
      tools: Tools
    },
  ): React.ReactNode | null
}

/**
 * A collection of tools. Use this instead of `Tool[]` so tool-set assembly,
 * passing, and filtering are easy to track across the codebase.
 */
export type Tools = readonly Tool[]

// =============================================================================
// buildTool factory (pi) + TOOL_DEFAULTS (jJu)
// =============================================================================

/** Methods that `buildTool` supplies a default for — a `ToolDef` may omit them. */
type DefaultableToolKeys =
  | 'isEnabled'
  | 'isConcurrencySafe'
  | 'isReadOnly'
  | 'isDestructive'
  | 'checkPermissions'
  | 'toAutoClassifierInput'
  | 'userFacingName'

/**
 * Tool definition accepted by `buildTool`. Same shape as `Tool` but with the
 * defaultable methods optional — buildTool fills them in so callers always see
 * a complete `Tool`.
 */
export type ToolDef<
  Input extends AnyObject = AnyObject,
  Output = unknown,
  P extends ToolProgressData = ToolProgressData,
> = Omit<Tool<Input, Output, P>, DefaultableToolKeys> &
  Partial<Pick<Tool<Input, Output, P>, DefaultableToolKeys>>

// 2.1.183: TOOL_DEFAULTS = jJu @150010, init @150013-150021 (inside thunk Ci)
//
// ORIGINAL (init @150013-150021):
// jJu = {
//   isEnabled: () => !0,
//   isConcurrencySafe: (e) => !1,
//   isReadOnly: (e) => !1,
//   isDestructive: (e) => !1,
//   checkPermissions: (e, t) => Promise.resolve({ behavior: "allow", updatedInput: e }),
//   toAutoClassifierInput: (e) => "",
//   userFacingName: (e) => "",
// };
//
// Fail-closed-where-it-matters defaults merged into every tool by buildTool:
//   - isEnabled → true            (overridden per-tool, e.g. Workflow's runtime gate)
//   - isConcurrencySafe → false   (assume NOT parallel-safe)
//   - isReadOnly → false          (assume writes)
//   - isDestructive → false
//   - checkPermissions → allow    (defer to the general permission system)
//   - toAutoClassifierInput → ''  (skip classifier — security-relevant tools MUST override)
//   - userFacingName → ''         (buildTool re-seeds this from def.name; see below)
//
// Init lives in the lazy thunk `Ci` (@150011-150022), which ALSO news the
// findToolByName caches: `BAi = new WeakMap()`, `FAi = new WeakSet()`.
// Mapping: jJu→TOOL_DEFAULTS, e→input, t→ctx
const TOOL_DEFAULTS = {
  isEnabled: () => true,
  isConcurrencySafe: (_input?: unknown) => false,
  isReadOnly: (_input?: unknown) => false,
  isDestructive: (_input?: unknown) => false,
  checkPermissions: (
    input: { [key: string]: unknown },
    _ctx?: ToolUseContext,
  ): Promise<PermissionResult> =>
    Promise.resolve({ behavior: 'allow', updatedInput: input }),
  toAutoClassifierInput: (_input?: unknown) => '',
  userFacingName: (_input?: unknown) => '',
}

type ToolDefaults = typeof TOOL_DEFAULTS

/**
 * Type-level spread mirroring runtime `{ ...TOOL_DEFAULTS, ...def }`. For each
 * defaultable key: if D provides it (required), D's type wins; if D omits it or
 * has it optional, the default fills in. All other keys come from D verbatim.
 */
type BuiltTool<D> = Omit<D, DefaultableToolKeys> & {
  [K in DefaultableToolKeys]-?: K extends keyof D
    ? undefined extends D[K]
      ? ToolDefaults[K]
      : D[K]
    : ToolDefaults[K]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyToolDef = ToolDef<any, any, any>

// 2.1.183: buildTool = pi @149995-149997
//
// ORIGINAL:
// function pi(e){
//   return Object.defineProperties(
//     { ...jJu, userFacingName: () => e.name },
//     Object.getOwnPropertyDescriptors(e),
//   );
// }
//
// Build a complete `Tool` from a partial `ToolDef`:
//   1. Start from a fresh `{ ...TOOL_DEFAULTS }` and seed `userFacingName: () => def.name`.
//   2. Copy EVERY own property *descriptor* of `def` on top via Object.defineProperties.
//
// Why defineProperties (not a `{ ...def }` spread): it preserves a `get inputSchema()`
// AS a getter, so a tool's Zod schema builds lazily on first access — NOT eagerly at
// factory time. This is load-bearing: the bundle uses `pi({ get inputSchema(){…} })`
// for ~49 tools so schema construction is deferred until the tool is actually serialized.
// Because TOOL_DEFAULTS' own `userFacingName` is overwritten by def's descriptor when
// present (and otherwise falls back to the `() => def.name` seed), the effective default
// userFacingName is the tool's own name.
//
// The 2.1.88 mirror writes this as a runtime spread `{ ...TOOL_DEFAULTS, userFacingName:
// () => def.name, ...def }`; the 2.1.183 bundle uses the descriptor form to preserve
// getters. Both are modeled by BuiltTool<D> at the type level.
// Mapping: pi→buildTool, e→def, jJu→TOOL_DEFAULTS
export function buildTool<D extends AnyToolDef>(def: D): BuiltTool<D> {
  return Object.defineProperties(
    { ...TOOL_DEFAULTS, userFacingName: () => def.name },
    Object.getOwnPropertyDescriptors(def),
  ) as BuiltTool<D>
}
