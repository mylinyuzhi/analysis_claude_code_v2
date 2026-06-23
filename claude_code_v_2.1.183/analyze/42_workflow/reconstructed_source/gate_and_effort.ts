/**
 * gate_and_effort.ts — Workflow enablement gate (4 layers) + ultracode effort resolution.
 *
 * This is a *readable-source-level* restoration of the v2.1.183 Dynamic-Workflow control
 * plane that decides (a) whether the Workflow tool / `/workflows` command / coordinator
 * clause / keyword reminder are visible at all (the 4-layer gate), and (b) what reasoning
 * effort the model runs at, including the `xhigh` level that `ultracode` requires.
 *
 * ── Evidence tiers ────────────────────────────────────────────────────────────────────
 *
 * PRIMARY (truth, every line below was read here):
 *   /lyz/codespace/claude-code-bomb/versions/2.1.183/extract/cli_inner_pretty.js
 *     Gate chain   : cli_inner_pretty.js:148777-148818  (Kyn/Pw/eNr/Xyn/Jyn/aAi/EJu/tNr/HJu)
 *     Effort family: cli_inner_pretty.js:148828-148977  (Mw/TBe/hTe/T4/eZ/rB/yTe/nNr/CBe/IBe/u2/ZQ)
 *     Effort consts: cli_inner_pretty.js:149015-149071  (lAi/Mme/e_n/eP/uAi)
 *     Capability override memo (WQ): cli_inner_pretty.js:134301-134319
 *     Boolean env helpers: st@163, yl@169 ; gate ct@146595 ; policy di@147998 ;
 *     managed settings mk@2090 ; session settings jr@57903 ; tier sa@135866 ;
 *     model-id Bo@102895 ; provider lO@95235 / _y@95220.
 *
 * 2.1.88 CONVENTION MIRROR (shape only — Workflow stripped behind feature('WORKFLOW_SCRIPTS')):
 *   /lyz/codespace/3rd/claude-code/src/utils/effort.ts
 *     — modelSupportsEffort / modelSupportsMaxEffort / parseEffortValue / resolveAppliedEffort /
 *       convertEffortValueToLevel / getDefaultEffortForModel / getEffortEnvOverride layout & names.
 *   /lyz/codespace/3rd/claude-code/src/utils/model/modelSupportOverrides.ts
 *     — get3PModelCapabilityOverride(model, capability) is the readable shape of obf `WQ`.
 *   The 'xhigh'/'max' levels, the ultracode gate, and the workflow gate are all NEW post-2.1.88
 *   (no implementation in the named tree — only the per-capability-override scaffold above).
 *
 * 2.1.156 SCAFFOLD (readable logic + established names; re-verified line-by-line in 183):
 *   /lyz/codespace/analysis_claude_code_v2/claude_code_v_2.1.156/analyze/42_workflow/
 *     gate_caps_lifecycle_relations.md — Part 1 (enablement gate), Part 6 (ultracode/effort).
 *
 * ── Cross-validation note ─────────────────────────────────────────────────────────────
 * Re-verified against the 183 bundle: the 4-layer gate order is byte-identical to 2.1.156
 * (`NZ`→`Pw`), only obf names re-mangled; `defaultOn = tier !== "pro"` confirmed at 148817;
 * the `/effort ultracode` xhigh gate `T4` (= `isWorkflowsEnabled() && (model === undefined ||
 * supportsXhighEffort(model))`) is PRE-EXISTING (v2.1.156 `Vx`), NOT a 156→183 source delta —
 * it is reconstructed here as it actually is. `nNr` (isUltracodeOn) reads `jr().ultracode`
 * (session settings), not a separate store, and side-effects by unpinning the launch effort.
 * The xhigh-capable model set drifted between `Mw`/`TBe`/`hTe` (e.g. opus-4-5/4-6 excluded from
 * xhigh) — each list transcribed verbatim from the 183 lines, not assumed.
 *
 * English only. Obfuscated single-letter locals are renamed to intent; per-function Mapping
 * comments record the obf→readable mapping so a reviewer can re-verify against the bundle.
 */

