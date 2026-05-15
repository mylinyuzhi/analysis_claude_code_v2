# Tool: TaskCreate — Add Task to Task List

> **Identity:** wire-name `TaskCreate`, userFacingName `TaskCreate`, `isConcurrencySafe: true`, `shouldDefer: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:384359-384440` (declaration), `assets/tools/TaskCreate.md` (tool def).

TaskCreate adds a new task to the session's task list. Tasks are persistent (within the session) work items with dependencies (`blocks`/`blockedBy`), ownership (for team workflows), and status progression (`pending` → `in_progress` → `completed`).

This is the entry point of a four-tool suite: TaskCreate / TaskGet / TaskList / TaskUpdate. See those docs for the other operations.

---

## Overview

The task list is Claude Code's structured to-do tracking. It supports:

- **Simple tracking**: model creates tasks proactively for multi-step work and marks them done as work progresses. UI shows a checklist.
- **Team workflows**: when `enableAgentSwarms()` is true, tasks have `owner` (an agent name) and can be claimed/assigned across teammates.
- **Dependencies**: TaskUpdate's `addBlocks`/`addBlockedBy` arrays let one task gate another.

TaskCreate only creates pending tasks with no owner and no blocks. Dependencies, owner assignment, and status changes happen through TaskUpdate.

---

## Input Schema (`Se_`)

```javascript
// ============================================
// taskCreateInputSchema - Fields for new task
// Location: cli_inner_pretty.js:384367-384377 (Se_)
// ============================================

// ORIGINAL (for source lookup):
Se_ = yH(() =>
  y.strictObject({
    subject: y.string().describe("A brief title for the task"),
    description: y.string().describe("What needs to be done"),
    activeForm: y.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
    metadata: y.record(y.string(), y.unknown()).optional().describe("Arbitrary metadata to attach to the task"),
  }),
);

// READABLE (for understanding):
taskCreateInputSchema = lazy(() =>
  z.strictObject({
    subject: z.string().describe("Brief task title (imperative form)"),
    description: z.string().describe("What needs to be done"),
    activeForm: z.string().optional().describe("Present continuous form for the in_progress spinner"),
    metadata: z.record(z.string(), z.unknown()).optional().describe("Arbitrary metadata bag"),
  }),
);

// Mapping: Se_→taskCreateInputSchema, yH→lazy, y→z, strictObject→strictObject
```

**Why `strictObject` vs `object`:** strictObject rejects unknown keys. If the model accidentally invents a field like `priority` or `status`, the call fails validation rather than silently dropping the extra field. This is defensive: a model might think it can set `status: "in_progress"` on creation, and the strict mode tells it "no, use TaskUpdate."

**Why a separate `activeForm` field:** When a task transitions to `in_progress`, the UI shows a spinner with descriptive text. The `subject` is imperative ("Fix the auth bug") which reads awkwardly as a spinner label. The `activeForm` is present-continuous ("Fixing the auth bug") for grammatical fit. If omitted, the spinner falls back to `subject` (slightly awkward but functional).

**Why `metadata: Record<string, unknown>`:** Tasks can carry arbitrary data for downstream consumers — a remote-trigger system might tag tasks with a Jira ticket ID, a custom UI might tag with a priority level. Internal tasks set `_internal: true` to filter from user-facing TaskList output. The metadata bag is intentionally untyped at the schema level.

---

## Output Schema (`Re_`)

```javascript
// ============================================
// taskCreateOutputSchema - {task: {id, subject}}
// Location: cli_inner_pretty.js:384378 (Re_)
// ============================================

// ORIGINAL (for source lookup):
Re_ = yH(() => y.object({ task: y.object({ id: y.string(), subject: y.string() }) }));

// READABLE (for understanding):
taskCreateOutputSchema = lazy(() =>
  z.object({
    task: z.object({
      id: z.string(),
      subject: z.string(),
    }),
  }),
);

// Mapping: Re_→taskCreateOutputSchema
```

Only `id` and `subject` are returned — the model can call TaskGet for full details if needed. Returning the minimal slice keeps the parent's context lean.

---

## call() — Task Insertion + Validation

