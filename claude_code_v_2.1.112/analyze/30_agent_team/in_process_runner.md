# In-Process Runner — Agent Teams (v2.1.112)

## Overview

The in-process runner `bXY` (chunks.155.mjs:3) is the **central long-lived loop** that drives every in-process teammate. It also runs inside every pane-mode teammate's CLI process (the spawned `claude` binary parses `--agent-id`/`--team-name` and routes itself into `bXY` at startup), so the runner code is identical across backends; only the entry path differs.

This document covers:
- The runner's high-level structure (turn loop, poll, abort wiring).
- The two AsyncLocalStorage scopes (`teammateContext` outer + `teammateScope` inner).
- The two AbortController layers (lifecycle vs current-work).
- The embedded auto-compaction step.
- The build of `agentDefinition` and `canUseTool`.
- The end-of-turn idle notification gate.
- The error path and clean exit path.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md).

Key functions in this document:
- `inProcessAgentRunner` (`bXY`) — chunks.155.mjs:3
- `startInProcessAgentExecution` (`Jg8`) — chunks.155.mjs:309
- `mutateInProcessTeammateTask` (`sF`) — chunks.154.mjs:2394
- `wrapMessageForTeammate` (`k97`) — chunks.154.mjs:2386
- `buildCanUseToolForTeammate` (`LXY`) — chunks.154.mjs:2203
- `pollForNextMessage` (`CXY`) — chunks.154.mjs:2462
- `claimUnclaimedTask` (`HNK`) — chunks.154.mjs:2443
- `runWithTeammateContext` (`eQ`) — chunks.63.mjs:2632
- `getCurrentTeammateContext` (`uB`) — chunks.63.mjs:2628
- `compactConversation` (`vI6`) — chunks.159.mjs:574
- `agentLoop` (`_u`) — referenced
- `outerTeammateScope` (`lZ8`) — referenced

---

## Runner Lifecycle (Bird's-Eye)

```
Jg8 (fire-and-forget wrapper)
  │
  ├─ bXY(args)
  │     ├─ Build agent definition + tools
  │     ├─ Pre-roll: HNK to claim a starter task if available
  │     ├─ Snapshot initial prompt as wrapped <teammate> XML
  │     ├─ Loop:
  │     │     1. Embed compact if over threshold
  │     │     2. Run nested agent loop (_u) inside double scope (eQ + lZ8)
  │     │        - Stream events into messages[]
  │     │        - Update task progress + UI state per event
  │     │     3. Mark idle, fire onIdleCallbacks, send idle_notification
  │     │     4. await CXY (poll for next message)
  │     │     5. Switch on next.type:
  │     │        - shutdown_request → wrap, append, continue
  │     │        - new_message      → wrap if not from "user", append, continue
  │     │        - aborted          → break loop
  │     │
  │     ├─ Exit: write status="completed" or "failed", evict task
  │     └─ Send final idle_notification ("failed") on error
  │
  └─ .catch(e → log "Unhandled error in <agentId>")
```

---

## Phase 1: Entry & Definition Build

```javascript
// READABLE pseudocode
async function inProcessAgentRunner(args) {
  const {
    identity,            // {agentId, agentName, teamName, color, planModeRequired, parentSessionId}
    taskId,              // key into AppState.tasks
    prompt,              // initial user prompt from leader
    description,
    agentDefinition,     // optional preset (custom agent type)
    teammateContext,     // payload for the OUTER AsyncLocalStorage scope
    toolUseContext,      // wider Claude Code session context
    abortController,     // LIFECYCLE abort
    model,
    systemPrompt, systemPromptMode, allowedTools, allowPermissionPrompts,
    invokingRequestId,
  } = args;

  log(`[inProcessRunner] Starting agent loop for ${identity.agentId}`);

  // INNER scope — propagates per-turn telemetry/log identity
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
```

### System prompt assembly

The teammate gets a system prompt assembled from up to three layers:
1. The default Claude Code system prompt (read via `j0(toolUseContext.options.tools, mainLoopModel)`).
2. The custom agent's `getSystemPrompt()` if an `agentDefinition` was passed (e.g., a user-defined "researcher" agent).
3. Optional override via `systemPromptMode === "replace"` (full takeover) or `"append"` (addition).

