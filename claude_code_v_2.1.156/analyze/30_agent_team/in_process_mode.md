# In-Process Mode — InProcessBackend & the In-Process Runner (v2.1.156)

## TL;DR

An **in-process teammate** is a full agent loop that runs as a *fire-and-forget async task inside the very same `claude` Node process* as the team lead. There is no child process, no tmux pane, no socket — the teammate shares the leader's V8 heap, API client, and MCP connections. What keeps two (or more) concurrently-running teammates from corrupting each other's telemetry, agent-id, and "am-I-a-teammate?" answers is a pair of nested **`AsyncLocalStorage`** scopes (one for the *teammate context*, one for the *agent context*). The execution mode is selected by the `BackendRegistry` (`isInProcessEnabled` → `getInProcessBackend`) and physically realized by the `InProcessBackend` class (obfuscated: `K94`, `cli_inner_pretty.js:380062`). The agent loop itself (`runInProcessTeammate` / `JT_`, `cli_inner_pretty.js:379714`) is a *persistent* loop: after each prompt it goes **idle** (not terminal), notifies the leader, and then enters a 6-priority **poll loop** (`DT_`, `cli_inner_pretty.js:379637`) that decides what to feed it next — a queued user message, a mailbox message, a shutdown request, or an auto-claimed task from the team's task list. This document explains every one of those pieces with faithful dual-version snippets and cross-validates the mapping against the v2.1.88 named-TypeScript ground truth (which is *byte-identical* for the runner core and *evolved* in two specific places: the `standalone`/`shutdownRequested` poll-loop additions and the migration from raw `setAppState` to a `taskRegistry` abstraction).

> Contrast with the daemon/background-agent fleet (`36_background_agents/`): those are daemon-supervised **child processes** with their own lifecycle that *survive the leader*. An in-process teammate has **no process boundary** and **dies with the leader REPL**. This doc covers only the in-process mode; the cross-process tmux/iTerm2 pane mode is in `cross_process_mode.md`.

---

## Related Symbols

> Symbol mappings live in the central index, never in this doc:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution (Agent Loop, Tools, State)
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features (Agent Team / swarm lives here)
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions/classes in this document (list format, per CLAUDE.md):

- `InProcessBackend` (obfuscated: `K94`, `cli_inner_pretty.js:380062`) — `TeammateExecutor` implementation for in-process teammates.
- `createInProcessBackend` (obfuscated: `_94`, `cli_inner_pretty.js:380172`) — factory returning `new K94()`.
- `spawnInProcessTeammate` (obfuscated: `CW8`, `cli_inner_pretty.js:381458`) — allocates taskId, identity, teammate context, registers the task.
- `startInProcessTeammate` (obfuscated: `qeH`, `cli_inner_pretty.js:380016`) — fire-and-forget launcher (`JT_(...).catch(...)`).
- `runInProcessTeammate` (obfuscated: `JT_`, `cli_inner_pretty.js:379714`) — the persistent agent loop.
- `waitForNextPromptOrShutdown` (obfuscated: `DT_`, `cli_inner_pretty.js:379637`) — the 6-priority poll loop.
- `POLL_INTERVAL_MS` (obfuscated: `fT_`, `cli_inner_pretty.js:380022`) — `500`.
- `killInProcessTeammate` (obfuscated: `bW8`, `cli_inner_pretty.js:381513`) — force-kill via AbortController.
- `tryClaimNextTask` (obfuscated: `q94`, `cli_inner_pretty.js:379617`) — auto-claim from the team task list.
- `findAvailableTask` (obfuscated: `jT_`, `cli_inner_pretty.js:379599`) — next pending/unowned/unblocked task.
- `formatTaskAsPrompt` (obfuscated: `wT_`, `cli_inner_pretty.js:379607`) — claim prompt builder.
- `notifyTeamLeadIdle` (obfuscated: `$94`, `cli_inner_pretty.js:379595`) — idle notification to leader.
- `formatAsTeammateMessage` (obfuscated: `wU6`, `cli_inner_pretty.js:379576`) — XML `<teammate_id=…>` envelope.
- `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (obfuscated: `jU6`, `cli_inner_pretty.js:379421`) — system-prompt addendum.
- `getCurrentAgentContext` (obfuscated: `$D`, `cli_inner_pretty.js:98974`) / `runWithAgentContext` (obfuscated: `Lg`, `cli_inner_pretty.js:98977`) — agent-id ALS.
- `runWithTeammateContext` (obfuscated: `$o$`, `cli_inner_pretty.js:99216`) / `getTeammateContext` (obfuscated: `XZ`, `cli_inner_pretty.js:99213`) — teammate-context ALS.
- `createTeammateContext` (obfuscated: `cUH`, `cli_inner_pretty.js:99222`) — wraps identity with `isInProcess:true`.
- `formatAgentId` (obfuscated: `Ei`, `cli_inner_pretty.js:98997`) / `parseAgentId` (obfuscated: `TY$`, `cli_inner_pretty.js:99003`) — `name@team` codec.
- `isTeammate` (obfuscated: `FA`, `cli_inner_pretty.js:99280`) — am-I-a-teammate predicate.
- `isInProcessTeammateTask` (obfuscated: `LJ`, `cli_inner_pretty.js:238588`) — task-type guard.
- `requestTeammateShutdown` (obfuscated: `xW8`, `cli_inner_pretty.js:381583`), `appendTeammateMessage` (obfuscated: `RW8`, `cli_inner_pretty.js:381589`), `injectUserMessageToTeammate` (obfuscated: `weH`, `cli_inner_pretty.js:381595`), `findTeammateTaskByAgentId` (obfuscated: `l6H`, `cli_inner_pretty.js:381601`), `getAllInProcessTeammateTasks` (obfuscated: `ZSH`, `cli_inner_pretty.js:381610`), `getRunningTeammatesSorted` (obfuscated: `e_H`, `cli_inner_pretty.js:381613`) — the `InProcessTeammateTask` helper module (`x94`, `cli_inner_pretty.js:381573`).

---

## 0. Where in-process mode sits in the executor split

The agent-team subsystem (internally "swarm": telemetry events are `swarm_*`, e.g. `swarm_in_process_spawn` at `cli_inner_pretty.js:381501`) supports two execution modes that both implement the same `TeammateExecutor` interface. The `BackendRegistry` chooses one. The relevant decision points are documented in detail in `execution_modes_and_backend_registry.md`; here is the one-line summary that matters for this doc:

```
getTeammateExecutor(preferInProcess, registry)   NT_  @381098
        │
        └─ if (preferInProcess && isInProcessEnabled(registry))    ma  @381076
                 return getInProcessBackend(registry)              S94 @381094  ──► new K94()  (this doc)
           else  return getPaneBackendExecutor(registry)           ET_ @381102  ──► tmux/iTerm2 (cross_process_mode.md)
```

`isInProcessEnabled` (`ma`, `cli_inner_pretty.js:381076`) returns `true` whenever the session is non-interactive, or `teammateMode` is `"in-process"`, or `"auto"` resolves to in-process because we are *not* inside a tmux/iTerm2 pane. So **in-process is the default in a plain terminal** — the pane backends are only chosen when the leader is already running inside a multiplexer that can host visible split panes.

Once `S94` (`getInProcessBackend`) hands back the memoized `InProcessBackend` singleton, the lead's `TeamCreate`/spawn path calls `backend.setContext(toolUseContext)` and then `backend.spawn(opts)`. Everything below flows from that `spawn`.

---

## 1. `InProcessBackend` — the `TeammateExecutor` adapter

**What it does:** `InProcessBackend` (`K94`, `cli_inner_pretty.js:380062-380171`) is a thin adapter that maps the generic `TeammateExecutor` verbs (`spawn`/`sendMessage`/`terminate`/`kill`/`isActive`) onto the in-process machinery. It is deliberately *stateless about teammates* — it never holds a teammate map of its own (unlike `PaneBackendExecutor`, which tracks pane IDs). All teammate state lives in `AppState.tasks` and is reached via the injected `context` (a `ToolUseContext`). The only field it owns is `context`, set by `setContext`.

**How it works (per method):**

1. `isAvailable()` → `return !0` unconditionally (`cli_inner_pretty.js:380068-380070`). In-process mode has **no external dependency** (no tmux binary, no `it2` CLI), so it is always available. This is the structural reason it is the *fallback* mode in the registry's `auto` resolution.
2. `spawn(H)` (`cli_inner_pretty.js:380071-380121`): guards on `context` being set (returns `success:false` with a "call setContext() before spawn()" error otherwise — `cli_inner_pretty.js:380072-380080`), then delegates the heavy lifting to `spawnInProcessTeammate` (`CW8`). If that succeeds, it **immediately fires `startInProcessTeammate` (`qeH`)** with a freshly-assembled runner config and returns `{success, agentId, taskId, abortController, error}`. Note the deliberate `toolUseContext: { ...this.context, messages: [] }` at `cli_inner_pretty.js:380105` — see §1.1.
3. `sendMessage(H, $)` (`cli_inner_pretty.js:380122-380133`): parses the agentId with `parseAgentId` (`TY$`), throws on a malformed id, and writes to the teammate's **file mailbox** via `writeToMailbox` (`aA`, `cli_inner_pretty.js:338306`). In-process teammates use the *exact same file mailbox* as pane teammates — there is no in-memory shortcut for peer messages. (The in-memory `pendingUserMessages` queue is a *separate* channel used only by the leader's transcript-view direct injection; see §5.)
4. `terminate(H, $)` (`cli_inner_pretty.js:380134-380150`): a *graceful* shutdown. It finds the task (`findTeammateTaskByAgentId` / `l6H`), short-circuits if `shutdownRequested` is already set, builds a `createShutdownRequestMessage` (`VsH`, `cli_inner_pretty.js:338516`), writes it to the mailbox, **and** sets the in-state `shutdownRequested` flag via `requestTeammateShutdown` (`xW8`). The teammate's *model* then decides whether to approve or reject (this is the key design choice in §4.4).
5. `kill(H)` (`cli_inner_pretty.js:380151-380159`): the *forceful* path. Delegates to `killInProcessTeammate` (`bW8`) which aborts the controller.
6. `isActive(H)` (`cli_inner_pretty.js:380160-380169`): `status === "running" && !abortController.signal.aborted`.

```javascript
// ============================================
// InProcessBackend - TeammateExecutor adapter for in-process teammates
// Location: cli_inner_pretty.js:380062-380173
// ============================================

