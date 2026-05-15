# `xhigh` Effort Level (v2.1.111)

## What changed

v2.1.111 inserted a new effort tier — `xhigh` — between `high` and `max`,
gated to **Opus 4.7 only**. Every other model silently downgrades to
`high` when `xhigh` is requested. On the first launch of an Opus 4.7
session, the default effort is automatically `xhigh` (instead of `high`),
but a one-shot **`unpinOpus47LaunchEffort` latch** ensures any user-driven
effort change permanently disables the auto-default for future sessions.

## Source: v2.1.88 baseline

`src/utils/effort.ts` (lines 13–18, 53–65):

```typescript
export const EFFORT_LEVELS = [
  'low',
  'medium',
  'high',
  'max',
] as const satisfies readonly EffortLevel[]

// @[MODEL LAUNCH]: Add the new model to the allowlist if it supports 'max' effort.
// Per API docs, 'max' is Opus 4.6 only for public models — other models return an error.
export function modelSupportsMaxEffort(model: string): boolean {
  const supported3P = get3PModelCapabilityOverride(model, 'max_effort')
  if (supported3P !== undefined) {
    return supported3P
  }
  if (model.toLowerCase().includes('opus-4-6')) {
    return true
  }
  if (process.env.USER_TYPE === 'ant' && resolveAntModel(model)) {
    return true
  }
  return false
}
```

In v2.1.88: 4 levels, no `xhigh`, no Opus 4.7 awareness. `max` was
allowlisted to Opus 4.6 + ant-only resolutions.

## Source: v2.1.112 obfuscated chunks

### EFFORT_LEVELS constant

```javascript
// ============================================
// EFFORT_LEVELS - five-tier scalar
// Location: chunks.80.mjs:2835
// ============================================

// ORIGINAL (for source lookup):
UI = ["low", "medium", "high", "xhigh", "max"];

// READABLE (for understanding):
const EFFORT_LEVELS = ["low", "medium", "high", "xhigh", "max"];

// Mapping: UI→EFFORT_LEVELS
```

### modelSupportsXhigh — the new gate

```javascript
// ============================================
// modelSupportsXhigh - Opus 4.7-only gate for xhigh
// Location: chunks.80.mjs:2708-2712
// ============================================

// ORIGINAL (for source lookup):
function bt6(q) {
    let K = $a(q, "xhigh_effort");
    if (K !== void 0) return K;
    return o5(q).includes("opus-4-7")
}

// READABLE (for understanding):
function modelSupportsXhigh(model) {
  // First-party only honors `xhigh_effort` for opus-4-7. Third-party adapters
  // (Bedrock, Vertex, Foundry) may declare support via capability override
  // (e.g. `caps["effort"]["xhigh"]["supported"] = true` in modelSupportOverrides).
  const overrideValue = get3PModelCapabilityOverride(model, "xhigh_effort");
  if (overrideValue !== undefined) return overrideValue;
  return resolveModelId(model).includes("opus-4-7");
}

// Mapping: bt6→modelSupportsXhigh, $a→get3PModelCapabilityOverride, o5→resolveModelId
```

### resolveAppliedEffort — the downgrade path

```javascript
// ============================================
// resolveAppliedEffort - env→state→default precedence, max/xhigh downgrade
// Location: chunks.80.mjs:2746-2755
// ============================================

// ORIGINAL (for source lookup):
function wy6(q, K) {
    let _ = o5(q).includes("opus-4-7") && !H8().unpinOpus47LaunchEffort,
        z = IF1(q),
        Y = Zj6();
    if (Y === null) return _ ? z : void 0;
    let A = Y ?? (_ ? z : void 0) ?? K ?? z;
    if (A === "max" && !Ct6(q)) return "high";
    if (A === "xhigh" && !bt6(q)) return "high";
    return A
}

// READABLE (for understanding):
function resolveAppliedEffort(model, appStateEffortValue) {
  // The "Opus 4.7 launch default" only applies until the user has explicitly
  // changed effort once (the unpinOpus47LaunchEffort flag latches on first change).
  const isOpus47Default = resolveModelId(model).includes("opus-4-7")
                          && !getAppConfig().unpinOpus47LaunchEffort;
  const modelDefault = getDefaultEffortForModel(model);
  const envOverride = readEnvEffortLevel();

  // CLAUDE_CODE_EFFORT_LEVEL=auto/unset → skip effort param entirely
  // (but still honor the Opus 4.7 launch default if not yet unpinned).
  if (envOverride === null) {
    return isOpus47Default ? modelDefault : undefined;
  }

  // Precedence: env → opus47-launch-default → appState → model-default.
  const resolved = envOverride
                 ?? (isOpus47Default ? modelDefault : undefined)
                 ?? appStateEffortValue
                 ?? modelDefault;

  // API rejects `max` on non-opus-4-6/4-7 models — silent downgrade to `high`.
  if (resolved === "max" && !modelSupportsMaxEffort(model)) return "high";
  // xhigh only ever lands on Opus 4.7. Anything else gets `high` instead.
  if (resolved === "xhigh" && !modelSupportsXhigh(model)) return "high";

  return resolved;
}

// Mapping: wy6→resolveAppliedEffort, o5→resolveModelId,
//          H8→getAppConfig, IF1→getDefaultEffortForModel,
//          Zj6→readEnvEffortLevel, Ct6→modelSupportsMaxEffort, bt6→modelSupportsXhigh
```