```javascript
let finalSystemPrompt;
if (systemPromptMode === "replace" && systemPrompt) {
  finalSystemPrompt = systemPrompt;
} else {
  const sections = [...await buildBaseSystemPrompt(toolUseContext.options.tools, toolUseContext.options.mainLoopModel), V97];
  if (agentDefinition) {
    const customSystem = agentDefinition.getSystemPrompt();
    if (customSystem) sections.push(`\n# Custom Agent Instructions\n${customSystem}`);
    if (agentDefinition.memory) emitTelemetry("tengu_agent_memory_loaded", {scope: agentDefinition.memory, source: "in-process-teammate"});
  }
  if (systemPromptMode === "append" && systemPrompt) sections.push(systemPrompt);
  finalSystemPrompt = sections.join("\n");
}
```

`V97` is a constant section appended to all teammates' system prompts — it includes team-specific instructions like "Use SendMessage to communicate with the team", "Mark tasks complete via the task tool", etc.

### Definition assembly

```javascript
const definitionForLoop = {
  agentType: identity.agentName,
  whenToUse: `In-process teammate: ${identity.agentName}`,
  getSystemPrompt: () => finalSystemPrompt,
  tools: agentDefinition?.tools
    ? mergeTools([...agentDefinition.tools, tW, lp, Cc, YT, Sc, xD, gk])  // add team tools
    : ["*"],
  source: "projectSettings",
  permissionMode: "default",          // overridden per-turn from the task record
  ...(agentDefinition?.model && { model: agentDefinition.model }),
};
```

The team tools (`tW`/`lp`/`Cc`/etc.) — SendMessage, TeamCreate, Skill, etc. — are merged in even when the user's custom agent specifies a tools list, because a teammate without SendMessage cannot communicate.

---

## Phase 2: Pre-Roll Task Claim

```javascript
await claimUnclaimedTaskIfPossible(identity.parentSessionId, identity.agentName);
```

Right before the first turn, the runner attempts to claim an unowned task. This means a teammate spawned with a generic prompt like "Help with the team's work" can immediately self-direct toward the next pending task without an extra round-trip.

### Why pre-roll, not just rely on Priority 5 in the poll?

The first turn's prompt comes from the spawning leader; if it's generic, the model has nothing concrete to do. The pre-roll claim updates the runner's `nextPrompt` to a specific task description, giving the model a head start. Without it, the model would respond to the generic prompt, then on the next poll cycle pick up a task from Priority 5 anyway — but with one wasted turn.

---

## Phase 3: Per-Turn Loop

```javascript
const messages = [];
let nextPrompt = wrapMessageForTeammate("team-lead", prompt, undefined, description);
let interrupted = false;
let exiting = false;

// Pre-pend wrapped prompt to AppState
mutateTask(taskId, t => ({...t, messages: [...t.messages, mkUserMsg(nextPrompt)]}), setAppState);

const contentReplacementState = toolUseContext.contentReplacementState ? makeContentReplacementState() : undefined;

