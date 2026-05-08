# Spawn Mechanism — Agent Teams (v2.1.112)

## Overview

A *teammate spawn* is the act of bringing a new agent under the team-lead's coordination. Three distinct backends share a single dispatcher (`n7Y`):

- **In-process** (`j2K`) — same Node.js process; uses an `AbortController` for lifecycle and feeds the unified `bXY` runner.
- **Tmux split-pane** (`c7Y`) — splits the host tmux/iTerm2 pane and launches the `claude` CLI inside it; child communicates only via mailbox.
- **Tmux new-window** (`l7Y`) — opens a new window in the `claude-swarm` tmux session and launches the CLI; same mailbox-only comms.

The backend selection is decided by `bF()` (in-process default unless tmux/iTerm2 is interactively present), with an automatic fallback to in-process when a pane backend probe fails *and* `teammateMode` is `auto`.

This doc walks through the dispatch logic, each spawn flow, the post-spawn teardown wiring, and the design rationale.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md).

Key functions in this document:
- `spawnTeammateDispatcher` (`n7Y`) — chunks.137.mjs:2929
- `spawnTeammateLegacyAlias` (`P2K`) — chunks.137.mjs:2941
- `spawnSplitPaneTeammate` (`c7Y`) — chunks.137.mjs:2534
- `spawnTmuxTeammate` (`l7Y`) — chunks.137.mjs:2653
- `spawnInProcessTeammate` (`j2K`) — chunks.137.mjs:2803
- `spawnInProcessHelper` (`cI8`) — chunks.100.mjs:1079
- `startInProcessAgentExecution` (`Jg8`) — chunks.155.mjs:309
- `inProcessExecutorCheck` (`bF`) — chunks.155.mjs:1104
- `getTeammateMode` (`UX6`) — chunks.137.mjs:1738
- `setTeammateModeOverride` (`gX6`) — chunks.137.mjs:1735
- `pickUniqueTeammateName` (`d7Y`) — chunks.137.mjs:2525
- `sanitizeAgentName` (`S77`) — referenced
- `registerInProcessTask` (`M2K`) — chunks.137.mjs:2757
- `paneBackendProbe` (`v96`) — referenced
- `assignSwarmPaneId` (`Y2K`) — referenced
- `persistTeammateRecord` (`y77`) — referenced

---

## Decision Tree (n7Y)

```javascript
// ============================================
// spawnTeammateDispatcher - Backend selector
// Location: chunks.137.mjs:2929-2939
// ============================================

// ORIGINAL (for source lookup):
async function n7Y(q, K) {
  if (bF()) return j2K(q, K);
  try { await v96() }
  catch (z) {
    if (UX6() !== "auto") throw z;
    return E(`[handleSpawn] No pane backend available, falling back to in-process: ${b6(z)}`),
           h77(), j2K(q, K);
  }
  if (q.use_splitpane !== !1) return c7Y(q, K);
  return l7Y(q, K);
}

// READABLE (for understanding):
async function spawnTeammateDispatcher(input, ctx) {
  if (isInProcessExecutorEnabled()) {
    return spawnInProcessTeammate(input, ctx);
  }
  try {
    await probePaneBackend();
  } catch (e) {
    if (getTeammateMode() !== "auto") throw e;       // user pinned to tmux; fail loudly
    log(`No pane backend available, falling back to in-process: ${describe(e)}`);
    enableInProcessFallback();                        // h77 — sets sticky flag
    return spawnInProcessTeammate(input, ctx);
  }
  if (input.use_splitpane !== false) {
    return spawnSplitPaneTeammate(input, ctx);
  }
  return spawnTmuxTeammate(input, ctx);
}

// Mapping: n7Y→spawnTeammateDispatcher, q→input, K→ctx, bF→isInProcessExecutorEnabled,
//          v96→probePaneBackend, UX6→getTeammateMode, h77→enableInProcessFallback,
//          j2K→spawnInProcessTeammate, c7Y→spawnSplitPaneTeammate, l7Y→spawnTmuxTeammate
```