// ── Imports (named-tree shapes; the obf bundle inlines these as module-init bindings) ──
import {
  parseBooleanEnv,    // st  @cli_inner_pretty.js:163  — truthy env parse ("1"/"true"/"yes"/"on")
  parseFalseEnv,      // yl  @cli_inner_pretty.js:169  — explicitly-false env parse ("0"/"false"/"no"/"off")
} from "./envUtils.js";
import { checkGate } from "./statsig.js";                 // ct  @cli_inner_pretty.js:146595 — Statsig gate w/ default
import { isPolicyCapabilityAllowed } from "./permissions.js"; // di  @cli_inner_pretty.js:147998 — managed/policy capability gate
import { getManagedSettings } from "./settings.js";       // mk  @cli_inner_pretty.js:2090   — merged managed-settings cache
import { getSessionSettings } from "./sessionSettings.js"; // jr  @cli_inner_pretty.js:57903  — gq().settings (session-scoped)
import { getSubscriptionTier } from "./auth.js";          // sa  @cli_inner_pretty.js:135866 — "pro" | "max" | "team" | ...
import { getCanonicalModelId } from "./model/model.js";   // Bo  @cli_inner_pretty.js:102895 — resolve alias → canonical id
import { isFirstPartyLikeProvider } from "./model/providers.js"; // lO @cli_inner_pretty.js:95235 — provider ∈ {1P, aws, foundry, mantle}
import { resolveEffectiveProvider } from "./model/providers.js"; // _y @cli_inner_pretty.js:95220 — provider after model overrides
import { get3PModelCapabilityOverride } from "./model/modelSupportOverrides.js"; // WQ @cli_inner_pretty.js:134301
import { unpinLaunchEffort } from "./launchEffort.js";    // u2  @cli_inner_pretty.js:148960 — release the opus/fable launch latch
import { isLaunchEffortPinned } from "./launchEffort.js"; // IBe @cli_inner_pretty.js:148949 — model is still launch-pinned

// ───────────────────────────────────────────────────────────────────────────────────────
//                         PART 1 — THE 4-LAYER ENABLEMENT GATE
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * Layer 1 — managed/enterprise hard-off. Wins over everything downstream.
 * Either the env kill-switch CLAUDE_CODE_DISABLE_WORKFLOWS is truthy, or managed settings
 * pin `disableWorkflows: true`.
 *
 * 2.1.88 convention: this kind of "managed disable" predicate lives beside the feature; the
 *   feature itself is stripped behind feature('WORKFLOW_SCRIPTS') in the named tree.
 * 2.1.156 scaffold: gate_caps_lifecycle_relations.md Part 1.1 (was `H48`).
 */
// 2.1.183: isWorkflowsManagedDisabled = Kyn @cli_inner_pretty.js:148777
export function isWorkflowsManagedDisabled(): boolean {
  return (
    parseBooleanEnv(process.env.CLAUDE_CODE_DISABLE_WORKFLOWS) ||           // @148778
    getManagedSettings()?.settings.disableWorkflows === true               // @148778
  );
}
// Mapping: Kyn→isWorkflowsManagedDisabled, st→parseBooleanEnv, mk→getManagedSettings

/**
 * Layer 2 — org/policy capability gate. The server- (or policy-) controlled `allow_workflows`
 * capability. If the org isn't entitled, the feature is invisible.
 *
 * 2.1.156 scaffold: Part 1.1 (was `r$7`, then `k7("allow_workflows")`).
 */
// 2.1.183: isWorkflowsPolicyAllowed = aAi @cli_inner_pretty.js:148800
export function isWorkflowsPolicyAllowed(): boolean {
  return isPolicyCapabilityAllowed("allow_workflows");                      // @148801
}
// Mapping: aAi→isWorkflowsPolicyAllowed, di→isPolicyCapabilityAllowed

/**
 * Layer 3 source — availability resolver: computes { available, defaultOn } from the env opt,
 * the `tengu_workflows_enabled` Statsig gate, and the subscription tier. Four branches:
 *   1. CLAUDE_CODE_WORKFLOWS truthy  → both fields = gate value (env forces intent but still
 *      defers to the org gate kill-switch).
 *   2. CLAUDE_CODE_WORKFLOWS explicitly false → { false, false } (hard local opt-out).
 *   3. env unset + gate off          → { false, false }.
 *   4. env unset + gate on           → { available: true, defaultOn: tier !== "pro" }.
 *      The GA path: available to everyone with the gate; Pro defaults OFF, all other tiers ON.
 *
 * 2.1.156 scaffold: Part 1.2 (was `SL5`).
 */
