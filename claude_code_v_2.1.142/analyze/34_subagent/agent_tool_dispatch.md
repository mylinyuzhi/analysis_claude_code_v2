# Agent Tool Dispatch — `call()` Handler Deep Dive (v2.1.142)

## What This Document Covers

The Agent tool (`Gu7`, cli_inner_pretty.js:351269+) is the LLM-facing entry point for subagent spawning. Its `call(input, toolUseContext, canUseTool, assistantMessage, onProgress)` handler is the **dispatcher** between the LLM's `tool_use` block and the appropriate subagent runtime: fork path, normal subagent path, or teammate spawn.

Every `Agent({...})` invocation the model emits flows through this single function. This document is the **inside** of [README.md](./README.md)'s "Entry 2" diagram — the path from the LLM's `tool_use` block to `runAgent (Vb)`.

The handler has six phases:

| Phase | Lines | Outcome |
|-------|-------|---------|
| **Preconditions** | 351312-351336 | Teammate availability gates, nested-teammate guard, in-process-teammate background guard |
| **Routing decision** | 351337-351413 | Branch into teammate spawn / fork / normal — resolves the `AgentDefinition` |
| **MCP required-server wait** | 351421-351461 | Block up to 30s for required MCP servers to finish pending → connected |
| **System prompt + messages build** | 351463-351507 | Fork path inherits parent's renderedSystemPrompt + buildForkedMessages; normal path builds its own |
| **Invocation building** | 351508-351574 | Construct the `runAgent` invocation: tools, override, isolation, worktree, async flag |
| **Sync vs async dispatch** | 351575-351619 (async) / 351635-end (sync) | `slH` wrapper for async; direct `Vb` for sync |

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_subagent.md](../00_overview/symbol_additions_v2_1_142_subagent.md)
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md)

Key functions in this document:
- `AgentTool` (`Gu7`) - the Agent tool definition (cli_inner_pretty.js:351269)
- `eq7` - the Agent tool's prompt builder (cli_inner_pretty.js:235536-235727)
- `XV6` - input schema builder (cli_inner_pretty.js:351242-351267)
- `Gu7.call` - the handler walked through this doc (cli_inner_pretty.js:351294-351619)
- `Tu7` (`registerForegroundAsyncTask`) - sync-path task registration (cli_inner_pretty.js:351672)
- `TnH` (`registerBackgroundAsyncTask`) - async-path task registration (cli_inner_pretty.js:351577)
- `tI7` - in-process teammate spawn wrapper (cli_inner_pretty.js:351340)
- `eJ$` (`createAgentWorktree`) - worktree setup (cli_inner_pretty.js:351528)
- `ZV6` - agentId-to-worktree-name resolver
- `bwH` - per-message progress event emitter (cli_inner_pretty.js:351737)
- `zz8` (`buildAgentResult`) - sync-path result aggregator
- `Yz8` (`extractAssistantText`) / `fz8` (`emitAssistantBlockProgress`) - per-block progress

## Phase 1 — Preconditions

```javascript
// ============================================
// Phase 1 — Precondition gates
// Location: cli_inner_pretty.js:351312-351336
// ============================================

// ORIGINAL (for source lookup):
let J = Date.now(),
  X = i3H() ? void 0 : K,            // model param dropped under master kill switch
  L = M.getAppState(),
  P = L.toolPermissionContext.mode,
  { taskRegistry: Z } = M;
if (z && !eK())                                          // team_name supplied but teams disabled
  throw (uH("subagent_launch", "subagent_teams_unavailable"),
    Error("Agent Teams is not yet available on your plan."));
let W = uc_({ team_name: z }, L);                        // resolve effective team_name
if (AA() && W && A)                                      // teammate calling spawn-with-name
  throw (uH("subagent_launch", "subagent_nested_teammate"),
    Error("Teammates cannot spawn other teammates — the team roster is flat. To spawn a subagent instead, omit the `name` parameter."));
if (DZ() && W && _ === !0)                               // in-process teammate + run_in_background
  throw (uH("subagent_launch", "subagent_teammate_background_denied"),
    Error("In-process teammates cannot spawn background agents. Use run_in_background=false for synchronous subagents."));

// READABLE (for understanding):
let startTime = Date.now(),
  model = isMasterKillSwitch() ? undefined : modelParam,
  appState = toolUseContext.getAppState(),
  permissionMode = appState.toolPermissionContext.mode,
  { taskRegistry } = toolUseContext;
if (team_name && !isAgentSwarmsEnabled())
  throw new SubagentLaunchError("teams_unavailable",
    "Agent Teams is not yet available on your plan.");
let effectiveTeamName = resolveTeamName({ team_name }, appState);
if (isTeammate() && effectiveTeamName && name)
  throw new SubagentLaunchError("nested_teammate",
    "Teammates cannot spawn other teammates — the team roster is flat...");
if (isInProcessTeammate() && effectiveTeamName && run_in_background === true)
  throw new SubagentLaunchError("teammate_background_denied",
    "In-process teammates cannot spawn background agents...");

// Mapping: J→startTime, X→model, L→appState, P→permissionMode, Z→taskRegistry,
//          z→team_name, A→name, _→run_in_background, W→effectiveTeamName,
//          eK→isAgentSwarmsEnabled, uc_→resolveTeamName, AA→isTeammate,
//          DZ→isInProcessTeammate, uH→SubagentLaunchError, i3H→isMasterKillSwitch
```