while (!abortController.signal.aborted && !exiting) {
  log(`[inProcessRunner] ${identity.agentId} processing prompt: ${nextPrompt.substring(0,50)}...`);

  // Per-turn abort (driven by Escape in the leader's TUI)
  const currentWorkAbort = new AbortController();
  mutateTask(taskId, t => ({...t, currentWorkAbortController: currentWorkAbort}), setAppState);

  const userMsg = mkUserMsg(nextPrompt);
  let promptMessages = [userMsg];
  let snapshotMessages = messages;
  const tokensBefore = countTokens(messages);

  // ── Phase 3a: embedded autocompact ────────────────────────────
  if (tokensBefore > getAutoCompactThreshold(toolUseContext.options.mainLoopModel, getAppState().autoCompactWindow)) {
    log(`[inProcessRunner] ${identity.agentId} compacting history (${tokensBefore} tokens)`);
    const compactCtx = {
      ...toolUseContext,
      readFileState: cloneReadFileState(toolUseContext.readFileState),
      memorySelector: makeMemorySelector(),
      onCompactProgress: undefined,
      setStreamMode: undefined,
    };
    try {
      const result = await compactConversation(messages, compactCtx, {
        systemPrompt: getCompactSystemPrompt([]),
        userContext: {},
        systemContext: {},
        toolUseContext: compactCtx,
        forkContextMessages: [],
      }, /* isAuto */ true, undefined, /* sessionMemory */ true);
      snapshotMessages = restoreFilesFromCompactResult(result);
      resetSomeReplacementStateAfterCompact();
      if (contentReplacementState) replaceContentReplacementState();
      messages.length = 0;
      messages.push(...snapshotMessages);
      mutateTask(taskId, t => ({...t, messages: [...snapshotMessages, userMsg]}), setAppState);
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("Compaction blocked by PreCompact hook")) {
        log(`[inProcessRunner] ${identity.agentId} compaction blocked by PreCompact hook; continuing uncompacted`);
      } else {
        throw e;
      }
    }
  }

  const forkSnapshot = snapshotMessages.length > 0 ? [...snapshotMessages] : undefined;
  messages.push(userMsg);

  // ── Phase 3b: run agent loop inside scope ─────────────────────
  const progressTracker = makeProgressTracker();
  const toolNames = toolNamesFromContext(toolUseContext.options.tools);
  const collected = [];
  const taskRecord = getAppState().tasks[taskId];
  const turnPermissionMode = taskRecord && taskRecord.type === "in_process_teammate"
    ? taskRecord.permissionMode
    : "default";
  const definitionWithMode = { ...definitionForLoop, permissionMode: turnPermissionMode };
  let interruptedThisTurn = false;

  await runOuterTeammateScope(teammateContext, async () => {       // lZ8
    return runInnerTeammateScope(teammateScope, async () => {      // eQ
      mutateTask(taskId, t => ({...t, status: "running", isIdle: false}), setAppState);

      for await (const event of agentLoop({
        agentDefinition: definitionWithMode,
        promptMessages,
        toolUseContext,
        canUseTool: buildCanUseToolForTeammate(identity, currentWorkAbort, (pausedMs) => {
          mutateTask(taskId, t => ({...t, totalPausedMs: (t.totalPausedMs ?? 0) + pausedMs}), setAppState);
        }),
        isAsync: true,
        canShowPermissionPrompts: allowPermissionPrompts ?? true,
        forkContextMessages: forkSnapshot,
        querySource: "agent:custom",
        override: {abortController: currentWorkAbort},
        model,
        preserveToolUseResults: true,
        availableTools: toolUseContext.options.tools,
        allowedTools,
        contentReplacementState,
        isTeammate: true,
      })) {
        if (abortController.signal.aborted) {
          log(`[inProcessRunner] ${identity.agentId} lifecycle aborted`);
          break;
        }
        if (currentWorkAbort.signal.aborted) {
          log(`[inProcessRunner] ${identity.agentId} current work aborted (Escape pressed)`);
          interruptedThisTurn = true;
          break;
        }
        collected.push(event);
        messages.push(event);
        recordEventForProgress(progressTracker, event, toolNames, toolUseContext.options.tools);
        const progress = computeProgressSnapshot(progressTracker);

        // Update task record per event — propagates to TUI
        mutateTask(taskId, t => updateInProgressToolUseIDs(t, event, progress, messages), setAppState);
      }
      return { success: true, messages: collected };
    });
  });

  mutateTask(taskId, t => ({...t, currentWorkAbortController: undefined}), setAppState);
  if (abortController.signal.aborted) break;

  // ── Phase 3c: capture interrupt as fake user message ──────────
  if (interruptedThisTurn) {
    log(`[inProcessRunner] ${identity.agentId} work interrupted, returning to idle`);
    const abortMsg = mkSystemMsg("API Error: Request was aborted.");
    mutateTask(taskId, t => ({...t, messages: appendMessage(t.messages, abortMsg)}), setAppState);
  }

  // ── Phase 3d: idle gate + notification ────────────────────────
  const taskRecordPostTurn = getAppState().tasks[taskId];
  const wasAlreadyIdle = taskRecordPostTurn?.type === "in_process_teammate" && taskRecordPostTurn.isIdle;
  mutateTask(taskId, t => {
    t.onIdleCallbacks?.forEach(cb => cb());
    return {...t, isIdle: true, onIdleCallbacks: []};
  }, setAppState);
  if (!wasAlreadyIdle) {
    await sendIdleNotification(identity.agentName, identity.color, identity.teamName, {
      idleReason: interruptedThisTurn ? "interrupted" : "available",
      summary: lastAssistantText(messages),
    });
  } else {
    log(`[inProcessRunner] Skipping duplicate idle notification for ${identity.agentName}`);
  }

  // ── Phase 3e: poll for next ───────────────────────────────────
  log(`[inProcessRunner] ${identity.agentId} finished prompt, waiting for next`);
  const next = await pollForNextMessage(identity, abortController, taskId, getAppState, setAppState, identity.parentSessionId);
  switch (next.type) {
    case "shutdown_request":
      log(`[inProcessRunner] ${identity.agentId} received shutdown request - passing to model`);
      nextPrompt = wrapMessageForTeammate(next.request?.from || "team-lead", next.originalMessage);
      mutateTask(taskId, t => appendMessage(t, mkUserMsg(nextPrompt)), setAppState);
      break;
    case "new_message":
      log(`[inProcessRunner] ${identity.agentId} received new message from ${next.from}`);
      if (next.from === "user") {
        nextPrompt = next.message;       // raw, no XML wrap
      } else {
        nextPrompt = wrapMessageForTeammate(next.from, next.message, next.color, next.summary);
        mutateTask(taskId, t => appendMessage(t, mkUserMsg(nextPrompt)), setAppState);
      }
      break;
    case "aborted":
      log(`[inProcessRunner] ${identity.agentId} aborted while waiting`);
      exiting = true;
      break;
  }
  interrupted = false;
}
```

### Critical observations

1. **Two abort controllers, two roles.** `abortController` is the *lifecycle* abort — it tears the entire loop down. `currentWorkAbort` is per-turn and lets the user (via Escape in the leader's TUI) cancel the *current* model call without exiting the loop. The runner re-creates `currentWorkAbort` every iteration.

2. **Embed compaction at the top of each turn.** Before adding the new user message, the runner checks tokens and compacts if needed. The check happens *after* `pre-roll` task claim and *before* the new message is appended, so the compact target is the message history without the new prompt.

3. **PreCompact hook is non-fatal.** If the user's `PreCompact` hook returns `decision: "block"`, `vI6` throws a `GI6`-prefixed error. The runner catches this and continues without compacting — the next turn will simply be over the threshold again, giving the hook another chance to run.

4. **Forked context for the agent loop.** `forkContextMessages` passes the message snapshot *before* the new user message. The agent loop uses this for context continuity, not for replay. A teammate can't time-travel through its own history; the snapshot is read-only.

5. **Two scopes, two roles.** `lZ8` (outer) is the team-context scope — carries `teamName`, `parentSessionId`, things shared across turns. `eQ` (inner) is the per-turn scope with `isTeamLead: false` etc. Using both means any nested code (telemetry, logging, hooks) sees the right values regardless of where it's queried.

6. **Per-event task mutations.** Every event yielded by `_u` triggers a `mutateTask` call to keep `inProgressToolUseIDs`, `progress`, and `messages` synced for the TUI. This is the connection between the agent loop and the team status renderer.

7. **Idle dedup.** If two consecutive turns both end with no work (e.g., one was interrupted and the next was empty), the runner skips the second idle notification to avoid spamming the leader.

---

## Phase 4: Clean Exit

```javascript
let alreadyExited = false;
let exitToolUseId;
mutateTask(taskId, t => {
  if (t.status !== "running") {
    alreadyExited = true;
    return t;
  }
  exitToolUseId = t.toolUseId;
  t.onIdleCallbacks?.forEach(cb => cb());
  t.unregisterCleanup?.();
  return {
    ...t,
    status: "completed",
    notified: true,
    endTime: Date.now(),
    messages: t.messages?.length ? [t.messages.at(-1)] : undefined,   // keep only final
    pendingUserMessages: [],
    inProgressToolUseIDs: undefined,
    abortController: undefined,
    unregisterCleanup: undefined,
    currentWorkAbortController: undefined,
    onIdleCallbacks: [],
  };
}, setAppState);
removeTaskFromActiveSet(taskId);                        // n2
toolUseContext.taskRegistry.evictTerminal(taskId);

