# In-Process Teammate Runner Loop — v2.1.142

## TL;DR

An in-process teammate runs in a tight loop with two well-defined surfaces:

1. **`inProcessRunnerPollLoop`** (`X65`, cli_inner_pretty.js:395858-395934) —
   the 5-priority inbox poller that decides what the teammate should do
   next. Runs **between turns**. Implements the v2.1.112-baseline polling
   order: pending user messages > structured protocol > team-lead messages
   > any unread > auto task-claim.
2. **`inProcessAgentLoop`** (`L65`, cli_inner_pretty.js:395935+) — the
   full agent turn loop. Builds the teammate's system prompt (or uses an
   override), wraps every message in `<teammate-message>` XML, calls the
   model, processes tool calls, and yields back to the poller when the
   turn ends.

The runner spawns from `spawnInProcessTeammate` (`t68`,
cli_inner_pretty.js:240335-240389), which creates *only* the task record
and `TeammateContext` — the actual loop is invoked by the team-lead's
runner code, typically wrapped in `sU$(teammateContext, () => runner(...))`
to push the AsyncLocalStorage frame.

The runner is **cooperative**: a teammate processes one message, runs one
turn (which may include many tool calls), then re-enters the poller. There
is no preemption between messages. A long-running tool call inside a turn
blocks the next inbox check until the turn ends (or `currentWorkAbortController`
aborts it).

The 5-priority ordering — and especially the **plan-approval mailbox interval
poll inside the permission prompt** (the `setInterval` at line 395755) —
captures Claude Code's core opinion about teammate runtimes: *don't sleep
the whole loop; piggyback inbox polls on whatever else is waiting*.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) — Subagent, Agent Loop, State
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) — Agent Team

Key functions in this document:
- `inProcessRunnerPollLoop` (`X65`) — 5-priority inbox poller (cli_inner_pretty.js:395858-395934)
- `inProcessAgentLoop` (`L65`) — teammate turn loop (cli_inner_pretty.js:395935-…)
- `spawnInProcessTeammate` (`t68`) — task record + TeammateContext factory (cli_inner_pretty.js:240335-240389)
- `formatTeammateMessageXml` (`ly6`) — wraps text in `<teammate-message teammate_id="…">…</teammate-message>` (cli_inner_pretty.js:395797-395803)
- `mutateTeammateTask` (`mi`) — atomic task-state setter (cli_inner_pretty.js:395804-395812)
- `sendToLeader` (`D65`) — write to the lead's inbox (cli_inner_pretty.js:395813-395815)
- `sendStructuredToLeader` (`Hs7`) — JSON-stringified structured message (cli_inner_pretty.js:395816-395819)
- `findFirstClaimableTask` (`j65`) — auto-claim heuristic for `tasks.json` (cli_inner_pretty.js:395820-395827)
- `buildAutoTaskPrompt` (`J65`) — format a claimed task as the teammate's next prompt (cli_inner_pretty.js:395828-395837)
- `markPriorClaimAsRead` (`$s7`) — clears stale task-list claim flags (cli_inner_pretty.js:395838-…)
- `parseStructuredMessage` (`sOH`) — discriminate `shutdown_request` payloads (cli_inner_pretty.js, used at line 395888)
- `parsePlanApprovalResponse` (`gTH`) — discriminate `plan_approval_response` (used at line 395765)
- `permissionPromptInterval` (`M65`) — polling interval inside the permission prompt (cli_inner_pretty.js, ~line 395780)
- `inProcessTeammateClaimTask` / `inProcessTeammateClaimSuccess` (`v67`, `d7H`) — task-list claim primitives
- Constants: `IW` = `"teammate-message"`, `az` = `"team-lead"`, `Pq7` = `50` (TEAMMATE_MESSAGES_UI_CAP)

---

## The Three-Stage Lifecycle

A teammate goes through three temporally-ordered stages, each with its own
code path:

```
   ┌──────────────────────────────────────────────────────────────┐
   │                                                              │
   │  Stage 1: SPAWN                                              │
   │  ─────────────────                                           │
   │  caller: TeamCreate / AgentTool team-spawn path             │
   │  invokes: spawnInProcessTeammate (t68)                       │
   │  produces: {agentId, taskId, abortController,                │
   │             teammateContext, task in AppState}               │
   │  state: status = "running", isIdle = false                   │
   │                                                              │
   ├──────────────────────────────────────────────────────────────┤
   │                                                              │
   │  Stage 2: WORK (looped)                                      │
   │  ─────────────────                                           │
   │  caller: team-lead's runner (wraps in sU$(ctx, …))           │
   │  invokes: inProcessAgentLoop (L65)                           │
   │     │                                                        │
   │     ├─ first iteration uses spawn prompt                    │
   │     ├─ subsequent iterations call:                          │
   │     │   inProcessRunnerPollLoop (X65)                       │
   │     │     ├─ returns {type: "new_message", message, from}   │
   │     │     ├─ returns {type: "shutdown_request", request}    │
   │     │     ├─ returns {type: "aborted"}                      │
   │     │     └─ returns nothing — exits cleanly                │
   │     │                                                        │
   │     └─ wraps message in <teammate-message …>…</…> XML       │
   │                                                              │
   ├──────────────────────────────────────────────────────────────┤
   │                                                              │
   │  Stage 3: TERMINATE                                          │
   │  ──────────────────                                          │
   │  triggers: abortController.abort() (kill, shutdown)          │
   │            shutdown_request from leader                      │
   │            graceful task completion                          │
   │  invokes: rO$ (killInProcessTeammate)                        │
   │  state: status → "killed" or "completed"                     │
   │  cleanup: clear teamContext.teammates[agentId]               │
   │           fire onIdleCallbacks                                │
   │           release teammateColors slot                         │
   │                                                              │
   └──────────────────────────────────────────────────────────────┘
```

