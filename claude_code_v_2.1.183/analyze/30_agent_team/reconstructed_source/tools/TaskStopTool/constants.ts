/**
 * TaskStop tool name constant (v2.1.183).
 *
 * The coordinator's "Stop a running worker" tool. It is NOT a bespoke "StopAgent"
 * tool: the coordinator reuses the generic background-task stopper `TaskStop`,
 * keyed on the `task_id` returned by the Agent tool's launch result. (The tool def
 * `edt = pi({ name: uP, aliases: ["KillShell","KillBash"], … })` lives at
 * cli_inner_pretty.js:424867; only the *reference* is in scope for this unit.)
 *
 * 2.1.183 regions: cli_inner_pretty.js:220834  `var uP = "TaskStop",`
 *   `uP` is referenced in the coordinator prompt (`bvd` @221940) as the `${uP}`
 *   worker-stop tool, and as the TaskStop def's `name:` field @424868.
 * 2.1.88 ancestor: tools/TaskStopTool/prompt.ts (TASK_STOP_TOOL_NAME), cited by
 *   coordinator/coordinatorMode.ts:14 as `${TASK_STOP_TOOL_NAME}` "Stop a running worker".
 * scaffold: 30_agent_team/coordinator_and_background_survival.md §2.6
 *   ("The `${uP}` worker-stop tool = `TaskStop`").
 * cross-val: re-read `var uP = "TaskStop"` @220834 in the 183 bundle; confirmed it is
 *   the coordinator prompt's `${uP}` interpolation and NOT a new tool name.
 */

// 2.1.183: TASK_STOP_TOOL_NAME = uP @cli_inner_pretty.js:220834 ("TaskStop")
/**
 * Canonical name of the TaskStop tool. Used as the coordinator's worker-stop verb
 * (`${uP}` in the coordinator system prompt) and as the tool def `name:` field.
 * Carries the deprecated `aliases: ["KillShell","KillBash"]` from its shell-kill heritage.
 */
export const TASK_STOP_TOOL_NAME = 'TaskStop'

// Mapping: uP→TASK_STOP_TOOL_NAME
