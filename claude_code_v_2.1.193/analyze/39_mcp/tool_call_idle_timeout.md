# Remote MCP tool-call **idle timeout** + `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`

> **Type:** NET-NEW capability · **Version:** 2.1.187 · **Module:** `39_mcp/`
> TARGET bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js` (VERSION `2.1.193`, build `a1938d2a`). Every `cli_inner_pretty.js:<line>` is a **193** line unless tagged `(183)`.

## TL;DR

v2.1.187 adds an **idle watchdog** to remote MCP tool calls: a tool call to an `http`/`sse`/`ws`/`claudeai-proxy` server is aborted if it goes **5 minutes** without **any** response or progress notification. The threshold is a new env var `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (ms; `0` disables). This is distinct from — and sits inside the same `setInterval` as — the older two watchdogs (the overall tool-timeout and the transport-dropped-mid-call detector). The env var, the resolver, and every idle string are **absent in 183** (`grep -c CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` = `0` in 183; `grep -c "sent no response or progress for"` = `0`; `grep -c "MCP tool idle timeout"` = `0`).

> **Drift fixed vs the scout dossier:** the dossier placed `resolveIdleTimeoutMs` at `:292228` and `resolveToolTimeoutMs` at `:292192`; the live 193 bundle has `_pp` (`resolveIdleTimeoutMs`) at **`:292213`** and `gAa` (`resolveToolTimeoutMs`) at **`:292208`**, and the env mapping `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT: () => Jpu` at **`:43147`** (the dossier verdict table said `:43164`). Re-verified by reading the bodies.

---

## 1. The env var: `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`

**What it does.** An int-typed env getter on the env proxy. When set, it overrides the 5-minute default idle threshold; `0` disables the idle watchdog entirely (leaving only the overall tool-timeout and transport-drop watchdogs).

**How it works.** It is registered on the env-proxy getter map (`CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT: () => Jpu`, `cli_inner_pretty.js:43147`) and lazily parsed as an integer (`Jpu = Fe.int()`, `cli_inner_pretty.js:43611`). It is read once per tool call as `Be.CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` (`:292215`).

**Why an env var (not a config field).** Idle timeout is an operational/escape-hatch knob — its job is to let a user *disable* or *raise* the new auto-abort when a legitimately-silent long-running remote tool would otherwise be killed. Env vars are the right surface for "I am hitting a new default and need to opt out for this session" — no config-file edit, no restart of the server, scriptable in CI.

---

## 2. The resolver: `resolveIdleTimeoutMs` (`_pp`)

**What it does.** Computes the effective idle timeout (ms) for a given transport, or `0` (disabled) for transports that don't get one.

```javascript
// ============================================
// resolveIdleTimeoutMs - effective idle timeout for a transport (0 = disabled)
// Location: cli_inner_pretty.js:292213-292218
// ============================================

// ORIGINAL (for source lookup):
function _pp(e) {
  if (!ypp.has(e?.type ?? "")) return 0;
  let t = Be.CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT ?? hpp;
  if (t <= 0) return 0;
  return Math.min(Math.max(t, 1000), gAa(e));
}

// READABLE (for understanding):
function resolveIdleTimeoutMs(serverConfig) {
  if (!IDLE_TIMEOUT_TRANSPORTS.has(serverConfig?.type ?? "")) return 0;   // remote-only; stdio gets no idle timeout
  let idle = env.CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT ?? DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS; // 300000 default
  if (idle <= 0) return 0;                                                // explicit 0 (or negative) disables
  return Math.min(Math.max(idle, 1000), resolveToolTimeoutMs(serverConfig)); // clamp to [1s, overall tool timeout]
}

// Mapping: _pp→resolveIdleTimeoutMs, e→serverConfig, ypp→IDLE_TIMEOUT_TRANSPORTS, hpp→DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS,
//   gAa→resolveToolTimeoutMs, Be→env
```

**How it works (the three clamps, in order).**
1. **Transport gate** — `IDLE_TIMEOUT_TRANSPORTS` (`ypp`, `cli_inner_pretty.js:293456`) `= new Set(["http","sse","ws","claudeai-proxy"])`. A `stdio` server (config `type` undefined or `"stdio"`) returns `0` immediately — local stdio tools never trip an idle timeout, because a local subprocess holding silent is a different (and benign) situation from a remote network call going dark.
2. **Default / disable** — defaults to `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS` (`hpp`, `cli_inner_pretty.js:293311`) `= 300000` (5 min). A configured `<= 0` returns `0` → disabled.
3. **Range clamp** — `Math.min(Math.max(idle, 1000), resolveToolTimeoutMs(serverConfig))`. Floor 1 s (a sub-second idle timeout would false-trip constantly); ceiling the *overall* tool timeout — there is no point waiting "idle" longer than the call is allowed to run at all.

