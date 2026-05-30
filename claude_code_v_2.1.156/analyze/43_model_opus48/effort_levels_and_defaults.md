# Effort Levels: xhigh Enum, Opus 4.8 Default high, Capability Gates & the 400-error Fix

> Module: `43_model_opus48` · Build under analysis: Claude Code **v2.1.156**
> (`cli_inner_pretty.js`, `VERSION` confirmed at `cli_inner_pretty.js:568305`, build `2026-05-28T18:30:33Z`).
> Cross-validation baseline: v2.1.88 readable TypeScript at `src/utils/effort.ts`.

## Related Symbols

> Symbol mappings live ONLY in the central index files:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Model/effort symbols go here)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/constants in this document (list format, never a table here):

- `getDefaultEffortForModel` (`q48`) — per-model default effort (Opus 4.8 → high, Opus 4.7 → xhigh) (cli_inner_pretty.js:184987-184991)
- `modelSupportsEffort` (`A2`) — capability gate that decides whether an `effort` param is sent at all (cli_inner_pretty.js:184798-184814)
- `modelSupportsMaxEffort` (`ow$`) — gate for the `max` level (cli_inner_pretty.js:184815-184833)
- `modelSupportsXhighEffort` (`ycH`) — gate for the `xhigh` level (cli_inner_pretty.js:184834-184851)
- `resolveAppliedEffort` (`or`) — the precedence resolver / state machine (cli_inner_pretty.js:184909-184919)
- `isOpusLaunchDefaultActive` (`AkH`) — dual launch latch for 4.7 + 4.8 (cli_inner_pretty.js:184896-184900)
- `unpinOpusLaunchEffortLatch` (`SI`) — releases both launch pins (cli_inner_pretty.js:184902-184908)
- `readEnvEffortLevel` (`zkH`) — `CLAUDE_CODE_EFFORT_LEVEL` override reader (cli_inner_pretty.js:184892-184895)
- `normalizeEffortLabel` (`E1H`) — coerce arbitrary string to a valid level (cli_inner_pretty.js:184960-184963)
- `parseEffortValue` (`vx`) — string/number → effort value (cli_inner_pretty.js:184870-184879)
- `effortValueFromContext` (`e$7`) — CLI/settings/ultracode merge (cli_inner_pretty.js:185012-185017)
- `ultracodeAvailable` (`Vx`) — ultracode/xhigh availability for `/effort` UI (cli_inner_pretty.js:184853-184855)
- `getEffortHelpText` (`eE8`) — `/effort` usage string (cli_inner_pretty.js:526897-526913)
- `parseEffortArg` (`xYz`) — `/effort` argument parser incl. `ultracode`/`auto` (cli_inner_pretty.js:526915-526921)
- `getEffortDescription` (`RL5`) — per-level help blurb (cli_inner_pretty.js:184964-184977)
- `get3PModelCapabilityOverride` (`si`) — env-var capability override, memoized (cli_inner_pretty.js:130257-130275)
- `resolveModelCanonicalId` (`O7`) — normalize a model id to canonical form (cli_inner_pretty.js:98770-98778)
- `normalizeModelIdToCanonical` (`HD`) — substring → canonical id table (cli_inner_pretty.js:98751-98769)
- `OPUS_48_MODEL_CONFIG` (`Xi$`) — Opus 4.8 provider id map (cli_inner_pretty.js:91825-91833)
- `EFFORT_LEVELS_WITH_MAX` (`dN`) — `["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:185009)
- `XHIGH_CAPABILITY_TAG` (`_P6`) — `"Opus 4.8/4.7 only"` (cli_inner_pretty.js:184993)
- `MAX_EFFORT_CAPABILITY_TAG` (`a$7`) — `"Opus 4.6+, Sonnet 4.6"` (cli_inner_pretty.js:184994)
- `isThinkingSignatureError` (`B87`) — 400-error matcher for invalid thinking signatures (cli_inner_pretty.js:186575-186583)
- `isOpus46FastModeOverride` (`ki`) — `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` reader (cli_inner_pretty.js:98240-98242)

---

## TL;DR

Claude Code v2.1.156 ships the maturation of the **effort-level system** alongside the Opus 4.8 model. Four things changed versus the v2.1.88 baseline:

1. **A new top-of-stack `xhigh` level.** The persisted enum is now `["low","medium","high","xhigh"]` (`effortLevel` Zod schema, cli_inner_pretty.js:51690-51691). The *resolvable* set is wider: `EFFORT_LEVELS_WITH_MAX` (`dN`) = `["low","medium","high","xhigh","max"]` (cli_inner_pretty.js:185009). `max` exists but is no longer the persisted user-facing ceiling — `xhigh` is. The 2.1.88 enum was `["low","medium","high","max"]` with **no `xhigh`** (`src/utils/effort.ts:13-18`).

2. **A session-only `ultracode` setting** — `xhigh` effort *plus* standing dynamic-workflow orchestration (cli_inner_pretty.js:51695-51703). It is deliberately non-persisting (delivered via `--settings` / `apply_flag_settings`).

3. **Per-model default convergence on `high`.** `getDefaultEffortForModel` (`q48`, cli_inner_pretty.js:184987-184991) returns `high` for Opus 4.8, `xhigh` for Opus 4.7, and `high` otherwise. The 2.1.88 `getDefaultEffortForModel` returned **`medium`** for Opus 4.6 Pro/Max/Team (`src/utils/effort.ts:307-319`).

4. **The 400-error fix.** The `effort` parameter is now injected into the request only when `modelSupportsEffort` (`A2`) returns true — gated at the call site `...(A2(L) && { effort: { level: Ev(L, w) } })` (cli_inner_pretty.js:568321). Models without an effort param no longer receive one and no longer 400.

`xhigh`, `ultracode`, and the Opus-4.8 launch latch are **NEW post-2.1.88** with no precursor; `A2`/`ow$`/`or` are direct descendants of 2.1.88 `modelSupportsEffort`/`modelSupportsMaxEffort`/`resolveAppliedEffort` (**high confidence** mapping via near-identical structure).

---

## 1. The effort enum, `dN`, and the `ultracode` setting

### 1.1 The persisted enum vs the resolvable set

There are two distinct level lists, and the difference is the whole point.

**Persisted enum** — what a user is allowed to write to `settings.json`:

```javascript
// ============================================
// effortLevel (settings schema) - what may be persisted to settings.json
// Location: cli_inner_pretty.js:51690-51703
// ============================================

