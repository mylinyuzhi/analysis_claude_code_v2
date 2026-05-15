# Tool: TaskStop — Kill a Background Task

> **Identity:** wire-name `TaskStop`, userFacingName `Stop Task`, aliases `["KillShell"]`, `isConcurrencySafe: true`, `shouldDefer: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:378022-378097` (declaration), `assets/tools/TaskStop.md` (tool def).

TaskStop terminates a running background task — bash process, local agent, or remote agent. It's the abort tool for the background lifecycle.

---

## Overview

Background tasks are launched by:
- `Bash` with `run_in_background: true` → background shell process
- `Agent` with `run_in_background: true` → background local-agent subagent
- `Agent` with `isolation: "remote"` → background remote-agent on CCR
- `Monitor` tool → background event-stream watcher

All of these register with the task registry under a task ID. TaskStop is the single entry point to forcibly terminate any of them by ID.

---

## Input Schema (`Vs_`)

```javascript
// ============================================
// taskStopInputSchema - task_id or legacy shell_id
// Location: cli_inner_pretty.js:378030-378035 (Vs_)
// ============================================

// ORIGINAL (for source lookup):
Vs_ = yH(() =>
  y.strictObject({
    task_id: y.string().optional().describe("The ID of the background task to stop"),
    shell_id: y.string().optional().describe("Deprecated: use task_id instead"),
  }),
);

// READABLE (for understanding):
taskStopInputSchema = lazy(() =>
  z.strictObject({
    task_id: z.string().optional().describe("Background task ID"),
    shell_id: z.string().optional().describe("Deprecated alias for task_id"),
  }),
);

// Mapping: Vs_→taskStopInputSchema
```

**Why both `task_id` and `shell_id`:** Pre-rename (the unified `task_id` introduction in v2.1.114), the tool was named `KillShell` and took `shell_id`. Renaming to `TaskStop` made `shell_id` legacy, but resumed sessions with old tool-use blocks need to still work. Accepting both lets the call succeed regardless of which name the model picked up.

**Why both are optional in the schema, but one is required at runtime:** The `validateInput` step requires one of the two to be set. The schema-level constraint would be `z.union([{task_id}, {shell_id}])` but that's more complex than the runtime check. Keeping the schema simple makes serialization predictable.

**Why no force flag:** The stop is always force-stop (`SIGKILL` for bash, `AbortController.abort()` for agents). There's no graceful-stop variant. Rationale: if the model is calling TaskStop, it's already decided the task should die — graceful semantics would just add ambiguity.

---

## Output Schema (`vs_`)

```javascript
// ============================================
// taskStopOutputSchema - Stop confirmation
// Location: cli_inner_pretty.js:378036-378043 (vs_)
// ============================================

// ORIGINAL (for source lookup):
vs_ = yH(() => y.object({
  message: y.string().describe("Status message about the operation"),
  task_id: y.string().describe("The ID of the task that was stopped"),
  task_type: y.string().describe("The type of the task that was stopped"),
  command: y.string().optional().describe("The command or description of the stopped task"),
}));

// READABLE (for understanding):
taskStopOutputSchema = lazy(() =>
  z.object({
    message: z.string().describe("Status message"),
    task_id: z.string().describe("ID of the stopped task"),
    task_type: z.string().describe("Type of the stopped task"),
    command: z.string().optional().describe("Command or description of the stopped task"),
  }),
);

// Mapping: vs_→taskStopOutputSchema
```

The response includes `task_type` (`bash`/`local_agent`/`remote_agent`/`monitor`) and the original `command` so the model can confirm in its log "I stopped *that* task" rather than "I stopped some task."

---

## validateInput

