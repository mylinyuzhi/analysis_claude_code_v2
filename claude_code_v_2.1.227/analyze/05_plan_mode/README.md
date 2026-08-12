# Plan mode architecture in Claude Code 2.1.227

Plan mode is a permission-state transition, a transcript protocol, and an approval boundary. It is not
implemented solely by adding planning instructions to the prompt.

- [`plan_mode_runtime.md`](plan_mode_runtime.md) - entry and exit transitions, filesystem enforcement,
  reminder reconstruction, team approval, optional workshop/prototype routes, and the gated ultraplan
  residue.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `EnterPlanModeTool` (`Vri`) - enters plan mode and snapshots the preceding permission mode.
- `ExitPlanModeTool` (`L9`) - validates the plan, coordinates approval, and restores execution mode.
- `prepareContextForPlanMode` (`iPr`) - converts auto/default permission state into a safe plan context.
- `checkWritePermission` (`CHt`) - enforces the plan-mode write floor.
- `checkSessionFileWriteCarveout` (`cun`) - recognizes the plan/workshop paths and other narrow internal
  exceptions.
- `buildFullPlanModeReminder` (`YmS`) - constructs the complete planning workflow reminder.
- `buildSparsePlanModeReminder` (`XmS`) - reinforces the constraint without repeating the full prompt.
- `scanPlanModeHistory` (`Ywa`) - locates the current plan-mode transcript interval.
- `createPlanModeAttachments` (`m_S`) - chooses full/sparse/reentry attachments.
- `createPlanModeExitAttachment` (`jsf`) - records the transition back to execution.
