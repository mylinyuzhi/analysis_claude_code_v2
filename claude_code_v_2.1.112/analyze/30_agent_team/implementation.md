# Implementation Report — Agent Teams (Module 30) — v2.1.112

## Overview

The Agent Teams subsystem in v2.1.112 lets a primary Claude session (the *team lead*) spawn multiple *teammates* — independent agents that share a team workspace and collaborate over a file-based mailbox. The major design choices in v2.1.112:

1. **In-process by default** — `bF()` (chunks.155.mjs:1104) returns true unless inside iTerm2 or tmux without an explicit override. v2.1.76 (`Rb`) defaulted to pane mode whenever a pane backend was present.
2. **Three backends, one mailbox** — In-process (`j2K`), tmux split-pane (`c7Y`), tmux new-window (`l7Y`). Whatever the backend, agents only ever exchange messages through `~/.claude/{team}/inboxes/*.json`.
3. **5-level priority polling** — `CXY` (chunks.154.mjs:2462). Pending in-memory user messages → shutdown_request scan → team-lead messages → other unread → unowned task auto-claim.
4. **Permission sync over mailbox** — A teammate that needs permission writes a `permission_request` to the leader's inbox and awaits a `permission_response` instead of opening a UI prompt.
5. **Embedded compaction** — Each teammate runs its own `vI6` autocompactor; the leader does not bridge or compact a teammate's history for it.

## Related Symbols

> Symbol mappings:
> - [symbol_index.md](../00_overview/symbol_index.md) — v2.1.88 → v2.1.112 scoped diff index

Key functions in this document:
- `isAgentTeamsEnabled` (`z4`) — Feature gate (chunks.63.mjs:2617)
- `spawnTeammateDispatcher` (`n7Y`) — Mode router (chunks.137.mjs:2929)
- `spawnInProcessTeammate` (`j2K`) — In-process backend (chunks.137.mjs:2803)
- `spawnInProcessHelper` (`cI8`) — Task-registry record + AbortController + teammate context (chunks.100.mjs:1079)
- `startInProcessAgentExecution` (`Jg8`) — Fire-and-forget loop scheduler (chunks.155.mjs:309)
- `inProcessAgentRunner` (`bXY`) — The long-lived loop (chunks.155.mjs:3)
- `pollForNextMessage` (`CXY`) — 5-level poll (chunks.154.mjs:2462)
- `claimUnclaimedTask` (`HNK`) — Task auto-claim (chunks.154.mjs:2443)
- `writeToMailbox` (`F_`) — Locked append (chunks.100.mjs:3)
- `sendIdleNotification` (`jNK`) — Idle dispatch (chunks.154.mjs:2419)

## Sub-Documents

- [Spawn Mechanism](./spawn_mechanism.md) — `n7Y` dispatch, the three backends
- [Mailbox Protocol](./mailbox_protocol.md) — File layout, locking, message envelope
- [Polling Priorities](./polling_priorities.md) — `CXY` 5-level loop
- [In-Process Runner](./in_process_runner.md) — `bXY` skeleton, abort/AsyncLocalStorage
- [Permission Sync](./permission_sync.md) — `aI8`/`sI8` round-trip
- [Plan Mode Integration](./plan_mode_integration.md) — `awaitingPlanApproval` gate
- [TUI Integration](./tui_integration.md) — Status renderer, agent tab
- [Hooks & Telemetry](./hooks_and_telemetry.md) — `TeammateIdle`, `TaskCompleted`, `tengu_team_*`
- [Configuration Schema](./configuration_schema.md) — `config.json`, env vars, CLI flags
- [Edge Cases & Failures](./edge_cases_and_failures.md) — Lock contention, fallback chain, shutdown

---

## Three Independent Entry Points

