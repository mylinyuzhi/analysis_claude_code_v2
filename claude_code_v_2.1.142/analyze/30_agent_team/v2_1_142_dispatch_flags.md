# v2.1.142 Dispatch Flags on `claude agents`

## TL;DR

In v2.1.142, the `claude agents` subcommand (the "agent view" entry point) gained six new flags that flow through to **every** background session spawned from the view:

```
--add-dir <directories...>
--settings <file-or-json>
--mcp-config <configs...>
--plugin-dir <path>
--strict-mcp-config
--permission-mode <mode> | --dangerously-skip-permissions
--model <model>
--effort <level>
```

The first five are *configuration extra-args*: they're parsed once, validated against absolute-path semantics, then prepended to every spawned worker's argv. The last three are *dispatch defaults*: they configure the per-session knobs the user can still override per-task (model, effort, permission mode).

This is structurally distinct from how teammate dispatch worked in v2.1.112: there, the teammate inherited the *leader's* in-memory state. Here, the agent-view dispatcher has no parent session — it spawns each worker fresh from `claude` and must therefore restate everything in argv.

This document is the v2.1.142 companion to `30_agent_team/spawn_mechanism.md` from v2.1.112. The agent-view dispatcher uses the same `--bg` plumbing as `claude --bg`, only one layer up.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_agents.md](../00_overview/symbol_additions_v2_1_142_agents.md) — v2.1.142 background-agents
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Core features (Background Agents)

Key functions in this document:
- `parseAgentsDispatchFlags` (`Go6`) — pre-Commander scanner that pulls the typed args out of argv before Commander sees them (cli_inner_pretty.js:65-103)
- `resolveDispatchExtraArgs` (`yV$`) — applies `path.resolve` to file paths, leaving inline JSON strings alone (cli_inner_pretty.js:104-113)
- `serializeDispatchExtraArgs` (`hV$`) — converts the typed extra-args bag back into a flag-array argv tail (cli_inner_pretty.js:114-122)
- `coerceDispatchDefaults` (`gg4`) — validates `--permission-mode`/`--model`/`--effort` and gates `bypassPermissions`/`auto` on prior opt-in (cli_inner_pretty.js:565469-565478)
- `dispatchDefaultsToArgv` (`qg6`) — formats validated defaults as `--model X --effort Y --permission-mode Z` (cli_inner_pretty.js:509773-509780)
- `mountFleetView` (`ao5`) — the agent-view loop (cli_inner_pretty.js:569079-569208)
- `setDispatchExtraArgsForSession` (`MN4`) — stashes the resolved flag set in module-global `OG$` (cli_inner_pretty.js:509767-509769)
- `coldDispatchFromTemplate` (`yP8`) — the actual spawn that consumes `OG$` (cli_inner_pretty.js:509781-509834)

---

## End-to-end Flow

```
                argv
                  │
                  ▼
   Go6.parseAgentsDispatchFlags   (pre-Commander: peel off the typed extras)
        │     │             │
        │   cwdFilter       config(addDir, pluginDir, settings, mcpConfig, strictMcpConfig)
        ▼     ▼             ▼
  Commander parses everything else
        │
        ▼
   .action(opts):
        │
        ├─ yV$.resolveDispatchExtraArgs  (path.resolve on each)
        ├─ hV$.serializeDispatchExtraArgs (→ flag-array)   ───┐
        ├─ gg4.coerceDispatchDefaults                          │
        │      (--permission-mode, --model, --effort)          │
        └─ ao5.mountFleetView({                                 │
              cwdFilter,                                        │
              dispatchExtraArgs,   ◄────────────────────────────┘
              dispatchDefaults
           })
              │
              ▼
       MN4.setDispatchExtraArgsForSession(extraArgs)
              │
              ▼
       FleetViewDashboard renders, user types task
              │
              ▼
       jN4.claimSpareOrColdDispatch / yP8.coldDispatchFromTemplate
              │
              │ argv = [...OG$, --agent X, ...qg6(defaults), ...]
              ▼
       I$H.spawnBgSession      (the actual bg-worker child)
```

The key insight: the dispatch-extras get parsed **once** at agent-view launch, are stored in a *process-global* (`OG$`), and are silently re-applied to every subsequent in-session dispatch. This is why a single `claude agents --add-dir /foo --mcp-config bar.json` invocation transparently propagates `/foo` and `bar.json` to every task dispatched from that agent-view session.

---

