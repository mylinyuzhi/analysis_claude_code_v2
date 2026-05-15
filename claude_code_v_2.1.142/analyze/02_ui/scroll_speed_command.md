# `/scroll-speed` Interactive Picker (v2.1.139)

## What changed

`/scroll-speed` opens an interactive dialog where the user adjusts the
**mouse wheel scroll speed** for the fullscreen TUI. The value is
saved to the user's settings.json via
`CLAUDE_CODE_SCROLL_SPEED` env var entry.

The dialog also detects the current terminal (Cursor / VS Code /
Apple Terminal / iTerm2 / Ghostty / WezTerm / Warp / Windows Terminal
/ etc.), the platform, and any **editor-side** wheel sensitivity
setting (VS Code's `terminal.integrated.mouseWheelScrollSensitivity`)
— and offers context-aware hints:

```
Scroll speed
■■■■···  4 lines per wheel notch  · auto is 3

Terminal    iTerm2 · macOS · high-rate wheel events
Editor      VS Code wheel sensitivity 1 · /terminal-setup raises it to 3

Scroll to feel it · ←/→ adjust · r reset to auto · Enter save · Esc cancel
```

The picker is **fullscreen-only** (`isEnabled: () => isFullscreenMode() && …`) — the default renderer doesn't have alt-screen mouse tracking, so wheel-speed adjustments have no effect.

## Source: command definition

```javascript
// ============================================
// scrollSpeedCommandDef - slash command registration
// Location: cli_inner_pretty.js:476708-476720
// ============================================

// ORIGINAL (for source lookup):
lT5 = {
  type: "local-jsx",
  name: "scroll-speed",
  description: "Adjust mouse wheel scroll speed",
  isEnabled: () => {
    if (!lq()) return !1;
    let H = vJ();
    return !(H ? sa.includes(H.terminal ?? "") : zA$.isJetBrainsIdeTerminal());
  },
  load: () => Promise.resolve().then(() => (TJ4(), GJ4)),
};

// READABLE (for understanding):
const scrollSpeedCommandDef = {
  type: "local-jsx",
  name: "scroll-speed",
  description: "Adjust mouse wheel scroll speed",
  // Enabled only when:
  //   1. The fullscreen / alt-screen renderer is active (lq).
  //      Default-mode renderer doesn't intercept wheel events.
  //   2. The terminal isn't a JetBrains-family IDE terminal (where
  //      wheel events are owned by the IDE, not the TUI).
  isEnabled: () => {
    if (!isFullscreenMode()) return false;
    const ideAdapter = getCurrentIdeAdapter();
    return !(ideAdapter
      ? UNSUPPORTED_TERMINAL_IDS.includes(ideAdapter.terminal ?? "")
      : isJetBrainsIdeTerminal());
  },
  load: () => Promise.resolve().then(() => (loadScrollSpeedCommand(), scrollSpeedExports)),
};

// Mapping: lT5→scrollSpeedCommandDef, lq→isFullscreenMode,
//          vJ→getCurrentIdeAdapter, sa→UNSUPPORTED_TERMINAL_IDS,
//          zA$.isJetBrainsIdeTerminal→isJetBrainsIdeTerminal
```

## Source: entry point + ruler suppression

```javascript
// ============================================
// scrollSpeedCommandEntrypoint - resolves editor sensitivity, then renders dialog
// Location: cli_inner_pretty.js:476693-476697
// ============================================

const SCROLL_SPEED_RULER_MSG_THRESHOLD = 20;  // dT5

const scrollSpeedCommandEntrypoint = async (onDone, ctx) => {
  // Show the demo ruler only when the transcript is short (< 20 messages) —
  // an empty / new session benefits from seeing the demo visual; long
  // sessions are crowded and don't need it.
  const showDemoRuler = ctx.messages.length < SCROLL_SPEED_RULER_MSG_THRESHOLD;

  // Read VS Code-style editor wheel sensitivity (250ms timeout — IDE
  // connection may be slow or absent).
  const editorSensitivity = await runWithTimeout(
    readVsCodeEditorWheelSensitivity(),
    250,
    "VS Code settings read timed out"
  ).catch(() => null);

  return React.createElement(ScrollSpeedDialog, { onDone, showDemoRuler, editorSensitivity });
};

// Mapping: cT5→scrollSpeedCommandEntrypoint, dT5→SCROLL_SPEED_RULER_MSG_THRESHOLD,
//          j_6→readVsCodeEditorWheelSensitivity, Xz→runWithTimeout, VB6→React
```

## Source: the dialog

```javascript
// ============================================
// ScrollSpeedDialog - the interactive picker
// Location: cli_inner_pretty.js:476494-476601
// ============================================

function ScrollSpeedDialog({ onDone, showDemoRuler = true, editorSensitivity = null }) {
  const SCROLL_SPEED_ENV = "CLAUDE_CODE_SCROLL_SPEED";  // ZaH
  const MIN_SPEED = 1;                                   // WX8
  const MAX_SPEED = 10;                                  // $Z$

  const originalEnvValue = useRef(process.env[SCROLL_SPEED_ENV]);
  const terminalCaps     = getTerminalCapabilities();    // Yk()
  const autoSpeed        = computeAutoScrollSpeed(terminalCaps.xtermJs, terminalCaps.wheelFlood, terminalCaps.wtSession);

  // Current selected speed: env override or auto.
  const [speed, setSpeed] = useState(() => clamp(Math.round(terminalCaps.base), MIN_SPEED, MAX_SPEED));
  // Are we using a user-set value (vs auto)?
  const [hasUserValue, setHasUserValue] = useState(originalEnvValue.current !== undefined);

  // Telemetry signals: did the user actually scroll while previewing?
  // (Helps separate intentional adjustments from drive-by openers.)
  const sawScrollWheel = useRef(false);
  const sawTrackpad    = useRef(false);
  const wheelEventsAccepted = !terminalCaps.xtermJs && !terminalCaps.wheelFlood;

  // Activate mouse mode while the dialog is open (releases on unmount).
  useEffect(() => {
    enableMouseDemoMode(true, { demoRuler: showDemoRuler });
    const stopAdapter = wheelEventsAccepted
      ? subscribeToWheelEvents(() => {
          const ev = readLastWheelEvent();
          if (!ev) return;
          if (ev.wheelMode) sawScrollWheel.current = true;
          else              sawTrackpad.current = true;
        })
      : undefined;
    return () => { stopAdapter?.(); enableMouseDemoMode(false); };
  }, [showDemoRuler, wheelEventsAccepted]);

  // ←/→ adjusters
  const adjustBy = (delta) => {
    const next = clamp(speed + delta, MIN_SPEED, MAX_SPEED);
    if (next === speed) return;
    process.env[SCROLL_SPEED_ENV] = String(next);  // live preview via env
    refreshTerminalScrollState();                   // _o$()
    setHasUserValue(true);
    setSpeed(next);
  };

  // r — reset to auto
  const resetToAuto = () => {
    delete process.env[SCROLL_SPEED_ENV];
    refreshTerminalScrollState();
    setSpeed(clamp(Math.round(autoSpeed), MIN_SPEED, MAX_SPEED));
    setHasUserValue(false);
  };

  // Esc — restore original env, no save
  const restoreOriginal = () => {
    if (originalEnvValue.current === undefined) delete process.env[SCROLL_SPEED_ENV];
    else process.env[SCROLL_SPEED_ENV] = originalEnvValue.current;
    refreshTerminalScrollState();
  };
  const cancel = () => { restoreOriginal(); onDone("Scroll speed unchanged"); };

  // Enter — persist setting to userSettings, emit telemetry
  const save = () => {
    const isReset = !hasUserValue;
    const envPatch = { [SCROLL_SPEED_ENV]: isReset ? undefined : String(speed) };
    const result = writeUserSettings("userSettings", { env: envPatch });   // B6
    if (result.error) {
      logUserSettingsWriteFailure(result.error);
      restoreOriginal();
      onDone(`Couldn't save scroll speed: ${result.error.message}`);
      return;
    }
    emitTelemetry("tengu_scroll_speed_set", {
      scroll_speed: isReset ? autoSpeed : speed,
      scroll_speed_auto: autoSpeed,
      reset_to_auto: isReset,
      xterm_js: terminalCaps.xtermJs,
      wheel_flood: terminalCaps.wheelFlood,
      wt_session: terminalCaps.wtSession,
      use_decay_curve: terminalCaps.useDecayCurve,
      saw_scroll_wheel: sawScrollWheel.current,
      saw_trackpad: sawTrackpad.current,
      editor_wheel_sensitivity: editorSensitivity?.sensitivity ?? undefined,
      term_program: terminalCaps.termProgram,
      term_program_version: terminalCaps.termProgramVersion,
    });
    const settingsPath = formatSettingsPath(getUserSettingsFilePath() ?? "settings.json");
    onDone(
      isReset
        ? `Scroll speed reset to auto (${autoSpeed} ${pluralize(autoSpeed, "line")} per notch) · removed from ${settingsPath}`
        : `Scroll speed set to ${speed} ${pluralize(speed, "line")} per notch · saved to ${settingsPath}`
    );
  };

  const onKeyDown = (key) => {
    if (key.key === "left")   { key.preventDefault(); adjustBy(-1); }
    else if (key.key === "right") { key.preventDefault(); adjustBy(1); }
    else if (key.key === "return") { key.preventDefault(); save(); }
    else if (key.key === "escape" || (key.ctrl && (key.key === "c" || key.key === "d"))) {
      key.preventDefault(); cancel();
    }
    else if (key.key === "r") { key.preventDefault(); resetToAuto(); }
  };

  // …render: track ('■■···'), value, terminal/editor rows, hints…
}

