# Tool: TaskGet — Read a Task by ID

> **Identity:** wire-name `TaskGet`, userFacingName `TaskGet`, `isReadOnly: true`, `isConcurrencySafe: true`, `shouldDefer: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:384464-384549` (declaration), `assets/tools/TaskGet.md` (tool def).

TaskGet retrieves the full details of a single task by ID. It's the companion of TaskList (which returns summaries) — when the model needs description, blocks, and blockedBy lists for one task it commits to working on, it calls TaskGet first.

---

## Overview

The tool exists because TaskList intentionally omits expensive fields (`description`, full dependency lists) to keep the summary response compact. When the model decides to work on task #5, it calls TaskGet({taskId: "5"}) to load:

- `subject`: title
- `description`: full body
- `status`: pending / in_progress / completed
- `blocks`: list of task IDs this one blocks
- `blockedBy`: list of task IDs blocking this one

The model uses this to verify the task is actionable (`blockedBy` should be empty for available work) and to understand the full requirement before starting.

---

## Input Schema (`Ce_`)

```javascript
// ============================================
// taskGetInputSchema - Single taskId
// Location: cli_inner_pretty.js:384469 (Ce_)
// ============================================

// ORIGINAL (for source lookup):
Ce_ = yH(() => y.strictObject({ taskId: y.string().describe("The ID of the task to retrieve") }));

// READABLE (for understanding):
taskGetInputSchema = lazy(() =>
  z.strictObject({
    taskId: z.string().describe("ID of the task to retrieve"),
  }),
);

// Mapping: Ce_→taskGetInputSchema, yH→lazy, y→z
```

---

## Output Schema (`be_`)

```javascript
// ============================================
// taskGetOutputSchema - Full task details or null
// Location: cli_inner_pretty.js:384470-384483 (be_)
// ============================================

// ORIGINAL (for source lookup):
be_ = yH(() =>
  y.object({
    task: y.object({
      id: y.string(),
      subject: y.string(),
      description: y.string(),
      status: TTH(),
      blocks: y.array(y.string()),
      blockedBy: y.array(y.string()),
    }).nullable(),
  }),
);

// READABLE (for understanding):
taskGetOutputSchema = lazy(() =>
  z.object({
    task: z.object({
      id: z.string(),
      subject: z.string(),
      description: z.string(),
      status: taskStatusEnum(),
      blocks: z.array(z.string()),
      blockedBy: z.array(z.string()),
    }).nullable(),
  }),
);

// Mapping: be_→taskGetOutputSchema, TTH→taskStatusEnum
```

**Why `task` is nullable rather than throwing 404:** A task that was deleted (or never existed) is a normal state, not an exceptional one. Returning `{task: null}` lets the model handle the case without an error frame eating the context. The mapToolResultToToolResultBlockParam handler renders "Task not found" in that case.

**Why the response omits `owner` and `activeForm`:** The tool prompt frames TaskGet as a "I'm about to work on this; what's the spec" call. `owner` (who claimed it) and `activeForm` (spinner text) aren't useful for that purpose — TaskList already showed `owner`. Keeping TaskGet's response slim reduces tokens-per-call.

**Why no `metadata`:** Metadata is intentionally per-consumer. Exposing it through TaskGet would leak `_internal` markers and other system-managed keys into the model's context. Consumers who need metadata call TaskList or read the registry directly.

---

## call()

```javascript
// ============================================
// callTaskGet - Simple registry lookup with null fallthrough
// Location: cli_inner_pretty.js:384519-384535 (in Zn7.call)
// ============================================

// ORIGINAL (for source lookup):
async call({ taskId: H }) {
  let $ = tE(),
    q = await Tn($, H);
  if (!q) return { data: { task: null } };
  return {
    data: {
      task: {
        id: q.id,
        subject: q.subject,
        description: q.description,
        status: q.status,
        blocks: q.blocks,
        blockedBy: q.blockedBy,
      },
    },
  };
}

// READABLE (for understanding):
async function callTaskGet({ taskId }) {
  const registry = getTaskRegistry();
  const task = await getTask(registry, taskId);
  if (!task) return { data: { task: null } };
  return {
    data: {
      task: {
        id: task.id,
        subject: task.subject,
        description: task.description,
        status: task.status,
        blocks: task.blocks,
        blockedBy: task.blockedBy,
      },
    },
  };
}

// Mapping: H→taskId, tE→getTaskRegistry, Tn→getTask
```

