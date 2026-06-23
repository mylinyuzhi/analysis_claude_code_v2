/**
 * Tool WIRE-SCHEMA serialization for the Anthropic Messages API.
 *
 * `buildToolSchema(tool, opts)` converts one in-process `Tool` into the
 * `{ name, description, input_schema, (strict?), (eager_input_streaming?),
 *    (defer_loading?), (cache_control?) }` object that goes on the wire as a
 * `tools[]` entry. Reconstructed at READABLE-SOURCE level for v2.1.183.
 *
 * The serialization machine is structurally identical to v2.1.156 (`w08`);
 * only the obfuscated ids and the per-model caps table grew. The 2.1.183-new
 * bits in this path are (a) the agent-team property-stripping table
 * (`stripAgentTeamProps`/`AGENT_TEAM_STRIP_TABLE`, gated by `agentTeamsEnabled`),
 * and (b) new caps records for `claude-opus-4-8` / `claude-fable-5` /
 * `claude-mythos-5` carrying `eagerInputStreaming`.
 *
 * 2.1.183 regions covered (cli_inner_pretty.js):
 *   - buildToolSchema ............. CWn   @581300-581356
 *   - resolveToolDescription ...... z_f   @581287-581299
 *   - getModelCaps ................ G_f   @581273-581275
 *   - MODEL_CAPS table ............ Ed    @95158-95173 (records @95039-95156)
 *   - getAPIProvider .............. Ir    @95194-95206
 *   - isFirstPartyAnthropicBaseUrl  Pu    @95241-95254
 *   - isLeanSystemPrompt .......... Dg    @134268-134273
 *   - getToolSchemaCache / clear .. Dti/dme @134775-134780 (Map Lti @134783)
 *   - hashInputJSONSchema ......... Y_f   @581361-581365 (WeakMap XOl @581684)
 *   - modelSupportsStructuredOutputs GNe  @134521-134527
 *   - experimentalBetasDisabled ... jNe   @134594-134596
 *   - warnBetasStrippedOnce ....... K_f   @581357-581360 (flag YOl)
 *   - stripAgentTeamProps ......... V_f/q_f @581276-581286
 *   - AGENT_TEAM_STRIP_TABLE ...... W_f   @581683
 *   - agentTeamsEnabled ........... Sl    @293831-293835
 *   - parseBoolTrue / parseBoolFalse st/yl @163-174
 *   - zodToJsonSchema (memoized) .. DLe   @462188-462193
 *   - askUserQuestionTool ......... sut   @391450-… ; strings @221315-221354
 *
 * 2.1.88 convention mirror: src/Tool.ts (ToolDef/Tool shape, `prompt(opts)`,
 *   `inputSchema`/`inputJSONSchema`, `strict`, `searchHint`). There is no named
 *   `buildToolSchema` in the 2.1.88 public tree — it lives in the messages-API
 *   serialization layer; this file mirrors the *Tool* shape it reads from.
 * 2.1.156 scaffold: 04_tools/read_partial_view_and_streaming_exec.md (Part 2,
 *   `w08`→buildToolSchema; jLz→getModelCaps; X3→isLeanSystemPrompt; "L:"/"F:" tags).
 *
 * Cross-validation note: re-read 581300-581365 (CWn/z_f/G_f/Y_f/K_f) verbatim in
 * the 2.1.183 bundle; spot-checked the four-way gate + ENV kill (581321-581329),
 * the cache-key tags (581303-581309), every helper (Dg/Dti/GNe/jNe/Ir/Pu/st/yl),
 * the MODEL_CAPS table (95158-95173) incl. opus47/opus48 = {bedrock,vertex}, and
 * the AskUserQuestion strings (221315-221360) — all match this reconstruction.
 */

import type { z } from 'zod/v4'

// ---------------------------------------------------------------------------
// External helpers referenced by this module (defined elsewhere in the tree).
// ---------------------------------------------------------------------------