// ORIGINAL (for source lookup):
effortLevel: y.enum(["low", "medium", "high", "xhigh"]).optional().catch(void 0)
  .describe("Persisted effort level for supported models."),
ultracode: y.boolean().optional().catch(void 0)
  .describe("Enable ultracode for the session: xhigh effort plus standing dynamic-workflow orchestration. " +
    "Session-scoped — typically provided via --settings or the apply_flag_settings control request; " +
    "interactive toggles never persist it. Requires workflows to be enabled and an xhigh-capable model."),

// READABLE (for understanding):
effortLevel: zod.enum(["low", "medium", "high", "xhigh"]).optional().catch(undefined)
  .describe("Persisted effort level for supported models."),
ultracode: zod.boolean().optional().catch(undefined)   // session-scoped only
  .describe("xhigh effort + standing dynamic-workflow orchestration; never persisted by interactive toggles"),

// Mapping: y→zod, effortLevel→effortLevel, ultracode→ultracode
```

**Resolvable set** — what the runtime resolver and the `/effort` command will accept and clamp against:

```javascript
// ============================================
// EFFORT_LEVELS_WITH_MAX - resolvable set incl. legacy 'max'
// Location: cli_inner_pretty.js:185009-185010
// ============================================

// ORIGINAL (for source lookup):
dN = ["low", "medium", "high", "xhigh", "max"];
s$7 = { med: "medium" };

// READABLE (for understanding):
const EFFORT_LEVELS_WITH_MAX = ["low", "medium", "high", "xhigh", "max"];
const EFFORT_ALIASES = { med: "medium" };   // 'med' is a typed shorthand for 'medium'

// Mapping: dN→EFFORT_LEVELS_WITH_MAX, s$7→EFFORT_ALIASES
```

`isResolvableEffortLevel` (`KkH`, cli_inner_pretty.js:184859-184861) is `dN.includes(H)`, so `max` still validates at runtime even though the persisted schema rejects it. `.catch(void 0)` on the schema means a stale `settings.json` containing `"max"` (legitimately persisted by an older build, or hand-edited) silently degrades to `undefined` instead of throwing — the level is then re-derived from the model default. That is the migration path: the old `max` ceiling decays gracefully.

`parseEffortValue` (`vx`, cli_inner_pretty.js:184870-184879) is the canonical string/number parser: it lowercases, applies the `med→medium` alias, accepts a valid level, then falls back to `parseInt` for ANT-only numeric effort. The 2.1.88 analogue is `parseEffortValue` at `src/utils/effort.ts:71-87` — structurally identical, but the 2.1.88 version had no alias map (`s$7`) and validated against the 4-value `EFFORT_LEVELS`. **High confidence.**

### 1.2 `ultracode`: a session-scoped power level

`ultracode` is not just a fifth label — it is a *bundle*: `xhigh` effort **plus** standing dynamic-workflow orchestration. Three properties make it special:

- **Non-persisting by construction.** `effortValueFromContext` (`e$7`, cli_inner_pretty.js:185012-185017) treats `settings.ultracode === true` as a synonym for `"xhigh"` when resolving the effort value, but the only path that writes it is `apply_flag_settings`/`--settings`. The control-request handler `v8q` (cli_inner_pretty.js:526922-526929) sends `{ effortLevel, ultracode }` to the server transport for remote sessions; there is no interactive toggle that persists it.
- **Gated on workflows + an xhigh-capable model.** Availability is `ultracodeAvailable` (`Vx`, cli_inner_pretty.js:184853-184855): `NZ() && (model === undefined || ycH(model))` — i.e. workflows enabled (`NZ`, cli_inner_pretty.js:184757-184763) AND the model supports xhigh.
- **Reading it releases the latch.** `readUltracodeFlag` (`zP6`, cli_inner_pretty.js:184884-184887) returns `i6().ultracode === true` and, as a side effect, calls `SI()` to unpin the launch latch (see §4). Observing ultracode means the user has explicitly opted into a high level, so the launch-default pin is no longer appropriate.

```javascript
// ============================================
// effortValueFromContext - merge CLI/env/settings into a single effort value
// Location: cli_inner_pretty.js:185012-185017
// ============================================

// ORIGINAL (for source lookup):
function e$7(H) {
  let $ = vx(H.cli.effort);
  if ($ !== void 0) return $;
  if (H.settings.ultracode === !0) return "xhigh";
  return pjH(H.settings.effortLevel);
}

// READABLE (for understanding):
function effortValueFromContext(ctx) {
  const fromCli = parseEffortValue(ctx.cli.effort);
  if (fromCli !== undefined) return fromCli;          // 1. CLI --effort wins
  if (ctx.settings.ultracode === true) return "xhigh";// 2. ultracode == xhigh
  return coerceStringLevel(ctx.settings.effortLevel); // 3. persisted level
}