// Mapping: WJ4→ScrollSpeedDialog, ZaH→SCROLL_SPEED_ENV ("CLAUDE_CODE_SCROLL_SPEED"),
//          WX8→MIN_SPEED (1), $Z$→MAX_SPEED (10), Yk→getTerminalCapabilities,
//          t76→computeAutoScrollSpeed, C96→enableMouseDemoMode,
//          ApH→subscribeToWheelEvents, ESK→readLastWheelEvent,
//          B6→writeUserSettings, _o$→refreshTerminalScrollState,
//          d→emitTelemetry, EH→logUserSettingsWriteFailure
```

## Source: track rendering

```javascript
// ============================================
// renderScrollSpeedTrack - ■···· visualization
// Location: cli_inner_pretty.js:476617-476620
// ============================================

function renderScrollSpeedTrack(value) {
  const clamped = clamp(value, MIN_SPEED, MAX_SPEED);     // 1..10
  return "■".repeat(clamped) + "·".repeat(MAX_SPEED - clamped);
}
```

So at `speed = 4`: `■■■■······` (4 filled + 6 hollow = 10 chars).

## Source: terminal description

```javascript
// ============================================
// describeTerminal - human-readable line for the dialog's Terminal row
// Location: cli_inner_pretty.js:476621-476669
// ============================================

