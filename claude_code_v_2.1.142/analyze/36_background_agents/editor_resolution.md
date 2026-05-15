# Editor Resolution — v2.1.142

## TL;DR

Before v2.1.142, the `v` shortcut in attached `claude agents` sessions ("open transcript in editor") used the *daemon worker's* `$EDITOR`/`$VISUAL` — the env vars present when the daemon was started, often hours ago. After v2.1.142, the attached terminal's `$EDITOR`/`$VISUAL` flow through to the worker via the new `attacher-caps` rv-protocol message, so the editor opens with whatever the *current* shell has configured.

The mechanism: when a foreground terminal attaches to a worker via `claude agents`, it serializes its capability state (terminal type, hyperlink support, color level, browser, **editor**, etc.) and sends it over the rv-socket. The worker stores it in module-global state (`attacherCaps`). `xy.resolvePreferredEditor` reads `attacherCaps?.editor` first, then falls back to the worker's own `process.env.VISUAL`/`EDITOR`.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)

Key functions:
- `getAttacherCaps` (`vJ`) — Read forwarded attacher capabilities (cli_inner_pretty.js:2686-2688)
- `setAttacherCaps` (`aV8`) — Setter, called on `attacher-caps` rv-message (cli_inner_pretty.js:2689-2691)
- `resolvePreferredEditor` (`xy`) — `attacherCaps?.editor ?? envDefaultEditor` (cli_inner_pretty.js:445808-445810)
- `envDefaultEditor` (`dj5`) — Memoized env-based fallback (cli_inner_pretty.js:445829-445833)
- `openInEditorAsync` (`Lj8`) — The `v` shortcut handler (cli_inner_pretty.js:445773-445806)
- `getEditorDisplayName` (`Ox6`) — Used in dialog messages (cli_inner_pretty.js:445811-445816)
- Attacher message tag: `attacher-caps` (handled at cli_inner_pretty.js:390693-390696)
- Constants: `GUI_EDITORS` (`Uj5`), `TERMINAL_EDITOR_REGEX` (`Fj5`), `EDITORS_NEEDING_G_FLAG` (`gj5`)

---

## Capability Forwarding Pipeline

```
Foreground terminal                              BG worker (daemon child)
───────────────────                              ──────────────────────
process.env.VISUAL=nano
process.env.EDITOR=vim
process.stdout.isTTY=true
hyperlinks: supported
colorLevel: 3

│
│ User runs `claude agents`, picks a session, presses Enter
▼
┌──────────────────────────────┐
│ collect terminal capabilities│
│ (browser, colorLevel, editor,│
│  hyperlinks, wtSession, etc.)│
└──────────────────────────────┘
│
│ rv-socket: send {type:"attacher-caps", caps: {...}}
▼
                                                ┌──────────────────────────────┐
                                                │ rv-message handler           │
                                                │ q.type === "attacher-caps":  │
                                                │   aV8(q.caps)                │
                                                │   GNK(q.caps?.colorLevel)    │
                                                └──────────────────────────────┘
                                                │
                                                ▼
                                                U$.attacherCaps = { editor: "vim", ... }

│ User presses 'v' in dashboard/transcript
▼
                                                xy() = attacherCaps?.editor ?? dj5()
                                                     = "vim"
                                                Lj8(transcript_path, lineno)
                                                  spawn "vim" with file
                                                  (terminal editor)
```

## The Resolver

```javascript
// ============================================
// resolvePreferredEditor - Pick the editor to launch for `v` shortcut
// Location: cli_inner_pretty.js:445808-445810
// ============================================

// ORIGINAL (for source lookup):
function xy() {
  return vJ()?.editor ?? dj5();
}

// READABLE (for understanding):
function resolvePreferredEditor() {
  // First: respect the attaching terminal's $VISUAL/$EDITOR if attached
  // Fallback: own process env
  return getAttacherCaps()?.editor ?? envDefaultEditor();
}

// Mapping: xy→resolvePreferredEditor, vJ→getAttacherCaps, dj5→envDefaultEditor
```