// ORIGINAL (for source lookup):
class K94 {
  type = "in-process";
  context = null;
  setContext(H) { this.context = H; }
  async isAvailable() { return !0; }
  async spawn(H) {
    if (!this.context)
      return (N(`[InProcessBackend] spawn() called without context for ${H.name}`),
        { success: !1, agentId: `${H.name}@${H.teamName}`, error: "InProcessBackend not initialized. Call setContext() before spawn()." });
    let $ = await CW8({ name: H.name, teamName: H.teamName, prompt: H.prompt, color: H.color, planModeRequired: H.planModeRequired ?? !1 }, this.context);
    if ($.success && $.taskId && $.teammateContext && $.abortController)
      (qeH({ identity: { agentId: $.agentId, agentName: H.name, teamName: H.teamName, color: H.color, planModeRequired: H.planModeRequired ?? !1, parentSessionId: $.teammateContext.parentSessionId },
        taskId: $.taskId, prompt: H.prompt, teammateContext: $.teammateContext,
        toolUseContext: { ...this.context, messages: [] }, abortController: $.abortController,
        model: H.model, systemPrompt: H.systemPrompt, systemPromptMode: H.systemPromptMode,
        allowedTools: H.permissions, allowPermissionPrompts: H.allowPermissionPrompts }),
        N(`[InProcessBackend] Started agent execution for ${$.agentId}`));
    return { success: $.success, agentId: $.agentId, taskId: $.taskId, abortController: $.abortController, error: $.error };
  }
  async sendMessage(H, $) {
    let q = TY$(H);
    if (!q) throw Error(`Invalid agentId format: ${H}. Expected format: agentName@teamName`);
    let { agentName: K, teamName: _ } = q;
    await aA(K, { text: $.text, from: $.from, color: $.color, timestamp: $.timestamp ?? new Date().toISOString() }, _);
  }
  async terminate(H, $) { /* findTeammateTaskByAgentId → writeToMailbox(shutdownReq) → requestTeammateShutdown */ }
  async kill(H) { /* killInProcessTeammate(task.id, taskRegistry, setAppState) */ }
  async isActive(H) { /* status==="running" && !aborted */ }
}
function _94() { return new K94(); }

// READABLE (for understanding):
class InProcessBackend {
  type = "in-process";
  context = null;                                  // ToolUseContext (AppState access)
  setContext(ctx) { this.context = ctx; }          // called by TeamCreate before spawn
  async isAvailable() { return true; }             // no external deps → always available

  async spawn(opts) {
    if (!this.context) {                            // must inject context first
      return { success: false, agentId: `${opts.name}@${opts.teamName}`,
               error: "InProcessBackend not initialized. Call setContext() before spawn()." };
    }
    const r = await spawnInProcessTeammate({        // allocate task + identity + teammate ctx
      name: opts.name, teamName: opts.teamName, prompt: opts.prompt,
      color: opts.color, planModeRequired: opts.planModeRequired ?? false,
    }, this.context);

    if (r.success && r.taskId && r.teammateContext && r.abortController) {
      startInProcessTeammate({                      // fire-and-forget the agent loop
        identity: { agentId: r.agentId, agentName: opts.name, teamName: opts.teamName,
                    color: opts.color, planModeRequired: opts.planModeRequired ?? false,
                    parentSessionId: r.teammateContext.parentSessionId },
        taskId: r.taskId, prompt: opts.prompt, teammateContext: r.teammateContext,
        toolUseContext: { ...this.context, messages: [] }, // strip leader's transcript (see §1.1)
        abortController: r.abortController, model: opts.model,
        systemPrompt: opts.systemPrompt, systemPromptMode: opts.systemPromptMode,
        allowedTools: opts.permissions, allowPermissionPrompts: opts.allowPermissionPrompts,
      });
    }
    return { success: r.success, agentId: r.agentId, taskId: r.taskId,
             abortController: r.abortController, error: r.error };
  }

  async sendMessage(agentId, msg) {                 // peer/leader → teammate via FILE mailbox
    const parsed = parseAgentId(agentId);
    if (!parsed) throw new Error(`Invalid agentId format: ${agentId}. Expected format: agentName@teamName`);
    const { agentName, teamName } = parsed;
    await writeToMailbox(agentName, { text: msg.text, from: msg.from, color: msg.color,
                                      timestamp: msg.timestamp ?? new Date().toISOString() }, teamName);
  }
  // terminate() = graceful (model decides); kill() = forceful (abort now); isActive() = running && !aborted
}
function createInProcessBackend() { return new InProcessBackend(); }

// Mapping: K94→InProcessBackend, _94→createInProcessBackend, CW8→spawnInProcessTeammate,
//          qeH→startInProcessTeammate, TY$→parseAgentId, aA→writeToMailbox, N→logForDebugging,
//          H→opts/agentId, $→msg, q→parsed, K→agentName, _→teamName
```

### 1.1 Key decision — stripping `messages` from the inherited context

**What it does:** When `spawn` forwards `this.context` to the runner it does `{ ...this.context, messages: [] }` (`cli_inner_pretty.js:380105`), deliberately blanking the leader's conversation history.

**Why this approach:** The teammate runs `runAgent` (`WS`, `cli_inner_pretty.js:396794`), which builds its *own* sub-agent context internally; it never reads `toolUseContext.messages`. If the leader's (potentially huge) transcript were forwarded by reference, that array would be **pinned in memory for the teammate's entire lifetime** — which can be hours for a long-lived in-process teammate. Blanking it severs the retention without changing behavior. The v2.1.88 source spells this out verbatim in a comment (`utils/swarm/backends/InProcessBackend.ts:119-122`): *"Strip messages: the teammate never reads toolUseContext.messages … Passing the parent's conversation would pin it for the teammate's lifetime."*

**Key insight:** This is a *memory-lifetime* optimization that only matters *because* in-process teammates share the leader's heap. A cross-process teammate gets a fresh process and cannot accidentally retain the leader's heap, so the pane backend has no equivalent guard. The cost of sharing a heap is exactly this kind of explicit retention hygiene.

---

## 2. `spawnInProcessTeammate` (`CW8`) — allocate identity, context, and task state

**What it does:** `spawnInProcessTeammate` (`CW8`, `cli_inner_pretty.js:381458-381512`) does *everything except run the agent*: it allocates the agentId and taskId, creates the independent AbortController, captures the parent session id, builds the immutable `identity` record, creates the **teammate context** for the ALS, optionally registers a Perfetto trace node, constructs the full `in_process_teammate` task-state object, registers it in the task registry, and emits `swarm_in_process_spawn`.

**How it works (step-by-step):**

1. `O = Ei(q, K)` — `formatAgentId(name, teamName)` produces `name@team` (`cli_inner_pretty.js:381461`, `Ei` defined `cli_inner_pretty.js:98997`).
2. `M = yE("in_process_teammate")` — a fresh, type-tagged taskId (`cli_inner_pretty.js:381462`).
3. `j = C4()` — an **independent** AbortController (`cli_inner_pretty.js:381465`). Crucially *not* linked to the leader's query controller: a teammate must survive the leader interrupting its own turn.
4. `w = E$()` — `getSessionId()`, the parent session id used for transcript correlation and as the **task-list id** (`cli_inner_pretty.js:381466`).
5. Build `D` (the plain-data `identity`) and `J = cUH({...})` — `createTeammateContext`, which tags the record with `isInProcess:true` (`cli_inner_pretty.js:99222-99224`). `J` is what gets passed to `runWithTeammateContext`.
6. `if (p5H()) uY8(O, q, w)` — if Perfetto tracing is enabled, register the agent in the trace hierarchy (`cli_inner_pretty.js:381477`).
7. Build the `in_process_teammate` task state `L` (`cli_inner_pretty.js:381479-381497`): spreads a `createTaskStateBase` (`DW`) and adds `status:"running"`, `identity`, `prompt`, `model`, `abortController`, `awaitingPlanApproval:false`, a random `spinnerVerb`, the **resolved `permissionMode` via `uU6(...)`** (see §2.1), `isIdle:false`, `shutdownRequested:false`, empty `pendingUserMessages`, empty `messages`.
8. `f.register(L)` registers in the task registry, then `SH("swarm_in_process_spawn")` emits the success telemetry (`cli_inner_pretty.js:381499-381501`). Returns `{success, agentId, taskId, abortController, teammateContext}`.

On any throw, it logs and emits `uH("swarm_in_process_spawn", "spawn_failed")` (`cli_inner_pretty.js:381508`).

```javascript
// ============================================
// spawnInProcessTeammate - allocate identity, teammate ctx, and the in_process_teammate task
// Location: cli_inner_pretty.js:381458-381512
// ============================================

// ORIGINAL (for source lookup):
async function CW8(H, $) {
  let { name: q, teamName: K, prompt: _, color: z, planModeRequired: A, model: Y } = H,
    { taskRegistry: f } = $,
    O = Ei(q, K), M = yE("in_process_teammate");
  try {
    let j = C4(), w = E$(),
      D = { agentId: O, agentName: q, teamName: K, color: z, planModeRequired: A, parentSessionId: w },
      J = cUH({ agentId: O, agentName: q, teamName: K, color: z, planModeRequired: A, parentSessionId: w, abortController: j });
    if (p5H()) uY8(O, q, w);
    let X = `${q}: ${_.substring(0, 50)}${_.length > 50 ? "..." : ""}`,
      L = { ...DW(M, "in_process_teammate", X, $.toolUseId), type: "in_process_teammate", status: "running",
        identity: D, prompt: _, model: Y, abortController: j, awaitingPlanApproval: !1,
        spinnerVerb: YW(YhH()), pastTenseVerb: YW(XsH), permissionMode: uU6(T6($).mode, A),
        isIdle: !1, shutdownRequested: !1, lastReportedToolCount: 0, lastReportedTokenCount: 0,
        pendingUserMessages: [], messages: [] };
    return (f.register(L), SH("swarm_in_process_spawn"),
      { success: !0, agentId: O, taskId: M, abortController: j, teammateContext: J });
  } catch (j) {
    let w = j instanceof Error ? j.message : "Unknown error during spawn";
    return (uH("swarm_in_process_spawn", "spawn_failed"), { success: !1, agentId: O, error: w });
  }
}

// READABLE (for understanding):
async function spawnInProcessTeammate(config, context) {
  const { name, teamName, prompt, color, planModeRequired, model } = config;
  const { taskRegistry } = context;
  const agentId = formatAgentId(name, teamName);              // "name@team"
  const taskId  = generateTaskId("in_process_teammate");
  try {
    const abortController = createAbortController();           // INDEPENDENT of leader query
    const parentSessionId = getSessionId();                    // also used as task-list id
    const identity = { agentId, agentName: name, teamName, color, planModeRequired, parentSessionId };
    const teammateContext = createTeammateContext({            // → { ...identity, abortController, isInProcess:true }
      agentId, agentName: name, teamName, color, planModeRequired, parentSessionId, abortController });
    if (isPerfettoTracingEnabled()) registerPerfettoAgent(agentId, name, parentSessionId);

    const description = `${name}: ${prompt.substring(0,50)}${prompt.length > 50 ? "..." : ""}`;
    const taskState = {
      ...createTaskStateBase(taskId, "in_process_teammate", description, context.toolUseId),
      type: "in_process_teammate", status: "running", identity, prompt, model, abortController,
      awaitingPlanApproval: false, spinnerVerb: sample(getSpinnerVerbs()), pastTenseVerb: sample(TURN_COMPLETION_VERBS),
      permissionMode: resolveTeammatePermissionMode(getPermissionContext(context).mode, planModeRequired),
      isIdle: false, shutdownRequested: false, lastReportedToolCount: 0, lastReportedTokenCount: 0,
      pendingUserMessages: [], messages: [],
    };
    taskRegistry.register(taskState);
    logFeatureOk("swarm_in_process_spawn");
    return { success: true, agentId, taskId, abortController, teammateContext };
  } catch (err) {
    logFeatureBad("swarm_in_process_spawn", "spawn_failed");
    return { success: false, agentId, error: err instanceof Error ? err.message : "Unknown error during spawn" };
  }
}