### Three branches with two probe outcomes

```
n7Y(input, ctx)
  │
  ├─ bF() is true ────────────► j2K (always)
  │
  ├─ bF() is false:
  │     │
  │     ├─ probe v96() succeeds:
  │     │     ├─ input.use_splitpane !== false ─► c7Y                  ← always taken in v2.1.112
  │     │     └─ else                            ─► l7Y (UNREACHABLE)  ← see note below
  │     │
  │     └─ probe v96() throws:
  │           ├─ getTeammateMode() === "auto"  ─► h77() + j2K (silent fallback)
  │           └─ getTeammateMode() ≠ "auto"    ─► rethrow (config forces pane)
```

> **`l7Y` is dead code in v2.1.112.** The `l7Y` (separate-tmux-window) branch requires `input.use_splitpane === false`. The only call site of `n7Y` is via `P2K`, which is invoked from the Agent tool at chunks.141.mjs:514 — and that call site **hardcodes** `use_splitpane: !0` (true). No other code path reaches `n7Y`, so `l7Y` is never executed. It remains in the source as either vestigial or future-extension scaffolding.

### bF() — the in-process predicate

```javascript
// ============================================
// inProcessExecutorCheck - Default-to-in-process predicate
// Location: chunks.155.mjs:1104-1117
// ============================================

// ORIGINAL (for source lookup):
function bF(q = CT) {
  if (I7()) return E("[BackendRegistry] isInProcessEnabled: true (non-interactive session)"), !0;
  let K = FXY(), _;
  if (K === "in-process") _ = !0;
  else if (K === "tmux") _ = !1;
  else {
    if (q.inProcessFallbackActive) return E("[BackendRegistry] isInProcessEnabled: true (fallback after pane backend unavailable)"), !0;
    let z = YJ6(), Y = xc();
    _ = !z && !Y;
  }
  return E(`[BackendRegistry] isInProcessEnabled: ${_} (mode=${K}, insideTmux=${YJ6()}, inITerm2=${xc()})`), _;
}

// READABLE (for understanding):
function isInProcessExecutorEnabled(state = backendRegistryState) {
  if (isNonInteractiveSession()) return true;          // I7() — print-mode, headless, etc.

  const mode = getTeammateMode();
  if (mode === "in-process") return true;
  if (mode === "tmux")       return false;
  // mode === "auto" → environment-driven decision
  if (state.inProcessFallbackActive) return true;       // sticky after a probe failure
  return !insideTmux() && !inITerm2();                  // YJ6 / xc — terminal probes
}
```

### Why "in-process by default"?

In v2.1.76, `Rb()` returned `true` only when an iTerm2 native split was *not* available. The natural pre-condition was "pane unless something forces in-process". That made spawning teammates feel like a tmux/iTerm2 feature, not a general one.

v2.1.112's `bF()` flips the polarity:
1. **Non-interactive sessions always pick in-process.** A piped `claude` invocation can't open a tmux pane anyway.
2. **Auto mode picks in-process unless we're interactively inside tmux or iTerm2.** Users on a plain shell get fast, dependency-free spawns.
3. **Sticky fallback** — once a pane probe fails (`v96` throws and mode is `auto`), `h77()` marks `inProcessFallbackActive: true`, so subsequent spawns in the same session don't keep retrying the broken probe.

Trade-off: pane mode users now have to explicitly opt in via `--teammate-mode tmux` or team config `teammateMode: "tmux"`. The migration cost is minimal because the dispatcher honors both signals.

---

## In-Process Spawn (j2K)

