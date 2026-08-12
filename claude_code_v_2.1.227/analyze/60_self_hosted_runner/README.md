# Self-hosted runner execution and operator tools

2.1.227 adds the `claude self-hosted-runner` supervisor and nine typed `self_hosted_runner_*` operator
tools. Both surfaces are absent from the 2.1.220 baseline and have no readable 2.1.88 source counterpart.

- [`runner_command_lifecycle.md`](runner_command_lifecycle.md) covers pre-registration filesystem
  validation, control-plane registration, capacity-aware polling, child isolation, retirement, and drain.
- [`operator_tool_suite.md`](operator_tool_suite.md) covers the diagnostic and administrative tool suite.

The suite contains:

- Four OAuth admin reads: pool aggregates, runners, queued/assigned sessions, and secret metadata.
- Three local reads: `/healthz`, Prometheus `/metrics`, and a secret-redacted log tail.
- Two mutations: spawn a detached local runner and requeue a session away from an observed runner.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infra
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `selfHostedRunnerMain` (`dhH`) - validates, registers, and supervises the runner.
- `ensureRunnerBaseDirWritable` (`mKh`) - prevents registration with an unusable checkout root.
- `runRunnerPollLoop` (`EYh`) - reconciles capacity, assignments, leases, and drain state.
- `selfHostedRunnerApiRequest` (`U8e`) - OAuth-authenticated admin request helper.
- `parseRunnerPrometheusGauges` (`iaS`) - metric projection and aggregation.
- `spawnLocalRunnerTool` (`P7p`) - detached proof runner.
- `tailRunnerLogTool` (`B7p`) - bounded-by-request tail plus shared redaction.
- `requeueRunnerSessionTool` (`R7p`) - consent-gated server mutation.