// Mapping: CW8→spawnInProcessTeammate, Ei→formatAgentId, yE→generateTaskId, C4→createAbortController,
//          E$→getSessionId, cUH→createTeammateContext, p5H→isPerfettoTracingEnabled, uY8→registerPerfettoAgent,
//          DW→createTaskStateBase, uU6→resolveTeammatePermissionMode, T6→getPermissionContext, YW→sample,
//          SH→logFeatureOk, uH→logFeatureBad, f→taskRegistry
```

### 2.1 Permission-mode resolution `uU6`

**What it does:** `uU6(mode, planModeRequired)` (`cli_inner_pretty.js:381453-381457`) collapses the leader's permission mode into a teammate-safe value: if `planModeRequired` → `"plan"`; if the inherited mode is `"plan"` or `"dontAsk"` → `"default"`; otherwise pass through. So a teammate never inherits `"dontAsk"` and is forced into plan mode only when the spawn explicitly requires it. This is the **task-state** permission mode; note the runner *also* re-reads `task.permissionMode` on each iteration (§4.2) so the leader can cycle it live via Shift+Tab.

---

## 3. `startInProcessTeammate` (`qeH`) — fire-and-forget

**What it does:** `startInProcessTeammate` (`qeH`, `cli_inner_pretty.js:380016-380021`) launches the agent loop *without awaiting it*. It captures the `agentId` before the closure (so the `.catch` handler does not retain the full config — including `toolUseContext` — for the entire pending lifetime), then calls `runInProcessTeammate(config).catch(...)`.

```javascript
// ============================================
// startInProcessTeammate - fire-and-forget launcher for the in-process agent loop
// Location: cli_inner_pretty.js:380016-380021
// ============================================

// ORIGINAL (for source lookup):
function qeH(H) {
  let $ = H.identity.agentId;
  JT_(H).catch((q) => { N(`[inProcessRunner] Unhandled error in ${$}: ${q}`); });
}

// READABLE (for understanding):
function startInProcessTeammate(config) {
  const agentId = config.identity.agentId;      // hoisted so .catch doesn't retain `config`
  void runInProcessTeammate(config).catch((err) => {
    logForDebugging(`[inProcessRunner] Unhandled error in ${agentId}: ${err}`);
  });
}

// Mapping: qeH→startInProcessTeammate, JT_→runInProcessTeammate, H→config, $→agentId, q→err
```

**Why this approach (trade-offs):** Fire-and-forget is what makes "in-process" a *concurrency* model rather than a blocking call. The leader's main loop continues; the teammate's loop is just another live promise on the same event loop, time-slicing with the leader and other teammates. The alternative — awaiting the teammate — would turn `TeamCreate` into a synchronous sub-agent call (which is exactly what the `Task` tool already provides), defeating the purpose of a *team* of long-lived peers. The trade-off is that an unhandled rejection would otherwise be invisible, so the `.catch` is mandatory; and because there is no `await`, the *only* lifecycle handle the leader keeps is the `abortController` returned from spawn plus the task state in `AppState`.

---

## 4. `runInProcessTeammate` (`JT_`) — the persistent agent loop

`runInProcessTeammate` (`JT_`, `cli_inner_pretty.js:379714-380015`) is the heart of in-process mode. Unlike a background task that runs once and terminates, a teammate **stays alive across many prompts**, returning to *idle* (not *terminal*) after each one and polling for the next. The loop exits only on abort or after the model approves a shutdown.

### 4.1 System-prompt assembly (`cli_inner_pretty.js:379749-379763`)

**What it does:** Builds the teammate's system prompt. In `replace` mode, the caller's `systemPrompt` is used verbatim. Otherwise it composes: **base tools prompt** (`N0(...)` for the available tools + main-loop model) **+ `TEAMMATE_SYSTEM_PROMPT_ADDENDUM` (`jU6`)** + (if a custom agent definition exists) its `getSystemPrompt()` under a `# Custom Agent Instructions` header + (in `append` mode) the caller's extra prompt. If the custom agent has a `memory` scope it logs `tengu_agent_memory_loaded` with `source:"in-process-teammate"`.

The addendum (`jU6`, `cli_inner_pretty.js:379421-379429`) is the single most important behavioral nudge for a teammate:

```
# Agent Teammate Communication

IMPORTANT: You are running as an agent in a team. To communicate with anyone on your team, use the SendMessage tool with `to: "<name>"` to send messages to specific teammates.

Just writing a response in text is not visible to others on your team - you MUST use the SendMessage tool.

The user interacts primarily with the team lead. Your work is coordinated through the task system and teammate messaging.
```

**Key insight:** The addendum exists because of the in-process design's most surprising property: a teammate's *text output is not displayed to anyone*. The leader does not read the teammate's messages array (it is even stripped at spawn, §1.1). The *only* way a teammate communicates is `SendMessage` → file mailbox. The prompt has to say this explicitly or the model would "answer" into the void.

### 4.1.1 Tool injection in the resolved agent definition (`cli_inner_pretty.js:379764-379772`)

The runner constructs an in-line agent definition `G` whose `tools` are computed as:

```
tools: z?.tools ? aq([...z.tools, cf, rd, Oo, SL, nd, Y0, rT]) : ["*"]
```

i.e. if the custom agent restricts tools, the runner **force-injects** the team-essential tools `cf` (SendMessage), `rd` (TeamCreate), `Oo` (TeamDelete), and the four Task tools `SL/nd/Y0/rT` (TaskCreate/TaskGet/TaskList/TaskUpdate), deduplicated via `aq` (`Set`). If the custom agent does *not* restrict tools, it gets `["*"]` (everything). `permissionMode` is pinned to `"default"` here so the teammate always has full tool access **regardless of the leader's mode** — the per-iteration override (§4.2) then layers the *live* task permission mode on top.

**Why force-inject:** A teammate that cannot `SendMessage` cannot answer a shutdown request, report to the leader, or coordinate — it would be a black hole. So even an explicitly tool-restricted custom agent is guaranteed the minimum communication/coordination surface.

```javascript
// ============================================
// runInProcessTeammate (system-prompt + agent-def assembly) - teammate prompt construction
// Location: cli_inner_pretty.js:379749-379772
// ============================================

// ORIGINAL (for source lookup):
if (j === "replace" && M) W = M;
else {
  let C = [...(await N0(Y.options.tools, Y.options.mainLoopModel)), jU6];
  if (z) {
    let b = z.getSystemPrompt();
    if (b) C.push(`\n# Custom Agent Instructions\n${b}`);
    if (z.memory) d("tengu_agent_memory_loaded", { ...!1, scope: z.memory, source: "in-process-teammate" });
  }
  if (j === "append" && M) C.push(M);
  W = C.join(`\n`);
}
let G = { agentType: $.agentName, whenToUse: `In-process teammate: ${$.agentName}`,
  getSystemPrompt: () => W,
  tools: z?.tools ? aq([...z.tools, cf, rd, Oo, SL, nd, Y0, rT]) : ["*"],
  source: "projectSettings", permissionMode: "default", ...(z?.model && { model: z.model }) };

// READABLE (for understanding):
let teammateSystemPrompt;
if (systemPromptMode === "replace" && systemPrompt) {
  teammateSystemPrompt = systemPrompt;
} else {
  const parts = [...(await getSystemPrompt(ctx.options.tools, ctx.options.mainLoopModel)),
                 TEAMMATE_SYSTEM_PROMPT_ADDENDUM];                 // base tools prompt + addendum
  if (agentDefinition) {
    const custom = agentDefinition.getSystemPrompt();
    if (custom) parts.push(`\n# Custom Agent Instructions\n${custom}`);
    if (agentDefinition.memory)
      logEvent("tengu_agent_memory_loaded", { scope: agentDefinition.memory, source: "in-process-teammate" });
  }
  if (systemPromptMode === "append" && systemPrompt) parts.push(systemPrompt);
  teammateSystemPrompt = parts.join("\n");
}
const resolvedAgentDef = {
  agentType: identity.agentName,
  whenToUse: `In-process teammate: ${identity.agentName}`,
  getSystemPrompt: () => teammateSystemPrompt,
  tools: agentDefinition?.tools
    ? [...new Set([...agentDefinition.tools, SendMessage, TeamCreate, TeamDelete,
                   TaskCreate, TaskGet, TaskList, TaskUpdate])]    // force-inject team-essential tools
    : ["*"],
  source: "projectSettings",
  permissionMode: "default",                                       // teammate always gets full tool access
  ...(agentDefinition?.model ? { model: agentDefinition.model } : {}),
};

// Mapping: N0→getSystemPrompt(base), jU6→TEAMMATE_SYSTEM_PROMPT_ADDENDUM, z→agentDefinition,
//          aq→dedupe(Set), cf→SendMessage, rd→TeamCreate, Oo→TeamDelete,
//          SL→TaskCreate, nd→TaskGet, Y0→TaskList, rT→TaskUpdate, d→logEvent, $→identity, Y→toolUseContext
```

### 4.2 The main `while` loop (`cli_inner_pretty.js:379782-379936`)

The loop condition is `while (!abortController.signal.aborted && !shouldExit)`. Each iteration:

1. Creates a **per-turn** AbortController `B` (`C4()`, `cli_inner_pretty.js:379784`) stored in `task.currentWorkAbortController`. This lets the UI's *Escape* stop the *current turn only* — the lifecycle `abortController` (`f`) still kills the whole teammate. Two abort scopes: turn-level vs lifecycle-level.
2. Wraps the current prompt as a user message (`R = T8({content: E})`), counts tokens, and checks compaction (§4.3).
3. Reads the *live* `permissionMode` from the task state (`cli_inner_pretty.js:379827-379829`) and builds a per-iteration agent definition `HH = { ...G, permissionMode: $H }`. This is how Shift+Tab cycling by the leader reaches the teammate mid-flight.
4. Runs the agent generator `WS({...})` **inside the two ALS scopes** (§4.5) and consumes its stream, updating `task` state per event (§4.6).
5. On exit from the generator, if the *current work* was aborted (Escape) it appends an interrupt message and returns to idle without exiting. If the *lifecycle* was aborted it `break`s out of the loop.
6. Marks the task idle, sends the idle notification (§4.7), then **awaits the poll loop `DT_`** (§5) for the next prompt and `switch`es on its result type.

```javascript
// ============================================
// runInProcessTeammate (main loop turn) - per-iteration abort scopes, live permission, run agent
// Location: cli_inner_pretty.js:379782-379852 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
while (!f.signal.aborted && !S) {
  let B = C4();
  ua(q, (fH) => ({ ...fH, currentWorkAbortController: B }), L);
  let R = T8({ content: E }), x = [R], U = V, Q = jJ(V, xG(Y.options.mainLoopModel));
  if (Q > DU6(Y.options.mainLoopModel, Y.options.autoCompactWindow)) { /* compaction, see §4.3 */ }
  let o = Y.getAppState().tasks[q],
    $H = o && o.type === "in_process_teammate" ? o.permissionMode : "default",
    HH = { ...G, permissionMode: $H };
  await $o$(A, async () => {
    return Lg(Z, async () => {
      ua(q, (fH) => ({ ...fH, status: "running", isIdle: !1 }), L);
      for await (let fH of WS({ agentDefinition: HH, promptMessages: x, toolUseContext: Y,
        canUseTool: OT_($, B, (qH) => { /* totalPausedMs */ }, HJH(L)),
        isAsync: !0, canShowPermissionPrompts: D ?? !0, forkContextMessages: g,
        querySource: "agent:custom", override: { abortController: B }, model: O,
        preserveToolUseResults: !0, availableTools: Y.options.tools, allowedTools: w,
        contentReplacementState: I, isTeammate: !0 })) { /* per-event task update, §4.6 */ }
      return { success: !0, messages: r };
    });
  });
}

