# `/fork` and `/subtask` as commands: two descriptors, one gate

**Module:** `43_slash_commands` (part 1 of 3 — see [`README.md`](README.md))
**Target bundle:** `/lyz/codespace/claude-code-bomb/versions/2.1.220/extract/cli_inner_pretty.js` (872,596 lines)
**Baseline:** `…/2.1.193/extract/cli_inner_pretty.js` — every count below is `220=N / 193=M`

> **Boundary.** [`36_background_agents/fork_to_background_session.md`](../36_background_agents/fork_to_background_session.md)
> owns the *background-session mechanics* of `/fork`: the transcript snapshot, live-parent protection,
> the lineage record, worktree relocation, and the agent-view row. **This document owns the two commands
> as registry entries**: how many descriptors exist, which one you actually get, how their arguments are
> parsed, where the handler code is loaded from, and which of the "new" flags in the asset diff are
> really ours.

---

## 0. The headline the changelog does not tell you: `/fork` has **two** descriptors in 2.1.220

`.212 #1` reads *"`/fork` copies the conversation into a new background session; the old behaviour moved to
`/subtask`."* True — but incomplete. **Both `/fork` implementations ship in 2.1.220 and a runtime predicate
picks between them.**

| literal | 220 | 193 |
|---|---|---|
| `name: "fork"` | **2** | 1 |
| `name: "subtask"` | **1** | 0 |
| `Spawn a background agent that inherits the full conversation` (old description) | 1 | 1 |
| `Copy this conversation into a new background session and keep working here` | 1 | **0** |
| `Send a subagent off with your full context; its result comes back here` | 1 | **0** |
| `Usage: /fork` | 1 | 1 |
| `Usage: /subtask` | 1 | **0** |

The three descriptors, read verbatim:

```javascript
// ============================================
// forkCommandLegacyDescriptor / forkCommandDescriptor / subtaskCommandDescriptor
// Location: cli_inner_pretty.js:500525-500579
// ============================================

// ORIGINAL (for source lookup):
  pJd = {                                                       // :500525  LEGACY
    type: "local-jsx", name: "fork",
    description: "Spawn a background agent that inherits the full conversation",
    argumentHint: "<directive>",
    isEnabled: () => !F_(),
    load: () => Promise.resolve().then(() => (dJd(), uJd)),
  };
  mJd = {                                                       // :500537  NEW
    type: "local-jsx", name: "fork",
    description: "Copy this conversation into a new background session and keep working here",
    argumentHint: "[prompt]",
    isEnabled: () => !F_(),
  };
  _Jd = {                                                       // :500572  NEW
    type: "local-jsx", name: "subtask",
    description: "Send a subagent off with your full context; its result comes back here",
    argumentHint: "<task>",
    isEnabled: () => !F_(),
    load: () => Promise.resolve().then(() => (yJd(), gJd)),
  };

// READABLE (for understanding):
  forkCommandLegacyDescriptor = {
    type: "local-jsx", name: "fork",
    description: "Spawn a background agent that inherits the full conversation",
    argumentHint: "<directive>",                                // REQUIRED argument
    isEnabled: () => !isCoordinatorMode(),
    load: () => import("./fork-legacy-handler"),                // handler = legacyForkCommandCall
  };
  forkCommandDescriptor = {
    type: "local-jsx", name: "fork",
    description: "Copy this conversation into a new background session and keep working here",
    argumentHint: "[prompt]",                                   // OPTIONAL argument
    isEnabled: () => !isCoordinatorMode(),
    // NO load — resolved through the central lazy-loader table (§2)
  };
  subtaskCommandDescriptor = {
    type: "local-jsx", name: "subtask",
    description: "Send a subagent off with your full context; its result comes back here",
    argumentHint: "<task>",                                     // REQUIRED argument
    isEnabled: () => !isCoordinatorMode(),
    load: () => import("./subtask-handler"),                    // handler = subtaskCommandCall
  };

// Mapping: pJd→forkCommandLegacyDescriptor, mJd→forkCommandDescriptor, _Jd→subtaskCommandDescriptor,
//          F_→isCoordinatorMode, uJd/gJd→handler modules, dJd/yJd→their module initialisers
```

### The registry line that chooses

