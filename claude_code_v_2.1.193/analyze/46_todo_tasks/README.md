# Todo / Tasks Tracking System (2.1.193 current-state)

This module documents the current 2.1.193 task-tracking implementation: legacy `TodoWrite`, the V2 `TaskCreate` / `TaskGet` / `TaskUpdate` / `TaskList` task-list tools, reminder attachments, hook integration, and the task panel UI. It is a **current-state feature analysis**, not a changelog-delta claim: the 2.1.193 bundle is the source of truth, with the named `/lyz/codespace/3rd/claude-code` tree used only as semantic cross-validation where it matches the bundle.

Authoritative target: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`.

## Executive Summary

The task-tracking system has two mutually exclusive model-facing surfaces:

- `TodoWrite` V1 is a per-session in-memory checklist stored in app state under `todos[agentIdOrSessionId]`. It is enabled only when the V2 task tools are disabled (`TodoWriteTool.isEnabled() { return !ZH(); }`, `cli_inner_pretty.js:308835`).
- `TaskCreate`, `TaskGet`, `TaskUpdate`, and `TaskList` V2 are file-backed structured task tools. They are injected into the built-in registry only when `ZH()` returns true (`cli_inner_pretty.js:444143`) and each tool also gates on `ZH()` (`TaskCreate` at `cli_inner_pretty.js:437821`, `TaskUpdate` at `cli_inner_pretty.js:438086`, `TaskList` at `cli_inner_pretty.js:438309`).
- `TaskOutput` and `TaskStop` are separate background-task lifecycle tools. They are related to task execution and agent/shell outputs, but they are not the structured task-list CRUD surface analyzed here.

The load-bearing design choice is that the V2 list is persistent and cross-process: each task is one JSON file under the Claude config home's `tasks/<sanitized-list-id>/` directory, protected by a `.lock` file and a `.highwatermark` counter (`cli_inner_pretty.js:308471-308539`). This lets multiple teammate processes share a task list, watch filesystem changes, and claim or update tasks without relying on one process's React state.

## Document Index

- [prompt_surface.md](prompt_surface.md) - Model-facing prompt contracts for `TodoWrite`, V2 CRUD tools, and `TaskOutput` boundary guidance.
- [reminders_and_attachments.md](reminders_and_attachments.md) - V1/V2 reminder routing, turn-count cadence, rendering, and ToolSearch same-turn suppression.
- [ui_and_state.md](ui_and_state.md) - V1/V2 UI design, multi-turn update flow, expanded task panel state, file-store subscription, `TaskListV2` truncation, and row rendering.
- [cross_validation_report_todo_tasks.md](cross_validation_report_todo_tasks.md) - Evidence checklist across the 2.1.193 bundle, 2.1.183 reconstruction, and named TypeScript mirror.

## Gate And Registry

### V1/V2 Mutual Exclusion

**What it does:** Chooses whether the model sees legacy `TodoWrite` or the V2 task-list tools.

**How it works:**
1. `isTodoV2Enabled` (`ZH`) reads `process.env.CLAUDE_CODE_ENABLE_TASKS` and returns false only when the env value explicitly parses as disabled (`"0"`, `"false"`, `"no"`, or `"off"` via `ul`, `cli_inner_pretty.js:1936-1944` and `cli_inner_pretty.js:308309-308312`). If the env var is unset, `ZH()` returns true, so V2 is the default.
2. The built-in tool registry appends the V2 CRUD tools only under `...(ZH() ? [Ncl, jcl, qcl, Jcl] : [])` (`cli_inner_pretty.js:444143`).
3. `TodoWrite` is still in the registry, but its own `isEnabled` returns `!ZH()` (`cli_inner_pretty.js:308835-308837`).
4. `TaskCreate`, `TaskGet`, `TaskUpdate`, and `TaskList` each independently return `ZH()` from `isEnabled` (`cli_inner_pretty.js:437821`, `cli_inner_pretty.js:437908`, `cli_inner_pretty.js:438086`, `cli_inner_pretty.js:438309`).

**Why this approach:**
- A registry-level conditional keeps V2 tools out of normal availability lists when disabled.
- A per-tool `isEnabled` guard is a second line of defense for direct tool lookup or delayed registry paths.
- Keeping `TodoWrite` as the inverse means old sessions still have a simple checklist fallback, while V2 sessions avoid presenting two competing task-management APIs.

**Key insight:** V1 and V2 are not additive. A session should expose exactly one primary task-tracking API to the model, avoiding contradictory instructions such as "replace the full todo list" vs "create/update individual task records".

## TodoWrite V1

### In-Memory Checklist Replacement

**What it does:** Replaces the current session's checklist with the full `todos` array supplied by the model.

**How it works:**
1. The input schema is strict and accepts only `{ todos }`, where each todo has `content`, `status`, and `activeForm` (`cli_inner_pretty.js:308590-308595`, `cli_inner_pretty.js:308812-308820`).
2. The prompt selector `qIa(model)` returns the short prompt for a lean/simple model predicate and the long classic prompt otherwise (`cli_inner_pretty.js:308599-308604`).
3. On call, the tool finds the state key from `context.agentId ?? sessionId` (`cli_inner_pretty.js:308846-308848`).
4. If every todo is completed, it stores an empty array instead of the completed list (`cli_inner_pretty.js:308849`).
5. It writes the new array back into app state and returns `{ oldTodos, newTodos }` (`cli_inner_pretty.js:308851-308854`).

**Why this approach:**
- Full-list replacement is simple and tolerant of reordering. The model does not need stable task IDs.
- Clearing all-completed lists keeps the spinner/panel from showing stale completed work forever.
- The trade-off is weaker concurrency and weaker collaboration: because the list lives in one process's app state, it is not a good shared work queue for teammate processes.

**Key insight:** `TodoWrite` is deliberately lightweight. It is a session-local planning display, not a durable task database.

```javascript
// ============================================
// todoWriteCall - Replace the session-local todo checklist
// Location: cli_inner_pretty.js:308842-308854
// ============================================