The split into stages 2 (work) and 3 (terminate) matters for correctness:
an in-flight tool call from stage 2 may produce side effects (writes,
network calls, mailbox sends) that complete *after* stage 3 begins. The
two abort controllers (`abortController` whole-teammate vs
`currentWorkAbortController` current-turn) let stage 3 race-stop the
current turn without killing the whole teammate's record (which still
needs to render its terminal state in the leader's UI).

---

## Stage 1: Spawn (`spawnInProcessTeammate` / `t68`)

```javascript
// ============================================
// spawnInProcessTeammate - Build the task record + TeammateContext
// Location: cli_inner_pretty.js:240335-240389
// ============================================

// ORIGINAL (for source lookup):
async function t68(H, $) {
  let { name: q, teamName: K, prompt: _, color: A, planModeRequired: z, model: Y } = H,
    { taskRegistry: f } = $,
    O = In(q, K),                          // agentId = `${name}@${teamName}`
    M = xI("in_process_teammate");          // taskId = `t<rand>`
  N(`[spawnInProcessTeammate] Spawning ${O} (taskId: ${M})`);
  try {
    let w = T4(),                            // newAbortController()
      D = v$(),                              // currentSessionId() — leader's session
      j = { agentId: O, agentName: q, teamName: K, color: A, planModeRequired: z, parentSessionId: D },
      J = IxH({                              // createTeammateContext (adds isInProcess: true)
        agentId: O, agentName: q, teamName: K, color: A, planModeRequired: z, parentSessionId: D,
        abortController: w,
      });
    if (s7H()) s68(O, q, D);                 // Perfetto agent metadata
    let X = `${q}: ${_.substring(0, 50)}${_.length > 50 ? "..." : ""}`,
      L = {
        ..._2(M, "in_process_teammate", X, $.toolUseId),    // createTaskStateBase
        type: "in_process_teammate",
        status: "running",
        identity: j,
        prompt: _,
        model: Y,
        abortController: w,
        awaitingPlanApproval: !1,
        spinnerVerb: bL(lTH()),               // random verb pool
        pastTenseVerb: bL(jQH()),
        permissionMode: CD6($.getAppState().toolPermissionContext.mode, z),  // see permission_inheritance.md
        isIdle: !1,
        shutdownRequested: !1,
        lastReportedToolCount: 0,
        lastReportedTokenCount: 0,
        pendingUserMessages: [],
        messages: [],
      };
    return (
      f.register(L),
      N(`[spawnInProcessTeammate] Registered ${O} in AppState`),
      RH("swarm_in_process_spawn"),
      { success: !0, agentId: O, taskId: M, abortController: w, teammateContext: J }
    );
  } catch (w) { /* failure shape */ }
}

// READABLE (for understanding):
async function spawnInProcessTeammate(input, ctx) {
  const { name, teamName, prompt, color, planModeRequired, model } = input;
  const { taskRegistry } = ctx;
  const agentId = buildTeammateAgentId(name, teamName);      // "name@teamName"
  const taskId  = generateTaskId("in_process_teammate");      // "t<8 base-36>"
  log(`[spawnInProcessTeammate] Spawning ${agentId} (taskId: ${taskId})`);

  try {
    const abortController = newAbortController();
    const parentSessionId = currentSessionId();                // leader's session uuid

    // (a) Identity-only bag, no abort handle — used for task registration & telemetry.
    const identity = {
      agentId, agentName: name, teamName, color, planModeRequired, parentSessionId,
    };

    // (b) TeammateContext — same identity + abortController + isInProcess: true marker.
    //     Wrapped in Ei8 by the team-lead's runner via sU$(teammateContext, …).
    const teammateContext = createTeammateContext({
      agentId, agentName: name, teamName, color, planModeRequired, parentSessionId,
      abortController,
    });

    // (c) Perfetto trace metadata, one-shot per spawn.
    if (isPerfettoEnabled()) recordPerfettoAgent(agentId, name, parentSessionId);

    // (d) Build the task-state record. Inherits leader's permission mode via CD6.
    const description = `${name}: ${prompt.substring(0, 50)}${prompt.length > 50 ? "..." : ""}`;
    const taskState = {
      ...createTaskStateBase(taskId, "in_process_teammate", description, ctx.toolUseId),
      type: "in_process_teammate",
      status: "running",
      identity,
      prompt,
      model,
      abortController,
      awaitingPlanApproval: false,
      spinnerVerb: pickRandom(spinnerVerbsPool()),
      pastTenseVerb: pickRandom(pastTenseVerbsPool()),
      permissionMode: inheritPermissionModeForTeammate(
        ctx.getAppState().toolPermissionContext.mode,
        planModeRequired,
      ),
      isIdle: false,
      shutdownRequested: false,
      lastReportedToolCount: 0,
      lastReportedTokenCount: 0,
      pendingUserMessages: [],
      messages: [],
    };

    // (e) Register in AppState (the bg-task dialog now sees it).
    taskRegistry.register(taskState);
    log(`[spawnInProcessTeammate] Registered ${agentId} in AppState`);
    bumpSuccess("swarm_in_process_spawn");

    return { success: true, agentId, taskId, abortController, teammateContext };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error during spawn";
    log(`[spawnInProcessTeammate] Failed to spawn ${agentId}: ${msg}`);
    bumpErr("swarm_in_process_spawn", "spawn_failed");
    return { success: false, agentId, error: msg };
  }
}

// Mapping: t68→spawnInProcessTeammate, H→input, $→ctx, q→name, K→teamName, _→prompt,
//          A→color, z→planModeRequired, Y→model, f→taskRegistry, O→agentId, M→taskId,
//          w→abortController, D→parentSessionId, j→identity, J→teammateContext, X→description, L→taskState,
//          In→buildTeammateAgentId, xI→generateTaskId, T4→newAbortController, v$→currentSessionId,
//          IxH→createTeammateContext, s7H→isPerfettoEnabled, s68→recordPerfettoAgent,
//          _2→createTaskStateBase, CD6→inheritPermissionModeForTeammate, bL→pickRandom,
//          lTH→spinnerVerbsPool, jQH→pastTenseVerbsPool, RH→bumpSuccess
```

