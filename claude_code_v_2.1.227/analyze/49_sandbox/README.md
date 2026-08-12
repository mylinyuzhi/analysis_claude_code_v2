# Sandbox

This module analyzes the complete 2.1.227 sandbox endpoint:

- [`sandbox_runtime.md`](sandbox_runtime.md) - trust-aware configuration merging, relaxed filesystem
  semantics, network decisions, proxy ordering, Linux/macOS/Windows enforcement compilers, lifecycle, and
  command-correlated violation reporting.
- [`credential_masking_and_sigv4.md`](credential_masking_and_sigv4.md) - sentinel substitution, selective
  extraction, JWT claim masking, fail-open/fail-closed no-match policy, and AWS request re-signing.

## Related Symbols

> Symbol mappings:
> - [symbol_index_core_execution.md](../00_overview/symbol_index_core_execution.md) - Core execution
> - [symbol_index_core_features.md](../00_overview/symbol_index_core_features.md) - Core features
> - [symbol_index_infra_platform.md](../00_overview/symbol_index_infra_platform.md) - Platform infrastructure
> - [symbol_index_infra_integration.md](../00_overview/symbol_index_infra_integration.md) - Integrations

Key functions in this module:
- `buildSandboxRuntimeConfig` (`w_r`) - merges settings under restrictive trust rules.
- `initializeSandboxRuntime` (`D5y`) - starts common network and platform enforcement.
- `compileLinuxMountPlan` (`d5y`) - preserves deny/mask ordering in bubblewrap.
- `wrapSandboxCommandArgv` (`K5y`) - compiles per-command platform launch arguments.
- `ensureSandboxInitialized` (`KGu`) - enforces required-versus-optional startup failure policy.
- `maskCredentialFiles` (`G1u`) - creates sentinel copies and bind-mount plans.
- `maskCredentialEnvironment` (`V1u`) - replaces full or selected environment values.
- `planAwsSigV4Repair` (`Z1u`) - denies unsupported shapes or re-signs supported requests.