```javascript
// ============================================
// builtinSlashCommandRegistry - the fork/subtask fork-in-the-road
// Location: cli_inner_pretty.js:507179-507186
// ============================================

// ORIGINAL (for source lookup):
    (H_r = Vr(() => [
      oLu, p6s, SJd, a$d, f2s, iNd,
      ...(NP() && !Yt(Z.IS_DEMO) ? [mJd, _Jd] : [pJd]),
      sJd, m2s, _$d, uQd, $Do, …

// READABLE (for understanding):
    builtinSlashCommandRegistry = memoise(() => [
      …,
      ...(isAgentsFleetEnabled() && !parseBool(env.IS_DEMO)
            ? [forkCommandDescriptor, subtaskCommandDescriptor]   // NEW pair
            : [forkCommandLegacyDescriptor]),                     // OLD single
      …

// Mapping: H_r→builtinSlashCommandRegistry, Vr→memoise, NP→isAgentsFleetEnabled, Yt→parseBool
```

Compare 2.1.193, where the single `/fork` descriptor `G3l` sat in the list unconditionally
(`cli_inner_pretty.js:581451 (193)`, descriptor at `:550847 (193)`).

### The gate

```javascript
// ============================================
// isAgentsFleetEnabled / fleetGateRejectedReason
// Location: cli_inner_pretty.js:157244-157251, 157277-157279
// ============================================

// ORIGINAL (for source lookup):
function Zer() { return uJi() !== null; }
function uJi() {
  if (Yt(process.env.CLAUDE_CODE_DISABLE_AGENT_VIEW)) return "is disabled by CLAUDE_CODE_DISABLE_AGENT_VIEW";
  if (SI()?.settings.disableAgentView === !0) return "is disabled by the 'disableAgentView' setting";
  return null;
}
function NP() { return !Zer(); }

// READABLE (for understanding):
function isFleetGateRejected() { return fleetGateRejectedReason() !== null; }
function fleetGateRejectedReason() {
  if (parseBool(process.env.CLAUDE_CODE_DISABLE_AGENT_VIEW)) return "is disabled by CLAUDE_CODE_DISABLE_AGENT_VIEW";
  if (getSettings()?.settings.disableAgentView === true) return "is disabled by the 'disableAgentView' setting";
  return null;
}
function isAgentsFleetEnabled() { return !isFleetGateRejected(); }

// Mapping: Zer→isFleetGateRejected, uJi→fleetGateRejectedReason, NP→isAgentsFleetEnabled, SI→getSettings
```

Counts: `CLAUDE_CODE_DISABLE_AGENT_VIEW` 220=4 / 193=3, `disableAgentView` 220=2 / 193=2 — **the gate itself
is carryover**; what is new is *this* consumer of it at `:507186`.

### The decision, in depth

**What it does:** decides, once per process, whether the user's `/fork` is "copy the conversation into a
sibling background session" (`.212` semantics) or "spawn an in-conversation subagent" (`.211`-and-earlier
semantics), and whether `/subtask` exists at all.

**How it works:**
1. `H_r` is a `Vr(...)`-memoised thunk, so the branch is evaluated at most once per process. Toggling
   `disableAgentView` mid-session does **not** re-shape the command list.
2. `NP()` returns false when either `CLAUDE_CODE_DISABLE_AGENT_VIEW` is truthy or
   `settings.disableAgentView === true`. Note the settings read goes through `SI()` — the *fast-path*
   settings snapshot — so this is resolvable before the full settings cascade loads.
3. `Yt(Z.IS_DEMO)` is an additional veto: demo builds keep the old `/fork`.
4. On the false branch the user gets exactly one descriptor and `/subtask` is **absent from the slash
   menu, from tab-completion, and from `Cv()` name resolution** (`:346396`), so typing `/subtask` produces
   the unknown-command path, not a disabled-command notice.

**Why this approach:**
- The new `/fork` *requires* a background session, which requires the daemon, the roster, and the agent
  view. Someone who has switched all of that off with `disableAgentView` would get a `/fork` that can only
  fail. Rather than add a sixth entry to the refusal ladder
  ([`36_background_agents/fork_to_background_session.md`](../36_background_agents/fork_to_background_session.md) §7),
  the command is swapped for one that still works.
- The cost is a **silent semantic divergence**: two users on the same build can type `/fork` and get
  categorically different behaviour, with no notice explaining why. The descriptions differ, so the slash
  menu is honest, but nothing says "you are on the legacy variant".
