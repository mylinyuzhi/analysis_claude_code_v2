# TaskCreated Hook (v2.1.89 — documented)

## Overview

`TaskCreated` is one of three hooks scoped to the Agent Teams subsystem (alongside `TeammateIdle` and `TaskCompleted`). The v2.1.89 changelog calls out: **"Documented `TaskCreated` hook event and its blocking behavior."** The hook had implementation infrastructure in v2.1.88 (`hooks.ts:3745-3773`), but v2.1.89 is the version where the contract was officially exposed — including the **blocking behavior** that lets a hook veto task creation by exiting with code 2.

This hook fires when the runner attempts to insert a new task into the shared task list. The hook input carries the task subject, optional description, and the teammate and team names. If any registered hook blocks (exit 2 OR `{decision:"block"}`), the task creation is aborted and the blocker's message is fed back to the agent as a `TaskCreated hook feedback:` system reminder.

## Related Symbols

> Symbol mappings: see [symbol_index.md](../00_overview/symbol_index.md). New mappings: [symbol_additions_unit_09.md](../00_overview/symbol_additions_unit_09.md).

Key functions and constants:

- `taskCreatedHook` (`e58`) — chunks.192.mjs:2829
- `taskCompletedHook` (`CM6`) — chunks.192.mjs:2848 (counterpart event)
- `teammateIdleHook` (`W38`) — chunks.192.mjs:2814 (third teams hook; included for context)
- `aggregateHookResults` (the streamed reducer) — chunks.193.mjs:1217+
- The match-query switch in `getMatchingHooks` — chunks.193.mjs:548-550 (TaskCreated/TaskCompleted use NO matcher; they always match)

## v2.1.88 Source

```typescript
// ============================================
// executeTaskCreatedHooks - Fire TaskCreated event for shared-task creation (v2.1.88)
// Location: src/utils/hooks.ts:3745-3773
// ============================================

// ORIGINAL (for source lookup):
export async function* executeTaskCreatedHooks(
  taskId: string,
  taskSubject: string,
  taskDescription?: string,
  teammateName?: string,
  teamName?: string,
  permissionMode?: string,
  signal?: AbortSignal,
  timeoutMs: number = TOOL_HOOK_EXECUTION_TIMEOUT_MS,
  toolUseContext?: ToolUseContext,
): AsyncGenerator<AggregatedHookResult> {
  const hookInput: TaskCreatedHookInput = {
    ...createBaseHookInput(permissionMode),
    hook_event_name: 'TaskCreated',
    task_id: taskId,
    task_subject: taskSubject,
    task_description: taskDescription,
    teammate_name: teammateName,
    team_name: teamName,
  }
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID(),
    signal,
    timeoutMs,
    toolUseContext,
  })
}

// READABLE (identical hand-written TS):
// (unchanged)
```

The JSDoc at the function header reads: *"Execute TaskCreated hooks when a task is being created. If a hook blocks (exit code 2), the task creation should be prevented and feedback returned."* This block-with-exit-2 contract is the "blocking behavior" the v2.1.89 changelog documented.

## v2.1.112 Obfuscated Form

```javascript
// ============================================
// taskCreatedHook - TaskCreated event dispatcher (v2.1.112)
// Location: chunks.192.mjs:2829-2846
// ============================================

// ORIGINAL (for source lookup):
async function* e58(q, K, _, z, Y, A, O, w = u_, $) {
    let j = {
        ...J9(A),
        hook_event_name: "TaskCreated",
        task_id: q,
        task_subject: K,
        task_description: _,
        teammate_name: z,
        team_name: Y
    };
    yield* E0({
        hookInput: j,
        toolUseID: qJ7(),
        signal: O,
        timeoutMs: w,
        toolUseContext: $
    })
}

// READABLE (for understanding):
async function* taskCreatedHook(
  taskId, taskSubject, taskDescription, teammateName, teamName,
  permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS,
  toolUseContext,
) {
  const hookInput = {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "TaskCreated",
    task_id: taskId,
    task_subject: taskSubject,
    task_description: taskDescription,
    teammate_name: teammateName,
    team_name: teamName,
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID(),
    signal,
    timeoutMs,
    toolUseContext,
  });
}

// Mapping: e58→taskCreatedHook, q→taskId, K→taskSubject, _→taskDescription,
//          z→teammateName, Y→teamName, A→permissionMode, O→signal, w→timeoutMs, $→toolUseContext,
//          J9→createBaseHookInput, qJ7→randomUUID, E0→executeHooks
```

