# Tool: TaskList — Enumerate Tasks

> **Identity:** wire-name `TaskList`, userFacingName `TaskList`, `isReadOnly: true`, `isConcurrencySafe: true`, `shouldDefer: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:384862-384946` (declaration), `assets/tools/TaskList.md` (tool def).

TaskList returns a summary of all tasks in the session. It's the discovery tool — the model calls it to see what work is available, which tasks are blocked, and what to claim next.

---

## Overview

The summary returned by TaskList is intentionally compact:

- `id`: task identifier
- `subject`: brief title (no description)
- `status`: pending / in_progress / completed
- `owner`: optional assigned agent name
- `blockedBy`: list of *open* task IDs blocking this one (completed blockers are filtered out)

To get a full task (description, both directions of dependencies), the model calls TaskGet with the ID. This two-tool split keeps the list response slim — a session with 20 tasks would otherwise dump kilobytes of description text just to answer "what's next?"

---

## Input Schema (`me_`)

```javascript
// ============================================
// taskListInputSchema - No parameters
// Location: cli_inner_pretty.js:384868 (me_)
// ============================================

// ORIGINAL (for source lookup):
me_ = yH(() => y.strictObject({}));

// READABLE (for understanding):
taskListInputSchema = lazy(() => z.strictObject({}));

// Mapping: me_→taskListInputSchema
```

No parameters. The tool returns the full task list — no pagination, no filtering. Filtering by status/owner is the model's responsibility on the response.

**Why no filter parameters:** With `maxResultSizeChars: 100_000`, a list with hundreds of tasks would still fit. The model can grep the list textually if needed. Adding filter parameters would (a) increase schema size, (b) tempt the model to over-filter and miss work, and (c) duplicate functionality of TaskGet for single-task queries.

---

## Output Schema (`Be_`)

```javascript
// ============================================
// taskListOutputSchema - Array of summaries
// Location: cli_inner_pretty.js:384869-384881 (Be_)
// ============================================

// ORIGINAL (for source lookup):
Be_ = yH(() =>
  y.object({
    tasks: y.array(
      y.object({
        id: y.string(),
        subject: y.string(),
        status: TTH(),
        owner: y.string().optional(),
        blockedBy: y.array(y.string()),
      }),
    ),
  }),
);

// READABLE (for understanding):
taskListOutputSchema = lazy(() =>
  z.object({
    tasks: z.array(z.object({
      id: z.string(),
      subject: z.string(),
      status: taskStatusEnum(),
      owner: z.string().optional(),
      blockedBy: z.array(z.string()),
    })),
  }),
);
```

The schema mirrors TaskGet but omits `description` and `blocks` (the heavy fields). The model uses this list as a directory; for details it goes through TaskGet.

---

## call() — Filter and Project

```javascript
// ============================================
// callTaskList - Enumerate tasks with _internal filter and completed-blocker projection
// Location: cli_inner_pretty.js:384914-384929 (in hn7.call)
// ============================================

// ORIGINAL (for source lookup):
async call() {
  let H = tE(),
    $ = (await Ik(H)).filter((_) => !_.metadata?._internal),
    q = new Set($.filter((_) => _.status === "completed").map((_) => _.id));
  return {
    data: {
      tasks: $.map((_) => ({
        id: _.id,
        subject: _.subject,
        status: _.status,
        owner: _.owner,
        blockedBy: _.blockedBy.filter((A) => !q.has(A)),
      })),
    },
  };
}

// READABLE (for understanding):
async function callTaskList() {
  const registry = getTaskRegistry();

  // Step 1: Pull all tasks, drop _internal-tagged ones
  const visibleTasks = (await listAllTasks(registry)).filter(task => !task.metadata?._internal);

  // Step 2: Build a set of completed task IDs — these are excluded from blockedBy lists
  const completedIds = new Set(
    visibleTasks.filter(task => task.status === "completed").map(task => task.id)
  );

  // Step 3: Project each task to the summary shape, filtering blockedBy to open dependencies only
  return {
    data: {
      tasks: visibleTasks.map(task => ({
        id: task.id,
        subject: task.subject,
        status: task.status,
        owner: task.owner,
        blockedBy: task.blockedBy.filter(blockerId => !completedIds.has(blockerId)),
      })),
    },
  };
}

// Mapping: H→registry, $→visibleTasks, q→completedIds, _→task, A→blockerId,
//          tE→getTaskRegistry, Ik→listAllTasks
```

### The Two Filters

**Filter 1: `_internal` metadata.** System-managed tasks (auto-created by hooks, plugins, or framework internals) carry `metadata: { _internal: true }`. These are not shown to the model because they're not work the model should pick up — they're bookkeeping.

**Filter 2: Completed blockers projected away from `blockedBy`.** This is the cleverer one:

- A task `5` has `blockedBy: ["2", "3"]` stored in the registry.
- Task `2` is in `completed` status; task `3` is still pending.
- TaskList returns `blockedBy: ["3"]` for task 5 — the completed blocker is filtered out.

**Why:** The model's decision algorithm is "find tasks with empty blockedBy and no owner." If the registry stored `["2", "3"]` literally, the model would see task 5 as blocked even though `2` is done. Projecting completed blockers away means "blockedBy = currently-blocked-by" rather than "blockedBy = ever-was-blocked-by." This makes the response self-explanatory.

**Key insight:** The original `blocks` and `blockedBy` arrays are not mutated when a task completes. The filtering is at *read* time, not *write* time. Two reasons:
1. **Auditability**: the registry remembers the original dependency graph. If you re-open task 2, task 5 becomes blocked again automatically.
2. **Cheaper writes**: status updates don't have to scan the whole graph to maintain transitively-blocked lists.

---

## v2.1.119 Sort-by-ID