A direct shape-mapping — no hooks, no permission gates, no side effects. This is the simplest tool in the task suite.

---

## mapToolResultToToolResultBlockParam

```javascript
// ============================================
// renderTaskGetResult - Human-readable task display
// Location: cli_inner_pretty.js:384536-384548
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam(H, $) {
  let { task: q } = H;
  if (!q) return { tool_use_id: $, type: "tool_result", content: "Task not found" };
  let K = [`Task #${q.id}: ${q.subject}`, `Status: ${q.status}`, `Description: ${q.description}`];
  if (q.blockedBy.length > 0) K.push(`Blocked by: ${q.blockedBy.map((_) => `#${_}`).join(", ")}`);
  if (q.blocks.length > 0) K.push(`Blocks: ${q.blocks.map((_) => `#${_}`).join(", ")}`);
  return { tool_use_id: $, type: "tool_result", content: K.join("\n") };
}

// READABLE (for understanding):
function renderTaskGetResult(data, toolUseId) {
  const { task } = data;
  if (!task) return { tool_use_id: toolUseId, type: "tool_result", content: "Task not found" };
  const lines = [
    `Task #${task.id}: ${task.subject}`,
    `Status: ${task.status}`,
    `Description: ${task.description}`,
  ];
  if (task.blockedBy.length > 0) lines.push(`Blocked by: ${task.blockedBy.map(id => `#${id}`).join(", ")}`);
  if (task.blocks.length > 0)    lines.push(`Blocks: ${task.blocks.map(id => `#${id}`).join(", ")}`);
  return { tool_use_id: toolUseId, type: "tool_result", content: lines.join("\n") };
}

// Mapping: H→data, $→toolUseId, q→task, K→lines, _→id
```

The output is plain text optimized for the model to parse. `#5` notation matches what TaskList uses, so cross-references in description text resolve naturally.

**Why conditional lines for `blockedBy` / `blocks`:** Empty dependency lists are common and useless to render. The model can infer "this task has no dependencies" from the absence of the line, which is more compact than `Blocks: (none)` or `BlockedBy: []`.

---

## Render Methods

```javascript
renderToolUseMessage() { return null; }
```

Like TaskCreate, the use message is suppressed. The actual task details appear in the response block; rendering a redundant "TaskGet(id=5)" header would be visual noise.

---

## Key Insights

- **Null is a valid result, not an error**: A model calling TaskGet for a deleted task gets `{task: null}` and "Task not found" text — not a thrown error. This is intentional: deletion happens via TaskUpdate, and the model may not have seen the deletion event.

- **Pre-update read pattern**: The TaskUpdate prompt explicitly recommends "read with TaskGet before updating to avoid stale-state issues." Concurrent agents in team mode might both try to claim the same task; reading first gives a chance to bail if someone else got there.

- **No filtering by `_internal` metadata**: Unlike TaskList (which filters `_internal: true` tasks), TaskGet returns whatever task you ask for. If a model knows an internal task's ID, it can read its details. This is by design — the `_internal` flag is for *user* visibility, not security.

- **Concurrency safety**: `isConcurrencySafe: true` lets the agent loop fan out multiple TaskGet calls in parallel (e.g., reading 5 tasks in one turn). The task registry's reads are non-locking.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.119 | TaskList sorting refactor — TaskGet IDs match TaskList ordering. |
| v2.1.121 | Output schema stabilized (was previously throwing on missing tasks; v2.1.121 added the nullable). |
| v2.1.142 | No changes. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 task tool additions

Key functions in this document:
- `taskGetInputSchema` (Ce_) - {taskId}
- `taskGetOutputSchema` (be_) - {task: {...} | null}
- `taskGetTool` (Zn7) - Tool definition
- `getTask` (Tn) - Registry lookup
- `getTaskRegistry` (tE) - Registry accessor
- `TASK_GET_TOOL_NAME` (Kg) - "TaskGet"