### Why these gates are upfront

These checks are about **invariants the LLM might violate** that we want to reject before any expensive work:

1. **`teams_unavailable`** — user tried to spawn a teammate but Agent Teams isn't on their plan. Cheap check, immediate error.
2. **`nested_teammate`** — a teammate is calling `Agent({ name: "...", team_name: "..." })` to spawn another teammate. The team roster (`TeamFile.members`) is a flat array with one `leadAgentId`. Allowing nested teammates would create members with no provenance — the lead wouldn't know who spawned whom. Better to reject than corrupt.
3. **`teammate_background_denied`** — an in-process teammate trying to spawn a background agent. In-process teammates share the leader's Node process; a background agent there would outlive its parent in undefined ways. Tmux teammates are separate processes and can manage their own background agents — only the in-process variant is gated.

### Master kill switch on `model`

The first line drops the `model` parameter under `i3H()` (`isMasterKillSwitch`). This is a future-proofing gate: an emergency rollback path that lets the model param be ignored without redeploying the binary. In v2.1.142 the predicate always returns `false`, so `model` is preserved as-is.

## Phase 2 — Routing Decision

The router has three branches: teammate spawn, fork path, normal subagent.

### 2a. Teammate spawn branch

```javascript
// cli_inner_pretty.js:351337-351356
if (W && A) {                          // effectiveTeamName AND name
  let o = $ ? M.options.agentDefinitions.activeAgents.find((_H) => _H.agentType === $) : void 0;
  if (o?.color) BOH($, o.color);       // remember color for spinner
  let $H = await tI7({                 // spawnTeammate
      name: A,
      prompt: H,
      description: q,
      team_name: W,
      use_splitpane: !0,
      plan_mode_required: Y === "plan",
      model: X ?? o?.model,
      agent_type: $,
      invokingRequestId: D?.requestId,
    }, M),
    zH = { status: "teammate_spawned", prompt: H, ...$H.data };
  return (RH("subagent_launch"), { data: zH });
}
```

This branch is taken when BOTH `team_name` (resolved) and `name` are present. The handler delegates to `tI7` (spawnTeammate) which is the multi-agent-teams entry point — see [30_agent_team/team_lifecycle_tools.md](../30_agent_team/team_lifecycle_tools.md) for the full teammate spawn flow.

The `BOH(subagent_type, color)` call caches the color for spinner UI: when the teammate's events later arrive in the parent's REPL, the renderer looks up the color by `subagent_type` rather than re-deriving it.

### 2b. Fork branch

```javascript
// cli_inner_pretty.js:351357-351366
let G = $ ?? (W0() ? void 0 : at.agentType),       // requestedType
  V = G === void 0,                                 // isForkPath
  v;                                                // resolved AgentDefinition
if (V) {
  if (M.options.querySource === `agent:builtin:${vI.agentType}` || zf6(M.messages))
    throw (uH("subagent_launch", "subagent_recursive_fork"),
      Error("Fork is not available inside a forked worker. Complete your task directly using your tools."));
  v = vI;        // FORK_AGENT
}
```

The fork path is taken when:
1. `subagent_type` is omitted (`$` is undefined),
2. AND `isForkSubagentEnabled()` (`W0`) returns true.

Otherwise, when `subagent_type` is omitted and fork is **disabled**, the handler defaults to `at` (`GENERAL_PURPOSE_AGENT`). This is the v2.1.117-and-earlier behavior preserved as the fork-disabled fallback.