```
┌────────────────────────────────────────────────────────────────────────┐
│                  Spawn entry points                                     │
└────────────────────────────────────────────────────────────────────────┘
   1) Tool: SendMessage / Agent / TeamCreate
   2) Tool call: Agent({name, team_name, ...}) → P2K → n7Y
   3) /agent-team or interactive UI command
                                │
                                ▼
                ┌─────────────────────────────┐
                │  n7Y  (spawnTeammateDispatcher) │
                │  chunks.137.mjs:2929        │
                └──────┬───────────┬──────────┘
                       │           │
                bF()=true        bF()=false
                       │           │
                       ▼           ▼
                  j2K (in-     try v96() pane probe
                  process)        │
                       │      catch + auto → j2K (fallback)
                       │      else → c7Y (split) | l7Y (window)
                       ▼
                  cI8 → Jg8 → bXY (runner)
```

The diagram clarifies that **all three spawn modes share the post-spawn lifecycle from `cI8` onward only in the in-process case**. Pane and window modes spawn an external CLI process; the launched binary itself runs `bXY` because the `--agent-id` / `--team-name` flags route the new CLI through the teammate boot path.

---

## Teammate Lifecycle (8 Phases)

Each teammate, regardless of backend, goes through the same eight phases:

### Phase 1: Validation & Naming

`c7Y`/`l7Y`/`j2K` validate that `name` and `prompt` are present, and that `team_name` is either passed in or already in the leader's `AppState.teamContext.teamName`. They then call:

- `S77(rawName)` — sanitize (allowed: lowercase, digits, hyphen)
- `d7Y(rawName, teamConfig)` — append `-2`, `-3` until name is unique within the team

```javascript
// ============================================
// pickUniqueTeammateName - Append -N until unique
// Location: chunks.137.mjs:2525-2532
// ============================================

// ORIGINAL (for source lookup):
function d7Y(q, K) {
    let _ = S77(q),
        z = new Set(K.members.map((A) => A.name.toLowerCase()));
    if (!z.has(_.toLowerCase())) return _;
    let Y = 2;
    while (z.has(`${_}-${Y}`.toLowerCase())) Y++;
    return `${_}-${Y}`
}

// READABLE (for understanding):
function pickUniqueTeammateName(rawName, teamConfig) {
  const base = sanitizeAgentName(rawName);
  const taken = new Set(teamConfig.members.map(m => m.name.toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`.toLowerCase())) suffix++;
  return `${base}-${suffix}`;
}

// Mapping: d7Y→pickUniqueTeammateName, S77→sanitizeAgentName, K→teamConfig
```

### Phase 2: Agent ID + Color Assignment

`op(name, team)` derives a deterministic `agentId` (used as the unique key inside `AppState.tasks`). `K.teammateColors.assign(agentId)` returns an unused color from a small palette so the TUI can paint each teammate's tag distinctly.

### Phase 3: Backend Probe (pane modes only)

`v96()` probes the host terminal for tmux/iTerm2 split capability. Returns `{backend: TmuxBackend|ITermBackend, needsIt2Setup: boolean}`. If `needsIt2Setup` is true, `c7Y` shows a one-time setup prompt (`ewK` React component) before spawning.

### Phase 4: Pane / Window Creation (pane modes only)

```
Split-pane (c7Y):
  await Y2K(sanitizedName, color)               # creates pane via backend
  paneId = result.paneId
  await y77(team, agentId, {tmuxPaneId, backendType})  # save pane ref to team file

Tmux window (l7Y):
  await Q7Y(swarmSession)                        # ensure tmux session exists
  await tmux new-window -t {Ny} -n teammate-{name} -P -F #{pane_id}
  paneId = stdout
```

### Phase 5: Inbox Reset

`O18(sanitizedName, teamName)` clears any leftover messages from a previous session with the same name. The leader's inbox is **not** reset on spawn (it's the session-long shared inbox).

### Phase 6: First Prompt Write

The leader writes the spawning prompt to the new teammate's inbox via `F_`, with `from = Mz` ("team-lead"). The teammate will pull this on its first poll.

### Phase 7: Process / Loop Start

```
In-process (j2K → cI8 → Jg8 → bXY):
  cI8 builds a {type:"in_process_teammate", abortController, ...} task record
  cI8 calls $.register(task)
  cI8 returns synchronously to j2K
  j2K then calls Jg8({identity, taskId, prompt, ...}) which is fire-and-forget
  Jg8 internally calls bXY(...).catch(log)

