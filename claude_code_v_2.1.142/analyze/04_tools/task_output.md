# Tool: TaskOutput — Read Output from a Background Task (Deprecated)

> **Identity:** wire-name `TaskOutput`, userFacingName `Task Output`, `isReadOnly: true`, aliases `["AgentOutputTool", "BashOutputTool"]`, `shouldDefer: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:380944-381114` (declaration), `assets/tools/TaskOutput.md` (tool def).

TaskOutput retrieves stdout/stderr or agent results from a running or completed background task. **As of v2.1.x, this tool is marked deprecated** — the model is redirected to use Read on the output file path (returned in the original launch's tool result) or to use the Agent tool result directly.

---

## Overview

When a Bash command launches with `run_in_background`, a Local Agent runs with `run_in_background: true`, or a remote agent runs via `isolation: "remote"`, the launching tool returns immediately with:
- `task_id`: registry handle for the background task
- `outputFile`: filesystem path where stdout/stderr (or agent transcript) is being streamed

The pre-deprecation flow was: model calls TaskOutput with the `task_id` to fetch output, blocking until completion. The tool would wait up to `timeout` ms for the task to finish, then return.

The current flow is: model uses Read on `outputFile` directly. The system sends a `<task-notification>` push to the conversation when the task completes; the model doesn't poll.

Why TaskOutput still exists: backward compatibility with older sessions, with prompts that taught the polling pattern, and with model behavior that defaults to polling. Removing it would break resumed sessions and require model retraining. So the tool stays but is wrapped in a deprecation warning.

---

## Input Schema (`It_`)

```javascript
// ============================================
// taskOutputInputSchema - task_id with blocking timeout
// Location: cli_inner_pretty.js:380966-380972 (It_)
// ============================================

// ORIGINAL (for source lookup):
It_ = yH(() =>
  y.strictObject({
    task_id: y.string().describe("The task ID to get output from"),
    block: P2(y.boolean().default(!0)).describe("Whether to wait for completion"),
    timeout: y.number().min(0).max(600000).default(30000).describe("Max wait time in ms"),
  }),
);

// READABLE (for understanding):
taskOutputInputSchema = lazy(() =>
  z.strictObject({
    task_id: z.string().describe("Background task ID"),
    block: preprocessBoolean(z.boolean().default(true)).describe("Wait for completion"),
    timeout: z.number().min(0).max(600_000).default(30_000).describe("Max wait time (ms)"),
  }),
);

// Mapping: It_→taskOutputInputSchema, P2→preprocessBoolean
```

**Why `P2(z.boolean())` rather than `z.boolean()`:** `P2` is a preprocessor that accepts string `"true"`/`"false"` and number `1`/`0` and coerces them to booleans. Models sometimes pass `"true"` (a string) instead of `true` (a boolean). The preprocessor makes the schema forgiving.

**Why 600_000 ms (10 min) max timeout:** Some background tasks are long-running (a large code review subagent might take 5-10 min). Capping at 10 min prevents pathological "wait forever" calls. 30s default is a reasonable poll interval.

---

## Description Field (Deprecated Marker)

```javascript
description: "[Deprecated] — for bash and remote_agent tasks, prefer Read on the output file path; for local_agent tasks, use the Agent tool result directly"
```

The description starts with `[Deprecated]` — visible to the model in its tool list. This is the explicit signal: "this tool exists but you should not use it for new code."

**Why a runtime deprecation rather than hard-removing:**

- **Resumed sessions**: A session created in an older version may have tool calls in its transcript referencing TaskOutput. Removing the tool would invalidate those calls.
- **Behavior cache**: The model's tool-use cache is built around the tool description. Suddenly removing a tool the model has been calling for years would cause errors in active sessions until the cache invalidated.
- **Migration window**: The new pattern (Read on outputFile + task-notification push) requires the model to have been trained on it. Older models still default to polling — making the wrong call should still produce useful output, just with a warning.

---

## Prompt — Migration Instructions

```
DEPRECATED: Background tasks return their output file path in the tool result, and you receive a <task-notification> with the same path when the task completes.
- For bash tasks: prefer using the Read tool on that output file path — it contains stdout/stderr.
- For local_agent tasks: use the Agent tool result directly. Do NOT Read the .output file — it is a symlink to the full sub-agent conversation transcript (JSONL) and will overflow your context window.
- For remote_agent tasks: prefer using the Read tool on the output file path — it contains the streamed remote session output (same as bash).
```

Three different recommendations for three different task types:

1. **Bash**: Read the output file. It's stdout/stderr concatenated, normal text.
2. **Local agent**: Use the Agent's *tool result* (already in transcript when async_launched returned). The `.output` file is a JSONL transcript that would blow up the model's context.
3. **Remote agent**: Read the output file. Remote agents stream their conversational output to a regular text file similar to bash.

**Key insight on local agents:** When a `run_in_background: true` agent finishes, the parent gets a `<task-notification>` with the final assistant message. The model already has the result via the notification — it should not read the .output file at all. The TaskOutput tool's blocking call would still return the result, but it would also pull in the JSONL transcript bloat.

---

## validateInput

```javascript
// ============================================
// validateTaskOutput - Task existence check
// Location: cli_inner_pretty.js:381014-381018 (in R38.validateInput)
// ============================================

// ORIGINAL (for source lookup):
async validateInput({ task_id: H }, { getAppState: $ }) {
  if (!H) return { result: !1, message: "Task ID is required", errorCode: 1 };
  if (!$().tasks?.[H]) return { result: !1, message: `No task found with ID: ${H}`, errorCode: 2 };
  return { result: !0 };
}

// READABLE (for understanding):
async function validateTaskOutput({ task_id }, { getAppState }) {
  if (!task_id) return { result: false, message: "Task ID is required", errorCode: 1 };
  if (!getAppState().tasks?.[task_id]) {
    return { result: false, message: `No task found with ID: ${task_id}`, errorCode: 2 };
  }
  return { result: true };
}

// Mapping: H→task_id, $→getAppState
```

Two checks: task_id provided, task exists in app state. App state's `tasks` map tracks all background tasks ever launched in this session.

---

## call() — Polling Loop with Timeout

```javascript
// ============================================
// callTaskOutput - Blocking or non-blocking retrieval
// Location: cli_inner_pretty.js:381019-381045 (in R38.call)
// ============================================

// ORIGINAL (for source lookup):
async call(H, $, q, K, _) {
  let { task_id: A, block: z, timeout: Y } = H,
    O = $.getAppState().tasks?.[A];
  if (!O) throw Error(`No task found with ID: ${A}`);
  if (!z) {
    if (O.status !== "running" && O.status !== "pending")
      return ($.taskRegistry.update(A, (w) => ({ ...w, notified: !0 })), { data: { retrieval_status: "success", task: await S38(O) } });
    return { data: { retrieval_status: "not_ready", task: await S38(O) } };
  }
  if (_) _({ type: "progress", toolUseID: `task-output-waiting-${Date.now()}`, data: { type: "waiting_for_task", taskDescription: O.description, taskType: O.type } });
  let M = await St_(A, $.getAppState, Y, $.abortController);
  if (!M) return { data: { retrieval_status: "timeout", task: null } };
  if (M.status === "running" || M.status === "pending")
    return { data: { retrieval_status: "timeout", task: await S38(M) } };
  return ($.taskRegistry.update(A, (w) => ({ ...w, notified: !0 })), { data: { retrieval_status: "success", task: await S38(M) } });
}

// READABLE (for understanding):
async function callTaskOutput({ task_id, block, timeout }, toolUseContext, _, _msg, onProgress) {
  const task = toolUseContext.getAppState().tasks?.[task_id];
  if (!task) throw new Error(`No task found with ID: ${task_id}`);

  // Non-blocking branch: snapshot current state
  if (!block) {
    if (task.status !== "running" && task.status !== "pending") {
      // Mark notified so the system stops queueing notifications
      toolUseContext.taskRegistry.update(task_id, t => ({ ...t, notified: true }));
      return { data: { retrieval_status: "success", task: await formatTaskForOutput(task) } };
    }
    return { data: { retrieval_status: "not_ready", task: await formatTaskForOutput(task) } };
  }

  // Blocking branch: emit progress event, wait
  if (onProgress) {
    onProgress({
      type: "progress",
      toolUseID: `task-output-waiting-${Date.now()}`,
      data: { type: "waiting_for_task", taskDescription: task.description, taskType: task.type },
    });
  }

  // Wait up to `timeout` ms for task to leave running/pending state
  const finalState = await waitForTaskCompletion(task_id, toolUseContext.getAppState, timeout, toolUseContext.abortController);
  if (!finalState) {
    return { data: { retrieval_status: "timeout", task: null } };
  }
  if (finalState.status === "running" || finalState.status === "pending") {
    return { data: { retrieval_status: "timeout", task: await formatTaskForOutput(finalState) } };
  }

  // Task completed — mark notified, return result
  toolUseContext.taskRegistry.update(task_id, t => ({ ...t, notified: true }));
  return { data: { retrieval_status: "success", task: await formatTaskForOutput(finalState) } };
}

// Mapping: H→params, $→toolUseContext, _→onProgress, A→task_id, z→block, Y→timeout, O→task, M→finalState,
//          St_→waitForTaskCompletion, S38→formatTaskForOutput
```

### Retrieval Status Values

| Status | Meaning |
|--------|---------|
| `success` | Task is done (completed, failed, killed). Output included. |
| `not_ready` | Non-blocking call and task is still running/pending. No output (yet). |
| `timeout` | Blocking call and task did not finish within `timeout` ms. Last-known output included. |

### The Notified Flag

When TaskOutput successfully retrieves a completed task's output, it sets `task.notified = true` in the registry. This stops the task-notification queue from re-injecting a notification for this task into the conversation.

**Why this matters:** Without the notified flag, a completed background task would (a) appear in the `<task-notification>` push *and* (b) be re-fetched via TaskOutput. The model would see "task complete" twice — once from the notification, once from the tool result. The notified flag suppresses the push.

This is also why the non-blocking branch marks notified only when the task has actually completed (not while still running) — a notification later is still useful.

---

## mapToolResultToToolResultBlockParam

The result is rendered with XML-ish tags for easy parsing:

```
<retrieval_status>success</retrieval_status>
<task_id>abc123</task_id>
<task_type>bash</task_type>
<status>completed</status>
<exit_code>0</exit_code>
<output>
... stdout/stderr ...
</output>
```

Or for errors:
```
<retrieval_status>timeout</retrieval_status>
<task_id>abc123</task_id>
<task_type>local_agent</task_type>
<status>running</status>
<output>
... partial output so far ...
</output>
```

The XML tags are model-friendly: the model can extract `<status>` and `<exit_code>` regardless of the format of the wrapped output.

**The output truncation:** `mc7(H.task.output, H.task.task_id)` is the output-truncator. If the captured output exceeds the per-tool truncation budget, it's summarized + truncated with a clear marker. The truncated content is still on disk at the original outputFile path; the model can Read it directly to bypass truncation.

---

## Render Methods

```javascript
renderToolUseMessage(H) {
  let { block: $ = !0 } = H;
  if (!$) return "non-blocking";
  return "";
}
```

If `block: false`, the tool-use header reads "non-blocking" — a visual cue that this is a status check rather than a wait. Otherwise blank (the result block shows the task details).

`renderToolUseProgressMessage` shows the spinner with "Waiting for task" + an escape-key hint:
> Waiting for task (esc to give additional instructions)

This is functional UI — the user can intervene while waiting (e.g., "actually cancel that").

---

## Key Insights

- **Deprecation is by description, not by enable gate**: The tool's `isEnabled()` returns true; only the description starts with `[Deprecated]`. The model is *discouraged* from calling it, not blocked.

- **Output file is the source of truth**: Both the deprecated TaskOutput and the new Read-on-outputFile path read from the same file. They differ only in API ergonomics — TaskOutput returns wrapped task metadata, Read returns raw text.

- **Local-agent JSONL bloat**: Local agent tasks have `.output` files that are JSONL transcripts of the entire sub-agent conversation. A typical run is 50-200KB. Reading this into context would balloon the parent's token usage. The Agent tool's `async_launched` return value already includes the final result in the parent's transcript — that's the source of truth for local agents.

- **`notified` race**: A task can complete between TaskOutput's "get current state" and the registry's notification queue's "push notification" loop. The notified flag is the deduplication mechanism — whoever flips it first wins.

- **abortController cancels the wait**: If the parent is canceled mid-wait (user Esc, session shutdown), the wait promise rejects via `AbortController`. The tool returns `retrieval_status: "timeout"` with the last-known state.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.114 | Renamed from `AgentOutputTool`/`BashOutputTool` to `TaskOutput` (the aliases remain for backward compat). |
| v2.1.116 | Description tagged `[Deprecated]`. |
| v2.1.119 | New `<task-notification>` push system added. |
| v2.1.121 | `notified` flag added to dedupe push-vs-tool-result. |
| v2.1.129 | Local-agent JSONL `.output` warning added to prompt. |
| v2.1.142 | No changes. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 task tool additions

Key functions in this document:
- `taskOutputInputSchema` (It_) - {task_id, block, timeout}
- `taskOutputTool` (R38) - Tool definition
- `waitForTaskCompletion` (St_) - Polling wait with timeout
- `formatTaskForOutput` (S38) - Task → output shape projection
- `truncateOutput` (mc7) - Output truncator
- `TASK_OUTPUT_TOOL_NAME` ($n) - "TaskOutput"
