# Team Lifecycle Tools — v2.1.142

## TL;DR

Three model-facing tools manage the lifecycle of an in-process team:

1. **`TeamCreate`** (`JH5`, `Am` = `"TeamCreate"`) — creates the team
   record, registers the caller as `team-lead`, sets `AppState.teamContext`,
   and prepares the inbox/team directories. There is exactly **one team
   per leader**; recreating without `TeamDelete` is an error.
2. **`TeamDelete`** (`LH5`, `St` = `"TeamDelete"`) — disbands the team:
   refuses if any teammate is still active, otherwise removes the team and
   task directories, clears `teamContext`, clears the inbox, and frees the
   color assignments.
3. **`SendMessage`** (`SH5`, `mZ` = `"SendMessage"`) — the single
   inter-agent message-sending primitive. Handles four addressing schemes
   (`other` / local team, `uds:` Unix-domain, `bridge:` cloud-Bridge,
   inline `/`-paths) and seven structured message types (`shutdown_request`,
   `shutdown_response`, `plan_approval_response`, plus plain text). Routes
   structured messages through dedicated handlers (`NH5`, `EH5`, `yH5`,
   `hH5`, `IH5`).

Two additional tools (not the focus here, documented in adjacent files)
participate in the same surface:

- **`Agent`** — fast-path "spawn a teammate when one isn't already
  running" delegation; see `v2_1_142_subagent_matching.md` and
  `agent_identity_propagation.md`.
- **`TaskStop`** — terminates any task type, including `in_process_teammate`;
  see `task_taxonomy.md`.

All three tools are gated on `eK()` (a feature predicate) — they're
**enabled only when the agent-team feature is on** (controlled by the
`tengu_swarm` Statsig gate / build flag, plus user opt-in).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Agent Team
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Tools

Key tool wiring:
- `TeamCreateTool` (`JH5`, name = `Am` = `"TeamCreate"`) — cli_inner_pretty.js:386243-386345
- `TeamDeleteTool` (`LH5`, name = `St` = `"TeamDelete"`) — cli_inner_pretty.js:386387-386445
- `SendMessageTool` (`SH5`, name = `mZ` = `"SendMessage"`) — cli_inner_pretty.js:387042-387199
- Tool registration helper (`XK`) — generic tool-definition wrapper
- Tool prompts: `Gi7` (TeamCreate), `ki7` (TeamDelete), `Bi7` (SendMessage), `mi7` (SendMessage description)
- Render helpers: `Ti7` (TeamCreate use message), `Ni7` (TeamDelete use message), `Ei7` (TeamDelete result), `Ui7`/`Fi7` (SendMessage use/result)

Constants:
- `Am` = `"TeamCreate"`, `St` = `"TeamDelete"`, `mZ` = `"SendMessage"`, `IW` = `"teammate-message"`, `az` = `"team-lead"`
- `eK()` — feature-enable predicate

Helpers:
- `eK` — agent-team feature gate
- `In(name, teamName)` — build agent id `name@teamName`
- `hwH(teamName)` — team file path
- `Ci(teamName)` — team-name sanitizer
- `o38(name, config, opts)` — create team file with `{exclusive: true}` semantics
- `a38(teamName)` — remove team and task directories
- `ZE6(teamName)` — post-create team-side hooks (e.g., initial members write)
- `eM6(teamFilePath)` — initialize teammates state file
- `o88(teamFilePath)` — ensure parent directories
- `X67(teamFilePath)` — set team file's permissions
- `WE6()` — teammate-mode string for telemetry (`"in_process"` vs other)
- `GE6(teamName)` — post-delete team-side cleanup
- `L67()` — clear shared team state
- `N2(teamName)` — read team file's parsed contents

---

## TeamCreate — Bootstrapping a Team