**The overall tool timeout it clamps against — `resolveToolTimeoutMs` (`gAa`, `cli_inner_pretty.js:292208`):**

```javascript
// ============================================
// resolveToolTimeoutMs - overall per-call ceiling (MCP_TOOL_TIMEOUT / default 1e8)
// Location: cli_inner_pretty.js:292208-292212
// ============================================

// ORIGINAL (for source lookup):
function gAa(e) {
  let t = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10),
    r = (e?.timeout !== void 0 && e.timeout >= 1000 ? e.timeout : void 0) ?? (t > 0 ? t : void 0) ?? fpp;
  return Math.min(Math.max(r, 1000), mAa);
}

// READABLE (for understanding):
function resolveToolTimeoutMs(serverConfig) {
  let envTimeout = parseInt(process.env.MCP_TOOL_TIMEOUT || "", 10);
  let ms = (serverConfig?.timeout !== undefined && serverConfig.timeout >= 1000 ? serverConfig.timeout : undefined)
         ?? (envTimeout > 0 ? envTimeout : undefined)
         ?? DEFAULT_TOOL_TIMEOUT_MS;                       // fpp = 1e8 (~27.7 h) — effectively "no overall cap"
  return Math.min(Math.max(ms, 1000), MAX_TOOL_TIMEOUT_MS); // mAa = 2147483647 (Int32 max)
}

// Mapping: gAa→resolveToolTimeoutMs, fpp→DEFAULT_TOOL_TIMEOUT_MS (1e8), mAa→MAX_TOOL_TIMEOUT_MS (2147483647)
```

**Key insight — why idle ≠ overall timeout.** The overall tool timeout defaults to `1e8` ms (~27.7 hours) — i.e. effectively unbounded. *That is exactly the pre-2.1.187 behaviour*: a remote tool could block for hours. The idle watchdog adds a **second, much tighter** clock that measures *silence* rather than *total duration*: a tool can run for hours as long as it keeps streaming progress, but if it goes 5 minutes with no byte of response or progress, it is presumed dead and aborted. The clamp `min(idle, overall)` just guarantees the idle clock never out-lives the call's own ceiling.

---

## 3. The watchdog: idle branch inside `callToolWithWatchdog` (`bao`)

**What it does.** A single 30 s-tick `setInterval` runs three checks per tick while a remote tool call is in flight: (1) a transport-dropped-mid-call detector (older), (2) the **idle** detector (new in 2.1.187), and — separately, via `setTimeout` — (3) the overall tool timeout. The idle detector aborts the call when `now − lastActivity > idleTimeout`.