// ORIGINAL (for source lookup):
async call({ todos: e }, t) { let n = t.getAppState(), r = t.agentId ?? xt(), o = n.todos[r] ?? [], i = e.every((a) => a.status === "completed") ? [] : e; return (t.setAppState((a) => ({ ...a, todos: { ...a.todos, [r]: i } })), { data: { oldTodos: o, newTodos: e } }); }

// READABLE (for understanding):
async function todoWriteCall({ todos }, context) {
  const appState = context.getAppState();
  const todoKey = context.agentId ?? getSessionId();
  const oldTodos = appState.todos[todoKey] ?? [];
  const storedTodos = todos.every((todo) => todo.status === "completed") ? [] : todos;
  context.setAppState((prev) => ({ ...prev, todos: { ...prev.todos, [todoKey]: storedTodos } }));
  return { data: { oldTodos, newTodos: todos } };
}

// Mapping: tLe.call→todoWriteCall, e→todos, t→context, xt→getSessionId
```

## Task V2 Store

### File-Backed Task List

**What it does:** Persists a structured task list as one JSON file per task and exposes create/read/update/delete/dependency operations to the V2 tools and UI.

**How it works:**
1. `getTaskListId` (`vF`) chooses the list identity in this order: explicit `CLAUDE_CODE_TASK_LIST_ID`, teammate context team name, current team name, leader-created team name, then session id (`cli_inner_pretty.js:308332-308337`).
2. `sanitizePathComponent` (`$ut`) replaces any non-alphanumeric, non-underscore, non-hyphen character with `-` before constructing paths (`cli_inner_pretty.js:308339-308346`).
3. `createTask` (`GIa`) takes a task-list lock, computes `max(existing numeric id, .highwatermark) + 1`, writes `<id>.json`, emits the task-updated signal, and returns the new id (`cli_inner_pretty.js:308374-308389`).
4. `getTask` (`Ine`) reads and schema-validates a task file. Missing files return null; malformed or schema-invalid files are logged and ignored (`cli_inner_pretty.js:308391-308405`).
5. `updateTask` (`Nbe`) locks the specific task path and merges a patch onto the latest task state (`cli_inner_pretty.js:308414-308424`).
6. `deleteTask` (`yBn`) removes the JSON file, updates `.highwatermark` to avoid id reuse, then removes the deleted id from every other task's `blocks` and `blockedBy` arrays (`cli_inner_pretty.js:308426-308451`).
7. `listTasks` (`Qj`) reads all `*.json` files, schema-validates them, filters nulls, and sorts by numeric id (`cli_inner_pretty.js:308453-308464`).
8. `blockTask` (`kco`) updates both sides of a dependency edge: the blocker receives `blocks += blockedId`, and the blocked task receives `blockedBy += blockerId` (`cli_inner_pretty.js:308465-308470`).

**Why this approach:**
- Per-task JSON files make filesystem watching cheap and let external teammate processes observe changes without an IPC server.
- A high-water mark prevents id reuse after resets/deletes, so references in transcripts and teammate messages remain meaningful.
- Dependency cleanup on delete favors consistency over speed. Deleting one task can touch every other task, but task lists are small enough that correctness is more important than optimizing the scan.
- The trade-off is that atomicity is distributed: creation/list-level operations lock the list, while individual updates lock files. This is adequate for collaborative CLI sessions but not a general-purpose database.

**Key insight:** V2 tasks are a local, durable coordination protocol. The database is the directory layout plus lock/high-watermark conventions.

```javascript
// ============================================
// createTask - Allocate a durable task id and write one task JSON file
// Location: cli_inner_pretty.js:308374-308389
// ============================================

