# Implicit Session Team & Agent-Tool Teammate Spawn (v2.1.156 → v2.1.183)

## TL;DR

This is the **centerpiece of the v2.1.178 agent-team redesign**, which lands in the v2.1.183 bundle. In v2.1.156 a "team" was an explicit, model-created object: the model called the `TeamCreate` tool, which wrote the team file, created the task list, registered the leader, and stored `teamContext` in app state — and the model spawned teammates by passing a `team_name` parameter to the **Agent** tool. In v2.1.183 **`TeamCreate` and `TeamDelete` are gone entirely** (grep = 0 in the bundle), and the team is instead created **implicitly at CLI startup** by `initializeSessionTeam` (obfuscated: `j3f`, `cli_inner_pretty.js:682765`). Every interactive session that has agent-swarms enabled now silently boots with exactly one team named `session-<sessionId[:8]>` (`sessionTeamName`, obfuscated: `xic`, `:682752`), whose only initial member is the leader (`team-lead`).

The teammate-spawn routing inside the Agent tool changed accordingly. v2.1.156's predicate was "*did the model give me a `team_name` that resolves to a team?*" (`let G = oN_({team_name:A}, L); if (G && z) …`). v2.1.183's predicate is "*does the session already have an implicit team, and did the model give me a non-empty `name`, and is this not a fork?*" — `let _ = Sl() ? A.teamContext : void 0; … if (_ && s && !L) …` (`cli_inner_pretty.js:423548`, `:423573`). The `team_name` parameter still exists in the schema, but its description is now literally **"Deprecated; ignored. The session has a single implicit team."** (`:423458`). When the predicate fires, the call routes into `cqa` → `HDp` (`:423053` / `:423041`), the dispatcher that picks in-process (`sqa`) vs splitpane (`SDp`) vs non-splitpane (`EDp`) spawning. A new reserved name `"main"` (`LY`, `:362512`) is refused by the `name` schema because SendMessage now routes `"main"` to the main conversation.

> Scope: this doc covers the **implicit-team bootstrap** and the **Agent-tool spawn routing rewrite** only. The carried-over file mailbox, the teammate system-prompt addendum, the permission bridge, and the backend-registry two-mode split are unchanged in structure and are linked (not re-derived) to the v2.1.156 baseline. The tmux `send-keys`→`respawn-pane` spawn fix lives in the sibling `spawn_backends_and_tmux_fix.md`; the SendMessage prompt rewrite and lifecycle-tool removal live in `mailbox_lifecycle_and_sendmessage_delta.md`; coordinator + background-task survival live in `coordinator_and_background_survival.md`.

---

## 0. The before-picture: how a team was born in v2.1.156

To see what changed you have to hold the v2.1.156 model clearly. There, a team did not exist until the model *asked for one*. The flow was three explicit model actions:

1. **`TeamCreate({team_name, description?, agent_type?})`** — the model picks a name, the tool writes the team file, initializes the matching task list, registers the leader as the sole member, and stores `teamContext = { teamName, leadAgentId, teammates }` in app state. This is documented in the v2.1.156 baseline `mailbox_and_lifecycle_tools.md` §4.1 ([baseline doc](../../../claude_code_v_2.1.156/analyze/30_agent_team/mailbox_and_lifecycle_tools.md)); the `call` mutation is at v2.1.156 `cli_inner_pretty.js:406662`.
2. **`Agent({ name, team_name, prompt, … })`** — to spawn a teammate, the model passed the *same* `team_name` it had created, plus a `name` for the teammate. The Agent tool resolved the team name and, if a team was resolved and a `name` given, routed into the teammate-spawn path.
3. **`TeamDelete()`** — to tear the team down (refused while teammates were still active).

The pivot point was `resolveTeamName` (obfuscated: `oN_`, v2.1.156 `cli_inner_pretty.js:398190`):

```javascript
// ============================================
// resolveTeamName (v2.1.156 BEFORE-PICTURE) - resolve the team for an Agent spawn
// Location (v2.1.156): cli_inner_pretty.js:398190-398193
// ============================================

// ORIGINAL (for source lookup):
function oN_(H, $) {
  if (!R7()) return;
  return H.team_name || $.teamContext?.teamName;
}

// READABLE (for understanding):
function resolveTeamName(args, appState) {
  if (!isAgentTeamsEnabled()) return undefined;     // R7() master gate
  // PREFER the team_name PARAMETER the model passed; fall back to the session's team.
  return args.team_name || appState.teamContext?.teamName;
}

// Mapping (v2.1.156): oN_→resolveTeamName, R7→isAgentTeamsEnabled, H→args, $→appState
```

The key v2.1.156 fact: the **`team_name` parameter took precedence**. The model was *driving* team membership by hand — it created a team with one name and spawned into it with that same name. `teamContext?.teamName` was only the fallback. The Agent `call` then keyed the teammate-vs-subagent decision on that resolved name plus the `name` parameter (`G && z`), at v2.1.156 `cli_inner_pretty.js:398406`:

