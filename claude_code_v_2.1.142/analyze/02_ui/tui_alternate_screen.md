# `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` Env Var (v2.1.132)

## What changed

`CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` joins
`CLAUDE_CODE_NO_FLICKER=0` as a way to **force the renderer out of
fullscreen** (alt-screen) mode. The two env vars sit on layer 1 of the
renderer cascade (the operator escape hatch) and are peers: setting
either forces fullscreen off.

The new variable name is more explicit about its effect. Some users
and CI systems found `CLAUDE_CODE_NO_FLICKER=0` confusing (the
implication "disable no-flicker" is a double-negative). Adding
`CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` provides a clearer name for
the same effect.

The v2.1.112 cascade is unchanged otherwise; layer 2-5 still consult
the same data sources.

## Source: the new disable predicate

```javascript
// ============================================
// isAlternateScreenForceDisabled - operator escape hatch (layer 1 of cascade)
// Location: cli_inner_pretty.js:146488-146490
// ============================================

// ORIGINAL (for source lookup):
function Y76() {
  return E4(process.env.CLAUDE_CODE_NO_FLICKER) || bH(process.env.CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN);
}

// READABLE (for understanding):
function isAlternateScreenForceDisabled() {
  // Operator escape hatch:
  //   - CLAUDE_CODE_NO_FLICKER=0 explicitly disables fullscreen
  //   - CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1 also disables fullscreen
  // Either being set with the respective explicit value forces fullscreen off.
  return parseExplicitFalse(process.env.CLAUDE_CODE_NO_FLICKER)
      || parseExplicitTrue(process.env.CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN);
}

// Mapping: Y76→isAlternateScreenForceDisabled,
//          E4→parseExplicitFalse (true when value is "0" / "false" / etc.),
//          bH→parseExplicitTrue (true when value is "1" / "true" / etc.)
```

The asymmetry — `NO_FLICKER` checked via `parseExplicitFalse` but the
new var via `parseExplicitTrue` — is deliberate. The names express
their semantics differently:

- `CLAUDE_CODE_NO_FLICKER=0` → "disable no-flicker" → disable
  alt-screen.
- `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` → "disable alt-screen" →
  disable alt-screen.

Both produce the same effect, expressed naturally in each name.

## Source: updated cascade

```javascript
// ============================================
// isFullscreenMode - the five-layer renderer cascade (v2.1.142 shape)
// Location: cli_inner_pretty.js:146491-146520
// ============================================

// ORIGINAL (for source lookup):
function lq(H = Ts) {
  if (GRH() === "local-agent") return !1;
  if (Y76()) return !1;
  if (bH(process.env.CLAUDE_CODE_NO_FLICKER)) return !0;
  if (Zl(H)) { /* log + */ return !1; }
  if (e5$()) { /* log + */ return !1; }
  if (process.env.CLAUDE_CODE_SESSION_KIND === "bg") return !0;
  switch (m6().tui) {
    case "fullscreen": return !0;
    case "default":    return !1;
  }
  if (BR1(H)) return !0;
  return ((H.gbGateCached ??= Z$("tengu_pewter_brook", !1)), H.gbGateCached);
}

// READABLE (for understanding):
function isFullscreenMode(state = sharedFlagState) {
  // PRE-LAYER: local-agent sessions never get fullscreen (they have no terminal).
  if (getSessionRunMode() === "local-agent") return false;

  // LAYER 1A — Operator force-disable (NO_FLICKER=0 OR DISABLE_ALTERNATE_SCREEN=1).
  if (isAlternateScreenForceDisabled()) return false;

  // LAYER 1B — Operator opt-in (NO_FLICKER=1).
  if (parseExplicitTrue(process.env.CLAUDE_CODE_NO_FLICKER)) return true;

  // LAYER 2 — tmux -CC integration mode auto-disables.
  if (isTmuxIntegrationMode(state)) {
    if (!state.loggedTmuxCcDisable) {
      state.loggedTmuxCcDisable = true;
      logForDebugging('fullscreen disabled: tmux -CC (iTerm2 integration mode) detected · set CLAUDE_CODE_NO_FLICKER=1 to override');
    }
    return false;
  }

  // LAYER 3 — Windows over SSH auto-disables (ConPTY re-rendering issues).
  if (isWindowsOverSsh()) {
    if (!state.loggedWinSshDisable) {
      state.loggedWinSshDisable = true;
      logForDebugging('fullscreen disabled: Windows over SSH (ConPTY re-rendering) detected · set CLAUDE_CODE_NO_FLICKER=1 to override');
    }
    return false;
  }

  // LAYER 4A — Background-session forced on.
  if (process.env.CLAUDE_CODE_SESSION_KIND === "bg") return true;

  // LAYER 4B — Persistent user setting.
  switch (getUserSettings().tui) {
    case "fullscreen": return true;
    case "default":    return false;
  }

  // LAYER 5A — Downsell gate (subscriber rollout extension).
  if (isDownsellGate(state)) return true;

  // LAYER 5B — Feature gate fallback (Anthropic-side staged rollout).
  return (state.gbGateCached ??= getFeatureFlag('tengu_pewter_brook', false));
}

// Mapping: lq→isFullscreenMode, GRH→getSessionRunMode, Y76→isAlternateScreenForceDisabled,
//          Zl→isTmuxIntegrationMode, e5$→isWindowsOverSsh, m6→getUserSettings,
//          BR1→isDownsellGate, Z$→getFeatureFlag, Ts/Ja6→sharedFlagState
```