```javascript
// ============================================
// spawnInProcessTeammate - In-process backend
// Location: chunks.137.mjs:2803-2927
// ============================================

// READABLE (for understanding):
async function spawnInProcessTeammate(input, ctx) {
  const { setAppState, getAppState } = ctx;
  const { name, prompt, agent_type, plan_mode_required } = input;
  const model = resolveTeammateModel(input.model, getAppState().mainLoopModel);
  if (!name || !prompt) throw new Error("name and prompt are required for spawn operation");

  const state = getAppState();
  const teamName = input.team_name || state.teamContext?.teamName;
  if (!teamName) throw new Error("team_name is required for spawn operation. Either provide team_name or call spawnTeam first.");

  return wrapWithTeamConfigUpdate(name, teamName, {
    agentType: agent_type,
    model,
    prompt,
    planModeRequired: plan_mode_required,
    cwd: getCwd(),
  }, ctx.teammateColors, async ({ sanitizedName, teammateId, teammateColor }, commit) => {

    // Save 'in-process' marker into team file (so restart can re-resolve)
    await persistTeammateRecord(teamName, teammateId, {
      tmuxPaneId: "in-process",
      backendType: "in-process",
    });

    // If user requested a custom agent type, look it up
    let agentDefinition;
    if (agent_type) {
      const found = ctx.options.agentDefinitions.activeAgents.find(a => a.agentType === agent_type);
      if (found && agentSupportsTeammates(found)) agentDefinition = found;
    }

    // Spawn the in-process agent — sets up task record + abort controller + teammate context
    await clearInbox(sanitizedName, teamName);
    const spawnResult = await spawnInProcessHelper({
      name: sanitizedName, teamName, prompt, color: teammateColor,
      planModeRequired: plan_mode_required ?? false, model,
    }, ctx);
    if (!spawnResult.success) throw new Error(spawnResult.error ?? "Failed to spawn in-process teammate");

    commit();   // commit team config update

    // Fire the runner (await would block this entire spawn flow)
    if (spawnResult.taskId && spawnResult.teammateContext && spawnResult.abortController) {
      startInProcessAgentExecution({
        identity: { agentId: teammateId, agentName: sanitizedName, teamName,
                    color: teammateColor, planModeRequired: plan_mode_required ?? false,
                    parentSessionId: spawnResult.teammateContext.parentSessionId },
        taskId: spawnResult.taskId,
        prompt,
        description: input.description,
        model,
        agentDefinition,
        teammateContext: spawnResult.teammateContext,
        toolUseContext: { ...ctx, messages: [] },
        abortController: spawnResult.abortController,
        invokingRequestId: input.invokingRequestId,
      });
    }

    // Update AppState.teamContext: lead must exist; create if missing
    const existingLead = getAppState().teamContext?.leadAgentId;
    const isFirstTeammate = !existingLead;
    const leadAgentId = existingLead ?? deriveLeadAgentId("team-lead", teamName);
    const leadColor = isFirstTeammate ? ctx.teammateColors.assign(leadAgentId) : undefined;

    setAppState(s => ({
      ...s,
      teamContext: {
        ...s.teamContext,
        teamName,
        leadAgentId,
        teammates: {
          ...s.teamContext?.teammates,
          ...(isFirstTeammate && {
            [leadAgentId]: { name: "team-lead", agentType: "team-lead", color: leadColor,
                             tmuxSessionName: "in-process", tmuxPaneId: "leader",
                             cwd: getCwd(), spawnedAt: Date.now() }
          }),
          [teammateId]: { name: sanitizedName, agentType: agent_type, color: teammateColor,
                          tmuxSessionName: "in-process", tmuxPaneId: "in-process",
                          cwd: getCwd(), spawnedAt: Date.now() },
        },
      },
    }));

    return { data: { teammate_id: teammateId, agent_id: teammateId, agent_type, model,
                     name: sanitizedName, color: teammateColor,
                     tmux_session_name: "in-process", tmux_window_name: "in-process",
                     tmux_pane_id: "in-process", team_name: teamName,
                     is_splitpane: false, plan_mode_required: plan_mode_required } };
  });
}

// Mapping: j2K→spawnInProcessTeammate, q→input, K→ctx, $→input.model, j→model,
//          E77→wrapWithTeamConfigUpdate, y77→persistTeammateRecord, O18→clearInbox,
//          cI8→spawnInProcessHelper, Jg8→startInProcessAgentExecution,
//          op→deriveLeadAgentId, Mz→"team-lead", v88→agentSupportsTeammates
```