```javascript
// ============================================
// Agent.call teammate routing (v2.1.156 BEFORE-PICTURE)
// Location (v2.1.156): cli_inner_pretty.js:398386-398425
// ============================================

// ORIGINAL (for source lookup):
if (A && !R7())
  throw (uH("subagent_launch","subagent_teams_unavailable"), Error("Agent Teams is not yet available on your plan."));
let G = oN_({ team_name: A }, L);                 // A = team_name param, L = appState
if (FA() && G && z)
  throw (uH("subagent_launch","subagent_nested_teammate"), Error("Teammates cannot spawn other teammates …"));
if (mG() && G && _ === !0)
  throw (uH("subagent_launch","subagent_teammate_background_denied"), Error("In-process teammates cannot spawn background agents. …"));
if (G && z) {                                     // resolved-team-name AND name  ⇒ TEAMMATE
  let AH = $ ? M.options.agentDefinitions.activeAgents.find((YH) => YH.agentType === $) : void 0;
  if (AH?.color) SDH($, AH.color);
  let fH = await aA4({ name: z, prompt: H, description: q, team_name: G, use_splitpane: !0,
                       plan_mode_required: Y === "plan", model: X ?? (AH ? D5H(AH) : void 0),
                       agent_type: $, invokingRequestId: w?.requestId }, M),
      qH = { status: "teammate_spawned", prompt: H, ...fH.data };
  return (SH("subagent_launch"), { data: qH });
}

// READABLE (for understanding):
if (team_name && !isAgentTeamsEnabled())
  throw new Error("Agent Teams is not yet available on your plan.");           // explicit plan-availability gate
let resolvedTeam = resolveTeamName({ team_name }, appState);                    // PARAM wins over teamContext
if (isTeammate() && resolvedTeam && name)
  throw new Error("Teammates cannot spawn other teammates — the team roster is flat. …");
if (isInProcessTeammate() && resolvedTeam && run_in_background === true)
  throw new Error("In-process teammates cannot spawn background agents. …");
if (resolvedTeam && name) {                                                     // KEY: resolved-team + name ⇒ spawn teammate
  let def = subagent_type ? findActiveAgent(subagent_type) : undefined;
  if (def?.color) registerAgentColor(subagent_type, def.color);
  let spawned = await spawnTeammate({ name, prompt, description, team_name: resolvedTeam,
                                      use_splitpane: true, plan_mode_required: mode === "plan",
                                      model: modelOverride ?? (def ? resolveAgentModel(def) : undefined),
                                      agent_type: subagent_type, invokingRequestId: requestId }, ctx);
  return { data: { status: "teammate_spawned", prompt, ...spawned.data } };
}

// Mapping (v2.1.156): A→team_name(param), z→name(param), L→appState, G→resolvedTeam, oN_→resolveTeamName,
//   R7→isAgentTeamsEnabled, FA→isTeammate, mG→isInProcessTeammate, aA4→spawnTeammate, _→run_in_background,
//   Y→mode, $→subagent_type, X→modelOverride, D5H→resolveAgentModel, SDH→registerAgentColor, uH→Me(telemetry)
```

Hold onto two things from this: (a) the routing key is `resolvedTeam = team_name || teamContext.teamName` with the **parameter first**; (b) `spawnTeammate` (`aA4`) was passed an explicit `team_name: resolvedTeam`. Both of those disappear in v2.1.183. Note also that the v2.1.156 Agent `call` already destructured `name`, `team_name`, **and** `mode` (v2.1.156 `cli_inner_pretty.js:398362-398373`), so the *parameter set* did not change in v2.1.183 — only the routing semantics and the parameter descriptions did (this answers dossier open-question #2: `mode` is **not** new).

---

## 1. The implicit session team: `initializeSessionTeam` at startup

### What it does

`initializeSessionTeam` (obfuscated: `j3f`, `cli_inner_pretty.js:682765`) runs **once, at CLI bootstrap**, for any interactive session with agent-swarms enabled. It deterministically names the team `session-<sessionId[:8]>`, writes the team file (with the leader as the only member), and returns a `teamContext` (plus an initial `teammateColors` map) that the caller seeds into app state. After this runs, `teamContext.teamName` is *always* populated before the model gets a chance to spawn anything — which is exactly what the spawn paths now assume.

### The CLI bootstrap gate

```javascript
// ============================================
// CLI bootstrap: initialize the implicit session team
// Location: cli_inner_pretty.js:693471-693478
// ============================================

// ORIGINAL (for source lookup):
let c;
if (Sl() && !xr() && !a.agentId)
  try {
    let { initializeSessionTeam: Jn } = await Promise.resolve().then(() => (Lic(), kic));
    c = await Jn();
  } catch (Jn) {
    De(Jn);
  }

// READABLE (for understanding):
let initialTeamState;
if (isAgentSwarmsEnabled() && !isNonInteractive() && !cliArgs.agentId)   // gate: swarms on, interactive, NOT a teammate process
  try {
    // lazy-import the implicit-team module (kic) and run it
    let { initializeSessionTeam } = await import("./implicit-team.js");
    initialTeamState = await initializeSessionTeam();                    // seeds teamContext into app state below
  } catch (e) {
    logError(e);                                                        // De(): non-fatal — swarm degrades, REPL still boots
  }

// Mapping: Sl→isAgentSwarmsEnabled, xr→isNonInteractive, a→cliArgs, Jn→initializeSessionTeam,
//   kic→implicit-team module export object, Lic→module init thunk, De→logError, c→initialTeamState
```

**How the three-part gate works** (`Sl() && !xr() && !a.agentId`):

1. **`Sl()` (`isAgentSwarmsEnabled`, `cli_inner_pretty.js:293831`)** — the master gate. Byte-identical to v2.1.156's `R7`: it returns `false` unless `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is set (or the `--agent-teams` flag is present via `yqd()`, `:293828`) AND the GrowthBook flag `tengu_amber_flint` is on. So no team is ever created for users who have not opted in.
   ```javascript
   function Sl() {
     if (!st(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS) && !yqd()) return !1;
     if (!ct("tengu_amber_flint", !0)) return !1;
     return !0;
   }
   ```
2. **`!xr()` (`!isNonInteractive`, `cli_inner_pretty.js:3151`)** — `xr` returns `!Ot.isInteractive`, so `!xr()` means *interactive*. The implicit team is only created in an interactive REPL, not in `--print`/headless mode. A non-interactive run has nobody to drive a team.
3. **`!a.agentId`** — `a.agentId` is the `--agent-id` CLI flag, which is set **only on a spawned teammate's own `claude` process** (see `SDp`'s pane command builder at `cli_inner_pretty.js:422686`, `--agent-id …`). So a teammate sub-process must NOT create its own session team — it inherits the leader's team. This is the recursion guard at the bootstrap layer.

**Why lazy-import + non-fatal `catch`:** the implicit-team module (`kic`/`Lic`) is loaded with `await import()` only when the gate passes, keeping the team machinery off the hot path for the overwhelmingly common no-swarm session. The `catch` swallows the error to `logError` rather than aborting startup — a failed team-file write degrades swarms but must never prevent the REPL from booting. This is a deliberate "team is an enhancement, not a precondition" stance.

### The team builder