### Why spawn doesn't start the loop

`spawnInProcessTeammate` returns the `teammateContext` and abort controller
but **does not** start the agent loop. The team-lead's runner is
responsible for invoking the loop, typically wrapped in `sU$(teammateContext,
async () => { ... })` so the teammate's tool calls inherit the right ALS
frame.

This decoupling lets the leader:
1. Decide whether to spawn N teammates in parallel and only then wrap each.
2. Cancel a spawn before its loop starts (just `abortController.abort()`
   immediately).
3. Distinguish "spawn succeeded; loop is queued" from "loop is running" in
   its own state machine.

---

## Stage 2a: The Poll Loop (`inProcessRunnerPollLoop` / `X65`)

The poll loop is the *between-turns* part of the lifecycle. After every
turn ends, the loop is called to decide whether the teammate should
process another turn, and if so, what its input should be.

```javascript
// ============================================
// inProcessRunnerPollLoop - 5-priority inbox poll between turns
// Location: cli_inner_pretty.js:395858-395934
// ============================================

// ORIGINAL (for source lookup):
async function X65(H, $, q, K, _, A, z) {
  N(`[inProcessRunner] ${H.agentName} starting poll loop (abort=${$.signal.aborted})`);
  let f = 0;
  while (!$.signal.aborted) {
    let M = K().tasks[q];
    /* Priority 1: pendingUserMessages */
    if (M && M.type === "in_process_teammate" && M.pendingUserMessages.length > 0) {
      let D = M.pendingUserMessages[0];
      return (
        _((j) => { /* dequeue head from pendingUserMessages */ }),
        N(`[inProcessRunner] ${H.agentName} found pending user message (poll #${f})`),
        { type: "new_message", message: D, from: "user" }
      );
    }
    /* Priority 2 (early shortcut): respect explicit shutdownRequested */
    if (M && M.type === "in_process_teammate" && M.shutdownRequested && z) return { type: "aborted" };
    if (f > 0) await a8(500);                  /* 500 ms inter-poll sleep */
    if ((f++, $.signal.aborted))
      return (N(`[inProcessRunner] ${H.agentName} aborted while waiting (poll #${f})`), { type: "aborted" });
    if (z) continue;                            /* z = "standalone mode" suppresses mailbox scanning */
    N(`[inProcessRunner] ${H.agentName} poll #${f}: checking mailbox`);
    try {
      let D = await o7H(H.agentName, H.teamName);   /* readMailbox */
      /* Priority 3: structured shutdown_request scan (entire inbox) */
      let j = -1, J = null;
      for (let L = 0; L < D.length; L++) {
        let P = D[L];
        if (P && !P.read) {
          let Z = sOH(P.text);                       /* parseStructuredMessage */
          if (Z) { j = L; J = Z; break; }
        }
      }
      if (j !== -1) {
        let L = D[j], P = H6(D.slice(0, j), (Z) => !Z.read);
        return (
          N(`…received shutdown request from ${J?.from} (prioritized over ${P} unread messages)`),
          await mO$(H.agentName, H.teamName, j),     /* markMessageAsReadByIndex */
          { type: "shutdown_request", request: J, originalMessage: L.text }
        );
      }
      /* Priority 4: team-lead message first */
      let X = -1;
      for (let L = 0; L < D.length; L++) {
        let P = D[L];
        if (P && !P.read && P.from === az) { X = L; break; }
      }
      /* Priority 5: any unread */
      if (X === -1) X = D.findIndex((L) => !L.read);
      if (X !== -1) {
        let L = D[X];
        if (L)
          return (
            N(`…received new message from ${L.from} (index ${X})`),
            await mO$(H.agentName, H.teamName, X),
            { type: "new_message", message: L.text, from: L.from, color: L.color, summary: L.summary }
          );
      }
    } catch (D) {
      N(`[inProcessRunner] ${H.agentName} poll error: ${D}`);
    }
    /* Priority 6: auto-claim from tasks.json */
    let w = await $s7(A, H.agentName);
    if (w) return { type: "new_message", message: w, from: "task-list" };
  }
  return (
    N(`…exiting poll loop (abort=${$.signal.aborted}, polls=${f})`),
    { type: "aborted" }
  );
}

