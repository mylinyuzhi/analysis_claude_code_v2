# Auto Mode No Longer Requires Opt-In Consent + VSCode Mode-Picker Surfacing (2.1.152 / 2.1.156)

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `resolveAutoModeEnabledState` (`kV5`) — three-state config resolver returning `enabled`/`disabled`/`opt-in`, default `opt-in` (cli_inner_pretty.js:211657-211660)
- `sendVscodeExperimentGates` (`y97`) — VSCode bridge that pushes `experiment_gates`, mapping `opt-in` → `enabled` for `tengu_auto_mode_state` (cli_inner_pretty.js:211664-211687)
- `isAutoModeConfigDisabled` (`IL5`) — circuit-breaker check, true only when config `enabled === "disabled"` (cli_inner_pretty.js:185018-185021)
- `NO_CACHED_AUTO_MODE_CONFIG` (`H87`) — sentinel for "config not yet read from disk" (cli_inner_pretty.js:185129, 185144)
- `getAutoModeModel` (`vE7`) — reads `tengu_auto_mode_config.model` override (cli_inner_pretty.js:277898-277907)
- `getTwoStageClassifierSetting` (`UE7`) — reads `twoStageClassifier`, default `true` (cli_inner_pretty.js:277908-277910)
- `isJsonlTranscriptEnabled` (`kE7`) — reads `jsonlTranscript === true` (cli_inner_pretty.js:277915-277917)
- `classifierCouldNotEvaluateReason` (`rY8`) — the "could not evaluate / blocking for safety" string (cli_inner_pretty.js:277918-277920)
- `isAutoModeGateEnabled` (`h0`) — plan/circuit/model gate; does NOT consult opt-in consent (cli_inner_pretty.js:443051-443056)
- `getAutoModeUnavailableReason` (`kl`) — maps gate failure to `settings`/`circuit-breaker`/`model` (cli_inner_pretty.js:443057-443062)
- `isAutoModeOptInDismissed` (`i4q`) — dismissal predicate for the Shift+Tab cycle (cli_inner_pretty.js:578709-578711)
- `canCycleToAuto` (`PR8`) — gate for whether Shift+Tab can reach auto (cli_inner_pretty.js:578696-578708)
- `cycleNextMode` (`QCH`) — Shift+Tab mode-cycle state machine (cli_inner_pretty.js:578712-578730)
- `AutoModeOptInDialog` (`r4q`) — the opt-in dialog component (cli_inner_pretty.js:578742-578831)
- `AUTO_MODE_DESCRIPTION` (`n19`) — the dismissable explanatory notice text (cli_inner_pretty.js:578843-578844)
- `handleCycleMode` (`ym`) — PromptInput Shift+Tab handler that arms the 800ms consent debounce (cli_inner_pretty.js:585340-585429)
- `handleAutoModeAccept` (`iC`) — accept handler that enters auto mode (cli_inner_pretty.js:585430-585447)
- `handleAutoModeOptInDecline` (`hm`) — decline handler that clears pending consent (cli_inner_pretty.js:585448-585464)
- `onSubmit` (`F_`) — prompt-submit callback with consent-debounce short-circuit (cli_inner_pretty.js:584947-584959)
- `showAutoModeOptIn` / `setShowAutoModeOptIn` (`Hz` / `T1`) — dialog-visibility state (cli_inner_pretty.js:584569)
- `autoModeOptInPrevMode` / `setAutoModeOptInPrevMode` (`kz` / `$f`) — saved pre-auto mode (cli_inner_pretty.js:584570)
- `consentDebounceCancelRef` (`H1`) — ref holding the 800ms timer's cancel function (cli_inner_pretty.js:584571)

---

## TL;DR

Across this window, **the explicit blocking opt-in consent for auto mode is gone**. Two changes drive it:

1. **2.1.152 — "Auto mode no longer requires opt-in consent."** Cycling into auto mode via Shift+Tab no longer pops a modal that *blocks* the user from doing anything until they answer. Instead, `handleCycleMode` (`ym`) arms an **800ms debounce** before showing the dialog (cli_inner_pretty.js:585381-585383). The very next `onSubmit` (`F_`) within that window detects the still-pending debounce and *re-shows the dialog instead of submitting* (cli_inner_pretty.js:584953-584959) — the dialog has become a soft, in-flow prompt rather than a startup gate. Declining clears the pending consent without exiting the process (`handleAutoModeOptInDecline` `hm`, cli_inner_pretty.js:585448-585464).

2. **2.1.156 — VSCode surfacing.** The VSCode bridge `y97` reports the auto-mode state to the extension via an `experiment_gates` notification and **maps the `opt-in` config value to `enabled`** when setting `tengu_auto_mode_state` (cli_inner_pretty.js:211682). Net effect: the VSCode mode-picker shows auto mode **without** requiring the user to have the bypass-permissions setting turned on. The first time auto mode is active, the `AUTO_MODE_DESCRIPTION` notice (`n19`, cli_inner_pretty.js:578843-578844) explains it once (dismissable).