// helper: ct @ (feature-gate read) — getFeatureGate(name, default)
declare function getFeatureGate<T>(name: string, defaultValue: T): T
// helper: G @ — telemetry event emit
declare function logEvent(name: string, props: Record<string, unknown>): void
// helper: v @ — warning logger
declare function logWarn(msg: string): void
// helper: Bo @102895 — normalizeModelId: strips trailing -YYYYMMDD date suffix etc.
declare function normalizeModelId(model: string): string
// helper: q6 @ — raw zod→JSON-schema conversion (the un-memoized core behind DLe)
declare function zodToJsonSchemaRaw(schema: z.ZodTypeAny): ToolInputJSONSchema
// helper: _y @ / lO @ — provider capability lookup + first-party-capable predicate
declare function getModelProvider(model: string): unknown
declare function providerHasFirstPartyCapabilities(p: unknown): boolean
// helper: t1e @ — compliance-mode predicate (e.g. "hipaa")
declare function complianceModeEnabled(mode: string): boolean
// helper: Di @10152 — substringBefore(text, sep): text up to (excluding) first sep, else text
declare function substringBefore(text: string, sep: string): string

type ToolInputJSONSchema = {
  [x: string]: unknown
  type: 'object'
  properties?: { [x: string]: unknown }
}

/** Minimal view of an in-process Tool that the serializer reads. (Full shape: 2.1.88 src/Tool.ts.) */
interface SerializableTool {
  readonly name: string
  readonly inputSchema: z.ZodTypeAny
  /** MCP tools that carry a raw JSON Schema instead of a Zod schema. */
  readonly inputJSONSchema?: ToolInputJSONSchema
  readonly strict?: boolean
  readonly searchHint?: string
  prompt(opts: BuildToolSchemaOptions): Promise<string>
}

/** Options bag passed alongside the tool. Carries the model + per-request flags. */
interface BuildToolSchemaOptions {
  model?: string
  deferLoading?: boolean
  cacheControl?: unknown
  // (other prompt-context fields elided — tools read them in their own prompt())
}

/** The wire object emitted into the Messages API `tools[]` array. */
interface ToolWireSchema {
  name: string
  description: string
  input_schema: ToolInputJSONSchema
  strict?: true
  eager_input_streaming?: true
  defer_loading?: true
  cache_control?: unknown
}

// ===========================================================================
// 1. Env-var boolean parsers (the gate's ON/OFF tri-state)
// ===========================================================================

// 2.1.183: parseBoolTrue = st @163-168
// Truthy for "1" | "true" | "yes" | "on" (case/space-insensitive) or boolean true.
export function parseBoolTrue(value: unknown): boolean {
  if (!value) return false
  if (typeof value === 'boolean') return value
  const t = String(value).toLowerCase().trim()
  return ['1', 'true', 'yes', 'on'].includes(t) // @167
}

// 2.1.183: parseBoolFalse = yl @169-174
// Truthy (i.e. "explicitly OFF") for "0" | "false" | "no" | "off" or boolean false.
// Crucially returns FALSE for `undefined` — an UNSET env var is NOT "explicitly off".
export function parseBoolFalse(value: unknown): boolean {
  if (value === undefined) return false
  if (typeof value === 'boolean') return !value
  const t = String(value).toLowerCase().trim()
  return ['0', 'false', 'no', 'off'].includes(t) // @173
}

// ===========================================================================
// 2. Provider + first-party base-URL detection
// ===========================================================================

type ApiProvider =
  | 'firstParty'
  | 'vertex'
  | 'bedrock'
  | 'foundry'
  | 'anthropicAws'
  | 'mantle'

// 2.1.183: getAPIProvider = Ir @95194-95206
// First env flag wins; default firstParty. Drives every branch of the eager-streaming gate.
export function getAPIProvider(): ApiProvider {
  if (parseBoolTrue(process.env.CLAUDE_CODE_USE_BEDROCK)) return 'bedrock'
  if (parseBoolTrue(process.env.CLAUDE_CODE_USE_FOUNDRY)) return 'foundry'
  if (parseBoolTrue(process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS)) return 'anthropicAws'
  if (parseBoolTrue(process.env.CLAUDE_CODE_USE_MANTLE)) return 'mantle'
  if (parseBoolTrue(process.env.CLAUDE_CODE_USE_VERTEX)) return 'vertex'
  return 'firstParty'
}

// 2.1.183: firstPartyBaseUrlIsAnthropic (host check) = V7e @95250-95257
function firstPartyBaseUrlIsAnthropic(baseUrl: string): boolean {
  try {
    const host = new URL(baseUrl).host
    return ['api.anthropic.com'].includes(host) // @95253
  } catch {
    return false
  }
}