// READABLE (for understanding):
async function inProcessRunnerPollLoop(
  teammateIdentity, abortController, taskId,
  getAppState, setAppState, autoTaskListId, suppressMailbox,
) {
  log(`[inProcessRunner] ${teammateIdentity.agentName} starting poll loop (abort=${abortController.signal.aborted})`);
  let pollCount = 0;

  while (!abortController.signal.aborted) {
    const task = getAppState().tasks[taskId];

    // ───────── Priority 1: in-memory user messages (zoomed-view typing) ─────────
    if (task && task.type === "in_process_teammate" && task.pendingUserMessages.length > 0) {
      const message = task.pendingUserMessages[0];
      setAppState((s) => {
        const t = s.tasks[taskId];
        if (!t || t.type !== "in_process_teammate") return s;
        return { ...s, tasks: { ...s.tasks, [taskId]: { ...t, pendingUserMessages: t.pendingUserMessages.slice(1) } } };
      });
      log(`[inProcessRunner] ${teammateIdentity.agentName} found pending user message (poll #${pollCount})`);
      return { type: "new_message", message, from: "user" };
    }

    // ───────── Explicit shutdown_request early-exit (standalone path only) ─────────
    if (task && task.type === "in_process_teammate" && task.shutdownRequested && suppressMailbox) {
      return { type: "aborted" };
    }

    // ───────── Inter-poll sleep (500 ms) ─────────
    if (pollCount > 0) await sleep(500);
    pollCount++;
    if (abortController.signal.aborted) {
      log(`[inProcessRunner] ${teammateIdentity.agentName} aborted while waiting (poll #${pollCount})`);
      return { type: "aborted" };
    }
    if (suppressMailbox) continue;   // standalone-mode: never read mailbox

    log(`[inProcessRunner] ${teammateIdentity.agentName} poll #${pollCount}: checking mailbox`);

    try {
      const mailbox = await readMailbox(teammateIdentity.agentName, teammateIdentity.teamName);

      // ───────── Priority 2: structured shutdown_request scan (whole inbox) ─────────
      let shutdownIdx = -1, shutdownPayload = null;
      for (let i = 0; i < mailbox.length; i++) {
        const m = mailbox[i];
        if (m && !m.read) {
          const parsed = parseShutdownRequest(m.text);
          if (parsed) { shutdownIdx = i; shutdownPayload = parsed; break; }
        }
      }
      if (shutdownIdx !== -1) {
        const m = mailbox[shutdownIdx];
        const skippedCount = countUnread(mailbox.slice(0, shutdownIdx));
        log(`[inProcessRunner] ${teammateIdentity.agentName} received shutdown_request from ${shutdownPayload?.from} (prioritized over ${skippedCount} unread messages)`);
        await markMessageAsReadByIndex(teammateIdentity.agentName, teammateIdentity.teamName, shutdownIdx);
        return { type: "shutdown_request", request: shutdownPayload, originalMessage: m.text };
      }

      // ───────── Priority 3: team-lead message ─────────
      let pickedIdx = -1;
      for (let i = 0; i < mailbox.length; i++) {
        const m = mailbox[i];
        if (m && !m.read && m.from === LEAD_NAME) { pickedIdx = i; break; }
      }
      // ───────── Priority 4: any unread ─────────
      if (pickedIdx === -1) pickedIdx = mailbox.findIndex((m) => !m.read);

      if (pickedIdx !== -1) {
        const m = mailbox[pickedIdx];
        if (m) {
          log(`[inProcessRunner] ${teammateIdentity.agentName} received new message from ${m.from} (index ${pickedIdx})`);
          await markMessageAsReadByIndex(teammateIdentity.agentName, teammateIdentity.teamName, pickedIdx);
          return { type: "new_message", message: m.text, from: m.from, color: m.color, summary: m.summary };
        }
      }
    } catch (e) {
      log(`[inProcessRunner] ${teammateIdentity.agentName} poll error: ${e}`);
    }

    // ───────── Priority 5: auto-claim from tasks.json ─────────
    const claimedTaskPrompt = await maybeClaimNextTask(autoTaskListId, teammateIdentity.agentName);
    if (claimedTaskPrompt) {
      return { type: "new_message", message: claimedTaskPrompt, from: "task-list" };
    }
  }

  log(`[inProcessRunner] ${teammateIdentity.agentName} exiting poll loop (abort=${abortController.signal.aborted}, polls=${pollCount})`);
  return { type: "aborted" };
}