// Mapping: e$7→effortValueFromContext, vx→parseEffortValue, pjH→coerceStringLevel(only low/medium/high/xhigh)
```

> `coerceStringLevel` (`pjH`, cli_inner_pretty.js:184880-184883) only admits `low|medium|high|xhigh` — notably **not** `max`. So even the context merge cannot resurrect `max` from a persisted level; `max` survives only as a runtime/CLI value that the resolver then clamps.

**This is NEW post-2.1.88** — there is no `ultracode` symbol or session-bundle concept in `src/utils/effort.ts`.

---

## 2. Per-model defaults: `getDefaultEffortForModel` (`q48`)

### 2.1 The 2.1.156 implementation

```javascript
// ============================================
// getDefaultEffortForModel - per-model default effort level
// Location: cli_inner_pretty.js:184987-184991
// ============================================

// ORIGINAL (for source lookup):
function q48(H) {
  if (O7(H) === "claude-opus-4-8") return "high";
  if (O7(H) === "claude-opus-4-7") return "xhigh";
  return "high";
}

// READABLE (for understanding):
function getDefaultEffortForModel(model) {
  const canonical = resolveModelCanonicalId(model);
  if (canonical === "claude-opus-4-8") return "high";  // 4.8 default = high
  if (canonical === "claude-opus-4-7") return "xhigh"; // 4.7 launched at xhigh
  return "high";                                        // everything else → high
}

// Mapping: q48→getDefaultEffortForModel, O7→resolveModelCanonicalId, H→model
```

The canonicalizer `resolveModelCanonicalId` (`O7`, cli_inner_pretty.js:98770-98778) routes through provider-prefix stripping and `application-inference-profile` ARN resolution, then delegates to `normalizeModelIdToCanonical` (`HD`, cli_inner_pretty.js:98751-98769), a substring table that maps e.g. `us.anthropic.claude-opus-4-8` → `claude-opus-4-8`. So `q48` works identically across all seven providers in `OPUS_48_MODEL_CONFIG` (`Xi$`, cli_inner_pretty.js:91825-91833).

### 2.2 Contrast with 2.1.88

```typescript
// 2.1.88 — src/utils/effort.ts:307-328 (readable original)
// Default effort on Opus 4.6 to medium for Pro.
if (model.toLowerCase().includes('opus-4-6')) {
  if (isProSubscriber()) return 'medium'
  if (getOpusDefaultEffortConfig().enabled && (isMaxSubscriber() || isTeamSubscriber()))
    return 'medium'
}
if (isUltrathinkEnabled() && modelSupportsEffort(model)) return 'medium'
return undefined   // → resolves to 'high' at the API
```

Two structural differences:

1. **Subscriber-tier branching is gone.** 2.1.88 returned `medium` for Opus 4.6 *only for Pro/Max/Team subscribers*, gated behind the `tengu_grey_step2` GrowthBook config (`getOpusDefaultEffortConfig`, `src/utils/effort.ts:267-276`). 2.1.156's `q48` is a flat per-model switch with no subscriber check, no GrowthBook lookup, and no ultrathink coupling. The "we recommend medium effort for Opus" dialog config has been dropped entirely.
2. **The default floor rose from `medium`→`high`.** In 2.1.88, "no opinion" meant `undefined` (which the API treats as `high`) but Opus 4.6 actively defaulted *down* to `medium`. In 2.1.156 the explicit defaults are `high`/`xhigh` and the fallthrough is an explicit `"high"` string — Opus models now think *more* by default, not less.

**Confidence: high.** Both are clearly the same function role (`getDefaultEffortForModel`, same name in 2.1.88), and the design intent (per-model default policy) is unchanged; only the policy values and the gating moved.

**Why the change?** Opus 4.8/4.7 are positioned as frontier reasoning models where the cost of under-thinking (a wrong answer the user must re-prompt) outweighs the latency/rate-limit cost of the default reasoning budget. The 2.1.88 `medium` default was a rate-limit-preservation hedge for the 4.6 generation; with 4.8 the product decision flipped to "smart by default," and the slider was re-labeled accordingly (Faster/Smarter, §6).

---

## 3. Capability gates: `A2` / `ow$` / `ycH`

These three predicates answer "does *this model* accept *this effort tier*?" They share a fixed precedence: **(a) 3P env override → (b) hard deny-list → (c) `CLAUDE_CODE_ALWAYS_ENABLE_EFFORT` (A2 only) → (d) allow-list → (e) provider default.**

### 3.1 `modelSupportsEffort` (`A2`) — the gate that prevents 400s

```javascript
// ============================================
// modelSupportsEffort - does the model accept ANY effort param?
// Location: cli_inner_pretty.js:184798-184814
// ============================================

// ORIGINAL (for source lookup):
function A2(H) {
  let $ = si(H, "effort");
  if ($ !== void 0) return $;
  let q = O7(H);
  if (q.includes("claude-3-") || q === "claude-opus-4-0" || q === "claude-opus-4-1" ||
      q === "claude-sonnet-4-0" || q === "claude-sonnet-4-5" || q === "claude-haiku-4-5")
    return !1;
  if (xH(process.env.CLAUDE_CODE_ALWAYS_ENABLE_EFFORT)) return !0;
  if (q === "claude-opus-4-8" || q === "claude-opus-4-7" || q === "claude-opus-4-6" || q === "claude-sonnet-4-6")
    return !0;
  return oR(ew(H));
}

// READABLE (for understanding):
function modelSupportsEffort(model) {
  const override3P = get3PModelCapabilityOverride(model, "effort");
  if (override3P !== undefined) return override3P;          // (a) explicit env override
  const canonical = resolveModelCanonicalId(model);
  if (canonical.includes("claude-3-") ||                    // (b) hard deny-list:
      canonical === "claude-opus-4-0" || canonical === "claude-opus-4-1" ||
      canonical === "claude-sonnet-4-0" || canonical === "claude-sonnet-4-5" ||
      canonical === "claude-haiku-4-5")
    return false;
  if (isEnvTruthy(process.env.CLAUDE_CODE_ALWAYS_ENABLE_EFFORT)) return true; // (c) force-on
  if (canonical === "claude-opus-4-8" || canonical === "claude-opus-4-7" ||
      canonical === "claude-opus-4-6" || canonical === "claude-sonnet-4-6")
    return true;                                            // (d) allow-list
  return providerDefaultsEffortOn(effectiveProvider(model));// (e) provider default
}