The **recursive fork guard** has two checks:
- `querySource === "agent:builtin:fork"` — the *current* subagent is a fork child. The querySource is set on `toolUseContext.options` at fork spawn (cli_inner_pretty.js:393261), survives auto-compact (which rewrites messages but not `options`), and is the primary signal.
- `isInForkChild(M.messages)` (`zf6`) — message-scan fallback that looks for the `FORK_BOILERPLATE_TAG` string. Catches paths where `querySource` wasn't threaded.

If either fires, fork is rejected. The error message tells the model "you ARE the fork — execute directly".

The fork directive prompt (`zf$`/`buildChildMessage`) explicitly says "**Do NOT spawn sub-agents**". This guard is the runtime backstop for when the model ignores that instruction.

### 2c. Normal subagent branch

```javascript
// cli_inner_pretty.js:351367-351413
} else {
  let o = M.options.agentDefinitions.activeAgents,
    { allowedAgentTypes: $H } = M.options.agentDefinitions,
    zH = GnH($H ? o.filter((YH) => $H.includes(YH.agentType)) : o, L.toolPermissionContext, D7),
    _H = zH.find((YH) => YH.agentType === G);
  if (!_H) {
    /* two-pass normalized lookup — see agent_type_matching.md */
  }
  v = _H;
}
```

The normal path is the meat of [agent_type_matching.md](./agent_type_matching.md). Summary:

1. Get `activeAgents` (all registered agents).
2. Apply `allowedAgentTypes` filter (if SDK passed one as `Agent(allowedAgentTypes: [...])`).
3. Apply permission filter via `GnH` (`filterAgentsByPermission`).
4. Exact match on `agentType`.
5. On miss, two-pass normalized lookup (case/separator-insensitive).
6. Distinguish "not found" from "permission-denied" in error messages.

The result `v` is the resolved `AgentDefinition`.

### After all three branches converge

```javascript
// cli_inner_pretty.js:351414-351420 — final teammate guard
if (DZ() && W && v.background === !0)
  throw (uH("subagent_launch", "subagent_teammate_background_denied"),
    Error(`In-process teammates cannot spawn background agents. Agent '${v.agentType}' has background: true in its definition.`));
```

This second teammate-background guard is here because the *agent definition* might have `background: true` in its frontmatter (forcing async even if `run_in_background` is unset). The earlier guard only caught explicit `run_in_background=true`. Now that we know `v.background`, we can re-check.

## Phase 3 — MCP Required-Server Wait

```javascript
// ============================================
// Phase 3 — Wait for required MCP servers, then verify tools present
// Location: cli_inner_pretty.js:351421-351461
// ============================================

let E = v.requiredMcpServers,
  I = M.options.tools.filter(k0);            // MCP tools currently visible
if (E?.length) {
  let o = L.mcp.clients.some(
      (_H) => _H.type === "pending" && E.some((YH) => _H.name.toLowerCase().includes(YH.toLowerCase())),
    ),
    $H = L;
  if (o) {
    let DH = Date.now() + 30000;             // ← 30s deadline
    while (Date.now() < DH) {
      if (
        (await a8(500),                       // sleep 500ms
        ($H = M.getAppState()),
        $H.mcp.clients.some(
          (TH) => TH.type === "failed" && E.some((vH) => TH.name.toLowerCase().includes(vH.toLowerCase())),
        ))
      )
        break;                                // any required failed — give up early
      if (
        !$H.mcp.clients.some(
          (TH) => TH.type === "pending" && E.some((vH) => TH.name.toLowerCase().includes(vH.toLowerCase())),
        )
      )
        break;                                // nothing pending anymore — proceed
    }
  }
  let zH = [];
  for (let _H of $H.mcp.tools.concat(I)) {
    let YH = n7H(_H);
    if (YH && !zH.includes(YH)) zH.push(YH);
  }
  if (!c88(v, zH)) {                          // hasRequiredMcpServers check
    let _H = E.filter((YH) => !zH.some((DH) => DH.toLowerCase().includes(YH.toLowerCase())));
    throw (uH("subagent_launch", "subagent_mcp_required_missing"),
      Error(
        `Agent '${v.agentType}' requires MCP servers matching: ${_H.join(", ")}. MCP servers with tools: ${zH.length > 0 ? zH.join(", ") : "none"}. Use /mcp to configure and authenticate the required MCP servers.`,
      ));
  }
}
```

### What this solves

A plugin agent might require, say, `slack` (for `requiredMcpServers: ["slack"]`). The session may still be **connecting** to slack when the model dispatches the agent. Without this wait:

