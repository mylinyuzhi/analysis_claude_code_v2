# `/tui` Command + `tui` Setting (v2.1.110) — v2.1.112

## Overview

v2.1.110 graduates the flicker-free renderer from "opt-in environment variable" (`CLAUDE_CODE_NO_FLICKER=1`, added v2.1.89) to a first-class **slash command** + **persistent setting**:

- `/tui` → shows the current renderer
- `/tui fullscreen` → switch to the flicker-free alt-screen renderer
- `/tui default` → switch back to the classic main-screen renderer

The mode is persisted to `userSettings.tui` so it survives across sessions. The renderer cannot hot-swap — the command **relaunches the session** preserving the conversation transcript via `--resume <id>`.

## Why a Slash Command (Not Just a Setting)

A `tui` field in `settings.json` would have worked, but a slash command is the right UX surface for *toggle-and-see-now*:

1. **Discoverability** — Slash menu shows `/tui` next to other UI commands.
2. **Immediate feedback** — User runs the command and the renderer flips on next turn (well, on next relaunch — which preserves the transcript).
3. **Banner on success** — `CLAUDE_CODE_TUI_JUST_SWITCHED=fullscreen` env var tells the relaunched process to show a one-shot "Using flicker-free rendering · go back with /tui default" banner with click-tips.
4. **Settings get backed up implicitly** — Most users don't edit `settings.json` directly; the command writes it for them.

## Command Definition

```javascript
// ============================================
// tuiCommandDef - /tui slash command registration
// Location: chunks.185.mjs:444-454
// ============================================

// ORIGINAL (for source lookup):
IcY = {
    type: "local",
    name: "tui",
    description: "Set the terminal UI renderer (default | fullscreen)",
    argumentHint: "[default|fullscreen]",
    supportsNonInteractive: !1,
    load: () => Promise.resolve().then(() => (qiK(), enK))
}

// READABLE (for understanding):
const tuiCommandDef = {
  type: "local",
  name: "tui",
  description: "Set the terminal UI renderer (default | fullscreen)",
  argumentHint: "[default|fullscreen]",
  supportsNonInteractive: false,  // requires an interactive REPL to relaunch into
  load: () => Promise.resolve().then(() => (loadTuiHandler(), tuiCommandModule))
};

// Mapping: IcY→tuiCommandDef, qiK→loadTuiHandler, enK→tuiCommandModule
```

**`supportsNonInteractive: false`** is crucial — `--print` mode has no TUI to relaunch into. The command would be a no-op.

## Handler — The Relaunch Flow

```javascript
// ============================================
// tuiCommandHandler - /tui <mode> dispatcher with session-preserving relaunch
// Location: chunks.185.mjs:397-431
// ============================================

// ORIGINAL (for source lookup):
bcY = async (q) => {
    let K = q.trim().toLowerCase();
    if (K === "") return {
        type: "text",
        value: `Current renderer: ${v7().tui??(lq()?"fullscreen":"default")}. Usage: /tui <${n$7.join("|")}>`
    };
    if (!n$7.includes(K)) return {
        type: "text",
        value: `Unknown renderer "${K}". Usage: /tui <${n$7.join("|")}>`
    };
    let _ = K, z = _ === "fullscreen";
    if (z === lq()) return {
        type: "text",
        value: `Already using the ${_} renderer.`
    };
    let { error: Y } = P7("userSettings", { tui: _ });
    if (Y) return {
        type: "text",
        value: `Failed to save setting: ${Y.message}`
    };
    return d("tengu_tui_command", { fullscreen: z }), er8({
        freshIfNoTranscript: !0,
        env: { CLAUDE_CODE_TUI_JUST_SWITCHED: _ },
        dropEnv: ["CLAUDE_CODE_NO_FLICKER", "CLAUDE_CODE_FORCE_FULLSCREEN_UPSELL"]
    })
}

// READABLE (for understanding):
const tuiCommandHandler = async (rawArgs) => {
  const arg = rawArgs.trim().toLowerCase();
  const validModes = ["default", "fullscreen"];

  // No arg → show current state.
  if (arg === "") {
    return {
      type: "text",
      value: `Current renderer: ${getUserSettings().tui ?? (isFullscreenMode() ? "fullscreen" : "default")}. Usage: /tui <${validModes.join("|")}>`
    };
  }

  // Validate mode.
  if (!validModes.includes(arg)) {
    return { type: "text", value: `Unknown renderer "${arg}". Usage: /tui <${validModes.join("|")}>` };
  }

  const targetMode = arg;
  const targetIsFullscreen = targetMode === "fullscreen";

  // No-op if already there.
  if (targetIsFullscreen === isFullscreenMode()) {
    return { type: "text", value: `Already using the ${targetMode} renderer.` };
  }

  // Persist to userSettings.
  const { error } = saveSettings("userSettings", { tui: targetMode });
  if (error) {
    return { type: "text", value: `Failed to save setting: ${error.message}` };
  }

  // Telemetry + relaunch.
  logEvent("tengu_tui_command", { fullscreen: targetIsFullscreen });
  return relaunchSession({
    freshIfNoTranscript: true,
    env: { CLAUDE_CODE_TUI_JUST_SWITCHED: targetMode },
    dropEnv: ["CLAUDE_CODE_NO_FLICKER", "CLAUDE_CODE_FORCE_FULLSCREEN_UPSELL"]
  });
};

// Mapping: bcY→tuiCommandHandler, n$7→validModes, v7→getUserSettings,
//          lq→isFullscreenMode, P7→saveSettings, d→logEvent, er8→relaunchSession
```