- Shipping both bodies costs ~40 lines of dead code on either branch. Cheap insurance, and it means the
  `.212` change is *revertible by an environment variable* — a useful property for a release that
  changed the meaning of an existing command.

**Key insight:** the changelog describes a rename (`/fork` → `/subtask`), but the code implements a
**conditional swap**. `Usage: /fork \<directive\>` is still reachable in 2.1.220 (`:500502`), which is why
counting `fork` literals cannot resolve this bullet — a point
[`fork_to_background_session.md`](../36_background_agents/fork_to_background_session.md) §0 also makes from
the handler side.

---

## 1. The handlers: a byte-level move, and where the new one lives

`/subtask`'s handler `NL_` (`:500547-500562`) and the legacy `/fork` handler `$L_` (`:500500-500515`) are
**the same function with three strings swapped**, and both call the same spawner `Lpn`
(`spawnForkFromDirective`, `:500337`, exported by name at `:500336`):

```javascript
// ============================================
// legacyForkCommandCall vs subtaskCommandCall - identical bodies, different copy
// Location: cli_inner_pretty.js:500500-500515 and :500547-500562
// ============================================

// ORIGINAL (for source lookup):
var $L_ = async (e, t, r) => {                                            // :500500  /fork (legacy)
  let n = r.trim();
  if (!n) return (e("Usage: /fork \\<directive\\>", { display: "system" }), null);
  let o = await Lpn(n, t, t.canUseTool ?? cM);
  if (!o) return (e(F_() ? "Forking is not available in coordinator sessions. Use /branch instead."
                         : "Cannot fork before the first conversation turn", { display: "system" }), null);
  return (e(`${NO} forked ${o.name} (${o.agentId.slice(-4)})`, { display: "system" }), null);
};
var NL_ = async (e, t, r) => {                                            // :500547  /subtask
  let n = r.trim();
  if (!n) return (e("Usage: /subtask \\<task\\>", { display: "system" }), null);
  let o = await Lpn(n, t, t.canUseTool ?? cM);
  if (!o) return (e(F_() ? "Subtasks are not available in coordinator sessions. Use /branch instead."
                         : "Cannot start a subtask before the first conversation turn", { display: "system" }), null);
  return (e(`${NO} forked ${o.name} (${o.agentId.slice(-4)})`, { display: "system" }), null);
};

// READABLE (for understanding):
const legacyForkCommandCall = async (emit, toolUseContext, rawArgs) => {
  const directive = rawArgs.trim();
  if (!directive) return (emit("Usage: /fork \\<directive\\>", { display: "system" }), null);
  const spawned = await spawnForkFromDirective(directive, toolUseContext, toolUseContext.canUseTool ?? defaultCanUseTool);
  if (!spawned) return (emit(isCoordinatorMode() ? FORK_COORDINATOR_REFUSAL : "Cannot fork before the first conversation turn",
                             { display: "system" }), null);
  return (emit(`${FORK_GLYPH} forked ${spawned.name} (${spawned.agentId.slice(-4)})`, { display: "system" }), null);
};
// subtaskCommandCall is the same body with "/subtask \<task>" / "Subtasks are not available…" /
// "Cannot start a subtask before the first conversation turn".

// Mapping: $L_→legacyForkCommandCall, NL_→subtaskCommandCall, Lpn→spawnForkFromDirective,
//          F_→isCoordinatorMode, cM→defaultCanUseTool, NO→FORK_GLYPH (U+2442, :58422)
```

Note the tell in both messages: the confirmation still says **`forked`**, not `subtasked`. The rename was
applied to the command surface and the refusals, not to the success line.

### Where the *new* `/fork` handler comes from — the lazy-loader table

`mJd` has **no `load` thunk**. In 2.1.193 that would have been fatal: the local-jsx executor read
`y.load` and nothing else. 2.1.220 added a fallback.

