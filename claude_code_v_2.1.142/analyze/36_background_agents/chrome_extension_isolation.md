# Chrome Extension Shim Isolation — v2.1.142

## TL;DR

Background workers are spawned non-TTY (`process.stdout.isTTY === false`), which sets `isInteractive=false` (`oV8(!A)` at cli_inner_pretty.js:605864). The Claude-in-Chrome MCP shim's gate (`AL8.isClaudeInChromeEnabled`) checks `T6() === !isInteractive` and **returns false in non-interactive workers**. This is how the chrome shim stays *out* of fresh bg sessions.

The v2.1.142 fix addressed a related case: **already-running bg workers** that get attached via `claude agents`. Once an attaching terminal forwards its capabilities via the `attacher-caps` rv message, the worker temporarily *looks* attached, but it should not enable the Chrome shim — the user's *host shell* should handle browser actions (e.g., clicking a link in the transcript), not the worker's headless shim. Previously, links clicked in an attached agent-view session would try to dispatch through the worker's nonexistent Chrome shim, crashing the worker process. Now, the gate evaluation happens *before* attachment, and the shim is committed/uncommitted for the worker's lifetime — not toggled on every attach.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md)

Key functions:
- `isClaudeInChromeEnabled` (`AL8`) — Gate function that returns false in non-TTY workers (cli_inner_pretty.js:493305-493314)
- `isClaudeInChromeAutoEnableEligible` (`daH`) — Auto-enable gate (interactive only) (cli_inner_pretty.js:493315-493322)
- `getChromeFlagOverride` (`I8H`) — Read user's per-session override (cli_inner_pretty.js:2887-2889)
- `setChromeFlagOverride` (`Nv8`) — Write user's per-session override (cli_inner_pretty.js:2884-2886)
- `isNonInteractive` (`T6`), `isInteractive` (`Xv`), `setIsInteractive` (`oV8`) — Interactive-state accessors (cli_inner_pretty.js:2677-2685)
- `setupClaudeInChromeNativeHost` (`rp6`) — Returns the MCP config blob (cli_inner_pretty.js:493323-…)
- Constant: `hg = "claude-in-chrome"` (the MCP server name) (cli_inner_pretty.js:236140)
- chrome bridge events: `chrome_bridge_connection_failed`, `chrome_bridge_connection_succeeded`, `chrome_bridge_peer_connected`, etc. (cli_inner_pretty.js:11203-11577)

---

## The Gate

```javascript
// ============================================
// isClaudeInChromeEnabled - Returns true iff Chrome shim should be active
// Location: cli_inner_pretty.js:493305-493314
// ============================================

// ORIGINAL (for source lookup):
function AL8(H) {
  if (H === !0) return !0;
  if (H === !1) return !1;
  if (bH(process.env.CLAUDE_CODE_ENABLE_CFC)) return !0;
  if (E4(process.env.CLAUDE_CODE_ENABLE_CFC)) return !1;
  if (T6()) return !1;          // ← the key check: non-interactive ⇒ disabled
  let $ = h$();
  if ($.claudeInChromeDefaultEnabled !== void 0) return $.claudeInChromeDefaultEnabled;
  return !1;
}

// READABLE (for understanding):
function isClaudeInChromeEnabled(perSessionOverride) {
  // 1. Explicit per-session override (--chrome / --no-chrome)
  if (perSessionOverride === true)  return true;
  if (perSessionOverride === false) return false;
  // 2. Env var override
  if (parseBool(process.env.CLAUDE_CODE_ENABLE_CFC)) return true;
  if (parseBoolFalse(process.env.CLAUDE_CODE_ENABLE_CFC)) return false;
  // 3. Non-interactive workers (bg, sdk, --print, --init-only) ⇒ disabled
  if (isNonInteractive()) return false;
  // 4. Global config default
  const globalConfig = getGlobalConfig();
  if (globalConfig.claudeInChromeDefaultEnabled !== undefined)
    return globalConfig.claudeInChromeDefaultEnabled;
  // 5. Off by default
  return false;
}

// Mapping: AL8→isClaudeInChromeEnabled, H→perSessionOverride, T6→isNonInteractive,
//          bH→parseBool, E4→parseBoolFalse, h$→getGlobalConfig
```

### The Cascading Decision

The cascade is intentional and ordered. Each layer overrides the layers below:

1. **Per-session CLI flag** (`--chrome`/`--no-chrome` on the foreground binary). User asked explicitly.
2. **Env var** (`CLAUDE_CODE_ENABLE_CFC=1`/`0`). For CI or scripted contexts.
3. **`isNonInteractive()` gate**. The "bg workers shouldn't have a Chrome shim" rule. This sits *above* the global config so an admin who enabled Chrome globally still doesn't get crashes from bg workers.
4. **Global config default** (`claudeInChromeDefaultEnabled` in `~/.claude/global-config.json`). The user's persistent preference.
5. **Default false**. Off unless explicitly opted in.

