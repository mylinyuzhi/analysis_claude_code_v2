# Tool: TaskUpdate — Modify a Task

> **Identity:** wire-name `TaskUpdate`, userFacingName `TaskUpdate`, `isConcurrencySafe: true`, `shouldDefer: true`, `maxResultSizeChars: 100_000`.
> **Source:** `cli_inner_pretty.js:384627-384815` (declaration), `assets/tools/TaskUpdate.md` (tool def).

TaskUpdate mutates an existing task: status transitions, ownership claims, dependency edges, metadata merges, and field edits. It's the most expressive tool in the task suite and handles all post-create modifications.

---

## Overview

TaskUpdate covers four distinct operations:

1. **Status transitions**: `pending` → `in_progress` → `completed`, plus `deleted` (terminal).
2. **Ownership claims**: setting `owner` to claim a task in team workflows.
3. **Dependency edges**: `addBlocks` (this task blocks others) and `addBlockedBy` (others block this).
4. **Field edits**: `subject`, `description`, `activeForm`, `metadata` merge.

All operations are folded into a single tool because they often happen together: claiming a task usually means setting it to `in_progress` with a new owner. Combining avoids a chain of separate calls.

---

## Input Schema (`xe_`)

```javascript
// ============================================
// taskUpdateInputSchema - All updatable fields
// Location: cli_inner_pretty.js:384637-384656 (xe_)
// ============================================

// ORIGINAL (for source lookup):
xe_ = yH(() => {
  let H = TTH().or(y.literal("deleted"));  // status enum + "deleted"
  return y.strictObject({
    taskId: y.string().describe("The ID of the task to update"),
    subject: y.string().optional().describe("New subject for the task"),
    description: y.string().optional().describe("New description for the task"),
    activeForm: y.string().optional().describe('Present continuous form shown in spinner when in_progress (e.g., "Running tests")'),
    status: H.optional().describe("New status for the task"),
    addBlocks: y.array(y.string()).optional().describe("Task IDs that this task blocks"),
    addBlockedBy: y.array(y.string()).optional().describe("Task IDs that block this task"),
    owner: y.string().optional().describe("New owner for the task"),
    metadata: y.record(y.string(), y.unknown()).optional().describe("Metadata keys to merge into the task. Set a key to null to delete it."),
  });
});

// READABLE (for understanding):
taskUpdateInputSchema = lazy(() => {
  const statusEnumWithDeleted = taskStatusEnum().or(z.literal("deleted"));
  return z.strictObject({
    taskId: z.string().describe("Target task ID"),
    subject: z.string().optional(),
    description: z.string().optional(),
    activeForm: z.string().optional(),
    status: statusEnumWithDeleted.optional(),
    addBlocks: z.array(z.string()).optional().describe("IDs this task now blocks"),
    addBlockedBy: z.array(z.string()).optional().describe("IDs that now block this task"),
    owner: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional().describe("Merge keys; null deletes"),
  });
});

// Mapping: xe_→taskUpdateInputSchema, TTH→taskStatusEnum, yH→lazy, y→z
```

**Why `status.or("deleted")`:** The canonical status enum is `["pending", "in_progress", "completed"]`. Adding `deleted` as a fourth status would imply it's a regular state — but `deleted` is terminal/destructive. Modeling it as a separate literal preserves the enum semantics while letting it appear in the status field for ergonomic API use.

**Why `addBlocks` not `blocks`:** The field is additive — it appends to the existing `blocks` array rather than replacing it. The verb prefix (`add`) makes this clear. Removing dependencies requires `metadata`-style nulling (not currently supported).

**Why `metadata` is a merge, not a replace:** Tasks can have many metadata keys; replacing the whole record on each update would lose unrelated keys. The merge semantic with `null = delete` is the standard partial-update pattern.

---

## call() — The Big Switch

The function handles all four operations sequentially. The control flow:

```javascript
// ============================================
// callTaskUpdate - Apply all updates atomically
// Location: cli_inner_pretty.js:384701-384803 (in vn7.call)
// ============================================

// ORIGINAL (for source lookup):
async call({ taskId: H, subject: $, description: q, activeForm: K, status: _, owner: A, addBlocks: z, addBlockedBy: Y, metadata: f }, O, M, w, D) {
  let j = tE();
  D?.({ type: "set_expanded_view", expandedView: "tasks" });
  let J = await Tn(j, H);
  if (!J) return { data: { success: !1, taskId: H, updatedFields: [], error: "Task not found" } };
  let X = [], L = {};
  if ($ !== void 0 && $ !== J.subject) ((L.subject = $), X.push("subject"));
  if (q !== void 0 && q !== J.description) ((L.description = q), X.push("description"));
  if (K !== void 0 && K !== J.activeForm) ((L.activeForm = K), X.push("activeForm"));
  if (A !== void 0 && A !== J.owner) ((L.owner = A), X.push("owner"));
  if (eK() && _ === "in_progress" && A === void 0 && !J.owner) {
    let P = vA();
    if (P) ((L.owner = P), X.push("owner"));
  }
  if (f !== void 0) {
    let P = { ...(J.metadata ?? {}) };
    for (let [Z, W] of Object.entries(f))
      if (W === null) delete P[Z];
      else P[Z] = W;
    ((L.metadata = P), X.push("metadata"));
  }
  if (_ !== void 0) {
    if (_ === "deleted") {
      let P = await a88(j, H);
      return { data: { success: P, taskId: H, updatedFields: P ? ["deleted"] : [], error: P ? void 0 : "Failed to delete task", statusChange: P ? { from: J.status, to: "deleted" } : void 0 } };
    }
    if (_ !== J.status) {
      if (_ === "completed") {
        // Run completion hooks
        let P = [], Z = gkH(H, J.subject, J.description, vA(), q5(), void 0, O?.abortController?.signal, void 0, O);
        for await (let W of Z) if (W.blockingError) P.push(JL$(W.blockingError));
        if (P.length > 0) return { data: { success: !1, taskId: H, updatedFields: [], error: P.join("\n") } };
      }
      ((L.status = _), X.push("status"));
    }
  }
  if (Object.keys(L).length > 0) await d7H(j, H, L);
  if (L.owner && eK()) {
    // Send team notification on owner change
    let P = vA() || "team-lead", Z = JL(), W = SH({ type: "task_assignment", taskId: H, subject: J.subject, description: J.description, assignedBy: P, timestamp: new Date().toISOString() });
    await cA(L.owner, { from: P, text: W, timestamp: new Date().toISOString(), color: Z }, j);
  }
  if (z && z.length > 0) {
    let P = z.filter((Z) => !J.blocks.includes(Z));
    for (let Z of P) await Hw6(j, H, Z);
    if (P.length > 0) X.push("blocks");
  }
  if (Y && Y.length > 0) {
    let P = Y.filter((Z) => !J.blockedBy.includes(Z));
    for (let Z of P) await Hw6(j, Z, H);
    if (P.length > 0) X.push("blockedBy");
  }
  return { data: { success: !0, taskId: H, updatedFields: X, statusChange: L.status !== void 0 ? { from: J.status, to: L.status } : void 0 } };
}

// READABLE (for understanding):
async function callTaskUpdate({ taskId, subject, description, activeForm, status, owner, addBlocks, addBlockedBy, metadata },
                              toolUseContext, _, _msg, onProgress) {
  const registry = getTaskRegistry();
  onProgress?.({ type: "set_expanded_view", expandedView: "tasks" });

  // Step 1: Load current task (404 if missing)
  const current = await getTask(registry, taskId);
  if (!current) {
    return { data: { success: false, taskId, updatedFields: [], error: "Task not found" } };
  }

  const updatedFields = [];
  const patch = {};

  // Step 2: Direct field edits — only record changes (skip no-ops)
  if (subject !== undefined && subject !== current.subject) {
    patch.subject = subject;
    updatedFields.push("subject");
  }
  if (description !== undefined && description !== current.description) {
    patch.description = description;
    updatedFields.push("description");
  }
  if (activeForm !== undefined && activeForm !== current.activeForm) {
    patch.activeForm = activeForm;
    updatedFields.push("activeForm");
  }
  if (owner !== undefined && owner !== current.owner) {
    patch.owner = owner;
    updatedFields.push("owner");
  }

  // Step 3: Implicit owner auto-claim on in_progress transition (team workflows)
  //   If task is becoming in_progress and no owner provided and task has no owner: claim it
  if (isAgentSwarmsEnabled() && status === "in_progress" && owner === undefined && !current.owner) {
    const myName = getMyAgentName();
    if (myName) {
      patch.owner = myName;
      updatedFields.push("owner");
    }
  }

  // Step 4: Metadata merge — set null to delete, else upsert
  if (metadata !== undefined) {
    const merged = { ...(current.metadata ?? {}) };
    for (const [key, val] of Object.entries(metadata)) {
      if (val === null) {
        delete merged[key];
      } else {
        merged[key] = val;
      }
    }
    patch.metadata = merged;
    updatedFields.push("metadata");
  }

  // Step 5: Status change (with deletion shortcut and completion hooks)
  if (status !== undefined) {
    if (status === "deleted") {
      const ok = await deleteTask(registry, taskId);
      return {
        data: {
          success: ok, taskId,
          updatedFields: ok ? ["deleted"] : [],
          error: ok ? undefined : "Failed to delete task",
          statusChange: ok ? { from: current.status, to: "deleted" } : undefined,
        },
      };
    }
    if (status !== current.status) {
      // Run completion hooks for "completed" status
      if (status === "completed") {
        const blockingErrors = [];
        const hookIterator = runTaskCompletionHooks(taskId, current.subject, current.description, getMyAgentName(), getSessionId(), undefined, toolUseContext?.abortController?.signal, undefined, toolUseContext);
        for await (const event of hookIterator) {
          if (event.blockingError) blockingErrors.push(formatBlockingError(event.blockingError));
        }
        if (blockingErrors.length > 0) {
          return { data: { success: false, taskId, updatedFields: [], error: blockingErrors.join("\n") } };
        }
      }
      patch.status = status;
      updatedFields.push("status");
    }
  }

  // Step 6: Apply the patch to the registry
  if (Object.keys(patch).length > 0) {
    await applyPatch(registry, taskId, patch);
  }

  // Step 7: Team notification on owner change
  if (patch.owner && isAgentSwarmsEnabled()) {
    const senderName = getMyAgentName() || "team-lead";
    const senderColor = getMyColor();
    const messageBody = serialize({
      type: "task_assignment",
      taskId,
      subject: current.subject,
      description: current.description,
      assignedBy: senderName,
      timestamp: new Date().toISOString(),
    });
    await sendMessage(patch.owner, {
      from: senderName,
      text: messageBody,
      timestamp: new Date().toISOString(),
      color: senderColor,
    }, registry);
  }

  // Step 8: Apply addBlocks (edges from THIS task to others)
  if (addBlocks?.length > 0) {
    const newEdges = addBlocks.filter(targetId => !current.blocks.includes(targetId));
    for (const targetId of newEdges) {
      await addDependencyEdge(registry, taskId, targetId);
    }
    if (newEdges.length > 0) updatedFields.push("blocks");
  }

  // Step 9: Apply addBlockedBy (edges from others to THIS task)
  if (addBlockedBy?.length > 0) {
    const newEdges = addBlockedBy.filter(sourceId => !current.blockedBy.includes(sourceId));
    for (const sourceId of newEdges) {
      await addDependencyEdge(registry, sourceId, taskId);
    }
    if (newEdges.length > 0) updatedFields.push("blockedBy");
  }

  return {
    data: {
      success: true, taskId, updatedFields,
      statusChange: patch.status !== undefined ? { from: current.status, to: patch.status } : undefined,
    },
  };
}

// Mapping: H→taskId, $→subject, q→description, K→activeForm, _→status, A→owner, z→addBlocks, Y→addBlockedBy, f→metadata,
//          J→current, L→patch, X→updatedFields, P→(varies by block), tE→getTaskRegistry, Tn→getTask, a88→deleteTask,
//          gkH→runTaskCompletionHooks, JL$→formatBlockingError, d7H→applyPatch, eK→isAgentSwarmsEnabled,
//          vA→getMyAgentName, q5→getSessionId, cA→sendMessage, Hw6→addDependencyEdge, JL→getMyColor, SH→serialize
```