```javascript
// ============================================
// TeamCreateTool - The "I want to lead a team" tool
// Location: cli_inner_pretty.js:386243-386345
// ============================================

// ORIGINAL (for source lookup, full call() body):
JH5 = XK({
  name: Am,                                       // "TeamCreate"
  searchHint: "create a multi-agent swarm team",
  maxResultSizeChars: 1e5,
  shouldDefer: !0,
  userFacingName() { return ""; },
  get inputSchema() { return jH5(); },
  isEnabled() { return eK(); },
  toAutoClassifierInput(H) { return H.team_name; },
  async validateInput(H, $) {
    if (!H.team_name || H.team_name.trim().length === 0)
      return { result: !1, message: "team_name is required for TeamCreate", errorCode: 9 };
    return { result: !0 };
  },
  async description() { return "Create a new team for coordinating multiple agents"; },
  async prompt() { return Gi7(); },
  mapToolResultToToolResultBlockParam(H, $) { /* … */ },
  async call(H, $) {
    let { setAppState: q, getAppState: K } = $,
      { team_name: _, description: A, agent_type: z } = H,
      Y = K(), f = Y.teamContext?.teamName;
    if (f) throw Error(`Already leading team "${f}". …Use ${St} to end the current team before creating a new one.`);
    let O = _, M = In(az, O),                     // agentId = "team-lead@<team>"
      w = z || az, D = n7(Y.mainLoopModelForSession ?? Y.mainLoopModel ?? gJ()),
      j = Ci(O), J = {
        name: O, description: A, createdAt: Date.now(),
        leadAgentId: M, leadSessionId: v$(),
        members: [{
          agentId: M, name: az, agentType: w, model: D,
          joinedAt: Date.now(), tmuxPaneId: "",
          cwd: I$(), subscriptions: [],
        }],
      };
    try { await o38(O, J, { exclusive: !0 }); }
    catch (P) {
      if (O8(P) === "EEXIST" && mk$(P) === j)
        throw Error(`Team "${O}" already exists at ${j}. Choose a different team_name, or run ${St} on the existing team first.`);
      throw P;
    }
    ZE6(O);
    let X = hwH(O);
    (await o88(X), await eM6(X), X67(hwH(O)));
    let L = $.teammateColors.assign(M);
    return (
      q((P) => ({
        ...P,
        teamContext: {
          teamName: O,
          teamFilePath: j,
          leadAgentId: M,
          teammates: {
            [M]: {
              name: az, agentType: w, color: L,
              tmuxSessionName: "", tmuxPaneId: "",
              cwd: I$(), spawnedAt: Date.now(),
            },
          },
        },
      })),
      d("tengu_team_created", { team_name: O, teammate_count: 1, lead_agent_type: w, teammate_mode: WE6() }),
      { data: { team_name: O, team_file_path: j, lead_agent_id: M } }
    );
  },
  renderToolUseMessage: Ti7,
});

// READABLE (for understanding):
TeamCreateTool = registerTool({
  name: TEAM_CREATE_NAME,                            // "TeamCreate"
  searchHint: "create a multi-agent swarm team",
  maxResultSizeChars: 100000,
  shouldDefer: true,                                  // tool surfaces via ToolSearch, not eager
  userFacingName() { return ""; },                    // hidden from default tool list
  inputSchema: buildTeamCreateSchema(),
  isEnabled() { return isAgentTeamFeatureEnabled(); },
  toAutoClassifierInput(input) { return input.team_name; },

  async validateInput(input, ctx) {
    if (!input.team_name || input.team_name.trim().length === 0) {
      return { result: false, message: "team_name is required for TeamCreate", errorCode: 9 };
    }
    return { result: true };
  },

  async description() { return "Create a new team for coordinating multiple agents"; },
  async prompt() { return getTeamCreatePromptDoc(); },

  async call(input, ctx) {
    const { setAppState, getAppState } = ctx;
    const { team_name, description, agent_type } = input;
    const state = getAppState();
    const existingTeam = state.teamContext?.teamName;

    // (a) Refuse if leader already has a team.
    if (existingTeam) {
      throw new Error(
        `Already leading team "${existingTeam}". A leader can only manage one team at a time. ` +
        `Use ${TEAM_DELETE_NAME} to end the current team before creating a new one.`,
      );
    }

    const teamName = team_name;
    const leadAgentId = buildTeammateAgentId(LEAD_NAME, teamName);    // "team-lead@<team>"
    const leadAgentType = agent_type || LEAD_NAME;
    const leadModel = normalizeModelName(
      state.mainLoopModelForSession ?? state.mainLoopModel ?? getDefaultModel(),
    );
    const teamFilePath = sanitizeTeamName(teamName);
    const teamConfig = {
      name: teamName, description, createdAt: Date.now(),
      leadAgentId, leadSessionId: currentSessionId(),
      members: [{
        agentId: leadAgentId, name: LEAD_NAME, agentType: leadAgentType, model: leadModel,
        joinedAt: Date.now(), tmuxPaneId: "",
        cwd: currentCwd(), subscriptions: [],
      }],
    };

    // (b) Create team file with O_EXCL (exclusive: true).
    try {
      await createTeamFileExclusive(teamName, teamConfig, { exclusive: true });
    } catch (e) {
      if (errnoOf(e) === "EEXIST" && pathOfError(e) === teamFilePath) {
        throw new Error(
          `Team "${teamName}" already exists at ${teamFilePath}. ` +
          `Choose a different team_name, or run ${TEAM_DELETE_NAME} on the existing team first.`,
        );
      }
      throw e;
    }
    runPostCreateTeamHooks(teamName);

    // (c) Set up directories.
    const teamDir = teamFilePathForTeam(teamName);
    await ensureParentDirectory(teamDir);
    await initializeTeammatesStateFile(teamDir);
    setTeamFilePermissions(teamFilePath);

    // (d) Allocate the lead's color.
    const leadColor = ctx.teammateColors.assign(leadAgentId);

    // (e) Mutate AppState — install the teamContext.
    setAppState((prev) => ({
      ...prev,
      teamContext: {
        teamName,
        teamFilePath,
        leadAgentId,
        teammates: {
          [leadAgentId]: {
            name: LEAD_NAME, agentType: leadAgentType, color: leadColor,
            tmuxSessionName: "", tmuxPaneId: "",
            cwd: currentCwd(), spawnedAt: Date.now(),
          },
        },
      },
    }));

    // (f) Emit telemetry.
    emitTelemetry("tengu_team_created", {
      team_name: teamName,
      teammate_count: 1,
      lead_agent_type: leadAgentType,
      teammate_mode: getTeammateMode(),
    });

    return { data: { team_name: teamName, team_file_path: teamFilePath, lead_agent_id: leadAgentId } };
  },

  renderToolUseMessage: renderTeamCreateUseMessage,
});

// Mapping: JH5→TeamCreateTool, Am→TEAM_CREATE_NAME, St→TEAM_DELETE_NAME, az→LEAD_NAME,
//          H→input, $→ctx, q→setAppState, K→getAppState, _→team_name (alias), A→description,
//          z→agent_type, Y→state, f→existingTeam, O→teamName, M→leadAgentId, w→leadAgentType,
//          D→leadModel, j→teamFilePath, J→teamConfig, X→teamDir, L→leadColor,
//          In→buildTeammateAgentId, Ci→sanitizeTeamName, o38→createTeamFileExclusive,
//          eK→isAgentTeamFeatureEnabled, ZE6→runPostCreateTeamHooks, hwH→teamFilePathForTeam,
//          o88→ensureParentDirectory, eM6→initializeTeammatesStateFile, X67→setTeamFilePermissions,
//          WE6→getTeammateMode, v$→currentSessionId, I$→currentCwd, gJ→getDefaultModel,
//          n7→normalizeModelName, mk$→pathOfError, O8→errnoOf
```