// 2.1.183: isFirstPartyAnthropicBaseUrl = Pu @95241-95244 (via Qln @95245-95249 → V7e @95250-95257)
// True if the assume-flag is set, OR ANTHROPIC_BASE_URL is unset, OR it points at
// api.anthropic.com. Required by gate branch (1) so we don't enable eager streaming
// against a third-party proxy that happens to look first-party.
export function isFirstPartyAnthropicBaseUrl(): boolean {
  if (process.env._CLAUDE_CODE_ASSUME_FIRST_PARTY_BASE_URL) return true // @95242
  const baseUrl = process.env.ANTHROPIC_BASE_URL
  if (!baseUrl) return true // @95247: unset → assumed first-party
  return firstPartyBaseUrlIsAnthropic(baseUrl)
}

// ===========================================================================
// 3. Per-model capability records (the `eagerInputStreaming` caps)
// ===========================================================================
//
// MODEL_CAPS (Ed @95158-95173) is keyed by short model alias; each record carries
// the provider-specific id strings plus an optional `eagerInputStreaming` map
// declaring which managed providers (vertex/bedrock) may auto-enable eager input
// streaming for that model. Only the records relevant to this gate are shown.

interface ModelCaps {
  firstParty: string
  bedrock: string
  vertex: string
  foundry: string
  anthropicAws: string
  mantle: string
  gateway: string
  /** Which managed providers may auto-enable eager_input_streaming for this model. */
  eagerInputStreaming?: { vertex?: boolean; bedrock?: boolean }
}

// 2.1.183: MODEL_CAPS = Ed @95158-95173 (individual records @95039-95156)
// `eagerInputStreaming` presence/value verbatim from the bundle:
export const MODEL_CAPS: Record<string, ModelCaps> = {
  // haiku35 = Jvr @95039: vertex only
  haiku35: caps('claude-3-5-haiku-20241022', { vertex: true }),
  // haiku45 = Qvr: NO eager streaming
  haiku45: caps('claude-haiku-4-5'),
  // sonnet35 = Xvr / sonnet37 = Yvr: NO eager streaming
  sonnet35: caps('claude-3-5-sonnet'),
  sonnet37: caps('claude-3-7-sonnet'),
  // sonnet40 = Zvr @95058: vertex only
  sonnet40: caps('claude-sonnet-4-20250514', { vertex: true }),
  // sonnet45 = eTr @95068: vertex only
  sonnet45: caps('claude-sonnet-4-5-20250929', { vertex: true }),
  // sonnet46 = tTr @95078: vertex + bedrock
  sonnet46: caps('claude-sonnet-4-6', { vertex: true, bedrock: true }),
  // opus40 = nTr / opus41 = rTr: NO eager streaming
  opus40: caps('claude-opus-4-0'),
  opus41: caps('claude-opus-4-1'),
  // opus45 = oTr @95106 / opus46 = sTr @95116: vertex only
  opus45: caps('claude-opus-4-5-20251101', { vertex: true }),
  opus46: caps('claude-opus-4-6', { vertex: true }),
  // opus47 = iTr @95118-95127: vertex + bedrock  (2.1.183-new model)
  opus47: caps('claude-opus-4-7', { vertex: true, bedrock: true }),
  // opus48 = aTr @95128-95137: vertex + bedrock  (2.1.183-new model, the default Opus)
  opus48: caps('claude-opus-4-8', { vertex: true, bedrock: true }),
  // fable5 = MHe @95146: vertex + bedrock  (2.1.183-new model)
  fable5: caps('claude-fable-5', { vertex: true, bedrock: true }),
  // NOTE: mythos5 = aMs @95148 ALSO carries eagerInputStreaming {vertex,bedrock} but is
  // NOT listed in the Ed index object @95158-95173, so getModelCaps() cannot reach it via
  // the firstParty-id map. // UNVERIFIED: whether mythos5 is reachable through another caps path.
}

/** Tiny constructor — only the fields this serializer reads are filled; the rest are
 *  the canonical provider-id strings in the bundle and are elided for readability. */
function caps(
  firstParty: string,
  eagerInputStreaming?: { vertex?: boolean; bedrock?: boolean },
): ModelCaps {
  return {
    firstParty,
    bedrock: firstParty,
    vertex: firstParty,
    foundry: firstParty,
    anthropicAws: firstParty,
    mantle: firstParty,
    gateway: firstParty,
    ...(eagerInputStreaming ? { eagerInputStreaming } : {}),
  }
}