Pane modes (c7Y / l7Y):
  Build CLI argv: --agent-id .. --agent-name .. --team-name .. --agent-color ..
                  --parent-session-id .. [--plan-mode-required] [--agent-type ..]
                  [--model ..]
  cmd = `cd ${cwd} && env ${envVars} ${claudeBin} ${argv}`
  In split-pane: send-keys to existing pane
  In window:    send-keys to new window
  The spawned binary parses the flags and routes itself into bXY at startup.
```

### Phase 8: AppState Update + Task Registration

The spawning function updates `AppState.teamContext.teammates[agentId]` and (in pane modes) `M2K(taskRegistry, ...)` registers an in-process task placeholder so abort signals can drive backend pane teardown.

---

## In-Process Runner Skeleton (bXY)

The **central object** of agent teams is `bXY`, the long-lived runner. It is invoked once per in-process teammate (and every pane teammate runs the same logic in its own process).

```javascript
// ============================================
// inProcessAgentRunner - The teammate's main loop
// Location: chunks.155.mjs:3-307
// ============================================

// READABLE (for understanding):
async function inProcessAgentRunner({
  identity,        // {agentId, agentName, teamName, color, planModeRequired, parentSessionId}
  taskId,          // Key into AppState.tasks
  prompt,          // Initial user prompt from leader
  agentDefinition, // Optional custom agent config
  teammateContext, // AsyncLocalStorage payload (team metadata)
  toolUseContext,  // Wider Claude Code context
  abortController, // Lifecycle abort
  model,
  systemPrompt, systemPromptMode, allowedTools, allowPermissionPrompts,
  invokingRequestId,
}) {
  const teammateScope = {
    agentId: identity.agentId,
    parentSessionId: identity.parentSessionId,
    agentName: identity.agentName,
    teamName: identity.teamName,
    agentColor: identity.color,
    planModeRequired: identity.planModeRequired,
    isTeamLead: false,
    agentType: "teammate",
    invokingRequestId,
    invocationKind: "spawn",
    invocationEmitted: false,
  };

  const finalSystemPrompt = systemPromptMode === "replace" && systemPrompt
    ? systemPrompt
    : await buildTeammateSystemPrompt(toolUseContext, agentDefinition, systemPrompt, systemPromptMode);

  const definitionForLoop = {
    agentType: identity.agentName,
    whenToUse: `In-process teammate: ${identity.agentName}`,
    getSystemPrompt: () => finalSystemPrompt,
    tools: agentDefinition?.tools
      ? mergeTools([...agentDefinition.tools, SendMessage, TeamCreate, ...]) // tW, lp, ...
      : ["*"],
    source: "projectSettings",
    permissionMode: "default",
    ...(agentDefinition?.model && { model: agentDefinition.model }),
  };

  const messages = [];               // teammate's growing history
  let nextPrompt = wrapMessageForTeammate("team-lead", prompt, undefined, description); // k97
  let interrupted = false;
  let exiting = false;

  await tryClaimAnUnownedTask(identity.parentSessionId, identity.agentName); // HNK pre-roll

  try {
    // Pre-pend initial wrapped prompt to AppState.tasks[taskId].messages
    setAppState(taskId, t => ({...t, messages: [...t.messages, mkUserMsg(nextPrompt)]}));

    while (!abortController.signal.aborted && !exiting) {
      const currentWorkAbort = new AbortController();
      setAppState(taskId, t => ({...t, currentWorkAbortController: currentWorkAbort}));

      const userMsg = mkUserMsg(nextPrompt);
      const promptMessages = [userMsg];
      const before = messages;
      const tokensBefore = vJ(messages);

      // Embedded autocompact
      if (tokensBefore > getAutoCompactThreshold(model, getAppState().autoCompactWindow)) {
        try {
          const compacted = await vI6(messages, ctxClone, /*phase params*/, /*isAuto*/ true, undefined, /*sessionMemory*/ true);
          const replaced = restoreFilesFromCompactResult(compacted);
          messages.length = 0;
          messages.push(...replaced);
          setAppState(taskId, t => ({...t, messages: [...replaced, userMsg]}));
        } catch (e) {
          if (e.message.startsWith("Compaction blocked by PreCompact hook")) {
            // Continue uncompacted
          } else throw e;
        }
      }

      messages.push(userMsg);

      // Run nested agent loop inside teammate AsyncLocalStorage scope
      let collected = [];
      await lZ8(teammateContext, async () => {
        return runWithTeammateContext(teammateScope, async () => {
          setAppState(taskId, t => ({...t, status: "running", isIdle: false}));

          for await (const event of agentLoop({
            agentDefinition: {...definitionForLoop, permissionMode: currentPermissionMode(taskId)},
            promptMessages,
            toolUseContext,
            canUseTool: buildCanUseToolForTeammate(identity, currentWorkAbort, ...), // LXY
            isAsync: true,
            canShowPermissionPrompts: allowPermissionPrompts ?? true,
            forkContextMessages: forkSnapshot(messages),
            querySource: "agent:custom",
            override: {abortController: currentWorkAbort},
            model,
            preserveToolUseResults: true,
            availableTools: toolUseContext.options.tools,
            allowedTools,
            isTeammate: true,
          })) {
            if (abortController.signal.aborted) break;
            if (currentWorkAbort.signal.aborted) { interrupted = true; break; }
            collected.push(event);
            messages.push(event);
            updateProgressTracking(event);          // N96(g, event, ...)
            mergeIntoTaskRecord(taskId, event);     // sF(...)
          }
          return {success: true, messages: collected};
        });
      });

      setAppState(taskId, t => ({...t, currentWorkAbortController: undefined}));
      if (abortController.signal.aborted) break;

      if (interrupted) {
        messages.push(mkUserMsg("API Error: Request was aborted."));
      }

      // Mark idle and notify leader if not already idle
      const wasAlreadyIdle = getAppState().tasks[taskId]?.isIdle;
      setAppState(taskId, t => {
        t.onIdleCallbacks?.forEach(cb => cb());
        return {...t, isIdle: true, onIdleCallbacks: []};
      });
      if (!wasAlreadyIdle) {
        await sendIdleNotification(identity.agentName, identity.color, identity.teamName, {
          idleReason: interrupted ? "interrupted" : "available",
          summary: lastAssistantText(messages),
        });
      }

      // Block on next message — the heart of cooperation
      const next = await pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, identity.parentSessionId);
      switch (next.type) {
        case "shutdown_request":
          nextPrompt = wrapMessageForTeammate(next.request?.from || "team-lead", next.originalMessage);
          appendToTaskMessages(taskId, mkUserMsg(nextPrompt));
          break;
        case "new_message":
          nextPrompt = next.from === "user"
            ? next.message                             // direct user injection (no XML wrap)
            : wrapMessageForTeammate(next.from, next.message, next.color, next.summary);
          if (next.from !== "user") appendToTaskMessages(taskId, mkUserMsg(nextPrompt));
          break;
        case "aborted":
          exiting = true;
          break;
      }
      interrupted = false;
    }

    // Normal exit
    setAppState(taskId, t => ({...t, status: "completed", endTime: Date.now(), ...}));
    return {success: true, messages};
  } catch (err) {
    setAppState(taskId, t => ({...t, status: "failed", error: err.message, ...}));
    await sendIdleNotification(identity.agentName, identity.color, identity.teamName, {
      idleReason: "failed", completedStatus: "failed", failureReason: err.message,
    });
    return {success: false, error: err.message, messages};
  }
}