// ORIGINAL (for source lookup):
async function GIa(e, t) { let n = await Rco(e), r; try { r = await sy(n, Qjt); let o = await Myp(e), s = String(o + 1), i = { id: s, ...t }, a = Out(e, s); return (await qs().write(a, Le(i, null, 2)), Jjt(), s); } finally { if (r) await r(); } }

// READABLE (for understanding):
async function createTask(taskListId, fields) {
  const lockPath = await ensureTaskListLockFile(taskListId);
  let release;
  try {
    release = await lock(lockPath, LOCK_OPTIONS);
    const nextId = String((await getHighestAllocatedTaskId(taskListId)) + 1);
    const task = { id: nextId, ...fields };
    await fs.write(getTaskPath(taskListId, nextId), JSON.stringify(task, null, 2));
    notifyTasksUpdated();
    return nextId;
  } finally {
    if (release) await release();
  }
}

// Mapping: GIa→createTask, e→taskListId, t→fields, Rco→ensureTaskListLockFile, sy→lock, Qjt→LOCK_OPTIONS, Myp→getHighestAllocatedTaskId, Out→getTaskPath, Jjt→notifyTasksUpdated
```

## Task V2 Tools

### TaskCreate

**What it does:** Creates one pending task and optionally rolls it back if `TaskCreated` hooks block the operation.

**How it works:**
1. The schema requires `subject` and `description`, with optional `activeForm` and `metadata` (`cli_inner_pretty.js:437773-437785`).
2. `coerceTaskCreateInput` (`Lcl`) unwraps `{ task: ... }`, maps aliases (`title`/`name` to `subject`, `content` to `description`, `active_form` to `activeForm`), backfills missing subject/description, and strips foreign keys (`cli_inner_pretty.js:437657-437689`).
3. `validationErrorSteer` (`Dcl`) gives specific corrective text for batched `tasks`/`todos` calls and Agent-shaped `prompt` / `subagent_type` calls (`cli_inner_pretty.js:437691-437696`).
4. The call writes a pending task with no owner and empty dependency arrays (`cli_inner_pretty.js:437829-437838`).
5. It executes `TaskCreated` hooks via `h9t`; blocking hook feedback triggers deletion of the just-created task before throwing (`cli_inner_pretty.js:437840-437844`, hook input at `cli_inner_pretty.js:588674-588684`).
6. On success it emits `set_expanded_view: "tasks"` and returns the new id/subject (`cli_inner_pretty.js:437845`).

**Why this approach:**
- Coercion repairs common model mistakes without weakening the actual schema exposed to downstream code.
- Hook rollback is important: a blocked creation should not leave a partially accepted task in the durable list.
- The tool is not concurrency-safe (`cli_inner_pretty.js:437818-437820`) because id allocation and creation mutate shared state.

**Key insight:** `TaskCreate` is a single-record operation by design. The corrective hints explicitly reject bulk creation so each new task can be individually validated, hooked, and rolled back.

### TaskUpdate

**What it does:** Updates task fields, deletes tasks, completes tasks under hook control, merges metadata, assigns owners, and adds dependency edges.

**How it works:**
1. The schema accepts `taskId`, optional editable fields, `status`, `owner`, `metadata`, `addBlocks`, and `addBlockedBy`; `status` can also be the special action `"deleted"` (`cli_inner_pretty.js:438029-438054`).
2. `coerceInput` maps `id` / `task_id` to `taskId` and `active_form` to `activeForm` (`cli_inner_pretty.js:308275-308299`).
3. The call auto-expands the tasks panel before reading the task (`cli_inner_pretty.js:438130-438133`).
4. If the task does not exist, it returns a structured non-throwing failure (`cli_inner_pretty.js:438134`).
5. Basic fields are patched only when the provided value differs from the existing value (`cli_inner_pretty.js:438137-438142`).
6. In teammate mode, marking an unowned task `in_progress` auto-claims it for the current agent (`cli_inner_pretty.js:438143-438147`).
7. Metadata is merged key-by-key; `null` deletes a metadata key (`cli_inner_pretty.js:438148-438154`).
8. `status: "deleted"` deletes the task file and returns immediately (`cli_inner_pretty.js:438157-438168`).
9. Marking a task `completed` runs `TaskCompleted` hooks via `R9e`; blocking feedback prevents the status write and returns an error (`cli_inner_pretty.js:438171-438185`, hook input at `cli_inner_pretty.js:588686-588696`).
10. Owner changes in teammate mode write a `task_assignment` mailbox message to the assignee (`cli_inner_pretty.js:438192-438204`).
11. `addBlocks` and `addBlockedBy` call `blockTask` (`kco`) so both sides of the dependency edge are updated (`cli_inner_pretty.js:438205-438216`).
12. If a teammate completes a task, the tool-result mapper appends a prompt to call `TaskList` for newly available work (`cli_inner_pretty.js:438219-438223`).

**Why this approach:**
- Returning structured failures for missing tasks and hook-blocked completion keeps the model in the task loop instead of turning routine state conflicts into generic exceptions.
- Auto-claiming on `in_progress` aligns visual task ownership with the teammate actually doing the work.
- Metadata merge with null-delete gives plugins and internal features a low-friction extension point.
- The trade-off is complexity: `TaskUpdate` is the coordination hub, so it couples task status, hooks, mailbox assignment, dependency edges, and UI expansion.

**Key insight:** Completion is the only status transition that can be vetoed by hooks. Creation can also be blocked, but creation rolls back; completion simply refuses to apply the status patch.

### TaskGet And TaskList

**What they do:** Provide read-only task inspection: full detail for one id, or a compact list for work selection.

**How they work:**
1. `TaskGet` reads one task by id and returns null when missing (`cli_inner_pretty.js:437921-437938`).
2. `TaskGet` deliberately returns description and dependency arrays, but not owner or metadata (`cli_inner_pretty.js:437930-437937`).
3. `TaskList` filters out tasks with `metadata._internal` (`cli_inner_pretty.js:438318-438319`).
4. It computes completed task ids and removes completed blockers from each displayed `blockedBy` list (`cli_inner_pretty.js:438320-438329`).
5. Its text result is compact: `#id [status] subject`, optional owner, optional open blockers (`cli_inner_pretty.js:438342-438348`).

