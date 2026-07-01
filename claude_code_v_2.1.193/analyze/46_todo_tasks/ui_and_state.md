# Todo / Tasks UI And State

This page documents the V1 and V2 task UI surfaces, how each surface updates over multiple turns, and the display algorithm used by `TaskListV2` in the 2.1.193 bundle.

## UI State Flow

### V1 Todo UI Surface

**What it does:** Shows legacy `TodoWrite` progress through app-state todos and task-summary/status surfaces, without using the V2 expanded task panel.

**How it works:**
1. `TodoWriteTool.call` replaces `appState.todos[agentId ?? sessionId]` with the submitted full todo list, or stores an empty list when every todo is completed (`cli_inner_pretty.js:308834-308841`).
2. The main REPL reads the current session todo list from `todos[sessionId]` (`cli_inner_pretty.js:688029`).
3. `mapTodoItemsForTaskSummary` (`Boc`) converts each todo into a normalized task-summary item with `kind: "todo"`, a stable content-derived id, a label from `activeForm` while `in_progress`, and synthetic start/done timestamps derived from status (`cli_inner_pretty.js:620030-620038`).
4. The REPL combines runtime background tasks, V1 todos, and V2 tasks into one status-summary item list, hashes it with `taskSummaryItemsKey` (`M8t`), and publishes it through `setTaskSummaryState` (`z_l`) (`cli_inner_pretty.js:688030-688035`, helpers at `cli_inner_pretty.js:464295-464315`).
5. On resume, `restoreSessionStateFromTranscript` (`DJt`) restores V1 todos only when V2 is disabled. It scans backward for the latest `TodoWrite` tool use with `extractLastTodoWriteTodos` (`GQf`) and writes those todos back into app state (`cli_inner_pretty.js:641542-641581`).

**Why this approach:**
- V1 is a lightweight checklist, so the UI can be derived directly from app state instead of a watcher-backed external store.
- Content-derived ids are enough because V1 has no durable task ids. The trade-off is that renaming a todo changes its summary id.
- Restore-from-transcript preserves V1 continuity across resumed sessions without adding a separate persistent todo database.
- V1 does not auto-emit `set_expanded_view`; it updates summary/status surfaces rather than driving the V2 task panel.

**Key insight:** V1 UI is projection-based. The model replaces the checklist, and the UI derives compact status metadata from the current app-state array.

### V2 Task UI Surface

**What it does:** Shows structured task progress through a live expanded panel, spinner text, footer hints, and task-summary/status metadata backed by durable task files.

**How it works:**
1. `TaskCreate` writes one task JSON file, then emits `set_expanded_view: "tasks"` after hooks accept creation (`cli_inner_pretty.js:437823-437845`).
2. `TaskUpdate` emits the same expanded-view hint before reading/updating the task, so status changes bring the panel into view even when the target task is missing or later rejected (`cli_inner_pretty.js:438117-438134`).
3. The tool-result message processor forwards `set_expanded_view` to the UI callback (`cli_inner_pretty.js:600945-600947`), and the message/event type explicitly allows this internal panel hint (`cli_inner_pretty.js:700442-700447`).
4. The app-state reducer handles `set_expanded_view` by writing `expandedView` (`cli_inner_pretty.js:382383`), while the global keybinding can toggle the same field manually (`cli_inner_pretty.js:639567-639719`).
5. `useTasksV2Snapshot` (`HWt`) and `TaskListV2ExternalStore` (`CVa`) read the task directory, watch file changes, poll while incomplete tasks exist, and emit new snapshots when meaningful task fields change (`cli_inner_pretty.js:365294-365370`).
6. The spinner uses the first non-pending/non-completed V2 task's `activeForm` or `subject` as the leader verb and displays the next pending task as a `Next: ...` hint when the expanded task panel is not shown (`cli_inner_pretty.js:366452-366568`).
7. `mapTaskV2ItemsForTaskSummary` (`Foc`) converts V2 tasks into the same status-summary item shape as V1 todos, using durable `task.id` instead of a content hash (`cli_inner_pretty.js:620040-620048`).

**Why this approach:**
- Durable files are the source of truth, so UI refresh has to work even when a different process or teammate changes the list.
- Auto-expansion reduces the gap between model action and user-visible progress.
- Reusing the same task-summary item shape lets V1 todos, V2 tasks, background shells, and agents contribute to one status channel.
- The trade-off is more moving parts: tool events, app state, filesystem watchers, polling, and derived summaries all cooperate.

**Key insight:** V2 UI is store-backed. Tool calls initiate changes, but the panel renders from the file store, not from the tool result alone.

### Task Panel Expansion

**What it does:** Opens or toggles the expanded task panel when task state changes or the user invokes the global todo/tasks toggle.