1. The agent fires.
2. Slack tools aren't loaded yet.
3. The agent fails to use slack tools (they're not in its pool).

With the wait:

1. The agent's required servers list is checked.
2. If any are `pending`, wait up to 30s in 500ms steps.
3. Two early exits: a required server `failed` (no point waiting further), or nothing required is pending anymore.
4. Once unblocked (or timeout), verify the required servers actually have tools (i.e. connected + authenticated). If not, throw with a helpful error mentioning `/mcp`.

### Why 30 seconds + 500ms polling

- **30s** is a generous upper bound. MCP servers connecting via stdio (spawning a child process) typically complete in < 5s. Connection via HTTPS can be longer for OAuth flows (the user might be hitting "approve" in a browser). 30s covers everything except disastrously slow connects.
- **500ms** polling is coarse enough to avoid CPU churn, fine enough to feel responsive. The user's spinner during this wait shows the agent is starting; 500ms granularity is invisible to the user.

### Why match by `name.toLowerCase().includes(pattern.toLowerCase())`

`requiredMcpServers: ["slack"]` matches `slack`, `slack-prod`, `my-slack-mirror` — any server whose name contains "slack" (case-insensitive). The pattern is intentionally loose because:
- Plugin authors don't know the exact server name a user will configure (they might prefix with team/env).
- Substring matching lets the plugin say "I need *something* slack-like".
- The user is in control: if they have multiple slack servers, they can configure their settings to expose the right ones.

The trade-off: a server named "slackbot" would also match. False positives are possible but rare; the alternative (exact-name matching) breaks the plugin author's ability to declare "I need X-flavored MCP".

## Phase 4 — System Prompt + Messages Build

Branches on fork path vs normal path:

```javascript
// cli_inner_pretty.js:351463-351507
if (v.color) BOH(v.agentType, v.color);          // cache color
let h = kwH(v.model, M.options.mainLoopModel, V ? void 0 : X, P);    // resolveAgentModel
M.agentLifecycle.markTypeInvoked(v.agentType);   // telemetry: agent type used in session
let C = v.getSystemPrompt({ toolUseContext: M }),
  R = g7H(v) ? mq(v.plugin) : void 0;            // plugin metadata if from plugin

d("tengu_agent_tool_selected", { /* ... lots of fields */ });

let B = f ?? v.isolation,                        // effective isolation
  u, S, x;                                       // u=systemPrompt, S=alt path, x=promptMessages

if (V) {
  // Fork path: parent's renderedSystemPrompt + buildForkedMessages
  if (M.renderedSystemPrompt) S = M.renderedSystemPrompt;
  else {
    let o = L.agent ? L.agentDefinitions.activeAgents.find((_H) => _H.agentType === L.agent) : void 0,
      $H = Array.from(L.toolPermissionContext.additionalWorkingDirectories.keys()),
      zH = await eZ(M.options.tools, M.options.mainLoopModel, $H);
    S = jb({
      mainThreadAgentDefinition: o,
      toolUseContext: M,
      customSystemPrompt: M.options.customSystemPrompt,
      defaultSystemPrompt: zH,
      appendSystemPrompt: M.options.appendSystemPrompt,
    });
  }
  x = Yf6(H, D);                  // buildForkedMessages
} else {
  // Normal path: build agent's own system prompt
  try {
    let o = Array.from(L.toolPermissionContext.additionalWorkingDirectories.keys());
    if (v.memory) d("tengu_agent_memory_loaded", { ...!1, scope: v.memory, source: "subagent" });
    u = await HX$([C], h, o);     // enhanceSystemPromptWithEnvDetails
  } catch (o) {
    N(`Failed to get system prompt for agent ${v.agentType}: ${ZH(o)}`);
  }
  x = [w8({ content: H })];       // single user message: prompt text
}
```

### Why the fork path needs the parent's `renderedSystemPrompt`

For the fork-cache trick (see [fork_lifecycle.md](./fork_lifecycle.md)) to work, the API request prefix must be **byte-identical** to the parent's. The system prompt is part of that prefix. If the fork re-built the system prompt from scratch, GrowthBook flag flips between the parent's turn-start and the fork's spawn could cause divergence — different model picks, different reminder injection, different tool descriptions — busting cache.

The fork inherits `toolUseContext.renderedSystemPrompt` directly. This is the **rendered bytes** of the parent's prompt, captured before any GrowthBook re-evaluation. As long as the parent had it captured, the fork uses it as-is.

The fallback (re-derive via `buildEffectiveSystemPrompt`/`jb`) is for safety only — if `renderedSystemPrompt` is missing, the fork tries to reconstruct, accepting potential cache miss.

### `Yf6(H, D)` = buildForkedMessages

This is the *crucial* function that constructs the assistant message + user message pair for the fork child:
- Assistant message: cloned from the parent's tool-use assistant message (all tool_use blocks).
- User message: placeholder tool_results (identical across forks) + per-child directive text.

Identical-prefix structure enables the prompt-cache sharing. See [fork_lifecycle.md](./fork_lifecycle.md) for the deep dive.

### Normal path: `getSystemPrompt + HX$ enhancement`

For non-fork agents, the system prompt is built fresh each spawn:

1. `v.getSystemPrompt({ toolUseContext })` — call the agent definition's prompt builder. For built-ins, this is usually a static string. For `claude-code-guide`, it's a closure that includes the user's config.
2. `HX$([C], h, o)` — call `enhanceSystemPromptWithEnvDetails`, which adds environment metadata (working directory, model name, tools list, etc.) suffixed to the prompt.

A `try`/`catch` wraps the build so a bug in `getSystemPrompt` doesn't crash the spawn — `runAgent` will use a default fallback prompt (`Ka7`).

### Telemetry: `tengu_agent_memory_loaded`

For an agent with `memory: "user"|"project"|"local"` frontmatter, this telemetry fires with the memory scope. Memory loading happens inside `runAgent` via `loadAgentMemoryPrompt`; the telemetry is here at the dispatcher level so it fires *before* the spawn, giving a count of "agent X was spawned with memory loaded" independent of whether the spawn succeeds.

## Phase 5 — Invocation Building

```javascript
// cli_inner_pretty.js:351508-351574
let F = {                                          // metadata for task registry
    prompt: H, resolvedAgentModel: h, isBuiltInAgent: rj(v),
    startTime: J, agentType: v.agentType,
    isAsync: (_ === !0 || v.background === !0) && !ZnH,
    source: v.source, pluginId: R,
  },
  g = !1, Q = W0(), c = !1,
  l = (_ === !0 || v.background === !0 || g || Q || c) && !ZnH,    // ← isAsync
  r = { ...L.toolPermissionContext, mode: v.permissionMode ?? "acceptEdits" },
  KH = M.getAppState(),
  HH = vHH(r, KH.mcp.tools.concat(I), { skipReplFilter: !0, skillTools: KH.skillTools }),
  qH = hm(),                                                            // ← new agentId
  a = RD()?.agentId,                                                     // parentAgentId via ALS
  t = null;
if (B === "worktree") t = await eJ$(ZV6(qH));                            // createAgentWorktree
if (V && t) x.push(w8({ content: ff6(I$(), t.worktreePath) }));          // append worktree notice to fork prompt

let MH = {
    agentDefinition: v,
    promptMessages: x,
    toolUseContext: M,
    canUseTool: w,
    name: A,
    isAsync: l,
    querySource: M.options.querySource ?? HdH(v.agentType, rj(v)),
    spawnedBySkill: M.options.spawnedBySkill ?? M.options.activeSkill,
    model: V ? void 0 : X,
    override: V
      ? {
          systemPrompt: S,
          replHydration: { kind: "fork", log: [...(M.getReplContexts()[M.agentId ?? LZH]?.replayLog ?? [])] },
        }
      : u && !t && !O                                                    // not in worktree, no cwd override → use built prompt
        ? { systemPrompt: r4(u) }
        : void 0,                                                         // worktree path needs re-derive
    availableTools: V ? M.options.tools : HH,                             // fork inherits parent's pool
    forkContextMessages: V ? M.messages : void 0,                         // fork only
    ...(V && { useExactTools: !0 }),                                      // fork sentinel
    worktreePath: t?.worktreePath,
    cwd: O,
    description: q,
  },
  wH = O ?? t?.worktreePath,                                              // effective cwd
  e = async () => {                                                       // worktree cleanup closure
    if (!t) return {};
    /* check if worktree has changes; remove if not; write metadata if removed */
  };
```

### Key things to notice

**`isAsync` (`l`) computation** is the disjunction:
```
isAsync = (run_in_background==true OR agent.background==true OR /* g, Q, c are session-level autobackground flags */) AND !isBackgroundDisabled
```
- `_ === !0` → user/model explicitly opted in.
- `v.background === !0` → agent definition forces background (e.g. verification agent, claude FleetView).
- `g`, `Q`, `c` → session-level autobackground flags. `Q = W0()` (fork enabled) — forks default to async.
- `!ZnH` → master flag enabling background tasks at all.

**`r` is the agent's permission context**: `mode: v.permissionMode ?? "acceptEdits"`. Note the default: if the agent doesn't specify `permissionMode`, it's `acceptEdits` (NOT inheriting the parent's mode). This is different from what `runAgent`'s inner permission closure does (which inherits unless agent overrides). The discrepancy is because **`r` here is used for tool-pool filtering**, not for the agent's runtime permission decisions.