```javascript
// ============================================
// resolveLocalJsxCommandLoader - name→module fallback for local-jsx descriptors without `load`
// Location: cli_inner_pretty.js:735719-735725, table at :735728-735808
// ============================================

// ORIGINAL (for source lookup):
function KIn(e) {
  if (e.type !== "local-jsx") return;
  return e.load ?? (Object.hasOwn(O7a, e.name) ? O7a[e.name] : void 0);
}
function oai(e) { return `/${Sd(e)} is currently unavailable.`; }
…
  ((O7a = {
    "add-dir": () => Promise.resolve().then(() => (r7p(), e7p)),
    …
    fork: () => Promise.resolve().then(() => (T_f(), A_f)),          // :735751
    …
  }), (R9H = new Set(Object.keys(O7a))));

// READABLE (for understanding):
function resolveLocalJsxCommandLoader(command) {
  if (command.type !== "local-jsx") return undefined;
  return command.load ?? (Object.hasOwn(LOCAL_JSX_LOADERS, command.name) ? LOCAL_JSX_LOADERS[command.name] : undefined);
}
function commandUnavailableMessage(command) { return `/${commandDisplayName(command)} is currently unavailable.`; }

// Mapping: KIn→resolveLocalJsxCommandLoader, O7a→LOCAL_JSX_LOADERS, R9H→LOCAL_JSX_LOADER_NAMES,
//          oai→commandUnavailableMessage, Sd→commandDisplayName, A_f→forkCommandModule (:695431)
```

The table is injected into the executor as an option, not imported:

```javascript
// :822408    resolveCommandDialog: KIn,
// :343598    T = y.load ?? n.options.resolveCommandDialog?.(y);
// :343599-343602
//            if (!T) { (pe(_, "cmd_local_jsx_no_dialog_resolution"), E(Jdd(y, t))); return; }
```

`resolveCommandDialog` is **220=2 / 193=0**; the failure telemetry
`cmd_local_jsx_no_dialog_resolution` is **220=3 / 193=0**. The `case "local":` arm one screen below
(`:343627`) still calls `y.load()` directly, so **only `local-jsx` gained the fallback**.

**Why a central table instead of a `load` on the descriptor?** The descriptor for the new `/fork` lives in
the *command-registry* module (`:500534-500544`), but the implementation lives in the *agent-view /
background* module (`A_f`, `:695431`). A direct `load` thunk would have created a static import edge from
the registry into the background subsystem, which is exactly the edge the registry module exists to avoid —
the registry is evaluated during startup fast-path, the background module is not. Threading the loader
table through `toolUseContext.options.resolveCommandDialog` keeps the registry a pure data module and lets
the *host* decide what a command name resolves to. That indirection is also what makes a **host without the
table** (the agent view, remote control) degrade to `cmd_local_jsx_no_dialog_resolution` plus
`/x is currently unavailable.` instead of crashing.

---

## 2. Argument handling: `<directive>` → `[prompt]`, and what "optional" buys

| | legacy `/fork` | new `/fork` | `/subtask` |
|---|---|---|---|
| `argumentHint` | `<directive>` | `[prompt]` | `<task>` |
| empty argument | `Usage: /fork \<directive\>` (`:500502`) | **valid** — parks a named copy waiting for a prompt | `Usage: /subtask \<task\>` (`:500549`) |
| refusal on no history | `Cannot fork before the first conversation turn` | `Nothing to fork yet. Send a message first.` (`:695548`, 220=1/193=0) | `Cannot start a subtask before the first conversation turn` |

The bracket/angle convention is not decoration — it is the only machine-readable statement of arity a
descriptor carries, and it is surfaced verbatim in the slash menu. The new `/fork` had to become
`[prompt]` because a prompt-less fork is meaningful: the copy is created, named after the parent, and sits
in the agent view showing `send a prompt to start`.

### The two name derivations, side by side

There are **two different** "name this thing after the user's words" functions in this area and they are
easy to confuse:

```javascript
// ============================================
// deriveSubtaskAgentName - kebab slug for the /subtask agent (NOT the /fork session name)
// Location: cli_inner_pretty.js:500461-500474 (exported as deriveForkName at :500336)
// ============================================

// ORIGINAL (for source lookup):
function lJd(e) {
  return (
    e.trim().split(/\s+/).slice(0, 3).join("-").toLowerCase()
      .replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "")
      .slice(0, 24) || "fork"
  );
}

// READABLE (for understanding):
function deriveSubtaskAgentName(directive) {
  return (
    directive.trim()
      .split(/\s+/).slice(0, 3)          // first three words
      .join("-").toLowerCase()
      .replace(/[^a-z0-9-]/g, "")        // strip everything but [a-z0-9-]
      .replace(/-+/g, "-")               // collapse runs
      .replace(/^-|-$/g, "")             // trim edge hyphens
      .slice(0, 24) || "fork"            // hard cap, fallback literal
  );
}

// Mapping: lJd→deriveSubtaskAgentName (exported name: deriveForkName), e→directive
```

