# Permission architecture in Claude Code 2.1.227

The permission subsystem combines provenance-aware rules, tool-owned safety checks, permission modes,
PreToolUse hooks, noninteractive fallbacks, shell static analysis, and an optional model classifier.

- [`permission_engine_and_auto_mode.md`](permission_engine_and_auto_mode.md) - rule precedence, mode
  overlays, hook arbitration, Bash/PowerShell analysis, auto-mode scheduling and fallback, and the
  2.1.221–2.1.227 hardening boundary.

Plan-specific file enforcement is cross-referenced in
[`../05_plan_mode/`](../05_plan_mode/README.md), while sandbox enforcement is owned by
[`../49_sandbox/`](../49_sandbox/README.md).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `applyPermissionUpdate` (`UH`) - immutable context reducer for modes, rules, and directories.
- `effectiveModeForTool` (`hrt`) - session/MCP-specific mode overlay.
- `checkRuleBasedPermissions` (`JHt`) - deterministic deny/ask/safety floor.
- `evaluateToolPermission` (`yK_`) - mode and allow-rule decision before prompting/classification.
- `decideToolPermission` (`fK_`) - auto-mode and noninteractive coordinator.
- `arbitratePreToolHook` (`VSn`) - reconciles hook output with rules and safety checks.
- `checkBashPermissions` (`EV_`) - shell parser, subcommand aggregation, and safety analysis.
- `classifyAutoModeAction` (`Iqt`) - staged permission-classifier call and fallback.
- `AutoModeClassifierQueue` (`G4d`) - per-agent serialization and queue metadata.