// READABLE (for understanding):
while (!lifecycleAbort.signal.aborted && !shouldExit) {
  const workAbort = createAbortController();                       // per-turn (Escape) abort scope
  updateTaskState(taskId, t => ({ ...t, currentWorkAbortController: workAbort }), setAppState);

  const userMsg = createUserMessage({ content: currentPrompt });
  let contextMsgs = allMessages;
  const tokens = tokenCountWithEstimation(allMessages, modelMaxTokens(ctx.options.mainLoopModel));
  if (tokens > getAutoCompactThreshold(ctx.options.mainLoopModel, ctx.options.autoCompactWindow)) {
    /* in-teammate compaction — §4.3 */
  }

  const liveTask = ctx.getAppState().tasks[taskId];                // re-read LIVE permission mode
  const permMode = liveTask?.type === "in_process_teammate" ? liveTask.permissionMode : "default";
  const iterationAgentDef = { ...resolvedAgentDef, permissionMode: permMode };

  await runWithTeammateContext(teammateContext, async () =>        // ALS scope #1 (§4.5)
    runWithAgentContext(agentContext, async () => {                // ALS scope #2 (§4.5)
      updateTaskState(taskId, t => ({ ...t, status: "running", isIdle: false }), setAppState);
      for await (const ev of runAgent({                            // the SAME runAgent as subagents
        agentDefinition: iterationAgentDef, promptMessages: [userMsg], toolUseContext: ctx,
        canUseTool: createInProcessCanUseTool(identity, workAbort, /*pausedMs cb*/, /*…*/),
        isAsync: true, canShowPermissionPrompts: allowPermissionPrompts ?? true,
        forkContextMessages: contextMsgs.length ? [...contextMsgs] : undefined,
        querySource: "agent:custom", override: { abortController: workAbort }, model,
        preserveToolUseResults: true, availableTools: ctx.options.tools, allowedTools,
        contentReplacementState: replacementState, isTeammate: true,
      })) { /* per-event task-state update — §4.6 */ }
      return { success: true, messages: iterationMessages };
    }));
  /* idle transition + idle notification (§4.7) → poll loop (§5) → switch on result */
}

// Mapping: JT_→runInProcessTeammate, f→lifecycleAbort, B→workAbort, S→shouldExit, V→allMessages,
//          WS→runAgent, $o$→runWithTeammateContext, Lg→runWithAgentContext, A→teammateContext,
//          Z→agentContext, OT_→createInProcessCanUseTool, ua→updateTaskState, L→setAppState,
//          E→currentPrompt, jJ→tokenCountWithEstimation, DU6→getAutoCompactThreshold, q→taskId
```

### 4.3 In-teammate compaction (`cli_inner_pretty.js:379790-379821`)

**What it does:** Before each turn, the runner counts `allMessages` (`jJ`, `cli_inner_pretty.js:221106`) and, if that exceeds the auto-compact threshold `DU6(mainLoopModel, autoCompactWindow)` (`cli_inner_pretty.js:423968`), it compacts the teammate's *own* history with `compactConversation` (`_eH`, `cli_inner_pretty.js:423130`).

**How it works:**
1. Builds an **isolated** copy of the toolUseContext (`cli_inner_pretty.js:379792-379800`): clones `readFileState` (`a1H`), nulls `onCompactEvent`, swaps in a fresh memory selector. This prevents the teammate's compaction from clobbering the *leader's* file-state cache or firing the leader's UI callbacks.
2. Calls `_eH(allMessages, isolatedCtx, {...}, true /*suppressFollowUps*/, undefined, true /*isAutoCompact*/)`.
3. Rebuilds `U` from the compacted summary (`h5H`), resets the content-replacement state, and replaces `allMessages` in place (`V.length = 0; V.push(...U)`), also mirroring the compacted set into `task.messages` to keep the AppState mirror bounded.
4. **Catch handling:** if the error message starts with `KeH` (the *PreCompact-hook-blocked* sentinel), it sets `h = true` and *continues uncompacted* (`cli_inner_pretty.js:379813-379815`). If the lifecycle aborted or the error is the abort sentinel `GC`, it sets `shouldExit` and breaks. Otherwise it rethrows.

**Why this approach (trade-offs):** A long-lived teammate accumulates context across *every prompt it ever handled* in `allMessages`. Without per-teammate compaction the array — and the AppState mirror — would grow unbounded (the v2.1.88 comment estimates *"500 turns = 500+ messages, 10-50MB"*, `inProcessRunner.ts:1118-1119`). Doing it inside the runner (rather than relying on the leader's compaction) is necessary precisely because the teammate has its *own* growing conversation that the leader never sees. The PreCompact-hook-blocked branch is the interesting trade-off: rather than failing the turn when a user hook vetoes compaction, the teammate proceeds with an over-budget context and merely tags the eventual `swarm_in_process_run` telemetry with `compact_blocked_by_hook` (§4.8). Correctness over strictness.

### 4.4 Shutdown handling — model-decided, not auto-approved

When the poll loop (§5) returns `{type:"shutdown_request"}`, the runner does **not** exit. Instead it formats the original shutdown message as a teammate message and feeds it back to the model as the next prompt (`cli_inner_pretty.js:379922-379926`), so the *model* decides whether to call an approve/reject tool. The v2.1.88 comment is explicit (`inProcessRunner.ts:687, 1364-1367`): *"Does NOT auto-approve shutdown - the model should make that decision."* This keeps in-process teammates symmetric with pane teammates (which receive shutdown the same way) and lets a teammate finish or checkpoint critical work before exiting.

### 4.5 Running inside the two ALS scopes (`cli_inner_pretty.js:379833-379834`)

The generator runs inside `$o$(teammateContext, () => Lg(agentContext, () => runAgent(...)))` — i.e. `runWithTeammateContext` wrapping `runWithAgentContext`. The *why* is the entire subject of §6. In short: the teammate context carries `agentName`/`teamName`/`color`/`parentSessionId`/`isInProcess`; the agent context carries the analytics-attribution identity (`agentId`, `parentAgentId`, `agentType:"teammate"`, `invocationKind:"spawn"`). The agent context's `parentAgentId` is captured as `$D()?.agentId` (`cli_inner_pretty.js:379736`) — i.e. *whoever's agent context is current at spawn-loop start becomes the parent* — which threads the team hierarchy correctly even when a teammate spawns another teammate.

### 4.6 Per-event task-state updates (`cli_inner_pretty.js:379868-379889`)

For each stream event, the runner skips `api_metrics`, pushes the event into `allMessages` and the iteration buffer, updates a progress tracker, and recomputes `inProgressToolUseIDs`: it *adds* the id of every `tool_use` block in `assistant` events and *deletes* the id of every `tool_result` block in `user` events. This set drives the transcript-view spinner animation so the UI can show which tool calls are still in flight. It is all done through `updateTaskState` (`ua`, `cli_inner_pretty.js:379583`) which is a guarded functional update that no-ops if the task is gone or no longer an `in_process_teammate`.

### 4.7 Idle notification (`cli_inner_pretty.js:379905-379918`)

After the turn, the runner checks `wasAlreadyIdle`, then marks the task `isIdle:true` and fires any registered `onIdleCallbacks` (used by `waitForTeammatesToBecomeIdle`, `e76`, `cli_inner_pretty.js:99312`). If it was *not* already idle (and not `standalone`), it sends an idle notification to the leader via `notifyTeamLeadIdle` (`$94`, `cli_inner_pretty.js:379595`), with `idleReason` = `"interrupted"` (if Escape) or `"available"`, and a `summary` = the last peer-DM summary (`TG$`, `cli_inner_pretty.js:338654`, which scans backward for the most recent `SendMessage` to a non-`*`/non-`team-lead` recipient).

`notifyTeamLeadIdle` builds a `createIdleNotification` (`PG$`, `cli_inner_pretty.js:338422`) of `type:"idle_notification"` and writes it to the **team-lead's mailbox** via `sendMessageToLeader` (`MT_`, `cli_inner_pretty.js:379592`, which targets the `tY = "team-lead"` constant, `cli_inner_pretty.js:336140`).

```javascript
// ============================================
// notifyTeamLeadIdle - tell the leader this teammate went idle, via the team-lead mailbox
// Location: cli_inner_pretty.js:379592-379598
// ============================================

// ORIGINAL (for source lookup):
async function MT_(H, $, q, K) {
  await aA(tY, { from: H, text: $, timestamp: new Date().toISOString(), color: q }, K);
}
async function $94(H, $, q, K) {
  let _ = PG$(H, K);
  await MT_(H, IH(_), $, q);
}

// READABLE (for understanding):
async function sendMessageToLeader(agentName, text, color, teamName) {
  await writeToMailbox("team-lead", { from: agentName, text, timestamp: new Date().toISOString(), color }, teamName);
}
async function notifyTeamLeadIdle(agentName, color, teamName, options) {
  const notification = createIdleNotification(agentName, options); // { type:"idle_notification", idleReason, summary, … }
  await sendMessageToLeader(agentName, jsonStringify(notification), color, teamName);
}

// Mapping: MT_→sendMessageToLeader, $94→notifyTeamLeadIdle, tY→"team-lead", aA→writeToMailbox,
//          PG$→createIdleNotification, IH→jsonStringify, H→agentName, K→options/teamName, $→text/color
```

### 4.8 Completion / failure / killed handling (`cli_inner_pretty.js:379937-380013`)

On a clean exit, the runner flips the task to `completed` (but **guards on `status === "running"`** so it never overwrites a concurrent `killed` set by `killInProcessTeammate` — `cli_inner_pretty.js:379943`), keeps only the last message, evicts disk output (`EO`), eagerly evicts the terminal task (`P.evictTerminal`), and — if not already terminal — emits the SDK `task_terminated` bookend via `rO(...,"completed",...)`. It deregisters the Perfetto node (`kEH`) and emits telemetry: `swarm_in_process_run` as **`compact_blocked_by_hook`** (sad event `t$`) if a PreCompact hook blocked compaction at any point, else **OK** via `SH("swarm_in_process_run")` (`cli_inner_pretty.js:379968-379969`).

On a throw, it flips to `failed` with the error, sends a *failure* idle notification (`idleReason:"failed"`, `completedStatus:"failed"`, `failureReason`), and emits `uH("swarm_in_process_run", "agent_loop_failed")` (`cli_inner_pretty.js:380007-380013`).

```javascript
// ============================================
// runInProcessTeammate (completion tail) - terminal state + swarm_in_process_run telemetry
// Location: cli_inner_pretty.js:379937-379970 (excerpt)
// ============================================