```javascript
// ============================================
// initializeSessionTeam - create the implicit session-scoped team at startup
// Location: cli_inner_pretty.js:682765-682815
// ============================================

// ORIGINAL (for source lookup):
async function j3f(e) {
  let t = e?.existingTeamName || F3f(),
    n = t ?? xic(xt()),
    r = bQ(np, n),
    o = gte(n);
  if (!(t ? await Nhe(n) : null)) {
    let l = {
      name: n, createdAt: Date.now(), leadAgentId: r, leadSessionId: xt(),
      members: [{ agentId: r, name: np, agentType: np, joinedAt: Date.now(),
                  tmuxPaneId: "leader", cwd: Ar(), subscriptions: [], backendType: "in-process" }],
    };
    await pBn(n, l).catch((c) => dBn(n, c));
  }
  Dla(n);
  let i = xt();
  if (n !== i) await Iic.rename(WG(i), WG(n)).catch(() => {});
  (await NXr(n), oso(n));
  let a = iy[0];
  return {
    teamContext: {
      teamName: n, teamFilePath: o, leadAgentId: r,
      teammates: { [r]: { name: np, agentType: np, color: a, tmuxSessionName: "in-process",
                          tmuxPaneId: "leader", cwd: Ar(), spawnedAt: Date.now() } },
    },
    teammateColors: { assignments: new Map([[r, a]]), index: 1 },
  };
}

// READABLE (for understanding):
async function initializeSessionTeam(opts) {
  // 1. Pick the team name: an inherited name (teammate sub-process) wins; otherwise derive from session id.
  let inheritedName = opts?.existingTeamName || readInheritedTeamName();      // F3f(): CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME (one-shot)
  let teamName      = inheritedName ?? sessionTeamName(getSessionId());        // xic(xt()) => `session-<id[:8]>`
  let leadAgentId   = formatAgentId(TEAM_LEAD_NAME, teamName);                 // bQ(np, n) => "team-lead@<team>"
  let teamFilePath  = getTeamFilePath(teamName);                              // gte(n)

  // 2. Write the team file ONLY if it does not already exist. For an inherited name we re-read first (Nhe)
  //    so a teammate process does not clobber the leader's already-written file. For a fresh name we always write.
  if (!(inheritedName ? await readTeamFile(teamName) : null)) {
    let teamConfig = {
      name: teamName, createdAt: Date.now(), leadAgentId, leadSessionId: getSessionId(),
      members: [{ agentId: leadAgentId, name: TEAM_LEAD_NAME, agentType: TEAM_LEAD_NAME,
                  joinedAt: Date.now(), tmuxPaneId: "leader", cwd: getCwd(),                 // Ar()
                  subscriptions: [], backendType: "in-process" }],                          // LEADER is the sole member
    };
    await writeTeamFile(teamName, teamConfig).catch((e) => onTeamFileWriteError(teamName, e));   // pBn / dBn
  }

  registerTeamForSession(teamName);                                           // Dla(n): sets active-team var $Xr, emits change
  // 3. If the team name differs from the raw session id, migrate any session-keyed tasks dir to the new name.
  let sessionId = getSessionId();
  if (teamName !== sessionId) await fsp.rename(teamTasksDir(sessionId), teamTasksDir(teamName)).catch(() => {}); // WG = <configDir>/tasks/<team>
  await ensureTeamTasksDir(teamName);                                         // NXr(n): mkdir of teamTasksDir(team)
  recordTeamCreated(teamName);                                               // oso(n): add to orphan-cleanup set

  // 4. Assign the leader the first color in the palette and return the seed teamContext.
  let leaderColor = TEAMMATE_COLOR_PALETTE[0];                                // iy[0]
  return {
    teamContext: {
      teamName, teamFilePath, leadAgentId,
      teammates: { [leadAgentId]: { name: TEAM_LEAD_NAME, agentType: TEAM_LEAD_NAME, color: leaderColor,
                                    tmuxSessionName: "in-process", tmuxPaneId: "leader",
                                    cwd: getCwd(), spawnedAt: Date.now() } },
    },
    teammateColors: { assignments: new Map([[leadAgentId, leaderColor]]), index: 1 },
  };
}

// Mapping: j3f→initializeSessionTeam, F3f→readInheritedTeamName, xic→sessionTeamName, xt→getSessionId,
//   bQ→formatAgentId, np→TEAM_LEAD_NAME ("team-lead"), gte→getTeamFilePath, Nhe→readTeamFile,
//   pBn→writeTeamFile, dBn→onTeamFileWriteError, Ar→getCwd, Dla→registerTeamForSession,
//   WG→teamTasksDir (<configDir>/tasks/<team>), NXr→ensureTeamTasksDir (mkdir of teamTasksDir),
//   oso→recordTeamCreated, iy→TEAMMATE_COLOR_PALETTE, Iic→fs/promises
```

**How it works (step by step):**

1. **Name resolution.** `teamName = inheritedName ?? sessionTeamName(getSessionId())`. The default is `session-<sessionId[:8]>` (see §1.1). The `inheritedName` branch (see §1.2) only fires for a teammate sub-process that was told its parent's team name.
2. **Idempotent write.** For a *fresh* name (no inherited name) the `inheritedName ? await readTeamFile(teamName) : null` short-circuits to `null`, so the `if (!(...))` is always true and the file is written. For an *inherited* name it first re-reads the team file; if it already exists (the leader wrote it), the write is skipped — this prevents a late-starting teammate from racing the leader and overwriting the roster. The write itself is `.catch`-guarded into `onTeamFileWriteError` so a write failure is logged, not thrown.
3. **The roster is leader-only.** The `members` array has exactly one entry: the leader, `name:"team-lead"`, `agentType:"team-lead"`, `tmuxPaneId:"leader"`, `backendType:"in-process"`. No teammates exist yet — they are added lazily by the spawn paths (`sqa`/`SDp`/`EDp`).
4. **Session-dir migration.** `if (teamName !== sessionId) rename(teamTasksDir(sessionId), teamTasksDir(teamName))`, where `teamTasksDir` (`WG` @`:299074`) = `<configDir>/tasks/<team>`. This handles the transition where an earlier code path (or an inherited name) keyed the team's **tasks** directory by raw session id; it best-effort renames it to the canonical team name and swallows failure. Immediately after, `ensureTeamTasksDir` (`NXr` @`:299080`, a `mkdir` of `teamTasksDir(team)`) guarantees the directory exists, and `recordTeamCreated` (`oso` @`:363019`) registers the team in the orphan-cleanup set so a crashed session's team dir can be reaped later.
5. **Returned seed.** `teamContext` carries `teamName`, `teamFilePath`, `leadAgentId`, and a `teammates` map with the leader assigned palette color `iy[0]`. `teammateColors` is the live color-assignment state (`Map([[leadAgentId, color]])`, `index:1`), which the spawn paths extend as they assign colors to new teammates.

**Why this approach:**