// Mapping: A2→modelSupportsEffort, si→get3PModelCapabilityOverride, O7→resolveModelCanonicalId,
//          xH→isEnvTruthy, oR→providerDefaultsEffortOn, ew→effectiveProvider
```

The 3P override `si` (cli_inner_pretty.js:130257-130275) reads `ANTHROPIC_*_MODEL_SUPPORTED_CAPABILITIES` env pairs and returns a boolean only when the model string matches a custom-model env var. It returns `undefined` for first-party (the `if (UA()) return;` guard at 130259), which is why the rest of the gate ever runs for 1P models. This is the deobfuscated `get3PModelCapabilityOverride` from 2.1.88 (`src/utils/model/modelSupportOverrides.ts:30`). **High confidence.**

The provider default `providerDefaultsEffortOn` (`oR`, cli_inner_pretty.js:91894-91896) is true for `firstParty | anthropicAws | foundry | mantle`. In 2.1.88 the equivalent fallback was simply `getAPIProvider() === 'firstParty'` (`src/utils/effort.ts:48`) — 2.1.156 broadened the "unknown 1P-ish model defaults to effort-on" set to four direct providers (a consequence of the foundry/mantle/anthropicAws providers being added since 2.1.88).

### 3.2 `ow$` (max) and `ycH` (xhigh)

`modelSupportsMaxEffort` (`ow$`, cli_inner_pretty.js:184815-184833) and `modelSupportsXhighEffort` (`ycH`, cli_inner_pretty.js:184834-184851) follow the same skeleton with different allow-lists:

| Tier | Allow-list (canonical id) | Deny-list highlights |
|------|---------------------------|----------------------|
| `effort` (A2) | 4-8, 4-7, 4-6, sonnet-4-6 | claude-3-*, opus-4-0/4-1, sonnet-4-0/4-5, haiku-4-5 |
| `max_effort` (ow$) | 4-8, 4-7, 4-6, sonnet-4-6 | adds opus-4-5 to deny-list |
| `xhigh_effort` (ycH) | **4-8, 4-7 only** | denies 4-6, sonnet-4-6, opus-4-5 explicitly |

> The table above describes runtime behavior; it is **not** a symbol mapping table.

The crucial distinction: **`xhigh` is Opus-4.8/4.7-exclusive** (`ycH` allow-list is just those two, cli_inner_pretty.js:184850), which is exactly what the help-text tag `_P6 = "Opus 4.8/4.7 only"` (cli_inner_pretty.js:184993) advertises. `max` is the *older* generation's ceiling — `a$7 = "Opus 4.6+, Sonnet 4.6"` (cli_inner_pretty.js:184994). Both gates also honor the 3P override first via `si(H, "max_effort")` / `si(H, "xhigh_effort")`.

**2.1.88 had `modelSupportsMaxEffort` only** (`src/utils/effort.ts:53-65`) — its allow-list was a single `opus-4-6` substring plus the ANT branch. `modelSupportsXhighEffort` is **entirely NEW**.

```javascript
// ============================================
// modelSupportsXhighEffort - xhigh is Opus 4.8/4.7 exclusive
// Location: cli_inner_pretty.js:184834-184851
// ============================================

// ORIGINAL (for source lookup):
function ycH(H) {
  let $ = si(H, "xhigh_effort");
  if ($ !== void 0) return $;
  let q = O7(H);
  if (q.includes("claude-3-") || q === "claude-opus-4-0" || q === "claude-opus-4-1" ||
      q === "claude-opus-4-5" || q === "claude-opus-4-6" || q === "claude-sonnet-4-0" ||
      q === "claude-sonnet-4-5" || q === "claude-sonnet-4-6" || q === "claude-haiku-4-5")
    return !1;
  if (q === "claude-opus-4-8" || q === "claude-opus-4-7") return !0;
  return oR(ew(H));
}

// READABLE (for understanding):
function modelSupportsXhighEffort(model) {
  const override3P = get3PModelCapabilityOverride(model, "xhigh_effort");
  if (override3P !== undefined) return override3P;
  const canonical = resolveModelCanonicalId(model);
  if (/* every pre-4.7 Opus, all Sonnet incl 4.6, all Haiku, all claude-3 */ isPreXhighModel(canonical))
    return false;
  if (canonical === "claude-opus-4-8" || canonical === "claude-opus-4-7") return true;
  return providerDefaultsEffortOn(effectiveProvider(model)); // unknown 1P-ish → allow
}

// Mapping: ycH→modelSupportsXhighEffort, si→get3PModelCapabilityOverride, O7→resolveModelCanonicalId
```

**Why a separate allow-list per tier instead of one capability flag?** The API enforces tier availability *server-side* — sending `max` to a non-4.6 model, or `xhigh` to a 4.6 model, returns an error. The client mirrors the server's matrix so it can (a) silently clamp before the request (§4) and (b) hide unavailable options in `/effort` UI. A single boolean could not express "supports effort but not xhigh."

---

## 4. The resolver `or` and the dual launch latch `AkH`/`SI`

This is the heart of the system: the function that decides what effort value (if any) is actually applied, and the launch-pin state machine that pins new-model defaults until the user expresses a preference.

### 4.1 The launch latch — why it exists

When a new Opus ships, Anthropic wants it to *launch at its intended default effort* even for users who never touch `/effort`, and even though those users might have an old persisted `effortLevel` from the previous model. But once the user demonstrates a choice, the pin must release so it follows their preference forever after.

This is implemented as **two boolean flags in global config**, defaulting to `false` (i.e. "still pinned"):

```javascript
// ============================================
// Launch-latch defaults - both pins start engaged (false = not yet unpinned)
// Location: cli_inner_pretty.js:142374-142375
// ============================================