// ORIGINAL (for source lookup):
let C = !1, b;
ua(q, (B) => {
  if (B.status !== "running") return ((C = !0), B);   // killInProcessTeammate already won → don't clobber
  return ((b = B.toolUseId), B.onIdleCallbacks?.forEach((R) => R()),
    { ...B, status: "completed", notified: !0, endTime: Date.now(),
      messages: B.messages?.length ? [B.messages.at(-1)] : void 0,
      pendingUserMessages: [], inProgressToolUseIDs: void 0, abortController: void 0,
      currentWorkAbortController: void 0, onIdleCallbacks: [] });
}, L);
EO(q); P.evictTerminal(q);
if (!C) rO(q, "completed", { toolUseId: b, summary: $.agentId });
if ((kEH($.agentId), h)) t$("swarm_in_process_run", "compact_blocked_by_hook");
else SH("swarm_in_process_run");
return { success: !0, messages: V };

// READABLE (for understanding):
let alreadyTerminal = false, toolUseId;
updateTaskState(taskId, t => {
  if (t.status !== "running") { alreadyTerminal = true; return t; }   // guard against killed-race
  toolUseId = t.toolUseId; t.onIdleCallbacks?.forEach(cb => cb());
  return { ...t, status: "completed", notified: true, endTime: Date.now(),
    messages: t.messages?.length ? [t.messages.at(-1)] : undefined,
    pendingUserMessages: [], inProgressToolUseIDs: undefined,
    abortController: undefined, currentWorkAbortController: undefined, onIdleCallbacks: [] };
}, setAppState);
evictTaskOutput(taskId); taskRegistry.evictTerminal(taskId);
if (!alreadyTerminal) emitTaskTerminatedSdk(taskId, "completed", { toolUseId, summary: identity.agentId });
unregisterPerfettoAgent(identity.agentId);
if (compactBlockedByHook) logFeatureSad("swarm_in_process_run", "compact_blocked_by_hook");
else logFeatureOk("swarm_in_process_run");
return { success: true, messages: allMessages };

// Mapping: C→alreadyTerminal, b→toolUseId, EO→evictTaskOutput, P→taskRegistry, rO→emitTaskTerminatedSdk,
//          kEH→unregisterPerfettoAgent, h→compactBlockedByHook, t$→logFeatureSad, SH→logFeatureOk, V→allMessages
```

---

## 5. The poll loop `waitForNextPromptOrShutdown` (`DT_`) — a key algorithm

**What it does:** Between turns, a teammate is idle but *alive*. `waitForNextPromptOrShutdown` (`DT_`, `cli_inner_pretty.js:379637-379713`) is the function that decides what to feed the teammate next. It loops at `POLL_INTERVAL_MS` (`fT_`, `cli_inner_pretty.js:380022` = **500** ms) until it finds work, a shutdown request, or an abort. The order in which it checks sources is *the* algorithm — it encodes the teammate's coordination priorities.

**Signature:** `DT_(identity, abortController, taskId, getAppState, setAppState, taskListId, standalone)`.

### 5.1 The 6-priority order

The body, in order, on each `while (!abortController.signal.aborted)` iteration:

**Priority 1 — `pendingUserMessages` (highest, every iteration, no 500ms wait).** `cli_inner_pretty.js:379642-379653`. If the task has any in-memory `pendingUserMessages` (injected by the leader when viewing the teammate's transcript and typing directly to it), pop the first one and return `{type:"new_message", from:"user"}`. Checked *first and before the sleep* so a human typing at a teammate gets the lowest possible latency.

**Priority 2 — `shutdownRequested` flag + `standalone`.** `cli_inner_pretty.js:379654`. `if (task.shutdownRequested && standalone) return {type:"aborted"}`. The in-state shutdown flag (set by `requestTeammateShutdown`) short-circuits to abort **only for standalone teammates** — a standalone teammate has no mailbox to receive a graceful shutdown through, so the flag is its only exit signal.

**Priority 3 — the 500ms sleep.** `cli_inner_pretty.js:379655-379657`. `if (pollCount > 0) await sleep(500)`; the first iteration skips the sleep so the mailbox is checked immediately. After the sleep, re-check abort and return `{type:"aborted"}` if so.

**Priority 4 — standalone skip.** `cli_inner_pretty.js:379658`. `if (standalone) continue;` — a standalone teammate has no mailbox and no task list, so it loops back to re-check `pendingUserMessages` and abort only. (Everything below this line is mailbox/task-list work.)

**Priority 5 — mailbox shutdown request (scanned first to avoid starvation).** `cli_inner_pretty.js:379660-379684`. Read all messages (`h_H`/`readMailbox`), scan unread for the *first* parseable shutdown request (`NXH`/`isShutdownRequest`, `cli_inner_pretty.js:338554`). If found, mark it read (`JG$`/`markMessageAsReadByIndex`) and return `{type:"shutdown_request", request, originalMessage}` — *prioritized over any N regular unread messages* (it even logs how many it skipped via `H6`/`count`). This prevents a flood of peer chatter from starving a shutdown.

**Priority 6 — mailbox message, team-lead-preferred then FIFO.** `cli_inner_pretty.js:379685-379702`. Scan for the first unread message whose `from === tY` (`"team-lead"`); if none, fall back to the first unread from *any* sender (`findIndex(!read)`). Mark read and return `{type:"new_message", message, from, color, summary}`. The leader represents user intent and coordination, so its messages jump the queue ahead of peer-to-peer chatter.

**Priority 7 — task-list auto-claim.** `cli_inner_pretty.js:379706-379707`. If nothing in the mailbox, call `tryClaimNextTask(taskListId, agentName)` (`q94`). If it returns a prompt, return `{type:"new_message", from:"task-list"}`. This is what makes an idle teammate *self-assign* work: §5.2.

```javascript
// ============================================
// waitForNextPromptOrShutdown - the 6-priority poll loop (POLL_INTERVAL_MS = 500)
// Location: cli_inner_pretty.js:379637-379713
// ============================================

// ORIGINAL (for source lookup):
async function DT_(H, $, q, K, _, z, A) {
  let f = 0;
  while (!$.signal.aborted) {
    let M = K().tasks[q];
    if (M && M.type === "in_process_teammate" && M.pendingUserMessages.length > 0) {       // (1)
      let w = M.pendingUserMessages[0];
      return (_((D) => { /* pop pendingUserMessages[0] */ }),
        { type: "new_message", message: w, from: "user" });
    }
    if (M && M.type === "in_process_teammate" && M.shutdownRequested && A) return { type: "aborted" };  // (2)
    if (f > 0) await g8(500);                                                                // (3)
    if ((f++, $.signal.aborted)) return { type: "aborted" };
    if (A) continue;                                                                          // (4) standalone skip
    try {
      let w = await h_H(H.agentName, H.teamName), D = -1, J = null;
      for (let L = 0; L < w.length; L++) {                                                   // (5) shutdown scan
        let P = w[L];
        if (P && !P.read) { let Z = NXH(P.text); if (Z) { ((D = L), (J = Z)); break; } }
      }
      if (D !== -1) {
        let L = w[D], P = H6(w.slice(0, D), (Z) => !Z.read);
        return (await JG$(H.agentName, H.teamName, D), { type: "shutdown_request", request: J, originalMessage: L.text });
      }
      let X = -1;                                                                             // (6) team-lead preferred
      for (let L = 0; L < w.length; L++) { let P = w[L]; if (P && !P.read && P.from === tY) { X = L; break; } }
      if (X === -1) X = w.findIndex((L) => !L.read);                                          //     then FIFO
      if (X !== -1) {
        let L = w[X];
        if (L) return (await JG$(H.agentName, H.teamName, X),
          { type: "new_message", message: L.text, from: L.from, color: L.color, summary: L.summary });
      }
    } catch (w) { N(`[inProcessRunner] ${H.agentName} poll error: ${w}`); }
    let j = await q94(z, H.agentName);                                                        // (7) task-list claim
    if (j) return { type: "new_message", message: j, from: "task-list" };
  }
  return { type: "aborted" };
}

// READABLE (for understanding):
async function waitForNextPromptOrShutdown(identity, abortController, taskId, getAppState, setAppState, taskListId, standalone) {
  let pollCount = 0;
  while (!abortController.signal.aborted) {
    const task = getAppState().tasks[taskId];
    // (1) in-memory direct user message — lowest latency, no sleep
    if (task?.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
      const msg = task.pendingUserMessages[0];
      setAppState(s => /* pop pendingUserMessages[0] */ s);
      return { type: "new_message", message: msg, from: "user" };
    }
    // (2) in-state shutdown flag — exit, but ONLY for standalone (no mailbox to hear graceful shutdown)
    if (task?.type === "in_process_teammate" && task.shutdownRequested && standalone) return { type: "aborted" };
    // (3) sleep 500ms (skip on first poll), re-check abort
    if (pollCount > 0) await sleep(500);
    pollCount++;
    if (abortController.signal.aborted) return { type: "aborted" };
    // (4) standalone teammates have no mailbox/task-list — loop back
    if (standalone) continue;
    try {
      const all = await readMailbox(identity.agentName, identity.teamName);
      // (5) shutdown requests prioritized over regular unread to prevent starvation
      let shutdownIdx = -1, shutdownParsed = null;
      for (let i = 0; i < all.length; i++) {
        const m = all[i];
        if (m && !m.read) { const p = isShutdownRequest(m.text); if (p) { shutdownIdx = i; shutdownParsed = p; break; } }
      }
      if (shutdownIdx !== -1) {
        const m = all[shutdownIdx];
        await markMessageAsReadByIndex(identity.agentName, identity.teamName, shutdownIdx);
        return { type: "shutdown_request", request: shutdownParsed, originalMessage: m.text };
      }
      // (6) team-lead messages preferred over peer messages; else FIFO
      let idx = -1;
      for (let i = 0; i < all.length; i++) { const m = all[i]; if (m && !m.read && m.from === "team-lead") { idx = i; break; } }
      if (idx === -1) idx = all.findIndex(m => !m.read);
      if (idx !== -1) {
        const m = all[idx];
        if (m) { await markMessageAsReadByIndex(identity.agentName, identity.teamName, idx);
          return { type: "new_message", message: m.text, from: m.from, color: m.color, summary: m.summary }; }
      }
    } catch (err) { logForDebugging(`[inProcessRunner] ${identity.agentName} poll error: ${err}`); }
    // (7) auto-claim from the team task list
    const taskPrompt = await tryClaimNextTask(taskListId, identity.agentName);
    if (taskPrompt) return { type: "new_message", message: taskPrompt, from: "task-list" };
  }
  return { type: "aborted" };
}