### Key Design Decisions in TeamCreate

#### 1. One Team Per Session

The early check `if (f) throw …` enforces that a leader runs at most one
team at a time. Rationale:

- **State coherence.** `teamContext` is a singleton in `AppState`.
  Multiple teams would require either an array (complicating every reader)
  or a "current active team" pointer (with synchronization headaches).
- **Mailbox routing simplicity.** The teammate's poll loop reads `~/.claude/{team}/inboxes/{name}.json`.
  A leader managing two teams could have ambiguous routing for messages
  with overlapping recipient names.
- **UI clarity.** The bg-task dialog and the spinner tree show
  "the team's teammates"; "two teams" would force per-team filtering and
  selection, doubling UI complexity for a use case ("manage multiple teams
  simultaneously") that has no clear user need.

If a leader needs to coordinate two distinct cohorts, the recommended
pattern is to spawn a *teammate* as the second team's leader and let
recursion handle the additional structure — though in practice this
recursion is not common.

#### 2. `O_EXCL` Team File Creation

```javascript
try { await o38(O, J, { exclusive: !0 }); }
catch (P) {
  if (O8(P) === "EEXIST" && mk$(P) === j)
    throw Error(`Team "${O}" already exists at ${j}. …`);
  throw P;
}
```

Team-file creation uses `O_EXCL` semantics — the file must NOT already
exist. If it does (EEXIST and the path matches), we throw a *user-friendly*
error pointing them to either rename or `TeamDelete`. Other failures
(disk full, permission denied) propagate as-is.

This catches the case where the user previously created a team, the
process died ungracefully without cleanup, and they try to create the same
team again. They'd hit EEXIST and be guided to use TeamDelete to remove
the stale file before retrying.

#### 3. Leader Identity = `team-lead@<teamName>`

The leader's agentId is constructed by `In(az, O)` (`buildTeammateAgentId(LEAD_NAME, teamName)`):

```
agentId = "team-lead@research-fall"
```

This is the same convention as for teammates (`name@teamName`); the leader
is just another member of the team's `members` array with `name === "team-lead"`.
This uniformity matters: SendMessage's `to:` resolution doesn't need to
special-case the leader. The leader's mailbox is at
`~/.claude/research-fall/inboxes/team-lead.json` like any other member.

#### 4. The `teammates` Map vs `members` Array

Two parallel data structures:

- **`teamConfig.members`** — array, persisted to `team.json` on disk. The
  authoritative team membership. Teammates can be added/removed by editing
  this array.
- **`AppState.teamContext.teammates`** — map, in-memory only. Cached
  per-teammate state (color, tmux pane, spawn timestamp). Indexed by
  `agentId` for O(1) lookup during the UI render path.

Both are updated atomically: TeamCreate writes to both; spawning a
teammate adds to both; killing a teammate removes from `teammates` map
but the `members` array entry may persist (a member can be inactive but
re-spawnable).

#### 5. Color Assignment

`teammateColors.assign(leadAgentId)` returns the next color from a fixed
palette, deterministically tied to the agentId. The same teammate spawned
again later gets the same color (modulo palette exhaustion). Colors are
used in:

- The `<teammate-message color="...">` XML attribute for transcript
  rendering.
- The bg-task dialog's row labels.
- The spinner tree (each teammate's spinner is its color).
- The transcript-view header band.

The lead always gets a distinguishable color (typically yellow/gold,
though this is palette-driven).

---

## TeamDelete — Disbanding

```javascript
// ============================================
// TeamDeleteTool - Tear down the team
// Location: cli_inner_pretty.js:386387-386445
// ============================================

// ORIGINAL (for source lookup):
LH5 = XK({
  name: St,
  searchHint: "disband a swarm team and clean up",
  shouldDefer: !0,
  isEnabled() { return eK(); },
  async description() { return "Clean up team and task directories when the swarm is complete"; },
  async prompt() { return ki7(); },
  async call(H, $) {
    let { setAppState: q, getAppState: K } = $,
      A = K().teamContext?.teamName;
    if (A) {
      let z = N2(A);                                  // read team file
      if (z) {
        let f = z.members.filter((O) => O.name !== az).filter((O) => O.isActive !== !1);
        if (f.length > 0) {
          let O = f.map((M) => M.name).join(", ");
          return {
            data: {
              success: !1,
              message: `Cannot cleanup team with ${f.length} active member(s): ${O}. Use requestShutdown to gracefully terminate teammates first.`,
              team_name: A,
            },
          };
        }
      }
      (await a38(A), GE6(A), $.teammateColors.clear(), L67(), d("tengu_team_deleted", { team_name: A }));
    }
    return (
      q((z) => ({ ...z, teamContext: void 0, inbox: { messages: [] } })),
      {
        data: {
          success: !0,
          message: A
            ? `Cleaned up directories and worktrees for team "${A}"`
            : "No team name found, nothing to clean up",
          team_name: A,
        },
      }
    );
  },
});

// READABLE (for understanding):
TeamDeleteTool = registerTool({
  name: TEAM_DELETE_NAME,
  searchHint: "disband a swarm team and clean up",
  shouldDefer: true,
  isEnabled() { return isAgentTeamFeatureEnabled(); },
  async description() { return "Clean up team and task directories when the swarm is complete"; },
  async prompt() { return getTeamDeletePromptDoc(); },

  async call(input, ctx) {
    const { setAppState, getAppState } = ctx;
    const teamName = getAppState().teamContext?.teamName;

    if (teamName) {
      const teamConfig = readTeamConfig(teamName);
      if (teamConfig) {
        // Filter out the lead, filter out explicitly inactive members.
        const activeNonLead = teamConfig.members
          .filter((m) => m.name !== LEAD_NAME)
          .filter((m) => m.isActive !== false);

        if (activeNonLead.length > 0) {
          const names = activeNonLead.map((m) => m.name).join(", ");
          return {
            data: {
              success: false,
              message: `Cannot cleanup team with ${activeNonLead.length} active member(s): ${names}. ` +
                       `Use requestShutdown to gracefully terminate teammates first.`,
              team_name: teamName,
            },
          };
        }
      }
      // Safe to proceed: tear down directories, run post-delete hooks, clear colors, etc.
      await removeTeamAndTaskDirectories(teamName);
      runPostDeleteTeamHooks(teamName);
      ctx.teammateColors.clear();
      clearSharedTeamState();
      emitTelemetry("tengu_team_deleted", { team_name: teamName });
    }

    // Always clear teamContext and inbox, even if no team existed.
    setAppState((prev) => ({ ...prev, teamContext: undefined, inbox: { messages: [] } }));
    return {
      data: {
        success: true,
        message: teamName
          ? `Cleaned up directories and worktrees for team "${teamName}"`
          : "No team name found, nothing to clean up",
        team_name: teamName,
      },
    };
  },
});

// Mapping: LH5→TeamDeleteTool, A→teamName, z→teamConfig, f→activeNonLead, O→names,
//          a38→removeTeamAndTaskDirectories, GE6→runPostDeleteTeamHooks, L67→clearSharedTeamState,
//          N2→readTeamConfig
```

### Why TeamDelete Refuses If Members Are Active

A teammate with `isActive !== false` is considered live — either currently
running or pending re-spawn. Force-deleting the team while teammates run
would:

1. **Leave orphaned task records.** The in-memory `tasks[id]` entries for
   each teammate would lose their team context but keep running.
2. **Lose unread mailbox traffic.** Each teammate may still have unread
   messages in its inbox; deleting the inbox file mid-read would crash
   the teammate.
3. **Confuse the lead.** The lead's UI would still show teammate panels
   without backing config — render errors and stale state would
   accumulate.

So the design is: **first** ask each teammate to shut down (via
`SendMessage({to, message: {type: "shutdown_request"}})`), **wait** for
their `shutdown_response`, **then** call `TeamDelete`.

The error message explicitly names the active members and points to
`requestShutdown` so the model can do the right thing without guessing.

### What `a38` Removes

`removeTeamAndTaskDirectories(teamName)` deletes:

- `~/.claude/{teamName}/` (the team config, the inboxes, the tasks.json)
- `~/.claude/tasks/{teamName}/` (the task scratchpad directory)
- Any worktrees keyed to the team (via the worktree manifest)

The leader's session-level state (history, transcript, settings) is *not*
touched — that's session-scoped, not team-scoped.

### `inbox: { messages: [] }` Reset

`setAppState((prev) => ({ ...prev, teamContext: undefined, inbox: { messages: [] } }))`
also resets the leader's `inbox.messages` field (the in-memory cache of
the leader's inbox content). This avoids the leader continuing to see
teammate messages from the now-deleted team's history.

---

## SendMessage — The Single Inter-Agent Primitive

```javascript
// ============================================
// SendMessageTool - The single send-to-recipient tool for inter-agent traffic
// Location: cli_inner_pretty.js:387042-387199
// ============================================

// ORIGINAL (for source lookup, validateInput body already shown in mailbox_protocol.md):
SH5 = XK({
  name: mZ,
  searchHint: "send messages to agent teammates (swarm protocol)",
  maxResultSizeChars: 1e5,
  userFacingName() { return "SendMessage"; },
  shouldDefer: !0,
  isEnabled() { return eK(); },
  isReadOnly(H) { return typeof H.message === "string"; },
  backfillObservableInput(H) { /* … pretty-prints for telemetry … */ },
  toAutoClassifierInput(H) { /* … humanizes per type … */ },
  async checkPermissions(H, $) { return { behavior: "allow", updatedInput: H }; },
  async validateInput(H, $) { /* see mailbox_protocol.md "SendMessage Tool: The Public Wire" */ },
  async description() { return mi7; },
  async prompt() { return Bi7(); },

  async call(H, $, q, K) {
    if (typeof H.message === "string") {
      let _ = $.getAppState(),
        z = _.agentNameRegistry.get(H.to) ?? HcK(H.to);
      if (z) {
        let Y = _.tasks[z];
        if (VX(Y) && !LL$(Y)) {                                   // is local-agent and not in terminal
          if (Y.status === "running")
            return (
              t38(z, H.message, $.taskRegistry, { origin: { kind: "coordinator" }, isMeta: !0 }),
              { data: { success: !0, message: `Message queued for delivery to ${H.to} at its next tool round.` } }
            );
          /* stopped → resume via uiH() in background */
          try {
            let f = await uiH({ agentId: z, prompt: H.message, toolUseContext: $, canUseTool: q, invokingRequestId: K?.requestId });
            return { data: { success: !0, message: `Agent "${H.to}" was stopped (${Y.status}); resumed it in the background with your message. You'll be notified when it finishes. Output: ${f.outputFile}` } };
          } catch (f) { /* fail */ }
        } else
          try {
            let f = await uiH({ agentId: z, prompt: H.message, toolUseContext: $, canUseTool: q, invokingRequestId: K?.requestId });
            return { data: { success: !0, message: `Agent "${H.to}" had no active task; resumed from transcript in the background with your message. You'll be notified when it finishes. Output: ${f.outputFile}` } };
          } catch (f) { /* fail */ }
      }
    }
    if (typeof H.message === "string") return kH5(H.to, H.message, H.summary, $);
    switch (H.message.type) {
      case "shutdown_request":     return NH5(H.to, H.message.reason, $);
      case "shutdown_response":    if (H.message.approve) return EH5(H.message.request_id, $);
                                   return yH5(H.message.request_id, H.message.reason);
      case "plan_approval_response": if (H.message.approve) return hH5(H.to, H.message.request_id, $);
                                     return IH5(H.to, H.message.request_id, H.message.feedback ?? "Plan needs revision", $);
    }
  },
  renderToolUseMessage: Ui7,
  renderToolResultMessage: Fi7,
});