if (!alreadyExited) {
  emitTelemetry(taskId, "completed", { toolUseId: exitToolUseId, summary: identity.agentId });
}
return finalizeAgentTeardown(identity.agentId), { success: true, messages };  // OJ6
```

### Design choice: keep only the final message

After completion, the task's `messages` array is truncated to its last element. This is so the TUI's "team status" panel can render a one-line summary of "what the teammate ended on" without scanning a thousand-message array. The full history is still in `messages` (the function-local var) — it's returned to the caller — but the live AppState shrinks to a single representative message.

### evictTerminal

`taskRegistry.evictTerminal(taskId)` removes the task from the active set after a delay (50ms in this code path? actually `nS4` is referenced; specific value depends on context). The delay lets last-mile observers (TUI, log streams) flush before the task disappears.

---

## Phase 5: Error Path

```javascript
catch (err) {
  const errMsg = err instanceof Error ? err.message : "Unknown error";
  log(`[inProcessRunner] Agent ${identity.agentId} failed: ${errMsg}`);

  let alreadyHandled = false;
  let toolUseId;
  mutateTask(taskId, t => {
    if (t.status !== "running") {
      alreadyHandled = true;
      return t;
    }
    toolUseId = t.toolUseId;
    t.onIdleCallbacks?.forEach(cb => cb());
    t.unregisterCleanup?.();
    return {
      ...t,
      status: "failed",
      notified: true,
      error: errMsg,
      isIdle: true,
      endTime: Date.now(),
      onIdleCallbacks: [],
      messages: t.messages?.length ? [t.messages.at(-1)] : undefined,
      pendingUserMessages: [],
      inProgressToolUseIDs: undefined,
      abortController: undefined,
      unregisterCleanup: undefined,
      currentWorkAbortController: undefined,
    };
  }, setAppState);
  removeTaskFromActiveSet(taskId);
  toolUseContext.taskRegistry.evictTerminal(taskId);

  if (!alreadyHandled) {
    emitTelemetry(taskId, "failed", { toolUseId, summary: identity.agentId });
  }

  await sendIdleNotification(identity.agentName, identity.color, identity.teamName, {
    idleReason: "failed",
    completedStatus: "failed",
    failureReason: errMsg,
  });

  finalizeAgentTeardown(identity.agentId);    // OJ6
  return { success: false, error: errMsg, messages };
}
```

The error path mirrors the success path almost line-for-line, with three differences:
1. Status is `"failed"` instead of `"completed"`.
2. The error message is preserved in `error`.
3. A final `idle_notification` with `idleReason: "failed"` is sent so the leader knows.

---

## buildCanUseToolForTeammate (LXY)

The runner wires `canUseTool` to a teammate-specific implementation. This is what makes permission requests route through the mailbox instead of opening a UI modal.

```javascript
// READABLE pseudocode of LXY's role
function buildCanUseToolForTeammate(identity, currentWorkAbort, recordPause) {
  return async (toolName, input, opts) => {
    // Standard pre-checks (allowed tools, mode etc.) handled by inner machinery
    // If user-prompt is required:
    if (needsUserDecision(toolName, input, opts)) {
      // Try in-app prompt first if leader can show one
      if (canShowLocalPrompt) {
        const start = Date.now();
        const decision = await showLocalPermissionPrompt(...);
        recordPause(Date.now() - start);
        return decision;
      }
      // Otherwise, send permission_request via mailbox
      const requestId = generateRequestId();
      sendPermissionRequest({                // aI8
        id: requestId,
        teamName: identity.teamName,
        workerName: identity.agentName,
        workerColor: identity.color,
        toolName,
        toolUseId: opts.toolUseId,
        description: opts.description,
        input,
        permissionSuggestions: opts.suggestions,
      });
      // Block until the matching permission_response arrives via the next poll cycle
      const start = Date.now();
      const response = await waitForPermissionResponse(requestId, currentWorkAbort.signal);
      recordPause(Date.now() - start);
      return mapResponseToDecision(response);
    }
    return autoAllow();
  };
}
```

`recordPause` is critical: every millisecond spent waiting for permission decisions is added to `task.totalPausedMs` so the TUI can show how much time the teammate spent blocked vs working.

See [permission_sync.md](./permission_sync.md) for the full mailbox round-trip.

---

## mutateInProcessTeammateTask (sF)

```javascript
// ============================================
// mutateInProcessTeammateTask - Typed setAppState helper
// Location: chunks.154.mjs:2394-2407
// ============================================