### getDefaultEffortForModel — Opus 4.7 → xhigh

```javascript
// ============================================
// getDefaultEffortForModel - per-model auto-default
// Location: chunks.80.mjs:2811-2819
// ============================================

// ORIGINAL (for source lookup):
function IF1(q) {
    let K = o5(q);
    if (K.includes("opus-4-7")) return "xhigh";
    if (K.includes("opus-4-6")) {
        if (JB() || ch()) return "medium"
    }
    if (Ps() && (JB() || ch())) return "medium";
    return "high"
}

// READABLE (for understanding):
function getDefaultEffortForModel(model) {
  const id = resolveModelId(model);
  // Opus 4.7 ships defaulting to xhigh — its `high` is too cheap for the
  // model's reasoning capability. The unpin latch in resolveAppliedEffort
  // releases this default once the user makes their first explicit choice.
  if (id.includes("opus-4-7")) return "xhigh";

  // Opus 4.6 Pro/Max defaults to medium (cost-balance for subscription tiers).
  if (id.includes("opus-4-6") && (isProPlan() || isMaxPlan())) return "medium";

  // tengu_turtle_carbon experiment: open-weights Pro/Max also default to medium.
  if (isTurtleCarbonGate() && (isProPlan() || isMaxPlan())) return "medium";

  // Everyone else (API-key, Bedrock, Vertex, Foundry, Team, Enterprise,
  // Sonnet on any tier, Haiku, etc.) defaults to `high` (since v2.1.94).
  return "high";
}

// Mapping: IF1→getDefaultEffortForModel, o5→resolveModelId,
//          JB→isProPlan, ch→isMaxPlan, Ps→isTurtleCarbonGate
```

### xhigh description text

```javascript
// ============================================
// xhigh description copy (chunks.80.mjs:2795-2796)
// ============================================

case "xhigh":
    return "Deeper reasoning than high, just below maximum (Opus 4.7 only)";
```

### MAX_EFFORT_BLOCKLIST (used by Ct6)

```javascript
// ============================================
// MAX_EFFORT_BLOCKLIST - models that cannot use `max` effort
// Location: chunks.80.mjs:2836
// ============================================

c8z = new Set([
  "claude-3-opus", "claude-3-sonnet", "claude-3-5-sonnet", "claude-3-7-sonnet",
  "claude-sonnet-4", "claude-sonnet-4-0", "claude-sonnet-4-5",
  "claude-opus-4", "claude-opus-4-0", "claude-opus-4-1", "claude-opus-4-5"
]);

// Notably ABSENT (so `max` is allowed):
//   claude-opus-4-6, claude-opus-4-7, claude-sonnet-4-6, claude-haiku-4-5
```

### unpinOpus47LaunchEffort latch