**Honesty note (confidence: medium on the literal gate-deletion claim).** I can pin the *new* non-blocking machinery (the 800ms debounce, the `opt-in → enabled` mapping, the decline-clears-consent path) to exact lines. The precursor 2.1.88 had a hard **blocking** startup gate (`interactiveHelpers.tsx:224-235`: `showSetupDialog(... declineExits ... gracefulShutdownSync(1))`). That blocking gate is **not present** in the 2.1.156 startup path — the dialog now lives inside the PromptInput component flow. But because I am inferring removal from *absence-plus-replacement* rather than pointing at a single deleted `if`, the exact "the consent gate was deleted" claim is **medium confidence**, while the "auto mode surfaces without bypass-permissions / consent no longer blocks" behavior is **high confidence**.

---

## 1. The three-state config: `enabled` / `disabled` / `opt-in`

Auto mode is configured through the server-driven `tengu_auto_mode_config` value (read via `V$`, the cached-config accessor). Its `enabled` field is **tri-state**, not a boolean.

```javascript
// ============================================
// resolveAutoModeEnabledState - Three-state auto-mode config resolver (default opt-in)
// Location: cli_inner_pretty.js:211657-211660
// ============================================

// ORIGINAL (for source lookup):
function kV5() {
  let H = V$("tengu_auto_mode_config", {})?.enabled;
  return H === "enabled" || H === "disabled" || H === "opt-in" ? H : "opt-in";
}

// READABLE (for understanding):
function resolveAutoModeEnabledState() {
  let enabledField = getCachedConfig("tengu_auto_mode_config", {})?.enabled;
  // Only three values are valid; anything else (missing / garbage) falls back to "opt-in".
  return enabledField === "enabled" || enabledField === "disabled" || enabledField === "opt-in"
    ? enabledField
    : "opt-in";
}

// Mapping: kV5→resolveAutoModeEnabledState, V$→getCachedConfig, H→enabledField
```

### What the three states mean

| `enabled` value | Meaning | Resolver behavior |
|-----------------|---------|-------------------|
| `"enabled"` | Org / server has turned auto mode on outright | returned as-is |
| `"disabled"` | Circuit-breaker — auto mode is *off* for this plan/org | returned as-is; also tripped by `IL5` |
| `"opt-in"` | Available, historically required user consent | returned as-is locally, but **the VSCode bridge promotes it to `enabled`** (see §2) |
| anything else | malformed / not yet set | **defaults to `"opt-in"`** |

The disabled-only circuit-breaker is a separate helper that distinguishes "not configured" from "explicitly disabled":

```javascript
// ============================================
// isAutoModeConfigDisabled - True only when config explicitly says enabled === "disabled"
// Location: cli_inner_pretty.js:185018-185021
// ============================================

// ORIGINAL (for source lookup):
function IL5() {
  let H = V$("tengu_auto_mode_config", H87);
  return H !== H87 && H?.enabled === "disabled";
}

// READABLE (for understanding):
function isAutoModeConfigDisabled() {
  let cfg = getCachedConfig("tengu_auto_mode_config", NO_CACHED_AUTO_MODE_CONFIG);
  // Sentinel default distinguishes "never read from disk" from "{}" — we only
  // report disabled when the config is actually present AND says "disabled".
  return cfg !== NO_CACHED_AUTO_MODE_CONFIG && cfg?.enabled === "disabled";
}

// Mapping: IL5→isAutoModeConfigDisabled, V$→getCachedConfig, H87→NO_CACHED_AUTO_MODE_CONFIG, H→cfg
```

`NO_CACHED_AUTO_MODE_CONFIG` (`H87`) is a `Symbol` (cli_inner_pretty.js:185144) created lazily inside the module init thunk. Using a unique symbol as the default lets `IL5` tell apart "the disk cache hasn't loaded yet" (returns the symbol) from "config loaded and is empty `{}`". This matters because a cold cache should NOT be treated as `disabled`.

**Why a Symbol and not `null`/`undefined`?** A legitimate stored config could be `null` or `{}`; a Symbol can never collide with any JSON value the server could send, so the "not-yet-cached" sentinel is unforgeable. This is the same defensive pattern used elsewhere in the bundle for "uninitialized vs explicitly empty" distinctions.

There is also a duplicate of the tri-state validator at `an6` (cli_inner_pretty.js:443063-443065) with `fk$`/`sn6` (443067-443075) wrappers, used by the runtime gate path rather than the VSCode bridge path. They validate the same three strings.

---

## 2. The VSCode bridge: `opt-in` becomes `enabled`

This is the heart of the **2.1.156 VSCode mode-picker** change. When a `claude-vscode` MCP transport connects, the CLI pushes the current experiment/feature gates to the extension. Auto mode is reported as `tengu_auto_mode_state`, and the bridge **rewrites `opt-in` → `enabled`** so the extension surfaces auto mode in its picker without the user first toggling bypass-permissions.