**How it works:**
1. `TaskCreate` emits `{ type: "set_expanded_view", expandedView: "tasks" }` after successful creation and hook acceptance (`cli_inner_pretty.js:437845`).
2. `TaskUpdate` emits the same event before reading the task to update (`cli_inner_pretty.js:438130`).
3. The global keybinding handler records `tengu_toggle_todos`, emits `todo_toggle_panel`, and applies `toggleTodosPanel` (`gQf`) (`cli_inner_pretty.js:639567-639719`).
4. `toggleTodosPanel` flips app state between `expandedView: "tasks"` and `expandedView: "none"` (`cli_inner_pretty.js:639717-639719`).
5. Persisted UI compatibility maps `expandedView === "tasks"` to the older `showExpandedTodos` / spinner-tree state shape (`cli_inner_pretty.js:612878-612882`).

**Why this approach:**
- Mutating task tools make their effects visible immediately without requiring the assistant to describe the panel in prose.
- The keybinding keeps manual control in the same state field as tool-driven expansion.
- The compatibility mapping preserves older preference/state names while using the newer `expandedView` enum internally.

**Key insight:** Tool calls and user keybindings converge on one UI state field: `expandedView`.

### Multi-Turn Update Flow

**What it does:** Explains how task UI state changes across several assistant turns rather than one isolated tool call.

**How it works:**
1. **Turn N, create/replace:** V1 `TodoWrite` replaces the whole checklist in app state; V2 `TaskCreate` appends a durable task file and auto-expands the task panel.
2. **Between turns:** V1 state exists only in the current app-state todo map; V2 state exists on disk and is refreshed by the external store's watcher/polling loop.
3. **Turn N+1, progress:** V1 progress requires another full `TodoWrite` call with changed statuses. V2 progress uses `TaskUpdate` for one task id, optionally changing status, owner, metadata, and dependencies.
4. **UI refresh:** V1 refresh happens through normal app-state subscription and derived task-summary metadata. V2 refresh happens through both the explicit expanded-view event and the file-store snapshot update.
5. **Resume:** V1 can reconstruct the last todo list from transcript only when V2 is disabled. V2 does not need transcript reconstruction for task contents because the task JSON files remain the source of truth.
6. **Completion:** V1 clears the stored checklist when every todo is completed. V2 keeps completed tasks visible briefly through `TaskListV2`, then the external store hides/resets the panel after all tasks remain completed.

**Why this approach:**
- V1 optimizes for simple single-session progress display with minimal state machinery.
- V2 optimizes for durable, collaborative, multi-turn coordination where ids, dependencies, and ownership matter.
- The trade-off is that V1 is easier to reason about but weaker under resume/collaboration, while V2 is more robust but requires more UI synchronization.

**Key insight:** The two UIs differ because the two data models differ. V1 is "latest checklist snapshot"; V2 is "persistent work queue."

### Task Store Subscription

**What it does:** Keeps the UI task panel synchronized with the durable file-backed task list.

**How it works:**
1. `useTasksV2Snapshot` (`HWt`) enables the store only when V2 tasks are enabled, the UI is not in a suppressed environment, and the teammate context is compatible (`cli_inner_pretty.js:365367-365370`).
2. It exposes the store through `useSyncExternalStore`, so React renders from a stable snapshot API (`cli_inner_pretty.js:365370`).
3. `TaskListV2ExternalStore` (`CVa`) starts watching only when subscribers exist, and tears down watchers/timers when the last subscriber unsubscribes (`cli_inner_pretty.js:365307-365314`, `cli_inner_pretty.js:365357-365362`).
4. The store watches the task directory for the current `getTaskListId()` and debounces filesystem-triggered refetches (`cli_inner_pretty.js:365319-365329`, `cli_inner_pretty.js:365331-365334`).
5. Each refetch reads non-internal tasks, compares meaningful task fields, and emits only when the snapshot changed (`cli_inner_pretty.js:365334-365341`, comparison at `cli_inner_pretty.js:365387-365404`).
6. If any task is incomplete, it keeps polling on a timer in addition to file watching (`cli_inner_pretty.js:365342-365343`).
7. If all tasks are completed, it schedules a delayed reset; after the delay it clears the task list directory and hides the panel (`cli_inner_pretty.js:365339-365350`).
8. `useVisibleTasksV2` (`IVa`) collapses `expandedView` back to `none` when the store snapshot becomes unavailable (`cli_inner_pretty.js:365372-365385`).

**Why this approach:**
- `useSyncExternalStore` is the right shape for a filesystem-backed source that changes outside React.
- Watcher-plus-polling covers both ordinary file events and missed/coalesced filesystem notifications.
- Delayed all-complete cleanup lets the user see completion briefly, then prevents the panel from becoming a permanent archive.
- The trade-off is timer complexity, but it avoids rendering stale or empty task panels across long-running sessions.

**Key insight:** The task panel is not driven by tool result text. It is a live view over the same durable task files that the tools mutate.

## Display Algorithm

### TaskListV2 Truncation And Ordering

**What it does:** Chooses which tasks to show when terminal height is limited and summarizes hidden work.