```javascript
// ============================================
// unpinAndApplyEffort - sets the unpin latch on user-driven effort changes
// Location: chunks.80.mjs:2757-2764
// ============================================

// ORIGINAL (for source lookup):
function CF1(q) {
    let K = id(q);
    if (K !== void 0) d8((_) => _.unpinOpus47LaunchEffort ? _ : {
        ..._,
        unpinOpus47LaunchEffort: !0
    });
    return K ?? n8z()
}

// READABLE (for understanding):
function unpinAndApplyEffort(effortString) {
  // Called from CLI --effort and the picker change path. The mere act of
  // expressing a preference (regardless of value) latches the unpin flag —
  // future Opus 4.7 sessions will respect saved/appstate effort instead of
  // forcing xhigh.
  const parsed = parseEffortValue(effortString);
  if (parsed !== undefined) {
    updateAppConfig(prev =>
      prev.unpinOpus47LaunchEffort
        ? prev
        : { ...prev, unpinOpus47LaunchEffort: true }
    );
  }
  return parsed ?? readSettingsEffortLevel();
}

// Mapping: CF1→unpinAndApplyEffort, id→parseEffortValue,
//          d8→updateAppConfig, n8z→readSettingsEffortLevel
```

The same `unpinOpus47LaunchEffort` flag is set by the picker
(`sLY` in chunks.168.mjs:906-911) and by every `/effort` outcome
(`koY` in chunks.189.mjs:992-995).

## Why this approach

### `EFFORT_LEVELS` as a 5-tier scalar

**What it does:** Defines the canonical effort scale that the validator,
parser, slider, CLI flag, and `/effort` command all reference.

**How it works:**
1. The constant is built once during module init (`hf = L(() => …)`).
2. The order of the tuple matters — index 0 is "low", index 4 is "max".
   `applyEffortChange` in the slider uses indexOf+modulo to cycle.
3. The validator (`isValidEffortLevel`, `Nh8`) does a strict array
   inclusion check; nothing outside the tuple is accepted as a level
   string.

**Why this approach:** A scalar (rather than a categorical enum) makes
the slider UX work — you can navigate ←/→ along a clear gradient. A more
complex multi-dimensional model (e.g. separate "thinking budget" and
"speculative tokens" knobs) would be impossible to surface to non-power
users.

**Trade-off:** A single scalar bakes assumptions into the model. If
Anthropic adds a future "extended" tier above `max`, the resolution code
has to be touched in five places. The mitigation is keeping the
constants in one file (`chunks.80.mjs:2835`) and the gates as small
boolean functions.

**Key insight:** `xhigh` was inserted *between* `high` and `max`, not
appended after — and the slider's default position is now index 3
(`xhigh`) instead of index 2 (`high`). The slider sticks with index 3 as
default even for non-Opus-4.7 models, because the level is still in the
list (downgrade happens silently at resolution time). This means the
slider visually shows the user's *intent* and the API call shows the
*actual* effort sent.

---

### `modelSupportsXhigh` — gating logic

**What it does:** Returns `true` if a model supports `xhigh` effort,
`false` otherwise. Defaults to: only Opus 4.7 supports it on
first-party; third-party adapters declare via capability override.

**How it works:**
1. Check `get3PModelCapabilityOverride(model, "xhigh_effort")`. This
   reads a per-model JSON shape on third-party adapters (Bedrock,
   Vertex, Foundry) declaring `caps["effort"]["xhigh"]["supported"]`.
2. If the override is defined (true or false), return that.
3. Otherwise, fall back to substring match: `model.includes("opus-4-7")`.

**Why this approach:** The two-step lookup is the same pattern as
`modelSupportsEffort` and `modelSupportsMaxEffort` — every capability
gate funnels through `get3PModelCapabilityOverride` first so that
enterprise third-party deployments can shape capability without code
changes.

**Why a substring match:** Model strings come in many forms:
`claude-opus-4-7-20251022`, `claude-opus-4-7:0`,
`anthropic.claude-opus-4-7-v1:0` (Bedrock), `claude-opus-4-7` (alias).
`resolveModelId` strips the date and version suffixes but the model
family substring is preserved across all formats. So a single
`includes("opus-4-7")` check works for every wrapper.

**Trade-off vs explicit allowlist:** A `Set` of full model IDs would be
safer but require maintenance with every Anthropic release. A substring
match is forward-compatible (no code change when Anthropic ships
`opus-4-7-20260101`) at the cost of accepting any model marketed as
"opus-4-7". This is a pragmatic choice given Anthropic controls the
model naming.

**Key insight:** This is the **only** gate function that hard-codes Opus
4.7 (vs. `modelSupportsEffort`, which lists all currently-supported
families). The narrow scope is intentional: `xhigh` is a launch-tier
feature specific to one model, not a generic capability that other
models should inherit.