## Why a Pre-Commander Scanner?

```javascript
// ============================================
// parseAgentsDispatchFlags - Pre-Commander positional scan
// Location: cli_inner_pretty.js:65-103
// ============================================

// ORIGINAL (for source lookup):
function Go6(H) {
  let $ = !1, q, K = { addDir: [], pluginDir: [], settings: void 0, mcpConfig: [], strictMcpConfig: !1 }, _ = [], A = {
    "--cwd": (z) => { q = z; },
    "--settings": (z) => { K.settings = z; },
    "--add-dir": (z) => K.addDir.push(z),
    "--plugin-dir": (z) => K.pluginDir.push(z),
    "--mcp-config": (z) => K.mcpConfig.push(z),
  };
  for (let z = 0; z < H.length; z++) {
    let Y = H[z];
    if (Y === "agents" && !$) { $ = !0; continue; }
    if (Y === "--strict-mcp-config") { K.strictMcpConfig = !0; continue; }
    let f = Y.indexOf("="), O = f === -1 ? Y : Y.slice(0, f), M = Object.hasOwn(A, O) ? A[O] : void 0;
    if (M) {
      if (f !== -1) M(Y.slice(f + 1));
      else if (z + 1 < H.length) M(H[++z]);
      else _.push(Y);
      continue;
    }
    _.push(Y);
  }
  return { hasAgentsPositional: $, cwdFilter: q, config: K, rest: _ };
}

// READABLE (for understanding):
function parseAgentsDispatchFlags(argv) {
  let hasAgentsPositional = false;
  let cwdFilter;
  const config = { addDir: [], pluginDir: [], settings: undefined, mcpConfig: [], strictMcpConfig: false };
  const rest = [];
  const valueHandlers = {
    "--cwd":         (v) => { cwdFilter = v; },
    "--settings":    (v) => { config.settings = v; },
    "--add-dir":     (v) => config.addDir.push(v),
    "--plugin-dir":  (v) => config.pluginDir.push(v),
    "--mcp-config":  (v) => config.mcpConfig.push(v),
  };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === "agents" && !hasAgentsPositional) { hasAgentsPositional = true; continue; }
    if (token === "--strict-mcp-config") { config.strictMcpConfig = true; continue; }
    const eq = token.indexOf("=");
    const flag = eq === -1 ? token : token.slice(0, eq);
    const handler = Object.hasOwn(valueHandlers, flag) ? valueHandlers[flag] : undefined;
    if (handler) {
      if (eq !== -1)               handler(token.slice(eq + 1));
      else if (i + 1 < argv.length) handler(argv[++i]);
      else                          rest.push(token);
      continue;
    }
    rest.push(token);
  }
  return { hasAgentsPositional, cwdFilter, config, rest };
}

// Mapping: Go6→parseAgentsDispatchFlags, $→hasAgentsPositional, q→cwdFilter,
//          K→config, _→rest, z→i, Y→token, f→eq, O→flag, M→handler
```

### Why This Exists

Commander's `.command("agents")` action handler doesn't see `--add-dir` etc. unless those options are also registered on the `agents` subcommand. **They are**: line 607796-607843 wires all the same flags onto the subcommand. So `Go6` is *redundant from Commander's point of view*.

It's there for **two** specific cases:

1. **`claude --bg`-style invocations that omit the `agents` positional.** When `wG8.xn6` (`Promise.all`-lazy-imports both `mountFleetView` and `seedLastJobs`) is called from the `--bg` or `←←` path (line 569363-569364), the parser already has to find `--cwd`/`--add-dir` in a free-floating argv without Commander.
2. **Pre-action environment setup.** Several early bootstrap calls (config dir resolution, settings file loading, plugin dir loading) happen *before* `H.parseAsync(argv)`. If those need to know which extras the user passed (e.g. to load plugins early), they have to scan argv themselves. The `Go6` scanner produces the same shape as the Commander action's options bag, so the rest of the code can be argv-source-agnostic.

### Trade-offs

Duplicating Commander's parsing has a real cost: every flag must be added in two places. Looking at v2.1.139→v2.1.142, when the new dispatch defaults (`--model`, `--effort`, `--permission-mode`, `--dangerously-skip-permissions`) were added, they were added **only** to the Commander handler — `Go6` does *not* know about them. That's because the dispatch defaults are needed *only* when actually rendering the agent-view dashboard (where Commander has already parsed), whereas the extras (`--add-dir` etc.) are needed *earlier* in bootstrap.