### Implicit Owner Auto-Claim (Step 3)

When `status === "in_progress"` and `owner === undefined` and `current.owner` is empty, the tool implicitly sets `owner` to the current agent's name. This is the "claim and start" workflow:

```json
// Without auto-claim, you'd need two calls:
{ "taskId": "5", "owner": "my-name" }
{ "taskId": "5", "status": "in_progress" }

// With auto-claim, one call suffices:
{ "taskId": "5", "status": "in_progress" }
```

**Why only on the in_progress edge:** Other status transitions don't imply ownership. `pending → completed` (a task you didn't claim but finished) shouldn't add you as owner. `completed → in_progress` (reopening) is unusual and shouldn't reassign.

**Why gated on `enableAgentSwarms`:** In solo mode, the "owner" concept doesn't exist — tasks are just todos. Auto-claim would add noise to the data model.

### Completion Hooks (Step 5)

When `status === "completed"`, the tool runs a `runTaskCompletionHooks` iterator. If any hook contributes a `blockingError`, the status change is aborted and the error is returned. Common hook patterns:

- **"No completion without tests"**: a hook that runs `grep -r 'test' src/ | wc -l` and rejects if no tests touch the changed files.
- **"Must have PR link"**: a hook that checks `metadata.prUrl` is set.
- **"Must have approval"**: a hook that checks the user has accepted the work.

The async-generator pattern lets hooks stream observations to the UI (analytics) while still gating the final commit.

### Dependency Edges (Steps 8-9)

`addBlocks: ["3", "4"]` on task `5` means "task 5 blocks tasks 3 and 4". This is the reverse of `addBlockedBy: ["3", "4"]` on task `5` which means "tasks 3 and 4 block task 5".

The implementation only adds edges (no removal). Filter `newEdges` skips duplicates — adding `blocks: ["3"]` twice is idempotent.