// READABLE (for understanding):
SendMessageTool = registerTool({
  name: SEND_MESSAGE_NAME,
  searchHint: "send messages to agent teammates (swarm protocol)",
  maxResultSizeChars: 100000,
  userFacingName() { return "SendMessage"; },
  shouldDefer: true,
  isEnabled() { return isAgentTeamFeatureEnabled(); },
  isReadOnly(input) { return typeof input.message === "string"; },

  backfillObservableInput(input) {
    /* Pretty-prints `to` / `type` / `recipient` / `content` for the telemetry record so
       string and structured payloads look uniform. */
  },

  toAutoClassifierInput(input) {
    /* Renders a one-line "what does this tool call do?" string for the LLM-based
       classifier that gates auto-mode tool calls. */
  },

  async checkPermissions(input, ctx) {
    // SendMessage is always allowed — it's a metadata-only operation (writes inbox files)
    // and individual recipients enforce their own access via the mailbox/runtime.
    return { behavior: "allow", updatedInput: input };
  },

  async validateInput(input, ctx) {
    // See mailbox_protocol.md for the full rules: to !== "", to !== "*",
    // address schemes, structured-payload-specific checks.
  },

  async description() { return SEND_MESSAGE_DESCRIPTION; },
  async prompt() { return getSendMessagePromptDoc(); },

  async call(input, ctx, canUseTool, invocationCtx) {
    // ───────── Fast-path: local agent dispatch by name ─────────
    // If `to` resolves to a local_agent (not a teammate), route the message
    // straight into that agent's task instead of writing to a mailbox file.
    if (typeof input.message === "string") {
      const state = ctx.getAppState();
      const targetAgentId = state.agentNameRegistry.get(input.to) ?? resolveAgentNameAsId(input.to);
      if (targetAgentId) {
        const targetTask = state.tasks[targetAgentId];
        if (isLocalAgentTask(targetTask) && !isTerminalTaskStatus(targetTask)) {
          if (targetTask.status === "running") {
            queuePendingLocalAgentMessage(
              targetAgentId, input.message, ctx.taskRegistry,
              { origin: { kind: "coordinator" }, isMeta: true },
            );
            return { data: { success: true,
                             message: `Message queued for delivery to ${input.to} at its next tool round.` } };
          }
          // Target is stopped/idle — try to resume from transcript.
          try {
            const result = await resumeAgentInBackground({
              agentId: targetAgentId, prompt: input.message,
              toolUseContext: ctx, canUseTool,
              invokingRequestId: invocationCtx?.requestId,
            });
            return { data: { success: true,
                             message: `Agent "${input.to}" was stopped (${targetTask.status}); ` +
                                      `resumed it in the background with your message. ` +
                                      `You'll be notified when it finishes. Output: ${result.outputFile}` } };
          } catch (e) {
            return { data: { success: false,
                             message: `Agent "${input.to}" is stopped (${targetTask.status}) ` +
                                      `and could not be resumed: ${describeErr(e)}` } };
          }
        } else {
          // No active task; try to resume from transcript anyway.
          try {
            const result = await resumeAgentInBackground({
              agentId: targetAgentId, prompt: input.message,
              toolUseContext: ctx, canUseTool,
              invokingRequestId: invocationCtx?.requestId,
            });
            return { data: { success: true,
                             message: `Agent "${input.to}" had no active task; ` +
                                      `resumed from transcript in the background with your message. ` +
                                      `You'll be notified when it finishes. Output: ${result.outputFile}` } };
          } catch (e) {
            return { data: { success: false,
                             message: `Agent "${input.to}" has no transcript to resume. ` +
                                      `It may have been cleaned up. (${describeErr(e)})` } };
          }
        }
      }
    }

    // ───────── Slow-path: mailbox-routed message ─────────
    if (typeof input.message === "string") {
      return sendStringMessage(input.to, input.message, input.summary, ctx);
    }

    switch (input.message.type) {
      case "shutdown_request":
        return sendShutdownRequest(input.to, input.message.reason, ctx);
      case "shutdown_response":
        if (input.message.approve)
          return approveShutdown(input.message.request_id, ctx);
        return rejectShutdown(input.message.request_id, input.message.reason);
      case "plan_approval_response":
        if (input.message.approve)
          return approvePlan(input.to, input.message.request_id, ctx);
        return rejectPlan(input.to, input.message.request_id,
                          input.message.feedback ?? "Plan needs revision", ctx);
    }
  },

  renderToolUseMessage: renderSendMessageUseMessage,
  renderToolResultMessage: renderSendMessageResultMessage,
});