---

### `resolveAppliedEffort` — the precedence pipeline

**What it does:** Computes the final effort value that will be sent to
the API for a given model, given the user's AppState and environment.

**How it works:**

The 5-step decision pipeline:

1. **Compute `isOpus47Default`:** `model.includes("opus-4-7")` AND
   `!appConfig.unpinOpus47LaunchEffort`. This determines whether the
   "factory default" effort should win over the user's AppState.

2. **Read the env override:** `CLAUDE_CODE_EFFORT_LEVEL`. Three states:
   - `unset`/`auto`: returns `null` (force skip effort param)
   - parseable level: returns the level
   - undefined: returns `undefined`

3. **Handle `null` (skip-effort) case:** If env is `null`, the user
   asked for "no effort param." But if Opus 4.7 launch default is still
   active, that overrides — still return `xhigh` (the model-default for
   Opus 4.7).

4. **Compute the resolved value:** Precedence chain:
   `env ?? (isOpus47Default ? modelDefault : undefined) ?? appState ?? modelDefault`

5. **Downgrade if unsupported:** If `resolved === "max"` and the model
   isn't in the max-supported list, return `"high"`. Same for `xhigh`.

**Why this approach — precedence ordering:**

| Source | Why it has the precedence it has |
|--------|----------------------------------|
| `CLAUDE_CODE_EFFORT_LEVEL` (env) | Highest. Env vars are explicit, ephemeral, and most useful for headless/scripting use cases. |
| Opus 4.7 launch default | Above AppState only when not yet unpinned. This is the "first-run nudge" — once the user has expressed an effort preference, it stops. |
| AppState (`effortValue` in app state) | The user's session-scoped choice, set by `/effort <level>` or the picker. |
| `modelDefault` | The fallback if nothing else is set. |

**Why silent downgrade:** Without this, asking for `max` on Sonnet would
fail at the API layer with a 400, breaking scripts and confusing users.
The downgrade makes the system robust to "effort that doesn't apply" —
nothing breaks, the request just goes through with the closest
supported level.

**Key insight:** The Opus 4.7 launch default is a **temporary** override
of the user's normal AppState precedence. It sits *between* env and
AppState in the chain, not above env. So a user with
`CLAUDE_CODE_EFFORT_LEVEL=high` set will get `high` even on first Opus
4.7 launch — env wins. But a user with no env and a saved AppState of
`medium` will still see `xhigh` until they explicitly change it (because
the launch default is fresher).

---

### `getDefaultEffortForModel` — per-model defaults

**What it does:** Returns the auto-default effort for a given model
when the user hasn't explicitly chosen one.

**How it works:** A linear chain of model+tier checks:

1. **Opus 4.7** → always `xhigh` (regardless of subscription tier)
2. **Opus 4.6** Pro/Max → `medium` (cost-balance for subscription tiers)
3. **Open-weights** ( `tengu_turtle_carbon` gate) Pro/Max → `medium`
4. **Everyone else** → `high`

The "everyone else" fallback is the 2.1.94 change — pre-2.1.94, the
default was `medium` for everyone except ants.

**Why this approach:**
- **Opus 4.7 gets `xhigh`** because its raw output quality on `high` is
  below its potential — telemetry showed users immediately bumping to
  `max` on first session.
- **Opus 4.6 Pro/Max gets `medium`** because (a) the model is
  capability-saturated at medium for most tasks, and (b) subscription
  tiers have rate-limit caps that `high` would burn through quickly.
- **API-key/Bedrock/Vertex/Foundry/Team/Enterprise get `high`** because
  per-token billing means "use more compute for better answers" is the
  right cost trade-off, vs subscription tiers where rate-limit conservation
  matters.

**Key insight:** The two axes are **model capability** and
**billing model**. Opus 4.6 has *the same model capability* as
Opus 4.7 from a Claude-perspective, but `xhigh` is gated to 4.7 because
it's a launch-tier differentiator. The `medium` default for Pro/Max on
Opus 4.6 is *purely* a billing/rate-limit concern, not a capability one.

---

### `unpinOpus47LaunchEffort` — the latch mechanism