**`HH = vHH(r, tools, ...)`** is the pre-filtered tool pool. The agent will see exactly this subset (plus any MCP tools loaded by `initializeAgentMcpServers` in `runAgent`).

**`qH = hm()`** is the new agentId — a UUID. **`a = RD()?.agentId`** reads the parent's agentId from ALS (if the parent is itself a subagent). These two flow into the ALS context object built next.

**`t` is the worktree result**, set only when `B === "worktree"`. `createAgentWorktree` (`eJ$`) shells out to `git worktree add` to create a sibling worktree. The agent's runtime then runs with `wH` (`cwd ?? worktreePath`) as its working directory.

### The fork-specific worktree notice

```javascript
if (V && t) x.push(w8({ content: ff6(I$(), t.worktreePath) }));
```

When a fork inherits isolation `worktree`, an additional user message is appended explaining the situation: "you've inherited context from parent at PARENT_CWD; you're operating in worktree at WT_PATH; re-read files before editing". This appears AFTER the fork directive but is part of the user-side payload, not a system prompt addition — keeping the cache prefix safe.

### Cleanup closure `e`

`e` is a thunk that runs at agent finish to handle worktree cleanup:
- If the worktree was unchanged from the agent's start commit, remove it and write metadata that records this.
- If it had changes, log the path and let the user decide.
- The `hook_based` flag (set by hook-driven worktree creation) means keep the worktree without verification.