```javascript
// ============================================
// sendVscodeExperimentGates - Pushes experiment_gates to VSCode; promotes opt-in to enabled
// Location: cli_inner_pretty.js:211664-211687
// ============================================

// ORIGINAL (for source lookup):
function y97(H) {
  let $ = H.find((q) => q.name === "claude-vscode");
  if ($ && $.type === "connected") {
    ((E97 = $),
      $.client.setNotificationHandler(qZ6(), async (_) => {
        let { eventName: z, eventData: A } = _.params;
        d(`tengu_vscode_${z}`, A);
      }));
    let q = {
        tengu_vscode_review_upsell: V$("tengu_vscode_review_upsell", !1),
        tengu_vscode_onboarding: V$("tengu_vscode_onboarding", !1),
        tengu_quiet_fern: !0,
        tengu_vscode_cc_auth: !0,
        tengu_slate_ribbon: !0,
        tengu_brick_follow: V$("tengu_brick_follow", !1),
        tengu_vellum_siding: V$("tengu_vellum_siding", !1),
      },
      K = kV5();
    ((q.tengu_auto_mode_state = K === "opt-in" ? "enabled" : K),
      $.client.notification({ method: "experiment_gates", params: { gates: q } }).catch((_) => {
        N(`[VSCode] Failed to send experiment_gates notification: ${_.message}`);
      }));
  }
}

// READABLE (for understanding):
function sendVscodeExperimentGates(transports) {
  let vscode = transports.find((t) => t.name === "claude-vscode");
  if (vscode && vscode.type === "connected") {
    connectedVscodeTransport = vscode;
    // Forward every "log_event" the extension emits back as a tengu_vscode_* telemetry event.
    vscode.client.setNotificationHandler(vscodeLogEventSchema(), async (msg) => {
      let { eventName, eventData } = msg.params;
      logEvent(`tengu_vscode_${eventName}`, eventData);
    });

    let gates = {
      tengu_vscode_review_upsell: getCachedConfig("tengu_vscode_review_upsell", false),
      tengu_vscode_onboarding:    getCachedConfig("tengu_vscode_onboarding", false),
      tengu_quiet_fern: true,
      tengu_vscode_cc_auth: true,
      tengu_slate_ribbon: true,
      tengu_brick_follow:  getCachedConfig("tengu_brick_follow", false),
      tengu_vellum_siding: getCachedConfig("tengu_vellum_siding", false),
    };

    let autoModeState = resolveAutoModeEnabledState();   // enabled | disabled | opt-in

    // *** The 2.1.156 surfacing change: opt-in is reported to VSCode as enabled. ***
    // This makes the VSCode mode-picker show auto mode without requiring the
    // bypass-permissions setting to be turned on first.
    gates.tengu_auto_mode_state = autoModeState === "opt-in" ? "enabled" : autoModeState;

    vscode.client
      .notification({ method: "experiment_gates", params: { gates } })
      .catch((err) => log(`[VSCode] Failed to send experiment_gates notification: ${err.message}`));
  }
}

// Mapping: y97→sendVscodeExperimentGates, H→transports, $→vscode, q→gates, K→autoModeState,
//          kV5→resolveAutoModeEnabledState, V$→getCachedConfig, d→logEvent, qZ6→vscodeLogEventSchema,
//          E97→connectedVscodeTransport, N→log
```

### How the surfacing works, step by step

```
        ┌────────────────────────────────────────────────────────┐
        │  CLI process (Claude Code)                              │
        │                                                         │
        │  tengu_auto_mode_config.enabled = "opt-in"  (default)   │
        │            │                                            │
        │            ▼                                            │
        │   kV5() → "opt-in"                                      │
        │            │                                            │
        │            ▼  y97 promotion                             │
        │   gates.tengu_auto_mode_state = "enabled"  ◄── KEY STEP │
        │            │                                            │
        │            ▼  notification: experiment_gates            │
        └────────────┼────────────────────────────────────────────┘
                     │  (MCP, claude-vscode transport)
                     ▼
        ┌────────────────────────────────────────────────────────┐
        │  VSCode extension                                       │
        │   reads tengu_auto_mode_state = "enabled"               │
        │   → auto mode appears in the mode picker                │
        │   → no bypass-permissions setting required              │
        └────────────────────────────────────────────────────────┘
```

1. `resolveAutoModeEnabledState` (`kV5`) reads the config; for a default install it returns `"opt-in"` (cli_inner_pretty.js:211659).
2. `sendVscodeExperimentGates` (`y97`) computes `K = kV5()` (cli_inner_pretty.js:211681).
3. The promotion line `K === "opt-in" ? "enabled" : K` (cli_inner_pretty.js:211682) collapses both `"opt-in"` and `"enabled"` to `"enabled"`, leaving only `"disabled"` to suppress auto mode.
4. The gate bundle is sent via an `experiment_gates` MCP notification (cli_inner_pretty.js:211683).