---

## How Defaults Are Validated

```javascript
// ============================================
// coerceDispatchDefaults - Validate per-session dispatch defaults with opt-in gates
// Location: cli_inner_pretty.js:565469-565478
// ============================================

// ORIGINAL (for source lookup):
function gg4(H) {
  if (!H) return;
  let $ = H.permissionMode ? Rv(H.permissionMode) : void 0,
    q = ix() || Boolean(h$().bypassPermissionsModeAccepted),
    K = ($ === "bypassPermissions" && !q) || ($ === "auto" && !jR()) ? void 0 : $,
    _ = H.effort?.toLowerCase(),
    A = _ && H0H(_) ? _ : void 0;
  if (!(K && K !== "default") && !H.model && !A) return;
  return { permissionMode: K, model: H.model, effort: A };
}

// READABLE (for understanding):
function coerceDispatchDefaults(raw) {
  if (!raw) return undefined;
  const parsedMode = raw.permissionMode ? parsePermissionMode(raw.permissionMode) : undefined;
  const hasBypassDisclaimerAccepted =
    isBypassPermissionsDisclaimerAccepted() || Boolean(getGlobalConfig().bypassPermissionsModeAccepted);
  const permissionMode =
    (parsedMode === "bypassPermissions" && !hasBypassDisclaimerAccepted) ||
    (parsedMode === "auto" && !isAutoModeOptedIn())
      ? undefined
      : parsedMode;
  const effortLower = raw.effort?.toLowerCase();
  const effort = effortLower && isValidEffortLevel(effortLower) ? effortLower : undefined;
  // Avoid returning a defaults object that has nothing actionable in it
  if (!(permissionMode && permissionMode !== "default") && !raw.model && !effort) return undefined;
  return { permissionMode, model: raw.model, effort };
}

// Mapping: gg4→coerceDispatchDefaults, H→raw, $→parsedMode, q→hasBypassDisclaimerAccepted,
//          K→permissionMode, _→effortLower, A→effort,
//          Rv→parsePermissionMode, ix→isBypassPermissionsDisclaimerAccepted,
//          h$→getGlobalConfig, jR→isAutoModeOptedIn, H0H→isValidEffortLevel
```

### Why This Logic

`coerceDispatchDefaults` does three jobs:

1. **Normalize** — `Rv` maps freeform values (`"auto"`, `"AcceptEdits"`) to a canonical enum (`"acceptEdits"`, `"auto"`, `"bypassPermissions"`, `"default"`, `"plan"`).
2. **Gate** — `bypassPermissions` and `auto` are "dangerous" modes that require **prior opt-in**:
   - `bypassPermissions` requires the user to have accepted the disclaimer (via the runtime guard `ix()` or the persistent `h$().bypassPermissionsModeAccepted`).
   - `auto` requires opt-in (`jR()`).
   If the gate fails, the value is silently dropped — but **not** an error. The session dispatches with default permission mode.
3. **Collapse** — if every field is empty/invalid, return `undefined` so the dispatcher can take a fast-path (`if (!defaults) skip qg6 call`).

The third point is the cost-saving micro-optimization that makes the spawn argv shorter for the common case (no defaults).

### Permission-Mode Cascade

The `--dangerously-skip-permissions` flag on `claude agents` aliases to `--permission-mode bypassPermissions`. This is wired in `mountFleetView`'s caller (line 607834):

```javascript
permissionMode: A.dangerouslySkipPermissions ? "bypassPermissions" : A.permissionMode
```

