# Auto Mode Dispatch — v2.1.111-112

**Theme:** Auto mode goes from beta-gated-by-flag to GA-for-Max-on-Opus-4.7. The `--enable-auto-mode` flag is no longer required for entry; v2.1.112 ships a one-line hotfix for the availability check that misclassified Opus 4.7 as "temporarily unavailable."

---

## 1. The Decision Tree

Auto mode availability is decided by a small, layered check sequence. The contract: each layer can **refuse** to allow auto mode, but no layer can force auto mode on by itself — entry always requires either an explicit user action (mode toggle, `--permission-mode auto`) or the settings-based `defaultMode: auto`.

### v2.1.88 baseline

Auto mode was strictly gated:
- `feature('TRANSCRIPT_CLASSIFIER')` build flag (Anthropic-only by default)
- `tengu_auto_mode_config.enabled === 'enabled'` from GrowthBook
- `modelSupportsAutoMode(model)` returned true
- User had to either pass `--enable-auto-mode` flag OR have `skipAutoPermissionPrompt` set in settings

The user-visible affordance was hidden behind `--enable-auto-mode` so it didn't appear in the carousel without explicit opt-in.

### v2.1.112 state — model-tier-based gating

```javascript
// ============================================
// modelSupportsAutoMode - Max subscribers gated to Opus 4.7
// Location: chunks.60.mjs:1622-1634
// ============================================

// ORIGINAL (for source lookup):
function Dk6(q) {
  {
    let K = o5(q),
        _ = u8("tengu_auto_mode_config", {}),
        z = q.toLowerCase();
    if (_?.allowModels?.some((A) => A.toLowerCase() === z || A.toLowerCase() === K)) return !0;
    let Y = pq();
    if (Y !== "firstParty" && Y !== "anthropicAws") return !1;
    if (ch()) return /^claude-opus-4-7/.test(K);
    return /^claude-(opus|sonnet)-4-6/.test(K) || /^claude-opus-4-7/.test(K)
  }
  return !1
}

// READABLE (for understanding):
function modelSupportsAutoMode(model) {
  const canonical = resolveModelId(model);
  const config = getFeatureValue_CACHED_MAY_BE_STALE("tengu_auto_mode_config", {});
  const rawLower = model.toLowerCase();

  // GrowthBook can force-enable specific models (canonical name or exact ID).
  // This is the rollout knob for ant-internal experimental models.
  if (config?.allowModels?.some(
        am => am.toLowerCase() === rawLower || am.toLowerCase() === canonical))
    return true;

  // Auto mode is only built for first-party APIs (PI probes not wired
  // for Bedrock/Vertex/Foundry/Mantle yet).
  const provider = getAPIProvider();
  if (provider !== "firstParty" && provider !== "anthropicAws") return false;

  // Max subscribers: Opus 4.7 ONLY. (4.6 is too cheap-for-Max to lift the gate.)
  if (isMaxPlan()) return /^claude-opus-4-7/.test(canonical);

  // Everyone else (Pro, API key, etc.): 4.6 OR 4.7 family.
  return /^claude-(opus|sonnet)-4-6/.test(canonical) || /^claude-opus-4-7/.test(canonical);
}

// Mapping: Dk6→modelSupportsAutoMode, o5→resolveModelId, ch→isMaxPlan,
//          pq→getAPIProvider, u8→getFeatureValue_CACHED_MAY_BE_STALE
```

This is the **single function** that differs most between v2.1.88 and v2.1.112 for auto mode. In v2.1.88 the corresponding `modelSupportsAutoMode` (in `src/utils/betas.ts:160`) gated to `claude-(opus|sonnet)-4-6` only for external users; v2.1.112 adds the `claude-opus-4-7` branch.

### Why this approach

**Why a Max-only branch for Opus 4.7?** Auto mode burns the user's tier limit on a per-tool-call basis (every action runs a classifier side-query, ~3-15k tokens of context). Max subscribers have effectively-unlimited usage; Pro and API-key users would feel each side-query as a tier-cost line item.

**Why Opus 4.7 specifically?** The PI (prompt-injection) probes that ship with auto mode are model-tested. Opus 4.7's improved reasoning is what makes the classifier reliable enough to ship without `--enable-auto-mode` friction.