// 2.1.183: resolveWorkflowAvailability = HJu @cli_inner_pretty.js:148810
export function resolveWorkflowAvailability(): { available: boolean; defaultOn: boolean } {
  if (parseBooleanEnv(process.env.CLAUDE_CODE_WORKFLOWS)) {                 // @148811
    const gateOn = checkGate("tengu_workflows_enabled", true);             // @148812
    return { available: gateOn, defaultOn: gateOn };                       // @148813
  }
  if (parseFalseEnv(process.env.CLAUDE_CODE_WORKFLOWS)) {                   // @148815
    return { available: false, defaultOn: false };
  }
  if (!checkGate("tengu_workflows_enabled", true)) {                       // @148816
    return { available: false, defaultOn: false };
  }
  // GA: on by default for every tier except Pro.                            @148817
  return { available: true, defaultOn: getSubscriptionTier() !== "pro" };
}
// Mapping: HJu→resolveWorkflowAvailability, st→parseBooleanEnv, yl→parseFalseEnv,
//          ct→checkGate, sa→getSubscriptionTier

/**
 * Layer 3 cache — memoizes resolveWorkflowAvailability() once per process into module-level
 * `availabilityCache`. Env vars, the Statsig gate, and the tier don't change mid-session, so
 * this makes the availability decision stable (and cheap, since isWorkflowsEnabled() runs on
 * every turn for the keyword reminder / input highlight). Trade-off: a mid-session gate flip
 * won't take effect until restart — acceptable for a launch-time entitlement.
 *
 * 2.1.156 scaffold: Part 1.2 (was `KP6`, cached into `$48`).
 */
// 2.1.183: resolveWorkflowAvailabilityCached = tNr @cli_inner_pretty.js:148806  (cache var Yyn @148819)
let availabilityCache: { available: boolean; defaultOn: boolean } | undefined; // Yyn @148819
export function resolveWorkflowAvailabilityCached(): { available: boolean; defaultOn: boolean } {
  if (availabilityCache !== undefined) return availabilityCache;           // @148807
  return (availabilityCache = resolveWorkflowAvailability());              // @148808
}
// Mapping: tNr→resolveWorkflowAvailabilityCached, Yyn→availabilityCache, HJu→resolveWorkflowAvailability

/**
 * Layer 4 — the user's explicit `enableWorkflows` setting (the "Dynamic workflows" toggle).
 * `undefined` when unset, so isWorkflowsEnabled() falls back to the tier-derived default via `??`.
 *
 * 2.1.156 scaffold: Part 1.1/1.2 (was `hL5`).
 */
// 2.1.183: getUserWorkflowSetting = EJu @cli_inner_pretty.js:148803
export function getUserWorkflowSetting(): boolean | undefined {
  return getManagedSettings()?.settings.enableWorkflows;                   // @148804
}
// Mapping: EJu→getUserWorkflowSetting, mk→getManagedSettings

/** Convenience reader: the tier-derived default-on flag (`resolveWorkflowAvailabilityCached().defaultOn`). */
// 2.1.183: getWorkflowDefaultOn = eNr @cli_inner_pretty.js:148791
export function getWorkflowDefaultOn(): boolean {
  return resolveWorkflowAvailabilityCached().defaultOn;                    // @148792
}
// Mapping: eNr→getWorkflowDefaultOn

/**
 * THE MASTER SWITCH — the single predicate every workflow surface keys off (tool `isEnabled`,
 * `/workflows` command `isEnabled`, the keyword reminder, the input highlighter, and the
 * coordinator's Workflow clause). It is a precedence ladder, evaluated most-authoritative first:
 *
 *   1. managed hard-off  → false (enterprise kill-switch wins over everything)
 *   2. org gate off      → false (org not entitled)
 *   3. unavailable       → false (env/gate/tier says no)
 *   4. user setting ?? defaultOn  → the user's explicit toggle, else the tier default.
 *
 * Splitting these four into independent predicates means a higher layer can never be silently
 * overridden by a lower one. The `?? defaultOn` is the key UX nuance: a Pro user gets workflows
 * *available but off by default*; everyone else gets them *on by default* — and either can flip
 * it explicitly via `enableWorkflows`.
 *
 * 2.1.156 scaffold: Part 1.1 (was `NZ`).
 */