So `--dangerously-skip-permissions` on the agent-view subcommand is **not** the same as the global `--dangerously-skip-permissions`: it just sets the *default* permission mode for **dispatches**, not for the agent-view UI itself (which doesn't itself execute tools).

---

## Argv Generation for the Spawn

```javascript
// ============================================
// serializeDispatchExtraArgs - Reverse the parsed config into argv tokens
// Location: cli_inner_pretty.js:114-122
// ============================================

// ORIGINAL (for source lookup):
function hV$(H) {
  return [
    ...(H.settings ? ["--settings", H.settings] : []),
    ...H.pluginDir.flatMap(($) => ["--plugin-dir", $]),
    ...H.addDir.flatMap(($) => ["--add-dir", $]),
    ...H.mcpConfig.flatMap(($) => ["--mcp-config", $]),
    ...(H.strictMcpConfig ? ["--strict-mcp-config"] : []),
  ];
}

// READABLE (for understanding):
function serializeDispatchExtraArgs(extras) {
  return [
    ...(extras.settings ? ["--settings", extras.settings] : []),
    ...extras.pluginDir.flatMap((path) => ["--plugin-dir", path]),
    ...extras.addDir.flatMap((path) => ["--add-dir", path]),
    ...extras.mcpConfig.flatMap((config) => ["--mcp-config", config]),
    ...(extras.strictMcpConfig ? ["--strict-mcp-config"] : []),
  ];
}

// Mapping: hV$→serializeDispatchExtraArgs, H→extras, $→path/config
```

```javascript
// ============================================
// dispatchDefaultsToArgv - Reverse the validated dispatch defaults into argv tokens
// Location: cli_inner_pretty.js:509773-509780
// ============================================

// ORIGINAL (for source lookup):
function qg6(H) {
  if (!H) return [];
  return [
    ...(H.model ? ["--model", H.model] : []),
    ...(H.effort ? ["--effort", H.effort] : []),
    ...(H.permissionMode && H.permissionMode !== "default" ? ["--permission-mode", H.permissionMode] : []),
  ];
}

// READABLE (for understanding):
function dispatchDefaultsToArgv(defaults) {
  if (!defaults) return [];
  return [
    ...(defaults.model ? ["--model", defaults.model] : []),
    ...(defaults.effort ? ["--effort", defaults.effort] : []),
    ...(defaults.permissionMode && defaults.permissionMode !== "default"
      ? ["--permission-mode", defaults.permissionMode]
      : []),
  ];
}

// Mapping: qg6→dispatchDefaultsToArgv, H→defaults
```

### Why the asymmetry?

`hV$` keeps `--strict-mcp-config` at the *end*; `qg6` keeps `--permission-mode` at the end. There's no semantic reason — Commander accepts any order. The pattern simply emerged because:

- `hV$` was added when the `--strict-mcp-config` boolean flag was last; that ordering kept the diff localized.
- `qg6` was added when `--permission-mode` was last; the boolean-flag-style condition (`mode !== "default"`) was easier to read at the end.

A "purer" implementation would merge them. The cost of leaving them separate is one redundant if-test per dispatch.

---

## Putting It All Together — the Action Handler

The Commander action handler at cli_inner_pretty.js:607804-607841 is the choreographer. Key behavior:

1. **TTY guard.** If `!process.stdout.isTTY`, skip the agent view entirely and `wZH("claude agents")` — exit 1 with `'claude agents' is not available in this environment`. The agent view *requires* a real terminal because it's a full-screen Ink app.
2. **Gate hydration.** `await y5$()` ensures the settings-disable check (`disableAgentView`) has had a chance to run.
3. **Subcommand-level fleet gate.** `if (!fF()) wZH(...)` — `fF()` returns `!rmH()`, where `rmH` checks `CLAUDE_CODE_DISABLE_AGENT_VIEW=1` or managed-settings `disableAgentView=true`.
4. **Telemetry.** `d("tengu_fleetview", { viaCommander:!0, relaunch: Cq6() })` — `Cq6` consumes the `CLAUDE_CODE_AGENT_VIEW_RELAUNCH` env var (set when the daemon re-execs itself after a binary upgrade so the user lands back where they were).
5. **Lazy module load.** `mountFleetView` lives in a large UI subtree (`MG8`) that is only loaded when needed.
6. **Argv resolution.** `hV$(yV$(config, q8H.resolve))` — `yV$` runs `path.resolve` over each path arg, then `hV$` flattens.
7. **Defaults coercion.** `gg4` (called via the `dispatchDefaults` parameter inside `ao5`).
8. **Mount.** `await z(w, { cwdFilter, dispatchExtraArgs, dispatchDefaults })` — `z` is `mountFleetView`.
9. **Tear-down.** `await RK(0, "other", { suppressResumeHint: !0 })` — process-exit shim that flushes telemetry and disposes.

---

## Edge Cases

### Inline JSON for `--settings` / `--mcp-config`

`yV$` (the resolver) has special-case logic:
```javascript
let q = (K, _) => (K === "" || (_ && K.trimStart().startsWith("{")) ? K : $(K));
```

`$` is `path.resolve`. The wrapper keeps two values out of `path.resolve`'s hands:

- Empty strings (treated as "unset").
- For flags that allow JSON literals (`settings` and `mcpConfig` — the `_` parameter is true), values that look like JSON objects (`"{...}"`) are kept verbatim, **not** resolved as filesystem paths.

`--add-dir` and `--plugin-dir` always pass `_=false`, so they're always treated as paths.

### Repeating Flags

`--add-dir`, `--plugin-dir`, `--mcp-config`, `--plugin-url` are **repeatable**. The Commander option uses a custom reducer:
```javascript
.option("--plugin-dir <path>", "…", (A, z) => [...z, A], [])
```
But the pre-Commander scanner (`Go6`) doesn't use Commander — it just `push`es. Both arrive at the same `[v1, v2, …]` shape. The `Go6` path also handles `--flag=value` (single-token form) by splitting on `=`, which Commander already does natively.

### Conflict Between Dispatch and Per-Session Override

When the user types a task in the agent-view dashboard, they have UI controls for *just for this dispatch* model/effort/permission-mode (the colored chips rendered by `Qg4`). Those override the dispatch defaults — and the user can see them visually, by the color/text of the chips. The override path goes through `Qg4.renderDispatchDefaultsChips`'s state setters; the final argv blends the per-task override **on top of** `OG$` and `qg6(defaults)`.

The precedence is: per-task user input > `dispatchDefaults` (`--model` etc. on `claude agents` CLI) > nothing.

### `--strict-mcp-config` Compatibility

When `--strict-mcp-config` is paired with `--mcp-config <files>` on the agent-view CLI, the resulting child workers all get **both** flags. Each child then refuses to load any MCP server that didn't come from one of the listed configs. There's also a separate enterprise-policy MCP path: enterprise MCP must come from managed settings and can't be opted out of via `--strict-mcp-config` (see `cli_inner_pretty.js:606577-606581`).

---

## Cross-References to v2.1.112

| v2.1.112 file | v2.1.142 status |
|---------------|-----------------|
| `30_agent_team/spawn_mechanism.md` (in-process / split-pane / tmux backends) | **Unchanged.** Backends are still routed through `n7Y` (kept in v2.1.142 cli_inner_pretty.js as the same in-process router). Agent-view dispatches are a *new* fourth backend (the bg daemon), additive. |
| `30_agent_team/mailbox_protocol.md` | **Unchanged.** Agent-view dispatched workers don't use the mailbox; they use the rv-socket protocol of `--bg` workers. |
| `30_agent_team/permission_sync.md` | **Partially superseded.** Agent-view workers don't talk back to a leader; they run independently. Per-session permission mode comes from `dispatchDefaults`. |
| `30_agent_team/hooks_and_telemetry.md` | **Extended.** New telemetry: `tengu_bg_agent_action`, `tengu_fleetview`, `tengu_fleetview_pr_batch`, `tengu_fleetview_fold_expand`, `tengu_fleetview_fold_shown`. |

---

## Validation

| Claim | Source |
|-------|--------|
| `--add-dir`, `--settings`, `--mcp-config`, `--plugin-dir`, `--permission-mode`, `--model`, `--effort`, `--dangerously-skip-permissions` are all on `claude agents` | cli_inner_pretty.js:607796-607803 |
| `--strict-mcp-config` is added by `Go6` (not by Commander on the `agents` subcommand) | cli_inner_pretty.js:87-89 |
| The dispatch defaults are gated by `gg4` before reaching the dashboard | cli_inner_pretty.js:569094, 565469-565478 |
| The extras are stashed in `OG$` and re-applied to every spawn | cli_inner_pretty.js:509767, 509790, 509899-509900 |
| The agent view requires `isTTY` | cli_inner_pretty.js:607805 |

---

## Companion: Identity Propagation Across the Spawn

Dispatch flags carry *configuration* into the bg worker (argv → settings).
They do **not** carry the *running agent's identity* (`agentId`,
`parentAgentId`) — that channel is the v2.1.139+ `x-claude-code-agent-id`
header pair driven by `AsyncLocalStorage` inside the process, and (across
the worker fork) by `CLAUDE_AMBIENT_PARENT_SESSION_ID` in env.

For interactive subagent spawns (within the agent-view *dispatcher* itself,
not the dispatched workers), the dispatcher's session id surfaces as
`parentSessionId` on each worker's first telemetry span — see
`agent_identity_propagation.md`. This is why a worker dispatched by
`claude agents` shows up in OTel with `parentSessionId` even when no `--bg`
identity header is on its API requests yet.