function describeTerminal(caps) {
  const parts = [
    getTerminalDisplayName(caps),  // "iTerm2" / "Apple_Terminal" / etc.
    getPlatformDisplayName(caps.platform),  // "macOS" / "Linux" / etc.
  ];
  if (caps.wheelFlood)      parts.push("high-rate wheel events");
  else if (caps.xtermJs)    parts.push("xterm.js");
  else if (caps.wtSession)  parts.push("Windows Terminal");
  return parts.join(" · ");
}

function getTerminalDisplayName(caps) {
  // Cursor leaves CURSOR_TRACE_ID in env even in remote/SSH cases.
  if (process.env.CURSOR_TRACE_ID !== undefined) return "Cursor";
  const askpass = process.env.VSCODE_GIT_ASKPASS_MAIN ?? "";
  if (askpass.includes("cursor"))      return "Cursor (remote)";
  if (askpass.includes("windsurf"))    return "Windsurf";
  if (askpass.includes("antigravity")) return "Antigravity";
  if (caps.termProgram === "vscode")   return `VS Code${caps.termProgramVersion !== "unset" ? ` ${caps.termProgramVersion}` : ""}`;
  switch (caps.termProgram) {
    case "unset":         return caps.wtSession || caps.platform === "win32" ? "Windows console" : "terminal";
    case "iTerm.app":     return "iTerm2";
    case "Apple_Terminal": return "Terminal.app";
    case "ghostty":       return "Ghostty";
    case "WezTerm":       return "WezTerm";
    case "WarpTerminal":  return "Warp";
    default:              return caps.termProgram;
  }
}

function getPlatformDisplayName(platform) {
  switch (platform) {
    case "darwin": return "macOS";
    case "win32":  return "Windows";
    case "linux":  return "Linux";
    default:       return platform;
  }
}