Why no edge removal: dependency graphs are typically built once and rarely retracted. Adding the inverse capability would double the API surface for low value. If a dependency is wrong, delete and recreate the task.

---

## Output Schema (`ue_`)

```javascript
// ============================================
// taskUpdateOutputSchema - Result with diff fields
// Location: cli_inner_pretty.js:384657-384665 (ue_)
// ============================================

// ORIGINAL (for source lookup):
ue_ = yH(() => y.object({
  success: y.boolean(),
  taskId: y.string(),
  updatedFields: y.array(y.string()),
  error: y.string().optional(),
  statusChange: y.object({ from: y.string(), to: y.string() }).optional(),
}));

// READABLE (for understanding):
taskUpdateOutputSchema = lazy(() =>
  z.object({
    success: z.boolean(),
    taskId: z.string(),
    updatedFields: z.array(z.string()),       // names of fields actually changed
    error: z.string().optional(),
    statusChange: z.object({                  // when status was edited
      from: z.string(),
      to: z.string(),
    }).optional(),
  }),
);

// Mapping: ue_→taskUpdateOutputSchema
```

**Why `updatedFields` is an array:** The model needs to know which writes succeeded. A call might attempt to update `subject`, `status`, and `metadata` — `updatedFields: ["status", "metadata"]` tells the model that `subject` was unchanged (skipped because it equaled the current value), distinguishing no-op skip from actual error.

**Why `statusChange` is its own field:** Status transitions trigger UI animations (the task moves between sections), trigger team notifications, and gate auto-claim. Surfacing `{from, to}` explicitly lets downstream consumers (UI rendering, hooks) react without re-fetching the task.

---

## mapToolResultToToolResultBlockParam

```javascript
// "Updated task #5 status, metadata"
// + (if completed): "\n\nTask completed. Call TaskList now to find your next available task or see if your work unblocked others."
```

The "call TaskList" nudge appears specifically on `completed` transitions when in team workflow mode (`enableAgentSwarms`). It encourages the model to pick up new work rather than idling after finishing.

---

## Key Insights

- **All fields go through a patch object, applied atomically**: The `d7H(registry, taskId, patch)` write is a single transaction. Either all field changes apply or none do. Partial application is impossible.

- **Owner-change triggers SendMessage**: When a task gets a new owner, the system sends a `task_assignment` message to that owner's inbox. This is how teammate agents discover their new work — they listen for SendMessage events.

- **Status enum has 4 values in input, 3 in storage**: Input accepts `pending`/`in_progress`/`completed`/`deleted`. Storage only stores the first three (deleted = removed). The enum union is the public API; the storage model is simpler.

- **Strict mode rejects `blocks` and `blockedBy`**: Only `addBlocks`/`addBlockedBy` are accepted. The model can't try to set `blocks: []` to clear. Edge removal isn't supported.

- **Concurrency-safe**: TaskUpdate sets `isConcurrencySafe: true`, allowing the agent loop to run multiple TaskUpdate calls in parallel within one turn. The task registry's underlying write is serialized at the registry level, so concurrent updates of *different* tasks are safe. Concurrent updates of the *same* task may both succeed with one winning — but the tool's prompt explicitly tells the model to TaskGet first to read the current state.

---

## v2.1.112 → v2.1.142 Deltas

| Version | Change |
|---------|--------|
| v2.1.114 | `metadata` merge with null-delete semantic introduced. |
| v2.1.117 | Implicit owner auto-claim on `in_progress` transition (team mode). |
| v2.1.118 | `activeForm` field added. |
| v2.1.119 | TaskUpdate triggers TaskList sort refresh (so completed-task suggestion ordering stays consistent). |
| v2.1.121 | Completion hooks via async generator iterator. |
| v2.1.129 | "Call TaskList now" trailer for completed transitions (team mode only). |
| v2.1.136 | `updatedFields` array includes "blocks"/"blockedBy" entries when edges were actually added (not just attempted). |
| v2.1.142 | Schema stable. |

---

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_meta.md](../00_overview/symbol_additions_v2_1_142_tools_meta.md) - v2.1.142 task tool additions

Key functions in this document:
- `taskUpdateInputSchema` (xe_) - All updatable fields
- `taskUpdateOutputSchema` (ue_) - Result with updatedFields + statusChange
- `taskUpdateTool` (vn7) - Tool definition
- `taskStatusEnum` (TTH) - pending/in_progress/completed
- `getTask` (Tn) - Single-task lookup
- `applyPatch` (d7H) - Atomic patch write
- `runTaskCompletionHooks` (gkH) - Completion validators
- `addDependencyEdge` (Hw6) - blocks/blockedBy edge insertion
- `TASK_UPDATE_TOOL_NAME` (P0) - "TaskUpdate"