```javascript
// ============================================
// envDefaultEditor - Memoized fallback editor from own env / PATH
// Location: cli_inner_pretty.js:445829-445833
// ============================================

// ORIGINAL (for source lookup):
dj5 = L8(() => {
  if (process.env.VISUAL?.trim()) return process.env.VISUAL.trim();
  if (process.env.EDITOR?.trim()) return process.env.EDITOR.trim();
  return ["code", "vi", "nano"].find(($) => pj5($));
});

// READABLE (for understanding):
const envDefaultEditor = memoize(() => {
  if (process.env.VISUAL?.trim()) return process.env.VISUAL.trim();
  if (process.env.EDITOR?.trim()) return process.env.EDITOR.trim();
  // Last-resort fallbacks: probe for a binary on $PATH
  return ["code", "vi", "nano"].find((bin) => isOnPath(bin));
});

// Mapping: dj5→envDefaultEditor, L8→memoize, pj5→isOnPath
```

### Why `VISUAL` Before `EDITOR`?

POSIX convention. `$VISUAL` is the "full-screen" editor (e.g., vim, emacs); `$EDITOR` is the lowest-common-denominator (e.g., ed). When opening a multi-line transcript, the user almost certainly wants the full-screen one. If both are unset and PATH doesn't have `code`/`vi`/`nano`, the function returns `undefined` and the caller falls back to "wrote N · no $VISUAL/$EDITOR set".

### Why Memoize?

`envDefaultEditor` is called multiple times per session (every time the user presses `v` in any context — agent view, transcript view, error display). Memoizing avoids redundant `pj5` (which does `which`/`Get-Command`/`where` shellouts to test PATH). The function is also memoized because the env is *fixed for the worker's lifetime*: it never changes after fork.

---

## The Attacher-Caps Protocol

```javascript
// ============================================
// rv-message handler — attacher-caps branch
// Location: cli_inner_pretty.js:390693-390696
// ============================================

if (q.type === "attacher-caps") {
  (aV8(q.caps), GNK(q.caps?.colorLevel));
  return;
}

// READABLE (for understanding):
if (msg.type === "attacher-caps") {
  setAttacherCaps(msg.caps);
  setColorLevel(msg.caps?.colorLevel);
  return;
}
```

The message arrives over the rendezvous (rv) socket, the same channel used for other attacher-to-worker control messages (`exit`, `repaint`, `reply`, etc.). Two side effects:

1. **`setAttacherCaps(caps)`** — store the caps blob in `U$.attacherCaps`. Subsequent `getAttacherCaps()` calls return this until the attacher disconnects or sends a clearing message.
2. **`setColorLevel(colorLevel)`** — separately propagate the color level so chalk/Ink rendering can use the right ANSI escape set. This is what fixes the "background color bleed" issue with Apple Terminal: previously, the worker used its own non-TTY-derived color level (often `Level.None`), so it didn't emit terminal-reset sequences correctly. With the attacher's `colorLevel: 1` (256-color), the worker now emits proper resets.

The caps shape (from `cli_inner_pretty.js:508809-508828`):

```javascript
function gatherTerminalCaps() {
  return {
    type: terminalType,         // e.g., "apple-terminal", "iterm2", "vscode"
    cwd: process.cwd(),
    isTTY: process.stdout.isTTY,
    width: process.stdout.columns,
    height: process.stdout.rows,
    wheelFlood: wheelFloodDetected(),
    hyperlinks: hyperlinkSupport(),
    progressReporting: progressReportingSupport(),
    wtSession: !!process.env.WT_SESSION,
    isVscodeTerm: process.env.TERM_PROGRAM === "vscode",
    browser: process.env.BROWSER ?? null,
    colorLevel: chalk.level,
    editor: process.env.VISUAL?.trim() || process.env.EDITOR?.trim() || null,
  };
}
```

Note that `editor` is **only** from `$VISUAL`/`$EDITOR` env — it doesn't fall back to PATH probing. This is intentional: if the attacher has neither env var set, *no* editor preference is forwarded, and the worker falls back to its own `envDefaultEditor` (which does the PATH probe).

