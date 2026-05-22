# `/fast` Command and Fast Mode — From "Penguin" Codename to GA (v2.1.88 → v2.1.142)

## Status snapshot

| | v2.1.88 (TypeScript source) | v2.1.142 (deobfuscated) |
|---|---|---|
| Slash command name | `/fast` | `/fast` (same — listed in `slash_commands.json`) |
| CLI flag `--fast` | NOT present | NOT present (still no CLI flag, only slash command and settings) |
| Implementation files | `src/commands/fast/fast.tsx`, `src/utils/fastMode.ts` | `cli_inner_pretty.js:96854-97300` (utils), `cli_inner_pretty.js:484220-484252` (commands) |
| Enablement | `isFastModeEnabled()` returns `!CLAUDE_CODE_DISABLE_FAST_MODE` | `_9()` returns `vq() === "firstParty" && !CLAUDE_CODE_DISABLE_FAST_MODE` |
| Codename "penguin" | YES — internal codename throughout (`tengu_penguins_off`, `penguinModeOrgEnabled`) | YES — preserved telemetry keys (legacy), but settings/UI use `fastMode` |
| Model | Opus 4.6 | Opus 4.6 OR Opus 4.7 (with override env var) |
| Settings key | `fastMode: boolean`, `fastModePerSessionOptIn: boolean` | Same |
| Cooldown UI | Yes (rate limit message) | Yes — with `overloaded` reason added |
| Telemetry events | `tengu_fast_mode_toggled`, `tengu_fast_mode_picker_shown`, `tengu_fast_mode_fallback_triggered`, `tengu_fast_mode_overage_rejected` | Same set |
| GB gate | `tengu_penguins_off` (when set, returns the disable message) | Same |
| Theme colors | `fastMode`, `fastModeShimmer` | Same |
| Dual command exposition | NO (single `local-jsx` only) | YES — `local-jsx` (interactive) + `local` (`supportsNonInteractive: true`) |

### What is Fast Mode?

A "high-speed" mode for Opus that bills as extra usage at a premium rate, separate from the normal rate limits. The user pays for faster (lower-latency) inference. The internal codename was "penguin" — visible in `tengu_penguins_off`, `penguinModeOrgEnabled`, and theme color names. The user-visible name is "Fast mode" (always rendered with the Opus 4.6/4.7 brand).

### Why "promoted"?

In v2.1.88, fast mode was already public (no `USER_TYPE === 'ant'` gate), but the **non-interactive** entry point was missing — the slash command was `local-jsx` only, so `claude -p "/fast on"` would silently render nothing. In v2.1.142 the command is exposed as **both** a JSX picker AND a non-interactive `local` command (`KP4`), enabling scripted toggling. This is the promotion: an interactive-only utility becoming SDK/automation-friendly.

---

## 1. v2.1.88 implementation (TypeScript source)

### Slash command (`fast.tsx`)

```typescript
// ============================================
// fastSlashCommand - v2.1.88 single-mode entry
// Location: src/commands/fast/fast.tsx (with index.ts exporting Command)
// ============================================

// ORIGINAL (for source lookup):
export async function call(onDone, context, args?): Promise<React.ReactNode | null> {
  if (!isFastModeEnabled()) {
    return null;
  }
  await prefetchFastModeStatus();
  const arg = args?.trim().toLowerCase();
  if (arg === 'on' || arg === 'off') {
    const result = await handleFastModeShortcut(arg === 'on', context.getAppState, context.setAppState);
    onDone(result);
    return null;
  }
  const unavailableReason = getFastModeUnavailableReason();
  logEvent('tengu_fast_mode_picker_shown', { unavailable_reason: (unavailableReason ?? '') });
  return <FastModePicker onDone={onDone} unavailableReason={unavailableReason} />;
}
```

### Gate + apply (`fastMode.ts`)

```typescript
// ============================================
// applyFastMode - mutates settings + app state
// Location: src/commands/fast/fast.tsx:16-40
// ============================================

// ORIGINAL (for source lookup):
function applyFastMode(enable, setAppState) {
  clearFastModeCooldown();
  updateSettingsForSource('userSettings', {
    fastMode: enable ? true : undefined
  });
  if (enable) {
    setAppState(prev => {
      const needsModelSwitch = !isFastModeSupportedByModel(prev.mainLoopModel);
      return {
        ...prev,
        ...(needsModelSwitch ? { mainLoopModel: getFastModeModel(), mainLoopModelForSession: null } : {}),
        fastMode: true
      };
    });
  } else {
    setAppState(prev => ({ ...prev, fastMode: false }));
  }
}

// READABLE — already semantic above.
```