**How it works:**
1. `TaskListV2` (`hWn`) returns nothing when V2 is disabled or the task list is empty (`cli_inner_pretty.js:365045-365075`).
2. It computes a display budget from terminal rows: zero truncation budget when rows are at most 10, otherwise `min(5, max(3, rows - 14))` (`cli_inner_pretty.js:365054`).
3. It tracks newly completed task ids in a ref-backed timestamp map so recent completions stay visible for `RECENT_COMPLETED_TASK_TTL_MS` (`AVa`, 30000 ms) (`cli_inner_pretty.js:365053-365070`, `cli_inner_pretty.js:365279`).
4. When truncation is needed, it separates completed tasks into recent and older completed buckets (`cli_inner_pretty.js:365102-365109`).
5. It sorts recent completed, older completed, and in-progress tasks by numeric id with lexical fallback (`cli_inner_pretty.js:365039-365043`, `cli_inner_pretty.js:365110-365111`).
6. Pending tasks are sorted with unblocked tasks before blocked tasks, then by id (`cli_inner_pretty.js:365112-365119`).
7. The final priority order is recent completed, in progress, pending, then older completed (`cli_inner_pretty.js:365120-365121`).
8. Hidden tasks are summarized as counts by in-progress, pending, and completed status (`cli_inner_pretty.js:365123-365132`).

**Why this approach:**
- Recent completions are kept visible so completed work does not disappear the instant it resolves.
- In-progress work is prioritized because it is the current execution state.
- Unblocked pending work is shown ahead of blocked pending work because it is actionable.
- Older completed work is least important in a constrained panel.
- The trade-off is that the display order can differ from raw id order under truncation, but the reordered list better answers "what matters now?"

**Key insight:** The UI is a scheduler display, not a chronological log. It spends scarce terminal rows on current, actionable, or just-completed work.

### Task Row Rendering

**What it does:** Renders a compact row for one task with status icon, subject, optional owner, blockers, and activity.

**How it works:**
1. `TaskListV2TaskItem` (`aUp`) maps status to icon/color: completed uses a tick/success color, in-progress uses a filled square/Claude color, pending uses an empty square (`cli_inner_pretty.js:365178-365187`).
2. Completed tasks are struck through; completed or blocked tasks are dimmed; in-progress subjects are bold (`cli_inner_pretty.js:365218-365226`).
3. Owner display appears only when the terminal has at least 60 columns, the task has an owner, and that owner is active (`cli_inner_pretty.js:365198-365204`, `cli_inner_pretty.js:365228-365239`).
4. Blockers are shown only for open blockers, sorted numerically and rendered as `#id` references (`cli_inner_pretty.js:365241-365248`, `cli_inner_pretty.js:365270-365274`).
5. Activity text appears only for in-progress, unblocked tasks with a known active owner activity (`cli_inner_pretty.js:365198`, `cli_inner_pretty.js:365257-365263`).
6. Subject and activity strings are truncated against terminal width so they fit the row (`cli_inner_pretty.js:365203-365212`).

**Why this approach:**
- The row gives priority to status and subject, then conditionally adds owner/activity only when the terminal can support it.
- Blocked tasks are visually quiet and include the minimum dependency reference needed to understand why.
- Activity is intentionally suppressed for blocked tasks because active work should not be implied when the task cannot proceed.

**Key insight:** The renderer is responsive to terminal constraints. It degrades from a teammate-aware activity view to a compact status/subject list.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Todo / Tasks UI and state anchors
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Tool call and app-state context
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform state and telemetry context
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI/keybinding integration context

Key functions in this document:
- `mapTodoItemsForTaskSummary` (`Boc`) - converts V1 app-state todos into task-summary items.
- `mapTaskV2ItemsForTaskSummary` (`Foc`) - converts V2 durable tasks into task-summary items.
- `taskSummaryItemsKey` (`M8t`) - stable hash key for task-summary item changes.
- `setTaskSummaryState` (`z_l`) - publishes derived task-summary state.
- `restoreSessionStateFromTranscript` (`DJt`) - restores V1 todos from transcript when V2 is disabled.
- `extractLastTodoWriteTodos` (`GQf`) - parses the last `TodoWrite` tool input from transcript messages.
- `TaskListV2` (`hWn`) - terminal task-panel renderer and truncation algorithm.
- `TaskListV2TaskItem` (`aUp`) - one-row task renderer.
- `TaskListV2ExternalStore` (`CVa`) - watcher/polling store backing the panel.
- `useTasksV2Snapshot` (`HWt`) - gated `useSyncExternalStore` bridge.
- `useVisibleTasksV2` (`IVa`) - hides the panel when the V2 task snapshot is unavailable.
- `toggleTodosPanel` (`gQf`) - toggles `expandedView` between `"tasks"` and `"none"`.
- `RECENT_COMPLETED_TASK_TTL_MS` (`AVa`) - 30-second recent-completion display window.