// Mapping: bXY→inProcessAgentRunner, q→params, K→identity, _→taskId,
//          z→prompt, lZ8→runWithTeammateContext (outer), eQ→runWithTeammateContext (inner),
//          sF→mutateInProcessTeammateTask, k97→wrapMessageForTeammate,
//          LXY→buildCanUseToolForTeammate, _u→agentLoop, vI6→compactConversation,
//          jNK→sendIdleNotification, CXY→pollForNextMessage
```

### Critical Step-by-Step Logic

1. **Pre-roll task claim** — Before the first turn, `HNK` is called once with no incoming message. This lets a freshly-spawned teammate immediately self-direct toward an unowned task without requiring the leader to push one.

2. **Per-turn embedded compaction** — The teammate runs its own threshold check. If it's over, it calls the standard `vI6`. `PreCompact`-blocked errors are caught and execution continues uncompacted. This means a teammate can independently outlive its context window without leader intervention.

3. **Two abort controllers** — The outer `abortController` (set up in `cI8`) drives total teardown; the inner `currentWorkAbort` lets the user (via the leader's UI) press Escape to interrupt the *current* turn but leave the loop alive for the next message.

4. **Two AsyncLocalStorage scopes** — `lZ8(teammateContext, ...)` is the team-level scope (carries `teamName`, `parentSessionId`); `eQ(teammateScope, ...)` is the agent-level scope. Together they make `uB()` resolve correctly across `await` boundaries. Without them, telemetry/logs would attribute teammate work to the leader.

5. **Idle gating** — The runner records `isIdle: true` and fires any pending `onIdleCallbacks`, then writes the `idle_notification` to the leader's inbox. The dedup check (`!wasAlreadyIdle`) avoids notifying the leader twice when polling exits and re-enters quickly without performing real work.

6. **Block on poll** — The runner's `await CXY(...)` is its only wait. There is no SetInterval, no timer, no daemon — the agent loop pauses inside `CXY` until the abort signal trips, a message arrives, or a task can be claimed.

### Why this approach

**Why a single while-loop instead of an event-driven dispatcher?**
Because the agent loop (`_u`) is itself a generator that yields turn events; treating each cycle of message-receipt → processing → idle-report as a clear linear sequence makes it obvious how teammate state evolves. An event-driven model would have to reconstruct the same state machine implicitly across handlers.

**Why poll instead of using inotify/fsevents?**
Cross-platform consistency. The same poll runs on Linux/macOS/Windows (under WSL or native) without conditional code. The lock-then-RMW pattern in `F_` is the same on every platform. The price (500ms latency in the worst case) is acceptable given that agent turns take seconds anyway.

**Why embed compaction, not bridge it?**
A bridged compactor would need to read/write a teammate's history from the leader's process, requiring shared memory or RPC. The current design keeps each teammate self-contained: the leader manages its own context; teammates manage theirs. The trade-off is duplicated logic (each teammate carries the same compact pipeline), but the code is shared (it's all `vI6`), so the only cost is the per-process overhead of running it.

---

## Five-Level Priority Polling (CXY)

```
CXY(identity, abort, taskId, getAppState, setAppState, parentSessionId):
  poll = 0
  while !abort.signal.aborted:
    # Level 1: in-memory queue
    let task = getAppState().tasks[taskId]
    if task.pendingUserMessages.length > 0:
      pop oldest → return {type: "new_message", from: "user"}

    if poll > 0: await sleep(500)            # idle pause
    poll++; if abort: return {type: "aborted"}

    let msgs = await readMailbox(name, team)

    # Level 2: shutdown_request scan (ALL unread, regardless of order)
    for m in msgs where !read:
      if parseShutdownRequest(m.text):
        await markAsRead(name, team, idx)
        return {type: "shutdown_request", request, originalMessage: m.text}

    # Level 3: prefer team-lead sender
    let i = msgs.findIndex(m => !read && m.from == "team-lead")

    # Level 4: any unread (peers/broadcasts)
    if i == -1: i = msgs.findIndex(m => !read)

    if i != -1:
      await markAsRead(name, team, i)
      return {type: "new_message", from: m.from, message: m.text, color, summary}

    # Level 5: try task auto-claim
    let prompt = await claimUnclaimedTask(parentSessionId, name)
    if prompt: return {type: "new_message", from: "task-list", message: prompt}

  return {type: "aborted"}
