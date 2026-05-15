# `/effort` Picker Reflects `CLAUDE_CODE_EFFORT_LEVEL` Override (v2.1.132)

## What changed

`CLAUDE_CODE_EFFORT_LEVEL` is an environment variable that overrides
the session's effort value (`appState.effortValue`) in
`resolveAppliedEffort`. Before v2.1.132 the `/effort` slider opened
**at the saved AppState position**, not the env-overridden position.
If the user had `CLAUDE_CODE_EFFORT_LEVEL=low` set but AppState was
`max`, the slider showed `max` as selected — confusing, because the
*actual* running effort was `low`.

The fix also surfaces a clarifying message when the user tries to
change effort but the env var would prevent the change from taking
effect:

- `/effort high` while `CLAUDE_CODE_EFFORT_LEVEL=medium` is set →
  `"CLAUDE_CODE_EFFORT_LEVEL=medium overrides this session — clear it
  and high takes over"`
- `/effort auto` while the env var is set →
  `"Cleared effort from settings, but
  CLAUDE_CODE_EFFORT_LEVEL=medium still controls this session"`

## Source: slider initial position with env reflection

```javascript
// ============================================
// EffortSliderComponent - opens at env-reflected position
// Location: cli_inner_pretty.js:496927-496950 (initial-index calculation)
// ============================================

// ORIGINAL (for source lookup):
function py5(H) {
  let $ = oaH.c(62),
    { onDone: q } = H,
    K = f$(dy5),                // appState.effortValue
    _ = f$(Qy5),
    A = XM(),
    z = l6(),
    Y;
  H: {
    let _H;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) ((_H = Gf() ? void 0 : IUH()), ($[0] = _H));
    else _H = $[0];
    let YH = _H,
      DH = YH === null ? void 0 : (YH ?? K);
    if (!DH) {
      Y = Z04;          // DEFAULT_SLIDER_INDEX (= 3, xhigh)
      break H;
    }
    let OH;
    if ($[1] !== DH) ((OH = x1H.findIndex((TH) => TH.value === DH)), ($[1] = DH), ($[2] = OH));
    else OH = $[2];
    let GH = OH;
    Y = GH === -1 ? Z04 : GH;
  }
  …
}

// READABLE (for understanding):
function EffortSliderComponent({ onDone }) {
  const appStateEffort   = useAppState(s => s.effortValue);
  const cacheMissAcked   = useAppState(s => s.cacheMissAckedAtOutputTokens);
  const mainLoopModel    = useMainLoopModel();
  const setAppState      = useSetAppState();

  // Determine the slider's initial position with env-override awareness.
  const initialIndex = useMemo(() => {
    // 1. In remote sessions, the env var doesn't apply (the remote process has
    //    its own env). Otherwise, read CLAUDE_CODE_EFFORT_LEVEL.
    const envOverride = isRemoteSession() ? undefined : readEnvEffortLevel();

    // 2. Compute the "effective" current effort:
    //    - envOverride === null (set to "auto"/"unset") → no effective level
    //    - envOverride is a valid level → that level wins
    //    - envOverride undefined → fall back to AppState
    const effective = envOverride === null
      ? undefined
      : (envOverride ?? appStateEffort);

    // 3. If no effective level, open the slider at the default index (xhigh).
    if (!effective) return DEFAULT_SLIDER_INDEX;

    // 4. Otherwise, open at the position matching the effective level.
    const found = SLIDER_LEVELS.findIndex(l => l.value === effective);
    return found === -1 ? DEFAULT_SLIDER_INDEX : found;
  }, [appStateEffort]);

  const [sliderIndex, setSliderIndex] = useState(initialIndex);
  // …key handler, render, etc. (unchanged from 2.1.111 slider)
}

// Mapping: py5→EffortSliderComponent, dy5→appState.effortValue selector,
//          Qy5→appState.cacheMissAckedAtOutputTokens selector,
//          IUH→readEnvEffortLevel, Gf→isRemoteSession, Z04→DEFAULT_SLIDER_INDEX,
//          x1H→SLIDER_LEVELS
```

The critical changes are in steps 1-2:

- **Before 2.1.132**: only AppState was considered. Slider opened at
  the saved position regardless of env override.
- **After 2.1.132**: env override is consulted first; if set, the
  slider opens at the override position.

The `envOverride === null` distinction handles the `auto`/`unset`
env value (treated as "no override"), letting AppState through.

## Source: env-override message in apply paths