### Why `T6()` (Non-Interactive) and Not "isBgWorker"?

A bg worker is non-TTY *because* it's a bg worker. Non-TTY is the symptom; bg-ness is the cause. But several non-bg contexts are also non-TTY:

- `claude --print` (one-shot output): non-TTY when piped.
- `claude --init-only` (initialize and exit): non-TTY.
- SDK mode (programmatic invocation): non-TTY.

All these contexts equally don't have a real foreground terminal where browser interactions would make sense. Gating on TTY catches them all, with one rule.

The bootstrap path that sets `isInteractive` is:
```javascript
// cli_inner_pretty.js:605858-605864
let $ = process.argv.slice(2),
    q = $.includes("-p") || $.includes("--print"),
    K = $.includes("--init-only"),
    _ = $.some((O) => O.startsWith("--sdk-url")),
    A = q || K || _ || !process.stdout.isTTY;
if (A) _fH();    // disable certain UI features in non-interactive
oV8(!A);          // setIsInteractive(!A) — true iff truly interactive
```

So `isInteractive` is **set once at process start** and never changes for the worker's lifetime. The bg worker is spawned with `--bg-internal` and no TTY, so it always reaches `oV8(false)`. The Chrome shim gate sees `T6()=true` and never installs the MCP server.

---

## What the Gate Decides Not to Install

When `isClaudeInChromeEnabled` returns false, the `rp6.setupClaudeInChromeNativeHost` call is skipped entirely. That means the worker's MCP server registry never includes:

```javascript
{
  [hg /* "claude-in-chrome" */]: {
    type: "stdio",
    command: process.execPath,
    args: ["--claude-in-chrome-mcp"],
    scope: "dynamic",
    ...(K && { env: { CLAUDE_CHROME_PERMISSION_MODE: "skip_all_permission_checks" } }),
  }
}
```

…nor are the `mcp__claude-in-chrome__*` tools (`tabs_context_mcp`, `tabs_create_mcp`, `gif_creator`, `read_console_messages`, `javascript_tool`, …) added to the worker's `allowedTools` list, nor is the chrome-related system prompt section appended.

Without the MCP server, the worker has no way to invoke chrome operations. Tool calls that would have routed through `mcp__claude-in-chrome__*` would surface as "tool not found" errors instead — explicit failure rather than crash.

---

## Why "Crash-Looping" Pre-Fix?

The pre-fix bug: a bg worker's chrome shim was being *partially* initialized — the MCP server config was registered, but the underlying Chrome bridge connection had nothing to talk to (no shared tab, no extension peer). When tool calls fired, they reached the bridge layer, which threw because there was no peer.

The exception propagated up and **terminated the worker process**. The daemon's adopt path tried to re-spawn the same worker. The worker re-ran the chrome bridge setup. Same exception. Crash-loop.

The v2.1.142 fix is preventive: don't even *register* the shim in non-interactive workers. That's what `T6()` returning false from `AL8` accomplishes.