// Mapping: X65→inProcessRunnerPollLoop, H→teammateIdentity, $→abortController, q→taskId,
//          K→getAppState, _→setAppState, A→autoTaskListId, z→suppressMailbox,
//          M→task, D→mailbox/message (overloaded), j→shutdownIdx, J→shutdownPayload, X→pickedIdx,
//          o7H→readMailbox, sOH→parseShutdownRequest, mO$→markMessageAsReadByIndex,
//          $s7→maybeClaimNextTask, az→LEAD_NAME, a8→sleep, H6→countUnread
```

### The 5-Priority Order in Practice

The order encoded in `X65` (in execution order, with the v2.1.112 baseline
numbers reflected):

| Priority | Source | Where Read | Why First |
|----------|--------|------------|-----------|
| **1** | `task.pendingUserMessages[]` (in-memory) | AppState | Interactive typing from a "view teammate" zoom must feel instant — no FS roundtrip. |
| **2** | `shutdownRequested` flag (also in-memory) | AppState | Cooperative shutdown via `requestTeammateShutdown` skips even mailbox scanning. *Only honored in `suppressMailbox` standalone path.* |
| **3** | `shutdown_request` structured message | inbox file | Whole-inbox scan, even before earlier unread messages, because shutdown is preemptive. |
| **4** | First unread message from `"team-lead"` | inbox file | Leader-directed messages preempt peer messages (leader has authority). |
| **5** | First unread message from any sender | inbox file | Peer messages, in arrival order. |
| **6** | Auto-claim from `tasks.json` | shared team-tasks file | When idle, look for a claimable task (no unmet blockers, no owner). |

If none of the above produces work, the loop sleeps 500 ms (`await
a8(500)`) and tries again.

### `pollCount > 0` Sleep Guard

The line `if (f > 0) await a8(500)` ensures the **first** poll iteration
runs immediately (no leading sleep). Subsequent polls sleep before
inspecting the mailbox. This matters because:

- After a turn ends, the runner re-enters the poll with `pollCount = 0` —
  the inbox may already have queued messages from the just-ended turn's
  side effects, and the user is waiting for an immediate response.
- After the first scan finds nothing, the 500 ms backoff kicks in for
  power efficiency.

### Why "Standalone Mode" Suppresses the Mailbox

The `z` parameter (`suppressMailbox`) — true for **standalone** teammates
that aren't part of a team — skips the entire mailbox-reading branch. A
standalone teammate (spawned outside a `teamContext`) has no inbox file;
attempting to read one would error or return empty repeatedly. The
suppression also disables priority 4-6 and makes priority 2 a working
shutdown channel (since priority 3's structured mailbox check is the
normal shutdown path).

This branch is mostly for diagnostic and unit-test scenarios; production
teammates always run inside a team.

### Auto-Claim Inputs

`maybeClaimNextTask` (`$s7`) consults the team's shared `tasks.json` file:

```javascript
function j65(H) {                       // findFirstClaimableTask
  let $ = new Set(H.filter((q) => q.status !== "completed").map((q) => q.id));
  return H.find((q) => {
    if (q.status !== "pending") return false;
    if (q.owner) return false;
    return q.blockedBy.every((K) => !$.has(K));
  });
}

function J65(H) {                       // buildAutoTaskPrompt
  let $ = `Complete all open tasks. Start with task #${H.id}: \n\n ${H.subject}`;
  if (H.description) $ += `\n\n${H.description}`;
  return $;
}
```

The claim logic:
1. Build the set of "still-open" task IDs.
2. Pick the first `pending`, unowned task whose `blockedBy` are all closed.
3. Format it as the teammate's prompt: `"Complete all open tasks. Start
   with task #N: \n\n {subject}\n\n{description}"`.

This is the "swarm autonomy" loop: when teammates run out of explicit
messages, they pick up work from the shared task queue. The "Complete all
open tasks" preamble lets the model know to come back for more after
finishing the current one.

---

## Stage 2b: The Agent Turn Loop (`inProcessAgentLoop` / `L65`)

After the poll returns a message, the agent loop builds a turn:

```javascript
// (Excerpt of L65 at cli_inner_pretty.js:395935-…)
async function L65(H) {
  let {
      identity: $, taskId: q, prompt: K, description: _,
      agentDefinition: A, teammateContext: z, toolUseContext: Y,
      abortController: f, model: O, systemPrompt: M, systemPromptMode: w,
      allowedTools: D, allowPermissionPrompts: j,
      invokingRequestId: J, standalone: X = !1,
    } = H,
    { setAppState: L, taskRegistry: P } = Y;
  N(`[inProcessRunner] Starting agent loop for ${$.agentId}`);

  // (a) Build the dynamic-agent context (Atq) for the teammate.
  let Z = {
    agentId: $.agentId,
    parentAgentId: RD()?.agentId,            // leader's agentId snapshot
    parentSessionId: $.parentSessionId,
    agentName: $.agentName,
    teamName: $.teamName,
    agentColor: $.color,
    planModeRequired: $.planModeRequired,
    isTeamLead: !1,
    agentType: "teammate",
    invokingRequestId: J,
    invocationKind: "spawn",
    invocationEmitted: !1,
  }, W;

  // (b) Resolve the system prompt: replace mode uses M directly; else build standard.
  if (w === "replace" && M) W = M;
  else {
    let R = [...(await eZ(Y.options.tools, Y.options.mainLoopModel)), cy6 /* team-context prompt */];
    if (A) {
      let B = A.getSystemPrompt();
      if (B) R.push(`\n# Custom Agent Instructions\n${B}`);
      if (A.memory) d("tengu_agent_memory_loaded", { ...!1, scope: A.memory, source: "in-process-teammate" });
    }
    if (w === "append" && M) R.push(M);
    W = R.join(`\n`);
  }

  // (c) Build an agent definition for the team-aware "this is who I am" context.
  let G = {
      agentType: $.agentName,
      whenToUse: `In-process teammate: ${$.agentName}`,
      getSystemPrompt: () => W,
      tools: A?.tools ? JK([...A.tools, mZ, Am, St, OX, Kg, BZ, P0]) : ["*"],
      source: "projectSettings",
      permissionMode: "default",
      ...(A?.model && { model: A.model }),
    },
    V = [],                                   // accumulating message history
    v = ly6("team-lead", K, void 0, _),       // FIRST PROMPT: wrap in <teammate-message from="team-lead">
    E = v,                                    // current turn's input
    I = !1, h = !1;
  if (!X) await $s7($.parentSessionId, $.agentName);   // clear stale claim flag from prior session

  try {
    mi(q, (u) => ({ ...u, messages: ETH(u.messages, w8({ content: v })) }), L);   // mirror to task.messages
    let C = Y.contentReplacementState ? uf$() : void 0;

    // ───────── Outer turn loop ─────────
    while (!f.signal.aborted && !I) {
      N(`[inProcessRunner] ${$.agentId} processing prompt: ${E.substring(0, 50)}...`);

      // (d) Per-turn abort controller (for currentWorkAbortController).
      let u = T4();
      mi(q, ($H) => ({ ...$H, currentWorkAbortController: u }), L);

      // (e) Compose user message + token-check + maybe compact.
      let S = w8({ content: E }), x = [S], F = V,
          g = wX(V, sG(Y.options.mainLoopModel));
      if (g > ny6(Y.options.mainLoopModel, Y.getAutoCompactWindow())) {
        N(`[inProcessRunner] ${$.agentId} compacting history (${g} tokens)`);
        /* … compact via qrH and PreCompact hook handling … */
      }
      /* … inner: stream from model, dispatch tools, accumulate into V … */

      // (f) Turn ended. Poll for the next message.
      let messageOrShutdown = await X65($, f, q, Y.getAppState, L, Y.options.mainLoopModel, X);
      if (messageOrShutdown.type === "aborted") { I = !0; break; }
      if (messageOrShutdown.type === "shutdown_request") { /* handle shutdown */ break; }
      // (g) Format the next turn's input.
      E = ly6(messageOrShutdown.from, messageOrShutdown.message,
              messageOrShutdown.color, messageOrShutdown.summary);
      mi(q, (uu) => ({ ...uu, messages: ETH(uu.messages, w8({ content: E })) }), L);
    }
  } catch { /* … */ }
  /* … cleanup, idle callbacks fire, abort propagation … */
}
```

### Key Design Choices in the Agent Loop

#### 1. Two Abort Controllers

```javascript
let u = T4();
mi(q, ($H) => ({ ...$H, currentWorkAbortController: u }), L);
```

Every turn gets its own `currentWorkAbortController` (`u` here) — a fresh
controller stored in the task state. The outer `abortController` (`f`)
kills the whole teammate; the inner controller kills just the in-flight
turn. This split lets the leader do:

- `SendMessage({to: "alpha", message: "stop"})` → leader writes a `cancel`
  marker; in-flight `currentWorkAbortController` is fired, turn ends, the
  next poll picks up new direction. The teammate doesn't terminate.
- `TaskStop({taskId: "..."})` → fires the *outer* abort; the teammate
  terminates entirely.

#### 2. `<teammate-message>` XML Wrapping

```javascript
function ly6(H, $, q, K) {                      // formatTeammateMessageXml
  let _ = q ? ` color="${q}"` : "",
    A = K ? ` summary="${K}"` : "";
  return `<${IW} teammate_id="${H}"${_}${A}>\n${$}\n</${IW}>`;
}
```

Every message that enters the teammate's turn input — even the **spawn
prompt** — is wrapped in `<teammate-message teammate_id="..." color="..."
summary="...">...</teammate-message>` XML before being concatenated with
prior history. This serves several purposes:

- **Provenance**. The model can distinguish leader-sent text from peer
  messages by inspecting the `teammate_id` attribute.
- **Color**. The TUI's transcript view uses the `color` attribute to
  render with the sender's chosen color (each teammate has a stable color
  via `teammateColors.assign`).
- **Summary**. For long messages (in particular structured ones), the
  `summary` attribute gives the model an at-a-glance hint without parsing
  the body.
- **Unified parsing**. Even the spawn prompt is formatted with
  `from="team-lead"`, so the teammate sees its own dispatch context as a
  message from the lead — identical handling for the bootstrap and the
  subsequent turns.

The wrapping is symmetric with `formatTeammateMessages` (`Pf_`,
cli_inner_pretty.js:239268-…) used on the **leader** side when it formats
its inbox into the leader's own prompt. The XML tag name is the constant
`IW = "teammate-message"`.

#### 3. System Prompt Composition Modes

The `systemPromptMode` parameter controls how the agent's system prompt
is built:

- **`"replace"`** — use `systemPrompt` directly, no defaults. Used by
  agent-as-leader / fork scenarios.
- **`"append"`** — start with the base tools' system prompt + the team
  context + (optional) the agent definition's custom prompt + the
  caller-supplied `systemPrompt`. Most common.
- **Otherwise (default)** — base tools + team context + optional agent
  definition prompt. No external addition.

The base system prompt builder (`eZ`) emits a full prompt including
`<system-reminder>`-style sections, tool docs, and environment context.
The team context prompt (`cy6`) is the "you are a teammate of `{team}`"
contextual block.

#### 4. Auto-Compaction Inside the Loop

```javascript
let g = wX(V, sG(Y.options.mainLoopModel));
if (g > ny6(Y.options.mainLoopModel, Y.getAutoCompactWindow())) {
  /* run qrH (compact) with PreCompact hook handling */
}
```

Each turn checks the cumulative token count of the accumulated message
history (`V`). If over the compaction threshold for the current model
(`ny6` returns the model-specific limit modulated by the auto-compact
window setting), compaction is triggered.

The compaction context bag (`$H`) carries a sanitized version of the
parent's `toolUseContext` — most notably, `readFileState`, `memorySelector`,
`agentId` (a forked compaction-scope id via `Zz`). The compaction may be
blocked by a PreCompact hook (`$rH` is the well-known error prefix); in
that case `h = true` is set so compaction is skipped on subsequent turns
until something changes.

#### 5. Permission-Prompt Mailbox Polling

The permission prompt path (cli_inner_pretty.js:395755-395793 — the
`setInterval` callback) is the most subtle part:

```javascript
let X = setInterval(
  async (Z, W, G, V, v) => {
    if (Z.signal.aborted) { W(); G({ behavior: "ask", message: pHH }); return; }
    let E = await o7H(V.agentName, V.teamName);
    for (let I = 0; I < E.length; I++) {
      let h = E[I];
      if (h && !h.read) {
        let C = gTH(h.text);                          // parsePlanApprovalResponse
        if (C && C.request_id === v.id) {
          if ((await mO$(V.agentName, V.teamName, I), C.subtype === "success"))
            vQH({ requestId: C.request_id, decision: "approved", updatedInput: C.response?.updated_input,
                  permissionUpdates: C.response?.permission_updates });
          else vQH({ requestId: C.request_id, decision: "rejected", feedback: C.error });
          return;
        }
      }
    }
  }, M65, ...);