**Why this approach:**
- `TaskList` is optimized for choosing next work, not reading full requirements.
- Filtering completed blockers means a dependency stops visually blocking once resolved, without rewriting historical `blockedBy` arrays immediately.
- Hiding `_internal` tasks keeps implementation tasks out of the user/model-facing list while preserving them in the same store.

**Key insight:** `TaskList` is a scheduler view; `TaskGet` is the detail view. The prompt text explicitly tells the model to use both.

## Reminders

### Todo Reminder Attachment

**What it does:** Nudges the model if `TodoWrite` has not been used recently.

**How it works:**
1. `countTodoReminderTurns` (`Ouf`) walks messages backward, skipping thinking messages, and records assistant turns since the last `TodoWrite` tool use and since the last `todo_reminder` attachment (`cli_inner_pretty.js:474288-474306`).
2. `buildTodoReminderAttachments` (`Nuf`) returns no reminder if `TodoWrite` is unavailable, if the brief/send-message tool is present, if messages are empty, or if reminders are globally off (`cli_inner_pretty.js:474313-474318`).
3. Once both cadence thresholds pass, it pulls the current todo list from app state and emits a `todo_reminder` attachment (`cli_inner_pretty.js:474319-474324`).
4. The attachment renderer includes existing todo contents when non-empty (`cli_inner_pretty.js:601427-601437`).