### Availability check

```typescript
// ============================================
// getFastModeUnavailableReason - compound check
// Location: src/utils/fastMode.ts:72-140
// ============================================
export function getFastModeUnavailableReason(): string | null {
  if (!isFastModeEnabled()) return 'Fast mode is not available';
  const statigReason = getFeatureValue_CACHED_MAY_BE_STALE('tengu_penguins_off', null);
  if (statigReason !== null) return statigReason;
  if (!isInBundledMode() && getFeatureValue_CACHED_MAY_BE_STALE('tengu_marble_sandcastle', false))
    return 'Fast mode requires the native binary · Install from: https://claude.com/product/claude-code';
  if (getIsNonInteractiveSession() && preferThirdPartyAuthentication() && !getKairosActive()) {
    const flagFastMode = getSettingsForSource('flagSettings')?.fastMode;
    if (!flagFastMode) return 'Fast mode is not available in the Agent SDK';
  }
  if (getAPIProvider() !== 'firstParty') return 'Fast mode is not available on Bedrock, Vertex, or Foundry';
  if (orgStatus.status === 'disabled') {
    // ... compute reason text from orgStatus.reason
  }
  return null;
}
```

Key v2.1.88 facts:
- The "penguin" codename leaks via two GB keys: `tengu_penguins_off` (kill switch) and `tengu_marble_sandcastle` (require-native gate)
- Non-interactive sessions are blocked by default — must set `flagFastMode: true` in `flagSettings` to override
- First-party API only (no Bedrock/Vertex/Foundry)
- The Kairos daemon (assistant mode) is a special exemption to the SDK block

---

## 2. v2.1.142 implementation (deobfuscated)

### Dual command exposure

```javascript
// ============================================
// fastSlashCommands - dual exposure (local-jsx + local)
// Location: cli_inner_pretty.js:484220-484252
// ============================================

// ORIGINAL (for source lookup):
((Ev5 = {
  type: "local-jsx",
  name: "fast",
  get description() { return `Toggle fast mode (${Yu()})`; },
  get isHidden() { return !_9(); },
  argumentHint: "[on|off]",
  get immediate() { return IaH(); },
  requires: { ink: !0 },
  thinClientDispatch: "control-request",
  load: () => Promise.resolve().then(() => (_p6(), HP4)),
}),
  (KP4 = {
    type: "local",
    name: "fast",
    supportsNonInteractive: !0,
    get description() { return `Toggle fast mode (${Yu()})`; },
    argumentHint: "[on|off]",
    load: () => Promise.resolve().then(() => (qP4(), $P4)),
  }),
  (Ap6 = Ev5));

// READABLE (for understanding):
const fastInteractiveCommand = {
  type: "local-jsx",
  name: "fast",
  get description() { return `Toggle fast mode (${getFastModeModelDisplay()})`; },
  get isHidden() { return !isFastModeEnabled(); },
  argumentHint: "[on|off]",
  get immediate() { return isImmediateModelCommandEnabled(); },
  requires: { ink: true },
  thinClientDispatch: "control-request",
  load: () => loadFastInteractiveImpl(),
};

const fastNonInteractiveCommand = {
  type: "local",
  name: "fast",
  supportsNonInteractive: true,
  get description() { return `Toggle fast mode (${getFastModeModelDisplay()})`; },
  argumentHint: "[on|off]",
  load: () => loadFastNonInteractiveImpl(),
};

// Default export is the interactive one — non-interactive is selected by the
// command resolver when running in -p / SDK / Remote Control.
// Mapping: Ev5→fastInteractiveCommand, KP4→fastNonInteractiveCommand, Ap6→default export,
//          Yu→getFastModeModelDisplay, _9→isFastModeEnabled, IaH→isImmediateModelCommandEnabled
```

### The model-display dynamic value