**Why `firstParty + anthropicAws` only?** PI probes haven't been validated on Bedrock/Vertex/Foundry yet. Allowing auto mode there would silently degrade to a less-tested safety classifier.

**Why a `tengu_auto_mode_config.allowModels` override?** Lets Anthropic A/B-test new models in auto mode without re-deploying the binary. Bypasses both denylist and allowlist.

---

## 2. The Carousel Availability Check

When the user shift-tabs through permission modes, the carousel shows only modes the model can support. Auto mode appears in the carousel only if `verifyAutoModeGateAccess` returns `carouselAvailable: true`.

### v2.1.112 state

```javascript
// ============================================
// verifyAutoModeGateAccess - async carousel-availability + circuit-breaker check
// Location: chunks.165.mjs:3-69
// ============================================

// ORIGINAL (for source lookup):
async function yK8(q, K) {
    let _ = await Kd("tengu_auto_mode_config", {}),
        z = nY7(_?.enabled),
        Y = lY7();
    if (!(DG?.isAutoModeCircuitBroken() ?? !1))
        DG?.setAutoModeCircuitBroken(z === "disabled" || Y);
    let A = G5(),
        O = !!_?.disableFastMode && (!!K || !1),
        w = Dk6(A) && !O,
        $ = !1;
    if (z !== "disabled" && !Y && w) $ = z === "enabled" || Wn8();
    let j = z !== "disabled" && !Y && w;
    // ... transform construction below
}

// READABLE (for understanding):
async function verifyAutoModeGateAccess(currentContext, fastMode) {
  // Fresh GrowthBook read of the auto-mode config (authoritative).
  const autoModeConfig = await getDynamicConfig_BLOCKS_ON_INIT("tengu_auto_mode_config", {});
  const enabledState = parseAutoModeEnabledState(autoModeConfig?.enabled);
  const disabledBySettings = isAutoModeDisabledBySettings();

  // Circuit breaker: a 'disabled' GB value or settings-disable shuts auto mode
  // off cross-process (SDK re-entry, slash commands, opt-in dialog all block).
  autoModeStateModule?.setAutoModeCircuitBroken(
    enabledState === "disabled" || disabledBySettings
  );

  const mainModel = getMainLoopModel();
  const disableFastModeBreakerFires = !!autoModeConfig?.disableFastMode && !!fastMode;
  const modelSupported = modelSupportsAutoMode(mainModel) && !disableFastModeBreakerFires;

  // Carousel: shown only when also (enabled OR user has opted in)
  let carouselAvailable = false;
  if (enabledState !== "disabled" && !disabledBySettings && modelSupported) {
    carouselAvailable = enabledState === "enabled" || hasAutoModeOptInAnySource();
  }

  // canEnterAuto: explicit entry (--permission-mode auto, defaultMode:auto)
  // — bypasses carousel opt-in since explicit IS an opt-in
  const canEnterAuto = enabledState !== "disabled" && !disabledBySettings && modelSupported;

  // ... returns a transform fn applied via setAppState
}

// Mapping: yK8→verifyAutoModeGateAccess, Kd→getDynamicConfig_BLOCKS_ON_INIT,
//          nY7→parseAutoModeEnabledState, lY7→isAutoModeDisabledBySettings,
//          DG→autoModeStateModule, G5→getMainLoopModel, Dk6→modelSupportsAutoMode,
//          Wn8→hasAutoModeOptInAnySource
```

### What the four gates do (in priority order)

| Gate | Source | Effect when false |
|------|--------|-------------------|
| `enabledState !== 'disabled'` | `tengu_auto_mode_config.enabled` (GB) | Circuit breaker fires — incident-response off-switch |
| `!disabledBySettings` | `disableAutoMode` in user/local/policy settings | Org admin disabled |
| `modelSupported` | `modelSupportsAutoMode(currentModel)` | Model can't run the classifier |
| `enabledState === 'enabled' || hasAutoModeOptInAnySource()` | Per-user opt-in OR org-wide enable | Carousel hidden until opt-in |

The first three gate **entry**; the fourth gates **discovery** (carousel visibility).