// 2.1.183: isWorkflowsEnabled = Pw @cli_inner_pretty.js:148784
export function isWorkflowsEnabled(): boolean {
  if (isWorkflowsManagedDisabled()) return false;                          // @148785  Kyn()
  if (!isWorkflowsPolicyAllowed()) return false;                           // @148786  aAi()
  const { available, defaultOn } = resolveWorkflowAvailabilityCached();    // @148787  tNr()
  if (!available) return false;                                            // @148788
  return getUserWorkflowSetting() ?? defaultOn;                            // @148789  EJu() ?? defaultOn
}
// Mapping: Pw→isWorkflowsEnabled, Kyn→isWorkflowsManagedDisabled, aAi→isWorkflowsPolicyAllowed,
//          tNr→resolveWorkflowAvailabilityCached, EJu→getUserWorkflowSetting

/**
 * Variant availability predicate used by surfaces that want "the org/env permit it AND it is
 * generally available", *without* applying the user's enableWorkflows toggle or the managed
 * `disableWorkflows` flag. Note it checks the env kill-switch (CLAUDE_CODE_DISABLE_WORKFLOWS)
 * directly but NOT managed settings, and uses the *uncached* availability resolver via
 * resolveWorkflowAvailabilityCached().available.
 *
 * 2.1.183: this is the obf `Xyn` (no established 2.1.156 readable name in the scaffold — see
 * manifest "newSymbols"). Reconstructed exactly from the source.
 */
// 2.1.183: isWorkflowsAvailableIgnoringUserSetting = Xyn @cli_inner_pretty.js:148794
export function isWorkflowsAvailableIgnoringUserSetting(): boolean {
  return (
    isWorkflowsPolicyAllowed() &&                                          // @148795  aAi()
    !parseBooleanEnv(process.env.CLAUDE_CODE_DISABLE_WORKFLOWS) &&         // @148795
    resolveWorkflowAvailabilityCached().available                         // @148795  tNr().available
  );
}
// Mapping: Xyn→isWorkflowsAvailableIgnoringUserSetting, aAi→isWorkflowsPolicyAllowed,
//          st→parseBooleanEnv, tNr→resolveWorkflowAvailabilityCached

/**
 * NEW in v2.1.183 — gates the workflow-keyword reminder AND the input-box highlight. The setting
 * `workflowKeywordTriggerEnabled` is a new `/config` toggle; default ON when unset. (No v2.1.156
 * ancestor — grep count 0 in 2.1.156.) Project canonical name `isUltracodeKeywordTriggerEnabled`,
 * though the underlying setting key is `workflowKeywordTriggerEnabled`.
 *
 * 2.1.183 source: cli_inner_pretty.js:148797-148799.
 */
// 2.1.183: isUltracodeKeywordTriggerEnabled = Jyn @cli_inner_pretty.js:148797
export function isUltracodeKeywordTriggerEnabled(): boolean {
  return getManagedSettings()?.settings.workflowKeywordTriggerEnabled ?? true; // @148798
}
// Mapping: Jyn→isUltracodeKeywordTriggerEnabled, mk→getManagedSettings

// ───────────────────────────────────────────────────────────────────────────────────────
//                  PART 2 — EFFORT CAPABILITY PROBES (per model)
// ───────────────────────────────────────────────────────────────────────────────────────
//
// Each probe answers "does this model support the {effort | max | xhigh} parameter?" The shape
// is identical across all three (2.1.88 `modelSupportsEffort` / `modelSupportsMaxEffort` shape):
//   1. honor an explicit 3P capability override (env-pinned model + capabilities list) if present;
//   2. hard-exclude a known legacy/unsupported model set;
//   3. (effort only) honor CLAUDE_CODE_ALWAYS_ENABLE_EFFORT;
//   4. hard-include the current supported model set;
//   5. default to whether the *effective* provider is first-party-like.
//
// The included/excluded model lists below are transcribed VERBATIM from the 183 lines — they
// differ between the three probes (e.g. opus-4-5/4-6/sonnet-4-6 are xhigh-excluded but effort-
// included), so do not assume one list from another.

/**
 * Whether the model accepts an `effort` parameter at all.
 * 2.1.88 convention: modelSupportsEffort (utils/effort.ts:23).
 */