// ORIGINAL (for source lookup):
unpinOpus47LaunchEffort: !1,
unpinOpus48LaunchEffort: !1,

// READABLE (for understanding):
unpinOpus47LaunchEffort: false,   // false → 4.7 still pinned to its launch default
unpinOpus48LaunchEffort: false,   // false → 4.8 still pinned to its launch default

// Mapping: !1→false
```

`isOpusLaunchDefaultActive` (`AkH`) reads them through the global config getter `b$()`:

```javascript
// ============================================
// isOpusLaunchDefaultActive - is the per-model launch pin still engaged?
// Location: cli_inner_pretty.js:184896-184900
// ============================================

// ORIGINAL (for source lookup):
function AkH(H) {
  let $ = O7(H);
  if ($.includes("opus-4-7")) return !b$().unpinOpus47LaunchEffort;
  if ($.includes("opus-4-8")) return !b$().unpinOpus48LaunchEffort;
  return !1;
}

// READABLE (for understanding):
function isOpusLaunchDefaultActive(model) {
  const canonical = resolveModelCanonicalId(model);
  if (canonical.includes("opus-4-7")) return !globalConfig().unpinOpus47LaunchEffort;
  if (canonical.includes("opus-4-8")) return !globalConfig().unpinOpus48LaunchEffort;
  return false;  // every other model: no launch pin
}

// Mapping: AkH→isOpusLaunchDefaultActive, O7→resolveModelCanonicalId, b$→globalConfig
```

`unpinOpusLaunchEffortLatch` (`SI`) releases **both pins at once** through the locked config writer `O8` (cli_inner_pretty.js:142430), short-circuiting if already released:

```javascript
// ============================================
// unpinOpusLaunchEffortLatch - release BOTH 4.7 and 4.8 launch pins together
// Location: cli_inner_pretty.js:184902-184908
// ============================================

// ORIGINAL (for source lookup):
function SI() {
  O8((H) =>
    H.unpinOpus47LaunchEffort && H.unpinOpus48LaunchEffort
      ? H
      : { ...H, unpinOpus47LaunchEffort: !0, unpinOpus48LaunchEffort: !0 },
  );
}

// READABLE (for understanding):
function unpinOpusLaunchEffortLatch() {
  updateGlobalConfig((cfg) =>
    cfg.unpinOpus47LaunchEffort && cfg.unpinOpus48LaunchEffort
      ? cfg                                   // already released — no write
      : { ...cfg, unpinOpus47LaunchEffort: true, unpinOpus48LaunchEffort: true });
}

// Mapping: SI→unpinOpusLaunchEffortLatch, O8→updateGlobalConfig, !0→true
```

**Why unpin both at once rather than per-model?** A user who explicitly sets an effort level has expressed a *global* preference about how Claude Code should think — it would be confusing if switching from 4.8 back to 4.7 silently re-pinned 4.7 to its launch default after the user had already overridden 4.8. The single `SI()` call (invoked from the `/effort` write path `sw$` cli_inner_pretty.js:184931-184939, from the CLI override `AP6` cli_inner_pretty.js:184940-184943, and from `readUltracodeFlag` `zP6`) treats any deliberate effort interaction as "the user owns the wheel now," for every pinned model.

### 4.2 The resolver `resolveAppliedEffort` (`or`)

```javascript
// ============================================
// resolveAppliedEffort - decide the effort value actually applied to a request
// Location: cli_inner_pretty.js:184909-184919
// ============================================

// ORIGINAL (for source lookup):
function or(H, $) {
  if (!A2(H)) return;
  let q = AkH(H), K = q48(H), _ = zkH();
  if (_ === null) return q ? K : void 0;
  let z = _ ?? (q ? K : void 0) ?? $ ?? K;
  if (z === "max" && !ow$(H)) return "high";
  if (z === "xhigh" && !ycH(H)) return "high";
  return z;
}

// READABLE (for understanding):
function resolveAppliedEffort(model, appStateEffortValue) {
  if (!modelSupportsEffort(model)) return undefined;          // model has no effort param at all
  const launchPinned   = isOpusLaunchDefaultActive(model);    // pin still engaged?
  const modelDefault   = getDefaultEffortForModel(model);     // q48: high / xhigh / high
  const envOverride    = readEnvEffortLevel();                // CLAUDE_CODE_EFFORT_LEVEL

  if (envOverride === null) {                                 // env explicitly 'unset'/'auto'
    return launchPinned ? modelDefault : undefined;           //   pinned models still honor launch default
  }

  // precedence: env  >  (launch default if pinned)  >  app-state  >  model default
  let resolved = envOverride
              ?? (launchPinned ? modelDefault : undefined)
              ?? appStateEffortValue
              ?? modelDefault;

  if (resolved === "max"   && !modelSupportsMaxEffort(model))   return "high"; // silent downgrade
  if (resolved === "xhigh" && !modelSupportsXhighEffort(model)) return "high"; // silent downgrade
  return resolved;
}