// Mapping: DT_→waitForNextPromptOrShutdown, $→abortController, q→taskId, K→getAppState, _→setAppState,
//          z→taskListId, A→standalone, g8→sleep, h_H→readMailbox, NXH→isShutdownRequest,
//          JG$→markMessageAsReadByIndex, H6→count, q94→tryClaimNextTask, tY→"team-lead", f→pollCount
```

**Why this order (design rationale):** The order is a priority lattice over *urgency × authority*:
- **Latency:** the only source checked before the 500ms sleep is `pendingUserMessages`, because a human typing directly at a teammate must not eat a half-second delay.
- **Liveness/anti-starvation:** shutdown requests are scanned *across all unread* and returned *before* any regular message, so the teammate can always be stopped even when peers are flooding its inbox. The code even counts and logs the skipped unread to make the prioritization observable.
- **Authority:** team-lead messages outrank peer messages because the leader carries user intent; peers fall back to FIFO fairness.
- **Self-direction last:** task-list auto-claim is the *lowest* priority — a teammate only pulls new work off the shared board when nobody has explicitly messaged it. This prevents a teammate from grabbing tasks while a directed conversation is still in flight.

**Key insight — why poll at all (vs. event-driven)?** Because the IPC substrate is a *file* mailbox shared with cross-process pane teammates. A file has no push notification; polling is the lowest-common-denominator that works identically for in-process and pane teammates. 500ms is the cost/latency trade: short enough to feel responsive for coordination, long enough that N idle teammates polling concurrently do not saturate the event loop with disk reads. The `pendingUserMessages` fast-path exists precisely to claw back latency for the one channel (direct user injection) that *is* in-memory and therefore *can* be checked instantly.

### 5.2 Task-list auto-claim — `tryClaimNextTask` (`q94`), `findAvailableTask` (`jT_`), `formatTaskAsPrompt` (`wT_`)

**What it does:** `tryClaimNextTask` (`q94`, `cli_inner_pretty.js:379617`) finds the next claimable task on the team's task list, atomically claims it, marks it in-progress, and returns a prompt that tells the teammate to work it. `findAvailableTask` (`jT_`, `cli_inner_pretty.js:379599`) is the selection predicate: a task is claimable iff it is `pending`, has **no owner**, and **none of its `blockedBy` ids are still unresolved**. `formatTaskAsPrompt` (`wT_`, `cli_inner_pretty.js:379607`) renders `"Complete all open tasks. Start with task #<id>: <subject>\n\n<description>"`.

```javascript
// ============================================
// tryClaimNextTask / findAvailableTask / formatTaskAsPrompt - team task-list auto-claim
// Location: cli_inner_pretty.js:379599-379636
// ============================================

// ORIGINAL (for source lookup):
function jT_(H) {
  let $ = new Set(H.filter((q) => q.status !== "completed").map((q) => q.id));
  return H.find((q) => {
    if (q.status !== "pending") return !1;
    if (q.owner) return !1;
    return q.blockedBy.every((K) => !$.has(K));
  });
}
function wT_(H) {
  let $ = `Complete all open tasks. Start with task #${H.id}: \n\n ${H.subject}`;
  if (H.description) $ += `\n\n${H.description}`;
  return $;
}
async function q94(H, $) {
  try {
    let q = await OE(H), K = jT_(q);
    if (!K) return;
    let _ = await gD7(H, K.id, $);
    if (!_.success) { N(`[inProcessRunner] Failed to claim task #${K.id}: ${_.reason}`); return; }
    return (await P5H(H, K.id, { status: "in_progress" }), wT_(K));
  } catch (q) { N(`[inProcessRunner] Error checking task list: ${q}`); return; }
}

// READABLE (for understanding):
function findAvailableTask(tasks) {
  const unresolved = new Set(tasks.filter(t => t.status !== "completed").map(t => t.id));
  return tasks.find(t =>
    t.status === "pending" && !t.owner &&             // pending and unowned …
    t.blockedBy.every(id => !unresolved.has(id)));    // … and all blockers resolved
}
function formatTaskAsPrompt(task) {
  let p = `Complete all open tasks. Start with task #${task.id}: \n\n ${task.subject}`;
  if (task.description) p += `\n\n${task.description}`;
  return p;
}
async function tryClaimNextTask(taskListId, agentName) {
  try {
    const tasks = await listTasks(taskListId);
    const available = findAvailableTask(tasks);
    if (!available) return;
    const result = await claimTask(taskListId, available.id, agentName);   // atomic owner-CAS
    if (!result.success) { logForDebugging(`Failed to claim task #${available.id}: ${result.reason}`); return; }
    await updateTask(taskListId, available.id, { status: "in_progress" }); // reflect in UI immediately
    return formatTaskAsPrompt(available);
  } catch (err) { logForDebugging(`Error checking task list: ${err}`); return; }
}

// Mapping: jT_→findAvailableTask, wT_→formatTaskAsPrompt, q94→tryClaimNextTask,
//          OE→listTasks, gD7→claimTask, P5H→updateTask, H→tasks/taskListId, $→agentName, K→available
```

Note the runner *also* calls `tryClaimNextTask` once eagerly at startup (`if (!standalone) await q94($.parentSessionId, $.agentName)`, `cli_inner_pretty.js:379778`) so a teammate immediately shows activity instead of idling for the first 500ms. The atomic `claimTask` (`gD7`) is the concurrency control: if two idle teammates race for the same task, only one wins the owner CAS, the loser logs and returns nothing, and falls through to the next poll.

---

## 6. AsyncLocalStorage identity isolation — why two scopes

This is the single piece of machinery that makes "many agents in one process" tractable. Without a process boundary, *any* code that calls `getAgentId()`, `getAgentName()`, `isTeammate()`, or attaches telemetry must somehow know *which* of the concurrently-running teammates (or the leader) it is executing for. ALS provides exactly this: a value scoped to an async call-tree, invisible to and uncorrupted by sibling call-trees time-slicing on the same event loop.

There are **two** independent `AsyncLocalStorage` instances:

- **Agent-id ALS** (`t3K`, `cli_inner_pretty.js:98995`), read by `getCurrentAgentContext` (`$D`, `cli_inner_pretty.js:98974`) and entered by `runWithAgentContext` (`Lg`, `cli_inner_pretty.js:98977`). It stores the **analytics-attribution** record: `agentId`, `parentAgentId`, `agentType` (`"teammate"`/`"subagent"`), `invokingRequestId`, `invocationKind`, `invocationEmitted`. This is what telemetry and the trace hierarchy read.
- **Teammate-context ALS** (`s76`, `cli_inner_pretty.js:99227`), read by `getTeammateContext` (`XZ`, `cli_inner_pretty.js:99213`) and entered by `runWithTeammateContext` (`$o$`, `cli_inner_pretty.js:99216`). It stores the **team identity**: `agentId`, `agentName`, `teamName`, `color`, `planModeRequired`, `parentSessionId`, and the `isInProcess:true` tag (added by `createTeammateContext` / `cUH`).

```javascript
// ============================================
// Dual AsyncLocalStorage - agent-id ALS (t3K) and teammate-context ALS (s76)
// Location: cli_inner_pretty.js:98974-98998, 99213-99224
// ============================================

// ORIGINAL (for source lookup):
function $D() { return t3K.getStore(); }
function Lg(H, $) { return t3K.run(H, $); }
var s3K, t3K;
var pb = T(() => { ((s3K = require("async_hooks")), (t3K = new s3K.AsyncLocalStorage())); });
function Ei(H, $) { return `${H}@${$}`; }
function TY$(H) { let $ = H.indexOf("@"); if ($ === -1) return null; return { agentName: H.slice(0, $), teamName: H.slice($ + 1) }; }
// ---
function XZ() { return s76.getStore(); }
function $o$(H, $) { return s76.run(H, $); }
function mG() { return s76.getStore() !== void 0; }
function cUH(H) { return { ...H, isInProcess: !0 }; }
var _fK, s76;
var Yv = T(() => { ((_fK = require("async_hooks")), (s76 = new _fK.AsyncLocalStorage())); });

// READABLE (for understanding):
const agentIdStore = new AsyncLocalStorage();      // analytics attribution
function getCurrentAgentContext() { return agentIdStore.getStore(); }
function runWithAgentContext(ctx, fn) { return agentIdStore.run(ctx, fn); }
function formatAgentId(name, team) { return `${name}@${team}`; }
function parseAgentId(id) { const at = id.indexOf("@"); return at === -1 ? null
  : { agentName: id.slice(0, at), teamName: id.slice(at + 1) }; }

const teammateStore = new AsyncLocalStorage();     // team identity
function getTeammateContext() { return teammateStore.getStore(); }
function runWithTeammateContext(ctx, fn) { return teammateStore.run(ctx, fn); }
function isInProcessTeammate() { return teammateStore.getStore() !== undefined; }
function createTeammateContext(identity) { return { ...identity, isInProcess: true }; }

// Mapping: $D→getCurrentAgentContext, Lg→runWithAgentContext, t3K→agentIdStore, Ei→formatAgentId, TY$→parseAgentId,
//          XZ→getTeammateContext, $o$→runWithTeammateContext, s76→teammateStore, mG→isInProcessTeammate, cUH→createTeammateContext
```

### 6.1 How the predicates resolve identity (`cli_inner_pretty.js:99250-99302`)

The team-identity accessors all follow the same pattern: *prefer the ALS store; fall back to a process-global `UB`*. For example `isTeammate` (`FA`, `cli_inner_pretty.js:99280`): `if (getTeammateContext()) return true; return !!(UB?.agentId && UB?.teamName)`. The ALS store is the **in-process teammate** answer; the `UB` global is the **cross-process teammate** answer (a pane teammate is a whole process *that is itself a teammate*, so it sets `UB` once at startup and never needs ALS). This dual-source design is exactly what lets the *same* predicate code serve both modes:

- In an **in-process teammate's** call-tree, `getTeammateContext()` returns its context → `isTeammate()` is true, `getAgentId()` is *its* id, telemetry attributes to *it*.
- In the **leader's** call-tree, no teammate context and `UB` is null → `isTeammate()` is false.
- In a **pane teammate process**, `UB` was set at process startup → `isTeammate()` is true for the whole process; no ALS needed because there is only one identity per process.

### 6.2 Why two scopes and not one

**Why this approach:** The two ALS stores carry *orthogonal* concerns with *different lifetimes and consumers*:
- The **agent-id** context is the *analytics* identity. It is also used by *subagents* (`agentType:"subagent"`), which are not teammates at all. Folding it into the teammate store would force subagents to carry team fields they don't have, and would couple the telemetry layer to the swarm layer.
- The **teammate** context is the *team-coordination* identity (name/color/team/parentSession). It must be present for `SendMessage`, mailbox addressing, color rendering, and `isInProcessTeammate()`.

Keeping them separate means the runner can nest them precisely (`runWithTeammateContext(tmCtx, () => runWithAgentContext(agentCtx, () => runAgent(...)))`, §4.5) and each subsystem reads only the store it cares about. The `parentAgentId` is captured as `$D()?.agentId` *outside* the new agent scope (`cli_inner_pretty.js:379736`), so when a teammate spawns another teammate the child's agent context correctly records the spawning teammate as parent — the hierarchy threads itself through the ALS chain.

**Key insight — isolation without a process boundary:** Two teammates running concurrently are two independent async call-trees. Each `for await (const ev of runAgent(...))` is suspended and resumed by the event loop, and on every resume Node restores *that call-tree's* ALS store. So even though both teammates' code is interleaved on one thread, `getAgentId()` inside teammate A always returns A's id and inside teammate B always returns B's — with zero locking, zero passing of identity through every function signature. The process boundary that a pane teammate gets "for free" from the OS is *simulated* here by the ALS call-tree boundary. The cost: every entry point that needs identity must be *inside* a `run(...)` scope (which is why the runner wraps the generator, not just individual calls).

---

## 7. Lifecycle: `killInProcessTeammate` and the `InProcessTeammateTask` helper module

### 7.1 `killInProcessTeammate` (`bW8`)

**What it does:** `killInProcessTeammate` (`bW8`, `cli_inner_pretty.js:381513-381555`) is the *forceful* kill behind `InProcessBackend.kill()`. It atomically flips the task to `killed`, aborts the controller, removes the member from `teamContext.teammates`, removes it from the team file, emits the SDK `stopped` bookend, schedules eviction, deregisters Perfetto, and emits `swarm_in_process_kill`.

**How it works (step-by-step):**
1. `taskRegistry.update(taskId, fn)` — inside the updater: if `status !== "running"` return unchanged (no-op if already terminal). Otherwise capture `teamName`/`agentId`/`toolUseId`/`description`, **abort the controller**, set `killed = true`, fire `onIdleCallbacks` (unblock any `waitForIdle` waiters), and return the task with `status:"killed"`, `notified:true`, cleared controllers and pending messages, keeping only the last message (`cli_inner_pretty.js:381520-381543`).
2. If killed, a *second* `setAppState` updater removes the agentId from `teamContext.teammates` (`cli_inner_pretty.js:381544-381550`).
3. `if (teamName && agentId) RU6(teamName, agentId)` — remove the member from the on-disk team file (`removeMemberByAgentId`, `cli_inner_pretty.js:381285`), done outside the state updater to avoid file I/O in a reducer.
4. If killed: evict disk output (`EO`), emit `rO(taskId, "stopped", {...})` (SDK bookend), and `setTimeout(evictTerminal, b94=3000ms)` to keep the "stopped" row visible briefly (`cli_inner_pretty.js:381552`).
5. Deregister Perfetto (`kEH`) and emit `SH("swarm_in_process_kill")`.

```javascript
// ============================================
// killInProcessTeammate - forceful kill via AbortController + team cleanup
// Location: cli_inner_pretty.js:381513-381555
// ============================================