### Why this approach

**Decision: promote at the bridge boundary, not in the core resolver.** The CLI's own gate logic still distinguishes `opt-in` (see `an6`/`fk$` at 443063-443069 and the runtime `h0` gate in §4). Only the **reported** state crossing into VSCode is collapsed. This is deliberate:

- The terminal CLI still has the in-flow opt-in dialog (§3) for the case where the user actively cycles into auto. The VSCode UX is different — the picker is a discoverable surface, and a "you must consent before it even shows up" model would hide the feature entirely. Promoting `opt-in → enabled` at the bridge lets VSCode **display and offer** auto mode while leaving the per-action safety classifier (the real protection) fully intact.
- Keeping the promotion local to `y97` means the change is surgical: nothing in the classifier, the circuit-breaker, or the CLI mode-cycle had to move. The only behavioral delta is "the picker shows it."

**Key insight:** Consent was never the safety boundary — the per-tool-call classifier is. The opt-in dialog was a *friction* feature ("are you sure you want Claude to auto-approve?"), and friction that blocks discovery is counterproductive in an IDE. So the bridge reports auto mode as available and lets the user choose it from a normal picker; the classifier still hard-denies dangerous actions on every call regardless.

`tengu_auto_mode_state` is emitted **only** at cli_inner_pretty.js:211682 — there is no other producer of that gate in the bundle, confirming the bridge is its sole source.

---

## 3. The opt-in dialog made non-blocking (2.1.152)

In 2.1.88 the opt-in consent was a **hard startup gate**. Cross-validation (high confidence) from `interactiveHelpers.tsx:224-235`:

```tsx
// 2.1.88 — src/interactiveHelpers.tsx:224-235 (PRECURSOR, blocking)
if (feature('TRANSCRIPT_CLASSIFIER')) {
  if (permissionMode === 'auto' && !hasAutoModeOptIn()) {
    const { AutoModeOptInDialog } = await import('./components/AutoModeOptInDialog.js');
    await showSetupDialog(root, done =>
      <AutoModeOptInDialog onAccept={done}
        onDecline={() => gracefulShutdownSync(1)}   // ← declining KILLS the process
        declineExits />);
  }
}
```

`showSetupDialog` is awaited at startup and **blocks the REPL from mounting**; `declineExits` plus `gracefulShutdownSync(1)` means "say no and the CLI exits." That is the consent gate that was removed.

In 2.1.156 the dialog moved *into* the live `PromptInput` component and is driven by three pieces of local React state (cli_inner_pretty.js:584569-584571):

- `showAutoModeOptIn` / `setShowAutoModeOptIn` (`Hz` / `T1`) — whether the dialog is visible
- `autoModeOptInPrevMode` / `setAutoModeOptInPrevMode` (`kz` / `$f`) — the mode the user was in before cycling to auto (so decline can restore it)
- `consentDebounceCancelRef` (`H1`) — a `useRef` holding the **cancel function** for a pending 800ms timer

### 3a. Arming the debounce — `handleCycleMode` (`ym`)

When the user presses Shift+Tab and the next mode in the cycle is `auto`, instead of switching immediately or blocking, the handler **arms an 800ms timer** and returns:

```javascript
// ============================================
// handleCycleMode - Shift+Tab handler; arms 800ms debounce before showing opt-in dialog
// Location: cli_inner_pretty.js:585377-585394
// ============================================

// ORIGINAL (for source lookup):
let n6 = !1;
if (((n6 = b8 === "auto" && k$.mode !== "auto" && !lQ() && !e$), n6)) {
  if (($f(q.mode), H1.current)) H1.current();
  if (
    ((H1.current = Uj.setTimeout(() => {
      (T1(!0), (H1.current = null));
    }, 800)),
    SH("mode_switch"),
    qH)
  )
    YH(!1);
  return;
}
if (Hz || H1.current) {
  if (Hz) d("tengu_auto_mode_opt_in_dialog_decline", {});
  if ((T1(!1), H1.current)) (H1.current(), (H1.current = null));
  $f(null);
}

// READABLE (for understanding):
let cyclingIntoAuto = false;
if (((cyclingIntoAuto = nextMode === "auto" && currentCtx.mode !== "auto" && !autoModeFlagCli() && !isTeammateTask),
     cyclingIntoAuto)) {
  setAutoModeOptInPrevMode(appStateCtx.mode);        // remember where we were
  if (consentDebounceCancelRef.current) consentDebounceCancelRef.current();  // cancel any prior timer
  consentDebounceCancelRef.current = timers.setTimeout(() => {
    setShowAutoModeOptIn(true);                       // after 800ms with no submit → show dialog
    consentDebounceCancelRef.current = null;
  }, 800);
  setMetric("mode_switch");
  if (isFullscreen) setShowMenu(false);
  return;                                             // ← does NOT block; control returns to the REPL
}
// If a dialog/timer is already pending and we're cycling AWAY, tear it down:
if (showAutoModeOptIn || consentDebounceCancelRef.current) {
  if (showAutoModeOptIn) logEvent("tengu_auto_mode_opt_in_dialog_decline", {});
  setShowAutoModeOptIn(false);
  if (consentDebounceCancelRef.current) { consentDebounceCancelRef.current(); consentDebounceCancelRef.current = null; }
  setAutoModeOptInPrevMode(null);
}

// Mapping: ym→handleCycleMode, b8→nextMode, k$→cyclingCtx, q→appStateCtx, n6→cyclingIntoAuto,
//          H1→consentDebounceCancelRef, Uj→timers, T1→setShowAutoModeOptIn, $f→setAutoModeOptInPrevMode,
//          Hz→showAutoModeOptIn, lQ→autoModeFlagCli, e$→isTeammateTask, qH→isFullscreen, YH→setShowMenu, d→logEvent
```