```

### Why level 1 doesn't need `await sleep(500)` first

The in-memory `pendingUserMessages` queue is fed synchronously by the leader's TUI when the user types into a teammate's chat. There's no I/O cost to drain it, so it's checked on every iteration before sleeping. Mailbox reads are gated by the sleep because they go through `fs.readFile` and consume FS bandwidth.

### Why shutdown is scanned before order

A leader trying to recover from a stuck teammate may have queued multiple status-check messages before realizing the teammate is unresponsive. Sending a `shutdown_request` then would put it behind those status checks in arrival order, but the runner needs to honor it *immediately*. The two-pass scan (shutdown first, ordered preference second) means the priority of "stop now" beats the priority of "answer questions in order".

### Why team-lead is preferred

Within unread mailbox messages, lead-originated messages are processed first because the leader is the canonical source of intent. Peer-originated messages (from other teammates) are still delivered, but only after the team's coordinator has had a chance.

### Why task auto-claim is last

The auto-claim path lets a teammate self-direct toward unowned tasks. Putting it at the back of the queue means manual messages (which arrive less frequently than tasks) preempt automatic work. A teammate with no inbox traffic and an unowned task waits one full poll cycle (500ms), then claims; with traffic, claims happen between messages.

See [polling_priorities.md](./polling_priorities.md) for the full algorithmic detail and a worked example.

---

## Mailbox Format

```
~/.claude/{sanitizedTeamName}/inboxes/{sanitizedAgentName}.json    -- the messages array
~/.claude/{sanitizedTeamName}/inboxes/{sanitizedAgentName}.json.lock -- proper-lockfile sentinel
~/.claude/{sanitizedTeamName}/tasks.json                           -- shared task list
~/.claude/{sanitizedTeamName}/config.json                          -- team config (members, mode)
```

### Message Envelope

```typescript
type MailboxMessage = {
  from: string;        // sender's sanitized name; "team-lead" for leader
  text: string;        // either plain text or JSON-encoded structured message
  timestamp: string;   // ISO 8601
  read: boolean;       // mutated to true on consumption
  color?: string;      // sender's hex color for TUI rendering
  summary?: string;    // one-line preview for TUI
};
```

For structured messages (`shutdown_request`, `permission_request`, `idle_notification`, `plan_approval_*`), `text` is a JSON-stringified object with a `type` discriminator. Parsers (`i56`, `j18`, `KJ6`, `$18`) try to decode and return null on failure, allowing plain text to coexist with structured messages.

### Locking

```javascript
// ============================================
// writeToMailbox - Append a message under proper-lockfile lock
// Location: chunks.100.mjs:3-36
// ============================================