### Flow walk-through

For `/tui fullscreen` on a `default` session:

1. **Validate** the arg against `validModes` (`["default", "fullscreen"]`).
2. **Detect no-op** — `targetIsFullscreen === isFullscreenMode()` short-circuits.
3. **Persist** to `userSettings.tui` via `saveSettings()`. This survives crashes/closes.
4. **Drop conflicting env vars** — `CLAUDE_CODE_NO_FLICKER` is removed from the relaunched-process env so the env var doesn't second-guess the new setting.
5. **Inject relaunch marker** — `CLAUDE_CODE_TUI_JUST_SWITCHED=fullscreen` makes the new process show a banner (and click-tip hints, because users in fullscreen for the first time miss that they can click).
6. **Relaunch** via `relaunchSession()` with `--resume <session_id>` so the conversation persists.

## The Relaunch — Why a Process Restart

```javascript
// ============================================
// relaunchSession - re-spawn with same session-id, drop/add specific env vars
// Location: chunks.185.mjs:354-381
// ============================================

// ORIGINAL (for source lookup):
async function er8(q = {}) {
    let { cmd: K, prefixArgs: _ } = q.launcher ?? CC6(), z = I8(), Y = !0;
    if (q.freshIfNoTranscript) Y = await ScY(bY()).then((w) => w.size > 0, () => !1);
    ZS4(), setInterval(() => {}, 1073741824), await aQ(mT(), 2000, "flush timeout").catch(() => {}), u88(), await aQ(_w8(), 2000, "cleanup timeout").catch(() => {}), q.preSpawn?.();
    let A = { ...process.env };
    delete A.CLAUDE_CODE_TUI_JUST_SWITCHED, Object.assign(A, q.env);
    for (let w of q.dropEnv ?? []) delete A[w];
    let O = RcY(K, Y ? [..._, "--resume", z] : [..._], { stdio: "inherit", env: A });
    O.ref(), pF8();
    for (let w of ["SIGINT", "SIGTERM", "SIGHUP"]) process.removeAllListeners(w), process.on(w, () => {});
    return new Promise(() => {
        O.on("close", (w, $) => {
            let j = $ ? 128 + (CcY.signals[$] ?? 0) : 0;
            process.exit(w ?? j)
        }), /* error */
    })
}

// READABLE (for understanding):
async function relaunchSession(opts = {}) {
  const { cmd, prefixArgs } = opts.launcher ?? detectLauncher();
  const sessionId = getCurrentSessionId();

  // freshIfNoTranscript: skip --resume if transcript file is empty (welcome path).
  let resumeSession = true;
  if (opts.freshIfNoTranscript) {
    resumeSession = await fileSize(transcriptPath(sessionId)).then((size) => size > 0, () => false);
  }

  // Block exit handlers, flush telemetry, run cleanup.
  blockExitOnce();
  setInterval(() => {}, 1073741824);             // keep the event loop alive past flush
  await withTimeout(flushTelemetry(), 2000, 'flush timeout').catch(() => {});
  destroyKeepalive();
  await withTimeout(runCleanup(), 2000, 'cleanup timeout').catch(() => {});
  opts.preSpawn?.();

  // Build new env: clear the marker, apply caller's overrides, then drop specified keys.
  const env = { ...process.env };
  delete env.CLAUDE_CODE_TUI_JUST_SWITCHED;
  Object.assign(env, opts.env);
  for (const key of opts.dropEnv ?? []) delete env[key];

  // Spawn the new process inheriting stdio.
  const args = resumeSession ? [...prefixArgs, '--resume', sessionId] : [...prefixArgs];
  const child = spawnDetached(cmd, args, { stdio: 'inherit', env });
  child.ref();
  uninstallSignalHandlers();

  // Decouple this process from signals — the child owns the terminal now.
  for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.removeAllListeners(sig);
    process.on(sig, () => {});
  }

  // Never resolve; exit when the child exits.
  return new Promise(() => {
    child.on('close', (code, signal) => {
      const exitCode = signal ? 128 + (signalToNumber[signal] ?? 0) : 0;
      process.exit(code ?? exitCode);
    });
  });
}

// Mapping: er8→relaunchSession, CC6→detectLauncher, I8→getCurrentSessionId,
//          ScY→fileSize, bY→transcriptPath, ZS4→blockExitOnce, mT→flushTelemetry,
//          aQ→withTimeout, u88→destroyKeepalive, _w8→runCleanup, RcY→spawnDetached,
//          pF8→uninstallSignalHandlers, CcY.signals→signalToNumber
```