```javascript
// ============================================
// callToolWithWatchdog - the idle branch + progress reset (NEW 2.1.187)
// Location: cli_inner_pretty.js:293038-293074, 293098-293099
// ============================================

// ORIGINAL (for source lookup):
let _ = m ?? _pp(n), S = h, H, v = new Promise((U, F) => { H = F; });
y = setInterval(() => {
  let U = Math.floor((Date.now() - h) / 1000);
  if ((sn(t, `Tool '${o}' still running (${U}s elapsed)`), b.armedAt > 0 && Date.now() - b.armedAt > 90000)) {
    sn(t, `Tool '${o}' aborting: transport error ${Math.floor((Date.now() - b.armedAt) / 1000)}s ago, response presumed lost`);
    H(new Fi(`MCP server "${t}" transport dropped mid-call; response for tool "${o}" was lost`, "MCP transport lost mid-call"));
    return;
  }
  if (r?.pendingElicitations) S = Date.now();
  else if (r && r.lastElicitationClosedAt > S) S = r.lastElicitationClosedAt;
  if (_ > 0 && Date.now() - S > _) {
    let F = Math.floor((Date.now() - S) / 1000);
    sn(t, `Tool '${o}' aborting: no response or progress notification for ${F}s (idle timeout ${Math.floor(_ / 1000)}s)`);
    H(new Fi(`MCP server "${t}" tool "${o}" sent no response or progress for ${F}s; aborting. Set CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT (ms) higher or to 0 if this tool is expected to run silently for longer.`, "MCP tool idle timeout"));
  }
}, 30000);
// ... in the callTool onprogress handler:
onprogress: (U) => { if (((b.armedAt = 0), (S = Date.now()), l)) l({ /* mcp_progress event */ }); }

// READABLE (for understanding):
let idleTimeoutMs = explicitIdleMs ?? resolveIdleTimeoutMs(serverConfig);  // m ?? _pp(n)
let lastActivity = startTime;                                              // S — reset by every progress notification
let rejectRace; let racePromise = new Promise((_, reject) => { rejectRace = reject; });
watchdog = setInterval(() => {
  let elapsedS = Math.floor((Date.now() - startTime) / 1000);
  sn(serverName, `Tool '${tool}' still running (${elapsedS}s elapsed)`);
  // (1) transport-dropped-mid-call (older): a fired transport error 'armed' the watchdog; 90s later, give up.
  if (callState.armedAt > 0 && Date.now() - callState.armedAt > 90000) {
    sn(serverName, `Tool '${tool}' aborting: transport error ${Math.floor((Date.now() - callState.armedAt) / 1000)}s ago, response presumed lost`);
    rejectRace(new McpToolError(`MCP server "${serverName}" transport dropped mid-call; response for tool "${tool}" was lost`, "MCP transport lost mid-call"));
    return;
  }
  // an open elicitation (server asking the user something) counts as "activity" — don't idle-abort while waiting on the human
  if (transportState?.pendingElicitations) lastActivity = Date.now();
  else if (transportState && transportState.lastElicitationClosedAt > lastActivity) lastActivity = transportState.lastElicitationClosedAt;
  // (2) IDLE detector (NEW 2.1.187): no response/progress for idleTimeoutMs → abort
  if (idleTimeoutMs > 0 && Date.now() - lastActivity > idleTimeoutMs) {
    let silentS = Math.floor((Date.now() - lastActivity) / 1000);
    sn(serverName, `Tool '${tool}' aborting: no response or progress notification for ${silentS}s (idle timeout ${Math.floor(idleTimeoutMs / 1000)}s)`);
    rejectRace(new McpToolError(
      `MCP server "${serverName}" tool "${tool}" sent no response or progress for ${silentS}s; aborting. Set CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT (ms) higher or to 0 if this tool is expected to run silently for longer.`,
      "MCP tool idle timeout"));
  }
}, 30000);
// every progress notification RESETS the idle clock:
onprogress: (note) => { callState.armedAt = 0; lastActivity = Date.now(); if (onProgress) onProgress({ /* mcp_progress */ }); }

// Mapping: bao→callToolWithWatchdog, _→idleTimeoutMs, m→explicitIdleMs, _pp→resolveIdleTimeoutMs, S→lastActivity,
//   h→startTime, b→callState, b.armedAt→transport-error arm timestamp, Fi→McpToolError, H→rejectRace, y→watchdog
```

**How it works (step-by-step).**
1. `idleTimeoutMs = explicitIdleMs ?? resolveIdleTimeoutMs(serverConfig)` (`:293038`) — the per-call value, normally from `_pp`.
2. The 30 s tick first logs progress, then runs the three checks. Order matters: the **transport-drop** check (`armedAt > 0 && now - armedAt > 90000`) is *before* the idle check, so a known-dropped transport aborts on its own (faster, separate) 90 s clock rather than waiting out the full idle window.
3. **Elicitation guard** — if the server has an *open elicitation* (it asked the user a question and is waiting for the answer), `lastActivity` is bumped to now. This prevents idle-aborting a call that is legitimately blocked on **human** input. This is a key correctness detail: "idle" means *the server* went silent, not *we* are waiting on a person.
4. **Idle check** — `idleTimeoutMs > 0 && now - lastActivity > idleTimeoutMs` rejects the race promise with `McpToolError(... , "MCP tool idle timeout")`. The message names the silent duration, the configured idle window, **and** how to opt out (raise/disable `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT`).
5. **Progress resets the clock** — the `callTool` `onprogress` handler (`:293098`) sets `callState.armedAt = 0` (un-arms any transport-drop suspicion) **and** `lastActivity = Date.now()`. So a server that streams *any* progress notification within each 5 min window never trips the idle timeout, no matter how long the overall call runs.

**Why fold idle into the existing `setInterval` (not a new timer).** The watchdog already ticked every 30 s to log "still running" and to run the transport-drop check. Adding the idle comparison to the same tick costs one `if`, shares the same `lastActivity`/`armedAt` state the progress handler already maintains, and reuses the same race-promise rejection path (`rejectRace`) that the transport-drop and overall-timeout branches use. A separate `setTimeout(idleTimeoutMs)` would need its own reset-on-progress bookkeeping and a second teardown in the `finally`. One tick, one state, one reject — minimal surface.

**The three watchdogs side by side.**