// ORIGINAL (for source lookup):
async function F_(q, K, _) {
  await dWz(_);
  let z = eH6(q, _), Y = `${z}.lock`;
  try { await Qh6(z, "[]", {encoding: "utf-8", flag: "wx"}); }
  catch (O) { if (Q1(O) !== "EEXIST") return; }
  let A;
  try {
    A = await Jj(z, {lockfilePath: Y, ...z18});
    let O = await ts(q, _),
        w = {...K, read: !1};
    O.push(w);
    await Qh6(z, I6(O, null, 2), "utf-8");
  } catch (O) { j6(O); }
  finally { if (A) await A(); }
}

// READABLE (for understanding):
async function writeToMailbox(recipient, message, teamName) {
  await ensureInboxDirectory(teamName);
  const inboxPath = getInboxPath(recipient, teamName);
  const lockPath  = `${inboxPath}.lock`;

  try { await fs.writeFile(inboxPath, "[]", {encoding: "utf-8", flag: "wx"}); }
  catch (e) { if (e.code !== "EEXIST") return; }   // some other I/O failure

  let release;
  try {
    release = await properLockfile(inboxPath, {lockfilePath: lockPath, ...LOCK_RETRY_OPTS});
    const messages = await readMailbox(recipient, teamName);
    messages.push({...message, read: false});
    await fs.writeFile(inboxPath, JSON.stringify(messages, null, 2), "utf-8");
  } catch (e) { logError(e); }
  finally { if (release) await release(); }
}