---

## The `v` Shortcut

```javascript
// ============================================
// openInEditorAsync - The 'v' key handler in agent view/transcript
// Location: cli_inner_pretty.js:445773-445806
// ============================================

// ORIGINAL (for source lookup):
function Lj8(H, $) {
  let q = xy();
  if (!q) return !1;
  let K = q.split(" "),
    _ = K[0] ?? q,
    A = K.slice(1),
    z = fx6(q);     // detect GUI editor (code, cursor, …)
  if (z) {
    let O = Qj5(z, H, $),         // build args (e.g., ["-g", "file:line"])
      M = { detached: !0, stdio: "ignore" },
      w;
    return ((w = Jj8.spawn(_, [...A, ...O], M)),
            w.on("error", (D) => N(`editor spawn failed: ${D}`, { level: "error" })),
            w.unref(),
            !0);
  }
  let Y = T_.get(process.stdout);
  if (!Y) return !1;
  let f = $ && Fj5.test(Xj8.basename(_));    // is it a terminal editor (vi/vim/…)?
  Y.enterAlternateScreen();
  try {
    let O = { stdio: "inherit" }, M;
    {
      let w = [...A, ...(f ? [`+${$}`, H] : [H])];
      M = Jj8.spawnSync(_, w, O);
    }
    if (M.error) return (N(`editor spawn failed: ${M.error}`, { level: "error" }), !1);
    return !0;
  } finally {
    Y.exitAlternateScreen();
  }
}

// READABLE (for understanding):
function openInEditorAsync(filePath, lineNumber) {
  const editor = resolvePreferredEditor();
  if (!editor) return false;

  const parts = editor.split(" ");
  const bin = parts[0] ?? editor;
  const baseArgs = parts.slice(1);
  const guiKind = detectGuiEditor(editor);     // matches "code", "cursor", "windsurf", …

  if (guiKind) {
    // GUI editor: detached, fire-and-forget
    const args = guiArgsForLine(guiKind, filePath, lineNumber);   // e.g., ["-g", "file:line"]
    const child = childProcess.spawn(bin, [...baseArgs, ...args], { detached: true, stdio: "ignore" });
    child.on("error", (err) => log(`editor spawn failed: ${err}`, { level: "error" }));
    child.unref();
    return true;
  }

  // Terminal editor: take over the alt-screen, block until exit
  const ink = getInkInstance();
  if (!ink) return false;
  const isTerminalEditor = lineNumber && /\b(vi|vim|nvim|nano|emacs|pico|micro|helix|hx)\b/.test(path.basename(bin));
  ink.enterAlternateScreen();
  try {
    const args = [...baseArgs, ...(isTerminalEditor ? [`+${lineNumber}`, filePath] : [filePath])];
    const result = childProcess.spawnSync(bin, args, { stdio: "inherit" });
    if (result.error) { log(`editor spawn failed: ${result.error}`, { level: "error" }); return false; }
    return true;
  } finally {
    ink.exitAlternateScreen();
  }
}

// Mapping: Lj8→openInEditorAsync, H→filePath, $→lineNumber, q→editor,
//          K→parts, _→bin, A→baseArgs, z→guiKind, O→args/result,
//          M→child/result, w→child, Y→ink, f→isTerminalEditor,
//          Jj8→childProcess, Xj8→path,
//          fx6→detectGuiEditor, Qj5→guiArgsForLine, Fj5→terminal-editor regex
```

The split between **GUI editor** (detached, no terminal handoff) and **terminal editor** (synchronous, alt-screen handoff) is essential:

- **GUI editor** (`code`, `cursor`, `windsurf`, `codium`, `subl`, `atom`, `gedit`, `notepad++`, `notepad`): spawned **detached**. The dashboard keeps running. The editor opens in a new window. No alt-screen takeover.
- **Terminal editor** (`vi`/`vim`/`nvim`/`nano`/`emacs`/`pico`/`micro`/`helix`/`hx`): spawned **synchronously** with stdio inherited. The dashboard yields its alt-screen to the editor. When the user exits the editor, dashboard takes back the alt-screen.

