# Todo / Tasks Reminders And Attachments

This page documents the stale-task reminder attachment system for legacy `TodoWrite` and V2 task tools in 2.1.193. The reminder generator lives in the attachment pipeline, while the renderer turns reminders into meta text for the model.

## Reminder Attachment Pipeline

### V1/V2 Reminder Routing

**What it does:** Chooses whether to run the legacy todo reminder generator or the V2 task reminder generator.

**How it works:**
1. The attachment builder includes a lazy `todo_reminders` producer that dispatches on `isTodoV2Enabled` (`ZH`) (`cli_inner_pretty.js:473220-473260`).
2. If V2 is enabled, the producer calls `buildTaskReminderAttachments` (`Fuf`).
3. If V2 is disabled, it calls `buildTodoReminderAttachments` (`Nuf`).
4. Both producers return attachment objects; rendering happens later in the meta-attachment renderer (`cli_inner_pretty.js:601427-601454`).

**Why this approach:**
- The same attachment slot can nudge whichever task surface is active, preserving the V1/V2 mutual exclusion model.
- Lazy evaluation avoids reading app state or task files until the attachment system is actually building context for a turn.
- The trade-off is that the attachment name remains historically todo-oriented even when it emits V2 `task_reminder` objects.

**Key insight:** Reminder routing mirrors tool routing. The model is nudged toward exactly the task API it can currently call.

### TodoWrite Reminder Cadence

**What it does:** Emits a `todo_reminder` attachment after enough assistant turns have passed without `TodoWrite`.

**How it works:**
1. `countTodoReminderTurns` (`Ouf`) scans messages backward from newest to oldest (`cli_inner_pretty.js:474288-474306`).
2. It skips assistant thinking messages so hidden reasoning does not count as user-visible progress.
3. It records the first backward `TodoWrite` tool use and the first backward `todo_reminder` attachment.
4. Until the last `TodoWrite` is found, it increments `turnsSinceLastTodoWrite`; until the last reminder is found, it increments `turnsSinceLastReminder`.
5. `buildTodoReminderAttachments` (`Nuf`) exits early when `TodoWrite` is unavailable, brief/send-message mode is active, there are no messages, or reminders are globally off (`cli_inner_pretty.js:474308-474313`).
6. It emits a reminder only when both counters reach the shared 10/10 reminder cadence: 10 turns since write and 10 turns since reminder (`cli_inner_pretty.js:474314`, config at `cli_inner_pretty.js:474653`).
7. The reminder carries the current session todo list from app state under `agentId ?? sessionId` (`cli_inner_pretty.js:474315-474317`).

**Why this approach:**
- A backward scan avoids storing extra counters in app state and naturally survives compaction-style message slicing as long as relevant recent events remain.
- Requiring both thresholds prevents reminder spam immediately after a previous reminder.
- Reading the current app-state todo list lets the reminder ask the model to clean stale entries, not just create new ones.
- The trade-off is approximation: if the event that reset the counter is outside the retained message window, cadence can become less precise.

**Key insight:** The reminder is intentionally gentle. It appears only after both "no recent write" and "no recent reminder" are true.

### V2 Task Reminder Cadence

**What it does:** Emits a `task_reminder` attachment after enough assistant turns have passed without mutating the V2 task list.

**How it works:**
1. `countTaskReminderTurns` (`Buf`) scans messages backward and looks for `TaskCreate` or `TaskUpdate` tool uses (`cli_inner_pretty.js:474321-474342`).
2. It does not treat `TaskGet` or `TaskList` as management. Read-only inspection does not refresh the mutation obligation.
3. It separately tracks the last `task_reminder` attachment.
4. `buildTaskReminderAttachments` (`Fuf`) exits unless V2 is enabled, brief/send-message mode is absent, `TaskUpdate` is available, there are messages, and reminders are not globally off (`cli_inner_pretty.js:474344-474350`).
5. It uses the same 10-turn / 10-turn threshold config as `TodoWrite` (`cli_inner_pretty.js:474350-474353`, config at `cli_inner_pretty.js:474653`).
6. When due, it reads the durable task list with `listTasks(getTaskListId())` and emits `task_reminder` with the current file-backed tasks (`cli_inner_pretty.js:474351-474353`).

**Why this approach:**
- Counting only mutating tools keeps the reminder tied to progress bookkeeping, not passive viewing.
- Requiring `TaskUpdate` avoids a broken reminder that tells the model to update tasks when the update tool is unavailable.
- Reading from the file-backed store makes the reminder reflect teammate or cross-process changes.
- The trade-off is that a model that repeatedly calls `TaskList` but never updates status will still be reminded.

**Key insight:** V2 reminder cadence tracks task management, not task awareness.

### Reminder Rendering

**What it does:** Converts reminder attachment objects into model-visible meta text.

**How it works:**
1. `todo_reminder` renders a message saying `TodoWrite` has not been used recently and should be considered only if relevant (`cli_inner_pretty.js:601427-601437`).
2. If existing todos are present, it appends numbered lines in `[status] content` form.
3. `task_reminder` first checks V2 is still enabled; if not, it renders nothing (`cli_inner_pretty.js:601441-601442`).
4. The V2 renderer names `TaskCreate` for adding tasks and `TaskUpdate` for setting `in_progress` / `completed` status (`cli_inner_pretty.js:601443-601454`).
5. If existing tasks are present, it appends `#id. [status] subject` lines.
6. Both reminder texts explicitly say to ignore the reminder when it is not applicable.

**Why this approach:**
- The renderer names the exact tools the model should use, reducing ambiguity in a turn where many tools may be available.
- Including current state makes the reminder actionable for cleanup and status correction.
- The V2 recheck prevents stale `task_reminder` attachments from surfacing after a gate change.

**Key insight:** Rendering is where the attachment becomes behavioral guidance. The stored attachment is data; the renderer turns it into a low-pressure instruction.

### ToolSearch Same-Turn Suppression

**What it does:** Prevents the ToolSearch usage reminder from being shown in the same turn as a todo/task reminder.

**How it works:**
1. The ToolSearch reminder generator receives an async predicate and calls it before delivery (`cli_inner_pretty.js:474405-474411`).
2. If that predicate reports that task reminders are already present, ToolSearch emits skip telemetry with reason `task_reminder_same_turn`.
3. The task reminder remains the chosen guidance for that turn.

**Why this approach:**
- Task progress guidance is more immediately relevant during long coding work than general tool discovery.
- Suppressing same-turn guidance reduces competing meta-instructions.
- The trade-off is delayed ToolSearch education, but only on turns where task tracking already needs attention.

**Key insight:** Attachment reminders are prioritized. The system avoids stacking multiple nudges that could distract the model from the main task.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Todo / Tasks reminder anchors
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Message and tool-use flow
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Attachment and platform support
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - UI rendering context

Key functions in this document:
- `countTodoReminderTurns` (`Ouf`) - backward scan for `TodoWrite` and `todo_reminder`.
- `buildTodoReminderAttachments` (`Nuf`) - legacy reminder generator.
- `countTaskReminderTurns` (`Buf`) - backward scan for `TaskCreate` / `TaskUpdate` and `task_reminder`.
- `buildTaskReminderAttachments` (`Fuf`) - V2 reminder generator.
- `reminderCadenceConfig` (`n6t`) - shared 10-turn write/reminder cadence.