// Mapping: F_→writeToMailbox, q→recipient, K→message, _→teamName,
//          eH6→getInboxPath, dWz→ensureInboxDirectory, Jj→properLockfile,
//          z18→LOCK_RETRY_OPTS, ts→readMailbox, Qh6→fs.writeFile
```

The `{flag: "wx"}` exclusive-create plus subsequent lock acquire avoids both the missing-file race and the read-modify-write race even if N spawning teammates concurrently write to the leader's inbox.

See [mailbox_protocol.md](./mailbox_protocol.md) for the full envelope and message-type registry.

---

## Permission Sync Round-Trip

When a teammate would normally ask the user for tool permission but no UI is available (e.g., headless pane or in-process with no foreground), the runner's `canUseTool` (`LXY`) routes the request through the mailbox.

```
Worker:
  canUseTool callback fires for tool X with input I
  LXY constructs permission request {requestId, toolName, toolUseId, input, suggestions}
  aI8 → bb4 (lookup leader name) → Ti1 (build envelope) → F_ (write to leader inbox)
  Worker awaits a pending Promise tied to requestId

Leader:
  Reads inbox, sees {type: "permission_request", request_id, ...}
  Surfaces to user (TUI prompt or auto-decision based on context)
  User decides → sI8 → Vi1 (build response) → F_ (write to worker inbox)

Worker:
  Polls inbox, reads {type: "permission_response", request_id, subtype, ...}
  Finds the matching pending Promise, resolves with decision
  canUseTool returns to the agent loop