// 2.1.183: getModelCaps = G_f @581273-581275 (scaffold jLz)
// Lazily builds a Map<normalizedFirstPartyId, ModelCaps> over MODEL_CAPS and looks up
// the (normalized) requested model. Returns undefined for unknown models → the
// `caps?.eagerInputStreaming?.…` reads downstream are then undefined → vertex/bedrock
// auto-branches are skipped (eager streaming off unless env-forced).
let modelCapsByFirstParty: Map<string, ModelCaps> | undefined
export function getModelCaps(model: string): ModelCaps | undefined {
  modelCapsByFirstParty ??= new Map(
    Object.values(MODEL_CAPS).map(rec => [normalizeModelId(rec.firstParty), rec]),
  )
  return modelCapsByFirstParty.get(normalizeModelId(model))
}

// ===========================================================================
// 4. Tool-schema cache (session-stable) + raw-schema hashing
// ===========================================================================

// 2.1.183: getToolSchemaCache = Dti @134775-134777 ; clearToolSchemaCache = dme @134778-134780
// `toolSchemaCache` (Lti @134783) is a module-singleton Map, never auto-evicted; cleared
// only on explicit clear(). It is also a prompt-cache boundary, so its key must encode
// EVERY input that changes the emitted bytes (see cache-key tags below).
const toolSchemaCache = new Map<string, ToolWireSchema>()
export function getToolSchemaCache(): Map<string, ToolWireSchema> {
  return toolSchemaCache
}
export function clearToolSchemaCache(): void {
  toolSchemaCache.clear()
}

// 2.1.183: zodToJsonSchema (memoized) = DLe @462188-462193
// Per-Zod-schema memoized JSON-Schema conversion (Map `Ael`). The serializer uses the
// tool's raw `inputJSONSchema` if present, else converts `inputSchema` through this.
const zodSchemaJsonCache = new Map<z.ZodTypeAny, ToolInputJSONSchema>()
export function zodToJsonSchema(schema: z.ZodTypeAny): ToolInputJSONSchema {
  const hit = zodSchemaJsonCache.get(schema)
  if (hit) return hit
  const out = zodToJsonSchemaRaw(schema)
  zodSchemaJsonCache.set(schema, out)
  return out
}

// 2.1.183: hashInputJSONSchema = Y_f @581361-581365 (WeakMap XOl @581684; Re = JSON.stringify @9461)
// Stable string fingerprint of a raw inputJSONSchema, WeakMap-memoized so the cache key
// for MCP-style tools (which share a tool `name` across servers) discriminates by schema.
const inputJSONSchemaHashCache = new WeakMap<object, string>()
export function hashInputJSONSchema(schema: object): string {
  let h = inputJSONSchemaHashCache.get(schema)
  if (h === undefined) {
    h = JSON.stringify(schema) // Re @9461 — instrumented JSON.stringify
    inputJSONSchemaHashCache.set(schema, h)
  }
  return h
}

// ===========================================================================
// 5. Lean-system-prompt predicate (the "L:" cache-key tag gate)
// ===========================================================================

// helper: I8u / C8u @ — the model-family lean-prompt classifiers behind isLeanSystemPrompt
declare function modelUsesFullSystemPrompt(model: string): boolean // I8u
declare function modelForcesLeanSystemPrompt(model: string): boolean // C8u