| Watchdog | Clock measures | Default | Fires `McpToolError(label)` | New in 187? |
|---|---|---|---|---|
| Transport-drop | time since a transport error "armed" the call | 90 s after arm | `"MCP transport lost mid-call"` | no (older carryover) |
| **Idle** | time since last response/progress | **300 000 ms** | `"MCP tool idle timeout"` | **YES** |
| Overall tool timeout | total call duration | `1e8` ms (`MCP_TOOL_TIMEOUT`) | `"MCP tool timeout"` | no (`gAa`/`setTimeout` carryover) |

---

## 4. Upgrade gotcha (behaviour change)

**Before (≤2.1.186):** a remote MCP tool call with no overall `MCP_TOOL_TIMEOUT` set could block for up to the `1e8` ms (~27.7 h) default — i.e. effectively forever — while the server stayed silent. There was **no** silence-based abort.

**After (≥2.1.187):** the same call **aborts after 5 minutes of silence by default**. A legitimately-silent long-running remote tool (one that does real work but emits no progress notifications) will now start failing with the `"MCP tool idle timeout"` error unless the user either:
- sets `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0` (disable the idle watchdog), or
- sets a higher ms value, or
- makes the server emit periodic progress notifications (each one resets the clock).

**stdio servers are unaffected** — `resolveIdleTimeoutMs` returns `0` for them (transport gate). The abort message is deliberately self-documenting precisely so a user who hits this upgrade surprise sees the fix inline.

---

## Evidence — NET-NEW (183 grep-diff)

| String / symbol | 193 | 183 | verdict |
|---|---|---|---|
| `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` | 3 (`:43147`,`:292215`,`:293069`) | 0 | NET-NEW |
| `sent no response or progress for` | 1 (`:293069`) | 0 | NET-NEW |
| `MCP tool idle timeout` (error label) | 1 (`:293070`) | 0 | NET-NEW |
| `Set CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT (ms) higher` | 1 | 0 | NET-NEW |

The surrounding watchdog *scaffold* is older carryover: `activeCallWatchdogs` (193:5 / 183:5), the `transport dropped mid-call` abort (193:1 / 183:1), and the overall-timeout `setTimeout` all predate 187. The **idle layer** (`_pp`/`hpp`/`ypp`/the env var/the idle abort branch/the progress-reset) is the 2.1.187 addition. `armedAt` grew 183:5 → 193:7 (the +2 are the idle-reset uses).

---

## Cross-links

- Sibling 193 docs: [`headers_helper_reauth.md`](./headers_helper_reauth.md) (the **same** `callToolWithWatchdog` `catch` block hosts the new 401/403 re-auth branch — read together to see the full tool-call wrapper), [`reliability_retries.md`](./reliability_retries.md), [`README.md`](./README.md).
- Module index: [`README.md`](./README.md).

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format**, never a mapping table):
> - [../00_overview/symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Core execution
> - [../00_overview/symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features
> - [../00_overview/symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) — Platform infra (**MCP** home module)
> - [../00_overview/symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) — Integrations
> - [../00_overview/symbol_additions_v2_1_193_mcp.md](../00_overview/symbol_additions_v2_1_193_mcp.md) — the granular v2.1.193 MCP additions

Key functions/constants in this document:

- `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` env (`Jpu`, def `cli_inner_pretty.js:43611` `Fe.int()`; map `:43147`) — the idle-timeout knob (`0` disables).
- `resolveIdleTimeoutMs` (`_pp`, `cli_inner_pretty.js:292213`) — transport-gated, clamped idle timeout.
- `DEFAULT_MCP_TOOL_IDLE_TIMEOUT_MS` (`hpp`, `cli_inner_pretty.js:293311`) — `300000` (5 min).
- `IDLE_TIMEOUT_TRANSPORTS` (`ypp`, `cli_inner_pretty.js:293456`) — `Set(["http","sse","ws","claudeai-proxy"])`; remote-only.
- `resolveToolTimeoutMs` (`gAa`, `cli_inner_pretty.js:292208`) — overall per-call ceiling; `DEFAULT_TOOL_TIMEOUT_MS` (`fpp`=`1e8`, `:293307`), `MAX_TOOL_TIMEOUT_MS` (`mAa`=`2147483647`, `:293308`).
- `callToolWithWatchdog` (`bao`, `cli_inner_pretty.js:293017`) — the tool-call wrapper; idle branch `:293061`, progress reset `:293098`.
- `McpToolError` (`Fi`) — error class for the `"MCP tool idle timeout"` / `"MCP transport lost mid-call"` / `"MCP tool timeout"` labels.