```

`aI8` (chunks.100.mjs:1377) and `sI8` (chunks.100.mjs:1401) are the dispatchers. The actual await/resolve plumbing lives inside `LXY`, which holds a map of pending request IDs to resolvers.

See [permission_sync.md](./permission_sync.md) for the full handshake and timeout handling.

---

## Plan-Mode Integration

If a teammate is spawned with `plan_mode_required: true`:

1. The CLI flag (`--plan-mode-required`) propagates to the new process.
2. The teammate's runner records `awaitingPlanApproval: true` in its task record.
3. When the teammate calls `ExitPlanMode`, instead of switching itself out of plan mode, it sends a `plan_approval_request` to the leader's inbox via SendMessage.
4. The leader's TUI surfaces the plan and lets the user approve/reject. The decision goes back via SendMessage as `plan_approval_response`.
5. On approval, the teammate clears `awaitingPlanApproval` and proceeds; on rejection, it receives `feedback` as the next user prompt and re-plans.

See [plan_mode_integration.md](./plan_mode_integration.md) for the message shapes, timeout, and TUI UX.

---

## Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Phase    Action                                       Symbol             │
├─────────────────────────────────────────────────────────────────────────┤
│ Spawn    user calls Agent({name, team_name, prompt})                     │
│          dispatch tool call → Agent tool .call()      RHK.call           │
│          → P2K → n7Y → bF? choose backend             n7Y / bF           │
│ ─────────────────────────────────────────────────────────────────────    │
│ Setup    sanitize name + dedupe + assign color        S77 / d7Y          │
│          probe pane backend (if pane mode)            v96                │
│          create pane / window                         Y2K / tmux         │
│          clear teammate inbox                         O18                │
│          write first prompt to teammate inbox         F_                 │
│ ─────────────────────────────────────────────────────────────────────    │
│ Boot     in-process: cI8 builds task record           cI8                │
│          in-process: Jg8 fires bXY                    Jg8                │
│          pane:       claude CLI launches with flags                       │
│          pane CLI:   parses flags, routes to bXY      (CLI bootstrap)    │
│ ─────────────────────────────────────────────────────────────────────    │
│ Loop     bXY: enter teammate AsyncLocalStorage scope  eQ                 │
│          bXY: pre-roll task claim                     HNK                │
│          while not aborted:                                              │
│            run agentLoop turn                         _u                 │
│            embed compact if over threshold            vI6                │
│            mark idle, send idle_notification          jNK                │
│            await pollForNextMessage                   CXY                │
│              ├ priority 1: pendingUserMessages                           │
│              ├ priority 2: shutdown_request scan      i56                │
│              ├ priority 3: team-lead messages                            │
│              ├ priority 4: any unread                                    │
│              └ priority 5: claimUnclaimedTask         HNK                │
│ ─────────────────────────────────────────────────────────────────────    │
│ Permission worker.canUseTool(X, I) needs approval                        │
│          aI8 writes permission_request to lead inbox  aI8 → F_           │
│          worker awaits Promise for requestId                              │
│          leader reads, decides                                            │
│          sI8 writes permission_response to worker     sI8 → F_           │
│          worker poll picks it up, resolves Promise                        │
│ ─────────────────────────────────────────────────────────────────────    │
│ Plan     teammate calls ExitPlanMode                                      │
│          SendMessage plan_approval_request → leader                      │
│          leader UI approves                                              │
│          SendMessage plan_approval_response → teammate                   │
│          teammate clears awaitingPlanApproval, continues                  │
│ ─────────────────────────────────────────────────────────────────────    │
│ Shutdown leader sends shutdown_request                                    │
│          worker priority-2 scan picks it up                              │
│          worker passes prompt to model                                    │
│          model responds; worker sends shutdown_response (approve/reject)  │
│          if approve: teammate finishes turn, exits loop                  │
│          if reject:  teammate continues; leader can retry or force-kill  │
│ ─────────────────────────────────────────────────────────────────────    │
│ Teardown abortController.abort() (manual or kill request)                 │
│          backend pane.kill (pane modes)                                   │
│          status='killed'/'completed'/'failed', endTime set                │
│          inbox is *not* deleted (lasts session-long)                     │
│          taskRegistry.evictTerminal(taskId)                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## What's Different in v2.1.112

| Subsystem | v2.1.76 | v2.1.112 |
|-----------|---------|----------|
| Feature gate | `E7()` chunks.50.mjs:2543 | `z4()` chunks.63.mjs:2617 |
| Spawn dispatcher | `pNY` chunks.135.mjs | `n7Y` chunks.137.mjs:2929 |
| In-process spawn | `FNY` chunks.135.mjs | `j2K` chunks.137.mjs:2803 |
| Split-pane spawn | `BNY` chunks.135.mjs | `c7Y` chunks.137.mjs:2534 |
| Tmux window spawn | `gNY` chunks.135.mjs | `l7Y` chunks.137.mjs:2653 |
| In-process check | `Rb()` (defaulted to false unless interior) | `bF()` (defaulted to true unless tmux/iTerm2 detected) |
| Runner | `XNY` chunks.134.mjs | `bXY` chunks.155.mjs:3 |
| Poll loop | `DNY` chunks.134.mjs | `CXY` chunks.154.mjs:2462 |
| Task claim | `Ji4` chunks.84.mjs | `HNK` chunks.154.mjs:2443 |
| Mailbox write | `x3` chunks.132.mjs | `F_` chunks.100.mjs:3 |
| Mailbox read | `wl` chunks.132.mjs | `ts` chunks.99.mjs:1952 |
| Mark read | `kc6` chunks.132.mjs | `A18` chunks.100.mjs:73 |
| Mark single read | `Vc6` chunks.132.mjs | `Y18` chunks.100.mjs:38 |
| SendMessage tool | `OxY` chunks.145.mjs | `LJY` chunks.153.mjs:367 |

Behavior changes:
- **In-process is the new default.** v2.1.76 had a two-prong fallback — try pane backend, fall back to in-process — but the natural state was to use a pane. v2.1.112 inverts that: the natural state is in-process, and pane mode is opt-in via `--teammate-mode tmux` or team config.
- **Permission sync is unchanged in shape**, but the worker-side resolver has been factored cleanly into `LXY`, sharing primitives with the new agent SDK auto-permission path.
- **Plan-mode propagation now passes through `--plan-mode-required`** rather than serializing per-message (this was already the case in v2.1.76 but is consolidated in v2.1.112).