```

While the teammate is **waiting on a permission prompt** (the leader needs
to approve a write tool call), the teammate **also** polls its inbox at
interval `M65` (~500 ms) looking for a `plan_approval_response` whose
`request_id` matches the in-flight prompt. When found, the response either:
- `subtype: "success"` → calls `vQH` (record permission decision) with
  `decision: "approved"`, an optional new input, and any new permission
  rules to install.
- otherwise → records `decision: "rejected"` with the feedback string.

This is the "two-channel" pattern: the same prompt waiting on UI/IPC
synchronously also has a mailbox watcher, so a leader can approve
permissions over the mailbox without requiring direct UI interaction.

#### 6. Mirror to `task.messages` (Capped at 50)

```javascript
mi(q, (u) => ({ ...u, messages: ETH(u.messages, w8({ content: v })) }), L);
```

Every input message is appended to `task.messages` via `ETH`
(`appendCappedMessage`), which caps at `Pq7 = 50` entries by dropping the
oldest. This mirror exists *only* for the zoomed transcript view — the
authoritative message history is `V` (the runner-local array) and the
on-disk transcript at `getAgentTranscriptPath(agentId)`.

The cap matters: the 2.1.88 source comment (in
`InProcessTeammateTask/types.ts`) cites a memory analysis showing a single
292-teammate burst session reached **36.8 GB RSS** before the cap was
added. The dominant cost was each teammate holding a full second copy of
every message in `task.messages`. The cap brings per-teammate steady-state
to ~20 MB.

---

## The Leader-Side Helpers (`D65`, `Hs7`)

The runner also exposes two helpers for sending messages **to the leader**
from inside the teammate's turn:

```javascript
async function D65(H, $, q, K) {                  // sendToLeader
  await cA(az, { from: H, text: $, timestamp: new Date().toISOString(), color: q }, K);
}