`e()` returns `{}`, `{worktreePath}`, or `{worktreePath, worktreeBranch}` for the final result envelope. The caller decides what to surface to the user (e.g. "your changes are in worktree X").

## Phase 6 — Dispatch Branch

The two branches diverge significantly. Async wraps everything in a registered task; sync is a direct generator consume.

### Async path (line 351575+)

```javascript
if (l) {                                       // isAsync
  let o = qH,                                   // agentId
    $H = TnH({                                  // register background task
      agentId: o,
      description: q,
      prompt: H,
      selectedAgent: v,
      taskRegistry: Z,
      toolUseId: M.toolUseId,
      cwd: wH,
    });
  if (A) M.agentLifecycle.registerName(A, Zz(o));   // register name → agentId mapping (for SendMessage)
  let zH = {                                         // ALS context for subagent
    agentId: o, parentAgentId: a, parentSessionId: CU(),
    agentType: "subagent", subagentName: v.agentType,
    isBuiltIn: rj(v),
    invokingRequestId: D?.requestId,
    invocationKind: "spawn",
    invocationEmitted: !1,
  };
  RU(zH, () =>                                       // ALS-wrap
    Jq$(wH, () =>                                    // cwd-wrap
      slH({                                          // runSubagentLifecycle
        taskId: $H.agentId,
        abortController: $H.abortController,
        makeStream: (YH, DH) =>
          Vb({                                       // ← runAgent
            ...MH,
            override: { ...MH.override, agentId: Zz($H.agentId), abortController: $H.abortController },
            onCacheSafeParams: YH,
            onQueryProgress: DH,
          }),
        metadata: F, description: q, toolUseContext: M, taskRegistry: Z,
        agentIdForCleanup: o,
        enableSummarization: g || W0() || Ko(),
        getWorktreeResult: e,
      }),
    ),
  );
  let _H = M.options.tools.some((YH) => G1(YH, Bq) || G1(YH, Sq));   // can parent Read or Bash?
  return (RH("subagent_launch"), {
    data: {
      isAsync: !0, status: "async_launched",
      agentId: $H.agentId, description: q, prompt: H,
      outputFile: Ef($H.agentId),                                     // path the parent can read
      canReadOutputFile: _H,                                          // hint
    },
  });
}
```

### What's happening