// ORIGINAL (for source lookup):
function sF(q, K, _) {
  _((z) => {
    let Y = z.tasks[q];
    if (!Y || Y.type !== "in_process_teammate") return z;
    let A = K(Y);
    if (A === Y) return z;
    return {...z, tasks: {...z.tasks, [q]: A}};
  });
}

// READABLE (for understanding):
function mutateInProcessTeammateTask(taskId, mutator, setAppState) {
  setAppState(state => {
    const task = state.tasks[taskId];
    if (!task || task.type !== "in_process_teammate") return state;
    const next = mutator(task);
    if (next === task) return state;                  // no-op skip
    return { ...state, tasks: { ...state.tasks, [taskId]: next } };
  });
}

// Mapping: sF→mutateInProcessTeammateTask, q→taskId, K→mutator, _→setAppState
```

This helper is the only correct way to mutate a teammate's task record. It:
- Filters by type so non-teammate tasks aren't accidentally targeted.
- Skips redundant updates (`if next === task return state`) to avoid React re-renders.
- Preserves immutability so observers' diffs are clean.

---

## Why `bXY` is the Same for All Backends

A pane-mode teammate's CLI process runs roughly:

```
parse argv (--agent-id, --team-name, ...)
build identity record from flags
call bXY({identity, taskId, prompt: <read from inbox>, ...})
```

Specifically, the boot path uses the same `bXY` with a fresh `taskRegistry` (the pane process has its own AppState). The only difference is that the pane process's leader is "remote" — the leader's `pendingUserMessages` queue lives in the leader's AppState, not the pane's. So Priority 1 of the poll never fires for pane teammates; everything goes through the mailbox.

This shared-binary design is why feature additions to the runner automatically apply to every backend.

---

## Why a generator-driven loop?

The agent loop `_u` is an async generator yielding turn events (`assistant`, `user`, `tool_use`, `tool_result`, etc.). Wrapping it in a `for await` lets the runner:
- Update task state per event (progress, in-progress tool ids).
- Break on abort signals between events (tighter cancellation than awaiting the whole turn).
- Forward events into AppState's messages array in arrival order.

An RPC-style "call agentLoop, get result back" wouldn't allow the per-event TUI updates that drive the team status renderer.

---

## Wire-Up Diagram

```
          ┌────────────────────────────────────────────┐
          │  bXY (inProcessAgentRunner)                 │
          └─┬──────────────────────────────────────────┘
            │
            │ enters lZ8 (teammateContext) outer scope
            │   enters eQ (teammateScope) inner scope
            │
            ├─► _u (agentLoop generator)
            │       │
            │       │ yields turn events
            │       │
            │       ◄── canUseTool = LXY(...)
            │            │
            │            └─► aI8 → F_ (write to leader)
            │                  ◄── mailbox poll picks up response
            │                  └─► sI8 (leader writes back)
            │
            ├─► sF (mutateTask) per event (TUI state)
            │
            ├─► vI6 (compactConversation) when over threshold
            │       │
            │       ◄── PreCompact hook (oc)
            │       │
            │       ◄── PostCompact hook (K36)
            │
            ├─► jNK (sendIdleNotification) at idle boundary
            │       │
            │       └─► hXY → F_ (write to leader inbox)
            │
            └─► CXY (pollForNextMessage)
                    │
                    ├── Priority 1: AppState.tasks[id].pendingUserMessages
                    ├── Priority 2: parseShutdownRequest scan over msgs
                    ├── Priority 3: msgs[i].from === "team-lead"
                    ├── Priority 4: msgs.findIndex(!read)
                    └── Priority 5: HNK → RXY → HR4 → SXY
```

---

## Summary

`bXY` is the single, unified loop driving every teammate. Its design choices:
- **Sequential while-loop**, not event-driven, for clarity of state evolution.
- **Two AbortControllers**, separating lifecycle from current-work cancellation.
- **Two AsyncLocalStorage scopes**, propagating identity for telemetry/logs.
- **Embedded auto-compaction**, keeping each teammate self-contained.
- **Per-event task mutations**, driving the TUI's team status renderer.
- **Idle gate + dedup**, avoiding leader notification spam.
- **Same code, three backends**: in-process and pane teammates run the same loop.

The runner is small enough to fit in one file (~300 lines) and concentrated enough that one read explains how a teammate behaves end-to-end.