**Why this approach:**
- The backward scan is cheap and avoids maintaining separate counters in state.
- Skipping brief/send-message sessions avoids conflicting with a workflow where a different communication channel is primary.
- Including stale contents lets the model clean up outdated todos rather than blindly adding more.

**Key insight:** The reminder does not force task tracking. Its text explicitly says to ignore it when not applicable (`cli_inner_pretty.js:601427`).

### Task Reminder Attachment

**What it does:** Nudges the model if V2 task management has not been used recently.

**How it works:**
1. `countTaskReminderTurns` (`Buf`) walks messages backward looking for `TaskCreate` or `TaskUpdate` tool uses and `task_reminder` attachments (`cli_inner_pretty.js:474335-474361`).
2. `buildTaskReminderAttachments` (`Fuf`) exits unless V2 is enabled, brief/send-message is absent, `TaskUpdate` is available, messages exist, and reminders are not off (`cli_inner_pretty.js:474368-474374`).
3. Once cadence thresholds pass, it reads the durable task list and emits a `task_reminder` attachment (`cli_inner_pretty.js:474375-474379`).
4. The renderer names `TaskCreate` and `TaskUpdate` and includes existing task summaries when present (`cli_inner_pretty.js:601441-601454`).

**Why this approach:**
- Counting only `TaskCreate` and `TaskUpdate` treats read-only inspection as insufficient task management. Looking at the list does not refresh the obligation to keep it current.
- Requiring `TaskUpdate` availability prevents a reminder that tells the model to call tools it cannot use.
- Reading the file-backed list makes the reminder reflect cross-process teammate changes.

**Key insight:** V2 reminder cadence mirrors V1, but the "last management" event changes from one replacement tool to the two mutating CRUD tools.

## UI Panel

### Expanded Tasks View

**What it does:** Shows the current task list in the expanded task panel and keeps it synchronized with file-backed V2 task state.

**How it works:**
1. `TaskCreate` and `TaskUpdate` both emit a `set_expanded_view` event for `"tasks"` on successful mutation paths (`cli_inner_pretty.js:437845`, `cli_inner_pretty.js:438130`).
2. The global keybinding handler toggles `expandedView` between `"tasks"` and `"none"` and emits telemetry `tengu_toggle_todos` (`cli_inner_pretty.js:639567`, `cli_inner_pretty.js:639717-639719`).
3. App state uses `expandedView === "tasks"` to render the task surface in multiple UI locations (`cli_inner_pretty.js:365380`, `cli_inner_pretty.js:366452`, `cli_inner_pretty.js:687701`).
4. The named-source `useTasksV2` implementation cross-validates the intended UI mechanism: a singleton store watches the current task directory, subscribes to in-process task-update signals, debounces fetches, polls while incomplete tasks exist, and hides/resets the list after all tasks remain completed for five seconds.

**Why this approach:**
- Auto-expansion makes task changes visible immediately without the model having to explain them in prose.
- A singleton watcher avoids repeated `fs.watch` churn from components that mount/unmount every turn.
- The five-second hide/reset behavior keeps completed work visible briefly, then prevents the task panel from becoming a stale archive.