The cycle order itself is `cycleNextMode` (`QCH`, cli_inner_pretty.js:578712-578730): `default → acceptEdits → plan → (bypass | auto) → default`, where `auto` is only reachable when `canCycleToAuto` (`PR8`) is true.

### 3b. The submit short-circuit — `onSubmit` (`F_`)

The reason the 800ms debounce works: the very next prompt submission within the window detects the still-pending timer, **fires the dialog instead of submitting**, and bails:

```javascript
// ============================================
// onSubmit - Consent-debounce short-circuit: pending debounce → show dialog, do not submit
// Location: cli_inner_pretty.js:584947-584959
// ============================================

// ORIGINAL (for source lookup):
F_ = Jq.useCallback(
  async (k$, b8 = !1) => {
    k$ = k$.trimEnd();
    let n6 = dH.getState();
    if (n6.footerSelection && l$.includes(n6.footerSelection)) return;
    if (n6.viewSelectionMode === "selecting-agent") return;
    if (H1.current !== null) {
      (H1.current(),
        (H1.current = null),
        T1(!0),
        N("[auto-mode] onSubmit: consent debounce pending — showing opt-in dialog instead of submitting"));
      return;
    }
    /* ...normal submit path continues below... */

// READABLE (for understanding):
const onSubmit = useCallback(
  async (text, isPaste = false) => {
    text = text.trimEnd();
    const appState = appStore.getState();
    if (appState.footerSelection && footerKeys.includes(appState.footerSelection)) return;
    if (appState.viewSelectionMode === "selecting-agent") return;

    // If the user just cycled into auto (within 800ms) and is now hitting Enter,
    // interpret that Enter as "I want to proceed" → cancel the timer and surface
    // the opt-in dialog NOW, instead of sending the prompt. The prompt is NOT lost
    // (we return early; the buffer is untouched).
    if (consentDebounceCancelRef.current !== null) {
      consentDebounceCancelRef.current();
      consentDebounceCancelRef.current = null;
      setShowAutoModeOptIn(true);
      log("[auto-mode] onSubmit: consent debounce pending — showing opt-in dialog instead of submitting");
      return;
    }
    /* ...normal submit path... */

// Mapping: F_→onSubmit, k$→text, b8→isPaste, n6→appState, H1→consentDebounceCancelRef,
//          T1→setShowAutoModeOptIn, dH→appStore, N→log
```

### 3c. Accept / decline

`handleAutoModeAccept` (`iC`, cli_inner_pretty.js:585430-585447) clears the dialog (`T1(!1), $f(null)`), tells any remote session `set_permission_mode: auto`, commits the new `toolPermissionContext` with `mode: "auto"`, and emits `mode_auto_enter`.

`handleAutoModeOptInDecline` (`hm`) is the **clears-pending-consent** path the task calls out — declining no longer exits the process; it just tears down the dialog/timer and optionally marks auto unavailable on "don't ask":

```javascript
// ============================================
// handleAutoModeOptInDecline - Clears pending consent on decline (non-exiting)
// Location: cli_inner_pretty.js:585448-585464
// ============================================

// ORIGINAL (for source lookup):
hm = Jq.useCallback(
  (k$) => {
    if (
      (N(`[auto-mode] handleAutoModeOptInDecline(${k$}): clearing pending consent (was ${kz})`),
      SH("mode_auto_opt_in_decline"),
      T1(!1),
      H1.current)
    )
      (H1.current(), (H1.current = null));
    if (kz) {
      if (($f(null), k$ === "dont-ask"))
        (K$((b8) => ({ ...b8, toolPermissionContext: { ...b8.toolPermissionContext, isAutoModeAvailable: !1 } })),
          K({ ...q, isAutoModeAvailable: !1 }));
    }
  },
  [kz, q, K$, K],
);

// READABLE (for understanding):
const handleAutoModeOptInDecline = useCallback(
  (reason) => {                                  // reason: "go-back" | "dont-ask"
    log(`[auto-mode] handleAutoModeOptInDecline(${reason}): clearing pending consent (was ${autoModeOptInPrevMode})`);
    setMetric("mode_auto_opt_in_decline");
    setShowAutoModeOptIn(false);
    if (consentDebounceCancelRef.current) {        // cancel any still-pending 800ms timer
      consentDebounceCancelRef.current();
      consentDebounceCancelRef.current = null;
    }
    if (autoModeOptInPrevMode) {
      setAutoModeOptInPrevMode(null);              // restore: we stay in the previous mode
      if (reason === "dont-ask") {                 // "don't ask again" → remove auto from this session's cycle
        setAppState((s) => ({ ...s, toolPermissionContext: { ...s.toolPermissionContext, isAutoModeAvailable: false } }));
        commitContext({ ...currentCtx, isAutoModeAvailable: false });
      }
    }
  },
  [autoModeOptInPrevMode, currentCtx, setAppState, commitContext],
);

// Mapping: hm→handleAutoModeOptInDecline, k$→reason, kz→autoModeOptInPrevMode, T1→setShowAutoModeOptIn,
//          H1→consentDebounceCancelRef, $f→setAutoModeOptInPrevMode, K$→setAppState, K→commitContext, q→currentCtx,
//          N→log, SH→setMetric
```