```javascript
// ============================================
// applyEffortLevel - surfaces env override conflict in confirmation message
// Location: cli_inner_pretty.js:496721-496749
// ============================================

// ORIGINAL (for source lookup):
function Ey5(H) {
  let $ = G3H(H);
  if (QE() && $ === void 0)
    return {
      message: `${H} is session-scoped and won't reach the remote process. Use low, medium, high, or xhigh for remote sessions.`,
    };
  let q = T04($),
    K = wY$(H);
  if (K) return { message: `Failed to set effort level: ${K.message}` };
  d("tengu_effort_command", { effort: H });
  let _ = Gf() ? void 0 : IUH();
  if (_ !== void 0 && _ !== H) {
    let Y = process.env.CLAUDE_CODE_EFFORT_LEVEL;
    if ($ === void 0)
      return {
        message: `Not applied: CLAUDE_CODE_EFFORT_LEVEL=${Y} overrides effort this session, and ${H} is session-only (nothing saved)`,
        effortUpdate: { value: H },
      };
    return {
      message: `CLAUDE_CODE_EFFORT_LEVEL=${Y} overrides this session — clear it and ${H} takes over`,
      effortUpdate: { value: H },
    };
  }
  let A = tA6(H);
  return {
    message: `Set effort level to ${H}${$ !== void 0 ? "" : " (this session only)"}: ${A}${q ?? ""}`,
    effortUpdate: { value: H },
  };
}

// READABLE (for understanding):
function applyEffortLevel(level) {
  // Step 1: validate against persistable set (max is session-only).
  const persistable = parseEffortLevelStrict(level);  // low/medium/high/xhigh

  // Step 2: remote-session guard. Remote can't apply max session-only.
  if (isRemoteRouter() && persistable === undefined) {
    return {
      message: `${level} is session-scoped and won't reach the remote process. Use low, medium, high, or xhigh for remote sessions.`,
    };
  }

  // Step 3: dispatch to remote (for control-request remote sessions).
  const remoteApplyHint = dispatchEffortToRemoteSession(persistable);

  // Step 4: persist to user settings + latch unpinOpus47LaunchEffort.
  const persistErr = persistEffortAndUnpinOpus47(level);
  if (persistErr) return { message: `Failed to set effort level: ${persistErr.message}` };

  // Telemetry.
  emitTelemetry("tengu_effort_command", { effort: level });

  // Step 5: env-override conflict detection.
  // If the env var is set to a different level, the user's just-saved
  // effort won't actually affect the running session.
  const envOverride = isRemoteRouter() ? undefined : readEnvEffortLevel();
  if (envOverride !== undefined && envOverride !== level) {
    const envValue = process.env.CLAUDE_CODE_EFFORT_LEVEL;
    if (persistable === undefined) {
      // The user tried to set 'max' (which is session-only); env still wins.
      // Surface the deeper conflict.
      return {
        message: `Not applied: CLAUDE_CODE_EFFORT_LEVEL=${envValue} overrides effort this session, and ${level} is session-only (nothing saved)`,
        effortUpdate: { value: level },
      };
    }
    // Persisted but not active until env is cleared.
    return {
      message: `CLAUDE_CODE_EFFORT_LEVEL=${envValue} overrides this session — clear it and ${level} takes over`,
      effortUpdate: { value: level },
    };
  }

  // Step 6: normal success path.
  const description = getEffortDescriptionWithBurnHint(level);
  return {
    message: `Set effort level to ${level}${persistable !== undefined ? "" : " (this session only)"}: ${description}${remoteApplyHint ?? ""}`,
    effortUpdate: { value: level },
  };
}

// Mapping: Ey5→applyEffortLevel, G3H→parseEffortLevelStrict,
//          QE→isRemoteRouter, Gf→isRemoteSession,
//          T04→dispatchEffortToRemoteSession, wY$→persistEffortAndUnpinOpus47,
//          IUH→readEnvEffortLevel, tA6→getEffortDescriptionWithBurnHint, d→emitTelemetry
```

## Source: env-override message in clear path

```javascript
// ============================================
// clearEffortLevel - same env-conflict surfacing for /effort auto
// Location: cli_inner_pretty.js:496757-496769
// ============================================