// 2.1.183: modelSupportsEffort = Mw @cli_inner_pretty.js:148828
export function modelSupportsEffort(model: string): boolean {
  const override = get3PModelCapabilityOverride(model, "effort");          // @148829  WQ(model,"effort")
  if (override !== undefined) return override;                             // @148830
  const id = getCanonicalModelId(model);                                   // @148831  Bo(model)
  if (                                                                     // @148832-148839  legacy → no
    id.includes("claude-3-") ||
    id === "claude-opus-4-0" ||
    id === "claude-opus-4-1" ||
    id === "claude-sonnet-4-0" ||
    id === "claude-sonnet-4-5" ||
    id === "claude-haiku-4-5"
  ) {
    return false;
  }
  if (parseBooleanEnv(process.env.CLAUDE_CODE_ALWAYS_ENABLE_EFFORT)) return true; // @148841
  if (                                                                     // @148842-148849  supported → yes
    id === "claude-fable-5" ||
    id === "claude-mythos-5" ||
    id === "claude-opus-4-8" ||
    id === "claude-opus-4-7" ||
    id === "claude-opus-4-6" ||
    id === "claude-sonnet-4-6"
  ) {
    return true;
  }
  // Unknown id → supported only on first-party-like providers.              @148851
  return isFirstPartyLikeProvider(resolveEffectiveProvider(model));
}
// Mapping: Mw→modelSupportsEffort, WQ→get3PModelCapabilityOverride, Bo→getCanonicalModelId,
//          st→parseBooleanEnv, _y→resolveEffectiveProvider, lO→isFirstPartyLikeProvider

/**
 * Whether the model accepts the `max` effort level (the highest, "deepest reasoning").
 * 2.1.88 convention: modelSupportsMaxEffort (utils/effort.ts:53).
 */
// 2.1.183: modelSupportsMaxEffort = TBe @cli_inner_pretty.js:148853
export function modelSupportsMaxEffort(model: string): boolean {
  const override = get3PModelCapabilityOverride(model, "max_effort");      // @148854  WQ(model,"max_effort")
  if (override !== undefined) return override;                             // @148855
  const id = getCanonicalModelId(model);                                   // @148856
  if (                                                                     // @148857-148864  excluded (note: opus-4-5 here, NOT in effort list)
    id.includes("claude-3-") ||
    id === "claude-opus-4-0" ||
    id === "claude-opus-4-1" ||
    id === "claude-opus-4-5" ||
    id === "claude-sonnet-4-0" ||
    id === "claude-sonnet-4-5" ||
    id === "claude-haiku-4-5"
  ) {
    return false;
  }
  if (                                                                     // @148867-148874  supported
    id === "claude-fable-5" ||
    id === "claude-mythos-5" ||
    id === "claude-opus-4-8" ||
    id === "claude-opus-4-7" ||
    id === "claude-opus-4-6" ||
    id === "claude-sonnet-4-6"
  ) {
    return true;
  }
  return isFirstPartyLikeProvider(resolveEffectiveProvider(model));        // @148876
}
// Mapping: TBe→modelSupportsMaxEffort, WQ→get3PModelCapabilityOverride, Bo→getCanonicalModelId,
//          _y→resolveEffectiveProvider, lO→isFirstPartyLikeProvider

/**
 * Whether the model supports the `xhigh` effort level — the one `ultracode` requires. The
 * supported set is the *narrowest* of the three: only Fable 5 / Mythos 5 / Opus 4.8 / Opus 4.7.
 * Notably opus-4-5, opus-4-6, sonnet-4-6 are xhigh-EXCLUDED even though effort-included.
 *
 * 2.1.156 scaffold: Part 6.2 (was `ycH`). Project canonical name `supportsXhighEffort`.
 * 2.1.88 convention: no `xhigh` in the named tree — this level/probe is NEW post-2.1.88.
 */