A related fix is the "attached session" piece: even when a foreground terminal attaches, the worker doesn't re-evaluate `AL8`. The decision was made at spawn time. So the chrome shim stays out of the worker regardless of attachment state. Clicking a link in the agent-view attached session goes through the **attaching terminal**'s open-url path (the host terminal's URL-handling), not through the worker.

---

## Where Chrome Setup Actually Happens

```javascript
// Excerpt from cli_inner_pretty.js around 606540-606575 (foreground action handler)
let mH = z;                   // option bag from Commander
Nv8(mH.chrome);                // store per-session override
let UH = AL8(mH.chrome) && qq();      // ← shim gate
let q$ = !UH && daH();                // ← auto-enable gate
if (UH) {
  let R8 = c$();
  try {
    d("tengu_claude_in_chrome_setup", { platform: R8 });
    let { mcpConfig, allowedTools, systemPrompt } = rp6();    // install
    WH = { ...WH, ...mcpConfig };
    J.push(...allowedTools);
    if (systemPrompt) lH = lH ? `${systemPrompt}\n\n${lH}` : systemPrompt;
  } catch (err) {
    d("tengu_claude_in_chrome_setup_failed", { platform: R8 });
    N(`[Claude in Chrome] Error: ${err}`);
    return hq("Error: Failed to run with Claude in Chrome.");
  }
} else if (q$) {
  try {
    let { mcpConfig } = rp6();
    WH = { ...WH, ...mcpConfig };       // install MCP without injecting prompt or perms
    let promptSnippet = JK7;
    lH = lH ? `${lH}\n\n${promptSnippet}` : promptSnippet;
  } catch (err) { N(`[Claude in Chrome] Error (auto-enable): ${err}`); }
}
```

Key observation: **`AL8` is paired with `qq()`** (which tests OAuth subscription). The `AL8(mH.chrome) && qq()` says "shim active iff both interactive **and** user has a subscription." This is the gate for the full Chrome-in-Chrome experience.

`daH` (`isClaudeInChromeAutoEnableEligible`) is a stricter gate that *additionally* requires `Xv() && rN5() && Z$("tengu_chrome_auto_enable", !1)`:
- `Xv()` = `isInteractive` (which equals `!T6()`)
- `rN5()` is a separate platform check (the chrome native host is installable on this OS)
- `Z$("tengu_chrome_auto_enable", false)` is the experimental flag for auto-enable

When `UH` is false but `daH` is true, the MCP server is installed *without* tooltips or auto-enable system-prompt injection — the user can use it but isn't actively pushed to.

For bg workers, both `AL8` (via `T6`) and `daH` (via `Xv`) return false. Neither path installs the shim. The worker is fully chrome-shim-free.

---

## What "Attached" Does and Doesn't Enable

The `attacher-caps` rv-message handler (covered in `editor_resolution.md`) sets `U$.attacherCaps`. The Chrome gate does **not** read this. Even with a fully-attached terminal with `chrome: true` in its caps, `isClaudeInChromeEnabled` still returns `false` in the worker because `T6()` is still true.

This is the *correct* design:

- **Editor** (`v` shortcut): the user's *host shell* doesn't run vim — only the *attached worker* runs vim. Capabilities forwarding makes the worker know which editor to launch on the host's behalf.
- **Chrome** (clicking a link in the transcript): the user's *host terminal* opens URLs (via `OSC 8` hyperlinks, or via `open`/`xdg-open` from a shell-key handler). The worker has no reason to involve a Chrome shim.

The asymmetry: editor *runs in the worker* (the worker spawns vim with the host's `$EDITOR`). Browser actions *run in the host* (the host handles OSC 8 clicks).

---

## What Users See

| Scenario | Pre-fix behavior | Post-fix behavior |
|----------|------------------|-------------------|
| Fresh `claude agents` dispatch (bg worker) | (shouldn't have shim; usually didn't) | (no change — still no shim) |
| Foreground `claude` with `--chrome` | Shim enabled | (no change — still enabled) |
| Foreground `claude` without `--chrome`, then `←←` to agent view → bg dispatch | Bg dispatch shouldn't have shim; might have, partially | Reliably no shim |
| Existing bg worker, attached via `claude agents` | Attaches, then clicking a link crashes the worker | Attaches; clicking a link is handled by host terminal |
| Existing bg worker, model wants to use `mcp__claude-in-chrome__*` | Tool exists in registry, calls fail at bridge | Tool doesn't exist in registry; model gets "tool not found" |

The "tool not found" outcome is intentional: the model is *told* its toolset (in system prompt), and that toolset never includes Chrome MCP for bg workers. So the model won't try to call those tools in the first place.

---

## Telemetry

| Event | Purpose |
|-------|---------|
| `tengu_claude_in_chrome_setup` | Logged when the shim is actually being installed. Has platform info. |
| `tengu_claude_in_chrome_setup_failed` | Logged on install error. |
| `chrome_bridge_connection_started` / `_succeeded` / `_failed` | Bridge-layer events (only fired when the shim is present). |
| `chrome_bridge_peer_connected` / `_disconnected` | Native-host pair status. |

In a bg worker, none of these fire because the setup branch is never entered.

---

## Edge Case: User Explicitly Sets `--chrome` on `claude agents`

`claude agents` itself doesn't accept a `--chrome` flag. But the dispatch-extras pipeline propagates flags like `--add-dir` and `--mcp-config`. If a user added their own `--mcp-config` pointing to a Chrome-related MCP server, the *worker* would load it. That's outside the `claudeInChromeDefaultEnabled` gate's purview — the gate only governs the built-in shim, not user-installed MCP servers. The user has full control to add MCP servers via `--mcp-config`.

---

## Validation

| Claim | Source |
|-------|--------|
| `AL8.isClaudeInChromeEnabled` returns false when `T6()` (non-interactive) is true | cli_inner_pretty.js:493310 |
| `T6()` returns `!U$.isInteractive` | cli_inner_pretty.js:2677-2679 |
| `oV8.setIsInteractive` is called once at bootstrap based on argv + isTTY | cli_inner_pretty.js:605858-605864 |
| Foreground gate combines `AL8(...) && qq()` (subscription check) | cli_inner_pretty.js:606542 |
| The MCP config blob with `hg = "claude-in-chrome"` is only built when the gate passes | cli_inner_pretty.js:493323-… |
| Attacher-caps message handler exists but does not affect chrome gate | cli_inner_pretty.js:390693-390696 |
