# TodoWrite Tool — v2.1.142

## Overview

`TodoWriteTool` (`DMH` in cli_inner_pretty.js:272170) maintains the session's task checklist. The model passes the full updated list each call; the tool stores it in `AppState.todos` keyed by `agentId ?? sessionId`. There are no filesystem or permission side effects. When all tasks are marked completed, the stored list is cleared (so the next call starts fresh). The tool is deferred behind tool-search (`shouldDefer: true`) and disabled when "Todo V2" (a newer in-development model) is active.

## Schema (Zod)

```javascript
// ============================================
// todoWriteInputSchema — TodoWriteTool input parameters
// Location: cli_inner_pretty.js:272163 / wP_() at runtime
// ============================================

// ORIGINAL (for source lookup):
// wP_() returns z.strictObject({ todos: TodoListSchema() })

// READABLE (for understanding):
const todoWriteInputSchema = z.strictObject({
  todos: TodoListSchema().describe('The updated todo list'),
});

// TodoListSchema (defined elsewhere as $dH()):
const TodoSchema = z.object({
  content: z.string().describe('The imperative-form task description (e.g., "Fix authentication bug")'),
  status: z.enum(['pending', 'in_progress', 'completed']),
  activeForm: z.string().describe('The present-continuous label shown while in progress (e.g., "Fixing authentication bug")'),
});
const TodoListSchema = z.array(TodoSchema);

// Mapping: wP_→todoWriteInputSchema, $dH→TodoListSchema
```

Output schema (`DP_()`):
- `oldTodos: TodoList` — the list before the update
- `newTodos: TodoList` — the list after the update (as sent by the model)

`maxResultSizeChars` is **100,000** (effectively unlimited for normal todo lists).

## validateInput

`TodoWriteTool` has no `validateInput` override — the Zod schema validation is the only validation.

## checkPermissions

```javascript
// ============================================
// TodoWriteTool.checkPermissions — always allow
// Location: cli_inner_pretty.js:272197-272199
// ============================================

// ORIGINAL (for source lookup):
async function checkPermissions(H) {
  return { behavior: "allow", updatedInput: H };
}

// READABLE (for understanding):
async function checkPermissions(input) {
  // No permission checks required for todo operations
  return { behavior: 'allow', updatedInput: input };
}

// Mapping: trivial
```

**Why no permission check?** Todo management is purely in-memory state with no filesystem or network side effects. The "tool" is essentially a typed setter on `appState.todos`. There's nothing for a user to allow/deny.

## call

```javascript
// ============================================
// TodoWriteTool.call — replace stored list, clear when all completed
// Location: cli_inner_pretty.js:272203-272212
// ============================================

// ORIGINAL (for source lookup):
// async call({ todos: H }, $) {
//   const q = $.getAppState();
//   const K = $.agentId ?? v$();  // agentId or sessionId
//   const _ = q.todos[K] ?? [];   // old list
//   const z = H.every(Y => Y.status === "completed") ? [] : H;
//   $.setAppState(Y => ({ ...Y, todos: { ...Y.todos, [K]: z } }));
//   return { data: { oldTodos: _, newTodos: H } };
// }

// READABLE (for understanding):
async function call({ todos }, context) {
  const appState = context.getAppState();
  const todoKey = context.agentId ?? getSessionId();
  const oldTodos = appState.todos[todoKey] ?? [];
  const allDone = todos.every(t => t.status === 'completed');
  // Clear when all done — saves transcript/state bytes once the work is finished
  const newTodos = allDone ? [] : todos;

  context.setAppState(prev => ({
    ...prev,
    todos: { ...prev.todos, [todoKey]: newTodos },
  }));

  return { data: { oldTodos, newTodos: todos } };
}

// Mapping: v$→getSessionId
```

### Key algorithm: per-agent + per-session keying

**What it does:** Subagents have their own todo lists, separate from the main thread's.

**How it works:** `todoKey = context.agentId ?? getSessionId()`.
- For the main thread, `agentId` is undefined; the key falls through to the session ID.
- For a subagent (Agent tool invocation), `agentId` is the subagent's UUID; the key is that UUID.

**Why this approach:** Subagents are spawned for sub-tasks (verification, research, refactoring). They have their own multi-step plan that's distinct from the main agent's. Keying by `agentId` lets the subagent maintain its own task list without polluting the main thread's. Each agent's UI shows only that agent's todos.

**Edge case:** When a subagent finishes, its todo list is preserved in `appState.todos[agentId]`. The main thread doesn't see it, but the transcript record persists. There's no cleanup path that removes it — but the lists are tiny, so this is effectively a no-op.

### Key algorithm: auto-clear when all completed

**What it does:** When the model sets every todo to `completed`, the stored list becomes `[]`.

**How it works:** `allDone = todos.every(t => t.status === 'completed') ? [] : todos`.

**Why this approach:** A "completed" list is uninteresting going forward. Clearing it (a) saves bytes in `appState.todos` (which is serialised into the resume state), (b) signals the UI to hide the now-empty list panel, and (c) lets the next planning round start from a clean slate without the model having to send an explicit "clear" call.

**Trade-off:** The `data.newTodos` returned in the tool result still contains the full completed list — the model sees what it just sent so it can verify. The `data.oldTodos` shows the previous state. Only the storage is cleared, not the tool's return data.

