# Background agents

This module analyzes the complete 2.1.227 background runtime rather than treating 2.1.220 as the
implementation reference. Start with [`background_runtime.md`](background_runtime.md) for durable job
state, daemon election and worker recovery, worktree ownership, interactive-to-background handoff,
resume-time orphan classification, and agents-view result accounting.

The focused 2.1.221-2.1.227 reports then isolate policy changes without replacing that current-runtime
analysis. [`scheduling_policy_2_1_227.md`](scheduling_policy_2_1_227.md) covers the generated Agent-tool
scheduling contract.

The background-session system prompt also changes how ephemeral work is preserved and handed off. See
[`work_preservation_policy.md`](work_preservation_policy.md).

The interactive agents entry path now applies the standard directory trust boundary before it mounts the
view. See [`agents_workspace_trust.md`](agents_workspace_trust.md).

The cumulative 200-subagent gate was removed without removing nesting, concurrency, budget, or topology
controls. See [`subagent_lifetime_cap_removal.md`](subagent_lifetime_cap_removal.md).

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key current-runtime anchors:
- `readJobState` (`Vl`) and `writeJobState` (`rg`) - Durable per-job state.
- `adoptRosterOrphans` (`w9d`) - Cross-store recovery.
- `readVerifiedDaemonLock` (`xU`) and `runBackgroundDaemon` (`EVh`) - Supervisor ownership.
- `DaemonRegistryWorker` (`D4i`) - Worker lifecycle and crash backoff.
- `reconcileOrphanedAgentsOnResume` (`EGv`) - Resume-time notification truthfulness.

The generated prompt policy remains anchored to `buildBackgroundSessionPrompt` (`VQb`), the agents-view
trust bootstrap to `ensureAgentsWorkspaceTrust` (`xuH`), and resource boundaries to
`getMaxSubagentSpawnDepth` (`v6`) and `getMaxConcurrentSubagents` (`V7u`).