### Why hot-swap isn't possible

Hot-swapping renderers would require:

1. **Tear down Ink** — DOM tree, reconciler, event handlers, signal handlers.
2. **Re-initialize `terminal-focus-state.ts`** — alt-screen has different cursor/focus semantics.
3. **Re-attach mouse parser** — the parser dispatches differently in alt-screen.
4. **Re-set `selection.ts`** — selection is mouse-driven in alt-screen vs OS-native in main-screen.
5. **Migrate virtualized scrollback ↔ OS scrollback** — content rendered in main scrollback is gone forever after `ENTER_ALT_SCREEN`.

Each of these is a state machine that has its own race conditions during initialization. Combining them in a hot-swap risks dropped keys, corrupted scroll position, broken modal stacks, and unrecoverable terminal state. The transactional cost of "save session → spawn fresh process → resume same session" is one second of relaunch — far cheaper than the engineering cost of safe hot-swap.

### Why `setInterval(() => {}, 1073741824)`

The 1.07 billion ms (≈ 12.4 days) interval is a **node.js exit-prevention idiom**: keep the event loop alive across the synchronous-looking-async cleanup so node doesn't exit before the child is fully spawned. The interval is never *cleared* because the process will `process.exit()` from the close handler.

### Why drop signal handlers

Once the child is spawned with `stdio: 'inherit'`, the terminal is *its* terminal. The parent process is just waiting to exit. If the parent still had `SIGINT` handlers, hitting Ctrl+C would trigger the parent's cleanup *while the child is running*, corrupting terminal state. The empty no-op handlers `process.on(sig, () => {})` swallow the signal — the child (which has its own handlers) responds.

## Banner After Relaunch — `CLAUDE_CODE_TUI_JUST_SWITCHED`