1. **`TnH` registers a background task** in the task registry. This includes an `AbortController` the user can trigger via Ctrl+C in FleetView or via task management UI.
2. **`registerName(name, agentId)`** wires up the SendMessage routing — `Agent({name: "X", ...})` makes the agent addressable via `SendMessage({to: "X"})`.
3. **The ALS context `zH`** carries identity through every nested call. `RU(zH, () => ...)` wraps the entire subagent execution in this context, so HTTP headers, OTel spans, telemetry all see `agentId: o`.
4. **`Jq$(wH, () => ...)`** wraps with cwd override. Inside this scope, `getCwd()` returns `wH`. This works via process-level chdir for sync portions and ALS-based override for async.
5. **`slH` is the async lifecycle wrapper**. It:
   - Sets up summarization (the 30s timer for `<task-notification>` envelopes).
   - Runs `makeStream()` which is `Vb()` — the runAgent generator.
   - On completion, fires the `getWorktreeResult` thunk for cleanup.
6. **Return immediately** with `status: "async_launched"`, including the `outputFile` path (the sidechain JSONL) and a `canReadOutputFile` hint based on the parent's tool surface.

### Sync path (line 351635+)

```javascript
} else {                                       // sync
  let o = Zz(qH),                              // typed agentId
    $H = {                                     // ALS context (same shape)
      agentId: o, parentAgentId: a, parentSessionId: CU(),
      agentType: "subagent", subagentName: v.agentType,
      isBuiltIn: rj(v),
      invokingRequestId: D?.requestId,
      invocationKind: "spawn",
      invocationEmitted: !1,
    };
  return RU($H, () =>
    Jq$(wH, async () => {
      let zH = [],                              // accumulated messages
        _H = Date.now(),                        // start time
        YH = avH(),                             // tool stats accumulator
        DH = svH(M.options.tools);              // tool name registry
      // Emit initial progress for the user message
      if (x.length > 0) {
        let mH = nZ(x).find((UH) => UH.type === "user");
        if (mH && mH.type === "user" && j)
          j({ type: "progress", toolUseID: `agent_${D.message.id}`, data: {
            message: mH, type: "agent_progress",
            prompt: H, agentId: o, agentType: v.agentType, description: q,
          }});
      }
      // Register foreground task with auto-background watchdog
      let OH, GH, TH;
      if (!ZnH) {
        let WH = Tu7({                          // registerForegroundAsyncTask
          agentId: o, description: q, prompt: H, selectedAgent: v,
          taskRegistry: Z, toolUseId: M.toolUseId,
          autoBackgroundMs: Rc_() || void 0,    // optional auto-background after N ms
          cwd: wH,
        });
        OH = WH.taskId;
        GH = WH.backgroundSignal.then(() => ({ type: "background" }));
        TH = WH.cancelAutoBackground;
      }
      // Stream loop with auto-background race
      let vH = !1, JH = !1, PH, NH = OH,
        hH = Vb({                               // ← runAgent
          ...MH,
          override: { ...MH.override, agentId: o },
          onCacheSafeParams: NH && Ko() ? (WH, mH) => {
              let { stop: UH } = CM$(NH, o, WH, mH, Z);   // startAgentSummarization
              PH = UH;
            } : void 0,
        })[Symbol.asyncIterator]();
      RH("subagent_launch");
      // ... loop body collecting messages, racing against background-promote signal
    })
  );
}
```

### What's different from async

1. **No `slH`** — the sync path directly consumes the `Vb` generator with `[Symbol.asyncIterator]()`.
2. **Foreground task `Tu7`** — registers as foreground with `autoBackgroundMs` watchdog. If the agent runs longer than the threshold, the watchdog can promote it to background.
3. **Background promotion race** — `await Promise.race([msg.then(...), GH])` where `GH` is the auto-background signal. If background-promote wins:
   - Stop the current sync collection.
   - Spawn a fresh `Vb` call in `RU(...)` (re-establishing ALS), giving the new instance the same abort controller — the agent continues but is now tracked as background.
   - Return `{ data: { isAsync: true, status: "async_launched", ... } }` to the parent.
4. **Per-message progress emission** — `bwH(m$, LH, i$, M.options.tools)` updates per-tool counts; `fz8(m$, M$, M.toolUseId, q, J, BH, v.agentType)` emits structured progress so the parent's REPL renderer can update its agent-progress line in real time.
5. **Result construction** — when the stream ends normally, `zz8(zH, M$, F)` aggregates the messages into a final result envelope: text, tool-use count, duration, usage.

### The auto-background race detail

```javascript
let mH = hH.next(),
  UH = GH
    ? await Promise.race([mH.then(($$) => ({ type: "message", result: $$ })), GH])
    : { type: "message", result: await mH };
```

Each iteration of the sync loop awaits either:
- The next message from the agent (`mH`), or
- The auto-background promotion signal (`GH`).