// Mapping: SH5→SendMessageTool, mZ→SEND_MESSAGE_NAME, H→input, $→ctx, q→canUseTool, K→invocationCtx,
//          _→state, z→targetAgentId, Y→targetTask, f→result,
//          VX→isLocalAgentTask, LL$→isTerminalTaskStatus,
//          t38→queuePendingLocalAgentMessage, uiH→resumeAgentInBackground,
//          HcK→resolveAgentNameAsId,
//          kH5→sendStringMessage, NH5→sendShutdownRequest, EH5→approveShutdown,
//          yH5→rejectShutdown, hH5→approvePlan, IH5→rejectPlan
```

### Routing Decision Tree

SendMessage's `call` body is the routing brain. The decision flow:

```
                   ┌──────────────────────────────┐
                   │      input.message type?     │
                   └──┬───────────────┬───────────┘
                      │ string        │ {type: …}
                      ▼               ▼
            ┌─────────────────┐  ┌──────────────────────────────┐
            │ Resolve `to` to │  │ switch (message.type) {       │
            │  agent ID via   │  │   shutdown_request →          │
            │  agentNameRegis │  │     sendShutdownRequest       │
            │   try / id-resolve│  │   shutdown_response →         │
            └───┬─────────────┘  │     approve/reject             │
                │                │   plan_approval_response →     │
                ▼                │     approvePlan/rejectPlan     │
       ┌──────────────────┐      │ }                              │
       │ Is it a local_   │      └──────────────────────────────┘
       │ agent (not       │
       │ in-process       │
       │ teammate) task?  │
       └──┬──────────┬────┘
          │ Yes      │ No
          ▼          ▼
   ┌─────────────┐  ┌──────────────────────────────┐
   │ Status?     │  │ Fall through to              │
   ├──────────────┤  │ sendStringMessage           │
   │ running →   │  │ (mailbox write)             │
   │   queue     │  └──────────────────────────────┘
   │ pending     │
   │ msg         │
   │             │
   │ killed/     │
   │ completed → │
   │   resumeIn  │
   │   Background│
   │             │
   │ pending →   │
   │   resumeIn  │
   │   Background│
   └─────────────┘