// Mapping: or→resolveAppliedEffort, A2→modelSupportsEffort, AkH→isOpusLaunchDefaultActive,
//          q48→getDefaultEffortForModel, zkH→readEnvEffortLevel, ow$→modelSupportsMaxEffort,
//          ycH→modelSupportsXhighEffort, H→model, $→appStateEffortValue
```

**Step-by-step walkthrough:**

1. **Gate first.** If `modelSupportsEffort` is false, return `undefined` — no effort param will be built (and the call site at 568321 won't inject one). This single early-return is the structural foundation of the 400-error fix.
2. **Gather inputs.** Launch-pin state (`AkH`), model default (`q48`), env override (`zkH`).
3. **Env `unset`/`auto` special case.** When `readEnvEffortLevel` returns `null` (env was literally `"unset"` or `"auto"`, cli_inner_pretty.js:184892-184895), the user has asked for "no opinion." But if the model is still launch-pinned, the *launch default* is what "no opinion" means — so return `modelDefault` for pinned models, `undefined` otherwise. **This is the latch's whole purpose: a pinned 4.8 still launches at `high` even when the user has zeroed out their env preference.**
4. **The precedence chain.** `env ?? (pinned ? default : undefined) ?? appState ?? default`. The launch default sits *above* app-state when pinned: a freshly-launched model ignores carried-over session/app-state effort until the user unpins. Once unpinned, that middle term is `undefined` and app-state takes over — the resolution collapses to the familiar `env ?? appState ?? default`.
5. **Silent downgrades.** If the resolved level is `max` on a model that doesn't support `max`, or `xhigh` on a non-xhigh model, it is **clamped to `high`** rather than erroring. This mirrors the server matrix and means a user who had `xhigh` set for Opus 4.8 and then switches to Sonnet 4.6 silently gets `high` instead of a 400.

**Contrast with 2.1.88 `resolveAppliedEffort`** (`src/utils/effort.ts:152-167`):

```typescript
// 2.1.88 — no launch pin, no xhigh clamp
const resolved = envOverride ?? appStateEffortValue ?? getDefaultEffortForModel(model)
if (resolved === 'max' && !modelSupportsMaxEffort(model)) return 'high'
return resolved
```

The 2.1.88 chain is `env ?? appState ?? default` with **only the `max→high` clamp**. v2.1.156 adds (1) the launch-pin term injected between env and app-state, and (2) the `xhigh→high` clamp. **High confidence** the mapping is correct — the `max→high` clamp line is byte-for-byte equivalent; the additions are the launch latch and xhigh handling, both NEW.

```
resolveAppliedEffort(model, appState) state machine
────────────────────────────────────────────────────
                 A2(model)?
                 ┌── no ──► undefined  (NO effort param → fixes 400s)
                 │
                 yes
                 │
        zkH() (env) === null ?
        ┌── yes ──► pinned(AkH)? ── yes ──► q48(model)   [launch default]
        │                        └─ no  ──► undefined
        no
        │
   resolved = env ?? (pinned? q48 : undef) ?? appState ?? q48
        │
   resolved == "max" && !ow$ ?  ── yes ──► "high"
        │ no
   resolved == "xhigh" && !ycH ? ── yes ──► "high"
        │ no
        └──────────────────────────────► resolved
```

### 4.3 Display vs applied: `Ev` and `q0`

Two thin wrappers convert the resolver output for two consumers:

- `getDisplayedEffortLevel` (`Ev`, cli_inner_pretty.js:184944-184947): `normalizeEffortLabel(or(model, app) ?? "high")` — the *displayed* level, with the `high` fallback (what the API uses when no param is sent). Single source of truth for the status bar and `/effort` output.
- `getAppliedEffortForRequest` (`q0`, cli_inner_pretty.js:184948-184950): `A2(model) ? Ev(model, app) : undefined` — gates the displayed level behind the capability check again, so a model with no effort support shows nothing.

`normalizeEffortLabel` (`E1H`, cli_inner_pretty.js:184960-184963) coerces any non-`dN` string to `"high"` — the same defensive coercion as 2.1.88 `convertEffortValueToLevel` (`src/utils/effort.ts:202-216`) for the string branch (the ANT numeric→band mapping is handled elsewhere in 2.1.156).

---

## 5. The 400-error fix: A2-gated effort injection

### 5.1 The fix

In the request/telemetry payload builder, the effort block is now spread conditionally:

```javascript
// ============================================
// Effort param injection - gated on A2() so non-effort models get no effort field
// Location: cli_inner_pretty.js:568318-568322
// ============================================

// ORIGINAL (for source lookup):
context_window: S2z(Z, W),
exceeds_200k_tokens: $,
fast_mode: q,
...(A2(L) && { effort: { level: Ev(L, w) } }),
thinking: { enabled: D !== !1 },

// READABLE (for understanding):
context_window: getContextWindowInfo(messages, model),
exceeds_200k_tokens: exceeds200k,
fast_mode: fastMode,
...(modelSupportsEffort(model) && { effort: { level: getDisplayedEffortLevel(model, appEffort) } }),
thinking: { enabled: thinkingMode !== false },

// Mapping: A2→modelSupportsEffort, Ev→getDisplayedEffortLevel, L→model, w→appEffort
```

**Why this fixes 400s:** `Ev`/`or` can produce a defined level only on effort-capable models, but the *object spread* `...(A2(L) && {...})` is the belt-and-suspenders guarantee — when `A2(L)` is false the entire `effort` key is absent from the payload, not present-with-undefined. An effort-incapable model (e.g. Sonnet 4.5, Haiku 4.5, any `claude-3-*`) therefore never sees an `effort` field, which is exactly what the API requires; sending `effort` to a model that does not declare it returns HTTP 400.

The same `A2`-gating pattern guards effort telemetry: the metrics dimension object spreads `...(_ && { effort: _ })` (cli_inner_pretty.js:239889) and the agent-config loader spreads `...(b !== void 0 && { effort: b })` (cli_inner_pretty.js:235491) — effort never leaks into payloads where it doesn't belong.

### 5.2 Why it matters in 2.1.156 specifically

The 4.8 launch widened the matrix of models a single session can switch between (4.8 / 4.7 / 4.6 / Sonnet 4.6 / Haiku, and 3P). Once `q48` started returning a *concrete* default (`high`) rather than `undefined`, the risk of accidentally constructing an `effort` block for a model that can't take one rose sharply — a user toggling to a non-effort model would otherwise carry an effort level into the request. Gating the spread on `A2` at every injection site is the systematic defense. This is the realization of the 2.1.88 comment's intent (`// API rejects 'max' on non-Opus-4.6 models`) generalized to *all* effort params, not just `max`.