```javascript
// ============================================
// validateTaskStop - Check task exists and is running
// Location: cli_inner_pretty.js:378063-378070 (in w38.validateInput)
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ task_id: H, shell_id: $ }, { taskRegistry: q }) {
  let K = H ?? $;
  if (!K) return { result: !1, message: "Missing required parameter: task_id", errorCode: 1 };
  let _ = q.get(K);
  if (!_) return { result: !1, message: `No task found with ID: ${K}`, errorCode: 1 };
  if (_.status !== "running") return { result: !1, message: `Task ${K} is not running (status: ${_.status})`, errorCode: 3 };
  return { result: !0 };
}

// READABLE (for understanding):
async function validateTaskStop({ task_id, shell_id }, { taskRegistry }) {
  const id = task_id ?? shell_id;
  if (!id) return { result: false, message: "Missing required parameter: task_id", errorCode: 1 };
  const task = taskRegistry.get(id);
  if (!task) return { result: false, message: `No task found with ID: ${id}`, errorCode: 1 };
  if (task.status !== "running") {
    return { result: false, message: `Task ${id} is not running (status: ${task.status})`, errorCode: 3 };
  }
  return { result: true };
}

// Mapping: H→task_id, $→shell_id, q→taskRegistry, K→id, _→task
```

Three pre-conditions checked before the call runs:
1. **Task ID present** (one of the two forms).
2. **Task exists** in the registry.
3. **Task is in `running` status** — already-completed and pending tasks are no-ops.

**Why reject already-completed tasks (errorCode 3):** Stopping a completed task would be a confusing no-op. Errorcoding it forces the model to verify state via TaskOutput or TaskList first — and the explicit error message ("status: completed") tells the model what happened.

**Why not include "stopped" as an additional terminal state:** Stopping a task transitions it to "killed" status, which is non-running. So calling TaskStop twice in a row on the same task: first call succeeds (running → killed), second call fails with errorcode 3 (status: killed, not running). This idempotency-by-error pattern is intentional.

---

## call() — Dispatch to Task-Type Handler

```javascript
// ============================================
// callTaskStop - Dispatch to type-specific stopper
// Location: cli_inner_pretty.js:378083-378096 (in w38.call)
// ============================================

// ORIGINAL (for source lookup):
async call({ task_id: H, shell_id: $ }, q) {
  let { taskRegistry: K, setAppState: _ } = q,
    A = H ?? $;
  if (!A) throw Error("Missing required parameter: task_id");
  let z = await M38(A, { taskRegistry: K, setAppState: _, callerAgentId: K38(q) });
  return {
    data: {
      message: `Successfully stopped task: ${z.taskId} (${z.command})`,
      task_id: z.taskId,
      task_type: z.taskType,
      command: z.command,
    },
  };
}

// READABLE (for understanding):
async function callTaskStop({ task_id, shell_id }, toolUseContext) {
  const { taskRegistry, setAppState } = toolUseContext;
  const id = task_id ?? shell_id;
  if (!id) throw new Error("Missing required parameter: task_id");

  const result = await stopTask(id, {
    taskRegistry,
    setAppState,
    callerAgentId: getCallerAgentId(toolUseContext),
  });

  return {
    data: {
      message: `Successfully stopped task: ${result.taskId} (${result.command})`,
      task_id: result.taskId,
      task_type: result.taskType,
      command: result.command,
    },
  };
}

// Mapping: H→task_id, $→shell_id, q→toolUseContext, K→taskRegistry, _→setAppState, A→id, z→result,
//          M38→stopTask, K38→getCallerAgentId
```

The actual stop logic is in `M38` (`stopTask`), not in the tool. The tool is a thin wrapper that:
1. Resolves the ID from either parameter name.
2. Calls the registry's dispatch handler with caller-agent identity (for analytics/audit).
3. Maps the dispatch result to the tool's output schema.

### What `stopTask` does per type

The dispatch is conceptually:

```javascript
async function stopTask(id, { taskRegistry, setAppState, callerAgentId }) {
  const task = taskRegistry.get(id);
  switch (task.type) {
    case "bash":
      // Kill the spawned shell process (SIGKILL → SIGTERM fallback)
      task.shellHandle.kill("SIGKILL");
      // Wait briefly for OS to clean up the pid
      await waitForExit(task.shellHandle.pid, 1000);
      break;

    case "local_agent":
      // Signal the agent's abort controller (cooperative cancel)
      task.abortController.abort();
      // Mark the agent's lifecycle as killed
      await killAsyncAgent(task.agentId);
      break;

    case "remote_agent":
      // POST to CCR API: /sessions/<id>/cancel
      await sendRemoteCancel(task.remoteSessionUrl);
      break;

    case "monitor":
      // Kill the watch process and close stream pipes
      task.monitorHandle.kill();
      break;
  }
  // Mark task status killed, persist in app state
  taskRegistry.update(id, t => ({ ...t, status: "killed", killedBy: callerAgentId }));
  return { taskId: id, taskType: task.type, command: task.description };
}
```

**Why cooperative cancel for local agents:** A local agent is a sub-conversation loop with its own message queue. Aborting via `AbortController` lets the agent finalize cleanly — flush pending tool calls, write its last log, mark its output file. SIGKILL would orphan the output file. The agent's loop checks `signal.aborted` between each tool call.

**Why force-kill for bash:** Bash processes don't have a cooperative cancel signal that's universally honored. Most CLI tools handle SIGTERM but some (especially those wrapping native binaries) ignore it. SIGKILL is the only guaranteed termination.

**Why POST for remote agents:** Remote agents run on a separate server (CCR). The local registry can't reach into the remote process. The cancel API marks the session as canceled server-side; the remote agent's loop detects this on its next event-stream poll and exits.

**`callerAgentId` for audit:** The registry records who killed each task. This is for two purposes:
1. **Analytics**: telemetry events `tengu_task_stopped` include the killer's agent ID.
2. **Permissions**: in team workflows, a teammate killing another teammate's task may be flagged for review.

---

## Render Methods

```javascript
renderToolUseMessage: bd7,   // Shows "Stop Task: <command snippet>"
renderToolResultMessage: xd7, // Shows confirmation with task type
```

The use-message renderer extracts the first ~80 chars of the original task's command to display ("Stop Task: npm run dev") so the user knows which task is being killed before the result lands.

---

## Key Insights

- **Status enum on the registry includes `running`, `completed`, `failed`, `killed`**: The "killed" state is distinct from "completed" (clean exit) and "failed" (exit code nonzero). Killed tasks have `killedBy` set; completed/failed do not.

- **Single dispatch entry point**: All task types route through `M38` (`stopTask`). New task types (e.g., a future "Monitor" or "Schedule" task type) only need to add a case in the switch — the tool itself is invariant.

- **Concurrency-safe but registry-serialized**: `isConcurrencySafe: true` lets the agent loop fan out parallel TaskStop calls. Each call locks the registry slot for its target task. Stopping different tasks in parallel works; stopping the same task in parallel results in the second call seeing "not running" and erroring with code 3.

- **No "stop all" variant**: The tool always targets one task. To stop multiple, the model issues parallel tool calls. Rationale: explicit > implicit, especially for destructive operations.

- **No permission gate**: TaskStop is not in `checkPermissions` and never asks for confirmation. The model started the task; the model can stop it. The user can intervene via Esc on the UI side if needed.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.114 | Renamed from `KillShell` to `TaskStop`. Added `task_id` parameter; `shell_id` becomes legacy. |
| v2.1.117 | Generalized from bash-only to all background task types via `M38` dispatch. |
| v2.1.121 | `killedBy` field added to task registry for audit. |
| v2.1.129 | Remote-agent cancel via CCR API integration. |
| v2.1.136 | `callerAgentId` propagated to analytics events. |
| v2.1.142 | No changes. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 task tool additions

Key functions in this document:
- `taskStopInputSchema` (Vs_) - {task_id?, shell_id?}
- `taskStopOutputSchema` (vs_) - {message, task_id, task_type, command?}
- `taskStopTool` (w38) - Tool definition
- `stopTask` (M38) - Type-dispatched stop handler
- `getCallerAgentId` (K38) - Audit-trail accessor
- `killAsyncAgent` (in LocalAgentTask) - Local-agent abort handler
- `TASK_STOP_TOOL_NAME` (Km) - "TaskStop"