**What it does:** A boolean flag stored in app config that, when true,
disables the "Opus 4.7 launch default to xhigh" behavior.

**How it works:**
1. App config starts with the flag absent (treated as falsy).
2. The flag is set to `true` (and persisted) by any of these actions:
   - User confirms an effort change via the slider (`koY`)
   - User sets effort via `/effort <level>` slash command (`sj7`)
   - User changes effort via the model picker (`sLY`)
   - User passes `--effort <level>` on the CLI (`CF1`)
3. Once set, `resolveAppliedEffort`'s `isOpus47Default` term becomes
   `false`, and the Opus 4.7 default is no longer forced over AppState.

**Why this approach:**

The Opus 4.7 launch wanted to *nudge* users to experience `xhigh` (the
new capability), but couldn't *override* the user's normal preference
permanently. The two competing principles:

1. **"Don't surprise the user"** — if they've saved `effortLevel: high`
   in their settings, that should be honored.
2. **"Show off the new feature"** — if this is the user's first Opus
   4.7 session, they should see `xhigh` so they know it exists.

The latch resolves the conflict via a temporal model: the new default
wins **once**, just for the first session-or-action, then disengages
once the user has demonstrated awareness (by making any effort choice
at all — including re-selecting the default `xhigh` value).

**Trade-off:** Latching on **any** effort-touching action (even
`/effort xhigh`, the current value) might feel unintuitive — the user
didn't change anything. But the logic is correct: by *touching* the
effort knob, they've shown they know it exists, so the auto-nudge has
done its job and can step out of the way.

**Key insight:** The flag is **idempotent** — setting it again is a
no-op. This means the latch is forward-only: once unpinned, the system
never re-pins. This is intentional: re-pinning on, say, model switch
would re-impose `xhigh` without the user having any way to express "I
already saw this feature and chose differently."

## Cross-validation: v2.1.88 → v2.1.112

| Symbol | v2.1.88 | v2.1.112 | Δ |
|--------|---------|----------|---|
| `EFFORT_LEVELS` | 4 levels | 5 levels (adds `xhigh` at index 3) | +1 level |
| `modelSupportsMaxEffort` | allowlist (only `opus-4-6` + ant) | **blocklist** (deny known legacy) | Semantics flipped (see [effort_max_denial_fix.md](./effort_max_denial_fix.md)) |
| `modelSupportsXhigh` | (didn't exist) | new function (`bt6`) | New |
| `getDefaultEffortForModel` Opus 4.7 branch | (didn't exist) | returns `"xhigh"` | New |
| `getDefaultEffortForModel` fallback | `undefined` (resolves to `high` at API) | `"high"` (explicit) | Tightened |
| `resolveAppliedEffort` xhigh downgrade | (didn't exist) | `if (resolved === "xhigh" && !bt6) return "high"` | New |
| `unpinOpus47LaunchEffort` flag | (didn't exist) | App-config boolean, latched by user actions | New |
| `OPUS47_WELCOME_TOAST` | (didn't exist) | `"Welcome to Opus 4.7 xhigh!"` | New |

## Related symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - scoped diff index
> - [symbol_additions_unit_16.md](../00_overview/symbol_additions_unit_16.md) - new symbols from this unit

Key functions in this document:
- `modelSupportsXhigh` (bt6) — Opus 4.7-only gate; chunks.80.mjs:2708-2712
- `modelSupportsMaxEffort` (Ct6) — blocklist-driven max gate; chunks.80.mjs:2701-2706
- `resolveAppliedEffort` (wy6) — env→state→default + downgrade; chunks.80.mjs:2746-2755
- `getDefaultEffortForModel` (IF1) — per-model auto-default; chunks.80.mjs:2811-2819
- `unpinAndApplyEffort` (CF1) — sets the unpin latch + applies; chunks.80.mjs:2757-2764
- `EFFORT_LEVELS` (UI) — 5-tier scalar constant; chunks.80.mjs:2835
- `MAX_EFFORT_BLOCKLIST` (c8z) — claude-3/sonnet-4-0/4-5/opus-4-0/4-1/4-5; chunks.80.mjs:2836
- `isProPlan` (JB), `isMaxPlan` (ch), `isTurtleCarbonGate` (Ps) — tier checks
- `resolveModelId` (o5), `get3PModelCapabilityOverride` ($a) — model identification helpers