```javascript
// ============================================
// getFastModeModelDisplay - "Opus 4.6" or "Opus 4.7"
// Location: cli_inner_pretty.js:96905-96910
// ============================================

// ORIGINAL (for source lookup):
function Cc() {
  return bH(process.env.CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE);
}
function Yu() {
  return Cc() ? "Opus 4.6" : "Opus 4.7";
}

// READABLE (for understanding):
function isOpus46FastModeOverride() {
  return parseEnvBoolean(process.env.CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE);
}
function getFastModeModelDisplay() {
  // v2.1.142 default is Opus 4.7. The env var pins back to 4.6 for users who
  // want stability or have a specific 4.6 cost arrangement.
  return isOpus46FastModeOverride() ? "Opus 4.6" : "Opus 4.7";
}
// Mapping: Cc→isOpus46FastModeOverride, Yu→getFastModeModelDisplay, bH→parseEnvBoolean
```

### Gate evolution

```javascript
// ============================================
// isFastModeEnabled - v2.1.142 entry gate
// Location: cli_inner_pretty.js:96854-96857
// ============================================

// ORIGINAL (for source lookup):
function _9() {
  if (vq() !== "firstParty") return !1;
  return !bH(process.env.CLAUDE_CODE_DISABLE_FAST_MODE);
}

// READABLE (for understanding):
function isFastModeEnabled() {
  // First-party API only — Bedrock/Vertex/Foundry tenants never have fast mode.
  if (getAPIProvider() !== "firstParty") return false;
  // CLAUDE_CODE_DISABLE_FAST_MODE=1 hard-disables (no override possible).
  return !parseEnvBoolean(process.env.CLAUDE_CODE_DISABLE_FAST_MODE);
}
// Mapping: _9→isFastModeEnabled, vq→getAPIProvider, bH→parseEnvBoolean
```

**Diff to v2.1.88**: v2.1.88's `isFastModeEnabled()` did NOT check API provider — that was a separate inline check inside `getFastModeUnavailableReason`. v2.1.142 hoists the first-party check into the gate itself. Effect: a Bedrock user no longer sees `/fast` in their command list at all (`isHidden` returns true). v2.1.88 would have shown it grayed out with a reason message.

### Model coverage extended

```javascript
// ============================================
// isFastModeSupportedByModel - v2.1.142 model check
// Location: cli_inner_pretty.js:96922-96928
// ============================================

// ORIGINAL (for source lookup):
function Uw(H) {
  if (!_9()) return !1;
  let $ = H ?? UJ(),
    K = n7($).toLowerCase();
  if (Cc()) return K.includes("opus-4-6");
  return K.includes("opus-4-6") || K.includes("opus-4-7");
}

// READABLE (for understanding):
function isFastModeSupportedByModel(modelOpt) {
  if (!isFastModeEnabled()) return false;
  const model = modelOpt ?? getDefaultMainLoopModelSetting();
  const parsed = parseUserSpecifiedModel(model).toLowerCase();
  if (isOpus46FastModeOverride()) return parsed.includes("opus-4-6");
  // v2.1.142: both Opus 4.6 and 4.7 are first-class.
  return parsed.includes("opus-4-6") || parsed.includes("opus-4-7");
}
// Mapping: Uw→isFastModeSupportedByModel, UJ→getDefaultMainLoopModelSetting, n7→parseUserSpecifiedModel
```

**Diff to v2.1.88**: v2.1.88 had hard-coded `opus-4-6` ONLY (`src/utils/fastMode.ts:175`). v2.1.142 adds Opus 4.7 as the default supported model — with `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1` pinning back to 4.6 for users who want the older behavior.

### Org-policy disable updated

```javascript
// ============================================
// disableFastModeForPreference - propagates to penguinModeOrgEnabled
// Location: cli_inner_pretty.js:96947-96953
// ============================================

// ORIGINAL (for source lookup):
function isq() {
  if (jE.status === "disabled") return;
  ((jE = { status: "disabled", reason: "preference" }),
    B6("userSettings", { fastMode: void 0 }),
    t$((H) => ({ ...H, penguinModeOrgEnabled: !1 })),
    Zi8.emit(!1));
}

// READABLE (for understanding):
function disableFastModeForPreference() {
  if (orgStatus.status === "disabled") return;
  orgStatus = { status: "disabled", reason: "preference" };
  updateSettingsForSource("userSettings", { fastMode: undefined });
  setAppState((prev) => ({ ...prev, penguinModeOrgEnabled: false }));
  fastModeAvailabilityChanged.emit(false);
}
// Mapping: isq→disableFastModeForPreference, jE→orgStatus, B6→updateSettingsForSource,
//          t$→setAppState, Zi8→fastModeAvailabilityChanged
```

---

## 3. Diff during promotion (88 → 142)

### What changed

