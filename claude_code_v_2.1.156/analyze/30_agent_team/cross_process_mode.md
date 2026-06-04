# Cross-Process Mode — Pane Backends (tmux & iTerm2) (v2.1.156)

## TL;DR

The agent-team subsystem (internally "swarm") has **two execution modes**. This document covers the **cross-process** one: a teammate that runs as a **brand-new, separate `claude` OS process** living inside a **tmux pane** or an **iTerm2 split**, driven by the leader REPL.

The mechanism is deliberately low-tech and clever: the leader does **not** `fork`/`exec` a child with inherited file descriptors. Instead it (1) asks a `PaneBackend` to create an empty pane, (2) assembles a **full interactive shell command string** of the form `cd <cwd> && env <env> <execPath> <flags>`, and (3) **types that string into the pane** (tmux `send-keys … Enter`, or iTerm2 `it2 session run`). The pane's shell executes it, a new `claude` boots, sees `--agent-id/--agent-name/--team-name` flags, and **re-enters teammate mode**. From that point the leader and the teammate communicate **only** through the **file mailbox** — there is no shared `AppState`, no shared memory, no pipe. The pane teammate is a fully autonomous process that happens to be visually parented next to the leader.

The single adapter that makes both `TmuxBackend` and `ITermBackend` look like a uniform `TeammateExecutor` (the same interface `InProcessBackend` implements) is `PaneBackendExecutor` (obfuscated: `L94`). This is the heart of the doc.

> Contrast with in-process mode (see `in_process_mode.md`): there the teammate is an async task in the *same* Node process, isolated by `AsyncLocalStorage`, sharing `AppState`. Contrast with the daemon/background-agent fleet (see `36_background_agents/`): that is a different worker model (daemon-supervised children) and is out of scope here.

---

## Related Symbols

> Symbol mappings live in the central index files (this doc uses **list format only**):
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Agent Team is here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/classes in this document:

- `PaneBackendExecutor` (obfuscated: `L94`) — adapter wrapping a `PaneBackend` into the `TeammateExecutor` interface; owns `spawnedTeammates` map + cleanup (`cli_inner_pretty.js:380388-380497`).
- `createPaneBackendExecutor` (obfuscated: `P94`) — factory `new L94(backend)` (`cli_inner_pretty.js:380498-380500`).
- `resolveTeammateExecPath` (obfuscated: `J94`) — pick the `claude` executable to relaunch (`cli_inner_pretty.js:380305-380308`).
- `buildTeammateCliFlags` (obfuscated: `X94`) — assemble inherited CLI flags (`cli_inner_pretty.js:380309-380335`).
- `buildTeammateEnvString` (obfuscated: `WT$`) — assemble the `env KEY=VALUE …` string (`cli_inner_pretty.js:380336-380345`).
- `TEAMMATE_ENV_PASSTHROUGH` (obfuscated: `PT_`) — env-var forward list (`cli_inner_pretty.js:380350-380386`).
- `TmuxBackend` (obfuscated: `ZU6`) — tmux `PaneBackend` (`cli_inner_pretty.js:380545-380784`).
- `acquirePaneCreationLock` (obfuscated: `ZT_`) — serialization lock for parallel spawns (`cli_inner_pretty.js:380517-380523`).
- `getTmuxColorName` (obfuscated: `T94`) — agent-color → tmux color map (`cli_inner_pretty.js:380525-380536`).
- `runTmuxInSwarmSocket` (obfuscated: `kS`) — `tmux -S <socket> …` (`cli_inner_pretty.js:380537-380541`).
- `runTmuxInSwarmLabel` (obfuscated: `BE`) — `tmux -L <label> …` (`cli_inner_pretty.js:380542-380544`).
- `ITermBackend` (obfuscated: `TU6`) — iTerm2 `PaneBackend` via `it2` CLI (`cli_inner_pretty.js:380820-380900`).
- `runIt2` (obfuscated: `mW8`) — exec the `it2` CLI (`cli_inner_pretty.js:380805-380807`).
- `parseIt2SplitOutput` (obfuscated: `TT_`) — parse session id from split output (`cli_inner_pretty.js:380808-380812`).
- `getLeaderIt2SessionId` (obfuscated: `VT_`) — leader session id from `ITERM_SESSION_ID` (`cli_inner_pretty.js:380813-380819`).
- `registerITermBackend` (obfuscated: `VU6`) — register the iTerm2 class with the registry (`cli_inner_pretty.js:380953-380955`).
- `registerTmuxBackend` (obfuscated: `GU6`) — register the tmux class (`cli_inner_pretty.js:380950-380952`).
- it2 setup: `detectPythonPkgMgr` (`A94`), `isIt2Installed` (`XT_`), `installIt2` (`Y94`), `verifyIt2Setup` (`f94`), `pythonApiInstructions` (`O94`), `markIt2SetupComplete` (`M94`), `setPreferTmuxOverIterm2` (`j94`), `getPreferTmuxOverIterm2` (`w94`) (`cli_inner_pretty.js:380183-380263`).

Shared helpers referenced (defined elsewhere, cited inline):
- `formatAgentId` (`Ei`, `cli_inner_pretty.js:98997`) — `name@team`.
- `parseAgentId` (`TY$`) — inverse of `formatAgentId`.
- `writeToMailbox` (`aA`, `cli_inner_pretty.js:338306`) — the universal IPC.
- `shellQuote` (`O4`, `cli_inner_pretty.js:176255`) — POSIX single-quote escaping.
- `isInsideTmux` async (`Ga`) and `registerCleanup` (`$7`).

---

## 1. The big picture: how a child `claude` is born in a pane

```
LEADER (claude REPL, process A)
  │  TeamCreate / spawn teammate "alice"
  ▼
PaneBackendExecutor.spawn(config)              L94.spawn   @380403
  │
  ├─1─ agentId = formatAgentId("alice","myteam")          Ei @98997  → "alice@myteam"
  ├─2─ color   = ctx.teammateColors.assign(agentId)
  ├─3─ {paneId, isFirstTeammate} =
  │        backend.createTeammatePaneInSwarmView(name,color)   ← creates an EMPTY pane
  │           tmux:   split-window/new-window -P -F "#{pane_id}"   @380696/380710
  │           iterm:  it2 session split -v -s <leaderSession>      @380845
  ├─4─ if first && insideTmux: backend.enablePaneBorderStatus()   @380416
  ├─5─ execPath = resolveTeammateExecPath()                J94 @380305
  ├─6─ identityFlags = "--agent-id … --agent-name … --team-name … --agent-color … --parent-session-id …"
  ├─7─ inheritedFlags = buildTeammateCliFlags(...)         X94 @380309
  ├─8─ envStr = buildTeammateEnvString()                   WT$ @380336
  ├─9─ command = `cd <cwd> && env <envStr> <execPath> <identityFlags> <inheritedFlags>`  @380433
  ├10─ backend.sendCommandToPane(paneId, command, !insideTmux)     @380436
  │        tmux:   send-keys -t <pane> "<command>" Enter           @380567   ← TYPES it
  │        iterm:  it2 session run -s <pane> "<command>"           @380878
  │                                            │
  │                                            ▼
  │                              PANE SHELL executes the command
  │                                            │
  │                                            ▼
  │                              NEW `claude` process B boots,
  │                              sees --agent-id → re-enters TEAMMATE MODE
  ├11─ spawnedTeammates.set(agentId,{paneId,insideTmux})           @380437
  ├12─ registerCleanup(kill all panes on leader exit)              @380441
  └13─ writeToMailbox("alice",{from:"team-lead",text:prompt,…})    @380448  ← initial task
                                               │
   LEADER ◄───── file mailbox (read/write JSON lines) ─────► TEAMMATE B
        (writeToMailbox aA @338306 is the ONLY channel; no AppState sharing)
```

The crucial architectural fact: steps 3 and 10 are **separate**. Pane creation produces an *empty shell prompt*; the `claude` process is only born when the command string is *typed in and Enter is pressed* at step 10. This two-phase design is what lets the same code path drive two wildly different terminals (tmux uses `send-keys`, iTerm2 uses `it2 session run`) — both just need a way to "type a line into a pane's shell".

---

## 2. PaneBackendExecutor — the TeammateExecutor adapter

### 2.1 Class shape & why it exists

**What it does:** `PaneBackendExecutor` (obfuscated: `L94`) wraps an arbitrary `PaneBackend` (`TmuxBackend` or `ITermBackend`) and presents it as a `TeammateExecutor` — the *same* interface that `InProcessBackend` (`K94`) implements. This is the adapter that makes `getTeammateExecutor()` (`NT_` @381098, see `execution_modes_and_backend_registry.md`) return a uniform object regardless of whether the teammate runs in-process or in a pane.