- **Determinism over model choice.** In v2.1.156 the model picked the team name, which meant two sessions could collide on the same name, the model could pick a confusing name, and there was no team at all until the model decided to call `TeamCreate`. Deriving the name from the session id (`session-<id[:8]>`) makes the team name unique-per-session, stable for the session's whole life, and present from the first turn. The model no longer has to *manage* a team object — it just spawns named teammates.
- **One team per session, by construction.** The old "Already leading a team" error in `TeamCreate.call` (v2.1.156 `:406669`) is now structurally impossible: there is exactly one team and it is created exactly once. That is why the `team_name` Agent parameter could be demoted to "ignored" — there is nothing to select between.
- **Trade-off:** you lose the ability to have multiple named teams or to delete and recreate a team mid-session (no `TeamDelete`). The redesign judged that the only real use was "this session's swarm", so a single implicit team covers it and removes two tools' worth of model-facing surface and prompt budget.

**Key insight:** The implicit team inverts ownership. v2.1.156: *the model owns the team's existence and name*; the runtime reacts. v2.1.183: *the runtime owns the team*; the model only contributes named teammates. Everything downstream — the `team_name` deprecation, the `if (_ && s && !L)` routing, the "session team not initialized" internal-error guards in the spawn paths — is a consequence of this inversion.

### 1.1 The session-scoped name (`sessionTeamName` / `xic`)

```javascript
// ============================================
// sessionTeamName - deterministic team name from the session id
// Location: cli_inner_pretty.js:682752-682754 (const B3f @682817)
// ============================================

// ORIGINAL (for source lookup):
function xic(e) {
  return `${B3f}-${e.slice(0, 8)}`;
}
// var ... B3f = "session";

// READABLE (for understanding):
function sessionTeamName(sessionId) {
  return `${TEAM_NAME_PREFIX}-${sessionId.slice(0, 8)}`;   // e.g. "session-1a2b3c4d"
}
const TEAM_NAME_PREFIX = "session";

// Mapping: xic→sessionTeamName, B3f→TEAM_NAME_PREFIX ("session"), e→sessionId
```