Note 585451 — the literal debug string `clearing pending consent (was ${kz})` is the exact anchor for "decline clears pending consent."

### 3d. The dialog component and its telemetry — `AutoModeOptInDialog` (`r4q`)

The dialog (cli_inner_pretty.js:578742-578831) offers four actions, each emitting a distinct event from the `tengu_auto_mode_opt_in_dialog` family (cli_inner_pretty.js:143179-143185):

- **"Yes, and make it my default mode"** → `tengu_auto_mode_opt_in_dialog_accept_default` (578759) + persists `skipAutoPermissionPrompt: true, permissions.defaultMode: "auto"` (578760)
- **"Yes, enable auto mode"** → `tengu_auto_mode_opt_in_dialog_accept` (578755) + persists `skipAutoPermissionPrompt: true` (578755)
- **"No, go back" / "No, exit"** → `tengu_auto_mode_opt_in_dialog_decline` (578765)
- **"No, don't ask again"** → `tengu_auto_mode_opt_in_dialog_decline_dont_ask` (578769) + sets `autoModeOptInDismissed`

On mount, `h0z` emits `tengu_auto_mode_opt_in_dialog_shown` (cli_inner_pretty.js:578838-578839). The full event family from the master event list (cli_inner_pretty.js:143179-143185):

```
tengu_auto_mode_opt_in_dialog_accept
tengu_auto_mode_opt_in_dialog_accept_default
tengu_auto_mode_opt_in_dialog_decline
tengu_auto_mode_opt_in_dialog_decline_dont_ask
tengu_auto_mode_opt_in_dialog_shown
```

The persisted `skipAutoPermissionPrompt` flag is exactly the field 2.1.88's `hasAutoModeOptIn()` read (`settings.ts:896-904`). In 2.1.88 that flag *gated whether the blocking dialog appeared at startup*. In 2.1.156 the same flag is still written on accept, but it no longer drives a blocking startup gate — it drives the in-flow dialog's "already accepted, don't re-show" suppression instead (`i4q` / `b$().autoModeOptInDismissed` checks at 578710, 578752, 578769).

**Why a debounce instead of an immediate dialog?** Because Shift+Tab is a *cycle* key — users tap it repeatedly to rotate through modes (`default → acceptEdits → plan → auto → default`). If the dialog popped instantly on every transient pass through `auto`, it would flicker open/closed during normal cycling and the user could never get *past* auto to reach `default`. The 800ms debounce means: only if the user **settles** on auto (or presses Enter to act) does the dialog materialize; tapping straight through dismisses the armed timer (the `if (Hz || H1.current)` teardown in `handleCycleMode`).

---

## 4. The dismissable notice + the runtime gate (it does NOT consult consent)

### The notice

The 2.1.156 changelog says: *"a dismissable notice on the new-session screen explains auto mode the first time it's active."* That notice text is `AUTO_MODE_DESCRIPTION` (`n19`, cli_inner_pretty.js:578843-578844):

> "Auto mode lets Claude handle permission prompts automatically — Claude checks each tool call for risky actions and prompt injection before executing. Actions Claude identifies as safe are executed, while actions Claude identifies as risky are blocked and Claude may try a different approach. Ideal for long-running tasks. Sessions are slightly more expensive. Claude can make mistakes that allow harmful commands to run, it's recommended to only use in isolated environments. Shift+Tab to change mode."

The same `AUTO_MODE_DESCRIPTION` export is consumed by the REPL/new-session screen (in 2.1.88 it is imported by `screens/REPL.tsx:248`), confirming this single string is the source for both the dialog body and the new-session notice.

### The runtime gate `h0` — consent is NOT a factor

Critically, **the per-session auto-mode availability gate does not check opt-in consent at all**:

```javascript
// ============================================
// isAutoModeGateEnabled - Runtime gate: circuit-breaker + settings-disable + model support only
// Location: cli_inner_pretty.js:443051-443062
// ============================================

// ORIGINAL (for source lookup):
function h0() {
  if (Pk?.isAutoModeCircuitBroken() ?? !1) return !1;
  if (on6()) return !1;
  if (!kQH(X7())) return !1;
  return !0;
}
function kl() {
  if (on6()) return "settings";
  if (Pk?.isAutoModeCircuitBroken() ?? !1) return "circuit-breaker";
  if (!kQH(X7())) return "model";
  return null;
}

// READABLE (for understanding):
function isAutoModeGateEnabled() {
  if (autoModeService?.isAutoModeCircuitBroken() ?? false) return false;  // server circuit-breaker
  if (isAutoModeDisabledBySettings()) return false;                       // disableAutoMode === "disable"
  if (!modelSupportsAutoMode(getActiveModel())) return false;             // model capability
  return true;                                                            // NOTE: no consent check
}
function getAutoModeUnavailableReason() {
  if (isAutoModeDisabledBySettings()) return "settings";
  if (autoModeService?.isAutoModeCircuitBroken() ?? false) return "circuit-breaker";
  if (!modelSupportsAutoMode(getActiveModel())) return "model";
  return null;
}

// Mapping: h0→isAutoModeGateEnabled, kl→getAutoModeUnavailableReason, Pk→autoModeService,
//          on6→isAutoModeDisabledBySettings, kQH→modelSupportsAutoMode, X7→getActiveModel
```

The three gate conditions are **circuit-breaker, settings-disable, and model support** — there is no `hasAutoModeOptIn()` term. This is corroborating evidence (medium-confidence for the "gate deleted" framing) that consent has been decoupled from availability: a user can reach auto mode whenever the model/plan/settings allow it; consent is now a soft in-flow confirmation, not a precondition. `canCycleToAuto` (`PR8`, 578696-578708) gates the Shift+Tab path on `isAutoModeAvailable && h0() && !i4q()` — again, no consent precondition, only the dismissal flag.

---

## 5. Auto-mode config read sites (the config surface)

The single `tengu_auto_mode_config` value backs several independent reads. Documenting them shows the config is read **lazily at each call site** (via the cached `V$`), not snapshotted once:

```javascript
// ============================================
// auto_mode_config read sites - default config + feature reads
// Location: cli_inner_pretty.js:185019, 211658, 277904-277916
// ============================================

// ORIGINAL (for source lookup):
let H = V$("tengu_auto_mode_config", H87);          // 185019  default-with-sentinel (IL5)
let H = V$("tengu_auto_mode_config", {})?.enabled;  // 211658  enabled flag (kV5)
let $ = V$("tengu_auto_mode_config", {});           // 277904  model override (vE7)
if ($?.model) return $.model;                       // 277905
function UE7() {                                     // 277908
  return V$("tengu_auto_mode_config", {})?.twoStageClassifier ?? !0;  // 277909
}
function kE7() {                                     // 277915
  return V$("tengu_auto_mode_config", {})?.jsonlTranscript === !0;     // 277916
}

// READABLE (for understanding):
getCachedConfig("tengu_auto_mode_config", NO_CACHED_AUTO_MODE_CONFIG);   // disabled-circuit-breaker probe
getCachedConfig("tengu_auto_mode_config", {})?.enabled;                  // tri-state, default opt-in
getCachedConfig("tengu_auto_mode_config", {})?.model;                    // optional classifier model override
function getTwoStageClassifierSetting() {
  return getCachedConfig("tengu_auto_mode_config", {})?.twoStageClassifier ?? true;  // default ON
}
function isJsonlTranscriptEnabled() {
  return getCachedConfig("tengu_auto_mode_config", {})?.jsonlTranscript === true;    // default OFF
}

// Mapping: V$→getCachedConfig, H87→NO_CACHED_AUTO_MODE_CONFIG, IL5→isAutoModeConfigDisabled,
//          kV5→resolveAutoModeEnabledState, vE7→getAutoModeModel, UE7→getTwoStageClassifierSetting,
//          kE7→isJsonlTranscriptEnabled
```

- **185019** — `IL5` disabled-probe (uses the `H87` sentinel default, §1).
- **211658** — `kV5` enabled flag (the consent-state input to the VSCode bridge, §2).
- **277904-277905** — `vE7` (`getAutoModeModel`) reads `.model` to optionally override the classifier model. (Above it, 277900-277902, an Opus-4.8 `tengu_cedar_hollow_7m.model` override takes precedence.)
- **277909** — `UE7` (`getTwoStageClassifierSetting`) reads `.twoStageClassifier`, defaulting to `true`; `$i5` (277911-277913) accepts `true`/`"fast"`/`"thinking"`.
- **277916** — `kE7` (`isJsonlTranscriptEnabled`) reads `.jsonlTranscript`, defaulting to `false`.