function clearEffortLevel() {
  const remoteApplyHint = dispatchEffortToRemoteSession(undefined);
  const persistErr = persistEffortAndUnpinOpus47(undefined);
  if (persistErr) return { message: `Failed to set effort level: ${persistErr.message}` };

  emitTelemetry("tengu_effort_command", { effort: "auto" });

  const envOverride = isRemoteRouter() ? undefined : readEnvEffortLevel();
  if (envOverride !== undefined && envOverride !== null) {
    return {
      message: `Cleared effort from settings, but CLAUDE_CODE_EFFORT_LEVEL=${process.env.CLAUDE_CODE_EFFORT_LEVEL} still controls this session`,
      effortUpdate: { value: undefined },
    };
  }
  return {
    message: `Effort level set to auto${remoteApplyHint ?? ""}`,
    effortUpdate: { value: undefined },
  };
}
```

The `/effort auto` confirmation now explicitly tells the user that
clearing the setting was successful but the env var still controls the
session — preventing the surprise of "I cleared it but it didn't
clear."

## Why this approach

### Why open the slider at the env-overridden position rather than AppState?

**What:** The slider's initial cursor is on the level that's *actually
running*, not the level the user previously saved.

**Why:**

- The slider is a visual control for "where are we now?". Opening at
  the wrong position teaches the user a wrong mental model.
- The status bar already shows the env-resolved effort
  (`with low effort` when `CLAUDE_CODE_EFFORT_LEVEL=low`). If the
  slider opens at `max` but the status bar says `low`, the two
  controls disagree — confusing.
- The user's prior preference (`appStateEffort`) is recoverable: the
  user can clear the env var and the next slider opens at AppState.

### Why surface env conflict in apply confirmation rather than block?

**What:** `/effort high` when env is `medium` still saves the setting
(via `persistEffortAndUnpinOpus47`), but the confirmation says
`"clear it and high takes over"`.

**Why:**

- The user's intent is to make `high` the default. Even though the env
  blocks it from taking effect this session, the *setting* should
  persist so the next session (without env) gets the new value.
- Blocking would force users to choose "fix env or change setting"
  upfront. The two-step approach (save now, surface the env conflict
  for later) is more forgiving.
- The confirmation text *teaches* the user: "your env is overriding;
  clear it" — actionable instruction.

### Why distinguish `max` (session-only) from `low/medium/high/xhigh` (persistable)?

**What:** The error for `/effort max` with env set is:
`"Not applied: CLAUDE_CODE_EFFORT_LEVEL=X overrides effort this
session, and max is session-only (nothing saved)"`

Versus `/effort high`:
`"CLAUDE_CODE_EFFORT_LEVEL=X overrides this session — clear it and
high takes over"`

**Why:**

- `max` is session-only — it doesn't persist to settings.json. So even
  if the env weren't set, the next session would default back to the
  model default. The user gets less out of the command than they
  might think.
- `high`/`medium`/`low`/`xhigh` do persist. Future sessions (without
  env) will use the new setting.
- The two phrasings reflect this — the second is informational ("env
  blocks today, persisting for tomorrow"); the first is more dire
  ("env blocks today AND nothing carries forward").

### Why does `clearEffortLevel` still attempt the dispatch + persist even when env wins?

**What:** Even when the env var will override, `clearEffortLevel`
still calls `dispatchEffortToRemoteSession(undefined)` and
`persistEffortAndUnpinOpus47(undefined)` — these have real side
effects.

**Why:**

- Clearing the persisted setting is meaningful: when the user
  eventually clears their env var, they want auto-mode, not whatever
  was last saved.
- The unpin latch is still set — interacting with the slider commits
  to "I've seen the launch nudge," which we want regardless of env.
- The remote-session dispatch propagates the clear to the remote
  process, which doesn't see the local env var.

## Cross-validation: v2.1.131 → v2.1.132

| Aspect | v2.1.131 | v2.1.132 | Δ |
|--------|----------|----------|---|
| Slider initial position | `appStateEffort` only | `envOverride ?? appStateEffort` | Fixed |
| Slider opens at correct level when env set | No (mismatched with status bar) | Yes | Fixed |
| `/effort <level>` confirmation when env conflicts | No mention | `"clear it and X takes over"` | Improved |
| `/effort max` when env conflicts | Just "Set effort to max" | Explicit "session-only, nothing saved, env overrides" | Improved |
| `/effort auto` when env set | Just "Effort level set to auto" | `"Cleared effort from settings, but env still controls this session"` | Improved |
| Remote-session env handling | Skip env check entirely | Same (`isRemoteRouter` short-circuit) | Unchanged |

## What this looks like

```
> echo $CLAUDE_CODE_EFFORT_LEVEL
medium

> /effort high
CLAUDE_CODE_EFFORT_LEVEL=medium overrides this session — clear it and high takes over

> /effort max
Not applied: CLAUDE_CODE_EFFORT_LEVEL=medium overrides effort this session, and max is session-only (nothing saved)

> /effort auto
Cleared effort from settings, but CLAUDE_CODE_EFFORT_LEVEL=medium still controls this session

> /effort
[Slider opens at "medium" position, not at whatever was saved]
```

## Related symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Effort
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions in this document:
- `EffortSliderComponent` (`py5`) — env-aware initial index; cli_inner_pretty.js:496927-496950
- `applyEffortLevel` (`Ey5`) — env-conflict confirmation; cli_inner_pretty.js:496721-496749
- `clearEffortLevel` (`yy5`) — env-conflict on auto; cli_inner_pretty.js:496757-496769
- `readEnvEffortLevel` (`IUH`) — env read with auto/unset handling; cli_inner_pretty.js:198867-198870
- `isRemoteRouter` (`QE`) and `isRemoteSession` (`Gf`) — remote-mode short-circuits
- `SLIDER_LEVELS` (`x1H`) — 5-position slider config
- `DEFAULT_SLIDER_INDEX` (`Z04`) — fallback position (= 3, xhigh)
