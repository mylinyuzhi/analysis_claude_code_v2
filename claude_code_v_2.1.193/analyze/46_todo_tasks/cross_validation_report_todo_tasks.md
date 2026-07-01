# Todo / Tasks Cross-Validation Report

This report records how the 2.1.193 todo/task analysis was validated. The target bundle is authoritative; older reconstructed docs and named TypeScript are supporting evidence only when they match bundle line reads.

## Sources Checked

- Target bundle: `/lyz/codespace/claude-code-bomb/versions/2.1.193/extract/cli_inner_pretty.js`
- v2.1.183 reconstructed baseline: `claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/TodoWriteTool.ts`
- v2.1.183 reconstructed baseline: `claude_code_v_2.1.183/analyze/04_tools/reconstructed_source/tools/TaskTools.ts`
- Named TypeScript mirror: `/lyz/codespace/3rd/claude-code/src/tools/*Task*Tool`
- Named TypeScript mirror: `/lyz/codespace/3rd/claude-code/src/utils/tasks.ts`
- Named TypeScript mirror: `/lyz/codespace/3rd/claude-code/src/utils/attachments.ts`
- Named TypeScript mirror: `/lyz/codespace/3rd/claude-code/src/hooks/useTasksV2.ts`
- Named TypeScript mirror: `/lyz/codespace/3rd/claude-code/src/components/TaskListV2.tsx`

## Validation Results

### V1/V2 Tool Gate

**What it does:** Confirms that `TodoWrite` and the V2 task tools are mutually exclusive.

**How it works:**
1. The 2.1.193 bundle defines `isTodoV2Enabled` (`ZH`) from `CLAUDE_CODE_ENABLE_TASKS` (`cli_inner_pretty.js:308309-308312`).
2. The built-in registry includes V2 tools only under the `ZH()` conditional (`cli_inner_pretty.js:444143`).
3. `TodoWriteTool.isEnabled` returns the inverse gate (`cli_inner_pretty.js:308835-308837`).
4. Each V2 CRUD tool returns the positive gate from `isEnabled` (`cli_inner_pretty.js:437821`, `cli_inner_pretty.js:437908`, `cli_inner_pretty.js:438086`, `cli_inner_pretty.js:438309`).
5. The v2.1.183 reconstructed tools show the same V1/V2 architecture.

**Why this approach:**
- Direct bundle lines establish target behavior.
- The 183 reconstruction validates that the architecture is carryover rather than a new 193-only interpretation.
- The named source is useful for labels, but the gate claim is made from the 193 bundle.

**Key insight:** The target session exposes one task-management API at a time: legacy checklist or V2 durable task tools.

### Durable V2 Store

**What it does:** Confirms the V2 task list is file-backed, persistent, and protected by locks/high-watermark ids.

**How it works:**
1. `getTaskListId` resolves identity from env/team/session context (`cli_inner_pretty.js:308332-308337`).
2. Paths are sanitized before task directory construction (`cli_inner_pretty.js:308339-308346`).
3. Creation locks the list, chooses the next id using existing ids plus `.highwatermark`, writes one JSON file, and emits a task-updated signal (`cli_inner_pretty.js:308374-308389`, supporting high-watermark code at `cli_inner_pretty.js:308471-308539`).
4. Reads schema-validate task JSON and ignore missing/invalid files (`cli_inner_pretty.js:308391-308405`).
5. Deletes remove the task, update high-watermark state, and clean dependency references in remaining tasks (`cli_inner_pretty.js:308426-308451`).
6. Named `utils/tasks.ts` cross-validates the same store concepts: per-task JSON, `.lock`, `.highwatermark`, task-list id, dependency cleanup.

**Why this approach:**
- Store validation uses both write paths and read/delete cleanup paths, not only the tool wrappers.
- Named-source agreement increases confidence in readable names and hidden intent, but target lines prove the behavior.
- The trade-off is that exact helper names in named TypeScript must not be treated as target names unless indexed from the bundle.

**Key insight:** V2 is a filesystem coordination protocol. The tools are front doors to a durable task directory.

### Prompt And Tool Semantics

**What it does:** Confirms the prompt-level workflow matches the tool implementations.

**How it works:**
1. `TodoWrite` prompt selection, schema, full-list replacement, and all-completed clearing are present in the target bundle (`cli_inner_pretty.js:308599-308854`).
2. `TaskCreate` prompt, input coercion, validation steer, hook rollback, and panel expansion are present (`cli_inner_pretty.js:437657-437845`).
3. `TaskGet` prompt and read-only full-detail result are present (`cli_inner_pretty.js:437854-437948`).
4. `TaskUpdate` prompt and mutation hub behavior are present: missing-task failure, auto-owner claim, metadata merge/null-delete, deletion, completion hook veto, mailbox assignment, dependencies, and post-completion `TaskList` nudge (`cli_inner_pretty.js:438029-438223`).
5. `TaskList` prompt and compact scheduler output are present (`cli_inner_pretty.js:438226-438355`).
6. The v2.1.183 reconstruction and named source match this module split and broad workflow.