Pre-v2.1.119, TaskList returned tasks in insertion order (the order they were inserted into the registry's array). This worked for solo use but broke down in team workflows:

- Lead creates tasks 1, 2, 3, 4, 5.
- Teammate A claims task 3 (sets owner, in_progress).
- Teammate B asks for available work. The list returns: 1, 2, 3, 4, 5 — but 3 is no longer at "position 3" semantically (it's in progress). Visual order conflicts with status order.

v2.1.119 added a sort: tasks ordered by numeric task ID. The fix is implemented in the registry layer, not the tool layer — `Ik(registry)` (listAllTasks) returns sorted entries. The TaskList tool itself just projects.

**Why by ID, not by status:** Sorting by status would cluster all `pending` at the top, all `completed` at the bottom. But the model needs to find work *within* the pending cluster, and ID order gives a deterministic "earliest task first" preference. The prompt explicitly tells the model: *"Prefer working on tasks in ID order (lowest ID first) when multiple tasks are available, as earlier tasks often set up context for later ones."*

**Why numeric vs lexicographic:** Task IDs are typically `"1"`, `"2"`, ..., `"10"`, `"11"`. Lexicographic sort would order `"10"` before `"2"`. Numeric parse + compare is the right semantic. The registry's `listAllTasks` does numeric parsing internally; non-numeric IDs (future plugin tasks) fall back to lexicographic at the end.

---

## mapToolResultToToolResultBlockParam

```javascript
// ============================================
// renderTaskListResult - Markdown-ish task line per row
// Location: cli_inner_pretty.js:384930-384944
// ============================================

// ORIGINAL (for source lookup):
mapToolResultToToolResultBlockParam(H, $) {
  let { tasks: q } = H;
  if (q.length === 0) return { tool_use_id: $, type: "tool_result", content: "No tasks found" };
  let K = q.map((_) => {
    let A = _.owner ? ` (${_.owner})` : "",
      z = _.blockedBy.length > 0 ? ` [blocked by ${_.blockedBy.map((Y) => `#${Y}`).join(", ")}]` : "";
    return `#${_.id} [${_.status}] ${_.subject}${A}${z}`;
  });
  return { tool_use_id: $, type: "tool_result", content: K.join("\n") };
}

// READABLE (for understanding):
function renderTaskListResult(data, toolUseId) {
  const { tasks } = data;
  if (tasks.length === 0) {
    return { tool_use_id: toolUseId, type: "tool_result", content: "No tasks found" };
  }
  const lines = tasks.map(task => {
    const ownerSuffix = task.owner ? ` (${task.owner})` : "";
    const blockedSuffix = task.blockedBy.length > 0
      ? ` [blocked by ${task.blockedBy.map(id => `#${id}`).join(", ")}]`
      : "";
    return `#${task.id} [${task.status}] ${task.subject}${ownerSuffix}${blockedSuffix}`;
  });
  return { tool_use_id: toolUseId, type: "tool_result", content: lines.join("\n") };
}

// Mapping: H→data, $→toolUseId, q→tasks, _→task, A→ownerSuffix, z→blockedSuffix, Y→id
```

Sample output:
```
#1 [completed] Set up project skeleton
#2 [in_progress] Implement authentication (alice)
#3 [pending] Add login UI (bob) [blocked by #2]
#4 [pending] Write integration tests
```

**Why this format vs JSON:** The model parses this as well as it parses JSON, and the human-readable form takes ~50% fewer tokens for a typical task list. The brackets/parens/hashes are minimal syntax for the structure.

---

## Render Methods

```javascript
renderToolUseMessage() { return null; }
```

Like the other task tools, no use-message rendering. The task panel in the UI already shows the same data live — duplicating it as a tool-use header would be redundant.

---

## Key Insights

- **No pagination needed at typical sizes**: A session with 100 tasks fits in `maxResultSizeChars: 100_000`. The few cases of pathologically large task lists (auto-generated tasks from a plugin) hit truncation, but those are bugs in the producing system.

- **Completed-blocker projection is a major UX win**: Without it, the model would see "task 5 is blocked by 2 and 3" forever, even after 2 completes. With it, "task 5 blocked by [empty]" → claimable. The decision algorithm becomes trivial: scan for tasks with empty blockedBy and empty owner.

- **`_internal` tasks are still in the registry**: They just don't appear in TaskList. TaskGet on an `_internal` ID still returns the task. This is a *display filter*, not access control.

- **Sort by ID makes parallelism deterministic**: When multiple teammates poll TaskList simultaneously, they all see the same order. The "lowest ID first" rule then assigns work deterministically without explicit coordination — agent A and agent B will both pick task #3 only if they both call at the same instant.

- **No `Promise.all` over registry reads**: `Ik(registry)` is a single registry-internal read. The tool doesn't fan out parallel reads per-task. This is intentional: the registry stores tasks in a single in-memory array, so a single fetch is faster than 50 individual gets.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.114 | `_internal` metadata filter introduced. |
| v2.1.117 | Team-mode prompt additions (TaskList recommendations for teammates). |
| v2.1.119 | **Sort by numeric task ID at registry level.** Was insertion-order before. |
| v2.1.121 | Completed-blocker projection: `blockedBy` filters completed task IDs at response time. |
| v2.1.125 | Owner field surfaced in summary (was previously only in TaskGet). |
| v2.1.142 | No changes. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 task tool additions

Key functions in this document:
- `taskListInputSchema` (me_) - Empty schema
- `taskListOutputSchema` (Be_) - Array of summaries
- `taskListTool` (hn7) - Tool definition
- `listAllTasks` (Ik) - Registry enumeration (sorted by ID since v2.1.119)
- `getTaskRegistry` (tE) - Registry accessor
- `TASK_LIST_TOOL_NAME` (BZ) - "TaskList"