```

### Why Local-Agent Fast Path?

A `SendMessage({to: "<agent-id-of-a-local-agent>", message: "..."})` from
a coordinator (e.g., the v2.1.88 coordinator-mode REPL) needs **immediate
intra-process delivery** — there's no mailbox-file polling involved
because local_agent tasks don't use mailbox files.

The fast path:

1. **`running` agent**: Push to `pendingMessages[]` queue (drained at
   next tool-round boundary). Returns immediately.
2. **`killed` / `completed` / `failed` agent**: Call
   `resumeAgentInBackground` to **resurrect** the agent from its on-disk
   transcript, threading the new message as its prompt. Returns
   immediately; the agent runs in the background.
3. **Pending agent (registered but loop not yet started)**: Same resume
   path.

The resume path is significant — it's how a coordinator can "continue" a
worker whose task already completed. The worker's transcript is replayed
into a fresh agent loop with the new message appended as the next user
turn. The model gets back its full context as if the conversation had
never ended.

This fast path is **only** reached when `agentNameRegistry.get(input.to)`
or `resolveAgentNameAsId(input.to)` returns a non-null agentId AND that ID
maps to a `local_agent` task. Teammate names (`name@team`) and bridge
addresses fall through to the slow path.

### Structured Message Handlers

Each structured message routes to a dedicated handler. The five:

| message.type | Handler | Behavior |
|--------------|---------|----------|
| `shutdown_request` | `sendShutdownRequest` (`NH5`) | Write `{type: "shutdown_request", from: senderName, request_id, reason}` to recipient's inbox |
| `shutdown_response` (approve=true) | `approveShutdown` (`EH5`) | Confirm shutdown via the leader's mailbox; teammate's runner sees this and terminates gracefully |
| `shutdown_response` (approve=false) | `rejectShutdown` (`yH5`) | Tell the requesting party the recipient refuses; sends the `reason` |
| `plan_approval_response` (approve=true) | `approvePlan` (`hH5`) | Resolves the teammate's `plan_approval_request` waiter; lets the teammate exit plan mode |
| `plan_approval_response` (approve=false) | `rejectPlan` (`IH5`) | Tells the teammate to revise its plan and stay in plan mode |

(The mirror `plan_approval_request` and the `shutdown_request` *receive*
side live in the teammate's runner — see `teammate_runner_loop.md` for
the wait-and-poll mechanism on the receive side.)

### Address Scheme Routing — `parseMailboxAddress` (`ui7`)

Already covered in `mailbox_protocol.md`. For SendMessage, the address
scheme determines the transport:

- **`other` (no prefix)** → local team mailbox file.
- **`uds:` or `/...`** → direct UDS dispatch (used by daemon for inline
  control messages; rare from model code).
- **`bridge:`** → claude.ai/code Bridge HTTPS+SSE transport. Routes the
  message to a remote session via the bridge backplane.

The address parsing happens in `validateInput`; the routing decision in
`call` is implicit (the slow-path `sendStringMessage` itself checks the
scheme via `ui7`).

---

## Interaction with the In-Process Teammate Runner

The three tools coordinate to produce the full team lifecycle:

```
Time →