The `EDITORS_NEEDING_G_FLAG` constant (`gj5 = new Set(["code","cursor","windsurf","codium"])`) is the subset of GUI editors that need `-g file:line` to open at a specific line. Other GUIs use bare paths.

---

## Why Not Just Forward `$EDITOR` as an Env Var?

The naive solution would be: when the foreground process spawns the worker (or each time it attaches), copy `$EDITOR`/`$VISUAL` into the worker's env. That doesn't work for two reasons:

1. **The worker is long-lived.** A worker spawned this morning might be attached by different terminals throughout the day (e.g., user closes laptop, opens it again at a different cafe, attaches via a new terminal with different env). Env vars are set at spawn — once. The new terminal's env wouldn't reach an already-running worker.
2. **Daemon spawning chain.** The worker is spawned by the daemon, which itself was spawned by the user's first interactive `claude` invocation hours ago. The daemon's env may have nothing to do with the current terminal's env.

The `attacher-caps` rv-message solves both: it sends *current* capabilities of the *current* terminal at attach time, and the worker re-uses them until the next attach. Capabilities are dynamic state owned by the runtime, not static fork-time configuration.

---

## What Happens When the Attacher Disconnects?

After Ctrl+Z (detach), the rv-socket either reconnects to a different attacher or is closed. The current implementation **does not clear** `U$.attacherCaps` on disconnect — the worker keeps using the most recent attacher's caps. This is intentional:

- If the worker writes any new output (e.g., a tool result), it formats colors based on the cached caps until a new attacher overrides.
- When a new attacher attaches, it sends fresh caps as part of the handshake, overwriting the cache.

The risk: a worker that was attached only briefly retains stale caps after disconnect. But because nothing user-visible flows through the worker without an attacher present (it just buffers output), the staleness is invisible.

---

## Edge Cases

### Editor with arguments

If `$EDITOR="code --wait"`, the resolver splits on whitespace: `bin="code"`, `baseArgs=["--wait"]`. The `--wait` is preserved through to spawn, so `code --wait file:line` opens VS Code with the wait semantics intact.

### Editor that contains a `/`

`$EDITOR="/usr/local/bin/code"` works: `path.basename(bin)` strips to `code`, the GUI detection sees `code` and uses the `-g` flag flow.

### Editor with embedded spaces in path (Windows)

`$EDITOR="C:\\Program Files\\code\\code.exe"` — the simple `split(" ")` breaks this. The naive parser would split it into `["C:\\Program", "Files\\code\\code.exe"]`, which is wrong. The code doesn't handle this case — users must quote-escape or set `$EDITOR` to a no-space path. This is a known limitation, not v2.1.142-specific.

### No editor configured anywhere

Both attacher caps and worker env are empty, PATH has no `code`/`vi`/`nano`. `resolvePreferredEditor` returns `undefined`. `Lj8` returns `false` immediately. The user sees `wrote ${path} · no $VISUAL/$EDITOR set` in the `v` shortcut's status banner (line 445848).

### Editor command fails to launch

`spawn`/`spawnSync` error is logged but not surfaced to the user. The fallback is `wrote ${path}` — the user knows where the file is and can open it manually.

---

## Validation

| Claim | Source |
|-------|--------|
| `xy.resolvePreferredEditor` prefers `attacherCaps.editor` over env | cli_inner_pretty.js:445808-445810 |
| `attacherCaps.editor` is set from the rv-protocol `attacher-caps` message | cli_inner_pretty.js:390693-390696 |
| Terminal capability gathering includes the attacher's editor env | cli_inner_pretty.js:508827 |
| GUI editors use detached spawn + `-g file:line` | cli_inner_pretty.js:445780-445790 |
| Terminal editors use alt-screen handoff + `+lineno file` | cli_inner_pretty.js:445798-445803 |
| The `v` shortcut handler is `Lj8` | cli_inner_pretty.js:581830-581854 (caller in transcript view) |