### Critical step: lead-agent record auto-injection

When the **first** teammate is spawned, `j2K` notices there's no `leadAgentId` and synthesizes one (`op("team-lead", teamName)`). This is what backfills the leader into `AppState.teamContext.teammates` so the TUI can render it. Without this, the lead would be invisible until another spawn explicitly registered it.

### cI8 — building the task record

```javascript
// ============================================
// spawnInProcessHelper - Build the task registry record + AbortController
// Location: chunks.100.mjs:1079-1150
// ============================================

// READABLE (for understanding):
async function spawnInProcessHelper(input, ctx) {
  const { name, teamName, prompt, color, planModeRequired, model } = input;
  const { taskRegistry } = ctx;
  const agentId = deriveAgentId(name, teamName);              // op
  const taskId = makeTaskId("in_process_teammate");           // cR
  try {
    const abortController = new AbortController();            // F5
    const parentSessionId = getCurrentSessionId();            // I8

    const identity = { agentId, agentName: name, teamName, color,
                       planModeRequired, parentSessionId };
    const teammateContext = makeTeammateContext({             // nZ8
      agentId, agentName: name, teamName, color,
      planModeRequired, parentSessionId, abortController,
    });

    if (isInteractiveSession()) registerLogScopeForTeammate(agentId, name, parentSessionId);

    const description = `${name}: ${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}`;
    const taskRecord = {
      ...taskBase(taskId, "in_process_teammate", description, ctx.toolUseId),
      type: "in_process_teammate",
      status: "running",
      identity,
      prompt,
      model,
      abortController,
      awaitingPlanApproval: false,
      spinnerVerb: pickRandom(getSpinnerVerbs()),              // LJ(AJ6())
      pastTenseVerb: pickRandom(IDLE_VERBS),                   // LJ(nh6)
      permissionMode: derivePermissionMode(ctx.getAppState().toolPermissionContext.mode, planModeRequired),
      isIdle: false,
      shutdownRequested: false,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      pendingUserMessages: [],
      messages: [],
    };
    const unregisterCleanup = registerCleanup(async () => {    // eq
      log(`[spawnInProcessTeammate] Cleanup called for ${agentId}`);
      abortController.abort();
    });
    taskRecord.unregisterCleanup = unregisterCleanup;
    taskRegistry.register(taskRecord);

    return { success: true, agentId, taskId, abortController, teammateContext };
  } catch (e) {
    return { success: false, agentId, error: e.message };
  }
}

// Mapping: cI8→spawnInProcessHelper, q→input, K→ctx, $→taskRegistry, j→agentId,
//          H→taskId, J→abortController, X→parentSessionId, M→identity, P→teammateContext,
//          op→deriveAgentId, cR→makeTaskId, F5→AbortController, I8→getCurrentSessionId,
//          nZ8→makeTeammateContext, eq→registerCleanup, dI8→registerLogScopeForTeammate,
//          cf→taskBase, AJ6→getSpinnerVerbs, LJ→pickRandom, Y0z→derivePermissionMode
```

### Jg8 — fire-and-forget runner

```javascript
// ============================================
// startInProcessAgentExecution - Fire-and-forget bXY launcher
// Location: chunks.155.mjs:309-313
// ============================================

// ORIGINAL (for source lookup):
function Jg8(q) {
  let K = q.identity.agentId;
  bXY(q).catch((_) => { E(`[inProcessRunner] Unhandled error in ${K}: ${_}`); });
}

// READABLE (for understanding):
function startInProcessAgentExecution(args) {
  const agentId = args.identity.agentId;
  inProcessAgentRunner(args).catch(err => {
    log(`[inProcessRunner] Unhandled error in ${agentId}: ${err}`);
  });
}

// Mapping: Jg8→startInProcessAgentExecution, q→args, K→agentId, bXY→inProcessAgentRunner
```

The fact that this is fire-and-forget is critical. `j2K` returns to the LLM immediately with the spawn metadata (`teammate_id`, etc.) so the caller can plan further work. The teammate's runner then operates independently.