### Why this approach

**Why an async check separate from `isAutoModeGateEnabled()`?** GrowthBook is the authoritative source for `tengu_auto_mode_config.enabled`, but reading GB blocks on the *first* call after init. The sync `isAutoModeGateEnabled()` uses the cached value (may be stale); the async `verifyAutoModeGateAccess` reads fresh and writes back the result. This is the **eventual consistency** pattern — sync paths can proceed; the async check corrects them.

**Why a transform function instead of returning a new context?** The async GB await may take 100ms+. During that window, the user can shift-tab to another mode, queue a tool call, or even exit auto mode. Returning a pre-computed context would clobber those mid-flight changes. The transform applies *at setAppState time* against the fresh context — so a user who shift-tabbed during the await isn't yanked back into auto.

**Why both `carouselAvailable` and `canEnterAuto`?** They model the difference between "show in the UI" (needs opt-in) and "can the user actively enter via explicit signal" (always allowed if gates pass). `--permission-mode auto` and `defaultMode: auto` are explicit signals; the carousel shift-tab is implicit and requires consent.

---

## 3. The `--enable-auto-mode` Removal (v2.1.111)

### v2.1.88 behavior

`--enable-auto-mode` was a CLI flag with one effect: set `autoModeFlagCli = true`. This bit:
- Made the carousel show auto mode (via `hasAutoModeOptInAnySource() = (autoModeFlagCli || hasSettingsOptIn())`).
- Made `verifyAutoModeGateAccess` show the "auto mode unavailable" notification when the gate denied entry (so users who explicitly opted in got told why).

Without the flag, auto mode was invisible — users had to discover the flag or set `skipAutoPermissionPrompt` in settings.

### v2.1.112 state

The flag still exists (`chunks.150.mjs:1301` registers `--enable-auto-mode`), but its semantic role is now mostly historical. Auto mode is in the carousel by default for Max+Opus-4.7 users because `enabledState === 'enabled'` in the GrowthBook config makes `carouselAvailable` true regardless of the opt-in check.

```javascript
// chunks.150.mjs:197 — autoModeFlagCli is set when:
if (H.enableAutoMode || V === "auto" || c6 === "auto" || !V && rY7())
  rMA?.setAutoModeFlagCli(!0);
```

That is:
- `--enable-auto-mode` (legacy flag)
- `--permission-mode auto` (new CLI path)
- Resolved initial mode is `auto` (settings or CLI)
- Settings `defaultMode: auto` was honored

Any of these counts as "user intends auto this session." The flag is no longer the *only* trigger — it's just one of four sources.

### Why this approach

**Why keep the flag at all?** Removing it would break scripts. Hide it from help (`hideHelp()`) and let it continue working as a "did the user explicitly want auto" signal.

**Why route the flag through `setAutoModeFlagCli` instead of touching state directly?** The flag's effect on auto mode UX (notification on availability check failure) is decided downstream in `verifyAutoModeGateAccess`. Centralizing the bit in `autoModeStateModule` keeps the notification logic in one place.

**Trade-off:** The flag's hidden-help status means new users won't see it in `claude --help`. Documented in release notes only. The team accepted this — the GA path through the carousel is the recommended discovery mode.

---

## 4. v2.1.112 Hotfix — "claude-opus-4-7 is temporarily unavailable"

### The bug

After v2.1.111 rolled out, users on Opus 4.7 in auto mode saw:
> claude-opus-4-7 is temporarily unavailable. Switching to another model.

This was wrong — the model *was* available. The classifier path was checking a stale availability mapping that hadn't been updated when Opus 4.7's model ID was added.

### The fix

The single change in v2.1.112: update the model-availability map (in the model picker / availability check) to include `claude-opus-4-7` as a valid available model identifier, removing the false "temporarily unavailable" status.

This is a one-line release. The v2.1.111 rollout was rapid (Opus 4.7 launched as headline feature) and the availability map for auto mode wasn't on the same checklist as the model picker map.

### Why a hotfix release?

**The user pain:** Anyone on Max + Opus 4.7 saw their primary feature break. A few-day delay would lose users to the impression that "auto mode is unreliable."