leader REPL:
  /TeamCreate({team_name: "research-fall"})
      → JH5.call() registers teamContext
      → emits tengu_team_created
      → creates ~/.claude/research-fall/

leader REPL spawns teammate "alpha" via Agent tool:
  Agent({subagent_type: "researcher", team_name: "research-fall",
         agent_name: "alpha", prompt: "Investigate X"})
      → behind the scenes calls t68 (spawnInProcessTeammate)
      → adds AppState.teamContext.teammates["alpha@research-fall"]
      → starts the in-process runner (L65)

teammate "alpha" runner:
  inProcessRunnerPollLoop (X65) → returns "alpha"'s prompt
  inProcessAgentLoop (L65) → processes turn → writes back to lead inbox
  poll → eventual SendMessage({to: "team-lead", message: "Done!"})
  → SH5 routes through mailbox (slow path)
  → cA writes to ~/.claude/research-fall/inboxes/team-lead.json

leader REPL:
  Polls own inbox between turns (same skeleton as teammate)
  Sees alpha's message, displays it.

leader REPL ends team:
  SendMessage({to: "alpha", message: {type: "shutdown_request"}})
      → SH5 → NH5 → writes shutdown_request structured payload
  alpha's runner X65 sees the structured payload (priority 3)
      → returns to L65 → graceful shutdown
      → teammate transitions to status="completed"

  /TeamDelete()
      → LH5.call() sees no active members
      → tears down ~/.claude/research-fall/
      → clears teamContext