**Key insight:** The V2 task panel is driven by the file store, not by tool-call output alone. The UI can reflect teammate or cross-process changes that did not originate from the current React component.

## Background Task Boundary

### TaskOutput And TaskStop

**What they do:** Manage output and cancellation for running background shell, local-agent, and remote-agent tasks.

**How they work:**
1. `TaskOutput` (`j6n`) is always enabled, read-only, deferred, and accepts `task_id`, `block`, and `timeout` (`cli_inner_pretty.js:435490-435516`).
2. Its prompt marks the tool as deprecated for many cases and directs the model to prefer `Read` on the output file path for bash/remote-agent tasks, while using the Agent tool result directly for local-agent tasks (`cli_inner_pretty.js:435517-435534`).
3. It preserves legacy aliases: `AgentOutputTool`, `BashOutputTool`, `AgentOutput`, and `BashOutput` (`cli_inner_pretty.js:435499`), matching the alias map at `cli_inner_pretty.js:56023-56026`.
4. Non-blocking mode returns `not_ready` for pending/running tasks and `success` for terminal tasks; blocking mode waits up to `timeout` and returns `timeout` or `success` (`cli_inner_pretty.js:435541-435562`).
5. `TaskStop` (`Rht`) is deferred, concurrency-safe, and accepts either `task_id` or legacy `shell_id` (`cli_inner_pretty.js:431888-431909`).
6. It validates that the task exists and is running, then calls `stopTask` (`kht`) with `killedBy: "parent"` because a model-invoked stop is Claude/the parent agent stopping the task (`cli_inner_pretty.js:431919-431950`).

**Why this approach:**
- `TaskOutput` / `TaskStop` retain compatibility with older background-task names while steering new behavior toward output files and explicit stop semantics.
- Keeping them outside the V2 CRUD gate is intentional: even when the structured task list is unavailable, background shell or agent tasks still need output retrieval and cancellation.
- The trade-off is naming overload. "Task" can mean a durable work item in `TaskCreate`/`TaskUpdate`, or a running background process in `TaskOutput`/`TaskStop`.

**Key insight:** `TaskOutput` and `TaskStop` are part of the broader task system, but not the todo/task-list state machine. They operate on runtime background-task registry entries, not the file-backed `tasks/<list-id>/<id>.json` work queue.

## Hooks

### TaskCreated And TaskCompleted Hooks

**What they do:** Let hooks validate or block task creation and task completion.

**How they work:**
1. `TaskCreated` and `TaskCompleted` are registered hook event names in 2.1.193 (`cli_inner_pretty.js:54328-54329`, `cli_inner_pretty.js:58668-58669`).
2. `executeTaskCreatedHooks` (`h9t`) builds a hook input with `task_id`, `task_subject`, `task_description`, teammate name, and team name (`cli_inner_pretty.js:588674-588684`).
3. `executeTaskCompletedHooks` (`R9e`) builds the same shape with `hook_event_name: "TaskCompleted"` (`cli_inner_pretty.js:588686-588696`).
4. Blocking feedback is rendered as `TaskCreated hook feedback:` or `TaskCompleted hook feedback:` (`cli_inner_pretty.js:589954-589960`).
5. `TaskCreate` rolls back on blocking `TaskCreated` feedback; `TaskUpdate` refuses completion on blocking `TaskCompleted` feedback.

**Why this approach:**
- Hook events are scoped to semantic task lifecycle events instead of generic tool calls. A policy can distinguish "task was created" from "some tool ran".
- Creation rollback preserves store consistency. Completion veto preserves the original task state so the model can address feedback and retry.

**Key insight:** Hooks are part of the task state machine, not just observability. They can determine whether a task exists or whether a task can be marked complete.

## Cross-Version Validation

### v2.1.183 Reconstructed Baseline

**What it does:** Provides a readable before-picture for the same V1/V2 architecture.