---

## Split-Pane Spawn (c7Y)

```javascript
// ============================================
// spawnSplitPaneTeammate - Split-pane backend
// Location: chunks.137.mjs:2534-2651
// ============================================

// READABLE (for understanding):
async function spawnSplitPaneTeammate(input, ctx) {
  validateSpawnInput(input);
  const teamName = input.team_name || ctx.getAppState().teamContext?.teamName;
  if (!teamName) throw new Error("team_name is required");

  const cwd = input.cwd || getCwd();
  return wrapWithTeamConfigUpdate(name, teamName, { ... }, ctx.teammateColors, async ({sanitizedName, teammateId, teammateColor}, commit, registerCleanup) => {
    // 1) iTerm2 setup if needed
    let { needsIt2Setup, backend } = await probePaneBackend();
    if (needsIt2Setup && ctx.setToolJSX) {
      const tmuxAvailable = await checkTmuxAvailable();
      const decision = await new Promise(resolve => ctx.setToolJSX({
        jsx: createElement(IT2SetupComponent, { onDone: resolve, tmuxAvailable }),
        shouldHidePromptInput: true,
      }));
      ctx.setToolJSX(null);
      if (decision === "cancelled") throw new Error("Teammate spawn cancelled - iTerm2 setup required");
      if (decision === "installed" || decision === "use-tmux") {
        invalidatePaneBackendCache();    // R77
        ({ backend, needsIt2Setup } = await probePaneBackend());
      }
    }

    // 2) Pane creation
    const insideTmux = await isInsideTmux();              // z2K
    const { paneId, isFirstTeammate } = await assignSwarmPaneId(sanitizedName, teammateColor);
    registerCleanup(() => backend.killPane(paneId, !insideTmux));
    await persistTeammateRecord(teamName, teammateId, { tmuxPaneId: paneId, backendType: backend.type });

    // 3) Open the swarm view if this is the first teammate
    if (isFirstTeammate && insideTmux) await ensureSwarmView();   // A2K

    // 4) Build the launch command
    const claudeBin = resolveClaudeBinPath();              // J2K
    const teammateArgs = [
      `--agent-id ${shellEscape([teammateId])}`,
      `--agent-name ${shellEscape([sanitizedName])}`,
      `--team-name ${shellEscape([teamName])}`,
      `--agent-color ${shellEscape([teammateColor])}`,
      `--parent-session-id ${shellEscape([getCurrentSessionId()])}`,
      planModeRequired ? "--plan-mode-required" : "",
      agentType ? `--agent-type ${shellEscape([agentType])}` : "",
    ].filter(Boolean).join(" ");
    let extraArgs = buildExtraCliArgs({ planModeRequired, permissionMode });   // X2K
    if (model) extraArgs = mergeModelOverride(extraArgs, model);
    const env = buildTeammateEnv();                         // HK8
    const cmd = `cd ${shellEscape([cwd])} && env ${env} ${shellEscape([claudeBin])} ${teammateArgs}${extraArgs ? " " + extraArgs : ""}`;

    // 5) Inbox reset + first-prompt write + send-keys
    await clearInbox(sanitizedName, teamName);
    await writeToMailbox(sanitizedName, { from: "team-lead", text: prompt, timestamp: now() }, teamName);
    await sendKeysToPane(paneId, cmd, !insideTmux);          // O2K
    commit();

    // 6) AppState update + register pane-backed task placeholder
    const sessionName = insideTmux ? "current" : SWARM_SESSION;       // Ny
    const windowName  = insideTmux ? "current" : "swarm-view";
    setAppState(s => updateAppStateForSpawn(s, ...));
    registerInProcessTask(ctx.taskRegistry, { teammateId, sanitizedName, teamName, ..., backendType: backend.type, toolUseId: ctx.toolUseId });

    return { data: { teammate_id: teammateId, ..., is_splitpane: true } };
  });
}

// Mapping: c7Y→spawnSplitPaneTeammate, q→input, K→ctx,
//          v96→probeAndCacheBackend, R77→invalidatePaneBackendCache,
//          z2K→isInsideTmux, Y2K→assignSwarmPaneId, A2K→ensureSwarmView,
//          y77→persistTeammateRecord, O18→clearInbox, F_→writeToMailbox,
//          O2K→sendKeysToPane, M2K→registerInProcessTask, X2K→buildExtraCliArgs,
//          HK8→buildTeammateEnv, J2K→resolveClaudeBinPath, A5→shellEscape, I8→getCurrentSessionId
```