// ORIGINAL (for source lookup):
function bW8(H, $, q) {
  let K = !1, _ = null, z = null, A, Y;
  if (($.update(H, (f) => {
    if (f.status !== "running") return f;
    return ((_ = f.identity.teamName), (z = f.identity.agentId), (A = f.toolUseId), (Y = f.description),
      f.abortController?.abort(), (K = !0), f.onIdleCallbacks?.forEach((O) => O()),
      { ...f, status: "killed", notified: !0, endTime: Date.now(), onIdleCallbacks: [],
        messages: f.messages?.length ? [f.messages.at(-1)] : void 0, pendingUserMessages: [],
        inProgressToolUseIDs: void 0, abortController: void 0, currentWorkAbortController: void 0 });
  }), K && z))
    q((f) => { if (!f.teamContext?.teammates?.[z]) return f;
      let { [z]: O, ...M } = f.teamContext.teammates;
      return { ...f, teamContext: { ...f.teamContext, teammates: M } }; });
  if (_ && z) RU6(_, z);
  if (K) (EO(H), rO(H, "stopped", { toolUseId: A, summary: Y }), setTimeout((f, O) => f.evictTerminal(O), b94, $, H));
  if (z) kEH(z);
  return (SH("swarm_in_process_kill"), K);
}

// READABLE (for understanding):
function killInProcessTeammate(taskId, taskRegistry, setAppState) {
  let killed = false, teamName = null, agentId = null, toolUseId, description;
  taskRegistry.update(taskId, t => {
    if (t.status !== "running") return t;                    // no-op if already terminal
    teamName = t.identity.teamName; agentId = t.identity.agentId;
    toolUseId = t.toolUseId; description = t.description;
    t.abortController?.abort();                              // ← force-cancel the agent loop
    killed = true;
    t.onIdleCallbacks?.forEach(cb => cb());                  // unblock waitForIdle waiters
    return { ...t, status: "killed", notified: true, endTime: Date.now(), onIdleCallbacks: [],
      messages: t.messages?.length ? [t.messages.at(-1)] : undefined, pendingUserMessages: [],
      inProgressToolUseIDs: undefined, abortController: undefined, currentWorkAbortController: undefined };
  });
  if (killed && agentId) setAppState(s => {                  // drop from teamContext.teammates
    if (!s.teamContext?.teammates?.[agentId]) return s;
    const { [agentId]: _, ...rest } = s.teamContext.teammates;
    return { ...s, teamContext: { ...s.teamContext, teammates: rest } };
  });
  if (teamName && agentId) removeMemberByAgentId(teamName, agentId);   // on-disk team file
  if (killed) { evictTaskOutput(taskId); emitTaskTerminatedSdk(taskId, "stopped", { toolUseId, summary: description });
    setTimeout((reg, id) => reg.evictTerminal(id), STOPPED_DISPLAY_MS, taskRegistry, taskId); }
  if (agentId) unregisterPerfettoAgent(agentId);
  logFeatureOk("swarm_in_process_kill");
  return killed;
}

// Mapping: bW8→killInProcessTeammate, $→taskRegistry, q→setAppState, K→killed, _→teamName, z→agentId,
//          RU6→removeMemberByAgentId, EO→evictTaskOutput, rO→emitTaskTerminatedSdk, b94→STOPPED_DISPLAY_MS(3000),
//          kEH→unregisterPerfettoAgent, SH→logFeatureOk
```

**Kill vs. completion race (key insight):** Both `killInProcessTeammate` and the runner's own completion/failure tail mutate the task, and both guard on `status === "running"` and set `notified:true`. Whichever fires first "wins": the other sees `status !== "running"`, no-ops its state write, and (in the runner's case) sets `alreadyTerminal` so it does *not* re-emit the SDK bookend. This is the cross-cutting invariant that prevents a `killed`→`completed` flip and a double SDK `task_terminated` emission — essential because the agent loop is async and a kill can land at any await point.

### 7.2 The `InProcessTeammateTask` helper module (`x94`)

The module `x94` (`cli_inner_pretty.js:381573-381617`) exports the small CRUD helpers that the UI and backend use to manipulate teammate task state without touching the runner:

- `requestTeammateShutdown` (`xW8`, `cli_inner_pretty.js:381583`) — set the `shutdownRequested` flag (guarded on `running` and not-already-requested). Used by `InProcessBackend.terminate()`.
- `appendTeammateMessage` (`RW8`, `cli_inner_pretty.js:381589`) — append a message to `task.messages` (guarded on `running`). Used by the runner when feeding shutdown/peer messages so they appear in the transcript view.
- `injectUserMessageToTeammate` (`weH`, `cli_inner_pretty.js:381595`) — push a string onto `pendingUserMessages` *and* append it to `messages`, unless the task is terminal (`S2`/`isTerminalTaskStatus`, `cli_inner_pretty.js:550363`). This is the *only* writer of `pendingUserMessages`, i.e. the source for poll-loop priority 1.
- `findTeammateTaskByAgentId` (`l6H`, `cli_inner_pretty.js:381601`) — locate a teammate task by agentId, **preferring `running`** over stale killed/completed tasks with the same agentId.
- `getAllInProcessTeammateTasks` (`ZSH`, `cli_inner_pretty.js:381610`) — filter AppState tasks by the `isInProcessTeammateTask` guard (`LJ`).
- `getRunningTeammatesSorted` (`e_H`, `cli_inner_pretty.js:381613`) — running teammates sorted by `agentName.localeCompare`. The sort order is load-bearing: the v2.1.88 comment notes the spinner tree, the prompt-input footer selector, and `useBackgroundTaskNavigation` all index into this exact array, so they must agree.
- `InProcessTeammateTask` (`GT$`, `cli_inner_pretty.js:381618`) — the `Task`-interface object `{ name, type:"in_process_teammate", kill() }` whose `kill` delegates to `bW8`.

```javascript
// ============================================
// InProcessTeammateTask helpers - shutdown flag, message append, user-message injection, lookups
// Location: cli_inner_pretty.js:381583-381617
// ============================================

// ORIGINAL (for source lookup):
function xW8(H, $) { $.update(H, (q) => { if (q.status !== "running" || q.shutdownRequested) return q; return { ...q, shutdownRequested: !0 }; }); }
function RW8(H, $, q) { q.update(H, (K) => { if (K.status !== "running") return K; return { ...K, messages: FNH(K.messages, $) }; }); }
function weH(H, $, q) {
  q.update(H, (K) => {
    if (S2(K.status)) return (N(`Dropping message for teammate task ${H}: task status is "${K.status}"`), K);
    return { ...K, pendingUserMessages: [...K.pendingUserMessages, $], messages: FNH(K.messages, T8({ content: $ })) };
  });
}
function l6H(H, $) {
  let q;
  for (let K of Object.values($)) if (LJ(K) && K.identity.agentId === H) { if (K.status === "running") return K; if (!q) q = K; }
  return q;
}
function e_H(H) { return ZSH(H).filter(($) => $.status === "running").sort(($, q) => $.identity.agentName.localeCompare(q.identity.agentName)); }

// READABLE (for understanding):
function requestTeammateShutdown(taskId, taskRegistry) {
  taskRegistry.update(taskId, t => (t.status !== "running" || t.shutdownRequested) ? t : { ...t, shutdownRequested: true });
}
function appendTeammateMessage(taskId, message, taskRegistry) {
  taskRegistry.update(taskId, t => t.status !== "running" ? t : { ...t, messages: appendCappedMessage(t.messages, message) });
}
function injectUserMessageToTeammate(taskId, message, taskRegistry) {
  taskRegistry.update(taskId, t => {
    if (isTerminalTaskStatus(t.status)) { logForDebugging(`Dropping message for teammate task ${taskId}: task status is "${t.status}"`); return t; }
    return { ...t, pendingUserMessages: [...t.pendingUserMessages, message],          // ← poll-loop priority 1 source
             messages: appendCappedMessage(t.messages, createUserMessage({ content: message })) };
  });
}
function findTeammateTaskByAgentId(agentId, tasks) {
  let fallback;
  for (const t of Object.values(tasks)) if (isInProcessTeammateTask(t) && t.identity.agentId === agentId) {
    if (t.status === "running") return t;                  // prefer running over stale terminal
    if (!fallback) fallback = t;
  }
  return fallback;
}
function getRunningTeammatesSorted(tasks) {
  return getAllInProcessTeammateTasks(tasks).filter(t => t.status === "running")
    .sort((a, b) => a.identity.agentName.localeCompare(b.identity.agentName));
}

// Mapping: xW8→requestTeammateShutdown, RW8→appendTeammateMessage, weH→injectUserMessageToTeammate,
//          l6H→findTeammateTaskByAgentId, e_H→getRunningTeammatesSorted, ZSH→getAllInProcessTeammateTasks,
//          S2→isTerminalTaskStatus, LJ→isInProcessTeammateTask, FNH→appendCappedMessage, T8→createUserMessage
```

### 7.3 AppState predicates and the type guard

The AppState helpers (`cli_inner_pretty.js:99303-99332`) answer team-status questions by scanning `state.tasks`:
- `hasActiveInProcessTeammates` (`qo$`, `cli_inner_pretty.js:99303`) — any task with `type === "in_process_teammate" && status === "running"`.
- `hasWorkingInProcessTeammates` (`t76`, `cli_inner_pretty.js:99307`) — running **and** `!isIdle` (i.e. actually doing work, not just waiting in the poll loop).
- `waitForTeammatesToBecomeIdle` (`e76`, `cli_inner_pretty.js:99312`) — returns a promise that resolves once every currently-busy teammate has gone idle, by registering `onIdleCallbacks` on each (the same callbacks the runner and killer fire).

The fundamental type guard `isInProcessTeammateTask` (`LJ`, `cli_inner_pretty.js:238588`) is `typeof H === "object" && H !== null && "type" in H && H.type === "in_process_teammate"` — the discriminator every helper above relies on. This is the in-process analog of the discriminated-union task model used throughout the task framework.

```javascript
// ============================================
// isInProcessTeammateTask + AppState predicates - task-type guard and team-status scans
// Location: cli_inner_pretty.js:238588-238590, 99303-99311
// ============================================