function describeEditorSensitivity({ editor, sensitivity, recommended }) {
  const name = editor === "VSCode" ? "VS Code" : editor;
  if (sensitivity === null)
    return `${name} wheel sensitivity unset · /terminal-setup sets it to ${recommended}`;
  if (sensitivity >= recommended) return `${name} wheel sensitivity ${sensitivity}`;
  return `${name} wheel sensitivity ${sensitivity} · /terminal-setup raises it to ${recommended}`;
}
```

## Why this approach

### Why an interactive picker rather than `/scroll-speed <N>`?

**What:** The command opens a dialog, not a typed-arg command.

**Why:**

- Wheel speed is *perceptual* — the right value depends on the
  terminal, the platform, and personal preference. A typed value
  would require the user to know what value they want before trying
  it. The picker lets them scroll in real time and feel the
  difference.
- The demo ruler in the dialog provides a visual reference for the
  scroll motion (a tall column that scrolls by N lines per notch).
- Live preview happens by writing to `process.env` and triggering a
  state refresh — no need to commit to a value to try it.

### Why fullscreen-only?

**What:** `isEnabled` returns false when not in fullscreen mode.

**Why:**

- Wheel events are intercepted by the alt-screen mouse tracking that
  fullscreen enables. Without alt-screen, wheel events go to the OS
  terminal's native scroll, and the TUI can't affect them.
- Hiding the command in default mode prevents the surprise of "I
  set scroll speed to 10 but nothing changed."
- JetBrains IDEs and other terminal-in-IDE setups own the wheel
  events even in fullscreen mode — those are also excluded.

### Why a 250ms timeout for VS Code settings read?

**What:** The async editor-sensitivity fetch is wrapped in a 250ms
timeout.

**Why:**

- Reading editor settings might require the IDE adapter to be
  responsive. If the IDE has crashed or the adapter is slow, the
  dialog should still open promptly with `editorSensitivity = null`.
- 250ms is the perceptual threshold for "instant" UI — the dialog
  opens within a frame regardless of editor responsiveness.
- The `.catch(() => null)` handles both timeout and other errors
  identically.

### Why save to `userSettings.env` rather than a dedicated setting key?

**What:** The save writes `{ env: { CLAUDE_CODE_SCROLL_SPEED: "4" } }`
to user settings.

**Why:**

- Env-var-backed settings give users a "set it for one session" path
  via `export CLAUDE_CODE_SCROLL_SPEED=4 && claude`.
- The `env` settings block is the standard way to populate env vars
  on session launch. Using it means the live preview (via
  `process.env` mutation) and the saved state share the same lookup
  path.
- A dedicated settings key would require two reads (env or settings)
  and double the maintenance.

### Why the rich telemetry payload?

**What:** `tengu_scroll_speed_set` emits 11 fields including
terminal type, version, and whether the user actually scrolled
during the dialog.

**Why:**

- Scroll speed is heavily terminal-dependent. The team needs to know
  which terminals are setting which speeds to tune the auto-speed
  heuristic.
- `saw_scroll_wheel` vs `saw_trackpad` distinguishes mouse-wheel users
  from trackpad users — they have very different ergonomics.
- `editor_wheel_sensitivity` correlates the TUI setting with the
  editor's setting; the team can identify cases where users are
  fighting two layers of sensitivity (and surface the
  `/terminal-setup raises it` hint accordingly).
- Adding all this at save time (not per-keystroke) keeps telemetry
  volume low — one event per save, not 100 per dialog session.

### Why `r` to reset to auto rather than another key?

**What:** Pressing `r` discards the user value and falls back to auto
detection.

**Why:**

- `r` for "reset" is conventional (matches `git reset`, `:reset` in
  many TUIs, etc.).
- The reset is non-destructive — the user can adjust further with
  ←/→ after pressing `r`.
- The same key in vim's `r<char>` would replace a char; in this
  context (no character entry), `r` is unambiguous.

## Cross-validation: pre-2.1.139 vs 2.1.139

| Aspect | Pre-2.1.139 | v2.1.139+ |
|--------|-------------|-----------|
| `/scroll-speed` command | n/a | Interactive picker |
| `CLAUDE_CODE_SCROLL_SPEED` env var | Effective (set externally) | Effective + persisted via dialog |
| Wheel events tracked in dialog | n/a | `sawScrollWheel`/`sawTrackpad` refs |
| Demo ruler | n/a | Shown when transcript shorter than 20 messages |
| Terminal/editor detection | n/a | `getTerminalDisplayName` + `describeEditorSensitivity` |
| Reset to auto | n/a | `r` key |
| Min / max speed | n/a | 1 / 10 |
| Telemetry event | n/a | `tengu_scroll_speed_set` |

## Related symbols

> Symbol mappings:
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Slash Commands / UI
> - [symbol_additions_v2_1_142_think_ui.md](../00_overview/symbol_additions_v2_1_142_think_ui.md) — new symbols

Key functions/objects in this document:
- `scrollSpeedCommandDef` (`lT5`) — slash command; cli_inner_pretty.js:476708-476720
- `scrollSpeedCommandEntrypoint` (`cT5`) — async wrapper; cli_inner_pretty.js:476693-476697
- `ScrollSpeedDialog` (`WJ4`) — interactive picker; cli_inner_pretty.js:476494-476601
- `renderScrollSpeedTrack` (`pT5`) — track visual; cli_inner_pretty.js:476617-476620
- `describeTerminal` (`UT5`) — terminal description string; cli_inner_pretty.js:476621-476627
- `describeEditorSensitivity` (`QT5`) — editor row; cli_inner_pretty.js:476664-476669
- `SCROLL_SPEED_RULER_MSG_THRESHOLD` (`dT5`) — 20; cli_inner_pretty.js:476692
- `MIN_SCROLL_SPEED` / `MAX_SCROLL_SPEED` (`WX8` / `$Z$`) — 1 / 10
- `CLAUDE_CODE_SCROLL_SPEED` (`ZaH`) — env var name; cli_inner_pretty.js:476675
- `tengu_scroll_speed_set` — telemetry event