```javascript
// ============================================
// tuiJustSwitchedBanner - one-shot post-relaunch banner
// Location: chunks.181.mjs:1474-1509
// ============================================

// READABLE:
function tuiJustSwitchedBanner() {
  switch (process.env.CLAUDE_CODE_TUI_JUST_SWITCHED) {
    case "fullscreen":
      return (
        <Box flexDirection="column">
          <Text>
            <SuccessGlyph withSpace />
            <Text color="success">Using flicker-free rendering</Text>
            <Text dimColor> · go back with /tui default</Text>
          </Text>
          <Text dimColor>  · Click to move your cursor in the text input</Text>
          <Text dimColor>  · Click to expand collapsed tool results</Text>
          <Text dimColor>  · By default, text auto-copies when you select it (/config to change)</Text>
        </Box>
      );
    case "default":
      return <Text dimColor>Switched back to the classic renderer</Text>;
    default:
      return null;
  }
}
```

The `relaunchSession` function *deletes* this env var from the relaunched env (`delete A.CLAUDE_CODE_TUI_JUST_SWITCHED`), then re-adds it via `Object.assign(A, q.env)` if the caller asked for it. This guarantees the banner only appears once — subsequent relaunches (e.g., crash recovery) won't re-show it because the var is gone.

## The `tui` Setting Schema

```javascript
// ============================================
// tuiSettingSchema - settings.json validation for tui field
// Location: chunks.19.mjs:547
// ============================================

tui: y.enum(["default", "fullscreen"]).optional().describe(
  'Terminal UI renderer. "fullscreen" uses the flicker-free alt-screen renderer with virtualized scrollback (equivalent to CLAUDE_CODE_NO_FLICKER=1). "default" uses the classic main-screen renderer.'
)
```

The schema sits next to a sibling `viewMode` enum that overrides the *default transcript view* on startup:

```javascript
// chunks.19.mjs:510
viewMode: y.enum(["default", "verbose", "focus"]).optional().catch(void 0)
  .describe("Default transcript view mode on startup")
```

`viewMode` and `tui` are orthogonal — one chooses *renderer*, the other chooses *transcript verbosity*. `viewMode: "focus"` only takes effect when `tui` resolves to fullscreen (focus view is fullscreen-only).

## Why "tui" as the Setting Name (Not "renderer" or "noFlicker")

The intent is the *terminal UI*, not just flicker prevention. Future renderers (e.g., a hypothetical Sixel-rich mode) could be added to the enum without renaming the key. Naming the setting after the underlying mechanism (`noFlicker`) would have been over-specific — flicker-free is one *feature* of fullscreen, not the whole point.

## Cross-Validation with v2.1.88

v2.1.88's `src/utils/fullscreen.ts:112-128` defines `isFullscreenEnvEnabled` which is *only* env-var + tmux + `USER_TYPE === 'ant'`. There's no `tui` setting check — that case-statement (Layer 4 in v2.1.112's cascade) is a v2.1.110 addition. The v2.1.88 source has no `/tui` command file; `claude-code-kim/src/commands/` shows no `tui.ts`.

The v2.1.88 telemetry table has no `tengu_tui_command` event. This event was added in v2.1.110 to track adoption of the new command.

## Telemetry

- `tengu_tui_command` — Fired on every successful `/tui` invocation with `{ fullscreen: boolean }`.
- `tengu_fullscreen_upsell_shown` — Fired when the upsell banner for fullscreen mode is shown (different from `JUST_SWITCHED`).

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) - Canonical
> - [symbol_additions_unit_11.md](../00_overview/symbol_additions_unit_11.md) - This unit

Key functions:
- `tuiCommandHandler` (`bcY`) - The async dispatcher (chunks.185.mjs:397-431)
- `tuiCommandDef` (`IcY`) - Command registration object (chunks.185.mjs:444-454)
- `validTuiModes` (`n$7`) - `["default", "fullscreen"]` (chunks.185.mjs:438)
- `relaunchSession` (`er8`) - Process restart with `--resume` (chunks.185.mjs:354-381)
- `tuiJustSwitchedBanner` (`udK`) - Banner React component (chunks.181.mjs:1474-1509)
- `fullscreenUpsellBanner` (`xdK`) - Upsell suggestion banner (chunks.181.mjs:1457-1472)
- `recordFullscreenUpsellSeen` (`IdK`) - Increments seen-count + telemetry (chunks.181.mjs:1445-1455)

v2.1.88 cross-reference: no command file existed; the v2.1.88 baseline only had `CLAUDE_CODE_NO_FLICKER`.