// 2.1.183: supportsXhighEffort = hTe @cli_inner_pretty.js:148878
export function supportsXhighEffort(model: string): boolean {
  const override = get3PModelCapabilityOverride(model, "xhigh_effort");    // @148879  WQ(model,"xhigh_effort")
  if (override !== undefined) return override;                             // @148880
  const id = getCanonicalModelId(model);                                   // @148881
  if (                                                                     // @148882-148892  xhigh-excluded set
    id.includes("claude-3-") ||
    id === "claude-opus-4-0" ||
    id === "claude-opus-4-1" ||
    id === "claude-opus-4-5" ||
    id === "claude-opus-4-6" ||
    id === "claude-sonnet-4-0" ||
    id === "claude-sonnet-4-5" ||
    id === "claude-sonnet-4-6" ||
    id === "claude-haiku-4-5"
  ) {
    return false;
  }
  if (                                                                     // @148894  only these 4 support xhigh
    id === "claude-fable-5" ||
    id === "claude-mythos-5" ||
    id === "claude-opus-4-8" ||
    id === "claude-opus-4-7"
  ) {
    return true;
  }
  return isFirstPartyLikeProvider(resolveEffectiveProvider(model));        // @148896
}
// Mapping: hTe→supportsXhighEffort, WQ→get3PModelCapabilityOverride, Bo→getCanonicalModelId,
//          _y→resolveEffectiveProvider, lO→isFirstPartyLikeProvider

// ───────────────────────────────────────────────────────────────────────────────────────
//                  PART 3 — EFFORT NORMALIZATION & THE LEVEL TABLE
// ───────────────────────────────────────────────────────────────────────────────────────

/** All effort levels, low→high. (`max` is the persisted ceiling; `xhigh` sits just below it.) */
// 2.1.183: EFFORT_LEVELS = eP @cli_inner_pretty.js:149051,149070
export const EFFORT_LEVELS = ["low", "medium", "high", "xhigh", "max"] as const; // @149070
export type EffortLevel = (typeof EFFORT_LEVELS)[number];
export type EffortValue = EffortLevel | number;

/** Effort alias map — only `med` → `medium` in this build. */
// 2.1.183: EFFORT_ALIASES = uAi @cli_inner_pretty.js:149056,149071
const EFFORT_ALIASES: Record<string, string> = { med: "medium" };        // @149071

/** True when `value` is one of the known string levels. */
// 2.1.183: isEffortLevel = wBe @cli_inner_pretty.js:148904
export function isEffortLevel(value: string): value is EffortLevel {
  return (EFFORT_LEVELS as readonly string[]).includes(value);            // @148905
}
// Mapping: wBe→isEffortLevel, eP→EFFORT_LEVELS

/** Numeric efforts are valid only when integers (model-default / ANT numeric scale). */
// 2.1.183: isValidNumericEffort = lAi @cli_inner_pretty.js:149015
export function isValidNumericEffort(value: number): boolean {
  return Number.isInteger(value);                                         // @149016
}
// Mapping: lAi→isValidNumericEffort

/**
 * Normalize an arbitrary effort input (CLI flag, env, settings, per-call `agent()` opt) into a
 * canonical EffortValue, or `undefined` when it can't be parsed. Alias-maps, accepts known string
 * levels, then accepts integer-parseable numbers. Project canonical name `normalizeEffort`.
 *
 * NEW use in 183: read by the per-call `agent({ effort })` opt at cli_inner_pretty.js:417123.
 *
 * 2.1.88 convention: parseEffortValue (utils/effort.ts:71).
 */
// 2.1.183: normalizeEffort = rB @cli_inner_pretty.js:148923
export function normalizeEffort(value: unknown): EffortValue | undefined {
  if (value === undefined || value === null || value === "") return undefined; // @148924
  if (typeof value === "number" && isValidNumericEffort(value)) return value;  // @148925
  const lowered = String(value).toLowerCase();                            // @148926
  const aliased = EFFORT_ALIASES[lowered] ?? lowered;                     // @148927
  if (isEffortLevel(aliased)) return aliased;                            // @148928
  const numeric = parseInt(lowered, 10);                                  // @148929
  if (!isNaN(numeric) && isValidNumericEffort(numeric)) return numeric;   // @148930
  return undefined;                                                       // @148931
}
// Mapping: rB→normalizeEffort, uAi→EFFORT_ALIASES, wBe→isEffortLevel, lAi→isValidNumericEffort

/**
 * Coerce an arbitrary EffortValue to a string level for display, defaulting unknowns to "high".
 * 2.1.88 convention: convertEffortValueToLevel (utils/effort.ts:202).
 */
