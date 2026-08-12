# 46_todo_tasks — Todo and task tracking

This module re-derives the complete 2.1.220 task-tracking scope from the 2.1.227 bundle. It covers the
legacy `TodoWrite` replacement-list contract, the four persistent Task tools, task-list identity,
locking and dependency rules, reminder attachments, fork preservation, agent-name cleanup, and the
bundle-wide `tengu_dead_probe_*` family first catalogued by the 2.1.220 report.

The principal architectural change after 2.1.220 is not a model-facing feature: the persistent task
store now supports both the original per-task JSON directory and a keyed Storage V5 backend. The new
backend adds conditional creation, optimistic atomic updates, a narrowly bounded retry for suspected
lock loss, monotonic ID preservation, and bounded parallel copying when a conversation is forked. The
tool schemas, input-recovery rules, completion hooks, dependency semantics, and 10-turn reminder
cadence otherwise remain recognizably continuous with 2.1.220 and the readable 2.1.88 source.

The dead-code census changed much more dramatically. The 2.1.220 bundle contained 25 unique
`tengu_dead_probe_*` event names at 32 emission sites; 2.1.227 contains nine names at nine sites. Only
`tengu_dead_probe_tool_alias_exec` occurs in both sets: 24 old probes disappeared and eight new probes
were introduced. This is a rolling compatibility-census program, not merely nine survivors from the
old campaign. Removal of an event is not proof that its old branch was unreachable, because production
telemetry results and intermediate bundles are not available.

## Documents

- [task_store_tools_and_reminders.md](task_store_tools_and_reminders.md) — deep analysis of the V1/V2
  tool split, dual persistence backends, atomic allocation/update/claim algorithms, dependency
  maintenance, hook rollback, reminders, fork carry, and registry reconciliation.
- [dead_probe_retirement_and_compatibility.md](dead_probe_retirement_and_compatibility.md) — the
  surviving nine-probe census, latch and payload design, legacy-path semantics, and the limits of what
  can be inferred from the 25-to-9 reduction.

## Version findings

| Version | Finding | Evidence |
|---|---|---|
| 2.1.220 baseline | Filesystem-only task storage, model kill switch, fork carry, registry reconciliation, and 25-name dead-probe campaign | `2.1.220:324797-325084`, `403922-403931`, `448602-448616`, `808777-808801`; 32 probe emissions |
| 2.1.227 | Task storage has a keyed Storage V5 path with conditional create and atomic update | `cli_inner_pretty.js:340052-340380` |
| 2.1.227 | Reset rechecks that every task is complete while holding the list lock | `cli_inner_pretty.js:340090-340137`, caller `649341-649344` |
| 2.1.227 | Fork carry supports both backends and copies Storage V5 tasks with bounded concurrency | `cli_inner_pretty.js:901540-901609`, call `901720-901728` |
| retained | V1/V2 exclusion, model kill switch, coercion, hooks, dependencies, and reminders remain | `cli_inner_pretty.js:554597-554606`, `554819-554870`, `558482-559210`, `593395-593465` |
| refactored | Probe family moves from 25 names / 32 sites to nine names / nine sites; one name overlaps, 24 disappear, and eight are new | exact event-name set comparison in both bundles |

No supplied 2.1.221–2.1.227 changelog bullet directly names the task-store refactor or the probe
retirement. They are therefore reported as verified bundle deltas, not assigned to a specific
intermediate release. The 2.1.225 VS Code Focus-view fix affects how the latest task list is folded;
its renderer/state-boundary analysis belongs to `48_accessibility_ui`, while this module defines the
task data and reminder contracts that the renderer consumes.

## Scope and confidence

Task control flow is **Verified** in the 2.1.227 bundle and **Cross-checked** against the 2.1.220
filesystem implementation and readable 2.1.88 `src/utils/tasks.ts` / `src/utils/attachments.ts`.
Intermediate-release attribution is **Inferred** only where noted because no 2.1.221–2.1.226 bundles
were supplied. Probe retirement conclusions are deliberately bounded: source presence is known;
production event counts are not.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `createTask` (`lGd`) - allocates a monotonic task id and writes through either persistence backend.
- `atomicUpdateStoredTask` (`F8s`) - Storage V5 compare-and-update loop with narrow transient retry.
- `claimTask` (`fGd`) - owner, completion, and blocker arbitration.
- `coerceTaskCreateInput` (`BYp`) - bounded repair of common model-generated input shapes.
- `TaskUpdateTool` (`ZYp`) - update, delete, completion-hook, assignment, and dependency coordinator.
- `buildTaskReminderAttachments` (`F_S`) - inactivity-based persistent-task reminder scheduler.
- `carryTaskListToFork` (`sGv`) - backend-aware preservation of a private session task list.
- `pruneAgentNameRegistry` (`t5o`) - removes names whose runtime agents are no longer meaningful.
