// ============================================================================
// systemPrompt.ts — readable-source reconstruction (Claude Code v2.1.183)
// ----------------------------------------------------------------------------
// 2.1.183 regions covered:
//   - buildEffectiveSystemPromptSections (section layer)  = KL  @cli_inner_pretty.js:580888-580940
//   - isSimplePromptMode (CLAUDE_CODE_SIMPLE short-circuit) = n0o @580858-580860
//   - isLeanSystemPrompt (lean gate, memoized)            = Dg  @134268-134273 (fwd decl 134260)
//   - isFullPromptModel                                   = I8u @134243-134259
//   - isForcedLeanModel                                   = C8u @134235-134242
//   - isEarlyAccessModel (-eap bypass)                    = cme @134232-134234
//   - mergeSystemPrompt (merge / precedence layer)        = bW  @362647-362665
//   - systemPromptSection factory                         = Jx  @429774-429775
//   - resolveSystemPromptSections (memo)                  = O8a @429777-429785
//   - dynamic-boundary marker                             = hoe @53897 ; gate Xve @134600-134605
//   - team/ownership-frame predicate                      = t0o @581260-581266 (tengu_walnut_prism)
//   - investigate-first mode resolver                     = i0o @581166-581175
//   - getModelIds (Fable-5 model-list map)                = wPe @581254-581258
//   tengu gates toggling optional sections: tengu_silent_harbor @580910,
//   tengu_amber_sextant @580687 (A_f autonomy_append), tengu_heron_brook @580679 (m_f),
//   tengu_sparrow_ledger @580884 (C_f verify), tengu_cedar_lantern @581268 (x_f act),
//   tengu_walnut_prism @581262 (t0o ownership), tengu_velvet_cascade @134239 (force-lean).
//
// 2.1.88 convention mirror : /lyz/codespace/3rd/claude-code/src/utils/systemPrompt.ts
// 2.1.156 scaffold doc     : .../claude_code_v_2.1.156/analyze/44_lean_prompt/README.md
// Anchor dossier (spec)    : ../_anchors_system_prompt.md  (§1, §1a, §1b, §9, §10)
//
// Cross-validation: the assembler shape (SIMPLE short-circuit → lean/full head
//   ternary → cacheable dynamic registry → boundary marker → attachments) and
//   the lean gate / merge precedence are CARRYOVER from 2.1.156 (the
//   `buildSystemPromptSections`/`isLeanSystemPrompt` machine). The 2.1.183
//   deltas live in the gated optional sections: the ownership-frame/team intro
//   variants (tengu_walnut_prism → t0o → w_f/y_f), the Fable-5 identity block
//   (fable_identity → d_f) and the model-list env line. Every section line was
//   re-read in the 2.1.183 bundle.
// ============================================================================

import {
  asSystemPrompt,
  type SystemPrompt,
} from './systemPromptType.js'

export { asSystemPrompt, type SystemPrompt } from './systemPromptType.js'

// SINGLE-DEFINITION: SYSTEM_PROMPT_DYNAMIC_BOUNDARY (hoe @53897) has its one home in
// constants/prompts.ts (the 2.1.88 convention location, and the const that
// systemPromptSections.ts already imports). Import it here for the assembler's boundary-marker
// emit and re-export so this file's §7 region keeps resolving — do not re-define it.
import { SYSTEM_PROMPT_DYNAMIC_BOUNDARY } from '../constants/prompts.js'
export { SYSTEM_PROMPT_DYNAMIC_BOUNDARY } from '../constants/prompts.js'

// ─── Declared dependencies (resolved elsewhere in the bundle) ───────────────
// Kept as `declare` so this file documents the assembler contract without
// re-implementing the whole prompt tree. Each maps to a confirmed obf id.
declare function getCwd(): string //                       Pt  @46264
declare function getTodayDate(): string //                 SCe @220222 (memoized YYYY-MM-DD)
declare function getModelId(model: ModelLike): string //   Bo  @102895 canonical model id
declare function getToolNames(): Set<string> //            (new Set(e.map(h => h.name)))
declare function isCoordinatorMode(): boolean //           oI  (COORDINATOR_MODE + env)
declare function isBuiltInAgent(def: AgentDefinition): boolean // ay
declare function logEvent(name: string, data: unknown): void //  G
declare function emitDiag(msg: string): void //            v   (diagnostic log)
declare function growthbook<T>(flag: string, dflt: T): T // ct  (growthbook/clientData flag)
declare function envTruthy(v: string | undefined): boolean //    st (parseBoolTrue)
declare function envFalsy(v: string | undefined): boolean //     yl (parseBoolFalse)
declare const Env: {
  CLAUDE_CODE_SIMPLE?: boolean
  CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT?: string
  CLAUDE_CODE_OWNERSHIP_FRAME?: boolean
  platform: string
} //                                                        Ge  (process env wrapper)