// 2.1.183: isLeanSystemPrompt = Dg @134268-134273 (memoized via `wn`; scaffold X3)
// True when the model is on the lean/simple system-prompt set. CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT
// is a hard override (truthy forces lean, explicit-falsy forces full); otherwise it's the
// per-model classification. Used both for the "L:" cache tag and inside tools' own prompt().
export const isLeanSystemPrompt: (model: string | undefined) => boolean = memoize(
  (model: string | undefined): boolean => {
    if (!model) return false // @134269
    if (parseBoolTrue(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return true // @134270
    if (parseBoolFalse(process.env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return false // @134271
    return !modelUsesFullSystemPrompt(model) || modelForcesLeanSystemPrompt(model) // @134272
  },
)
// helper: wn @733 — single-result memoize wrapper
declare function memoize<F extends (...a: never[]) => unknown>(fn: F): F

// 2.1.183: simpleSystemPromptMode = n0o @580858-580860 — reads CLAUDE_CODE_SIMPLE.
// Distinct from isLeanSystemPrompt: this collapses a tool's WHOLE description to a one-liner.
export function simpleSystemPromptMode(): boolean {
  return Boolean(process.env.CLAUDE_CODE_SIMPLE)
}

// ===========================================================================
// 6. Structured-outputs (`strict`) model gate
// ===========================================================================

// 2.1.183: modelSupportsStructuredOutputs = GNe @134521-134527 (scaffold OVH)
// Provider must have first-party capabilities, and the model must not be a claude-3.x or
// a *-4-0 baseline. Only consulted when the `tengu_tool_pear` gate is on AND the tool opts in.
export function modelSupportsStructuredOutputs(model: string): boolean {
  const normalized = normalizeModelId(model)
  const provider = getModelProvider(model)
  if (!providerHasFirstPartyCapabilities(provider)) return false // @134524
  if (
    normalized.includes('claude-3-') ||
    normalized === 'claude-opus-4-0' ||
    normalized === 'claude-sonnet-4-0'
  )
    return false // @134525
  return true
}

// ===========================================================================
// 7. Experimental-betas strip (HIPAA / explicit-disable)
// ===========================================================================

// 2.1.183: experimentalBetasDisabled = jNe @134594-134596
// When CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS is truthy OR compliance mode is "hipaa",
// non-baseline wire keys (strict, eager_input_streaming, defer_loading) are stripped.
export function experimentalBetasDisabled(): boolean {
  return (
    parseBoolTrue(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS) ||
    complianceModeEnabled('hipaa')
  )
}

// 2.1.183: warnBetasStrippedOnce = K_f @581357-581360 (flag YOl)
// One-time warning when betas get stripped from a tool schema.
let betasStrippedWarned = false
export function warnBetasStrippedOnce(strippedKeys: string[]): void {
  if (betasStrippedWarned) return
  betasStrippedWarned = true
  // @581359 — verbatim:
  logWarn(
    `[betas] Stripped from tool schemas: [${strippedKeys.join(', ')}] (experimental betas disabled)`,
  )
}

// ===========================================================================
// 8. Agent-team property stripping (2.1.183-new in this path)
// ===========================================================================

// 2.1.183: agentTeamsEnabled = Sl @293831-293835
// (env CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS truthy OR --agent-teams argv) AND tengu_amber_flint.
declare function agentTeamsArgvFlag(): boolean // yqd @
export function agentTeamsEnabled(): boolean {
  if (!parseBoolTrue(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !agentTeamsArgvFlag())
    return false // @293832
  if (!getFeatureGate('tengu_amber_flint', true)) return false // @293833
  return true
}

// Tool name constants whose schemas carry team-only props (stripped when teams off).
const EXIT_PLAN_MODE_TOOL_NAME = 'ExitPlanMode' // WM @152253
const AGENT_TOOL_NAME = 'Agent' // vs @149939

// 2.1.183: AGENT_TEAM_STRIP_TABLE = W_f @581683
// Tool name → schema properties to delete when agent-teams are disabled.
const AGENT_TEAM_STRIP_TABLE: Record<string, string[]> = {
  [EXIT_PLAN_MODE_TOOL_NAME]: ['launchSwarm', 'teammateCount'],
  [AGENT_TOOL_NAME]: ['name', 'team_name', 'mode'],
}

// 2.1.183: stripAgentTeamProps = V_f @581284-581286 (over q_f @581276-581283)
// Returns a schema copy with the named properties removed from `properties`. Non-mutating;
// returns the input unchanged when there are no keys to strip or `properties` is absent.
function deleteSchemaProps(schema: ToolInputJSONSchema, keys: string[]): ToolInputJSONSchema {
  if (keys.length === 0) return schema
  const props = schema.properties
  if (!props || typeof props !== 'object') return schema
  const trimmed = { ...props }
  for (const k of keys) delete (trimmed as Record<string, unknown>)[k]
  return { ...schema, properties: trimmed }
}
export function stripAgentTeamProps(
  toolName: string,
  schema: ToolInputJSONSchema,
): ToolInputJSONSchema {
  return deleteSchemaProps(schema, AGENT_TEAM_STRIP_TABLE[toolName] ?? [])
}

// ===========================================================================
// 9. Per-tool description resolution
// ===========================================================================

// 2.1.183: resolveToolDescription = z_f @581287-581299
// Default path returns the tool's full `prompt(opts)` (per-tool, model-aware — this is
// where each tool's own lean-prompt branching happens). CLAUDE_CODE_SIMPLE mode collapses
// the description: to the tool's `searchHint` one-liner if it has one, else to the first
// paragraph of the full prompt. Token-saving path orthogonal to the "L:" lean-prompt tag.
export async function resolveToolDescription(
  tool: SerializableTool,
  opts: BuildToolSchemaOptions,
): Promise<string> {
  if (!simpleSystemPromptMode()) return tool.prompt(opts) // @581288
  if (tool.searchHint) return tool.searchHint // @581289
  const full = await tool.prompt(opts) // @581290
  return substringBefore(full, '\n\n').trim() || full // @581291-581298: first paragraph, else whole
}

// ===========================================================================
// 10. buildToolSchema — the wire-object serializer
// ===========================================================================

/**
 * Serialize one in-process tool into the Messages-API `tools[]` wire object.
 *
 * Steps:
 *   1. Compute the cache key from (lean-prompt tag, stream tag, name|name:hash).
 *   2. On a cache miss, build the base object: convert/strip the JSON schema,
 *      resolve the description, decide `strict`, decide `eager_input_streaming`.
 *   3. Layer per-request keys (`defer_loading`, `cache_control`) on a fresh copy.
 *   4. If experimental betas are disabled, drop every non-baseline key (warn once).
 *
 * 2.1.183: buildToolSchema = CWn @581300-581356 (scaffold w08)
 */
export async function buildToolSchema(
  tool: SerializableTool,
  opts: BuildToolSchemaOptions,
): Promise<ToolWireSchema> {
  const provider = getAPIProvider() // @581301
  const caps = opts.model ? getModelCaps(opts.model) : undefined // @581302

  // --- Cache-key tags ----------------------------------------------------
  // "L:" lean tag — same tool produces a different description under a lean prompt. @581303
  const leanTag = isLeanSystemPrompt(opts.model) ? 'L:' : ''
  // "F:" stream tag — same tool produces a different `eager_input_streaming` under eligible
  // vertex/bedrock caps. NOTE the documented asymmetry: this tag is computed from provider +
  // per-model cap ONLY (581304-581307) — it does NOT include the !ANTHROPIC_VERTEX_BASE_URL /
  // !ANTHROPIC_BEDROCK_BASE_URL guards that the actual gate (581325-581326) enforces. So with a
  // custom Vertex/Bedrock base-url + caps-eligible model, the key carries "F:" but the cached
  // object will NOT set eager_input_streaming. Harmless cache over-segmentation, not a bug. @581304
  const streamTag =
    (provider === 'vertex' && caps?.eagerInputStreaming?.vertex) ||
    (provider === 'bedrock' && caps?.eagerInputStreaming?.bedrock)
      ? 'F:'
      : ''
  // name part: MCP-style tools that carry a raw inputJSONSchema key off `name:hash(schema)` so
  // distinct schemas under the same tool name don't collide; all others key off bare name. @581308
  const cacheKey =
    leanTag +
    streamTag +
    '' +
    ('inputJSONSchema' in tool && tool.inputJSONSchema
      ? `${tool.name}:${hashInputJSONSchema(tool.inputJSONSchema)}`
      : tool.name)

  const cache = getToolSchemaCache() // @581310
  let base = cache.get(cacheKey)

  if (!base) {
    // tengu_tool_pear = structured-outputs (strict) gate, default OFF. @581312
    const strictGateOn = getFeatureGate('tengu_tool_pear', false)

    // JSON schema: raw inputJSONSchema if present, else zod→JSON-schema. @581313
    let inputSchema: ToolInputJSONSchema =
      'inputJSONSchema' in tool && tool.inputJSONSchema
        ? tool.inputJSONSchema
        : zodToJsonSchema(tool.inputSchema)

    // Strip agent-team-only properties when agent-teams are OFF. @581315 (2.1.183-new)
    if (!agentTeamsEnabled()) inputSchema = stripAgentTeamProps(tool.name, inputSchema)

    base = {
      name: tool.name,
      description: await resolveToolDescription(tool, opts), // @581317
      input_schema: inputSchema,
    }

    // strict only when: pear gate on AND tool opts in AND model supports structured outputs. @581318
    if (strictGateOn && tool.strict === true && opts.model && modelSupportsStructuredOutputs(opts.model)) {
      base.strict = true
    }

    // --- The four-way eager_input_streaming gate, bracketed by an explicit-off ENV kill ---
    // @581321: ENV kill — `!parseBoolFalse(env)` short-circuits the WHOLE gate to OFF when
    // CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING is EXPLICITLY falsy ("0"/"false"/"no"/"off").
    // An UNSET var is not "explicitly off" (parseBoolFalse(undefined)===false), so it does not kill.
    const fgtsEnv = process.env.CLAUDE_CODE_ENABLE_FINE_GRAINED_TOOL_STREAMING
    if (
      !parseBoolFalse(fgtsEnv) &&
      // (1) firstParty + anthropic base-url + tengu_fgts gate (default OFF). @581324
      ((provider === 'firstParty' && isFirstPartyAnthropicBaseUrl() && getFeatureGate('tengu_fgts', false)) ||
        // (2) vertex + standard (non-custom) base-url + per-model vertex cap. @581325
        (provider === 'vertex' && !process.env.ANTHROPIC_VERTEX_BASE_URL && caps?.eagerInputStreaming?.vertex) ||
        // (3) bedrock + standard (non-custom) base-url + per-model bedrock cap. @581326
        (provider === 'bedrock' && !process.env.ANTHROPIC_BEDROCK_BASE_URL && caps?.eagerInputStreaming?.bedrock) ||
        // (4) env FORCE — truthy "1"/"true"/"yes"/"on" forces it on ANY provider, bypassing caps/gate
        //     (still subject to the outer !parseBoolFalse, trivially true when fgtsEnv is truthy). @581327
        parseBoolTrue(fgtsEnv))
    ) {
      base.eager_input_streaming = true
    }

    cache.set(cacheKey, base) // @581329
  }

  // --- Per-request layer (NOT cached — varies per call) ------------------
  const schema: ToolWireSchema = {
    name: base.name,
    description: base.description,
    input_schema: base.input_schema,
    ...(base.strict && { strict: true }),
    ...(base.eager_input_streaming && { eager_input_streaming: true }),
  }
  if (opts.deferLoading) schema.defer_loading = true // @581339: ToolSearch deferral
  if (opts.cacheControl) schema.cache_control = opts.cacheControl // @581340: prompt-cache breakpoint

  // --- Experimental-betas strip (HIPAA / explicit-disable) ---------------
  if (experimentalBetasDisabled()) {
    // Baseline keys that survive; everything else (strict, eager_input_streaming, defer_loading) is dropped. @581342
    const baselineKeys = new Set(['name', 'description', 'input_schema', 'cache_control'])
    const stripped = Object.keys(schema).filter(k => !baselineKeys.has(k))
    if (stripped.length > 0) {
      warnBetasStrippedOnce(stripped)
      return {
        name: schema.name,
        description: schema.description,
        input_schema: schema.input_schema,
        ...(schema.cache_control && { cache_control: schema.cache_control }),
      }
    }
  }

  return schema
}

// ===========================================================================
// 11. AskUserQuestion — the one built-in tool whose `prompt()`/`description`
//     resolution is load-bearing for THIS path (lean gate + reservation hook).
// ===========================================================================
//
// AskUserQuestion = sut (pi(...)) @391450-…  — name const Ff = "AskUserQuestion" @221315.
// Its description() is a flat string; its prompt({model}) demonstrates the
// isLeanSystemPrompt (`Dg`) gate AND a feature-gate text override — both resolved through
// resolveToolDescription above. Reconstructed here so the gate path is end-to-end visible.

// 2.1.183: ASK_USER_QUESTION_DESCRIPTION = d1i @221317-221318 — verbatim:
const ASK_USER_QUESTION_DESCRIPTION =
  'Asks the user multiple choice questions to gather information, clarify ambiguity, understand preferences, make decisions or offer them choices.'

// 2.1.183: ASK_USER_QUESTION_RESERVATION_PROMPT = f1i @221321-221323 (scaffold FUK) — verbatim
// (appended only for lean models; note the em-dash —):
const ASK_USER_QUESTION_RESERVATION_PROMPT = `
Reserve this for decisions where the user's answer changes what you do next — not for choices with a conventional default or facts you can verify in the codebase yourself. In those cases pick the obvious option, mention it in your response, and proceed.
`

// helper: A7 = "EnterPlanMode" @221314 ; yx = "ExitPlanMode" @152253 (referenced in base prompt)
declare const ENTER_PLAN_MODE_TOOL_NAME: string // A7
declare const EXIT_PLAN_MODE_NAME: string // yx

// 2.1.183: ASK_USER_QUESTION_BASE_PROMPT = f5r @221346-221354 (scaffold xM6) — verbatim:
const ASK_USER_QUESTION_BASE_PROMPT = `Use this tool only when you are blocked on a decision that is genuinely the user's to make: one you cannot resolve from the request, the code, or sensible defaults.

Usage notes:
- Users will always be able to select "Other" to provide custom text input
- Use multiSelect: true to allow multiple answers to be selected for a question
- If you recommend a specific option, make that the first option in the list and add "(Recommended)" at the end of the label

Plan mode note: To switch into plan mode, use ${ENTER_PLAN_MODE_TOOL_NAME} (not this tool). Once in plan mode, use this tool to clarify requirements or choose between approaches BEFORE finalizing your plan. Do NOT use this tool to ask "Is my plan ready?", "Should I proceed?", or otherwise reference "the plan" in questions — the user cannot see the plan until you call ${EXIT_PLAN_MODE_NAME} for approval.
`

// 2.1.183: ASK_USER_QUESTION_PREVIEW_NOTES = p1i @221325-221345 — appended per render-mode. Verbatim:
const ASK_USER_QUESTION_PREVIEW_NOTES: Record<'markdown' | 'html', string> = {
  markdown: `
Preview feature:
Use the optional \`preview\` field on options when presenting concrete artifacts that users need to visually compare:
- ASCII mockups of UI layouts or components
- Code snippets showing different implementations
- Diagram variations
- Configuration examples

Preview content is rendered as markdown in a monospace box. Multi-line text with newlines is supported. When any option has a preview, the UI switches to a side-by-side layout with a vertical option list on the left and preview on the right. Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
`,
  html: `
Preview feature:
Use the optional \`preview\` field on options when presenting concrete artifacts that users need to visually compare:
- HTML mockups of UI layouts or components
- Formatted code snippets showing different implementations
- Visual comparisons or diagrams

Preview content must be a self-contained HTML fragment (no <html>/<body> wrapper, no <script> or <style> tags — use inline style attributes instead). Do not use previews for simple preference questions where labels and descriptions suffice. Note: previews are only supported for single-select questions (not multiSelect).
`,
}

// helper: FKt @391467 — returns the active preview render-mode (undefined | "markdown" | "html").
declare function getPreviewRenderMode(): 'markdown' | 'html' | undefined

// 2.1.183: askUserQuestionTool = sut @391450-… (scaffold YtH).
// Only the fields exercising THIS module's gates are reconstructed (full tool contract
// lives in 04_tools/reconstructed_source/AskUserQuestionTool.ts).
export const askUserQuestionTool = {
  name: 'AskUserQuestion', // Ff @221315
  searchHint: 'prompt the user with a multiple-choice question', // @391452
  maxResultSizeChars: 1e5,

  // description() is the flat string — under CLAUDE_CODE_SIMPLE, resolveToolDescription
  // would instead use `searchHint`; this method is the normal-mode value.
  async description(): Promise<string> {
    return ASK_USER_QUESTION_DESCRIPTION
  },

  // prompt({model}) — @391457-391470. Lean models get a reservation paragraph appended
  // (overridable by the tengu_cinder_plover gate text); preview notes appended per render-mode.
  async prompt({ model }: { model: string }): Promise<string> {
    let reservation = ''
    if (isLeanSystemPrompt(model)) {
      // @391460: optional GB text override; empty trimmed string falls back to the hardcoded default.
      const override = getFeatureGate('tengu_cinder_plover', '').trim()
      reservation = override ? `\n${override}\n` : ASK_USER_QUESTION_RESERVATION_PROMPT
    }
    const renderMode = getPreviewRenderMode() // FKt @391467
    if (renderMode === undefined) return ASK_USER_QUESTION_BASE_PROMPT + reservation // @391468
    return ASK_USER_QUESTION_BASE_PROMPT + reservation + ASK_USER_QUESTION_PREVIEW_NOTES[renderMode] // @391469
  },
}