// 2.1.183: convertEffortValueToLevel = Mme @cli_inner_pretty.js:149018
export function convertEffortValueToLevel(value: EffortValue): EffortLevel {
  if (typeof value === "string") return isEffortLevel(value) ? value : "high"; // @149019
  return "high";                                                          // @149020
}
// Mapping: Mme→convertEffortValueToLevel, wBe→isEffortLevel
// NOTE: the v2.1.88 named tree has an extra USER_TYPE==="ant" numeric→level branch (utils/effort.ts:209-214);
//       it is ABSENT from the 183 obf `Mme` (149018-149021 is the whole function), so it is omitted here.

/**
 * Narrow an arbitrary value to a persistable string level (low/medium/high/xhigh), else undefined.
 * Used at settings write-sites so a numeric / unknown effort never reaches the Zod schema.
 * 2.1.88 analogue: toPersistableEffort (utils/effort.ts:95) — but the 183 list is the four
 * string levels, not low/medium/high + ant-max.
 */
// 2.1.183: toPersistableEffortLevel = yTe @cli_inner_pretty.js:148933
export function toPersistableEffortLevel(value: unknown): EffortLevel | undefined {
  if (value === "low" || value === "medium" || value === "high" || value === "xhigh") { // @148934
    return value;
  }
  return undefined;                                                       // @148935
}
// Mapping: yTe→toPersistableEffortLevel

/** Per-model default effort: Fable 5 / Opus 4.8 → "high", Opus 4.7 → "xhigh", else "high". */
// 2.1.183: getDefaultEffortForModel = e_n @cli_inner_pretty.js:149045
export function getDefaultEffortForModel(model: string): EffortLevel {
  if (getCanonicalModelId(model) === "claude-fable-5") return "high";     // @149046
  if (getCanonicalModelId(model) === "claude-opus-4-8") return "high";    // @149047
  if (getCanonicalModelId(model) === "claude-opus-4-7") return "xhigh";   // @149048
  return "high";                                                          // @149049
}
// Mapping: e_n→getDefaultEffortForModel, Bo→getCanonicalModelId

/**
 * Env override for effort. CLAUDE_CODE_EFFORT_LEVEL = "unset"/"auto" → null (suppress effort
 * entirely); otherwise normalize the value; absent → undefined.
 * 2.1.88 convention: getEffortEnvOverride (utils/effort.ts:136).
 */
// 2.1.183: getEffortEnvOverride = CBe @cli_inner_pretty.js:148945
export function getEffortEnvOverride(): EffortValue | null | undefined {
  const raw = process.env.CLAUDE_CODE_EFFORT_LEVEL;                       // @148946
  return raw?.toLowerCase() === "unset" || raw?.toLowerCase() === "auto"  // @148947
    ? null
    : normalizeEffort(raw);
}
// Mapping: CBe→getEffortEnvOverride, rB→normalizeEffort

// ───────────────────────────────────────────────────────────────────────────────────────
//                  PART 4 — EFFORT RESOLUTION (the chain + xhigh/max clamps)
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * Resolve the effort value that will actually be sent to the API for `model`, following the full
 * precedence chain and clamping levels the model can't do.
 *
 *   - If the model supports no effort at all → undefined (no effort param sent).
 *   - launchPinned = the model is launch-effort-pinned (e.g. opus-4-7/4-8/fable launch latch).
 *     The launch default for a pinned model is getDefaultEffortForModel(model).
 *   - env override null ("unset"/"auto") → return the launch default if pinned, else undefined.
 *   - else pick: envOverride ?? (launchPinned ? launchDefault : undefined) ?? appStateEffort ?? launchDefault.
 *   - "max" on a non-max model  → "high".
 *   - "xhigh" on a non-xhigh model → "high".
 *
 * Project canonical name `resolveEffort`. 2.1.156 scaffold: Part 6.2 (was `or`).
 * 2.1.88 convention: resolveAppliedEffort (utils/effort.ts:152) — same chain shape, plus the
 *   183 launch-pin branch and the extra xhigh clamp (no xhigh in 2.1.88).
 */