Compared to v2.1.112:

- Pre-layer: explicit short-circuit for `local-agent` mode (new).
- Layer 1A: `Y76()` consolidates both env vars.
- Layer 1B: still consults `NO_FLICKER=1` for opt-in.
- Layer 3: Windows-over-SSH check added (new in this release window).
- Layer 4A: `CLAUDE_CODE_SESSION_KIND === "bg"` forces fullscreen on
  for background sessions (new).
- Layer 4B: tui setting unchanged.
- Layer 5A: `isDownsellGate` added — another rollout cohort lever.

## Source: mouse tracking pairs with alt-screen

```javascript
// ============================================
// shouldEnableMouseTracking - paired predicate
// Location: cli_inner_pretty.js:146524-146529
// ============================================

function shouldEnableMouseTracking(state = sharedFlagState) {
  // Mouse tracking is meaningless without alt-screen — they pair up.
  if (isAlternateScreenForceDisabled()) return false;
  if (parseExplicitTrue(process.env.CLAUDE_CODE_NO_FLICKER)) return true;
  if (isWindowsOverSsh()) return false;
  return !isTmuxIntegrationMode(state);
}
```

If the user force-disables alt-screen via either env var, mouse
tracking is also disabled — they wouldn't have a buffer to drive.

## Source: telemetry-friendly reason code

```javascript
// ============================================
// reportFullscreenReason - tag for telemetry / /doctor diagnostics
// Location: cli_inner_pretty.js:146530-146544
// ============================================

function reportFullscreenReason(state = sharedFlagState) {
  if (isAlternateScreenForceDisabled())                  return "env_off";
  if (parseExplicitTrue(process.env.CLAUDE_CODE_NO_FLICKER)) return "env_on";
  if (isTmuxIntegrationMode(state))                       return "tmux_cc_auto_off";
  if (isWindowsOverSsh())                                  return "win_ssh_auto_off";
  if (process.env.CLAUDE_CODE_SESSION_KIND === "bg")       return "bg_forced_on";
  switch (getUserSettings().tui) {
    case "fullscreen": return "settings_on";
    case "default":    return "settings_off";
  }
  if (state.downsellGateCached ?? getFeatureFlag("tengu_amber_creek", false)) return "downsell_on";
  return (state.gbGateCached ?? getFeatureFlag("tengu_pewter_brook", false)) ? "gb_on" : "gb_off";
}
```