// ORIGINAL (for source lookup):
function LJ(H) { return typeof H === "object" && H !== null && "type" in H && H.type === "in_process_teammate"; }
function qo$(H) { for (let $ of Object.values(H.tasks)) if ($.type === "in_process_teammate" && $.status === "running") return !0; return !1; }
function t76(H) { for (let $ of Object.values(H.tasks)) if ($.type === "in_process_teammate" && $.status === "running" && !$.isIdle) return !0; return !1; }

// READABLE (for understanding):
function isInProcessTeammateTask(t) { return typeof t === "object" && t !== null && "type" in t && t.type === "in_process_teammate"; }
function hasActiveInProcessTeammates(state) {
  for (const t of Object.values(state.tasks)) if (t.type === "in_process_teammate" && t.status === "running") return true;
  return false;
}
function hasWorkingInProcessTeammates(state) {        // running AND not idle (actually doing work)
  for (const t of Object.values(state.tasks)) if (t.type === "in_process_teammate" && t.status === "running" && !t.isIdle) return true;
  return false;
}

// Mapping: LJ→isInProcessTeammateTask, qo$→hasActiveInProcessTeammates, t76→hasWorkingInProcessTeammates
```

---

## 8. End-to-end picture (ASCII)

```
LEADER (team-lead) — same Node process, leader's ALS call-tree
  │  TeamCreate → backend.setContext(ctx) ; backend.spawn(opts)
  ▼
InProcessBackend.spawn (K94)
  │  spawnInProcessTeammate (CW8): agentId=name@team, taskId, independent AbortController,
  │     identity, teammateContext{isInProcess:true}, register in_process_teammate task → swarm_in_process_spawn
  │  startInProcessTeammate (qeH): runInProcessTeammate(config).catch(...)   ◄── FIRE-AND-FORGET
  ▼
runInProcessTeammate (JT_) — teammate's OWN async call-tree (concurrent with leader + other teammates)
  │  system prompt = base tools + TEAMMATE_SYSTEM_PROMPT_ADDENDUM (jU6) + custom + append
  │  tools = force-inject SendMessage/TeamCreate/TeamDelete/Task*  (cf rd Oo SL nd Y0 rT)
  │
  │  while(!lifecycleAbort && !shouldExit):
  │    ├─ per-turn AbortController (Escape = stop turn only)
  │    ├─ if tokens > getAutoCompactThreshold(DU6): compactConversation(_eH) on isolated ctx
  │    │     └─ PreCompact-hook blocked? → continue uncompacted, tag compact_blocked_by_hook
  │    ├─ runWithTeammateContext(s76, () => runWithAgentContext(t3K, () => runAgent(WS)))   ◄── 2 ALS scopes
  │    │     └─ per stream event: update task.progress / messages / inProgressToolUseIDs
  │    ├─ mark idle → notifyTeamLeadIdle ($94) → writeToMailbox("team-lead", idle_notification)
  │    └─ waitForNextPromptOrShutdown (DT_)  ── 6-priority poll @ 500ms (fT_) ──────────────┐
  │          (1) pendingUserMessages   (2) shutdownRequested+standalone   (3) sleep 500     │
  │          (4) standalone skip   (5) mailbox shutdown_request (NXH)                        │
  │          (6) mailbox msg: team-lead(tY) preferred else FIFO   (7) task-list auto-claim   │
  │          returns → switch: shutdown_request | new_message | aborted ──────────────────────┘
  │
  └─ exit: status completed | failed | (killed by bW8) — guarded on running, swarm_in_process_run telemetry

FILE MAILBOX (writeToMailbox aA / readMailbox h_H)  ◄── SAME substrate as pane teammates (cross_process_mode.md)
```

---

## Cross-Validation (v2.1.88)

The v2.1.88 named-TypeScript tree under `/lyz/codespace/3rd/claude-code/src` corroborates the entire mapping. The runner core is **byte-identical in structure**; two areas have **evolved**.

**Byte-identical (structure + comments match exactly):**
- `runInProcessTeammate` (`JT_`) ↔ `utils/swarm/inProcessRunner.ts:883` (`export async function runInProcessTeammate`). The system-prompt assembly (`inProcessRunner.ts:923-970`), the force-injected tool list (`inProcessRunner.ts:982-995` — same `SendMessage/TeamCreate/TeamDelete/TaskCreate/TaskGet/TaskList/TaskUpdate` set), the `permissionMode:'default'` comment (`inProcessRunner.ts:973-974`), the compaction block with the "500 turns = 500+ messages, 10-50MB" rationale (`inProcessRunner.ts:1074-1126`), the per-event `inProgressToolUseIDs` add/delete logic (`inProcessRunner.ts:1236-1262`), the idle-transition + `wasAlreadyIdle` guard (`inProcessRunner.ts:1311-1347`), and the completion/failure tails with the `status !== 'running'` "don't clobber killed" guard (`inProcessRunner.ts:1420-1533`) all match the v2.1.156 obfuscated body line-for-line.
- `waitForNextPromptOrShutdown` (`DT_`) ↔ `inProcessRunner.ts:689`. `POLL_INTERVAL_MS = 500` is at `inProcessRunner.ts:697`; the prose comment *"Polls the teammate's mailbox every 500ms"* is at `inProcessRunner.ts:681`. The shutdown-first scan with the anti-starvation comment (`inProcessRunner.ts:760-804`) and the team-lead-preferred-then-FIFO selection with its comment (`inProcessRunner.ts:806-845`) are identical.
- `startInProcessTeammate` (`qeH`) ↔ `inProcessRunner.ts:1544`, including the "hoist agentId so .catch doesn't retain config" comment (`inProcessRunner.ts:1545-1548`).
- `tryClaimNextTask`/`findAvailableTask`/`formatTaskAsPrompt` (`q94`/`jT_`/`wT_`) ↔ `inProcessRunner.ts:624`/`595`/`610` — identical predicate and prompt string.
- `InProcessBackend` (`K94`) ↔ `utils/swarm/backends/InProcessBackend.ts:38`; `createInProcessBackend` ↔ `utils/swarm/backends/InProcessBackend.ts:337`. The `{ ...this.context, messages: [] }` strip-messages comment is verbatim at `utils/swarm/backends/InProcessBackend.ts:119-122`; the `setContext()` requirement comment at `utils/swarm/backends/InProcessBackend.ts:34-36`; `isAvailable()→true` at `utils/swarm/backends/InProcessBackend.ts:58-60`.
- `spawnInProcessTeammate` (`CW8`) ↔ `spawnInProcess.ts:104`; the independent-AbortController rationale ("Teammates should not be aborted when the leader's query is interrupted") is at `spawnInProcess.ts:120-122`; the task-state shape matches `spawnInProcess.ts:157-180`.
- The `InProcessTeammateTask` helpers (`x94`) ↔ `tasks/InProcessTeammateTask/InProcessTeammateTask.tsx`: `requestTeammateShutdown` @35, `appendTeammateMessage` @51, `injectUserMessageToTeammate` @68, `findTeammateTaskByAgentId` @92, `getAllInProcessTeammateTasks` @113, `getRunningTeammatesSorted` @123 — including the "all three must agree on sort order" comment at `InProcessTeammateTask.tsx:117-122` and the "prefer running over stale killed" comment at `InProcessTeammateTask.tsx:96-104`.
- The dual ALS: v2.1.88 exposes the same `getCurrentAgentContext`/`runWithAgentContext` (agent-id store) and `runWithTeammateContext`/`getTeammateContext`/`createTeammateContext` (teammate store, `createTeammateContext` adds `isInProcess:true`). `formatAgentId`/`parseAgentId` (`name@team` codec) match `utils/agentId.ts`.

**Evolved (behavioral additions / refactors in v2.1.156):**
1. **`standalone` mode + in-state `shutdownRequested` short-circuit in the poll loop.** v2.1.88's `waitForNextPromptOrShutdown` has **no `standalone` parameter** and **no `shutdownRequested`-flag check** (confirmed: `grep standalone|shutdownRequested` returns nothing in `inProcessRunner.ts`). v2.1.156 adds the 7th argument `A` (`standalone`) and uses it for poll-loop priorities 2 and 4 (`cli_inner_pretty.js:379654`, `379658`), plus a `standalone` flag throughout `runInProcessTeammate` that suppresses the eager task-claim and the idle/failure notifications. This supports a teammate that runs without a mailbox/task-list (e.g. a one-shot standalone agent reusing the in-process runner).
2. **`taskRegistry` abstraction replaces raw `setAppState`.** v2.1.88 `killInProcessTeammate(taskId, setAppState)` takes 2 args and mutates via `setAppState`/`updateTaskState`. v2.1.156 `bW8(taskId, taskRegistry, setAppState)` takes 3 and mutates the task via `taskRegistry.update(...)` (and `evictTerminal`), reserving `setAppState` for the `teamContext.teammates` removal only. Likewise `requestTeammateShutdown`/`appendTeammateMessage`/`injectUserMessageToTeammate` now call `taskRegistry.update` rather than `updateTaskState(...setAppState...)`. This is a structural refactor of the task-state mutation surface.
3. **`swarm_in_process_*` telemetry.** The `swarm_in_process_spawn` / `swarm_in_process_run` / `swarm_in_process_kill` feature events (with `spawn_failed` / `agent_loop_failed` / `compact_blocked_by_hook` codes) are **not present** in the v2.1.88 runner (which only logs `tengu_agent_memory_loaded`). They were added after v2.1.88; the structural agent-loop logic around them is otherwise unchanged.

Net: the in-process execution *algorithm* is stable since at least v2.1.83–88; v2.1.156 layers on a standalone-mode capability, a task-registry mutation abstraction, and swarm telemetry without altering the poll-loop priority order or the dual-ALS isolation model.

---

## See Also

- [README.md](./README.md) — agent-team (swarm) module overview and the two-mode framing.
- [execution_modes_and_backend_registry.md](./execution_modes_and_backend_registry.md) — `BackendRegistry`, `isInProcessEnabled` (`ma`), `getTeammateExecutor` (`NT_`), detection.
- [in_process_mode.md](./in_process_mode.md) — this document.
- [cross_process_mode.md](./cross_process_mode.md) — tmux/iTerm2 `PaneBackendExecutor` and the `cd … && env … claude --agent-id …` spawn.
- [mailbox_and_lifecycle_tools.md](./mailbox_and_lifecycle_tools.md) — file mailbox (`aA`/`h_H`/`JG$`), shutdown/idle message helpers, `SendMessage`/`TeamCreate`/`TeamDelete`, the permission bridge (`OT_`).
- [cross_validation.md](./cross_validation.md) — full v2.1.88 ↔ v2.1.156 symbol map and the v2.1.142 delta.