Whichever resolves first wins. If a message, process it. If background, switch modes. This race is fair (no priority); on small machines, a slow message might race the background trigger, causing a switch mid-stream. The semantics are: as soon as backgrounding triggers, the current sync wait is abandoned (the agent continues in a fresh async generator), but no messages are lost — the fresh generator picks up where the old one stopped via the shared abortController.

## The Two Different `agentId` Variables

The handler creates `qH` (a UUID) early, then uses it in two slightly different ways:

- `qH` is the raw UUID.
- `Zz(qH)` is the typed `AgentId` (a branded type for type safety).
- `o = qH` in the async branch, `o = Zz(qH)` in the sync branch.
- `override: { agentId: Zz($H.agentId) }` in async — uses the *registered task's* agentId (which may be the same as `qH`).

This is harmless duplication but it shows that the agentId is a **stable identifier for the entire spawn**, propagated through:
1. The task registry (so the parent can address the agent).
2. The ALS context (so all nested HTTP/OTel/hooks see the same id).
3. The `runAgent` override (so the sidechain JSONL is named correctly).
4. The cwd-override scope.

If `override.agentId` were omitted, `runAgent` would generate a new UUID — different from the registered task's id — and the parent's task-registry lookups would fail. The explicit thread-through is essential.

## Error Telemetry: `uH` (`bumpErr`)

Every throw in the dispatcher fires `uH("subagent_launch", "<reason>")` first:

| Reason | When |
|--------|------|
| `subagent_teams_unavailable` | `team_name` set without plan access |
| `subagent_nested_teammate` | teammate calling teammate-spawn |
| `subagent_teammate_background_denied` | in-process teammate + background (caught twice for two paths) |
| `subagent_recursive_fork` | fork-in-fork |
| `subagent_type_ambiguous` | normalized lookup hit > 1 |
| `subagent_type_denied` | exists but blocked by permission rule |
| `subagent_type_not_found` | no agent with that name |
| `subagent_mcp_required_missing` | required MCP servers not available after wait |

These errors are tracked separately from successes so dashboards can show "% of subagent spawns succeed" by reason. A spike in `subagent_type_not_found` might indicate a plugin install issue; a spike in `subagent_mcp_required_missing` might indicate MCP servers slow to connect.

## Cross-Validation with v2.1.88

The v2.1.88 source at `src/tools/AgentTool/AgentTool.tsx` is the readable equivalent of v2.1.142's `Gu7`. Key differences:

| Feature | v2.1.88 | v2.1.142 |
|---------|---------|----------|
| Teammate fast-path | Same shape | Same shape |
| Fork branch with recursive-fork guard | Both checks (querySource + message-scan) | Same |
| Two-pass normalized lookup | Single-pass message in error | Two-pass with `(unavailable)` annotation (v2.1.140) |
| MCP required-server wait | 30s wait + early-exit on failure | Same |
| Auto-background watchdog | Behind `tengu_auto_background_agents` GrowthBook + env var | Same gate (`Rc_()`) |
| `setAppStateForTasks` (root reach) | Explicit fallback for in-process teammates | `M.setAppStateForTasks ?? M.setAppState` |
| Remote isolation | `external === 'ant'` only | Same — dead-code-eliminated in external builds |
| `cwd` parameter | Behind `KAIROS` feature flag | Same `KAIROS`-gated optional field |
| Verification agent | Built-in | Removed from external bundle (see [builtin_agents.md](./builtin_agents.md)) |

## Key Insight

The Agent tool's `call()` handler is a **dispatch fan-out**: one tool call → up to three different execution paths (teammate, fork, normal) → up to two execution modes (sync, async) → one runtime (`runAgent`).

The complexity is concentrated in the routing (Phase 2) and the invocation building (Phase 5). Once we hand off to `slH` or directly to `Vb`, the runtime is uniform.

The design choice to keep this all in one tool handler — rather than splitting `Agent`, `Fork`, `Teammate`, `BackgroundAgent` into separate tools — is justified by the cache-prefix argument (see [fork_lifecycle.md](./fork_lifecycle.md) "Key Insight"): adding a new tool definition adds bytes to the system prompt, busting cache. Keeping one tool, one schema, with overloaded semantics (driven by which optional fields are present) preserves the cache.

The cost is reader complexity: a casual reader of the v2.1.142 source sees a 300-line `call()` function with several diverging branches. Each branch is comprehensible alone, but the whole takes effort to navigate. This document is intended to make that navigation easier — phase by phase, branch by branch, with the unified `runAgent` invocation as the convergence point.