### Why register an in-process task placeholder for pane modes?

Even though the actual agent runs in another process, the leader still needs:
- A `taskId` to refer to the teammate from tool results.
- An `AbortController` to call `backend.killPane(...)` when the user requests a kill.
- A status field for the TUI's team renderer.

The placeholder task in `M2K` carries these. The `abortController.signal.addEventListener("abort", ...)` callback does the actual `killPane`, so signaling the controller from the leader's side reaches into the host terminal and tears down the pane.

---

## Tmux New-Window Spawn (l7Y)

```javascript
// ============================================
// spawnTmuxTeammate - Tmux new-window backend
// Location: chunks.137.mjs:2653-2755
// ============================================

// READABLE (for understanding):
async function spawnTmuxTeammate(input, ctx) {
  validateSpawnInput(input);
  const teamName = input.team_name || ctx.getAppState().teamContext?.teamName;
  if (!teamName) throw new Error("team_name is required");
  const cwd = input.cwd || getCwd();

  return wrapWithTeamConfigUpdate(name, teamName, { ... }, ctx.teammateColors, async ({sanitizedName, teammateId, teammateColor}, commit, registerCleanup) => {
    const windowName = `teammate-${sanitizeForTmuxName(sanitizedName)}`;     // T96
    await ensureTmuxSession(SWARM_SESSION);                                   // Q7Y(Ny)
    const newWindow = await runTmux(["new-window", "-t", SWARM_SESSION, "-n", windowName, "-P", "-F", "#{pane_id}"]);
    if (newWindow.code !== 0) throw new Error(`Failed to create tmux window: ${newWindow.stderr}`);
    const paneId = newWindow.stdout.trim();
    registerCleanup(() => runTmux(["kill-pane", "-t", paneId]));
    await persistTeammateRecord(teamName, teammateId, { tmuxPaneId: paneId, backendType: "tmux" });

    const claudeBin = resolveClaudeBinPath();
    const teammateArgs = [...].filter(Boolean).join(" ");      // same shape as c7Y
    const env = buildTeammateEnv();
    const cmd = `cd ${shellEscape([cwd])} && env ${env} ${shellEscape([claudeBin])} ${teammateArgs}${extraArgs ? " " + extraArgs : ""}`;

    await clearInbox(sanitizedName, teamName);
    await writeToMailbox(sanitizedName, { from: "team-lead", text: prompt, timestamp: now() }, teamName);

    const sendKeysResult = await runTmux(["send-keys", "-t", `${SWARM_SESSION}:${windowName}`, cmd, "Enter"]);
    if (sendKeysResult.code !== 0) throw new Error(`Failed to send command to tmux window: ${sendKeysResult.stderr}`);

    commit();
    setAppState(s => ({ ...s, teamContext: {
      ...s.teamContext, teamName, teammates: {
        ...s.teamContext?.teammates,
        [teammateId]: { name: sanitizedName, agentType, color: teammateColor,
                        tmuxSessionName: SWARM_SESSION, tmuxPaneId: paneId,
                        cwd, spawnedAt: Date.now() },
      }
    }}));
    return { data: { ..., is_splitpane: false } };
  });
}

// Mapping: l7Y→spawnTmuxTeammate, q→input, K→ctx,
//          Q7Y→ensureTmuxSession, mD→"tmux", Ny→SWARM_SESSION,
//          w1→runTmux, T96→sanitizeForTmuxName
```

The key difference from `c7Y` is the use of `tmux new-window` to create an entirely new window (visible in the tmux window list) rather than splitting the current pane. There is no swarm-view setup, no iTerm2 fallback — the only target is tmux.