---

## 6. `/effort` UI: help text, env override, and the Faster/Smarter relabel

### 6.1 Help text and argument parsing

```javascript
// ============================================
// getEffortHelpText - /effort usage string, ultracode conditional on Vx()
// Location: cli_inner_pretty.js:526897-526913
// ============================================

// ORIGINAL (for source lookup):
function eE8() {
  return (`Usage: /effort [low|medium|high|xhigh|max${Vx() ? "|ultracode" : ""}|auto]

Effort levels:
- low: Quick, straightforward implementation
- medium: Balanced approach with standard testing
- high: Comprehensive implementation with extensive testing
- xhigh: Extended reasoning with thorough analysis (${_P6})
- max: Maximum capability with deepest reasoning (${a$7})
` +
    (Vx() ? `- ultracode: xhigh + dynamic workflow orchestration (this session only)\n` : "") +
    "- auto: Use the default effort level for your model");
}

// READABLE (for understanding):
function getEffortHelpText() {
  const ultracodeOpt = ultracodeAvailable() ? "|ultracode" : "";   // only when workflows+xhigh model
  return `Usage: /effort [low|medium|high|xhigh|max${ultracodeOpt}|auto]
... xhigh: Extended reasoning ... (Opus 4.8/4.7 only)
... max: Maximum capability ... (Opus 4.6+, Sonnet 4.6)
` + (ultracodeAvailable() ? "- ultracode: xhigh + dynamic workflow orchestration (this session only)\n" : "")
    + "- auto: Use the default effort level for your model";
}

// Mapping: eE8→getEffortHelpText, Vx→ultracodeAvailable, _P6→"Opus 4.8/4.7 only", a$7→"Opus 4.6+, Sonnet 4.6"
```

The `ultracode` option appears only when `ultracodeAvailable` (`Vx`) is true — workflows enabled *and* an xhigh-capable model. So a user on Sonnet 4.6 sees `max` (4.6+ supports it) but not `xhigh` capability advertised as theirs, and never sees `ultracode`.

`parseEffortArg` (`xYz`, cli_inner_pretty.js:526915-526921) maps `/effort` input to a value: `auto`/`unset` → `{value: undefined}` (use the model default), `ultracode` → `{value: "xhigh"}` *only when `Vx()`*, otherwise it runs the strict parser `_kH` (cli_inner_pretty.js:184865-184868, which validates against `dN` after alias resolution). An unrecognized argument returns `null` (rejected).

### 6.2 Env override `CLAUDE_CODE_EFFORT_LEVEL` (`zkH`)

```javascript
// ============================================
// readEnvEffortLevel - CLAUDE_CODE_EFFORT_LEVEL override, with unset/auto → null
// Location: cli_inner_pretty.js:184892-184895
// ============================================

// ORIGINAL (for source lookup):
function zkH() {
  let H = process.env.CLAUDE_CODE_EFFORT_LEVEL;
  return H?.toLowerCase() === "unset" || H?.toLowerCase() === "auto" ? null : vx(H);
}

// READABLE (for understanding):
function readEnvEffortLevel() {
  const raw = process.env.CLAUDE_CODE_EFFORT_LEVEL;
  if (raw?.toLowerCase() === "unset" || raw?.toLowerCase() === "auto") return null; // explicit "no env opinion"
  return parseEffortValue(raw);  // undefined if unset/garbage, else a level/number
}

// Mapping: zkH→readEnvEffortLevel, vx→parseEffortValue
```

Note the three-state return: `null` ("auto"/"unset", a deliberate signal handled specially in `or`), a parsed value, or `undefined` (env not set / unparseable). The tri-state is what lets `resolveAppliedEffort` distinguish "user explicitly asked for no override" (`null`, still honors launch default) from "env irrelevant" (`undefined`, falls through to app-state). This matches 2.1.88 `getEffortEnvOverride` (`src/utils/effort.ts:136-142`) exactly. **High confidence.**

### 6.3 The slider relabel: Speed/Intelligence → Faster/Smarter

The effort slider's end labels were re-worded:

```javascript
// ============================================
// Effort slider end labels - "Faster"/"Smarter" (was "Speed"/"Intelligence")
// Location: cli_inner_pretty.js:527377-527383
// ============================================

// ORIGINAL (for source lookup):
W ? Kq.createElement(kF, { text: `${c}Faster${b}Smarter${r}`, col: -l, row: sYz, ripple: W })
  : Kq.createElement(Kq.Fragment, null,
      Kq.createElement(k, null, "Faster"),
      Kq.createElement(k, null, b),
      Kq.createElement(k, null, "Smarter"));

// READABLE (for understanding):
withRipple
  ? <UltraRippleText text={`${left}Faster${mid}Smarter${right}`} ... />
  : <><Text>Faster</Text><Text>{separator}</Text><Text>Smarter</Text></>;

// Mapping: kF→UltraRippleText, W→withRipple, "Faster"/"Smarter"→slider end labels
```

The `low` end is "Faster", the `xhigh`/`max` end is "Smarter". This is a consumer-facing reframing aligned with the default-effort shift (§2): the product no longer frames higher effort as a raw-compute "Intelligence" dial but as a Faster↔Smarter trade-off, with `high` now the *default* (not a power-user setting).