### Verification nudge (2.1.x experimental — gated by feature flag)

The TS source for 2.1.88 has additional logic gated behind `feature('VERIFICATION_AGENT')` + `getFeatureValue_CACHED_MAY_BE_STALE('tengu_hive_evidence', false)`:

```javascript
let verificationNudgeNeeded = false;
if (feature('VERIFICATION_AGENT') &&
    getFeatureValue_CACHED_MAY_BE_STALE('tengu_hive_evidence', false) &&
    !context.agentId &&         // main thread only
    allDone &&                  // closing out a list
    todos.length >= 3 &&        // 3+ items
    !todos.some(t => /verif/i.test(t.content))) {  // none was a verification step
  verificationNudgeNeeded = true;
}
```

When triggered, the tool_result appends:
> NOTE: You just closed out 3+ tasks and none of them was a verification step. Before writing your final summary, spawn the verification agent (subagent_type="...").

This **structural nudge** fires at the exact "loop-exit moment" where skips happen. The TodoWrite call is typically the last thing before the main agent's final summary, so adding a verification subagent suggestion here is the right place. Reading the v2.1.142 obfuscated bundle, I do not see this nudge active in the current pretty source — the feature flag may be off in v2.1.142 or rolled into a separate experimental path.

## Render methods

- `renderToolUseMessage` returns `null` — the tool **doesn't render in the transcript**. The current todo list is rendered as a separate sidebar/panel (not as a tool-use entry), keyed off `appState.todos[currentKey]`.
- No `renderToolResultMessage`, `renderToolUseRejectedMessage`, or `renderToolUseErrorMessage` defined.

`mapToolResultToToolResultBlockParam` is uniform — model gets a fixed confirmation:
```
"Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable"
```

(plus the verification nudge string when feature-flagged on).

## Key insights

1. **`userFacingName()` returns the empty string.** This is unusual — most tools render a tool-use chrome row. Empty string means "no chrome", because the todo list has its own dedicated UI surface. The empty-string return is the signal to the renderer to skip the tool-use row entirely.

2. **`shouldDefer: true` + `isEnabled()` gating.** `isEnabled()` returns `!isTodoV2Enabled()` — the tool is disabled when a newer Todo V2 system is active. This lets Anthropic A/B test a replacement without ripping out the old one.

3. **No `getPath`, no `preparePermissionMatcher`.** This tool has no path semantics, so the permission system doesn't know how to match it against `Todo(...)` rules. Combined with the always-allow `checkPermissions`, this means TodoWrite calls never trigger permission UI.

4. **No `extractSearchText`.** The default behaviour is "return tool input/output as string", which would index the todo strings. This is fine — searching transcripts for "fix authentication" should find the todo where the model planned that work.

5. **No `inputsEquivalent`.** Two consecutive TodoWrite calls with identical lists *do* produce separate transcript entries. This is intentional: the model often re-sends the same list to signal a status change (e.g., one item moved from `pending` to `in_progress`).

6. **`oldTodos` is the only thing the renderer needs from the result.** The diff between `oldTodos` and `newTodos` drives the UI animation (item added, item completed, item changed state). The tool sends both so the renderer doesn't have to maintain a separate copy.

7. **Auto-clear on "all completed" preserves the transcript.** The transcript shows the moment-by-moment list updates. After the list clears, the transcript still has the "all done" entry — only `appState.todos[key]` is cleared. Resume from the transcript replays the updates and ends at empty.

8. **`getSessionId()` is the fallback key.** This means even non-main-thread, non-subagent calls (theoretical) would share a single key. In practice, only the main thread + agent invocations call TodoWrite, so the dichotomy is `agentId` (per-agent) vs `sessionId` (main thread).

## v2.1.112 → v2.1.142 deltas

| Version | Change | Where |
|---------|--------|-------|
| 2.1.112 | (no TodoWrite-specific changes baseline) | — |
| 2.1.119 | `TaskList` returning tasks in arbitrary filesystem order — fixed (sort by ID) | `TaskList` is the Task panel; tangential to TodoWrite but related UX |
| 2.1.142 | (no TodoWrite-specific functional changes; `isTodoV2Enabled` may flip in future versions) | — |

The TodoWrite tool has been remarkably stable since 2.1.x baseline. Most "todo" change-log entries refer to the **Task** subsystem (subagent task lists with disk persistence), which is a separate tool (`TaskCreate` / `TaskUpdate` / `TaskList`). TodoWrite is the in-memory planning checklist for a single agent's working scope.

## Related Symbols

> Symbol mappings:
> - [symbol_additions_v2_1_142_tools_filesystem.md](../00_overview/symbol_additions_v2_1_142_tools_filesystem.md) — full mapping table

Key functions in this document:
- `TodoWriteTool` (DMH) — top-level tool object built by `XK`
- `TodoListSchema` ($dH) — `z.array(z.object({ content, status, activeForm }))`
- `getSessionId` (v$) — session-id helper (fallback `todoKey`)
- `isTodoV2Enabled` (nw) — feature flag for the in-development replacement
- `TODO_WRITE_DESCRIPTION` (iO7) — the description string
- `getTodoWritePrompt` (nO7) — the full prompt with usage guidance
- `VERIFICATION_AGENT_TYPE` — subagent type for the verification nudge (when feature-flagged on)