Adjacent context worth knowing: `rY8` (cli_inner_pretty.js:277918-277920) is the "Auto mode could not evaluate this action and is blocking it for safety — run with --debug for details" message. The companion 2.1.156 fix (the stage-2 classifier output-budget doubling, 4096 → 8192, covered in the sibling classifier doc) reduced how often `rY8` fires by giving the classifier room to finish reasoning. `vc` (277921+) is the classifier success/error metric reporter.

---

## 6. Cross-validation against 2.1.88

| Symbol / behavior | 2.1.88 precursor | Confidence | Notes |
|-------------------|------------------|-----------|-------|
| `AutoModeOptInDialog` component + 4 actions | `src/components/AutoModeOptInDialog.tsx:17,38,47,59,140` (same `tengu_auto_mode_opt_in_dialog_*` events) | **high** | Component is a direct descendant; same telemetry names. |
| `AUTO_MODE_DESCRIPTION` notice text | `src/components/AutoModeOptInDialog.js` export, imported by `screens/REPL.tsx:248` | **high** | Same export, reused for the new-session notice. |
| `skipAutoPermissionPrompt` consent flag | `hasAutoModeOptIn()` reads it (`settings.ts:896-904`, user/local/flag/policy sources, project excluded for RCE safety) | **high** | Same flag; role changed from startup-gate to dialog-suppression. |
| **Blocking startup consent gate** | `interactiveHelpers.tsx:224-235` (`showSetupDialog(... declineExits ... gracefulShutdownSync(1))`) | **high (precursor exists), medium (removed)** | The blocking gate exists in 2.1.88; it is *absent* from 2.1.156's startup path, replaced by the in-flow 800ms-debounce dialog. "Deleted" is inferred from replacement, not a single diff line. |
| 800ms consent debounce (`H1.current` timer) | none | NEW post-2.1.88 | No `useRef` debounce in the 2.1.88 path; this is the 2.1.152 mechanism. |
| VSCode `tengu_auto_mode_state` `experiment_gates` bridge + `opt-in → enabled` promotion | none (only `claude-vscode` entrypoint string at `main.tsx:823`) | NEW post-2.1.88 | The bridge and the promotion are 2.1.156 additions; no precursor. |
| `kV5` tri-state resolver | partial — `hasAutoModeOptInAnySource()` / `enabledState === 'enabled'` (`permissionSetup.ts:1121,1362`) | **medium** | 2.1.88 had a tri-state notion but no single `enabled / disabled / opt-in` resolver returning the raw string for a bridge. |

**Net:** the dialog component and consent flag are stable lineage (high confidence); the **non-blocking debounce** and the **VSCode opt-in→enabled bridge** are NEW post-2.1.88 (no precursor). The literal claim "the blocking consent gate was deleted" is **medium** — the 2.1.88 blocking gate demonstrably exists and the 2.1.156 startup path demonstrably no longer blocks, but I am inferring removal from the replacement structure rather than pinning a single removed `if`.

---

## 7. Putting it together — the end-to-end picture

```
 ┌──────────────────────── 2.1.88 (BEFORE) ───────────────────────┐
 │ startup → permissionMode === "auto" && !hasAutoModeOptIn()       │
 │        → showSetupDialog(AutoModeOptInDialog, declineExits)      │
 │        → DECLINE = gracefulShutdownSync(1)  (process exits)      │  BLOCKING GATE
 └──────────────────────────────────────────────────────────────────┘

 ┌──────────────────────── 2.1.152 (terminal) ────────────────────┐
 │ Shift+Tab cycles to auto → handleCycleMode (ym)                 │
 │   arms 800ms timer (H1.current), returns immediately  ──────────┼─ non-blocking
 │   • tap past auto      → timer torn down, no dialog             │
 │   • settle / press ⏎   → onSubmit (F_) cancels timer, shows     │
 │                          AutoModeOptInDialog INSTEAD of sending  │
 │   • Decline (hm)        → clears pending consent, stays in mode  │  (no exit)
 └──────────────────────────────────────────────────────────────────┘

 ┌──────────────────────── 2.1.156 (VSCode) ──────────────────────┐
 │ kV5() = "opt-in"  ── y97 promotes ──▶ tengu_auto_mode_state =   │
 │                                       "enabled"                  │  picker shows
 │ → VSCode mode-picker lists auto mode (no bypass-permissions)    │  auto mode
 │ → first activation: AUTO_MODE_DESCRIPTION (n19) dismissable note│
 └──────────────────────────────────────────────────────────────────┘
```

**Key insight:** the safety model didn't change — the per-tool-call classifier (with its hard-deny rules) is still the only thing standing between the model and a dangerous action. What changed is the **consent ergonomics**: consent went from a *blocking precondition* (answer-or-exit at startup) to a *non-blocking, debounced, in-flow confirmation* in the terminal, and to *silently available* in VSCode by promoting the `opt-in` reporting value to `enabled`. The classifier-as-the-real-boundary is exactly why this is safe to do.