```javascript
// ============================================
// callTaskCreate - Persist task and run subject-validation iterator
// Location: cli_inner_pretty.js:384411-384434 (in Xn7.call)
// ============================================

// ORIGINAL (for source lookup):
async call({ subject: H, description: $, activeForm: q, metadata: K }, _, A, z, Y) {
  let f = await T67(tE(), {
      subject: H,
      description: $,
      activeForm: q,
      status: "pending",
      owner: void 0,
      blocks: [],
      blockedBy: [],
      metadata: K,
    }),
    O = [],
    M = jL$(f, H, $, vA(), q5(), void 0, _?.abortController?.signal, void 0, _);
  for await (let w of M) if (w.blockingError) O.push(jE6(w.blockingError));
  if (O.length > 0)
    throw (await a88(tE(), f), Error(O.join("\n")));
  return (Y?.({ type: "set_expanded_view", expandedView: "tasks" }), { data: { task: { id: f, subject: H } } });
}

// READABLE (for understanding):
async function callTaskCreate({ subject, description, activeForm, metadata }, toolUseContext, _, _msg, onProgress) {
  // Step 1: Insert task with defaults (status=pending, no owner, no deps)
  const taskId = await persistNewTask(getTaskRegistry(), {
    subject,
    description,
    activeForm,
    status: "pending",
    owner: undefined,
    blocks: [],
    blockedBy: [],
    metadata,
  });

  // Step 2: Run iterator over task validators (hooks may reject the subject/description)
  const blockingErrors = [];
  const validatorIterator = runTaskCreateHooks(
    taskId,
    subject,
    description,
    getMyAgentName(),
    getSessionId(),
    /* parentTaskId */ undefined,
    toolUseContext?.abortController?.signal,
    /* extraContext */ undefined,
    toolUseContext,
  );
  for await (const event of validatorIterator) {
    if (event.blockingError) {
      blockingErrors.push(formatBlockingError(event.blockingError));
    }
  }

  // Step 3: If any validator rejected, delete the task and throw
  if (blockingErrors.length > 0) {
    await deleteTask(getTaskRegistry(), taskId);
    throw new Error(blockingErrors.join("\n"));
  }

  // Step 4: Auto-expand the tasks panel in the UI
  onProgress?.({ type: "set_expanded_view", expandedView: "tasks" });

  return { data: { task: { id: taskId, subject } } };
}

// Mapping: H→subject, $→description, q→activeForm, K→metadata, _→toolUseContext, Y→onProgress,
//          tE→getTaskRegistry, T67→persistNewTask, jL$→runTaskCreateHooks, jE6→formatBlockingError,
//          vA→getMyAgentName, q5→getSessionId, a88→deleteTask, f→taskId
```

**Why hook validators run after insert, not before:** The hook system uses an async generator pattern. It needs the task ID to address its outputs. Inserting first and rolling back on rejection is a common pattern for systems where hooks may have side effects (e.g., a hook that posts to Slack and is now expected to also receive the task ID).

**Why blocking errors join with newlines:** Multiple hooks can each contribute a rejection reason. Joining with `\n` gives the model a multi-line error string that's easy to read in the tool-result block.

**Auto-expand the tasks panel:** The progress event `{ type: "set_expanded_view", expandedView: "tasks" }` tells the UI to expand the task list panel (if it's collapsed) so the user sees the new task. This is purely UI feedback — it doesn't affect tool semantics.

---

## isEnabled / shouldDefer

```javascript
isEnabled() { return nw(); }   // Task tools are gated by `enableTaskList` setting
shouldDefer: !0                // Task tools are lazy-loaded
```

`nw()` checks the user's `enableTaskList` setting (defaults true). When disabled, the four task tools (TaskCreate/Get/List/Update) all disappear from the tool pool.

`shouldDefer: true` means these tools don't appear in the always-on schema list. The model has to invoke `ToolSearch` to discover them. This is a token-saving optimization — many sessions don't use the task list at all.

---

## Render Methods

```javascript
renderToolUseMessage() { return null; }  // No header rendering — task list panel shows the task instead
```

The tool deliberately returns `null` from `renderToolUseMessage`. The created task appears immediately in the task list panel; rendering "TaskCreate(subject)" inline above the panel would be redundant.

---

## mapToolResultToToolResultBlockParam

```javascript
// Returns: `Task #${id} created successfully: ${subject}`
```

A short confirmation message goes into the model's context. The model uses this to verify the create succeeded and to remember the new task's ID for follow-up TaskUpdate calls.

---

## Key Insights

- **Task IDs are strings, not numbers**: The task registry assigns string IDs (typically sequential: "1", "2", "3", ...). They're returned as strings to allow future extensibility (UUIDs, prefixed IDs for plugin tasks, etc.).

- **`_internal` metadata filters from TaskList**: Tasks created with `metadata: { _internal: true }` are filtered out of the user-visible TaskList. This is for system-managed tasks (e.g., background sync jobs).

- **Hooks can reject tasks**: The `TaskCreate` hook (`PreToolUse` matcher: `TaskCreate`) can run validators that reject malformed tasks. A common use case: "all tasks must reference a Jira ticket ID in description" — the hook regex-checks and rejects.

- **No bulk create**: Each task is a separate call. The model can make multiple TaskCreate calls in one message (parallel tool calls), but there's no `createMany` variant. Rationale: each task gets its own hook validation pass.

- **Strict schema prevents `status` on creation**: The `strictObject` blocks `status: "in_progress"` at creation time. To start a task in progress, create then TaskUpdate. This forces the workflow "create → list → update" rather than "create-and-claim atomically", which is intentional for team workflows where claiming should be visible.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.114 | `metadata` field added — initially for `_internal` filtering, later extended to arbitrary data. |
| v2.1.118 | `activeForm` field added — separates spinner text from imperative subject. |
| v2.1.119 | TaskList sorts by ID — TaskCreate's sequential numbering aligns with this. |
| v2.1.121 | Hook validators run via async generator — supports streaming hook output. |
| v2.1.142 | Schema stable; backing task registry got minor performance fixes. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 task tool additions

Key functions in this document:
- `taskCreateInputSchema` (Se_) - {subject, description, activeForm?, metadata?}
- `taskCreateOutputSchema` (Re_) - {task: {id, subject}}
- `taskCreateTool` (Xn7) - Tool definition
- `persistNewTask` (T67) - Task registry insertion
- `runTaskCreateHooks` (jL$) - Hook validator iterator
- `getTaskRegistry` (tE) - Task store accessor
- `deleteTask` (a88) - Rollback on hook rejection
- `formatBlockingError` (jE6) - Hook error formatter
- `TASK_CREATE_TOOL_NAME` (OX) - "TaskCreate"
- `isTaskListEnabled` (nw) - Feature gate