type ModelLike = string
type OutputStyle = { keepCodingInstructions?: boolean } | null
interface AgentDefinition {
  getSystemPrompt: (arg?: { toolUseContext: { options: unknown } }) => string
  memory?: string
  appendSystemPrompt?: boolean
  agentType?: string
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ §9  THE LEAN GATE — isLeanSystemPrompt (Dg) and its supporting predicates  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// 2.1.183: isEarlyAccessModel (-eap bypass) = cme @cli_inner_pretty.js:134232-134234
// An "-eap" (early-access) suffix forces lean-eligibility: such models are
// frontier/experimental and trusted to behave from terse guidance.
function isEarlyAccessModel(model: string): boolean {
  return /-eap($|\[)/i.test(model) // @134233 (regex verbatim)
}

// 2.1.183: isFullPromptModel = I8u @cli_inner_pretty.js:134243-134259
// Returns true ⇒ keep the FULL (six-section) prompt; false ⇒ lean-eligible.
//
// The list is a *capability* judgement, not "is this weak": Haiku/Sonnet and
// Opus ≤4.7 keep the full scaffolding, while Opus 4.8 / Fable 5 / Mythos 5
// (@134257) are trusted to run lean. Unknown ids fall through to `!isFirst-
// PartyOrGateway()` — first-party/gateway hosts go lean (frontier), other
// hosts (bedrock/vertex/foundry/mantle) stay full conservatively.
function isFullPromptModel(model: ModelLike): boolean {
  if (isEarlyAccessModel(model)) return false // @134244
  const id = getModelId(model)
  if (
    id.includes('claude-3-') || // @134247
    id.includes('haiku') ||
    id.includes('sonnet') ||
    id === 'claude-opus-4-0' ||
    id === 'claude-opus-4-1' ||
    id === 'claude-opus-4-5' ||
    id === 'claude-opus-4-6' ||
    id === 'claude-opus-4-7'
  )
    return true // @134256 → FULL
  // @134257: the trusted frontier tier → lean-eligible.
  if (
    id === 'claude-opus-4-8' ||
    id === 'claude-fable-5' ||
    id === 'claude-mythos-5'
  )
    return false
  // @134258: unknown id → first-party/gateway lean, other hosts full.
  return !isFirstPartyOrGateway()
}

// 2.1.183: isForcedLeanModel = C8u @cli_inner_pretty.js:134235-134242
// Additive-only override channel: server-pushed clientData map or the
// `tengu_velvet_cascade` growthbook can ADD a model to the lean set, never
// remove it (because the gate is `!isFullPromptModel || isForcedLeanModel`).
// This makes the lean rollout monotone and reversible from the server.
function isForcedLeanModel(model: ModelLike): boolean {
  const id = getModelId(model)
  // @134237: clientDataCache.simple_system_prompt = { "<id-substr>": true }
  const fromClientData = clientDataCache()?.simple_system_prompt
  if (
    typeof fromClientData === 'object' &&
    fromClientData !== null &&
    Object.entries(fromClientData).some(
      ([sub, on]) => on === true && id.includes(sub),
    )
  )
    return true
  // @134239: tengu_velvet_cascade = { models: ["<id-substr>", ...] }
  const cascade = growthbook<{ models?: unknown } | null>(
    'tengu_velvet_cascade',
    null,
  )
  if (
    typeof cascade !== 'object' ||
    cascade === null ||
    !('models' in cascade) ||
    !Array.isArray(cascade.models)
  )
    return false
  return cascade.models.some((m) => typeof m === 'string' && id.includes(m))
}

// 2.1.183: isLeanSystemPrompt = Dg @cli_inner_pretty.js:134268-134273 (fwd `var Dg;` @134260)
// Memoized (wn = lodash-style memoize) because a single prompt build consults
// it 16+ times (the head swap PLUS every per-section lean/full variant), and
// each call otherwise runs model-id normalization + regex + clientData/growth-
// book lookups. true ⇒ LEAN body.
//
// Precedence (highest → lowest):
//   1. no model                                  → FULL  (@134269)
//   2. env CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT true  → LEAN  (@134270, operator override)
//   3. env CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT false → FULL  (@134271)
//   4. !isFullPromptModel || isForcedLeanModel    → static capability gate (@134272)
export const isLeanSystemPrompt: (model: ModelLike | undefined) => boolean =
  memoize((model) => {
    if (!model) return false // @134269 — no model resolves to FULL
    if (envTruthy(Env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return true // @134270
    if (envFalsy(Env.CLAUDE_CODE_SIMPLE_SYSTEM_PROMPT)) return false // @134271
    return !isFullPromptModel(model) || isForcedLeanModel(model) // @134272
  })

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ §1  THE SECTION ASSEMBLER — buildEffectiveSystemPromptSections (KL)        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

interface SectionDescriptor {
  name: string
  compute: () => unknown
  cacheBreak: boolean
}

// 2.1.183: systemPromptSection (cacheable descriptor factory) = Jx @cli_inner_pretty.js:429774-429775
// NOTE: 2.1.183 has ONLY this factory; `cacheBreak` is hardcoded `false`. The
// 2.1.88 `DANGEROUS_uncachedSystemPromptSection` analog has NO separate factory
// here — the uncached behavior is realized out-of-band by (a) the billing
// header (`cacheScope: null` in the cache-scope splitter) and (b) the
// `date_change` attachment, so the cached body itself stays date-free.
// UNVERIFIED-default: no `cacheBreak: true` literal exists anywhere in the
//   bundle (grep returns only the `!1` site) — there is no cache-break path.
function systemPromptSection(
  name: string,
  compute: () => unknown,
): SectionDescriptor {
  return { name, compute, cacheBreak: false } // @429775
}

// 2.1.183: resolveSystemPromptSections (compute-once-per-process memo) = O8a @429777-429785
// For each descriptor: if not cacheBreak and the cache already has `name`,
// return the cached value; otherwise `compute()` and store it. This makes each
// section's text compute exactly once per process (NOT token-cheaper — the text
// still ships every turn, which is why shrinking it via lean is the real win).
async function resolveSystemPromptSections(
  descriptors: SectionDescriptor[],
): Promise<unknown[]> {
  const cache = sectionCache() // @429778 ayt() — Ot.systemPromptSectionCache
  return Promise.all(
    descriptors.map(async (d) => {
      if (!d.cacheBreak && cache.has(d.name)) return cache.get(d.name) ?? null
      const value = await d.compute()
      cacheSet(d.name, value) // @429783 drr(name, value)
      return value
    }),
  )
}

// 2.1.183: isSimplePromptMode (CLAUDE_CODE_SIMPLE) = n0o @cli_inner_pretty.js:580858-580860
// The radically-simple path PREDATES lean and is checked before the lean gate
// is ever consulted; it returns the near-empty body (just CWD + Date).
function isSimplePromptMode(): boolean {
  return Boolean(Env.CLAUDE_CODE_SIMPLE) // @580859
}

interface BuildSectionsOpts {
  excludeDynamicSections?: boolean
}

// 2.1.183: buildEffectiveSystemPromptSections = KL @cli_inner_pretty.js:580888-580940
//
// Two-layer prompt build, LAYER 1 (sections). Produces the ORDERED string[]
// that the merge layer (mergeSystemPrompt/bW) and the API path later wrap.
//
// Order of emission (the structural heart, @580931-580939):
//   [ <lean OR full head>,            ← head swap on isLeanSystemPrompt(model)
//     <excluded-mode auto-memory?>,   ← only in excludeDynamicSections mode
//     <dynamic-boundary marker?>,     ← only when boundary gate is on
//     ...<resolved dynamic sections>, ← the cacheable registry, in registry order
//     <attachments section> ]
//   .filter(x => x !== null)
async function buildEffectiveSystemPromptSections(
  tools: { name: string }[], // e
  mainLoopModel: ModelLike, // t
  additionalWorkingDirs: string[] | undefined, // n
  opts?: BuildSectionsOpts, // r
): Promise<string[]> {
  // @580889-580895: CLAUDE_CODE_SIMPLE short-circuit (orthogonal to lean).
  if (isSimplePromptMode()) {
    return opts?.excludeDynamicSections
      ? []
      : [`CWD: ${getCwd()}\nDate: ${getTodayDate()}`]
  }

  // @580896: the boolean that drives the head swap.
  const lean = isLeanSystemPrompt(mainLoopModel) // o = Dg(t)
  const modelId = getModelId(mainLoopModel) // s = Bo(t) @580897
  const leanSuffix = lean ? ':L' : '' // i @580898 — per-section lean cache key
  const cwd = getCwd() // a @580899
  // @580900: [outputStyleMeta, outputStyle] = await Promise.all([hv(cwd), t5n()])
  const [outputStyleMeta, outputStyle] = await loadOutputStyle(cwd) // [l, c]
  const config = readConfig() // u = jr() @580901
  const toolSet = new Set(tools.map((t) => t.name)) // d @580902
  const excluded = opts?.excludeDynamicSections === true // p @580903
  const sendUserMsg = briefEnabled() // f @580904 — anti_verbosity variant key

  // @580905-580929: the cacheable dynamic-section registry (each entry resolved
  // once via resolveSystemPromptSections). Optional sections carry tengu gates
  // inside their compute fns; the lean suffix `:L` makes lean/full variants
  // separately cacheable.
  const registry: SectionDescriptor[] = [
    // @580906 anti-verbosity / "Communicating with the user" (rewritten 2.1.183, l_f)
    systemPromptSection(
      `anti_verbosity${leanSuffix}${sendUserMsg ? ':send_user_msg' : ''}`,
      () => buildAntiVerbositySection(mainLoopModel),
    ),
    // @580907 action-caution (c_f)
    systemPromptSection(`action_caution${leanSuffix}`, () =>
      buildActionCautionSection(mainLoopModel),
    ),
    // @580908 task-continuity (u_f)
    systemPromptSection('task_continuity', () =>
      buildTaskContinuitySection(modelId),
    ),
    // @580909 Fable-5/Mythos identity block (d_f) — gated on model family.
    systemPromptSection('fable_identity', () =>
      isFableTier(modelId) || isMythosModel(mainLoopModel) ? FABLE_IDENTITY : null,
    ),
    // @580910 tool-param-json — gated on tengu_silent_harbor (default false).
    systemPromptSection('tool_param_json', () =>
      isToolParamJsonForced() ||
      ((isAutonomousModel(modelId) || isMythosModel(mainLoopModel)) &&
        growthbook('tengu_silent_harbor', false)) // @580910 default false
        ? TOOL_PARAM_JSON_SECTION
        : null,
    ),
    // @580911 investigate-first (U_f), key includes the resolved mode (i0o).
    systemPromptSection(`investigate_first:${investigateFirstMode(mainLoopModel)}`, () =>
      buildInvestigateFirstSection(mainLoopModel),
    ),
    // @580912 session-specific guidance (v_f), variant keyed on lean/sdk/version.
    systemPromptSection(
      `session_guidance${leanSuffix}${excluded ? ':sdk' : ''}:${appVersion()}`,
      () => buildSessionGuidanceSection(toolSet, outputStyleMeta, lean, excluded), // v_f(d, l, o, p)
    ),
    // @580913 memory — omitted in excludeDynamicSections mode.
    ...(excluded
      ? []
      : [systemPromptSection(`memory${leanSuffix}`, () => buildMemorySection(mainLoopModel))]),
    // @580914-580916 environment block: static (excluded) vs simple (live).
    ...(excluded
      ? [systemPromptSection('env_info_static', () => buildStaticEnvSection(mainLoopModel, excluded))]
      : [systemPromptSection('env_info_simple', () => buildSimpleEnvSection(mainLoopModel, excluded, additionalWorkingDirs))]),
    // @580917 language (g_f)
    systemPromptSection('language', () => buildLanguageSection(config.language)),
    // @580918 output-style (h_f)
    systemPromptSection('output_style', () => buildOutputStyleSection(outputStyle)),
    // @580919 background session (R_f)
    systemPromptSection('bg-session', () => buildBackgroundSessionSection()),
    // @580920 scratchpad — omitted in excludeDynamicSections mode (HUn)
    ...(excluded ? [] : [systemPromptSection('scratchpad', () => buildScratchpadSection())]),
    // @580921 context management (constant $_f)
    systemPromptSection('context_management', () => CONTEXT_MANAGEMENT_SECTION),
    // @580922 (spread of []) — a placeholder slot, currently empty.
    // @580923 brief / proactive (O_f)
    systemPromptSection('brief', () => buildBriefSection()),
    // @580924 focus mode (F_f), lean/full variant via leanSuffix.
    systemPromptSection(`focus_mode${leanSuffix}`, () => buildFocusModeSection(mainLoopModel)),
    // @580925 reproduce/verify workflow — gated on tengu_sparrow_ledger (default false, via C_f).
    systemPromptSection('reproduce_verify_workflow', () =>
      isVerifyPromptArmed() ? REPRODUCE_VERIFY_SECTION : null,
    ),
    // @580926 act-don't-rederive — gated on tengu_cedar_lantern (default TRUE, via x_f).
    systemPromptSection('act_dont_rederive', () =>
      isActDontRederiveArmed() ? ACT_DONT_REDERIVE_SECTION : null,
    ),
    // @580927 heron_brook — clientData/growthbook injected free-text (m_f, default "").
    systemPromptSection('heron_brook', () => buildHeronBrookSection()),
    // @580928 autonomy append — gated on tengu_amber_sextant (default TRUE, via A_f).
    systemPromptSection('autonomy_append', () => buildAutonomyAppendSection(modelId)),
  ]

  // @580930: resolve (and memo-cache) every dynamic section.
  const dynamicSections = await resolveSystemPromptSections(registry)

  // @580931-580939: THE ORDERED BODY.
  return [
    // ── HEAD: lean (1 section) vs full (6 sections) ──────────────────────────
    ...(lean
      ? [
          // @580933 LEAN head: combined intro + 5-bullet "# Harness".
          buildLeanHarnessIntro(outputStyle),
        ]
      : [
          // @580934 FULL head, in order:
          buildFullIntro(outputStyle), //                  y_f  — intro + cyber-risk + URL rule
          buildSystemSection(), //                          __f  — "# System"
          // "# Doing tasks" only when no output style, or the style keeps coding instructions:
          outputStyle === null || outputStyle.keepCodingInstructions === true
            ? buildDoingTasksSection()
            : null, //                                       b_f
          buildExecutingActionsSection(mainLoopModel), //   S_f  — "# Executing actions with care"
          buildUsingToolsSection(toolSet), //               E_f  — "# Using your tools"
          buildToneAndStyleSection(), //                    T_f  — "# Tone and style"
        ]),
    // @580935: excluded-mode auto-memory section (Cgi) — only in excluded mode.
    ...(excluded ? [buildExcludedModeMemorySection(mainLoopModel)] : []),
    // @580936: dynamic-boundary marker — only when the boundary gate is on.
    ...(isDynamicBoundaryEnabled() ? [SYSTEM_PROMPT_DYNAMIC_BOUNDARY] : []),
    // @580937: the resolved cacheable registry, in registry order.
    ...(dynamicSections as (string | null)[]),
    // @580938: attachments section, always last (zOl).
    buildAttachmentsSection(mainLoopModel),
  ].filter((s): s is string => s !== null) // @580939
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ §10  THE MERGE LAYER — mergeSystemPrompt (bW)                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

interface MergeArgs {
  mainThreadAgentDefinition?: AgentDefinition
  toolUseContext: { options: unknown }
  customSystemPrompt?: string | string[]
  defaultSystemPrompt: string[]
  appendSystemPrompt?: string
  overrideSystemPrompt?: string | null
}

// 2.1.183: mergeSystemPrompt = bW @cli_inner_pretty.js:362647-362665
//
// Resolves the effective prompt by PRECEDENCE (highest → lowest), then always
// appends appendSystemPrompt last (except under override):
//   0. overrideSystemPrompt   → REPLACES everything (e.g. loop mode)      @362655
//   1. coordinator mode + no main-thread agent def → coordinator prompt   @362656-362658
//   2. main-thread agent def  → its getSystemPrompt()                     @362659
//        - if the agent def ALSO sets appendSystemPrompt, the agent prompt
//          is APPENDED to (custom ?? default) instead of replacing it       @362663
//        - otherwise it REPLACES (custom ?? default)                        @362664
//   3. customSystemPrompt (--system-prompt) else defaultSystemPrompt
//
// This mirrors the 2.1.88 `buildEffectiveSystemPrompt` precedence ladder; the
// 2.1.183 difference is the agent-def `appendSystemPrompt` branch (the
// proactive-mode "# Custom Agent Instructions" append in 2.1.88 became a
// general agent-append branch here).
export function mergeSystemPrompt({
  mainThreadAgentDefinition,
  toolUseContext,
  customSystemPrompt,
  defaultSystemPrompt,
  appendSystemPrompt,
  overrideSystemPrompt,
}: MergeArgs): SystemPrompt {
  // @362655: override wins, replacing all other prompts.
  if (overrideSystemPrompt) return asSystemPrompt([overrideSystemPrompt])

  // @362656-362658: coordinator mode (no main-thread agent def) → coordinator prompt.
  if (isCoordinatorMode() && !mainThreadAgentDefinition) {
    const { getCoordinatorSystemPrompt } = requireCoordinatorMode()
    return asSystemPrompt([
      getCoordinatorSystemPrompt(),
      ...(appendSystemPrompt ? [appendSystemPrompt] : []),
    ])
  }

  // @362659: resolve the agent system prompt (built-in agents take toolUseContext).
  const agentSystemPrompt = mainThreadAgentDefinition
    ? isBuiltInAgent(mainThreadAgentDefinition)
      ? mainThreadAgentDefinition.getSystemPrompt({
          toolUseContext: { options: toolUseContext.options },
        })
      : mainThreadAgentDefinition.getSystemPrompt()
    : undefined

  // @362660: telemetry for main-loop agent memory.
  if (mainThreadAgentDefinition?.memory) {
    logEvent('tengu_agent_memory_loaded', {
      scope: mainThreadAgentDefinition.memory,
      source: 'main-thread',
    })
  }

  // @362663: agent def that also requests an append → APPEND agent prompt to base.
  if (agentSystemPrompt && mainThreadAgentDefinition?.appendSystemPrompt) {
    return asSystemPrompt([
      ...resolveBase(customSystemPrompt, defaultSystemPrompt),
      agentSystemPrompt,
      ...(appendSystemPrompt ? [appendSystemPrompt] : []),
    ])
  }

  // @362664: default — agent prompt (if any) else custom/default, then append.
  return asSystemPrompt([
    ...(agentSystemPrompt
      ? [agentSystemPrompt]
      : resolveBase(customSystemPrompt, defaultSystemPrompt)),
    ...(appendSystemPrompt ? [appendSystemPrompt] : []),
  ])
}

// The base-prompt selector reused inside the two return paths above: a string
// custom prompt is wrapped, an array custom prompt is spread, otherwise the
// default array is used.  (Inline in bW @362663/@362664.)
function resolveBase(
  custom: string | string[] | undefined,
  fallback: string[],
): string[] {
  if (typeof custom === 'string') return [custom]
  if (Array.isArray(custom)) return custom
  return fallback
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ §7  DYNAMIC-BOUNDARY MARKER + GATE                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// 2.1.183: SYSTEM_PROMPT_DYNAMIC_BOUNDARY = hoe @cli_inner_pretty.js:53897
// (re-exported as SYSTEM_PROMPT_DYNAMIC_BOUNDARY @555558). The cache-scope
// splitter finds this marker and caches everything BEFORE it (org/static),
// leaving everything AFTER it as the per-turn dynamic suffix.
// The const itself lives in constants/prompts.ts (single home); imported + re-exported
// at the top of this file. The assembler uses it as the boundary marker @580936.

// 2.1.183: isDynamicBoundaryEnabled = Xve @cli_inner_pretty.js:134600-134605
// The boundary (and thus the cacheable-prefix split) is only emitted on
// first-party / Anthropic-AWS hosts that also pass the two feature gates;
// other providers ship the prompt without the split.
function isDynamicBoundaryEnabled(): boolean {
  if (!boundaryFeatureGate()) return false // @134601 $M()
  if (!cachePrefixEnabled()) return false // @134602 Pu()
  const p = providerClass() // @134603 Ir()
  return p === 'firstParty' || p === 'anthropicAws' // @134604
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ §9b  TEAM / OWNERSHIP-FRAME PREDICATE (drives the intro variants)          ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// 2.1.183: isOwnershipFrameEnabled (team intro) = t0o @cli_inner_pretty.js:581260-581266
// Memoized (t0o = wn(...) in the bundle). NEW in 2.1.183: when armed, the lean/full intro
// builders (w_f/y_f) swap to the "You work alongside the user … and own the outcome" wording.
// Default: env CLAUDE_CODE_OWNERSHIP_FRAME, else growthbook tengu_walnut_prism
// (default FALSE @581262 → ownership frame off unless server-enabled).
//
// SINGLE-DEFINITION + NAMING: this is the SAME obf t0o defined and consumed in
// constants/prompts.ts (where getLeanHarnessIntroSection calls it). Reconciled to the one
// canonical readable name `isOwnershipFrameEnabled` and imported/re-exported from there —
// this file previously duplicated it under the divergent name `isOwnershipFrameActive`.
export { isOwnershipFrameEnabled } from '../constants/prompts.js'

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ §12  INVESTIGATE-FIRST MODE RESOLVER (gates the U_f section)               ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// 2.1.183: investigateFirstMode = i0o @cli_inner_pretty.js:581166-581175
// Resolves the investigate-first mode ("off" | "additive" | "compact"). It is
// scoped to claude-opus-4-7 ONLY (@581167); any other model is "off". Order:
//   - non-opus-4-7 model → "off"                                  @581167
//   - env CLAUDE_CODE_INVESTIGATE_FIRST: "additive"/"compact" pass through;
//     truthy → "additive"; "off"/falsy → "off"                    @581169-581171
//   - if the model is lean → "off"                                @581172
//   - else growthbook tengu_slate_harrier (default "off")         @581173-581174
function investigateFirstMode(model: ModelLike | undefined): string {
  if (!model || getModelId(model) !== 'claude-opus-4-7') return 'off' // @581167
  const env = investigateFirstEnv() // process.env.CLAUDE_CODE_INVESTIGATE_FIRST
  if (env === 'additive' || env === 'compact') return env // @581169
  if (envTruthy(env)) return 'additive' // @581170
  if (env === 'off' || envFalsy(env)) return 'off' // @581171
  if (isLeanSystemPrompt(model)) return 'off' // @581172
  const gb = growthbook<string>('tengu_slate_harrier', 'off') // @581173
  return gb === 'additive' || gb === 'compact' ? gb : 'off'
}

// 2.1.183: getModelIds (Fable-5 model-list map) = wPe @cli_inner_pretty.js:581254-581258
// Feeds the NEW model-list env line in the simple/static env blocks.
export const getModelIds = {
  fable: 'claude-fable-5', // @581255
  opus: 'claude-opus-4-8', // @581256
  sonnet: 'claude-sonnet-4-6', // @581257
  haiku: 'claude-haiku-4-5-20251001', // @581258
} as const

// ────────────────────────────────────────────────────────────────────────────
// Section builders (head + gated optional) are reconstructed in detail in
// systemPromptBuilders.ts / systemPromptSections.ts (this file owns the
// assembler, lean gate, merge layer, and the toggle predicates). The signatures
// below are the seams the assembler depends on; their verbatim text and `// @`
// anchors live in the builder file.
//
//   buildLeanHarnessIntro          = w_f  @580861-580881 (lean intro + "# Harness")
//   buildFullIntro                 = y_f  @580712-580718 (intro + cyber-risk + URL rule)
//   buildSystemSection             = __f  @580719-580730 ("# System")
//   buildDoingTasksSection         = b_f  @580731-580763 ("# Doing tasks")
//   buildExecutingActionsSection   = S_f  @580764-580780 ("# Executing actions with care")
//   buildUsingToolsSection         = E_f  @580781-580804 ("# Using your tools")
//   buildToneAndStyleSection       = T_f  @580848-580857 ("# Tone and style")
//   buildAntiVerbositySection      = l_f  @580624-580660 ("# Communicating with the user", rewritten)
//   buildActionCautionSection      = c_f  @580661-580664
//   buildTaskContinuitySection     = u_f  @580665-580669
//   buildInvestigateFirstSection   = U_f  @581176-581178
//   buildSessionGuidanceSection    = v_f  @580811-580847
//   buildMemorySection             = e0t  @— (memory section)
//   buildStaticEnvSection          = P_f  @581041-581055
//   buildSimpleEnvSection          = D_f  @581006-581039 (Fable-5 model-list line @581032)
//   buildLanguageSection           = g_f  @580698-580703
//   buildOutputStyleSection        = h_f  @580704-580708
//   buildBackgroundSessionSection  = R_f  @581114-581134
//   buildScratchpadSection         = HUn  @581135-581155
//   buildBriefSection              = O_f  @581156-581159 (returns s_f when isBriefEnabled)
//   buildFocusModeSection          = F_f  @581160-581165
//   buildHeronBrookSection         = m_f  @580673-580684 (tengu_heron_brook free-text)
//   buildAutonomyAppendSection     = A_f  @580686-580696 (tengu_amber_sextant gate)
//   buildExcludedModeMemorySection = Cgi  @151957-151961
//   buildAttachmentsSection        = zOl  @580941-580947
//   FABLE_IDENTITY                 = d_f  @— (Fable-5/Mythos identity block, NEW)
//   TOOL_PARAM_JSON_SECTION        = p_f  @—
//   CONTEXT_MANAGEMENT_SECTION     = $_f  @581200-581201
//   REPRODUCE_VERIFY_SECTION       = I_f  @—
//   ACT_DONT_REDERIVE_SECTION      = k_f  @—
// ────────────────────────────────────────────────────────────────────────────
declare function buildLeanHarnessIntro(outputStyle: OutputStyle): string
declare function buildFullIntro(outputStyle: OutputStyle): string
declare function buildSystemSection(): string
declare function buildDoingTasksSection(): string
declare function buildExecutingActionsSection(model: ModelLike): string
declare function buildUsingToolsSection(toolSet: Set<string>): string
declare function buildToneAndStyleSection(): string
declare function buildAntiVerbositySection(model: ModelLike): string
declare function buildActionCautionSection(model: ModelLike): string
declare function buildTaskContinuitySection(modelId: string): string
declare function buildInvestigateFirstSection(model: ModelLike): string | null
declare function buildSessionGuidanceSection(
  toolSet: Set<string>,
  outputStyleMeta: unknown,
  lean: boolean,
  excluded: boolean,
): string
declare function buildMemorySection(model: ModelLike): string | null
declare function buildStaticEnvSection(model: ModelLike, excluded: boolean): Promise<string>
declare function buildSimpleEnvSection(
  model: ModelLike,
  excluded: boolean,
  additionalWorkingDirs: string[] | undefined,
): Promise<string>
declare function buildLanguageSection(language: string): string | null
declare function buildOutputStyleSection(outputStyle: OutputStyle): string | null
declare function buildBackgroundSessionSection(): string | null
declare function buildScratchpadSection(): string | null
declare function buildBriefSection(): string | null
declare function buildFocusModeSection(model: ModelLike): string | null
declare function buildHeronBrookSection(): string | null
declare function buildAutonomyAppendSection(modelId: string): string | null
declare function buildExcludedModeMemorySection(model: ModelLike): string
declare function buildAttachmentsSection(model: ModelLike): string
declare const FABLE_IDENTITY: string
declare const TOOL_PARAM_JSON_SECTION: string
declare const CONTEXT_MANAGEMENT_SECTION: string
declare const REPRODUCE_VERIFY_SECTION: string
declare const ACT_DONT_REDERIVE_SECTION: string

// ─── Remaining declared dependencies ────────────────────────────────────────
declare function memoize<F extends (...a: never[]) => unknown>(fn: F): F // wn
declare function isFirstPartyOrGateway(): boolean // pd
declare function clientDataCache(): { simple_system_prompt?: unknown } | undefined // wt().clientDataCache
declare function loadOutputStyle(cwd: string): Promise<[unknown, OutputStyle]> // Promise.all([hv,t5n])
declare function readConfig(): { language: string } // jr
declare function briefEnabled(): boolean // e0o.isBriefEnabled() || Kve()
declare function appVersion(): string // oV
declare function isFableTier(modelId: string): boolean // KAn
declare function isMythosModel(model: ModelLike): boolean // Pq
declare function isAutonomousModel(modelId: string): boolean // GQ
declare function isToolParamJsonForced(): boolean // Gmi
declare function isVerifyPromptArmed(): boolean // C_f (tengu_sparrow_ledger)
declare function isActDontRederiveArmed(): boolean // x_f (tengu_cedar_lantern, default true)
declare function investigateFirstEnv(): string | undefined
declare function boundaryFeatureGate(): boolean // $M
declare function cachePrefixEnabled(): boolean // Pu
declare function providerClass(): string // Ir
declare function requireCoordinatorMode(): { getCoordinatorSystemPrompt: () => string }
declare function sectionCache(): Map<string, unknown> // ayt
declare function cacheSet(name: string, value: unknown): void // drr