**How it works:**
1. `claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/TodoWriteTool.ts` reconstructs the legacy checklist and records the same inverse gate: `TodoWrite` is enabled only when task tools are disabled.
2. `claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/TaskTools.ts` reconstructs the V2 store, `TaskCreate/Get/List/Update`, hooks, dependencies, owner assignment, and panel expansion.
3. The 2.1.193 bundle line reads above match that architecture: same durable directory layout, same `TaskCreated` rollback, same `TaskCompleted` veto, same reminder split, and same read-only `TaskGet` / `TaskList` surfaces.

**Why this approach:**
- The 183 reconstruction gives semantic labels for obfuscated 193 functions without trusting old obfuscated ids.
- The trade-off is that 183 is a baseline, not the target; every claim in this module is still tied to 2.1.193 bundle lines.

**Key insight:** For todo/task tracking, 2.1.193 appears to be continuity rather than a rewrite. The feature is worth documenting because it is central to agent work tracking, not because this specific window introduced it.

### v2.1.88 Named-Source Boundary

**What it does:** Uses `/lyz/codespace/3rd/claude-code` as a semantic mirror while identifying where it cannot be imported into 2.1.193 claims.

**How it works:**
1. The named source confirms the same module split: `TodoWriteTool`, `TaskCreateTool`, `TaskGetTool`, `TaskUpdateTool`, `TaskListTool`, `utils/tasks.ts`, `utils/attachments.ts`, `useTasksV2.ts`, and `TaskListV2`.
2. It confirms the same store concepts: `getTaskListId`, `.highwatermark`, `.lock`, per-task JSON, dependency cleanup, claim semantics, and watcher-backed UI.
3. It also contains behavior absent from the 2.1.193 bundle grep, notably `verificationNudgeNeeded`, `VERIFICATION_AGENT`, and the "closed out 3+ tasks" nudge in `TodoWriteTool` / `TaskUpdateTool`. The target bundle has no `verificationNudgeNeeded` hit, while the named tree does.

**Why this approach:**
- Named TypeScript improves deobfuscation confidence for architectural intent.
- Negative grep keeps the report honest: newer or divergent named-source behavior is not attributed to 2.1.193 without target-bundle evidence.

**Key insight:** Cross-validation is bidirectional. Matching named code strengthens interpretation; mismatching named code marks a boundary, not a license to overwrite the bundle evidence.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this document:
- `isTodoV2Enabled` (`ZH`) - V2 task-tools gate via `CLAUDE_CODE_ENABLE_TASKS`.
- `TodoWriteTool` (`tLe`) - legacy per-session checklist replacement tool.
- `TaskCreateTool` (`Ncl`) - creates one pending task, rolls back on blocking `TaskCreated` hooks.
- `TaskGetTool` (`jcl`) - read-only full-detail task lookup by id.
- `TaskUpdateTool` (`qcl`) - updates fields, status, owner, metadata, deletion, and dependencies.
- `TaskListTool` (`Jcl`) - read-only compact scheduler view of non-internal tasks.
- `TaskOutputTool` (`j6n`) - reads output from runtime background tasks.
- `TaskStopTool` (`Rht`) - stops runtime background tasks with model-initiated `killedBy: "parent"` attribution.
- `getTaskListId` (`vF`) - resolves task-list identity from env/team/session context.
- `createTask` (`GIa`) - locked id allocation and per-task JSON write.
- `getTask` (`Ine`) - schema-validated task read.
- `updateTask` (`Nbe`) - locked task patch write.
- `deleteTask` (`yBn`) - deletes a task and cleans reverse dependency references.
- `listTasks` (`Qj`) - schema-validates and numerically sorts task files.
- `blockTask` (`kco`) - writes both sides of a dependency edge.
- `buildTodoReminderAttachments` (`Nuf`) - emits stale `TodoWrite` reminders.
- `buildTaskReminderAttachments` (`Fuf`) - emits stale V2 task-management reminders.
- `executeTaskCreatedHooks` (`h9t`) - runs `TaskCreated` hooks with task metadata.
- `executeTaskCompletedHooks` (`R9e`) - runs `TaskCompleted` hooks with task metadata.
- `toggleTodosPanel` (`gQf`) - toggles `expandedView` between `"tasks"` and `"none"`.