**Why this approach:**
- Prompt claims are validated against tool body behavior so instructions and implementation are not analyzed in isolation.
- Coercion and steering are included because they define model-facing behavior even when the nominal schema is strict.

**Key insight:** The V2 prompt suite implements a work-queue workflow: create tasks, inspect the list, fetch details, update status, and repeat.

### Reminders And Rendering

**What it does:** Confirms stale task-management reminders for both V1 and V2.

**How it works:**
1. The attachment pipeline dispatches to V1 or V2 reminder generation based on the V2 gate (`cli_inner_pretty.js:473220-473260`).
2. V1 scans backward for `TodoWrite` and `todo_reminder`, then emits after the 10/10 cadence (`cli_inner_pretty.js:474288-474319`, config at `cli_inner_pretty.js:474653`).
3. V2 scans backward for `TaskCreate` / `TaskUpdate` and `task_reminder`, then emits after the same cadence (`cli_inner_pretty.js:474321-474355`).
4. Reminder rendering names the relevant tools and includes existing todos/tasks when present (`cli_inner_pretty.js:601427-601454`).
5. ToolSearch reminder suppression uses a same-turn predicate to skip with `task_reminder_same_turn` when task reminders already apply (`cli_inner_pretty.js:474405-474411`).
6. Named `utils/attachments.ts` matches the split reminder architecture.

**Why this approach:**
- The evidence covers generation, cadence, data payload, renderer text, and interaction with other reminders.
- This avoids the common mistake of documenting only the renderer and missing the turn-count algorithm.

**Key insight:** Reminders are not generic todo advice. They are gate-aware, cadence-controlled attachments tied to the currently active task API.

### UI And Watcher

**What it does:** Confirms the task panel is a live view over V2 task files, not just tool output.

**How it works:**
1. Mutating tools auto-expand the tasks panel (`cli_inner_pretty.js:437845`, `cli_inner_pretty.js:438130`).
2. The keybinding toggles the same `expandedView` field (`cli_inner_pretty.js:639567-639719`).
3. `TaskListV2ExternalStore` watches the current task directory, subscribes to in-process update signals, debounces refetches, polls while incomplete tasks exist, and hides/resets after all tasks complete (`cli_inner_pretty.js:365294-365385`).
4. `TaskListV2` filters display for V2, computes terminal-height display budget, preserves recent completions for 30 seconds, prioritizes current/actionable tasks under truncation, and summarizes hidden counts (`cli_inner_pretty.js:365045-365176`).
5. `TaskListV2TaskItem` renders status icons, owner visibility, blockers, and activity lines with terminal-width truncation (`cli_inner_pretty.js:365178-365274`).
6. Named `useTasksV2.ts` and `TaskListV2.tsx` match the broad watcher and prioritization algorithms.
7. One numeric boundary is target-specific: the 2.1.193 bundle caps truncated visible tasks at 5 (`cli_inner_pretty.js:365054`), while the named TypeScript mirror caps at 10. The analysis uses the bundle value.

**Why this approach:**
- UI validation includes both data subscription and rendering priority. Either half alone would miss important behavior.
- Named TS is especially helpful here because JSX minification is dense, but bundle lines still anchor the final claims.

**Key insight:** The expanded panel is a synchronized task dashboard. It can reflect task-file changes that did not originate from the current tool call.

### Named-Source Boundary

**What it does:** Separates confirmed 2.1.193 behavior from behavior present only in the named TypeScript tree.

**How it works:**
1. A negative grep against the 2.1.193 bundle found no `verificationNudgeNeeded`, `VERIFICATION_AGENT`, or "closed out 3+ tasks" behavior.
2. The same concepts appear in the named source under todo/task update files.
3. The analysis therefore treats those named-source behaviors as out-of-target for 2.1.193 unless future target-bundle evidence is found.

**Why this approach:**
- Negative evidence protects the report from importing newer/divergent behavior into the 2.1.193 target.
- The named source remains useful for architectural cross-validation where it matches bundle lines.

**Key insight:** Cross-validation does not mean replacement. The bundle wins when named source and target evidence diverge.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Todo / Tasks anchors
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tool execution and runtime task context
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Hooks and platform context
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI/keybinding context

Key functions in this document:
- `isTodoV2Enabled` (`ZH`) - V1/V2 gate.
- `TodoWriteTool` (`tLe`) - legacy checklist surface.
- `TaskCreateTool` (`Ncl`) - create and hook rollback.
- `TaskUpdateTool` (`qcl`) - mutation hub and completion hook veto.
- `TaskListV2` (`hWn`) - expanded task-panel renderer.
- `TaskListV2ExternalStore` (`CVa`) - file-backed UI subscription store.