```

---

## Why These Three Tools, Not More?

A possible alternative design would split SendMessage into per-type tools
(`Shutdown`, `ApprovePlan`, `RejectPlan`, etc.) and have a separate
`InviteTeammate` tool. The choice to consolidate is deliberate:

**Single SendMessage:**
- One tool to teach the model. The schema's discriminated union (string
  or `{type: ...}`) is explicit; the model picks based on what it needs.
- Symmetric to mailbox transport. Whether the message is a plain text or
  a structured shutdown_request, it ends up in the same inbox file with
  the same envelope.
- Easier permission gating. One permission rule (`SendMessage`) covers
  all inter-agent messaging.

**TeamCreate ≠ Agent tool:**
- Agent tool spawns a subagent (potentially in-process teammate), but
  doesn't establish the *team-leader* role. The leader has team-wide
  privileges (broadcast permission updates, query members) that
  individual subagents don't.
- TeamCreate is idempotent at most-once-per-session; Agent is "spawn N
  workers". The semantic split matches the asymmetry.

**TeamDelete vs. just letting it expire:**
- Stale team files would accumulate at `~/.claude/{team}/` indefinitely
  without explicit deletion (and the worktree manifest with them).
- Cleanup is a discrete event the model can plan around: "finish
  shutting teammates down, then TeamDelete".

---

## Telemetry

| Event | When |
|-------|------|
| `tengu_team_created` | TeamCreate succeeds; includes `team_name`, `teammate_count` (always 1 at create), `lead_agent_type`, `teammate_mode` (e.g. `"in_process"`) |
| `tengu_team_deleted` | TeamDelete succeeds with a real teamName |
| `tengu_subagent_launch` | When a teammate is spawned via Agent tool (covered elsewhere) |
| `swarm_in_process_spawn` (success or failure bumps) | `spawnInProcessTeammate` succeeds or `spawn_failed` |
| `tengu_sendmessage` (sub-events) | Various SendMessage events: scheme, type, success/failure |

`teammate_mode` is `WE6()` — currently always returns `"in_process"` in
v2.1.142, but the field exists to differentiate from a possible future
`"tmux"` or `"daemon"` mode. The v2.1.112 baseline had tmux as a backend;
v2.1.142 collapses everything to in-process for the team variant
(background workers use a different code path entirely).

---

## See Also

- [teammate_runner_loop.md](./teammate_runner_loop.md) — the runner that consumes SendMessage's mailbox writes
- [mailbox_protocol.md](./mailbox_protocol.md) — the file format and lock semantics SendMessage writes through
- [team_mailbox_v_personal.md](./team_mailbox_v_personal.md) — per-recipient inbox semantics, broadcast removal, bridge scheme
- [permission_inheritance.md](./permission_inheritance.md) — `CD6` mapping at spawn time, plan_approval_request semantics
- [agent_identity_propagation.md](./agent_identity_propagation.md) — the identity context that wraps each tool's call
- v2.1.112 baseline: `30_agent_team/tools.md` for the original tool definitions (the schemas have grown but the structure is unchanged)