## Match Query — Always Matches

`TaskCreated` (and `TaskCompleted`, `TeammateIdle`) use **no `matchQuery`**, meaning every registered hook of that event always runs. This is the case statement in the dispatcher:

```javascript
// ============================================
// getMatchingHooks.taskQueryBranch - Empty match for task/team events (always match)
// Location: chunks.193.mjs:547-550
// ============================================

// ORIGINAL (for source lookup):
case "TeammateIdle":
case "TaskCreated":
case "TaskCompleted":
    break;

// READABLE (for understanding):
case "TeammateIdle":
case "TaskCreated":
case "TaskCompleted":
    // No matchQuery — every registered hook of these events fires
    break;

// Mapping: identifier-for-identifier
```

The `break;` falls through with `matchQuery` left as `undefined`, and the downstream filter (`matchQuery ? matchers.filter(...) : matchers`) keeps all matchers. Compare with `PreToolUse`, which sets `matchQuery = hookInput.tool_name` — that lets hook configs use the `matcher` field to scope to specific tools. Task events have no analogous concept (there's no "subset of tasks" to filter by), so the design just runs everything.

## Block Feedback Message

When a `TaskCreated` hook blocks (exit 2 or `{decision:"block"}`), the runner builds a feedback message prefixed with `TaskCreated hook feedback:`:

```javascript
// ============================================
// buildTaskCreatedHookFeedback - Wrap blockingError with TaskCreated prefix
// Location: chunks.193.mjs:631-634
// ============================================

// ORIGINAL (for source lookup):
function m37(q) {
    return `TaskCreated hook feedback:
${q.blockingError}`
}

// READABLE (for understanding):
function buildTaskCreatedHookFeedback(aggregatedResult) {
  return `TaskCreated hook feedback:
${aggregatedResult.blockingError}`;
}

// Mapping: m37→buildTaskCreatedHookFeedback, q→aggregatedResult
// Sibling builders: W97 (TeammateIdle), q38 (TaskCompleted), YJ7 (UserPromptSubmit op blocked)
```

The agent-teams runner that consumes the hook (details in [../30_agent_team/hooks_and_telemetry.md](../30_agent_team/hooks_and_telemetry.md)) reads the aggregator's `blockingError` field, wraps it with this prefix, and feeds it back to the model as a system reminder.

## Hook Input Shape

```typescript
type TaskCreatedHookInput = {
  hook_event_name: "TaskCreated";
  task_id: string;          // Generated UUID for the proposed task
  task_subject: string;     // Title shown in /tasks UI
  task_description?: string;
  teammate_name?: string;   // Who is creating the task
  team_name?: string;
  // Plus base envelope (session_id, cwd, transcript_path, permission_mode, ...)
};
```

## Deep Analysis

### Algorithm: Pre-Creation Veto Pattern

**What it does:** Lets a hook veto the creation of a new shared-task entry before it is persisted to the task list. Common use case: enforce naming conventions (e.g., "all tasks must start with a verb"), check the team's WIP limit, or require linkage to an external ticketing system.

**How it works:**

1. **Trigger.** The runner attempts to create a task (via `TaskTool` or the agent-team mailbox protocol). Before insertion, the runner calls `taskCreatedHook` with the proposed `task_id`, `task_subject`, optional description, and the teammate/team context.
2. **Dispatch.** `taskCreatedHook` builds the envelope and yields per-hook results via `executeHooks`. Multiple hooks may register; their results are aggregated.
3. **Block detection.** Each hook result is checked for `blocked: true` (set by `executeCommandHook` when the hook exits 2 or returns `{decision:"block"}`). Any blocker prevents the task from being inserted.
4. **Feedback to model.** The blocker's `output` (or `reason`) is wrapped with `TaskCreated hook feedback:` and fed back as a system reminder. The model sees this and can revise its plan (e.g., reword the task subject and re-attempt).

**Why this approach:**

- **Why a separate hook (not just PreToolUse)?** Task creation in agent teams happens via *runtime infrastructure*, not always through an explicit tool call. A teammate can be created and trigger the mailbox protocol path, which doesn't run `PreToolUse`. Having a dedicated `TaskCreated` event ensures veto coverage regardless of the creation path.
- **Why no matcher field?** Tasks don't have a discriminator analogous to `tool_name`. Hook authors who want to filter by task subject can do so inside their hook script. Adding a matcher would have required defining a regex protocol over task subjects, which is fragile.
- **Why feed back as a system reminder (not a tool error)?** The runner doesn't know whether the task creation was the result of a tool call or a runtime event. A system reminder is the universal "the system has news for you" channel that works in both cases. The `TaskCreated hook feedback:` prefix signals provenance.

**Key insight:** The TaskCreated hook is a *negotiation* mechanism: the model proposes, the user's hook policy adjudicates, and the model can revise. This is fundamentally different from `PreToolUse` deny (which is terminal — the model has to *not* re-issue the same call). The feedback message lets the model see *why* it was blocked and tactically respond — useful for tasks where the rejection is easily fixable (e.g., a typo, missing prefix, etc.).

### Decision: Why Document This in v2.1.89 Specifically?

The hook existed in v2.1.88 source; the change in v2.1.89 was **doc-only** (no behavior change). The changelog entry "Documented `TaskCreated` hook event and its blocking behavior" suggests:

- The hook was internal/experimental in v2.1.88 — not promoted to the public hook event catalog.
- v2.1.89 promoted it to the documented surface, meaning external users (and plugins) can now rely on it.
- The contract (exit 2 → block, with feedback to model) is now part of the public API.

This is a recurring pattern in Claude Code: internal hooks ship first, then later get documented once the contract is stable. (Compare with `Setup` hook, which appears in the schema but isn't widely advertised.) For users, the practical effect is that v2.1.89 is the version from which `TaskCreated` is safe to depend on.

### Trade-off: Always-Match vs Matcher-Based

**Always-match (current design):**
- Pros: Simple, no syntactic overhead for hook configs.
- Cons: Hook authors must filter inside their script; can be inefficient if 99% of tasks are uninteresting.

**Matcher-based (rejected alternative):**
- Pros: Hooks scope themselves declaratively.
- Cons: Requires a stable identifier on the task (the subject is too freeform), and adds API surface for an unclear use case.

The current design's trade-off is: filter inefficiency is fine because (a) most users don't register `TaskCreated` hooks, and (b) when they do, the filter logic is application-specific and best expressed in the hook's own scripting language.

## Edge Cases & Gotchas

1. **Multiple blockers all run.** If two hooks both block, both reasons are aggregated into the feedback message. This is the same multi-blocker semantics as `PreCompact`.
2. **No `tool_use_id`.** The hook input uses a generated UUID for `tool_use_id` (via `randomUUID()` → `qJ7()`), because there's no originating tool call. Hooks that key off `tool_use_id` should treat it as opaque.
3. **`teammate_name` and `team_name` may be `undefined`.** Tasks created by the leader (not a teammate) have no teammate_name. Hooks should handle the absence.
4. **Sibling events:** `TaskCompleted` has the same signature and dispatch path; the difference is only the `hook_event_name` literal. `TeammateIdle` carries `teammate_name + team_name` only (no task_id/subject/description).
5. **Async hook caveat:** Like all hooks, `TaskCreated` supports async responses (`async: true`). An async response prevents the immediate block-feedback path — the task creation proceeds, and the eventual async result is delivered as a separate system reminder. Users wanting strict pre-creation veto must use sync hooks.