| Aspect | v2.1.88 | v2.1.142 |
|---|---|---|
| Slash command surface | `local-jsx` only (`fast/fast.tsx` default) | `local-jsx` (default for REPL) + `local` (selected for -p/SDK) |
| `supportsNonInteractive` | n/a (impossible with local-jsx) | `true` on the `local` variant |
| Default model | Opus 4.6 | Opus 4.7 (with `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` to pin to 4.6) |
| Model display in description | Hard-coded "Opus 4.6" via `FAST_MODE_MODEL_DISPLAY` | Dynamic via `Yu()` reading the override env var |
| `isHidden` getter | n/a (filtering done inside `call`) | `isHidden: () => !isFastModeEnabled()` in the registry entry |
| `immediate` getter | n/a | Reads `tengu_immediate_model_command` GB flag — when true, the picker bypass renders nothing and the command takes effect immediately |
| `requires: { ink: true }` | n/a | Explicit declaration for the JSX variant |
| `thinClientDispatch: "control-request"` | n/a | Lets the thin-client (Remote Control) dispatch the slash command server-side rather than rendering JSX |
| First-party gate | Inside `getFastModeUnavailableReason` (deferred check) | Inside `isFastModeEnabled()` (hard gate at registry level) |
| Cooldown reasons | `rate_limit`, `overloaded` | Same |
| Telemetry events | `tengu_fast_mode_*` | Same |
| `tengu_penguins_off` GB key | Yes | Yes (legacy name preserved) |

### Why expose two variants

**The interactive variant (`local-jsx`)** shows the `FastModePicker` dialog with a Tab-to-toggle UI. It needs Ink (terminal React) and an interactive TTY. It can render unavailable reasons inline.

**The non-interactive variant (`local`)** parses `[on|off]` arg, calls `applyFastMode(boolean)`, returns a text result. No JSX, no dialog. Works in `claude -p "/fast on"`, the SDK, and Remote Control.

The slash-command resolver picks the variant based on the dispatch surface — interactive REPL gets the JSX, scripted contexts get the local form. This is the same dual-export pattern used for `/goal` (interactive `goalCommand` + non-interactive `goalNonInteractive`).