`deriveForkName` is **220=1 / 193=1** — pure carryover, and it belongs to the *subagent* path. It produces
an identifier-shaped slug (`fix-the-login-bug`) because the result is passed to
`agentLifecycle.registerName(s, …)` at `:500375` and is used to address the agent.

The `.212 #39` bullet ("`/fork` names the copy after your prompt when the session has no title") is the
**other** one — `<parent name> ⑂ <prompt≤60>` at `:683674-683676`, human-readable, inside the background
spawner. It is analysed in
[`36_background_agents/fork_to_background_session.md`](../36_background_agents/fork_to_background_session.md) §4.
Two functions, two naming schemes, two purposes:

| | `deriveSubtaskAgentName` (`lJd`) | fork session name (`:683674`) |
|---|---|---|
| consumer | agent registry / `SendMessage` addressing | agent-view row label |
| shape | `kebab-slug`, ≤24 chars, `[a-z0-9-]` only | `Parent ⑂ prompt`, ≤60 chars of prompt, free text |
| words used | first 3 | as many as fit |
| fallback | `"fork"` | parent name, else the seed's own name |
| status in this window | carryover 1/1 | net-new |

---

## 3. `--fork-name` is **not** a Claude Code flag — confirmed independently

The seed brief, the scoping pass and `_raw_asset_diff_193_to_220.md` all list `--fork-name` as a new CLI
flag and a candidate anchor for `.212 #39`. It is neither. Re-reading `:443137-443144` in the 2.1.220
bundle:

```javascript
// :443137-443144  — inside the auto-mode command-analysis rule table
(Fo_ = new RegExp(
  String.raw`\bgh\s+(pr\s+create|pr\s+merge|pr\s+comment|issue\s+create|issue\s+comment|release\s+create|release\s+upload|repo\s+fork)\b${No_}`,
  "g",
)),
…
((Xo_ = new Set(["--org", "--fork-name", "--remote-name"])), (Jo_ = /^[A-Za-z0-9._-]+$/));
```

`--org`, `--fork-name` and `--remote-name` are the three value-taking options of **`gh repo fork`**. The set
exists so the shell-command analyser knows which tokens consume the following argument. All three are
"new" only because the `repo\s+fork` alternative in that regex is new.

The flag Claude Code actually uses for fork-adjacent behaviour is `--fork-session`, which is **12/12
carryover** (`:547934`, `:553384`, `:683739`, `:851183`, …).

This is the same conclusion
[`fork_to_background_session.md`](../36_background_agents/fork_to_background_session.md) §8 reached from
the background side; I re-derived it here because it is the cleanest example in this module of an
asset-diff row that is a *false* CLI-flag delta. §4 of
[`command_and_flag_deltas.md`](command_and_flag_deltas.md) generalises the finding to the whole 51-flag list.

---

## 4. What `/subtask` inherits and why it is cheap to verify

`Lpn` (`spawnForkFromDirective`, `:500337-500446`) is 2.1.193's `/fork` spawner. The parts worth naming
because they explain what `/subtask` *is*:

| line | what it does | why it matters for the command surface |
|---|---|---|
| `:500338` | refuses if `getAppState().endedByModel` (`subagent_fork_ended_by_model`) | a session the model ended cannot spawn subtasks |
| `:500339` | refuses in coordinator mode (`subagent_fork_coordinator_mode`) | this is the refusal the handler turns into `Use /branch instead.` |
| `:500340-500343` | reuses `renderedSystemPrompt`, else rebuilds it via `OL_` | the subtask gets the *parent's* system prompt, not a subagent template |
| `:500344-500352` | `{ kind: "fork", log: … }` replay hydration | the subtask replays the parent's REPL log, which is what "your full context" means |
| `:500354-500356` | `s = deriveForkName(directive)`, `l` = directive collapsed and truncated at 50 (`+ …`) | name vs description are derived separately |
| `:500361` | `spawnDepth = DI(agentContext) + 1` | subtasks count against `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` (see [`53_subagent_limits`](../53_subagent_limits/)) |
| `:500395` | `isBackgroundAgent: !0` on the agent context | a `/subtask` is a *background subagent*, not a background *session* — the distinction the two commands now encode |
| `:500401` | `taskRegistry.takeConcurrencySlot()` | subtasks consume `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` |