async function Hs7(H, $, q, K) {                  // sendStructuredToLeader
  let _ = UO$(H, K);                              // some context-builder
  await D65(H, SH(_), $, q);                      // JSON.stringify, route through D65
}
```

These bypass the public `SendMessage` tool — they're used internally for
shutdown_response, plan_approval_request, and other protocol messages the
runner emits on the teammate's behalf without involving the model.

---

## Mutating Task State (`mi`)

```javascript
function mi(H, $, q) {                            // mutateTeammateTask
  q((K) => {
    let _ = K.tasks[H];
    if (!_ || _.type !== "in_process_teammate") return K;
    let A = $(_);
    if (A === _) return K;
    return { ...K, tasks: { ...K.tasks, [H]: A } };
  });
}
```

The helper:
1. Reads the current task.
2. If it's not an in_process_teammate (or doesn't exist), no-op.
3. Calls the user-supplied mutator on the task.
4. If the mutator returns the same reference, no-op (saves a re-render).
5. Otherwise writes the new state into `setAppState`.

This is the single mutation pathway for teammate task state. Every state
write — `messages`, `progress`, `currentWorkAbortController`,
`shutdownRequested`, `pendingUserMessages.slice(1)`, etc. — goes through
`mi`. The pattern guarantees React/Ink re-renders pick up changes without
manual force-update.

---

## Stage 3: Termination

A teammate terminates via several pathways:

1. **Leader-side kill** (user pressed `x` in bg-task dialog or called
   `TaskStop`): `rO$` (cli_inner_pretty.js:240390+) is invoked, which fires
   `abortController.abort()`, transitions status to `"killed"`, clears
   `pendingUserMessages` and `inProgressToolUseIDs`, fires `onIdleCallbacks`,
   and **clears `teamContext.teammates[agentId]`** so the team membership
   reflects the loss.

2. **shutdown_request from leader** (priority 3 in poll): runner returns
   `{type: "shutdown_request", request, originalMessage}`. The agent loop
   handles this by sending back a `shutdown_response` (approve or reject)
   then either continuing (if rejected) or terminating gracefully.

3. **Graceful self-termination**: runner's main loop ends because the
   model emitted an end-turn-without-tool-calls and there are no more
   inbox messages and no claimable tasks. The teammate transitions to
   `isIdle: true` (waiting for input), not `"completed"` — only an
   external kill or shutdown moves it to terminal.

4. **Abort signal propagation**: a parent abort fires
   `currentWorkAbortController`, ending the current turn. If the parent is
   also the whole-teammate `abortController`, the next poll iteration
   detects `aborted` and exits the loop.

The `onIdleCallbacks` are the leader's efficient way to wait for a
teammate without polling — see `findTeammateTaskByAgentId` and the
`waitForTeammateIdle` pattern in the leader's TeamCreate/SendMessage tool
code.

---

## Why 500 ms?

The 500 ms inter-poll sleep is the same as the v2.1.112 baseline. Three
constraints:

- **Human perception**: > 200 ms feels sluggish; > 1 s feels "broken".
  500 ms is the sweet spot for "I just sent something; it'll respond
  imminently".
- **CPU economy**: at 500 ms, an idle teammate runs 2 mailbox reads/sec,
  cumulative ~30 syscalls/sec including the lock-acquire/release sequence
  on the inbox file. Cheap.
- **Lock contention**: with multiple teammates polling, 500 ms gives the
  occasional writer plenty of opportunity to slot in between readers
  without piling up.

Lower would burn CPU; higher would feel laggy. The constant is
hard-coded — no environment-variable knob.

---

## Cooperative Cancellation — A Detail

The poll loop's structure:

```
while (!aborted) {
  if (pollCount > 0) await sleep(500);    // ← only this is preemptable
  if (aborted) return aborted;
  // ... mailbox checks and decisions, all synchronous-async ...
}
```

The only point at which `abortController.abort()` takes effect is during
the sleep (because `sleep` resolves to a value, and the next iteration's
top-level check fires). A blocking I/O inside the mailbox read or task
scan does NOT preempt — the abort waits for that I/O to finish.

This is intentional: an aborted teammate that's mid-mailbox-read might be
holding a lock; preempting would leave the lock orphaned. The 500 ms
sleep is the *unique* preemption point and the lock is always released
before that point.

---

## Why an `isIdle` Field?

Marking a teammate as `isIdle: true` lets the leader UI gray it out (so
the user sees who's working and who's waiting). It also lets the leader's
turn end without waiting for idle teammates to "finish" — they just sit in
the loop polling. When a teammate transitions from idle to working, the
UI un-greys; when it transitions to terminal, the row stays but with the
terminal-status badge.

The transition to idle is implicit: it happens when the poll loop returns
nothing and sleeps for the 500 ms. The runner doesn't *explicitly* set
`isIdle: true` — instead, the leader's state-derivation code reads
"there's no in-flight tool call AND no pending messages AND no current
work abort controller" as the idle condition.

The transition out of idle (back to working) is also implicit: a new
message wakes the loop, which immediately calls `mi(...)` to update
`currentWorkAbortController`, which the leader interprets as "this is
now working".

---

## What Doesn't Run Here

For completeness, several pieces of the teammate runtime that are NOT in
this loop:

- **System prompt rendering** — happens once at agent-loop entry; rebuilt
  only on compaction.
- **MCP server bootstrap** — happens at session start, before the
  teammate spawns. Teammates inherit the leader's MCP pool unmodified.
- **Skill discovery** — done at spawn time via `findSkillByName`; the
  teammate's skill set is locked.
- **Hook registry** — augmented at spawn time with the teammate's
  frontmatter hooks; not refreshed during the loop.
- **Permission rule evaluation** — happens inside individual tool calls,
  not in the loop.
- **Compaction** — triggered inside the agent loop's turn body, not the
  poll loop.

---

## See Also

- [task_taxonomy.md](./task_taxonomy.md) — the `in_process_teammate` task shape
- [mailbox_protocol.md](./mailbox_protocol.md) — the inbox file format and lock semantics the poll reads
- [team_lifecycle_tools.md](./team_lifecycle_tools.md) — SendMessage / TeamCreate that produce inbox writes
- [permission_inheritance.md](./permission_inheritance.md) — how teammate's `permissionMode` is initially set via `CD6`
- [agent_identity_propagation.md](./agent_identity_propagation.md) — how the agent loop's identity context (`Atq`) interacts with the teammate context (`Ei8`)
- [tool_inheritance.md](./tool_inheritance.md) — what tools the teammate sees during its loop body
- v2.1.112 baseline: `polling_priorities.md` for worked examples of the 5-priority order