---

## What Each Backend Persists Differently

| Backend | `tmuxSessionName` | `tmuxPaneId` | `backendType` |
|---------|--------------------|--------------|---------------|
| In-process | `"in-process"` | `"in-process"` | `"in-process"` |
| Split-pane (inside tmux) | `"current"` | actual `%N` pane id | `"tmux"` or `"iterm2"` |
| Split-pane (outside tmux) | `"claude-swarm"` | actual `%N` pane id | `"tmux"` or `"iterm2"` |
| New-window | `"claude-swarm"` | actual `%N` pane id | `"tmux"` |

The leader uses these to:
- Render the right tab in the team UI.
- Call `backend.killPane(paneId, hide)` on teardown.
- Decide whether to attempt to focus a pane (only meaningful for pane modes).

---

## Pane Backend Probe (v96)

`v96()` is the one-time, cached probe that determines:
- Whether tmux is available (`which tmux` succeeds).
- Whether iTerm2 is the host terminal (and whether the `it2` CLI is installed for native splits).
- Whether the user already disabled pane mode for this session.

Returns `{backend: TmuxBackend|ITermBackend, needsIt2Setup: boolean}` or throws if no pane backend is reachable. The thrown case in `n7Y` is what triggers the auto-fallback (when `teammateMode === "auto"`).

`R77()` invalidates the cache when the user accepts the iTerm2 setup mid-spawn — necessary because the previous probe established "iTerm2 needs setup", but a successful install changes that.

---

## Why Three Backends?

| Concern | In-Process | Split-Pane | New-Window |
|---------|------------|------------|------------|
| Latency to first response | ~0 ms (same process) | 1-2 s (CLI bootstrap) | 1-2 s (CLI bootstrap) |
| Visibility | Embedded React tab | Visible split | Visible window list |
| Resource cost | Shared event loop | Full Node.js fork | Full Node.js fork |
| Survives leader crash | No | Yes (mailbox persists) | Yes (mailbox persists) |
| Cross-platform | Yes | tmux/iTerm2 only | tmux only |
| Headless / CI | Yes | No | No |

The three backends exist because no single one fits all use cases. **In-process** is best for the common case of a single user iterating quickly. **Split-pane** is best for visual debugging — you can watch the teammate's stream live next to the leader's. **New-window** is best for long-running background teammates that the user may swap into and out of.

---

## Configuration Modes Summary

| Setting | Source | Effect |
|---------|--------|--------|
| `teammateMode` in team config | `~/.claude/teams/{team}/config.json` | Persistent default for this team |
| `--teammate-mode` CLI flag | startup | Per-process override |
| `gX6` runtime override | session state | One-shot programmatic override |
| `bF()` heuristic | terminal probes | Default when none of the above is set |

The chain is: explicit CLI flag → runtime override → team config → `bF()` heuristic.

---

## Spawn Failure Modes

| Failure | Where caught | Recovery |
|---------|--------------|----------|
| `name`/`prompt` missing | `c7Y`/`l7Y`/`j2K` validate | Throw to caller; LLM gets error |
| `team_name` missing and no team in AppState | spawn validate | Throw — must call TeamCreate first |
| Pane probe fails, mode === "auto" | `n7Y` catch | Silent fallback to `j2K`; `h77()` makes it sticky |
| Pane probe fails, mode pinned | `n7Y` catch | Re-throw to caller |
| iTerm2 setup cancelled | `c7Y` modal | Throw "Teammate spawn cancelled" |
| Tmux command fails (`new-window`/`send-keys`) | `l7Y`/`c7Y` | Throw; pane teardown via cleanup callback |
| Spawn cleanup callback fails | `c7Y` warn | Log, continue (the agent may already be running) |
| `cI8` throws | `j2K` | Propagate; no task registered |

The `registerCleanup` pattern in `c7Y` and `l7Y` is critical: any thrown error after pane creation but before commit will trigger the cleanup, killing the orphan pane. In `j2K`, the AbortController serves the same role.