The `"env_off"` code now covers **both** env vars in layer 1A. The
distinction between the two env-var names is lost at telemetry level
(intentional — they're functionally the same).

## Why this approach

### Why introduce a new env var rather than keep using `NO_FLICKER=0`?

**What:** Pre-v2.1.132, the only env var was `CLAUDE_CODE_NO_FLICKER`.
v2.1.132 adds the alternative name.

**Why:**

- `NO_FLICKER=0` is a double-negative ("disable no-flicker"). Many
  users mis-read it as "set no-flicker to off" without realizing this
  meant disabling the alt-screen renderer.
- The new name `DISABLE_ALTERNATE_SCREEN=1` is a single-positive
  ("disable alt-screen") and clearly maps to its effect.
- Both names work, so existing configurations don't break. The new
  name is for clarity in docs and new setups.

### Why have `parseExplicitFalse` for the old name but `parseExplicitTrue` for the new?

**What:** The legacy var is checked for `=0`/`=false`/etc.; the new
var is checked for `=1`/`=true`/etc.

**Why:**

- The semantics differ: `NO_FLICKER=0` is "disable a thing whose name
  implies enabled-state"; `DISABLE_ALTERNATE_SCREEN=1` is "enable a
  thing whose name implies disabled-state."
- Using `parseExplicitTrue` for the new var allows the user to write
  the natural-language affirmation: "I want to disable alt-screen, so
  I set this to 1."
- Using `parseExplicitFalse` for the old var preserves backward
  compatibility for users who already set it.

### Why an "OR" gate (`||`) rather than a precedence order?

**What:** Both env vars compose with `||` — either being set disables.

**Why:**

- Either env var being set is a clear signal. There's no scenario
  where the user wants one to mean "yes" and the other to mean "no"
  for the same operation.
- The OR gate makes the override more forgiving — a CI runner
  inherited from a base image that sets `NO_FLICKER=0` is still
  overridden by `DISABLE_ALTERNATE_SCREEN=1` in the wrapper script,
  or vice versa.
- A precedence order (e.g. "new var beats old var") would surprise
  users who composed both for redundancy.

### Why don't `NO_FLICKER=1` and `DISABLE_ALTERNATE_SCREEN=1` conflict?

**What:** A user could plausibly set both `NO_FLICKER=1` AND
`DISABLE_ALTERNATE_SCREEN=1`. In the cascade, layer 1A returns true
before layer 1B is reached, so the effective behavior is "disabled."

**Why:**

- Disabling takes precedence over enabling. The user explicitly asked
  for off (via the disable var); we respect that, even if they
  contradicted themselves with `NO_FLICKER=1`.
- This is safer than the alternative: if the user accidentally left
  `NO_FLICKER=1` in their environment and tried to override with
  `DISABLE_ALTERNATE_SCREEN=1`, the disable should win.
- The cascade order in code reflects this — layer 1A (disable) is
  checked before layer 1B (enable).

### Why is mouse tracking conditional on alt-screen?

**What:** `shouldEnableMouseTracking` checks
`isAlternateScreenForceDisabled` before checking the explicit-on path
— so disabling alt-screen also disables mouse tracking, even if the
user wanted just alt-screen off and mouse-on.

**Why:**

- Mouse tracking only meaningful when the alt-screen renderer is
  active. The mouse events are translated into transcript
  scrolling/clicking; without alt-screen there's no transcript to
  scroll.
- Decoupling would invite surprise: "I disabled alt-screen but mouse
  events still go into the TUI somehow" — confusing.
- The pairing is documented; users who want both off use either env
  var.

### Why add `CLAUDE_CODE_SESSION_KIND === "bg"` as an override?

**What:** Background-session-launched processes always get fullscreen
on, regardless of other settings.

**Why:**

- Background agents (launched via `/bg`) don't have a user-facing
  terminal — they run in a daemon-attached pty. The alt-screen mode
  is the canonical UX for these.
- Forcing it on simplifies the daemon-attach UX: when the user
  attaches to a backgrounded session, they always see the alt-screen
  UI regardless of their personal env preference (which doesn't
  apply to the daemon process anyway).
- The check happens early (before user-settings) because daemon mode
  is a deliberate operational choice that overrides personal
  preference.

## Cross-validation: v2.1.112 → v2.1.142

| Aspect | v2.1.112 | v2.1.142 | Δ |
|--------|----------|----------|---|
| `CLAUDE_CODE_NO_FLICKER=0` disables alt-screen | Yes (layer 1) | Yes (layer 1A) | Same effect, restructured |
| `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` disables alt-screen | No (not parsed) | Yes (layer 1A peer) | New |
| `CLAUDE_CODE_NO_FLICKER=1` enables alt-screen | Yes (layer 1) | Yes (layer 1B) | Restructured |
| `tmux -CC` auto-disable | Layer 2 | Layer 2 | Unchanged |
| Windows over SSH auto-disable | n/a | Layer 3 | New (in this version window) |
| `CLAUDE_CODE_SESSION_KIND="bg"` forced on | n/a | Layer 4A | New |
| User settings `tui: "fullscreen"`/`"default"` | Layer 4 | Layer 4B | Renamed |
| Downsell gate | n/a | Layer 5A | New |
| Feature gate (`tengu_pewter_brook`) | Layer 5 | Layer 5B | Renamed |
| `reportFullscreenReason` codes | (8 codes) | (8 codes, same names) | Unchanged for the existing codes; `env_off` now also covers the new var |
| `shouldEnableMouseTracking` pair | Implicit | Explicit `Y76` peer check | Refactored |

## Related symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — TUI
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `isAlternateScreenForceDisabled` (`Y76`) — operator escape hatch; cli_inner_pretty.js:146488-146490
- `isFullscreenMode` (`lq`) — five-layer cascade with new env var layer; cli_inner_pretty.js:146491-146520
- `shouldEnableMouseTracking` (`vr$`) — paired check; cli_inner_pretty.js:146524-146529
- `reportFullscreenReason` (`tYH`) — telemetry-friendly reason code; cli_inner_pretty.js:146530-146544
- `isTmuxIntegrationMode` (`Zl`) — tmux -CC detection; cli_inner_pretty.js:146480-146483
- `isWindowsOverSsh` (`e5$`) — Windows + SSH detection
- `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` — new env var; cli_inner_pretty.js:482157 (registered in the env-var list)
- `tengu_pewter_brook` — feature gate (unchanged)
- `tengu_amber_creek` — new downsell gate