**The team learns:** Cross-cutting feature launches (new model + auto mode availability) need a single ownership list — at least one of the maps had three independent updates required (modelPicker, autoMode availability, classifier-supported model). Future model launches consolidate these into a single "supported models" registry.

---

## 5. Sources of `autoModeFlagCli`

A trace of how the four sources reach `verifyAutoModeGateAccess`:

```
1. --enable-auto-mode CLI flag → main.tsx:1406 → setAutoModeFlagCli(true)
2. --permission-mode auto    → main.tsx:1406 → setAutoModeFlagCli(true)
3. permissionMode === 'auto' → main.tsx:1406 → setAutoModeFlagCli(true)
4. settings.defaultMode auto → main.tsx:1406 (via isDefaultPermissionModeAuto)
                              → setAutoModeFlagCli(true)
```

`getAutoModeFlagCli()` is then read inside `verifyAutoModeGateAccess` to decide notification visibility (chunks.165.mjs:15: `let H = DG?.getAutoModeFlagCli() ?? !1`).

For tests, `_resetForTesting()` in `autoModeState.ts:35` clears all three bits.

---

## File-level "where to look"

| Concern | 2.1.112 chunk | v2.1.88 baseline |
|---------|---------------|------------------|
| `modelSupportsAutoMode` | `chunks.60.mjs:1622-1634` | `src/utils/betas.ts:160-195` |
| `verifyAutoModeGateAccess` | `chunks.165.mjs:3-69` | `src/utils/permissions/permissionSetup.ts:1078-1260` |
| `isAutoModeGateEnabled` (sync) | `chunks.165.mjs:80-85` | `src/utils/permissions/permissionSetup.ts:1283-1288` |
| `hasAutoModeOptIn` (settings opt-in) | `chunks.19.mjs:1647-1658` | `src/utils/permissions/permissionSetup.ts` (search `hasAutoModeOptIn`) |
| `hasAutoModeOptInAnySource` (CLI + settings) | `chunks.165.mjs:110-113` | `src/utils/permissions/permissionSetup.ts` |
| `setAutoModeFlagCli` (state) | within `chunks.165.mjs` module | `src/utils/permissions/autoModeState.ts:19-25` |
| `--enable-auto-mode` registration | `chunks.150.mjs:1301` | `src/main.tsx:3830` |
| Auto-mode flag wiring | `chunks.150.mjs:197` | `src/main.tsx:1406-1410` |

---

## Related Symbols

> Symbol mappings:
> - [`symbol_additions_unit_12.md`](../00_overview/symbol_additions_unit_12.md) — Unit 12 additions
> - [`symbol_index_infra_platform.md`](../00_overview/symbol_index_infra_platform.md) — Existing platform/permission symbols

Key functions in this document:
- `modelSupportsAutoMode` (`Dk6`) — Gate auto mode by model + provider + plan tier
- `verifyAutoModeGateAccess` (`yK8`) — Async circuit-breaker + carousel availability check
- `isAutoModeGateEnabled` (`$L`) — Sync gate (settings, circuit breaker, model)
- `hasAutoModeOptIn` (`VU`) — Reads `skipAutoPermissionPrompt` from all four settings scopes
- `hasAutoModeOptInAnySource` (`Wn8`) — `getAutoModeFlagCli() || hasAutoModeOptIn()`
- `isAutoModeDisabledBySettings` (`lY7`) — Reads `disableAutoMode` from settings
- `getAutoModeUnavailableReason` (`ge`) — Returns `'settings' | 'circuit-breaker' | 'model' | null`
- `parseAutoModeEnabledState` (`nY7`) — Validates `enabled` value as `'enabled' | 'disabled' | 'opt-in'`
- `setAutoModeFlagCli` — Mutator for `autoModeFlagCli` global in `autoModeStateModule` (`DG`)
- `getAutoModeFlagCli` — Reader for same global
- `isMaxPlan` (`ch`) — `getCurrentTier() === "max"` (subscription tier from auth)
- `getAPIProvider` (`pq`) — `'firstParty' | 'anthropicAws' | 'bedrock' | 'vertex' | 'foundry' | 'mantle'`
- `resolveModelId` (`o5`) — Strips region prefix to get canonical model ID