Slicing `sessionId[:8]` keeps the name short and shell-safe (it ends up on the teammate's `--team-name` CLI flag and in directory paths) while keeping it effectively collision-free for the lifetime of a machine. The prefix `"session"` makes the team's provenance obvious in logs and the teams directory.

### 1.2 Inherited team name (`F3f` / `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME`)

```javascript
// ============================================
// readInheritedTeamName - one-shot env handoff of the parent team name
// Location: cli_inner_pretty.js:682755-682764
// ============================================

// ORIGINAL (for source lookup):
function F3f() {
  if (ZKt() === void 0) {
    let e = process.env.CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME || null;
    (delete process.env.CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME, e7t(e));
  }
  return ZKt() ?? null;
}
function U3f() { e7t(void 0); }      // _resetInheritedTeamNameForTesting

// READABLE (for understanding):
function readInheritedTeamName() {
  if (getCachedInheritedName() === undefined) {                       // ZKt(): module-level cache, read once
    let fromEnv = process.env.CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME || null;
    delete process.env.CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME;           // CONSUME the env var (don't leak to children)
    setCachedInheritedName(fromEnv);                                  // e7t()
  }
  return getCachedInheritedName() ?? null;
}

// Mapping: F3f→readInheritedTeamName, ZKt→getCachedInheritedName, e7t→setCachedInheritedName, U3f→reset(testing)
```

**What it does:** lets a spawned assistant/teammate process inherit its parent's team name instead of minting a fresh one. **How it works:** it reads `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME` from the environment exactly once, caches it at module scope, and **deletes the env var immediately** so the value does not propagate to any grandchild process this session itself spawns. **Why:** the handoff must be one-shot — if the env var leaked, a teammate that later spawns its own sub-processes (e.g. a Bash subshell) could accidentally pass them the team name, polluting their environment. Deleting on read makes the inheritance strictly parent→child and only for the very first read. The dossier flags (open-question #6) that the exact *setter* of this env var was not pinned; the structurally-likely setter is the pane CLI builder that already passes `--team-name` (`SDp` @`:422688`), with the env-var path used for non-flag handoffs such as the in-process/MCP assistant spawn (`G3f` setupComputerUseMCP is right next to it at `:682828`). Confidence on the *mechanism*: high; on *who sets it*: medium.

---

## 2. The Agent-tool spawn routing rewrite

### 2.1 The new routing predicate

The whole decision now hinges on three locals computed at the top of `Agent.call` and one is-fork flag computed just before the branch:

```javascript
// ============================================
// Agent.call - implicit-team teammate routing (v2.1.183)
// Location: cli_inner_pretty.js:423542-423591
// ============================================

// ORIGINAL (for source lookup):
let f = Date.now(),
  m = z9() ? void 0 : r,
  A = c.getAppState(),
  g = Br(c),
  h = g.mode,
  { taskRegistry: y } = c,
  _ = Sl() ? A.teamContext : void 0,
  b = !!c.teammateContext;
if ((b || !!l1e()) && s)
  throw (Me("subagent_launch","subagent_nested_teammate"),
    new oWe("Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter."));
if (b && o === !0)
  throw (Me("subagent_launch","subagent_teammate_background_denied"),
    new oWe("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents."));
let { activeAgents: T, allowedAgentTypes: C } = c.options.agentDefinitions,
  x = t !== void 0 && Yut(t) === _7,
  { available: I, denyRule: k } = gqa(T, C, { toolPermissionContext: g });
if (x && k) throw (Me("subagent_launch","subagent_type_denied"), new r3t(`Agent type '${_7}' has been denied …`));
let L = x && I;
if (_ && s && !L) {
  let de = t ? c.options.agentDefinitions.activeAgents.find((ie) => ie.agentType === t) : void 0;
  if (de?.color) Pke(t, de.color);
  let ye = await cqa({ name: s, prompt: e, description: n, use_splitpane: !0,
                       plan_mode_required: i === "plan",
                       model: m ?? (de ? zhe(de, c.options.mainLoopModel) : void 0),
                       agent_type: t, invokingRequestId: d?.requestId }, c),
      me = { status: "teammate_spawned", prompt: e, ...ye.data };
  return (Le("subagent_launch"), { data: me });
}

// READABLE (for understanding):
let startedAt = Date.now(),
  modelOverride = isCoordinatorMode() ? undefined : requestedModel,        // z9(): coordinator forces inherited model
  appState = ctx.getAppState(),
  permCtx = getToolPermissionContext(ctx),
  permMode = permCtx.mode,
  { taskRegistry } = ctx,
  implicitTeam = isAgentSwarmsEnabled() ? appState.teamContext : undefined, // _: the IMPLICIT team, or undefined
  callerIsTeammate = !!ctx.teammateContext;                                 // b: am I (the caller) a teammate?

// GUARD 1: a teammate (or any in-process teammate per l1e) may not spawn a named teammate — flat roster.
if ((callerIsTeammate || !!getInProcessTeammateContext()) && name)
  throw new Error("Teammates cannot spawn other teammates — the team roster is flat. … omit the `name` parameter.");
// GUARD 2: an in-process teammate may not spawn background agents.
if (callerIsTeammate && run_in_background === true)
  throw new Error("In-process teammates cannot spawn background agents. …");

let { activeAgents, allowedAgentTypes } = ctx.options.agentDefinitions;
let isForkType = subagent_type !== undefined && normalizeAgentType(subagent_type) === FORK_AGENT_TYPE;  // x
let { available, denyRule } = filterAgentsByPermission(activeAgents, allowedAgentTypes, { toolPermissionContext: permCtx });
if (isForkType && denyRule) throw new Error(`Agent type '${FORK_AGENT_TYPE}' has been denied …`);
let isFork = isForkType && available;                                       // L: fork is allowed and requested

// THE ROUTING DECISION: implicit team exists, model gave a name, and this is NOT a fork ⇒ spawn a teammate.
if (implicitTeam && name && !isFork) {
  let def = subagent_type ? findActiveAgent(subagent_type) : undefined;
  if (def?.color) registerAgentColor(subagent_type, def.color);
  let spawned = await spawnTeammate({ name, prompt, description, use_splitpane: true,
                                      plan_mode_required: mode === "plan",
                                      model: modelOverride ?? (def ? resolveAgentModel(def, ctx.options.mainLoopModel) : undefined),
                                      agent_type: subagent_type, invokingRequestId: requestId }, ctx);
  return { data: { status: "teammate_spawned", prompt, ...spawned.data } };
}
// …otherwise fall through to the ordinary subagent / fork path…

// Mapping: _→implicitTeam, s→name, b→callerIsTeammate, L→isFork, x→isForkType, o→run_in_background,
//   t→subagent_type, i→mode, m→modelOverride, r→requestedModel, c→ctx, A→appState,
//   Sl→isAgentSwarmsEnabled, z9→isCoordinatorMode, l1e→getInProcessTeammateContext, cqa→spawnTeammate,
//   gqa→filterAgentsByPermission, Yut→normalizeAgentType, _7→FORK_AGENT_TYPE, zhe→resolveAgentModel,
//   Pke→registerAgentColor, oWe→TeammateSpawnError, r3t→AgentTypeError, Me/Le→telemetry
```

**The three changes vs v2.1.156, side by side:**

| | v2.1.156 | v2.1.183 |
|---|---|---|
| team source | `resolveTeamName({team_name}, appState)` — **param first** | `Sl() ? appState.teamContext : undefined` — **implicit team only** |
| routing predicate | `if (resolvedTeam && name)` | `if (implicitTeam && name && !isFork)` |
| passed to spawn | `team_name: resolvedTeam` (explicit) | *no* `team_name` — the spawn paths read `teamContext.teamName` themselves |

**How the new predicate works (`if (_ && s && !L)`):**

1. **`_` (implicitTeam)** — `Sl() ? A.teamContext : void 0`. This is the implicit team `initializeSessionTeam` seeded at startup. If swarms are off, `_` is `undefined` and the branch can never fire, so every Agent call is an ordinary subagent. If swarms are on, `_` is the session's single `teamContext`. Note the parameter `team_name` is **not consulted at all** here — that is the deprecation made concrete.
2. **`s` (name)** — the teammate's addressable name. A non-empty `name` is the model's signal "I want a persistent, addressable teammate, not a fire-and-forget subagent". An empty `name` ⇒ ordinary subagent even with swarms on.
3. **`!L` (not a fork)** — `L = isForkType && available`. A `subagent_type: "fork"` is mutually exclusive with teammate spawn: a fork inherits the parent's conversation context and runs in the background subagent machinery, which is a different mechanism. So even with a `name` and an implicit team, a fork falls through to the fork path. (v2.1.156 had no explicit `!isFork` in this predicate because the fork logic was structured differently — this is a tightening that makes the teammate/fork boundary explicit.)

When all three hold, it calls `spawnTeammate` (`cqa`) with `use_splitpane: true` and **without** a `team_name` — the dispatcher and the leaf spawners read `getAppState().teamContext.teamName` directly (§2.3). The result is wrapped as `{ status: "teammate_spawned", … }`, identical in shape to v2.1.156.

**Key insight:** the routing key moved from a *model-supplied value that the runtime trusted* (`team_name`) to a *runtime-owned fact* (`teamContext` exists). The model can no longer aim a spawn at a team that does not exist or at the wrong team — there is only one team and the runtime knows which. The `name` parameter is now the *only* model-controlled lever for the teammate-vs-subagent decision.

### 2.2 The schema: `name` (regex + "main" refinement), deprecated `team_name`, `mode`

```javascript
// ============================================
// Agent inputSchema additions - name / team_name / mode (merged onto the base schema)
// Location: cli_inner_pretty.js:423446-423477 (base CDp @423431, regex pDa @362645, LY @362512)
// ============================================

// ORIGINAL (for source lookup):
IDp = we(() => {
  let e = H.object({
    name: H.string()
      .regex(pDa, { message: "name must start with a letter or digit and contain only letters, digits, underscores, or hyphens (max 64 chars)" })
      .refine((t) => t !== LY, { message: `"${LY}" is reserved — SendMessage routes it to the main conversation` })
      .optional()
      .describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running."),
    team_name: H.string().optional().describe("Deprecated; ignored. The session has a single implicit team."),
    mode: zts().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).'),
  });
  return CDp().merge(e).extend({ isolation: …, cwd: … });
});
// var LY = "main";   var pDa = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

// READABLE (for understanding):
const buildAgentInputSchema = memoized(() => {
  const teammateFields = z.object({
    name: z.string()
      .regex(AGENT_NAME_RE, { message: "name must start with a letter or digit and contain only letters, digits, underscores, or hyphens (max 64 chars)" })
      .refine((v) => v !== RESERVED_MAIN_NAME, { message: `"main" is reserved — SendMessage routes it to the main conversation` })
      .optional()
      .describe("Name for the spawned agent. Makes it addressable via SendMessage({to: name}) while running."),
    team_name: z.string().optional().describe("Deprecated; ignored. The session has a single implicit team."),  // <-- DEPRECATED
    mode: permissionModeEnum().optional().describe('Permission mode for spawned teammate (e.g., "plan" to require plan approval).'),
  });
  return baseAgentSchema().merge(teammateFields).extend({ isolation: /*…*/, cwd: /*…*/ });
});
const RESERVED_MAIN_NAME = "main";
const AGENT_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;   // letter/digit start, [A-Za-z0-9_-], max 64 chars

// Mapping: IDp→buildAgentInputSchema, CDp→baseAgentSchema, e→teammateFields, pDa→AGENT_NAME_RE,
//   LY→RESERVED_MAIN_NAME ("main"), zts→permissionModeEnum, H→z (zod), we→memoized
```

Three points of analysis:

- **`name` regex `pDa` (`/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/`, `:362645`).** Must start with a letter/digit, may then contain letters/digits/underscore/hyphen, max 64 chars. This bounds the name so it is safe as a CLI argument, a `SendMessage` recipient, and a sanitized path component for the teammate's inbox file (the mailbox layer also sanitizes, but the schema rejects the obviously-bad up front).
- **`name` refinement: not `"main"` (`LY`, `:362512`).** `"main"` is now a *reserved recipient* — `SendMessage({to:"main"})` routes a message back to the **main conversation** (used by background subagents). So a teammate must not be *named* `"main"`, or the SendMessage routing would be ambiguous. This refinement is entirely new in v2.1.183 (there was no `"main"` recipient in v2.1.156). The same reservation appears in the SendMessage prompt's recipient table (`rza` @`:434286`, documented in the sibling SendMessage delta doc).
- **`team_name` is now documented `"Deprecated; ignored. The session has a single implicit team."`** It is kept in the schema (rather than removed) so that an older model prompt or cached tool-use that still passes `team_name` does not hard-fail validation — it is accepted and silently dropped by the routing (§2.1 never reads it). This is the graceful-deprecation choice: keep the field, ignore the value, document the truth.
- **`mode` (`zts()`, `:53866`) is the permission-mode enum** `["acceptEdits","auto","bypassPermissions","default","dontAsk","plan"]` (`wM` @`:53815`). `mode:"plan"` is the value that maps to `plan_mode_required: mode === "plan"` in the spawn call (§2.1). Per the v2.1.156 destructure (`mode: Y` at v2.1.156 `:398370`), `mode` is **not a new parameter** — it pre-existed; only its *description* (now "Permission mode for spawned teammate") is part of the redesign's wording.

The actually-served schema is `zao()` (`:423478`) = `buildAgentInputSchema().omit({cwd:true})`, further omitting `run_in_background` in restricted contexts.

### 2.3 The dispatcher: `cqa` → `HDp` → `sqa`/`SDp`/`EDp`

```javascript
// ============================================
// HDp - teammate spawn dispatcher (in-process vs splitpane vs non-splitpane)
// Location: cli_inner_pretty.js:423041-423055
// ============================================

// ORIGINAL (for source lookup):
async function HDp(e, t) {
  if (e.prompt && iF(e.prompt)) throw (Me("subagent_launch","subagent_teammate_protocol_frame_prompt"), Error(gUt));
  if (rWe()) return sqa(e, t);
  try { await eLe(); }
  catch (r) {
    if (Aje() !== "auto") throw (Me("subagent_launch","subagent_teammate_pane_unavailable"), r);
    return (v(`[handleSpawn] No pane backend available, falling back to in-process: ${Se(r)}`), Wdo(), sqa(e, t));
  }
  if (e.use_splitpane !== !1) return SDp(e, t);
  return EDp(e, t);
}
async function cqa(e, t) { return HDp(e, t); }

// READABLE (for understanding):
async function handleTeammateSpawn(args, ctx) {
  // Reject if the prompt is itself a protocol frame (a teammate-message envelope) — that would confuse the mailbox.
  if (args.prompt && isProtocolFrame(args.prompt)) throw new Error(PROTOCOL_FRAME_IN_PROMPT_MSG);

  if (isInProcessEnabled()) return spawnInProcess(args, ctx);                 // rWe(): in-process mode wins outright
  try {
    await detectPaneBackend();                                               // eLe(): probe tmux / iTerm2
  } catch (e) {
    if (getTeammateMode() !== "auto") throw e;                               // explicit pane mode ⇒ surface the failure
    // auto mode ⇒ degrade to in-process and remember the fallback (sticky bit)
    logDebug(`[handleSpawn] No pane backend available, falling back to in-process: ${formatError(e)}`);
    markInProcessFallbackActive();                                           // Wdo()
    return spawnInProcess(args, ctx);
  }
  if (args.use_splitpane !== false) return spawnSplitPane(args, ctx);        // SDp: pane in the swarm view
  return spawnNonSplitPane(args, ctx);                                       // EDp: pane without the split swarm view
}
async function spawnTeammate(args, ctx) { return handleTeammateSpawn(args, ctx); }

// Mapping: cqa→spawnTeammate, HDp→handleTeammateSpawn, iF→isProtocolFrame, rWe→isInProcessEnabled,
//   eLe→detectPaneBackend, Aje→getTeammateMode, Wdo→markInProcessFallbackActive, sqa→spawnInProcess,
//   SDp→spawnSplitPane, EDp→spawnNonSplitPane, v→logDebug
```

`cqa` is a one-line pass-through to `HDp`; the dossier names `cqa` because it is the symbol the Agent `call` invokes, but the real dispatch is `HDp`. The dispatch order is: **in-process if `isInProcessEnabled()` (`rWe`)** — this is the master backend toggle and short-circuits everything; otherwise **probe for a pane backend** (`eLe`), and on probe failure **degrade to in-process only when the mode is `"auto"`** (an explicitly-chosen pane mode surfaces the error). With a pane backend available, **`use_splitpane !== false` → `SDp` (split-pane swarm view), else `EDp` (single pane, no swarm view)**.

This backend split (`rWe`, `eLe`, `Aje`, `Wdo`, registry `_F`) is **structurally carried over** from v2.1.156 — see the baseline [`execution_modes_and_backend_registry.md`](../../../claude_code_v_2.1.156/analyze/30_agent_team/execution_modes_and_backend_registry.md). The one behavioral change inside the pane path (the `send-keys`→`respawn-pane` fix) is documented in the sibling [`spawn_backends_and_tmux_fix.md`](./spawn_backends_and_tmux_fix.md). The dossier (open-question #3) flags that `EDp` was only read at its guard head; it shares the same `name`/`prompt`/team-name guard as `SDp` and is the `use_splitpane===false` variant — read fully below for the guard, but the divergence in the body (single-pane vs swarm-view) was not exhaustively diffed.

### 2.4 The "session team not initialized" guard — the proof the team is a precondition

Every leaf spawner re-reads `teamContext.teamName` from app state and throws an *internal error* if it is missing. This is the runtime asserting the §1 invariant:

```javascript
// ============================================
// SDp / EDp / sqa - "session team not initialized" guard (proves implicit-team precondition)
// Location: cli_inner_pretty.js:422653-422661 (SDp), :422771-422779 (EDp), :422934-422941 (sqa)
// ============================================

// ORIGINAL (for source lookup):  [SDp @422653]
let u = r(), d = u.teamContext?.teamName;
if (!d)
  throw (Me("subagent_launch","subagent_teammate_no_team_name"),
    Error("Internal error: session team not initialized. This should have happened at startup when agent swarms are enabled."));

// READABLE (for understanding):
let appState = getAppState();
let teamName = appState.teamContext?.teamName;     // read the IMPLICIT team, NOT a team_name param
if (!teamName)
  throw new Error("Internal error: session team not initialized. This should have happened at startup when agent swarms are enabled.");
// …then build the teammate pane command with --team-name <teamName> …

// Mapping: r→getAppState, u→appState, d→teamName; identical text in EDp (@422771) and sqa (@422934)
```

**Why this matters as a delta:** in v2.1.156 the equivalent leaf (`aA4`) was *handed* `team_name: resolvedTeam` as an argument — the team name was part of the spawn request. In v2.1.183 the leaf spawners take **no `team_name` argument at all**; they read it from `getAppState().teamContext.teamName`. If it is missing the error message explicitly blames the startup bootstrap ("This should have happened at startup when agent swarms are enabled") — i.e. it treats a missing team as a *bug in the bootstrap*, not a *bad model call*. That phrasing is itself evidence that the team is now a runtime precondition established before any model turn. `SDp` then builds the pane command with `--team-name ${Ja([teamName])}` (`:422688`), threading the implicit team name onto the teammate sub-process's CLI exactly where v2.1.156 threaded the resolved param.

### 2.5 Nested-teammate and in-process-background guards

The two guards in §2.1 (`GUARD 1`/`GUARD 2`) re-express v2.1.156's guards against the *new* identity signals:

- **Nested-teammate guard** (`:423550`): `if ((b || !!l1e()) && s) throw "Teammates cannot spawn other teammates — the team roster is flat. … omit the `name` parameter."` Here `b = !!c.teammateContext` (am I, the caller, running as a teammate?) and `l1e()` (`:103447`) returns the in-process teammate context (`$q`). In v2.1.156 this keyed off `FA()` (`isTeammate`) plus the *resolved team name* (`if (FA() && G && z)`). The intent is identical — the roster is flat, a teammate cannot spawn sub-teammates — but the trigger moved from "`isTeammate` + resolved team" to "`teammateContext` present + `name` given", which is cleaner because it no longer depends on the (now-deprecated) team-name resolution. The error even tells the model the escape hatch: *omit the `name` parameter* to spawn an ordinary subagent instead.
- **In-process-background guard** (`:423557`): `if (b && o === !0) throw "In-process teammates cannot spawn background agents. …"`. A teammate running in-process (sharing the leader's Node process) cannot fork off a background agent. v2.1.156 used `if (mG() && G && _ === !0)`. There is also a *second* variant of this guard deeper in the call (`:423653`) that fires when the *resolved agent definition* has `background: true` in its frontmatter (`if (b && P.background === !0) throw "… Agent '${P.agentType}' has background: true in its definition."`), catching the case where the model did not pass `run_in_background` but selected a background-by-default agent type.

The dossier rates the guard refactor **medium** confidence as a "delta" because the *intent* is unchanged from v2.1.156 — it is the same two guards re-expressed against `teammateContext`/`l1e` instead of `FA`/`mG` + resolved team. Carrying that caveat: these are not new *capabilities*, they are the same invariants wired to the new identity model.

### 2.6 The description hides `name`/`mode` for teammates (`em()`)

The Agent tool's own *description* (built by `Aqa` @`:423136`) hides the `name` and `mode` parameters when the current session is itself a teammate, via `em()` (`isTeammate`, `:103466`):

```javascript
// ============================================
// Agent description - hide name/mode for teammates (em gate)
// Location: cli_inner_pretty.js:423264-423268 and :423308-423314
// ============================================

// ORIGINAL (for source lookup):
g = UN()
  ? "\n- `run_in_background`, `name`, and `mode` are unavailable here — only synchronous subagents."
  : em()
    ? "\n- `name` and `mode` are unavailable here — teammates cannot spawn teammates."
    : "";

// READABLE (for understanding):
let modeHint = isWorkflowOrRestrictedContext()           // UN()
  ? "\n- `run_in_background`, `name`, and `mode` are unavailable here — only synchronous subagents."
  : isTeammate()                                         // em(): Pk() || ($q.agentId && $q.teamName)
    ? "\n- `name` and `mode` are unavailable here — teammates cannot spawn teammates."
    : "";

// Mapping: em→isTeammate, UN→isWorkflowOrRestrictedContext, g→modeHint
```

This is the prompt-level mirror of the §2.5 runtime guard: a teammate is *told* in the tool description that `name`/`mode` are unavailable, so the model does not even try. `em()` is the canonical "is this session a teammate" predicate (`Pk()` for an explicit teammate context, or `$q.agentId && $q.teamName` for the in-process identity). Confidence: high — both the guard and the description-suppression were read directly.

---

## 3. End-to-end: what a teammate spawn looks like in v2.1.183

```
CLI bootstrap (interactive, swarms on, not a teammate process)
  └─ initializeSessionTeam (j3f)
       ├─ teamName = "session-<id[:8]>"           (xic)
       ├─ write team file (leader-only roster)     (pBn)
       └─ seed appState.teamContext + teammateColors
                              │
        (model turn: Agent({ name:"researcher", prompt:"…", subagent_type:"explorer" }))
                              │
  Agent.call
   ├─ _ = Sl() ? appState.teamContext : undefined   // implicit team present
   ├─ guards: not a teammate, not background-from-teammate
   ├─ L = isFork? (subagent_type==="fork" && allowed)  // false here
   └─ if (_ && "researcher" && !L)  ──►  cqa → HDp
                                          ├─ rWe()? ──► sqa (in-process)
                                          └─ else: eLe() ──► SDp (splitpane) / EDp (no-split)
                                                              └─ read teamContext.teamName (NOT a param)
                                                                 build --team-name <team> --agent-id … --agent-name researcher
   └─ return { status: "teammate_spawned", … }
```

Compare v2.1.156, where the model first had to call `TeamCreate({team_name:"my-team"})`, *then* `Agent({ name:"researcher", team_name:"my-team", … })`, and the routing resolved `team_name` (param-first) before spawning. v2.1.178/183 collapses the first step into the bootstrap and demotes the `team_name` argument to a no-op.

---

## 4. Confidence & open questions carried from the dossier

- **High confidence:** TeamCreate/TeamDelete removal (grep=0), `initializeSessionTeam` existence and behavior, the bootstrap gate, the `session-<id[:8]>` naming, the new routing predicate `if (_ && s && !L)`, the `team_name` "Deprecated; ignored" description, the `"main"` reservation and `pDa` regex, the leaf-spawner "session team not initialized" guards. All read directly at the cited lines in the v2.1.183 bundle.
- **`mode` is NOT new** (dossier open-question #2): confirmed by reading the v2.1.156 Agent `call` destructure (`mode: Y`, v2.1.156 `cli_inner_pretty.js:398370`) — only its description wording changed.
- **Medium confidence — `F3f` setter** (dossier open-question #6): `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME` is read-and-consumed by `readInheritedTeamName`; the *mechanism* (one-shot env handoff, deleted on read) is verified, but which producer sets it (pane CLI builder vs in-process/MCP assistant spawn) was not pinned in source. Flagged for the verifier.
- **Medium confidence — guard refactor** (dossier §3.7): the nested-teammate and in-process-background guards are the same *invariants* as v2.1.156, re-expressed against `teammateContext`/`l1e()` rather than `FA()`/`mG()` + resolved team. Treat as a re-wiring, not a new capability.
- **Not fully verified — `EDp` body** (dossier open-question #3): `EDp` shares `SDp`'s name/prompt/team-name guard head (read directly); its non-splitpane body (single pane, no swarm view) was not exhaustively diffed against `SDp`.

---

## Related Symbols

> Symbol mappings live in the central index, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Agent Team / swarm lives here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra (Permissions, Model)
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations
> - per-feature additions: [symbol_additions_v2_1_183_agent_team.md](../00_overview/symbol_additions_v2_1_183_agent_team.md)

Key functions/constants in this document (list format, per CLAUDE.md):

- `initializeSessionTeam` (obfuscated: `j3f`, `cli_inner_pretty.js:682765`) — creates the implicit session-scoped team at startup; returns seed `teamContext` + `teammateColors`.
- `sessionTeamName` (obfuscated: `xic`, `cli_inner_pretty.js:682752`) — derives `session-<sessionId[:8]>`; prefix const `B3f="session"` (`:682817`).
- `readInheritedTeamName` (obfuscated: `F3f`, `cli_inner_pretty.js:682755`) — one-shot read+delete of `CLAUDE_INTERNAL_ASSISTANT_TEAM_NAME`.
- `isAgentSwarmsEnabled` (obfuscated: `Sl`, `cli_inner_pretty.js:293831`) — master gate (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`/`--agent-teams` + `tengu_amber_flint`); v2.1.156 `R7`.
- `hasAgentTeamsCliFlag` (obfuscated: `yqd`, `cli_inner_pretty.js:293828`) — `--agent-teams` flag check; v2.1.156 `Ru5`.
- `isNonInteractive` (obfuscated: `xr`, `cli_inner_pretty.js:3151`) — `!Ot.isInteractive`; used in the bootstrap gate.
- `Agent tool def` (obfuscated: `f3n`, `cli_inner_pretty.js:423505`) — the Agent tool; `name` const `vs`; `call` teammate routing at `:423548-423591`.
- `buildAgentInputSchema` (obfuscated: `IDp`, `cli_inner_pretty.js:423446`) — merges `name`/`team_name`/`mode` onto base `CDp` (`:423431`); served via `zao` (`:423478`).
- `AGENT_NAME_RE` (obfuscated: `pDa`, `cli_inner_pretty.js:362645`) — `/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/`.
- `RESERVED_MAIN_NAME` (obfuscated: `LY`, `cli_inner_pretty.js:362512`) — `"main"`; refined out of the `name` schema.
- `permissionModeEnum` (obfuscated: `zts`, `cli_inner_pretty.js:53866`) — the `mode` enum (`wM` @`:53815`).
- `spawnTeammate` (obfuscated: `cqa`, `cli_inner_pretty.js:423053`) → `handleTeammateSpawn` (obfuscated: `HDp`, `cli_inner_pretty.js:423041`) — the spawn dispatcher.
- `spawnInProcess` (obfuscated: `sqa`, `cli_inner_pretty.js:422925`) / `spawnSplitPane` (obfuscated: `SDp`, `cli_inner_pretty.js:422644`) / `spawnNonSplitPane` (obfuscated: `EDp`, `cli_inner_pretty.js:422762`) — leaf spawners; all read `teamContext.teamName`.
- `isInProcessEnabled` (obfuscated: `rWe`, `cli_inner_pretty.js:422425`) / `getTeammateMode` (obfuscated: `Aje`, `:293813`) / `markInProcessFallbackActive` (obfuscated: `Wdo`, `:422419`) — backend selection (carryover).
- `formatAgentId` (obfuscated: `bQ`, `cli_inner_pretty.js:103172`) — `name@team`.
- `getTeamFilePath` (obfuscated: `gte`, `cli_inner_pretty.js:362812`) — `<teamsDir>/<team>/config.json`.
- `TEAM_LEAD_NAME` (obfuscated: `np`, `cli_inner_pretty.js:362636`) — `"team-lead"`.
- `isTeammate` (obfuscated: `em`, `cli_inner_pretty.js:103466`) / `getInProcessTeammateContext` (obfuscated: `l1e`, `:103447`) — teammate-identity predicates used by the guards/description.
- v2.1.156 before-picture: `resolveTeamName` (obfuscated: `oN_`, v2.1.156 `cli_inner_pretty.js:398190`), `spawnTeammate` (obfuscated: `aA4`, v2.1.156 `:398160`), `TeamCreate` name const (obfuscated: `rd`, v2.1.156 `:216438`), `TeamCreateTool` def (obfuscated: `Th_`, v2.1.156 `:406631`).