So the split is real at the plumbing level too: `/subtask` goes through the **task registry and the
subagent caps**; `/fork` goes through the **daemon and the session roster**. They are not two front-ends
onto one mechanism.

---

## 5. Carryover and false anchors in this document's scope

| claim | verdict | evidence |
|---|---|---|
| `--fork-name` is a new Claude Code flag | **FALSE** | `gh repo fork` flag set `:443144`; ours is `--fork-session` 12/12 |
| `deriveForkName` is new | **CARRYOVER** | 220=1 / 193=1, `:500336` |
| `Usage: /fork` was removed | **FALSE** | 220=1 / 193=1, still live at `:500502` on the legacy branch |
| `Cannot fork before the first conversation turn` is gone | **FALSE** | 220=2 / 193=2 |
| slash-command `aliases` resolution is new | **CARRYOVER** | `aliases?.includes(t)` at `:224020` / `:346394`; 193 twins `:151096` / `:581167` |
| `isEnabled: () => !F_()` (coordinator veto) is new on `/fork` | **CARRYOVER** | present on 193's `G3l` at `:550851 (193)` as `isEnabled: () => !gv()` |
| the *registry ternary* at `:507186` | **NET-NEW** | 193 listed `G3l` unconditionally at `:581451 (193)` |
| `resolveCommandDialog` / the `O7a` loader table | **NET-NEW** | 220=2 / 193=0 and 220=4 / 193=0 respectively |

---

## 6. Not covered

- `Task(subagent_type: "fork")` — the tool-level fork that `/subtask` drives. Owned by
  [`04_tools`](../04_tools/) / [`53_subagent_limits`](../53_subagent_limits/).
- The body of `A_f` / `KYb` (`:695431`, `:695530`) — the new `/fork` handler and its five-guard refusal
  ladder. Owned by
  [`36_background_agents/fork_to_background_session.md`](../36_background_agents/fork_to_background_session.md) §7.
- The full 130-entry `O7a` loader table: I read the `fork` row and spot-checked ~50 others but did not
  diff the table against 2.1.193's per-descriptor `load` thunks entry by entry, so I cannot say how many
  descriptors *lost* their own `load`.
- `IS_DEMO` — I did not trace what a demo build is or how it is provisioned; I only note it as the second
  veto on the ternary.

---

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
>
> New symbols from this document are staged in
> [symbol_additions_v2_1_220_slash_cli.md](../00_overview/symbol_additions_v2_1_220_slash_cli.md).

Key functions in this document:
- `builtinSlashCommandRegistry` (`H_r`, `:507179`) - memoised descriptor list; the fork/subtask ternary is at `:507186`
- `forkCommandDescriptor` (`mJd`, `:500537`) - new `/fork`, `argumentHint: "[prompt]"`, no `load`
- `forkCommandLegacyDescriptor` (`pJd`, `:500525`) - old `/fork`, kept for the gate-off branch
- `subtaskCommandDescriptor` (`_Jd`, `:500572`) - new `/subtask`, `argumentHint: "<task>"`
- `subtaskCommandCall` (`NL_`, `:500547`) - byte-equivalent to 2.1.193's `/fork` handler
- `legacyForkCommandCall` (`$L_`, `:500500`) - the still-shipping old handler
- `spawnForkFromDirective` (`Lpn`, `:500337`) - shared subagent spawner for both
- `deriveSubtaskAgentName` (`lJd`, `:500461`) - 3-word kebab slug, ≤24 chars, exported as `deriveForkName`
- `isAgentsFleetEnabled` (`NP`, `:157277`) - `!fleetGateRejectedReason()`
- `fleetGateRejectedReason` (`uJi`, `:157247`) - env var or `disableAgentView` setting
- `resolveLocalJsxCommandLoader` (`KIn`, `:735719`) - `load ?? LOCAL_JSX_LOADERS[name]`
- `LOCAL_JSX_LOADERS` (`O7a`, `:735728`) - central name→module lazy-loader table
- `commandUnavailableMessage` (`oai`, `:735723`) - `/x is currently unavailable.`
- `resolveCommandByName` (`Cv`, `:346396`) - exact-name first, then alias/display-name
- `matchesCommandNameOrAlias` (`qNy`, `:346394`) - name / userFacingName / aliases