// 2.1.183: resolveEffort = ZQ @cli_inner_pretty.js:148967
export function resolveEffort(
  model: string,
  appStateEffort: EffortValue | undefined,
): EffortValue | undefined {
  if (!modelSupportsEffort(model)) return undefined;                      // @148968  Mw(model)
  const launchPinned = isLaunchEffortPinned(model);                       // @148969  IBe(model)
  const launchDefault = getDefaultEffortForModel(model);                  // @148970  e_n(model)
  const envOverride = getEffortEnvOverride();                             // @148971  CBe()
  if (envOverride === null) return launchPinned ? launchDefault : undefined; // @148972
  let resolved =                                                          // @148973
    envOverride ?? (launchPinned ? launchDefault : undefined) ?? appStateEffort ?? launchDefault;
  if (resolved === "max" && !modelSupportsMaxEffort(model)) return "high";   // @148974  TBe(model)
  if (resolved === "xhigh" && !supportsXhighEffort(model)) return "high";    // @148975  hTe(model)
  return resolved;                                                        // @148976
}
// Mapping: ZQ→resolveEffort, Mw→modelSupportsEffort, IBe→isLaunchEffortPinned,
//          e_n→getDefaultEffortForModel, CBe→getEffortEnvOverride, TBe→modelSupportsMaxEffort,
//          hTe→supportsXhighEffort

// ───────────────────────────────────────────────────────────────────────────────────────
//                  PART 5 — ULTRACODE (standing orchestration) GATES
// ───────────────────────────────────────────────────────────────────────────────────────

/**
 * Read the session `ultracode` flag. SIDE-EFFECT: when on, it unpins the launch effort (releases
 * the opus-4-7/4-8/fable launch latch) because ultracode forces xhigh and the launch pin would
 * otherwise hold a lower level. `jr()` (getSessionSettings) is the session-settings object.
 *
 * Project canonical name `isUltracodeOn`. 2.1.156 scaffold: Part 6.1 (was `zP6`).
 */
// 2.1.183: isUltracodeOn = nNr @cli_inner_pretty.js:148937
export function isUltracodeOn(_model?: string): boolean {
  const on = getSessionSettings().ultracode === true || false;           // @148938  jr().ultracode === true
  if (on) unpinLaunchEffort();                                           // @148939  u2()
  return on;                                                             // @148940
}
// Mapping: nNr→isUltracodeOn, jr→getSessionSettings, u2→unpinLaunchEffort
// NOTE: the `e` parameter exists in the obf signature (nNr(e)) but is UNUSED in the body
//       (148937-148941) — kept as `_model` for fidelity; see manifest "unverified".

/**
 * The `/effort ultracode` option gate — whether the "ultracode" effort option may be offered for
 * `model`. True iff workflows are enabled AND (no model given OR the model supports xhigh).
 *
 * FRAMING TRAP: this is PRE-EXISTING (v2.1.156 `Vx` = `NZ() && (H === undefined || ycH(H))`), NOT a
 * 156→183 source delta — reconstructed here exactly as it is. Project canonical name
 * `isUltracodeOption`.
 */
// 2.1.183: isUltracodeOption = T4 @cli_inner_pretty.js:148898
export function isUltracodeOption(model?: string): boolean {
  return isWorkflowsEnabled() && (model === undefined || supportsXhighEffort(model)); // @148899
}
// Mapping: T4→isUltracodeOption, Pw→isWorkflowsEnabled, hTe→supportsXhighEffort

/**
 * Detect the ultracode condition for a turn: the caller passed the "ultracode requested" flag
 * (`n === true`), workflows are enabled, AND the resolved effort for the model is "xhigh". Used
 * e.g. to short-circuit the one-time workflow usage-warning consent prompt (ultracode already
 * implies consent).
 *
 * Project canonical name `isWorkflowKeywordOrUltracodeEffort`. 2.1.156 scaffold: Part 6.2 (was `ar`).
 */
// 2.1.183: isWorkflowKeywordOrUltracodeEffort = eZ @cli_inner_pretty.js:148901
export function isWorkflowKeywordOrUltracodeEffort(
  model: string,
  appStateEffort: EffortValue | undefined,
  ultracodeRequested: boolean,
): boolean {
  return (                                                                // @148902
    ultracodeRequested === true &&
    isWorkflowsEnabled() &&
    resolveEffort(model, appStateEffort) === "xhigh"
  );
}
// Mapping: eZ→isWorkflowKeywordOrUltracodeEffort, Pw→isWorkflowsEnabled, ZQ→resolveEffort
//          (params: e→model, t→appStateEffort, n→ultracodeRequested)