**How it works (state):** The constructor stores three things (`cli_inner_pretty.js:380388-380396`):
- `backend` — the concrete `PaneBackend`; `this.type` is copied from `backend.type` (so the executor's `type` is `"tmux"` or `"iterm2"`).
- `spawnedTeammates` — a `Map<agentId, {paneId, insideTmux}>`. This is the executor's entire runtime memory: it maps each `name@team` to the pane it lives in and whether that pane is inside the user's tmux or an external swarm socket. Every later operation (`kill`, `isActive`, cleanup) keys off this map.
- `cleanupRegistered` — a one-shot guard so the on-exit pane-killer is only registered once, on the first successful spawn.

```javascript
// ============================================
// PaneBackendExecutor - adapts a PaneBackend (tmux/iterm2) to the TeammateExecutor interface
// Location: cli_inner_pretty.js:380388-380402
// ============================================

// ORIGINAL (for source lookup):
class L94 {
  type;
  backend;
  context = null;
  spawnedTeammates;
  cleanupRegistered = !1;
  constructor(H) {
    ((this.backend = H), (this.type = H.type), (this.spawnedTeammates = new Map()));
  }
  setContext(H) {
    this.context = H;
  }
  async isAvailable() {
    return this.backend.isAvailable();
  }

// READABLE (for understanding):
class PaneBackendExecutor {                       // implements TeammateExecutor
  type;                                           // copied from backend.type: "tmux" | "iterm2"
  backend;                                        // the concrete PaneBackend
  context = null;                                 // ToolUseContext; must be set before spawn()
  spawnedTeammates;                               // Map<agentId, {paneId, insideTmux}>
  cleanupRegistered = false;                      // one-shot guard for on-exit pane killer
  constructor(backend) {
    this.backend = backend;
    this.type = backend.type;
    this.spawnedTeammates = new Map();
  }
  setContext(toolUseContext) {
    this.context = toolUseContext;                // gives access to AppState + teammateColors
  }
  async isAvailable() {
    return this.backend.isAvailable();            // delegate availability to the backend
  }

// Mapping: L94→PaneBackendExecutor, H→backend/toolUseContext, this.type→backend.type copy
```

**Why this approach (adapter pattern):** Without this adapter, every call site that wants to spawn a teammate would need a branch: "if pane backend, do pane things; else do in-process things". By forcing both backends behind one interface (`spawn/sendMessage/terminate/kill/isActive/isAvailable/setContext`), the dispatch logic in the registry collapses to a single line `getInProcessBackend()` *or* `getPaneBackendExecutor()`, and all team tools (`TeamCreate`, `SendMessage`, `TeamDelete`) call the executor blindly. The alternative — a union type with `switch` everywhere — would scatter mode knowledge across the codebase and make adding a third backend (e.g. a hypothetical `kitty` or `wezterm` backend) painful.

**Key insight:** `PaneBackendExecutor` itself contains **zero terminal-specific code**. It knows about *agent identity*, *CLI/env construction*, *the mailbox*, and *cleanup*. All terminal-specific behaviour (how to create a pane, how to type a command, how to kill a pane) is delegated to the wrapped `PaneBackend`. The factory is trivially `P94(H){return new L94(H)}` (`cli_inner_pretty.js:380498-380500`).

### 2.2 The cross-process spawn — `L94.spawn` (THE heart)

**What it does:** Creates a pane, builds the full relaunch command, types it into the pane (booting a new `claude`), registers cleanup, and drops the initial task into the mailbox. Returns `{success, agentId, paneId}`.

**How it works (step-by-step):**

1. `agentId = Ei(name, teamName)` — format `name@team` (`cli_inner_pretty.js:380404`).
2. Guard: if `this.context` is null, fail early with `swarm_pane_spawn`/`no_context` telemetry and a descriptive error (`cli_inner_pretty.js:380405-380410`). Context is required because spawning needs `AppState` (permission mode) and the color allocator.
3. A `phase` variable (`q`) is initialized to `"pane_create"` and later flipped to `"send_command"` (`cli_inner_pretty.js:380411`, `380435`). This is purely so the `catch` block can attribute a failure to *pane creation* vs *command sending* in telemetry (`pane_create_failed` vs `send_command_failed`, `cli_inner_pretty.js:380457`).
4. Assign color: `config.color ?? context.teammateColors.assign(agentId)` (`cli_inner_pretty.js:380413`).
5. `{paneId, isFirstTeammate} = await backend.createTeammatePaneInSwarmView(name, color)` — create the empty pane (`cli_inner_pretty.js:380414`).
6. `insideTmux = await Ga()` — re-check tmux membership (async) (`cli_inner_pretty.js:380415`). Note this is checked *again* here rather than read from the backend, because the same `TmuxBackend` instance can spawn either inside the user's tmux or into an external swarm session; the `insideTmux` boolean decides which socket to talk to for *all later commands*.
7. If `isFirstTeammate && insideTmux` → `backend.enablePaneBorderStatus()` to show pane titles (`cli_inner_pretty.js:380416`).
8. Resolve the `claude` executable: `J94()` (`cli_inner_pretty.js:380417`).
9. Build the **identity flags** string (`cli_inner_pretty.js:380418-380427`): `--agent-id`, `--agent-name`, `--team-name`, `--agent-color`, `--parent-session-id` (falling back to `E$()` = current session id), and conditionally `--plan-mode-required`. Each value is shell-quoted via `O4([…])`. The `.filter(Boolean)` drops the empty `--plan-mode-required` slot when not required.
10. Build **inherited flags**: `X94({planModeRequired, permissionMode: T6(context).mode, skipModel: !!model})` (`cli_inner_pretty.js:380428`). `T6(context).mode` reads the leader's current permission mode from `AppState`.
11. If `config.model` is set, append/override `--model` after the inherited flags (`cli_inner_pretty.js:380429`).
12. Build the **env string** via `WT$()` (`cli_inner_pretty.js:380432`).
13. **Assemble the command** (`cli_inner_pretty.js:380433`):
    `` `cd ${O4([cwd])} && env ${env} ${O4([execPath])} ${identityFlags}${inheritedFlags}` ``.
14. `await backend.sendCommandToPane(paneId, command, !insideTmux)` — **types the command into the pane** (`cli_inner_pretty.js:380436`). The third arg `!insideTmux` means "use the external swarm socket if we are *not* inside the user's tmux".
15. Record `spawnedTeammates.set(agentId, {paneId, insideTmux})` (`cli_inner_pretty.js:380437`).
16. On first spawn, register an on-exit cleanup that kills every tracked pane (`cli_inner_pretty.js:380438-380446`).
17. **Write the initial prompt to the mailbox** (`cli_inner_pretty.js:380448`): `aA(name, {from:"team-lead", text:prompt, timestamp}, teamName)`. This is how the freshly-booted teammate receives its first task — its poll loop reads the mailbox and picks it up.
18. Emit `swarm_pane_spawn` success telemetry and return `{success:true, agentId, paneId}` (`cli_inner_pretty.js:380450-380451`).

```javascript
// ============================================
// PaneBackendExecutor.spawn - create a pane, type the relaunch command, seed mailbox
// Location: cli_inner_pretty.js:380403-380461
// ============================================

// ORIGINAL (for source lookup):
async spawn(H) {
  let $ = Ei(H.name, H.teamName);
  if (!this.context)
    return (N(`[PaneBackendExecutor] spawn() called without context for ${H.name}`),
      uH("swarm_pane_spawn", "no_context"),
      { success: !1, agentId: $, error: "PaneBackendExecutor not initialized. Call setContext() before spawn()." });
  let q = "pane_create";
  try {
    let K = H.color ?? this.context.teammateColors.assign($),
      { paneId: _, isFirstTeammate: z } = await this.backend.createTeammatePaneInSwarmView(H.name, K),
      A = await Ga();
    if (z && A) await this.backend.enablePaneBorderStatus();
    let Y = J94(),
      f = [`--agent-id ${O4([$])}`, `--agent-name ${O4([H.name])}`, `--team-name ${O4([H.teamName])}`,
        `--agent-color ${O4([K])}`, `--parent-session-id ${O4([H.parentSessionId || E$()])}`,
        H.planModeRequired ? "--plan-mode-required" : ""].filter(Boolean).join(" "),
      O = X94({ planModeRequired: H.planModeRequired, permissionMode: T6(this.context).mode, skipModel: !!H.model });
    if (H.model) O = O ? `${O} --model ${O4([H.model])}` : `--model ${O4([H.model])}`;
    let M = O ? ` ${O}` : "", j = H.cwd, w = WT$(),
      D = `cd ${O4([j])} && env ${w} ${O4([Y])} ${f}${M}`;
    if (((q = "send_command"), await this.backend.sendCommandToPane(_, D, !A),
      this.spawnedTeammates.set($, { paneId: _, insideTmux: A }), !this.cleanupRegistered))
      ((this.cleanupRegistered = !0),
        $7(async () => {
          for (let [J, X] of this.spawnedTeammates)
            (N(`[PaneBackendExecutor] Cleanup: killing pane for ${J}`),
              await this.backend.killPane(X.paneId, !X.insideTmux));
          this.spawnedTeammates.clear();
        }));
    return (await aA(H.name, { from: "team-lead", text: H.prompt, timestamp: new Date().toISOString() }, H.teamName),
      N(`[PaneBackendExecutor] Spawned teammate ${$} in pane ${_}`),
      SH("swarm_pane_spawn"), { success: !0, agentId: $, paneId: _ });
  } catch (K) {
    let _ = K instanceof Error ? K.message : String(K);
    return (N(`[PaneBackendExecutor] Failed to spawn ${$}: ${_}`),
      uH("swarm_pane_spawn", q === "pane_create" ? "pane_create_failed" : "send_command_failed"),
      { success: !1, agentId: $, error: _ });
  }
}

// READABLE (for understanding):
async spawn(config) {
  const agentId = formatAgentId(config.name, config.teamName);     // "alice@myteam"
  if (!this.context)
    return (logDebug(`spawn() without context for ${config.name}`),
      logTelemetryError("swarm_pane_spawn", "no_context"),
      { success: false, agentId, error: "PaneBackendExecutor not initialized. Call setContext() before spawn()." });

  let phase = "pane_create";                                       // attribution for catch-block telemetry
  try {
    const color = config.color ?? this.context.teammateColors.assign(agentId);
    // PHASE 1 — create an EMPTY pane (no claude yet):
    const { paneId, isFirstTeammate } = await this.backend.createTeammatePaneInSwarmView(config.name, color);
    const insideTmux = await isInsideTmuxAsync();                  // decides socket for later commands
    if (isFirstTeammate && insideTmux) await this.backend.enablePaneBorderStatus();

    const execPath = resolveTeammateExecPath();
    const identityFlags = [
      `--agent-id ${shellQuote([agentId])}`,
      `--agent-name ${shellQuote([config.name])}`,
      `--team-name ${shellQuote([config.teamName])}`,
      `--agent-color ${shellQuote([color])}`,
      `--parent-session-id ${shellQuote([config.parentSessionId || getSessionId()])}`,
      config.planModeRequired ? "--plan-mode-required" : "",
    ].filter(Boolean).join(" ");

    let inheritedFlags = buildTeammateCliFlags({
      planModeRequired: config.planModeRequired,
      permissionMode: getAppState(this.context).mode,             // leader's permission mode
      skipModel: !!config.model,
    });
    if (config.model)                                             // explicit per-teammate model wins
      inheritedFlags = inheritedFlags ? `${inheritedFlags} --model ${shellQuote([config.model])}`
                                      : `--model ${shellQuote([config.model])}`;
    const flagsSuffix = inheritedFlags ? ` ${inheritedFlags}` : "";
    const cwd = config.cwd;
    const envStr = buildTeammateEnvString();

    // THE relaunch command — a full interactive shell line:
    const command = `cd ${shellQuote([cwd])} && env ${envStr} ${shellQuote([execPath])} ${identityFlags}${flagsSuffix}`;

    // PHASE 2 — TYPE the command into the pane → boots a NEW claude process:
    phase = "send_command";
    await this.backend.sendCommandToPane(paneId, command, !insideTmux);  // !insideTmux ⇒ external swarm socket
    this.spawnedTeammates.set(agentId, { paneId, insideTmux });

    if (!this.cleanupRegistered) {                               // register pane killer ONCE
      this.cleanupRegistered = true;
      registerCleanup(async () => {
        for (const [id, info] of this.spawnedTeammates) {
          logDebug(`Cleanup: killing pane for ${id}`);
          await this.backend.killPane(info.paneId, !info.insideTmux);
        }
        this.spawnedTeammates.clear();
      });
    }

    // Seed the teammate's first task via the file mailbox (its poll loop reads it):
    await writeToMailbox(config.name, { from: "team-lead", text: config.prompt, timestamp: new Date().toISOString() }, config.teamName);
    logDebug(`Spawned teammate ${agentId} in pane ${paneId}`);
    logTelemetry("swarm_pane_spawn");
    return { success: true, agentId, paneId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logDebug(`Failed to spawn ${agentId}: ${message}`);
    logTelemetryError("swarm_pane_spawn", phase === "pane_create" ? "pane_create_failed" : "send_command_failed");
    return { success: false, agentId, error: message };
  }
}

// Mapping: Ei→formatAgentId, O4→shellQuote, Ga→isInsideTmuxAsync, J94→resolveTeammateExecPath,
//          X94→buildTeammateCliFlags, WT$→buildTeammateEnvString, T6→getAppState, E$→getSessionId,
//          $7→registerCleanup, aA→writeToMailbox, SH→logTelemetry, uH→logTelemetryError, N→logDebug,
//          H→config, $→agentId, _→paneId, z→isFirstTeammate, A→insideTmux, q→phase, D→command
```

**Why this approach (typing a command vs `child_process.spawn`):** Claude Code already runs the leader as an *interactive* TUI inside *some* terminal multiplexer. Re-using that multiplexer to host the child gives three things for free that `child_process.spawn` cannot: (1) a **visible** terminal pane the human can scroll, read, and even type into; (2) a **real TTY** (the child is a full interactive `claude`, not a headless subprocess), so the child's own TUI renders correctly; (3) **independent lifetime** — the child survives even if the leader's event loop is busy, and it has its own stdin/stdout. The cost is that the leader cannot share an `AppState` object or a pipe with the child; hence the **file mailbox** is the only IPC. The design accepts that cost deliberately: the mailbox is *also* what in-process teammates use, so the higher-level tool code is mode-agnostic.

**Key insight:** The boolean `insideTmux` is captured *per spawn* and stored alongside the paneId, and it is **negated** (`!insideTmux`) when passed to `sendCommandToPane` / `killPane`. The negated value is the `useExternalSession` flag: when the leader is *not* inside tmux, teammate panes live in a standalone "swarm" tmux session reached over a dedicated socket, so all commands targeting those panes must use that socket. Storing the boolean per-teammate (rather than per-executor) is what allows correct routing even though one `TmuxBackend` instance can be used in both situations across a session.

### 2.3 sendMessage / terminate / kill / isActive

These four methods complete the `TeammateExecutor` interface. Crucially, **`sendMessage` and `terminate` are byte-for-byte the same as their in-process counterparts** — they only touch the mailbox, never the pane. Only `kill` and `isActive` touch the pane.

- **`sendMessage(agentId, message)`** (`cli_inner_pretty.js:380462-380469`): parse `agentId` via `TY$`, then `aA(agentName, {text, from, color, timestamp}, teamName)` — a plain mailbox write. Identical mechanism to in-process delivery. This is *the* reason a leader does not care which mode a teammate is in when it wants to talk to it.
- **`terminate(agentId, reason)`** (`cli_inner_pretty.js:380470-380481`): builds a `{type:"shutdown_request", requestId:"shutdown-<id>-<ts>", from:"team-lead", reason}` object, serializes it with `IH` (jsonStringify), and writes it to the mailbox. **Graceful** shutdown — the teammate's poll loop sees the shutdown request and exits its own process cleanly. The pane is *not* force-closed here.
- **`kill(agentId)`** (`cli_inner_pretty.js:380482-380491`): the **force** path. Look up `{paneId, insideTmux}` in `spawnedTeammates`; if absent return `false`. Otherwise `backend.killPane(paneId, !insideTmux)`; on success delete from the map. Killing the pane SIGHUPs the child `claude` process.
- **`isActive(agentId)`** (`cli_inner_pretty.js:380492-380496`): best-effort — returns `true` iff the agentId is present in `spawnedTeammates`. The source comment in the v2.1.88 ground truth notes this is deliberately a record-existence check, not a live pane query (a more robust check would need a new `PaneBackend` method).

```javascript
// ============================================
// PaneBackendExecutor.terminate / kill - graceful (mailbox) vs forceful (kill pane)
// Location: cli_inner_pretty.js:380470-380491
// ============================================

// ORIGINAL (for source lookup):
async terminate(H, $) {
  let q = TY$(H);
  if (!q) return (N("[PaneBackendExecutor] terminate() failed: invalid agentId format"), !1);
  let { agentName: K, teamName: _ } = q,
    z = { type: "shutdown_request", requestId: `shutdown-${H}-${Date.now()}`, from: "team-lead", reason: $ };
  return (await aA(K, { from: "team-lead", text: IH(z), timestamp: new Date().toISOString() }, _),
    N(`[PaneBackendExecutor] terminate() sent shutdown request to ${H}`), !0);
}
async kill(H) {
  let $ = this.spawnedTeammates.get(H);
  if (!$) return (N(`[PaneBackendExecutor] kill() failed: teammate ${H} not found in spawned map`), !1);
  let { paneId: q, insideTmux: K } = $, _ = await this.backend.killPane(q, !K);
  if (_) (this.spawnedTeammates.delete(H), N(`[PaneBackendExecutor] kill() succeeded for ${H}`));
  else N(`[PaneBackendExecutor] kill() failed for ${H}`);
  return _;
}

// READABLE (for understanding):
async terminate(agentId, reason) {                              // GRACEFUL — never touches the pane
  const parsed = parseAgentId(agentId);
  if (!parsed) return (logDebug("terminate() failed: invalid agentId format"), false);
  const { agentName, teamName } = parsed;
  const shutdownRequest = { type: "shutdown_request", requestId: `shutdown-${agentId}-${Date.now()}`, from: "team-lead", reason };
  await writeToMailbox(agentName, { from: "team-lead", text: jsonStringify(shutdownRequest), timestamp: new Date().toISOString() }, teamName);
  return (logDebug(`terminate() sent shutdown request to ${agentId}`), true);
}
async kill(agentId) {                                           // FORCEFUL — kills the OS-level pane
  const info = this.spawnedTeammates.get(agentId);
  if (!info) return (logDebug(`kill() failed: ${agentId} not in spawned map`), false);
  const { paneId, insideTmux } = info;
  const killed = await this.backend.killPane(paneId, !insideTmux);   // !insideTmux ⇒ external swarm socket
  if (killed) (this.spawnedTeammates.delete(agentId), logDebug(`kill() succeeded for ${agentId}`));
  else logDebug(`kill() failed for ${agentId}`);
  return killed;
}

// Mapping: TY$→parseAgentId, IH→jsonStringify, aA→writeToMailbox, $→info/parsed, q→paneId, K→insideTmux, _→killed
```

**Why two shutdown paths:** `terminate` is the polite request ("please finish and exit"); the teammate process gets to flush state, emit final telemetry, and quit on its own. `kill` is the SIGHUP-via-pane-close hammer used when the teammate is unresponsive or the leader is tearing the team down. Splitting them mirrors the POSIX `SIGTERM` vs `SIGKILL` philosophy and lets `TeamDelete` choose graceful-first, force-if-needed.

---

## 3. CLI & env builders — reconstructing the parent's runtime

The relaunched `claude` is a fresh process: it does **not** inherit the leader's open files, env (reliably), or in-memory config. Three builders reconstruct just enough of the parent's runtime so the child behaves identically.

### 3.1 resolveTeammateExecPath (`J94`)

**What it does:** Decides *which `claude` binary* to relaunch (`cli_inner_pretty.js:380305-380308`).

```javascript
// ============================================
// resolveTeammateExecPath - which claude executable to relaunch in the pane
// Location: cli_inner_pretty.js:380305-380308
// ============================================

// ORIGINAL (for source lookup):
function J94() {
  if (process.env[WsH]) return process.env[WsH];
  return UY() ? process.execPath : process.argv[1];
}

// READABLE (for understanding):
function resolveTeammateExecPath() {
  if (process.env[TEAMMATE_COMMAND_ENV_VAR])      // explicit override (e.g. a wrapper script)
    return process.env[TEAMMATE_COMMAND_ENV_VAR];
  return isInBundledMode()                         // bundled single-file build?
    ? process.execPath                             //   → the node executable that IS claude
    : process.argv[1];                             //   → the JS entry script path (dev mode)
}

// Mapping: J94→resolveTeammateExecPath, WsH→TEAMMATE_COMMAND_ENV_VAR, UY→isInBundledMode
```

**Why this matters:** In a packaged release, `claude` is a self-contained Node binary, so `process.execPath` *is* the right thing to run. In a from-source/dev run, `process.execPath` would be plain `node`, so the code instead uses `process.argv[1]` (the CLI entry script). The `TEAMMATE_COMMAND_ENV_VAR` (`WsH`) override exists so testing harnesses or wrapper scripts can interpose a different launcher. **Key insight:** getting this wrong would spawn a teammate running the *wrong* program (or plain `node` with no script), so the bundled-vs-dev branch is load-bearing.

### 3.2 buildTeammateCliFlags (`X94`)

**What it does:** Builds the inherited-flag suffix appended after the identity flags (`cli_inner_pretty.js:380309-380335`).

```javascript
// ============================================
// buildTeammateCliFlags - propagate permission/model/settings/plugins/mode/chrome flags
// Location: cli_inner_pretty.js:380309-380335
// ============================================

// ORIGINAL (for source lookup):
function X94(H) {
  let $ = [], { planModeRequired: q, permissionMode: K, skipModel: _ } = H || {};
  if (q);
  else if (K === "bypassPermissions") $.push("--dangerously-skip-permissions");
  else if (K === "acceptEdits") $.push("--permission-mode acceptEdits");
  else if (K === "auto") $.push("--permission-mode auto");
  if (!_) {
    let O = process.env.CLAUDE_CODE_SUBAGENT_MODEL;
    if (O && O !== "inherit") $.push(`--model ${O4([O])}`);
    else { let M = ik(); if (M) $.push(`--model ${O4([M])}`); }
  }
  let z = c2H() ?? d2H();
  if (z) $.push(`--settings ${O4([z])}`);
  let A = _Q();
  for (let O of A) $.push(`--plugin-dir ${O4([O])}`);
  for (let O of Wt()) $.push(`--plugin-url ${O4([O])}`);
  let Y = JSH();
  $.push(`--teammate-mode ${Y}`);
  let f = $7H();
  if (f === !0) $.push("--chrome");
  else if (f === !1) $.push("--no-chrome");
  return $.join(" ");
}

// READABLE (for understanding):
function buildTeammateCliFlags(options) {
  const flags = [];
  const { planModeRequired, permissionMode, skipModel } = options || {};

  // Permission mode — but plan mode wins (never propagate bypass when plan-required):
  if (planModeRequired) { /* intentionally skip — plan mode takes precedence */ }
  else if (permissionMode === "bypassPermissions") flags.push("--dangerously-skip-permissions");
  else if (permissionMode === "acceptEdits")       flags.push("--permission-mode acceptEdits");
  else if (permissionMode === "auto")              flags.push("--permission-mode auto");

  // Model — explicit subagent model env wins, else the leader's resolved main model:
  if (!skipModel) {
    const subagentModel = process.env.CLAUDE_CODE_SUBAGENT_MODEL;
    if (subagentModel && subagentModel !== "inherit") flags.push(`--model ${shellQuote([subagentModel])}`);
    else { const main = getMainLoopModelOverride(); if (main) flags.push(`--model ${shellQuote([main])}`); }
  }

  const settingsPath = getFlagSettingsPath() ?? getDefaultSettingsPath();
  if (settingsPath) flags.push(`--settings ${shellQuote([settingsPath])}`);

  for (const dir of getInlinePlugins()) flags.push(`--plugin-dir ${shellQuote([dir])}`);   // v2.1.156: per inline plugin
  for (const url of getInlinePluginUrls()) flags.push(`--plugin-url ${shellQuote([url])}`); // v2.1.156: NEW, per plugin url

  flags.push(`--teammate-mode ${getTeammateModeFromSnapshot()}`);   // teammate inherits leader's mode

  const chrome = getChromeFlagOverride();
  if (chrome === true) flags.push("--chrome");
  else if (chrome === false) flags.push("--no-chrome");

  return flags.join(" ");
}

// Mapping: X94→buildTeammateCliFlags, O4→shellQuote, ik→getMainLoopModelOverride, c2H→getFlagSettingsPath,
//          d2H→getDefaultSettingsPath, _Q→getInlinePlugins, Wt→getInlinePluginUrls,
//          JSH→getTeammateModeFromSnapshot, $7H→getChromeFlagOverride
```

**Why each flag is forwarded (and the plan-mode precedence):**
- **Permission mode:** A teammate must not be *more* permissive than the leader intends. The `if (planModeRequired) {…skip…}` branch is a *safety override*: even if the leader is in `bypassPermissions`, a plan-mode-required teammate must NOT inherit `--dangerously-skip-permissions`, because plan mode is supposed to be read-only-until-approved. This is the single most security-relevant line in the builder.
- **Model:** Without `--model`, the child would default to its own model resolution and could silently diverge from the leader. `CLAUDE_CODE_SUBAGENT_MODEL` lets ops force a cheaper model for all teammates; the special value `"inherit"` means "don't force, let the child resolve like the parent".
- **`--settings` / `--plugin-dir` / `--plugin-url`:** Reconstruct the parent's *configuration surface* — a fresh process started without these would not load the same settings file or the same inline/url plugins, so its tool set and behaviour would differ. The `--plugin-url` loop is **new in v2.1.156** relative to the v2.1.88 ground truth (which only forwards `--plugin-dir`).
- **`--teammate-mode <mode>`:** Propagates the *resolved* teammate mode (`auto`/`tmux`/`in-process`) so any *grand-children* the teammate spawns use the same mode the leader chose. Without it, a teammate spawned in tmux might re-resolve to `in-process` and the team layout would fracture.
- **`--chrome` / `--no-chrome`:** Only forwarded when the leader set an *explicit* override (tri-state `true`/`false`/`undefined`); otherwise the child resolves Chrome on its own.

**Key insight:** This builder is a *configuration-replay* mechanism. Because a pane teammate is a clean process with no shared memory, every behaviour-shaping decision the leader made via CLI must be re-expressed as a CLI flag here, or the child will silently behave differently. The `skipModel` knob exists because the caller (`L94.spawn`) sometimes wants to inject a *per-teammate* `--model` itself and not have the builder also emit one.

### 3.3 buildTeammateEnvString (`WT$`) + passthrough list (`PT_`)

**What it does:** Produces the `env KEY=VALUE …` prefix of the relaunch command (`cli_inner_pretty.js:380336-380345`).

```javascript
// ============================================
// buildTeammateEnvString - forward provider/proxy/CA/telemetry env to the pane child
// Location: cli_inner_pretty.js:380336-380345
// ============================================

// ORIGINAL (for source lookup):
function WT$() {
  let H = ["CLAUDECODE=1", "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1"];
  for (let q of PT_) {
    let K = process.env[q];
    if (K !== void 0 && K !== "") H.push(`${q}=${O4([K])}`);
  }
  let $ = process.env.CLAUDE_SECURESTORAGE_CONFIG_DIR;
  if ($ !== void 0) H.push(`CLAUDE_SECURESTORAGE_CONFIG_DIR=${O4([$])}`);
  return H.join(" ");
}

// READABLE (for understanding):
function buildTeammateEnvString() {
  const envVars = [
    "CLAUDECODE=1",                              // marks the child as running under Claude Code
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1",    // re-enables the agent-team gate in the child
  ];
  for (const key of TEAMMATE_ENV_PASSTHROUGH) {  // forward only if set & non-empty in parent
    const value = process.env[key];
    if (value !== undefined && value !== "") envVars.push(`${key}=${shellQuote([value])}`);
  }
  const secureStorageDir = process.env.CLAUDE_SECURESTORAGE_CONFIG_DIR;  // v2.1.156: always forward if defined
  if (secureStorageDir !== undefined) envVars.push(`CLAUDE_SECURESTORAGE_CONFIG_DIR=${shellQuote([secureStorageDir])}`);
  return envVars.join(" ");
}

// Mapping: WT$→buildTeammateEnvString, PT_→TEAMMATE_ENV_PASSTHROUGH, O4→shellQuote, $→secureStorageDir
```

The passthrough list `PT_` (`cli_inner_pretty.js:380350-380386`) contains ~35 entries, grouped by purpose:

- **API provider selection** — `CLAUDE_CODE_USE_BEDROCK`, `CLAUDE_CODE_USE_VERTEX`, `CLAUDE_CODE_USE_FOUNDRY`, `CLAUDE_CODE_USE_ANTHROPIC_AWS`, `CLAUDE_CODE_USE_MANTLE`, and the AWS/Bedrock/Mantle credential + endpoint vars (`ANTHROPIC_AWS_WORKSPACE_ID`, `ANTHROPIC_AWS_BASE_URL`, `ANTHROPIC_AWS_API_KEY`, `CLAUDE_CODE_SKIP_ANTHROPIC_AWS_AUTH`, `AWS_BEARER_TOKEN_BEDROCK`, `ANTHROPIC_BEDROCK_MANTLE_BASE_URL`, `CLAUDE_CODE_SKIP_MANTLE_AUTH`, `AWS_REGION`, `ANTHROPIC_BEDROCK_SERVICE_TIER`). **Why:** without these, the child defaults to the first-party Anthropic endpoint and would send requests to the *wrong provider* (the v2.1.88 source comment explicitly cites GitHub issue #23561). A tmux pane may start a fresh login shell that does **not** inherit the parent's exported env, so the leader must forward these explicitly.
- **Custom endpoint / config** — `ANTHROPIC_BASE_URL`, `CLAUDE_CONFIG_DIR`, `CLAUDE_CODE_SUBAGENT_MODEL`.
- **Remote (CCR) markers** — `CLAUDE_CODE_REMOTE`, `CLAUDE_CODE_REMOTE_MEMORY_DIR`. The v2.1.88 comment notes `CLAUDE_CODE_REMOTE_MEMORY_DIR` must be forwarded *together with* `CLAUDE_CODE_REMOTE`, otherwise the auto-memory gate would flip the teammate to memory-off on an ephemeral CCR filesystem.
- **Proxy + CA certs** — `HTTPS_PROXY`, `https_proxy`, `HTTP_PROXY`, `http_proxy`, `NO_PROXY`, `no_proxy`, `SSL_CERT_FILE`, `NODE_EXTRA_CA_CERTS`, `REQUESTS_CA_BUNDLE`, `CURL_CA_BUNDLE`. **Why:** in managed/enterprise deployments all egress goes through a MITM relay; if the teammate doesn't see the proxy + CA-bundle vars it would either bypass the relay or fail TLS verification.
- **Telemetry / traffic opt-out** — `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`, `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`, `DISABLE_ERROR_REPORTING`, `DISABLE_GROWTHBOOK`, `DISABLE_TELEMETRY`, `DO_NOT_TRACK`. **Why:** a user who opted out of telemetry must stay opted-out across every spawned teammate; forgetting these would leak telemetry from child processes the user never explicitly launched.

The two hard-coded entries are themselves load-bearing: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` is what re-arms the agent-team feature gate in the child (so the child knows it *can* be a teammate), and `CLAUDECODE=1` marks the environment as Claude-managed.

**Why a forward-list instead of `env` with no args (full inheritance):** A bare `env <claude>` would pass the *entire* parent environment, which is both noisy and a potential leak vector (arbitrary secrets in unrelated env vars would propagate into a child whose command line is *visible in the pane*). The explicit allow-list is a **principle-of-least-privilege** choice: forward only what is functionally required, and shell-quote each value so an attacker-controlled env value can't break out of the command string. **Key insight:** the v2.1.156 list is materially *larger* than v2.1.88's (which had ~17 entries and no telemetry/secure-storage group), reflecting hardening for managed/enterprise deployments.

---

## 4. TmuxBackend — the tmux PaneBackend

`TmuxBackend` (obfuscated: `ZU6`, `cli_inner_pretty.js:380545-380784`) is the default, native pane backend. Fields: `type="tmux"`, `displayName="tmux"`, `supportsHideShow=true`, plus per-instance caches `cachedLeaderWindowTarget` and `firstPaneUsedForExternal`.

### 4.1 Two tmux endpoints: user session vs external swarm session

A leader can be running **inside** the user's tmux or in a **plain terminal**. tmux commands must therefore be routed to one of two places, selected by the `useExternalSession` boolean (the `!insideTmux` value the executor stores):

```javascript
// ============================================
// runTmuxInSwarmSocket / runTmuxInSwarmLabel - the two tmux command routers
// Location: cli_inner_pretty.js:380537-380544
// ============================================

// ORIGINAL (for source lookup):
function kS(H) {
  let $ = ob6(), q = $ ? ["-S", $, ...H] : H;
  return y8(uu, q);
}
function BE(H) {
  return y8(uu, ["-L", PsH(), ...H]);
}

// READABLE (for understanding):
function runTmuxInSwarmSocket(args) {              // used when leader IS inside the user's tmux
  const socketPath = getSwarmSocketPath();         // optional -S <socket>
  const fullArgs = socketPath ? ["-S", socketPath, ...args] : args;
  return execFileNoThrow(TMUX_COMMAND, fullArgs);
}
function runTmuxInSwarmLabel(args) {              // used for the EXTERNAL standalone swarm session
  return execFileNoThrow(TMUX_COMMAND, ["-L", getSwarmSocketName(), ...args]);
}

// Mapping: kS→runTmuxInSwarmSocket, BE→runTmuxInSwarmLabel, ob6→getSwarmSocketPath, PsH→getSwarmSocketName,
//          y8→execFileNoThrow, uu→TMUX_COMMAND
```

Throughout the class, the pattern `(useExternalSession ? BE : kS)(args)` selects the router. `sendCommandToPane`, `killPane`, `hidePane`, `showPane`, `setPaneBorderColor`, `setPaneTitle`, and `enablePaneBorderStatus` all take a trailing `useExternalSession` boolean and pick `BE` (external `-L` label) or `kS` (`-S` socket / user session) accordingly.

> **Evolution vs v2.1.88:** the v2.1.88 ground truth (`TmuxBackend.ts:77-91`) has only `runTmuxInUserSession` (no socket override at all — plain `execFileNoThrow(TMUX_COMMAND, args)`) and `runTmuxInSwarm` (`['-L', getSwarmSocketName(), …]`). v2.1.156 **evolved** the user-session router (`kS`) to *optionally* pass `-S <socketPath>` when `getSwarmSocketPath()` (`ob6`) returns one. The external router (`BE`) remains the `-L <label>` form, byte-identical in spirit to v2.1.88's `runTmuxInSwarm`.

### 4.2 createTeammatePaneInSwarmView + serialization lock

**What it does:** Creates one empty pane, serialized so parallel spawns can't interleave tmux calls (`cli_inner_pretty.js:380557-380565`).

```javascript
// ============================================
// TmuxBackend.createTeammatePaneInSwarmView + acquirePaneCreationLock - serialized pane creation
// Location: cli_inner_pretty.js:380517-380523, 380557-380565
// ============================================

// ORIGINAL (for source lookup):
function ZT_() {
  let H, $ = new Promise((K) => { H = K; }), q = Z94;
  return ((Z94 = $), q.then(() => H));
}
async createTeammatePaneInSwarmView(H, $) {
  let q = await ZT_();
  try {
    if (await this.isRunningInside()) return await this.createTeammatePaneWithLeader(H, $);
    return await this.createTeammatePaneExternal(H, $);
  } finally { q(); }
}

// READABLE (for understanding):
function acquirePaneCreationLock() {               // promise-chain mutex
  let release;
  const newLock = new Promise((resolve) => { release = resolve; });
  const previousLock = paneCreationLock;           // module-global Z94, starts as Promise.resolve()
  paneCreationLock = newLock;                       // next caller waits on US
  return previousLock.then(() => release);          // resolve to OUR release fn after PREVIOUS lock clears
}
async createTeammatePaneInSwarmView(name, color) {
  const release = await acquirePaneCreationLock();  // wait our turn
  try {
    if (await this.isRunningInside())               // leader inside user's tmux?
      return await this.createTeammatePaneWithLeader(name, color);    // split current window (leader 30% / team 70%)
    return await this.createTeammatePaneExternal(name, color);        // standalone swarm session, tiled
  } finally { release(); }                           // let the next spawn proceed
}

// Mapping: ZT_→acquirePaneCreationLock, Z94→paneCreationLock(module global), H→name, $→color, q→release
```

**Why the lock (`ZT_`):** `TeamCreate` can spawn several teammates *in parallel*. Each pane creation does a *read-then-split* sequence (count current panes → choose a target pane → `split-window`). If two spawns interleave, both could read the same pane count and split the same target, producing a corrupted layout or both landing in the wrong pane. The lock is a **promise-chain mutex**: each caller swaps the module-global `paneCreationLock` (`Z94`) for its own unresolved promise and awaits the *previous* one, guaranteeing strict FIFO serialization of the entire create-pane critical section. **Key insight:** it's lock-free in the OS sense (no mutex syscalls) — it leverages the single-threaded JS event loop, where awaiting a promise is the only suspension point.

**The `-P -F "#{pane_id}"` idiom:** every `split-window`/`new-window` in this class passes `-P -F "#{pane_id}"`, which tells tmux to **print** the new pane's id to stdout in the given format. That captured pane id *is* the handle every subsequent operation (`send-keys`, `kill-pane`, `setPaneTitle`) targets via `-t <paneId>`. See `createTeammatePaneWithLeader` (`cli_inner_pretty.js:380696`, `380710`) and `createExternalSwarmSession` (`cli_inner_pretty.js:380657`, `380684`).

**Internal vs external layout:**
- *Inside the user's tmux* (`createTeammatePaneWithLeader`, `cli_inner_pretty.js:380688-380722`): if the window has 1 pane (just the leader), split horizontally with the leader kept at 30% (`split-window -t <leader> -h -l 70% -P -F "#{pane_id}"`, `cli_inner_pretty.js:380696`). For subsequent teammates it picks a middle/last existing teammate pane and alternates `-v`/`-h` splits, then `rebalancePanesWithLeader` re-applies `main-vertical` with the leader at 30%.
- *External* (`createTeammatePaneExternal`, `cli_inner_pretty.js:380723-380757`): ensures a standalone `claude-swarm` session/window exists (`createExternalSwarmSession`, `cli_inner_pretty.js:380655-380687`). The **`firstPaneUsedForExternal`** flag (`cli_inner_pretty.js:380550`, set at `380731`) is the subtle bit: the brand-new swarm session already *has* one empty pane, so the first teammate **reuses** that initial pane instead of creating a second one; only from the second teammate onward does it `split-window`. Without this flag the swarm window would always have a stray empty leader-less pane.

### 4.3 sendCommandToPane — the "type it in" primitive

```javascript
// ============================================
// TmuxBackend.sendCommandToPane - type the relaunch command into the pane via send-keys
// Location: cli_inner_pretty.js:380566-380569
// ============================================

// ORIGINAL (for source lookup):
async sendCommandToPane(H, $, q = !1) {
  let _ = await (q ? BE : kS)(["send-keys", "-t", H, $, "Enter"]);
  if (_.code !== 0) throw Error(`Failed to send command to pane ${H}: ${_.stderr}`);
}

// READABLE (for understanding):
async sendCommandToPane(paneId, command, useExternalSession = false) {
  const result = await (useExternalSession ? runTmuxInSwarmLabel : runTmuxInSwarmSocket)(
    ["send-keys", "-t", paneId, command, "Enter"]   // literally type `command` then press Enter
  );
  if (result.code !== 0) throw new Error(`Failed to send command to pane ${paneId}: ${result.stderr}`);
}

// Mapping: H→paneId, $→command, q→useExternalSession, BE→runTmuxInSwarmLabel, kS→runTmuxInSwarmSocket, _→result
```

**Key insight:** `send-keys … "<command>" Enter` is exactly equivalent to a human typing the entire `cd … && env … claude …` line at the pane's shell prompt and hitting Return. tmux passes the string verbatim to the pane's pty, the shell parses and runs it, and a new `claude` process starts in that pane. There is no IPC handshake — the pane's shell is the "API". The 200ms `PANE_SHELL_INIT_DELAY_MS` (`WT_=200`, `cli_inner_pretty.js:380786`, awaited via `G94()` after pane creation at `380719`/`380754`) exists precisely so the pane's shell has finished loading rc-files/prompt before the command is typed, otherwise the keystrokes could be swallowed by a still-initializing shell.

### 4.4 Color map, kill, hide/show

- **`getTmuxColorName` (`T94`, `cli_inner_pretty.js:380525-380536`)** maps the 8 agent colors to tmux color names: `purple→magenta`, `orange→colour208`, `pink→colour205`, the rest identity. Used by `setPaneBorderColor`/`setPaneTitle` to color the pane border so the human can tell teammates apart.
- **`killPane` (`cli_inner_pretty.js:380592-380594`)**: `(useExternalSession ? BE : kS)(["kill-pane","-t",paneId])`; returns `code === 0`. This is what `L94.kill` and the on-exit cleanup call.
- **`enablePaneBorderStatus` (`cli_inner_pretty.js:380583-380587`)**: `set-option -w -t <window> pane-border-status top` — turns on the title strip so teammate names/colors show.
- **hide/show** (`cli_inner_pretty.js:380595-380617`): `supportsHideShow=true` for tmux. `hidePane` uses `break-pane` into a detached `claude-swarm-hidden` session; `showPane` uses `join-pane` back and re-applies `main-vertical`. (iTerm2 returns false for both — see §5.)

---

## 5. ITermBackend — the iTerm2 PaneBackend

`ITermBackend` (obfuscated: `TU6`, `cli_inner_pretty.js:380820-380900`) implements the same `PaneBackend` interface using the **`it2` Python CLI** (a third-party companion that drives iTerm2's Python API). Fields: `type="iterm2"`, `displayName="iTerm2"`, `supportsHideShow=false`.

### 5.1 Availability — needs both iTerm2 AND it2

```javascript
// ============================================
// ITermBackend.isAvailable - requires running in iTerm2 AND the it2 CLI present
// Location: cli_inner_pretty.js:380824-380830
// ============================================

// ORIGINAL (for source lookup):
async isAvailable() {
  let H = h6H();
  if ((N(`[ITermBackend] isAvailable check: inITerm2=${H}`), !H))
    return (N("[ITermBackend] isAvailable: false (not in iTerm2)"), !1);
  let $ = await MG$();
  return (N(`[ITermBackend] isAvailable: ${$} (it2 CLI ${$ ? "found" : "not found"})`), $);
}

// READABLE (for understanding):
async isAvailable() {
  const inITerm2 = isInITerm2();                    // env-based detection (TERM_PROGRAM etc.)
  if (!inITerm2) return false;                      // not in iTerm2 ⇒ this backend can't run
  return await isIt2CliAvailable();                 // also need the `it2` companion CLI on PATH
}

// Mapping: h6H→isInITerm2, MG$→isIt2CliAvailable, H→inITerm2, $→it2Available, N→logDebug
```

**Why two conditions:** unlike tmux (a single self-contained binary), iTerm2 automation requires a *separate* Python tool (`it2`) whose Python API must be enabled in iTerm2 preferences. So the backend is only "available" if both the terminal is iTerm2 *and* the `it2` bridge exists. This is exactly why the elaborate **it2 setup flow** (§6) exists.

### 5.2 Pane creation via `it2 session split` + dead-session pruning

`createTeammatePaneInSwarmView` (`cli_inner_pretty.js:380835-380876`) mirrors the tmux structure (same `acquirePaneCreationLock` idiom, here `GT_`/`k94`) but uses `it2 session split`:
- **First teammate:** split vertically from the *leader's* iTerm2 session, whose UUID is extracted from `ITERM_SESSION_ID` by `getLeaderIt2SessionId` (`VT_`, `cli_inner_pretty.js:380813-380819`): `["session","split","-v","-s",<leaderSession>]` (`cli_inner_pretty.js:380845`). Falls back to splitting the active session if no leader id.
- **Subsequent teammates:** split from the *last* teammate's session id (tracked in module array `n6H`): `["session","split","-s",<lastTeammate>]` (`cli_inner_pretty.js:380848`).
- **Dead-session recovery (the clever loop):** the whole thing is in a `while(true)`. If a split fails *and* it targeted a teammate session, the code runs `it2 session list` to confirm the target is actually gone; if so it **prunes** that id from `n6H` and `continue`s to retry with the next-to-last (`cli_inner_pretty.js:380851-380863`). When `n6H` empties, `uW8` (firstPaneUsed) resets so the next iteration splits from the leader again. The new session id is parsed from `it2`'s `"Created new pane: <id>"` output by `parseIt2SplitOutput` (`TT_`, `cli_inner_pretty.js:380808-380812`).

```javascript
// ============================================
// ITermBackend.sendCommandToPane / killPane - it2 session run / it2 session close
// Location: cli_inner_pretty.js:380877-380893
// ============================================

// ORIGINAL (for source lookup):
async sendCommandToPane(H, $, q) {
  let _ = await mW8(H ? ["session", "run", "-s", H, $] : ["session", "run", $]);
  if (_.code !== 0) throw Error(`Failed to send command to iTerm2 pane ${H}: ${_.stderr}`);
}
async killPane(H, $) {
  let q = await mW8(["session", "close", "-f", "-s", H]), K = n6H.indexOf(H);
  if (K !== -1) n6H.splice(K, 1);
  if (n6H.length === 0) uW8 = !1;
  return q.code === 0;
}

// READABLE (for understanding):
async sendCommandToPane(paneId, command, _useExternalSession) {
  // it2 session run adds the newline itself — no explicit Enter needed (vs tmux send-keys):
  const result = await runIt2(paneId ? ["session","run","-s",paneId,command] : ["session","run",command]);
  if (result.code !== 0) throw new Error(`Failed to send command to iTerm2 pane ${paneId}: ${result.stderr}`);
}
async killPane(paneId, _useExternalSession) {
  const result = await runIt2(["session","close","-f","-s",paneId]);   // force-close the split
  const idx = teammateSessionIds.indexOf(paneId);                       // n6H
  if (idx !== -1) teammateSessionIds.splice(idx, 1);
  if (teammateSessionIds.length === 0) firstPaneUsed = false;           // uW8
  return result.code === 0;
}

// Mapping: mW8→runIt2, n6H→teammateSessionIds, uW8→firstPaneUsed, H→paneId, $→command, q/K→result/idx
```

**Why `it2 session run` instead of send-keys:** iTerm2 has no `send-keys` equivalent over its Python API; instead `it2 session run` injects a command (with an implicit newline) into a session. The effect is the same as tmux's `send-keys … Enter`: the pane's shell runs the relaunch command and a new `claude` boots. Note `sendCommandToPane` *ignores* its `useExternalSession` arg — iTerm2 has no external-socket concept.

**Performance trade-off:** `setPaneBorderColor`/`setPaneTitle`/`enablePaneBorderStatus`/`rebalancePanes` are all **no-ops** for iTerm2 (`cli_inner_pretty.js:380881-380886`). The v2.1.88 source comment explains why: *each `it2` call spawns a Python process and round-trips the API, which is slow*, so cosmetic features are skipped. Likewise `supportsHideShow=false` and `hidePane`/`showPane` just log "not supported" and return false (`cli_inner_pretty.js:380894-380899`). **Key insight:** the iTerm2 backend is a *functional* but *cosmetically degraded* port; the tmux backend is the first-class experience.

### 5.3 Registration

The iTerm2 module (`N94`/`E94`, `cli_inner_pretty.js:380795-380910`) registers its class with the global registry via `registerITermBackend(ITermBackend)` (`VU6(TU6)`, `cli_inner_pretty.js:380910`), which sets `registry.ITermBackendClass` (`cli_inner_pretty.js:380953-380955`). The tmux module does the analogous `registerTmuxBackend(TmuxBackend)` (`GU6(ZU6)`, `cli_inner_pretty.js:380793`). The registry then lazy-instantiates whichever class detection selects (see `execution_modes_and_backend_registry.md`).

---

## 6. it2 setup flow (iTerm2 onboarding)

Because iTerm2 needs the external `it2` CLI + Python API, there is a small onboarding subsystem (`cli_inner_pretty.js:380183-380263`). All of it is byte-aligned with the v2.1.88 ground truth `it2Setup.ts`.

- **`detectPythonPkgMgr` (`A94`, `cli_inner_pretty.js:380183-380189`)**: `which uv` → `"uvx"`, else `which pipx` → `"pipx"`, else `which pip`/`pip3` → `"pip"`, else `null`. Ordered by preference (isolated environments first). Note it checks for `uv` but returns the string `"uvx"` for type compatibility.
- **`isIt2Installed` (`XT_`, `cli_inner_pretty.js:380190-380192`)**: `(await which("it2")).code === 0`.
- **`installIt2` (`Y94`, `cli_inner_pretty.js:380193-380221`)**: per package manager — `uv tool install it2`, `pipx install it2`, or `pip install --user it2` (falling back to `pip3`). **Security detail:** installs are run with `cwd: homedir()` to avoid reading a project-level `pip.conf`/`uv.toml` that could redirect to a malicious PyPI server (per the v2.1.88 comment). Emits `swarm_iterm2_it2_install` telemetry.
- **`verifyIt2Setup` (`f94`, `cli_inner_pretty.js:380222-380243`)**: runs `it2 session list`; if it fails with stderr containing `api`/`python`/`connection refused`/`not enabled`, returns `{needsPythonApiEnabled:true}` (a distinct, recoverable failure). Emits `swarm_iterm2_it2_verify`.
- **`pythonApiInstructions` (`O94`, `cli_inner_pretty.js:380244-380251`)**: the literal guidance text — `iTerm2 → Settings → General → Magic → Enable Python API`.
- **`markIt2SetupComplete` (`M94`, `cli_inner_pretty.js:380253-380255`)**: persists `iterm2It2SetupComplete=true` in global config so the prompt isn't shown again.
- **`setPreferTmuxOverIterm2` / `getPreferTmuxOverIterm2` (`j94`/`w94`, `cli_inner_pretty.js:380257-380262`)**: persists/reads `preferTmuxOverIterm2`. When set, detection skips iTerm2 entirely and uses tmux even inside iTerm2 (the "I don't want the it2 dance" escape hatch).

**Why this whole flow exists:** it is the cost of supporting a terminal whose automation isn't built-in. The `preferTmuxOverIterm2` toggle is the pressure-release valve: a user who has tmux installed can opt out of the it2 onboarding permanently and get the (better) tmux experience even while sitting in iTerm2.

---

## 7. Pane lifecycle & the in-process contrast

```
            ┌──────────────────────── PANE TEAMMATE (process B) ───────────────────────┐
spawn ──────►  pane created (empty) ──► command typed ──► claude boots ──► poll loop ──►...
            │                                                                            │
terminate ──►  mailbox shutdown_request (graceful)  ──► teammate exits its own process   │
kill ───────►  backend.killPane (SIGHUP via pane close, forceful)  ──► process B gone     │
leader exit ►  registerCleanup → killPane for EVERY tracked pane  ──► all children gone   │
            └────────────────────────────────────────────────────────────────────────────┘
   IPC: file mailbox ONLY (writeToMailbox / readUnreadMessages). NO shared AppState.
```

| Aspect | In-process teammate | **Pane teammate (this doc)** |
|---|---|---|
| Process | same Node process as leader | **separate `claude` OS process** |
| Isolation | `AsyncLocalStorage` | OS process boundary |
| Shared state | shares `AppState` (task registry) | **none — mailbox only** |
| Spawn | `spawnInProcessTeammate` registers a task | **create pane → type command → boot child** |
| `sendMessage` | mailbox write (`aA`) | mailbox write (`aA`) — *same code* |
| `terminate` | mailbox shutdown + `requestTeammateShutdown` | mailbox shutdown only |
| `kill` | abort the task's AbortController | `killPane` (close the pane) |
| Survives leader busy-loop? | no (same event loop) | **yes (own process)** |
| Survives leader exit? | no (dies with process) | no — `registerCleanup` kills panes on exit |
| Visible to human? | only via fleet UI | **yes — a real scrollable pane** |

The lifecycle is the crisp differentiator: a pane teammate is a fully independent process that *happens* to be parented next to the leader visually. The **only** thread tying them together is (a) the file mailbox for messages, and (b) the leader's on-exit cleanup that closes the panes. If the leader crashes hard (no clean exit), the cleanup may not run and panes can be orphaned — the inverse of in-process teammates, which can never outlive their host. This is the fundamental availability-vs-coupling trade-off between the two modes.

---

## Cross-Validation (v2.1.88)

The v2.1.88 named-TypeScript tree (`/lyz/codespace/3rd/claude-code/src`) is the cleanest readable precursor and corroborates the entire mapping. Summary of byte-identical vs evolved:

**Byte-identical (structure & logic match exactly):**
- `PaneBackendExecutor` ↔ `utils/swarm/backends/PaneBackendExecutor.ts:39` (class), `:350` (`createPaneBackendExecutor`). The `spawn` body (`:79-209`), `sendMessage` (`:216`), `terminate` (`:252`), `kill` (`:295`), `isActive` (`:329`), the `spawnedTeammates` map (`:49`) and `cleanupRegistered` one-shot (`:50`, `:164`) all match the minified `L94` line-for-line, including the exact debug strings and the `cd … && env … ${binaryPath} …` command shape (`:154`).
- `TmuxBackend` ↔ `backends/TmuxBackend.ts:104`. `sendCommandToPane` `send-keys -t <pane> <cmd> Enter` (`:157`), `killPane` (`:271`), `enablePaneBorderStatus` (`:234`), `getTmuxColorName` map (`:59-71`, `purple→magenta`/`orange→colour208`/`pink→colour205`), the `acquirePaneCreationLock` promise-chain mutex (`:43-53`), `PANE_SHELL_INIT_DELAY_MS=200` (`:33`), and the `firstPaneUsedForExternal` flag (`:23`) are all present and identical in spirit.
- `ITermBackend` ↔ `backends/ITermBackend.ts:79`. The `while(true)` dead-session-pruning split loop (`:137-208`), `it2 session run` (sendCommandToPane `:245`) / `it2 session close -f` (killPane `:320`, close call at `:328`), the no-op cosmetic methods with the "each it2 call spawns a Python process" comment (`:270-289`), `supportsHideShow=false`, `parseSplitOutput` (`:50`), and `getLeaderSessionId` from `ITERM_SESSION_ID` (`:63-73`) all match `TU6` exactly.
- it2 setup ↔ `backends/it2Setup.ts`: `detectPythonPackageManager` (`:40`), `isIt2CliAvailable` (`:79`), `installIt2` with `cwd: homedir()` PyPI-redirect hardening (`:90-144`), `verifyIt2Setup` (`:152-195`) with the `needsPythonApiEnabled` branch, `getPythonApiInstructions` (`:200-208`, verbatim text), `markIt2SetupComplete` (`:214`), `setPreferTmuxOverIterm2`/`getPreferTmuxOverIterm2` (`:229-245`) — all byte-aligned. `IT2_COMMAND`/`isInITerm2` live in `backends/detection.ts`.

**Evolved (v2.1.156 added behaviour beyond v2.1.88):**
- **Env passthrough list grew.** v2.1.88 `spawnUtils.ts:96-128` (`TEAMMATE_ENV_VARS`) has ~17 entries (provider, base-url, config-dir, remote, proxy, CA certs). v2.1.156's `PT_` (`cli_inner_pretty.js:380350-380386`) expands this to ~35, adding the **AWS/Mantle credential group** (`ANTHROPIC_AWS_*`, `AWS_BEARER_TOKEN_BEDROCK`, `AWS_REGION`, `ANTHROPIC_BEDROCK_*`, `CLAUDE_CODE_USE_ANTHROPIC_AWS`, `CLAUDE_CODE_USE_MANTLE`, `CLAUDE_CODE_SKIP_*_AUTH`), `CLAUDE_CODE_SUBAGENT_MODEL`, and a whole **telemetry-opt-out group** (`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`, `CLAUDE_CODE_PROVIDER_MANAGED_BY_HOST`, `DISABLE_ERROR_REPORTING`, `DISABLE_GROWTHBOOK`, `DISABLE_TELEMETRY`, `DO_NOT_TRACK`). `buildTeammateEnvString` (`WT$`) also now appends `CLAUDE_SECURESTORAGE_CONFIG_DIR` (absent in v2.1.88).
- **CLI flag builder gained `--plugin-url` and `--permission-mode auto`.** v2.1.88 `spawnUtils.ts:38-89` forwards `--plugin-dir` only and handles `bypassPermissions`/`acceptEdits`; v2.1.156 `X94` adds a `--plugin-url` loop (`cli_inner_pretty.js:380328`) and an explicit `--permission-mode auto` branch (`cli_inner_pretty.js:380315`).
- **Tmux user-session router gained an optional `-S <socket>`.** v2.1.88 `runTmuxInUserSession` is plain `execFileNoThrow(TMUX_COMMAND, args)`; v2.1.156 `kS` optionally prefixes `-S <getSwarmSocketPath()>` (`cli_inner_pretty.js:380537-380541`). The external `-L`-label router (`BE` ↔ `runTmuxInSwarm`) is unchanged.

**Naming note:** v2.1.88 already calls this subsystem "swarm" internally (`utils/swarm/…`, telemetry `swarm_*`), confirming the dossier's premise that "swarm" (v2.1.156 internal name) == "agent team" (v2.1.142 doc-facing name). The v2.1.142 `30_agent_team/` tree framed the modes differently (it did not isolate the tmux/iTerm2 `PaneBackend` split as a first-class executor); v2.1.156 reframes everything around the `BackendRegistry`-driven `InProcessBackend`-vs-`PaneBackendExecutor` split documented here and in `execution_modes_and_backend_registry.md`.

---

## See Also

Sibling docs in this module (`30_agent_team/`):
- [README.md](./README.md) — module overview and the two-mode map.
- [execution_modes_and_backend_registry.md](./execution_modes_and_backend_registry.md) — the `BackendRegistry`, detection (`detectAndGetBackend`), the `isInProcessEnabled` switch, and `getTeammateExecutor` dispatch that *selects* this pane executor.
- [in_process_mode.md](./in_process_mode.md) — the other execution mode (`InProcessBackend`, the agent loop, the 500ms poll loop, ALS identity isolation).
- cross_process_mode.md — this document.
- mailbox_and_lifecycle_tools.md — the file mailbox (`writeToMailbox`/`readUnreadMessages`), shutdown-request helpers, and the `TeamCreate`/`TeamDelete`/`SendMessage` tools that both modes share.
- cross_validation.md — full per-symbol v2.1.88 corroboration for the whole module.