The per-level descriptions feed the slider tooltip via `getEffortDescription` (`RL5`, cli_inner_pretty.js:184964-184977) — note its `xhigh` blurb interpolates `_P6` ("Deeper reasoning than high, just below maximum (Opus 4.8/4.7 only)") and `getEffortDescriptionWithBurnHint` (`YP6`, cli_inner_pretty.js:184978-184986) appends a "burns fastest — medium handles most tasks" hint when the user is on `high` and the `tengu_slate_finch` gate is on.

---

## 7. Bonus: the 2.1.156 thinking-signature hotfix (adjacent to effort)

Opus 4.8's higher default effort produces more (and longer) thinking blocks; if any thinking-block signature is modified in transit/replay, the API rejects the request with a 400. 2.1.156 adds a dedicated matcher and a strip-and-retry path. This is **NEW in 2.1.156** (no 2.1.88 precursor).

```javascript
// ============================================
// isThinkingSignatureError - 400 matcher for modified/invalid thinking signatures
// Location: cli_inner_pretty.js:186575-186583
// ============================================

// ORIGINAL (for source lookup):
function B87(H) {
  if (!(H instanceof rq) || H.status !== 400) return !1;
  let $ = H.message.toLowerCase();
  if ($.includes("signature in thinking block")) return !0;
  return (
    ($.includes("thinking block") || $.includes("`thinking`") || $.includes("redacted_thinking")) &&
    ($.includes("cannot be modified") || $.includes("invalid signature"))
  );
}

// READABLE (for understanding):
function isThinkingSignatureError(error) {
  if (!(error instanceof APIError) || error.status !== 400) return false;
  const msg = error.message.toLowerCase();
  if (msg.includes("signature in thinking block")) return true;
  return (
    (msg.includes("thinking block") || msg.includes("`thinking`") || msg.includes("redacted_thinking")) &&
    (msg.includes("cannot be modified") || msg.includes("invalid signature"))
  );
}

// Mapping: B87→isThinkingSignatureError, rq→APIError, H→error, $→msg
```

The retry driver (cli_inner_pretty.js:557413-557427): when `isThinkingSignatureError` matches, it runs `stripSignedThinkingBlocks` (`cG4`) over the message buffer; if that changed the buffer it swaps it in, logs a warning, emits `tengu_thinking_signature_strip_retry`, and returns `"retry:thinking-signature-strip"` to re-issue the request without the offending signed blocks. A sibling matcher `matchThinkingTypeError` (`p87`, cli_inner_pretty.js:186584-186590) handles `thinking.type` enabled/adaptive mismatches via a separate `retry:thinking-type` path (557400-557410).

---

## 8. End-to-end example

User on Opus 4.8, fresh install (both launch pins `false` → engaged), no env var, no `/effort` ever run:

```
or("claude-opus-4-8", appState=undefined)
  A2 → true (4.8 in allow-list)
  AkH → !false = true  (4.8 still pinned)
  q48 → "high"
  zkH → undefined      (env not set)
  env !== null, so: resolved = undefined ?? ("high" because pinned) = "high"
  "high" not max, not xhigh → return "high"
→ request gets { effort: { level: "high" } }   (via 568321, A2 true)
```

Now the user runs `/effort medium`. The write path `sw$` persists `effortLevel:"medium"` and calls `SI()`, flipping both pins to `true`:

```
or("claude-opus-4-8", appState="medium")
  AkH → !true = false  (now unpinned)
  resolved = undefined(env) ?? undefined(unpinned) ?? "medium"(appState) ?? "high"
           = "medium"
→ request gets { effort: { level: "medium" } }
```

The launch default no longer overrides the user — exactly the intended latch behavior. Switch to Sonnet 4.5 (no effort support): `A2 → false`, so `or` returns `undefined` and the `effort` key is omitted entirely — no 400.

---

## Cross-validation summary (vs v2.1.88 `src/utils/effort.ts`)

| Concept | 2.1.88 | 2.1.156 | Confidence |
|---------|--------|---------|------------|
| Persisted enum | `low/medium/high/max` (`:13-18`) | `low/medium/high/xhigh` + resolvable `+max` (`:51690`, `:185009`) | high |
| `modelSupportsEffort` | `A2`-equivalent, 4-6/sonnet-4-6 allow (`:23-49`) | broadened allow-list + 4 providers (`:184798`) | high |
| `modelSupportsMaxEffort` | exists (`:53-65`) | exists, allow 4-8/4-7/4-6/sonnet-4-6 (`:184815`) | high |
| `modelSupportsXhighEffort` | — | NEW, 4-8/4-7 only (`:184834`) | NEW |
| `getDefaultEffortForModel` | 4-6 Pro/Max→`medium` (`:279-329`) | 4-8→`high`, 4-7→`xhigh` (`:184987`) | high |
| `resolveAppliedEffort` | `env??app??default`, max→high (`:152-167`) | + launch-pin term, + xhigh→high (`:184909`) | high |
| Launch latch (`AkH`/`SI`) | — | NEW dual pin (`:184896`, `:184902`) | NEW |
| `ultracode` | — | NEW session bundle (`:51695`) | NEW |
| env override (`zkH`) | `getEffortEnvOverride` (`:136-142`) | identical tri-state (`:184892`) | high |
| A2-gated injection | comment-only intent (`:162`) | enforced at all sites (`:568321`) | high |

> The table above is a cross-version behavior comparison, not a symbol-mapping table; all symbol mappings live in `../00_overview/symbol_index_infra_platform.md`.

**Net:** the effort system evolved from a 4-level, medium-defaulting, single-clamp design into a 5-level (xhigh-topped, max-legacy) system with a per-model launch latch, a session-only `ultracode` power mode, dual silent downgrades, and systematic capability gating that eliminates the 400 errors caused by sending an effort param to a model that doesn't accept one.