**Why not a single command that branches inside `call`?** Two reasons:
1. `supportsNonInteractive: true` is a static metadata flag the SDK reads to decide whether a command is invokable from `-p`. A `local-jsx` command can't declare this — the resolver assumes it requires Ink.
2. Branching inside the call (v2.1.88's pattern: `if (arg === 'on' || arg === 'off') ... else return <Picker />`) makes the dialog flow depend on argument presence, which is brittle. Splitting cleanly separates "show picker" from "apply preference".

### Why default to Opus 4.7 with 4.6 override env var

**Decision context:** v2.1.142 ships when Opus 4.7 is the latest Opus. Fast mode users want the latest model. But pinning may matter for cost models that pre-paid 4.6 capacity.

**Trade-off:**
- Default to 4.7: latest capability, but flips cost on users who budgeted for 4.6 fast inference.
- Default to 4.6: stable cost, but users miss out on 4.7 unless they re-toggle.

**Resolution:** default to 4.7 (new is better), and provide `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1` as the escape hatch. This is the "newer is default, older is opt-in" pattern.

### Why the `tengu_immediate_model_command` toggle for `immediate`

```javascript
function IaH() { return Z$("tengu_immediate_model_command", !1); }
```

`immediate: true` means the slash command takes effect on Enter without going through the picker dialog. This is a GrowthBook A/B test — Anthropic is measuring whether users prefer "type `/fast on` Enter" → done, vs. "type `/fast` Enter" → see picker → confirm.

For users in the `immediate` arm, `/fast` skips the picker; for users in the control arm, the picker shows.

**Trade-off:**
- Pro of immediate: fewer keystrokes, faster toggling for advanced users.
- Con of immediate: less awareness of the cost implication ($premium rate).

This experiment shipping behind a GB flag means Anthropic can measure outcomes (cost-shock complaints vs. usage satisfaction) before committing.

### What did NOT change

- The `penguin` codename in telemetry keys (`tengu_penguins_off`, `penguinModeOrgEnabled`)
- The theme color tokens `fastMode` and `fastModeShimmer`
- The settings keys (`fastMode`, `fastModePerSessionOptIn`)
- The cooldown UI flow (rate-limit and overloaded reasons)
- The org-policy `extra_usage` integration
- The keybinding alias `chat:fastMode` (meta+o)

---

## 4. Implementation analysis

### Decision: hoist first-party check into `isFastModeEnabled`

**What it does:** the v2.1.142 `_9()` gate refuses on non-first-party providers, hiding `/fast` from Bedrock/Vertex/Foundry users entirely.

**How it works:**
1. v2.1.88: `/fast` was in the command list for all users. Picker showed `"Fast mode is not available on Bedrock, Vertex, or Foundry"` as the reason.
2. v2.1.142: `/fast` is hidden (`isHidden: () => !_9()`). Bedrock users don't see it at all.

**Why this approach:**
- Cleaner UX: don't show users a command they can't use
- Less surface for confused tickets ("why is fast mode disabled?")
- Reduced complexity in the picker (one fewer error state to render)

**Trade-off:** a Bedrock user who reads docs about `/fast` will be confused when it doesn't autocomplete. The fix is documentation: "Available on first-party API only."

### Decision: `tengu_immediate_model_command` as a UX A/B test

**What it does:** experiment toggles whether `/fast` opens a picker or takes effect immediately.

**How it works:** GB flag (`tengu_immediate_model_command`) controls the `immediate` field on the command. Slash-command dispatcher reads this field; if true, the command's `call` is invoked directly without rendering the picker.

**Why ship this as a config flag:**
- A/B test cohort assignment is dynamic — different users see different behavior
- Measure outcomes (`tengu_fast_mode_toggled.source` distribution: "picker" vs. "shortcut" vs. "immediate") to inform default
- Roll back instantly if the immediate variant degrades safety (user accidentally enables expensive mode)

### Decision: `thinClientDispatch: "control-request"`

**What it does:** when the slash command is invoked via Remote Control (`/remote-control` session), the thin client dispatches a "control-request" to the daemon rather than trying to render the JSX picker on the thin client.

**How it works:**
1. Thin client sees `/fast` typed in browser/phone
2. Sends "control-request" to daemon with command name + args
3. Daemon handles the toggle (modifies settings on the host)
4. Thin client receives a result string and renders it

**Why this matters:**
- The picker UI is Ink (terminal-only); rendering JSX dialogs in a phone browser would be wrong
- The thin client's job is to dispatch user intent, not render terminal UIs
- This generalizes — `/fast`, `/effort`, `/model` all want the same "control-request" dispatch

### Decision: cleared cooldown on every apply

```javascript
// inside applyFastMode (~96940-96950 vicinity)
clearFastModeCooldown();
updateSettingsForSource("userSettings", { fastMode: enable ? true : void 0 });
```

When the user toggles `/fast on`, any prior cooldown is cleared. The reasoning:
- The cooldown is the system saying "rate limit hit, wait N minutes"
- If the user *explicitly* toggles on, they're acknowledging the cost — clear the cooldown and let them retry immediately
- The retry will either succeed (cooldown was stale) or re-cooldown (still hitting limits)

This is more user-respectful than "you're in cooldown, can't toggle on for 5 min" — the user knows what they're doing.

---

## 5. Public entry points

### Slash command surface
- `/fast` — opens picker dialog (or takes effect immediately if `tengu_immediate_model_command` is true)
- `/fast on` — enable fast mode (also switches model to Opus 4.6/4.7 if current model doesn't support fast)
- `/fast off` — disable fast mode (model stays — not auto-reverted)

### Keybinding
- `meta+o` (Mac Cmd+O, Linux/Win Alt+O) — dispatches `chat:fastMode` action, which toggles fast mode without typing the slash command

### Settings keys
- `fastMode: boolean` — persistent preference. `userSettings.fastMode = true` enables fast on every session unless cooldown kicks in.
- `fastModePerSessionOptIn: boolean` — when true, fast mode starts OFF every session and the user must re-enable. For orgs that want explicit per-session opt-in.

### Environment variables
- `CLAUDE_CODE_DISABLE_FAST_MODE=1` — hard disable (overrides setting)
- `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1` — pin fast mode to Opus 4.6 instead of 4.7
- `CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS=1` — when org-check endpoint is unreachable, bypass (lets corporate proxies through)
- `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK=1` — bypass org-policy check entirely (testing)

### Programmatic
- `applyFastMode(enable: boolean, setAppState)` — the lowest-level apply function
- `handleFastModeShortcut(enable, getAppState, setAppState)` — the `[on|off]` shortcut handler
- `prefetchFastModeStatus()` — kicks the org-policy preflight; called from app startup

### From CLI (`-p` / SDK)
- `claude -p "/fast on"` — works in v2.1.142 (via the `local` variant); did NOT work in v2.1.88 (would have rendered nothing)
- Same usage from SDK and Remote Control

---

## 6. Cross-references

- See `by_version/v2.1.113-114.md` for fast mode cooldown UI fixes
- See `00_overview/symbol_index_core_features.md` for `tengu_fast_mode_*` event catalogue

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isFastModeEnabled` (`_9`) — top-level gate (cli_inner_pretty.js:96854)
- `getFastModeUnavailableReason` (`Da`) — composite reason check (cli_inner_pretty.js:96881)
- `isFastModeSupportedByModel` (`Uw`) — model whitelist check (cli_inner_pretty.js:96922)
- `getFastModeModelDisplay` (`Yu`) — "Opus 4.6"/"Opus 4.7" display (cli_inner_pretty.js:96908)
- `isOpus46FastModeOverride` (`Cc`) — env var read (cli_inner_pretty.js:96905)
- `getFastModeRuntimeState` (`Wi8`) — cooldown state (cli_inner_pretty.js:96929)
- `triggerFastModeCooldown` (`nsq`) — sets cooldown (cli_inner_pretty.js:96936)
- `clearFastModeCooldown` (`RzH`) — clears cooldown (cli_inner_pretty.js:96944)
- `disableFastModeForPreference` (`isq`) — org-policy disable (cli_inner_pretty.js:96947)
- `fastInteractiveCommand` (`Ev5`) — JSX picker entry (cli_inner_pretty.js:484225)
- `fastNonInteractiveCommand` (`KP4`) — local on/off entry (cli_inner_pretty.js:484242)
- `isImmediateModelCommandEnabled` (`IaH`) — A/B flag for picker bypass (cli_inner_pretty.js:483882)

---

## Deep Analysis: Promotion Mechanism

### What changed at the gate

Fast Mode's promotion in v2.1.142 is the most subtle of the four features — there is **no GrowthBook gate flip**. The feature was already public in v2.1.88; the v2.1.142 changes are about (a) **default model flip** Opus 4.6 → 4.7, (b) **command surface split** local-jsx → local-jsx + local (non-interactive), and (c) **gate hoist** moving the first-party check from a deferred reason-message into the registry-level `isEnabled`.

**v2.1.88 — Gate (line-for-line)**

```typescript
// src/utils/fastMode.ts:38-40
export function isFastModeEnabled(): boolean {
  return !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_FAST_MODE)
}
```

Single check: only the env-var hard-disable. The first-party check lives in `getFastModeUnavailableReason()`, called *after* the command is already in the registry — so Bedrock users saw `/fast` grayed out with a "Fast mode is not available on Bedrock, Vertex, or Foundry" reason.

**v2.1.142 — Gate (line-for-line)**

```javascript
// cli_inner_pretty.js:96854-96857
function _9() {
  if (vq() !== "firstParty") return !1;
  return !bH(process.env.CLAUDE_CODE_DISABLE_FAST_MODE);
}
```

Two checks composed. The first-party check now **gates registry visibility itself** (`isHidden: () => !_9()` at line 484236). Bedrock users no longer see `/fast` at all.

**v2.1.88 — Model selection (line-for-line)**

```typescript
// src/utils/fastMode.ts:167-176
export function isFastModeSupportedByModel(modelSetting: ModelSetting): boolean {
  if (!isFastModeEnabled()) return false
  const model = modelSetting ?? getDefaultMainLoopModelSetting()
  const parsedModel = parseUserSpecifiedModel(model)
  return parsedModel.toLowerCase().includes('opus-4-6')
}
export const FAST_MODE_MODEL_DISPLAY = 'Opus 4.6'
export function getFastModeModel(): string {
  return 'opus' + (isOpus1mMergeEnabled() ? '[1m]' : '')
}
```

**v2.1.142 — Model selection (line-for-line)**

```javascript
// cli_inner_pretty.js:96905-96928
function Cc() { return bH(process.env.CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE); }
function Yu() { return Cc() ? "Opus 4.6" : "Opus 4.7"; }
function VxH() { return (Cc() ? "claude-opus-4-6" : "opus") + (wL() ? "[1m]" : ""); }
function Uw(H) {
  if (!_9()) return !1;
  let $ = H ?? UJ(), K = n7($).toLowerCase();
  if (Cc()) return K.includes("opus-4-6");
  return K.includes("opus-4-6") || K.includes("opus-4-7");
}
```

Three new functions (`Cc`, `Yu`, `VxH`) and one expanded function (`Uw`). The expansion: `parsed.includes("opus-4-6")` became `parsed.includes("opus-4-6") || parsed.includes("opus-4-7")` — gated by the `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` escape hatch.

### Why this promotion approach

**Design rationale for the default model flip (4.6 → 4.7):**

When Opus 4.7 launched, Anthropic had two options for fast mode users:

1. **Keep fast mode on 4.6.** Stable cost, stable behavior. But users explicitly opted into "fast and premium" — staying on the older model is a step backward.
2. **Flip default to 4.7.** Latest capability, but breaks any user who budgeted around 4.6 cost or has compatibility assumptions.

Anthropic chose (2) + an env-var escape hatch (`CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1`). The rationale is observable in the code structure:

- `Cc()` is a *pure env-var read* — zero config infrastructure, zero GB plumbing. Cheapest possible escape hatch.
- The override sets *both* display name (`Yu`) **and** model ID (`VxH`) **and** support filter (`Uw`). All three flip together, so a user pinning to 4.6 gets a consistent experience.
- The default-to-4.7 ships in the binary; only users who actively configure the env var get 4.6. This is the **"newer is default, older is opt-in"** pattern.

**Alternatives considered:**

| Alternative | Why rejected |
|---|---|
| GrowthBook flag `fast_mode_model: "opus-4-6" or "opus-4-7"` | Adds remote dependency to a hot-path model selection; cost of GB miss = wrong model used |
| `settings.json` field `fastModeModel` | More config surface; users would have to discover and set it; not CI-friendly |
| Both 4.6 and 4.7 supported, user picks at toggle time | Adds UX complexity to the picker; most users don't care |
| Keep 4.6 default forever | Loses 4.7 capability for the premium audience; defeats the point of fast mode |

**Why expose two slash command variants (`local-jsx` + `local`):**

- `local-jsx` is **mandatory for the picker UI**. The picker is an Ink (terminal React) component — can't be invoked without a TTY + render loop.
- `local` is **mandatory for `claude -p` / SDK / Remote Control**. Those contexts have no Ink. A `local-jsx` command invoked from `-p` would either error or no-op.
- v2.1.88 had only `local-jsx` → `claude -p "/fast on"` silently rendered nothing. v2.1.142 splits into two registry entries; the dispatcher picks based on `supportsNonInteractive` metadata.

This is **not** a runtime decision branch inside `call()` — it's two static command objects. The reason: `supportsNonInteractive: true` must appear in the metadata so the SDK's command resolver knows whether to allow the command in scripted contexts. Branching inside `call()` would be invisible to the resolver.

**Trade-offs:**

| Trade-off | Resolution |
|---|---|
| Default 4.7 may break 4.6-pinned users | `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` env var |
| Hoist first-party check into gate | Bedrock users lose visibility into the feature; mitigated by docs |
| Two command variants | More code; cleaner SDK semantics |
| `tengu_immediate_model_command` GB A/B | Adds UX inconsistency between cohorts; lets data drive the decision |

### Step-by-step runtime decision flow

```
User types  "/fast on"  in REPL
─────────────────────────────────
  Slash command resolver
   │
   ▼  Filter by isEnabled / isHidden
  Look up "fast" in command registry
   │  Two candidates: Ev5 (local-jsx) + KP4 (local)
   │
   ▼  Dispatch surface = "repl" → pick local-jsx (Ev5)
   ▼  Ev5.isHidden() → !_9()
  ┌────────────────────────────────────┐
  │ _9() [96854]                       │
  │  vq() === "firstParty" ?           │
  │   ─ Bedrock/Vertex/Foundry: hidden │
  │  CLAUDE_CODE_DISABLE_FAST_MODE !1? │
  └────────────┬───────────────────────┘
               │ visible
               ▼  Ev5.immediate → IaH() reads
               │  Z$("tengu_immediate_model_command", false)
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   immediate=true   immediate=false
        │             │
        ▼             ▼
   Skip picker     Open FastModePicker dialog
   call directly   user navigates Tab / Enter
        │             │
        └──────┬──────┘
               │
               ▼  parse arg "on"|"off"|undefined
        ┌─────────────────────────────────────┐
        │ handleFastModeShortcut(true, ...)   │
        │   ─ clearFastModeCooldown()         │
        │   ─ updateSettingsForSource(        │
        │       "userSettings",               │
        │       {fastMode:true})              │
        │   ─ if !isFastModeSupportedByModel: │
        │       switch mainLoopModel to       │
        │       VxH() → "opus"|"opus-4-6"     │
        │   ─ setAppState({fastMode:true})    │
        │   ─ logEvent("tengu_fast_mode_      │
        │              toggled", {source:...})│
        └─────────────────────────────────────┘

Branch 2: SDK / -p flag  "claude -p '/fast on'"
─────────────────────────────────────────────
   │  Non-interactive resolver
   ▼  Filter commands by supportsNonInteractive===true
   │  Picks KP4 (the local variant), NOT Ev5
   │
   ▼  KP4.call({args:"on"})
   │  Returns a text result string
   │  Process exits normally
```

### Model selection algorithm (the v2.1.142 default-flip in detail)

The key algorithm is `Uw(H)` (`isFastModeSupportedByModel`):

```
function isFastModeSupportedByModel(modelOpt):
  if not _9(): return false                       # gate
  model = modelOpt ?? getDefaultMainLoopModelSetting()
  parsed = parseUserSpecifiedModel(model).lowercase()
  if isOpus46FastModeOverride():
    return parsed.contains("opus-4-6")              # 4.6 ONLY when overridden
  return parsed.contains("opus-4-6") OR parsed.contains("opus-4-7")
```

The crucial subtlety: when the user runs `/fast on`, the toggle calls `applyFastMode(true, setAppState)`, which checks `!isFastModeSupportedByModel(prev.mainLoopModel)` and **switches the model** if the current one doesn't support fast.

The substitution target is `VxH()`:

```
function getFastModeModelId():
  base = isOpus46FastModeOverride() ? "claude-opus-4-6" : "opus"
  suffix = isOpus1mMergeEnabled() ? "[1m]" : ""
  return base + suffix
```

So when a v2.1.88 user upgrades:
- Default `mainLoopModel` is still `"opus"` (means "latest Opus")
- `parseUserSpecifiedModel("opus")` resolves to e.g. `"claude-opus-4-7-..."`
- `parsed.contains("opus-4-7")` → true → fast mode supported without model switch
- User experiences fast mode on Opus 4.7 without doing anything

A user with `mainLoopModel: "claude-opus-4-6-..."` set explicitly:
- Falls into the 4.6 branch — already supported
- No model switch happens
- User stays on 4.6 even without the env override (because their pinned model already qualifies)

A user with `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1`:
- `VxH()` returns `"claude-opus-4-6"` — pinned model string
- `Uw()` only accepts 4.6 — even if user manually sets `mainLoopModel` to 4.7, fast mode switches them back to 4.6
- The override is sticky: it's a "I only want 4.6 fast" declaration

### Key insight

**Fast Mode's promotion is a model-default flip masquerading as a feature gate change.** The user-visible change is "fast mode now uses 4.7 by default," and the binary-visible change is "`/fast` is now properly invokable from `-p`." These two changes share a single release because they jointly complete the **user contract**: fast mode is a paid premium tier (4.7 model), accessible from any interface (interactive or scripted). The env-var escape hatch (`CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE`) is the smallest possible escape valve — no GB, no setting, no plumbing — for the small minority of users who specifically need 4.6.

### Trade-offs analysis

| Decision | Cost | Benefit |
|---|---|---|
| Hoist first-party check into `_9()` | Bedrock users lose visibility into `/fast` entirely | Cleaner UX; one fewer error state to render in picker |
| Default model 4.6 → 4.7 | Cost-shock risk for 4.6-budgeted users | Latest capability for the premium audience |
| `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` escape hatch | One more env var to document | Trivial escape mechanism; no infra cost |
| Two slash command variants (jsx + local) | More code, two registry entries | Works in both REPL and SDK; clean metadata-driven dispatch |
| `tengu_immediate_model_command` A/B | Inconsistent UX between cohorts during the test | Data-driven decision on picker-vs-immediate default |
| `thinClientDispatch: "control-request"` | Thin client needs control-request handler | `/fast` works correctly on phone/browser remote control |
| Cleared cooldown on every apply | User can hammer-toggle into rate limit | User-respectful: respect explicit choice over passive rate-limit |
| Keep "penguin" codename in telemetry | Legacy noise in dashboards | Backward-compat with v2.1.88 dashboards; no schema migration |
